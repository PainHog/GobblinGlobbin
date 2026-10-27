/**
 * Farm maps — generated from the game data, so the map can't disagree with the
 * farm tables or the simulator (DESIGN-RULES A25).
 *   node book/tools/maps.mjs            → book/art/map-<farm>.svg for every farm
 * Text is at least 24 units = 7.9 pt at the printed width of 6.5 in (art checklist §19).
 * Each zone is a box on the farm's grid (`pos` in module/config.mjs); a path between
 * two zones is a wide gap in the fence; no gap means no path. Every box lists its
 * hiding spots (cover and room) and its prank (target, boxes, clock).
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GG } from "../../module/config.mjs";
import { C } from "./art-gen/lib.mjs";

const ART = join(dirname(fileURLToPath(import.meta.url)), "..", "art");
const W = 1428, H = 1330, M = 18, LEG = 162;
const COLS = 4, ROWS = 3;
const CW = (W - 2 * M) / COLS, RH = (H - LEG - 2 * M) / ROWS;
const PAD = 16;               // gap between a cell and its zone box
const F = `font-family="Alegreya Sans, sans-serif"`;
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A five-pointed star drawn as a shape (no symbol glyphs in the maps: every font stays embedded). */
function star(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${C.accent}" stroke="${C.deep}" stroke-width="1.5"/>`;
}

function wrap(text, max) {
  const words = text.split(" "), lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += " " + w;
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

function box(farm, id, zone) {
  const [cx, cy] = zone.pos;
  const x = M + cx * CW + PAD, y = M + cy * RH + PAD, w = CW - 2 * PAD, h = RH - 2 * PAD;
  const out = [];
  const noisy = zone.tags.includes("noisy"), open = zone.tags.includes("open");
  out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${open ? C.paper2 : C.light}" stroke="${C.dark}" stroke-width="4"${open ? ` stroke-dasharray="14 9"` : ""}/>`);
  let ty = y + 38;
  out.push(`<text x="${x + 16}" y="${ty}" ${F} font-size="31" font-weight="800" fill="${C.deep}">${esc(zone.name)}</text>`);
  // badges under the name (text, never colour alone)
  const badges = [];
  if (noisy) badges.push(["NOISY", C.alarm]);
  if (open) badges.push(["OPEN", C.accentDeep]);
  if (farm.start.turkeys === id) badges.push(["TURKEYS", C.deep]);
  if (farm.start.farmer === id) badges.push(["FARMER & DOG", C.deep]);
  if (badges.length) {
    ty += 12;
    let bx = x + 14;
    for (const [label, fill] of badges) {
      const bw = label.length * 15.5 + 24;
      out.push(`<rect x="${bx}" y="${ty}" width="${bw}" height="28" rx="14" fill="${fill}"/><text x="${bx + bw / 2}" y="${ty + 21}" ${F} font-size="24" font-weight="800" fill="${fill === C.deep ? C.accentB : C.light}" text-anchor="middle" letter-spacing="1">${esc(label)}</text>`);
      bx += bw + 8;
    }
    ty += 28;
  }
  ty += 12;
  out.push(`<line x1="${x + 14}" y1="${ty}" x2="${x + w - 14}" y2="${ty}" stroke="${C.edge}" stroke-width="2"/>`);
  ty += 30;
  if (open) {
    out.push(`<text x="${x + 16}" y="${ty}" ${F} font-size="24" font-style="italic" fill="${C.inkSoft}">Open ground: no spots</text>`);
    ty += 30;
  }
  for (const sp of zone.spots) {
    out.push(`<text x="${x + 16}" y="${ty}" ${F} font-size="24" fill="${C.ink}">${esc(sp.name)}</text>`);
    out.push(`<text x="${x + w - 56}" y="${ty}" ${F} font-size="24" font-weight="800" fill="${C.dark}" text-anchor="end">${sp.cover}+</text>`);
    out.push(`<text x="${x + w - 12}" y="${ty}" ${F} font-size="24" fill="${C.inkSoft}" text-anchor="end">×${sp.room}</text>`);
    ty += 29;
  }
  const prank = farm.pranks.find(p => p.zone === id);
  if (prank) {
    const py = y + h - 16 - 30 - 29 * Math.min(2, wrap(prank.name, 19).length);
    out.push(`<rect x="${x + 8}" y="${py - 26}" width="${w - 16}" height="${y + h - 8 - (py - 26)}" rx="12" fill="${C.paper2}" stroke="${C.accent}" stroke-width="2.5"/>`);
    let ly = py;
    wrap(prank.name, 19).forEach((line, i) => {
      if (i === 0) out.push(star(x + 30, ly - 9, 12));
      out.push(`<text x="${x + 46}" y="${ly}" ${F} font-size="24" font-weight="800" fill="${C.deep}">${esc(line)}</text>`);
      ly += 29;
    });
    const tags = [prank.loud && "loud", prank.detour && "detour", prank.decoy && "decoy"].filter(Boolean).join(" · ");
    out.push(`<text x="${x + 18}" y="${ly}" ${F} font-size="24" fill="${C.ink}"><tspan font-weight="800">${prank.target}+</tspan>${prank.clock ? `  clock −${prank.clock}` : ""}${tags ? `  ${tags}` : ""}</text>`);
    for (let i = 0; i < prank.need; i++) {
      out.push(`<rect x="${x + w - 18 - 26 - i * 32}" y="${ly - 21}" width="24" height="24" rx="4" fill="${C.light}" stroke="${C.ink}" stroke-width="2.5"/>`);
    }
  }
  return out.join("\n");
}

function path(farm, a, b) {
  const [ax, ay] = farm.zones[a].pos, [bx, by] = farm.zones[b].pos;
  if (Math.abs(ax - bx) + Math.abs(ay - by) !== 1) throw new Error(`${farm.id}: ${a}–${b} must be grid neighbours`);
  const cxA = M + ax * CW + CW / 2, cyA = M + ay * RH + RH / 2, cxB = M + bx * CW + CW / 2, cyB = M + by * RH + RH / 2;
  const mx = (cxA + cxB) / 2, my = (cyA + cyB) / 2;
  if (ay === by) return `<rect x="${mx - PAD - 10}" y="${my - 36}" width="${2 * PAD + 20}" height="72" rx="10" fill="${C.accent}" stroke="${C.dark}" stroke-width="3"/>`;
  return `<rect x="${mx - 50}" y="${my - PAD - 10}" width="100" height="${2 * PAD + 20}" rx="10" fill="${C.accent}" stroke="${C.dark}" stroke-width="3"/>`;
}

function legend() {
  const y = H - LEG + 16, out = [];
  out.push(`<rect x="${M}" y="${y}" width="${W - 2 * M}" height="${LEG - 26}" rx="14" fill="${C.paper2}" stroke="${C.edge}" stroke-width="2"/>`);
  const ly = y + 40, ly2 = y + 78;
  out.push(`<rect x="${M + 22}" y="${ly - 22}" width="40" height="28" rx="6" fill="${C.accent}" stroke="${C.dark}" stroke-width="3"/>`);
  out.push(`<text x="${M + 74}" y="${ly}" ${F} font-size="24" fill="${C.ink}"><tspan font-weight="800">Path</tspan>: you can Sneak this way. No path, no way through.</text>`);
  out.push(`<text x="${M + 22}" y="${ly2}" ${F} font-size="24" fill="${C.ink}"><tspan font-weight="800">Hayloft 3+ ×4</tspan>: a hiding spot; roll 3+ to stay hidden; room for 4 turkeys.</text>`);
  out.push(star(W / 2 + 132, ly - 9, 12));
  out.push(`<text x="${W / 2 + 150}" y="${ly}" ${F} font-size="24" fill="${C.ink}"><tspan font-weight="800">Prank</tspan>: its target, clock jump, and boxes.</text>`);
  out.push(`<text x="${W / 2 + 120}" y="${ly2}" ${F} font-size="24" fill="${C.ink}"><tspan font-weight="800">NOISY</tspan>: Sneak in on 3+. <tspan font-weight="800">OPEN</tspan>: no spots.</text>`);
  out.push(`<text x="${M + 22}" y="${y + 116}" ${F} font-size="24" fill="${C.ink}"><tspan font-weight="800">FARMER &amp; DOG</tspan>, <tspan font-weight="800">TURKEYS</tspan>: where they start the game.</text>`);
  return out.join("\n");
}

export function farmMap(farm) {
  const parts = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Map of ${esc(farm.name)}">`,
    `<title>Map of ${esc(farm.name)}</title>`,
    `<rect x="0" y="0" width="${W}" height="${H}" fill="${C.paper}"/>`];
  for (const [a, b] of farm.links) parts.push(path(farm, a, b));
  for (const [id, zone] of Object.entries(farm.zones)) parts.push(box(farm, id, zone));
  parts.push(legend());
  parts.push("</svg>");
  return parts.join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const farm of Object.values(GG.farms)) {
    const f = join(ART, `map-${farm.id}.svg`);
    writeFileSync(f, farmMap(farm) + "\n");
    console.log(`wrote ${f}`);
  }
}
