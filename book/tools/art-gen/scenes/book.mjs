// Sample art for the book: the cover, part pages, chapter vignettes, spots, the
// back cover and the turkey portraits. Every piece is composed from the kit
// (book/tools/art-gen/kit/): one ground line per scene, contact shadows, each
// character drawn the same way everywhere (ART-CHECKLIST.md).
import { svg } from "./lib.mjs";
import { K, n, shape, fillOnly, ink, circle, ellipse, ground } from "../kit/core.mjs";
import { turkey, BIRDS } from "../kit/turkey.mjs";
import { placeFarmer, placeKid } from "../kit/people.mjs";
import { placeDog } from "../kit/dogs.mjs";
import * as Pr from "../kit/props.mjs";

/** A sky band with a soft vertical gradient (id must be unique per piece). */
const sky = (id, w, h, top = K.deep, bottom = K.sky) =>
  `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#${id})"/>`;
/** The ground: a field from y down to the bottom. */
const field = (w, y, h, col = K.grass) => `<rect x="0" y="${y}" width="${w}" height="${h - y}" fill="${col}"/>` + ink(`M0 ${y}H${w}`, 3);
const frame = (w, h) => `<rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" fill="none" stroke="${K.ink}" stroke-width="3" rx="10"/>`;
const clip = (id, w, h, body) => `<defs><clipPath id="${id}"><rect width="${w}" height="${h}" rx="10"/></clipPath></defs><g clip-path="url(#${id})">${body}</g>`;

/* ------------------------------------------------------------- cover -- */

export function cover() {
  const W = 612, H = 792;
  let b = sky("cv-sky", W, 470, K.deep, "#f3c983");
  b += Pr.sun(450, 392, 40);
  b += Pr.cloud(104, 300, 0.48) + Pr.cloud(520, 286, 0.42);
  b += Pr.hills(W, 420);
  b += Pr.barn(110, 566, 0.5);
  b += Pr.tree(300, 568, 0.5);
  b += Pr.farmhouse(472, 562, 0.58, { glow: true });
  b += placeFarmer("bramble", 472, 568, 0.22, { pose: "pan", look: -0.6 });
  b += field(W, 566, H, K.grass) + Pr.tufts(0, W, 566, 5);
  b += placeDog("bramble", 352, 592, 0.4, -1, { pose: "sniff" });
  // the middle row: Gizmo frets by the haystack, Clementine breathes, Noodle dashes, Hazel peeks over the fence
  b += turkey("gizmo", 206, 654, 0.44, 1, { pose: "stand", eyes: "worried" });
  b += turkey("clementine", 322, 656, 0.42, 1, { pose: "zen", eyes: "closed" });
  b += turkey("hazel", 548, 650, 0.44, -1, { pose: "peek", eyes: "wide" });
  b += Pr.fence(430, 656, 340, 0.5);
  b += turkey("noodle", 488, 692, 0.46, 1, { pose: "run", fx: ["motion"] });
  // the front row
  b += turkey("bigtom", 70, 772, 0.68, 1, { pose: "peek", eyes: "worried", fx: ["sweat"] });
  b += Pr.haystack(84, 776, 0.72);
  b += turkey("duchess", 272, 768, 0.56, -1, { pose: "proud", eyes: "sly" });
  b += Pr.pumpkin(268, 776, 0.82);
  b += turkey("pip", 404, 776, 0.66, -1, { pose: "sneak", fx: ["hiccup"] });
  b += turkey("butterbean", 552, 770, 0.6, -1, { pose: "crouch", eyes: "sly" });
  b += Pr.bale(560, 778, 0.6);
  return svg(`0 0 ${W} ${H}`, "Cover: eight turkeys hide around the farm while the farmer waits at the farmhouse door with an empty roasting tin", b);
}

/* ------------------------------------------------- wide vignettes (3:1) -- */

const WW = 900, WH = 300, GY = 272;
/** A wide vignette: sky, distant hills, the field and its ground line; framed. */
function wide(id, title, body, o = {}) {
  let b = sky(`${id}-sky`, WW, WH, o.top ?? "#f1d9a8", o.bottom ?? K.paper2);
  if (o.moon) b += circle(780, 70, 34, K.cream, 3) + circle(796, 60, 30, o.top ?? K.deep, 0);
  if (o.sun) b += Pr.sun(o.sun[0], o.sun[1], 34);
  b += Pr.hills(WW, o.hills ?? 200, o.hillCol ?? K.grass, o.hillShade ?? K.grassShade);
  b += field(WW, GY, WH, o.field ?? K.grass) + Pr.tufts(0, WW, GY, 7);
  b += body;
  // The chapter-head box is wider than 3:1, so the art fills it from the ground up (only sky is cropped).
  return svg(`0 0 ${WW} ${WH}`, title, b).replace("<svg ", '<svg preserveAspectRatio="xMidYMax slice" ');
}

export function part_one() {
  let b = Pr.fence(30, 214, 2000, 0.42);
  const line = ["pip", "butterbean", "hazel", "duchess", "noodle", "clementine", "gizmo", "bigtom"];
  line.forEach((id, i) => { b += turkey(id, 110 + i * 96, GY - 2 + (i % 2) * 4, 0.5, 1, { pose: "sneak", fx: id === "pip" ? ["hiccup"] : [] }); });
  return wide("p1", "The whole flock tiptoes past the fence in a line, Pip hiccuping at the front", b);
}

export function ch_01() {
  let b = Pr.farmhouse(720, GY, 0.46, { glow: true });
  b += placeFarmer("bramble", 720, GY + 4, 0.2, { pose: "pan" });
  b += Pr.bale(180, GY + 2, 0.6) + Pr.bale(290, GY + 2, 0.6);
  b += turkey("butterbean", 140, GY - 10, 0.5, -1, { pose: "crouch", eyes: "worried" });
  b += Pr.bale(180, GY + 6, 0.62).replace("", "");
  b += turkey("noodle", 430, GY, 0.52, -1, { pose: "run", fx: ["motion"] });
  b += turkey("pip", 520, GY, 0.5, -1, { pose: "run", eyes: "wide" });
  return wide("c1", "Thanksgiving morning: the farmer appears at the farmhouse door with a roasting tin, and the turkeys run for the hay bales", b, { sun: [560, 120] });
}

export function ch_02() {
  const order = [["clementine", "zen", "closed"], ["butterbean", "gobble", "happy"], ["pip", "stand", "open"], ["bigtom", "proud", "open"], ["duchess", "proud", "sly"], ["gizmo", "stand", "worried"], ["noodle", "stand", "wide"], ["hazel", "peek", "wide"]];
  let b = "";
  order.forEach(([id, pose, eyes], i) => { b += turkey(id, 70 + i * 108, GY, 0.52, i < 4 ? 1 : -1, { pose, eyes, fx: id === "pip" ? ["hiccup"] : [] }); });
  return wide("c2", "Meet the flock: all eight turkeys line up for a group portrait", b);
}

export function ch_03() {
  let b = Pr.tree(820, GY, 0.55) + Pr.barn(90, GY, 0.32);
  b += placeFarmer("bramble", 560, GY + 2, 0.5, { pose: "search", look: 1 });
  b += placeDog("bramble", 690, GY, 0.55, 1, { pose: "sniff" });
  b += turkey("pip", 330, GY, 0.48, 1, { pose: "sneak" }) + turkey("hazel", 420, GY, 0.48, 1, { pose: "sneak" });
  return wide("c3", "A round on the farm: the farmer searches ahead while two turkeys tiptoe along right behind him", b);
}

export function ch_04() {
  let b = placeFarmer("puddlewick", 690, GY + 2, 0.5, { pose: "listen", fx: ["huh"], look: -1 });
  b += turkey("bigtom", 420, GY, 0.56, 1, { pose: "crouch", eyes: "worried", fx: ["sweat"] });
  b += Pr.cabbage(470, GY + 2, 0.9) + Pr.cabbage(400, GY + 4, 0.8);
  b += turkey("butterbean", 120, GY, 0.46, 1, { pose: "gobble", eyes: "closed" });
  return wide("c4", "Don't gobble! Big Tom holds it in behind the cabbages while the farmer cups a hand to his ear; far away, Butterbean lets one out", b);
}

export function ch_05() {
  let b = Pr.corn(120, GY, 0.5) + Pr.corn(220, GY, 0.5);
  b += turkey("hazel", 170, GY - 6, 0.46, 1, { pose: "peek", eyes: "wide" });
  b += Pr.corn(170, GY + 4, 0.48);
  b += turkey("gizmo", 350, GY, 0.5, 1, { pose: "peek", eyes: "worried" }) + Pr.haystack(360, GY + 2, 0.62);
  b += turkey("duchess", 520, GY, 0.48, 1, { pose: "crouch", eyes: "sly" }) + Pr.pumpkin(530, GY + 2, 0.8);
  b += placeFarmer("windle", 760, GY + 2, 0.5, { pose: "search", look: -1 });
  return wide("c5", "Hide and seek: turkeys peek out of the corn, from behind a haystack and over a pumpkin while the farmer looks the wrong way", b);
}

export function ch_06() {
  let b = Pr.barn(130, GY, 0.42);
  b += Pr.clock(130, 104, 26, 11, 50);   // the Dinner Clock on the barn's gable, under the roof
  b += Pr.cow(420, GY, 0.55) + Pr.cow(600, GY, 0.5, -1);
  b += Pr.fence(680, GY, 200, 0.5) + Pr.rooster(760, GY - 46, 0.6);
  b += turkey("butterbean", 300, GY, 0.44, 1, { pose: "stand", eyes: "happy" });
  return wide("c6", "Pranks: the cows are loose, the rooster crows on the fence, and the clock on the barn ticks toward dinner time", b);
}

export function part_two() {
  let b = Pr.barn(810, GY, 0.32);
  b += placeFarmer("bramble", 300, GY + 2, 0.56, { pose: "search", look: 1 });
  b += placeDog("bramble", 430, GY, 0.6, 1, { pose: "sniff" });
  b += placeKid(530, GY + 2, 0.56, { pose: "point" });
  return wide("p2", "The search party: the farmer, his dog and his kid set out across the farm", b);
}

export function ch_07() {
  let b = Pr.pumpkin(170, GY + 2, 0.6) + Pr.pumpkin(260, GY + 4, 0.7);
  b += turkey("noodle", 330, GY, 0.48, -1, { pose: "crouch", eyes: "worried" }) + Pr.pumpkin(330, GY + 6, 0.8);
  b += placeFarmer("bramble", 520, GY + 2, 0.52, { pose: "listen", fx: ["huh"], look: -1 });
  b += placeDog("bramble", 650, GY, 0.55, -1, { pose: "bark" });
  b += placeKid(760, GY + 2, 0.52, { pose: "wave" });
  return wide("c7", "Being the farmer: “Huh? What was that?” The dog barks at the pumpkin patch and the kid waves Dad over", b);
}

export function ch_08() {
  // three panels split by fence posts: Easy, Standard, Hard
  const post = x => ground(x, GY + 2, 12, 0.15) + shape(`M${x - 7} ${GY}V${GY - 120}L${x} ${GY - 128}L${x + 7} ${GY - 120}V${GY}Z`, K.wood, 2.6);
  let b = post(300) + post(600);
  b += placeFarmer("bramble", 150, GY + 2, 0.5, { pose: "stand" });
  b += placeFarmer("bramble", 400, GY + 2, 0.5, { pose: "stand" }) + placeDog("bramble", 515, GY, 0.5, -1);
  b += placeKid(668, GY + 2, 0.46, { pose: "point" }) + placeFarmer("bramble", 760, GY + 2, 0.5, { pose: "stand", mood: "cross" }) + placeDog("bramble", 850, GY, 0.48, -1);
  return wide("c8", "Difficulty and flock size: the farmer alone, then with his dog, then with his dog and his kid", b);
}

export function ch_12() {
  let b = Pr.farmhouse(700, GY, 0.48, { glow: true });
  b += turkey("pip", 220, GY, 0.48, 1, { pose: "sneak", fx: ["hiccup"] }) + turkey("gizmo", 330, GY, 0.5, 1, { pose: "sneak" }) + turkey("duchess", 440, GY, 0.48, 1, { pose: "sneak" });
  return wide("c12", "Your first night: three turkeys creep past the glowing farmhouse windows under the moon", b, { top: K.deep, bottom: "#5a4060", moon: true, hillCol: K.grassShade, field: K.grassShade });
}

/* ------------------------------------------------------- spots (4:3) -- */

const SW = 400, SH = 300, SG = 270;
function spot(id, title, body, o = {}) {
  let b = sky(`${id}-sky`, SW, SH, o.top ?? "#f1d9a8", o.bottom ?? K.paper2);
  if (o.wall) b += `<rect width="${SW}" height="${SG}" fill="${K.cream}"/>` + ink(Array.from({ length: 9 }, (_, i) => `M${i * 48} 0V${SG}`).join(""), 1.6, K.edge);
  else b += Pr.hills(SW, o.hills ?? 190);
  b += o.wall ? `<rect x="0" y="${SG}" width="${SW}" height="${SH - SG}" fill="${K.wood}"/>` + ink(`M0 ${SG}H${SW}`, 3) : field(SW, SG, SH) + Pr.tufts(0, SW, SG, 11);
  b += body;
  return svg(`0 0 ${SW} ${SH}`, title, clip(`${id}-c`, SW, SH, b) + frame(SW, SH));
}

export function spot_01() {
  // the kitchen: Butterbean has pulled the plug; its cord runs from the oven across the floor to her beak,
  // and the wall socket behind her is empty
  let b = Pr.oven(310, SG, 0.8);
  b += shape("M44 196H68V224H44Z", K.paper, 2.4) + circle(51, 208, 2.2, K.ink, 0) + circle(61, 208, 2.2, K.ink, 0);
  b += turkey("butterbean", 190, SG, 0.6, -1, { pose: "crouch", eyes: "happy" });
  b += ink("M254 254C230 266 200 268 176 266C150 262 130 236 122 214", 5) + ink("M254 254C230 266 200 268 176 266C150 262 130 236 122 214", 2.4, K.inkSoft);
  b += shape("M108 206L124 200L128 212L112 218Z", K.metalShade, 2) + ink("M110 204l-6 -3M114 216l-6 3", 2.4);
  return spot("s1", "Butterbean has pulled the oven's plug out of the wall", b, { wall: true });
}
export const spot_02 = () => spot("s2", "Pip tiptoes along, hiccuping", turkey("pip", 210, SG, 0.8, 1, { pose: "sneak", fx: ["hiccup"] }) + Pr.cabbage(330, SG + 2, 0.7));
export function spot_03() {
  let b = Pr.die(110, SG, 6, "white", 1, -6) + Pr.die(190, SG, 3, "white", 1, 4) + Pr.die(265, SG, 6, "red", 1, -3) + Pr.die(335, SG, 2, "helper", 0.9, 8);
  b += Pr.feather(200, SG + 22, 0.8);
  return spot("s3", "The dice: white dice for the action, a red die for the urge, the helper die, and a Feather", b);
}
export const spot_04 = () => spot("s4", "Big Tom gobbles in fright at a tiny mouse", turkey("bigtom", 170, SG, 0.68, 1, { pose: "gobble", eyes: "wide", fx: ["sweat"] }) + Pr.mouse(320, SG, 1, -1));
export const spot_05 = () => spot("s5", "Duchess is not hiding. She is posing. Behind a cabbage.", turkey("duchess", 190, SG, 0.72, 1, { pose: "proud", eyes: "sly" }) + Pr.cabbage(230, SG + 4, 0.8));
export function spot_06() {
  // the Dinner Clock hangs on a nail by its string; Hazel stares at it
  let b = circle(200, 46, 4, K.metal, 2) + ink("M200 46L170 92M200 46L230 92", 2.4) + Pr.clock(200, 128, 52, 11, 55);
  b += turkey("hazel", 200, SG, 0.6, -1, { pose: "peek", eyes: "wide", fx: ["sweat"] });
  return spot("s6", "Hazel watches the Dinner Clock tick toward dinner time", b, { wall: true });
}
export function spot_07() {
  // the rake's teeth under his left boot, the handle swung up into his nose
  let b = placeFarmer("bramble", 220, SG + 2, 0.58, { pose: "stand", mouth: "o" });
  b += shape(`M168 ${SG - 6}H214V${SG + 4}H168Z`, K.metal, 2.4) + ink(`M172 ${SG + 4}v6M182 ${SG + 4}v6M192 ${SG + 4}v6M202 ${SG + 4}v6M212 ${SG + 4}v6`, 2.6);
  b += ink(`M190 ${SG - 6}L214 86`, 11) + ink(`M190 ${SG - 6}L214 86`, 6, K.wood);
  b += ink("M180 80l-16 -10M176 96h-18M182 64l-10 -14M244 66l12 -12M250 84h16", 3);
  return spot("s7", "THWACK: the farmer steps on a rake", b);
}
export function spot_08() {
  let b = turkey("hazel", 290, SG, 0.6, -1, { pose: "peek", eyes: "wide" }) + Pr.haystack(300, SG + 2, 0.7);
  b += placeKid(100, SG + 2, 0.82, { pose: "point", mouth: "o", fx: ["yell"] });
  return spot("s8", "The kid spots a turkey behind the haystack and yells for Dad", b);
}
export const spot_09 = () => spot("s9", "Bramble Farm: the cows are out", Pr.fence(-20, SG, 180, 0.6) + Pr.cow(270, SG, 0.6) + Pr.barn(60, SG - 40, 0.16));
export const spot_10 = () => spot("s10", "Puddlewick Farm: the rowboat drifts off while Pickles barks", Pr.pondBoat(240, 236, 0.8) + placeDog("puddlewick", 70, SG, 0.8, 1, { pose: "bark" }));
export const spot_11 = () => spot("s11", "Windy Ridge Farm: Farmer Windle's cap is caught on a windmill sail", Pr.windmill(262, SG, 0.42, { hat: true }) + placeFarmer("windle", 92, SG + 2, 0.5, { pose: "point", noHat: true, look: 1 }));
export const spot_12 = () => spot("s12", "Gizmo fusses over Hazel", turkey("hazel", 250, SG, 0.66, -1, { pose: "stand", eyes: "wide" }) + turkey("gizmo", 150, SG, 0.66, 1, { pose: "stand", eyes: "worried", fx: ["sweat"] }));
export const spot_13 = () => spot("s13", "Noodle dashes across the field", turkey("noodle", 230, SG, 0.72, 1, { pose: "run", fx: ["motion"] }));
export const spot_14 = () => spot("s14", "Clementine breathes in and breathes out", turkey("clementine", 200, SG, 0.74, 1, { pose: "zen", eyes: "closed" }) + Pr.bale(80, SG + 2, 0.4) + Pr.pumpkin(330, SG + 2, 0.5));

/** The back cover's panel: Too Late! The farmer shrugs; the turkeys celebrate. */
export function back_cover() {
  let b = placeFarmer("bramble", 300, SG + 2, 0.52, { pose: "shrug" }) + Pr.roastingTin(230, SG, 0.5);
  b += turkey("bigtom", 110, SG, 0.5, 1, { pose: "proud", eyes: "happy" }) + turkey("pip", 170, SG, 0.42, 1, { pose: "gobble", eyes: "happy" });
  return spot("bk", "Too late! The farmer shrugs over an empty roasting tin while the turkeys celebrate", b);
}

/* --------------------------------------------- portraits (square, cameo) -- */

const SIGNATURE = {
  butterbean: { pose: "gobble", eyes: "happy" }, pip: { pose: "sneak", fx: ["hiccup"] }, duchess: { pose: "proud", eyes: "sly" },
  bigtom: { pose: "proud" }, noodle: { pose: "run", fx: ["motion"] }, clementine: { pose: "zen", eyes: "closed" },
  gizmo: { pose: "stand", eyes: "worried" }, hazel: { pose: "peek", eyes: "wide" }
};
/** A turkey's portrait in a round frame (Ch 2, the turkey cards, the VTT tokens). */
export function portrait(id, o = {}) {
  const b = BIRDS[id];
  const fan = ["bigtom", "duchess"].includes(id);
  const s = (fan ? 1.08 : 1.22) / b.size * (o.tight ? 1.1 : 1);
  let body = circle(200, 200, 186, K.paper2, 0) + `<rect x="0" y="300" width="400" height="100" fill="${K.grass}"/>` + ink("M0 300H400", 3);
  body += turkey(id, fan ? 214 : 196, 318, s, 1, SIGNATURE[id]);
  const cl = `<defs><clipPath id="pt-${id}"><circle cx="200" cy="200" r="186"/></clipPath></defs>`;
  return svg("0 0 400 400", `${b.name}`, cl + `<g clip-path="url(#pt-${id})">${body}</g>` + circle(200, 200, 186, "none", 6) + circle(200, 200, 196, "none", 3, ` stroke="${K.accent}"`));
}
export const turkey_butterbean = () => portrait("butterbean");
export const turkey_pip = () => portrait("pip");
export const turkey_duchess = () => portrait("duchess");
export const turkey_bigtom = () => portrait("bigtom");
export const turkey_noodle = () => portrait("noodle");
export const turkey_clementine = () => portrait("clementine");
export const turkey_gizmo = () => portrait("gizmo");
export const turkey_hazel = () => portrait("hazel");

/** A farm-folk portrait in the same round frame (VTT tokens): a farmer, a dog or the kid. */
export function folkPortrait(kind, id) {
  let fig, title;
  if (kind === "farmer") { fig = placeFarmer(id, 200, 470, 0.92, { pose: "stand" }); title = { bramble: "Farmer Bramble", puddlewick: "Farmer Puddlewick", windle: "Farmer Windle" }[id]; }
  else if (kind === "dog") { fig = placeDog(id, 168, 318, 1.5 / ({ bramble: 1, puddlewick: 0.8, windy: 1.25 }[id]), 1); title = { bramble: "Biscuit", puddlewick: "Pickles", windy: "Moose" }[id]; }
  else { fig = placeKid(200, 400, 1.45, { pose: "wave" }); title = "The Farmer's Kid"; }
  const key = `fp-${kind}-${id ?? "kid"}`;
  let body = circle(200, 200, 186, kind === "farmer" ? K.edge : K.paper2, 0) + `<rect x="0" y="300" width="400" height="100" fill="${K.grass}"/>` + ink("M0 300H400", 3) + fig;
  return svg("0 0 400 400", title, `<defs><clipPath id="${key}"><circle cx="200" cy="200" r="186"/></clipPath></defs><g clip-path="url(#${key})">${body}</g>` + circle(200, 200, 186, "none", 6) + circle(200, 200, 196, "none", 3, ` stroke="${kind === "turkey" ? K.accent : K.deep}"`));
}

/* ------------------------------------------- reference sheets (not in the book) -- */

/** A turkey's reference sheet: right and left profiles and the signature pose (ART-CHECKLIST §10, §22). */
function refSheet(id) {
  const b = BIRDS[id];
  let body = `<rect width="900" height="360" fill="${K.paper}"/>` + ink("M0 320H900", 3);
  body += turkey(id, 170, 320, 1, 1) + turkey(id, 470, 320, 1, -1) + turkey(id, 740, 320, 0.9, 1, SIGNATURE[id]);
  const note = `${b.name}: a ${b.bird}${b.edge ? ", black feather edging" : ""}${b.bars ? ", barred wings" : ""}${b.scarf ? ", pumpkin knitted scarf" : ""}${b.sheen ? ", green-copper sheen" : ""}. Every marking is the same on both sides, so the left profile is the right one mirrored.`;
  return svg("0 0 900 360", `Reference sheet: ${note}`, body);
}
export const ref_butterbean = () => refSheet("butterbean");
export const ref_pip = () => refSheet("pip");
export const ref_duchess = () => refSheet("duchess");
export const ref_bigtom = () => refSheet("bigtom");
export const ref_noodle = () => refSheet("noodle");
export const ref_clementine = () => refSheet("clementine");
export const ref_gizmo = () => refSheet("gizmo");
export const ref_hazel = () => refSheet("hazel");
