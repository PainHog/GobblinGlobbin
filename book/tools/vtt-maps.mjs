/**
 * VTT farm maps and placeholder tokens — generated from the game data and the
 * board geometry, so the scene background can't disagree with where the Foundry
 * board puts its tokens (module/logic/layout.mjs is the contract).
 *
 *   node book/tools/vtt-maps.mjs          (npm run build:vtt-maps)
 *     → assets/maps/<farm>.svg   the map, exactly width × height units (= scene pixels)
 *     → assets/maps/<farm>.webp  the scene background, rasterized 1:1 by Chromium
 *     → assets/tokens/*.svg      token art: the sample art's portraits (turkeys, farmers, dogs, the kid)
 *   node book/tools/vtt-maps.mjs --svg    the SVGs only (no Chromium)
 *
 * The maps are PLACEHOLDERS in the book's palette. Final art can replace the
 * background as long as every zone box, spot box, slot and path stays where
 * farmLayout() puts it. The rasterizer embeds the book's fonts (@fontsource) and
 * checks that every label fits inside its box and no two labels overlap.
 */
import { writeFileSync, mkdirSync, mkdtempSync, rmSync, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { GG } from "../../module/config.mjs";
import { farmLayout, L } from "../../module/logic/layout.mjs";
import { C } from "./art-gen/lib.mjs";
import { portrait, folkPortrait } from "./art-gen/scenes/book.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const MAPS_DIR = join(ROOT, "assets", "maps");
export const TOKENS_DIR = join(ROOT, "assets", "tokens");

/** The map's paper color (also the scene's backgroundColor). */
export const PAPER = C.paper;

const DISPLAY = `font-family="Fraunces, Georgia, serif"`;
const SANS = `font-family="Alegreya Sans, Arial, Helvetica, sans-serif"`;
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const n = v => Math.round(v * 10) / 10;

// Rough advance widths (em) of the book's fonts, measured in Chromium; only used to
// size pills and wrap prank names. The rasterizer measures the real thing.
const EM = { sans: 0.43, sansCaps: 0.5, display: 0.57 };
const textW = (s, size, kind = "sans") => s.length * size * EM[kind];

/* ------------------------------------------------------------ shapes -- */

/** A five-pointed star drawn as a shape (no symbol glyphs). */
function star(cx, cy, r, fill = C.accent) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
    pts.push(`${n(cx + rr * Math.cos(a))},${n(cy + rr * Math.sin(a))}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${fill}" stroke="${C.deep}" stroke-width="2.5" stroke-linejoin="round"/>`;
}

/** A text pill: rounded box with centered caps. Returns { svg, w }. */
function pill(x, y, label, fill, color, { size = 28, h = 46, anchor = "start" } = {}) {
  const w = Math.round(textW(label, size, "sansCaps") + 2 * (label.length - 1) + 40);
  const left = anchor === "end" ? x - w : x;
  const svg = `<g data-frame="pill"><rect x="${left}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/>` +
    `<text x="${left + w / 2}" y="${y + h / 2 + size * 0.36}" ${SANS} font-size="${size}" font-weight="800" letter-spacing="2" text-anchor="middle" fill="${color}">${esc(label)}</text></g>`;
  return { svg, w };
}

/** A double-headed arrow across a path gate (shapes only). */
function arrow(cx, cy, len, vertical) {
  const hl = 20, hw = 17, sw = 7;          // head length, head half-width, shaft half-width
  const a = len / 2;
  const pts = [[-a, 0], [-a + hl, -hw], [-a + hl, -sw], [a - hl, -sw], [a - hl, -hw], [a, 0], [a - hl, hw], [a - hl, sw], [-a + hl, sw], [-a + hl, hw]];
  const p = pts.map(([u, v]) => vertical ? `${n(cx + v)},${n(cy + u)}` : `${n(cx + u)},${n(cy + v)}`).join(" ");
  return `<polygon points="${p}" fill="${C.light}" stroke="${C.deep}" stroke-width="3" stroke-linejoin="round"/>`;
}

const slotCircle = (x, y, r = 42) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.light}" stroke="${C.edge}" stroke-width="3" stroke-dasharray="7 6"/>`;

/** Split a name into lines no wider than `max` px at `size`. */
function wrap(text, size, max) {
  const lines = [];
  let cur = "";
  for (const w of text.split(" ")) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && textW(next, size) > max) { lines.push(cur); cur = w; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

/* -------------------------------------------------------------- parts -- */

function startLabels(farm, zoneId) {
  const out = [];
  if (farm.start.turkeys === zoneId) out.push("TURKEYS START");
  // the kid starts in the Farmhouse with the farmer (Chapter 7)
  const who = [farm.start.farmer === zoneId && "FARMER", farm.start.dog === zoneId && "DOG", farm.start.farmer === zoneId && "KID"].filter(Boolean);
  if (who.length) out.push(`${who.length > 1 ? who.slice(0, -1).join(", ") + " & " + who.at(-1) : who[0]} START`);
  return out;
}

function zoneSvg(farm, z) {
  const b = z.box, out = [];
  const open = z.tags.includes("open"), noisy = z.tags.includes("noisy");
  out.push(`<g data-frame="zone" data-zone="${z.id}">`);
  out.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="28" fill="${open ? C.paper2 : C.light}" stroke="${C.dark}" stroke-width="6"${open ? ` stroke-dasharray="26 16"` : ""}/>`);
  out.push(`<text x="${z.title.x}" y="${z.title.y + 4}" ${DISPLAY} font-size="64" font-weight="800" fill="${C.deep}">${esc(z.name)}</text>`);
  // badges, right-aligned in the title row (text, never color alone)
  const badges = [];
  if (noisy) badges.push(["NOISY", C.alarm, C.light]);
  if (open) badges.push(["OPEN", C.accentDeep, C.light]);
  for (const s of startLabels(farm, z.id)) badges.push([s, C.deep, C.accentB]);
  let bx = b.x + b.w - 24;
  for (const [label, fill, color] of badges) {
    const p = pill(bx, b.y + 38, label, fill, color, { anchor: "end" });
    out.push(p.svg);
    bx -= p.w + 12;
  }
  out.push(`<line x1="${b.x + 20}" y1="${b.y + 104}" x2="${b.x + b.w - 20}" y2="${b.y + 104}" stroke="${C.edge}" stroke-width="3"/>`);
  if (open) {
    out.push(`<text x="${b.x + 24}" y="${b.y + 170}" ${SANS} font-size="32" font-style="italic" fill="${C.inkSoft}">Open ground: no hiding spots</text>`);
  }
  for (const s of z.spots) out.push(spotSvg(s));
  if (z.prank) out.push(prankSvg(farm.pranks.find(p => p.id === z.prank.id), z.prank.box));
  out.push(openSvg(z.open, z.visitors));
  out.push(`</g>`);
  return out.join("\n");
}

function spotSvg(s) {
  const b = s.box;
  return [`<g data-frame="spot">`,
    `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="16" fill="${C.paper2}" stroke="${C.soft}" stroke-width="3"/>`,
    `<text x="${s.label.x}" y="${s.label.y + 2}" ${SANS} font-size="32"><tspan font-weight="700" fill="${C.ink}">${esc(s.name)}</tspan><tspan dx="16" font-weight="800" fill="${C.dark}">${s.cover}+</tspan><tspan dx="12" font-weight="500" fill="${C.inkSoft}">×${s.room}</tspan></text>`,
    ...s.slots.map(p => slotCircle(p.x, p.y)),
    `</g>`].join("\n");
}

function prankSvg(prank, b) {
  const out = [`<g data-frame="prank" data-prank="${prank.id}">`];
  out.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="18" fill="${C.light}" stroke="${C.accent}" stroke-width="5"/>`);
  out.push(star(b.x + 34, b.y + 40, 21));
  const lines = wrap(prank.name, 30, b.w - 62 - 16);
  if (lines.length > 2) throw new Error(`prank "${prank.name}" needs ${lines.length} lines on the map`);
  const top = lines.length === 1 ? 58 : 48;   // a one-line name sits a little lower, next to the star
  lines.forEach((l, i) => out.push(`<text x="${b.x + 62}" y="${b.y + top + i * 36}" ${SANS} font-size="30" font-weight="800" fill="${C.deep}">${esc(l)}</text>`));
  out.push(`<text x="${b.x + 20}" y="${b.y + 134}" ${SANS}><tspan font-size="38" font-weight="800" fill="${C.dark}">${prank.target}+</tspan><tspan dx="18" font-size="30" font-weight="500" fill="${C.ink}">clock −${prank.clock}</tspan></text>`);
  for (let i = 0; i < prank.need; i++) {
    out.push(`<rect x="${b.x + 20 + i * 54}" y="${b.y + 146}" width="40" height="40" rx="6" fill="${C.light}" stroke="${C.ink}" stroke-width="3.5"/>`);
  }
  const type = prank.loud ? ["LOUD", C.alarm] : prank.detour ? ["DETOUR", C.accentDeep] : prank.decoy ? ["DECOY", C.dark] : null;
  if (type) out.push(pill(b.x + b.w - 18, b.y + 144, type[0], type[1], C.light, { anchor: "end", h: 44 }).svg);
  out.push(`</g>`);
  return out.join("\n");
}

function openSvg(open, visitors) {
  const b = open.box, out = [`<g data-frame="open">`];
  out.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="16" fill="${C.paper}" stroke="${C.soft}" stroke-width="3" stroke-dasharray="14 10"/>`);
  out.push(`<text x="${open.label.x}" y="${open.label.y + 2}" ${SANS} font-size="32" font-weight="800" fill="${C.ink}">In the open</text>`);
  for (const p of open.slots) out.push(slotCircle(p.x, p.y));
  for (const [who, label] of [["farmer", "Farmer"], ["dog", "Dog"], ["kid", "Kid"]]) {
    const p = visitors[who];
    out.push(`<g data-frame="visitor"><circle cx="${p.x}" cy="${p.y}" r="47" fill="${C.paper2}" stroke="${C.soft}" stroke-width="3"/>` +
      `<text x="${p.x}" y="${p.y + 10}" ${SANS} font-size="28" font-weight="500" fill="${C.soft}" text-anchor="middle">${label}</text></g>`);
  }
  out.push(`</g>`);
  return out.join("\n");
}

function gateSvg(p) {
  // a gate between two zones side by side is tall and narrow: you go through it sideways
  const r = p.rect, vertical = r.w > r.h;
  return `<g data-path="${p.a}-${p.b}"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="16" fill="${C.accent}" stroke="${C.dark}" stroke-width="5"/>` +
    arrow(r.x + r.w / 2, r.y + r.h / 2, Math.min(r.w, r.h) - 14, vertical) + `</g>`;
}

/** Puddlewick's creek: runs between grid rows `row` and `row + 1`, crossed only where a path is drawn. */
function creekSvg(lay, row) {
  const { margin: M, cellH, cellW } = L;
  const y = M + (row + 1) * cellH, x0 = M, x1 = lay.width - M, out = [];
  const wave = dy => {
    let d = `M ${x0} ${y + dy}`;
    for (let x = x0; x < x1; x += 60) d += ` q 15 -10 30 0 t 30 0`;
    return d;
  };
  out.push(`<rect x="${x0}" y="${y - 28}" width="${x1 - x0}" height="56" fill="${C.paper2}"/>`);
  out.push(`<path d="${wave(-12)}" fill="none" stroke="${C.accentDeep}" stroke-width="4"/>`);
  out.push(`<path d="${wave(12)}" fill="none" stroke="${C.accentDeep}" stroke-width="4"/>`);
  for (let col = 0; col < lay.cols; col++) {
    const crossed = lay.paths.some(p => { const r = p.rect; return r.w > r.h && r.y < y && r.y + r.h > y && r.x < M + (col + 1) * cellW && r.x + r.w > M + col * cellW; });
    if (crossed) continue;
    const cx = M + col * cellW + cellW / 2;
    out.push(`<g data-frame="creek"><rect x="${cx - 80}" y="${y - 24}" width="160" height="48" rx="10" fill="${C.paper}"/>` +
      `<text x="${cx}" y="${y + 11}" ${SANS} font-size="30" font-weight="800" fill="${C.accentDeep}" text-anchor="middle" letter-spacing="4">CREEK</text></g>`);
  }
  return out.join("\n");
}

function legendSvg(farm, lay) {
  const b = lay.legend, out = [`<g data-frame="legend">`];
  out.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="20" fill="${C.paper2}" stroke="${C.edge}" stroke-width="3"/>`);
  const col = [b.x + 30, b.x + 1330, b.x + 2630];
  const row = [b.y + 46, b.y + 92, b.y + 138];
  const T = (x, y, html, extra = "") => `<text x="${x}" y="${y}" ${SANS} font-size="30" fill="${C.ink}"${extra}>${html}</text>`;
  const B = s => `<tspan font-weight="800">${esc(s)}</tspan>`;
  // row 1
  out.push(`<rect x="${col[0]}" y="${row[0] - 30}" width="64" height="38" rx="10" fill="${C.accent}" stroke="${C.dark}" stroke-width="4"/>`);
  out.push(T(col[0] + 80, row[0], `${B("Path")}: you can Sneak this way. No path, no way through.`));
  out.push(T(col[1], row[0], `${B("Hayloft 3+ ×4")}: roll 3+ to stay hidden, room for 4`));
  out.push(star(col[2] + 20, row[0] - 11, 20));
  out.push(T(col[2] + 52, row[0], `${B("Prank")}: its target, clock jump and boxes`));
  // row 2
  let p = pill(col[0], row[1] - 33, "NOISY", C.alarm, C.light, { h: 44 });
  out.push(p.svg, T(col[0] + p.w + 16, row[1], "Sneak in on 3+"));
  p = pill(col[1], row[1] - 33, "OPEN", C.accentDeep, C.light, { h: 44 });
  out.push(p.svg, T(col[1] + p.w + 16, row[1], "no hiding spots"));
  p = pill(col[2], row[1] - 33, "START", C.deep, C.accentB, { h: 44 });
  out.push(p.svg, T(col[2] + p.w + 16, row[1], "where everyone starts"));
  // row 3
  out.push(`<circle cx="${col[0] + 20}" cy="${row[2] - 11}" r="19" fill="${C.light}" stroke="${C.edge}" stroke-width="3" stroke-dasharray="5 4"/>`);
  out.push(T(col[0] + 52, row[2], `A circle is a place for a token. ${B("In the open")}: not in a hiding spot.`));
  out.push(T(col[1], row[2], esc(farm.name), ` font-weight="800"`));
  out.push(T(col[1] + textW(farm.name, 30, "sansCaps") + 40, row[2], "Placeholder map — replace with final art, keep these positions.", ` font-style="italic" fill="${C.inkSoft}"`));
  out.push(`</g>`);
  return out.join("\n");
}

/** The VTT map of one farm, as an SVG string (deterministic). */
export function vttMap(farmId) {
  const farm = GG.farms[farmId];
  const lay = farmLayout(farmId);
  const { width: W, height: H } = lay;
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Map of ${esc(farm.name)}">`,
    `<title>Map of ${esc(farm.name)} (placeholder VTT map)</title>`,
    `<!-- Generated by book/tools/vtt-maps.mjs from module/logic/layout.mjs: edit those, not this file. PLACEHOLDER art: final art may replace it if every zone, spot, slot and path stays where it is. -->`,
    `<rect x="0" y="0" width="${W}" height="${H}" fill="${PAPER}"/>`,
    `<rect x="40" y="40" width="${W - 80}" height="${H - 80}" rx="36" fill="none" stroke="${C.edge}" stroke-width="4"/>`,
    `<text x="${W / 2}" y="108" ${DISPLAY} font-size="64" font-weight="800" fill="${C.dark}" text-anchor="middle">${esc(farm.name)}</text>`
  ];
  if (farm.creek !== undefined) parts.push(creekSvg(lay, farm.creek));
  for (const z of Object.values(lay.zones)) parts.push(zoneSvg(farm, z));
  for (const p of lay.paths) parts.push(gateSvg(p));
  parts.push(legendSvg(farm, lay));
  parts.push(`</svg>`);
  return parts.join("\n") + "\n";
}

/* ------------------------------------------------------------- tokens -- */
// PLACEHOLDER token art: a 400×400 round token in the book's palette, a simple
// silhouette made of basic shapes and the character's name on a ribbon. The text
// uses common fonts only (Foundry loads token SVGs as images, without page fonts).

const TURKEY_LOOK = {
  // id: [background, body, wing]
  butterbean: [C.accentB, C.dark, C.light],
  pip:        [C.edge, C.inkSoft, C.soft],
  duchess:    [C.accent, C.light, C.ink],
  bigtom:     [C.accentB, C.soft, C.deep],
  noodle:     [C.alarmB, C.light, C.edge],
  clementine: [C.edge, C.inkSoft, C.light],
  gizmo:      [C.accent, C.ink, C.soft],
  hazel:      [C.paper2, C.dark, C.accentDeep]
};
const DOG_FUR = { bramble: C.accentB, puddlewick: C.dark, windy: C.soft };
const FARMER_HAT = { bramble: C.alarm, puddlewick: C.accentB, windy: C.good };

const TOKEN_FONT = `font-family="Alegreya Sans, Arial, Helvetica, sans-serif"`;

function tokenFrame(title, ring, field, name, body) {
  const size = name.length > 15 ? 32 : name.length > 10 ? 38 : 44;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" role="img" aria-label="${esc(title)}">`,
    `<title>${esc(title)} (placeholder token)</title>`,
    `<!-- Generated by book/tools/vtt-maps.mjs. PLACEHOLDER token art: replace with the final art (keep it 400 × 400 and round). -->`,
    `<circle cx="200" cy="200" r="196" fill="${ring}"/>`,
    `<circle cx="200" cy="200" r="174" fill="${field}" stroke="${C.ink}" stroke-width="5"/>`,
    `<clipPath id="field"><circle cx="200" cy="200" r="172"/></clipPath>`,
    `<g clip-path="url(#field)">`, body, `</g>`,
    // under the ribbon, clear of the picture
    `<rect x="132" y="341" width="136" height="24" rx="12" fill="${C.light}" opacity="0.9"/>`,
    `<text x="200" y="358" ${TOKEN_FONT} font-size="14" font-weight="700" letter-spacing="2" fill="${C.ink}" text-anchor="middle">PLACEHOLDER</text>`,
    // the name ribbon, with notched ends
    `<path d="M 22 268 L 378 268 L 360 300 L 378 332 L 22 332 L 40 300 Z" fill="${C.deep}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`,
    `<text x="200" y="${300 + size * 0.35}" ${TOKEN_FONT} font-size="${size}" font-weight="800" fill="${C.accentB}" text-anchor="middle">${esc(name)}</text>`,
    `</svg>`
  ].join("\n") + "\n";
}

function turkeyBody(body, wing) {
  const feathers = [];
  const fan = [C.accentDeep, C.accentB, C.alarm, C.accentB, C.accentDeep, C.accentB, C.alarm];
  for (let i = 0; i < 7; i++) {
    const a = -150 + i * 20;
    const r = a * Math.PI / 180;
    const cx = 200 + Math.cos(r) * 92, cy = 196 + Math.sin(r) * 92;
    feathers.push(`<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="30" ry="64" transform="rotate(${a + 90} ${n(cx)} ${n(cy)})" fill="${fan[i]}" stroke="${C.ink}" stroke-width="4"/>`);
  }
  return [
    ...feathers,
    `<ellipse cx="200" cy="214" rx="78" ry="70" fill="${body}" stroke="${C.ink}" stroke-width="5"/>`,
    `<ellipse cx="236" cy="226" rx="34" ry="44" fill="${wing}" stroke="${C.ink}" stroke-width="4"/>`,
    `<circle cx="168" cy="140" r="34" fill="${body}" stroke="${C.ink}" stroke-width="5"/>`,
    `<circle cx="160" cy="132" r="7" fill="${C.ink}"/><circle cx="158" cy="129" r="2.5" fill="${C.light}"/>`,
    `<path d="M 136 142 L 108 150 L 136 158 Z" fill="${C.accentB}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`,
    `<path d="M 132 156 Q 122 178 132 196 Q 146 182 140 158 Z" fill="${C.alarmB}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`
  ].join("\n");
}

function farmerBody(hat) {
  return [
    `<path d="M 80 400 Q 84 262 200 254 Q 316 262 320 400 Z" fill="${C.soft}" stroke="${C.ink}" stroke-width="5"/>`,
    `<path d="M 168 258 L 200 300 L 232 258" fill="none" stroke="${C.accentB}" stroke-width="8" stroke-linecap="round"/>`,
    `<circle cx="200" cy="178" r="62" fill="${C.edge}" stroke="${C.ink}" stroke-width="5"/>`,
    `<circle cx="178" cy="176" r="7" fill="${C.ink}"/><circle cx="222" cy="176" r="7" fill="${C.ink}"/>`,
    `<path d="M 176 204 Q 200 222 224 204" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`,
    `<ellipse cx="200" cy="128" rx="104" ry="20" fill="${hat}" stroke="${C.ink}" stroke-width="5"/>`,
    `<path d="M 142 126 Q 146 62 200 60 Q 254 62 258 126 Z" fill="${hat}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>`,
    `<rect x="146" y="104" width="108" height="14" fill="${C.deep}"/>`
  ].join("\n");
}

function dogBody(fur) {
  return [
    `<ellipse cx="200" cy="330" rx="110" ry="80" fill="${fur}" stroke="${C.ink}" stroke-width="5"/>`,
    `<ellipse cx="128" cy="170" rx="34" ry="70" transform="rotate(18 128 170)" fill="${C.deep}" stroke="${C.ink}" stroke-width="5"/>`,
    `<ellipse cx="272" cy="170" rx="34" ry="70" transform="rotate(-18 272 170)" fill="${C.deep}" stroke="${C.ink}" stroke-width="5"/>`,
    `<ellipse cx="200" cy="172" rx="76" ry="72" fill="${fur}" stroke="${C.ink}" stroke-width="5"/>`,
    `<ellipse cx="200" cy="208" rx="44" ry="32" fill="${C.light}" stroke="${C.ink}" stroke-width="4"/>`,
    `<ellipse cx="200" cy="192" rx="17" ry="12" fill="${C.ink}"/>`,
    `<circle cx="174" cy="154" r="8" fill="${C.ink}"/><circle cx="226" cy="154" r="8" fill="${C.ink}"/>`,
    `<path d="M 188 222 Q 200 232 212 222" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`
  ].join("\n");
}

function kidBody() {
  return [
    `<path d="M 104 400 Q 108 272 200 266 Q 292 272 296 400 Z" fill="${C.good}" stroke="${C.ink}" stroke-width="5"/>`,
    `<circle cx="200" cy="190" r="58" fill="${C.edge}" stroke="${C.ink}" stroke-width="5"/>`,
    `<circle cx="180" cy="192" r="7" fill="${C.ink}"/><circle cx="220" cy="192" r="7" fill="${C.ink}"/>`,
    `<ellipse cx="200" cy="222" rx="14" ry="10" fill="${C.ink}"/>`,
    `<path d="M 142 172 Q 146 120 200 118 Q 254 120 258 172 Z" fill="${C.alarm}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>`,
    `<path d="M 250 166 L 310 172 L 254 182 Z" fill="${C.alarm}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>`
  ].join("\n");
}

/** Every token: file name → SVG string. The sample art's portraits (book/tools/art-gen/scenes/book.mjs), so a token looks like its turkey in the book. */
export function tokenSvgs() {
  const out = {};
  const farmerKey = { bramble: "bramble", puddlewick: "puddlewick", windy: "windle" };
  for (const t of GG.turkeys) out[`${t.id}.svg`] = portrait(t.id);
  for (const f of Object.values(GG.farms)) {
    out[`farmer-${f.id}.svg`] = folkPortrait("farmer", farmerKey[f.id]);
    out[`dog-${f.id}.svg`] = folkPortrait("dog", f.id);
  }
  out["kid.svg"] = folkPortrait("kid", null);
  return out;
}

/** The kid is not named in the book. */
export const KID_NAME = "The Farmer’s Kid";

/* --------------------------------------------------------- rasterize -- */

const FONT_DIR = join(ROOT, "node_modules", "@fontsource");
function fontFaces() {
  const face = (family, pkg, weight, style) => {
    const f = join(FONT_DIR, pkg, "files", `${pkg}-latin-${weight}-${style}.woff2`);
    if (!existsSync(f)) throw new Error(`font file missing: ${f} (run npm install)`);
    return `@font-face{font-family:"${family}";src:url("${pathToFileURL(f).href}") format("woff2");font-weight:${weight};font-style:${style};}`;
  };
  return [face("Fraunces", "fraunces", 800, "normal"),
    ...[400, 500, 700, 800].map(w => face("Alegreya Sans", "alegreya-sans", w, "normal")),
    face("Alegreya Sans", "alegreya-sans", 400, "italic")].join("\n");
}

/** In the page: every label inside its box, no two labels overlapping. Returns problems. */
function checkLabels() {
  const problems = [];
  const texts = [...document.querySelectorAll("svg text")];
  const boxes = texts.map(t => ({ t, b: t.getBBox() }));
  const name = t => `"${t.textContent.slice(0, 40)}"`;
  for (const { t, b } of boxes) {
    const g = t.closest("g[data-frame]");
    if (!g) continue;
    const frame = g.querySelector(":scope > rect, :scope > circle");
    const f = frame.getBBox();
    if (b.x < f.x - 1 || b.x + b.width > f.x + f.width + 1 || b.y + 4 < f.y || b.y + b.height - 4 > f.y + f.height)
      problems.push(`${name(t)} sticks out of its ${g.dataset.frame} box`);
  }
  // text boxes include the font's line gap: shrink them a little before testing overlap
  const shrink = ({ x, y, width, height }) => ({ x: x + 1, y: y + 5, w: width - 2, h: height - 10 });
  for (let i = 0; i < boxes.length; i++) {
    const a = shrink(boxes[i].b);
    for (let j = i + 1; j < boxes.length; j++) {
      const c = shrink(boxes[j].b);
      if (a.x < c.x + c.w && c.x < a.x + a.w && a.y < c.y + c.h && c.y < a.y + a.h)
        problems.push(`${name(boxes[i].t)} overlaps ${name(boxes[j].t)}`);
    }
  }
  return problems;
}

async function rasterize(svgs) {
  const { chromium } = await import("playwright-core");
  const chrome = process.env.CHROME_PATH ?? (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
  const browser = await chromium.launch(chrome ? { executablePath: chrome } : {});
  const problems = [];
  const work = mkdtempSync(join(tmpdir(), "gg-vtt-maps-"));
  try {
    for (const [farmId, svg] of Object.entries(svgs)) {
      const lay = farmLayout(farmId);
      const tmp = join(work, `${farmId}.html`);
      writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><style>${fontFaces()}\nhtml,body{margin:0;padding:0;background:${PAPER};}svg{display:block;}</style></head><body>${svg}</body></html>`);
      const page = await browser.newPage({ viewport: { width: lay.width, height: lay.height }, deviceScaleFactor: 1 });
      try {
        await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
        await page.evaluate(async () => {
          await document.fonts.ready;
          for (const f of ['800 64px Fraunces', '700 32px "Alegreya Sans"', '800 32px "Alegreya Sans"', '500 32px "Alegreya Sans"', 'italic 400 32px "Alegreya Sans"'])
            if (!(await document.fonts.load(f)).length) throw new Error(`font did not load: ${f}`);
        });
        for (const p of await page.evaluate(checkLabels)) problems.push(`${farmId}: ${p}`);
        const cdp = await page.context().newCDPSession(page);
        let { data } = await cdp.send("Page.captureScreenshot", { format: "webp", quality: 88, clip: { x: 0, y: 0, width: lay.width, height: lay.height, scale: 1 } });
        let buf = Buffer.from(data, "base64");
        if (buf.subarray(8, 12).toString() !== "WEBP") {
          // this Chromium can't encode webp: take a png and convert it with ImageMagick
          const png = join(work, `${farmId}.png`);
          await page.screenshot({ path: png, clip: { x: 0, y: 0, width: lay.width, height: lay.height } });
          const { execFileSync } = await import("node:child_process");
          execFileSync("convert", [png, "-quality", "88", join(MAPS_DIR, `${farmId}.webp`)]);
        } else writeFileSync(join(MAPS_DIR, `${farmId}.webp`), buf);
        const size = statSync(join(MAPS_DIR, `${farmId}.webp`)).size;
        console.log(`wrote assets/maps/${farmId}.webp (${lay.width} × ${lay.height}, ${(size / 1024).toFixed(0)} KB)`);
        if (size > 3 * 1024 * 1024) problems.push(`${farmId}.webp is over 3 MB`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    rmSync(work, { recursive: true, force: true });
  }
  return problems;
}

/* --------------------------------------------------------------- main -- */

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  mkdirSync(MAPS_DIR, { recursive: true });
  mkdirSync(TOKENS_DIR, { recursive: true });
  const svgs = {};
  for (const id of Object.keys(GG.farms)) {
    svgs[id] = vttMap(id);
    writeFileSync(join(MAPS_DIR, `${id}.svg`), svgs[id]);
    console.log(`wrote assets/maps/${id}.svg`);
  }
  const tokens = tokenSvgs();
  for (const [f, svg] of Object.entries(tokens)) writeFileSync(join(TOKENS_DIR, f), svg);
  console.log(`wrote ${Object.keys(tokens).length} tokens in assets/tokens/`);
  if (!process.argv.includes("--svg")) {
    const problems = await rasterize(svgs);
    if (problems.length) {
      console.error(`✗ ${problems.length} label problem(s):\n  ${problems.join("\n  ")}`);
      process.exit(1);
    }
    console.log("✓ every label fits its box, and none overlap");
  }
}
