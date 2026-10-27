/**
 * The shared engine (module/logic/game.mjs) plays seeded games exactly as it did
 * when the fingerprint was taken, so the simulator's reports and the Foundry
 * system can't drift apart by accident. Regenerate after a deliberate rules change:
 *   node test/fixtures/parity.mjs --write
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fingerprint, FILE } from "./fixtures/parity.mjs";

test("the engine plays the stored seeded games exactly", async () => {
  const want = JSON.parse(readFileSync(FILE, "utf8"));
  const got = await fingerprint();
  assert.deepEqual(got, want);
});
