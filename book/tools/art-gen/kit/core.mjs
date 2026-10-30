// Core helpers for the character and prop kit (book art, VTT tokens).
// Flat cartoon style: solid fills, one ink outline weight per scale, a soft
// shadow shape on each mass, a contact shadow under everything that stands.
import { C } from "../lib.mjs";

/**
 * Character colours beyond the book palette (book/art/README.md lists them).
 * Heritage turkey colourings and human/dog colours need a few more than the
 * autumn tokens; everything else uses C.
 */
export const K = {
  ...C,
  white: "#fffdf7", whiteShade: "#e6dccb",
  steel: "#8b8f93", steelShade: "#676b70", tan: "#c99a63",
  slate: "#8a98a8", slateShade: "#6c7988",
  black: "#26221f", blackShade: "#141210", sheen: "#3f6b4a",
  bronze: "#8a4f2a", bronzeShade: "#5f3418", copper: "#c0763a",
  chestnut: "#8f3b1f", chestnutShade: "#652812",
  choc: "#6e4128", chocShade: "#4c2a17",
  skinBlue: "#cfe0ea", skinPink: "#f2c7b8", wattle: "#cf3b32", wattleShade: "#a1271f",
  beak: "#efc66f", leg: "#d4866e", legShade: "#a8604c",
  denim: "#4f6b8a", denimShade: "#3a5068", flannel: "#b23a2c", flannelShade: "#83271c",
  skin: "#f0c09a", skinShade: "#d39b74", hair: "#6b4a2e", grey: "#9c948a", greyShade: "#7a7268",
  rubber: "#e8b93a", rubberShade: "#b98b1c", green: "#4f7a3a", greenShade: "#3a5c2a",
  gold: "#d9a441", goldShade: "#ad7d25", cream: "#f3e3c3",
  barnRed: "#a8382c", barnShade: "#7d2820", sky: "#f6e7c8", hay: "#e3b85a", hayShade: "#bf9036",
  pumpkin: "#d9772a", pumpkinShade: "#ad561a", stem: "#5d6b2e", wood: "#9a6a3e", woodShade: "#73492a",
  grass: "#8fa65a", grassShade: "#6f8a43", metal: "#b8b2a8", metalShade: "#8d877d"
};

export const n = v => (Math.round(v * 10) / 10).toString();

/** A filled shape with the ink outline. */
export const shape = (d, fill, sw = 3, extra = "") =>
  `<path d="${d}" fill="${fill}" stroke="${K.ink}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"${extra}/>`;
/** A filled shape with no outline (shading, highlights). */
export const fillOnly = (d, fill, extra = "") => `<path d="${d}" fill="${fill}"${extra}/>`;
/** An ink line. */
export const ink = (d, sw = 3, col = K.ink, extra = "") =>
  `<path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
/** A thick coloured stroke with an ink edge (legs, arms, ropes). */
export const limb = (d, col, w, sw = 3) => ink(d, w + sw * 2) + ink(d, w, col);
export const circle = (x, y, r, fill, sw = 3, extra = "") =>
  `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${fill}"${sw ? ` stroke="${K.ink}" stroke-width="${sw}"` : ""}${extra}/>`;
export const ellipse = (x, y, rx, ry, fill, sw = 3, extra = "") =>
  `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fill}"${sw ? ` stroke="${K.ink}" stroke-width="${sw}"` : ""}${extra}/>`;
/** Contact shadow on the ground. */
export const ground = (x, y, rx, op = 0.2) => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(rx * 0.16)}" fill="${K.ink}" opacity="${op}"/>`;

/** Place a drawing made around (0,0): translate, scale, mirror (facing -1 = left). */
export const place = (x, y, s, facing, body) =>
  `<g transform="translate(${n(x)} ${n(y)}) scale(${n(s * facing)} ${n(s)})">${body}</g>`;

/** Rotate a point around a centre (degrees). */
export function rot([x, y], deg, [cx, cy] = [0, 0]) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
}
export const P = p => `${n(p[0])} ${n(p[1])}`;

/** Little motion lines behind something moving right (in its local frame). */
export function motion(x, y, len = 40, count = 3, gap = 14, sw = 3) {
  let d = "";
  for (let i = 0; i < count; i++) d += `M${n(x)} ${n(y + i * gap)}h${n(-len + i * 8)}`;
  return ink(d, sw, K.inkSoft);
}

/** "Surprise" lines around a point (a gobble, a fright). */
export function burst(x, y, r1 = 26, r2 = 44, count = 7, a0 = -70, a1 = 70, sw = 3.5) {
  let d = "";
  for (let i = 0; i < count; i++) {
    const a = ((a0 + ((a1 - a0) * i) / (count - 1)) * Math.PI) / 180;
    d += `M${n(x + Math.cos(a) * r1)} ${n(y + Math.sin(a) * r1)}L${n(x + Math.cos(a) * r2)} ${n(y + Math.sin(a) * r2)}`;
  }
  return ink(d, sw);
}

/** A sweat drop (worry), pointing up. */
export const drop = (x, y, s = 1) =>
  shape(`M${n(x)} ${n(y - 10 * s)}C${n(x + 6 * s)} ${n(y - 2 * s)} ${n(x + 6 * s)} ${n(y + 5 * s)} ${n(x)} ${n(y + 5 * s)}C${n(x - 6 * s)} ${n(y + 5 * s)} ${n(x - 6 * s)} ${n(y - 2 * s)} ${n(x)} ${n(y - 10 * s)}Z`, "#cfe6f0", 2);

/** A hiccup bubble (a small circle with a shine), rising. */
export const bubble = (x, y, r = 7) => circle(x, y, r, "#e9f3f6", 2) + circle(x - r * 0.35, y - r * 0.35, r * 0.25, "#fff", 0);
