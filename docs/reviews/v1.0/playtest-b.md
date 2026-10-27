# Playtest B: the rowdy table

*Don't Get Gobble Gobbled*, Version 1.0. Windy Ridge Farm, **Hard**, **5 turkeys**: Big Tom, Noodle, Pip, Gizmo and Hazel. One playtester ran the Storyteller and all five turkeys, strictly by the book: every file in `book/src/chapters/` in filename order, plus the map `book/art/map-windy.svg`. Nothing else in the repository was read. Every die came from a script (Node, `Math.random`), with white dice, red dice and the helper die rolled as separate labelled calls. All 184 rolls are in the appendix, numbered; "#" numbers in the text refer to them.

**Which text was played.** The book was read at the start of the session. While the playtest was running, the chapter files, sheets and map were edited (file times 05:07 to 05:10 UTC on 27 October 2026). The game, the drills and every quote below use the text as it was first read. Section 6 lists what has changed since, and which issues the new text already seems to address.

## Summary

**Result: the flock won** in round 8. Big Tom unplugged the oven with a Great during the turkeys' turn, and the clock went from 2 to 0. There were six farmer's turns. All eight pranks were pulled, and the flock's single Feather was spent in round 2. One turkey was Spotted once (Gizmo, round 4); his own Scram at 5+ saved him. The farmer himself only ever found the turkey the flock had sent as a lure. Twelve drills followed. Drill 5 came up in the game itself, and the other eleven were set up and rolled fresh.

Top issues (full list in section 4):

1. **Round 1: does the farmer in the Farmhouse count?** Chapter 3 never says he doesn't. The Chapter 12 example plays as if he doesn't ("with the farmer indoors and nothing Noisy on the way, there's nothing to roll"). On Windy Ridge the Turkey Pen touches the Farmhouse, so this decides whether every opening move is a 4+ roll.
2. **Hazel's knack cancels her own quirk.** "Close Calls don't raise the urge of turkeys in your zone" vs Scaredy, "A Close Call happens to you when the farmer or the dog ends in your zone or next to it."
3. **A Spotted turkey the farmer leaves behind stays Spotted forever**, its urge frozen and only Scram allowed: "There's no other way." This happens after the decoy (drill 2) or after Grandma calls.
4. **The decoy's "his turn ends"**: does the dog and kid still move, and what about a second Spotted turkey?
5. **Soft Steps through the farmer's zone.** A *failed* two-zone Sneak that passes right through the farmer's zone only gives a token, because "if the farmer is in the zone you end in, you're Spotted" (drill 10b). No target is given when the two steps need different rolls.
6. **Gobble for a Friend chains** ("Each Spotted turkey can be helped this way only once per round: he only turns his head once") are allowed by the first half and denied by the second. Chapter 7's tip "It's usually to Gobble for a Friend" can't work, because walking in uses the turkey's action.
7. **Show-off during a search does nothing.** The pose token goes down and is swept up the same moment: "Then take every 'Huh?' token in his zone off the map."
8. **The farmer is too steerable.** Tokens never expire, they're public, and "nearest, then newest" decides his walk. So the flock always knew where he'd go and could redirect him with a fresh gobble or a detour. On Hard he searched three empty spots and the lure, and nobody else.

**Rules that broke** (gave a result that felt wrong): the failed Soft Steps sneak through the farmer's zone (#160); the permanently Spotted turkey (drill 2); Show-off's vanishing pose token (#180); Hazel's Scaredy under a literal reading of Keen Eye.

## 1. Setup

**Turkeys.** The brief requires Big Tom (Big Gobble), Noodle (Quick Feet), Pip (Soft Steps) and Gizmo (Mother Hen). Every turkey has a different knack, so any five cover five knacks. The fifth seat took **Hazel**: Keen Eye is the only knack that changes the farmer's own procedure, and Scaredy is the only quirk that changes Close Calls, so she touches the most rules. Butterbean or Duchess would have added a prank or hiding boost instead; Clementine would have doubled up on Hunker Down.

**Numbers (Chapter 8, Chapter 11, Chapter 12 checklist):**

| Item | Book | Used |
|---|---|---|
| Dinner Clock | "16, plus 1 for every turkey ... Hard adds 2 ... Windy Ridge +1"; Bramble table 5 turkeys Hard = 23, "add 1" | **24** (a pie space) |
| Feathers | 2, Hard −1; table "4 to 8, Hard: 1" | **1** |
| Dog | Hard: follows its nose on 1–3 | yes |
| Kid | 5 or more turkeys | yes |
| Farmer | Hard: runs 3 zones to a token; Scram needs 5+ | yes |
| Start | farmer, dog and kid in the Farmhouse; every turkey in the Turkey house at urge 1 | yes |
| Straight faces (optional) | | not used: who laughs first can't be rolled |

All ten checklist steps in Chapter 12 were followed in order. The setup sums are easy and the two tables agree.

**The map.** Windy Ridge is a 4 by 3 grid, and every zone joins all its neighbours (17 paths). The map's orange gaps match the "Paths to" column exactly.

```
Windmill ------- Sheep Meadow* -- Hilltop (open) --- Pumpkin Field
   |                  |                 |                  |
Apple Orchard -- Stone Wall ------ Big Red Barn ----- Pigsty*
   |                  |                 |                  |
Farmhouse ------ Turkey Pen ------ Vegetable Garden - Driveway (open)
                                                   * = Noisy
```

Short names used below and in the appendix: WM Windmill, SM Sheep Meadow, HT Hilltop, PF Pumpkin Field, AO Apple Orchard, SW Stone Wall, BRB Big Red Barn, PS Pigsty, FH Farmhouse, TP Turkey Pen, VG Vegetable Garden, DW Driveway.

**Rulings used** (each is also an issue in section 4):

- **R-a:** in round 1 the farmer is "indoors" and doesn't count for Sneak rolls, as the Chapter 12 example plays it (C1).
- **R-b:** starting on the 24 pie isn't "landing" on it, and moving off a pie isn't "jumping past" it (M1).
- **R-c:** Keen Eye protects the *other* turkeys in Hazel's zone, not Hazel; otherwise Scaredy never does anything (C2).
- **R-d:** no Keen Eye roll in round 1, because there's no farmer's turn (M2).
- **R-e:** a Soft Steps two-zone Sneak makes one roll, at the highest target either step needs (C5).
- **R-f:** Chatterbox's +1 comes after the roll (M3).
- **R-g:** a farm event set off by a prank is part of that prank's action for "one thing, one rise". This was the text as read (C9).
- **R-h** (drills only): Quick Feet plus a Great on a Scram gives three zones (C8). Show-off in the open puts its token on the zone (C7). After a decoy grab the dog and kid don't move (C4).

## 2. Play log

Urges are given after each change. "T1, T2, ..." are "Huh?" tokens in the order they went down (a higher number is newer).

**Round 1** (no farmer's turn). With the farmer indoors (R-a), nothing needs a roll. Pip uses Soft Steps for two zones, TP to SW to BRB, and hides in the Hayloft. Hazel and Big Tom go TP to SW, Behind the wall. Noodle and Gizmo go TP to VG, Cabbage rows. End of the round: clock 24 to 23, no event (R-b). Everyone rises to urge 2. Pip's hiccups #1: 5.

**Round 2.** Keen Eye #2: 3, so the farmer will walk to the Turkey Pen unless a token calls him.
- Gizmo goes VG to BRB (no roll) and takes the Hayloft.
- Pip pulls *Hide the tractor keys* (4+, 2 boxes). He puffs up 2 to 3 and Gizmo lends a wing. #3 6 5 4 is a Great: both boxes, the prank happens, clock 23 to 21. Red #4 shows a 6. On Hard the farmer can run three zones straight to the Hayloft, where Pip *and* Gizmo sit, so the flock spends its only Feather (1 to 0) and the gobble is cancelled. Helper #5: 1. Chatterbox: Gizmo 2 to 3.
- Hazel goes SW to AO. That's 4+, because AO is next to the farmer's Farmhouse. Big Tom lends a wing. #6 4 6 is a Great, but every move out of AO would need a roll (it's next to the farmer), so there's no extra zone. She takes the Leaf pile. #7 and #8 are clean.
- Big Tom goes SW to SM (Noisy, 3+): #9 3, In among the sheep. #10 is clean.
- Noodle goes VG to DW with no roll, and is in the open (no spots there).

Farmer's turn: no tokens, so he takes the Keen Eye route, FH to TP. Search #11: the Trough, empty. Dog #12: 1, so it follows its nose to the nearest turkey: Hazel in AO. Hazel's 4+ #13 is a 3. She fails and the dog barks: **T1** on the AO Leaf pile. The dog's Close Call takes her 2 to 3 (R-c). Kid #15: 2, to TP; it peeks #16 at the Trough, empty.

End: clock 21 to 20, a pie. Event #18: 4, *he steps on a rake*. Urges +1: Pip 4, Gizmo 4, Hazel 4, Big Tom 3, Noodle 3. Hiccups #17: 4 (this die was rolled just before the event die; the two don't affect each other).

**Round 3.** Keen Eye #19: 5 (Stone Wall), but the rake means he won't walk. So this round a gobble only matters to the dog and the kid, and the flock goes all out.
- Gizmo hunkers down (no roll): 4 to 2. Mother Hen takes Pip 4 to 3.
- Pip uses Soft Steps for BRB to PS (Noisy) to PF, with one roll at 3+ (R-e). #20 5 3 works: Pumpkin pile. Red #21 6 5 5 is a gobble and there's no Feather. Pip 3 to 0, **T2** on the PF Pumpkin pile.
- Big Tom pulls *Stampede the sheep* (4+, loud), puffing up 3 to 4. #22 2 6 is a Great: clock 20 to 17, and **T3** goes on the SM zone (loud). Red #23 2 6 1 6 is a gobble: Big Tom 4 to 0, **T4** on In among the sheep.
- Hazel pulls *Shake the apple trees* (3+, loud) at urge 4, no Puff Up. #24 5 works: clock 17 to 15, and **T5** goes on the AO zone. That passed the 16 pie, so event #26: 1, *the truck backfires*. As part of Hazel's action (R-g) everyone rises 1: Pip 1, Gizmo 3, Hazel 5, Big Tom 1, Noodle 4.
- Noodle pulls *Let down the truck tires* (4+, 2 boxes), puffing up 4 to 5. #27 5 3: one box. Red #28 1 6 5 2 5 is a gobble: 5 to 0, **T6** on the DW zone.

Farmer's turn: the rake keeps him in the Turkey Pen. Search #29: the Turkey house, empty. Dog #30: 1, and Hazel is already in its zone, so it stays. Hazel, at urge 5, rolls 4+: #31 5, hidden; #32 is clean. Then the dog's Close Call hits her at urge 5. That's a **full-urge gobble** ("GOBBLE GOBBLE!"): Hazel 5 to 0, **T7** on the AO Leaf pile. Kid #33: 4, to VG; #34 Bean poles, empty.

End: clock 15 to 14. Pip 2, Gizmo 4, Hazel 1, Big Tom 2, Noodle 1. Hiccups #35: 5.

**Round 4.** Keen Eye #36: 4 (Vegetable Garden), but tokens call him. Down: T1 AO Leaf pile, T2 PF Pumpkin pile, T3 SM zone, T4 SM spot, T5 AO zone, T6 DW zone, T7 AO Leaf pile. The orchard, the meadow and the driveway are all two zones from the Turkey Pen. The newest of them, T7, would send him to the empty orchard.
- Noodle tries the second tires box with no Puff Up. #37 2 fails, and red #38 6 is a gobble: 1 to 0, **T8** on the DW zone. T8 is now the *newest* token two zones away, and Noodle is in the open there.
- So Gizmo (urge 4) uses **Let It Out as a lure** in the Hayloft: 4 to 0, **T9** on the BRB Hayloft. It's also two zones away, and newer still.
- Pip pulls *Carve a pumpkin turkey* (decoy, 5+, 2 boxes), puffing up 2 to 3. #39 2 5: one box. #40 is clean.
- Hazel goes AO to WM and Big Tom goes SM to WM, both with no roll (the farmer isn't next to either), and fill the Grain sacks (room for 2).

Farmer's turn: the newest of the equally near tokens is T9. There are two equally short ways to the barn, via VG or via SW, and the Turkey Pen's list gives VG before SW: TP to VG to BRB (this is drill 5). He checks the Hayloft. Gizmo puffs up 0 to 1: white #41 6 1 keeps him hidden, but red #42 6 is a gobble with the farmer right there. **Gizmo is Spotted** (urge 0). T9 comes off. Dog #43: 5, route AO to FH. Kid #44: 2, to TP; #45 is empty.

End: clock 14 to 13. Pip 4, Hazel 2, Big Tom 3, Noodle 1; Gizmo stays at 0 because he's Spotted. Hiccups #46: **6**, and there's no Feather: Pip 4 to 0, **T10** on the PF Pumpkin pile.

**Round 5.** Keen Eye #47: 2, but tokens call him. **A crisis.** Gizmo is Spotted in the barn with the farmer, and nobody can Gobble for a Friend: Big Tom and Hazel are three zones away (Big Gobble reaches two), and Pip and Noodle are two away (everyone else needs the same zone or next door). Worse, every token is exactly two zones from the barn, so the newest (T10) would send him to Pip.
- Gizmo scrams (5+ on Hard), puffing up 0 to 1. #48 3 5 works: BRB to PS, In the pig mud, and he's no longer Spotted. #49 is clean.
- Big Tom pulls *Send his hat up the windmill* (detour), puffing up 3 to 4, with Hazel's wing. #50 6 6 5 is a Great: clock 13 to 11, and the detour is set. #51 is clean, but helper #52 is a **6**: Hazel gobbles from her own spot, 2 to 0, **T11** on the WM Grain sacks. That passed the 12 pie: event #53, 5, *a cold gust*, everyone −1: Gizmo 0, Pip 0, Hazel 0, Big Tom 3, Noodle 0.
- Pip tries the second decoy box, puffing up 0 to 1: #54 3 3 fails. #55 is clean.
- Noodle tries the second tires box, puffing up 0 to 1: #56 2 5, and the tires go down: clock 11 to 9. #57 is clean.
- Hazel hunkers down for Big Tom: 3 to 1.

Farmer's turn: the detour beats the tokens, so he goes straight to the Windmill. No search, and T11 comes off. Close Calls: Hazel 0 to 1. Big Tom is in Hazel's zone, so Keen Eye keeps him at 1. Dog #58: 5, FH to AO. Kid #59: 5, to SW; #60 is empty.

End: clock 9 to 8, a pie. Event #62: 5, another cold gust: everyone to 0, then +1, so all at 1. Hiccups #61: 2.

**Round 6.** Keen Eye #63: 2, but tokens call him. The farmer is in the Windmill, with Hazel and Big Tom hidden beside him.
- Noodle goes DW to PS (Noisy, 3+). #64 is a 6, a Great. **Show-off**: **T12** on PS In the pig mud. He turns down the extra zone so he can stay and help. #65 is clean.
- Gizmo pulls *Let the pigs loose* (detour), puffing up 1 to 2, with Noodle's wing. #66 5 6 5 is a Great: clock 8 to 5, and the detour is set. Red #67 1 6 is a gobble: 2 to 0, **T13** on PS In the pig mud. Chatterbox then takes him 0 to 1 (R-f). Helper #68: 3.
- Pip tries the second decoy box, puffing up 1 to 2. #69 5 4: the pumpkin turkey is carved, clock 5 to 4 (a pie), and **the decoy is ready**. #70 is clean. Event #71: 1, the truck backfires as part of Pip's action: Gizmo 2, Pip 3, Hazel 2, Big Tom 2, Noodle 2.
- Big Tom goes WM to AO. That's 4+ because he's leaving the farmer's zone. Hazel lends a wing. #72 4 1 works: Cider barrels, not the tokened Leaf pile. #73 and #74 are clean.
- Hazel hunkers down: 2 to 0.

Farmer's turn: the detour takes him to the Pigsty. No search, and T12 and T13 come off. Close Calls: Gizmo 2 to 3, Noodle 2 to 3. Dog #75: 5, AO to FH. Kid #76: 2, to BRB; #77 is empty.

End: clock 4 to 3 (moving off a pie, so no event). Gizmo 4, Noodle 4, Pip 4, Hazel 1, Big Tom 3. Hiccups #78: 3.

**Round 7.** Keen Eye #79: 1, but tokens call him. PF and DW are both one zone from the Pigsty, and T10 (PF) is newer than T8 (DW), so he's heading for Pip's Pumpkin Field.
- Pip uses Soft Steps for PF to HT to BRB, needing 4+ because both steps touch zones next to the farmer. #80 3 5 works: Hayloft. #81 is clean.
- Gizmo hunkers down, already hidden in the farmer's zone, so no roll: 4 to 2. Mother Hen takes Noodle 4 to 3. Then Noodle hunkers down: 3 to 1.
- Big Tom goes AO to FH and takes the Porch. Hazel goes WM to AO and takes the Apple ladder. No rolls: the farmer is far away.

Farmer's turn: PS to PF. He checks the Pumpkin pile (T2, T10): empty. Dog #82: 3, nose, and Big Tom is already in its zone, so it stays. Big Tom's 4+ #83 is a 4 (hidden), but red #84 6 is a gobble: 3 to 0, **T14** on the FH Porch, then the dog's Close Call, 0 to 1. Hazel's Scaredy, since the dog ended next to her zone: 1 to 2. *This was missed at the table and corrected in this log; no roll depended on it.* Kid #85: 2, to SW; #86 is empty.

End: clock 3 to 2. Gizmo 3, Noodle 2, Pip 5, Hazel 3, Big Tom 2. Hiccups #87: 3.

**Round 8.** Keen Eye #88: 5. Two farmer's turns are left, and the flock goes for the oven to win outright.
- Hazel goes AO to FH (no roll) and takes the Garage.
- Big Tom pulls *Unplug the oven* (5+, 2 boxes), puffing up 2 to 3, with Hazel's wing. #89 2 6 3 is **a Great: both boxes**. The clock goes from 2 to 0: **Too Late. The flock wins at once.** Red #90 had a 6 and helper #91 a 3, but "the result comes first", so the game was already over.

What's for dinner instead, #92: 5, *breakfast for dinner: a tower of pancakes.* Pip's victory strut is mostly hiccups.

**Game totals**

| | |
|---|---|
| Rounds | 8 (farmer's turns in rounds 2 to 7) |
| Pranks | all 8: keys (R2), sheep (R3), apples (R3), tires (R3 to R5), hat (R5), pigs (R6), decoy (R4 to R6), oven (R8) |
| Clock | 24 to 0: 7 end-of-round ticks plus 18 from pranks |
| Farm events | 5: rake, truck backfires twice, cold gust twice |
| Feathers | 1 of 1, spent in round 2 |
| Gobbles | 13 rolled or forced: 1 cancelled, 1 too late to matter, 11 counted (1 full urge, 1 hiccup, 1 helper die, 1 Let It Out) |
| Spotted | once (Gizmo, round 4, scrammed in round 5) |
| "Huh?" tokens | 14 placed; up to 11 on the farm at once (the sheet has 12); 8 still down at the end |
| Actions used | Puff Up 12, Lend a Wing 6, Hunker Down 5, Let It Out 1, Scram 1, Gobble for a Friend 0 |
| Farmer's searches | 4: three empty spots and the lure (Gizmo); two turns were detours |
| Dog checks | 3: Hazel twice, Big Tom once |
| Kid peeks | 6, all at empty spots |

## 3. Drill log

Each drill was set up deliberately, with fresh rolls. Windy Ridge, Hard, 5 turkeys, unless the drill says otherwise.

### Drill 1: two Spotted turkeys in the farmer's zone at his grab

**Setup.** Start of a farmer's turn, with the farmer in the Big Red Barn. Gizmo and Noodle are both Spotted in the Hayloft (both failed his check last turn, and both rescues failed). Both are at urge 3. No decoy.

**Rolls.** Tie-break #93: 6. The playtester fixed "odd = Gizmo, even = Noodle" before rolling. Last words #94: 2.

**What the book says happened.** Chapter 7, step 1: "If several Spotted turkeys are there, he grabs the one with the highest urge (roll a die to break a tie)." Noodle is grabbed, the game ends and the flock loses. Noodle: "I regret NOTHING. Except the gobbling."

**Clear?** Yes, except that it doesn't say *how* a die picks between two or three turkeys. Who is grabbed only matters for the last words, or when the decoy is ready (drill 2). Since Spotted turkeys don't rise at the end of the round, "highest urge" mostly means "whoever was jumpiest when spotted". A turkey that gobbled while Spotted (urge 0) is the least likely to be the one carried off.

### Drill 2: the decoy takes a grabbed turkey's place

**Setup.** As drill 1, but Gizmo is at urge 3 and Noodle at 1, the decoy is ready and the clock is at 13. Pip is in the Pigsty (2), Big Tom at the Stone Wall (2), Hazel in the Windmill (1). The dog is in the Vegetable Garden and the kid in the Turkey Pen.

**Rolls and play.** He would grab Gizmo (higher urge), so he grabs the decoy instead. Gizmo isn't Spotted any more, and the farmer carries the decoy to the Farmhouse. The clock goes 13 to 11, passing the 12 pie: event #95, 1, the truck backfires. It's part of the decoy grab, which is part of the farmer's turn, so everyone rises 1, *Spotted Noodle included* (1 to 2). "His turn ends": the dog and kid were skipped (R-h). End of the round: clock 10, the unspotted turkeys rise 1 (Noodle doesn't), hiccups #96: 3.

Next round, Noodle is still Spotted in the barn, three zones from the farmer. All he can do is Scram: #97 4 6 is a Great, with red #98 6 and #99 3. The playtester first counted his urge as 1, forgetting the backfire, so the second red die was rolled on its own afterwards; the 6 already made it a gobble. The Scram works. By R-h that's three zones, BRB to HT to SM to WM, into the Grain sacks. The Show-off token and the gobble token both go on the Grain sacks, and his urge goes to 0. On the next farmer's turn the Windmill is the nearest token (two zones): FH to AO to WM, and he checks the Grain sacks. Noodle puffs up 0 to 1: #100 5 1, hidden (#101 clean). Close Call, 1 to 2.

**Clear?** The swap itself is clear. Three things aren't:
- **The second Spotted turkey.** "That turkey isn't Spotted any more" is singular, so Noodle stays Spotted while the farmer is three zones away. By Chapter 5 he can only stop being Spotted by a Scram or a Gobble for a Friend ("There's no other way"). Until then he can only Scram, his urge doesn't rise, and he can't be grabbed unless the farmer comes back and starts a turn in his zone. That's a strange limbo (C3).
- **The rest of the turn.** Do the dog and kid move after "his turn ends" (C4)?
- **The clock.** The −2 can set off an event and even Too Late. Chapter 6 implies both, but the decoy text could say so.

### Drill 3: the clock hits 0 mid-turkeys'-turn while a turkey is Spotted

**Setup.** Clock 2. Gizmo was Spotted in the Pigsty on the farmer's last turn, and the farmer is still there. Pip is on the Driveway with the tires at one box of two (urge 1). Noodle is in the Apple Orchard (urge 1), and the apples haven't been shaken. The pranks go before any rescue.

**Rolls.** Pip puffs up 1 to 2: #102 1 2 fails (#103 clean). Noodle pulls *Shake the apple trees*, puffing up 1 to 2: #104 2 4 works (#105 clean). Clock 2 to 0.

**What the book says.** Chapter 6: "When it reaches 0, it's Too Late ... The flock wins at once, even in the middle of a turn, and even if somebody is Spotted." Chapter 7's questions and the clock sheet say it too. The flock wins: Gizmo is never grabbed, and the loud token never matters.

**Clear?** Completely. The rule is in three places, and the play's own finish (round 8) worked the same way.

### Drill 4: urge 5, and a Close Call with the farmer in the zone

**Setup.** Clock 10, 1 Feather. The farmer is in the Farmhouse, and a token sits on the Turkey house (Pip gobbled there and left). Big Tom is hidden in the Turkey Pen's Trough at **urge 5**. Hazel is at the Stone Wall (2), Gizmo in the Vegetable Garden (1), Pip in the Apple Orchard's Leaf pile (2), Noodle in the Big Red Barn. The dog and kid are in the Farmhouse.

**Rolls and play.** The nearest token is the Turkey Pen, one zone away. He checks the empty Turkey house and removes the token. Then the Close Calls: Big Tom is at 5, so he has a full-urge gobble, urge 0, and the farmer is in his zone, so **Big Tom is Spotted**. The Feather can't help: "A full-urge gobble can't be stopped with a Feather." Hazel next door has a Scaredy Close Call, 2 to 3. Dog #106: 6, to AO. Pip's #108 3 fails: a bark, a token on the Leaf pile (#109 clean), and his Close Call, 2 to 3. Kid #107: 6, to AO; it peeks #110 at the Cider barrels, empty. End of the round: clock 9. Big Tom, Spotted, doesn't rise. Hiccups #111: 5.

Next turkeys' turn: Big Tom scrams, puffing up 0 to 1. #112 4 3 fails (#113 clean). Gizmo gobbles for a friend from next door: #114 1 fails. Gizmo goes to 0, with a token on his spot. Big Tom can't be helped again this round, so he's grabbed. Last words #115: 2.

**Variant (no roll needed).** With Hazel in the Turkey Pen as well, Keen Eye stops the Close Call raising Big Tom's urge, so there's no gobble at all.

**Clear?** Yes. The chain (Close Call, then the full urge, then a gobble, then Spotted) follows from Chapters 4 and 7 without any guessing. One thing worth knowing: a turkey Spotted by a full-urge gobble sits at urge 0, so its Scram has no red dice unless it puffs up, and a rescue never has any. Everything rides on the 5+.

### Drill 5: two tokens equally near, and two equally short paths (in play, round 4)

**What happened.** The farmer was in the Turkey Pen with tokens in the Apple Orchard (T1, T5, T7), the Sheep Meadow (T3, T4), the Driveway (T6, T8) and the Big Red Barn (T9), all two zones away. "If two are equally near, the newest" picked T9. There are two shortest ways to the barn, via the Vegetable Garden and via the Stone Wall. "He takes the path listed first in his zone's 'Paths to' column" gave the Vegetable Garden: the Turkey Pen lists Farmhouse, Vegetable Garden, Stone Wall. The same tie-breaks decided round 7 (Pumpkin Field over Driveway), and would have decided round 5 (Pigsty before Hilltop) if the detour hadn't gone off.

**Clear?** Yes in practice. Strictly, the first path listed for the Turkey Pen is the *Farmhouse*, which isn't on either short way, so the wording should say "the first of those paths in the list" (M7). Two tokens on one spot (T1 and T7) caused no trouble: he checks the spot once. In the same action, a loud prank's zone token and the pranker's gobble token are ordered by "the result comes first", which makes the gobble the newer one.

### Drill 6: a detour prank and a rake on the same farmer's turn

**Setup.** A rake is pending from last round's event. The farmer is at the Stone Wall. Gizmo (1) and Noodle (1) are in the Pigsty's pig mud, a token sits on the Hilltop, and the clock is at 14. The dog is in the Vegetable Garden and the kid in the Turkey Pen.

**Rolls.** Gizmo pulls *Let the pigs loose*, with Noodle's wing: #116 5 1 works (#117 and #118 clean). Clock 14 to 11, and Chatterbox takes Gizmo 1 to 2. That passed the 12 pie: event #119, 1, the truck backfires, as part of Gizmo's action. Gizmo has already risen once in that action (Chatterbox), so by "at most once per action" he doesn't rise again; the others rise 1.

Farmer's turn. Step 2 says "Check these in order, and do the first one that applies", and the detour comes first, so he goes straight to the Pigsty and the rake never applies. No search. Close Calls: Gizmo 2 to 3, Noodle 2 to 3. Dog #120: 4, to DW. Kid #121: 5, to SW. "An effect 'on his next turn' lasts for one farmer's turn", so the rake is used up. Next turn he walks to the Hilltop token: PS to BRB to HT, since BRB comes first in the Pigsty's list.

**Clear?** Yes. The ordered list and the detour question in Chapter 7 settle it. The rake and the detour don't really conflict (neither lets him walk the paths), but a "whole family helps look" event would be silently lost on a detour turn, and the book could say so.

### Drill 7: the dog sniffs a zone with three turkeys, one in the open (Puddlewick Farm)

**Why Puddlewick.** On Windy Ridge every zone has room for at least 5 turkeys, so with only 5 turkeys no zone can ever be full and nobody can end up in the open in a zone with spots. Chapter 5 implies you're only in the open with "no room, or nowhere to hide" (M6). Puddlewick's Footbridge (Under the bridge 4+, room for 3) can fill up.

**Setup.** Last turkeys' turn, Pip, Gizmo and Hazel were under the bridge. Noodle arrived with no room and stayed in the open. Then Hazel left for the Water Mill. Now Pip (2) and Gizmo (1) are hidden and Noodle (3) is in the open; there's room again, but he hasn't hunkered down. The farmer is far away in the Farmhouse with no tokens down. His route can't reach the Footbridge this turn, so his steps 1 to 4 are skipped. The dog is in the Hen House, the kid in the Greenhouse, Big Tom in the Willow Trees.

**Rolls.** Dog #137: 1, nose: the nearest turkeys are on the Footbridge next door. All three roll 4+, lending wings in a ring (Noodle to Pip, Pip to Gizmo, Gizmo to Noodle; each turkey lends once).
- Pip #138 5 2: hidden (#139 and #140 clean).
- Gizmo #141 1 3 fails: a bark, a token on Under the bridge (#142 and #143 clean).
- Noodle, *in the open*: #144 1 4 passes, but red #145 3 3 6 is a gobble: 3 to 0, a token on the zone (#146 clean).

Close Calls: Pip 2 to 3, Noodle 0 to 1. Gizmo goes 1 to 2: his Chatterbox and the Close Call fall in the same farmer's turn, so they count once.

**Clear?** The order and the token placement are clear: "a 'Huh?' token on its spot (or the zone, if it's in the open)". The dog's roll "to stay hidden, whatever its spot" reads oddly for a turkey that isn't hidden, but the meaning comes through (M14). Being in the open makes no difference to the dog; it only matters to the farmer and the kid.

### Drill 8: the kid in a zone with a turkey in the open and turkeys in its rolled spot (Puddlewick Farm)

**Setup.** The same farmer's turn as drill 7, step 6. The kid is in the Greenhouse.

**Rolls.** Route #147: 2, to the Footbridge. Noodle is in the open, so "DAD! TURKEY!" puts a token on the zone. Search line #148: Under the bridge, the only spot. Pip #149 2 fails (#150 clean), and Gizmo #151 3 fails (#152 clean), so one token goes on Under the bridge ("if anyone fails"). Nobody is Spotted and there are no Close Calls. Both turkeys had already used their wings on the dog, so the peek had no boosts.

**Clear?** Yes. The Footbridge now holds four tokens, two on the zone and two on the spot. Next farmer's turn he'll come, and Noodle, still in the open, will be Spotted.

### Drill 9: Gobble for a Friend from inside the farmer's zone, then a second friend saves the rescuer

**Setup.** Start of the turkeys' turn, with the farmer in the Big Red Barn. Pip has been Spotted in the Hayloft (2) since the farmer's last turn. Gizmo (Tractor, 2) and Noodle (Feed sacks, 1) are in the barn too. Big Tom (1) is next door at the Stone Wall and Hazel (1) next door on the Hilltop. No Feathers.

**Attempt 1.** Gizmo gobbles for Pip from inside the farmer's zone, with Noodle's wing. #153 6 2 is a Great: Pip is freed, and "he can't tell where the gobble came from. No token, and you aren't Spotted." But Noodle's helper die #154 is a **6**: Noodle gobbles from his own spot in the farmer's zone and is Spotted. Big Tom then gobbles for Noodle from next door (Big Gobble): #155 2 5 works. Noodle is freed, and Big Tom goes to 0 with a token on his Stone Wall spot.

**Attempt 2** (same setup, no wing). Gizmo's #156 is a 4: Pip is freed, and the farmer is in Gizmo's zone, so **Gizmo is Spotted**. Big Tom gobbles for Gizmo: #157 1 2 fails. Gizmo has used his action, so he can't Scram, and nobody may try for him again this round, though Hazel is next door and willing. Gizmo is grabbed on the farmer's turn.

**Clear?** No. "Each Spotted turkey can be helped this way only once per round: he only turns his head once." The first half allows the chain (every rescue is for a different turkey). The second half suggests the farmer turns his head only once a round in total. The playtester allowed the chain.

The drill also shows that a rescue from *inside* the zone only moves the Spotted marker onto a turkey that has already spent its action, while from next door it only costs a token. So the Spotted turkey should always Scram first, and rescuers should never stand in the farmer's zone. Chapter 7's "Can a turkey walk into the farmer's zone? ... It's usually to Gobble for a Friend" doesn't work: walking in *is* the action (C6).

### Drill 10: Soft Steps over two zones when only the second needs a roll; Quick Feet's two-zone Scram

**10a.** The farmer is in the Big Red Barn. Pip (2) goes FH to TP (that step alone needs no roll) to SW (next to the farmer: 4+). One roll covers both, at 4+: #158 5 3 works, Behind the wall. Red #159 5 6 is a gobble: Pip 2 to 0, a token on his spot (the farmer isn't in SW). His Great rule wouldn't have helped, because every step out of SW needs a roll. **Clear?** Yes for this case. Had the steps needed *different* targets, as in round 3 (3+ then nothing) or 3+ then 4+, the book doesn't say which to use (C5).

**10b.** The farmer is in the barn and Pip (2) is at the Stone Wall. Pip goes SW to BRB (*the farmer's zone*) to PS on one 4+ roll: #160 2 2 **fails** (#161 clean). By "if the farmer is in the zone you end in, you're Spotted", Pip ends in the Pigsty with a token on his spot and is **not Spotted**, although he just tripped right past the farmer. **This felt broken** (C5).

**10c.** Noodle (2) is Spotted in the barn and scrams with Quick Feet (2 white), needing 5+.
- Attempt 1: #162 6 6 is a Great. Quick Feet's two zones plus the Great's one more makes three by R-h: BRB to HT to SM to WM, Grain sacks, with a Show-off token. #163 is clean.
- Attempt 2: #164 2 5 is a plain success: two zones, BRB to HT to PF, Pumpkin pile, and no longer Spotted. #165 is clean.

**Clear?** The plain case is clear. On a Great it isn't clear whether you get two zones or three (C8).

### Drill 11: hiccups cancelled with a Feather; Show-off rolls a Great during a search

**11a.** Pip is hidden in the Turkey Pen with the farmer, and the flock has 1 Feather. At the end of the round he rolls his hiccup die, and the moment is re-run until a 6 comes up. Attempts #166 to #169 are no hiccup. Attempt 5, #170, is a 6: the flock spends the Feather and it's cancelled: no gobble, no token, urge unchanged. Chapter 4 is explicit: "It *can* stop one of Pip's hiccups, which come from a die." Attempt 6, #171 (a fresh reset), is another 6. This time the flock keeps the Feather to see the other branch. Pip gobbles with the farmer in his zone and is **Spotted at the end of the round**. Next round he scrams, puffing up 0 to 1: #172 1 6 is a Great, TP to VG and one more zone to BRB (#173 clean).

**Clear?** The cancel is clear. The Spotted case isn't covered: Chapter 5's "one chance" is "the rest of the turkeys' turn, if you were Spotted during it, or the whole next turkeys' turn if he spotted you on his own turn", and the end of the round is neither (M5). The obvious answer, the whole next turkeys' turn, was used.

**11b.** The farmer checks the Hayloft, where Noodle (2) and Gizmo (1) are hiding. Noodle puffs up 2 to 3 and Gizmo lends a wing, for 3 white dice, needing 3+.
- Attempt 1, #174 to #176: hidden, no 6.
- Attempt 2, #177 to #179: hidden, no 6.
- Attempt 3, #180 4 6 5: **a Great**. Noodle stays hidden and strikes a pose, putting a token on the Hayloft with the farmer standing right there. That isn't Spotted. Then the last bullet of the search, "Then take every 'Huh?' token in his zone off the map", sweeps it up at once. **Net effect: nothing** (C7). #181 and #182 are clean. Gizmo's own check, #183, is a 2: he fails and is Spotted (#184 clean).

**Clear?** It's clear what the words say. The result feels wrong: the show-off poses in front of the farmer and nothing happens.

### Drill 12: a Sneak that fails into a zone where every spot is full (Puddlewick Farm)

**Why Puddlewick.** No Windy Ridge zone can be full with 5 turkeys (see drill 7). Puddlewick's Hen House (Noisy; Nesting boxes 4+ for 2, Roost 3+ for 2) holds only 4.

**Setup.** Pip and Gizmo are in the Nesting boxes and Hazel and Big Tom in the Roost, so the Hen House is full. The farmer is on the Footbridge next door. Noodle (2) sneaks in from the Turkey Pen. That's 4+, because the farmer is next to the zone he enters, which outranks the Noisy 3+.

**Rolls.** The drill needs a failure, so it was re-run until one came:
- Attempt 1, #122 6 / #123 3 6: a Great and a gobble.
- Attempt 2, #124 5: works.
- Attempt 3, #126 6 / #127 6 1: a Great and a gobble.
- Attempt 4, #128 3: **fails** (#129 clean).

On the failure, Noodle still gets in, but every spot is full, so he's in the open. The farmer isn't in the Hen House, so the token goes "on the zone if you're in the open". Farmer's turn: the nearest token is one zone away, so he walks in. Noodle is in the open, so he's Spotted. The token on the zone means he also rolls the search line: #130 4, the Roost. Hazel #131 2 6 and Big Tom #134 2 4 each lend the other a wing, and both stay hidden (#132, #133, #135 and #136 clean). The tokens come off. Close Calls: Keen Eye protects Pip, Gizmo and Big Tom, and Hazel rises 1 (R-c).

**Clear?** Yes. Side finding from attempts 1 and 3: Show-off says the token goes "on your spot", and a turkey in the open has no spot (C7). The ruling put it on the zone, which made no difference here because the gobble put one there anyway.

## 4. Issues

Severity: **blocker** (the table can't go on without inventing a rule), **confusing** (a Storyteller has to stop and choose, or the result felt wrong), **minor** (wording, tidying). Nothing in this playtest was a blocker: every gap had an answer that a table could agree on in a minute. Quotes are from the text as played. "Now:" says whether that text has changed since (section 6).

### Confusing

**C1. Round 1: does the indoor farmer count for Sneak rolls?** *(Now: answered in Chapter 3, but see section 6)*
- Quotes: `13-ch03.html` "In round 1 the farmer is still indoors pulling on his boots, and there is no farmer’s turn at all." / "Roll 4+ if the farmer is in or next to the zone you leave or the zone you enter." `26-ch12.html` "Put the farmer in the Farmhouse." / "with the farmer indoors and nothing Noisy on the way, there’s nothing to roll." / round 2: "The farmer is next door, so her Sneak to the Chicken Coop needs 4+".
- Why it matters: on Windy Ridge (and Bramble) the Turkey Pen touches the Farmhouse. Read literally, every turkey's first move is a 4+ roll, and a failure puts a "Huh?" token next to the farmer before he's even had a turn.
- Ruling: the farmer, dog and kid don't count in round 1, as the example plays it.
- Fix: say so in Chapter 3's round 1 sentence and on the At the Table sheet. Also decide whether a turkey may go *into* the Farmhouse in round 1.

**C2. Hazel's Keen Eye cancels her own quirk.** *(Now: the quirks have been reshuffled, and Scaredy belongs to Big Tom)*
- Quotes: `12-ch02.html` Keen Eye: "Close Calls don’t raise the urge of turkeys in your zone." Scaredy: "A Close Call happens to you when the farmer or the dog ends in your zone or next to it." `21-ch07.html` "pick the answer that’s funnier and kinder to the flock". That pulls both ways here: funnier says she panics, kinder says she's protected.
- Ruling: Keen Eye protects the *other* turkeys in her zone, not Hazel herself.
- Also: the Storyteller forgot Scaredy once (round 7), because nothing in the farmer's steps prompts for it.
- Fix: "...don't raise the urge of the *other* turkeys in your zone." Put a one-line reminder for any "next to it" quirk in Chapter 7's step 4 and on the Storyteller's Card.

**C3. A Spotted turkey the farmer has left stays Spotted forever.** *(Now: changed, see section 6)*
- Quote: `15-ch05.html` "You stop being Spotted when a Scram works, or when a friend’s Gobble for a Friend works. There’s no other way." Also: "its urge doesn’t rise at the end of the round".
- When it happens: the decoy with two Spotted turkeys (drill 2), Grandma calls, or a turkey that was Spotted and is then left behind. It can only Scram (5+ on Hard), it can't Lend a Wing, its urge is frozen, and it can't be grabbed unless he comes back.
- Ruling: it stays Spotted until a Scram or a rescue works.
- Fix: "If a farmer's turn starts and he isn't in your zone, you're no longer Spotted: he's lost sight of you."

**C4. The decoy: what happens to a second Spotted turkey, and do the dog and kid still move?** *(Now: changed)*
- Quotes: `16-ch06.html` "The next time the farmer would grab a turkey, he grabs the decoy instead: that turkey isn’t Spotted any more, he carries the decoy all the way to the Farmhouse (put him there), the clock moves down 2, and his turn ends." `21-ch07.html` "... the clock moves down 2, and his turn is over." Compare the detour: "The dog and the kid carry on as normal."
- Ruling: the decoy replaces the highest-urge turkey, and the other one stays Spotted (C3). The dog and kid don't move. The −2 can set off an event (it did, #95) and can reach Too Late.
- Fix: one sentence for each point.

**C5. Soft Steps: which target, and failing through the farmer's zone.** *(Now: changed)*
- Quotes: `12-ch02.html` "one Sneak can take you two zones (one roll covers both)". `13-ch03.html` "If it fails, you still get there (and can still hide), but you’re noticed: if the farmer is in the zone you end in, you’re Spotted".
- What happened: no target is given when the two steps need different rolls (round 3, drill 10a). A failed roll through the farmer's own zone ends with only a token (drill 10b), which felt broken.
- Ruling: one roll at the highest target either step needs. The drill 10b result was played as written.
- Fix: "Use the highest target of the two steps. You can't pass through the farmer's zone" (or: "if it fails and you pass through his zone, you stop there, Spotted").

**C6. Gobble for a Friend: chains, and the "walk in" tip.** *(Now: same)*
- Quotes: `13-ch03.html` "Each Spotted turkey can be helped this way only once per round: he only turns his head once." `21-ch07.html` "Can a turkey walk into the farmer’s zone? Yes, with a 4+ Sneak roll. It’s usually to Gobble for a Friend, and it’s usually brave."
- The problem: the chain is legal by the first half and not by the second. The tip can't work: walking in uses the turkey's action, so it can't gobble until next round, and by then its friend has been grabbed. From next door a rescue is better in every way (a token instead of Spotted).
- Ruling: chains allowed, one rescue per Spotted turkey per round.
- Fix: decide on chains and say it plainly. Replace the tip, e.g. "Usually to reach a prank, or to stand next to a friend in trouble." Consider a line in Chapter 3's round: "a Spotted turkey usually Scrams first".

**C7. Show-off: the pose token vanishes during a search, and has nowhere to go in the open.** *(Now: the open case is fixed; the search case is the same, and now matters more, see section 6)*
- Quotes: `12-ch02.html` "Whenever you roll a Great, you strike a pose: a “Huh?” token goes on your spot." `21-ch07.html` "Then take every “Huh?” token in his zone off the map."
- Ruling: during a search the token goes down and is removed at once (drill 11b). A turkey in the open puts it on the zone (drill 12).
- Fix: either "If the farmer is in your zone, he sees the pose: you're Spotted" (harsh), or "a pose token made during a search stays down, so he checks your spot again next turn" (funny and fair).

**C8. Quick Feet (and Soft Steps) plus a Great: how many zones?** *(Now: answered for Soft Steps; Quick Feet is the same)*
- Quotes: `12-ch02.html` "a Scram that works can take you two zones". `13-ch03.html` Scram: "A Great lets you keep running one more zone." Sneak: "Great: you can keep going one more zone, if that move wouldn’t need a roll of its own."
- Ruling: they stack, for three zones (drills 2 and 10c).
- Fix: add "(three on a Great)" or "(a Great adds nothing more)".

**C9. Farm events and "One thing, one rise"; where events go at the end of the round.** *(Now: changed, events stack)*
- Quotes: `14-ch04.html` "Apart from Puffing Up, your urge rises at most once per action (yours or anyone’s), once per farmer’s turn and once at the end of each round, however many reasons there are." / "A farm event counts as part of whatever moved the clock onto its space." `21-ch07.html` "BANG! Every turkey’s urge rises by 1." `13-ch03.html` end of the round: "The Dinner Clock moves down one space (Chapter 6); if that makes it Too Late, the flock wins and nothing else happens. Then every turkey that isn’t Spotted raises its urge by 1". There's no event step in that list; only the Chapter 12 example shows where the event goes.
- Consequences as written: a backfire set off by the end-of-round tick adds nothing for unspotted turkeys, because it's the same "end of round" rise (this didn't come up in play). It *does* hit Spotted turkeys, who otherwise don't rise. A backfire set off by a prank is blocked for anyone who already rose in that action (drill 6). A backfire from the decoy's −2 counts as the farmer's turn's rise (drill 2).
- Ruling: as written (R-g); the event is resolved after the clock moves and before the urge rise.
- Fix: put the event step in the end-of-round list, and decide whether events are capped (the new text says they aren't).

**C10. Chapter 5's worked example gives Duchess a die she shouldn't have.** *(Now: fixed)*
- Quote: `15-ch05.html` "Next turkeys’ turn, Duchess tries to Scram first. She Puffs Up for a third white die: 2, 3, 1."
- The problem: Still as a Stump is "+1 white die when you roll to stay hidden" (`12-ch02.html`), and a Scram isn't a roll to stay hidden. She has 1 die plus the Puff Up, which is 2, and the example teaches the wrong rule.
- Fix: "She Puffs Up for a second white die: 2, 3."

### Minor

**M1. Starting on a pie.** *(Now: fixed)* `16-ch06.html` "Whenever the coin lands on a pie, or jumps past one, the Storyteller rolls a farm event". Windy Ridge Hard with 5 starts on 24, and Chapter 6's own example start ("with four turkeys on Standard at Bramble Farm, that’s 20") is a pie too. Ruling: no event for the starting space, and leaving a pie isn't passing it. Fix: "The starting space doesn't count."

**M2. Keen Eye's roll is often pointless.** *(Now: round 1 answered in Chapter 7)* `12-ch02.html` "At the start of the turkeys’ turn, the Storyteller rolls the farmer’s route die and tells the flock where he’ll walk if no “Huh?” token calls him." In round 1 there's no farmer's turn. Under a rake he doesn't walk. In rounds 4 to 7 tokens always overrode it, so the forecast mattered once in eight rounds. Ruling: skipped in round 1, rolled anyway under the rake. Fix: "From round 2, when he'll walk his route"; or have Keen Eye name the token he'll chase.

**M3. When does Chatterbox's +1 land?** *(Now: same; Chatterbox is now Butterbean's)* `12-ch02.html` "+1 urge whenever you Lend a Wing, or a friend Lends you one." Before the roll, it adds a red die. After a gobble, it lifts 0 to 1. Ruling: after the roll (round 6, #67). Fix: "after the roll".

**M4. The dog.** *(Now: the Chapter 5 wording has changed)*
- Quotes: `15-ch05.html` "the farm dog follows the farmer around and sometimes follows its nose toward the nearest turkey" vs `21-ch07.html` "Otherwise, read the same roll on its zone’s route line and send it there."
- Ruling: Chapter 7.
- A design note too: on Hard the dog only reads its route line on 4 to 6. From the Windy Ridge Farmhouse every 4 to 6 is the Apple Orchard, and from the orchard 5 to 6 lead back home. The dog spent the whole game in those two zones (AO, AO, FH, AO, FH, FH).
- Fix: correct Chapter 5. Consider reading the dog's route on its own die.

**M5. Spotted at the end of the round.** *(Now: fixed)* `15-ch05.html` "the rest of the turkeys’ turn, if you were Spotted during it, or the whole next turkeys’ turn if he spotted you on his own turn." A hiccup or a full-urge gobble at the end of the round fits neither (drill 11a). Ruling: the whole next turkeys' turn. Fix: "...or the whole next turkeys' turn otherwise."

**M6. Is hiding optional?** *(Now: same)* `13-ch03.html` "If a hiding spot there has room, you can hide in it; if not, you’re in the open." vs `15-ch05.html` "A turkey that isn’t (no room, or nowhere to hide) is in the open." Ruling: you hide whenever there's room. Fix: pick one wording. A note too: on Windy Ridge with up to 5 turkeys no zone can fill, so "no room" never happens there.

**M7. "The path listed first."** *(Now: same)* `21-ch07.html` "Where two ways are equally short, he takes the path listed first in his zone’s “Paths to” column." For the Turkey Pen the first path is the Farmhouse, which isn't on either short way (drill 5). Fix: "...the first of those paths in his zone's list."

**M8. Tie-breaks.** *(Now: same)*
- `21-ch07.html` "(roll a die to break a tie)" gives no mapping from the die to the turkeys (drill 1).
- The dog's "(you pick if two are equally near)" sits badly with the chapter's opening line, "You don’t decide where the farmer goes or whom he finds".
- Fix: "odd: the one listed first in turn order", or similar. For the dog: "the newer token's turkey" or a die.

**M9. "Huh?" tokens run short and never expire.** *(Now: the sheet still has 12)* `15-ch05.html` "Tokens stay down until the farmer ends his turn in their zone and searches it." The tokens sheet has 12. This game peaked at 11 down at once, drill 8 put 4 on one zone, and 8 were still down at the end. Fix: "If you run out, use coins". See section 5 for what never-expiring tokens do to the game.

**M10. Playing time and game length.** *(Now: both changed)* `11-ch01.html` "about 45 minutes with 2 turkeys" vs `22-ch08.html` "2 | 1 hour" (the back cover says "45 minutes to 2 hours"). `22-ch08.html` "A game lasts about 10 to 14 rounds"; this game lasted 8. Fix: one set of numbers everywhere.

**M11. One symbol, two meanings.** *(Now: fixed, the clock spaces are EVENT spaces)* `16-ch06.html` says each multiple of 4 "has a pie on it". `44-sheet-clock.html` "On a ★ space". `41-sheet-storyteller.html` "Farm events: on or past each ★ (multiples of 4)". The map uses ★ for pranks. Fix: one symbol for event spaces, and not the prank star.

**M12. The Windy Ridge map's start label.** *(Now: the map file has changed; re-check)* `book/art/map-windy.svg` "FARMER & DOG START" vs `26-ch12.html` "With 5 or more turkeys, the kid as well." Fix: "FARMER, DOG & KID START".

**M13. Mother Hen and hunkering for a friend.** *(Now: fixed)* `12-ch02.html` "When you Hunker Down, every other turkey in your zone lowers its urge by 1 too." plus `13-ch03.html` "or lower the urge of a friend in your zone by 2 instead". Does the friend get −2 or −3? This didn't come up in play (Gizmo always hunkered down for himself). Fix: say which.

**M14. The dog's roll for a turkey in the open.** *(Now: same)* `21-ch07.html` "Every turkey in the dog’s zone that isn’t Spotted rolls 4+ to stay hidden, whatever its spot." A turkey in the open isn't hidden (drill 7). Fix: "rolls 4+ (hidden or not)".

## 5. How it felt

**Was losing a real risk on Hard?** Briefly, yes. Rounds 4 to 5 were the one real scare. Gizmo was Spotted with no rescuer in range, and the flock's chance of losing right there was about one in five: his Scram at 5+ with two dice (about 56%), with Pip's 5+ decoy roll (about 56%) as the backup. Pip also came close: in round 5 he would have been searched in a tokened spot if the hat prank (about 88% with 3 dice) had failed. The drills show how fast it ends when it does go wrong (drills 1, 4 and 9 each end in a grab).

Apart from that, the farmer himself was toothless. He searched four times and found only the lure, who had volunteered. The danger came from the dog (three checks, one bark, two gobbles) and from the turkeys' own red dice: 11 gobbles in 8 rounds.

**Was there a dominant tactic? Yes: steer the farmer.** "Huh?" tokens are public, they never expire, and his walk is decided by "nearest, then newest" (and on Hard he gets there). So with any token on the farm, which was every round from 3 on, the flock knew exactly where he would go. They could change it by making a *newer* token at the same distance (Gizmo's lure in round 4) or with a detour, which beats everything (rounds 5 and 6). Keen Eye even forecasts the no-token walk. Old tokens kept working as free lures. Add all-out pranking on turns when he couldn't reach anyone (the rake turn, the two detour turns), and the flock finished in 8 rounds, against the book's 10 to 14. A flock that does the token arithmetic is in charge.

Ideas, for the author to weigh: tokens fade after one farmer's turn; the farmer rolls a die between equally near tokens instead of always taking the newest; or a detour costs the flock something (for example, the dog comes back with him).

**Were Feathers and pranks spent?** Pranks: all eight, which gave 18 of the clock's 24. Feathers: the one Feather on Hard went in round 2 on an obvious emergency. After that the flock gobbled eleven times with nothing to stop it, and one of those gobbles caused the only Spotted. With 5 turkeys on Hard a single Feather barely counts as a resource; 2 would still be scarce.

**Did any knack or quirk never matter?**
- In play, never: Big Gobble (the one time it was needed, Big Tom was three zones away), Quick Feet (Noodle was never Spotted), Restless (Big Tom never hunkered down for himself).
- Hardly: Keen Eye's forecast (mattered once; its Close Call shield mattered once), and Scaredy (once, and it was forgotten at the table).
- Small: Show-off (once, and the detour cleared its token), Chatterbox (a few +1s, usually swallowed by the "once per farmer's turn" limit).
- Bad once: Hiccups (one 6, one token).
- Very good: Mother Hen (twice) and Soft Steps. Soft Steps made three two-zone moves, including the escape from the Pumpkin Field in round 7.

All of these did matter in the drills.

**How long would it take?** About 75 to 90 minutes at a real table, including 15 minutes to set up. The turkeys' turns were quick. The slow part was the farmer's turn, which by the middle of the game meant finding the nearest and newest of up to 11 tokens, counting a three-zone run, and then running the dog and the kid with their own rolls. A token-order tracker (the numbers T1, T2, ... used here) would help a real Storyteller.

**Was it funny?** Yes, often. Gizmo rolled a perfect 6 to stay hidden in the hayloft and then gobbled anyway, two feet from the farmer. Hazel gobbled *for someone else*: the helper die went off while she was lending Big Tom a wing on the windmill prank. The farmer spent a whole turn retrieving his hat from a windmill sail while two turkeys hid in the grain sacks under it. Big Tom gobbled at the dog on the porch, then strolled into the kitchen and unplugged the oven. The farmer chasing a trail of old "Huh?" noises across the hilltop is a lovely running joke.

**What worked.**
- "The result comes first" settled every close moment, including the winning gobble.
- Too Late beating everything is said in three places, and nobody could get it wrong.
- The ordered walk list (detour, rake, token, route) answered drill 6 at once.
- The setup sums matched between Chapter 8's text, its table, Chapter 11 and the Storyteller's Card.
- The map matched its table path for path.
- Let It Out as a lure is the best idea in the game: it's tense, it's funny, and it works.

## 6. The book changed while this playtest ran

Between the first read and the writing of this report, the chapter files, sheets and the Windy Ridge map were edited (05:07 to 05:10 UTC). A quick check of the current text against the quotes above:

- **Seem addressed in the current text:** C1 (round 1), C3 (a Spotted turkey the farmer can't see stops being Spotted), C4 (after the decoy, the dog and kid still take their steps), C5 (highest target; no passing through the farmer's zone), C9 (events now stack), C10 (Duchess example), M1, M4 (wording), M5, M10, M11, M13. Show-off in the open (part of C7) is also addressed, and so is Soft Steps plus a Great (part of C8).
- **Unchanged:** C6, C7 (during a search), C8 (Quick Feet), M2 (rake case), M3, M6, M7, M8, M9, M14, and the observations in section 5.
- **The quirks have been reassigned between turkeys** in the current text: Duchess is now the Show-off, Big Tom Scaredy, Noodle Restless, Hazel Jumpy, Gizmo Worrywart, Butterbean Chatterbox, Clementine Fussy. So C2 no longer exists as written. The knack-and-quirk notes in section 5 describe the old pairings. Show-off on Duchess, whose hide rolls get an extra die, makes C7's vanishing pose token come up far more often.
- **A possible new contradiction.** Chapter 3 now says "Until his first turn, he, the dog and the kid don’t count for anything: no Sneak needs a roll because of them". His first turn is in round 2, *after* the turkeys' turn. But Chapter 7 says "Until then they don’t count for anything (Chapter 3) ... From round 2 on, do these steps in order", and the Chapter 12 example still says, in round 2, "The farmer is next door, so her Sneak to the Chicken Coop needs 4+". Does he count during round 2's turkeys' turn or not?

These are notes from a quick check, not a second playtest of the new text.

## Appendix: every roll

All 184 rolls, in the order they were made. Rolls 1 to 92 are the game; rolls 93 to 184 are the drills ("D1" to "D12"). "When" gives the round ("R3"), the part of the round, or the drill and attempt. "Dice" says which dice: white (action), red (gobble, one per point of urge), helper (Lend a Wing), or d6 (the Storyteller's die). A white roll and its red and helper dice were rolled as separate calls, in the order shown. Zone short names are as in section 1. "Rolled" is the raw dice; "Result" is what the playtester read from them.

The first few rolls were logged in a file that another playtest session wrote two rolls into by accident. Those two rolls are not part of this game and are left out. The numbering here is this playtest's own, and nothing was rerolled.

| # | When | Who | What for | Target | Dice | Rolled | Result |
|---|---|---|---|---|---|---|---|
| 1 | R1 end | Pip | Hiccups | 6=gobble | red | 5 | no hiccup |
| 2 | R2 start | Storyteller | Keen Eye farmer route die (from Farmhouse) | - | d6 | 3 | 3 = Turkey Pen (no tokens, so he walks it) |
| 3 | R2 | Pip | Prank tractor keys (BRB), Puff Up 2->3, Wing from Gizmo | 4+ | white | 6 5 4 | Great (6): both boxes ticked, Hide the tractor keys happens, clock 23->21 |
| 4 | R2 | Pip | Prank tractor keys | gobble on 6 | red (urge 3) | 4 2 6 | red 6: gobble; flock spends its only Feather (1->0), cancelled |
| 5 | R2 | Gizmo | Helper die, Wing on Pip's prank | 6=Gizmo gobbles | helper | 1 | no gobble; Gizmo Chatterbox +1 (2->3) |
| 6 | R2 | Hazel | Sneak SW->Apple Orchard, Wing from Big Tom, no Puff | 4+ | white | 4 6 | works, Great; extra zone not allowed (any move out of AO needs a roll: AO is next to the farmer). Hides in Leaf pile |
| 7 | R2 | Hazel | Sneak SW->AO | gobble on 6 | red (urge 2) | 1 5 | no gobble |
| 8 | R2 | Big Tom | Helper die, Wing on Hazel's sneak | 6=Big Tom gobbles | helper | 4 | no gobble |
| 9 | R2 | Big Tom | Sneak SW->Sheep Meadow (Noisy) | 3+ | white | 3 | works; hides In among the sheep |
| 10 | R2 | Big Tom | Sneak SW->SM | gobble on 6 | red (urge 2) | 1 2 | no gobble |
| 11 | R2 farmer | Farmer | Search line Turkey Pen | - | d6 | 6 | Trough: empty |
| 12 | R2 farmer | Dog | Dog die at Farmhouse (1-3 nose on Hard) | - | d6 | 1 | nose: one zone toward nearest turkey (Hazel, AO) -> dog to AO |
| 13 | R2 farmer | Hazel | Stay hidden from dog (AO Leaf pile) | 4+ | white | 3 | fails: dog barks, Huh? token T1 on AO Leaf pile; dog Close Call Hazel 2->3 |
| 14 | R2 farmer | Hazel | Stay hidden from dog | gobble on 6 | red (urge 2) | 1 1 | no gobble |
| 15 | R2 farmer | Kid | Kid route from Farmhouse | - | d6 | 2 | kid to Turkey Pen; nobody in the open |
| 16 | R2 farmer | Kid | Kid search line Turkey Pen | - | d6 | 6 | Trough: empty |
| 17 | R2 end | Pip | Hiccups | 6=gobble | red | 4 | no hiccup |
| 18 | R2 end | Storyteller | Farm event (clock 21->20, pie) | - | d6 | 4 | 4: He steps on a rake -> next farmer's turn he doesn't walk |
| 19 | R3 start | Storyteller | Keen Eye farmer route die (from Turkey Pen; rake pending) | - | d6 | 5 | 5 = Stone Wall, but the rake means he won't walk |
| 20 | R3 | Pip | Sneak x2 BRB->Pigsty(Noisy)->Pumpkin Field, Soft Steps, no Puff | 3+ | white | 5 3 | works; Pip ends in Pumpkin Field, hides in Pumpkin pile |
| 21 | R3 | Pip | Sneak x2 | gobble on 6 | red (urge 3) | 6 5 5 | red 6: gobble, no Feathers; Pip 3->0; Huh? token T2 on PF Pumpkin pile |
| 22 | R3 | Big Tom | Prank Stampede the sheep (SM), Puff Up 3->4 | 4+ | white | 2 6 | Great: Stampede the sheep happens, clock 20->17; loud: T3 on SM zone |
| 23 | R3 | Big Tom | Prank Stampede | gobble on 6 | red (urge 4) | 2 6 1 6 | red 6: gobble; Big Tom 4->0; T4 on SM In among the sheep |
| 24 | R3 | Hazel | Prank Shake the apple trees (AO), no Puff | 3+ | white | 5 | works: Shake the apple trees happens, clock 17->15 (passes 16 pie); loud: T5 on AO zone |
| 25 | R3 | Hazel | Prank apples | gobble on 6 | red (urge 4) | 2 2 1 1 | no gobble |
| 26 | R3 turkeys | Storyteller | Farm event (clock 17->15, passed 16) | - | d6 | 1 | 1: Truck backfires, every turkey +1 (counts as part of Hazel's action): Pip 1, Gizmo 3, Hazel 5, Big Tom 1, Noodle 4 |
| 27 | R3 | Noodle | Prank Let down the truck tires (DW), Puff Up 4->5 | 4+ | white | 5 3 | works: 1 of 2 boxes ticked on Let down the truck tires |
| 28 | R3 | Noodle | Prank tires | gobble on 6 | red (urge 5) | 1 6 5 2 5 | red 6: gobble; Noodle 5->0; T6 on DW zone (in the open) |
| 29 | R3 farmer | Farmer | Search line Turkey Pen (rake, no walk) | - | d6 | 4 | Turkey house: empty |
| 30 | R3 farmer | Dog | Dog die at Apple Orchard | - | d6 | 1 | nose; nearest turkey Hazel already in AO: dog stays |
| 31 | R3 farmer | Hazel | Stay hidden from dog (AO Leaf pile) | 4+ | white | 5 | stays hidden |
| 32 | R3 farmer | Hazel | Stay hidden from dog | gobble on 6 | red (urge 5) | 5 5 2 3 5 | no red 6. Dog Close Call at urge 5 -> full-urge gobble, Hazel 5->0, T7 on AO Leaf pile |
| 33 | R3 farmer | Kid | Kid route from Turkey Pen | - | d6 | 4 | kid to Vegetable Garden; nobody there |
| 34 | R3 farmer | Kid | Kid search line Vegetable Garden | - | d6 | 4 | Bean poles: empty |
| 35 | R3 end | Pip | Hiccups | 6=gobble | red | 5 | no hiccup |
| 36 | R4 start | Storyteller | Keen Eye farmer route die (from Turkey Pen) | - | d6 | 4 | 4 = Vegetable Garden, but tokens call him |
| 37 | R4 | Noodle | Prank truck tires box 2 (DW), no Puff | 4+ | white | 2 | fails (no box) |
| 38 | R4 | Noodle | Prank tires | gobble on 6 | red (urge 1) | 6 | red 6: gobble; Noodle 1->0; T8 on DW zone (newest at distance 2 from farmer) |
| 39 | R4 | Pip | Prank Carve a pumpkin turkey (PF, decoy), Puff Up 2->3 | 5+ | white | 2 5 | works (5): 1 of 2 decoy boxes |
| 40 | R4 | Pip | Prank decoy | gobble on 6 | red (urge 3) | 2 2 2 | no gobble |
| 41 | R4 farmer | Gizmo | Stay hidden, farmer checks BRB Hayloft, Puff Up 0->1 | 3+ | white | 6 1 | white 6 (Great) - would stay hidden |
| 42 | R4 farmer | Gizmo | Stay hidden Hayloft | gobble on 6 | red (urge 1) | 6 | red 6: gobble with farmer in zone -> Gizmo SPOTTED in BRB, urge 0; T9 removed |
| 43 | R4 farmer | Dog | Dog die at Apple Orchard | - | d6 | 5 | route: AO 5 -> Farmhouse; nobody there |
| 44 | R4 farmer | Kid | Kid route from Vegetable Garden | - | d6 | 2 | kid to Turkey Pen; nobody there |
| 45 | R4 farmer | Kid | Kid search line Turkey Pen | - | d6 | 4 | Turkey house: empty |
| 46 | R4 end | Pip | Hiccups | 6=gobble | red | 6 | 6: HIC! no Feathers; Pip (3->4 at end of round) gobbles -> 0; T10 on PF Pumpkin pile |
| 47 | R5 start | Storyteller | Keen Eye farmer route die (from Big Red Barn) | - | d6 | 2 | 2 = Stone Wall (tokens will call him instead) |
| 48 | R5 | Gizmo | Scram from BRB (Spotted), Puff Up 0->1 | 5+ (Hard) | white | 3 5 | works (5): Gizmo no longer Spotted, runs BRB->Pigsty, hides In the pig mud |
| 49 | R5 | Gizmo | Scram | gobble on 6 | red (urge 1) | 1 | no gobble |
| 50 | R5 | Big Tom | Prank Send his hat up the windmill (WM, detour), Puff 3->4, Wing from Hazel | 4+ | white | 6 6 5 | Great: Send his hat up the windmill happens, clock 13->11 (passes 12); detour pending (WM) |
| 51 | R5 | Big Tom | Prank hat | gobble on 6 | red (urge 4) | 5 4 2 4 | no gobble |
| 52 | R5 | Hazel | Helper die, Wing on Big Tom's prank | 6=Hazel gobbles | helper | 6 | helper 6: Hazel gobbles from her spot, 2->0; T11 on WM Grain sacks |
| 53 | R5 turkeys | Storyteller | Farm event (clock 13->11, passed 12) | - | d6 | 5 | 5: Cold gust, every turkey -1: Gizmo 0, Pip 0, Hazel 0, Big Tom 3, Noodle 0 |
| 54 | R5 | Pip | Prank Carve a pumpkin turkey box 2 (PF), Puff Up 0->1 | 5+ | white | 3 3 | fails |
| 55 | R5 | Pip | Prank decoy | gobble on 6 | red (urge 1) | 4 | no gobble |
| 56 | R5 | Noodle | Prank truck tires box 2 (DW), Puff Up 0->1 | 4+ | white | 2 5 | works: Let down the truck tires happens, clock 11->9 |
| 57 | R5 | Noodle | Prank tires | gobble on 6 | red (urge 1) | 3 | no gobble |
| 58 | R5 farmer | Dog | Dog die at Farmhouse | - | d6 | 5 | route: Farmhouse 5 -> Apple Orchard (next to Hazel; she already had her Close Call this turn) |
| 59 | R5 farmer | Kid | Kid route from Turkey Pen | - | d6 | 5 | kid to Stone Wall; nobody there |
| 60 | R5 farmer | Kid | Kid search line Stone Wall | - | d6 | 1 | Behind the wall: empty |
| 61 | R5 end | Pip | Hiccups | 6=gobble | red | 2 | no hiccup |
| 62 | R5 end | Storyteller | Farm event (clock 9->8, pie) | - | d6 | 5 | 5: Cold gust, all -1 (Gizmo 0, Pip 0, Hazel 0, Big Tom 0, Noodle 0), then end-of-round +1 -> all 1 |
| 63 | R6 start | Storyteller | Keen Eye farmer route die (from Windmill) | - | d6 | 2 | 2 = Sheep Meadow (tokens will call him instead) |
| 64 | R6 | Noodle | Sneak DW->Pigsty (Noisy) | 3+ | white | 6 | Great: works; Show-off -> T12 on PS In the pig mud; Noodle declines the extra zone, hides In the pig mud |
| 65 | R6 | Noodle | Sneak DW->PS | gobble on 6 | red (urge 1) | 5 | no gobble |
| 66 | R6 | Gizmo | Prank Let the pigs loose (PS, detour), Puff 1->2, Wing from Noodle | 4+ | white | 5 6 5 | Great: Let the pigs loose happens, clock 8->5; detour pending (PS) |
| 67 | R6 | Gizmo | Prank pigs | gobble on 6 | red (urge 2) | 1 6 | red 6: gobble, Gizmo 2->0; T13 on PS In the pig mud; then Chatterbox +1 (ruling: after the roll) -> 1 |
| 68 | R6 | Noodle | Helper die, Wing on Gizmo's prank | 6=Noodle gobbles | helper | 3 | no gobble |
| 69 | R6 | Pip | Prank Carve a pumpkin turkey box 2 (PF), Puff Up 1->2 | 5+ | white | 5 4 | works: Carve a pumpkin turkey happens, clock 5->4 (pie); DECOY READY |
| 70 | R6 | Pip | Prank decoy | gobble on 6 | red (urge 2) | 3 4 | no gobble |
| 71 | R6 turkeys | Storyteller | Farm event (clock 5->4, pie) | - | d6 | 1 | 1: Truck backfires, every turkey +1 (part of Pip's action): Gizmo 2, Pip 3, Hazel 2, Big Tom 2, Noodle 2 |
| 72 | R6 | Big Tom | Sneak WM->Apple Orchard (leaving farmer's zone), Wing from Hazel | 4+ | white | 4 1 | works; Big Tom in AO, hides in Cider barrels (not the tokened Leaf pile) |
| 73 | R6 | Big Tom | Sneak WM->AO | gobble on 6 | red (urge 2) | 1 2 | no gobble |
| 74 | R6 | Hazel | Helper die, Wing on Big Tom's sneak | 6=Hazel gobbles | helper | 3 | no gobble |
| 75 | R6 farmer | Dog | Dog die at Apple Orchard | - | d6 | 5 | route: AO 5 -> Farmhouse; nobody there |
| 76 | R6 farmer | Kid | Kid route from Stone Wall | - | d6 | 2 | kid to Big Red Barn; nobody there |
| 77 | R6 farmer | Kid | Kid search line Big Red Barn | - | d6 | 6 | Feed sacks: empty |
| 78 | R6 end | Pip | Hiccups | 6=gobble | red | 3 | no hiccup |
| 79 | R7 start | Storyteller | Keen Eye farmer route die (from Pigsty) | - | d6 | 1 | 1 = Big Red Barn (token T10 calls him instead) |
| 80 | R7 | Pip | Sneak x2 PF->Hilltop->BRB, Soft Steps, no Puff | 4+ | white | 3 5 | works; Pip in BRB Hayloft |
| 81 | R7 | Pip | Sneak x2 | gobble on 6 | red (urge 4) | 1 4 5 3 | no gobble |
| 82 | R7 farmer | Dog | Dog die at Farmhouse | - | d6 | 3 | nose; nearest turkey Big Tom already in Farmhouse: dog stays |
| 83 | R7 farmer | Big Tom | Stay hidden from dog (FH Porch) | 4+ | white | 4 | stays hidden (4) |
| 84 | R7 farmer | Big Tom | Stay hidden from dog | gobble on 6 | red (urge 3) | 6 1 2 | red 6: gobble, no Feathers; Big Tom 3->0; T14 on FH Porch; dog Close Call 0->1 |
| 85 | R7 farmer | Kid | Kid route from Big Red Barn | - | d6 | 2 | kid to Stone Wall; nobody there |
| 86 | R7 farmer | Kid | Kid search line Stone Wall | - | d6 | 2 | Behind the wall: empty |
| 87 | R7 end | Pip | Hiccups | 6=gobble | red | 3 | no hiccup |
| 88 | R8 start | Storyteller | Keen Eye farmer route die (from Pumpkin Field) | - | d6 | 5 | 5 = Big Red Barn (unused) |
| 89 | R8 | Big Tom | Prank Unplug the oven (FH), Puff 2->3, Wing from Hazel | 5+ | white | 2 6 3 | Great (6): both boxes, Unplug the oven happens, clock 2->0: TOO LATE, flock wins at once |
| 90 | R8 | Big Tom | Prank oven | gobble on 6 | red (urge 3) | 6 2 5 | red 6 rolled, but the result comes first and the game is already over |
| 91 | R8 | Hazel | Helper die, Wing on Big Tom's oven prank | 6=Hazel gobbles | helper | 3 | no gobble |
| 92 | Game end | Storyteller | What's for dinner instead | - | d6 | 5 | 5: Breakfast for dinner, a tower of pancakes |
| 93 | D1 | Storyteller | Grab tie-break, Gizmo u3 vs Noodle u3 both Spotted in BRB (odd=Gizmo, even=Noodle) | - | d6 | 6 | 6 = even: Noodle grabbed, game over (flock loses) |
| 94 | D1 | grabbed turkey | Famous last gobbles | - | d6 | 2 | 2: I regret NOTHING. Except the gobbling. |
| 95 | D2 | Storyteller | Farm event (decoy clock -2: 13->11, passed 12) | - | d6 | 1 | 1: Truck backfires; part of the decoy grab (farmer's turn): every turkey +1 incl. Spotted Noodle 1->2 |
| 96 | D2 end | Pip | Hiccups (Pip in Pigsty, farmer in Farmhouse) | 6=gobble | red | 3 | no hiccup |
| 97 | D2 next round | Noodle | Scram, still Spotted in BRB, farmer in Farmhouse; Quick Feet | 5+ (Hard) | white | 4 6 | Great (6 >= 5): Scram works; ruling: Quick Feet 2 zones + Great 1 more = 3 zones, BRB->Hilltop->Sheep Meadow->Windmill, Grain sacks; Show-off token on Grain sacks |
| 98 | D2 next round | Noodle | Scram | gobble on 6 | red (urge 1) | 6 | red 6: gobble (farmer not in WM): Noodle 2->0, token on Grain sacks. Label said urge 1; Noodle was at 2 after the backfire, so 1 red die was missing (rolled next) |
| 99 | D2 next round | Noodle | Scram, missing 2nd red die (urge 2) | gobble on 6 | red | 3 | 3: no extra effect (already a gobble) |
| 100 | D2 next farmer turn | Noodle | Stay hidden, farmer follows tokens FH->AO->WM, checks Grain sacks; Puff 0->1 | 3+ | white | 5 1 | stays hidden (5); then Close Call 1->2 |
| 101 | D2 next farmer turn | Noodle | Stay hidden | gobble on 6 | red (urge 1) | 1 | no gobble |
| 102 | D3 | Pip | Prank truck tires last box (DW), Puff 1->2; Gizmo Spotted in PS with farmer, clock 2 | 4+ | white | 1 2 | fails |
| 103 | D3 | Pip | Prank tires | gobble on 6 | red (urge 2) | 5 5 | no gobble |
| 104 | D3 | Noodle | Prank Shake the apple trees (AO), Puff 1->2; Gizmo still Spotted, clock 2 | 3+ | white | 2 4 | works: Shake the apple trees happens, clock 2->0: TOO LATE, flock wins at once with Gizmo Spotted |
| 105 | D3 | Noodle | Prank apples | gobble on 6 | red (urge 2) | 1 1 | no gobble (irrelevant) |
| 106 | D4 | Dog | Dog die at Farmhouse (Big Tom Spotted in TP, Pip in AO) | - | d6 | 6 | route: Farmhouse 6 -> Apple Orchard |
| 107 | D4 | Kid | Kid route from Farmhouse | - | d6 | 6 | kid: Farmhouse 6 -> Apple Orchard |
| 108 | D4 | Pip | Stay hidden from dog (AO Leaf pile) | 4+ | white | 3 | fails: bark, token on AO Leaf pile; dog Close Call Pip 2->3 |
| 109 | D4 | Pip | Stay hidden from dog | gobble on 6 | red (urge 2) | 2 4 | no gobble |
| 110 | D4 | Kid | Kid search line Apple Orchard | - | d6 | 6 | Cider barrels: empty |
| 111 | D4 end | Pip | Hiccups | 6=gobble | red | 5 | no hiccup |
| 112 | D4 next round | Big Tom | Scram from TP (Spotted after full-urge gobble), Puff 0->1 | 5+ (Hard) | white | 4 3 | fails: Big Tom still Spotted |
| 113 | D4 next round | Big Tom | Scram | gobble on 6 | red (urge 1) | 5 | no gobble |
| 114 | D4 next round | Gizmo | Gobble for a Friend (Big Tom) from VG, next door | 4+ | white | 1 | fails: Gizmo urge->0, token on his VG spot; Big Tom stays Spotted, can't be helped again this round -> grabbed next farmer's turn |
| 115 | D4 end | Big Tom | Famous last gobbles | - | d6 | 2 | 2: I regret NOTHING. Except the gobbling. |
| 116 | D6 | Gizmo | Prank Let the pigs loose (PS, detour), rake pending, Wing from Noodle | 4+ | white | 5 1 | works: Let the pigs loose happens, clock 14->11 (passes 12); Gizmo Chatterbox 1->2 |
| 117 | D6 | Gizmo | Prank pigs | gobble on 6 | red (urge 1) | 1 | no gobble |
| 118 | D6 | Noodle | Helper die, Wing on Gizmo's prank | 6=Noodle gobbles | helper | 4 | no gobble |
| 119 | D6 | Storyteller | Farm event (clock 14->11, passed 12) | - | d6 | 1 | 1: Truck backfires; part of Gizmo's action; Gizmo already rose once this action (Chatterbox) so no second rise; others +1 |
| 120 | D6 farmer | Dog | Dog die (dog in Vegetable Garden) | - | d6 | 4 | route: VG 4 -> Driveway; nobody there |
| 121 | D6 farmer | Kid | Kid route (kid in Turkey Pen) | - | d6 | 5 | kid: TP 5 -> Stone Wall; nobody there |
| 122 | D12 (Puddlewick) attempt 1 | Noodle | Sneak Turkey Pen->Hen House (full; farmer next door on Footbridge) | 4+ | white | 6 | Great: works, but Hen House full -> in the open; Show-off token (ruling: on the zone, he has no spot); no extra zone (leaving a zone next to the farmer needs a roll) |
| 123 | D12 attempt 1 | Noodle | Sneak | gobble on 6 | red (urge 2) | 3 6 | red 6: gobble, Noodle 2->0, token on Hen House zone. Not the failure the drill needs -> attempt 2 |
| 124 | D12 attempt 2 | Noodle | Sneak Turkey Pen->Hen House (full; farmer on Footbridge) | 4+ | white | 5 | works: in the open (full), no token; not the failure -> attempt 3 |
| 125 | D12 attempt 2 | Noodle | Sneak | gobble on 6 | red (urge 2) | 3 1 | no gobble |
| 126 | D12 attempt 3 | Noodle | Sneak Turkey Pen->Hen House (full; farmer on Footbridge) | 4+ | white | 6 | Great again: works, in the open; Show-off token on zone |
| 127 | D12 attempt 3 | Noodle | Sneak | gobble on 6 | red (urge 2) | 6 1 | gobble; not the failure -> attempt 4 |
| 128 | D12 attempt 4 | Noodle | Sneak Turkey Pen->Hen House (full; farmer on Footbridge) | 4+ | white | 3 | FAILS: Noodle still enters, every spot full -> in the open; farmer not in Hen House -> Huh? token on the Hen House zone |
| 129 | D12 attempt 4 | Noodle | Sneak | gobble on 6 | red (urge 2) | 5 2 | no gobble |
| 130 | D12 farmer | Farmer | Search line Hen House (token on zone; Noodle in the open is Spotted) | - | d6 | 4 | 4: Roost (3+) checked |
| 131 | D12 farmer | Hazel | Stay hidden Roost, Wing from Big Tom | 3+ | white | 2 6 | Hazel stays hidden (white 6: a Great, no extra effect on a hide roll) |
| 132 | D12 farmer | Hazel | Stay hidden | gobble on 6 | red (urge 1) | 2 | no gobble |
| 133 | D12 farmer | Big Tom | Helper die, Wing on Hazel | 6=Big Tom gobbles | helper | 2 | no gobble |
| 134 | D12 farmer | Big Tom | Stay hidden Roost, Wing from Hazel | 3+ | white | 2 4 | Big Tom stays hidden |
| 135 | D12 farmer | Big Tom | Stay hidden | gobble on 6 | red (urge 2) | 1 1 | no gobble |
| 136 | D12 farmer | Hazel | Helper die, Wing on Big Tom | 6=Hazel gobbles | helper | 4 | no gobble. Noodle Spotted; tokens removed; Close Calls: Keen Eye protects Pip, Gizmo, Big Tom; Hazel +1 |
| 137 | D7 (Puddlewick) | Dog | Dog die in Hen House (turkeys on Footbridge next door) | - | d6 | 1 | nose: nearest turkeys on the Footbridge -> dog to Footbridge |
| 138 | D7 | Pip | Stay hidden from dog (Under the bridge), Wing from Noodle | 4+ | white | 5 2 | Pip stays hidden |
| 139 | D7 | Pip | Stay hidden | gobble on 6 | red (urge 2) | 1 2 | no gobble |
| 140 | D7 | Noodle | Helper die, Wing on Pip | 6=Noodle gobbles | helper | 4 | no gobble |
| 141 | D7 | Gizmo | Stay hidden from dog (Under the bridge), Wing from Pip | 4+ | white | 1 3 | Gizmo fails: bark, token on Under the bridge |
| 142 | D7 | Gizmo | Stay hidden | gobble on 6 | red (urge 1) | 5 | no gobble |
| 143 | D7 | Pip | Helper die, Wing on Gizmo | 6=Pip gobbles | helper | 1 | no gobble |
| 144 | D7 | Noodle | Stay hidden from dog (IN THE OPEN), Wing from Gizmo | 4+ | white | 1 4 | Noodle passes (4) although in the open |
| 145 | D7 | Noodle | Stay hidden | gobble on 6 | red (urge 3) | 3 3 6 | red 6: Noodle gobbles 3->0, token on Footbridge zone (in the open). Close Calls: Pip 2->3, Gizmo 1->2 (Chatterbox + Close Call capped at once per farmer's turn), Noodle 0->1 |
| 146 | D7 | Gizmo | Helper die, Wing on Noodle | 6=Gizmo gobbles | helper | 1 | no gobble |
| 147 | D8 (Puddlewick) attempt 1 | Kid | Kid route from Greenhouse (1-3 Footbridge) | - | d6 | 2 | 2: kid to Footbridge; Noodle in the open -> DAD! TURKEY! token on the zone |
| 148 | D8 | Kid | Kid search line Footbridge (1-6 Under the bridge) | - | d6 | 1 | Under the bridge (only result) |
| 149 | D8 | Pip | Kid peek Under the bridge, no Wing left, no Puff | 4+ | white | 2 | Pip fails the kid's peek |
| 150 | D8 | Pip | Kid peek | gobble on 6 | red (urge 3) | 1 1 3 | no gobble |
| 151 | D8 | Gizmo | Kid peek Under the bridge, no Wing left, no Puff | 4+ | white | 3 | Gizmo fails the kid's peek -> one Huh? token on Under the bridge |
| 152 | D8 | Gizmo | Kid peek | gobble on 6 | red (urge 2) | 2 5 | no gobble |
| 153 | D9 | Gizmo | Gobble for a Friend (Pip) from INSIDE farmer's zone BRB, Wing from Noodle | 4+ | white | 6 2 | Great: Pip no longer Spotted; Gizmo gets no token and is not Spotted; Gizmo urge 0, Chatterbox -> 1 |
| 154 | D9 | Noodle | Helper die, Wing on Gizmo's GfaF | 6=Noodle gobbles | helper | 6 | helper 6: Noodle gobbles from his own spot in the farmer's zone -> Noodle SPOTTED, urge 0 |
| 155 | D9 | Big Tom | Gobble for a Friend (Noodle) from SW next door, Big Gobble | 4+ | white | 2 5 | works: Noodle no longer Spotted; Big Tom urge 0, token on his SW Behind the wall spot (farmer not in SW) |
| 156 | D9 attempt 2 | Gizmo | Gobble for a Friend (Pip) from INSIDE farmer's zone BRB, no Wing | 4+ | white | 4 | works: Pip no longer Spotted; farmer in Gizmo's zone -> Gizmo SPOTTED (urge 0) |
| 157 | D9 attempt 2 | Big Tom | Gobble for a Friend (Gizmo, the rescuer) from SW, Big Gobble | 4+ | white | 1 2 | fails: Gizmo stays Spotted, cannot be helped again this round and has used his action -> grabbed next farmer's turn; Big Tom urge 0, token on SW spot |
| 158 | D10a | Pip | Sneak x2 FH->TP (no roll needed)->SW (next to farmer in BRB), Soft Steps | 4+ | white | 5 3 | works: Pip ends in SW Behind the wall |
| 159 | D10a | Pip | Sneak x2 | gobble on 6 | red (urge 2) | 5 6 | red 6: gobble, Pip 2->0, token on SW Behind the wall (farmer not in SW) |
| 160 | D10b | Pip | Sneak x2 SW->BRB (farmer's zone)->Pigsty, Soft Steps | 4+ | white | 2 2 | fails: Pip still ends in Pigsty; farmer not in the end zone -> token on PS In the pig mud, NOT Spotted though he passed through the farmer's zone |
| 161 | D10b | Pip | Sneak x2 through farmer | gobble on 6 | red (urge 2) | 4 1 | no gobble |
| 162 | D10c attempt 1 | Noodle | Scram (Spotted in BRB), Quick Feet, no Puff | 5+ (Hard) | white | 6 6 | Great (6,6): works; ruling 2 (Quick Feet) + 1 (Great) = 3 zones BRB->HT->SM->WM, Grain sacks; Show-off token on Grain sacks. Want a plain success -> attempt 2 |
| 163 | D10c attempt 1 | Noodle | Scram | gobble on 6 | red (urge 2) | 4 4 | no gobble |
| 164 | D10c attempt 2 | Noodle | Scram (Spotted in BRB), Quick Feet, no Puff | 5+ (Hard) | white | 2 5 | works (5), not a Great: two zones BRB->Hilltop->Pumpkin Field, hides in Pumpkin pile, no longer Spotted |
| 165 | D10c attempt 2 | Noodle | Scram | gobble on 6 | red (urge 2) | 3 1 | no gobble |
| 166 | D11a attempt 1 | Pip | Hiccups at end of round, farmer in Pip's zone (TP), 1 Feather | 6=gobble | red | 5 | no hiccup |
| 167 | D11a attempt 2 | Pip | Hiccups at end of round, farmer in Pip's zone (TP), 1 Feather | 6=gobble | red | 5 | no hiccup |
| 168 | D11a attempt 3 | Pip | Hiccups at end of round, farmer in Pip's zone (TP), 1 Feather | 6=gobble | red | 1 | no hiccup |
| 169 | D11a attempt 4 | Pip | Hiccups at end of round, farmer in Pip's zone (TP), 1 Feather | 6=gobble | red | 5 | no hiccup |
| 170 | D11a attempt 5 | Pip | Hiccups at end of round, farmer in Pip's zone (TP), 1 Feather | 6=gobble | red | 6 | HIC: flock spends its Feather (1->0): cancelled, no gobble, no token, urge unchanged |
| 171 | D11a attempt 6 | Pip | Hiccups at end of round, farmer in Pip's zone (TP), 1 Feather | 6=gobble | red | 6 | fresh reset, HIC again: flock declines the Feather; Pip gobbles with the farmer in TP -> SPOTTED at the end of the round, urge 0 |
| 172 | D11a attempt 6 next round | Pip | Scram from TP (Spotted by hiccup), Puff 0->1 | 5+ (Hard) | white | 1 6 | Great: works; runs TP->VG then one more zone ->BRB, Hayloft; no longer Spotted |
| 173 | D11a attempt 6 next round | Pip | Scram | gobble on 6 | red (urge 1) | 5 | no gobble |
| 174 | D11b attempt 1 | Noodle | Stay hidden, farmer checks BRB Hayloft; Puff 2->3, Wing from Gizmo | 3+ | white | 1 4 2 | stays hidden (4), no Great -> attempt 2 |
| 175 | D11b attempt 1 | Noodle | Stay hidden | gobble on 6 | red (urge 3) | 3 1 4 | no gobble |
| 176 | D11b attempt 1 | Gizmo | Helper die, Wing on Noodle | 6=Gizmo gobbles | helper | 3 | no gobble |
| 177 | D11b attempt 2 | Noodle | Stay hidden, farmer checks BRB Hayloft; Puff 2->3, Wing from Gizmo | 3+ | white | 5 5 4 | stays hidden, no Great -> attempt 3 |
| 178 | D11b attempt 2 | Noodle | Stay hidden | gobble on 6 | red (urge 3) | 2 2 5 | no gobble |
| 179 | D11b attempt 2 | Gizmo | Helper die, Wing on Noodle | 6=Gizmo gobbles | helper | 5 | no gobble |
| 180 | D11b attempt 3 | Noodle | Stay hidden, farmer checks BRB Hayloft; Puff 2->3, Wing from Gizmo | 3+ | white | 4 6 5 | GREAT (6): stays hidden; Show-off -> Huh? token on Hayloft with the farmer right there; not Spotted; token removed at end of the search step |
| 181 | D11b attempt 3 | Noodle | Stay hidden | gobble on 6 | red (urge 3) | 1 1 3 | no gobble |
| 182 | D11b attempt 3 | Gizmo | Helper die, Wing on Noodle | 6=Gizmo gobbles | helper | 5 | no gobble |
| 183 | D11b attempt 3 | Gizmo | Stay hidden, same Hayloft check (urge 1; no Wing available) | 3+ | white | 2 | Gizmo fails -> Spotted (side result) |
| 184 | D11b attempt 3 | Gizmo | Stay hidden | gobble on 6 | red (urge 1) | 4 | no gobble; Chatterbox +1 after the roll (lent a Wing) |
