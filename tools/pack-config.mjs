/**
 * Shared compendium pack configuration — the single source of truth for the
 * pack build (build-packs.mjs) and the validator (validate.mjs), so the two
 * can never drift on pack names, id derivation, or source layout.
 *
 * Source layout: one JSON file per document under packs/_source/<file>/, each
 * with a human-friendly `key` slug (no ids). Ids are derived deterministically
 * from (pack, key), so rebuilding never reshuffles them.
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PACKS as PACK_NAMES } from "../module/contracts.mjs";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const SRC = join(ROOT, "packs", "_source");
export const OUT = join(ROOT, "packs");

/**
 * file → output pack, document class & subtype. Must match system.json packs[]
 * (and an Item/Actor subtype must be declared in system.json documentTypes).
 * subtype null on an Actor pack: each source document names its own `type`
 * (the farm folk are farmers, dogs and a kid).
 */
export const PACKS = [
  { file: "turkeys", out: PACK_NAMES.turkeys, collection: "actors", type: "Actor", subtype: "turkey" },
  { file: "farm-folk", out: PACK_NAMES.folk, collection: "actors", type: "Actor", subtype: null },
  { file: "farms", out: PACK_NAMES.farms, collection: "scenes", type: "Scene", subtype: null },
  { file: "rulebook", out: PACK_NAMES.rules, collection: "journal", type: "JournalEntry", subtype: null },
  { file: "tables", out: PACK_NAMES.tables, collection: "tables", type: "RollTable", subtype: null },
  { file: "macros", out: PACK_NAMES.macros, collection: "macros", type: "Macro", subtype: null }
];

/**
 * Embedded collections per primary collection, as the foundryvtt-cli stores them
 * (its HIERARCHY): the compiled document always carries every one of them (empty
 * when there are none), so the derived document must too.
 */
export const EMBEDDED = {
  actors: ["items", "effects"],
  journal: ["pages", "categories"],
  tables: ["results"],
  scenes: ["drawings", "tokens", "levels", "lights", "notes", "regions", "sounds", "templates", "tiles", "walls"],
  macros: []
};

/** Deterministic 16-char alphanumeric id from a namespace + key (sha256 hex prefix). */
export function makeId(...parts) {
  return createHash("sha256").update(parts.join("::")).digest("hex").slice(0, 16);
}

/**
 * Read a pack's source: one JSON file per document under packs/_source/<name>/,
 * returned as an array sorted by filename (deterministic for reproducible builds).
 */
export function readSource(file) {
  const dir = join(SRC, file);
  if (!existsSync(dir)) throw new Error(`pack source folder missing: packs/_source/${file}/`);
  return readdirSync(dir)
    .filter(f => f.endsWith(".json"))
    .sort()
    .map(f => JSON.parse(readFileSync(join(dir, f), "utf8")));
}

const manifest = JSON.parse(readFileSync(join(ROOT, "system.json"), "utf8"));

/** Provenance stamped on every document. */
export const STATS = {
  // Oldest core whose schema this data fits: v13 refuses to import documents
  // stamped with a newer core, and v14 migrates up from here.
  coreVersion: "13.351",
  systemId: manifest.id,
  systemVersion: manifest.version,
  createdTime: null,
  modifiedTime: null,
  lastModifiedBy: null,
  compendiumSource: null,
  duplicateSource: null,
  exportSource: null
};

/**
 * Turn one of our source docs into a CLI-ready document (deterministic `_id`,
 * `_key`, `_stats`, inline embedded pages). Shared by the build and validator.
 */
export function toCliDoc(def, raw, index) {
  const id = makeId(def.out, raw.key);
  const sort = (index + 1) * 100;

  if (def.type === "JournalEntry") {
    return {
      _id: id,
      _key: `!journal!${id}`,
      name: raw.name,
      pages: (raw.pages ?? []).map((page, p) => {
        const pid = makeId(def.out, raw.key, page.key ?? String(p));
        return {
          _id: pid,
          _key: `!journal.pages!${id}.${pid}`,
          name: page.name,
          type: page.type ?? "text",
          title: page.title ?? { show: true, level: 1 },
          text: page.text ?? { format: 1, content: "" },
          sort: (p + 1) * 100,
          ownership: { default: -1 },
          flags: {},
          _stats: STATS
        };
      }),
      categories: [],
      folder: null,
      sort,
      ownership: { default: 0 },
      flags: {},
      _stats: STATS
    };
  }

  // Actors, Scenes, RollTables, Macros: the source is the document's own data
  // (minus ids). Embedded documents (a table's results) get ids from their own
  // `key` (or their index) and the CLI's sublevel key, e.g. !tables.results!<table>.<result>.
  const { key, ...data } = raw;
  const doc = { _id: id, _key: `!${def.collection}!${id}`, ...data };
  if (def.type === "Actor") {
    const type = raw.type ?? def.subtype;
    if (def.subtype && type !== def.subtype) throw new Error(`${def.out}: "${key}" is a ${type}, but the pack holds ${def.subtype}s`);
    if (!type) throw new Error(`${def.out}: "${key}" has no type`);
    doc.type = type;
    doc.system = raw.system ?? {};
    // null (not "") disables a token bar; "" would be cleaned back to the
    // system's primaryTokenAttribute.
    doc.prototypeToken = { bar1: { attribute: null }, bar2: { attribute: null }, ...raw.prototypeToken };
  }
  for (const coll of EMBEDDED[def.collection] ?? []) {
    doc[coll] = (raw[coll] ?? []).map((e, j) => {
      const { key: ekey, ...edata } = e;
      const eid = makeId(def.out, key, ekey ?? String(j));
      return { _id: eid, _key: `!${def.collection}.${coll}!${id}.${eid}`, ...edata, flags: edata.flags ?? {}, _stats: STATS };
    });
  }
  Object.assign(doc, { folder: null, sort, ownership: { default: 0 }, flags: raw.flags ?? {}, _stats: STATS });
  return doc;
}
