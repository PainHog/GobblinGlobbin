/**
 * The shared engine (module/logic/game.mjs), with scripted dice and answers:
 * legal actions, and the rules the VTT depends on at the edges.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as G from "../module/logic/game.mjs";

/** An io that plays scripted dice and answers, and records every event. */
function scripted({ dice = [], d6 = [], answers = {} } = {}) {
  const events = [];
  return {
    events,
    dice: req => {
      const d = dice.shift();
      if (!d) throw new Error(`no scripted dice for ${req.turkey} ${req.kind}`);
      assert.equal(d.white.length, req.white, `${req.turkey} ${req.kind}: white dice`);
      return { white: d.white, red: req.red === null ? [] : (d.red ?? Array(req.red).fill(1)), helper: req.helper ? (d.helper ?? 1) : null };
    },
    d6: why => {
      const v = d6.shift();
      if (v === undefined) throw new Error(`no scripted d6 for ${why}`);
      return v;
    },
    ask: (kind, data) => {
      const a = answers[kind];
      if (typeof a === "function") return a(data);
      if (a !== undefined) return a;
      if (kind === "spot") return data.free[0]?.i ?? null;
      return kind === "push" || kind === "feather" ? false : null;
    },
    emit: e => events.push(e)
  };
}

const game = (roster, difficulty = "standard", farmId = "bramble") => {
  const S = G.newGame({ farmId, difficulty, roster });
  S.round = 1; S.phase = "turkeys";
  return S;
};
const tk = (S, id) => G.turkey(S, id);
const why = (S, id, intent) => G.whyNot(S, tk(S, id), intent);

test("round 1: no Farmhouse, the farmer counts for nothing, Noisy zones still need 3+", () => {
  const S = game(["pip", "duchess", "noodle"]);
  const acts = G.legalActions(S, "pip");
  const to = z => acts.find(a => a.kind === "sneak" && a.to === z && !a.then);
  assert.equal(to("house").why, "farmhouseRound1");
  assert.equal(to("yard").why, null);
  assert.equal(to("yard").target, null);
  assert.equal(to("coop").target, 3);
  assert.ok(acts.some(a => a.kind === "sneak" && a.to === "yard" && a.then === "barn" && a.why === null), "Soft Steps offers a second zone");
  assert.ok(!G.legalActions(S, "duchess").some(a => a.then), "only Soft Steps goes two zones");
});

test("a Spotted turkey can only Scram; Restless can't Hunker Down two rounds in a row", async () => {
  const S = game(["pip", "noodle"]);
  await G.act(S, scripted(), "noodle", { kind: "hunker" });
  S.round = 2; for (const t of S.turkeys) t.acted = false;
  assert.equal(why(S, "noodle", { kind: "hunker" }), "restless");
  assert.equal(why(S, "noodle", { kind: "hunker", friend: "pip" }), "restless");
  tk(S, "pip").spotted = true;
  assert.equal(why(S, "pip", { kind: "hunker" }), "spottedOnlyScram");
  assert.equal(why(S, "pip", { kind: "scram" }), null);
  assert.equal(why(S, "noodle", { kind: "scram" }), "notSpotted");
});

test("a Sneak with no roll into the open Barnyard leaves you in the open", async () => {
  const S = game(["pip", "duchess"]);
  await G.act(S, scripted(), "pip", { kind: "sneak", to: "yard" });
  assert.equal(tk(S, "pip").zone, "yard");
  assert.equal(tk(S, "pip").spot, null);
  assert.equal(tk(S, "pip").acted, true);
  await assert.rejects(G.act(S, scripted(), "pip", { kind: "letItOut" }), /acted/);
});

test("Too Late beats everything: a prank that runs the clock out wins mid-turn", async () => {
  const S = game(["duchess", "bigtom"], "easy");
  S.farmer.indoors = false; S.farmer.zone = "orchard";
  S.clock = 3;
  tk(S, "duchess").zone = "barn"; tk(S, "duchess").spot = 0; tk(S, "duchess").urge = 0;
  await G.act(S, scripted({ dice: [{ white: [5] }] }), "duchess", { kind: "prank", prank: "pails" });
  assert.equal(S.clock, 0);
  assert.equal(S.over, true);
  assert.equal(S.result, "win");
  assert.equal(S.cause, "tooLate");
  await assert.rejects(G.act(S, scripted(), "bigtom", { kind: "letItOut" }), /over/);
});

test("the decoy takes a Spotted turkey's place; steps 2–4 are skipped; the dog still acts", async () => {
  const S = game(["pip", "duchess", "noodle"]);
  S.phase = "turkeys"; S.farmer.indoors = false; S.farmer.zone = "pen"; S.decoy = true; S.clock = 11;
  const n = tk(S, "noodle"); n.spotted = true; n.zone = "pen"; n.spot = 0;
  for (const t of S.turkeys) if (t !== n) { t.zone = "orchard"; t.spot = 0; }
  S.dog.zone = "house";
  // dog: 5 (wanders), route die 1 (house → pen); noodle's sniff (fails on purpose: 2);
  // end of round: clock 9 → 8 is an EVENT space: 5 = a cold gust; Pip's hiccups 1.
  const io = scripted({ d6: [5, 1, 5, 1], dice: [{ white: [2] }] });
  await G.farmerPhase(S, io);
  assert.equal(n.spotted, false);
  assert.equal(S.decoy, false);
  assert.equal(S.farmer.zone, "house");
  assert.equal(S.dog.zone, "pen");
  assert.equal(S.clock, 8);
  assert.ok(io.events.some(e => e.t === "decoy" && e.turkey === "noodle"));
  assert.ok(!io.events.some(e => e.t === "search"), "no search after the decoy");
  assert.ok(io.events.some(e => e.t === "bark" && e.turkey === "noodle"));
  assert.equal(S.round, 2);
  assert.equal(S.phase, "turkeys");
});

test("a Show-off pose struck during the farmer's search survives his token sweep", async () => {
  const S = game(["duchess", "bigtom"], "easy");
  S.farmer.indoors = false; S.farmer.zone = "barn";
  const d = tk(S, "duchess"); d.zone = "barn"; d.spot = 0; d.urge = 2;
  tk(S, "bigtom").zone = "orchard";
  S.heard = { barn: 1 }; S.heardSpots = { barn: { s0: 1 } }; S.heardSeq = 1;
  S.clock = 15;
  // Still as a Stump: 2 white dice and no red dice on the hide roll; a 6 is a Great.
  await G.farmersTurn(S, scripted({ dice: [{ white: [6, 2] }] }));
  assert.equal(d.spotted, false);
  assert.deepEqual(Object.keys(S.heardSpots.barn), ["s0"], "the pose's token is back on the Hayloft");
  assert.equal(S.heard.barn, 2);
});

test("Gobble for a Friend: one try per Spotted turkey per round, but a Spotted rescuer is a new turkey to save", async () => {
  const S = game(["noodle", "gizmo", "bigtom"]);
  S.farmer.indoors = false; S.farmer.zone = "pen";
  const n = tk(S, "noodle"); n.spotted = true; n.zone = "pen"; n.spot = 0;
  tk(S, "gizmo").zone = "pen"; tk(S, "gizmo").spot = 0;
  tk(S, "bigtom").zone = "yard"; tk(S, "bigtom").spot = null;
  await G.act(S, scripted({ dice: [{ white: [2] }] }), "gizmo", { kind: "rescue", friend: "noodle" });
  assert.equal(n.spotted, true, "the rescue failed");
  assert.equal(tk(S, "gizmo").spotted, true, "the rescuer is Spotted in the farmer's zone");
  assert.equal(why(S, "bigtom", { kind: "rescue", friend: "noodle" }), "rescuedThisRound");
  assert.equal(why(S, "bigtom", { kind: "rescue", friend: "gizmo" }), null);
  // Big Gobble: +1 white die, so two dice.
  await G.act(S, scripted({ dice: [{ white: [6, 1] }] }), "bigtom", { kind: "rescue", friend: "gizmo" });
  assert.equal(tk(S, "gizmo").spotted, false);
  assert.equal(tk(S, "bigtom").spotted, false, "a Great: he can't tell where it came from");
});

test("a Feather swallows a gobble from the dice when the flock says so", async () => {
  const S = game(["pip", "duchess"]);
  S.farmer.indoors = false; S.farmer.zone = "corn";
  const p = tk(S, "pip"); p.zone = "barn"; p.spot = 0; p.urge = 2;
  const before = S.feathers;
  // Soft Steps: 2 white dice; urge 2: 2 red dice, one of them a 6.
  const io = scripted({ dice: [{ white: [4, 1], red: [6, 2] }], answers: { feather: () => true } });
  await G.act(S, io, "pip", { kind: "sneak", to: "pond" });
  assert.equal(S.feathers, before - 1);
  assert.equal(p.urge, 2, "no gobble, so the urge stays");
  assert.ok(io.events.some(e => e.t === "feather"));
});

test("the state survives a round trip through JSON (a Foundry world setting)", async () => {
  const S = game(["pip", "duchess", "noodle", "hazel", "gizmo"]);
  await G.act(S, scripted(), "pip", { kind: "sneak", to: "yard" });
  const T = JSON.parse(JSON.stringify(S));
  assert.equal(T.farm, undefined, "the farm data isn't stored");
  G.hydrate(T);
  assert.deepEqual(G.legalActions(T, "duchess"), G.legalActions(S, "duchess"));
  assert.equal(T.kids.length, 1, "5 turkeys: the kid helps");
});

test("the decoy frees every turkey he'd spotted in his zone: his arms are full", async () => {
  const S = game(["butterbean", "noodle", "clementine"], "easy");
  S.farmer.indoors = false; S.farmer.zone = "pen"; S.decoy = true; S.clock = 15;
  for (const id of ["noodle", "clementine"]) { const t = tk(S, id); t.spotted = true; t.zone = "pen"; t.spot = 0; t.urge = 2; }
  tk(S, "butterbean").zone = "orchard";
  // Easy: no dog, no kid. End of round: clock 13 → 12 is an EVENT space (5: a cold gust).
  const io = scripted({ d6: [5] });
  await G.farmerPhase(S, io);
  assert.equal(tk(S, "noodle").spotted, false);
  assert.equal(tk(S, "clementine").spotted, false);
  assert.equal(io.events.find(e => e.t === "decoy").turkey, "noodle", "tied on urge: the lowest card number is the one he reaches for");
});
