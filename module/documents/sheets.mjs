/**
 * Actor sheets: the turkey card (knack, quirk, live urge and place, and the action
 * buttons on the turkeys' turn) and a simple sheet for the farm folk.
 */
import { SYSTEM_PATH } from "../contracts.mjs";
import { GG } from "../config.mjs";
import * as G from "../logic/game.mjs";
import { getState } from "../vtt/store.mjs";
import { actionButtons, placeText, urgePips } from "../apps/view.mjs";
import { startAction } from "../apps/action-dialog.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

const BIRD = { hen: "hen", tom: "tom", jake: "jake (a young male)" };

export class TurkeySheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["gobble-gobbled", "gg-sheet", "gg-turkey-sheet"],
    position: { width: 440, height: "auto" },
    window: { resizable: true },
    actions: { act: TurkeySheet.#onAct }
  };

  static PARTS = { body: { template: `${SYSTEM_PATH}/templates/actor/turkey.hbs` } };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const a = this.actor;
    const def = GG.turkeys.find(t => t.id === a.system.key) ?? null;
    const k = def ? GG.knacks[def.knack] : null, q = def ? GG.quirks[def.quirk] : null;
    const S = getState();
    const t = S && def ? G.turkey(S, def.id) : null;
    const mine = !!t && (game.user.isGM || S.seats?.[t.id]?.userId === game.user.id);
    return {
      ...ctx,
      actor: a, img: a.img, name: a.name,
      breed: def ? `${def.breed} ${BIRD[def.bird] ?? def.bird}` : "",
      number: def ? GG.turkeys.indexOf(def) + 1 : "",
      knack: k ? { name: k.name, text: k.text } : null,
      quirk: q ? { name: q.name, text: q.text } : null,
      inGame: !!t,
      urge: t?.urge ?? GG.urge.start, pips: urgePips(t?.urge ?? GG.urge.start),
      place: t ? placeText(S, t) : "", spotted: !!t?.spotted, acted: !!t?.acted,
      actions: t && mine && S.phase === "turkeys" && !t.acted && !S.over ? actionButtons(S, t.id) : []
    };
  }

  static async #onAct(_event, target) {
    return startAction(this.actor.system.key, target.dataset.kind);
  }
}

export class FolkSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["gobble-gobbled", "gg-sheet", "gg-folk-sheet"],
    position: { width: 380, height: "auto" }
  };

  static PARTS = { body: { template: `${SYSTEM_PATH}/templates/actor/folk.hbs` } };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const a = this.actor;
    const farm = GG.farms[a.system?.farm] ?? null;
    const role = {
      farmer: "He's looking for a turkey to cook. He walks to the nearest “Huh?” token, searches where he ends up, and grabs any Spotted turkey he finds.",
      dog: "The farm dog sniffs out turkeys and barks, but never grabs anyone.",
      kid: "The farmer's kid (with 5 or more turkeys) peeks into hiding spots and yells for Dad."
    }[a.type] ?? "";
    return { ...ctx, actor: a, img: a.img, name: a.name, farm: farm?.name ?? "", role };
  }
}
