// The three farm dogs, in profile facing right, around their feet at (0,0).
// Four legs, two ears (the far one peeks over the head), one visible eye in
// profile, a tail and a collar. Markings are the same on both sides of the dog,
// so a dog facing left is the same drawing mirrored (ART-CHECKLIST §9–10).
import { K, n, shape, fillOnly, ink, limb, circle, ellipse, ground, place } from "./core.mjs";

export const DOGS = {
  bramble: { name: "Biscuit", body: K.gold, shade: K.goldShade, ear: K.goldShade, size: 1, ears: "flop", collar: K.alarm },
  puddlewick: { name: "Pickles", body: K.white, shade: K.whiteShade, ear: K.wood, patch: K.wood, size: 0.8, ears: "perk", collar: K.green },
  windy: { name: "Moose", body: K.choc, shade: K.chocShade, ear: K.chocShade, size: 1.25, ears: "flop", shaggy: true, collar: K.accent }
};

/** pose: "stand" | "sniff" (nose to the ground) | "bark" (head up, mouth open) | "sit". */
export function dog(id, o = {}) {
  const d = DOGS[id];
  const pose = o.pose ?? "stand";
  const head = pose === "sniff" ? [70, -38] : pose === "bark" ? [66, -112] : [70, -98];
  let s = ground(0, 2, 64);
  // tail (up and wagging, or straight back when sniffing)
  s += limb(pose === "sniff" ? "M-48 -78C-66 -82 -80 -80 -92 -76" : "M-48 -80C-64 -96 -70 -116 -64 -132", d.body, 10, 3);
  // far legs (shaded), then body, then near legs
  const legs = pose === "sit" ? [[-30, -40, -24, 0], [34, -50, 36, 0]] : [[-34, -52, -40, 0], [30, -52, 34, 0]];
  for (const [x1, y1, x2, y2] of legs) s += limb(`M${x1 + 8} ${y1}L${x2 + 8} ${y2}`, d.shade, 12, 3) + ellipse(x2 + 14, y2 - 3, 10, 5, d.shade, 2.4);
  s += shape("M-56 -86C-54 -106 -20 -110 20 -106C52 -104 66 -92 64 -72C62 -56 40 -48 0 -48C-36 -48 -58 -58 -56 -86Z", d.body, 3);
  s += fillOnly("M-56 -70C-50 -54 -30 -48 0 -48C40 -48 60 -56 63 -70C50 -60 20 -56 -6 -58C-30 -58 -48 -62 -56 -70Z", d.shade, ' opacity=".8"');
  if (d.patch) s += shape("M-30 -104C-10 -110 12 -108 18 -98C14 -86 -10 -84 -26 -88C-34 -92 -36 -100 -30 -104Z", d.patch, 2.4);
  if (d.shaggy) s += ink("M-50 -60l-4 8M-36 -52l-3 8M-20 -48l-2 8M0 -48l0 8M20 -50l2 8M40 -54l3 8", 3, d.shade);
  for (const [x1, y1, x2, y2] of legs) s += limb(`M${x1}  ${y1}L${x2} ${y2}`, d.body, 12, 3) + ellipse(x2 + 6, y2 - 3, 10, 5, d.body, 2.4);
  // neck + collar
  s += shape(`M40 -100C48 -110 ${n(head[0] - 18)} ${n(head[1] + 4)} ${n(head[0] - 8)} ${n(head[1] + 8)}L${n(head[0] + 4)} ${n(head[1] + 22)}C60 -70 56 -66 44 -70Z`, d.body, 3);
  s += ink(`M${n((40 + head[0]) / 2 - 6)} ${n((-100 + head[1]) / 2 + 2)}L${n((44 + head[0]) / 2 + 8)} ${n((-70 + head[1]) / 2 + 8)}`, 9) + ink(`M${n((40 + head[0]) / 2 - 6)} ${n((-100 + head[1]) / 2 + 2)}L${n((44 + head[0]) / 2 + 8)} ${n((-70 + head[1]) / 2 + 8)}`, 5, d.collar);
  // head
  const [hx, hy] = head;
  if (d.ears === "perk") s += shape(`M${n(hx - 18)} ${n(hy - 14)}L${n(hx - 10)} ${n(hy - 40)}L${n(hx)} ${n(hy - 16)}Z`, d.ear, 2.6);   // far ear
  s += ellipse(hx, hy, 26, 22, d.body, 3);
  // snout
  const open = pose === "bark" || o.mouth;
  s += shape(`M${n(hx + 12)} ${n(hy - 6)}C${n(hx + 30)} ${n(hy - 10)} ${n(hx + 44)} ${n(hy - 4)} ${n(hx + 44)} ${n(hy + 4)}C${n(hx + 44)} ${n(hy + 12)} ${n(hx + 26)} ${n(hy + 14)} ${n(hx + 10)} ${n(hy + 12)}Z`, d.body, 3);
  if (open) s += shape(`M${n(hx + 14)} ${n(hy + 10)}C${n(hx + 26)} ${n(hy + 14)} ${n(hx + 38)} ${n(hy + 18)} ${n(hx + 40)} ${n(hy + 24)}C${n(hx + 30)} ${n(hy + 28)} ${n(hx + 18)} ${n(hy + 22)} ${n(hx + 12)} ${n(hy + 16)}Z`, d.body, 2.6) + fillOnly(`M${n(hx + 16)} ${n(hy + 12)}L${n(hx + 38)} ${n(hy + 20)}L${n(hx + 20)} ${n(hy + 18)}Z`, K.wattle);
  s += ellipse(hx + 44, hy - 2, 6, 5, K.ink, 0);   // nose
  s += circle(hx + 8, hy - 8, 5.5, "#fff", 2) + circle(hx + 10, hy - 8, 3, K.ink, 0);   // the eye we can see
  if (d.ears === "flop") s += shape(`M${n(hx - 12)} ${n(hy - 16)}C${n(hx - 2)} ${n(hy - 22)} ${n(hx + 4)} ${n(hy - 10)} ${n(hx)} ${n(hy + 14)}C${n(hx - 8)} ${n(hy + 18)} ${n(hx - 18)} ${n(hy + 4)} ${n(hx - 12)} ${n(hy - 16)}Z`, d.ear, 2.6);
  else s += shape(`M${n(hx - 8)} ${n(hy - 16)}L${n(hx + 2)} ${n(hy - 42)}L${n(hx + 10)} ${n(hy - 16)}Z`, d.ear, 2.6);   // near ear
  if (pose === "sniff") s += ink(`M${n(hx + 56)} ${n(hy - 6)}q4 -4 0 -8M${n(hx + 62)} ${n(hy - 2)}q5 -5 0 -10`, 2, K.inkSoft);
  return s;
}

export const placeDog = (id, x, y, s = 1, facing = 1, o = {}) => place(x, y, s * DOGS[id].size, facing, dog(id, o));
