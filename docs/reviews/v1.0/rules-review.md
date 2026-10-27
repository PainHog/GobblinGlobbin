# Rules review: *Don't Get Gobble Gobbled*, Version 1.0

**Scope.** Reading-only rules review, following section 1 of `docs/REVIEW-PROCEDURE.md` and graded against `docs/DESIGN-RULES.md` Parts A and B. The reviewer read every file in `book/src/chapters/` in filename order, and checked the three map pictures (`book/art/map-*.svg`) against their farm tables by extracting every zone, path, spot, prank and prank box from the SVG source. No simulator was run, so the win rates and how often resources get used are not checked here.

After finishing the reading, the reviewer opened `docs/CORE-RULES.md` for one thing only: to check three suspicions (the farmer in round 1, turkeys in the open, and Hazel). The core summary says nothing more on round 1 or on being in the open, and it has the same Hazel wording ("no Close Calls in her zone / Scaredy: Close Calls reach her from next door"). So these problems were there before the chapters were written. Nothing else outside the book was read.

File names are short below: `ch03` means `book/src/chapters/13-ch03.html`, `sheet-40` means `40-sheet-table.html`, and so on.

---

## 1. Verdict

The core holds up well. One roll does everything, the red dice make a clear push-your-luck choice, "the result comes first" and "one thing, one rise" are stated well, and all three farms are carefully built. Every path goes both ways, every route line only goes to neighbouring zones, every search line names a real spot, and every map matches its table zone by zone. The arithmetic in the clock and Feather tables is right in every cell, and the turkey cards match Chapter 2 word for word.

The problems are at the edges, as the design rules predicted. **Two need fixing before anyone outside the table plays:**

1. Round 1: the book says the farmer is in the Farmhouse, next to the Turkey Pen, which makes every first Sneak a 4+ roll. The worked example says those Sneaks need no roll.
2. Turkeys in the open: the glossary and the At the Table sheet say they are Spotted "as soon as he's in your zone". Chapters 3, 5 and 7 say it only happens when he searches.

Next comes a group of states and combinations the book never resolves:

- a Spotted turkey after the farmer has left its zone;
- two detours before one farmer's turn;
- whether the dog moves after the decoy is grabbed;
- which zones set the target when Pip moves two zones;
- whether the dog's roll can make a turkey Spotted.

There is also one dead quirk (Hazel's Scaredy), one worked example with the wrong number of dice (saving Duchess), and one that teaches a weak Feather spend (Chapter 3).

None of this is hard to fix. Each item needs about a sentence.

---

## 2. Blockers and confusing rules

Ordered by how much they hurt at the table. Each one was checked against the text.

### B1. Does the farmer count in round 1? (blocker)
*`ch03`, `ch07`, `ch12`*

- Ch 3, Sneak: "**Roll 4+** if the farmer is in or next to the zone you leave or the zone you enter."
- Ch 3: "In round 1 the farmer is still indoors pulling on his boots, and there is no farmer’s turn at all."
- Ch 12, setup: "**Lay out the map.** Put the farmer in the Farmhouse." and "**Put every turkey in the Turkey House**, in the Turkey Pen."
- Ch 9 farm table: Turkey Pen, "Paths to: Farmhouse, Chicken Coop, Barnyard". The same is true on Puddlewick and Windy Ridge.
- Ch 12 example, round 1: "Pip uses Soft Steps to Sneak two zones, through the Barnyard into the Pumpkin Patch … with the farmer indoors and nothing Noisy on the way, there’s nothing to roll." In the same round, Big Tom rolls only 3+ for the Noisy Chicken Coop.

Read literally, the farmer is in the Farmhouse, which is next to the Turkey Pen, so every round-1 Sneak out of the pen is a 4+ roll. The example treats him as absent. The book also doesn't say whether a turkey can walk into the Farmhouse in round 1, or whether a gobble there in round 1 makes it Spotted. This decides the very first action of every game.

**Fix.** Add to Ch 3 (and to Ch 7 and the At the Table sheet): "In round 1 the farmer, the dog and the kid don't count for anything: no Sneak needs 4+ because of them, and nobody can be Spotted. Turkeys can't enter the Farmhouse in round 1." Or keep him active and correct the example. Choose one.

### B2. In the open in the farmer's zone: Spotted at once, or only when he searches? (blocker)
*`ch13`, `sheet-40` against `ch03`, `ch05`, `ch07`*

- Ch 13: "**In the open** In a zone but not in a hiding spot. The farmer spots you as soon as he’s in your zone (Chapter 5)."
- At the Table: "**In the open:** Spotted as soon as he’s in your zone."
- Ch 5: "On his turn, the farmer walks, then searches the zone he ends in … Everyone **in the open** in his zone is **Spotted** straight away." Ch 7, step 3, Search: "Every turkey **in the open** in his zone is **Spotted**."
- Ch 3, Hunker Down: "If you’re in the open and a spot in your zone has room, you hide in it first; if the farmer is in your zone, that takes a **4+** roll, and if it fails you’re Spotted." That roll would mean nothing if the turkey were already Spotted.

Two questions get different answers depending on which page you read:

- A Sneak that works into his zone and ends in the open (for example the Barnyard): is the turkey Spotted at once, so he grabs it this round? Or only at his search, so it gets another turn?
- He walks *through* a zone where a turkey is in the open, on his way to a token: is it Spotted?

The difference is a whole round of escape time.

**Fix.** Keep the chapters. Change the glossary and the sheet to: "Spotted when the farmer searches your zone (step 3). He doesn't spot anyone in zones he only walks through."

### B3. A Spotted turkey after the farmer leaves its zone (blocker: an undefined core state)
*`ch05`, `ch06`, `ch07`, `sheet-40`*

- Ch 5: "**At the start of the farmer’s next turn, he grabs a Spotted turkey in his zone** …" and "You stop being Spotted when a Scram works, or when a friend’s Gobble for a Friend works. There’s no other way."
- Ch 7, event 2: "The farmer goes straight to the Farmhouse to answer it. Move him there now."
- Ch 6, decoy: "that turkey isn’t Spotted any more, he carries the decoy all the way to the Farmhouse". Only that one turkey; any other Spotted turkeys in the zone stay Spotted.
- At the Table: "Grabbed at the start of the farmer’s next turn **if he’s still in your zone**."

When Grandma calls, or when the decoy is grabbed with two turkeys Spotted, a Spotted turkey ends up away from the farmer. The book never says what happens to it:

- Does it stay Spotted for good?
- Is it grabbed whenever he comes back?
- Does it still skip the urge rise at the end of the round? That would make being Spotted far from the farmer a small advantage.

**Fix.** "At the start of the farmer's turn, any Spotted turkey that isn't in his zone stops being Spotted."

### B4. Two detours before one farmer's turn (confusing)
*`ch07`, `ch06`*

Ch 7: "**Detour.** If a detour prank went off since his last turn, put him straight in that prank’s zone."

Bramble has two detours (Let the cows out, Untie the rowboat) and so do the other two farms. Four turkeys can easily finish both in one turkeys' turn, and the book doesn't say which one he goes to.

**Fix.** "If more than one detour went off, he goes to the one that went off first; the other waits for his next turn."

### B5. After the decoy grab, does the dog (and the kid) still act? (confusing)
*`ch06`, `ch07`, `sheet-41`*

- Ch 6: "… the clock moves down **2**, and his turn ends."
- Ch 7: "… the clock moves down 2, and his turn is over."
- Storyteller's Card: "turn over".
- Compare the detour, Ch 6: "The dog and the kid carry on as normal."

The farmer's turn in Ch 7 includes steps 5 (dog) and 6 (kid), so "his turn is over" reads as skipping them. Close Calls (step 4) at the Farmhouse are left unclear too.

**Fix.** Say it outright: "skip steps 2 to 4; the dog and the kid still act" (or "skip everything").

### B6. Pip's two-zone Sneak: which zones set the roll? (confusing)
*`ch02`, `ch03`, `sheet-42`*

- Ch 2: "+1 white die when you Sneak, and one Sneak can take you two zones (one roll covers both)."
- Ch 3: "Roll 4+ if the farmer is in or next to the zone you leave or the zone you enter."
- Ch 12 example: "nothing Noisy on the way". This assumes the middle zone counts too.

It isn't stated:

- whether the middle zone counts for "next to the farmer" and for Noisy;
- whether Pip may pass *through* the farmer's zone (a failed Sneak only Spots you "if the farmer is in the zone you end in");
- whether a Great adds a third zone.

**Fix.** "Check every zone you leave or enter on the way and use the highest target. You can't pass through the farmer's zone. A Great adds one more zone as usual."

### B7. Hazel's quirk is cancelled by her own knack (confusing; dead option)
*`ch02`, `sheet-43`*

- Knack, Keen Eye: "Close Calls don’t raise the urge of turkeys in your zone."
- Quirk, Scaredy: "A Close Call happens to you when the farmer or the dog ends in your zone or next to it."

Hazel is always a turkey in her own zone, and a Close Call does nothing except add +1 urge (Ch 4, Ch 7). So read literally, Scaredy never changes anything.

**Fix.** "Close Calls don't raise the urge of **other** turkeys in your zone." Or rewrite Scaredy so that Keen Eye doesn't cover it.

### B8. Can the dog's roll make a turkey Spotted? (confusing)
*`ch07`, `ch05`, `ch04`*

- Ch 7, dog: "Every turkey in the dog’s zone that isn’t Spotted rolls **4+** to stay hidden … The dog never grabs and never makes anyone Spotted."
- Ch 4: a gobble with the farmer "**in your zone**" means "you’re **Spotted**".

The dog often ends in the farmer's zone ("follows the farmer around", Ch 5). If a turkey there gobbles on the dog's roll, the gobble rule says Spotted and the dog rule says never. Tables will argue about it.

**Fix.** Add: "A gobble on the dog's roll is an ordinary gobble: if the farmer is in your zone, you're Spotted."

### B9. Moving between spots in the same zone (confusing)
*`ch03`, `ch05`*

No action lets a turkey change spots inside its zone. Sneak is "Move along a path to a zone next to yours", and Hunker Down only hides a turkey that is in the open. Yet Ch 5 encourages the trick: "A turkey that moves away from its token leaves the token behind". Players will ask "can I slip from the Hayloft to the Feed bins?"

**Fix.** Say "No: to change spots, Sneak out" or allow it as part of Hunker Down.

### B10. Smaller gaps (minor)
Each is a one-line ruling.

- **Busy Beak, "success".** "every success you roll on a Prank counts twice". "Success" is not a defined term; the roll "works" or "fails". Read as a dice pool, two dice at or above the target would count as two successes. It never matters in play, because no prank has more than 2 boxes, but say "If your Prank works, tick two boxes."
- **Noodle against a Great on Gobble for a Friend.** Show-off says "a “Huh?” token goes on your spot". A Gobble for a Friend Great says "No token". Say which wins. Show-off also says "your spot", with no rule for when Noodle is in the open.
- **Gizmo, Mother Hen.** If Gizmo uses his Hunker Down to lower a friend by 2, does that friend also get the extra −1 from "every other turkey in your zone"?
- **Big Tom, Restless.** "Hunker Down lowers your own urge by only 1". Does this also apply when a friend Hunkers Down for him?
- **Tokens placed at the same moment.** "if two are equally near, the newest" fails when two tokens go down from one roll: the roller and the helper both gobble, or a loud prank and a gobble. Nothing on the table records which token is newer either.
- **Spotted at the end of the round.** A hiccup or a full-urge gobble in the farmer's zone makes a turkey Spotted, but Ch 5's "one chance" only covers being Spotted during the turkeys' turn or the farmer's turn. Add "or the next turkeys' turn, if it happened at the end of the round."
- **Truck backfire at the end of the round.** It counts as part of the end-of-round rise ("A farm event counts as part of whatever moved the clock onto its space"), so it does nothing to turkeys that aren't Spotted. Does it raise Spotted turkeys, who don't get the end-of-round rise?
- **Hunker Down with a failed hide roll.** "if it fails you’re Spotted. Then **lower your urge by 2**". The "then" suggests the urge still drops. Say so.
- **"Next to".** It is never defined. All the examples mean "joined by a path". On Puddlewick, zones touch across the creek with no path (Willow Trees and Muddy Lane), so a newcomer may count them. Define it: "next to = one path away".
- **Starting on a pie.** Bramble with 4 turkeys on Standard starts on 20, which is a pie (12, 16 and 24 are also possible starts). Read literally, placing the coin is not "landing", so there is no event. Say so.

---

## 3. Contradictions

### 3a. Between chapters

| # | Where | The two texts | Severity |
|---|---|---|---|
| C1 | ch03/ch12 against the ch12 example | The farmer's position counts for Sneak, yet round 1 needs no rolls (B1) | blocker |
| C2 | ch13 against ch03/ch05/ch07 | "as soon as he’s in your zone" against Spotted only in the search step (B2) | blocker |
| C3 | ch05 against ch07 | Ch 5: "the farm dog follows the farmer around". Ch 7: the dog walks its own route line or follows its nose toward the nearest turkey. Nothing makes it follow the farmer. | confusing |
| C4 | ch01 against ch08 against the back cover | Ch 1: "about 45 minutes with 2 turkeys". Ch 8 table: "2 · 1 hour". Back cover: "1 to 2 hours". | minor |
| C5 | ch01 against ch13 | Ch 1: "When the game says “gobble”, it means dinner". Glossary: "**Gobble** A turkey gobbling, from a red 6, a full urge or on purpose." In the rules "gobble" is always the noise, not dinner. | confusing |
| C6 | ch06/ch07 against ch12 | "has a pie on it", "lands on a pie" against "an EVENT space" (Ch 12, twice) | minor |
| C7 | ch05 example against ch02 | Duchess's Scram gets "a third white die", but Still as a Stump only works on rolls to stay hidden (see section 5) | confusing |
| C8 | ch08 against ch11 | Ch 8: Windy Ridge has "a fast farmer". No rule makes Farmer Ruiz faster; it's the map that has all 17 grid connections. | minor |
| C9 | ch03/ch05 against ch10 and ch11 | Noisy zones are "hens, ducks, sheep", but Puddlewick's Goat Pen and Windy Ridge's Pigsty are Noisy too | trivial |
| C10 | ch10 against map-puddlewick.svg | The text: "A creek runs right through the middle of it … the old footbridge and a splashy ford". The SVG draws no creek, bridge or ford. The paths are right, but players can't see "the wrong side". | minor (art) |
| C11 | ch02 Turkey talk against the cards | "A **tom** is a grown-up male turkey", but the cards call Pip and Noodle "jake (a young tom)" | trivial |
| C12 | ch01 against ch09–11 | "Printed from the back of this book: the map of the farm you’re playing (Chapters 9 to 11)". The maps are in the chapters, not at the back. | minor |
| C13 | ch06 against ch12 against sheet-44 | The decoy goes "next to the clock" (Ch 6), "next to the Storyteller" (Ch 12), and in a "Decoy ready" tick box (sheet) | trivial |

### 3b. Quick reference (`sheet-40`, At the Table), line by line against the chapters

| Line on the sheet | Against | Result |
|---|---|---|
| Win and lose | Ch 1, Ch 5, Ch 6 | matches |
| The round, 1–3 | Ch 3, Ch 7 | matches |
| The roll | Ch 3 | matches |
| Boosts: 3 at most | Ch 3 | matches |
| Lend a Wing: "a friend in your zone, once per round, not Spotted" | Ch 3 | leaves out "only one friend can Lend a Wing on any one roll" (minor) |
| Puff Up | Ch 3 | matches |
| Sneak | Ch 3 | matches (Pip's two zones are on his card) |
| Hunker Down | Ch 3 | matches |
| Pull a Prank | Ch 3 | matches |
| Gobble for a Friend | Ch 3 | matches |
| Scram | Ch 3 | matches |
| Let It Out: "Urge to 0, “Huh?” token on your spot." | Ch 3 | leaves out "(or your zone, if you’re in the open)" and "Don’t do it in the same zone as him: that makes you Spotted" (both minor; the gobble box covers them) |
| Urge: "At most once per action, per farmer’s turn, per end of round." | Ch 4: "**Apart from Puffing Up**, your urge rises at most once per action …" | **contradiction**: the sheet drops the Puff Up exception. Read literally, Gizmo Puffing Up and being Lent a Wing would rise only once. (minor) |
| "Past 5: gobble, back to 0." | Ch 4 | matches |
| A gobble, Feather | Ch 4 | matches |
| Spotted | Ch 5 | matches, and is clearer than the chapter about "still in your zone" |
| Hiding: "In the open: Spotted as soon as he’s in your zone." | Ch 5, Ch 7 | **contradiction** (B2) |
| "Close Call: he (or the dog) ends in your zone: +1 urge." | Ch 4: "… and you aren’t Spotted" | **leaves out the Spotted exception** (minor) |
| Not on the sheet at all | Ch 5 | the dog's 4+ roll that players make; Feathers don't come back; prank boxes (a Great ticks two) |

### 3c. Storyteller's Card (`sheet-41`), line by line against Ch 7 and Ch 8

| Line on the card | Against | Result |
|---|---|---|
| Setting up: clock, Feathers, Farmhouse, turkeys | Ch 8, Ch 12 | matches; the arithmetic is right |
| Difficulty | Ch 8 | matches |
| Grab, with the decoy | Ch 7 | matches; leaves out the die roll on a tie (minor); "turn over" is unclear (B5) |
| Walk: detour, rake, token, route | Ch 7 | matches |
| Search | Ch 7 | matches; "(whole family: every spot)" sits inside the "no token" clause, though it applies with tokens too (minor layout) |
| Close Calls | Ch 7 | matches |
| Dog: "Everyone in its zone rolls 4+" | Ch 7: "Every turkey in the dog’s zone **that isn’t Spotted**" | **leaves out the exception** (minor); also leaves out "If that turkey is in its zone already, it stays" and "you pick if two are equally near" |
| Kid | Ch 7 | matches; leaves out "causes no Close Calls" (minor) |
| End of the round | Ch 3, Ch 7 | matches |
| "Farm events: on or past each EVENT space" | Ch 6/7 "pie" | term drift (C6) |
| Events 1–6 | Ch 7 table | match |
| Pranks | Ch 6 | match |

### 3d. Other sheets
- **Turkey cards (42, 43):** all 16 knack and quirk texts match Chapter 2 exactly.
- **Dinner Clock (44):** goes from 27 down to 1, then Too Late. 27 is the biggest possible start (16 + 8 turkeys + 2 for Hard + 1 for the farm), so it fits. The pies are at 24, 20, 16, 12, 8 and 4, labelled "event". There are 4 Feather boxes, which is the biggest possible count. The "Next farmer’s turn" box lists Rake, Whole family and Oven but **not a pending detour** (see A28).
- **Tokens (45):** 8 turkeys, farmer, dog, kid, decoy, 2 clock coins, 12 "Huh?" tokens and 4 Feathers. Fine. "Turn a turkey on its side when it’s Spotted" can't be done with a flat paper token. Say "turn it face down".

---

## 4. A session walked through (Bramble Farm, 4 turkeys, Standard)

**Setup.** Dealt turkeys: Butterbean, Pip, Duchess, Hazel. Clock 20 (16 + 4). Feathers 2. The farmer and the dog are in the Farmhouse; no kid. All four turkeys are in the Turkey house at urge 1. The numbered points are where the Storyteller has to invent a ruling.

1. **The clock starts on 20, a pie.** Is there an event? *Ruling: no; only landing on or passing a pie counts.* (B10)
2. **Round 1, the first Sneak out of the Turkey Pen.** The farmer is in the Farmhouse, next door. Is it 4+ or no roll? *Ruling: the farmer doesn't count in round 1, as the example shows.* (B1, blocker)
3. **Round 1, Butterbean walks into the Farmhouse** to be ready for the oven. Is that allowed? Is she in his zone? Would a gobble there make her Spotted? (B1)
4. **Round 1, Hazel's Keen Eye** "At the start of the turkeys’ turn". There is no farmer's turn this round. *Ruling: skip it in round 1.* (minor)
5. **Round 1, Pip moves two zones, Turkey Pen to Barnyard to Big Barn.** Does the Barnyard count for the roll? (B6)
6. **Round 3, the farmer is in the Barnyard (open ground).** Duchess makes a 4+ Sneak into it on her way across the farm, and it works. She's now in the open in his zone during the turkeys' turn. Is she Spotted now (and grabbed this round), or only if he's still there at his search? Later, the farmer is in the Turkey Pen with a token in the Pumpkin Patch, so he walks Turkey Pen → Barnyard → Pumpkin Patch. Is a turkey in the open in the Barnyard Spotted as he passes through? (B2, blocker)
7. **Round 2, the dog rolls a 3** and reads it on the Farmhouse route line, so it goes to the Turkey Pen. Hazel is in the Chicken Coop next to it. Scaredy gives her a Close Call, and her own Keen Eye cancels it. Does her quirk do anything? (B7) *A design note, not a ruling:* the dog only uses the route line on 3–6 (4–6 on Hard), so the "1–2" entries never apply to it. From the Farmhouse it goes to the Turkey Pen only on a 3, and from the Turkey Pen it never wanders back to the Farmhouse. If that's intended, fine; if not, have the dog roll again for its route.
8. **Round 3, the dog ends in the farmer's zone** (the Big Barn), and Pip's 4+ roll for the dog shows a red 6. Is he Spotted? (B8)
9. **Round 4, Butterbean finishes Let the cows out and Pip finishes Untie the rowboat** in the same turkeys' turn. Which detour does he take? (B4)
10. **Round 5, Duchess in the Hayloft wants to move to the Feed bins** to leave her token behind. Can she? (B9)
11. **Round 5, Pip in the Big Barn rolls with Duchess Lending a Wing.** Both a red 6 and the helper 6 come up. Two gobbles, two tokens at once. Later, which one is "newest"? (B10)
12. **Round 6, a search Spots Duchess. The end-of-round tick then lands on a pie and the event is Grandma calls.** The farmer goes to the Farmhouse. Is Duchess still Spotted? Can she still only Scram? Does she still skip the urge rise? Is she grabbed whenever he comes back? (B3, blocker)
13. **Round 7, the scarecrow decoy is ready and Pip is Spotted.** At the grab the farmer takes the decoy and goes to the Farmhouse: "turn over". Does the dog still move? Close Calls at the Farmhouse? (B5)
14. **Round 8, Pip's hiccup at the end of the round** makes him gobble in the farmer's zone, so he's Spotted at the end of the round. When is his "one chance"? *Ruling: the next turkeys' turn.* (B10)
15. **Round 9, the truck backfires** because the end-of-round tick lands on a pie. Duchess is Spotted again. Does the backfire raise her urge? (B10)
16. **Endgame, clock 3.** Butterbean's Turn off the oven (−3) takes it to 0 in the turkeys' turn while Pip is Spotted. Clear: Too Late wins. The book handles this well ("Too Late beats everything").

Points 2, 6 and 12 are core flow; the others are edges. With a 4-turkey Standard game running about 10–14 rounds (Ch 8), a group will meet points 2 and 6 in almost every game.

---

## 5. Worked examples, checked step by step

### Chapter 3, "Example: a roll" (`ch03`): arithmetic right, teaches weak play
- Pip is in the Big Barn; the farmer is in the Cow Pasture, which is next to the Cornfield. Correct: Cornfield–Cow Pasture is a path, and Big Barn–Cow Pasture isn't. So 4+ is right.
- 3 white dice (base + Soft Steps + Puff Up) and 3 red dice at urge 3: right. The best die is 4, so it works: right. The Corn rows hold 6: right.
- **The teaching problem.** "The farmer is next door and would hear it, so the flock spends one of its Feathers". Taking it step by step:
  - The farmer hears a gobble anywhere: it always places a token.
  - His only route from the Cow Pasture is "1–6 Cornfield", so he comes to the Cornfield next turn whatever happens.
  - With the Feather: Pip stays at urge 3. The farmer checks the Corn rows on a 1–4 (2 in 3). Pip's chance to stay hidden is 39% (43% if he Puffs Up), so his risk of being Spotted is about **38–41%**. He then ends the round at urge 5.
  - Without the Feather: Pip drops to urge 0. The token makes the farmer check the Corn rows for sure, but Pip stays hidden 67% of the time (74% with Puff Up), a risk of about **26–33%**. He ends the round at urge 2, and the flock still has its Feather.
  - So the example spends a scarce Feather and leaves Pip less safe (A17).
- **Fix.** Let the gobble go off and explain why ("now he'll check the Corn rows, but Pip's urge is 0"). Or change the setup so the farmer is *in* the Cornfield, where a gobble means Spotted and the Feather is clearly right.

### Chapter 4, "Example: near and far" (`ch04`): correct, two small gaps
- Clementine, urge 2, is in the Duck Pond and the token goes on the Reeds: right. The farmer in the Farmhouse is 4 paths away by every shortest route (for example Farmhouse–Turkey Pen–Chicken Coop–Big Barn–Duck Pond). At 2 zones a turn, "That gives her a turn to move on" undersells it: she has two turns.
- Noodle's example doesn't say whether his white dice worked. If they failed, he's Spotted anyway and the Feather is wasted. Since "the result comes first", say "his white dice say he's hidden, but …".

### Chapter 5, "Example: saving Duchess" (`ch05`): wrong number of dice
- The search on the Hayloft (3+), with 2 white dice from Still as a Stump and red dice not counting, giving 1 and 2, Spotted: right.
- **Error.** "She Puffs Up for a third white die: **2, 3, 1**." Still as a Stump gives +1 "when you roll to stay hidden" only. A Scram is not a roll to stay hidden, so she has 1 die + Puff Up = **2 white dice**, not 3. Her red dice also *do* count on a Scram (urge + 1 of them), and the example shows none.
- Big Tom in the Chicken Coop is next door to the Big Barn: right. Gobble for a Friend with 2 white dice (Big Gobble) giving 4 and 6, a Great, no token, Duchess freed: right. "Duchess should Sneak away next round, and she’ll need to roll for it": right, since the farmer is in her zone.
- **Fix.** "She Puffs Up for a second white die: **2, 3**; red **4, 1**." Or give her a Wing from a friend in the barn.

### Chapter 6, "Example: turning off the oven" (`ch06`): correct
- Turn off the oven is 5+, 2 boxes, clock −3 (matches the Ch 9 table and the map). Urge 1, 2 white dice (Busy Beak) and 1 red; 5 and 2 works; Busy Beak ticks both boxes; 14 → 11 passes the pie on 12, so there's an event. All right. The farmer in the Cornfield is 4 paths from the Farmhouse: "far away" is fair.

### Chapter 12, "Example of play: the first three rounds" (`ch12`): numbers right, rules wrong in round 1 and one quirk missing
- Setup: Easy, 3 turkeys gives clock 13 (16 + 3 − 2 − 4) and 4 Feathers (2 + 1 + 1). Both right.
- **Round 1.** Pip's Sneak with no roll, and Big Tom's 3+ roll (Noisy), both break the Sneak rule as written, because the farmer is in the Farmhouse next to the Turkey Pen (B1). Big Tom at urge 1 rolls 1 red die: right. Behind the coop: right. Duchess Hunkers 1 → 0: right, and she acts last, after the others have left the Turkey house, so Fussy doesn't trigger. Nice.
- End of round 1: 13 → 12, a pie. Cold gust (−1), then +1, so all three are at 1: right, in the right order.
- **Round 2.** Roll the giant pumpkin is 4+, 1 box, −3; 12 → 9 passes no pie: right. Loud, so a token on the Pumpkin Patch zone: right. Duchess's 4+ (farmer next to the Turkey Pen) gives a 6, a Great; the extra move Coop → Tractor Shed needs no roll (the Farmhouse is next to neither, and the shed isn't Noisy): right. Under the tarp: right. Big Tom with Restless, 1 → 0: right.
- Farmer: three shortest ways of length 3 to the Pumpkin Patch. The first listed path from the Farmhouse is the Turkey Pen, then the Barnyard: right, and a good demonstration of the tie-break. 9 → 8, a pie, whole family. Urges 2/2/1: right.
- **Round 3.** Pip 2 → 3 (Puff Up), 3 white and 3 red, Pumpkin Patch → Apple Orchard (Leaf pile): right; a 4+ roll because he leaves a zone next to the farmer: right. Feather 4 → 3: right. Rooster 3+, −2, 8 → 6, loud token on the Coop: right. Farmer: Pumpkin Patch 1 away, Coop 2 away, both shortest ways checked: right. Whole family checks both spots: right. 6 → 5; urges 4/1/2: right.
- **Missing.** Pip's hiccups are never rolled, at the end of any of the three rounds. The example teaches tables to forget the quirk.
- Term drift: "an EVENT space" (twice), where Ch 6 says "pie".
- The round 3 Feather is reasonable: the gobble token would have pulled the farmer toward Pip and away from the Coop.

---

## 6. Terminology

**Words with two meanings**
- **"gobble"**: in the rules, the noise from a red 6 (Ch 3, Ch 4, glossary). In other places it means being eaten: "That turkey gets gobbled" (Ch 1), "When the game says “gobble”, it means dinner" (Ch 1), "That turkey is gobbled" (Ch 5). It also means eating ("Gobble up the pie berries", Ch 10) and last words ("Famous last gobbles"). The flavour uses are fun, but the Ch 1 sentence is wrong as a rule. Change it to "When a turkey gets *gobbled*, it means dinner".
- **"great"**: Ch 5, "(3+ is great, 5+ is risky)", uses the everyday word right next to the defined term **Great**. Say "3+ is safe".
- **"turn"**: "the turkeys’ turn" (all of them), "the farmer’s turn" (steps 1–6, including the dog and the kid), "his turn ends" (the decoy, unclear whether that includes the dog), "ends his turn in your zone" (Close Call), and "their own go" (Lend a Wing). Define "farmer's turn = steps 1–6".

**Two words for one thing**
- **pie / EVENT space / event**: Ch 6 and Ch 7 say "pie". Ch 12, the Storyteller's Card and the clock sheet say "EVENT space". The sheet shows no pie at all. Pick one and add it to the glossary.
- **success / works**: Busy Beak's "every success" and Ch 6's "how many successes it takes", against Ch 3's "works / fails".
- **next to / next door / neighbours**: used interchangeably and never defined (B10).
- **route die / route line**: Keen Eye says "the farmer’s route die"; the glossary has "Route line". Close enough, but "route roll" would be clearer.
- **Turkey House / Turkey house**: Ch 12 and the Storyteller's Card capitalise it; the farm tables and maps don't.
- **grab / gobbled**: the loss is a "grab" in the rules and "gobbled" in the flavour. Fine, but it feeds the "gobble" problem above.

**Missing from the glossary (Ch 13), though used as rules terms:** Sneak, Hunker Down, Pull a Prank, Gobble for a Friend, Scram, Let It Out (listed only under "Action"), **helper die**, **pie/event space**, **boxes**, **works / fails**, **next to**, **full urge**, **the dog**, **the kid**, **Easy / Standard / Hard**.

**Glossary entries that don't match the chapters**
- "**In the open** … The farmer spots you as soon as he’s in your zone": see B2.
- "**Close Call** … (Chapter 5)": the rule is in Ch 4 and Ch 7.
- "**Gobble** … from a red 6, a full urge or on purpose": leaves out the helper die.
- "**Spotted** … You’ll be grabbed at the start of his next turn unless …": leaves out "if he's in your zone" and the decoy.
- "**Puff Up** … Not at urge 5": leaves out "not when you Gobble for a Friend".

---

## 7. Exact odds of the core roll

**The roll works** (highest white die at or above the target):

| Target | 1 white die | 2 white dice | 3 white dice |
|---|---|---|---|
| 3+ | 2/3 = **66.7%** | 8/9 = **88.9%** | 26/27 = **96.3%** |
| 4+ | 1/2 = **50.0%** | 3/4 = **75.0%** | 7/8 = **87.5%** |
| 5+ | 1/3 = **33.3%** | 5/9 = **55.6%** | 19/27 = **70.4%** |

**A Great** (any white 6): 1 die 16.7%, 2 dice 30.6%, 3 dice 42.1%.

**A gobble** (any red 6), checked against the Chapter 4 table:

| Red dice | Exact | Ch 4 says | Check |
|---|---|---|---|
| 0 | 0 | none | right |
| 1 | 1/6 = 16.7% | 1 in 6 | right |
| 2 | 11/36 = **30.6%** | about 1 in 3 (33%) | a little high; "about 3 in 10" is closer |
| 3 | 91/216 = 42.1% | about 2 in 5 (40%) | right |
| 4 | 671/1296 = 51.8% | about 1 in 2 | right |
| 5 | 4651/7776 = 59.8% | about 3 in 5 | right |

**Staying hidden** needs the roll to work *and* no gobble. Players will want this table more than either one above:

| Cover, white dice | urge 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| 3+, 1 die | 67% | 56% | 46% | 39% | 32% | 27% |
| 3+, 2 dice | 89% | 74% | 62% | 51% | 43% | 36% |
| 4+, 1 die | 50% | 42% | 35% | 29% | 24% | 20% |
| 4+, 2 dice | 75% | 62% | 52% | 43% | 36% | 30% |
| 5+, 1 die | 33% | 28% | 23% | 19% | 16% | 13% |
| 5+, 2 dice | 56% | 46% | 39% | 32% | 27% | 22% |

Puff Up is a real choice, not a free one. On a 4+ spot it raises the chance from 42% to 52% at urge 1, but on a 3+ spot at urge 1 it *lowers* it (74% with 2 dice becomes 67% with 3 dice at urge 2). That's good design. Consider printing the stay-hidden table in Ch 4.

**Against A19:** Greats run 17–42% depending on boosts, and most rolls carry at least one boost (knacks, Wings, Puff Up). So the Great rate is probably above the 15–25% target. Check it in the simulator.

---

## 8. Option audit (knacks and quirks)

| Turkey | Knack | Quirk | Findings |
|---|---|---|---|
| **Butterbean** | Busy Beak | Worrywart | Every pull that works finishes any prank on every farm (no prank has more than 2 boxes), so her Great on a prank adds nothing (dead bonus). It halves the rolls for 3 of Bramble's pranks and 4 on each other farm. Strong but still needs a roll; fine. "Success" is undefined (B10). Worrywart matters. |
| **Pip** | Soft Steps | Hiccups | One roll for two zones skips a roll by design; which zones set the target is undefined, and nothing stops him passing through the farmer's zone (B6). Hiccups: 1 in 6 a round, a real cost, and a Feather can cancel it. Fine. |
| **Duchess** | Still as a Stump | Fussy | The strongest knack: it takes away the gobble risk on the one roll where a gobble means Spotted, and makes Puff Up on those rolls cost only future urge. Not free (the white dice still decide), and Fussy is a real cost (shared spots are common, and everyone starts in the Turkey house). Unclear whether Hunker Down's "hide first" 4+ roll counts as a roll "to stay hidden". |
| **Big Tom** | Big Gobble | Restless | Fine. Restless is softened because Gobble for a Friend and Let It Out both set his urge to 0 anyway. Whether it applies when a friend Hunkers Down for him is unclear (B10). |
| **Noodle** | Quick Feet | Show-off | Fine on Scram. Show-off is **dead on Greats rolled during the farmer's search**: the token lands in his zone and step 3 then removes "every “Huh?” token in his zone". It also conflicts with Gobble for a Friend's "Great: … No token" (B10). |
| **Clementine** | Cool Head | Jumpy | Fine. Jumpy also triggers on friends' deliberate gobbles (Let It Out, Gobble for a Friend), which is a good, real cost. |
| **Gizmo** | Mother Hen | Chatterbox | Fine. It's unclear whether the friend he lowers by 2 also gets the −1 (B10). |
| **Hazel** | Keen Eye | Scaredy | **The quirk is dead** under a literal reading (B7). The second half of the knack (no Close Calls for anyone in her zone) is strong: it removes a main source of urge for a whole crowd and stacks with Gizmo or Clementine. Watch it in the simulator. |

**Other options.** No knack refers to a rule that doesn't exist. Nothing is strictly dominated.

Two things to watch in the simulator:
- **Let It Out against Hunker Down** when far from the farmer. Let It Out sets urge to 0 for the price of a token, and that token often helps by luring the farmer away from friends. At urge 3 or more it may make Hunker Down a choice nobody takes.
- **Puff Up for Duchess on rolls to stay hidden** in the last round, where the extra urge costs nothing.

---

## 9. Part A, rule by rule

| Rule | Result | Reason |
|---|---|---|
| A1 Every state of every track | **Pass** | Urge 0–5: at 5, another rise is a gobble; it never goes below 0; it comes down by Hunker Down, events and gobbles (Ch 4). Clock: 0 = win, nothing raises it, "Too Late beats everything". Feathers don't come back. Prank boxes stay ticked. |
| A2 No feedback spirals | **Pass** | "One thing, one rise" (Ch 4). "The target … never changes in the middle of a roll" (Ch 3). No chases. A gobble resets urge, which corrects itself. |
| A3 No cheap undo of threat | **Pass** | Getting free of Spotted costs an action and a roll. Urge resets cost a token. (Let It Out is a cheap reset by design; see section 8.) |
| A4 Losing always costs; never better than fighting | **Pass** (note) | One grab ends the game for everyone. Note: "If the table needs to stop early, call it a draw" (Ch 7) is a way out of a game about to be lost. Say "only if you must stop, not to dodge a grab". |
| A5 No free spend | **Pass** (note) | Feathers are finite. Puff Up's red die counts on that roll. The exception is Duchess on rolls to stay hidden in the final round. |
| A6 No dominated option | **Pass** | Nothing strictly dominated. Watch Let It Out against Hunker Down. |
| A7 Resources get spent | **Not checked** | Needs the simulator. The text does tell players when to spend ("A gobble right next to the farmer is worth a Feather", Ch 4), but the Ch 3 example teaches a poor spend. |
| A8 Nothing skips a roll for free | **Pass** (note) | Pip's two zones, Busy Beak's double and Duchess's ignored red dice are bounded by the knacks. Pip passing through the farmer's zone on one roll is not ruled out (B6). |
| A9 Every option matters | **Fail** | Hazel's Scaredy is dead (B7). Noodle's Show-off is dead during searches. Busy Beak's Great bonus is dead (no 3-box pranks). The dog never uses route results 1–2 (1–3 on Hard). |
| A10 Limits stated outright | **Pass** | Lend a Wing once per round per turkey, one helper per roll; Gobble for a Friend once per Spotted turkey per round; Straight faces once per search; the decoy, pranks and Feathers are single-use. "Round" is defined. No replacement characters (nobody is knocked out). |
| A11 One source of truth | **Fail** | C1–C6 and the sheet mismatches in section 3. |
| A12 Literal at start and end | **Fail** | Round 1 farmer (B1); start on a pie (B10). The end is fine ("nothing else happens"). |
| A13 "Nearest X" when there is none | **Pass** (note) | No token means the route. No room means the open. A tie on the dog's nearest turkey is handled. The "newest" tie-break fails for tokens placed together. |
| A14 Consumables running out | **Pass** (note) | Feathers, pranks ("the clock still ticks down by itself") and the decoy are covered. 12 "Huh?" tokens with no rule if they run out (coins work; say so). |
| A15 Order of resolution | **Fail** | Unresolved: two detours (B4); the decoy and the dog/kid (B5); Show-off against a Gobble for a Friend Great; the dog's roll gobbling in the farmer's zone (B8); Spotted after the farmer leaves (B3); Mother Hen with a friend target. |
| A16 One meaning per term | **Fail** | gobble, great/Great, pie/EVENT space, success/works, "next to" undefined (section 6). |
| A17 Examples rules-checked and teach good play | **Fail** | Ch 5 Duchess's dice; Ch 12 round 1 against the Sneak rule; Ch 12 leaves out the hiccups; Ch 3 Feather spend (section 5). |
| A18 Say the true cost | **Pass** (note) | Losing is stated up front, and "the urge stays where it is" after a Feather. Add: a Wing lent during the farmer's search puts the helper in his zone, so a helper 6 makes the *helper* Spotted. |
| A19 Simulated targets | **Not checked** | Reading only. The book claims Easy ~90%, Standard ~80% (target ~75%, a little high) and Hard ~60%. The Great rate is likely above 15–25% (section 7). |
| A20 Labels from simulated results | **Not checked** | Ch 8 says the column "comes from playing tens of thousands of games … with a computer". Not verified here. |
| A21 3, 4 and 5 players | **Pass** (as written) | Explicit adjustments for 2–8: clock, Feathers, the kid. The numbers are not verified. |
| A22 Every clock binds | **Pass** | The Dinner Clock is the win condition. Every game ends on it or on a grab. |
| A23 Partial wins are partial | **n/a** | There are no partial wins: win or lose (a draw only if the table stops). |
| A24 Watch long events | **Pass** | Every action is one roll. Nothing runs for rounds inside one turn. |
| A25 Ready-made scenarios complete | **Pass** (note) | All three maps match their tables (paths 16/15/17, every spot, cover, room, prank target, clock number and box count). Many routes in and out. Every obstacle has a target. The farmer, dog and kid all have d6 procedures. Scram needs no particular turkey. Every knack has something to use on every farm. Notes: the Puddlewick creek isn't drawn (C10); "a fast farmer" (C8). |
| A26 Generators validated | **n/a** | The book has no generators. |
| A27 First night under 30 minutes | **Pass** | What to print (Ch 12); every die, including a helper die in a third colour (Ch 1, Ch 12); what to track (urge on the card, the clock sheet, Feather boxes); a tie-break for picking turkeys (Ch 2); the map is public (Ch 5); turkeys are ready-made. |
| A28 Sheets fit the biggest case | **Fail** (minor) | The clock (27) and Feathers (4) fit. No box for a pending detour, for Lend a Wing used this round, for a Spotted turkey already helped this round, or for which token is newest. "On its side" doesn't work for flat tokens. |
| A29 Storyteller's load on one card | **Pass** | Six farmer steps, but the Storyteller's Card exists, and Easy with 4 or fewer turkeys drops the dog and the kid (4 steps). It looks like it fits one page; the layout was not rendered. |

---

## 10. Part B: is each question answered in one place?

| Question | Answered? | Where |
|---|---|---|
| The roll: dice, success, failure, critical, bonus cap, opposed rolls | **Yes**, in one place | Ch 3, "The roll" and "Boosts" (no partial band; "no rolls against the farmer"). |
| Group actions: helping, who, how many, cost, what one roll covers | **Yes** | Ch 3, Lend a Wing. There are no group checks: each turkey in a checked spot rolls separately (Ch 5, Ch 7). "One roll covers both" only for Pip (Ch 2). |
| Time: turn, round, action, does movement cost the action | **Yes** | Ch 3, "The round" and "Actions" (Sneak is the action). No scenes. |
| Threat: every state, one trigger, raise, lower, top | **Mostly** | The urge is in Ch 4, fully. Spotted is in Ch 5, but with no exit when the farmer leaves (B3). The farmer in round 1 is split between Ch 3, Ch 7 and Ch 12 and contradicted (B1). |
| Resources: earned, spent, free or dominated | **Yes** | Feathers in Ch 4, starting numbers in Ch 8. Puff Up in Ch 3. |
| Characters: creation, random choice, starting resources, replacements | **Yes** | Ch 2: ready-made, deal or pick with a die-roll tie-break, one of each, all start at urge 1. No replacements: Ch 1, "Nobody is ever knocked out early". |
| NPCs: procedures, detect, attack, beaten or driven off, when active | **Mostly** | Ch 7 for the farmer, dog and kid. Detours, the decoy and Grandma drive the farmer off (Ch 6, Ch 7). "When active" fails for the farmer in round 1 (B1). The dog's power to make a turkey Spotted is contradicted (B8). |
| The prize: sizes, carrying, partial, effect of capture | **Yes** (adapted) | Pranks in Ch 6: boxes, ticked boxes stay (Ch 3), once each. Nothing is carried; a grab ends the game. |
| Failure states: caught, comeback, everyone down, giving up | **Mostly** | Spotted and grabbed in Ch 5. No comeback is needed. Giving up: Ch 7 Q&A. Gaps: Spotted outside the farmer's zone (B3) and when Spotted at the end of the round (B10). |
| The end: every way it ends, literal first and last moment, tiers, rewards | **Mostly** | Too Late in Ch 6; the grab in Ch 5 and Ch 7; a draw in Ch 7; one night only, no carry-over (Ch 1). The first moment fails (B1). The last moment is clear. |
| Party size: 3, 4, 5 with adjustments | **Yes** | Ch 8 (2–8, with tables). |
| Simulator targets | **Partly** | The book prints win rates per label (Ch 8). Resource use and Great and failure rates are not in the book (fine for a player book; they belong in the design notes). |

---

## 11. Tone and content (family comedy, ages 8+)

The tone is warm and silly throughout, and nothing is gory. A few things to consider:

- **Hints of being cooked.** "Does anyone else smell gravy? …Oh no." (Famous last gobbles, Ch 5) and "being gobbled means a dramatic exit, a few last words, and a lot of mashed potatoes" (Ch 1) both hint that the grabbed turkey gets eaten. It's mild and cartoonish, but for a sensitive 8-year-old it's the one place the joke points at the oven. "At least it isn’t Christmas.” (It will be soon.)" is unclear and slightly dark: it implies the turkey will be eaten later anyway. Consider swapping it.
- **A gender pattern.** Turkey talk says "A **hen** is a female turkey: smaller, and usually the sensible one." Yet all four hens have fearful or fussy quirks (Worrywart, Fussy, Jumpy, Scaredy), while the toms and jakes have energetic ones (Restless, Chatterbox, Hiccups, Show-off). Each is fine on its own; together they make a noticeable pattern for a family audience. Consider giving one fearful quirk to a tom and one bold one to a hen, and dropping "usually the sensible one". Gizmo, the tom who is a "mother hen", is a nice reversal; keep it.
- **Farmer names.** Farmer Bramble and Farmer Puddlewick are named after their farms; Farmer Ruiz is the only one who isn't, and the only one with a surname tied to a particular culture. He's also the farmer described as "quick" and, in Ch 8, "a fast farmer". Nothing in his text is a stereotype. But the "speedy" label on the one Hispanic-named character may be read badly, and no rule makes him faster. Either name all three farmers after their farms or give all three ordinary surnames, and drop "a fast farmer" (the map is what's fast).
- Nothing else to flag: no mean jokes at real groups, and the breed names are real heritage turkey breeds.

---

## 12. Typos and unclear sentences

| File | Quote | Problem / fix |
|---|---|---|
| ch01 | "Printed from the back of this book: the map of the farm you’re playing (Chapters 9 to 11)" | The maps aren't at the back. Say "Printed from this book". |
| ch01 | "about 45 minutes with 2 turkeys" | Ch 8 says 1 hour (C4). |
| ch01 | "When the game says “gobble”, it means dinner" | Wrong as a rule (C5). |
| ch01 | "the cut-out tokens … for the turkeys, the farmer, the dog, the kid, the Feathers and the “Huh?” tokens" | Leaves out the decoy token. |
| ch03 | "Roll the prank’s target." | Say "Roll; you need the prank's target." |
| ch03 | "The farmer is next door and would hear it" | Suggests hearing depends on distance; a gobble always places a token. |
| ch05 | "(3+ is great, 5+ is risky)" | "great" next to the term Great. Say "safe". |
| ch05 | "the farm dog follows the farmer around" | Not what the dog rules do (C3). |
| ch05 / sheet-45 | "Turn your turkey token on its side." | A flat token has no side. Say "face down". |
| ch06 | "Every space that’s a multiple of 4 … has a pie on it." | The sheet says "event", not pie (C6). |
| ch08 | "open hillsides and a fast farmer" | No such rule (C8). |
| ch12 | "an EVENT space" (twice) | Term drift. |
| ch12 | "you need the number on the map" | Sneak targets (3+ or 4+) aren't on the map; only cover and prank targets are. |
| ch12 | "Put every turkey in the Turkey House" | "Turkey house" everywhere else. |
| ch13 | "Close Call … (Chapter 5)" | The rule is in Ch 4 and Ch 7. |
| cards 42/43 | "Narragansett jake (a young tom)" | "tom" is defined as grown-up (C11). Say "a young male". |
| whole book | "colour", "favourite", "grey", "neighbours" against "tires" (four times) | Mixed British and American spelling in a book set at an American Thanksgiving. Pick one. |

No doubled words or stray straight quotes were found.

---

## 13. What works

- **The core roll** is easy to teach and creates real tension: white dice for doing, red dice for nerves, "any red 6". "The result comes first" and the 3-white-dice cap are stated once and clearly.
- **"One thing, one rise"** (Ch 4) settles almost every stacking question, and the Ch 12 example shows the cold-gust-then-rise order correctly.
- **The farms are carefully built.** All 48 path pairs go both ways, every route line only uses neighbours, every search line names a real spot, and the three SVG maps match their tables exactly (paths, spots, cover, room, prank targets, clock numbers, boxes).
- **The setup arithmetic is right:** all 21 cells of the Bramble clock table, the Feather table, and both reference sheets' formulas. The sheets cover the biggest case (clock to 27, 4 Feathers).
- **The turkey cards match Chapter 2 word for word**, and every turkey has a clear spotlight.
- **The Ch 7 Q&A** answers the right questions (a token he walks past, detour against token, Too Late while Spotted, giving up).
- **The tone** is warm and silly. The last-words and dinner tables are good, the Straight faces rule thinks of young players, and "the farmer is not a villain" sets the right Storyteller voice.
- **Gobble for a Friend** is a lovely mechanic: brave, funny and tactical, and the Ch 5 example (apart from the dice count) shows it well.
