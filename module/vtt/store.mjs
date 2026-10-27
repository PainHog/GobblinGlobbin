/**
 * The game state store (docs/VTT-DESIGN.md §1–2).
 *
 * The state is plain JSON in the world setting `game`. Only the active GM writes
 * it, through one promise queue, so one action runs at a time. Before every change
 * the previous state goes on the undo stack (the last 20). Every client reads the
 * state with getState() and re-renders on HOOKS.stateChanged.
 */
import { SYSTEM_ID, SETTINGS, HOOKS, SOCKET } from "../contracts.mjs";
import * as G from "../logic/game.mjs";
import { IDLE } from "./settings.mjs";

const UNDO_DEPTH = 20;
const clone = v => JSON.parse(JSON.stringify(v));

/** The current game, hydrated (a fresh copy every call), or null when none is running. */
export function getState() {
  const raw = game.settings.get(SYSTEM_ID, SETTINGS.game);
  if (!raw?.farmId || raw.phase === "idle") return null;
  return G.hydrate(clone(raw));
}

/** True on exactly one client: the active GM's. */
export function isActiveGM() {
  if (!game.user?.isGM) return false;
  const gm = game.users.activeGM;
  return !gm || gm.id === game.user.id;
}

/* ------------------------------------------------------------ busy -- */

let busyLabel = null;
export const busy = () => busyLabel;

/** Tell every client what the GM is doing ("Pip is sneaking…"), or that it's done (null). */
export function setBusy(label) {
  busyLabel = label;
  Hooks.callAll(HOOKS.busy, label);
  try { game.socket?.emit(SOCKET, { type: "busy", label }); } catch { /* offline */ }
}

/** Other clients hear the GM's busy messages over the socket. */
export function listenBusy() {
  game.socket?.on(SOCKET, data => {
    if (data?.type !== "busy") return;
    busyLabel = data.label ?? null;
    Hooks.callAll(HOOKS.busy, busyLabel);
  });
}

/* ----------------------------------------------------------- queue -- */

let chain = Promise.resolve();
function enqueue(fn) {
  const run = chain.then(fn, fn);
  chain = run.catch(() => {});
  return run;
}

/** Board sync and other after-save work, set by the wiring (module/gobble-gobbled.mjs). */
const afterSave = [];
export const onSaved = fn => afterSave.push(fn);

async function write(S) {
  S.seq = (S.seq ?? 0) + 1;
  await game.settings.set(SYSTEM_ID, SETTINGS.game, clone(S));
  for (const fn of afterSave) await fn(S);
}

async function pushUndo(raw) {
  const { stack = [] } = game.settings.get(SYSTEM_ID, SETTINGS.undo) ?? {};
  stack.push(raw);
  while (stack.length > UNDO_DEPTH) stack.shift();
  await game.settings.set(SYSTEM_ID, SETTINGS.undo, { stack });
}

/**
 * Change the game (active GM only): `mutate(S)` gets a hydrated copy, may await
 * prompts and dice, and its changes are saved when it returns. If it throws,
 * nothing is saved. It may return `{ after(S) }`, run once the new state is saved
 * (S.seq is then final: chat cards are posted there). Returns what `mutate` returns.
 */
export function commit(label, mutate, { undoable = true } = {}) {
  if (!isActiveGM()) throw new Error("only the active GM changes the game");
  return enqueue(async () => {
    const raw = game.settings.get(SYSTEM_ID, SETTINGS.game);
    const S = raw?.farmId ? G.hydrate(clone(raw)) : null;
    setBusy(label);
    try {
      const out = await mutate(S);
      const next = out?.state ?? S;
      if (undoable && raw?.farmId) await pushUndo(raw);
      if (next) await write(next);
      if (out?.after) await out.after(next);
      return out;
    } finally {
      setBusy(null);
    }
  });
}

/** Start a brand-new game state (clears the undo stack). */
export function replace(label, make) {
  if (!isActiveGM()) throw new Error("only the active GM changes the game");
  return enqueue(async () => {
    setBusy(label);
    try {
      const S = await make();
      await game.settings.set(SYSTEM_ID, SETTINGS.undo, { stack: [] });
      await write(S);
      return S;
    } finally { setBusy(null); }
  });
}

/** Undo the last change. Returns the restored state, or null if there's nothing to undo. */
export function undo() {
  if (!isActiveGM()) throw new Error("only the active GM changes the game");
  return enqueue(async () => {
    const { stack = [] } = game.settings.get(SYSTEM_ID, SETTINGS.undo) ?? {};
    const prev = stack.pop();
    if (!prev) return null;
    await game.settings.set(SYSTEM_ID, SETTINGS.undo, { stack });
    const S = G.hydrate(clone(prev));
    const undoneAfter = S.seq;
    S.seq = (game.settings.get(SYSTEM_ID, SETTINGS.game)?.seq ?? S.seq);   // keep counting up
    await write(S);
    return { state: S, undoneAfter };
  });
}

/** End the game and clear the board state (no undo). */
export function clear() {
  if (!isActiveGM()) throw new Error("only the active GM changes the game");
  return enqueue(async () => {
    await game.settings.set(SYSTEM_ID, SETTINGS.undo, { stack: [] });
    await game.settings.set(SYSTEM_ID, SETTINGS.game, { ...IDLE });
  });
}

export const canUndo = () => (game.settings.get(SYSTEM_ID, SETTINGS.undo)?.stack ?? []).length > 0;
