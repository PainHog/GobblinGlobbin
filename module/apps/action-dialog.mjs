/**
 * Taking an action (docs/VTT-DESIGN.md §3.2): one small dialog asks where to, who
 * for, and, when a roll is coming, Puff Up and Lend a Wing. Then the action goes to
 * the GM (module/vtt/ops.mjs) and comes back as a chat card.
 */
import { OPS } from "../contracts.mjs";
import { GG } from "../config.mjs";
import * as G from "../logic/game.mjs";
import * as R from "../logic/rules.mjs";
import { getState } from "../vtt/store.mjs";
import { request } from "../vtt/ops.mjs";
import { ACTION_LABEL } from "./view.mjs";

const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const el = (button, name) => button?.form?.elements?.[name] ?? null;

/** The target a turkey's own roll will need for this intent (null: no roll). */
export function rollTarget(S, t, intent) {
  switch (intent.kind) {
    case "sneak": return G.sneakTarget(S, intent.then ? [t.zone, intent.to, intent.then] : [t.zone, intent.to]);
    case "hunker": return t.spot === null && G.farmerIn(S, t.zone) ? GG.roll.targets.hunker : null;
    case "prank": return S.farm.pranks.find(p => p.id === intent.prank)?.target ?? null;
    case "rescue": return GG.roll.targets.rescue;
    case "scram": return GG.roll.targets.scram + S.diff.quick;
    default: return null;
  }
}

/** The Puff Up / Lend a Wing part of the form. */
function rollOptions(S, t, kind) {
  const canPush = kind !== "rescue" && R.canPush(t.urge);
  const helpers = S.turkeys.filter(o => G.canHelp(S, t, o));
  const push = canPush ? `<label class="gg-check"><input type="checkbox" name="push"> Puff Up: +1 white die (urge ${t.urge} → ${t.urge + 1})</label>` : "";
  const help = helpers.length
    ? `<label class="gg-field">Lend a Wing: <select name="helper"><option value="">No thanks</option>${helpers.map(h => `<option value="${h.id}">${esc(h.name)} (urge ${h.urge})</option>`).join("")}</select></label>`
    : "";
  return push || help ? `<fieldset class="gg-roll-options"><legend>Before you roll</legend>${push}${help}</fieldset>` : "";
}

const pre = button => ({ push: !!el(button, "push")?.checked, helper: el(button, "helper")?.value || null });

/** The form for one action kind: returns { content, read(button) → { intent, pre } } or null. */
function formFor(S, t, kind) {
  const legal = G.legalActions(S, t.id).filter(a => a.kind === kind && !a.why);
  if (!legal.length) return null;
  const zone = z => esc(S.farm.zones[z].name);
  const target = n => (n ? `${n}+` : "no roll");
  switch (kind) {
    case "sneak": {
      const one = legal.filter(a => !a.then);
      const two = legal.filter(a => a.then);
      const opts = one.map((a, i) => `<label class="gg-radio"><input type="radio" name="to" value="${a.to}"${i ? "" : " checked"}> ${zone(a.to)} <span class="gg-target">${target(a.target)}</span></label>`).join("");
      const soft = two.length
        ? `<label class="gg-field">Soft Steps, and on to: <select name="then"><option value="">(stop there)</option>${two.map(a => `<option value="${a.to}>${a.then}">${zone(a.to)} → ${zone(a.then)} (${target(a.target)})</option>`).join("")}</select></label>`
        : "";
      return {
        content: `<p>Where does <strong>${esc(t.name)}</strong> sneak?</p>${opts}${soft}${rollOptions(S, t, kind)}`,
        read: b => {
          const then = el(b, "then")?.value;
          if (then) { const [to, th] = then.split(">"); return { intent: { kind, to, then: th }, pre: pre(b) }; }
          return { intent: { kind, to: el(b, "to")?.value ?? one[0].to }, pre: pre(b) };
        }
      };
    }
    case "hunker": {
      const friends = legal.filter(a => a.friend);
      const opts = [`<label class="gg-radio"><input type="radio" name="friend" value="" checked> Calm myself down (−${t.knack === "coolHead" ? GG.urge.hunkerCoolHead : GG.urge.hunker} urge)</label>`,
        ...friends.map(a => `<label class="gg-radio"><input type="radio" name="friend" value="${a.friend}"> Calm ${esc(G.turkey(S, a.friend).name)} down (urge ${G.turkey(S, a.friend).urge})</label>`)].join("");
      const tgt = rollTarget(S, t, { kind });
      return {
        content: `<p><strong>${esc(t.name)}</strong> hunkers down${tgt ? ` (the farmer is right here: ${tgt}+ to hide)` : ""}.</p>${opts}${tgt ? rollOptions(S, t, kind) : ""}`,
        read: b => ({ intent: { kind, friend: el(b, "friend")?.value || undefined }, pre: pre(b) })
      };
    }
    case "prank": {
      const p = S.farm.pranks.find(x => x.id === legal[0].prank);
      return {
        content: `<p><strong>${esc(p.name)}</strong>: ${p.target}+, ${S.progress[p.id]} of ${p.need} boxes ticked; the clock jumps ${p.clock} when it happens.</p>${rollOptions(S, t, kind)}`,
        read: b => ({ intent: { kind, prank: p.id }, pre: pre(b) })
      };
    }
    case "rescue": {
      const opts = legal.map((a, i) => `<label class="gg-radio"><input type="radio" name="friend" value="${a.friend}"${i ? "" : " checked"}> ${esc(G.turkey(S, a.friend).name)}</label>`).join("");
      return {
        content: `<p><strong>${esc(t.name)}</strong> gobbles on purpose (urge to 0, ${GG.roll.targets.rescue}+, no red dice) so the farmer looks the other way. For whom?</p>${opts}${rollOptions(S, t, kind)}`,
        read: b => ({ intent: { kind, friend: el(b, "friend")?.value ?? legal[0].friend }, pre: pre(b) })
      };
    }
    case "scram":
      return {
        content: `<p><strong>${esc(t.name)}</strong> runs for it! ${GG.roll.targets.scram + S.diff.quick}+ to get away.</p>${rollOptions(S, t, kind)}`,
        read: b => ({ intent: { kind }, pre: pre(b) })
      };
    case "letItOut":
      return {
        content: `<p><strong>${esc(t.name)}</strong> lets out a big gobble on purpose: urge back to 0${G.farmerIn(S, t.zone) ? ", <strong>and the farmer is right here, so that's Spotted!</strong>" : ", and a “Huh?” token where you are."}</p>`,
        read: () => ({ intent: { kind }, pre: null })
      };
    default: return null;
  }
}

/** Open the dialog for one of a turkey's actions, then send it to the GM. */
export async function startAction(turkeyId, kind) {
  const S = getState();
  if (!S) return null;
  const t = G.turkey(S, turkeyId);
  const form = formFor(S, t, kind);
  if (!form) { ui.notifications.warn(`${t?.name ?? "That turkey"} can't ${ACTION_LABEL[kind]?.toLowerCase() ?? kind} right now.`); return null; }
  const answer = await foundry.applications.api.DialogV2.wait({
    window: { title: `${t.name}: ${ACTION_LABEL[kind]}` },
    classes: ["gobble-gobbled", "gg-action-dialog"],
    content: form.content,
    rejectClose: false,
    buttons: [
      { action: "go", label: ACTION_LABEL[kind], default: true, callback: (_e, button) => form.read(button) },
      { action: "cancel", label: "Cancel", callback: () => null }
    ]
  });
  if (!answer?.intent) return null;
  return request(OPS.act, { turkeyId, intent: answer.intent, pre: answer.pre });
}
