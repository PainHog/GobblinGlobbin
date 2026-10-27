# Don't Get Gobble Gobbled (working title)

A comedy party game for 2–8 players and a Storyteller, by **Richard Moore**. It's Thanksgiving morning on a family farm, the farmer wants a turkey for dinner, and the players are the turkeys. They hide, sneak and pull pranks to stall him until it's too late to cook, without letting a gobble slip. If he grabs one turkey, the whole flock loses: they could leave a turkey behind, but that's not how turkeys roll.

**Status:** version 1.0 of the rulebook, complete except for the illustrations (every picture is a marked placeholder) and one credit line the author will word. The built PDFs are in `book/dist/`. Design decisions: `docs/DESIGN.md`; how the project is run: `docs/WORKING-RULES.md`; one-page rules: `docs/CORE-RULES.md`; balance: `sim/REPORT.md` and `sim/OPTIONS.md`; reviews and playtests: `docs/reviews/`.

## What's in here
| Folder | What it is |
|---|---|
| `docs/` | `WORKING-RULES.md` (how the project is run: read it first), `DESIGN.md` (pitch, name check, early flags, decisions, open questions), `DESIGN-RULES.md` (lessons from earlier games), `REVIEW-PROCEDURE.md`, the kickoff prompt, and reference studies |
| `book/` | The rulebook: HTML chapters built into a typeset PDF (digital and print-on-demand), and `book/art/ART-CHECKLIST.md` |
| `sim/` | The rules simulator: plays the game by the book to measure win and loss rates, game length and option values |
| `module/`, `templates/`, `styles/`, `lang/`, `packs/` | The Foundry VTT game system (a skeleton for now) |
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
```

© 2026 Richard Moore. All rights reserved.
