/**
 * The story of what just happened, for the chat cards (Foundry-free).
 *
 * Turns the engine's events (module/logic/game.mjs io.emit) into short, funny,
 * plain lines in the book's voice. Every die is shown. Lines are HTML with the
 * classes styles/gobble-gobbled.css draws (gg-die white/red/helper, gg-line kinds).
 */
import { GG } from "../config.mjs";

const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const die = (face, kind) => `<span class="gg-die ${kind}${face === 6 ? " six" : ""}">${face}</span>`;
const dice = (faces, kind) => faces.map(f => die(f, kind)).join("");

/** Names for everything an event can mention. */
export function namer(S) {
  const farm = GG.farms[S.farmId];
  const tname = id => esc(GG.turkeys.find(t => t.id === id)?.name ?? id);
  return {
    farm,
    t: tname,
    zone: z => esc(farm.zones[z]?.name ?? z),
    spot: (z, i) => (i === null || i === undefined ? "the open" : esc(farm.zones[z]?.spots[i]?.name ?? `spot ${i + 1}`)),
    prank: id => esc(farm.pranks.find(p => p.id === id)?.name ?? id),
    farmer: esc(farm.farmer),
    dog: esc(farm.dog),
    who: w => (w === "farmer" ? esc(farm.farmer) : w === "dog" ? esc(farm.dog) : w === "kid" || w === "kid2" ? "The kid" : tname(w))
  };
}

const ROLL = {
  sneak: "to sneak", hunker: "to hide", prank: "on the prank", rescue: "to turn the farmer's head", scram: "to Scram",
  hide: "to stay hidden", sniff: "to fool the dog's nose"
};
const GOBBLE = {
  roll: n => `<strong>GOBBLE!</strong> ${n} couldn't help it. Urge back to 0.`,
  full: n => `${n} can't hold it in a second longer: <strong>GOBBLE!</strong> Urge back to 0.`,
  letItOut: n => `${n} lets it out: a big, happy <strong>GOBBLE!</strong> Urge back to 0.`,
  rescue: n => `${n} gobbles on purpose, as loudly as a turkey can: <strong>GOBBLE GOBBLE!</strong>`,
  helper: n => `${n}'s helper die shows a 6: <strong>GOBBLE!</strong> Urge back to 0.`
};
const URGE_WHY = {
  puffUp: "puffs up", closeCall: "has a close call", jumpy: "jumps at the noise", worrywart: "worries", chatterbox: "chatters",
  fussy: "fusses about sharing", backfire: "jumps at the BANG", round: "fidgets", hunker: "calms down", motherHen: "is mothered", gust: "huddles in the cold gust"
};
const SPOTTED = {
  open: "is out in the open", search: "is found", sneak: "is noticed sneaking in", gobble: "gobbled right in front of him",
  rescue: "is right there in his zone", hunker: "couldn't get hidden in time"
};
const UNSPOTTED = {
  scram: n => `${n} is away: no longer Spotted.`,
  rescue: n => `The farmer spins round, and ${n} is no longer Spotted!`,
  lost: n => `The farmer has lost sight of ${n}: no longer Spotted.`,
  decoy: n => `${n} slips away while he wrestles with the decoy.`
};

/**
 * One line per event (some events are folded together). `S` is the state after the
 * events (names only; nothing is read from it that could have changed meaning).
 */
export function narrate(events, S) {
  const N = namer(S);
  const out = [];
  const line = (cls, html) => out.push({ cls, html });
  const roundUrges = [];
  const flush = () => {
    if (roundUrges.length) line("urge", `End of the round: everyone fidgets. ${roundUrges.filter(e => e.to <= GG.urge.max).map(e => `${N.t(e.turkey)} ${e.to}`).join(", ")}.`);
    roundUrges.length = 0;
  };
  for (const e of events) {
    if (!(e.t === "urge" && e.why === "round")) flush();
    switch (e.t) {
      case "action": {
        const i = e.intent ?? {};
        const what = {
          sneak: `sneaks toward ${N.zone(i.to)}${i.then ? ` and on to ${N.zone(i.then)}` : ""}`,
          hunker: i.friend && i.friend !== e.turkey ? `hunkers down beside ${N.t(i.friend)}` : "hunkers down",
          prank: `tries a prank: ${N.prank(i.prank)}`,
          rescue: `tries to Gobble for a Friend: ${N.t(i.friend)}`,
          scram: "runs for it",
          letItOut: "decides to let it out"
        }[e.kind] ?? e.kind;
        line("action", `<strong>${N.t(e.turkey)}</strong> ${what}.`);
        break;
      }
      case "roll": {
        const res = e.great ? `<strong class="gg-great">GREAT!</strong>` : e.success ? `<strong class="gg-works">It works.</strong>` : `<strong class="gg-fails">It fails.</strong>`;
        const reds = e.red.length ? ` ${dice(e.red, "red")}` : "";
        const help = e.helper ? ` ${die(e.helperDie, "helper")} <span class="gg-note">(${N.t(e.helper)} Lends a Wing)</span>` : "";
        line("roll", `${N.t(e.turkey)} rolls ${ROLL[e.kind] ?? ""} (${e.target}+): ${dice(e.white, "white")}${reds}${help} ${res}`);
        break;
      }
      case "urge":
        if (e.why === "round") { roundUrges.push(e); break; }
        if (e.to > GG.urge.max) break;   // the gobble line says it
        line("urge", `${N.t(e.turkey)} ${URGE_WHY[e.why] ?? "twitches"}: urge ${e.from} → ${e.to}.`);
        break;
      case "gobble": line("gobble", (GOBBLE[e.kind] ?? GOBBLE.roll)(N.t(e.turkey))); break;
      case "spotted": line("spotted", `<strong>Spotted!</strong> ${N.t(e.turkey)} ${SPOTTED[e.why] ?? "is seen"}.`); break;
      case "unspotted": line("saved", (UNSPOTTED[e.why] ?? UNSPOTTED.lost)(N.t(e.turkey))); break;
      case "heard": line("heard", `A “Huh?” token (${e.seq}) goes on ${e.spot === null ? N.zone(e.zone) : `${N.spot(e.zone, e.spot)} in ${N.zone(e.zone)}`}.`); break;
      case "pose": line("pose", `${N.t(e.turkey)} simply has to strike a pose.`); break;
      case "feather": line("feather", `The flock spends a Feather and the gobble is swallowed just in time (${e.left} left).`); break;
      case "move":
        if (e.who === "farmer") line("move", `${N.farmer} ${e.why === "phone" ? "hurries to the Farmhouse to answer the phone" : e.why === "decoy" ? "carries the decoy to the Farmhouse" : "stomps"}${e.why === "phone" || e.why === "decoy" ? "" : ` to ${N.zone(e.to)}`}.`);
        else if (e.who === "dog") line("move", `${N.dog} trots to ${N.zone(e.to)}.`);
        else if (e.who === "kid" || e.who === "kid2") line("move", `The kid wanders to ${N.zone(e.to)}.`);
        else line("move", `${N.t(e.who)} creeps into ${N.zone(e.to)}.`);
        break;
      case "hide": line("hide", `${N.t(e.turkey)} hides in ${N.spot(e.zone, e.spot)}.`); break;
      case "open": line("open", `${N.t(e.turkey)} is in the open in ${N.zone(e.zone)}.`); break;
      case "prank": line("prank", e.done ? `<strong>${N.prank(e.prank)}: it happens!</strong>` : `${N.prank(e.prank)}: ${e.boxes} of ${e.need} boxes ticked.`); break;
      case "clock": line("clock", `The Dinner Clock moves to <strong>${e.to}</strong>.`); break;
      case "event": {
        const ev = GG.events.find(x => x.id === e.event);
        line("event", `<strong>Farm event (${die(e.die, "farm")}): ${esc(ev?.name)}.</strong> ${esc(ev?.text)}`);
        break;
      }
      case "tooLate": line("win", `<strong>TOO LATE!</strong> It's far too late to cook a turkey tonight. The flock wins!`); break;
      case "boots": line("farmer", `${N.farmer} is still indoors pulling on his boots. The turkeys have their head start.`); break;
      case "grab": line("loss", `<strong>${N.farmer} grabs ${N.t(e.turkey)}!</strong> ${N.t(e.turkey)} gets gobbled.`); break;
      case "decoy": line("saved", `${N.farmer} grabs… the decoy! While he's busy with it, ${N.t(e.turkey)} slips away.`); break;
      case "walk": {
        const w = {
          detour: `The prank sends ${N.farmer} straight to ${N.zone(e.to)}. He's far too busy to search.`,
          rake: `THWACK. ${N.farmer} stepped on a rake and doesn't walk this turn.`,
          heard: `${N.farmer} heard something in ${N.zone(e.target)} (token ${e.seq}) and heads that way.`,
          route: `Nothing to chase, so ${N.farmer} wanders (route die ${die(e.die, "farm")}).`,
          keenEye: `${N.farmer} walks the way the Keen Eye saw coming (route die ${die(e.die, "farm")}).`,
          oven: `The oven's preheated! He hurries on another zone (${die(e.die, "farm")}).`
        }[e.why];
        if (w) line("farmer", w);
        break;
      }
      case "search":
        if (e.busy) break;
        if (!e.spots.length) line("farmer", `He looks all round ${N.zone(e.zone)}.`);
        else if (e.all) line("farmer", `The whole family helps look: he checks every hiding spot in ${N.zone(e.zone)}.`);
        else line("farmer", `He checks ${e.spots.map(i => N.spot(e.zone, i)).join(" and ")} in ${N.zone(e.zone)}.`);
        break;
      case "cleared": line("farmer", `He takes the “Huh?” tokens in ${N.zone(e.zone)} off the map.`); break;
      case "dog": line("dog", e.nose ? `${N.dog} follows its nose ${e.toward ? `toward ${N.t(e.toward)}` : ""} (${die(e.die, "farm")}).` : `${N.dog} wanders off (${die(e.die, "farm")}, then ${die(e.routeDie, "farm")}).`); break;
      case "bark": line("dog", `<strong>WOOF!</strong> ${N.dog} barks at ${N.t(e.turkey)}.`); break;
      case "kid": line("kid", `The kid peeks ${e.spot === null ? "around" : `into ${N.spot(e.zone, e.spot)}`} in ${N.zone(e.zone)}.`); break;
      case "yell": line("kid", `<strong>“DAD! TURKEY!”</strong>`); break;
      case "hiccups": if (e.die === 6) line("gobble", `<em>Hic!</em> ${N.t(e.turkey)}'s hiccups (${die(6, "red")})!`); break;
      case "round": {
        line("round", `<strong>Round ${e.round}.</strong>`);
        if (e.preRoute) {
          const to = N.farm.zones[S.farmer.zone]?.route[e.preRoute - 1];
          if (to) line("keen", `Keen Eye (${die(e.preRoute, "farm")}): if nothing else calls him, ${N.farmer} will walk to ${N.zone(to)}.`);
        }
        break;
      }
    }
  }
  flush();
  return out;
}
