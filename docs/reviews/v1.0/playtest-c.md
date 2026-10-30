# Playtest C: the family table

*Don't Get Gobble Gobbled*, Version 1.0. Puddlewick Farm, **Standard**, **5 turkeys**: Butterbean, Duchess, Noodle, Clementine and Hazel, so the farmer's kid plays. One playtester ran the Storyteller and all five turkeys, playing sensibly and trying to win, like a family that has read the book once. The only sources were every file in `book/src/chapters/` in filename order and the map `book/art/map-puddlewick.svg`. Nothing else in the repository was read for rules (`playtest-b.md` was opened for its layout only). Every die came from a small script (Node, `Math.random`), with white, red and helper dice rolled as separate labeled calls. All 118 rolls are in the appendix; "#" numbers in the text refer to them. The chapter files and the map didn't change while this playtest ran.

## Summary

**Result: the flock won** in round 8. During the turkeys' turn, Butterbean gobbled up the pie berries (clock 4 to 2) and then Clementine started a hen party with a Great (clock 2 to 0): **Too Late**. There were six farmer's turns (rounds 2 to 7). The flock pulled 7 of the 8 pranks (everything but the roasting pan) and made the decoy, but never needed it. Nobody was ever Spotted and neither Feather was spent. The farmer searched four times and found four empty spots; his other two turns were detours. Ten drills followed, each set up and rolled fresh.

The book carried the whole game without a stop. Nothing was a blocker. The recently changed rules mostly read cleanly: Show-off's pose that stays down, Quick Feet's "three on a Great", Restless, the Gobble for a Friend chain, compulsory hiding and the kid's procedure all gave a clear answer at the table. The problems are elsewhere:

1. **Who gets grabbed on a tie** *(confusing)*. Chapter 5 says the Storyteller rolls a die; Chapter 7 and the Storyteller's Card say the lowest card number. In drill 5 the die picked Clementine and the card number picked Noodle. With the decoy ready, that decides which turkey walks free and which one stays Spotted.
2. **"Huh?" tokens in round 1** *(confusing)*. The farmer, dog and kid "don't count for anything" in round 1, but a failed Sneak or a gobble still puts a token down by the letter of the rules. Duchess's round 1 token decided the farmer's first walk.
3. **Hazel's Jumpy during an end-of-round backfire** *(confusing)*. Farm events are exempt from "one thing, one rise", but a quirk set off by an event isn't mentioned. In drill 9 this decided whether Hazel ended the round at urge 0 or 1.
4. **More than 20 "Huh?" tokens** *(confusing)*. With all 20 tokens on the map, renumbering frees nothing, and the 21st token doesn't exist (drill 6).
5. Minor: whether a *failed* rescue uses up a turkey's one Gobble for a Friend; the path tie-break when the two ways split after the first step; three end-of-round lists that leave out the farm event; Keen Eye's card wording; the unstated "no passing" rule that drives Restless; the limbo of a second Spotted turkey after the decoy; which rolls count as "to stay hidden"; the map legend; and a missing 5-turkey line in the time table.

**The design observation that matters most:** the farmer was steered all game. Each of his six walks was decided by a "Huh?" token, a detour or a rake, so the flock knew where he was going before it moved, and simply wasn't there. Keen Eye's forecast was rolled seven times and never once decided where he walked. On this showing, losing on Standard with five turkeys at Puddlewick is a remote risk for a careful flock.

## 1. Setup

**Turkeys and card numbers** (Chapter 2 and the turkey sheets): Butterbean 1, Duchess 3, Noodle 5, Clementine 6, Hazel 8. The other three turkeys stay asleep in the pen.

**Numbers** (Chapter 8, Chapter 10, Chapter 12 checklist):

| Item | What the book says | How the number was found | Used |
|---|---|---|---|
| Dinner Clock | `22-ch08.html`: "The Dinner Clock starts at 16, plus 1 for every turkey ... each farm has its own small adjustment (Puddlewick +1, Windy Ridge +1)." `24-ch10.html`: "the clock starts 1 higher than Chapter 8’s table says." | 16 + 5 turkeys = 21; no small-flock change, and Standard adds nothing; Puddlewick +1. Cross-check: the Bramble table gives 21 for 5 turkeys on Standard, "add 1". | **22** (not an EVENT space) |
| Feathers | `22-ch08.html`: "The flock starts with 2 Feathers. A small flock (2 or 3 turkeys) gets 1 more." Table: "4 to 8 ... Standard 2". | 2, no changes | **2** |
| Dog | Standard: "Follows its nose on 1–2" | | yes |
| Kid | "With 5 or more turkeys, the farmer’s kid comes out to help" | 5 turkeys | yes |
| Farmer | Standard: "Runs 2 zones to a “Huh?” token"; Scram 4+ | | yes |
| Start | `26-ch12.html`: "Put the farmer in the Farmhouse. On Standard and Hard, put the dog there too. With 5 or more turkeys, the kid as well." / "Put every turkey in the Turkey house, in the Turkey Pen." / "puts a coin on urge 1" | The Turkey house holds 8, so all five fit. The map's Farmhouse label agrees: "FARMER, DOG & KID". | yes |
| Straight faces | optional | who laughs first can't be rolled | not used |

All ten checklist steps in Chapter 12 were followed in order. The sums are easy, and Chapter 8's text, its table, Chapter 10 and the Storyteller's Card all agree.

**The map.** Puddlewick is a 4 by 3 grid with a creek between the top row and the middle row. The map has 15 orange paths, and they match the farm table's "Paths to" column exactly. Every hiding spot, cover and room on the map matches the table, and so does every prank's target, boxes, clock and extra.

```
Duck Pond* ---- Willow Trees ---- Water Mill ----- Berry Patch
    |                                 |              (dead end)
~~~~~~~~~~~~~~~~~~~~~~~~~ CREEK ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    |                                 |
Goat Pen* ----- Muddy Lane (open) - Footbridge ----- Greenhouse
    |                 |               |                  |
Farmhouse ----- Turkey Pen -------- Hen House* ------ Hay Barn
                                                    * = Noisy
```

Short names used below: DP Duck Pond, WT Willow Trees, WM Water Mill, BP Berry Patch, GP Goat Pen, ML Muddy Lane, FB Footbridge, GH Greenhouse, FH Farmhouse, TP Turkey Pen, HH Hen House, HB Hay Barn. Turkeys: B Butterbean, D Duchess, N Noodle, C Clementine, H Hazel. "T1, T2, ..." are the numbered "Huh?" tokens in the order they went down.

**Rulings used in the game** (each is also an issue in section 4):

- **R-a:** a failed Sneak or a gobble in round 1 still puts a "Huh?" token down (C2).
- **R-b:** when the farmer's equally short ways only split after his first step, the first-listed path is taken in the zone where they split (M2).
- **R-c:** Keen Eye's route die is rolled at the start of every turkeys' turn from round 2, even when a rake already decides his walk, as the card says. There's no roll in round 1, as Chapter 7 says (M4).
- **R-d:** moving the clock *off* an EVENT space it's already on isn't "jumping past" it (rounds 5 and 8). The book's wording supports this; it's noted here only because a table might ask.

## 2. Play log

Urges are given after each change. The order of actions within a round is the order the flock chose.

**Round 1** (no farmer's turn: "For the whole of round 1, he, the dog and the kid don’t count for anything").
- Clementine Sneaks TP to HH. It's Noisy, so 3+ even in round 1: #1 **6**, a Great, and #2 is clean. The Great lets her keep going one more zone if that move needs no roll. HH to HB is fine (the farmer doesn't count, and the Hay Barn isn't Noisy), so she goes on into the Hay stacks.
- Duchess Sneaks TP to HH (3+): #3 1 fails, and red #4 is a **6**. She still gets there and hides in the Roost. Nobody can be Spotted in round 1, so the failure puts **T1** on the Roost (R-a). Then comes the gobble ("GOBBLE GOBBLE!"): urge 1 to 0, and **T2** on the Roost. The flock keeps its Feathers: it's far from anyone, and a Feather wouldn't remove T1 anyway. Hazel is **Jumpy**: 1 to 2.
- Butterbean, Noodle and Hazel walk TP to ML with no roll. It's open ground, so they're in the open.

End of the round: clock 22 to 21, not an EVENT space. Everyone +1.
*State: clock 21, Feathers 2. B ML open, 2; D HH Roost, 1; N ML open, 2; C HB Hay stacks, 2; H ML open, 3. Nobody Spotted. Farmer, dog and kid in FH. Tokens T1, T2 on HH Roost.*

**Round 2.** Keen Eye #5: 4, so the farmer would walk to the Goat Pen if nothing else decides it. But the tokens will decide it: HH is two zones away, so he'll get there and check the Roost.
- Duchess Sneaks HH to HB with no roll (the farmer in FH isn't in or next to either zone) and takes the Loft, leaving T1 and T2 behind.
- Clementine Hunkers Down in the Hay stacks: 2 to 0 (Cool Head, −3).
- Butterbean goes ML to FB with no roll and takes Under the bridge.
- Noodle Hunkers Down in ML (it has no spots, so he stays in the open): 2 to 0. Hazel does the same: 3 to 1. Nothing can reach Muddy Lane this turn: the farmer is going to HH, and the dog and kid can only move one zone from the Farmhouse, to TP or GP.

Farmer's turn. *Grab:* nobody is Spotted. *Walk:* no detour or rake. T2 is the newest of the nearest tokens, two zones away: FH to TP to HH. *Search:* he checks the Roost, the only spot with tokens. It's empty, and nobody is in the open. T1 and T2 come off. *Close Calls:* nobody is in HH. *Dog:* #6 3 means it reads its route line, #7 6: the Goat Pen, which is empty. *Kid:* #8 1, to TP. Nobody is in the open there, and its peek #9 2 finds the Turkey house empty.

End of the round: clock 21 to 20, an EVENT space. Event #10: 3, *the whole family helps look*. Everyone +1.
*State: clock 20, Feathers 2. B FB Under the bridge, 3; D HB Loft, 2; N ML open, 1; C HB Hay stacks, 1; H ML open, 2. Nobody Spotted. Farmer HH, dog GP, kid TP. No tokens. The whole family is helping on his next turn.*

**Round 3.** Keen Eye #11: 1, the Turkey Pen. With the whole family helping, he'll check every spot wherever he ends, so the flock stays out of TP and tries not to make tokens.
- Clementine pulls *Dress a hay bale as a turkey* (HB, 5+, 2 boxes), with Duchess Lending a Wing from the Loft and no Puff Up (he's next door): #12 2 3 fails. Red #13 and helper #14 are clean.
- Duchess Hunkers Down: 2 to 0. Butterbean Hunkers Down: 3 to 1.
- Noodle Sneaks ML to GP: Noisy, 3+ (the farmer in HH isn't next to either zone). #15 2 fails, #16 is clean. He gets in and hides in the Hay feeder, and **T3** goes on the Hay feeder.
- Hazel Sneaks ML to GP: #17 4 works, but red #18 5 **6** is a gobble. She takes the Goat shed, urge 2 to 0, **T4** on the Goat shed. No Feather: he's heading their way anyway, and a goats detour next turn would wipe the Goat Pen's tokens.

Farmer's turn. *Grab:* none. *Walk:* T3 and T4 in GP are three zones away, so he walks two. Both shortest ways leave HH through TP and then split: TP to FH or TP to ML. The Turkey Pen's list puts FH first (R-b), so he goes HH to TP to FH and stops short. *Search:* the whole family checks every spot in the Farmhouse: the Porch swing, the Boot rack and the Laundry basket. All empty, and there are no tokens there to clear. *Close Calls:* none. *Dog:* #19 5, so route #20 2: Muddy Lane, which is empty now. *Kid:* #21 3, to HH. Nobody is in the open, and its peek #22 5 finds the Roost empty.

End of the round: clock 20 to 19. Everyone +1.
*State: clock 19, Feathers 2. B FB Under the bridge, 2; D HB Loft, 1; N GP Hay feeder, 2; C HB Hay stacks, 2; H GP Goat shed, 1. Nobody Spotted. Farmer FH, dog ML, kid HH. Tokens T3 (GP Hay feeder) and T4 (GP Goat shed).*

**Round 4.** Keen Eye #23: 5, the Goat Pen. The tokens say the same: he's coming for Noodle's and Hazel's spots. Their way out is the goats detour, because "any “Huh?” tokens in that zone come off" and he doesn't search.
- Noodle pulls *Let the goats loose* (GP, 4+), with Hazel's Wing and no Puff Up: #24 3 1 fails. Red #25 and helper #26 are clean.
- Hazel tries it herself: Puff Up 1 to 2, with Noodle's Wing. #27 2 **4** 1 works! The goats get loose, clock 19 to 16, and the detour is set. The clock *landed on* 16, so event #30: 5, *a cold gust*, and everyone −1: B 1, D 0, C 1, N 1, H 1. Red #28 and helper #29 are clean.
- Duchess pulls the hay bale (5+), puffing up 0 to 1, with Clementine's Wing: #31 4 3 4 fails. Red #32 is a **6**: urge 1 to 0, **T5** on the Loft. No Feather: the detour means he won't come this way this turn. Hazel is Jumpy: 1 to 2. Helper #33 is clean.
- Clementine pulls the hay bale, puffing up 1 to 2, with Duchess's Wing: #34 2 **6** 3, a **Great**, so both boxes. The hay bale turkey is dressed: clock 16 to 15, and **the decoy is ready**. Red #35 and helper #36 are clean.
- Butterbean goes FB to WM with no roll and takes the Flour sacks.

Farmer's turn. *Grab:* none. *Walk:* the detour puts him straight into the Goat Pen. He doesn't search, and T3 and T4 come off. *Close Calls:* Noodle and Hazel are in GP, but Keen Eye means "Close Calls don’t raise the urge of turkeys in your zone", so neither rises. *Dog:* #37 5, so route #38 4: the Footbridge, which Butterbean has just left. *Kid:* #39 1, to TP. Its peek #40 4 finds the Turkey house empty.

End of the round: clock 15 to 14. Everyone +1.
*State: clock 14, Feathers 2, decoy ready. B WM Flour sacks, 2; D HB Loft, 1; N GP Hay feeder, 2; C HB Hay stacks, 3; H GP Goat shed, 3. Nobody Spotted. Farmer GP, dog FB, kid TP. Token T5 (HB Loft). Pranks done: goats, hay bale.*

**Round 5.** Keen Eye #41: 6, the Farmhouse, but T5 decides: the Hay Barn is four zones away, so he'll walk two.
- Butterbean pulls *Jam the water wheel* (WM, 4+, 2 boxes) with no Puff Up: 2 white dice (Busy Beak). #42 4 **6** works, and both boxes are ticked. Clock 14 to 12, landing on an EVENT space: #44 5, another cold gust: B 1, D 0, C 2, N 1, H 2. Red #43 is clean.
- Noodle Hunkers Down: 1 to 0. Hazel Hunkers Down: 2 to 0. Clementine Hunkers Down: 2 to 0.
- Duchess goes HB to GH with no roll (the farmer in GP isn't next to either zone) and takes the Tomato vines, leaving T5 on the empty Loft.

Farmer's turn. *Grab:* none. *Walk:* toward T5, two zones. The Goat Pen's list puts ML before FH, and at Muddy Lane FB comes before TP (R-b): GP to ML to FB. *Search:* there are no tokens in FB, so he rolls its search line: #45 3, Under the bridge, which is empty. *Close Calls:* none. *Dog:* #46 **2**: it follows its nose. Butterbean (WM) and Duchess (GH) are both one zone away, and the lower card number is Butterbean's, so the dog goes to the Water Mill. Butterbean rolls 4+, puffing up 1 to 2: #47 2 5, hidden, and red #48 is clean. The dog's Close Call takes her 2 to 3. *Kid:* #49 4, to HH. Its peek #50 6 finds the Roost empty.

End of the round: clock 12 to 11. Everyone +1.
*State: clock 11, Feathers 2, decoy ready. B WM Flour sacks, 4; D GH Tomato vines, 1; N GP Hay feeder, 1; C HB Hay stacks, 1; H GP Goat shed, 1. Nobody Spotted. Farmer FB, dog WM, kid HH. Token T5 (HB Loft). Pranks done: goats, hay bale, water wheel.*

**Round 6.** Keen Eye #51: 4, the Water Mill, but T5 decides: the Hay Barn is two zones away. Noodle can't Hunker Down this round (Restless: he did last round).
- Duchess pulls *Turn on the sprinklers* (GH, 4+), puffing up 1 to 2: #52 **5** 4 works. Clock 11 to 9, and the detour is set: he'll go to the Greenhouse instead of the Hay Barn. Red #53 has a **6**: urge 2 to 0, and **T6** goes on the Tomato vines. That one's free, because the detour clears the Greenhouse's tokens. Hazel is Jumpy: 1 to 2.
- Noodle Sneaks GP to DP: Noisy, 3+ (the farmer in FB isn't next to either zone). #54 2 fails, #55 is clean. He's in the Reeds, with **T7** on them.
- Hazel goes GP to FH with no roll and takes the Boot rack, ready for the roasting pan.
- Butterbean Hunkers Down: 4 to 2. Clementine Hunkers Down: 1 to 0.

Farmer's turn. *Grab:* none. *Walk:* the detour takes him to the Greenhouse. No search, and T6 comes off. *Close Calls:* Duchess 0 to 1. *Dog:* #56 6, so route #57 6: the Footbridge, which is empty. *Kid:* #58 4, to HB. Nobody is in the open there. Its peek #59 2 finds Clementine in the Hay stacks. She rolls 4+, puffing up 0 to 1: #60 **6** 1, hidden, and red #61 is clean. (The kid causes no Close Calls.)

End of the round: clock 9 to 8, an EVENT space. Event #62: 3, *the whole family helps look*, again. Everyone +1.
*State: clock 8, Feathers 2, decoy ready. B WM Flour sacks, 3; D GH Tomato vines, 2; N DP Reeds, 2; C HB Hay stacks, 2; H FH Boot rack, 3. Nobody Spotted. Farmer GH, dog FB, kid HB. Tokens T5 (HB Loft) and T7 (DP Reeds). The whole family is helping on his next turn.*

**Round 7.** Keen Eye #63: 2, the Footbridge, but T5 is one zone away. He'll be in the Hay Barn checking every spot, and Clementine is in the Hay stacks. The flock counts: clock 8, four pranks left (3 + 2 + 2 + 3 = 10). Two good rounds will finish it.
- Noodle pulls *Start the duck choir* (DP, 3+), puffing up 2 to 3: #64 2 **3** works. Clock 8 to 5, and it's loud, so **T8** goes on the Duck Pond zone. Red #65 2 **6 6** is one gobble: urge 3 to 0, **T9** on the Reeds. No Feather: the Duck Pond is four zones from him. Hazel is Jumpy: 3 to 4.
- Clementine has to get out of the Hay Barn. HB to HH needs 4+ (the Hay Barn is next to the farmer's Greenhouse). She puffs up 2 to 3: #66 **6** 2 is a Great, and red #67 is clean. The Great would let her go on to TP (that move needs no roll), but she stays in the Hen House for its prank and takes the Roost.
- Butterbean goes WM to BP with no roll (the Greenhouse isn't next to either zone) and takes the Bramble thicket.
- Duchess Hunkers Down, already hidden in the farmer's own zone, so no roll: 2 to 0. Hazel Hunkers Down: 4 to 2.

Farmer's turn. *Grab:* none. *Walk:* GH to HB, to T5. *Search:* the whole family checks the Hay stacks, the Loft and the Hay wagon. All empty. T5 comes off. *Close Calls:* none. *Dog:* #68 5, so route #69 2: Muddy Lane, which is empty. *Kid:* #70 4, to GH. Nobody is in the open, and its peek #71 6 finds the Flowerpots empty (Duchess is in the Tomato vines).

End of the round: clock 5 to 4, an EVENT space. Event #72: 4, *he steps on a rake*. Everyone +1.
*State: clock 4, Feathers 2, decoy ready. B BP Bramble thicket, 4; D GH Tomato vines, 1; N DP Reeds, 1; C HH Roost, 4; H FH Boot rack, 3. Nobody Spotted. Farmer HB (rake: he won't walk), dog ML, kid GH. Tokens T7 and T9 (DP Reeds) and T8 (DP zone).*

**Round 8.** Keen Eye #73: 5, the Greenhouse. But the rake means he doesn't walk this turn, so the flock knows no gobble can bring him anywhere. The berries and the hen party are exactly 4.
- Butterbean pulls *Gobble up the pie berries* (BP, 3+, 2 boxes), puffing up 4 to 5 for 3 white dice: #74 **6** 4 2, a Great, and both boxes are ticked. Clock 4 to 2 (it leaves the EVENT space it's on, so no event, R-d). Red #75 has a **6**: urge 5 to 0, **T10** on the Bramble thicket, and Hazel is Jumpy, 3 to 4. A Feather would have kept Butterbean at 5, where the end-of-round rise makes her gobble anyway with no Feather allowed, so the flock lets it go.
- Clementine pulls *Start a hen party* (HH, 3+), puffing up 4 to 5: #76 **6** 1, a Great. **Clock 2 to 0: Too Late. The flock wins at once.** Red #77 was clean, and "the result comes first" in any case.

What's for dinner instead, #78: 6, *the vegetable “turkey”: a cauliflower in a little paper hat.* Duchess poses beside it.

**Game totals**

| | |
|---|---|
| Rounds | 8 (farmer's turns in rounds 2 to 7) |
| Pranks | 7 of 8: goats (R4), hay bale decoy (R3 to R4), water wheel (R5), sprinklers (R6), duck choir (R7), pie berries (R8), hen party (R8). The roasting pan was never tried. |
| Clock | 22 to 0: 7 end-of-round ticks plus 15 from pranks |
| Farm events | 5: the whole family helps look (twice), cold gust (twice, both set off by pranks), rake |
| Feathers | 0 of 2 spent |
| Gobbles | 6, none canceled: Duchess 3, Hazel 1, Noodle 1, Butterbean 1. No full-urge gobbles. |
| Spotted | never |
| "Huh?" tokens | 10 placed; at most 4 on the map at once; 4 still down at the end |
| Actions | Sneak 15 (6 with a roll), Hunker Down 12, Pull a Prank 10, Let It Out 0, Scram 0, Gobble for a Friend 0. Puff Up 10, Lend a Wing 5. |
| Farmer | 4 searches, all of empty spots (two of them with the whole family); 2 detours; every walk set by a token or a detour; the rake fell on the last turn |
| Dog checks | 1 (Butterbean, hidden) |
| Kid peeks | 6: five empty spots and Clementine (hidden) |
| Keen Eye | 7 forecasts, none of which decided his walk |

## 3. Drill log

Each drill was set up by hand on Puddlewick, Standard, with 5 turkeys, and then rolled fresh. Where a drill needed a particular result (a Great, a failure, a backfire), the position was reset and rolled again until that result came up. Every attempt is in the appendix, and every drill got its result on the first or second try.

### Drill 1: Duchess strikes a pose during the farmer's search

**Passage.** `12-ch02.html`, Show-off: "Whenever you roll a Great, you strike a pose: a “Huh?” token goes on your spot (or your zone, if you’re in the open). A pose struck while the farmer searches stays down after he clears his tokens, so he’ll be back." Also `15-ch05.html`: "Then they all come off (except a pose Duchess strikes during that search)." And `21-ch07.html`: "A token in his own zone means he stays put and searches."

**Setup.** The farmer walks into the Water Mill after T1 on Behind the wheel (4+), where Duchess is hiding at urge 2. Butterbean is in the Flour sacks at urge 1.

**Rolls.** Duchess Puffs Up, 2 to 3. Still as a Stump plus the Puff Up gives 3 white dice, and her red dice don't count, so none were rolled. #79 1 **6** 3: hidden, and a **Great**. She strikes a pose and T2 goes on Behind the wheel. He clears his tokens: T1 comes off and T2 stays. Close Calls: Duchess 3 to 4, Butterbean 1 to 2. End of the round: Duchess 5, Butterbean 3.

Next round, Duchess Hunkers Down where she is (5 to 3), because a family that has just seen her roll a 6 will try it again. At the farmer's turn T2 is in his own zone, so he doesn't walk: he stays and checks Behind the wheel again. She Puffs Up 3 to 4: #80 **6** 1 1, another Great and another pose (T3), which stays. His Close Call takes her to 5, and at the end of the round she'll rise at urge 5. That's a full-urge gobble in his zone: Spotted.

**Clear?** Yes. The token stays, and he comes straight back. Two things a table will notice. First, the pose can loop: each Great pins the farmer in her zone for another turn. Second, because her red dice don't count on these rolls, Puff Up costs her nothing but urge, so she'll always use it. Puff Up, his Close Call and the end of the round add 3 to her urge each round, so the loop ends with her own full-urge gobble right under his nose. That's funny, and it's self-limiting. If she Sneaks away instead, he still stays and searches an empty spot, which is the pose doing its job as a lure.

### Drill 2: Noodle's Restless, two rounds running

**Passage.** `12-ch02.html`: "Quirk: Restless You can’t Hunker Down two rounds in a row." / "On the rounds he can’t sit still, a friend can Hunker Down for him, or he can let it out somewhere far from the farmer." `13-ch03.html`: "Every turkey takes one action (below), in any order the flock likes."

**Setup.** Round N: Noodle is in the Willow curtain (WT) at urge 3. The farmer is two zones away in FB. Noodle Hunkers Down: he's hidden and the farmer isn't in his zone, so there's no roll: 3 to 1, then 2 at the end of the round. The farmer walks his route into the Water Mill, next door. Round N+1: Noodle wants to Hunker Down again.

**What the book says.** He can't. There's no prank in the Willow Trees and no Spotted friend, so his only actions are Sneak or Let It Out. Letting it out next to the farmer would put a token one zone from him on Noodle's own spot, so Noodle Sneaks WT to DP. That's 4+, because he's leaving a zone next to the farmer.

**Rolls.** #81 1 fails, red #82 is clean. He gets into the Reeds, and a token goes on them. The farmer is two zones away (WM to WT to DP), so he'll arrive next turn and check the Reeds.

**Clear?** The quirk is clear. What the book never says in so many words is that a turkey **can't pass**. "Every turkey takes one action" implies it, and so does the "Play him" tip. So on his restless rounds Noodle must move, prank or gobble, even when sitting tight is the safe play. In this drill that forced move put a token next to him. A friend Hunkering Down *for* him is allowed, and wouldn't break Restless, because it's the friend's action. See M5.

### Drill 3: Quick Feet, a Scram that rolls a Great

**Passage.** `12-ch02.html`: "Knack: Quick Feet +1 white die when you Scram, and a Scram that works can take you two zones (three on a Great)." `13-ch03.html`, Scram: "A Great lets you keep running one more zone."

**Setup.** Noodle is Spotted Under the bridge (FB), with the farmer there, at urge 1.

**Rolls.** Attempt 1: Quick Feet plus Puff Up (1 to 2) gives 3 white dice. #83 3 3 1 fails, so he's still Spotted. Red #84 is clean. Reset. Attempt 2: #85 1 **6** 3, a **Great**, and red #86 is clean. He runs three zones, FB to WM to WT to DP, across the creek, and hides in the Reeds. He's no longer Spotted.

**Clear?** Yes. "Three on a Great" settles it, and the general Scram Great doesn't add a fourth. Unlike a Sneak's Great, the extra zones carry no "if that move wouldn't need a roll" condition, so he can run past zones next to the farmer, and Noisy zones cost nothing. That matches the words. A table might ask whether he hides in the first zone or only the last; the natural reading is only where he stops.

### Drill 4: a failed rescue in the farmer's zone, then two more friends

**Passage.** `13-ch03.html`: "Each Spotted turkey can be helped this way only once per round. If the rescuer ends up Spotted, that’s a new Spotted turkey, and another friend can try for it." / "Either way, the farmer turns toward you: if he’s in your zone, now you are Spotted; otherwise a “Huh?” token goes on your spot." / "Great: he can’t tell where the gobble came from. No token, and you aren’t Spotted."

**Setup.** The farmer is in the Goat Pen. Hazel is Spotted in the Goat shed (urge 1). Clementine is in the Hay feeder (urge 2), not Spotted. Next door: Butterbean in FH (Boot rack, urge 1), Duchess in DP (Reeds, urge 0), Noodle in ML (open, urge 2). Feathers 2.

**Rolls.**
- Clementine Gobbles for Hazel. Her urge goes to 0, she rolls no red dice and can't Puff Up, and nobody can lend her a Wing (Hazel is Spotted). #87 1 **fails**. Hazel is still Spotted, and the farmer is in Clementine's zone, so **Clementine is Spotted** too. Hazel is Jumpy: 1 to 2.
- Butterbean, next door, Gobbles for **Clementine**, the new Spotted turkey: allowed. #88 **6**, a Great. Clementine is free, there's no token and Butterbean isn't Spotted. Her urge 1 to 0. Hazel is Jumpy again (a different action): 2 to 3.
- Duchess, next door, wants to try again for **Hazel**. The ruling is no: Hazel has had her one Gobble for a Friend this round, even though it failed (M1). Noodle is turned down for the same reason.
- So Hazel Scrams. She Puffs Up 3 to 4, and Clementine (free again, and not yet a lender this round) Lends a Wing. #89 **4** 3 3 works: Hazel runs to the Duck Pond Reeds and isn't Spotted any more. Red #90 is clean. But helper #91 is a **6**: Clementine gobbles from the Hay feeder, in the farmer's zone, so she'd be Spotted *again*, and she has already been helped this round. She'd be grabbed. The flock spends a Feather (2 to 1).

**Clear?** Mostly. Every step has a passage. The one gap is the word "helped" (M1). If only a *successful* rescue counted, the limit would hardly ever bite, because a successful rescue already ends the Spotted. So the table read it as "the target of one Gobble for a Friend per round". The last step shows a sharp edge: a turkey that's rescued and then re-Spotted in the same turkeys' turn (here by its own helper die) has no rescue left. Fair, and dramatic.

### Drill 5: two Spotted turkeys tied on urge, with the decoy ready

**Passage.** `15-ch05.html`: "If several are Spotted there, he grabs the one with the highest urge; on a tie, the Storyteller rolls a die to pick." `21-ch07.html`: "If several Spotted turkeys are there, he grabs the one with the highest urge (if they’re tied, the lowest card number). If a decoy is ready (Chapter 6), he grabs that instead, carries it to the Farmhouse (move him there), the clock moves down 2, and you skip steps 2 to 4. The dog and the kid still take their steps." `16-ch06.html`: "that turkey isn’t Spotted any more".

**Setup.** The start of the farmer's turn, in the Hen House. Noodle (card 5) and Clementine (card 6) are both Spotted in the Nesting boxes at urge 2. Both rescues failed. The decoy is ready and the clock is at 9. The dog is in TP and the kid in HB. Hazel is in HB (urge 1), Butterbean in TP (urge 1), Duchess in FB (urge 0).

**Rolls.** The two chapters disagree, so both were tried. Chapter 5's die, #92: 4. The playtester fixed "odd = Noodle, even = Clementine" before rolling, so the die says **Clementine**. Chapter 7 and the Storyteller's Card say the lowest card number: **Noodle**. The ruling went with Chapter 7 (the Storyteller's chapter and card). He grabs the decoy instead of Noodle, and Noodle isn't Spotted any more. The farmer carries the hay bale to the Farmhouse, and the clock goes 9 to 7, passing 8: event #93 5, *a cold gust*. It lowers everyone, Spotted turkeys included: Noodle 1, Clementine 1, Hazel 0, Butterbean 0. Steps 2 to 4 are skipped. *Dog:* #94 4, so route #95 4: the Hen House. Noodle isn't Spotted any more, so he rolls 4+: #96 5, hidden, but red #97 is a **6**. The farmer is in the Farmhouse now, so that's a token on the Nesting boxes, not Spotted. Urge 0, then the dog's Close Call takes him to 1 (the farmer gave none this turn), and Hazel is Jumpy (0 to 1). Clementine is Spotted, so the dog ignores her.

**What's left.** Clementine is still Spotted, though the farmer is in the Farmhouse. Step 1, which frees a turkey he can't see, only runs at the start of a farmer's turn. So until his next turn she can't Lend a Wing, she doesn't rise at the end of the round, and her only action is Scram. She has to take it, because there's no passing. At his next turn she goes free, and then he walks straight to Noodle's new token, in her spot.

**Clear?** No. The tie-break contradiction (C1) gave two different turkeys here, and with the decoy the choice matters: one turkey walks off free, and the other spends a round in Spotted limbo (M6). The decoy itself worked smoothly. Its −2 setting off an event in the middle of the farmer's turn raises one more question: does an "on his next turn" event (rake, oven, whole family) mean this turn or the following one? It didn't matter for a cold gust.

### Drill 6: more than 20 "Huh?" tokens

**Passage.** `21-ch07.html`: "Use the numbered tokens in order, so the highest number out is always the newest. If you reach the last one, take the tokens on the map and renumber them from 1 in the same order." `45-sheet-tokens.html`: "Put the “Huh?” tokens down in number order, so the highest number out is the newest. If you reach 20, take the tokens on the map and renumber them from 1 in the same order."

**Setup.** A long, gobbly game with 19 tokens on the map, numbered 1 to 19. They are in DP (5), BP (4), WT (3), HB (3), GH (2) and GP (2). The farmer is in the Footbridge. Butterbean is in the Hen House Nesting boxes (urge 2) and Hazel in the Roost (urge 3).

**Rolls.** Butterbean pulls the hen party (3+, loud) with Busy Beak's 2 dice: #98 **4** 3 works, and red #99 is clean. The loud token goes on the HH zone, and it's **number 20, the last one**. The table renumbers the 20 tokens on the map from 1, and they stay 1 to 20. Nothing is freed. Then Hazel Lets It Out (urge 3 to 0), and a token has to go on the Roost, but **there is no 21st token**. Ruling: a coin, called 21, the newest.

Farmer's turn: the nearest tokens are one zone away, in GH and HH. The newest is the coin, so he goes to the Hen House. The coin is on the Roost and token 20 is on the zone, so he checks the Roost and rolls the search line, #100 1: the Nesting boxes. Hazel (Roost, 3+, urge 0): #101 **6**, hidden. Butterbean (Nesting boxes, 4+) puffs up 2 to 3 with Hazel's Wing: #102 3 **6** 1, hidden, with red #103 and helper #104 clean. Chatterbox takes her 3 to 4 after the roll. The two tokens come off, leaving 19. Keen Eye spares everyone in Hazel's zone a Close Call.

**Clear?** No. The renumbering rule only works while some tokens are off the map. With 20 down there's nothing to renumber into, and the table has to invent a 21st token (C4). The two texts also leave the timing loose: do you renumber the moment you put down number 20 ("reach the last one") or when you need another one? The answer is the same here, but a Storyteller will stop to ask. In real play this is rare: this game never had more than 4 tokens down at once.

### Drill 7: Keen Eye in round 1, and when a rake or a detour decides his walk

**Passages.** `12-ch02.html`: "Knack: Keen Eye At the start of the turkeys’ turn, the Storyteller rolls the farmer’s route die and tells the flock where he’ll walk if nothing else (a detour, a rake or a “Huh?” token) decides it." `21-ch07.html`: "For the whole of round 1 they don’t count for anything (Chapter 3), and Hazel’s Keen Eye has nothing to see." / "(If Hazel’s Keen Eye has already rolled it this round, use that roll. ...)" / "Rake. If he stepped on a rake (a farm event), he doesn’t walk this turn. (A detour still moves him, and the rake is used up.)"

**7a, round 1.** No roll. Chapter 7 says so, and there's no farmer's turn to forecast. The card itself just says "at the start of the turkeys’ turn", and Chapter 2 says "Where a knack or quirk says something different from the general rules, the knack or quirk wins." A literal reader could ask for a round 1 roll. It wouldn't do anything, and it couldn't carry over to round 2 ("this round").

**7b, a rake.** The farmer is in the Water Mill with a rake pending. The card still asks for the roll: #105 3, "the Berry Patch, if nothing else decides it". Everyone already knows the rake decides it. His turn: no walk. He searches his own zone, search line #106 3: the Flour sacks. The roll is required and can never matter. The same happened in the game, in round 8 (#73).

**7c, a detour.** The farmer is in the Hen House. Keen Eye #107: 3, the Hay Barn, so Clementine leaves the Hay Barn. Then Duchess pulls the sprinklers (GH, 4+, urge 1): #108 **5** works, red #109 is clean, and the detour is set. His turn: he goes to the Greenhouse, and the forecast is thrown away. Clementine moved for nothing. That's fair, since the card says "if nothing else ... decides it".

**Clear?** Yes for all three, but the card is wordier than it needs to be (M4). Not tested: if Grandma calls during the turkeys' turn after the Keen Eye roll, he's moved to the Farmhouse. Is "use that roll" read on the Farmhouse's route line, or is the roll void? The book doesn't say. In the game, the forecast was rolled seven times and never once decided his walk.

### Drill 8: a Sneak into a zone where a spot has room

**Passage.** `13-ch03.html`, Sneak: "If a hiding spot there has room, you hide in it (you pick which); if not, you’re in the open." `15-ch05.html`: "A turkey that isn’t (no room, or nowhere to hide) is in the open." `12-ch02.html`, Fussy: "+1 urge whenever you end an action sharing a hiding spot, or another turkey squeezes into yours."

**Setup.** Clementine is Under the bridge (FB) at urge 1. The farmer is in the Willow Trees, next to the Water Mill. In the Water Mill, Hazel is in the Flour sacks (1 of 3), Butterbean is Behind the wheel (1 of 2) and Duchess fills the Millstone (1 of 1). Clementine wants to be in the open there, to dodge Fussy.

**Rolls.** The Sneak FB to WM is 4+ (WM is next to the farmer): #110 3 **fails**, and red #111 is clean.

**What the book says.** She can't choose the open: two spots have room, so she hides in one of them, her pick. She takes the Flour sacks (3+, with Hazel). The failed Sneak puts a token on her spot (the farmer isn't in the Water Mill), and Fussy takes her 1 to 2. Next turn the farmer comes one zone to that token and checks the Flour sacks, so Clementine and Hazel will both roll.

**Clear?** Yes. Chapters 3 and 5 agree that hiding is compulsory when there's room. Scram and Hunker Down are worded the same way. The only turkey that would ever want the open is Clementine, and the rule says no.

### Drill 9: an end-of-round backfire with turkeys at urge 5

**Passage.** `13-ch03.html`: "The Dinner Clock moves down one space (Chapter 6); if that makes it Too Late, the flock wins and nothing else happens. If it lands on an EVENT space, the Storyteller rolls the farm event now. Then every turkey that isn’t Spotted raises its urge by 1". `21-ch07.html`: "The truck backfires: BANG! Every turkey’s urge rises by 1." / "A farm event is its own thing: its urge change applies even if a turkey’s urge has just risen for something else." `14-ch04.html`: "If it’s at 5 and something would raise it, you gobble instead, and it goes back to 0. A full-urge gobble can’t be stopped with a Feather." / "Apart from Puffing Up and farm events, your urge rises at most once per action (yours or anyone’s), once per farmer’s turn and once at the end of each round, however many reasons there are." `12-ch02.html`, Jumpy: "+1 urge whenever another turkey gobbles."

**Setup.** The end of a round with the clock on 13. The farmer is in the Hay Barn. Clementine is hidden in the Hay stacks there at **urge 5** (not Spotted). Noodle is Spotted in the Loft at urge 4. In the Greenhouse, Butterbean is at **urge 5** in the Tomato vines and Hazel at 4 on the Potting bench. Duchess is in the Water Mill at 0.

**Rolls.** The clock goes 13 to 12, an EVENT space. Event #112: **1, the truck backfires**, on the first try.

**What happened, by the book.**
- Everyone +1 (the event, so it isn't capped). **Clementine** is at 5, so she has a full-urge gobble, urge 0. The farmer is in her zone, so she's **Spotted at the end of the round**, and her friends get "the whole next turkeys’ turn". **Noodle** is Spotted, but the backfire raises "every turkey", so he goes 4 to 5. **Butterbean** is at 5: a full-urge gobble, urge 0, and a token on the Tomato vines (the farmer isn't in the Greenhouse). **Hazel** goes 4 to 5. **Duchess** goes 0 to 1.
- Two other turkeys have just gobbled, so Jumpy wants to raise Hazel by 1. She's at 5, so that would be a **full-urge gobble** too.
- **Here the book runs out** (C3). Is Jumpy's rise part of the event, and so uncapped? Or is it part of "the end of each round", where it shares the single rise with the +1 that follows? Ruling: it's an end-of-round rise. Hazel gobbles (one Jumpy rise, however many gobbles set it off), goes to 0 with a token on the Potting bench, and her end-of-round +1 is already used up. She **stays at 0**. The other reading leaves her at 1.
- Then the round's +1 for turkeys who aren't Spotted: Butterbean 0 to 1, Duchess 1 to 2. Clementine and Noodle are Spotted and don't rise.

**Result.** Clementine is Spotted at 0 and Noodle Spotted at 5, both in the farmer's zone. Unless the flock saves them, he'll grab Noodle (the higher urge). Butterbean is at 1, Hazel at 0 (or 1), Duchess at 2, and there are two new tokens in the Greenhouse.

**Clear?** Mostly. Chapter 3 says clearly that the event comes before the rise, and that a backfire touches Spotted turkeys too. The Jumpy cap needs a ruling. The end-of-round lists in Chapter 7 and on both sheets leave the event out (M3). A table that ran the rise first and then the event would have ended with Clementine at 1 instead of 0.

### Drill 10: the kid in a zone with one turkey in the open and two in its rolled spot

**Passage.** `21-ch07.html`, step 6: "If any turkey is in the open there, the kid yells “DAD! TURKEY!”: a “Huh?” token on the zone." / "Roll the zone’s search line: the kid peeks into that spot. Each turkey in it rolls the spot’s cover; if anyone fails, a “Huh?” token goes on that spot." / "The kid never grabs, never makes anyone Spotted, and causes no Close Calls."

**Setup.** The farmer is in the Greenhouse, and the kid has just walked into the Hen House. Both of its spots are full: Duchess (urge 1) and Clementine (urge 2) are in the Nesting boxes (4+ ×2), and Butterbean (urge 1) and Hazel (urge 2) are in the Roost (3+ ×2). So Noodle is in the open.

**Rolls.** Noodle is in the open, so "DAD! TURKEY!" puts a token on the HH zone. The kid's search line, #113 5: **the Roost**. Butterbean rolls the Roost's 3+: #114 1 **fails**, and red #115 is a **6**. Hazel's 3+: #116 3, hidden, red #117 1 1. The flock chose to roll Butterbean first, so her gobble happened before Hazel's roll, and Jumpy made Hazel's urge 3, not 2. The playtester had already rolled her two red dice, so the missing third red die was rolled as #118: 4, still clean. (This was the playtester's slip, not the book's.)

**What happened.** Butterbean's failure puts one token on the Roost ("if anyone fails"). Her gobble is an ordinary gobble: urge 1 to 0, and with the farmer elsewhere a second token goes on the Roost. Hazel's Jumpy: 2 to 3. So the Hen House now holds a token on the zone and two on the Roost. On his next turn the farmer comes two zones (GH to FB to HH). Noodle in the open will be Spotted, the Roost will be checked, and the zone token means a search-line roll as well.

**Clear?** Yes: one token on the zone for any number of turkeys in the open, and one on the spot for any number of failures. Two loose ends, untested here because Duchess wasn't in the rolled spot (M7). Is the kid's peek a roll "to stay hidden" for Still as a Stump? And if the kid peeks in the farmer's own zone, does a gobble on that roll make a turkey Spotted? The dog's text says such a gobble is ordinary, but the kid "never makes anyone Spotted".

## 4. Issues

Severity: **blocker** (the table can't go on without inventing a rule), **confusing** (the Storyteller has to stop and choose), **minor** (wording). **There were no blockers.** Every gap below had an answer the table could agree on in under a minute. Quotes are exact, from the chapter file named.

### Confusing

**C1. Who is grabbed when Spotted turkeys tie on urge (and so who the decoy saves).**
- Quotes: `15-ch05.html` "If several are Spotted there, he grabs the one with the highest urge; on a tie, the Storyteller rolls a die to pick." / `21-ch07.html` "If several Spotted turkeys are there, he grabs the one with the highest urge (if they’re tied, the lowest card number)." / `41-sheet-storyteller.html` "A Spotted turkey in his zone (highest urge; tie: lowest card number): game over."
- At the table (drill 5): Noodle and Clementine were tied at urge 2 with the decoy ready. Chapter 5's die (#92, 4) picked Clementine, and Chapter 7 picked Noodle. Without a decoy it's only whose last words you hear. With one, it decides which turkey walks free and which stays Spotted for a round.
- Ruling: Chapter 7 and the card, the lowest card number.
- Fix: change Chapter 5 to "on a tie, the one with the lowest card number", so all three places agree.

**C2. Do "Huh?" tokens go down in round 1?**
- Quotes: `13-ch03.html` "For the whole of round 1, he, the dog and the kid don’t count for anything: no Sneak needs a roll because of them, and nobody can be Spotted." / Sneak: "If it fails, you still get there (and can still hide), but you’re noticed: if the farmer is in the zone you end in, you’re Spotted; otherwise put a “Huh?” token on your hiding spot". `14-ch04.html` (a gobble) "If he isn’t, put a “Huh?” token on your hiding spot".
- At the table: Duchess's Sneak into the Noisy Hen House failed and gobbled in round 1 (#3, #4). By the letter of the rules that's two tokens. "Don’t count for anything" suggests the farmer can't hear anything from inside. The tokens decided his first walk (FH to TP to HH).
- Ruling: the tokens go down (R-a). As it happened, this helped the flock, because it pulled him away from the others.
- Fix: add one sentence to the round 1 paragraph, either "Gobbles and failed Sneaks still put “Huh?” tokens down: he hears them from the kitchen" or "...and nothing puts a “Huh?” token down."

**C3. Quirks set off by a farm event: inside or outside "one thing, one rise"?**
- Quotes: `14-ch04.html` "Apart from Puffing Up and farm events, your urge rises at most once per action (yours or anyone’s), once per farmer’s turn and once at the end of each round, however many reasons there are." / `21-ch07.html` "A farm event is its own thing: its urge change applies even if a turkey’s urge has just risen for something else." / `12-ch02.html` Jumpy: "+1 urge whenever another turkey gobbles."
- At the table (drill 9): an end-of-round backfire gave two turkeys full-urge gobbles, and Jumpy fired for Hazel, who was at 5. Is that rise the event's own (uncapped), or one of the end of the round's (capped together with the +1 that comes after)? The answer changed her urge at the end of the round, 0 or 1. The same question comes up for a backfire set off by a prank, where Jumpy could hit the "once per action" limit.
- Ruling: capped. A quirk set off during the end of the round shares that round's one rise.
- Fix: one line in the "One thing, one rise" box, such as "A quirk set off by a farm event counts toward whatever the event happened in (the action, or the end of the round)."

**C4. More than 20 "Huh?" tokens.**
- Quotes: `21-ch07.html` "Use the numbered tokens in order, so the highest number out is always the newest. If you reach the last one, take the tokens on the map and renumber them from 1 in the same order." / `45-sheet-tokens.html` "If you reach 20, take the tokens on the map and renumber them from 1 in the same order."
- At the table (drill 6): with 20 on the map, renumbering gives 1 to 20 again and frees nothing. The next token doesn't exist. The two texts also don't say whether you renumber on placing number 20 or on needing number 21.
- Ruling: a coin stands in as 21, the newest.
- Fix: "Renumber when you need a token and the next number is already down. If all 20 are on the map, use a coin: it's the newest until the farmer clears it." This is rare: this game peaked at 4 tokens.

### Minor

**M1. "Helped this way only once per round": an attempt, or a success?**
- Quote: `13-ch03.html` "Each Spotted turkey can be helped this way only once per round."
- At the table (drill 4): Clementine's rescue of Hazel failed, and Duchess wanted to try again. If only a success counted, the limit would almost never matter, because a success already ends the Spotted.
- Ruling: the attempt counts. As a consequence, a turkey rescued and then re-Spotted in the same turn (by its own helper die, #91) can't be rescued again.
- Fix: "Each Spotted turkey can be the target of only one Gobble for a Friend per round, whether it works or not."

**M2. The path tie-break when the ways split after the first step.**
- Quote: `21-ch07.html` "Where two ways are equally short, he takes the first of those paths in his zone’s “Paths to” list."
- At the table: in round 3 both shortest ways from HH to the Goat Pen begin HH to TP and only split at the Turkey Pen (FH or ML), so the Hen House's list can't choose. Round 5 needed the same thing at Muddy Lane.
- Ruling: use the list of the zone where the ways split (R-b).
- Fix: "...he takes the first-listed path in each zone where the ways split."

**M3. Three end-of-round lists leave out the farm event.**
- Quotes: `21-ch07.html` "After the farmer’s turn: move the Dinner Clock down 1 (if it reaches 0, the flock wins), then every turkey that isn’t Spotted raises its urge by 1, and Pip rolls for his hiccups." / `40-sheet-table.html` "End: clock −1 (0 = win), then every turkey that isn’t Spotted gets +1 urge, then Pip’s hiccups." / `41-sheet-storyteller.html` "Clock −1 (0 = Too Late: the flock wins). Then +1 urge for every turkey that isn’t Spotted. Then Pip rolls a red die". Only `13-ch03.html` puts the event in its place.
- At the table: the game followed Chapter 3. In drill 9 the order changes the result: rise first, then the event, would have left Clementine at 1 instead of 0.
- Fix: add "If it lands on an EVENT space, roll the farm event" after the clock step in all three.

**M4. Keen Eye's wording.**
- Quote: `12-ch02.html` (and the turkey card) "At the start of the turkeys’ turn, the Storyteller rolls the farmer’s route die and tells the flock where he’ll walk if nothing else (a detour, a rake or a “Huh?” token) decides it."
- At the table: Chapter 7 rules out round 1, but the card doesn't, and Chapter 2 says the knack wins over general rules (drill 7a). Under a known rake the roll is required and can't matter (#73, #105). Not covered: Grandma moves him after the roll, so which route line does "use that roll" read?
- Ruling: no roll in round 1; roll under the rake; (untested) roll again if he has been moved.
- Fix: "From round 2, unless a rake already stops him, ... If he's moved before he walks, roll again."

**M5. There's no passing, which isn't said outright.**
- Quotes: `13-ch03.html` "Every turkey takes one action (below), in any order the flock likes." / `12-ch02.html` Restless: "You can’t Hunker Down two rounds in a row."
- At the table: in round 6 and in drill 2, Noodle had to Sneak (or Let It Out) because he couldn't Hunker Down, and in drill 2 the forced Sneak failed and drew the farmer. In drill 5 the turkey left Spotted after the decoy had to Scram. The book implies all this; a new table may not notice it.
- Fix: one sentence in Chapter 3, "There's no passing: Hunker Down is how a turkey stays put."

**M6. A second Spotted turkey after the decoy.**
- Quotes: `16-ch06.html` "The next time the farmer would grab a turkey, he grabs the decoy instead: that turkey isn’t Spotted any more" / `21-ch07.html` step 1: "First, any Spotted turkey that isn’t in his zone stops being Spotted".
- At the table (drill 5): the other Spotted turkey stays Spotted while he's in the Farmhouse, through the dog, the kid, the end of the round and a whole turkeys' turn. Its urge is frozen, it can't Lend a Wing, and it must Scram. It's harmless, but odd. Also, the decoy's −2 can roll an event in the middle of his turn, and "on his next turn" could mean this turn or the following one.
- Fix: "Any other turkey he'd spotted is no longer Spotted either: his arms are full." And: "An event rolled during the farmer's turn affects his following turn."

**M7. Which rolls are "to stay hidden", and the kid's gobbles.**
- Quotes: `12-ch02.html` Still as a Stump: "+1 white die when you roll to stay hidden, and your red dice don’t count on those rolls." / `21-ch07.html` the kid: "Each turkey in it rolls the spot’s cover" and "The kid never grabs, never makes anyone Spotted" / the dog: "a gobble on its roll is still an ordinary gobble" / `13-ch03.html` Hunker Down: "if the farmer is in your zone, that takes a 4+ roll".
- Not tested at the table. The farmer's check and the dog's check are clearly "to stay hidden". The kid's peek and Hunker Down's hide roll are not named. A gobble on the kid's roll in the farmer's own zone would make a turkey Spotted, which reads against "never makes anyone Spotted".
- Fix: "Still as a Stump counts on every roll to hide or stay hidden: the farmer's, the dog's, the kid's and Hunker Down's." Add the dog's sentence about gobbles to the kid.

**M8. The Puddlewick map's legend uses a spot from another farm.**
- Quote: `book/art/map-puddlewick.svg` legend: "Hayloft 3+ ×4: a hiding spot; roll 3+ to stay hidden; room for 4 turkeys."
- There's no Hayloft on Puddlewick, though a reader may hunt for one. Everything else on the map matched the farm table exactly.
- Fix: use a Puddlewick spot, such as "Reeds 3+ ×4".

**M9. The time table skips 5 turkeys.**
- Quote: `22-ch08.html` table rows "2 | 1 hour", "4 | 1¼ to 1½ hours", "6 | 1½ to 2 hours", "8 | about 2 hours".
- A 5-turkey table has to work it out from "about a minute for each turkey and two for the farmer every round, plus 15 minutes". That gives about 70 to 105 minutes for 8 to 13 rounds.
- Fix: list every flock size, or say "in between, take the halfway time".

## 5. How it felt

**Was losing a real risk?** Not in this game. The farmer never Spotted anyone. He searched four times (two with the whole family) and found four empty spots, and his other two turns were detours. The dog checked one turkey and the kid peeked into six spots; both found nothing that stuck. Neither Feather was needed. The closest call was round 4. If both goats rolls had failed (about 1 chance in 30: 25% and then 12.5%), the farmer would have walked into the Goat Pen and checked both Noodle's and Hazel's spots. The drills show how quickly it can turn: drill 4 needed a Feather to avoid a grab, and drill 9 ends with two Spotted turkeys in his zone. The book's "about 4 games in 5" for Standard may well be right across many games. But a careful family will often have a game like this one, where the farmer is never a threat.

**Was there a dominant tactic? Yes: watch the tokens and step aside.** Each of the farmer's six walks was set by a token (four times) or a detour (twice), and the rake took the last turn. Tokens are public and his choice is deterministic: nearest, then newest, then the first-listed path. So at the start of each turkeys' turn the flock knew which zone he'd end in, and often which spot he'd check. Then they weren't there. Detours do double duty: they move him, and they erase the tokens in their zone without a search. In round 4 a detour wiped out two tokens on Noodle's and Hazel's spots, and in round 6 it made Duchess's gobble free. A loud prank's token is just another lure, chosen by the flock. The book half-admits this in Chapter 8 ("a flock that learns to lead the farmer around with “Huh?” tokens will win more often"). In practice the flock didn't have to learn anything: it fell out of reading the walk rules once. Ideas for the author to weigh: break ties between equally near tokens with a die; let the farmer search the zones he walks through when he follows a token; or have a detour leave a token behind.

**Feathers and pranks.** Seven pranks gave 15 of the clock's 22 (7 came from the end of each round). The roasting pan was never tried: the Farmhouse is the dog's and the kid's home ground, and the other pranks were enough. Both Feathers were kept all game. Every gobble happened far from the farmer, or on a turn when a detour or the rake made it harmless.

**Which knacks and quirks mattered?**
- Mattered: *Cool Head* (Clementine's four Hunker Downs, two of them from 2 or 3 straight to 0); *Busy Beak* (at #42 a single die would have shown 4 and ticked one box; the knack finished the water wheel in one roll, though at #74 it made no difference); *Keen Eye's* Close Call shield (round 4, when the detour landed in her zone); *Jumpy* (Hazel rose five times from other turkeys' gobbles, more than from anything else); *Restless* (round 6's forced Sneak failed and left a token; drill 2).
- Never came up in play: *Show-off* and *Still as a Stump* (Duchess was never checked, and never rolled a 6 on a prank), *Quick Feet* (nobody was Spotted), *Chatterbox* (Butterbean never gave or took a Wing), *Fussy* (the flock always gave Clementine her own spot).
- *Keen Eye's forecast* was rolled seven times and never decided a walk.
- In the drills, Show-off was the star. A Duchess who Puffs Up on every hide roll (her red dice don't count, so it only costs urge) rolls a Great about 2 times in 5, and every Great keeps the farmer in her zone another turn. That's a lovely running gag, and it ends with her own full-urge gobble.

**How long would it take?** About 75 to 80 minutes at a real table: 15 minutes to set up, then 8 rounds of about 5 minutes for the turkeys and 2 to 3 for the farmer, dog and kid. The farmer's turn was quick in this game because he never had more than four tokens to choose from. The book's 8 to 13 rounds held (this game took 8).

**Was it funny?** Yes. Duchess, the turkey who can "stand so still that the farmer once hung his hat on her", gobbled three times in eight rounds: on her very first step out of the pen, while dressing the hay bale, and while turning on the sprinklers. The farmer and his whole family turned his own Farmhouse upside down, porch swing and laundry basket included, while every turkey was across the farm. Then he did it again in the Hay Barn, one turn after Clementine slipped out with a 6. The duck choir went off with a double gobble, and the game ended on a Great at a hen party, with twenty hens shrieking as the clock struck zero. Dinner was a cauliflower in a little paper hat.

**What worked.**
- The setup sums agree in four places, and the map matches its table path for path and spot for spot.
- The farmer's walk list (detour, rake, token, route) answered every turn without a pause.
- "The result comes first" and "Too Late beats everything" settled the winning roll at once.
- The worked examples in Chapters 3, 5, 6 and 12 all check out against the rules, number by number.
- The recently changed rules (Show-off's lasting pose, Quick Feet's three zones, Restless, the rescue chain, compulsory hiding, the kid's tokens) each gave a clear answer in the drills.
- Detour pranks are the most satisfying thing in the game: you can see the farmer coming for your friends, and you send him to chase goats instead.

## Appendix: every roll

All 118 rolls, in the order they were made, from `docs/reviews/v1.0/dice/playtest-c-rolls.jsonl`. Rolls 1 to 78 are the game, and rolls 79 to 118 are the drills ("D1" to "D10"). "Roll" is the label typed into the dice script at the time. "Dice" says which dice: white (action), red (gobble, one per point of urge), helper (Lend a Wing), or d6 (the Storyteller's die). A white roll and its red and helper dice were separate calls, in the order shown. "Rolled" is the raw dice; "Result" is what was read from them. Nothing was rerolled or chosen.

Two notes on the log. First, one stray call to the dice script was made by mistake between #4 and #5 while checking the log file. Its result was never displayed or used, and the line was deleted, so the numbering stays continuous. Second, #118 is a correction in drill 10: Hazel's urge had risen to 3 before her roll, so her missing third red die was rolled on its own.

| # | When | Roll | Dice | Rolled | Result |
|---|---|---|---|---|---|
| 1 | R1 | Clementine Sneak TP->HH (Noisy 3+) white | white | 6 | works, Great: goes on to the Hay Barn (no roll needed), Hay stacks |
| 2 | R1 | Clementine Sneak TP->HH red (urge 1) | red | 3 | no gobble |
| 3 | R1 | Duchess Sneak TP->HH (Noisy 3+) white | white | 1 | fails: in the Roost, token 1 on the Roost |
| 4 | R1 | Duchess Sneak TP->HH red (urge 1) | red | 6 | gobble: urge 1 to 0, token 2 on the Roost; no Feather; Hazel Jumpy 1 to 2 |
| 5 | R2 | Keen Eye: farmer route die (from FH) | d6 | 4 | 4 = Goat Pen (tokens decide instead) |
| 6 | R2 | farmer turn: dog die (1-2 nose) | d6 | 3 | 3: not nose, roll route |
| 7 | R2 | farmer turn: dog route die (from FH) | d6 | 6 | 6 = Goat Pen (empty) |
| 8 | R2 | farmer turn: kid route die (from FH) | d6 | 1 | 1 = Turkey Pen |
| 9 | R2 | farmer turn: kid search line (TP) | d6 | 2 | 2 = Turkey house (empty) |
| 10 | R2 | end: farm event (clock 21->20) | d6 | 3 | 3 = the whole family helps look |
| 11 | R3 | Keen Eye: farmer route die (from HH) | d6 | 1 | 1 = Turkey Pen (a token decides instead) |
| 12 | R3 | Clementine Prank hay bale decoy (HB, 5+), Wing from Duchess, no Puff: white | white | 2 3 | fails |
| 13 | R3 | Clementine Prank hay bale red (urge 1) | red | 4 | no gobble |
| 14 | R3 | Duchess helper die (Wing on Clementine) | helper | 5 | no gobble |
| 15 | R3 | Noodle Sneak ML->GP (Noisy 3+) white | white | 2 | fails: Hay feeder, token 3 there |
| 16 | R3 | Noodle Sneak ML->GP red (urge 1) | red | 4 | no gobble |
| 17 | R3 | Hazel Sneak ML->GP (Noisy 3+) white | white | 4 | works: Goat shed |
| 18 | R3 | Hazel Sneak ML->GP red (urge 2) | red | 5 6 | gobble: urge 2 to 0, token 4 on the Goat shed; no Feather |
| 19 | R3 | farmer turn: dog die (1-2 nose), dog in GP | d6 | 5 | 5: not nose, roll route |
| 20 | R3 | farmer turn: dog route die (from GP) | d6 | 2 | 2 = Muddy Lane (empty) |
| 21 | R3 | farmer turn: kid route die (from TP) | d6 | 3 | 3 = Hen House |
| 22 | R3 | farmer turn: kid search line (HH) | d6 | 5 | 5 = Roost (empty) |
| 23 | R4 | Keen Eye: farmer route die (from FH) | d6 | 5 | 5 = Goat Pen (tokens decide; the same zone) |
| 24 | R4 | Noodle Prank goats (GP 4+), Wing from Hazel, no Puff: white | white | 3 1 | fails |
| 25 | R4 | Noodle Prank goats red (urge 2) | red | 1 1 | no gobble |
| 26 | R4 | Hazel helper die (Wing on Noodle) | helper | 3 | no gobble |
| 27 | R4 | Hazel Prank goats (GP 4+), Puff Up 1->2, Wing from Noodle: white | white | 2 4 1 | works: goats loose, clock 19 to 16, detour set |
| 28 | R4 | Hazel Prank goats red (urge 2) | red | 3 4 | no gobble |
| 29 | R4 | Noodle helper die (Wing on Hazel) | helper | 5 | no gobble |
| 30 | R4 | farm event (goats prank, clock 19->16) | d6 | 5 | 5 = cold gust: every urge -1 |
| 31 | R4 | Duchess Prank hay bale (HB 5+), Puff Up 0->1, Wing from Clementine: white | white | 4 3 4 | fails |
| 32 | R4 | Duchess Prank hay bale red (urge 1) | red | 6 | gobble: urge 1 to 0, token 5 on the Loft; no Feather; Hazel Jumpy 1 to 2 |
| 33 | R4 | Clementine helper die (Wing on Duchess) | helper | 3 | no gobble |
| 34 | R4 | Clementine Prank hay bale (HB 5+), Puff Up 1->2, Wing from Duchess: white | white | 2 6 3 | Great: both boxes, hay bale decoy made, clock 16 to 15, decoy ready |
| 35 | R4 | Clementine Prank hay bale red (urge 2) | red | 1 3 | no gobble |
| 36 | R4 | Duchess helper die (Wing on Clementine) | helper | 1 | no gobble |
| 37 | R4 | farmer turn: dog die (1-2 nose), dog in ML | d6 | 5 | 5: not nose, roll route |
| 38 | R4 | farmer turn: dog route die (from ML) | d6 | 4 | 4 = Footbridge (empty) |
| 39 | R4 | farmer turn: kid route die (from HH) | d6 | 1 | 1 = Turkey Pen |
| 40 | R4 | farmer turn: kid search line (TP) | d6 | 4 | 4 = Turkey house (empty) |
| 41 | R5 | Keen Eye: farmer route die (from GP) | d6 | 6 | 6 = Farmhouse (token 5 decides instead) |
| 42 | R5 | Butterbean Prank water wheel (WM 4+, 2 boxes), Busy Beak, no Puff: white | white | 4 6 | works (Great): both boxes, water wheel jammed, clock 14 to 12 |
| 43 | R5 | Butterbean Prank water wheel red (urge 2) | red | 4 3 | no gobble |
| 44 | R5 | farm event (water wheel prank, clock 14->12) | d6 | 5 | 5 = cold gust: every urge -1 |
| 45 | R5 | farmer turn: farmer search line (FB) | d6 | 3 | 3 = Under the bridge (empty) |
| 46 | R5 | farmer turn: dog die (1-2 nose), dog in FB | d6 | 2 | 2: nose, toward Butterbean (Water Mill; card 1 beats Duchess, card 3) |
| 47 | R5 | dog in WM: Butterbean stay hidden 4+, Puff Up 1->2: white | white | 2 5 | works: hidden |
| 48 | R5 | dog in WM: Butterbean red (urge 2) | red | 1 2 | no gobble; dog Close Call 2 to 3 |
| 49 | R5 | farmer turn: kid route die (from TP) | d6 | 4 | 4 = Hen House |
| 50 | R5 | farmer turn: kid search line (HH) | d6 | 6 | 6 = Roost (empty) |
| 51 | R6 | Keen Eye: farmer route die (from FB) | d6 | 4 | 4 = Water Mill (token 5 decides instead) |
| 52 | R6 | Duchess Prank sprinklers (GH 4+), Puff Up 1->2: white | white | 5 4 | works: sprinklers on, clock 11 to 9, detour set |
| 53 | R6 | Duchess Prank sprinklers red (urge 2) | red | 2 6 | gobble: urge 2 to 0, token 6 on the Tomato vines; no Feather (the detour clears it); Hazel Jumpy 1 to 2 |
| 54 | R6 | Noodle Sneak GP->DP (Noisy 3+) white | white | 2 | fails: Reeds, token 7 there |
| 55 | R6 | Noodle Sneak GP->DP red (urge 1) | red | 4 | no gobble |
| 56 | R6 | farmer turn: dog die (1-2 nose), dog in WM | d6 | 6 | 6: not nose, roll route |
| 57 | R6 | farmer turn: dog route die (from WM) | d6 | 6 | 6 = Footbridge (empty) |
| 58 | R6 | farmer turn: kid route die (from HH) | d6 | 4 | 4 = Hay Barn |
| 59 | R6 | farmer turn: kid search line (HB) | d6 | 2 | 2 = Hay stacks (Clementine) |
| 60 | R6 | kid peeks HB Hay stacks: Clementine cover 4+, Puff Up 0->1: white | white | 6 1 | works (6): hidden |
| 61 | R6 | kid peek: Clementine red (urge 1) | red | 1 | no gobble |
| 62 | R6 | end: farm event (clock 9->8) | d6 | 3 | 3 = the whole family helps look |
| 63 | R7 | Keen Eye: farmer route die (from GH) | d6 | 2 | 2 = Footbridge (token 5 decides instead) |
| 64 | R7 | Noodle Prank duck choir (DP 3+), Puff Up 2->3: white | white | 2 3 | works: duck choir, clock 8 to 5, token 8 on the Duck Pond zone (loud) |
| 65 | R7 | Noodle Prank duck choir red (urge 3) | red | 2 6 6 | gobble: urge 3 to 0, token 9 on the Reeds; no Feather; Hazel Jumpy 3 to 4 |
| 66 | R7 | Clementine Sneak HB->HH (4+, farmer next to HB), Puff Up 2->3: white | white | 6 2 | works, Great: could go on to the Turkey Pen, stays in the Roost |
| 67 | R7 | Clementine Sneak HB->HH red (urge 3) | red | 5 4 1 | no gobble |
| 68 | R7 | farmer turn: dog die (1-2 nose), dog in FB | d6 | 5 | 5: not nose, roll route |
| 69 | R7 | farmer turn: dog route die (from FB) | d6 | 2 | 2 = Muddy Lane (empty) |
| 70 | R7 | farmer turn: kid route die (from HB) | d6 | 4 | 4 = Greenhouse |
| 71 | R7 | farmer turn: kid search line (GH) | d6 | 6 | 6 = Flowerpots (empty) |
| 72 | R7 | end: farm event (clock 5->4) | d6 | 4 | 4 = he steps on a rake |
| 73 | R8 | Keen Eye: farmer route die (from HB; rake pending) | d6 | 5 | 5 = Greenhouse (the rake decides instead) |
| 74 | R8 | Butterbean Prank pie berries (BP 3+, 2 boxes), Busy Beak, Puff Up 4->5: white | white | 6 4 2 | Great: both boxes, pie berries gobbled, clock 4 to 2 |
| 75 | R8 | Butterbean Prank pie berries red (urge 5) | red | 5 6 3 4 3 | gobble: urge 5 to 0, token 10 on the Bramble thicket; no Feather; Hazel Jumpy 3 to 4 |
| 76 | R8 | Clementine Prank hen party (HH 3+), Puff Up 4->5: white | white | 6 1 | Great: hen party, clock 2 to 0: Too Late, the flock wins |
| 77 | R8 | Clementine Prank hen party red (urge 5) | red | 2 4 4 4 5 | no gobble (game already over) |
| 78 | R8 | Too Late: what's for dinner instead (d6) | d6 | 6 | 6 = the vegetable "turkey": a cauliflower in a little paper hat |
| 79 | D1 | attempt 1: Duchess stay hidden Behind the wheel (WM 4+), Still as a Stump + Puff Up 2->3 (red dice don't count): white | white | 1 6 3 | Great: hidden; Show-off pose token stays after the clear-up |
| 80 | D1 | next farmer turn: he stays (pose token in his zone), Duchess stay hidden Behind the wheel 4+, Puff Up 3->4: white | white | 6 1 1 | Great again: hidden, a second pose token stays |
| 81 | D2 | round N+1: Noodle (Restless, can't Hunker) Sneak WT->DP (4+, WT next to farmer in WM): white | white | 1 | fails: Reeds, token there; draws the farmer |
| 82 | D2 | Noodle Sneak WT->DP red (urge 2) | red | 3 1 | no gobble |
| 83 | D3 | attempt 1: Noodle Scram from FB (4+), Quick Feet + Puff Up 1->2: white | white | 3 3 1 | fails: still Spotted |
| 84 | D3 | attempt 1: Noodle Scram red (urge 2) | red | 1 2 | no gobble |
| 85 | D3 | attempt 2 (reset): Noodle Scram from FB (4+), Quick Feet + Puff Up 1->2: white | white | 1 6 3 | Great: three zones (Quick Feet), Footbridge to Duck Pond |
| 86 | D3 | attempt 2: Noodle Scram red (urge 2) | red | 3 5 | no gobble |
| 87 | D4 | attempt 1: Clementine (in farmer's zone GP) Gobble for a Friend for Hazel (4+, no red): white | white | 1 | fails: Hazel still Spotted, Clementine Spotted too |
| 88 | D4 | Butterbean (FH, next door) Gobble for a Friend for Clementine (4+, no red): white | white | 6 | Great: Clementine freed, no token, Butterbean not Spotted |
| 89 | D4 | Hazel Scram from GP (4+), Puff Up 3->4, Wing from Clementine: white | white | 4 3 3 | works: Hazel runs to the Duck Pond, not Spotted |
| 90 | D4 | Hazel Scram red (urge 4) | red | 5 1 2 3 | no gobble |
| 91 | D4 | Clementine helper die (Wing on Hazel, in farmer's zone) | helper | 6 | 6: Clementine gobbles in the farmer's zone; Feather spent (2 to 1) |
| 92 | D5 | grab tie-break die per Chapter 5 (odd = Noodle, even = Clementine) | d6 | 4 | 4 = even = Clementine (Chapter 7 says Noodle) |
| 93 | D5 | farm event (decoy clock 9->7 passes 8) | d6 | 5 | 5 = cold gust: every urge -1, Spotted turkeys too |
| 94 | D5 | dog die (1-2 nose), dog in TP | d6 | 4 | 4: not nose, roll route |
| 95 | D5 | dog route die (from TP) | d6 | 4 | 4 = Hen House |
| 96 | D5 | dog in HH: Noodle stay hidden 4+ (urge 1): white | white | 5 | works: hidden |
| 97 | D5 | dog in HH: Noodle red (urge 1) | red | 6 | gobble: token on the Nesting boxes |
| 98 | D6 | Butterbean Prank hen party (HH 3+, loud), Busy Beak: white | white | 4 3 | works: hen party, token 20 (the last one) on the zone |
| 99 | D6 | Butterbean hen party red (urge 2) | red | 2 3 | no gobble |
| 100 | D6 | farmer in HH (token 20 on zone): search line | d6 | 1 | 1 = Nesting boxes (plus the Roost for the coin token) |
| 101 | D6 | Hazel stay hidden Roost (3+), urge 0: white | white | 6 | Great: hidden |
| 102 | D6 | Butterbean stay hidden Nesting boxes (4+), Puff Up 2->3, Wing from Hazel: white | white | 3 6 1 | works (6): hidden |
| 103 | D6 | Butterbean red (urge 3) | red | 2 3 3 | no gobble |
| 104 | D6 | Hazel helper die (Wing on Butterbean) | helper | 5 | no gobble; Chatterbox 3 to 4 |
| 105 | D7b | Keen Eye route die (farmer in WM, rake pending) | d6 | 3 | 3 = Berry Patch (the rake decides instead) |
| 106 | D7b | farmer's turn: rake, no walk; search line (WM) | d6 | 3 | 3 = Flour sacks |
| 107 | D7c | Keen Eye route die (farmer in HH) | d6 | 3 | 3 = Hay Barn (the detour decides instead) |
| 108 | D7c | Duchess Prank sprinklers (GH 4+), urge 1, no Puff: white | white | 5 | works: sprinklers on, detour set |
| 109 | D7c | Duchess sprinklers red (urge 1) | red | 1 | no gobble |
| 110 | D8 | Clementine Sneak FB->WM (4+, farmer in WT next to WM), urge 1: white | white | 3 | fails: must hide, Flour sacks with Hazel, token there; Fussy 1 to 2 |
| 111 | D8 | Clementine Sneak red (urge 1) | red | 1 | no gobble |
| 112 | D9 | attempt 1: end of round farm event (clock 13->12) | d6 | 1 | 1 = the truck backfires |
| 113 | D10 | kid in HH: search line | d6 | 5 | 5 = Roost |
| 114 | D10 | kid peeks Roost: Butterbean cover 3+ (urge 1): white | white | 1 | fails |
| 115 | D10 | Butterbean red (urge 1) | red | 6 | gobble: urge 1 to 0; two tokens on the Roost (fail + gobble); Hazel Jumpy 2 to 3 |
| 116 | D10 | kid peeks Roost: Hazel cover 3+ (urge 2): white | white | 3 | works: hidden |
| 117 | D10 | Hazel red (urge 2) | red | 1 1 | no gobble |
| 118 | D10 | Hazel third red die (correction: Jumpy from Butterbean's gobble made her urge 3 before her roll) | red | 4 | no gobble (Hazel hidden, urge 3) |
