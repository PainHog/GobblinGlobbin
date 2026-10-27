/**
 * Farm geometry for the VTT (Foundry-free, tested with node:test).
 *
 * One source for two things that must agree: the VTT farm maps drawn by
 * book/tools/vtt-maps.mjs, and where the Foundry board puts every token. Units are
 * scene pixels. Each zone is a box on the farm's 4 × 3 grid (`pos` in config.mjs);
 * inside it, every hiding spot is a labelled box with one slot per turkey it holds,
 * and an "In the open" strip has a row of slots for turkeys in the open and a row
 * for the farmer, the dog and the kid. Replacement map art must keep these positions.
 */
import { GG } from "../config.mjs";

export const L = Object.freeze({
  margin: 100, cellW: 980, cellH: 1040, pad: 40, inner: 20,
  title: 90, slot: 100, slotCols: 4, label: 46, spotW: 420, gap: 20,
  openCols: 8, legend: 180, token: 0.9, grid: 100
});

const box = (x, y, w, h) => ({ x, y, w, h });
const center = b => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

function spotBox(x, y, room) {
  const rows = Math.ceil(room / L.slotCols);
  const b = box(x, y, L.spotW, L.label + rows * L.slot + 10);
  const slots = Array.from({ length: room }, (_, i) => ({
    x: x + 10 + (i % L.slotCols) * L.slot + L.slot / 2,
    y: y + L.label + Math.floor(i / L.slotCols) * L.slot + L.slot / 2
  }));
  return { box: b, label: { x: x + 14, y: y + 34 }, slots };
}

/** The whole farm's geometry: zone boxes, spot slots, open slots, visitor slots, prank badges, paths. */
export function farmLayout(farmId) {
  const farm = GG.farms[farmId];
  if (!farm) throw new Error(`unknown farm ${farmId}`);
  const cols = 1 + Math.max(...Object.values(farm.zones).map(z => z.pos[0]));
  const rows = 1 + Math.max(...Object.values(farm.zones).map(z => z.pos[1]));
  const width = 2 * L.margin + cols * L.cellW;
  const height = 2 * L.margin + rows * L.cellH + L.legend;
  const zones = {};
  for (const [id, z] of Object.entries(farm.zones)) {
    const [c, r] = z.pos;
    const b = box(L.margin + c * L.cellW + L.pad, L.margin + r * L.cellH + L.pad, L.cellW - 2 * L.pad, L.cellH - 2 * L.pad);
    const x0 = b.x + L.inner, y0 = b.y + L.inner + L.title;
    const spots = [];
    const colX = [x0, x0 + L.spotW + L.gap];
    let rowY = y0, rowH = 0;
    z.spots.forEach((s, i) => {
      if (i === 2) { rowY += rowH + L.gap; rowH = 0; }
      const sb = spotBox(colX[i % 2], rowY, s.room);
      rowH = Math.max(rowH, sb.box.h);
      spots.push({ ...sb, name: s.name, cover: s.cover, room: s.room });
    });
    // The prank badge sits right of the second row of spots (free in every zone: 3 spots at most).
    const row1H = Math.max(0, ...spots.slice(0, 2).map(s => s.box.h));
    const prankY = y0 + (z.spots.length ? row1H + L.gap : 0);
    const prank = farm.pranks.find(p => p.zone === id);
    const prankBox = prank ? box(colX[1], prankY, L.spotW, 200) : null;
    // The open strip: one row of turkey slots, one row of visitor slots.
    const openBox = box(x0, b.y + b.h - L.inner - (L.label + 2 * L.slot + 10), b.w - 2 * L.inner, L.label + 2 * L.slot + 10);
    const slotAt = (i, row) => ({ x: openBox.x + 30 + i * L.slot + L.slot / 2, y: openBox.y + L.label + row * L.slot + L.slot / 2 });
    zones[id] = {
      id, name: z.name, tags: z.tags, box: b,
      title: { x: b.x + L.inner + 4, y: b.y + L.inner + 56 },
      spots,
      open: { box: openBox, label: { x: openBox.x + 14, y: openBox.y + 34 }, slots: Array.from({ length: L.openCols }, (_, i) => slotAt(i, 0)) },
      visitors: { farmer: slotAt(0, 1), dog: slotAt(1, 1), kid: slotAt(2, 1), kid2: slotAt(3, 1) },
      prank: prank ? { id: prank.id, box: prankBox } : null
    };
  }
  // Paths: a gate across the gap between two neighbouring boxes.
  const paths = (farm.links ?? []).map(([a, b]) => {
    const A = zones[a].box, B = zones[b].box;
    const [ac, ar] = farm.zones[a].pos, [bc, br] = farm.zones[b].pos;
    if (ar === br) {
      const [left, right] = ac < bc ? [A, B] : [B, A];
      return { a, b, rect: box(left.x + left.w - 10, left.y + left.h / 2 - 90, right.x - left.x - left.w + 20, 180) };
    }
    const [top, bottom] = ar < br ? [A, B] : [B, A];
    return { a, b, rect: box(top.x + top.w / 2 - 90, top.y + top.h - 10, 180, bottom.y - top.y - top.h + 20) };
  });
  return { farmId, width, height, cols, rows, zones, paths, legend: box(L.margin, height - L.legend - L.margin / 2, width - 2 * L.margin, L.legend - 20) };
}

const cache = new Map();
/** Cached layout (it never changes at runtime). */
export function layoutFor(farmId) {
  if (!cache.has(farmId)) cache.set(farmId, farmLayout(farmId));
  return cache.get(farmId);
}

/**
 * Where every token goes for a game state: centres in scene pixels.
 * Turkeys fill their spot's slots (or the open strip) in card order, so a
 * redraw never shuffles them.
 */
export function tokenPositions(S) {
  const lay = layoutFor(S.farmId);
  const order = id => GG.turkeys.findIndex(t => t.id === id);
  const used = new Map();
  const take = (zone, spot) => {
    const key = `${zone}|${spot ?? "o"}`;
    const n = used.get(key) ?? 0;
    used.set(key, n + 1);
    const z = lay.zones[zone];
    const slots = spot === null || spot === undefined ? z.open.slots : z.spots[spot].slots;
    return slots[Math.min(n, slots.length - 1)];
  };
  const turkeys = {};
  for (const t of [...S.turkeys].sort((a, b) => order(a.id) - order(b.id))) turkeys[t.id] = take(t.zone, t.spot);
  const v = z => lay.zones[z].visitors;
  return {
    turkeys,
    farmer: v(S.farmer.zone).farmer,
    dog: S.dog ? v(S.dog.zone).dog : null,
    kids: (S.kids ?? []).map((k, i) => (i ? v(k.zone).kid2 : v(k.zone).kid))
  };
}

/**
 * Where every "Huh?" token goes: on a spot's label corner, or on the open strip's
 * label for a token on the zone itself. One marker per (zone, spot), numbered.
 */
export function heardMarkers(S) {
  const lay = layoutFor(S.farmId);
  const out = [];
  for (const [zone, spots] of Object.entries(S.heardSpots ?? {})) {
    const z = lay.zones[zone];
    if (!z) continue;
    for (const [key, seq] of Object.entries(spots)) {
      const spot = key === "o" ? null : Number(key.slice(1));   // keys: "o" (on the zone) or "s<index>"
      const b = spot === null ? z.open.box : z.spots[spot]?.box;
      if (!b) continue;
      out.push({ zone, spot, seq, x: b.x + b.w - 70, y: b.y + 6 });
    }
  }
  return out.sort((a, b) => a.seq - b.seq);
}

/** The zone (and spot, if any) under a scene point, for drag-and-drop. */
export function zoneAt(farmId, x, y) {
  const lay = layoutFor(farmId);
  const inside = b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
  for (const z of Object.values(lay.zones)) {
    if (!inside(z.box)) continue;
    const spot = z.spots.findIndex(s => inside(s.box));
    return { zone: z.id, spot: spot >= 0 ? spot : null };
  }
  return null;
}

export { center };
