/**
 * GM operations (docs/VTT-DESIGN.md §8). A player's action goes to the active GM as
 * a query; the GM checks it, runs it through the engine, posts the card and saves.
 * The Storyteller's own buttons (farmer's turn, new game, undo, end) run locally.
 */
import { QUERY, OPS, CARD } from "../contracts.mjs";
import { GG } from "../config.mjs";
import * as G from "../logic/game.mjs";
import * as store from "./store.mjs";
import { foundryIO } from "./io.mjs";
import { actionCard, farmerCard, endCard, setupCard, markUndone } from "./cards.mjs";
import { buildGame } from "./setup.mjs";
import { syncBoard } from "./board.mjs";

const VERB = { sneak: "sneaking", hunker: "hunkering down", prank: "pulling a prank", rescue: "gobbling for a friend", scram: "scramming", letItOut: "letting it out" };
const tname = id => GG.turkeys.find(t => t.id === id)?.name ?? id;

/** May this user act for this turkey? Its player, or the GM. */
export function mayAct(S, user, turkeyId) {
  if (!S || !user) return false;
  if (user.isGM) return true;
  return S.seats?.[turkeyId]?.userId === user.id;
}

/* ---------------------------------------------------- GM-side handlers -- */

async function opAct({ userId, turkeyId, intent, pre }) {
  return store.commit(`${tname(turkeyId)} is ${VERB[intent?.kind] ?? "busy"}…`, async S => {
    if (!S) throw new Error("no game is running");
    const user = game.users.get(userId);
    if (!mayAct(S, user, turkeyId)) throw new Error(`${user?.name ?? "someone"} can't act for ${tname(turkeyId)}`);
    const no = G.whyNot(S, G.turkey(S, turkeyId), intent);
    if (no) throw new Error(`${tname(turkeyId)} can't do that now (${no})`);
    const io = foundryIO({ S, acting: turkeyId, pre });
    await G.act(S, io, turkeyId, intent);
    if (S.over) G.finish(S);
    return { state: S, after: async s => { await actionCard(s, turkeyId, io.events); if (s.over) await endCard(s); } };
  });
}

async function opFarmer() {
  return store.commit(`${"The farmer"} is on the move…`, async S => {
    if (!S) throw new Error("no game is running");
    if (S.over || S.phase !== "turkeys") throw new Error("it isn't time for the farmer's turn");
    const io = foundryIO({ S });
    await G.farmerPhase(S, io);
    return { state: S, after: async s => { await farmerCard(s, io.events); if (s.over) await endCard(s); } };
  });
}

async function opNewGame(config) {
  const S = await store.replace("Setting up the farm…", () => buildGame(config));
  await setupCard(S);
  return S;
}

async function opUndo() {
  const r = await store.undo();
  if (r) await markUndone(r.state.id, r.undoneAfter);
  return r?.state ?? null;
}

const HANDLERS = {
  [OPS.act]: opAct,
  [OPS.farmer]: opFarmer,
  [OPS.newGame]: opNewGame,
  [OPS.undo]: opUndo,
  [OPS.endGame]: () => store.clear()
};
const GM_ONLY = new Set([OPS.farmer, OPS.newGame, OPS.undo, OPS.endGame]);

/** The query handler on the GM's client. Data carries the asking user's id. */
export async function handleOp(data) {
  if (!store.isActiveGM()) throw new Error("not the active GM");
  const fn = HANDLERS[data?.op];
  if (!fn) throw new Error(`unknown operation ${data?.op}`);
  if (GM_ONLY.has(data.op) && !game.users.get(data.userId)?.isGM) throw new Error("only the Storyteller can do that");
  const out = await fn(data);
  return { ok: true, seq: out?.state?.seq ?? out?.seq ?? null };
}

/* -------------------------------------------------------- any client -- */

/** Run an operation: locally on the active GM, otherwise as a query to the GM. */
export async function request(op, data = {}) {
  const payload = { op, userId: game.user.id, ...data };
  try {
    if (store.isActiveGM()) return await handleOp(payload);
    const gm = game.users.activeGM;
    if (!gm) { ui.notifications.warn(game.i18n.localize("GG.Notify.noGM")); return null; }
    return await gm.query(QUERY, payload, { timeout: 10 * 60 * 1000 });
  } catch (err) {
    console.error(err);
    ui.notifications.error(err?.message ?? String(err));
    return null;
  }
}

/** Every save: move the board (GM only). */
export function installBoardSync() {
  store.onSaved(async S => { if (S?.sceneId) await syncBoard(S); });
}

export const QUERIES = { [QUERY]: handleOp };
export { CARD };
