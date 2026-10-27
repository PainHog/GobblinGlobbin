/**
 * New Game (docs/VTT-DESIGN.md §3.1), for the Storyteller: the farm, the difficulty,
 * and which player plays which turkey (or "Deal by dice").
 */
import { SYSTEM_PATH, OPS } from "../contracts.mjs";
import { GG } from "../config.mjs";
import * as R from "../logic/rules.mjs";
import { request } from "../vtt/ops.mjs";
import { dealByDice } from "../vtt/setup.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class NewGameApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "gg-new-game",
    tag: "form",
    classes: ["gobble-gobbled", "gg-new-game"],
    window: { title: "GG.NewGame.title", icon: "fa-solid fa-tractor" },
    position: { width: 520, height: "auto" },
    form: { handler: NewGameApp.#onSubmit, closeOnSubmit: true },
    actions: { deal: NewGameApp.#onDeal }
  };

  static PARTS = { body: { template: `${SYSTEM_PATH}/templates/apps/new-game.hbs` } };

  constructor(options = {}) {
    super(options);
    this.choice = { farmId: "bramble", difficulty: "standard", seats: {} };
  }

  async _prepareContext() {
    const players = [...(game.users ?? [])].filter(u => !u.isGM);
    const c = this.choice;
    const chosen = Object.keys(c.seats).length;
    return {
      farms: Object.values(GG.farms).map(f => ({ id: f.id, name: f.name, selected: f.id === c.farmId })),
      difficulties: Object.entries(GG.difficulty).map(([id, d]) => ({ id, name: d.name, selected: id === c.difficulty })),
      turkeys: GG.turkeys.map((t, i) => {
        const seat = c.seats[t.id];
        return {
          id: t.id, n: i + 1, name: t.name, knack: GG.knacks[t.knack].name, quirk: GG.quirks[t.quirk].name,
          checked: !!seat,
          players: [{ id: "", name: "the Storyteller", selected: !seat?.userId }, ...players.map(u => ({ id: u.id, name: u.name, selected: seat?.userId === u.id }))]
        };
      }),
      count: chosen,
      clock: chosen >= GG.flock.min ? R.clockStart(c.difficulty, chosen, GG.farms[c.farmId]) : "—",
      feathers: chosen >= GG.flock.min ? R.startingFeathers(c.difficulty, chosen) : "—",
      min: GG.flock.min, max: GG.flock.max
    };
  }

  /** Read the form into this.choice (so a re-render keeps it). */
  _read(data) {
    const c = { farmId: data.farmId ?? this.choice.farmId, difficulty: data.difficulty ?? this.choice.difficulty, seats: {} };
    for (const t of GG.turkeys) if (data[`use.${t.id}`] || data.use?.[t.id]) c.seats[t.id] = { userId: data[`player.${t.id}`] ?? data.player?.[t.id] ?? "" };
    this.choice = c;
    return c;
  }

  /** Keep the choice (and the clock preview) up to date as the Storyteller clicks. */
  _onChangeForm(formConfig, event) {
    super._onChangeForm?.(formConfig, event);
    const FDE = foundry.applications?.ux?.FormDataExtended;
    if (!FDE || !this.element) return;
    this._read(new FDE(this.element).object);
    this.render();
  }

  static async #onDeal() {
    const players = [...(game.users ?? [])].filter(u => !u.isGM && u.active).map(u => u.id);
    const size = Math.min(GG.flock.max, Math.max(GG.flock.min, players.length));
    this.choice.seats = Object.fromEntries(dealByDice(players, size).map(s => [s.turkeyId, { userId: s.userId ?? "" }]));
    return this.render();
  }

  static async #onSubmit(_event, _form, formData) {
    const c = this._read(formData.object ?? {});
    const seats = Object.entries(c.seats).map(([turkeyId, s]) => ({ turkeyId, userId: s.userId || null }));
    if (seats.length < GG.flock.min || seats.length > GG.flock.max) {
      ui.notifications.warn(`Choose ${GG.flock.min} to ${GG.flock.max} turkeys.`);
      throw new Error("bad flock size");
    }
    return request(OPS.newGame, { farmId: c.farmId, difficulty: c.difficulty, seats });
  }
}
