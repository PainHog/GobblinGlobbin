/**
 * The board (docs/VTT-DESIGN.md §4), on the active GM's client: the farm scene's
 * tokens and "Huh?" tokens always mirror the game state. Positions come from
 * module/logic/layout.mjs, the same geometry the VTT maps are drawn from.
 */
import { FLAG, FLAGS } from "../contracts.mjs";
import { tokenPositions, heardMarkers, L } from "../logic/layout.mjs";

export const SPOTTED = "gg-spotted";
const SYNC = { [FLAG]: { sync: true }, animate: true };

const boardFlag = doc => doc.flags?.[FLAG]?.[FLAGS.board] ?? null;
const sceneOf = S => (S?.sceneId ? game.scenes?.get(S.sceneId) ?? null : null);

/** The actor for a board role: a turkey's seat, or the farm folk. */
function actorFor(S, role, ref) {
  const id = role === "turkey" ? S.seats?.[ref]?.actorId : S.npc?.[role === "kid2" ? "kid" : role];
  return id ? game.actors.get(id) ?? null : null;
}

const topLeft = (scene, center) => {
  const px = L.token * (scene.grid?.size ?? L.grid);
  return { x: Math.round(center.x - px / 2), y: Math.round(center.y - px / 2) };
};

/** A new token for a board role, from its actor's prototype token (Actor#getTokenDocument in Foundry). */
async function tokenData(S, scene, role, ref, center) {
  const actor = actorFor(S, role, ref);
  const place = { ...topLeft(scene, center), width: L.token, height: L.token, actorLink: true, flags: { [FLAG]: { [FLAGS.board]: { role, ref } } } };
  if (actor?.getTokenDocument) {
    const doc = await actor.getTokenDocument(place);
    return doc.toObject();
  }
  const proto = actor?.prototypeToken?.toObject?.() ?? {};
  return {
    name: actor?.name ?? ref, actorId: actor?.id ?? null, disposition: proto.disposition ?? 0, displayName: proto.displayName ?? 30,
    texture: { src: proto.texture?.src ?? actor?.img ?? "icons/svg/mystery-man.svg" },
    ...place
  };
}

/** Everything that should be on the board: [{ role, ref, center }]. */
function wanted(S) {
  const pos = tokenPositions(S);
  const out = S.turkeys.map(t => ({ role: "turkey", ref: t.id, center: pos.turkeys[t.id] }));
  out.push({ role: "farmer", ref: "farmer", center: pos.farmer });
  if (pos.dog) out.push({ role: "dog", ref: "dog", center: pos.dog });
  pos.kids.forEach((c, i) => out.push({ role: i ? "kid2" : "kid", ref: i ? "kid2" : "kid", center: c }));
  return out;
}

/** Make the scene match the state: tokens moved, created or removed; "Huh?" tokens redrawn; Spotted marked. */
export async function syncBoard(S) {
  const scene = sceneOf(S);
  if (!scene) return;
  const want = wanted(S);
  const tokens = [...(scene.tokens ?? [])].filter(t => boardFlag(t));
  const key = f => `${f.role}|${f.ref}`;
  const have = new Map(tokens.map(t => [key(boardFlag(t)), t]));
  const creates = [], updates = [], keep = new Set();
  for (const w of want) {
    const t = have.get(key(w));
    keep.add(key(w));
    if (!t) { creates.push(await tokenData(S, scene, w.role, w.ref, w.center)); continue; }
    const at = topLeft(scene, w.center);
    if (t.x !== at.x || t.y !== at.y) updates.push({ _id: t.id, ...at });
  }
  const gone = tokens.filter(t => !keep.has(key(boardFlag(t)))).map(t => t.id);
  if (gone.length) await scene.deleteEmbeddedDocuments("Token", gone, SYNC);
  if (creates.length) await scene.createEmbeddedDocuments("Token", creates, SYNC);
  if (updates.length) await scene.updateEmbeddedDocuments("Token", updates, SYNC);
  await syncSpotted(S);
  await syncMarkers(S, scene);
}

/** The Spotted status effect on each turkey's actor. */
async function syncSpotted(S) {
  for (const t of S.turkeys) {
    const actor = actorFor(S, "turkey", t.id);
    if (!actor?.toggleStatusEffect) continue;
    const on = !!actor.statuses?.has?.(SPOTTED);
    if (on !== !!t.spotted) await actor.toggleStatusEffect(SPOTTED, { active: !!t.spotted });
  }
}

/** "Huh?" tokens as numbered Drawings, one per (zone, spot). */
async function syncMarkers(S, scene) {
  const marks = heardMarkers(S);
  const drawings = [...(scene.drawings ?? [])].filter(d => boardFlag(d)?.role === "huh");
  const key = m => `${m.zone}|${m.spot ?? "o"}`;
  const have = new Map(drawings.map(d => [boardFlag(d).ref, d]));
  const creates = [], updates = [], keep = new Set();
  for (const m of marks) {
    const k = key(m);
    keep.add(k);
    const text = `Huh?\n${m.seq}`;
    const d = have.get(k);
    if (!d) creates.push(markerData(m, k, text));
    else if (d.text !== text || d.x !== m.x || d.y !== m.y) updates.push({ _id: d.id, text, x: m.x, y: m.y });
  }
  const gone = drawings.filter(d => !keep.has(boardFlag(d).ref)).map(d => d.id);
  if (gone.length) await scene.deleteEmbeddedDocuments("Drawing", gone, SYNC);
  if (creates.length) await scene.createEmbeddedDocuments("Drawing", creates, SYNC);
  if (updates.length) await scene.updateEmbeddedDocuments("Drawing", updates, SYNC);
}

function markerData(m, ref, text) {
  return {
    x: m.x, y: m.y,
    shape: { type: "e", width: 64, height: 64 },
    fillType: 1, fillColor: "#f6c35c", fillAlpha: 1,
    strokeWidth: 3, strokeColor: "#3b1c0a", strokeAlpha: 1,
    text, fontSize: 16, fontFamily: "Signika", textColor: "#3b1c0a", textAlpha: 1,
    locked: true,
    flags: { [FLAG]: { [FLAGS.board]: { role: "huh", ref } } }
  };
}

/** Clear the system's tokens and drawings from a scene (a new game). */
export async function clearBoard(scene) {
  if (!scene) return;
  const toks = [...(scene.tokens ?? [])].filter(t => boardFlag(t)).map(t => t.id);
  const draws = [...(scene.drawings ?? [])].filter(d => boardFlag(d)).map(d => d.id);
  if (toks.length) await scene.deleteEmbeddedDocuments("Token", toks, SYNC);
  if (draws.length) await scene.deleteEmbeddedDocuments("Drawing", draws, SYNC);
}

/** True if a document change came from the board sync (and should be allowed). */
export const isSync = options => !!options?.[FLAG]?.sync;
export { boardFlag };
