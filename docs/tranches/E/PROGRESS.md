# Tranche E — PROGRESS

Status board for keyframes.js' fifth tranche. The plan is `E.md`; the close
report is `FINAL.md` (authored at W6). Audit evidence is under `audit/`; the
wave specs are under `waves/`.

E's single duty, inherited from D's honest close: **refine the demo to the
modern-web standard the engine already holds.** Where D made the demo *correct +
localized* and transposed the engine to its gestalt, E makes the demo *fast +
modern + maximally idiomatic*, and finishes the vueuse listener/observer gestalt
D.W3 began. **E barely touches the published library** — the engine is EXEMPLARY
post-D (the 6-lane E assay found zero engine GAP against the modern-web guidance;
only 2 trivial BOOK items remain). E is a **demo-side performance + modern-web +
frontend-refinement** tranche.

**E's content is NET-NEW, stated honestly.** D was the terminal home for every
keyframes-owned deferral (P-invariant-28). The deferred ledger E inherits is
CLEAN — **zero KFE** (no chronic debt folds into an E wave). E has **two bands,
two honest provenances**: BAND 1 (E.W1–W6 — encapsulation r2 · the vueuse-listener
gestalt · styling r2 · perf + modern-web · engine housekeeping · close) are
findings from the post-D **Baseline-checklist** 6-lane assay; BAND 2 (E.W7–W11 —
engine compile/runtime correctness + hot-path · the FrameCompiler SoA transposition
· modern-platform adoption · the orchestration tier · demo elevation) are findings
from a 30-lane **deep-SOTA** assay (vs Motion/GSAP/anime.js v4, the V8 cost model,
the W3C platform frontier) under `audit/sota/`. Both bands are **net-new, NOT folded
debt** — the deep-SOTA band surfaced gaps the Baseline checklist did not (real engine
correctness bugs the EXEMPLARY verdict masked, a measured hot-path tier, the
orchestration layer every competitor leads with). The KERNEL is **ALREADY-SOTA** (the
interpolation kernel, the `NumericAnimation` SoA core, the WAAPI harness, the spring,
the boundary — the augmentation manufactures no work there); WASM + native-ScrollTimeline
-replace stay DECLINED/KILLed. The release escalates from minor/patch to a firm **minor**
(W9/W10 ship observable additive new public API). See `E.md` §SOTA-augmentation for the
full honest provenance + the value.js hand-off pointer. E folds no chronic debt because
none remains.

## Phase

**DEVELOPMENT** (E.W0 — RUN now, on branch `tranche-d-impl`). E.W0 (the
audit-fold: the 6-lane assay on disk, the lighthouse baseline (20 report
artifacts) + the modern-web comparison, the consolidated deferred ledger, the
prompt-recap, this plan → the
tranche docs) is the dev/impl boundary. It produces **no engine, demo, or
library source** — only the audit evidence, the ledgers, and the wave specs.
This is exactly D.W0's dev/impl boundary.

**E.W1–W11 await authorization.** The implementation half is authored-now,
run-later: it opens only on explicit user authorization, gated on keyframes'
own green CI (inv-27). inv-16 holds: only keyframes.js is written; the glass-ui
`LabeledField` a11y (ASK-3), the `--spring-*` codegen (ASK-2), and the reka-ui
dialog seam stay OUTWARD. The publish leg (the stacked B `3.1.0` + C `major` +
D `major` + E `minor` changesets → tag → release) is user-domain, confirm-first.

**The mandate is BINDING + sweep-enforced** (`E.md` §Mandate): NO quick
solutions / NO workarounds (no documented-limitation hatch beside a real fix —
the one found, E.W7 S1's "KISS minimum" branch, is excised), transpositions for
elegance·simplicity·performance, NO legacy (no alias / deprecated path /
polyfill — feature-detect with the JS path as the genuine fallback),
measure-first, isomorphic-unless-named, KISS (the ALREADY-SOTA record binding),
and the mandate travels verbatim inside `valuejs-sota-handoff.md`.

**Planned DAG (run-later):** E.W0 (now) → **BAND 1** E.W1 ∥ E.W2 ∥ E.W3 (largely
file-disjoint demo lanes — encapsulation-vs-listener-vs-style) + E.W5 (engine
BOOK-only, parallel); → **BAND 2** the deep-SOTA assay E.W7 → E.W8 (the
transposition depends on W7) ∥ E.W9 ∥ E.W10 (engine `src/animation/`, parallel to
W5) + E.W11 (demo elevation, parallel, rebases onto W1/W2/W3); → E.W4 (perf,
sequenced *after* the demo waves AND W11 settle so lighthouse measures the FINAL
surface — incl. W11's VT scene-swap + W9's content-visibility) · E.W6 closes
(absorbing the W7–W11 gates). E is **independent of D.W5/W6** (which close on
glass-ui 3.3.0 via D's heartbeat `b5gt704vz`); every E wave is gate-free of
glass-ui. The library legs are gate-free (`proof:boundary`); only the demo/perf
legs gate.

## Wave status

| Wave | Title | Phase | Status | Hard gate (falsifiable instrument) |
|---|---|---|---|---|
| **E.W0** | Audit-fold + the path forward | DEV | **RUN now** | The 6-lane assay is on disk under `audit/` + re-runnable (the grep/wc/lighthouse instruments each lane cites re-execute from the repo); the lighthouse baseline is captured (`audit/lighthouse/`, **20 report artifacts** — 6 cold-CLI JSON + 12 open-panel scene JSON + 2 CLI HTML, plus `_perf-summary.json`; verified `ls`) + the modern-web comparison digested (`audit/modern-web-findings.md`, `npx modern-web-guidance@latest install` reproduced — 137 guide files under `.agents/skills/modern-web-guidance/guides/`, verified `find`); the consolidated deferred ledger confirms **zero KFE** (P-invariant-28 — D terminated every keyframes-owned deferral, E folds no chronic debt); the prompt-recap confirms full A→B→C→constellation→D→E coverage with no drops; every E.W1–W6 spec carries its own falsifiable hard gate. |
| **E.W1** | Frontend encapsulation round 2 | IMPL | **authored — awaits auth** | `proof:decomposition` (extended) — `App.vue` (452L, verified `wc -l`) splits into `usePlaybackSnapshot` + `useSceneSwap` composables and drops under its stated ceiling; `useOrbitalPointer.ts` (376L) is thinned (the transform-application business logic moves to `OrbitalDrag.vue`) and drops under its ceiling; `EasingCurveCanvas.vue` (351L) is recorded COHESIVE and LEFT (no forced split); zero behaviour change (the demo gate suite — `demo-smoke`/`occlusion`/`lighthouse`/`proof:dogfood` — stays green + a component-render smoke). Net-deletion, zero pixel change. |
| **E.W2** | The vueuse listener/observer gestalt (the inv-ζ analogue, completed) | IMPL | **authored — awaits auth** | `proof:brittleness` extended — zero manual `addEventListener` / `new ResizeObserver` in the demo's reactive code (`grep` over `demo/` excl `/dist/` returns the `useEventListener`/`useResizeObserver` forms only; the 6 listener files + 3 observer sites converted; any genuine exception allowlisted + documented); the 2 `querySelector` couplings (`KeyframeCardList.vue:51` `querySelectorAll("pre")`, `AnimationControls.vue:190` `data-state=active`) resolve to owned refs / a child-ref contract (`grep` returns the owned-ref forms). Leak-fix + net-deletion. |
| **E.W3** | Styling localization round 2 (isomorphic) | IMPL | **authored — awaits auth** | `proof:idioms` extended — `.gold-shimmer` resolves from the demo's OWN built CSS (the ungated inv-η rent closed: used ×3 — `EasingSelect.vue:23,59`, `AnimationControlsControls.vue:69` — with **0** demo-local definitions today; falsifiable by stubbing the demo-local source); the named arbitrary values are tokenized (`min-w-[12rem]`×3 → `--dropdown-min-width`, `w-[30vw]` → `--target-viewport-w`, `w-[calc(100%-3rem)]` → `--visualizer-track-gutter`, `EasingSelect max-h-[min(24rem,60dvh)]` → a named cap); `--panel-max-h` reconciles to `dvh`; the `@apply .progress-bar` dup is deduped; isomorphic — the capture harness AFTER ≈ BEFORE except the befitting, named deltas. |
| **E.W4** | Performance + modern-web alignment | IMPL | **authored — awaits auth (sequenced after E.W1–W3)** | the authored gate set: `proof:mwg-installed` (`.agents/skills/modern-web-guidance/guides/` on disk, the install reproduces); `proof:lighthouse-mobile` — `npm run gh-pages` + lighthouse **mobile** per scene asserts each scene's mobile Performance ≥ a declared per-scene ceiling (the real baseline: home/cube/square/easing 61–64, amiga 49, spring 52) AND the spring-mobile LCP 28.1 s regression is terminated (the Monaco eager-import code-split is the dominant lever); `proof:demo-yield` — the heavy demo parse/format path yields (`scheduler.yield`/`postTask` present in the demo edit path OR a LoAF assertion that no demo edit task exceeds 50 ms); `proof:content-vis` (IF D-3 lands measure-first positive) — off-screen scene host carries `content-visibility:auto` PAIRED with `contain-intrinsic-size`; the §1 modern-web checklist re-scored with every row ALIGNED / GAP-closed / N-A-with-recorded-reason. |
| **E.W5** | Engine housekeeping (BOOK-only) | IMPL | **authored — awaits auth** | `proof:engine` stays green + `npm test` green (no regression); the managed-animation pause contract is documented (a comment at `group.ts:126,579`, not code); `tryParseCache` eviction (`utils.ts:145`) lands ONLY if measured to matter (measure-first, the recorded measurement in-tree — else recorded-withheld, exactly as D-3 was withheld). The engine is at gestalt — E records, barely edits; `proof:boundary` stays green (no static value.js edge introduced). |
| **E.W6** | Close (recap · ledger · release) | IMPL (LAST) | **authored — awaits auth** | `FINAL.md` reconciles the consolidated ledger (zero KFE re-verified by the ledger grep; every CLOSED item regression-checked, every OUT enabler kept stable, every ARCH recorded); the prompt-recap confirms every A→B→C→constellation→D→E ask ADDRESSED / PENDING (D-owned) / E-SCOPE; the AFTER capture re-runs from the repo (`scripts/capture.mjs after`, 0 console errors) + `audit/DELTA.md` pairs each page's intended change to its gate evidence; the E changeset (**minor** — W9/W10 ship observable additive new public API) is cut + the version owner named; **absorbs the E.W7–W11 gates**; the full proof suite green; DELTA shows no unintended regression. |
| **E.W7** | Engine compile + runtime correctness and hot-path (measure-first) | IMPL (deep-SOTA band) | **authored — awaits auth (∥ E.W5)** | `proof:engine-correctness` + `proof:standalone-zero-alloc` (inv ν) — lock-tests red today + green on fix for: FC-1 `setColorSpace("lab")` after `fromString` changes the interpolated channel (`engine.ts:428,444` write options + `return this`, no `parse()` — verified); D-1 the 3-stop non-adjacent per-keyframe-easing inheritance (`frame-compiler.ts:150` seeks the compiled array by a template index); the WAAPI guard rejects `cqw` or the docstrings match; **a finite delegated WAAPI play leaves `target.getAnimations()` === 0 residual** (today the `finally` leaves N `fill:forwards` animations — `r-waapi` W1); **a `linear(0, 0.5 25%, 1)` resolves to its true curve, NOT `easeInOutCubic`** (`getTimingFunction` `utils.ts:103` has no `linear(` branch — verified). The hot-path B-strand (standalone `interpFrames` zero-alloc; the `delete`-loop deopt; bound `tryParseCache` `utils.ts:145`) lands behind a shaped `interpolation.bench.ts` variant or is recorded-withheld. W8 depends on W7. |
| **E.W8** | The FrameCompiler transposition (NumericAnimation SoA + incremental) | IMPL (deep-SOTA band) | **authored — awaits auth (DEPENDS on E.W7)** | `proof:compile-deterministic` (two `parse()`s on identical input produce byte-identical `frames[]` — reds today on the `this.frameId++` counter `frame-compiler.ts:147,182`, greens on the content-derived id) + `proof:compile-incremental` (`updateSegments(k)` produces `frames[]` byte-equal to a full `parse()`, CI-asserted; the incremental path ships only on a measured editor-workload win — the demo's double-compile-per-keystroke profile, else recorded-withheld). Ports the `NumericAnimation` SoA + incremental discipline (`numeric.ts:8-15,186-205`, ALREADY-SOTA in-tree) up to `FrameCompiler`. Demo prerequisite (pure cleanup, lands first): stop the editor double-compile (`useKeyframeOps.ts`). Carries W7's D-1 fix as the isomorphism guard. |
| **E.W9** | Modern-platform adoption (library, baseline-safe + feature-detected) | IMPL (minor — new API) | **authored — awaits auth (∥ engine band)** | `proof:platform-adopt` (inv ξ) — per adopted feature a feature-detect guard test (no-op where unsupported — jsdom/SSR green) + a behaviour-equivalence test to the JS path: D-LIB-1 the parsed `@property` registry round-trips into `CSS.registerProperty()` (zero `CSS.registerProperty(` in `src/` today — the registry is inert `engine.ts:995`; verified); D-LIB-3 the live-PRM `change` listener flips a mid-flight infinite animation to rest (`internal/reduced-motion.ts` reads `.matches` once per `play()`, zero `change` listener — verified); native CSS Color L4 interp admitted only when `(colorSpace,hueMethod)` matches the UA default + non-legacy emit (`r-css-color` F5 / `r-waapi` W2); the native `ScrollTimeline`/`ViewTimeline` bridge is **additive only** (the JS-sampler ARCH-kill HOLDS). Needs the value.js hand-off. |
| **E.W10** | The orchestration tier (the competitive feature frontier) | IMPL (minor — new API) | **authored — awaits auth (∥ engine band)** | `proof:orchestration` — each primitive ships a unit test + a dogfood demo scene + a `proof:boundary` re-check (the value.js-free light helpers carry zero static value.js edge): `stagger` (delay distribution per `from`), `sequence`/timeline (playhead→child-clock at absolute/relative/label — the name-collision with the scroll `Timeline` resolved in design FIRST as task 1, BOOKED), `flip`/`flipShared` (invert-correctness over `ElementMorph`), `drag`+`decay` (release-velocity→spring continuity feeding `SpringProgress`), `SpringProgress.fromDuration({duration,bounce})`, the `animate()` front door. Purely additive — the engine already owns the hard physics; the gaps are thin construction-time adapters. |
| **E.W11** | Demo elevation (View Transitions · a11y uniformity · idiom r3 · first-paint) | IMPL (demo, ∥ engine band) | **authored — awaits auth (rebases onto E.W1–W3)** | `proof:demo-elevate` (inv ο) — the VT clause (`switchScene` routes the feature-detected `useViewTransition`; the no-VT `SpringProgress` dogfood fallback preserved + tested; PRM degrade asserted; focus routes to the new scene heading); the a11y-uniformity clause (every `role`/`tabindex` control inherits the demo-owned focus ring + correct role/keyboard or `aria-hidden`); the idiom-r3 clause (`--spring-snappy` resolves canonical ζ=0.85; the `progress-rail`/`progress-dot` recipe demo-local; `.dock-inset` defined-or-absent); the first-paint clause (`AnimatedText` PRM-guarded + no `200%` stop; the `size-adjust` metric-matched `@font-face` on the Instrument-Serif LCP `<h1>`, CLS held); the CWV-levers clause (the Monaco panes `forceMount`ed + `content-visibility:hidden` when inactive with `aria-hidden`+focus-move; the active scene loop pauses on `document.hidden`; the `@starting-style` artifact scene renders the emitted `linear(...)` behind a copy button). Theme 0 deletes the dead `CommandPalette.vue` (verified present). |

## W0 audit evidence (on disk)

The 6-lane assay lands under `audit/`, each lane file:line-grounded with a
SHIP/BOOK/KILL/RECORD disposition and a re-runnable grep/wc/lighthouse
instrument. Five author-lane findings files + the two ledgers + the captured
lighthouse reports:

- **Encapsulation lane** (`audit/encapsulation-findings.md`) — the round-2
  decomposition inventory: `App.vue` 452L (routing + playback-snapshot +
  scene-swap-spring → 2 composables); `useOrbitalPointer.ts` 376L
  (input-plumbing + transform business-logic → thin it, move transforms to
  `OrbitalDrag.vue`); `EasingCurveCanvas.vue` 351L recorded COHESIVE → LEAVE.
  Naming / colocation / stores / `markRaw` / provide-inject all idiomatic. The
  D.W1 decomposition did not target these — they are the NET-NEW residual.
- **Brittleness lane** (`audit/brittleness-findings.md`) — the listener/observer
  gestalt: ~15 manual `addEventListener` sites across **6** files (SpringTarget,
  `useOrbitalPointer`, PlaybackRibbon[`once:true` crutch], `useDragCapture`,
  AssetViewport, AssetLayerPanel) + **3** `new ResizeObserver`
  (`EasingTarget.vue:231`, `AmigaScene.vue:84`, `CSSCodeEditor.vue:156`) NOT on
  vueuse → `useEventListener`/`useResizeObserver`; the 2 `querySelector`
  couplings (`AnimationControls.vue:190` `data-state=active`,
  `KeyframeCardList.vue:51` `querySelectorAll("pre")`) → owned refs. This is the
  inv-ζ analogue inv ζ did NOT cover (the rAF gestalt is closed; the listener
  gestalt is the E completion).
- **Styling lane** (`audit/styling-findings.md`) — `.gold-shimmer` ungated rent
  (the inv-η class — used ×3, **0** demo-local definitions, resolves only via
  glass-ui) → own locally; the recurring arbitrary values → tokens
  (`min-w-[12rem]`×3, `w-[30vw]`, `w-[calc(100%-3rem)]` magic gutter,
  `EasingSelect max-h-[min(24rem,60dvh)]`); `--panel-max-h: 60vh` vs the
  work-area `dvh` inconsistency → reconcile; the `.progress-bar { @apply h-2
  rounded-md }` dup → dedup. style.css / design-idioms / brand otherwise clean;
  no deprecated CSS; calc chains cycle-free; z-scale clean.
- **Perf + modern-web lanes** (`audit/lighthouse-findings.md` +
  `audit/modern-web-findings.md` + `audit/lighthouse/` — 20 captured report
  artifacts) —
  the lighthouse baseline (cold + open-panel axes, fresh from a `npm run
  gh-pages` build) + the `modern-web-guidance` install + comparison checklist.
  Headline: the cold paint HOLDS B's baseline (D moved nothing); the genuine,
  net-new surface is **(a) Monaco's eager 4 MB import** (`CSSCodeEditor.vue:14`
  `import * as monaco` — the dominant `unused-javascript` lever, 2,664 KiB on
  spring) and **(b) the render loops that don't yield off-screen/off-tab** (the
  amiga TBT artifact is the canary). a11y/SEO/Best-Practices are green +
  demo-owned-clean; the only a11y hold is glass-ui's (OUT). The engine is
  EXEMPLARY (6 modern-web items ALIGNED, zero GAP).
- **Engine lane** — the engine assay is recorded across the perf/modern-web
  lanes (§2 of `modern-web-findings.md`): the published library is the reference
  implementation of `scheduler.yield`/PRM/WAAPI/`linear()`-physics; zero engine
  GAP; the 2 BOOK items (the managed-pause doc, the `tryParseCache` eviction
  measure-first) route to E.W5 and are NET-NEW (not the D-terminated residuals).
- **Deferred + recap lanes** (`audit/deferred-ledger.md` +
  `audit/prompt-recap.md`) — the whole-history A→E ledger (zero KFE; D was the
  terminal home for every keyframes-owned deferral) and the full
  A→B→C→constellation→D→E prompt recap with no drops.

## Verified facts at E-open

Every figure below is a re-runnable `wc -l` / `grep` / lighthouse-JSON
measurement against the live tree on `tranche-d-impl` (2026-06-05), not the
plan's prose — **verified, not asserted.**

- **The library is green** — `npx vitest run`: **336 tests, 28 files, 0
  failures** (2.3 s). The engine is EXEMPLARY post-D; E barely touches it.
  (verified)
- **The three round-2 encapsulation targets** — `wc -l`: `demo/app/App.vue`
  **452L**, `demo/@/components/custom/orbital-drag/composables/useOrbitalPointer.ts`
  **376L**, `demo/@/components/custom/EasingCurveCanvas.vue` **351L** (the last
  recorded cohesive → leave). These are the NET-NEW residual the D.W1
  decomposition did not target (D.W1's targets were AnimationControlsGroup /
  KeyframesEditor / KeyframeTimeline / useKeyframesEditor / useTimeline — all
  decomposed in D, landed `905a8c3`). (verified)
- **The `.gold-shimmer` ungated rent** — used ×3 (`EasingSelect.vue:23,59`,
  `animation-controls/controls/AnimationControlsControls.vue:69`) with **0**
  demo-local definitions (`grep -rn '\.gold-shimmer' demo --include='*.css'`
  excl `/dist/` = 0) — it resolves today only through the transitive
  `@mkbabb/glass-ui` cascade. The inv-η analogue of D's idiom rent: it paints
  correctly today but flattens silently if glass-ui renames/drops the class.
  E.W3 closes it by OWNERSHIP (a demo-local definition), not a shim. (verified)
- **The manual listener/observer sites** — `addEventListener` in **6** source
  files (`demo/spring/SpringTarget.vue`, `useOrbitalPointer.ts`,
  `controls/PlaybackRibbon.vue`, `controls/composables/useDragCapture.ts`,
  `asset-manager/AssetLayerPanel.vue`, `asset-manager/AssetViewport.vue`); **3**
  `new ResizeObserver` (`easing/EasingTarget.vue:231`,
  `app/scenes/AmigaScene.vue:84`, `keyframes/CSSCodeEditor.vue:156`) — all NOT
  on vueuse. E.W2 transposes them to `useEventListener`/`useResizeObserver`.
  (verified, excl `/dist/`)
- **The Monaco eager import** — `CSSCodeEditor.vue:14` `import * as monaco from
  "monaco-editor"` (+ worker imports) statically graphs ~4 MB; the spring scene
  loads it without rendering the editor, yielding 2,664 KiB `unused-javascript`
  (`cli-spring-desktop.json`). The scenes are already route-lazy
  (`demo/app/scenes.ts`, `defineAsyncComponent`); Monaco's static import
  short-circuits that win. The dominant E.W4 lever. (verified)
- **`content-visibility`: 0 uses in demo source** (`grep -rn content-visibility
  demo --include='*.css' --include='*.vue'` excl `/dist/` = 0). The off-screen
  scene lever is genuinely net-new and unclaimed. (verified)
- **The capture harness + the proof suite are checked in** — `scripts/capture.mjs`
  (22.6 KB), plus `proof-boundary` / `proof-dogfood` / `proof-engine` /
  `proof-decomposition` / `proof-idioms` / `proof-brittleness` /
  `proof-zero-alloc` + `demo-smoke` / `occlusion-gate` / `lighthouse-gate`. E's
  new instruments extend this suite; E does not re-author the harness. (verified)
- **The lighthouse baseline is captured** — `audit/lighthouse/` holds **20
  report artifacts** (`ls *.json *.html` excl `_perf-summary.json` = 20: 6
  cold-CLI JSON + 12 open-panel scene JSON + 2 CLI HTML) across the 6 scenes ×
  {mobile, desktop} on the cold + open-panel axes, fresh from a `npm run
  gh-pages` build, driven by the same shared driver the checked-in
  `lighthouse-gate.mjs` uses (`_perf-summary.json` + `perf-capture.mjs` are the
  summary + driver, not reports). Every score in `audit/lighthouse-findings.md`
  names the report file it came from. (verified — `ls
  docs/tranches/E/audit/lighthouse/`)

## Cross-repo / outward perimeter (USER-DOMAIN — confirm before each)

E is keyframes-internal (inv-16: writes only keyframes.js), cognizant of the
in-flight siblings — it consumes their *published* surface, plans around their
motion, writes none of them. **E's waves are gate-free of glass-ui** (the E DAG
is independent of the D.W5/W6 dock close).

1. **D.W5/W6 are PENDING-ON-E1, and they are D's close — NOT E's scope.**
   Verified at E-open: the source is still PRE-rename — `dock/index.ts`,
   `dock/TopDock.vue`, and `animation-controls/AnimationMenuBar.vue` are all
   present; `docs/tranches/D/FINAL.md` does NOT exist; the D changeset is CUT
   (`8ff893f`, the version owner named) but the dock-rename + square/mobile
   occlusion close + FINAL.md + AFTER-capture remain unrun. D.W5 gates on
   glass-ui PUBLISHING 3.3.0 (the dock primitives + the touch-gate B′ fix);
   **D's heartbeat (`b5gt704vz`) auto-resumes D.W5/W6** when 3.3.0 lands on npm.
   E does not touch the dock; E's waves do not depend on the dock close.
2. **glass-ui-AU** — the `LabeledField` a11y (ASK-3), the `--spring-*` codegen
   (ASK-2), the reka-ui dialog/popover seam (the "verify native `<dialog>`"
   check resolves NEGATIVE — reka-ui renders a role-`div` + JS focus-trap, not
   the native element), and the `<Role>Dock` base-component (AU.W8) are ALL
   glass-ui-owned. E keeps the named lighthouse allowance (`bucket-glassui`)
   stable, keeps the `springLinearStops()` export stable + value.js-free, and
   applies NO vendor band-aid in the demo (inv-16). These are OUT, not E
   findings.
3. **value.js-M** — DIRTY/active (v1.0.0). keyframes' *demo* consumes value.js
   (the easing demo); the *library*'s light barrel carries no static value.js
   edge (the heavy engine reaches value.js only via dynamic
   `loadAnimationEngine()` — `proof:boundary`). E pins the *published* value.js,
   never M's branch.
3a. **The value.js SOTA hand-off (FOLD-VALUEJS-HANDOFF — a cross-repo deliverable,
    inv-16).** The deep-SOTA assay (E.W7–W11) surfaced a handful of value.js-owned
    perf/spec items that every lane converged on; they are consolidated ONCE,
    de-duplicated, into a single named proposal the **value.js owner** formalizes —
    keyframes proposes a value.js tranche, never writes it (inv-16). The
    keyframes-side index lands in `valuejs-sota-handoff.md`; the full charter is the
    synthesis `audit/sota/_SYNTHESIS-valuejs-handoff.md`. The items: the chronic
    consumption-seam pin-bump (`AnimationOptions`→`CSSAnimationOptions`,
    `Color.components.get("L")`→`Color.L` — verify + pin-bump when value.js publishes
    v1.0.0, isomorphic, NOT urgent); H1 bound the parse/normalize memo caches
    (LRU — the single most-named item, FC-6/F3/D-4 merge); VJS-1 a lean monomorphic
    interpolation carrier (the largest structural perf win); VJS-2 a computed-unit
    endpoint cache + batched `getComputedValue` (the D-3 win confirmed across the
    boundary — no kf edit required); VJS-3 the `Color.toString` per-frame cost;
    D-VJS-1 the lossless `@property` `syntax`/`inherits` round-trip (enables W9's
    `CSS.registerProperty`); the `cssColorInterpKeyword` + L4-preserving serializer
    (enables W9's native WAAPI color interp); VJ-1 the `decay`/`linear()` samplers
    (lets W10's `decay`/`springLinearStops` collapse to thin callers); D-VJS-2
    positioned-`linear()` stop parity; and the ~24 no-op declared length units
    (`dvh`/`vi`/`lh`/`cap`… HIGH correctness). Every item is byte-/pixel-identical by
    construction; keyframes consumes the published result + re-verifies via a kf
    integration test (the isomorphism guard for the dependency upgrade). E does NOT
    block on it — the items are value.js-owned; W7's `linear()` consumption fix +
    W10's light helpers land kf-side independently of the hand-off.
4. **The publish legs (USER-DOMAIN)** — the stacked changesets (B `3.1.0` + C
   `major` + D `major`) are CUT, unpublished; E adds its own (E.W6 —
   **minor**/**patch**: demo + perf, non-breaking lib housekeeping). At E-open:
   `package.json` version `3.0.0`; `.changeset/` holds `tranche-b-3-1-0.md` +
   `tranche-c.md` + `tranche-d.md`. The version owner for B/C/D is named in D's
   changeset (**Mike Babb**, `mike@babb.dev`); E.W6 names its own. Everything up
   to "ready-to-publish, CI green" is autonomous; the npm-publish legs the user
   drives in dependency order.

## Open deferrals

Zero perpetual punts. **Zero KFE.** D was the terminal home for every
keyframes-owned deferral (P-invariant-28); the ledger E inherits is CLEAN.
E folds no chronic debt because none remains — E's content is NET-NEW findings
from the post-D 6-lane assay, not folded debt. The full whole-history A→E ledger
is in `audit/deferred-ledger.md`; the terminal summary:

| Item | Tag | Terminal status / E duty |
|---|---|---|
| `proof:boundary` · inv γ · inv δ · inv ζ · inv ε (the standing gates) | **CLOSED** | landed A/B/C, D-verified; E keeps green (no-regress) |
| LoAF / >50ms 2nd consumer (B drift, C-corrected) | **CLOSED** | corrected in C; E.W4's INP relief is *aligned* (more headroom, never regress) |
| φ-ladder (display tier C, leaf-tail D) — CHRONIC A→B→C | **CLOSED** | the chronic ENDED in D; E.W3 reintroduces no raw body rung |
| C demo-polish set (EasingTarget leak · dead scene CSS · cartoon-shadow · …) | **CLOSED** | E.W3 no-regress |
| engine W0-slips (`_snapSettled` · `leaves.ts \| any` · deprecated re-exports) | **KFD-TERMINATED** (D.W3/W4, landed) | none — engine EXEMPLARY post-D |
| square/mobile occlusion · dock-rename + `index.ts` delete · `always-expanded` mask | **KFD-TERMINATED** (D.W5, D-PENDING-ON-E1) | **D's close, NOT E's** — E keeps inv δ green |
| ASK-3 `LabeledField` a11y · ASK-2 `--spring-*` codegen · ASK-1 dock double-tap · AU.W8 `<Role>Dock` base | **OUT** (glass-ui) | E keeps the enablers + the named allowance stable; no vendor band-aid |
| ScrollTimeline-native · Worker/OffscreenCanvas · dev.sh/deploy.sh | **ARCH** | permanent KILL (recorded; do not re-litigate — the E perf assay re-affirmed) |
| D.W5 (dock+occlusion close) · D.W6 (D FINAL + B/C/D version owner) | **D-PENDING-ON-E1** | D's close, gated on glass-ui 3.3.0; D's heartbeat resumes it |
| the stacked publish leg (B `3.1.0` + C `major` + D `major` + E) | **USER-DOMAIN** | confirm-first; E.W6 names E's own version owner |

**There is no KFE row.** No item folds chronic debt into an E wave. The E waves
are findings, not folds. No item is named-forward to a sixth tranche. The two
historical drifts (B's falsely-closed LoAF; B's advisory inv δ) were *corrected*
in C and stay tracked (CL-4 / CL-3). The one un-orphaned-by-design loose end —
the stacked-changeset version owner — is NAMED (B/C/D in D.W6, E in E.W6); the
publish leg stays user-domain by design.
