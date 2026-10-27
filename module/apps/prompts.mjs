/**
 * The quick questions the engine asks a player (docs/VTT-DESIGN.md §3): Puff Up and
 * Lend a Wing before a roll, a Feather after a gobble, which spot to hide in, where
 * a Great or a Scram takes you. Each one closes itself after the timeout, and the
 * GM's client then takes the default.
 */
import { GG } from "../config.mjs";

const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ROLL_WHAT = {
  sneak: "sneak", hunker: "hide", prank: "pull the prank", rescue: "Gobble for a Friend", scram: "Scram",
  hide: "stay hidden (the farmer is looking!)", sniff: "fool the dog's nose"
};

const api = () => foundry.applications.api;

/** Show a DialogV2 and resolve with its answer, or null after `secs` seconds (0 = wait forever). */
async function ask(options, secs) {
  let dialog = null;
  const waiting = api().DialogV2.wait({
    rejectClose: false,
    modal: false,
    ...options,
    window: { title: options.title ?? "Don't Get Gobble Gobbled", ...(options.window ?? {}) },
    classes: ["gobble-gobbled", "gg-prompt"],
    render: (_ev, d) => { dialog = d; }
  });
  if (!secs) return (await waiting) ?? null;
  let timer;
  const late = new Promise(res => { timer = setTimeout(() => { dialog?.close?.(); res(null); }, secs * 1000); });
  const out = await Promise.race([waiting, late]);
  clearTimeout(timer);
  return out ?? null;
}

const formValue = (button, name) => button?.form?.elements?.[name] ?? button?.form?.elements?.namedItem?.(name) ?? null;

/** Show one prompt (payload from module/vtt/io.mjs describe) and return the answer. */
export async function showPrompt(p, secs = 30) {
  const tip = secs ? `<p class="gg-timer">${secs} seconds to choose, or the flock decides.</p>` : "";
  switch (p.kind) {
    case "roll": {
      const push = p.canPush ? `<label class="gg-check"><input type="checkbox" name="push"> Puff Up: +1 white die (urge ${p.urge} → ${p.urge + 1})</label>` : "";
      const help = p.helpers.length
        ? `<label class="gg-field">Lend a Wing: <select name="helper"><option value="">No thanks</option>${p.helpers.map(h => `<option value="${esc(h.id)}">${esc(h.name)} (urge ${h.urge})</option>`).join("")}</select></label>`
        : "";
      return ask({
        title: `${p.name} rolls`,
        content: `<p><strong>${esc(p.name)}</strong> must roll ${p.target}+ to ${ROLL_WHAT[p.rollKind] ?? "roll"}.</p>${push}${help}${tip}`,
        buttons: [{
          action: "roll", label: "Roll!", default: true,
          callback: (_e, button) => ({ push: !!formValue(button, "push")?.checked, helper: formValue(button, "helper")?.value || null })
        }]
      }, secs);
    }
    case "feather": {
      const warn = p.farmerHere ? " The farmer is right there: without a Feather, that's Spotted." : "";
      return ask({
        title: "GOBBLE!",
        content: `<p><strong>${esc(p.name)}</strong> gobbled!${warn} Spend a Feather to swallow it? (${p.left} left)</p>${tip}`,
        buttons: [
          { action: "spend", label: "Spend a Feather", default: !!p.farmerHere, callback: () => true },
          { action: "keep", label: "Let it out", default: !p.farmerHere, callback: () => false }
        ]
      }, secs);
    }
    case "spot":
      return ask({
        title: `${p.name} hides`,
        content: `<p>Where does <strong>${esc(p.name)}</strong> hide in ${esc(p.zoneName)}?</p>${tip}`,
        buttons: p.spots.map((s, k) => ({ action: `spot${s.i}`, label: `${s.name} (${s.cover}+, ${s.room - s.used} room)`, default: k === 0, callback: () => s.i }))
      }, secs);
    case "greatStep":
      return ask({
        title: "Great!",
        content: `<p>A Great! <strong>${esc(p.name)}</strong> can keep going one more zone from ${esc(p.from)}.</p>${tip}`,
        buttons: [
          { action: "stay", label: "Stay here", default: true, callback: () => null },
          ...p.zones.map(z => ({ action: `go-${z.id}`, label: `On to ${z.name}`, callback: () => z.id }))
        ]
      }, secs);
    case "scramStep":
      return ask({
        title: p.second ? "Keep running?" : "Scram!",
        content: `<p><strong>${esc(p.name)}</strong> ${p.second ? "can keep running" : "runs for it"}. Which way?</p>${tip}`,
        buttons: [
          ...(p.second ? [{ action: "stop", label: "Stop here", callback: () => null }] : []),
          ...p.zones.map((z, k) => ({ action: `run-${z.id}`, label: z.name, default: !p.second && k === 0, callback: () => z.id }))
        ]
      }, secs);
    default:
      return null;
  }
}

/** The query handler on every client: the GM asks, this player answers. */
export function promptHandler(data) {
  return showPrompt(data?.payload ?? data, Number(data?.timeout ?? 30));
}

export { GG };
