/**
 * A full game through the Foundry automation on each of the three farms, on the
 * fake Foundry (tools/fake-foundry.mjs), with the real compendium contents
 * (packs/_source): Bramble on Easy with 2 turkeys (no dog), Puddlewick on
 * Standard with 5 (the dog and the kid), Windy Ridge on Hard with all 8. Each game
 * runs New Game → actions and Farmer's Turns → the end card → End Game, and the
 * board, the clock and the story cards are checked after every step.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GG } from "../module/config.mjs";
import { tokenPositions, heardMarkers } from "../module/logic/layout.mjs";
import * as G from "../module/logic/game.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ID = "gobble-gobbled";
const source = pack => readdirSync(join(ROOT, "packs/_source", pack)).filter(f => f.endsWith(".json")).sort()
  .map(f => JSON.parse(readFileSync(join(ROOT, "packs/_source", pack, f), "utf8")));

const F = await import("../tools/fake-foundry.mjs");
const { game } = F.installFoundry({
  users: [
    { id: "gmUser0000000000", name: "Storyteller", isGM: true },
    ...Array.from({ length: 8 }, (_, i) => ({ id: `player${i}`.padEnd(16, "0"), name: `Player ${i + 1}`, active: false }))
  ]
});
const gm = game.users[0];
game.packs.set(`${ID}.turkeys`, F.makePack(`${ID}.turkeys`, "Actor", source("turkeys")));
game.packs.set(`${ID}.farm-folk`, F.makePack(`${ID}.farm-folk`, "Actor", source("farm-folk")));
game.packs.set(`${ID}.farms`, F.makePack(`${ID}.farms`, "Scene", source("farms")));
game.packs.set(`${ID}.tables`, F.makePack(`${ID}.tables`, "RollTable", source("tables")));

await import("../module/gobble-gobbled.mjs");
F.Hooks.callAll("init");
F.Hooks.callAll("ready");
await F.settle();

const { request } = await import("../module/vtt/ops.mjs");
const { getState } = await import("../module/vtt/store.mjs");
const as = (u, fn) => F.asUser(u, fn);
const S = () => getState();
const scene = () => game.scenes.get(S().sceneId);
const board = () => [...scene().tokens].filter(t => t.flags?.[ID]?.board);
const cards = (kind, gameId) => [...game.messages].filter(m => m.flags?.[ID]?.card?.kind === kind && m.flags[ID].card.gameId === gameId);
const centre = t => ({ x: t.x + 45, y: t.y + 45 });

function assertBoard() {
  const st = S();
  const pos = tokenPositions(st);
  const at = ref => board().find(t => t.flags[ID].board.ref === ref);
  for (const t of st.turkeys) assert.deepEqual(centre(at(t.id)), pos.turkeys[t.id], `${st.farmId}: ${t.id} is in its slot`);
  assert.deepEqual(centre(at("farmer")), pos.farmer, `${st.farmId}: the farmer`);
  if (st.dog) assert.deepEqual(centre(at("dog")), pos.dog, `${st.farmId}: the dog`);
  st.kids.forEach((k, i) => assert.deepEqual(centre(at(i ? "kid2" : "kid")), pos.kids[i], `${st.farmId}: the kid`));
  const want = 1 + st.turkeys.length + (st.dog ? 1 : 0) + st.kids.length;
  assert.equal(board().length, want, `${st.farmId}: ${want} tokens on the board`);
  const drawn = [...scene().drawings].filter(d => d.flags?.[ID]?.board?.role === "huh").map(d => d.text).sort();
  assert.deepEqual(drawn, heardMarkers(st).map(m => `Huh?\n${m.seq}`).sort(), `${st.farmId}: the “Huh?” tokens`);
}

/** Every unacted turkey takes a sensible legal action; then the farmer's turn. Returns when the game ends. */
async function playToEnd() {
  for (let round = 0; round < 60 && !S().over; round++) {
    for (const t of S().turkeys) {
      const st = S();
      if (st.over || G.turkey(st, t.id).acted) continue;
      const legal = G.legalActions(st, t.id).filter(a => !a.why);
      const pick = legal.find(a => a.kind === "scram") ?? legal.find(a => a.kind === "rescue") ?? legal.find(a => a.kind === "prank")
        ?? (round % 2 ? legal.find(a => a.kind === "sneak" && !a.target) : null) ?? legal.find(a => a.kind === "hunker") ?? legal.find(a => a.kind === "letItOut");
      const clock = st.clock;
      await as(gm, () => request("act", { turkeyId: t.id, intent: pick, pre: null }));
      await F.settle();
      assert.ok(S().clock <= clock, "the clock never goes back up");
      assertBoard();
    }
    if (S().over) break;
    const before = S().round;
    await as(gm, () => request("farmer"));
    await F.settle();
    if (!S().over) assert.equal(S().round, before + 1, "the farmer's turn ends the round and starts the next");
    assertBoard();
  }
}

const GAMES = [
  { farmId: "bramble", difficulty: "easy", turkeys: ["pip", "duchess"] },
  { farmId: "puddlewick", difficulty: "standard", turkeys: ["butterbean", "duchess", "noodle", "clementine", "hazel"] },
  { farmId: "windy", difficulty: "hard", turkeys: GG.turkeys.map(t => t.id) }
];

for (const g of GAMES) {
  test(`a whole game on ${GG.farms[g.farmId].name} (${g.difficulty}, ${g.turkeys.length} turkeys) through the automation`, async t => {
    // The Storyteller plays the turkeys whose players are away: every question takes its default.
    F.dialogResponders.length = 0;
    const respond = () => { F.dialogResponders.push(...Array(400).fill(() => null)); };
    respond();
    await as(gm, () => request("newGame", {
      farmId: g.farmId, difficulty: g.difficulty,
      seats: g.turkeys.map((turkeyId, i) => ({ turkeyId, userId: game.users[i + 1].id }))
    }));
    await F.settle();
    const st = S();
    assert.equal(st.farmId, g.farmId);
    assert.equal(scene().flags[ID].farm.farmId, g.farmId, "the farm's own scene");
    assert.ok(scene().active, "the scene is active");
    assert.equal(st.dog ? 1 : 0, GG.difficulty[g.difficulty].dog ? 1 : 0);
    assert.equal(st.kids.length, g.turkeys.length >= 5 ? 1 : 0, "the kid joins with 5 or more turkeys");
    assert.equal(cards("setup", st.id).length, 1);
    assertBoard();

    await playToEnd();
    respond();
    const end = S();
    assert.equal(end.over, true, "the game ended");
    assert.ok(end.result === "win" ? end.clock === 0 : g.turkeys.includes(end.gobbled), `${end.result}: ${end.cause}`);
    assert.ok(cards("farmer", end.id).length >= 1, "story cards for the farmer's turns");
    assert.ok(cards("action", end.id).length >= g.turkeys.length, "an action card for every action");
    assert.equal(cards("end", end.id).length, 1, "one end card");
    const endCard = cards("end", end.id)[0].content;
    assert.match(endCard, end.result === "win" ? /TOO LATE/ : /got gobbled/);
    assert.match(endCard, end.result === "win" ? /dinner instead\?/ : /famous last gobble/, "a line drawn from the right roll table");
    t.diagnostic(`${g.farmId}: ${end.result === "win" ? "the flock won (Too Late)" : `${end.gobbled} got gobbled`} in round ${end.round}; ${cards("action", end.id).length} actions, ${cards("farmer", end.id).length} farmer's turns`);
    assert.deepEqual(F.log.errors, [], "no errors");

    await as(gm, () => request("endGame"));
    await F.settle();
    assert.equal(S(), null, "End Game clears the game");
    F.dialogResponders.length = 0;
  });
}

test("Too Late through the automation: the clock runs out at the end of a round and the flock wins", async t => {
  F.dialogResponders.length = 0;
  F.dialogResponders.push(...Array(200).fill(() => null));
  await as(gm, () => request("newGame", { farmId: "bramble", difficulty: "standard", seats: [{ turkeyId: "pip", userId: game.users[1].id }, { turkeyId: "gizmo", userId: game.users[2].id }, { turkeyId: "hazel", userId: game.users[3].id }] }));
  await F.settle();
  // The Storyteller's world, two rounds from Too Late (as if most of the game had been played).
  const raw = JSON.parse(JSON.stringify(game.settings.get(ID, "game")));
  raw.clock = 2;
  await as(gm, () => game.settings.set(ID, "game", raw));
  await F.settle();
  for (let i = 0; i < 4 && !S().over; i++) {
    for (const tk of S().turkeys) if (!S().over && !G.turkey(S(), tk.id).acted) {
      const legal = G.legalActions(S(), tk.id).filter(a => !a.why);
      await as(gm, () => request("act", { turkeyId: tk.id, intent: legal.find(a => a.kind === "scram") ?? legal.find(a => a.kind === "hunker") ?? legal.find(a => a.kind === "letItOut"), pre: null }));
      await F.settle();
    }
    if (!S().over) { await as(gm, () => request("farmer")); await F.settle(); }
  }
  const end = S();
  t.diagnostic(`too late: ${end.result} (${end.cause}) in round ${end.round}`);
  if (end.result === "win") {
    assert.equal(end.clock, 0);
    const c = cards("end", end.id)[0].content;
    assert.match(c, /TOO LATE/);
    assert.match(c, /dinner instead\?/);
    assert.match(cards("farmer", end.id).at(-1).content, /TOO LATE/, "the farmer's story card says so too");
  } else assert.equal(end.cause, "caught", "only a grab can beat the clock");
  assert.deepEqual(F.log.errors, []);
});
