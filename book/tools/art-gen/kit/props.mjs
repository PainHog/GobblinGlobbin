// Farm props for the scenes. Each is drawn around its base on the ground at (0,0)
// (things in the sky around their centre), at the same scale as the characters:
// a farmer is 410 units, a tom 260, a hay bale 120 tall, a barn door 300.
import { K, n, shape, fillOnly, ink, limb, circle, ellipse, ground, place } from "./core.mjs";

const g = (x, y, s, body, flip = 1) => place(x, y, s, flip, body);

/** A rectangular hay bale (about 1.2 m long), lying on the ground. */
export function bale(x, y, s = 1) {
  let d = ground(0, 2, 90);
  d += shape("M-80 -110L70 -110L80 -100L80 0L-80 0Z", K.hay, 3);
  d += fillOnly("M70 -110L80 -100L80 0L70 0Z", K.hayShade) + ink("M70 -110V0", 2.4);
  d += ink("M-80 -100H70", 2.4) + ink("M-40 -110V0M30 -110V0", 4, K.wood);
  d += ink("M-70 -80l8 -4M-56 -60l10 -3M-20 -88l8 2M10 -40l9 -3M44 -70l8 3M-60 -24l9 2M50 -20l8 -3", 1.8, K.hayShade);
  return g(x, y, s, d);
}

/** A round haystack, big enough for a turkey to hide behind. */
export function haystack(x, y, s = 1) {
  let d = ground(0, 2, 130);
  d += shape("M-130 0C-140 -80 -90 -170 0 -176C90 -170 140 -80 130 0Z", K.hay, 3.2);
  d += fillOnly("M40 -168C100 -150 140 -80 130 0L70 0C90 -60 80 -130 40 -168Z", K.hayShade, ' opacity=".8"');
  d += ink("M-100 -60l14 -8M-70 -120l12 -6M-30 -150l10 -4M20 -110l12 -6M60 -60l14 -8M-50 -30l12 -4M10 -40l10 -6M-10 -80l12 -6M80 -120l10 -6", 2, K.hayShade);
  return g(x, y, s, d);
}

/** A pumpkin (big ones hide a turkey; small ones are decoration). */
export function pumpkin(x, y, s = 1) {
  let d = ground(0, 2, 70);
  d += shape("M-70 -40C-74 -80 -40 -96 0 -94C40 -96 74 -80 70 -40C68 -10 40 2 0 2C-40 2 -68 -10 -70 -40Z", K.pumpkin, 3);
  d += ink("M-30 -92C-44 -60 -44 -24 -30 0M30 -92C44 -60 44 -24 30 0M0 -94V2", 2.6, K.pumpkinShade);
  d += shape("M-6 -92C-8 -104 -4 -114 6 -118L12 -114C6 -108 6 -100 8 -92Z", K.stem, 2.4);
  d += fillOnly("M40 -86C64 -74 72 -50 68 -30C66 -14 54 -4 40 -2C52 -28 52 -60 40 -86Z", K.pumpkinShade, ' opacity=".6"');
  return g(x, y, s, d);
}

/** A cabbage. */
export function cabbage(x, y, s = 1) {
  let d = ground(0, 2, 46);
  d += shape("M-46 -26C-48 -56 -24 -70 0 -70C24 -70 48 -56 46 -26C44 -6 24 2 0 2C-24 2 -44 -6 -46 -26Z", K.grass, 3);
  d += ink("M0 -70C-14 -50 -14 -20 0 2M0 -70C14 -50 14 -20 0 2M-30 -60C-40 -40 -38 -14 -26 -2M30 -60C40 -40 38 -14 26 -2", 2.2, K.grassShade);
  return g(x, y, s, d);
}

/** A run of wooden fence (w units long), its posts in the ground. */
export function fence(x, y, w = 400, s = 1) {
  let d = "";
  const posts = Math.max(2, Math.round(w / 110) + 1);
  for (let i = 0; i < posts; i++) {
    const px = (w * i) / (posts - 1);
    d += ground(px, 2, 14, 0.15);
    d += shape(`M${n(px - 8)} 0V-118L${n(px)} -126L${n(px + 8)} -118V0Z`, K.wood, 2.6);
  }
  d += shape(`M-10 -104H${n(w + 10)}V-88H-10Z`, K.wood, 2.6) + shape(`M-10 -58H${n(w + 10)}V-42H-10Z`, K.wood, 2.6);
  d += ink(`M0 -96H${n(w)}M0 -50H${n(w)}`, 1.4, K.woodShade);
  return g(x, y, s, d);
}

/** A leafy autumn tree, trunk in the ground. */
export function tree(x, y, s = 1, col = K.accent) {
  let d = ground(0, 2, 60);
  d += shape("M-16 0C-12 -60 -14 -120 -8 -170L8 -170C14 -120 12 -60 16 0Z", K.wood, 3);
  d += ink("M-4 -120L-30 -150M4 -100L28 -126", 6, K.wood) ;
  d += shape("M-90 -190C-110 -230 -80 -280 -40 -280C-30 -320 30 -326 50 -290C90 -296 116 -250 100 -214C116 -180 90 -150 56 -160C40 -136 -10 -136 -30 -156C-70 -146 -100 -160 -90 -190Z", col, 3);
  d += fillOnly("M56 -160C90 -150 116 -180 100 -214C110 -190 96 -170 70 -172C60 -168 58 -164 56 -160Z", K.accentDeep, ' opacity=".7"');
  d += circle(-40, -230, 6, K.accentB, 0) + circle(30, -250, 5, K.accentB, 0) + circle(60, -200, 5, K.accentB, 0);
  return g(x, y, s, d);
}

/** A clump of corn stalks (taller than a farmer), rooted in the ground. */
export function corn(x, y, s = 1) {
  let d = "";
  for (const [dx, h] of [[-30, 430], [0, 470], [30, 440]]) {
    d += ground(dx, 2, 16, 0.15);
    d += ink(`M${dx} 0C${dx - 4} ${-h * 0.4} ${dx + 4} ${-h * 0.7} ${dx} ${-h}`, 10) + ink(`M${dx} 0C${dx - 4} ${-h * 0.4} ${dx + 4} ${-h * 0.7} ${dx} ${-h}`, 5, K.hay);
    for (let k = 0.25; k < 0.95; k += 0.22) {
      const yy = -h * k, side = (Math.round(k * 10) % 2 ? 1 : -1);
      d += shape(`M${dx} ${n(yy)}C${dx + side * 30} ${n(yy - 30)} ${dx + side * 60} ${n(yy - 10)} ${dx + side * 74} ${n(yy + 20)}C${dx + side * 50} ${n(yy)} ${dx + side * 24} ${n(yy + 4)} ${dx} ${n(yy + 10)}Z`, K.hay, 2.2);
    }
    d += shape(`M${dx + 4} ${n(-h * 0.55)}C${dx + 20} ${n(-h * 0.6)} ${dx + 24} ${n(-h * 0.48)} ${dx + 6} ${n(-h * 0.42)}Z`, K.gold, 2);
  }
  return g(x, y, s, d);
}

/** A cloud (in the sky, around its centre). */
export const cloud = (x, y, s = 1) => g(x, y, s, shape("M-80 10C-100 10 -104 -16 -84 -24C-86 -50 -50 -60 -36 -40C-26 -70 24 -72 34 -42C54 -58 90 -44 84 -18C104 -14 100 10 80 10Z", K.light, 2.6));
/** The sun (in the sky). */
export function sun(x, y, r = 50) {
  let d = "";
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    d += `M${n(Math.cos(a) * r * 1.25)} ${n(Math.sin(a) * r * 1.25)}L${n(Math.cos(a) * r * 1.55)} ${n(Math.sin(a) * r * 1.55)}`;
  }
  return g(x, y, 1, ink(d, 5, K.accentB) + circle(0, 0, r, K.accentB, 3));
}

/** A red barn (doors 300 tall), standing on the ground. */
export function barn(x, y, s = 1) {
  let d = ground(0, 4, 300, 0.15);
  d += shape("M-260 0V-330L-180 -440H180L260 -330V0Z", K.barnRed, 3.4);
  d += fillOnly("M180 -440L260 -330V0H200V-330Z", K.barnShade, ' opacity=".7"');
  d += shape("M-290 -320L-180 -470H180L290 -320L270 -310L172 -446H-172L-270 -310Z", K.deep, 3);
  d += shape("M-110 0V-260H110V0Z", K.barnShade, 3) + ink("M-110 -260L110 0M110 -260L-110 0M0 -260V0", 4, K.light) + ink("M-110 -260H110V0H-110Z", 6, K.light);
  d += shape("M-40 -380H40V-320H-40Z", K.deep, 3) + ink("M-40 -350H40M0 -380V-320", 3, K.light);
  for (let yy = -40; yy > -320; yy -= 40) d += ink(`M-256 ${yy}H-114M114 ${yy}H256`, 1.6, K.barnShade);
  return g(x, y, s, d);
}

/** The farmhouse with a porch, a door, windows and a smoking chimney. */
export function farmhouse(x, y, s = 1, o = {}) {
  let d = ground(0, 4, 260, 0.15);
  d += shape("M-220 0V-260H220V0Z", K.cream, 3.2);
  d += fillOnly("M150 -260H220V0H150Z", K.edge, ' opacity=".8"');
  d += shape("M-250 -250L0 -400L250 -250Z", K.dark, 3.4);
  d += shape("M60 -388H110V-322L60 -292Z", K.barnShade, 3) + shape("M54 -396H116V-384H54Z", K.deep, 2.4);   // chimney, standing on the roof
  d += shape("M-40 0V-170H40V0Z", K.wood, 3) + circle(26, -84, 5, K.accentB, 2);   // door
  for (const wx of [-150, 110]) d += shape(`M${wx} -200H${wx + 70}V-120H${wx}Z`, o.glow ? K.accentB : K.paper2, 3) + ink(`M${wx + 35} -200V-120M${wx} -160H${wx + 70}`, 3);
  d += shape("M-240 -150H240V-136H-240Z", K.woodShade, 2.6);   // porch roof
  for (const px of [-230, -80, 80, 230]) d += shape(`M${px - 6} -136V0H${px + 6}V-136Z`, K.wood, 2.4);
  d += shape("M-240 0H240V12H-240Z", K.woodShade, 2.4);   // porch floor
  if (o.smoke !== false) d += ink("M85 -400C70 -430 100 -450 85 -480C70 -510 100 -530 90 -560", 10, K.edge, ' opacity=".9"');   // smoke rises
  return g(x, y, s, d);
}

/** A cartoon kitchen oven (on its feet), with its plug and cord running to a wall socket at `socket`. */
export function oven(x, y, s = 1, o = {}) {
  let d = ground(0, 2, 90);
  d += shape("M-80 0V-200H80V0Z", K.metal, 3) + fillOnly("M50 -200H80V0H50Z", K.metalShade);
  d += shape("M-62 -150H62V-30H-62Z", K.deep, 3) + shape("M-50 -138H50V-42H-50Z", o.on === false ? K.inkSoft : K.accent, 2.4);
  for (const kx of [-50, -20, 10, 40]) d += circle(kx + 5, -176, 9, K.paper, 2.4);
  d += ink("M-60 -30H60", 3) + shape("M-70 0V12H-56V0ZM56 0V12H70V0Z", K.ink, 0);
  if (o.cord) d += ink(o.cord, 5) + ink(o.cord, 2.5, K.inkSoft);
  return g(x, y, s, d);
}

/** A roasting tin with nothing in it (on the ground or a table). */
export const roastingTin = (x, y, s = 1) => g(x, y, s, ground(0, 2, 70) + shape("M-80 -30L80 -30L66 0L-66 0Z", K.metal, 3) + fillOnly("M-72 -12L72 -12L66 0L-66 0Z", K.metalShade) + ink("M-90 -30H90", 5));

/** The Dinner Clock (a big wall clock), around its centre. hand: the hour, 0–12. */
export function clock(x, y, r = 60, hour = 11, minute = 55) {
  let d = circle(0, 0, r, K.paper, 4) + circle(0, 0, r * 0.88, "none", 1.6);
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    d += ink(`M${n(Math.sin(a) * r * 0.74)} ${n(-Math.cos(a) * r * 0.74)}L${n(Math.sin(a) * r * 0.84)} ${n(-Math.cos(a) * r * 0.84)}`, i % 3 ? 2.4 : 4.4);
  }
  const ha = ((hour % 12) + minute / 60) * (Math.PI / 6), ma = minute * (Math.PI / 30);
  d += ink(`M0 0L${n(Math.sin(ha) * r * 0.48)} ${n(-Math.cos(ha) * r * 0.48)}`, 6) + ink(`M0 0L${n(Math.sin(ma) * r * 0.72)} ${n(-Math.cos(ma) * r * 0.72)}`, 4, K.alarm);
  d += circle(0, 0, 5, K.ink, 0);
  return g(x, y, 1, d);
}

/** A six-sided die resting on the ground, showing `face` (kind: white, red or helper). */
export function die(x, y, face = 6, kind = "white", s = 1, tilt = 0) {
  const fill = kind === "red" ? K.alarm : kind === "helper" ? K.wood : K.paper;
  const pip = kind === "white" ? K.ink : K.paper;
  const P = { 1: [[0, 0]], 2: [[-14, -14], [14, 14]], 3: [[-14, -14], [0, 0], [14, 14]], 4: [[-14, -14], [14, -14], [-14, 14], [14, 14]], 5: [[-14, -14], [14, -14], [0, 0], [-14, 14], [14, 14]], 6: [[-14, -16], [14, -16], [-14, 0], [14, 0], [-14, 16], [14, 16]] }[face];
  let d = ground(0, 2, 34) + `<g transform="rotate(${tilt} 0 -30)">` + shape("M-30 -60H30Q34 -60 34 -56V-4Q34 0 30 0H-30Q-34 0 -34 -4V-56Q-34 -60 -30 -60Z", fill, 3);
  for (const [px, py] of P) d += circle(px, py - 30, 5.5, pip, 0);
  return g(x, y, s, d + "</g>");
}

/** A turkey feather lying on the ground (a Feather token, in the story). */
export function feather(x, y, s = 1, col = K.bronze) {
  const d = ground(0, 2, 40) + shape("M-50 -4C-30 -24 10 -34 50 -30C30 -14 -10 -2 -50 -4Z", col, 2.6) + ink("M-56 -2L46 -28", 2.4) + ink("M-20 -12l8 -10M0 -18l8 -9M20 -22l7 -7", 1.6, K.paper);
  return g(x, y, s, d);
}

/** A cow, in profile facing right. */
export function cow(x, y, s = 1, flip = 1) {
  let d = ground(0, 2, 120);
  for (const lx of [-70, -46, 50, 74]) d += limb(`M${lx} -70L${lx} 0`, lx === -46 || lx === 74 ? K.whiteShade : K.white, 16, 3) + shape(`M${lx - 10} -8H${lx + 10}V2H${lx - 10}Z`, K.ink, 0);
  d += shape("M-100 -150C-100 -170 -60 -176 0 -176C60 -176 100 -170 100 -146C102 -100 90 -66 0 -66C-90 -66 -102 -100 -100 -150Z", K.white, 3);
  d += shape("M-60 -170C-30 -176 -10 -160 -20 -130C-40 -110 -70 -120 -76 -140C-78 -156 -70 -166 -60 -170Z", K.ink, 0) + shape("M20 -120C40 -130 60 -120 60 -100C50 -84 24 -86 18 -100Z", K.ink, 0);
  d += shape("M90 -150C110 -170 150 -168 160 -140C168 -116 160 -96 140 -94C120 -92 100 -110 90 -126Z", K.white, 3);
  d += shape("M136 -112C150 -114 166 -106 164 -96C160 -86 140 -86 132 -94Z", K.skinPink, 2.4) + circle(146, -100, 2.5, K.ink, 0) + circle(156, -100, 2.5, K.ink, 0);
  d += circle(128, -140, 5, "#fff", 2) + circle(130, -140, 2.6, K.ink, 0);
  d += shape("M112 -158L104 -178L118 -164Z", K.paper2, 2.2) + shape("M136 -162L140 -182L146 -160Z", K.paper2, 2.2);
  d += ink("M-100 -140C-116 -120 -118 -96 -112 -80", 4) + shape("M-118 -86C-122 -76 -112 -70 -106 -78Z", K.ink, 0);
  d += shape("M-10 -66C-12 -54 12 -54 10 -66Z", K.skinPink, 2.2);
  return g(x, y, s, d, flip);
}

/** A rooster crowing, in profile facing right. */
export function rooster(x, y, s = 1, flip = 1) {
  let d = ground(0, 2, 40);
  d += limb("M-6 -40L-8 0", K.beak, 6, 2.4) + limb("M8 -40L10 0", K.beak, 6, 2.4) + ink("M-8 0l12 0M10 0l12 0", 4, K.beak);
  d += shape("M-40 -90C-60 -130 -50 -150 -30 -140C-36 -120 -30 -100 -26 -90Z", K.green, 2.6) + shape("M-34 -94C-64 -110 -70 -136 -56 -140C-48 -120 -36 -106 -24 -96Z", K.accentDeep, 2.4);
  d += shape("M-30 -80C-30 -110 0 -116 20 -100C34 -88 30 -54 0 -44C-20 -40 -32 -56 -30 -80Z", K.accent, 3);
  d += shape("M10 -100C12 -130 26 -140 36 -136C46 -130 46 -116 36 -106Z", K.accent, 3);
  d += shape("M26 -140C24 -152 32 -156 36 -148C40 -156 48 -152 44 -140Z", K.wattle, 2) + shape("M40 -112C46 -110 46 -100 40 -98Z", K.wattle, 2);
  d += shape("M40 -128L56 -132L42 -122ZM42 -122L54 -116L40 -118Z", K.beak, 2) + circle(32, -128, 3, K.ink, 0);
  d += ink("M62 -136l12 -6M64 -124h14M62 -112l12 6", 3);
  return g(x, y, s, d, flip);
}

/** A rowboat floating on a pond (the pond's surface at y). */
export function pondBoat(x, y, s = 1) {
  let d = ellipse(0, 0, 220, 40, "#8fb3bf", 3) + ink("M-150 -6h40M60 10h50M-40 18h30", 2.4, "#e9f3f6");
  d += shape("M-100 -10C-60 -40 60 -40 110 -24C100 2 -70 8 -100 -10Z", K.wood, 3) + ink("M-90 -16C-40 -30 60 -30 100 -22", 2, K.woodShade);
  d += ink("M-20 -30L-60 10M40 -30L80 10", 4, K.woodShade);
  return g(x, y, s, d);
}

/** A windmill (tower on the ground, four sails); a hat can hang on a sail tip. */
export function windmill(x, y, s = 1, o = {}) {
  let d = ground(0, 4, 120, 0.15);
  d += shape("M-90 0L-60 -360H60L90 0Z", K.cream, 3) + fillOnly("M30 -360H60L90 0H50Z", K.edge, ' opacity=".8"');
  d += shape("M-70 -360L0 -430L70 -360Z", K.dark, 3) + shape("M-26 0V-90H26V0Z", K.wood, 2.6);
  const hub = [0, -340];
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + 0.35, c = Math.cos(a), sn = Math.sin(a);
    const tip = [hub[0] + c * 230, hub[1] + sn * 230];
    const px = -sn * 26, py = c * 26;
    d += shape(`M${n(hub[0] + c * 30)} ${n(hub[1] + sn * 30)}L${n(tip[0])} ${n(tip[1])}L${n(tip[0] + px)} ${n(tip[1] + py)}L${n(hub[0] + c * 40 + px)} ${n(hub[1] + sn * 40 + py)}Z`, K.paper2, 2.6);
    d += ink(`M${n(hub[0])} ${n(hub[1])}L${n(tip[0])} ${n(tip[1])}`, 4, K.wood);
    if (o.hat && i === 0) d += hatOn(tip[0] + 6, tip[1] + 4);
  }
  d += circle(hub[0], hub[1], 14, K.wood, 3);
  return g(x, y, s, d);
}

/** Farmer Windle's cap, hooked on something by its peak. */
const hatOn = (x, y) => shape(`M${n(x - 30)} ${n(y + 30)}C${n(x - 32)} ${n(y + 4)} ${n(x - 16)} ${n(y - 6)} ${n(x + 4)} ${n(y - 6)}C${n(x + 24)} ${n(y - 6)} ${n(x + 32)} ${n(y + 10)} ${n(x + 30)} ${n(y + 30)}Z`, K.wood, 3) + shape(`M${n(x - 4)} ${n(y - 4)}L${n(x + 8)} ${n(y - 24)}L${n(x + 16)} ${n(y - 4)}Z`, K.woodShade, 2.4);

/** A garden rake lying on the ground; `up` stands it on end (THWACK!). */
export function rake(x, y, s = 1, up = false) {
  const d = up
    ? ground(0, 2, 30) + shape("M-30 -6H30V6H-30Z", K.metal, 2.4) + ink("M-24 6v-14M-12 6v-14M0 6v-14M12 6v-14M24 6v-14", 3) + limb("M0 0L60 -280", K.wood, 8, 2.6)
    : ground(0, 2, 120) + limb("M-120 -4L100 -4", K.wood, 8, 2.6) + shape("M100 -24V16H112V-24Z", K.metal, 2.4);
  return g(x, y, s, d);
}

/** A scarecrow on its post, dressed in an old hat and shirt. */
export function scarecrow(x, y, s = 1) {
  let d = ground(0, 2, 40) + limb("M0 0V-300", K.wood, 12, 3) + limb("M-110 -230H110", K.wood, 10, 3);
  d += shape("M-80 -250H80L70 -150H-70Z", K.flannel, 3) + ink("M-80 -220H80M-76 -190H76M-40 -250V-150M0 -250V-150M40 -250V-150", 2, K.flannelShade);
  d += circle(0, -290, 34, K.paper2, 3) + ink("M-12 -296l8 8m0 -8l-8 8M12 -296l-8 8m0 -8l8 8", 3) + ink("M-14 -276q14 8 28 0", 2.6);
  d += shape("M-56 -316C-30 -324 30 -324 56 -316C44 -308 -44 -308 -56 -316Z", K.hay, 3) + shape("M-28 -318C-28 -344 28 -344 28 -318Z", K.hay, 3);
  d += ink("M-110 -230l-14 8M-110 -230l-14 -6M110 -230l14 8M110 -230l14 -6", 3, K.hay);
  return g(x, y, s, d);
}

/** A small field mouse (Big Tom is terrified of them). */
export const mouse = (x, y, s = 1, flip = 1) => g(x, y, s, ground(0, 2, 16) + ink("M-14 -6C-30 -4 -36 -14 -44 -10", 2) + shape("M-16 -2C-18 -18 0 -24 14 -14C20 -10 22 -4 18 0Z", K.grey, 2.4) + circle(6, -20, 5, K.grey, 2) + circle(12, -12, 1.8, K.ink, 0) + circle(21, -5, 2, K.ink, 0), flip);

/** A big “Huh?” speech bubble shape with no words (the book prints the word, never the art). */
export const huhBubble = (x, y, s = 1) => g(x, y, s, shape("M-40 -30C-40 -50 40 -50 40 -30V0C40 14 10 14 0 14L-10 28L-12 14C-30 14 -40 10 -40 0Z", K.light, 2.6) + ink("M-6 -28C-6 -38 12 -38 10 -26C8 -18 0 -18 0 -10M0 2v1", 4));

/** Rolling hills on the horizon (a filled band across the whole width). */
export const hills = (w, y, col = K.grass, shade = K.grassShade) => shape(`M0 ${y}C${n(w * 0.15)} ${y - 50} ${n(w * 0.3)} ${y - 40} ${n(w * 0.45)} ${y - 10}C${n(w * 0.6)} ${y - 60} ${n(w * 0.8)} ${y - 50} ${n(w)} ${y - 20}V${y + 400}H0Z`, col, 3) + fillOnly(`M0 ${y + 40}C${n(w * 0.3)} ${y + 20} ${n(w * 0.7)} ${y + 30} ${n(w)} ${y + 10}V${y + 400}H0Z`, shade, ' opacity=".35"');
/** A strip of grass tufts along a ground line. */
export function tufts(x0, x1, y, seed = 3) {
  let d = "", r = seed;
  for (let x = x0; x < x1; x += 34) { r = (r * 9301 + 49297) % 233280; const k = r / 233280; d += `M${n(x)} ${y}l${n(4 + k * 4)} -${n(10 + k * 8)}M${n(x + 6)} ${y}l${n(2)} -${n(14 + k * 6)}M${n(x + 12)} ${y}l-${n(3 + k * 3)} -${n(9 + k * 6)}`; }
  return ink(d, 2.4, K.grassShade);
}
