# Don't Get Gobble Gobbled — Foundry VTT design (system 1.0.0)

> **Goal (the author):** a fully fleshed-out Foundry system with the whole game inside it: full automation, all three farms ready to play, and the full rulebook.
>
> **Principle:** the system does all the bookkeeping. Players choose their turkey's action and answer quick prompts (Puff Up? Feather? which spot?). The Storyteller clicks **Farmer's turn** and reads out the story card. Every prompt has a rules-correct default and a timeout, so nobody ever fills in a form or tracks a number.

Rules source: `book/src/chapters/*.html` (v1.0) with the rulings in `book/REVIEW.md`. The VTT plays **the same engine as the simulator** (`module/logic/game.mjs`), so the 126,000 simulated games and the table play the same rules. Section 11 lists the interpretations to confirm with the author.

Target: Foundry **v13 and v14** (verified on v14 Stable, 14.368). ApplicationV2 / HandlebarsApplicationMixin throughout, and no jQuery.

---

## 1. Architecture

```
┌─────────────────────────── UI (all clients) ───────────────────────────┐
│ Farm Tracker app · New Game dialog · action/prompt dialogs · turkey    │
│ sheet · chat cards (action cards, farmer's-turn story card, end card)  │
└────────────────────────────────────────────────────────────────────────┘
┌──────────────────────── Runtime (module/vtt/) ─────────────────────────┐
│ store (world setting, active GM only) · gm-ops (User#query)            │
│ io (Foundry dice, prompts routed to the turkey's owner, events → chat) │
│ board (tokens and "Huh?" markers mirrored from the state) · setup      │
└────────────────────────────────────────────────────────────────────────┘
┌──────────────────────── Pure logic (node:test) ────────────────────────┐
│ game.mjs (the engine: state, legal actions, actions, farmer's turn,    │
│ end of round) · layout.mjs (map geometry) · defaults.mjs (prompt       │
│ defaults) · rules.mjs · config.mjs                                     │
└────────────────────────────────────────────────────────────────────────┘
module/contracts.mjs (names) · module/gobble-gobbled.mjs (wiring)
sim/ drives the same game.mjs with sim/policy.mjs answering every prompt.
```

**Three mechanisms carry the design:**

1. **One engine, one state.**
   - The game state is plain JSON, kept in the world setting `game`. It holds the clock, the round, every turkey's zone, spot, urge and Spotted flag, the farmer, dog and kid, the "Huh?" tokens, the pranks, the Feathers, the decoy, the log and the stats.
   - `game.mjs` changes it only through `startGame`, `act(S, io, turkeyId, intent)` and `farmerTurn(S, io)`, which also runs the end of the round and starts the next one.
   - Every random number and every choice comes through `io`:
     - `io.dice({white, red, helper})` and `io.d6(why)` for dice;
     - `io.ask(kind, data)` for choices;
     - `io.emit(event)` for what happened.
   - The simulator answers with a seeded RNG and its policy. Foundry answers with real Foundry rolls and prompts to players.
   - A parity test proves the refactor didn't change a single simulated game.

2. **The active GM owns the world.**
   - Players never write the state. A player's action goes to the active GM as a `User#query` (`gobble-gobbled.op`, op `act`).
   - The GM client then:
     - checks the action is legal with `legalActions`;
     - runs it through the engine;
     - routes each prompt to the owning player (another query, with a timeout and a default);
     - rolls the dice with Foundry `Roll`, so Dice So Nice shows them;
     - posts the chat card;
     - saves the state;
     - moves the tokens.
   - All writes go through one promise queue. One action runs at a time; the tracker shows "Noodle is sneaking…" to everyone.

3. **Undo is a snapshot.**
   - Before every action and every farmer's turn, the store pushes the previous state onto an undo stack (the last 20).
   - The Storyteller can **Undo** from the tracker. It restores the state and the board.
   - Chat cards stay as the record; the undone ones are marked "undone".

If the GM reloads in the middle of an action, nothing is saved yet. The state is still the one from before the action, so the Storyteller can simply ask the player to try again. The orphaned card is marked "interrupted" on the next `ready`.

---

## 2. The game state (`SETTINGS.game`)

```js
{
  v: 1, id, farmId, difficulty, phase: "idle"|"turkeys"|"farmer"|"over",
  round, clock, clockStart, feathers, featherStart, decoy, actionSeq, ctx,
  turkeys: [{ id, knack, quirk, zone, spot /* index | null = in the open */, urge, spotted, spottedWhy,
              acted, helped, lastRise, lastHunker, rescuedRound }],
  seats: { [turkeyId]: { userId, actorId } },
  farmer: { zone, indoors, searchAll, noMove, hurry, detours: [zoneId] },
  dog: { zone } | null, kids: [{ zone }],
  heard: { [zone]: seq },                     // newest token number in each zone
  heardSpots: { [zone]: { [spotKey]: seq } }, // spotKey "o" = on the zone, else the spot index
  heardSeq, progress: { [prankId]: boxes }, done: { [prankId]: true },
  preRoute, over, result: "win"|"loss"|null, cause, gobbled,
  log: [{ round, text }], stats: { … }        // the same stats the simulator reports
}
```

The engine attaches the farm data, path map and difficulty as non-enumerable properties when it hydrates a state. They never reach the setting.

---

## 3. A round in Foundry

1. **New Game** (Storyteller, tracker button). Choose:
   - the farm;
   - the difficulty;
   - the turkeys, and which player plays each one ("Deal by dice" assigns them at random).

   The system then:
   - imports the farm's scene, the turkeys and the farm's farmer, dog and kid from the compendiums (if the world doesn't have them yet);
   - gives each player Owner permission on their turkey;
   - activates the scene;
   - places every token;
   - posts the **setup card**: the clock start, the Feathers, the kid if there is one, and "Round 1: the farmer is still pulling his boots on".

2. **Turkeys' turn.** Each player opens the tracker (or their turkey's sheet) and sees the actions that are legal right now, with a short reason when one isn't ("Restless: not two rounds in a row"):

   | Action | What the dialog asks |
   |---|---|
   | **Sneak** | the zone (Soft Steps: an optional second zone) |
   | **Hunker Down** | yourself or a friend in your zone |
   | **Pull a Prank** | the prank here |
   | **Gobble for a Friend** | which Spotted friend |
   | **Scram** | (nothing; Spotted turkeys only) |
   | **Let It Out** | (nothing) |

   The same dialog offers **Puff Up** (when allowed) and **Lend a Wing** (a friend in the zone who can still help) whenever a roll is coming.

   Dice: white dice for the action, red dice for the urge, and a brown helper die. Each roll gets an **action card** with the dice in their colours, the result ("Works! / Great! / Fails"), any gobble, and what happened (moved, hid, prank boxes, clock jumps).

   Mid-action prompts go to the turkey's owner:
   - **Which spot?** (cover and room listed; default: the best cover with room);
   - **Great: one more zone?**;
   - **Scram: which way?**;
   - **Spend a Feather?**, which goes to the owner of the turkey that gobbled.

   Defaults come from `module/logic/defaults.mjs`. The timeout is set in the settings (default 30 s, 0 = wait for an answer).

3. **Farmer's turn** (Storyteller, tracker button; it's offered once every turkey has acted, or whenever the Storyteller likes). The engine runs all six steps: grab, walk, search, Close Calls, the dog, the kid. Then it runs the end of the round: the clock, the event, the urge rise and the hiccups.
   - Hide rolls and dog sniffs prompt their owners for Puff Up, Lend a Wing and Feathers as they come up.
   - The result is one **story card**: "Farmer Bramble heard something in the Corn rows (token 3), stomped two zones to the Cornfield, and checked the Corn rows. Pip rolled a 5 and stayed hidden…". It's written from `io.emit` events, with every die shown.
   - The board updates step by step, so the farmer's token visibly walks.

4. **The end.**
   - **Too Late** posts the win card, rolls the "What's for dinner instead?" table, and shows the stats: rounds, gobbles, Feathers spent, pranks pulled.
   - **Caught** posts the gobbled card for the turkey that got grabbed.
   - The tracker offers **New Game**.

---

## 4. The board

- **The farm map.** Each farm's scene background is a VTT version of its map (`assets/maps/<farm>.webp`), drawn by `book/tools/vtt-maps.mjs` from `module/logic/layout.mjs`. It has:
  - zone boxes, with a path drawn wherever a gap in the fence lets you through;
  - a labelled box for each hiding spot ("Hayloft 3+ ×4"), with a slot for every turkey it can hold;
  - an **In the open** strip;
  - a prank badge showing its target, clock jump and type.
- **Replacing the art.** The author's art can replace the background as long as it keeps the same zone and spot positions. `layout.mjs` is the contract for that.
- **Token placement.**
  - Turkeys sit in their spot's slots, or in the open strip.
  - The farmer, dog and kid have their own slots in each zone.
  - A Spotted turkey's token gets the **Spotted** status effect and a red ring.
  - Players can't drag their tokens: a drag snaps back and opens the Sneak dialog if the drop was in a zone next door. The token is still selectable, for targeting and for its sheet.
- **"Huh?" tokens.** Each one is a Drawing with its number, on the spot or on the zone. Drawings are created and deleted to mirror `heard` and `heardSpots`, and flagged so only the system touches them.
- **Pranks.** Pranks are shown in the tracker, with box ticks and a "done" stamp. The map badge stays as drawn.

---

## 5. Documents and data models

| Type | Purpose | `system` fields |
|---|---|---|
| Actor `turkey` | One of the eight turkeys | `key` (id in `GG.turkeys`), `breed`, `bird`, `knack`, `quirk` |
| Actor `farmer` | The farmer of one farm | `farm` |
| Actor `dog` | The farm's dog | `farm` |
| Actor `kid` | The farmer's kid | — |

Knack and quirk text come from `CONFIG.GG`, so they always match the book. The live urge, zone and Spotted state come from the game state, never from the actor. The sheet and tracker read the state.

**Compendiums (shipped in the system):**
- **Turkeys:** 8 actors.
- **Farm folk:** 3 farmers, 3 dogs, 1 kid.
- **Farms:** 3 scenes.
- **Rulebook:** the whole book, generated from `book/src/chapters` by `tools/journal-gen.mjs`. One journal entry per part, with a page per chapter and the reference sheets.
- **Tables:** Farm events, and What's for dinner instead?
- **Macros:** open the Farm Tracker, and Farmer's turn.

---

## 6. Settings

| Key | Scope | Default | Meaning |
|---|---|---|---|
| `game` | world, hidden | idle state | the game state |
| `undo` | world, hidden | `[]` | the undo stack (last 20 states) |
| `promptTimeout` | world | 30 | seconds before a prompt takes its default (0 = wait) |
| `showFarmerDice` | world | false | animate the farmer's, dog's and kid's dice with Dice So Nice |
| `trackerOpen` | client | true | open the Farm Tracker on load |

---

## 7. Chat cards (`flags["gobble-gobbled"].card`)

| Kind | When | Content |
|---|---|---|
| `setup` | game start | the farm, difficulty, clock, Feathers, kid, flock and players |
| `action` | each turkey action | the action, dice, result, events, and an "undone" mark |
| `farmer` | each farmer's turn | the story, every die, and the end of the round |
| `end` | game over | win or caught, the stats, and "What's for dinner instead?" |

---

## 8. GM operations (`OPS`)

| Op | Who | Data |
|---|---|---|
| `act` | owner of the turkey, or GM | `{ turkeyId, intent }` |
| `prompt` | GM → player (reverse query) | `{ kind, data, timeout }` → answer |
| `farmer` | GM only (local) | — |
| `newGame` / `undo` / `endGame` | GM only (local) | — |

---

## 9. Tests

- **`test/game-parity.test.mjs`:** the simulator on the shared engine reproduces a stored baseline (seeded games, every farm and difficulty) exactly.
- **`test/game.test.mjs`:** legal actions, and every action and farmer step with scripted dice (Restless, Soft Steps, the decoy, detours, events, Too Late mid-turn, rescues, chains, Show-off poses, ties).
- **`test/layout.test.mjs`:** every spot slot fits inside its zone box, slots don't overlap, and every zone has room for the farmer, dog and kid.
- **`test/vtt.test.mjs`:** on the fake Foundry, one GM and two players:
  - start a game;
  - act through queries, with prompts answered by the players;
  - run farmer's turns, and play to the end;
  - check permissions, tokens, drawings, cards and undo.
- **`tools/validate.mjs`:** templates compile with the registered helpers only, the packs match their source, and the language keys are complete.
- **`TESTING.md`:** a manual smoke test in a real Foundry (v13 and v14), with two browsers, for the release checklist.

---

## 10. Files

```
module/logic/game.mjs, layout.mjs, defaults.mjs, narrate.mjs    pure
module/vtt/store.mjs, io.mjs, ops.mjs, board.mjs, setup.mjs, cards.mjs, settings.mjs
module/apps/tracker.mjs, new-game.mjs, action-dialog.mjs, prompts.mjs, view.mjs
module/documents/data-models.mjs, sheets.mjs
templates/**.hbs  styles/gobble-gobbled.css  lang/en.json
assets/maps/*.webp  assets/tokens/*.svg  assets/ui/*.svg
book/tools/vtt-maps.mjs  tools/journal-gen.mjs  packs/_source/**
```

---

## 11. Interpretations to confirm with the author

1. **Lend a Wing is the roller's pick.** The roller chooses a friend who can help, and the friend's player isn't asked (that's table talk). The book doesn't say whether a friend can refuse.
2. **A Feather goes to the gobbling turkey's player.** The prompt goes to the owner of the turkey that gobbled. The book treats Feathers as the flock's, but someone has to click.
3. **The farmer's turn when turkeys haven't acted.** The Storyteller may start it early. Turkeys that didn't act simply don't act, which the book doesn't forbid.
4. **Ties.** Where the book says "the flock picks" (the order of hide rolls), the system goes in card order.
