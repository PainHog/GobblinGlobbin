# Don't Get Gobble Gobbled (working title)

A party tabletop roleplaying game by **Richard Moore**. The players are turkeys due on the table tonight. They have to hide, sneak and escape without letting a single gobble slip, and one of them is going to get gobbled. They could leave a turkey behind, but that's not how turkeys roll.

**Status:** early design. The premise is set; the rules aren't written yet. See `docs/DESIGN.md`.

## What's in here
| Folder | What it is |
|---|---|
| `docs/` | `WORKING-RULES.md` (how the project is run: read it first), `DESIGN.md` (pitch, name check, early flags, decisions, open questions), `DESIGN-RULES.md` (lessons from earlier games), `REVIEW-PROCEDURE.md`, the kickoff prompt, and reference studies |
| `book/` | The rulebook: HTML chapters built into a typeset PDF (digital and print-on-demand), and `book/art/ART-CHECKLIST.md` |
| `sim/` | The rules simulator for balance testing, built once the core rules exist |
| `module/`, `templates/`, `styles/`, `lang/`, `packs/` | The Foundry VTT game system (a skeleton for now) |
| `tools/`, `test/` | Build, validation and test tooling |

## Commands
```
npm install
npm run build:book          # rulebook PDF → book/dist/
node book/build.mjs --print # print-on-demand interior + covers
npm run check               # validate the Foundry system + run tests
```

© 2026 Richard Moore. All rights reserved.
