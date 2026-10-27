/**
 * The Foundry system on the fake Foundry (tools/fake-foundry.mjs): a Storyteller and
 * two players start a game on Bramble Farm, act through the GM, answer prompts, drag
 * a token, undo, and play on until the game ends. Checks permissions, the board
 * (tokens and "Huh?" drawings), the chat cards and the tracker.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { GG } from "../module/config.mjs";
import { farmLayout, tokenPositions, heardMarkers } from "../module/logic/layout.mjs";

const F = await import("../tools/fake-foundry.mjs");
const { game } = F.installFoundry({
  users: [
    { id: "gmUser0000000000", name: "Storyteller", isGM: true },
    { id: "alice00000000000", name: "Alice" },
    { id: "bob0000000000000", name: "Bob" }
  ]
});
const [gm, alice, bob] = game.users;

// The system's compendiums, built from the game data (the real ones are tested in content.test.mjs).
const ID = "gobble-gobbled";
game.packs.set(`${ID}.turkeys`, F.makePack(`${ID}.turkeys`, "Actor", GG.turkeys.map(t => ({
  name: t.name, type: "turkey", img: `systems/${ID}/assets/tokens/${t.id}.svg`,
  system: { key: t.id, breed: t.breed, bird: t.bird, knack: t.knack, quirk: t.quirk },
  prototypeToken: { name: t.name, width: 0.9, height: 0.9, texture: { src: `systems/${ID}/assets/tokens/${t.id}.svg` } }
}))));
game.packs.set(`${ID}.farm-folk`, F.makePack(`${ID}.farm-folk`, "Actor", [
  ...Object.values(GG.farms).flatMap(f => [
    { name: f.farmer, type: "farmer", system: { farm: f.id } },
    { name: f.dog, type: "dog", system: { farm: f.id } }
  ]),
  { name: "The Farmer's Kid", type: "kid", system: {} }
]));
game.packs.set(`${ID}.farms`, F.makePack(`${ID}.farms`, "Scene", Object.values(GG.farms).map(f => {
  const lay = farmLayout(f.id);
  return { name: f.name, width: lay.width, height: lay.height, grid: { size: 100 }, flags: { [ID]: { farm: { farmId: f.id } } } };
})));

await import("../module/gobble-gobbled.mjs");
F.Hooks.callAll("init");
F.Hooks.callAll("ready");
await F.settle();

const { request } = await import("../module/vtt/ops.mjs");
const { getState } = await import("../module/vtt/store.mjs");
const { FarmTracker } = await import("../module/apps/tracker.mjs");
const as = (u, fn) => F.asUser(u, fn);
const S = () => getState();
const scene = () => game.scenes.get(S().sceneId);
const boardTokens = () => [...scene().tokens].filter(t => t.flags?.[ID]?.board);
const tokenFor = ref => boardTokens().find(t => t.flags[ID].board.ref === ref);
const cards = kind => [...game.messages].filter(m => m.flags?.[ID]?.card?.kind === kind);
const center = t => ({ x: t.x + 45, y: t.y + 45 });

/** The board matches the state: every token in its slot, every "Huh?" token drawn. */
function assertBoard() {
  const st = S();
  const pos = tokenPositions(st);
  for (const t of st.turkeys) assert.deepEqual(center(tokenFor(t.id)), pos.turkeys[t.id], `${t.id}'s token is in its slot`);
  assert.deepEqual(center(tokenFor("farmer")), pos.farmer, "the farmer's token");
  if (st.dog) assert.deepEqual(center(tokenFor("dog")), pos.dog, "the dog's token");
  const drawn = [...scene().drawings].filter(d => d.flags?.[ID]?.board?.role === "huh").map(d => d.text).sort();
  assert.deepEqual(drawn, heardMarkers(st).map(m => `Huh?\n${m.seq}`).sort(), "the “Huh?” tokens are drawn");
  for (const t of st.turkeys) {
    const actor = game.actors.get(st.seats[t.id].actorId);
    assert.equal(actor.statuses.has("gg-spotted"), !!t.spotted, `${t.id}'s Spotted marker`);
  }
}

test("the Storyteller starts a game: compendiums imported, players seated, board laid out", async () => {
  await as(gm, () => request("newGame", {
    farmId: "bramble", difficulty: "standard",
    seats: [{ turkeyId: "pip", userId: alice.id }, { turkeyId: "duchess", userId: bob.id }, { turkeyId: "noodle", userId: null }]
  }));
  await F.settle();
  const st = S();
  assert.equal(st.round, 1);
  assert.equal(st.phase, "turkeys");
  assert.equal(st.clock, 17, "16 + 3 turkeys − 2 for a small flock");
  assert.equal(st.feathers, 3);
  assert.ok(scene().active, "the farm scene is active");
  const pip = game.actors.get(st.seats.pip.actorId);
  assert.equal(pip.ownership[alice.id], 3, "Alice owns Pip");
  assert.equal(pip.ownership.default, 2, "everyone can see Pip's card");
  assert.equal(boardTokens().length, 5, "3 turkeys, the farmer and the dog (no kid with 3 turkeys)");
  assert.equal(cards("setup").length, 1);
  assertBoard();
  assert.deepEqual(F.log.errors, []);
});

test("players act for their own turkeys only, through the GM", async () => {
  const before = S().seq;
  await as(alice, () => request("act", { turkeyId: "duchess", intent: { kind: "hunker" } }));
  assert.equal(S().seq, before, "Alice can't move Bob's turkey");
  assert.ok(F.log.errors.some(e => /can't act for Duchess/.test(e)));
  F.log.errors.length = 0;

  await as(alice, () => request("act", { turkeyId: "pip", intent: { kind: "sneak", to: "yard" }, pre: null }));
  await F.settle();
  assert.equal(S().turkeys.find(t => t.id === "pip").zone, "yard");
  assert.equal(cards("action").length, 1);
  assertBoard();

  // Duchess sneaks into the Noisy Chicken Coop: 3+. White 5, red 2 (urge 1). Bob picks his spot.
  F.diceQueue.push(5, 2);
  F.dialogResponders.push(() => 1);   // "Behind the coop"
  await as(bob, () => request("act", { turkeyId: "duchess", intent: { kind: "sneak", to: "coop" }, pre: { push: false } }));
  await F.settle();
  const d = S().turkeys.find(t => t.id === "duchess");
  assert.equal(d.zone, "coop");
  assert.equal(d.spot, 1, "Bob chose Behind the coop");
  assert.ok(F.log.dialogs.some(x => x.user === "Bob" && /Duchess hides/.test(x.title)));
  assert.match(cards("action").at(-1).content, /gg-die white/);
  assertBoard();
  assert.deepEqual(F.log.errors, []);
});

test("dragging your turkey opens the Sneak dialog instead of moving the token", async () => {
  const t = tokenFor("noodle");
  const from = { x: t.x, y: t.y };
  // Noodle has no player, so the Storyteller plays him: drag him from the Turkey Pen toward the Barnyard.
  const yard = farmLayout("bramble").zones.yard.open.slots[3];
  F.dialogResponders.push(() => ({ intent: { kind: "sneak", to: "yard" }, pre: null }));
  await as(gm, () => scene().updateEmbeddedDocuments("Token", [{ _id: t.id, x: yard.x - 45, y: yard.y - 45 }]));
  await F.settle();
  const n = S().turkeys.find(x => x.id === "noodle");
  assert.equal(n.zone, "yard", "the dialog's Sneak went through");
  assert.notDeepEqual({ x: tokenFor("noodle").x, y: tokenFor("noodle").y }, from);
  assertBoard();
});

test("the farmer's turn: round 1 is the head start, then the round ends", async () => {
  // End of round 1: the clock 17 → 16 is an EVENT space (5: a cold gust); Pip's hiccups (3).
  F.diceQueue.push(5, 3);
  await as(gm, () => request("farmer"));
  await F.settle();
  const st = S();
  assert.equal(st.round, 2);
  assert.equal(st.clock, 16);
  assert.equal(st.farmer.indoors, false);
  assert.equal(cards("farmer").length, 1);
  assert.match(cards("farmer")[0].content, /pulling on his boots/);
  assert.match(cards("farmer")[0].content, /A cold gust/);
  assertBoard();
});

test("Undo puts the game and the board back and marks the card", async () => {
  const before = JSON.stringify(S().turkeys.find(t => t.id === "pip"));
  await as(alice, () => request("act", { turkeyId: "pip", intent: { kind: "letItOut" } }));
  await F.settle();
  assert.notEqual(JSON.stringify(S().turkeys.find(t => t.id === "pip")), before);
  await as(gm, () => request("undo"));
  await F.settle();
  assert.equal(JSON.stringify(S().turkeys.find(t => t.id === "pip")), before);
  assert.equal(cards("action").at(-1).flags[ID].card.undone, true);
  assertBoard();
});

test("the tracker renders for the Storyteller and for a player", async () => {
  const app = await as(alice, () => FarmTracker.open());
  assert.match(app.element.innerHTML, /Bramble Farm/);
  assert.match(app.element.innerHTML, /data-kind="sneak"/, "Alice sees Pip's actions");
  const gmApp = await as(gm, () => new FarmTracker().render({ force: true }));
  assert.match(gmApp.element.innerHTML, /data-action="farmer"/);
});

test("played to the end: Too Late or a turkey gobbled, with an end card", async () => {
  alice.active = false; bob.active = false;   // players away: every question takes its default
  for (let guard = 0; guard < 40 && !S().over; guard++) {
    for (const t of S().turkeys) {
      const st = S();
      if (st.over || t.acted) continue;
      const legal = (await import("../module/logic/game.mjs")).legalActions(st, t.id).filter(a => !a.why);
      const pick = legal.find(a => a.kind === "scram") ?? legal.find(a => a.kind === "prank") ?? legal.find(a => a.kind === "hunker") ?? legal.find(a => a.kind === "letItOut");
      F.dialogResponders.push(...Array(8).fill(() => null));   // the Storyteller plays Noodle: take every default
      await as(gm, () => request("act", { turkeyId: t.id, intent: pick, pre: null }));
      await F.settle();
      F.dialogResponders.length = 0;
    }
    if (!S().over) {
      F.dialogResponders.push(...Array(20).fill(() => null));
      await as(gm, () => request("farmer"));
      await F.settle();
      F.dialogResponders.length = 0;
    }
    assertBoard();
  }
  const st = S();
  assert.equal(st.over, true);
  assert.equal(st.phase, "over");
  assert.ok(st.result === "win" ? st.clock === 0 : st.turkeys.some(t => t.id === st.gobbled));
  assert.equal(cards("end").length, 1);
  assert.deepEqual(F.log.errors, []);
});
