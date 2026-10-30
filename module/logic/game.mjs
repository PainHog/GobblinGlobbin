/**
 * DON'T GET GOBBLE GOBBLED — the game engine (Foundry-free).
 *
 * Plays the game strictly by the rulebook (book/src/chapters/, rulings in
 * book/REVIEW.md); rule citations are in the comments. The simulator (sim/) and the
 * Foundry system (module/vtt/) both run this one engine, so 126,000 simulated games
 * and the table play the same rules.
 *
 * The state `S` is plain JSON (it lives in a Foundry world setting). `hydrate(S)`
 * attaches the farm data, path map and difficulty as non-enumerable properties.
 * Everything random and every choice comes through `io`:
 *   io.dice({ white, red, helper }) → { white: [..], red: [..], helper: n|null }
 *   io.d6(why)                     → 1–6
 *   io.ask(kind, data)             → answer (kinds in contracts ASK; data holds live objects)
 *   io.emit(event)                 → nothing (what happened, for chat cards and logs)
 * Any of them may return a promise. The order of dice requests is part of the
 * contract: the simulator's seeded games depend on it (test/game-parity.test.mjs).
 */
import { GG } from "../config.mjs";
import * as R from "./rules.mjs";

const KNACK_FOR = { prank: "busyBeak", sneak: "softSteps", noisy: "softSteps", hide: "still", sniff: "still", rescue: "bigGobble", scram: "quickFeet" };

/* --------------------------------------------------------------- state -- */

/** Attach the non-JSON context (farm data, paths, difficulty) to a state. Idempotent. */
export function hydrate(S) {
  if (Object.prototype.hasOwnProperty.call(S, "farm")) return S;
  const farm = GG.farms[S.farmId];
  if (!farm) throw new Error(`unknown farm ${S.farmId}`);
  const hidden = { farm, adj: R.neighbors(farm), diff: GG.difficulty[S.difficulty], _io: null };
  for (const [k, v] of Object.entries(hidden)) Object.defineProperty(S, k, { value: v, writable: true, enumerable: false, configurable: true });
  return S;
}

/**
 * A new game (Ch 8 "Setting Up"). `opts` are test and simulator switches:
 * { clockShift, startUrge, featherShift, events }.
 */
export function newGame({ farmId = "bramble", difficulty = "standard", roster, opts = {} }) {
  const farm = GG.farms[farmId];
  if (!farm) throw new Error(`unknown farm ${farmId}`);
  if (!GG.difficulty[difficulty]) throw new Error(`unknown difficulty ${difficulty}`);
  if (!Array.isArray(roster) || roster.length < GG.flock.min || roster.length > GG.flock.max) throw new Error(`a flock is ${GG.flock.min} to ${GG.flock.max} turkeys`);
  const diff = GG.difficulty[difficulty];
  const clock = R.clockStart(difficulty, roster.length, farm) + (opts.clockShift ?? 0);
  const feathers = R.startingFeathers(difficulty, roster.length) + (opts.featherShift ?? 0);
  const S = {
    v: 1, farmId, difficulty, opts: { events: opts.events !== false },
    phase: "setup", clock, clockStart: clock,
    round: 0, actionSeq: 0, ctx: null,
    turkeys: roster.map(id => {
      const def = GG.turkeys.find(t => t.id === id);
      if (!def) throw new Error(`unknown turkey ${id}`);
      return { ...def, zone: farm.start.turkeys, spot: 0, spotted: false, spottedWhy: null, urge: opts.startUrge ?? GG.urge.start,
        acted: false, helped: false, lastRise: null, lastHunker: null, rescued: null };
    }),
    farmer: { zone: farm.start.farmer, indoors: true, searchAll: false, noMove: false, hurry: false, detours: [] },
    dog: diff.dog ? { zone: farm.start.dog } : null,
    kids: Array.from({ length: R.kidsFor(roster.length) }, () => ({ zone: farm.start.farmer })),
    heard: {}, heardSeq: 0, heardSpots: {},
    feathers, featherStart: feathers,
    progress: Object.fromEntries(farm.pranks.map(p => [p.id, 0])),
    done: {}, decoy: false,
    preRoute: null, poses: null,
    over: false, result: null, cause: null, gobbled: null,
    stats: newStats()
  };
  S.stats.feathersStart = feathers;
  return hydrate(S);
}

function newStats() {
  return {
    rounds: 0, spotted: 0, spottedBy: { open: 0, search: 0, sneak: 0, gobble: 0, rescue: 0, hunker: 0 },
    rescueTries: 0, rescueWins: 0, scramTries: 0, scramWins: 0, savedFromSpotted: 0, spottedGames: 0,
    gobbles: { roll: 0, full: 0, letItOut: 0, rescue: 0, helper: 0 },
    pushes: 0, helps: 0, barks: 0, feathersSpent: 0, feathersStart: 0, searches: 0, heardChases: 0,
    rolls: {}, pranks: {}, prankClock: 0, decoyUsed: 0, clutch: false, events: [], actions: {}, maxUrgeSeen: 0, urgeSum: 0, urgeN: 0
  };
}

/* ------------------------------------------------------------ helpers -- */
export const tags = (S, zone) => S.farm.zones[zone].tags;
export const spotsOf = (S, zone) => S.farm.zones[zone].spots;
export const dist = (S, a, b) => R.distancesFrom(S.farm, a, S.adj)[b];
export const occupants = (S, zone, spot) => S.turkeys.filter(t => t.zone === zone && t.spot === spot);
export const turkey = (S, id) => S.turkeys.find(t => t.id === id) ?? null;

/** The farmer is in this zone and outdoors (Ch 7: he spends the first round indoors). */
export const farmerIn = (S, zone) => !S.farmer.indoors && S.farmer.zone === zone;

/** The number on a turkey's card (Ch 7 breaks ties with it). */
export const cardNo = t => GG.turkeys.findIndex(d => d.id === t.id);

/** "Huh?" token key for a spot (insertion order matters, so never a bare number). */
export const spotKey = spot => (spot === null || spot === undefined ? "o" : `s${spot}`);
export const keySpot = key => (key === "o" ? null : Number(key.slice(1)));

const emit = (S, e) => { if (S._io?.emit) S._io.emit({ round: S.round, ...e }); };
const who = t => t?.id ?? null;

function placeHeard(S, zone, spot = null) {
  S.heard[zone] = ++S.heardSeq;
  (S.heardSpots[zone] ??= {})[spotKey(spot)] = S.heardSeq;
  emit(S, { t: "heard", zone, spot, seq: S.heardSeq });
}

/** Ch 4 "When the Urge Rises": +1, at most once per action or farmer's turn; past 5 is a gobble. */
function rise(S, t, key, why = null) {
  if (t.lastRise === key) return;
  t.lastRise = key;
  const before = t.urge;
  const r = R.riseUrge(t.urge);
  t.urge = r.urge;
  S.stats.maxUrgeSeen = Math.max(S.stats.maxUrgeSeen, t.urge);
  emit(S, { t: "urge", turkey: t.id, from: before, to: r.gobble ? GG.urge.max + 1 : t.urge, why });
  if (r.gobble) gobble(S, t, "full", key);
}

function lower(S, t, by, why) {
  const before = t.urge;
  t.urge = R.lowerUrge(t.urge, by);
  if (t.urge !== before) emit(S, { t: "urge", turkey: t.id, from: before, to: t.urge, why });
}

/**
 * Ch 4 "Gobbling": the urge drops to 0; if the farmer is in your zone you're
 * Spotted, otherwise a "Huh?" token goes on your spot. Jumpy turkeys get jumpier.
 */
function gobble(S, t, kind, key) {
  S.stats.gobbles[kind]++;
  t.urge = 0;
  emit(S, { t: "gobble", turkey: t.id, kind });
  if (farmerIn(S, t.zone)) spot(S, t, "gobble");
  else placeHeard(S, t.zone, t.spot);
  for (const o of S.turkeys) if (o !== t && o.quirk === "jumpy") rise(S, o, key, "jumpy");
}

function spot(S, t, why) {
  if (t.spotted) return;
  t.spotted = true;
  t.spottedWhy = why;
  S.stats.spotted++;
  emit(S, { t: "spotted", turkey: t.id, why });
  // Worrywart: part of whatever caused the spotting (one thing, one rise).
  for (const o of S.turkeys) if (o !== t && o.quirk === "worrywart" && !o.spotted) rise(S, o, S.ctx, "worrywart");
  S.stats.spottedBy[why]++;
}

function unspot(S, t, why) {
  if (!t.spotted) return;
  t.spotted = false;
  emit(S, { t: "unspotted", turkey: t.id, why });
}

/** Ch 3: roll white (action) and red (urge) dice, with boosts. Returns the reading. */
async function roll(S, t, kind, target, { red = true, pushOK = true } = {}) {
  const io = S._io;
  let boosts = 0;
  if (GG.knacks[t.knack] && KNACK_FOR[kind] === t.knack) boosts++;
  // Puff Up: raise the urge by 1 before rolling, for +1 white die (not at the maximum).
  if (pushOK && red && R.canPush(t.urge) && boosts < GG.roll.maxWhite - 1 && await io.ask("push", { S, t, kind, target })) {
    const before = t.urge;
    t.urge += 1; boosts++; S.stats.pushes++;
    S.stats.maxUrgeSeen = Math.max(S.stats.maxUrgeSeen, t.urge);
    emit(S, { t: "urge", turkey: t.id, from: before, to: t.urge, why: "puffUp" });
  }
  let helper = null;
  if (boosts < GG.roll.maxWhite - 1) {
    const h = await io.ask("helper", { S, t, kind, target });
    helper = h ? (typeof h === "string" ? turkey(S, h) : h) : null;
    if (helper && !canHelp(S, t, helper)) helper = null;
    if (helper) { boosts++; helper.helped = true; S.stats.helps++; }
  }
  // Still as a Stump: red dice don't count when staying hidden.
  const redCount = red && !(t.knack === "still" && (kind === "hide" || kind === "sniff")) ? t.urge : null;
  const d = await io.dice({ white: R.whiteDice(boosts), red: redCount, helper: !!helper, turkey: t.id, kind, target, helperId: who(helper) });
  const res = R.readRoll({ white: d.white, red: d.red ?? [], helperRed: helper ? d.helper : null, target });
  const r = (S.stats.rolls[kind] ??= { n: 0, ok: 0, great: 0, gobble: 0 });
  r.n++; if (res.success) r.ok++; if (res.great) r.great++; if (res.gobble) r.gobble++;
  emit(S, { t: "roll", turkey: t.id, kind, target, white: d.white, red: d.red ?? [], helper: who(helper), helperDie: helper ? d.helper : null,
    best: res.best, success: res.success, great: res.great, gobble: res.gobble, helperGobble: res.helperGobble });
  return { res, helper };
}

/** Lend a Wing (Ch 3): a friend in the same zone, not Spotted, once per round. */
export function canHelp(S, t, o) {
  return !!o && o !== t && !o.helped && !o.spotted && o.zone === t.zone;
}

async function spendFeather(S, t, why) {
  if (S.feathers > 0 && await S._io.ask("feather", { S, t, why })) {
    S.feathers--; S.stats.feathersSpent++;
    emit(S, { t: "feather", turkey: t.id, why, left: S.feathers });
    return true;
  }
  return false;
}

/** After a roll's result is applied (result first), resolve the gobbles it caused. */
async function afterRoll(S, t, { res, helper }, key) {
  // Show-off: a pose struck during the farmer's search goes down after he clears his tokens.
  if (res.great && t.quirk === "showOff") {
    emit(S, { t: "pose", turkey: t.id });
    if (S.poses) S.poses.push([t.zone, t.spot]); else placeHeard(S, t.zone, t.spot);
  }
  if (helper && t.quirk === "chatterbox") rise(S, t, key, "chatterbox");
  // Ch 4 "Feathers": spend one to swallow a gobble from the dice (yours or a helper's).
  if (res.gobble && await spendFeather(S, t, "roll")) res.gobble = false;
  if (helper && res.helperGobble && await spendFeather(S, helper, "helper")) res.helperGobble = false;
  if (res.gobble) gobble(S, t, "roll", key);
  if (helper) {
    if (res.helperGobble) gobble(S, helper, "helper", key);
    if (helper.quirk === "chatterbox") rise(S, helper, key, "chatterbox");
  }
}

function enterZone(S, t, zone) {
  const from = t.zone;
  t.zone = zone; t.spot = null;
  emit(S, { t: "move", who: t.id, from, to: zone });
}

/** The spots in a zone a turkey could hide in now (room left). */
export function openSpots(S, t, zone = t.zone) {
  return spotsOf(S, zone).map((sp, i) => ({ i, ...sp, used: occupants(S, zone, i).filter(o => o !== t).length }))
    .filter(s => s.used < s.room);
}

async function hideIn(S, t, key) {
  const free = openSpots(S, t);
  let i = free.length ? await S._io.ask("spot", { S, t, zone: t.zone, free }) : null;
  // You hide whenever there's room (Ch 3 Sneak): an answer that isn't a free spot takes the first free one.
  if (free.length && !free.some(s => s.i === i)) i = free[0].i;
  t.spot = free.length ? i : null;   // null = no room: in the open
  emit(S, t.spot === null ? { t: "open", turkey: t.id, zone: t.zone } : { t: "hide", turkey: t.id, zone: t.zone, spot: t.spot });
}

function endAction(S, t, key) {
  // Fussy: sharing a hiding spot at the end of an action (yours, or someone squeezing into yours).
  for (const o of S.turkeys) if (o.quirk === "fussy" && o.spot !== null && (o === t || (o.zone === t.zone && o.spot === t.spot)) && occupants(S, o.zone, o.spot).length > 1) rise(S, o, key, "fussy");
  t.acted = true;
}

/** Does a Sneak along `path` (zones, from first to last) need a roll, and what target? (Ch 3 Sneak) */
export function sneakTarget(S, path) {
  const fdm = R.distancesFrom(S.farm, S.farmer.zone, S.adj);
  const farmerNear = !S.farmer.indoors && path.some(z => fdm[z] <= GG.roll.sneakRange);
  const noisy = path.slice(1).some(z => tags(S, z).includes("noisy"));
  return farmerNear ? GG.roll.targets.sneak : noisy ? GG.roll.targets.noisy : null;
}

/* ---------------------------------------------------- legal actions -- */

/**
 * Why a turkey can't take an intent right now (null if it can). Intents:
 *   { kind: "sneak", to, then? } · { kind: "hunker", friend? } · { kind: "prank", prank }
 *   { kind: "rescue", friend } · { kind: "scram" } · { kind: "letItOut" }
 */
export function whyNot(S, t, intent) {
  if (!t) return "noTurkey";
  if (S.over) return "over";
  if (S.phase && S.phase !== "turkeys" && S.phase !== "sim") return "notTurkeysTurn";
  if (t.acted) return "acted";
  const k = intent?.kind;
  if (t.spotted && k !== "scram") return "spottedOnlyScram";
  const house = S.farm.start.farmer;
  switch (k) {
    case "sneak": {
      if (!S.adj[t.zone].includes(intent.to)) return "notNextDoor";
      if (S.farmer.indoors && (intent.to === house || intent.then === house)) return "farmhouseRound1";
      if (intent.then) {
        if (t.knack !== "softSteps") return "oneZone";
        if (!S.adj[intent.to].includes(intent.then) || intent.then === t.zone) return "notNextDoor";
        if (farmerIn(S, intent.to)) return "throughFarmer";
      }
      return null;
    }
    case "hunker": {
      if (t.quirk === "restless" && t.lastHunker === S.round - 1) return "restless";
      if (intent.friend && intent.friend !== t.id) {
        const f = turkey(S, intent.friend);
        if (!f || f.zone !== t.zone) return "friendNotHere";
      }
      return null;
    }
    case "prank": {
      const p = S.farm.pranks.find(x => x.id === intent.prank);
      if (!p) return "noPrank";
      if (S.done[p.id]) return "prankDone";
      if (t.zone !== p.zone) return "prankElsewhere";
      if (farmerIn(S, p.zone)) return "farmerHere";
      return null;
    }
    case "rescue": {
      const f = turkey(S, intent.friend);
      if (!f || f === t) return "noFriend";
      if (!f.spotted) return "friendNotSpotted";
      if ((f.rescued?.round === S.round ? f.rescued.n : 0) >= GG.roll.rescuesPerTurkey) return "rescuedThisRound";
      const reach = t.knack === "bigGobble" ? 2 : 1;
      if (dist(S, t.zone, f.zone) > reach) return "tooFar";
      return null;
    }
    case "scram": return t.spotted ? null : "notSpotted";
    case "letItOut": return null;
    default: return "unknownAction";
  }
}

/** Every action a turkey could take now, with the reason when it can't (for the UI). */
export function legalActions(S, turkeyId) {
  hydrate(S);
  const t = turkey(S, turkeyId);
  const out = [];
  const add = (intent, extra = {}) => out.push({ ...intent, why: whyNot(S, t, intent), ...extra });
  if (!t) return out;
  for (const to of S.adj[t.zone]) {
    add({ kind: "sneak", to }, { target: sneakTarget(S, [t.zone, to]) });
    if (t.knack === "softSteps") for (const then of S.adj[to]) if (then !== t.zone) add({ kind: "sneak", to, then }, { target: sneakTarget(S, [t.zone, to, then]) });
  }
  add({ kind: "hunker" });
  for (const o of S.turkeys) if (o !== t && o.zone === t.zone) add({ kind: "hunker", friend: o.id });
  for (const p of S.farm.pranks) if (p.zone === t.zone) add({ kind: "prank", prank: p.id }, { target: p.target, need: p.need, have: S.progress[p.id] });
  for (const o of S.turkeys) if (o !== t && o.spotted) add({ kind: "rescue", friend: o.id }, { target: GG.roll.targets.rescue });
  add({ kind: "scram" }, { target: GG.roll.targets.scram + S.diff.quick });
  add({ kind: "letItOut" });
  return out;
}

/* -------------------------------------------------------------- actions -- */
// Ch 3 "Actions". Every action ends with endAction.

/** Take one turkey's action. Throws on an illegal intent (the UI only offers legal ones). */
export async function act(S, io, turkeyId, intent) {
  hydrate(S);
  const t = turkey(S, turkeyId);
  const no = whyNot(S, t, intent);
  if (no) throw new Error(`illegal action for ${turkeyId}: ${intent?.kind} (${no})`);
  S._io = io;
  try {
    emit(S, { t: "action", turkey: t.id, kind: intent.kind, intent });
    switch (intent.kind) {
      case "sneak": return await actSneak(S, t, intent.to, intent.then ?? null);
      case "hunker": return await actHunker(S, t, intent.friend ? turkey(S, intent.friend) : t);
      case "prank": return await actPrank(S, t, S.farm.pranks.find(p => p.id === intent.prank));
      case "rescue": return await actRescue(S, t, turkey(S, intent.friend));
      case "scram": return await actScram(S, t);
      case "letItOut": return actLetItOut(S, t);
    }
  } finally {
    S._io = null;
  }
}

/** Ch 3 "Sneak": one zone (Soft Steps: up to two, `then` is the second); one roll covers the move. */
async function actSneak(S, t, to, then = null) {
  const key = S.ctx = `a${++S.actionSeq}`;
  const from = t.zone;
  if (S.farmer.indoors && (to === S.farm.start.farmer || then === S.farm.start.farmer)) throw new Error("nobody enters the Farmhouse in round 1");
  if (t.knack !== "softSteps" || farmerIn(S, to)) then = null;   // Soft Steps can't pass through the farmer's zone
  const path = then ? [from, to, then] : [from, to];
  const target = sneakTarget(S, path);
  enterZone(S, t, to);
  if (then) enterZone(S, t, then);
  to = t.zone;
  let rolled = null;
  if (target !== null) {
    rolled = await roll(S, t, "sneak", target);
    if (!rolled.res.success) {
      // You still get there, but you're noticed (Ch 3 Sneak).
      if (farmerIn(S, to)) spot(S, t, "sneak");
    } else if (rolled.res.great) {
      // Great: one more zone, if it needs no roll of its own.
      const next = await S._io.ask("greatStep", { S, t });
      if (next && S.adj[t.zone].includes(next) && sneakTarget(S, [t.zone, next]) === null && !(S.farmer.indoors && next === S.farm.start.farmer)) enterZone(S, t, next);
    }
  }
  if (!t.spotted) await hideIn(S, t, key);
  if (rolled && !rolled.res.success && !t.spotted) placeHeard(S, t.zone, t.spot);   // the racket marks where you dived in
  if (rolled) await afterRoll(S, t, rolled, key);
  S.stats.actions.sneak = (S.stats.actions.sneak ?? 0) + 1;
  endAction(S, t, key);
}

async function actHunker(S, t, friend = t) {
  // Restless: never two rounds in a row.
  if (t.quirk === "restless" && t.lastHunker === S.round - 1) throw new Error(`${t.id} is Restless and hunkered last round`);
  t.lastHunker = S.round;
  const key = S.ctx = `a${++S.actionSeq}`;
  if (t.spot === null && !t.spotted) {
    if (farmerIn(S, t.zone)) {
      const rolled = await roll(S, t, "hunker", GG.roll.targets.hunker);
      if (rolled.res.success) await hideIn(S, t, key); else spot(S, t, "hunker");
      await afterRoll(S, t, rolled, key);
    } else await hideIn(S, t, key);
  }
  const by = t.knack === "coolHead" ? GG.urge.hunkerCoolHead : GG.urge.hunker;
  lower(S, friend, by, "hunker");
  // Mother Hen: everyone else in the zone calms down a little too.
  if (t.knack === "motherHen") for (const o of S.turkeys) if (o !== t && o !== friend && o.zone === t.zone) lower(S, o, 1, "motherHen");
  S.stats.actions.hunker = (S.stats.actions.hunker ?? 0) + 1;
  endAction(S, t, key);
}

/** Ch 6 "Pranks": roll against the prank's target; enough boxes and it happens. */
async function actPrank(S, t, prank) {
  const key = S.ctx = `a${++S.actionSeq}`;
  if (t.zone !== prank.zone || farmerIn(S, prank.zone) || S.done[prank.id]) throw new Error(`illegal prank ${prank.id}`);
  const rolled = await roll(S, t, "prank", prank.target);
  if (rolled.res.success) {
    // Busy Beak: a roll that works ticks two boxes (as a Great does).
    S.progress[prank.id] += (rolled.res.great || t.knack === "busyBeak") ? 2 : 1;
    const done = S.progress[prank.id] >= prank.need;
    emit(S, { t: "prank", prank: prank.id, turkey: t.id, boxes: Math.min(S.progress[prank.id], prank.need), need: prank.need, done });
    if (done) {
      S.done[prank.id] = true;
      S.stats.pranks[prank.id] = 1;
      if (prank.loud) placeHeard(S, prank.zone, null);
      if (prank.detour) S.farmer.detours.push(prank.detour);
      if (prank.decoy) S.decoy = true;
      if (prank.clock) { S.stats.prankClock += prank.clock; await advanceClock(S, prank.clock, "prank"); }
    }
  }
  await afterRoll(S, t, rolled, key);
  S.stats.actions.prank = (S.stats.actions.prank ?? 0) + 1;
  endAction(S, t, key);
}

/** Ch 3 "Gobble for a Friend": gobble on purpose to turn the farmer's head. */
async function actRescue(S, t, friend) {
  const key = S.ctx = `a${++S.actionSeq}`;
  S.stats.rescueTries++;
  S.stats.gobbles.rescue++;
  friend.rescued = { round: S.round, n: (friend.rescued?.round === S.round ? friend.rescued.n : 0) + 1 };
  t.urge = 0;   // you gobble, so your urge goes back to 0; no red dice, no Puff Up
  emit(S, { t: "gobble", turkey: t.id, kind: "rescue" });
  const rolled = await roll(S, t, "rescue", GG.roll.targets.rescue, { red: false, pushOK: false });
  if (rolled.res.success) { unspot(S, friend, "rescue"); S.stats.rescueWins++; }
  if (!(rolled.res.success && rolled.res.great)) {
    if (farmerIn(S, t.zone)) spot(S, t, "rescue"); else placeHeard(S, t.zone, t.spot);
  } else if (t.quirk === "showOff") { emit(S, { t: "pose", turkey: t.id }); placeHeard(S, t.zone, t.spot); }   // a quirk beats the general rule
  if (rolled.helper) {
    if (rolled.res.helperGobble && await spendFeather(S, rolled.helper, "helper")) rolled.res.helperGobble = false;
    if (rolled.res.helperGobble) gobble(S, rolled.helper, "helper", key);
    if (rolled.helper.quirk === "chatterbox") rise(S, rolled.helper, key, "chatterbox");
  }
  for (const o of S.turkeys) if (o !== t && o.quirk === "jumpy") rise(S, o, key, "jumpy");
  S.stats.actions.rescue = (S.stats.actions.rescue ?? 0) + 1;
  endAction(S, t, key);
}

/** Ch 3 "Scram": a Spotted turkey runs for it. */
async function actScram(S, t) {
  const key = S.ctx = `a${++S.actionSeq}`;
  S.stats.scramTries++;
  const rolled = await roll(S, t, "scram", GG.roll.targets.scram + S.diff.quick);
  if (rolled.res.success) {
    const to = validScram(S, t.zone, await S._io.ask("scramStep", { S, t, from: t.zone, second: false }));
    if (to) {
      unspot(S, t, "scram"); S.stats.scramWins++;
      enterZone(S, t, to);
      // Quick Feet runs two zones; a Great adds one more (three for Quick Feet).
      const extra = (t.knack === "quickFeet" ? 1 : 0) + (rolled.res.great ? 1 : 0);
      for (let i = 0; i < extra; i++) {
        const next = validScram(S, t.zone, await S._io.ask("scramStep", { S, t, from: t.zone, second: true }));
        if (next) enterZone(S, t, next); else break;
      }
      await hideIn(S, t, key);
    }
  }
  await afterRoll(S, t, rolled, key);
  S.stats.actions.scram = (S.stats.actions.scram ?? 0) + 1;
  endAction(S, t, key);
}

/** Where a Scram may run from `from`: next door, never into the farmer's zone (or the Farmhouse in round 1). */
export function scramOptions(S, from) {
  return S.adj[from].filter(n => n !== S.farmer.zone && !(S.farmer.indoors && n === S.farm.start.farmer));
}
const validScram = (S, from, to) => (to && scramOptions(S, from).includes(to) ? to : null);

function actLetItOut(S, t) {
  const key = S.ctx = `a${++S.actionSeq}`;
  gobble(S, t, "letItOut", key);
  S.stats.actions.letItOut = (S.stats.actions.letItOut ?? 0) + 1;
  endAction(S, t, key);
}

/* --------------------------------------------------------- the round -- */

/** The start of the turkeys' turn: everyone may act and help again; Keen Eye's forecast roll. */
export async function startTurkeysTurn(S, io) {
  hydrate(S);
  S._io = io;
  try {
    for (const t of S.turkeys) { t.acted = false; t.helped = false; }
    // Keen Eye: the farmer's route die is rolled now (Ch 2 Hazel). In round 1 he's indoors: nothing to see (Ch 7).
    S.preRoute = !S.farmer.indoors && S.turkeys.some(t => t.knack === "keenEye") ? await io.d6("keenEye") : null;
    emit(S, { t: "round", round: S.round, preRoute: S.preRoute });
  } finally { S._io = null; }
}

/** Ch 7 "The Farmer's Turn": grab, walk, search, Close Calls, the dog, the kid. */
export async function farmersTurn(S, io) {
  hydrate(S);
  S._io = io;
  try { await farmerSteps(S, io); } finally { S._io = null; S.poses = null; }
}

async function farmerSteps(S, io) {
  const key = S.ctx = `f${S.round}`;
  const F = S.farmer, farm = S.farm;
  // Round 1: he's indoors pulling his boots on, and skips his turn (the turkeys' head start).
  if (F.indoors) { F.indoors = false; S.preRoute = null; emit(S, { t: "boots" }); return; }
  // 1. Grab. A Spotted turkey he's no longer with (Grandma called, the decoy) gets away.
  for (const t of S.turkeys) if (t.spotted && t.zone !== F.zone) unspot(S, t, "lost");
  const grab = S.turkeys.filter(t => t.spotted && t.zone === F.zone);
  let decoyed = false;
  if (grab.length) {
    grab.sort((a, b) => b.urge - a.urge || cardNo(a) - cardNo(b));   // a tie: the lowest card number
    if (!S.decoy) {
      S.over = true; S.result = "loss"; S.cause = "caught"; S.gobbled = grab[0].id; S.stats.caughtWhy = grab[0].spottedWhy;
      emit(S, { t: "grab", turkey: grab[0].id });
      return;
    }
    // The decoy: he grabs it instead and carries it to the Farmhouse. Skip steps 2–4.
    S.decoy = false; S.stats.decoyUsed++; decoyed = true;
    emit(S, { t: "decoy", turkey: grab[0].id });
    for (const t of grab) unspot(S, t, "decoy");   // his arms are full: everyone he'd spotted there goes free
    moveNpc(S, "farmer", "house", "decoy");
    await advanceClock(S, GG.clock.decoyClock, "decoy");
    if (S.over) return;
  }
  const calm = new Set(S.turkeys.filter(t => t.knack === "keenEye").map(t => t.zone));   // Keen Eye warns its zone
  if (!decoyed) {
    // 2. Walk.
    let busy = false;
    if (F.detours.length) {
      // A detour prank (the first one, if several went off): straight there, too busy to search.
      const to = F.detours.shift(); busy = true; F.noMove = false;   // a next-turn effect lasts one turn
      emit(S, { t: "walk", why: "detour", to });
      moveNpc(S, "farmer", to, "detour");
    } else if (F.noMove) {
      F.noMove = false;
      emit(S, { t: "walk", why: "rake" });
    } else {
      const target = R.chooseHeard(farm, F.zone, S.heard, S.adj);
      if (target) {
        S.stats.heardChases++;
        emit(S, { t: "walk", why: "heard", target, seq: S.heard[target] });
        for (let i = 0; i < S.diff.chase && F.zone !== target; i++) moveNpc(S, "farmer", R.stepToward(farm, F.zone, target, S.adj), "heard");
      } else {
        const die = S.preRoute ?? await io.d6("route");
        emit(S, { t: "walk", why: S.preRoute ? "keenEye" : "route", die });
        moveNpc(S, "farmer", farm.zones[F.zone].route[die - 1], "route");
        if (F.hurry) {
          const d2 = await io.d6("oven");
          emit(S, { t: "walk", why: "oven", die: d2 });
          moveNpc(S, "farmer", farm.zones[F.zone].route[d2 - 1], "oven");
        }
      }
    }
    F.hurry = false;
    // 3. Search. A "Huh?" token in the zone he ends in tells him where to look.
    const reachedHeard = !!S.heard[F.zone];
    S.stats.searches++;
    if (!busy) for (const t of S.turkeys) if (t.zone === F.zone && t.spot === null) spot(S, t, "open");
    const spots = spotsOf(S, F.zone);
    S.poses = [];
    if (spots.length && !busy) {
      let searched;
      if (F.searchAll) searched = spots.map((_, i) => i);
      else if (reachedHeard) {
        // He checks the spot(s) the noise came from; a noise from the open sends him to a rolled spot.
        const marked = S.heardSpots[F.zone] ?? { o: 0 };
        searched = Object.keys(marked).filter(k => k !== "o").map(keySpot);
        if ("o" in marked || !searched.length) searched.push(farm.zones[F.zone].search[await io.d6("search") - 1]);
        searched = [...new Set(searched)];
      } else searched = [farm.zones[F.zone].search[await io.d6("search") - 1]];
      emit(S, { t: "search", zone: F.zone, spots: searched, all: !!F.searchAll, heard: reachedHeard });
      for (const i of searched) {
        for (const t of occupants(S, F.zone, i)) {
          if (t.spotted) continue;
          const rolled = await roll(S, t, "hide", spots[i].cover);
          if (!rolled.res.success) spot(S, t, "search");
          await afterRoll(S, t, rolled, key);
        }
      }
    } else emit(S, { t: "search", zone: F.zone, spots: [], all: false, heard: reachedHeard, busy });
    F.searchAll = false;
    if (S.heard[F.zone]) emit(S, { t: "cleared", zone: F.zone });
    delete S.heard[F.zone]; delete S.heardSpots[F.zone];
    for (const [z, sp] of S.poses) placeHeard(S, z, sp);
    S.poses = null;
    // 4. Close calls.
    const fdm = R.distancesFrom(S.farm, F.zone, S.adj);
    for (const t of S.turkeys) {
      if (t.spotted || calm.has(t.zone)) continue;
      if (fdm[t.zone] <= GG.urge.closeRange + (t.quirk === "scaredy" ? 1 : 0)) rise(S, t, key, "closeCall");
    }
  }
  S.preRoute = null;
  // 5. The dog.
  if (S.dog) {
    // 1–3: the dog follows its nose toward the nearest turkey; 4–6: it wanders along its route.
    const die = await io.d6("dog");
    if (die <= S.diff.nose) {
      const d = R.distancesFrom(farm, S.dog.zone, S.adj);
      const near = [...S.turkeys].sort((a, b) => d[a.zone] - d[b.zone] || cardNo(a) - cardNo(b))[0];
      emit(S, { t: "dog", die, nose: true, toward: who(near) });
      if (near && near.zone !== S.dog.zone) moveNpc(S, "dog", R.stepToward(farm, S.dog.zone, near.zone, S.adj), "nose");
    } else {
      const d2 = await io.d6("dogRoute");   // roll again for its route
      emit(S, { t: "dog", die, nose: false, routeDie: d2 });
      moveNpc(S, "dog", farm.zones[S.dog.zone].route[d2 - 1], "route");
    }
    let barked = false;
    for (const t of S.turkeys) {
      if (t.zone !== S.dog.zone || t.spotted) continue;
      const rolled = await roll(S, t, "sniff", GG.roll.targets.sniff);
      // A bark is a "Huh?" token on the spot the dog sniffed out.
      if (!rolled.res.success) { barked = true; emit(S, { t: "bark", turkey: t.id }); placeHeard(S, t.zone, t.spot); }
      await afterRoll(S, t, rolled, key);
    }
    if (barked) S.stats.barks++;
    const ddm = R.distancesFrom(farm, S.dog.zone, S.adj);
    for (const t of S.turkeys) if (!t.spotted && !calm.has(t.zone) && ddm[t.zone] <= (t.quirk === "scaredy" ? 1 : 0)) rise(S, t, key, "closeCall");
  }
  // 6. The kid (5+ turkeys): wanders its route, checks one rolled spot, and yells for Dad.
  for (const [k, kid] of S.kids.entries()) {
    const rd = await io.d6("kidRoute");
    moveNpc(S, k ? "kid2" : "kid", farm.zones[kid.zone].route[rd - 1], "route", kid);
    const zs = spotsOf(S, kid.zone);
    let yelled = false;
    if (S.turkeys.some(t => t.zone === kid.zone && t.spot === null && !t.spotted)) { yelled = true; placeHeard(S, kid.zone, null); }
    let checked = null;
    if (zs.length) {
      const i = farm.zones[kid.zone].search[await io.d6("kidSearch") - 1];
      checked = i;
      emit(S, { t: "kid", zone: kid.zone, die: rd, spot: i });
      let found = false;
      for (const t of occupants(S, kid.zone, i)) {
        if (t.spotted) continue;
        const rolled = await roll(S, t, "hide", zs[i].cover);
        if (!rolled.res.success) found = true;
        await afterRoll(S, t, rolled, key);
      }
      if (found) { yelled = true; placeHeard(S, kid.zone, i); }
    } else emit(S, { t: "kid", zone: kid.zone, die: rd, spot: null });
    if (yelled) { S.stats.kidYells = (S.stats.kidYells ?? 0) + 1; emit(S, { t: "yell", zone: kid.zone, spot: checked }); }
  }
}

function moveNpc(S, role, to, why, obj = null) {
  const o = obj ?? (role === "farmer" ? S.farmer : S.dog);
  const from = o.zone;
  o.zone = to;
  emit(S, { t: "move", who: role, from, to, why });
}

/** Ch 3 "The End of the Round": the clock (and its event), the urge creeps up, Pip's hiccups. */
export async function endOfRound(S, io) {
  hydrate(S);
  S._io = io;
  try {
    S.ctx = `t${S.round}`;
    await advanceClock(S, 1, "round");
    if (!S.over && GG.urge.tick && S.round % GG.urge.tick === 0) for (const t of S.turkeys) if (!t.spotted) rise(S, t, `t${S.round}`, "round");
    // Hiccups: one red die each round; a 6 is a gobble (a Feather can swallow it).
    if (!S.over) for (const t of S.turkeys) if (t.quirk === "hiccups") {
      const die = await io.d6("hiccups");
      emit(S, { t: "hiccups", turkey: t.id, die });
      if (die === 6 && !(await spendFeather(S, t, "hiccups"))) gobble(S, t, "roll", `t${S.round}`);
    }
  } finally { S._io = null; }
}

/** Ch 6 "The Dinner Clock": count it down; an event on each EVENT space; 0 is Too Late and wins. */
async function advanceClock(S, n, why) {
  for (let i = 0; i < n && !S.over; i++) {
    S.clock--;
    emit(S, { t: "clock", to: S.clock, why });
    if (R.isEventSpace(S.clock)) await farmEvent(S);
    if (S.clock <= 0) { S.over = true; S.result = "win"; S.cause = "tooLate"; emit(S, { t: "tooLate" }); }
  }
}

async function farmEvent(S) {
  const key = `e${S.round}.${S.clock}`;   // a farm event is its own thing: it can raise an urge that just rose
  if (S.opts.events !== false) {
    const die = await S._io.d6("event");
    const ev = GG.events[die - 1];
    S.stats.events.push(ev.id);
    emit(S, { t: "event", event: ev.id, die });
    switch (ev.id) {
      case "backfire": for (const t of S.turkeys) rise(S, t, key, "backfire"); break;
      case "phone": moveNpc(S, "farmer", "house", "phone"); break;
      case "kids": S.farmer.searchAll = true; break;
      case "rake": S.farmer.noMove = true; break;
      case "gust": for (const t of S.turkeys) lower(S, t, 1, "gust"); break;
      case "oven": S.farmer.hurry = true; break;
    }
  }
}

/* ----------------------------------------------------- whole phases -- */

/** Start a new game's first round (after newGame and seating). */
export async function startGame(S, io) {
  hydrate(S);
  S.round = 1; S.phase = "turkeys";
  await startTurkeysTurn(S, io);
}

/**
 * The Storyteller's button: the farmer's turn, the end of the round, and the next
 * round's start. Leaves S.phase "turkeys" (next round) or "over".
 */
export async function farmerPhase(S, io) {
  hydrate(S);
  S.phase = "farmer";
  await farmersTurn(S, io);
  if (!S.over) await endOfRound(S, io);
  if (S.over) return finish(S);
  S.round++;
  S.phase = "turkeys";
  await startTurkeysTurn(S, io);
}

/** Freeze the end-of-game stats. */
export function finish(S) {
  S.phase = "over";
  S.stats.rounds = S.round;
  S.stats.clutch = S.result === "win" && S.turkeys.some(t => t.spotted);
  S.stats.savedFromSpotted = S.stats.rescueWins + S.stats.scramWins;
  return S;
}
