/**
 * Starting a game (docs/VTT-DESIGN.md §3.1), on the active GM's client: bring the
 * farm's scene, the chosen turkeys and the farm folk in from the compendiums (if
 * the world doesn't have them yet), give each player their turkey, activate the
 * scene, and start round 1.
 */
import { SYSTEM_ID, FLAG, FLAGS, PACKS, ACTOR_TYPES } from "../contracts.mjs";
import { GG } from "../config.mjs";
import * as G from "../logic/game.mjs";
import { clearBoard } from "./board.mjs";

const OWNER = 3, OBSERVER = 2;
const pack = name => game.packs?.get(`${SYSTEM_ID}.${name}`) ?? null;
const docClass = name => CONFIG[name]?.documentClass ?? globalThis[name];

/** A world document matching `test`, or a copy imported from the system's compendium. */
async function ensure(collection, docName, packName, test) {
  const found = [...(game[collection] ?? [])].find(test);
  if (found) return found;
  const p = pack(packName);
  if (!p) throw new Error(`the ${packName} compendium is missing`);
  const src = (await p.getDocuments()).find(test);
  if (!src) throw new Error(`nothing in the ${packName} compendium matches`);
  // Foundry's own import keeps the link to the compendium (_stats.compendiumSource).
  const world = game[collection];
  if (typeof world?.importFromCompendium === "function") return world.importFromCompendium(p, src.id ?? src._id);
  const data = src.toObject();
  delete data._id;
  data._stats = { ...(data._stats ?? {}), compendiumSource: src.uuid };
  return docClass(docName).create(data);
}

const isTurkey = id => a => a.type === ACTOR_TYPES.turkey && a.system?.key === id;
const isFolk = (type, farmId) => a => a.type === type && (type === ACTOR_TYPES.kid || a.system?.farm === farmId);
const isFarmScene = farmId => s => s.flags?.[FLAG]?.[FLAGS.farm]?.farmId === farmId;

/** The Storyteller's macros (Open the Farm Tracker, Farmer's Turn): into the world and onto the hotbar, once. */
async function ensureMacros() {
  const p = pack(PACKS.macros);
  if (!p || !game.macros) return;
  try {
    for (const src of await p.getDocuments()) {
      let m = [...game.macros].find(x => x._stats?.compendiumSource === src.uuid || x.name === src.name);
      if (!m) {
        m = typeof game.macros.importFromCompendium === "function"
          ? await game.macros.importFromCompendium(p, src.id ?? src._id)
          : await docClass("Macro").create({ ...src.toObject(), _id: undefined });
        await game.user.assignHotbarMacro?.(m);
      }
    }
  } catch (err) {
    console.warn(`${SYSTEM_ID} | couldn't set up the macros`, err);
  }
}

/**
 * Build a new game. `seats` = [{ turkeyId, userId|null }]. Returns the new state
 * (not yet saved: the store does that).
 */
export async function buildGame({ farmId, difficulty, seats }) {
  const roster = seats.map(s => s.turkeyId);
  const S = G.newGame({ farmId, difficulty, roster });
  S.id = foundry.utils.randomID();
  S.seats = {};
  for (const { turkeyId, userId } of seats) {
    const actor = await ensure("actors", "Actor", PACKS.turkeys, isTurkey(turkeyId));
    const ownership = { default: OBSERVER };
    if (userId) ownership[userId] = OWNER;
    await actor.update({ ownership });
    S.seats[turkeyId] = { userId: userId ?? null, actorId: actor.id };
  }
  const farmer = await ensure("actors", "Actor", PACKS.folk, isFolk(ACTOR_TYPES.farmer, farmId));
  const dog = S.dog ? await ensure("actors", "Actor", PACKS.folk, isFolk(ACTOR_TYPES.dog, farmId)) : null;
  const kid = S.kids.length ? await ensure("actors", "Actor", PACKS.folk, isFolk(ACTOR_TYPES.kid, farmId)) : null;
  S.npc = { farmer: farmer.id, dog: dog?.id ?? null, kid: kid?.id ?? null };
  await ensureMacros();
  const scene = await ensure("scenes", "Scene", PACKS.farms, isFarmScene(farmId));
  S.sceneId = scene.id;
  await clearBoard(scene);
  if (!scene.active) await scene.activate?.();
  await G.startGame(S, { d6: async () => 1, dice: async () => ({ white: [], red: [], helper: null }), ask: async () => null, emit: () => {} });
  return S;
}

/** Deal by dice (Ch 8): give each player one turkey at random, then fill up to the flock size. */
export function dealByDice(userIds, size) {
  const shuffled = GG.turkeys.map(t => t.id);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.max(size, userIds.length)).map((turkeyId, i) => ({ turkeyId, userId: userIds[i] ?? null }));
}
