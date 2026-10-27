/**
 * Don't Get Gobble Gobbled — simulator parameters.
 *
 * Two kinds of setting live here:
 *  - player policy thresholds (how cautious the simulated flock is), and
 *  - judgement calls, each with a doc line, used for sweeps.
 * Rules numbers themselves live in module/config.mjs with the book's tables.
 */
export const DEFAULTS = {
  startUrge: undefined,    // undefined → GG.urge.start
  clockShift: 0,           // test-only shift of the clock
  events: true,            // Ch 7 farm events on the marked rounds
  help: true,              // whether the flock helps rolls at all
  helpMaxUrge: 3,          // a turkey helps only while its own urge is at most this
  pushHideMax: 2,          // push a hide roll while urge ≤ this
  pushSniffMax: 1,
  pushSneakMax: 1,
  pushPrankMax: 1,
  prankShare: 0.5,         // at most this share of the flock goes pranking in a round
  prankMaxUrge: 3,         // only turkeys this calm go pranking
  prankMaxScore: 4,        // skip pranks that are too far or too dangerous this round
  fleeAt: 0.3,             // a hider moves away when the farmer's chance of coming is at least this
  fleeGain: 0.15,          // …and the new zone is at least this much safer
  calmAt: 4,               // Hunker Down (or Let It Out) at this urge, unless time is short
  cautiousAt: 3,           // don't take a sneak that needs a roll at this urge
  letItOut: true,          // let it out when the farmer is far away
  letItOutAt: 4,
  letItOutDist: 3,
};

export const DOCS = {
  helpMaxUrge: "A turkey only helps while its own urge is at most this (policy).",
  pushHideMax: "The flock pushes a hide roll while the hider's urge is at most this (policy).",
  calmAt: "A turkey stops to Hunker Down at this urge (policy).",
  letItOut: "Whether turkeys use Let It Out to reset their urge when the farmer is far (policy).",
  events: "Farm events on the clock's event marks (rule switch, for testing)."
};

export const PRESETS = {
  default: {},
  timid: { calmAt: 3, cautiousAt: 2, pushHideMax: 1, prankShare: 0.25, prankMaxUrge: 1 },
  bold: { calmAt: 5, cautiousAt: 5, pushHideMax: 4, pushSneakMax: 3, pushPrankMax: 3, prankShare: 0.8, prankMaxUrge: 4, prankMaxScore: 8 },
  noPranks: { prankShare: 0, prankMaxScore: -99 },
  noHelp: { help: false },
  noLetItOut: { letItOut: false }
};
