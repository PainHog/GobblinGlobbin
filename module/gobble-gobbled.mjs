/**
 * DON'T GET GOBBLE GOBBLED
 * A tabletop roleplaying game by Richard Moore.
 * Foundry VTT game system — entry point (skeleton).
 *
 * Nothing game-specific lives here yet. As the system grows, this file only
 * wires things up: register data models, document classes, sheets, settings and
 * GM operations in "init", start runtime services in "ready". Rules logic goes
 * in module/logic/ (Foundry-free); shared names go in module/contracts.mjs.
 */

import { GG } from "./config.mjs";
import { SYSTEM_ID } from "./contracts.mjs";

/* -------------------------------------------- */
/*  Init                                        */
/* -------------------------------------------- */

Hooks.once("init", function () {
  console.log("Don't Get Gobble Gobbled | Initialising the system.");

  // Static game data, reachable as CONFIG.GG (and from macros/modules via the API below).
  CONFIG.GG = GG;

  // Public API namespace for macros and other modules.
  game.gobbleGobbled = Object.assign(game.gobbleGobbled ?? {}, { GG, id: SYSTEM_ID });

  // World-migration bookkeeping (version-keyed, GM-only migrations come later).
  game.settings.register(SYSTEM_ID, "systemMigrationVersion", {
    scope: "world", config: false, type: String, default: ""
  });
});

/* -------------------------------------------- */
/*  Ready                                       */
/* -------------------------------------------- */

Hooks.once("ready", function () {
  console.log("Don't Get Gobble Gobbled | Ready.");
});
