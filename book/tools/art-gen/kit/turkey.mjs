// The eight turkeys (book art and VTT tokens). Drawn in profile facing right,
// around their feet on the ground at (0,0); a tom stands about 230 units tall.
// Every marking is the same on both sides of the bird, so a turkey facing left
// is the same drawing mirrored (ART-CHECKLIST §10). Anatomy per §21: snood,
// wattle, caruncles, two legs with three toes forward and one back; toms and
// jakes have a beard, toms have spurs.
import { K, n, shape, fillOnly, ink, limb, circle, ellipse, ground, place, rot, P, burst, drop, bubble, motion } from "./core.mjs";

/** Each turkey's look. bars = barred wings; edge = feather edging; scarf = Gizmo's knitted scarf. */
export const BIRDS = {
  butterbean: { name: "Butterbean", bird: "hen", body: K.chestnut, shade: K.chestnutShade, wing: K.white, wingShade: K.whiteShade, tail: K.white, tailBand: K.chestnut, head: K.skinPink, size: 0.86 },
  pip: { name: "Pip", bird: "jake", body: K.steel, shade: K.steelShade, wing: K.white, wingShade: K.whiteShade, bars: K.black, tail: K.steel, tailBand: K.tan, edge: K.black, head: K.skinBlue, size: 0.78 },
  duchess: { name: "Duchess", bird: "hen", body: K.white, shade: K.whiteShade, wing: K.white, wingShade: K.whiteShade, tail: K.white, tailBand: K.black, edge: K.black, head: K.skinPink, size: 0.88 },
  bigtom: { name: "Big Tom", bird: "tom", body: K.bronze, shade: K.bronzeShade, wing: K.bronze, wingShade: K.bronzeShade, bars: K.white, tail: K.bronze, tailBand: K.black, tailTip: K.white, sheen: K.copper, head: K.skinBlue, size: 1.12 },
  noodle: { name: "Noodle", bird: "jake", body: K.white, shade: K.whiteShade, wing: K.white, wingShade: K.whiteShade, tail: K.white, tailBand: K.whiteShade, head: K.skinBlue, size: 0.84, legs: 1.35 },
  clementine: { name: "Clementine", bird: "hen", body: K.slate, shade: K.slateShade, wing: K.slate, wingShade: K.slateShade, tail: K.slate, tailBand: K.slateShade, flecks: K.slateShade, head: K.skinPink, size: 0.88 },
  gizmo: { name: "Gizmo", bird: "tom", body: K.black, shade: K.blackShade, wing: K.black, wingShade: K.blackShade, tail: K.black, tailBand: K.blackShade, sheen: K.sheen, head: K.skinBlue, size: 1.04, scarf: true },
  hazel: { name: "Hazel", bird: "hen", body: K.choc, shade: K.chocShade, wing: K.choc, wingShade: K.chocShade, tail: K.choc, tailBand: K.chocShade, head: K.skinPink, size: 0.86, bigEyes: true }
};

const POSES = {
  //            body tilt, body drop, head [x,y], near foot, far foot, near knee, beak open, wing
  stand:   { tilt: 0,   drop: 0,  head: [60, -186], near: [12, 0], far: [-12, 0] },
  sneak:   { tilt: 10,  drop: 12, head: [84, -158], near: [36, -22], far: [-14, 0], nearKnee: [30, -46], eyes: "sly" },
  run:     { tilt: 18,  drop: 6,  head: [86, -166], near: [50, -6], far: [-44, -10], nearKnee: [34, -36], farKnee: [-24, -34] },
  gobble:  { tilt: -8,  drop: 0,  head: [56, -198], near: [12, 0], far: [-12, 0], open: true },
  proud:   { tilt: -10, drop: -2, head: [50, -198], near: [14, 0], far: [-12, 0], fan: true, chest: true },
  crouch:  { tilt: 4,   drop: 30, head: [70, -140], near: [16, 0], far: [-12, 0] },
  peek:    { tilt: -4,  drop: 0,  head: [68, -198], near: [12, 0], far: [-12, 0] },
  zen:     { tilt: -4,  drop: 0,  head: [56, -190], near: [6, 0], far: [-6, -36], farKnee: [8, -42] }
};

// A plump, round body with a full breast forward; feathered underside.
const BODY = "M-56 -120C-46 -154 -6 -164 28 -152C58 -142 76 -112 72 -84C68 -56 42 -40 8 -38C-26 -36 -54 -50 -62 -76C-66 -92 -62 -108 -56 -120Z";
const BODY_SHADE = "M-62 -76C-54 -50 -26 -36 8 -38C42 -40 68 -56 72 -84C72 -78 70 -72 66 -66C52 -54 30 -48 6 -48C-24 -48 -46 -58 -58 -74C-60 -75 -61 -76 -62 -76Z";
// A folded wing low on the side, primaries sweeping back.
const WING = "M-40 -122C-6 -132 26 -122 34 -100C38 -84 26 -70 6 -66C-14 -62 -36 -64 -58 -72C-64 -74 -66 -80 -62 -84C-56 -100 -50 -114 -40 -122Z";
// The folded tail: a drooping fan behind, with scalloped feather tips.
const TAIL = "M-54 -124C-84 -132 -112 -120 -128 -98C-136 -86 -138 -74 -134 -66C-128 -60 -122 -64 -118 -60C-112 -56 -106 -62 -100 -58C-92 -54 -86 -60 -80 -58C-72 -56 -64 -62 -56 -66Z";

/** The fanned tail of a displaying tom (or Duchess posing): drawn behind the body. */
function fan(b, cx = -18, cy = -118, R = 112, count = 13) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const a = 200 + (140 * i) / (count - 1);
    const rad = (a * Math.PI) / 180, w = 0.13;
    const tip = [cx + Math.cos(rad) * R, cy + Math.sin(rad) * R];
    const l = [cx + Math.cos(rad - w) * R * 0.94, cy + Math.sin(rad - w) * R * 0.94];
    const r = [cx + Math.cos(rad + w) * R * 0.94, cy + Math.sin(rad + w) * R * 0.94];
    const d = `M${n(cx)} ${n(cy)}L${P(l)}Q${P([tip[0] + Math.cos(rad) * 8, tip[1] + Math.sin(rad) * 8])} ${P(r)}Z`;
    s += shape(d, b.tail, 2.5);
    // band near the tip, and a pale tip on bronze birds
    const band = (k1, k2, col) => {
      const p1 = [cx + Math.cos(rad - w * 0.9) * R * k1, cy + Math.sin(rad - w * 0.9) * R * k1];
      const p2 = [cx + Math.cos(rad + w * 0.9) * R * k1, cy + Math.sin(rad + w * 0.9) * R * k1];
      const p3 = [cx + Math.cos(rad + w * 0.92) * R * k2, cy + Math.sin(rad + w * 0.92) * R * k2];
      const p4 = [cx + Math.cos(rad - w * 0.92) * R * k2, cy + Math.sin(rad - w * 0.92) * R * k2];
      return fillOnly(`M${P(p1)}L${P(p2)}L${P(p3)}L${P(p4)}Z`, col);
    };
    s += band(0.78, 0.88, b.tailBand);
    if (b.tailTip) s += band(0.9, 0.97, b.tailTip);
    s += ink(`M${n(cx)} ${n(cy)}L${P([cx + Math.cos(rad) * R * 0.92, cy + Math.sin(rad) * R * 0.92])}`, 1.4, K.ink, ' opacity=".35"');
  }
  return s;
}

/** One leg: hip → (knee) → ankle, then the foot: three toes forward, one back (and a spur on toms). */
function leg(hip, foot, knee, tom, col, lift) {
  const pts = knee ? [hip, knee, foot] : [hip, foot];
  let s = limb(`M${pts.map(P).join("L")}`, col, 9, 2.8);
  const [fx, fy] = foot;
  const toes = lift
    ? [[fx + 14, fy + 18], [fx + 9, fy + 20], [fx + 4, fy + 19]]   // a lifted foot: toes hang down
    : [[fx + 30, fy + 1], [fx + 25, fy + 4], [fx + 21, fy - 2]];
  const back = lift ? [fx - 7, fy + 11] : [fx - 13, fy + 1];
  for (const t of toes) s += limb(`M${P(foot)}L${P(t)}`, col, 5, 2.2);
  s += limb(`M${P(foot)}L${P(back)}`, col, 5, 2.2);
  if (tom) {
    const a = knee ?? hip, m = [(a[0] + fx) / 2, (a[1] + fy) / 2 + 6];
    s += shape(`M${P([m[0] - 2, m[1] - 4])}L${P([m[0] - 10, m[1]])}L${P([m[0] - 2, m[1] + 3])}Z`, K.legShade, 1.6);
  }
  return s;
}

/**
 * A turkey. id: one of BIRDS. o: { pose, eyes: "open"|"wide"|"worried"|"closed"|"sly"|"happy",
 * look: pupil shift -1..1, mouth: open beak, fx: extra gags ["sweat","hiccup","burst","motion","zzz"] }.
 * Returns SVG drawn around the feet; place it with `turkey(...)` below.
 */
export function bird(id, o = {}) {
  const b = BIRDS[id];
  const pose = POSES[o.pose ?? "stand"];
  const tom = b.bird === "tom", jake = b.bird === "jake", hen = b.bird === "hen";
  const legLen = b.legs ?? 1;
  const lift = -(legLen - 1) * 48 + pose.drop;   // long legs raise the body
  const centre = [0, -100];
  // body frame → world: rotate by tilt about the body centre, then lift
  const W = p => { const r = rot(p, pose.tilt, centre); return [r[0], r[1] + lift]; };
  const tf = `transform="translate(0 ${n(lift)}) rotate(${pose.tilt} 0 -100)"`;
  const H = [pose.head[0], pose.head[1] + lift * 0.9];
  let s = "";
  s += ground(0, 2, 62 * (tom ? 1.1 : 1));
  // tail
  const fanned = (pose.fan || o.fan) && (tom || id === "duchess");
  if (fanned) s += `<g ${tf}>${fan(b)}</g>`;
  // far leg behind the body
  const hipFar = W([-10, -48]), hipNear = W([12, -46]);
  s += leg(hipFar, pose.far, pose.farKnee ?? null, tom, K.legShade, pose.far[1] < -2);
  if (!fanned) s += `<g ${tf}>${shape(TAIL, b.tail, 3)}${tailMarks(b)}</g>`;
  // neck (bare skin), drawn before the body so the feathers overlap its base
  const nb = W([36, -142]);
  const neck = `M${P([nb[0] - 18, nb[1] + 6])}C${P([nb[0] - 8, nb[1] - 18])} ${P([H[0] - 18, H[1] + 22])} ${P([H[0] - 13, H[1] + 4])}L${P([H[0] + 8, H[1] + 12])}C${P([H[0] + 4, H[1] + 28])} ${P([nb[0] + 18, nb[1] - 12])} ${P([nb[0] + 20, nb[1] + 10])}Z`;
  s += shape(neck, b.head, 3);
  // caruncles down the front of the neck
  for (let i = 0; i < 4; i++) {
    const t = 0.25 + i * 0.18, p = [H[0] + 4 + (nb[0] + 14 - H[0] - 4) * t, H[1] + 12 + (nb[1] - 4 - H[1] - 12) * t];
    s += circle(p[0] + 2, p[1], 5 - i * 0.5, K.wattle, 1.8);
  }
  // body
  s += `<g ${tf}>`;
  s += shape(BODY, b.body, 3.2);
  s += fillOnly(BODY_SHADE, b.shade, ' opacity=".85"');
  if (b.sheen) s += fillOnly("M-30 -148C0 -160 30 -152 46 -136C58 -124 64 -110 66 -98C52 -120 24 -140 -30 -148Z", b.sheen, ' opacity=".85"');
  s += featherRows(b);
  if (b.edge) s += scallops(b.edge, b.bird === "jake" ? 0.6 : 1);
  if (b.flecks) s += flecks(b.flecks);
  // ruff where the feathers meet the neck
  s += ink("M18 -150C24 -142 28 -140 34 -146C36 -138 42 -134 50 -136C52 -130 58 -126 64 -128", 2.4);
  // wing (raised to "shh" when sneaking)
  if (!pose.shh) { s += shape(WING, b.wing, 3); s += wingMarks(b); }
  s += `</g>`;
  if (pose.shh) {
    // the wing tip held up to the beak: shh!
    const w = `M${P(W([-30, -120]))}C${P(W([10, -150]))} ${P([H[0] + 2, H[1] + 30])} ${P([H[0] + 22, H[1] + 2])}C${P([H[0] + 10, H[1] + 20])} ${P(W([30, -100]))} ${P(W([-40, -88]))}Z`;
    s += shape(w, b.wing, 3);
    if (b.bars) s += ink(`M${P(W([-20, -112]))}L${P(W([-10, -98]))}M${P(W([-4, -118]))}L${P(W([6, -104]))}`, 3, b.bars);
  }
  // beard on toms and jakes
  if (tom || jake) {
    // a tassel of bristles hanging from the breast
    const bt = W([64, -118]), len = tom ? 38 : 16, w = tom ? 6 : 4;
    s += shape(`M${P([bt[0] - w, bt[1]])}C${P([bt[0] - w, bt[1] + len * 0.5])} ${P([bt[0] - 2, bt[1] + len * 0.9])} ${P([bt[0] + 4, bt[1] + len])}C${P([bt[0] + 6, bt[1] + len * 0.7])} ${P([bt[0] + w, bt[1] + len * 0.4])} ${P([bt[0] + w, bt[1]])}Z`, K.black, 2);
    s += ink(`M${P([bt[0] - 1, bt[1] + 4])}L${P([bt[0] + 2, bt[1] + len * 0.85])}M${P([bt[0] + 3, bt[1] + 4])}L${P([bt[0] + 4, bt[1] + len * 0.7])}`, 1.2, "#5a5450");
  }
  // Gizmo's knitted scarf (the same on both sides: a band and two ends hanging at the front)
  if (b.scarf) {
    const a = W([20, -152]), c = W([50, -140]);
    s += shape(`M${P([a[0] - 4, a[1] - 6])}Q${P([(a[0] + c[0]) / 2, a[1] - 18])} ${P([c[0] + 6, c[1] - 8])}L${P([c[0] + 4, c[1] + 6])}Q${P([(a[0] + c[0]) / 2, a[1] - 2])} ${P([a[0] - 2, a[1] + 8])}Z`, K.pumpkin, 2.6);
    s += shape(`M${P([c[0] - 2, c[1]])}L${P([c[0] + 6, c[1] + 26])}L${P([c[0] - 6, c[1] + 28])}L${P([c[0] - 8, c[1] + 2])}Z`, K.pumpkin, 2.4);
    s += ink(`M${P([c[0] - 6, c[1] + 12])}L${P([c[0] + 3, c[1] + 11])}M${P([c[0] - 6, c[1] + 20])}L${P([c[0] + 4, c[1] + 19])}`, 2, K.pumpkinShade);
  }
  // near leg in front
  s += leg(hipNear, pose.near, pose.nearKnee ?? null, tom, K.leg, pose.near[1] < -2);
  // head
  s += headDraw(b, H, o, pose, tom, hen);
  // gags
  const fx = o.fx ?? [];
  if (fx.includes("sweat")) s += drop(H[0] - 22, H[1] - 14, 1.1) + drop(H[0] - 32, H[1] + 2, 0.8);
  if (fx.includes("hiccup")) s += bubble(H[0] + 30, H[1] - 26, 7) + bubble(H[0] + 40, H[1] - 44, 5) + bubble(H[0] + 46, H[1] - 58, 3.5);
  if (fx.includes("burst") || pose.open) s += burst(H[0] + 26, H[1] + 2, 30, 50, 7, -60, 60);
  if (fx.includes("motion")) s += motion(-80, -120 + lift, 46, 3, 18);
  if (fx.includes("zzz")) s += ink(`M${P([H[0] + 18, H[1] - 34])}h10l-10 10h10M${P([H[0] + 34, H[1] - 52])}h7l-7 7h7`, 2.4);
  return s;
}

/** Rows of feather scallops on the breast and flank (shade colour), the turkey's texture. */
function featherRows(b) {
  if (b.edge) return "";
  let d = "";
  const rows = [[16, -128, 3], [26, -112, 3], [30, -96, 3], [22, -80, 4], [-30, -70, 4]];
  for (const [x0, y, count] of rows) for (let i = 0; i < count; i++) {
    const x = x0 + i * 12;
    d += `M${n(x - 6)} ${n(y)}Q${n(x)} ${n(y + 7)} ${n(x + 6)} ${n(y)}`;
  }
  return ink(d, 2.2, b.shade, ' opacity=".9"');
}

function tailMarks(b) {
  let s = fillOnly("M-118 -104C-126 -96 -132 -84 -134 -66C-128 -60 -122 -64 -118 -60C-112 -56 -106 -62 -100 -58C-102 -74 -108 -92 -118 -104Z", b.tailBand, ' opacity=".95"');
  s += ink("M-58 -116C-86 -116 -110 -102 -124 -80M-58 -100C-82 -98 -102 -88 -112 -66M-58 -84C-74 -82 -88 -74 -94 -60", 1.8, K.ink, ' opacity=".4"');
  return s;
}

function wingMarks(b) {
  let s = fillOnly("M-58 -72C-36 -64 -14 -62 6 -66C26 -70 38 -84 34 -100C32 -90 22 -80 4 -76C-18 -72 -40 -74 -60 -80Z", b.wingShade);
  // barring runs across the feathers: bands that follow the wing's lower edge
  if (b.bars) s += ink("M-52 -98C-30 -90 -4 -88 24 -96M-56 -86C-32 -78 -6 -76 28 -84M-46 -110C-26 -104 0 -102 18 -108", 3.2, b.bars, ' opacity=".85"');
  // layered feather edges along the back of the wing
  s += ink("M-58 -78C-50 -84 -44 -82 -40 -74M-42 -72C-34 -78 -28 -76 -24 -68M-26 -68C-18 -74 -12 -72 -8 -66", 2.2, K.ink, ' opacity=".5"');
  return s;
}

function scallops(col, k) {
  let d = "";
  const rows = [[-36, -126, 6], [-30, -110, 7], [-26, -94, 7], [-20, -78, 6]];
  for (const [x0, y, count] of rows) for (let i = 0; i < count; i++) {
    const x = x0 + i * 13 + (y % 2 ? 6 : 0);
    d += `M${n(x - 5)} ${n(y)}Q${n(x)} ${n(y + 6 * k)} ${n(x + 5)} ${n(y)}`;
  }
  return ink(d, 2.4, col, ' opacity=".8"');
}

function flecks(col) {
  let d = "";
  const pts = [[-30, -128], [-12, -136], [8, -134], [-40, -104], [-20, -112], [2, -116], [24, -110], [40, -96], [-10, -92], [18, -86], [44, -78], [-34, -78]];
  for (const [x, y] of pts) d += `M${x} ${y}l4 3`;
  return ink(d, 2.6, col, ' opacity=".8"');
}

function headDraw(b, H, o, pose, tom, hen) {
  const [hx, hy] = H;
  let s = "";
  // wattle under the chin
  s += shape(`M${n(hx - 2)} ${n(hy + 10)}C${n(hx + 10)} ${n(hy + 12)} ${n(hx + 10)} ${n(hy + 28)} ${n(hx + 3)} ${n(hy + 32)}C${n(hx - 4)} ${n(hy + 30)} ${n(hx - 6)} ${n(hy + 18)} ${n(hx - 2)} ${n(hy + 10)}Z`, K.wattle, 2.4);
  // head
  s += circle(hx, hy, 19, b.head, 3);
  // beak (open: the lower half drops)
  const open = o.mouth ?? pose.open;
  if (open) {
    s += shape(`M${n(hx + 11)} ${n(hy - 3)}L${n(hx + 30)} ${n(hy - 6)}L${n(hx + 13)} ${n(hy + 3)}Z`, K.beak, 2.2);
    s += shape(`M${n(hx + 12)} ${n(hy + 4)}L${n(hx + 26)} ${n(hy + 12)}L${n(hx + 11)} ${n(hy + 9)}Z`, K.beak, 2.2);
    s += fillOnly(`M${n(hx + 13)} ${n(hy + 3)}L${n(hx + 24)} ${n(hy + 9)}L${n(hx + 12)} ${n(hy + 8)}Z`, K.deep);
  } else {
    s += shape(`M${n(hx + 11)} ${n(hy - 3)}L${n(hx + 28)} ${n(hy + 3)}L${n(hx + 12)} ${n(hy + 7)}Z`, K.beak, 2.2);
  }
  // snood: long on toms (hangs past the beak), a nub on hens, middling on jakes
  const sl = tom ? 1 : hen ? 0.35 : 0.6;
  s += shape(`M${n(hx + 8)} ${n(hy - 11)}C${n(hx + 18)} ${n(hy - 14)} ${n(hx + 24)} ${n(hy - 2)} ${n(hx + 22 + 4 * sl)} ${n(hy + 6 + 18 * sl)}C${n(hx + 19 + 4 * sl)} ${n(hy + 10 + 18 * sl)} ${n(hx + 16)} ${n(hy + 6 + 16 * sl)} ${n(hx + 16)} ${n(hy + 2 + 10 * sl)}C${n(hx + 16)} ${n(hy - 4)} ${n(hx + 13)} ${n(hy - 7)} ${n(hx + 7)} ${n(hy - 6)}Z`, K.wattle, 2.2);
  // eye
  const eyes = o.eyes ?? pose.eyes ?? (b.bigEyes ? "wide" : "open");
  const ex = hx + 3, ey = hy - 4, er = b.bigEyes || eyes === "wide" ? 9 : 7.6;
  const look = o.look ?? 0.4;
  if (eyes === "closed") s += ink(`M${n(ex - 5)} ${n(ey)}Q${n(ex)} ${n(ey + 4)} ${n(ex + 5)} ${n(ey)}`, 2.4);
  else if (eyes === "happy") s += ink(`M${n(ex - 5)} ${n(ey + 1)}Q${n(ex)} ${n(ey - 5)} ${n(ex + 5)} ${n(ey + 1)}`, 2.6);
  else {
    s += circle(ex, ey, er, "#fff", 2);
    s += circle(ex + look * er * 0.45, ey + (eyes === "sly" ? 1.5 : 0), er * 0.48, K.ink, 0);
    s += circle(ex + look * er * 0.45 - 1.4, ey - 1.6, 1.2, "#fff", 0);
    if (eyes === "sly") s += fillOnly(`M${n(ex - er - 1)} ${n(ey - 1)}A${n(er + 1)} ${n(er + 1)} 0 0 1 ${n(ex + er + 1)} ${n(ey - 1)}Z`, b.head) + ink(`M${n(ex - er - 1)} ${n(ey - 1)}H${n(ex + er + 1)}`, 2.2);
  }
  if (eyes === "worried") s += ink(`M${n(ex - 7)} ${n(ey - 10)}L${n(ex + 5)} ${n(ey - 13)}`, 2.4);
  if (eyes === "wide") s += ink(`M${n(ex - 6)} ${n(ey - 12)}Q${n(ex)} ${n(ey - 15)} ${n(ex + 6)} ${n(ey - 12)}`, 2.2);
  return s;
}

/** Place a turkey: x, y = where its feet stand; s = scale; facing 1 right, -1 left. */
export function turkey(id, x, y, s = 1, facing = 1, o = {}) {
  return place(x, y, s * BIRDS[id].size, facing, bird(id, o));
}

/** Height above the feet of a turkey's head top, for composing (at s = 1). */
export const headTop = (id, pose = "stand") => (-(POSES[pose].head[1]) + 18) * BIRDS[id].size;
export const TURKEY_IDS = Object.keys(BIRDS);
