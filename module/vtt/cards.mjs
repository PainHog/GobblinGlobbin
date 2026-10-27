/**
 * Chat cards (docs/VTT-DESIGN.md §7): the setup card, one card per turkey action,
 * one story card per farmer's turn, and the end card. Each carries
 * flags["gobble-gobbled"].card = { kind, gameId, seq, undone }.
 */
import { SYSTEM_ID, SYSTEM_PATH, FLAG, FLAGS, CARD, PACKS } from "../contracts.mjs";
import { GG } from "../config.mjs";
import { narrate } from "../logic/narrate.mjs";

const render = (path, data) => foundry.applications.handlebars.renderTemplate(`${SYSTEM_PATH}/templates/${path}`, data);

/** Who a card is "from" in the chat log. */
function speaker(S, kind, turkeyId) {
  if (turkeyId) {
    const actorId = S.seats?.[turkeyId]?.actorId;
    const actor = actorId ? game.actors.get(actorId) : null;
    return { alias: GG.turkeys.find(t => t.id === turkeyId)?.name ?? "A turkey", actor: actor?.id ?? null };
  }
  return { alias: kind === CARD.farmer ? GG.farms[S.farmId].farmer : "The Dinner Clock" };
}

async function post(kind, S, data, turkeyId = null) {
  const content = await render("chat/card.hbs", { kind, ...data });
  return ChatMessage.create({
    content,
    speaker: speaker(S, kind, turkeyId),
    flags: { [FLAG]: { [FLAGS.card]: { kind, gameId: S.id, seq: S.seq, turkey: turkeyId } } }
  });
}

const summary = S => ({
  round: S.round, clock: S.clock, feathers: S.feathers, decoy: S.decoy,
  farm: GG.farms[S.farmId].name, difficulty: GG.difficulty[S.difficulty].name
});

export function setupCard(S) {
  const farm = GG.farms[S.farmId];
  const flock = S.turkeys.map(t => {
    const uid = S.seats?.[t.id]?.userId;
    return { name: t.name, player: uid ? game.users.get(uid)?.name ?? "" : "the Storyteller" };
  });
  return post(CARD.setup, S, {
    title: `${farm.name}, ${GG.difficulty[S.difficulty].name}`,
    lines: [
      { cls: "setup", html: `The Dinner Clock starts at <strong>${S.clockStart}</strong>. The flock has <strong>${S.feathers}</strong> Feather${S.feathers === 1 ? "" : "s"}.` },
      { cls: "setup", html: `${farm.farmer}${S.dog ? ` and ${farm.dog}` : ""}${S.kids.length ? ", with the kid helping," : ""} will be looking for a turkey to cook.` },
      { cls: "round", html: `<strong>Round 1.</strong> ${farm.farmer} is still indoors pulling on his boots. Nobody goes into the Farmhouse this round!` }
    ],
    flock,
    ...summary(S)
  });
}

export function actionCard(S, turkeyId, events) {
  return post(CARD.action, S, { title: GG.turkeys.find(t => t.id === turkeyId)?.name, lines: narrate(events, S), ...summary(S) }, turkeyId);
}

export function farmerCard(S, events) {
  return post(CARD.farmer, S, { title: `${GG.farms[S.farmId].farmer}'s turn`, lines: narrate(events, S), ...summary(S) });
}

/** Draw a line from one of the system's roll tables (by name), if the compendium has it. */
async function drawFrom(tableName) {
  try {
    const pack = game.packs.get(`${SYSTEM_ID}.${PACKS.tables}`);
    if (!pack) return null;
    const tables = await pack.getDocuments();
    const plain = s => String(s ?? "").replace(/[\u2018\u2019]/g, "'").toLowerCase();   // the packs use curly apostrophes
    const table = tables.find(t => plain(t.name) === plain(tableName));
    if (!table) return null;
    const { results } = await table.draw({ displayChat: false });
    return results?.[0]?.description ?? results?.[0]?.text ?? results?.[0]?.name ?? null;
  } catch (err) {
    console.warn(`${SYSTEM_ID} | couldn't draw from ${tableName}`, err);
    return null;
  }
}

export async function endCard(S) {
  const farm = GG.farms[S.farmId];
  const st = S.stats;
  const win = S.result === "win";
  const gobbled = win ? null : S.turkeys.find(t => t.id === S.gobbled);
  const extra = win ? await drawFrom("What's for Dinner Instead?") : await drawFrom("Famous Last Gobbles");
  const gobbles = Object.values(st.gobbles).reduce((a, b) => a + b, 0);
  return post(CARD.end, S, {
    title: win ? "TOO LATE! The flock wins!" : `${gobbled?.name ?? "A turkey"} got gobbled`,
    win,
    lines: [
      win
        ? { cls: "win", html: `It's far too late to cook a turkey tonight. ${farm.farmer} gives up and makes something else.` }
        : { cls: "loss", html: `${farm.farmer} carries ${gobbled?.name ?? "the turkey"} off to the kitchen. The rest of the flock is safe… this year.` },
      ...(extra ? [{ cls: "table", html: `<strong>${win ? "What's for dinner instead?" : `${gobbled?.name}'s famous last gobble:`}</strong> ${extra}` }] : [])
    ],
    stats: [
      { label: "Rounds", value: S.round },
      { label: "Gobbles", value: gobbles },
      { label: "Times Spotted", value: st.spotted },
      { label: "Rescues that worked", value: `${st.rescueWins} of ${st.rescueTries}` },
      { label: "Feathers spent", value: `${st.feathersSpent} of ${st.feathersStart}` },
      { label: "Pranks pulled", value: `${Object.keys(st.pranks).length} of ${farm.pranks.length}` }
    ],
    ...summary(S)
  });
}

/** Mark the cards of undone changes (seq after the restored state). */
export async function markUndone(gameId, afterSeq) {
  for (const m of game.messages ?? []) {
    const c = m.flags?.[FLAG]?.[FLAGS.card];
    if (!c || c.gameId !== gameId || c.undone || !(c.seq > afterSeq)) continue;
    await m.update({ [`flags.${FLAG}.${FLAGS.card}.undone`]: true });
  }
}

/** Every client: grey out undone cards. */
export function decorateCard(message, html) {
  const c = message.flags?.[FLAG]?.[FLAGS.card];
  if (!c) return;
  const root = html?.querySelector?.(".gg-card") ?? null;
  if (c.undone && root) root.classList?.add?.("gg-undone");
}
