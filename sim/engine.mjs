/**
 * Don't Get Gobble Gobbled — the simulator's driver.
 *
 * The rules live in the shared engine (module/logic/game.mjs), which the Foundry
 * system runs too. This file plays a whole game on it: a seeded RNG rolls the dice,
 * and the flock policy (sim/policy.mjs) makes every choice a player would. Judgement
 * calls the book leaves open are named in sim/params.mjs.
 */
import { GG } from "../module/config.mjs";
import * as G from "../module/logic/game.mjs";
import * as policy from "./policy.mjs";

/** The engine's io, answered by a seeded RNG and the policy. The order of dice is the engine's. */
export function simIO(S) {
  const rng = S.rng;
  return {
    dice: ({ white, red, helper }) => ({ white: rng.roll(white), red: red === null ? [] : rng.roll(red), helper: helper ? rng.d6() : null }),
    d6: () => rng.d6(),
    ask: (kind, d) => {
      switch (kind) {
        case "push": return policy.wantsPush(d.S, d.t, d.kind, d.target);
        case "helper": return policy.chooseHelper(d.S, d.t, d.kind, d.target);
        case "feather": return policy.wantsFeather(d.S, d.t);
        case "spot": return policy.chooseSpot(d.S, d.t, d.zone);
        case "greatStep": return policy.greatSneakStep(d.S, d.t);
        case "scramStep": return policy.scramStep(d.S, d.t, d.from, d.second);
        default: throw new Error(`unknown question ${kind}`);
      }
    }
  };
}

export function newGame({ farmId = "bramble", difficulty = "standard", roster, rng, params }) {
  const S = G.newGame({ farmId, difficulty, roster, opts: params });
  Object.defineProperty(S, "P", { value: params, writable: true, enumerable: false });
  Object.defineProperty(S, "rng", { value: rng, writable: true, enumerable: false });
  S.phase = "turkeys";
  return S;
}

/** The flock's turn: danger first (Scram, then Gobble for a Friend), then everyone else. */
async function turkeysTurn(S, io) {
  await G.startTurkeysTurn(S, io);
  policy.plan(S);
  // Too Late beats everything: once the clock hits 0, nobody acts again.
  const go = async (t, intent) => { if (!S.over) await G.act(S, io, t.id, intent); };
  for (const t of S.turkeys) if (t.spotted && !t.acted && policy.wantsScram(S, t)) await go(t, { kind: "scram" });
  for (const t of S.turkeys) {
    // Ch 3: one Gobble for a Friend per Spotted turkey per round.
    for (let tries = 0; t.spotted && !S.over && tries < GG.roll.rescuesPerTurkey; tries++) {
      const r = policy.chooseRescuer(S, t);
      if (!r) break;
      await go(r, { kind: "rescue", friend: t.id });
    }
  }
  for (const t of S.turkeys) if (t.spotted && !t.acted) await go(t, { kind: "scram" });
  // A Spotted turkey can only Scram (Ch 3), even one Spotted by a friend's roll this turn.
  for (const t of policy.order(S)) if (!t.acted && !S.over) await go(t, t.spotted ? { kind: "scram" } : policy.act(S, t));
}

export async function playGame(opts) {
  const S = newGame(opts);
  const io = simIO(S);
  let wasSpotted = false;
  for (S.round = 1; !S.over && S.round < 100; S.round++) {
    S.phase = "turkeys";
    await turkeysTurn(S, io);
    for (const t of S.turkeys) { S.stats.urgeSum += t.urge; S.stats.urgeN++; }
    if (S.over) break;
    S.phase = "farmer";
    await G.farmersTurn(S, io);
    if (S.turkeys.some(t => t.spotted)) wasSpotted = true;
    if (S.over) break;
    await G.endOfRound(S, io);
  }
  S.stats.rounds = S.round;
  S.stats.clutch = S.result === "win" && S.turkeys.some(t => t.spotted);
  S.stats.spottedGames = wasSpotted ? 1 : 0;
  S.stats.savedFromSpotted = S.stats.rescueWins + S.stats.scramWins;
  return { result: S.result, cause: S.cause, gobbled: S.gobbled, rounds: S.stats.rounds, clockLeft: S.clock, stats: S.stats, roster: S.turkeys.map(t => t.id) };
}
