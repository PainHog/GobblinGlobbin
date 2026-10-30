# Testing the Foundry system in a real Foundry

`npm run check` tests the rules engine, the board geometry and the compendiums. On a stand-in for Foundry (`tools/fake-foundry.mjs`), it also plays whole games through the automation: one on each farm (Easy with 2 turkeys, Standard with 5, Hard with 8) and one that runs out the clock. That stand-in can't show you the real thing, so before every release, play through this checklist in a real Foundry:
- **Foundry v13 and v14:** once on each.
- **Two browsers:** one logged in as the GM, and one as a player (a private window works).
- **Optional:** a third pass with Dice So Nice installed.

## Install
1. Unzip the system zip into a folder named `gobble-gobbled` under Foundry's `Data/systems/`. Make the zip the way the release does (see `.github/workflows/release.yml`), or point Foundry at a local copy of this folder.
2. Create a world with the system, and two users: a Gamemaster and a Player.

## The checklist
Tick each line. Anything marked **(console)** means: keep the browser console open (F12), and there must be no red errors.

### Start-up
- [ ] The world loads with no errors **(console)**, in both browsers.
- [ ] The Farm Tracker opens on its own, for both users.
- [ ] The compendiums are listed under one "Don't Get Gobble Gobbled" folder: Turkeys (8), Farm Folk (7), Farms (3), Rulebook (4), Tables (3), Macros (2).
- [ ] Open the Rulebook (the tracker's **Rulebook** button) and two pages. The text is readable in both the light and the dark theme, and the farm maps and pictures show.

### A new game
- [ ] GM: **New Game**, then Bramble Farm, Standard, and three turkeys, one of them the Player's. The preview says the clock starts at 17 with 3 Feathers.
- [ ] Afterwards:
  - [ ] the Bramble Farm scene is active for both users;
  - [ ] five tokens are in their circles: three turkeys in the Turkey house, the farmer and the dog in the Farmhouse;
  - [ ] each token shows its character's picture from the book;
  - [ ] the setup card is in chat;
  - [ ] the GM's hotbar has "Open the Farm Tracker" and "Farmer's Turn".
- [ ] Player: their own turkey's card has action buttons; the other turkeys' cards don't.
- [ ] Player: dragging their turkey to the Barnyard opens the Sneak dialog, and the token doesn't move until the Sneak is done.

### A round
- [ ] Player: **Sneak** to the Chicken Coop (Noisy, 3+).
  - [ ] White and red dice are rolled, in 3D if Dice So Nice is on.
  - [ ] With two free spots, the player is asked "Where does … hide?".
  - [ ] The action card shows the dice and what happened.
  - [ ] The token lands in the chosen spot's circle.
- [ ] GM: the tracker shows "Turkey is sneaking…" while it runs, then the turkey's row shows "acted".
- [ ] GM: **Farmer's Turn**. The card says he's still pulling on his boots. The clock goes to 16 (an EVENT space), and the event appears on the card.
- [ ] Round 2:
  - [ ] GM: **Farmer's Turn** again. The farmer's token walks.
  - [ ] Any "Huh?" tokens appear as numbered circles on the map and disappear when he searches.
- [ ] A hide roll during his search prompts the turkey's player ("Puff Up? Lend a Wing?"), and the prompt closes itself after the timeout.
- [ ] A gobble with Feathers left asks "Spend a Feather?".
- [ ] **Undo** (GM): the last action is reversed, its card goes grey with "Undone by the Storyteller", and the tokens jump back.

### Edge cases
- [ ] A turkey gets Spotted: its row turns red, and its token has the eye status icon. Only **Scram** is enabled for it.
- [ ] The Player closes their browser mid-game. Their turkey's prompts take the defaults, and nothing hangs.
- [ ] The GM reloads mid-game. The board is put right on load, and the game carries on.

### The end
- [ ] Play on (or set the clock low by playing pranks) until Too Late. The end card shows the stats and a "What's for dinner instead?" line.
- [ ] In a second game, let a turkey get grabbed. The end card shows its famous last gobble.
- [ ] **End Game** clears the tracker. A new game on Windy Ridge (5 turkeys, Hard) adds the kid's token.

## If something fails
- Note the Foundry version, the browser, the step, and any console error.
- Then add a test for it to `test/vtt.test.mjs` if the fake Foundry can show it, and fix it there first.
