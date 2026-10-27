/**
 * The engine's io in Foundry (docs/VTT-DESIGN.md §1, §3), on the active GM's client.
 *
 *   dice / d6  → real Foundry rolls (Dice So Nice shows them if it's installed)
 *   ask        → a prompt to the turkey's player (User#query), with a timeout and a
 *                rules-correct default (module/logic/defaults.mjs)
 *   emit       → collected for the chat card
 *
 * The acting turkey's Puff Up and Lend a Wing come from the action dialog (`pre`), so
 * a player is never asked twice about their own roll.
 */
import { SYSTEM_ID, SETTINGS, PROMPT_QUERY, ASK } from "../contracts.mjs";
import { GG } from "../config.mjs";
import * as R from "../logic/rules.mjs";
import { canHelp, sneakTarget } from "../logic/game.mjs";
import { defaultAnswer, greatSteps } from "../logic/defaults.mjs";
import { scramOptions, openSpots } from "../logic/game.mjs";
import { showPrompt } from "../apps/prompts.mjs";

const COLORS = {
  white: { background: "#fffaf0", foreground: "#3b1c0a", edge: "#fffaf0", outline: "#3b1c0a" },
  red: { background: "#b3261e", foreground: "#fffaf0", edge: "#b3261e", outline: "#3b1c0a" },
  helper: { background: "#8a5a2b", foreground: "#fffaf0", edge: "#8a5a2b", outline: "#3b1c0a" },
  farm: { background: "#5b2e12", foreground: "#f6c35c", edge: "#5b2e12", outline: "#f6c35c" }
};

/** Roll n d6 with Foundry's dice. Returns the faces and the Roll (for Dice So Nice). */
async function rollD6(n, kind) {
  if (n <= 0) return { faces: [], roll: null };
  const roll = new Roll(`${n}d6`);
  await roll.evaluate();
  const term = roll.dice?.[0];
  if (term) term.options = { ...(term.options ?? {}), appearance: { ...COLORS[kind], colorset: `gg-${kind}` }, flavor: kind };
  return { faces: term.results.map(r => r.result), roll };
}

async function show3d(rolls) {
  if (!game.dice3d) return;
  await Promise.all(rolls.filter(Boolean).map(r => game.dice3d.showForRoll(r, game.user, true).catch(() => {})));
}

const timeout = () => Number(game.settings.get(SYSTEM_ID, SETTINGS.promptTimeout) ?? 30);

/** The user who plays a turkey and is online: its player, or the Storyteller for a turkey with no player (null if nobody is). */
export function playerOf(S, turkeyId) {
  const uid = S.seats?.[turkeyId]?.userId;
  const u = uid ? game.users.get(uid) : game.users.activeGM;
  return u?.active ? u : null;
}

/** Ask a user a question; null when they don't answer in time (or can't be reached). */
async function promptUser(user, payload) {
  const secs = timeout();
  try {
    if (user.id === game.user.id) return await showPrompt(payload, secs);
    const ms = secs > 0 ? (secs + 5) * 1000 : undefined;
    return await user.query(PROMPT_QUERY, { payload, timeout: secs }, ms ? { timeout: ms } : {});
  } catch (err) {
    console.warn(`${SYSTEM_ID} | no answer from ${user.name}:`, err?.message ?? err);
    return null;
  }
}

const name = id => GG.turkeys.find(t => t.id === id)?.name ?? id;

/**
 * Build the io for one engine call. `acting` is the turkey taking an action (its
 * own roll's Puff Up / Wing come from `pre`); `events` collects what happened.
 */
export function foundryIO({ S, acting = null, pre = null } = {}) {
  const events = [];
  let preUsed = false;
  let stash = null;   // the Wing chosen together with Puff Up, for the engine's next "helper" question
  const showFarmer = () => !!game.settings.get(SYSTEM_ID, SETTINGS.showFarmerDice);

  const io = {
    events,
    async dice({ white, red, helper, turkey }) {
      if (turkey === acting) preUsed = true;
      const w = await rollD6(white, "white");
      const r = await rollD6(red ?? 0, "red");
      const h = helper ? await rollD6(1, "helper") : { faces: [null], roll: null };
      await show3d([w.roll, r.roll, h.roll]);
      return { white: w.faces, red: red === null ? [] : r.faces, helper: helper ? h.faces[0] : null };
    },
    async d6(why) {
      const d = await rollD6(1, "farm");
      if (showFarmer() || why === "hiccups") await show3d([d.roll]);
      return d.faces[0];
    },
    async ask(kind, d) {
      const def = defaultAnswer(kind, d);
      const t = d.t;
      // The acting turkey's own roll: answered by the action dialog.
      if (pre && t?.id === acting && !preUsed && (kind === ASK.push || kind === ASK.helper)) {
        return kind === ASK.push ? !!pre.push : (pre.helper ?? null);
      }
      if (kind === ASK.helper && stash && stash.turkey === t.id && stash.kind === d.kind) {
        const h = stash.helper; stash = null;
        return h;
      }
      const user = t ? playerOf(d.S, t.id) : null;
      const payload = describe(kind, d);
      if (!payload) return def;          // no real choice to make
      if (!user) return def;             // nobody to ask
      const ans = await promptUser(user, payload);
      if (ans === null || ans === undefined) return def;
      if (kind === ASK.push || (kind === ASK.helper && payload.kind === "roll")) {
        const helper = ans.helper && payload.helpers.some(h => h.id === ans.helper) ? ans.helper : null;
        if (kind === ASK.helper) return helper;
        stash = { turkey: t.id, kind: d.kind, helper };
        return !!ans.push && payload.canPush;
      }
      return ans;
    },
    emit(e) { events.push(e); }
  };
  return io;
}

/** The prompt for one engine question (JSON for the wire), or null if there's nothing to choose. */
function describe(kind, d) {
  const { S, t } = d;
  const farm = S.farm;
  switch (kind) {
    case ASK.push:
    case ASK.helper: {
      const helpers = S.turkeys.filter(o => canHelp(S, t, o)).map(o => ({ id: o.id, name: o.name, urge: o.urge }));
      const canPush = kind === ASK.push && R.canPush(t.urge);
      if (!canPush && !helpers.length) return null;
      return { kind: "roll", turkey: t.id, name: t.name, rollKind: d.kind, target: d.target, urge: t.urge, canPush, helpers };
    }
    case ASK.feather:
      return { kind: "feather", turkey: t.id, name: t.name, why: d.why, left: S.feathers, farmerHere: !S.farmer.indoors && S.farmer.zone === t.zone };
    case ASK.spot: {
      const spots = (d.free ?? openSpots(S, t, d.zone)).map(s => ({ i: s.i, name: s.name, cover: s.cover, room: s.room, used: s.used }));
      if (spots.length <= 1) return null;
      return { kind: "spot", turkey: t.id, name: t.name, zone: d.zone, zoneName: farm.zones[d.zone].name, spots };
    }
    case ASK.greatStep: {
      const zones = greatSteps(S, t).map(z => ({ id: z, name: farm.zones[z].name }));
      if (!zones.length) return null;
      return { kind: "greatStep", turkey: t.id, name: t.name, from: farm.zones[t.zone].name, zones };
    }
    case ASK.scramStep: {
      const zones = scramOptions(S, d.from).map(z => ({ id: z, name: farm.zones[z].name }));
      if (!zones.length || (!d.second && zones.length === 1)) return null;
      return { kind: "scramStep", turkey: t.id, name: t.name, second: !!d.second, zones };
    }
    default: return null;
  }
}

export { name as turkeyName, sneakTarget };
