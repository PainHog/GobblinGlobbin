/**
 * DON'T GET GOBBLE GOBBLED — Rulebook compendium generator
 * ---------------------------------------------------------
 * Turns the rulebook source (book/src/chapters/*.html, in filename order) into the
 * Rulebook compendium's source: one JSON per journal entry in packs/_source/rulebook/,
 * one text page per chapter or sheet. The book is the rules, so this file only
 * reshapes it for Foundry and never changes a word:
 *   - covers, part pages and art placeholders are dropped (a part's lede opens its first chapter);
 *   - print-only bits (drawing boxes, urge tracks, tick boxes, blank fields) are dropped;
 *   - every class gets a "gg-" prefix (styles/journal.css styles them under .gg-journal);
 *   - <aside> boxes and <article> entries become <div>s, ids and comments go;
 *   - headings move up one level (the page title is the chapter title), except inside boxes;
 *   - each farm map is an image of the book's map, copied to assets/book/.
 * The output is deterministic: the same chapters always give byte-identical JSON.
 *
 *   node tools/journal-gen.mjs        (npm run build:journals), then npm run build:packs
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { GG } from "../module/config.mjs";
import { SYSTEM_PATH } from "../module/contracts.mjs";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHAPTERS = join(ROOT, "book", "src", "chapters");
const ART = join(ROOT, "book", "art");
export const RULEBOOK_SRC = join(ROOT, "packs", "_source", "rulebook");
export const BOOK_ASSETS = join(ROOT, "assets", "book");

/* -------------------------------------------------------------- parse -- */
// A small, strict HTML reader for the book's own markup (it is well-formed: the
// book build relies on that too). Nodes: { text } | { comment } | { tag, attrs, kids }.
const VOID = new Set(["br", "hr", "img", "wbr"]);
const TAG = /<!--([\s\S]*?)-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/g;
const ATTR = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;

function parse(html, where) {
  const root = { tag: "#root", attrs: [], kids: [] };
  const stack = [root];
  let last = 0;
  for (const m of html.matchAll(TAG)) {
    if (m.index > last) stack.at(-1).kids.push({ text: html.slice(last, m.index) });
    last = m.index + m[0].length;
    if (m[1] !== undefined) { stack.at(-1).kids.push({ comment: m[1] }); continue; }
    const [, , close, rawTag, rawAttrs, selfClose] = m;
    const tag = rawTag.toLowerCase();
    if (close) {
      const top = stack.pop();
      if (top.tag !== tag) throw new Error(`${where}: </${tag}> closes <${top.tag}>`);
      continue;
    }
    const attrs = [...rawAttrs.matchAll(ATTR)].map(a => [a[1].toLowerCase(), a[2] ?? a[3] ?? a[4] ?? ""]);
    const node = { tag, attrs, kids: [] };
    stack.at(-1).kids.push(node);
    if (!VOID.has(tag) && !selfClose) stack.push(node);
  }
  if (last < html.length) stack.at(-1).kids.push({ text: html.slice(last) });
  if (stack.length !== 1) throw new Error(`${where}: <${stack.at(-1).tag}> is never closed`);
  return root;
}

const attr = (n, name) => n.attrs?.find(([k]) => k === name)?.[1];
const classes = n => (attr(n, "class") ?? "").split(/\s+/).filter(Boolean);
const hasClass = (n, c) => classes(n).includes(c);
const textOf = n => n.text !== undefined ? n.text : n.comment !== undefined ? "" : n.kids.map(textOf).join("");
const plain = n => textOf(n).replace(/\s+/g, " ").trim();
function find(n, pred) {
  if (n.tag && pred(n)) return n;
  for (const k of n.kids ?? []) { const f = find(k, pred); if (f) return f; }
  return null;
}

/* ---------------------------------------------------------- transform -- */
// Print-only elements, dropped with everything inside them.
const DROP_CLASSES = new Set(["card-draw", "urge", "tracker-row", "pdf-marker", "end-marker"]);
// Inside these, headings keep their level (they are box titles, not sections).
const BOX_CLASSES = new Set(["box", "ability", "signature"]);
const KEEP_ATTRS = new Set(["class", "colspan", "rowspan", "src", "alt"]);

function mapFigure(n) {
  const name = attr(n, "data-art");
  const farmId = name.slice("map-".length);
  const farm = GG.farms[farmId];
  if (!farm) throw new Error(`map art "${name}" names no farm`);
  if (!existsSync(join(ART, `${name}.svg`))) throw new Error(`missing book/art/${name}.svg (run node book/tools/maps.mjs)`);
  const caption = n.kids.find(k => k.tag === "figcaption");
  return {
    tag: "figure", attrs: [["class", "gg-map"]],
    kids: [
      { tag: "img", attrs: [["src", `${SYSTEM_PATH}/assets/book/${name}.svg`], ["alt", `Map of ${farm.name}`]], kids: [] },
      ...(caption ? [{ tag: "figcaption", attrs: [], kids: caption.kids }] : [])
    ],
    map: name
  };
}

/**
 * Transform a node into zero or more nodes.
 * ctx: { shift: whether headings move up a level, inBox, maps: Set of map art used }
 */
function transform(n, ctx) {
  if (n.comment !== undefined) return [];
  if (n.text !== undefined) return [n];
  const cls = classes(n);
  if (n.tag === "figure" && attr(n, "data-art")?.startsWith("map-")) {
    const fig = mapFigure(n);
    ctx.maps.add(fig.map);
    delete fig.map;
    return [fig];
  }
  if (cls.includes("art") || attr(n, "data-art") !== undefined) return [];   // art placeholders
  if (cls.some(c => DROP_CLASSES.has(c))) return [];
  if (n.tag === "header" && cls.includes("chapter-head")) return [];         // the page title says it
  const inBox = ctx.inBox || cls.some(c => BOX_CLASSES.has(c));
  const kids = n.kids.flatMap(k => transform(k, { ...ctx, inBox }));
  if (n.tag === "section" || n.tag === "#root") return kids;
  let tag = { aside: "div", article: "div", header: "div" }[n.tag] ?? n.tag;
  if (ctx.shift && !inBox && /^h[3-6]$/.test(tag)) tag = `h${Number(tag[1]) - 1}`;
  const attrs = n.attrs
    .filter(([k]) => KEEP_ATTRS.has(k))
    .map(([k, v]) => k === "class" ? [k, v.split(/\s+/).filter(Boolean).map(c => `gg-${c}`).join(" ")] : [k, v]);
  return [{ tag, attrs, kids }];
}

/* ---------------------------------------------------------- serialize -- */
const escAttr = v => v.replace(/&(?![a-zA-Z]+;|#\d+;)/g, "&amp;").replace(/"/g, "&quot;");
function serialize(n) {
  if (n.text !== undefined) return n.text.replace(/\s*\n\s*/g, "\n");
  const a = n.attrs.map(([k, v]) => ` ${k}="${escAttr(v)}"`).join("");
  if (VOID.has(n.tag)) return `<${n.tag}${a}>`;
  return `<${n.tag}${a}>${n.kids.map(serialize).join("")}</${n.tag}>`;
}
const tidy = html => html.replace(/\n{2,}/g, "\n").replace(/^\n+|\n+$/g, "");

/* ---------------------------------------------------------------- book -- */

function readChapters() {
  return readdirSync(CHAPTERS).filter(f => f.endsWith(".html")).sort().map(file => {
    const root = parse(readFileSync(join(CHAPTERS, file), "utf8"), file);
    const section = root.kids.find(k => k.tag === "section");
    if (!section) throw new Error(`${file}: no <section>`);
    return { file, root, section, kind: classes(section)[0] };
  });
}

/** A page's HTML: the section's content, transformed, in the .gg-journal wrapper. */
function pageHtml(nodes, ctx, { kind, prefix = "" }) {
  const body = nodes.flatMap(k => transform(k, ctx)).map(serialize).join("");
  return `<div class="gg-journal gg-${kind}">\n${prefix}${tidy(body)}\n</div>`;
}

/** Build the Rulebook: [{ file, doc }] in compendium order, plus the map art it uses. */
export function buildRulebook() {
  const chapters = readChapters();
  const maps = new Set();
  const parts = [];
  const reference = { key: "reference", name: "Reference Sheets", pages: [] };
  const credits = { key: "credits", name: "Credits", pages: [] };
  let part = null, lede = "";
  for (const ch of chapters) {
    const { section, kind } = ch;
    const id = attr(section, "id");
    if (kind === "cover") continue;                    // pure layout: the title, the tagline and the art
    if (kind === "credits") {
      credits.pages.unshift({ key: "credits", name: "Credits", html: pageHtml(section.kids, { shift: false, maps }, { kind: "credits" }) });
    } else if (kind === "back-cover") {
      credits.pages.push({ key: "about", name: "About the Game", html: pageHtml(section.kids, { shift: false, maps }, { kind: "about" }) });
    } else if (kind === "part") {
      const kicker = plain(find(section, n => hasClass(n, "part-kicker")));
      const title = plain(find(section, n => n.tag === "h1"));
      const ledeNode = find(section, n => hasClass(n, "part-lede"));
      part = { key: id, name: `${kicker} — ${title}`, pages: [] };
      parts.push(part);
      lede = ledeNode ? serialize(transform(ledeNode, { shift: false, maps })[0]) + "\n" : "";
    } else if (kind === "chapter") {
      if (!part) throw new Error(`${ch.file}: a chapter before any part`);
      const num = plain(find(section, n => hasClass(n, "chapter-num")));
      const title = plain(find(section, n => hasClass(n, "chapter-head")).kids.find(k => k.tag === "h2"));
      part.pages.push({ key: id, name: `${num} — ${title}`, html: pageHtml(section.kids, { shift: true, maps }, { kind: "chapter", prefix: lede }) });
      lede = "";
    } else if (kind === "sheet") {
      const h2 = section.kids.find(k => k.tag === "h2");
      const rest = section.kids.filter(k => k !== h2);
      const title = plain(h2);
      const many = title.match(/^(.*?) \(\d+ of \d+\)$/);          // "Turkey Cards (1 of 2)" … one page
      const prev = reference.pages.at(-1);
      if (many && prev?.name === many[1]) {
        prev.nodes.push(...rest);
      } else {
        reference.pages.push({ key: many ? id.replace(/-\d+$/, "") : id, name: many ? many[1] : title, nodes: rest });
      }
    } else throw new Error(`${ch.file}: unknown section kind "${kind}"`);
  }
  for (const p of reference.pages) { p.html = pageHtml(p.nodes, { shift: true, maps }, { kind: "sheet" }); delete p.nodes; }

  const entries = [...parts, reference, credits].filter(e => e.pages.length);
  const docs = entries.map((e, i) => ({
    file: `${i + 1}-${e.key}.json`,
    doc: {
      key: e.key,
      name: e.name,
      pages: e.pages.map(p => ({ key: p.key, name: p.name, type: "text", text: { format: 1, content: p.html } }))
    }
  }));
  return { docs, maps: [...maps].sort() };
}

/** The exact bytes each generated file should have: { "<repo-relative path>": string | Buffer }. */
export function rulebookFiles() {
  const { docs, maps } = buildRulebook();
  const files = {};
  for (const { file, doc } of docs) files[`packs/_source/rulebook/${file}`] = JSON.stringify(doc, null, 2) + "\n";
  for (const m of maps) files[`assets/book/${m}.svg`] = readFileSync(join(ART, `${m}.svg`));
  return files;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const files = rulebookFiles();
  mkdirSync(RULEBOOK_SRC, { recursive: true });
  mkdirSync(BOOK_ASSETS, { recursive: true });
  // remove generated files that are no longer produced
  for (const [dir, rel, re] of [[RULEBOOK_SRC, "packs/_source/rulebook", /\.json$/], [BOOK_ASSETS, "assets/book", /^map-.*\.svg$/]]) {
    for (const f of readdirSync(dir)) if (re.test(f) && !(`${rel}/${f}` in files)) { rmSync(join(dir, f)); console.log(`removed ${rel}/${f}`); }
  }
  for (const [rel, data] of Object.entries(files)) {
    writeFileSync(join(ROOT, rel), data);
    console.log(`wrote ${rel}`);
  }
  const { docs } = buildRulebook();
  for (const { doc } of docs) console.log(`  ${doc.name}: ${doc.pages.map(p => p.name).join(" · ")}`);
}
