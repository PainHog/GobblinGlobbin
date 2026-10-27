/**
 * Settings (docs/VTT-DESIGN.md §6). The game state and the undo stack are hidden
 * world settings written only by the active GM; every client re-renders when the
 * state changes.
 */
import { SYSTEM_ID, SETTINGS, HOOKS } from "../contracts.mjs";

export const IDLE = Object.freeze({ phase: "idle" });

export function registerSettings() {
  const reg = (key, data) => game.settings.register(SYSTEM_ID, key, data);
  reg(SETTINGS.game, {
    scope: "world", config: false, type: Object, default: { ...IDLE },
    onChange: value => Hooks.callAll(HOOKS.stateChanged, value)
  });
  reg(SETTINGS.undo, { scope: "world", config: false, type: Object, default: { stack: [] } });
  reg(SETTINGS.promptTimeout, {
    name: "GG.Settings.promptTimeout.name", hint: "GG.Settings.promptTimeout.hint",
    scope: "world", config: true, type: Number, default: 30, range: { min: 0, max: 300, step: 5 }
  });
  reg(SETTINGS.showFarmerDice, {
    name: "GG.Settings.showFarmerDice.name", hint: "GG.Settings.showFarmerDice.hint",
    scope: "world", config: true, type: Boolean, default: false
  });
  reg(SETTINGS.trackerOpen, {
    name: "GG.Settings.trackerOpen.name", hint: "GG.Settings.trackerOpen.hint",
    scope: "client", config: true, type: Boolean, default: true
  });
  reg(SETTINGS.systemMigrationVersion, { scope: "world", config: false, type: String, default: "" });
}

export const setting = key => game.settings.get(SYSTEM_ID, key);
