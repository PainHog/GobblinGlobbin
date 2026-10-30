// The farm folk: three farmers and the farmer's kid, front view, around their feet
// at (0,0). A farmer stands about 410 units tall (a tom is about 260), so a turkey
// comes up to his belt (ART-CHECKLIST §12). Hands have four fingers and a thumb (§9).
import { K, n, shape, fillOnly, ink, limb, circle, ellipse, ground, place, burst } from "./core.mjs";

export const FOLK = {
  bramble: { name: "Farmer Bramble", hat: "straw", shirt: K.flannel, shirtShade: K.flannelShade, legs: K.denim, legsShade: K.denimShade, bib: true, boots: K.woodShade, hair: K.grey, mustache: true },
  puddlewick: { name: "Farmer Puddlewick", hat: "rain", shirt: K.green, shirtShade: K.greenShade, legs: K.denim, legsShade: K.denimShade, bib: true, boots: K.rubber, hair: K.hair, beard: true },
  windle: { name: "Farmer Windle", hat: "cap", shirt: K.gold, shirtShade: K.goldShade, legs: K.woodShade, legsShade: K.deep, bib: false, jacket: true, boots: K.deep, hair: K.hair, scarf: true, glasses: true }
};

/** A cartoon hand (front view): palm, four fingers and a thumb on the inner side. side = -1 left hand, 1 right. */
export function hand(x, y, side = 1, a = 0, col = K.skin, s = 1) {
  const f = [];
  for (let i = 0; i < 4; i++) {
    const fx = -7 + i * 4.7;
    f.push(`M${n(fx)} -2v-${n(i === 0 || i === 3 ? 9 : 11)}`);
  }
  const palm = ellipse(0, 4, 10, 10, col, 2.6);
  const fingers = f.map(d => ink(d, 7.2) + ink(d, 3.6, col)).join("");
  const thumb = ink(`M${n(-8 * side * -1)} 6l${n(9 * side * -1)} -8`, 7.2) + ink(`M${n(-8 * side * -1)} 6l${n(9 * side * -1)} -8`, 3.6, col);
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(a)}) scale(${n(s)})">${fingers}${palm}${thumb}</g>`;
}

/**
 * A farmer. pose: "stand" | "search" (right hand shading his eyes) | "listen" (right hand cupped at his ear: "Huh?")
 * | "pan" (holding a roasting tin in both hands) | "point" (right arm out) | "shrug" (both arms up: Too Late).
 */
export function farmer(id, o = {}) {
  const f = FOLK[id];
  const pose = o.pose ?? "stand";
  let s = ground(0, 2, 70);
  // boots
  for (const side of [-1, 1]) {
    const bx = side * 24;
    s += shape(`M${n(bx - 16)} -34L${n(bx + 14)} -34L${n(bx + 16)} -10C${n(bx + 28 * side + (side < 0 ? 0 : 0))} -10 ${n(bx + 30 * side)} -2 ${n(bx + 26 * side)} 0L${n(bx - 18 * side)} 0Z`, f.boots, 3);
  }
  // legs
  s += shape("M-44 -176L-4 -176L-6 -34L-40 -34Z", f.legs, 3) + shape("M4 -176L44 -176L40 -34L6 -34Z", f.legs, 3);
  s += fillOnly("M-44 -176L-30 -176L-28 -34L-40 -34Z", f.legsShade, ' opacity=".6"');
  // torso (shirt or jacket)
  s += shape("M-60 -292C-64 -250 -60 -200 -50 -168L50 -168C60 -200 64 -250 60 -292C40 -304 -40 -304 -60 -292Z", f.shirt, 3);
  if (f.shirt === K.flannel || f.shirt === K.green) s += ink("M-56 -270H56M-58 -238H58M-56 -206H56M-30 -296V-170M0 -300V-170M30 -296V-170", 2, f.shirtShade, ' opacity=".7"');
  if (f.bib) {
    s += shape("M-36 -248L36 -248L46 -168L-46 -168Z", f.legs, 3);
    s += ink("M-34 -248L-46 -294M34 -248L46 -294", 8) + ink("M-34 -248L-46 -294M34 -248L46 -294", 4, f.legs);
    s += circle(-30, -244, 4, K.accentB, 2) + circle(30, -244, 4, K.accentB, 2);
    s += shape("M-14 -232H14V-210H-14Z", f.legsShade, 2);
  }
  if (f.jacket) s += ink("M0 -298V-170", 3) + circle(-8, -262, 3, K.ink, 0) + circle(-8, -230, 3, K.ink, 0) + circle(-8, -198, 3, K.ink, 0);
  // belt line
  s += ink("M-50 -172H50", 3);
  // arms + hands
  const arm = (side, d, hx, hy, ha) => limb(d, f.shirt, 24, 3) + hand(hx, hy, side, ha);
  const L = -1, R = 1;
  const armsDown = () => arm(L, "M-56 -284C-70 -250 -74 -210 -72 -186", -72, -176, 0) + arm(R, "M56 -284C70 -250 74 -210 72 -186", 72, -176, 0);
  if (pose === "stand") s += armsDown();
  if (pose === "search") s += arm(L, "M-56 -284C-70 -250 -74 -210 -72 -186", -72, -176, 0) + arm(R, "M56 -284C82 -300 70 -350 38 -356", 30, -364, -100);
  if (pose === "listen") s += arm(L, "M-56 -284C-70 -250 -74 -210 -72 -186", -72, -176, 0) + arm(R, "M56 -284C88 -300 86 -330 64 -340", 58, -348, -60);
  if (pose === "point") s += arm(L, "M-56 -284C-70 -250 -74 -210 -72 -186", -72, -176, 0) + arm(R, "M56 -284C90 -280 120 -276 146 -272", 158, -272, 90);
  if (pose === "shrug") s += arm(L, "M-56 -284C-90 -284 -104 -310 -100 -332", -100, -344, -10) + arm(R, "M56 -284C90 -284 104 -310 100 -332", 100, -344, 10);
  if (pose === "pan") {
    s += limb("M-56 -284C-70 -250 -66 -222 -48 -214", f.shirt, 24, 3) + limb("M56 -284C70 -250 66 -222 48 -214", f.shirt, 24, 3);
    s += shape("M-78 -226L78 -226L66 -196L-66 -196Z", K.metal, 3) + fillOnly("M-70 -206L70 -206L66 -196L-66 -196Z", K.metalShade) + ink("M-78 -226H78", 4);
    s += hand(-44, -224, L, 0) + hand(44, -224, R, 0);
  }
  // neck + head
  s += shape("M-14 -310L14 -310L12 -296L-12 -296Z", K.skinShade, 2.5);
  s += circle(-44, -344, 10, K.skin, 2.6) + circle(44, -344, 10, K.skin, 2.6);   // two ears
  s += ellipse(0, -346, 42, 46, K.skin, 3);
  // hair at the sides
  s += fillOnly("M-42 -350C-44 -334 -40 -318 -34 -312L-30 -330C-34 -336 -36 -344 -36 -352Z", f.hair) + fillOnly("M42 -350C44 -334 40 -318 34 -312L30 -330C34 -336 36 -344 36 -352Z", f.hair);
  // face
  const look = o.look ?? 0;
  for (const side of [-1, 1]) {
    s += ellipse(side * 15, -354, 8.5, 10, "#fff", 2.4) + circle(side * 15 + look * 3.5, -352, 4.2, K.ink, 0) + circle(side * 15 + look * 3.5 - 1.2, -354, 1.2, "#fff", 0);
    s += ink(`M${n(side * 22)} -370L${n(side * 8)} ${o.mood === "cross" ? -366 : -372}`, 3.4, f.hair);
  }
  if (f.glasses) s += circle(-15, -354, 13, "none", 2.4) + circle(15, -354, 13, "none", 2.4) + ink("M-2 -356H2", 2.4);
  s += ellipse(0, -338, 9, 8, K.skinShade, 2.4);   // nose
  if (f.beard) s += shape("M-36 -336C-34 -306 -18 -292 0 -292C18 -292 34 -306 36 -336C24 -322 10 -318 0 -318C-10 -318 -24 -322 -36 -336Z", f.hair, 2.6);
  if (f.mustache) s += shape("M-24 -326C-14 -334 -4 -330 0 -326C4 -330 14 -334 24 -326C20 -318 8 -318 0 -322C-8 -318 -20 -318 -24 -326Z", f.hair, 2.4);
  const mouth = o.mouth ?? (pose === "shrug" ? "o" : "smile");
  if (mouth === "smile") s += ink("M-10 -314Q0 -306 10 -314", 2.6);
  if (mouth === "o") s += ellipse(0, -312, 5, 6, K.deep, 2);
  if (mouth === "grin") s += shape("M-14 -316Q0 -300 14 -316Z", "#fff", 2.4);
  // hats (o.noHat: blown away, or hooked on a windmill)
  if (o.noHat) s += fillOnly("M-36 -380C-30 -396 30 -396 36 -380C30 -386 -30 -386 -36 -380Z", f.hair) + ink("M-34 -380C-28 -394 28 -394 34 -380", 3);
  else if (f.hat === "straw") {
    s += shape("M-82 -378C-60 -390 60 -390 82 -378C70 -370 -70 -370 -82 -378Z", K.hay, 3);
    s += shape("M-40 -380C-42 -404 -30 -418 0 -418C30 -418 42 -404 40 -380Z", K.hay, 3);
    s += fillOnly("M-41 -392H41V-384H-41Z", K.flannel) + ink("M-41 -392H41M-41 -384H41", 2);
    s += ink("M-70 -380l-6 -2M-50 -384l-6 -2M40 -386l6 -2M62 -382l6 -2", 1.6, K.hayShade);
  }
  if (!o.noHat && f.hat === "rain") {
    // a sou'wester: the dome sits above the eyebrows, the brim slopes down at the sides
    s += shape("M-40 -376C-42 -406 -24 -422 0 -422C24 -422 42 -406 40 -376Z", K.rubber, 3);
    s += shape("M-48 -380C-24 -388 24 -388 48 -380C62 -372 74 -350 72 -330C62 -334 54 -350 44 -370C20 -376 -20 -376 -44 -370C-54 -350 -62 -334 -72 -330C-74 -350 -62 -372 -48 -380Z", K.rubber, 3);
    s += fillOnly("M-40 -386H40V-380H-40Z", K.rubberShade);
  }
  if (!o.noHat && f.hat === "cap") {
    s += shape("M-42 -370C-44 -396 -24 -408 0 -408C24 -408 44 -396 42 -370Z", K.wood, 3);
    s += shape("M-46 -372C-20 -380 30 -380 58 -368C52 -360 -30 -362 -46 -366Z", K.woodShade, 3);
  }
  if (f.scarf) {
    s += shape("M-40 -306C-20 -296 20 -296 40 -306L36 -290C20 -282 -20 -282 -36 -290Z", K.alarm, 2.6);
    s += shape("M24 -294C44 -290 70 -296 92 -306L96 -294C74 -280 48 -276 26 -280Z", K.alarm, 2.6);   // blowing in the wind
  }
  if (o.fx?.includes("huh")) s += burst(66, -370, 18, 34, 5, -120, -20);
  return s;
}

/** The farmer's kid (front view, about 250 units tall): cap, striped jumper, jeans, trainers. */
export function kid(o = {}) {
  const pose = o.pose ?? "stand";
  let s = ground(0, 2, 44);
  for (const side of [-1, 1]) s += shape(`M${n(side * 16 - 12)} -18L${n(side * 16 + 12)} -18L${n(side * 16 + 14 * side)} 0L${n(side * 16 - 14 * side)} 0Z`, K.white, 2.6) + ink(`M${n(side * 16 - 12)} -6H${n(side * 16 + 12)}`, 2, K.alarm);
  s += shape("M-30 -110L-2 -110L-4 -18L-26 -18Z", K.denim, 2.6) + shape("M2 -110L30 -110L26 -18L4 -18Z", K.denim, 2.6);
  s += shape("M-38 -186C-40 -160 -38 -132 -32 -108L32 -108C38 -132 40 -160 38 -186C24 -194 -24 -194 -38 -186Z", K.pumpkin, 2.8);
  s += ink("M-38 -170H38M-39 -150H39M-37 -130H37", 4, K.cream);
  const armL = "M-36 -180C-48 -160 -50 -136 -48 -120", armR = pose === "point" ? "M36 -180C60 -176 80 -172 96 -170" : pose === "wave" ? "M36 -180C54 -190 58 -212 54 -228" : "M36 -180C48 -160 50 -136 48 -120";
  s += limb(armL, K.pumpkin, 16, 2.6) + limb(armR, K.pumpkin, 16, 2.6);
  s += hand(-48, -112, -1, 0, K.skin, 0.75);
  s += pose === "point" ? hand(104, -170, 1, 90, K.skin, 0.75) : pose === "wave" ? hand(54, -236, 1, 180, K.skin, 0.75) : hand(48, -112, 1, 0, K.skin, 0.75);
  s += circle(-30, -214, 7, K.skin, 2.2) + circle(30, -214, 7, K.skin, 2.2);
  s += ellipse(0, -216, 30, 32, K.skin, 2.8);
  for (const side of [-1, 1]) s += ellipse(side * 11, -220, 6, 7, "#fff", 2) + circle(side * 11, -219, 3, K.ink, 0);
  s += ink("M-16 -206l2 1M-12 -203l2 1M12 -203l2 1M16 -206l2 1", 2, K.accentDeep);   // freckles
  s += o.mouth === "o" ? ellipse(0, -199, 4.5, 5.5, K.deep, 1.8) : ink("M-8 -201Q0 -194 8 -201", 2.4);
  s += shape("M-30 -232C-30 -254 -16 -262 0 -262C16 -262 30 -254 30 -232Z", K.alarm, 2.8);
  s += shape("M-6 -236C10 -240 32 -238 46 -232C40 -226 10 -226 -6 -230Z", K.alarm, 2.6);
  if (o.fx?.includes("yell")) s += burst(0, -200, 40, 60, 7, -150, -30);
  return s;
}

export const placeFarmer = (id, x, y, s = 1, o = {}) => place(x, y, s, 1, farmer(id, o));
export const placeKid = (x, y, s = 1, o = {}) => place(x, y, s, 1, kid(o));
