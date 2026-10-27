# Don't Get Gobble Gobbled (working title): working rules

Author and designer: **Richard Moore**. His earlier games were reviewed with simulators and agent playtests: *Heisty Spideys* (finished, with a fully automated Foundry VTT system), *Don't Get Forked* and *Nine Lives Gang*. The same mistakes kept turning up, and the lessons are written down in this repository.

**Read these before any work:**
1. `docs/DESIGN.md`: the pitch, name check, early flags, decisions and open questions.
2. `docs/DESIGN-RULES.md`: Part A hard rules, Part B questions the core rules must answer, Part C process, Part D release gates. **They are this project's rules.**
3. `book/art/ART-CHECKLIST.md`: before any art.
4. `docs/REVIEW-PROCEDURE.md`: after every version.

## Keep Richard's other games separate
- His other games are separate products: *Heisty Spideys* (SpideyHeist), *Don't Get Forked* (DontGetForked), *Nine Lives Gang*, and his other projects in development.
- If one is ever attached to a session, it is **read-only reference**: never edit, commit to, push to, branch or release from it.
- Copy anything useful into this repository (with a note of where it came from) and adapt the copy. Never import from or link to their files.
- If another game seems to need a change, stop and tell Richard.

## The author decides the game
- **Never invent game content without Richard's approval.** That includes rules, numbers, turkeys, seekers, houses, setting text and the names of mechanics.
- **For each decision,** give two or three concrete options, with a recommendation and why. Wait for his choice, then record it in the `docs/DESIGN.md` Decisions log with the date.
- **When one of his ideas would repeat a mistake from `docs/DESIGN-RULES.md` Part A,** say so straight away, name the rule, and offer options.
- **Wording clarifications and fixes** for things the book already implies may be made directly. Anything that changes numbers or adds rules goes to Richard first.
- **When he gives feedback on art or layout,** fix it and audit the whole book for the same kind of mistake.

## Order of work (DESIGN-RULES Part C)
1. **Design interview** through every Part B question.
2. **One-page core rules** in `docs/CORE-RULES.md`.
3. **Simulator** in `sim/`: escape, gobble and loss rates by difficulty and party size; rescue rates; game length; and turkey and option balance.
4. **Richard approves the core.**
5. **Then** chapters, then art, then layout. No chapters or art before step 4.

After every version, run `docs/REVIEW-PROCEDURE.md`. A version isn't done until it passes the DESIGN-RULES Part D release gates.

## Source of truth
- **The rulebook source is the rules:** `book/src/chapters/*.html`, and `docs/CORE-RULES.md` until chapters exist.
- **Everything else follows the book in the same piece of work:** the simulator, the Foundry system, the quick reference and the sheets.
- **Each rule is stated fully in one place.** After every change, check the quick reference, sheets and trackers against the chapters.
- **Log every ruling** in `book/REVIEW.md`: what changed, where, why, and the source (author, playtest or simulator).

## Quality bars
- **Balance is simulated, not guessed.** Report numbers: win **and** loss rates, per difficulty and party size.
- **Playtests are run by agents strictly by the book, with real dice.** Rolls come from a script and are logged, never invented.
- **Art** passes `book/art/ART-CHECKLIST.md`, including the object and character tables. Look at every render yourself.
- **Layout:** after every build, render a contact sheet and look at every page. Check reflow after every edit.
- **Foundry, if built, is automation-first.** Rules logic lives in Foundry-free modules (`module/logic/`), tested with `node --test`. GM-authoritative writes. Every automation can be switched off.
- **When this repository's name is known,** update the GitHub URLs in `system.json` to match.

## Housekeeping
- Commit and push work in progress often; sessions and agents can stop at any time (usage limits). Resume stopped agents rather than restarting the work.
- **No names of AI products, models or companies anywhere in the repository:** code, docs, the book, commit messages, commit trailers and commit author names.
- **Commits go straight to `main`**, authored as `Richard Moore <171582113+PainHog@users.noreply.github.com>`. Set that identity in the local git config at the start of every session.
- **Credits:** "Game design & writing: Richard Moore". The editing, layout and illustration credit line is a PLACEHOLDER until Richard decides its wording.
