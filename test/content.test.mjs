/**
 * The compendium content agrees with the game data, the book and the board geometry.
 *  - the Turkeys pack is GG.turkeys exactly; every farm has its farmer, its dog and its scene;
 *  - every image a document points at is in the repository;
 *  - the generated Rulebook source, the VTT maps and the placeholder tokens are up to date;
 *  - the tables are d6 tables covering 1 to 6, word for word from the book.
 * If one fails after a data or chapter change:
 *   npm run build:vtt-maps && npm run build:journals && npm run build:packs
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GG } from "../module/config.mjs";
import { SYSTEM_PATH, SYSTEM_ID, FLAGS, ACTOR_TYPES, PACKS as PACK_NAMES } from "../module/contracts.mjs";
import { farmLayout } from "../module/logic/layout.mjs";
import { vttMap, tokenSvgs, PAPER, KID_NAME } from "../book/tools/vtt-maps.mjs";
import { rulebookFiles, buildRulebook } from "../tools/journal-gen.mjs";
import { PACKS, readSource, toCliDoc } from "../tools/pack-config.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = file => readSource(file);
const def = file => PACKS.find(d => d.file === file);
const farmIds = Object.keys(GG.farms);
const onDisk = p => {
  assert.ok(p.startsWith(`${SYSTEM_PATH}/`), `${p} is a system path`);
  return join(ROOT, p.slice(SYSTEM_PATH.length + 1));
};

test("the pack config covers every pack in system.json, by the contract's names", () => {
  const manifest = JSON.parse(readFileSync(join(ROOT, "system.json"), "utf8"));
  assert.deepEqual(PACKS.map(d => d.out).sort(), manifest.packs.map(p => p.name).sort());
  assert.deepEqual(PACKS.map(d => d.out).sort(), Object.values(PACK_NAMES).sort());
  for (const d of PACKS) assert.equal(manifest.packs.find(p => p.name === d.out).type, d.type, `${d.out} type`);
});

test("the Turkeys pack is GG.turkeys exactly", () => {
  const turkeys = source("turkeys");
  assert.deepEqual(turkeys.map(t => t.key), GG.turkeys.map(t => t.id), "same turkeys, in card order");
  GG.turkeys.forEach((t, i) => {
    const a = turkeys[i];
    assert.equal(a.name, t.name);
    assert.equal(a.type, ACTOR_TYPES.turkey);
    assert.deepEqual(a.system, { key: t.id, breed: t.breed, bird: t.bird, knack: t.knack, quirk: t.quirk });
    assert.ok(t.knack in GG.knacks && t.quirk in GG.quirks);
    assert.equal(a.img, `${SYSTEM_PATH}/assets/tokens/${t.id}.svg`);
    const tok = a.prototypeToken;
    assert.equal(tok.name, t.name);
    assert.equal(tok.texture.src, a.img);
    assert.equal(tok.disposition, 1, "friendly");
    assert.equal(tok.actorLink, true);
    assert.equal(tok.displayName, 30, "hover by anyone");
    assert.equal(tok.width, 0.9); assert.equal(tok.height, 0.9);
    assert.equal(tok.sight.enabled, false);
    assert.equal(tok.bar1.attribute, null); assert.equal(tok.bar2.attribute, null);
  });
});

test("every farm has its farmer, its dog and its scene; there is one kid", () => {
  const folk = source("farm-folk"), scenes = source("farms");
  for (const id of farmIds) {
    const farm = GG.farms[id];
    const farmer = folk.find(a => a.type === ACTOR_TYPES.farmer && a.system.farm === id);
    const dog = folk.find(a => a.type === ACTOR_TYPES.dog && a.system.farm === id);
    assert.ok(farmer, `${id} has a farmer`); assert.ok(dog, `${id} has a dog`);
    assert.equal(farmer.name, farm.farmer); assert.equal(dog.name, farm.dog);
    assert.equal(farmer.img, `${SYSTEM_PATH}/assets/tokens/farmer-${id}.svg`);
    assert.equal(dog.img, `${SYSTEM_PATH}/assets/tokens/dog-${id}.svg`);
    for (const a of [farmer, dog]) assert.equal(a.prototypeToken.disposition, -1, `${a.name} is hostile`);

    const lay = farmLayout(id);
    const scene = scenes.find(s => s.flags?.[SYSTEM_ID]?.[FLAGS.farm]?.farmId === id);
    assert.ok(scene, `${id} has a scene flagged with its farmId`);
    assert.equal(scene.key, id);
    assert.equal(scene.name, farm.name);
    assert.equal(scene.width, lay.width); assert.equal(scene.height, lay.height);
    assert.equal(scene.padding, 0, "scene pixels are map pixels");
    assert.equal(scene.grid.type, 0, "gridless");
    assert.equal(scene.background.src, `${SYSTEM_PATH}/assets/maps/${id}.webp`);
    assert.equal(scene.backgroundColor, PAPER);
    assert.equal(scene.tokenVision, false);
    assert.equal(scene.fog.exploration, false);
    assert.equal(scene.environment.globalLight.enabled, true);
    assert.ok(!scene.tokens?.length, "no embedded tokens");
  }
  assert.equal(scenes.length, farmIds.length);
  assert.equal(folk.length, 2 * farmIds.length + 1);
  const kids = folk.filter(a => a.type === ACTOR_TYPES.kid);
  assert.equal(kids.length, 1);
  assert.equal(kids[0].name, KID_NAME);
  assert.equal(kids[0].prototypeToken.disposition, 0, "neutral");
  for (const a of folk) {
    assert.equal(a.prototypeToken.actorLink, true);
    assert.equal(a.prototypeToken.texture.src, a.img);
    assert.equal(a.prototypeToken.name, a.name);
  }
});

test("every image a document points at is in the repository", () => {
  const paths = [];
  for (const file of ["turkeys", "farm-folk"]) for (const a of source(file)) paths.push(a.img, a.prototypeToken.texture.src);
  for (const s of source("farms")) paths.push(s.background.src);
  for (const m of source("macros")) paths.push(m.img);
  for (const j of source("rulebook")) for (const p of j.pages)
    for (const [, src] of p.text.content.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)) paths.push(src);
  for (const p of paths) {
    if (!p.startsWith(`${SYSTEM_PATH}/`)) { assert.match(p, /^icons\//, `${p}: a core icon or a system file`); continue; }
    assert.ok(existsSync(onDisk(p)), `${p} exists`);
  }
  assert.ok(paths.length > 30);
});

/** Width and height of a WebP file, from its header. */
function webpSize(buf) {
  assert.equal(buf.subarray(0, 4).toString(), "RIFF");
  assert.equal(buf.subarray(8, 12).toString(), "WEBP");
  const chunk = buf.subarray(12, 16).toString();
  if (chunk === "VP8X") return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
  if (chunk === "VP8 ") return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  if (chunk === "VP8L") { const b = buf.readUInt32LE(21); return [1 + (b & 0x3fff), 1 + ((b >> 14) & 0x3fff)]; }
  throw new Error(`unknown WebP chunk ${chunk}`);
}

test("the VTT maps and placeholder tokens are up to date", () => {
  for (const id of farmIds) {
    assert.equal(readFileSync(join(ROOT, `assets/maps/${id}.svg`), "utf8"), vttMap(id), `${id}.svg: run npm run build:vtt-maps`);
    const webp = join(ROOT, `assets/maps/${id}.webp`);
    assert.ok(existsSync(webp), `${id}.webp: run npm run build:vtt-maps`);
    const lay = farmLayout(id);
    assert.deepEqual(webpSize(readFileSync(webp)), [lay.width, lay.height], `${id}.webp is the map at 1:1`);
    assert.ok(statSync(webp).size < 3 * 1024 * 1024, `${id}.webp is under 3 MB`);
    const svg = vttMap(id);
    assert.match(svg, new RegExp(`width="${lay.width}" height="${lay.height}" viewBox="0 0 ${lay.width} ${lay.height}"`));
    // every spot is labelled with its cover and room, every prank badge is drawn
    for (const z of Object.values(lay.zones)) {
      for (const s of z.spots) assert.match(svg, new RegExp(`>${s.name}</tspan><tspan[^>]*>${s.cover}\\+</tspan><tspan[^>]*>×${s.room}</tspan>`), `${id}: ${s.name} ${s.cover}+ ×${s.room}`);
      if (z.prank) assert.ok(svg.includes(`data-prank="${z.prank.id}"`), `${id}: prank ${z.prank.id}`);
    }
    assert.equal((svg.match(/<g data-path=/g) ?? []).length, GG.farms[id].links.length, `${id}: every path is drawn`);
  }
  const tokens = tokenSvgs();
  const want = [...GG.turkeys.map(t => `${t.id}.svg`), ...farmIds.flatMap(id => [`farmer-${id}.svg`, `dog-${id}.svg`]), "kid.svg"].sort();
  assert.deepEqual(Object.keys(tokens).sort(), want);
  for (const [f, svg] of Object.entries(tokens)) assert.equal(readFileSync(join(ROOT, "assets/tokens", f), "utf8"), svg, `tokens/${f}: run npm run build:vtt-maps`);
});

test("the Rulebook source is up to date with the book", () => {
  const files = rulebookFiles();
  for (const [rel, data] of Object.entries(files)) {
    const p = join(ROOT, rel);
    assert.ok(existsSync(p), `${rel}: run npm run build:journals`);
    assert.ok(Buffer.from(data).equals(readFileSync(p)), `${rel}: run npm run build:journals`);
  }
  const have = readdirSync(join(ROOT, "packs/_source/rulebook")).filter(f => f.endsWith(".json")).map(f => `packs/_source/rulebook/${f}`);
  assert.deepEqual(have.sort(), Object.keys(files).filter(f => f.startsWith("packs/")).sort(), "no stale rulebook entries");
  assert.deepEqual(rulebookFiles(), files, "the generator is deterministic");
});

test("the Rulebook holds every chapter and sheet, cleaned for Foundry", () => {
  const { docs } = buildRulebook();
  const names = docs.map(d => d.doc.name);
  assert.deepEqual(names, ["Part One — Playing the Turkeys", "Part Two — Running the Farm", "Reference Sheets", "Credits"]);
  const pages = docs.flatMap(d => d.doc.pages);
  const CH = join(ROOT, "book/src/chapters");
  const chapters = readdirSync(CH).filter(f => f.endsWith(".html")).map(f => readFileSync(join(CH, f), "utf8"));
  for (const html of chapters) {
    const ch = html.match(/<p class="chapter-num">([^<]+)<\/p>\s*<h2>([^<]+)<\/h2>/);
    if (ch) assert.ok(pages.some(p => p.name === `${ch[1]} — ${ch[2]}`), `a page for ${ch[1]}`);
  }
  assert.equal(pages.filter(p => /^Chapter \d+ — /.test(p.name)).length, chapters.filter(h => h.includes('class="chapter-num"')).length);
  for (const s of ["At the Table", "The Storyteller’s Card", "Turkey Cards", "The Dinner Clock", "Tokens"])
    assert.ok(docs[2].doc.pages.some(p => p.name === s), `reference sheet ${s}`);
  for (const t of GG.turkeys) assert.ok(docs[2].doc.pages.find(p => p.name === "Turkey Cards").text.content.includes(`<h2>${t.name} `), `${t.name}'s card`);
  const credits = docs[3].doc.pages[0].text.content;
  assert.ok(credits.includes("Richard Moore") && credits.includes("PLACEHOLDER — credit line"), "the credits, with the placeholder credit line as it is");
  for (const p of pages) {
    const c = p.text.content;
    assert.equal(p.type, "text"); assert.equal(p.text.format, 1);
    assert.ok(c.startsWith('<div class="gg-journal') && c.endsWith("</div>"), `${p.name}: wrapped in .gg-journal`);
    assert.doesNotMatch(c, /data-art|<figure class="(?!gg-)|<aside|<section|<article|<!--|\sid="/, `${p.name}: art placeholders, ids and print markup are gone`);
    for (const [, cls] of c.matchAll(/class="([^"]*)"/g)) for (const k of cls.split(" ")) assert.match(k, /^gg-/, `${p.name}: class ${k}`);
  }
  for (const id of farmIds) assert.ok(pages.some(p => p.text.content.includes(`${SYSTEM_PATH}/assets/book/map-${id}.svg`)), `the ${id} map`);
  // the journal pages compile with deterministic ids
  const j = toCliDoc(def("rulebook"), source("rulebook")[0], 0);
  assert.equal(j._key, `!journal!${j._id}`);
});

test("the tables are d6 tables covering 1 to 6, word for word", () => {
  const tables = source("tables");
  assert.deepEqual(tables.map(t => t.name), ["Farm Events", "What’s for Dinner Instead?", "Famous Last Gobbles"]);
  const strip = s => s.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const bookRows = (file, header) => {
    const html = readFileSync(join(ROOT, "book/src/chapters", file), "utf8");
    const t = [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map(m => m[0]).find(t => t.includes(`<th>${header}</th>`));
    assert.ok(t, `${file} has the "${header}" table`);
    return [...t.matchAll(/<tr><td class="num">(\d)<\/td><td>([\s\S]*?)<\/td><\/tr>/g)].map(m => strip(m[2]));
  };
  const want = [
    GG.events.map(e => [e.name, e.text]),
    bookRows("16-ch06.html", "What’s for dinner instead?").map(t => ["", t]),
    bookRows("15-ch05.html", "Last words").map(t => ["", t])
  ];
  tables.forEach((t, i) => {
    assert.equal(t.formula, "1d6");
    assert.equal(t.replacement, true); assert.equal(t.displayRoll, true);
    assert.equal(t.results.length, 6);
    const faces = t.results.flatMap(r => { const out = []; for (let n = r.range[0]; n <= r.range[1]; n++) out.push(n); return out; });
    assert.deepEqual(faces.sort(), [1, 2, 3, 4, 5, 6], `${t.name} covers 1 to 6 once each`);
    for (const r of t.results) assert.equal(r.type, "text");
    assert.deepEqual(t.results.map(r => [r.name, r.description]), want[i], `${t.name} matches the book`);
    const doc = toCliDoc(def("tables"), t, i);
    for (const r of doc.results) assert.equal(r._key, `!tables.results!${doc._id}.${r._id}`);
    assert.equal(new Set(doc.results.map(r => r._id)).size, 6);
  });
});

test("the macros call the system's API", () => {
  const macros = source("macros");
  assert.deepEqual(macros.map(m => [m.name, m.type, m.command]), [
    ["Open the Farm Tracker", "script", "game.gobbleGobbled.openTracker();"],
    ["Farmer’s Turn", "script", "game.gobbleGobbled.farmerTurn();"]
  ]);
});

test("every pack compiles to CLI documents with the right keys", () => {
  for (const d of PACKS) {
    const ids = new Set();
    source(d.file).forEach((raw, i) => {
      const doc = toCliDoc(d, raw, i);
      assert.match(doc._id, /^[a-f0-9]{16}$/);
      assert.equal(doc._key, `!${d.collection}!${doc._id}`);
      assert.ok(!("key" in doc), "the source key is not a document field");
      assert.ok(!ids.has(doc._id)); ids.add(doc._id);
      if (d.type === "Actor") { assert.deepEqual(doc.items, []); assert.deepEqual(doc.effects, []); }
      if (d.type === "Scene") for (const c of ["tokens", "drawings", "tiles", "walls", "lights", "notes", "regions", "sounds", "templates"]) assert.deepEqual(doc[c], [], `${raw.key}.${c}`);
    });
  }
  assert.throws(() => toCliDoc(def("turkeys"), { key: "x", name: "X", type: "dog" }, 0), /turkey/);
});
