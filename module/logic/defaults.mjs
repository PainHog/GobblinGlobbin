/**
 * Default answers for the engine's questions (io.ask), Foundry-free.
 *
 * The VTT asks a turkey's player; when nobody answers in time (or the turkey has no
 * player online), it takes these. They're safe, rules-legal and simple: never Puff
 * Up, never ask for a Wing, spend a Feather only when a gobble would get you Spotted,
 * hide in the spot least likely to be found, stay put on a Great, Scram away from the
 * farmer into a zone with somewhere to hide.
 */
import * as R from "./rules.mjs";
import { openSpots, scramOptions, spotsOf, sneakTarget } from "./game.mjs";

const pHit = (target, dice) => 1 - Math.pow((target - 1) / 6, dice);

/** The free spot least likely to get you found: searched least often, best cover. */
export function bestSpot(S, t, zone = t.zone) {
  const free = openSpots(S, t, zone);
  if (!free.length) return null;
  const line = S.farm.zones[zone].search;
  const score = s => (line.filter(x => x === s.i).length / 6) * (1 - pHit(s.cover, 1)) + 0.02 * s.cover + (t.quirk === "fussy" && s.used ? 0.25 : 0);
  return [...free].sort((a, b) => score(a) - score(b) || a.i - b.i)[0].i;
}

/** Scram: the zone next door that's farthest from the farmer, preferring one with spots. */
export function bestScram(S, t, from = t.zone) {
  const opts = scramOptions(S, from);
  if (!opts.length) return null;
  const fd = R.distancesFrom(S.farm, S.farmer.zone, S.adj);
  const v = n => -fd[n] + (spotsOf(S, n).length ? 0 : 2);
  return [...opts].sort((a, b) => v(a) - v(b))[0];
}

/** Zones a Great Sneak may go on to: next door, needing no roll of its own. */
export function greatSteps(S, t) {
  return S.adj[t.zone].filter(n => sneakTarget(S, [t.zone, n]) === null && !(S.farmer.indoors && n === S.farm.start.farmer));
}

export function defaultAnswer(kind, d) {
  const { S, t } = d;
  switch (kind) {
    case "push": return false;
    case "helper": return null;
    case "feather": return S.farmer.zone === t.zone && !S.farmer.indoors;
    case "spot": return bestSpot(S, t, d.zone);
    case "greatStep": return null;
    case "scramStep": {
      const n = bestScram(S, t, d.from);
      if (!d.second || !n) return n;
      const fd = R.distancesFrom(S.farm, S.farmer.zone, S.adj);
      return fd[n] > fd[d.from] ? n : null;   // keep running only if it gets you farther away
    }
    default: return null;
  }
}
