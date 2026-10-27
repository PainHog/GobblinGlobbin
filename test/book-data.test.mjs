/**
 * The book and the game data say the same thing (DESIGN-RULES A11, A25).
 *  - farm and prank tables in the farm chapters match module/config.mjs;
 *  - the generated sheets and maps are up to date;
 *  - every knack, quirk and farm event is printed word for word;
 *  - the clock and Feather tables in Chapter 8 match the rules functions;
 *  - no product, model or company names of the tools used to make the game appear anywhere.
 * If one fails after a data change: node book/tools/farm-tables.mjs && node book/tools/sheets.mjs && node book/tools/maps.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GG } from "../module/config.mjs";
import { clockStart, startingFeathers } from "../module/logic/rules.mjs";
import { fillRegions } from "../book/tools/farm-tables.mjs";
import { SHEETS } from "../book/tools/sheets.mjs";
import { farmMap } from "../book/tools/maps.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CH = join(ROOT, "book/src/chapters");
const chapter = f => readFileSync(join(CH, f), "utf8");
const allChapters = () => readdirSync(CH).filter(f => f.endsWith(".html")).map(chapter).join("\n");

test("farm and prank tables in the chapters match the game data", () => {
  for (const f of readdirSync(CH).filter(f => f.endsWith(".html"))) {
    const html = chapter(f);
    assert.equal(fillRegions(html), html, `${f}: run node book/tools/farm-tables.mjs`);
  }
  for (const id of Object.keys(GG.farms)) {
    const all = allChapters();
    assert.ok(all.includes(`<!-- farm-table:${id} -->`), `${id} has a farm table`);
    assert.ok(all.includes(`<!-- prank-table:${id} -->`), `${id} has a prank table`);
  }
});

test("generated sheets and maps are up to date", () => {
  for (const [f, make] of Object.entries(SHEETS)) assert.equal(chapter(f), make(), `${f}: run node book/tools/sheets.mjs`);
  for (const farm of Object.values(GG.farms)) {
    assert.equal(readFileSync(join(ROOT, `book/art/map-${farm.id}.svg`), "utf8"), farmMap(farm) + "\n", `map-${farm.id}: run node book/tools/maps.mjs`);
  }
});

test("every knack, quirk and event is printed word for word", () => {
  const ch2 = chapter("12-ch02.html"), ch7 = chapter("21-ch07.html");
  for (const t of GG.turkeys) {
    assert.ok(ch2.includes(`<h3>${t.name}</h3>`), t.name);
    assert.ok(ch2.includes(GG.knacks[t.knack].text), `${t.name}'s knack text in Chapter 2`);
    assert.ok(ch2.includes(GG.quirks[t.quirk].text), `${t.name}'s quirk text in Chapter 2`);
    assert.ok(ch2.includes(t.breed), `${t.name}'s breed in Chapter 2`);
  }
  for (const e of GG.events) {
    assert.ok(ch7.includes(`<td>${e.name}</td><td>${e.text}</td>`), `event ${e.id} in Chapter 7`);
  }
});

test("Chapter 8's clock and Feather tables match the rules", () => {
  const ch8 = chapter("22-ch08.html");
  for (let n = 2; n <= 8; n++) {
    const row = `<tr><td class="num">${n}</td>` + ["easy", "standard", "hard"].map(d => `<td class="num">${clockStart(d, n, GG.farms.bramble)}</td>`).join("") + "</tr>";
    assert.ok(ch8.includes(row), `clock row for ${n} turkeys: ${row}`);
  }
  for (const [label, n] of [["2 or 3", 2], ["4 to 8", 4]]) {
    const row = `<tr><td>${label}</td>` + ["easy", "standard", "hard"].map(d => `<td class="num">${startingFeathers(d, n)}</td>`).join("") + "</tr>";
    assert.ok(ch8.includes(row), `Feather row for ${label}`);
  }
  for (const farm of Object.values(GG.farms)) {
    if (!farm.clock) continue;
    assert.ok(ch8.includes(`${farm.name.split(" ")[0]} +${farm.clock}`) || ch8.includes(`add ${farm.clock} to the number`), `${farm.name}'s clock adjustment in Chapter 8`);
  }
});

test("no names of the tools used to make the game, anywhere in the repository", () => {
  // Built from pieces so this file doesn't contain the words it looks for.
  const banned = [["cl", "aude"], ["anth", "ropic"], ["open", "ai"], ["chat", "gpt"], ["gem", "ini"], ["co", "pilot"], ["mid", "journey"]].map(p => p.join(""));
  const re = new RegExp(`\\b(${banned.join("|")})\\b`, "i");
  const skip = new Set(["node_modules", ".git", "dist"]);
  const hits = [];
  const walk = dir => {
    for (const name of readdirSync(dir)) {
      if (skip.has(name)) continue;
      const p = join(dir, name);
      if (statSync(p).isDirectory()) { walk(p); continue; }
      if (!/\.(md|mjs|js|json|html|css|svg|yml|yaml|txt|py)$/.test(name) && !/^(LICENSE|\.gitignore)$/.test(name)) continue;
      const lines = readFileSync(p, "utf8").split("\n");
      lines.forEach((l, i) => { if (re.test(l)) hits.push(`${p.slice(ROOT.length + 1)}:${i + 1}`); });
    }
  };
  walk(ROOT);
  assert.deepEqual(hits, []);
});
