/**
 * Rules logic and game data tests — run with `npm test`.
 *  - the pure rules functions (module/logic/rules.mjs) against hand-worked cases;
 *  - every farm's data is playable (routes follow paths, search lines name real spots,
 *    there's room for a full flock, pranks sit in real zones);
 *  - the simulator is deterministic (same seed → same game).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { GG } from "../module/config.mjs";
import * as R from "../module/logic/rules.mjs";
import { makeRng } from "../sim/rng.mjs";
import { playGame } from "../sim/engine.mjs";
import { DEFAULTS } from "../sim/params.mjs";

test("reading a roll: highest white die, Great on a 6, any red 6 gobbles once", () => {
  assert.deepEqual(R.readRoll({ white: [2, 5], red: [1, 3], target: 4 }), { best: 5, success: true, great: false, gobble: false, helperGobble: false });
  assert.equal(R.readRoll({ white: [3], target: 4 }).success, false);
  assert.equal(R.readRoll({ white: [6, 1], target: 5 }).great, true);
  assert.equal(R.readRoll({ white: [4], red: [6, 6, 6], target: 4 }).gobble, true, "two or three red 6s are still one gobble");
  assert.equal(R.readRoll({ white: [4], red: [], helperRed: 6, target: 4 }).helperGobble, true);
  assert.equal(R.readRoll({ white: [4], red: [6], helperRed: 2, target: 4 }).helperGobble, false);
});

test("white dice: one, plus boosts, never more than three", () => {
  assert.equal(R.whiteDice(0), 1);
  assert.equal(R.whiteDice(1), 2);
  assert.equal(R.whiteDice(2), 3);
  assert.equal(R.whiteDice(5), 3);
});

test("the urge: rises by one; past 5 is a gobble and back to 0; Hunker never goes below 0", () => {
  assert.deepEqual(R.riseUrge(0), { urge: 1, gobble: false });
  assert.deepEqual(R.riseUrge(4), { urge: 5, gobble: false });
  assert.deepEqual(R.riseUrge(5), { urge: 0, gobble: true });
  assert.equal(R.lowerUrge(1, 2), 0);
  assert.equal(R.lowerUrge(5, 3), 2);
  assert.equal(R.canPush(4), true);
  assert.equal(R.canPush(5), false, "no push at the maximum");
});

test("clock and Feathers by difficulty and flock size", () => {
  const bramble = GG.farms.bramble;
  assert.equal(R.clockStart("standard", 4, bramble), 20);
  assert.equal(R.clockStart("easy", 2, bramble), 12);
  assert.equal(R.clockStart("hard", 8, bramble), 26);
  assert.equal(R.clockStart("standard", 4, GG.farms.puddlewick), 21);
  assert.equal(R.startingFeathers("standard", 4), 2);
  assert.equal(R.startingFeathers("standard", 3), 3);
  assert.equal(R.startingFeathers("easy", 6), 3);
  assert.equal(R.startingFeathers("hard", 8), 1);
  assert.equal(R.isEventSpace(16), true);
  assert.equal(R.isEventSpace(15), false);
  assert.equal(R.isEventSpace(0), false, "Too Late is not an event space");
});

test("the farmer heads for the nearest Heard marker, newest on a tie, one step at a time", () => {
  const farm = GG.farms.bramble;
  assert.equal(R.chooseHeard(farm, "house", {}), null, "no marker: none");
  assert.equal(R.chooseHeard(farm, "house", { pond: 1, garden: 2 }), "garden");
  assert.equal(R.chooseHeard(farm, "pen", { yard: 1, coop: 3 }), "coop", "equally near: the newest");
  const d = R.distancesFrom(farm, "house");
  const step = R.stepToward(farm, "house", "pond");
  assert.equal(R.distancesFrom(farm, step).pond, d.pond - 1);
  assert.equal(R.stepToward(farm, "pond", "pond"), "pond");
});

for (const farm of Object.values(GG.farms)) {
  test(`${farm.name}: the data is playable`, () => {
    const adj = R.neighbors(farm);
    const zones = Object.keys(farm.zones);
    assert.ok(farm.zones.house && farm.zones.pen, "has a Farmhouse and a Turkey Pen");
    assert.equal(farm.start.turkeys, "pen");
    for (const [a, b] of farm.links) assert.ok(farm.zones[a] && farm.zones[b], `link ${a}–${b} names real zones`);
    const reach = R.distancesFrom(farm, "pen");
    for (const z of zones) assert.ok(reach[z] !== undefined, `${z} can be reached`);
    for (const [id, zone] of Object.entries(farm.zones)) {
      assert.equal(zone.route.length, 6, `${id}: a d6 route line`);
      for (const to of zone.route) assert.ok(adj[id].includes(to), `${id}: the route to ${to} follows a path`);
      if (zone.tags.includes("open")) assert.equal(zone.spots.length, 0, `${id}: open zones have no spots`);
      if (zone.spots.length) {
        assert.equal(zone.search.length, 6, `${id}: a d6 search line`);
        for (const i of zone.search) assert.ok(zone.spots[i], `${id}: the search line names a real spot`);
        for (let i = 0; i < zone.spots.length; i++) assert.ok(zone.search.includes(i), `${id}: every spot can be searched`);
        for (const sp of zone.spots) assert.ok(sp.cover >= 3 && sp.cover <= 5 && sp.room >= 1);
      }
    }
    assert.ok(farm.zones.pen.spots.reduce((n, s) => n + s.room, 0) >= GG.flock.max, "the pen holds a full flock");
    assert.ok(farm.pranks.length >= 6);
    const prankZones = new Set(farm.pranks.map(p => p.zone));
    assert.equal(prankZones.size, farm.pranks.length, "one prank per zone");
    for (const p of farm.pranks) {
      assert.ok(farm.zones[p.zone], `${p.id} sits in a real zone`);
      assert.ok(p.need >= 1 && p.target >= 3 && p.target <= 5);
      if (p.detour) assert.ok(farm.zones[p.detour]);
    }
    assert.equal(farm.pranks.filter(p => p.decoy).length, 1, "exactly one decoy prank");
  });
}

test("every turkey has a real knack and quirk, all different", () => {
  assert.equal(GG.turkeys.length, GG.flock.max);
  assert.equal(new Set(GG.turkeys.map(t => t.knack)).size, GG.turkeys.length);
  assert.equal(new Set(GG.turkeys.map(t => t.quirk)).size, GG.turkeys.length);
  for (const t of GG.turkeys) { assert.ok(GG.knacks[t.knack], t.id); assert.ok(GG.quirks[t.quirk], t.id); }
  assert.equal(GG.events.length, 6, "a d6 event table");
});

test("the simulator is deterministic", () => {
  const play = () => {
    const rng = makeRng(42, "det");
    return playGame({ farmId: "bramble", difficulty: "standard", roster: ["pip", "duchess", "bigtom", "hazel"], rng, params: DEFAULTS });
  };
  const a = play(), b = play();
  assert.equal(a.result, b.result);
  assert.equal(a.rounds, b.rounds);
  assert.deepEqual(a.stats, b.stats);
});

test("every game ends, as a win at Too Late or a loss with one turkey gobbled", () => {
  for (const farmId of Object.keys(GG.farms)) for (const difficulty of Object.keys(GG.difficulty)) for (let n = 2; n <= 8; n += 3) {
    for (let i = 0; i < 40; i++) {
      const rng = makeRng(7, farmId, difficulty, n, i);
      const roster = rng.shuffle(GG.turkeys.map(t => t.id)).slice(0, n);
      const g = playGame({ farmId, difficulty, roster, rng, params: DEFAULTS });
      assert.ok(g.result === "win" || g.result === "loss");
      if (g.result === "win") { assert.equal(g.cause, "tooLate"); assert.equal(g.clockLeft, 0); }
      else { assert.equal(g.cause, "caught"); assert.ok(roster.includes(g.gobbled)); }
      assert.ok(g.rounds < 60);
    }
  }
});
