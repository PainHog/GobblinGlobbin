/**
 * What the UI shows, from the game state (shared by the Farm Tracker and the turkey
 * sheet). Plain data for the templates: no helpers beyond `localize` are needed.
 */
import { GG } from "../config.mjs";
import * as G from "../logic/game.mjs";
import * as R from "../logic/rules.mjs";

export const ACTION_KINDS = ["sneak", "hunker", "prank", "rescue", "scram", "letItOut"];
export const ACTION_LABEL = { sneak: "Sneak", hunker: "Hunker Down", prank: "Pull a Prank", rescue: "Gobble for a Friend", scram: "Scram", letItOut: "Let It Out" };
const WHY = {
  acted: "already acted this round", spottedOnlyScram: "a Spotted turkey can only Scram", restless: "Restless: not two rounds in a row",
  farmhouseRound1: "nobody goes into the Farmhouse in round 1", notSpotted: "only a Spotted turkey can Scram", farmerHere: "the farmer is right here",
  prankDone: "that prank is done", notTurkeysTurn: "it's the farmer's turn", over: "the game is over"
};
export const whyText = code => WHY[code] ?? "";

/** The actions a turkey can take now, one per kind, with a reason when it can't. */
export function actionButtons(S, turkeyId) {
  const all = G.legalActions(S, turkeyId);
  return ACTION_KINDS.map(kind => {
    const opts = all.filter(a => a.kind === kind);
    const ok = opts.filter(a => !a.why);
    const reason = ok.length ? "" : whyText(opts[0]?.why) || (kind === "prank" ? "no prank in this zone" : kind === "rescue" ? "nobody needs rescuing" : "not now");
    return { kind, label: ACTION_LABEL[kind], enabled: ok.length > 0, reason };
  });
}

/** Where a turkey is, in words. */
export function placeText(S, t) {
  const z = S.farm.zones[t.zone];
  const where = t.spot === null ? `in the open in ${z.name}` : `in ${z.spots[t.spot]?.name} (${z.name})`;
  return t.spotted ? `SPOTTED ${where}` : where;
}

export const urgePips = urge => Array.from({ length: GG.urge.max + 1 }, (_, n) => ({ n, on: n <= urge && n > 0, current: n === urge, hot: n >= 4 }));

/** Keen Eye's forecast, when nothing else will decide the farmer's walk. */
export function forecast(S) {
  if (!S.preRoute || S.farmer.indoors || S.phase !== "turkeys") return null;
  if (S.farmer.detours.length || S.farmer.noMove) return null;
  if (R.chooseHeard(S.farm, S.farmer.zone, S.heard, S.adj)) return null;
  const to = S.farm.zones[S.farmer.zone].route[S.preRoute - 1];
  return { die: S.preRoute, zone: S.farm.zones[to].name };
}

/** The whole tracker view for one user. */
export function trackerView(S, user) {
  const farm = S.farm;
  const zoneName = z => farm.zones[z]?.name ?? z;
  const turkeys = S.turkeys.map(t => {
    const seat = S.seats?.[t.id] ?? {};
    const actor = seat.actorId ? game.actors?.get(seat.actorId) : null;
    const mine = !!user?.isGM || seat.userId === user?.id;
    const player = seat.userId ? game.users?.get(seat.userId)?.name ?? "" : "Storyteller";
    return {
      id: t.id, name: t.name, img: actor?.img ?? "", player, urge: t.urge, pips: urgePips(t.urge),
      place: placeText(S, t), spotted: t.spotted, acted: t.acted, mine,
      knack: GG.knacks[t.knack]?.name, quirk: GG.quirks[t.quirk]?.name,
      actions: mine && S.phase === "turkeys" && !t.acted && !S.over ? actionButtons(S, t.id) : []
    };
  });
  const clock = [];
  for (let i = S.clockStart; i >= 1; i--) clock.push({ n: i, event: R.isEventSpace(i), now: i === S.clock, past: i > S.clock });
  const pranks = farm.pranks.map(p => ({
    name: p.name, zone: zoneName(p.zone), target: p.target, clock: p.clock, done: !!S.done[p.id],
    boxes: Array.from({ length: p.need }, (_, i) => ({ ticked: i < (S.progress[p.id] ?? 0) })),
    type: p.decoy ? "decoy" : p.detour ? "detour" : p.loud ? "loud" : ""
  }));
  const everyoneActed = S.turkeys.every(t => t.acted);
  return {
    farm: farm.name, difficulty: GG.difficulty[S.difficulty].name, round: S.round,
    phaseLabel: S.over ? (S.result === "win" ? "Too Late! The flock wins!" : `${G.turkey(S, S.gobbled)?.name ?? "A turkey"} got gobbled`) : S.phase === "turkeys" ? (everyoneActed ? "Everyone has acted: the farmer's turn" : "The turkeys' turn") : "The farmer's turn",
    over: S.over, win: S.result === "win",
    clockNow: S.clock, clock, feathers: S.feathers, featherIcons: Array.from({ length: S.feathers }, () => ({})), decoy: S.decoy,
    farmer: { name: farm.farmer, zone: S.farmer.indoors ? "indoors (pulling on his boots)" : zoneName(S.farmer.zone) },
    dog: S.dog ? { name: farm.dog, zone: zoneName(S.dog.zone) } : null,
    kids: S.kids.map(k => ({ zone: zoneName(k.zone) })),
    forecast: forecast(S),
    tokens: Object.keys(S.heard).length,
    turkeys, pranks,
    everyoneActed,
    canFarmer: S.phase === "turkeys" && !S.over
  };
}
