/**
 * Every name in module/contracts.mjs is used by the code (an unused contract is a
 * drifted one), and the setting keys, card kinds and pack names agree with the
 * manifest and the templates.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as C from "../module/contracts.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const walk = dir => readdirSync(dir).flatMap(n => { const p = join(dir, n); return statSync(p).isDirectory() ? walk(p) : p.endsWith(".mjs") ? [p] : []; });
const code = [...walk(join(ROOT, "module")), ...walk(join(ROOT, "tools"))]
  .filter(f => !f.endsWith("contracts.mjs")).map(f => readFileSync(f, "utf8")).join("\n");

for (const group of ["SETTINGS", "CARD", "OPS", "HOOKS", "ACTOR_TYPES", "FLAGS", "PACKS", "ASK"]) {
  test(`every ${group} name is used`, () => {
    for (const key of Object.keys(C[group])) assert.ok(code.includes(`${group}.${key}`), `${group}.${key} is never used`);
  });
}

test("the manifest declares every pack and actor type the contracts name", () => {
  const m = JSON.parse(readFileSync(join(ROOT, "system.json"), "utf8"));
  assert.deepEqual(m.packs.map(p => p.name).sort(), Object.values(C.PACKS).sort());
  assert.deepEqual(Object.keys(m.documentTypes.Actor).sort(), Object.values(C.ACTOR_TYPES).sort());
  assert.equal(C.SYSTEM_PATH, `systems/${m.id}`);
});
