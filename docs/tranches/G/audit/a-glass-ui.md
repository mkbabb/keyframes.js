# Tranche G audit — a-glass-ui

**Lane:** idiomatic glass-ui usage in the demo + the glass-ui gaps.
**Surfaces audited as their own:** `@mkbabb/glass-ui` (at `/Users/mkbabb/Programming/glass-ui`,
branch `at-dock-convergence`, version **3.3.0**, PUBLISHED to npm) + the kf demo's consumption
(`demo/@` + `demo/app` glass-ui imports, `/motion-core` subpath, the dock, the design tokens,
reka-ui dialogs/popovers). inv-16 RELAXED for G impl (the user drives glass-ui too); every
cross-repo item tagged **glass-ui-HANDOFF**. Verified, not asserted — file:line cited per claim.

Grounding extended (cited, not repeated): `F/F.md §F.W13` (the H-1 hand-off + the `text-wrap:
pretty` sliver SHIP), `F/FINAL.md:118-124` (the published 4.0.0 stack + CF-Pages deploy),
`G/audit/a-deferred-ledger.md` (FB-4/DP-1/OUT-1..6/H-1 rows), `G/audit/a-styling.md` (the
glass-ui token-cascade ALREADY-SOTA record).

---

## §0. The headline — glass-ui 3.3.0 is PUBLISHED, but the demo consumes a `file:` LINK (inv-27)

The §Mandate's inv-27 (carried verbatim into G): *"consume PUBLISHED value.js/glass-ui (not
branches/links); gate on own green CI."* The whole D.W5/H-1/FB-4 band was gated on **"glass-ui
PUBLISHING 3.3.0."** That gate is now **OPEN**:

- `npm view @mkbabb/glass-ui version` → **`3.3.0`** (published, live on the registry — verified).
- glass-ui local HEAD is also `3.3.0` (`/Users/mkbabb/Programming/glass-ui/package.json:version`).

But the kf demo pins it as a **local file link, not the published version**:
- `package.json` → `"@mkbabb/glass-ui": "file:../glass-ui"` (verified).
- `node_modules/@mkbabb/glass-ui` → symlink `../../../glass-ui` (verified `readlink`).
- The linked glass-ui working tree is **DIRTY** on branch `at-dock-convergence`
  (`git status -s` → `M docs/...`, `?? probe.txt`, `?? src/components/.../README.md` — verified).

So the demo builds (and `keyframes.babb.dev` was deployed from `F/FINAL.md:124`) against an
**unversioned, dirty, branch-local glass-ui** — the exact anti-pattern inv-27 forbids. This is
NOT byte-equivalent to consuming `@mkbabb/glass-ui@3.3.0` from the registry: a `file:` link
resolves to whatever is on disk at build time (dirty tree included), with no integrity hash and
no reproducibility. The other G audits flag the value.js/parse-that pin-lag (`a-backend-legacy.md:86`,
`a-deferred-ledger.md` RP-1/2/3 — value.js `^0.10.0` installed `0.10.0` while `0.11.0` is published;
parse-that `^0.8.2` while `0.9.0` is published); **glass-ui is the worst of the three** — it is not
even a semver pin, it is a filesystem link.

> **GG-1 — Re-pin glass-ui to the published `^3.3.0` (off the `file:` link).**
> **Disposition: SHIP-in-G (glass-ui leg of the §pin-lag re-pin).**
> Replace `"@mkbabb/glass-ui": "file:../glass-ui"` with `"@mkbabb/glass-ui": "^3.3.0"`, reinstall,
> verify the demo build + `demo-smoke` still green. This is the genuine consume-the-published-leg,
> NOT a vendored patch. It unblocks reproducible CI (the link cannot be resolved on a clean GitHub
> runner — `a-backend-legacy.md:86` already names this as why `demo-smoke` is fragile).
> **Instrument:** a `proof:pin` clause (or extend the existing pin-lag check the other lanes propose)
> that asserts NO `file:`/`link:`/`git:` protocol in any `@mkbabb/*` dependency + installed === pinned.
> Bites on a re-introduced link. Pair with the value.js/parse-that re-pin (one re-pin motion, three deps).

---

## §1. The motion-core no-types gap — RESOLVED at the type layer; the STUB has DRIFTED ahead of reality

F's prompt named *"the motion-core no-types gap (the demo tsc error + the vitest stub F added)."*
Status now, verified:

**The demo tsc error is GONE.** `npx tsc --noEmit` (which includes `demo/` per `tsconfig.json:include
= ['src/', 'demo/']`) exits **0** (verified). glass-ui 3.3.0 ships `dist/motion-core.d.ts`
(43 bytes: `export * from "./composables/motion/core"`) and the symbols resolve with types
(`dist/motion-core.js` exports `startViewTransition`, `supportsViewTransitions`, `useScrollProgress`,
… — verified `grep export dist/motion-core.js`). So the historical "no `.d.ts` on the subpath →
demo tsc red" gap is **closed by glass-ui shipping the subpath types**. No kf action on the *type
resolution* itself.

**BUT the vitest stub F added has DRIFTED into a fiction that no longer matches the real helper.**
`test/stubs/glass-ui-motion-core.ts` (aliased in `vitest.config.ts:17-20` so the glass-ui-FREE
library gate can run the demo-encapsulation tests) declares:

```ts
// test/stubs/glass-ui-motion-core.ts:18-37
export const startViewTransition = (
    update: () => void | Promise<void>,
    _options?: { types?: string[] },              // ← (a) a `types` param
): { finished; ready; updateCallbackDone; skipTransition } => { … }   // ← (b) the NATIVE shape
```

The REAL glass-ui helper (`/Users/mkbabb/Programming/glass-ui/dist/composables/motion/useViewTransition.d.ts:31`):

```ts
export declare function startViewTransition(mutate: () => void): ViewTransitionResult;
// ViewTransitionResult = { finished: Promise<void>; transitioned: boolean }   (lines 1-11)
```

Two divergences, both real:
- **(a) the `_options?: { types?: string[] }` param the stub carries does NOT exist on the real
  helper** — the stub anticipates the H-1 `{types}` helper that was **never shipped** (§2). A test
  that passed `types` would type-check green under vitest then **fail the real demo build** (the
  real signature takes one arg).
- **(b) the stub's RETURN shape is the native `ViewTransition` object** (`ready`,
  `updateCallbackDone`, `skipTransition`), NOT glass-ui's `ViewTransitionResult` (`{finished,
  transitioned}`). A test reading `.transitioned` (the real field) would fail under the stub; a
  test reading `.skipTransition()` (the stub field) would fail the real build.

The demo consumer (`demo/app/useSceneTransition.ts:32`) reads only `.finished`, so today nothing
breaks — but the stub is an UNGATED fiction modeling a contract glass-ui does not honor. Per the
§Mandate (*"no weaker-alternative escape hatch beside the real fix; fail explicitly"*), a test
double that lies about its target's signature is precisely the silent-handling the Mandate excises.

> **GG-2 — Realign the vitest motion-core stub to glass-ui's ACTUAL `ViewTransitionResult`
> contract (or replace the alias with a typed re-export of the real types).**
> **Disposition: SHIP-in-G (demo test-infra correctness).**
> The clean form: the stub keeps a runtime no-op body (jsdom has no `document.startViewTransition`,
> `supportsViewTransitions()===false` is the faithful posture — `test/stubs/...:13-14`) but its
> SIGNATURE must `satisfies typeof import("@mkbabb/glass-ui/motion-core")` so a drift reds the type
> check. Strip the phantom `_options?: {types}` and the native-shape return; mirror `{finished,
> transitioned}`. If H-1 (§2) lands, the stub follows the helper, not leads it.
> **Instrument:** a `tsc`-checked `satisfies` assertion in the stub (compile-time bite); the existing
> demo-encapsulation tests already exercise the runtime path. Bites on any future stub↔real drift.

---

## §2. H-1 — the directional `startViewTransition({types})` helper is STILL NOT in glass-ui (BOOKed in F, now SHIPpable)

F.W13 BOOKed H-1 as a **glass-ui-HANDOFF**: *"the enabler `startViewTransition({types})` is
glass-ui-owned."* `a-deferred-ledger.md:182` (OUT-6/H-1) + `:88` (FB-4) carry it. Verified live:

- glass-ui's helper is the **bare-callback form** — `startViewTransition(mutate: () => void)`
  (`useViewTransition.ts:80`, `dist/.../useViewTransition.d.ts:31`). **No `{types}`. No object form.**
- glass-ui's `view-transition.css` (`dist/styles/view-transition.css`, 68 lines) does
  crossfade/slide via `view-transition-class: gl-list-item` + `--vt-*` tokens — but has
  **ZERO `:active-view-transition-type()` selectors** (verified `grep`). So even if the helper
  grew `{types}`, there is no directional CSS to consume them.
- The demo's most-seen motion (the scene swap, `useSceneTransition.ts:32`) calls
  `startViewTransition(() => mutate(id))` — the bare callback — and the host carries a SINGLE
  static `view-transition-name: scene-subject` (`demo/app/App.vue:332`): a plain crossfade, no
  directionality.

**The platform half is READY (Baseline-confirmed, grounded via modern-web-guidance
`directional-navigation-transitions`):**
- **View Transitions** — Baseline **2025-10-14** (Chrome 111, Edge 111, Firefox 144, Safari 18).
- **Active view transition** (the `types` param + `:active-view-transition-type()` selector) —
  Baseline **2026-01-13** (Chrome 125, Edge 125, Firefox 147, Safari 18.2). **PAST today.**

The SOTA shape (grounded): `document.startViewTransition({ update, types: ['forward'] })` paired
with `html:active-view-transition-type(forward)::view-transition-old(root){ animation-name:
slide-to-left }` etc. glass-ui's bare-callback signature cannot express this — it needs the
object-form overload AND the directional CSS recipe.

> **GG-3 (= H-1, = FB-4 enabler) — grow glass-ui's `startViewTransition` to accept the object form
> `{ update, types }` and ship the paired `:active-view-transition-type()` CSS recipe in
> `view-transition.css`.**
> **Disposition: glass-ui-HANDOFF (G CAN drive it directly under relaxed inv-16).**
> The idiomatic shape (NO back-compat alias — the §Mandate's "replaced surface replaced in one
> motion"): the helper takes `mutate: () => void` OR `{ update, types? }`, feature-detects
> `document.startViewTransition`, and on the native path calls
> `doc.startViewTransition({ update: mutate, types })` (the native API already accepts the object
> form on Baseline engines). The instant fallback is unchanged. The CSS half adds a
> `gl-vt-directional` class family keyed on `:active-view-transition-type(forward|backward)` with
> `transform`-only keyframes (per the SOTA guide: animate `translate`/`transform`, never `inset`),
> with `prefers-reduced-motion` zeroing the slide (glass-ui's existing PRM `animation:none` pattern).
> This is glass-ui's surface (the helper + the CSS substrate both live there per the user's MEMORY
> feedback: *"all glass-ui/dock changes must go in the glass-ui repo, never patched in demo"*).
> **Then FB-4 (the demo consumer) lands** as GG-4 below.
> **Instrument:** a glass-ui unit test asserting the object-form overload + a kf-side browser-driven
> VT-types assertion in the existing `demo-smoke` Chromium job (`a-deferred-ledger.md:88` convention —
> NOT a new gate). Un-actionable in the demo until the glass-ui helper lands.

> **GG-4 (= FB-4 / NEW-32) — once GG-3 lands, the demo scene-VT derives a direction from scene-order
> and passes `{types}`.**
> **Disposition: BOOK (demo-motion-polish) — consumes GG-3.**
> `demo/app/useSceneTransition.ts:32` becomes `startViewTransition({ update: () => mutate(id),
> types: [dir] })` where `dir` is `forward|backward` from the scene index delta (the scenes are an
> ordered list — `demo/app/scenes.ts`). The host's static `view-transition-name: scene-subject`
> (`App.vue:332`) stays; the directional CSS rides glass-ui's `view-transition.css` (already
> `@import`ed via `@mkbabb/glass-ui/styles` per `App.vue:328-330`) — no demo-side VT CSS duplicate.
> Low urgency: the current crossfade is functional + Baseline-degrade-clean. Lands as the consumer
> of GG-3, not before.

---

## §3. D.W5 — the dock rename + `dock/index.ts` deletion + the `always-expanded` mask (gated on 3.3.0, NOW UNBLOCKED)

`a-deferred-ledger.md:179` (DP-1) + `a-prompt-recap.md:241` (GS-8) carry D.W5 as the ONE
legitimately-blocked carry, gated on glass-ui PUBLISHING 3.3.0. **That gate is now OPEN** (§0 —
3.3.0 is published; the glass-ui dock was rebuilt from first principles in AV.W9, per
`glass-ui/CHANGELOG.md:3-7`). Re-verified the kf-demo side is STILL pre-rename:

- `demo/@/components/custom/dock/` contains **`TopDock.vue` + `index.ts`** only — NO
  `ChromeDock.vue`, NO `TransportDock.vue` (verified `ls`). Confirms DP-1's "still PRE-rename."
- `dock/index.ts` is a **3-line nested re-export barrel** (verified):
  ```ts
  export { GlassDock, DockLayerGroup } from "@mkbabb/glass-ui/dock";   // pass-through
  export { default as TopDock } from "./TopDock.vue";
  ```
  The §Mandate forbids "nested imports"/re-export barrels that exist only to re-route. The
  `GlassDock, DockLayerGroup` re-export is pure pass-through — `TopDock.vue:7` imports
  `{ GlassDock, DockLayerGroup } from "."` (its own barrel) instead of from
  `@mkbabb/glass-ui/dock` directly (where the other dock primitives come from, `TopDock.vue:8-12`).
  This is the `dock/index.ts` deletion D.W5 named.

- The **`always-expanded` mask**: `TopDock.vue:118` →
  `<GlassDock … :always-expanded="isMobile">` with `isMobile = useMediaQuery("(max-width: 1023px)")`
  (`TopDock.vue:65`). glass-ui's `GlassDock` ALREADY auto-derives always-expanded for vertical
  orientation (`glass-ui/.../GlassDock.vue:135` →
  `alwaysExpanded = props.alwaysExpanded || orientation.value === "vertical"`). The demo's
  `:always-expanded="isMobile"` is the **occlusion-dodge mask** DP-1 named for removal — it forces
  the dock permanently expanded on mobile to avoid the square/mobile dock-over-content overlap
  (inv δ, the HARD occlusion gate). That overlap is glass-ui's to solve in the rebuilt dock
  (per MEMORY feedback), not the demo's to mask.

- Dead reactivity: `TopDock.vue:107-109` `activeLayer = computed(() => "main")` — a constant
  wrapped in a `computed`, feeding a single-`<DockLayer id="main">` inside a `<DockLayerGroup
  :show-rail="false">` (`TopDock.vue:119-120`). A single-layer dock wearing the multi-layer-group
  costume. Either it should use the layer-group meaningfully (multiple `DockLayer`s) or drop the
  group wrapper + the constant `computed`.

> **GG-5 (= DP-1 / GS-8) — close D.W5: rename `TopDock→ChromeDock` + delete the `dock/index.ts`
> pass-through barrel (import glass-ui dock primitives directly) + REMOVE the `:always-expanded`
> mask (let glass-ui's rebuilt dock own the no-occlusion contract) + collapse the dead
> single-layer `DockLayerGroup`/`activeLayer` costume.**
> **Disposition: SHIP-in-G (the kf-demo half) + glass-ui-HANDOFF (the square/mobile occlusion is
> glass-ui's dock contract).**
> The gate is open (3.3.0 published). The §Mandate demands G either drives the unblock or RECORDS
> the explicit external blocker — the blocker is GONE, so this is a genuine SHIP, not a re-defer.
> Sequencing: confirm glass-ui's rebuilt dock handles the mobile no-occlusion natively (browser-test
> on `square`/mobile viewport); if it does NOT, that residual occlusion is **glass-ui-HANDOFF**
> (fix in the glass-ui dock root, never re-mask in the demo). Note: F.FINAL named the version owner
> (Mike Babb) — the D.W6 close (the absent `docs/tranches/D/FINAL.md`, `a-deferred-ledger.md:180`
> DP-2) is a separate KFG-docs item this lane defers to the deferred-ledger lane.
> **Instrument:** the EXISTING `occlusion-gate.mjs` HARD assertion (advisory→hard in C.W1,
> `a-prompt-recap.md:286`) re-run with the mask removed — it must stay green WITHOUT the
> `:always-expanded` crutch. Plus a `proof:decomposition`/`grep` clause asserting no `dock/index.ts`
> pass-through barrel + no `ChromeDock`-absent regression. Bites if the mask returns or the barrel
> re-appears.

---

## §4. The one direct reka-ui import — `SelectIcon` (a primitive glass-ui doesn't surface)

`a-prompt-recap.md` G-ask re-opened glass-ui leverage (GS-6/GS-8). Audited every `reka-ui` direct
import in the demo (`grep -rn 'from "reka-ui"' demo/`): exactly **ONE** —
`demo/@/components/custom/animation-controls/AnimationMenuBar.vue:174` → `import { SelectIcon }
from "reka-ui"`. (AnimationMenuBar is live: referenced in `App.vue` + `AnimationControlsGroup.vue`,
verified.)

glass-ui consumes `SelectIcon` internally (`glass-ui/.../ui/select/SelectTrigger.vue:3,46`) but
does **NOT re-export it** from its `./select` subpath (`dist/select.d.ts` = `export * from
"./components/ui/select"`, which re-exports the wrapped components, not the raw reka primitives —
verified). So the demo reaches past glass-ui to reka-ui for a single chevron-slot primitive glass-ui
hides. Every OTHER dialog/popover/select surface in the demo is idiomatic: `SharePopover.vue:2,48`
uses glass-ui's `Popover`/`PopoverTrigger`/`PopoverContent`; `KeyboardShortcutsModal.vue:2-6` uses
glass-ui's `Dialog`/`DialogContent`/`DialogHeader`/`DialogTitle` — all from `@mkbabb/glass-ui`
(`dist/index.d.ts:export * from "./components/ui/dialog"` + `"./components/ui/popover"`). reka-ui is
the shared headless basis both repos build on, so a single primitive reach is borderline-acceptable
— but it is the one seam where the demo couples to the basis instead of the glass-ui surface.

> **GG-6 — either glass-ui re-exports the reka primitives its `Select` family is composed from
> (so consumers extend the trigger without reaching past the surface), OR the demo replaces the
> raw `SelectIcon` with glass-ui's `DockSelectTrigger`/`SelectTrigger` (which already own the icon
> slot).**
> **Disposition: glass-ui-HANDOFF (low urgency) — OR demo-local KILL.**
> Lean demo-local: `AnimationMenuBar.vue` already imports `GlassDock` from the demo dock barrel;
> its `SelectIcon` use is almost certainly replaceable with glass-ui's `DockSelectTrigger` (the
> idiom `TopDock.vue:147` already uses). Verify the visual is identical (the §Mandate's isomorphic-
> styling rule — pixels stable). If a genuine raw-primitive need remains, hand glass-ui the re-export
> ask. Low urgency: one borderline import, not a systemic gap.
> **Instrument:** a `grep` clause in `proof:boundary`/`proof:decomposition` asserting zero direct
> `from "reka-ui"` in `demo/` (the demo consumes glass-ui's surface, not the basis). Bites on a new
> raw-reka reach.

---

## §5. ALREADY-SOTA — what glass-ui consumption gets RIGHT (left alone)

Honest record (the §Mandate: *"do NOT manufacture a deficit; a surface already idiomatic is left
alone"*). D+E+F left the glass-ui consumption largely exemplary:

- **The spring-token cascade is fully idiomatic + dogfood-preserving.** glass-ui 3.3.0 ships
  `--spring-smooth` + `--spring-snappy` in `dist/styles/tokens.css:159-160` (both generated by the
  SAME `springLinearStops()` the kf engine demonstrates — `glass-ui/CHANGELOG` AV-spring family).
  The demo consumes them; the local `linear()` SHADOW was correctly REMOVED in E.W11
  (`demo/@/styles/style.css:134-147` documents the reconcile). The one remaining demo token,
  `--spring-snappy: var(--spring-smooth)` (`style.css:147`), is a NAMED, befitting motion delta
  (the calmer pane-slide), not a shadow. OUT-2 (the `--spring-*` codegen) is LANDED in glass-ui —
  **no kf action.** Corroborates `a-styling.md`'s glass-ui-cascade ALREADY-SOTA finding.

- **The `springLinearStops()` enabler stays value.js-FREE + stable** (`src/animation/springLinearStops.ts`
  has zero value.js import — verified `grep`). OUT-1/D-C4 (the slides/glass-ui enabler) held through
  F and holds at G HEAD. **No kf action.**

- **The motion-core subpath is consumed correctly for its INTENT** — the engine-free,
  keyframes.js-free leaf import. `useSceneTransition.ts:2` + `useSceneSwap.ts:2` import
  `startViewTransition`/`supportsViewTransitions` from `@mkbabb/glass-ui/motion-core` (NOT `/motion`,
  which would drag the ~125 KB keyframes engine — `glass-ui/motion-core.ts:6-9`). The demo respects
  the SCC-boundary glass-ui carved. The VT helper + the engine-dogfood spring fallback are correctly
  mutually-exclusive (one motion, never two — `useSceneSwap.ts:35,44`). **Idiomatic.**

- **The VT a11y contract is honored** — the demo routes focus to the scene host on `finished`
  (`useSceneTransition.ts:33-35`, the a11y MANDATORY glass-ui's helper docstring names at
  `useViewTransition.ts:8-10`), and the host's `tabindex="-1"` + suppressed focus-ring
  (`App.vue:335-340`) is the correct programmatic-focus-only posture. The PRM degrade rides glass-ui's
  `view-transition.css` — no demo duplicate (`App.vue:328-330`). **Idiomatic.**

- **Dialog/Popover/Select consumed through the glass-ui surface** (§4) — only the one `SelectIcon`
  reach is non-idiomatic. The dock primitives (`DockIconButton`, `DockLayer`, `DockSelectTrigger`,
  `StatusDot`) are all consumed from glass-ui subpaths (`TopDock.vue:8-20`). The dock mutex/keepOpen/
  release contract is used correctly (`TopDock.vue:101-104` → `dockRef.keepOpen()/release()`).
  **Idiomatic apart from the D.W5 residue (§3).**

- **The keyboard-shortcut registry is correctly glass-ui-resident** (`a-frontend-state.md:303-307`
  — `registerShortcut` imports from `@mkbabb/glass-ui/keyboard`). Confirms the MEMORY feedback that
  glass-ui-owned concerns live in glass-ui. **No kf action.**

---

## §6. Dispositions roll-up

| ID | Finding | Disposition | Instrument |
|---|---|---|---|
| **GG-1** | glass-ui consumed via `file:../glass-ui` LINK to a dirty branch; 3.3.0 IS published (inv-27 violation) | **SHIP-in-G** (glass-ui leg of §pin-lag re-pin) | `proof:pin` — no `file:`/`link:`/`git:` in `@mkbabb/*`; installed === pinned |
| **GG-2** | vitest motion-core stub DRIFTED: phantom `{types}` param + native-`ViewTransition` return shape ≠ glass-ui's `ViewTransitionResult` | **SHIP-in-G** (test-infra correctness) | `satisfies typeof import(...)` compile-time bite in the stub |
| **GG-3** | glass-ui `startViewTransition` is bare-callback only; no `{types}`; no `:active-view-transition-type()` CSS (= H-1) | **glass-ui-HANDOFF** (G can drive) | glass-ui object-form unit test + kf `demo-smoke` VT-types browser assertion |
| **GG-4** | demo scene-VT passes no `types` (plain crossfade) (= FB-4/NEW-32) | **BOOK** (consumes GG-3) | same `demo-smoke` browser assertion |
| **GG-5** | D.W5 unblocked: rename `TopDock→ChromeDock`, delete `dock/index.ts` pass-through barrel, remove `:always-expanded` mask, collapse dead single-layer group (= DP-1/GS-8) | **SHIP-in-G** (kf half) + **glass-ui-HANDOFF** (mobile occlusion) | existing `occlusion-gate.mjs` HARD re-run mask-free + `proof:decomposition` barrel-absent clause |
| **GG-6** | one direct `reka-ui` `SelectIcon` import (AnimationMenuBar) past the glass-ui surface | **glass-ui-HANDOFF** (re-export) OR **demo-local KILL** (use `DockSelectTrigger`) | `grep` clause: zero `from "reka-ui"` in `demo/` |

**ALREADY-SOTA (left alone):** the spring-token cascade (OUT-2 landed), `springLinearStops()`
value.js-free enabler (OUT-1 held), motion-core SCC-boundary respect, VT a11y focus-route + PRM
degrade, glass-ui Dialog/Popover/Select surface consumption, glass-ui-resident keyboard registry.

**Cross-repo HAND-OFFs:** GG-3 (H-1 helper + directional CSS), GG-5-half (mobile dock occlusion),
GG-6 (reka re-export) — all glass-ui-owned. Under relaxed inv-16 G CAN drive GG-3/GG-5 in glass-ui
directly (per MEMORY: glass-ui/dock changes live in the glass-ui repo, never patched in the demo).
