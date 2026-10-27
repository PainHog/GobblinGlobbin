# Version 1.0 review: combined

This combines three reports, written by the procedure in `docs/REVIEW-PROCEDURE.md`:

- `rules-review.md`: a close reading of every chapter and sheet;
- `playtest-a.md`: a first night (Bramble Farm, Easy, 3 turkeys), plus five drills;
- `playtest-b.md`: a rowdy table (Windy Ridge Farm, Hard, 5 turkeys), plus twelve drills.

It also covers the layout review and two simulator runs (`sim/REPORT.md`, `sim/OPTIONS.md`). The dice logs are in `dice/`. Every ruling that changed the book is a row in `book/REVIEW.md` (rows 11–47), and every design decision is in the Decisions log in `docs/DESIGN.md`.

## 1. Verdict

**Ready to publish once the art and the credits are in.** The rules hold up: both playtests finished without a blocker, and every gap they found has now been answered in the text. The flock won both games, each in round 8. Playtest A won on Easy when Gizmo let the cows out on a Great, and Playtest B won on Hard when Big Tom unplugged the oven with the clock on 2. Both tables found real scares and laughed a lot. The simulator puts the win rates where Chapter 8 says they are. Games run 8 to 13 rounds, about 1 to 2 hours.

Everything still open is for the author: the art (every picture is a marked placeholder), the credit line, a trademark search on the title, and the two balance calls in §4, which are judgment calls rather than defects.

## 2. Fix before anyone outside the table sees it

All fixed in this version. Kept here so the next review can check that they stay fixed.

- **Round 1.** The farmer, dog and kid count for nothing for the whole of round 1, and nobody goes into the Farmhouse (Ch 3, Ch 7, sheets 40–41). Rules review B1, Playtest A issue 1, Playtest B C1 and section 6.
- **In the open.** A turkey in the open is Spotted only when the farmer searches the zone he ends in (Ch 5, Ch 7, glossary, sheet 40). Rules review B2.
- **Forever-Spotted.** A Spotted turkey that isn't in his zone at the start of his turn stops being Spotted (Ch 5, Ch 7). Rules review B3, Playtest B C3.

## 3. Blockers

None are open. The two rules-review blockers (B1, B2) and the undefined Spotted state (B3) are fixed (§2). Neither playtest found a blocker: each gap had an answer a table could agree on in a minute, and the book now gives that answer.

## 4. Design decisions, each with options

| Question | Options | Decision | Why |
|---|---|---|---|
| **Leading the farmer around with “Huh?” tokens** (Playtest B §5: the dominant tactic on Hard) | (a) keep; (b) tokens fade after one farmer's turn; (c) a die between equally near tokens; (d) a detour costs the flock something | **(a) keep**, with a line in Ch 8: a table that gets good at it should move up a difficulty | Stalling the farmer until it's too late is the game. The simulated flock never lures on purpose, so a flock that does will beat the Ch 8 numbers, and that's the game working. Untested variants don't go in a printed book |
| **One Feather on Hard with 4+ turkeys** (Playtest B §5) | (a) keep 1; (b) 2 | **(a) keep** | Hard is about 50–68% in the simulator with 1; a second Feather pushes it toward Standard |
| **Gobble for a Friend chains** (Playtest B C6) | (a) allowed; (b) one rescue per farmer per round | **(a) allowed** | One rescue per Spotted turkey per round already caps it, and a chain of brave turkeys is the funniest thing in the game |
| **Quick Feet plus a Great** (Playtest B C8) | (a) three zones; (b) two | **(a) three** | Matches Soft Steps plus a Great |
| **Show-off during a search** (Playtest B C7) | (a) the pose stays down after the sweep; (b) the pose Spots you; (c) as before (it did nothing) | **(a)** | Funny and fair: he'll be back to look at the turkey striking a pose |
| **Ties between turkeys** (Playtest B M8) | (a) the lowest card number; (b) a die; (c) the Storyteller picks | **(a)** | Quick, and it keeps the Storyteller from choosing who gets caught |
| **Restless** (Playtest A §8: four rounds of Hunkering Down just to stand still) | (a) “can't Hunker Down two rounds in a row”; (b) keep “Hunker Down lowers your own urge by only 1” | **(a)** | It's still a real cost, it keeps that player doing things, and it fits Noodle, who “cannot sit still for one single second” |

## 5. Wording fixes

All applied, with each one logged in `book/REVIEW.md`:

- **Rules-review fixes:**
  - the examples in Ch 3, 4, 5 and 12;
  - the glossary;
  - the decoy, detours and Soft Steps;
  - the dog's route roll;
  - the numbered “Huh?” tokens;
  - American spelling.
- **Playtest A fixes:**
  - event timing ("a farm event is its own thing");
  - the rake against a detour;
  - two gobbles from one roll;
  - the urge-5 warning;
  - dealing the turkeys by dice;
  - the new Restless.
- **Playtest B fixes:**
  - round-1 wording;
  - the event step at the end of the round;
  - hiding when there's room;
  - chains and the walk-in tip;
  - Quick Feet, Chatterbox and Keen Eye wording;
  - the Show-off pose;
  - card-number ties and the path tie;
  - the dog's roll in the open;
  - Close Call reminders for Keen Eye and Scaredy.

## 6. Art

Not started, by request. Every picture is a marked placeholder that gives its size and aspect ratio:

- the front and back covers;
- the part openers;
- a wide header and an end spot for each chapter;
- the turkey badges in Chapter 2;
- the eight portraits on the turkey cards.

Art should follow `book/art/ART-CHECKLIST.md` and `book/art/README.md`, and each recurring turkey needs a reference sheet before any page art is made. The three farm maps are finished and generated from the game data (`book/tools/maps.mjs`), so they can't drift from the farm tables.

## 7. Layout and sheets

Checked by rendering every page:

- **Pages:** 46 in the digital PDF. The print files are a 44-page interior plus separate front and back covers.
- **Fonts:** Fraunces, Alegreya and Alegreya Sans only, all embedded, with no Type 3 fonts.
- **Text size:** no text under 7.5 pt, including the maps.
- **Print files:** they have a 0.125 in bleed.
- **Sheets:** sheets 42–45 are generated from the game data, and the tests check they're up to date:
  - the token sheet now has 20 numbered “Huh?” tokens, after Playtest B had 11 down at once;
  - the turkey cards fit one page per four turkeys.

## 8. Rights and credits

- **Credit line:** a placeholder for the author to word (credits page).
- **Fonts:** credited on the credits page (SIL Open Font License 1.1).
- **Title:** a web search found no product called “Gobble Gobbled”. The nearest names are *Gobblet Gobblers* (Blue Orange Games, a children's strategy game) and *GOBBLE* (a video game). A proper trademark search is still needed before publishing.
- **Images:** none yet, so no source log yet. Start one with the first picture.
- **Echoes of other works:** the turkeys, farms and farmers are original. There are no Pilgrims and no Native American imagery, by design.

## 9. What works

- **One roll does everything:**
  - the red dice make a clear push-your-luck choice every turn;
  - "the result comes first" settled every close moment at both tables.
- **Too Late beats everything:** it's stated in three places, and nobody got it wrong.
- **The farmer's walk list:** it's ordered (detour, rake, token, route) and answered every combination tried.
- **Let It Out as a lure** is the best idea in the game: tense, funny, and it works.
- **Rescues:** Scram and Gobble for a Friend were dramatic whenever they came up. Big Tom's Great from the orchard was Playtest A's best moment.
- **The comedy comes from the dice:**
  - a perfect 6 to stay hidden, then a gobble two feet from the farmer;
  - the farmer spending a whole turn getting his hat back off a windmill sail.
- **Setup:** the setup sums match between Ch 8, the farm chapters and the Storyteller's Card. Every map matches its table path for path.

## For the next version

Paste this into the next working session:

> Read `docs/WORKING-RULES.md` first and follow it. This is *Don't Get Gobble Gobbled*. Version 1.0 has been reviewed (`docs/reviews/v1.0/README.md`, with the rulings in `book/REVIEW.md`). For version 1.1, follow section 4 of `docs/REVIEW-PROCEDURE.md`:
>
> 1. Mark every item in the v1.0 review as fixed, partly fixed, not changed or changed differently, with the new page and quote.
> 2. Re-run `node sim/run.mjs --runs 2000 --seed 1` and `node sim/options.mjs --runs 8000 --size 5`, and compare them with the v1.0 reports.
> 3. Check that no fix opened a new gap.
>
> Keep every generator in sync (`npm test`), rebuild with `node book/build.mjs` and `node book/build.mjs --print`, and commit straight to `main` as Richard Moore.
