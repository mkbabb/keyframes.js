# Tranche D — PROGRESS

Status board for keyframes.js' fourth tranche. The plan is `D.md`; the close
report is `FINAL.md` (authored at W6). Audit evidence is under `audit/`; the
wave specs are under `waves/`.

D's three duties, inherited from C's honest close: **refine the demo**
(encapsulation · KISS · the design language localized + un-caged · brittleness
hardened), **transpose the engine to its gestalt** (the AnimationGroup
zero-alloc tail, the `tick` canonicalization, the computed-unit round-trip, the
~1019-line `Animation` god-object seam in `src/animation/engine.ts`, the
deprecated re-exports), and **terminate every
keyframes-owned deferral** (the φ-ladder leaf-tail, the square-scene mobile
composition, the now-unblocked dock-rename). P-invariant-28: no perpetual punts
— D is the terminal home or the KILL.

## Phase

**DEVELOPMENT** (D.W0 — RUN now, on branch `tranche-d-dev`). D.W0 (the
audit-fold: the 5-lane audit on disk, the deferred ledger, the prompt-recap,
this plan → the tranche docs) is the dev/impl boundary. It produces **no engine
or demo source** — only the audit evidence, the ledgers, and the wave specs.

**D.W1–W6 await authorization.** The implementation half is authored-now,
run-later: it opens only on explicit user authorization, gated on keyframes'
own green CI (inv-27) — exactly C's dev→impl boundary. inv-16 holds: only
keyframes.js is written; the glass-ui dock base + touch-gate + `LabeledField`
a11y stay OUTWARD. The publish leg (the stacked B `3.1.0` + C `major` + D
`major` changesets → tag → release) is user-domain, confirm-first.

**Planned DAG (run-later):** W0 (now) → W1 ∥ W2 ∥ W3 (component-vs-style-vs-
brittleness, largely file-disjoint demo lanes) · W4 (engine `src/`) parallel to
all demo waves · W5 gated on glass-ui PUBLISHING 3.3.0 (the dock base + the
touch-gate B′ fix) · W6 closes. The library legs are gate-free (`proof:boundary`);
only the demo/dock legs gate.

## Wave status

| Wave | Title | Phase | Status | Hard gate (falsifiable instrument) |
|---|---|---|---|---|
| **D.W0** | Audit-fold + the path forward | DEV | **RUN now** | The 5-lane audit is on disk under `audit/` + re-runnable (the grep/wc instruments each lane cites re-execute from the repo); the deferred ledger carries a real disposition per item (`KFD`/`OUT`/`ARCH`/`CLOSED` — zero un-dispositioned punts, P-invariant-28); the prompt-recap confirms full A→B→C→constellation→D coverage; every W1–W6 spec carries its own falsifiable hard gate. |
| **D.W1** | The demo decomposed (encapsulation · KISS) | IMPL | **authored — awaits auth** | `proof:decomposition` — no demo component/composable exceeds its stated line ceiling (`wc -l` over the demo tree, ceiling-checked); the parse adapter has exactly ONE definition (`grep` over `demo/` returns a single `parseCSSStylesheet→resolveKeyframes→extractAnimationOptions` body); zero behaviour change (the demo gate suite — `demo-smoke`/`occlusion`/`lighthouse`/`proof:dogfood` — stays green + a component-render smoke). Net-deletion of duplication. |
| **D.W2** | The design language localized + un-caged | IMPL | **authored — awaits auth** | `proof:idioms` — every referenced design idiom resolves to a DEMO-LOCAL definition (`--rainbow-*`/`--color-gold`/`.scale-on-hover`/`@keyframes enter` each resolve from the demo's OWN built CSS — `design-idioms.css` — not only via the glass-ui/tw-animate-css cascade; falsifiable by stubbing `design-idioms.css` — the ungated-rent gate); `utils.css` carries zero component-specific rules (`.tab-trigger-*`/`.btn-playback*`/`.demo-*`/`.ppmycota-*` are scoped); the φ-ladder leaf-tail sweep returns 0 raw body rungs; isomorphic — the capture harness AFTER ≈ BEFORE except the befitting deltas. |
| **D.W3** | Brittleness hardened (selectors · reactivity) | IMPL | **authored — awaits auth** | `proof:brittleness` — zero `document.querySelectorAll`/`.closest(`/`.querySelector(` DOM-walks in the demo's reactive code (`grep` returns the owned-ref forms only); the z-index scale is ONE ordered token set (`grep` for raw `z-[`/`z-index:` integer literals returns 0 outside the scale); the `@supports` guards bite (`env()`/`-webkit-mask-image`/`dvh` fall back cleanly under a feature-off probe); the engine `_snapSettled` symmetry test (D-6) passes. |
| **D.W4** | The engine transposed to its gestalt | IMPL (major) | **authored — awaits auth** | `proof:transposition` (the D.W4 umbrella over its member gates) — `proof:zero-alloc`: the AnimationGroup composite path is allocation-free over a steady-state loop (the NEW `bench/zero-alloc.bench.ts` heap-delta/allocation-count probe: 0 bytes/frame after warmup, bite-proven by `KF_ALLOC_INJECT=group` — D-1); `tick` has ONE meaning at the driver layer (`grep` finds `advanceTo(t)` as the absolute-clock advance, no `tick(t)` clock-overload — D-2); the computed-unit round-trip writes changed keys only (a write-count probe — D-3); the ~1019-line `Animation` (`src/animation/engine.ts:126-1145`) is split at the `FrameCompiler`/playback seam with `npm test` green (D-4); the no-deprecated-reexport grep over `src/animation/utils.ts`/`format.ts`/`leaves.ts` returns 0 path-compat aliases (`proof:no-legacy`); net-deletion. |
| **D.W5** | The dock leveraged + the mobile composition closed | IMPL | **authored — awaits auth (GATED on glass-ui 3.3.0 publish)** | the authored clause set (no single `proof:dock` script): the local docks are renamed to the AU.W8 role-vocabulary, each still composing the published glass-ui primitives (`grep` finds `ChromeDock`/`TransportDock`, no `TopDock`/`AnimationMenuBar` — local renames, not slot-fillers over a glass-ui base); the local `dock/index.ts` re-export is DELETED (`test ! -f dock/index.ts`); the touch-mask is gone at BOTH sites (`grep always-expanded` = 0 across `dock/` AND `animation-controls/`); `grep always-expanded="isMobile"` = 0; the `occlusion-gate.mjs` `PENDING_OCCLUSION` stale-check self-clears (allowance emptied — inv δ HARD on square/mobile); the `^3.3.0` published-pin grep. |
| **D.W6** | Close (recap · deferred terminal · release) | IMPL (LAST) | **authored — awaits auth** | `FINAL.md` reconciles the deferred ledger fully terminated (every `KFD` folded, every `OUT` booked, every `ARCH` recorded — re-verified by the ledger grep); the AFTER capture re-runs from the repo (`scripts/capture.mjs after`, 0 console errors) + `audit/DELTA.md` pairs each page's intended change to its gate evidence; the version owner is NAMED for the stacked B/C/D changesets; the publish leg stays user-domain. |

## W0 audit evidence (on disk)

The 5-lane audit lands under `audit/`, each lane file:line-grounded with a
SHIP/BOOK/KILL/RECORD disposition and a re-runnable grep/wc instrument:

- **Frontend lane** (`audit/frontend-findings.md`) — the decomposition + KISS
  inventory: the five oversized units (verified by `wc -l`: AnimationControlsGroup
  552L, KeyframesEditor 487L, KeyframeTimeline 441L, useKeyframesEditor 383L,
  useTimeline 251L); the `parseCSSAnimationKeyframes` duplication (TWO copies of
  the same `parseCSSStylesheet→resolveKeyframes→extractAnimationOptions→values`
  adapter — `KeyframesStringControls.vue:55` `parseCSSAnimationKeyframes` +
  `composables/useKeyframesEditor.ts:27` `parseAnimationCSS`); the three pure
  utils mis-filed under `timeline/composables/` (`timelineEngine.ts`,
  `snapshotCapture.ts`, `flattenVars.ts` — no `ref(`/`watch`/`onMounted`, plain
  functions); the in-component rAF/timeout blobs (`useTimeline.ts:206`
  `requestAnimationFrame`, `KeyframesStringControls.vue:120` `setTimeout`,
  `usePaneHover.ts:36` `setTimeout`).
- **Styling lane** (`audit/styling-findings.md`) — the design-idiom inventory:
  the **rented idioms** referenced demo-wide, defined only via the transitive
  glass-ui + tw-animate-css cascade (no demo-local definition) — an ungated
  cross-repo rent (`--rainbow-*` 6 colours in two SVG gradients; `--color-gold`
  inside an arbitrary value; `.scale-on-hover` used 13× with no demo-local
  definition — resolves via glass-ui; `@keyframes enter` referenced at
  `utils.css:129`, defined by tw-animate-css via the private `--tw-enter-*`
  contract); the global `utils.css` monolith holding component-specific rules
  (`.tab-trigger-*`/`.btn-playback*`/`.demo-*`/`.ppmycota-*`); the arbitrary-value
  tailwind + `!`-overrides; the φ-ladder leaf-tail F6 (89 `text-sm/xs/base` body
  sites — the chronic A→B→C).
- **Brittleness lane** (`audit/brittleness-findings.md`) — the fragile DOM
  selectors (a global `document.querySelectorAll("pre")`, `.closest(".easing-target")`,
  the `[data-sonner-toaster]` coupling); the undocumented z-index scale; the
  reactivity gaps (the `useAnimationSync` rAF bridge, the `useKeyframesEditor`
  array-watch flush, the `useScrollFade` listener re-attach); the work-area
  `calc()` chain + the missing `@supports` guards.
- **Engine lane** (`audit/engine-transposition.md`) — the gestalt tail: the
  AnimationGroup per-frame allocation (the lone hot loop violating the class's
  zero-alloc discipline); the `tick` triple-meaning at the driver layer; the
  computed-unit DOM round-trip re-serializing every frame; the ~1019-line
  `Animation` god-object (`src/animation/engine.ts:126-1145`) at the wrong seam;
  the deprecated path-compat re-exports;
  the two W0-booked residuals C's W4 slipped (`_snapSettled` asymmetry,
  `leaves.ts | any`).
- **Deferred lane** (`audit/deferred-ledger.md` + `audit/prompt-recap.md`) —
  every keyframes-owned deferral tagged + dispositioned (the table below), and
  the full A→B→C→constellation→D prompt recap with zero drops.

## Verified facts at D-open

- **C closed CI-green** on `tranche-c-impl` (PR #3); the B `3.1.0` + C `major`
  changesets are CUT but unpublished (the publish leg is user-domain). (verified
  — `.changeset/tranche-b-3-1-0.md`, `.changeset/tranche-c.md` present)
- **The five oversized units exceed their ceiling** — `wc -l`: AnimationControlsGroup
  552, KeyframesEditor 487, KeyframeTimeline 441, useKeyframesEditor 383,
  useTimeline 251 (the real paths live under
  `demo/@/components/custom/animation-controls/{,keyframes/,timeline/}`). (verified)
- **The parse adapter is duplicated** — `parseCSSAnimationKeyframes`
  (`KeyframesStringControls.vue:55`) and `parseAnimationCSS`
  (`useKeyframesEditor.ts:27`) are two bodies of the SAME
  `parseCSSStylesheet→resolveKeyframes→extractAnimationOptions→{keyframes,options,values}`
  adapter. (verified)
- **The three timeline utils are mis-filed** — `timelineEngine.ts`,
  `snapshotCapture.ts`, `flattenVars.ts` under `timeline/composables/` are pure
  functions (zero vue reactivity), belonging under `timeline/utils/`. (verified)
- **`@keyframes enter` is referenced demo-locally-undefined** — `utils.css:129`
  cites it, and it IS defined by tw-animate-css (`style.css:2` import) via the
  private `--tw-enter-*` contract; the `--rainbow-*`/`--color-gold`/`.scale-on-hover`
  idioms likewise have ZERO definition in the demo's own tree and resolve only
  through the transitive `@mkbabb/glass-ui/styles` import. The defect is an
  ungated cross-repo rent that flattens silently if a sibling renames/drops a
  token — provenance, not a missing animation (D.W2 closes it by ownership, not
  by making it resolve).
- **The glass-ui pin is still `file:../glass-ui`** (`package.json:66`) — D.W5
  moves it to a published `^3.3.0`; `package.json` version is `3.0.0`. (verified)

## Cross-repo / outward perimeter (USER-DOMAIN — confirm before each)

D is keyframes-internal (inv-16: writes only keyframes.js), cognizant of the
in-flight siblings — it consumes their *published* surface, plans around their
motion, writes none of them.

1. **glass-ui-AT/AU** — the dock CORRECTNESS base + the touch-gate B′ fix LANDED
   (`f0b0ffb`, ships in 3.3.0), unblocking the local renames + mask removal;
   glass-ui is at **3.2.0 (unpublished delta on `at-dock-convergence`)**, 3.3.0
   the AU publish target — D pins `^3.3.0` only once it is on npm. D.W5 moves the
   local `file:../glass-ui` pin to the published `^3.3.0` to consume the published
   dock primitives (`GlassDock` + `DockLayer`/`DockLayerGroup`/`DockIconButton`/
   `DockSelectTrigger`) + the touch-gate B′ fix cleanly, and adopts the AU.W8
   docs role-vocabulary as LOCAL rename names. D pins the *published* package,
   never AT's branch. The `<Role>Dock` role-vocabulary + base-rename machinery +
   the reka-Tabs rail + strict-templates are AU's OWN un-landed AU.W8 arm — the
   `<Role>Dock` base-component leverage gates on glass-ui AU.W8 (a named
   cross-session edge); D anticipates but does not depend on a role-typed base.
2. **value.js-M** — DIRTY/active (v1.0.0, color-API-adjacent). keyframes' *demo*
   consumes value.js (the easing demo: `timingFunctions`/`parseCSSTime`); the
   library's LIGHT barrel carries no static value.js edge — the heavy engine
   reaches value.js only via dynamic `loadAnimationEngine()` (`proof:boundary`).
   D pins the *published* value.js, never M's branch.
3. **slides-E/F** — active, double-driven; the spring-dogfood `29a781a` was
   contributed (booked). Shared idioms: the `<Role>Dock` role-vocabulary (the
   un-landed AU.W8 docs convention both arms adopt as local rename names) + the
   `--spring-*` token contract. D converges (does not fork): `springLinearStops()`
   stays a stable export, the same dock role-vocabulary is adopted as local
   rename names.
4. **The publish legs (USER-DOMAIN PUBLISH LEGS)** — the stacked changesets
   (B `3.1.0` + C `major` + D `major`) → `changeset version` → tag →
   `release.yml` are user-domain, confirm-first. D.W5 is GATED on glass-ui
   PUBLISHING 3.3.0 (the only newly-actionable cross-arm edge — the dock-rename);
   D.W6 NAMES the version owner. Everything up to "ready-to-publish, CI green" is
   autonomous; the npm-publish legs the user drives in dependency order.

## Open deferrals

Zero perpetual punts. Every keyframes-owned deferral has a terminal home in a D
wave (`KFD`), a sibling owner (`OUT`), or a permanent KILL (`ARCH`):

| Item | Tag | D-disposition |
|---|---|---|
| Square-scene mobile-composition occlusion | **KFD** | D.W5 — the terminal fix (the C allowance's stale-check fires when closed). |
| φ-ladder **leaf-tail F6** (89 body sites) — CHRONIC A→B→C | **KFD** | D.W2 — the terminal migration (the display tier closed in C). |
| Consumer **dock-rename** + `dock/index.ts` deletion — was gated, NOW PARTLY UNBLOCKED | **KFD** | D.W5 — the dock correctness base + touch-gate B′ landed (ships 3.3.0), unblocking the LOCAL renames + mask removal; the `<Role>Dock` base-component leverage gates on glass-ui AU.W8 (named cross-session edge). |
| `always-expanded="isMobile"` double-tap mask | **KFD** | D.W5 — removed on the glass-ui 3.3.0 pin (B′ fix published). |
| Engine `_snapSettled` asymmetry + `leaves.ts \| any` + deprecated re-exports (W0-slipped) | **KFD** | D.W3 (snap symmetry) + D.W4 (re-exports, `\| any`). |
| bucket-glassui (ASK-3 `LabeledField` a11y) | **OUT** | glass-ui owns; D keeps the named lighthouse allowance (no vendor band-aid). |
| VAL-9 `--spring-*` codegen (ASK-2) | **OUT** | glass-ui owns; D keeps `springLinearStops()` export stable (the enabler). |
| Dock double-tap (ASK-1) | **OUT — RESOLVED** | Fixed by instrument in glass-ui (B′ `f0b0ffb`); D removes the mask (W5). |
| glass-ui foundational slices (reka-Tabs rail, strict-templates, the `<Role>Dock` role-vocabulary + base-rename machinery) | **OUT** | AU's own un-landed AU.W8 arm; D depends only on the *landed correctness base* + the published primitives, not the rail or a role-typed base component (BOOK until a 2nd consumer). |
| ScrollTimeline-native · Worker/OffscreenCanvas · dev.sh/deploy.sh | **ARCH** | Permanent KILL (recorded; do not re-litigate). |
| LoAF/>50ms-trace · EasingTarget leak · dead scene CSS · cartoon-shadow | **CLOSED** | Done in C; D verifies no regression. |

No item is named-forward to a fifth tranche. The two historical drifts (B's
falsely-closed LoAF; B's advisory inv δ) were *corrected* in C, not dropped.
The one un-orphaned-by-design loose end — the stacked-changeset version owner —
is NAMED at D.W6; the publish leg stays user-domain by design.
