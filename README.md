# Don't Get Gobble Gobbled (working title)

A comedy party game for 2–8 players and a Storyteller, by **Richard Moore**. It's Thanksgiving morning on a family farm, the farmer wants a turkey for dinner, and the players are the turkeys. They hide, sneak and pull pranks to stall him until it's too late to cook, without letting a gobble slip. If he grabs one turkey, the whole flock loses: they could leave a turkey behind, but that's not how turkeys roll.

**Status:** version 1.0 of the rulebook, complete except for the illustrations (every picture is a marked placeholder) and one credit line the author will word. The built PDFs are in `book/dist/`.

**Foundry VTT system 1.0.0:** fully automated play on Foundry v13 and v14, with all three farms ready to play, the eight turkeys, the farm folk, the rulebook as journals, and the tables and macros. The Storyteller clicks **Farmer's Turn**; players choose their turkey's action; the system rolls, moves the tokens, keeps the clock and posts the story. Design: `docs/VTT-DESIGN.md`; testing in a real Foundry before a release: `TESTING.md`. The VTT maps and tokens are placeholders for the final art (`assets/`). Design decisions: `docs/DESIGN.md`; how the project is run: `docs/WORKING-RULES.md`; one-page rules: `docs/CORE-RULES.md`; balance: `sim/REPORT.md` and `sim/OPTIONS.md`; reviews and playtests: `docs/reviews/`.

## What's in here
| Folder | What it is |
|---|---|
| `docs/` | `WORKING-RULES.md` (how the project is run: read it first), `DESIGN.md` (pitch, name check, early flags, decisions, open questions), `DESIGN-RULES.md` (lessons from earlier games), `REVIEW-PROCEDURE.md`, the kickoff prompt, and reference studies |
| `book/` | The rulebook: HTML chapters built into a typeset PDF (digital and print-on-demand), and `book/art/ART-CHECKLIST.md` |
| `sim/` | The rules simulator: plays the game by the book to measure win and loss rates, game length and option values |
| `module/`, `templates/`, `styles/`, `lang/`, `packs/`, `assets/` | The Foundry VTT game system. `module/logic/` is the game engine, shared with the simulator |
| `tools/`, `test/` | Build, validation and test tooling |

## Commands
```
npm install
npm run build:book          # rulebook PDF → book/dist/
node book/build.mjs --print # print-on-demand interior + covers
npm run check               # validate the Foundry system + run all tests
node sim/run.mjs            # balance report → sim/REPORT.md
node sim/options.mjs        # knack and quirk values → sim/OPTIONS.md
node book/tools/maps.mjs && node book/tools/farm-tables.mjs && node book/tools/sheets.mjs   # regenerate maps, farm tables and sheets from module/config.mjs
npm run build:vtt-maps      # VTT farm maps and placeholder tokens → assets/
npm run build:journals      # the rulebook as Foundry journals → packs/_source/rulebook/
npm run build:packs         # compile the compendiums → packs/
node test/fixtures/parity.mjs --write   # after a deliberate rules change: re-take the engine's fingerprint
```

© 2026 Richard Moore. All rights reserved.
