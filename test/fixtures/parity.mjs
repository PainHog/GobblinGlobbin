/**
 * The engine's fingerprint: seeded simulated games on every farm and difficulty,
 * hashed. test/game-parity.test.mjs checks the engine still plays them exactly so.
 * After a deliberate rules change, regenerate:  node test/fixtures/parity.mjs --write
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GG } from "../../module/config.mjs";
import { makeRng } from "../../sim/rng.mjs";
import { playGame } from "../../sim/engine.mjs";
import { DEFAULTS } from "../../sim/params.mjs";

export const FILE = join(dirname(fileURLToPath(import.meta.url)), "parity.json");

export async function fingerprint(games = 12) {
  const out = {};
  for (const farmId of Object.keys(GG.farms)) for (const difficulty of Object.keys(GG.difficulty)) for (const n of [2, 5, 8]) {
    const h = createHash("sha256");
    for (let i = 0; i < games; i++) {
      const rng = makeRng(11, farmId, difficulty, n, i);
      const roster = rng.shuffle(GG.turkeys.map(t => t.id)).slice(0, n);
      const g = await playGame({ farmId, difficulty, roster, rng, params: DEFAULTS });
      h.update(JSON.stringify([g.result, g.cause, g.rounds, g.clockLeft, g.gobbled, g.stats]));
    }
    out[`${farmId}|${difficulty}|${n}`] = h.digest("hex").slice(0, 16);
  }
  return out;
}

if (process.argv.includes("--write")) {
  writeFileSync(FILE, JSON.stringify(await fingerprint(), null, 2) + "\n");
  console.log(`wrote ${FILE}`);
}
