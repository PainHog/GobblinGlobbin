/**
 * DON'T GET GOBBLE GOBBLED — Cross-package contracts.
 * Constants only: no imports, no Foundry globals, no logic. Every name that two
 * parts of the system must agree on (setting keys, chat-card kinds, GM operation
 * names, hook names, flag scopes) is declared here once and imported everywhere,
 * so packages built in parallel cannot drift apart; a test asserts each one is
 * actually used. Change it only on purpose, together with every user of it.
 */
export const SYSTEM_ID = "gobble-gobbled";
/** Flag scope for documents (flags["gobble-gobbled"]). */
export const FLAG = "gobble-gobbled";
/** CONFIG.queries handler name for GM-authoritative operations. */
export const QUERY = "gobble-gobbled.op";
/** CONFIG.queries handler name for prompts the GM sends to a player. */
export const PROMPT_QUERY = "gobble-gobbled.prompt";
/** Socket channel (system.json "socket": true). */
export const SOCKET = "system.gobble-gobbled";
/** Where the system's files live once installed. */
export const SYSTEM_PATH = "systems/gobble-gobbled";

/** World/client setting keys. */
export const SETTINGS = Object.freeze({
  game: "game",
  undo: "undo",
  promptTimeout: "promptTimeout",
  showFarmerDice: "showFarmerDice",
  trackerOpen: "trackerOpen",
  systemMigrationVersion: "systemMigrationVersion"
});

/** Chat-card kinds (flags["gobble-gobbled"].card.kind). */
export const CARD = Object.freeze({
  setup: "setup",
  action: "action",
  farmer: "farmer",
  end: "end"
});

/** GM-authoritative operation names (sent through QUERY). */
export const OPS = Object.freeze({
  act: "act",
  newGame: "newGame",
  farmer: "farmer",
  undo: "undo",
  endGame: "endGame"
});

/** Hooks this system fires (other modules may listen). */
export const HOOKS = Object.freeze({
  stateChanged: "gobbleGobbled.stateChanged",
  busy: "gobbleGobbled.busy"
});

/** Actor subtypes (system.json documentTypes.Actor). */
export const ACTOR_TYPES = Object.freeze({
  turkey: "turkey",
  farmer: "farmer",
  dog: "dog",
  kid: "kid"
});

/** Document flag keys under FLAG. */
export const FLAGS = Object.freeze({
  card: "card",          // ChatMessage: { kind, gameId, seq, undone, interrupted }
  board: "board",        // Token/Drawing: { role: "turkey"|"farmer"|"dog"|"kid"|"huh", ref }
  farm: "farm"           // Scene: { farmId }
});

/** Compendium pack names (system.json packs[].name). */
export const PACKS = Object.freeze({
  turkeys: "turkeys",
  folk: "farm-folk",
  farms: "farms",
  rules: "rulebook",
  tables: "tables",
  macros: "macros"
});

/** Prompt kinds the engine asks for (io.ask). */
export const ASK = Object.freeze({
  push: "push",          // Puff Up before a roll?            → boolean
  helper: "helper",      // who Lends a Wing?                  → turkeyId | null
  feather: "feather",    // spend a Feather on this gobble?    → boolean
  spot: "spot",          // which hiding spot?                 → index | null (in the open)
  greatStep: "greatStep",// Great on a Sneak: one more zone?   → zoneId | null
  scramStep: "scramStep" // Scram: which way?                  → zoneId | null
});
