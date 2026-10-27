/**
 * Quick balance check: win/loss by difficulty and flock size for one farm.
 *   node sim/quick.mjs [farm] [runs] [seed] [preset]
 */
import { GG } from "../module/config.mjs";
import { makeRng } from "./rng.mjs";
import { playGame } from "./engine.mjs";
import { DEFAULTS, PRESETS } from "./params.mjs";

const [farmId = "bramble", runsArg = "2000", seedArg = "1", preset = "default"] = process.argv.slice(2);
const runs = Number(runsArg), seed = Number(seedArg);
const params = { ...DEFAULTS, ...PRESETS[preset] };
const ids = GG.turkeys.map(t => t.id);

console.log(`farm ${farmId}, ${runs} runs, seed ${seed}, preset ${preset}`);
console.log("diff      n  win%  caught% clock%  rounds  spottedGames% rescueTry/g rescueWin% scramWin% gobbles/g(roll full let rescue helper)");
for (const diff of Object.keys(GG.difficulty)) {
  for (let n = GG.flock.min; n <= GG.flock.max; n++) {
    let win = 0, caught = 0, clock = 0, rounds = 0, sg = 0, rt = 0, rw = 0, st = 0, sw = 0;
    const gob = { roll: 0, full: 0, letItOut: 0, rescue: 0, helper: 0 };
    for (let i = 0; i < runs; i++) {
      const rng = makeRng(seed, farmId, diff, n, i);
      const roster = rng.shuffle(ids).slice(0, n);
      const g = await playGame({ farmId, difficulty: diff, roster, rng, params });
      if (g.result === "win") win++; else if (g.cause === "caught") caught++; else clock++;
      rounds += g.rounds; sg += g.stats.spottedGames; rt += g.stats.rescueTries; rw += g.stats.rescueWins;
      st += g.stats.scramTries; sw += g.stats.scramWins;
      for (const k in gob) gob[k] += g.stats.gobbles[k];
    }
    const pc = x => (100 * x / runs).toFixed(1).padStart(5);
    console.log(`${diff.padEnd(9)} ${n}  ${pc(win)}  ${pc(caught)}  ${pc(clock)}  ${(rounds / runs).toFixed(1).padStart(5)}   ${pc(sg)}        ${(rt / runs).toFixed(2)}       ${rt ? (100 * rw / rt).toFixed(0) : "-"}%      ${st ? (100 * sw / st).toFixed(0) : "-"}%    ${Object.values(gob).map(v => (v / runs).toFixed(2)).join(" ")}`);
  }
}
