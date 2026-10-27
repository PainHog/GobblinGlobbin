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
  sneakRange: 1          // a Sneak needs a roll when the farmer is in or next to the zone you leave or enter
};

/* ------------------------------------------------------------- the urge -- */
// Ch 4 "The Gobble". 0–5; a rise past 5 is a gobble instead; a gobble resets it to 0.
// closeRange: a close call when the farmer ends within this many zones; tick: every round, every turkey +1.
GG.urge = { min: 0, max: 5, start: 1, hunker: 2, hunkerCoolHead: 3, closeRange: 0, tick: 1 };

/* --------------------------------------------------------------- knacks -- */
GG.knacks = {
  busyBeak:   { name: "Busy Beak",       text: "+1 white die when you pull a Prank." },
  softSteps:  { name: "Soft Steps",      text: "+1 white die when you Sneak." },
  still:      { name: "Still as a Stump", text: "+1 white die when you roll to stay hidden (a search or a sniff)." },
  bigGobble:  { name: "Big Gobble",      text: "+1 white die when you Gobble for a Friend, and you can do it from two zones away." },
  quickFeet:  { name: "Quick Feet",      text: "+1 white die when you Scram, and a Scram that works can take you two zones." },
  coolHead:   { name: "Cool Head",       text: "Hunker Down lowers your urge, or a friend’s, by 3 instead of 2." },
  motherHen:  { name: "Mother Hen",      text: "You can help a turkey in your zone or a zone next to it." },
  keenEye:    { name: "Keen Eye",        text: "At the start of the turkeys’ turn, the Storyteller rolls the farmer’s route die now and tells the flock where he’s headed." }
};

/* --------------------------------------------------------------- quirks -- */
// Each is a +1 urge "nervous habit"; a turkey's urge rises at most once per action
// and at most once per farmer's turn (Ch 4 "One thing, one rise").
GG.quirks = {
  peckish:    { name: "Peckish",     text: "+1 urge when you move into a zone marked Food." },
  jumpy:      { name: "Jumpy",       text: "+1 urge when another turkey gobbles in your zone or a zone next to it." },
  fussy:      { name: "Fussy",       text: "+1 urge when you share a hiding spot with another turkey at the end of your action." },
  restless:   { name: "Restless",    text: "+1 urge when you Hunker Down (you still lower it first)." },
  muddyFeet:  { name: "Hates Mud",   text: "+1 urge when you move into a zone marked Mud." },
  wetFeathers:{ name: "Hates Water", text: "+1 urge when you move into a zone marked Water." },
  chatterbox: { name: "Chatterbox",  text: "+1 urge when you help another turkey." },
  scaredy:    { name: "Scaredy",     text: "+1 urge when the farmer ends his move in a zone next to yours." }
};

/* -------------------------------------------------------------- turkeys -- */
GG.turkeys = [
  { id: "butterbean", name: "Butterbean", breed: "Bourbon Red",   bird: "hen", knack: "busyBeak",  quirk: "peckish" },
  { id: "pip",        name: "Pip",        breed: "Narragansett",  bird: "jake", knack: "softSteps", quirk: "jumpy" },
  { id: "duchess",    name: "Duchess",    breed: "Royal Palm",    bird: "hen", knack: "still",     quirk: "fussy" },
  { id: "bigtom",     name: "Big Tom",    breed: "Bronze",        bird: "tom", knack: "bigGobble", quirk: "restless" },
  { id: "noodle",     name: "Noodle",     breed: "White Holland", bird: "jake", knack: "quickFeet", quirk: "muddyFeet" },
  { id: "clementine", name: "Clementine", breed: "Blue Slate",    bird: "hen", knack: "coolHead",  quirk: "wetFeathers" },
  { id: "gizmo",      name: "Gizmo",      breed: "Black Spanish", bird: "tom", knack: "motherHen", quirk: "chatterbox" },
  { id: "hazel",      name: "Hazel",      breed: "Chocolate",     bird: "hen", knack: "keenEye",   quirk: "scaredy" }
];

/* ---------------------------------------------------------------- farms -- */
// Zone tags: open (no hiding spots), noisy (sneaking in needs a roll),
// food, mud, water (quirk triggers). search: the d6 line for which spot the
// farmer checks (index into spots). route: the d6 line for where he walks next.
// Every farm has a Farmhouse (events send the farmer there), at least one zone
// of each of food / mud / water, and a prank in at least six zones.
const z = (name, tags, spots, search, route, pos) => ({ name, tags, spots, search, route, pos });
const s = (name, cover, room) => ({ name, cover, room });

GG.farms = {
  bramble: {
    id: "bramble", name: "Bramble Farm", farmer: "Farmer Bramble", dog: "Biscuit",
    start: { turkeys: "pen", farmer: "house", dog: "house" },
    zones: {
      orchard: z("Apple Orchard",   ["food"],         [s("Leaf pile", 3, 3), s("Apple trees", 4, 3), s("Fallen log", 4, 2)],      [0,0,0,1,1,2], ["garden","garden","garden","pumpkin","pumpkin","pumpkin"], [0,0]),
      pumpkin: z("Pumpkin Patch",   ["food"],         [s("Big pumpkins", 3, 3), s("Hay wagon", 4, 3)],                             [0,0,0,1,1,1], ["orchard","orchard","yard","yard","corn","corn"], [1,0]),
      corn:    z("Cornfield",       ["food"],         [s("Corn rows", 3, 6), s("Corn crib", 4, 2)],                                [0,0,0,0,1,1], ["pumpkin","pumpkin","barn","barn","pasture","pasture"], [2,0]),
      pasture: z("Cow Pasture",     ["mud"],          [s("Behind the cows", 4, 4), s("Water trough", 4, 2), s("Hay rack", 3, 2)], [0,0,0,1,1,2], ["corn","corn","corn","corn","corn","corn"], [3,0]),
      garden:  z("Vegetable Garden",["food"],         [s("Cabbage rows", 3, 3), s("Compost heap", 4, 2), s("Scarecrow", 5, 1)],    [0,0,0,1,1,2], ["house","house","yard","yard","orchard","orchard"], [0,1]),
      yard:    z("Barnyard",        ["open","mud"],   [],                                                                          [],            ["pen","pen","barn","barn","garden","pumpkin"], [1,1]),
      barn:    z("Big Barn",        [],               [s("Hayloft", 3, 4), s("Old tractor", 4, 2), s("Feed bins", 4, 2)],          [0,0,0,1,1,2], ["yard","yard","coop","corn","corn","pond"], [2,1]),
      pond:    z("Duck Pond",       ["noisy","water"],[s("Reeds", 3, 4), s("Upturned boat", 4, 2), s("Under the dock", 5, 2)],    [0,0,0,1,1,2], ["barn","barn","barn","shed","shed","shed"], [3,1]),
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
      { id: "cows",     zone: "pasture", name: "Let the cows out",           target: 4, need: 1, clock: 2, detour: "pasture" },
      { id: "rooster",  zone: "coop",    name: "Wake the rooster",           target: 3, need: 1, clock: 2, loud: true },
      { id: "scarecrow",zone: "garden",  name: "Dress the scarecrow as a turkey", target: 4, need: 2, clock: 1, decoy: true },
      { id: "pails",    zone: "barn",    name: "Tip over the milk pails",    target: 4, need: 1, clock: 2, loud: true },
      { id: "tires",    zone: "shed",    name: "Let down the tractor tires", target: 4, need: 2, clock: 2 },
      { id: "boat",     zone: "pond",    name: "Untie the rowboat",          target: 4, need: 1, clock: 2, detour: "pond" },
      { id: "pumpkin",  zone: "pumpkin", name: "Roll the giant pumpkin",     target: 4, need: 2, clock: 2, loud: true }
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
// Ch 6 "The Dinner Clock": a countdown. It starts at 8 + 2 per turkey (plus the difficulty's
// adjustment), moves down one space every round, and pranks move it further. When it
// reaches 0 it's Too Late: the farmer gives up and the flock wins.
GG.clock = { base: 8, perTurkey: 2, decoyClock: 2, eventEvery: 4 };
// Ch 8 "Flock Size": the clock and the flock's Feathers by number of turkeys.
GG.flock = { min: 2, max: 8, feathers: 2 };

/* --------------------------------------------------------------- events -- */
// An event is rolled whenever the clock reaches a space that's a multiple of GG.clock.eventEvery (above 0).
GG.events = [
  { id: "backfire", name: "The truck backfires",   text: "Every turkey’s urge rises by 1." },
  { id: "phone",    name: "Grandma calls",          text: "The farmer goes straight to the Farmhouse." },
  { id: "kids",     name: "The kids come to help",  text: "On his next turn, the farmer searches every hiding spot in the zone he ends in." },
  { id: "rake",     name: "He steps on a rake",     text: "On his next turn, the farmer doesn’t move (he still searches his zone)." },
  { id: "gust",     name: "A cold gust",            text: "Every turkey huddles down: every turkey’s urge falls by 1." },
  { id: "oven",     name: "The oven is preheated",  text: "On his next turn, the farmer hurries: he walks two zones along his route." }
];
