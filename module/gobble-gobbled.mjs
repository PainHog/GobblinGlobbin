/**
 * DON'T GET GOBBLE GOBBLED
 * A comedy party game by Richard Moore.
 * Foundry VTT game system — entry point (docs/VTT-DESIGN.md).
 *
 * This file only wires things up: data models, sheets, settings, queries and the
 * status effect in "init"; the board sync, the tracker and the hooks in "ready".
 * Rules live in module/logic/ (Foundry-free, shared with the simulator); the
 * runtime in module/vtt/; windows and dialogs in module/apps/.
 */

import { GG } from "./config.mjs";
import { SYSTEM_ID, QUERY, PROMPT_QUERY, HOOKS, SETTINGS, OPS, ACTOR_TYPES } from "./contracts.mjs";
import * as G from "./logic/game.mjs";
import { zoneAt } from "./logic/layout.mjs";
import { DATA_MODELS } from "./documents/data-models.mjs";
import { TurkeySheet, FolkSheet } from "./documents/sheets.mjs";
import { registerSettings } from "./vtt/settings.mjs";
import { getState, listenBusy, isActiveGM } from "./vtt/store.mjs";
import { handleOp, request, installBoardSync } from "./vtt/ops.mjs";
import { decorateCard } from "./vtt/cards.mjs";
import { SPOTTED, boardFlag, isSync, syncBoard } from "./vtt/board.mjs";
import { promptHandler } from "./apps/prompts.mjs";
import { FarmTracker, openRules } from "./apps/tracker.mjs";
import { startAction } from "./apps/action-dialog.mjs";

/* -------------------------------------------- */
/*  Init                                        */
/* -------------------------------------------- */

Hooks.once("init", function () {
  console.log("Don't Get Gobble Gobbled | Initialising the system.");

  // Static game data, reachable as CONFIG.GG (and from macros/modules via the API below).
  CONFIG.GG = GG;
  Object.assign(CONFIG.Actor.dataModels, DATA_MODELS);

  const Sheets = foundry.applications.apps?.DocumentSheetConfig;
  if (Sheets) {
    Sheets.registerSheet(Actor, SYSTEM_ID, TurkeySheet, { types: [ACTOR_TYPES.turkey], makeDefault: true, label: "Turkey Card" });
    Sheets.registerSheet(Actor, SYSTEM_ID, FolkSheet, { types: [ACTOR_TYPES.farmer, ACTOR_TYPES.dog, ACTOR_TYPES.kid], makeDefault: true, label: "Farm Folk" });
  }

  registerSettings();

  // GM operations (players → active GM) and prompts (GM → a player).
  CONFIG.queries[QUERY] = handleOp;
  CONFIG.queries[PROMPT_QUERY] = promptHandler;

  // The Spotted marker on a turkey's token.
  if (Array.isArray(CONFIG.statusEffects) && !CONFIG.statusEffects.some(s => s.id === SPOTTED)) {
    CONFIG.statusEffects.push({ id: SPOTTED, name: "GG.Status.spotted", img: "icons/svg/eye.svg" });
  }

  // Public API for macros and other modules.
  game.gobbleGobbled = Object.assign(game.gobbleGobbled ?? {}, {
    GG, id: SYSTEM_ID,
    state: () => getState(),
    openTracker: () => FarmTracker.open(),
    openRules: () => openRules(),
    farmerTurn: () => request(OPS.farmer),
    undo: () => request(OPS.undo),
    act: (turkeyId, kind) => startAction(turkeyId, kind),
    legalActions: turkeyId => { const S = getState(); return S ? G.legalActions(S, turkeyId) : []; }
  });
});

/* -------------------------------------------- */
/*  Ready                                       */
/* -------------------------------------------- */

Hooks.once("ready", function () {
  listenBusy();
  installBoardSync();
  // The GM puts the board right on load (a reload mid-game, or tokens moved by hand).
  if (isActiveGM()) { const S = getState(); if (S?.sceneId) syncBoard(S).catch(err => console.error(err)); }
  if (game.settings.get(SYSTEM_ID, SETTINGS.trackerOpen)) FarmTracker.open();
  console.log("Don't Get Gobble Gobbled | Ready.");
});

/** Re-render the tracker and any open turkey sheets whenever the game changes. */
function refreshViews() {
  FarmTracker.refresh();
  for (const app of foundry.applications.instances?.values?.() ?? []) {
    if (app instanceof TurkeySheet && app.rendered) app.render();
  }
}
Hooks.on(HOOKS.stateChanged, refreshViews);
Hooks.on(HOOKS.busy, () => FarmTracker.refresh());

Hooks.on("renderChatMessageHTML", (message, html) => decorateCard(message, html));

/**
 * The system moves the board's tokens. A player who drags their turkey gets the
 * Sneak (or Scram) dialog instead, and the token stays where the rules put it.
 */
Hooks.on("preUpdateToken", (doc, change, options, userId) => {
  const flag = boardFlag(doc);
  if (!flag || isSync(options) || !("x" in change || "y" in change)) return;
  if (userId !== game.user?.id) return;
  const S = getState();
  if (S && flag.role === "turkey") {
    const grid = doc.parent?.grid?.size ?? 100;
    const cx = (change.x ?? doc.x) + ((doc.width ?? 1) * grid) / 2, cy = (change.y ?? doc.y) + ((doc.height ?? 1) * grid) / 2;
    const at = zoneAt(S.farmId, cx, cy);
    const t = G.turkey(S, flag.ref);
    if (at && t && at.zone !== t.zone && S.adj[t.zone].includes(at.zone)) startAction(t.id, t.spotted ? "scram" : "sneak");
  }
  ui.notifications.info(game.i18n.localize("GG.Notify.useTracker"));
  return false;
});
