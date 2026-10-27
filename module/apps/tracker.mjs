/**
 * The Farm Tracker (docs/VTT-DESIGN.md §3): the clock, the Feathers, the flock and
 * the pranks for everyone; each player's action buttons for their own turkey; the
 * Storyteller's buttons (New Game, Farmer's Turn, Undo, End Game).
 */
import { SYSTEM_ID, SYSTEM_PATH, OPS, PACKS } from "../contracts.mjs";
import { getState, busy, canUndo } from "../vtt/store.mjs";
import { request } from "../vtt/ops.mjs";
import { trackerView } from "./view.mjs";
import { startAction } from "./action-dialog.mjs";
import { NewGameApp } from "./new-game.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class FarmTracker extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "gg-tracker",
    classes: ["gobble-gobbled", "gg-tracker"],
    window: { title: "GG.Tracker.title", icon: "fa-solid fa-drumstick-bite", resizable: true },
    position: { width: 430, height: "auto", top: 80, left: 110 },
    actions: {
      act: FarmTracker.#onAct,
      newGame: FarmTracker.#onNewGame,
      farmer: FarmTracker.#onFarmer,
      undo: FarmTracker.#onUndo,
      endGame: FarmTracker.#onEndGame,
      sheet: FarmTracker.#onSheet,
      rules: FarmTracker.#onRules
    }
  };

  static PARTS = { body: { template: `${SYSTEM_PATH}/templates/apps/tracker.hbs` } };

  static #instance = null;
  static get instance() { return (this.#instance ??= new FarmTracker()); }
  /** Open (or bring forward) the tracker. */
  static open() { return this.instance.render({ force: true }); }
  /** Re-render if it's open. */
  static refresh() { if (this.#instance?.rendered) this.#instance.render(); }

  async _prepareContext() {
    const S = getState();
    const gm = !!game.user?.isGM;
    const base = { gm, busy: busy(), canUndo: gm && canUndo() };
    if (!S) return { ...base, noGame: true };
    return { ...base, noGame: false, ...trackerView(S, game.user) };
  }

  static async #onAct(_event, target) {
    return startAction(target.dataset.turkey, target.dataset.kind);
  }
  static async #onNewGame() {
    return new NewGameApp().render({ force: true });
  }
  static async #onFarmer() {
    return request(OPS.farmer);
  }
  static async #onUndo() {
    const ok = await foundry.applications.api.DialogV2.confirm({ window: { title: "Undo" }, content: "<p>Undo the last action or farmer's turn?</p>" });
    if (ok) return request(OPS.undo);
  }
  static async #onEndGame() {
    const ok = await foundry.applications.api.DialogV2.confirm({ window: { title: "End the game" }, content: "<p>End this game and clear the board? This can't be undone.</p>" });
    if (ok) return request(OPS.endGame);
  }
  /** Open the rulebook compendium (the whole book, as journals). */
  static async #onRules() {
    return openRules();
  }
  static async #onSheet(_event, target) {
    const S = getState();
    const actor = game.actors?.get(S?.seats?.[target.dataset.turkey]?.actorId);
    return actor?.sheet?.render(true);
  }
}

/** Open the Rulebook compendium. */
export function openRules() {
  const pack = game.packs?.get(`${SYSTEM_ID}.${PACKS.rules}`);
  if (!pack) return ui.notifications.warn("The Rulebook compendium is missing.");
  return pack.render(true);
}
