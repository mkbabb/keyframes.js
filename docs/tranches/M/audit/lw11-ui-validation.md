# L.W11 UI validation + hardening — the appearance/interaction axis

**Date:** 2026-06-17 · **Tree:** `tranche-l-dev` · **Method:** an independent live
oracle over the freshly-built `dist/gh-pages` (screenshots + per-scene marker/visibility/
lighting/animation-advance probes via `scripts/lib/demo-driver.mjs`, plus an 11-agent
adversarial workflow), explicitly **NOT trusting the green gates** — the standing lesson
(`[[feedback_gate_blindspot_appearance_axis]]`) + the M audit both hold that green
source-shape gates miss appearance/interaction/state.

## The question

"Did all the L.W11 UI changes land — the new animations, new lighting, new frontend
design hierarchy, the glass-ui primitives?" L.W11 (`4686aa4`, the "instrument language")
shipped 9 engine-dogfooded eggs + a per-scene instrument over 93 demo files (3,583 +).

## Verdict — overwhelmingly LANDED; two eggs were silently dead (now CURED)

| Scene | Instrument | Lighting | Animation / Egg |
|---|---|---|---|
| home | ✅ mega-serif + `.kf-source-egg` typing card | — | ⚠️→✅ **hero lift was DEAD, fixed** |
| cube | ✅ re-lit die + axes + Euler chip | ✅ key-light lacquer (faces' `--lit` tracks attitude on drag) | ✅ dblclick roll fires `--spin-energy` |
| amiga | ✅ Boing ball + gauge | ✅ CRT scanlines/vignette (real `oklab` gradients) | ✅ boot on re-entry |
| square | ✅ "Transform" gauge + drag-box | — | ✅ palette-sweep on dblclick |
| easing | ✅ bezier editor + hero stage | — | ⚠️→✅ **trace-smear was DEAD, fixed**; ball-sweep ✅ |
| spring | ✅ SpringProgress gauge + 26-stop `linear()` plot | — | ✅ derby (Δleft ≥ 20px measured) |
| sequence | ✅ stagger×5 axis + playhead | — | ✅ lane-detonate cascade |
| motion-path | ✅ offset-path + traveller + live artifact | — | ✅ handle-deform / traveller |

**Glass-ui primitives — SOLID and live, but consumed-from-published (NOT new in L).**
50 distinct glass-ui components across 46 demo files; live-confirmed in the DOM:
`ChromeDock` (top, `backdrop-filter: blur(9px)`), `TransportDock` (bottom), glass `Card`
(`blur(8px) saturate(1.05)`), `Select` (StatusDot portal), `SegmentedTabs` (pill),
`ToggleChip`, `MetricBadge`, `AnimatedDigit`, `GlassPanel`, `Slider`. `git diff
29bf376~1..529fcfd` shows **zero** added `from @mkbabb/glass-ui` imports in the L range —
the L UI consumed the existing glass-ui `~4.0.0` surface; **new glass-ui primitives are
the glass-ui BB tranche's domain** (inv-16). The `AnimationMenuBar → TransportDock` rename
landed in J.W2 (`7023e15`), not L.

**Design hierarchy (4 pillars):** GLASS ✅, MATHEMATICS ✅ (bezier/spring/matrix/perceptual
overlays all present), CRAYON-PRESERVATION ✅ (`--face-1..6` resolve `#f00c…#0ffc`,
`--amiga-red #f04242`, every hue intact), TYPOGRAPHY ⚠️→✅ (**Fira Code was not loading,
fixed**), PAPER ◐ (the J.W7a `--graph-*` substrate renders; the L.W11 grain/drift/vignette
*amplification* is proposal-pending-TASTE, verdict UNSET — not a shipped-broken defect).

## The confirmed defects + the cures (all re-validated)

### 1. HIGH — home hero-lift silently dead → CURED
`useHeroSourceEgg.ts` authored the lift as `fromKeyframes({transform:"translateY(-22px)"})`
— a **function-STRING** value that value.js's `flattenObject` drops the `translateY` wrapper
from, so the engine wrote `''` to `.hero-display`. Independently reproduced (jsdom):
`[STRING transform] distinct: 0` vs `[OBJECT transform] distinct: 8` vs `[opacity] 11`,
`[left] 11`. **Cure:** parse the literal CSS the card displays via `fromString(FULL_SOURCE)`
— the truest dogfood (source-in === what-runs) and the working CSS-grammar path
(`[fromString translateY] → translateY(0px)…-22px…0px`). **Re-validated live:**
`.hero-display` max |translateY| = **21.98px**.

### 2. HIGH — easing trace-smear silently dead → CURED
`useEasingTraceSmear.kickFromPoints` set the smear target then `queueMicrotask(() =>
smear.setTarget(0))` — the microtask fires before any rAF frame, so `current` never
departed 0 (`--trace-smear` written `0.00px` every frame). Compounded by `play()` carrying
no `onFrame`, so `setTarget`'s auto-resume never fired after settle. **Cure:** an impulse —
`reset(peak)` (spike `current`), `setTarget(0)` (relax), `play()` (re-drive the managed
loop). **Re-validated** (composable): `kickFromPoints` spikes `amount()` 0 → **1.0**; the
live `--trace-smear:0` was a synthetic SVG-CTM pointer-drag harness limit, not the cure.

### 3. HIGH — Fira Code mono never loaded → CURED
The demo declared `--font-mono: "Fira Code"` but `@/styles/style.css` imported only
`@mkbabb/glass-ui/styles` — which **omits the woff2 corpus by design** (glass-ui ships it
separately at `@mkbabb/glass-ui/styles/fonts`, self-contained base64). All mono surfaces
(dock, axes, code, gauges) rendered SF Mono/Menlo fallback. **Cure:** add `@import
"@mkbabb/glass-ui/styles/fonts"` + correct the false index.html comment. **Re-validated
live:** `Fira Code 300 700 loaded`, `document.fonts.check('14px "Fira Code"') = true`,
mono surfaces compute `"Fira Code", monospace`.

## The gate-honesty finding (the root cause the dead eggs slipped through)

The gate suite is **mixed**, not uniformly proxy:
- **REAL-observable (genuinely bite):** `proof:appearance-suffusion` (the gold standard —
  `getComputedStyle` colour/font assertions), `proof:scene-parity` (real pointer drags +
  computed `offset-distance`/aria), `proof:easter-egg` (drives real events, asserts class).
- **PROXY (let the dead eggs ship green):** `proof:design-refinement`'s browser half was a
  `re.test(el.closest('[class]').outerHTML)` string-presence check that never fired the egg
  or sampled its effect; `proof:crayon-preserved` is a pure source-text parser (never opens
  a browser); `proof:visual-lock` is observe-only in CI AND masks the live-motion regions
  where the new eggs live.

**Hardening applied this round (the two cured eggs, so they cannot regress green):**
- `proof:design-refinement` — the **home arm is now a REAL observable**: it drives the lift
  and asserts `.hero-display` computed transform departs `none` (max |translateY| ≥ 4px).
  Green-on-cure (21.98px); born-RED on the dropped-string-transform breach by construction.
- `test/easing-trace-smear.test.ts` — a deterministic vitest gate on the smear impulse
  (inv-M-two-axis: a logic property closes via a fast node gate, not a flaky browser drag).

## The fold ledger (deferred → their proper homes; NOT fixed this round)

| Item | Sev | Home |
|---|---|---|
| `fromKeyframes({transform:"<fn-string>"})` drops the wrapper at flatten (repro on disk) | HIGH | **M Band-B / value.js-O** — the canonical CSS form must work; the round-trip breach class the L gates missed |
| The 6 other `proof:design-refinement` arms + `proof:crayon-preserved` browser arm are still proxies | HIGH | **M Band-A · inv-M-observable-truth** — the gate reform (drive + sample, per scene); the eggs are CONFIRMED live, only the gates are proxies |
| `proof:visual-lock` observe-only in CI + masks the egg regions | MED | **M Band-A** |
| backdrop-filter: built CSS drops the standard prop + malforms `-webkit-` (missing space) on `.kf-source-egg` | MED | demo build-config (lightningcss/vite css target) — investigate |
| PAPER pillar amplification (grain/drift/vignette) absent | — | proposal pending the user's TASTE verdict (L.W11 slot UNSET) — not shipped-broken |
| Instrument Serif italic face unloaded | LOW | record (LCP-neutral; upright loads) |
| glass-ui 4.0.0 peer `value.js ^0.10\|\|^0.11` vs 0.13 | LOW | constellation handoff (inv-16; the M Band-C deploy unblock) |
| demo/CLAUDE.md still says `AnimationMenuBar` (renamed `TransportDock`) | LOW | doc staleness |
