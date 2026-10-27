/**
 * The VTT farm geometry (module/logic/layout.mjs): every token slot sits inside its
 * box, boxes don't overlap, and positions for a real game state are all on the map.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { GG } from "../module/config.mjs";
import { farmLayout, tokenPositions, heardMarkers, zoneAt, L } from "../module/logic/layout.mjs";
import * as G from "../module/logic/game.mjs";

const inside = (b, p, r = 0) => p.x - r >= b.x && p.x + r <= b.x + b.w && p.y - r >= b.y && p.y + r <= b.y + b.h;
const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

for (const farmId of Object.keys(GG.farms)) {
  test(`${farmId}: every slot fits its box, and no two boxes overlap`, () => {
    const lay = farmLayout(farmId);
    const r = (L.token * L.grid) / 2;
    for (const z of Object.values(lay.zones)) {
      const boxes = [...z.spots.map(s => s.box), z.open.box, ...(z.prank ? [z.prank.box] : [])];
      for (const b of boxes) assert.ok(inside(z.box, { x: b.x, y: b.y }) && inside(z.box, { x: b.x + b.w, y: b.y + b.h }), `${z.id}: a box leaves the zone`);
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) assert.ok(!overlap(boxes[i], boxes[j]), `${z.id}: boxes ${i} and ${j} overlap`);
      for (const s of z.spots) {
        assert.equal(s.slots.length, s.room);
        for (const p of s.slots) assert.ok(inside(s.box, p, r - 1), `${z.id} ${s.name}: a slot leaves its box`);
      }
      for (const p of [...z.open.slots, ...Object.values(z.visitors)]) assert.ok(inside(z.open.box, p, r - 1), `${z.id}: an open slot leaves the strip`);
      assert.equal(zoneAt(farmId, z.box.x + 5, z.box.y + 5).zone, z.id);
    }
    for (const p of lay.paths) assert.ok(p.rect.w > 0 && p.rect.h > 0, `${p.a}–${p.b}: an empty gate`);
    assert.equal(lay.paths.length, GG.farms[farmId].links.length);
  });
}

test("token positions and markers for a real state are on the map", () => {
  const S = G.newGame({ farmId: "windy", difficulty: "hard", roster: GG.turkeys.map(t => t.id) });
  S.heardSeq = 2; S.heard = { barn: 2 }; S.heardSpots = { barn: { s0: 1, o: 2 } };
  const lay = farmLayout("windy");
  const pos = tokenPositions(S);
  const all = [...Object.values(pos.turkeys), pos.farmer, pos.dog, ...pos.kids];
  for (const p of all) assert.ok(p.x > 0 && p.y > 0 && p.x < lay.width && p.y < lay.height);
  const keys = new Set(Object.values(pos.turkeys).map(p => `${p.x},${p.y}`));
  assert.equal(keys.size, 8, "eight turkeys in the Turkey house get eight different slots");
  assert.deepEqual(heardMarkers(S).map(m => [m.spot, m.seq]), [[0, 1], [null, 2]]);
});
