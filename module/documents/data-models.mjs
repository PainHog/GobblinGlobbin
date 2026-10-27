/**
 * Actor data models (docs/VTT-DESIGN.md §5). A turkey only stores which of the
 * eight turkeys it is; its knack and quirk text come from CONFIG.GG, and its live
 * urge, zone and Spotted state come from the game state, never from the actor.
 */
import { GG } from "../config.mjs";

const fields = () => foundry.data.fields;

export class TurkeyData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const { StringField } = fields();
    return {
      key: new StringField({ required: true, blank: false, initial: "pip" }),
      breed: new StringField({ required: false, blank: true, initial: "" }),
      bird: new StringField({ required: false, blank: true, initial: "hen" }),
      knack: new StringField({ required: false, blank: true, initial: "" }),
      quirk: new StringField({ required: false, blank: true, initial: "" })
    };
  }
  /** This turkey in the game data (GG.turkeys). */
  get def() { return GG.turkeys.find(t => t.id === this.key) ?? null; }
}

export class FarmerData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const { StringField } = fields();
    return { farm: new StringField({ required: true, blank: false, initial: "bramble" }) };
  }
}

export class DogData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const { StringField } = fields();
    return { farm: new StringField({ required: true, blank: false, initial: "bramble" }) };
  }
}

export class KidData extends foundry.abstract.TypeDataModel {
  static defineSchema() { return {}; }
}

export const DATA_MODELS = { turkey: TurkeyData, farmer: FarmerData, dog: DogData, kid: KidData };
