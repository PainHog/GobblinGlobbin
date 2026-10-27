/**
 * Farm tables for the rulebook, written from the game data (module/config.mjs).
 *   node book/tools/farm-tables.mjs        → rewrites every <!-- farm-table:ID --> … <!-- /farm-table -->
 *                                            and <!-- prank-table:ID --> … <!-- /prank-table --> region
 *                                            in book/src/chapters/*.html
 * test/book-data.test.mjs fails if a chapter's region differs from what this writes,
 * so the book, the maps and the simulator always describe the same farm.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GG } from "../../module/config.mjs";
import { neighbours } from "../../module/logic/rules.mjs";

const CH = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "chapters");

/** "1–3 Hayloft · 4–5 Old tractor · 6 Feed bins" from a d6 line of names. */
function d6Line(names) {
  const out = [];
  let i = 0;
  while (i < 6) {
    let j = i;
    while (j + 1 < 6 && names[j + 1] === names[i]) j++;
    out.push(`${i === j ? i + 1 : `${i + 1}–${j + 1}`} ${names[i]}`);
    i = j + 1;
  }
  return out.join(" · ");
}

export function farmTable(farm) {
  const adj = neighbours(farm);
  const rows = Object.entries(farm.zones).map(([id, z]) => {
    const tags = [z.tags.includes("open") ? "Open" : null, z.tags.includes("noisy") ? "Noisy" : null].filter(Boolean);
    const name = `${z.name}${tags.length ? ` <span class="tag">${tags.join(", ")}</span>` : ""}`;
    const paths = adj[id].map(n => farm.zones[n].name).join(", ");
    const spots = z.spots.length ? z.spots.map(s => `${s.name} ${s.cover}+ ×${s.room}`).join("; ") : "none";
    const search = z.spots.length ? d6Line(z.search.map(i => z.spots[i].name)) : "—";
    const route = d6Line(z.route.map(r => farm.zones[r].name));
    return `    <tr><td>${name}</td><td>${paths}</td><td>${spots}</td><td>${search}</td><td>${route}</td></tr>`;
  });
  return `<table class="tbl farm">
  <thead><tr><th>Zone</th><th>Paths to</th><th>Hiding spots (cover, room)</th><th>Farmer’s search (d6)</th><th>Farmer’s route (d6)</th></tr></thead>
  <tbody>
${rows.join("\n")}
  </tbody>
</table>`;
}

export function prankTable(farm) {
  const rows = farm.pranks.map(p => {
    const extra = [p.loud && "Loud", p.detour && `Detour (${farm.zones[p.detour].name})`, p.decoy && "Decoy"].filter(Boolean).join("; ");
    return `    <tr><td>${p.name}</td><td>${farm.zones[p.zone].name}</td><td class="num">${p.target}+</td><td class="num">${p.need}</td><td class="num">${p.clock ? `−${p.clock}` : "—"}</td><td>${extra || "—"}</td></tr>`;
  });
  return `<table class="tbl">
  <thead><tr><th>Prank</th><th>Zone</th><th class="num">Target</th><th class="num">Boxes</th><th class="num">Clock</th><th>Also</th></tr></thead>
  <tbody>
${rows.join("\n")}
  </tbody>
</table>`;
}

export const REGIONS = [
  { tag: "farm-table", make: farmTable },
  { tag: "prank-table", make: prankTable }
];

/** Replace every marked region in an HTML string; returns the new string. */
export function fillRegions(html) {
  for (const { tag, make } of REGIONS) {
    html = html.replace(new RegExp(`(<!-- ${tag}:(\\w+) -->)[\\s\\S]*?(<!-- /${tag} -->)`, "g"),
      (_, open, id, close) => `${open}\n${make(GG.farms[id])}\n${close}`);
  }
  return html;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const f of readdirSync(CH).filter(f => f.endsWith(".html"))) {
    const p = join(CH, f), before = readFileSync(p, "utf8"), after = fillRegions(before);
    if (after !== before) { writeFileSync(p, after); console.log(`updated ${f}`); }
  }
}
