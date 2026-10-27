/**
 * DON'T GET GOBBLE GOBBLED — Pure Rules Logic
 * -----------------------------------
 * Every rule the simulator (and a future Foundry system) automates is computed
 * by a Foundry-free function here: plain data in, plain data out, plus static
 * data from ../config.mjs. Each function cites the rulebook passage it
 * implements. The rulebook (book/src/chapters/) is the source of truth: change
 * the book first, then this file and its tests.
 */

import { GG } from "../config.mjs";

/* ------------------------------------------------------------- the roll -- */

/**
 * How many white dice a roll gets (Ch 3 "Boosts"): one, plus one per boost,
 * never more than GG.roll.maxWhite.
 */
export function whiteDice(boosts) {
  return Math.min(GG.roll.maxWhite, 1 + Math.max(0, boosts));
}

/**
 * Read a roll (Ch 3 "Reading the Dice").
 * - The highest white die is the result: at or above the target works, a 6 is Great.
 * - Any red 6 is a gobble — one gobble however many red 6s (Ch 4 "One thing, one rise").
 * - A helper's red die showing 6 makes the helper gobble, not the roller.
 * The action's result is applied first, then any gobble (Ch 3 "Result first").
 */
export function readRoll({ white, red = [], helperRed = null, target }) {
  const best = Math.max(...white);
  return {
    best,
    success: best >= target,
    great: best >= GG.roll.greatFace,
    gobble: red.some(f => f >= GG.roll.gobbleFace),
    helperGobble: helperRed !== null && helperRed >= GG.roll.gobbleFace
  };
}

/* ------------------------------------------------------------- the urge -- */

/**
 * Raise a turkey's urge by one (Ch 4 "When the Urge Rises").
 * At the maximum, a rise is a gobble instead, and the urge goes back to 0.
 */
export function riseUrge(urge) {
  if (urge >= GG.urge.max) return { urge: 0, gobble: true };
  return { urge: urge + 1, gobble: false };
}

/** Lower a turkey's urge (Hunker Down, a cold gust): never below 0. */
export function lowerUrge(urge, by) {
  return Math.max(GG.urge.min, urge - by);
}

/** A push raises the urge by 1 before the roll; it isn't allowed at the maximum (Ch 3 "Push Your Luck"). */
export function canPush(urge) {
  return urge < GG.urge.max;
}

/* ------------------------------------------------------------ the farm -- */

/** Adjacency lists for a farm, from its links. */
export function neighbors(farm) {
  const n = Object.fromEntries(Object.keys(farm.zones).map(k => [k, []]));
  for (const [a, b] of farm.links) { n[a].push(b); n[b].push(a); }
  return n;
}

/** Distances (in zones) from one zone to every other (breadth-first). */
export function distancesFrom(farm, from, adj = neighbors(farm)) {
  const d = { [from]: 0 }, q = [from];
  while (q.length) {
    const c = q.shift();
    for (const n of adj[c]) if (d[n] === undefined) { d[n] = d[c] + 1; q.push(n); }
  }
  return d;
}

/**
 * The farmer heads for a Heard marker (Ch 7 "The Farmer's Turn", step 2):
 * the nearest one; if two are equally near, the newest. Returns the zone, or null when there is none.
 * `heard` is a map zone → the order it was placed (higher = newer).
 */
export function chooseHeard(farm, from, heard, adj = neighbors(farm)) {
  const d = distancesFrom(farm, from, adj);
  let best = null;
  for (const [zone, order] of Object.entries(heard)) {
    if (best === null || d[zone] < d[best.zone] || (d[zone] === d[best.zone] && order > best.order)) best = { zone, order };
  }
  return best ? best.zone : null;
}

/**
 * One step of the farmer's walk toward a zone along a shortest path. Where two
 * neighbors are equally good, the one listed first on the farm's links wins (the book
 * prints the paths, so the Storyteller never has to choose).
 */
export function stepToward(farm, from, to, adj = neighbors(farm)) {
  if (from === to) return from;
  const d = distancesFrom(farm, to, adj);
  return adj[from].filter(n => d[n] === d[from] - 1)[0] ?? from;
}

/** Where the Dinner Clock starts (Ch 6): 16 + 1 per turkey (−2 for a small flock), plus the difficulty's and the farm's adjustments. */
export function clockStart(difficulty, flockSize, farm = null) {
  const small = flockSize <= GG.flock.smallFlock ? GG.flock.smallClock : 0;
  return GG.clock.base + GG.clock.perTurkey * flockSize + small + GG.difficulty[difficulty].clock + (farm?.clock ?? 0);
}

/** How many of the farmer's kids help him search (Ch 8 "Flock Size"). */
export function kidsFor(flockSize) {
  return GG.flock.kids.filter(n => flockSize >= n).length;
}

/** A farm event is rolled when the clock lands on a multiple of 4 (above 0) (Ch 7 "Farm Events"). */
export function isEventSpace(space) {
  return space > 0 && space % GG.clock.eventEvery === 0;
}

/** The flock's Feathers at the start (Ch 8): 2, +1 for a small flock, plus the difficulty's adjustment, at least 0. */
export function startingFeathers(difficulty, flockSize) {
  const small = flockSize <= GG.flock.smallFlock ? GG.flock.smallFeathers : 0;
  return Math.max(0, GG.flock.feathers + small + GG.difficulty[difficulty].feathers);
}

/** Room left in a hiding spot. */
export function roomLeft(spot, occupants) {
  return spot.room - occupants;
}
