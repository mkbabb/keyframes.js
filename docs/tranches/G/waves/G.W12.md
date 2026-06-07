# G.W12 — The dock affordance (the kf-demo D.W5 close + the glass-ui-HANDOFF)

**Phase:** IMPL — spec authored in DEV, awaits authorization (the D/E/F dev/impl
boundary) · **Class:** SHIP-in-G (the kf-demo half — rename + barrel deletion + mask
removal + dead-group collapse + the drifted-stub realign) + **glass-ui-HANDOFF** (the
mobile/full-bleed dock occlusion contract + the `--z-dock`-on-internal-layers fix =
GG-5-half / GG-1-of-X-1; the user drives glass-ui under relaxed inv-16, never re-mask
in the demo) · **Scope:** `demo/**` + `test/stubs/**` only — the dock dir
(`demo/@/components/custom/dock/TopDock.vue` → `ChromeDock.vue`,
`demo/@/components/custom/dock/index.ts` DELETED), the one direct dock-primitive
importer that consumed the barrel
(`demo/@/components/custom/animation-controls/AnimationMenuBar.vue`, + any other
`from "@components/.../dock"`/`from "."` barrel consumer), the drifted vitest stub
(`test/stubs/glass-ui-motion-core.ts`) + the gate scripts (`scripts/occlusion-gate.mjs`
re-run mask-free + a `scripts/proof-decomposition.mjs` barrel-absent clause) — ZERO
library (`src/**`) or CI edit · **DAG: depends on Band 1 — the glass-ui re-pin (`G.W2`
/ GG-1) MUST land first** (the rename + the `:always-expanded` removal both assume the
PUBLISHED `^3.3.0` rebuilt dock, not the dirty `file:` link); the dock occlusion
HANDOFF is sequenced behind glass-ui's rebuilt dock contract · **Gated on:** the
re-pin (`G.W2`) + keyframes' own green CI (inv-27). Band-5 sibling of `G.W10`
(idiom sweep) + `G.W11` (usability), file-disjoint save the shared `AnimationMenuBar.vue`
(W12 swaps its dock-barrel import; W11 changes its Play aria-label — disjoint lines).

**Title.** *The D.W5 dock close was the ONE legitimately-blocked carry, gated on
"glass-ui PUBLISHING 3.3.0." That gate is now OPEN (3.3.0 published; the glass-ui dock
rebuilt from first principles). Close the kf-demo half: rename `TopDock→ChromeDock`,
DELETE the `dock/index.ts` pass-through re-export barrel (import glass-ui dock
primitives directly), REMOVE the `:always-expanded="isMobile"` occlusion mask (let
glass-ui's rebuilt dock own the no-occlusion contract), collapse the dead single-layer
`DockLayerGroup`/`activeLayer` costume, and realign the drifted vitest motion-core stub
to glass-ui's real `ViewTransitionResult`. The mobile/full-bleed occlusion + the
`--z-dock`-on-glass-ui-internal-layers fix are glass-ui-HANDOFF (GG-5).*

This is the §Mandate's **no-mask, no-pass-through-barrel, no-dead-costume discipline**,
landed on the dock the moment its external blocker GONE (`a-glass-ui §3`,
`a-demo-playwright X-1`). The dock is the #1 system-wide usability gap
(`a-demo-playwright X-1`: collapsed 15px sliver + hover-gated + occluded), and per the
binding MEMORY contract (`feedback_glass_ui_root_changes`, `project_dock_doubleclick`)
its ROOT fix lives in glass-ui, never patched in the demo — so the wave is a clean
split: the demo half SHIPs (rename/barrel/mask/costume/stub), the dock-root half is
glass-ui-HANDOFF. The §Mandate demands G either drives the unblock OR records the
explicit external blocker — the blocker is GONE, so this is a genuine SHIP, NOT a
re-defer.

**The Mandate spine (binding — `_SYNTHESIS-gap-scorecard §THESIS` + the G charter).**
NO quick solution / NO workaround: the `:always-expanded` mask is REMOVED, not kept as
a demo-side crutch — the occlusion it dodges is glass-ui's rebuilt dock to own (the
mask is the escape-hatch the §Mandate excises). NO legacy: the `dock/index.ts`
pass-through barrel is DELETED (the §Mandate forbids re-export barrels that exist only
to re-route — `a-glass-ui §3` verified it pure pass-through); `TopDock` is RENAMED to
the accurate `ChromeDock` (no alias left beside it); the dead single-layer
`DockLayerGroup` + the constant `activeLayer` computed are EXCISED (a single-layer dock
wearing the multi-layer-group costume); the drifted stub's phantom `{types}` param +
native-shape return are STRIPPED (an ungated test-double fiction). KISS · DRY: the
dock primitives are imported DIRECTLY from `@mkbabb/glass-ui/dock` (one import path,
not a barrel that re-routes the same names). Measure-first does NOT bind (a correctness
+ affordance fix gated by a HARD occlusion assertion, not a perf claim). Styling
ISOMORPHIC where the demo half is inert; the dock's VISUAL affordance change (no more
15px sliver, no more occlusion) is glass-ui's rebuilt-dock delta, the INTENDED
correction the HANDOFF lands. inv-16 RELAXED for G impl: glass-ui is its own surface —
GG-5-half (mobile occlusion) + the `--z-dock` internal-layer fix are HAND-OFF-tagged,
each its own surface. inv ε: every claim below cites `file:line`, source-verified on
`tranche-g-dev`, not asserted. Cross-repo: the mobile/full-bleed dock occlusion + the
`--z-dock` internal-layer fix are glass-ui-HANDOFF (`a-glass-ui GG-5`,
`a-demo-playwright X-1`); GG-6 (the one reka `SelectIcon` reach) is a demo-local KILL
folded here as the same dock-surface cleanup.

**Provenance.** `a-demo-playwright X-1` (the dock is the weakest affordance
system-wide — collapsed 15px sliver + hover-gated `pointer-events:none` + the
`--z-dock` token NOT applied to glass-ui's internal dock layers so the full-bleed
scene viewport wins the hit-test; HANDOFF root in glass-ui), `a-glass-ui GG-5` (D.W5
unblocked by 3.3.0: rename `TopDock→ChromeDock`, delete `dock/index.ts` barrel, remove
`:always-expanded` mask, collapse the dead single-layer group; SHIP kf half +
glass-ui-HANDOFF mobile occlusion), `GG-2` (the vitest motion-core stub DRIFTED:
phantom `_options?:{types}` + native-`ViewTransition` return ≠ glass-ui's
`ViewTransitionResult`; SHIP test-infra), `GG-6` (the one direct `reka-ui` `SelectIcon`
import past the glass-ui surface; demo-local KILL or glass-ui-HANDOFF re-export).
Synthesised at `_SYNTHESIS-frontend §2 TIER 5` (F-D1/F-D2/F-D3/F-D4) +
`_SYNTHESIS-gap-scorecard §1` (glass-ui row: "D.W5 gate OPEN … rename, delete the
barrel, REMOVE `:always-expanded` mask, collapse dead group; realign the drifted
vitest VT stub") + `§2 Band 5 G.W12`.

---

## § State, verified (not asserted)

The live facts, `grep`- and read-confirmed on `tranche-g-dev`:

1. **The D.W5 gate is OPEN — glass-ui 3.3.0 is PUBLISHED; the kf-demo is STILL
   pre-rename.** Verified live (`a-glass-ui §0/§3`): `npm view @mkbabb/glass-ui
   version` → `3.3.0` (published), and the glass-ui dock was rebuilt from first
   principles. The kf demo dir `demo/@/components/custom/dock/` contains
   **`TopDock.vue` + `index.ts` ONLY** — NO `ChromeDock.vue` (verified `ls`),
   confirming D.W5's "still PRE-rename." (The glass-ui `file:`-link → `^3.3.0` re-pin
   is GG-1, routed to the dep-re-pin spine `G.W2` — this wave's DAG-dependency, NOT
   double-owned here.)

2. **`dock/index.ts` is a pure pass-through re-export barrel.** Verified live — the
   file is exactly:
   ```ts
   export { GlassDock, DockLayerGroup } from "@mkbabb/glass-ui/dock";   // pass-through
   export { default as TopDock } from "./TopDock.vue";
   ```
   The `GlassDock, DockLayerGroup` re-export is pure pass-through; `TopDock.vue:7`
   imports `{ GlassDock, DockLayerGroup } from "."` (its OWN barrel) instead of from
   `@mkbabb/glass-ui/dock` directly (where the other dock primitives — `DockIconButton`,
   `DockLayer`, `DockSelectTrigger`, `StatusDot` — already come from). The §Mandate
   forbids "nested imports"/re-export barrels that exist only to re-route — this is the
   `dock/index.ts` deletion D.W5 named (`a-glass-ui §3`).

3. **The `:always-expanded="isMobile"` occlusion mask.** Verified live:
   `TopDock.vue:118` → `<GlassDock ref="dockRef" :collapse-delay="2500"
   :start-collapsed="true" :fit-content="true" :always-expanded="isMobile">` with
   `isMobile = useMediaQuery("(max-width: 1023px)")` (`TopDock.vue:65`). glass-ui's
   `GlassDock` ALREADY auto-derives always-expanded for vertical orientation
   (`a-glass-ui §3`: `alwaysExpanded = props.alwaysExpanded || orientation.value ===
   "vertical"`). The demo's `:always-expanded="isMobile"` is the occlusion-dodge mask
   DP-1 named for removal — it forces the dock permanently expanded on mobile to avoid
   the square/mobile dock-over-content overlap (inv δ, the HARD occlusion gate). That
   overlap is glass-ui's to solve in the rebuilt dock, NOT the demo's to mask
   (`a-glass-ui §3`).

4. **The dead single-layer group costume.** Verified live: `TopDock.vue:107-109`
   `const activeLayer = computed(() => { return "main"; })` — a CONSTANT wrapped in a
   `computed`, feeding a single `<DockLayer id="main">` (`TopDock.vue:120`) inside a
   `<DockLayerGroup :active="activeLayer" :show-rail="false">` (`TopDock.vue:119`). A
   single-layer dock wearing the multi-layer-group costume — either it uses the
   layer-group meaningfully (multiple `DockLayer`s) or it drops the group wrapper + the
   constant `computed` (`a-glass-ui §3`).

5. **The `--z-dock`-not-applied-to-internal-layers hit-test loss (HANDOFF root).**
   Verified live (`a-demo-playwright X-1`): the dock collapses to an unreadable ~15px
   sliver at rest (`fit-content` + `overflow:hidden`, inner label clipped); its
   expanded button layers (`.dock-layer--full`/`.dock-layer-group`/`.dock-layer-stack`)
   are `pointer-events:none` until a fragile hover-expand; and the `--z-dock` token is
   NOT actually applied to glass-ui's internal dock layers (they carry `z:auto`), so
   the later-painted full-bleed scene viewport wins the hit-test — `elementFromPoint`
   over EVERY top-dock control returns the scene `<div>`/`<main>`, not the control.
   Net: scene-switch + open-controls are hard to find AND hard to click (a
   sustained-hover race on desktop, a double-tap on touch). The demo's wrapper DOES set
   `z-dock` (`TopDock.vue:113` `class="… z-dock …"`), but the token does not reach
   glass-ui's internal layers — the fix is glass-ui-root (`a-demo-playwright X-1`,
   per MEMORY).

6. **The vitest motion-core stub has DRIFTED into a fiction.** Verified live: the demo
   tsc error is GONE (glass-ui 3.3.0 ships `dist/motion-core.d.ts`, `npx tsc --noEmit`
   exits 0 — `a-glass-ui §1`), but the vitest stub
   (`test/stubs/glass-ui-motion-core.ts`, aliased at `vitest.config.ts:17-19` so the
   glass-ui-FREE library gate can run the demo-encapsulation tests) declares
   `startViewTransition` with **(a)** a phantom `_options?: { types?: string[] }` param
   (`:20`) that does NOT exist on the real helper (it anticipates the H-1 `{types}`
   helper NEVER shipped, §State-7), and **(b)** the NATIVE `ViewTransition` return
   shape (`finished`/`ready`/`updateCallbackDone`/`skipTransition`, `:22-25,32-35`),
   NOT glass-ui's real `ViewTransitionResult` (`{ finished, transitioned }` —
   `a-glass-ui §1` cites `useViewTransition.d.ts:1-11,31`). The demo consumer reads only
   `.finished` (`useSceneTransition.ts:32`) so nothing breaks today — but the stub is an
   UNGATED fiction modeling a contract glass-ui does not honor; a test passing `types`
   or reading `.skipTransition()` would type-check green under vitest then FAIL the real
   build (`a-glass-ui §1`).

7. **GG-3 (the H-1 `{types}` helper) did NOT ship — so the stub leads a contract that
   doesn't exist.** Verified live (`a-glass-ui §2`): glass-ui's `startViewTransition`
   is still the bare-callback form `startViewTransition(mutate: () => void)`; no
   `{types}` object form, no `:active-view-transition-type()` CSS. The `{types}` half
   is glass-ui-HANDOFF (GG-3, routed to `G.WV`), NOT this wave — but it confirms the
   stub must FOLLOW the real helper, never lead it (§State 6).

8. **The one direct `reka-ui` `SelectIcon` reach (GG-6).** Verified live (`a-glass-ui
   §4`): exactly ONE direct `reka-ui` import in the demo —
   `AnimationMenuBar.vue:174` `import { SelectIcon } from "reka-ui"` — a chevron-slot
   primitive glass-ui consumes internally but does not re-export from its `./select`
   subpath. Every OTHER dialog/popover/select surface is idiomatic glass-ui
   (`SharePopover`, `KeyboardShortcutsModal`); this is the one seam where the demo
   couples to the headless basis instead of the glass-ui surface.

9. **The occlusion gate is a HARD assertion that must stay green mask-free.** Verified
   live: `scripts/occlusion-gate.mjs` (B inv δ) runs every page × {375,1280,1440} ×
   {controls closed, open} against the BUILT `dist/gh-pages/`, asserting (1) no
   horizontal overflow, (2) every subject renders non-blank, and (3) — promoted to a
   HARD failing assertion in C.W1 S2 — NO dock overlaps the subject's content rect (the
   per-scene `dockFloatAllowed` manifest: amiga=true; cube/home/square/easing/spring=
   false). It is the existing instrument for the mask removal: re-run with
   `:always-expanded` gone, it MUST stay green WITHOUT the crutch.

The wave's job: rename `TopDock→ChromeDock`, delete the `dock/index.ts` barrel (import
glass-ui dock primitives directly), remove the `:always-expanded` mask, collapse the
dead single-layer group, realign the vitest stub to `ViewTransitionResult`, KILL the
one reka `SelectIcon` reach — and HAND OFF the mobile/full-bleed dock occlusion + the
`--z-dock`-on-internal-layers fix to glass-ui (per MEMORY, never re-masked in the demo).

---

## § Goal

**What lands (kf-demo half — SHIP):**

- **`TopDock` renamed to `ChromeDock`.** `demo/@/components/custom/dock/TopDock.vue`
  → `ChromeDock.vue`; every importer updated; no `TopDock` alias survives. The name
  reads true (it is the chrome dock, not a "top" position descriptor).
- **`dock/index.ts` pass-through barrel DELETED.** `ChromeDock.vue` imports `{
  GlassDock, DockLayerGroup }` DIRECTLY from `@mkbabb/glass-ui/dock` (where the other
  dock primitives already come from — §State 2); every consumer that imported through
  the barrel imports the dock primitives directly OR `ChromeDock` from its SFC path. No
  re-route barrel remains.
- **The `:always-expanded="isMobile"` mask REMOVED.** `ChromeDock.vue:118` drops the
  `:always-expanded="isMobile"` prop (and `isMobile`/`useMediaQuery` if it has no other
  consumer); glass-ui's rebuilt dock owns the no-occlusion contract. The occlusion gate
  (§State 9) re-runs mask-free and stays green.
- **The dead single-layer group costume COLLAPSED.** The constant `activeLayer`
  computed (`ChromeDock.vue:107-109`) + the `<DockLayerGroup>` wrapper
  (`:119,:210`) are EXCISED (the single `<DockLayer id="main">` content lifts out), OR
  — if glass-ui's rebuilt dock requires a group host — the costume is reduced to the
  minimal real host with the constant computed removed. No constant-wrapped-in-computed
  remains.
- **The vitest motion-core stub REALIGNED to `ViewTransitionResult`.**
  `test/stubs/glass-ui-motion-core.ts`: strip the phantom `_options?: { types }` param
  (`:20`) and the native-shape return (`ready`/`updateCallbackDone`/`skipTransition`,
  `:22-25,32-35`); mirror glass-ui's real `{ finished, transitioned }`; keep the
  runtime no-op body (jsdom has no `document.startViewTransition`,
  `supportsViewTransitions()===false` is the faithful posture). The signature
  `satisfies typeof import("@mkbabb/glass-ui/motion-core")` so a future drift reds the
  type check.
- **The one reka `SelectIcon` reach KILLED.** `AnimationMenuBar.vue:174` replaces the
  raw `SelectIcon` with glass-ui's `DockSelectTrigger`/`SelectTrigger` (which already
  own the icon slot — `TopDock.vue:147` already uses `DockSelectTrigger`), verified
  pixel-identical. (If a genuine raw-primitive need remains, hand glass-ui the
  re-export ask — GG-6 alt; but lean demo-local KILL, `a-glass-ui §4`.)

**What HANDS OFF (glass-ui — the user drives under relaxed inv-16):**

- **The mobile/full-bleed dock occlusion contract (GG-5-half).** Once
  `:always-expanded` is removed, glass-ui's rebuilt dock must handle the
  mobile/square no-occlusion NATIVELY (browser-test on `square`/mobile). If a residual
  occlusion remains, it is fixed in the glass-ui dock ROOT — never re-masked in the
  demo (MEMORY `feedback_glass_ui_root_changes`).
- **The `--z-dock`-on-internal-layers + the hover-gated/15px-sliver affordance (= X-1,
  GG-5).** glass-ui applies `--z-dock` to its internal dock layers so the dock wins the
  hit-test over a full-bleed scene viewport, and addresses the 15px-sliver-at-rest +
  hover-gated `pointer-events:none` affordance. Root in glass-ui (per MEMORY).

**Why:** the dock is the #1 system-wide usability gap and its external blocker
(glass-ui 3.3.0 publishing) is GONE — so D.W5 is a genuine SHIP, not a re-defer. The
demo half retires the pass-through barrel, the inaccurate name, the occlusion mask, the
dead costume, and the drifted stub — every legacy/escape-hatch shape the §Mandate
excises — while the dock-root occlusion + `--z-dock` fix go to glass-ui where the
MEMORY contract binds them. The occlusion gate (a HARD assertion) re-run mask-free is
the lock: the dock must be occlusion-free WITHOUT the crutch.

**What does NOT land (recorded so no future lane re-raises):**
- **Re-masking any residual occlusion in the demo** — REJECTED (MEMORY
  `feedback_glass_ui_root_changes`: all dock changes live in glass-ui, never patched in
  the demo). If the mask-free occlusion gate reds, the fix is glass-ui-root (HANDOFF),
  NOT re-introducing `:always-expanded`.
- **GG-3 (the `{types}` helper + `:active-view-transition-type()` CSS)** — routed to
  `G.WV` glass-ui-HANDOFF (`a-glass-ui §2`); the stub realign FOLLOWS the real helper,
  never leads it (§State 7). Not this wave.
- **GG-4 (the demo scene-VT consuming `{types}`)** — BOOK, consumes GG-3
  (`a-glass-ui §2`). Not this wave.
- **The glass-ui consumption ALREADY-SOTA bulk** (`a-glass-ui §5`) — the spring-token
  cascade, `springLinearStops()` value.js-free enabler, motion-core SCC-boundary
  respect, the VT a11y focus-route + PRM degrade, the glass-ui Dialog/Popover/Select
  surface, the glass-ui-resident keyboard registry. UNTOUCHED. Manufacture NO work.

---

## § Scope

### S1 — rename `TopDock→ChromeDock` + DELETE the `dock/index.ts` pass-through barrel (`a-glass-ui GG-5`) — SHIP-in-G (the kf-demo D.W5 spine)

**WHAT:** rename `demo/@/components/custom/dock/TopDock.vue` → `ChromeDock.vue` and
update every importer. DELETE `demo/@/components/custom/dock/index.ts`; `ChromeDock.vue`
imports `{ GlassDock, DockLayerGroup }` directly from `@mkbabb/glass-ui/dock` (`:7`
currently `from "."`), joining the direct imports of the other dock primitives
(`:8-12`); every barrel consumer imports the dock primitives directly or `ChromeDock`
from its SFC path.

**WHY:** §State 1/2 — the gate is open (3.3.0 published) and the demo is still
pre-rename; the barrel is a pure pass-through re-route the §Mandate forbids, and
`TopDock.vue:7`'s self-barrel import is the precise nested-import the deletion targets.
The rename makes the name true; the barrel deletion removes the re-route. No alias, no
barrel survives.

### S2 — REMOVE the `:always-expanded` occlusion mask + collapse the dead single-layer group (`a-glass-ui GG-5`) — SHIP-in-G (the mask the gate re-runs without)

**WHAT:** drop `:always-expanded="isMobile"` from the `<GlassDock>` (`ChromeDock.vue:118`)
+ `isMobile`/`useMediaQuery("(max-width: 1023px)")` (`:65`) if otherwise unused. Excise
the constant `activeLayer` computed (`:107-109`) and the `<DockLayerGroup>` wrapper
(`:119,:210`) — lift the single `<DockLayer id="main">` content out — OR, if glass-ui's
rebuilt dock requires a group host, reduce to the minimal real host with the constant
computed removed.

**WHY:** §State 3/4 — the `:always-expanded="isMobile"` is the occlusion-dodge mask
DP-1 named for removal (glass-ui's dock already auto-expands vertical; the mask exists
only to dodge the mobile/square overlap glass-ui must own); the constant-wrapped
`computed` + the single-layer group is a multi-layer costume on a single-layer dock.
Both are excised so the demo stops masking glass-ui's contract and stops wearing a dead
costume. The occlusion gate (§State 9) re-runs mask-free as the lock.

### S3 — REALIGN the drifted vitest motion-core stub to `ViewTransitionResult` (`a-glass-ui GG-2`) — SHIP-in-G (test-infra correctness)

**WHAT:** in `test/stubs/glass-ui-motion-core.ts`, strip the phantom `_options?: {
types?: string[] }` param (`:20`) and the native-`ViewTransition` return shape
(`ready`/`updateCallbackDone`/`skipTransition`, `:22-25,32-35`); mirror glass-ui's
real `{ finished, transitioned }`; keep the runtime no-op body
(`supportsViewTransitions()===false`, the faithful jsdom posture, `:16`). Add `satisfies
typeof import("@mkbabb/glass-ui/motion-core")` so a drift reds the type check.

**WHY:** §State 6/7 — the stub is an ungated fiction: its phantom `{types}` param +
native-shape return model a contract glass-ui does not honor (a test passing `types`
or reading `.skipTransition()` type-checks green under vitest then fails the real
build). The §Mandate forbids the silent-handling test double. The `satisfies` makes the
stub FOLLOW the real helper; if GG-3 ever lands, the stub follows it, never leads it.

### S4 — KILL the one direct reka `SelectIcon` reach (`a-glass-ui GG-6`) — SHIP-in-G (demo-local, folds with the dock surface)

**WHAT:** replace `AnimationMenuBar.vue:174` `import { SelectIcon } from "reka-ui"`
with glass-ui's `DockSelectTrigger`/`SelectTrigger` (which own the icon slot —
`ChromeDock.vue:147` already uses `DockSelectTrigger`); verify the visual is identical
(the §Mandate isomorphic-styling rule). If a genuine raw-primitive need remains, hand
glass-ui the re-export ask (GG-6 alt) — but lean demo-local KILL.

**WHY:** §State 8 — the one seam where the demo couples to the headless basis
(`reka-ui`) instead of the glass-ui surface; every other select/dialog/popover is
idiomatic glass-ui. KILLing it (preferred) closes the seam with no cross-repo
dependency. Pixel-isomorphic.

> **HAND-OFF / RECORDED in this band — so no future lane re-litigates:**
> - **The mobile/full-bleed dock occlusion (GG-5-half) + the `--z-dock`-on-internal-
>   layers + 15px-sliver + hover-gated affordance (= X-1)** — **glass-ui-HANDOFF**
>   (root in glass-ui per MEMORY; the user drives under relaxed inv-16). Sequenced
>   behind glass-ui's rebuilt dock contract; NEVER re-masked in the demo.
> - **GG-3 (`{types}` helper + `:active-view-transition-type()` CSS)** — routed to
>   `G.WV` glass-ui-HANDOFF (`a-glass-ui §2`); the stub FOLLOWS it, never leads.
> - **GG-4 (demo scene-VT consuming `{types}`)** — BOOK, consumes GG-3.
> - **The glass-ui ALREADY-SOTA consumption bulk** (`a-glass-ui §5`) — UNTOUCHED;
>   manufacture NO work.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real re-runnable
instrument, not an assertion). **The spine is the EXISTING `occlusion-gate.mjs` HARD
assertion re-run mask-free + a `proof:decomposition` barrel-absent clause:**

1. **OCCLUSION GATE GREEN WITHOUT THE MASK.** `scripts/occlusion-gate.mjs` (the inv-δ
   HARD assertion — §State 9: no horizontal overflow, every subject renders non-blank,
   NO dock overlaps a non-`dockFloatAllowed` scene's content rect) re-runs across every
   page × {375,1280,1440} × {controls closed, open} with `:always-expanded` REMOVED
   and stays GREEN. **BITE:** if removing the mask re-introduces a mobile/square dock-
   over-content overlap, clause 3 of the gate reds — which is the SIGNAL the residual is
   glass-ui-HANDOFF (fix in the dock root, NOT by re-adding the mask). A re-added
   `:always-expanded` crutch is forbidden by clause 4. Green proves the rebuilt dock
   owns the no-occlusion contract natively.

2. **BARREL-ABSENT — no `dock/index.ts` pass-through barrel; `ChromeDock` present.**
   A `proof:decomposition` clause (the presence-grep family) asserts
   `demo/@/components/custom/dock/index.ts` does NOT exist (or carries no pure
   pass-through re-export), `ChromeDock.vue` exists, NO `TopDock` identifier survives in
   `demo/**`, and `ChromeDock.vue` imports `{ GlassDock, DockLayerGroup }` from
   `@mkbabb/glass-ui/dock` (not from a local barrel). **BITE:** reds TODAY (the barrel
   exists, `TopDock.vue:7` imports from `.`, no `ChromeDock` — §State 1/2); green after
   S1. Re-introducing the barrel or the `TopDock` name reds.

3. **STUB SATISFIES THE REAL CONTRACT — `satisfies typeof import(...)`.** The vitest
   stub carries `satisfies typeof import("@mkbabb/glass-ui/motion-core")` and `tsc`
   passes; the phantom `_options?:{types}` param + native-shape return are gone.
   **BITE:** reds TODAY at the type level once the `satisfies` is added (the current
   stub's signature ≠ the real `ViewTransitionResult` — §State 6); green after S3. Any
   future stub↔real drift reds the type check.

4. **NO direct reka reach + NO regression + the correction is inert beyond its
   intended deltas.** A `grep` clause asserts ZERO `from "reka-ui"` in `demo/`
   (`a-glass-ui §4` instrument); `npm test` stays green; the demo-encapsulation tests
   (which run against the realigned stub) stay green; the dock renders + functions
   byte-stable in the live scene (the affordance DELTA — no 15px sliver, no occlusion —
   is glass-ui's rebuilt-dock change, the intended correction); the demo builds.
   **BITE:** a re-added `:always-expanded` mask, a new `reka-ui` reach, any
   demo-encapsulation regression, any `src/**`/CI edit attributed to this wave, or any
   un-intended pixel/behaviour diff reds (the wave is `demo/**` + `test/stubs/**` only;
   the gate scripts are the lock).

---

## § Folds

Retires (by finding id):
- **`a-glass-ui GG-5`** (D.W5: rename `TopDock→ChromeDock`, delete `dock/index.ts`
  barrel, remove `:always-expanded` mask, collapse dead single-layer group — the kf
  half) — S1+S2 + gate clauses 1/2.
- **`a-glass-ui GG-2`** (the drifted vitest motion-core stub) — S3 + gate clause 3.
- **`a-glass-ui GG-6`** (the one direct reka `SelectIcon` reach — demo-local KILL) —
  S4 + gate clause 4.
- **`a-demo-playwright X-1`** (the kf-demo half — the mask removal that lets the
  occlusion gate run mask-free; the dock-root occlusion + `--z-dock` is the HANDOFF
  below) — S2 + gate clause 1.

**HAND-OFF (glass-ui — the user drives under relaxed inv-16, never re-masked in demo):**
- **`a-glass-ui GG-5`-half / `a-demo-playwright X-1` (root)** — the mobile/full-bleed
  dock occlusion contract + the `--z-dock`-on-glass-ui-internal-layers + the
  15px-sliver/hover-gated affordance. Sequenced behind glass-ui's rebuilt dock.

**RECORDED / REJECTED in this band (see §Scope callout):**
- **Re-masking residual occlusion in the demo** — REJECTED (MEMORY: dock fixes live
  in glass-ui root).
- **`a-glass-ui GG-3`** (`{types}` helper + directional CSS) — routed to `G.WV`
  glass-ui-HANDOFF; the stub follows it, never leads.
- **`a-glass-ui GG-4`** (demo scene-VT `{types}` consume) — BOOK, consumes GG-3.
- **`a-glass-ui §5`** (the ALREADY-SOTA glass-ui consumption bulk) — UNTOUCHED;
  manufacture NO work.

---

## § Design decisions (the trade-offs RESOLVED)

1. **The blocker is GONE — D.W5 is a SHIP, not a re-defer.** RESOLVED: D.W5 was the ONE
   legitimately-blocked carry, gated on glass-ui PUBLISHING 3.3.0 (`a-deferred-ledger`
   DP-1 / `a-glass-ui §3`). 3.3.0 is now published and the dock rebuilt (§State 1). The
   §Mandate demands G either drives the unblock OR records the explicit external
   blocker — the blocker is GONE, so the only Mandate-compliant move is to SHIP the kf
   half. Leaving it carried would be a P-invariant punt the ledger forbids.

2. **The fix is the GENUINE close, not a demo-side crutch — the dock root is glass-ui's
   per the MEMORY contract.** RESOLVED: the §Mandate forbids the escape-hatch beside the
   real fix. The `:always-expanded` mask IS the escape-hatch (it dodges occlusion the
   demo shouldn't own); removing it forces glass-ui's rebuilt dock to own the
   no-occlusion contract. The binding MEMORY (`feedback_glass_ui_root_changes`,
   `project_dock_doubleclick`) says ALL dock changes live in glass-ui, never patched in
   the demo — so the wave splits cleanly: the demo half SHIPs (barrel/name/mask/costume/
   stub/reka), the dock-root half (occlusion + `--z-dock` internal-layers) is
   glass-ui-HANDOFF. The occlusion gate re-run mask-free is the boundary lock: if it
   reds, that IS the signal the residual is glass-ui's, NOT a cue to re-mask.

3. **DELETE the barrel, import directly — a pure pass-through re-route is the
   no-legacy target.** RESOLVED: `dock/index.ts` re-exports `GlassDock`/`DockLayerGroup`
   from `@mkbabb/glass-ui/dock` and `TopDock` from its own SFC (§State 2). The first is
   a pure pass-through the §Mandate forbids (a barrel that exists only to re-route names
   already available at their source); `TopDock.vue:7` even imports from its OWN barrel
   instead of glass-ui directly (a nested import). Deleting the barrel + importing the
   dock primitives directly (where the other primitives already come from) is the
   no-nested-import / no-re-route-barrel discipline. The `ChromeDock` SFC is imported
   from its path, not re-exported through a barrel.

4. **Realign the stub to FOLLOW the real contract — a test double that lies is the
   silent-handling the Mandate excises.** RESOLVED: the stub's phantom `{types}` param +
   native-shape return model a glass-ui contract that does not exist (§State 6/7). A
   `satisfies typeof import(...)` makes the stub's signature provably match the real
   helper at compile time — so it follows the helper, never leads it; if GG-3 ever
   grows the `{types}` overload, the stub follows in one motion. The runtime no-op body
   stays (the faithful jsdom posture). This is the §Mandate's "fail explicitly, no
   weaker-alternative escape hatch" applied to test infra.

5. **GG-6 is a demo-local KILL, not a glass-ui re-export ask — lean local.** RESOLVED:
   the one reka `SelectIcon` reach (§State 8) is almost certainly replaceable with
   glass-ui's `DockSelectTrigger` (the demo dock already uses it), so the clean fix is
   demo-local — no cross-repo dependency, pixel-verified. Only if a genuine
   raw-primitive need remains does it become a glass-ui re-export HANDOFF (GG-6 alt).
   Lean local: one borderline import, not a systemic gap (`a-glass-ui §4`).

6. **DAG: this wave depends on the re-pin (`G.W2`/GG-1) — the rename assumes the
   published rebuilt dock.** RESOLVED: the glass-ui `file:`-link → `^3.3.0` re-pin is
   GG-1, the glass-ui leg of the dep-re-pin spine (`G.W2`), NOT this wave (routed there
   in `_SYNTHESIS-gap-scorecard §1`, recorded for completeness so the frontend band
   does not double-own it). The rename + the `:always-expanded` removal both assume the
   PUBLISHED rebuilt dock (not the dirty `file:` link), so this wave is sequenced AFTER
   `G.W2`. The mobile-occlusion HANDOFF is sequenced behind glass-ui's rebuilt dock
   contract.

7. **This wave is `demo/**` + `test/stubs/**`-only — ZERO library surface.** RESOLVED:
   the rename/barrel/mask/costume/reka are demo SFC + dir changes; the stub realign is
   `test/stubs/` (the only non-`demo/**` source file, and it is test infra, not
   behaviour). No `src/**` edit. The dock-root occlusion + `--z-dock` fix are
   glass-ui-HANDOFF — each its own surface, HAND-OFF-tagged (inv-16 RELAXED for G impl;
   the user drives glass-ui). The gate edits `scripts/proof-decomposition.mjs` (the
   barrel-absent lock) + re-runs `scripts/occlusion-gate.mjs` (the existing instrument)
   — the locks, not behaviour.
