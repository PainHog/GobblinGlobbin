/**
 * DON'T GET GOBBLE GOBBLED — System Configuration
 * ---------------------------------------
 * Static, version-agnostic game data lives here (dice, tracks, turkeys, farms,
 * tables …) so the pure rules logic, the simulator (`sim/`), the map generator
 * and a future Foundry system can all share it without importing any Foundry
 * API. Pure data only: no `game`, `ui`, `foundry` or DOM.
 *
 * The rulebook (book/src/chapters/) is the source of truth — this file follows
 * the book, never the other way round. `test/book-data.test.mjs` checks the
 * farm, turkey and adjustment tables printed in the book against this file.
 */

export const GG = {};

/** The system id (must match system.json "id" and contracts.mjs SYSTEM_ID). */
GG.id = "gobble-gobbled";

/* ------------------------------------------------------------- the roll -- */
// Ch 3 "The Roll". White dice: the action. Red dice: one per point of urge.
GG.roll = {
  maxWhite: 3,          // one white die, plus at most two boosts (push, help, knack)
  gobbleFace: 6,        // any red 6 is a gobble (only one gobble per roll)
  greatFace: 6,         // a white 6 is a Great result
  targets: { sneak: 4, noisy: 3, hunker: 4, rescue: 4, scram: 4, sniff: 4 },
  sneakRange: 1,         // a Sneak needs a roll when the farmer is in or next to the zone you leave or enter
  rescuesPerTurkey: 1    // Gobble for a Friend: one try per Spotted turkey per round
};

/* ------------------------------------------------------------- the urge -- */
// Ch 4 "The Gobble". 0–5; a rise past 5 is a gobble instead; a gobble resets it to 0.
// closeRange: a close call when the farmer ends within this many zones; tick: every round, every turkey +1.
GG.urge = { min: 0, max: 5, start: 1, hunker: 2, hunkerCoolHead: 3, closeRange: 0, tick: 1 };

/* --------------------------------------------------------------- knacks -- */
GG.knacks = {
  busyBeak:   { name: "Busy Beak",        text: "+1 white die when you pull a Prank, and when the roll works it ticks two boxes." },
  softSteps:  { name: "Soft Steps",       text: "+1 white die when you Sneak, and one Sneak can take you two zones (one roll covers both)." },
  still:      { name: "Still as a Stump", text: "+1 white die when the farmer, the dog or the kid checks your spot, and your red dice don’t count on those rolls." },
  bigGobble:  { name: "Big Gobble",       text: "+1 white die when you Gobble for a Friend, and you can do it from two zones away (two paths)." },
  quickFeet:  { name: "Quick Feet",       text: "+1 white die when you Scram, and a Scram that works can take you two zones (three on a Great)." },
  coolHead:   { name: "Cool Head",        text: "Hunker Down lowers your urge, or a friend’s, by 3 instead of 2." },
  motherHen:  { name: "Mother Hen",       text: "When you Hunker Down, every other turkey in your zone lowers its urge by 1 too." },
  keenEye:    { name: "Keen Eye",         text: "From round 2, at the start of the turkeys’ turn, the Storyteller rolls the farmer’s route die and tells the flock where he’ll walk if nothing else (a detour, a rake or a “Huh?” token) decides it. If he’s moved first, read the roll on his new zone’s route line. Close Calls don’t raise the urge of turkeys in your zone." }
};

/* --------------------------------------------------------------- quirks -- */
// Each is a nervous habit. A turkey's urge rises at most once per action and at
// most once per farmer's turn (Ch 4 "One thing, one rise").
GG.quirks = {
  worrywart:  { name: "Worrywart",  text: "+1 urge whenever another turkey is Spotted." },
  hiccups:    { name: "Hiccups",    text: "At the end of every round, roll one red die: on a 6 you gobble (hic!)." },
  fussy:      { name: "Fussy",      text: "+1 urge whenever you end an action sharing a hiding spot, or another turkey squeezes into yours." },
  restless:   { name: "Restless",   text: "You can’t Hunker Down two rounds in a row." },
  showOff:    { name: "Show-off",   text: "Whenever you roll a Great, you strike a pose: a “Huh?” token goes on your spot (or your zone, if you’re in the open). A pose struck while the farmer searches stays down after he clears his tokens, so he’ll be back." },
  jumpy:      { name: "Jumpy",      text: "+1 urge whenever another turkey gobbles." },
  chatterbox: { name: "Chatterbox", text: "+1 urge after any roll where you Lend a Wing, or a friend Lends you one." },
  scaredy:    { name: "Scaredy",    text: "A Close Call happens to you when the farmer or the dog ends in your zone or next to it." }
};

/* -------------------------------------------------------------- turkeys -- */
GG.turkeys = [
  { id: "butterbean", name: "Butterbean", breed: "Bourbon Red",   bird: "hen",  knack: "busyBeak",  quirk: "chatterbox" },
  { id: "pip",        name: "Pip",        breed: "Narragansett",  bird: "jake", knack: "softSteps", quirk: "hiccups" },
  { id: "duchess",    name: "Duchess",    breed: "Royal Palm",    bird: "hen",  knack: "still",     quirk: "showOff" },
  { id: "bigtom",     name: "Big Tom",    breed: "Bronze",        bird: "tom",  knack: "bigGobble", quirk: "scaredy" },
  { id: "noodle",     name: "Noodle",     breed: "White Holland", bird: "jake", knack: "quickFeet", quirk: "restless" },
  { id: "clementine", name: "Clementine", breed: "Blue Slate",    bird: "hen",  knack: "coolHead",  quirk: "fussy" },
  { id: "gizmo",      name: "Gizmo",      breed: "Black Spanish", bird: "tom",  knack: "motherHen", quirk: "worrywart" },
  { id: "hazel",      name: "Hazel",      breed: "Chocolate",     bird: "hen",  knack: "keenEye",   quirk: "jumpy" }
];

/* ---------------------------------------------------------------- farms -- */
// Zone tags: open (no hiding spots), noisy (sneaking in needs a roll). search: the d6 line for which spot the
// farmer checks (index into spots). route: the d6 line for where he walks next.
// Every farm has a Farmhouse (events send the farmer there) and a prank in at least six zones.
const z = (name, tags, spots, search, route, pos) => ({ name, tags, spots, search, route, pos });
const s = (name, cover, room) => ({ name, cover, room });

GG.farms = {
  bramble: {
    id: "bramble", name: "Bramble Farm", farmer: "Farmer Bramble", dog: "Biscuit", clock: 0,
    start: { turkeys: "pen", farmer: "house", dog: "house" },
    zones: {
      orchard: z("Apple Orchard",   [],         [s("Leaf pile", 3, 3), s("Apple trees", 4, 3), s("Fallen log", 4, 2)],      [0,0,0,1,1,2], ["garden","garden","garden","pumpkin","pumpkin","pumpkin"], [0,0]),
      pumpkin: z("Pumpkin Patch",   [],         [s("Big pumpkins", 3, 3), s("Hay wagon", 4, 3)],                             [0,0,0,1,1,1], ["orchard","orchard","yard","yard","corn","corn"], [1,0]),
      corn:    z("Cornfield",       [],         [s("Corn rows", 3, 6), s("Corn crib", 4, 2)],                                [0,0,0,0,1,1], ["pumpkin","pumpkin","barn","barn","pasture","pasture"], [2,0]),
      pasture: z("Cow Pasture",     [],          [s("Behind the cows", 4, 4), s("Water trough", 4, 2), s("Hay rack", 3, 2)], [0,0,0,1,1,2], ["corn","corn","corn","corn","corn","corn"], [3,0]),
      garden:  z("Vegetable Garden",[],         [s("Cabbage rows", 3, 3), s("Compost heap", 4, 2), s("Scarecrow", 5, 1)],    [0,0,0,1,1,2], ["house","house","yard","yard","orchard","orchard"], [0,1]),
      yard:    z("Barnyard",        ["open"],   [],                                                                          [],            ["pen","pen","barn","barn","garden","pumpkin"], [1,1]),
      barn:    z("Big Barn",        [],               [s("Hayloft", 3, 4), s("Old tractor", 4, 2), s("Feed bins", 4, 2)],          [0,0,0,1,1,2], ["yard","yard","coop","corn","corn","pond"], [2,1]),
      pond:    z("Duck Pond",       ["noisy"],[s("Reeds", 3, 4), s("Upturned boat", 4, 2), s("Under the dock", 5, 2)],    [0,0,0,1,1,2], ["barn","barn","barn","shed","shed","shed"], [3,1]),
      house:   z("Farmhouse",       [],               [s("Porch steps", 5, 2), s("Woodpile", 4, 2), s("Under the truck", 4, 2)],   [0,0,1,1,2,2], ["pen","pen","pen","garden","garden","garden"], [0,2]),
      pen:     z("Turkey Pen",      [],               [s("Turkey house", 4, 8), s("Feed trough", 4, 2)],                           [0,0,0,0,1,1], ["house","house","yard","yard","coop","coop"], [1,2]),
      coop:    z("Chicken Coop",    ["noisy"],        [s("Nesting boxes", 4, 2), s("Behind the coop", 3, 2)],                      [0,0,0,1,1,1], ["pen","pen","barn","barn","shed","shed"], [2,2]),
      shed:    z("Tractor Shed",    [],               [s("Under the tarp", 4, 3), s("Hay bales", 3, 2)],                           [0,0,0,0,1,1], ["coop","coop","coop","pond","pond","pond"], [3,2])
    },
    links: [["orchard","pumpkin"],["pumpkin","corn"],["corn","pasture"],
            ["garden","yard"],["yard","barn"],["barn","pond"],
            ["house","pen"],["pen","coop"],["coop","shed"],
            ["orchard","garden"],["pumpkin","yard"],["corn","barn"],
            ["garden","house"],["yard","pen"],["barn","coop"],["pond","shed"]],
    // Ch 6 "Pranks": each works once. clock: how far the Dinner Clock jumps;
    // loud: a Heard marker goes on the zone; detour: on his next turn the farmer goes
    // straight there and searches nothing; decoy: the next grab grabs the decoy instead.
    pranks: [
      { id: "oven",     zone: "house",   name: "Turn off the oven",          target: 5, need: 2, clock: 3 },
      { id: "cows",     zone: "pasture", name: "Let the cows out",           target: 4, need: 1, clock: 3, detour: "pasture" },
      { id: "rooster",  zone: "coop",    name: "Wake the rooster",           target: 3, need: 1, clock: 2, loud: true },
      { id: "scarecrow",zone: "garden",  name: "Dress the scarecrow as a turkey", target: 5, need: 2, clock: 1, decoy: true },
      { id: "pails",    zone: "barn",    name: "Tip over the milk pails",    target: 4, need: 1, clock: 3, loud: true },
      { id: "tires",    zone: "shed",    name: "Let down the tractor tires", target: 4, need: 2, clock: 2 },
      { id: "boat",     zone: "pond",    name: "Untie the rowboat",          target: 4, need: 1, clock: 2, detour: "pond" },
      { id: "pumpkin",  zone: "pumpkin", name: "Roll the giant pumpkin",     target: 4, need: 1, clock: 3, loud: true }
    ]
  },

  puddlewick: {
    id: "puddlewick", name: "Puddlewick Farm", farmer: "Farmer Puddlewick", dog: "Pickles", clock: 1,
    creek: 0,   // the map draws a creek below this grid row (flavour: the paths say where you can cross)
    start: { turkeys: "pen", farmer: "house", dog: "house" },
    zones: {
      pond:       z("Duck Pond",     ["noisy"], [s("Reeds", 3, 4), s("Duck house", 4, 2), s("Under the jetty", 5, 2)],          [0,0,0,1,1,2], ["willow","willow","willow","goat","goat","goat"], [0,0]),
      willow:     z("Willow Trees",  [],                [s("Willow curtain", 4, 4), s("Hollow stump", 4, 2)],                            [0,0,0,0,1,1], ["pond","pond","mill","mill","mill","mill"], [1,0]),
      mill:       z("Water Mill",    [],         [s("Flour sacks", 3, 3), s("Behind the wheel", 4, 2), s("Millstone", 5, 1)], [0,0,0,1,1,2], ["willow","willow","berry","berry","bridge","bridge"], [2,0]),
      berry:      z("Berry Patch",   [],          [s("Bramble thicket", 4, 4), s("Berry baskets", 4, 2), s("Old cart", 5, 2)],    [0,0,0,1,1,2], ["mill","mill","mill","mill","mill","mill"], [3,0]),
      goat:       z("Goat Pen",      ["noisy"],   [s("Goat shed", 4, 3), s("Hay feeder", 3, 2), s("Behind Gertie", 4, 2)],    [0,0,1,1,2,2], ["lane","lane","pond","pond","house","house"], [0,1]),
      lane:       z("Muddy Lane",    ["open"],    [],                                                                              [],            ["goat","goat","bridge","bridge","pen","pen"], [1,1]),
      bridge:     z("Footbridge",    [],         [s("Under the bridge", 4, 3)],                                                   [0,0,0,0,0,0], ["lane","lane","greenhouse","mill","mill","hen"], [2,1]),
      greenhouse: z("Greenhouse",    [],          [s("Tomato vines", 3, 3), s("Potting bench", 4, 2), s("Flowerpots", 4, 2)],     [0,0,0,1,1,2], ["bridge","bridge","bridge","barn","barn","barn"], [3,1]),
      house:      z("Farmhouse",     [],                [s("Porch swing", 5, 1), s("Boot rack", 4, 2), s("Laundry basket", 4, 2)],      [0,0,1,1,2,2], ["pen","pen","pen","goat","goat","goat"], [0,2]),
      pen:        z("Turkey Pen",    [],                [s("Turkey house", 4, 8), s("Water trough", 4, 2)],                              [0,0,0,0,1,1], ["house","house","hen","hen","lane","lane"], [1,2]),
      hen:        z("Hen House",     ["noisy"],         [s("Nesting boxes", 4, 2), s("Roost", 3, 2)],                                    [0,0,0,1,1,1], ["pen","pen","barn","barn","bridge","bridge"], [2,2]),
      barn:       z("Hay Barn",      [],                [s("Hay stacks", 4, 4), s("Loft", 4, 2), s("Hay wagon", 5, 2)],                 [0,0,0,1,1,2], ["hen","hen","hen","greenhouse","greenhouse","greenhouse"], [3,2])
    },
    links: [["pond","willow"],["willow","mill"],["mill","berry"],
            ["goat","lane"],["lane","bridge"],["bridge","greenhouse"],
            ["house","pen"],["pen","hen"],["hen","barn"],
            ["pond","goat"],["mill","bridge"],
            ["goat","house"],["lane","pen"],["bridge","hen"],["greenhouse","barn"]],
    pranks: [
      { id: "pan",       zone: "house",      name: "Hide the roasting pan",      target: 5, need: 2, clock: 3 },
      { id: "goats",     zone: "goat",       name: "Let the goats loose",        target: 4, need: 1, clock: 3, detour: "goat" },
      { id: "henparty",  zone: "hen",        name: "Start a hen party",          target: 3, need: 1, clock: 2, loud: true },
      { id: "sprinklers",zone: "greenhouse", name: "Turn on the sprinklers",     target: 4, need: 1, clock: 2, detour: "greenhouse" },
      { id: "wheel",     zone: "mill",       name: "Jam the water wheel",        target: 4, need: 2, clock: 2 },
      { id: "berries",   zone: "berry",      name: "Gobble up the pie berries",  target: 3, need: 2, clock: 2 },
      { id: "choir",     zone: "pond",       name: "Start the duck choir",       target: 3, need: 1, clock: 3, loud: true },
      { id: "haybale",   zone: "barn",       name: "Dress a hay bale as a turkey", target: 5, need: 2, clock: 1, decoy: true }
    ]
  },

  windy: {
    id: "windy", name: "Windy Ridge Farm", farmer: "Farmer Windle", dog: "Moose", clock: 1,
    start: { turkeys: "pen", farmer: "house", dog: "house" },
    zones: {
      windmill: z("Windmill",         [],               [s("In the windmill", 4, 3), s("Grain sacks", 3, 2)],                       [0,0,0,0,1,1], ["meadow","meadow","meadow","orchard","orchard","orchard"], [0,0]),
      meadow:   z("Sheep Meadow",     ["noisy"],        [s("Among the sheep", 3, 6)],                                                [0,0,0,0,0,0], ["windmill","windmill","hilltop","hilltop","wall","wall"], [1,0]),
      hilltop:  z("Hilltop",          ["open"],         [],                                                                             [],            ["meadow","meadow","pumpkin","pumpkin","barn","barn"], [2,0]),
      pumpkin:  z("Pumpkin Field",    [],         [s("Pumpkin pile", 3, 4), s("Wheelbarrow", 4, 2), s("Scarecrow", 5, 1)],       [0,0,0,1,1,2], ["hilltop","hilltop","hilltop","pigsty","pigsty","pigsty"], [3,0]),
      orchard:  z("Apple Orchard",    [],         [s("Leaf pile", 3, 3), s("Apple ladder", 4, 2), s("Cider barrels", 4, 2)],     [0,0,0,1,1,2], ["wall","wall","windmill","windmill","house","house"], [0,1]),
      wall:     z("Stone Wall",       [],               [s("Behind the wall", 3, 4), s("Woodpile", 4, 2)],                             [0,0,0,0,1,1], ["orchard","barn","barn","meadow","pen","pen"], [1,1]),
      barn:     z("Big Red Barn",     [],               [s("Hayloft", 3, 4), s("Tractor", 4, 2), s("Feed sacks", 4, 2)],               [0,0,0,1,1,2], ["wall","wall","pigsty","hilltop","garden","garden"], [2,1]),
      pigsty:   z("Pigsty",           ["noisy"],  [s("In the pig mud", 4, 4), s("Pig trough", 4, 2)],                  [0,0,0,0,1,1], ["barn","barn","pumpkin","pumpkin","drive","drive"], [3,1]),
      house:    z("Farmhouse",        [],               [s("Porch", 5, 2), s("Garage", 4, 3)],                                         [0,0,1,1,1,1], ["pen","pen","pen","orchard","orchard","orchard"], [0,2]),
      pen:      z("Turkey Pen",       [],               [s("Turkey house", 4, 8), s("Trough", 4, 2)],                                  [0,0,0,0,1,1], ["house","house","garden","garden","wall","wall"], [1,2]),
      garden:   z("Vegetable Garden", [],         [s("Cabbage rows", 3, 3), s("Bean poles", 4, 2)],                              [0,0,0,1,1,1], ["pen","pen","drive","drive","barn","barn"], [2,2]),
      drive:    z("Driveway",         ["open"],         [],                                                                             [],            ["garden","garden","garden","pigsty","pigsty","pigsty"], [3,2])
    },
    links: [["windmill","meadow"],["meadow","hilltop"],["hilltop","pumpkin"],
            ["orchard","wall"],["wall","barn"],["barn","pigsty"],
            ["house","pen"],["pen","garden"],["garden","drive"],
            ["windmill","orchard"],["meadow","wall"],["hilltop","barn"],["pumpkin","pigsty"],
            ["orchard","house"],["wall","pen"],["barn","garden"],["pigsty","drive"]],
    pranks: [
      { id: "plug",     zone: "house",    name: "Unplug the oven",               target: 5, need: 2, clock: 3 },
      { id: "hat",      zone: "windmill", name: "Send his hat up the windmill",  target: 4, need: 1, clock: 2, detour: "windmill" },
      { id: "sheep",    zone: "meadow",   name: "Stampede the sheep",            target: 4, need: 1, clock: 3, loud: true },
      { id: "carve",    zone: "pumpkin",  name: "Carve a pumpkin turkey",        target: 5, need: 2, clock: 1, decoy: true },
      { id: "keys",     zone: "barn",     name: "Hide the tractor keys",         target: 4, need: 2, clock: 2 },
      { id: "pigs",     zone: "pigsty",   name: "Let the pigs loose",            target: 4, need: 1, clock: 3, detour: "pigsty" },
      { id: "truck",    zone: "drive",    name: "Let down the truck tires",      target: 4, need: 2, clock: 2 },
      { id: "apples",   zone: "orchard",  name: "Shake the apple trees",         target: 3, need: 1, clock: 2, loud: true }
    ]
  }
};

/* ------------------------------------------------- difficulty and size -- */
// Ch 8. Rounds on the clock = the farm's base + the difficulty's and the flock's adjustments.
GG.difficulty = {
  // nose: the dog follows its nose on a d6 roll of this or less; chase: zones the farmer
  // runs toward a Heard marker; quick: added to the Scram target.
  easy:     { name: "Easy",     dog: false, nose: 0, chase: 2, clock: -4, feathers: 1,  quick: 0 },
  standard: { name: "Standard", dog: true,  nose: 2, chase: 2, clock: 0,  feathers: 0,  quick: 0 },
  hard:     { name: "Hard",     dog: true,  nose: 3, chase: 3, clock: 2,  feathers: -1, quick: 1 }
};
// Ch 6 "The Dinner Clock": a countdown. It starts at 16 + 1 per turkey (plus the difficulty's
// adjustment), moves down one space every round, and pranks move it further. When it
// reaches 0 it's Too Late: the farmer gives up and the flock wins.
GG.clock = { base: 16, perTurkey: 1, decoyClock: 2, eventEvery: 4 };
// Ch 8 "Flock Size": the clock and the flock's Feathers by number of turkeys.
// Feathers: 2 for the flock. A small flock (2 or 3 turkeys) gets +1 Feather and the clock starts 2 lower.
// kids: a kid joins the search at each of these flock sizes.
GG.flock = { min: 2, max: 8, feathers: 2, smallFlock: 3, smallFeathers: 1, smallClock: -2, kids: [5] };

/* --------------------------------------------------------------- events -- */
// An event is rolled whenever the clock reaches a space that's a multiple of GG.clock.eventEvery (above 0).
GG.events = [
  { id: "backfire", name: "The truck backfires",   text: "BANG! Every turkey’s urge rises by 1." },
  { id: "phone",    name: "Grandma calls",          text: "The farmer goes straight to the Farmhouse to answer it. Move him there now." },
  { id: "kids",     name: "The whole family helps look", text: "On his next turn, the farmer checks every hiding spot in the zone he ends in." },
  { id: "rake",     name: "He steps on a rake",     text: "THWACK. On his next turn, the farmer doesn’t walk (he still searches his zone)." },
  { id: "gust",     name: "A cold gust",            text: "Every turkey fluffs up and huddles down: every turkey’s urge falls by 1." },
  { id: "oven",     name: "The oven is preheated",  text: "DING! On his next turn, if the farmer walks his route, he hurries: roll his route die twice and walk two zones." }
];
