/**
 * Don't Get Gobble Gobbled — how the simulated flock plays.
 *
 * A policy is a sensible, documented way to play, not perfect play: each round
 * the flock sends its calmest turkeys to pull the best-placed pranks, while the
 * rest keep out of the farmer's likely path and hunker down. Spotted turkeys
 * Scram first, then friends Gobble for them.
 * Thresholds that change results are parameters (sim/params.mjs).
 */
import { GG } from "../module/config.mjs";
import * as R from "../module/logic/rules.mjs";
import { actSneak, actHunker, actPrank, actLetItOut, tags, spotsOf, occupants } from "./engine.mjs";

/** P(at least one of `dice` white dice reaches `target`). */
export const pHit = (target, dice) => 1 - Math.pow((target - 1) / 6, dice);

const dmap = (S, from) => R.distancesFrom(S.farm, from, S.adj);

/** Where the farmer will probably end his next move. */
function predictFarmer(S) {
  const F = S.farmer;
  const target = R.chooseHeard(S.farm, F.zone, S.heard, S.adj);
  if (target) {
    let z = F.zone;
    for (let i = 0; i < S.diff.chase && z !== target; i++) z = R.stepToward(S.farm, z, target, S.adj);
    return { [z]: 1 };
  }
  if (S.preRoute) return { [S.farm.zones[F.zone].route[S.preRoute - 1]]: 1 };
  const out = {};
  for (const z of S.farm.zones[F.zone].route) out[z] = (out[z] ?? 0) + 1 / 6;
  return out;
}

/** The cost of ending a step in `zone` for turkey `t` (danger, noise, quirks). */
function zoneCost(S, t, zone, pred) {
  let c = 1;
  if (S.farmer.indoors && zone === S.farm.start.farmer) c += 100;   // nobody goes into the Farmhouse in round 1
  const F = S.farmer.zone;
  if (zone === F) c += 8;
  else if (S.adj[F].includes(zone)) c += 0.5;
  c += 4 * (pred[zone] ?? 0);
  if (S.dog && S.dog.zone === zone) c += 0.5;
  const tg = tags(S, zone);
  if (tg.includes("noisy")) c += 1;
  if (tg.includes("open")) c += 1.5;
  if ((t.quirk === "peckish" && tg.includes("food")) || (t.quirk === "muddyFeet" && tg.includes("mud")) || (t.quirk === "wetFeathers" && tg.includes("water"))) c += 0.5;
  return c;
}

/** Cheapest remaining cost from every zone to `target` (Dijkstra over entry costs). */
function costTo(S, t, target, pred) {
  const best = { [target]: 0 };
  const todo = new Set([target]);
  while (todo.size) {
    let cur = null;
    for (const z of todo) if (cur === null || best[z] < best[cur]) cur = z;
    todo.delete(cur);
    for (const n of S.adj[cur]) {
      const v = best[cur] + zoneCost(S, t, cur, pred);
      if (best[n] === undefined || v < best[n]) { best[n] = v; todo.add(n); }
    }
  }
  return best;
}

function nextStep(S, t, target) {
  return nextStepFrom(S, t, t.zone, target);
}
function nextStepFrom(S, t, from, target) {
  const pred = S.pred;
  const c = costTo(S, t, target, pred);
  let best = null, bestV = Infinity;
  for (const n of S.adj[from]) {
    const v = zoneCost(S, t, n, pred) + c[n];
    if (v < bestV) { bestV = v; best = n; }
  }
  return best;
}

function sneakNeedsRoll(S, from, to) {
  if (S.farmer.indoors) return tags(S, to).includes("noisy");
  const fd = dmap(S, S.farmer.zone);
  return fd[from] <= GG.roll.sneakRange || fd[to] <= GG.roll.sneakRange || tags(S, to).includes("noisy");
}

/* ------------------------------------------------------------ the plan -- */

/** The danger of ending in a zone: the chance the farmer ends his next move there, plus the dog. */
function danger(S, zone) {
  let d = S.pred[zone] ?? 0;
  if (S.dog && (S.dog.zone === zone || S.adj[S.dog.zone].includes(zone))) d += S.diff.nose / 12;
  return d;
}

/** Each round the flock agrees who goes pranking and which prank (Ch 6). */
export function plan(S) {
  S.pred = predictFarmer(S);
  const P = S.P;
  const left = S.farm.pranks.filter(p => !S.done[p.id]);
  const assign = new Map(), load = {};
  const n = S.turkeys.length;
  const max = Math.max(1, Math.round(n * P.prankShare));
  const fd = dmap(S, S.farmer.zone);
  const elig = S.turkeys.filter(t => !t.spotted && t.urge <= P.prankMaxUrge).sort((a, b) => a.urge - b.urge);
  for (const t of elig) {
    if (assign.size >= max) break;
    const d = dmap(S, t.zone);
    let best = null, bestV = Infinity;
    for (const p of left) {
      if ((load[p.id] ?? 0) >= Math.max(1, p.need - S.progress[p.id])) continue;
      const value = (p.clock ?? 0) + (p.decoy ? 1.5 : 0);
      const v = d[p.zone] + 4 * danger(S, p.zone) + (fd[p.zone] <= 1 ? 1 : 0) + 0.7 * (p.target - 3) - value + (p.loud ? 0.5 : 0) + (t.knack === "busyBeak" ? -0.5 : 0);
      if (v < bestV) { bestV = v; best = p; }
    }
    if (best && bestV <= P.prankMaxScore) { assign.set(t, best); load[best.id] = (load[best.id] ?? 0) + 1; }
  }
  S.assign = assign;
}

export function order(S) {
  // Pranksters standing at their prank go first (so friends can help), then everyone else.
  return [...S.turkeys].sort((a, b) => (S.assign.get(b)?.zone === b.zone) - (S.assign.get(a)?.zone === a.zone));
}

/* ------------------------------------------------------------- choices -- */

export function wantsPush(S, t, kind) {
  const P = S.P;
  const fd = dmap(S, S.farmer.zone)[t.zone];
  switch (kind) {
    case "scram": case "hunker": return true;
    case "hide": return t.urge <= P.pushHideMax;
    case "sniff": return t.urge <= P.pushSniffMax;
    case "sneak": return t.urge <= P.pushSneakMax;
    case "prank": return t.urge <= P.pushPrankMax && fd >= 2;
    default: return false;
  }
}

export function chooseHelper(S, t, kind, target) {
  if (!S.P.help) return null;
  if (!["scram", "rescue", "hunker", "hide", "sniff", "prank"].includes(kind)) return null;
  if (kind === "hide" && target < 4) return null;
  const fd = dmap(S, S.farmer.zone);
  if (kind === "prank" && fd[t.zone] < 2) return null;
  const cands = S.turkeys.filter(o => o !== t && !o.helped && !o.spotted && o.zone === t.zone &&
    o.urge <= (o.quirk === "chatterbox" ? S.P.helpMaxUrge - 1 : S.P.helpMaxUrge));
  cands.sort((a, b) => a.urge - b.urge);
  return cands[0] ?? null;
}

export function chooseSpot(S, t, zone) {
  const spots = spotsOf(S, zone);
  const line = S.farm.zones[zone].search;
  let best = null, bestV = Infinity;
  spots.forEach((sp, i) => {
    const occ = occupants(S, zone, i).filter(o => o !== t).length;
    if (occ >= sp.room) return;
    const pSearch = line.filter(x => x === i).length / 6;
    let v = pSearch * (1 - pHit(sp.cover, 1)) + 0.02 * sp.cover;
    if (t.quirk === "fussy" && occ > 0) v += 0.25;
    if (occ > 0 && occupants(S, zone, i).some(o => o.quirk === "fussy")) v += 0.1;
    if (v < bestV) { bestV = v; best = i; }
  });
  return best;
}

export function greatSneakStep(S, t) {
  const p = S.assign.get(t);
  if (!p) return null;
  const T = p.zone;
  if (t.zone === T) return null;
  const next = nextStep(S, t, T);
  if (S.farmer.indoors && next === S.farm.start.farmer) return null;
  const d = dmap(S, T);
  // A Great's extra zone only if that move wouldn't need a roll of its own (Ch 3 Sneak).
  if (!next || next === S.farmer.zone || sneakNeedsRoll(S, t.zone, next) || d[next] >= d[t.zone]) return null;
  return next;
}

export function scramStep(S, t, from, second = false) {
  const fd = dmap(S, S.farmer.zone);
  const opts = S.adj[from].filter(n => n !== S.farmer.zone && !(S.farmer.indoors && n === S.farm.start.farmer));
  if (!opts.length) return null;
  // Run away from the farmer, into a zone with somewhere to hide.
  const v = n => -fd[n] + (spotsOf(S, n).length ? 0 : 2) + 0.2 * zoneCost(S, t, n, S.pred);
  opts.sort((a, b) => v(a) - v(b));
  const pick = opts[0];
  if (second && fd[pick] <= fd[from]) return null;
  return pick;
}

export function wantsScram() { return true; }

/** Spend a Feather on a gobble that would get the turkey Spotted, or bring the farmer straight to it. */
export function wantsFeather(S, t) {
  if (S.P.feathers === "never") return false;
  if (S.P.feathers === "always") return true;
  if (S.farmer.zone === t.zone) return true;
  const d = dmap(S, S.farmer.zone)[t.zone];
  return d <= S.diff.chase && S.feathers > 1;
}

export function chooseRescuer(S, friend) {
  const d = dmap(S, friend.zone);
  const cands = S.turkeys.filter(o => o !== friend && !o.acted && !o.spotted && d[o.zone] <= (o.knack === "bigGobble" ? 2 : 1));
  cands.sort((a, b) => (b.knack === "bigGobble") - (a.knack === "bigGobble") || (a.zone === S.farmer.zone) - (b.zone === S.farmer.zone) || a.urge - b.urge);
  return cands[0] ?? null;
}

/* ------------------------------------------------------- one turkey's go -- */

export function act(S, t) {
  const P = S.P;
  const fd = dmap(S, S.farmer.zone)[t.zone];
  // Too twitchy: calm down, or let it out where the farmer can't hear.
  if (t.urge >= P.calmAt) {
    if (P.letItOut && fd >= P.letItOutDist && t.urge >= P.letItOutAt) return actLetItOut(S, t);
    return actHunker(S, t);
  }
  const assigned = S.assign.get(t);
  const prank = assigned && !S.done[assigned.id] ? assigned : null;
  if (prank) {
    if (t.zone === prank.zone) {
      if (S.farmer.zone !== t.zone) return actPrank(S, t, prank);
      return actHunker(S, t);
    }
    const next = nextStep(S, t, prank.zone);
    if (next && !(S.farmer.indoors && next === S.farm.start.farmer)) {
      const needRoll = sneakNeedsRoll(S, t.zone, next);
      if (next !== S.farmer.zone && !(needRoll && t.urge >= P.cautiousAt)) {
        // Soft Steps: keep going if the second zone is safe and gets closer.
        let then = null;
        if (t.knack === "softSteps" && next !== prank.zone) {
          const n2 = nextStepFrom(S, t, next, prank.zone);
          if (n2 && n2 !== S.farmer.zone && !(S.farmer.indoors && n2 === S.farm.start.farmer) && !(sneakNeedsRoll(S, next, n2) && !needRoll)) then = n2;
        }
        return actSneak(S, t, next, then);
      }
    }
    return actHunker(S, t);
  }
  // A hider: move out of the farmer's likely path if that's cheap, else hunker down.
  const here = danger(S, t.zone) + (t.zone === S.farmer.zone ? 1 : 0);
  if (here >= P.fleeAt || t.spot === null) {
    let best = null, bestV = here - P.fleeGain;
    for (const n of S.adj[t.zone]) {
      if (n === S.farmer.zone) continue;   // (in round 1 that's the Farmhouse, which nobody may enter)
      const needRoll = sneakNeedsRoll(S, t.zone, n);
      if (needRoll && t.urge >= P.cautiousAt) continue;
      const v = danger(S, n) + (needRoll ? 0.3 : 0) + (spotsOf(S, n).length ? 0 : 1) + 0.05 * zoneCost(S, t, n, S.pred);
      if (v < bestV) { bestV = v; best = n; }
    }
    if (best) return actSneak(S, t, best);
  }
  if (t.knack === "coolHead") {
    const f = S.turkeys.filter(o => o.zone === t.zone && o !== t).sort((a, b) => b.urge - a.urge)[0];
    if (f && f.urge > t.urge + 1) return actHunker(S, t, f);
  }
  return actHunker(S, t);
}
