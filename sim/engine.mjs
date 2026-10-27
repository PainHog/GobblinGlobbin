/**
 * Don't Get Gobble Gobbled — game engine for the simulator.
 *
 * Plays one game strictly by the core rules (docs/CORE-RULES.md, then the
 * chapters in book/src/chapters/): rule citations are in the comments. Rules
 * arithmetic comes from module/logic/rules.mjs and data from module/config.mjs,
 * so the simulator and the book's tables share one source. Player decisions come
 * from sim/policy.mjs; judgement calls the book leaves open are named in
 * sim/params.mjs.
 */
import { GG } from "../module/config.mjs";
import * as R from "../module/logic/rules.mjs";
import * as policy from "./policy.mjs";

const KNACK_FOR = { prank: "busyBeak", sneak: "softSteps", noisy: "softSteps", hide: "still", sniff: "still", rescue: "bigGobble", scram: "quickFeet" };

export function newGame({ farmId = "bramble", difficulty = "standard", roster, rng, params }) {
  const farm = GG.farms[farmId];
  const adj = R.neighbours(farm);
  const diff = GG.difficulty[difficulty];
  const S = {
    farm, adj, diff, difficulty, P: params, rng,
    clock: R.clockStart(difficulty, roster.length) + (params.clockShift ?? 0),
    round: 0, actionSeq: 0,
    turkeys: roster.map(id => {
      const def = GG.turkeys.find(t => t.id === id);
      return { ...def, zone: farm.start.turkeys, spot: 0, spotted: false, urge: params.startUrge ?? GG.urge.start,
        acted: false, helped: false, lastRise: null, history: [] };
    }),
    farmer: { zone: farm.start.farmer, indoors: true, searchAll: false, noMove: false, hurry: false, detour: null },
    dog: diff.dog ? { zone: farm.start.dog } : null,
    heard: {}, heardSeq: 0, heardSpots: {},
    feathers: R.startingFeathers(difficulty) + (params.featherShift ?? 0),
    progress: Object.fromEntries(farm.pranks.map(p => [p.id, 0])),
    done: {}, decoy: false,
    preRoute: null,
    plan: null,
    over: false, result: null, cause: null, gobbled: null,
    stats: newStats()
  };
  return S;
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

/** Ch 7 "Heard markers": on the spot the noise came from (null = in the open). */
/** The farmer is in this zone and outdoors (Ch 7: he spends the first round indoors). */
export const farmerIn = (S, zone) => !S.farmer.indoors && S.farmer.zone === zone;

function placeHeard(S, zone, spot = null) { S.heard[zone] = ++S.heardSeq; (S.heardSpots[zone] ??= new Set()).add(spot); }

/** Ch 4 "When the Urge Rises": +1, at most once per action or farmer's turn; past 5 is a gobble. */
function rise(S, t, key) {
  if (t.lastRise === key) return;
  t.lastRise = key;
  const r = R.riseUrge(t.urge);
  t.urge = r.urge;
  S.stats.maxUrgeSeen = Math.max(S.stats.maxUrgeSeen, t.urge);
  if (r.gobble) gobble(S, t, "full", key);
}

/**
 * Ch 4 "Gobbling": the urge drops to 0; if the farmer is in your zone you're
 * Spotted, otherwise a Heard marker goes on your zone. Jumpy turkeys nearby get jumpier.
 */
function gobble(S, t, kind, key) {
  S.stats.gobbles[kind]++;
  t.urge = 0;
  if (farmerIn(S, t.zone)) spot(S, t, "gobble");
  else placeHeard(S, t.zone, t.spot);
  for (const o of S.turkeys) {
    if (o !== t && o.quirk === "jumpy" && dist(S, o.zone, t.zone) <= 1) rise(S, o, key);
  }
}

function spot(S, t, why) {
  if (t.spotted) return;
  t.spotted = true;
  t.spottedWhy = why;
  S.stats.spotted++;
  S.stats.spottedBy[why]++;
}

/** Ch 3: roll white (action) and red (urge) dice, with boosts. Returns the reading. */
function roll(S, t, kind, target, { red = true, pushOK = true } = {}) {
  const rng = S.rng;
  let boosts = 0;
  if (GG.knacks[t.knack] && KNACK_FOR[kind] === t.knack) boosts++;
  // Push: raise the urge by 1 before rolling, for +1 white die (not at the maximum).
  if (pushOK && red && R.canPush(t.urge) && boosts < GG.roll.maxWhite - 1 && policy.wantsPush(S, t, kind, target)) {
    t.urge += 1; boosts++; S.stats.pushes++;
    S.stats.maxUrgeSeen = Math.max(S.stats.maxUrgeSeen, t.urge);
  }
  let helper = null;
  if (boosts < GG.roll.maxWhite - 1) {
    helper = policy.chooseHelper(S, t, kind, target);
    if (helper) { boosts++; helper.helped = true; S.stats.helps++; }
  }
  const white = rng.roll(R.whiteDice(boosts));
  const reds = red ? rng.roll(t.urge) : [];
  const helperRed = helper ? rng.d6() : null;
  const res = R.readRoll({ white, red: reds, helperRed, target });
  const r = (S.stats.rolls[kind] ??= { n: 0, ok: 0, great: 0, gobble: 0 });
  r.n++; if (res.success) r.ok++; if (res.great) r.great++; if (res.gobble) r.gobble++;
  return { res, helper };
}

/** After a roll's result is applied (result first), resolve the gobbles it caused. */
function afterRoll(S, t, { res, helper }, key) {
  // Ch 4 "Feathers": spend one to swallow a gobble from the dice (yours or a helper's).
  if (res.gobble && S.feathers > 0 && policy.wantsFeather(S, t)) { S.feathers--; S.stats.feathersSpent++; res.gobble = false; }
  if (helper && res.helperGobble && S.feathers > 0 && policy.wantsFeather(S, helper)) { S.feathers--; S.stats.feathersSpent++; res.helperGobble = false; }
  if (res.gobble) gobble(S, t, "roll", key);
  if (helper) {
    if (res.helperGobble) gobble(S, helper, "helper", key);
    if (helper.quirk === "chatterbox") rise(S, helper, key);
  }
}

function enterZone(S, t, zone, key) {
  t.zone = zone; t.spot = null;
  const tg = tags(S, zone);
  if (t.quirk === "peckish" && tg.includes("food")) rise(S, t, key);
  if (t.quirk === "muddyFeet" && tg.includes("mud")) rise(S, t, key);
  if (t.quirk === "wetFeathers" && tg.includes("water")) rise(S, t, key);
}

function hideIn(S, t, key) {
  const i = policy.chooseSpot(S, t, t.zone);
  t.spot = i;   // null = no room: in the open
}

function endAction(S, t, key) {
  if (t.quirk === "fussy" && t.spot !== null && occupants(S, t.zone, t.spot).length > 1) rise(S, t, key);
  // A fussy turkey already in the spot also feels it when someone joins.
  for (const o of S.turkeys) if (o !== t && o.quirk === "fussy" && o.spot !== null && o.zone === t.zone && o.spot === t.spot) rise(S, o, key);
  t.acted = true;
}

/* -------------------------------------------------------------- actions -- */
// Ch 3 "Actions". Every action ends with endAction.

export function actSneak(S, t, to) {
  const key = `a${++S.actionSeq}`;
  const from = t.zone;
  const fdm = R.distancesFrom(S.farm, S.farmer.zone, S.adj);
  const farmerNear = !S.farmer.indoors && (fdm[from] <= GG.roll.sneakRange || fdm[to] <= GG.roll.sneakRange);
  const noisy = tags(S, to).includes("noisy");
  enterZone(S, t, to, key);
  let rolled = null;
  if (farmerNear || noisy) {
    const target = farmerNear ? GG.roll.targets.sneak : GG.roll.targets.noisy;
    rolled = roll(S, t, "sneak", target);
    if (!rolled.res.success) {
      // You still get there, but you're noticed (Ch 3 Sneak).
      if (farmerIn(S, to)) spot(S, t, "sneak");
    } else if (rolled.res.great) {
      // Great: one more zone, if it needs no roll of its own.
      const next = policy.greatSneakStep(S, t);
      if (next) enterZone(S, t, next, key);
    }
  }
  if (!t.spotted) hideIn(S, t, key);
  if (rolled && !rolled.res.success && !t.spotted) placeHeard(S, t.zone, t.spot);   // the racket marks where you dived in
  if (rolled) afterRoll(S, t, rolled, key);
  S.stats.actions.sneak = (S.stats.actions.sneak ?? 0) + 1;
  endAction(S, t, key);
}

export function actHunker(S, t, friend = t) {
  const key = `a${++S.actionSeq}`;
  if (t.spot === null && !t.spotted) {
    if (farmerIn(S, t.zone)) {
      const rolled = roll(S, t, "hunker", GG.roll.targets.hunker);
      if (rolled.res.success) hideIn(S, t, key); else spot(S, t, "hunker");
      afterRoll(S, t, rolled, key);
    } else hideIn(S, t, key);
  }
  friend.urge = R.lowerUrge(friend.urge, t.knack === "coolHead" ? GG.urge.hunkerCoolHead : GG.urge.hunker);
  if (t.quirk === "restless") rise(S, t, key);
  S.stats.actions.hunker = (S.stats.actions.hunker ?? 0) + 1;
  endAction(S, t, key);
}

/** Ch 6 "Pranks": roll against the prank's target; enough successes and it happens. */
export function actPrank(S, t, prank) {
  const key = `a${++S.actionSeq}`;
  const rolled = roll(S, t, "prank", prank.target);
  if (rolled.res.success) {
    S.progress[prank.id] += rolled.res.great ? 2 : 1;
    if (S.progress[prank.id] >= prank.need) {
      S.done[prank.id] = true;
      S.stats.pranks[prank.id] = 1;
      if (prank.loud) placeHeard(S, prank.zone, null);
      if (prank.detour) S.farmer.detour = prank.detour;
      if (prank.decoy) S.decoy = true;
      if (prank.clock) { S.stats.prankClock += prank.clock; advanceClock(S, prank.clock); }
    }
  }
  afterRoll(S, t, rolled, key);
  S.stats.actions.prank = (S.stats.actions.prank ?? 0) + 1;
  endAction(S, t, key);
}

/** Ch 5 "Gobble for a Friend": gobble on purpose to turn the farmer's head. */
export function actRescue(S, t, friend) {
  const key = `a${++S.actionSeq}`;
  S.stats.rescueTries++;
  S.stats.gobbles.rescue++;
  t.urge = 0;   // you gobble, so your urge goes back to 0; no red dice, no push
  const rolled = roll(S, t, "rescue", GG.roll.targets.rescue, { red: false, pushOK: false });
  if (rolled.res.success) { friend.spotted = false; S.stats.rescueWins++; }
  if (!(rolled.res.success && rolled.res.great)) {
    if (farmerIn(S, t.zone)) spot(S, t, "rescue"); else placeHeard(S, t.zone, t.spot);
  }
  if (rolled.helper) {
    if (rolled.res.helperGobble && S.feathers > 0 && policy.wantsFeather(S, rolled.helper)) { S.feathers--; S.stats.feathersSpent++; rolled.res.helperGobble = false; }
    if (rolled.res.helperGobble) gobble(S, rolled.helper, "helper", key);
    if (rolled.helper.quirk === "chatterbox") rise(S, rolled.helper, key);
  }
  for (const o of S.turkeys) if (o !== t && o.quirk === "jumpy" && dist(S, o.zone, t.zone) <= 1) rise(S, o, key);
  S.stats.actions.rescue = (S.stats.actions.rescue ?? 0) + 1;
  endAction(S, t, key);
}

/** Ch 5 "Scram": a Spotted turkey runs for it. */
export function actScram(S, t) {
  const key = `a${++S.actionSeq}`;
  S.stats.scramTries++;
  const rolled = roll(S, t, "scram", GG.roll.targets.scram + S.diff.quick);
  if (rolled.res.success) {
    const to = policy.scramStep(S, t, t.zone);
    if (to) {
      t.spotted = false; S.stats.scramWins++;
      enterZone(S, t, to, key);
      if (t.knack === "quickFeet" || rolled.res.great) {
        const next = policy.scramStep(S, t, t.zone, true);
        if (next) enterZone(S, t, next, key);
      }
      hideIn(S, t, key);
    }
  }
  afterRoll(S, t, rolled, key);
  S.stats.actions.scram = (S.stats.actions.scram ?? 0) + 1;
  endAction(S, t, key);
}

export function actLetItOut(S, t) {
  const key = `a${++S.actionSeq}`;
  gobble(S, t, "letItOut", key);
  S.stats.actions.letItOut = (S.stats.actions.letItOut ?? 0) + 1;
  endAction(S, t, key);
}

/* --------------------------------------------------------- the round -- */

function turkeysTurn(S) {
  for (const t of S.turkeys) { t.acted = false; t.helped = false; }
  // Keen Eye: the farmer's route die is rolled now (Ch 2 Hazel / GG.knacks.keenEye).
  S.preRoute = S.turkeys.some(t => t.knack === "keenEye") ? S.rng.d6() : null;
  policy.plan(S);
  // Danger first: spotted turkeys try to Scram, then friends Gobble for them.
  for (const t of S.turkeys) if (t.spotted && !t.acted && policy.wantsScram(S, t)) actScram(S, t);
  for (const t of S.turkeys) {
    while (t.spotted) {
      const r = policy.chooseRescuer(S, t);
      if (!r) break;
      actRescue(S, r, t);
    }
  }
  for (const t of S.turkeys) if (t.spotted && !t.acted) actScram(S, t);
  // Everyone else.
  for (const t of policy.order(S)) if (!t.acted) policy.act(S, t);
}


function farmersTurn(S) {
  const key = `f${S.round}`;
  const F = S.farmer, farm = S.farm, rng = S.rng;
  // Round 1: he's indoors pulling his boots on, and skips his turn (the turkeys' head start).
  if (F.indoors) { F.indoors = false; S.preRoute = null; return; }
  // 1. Grab.
  const grab = S.turkeys.filter(t => t.spotted && t.zone === F.zone);
  if (grab.length) {
    grab.sort((a, b) => b.urge - a.urge);
    if (S.decoy) {
      // The scarecrow decoy: he grabs it instead and carries it to the kitchen. His turn ends.
      S.decoy = false; S.stats.decoyUsed++;
      grab[0].spotted = false;
      S.farmer.zone = "house";
      advanceClock(S, GG.clock.decoyClock);
      return;
    }
    S.over = true; S.result = "loss"; S.cause = "caught"; S.gobbled = grab[0].id; S.stats.caughtWhy = grab[0].spottedWhy;
    return;
  }
  // 2. Move.
  let reachedHeard = false, busy = false;
  if (F.detour) {
    // A detour prank: he goes straight there and is too busy to search.
    F.zone = F.detour; F.detour = null; busy = true;
  } else if (F.noMove) {
    F.noMove = false;
  } else {
    const target = R.chooseHeard(farm, F.zone, S.heard, S.adj);
    if (target) {
      S.stats.heardChases++;
      for (let i = 0; i < S.diff.chase && F.zone !== target; i++) F.zone = R.stepToward(farm, F.zone, target, S.adj);
      reachedHeard = F.zone === target;
    } else {
      const die = S.preRoute ?? rng.d6();
      F.zone = farm.zones[F.zone].route[die - 1];
      if (F.hurry) F.zone = farm.zones[F.zone].route[rng.d6() - 1];
    }
  }
  F.hurry = false;
  S.preRoute = null;
  // 3. Search.
  S.stats.searches++;
  if (!busy) for (const t of S.turkeys) if (t.zone === F.zone && t.spot === null) spot(S, t, "open");
  const spots = spotsOf(S, F.zone);
  if (spots.length && !busy) {
    let searched;
    if (F.searchAll) searched = spots.map((_, i) => i);
    else if (reachedHeard) {
      // He checks the spot(s) the noise came from; a noise from the open sends him to a rolled spot.
      const marked = S.heardSpots[F.zone] ?? new Set([null]);
      searched = [...marked].filter(i => i !== null);
      if (marked.has(null) || !searched.length) searched.push(farm.zones[F.zone].search[rng.d6() - 1]);
      searched = [...new Set(searched)];
    } else {
      searched = [];
      searched.push(farm.zones[F.zone].search[rng.d6() - 1]);
    }
    for (const i of searched) {
      for (const t of occupants(S, F.zone, i)) {
        if (t.spotted) continue;
        const rolled = roll(S, t, "hide", spots[i].cover);
        if (!rolled.res.success) spot(S, t, "search");
        afterRoll(S, t, rolled, key);
      }
    }
  }
  F.searchAll = false;
  delete S.heard[F.zone]; delete S.heardSpots[F.zone];
  // 4. Close call.
  const fdm = R.distancesFrom(S.farm, F.zone, S.adj);
  for (const t of S.turkeys) {
    if (t.spotted) continue;
    if (fdm[t.zone] <= GG.urge.closeRange) rise(S, t, key);
    else if (t.quirk === "scaredy" && fdm[t.zone] === GG.urge.closeRange + 1) rise(S, t, key);
  }
  // 5. The dog.
  if (S.dog) {
    // 1–3: the dog follows its nose toward the nearest turkey; 4–6: it wanders along its route.
    const die = rng.d6();
    if (die <= S.diff.nose) {
      const d = R.distancesFrom(farm, S.dog.zone, S.adj);
      const near = [...S.turkeys].sort((a, b) => d[a.zone] - d[b.zone])[0];
      if (near && near.zone !== S.dog.zone) S.dog.zone = R.stepToward(farm, S.dog.zone, near.zone, S.adj);
    } else S.dog.zone = farm.zones[S.dog.zone].route[die - 1];
    let barked = false;
    for (const t of S.turkeys) {
      if (t.zone !== S.dog.zone || t.spotted) continue;
      const rolled = roll(S, t, "sniff", GG.roll.targets.sniff);
      // A bark is a Heard marker on the spot the dog sniffed out.
      if (!rolled.res.success) { barked = true; placeHeard(S, t.zone, t.spot); }
      afterRoll(S, t, rolled, key);
    }
    if (barked) S.stats.barks++;
    for (const t of S.turkeys) if (!t.spotted && t.zone === S.dog.zone) rise(S, t, key);
  }
}

/** Ch 6 "The Dinner Clock": count it down; an event on each marked space; 0 is Too Late and wins. */
export function advanceClock(S, n) {
  for (let i = 0; i < n && !S.over; i++) {
    S.clock--;
    if (R.isEventSpace(S.clock)) farmEvent(S);
    if (S.clock <= 0) { S.over = true; S.result = "win"; S.cause = "tooLate"; }
  }
}

function farmEvent(S) {
  const key = `e${S.round}.${S.clock}`;
  if (S.P.events !== false) {
    const ev = GG.events[S.rng.d6() - 1];
    S.stats.events.push(ev.id);
    switch (ev.id) {
      case "backfire": for (const t of S.turkeys) rise(S, t, key); break;
      case "phone": S.farmer.zone = "house"; break;
      case "kids": S.farmer.searchAll = true; break;
      case "rake": S.farmer.noMove = true; break;
      case "gust": for (const t of S.turkeys) t.urge = R.lowerUrge(t.urge, 1); break;
      case "oven": S.farmer.hurry = true; break;
    }
  }
}

export function playGame(opts) {
  const S = newGame(opts);
  S.stats.feathersStart = S.feathers;
  let wasSpotted = false;
  for (S.round = 1; !S.over && S.round < 100; S.round++) {
    turkeysTurn(S);
    for (const t of S.turkeys) { S.stats.urgeSum += t.urge; S.stats.urgeN++; }
    if (S.over) break;
    farmersTurn(S);
    if (S.turkeys.some(t => t.spotted)) wasSpotted = true;
    if (S.over) break;
    // End of the round (Ch 3): the clock moves on, then every turkey's urge creeps up.
    advanceClock(S, 1);
    if (!S.over && GG.urge.tick && S.round % GG.urge.tick === 0) for (const t of S.turkeys) if (!t.spotted) rise(S, t, `t${S.round}`);
  }
  S.stats.rounds = S.round;
  S.stats.clutch = S.result === "win" && S.turkeys.some(t => t.spotted);
  S.stats.spottedGames = wasSpotted ? 1 : 0;
  S.stats.savedFromSpotted = S.stats.rescueWins + S.stats.scramWins;
  return { result: S.result, cause: S.cause, gobbled: S.gobbled, rounds: S.stats.rounds, clockLeft: S.clock, stats: S.stats, roster: S.turkeys.map(t => t.id) };
}
