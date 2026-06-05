# Tranche E — keyframes.js: the demo made fast · modern-web-aligned · the vueuse listener gestalt completed · the design language localized round 2

E is keyframes.js' fifth tranche. D refined the demo to the encapsulation + KISS
standard the engine already held, transposed the engine to its gestalt (the
`AnimationGroup` zero-alloc tail, the `tick`→`advanceTo` driver canon, the
`FrameCompiler` split, the honest `pause`/`resume`/`toggle`), localized the
design language (the four rented `var()`-idioms owned demo-locally, the monolith
uncaged, the φ-ladder leaf-tail terminated), and was the terminal home for
*every* keyframes-owned deferral (P-invariant-28 — zero perpetual punts). D is
green across every gate (336 tests · tsc 0 · `proof:idioms`/`proof:zero-alloc`/
`proof:localized` + the standing α–ζ suite). Where D made the demo *correct +
localized* and the engine *gestalt*, E makes the demo **fast + modern-web-aligned
+ maximally idiomatic**, and **completes the vueuse listener/observer gestalt
D.W3 began** — the second half of the dogfood discipline inv ζ swept only for
rAF.

E is in DEVELOPMENT now. The 6-lane assay (E.W0) is RUN — the evidence is on disk
under `audit/` (the encapsulation / brittleness / styling / lighthouse /
modern-web / engine lanes, the lighthouse baseline of 20 captured report
artifacts, the `modern-web-guidance` install + comparison checklist, the
consolidated deferred ledger, the full prompt-recap). E.W1–W6 are
authored-now-run-later wave specs; the implementation phase opens only on explicit
user authorization, gated on keyframes' own green CI. No engine, demo, or library
source is written in development — exactly D.W0's dev/impl boundary.

## § Mandate (binding — every wave, every fold, every hand-off)

The precepts the whole tranche set runs under, stated once at the charter's
front and BINDING on every E wave (W0–W11), every gate, and every cross-repo
hand-off this tranche emits:

- **NO quick solutions, NO workarounds** — idiomatic, gestalt approaches only.
  A wave may not pin a bug as a "documented contract", patch a symptom at the
  wrong seam, or offer a weaker-alternative escape hatch beside the real fix
  (the hard gates are written to pass ONLY the transposition).
- **Architectural transpositions in the sake of elegance, simplicity, and
  performance above all are both necessary and desirable** — this is a
  development product. E.W7's correctness fixes land at the root seam, E.W8 IS
  a transposition (the `NumericAnimation` SoA discipline ported up to
  `FrameCompiler`), the value.js hand-off's Wave A/D are transpositions
  (`any()`→`dispatch()`, the interpolation carrier) — sequenced as such, never
  as patches.
- **NO legacy code** — no compat alias, no deprecated path kept beside its
  replacement, no polyfill (feature-detect with the JS path as the genuine
  fallback — E.W9's discipline; `scroll-timeline-polyfill` is by-name
  forbidden). A replaced surface is replaced in one motion; a removed name is
  removed.
- **Measure-first** — every perf claim lands behind a shaped bench or is
  recorded-withheld (the D-3 discipline). **Isomorphic** — pixels/behaviour
  stable unless a befitting delta is NAMED. **KISS** — the §ALREADY-SOTA record
  is binding: manufacture no work where the kernel already leads. **inv-16** —
  E writes only keyframes.js; value.js/glass-ui items route as hand-offs/OUT.

ENFORCED, not asserted: an adversarial precept sweep over the authored tranche
(alias/shim/back-compat/polyfill/punt-language/escape-hatch classes) found ONE
violation — E.W7 S1's "OR (KISS minimum) document the contract" hatch — which is
EXCISED (the WHAT now mandates the re-derive transposition the gate always
required); the mandate block now also travels verbatim inside
`valuejs-sota-handoff.md` (a charter that leaves this repo carries its precepts
with it).

## § Thesis

D's headline — "the demo refined, the engine transposed to its gestalt, the dock
leveraged, the deferrals terminated" — is REAL, and the post-D state confirms it
as the model. The library is green (`npx vitest run`: **336 tests · 28 files · 0
failures**, verified); the engine is EXEMPLARY (the 6-lane assay found **zero
engine GAP** against the modern-web guidance — the published library is the
reference implementation of `scheduler.yield`/PRM/WAAPI-delegation/`linear()`-
physics); the design language is owned + localized; the deferred ledger D
terminated is CLEAN. E is the layer *after* D, and it states its provenance
honestly: **E folds no chronic debt because none remains.** Every E finding is
NET-NEW — surfaced by the post-D 6-lane assay, not a re-open, not a fold.

The assay catalogues, with file:line evidence (`grep`/`wc`/lighthouse-JSON), four
net-new bodies of demo-side work no prior tranche owned:

1. **The demo has a round-2 encapsulation residual the D.W1 decomposition did not
   target.** D.W1 decomposed the five units it owned (AnimationControlsGroup,
   KeyframesEditor, KeyframeTimeline, useKeyframesEditor, useTimeline — landed
   `905a8c3`). The assay finds three units the D pass did not touch: `App.vue`
   (**452L**, verified `wc -l`) conflates routing + playback-snapshot +
   scene-swap-spring → two composables; `useOrbitalPointer.ts` (**376L**)
   conflates input-plumbing + transform business-logic → thin it (the transform
   application moves to `OrbitalDrag.vue`); `EasingCurveCanvas.vue` (**351L**) is
   recorded COHESIVE → LEFT (no forced split — the discipline cuts both ways).
   Naming / colocation / stores / `markRaw` / provide-inject are all idiomatic.
   Net-deletion, zero pixel change (`audit/encapsulation-findings.md`).

2. **The vueuse listener/observer gestalt inv ζ left half-swept.** C.W3 closed
   inv ζ — the demo stopped hand-rolling **rAF** loops and dogfooded its own
   engine (`proof:dogfood`). D.W3 hardened the brittle DOM-selector seam
   (`proof:brittleness`). But inv ζ covered only the rAF primitive; the
   **listener/observer** primitives were never swept. The assay finds ~15 manual
   `addEventListener` calls across **6** files (SpringTarget, useOrbitalPointer,
   PlaybackRibbon[the `once:true` double-bookkeeping crutch], useDragCapture,
   AssetViewport, AssetLayerPanel) + **3** `new ResizeObserver`
   (`EasingTarget.vue:231`, `AmigaScene.vue:84`, `CSSCodeEditor.vue:156`) NOT on
   vueuse — manual `removeEventListener`/`disconnect` bookkeeping where
   `@vueuse/core`'s `useEventListener`/`useResizeObserver` (auto-cleanup via
   `tryOnScopeDispose`) already are the thing — plus 2 `querySelector` couplings
   (`AnimationControls.vue:190` `data-state=active`, `KeyframeCardList.vue:51`
   `querySelectorAll("pre")`) that reach into DOM by attribute selector where an
   owned/child ref is more robust. This is the inv-ζ analogue inv ζ did NOT cover
   — the SECOND half of the dogfood discipline (`audit/brittleness-findings.md`).

3. **The styling layer has one ungated UTILITY-tier idiom rent D.W2's clause
   shape missed, plus literal/reconcile/dedup residue.** D.W2 closed the inv-η
   rent for the `var()`-shaped idioms (`--rainbow-*`, `--color-gold`,
   `.scale-on-hover`, `@keyframes enter`). But `proof:idioms` clause 1 derives its
   referenced set from `var(--token)`/`.scale-on-hover`/`@keyframes` shapes
   (`proof-idioms.mjs:99-118`), and `.gold-shimmer` is a CLASS utility matching
   none of those patterns — so the D.W2 clause never swept it. It is referenced
   ×3 (`EasingSelect.vue:23,59`, `AnimationControlsControls.vue:69`) with **0**
   demo-local definitions (`grep -rn '\.gold-shimmer' demo --include='*.css'` excl
   `/dist/` = 0): it resolves TODAY only through the transitive `@mkbabb/glass-ui`
   cascade — the exact ungated cross-repo rent inv η names, one rent that slipped.
   Plus a handful of recurring arbitrary-value literals that earn tokens
   (`min-w-[12rem]`×3, `w-[30vw]`, `w-[calc(100%-3rem)]` magic gutter, the easing
   dropdown's `max-h-[min(24rem,60dvh)]`), a `--panel-max-h: 60vh`-vs-`60dvh`
   unit inconsistency, and a `.progress-bar { @apply h-2 rounded-md }` rule
   duplicated in two `<style scoped>` blocks (`audit/styling-findings.md`).

4. **The demo has a genuine, net-new performance + modern-web surface — and it is
   precisely two levers, not a broad rescue.** The COLD-load surface HOLDS Tranche
   B's baseline exactly (desktop Perf 88–96, the B band — D refactored + transposed
   without moving the first-paint number, the correct outcome). The product AS
   USED is the target: **(a) Monaco's eager 4 MB import** (`CSSCodeEditor.vue:14`
   `import * as monaco from "monaco-editor"` — the dominant `unused-javascript`
   lever, **2,664 KiB** on the spring scene, which loads the editor's chunk
   without rendering it; the scenes are already route-lazy via
   `defineAsyncComponent`, but Monaco's static import short-circuits that win and
   drives the spring-mobile LCP 28.1 s regression), and **(b) the render loops
   that don't yield off-screen / off-tab** (the amiga open-panel TBT 144,760 ms is
   the canary — the Three.js loop never yielding). a11y / SEO / Best-Practices are
   green + demo-owned-clean; the only a11y hold is glass-ui's (OUT). `content-
   visibility`: 0 uses in demo source — the off-screen scene lever is genuinely
   unclaimed (`audit/lighthouse-findings.md` + `audit/modern-web-findings.md`).

On top of refinement, E barely touches the published library: the engine is at
gestalt post-D, with only 2 trivial BOOK items (document the managed-animation
pause contract; consider `tryParseCache` eviction — measure-first). E is a
**demo-side performance + modern-web + frontend-refinement** tranche.

## § Goal criterion

E succeeds when the demo is refined to round 2, the vueuse listener/observer
gestalt is complete, the design language is fully owned + localized, the demo
holds a modern-web performance budget, and the engine's two BOOK items are
recorded:

- **The demo is decomposed to round 2.** `App.vue` (452L) splits into
  `usePlaybackSnapshot` + `useSceneSwap` composables and drops under its ceiling;
  `useOrbitalPointer.ts` (376L) is thinned (the transform-application business
  logic moves to `OrbitalDrag.vue`) and drops under its ceiling;
  `EasingCurveCanvas.vue` (351L) is recorded COHESIVE and LEFT. Net-deletion,
  zero pixel change.
- **The vueuse listener/observer gestalt is complete.** The ~15 manual
  `addEventListener` (6 files) + the 3 `new ResizeObserver` migrate to
  `useEventListener`/`useResizeObserver` (auto-cleanup; the `once:true`
  double-bookkeeping crutch dissolved; a leak-fix); the 2 `querySelector`
  couplings resolve to owned refs / a child-ref contract; the genuinely-dynamic
  + engine-loop sites are allowlisted + documented, not banned. The demo's
  reactive code carries zero hand-rolled listener/observer where vueuse is the
  thing — the inv-ζ analogue, completed.
- **The design language is fully owned + localized round 2.** `.gold-shimmer` is
  DEFINED demo-locally (the one inv-η rent that slipped, closed by ownership);
  the named recurring arbitrary values are tokenized (`--dropdown-min-width`,
  `--target-viewport-w`, `--visualizer-track-gutter`, the easing dropdown cap);
  `--panel-max-h` reconciles to the mobile-correct `dvh`; the `.progress-bar`
  dup deduplicates. Isomorphic — pixels unchanged except the befitting, named
  `vh`→`dvh` mobile-correctness delta.
- **The demo holds a modern-web performance budget.** Monaco is code-split off the
  static graph (the dominant lever — lifts the spring outlier, improves mobile
  FCP/LCP everywhere); the render loops yield/pause off-screen + off-tab (the
  amiga TBT terminated; INP relief on the heavy editing UI); off-screen scenes
  carry `content-visibility:auto` paired with `contain-intrinsic-size` (IF
  measured positive); the §1 modern-web checklist re-scores every row
  ALIGNED / GAP-closed / N-A-with-reason; `npx modern-web-guidance@latest install`
  reproduces. Per-scene mobile Performance holds a declared ceiling.
- **The engine's two BOOK items are recorded.** The managed-animation pause
  contract is documented (a comment, not code); `tryParseCache` eviction lands
  ONLY if measured to matter (measure-first, the measurement in-tree — else
  recorded-withheld, exactly as D-3 was withheld). The engine is at gestalt — E
  records, barely edits. `proof:boundary` stays green (no static value.js edge).

## § Completion criterion

The development half (E.W0) completes when the audit evidence is on disk (the
encapsulation / brittleness / styling / lighthouse / modern-web / engine lanes,
the lighthouse baseline of 20 captured report artifacts, the `modern-web-guidance`
install + comparison checklist, the consolidated deferred ledger, the full
prompt-recap under `audit/`), the deferred ledger confirms **zero KFE** (D was the
terminal home — E folds no chronic debt), the prompt-recap confirms full
A→B→C→constellation→D→E coverage with no drops, and each wave spec carries a
falsifiable hard gate.

The implementation half (E.W1–W6) completes when every wave's hard gate verifies:
the demo is decomposed round 2 (`proof:encapsulation` — the size-budget gate +
render smoke); the listener gestalt is complete (`proof:brittleness` extended —
zero manual `addEventListener`/`new ResizeObserver` in reactive code, the
querySelector couplings owned); the design language is fully localized
(`proof:idioms` extended — `.gold-shimmer` demo-local, the named arbitrary values
tokenized, `--panel-max-h` reconciled, the dup deduplicated); the demo holds the
budget (`proof:lighthouse-mobile` per-scene ceilings + the spring-LCP regression
terminated · `proof:demo-yield` · `proof:content-vis` IF measured positive · the
modern-web checklist re-scored · `proof:mwg-installed`); the engine BOOK items
land (`proof:engine` green, the pause contract documented, `tryParseCache`
eviction landed-or-recorded-withheld); FINAL.md re-verifies the clean ledger +
the changeset cuts.

## § Inherited invariants

E inherits A's + B's + C's + D's invariants and the constellation precepts. They
**continue** — E does not re-litigate them; it carries them forward (α–ι) and adds
the gates its own work needs.

- **inv α — the boundary is gated.** The library imports nothing of value.js' DOM
  surface into its hot path; the light barrel carries no static value.js edge (the
  heavy engine reaches value.js only via dynamic `loadAnimationEngine()`).
  `proof:boundary` stays green. E's perf work (W4) is DEMO-side; E's engine BOOK
  (W5) touches only `src/animation/` internals — the boundary gate is the standing
  proof neither regresses, and E introduces no static value.js edge.
- **inv β — the library build is glass-ui-free.** Honest disposition, prose ==
  artefact. E is demo-side; the library graph never references glass-ui. The demo
  consumes glass-ui's *published* surface; E's idiom localization (W3) *reduces*
  the demo's rented surface (owns `.gold-shimmer` demo-locally), never adds to it.
- **inv γ — the demo cannot ship blank.** Holds. E's decomposition (W1) + styling
  localization (W3) are isomorphic — `demo-smoke` is the standing proof the paints
  survive the refactor; E.W4 keeps every scene painting.
- **inv δ — no page occludes on any viewport.** HARD, both axes, bite-proven.
  E does not own the square/mobile allowance (D.W5 empties it — D's close, not
  E's). E.W1/W3/W4's isomorphic + budget work keeps `occlusion-gate.mjs` green —
  no-regress on every scene × viewport.
- **inv ε — the close cannot overclaim.** The standing discipline. Every gate E's
  FINAL records MET resolves to a checked-in, re-runnable instrument shown to PASS
  — not a narration. E's audit IS inv ε turned forward: every finding is
  `file:line`-grounded + verifiable (`grep`/`wc`/lighthouse-JSON), verified not
  asserted, and the NET-NEW provenance (zero KFE) is stated honestly, not
  laundered as folded debt.
- **inv ζ — the shop-window runs on its own engine.** Established in C; holds.
  E.W2 is its DIRECT completion — inv ζ swept the rAF primitive; E.W2 sweeps the
  listener/observer primitives (`useEventListener`/`useResizeObserver`), the same
  "carry no hand-roll a shipped primitive already is" discipline, applied to the
  demo's listener surface. `proof:dogfood` stays green (the Three.js renderer
  remains the justified exception).
- **inv η — no demo idiom ships rented-ungated.** Established in D (`proof:idioms`).
  E.W3 EXTENDS it to the UTILITY tier — `.gold-shimmer` is the one rent D.W2's
  `var()`-shaped clause did not match. The gate stays in CI; E.W3 makes it match
  the class-utility shape too.
- **inv θ — the AnimationGroup steady-state group path allocates zero bytes/frame.**
  Established in D (`proof:zero-alloc`, the checked-in heap/allocation bench). E
  does not touch the compositor; the gate is the standing proof E's engine BOOK
  (W5) introduces no per-frame allocation.
- **inv ι — the monolith does not re-fill; the leaf-tail does not regrow.**
  Established in D (`proof:localized`). E.W3 reintroduces no raw `text-sm`/`-xs`/
  `-base` body rung and re-homes no component rule back to `utils.css`; the gate
  is the standing proof the localized debt does not silently return.
- **inv-16 — E writes only keyframes.js.** E is keyframes-internal: it consumes
  the siblings' *published* surface (value.js-M, glass-ui-AU), plans around their
  motion, and writes none of them. The glass-ui `LabeledField` a11y (ASK-3), the
  `--spring-*` codegen (ASK-2), the reka-ui dialog/popover seam, and the
  `<Role>Dock` base (AU.W8) are ALL glass-ui-owned — OUT, no vendor band-aid.
  The `modern-web-guidance` skill installs under `.agents/` (tooling, not source).

## § E-specific invariants

E continues the Greek series from ι. Each is named, defined, and carries a
falsifiable hard gate — a re-runnable instrument, not a narration.

- **inv κ — no demo listener/observer ships hand-rolled where vueuse is the
  thing.** Every `addEventListener`/`removeEventListener` pair and every
  `new ResizeObserver`/`.disconnect()` pair in the demo's REACTIVE code (component
  `<script setup>` + composables) MUST be `@vueuse/core`'s
  `useEventListener`/`useResizeObserver` — the auto-cleanup primitive
  (`tryOnScopeDispose`) that retires the manual bookkeeping. (This is inv ζ's
  dogfood discipline applied to the listener/observer surface — the SECOND half
  inv ζ's rAF sweep did not cover. The same "do not hand-roll what a shipped
  primitive already is" rule, one primitive class over.)
  - **Gate (`proof:brittleness` extended / the listener clause):** a sweep
    `grep -rn "addEventListener\|new ResizeObserver" demo --include="*.vue"
    --include="*.ts"` (excl `/dist/`) returns ONLY the `useEventListener`/
    `useResizeObserver` forms — every raw `addEventListener` / `new ResizeObserver`
    in reactive code is converted, and any genuine exception (the
    `setPointerCapture` dynamic-mid-gesture pattern resolved via the
    `useEventListener` `stop()` handle; the Three.js engine loop) is ALLOWLISTED
    + documented in-instrument. FALSIFIABLE: it reds today (15 raw
    `addEventListener` across 6 files + 3 `new ResizeObserver` — verified `grep`);
    it goes green only when each is transposed; it reds again on any future
    hand-rolled listener/observer outside the allowlist. Bite-proven by
    re-introducing one `window.addEventListener(...)` in a converted component →
    the sweep reddens. The 2 `querySelector` couplings
    (`AnimationControls.vue:190` `data-state=active`, `KeyframeCardList.vue:51`
    `querySelectorAll("pre")`) resolve to owned refs / a child-ref contract in the
    same clause (`grep` returns the owned-ref forms).

- **inv λ — every demo idiom resolves demo-local at EVERY tier (incl. class
  utilities).** Extends inv η from the `var()`/`@keyframes` tier to the CLASS-
  utility tier. Every CSS custom property, `@keyframes`, AND utility CLASS the
  demo references MUST resolve to a definition the demo OWNS — present in the
  demo's own built CSS, not only via a sibling cascade. (inv η named the rent;
  inv λ is the recognition that the rent has a tier inv η's clause shape did not
  match — `.gold-shimmer` is a class utility, not a `var(--token)`, and slipped
  the D.W2 sweep. inv λ closes the tier gap so the idiom-ownership invariant is
  complete across token AND class.)
  - **Gate (`proof:idioms` extended / the class-utility clause):** the
    `proof-idioms.mjs` referenced-set derivation grows a class-utility shape so
    `.gold-shimmer` (and any future demo-referenced glass-ui utility class) is
    swept alongside the `var()`/`@keyframes` shapes, and asserts each resolves to
    a DEMO-OWNED definition (`design-idioms.css`'s contribution), not merely the
    merged cascade. FALSIFIABLE: it reds today on `.gold-shimmer` (referenced ×3
    — `EasingSelect.vue:23,59`, `AnimationControlsControls.vue:69` — with **0**
    demo-local definitions, verified `grep`); it goes green when `design-idioms.css`
    defines it; it reds again — falsifiable by stubbing the demo-local source — if
    any future class-utility reference has no demo-owned definition. Bite-proven
    by referencing one `.kf-nonexistent-shimmer` utility → the sweep reddens.

- **inv μ — the demo holds a modern-web performance budget.** Every scene MUST
  hold a declared per-scene mobile Performance ceiling, the published spring-LCP
  regression MUST be terminated, no demo edit task MUST exceed the 50 ms
  long-task threshold, and the §1 modern-web checklist MUST re-score every row
  ALIGNED / GAP-closed / N-A-with-recorded-reason. (The performance + modern-web
  analogue of inv δ's no-occlusion guarantee: a budget the demo holds, instrumented,
  not asserted — the post-D paint stays the B band on cold load, and the
  product-as-used surface clears the named ceiling.)
  - **Gate (`proof:perf-budget` / `proof:modern-web`):**
    (a) `proof:lighthouse-mobile` — `npm run gh-pages` + lighthouse **mobile**
    per scene asserts each scene's mobile Performance ≥ a declared per-scene
    ceiling above the captured baseline (home/cube/square/easing **61–64**, amiga
    **49**, spring **52** — `audit/lighthouse/_perf-summary.json`) AND the
    spring-mobile **LCP 28.1 s** regression is terminated (the Monaco eager-import
    code-split is the dominant lever). (b) `proof:demo-yield` — the heavy demo
    parse/format edit path yields (`scheduler.yield`/`postTask` present in the
    edit path OR a LoAF assertion that no demo edit task exceeds 50 ms). (c)
    `proof:content-vis` (IF measured positive) — every off-screen scene host
    carries `content-visibility:auto` PAIRED with `contain-intrinsic-size`. (d)
    `proof:mwg-installed` — `.agents/skills/modern-web-guidance/guides/` on disk,
    the install reproduces (137 guide files, verified `find`); the §1 checklist
    re-scores every row. FALSIFIABLE: the lighthouse gate reds today on the spring
    LCP outlier and the below-ceiling mobile scenes (verified
    `_perf-summary.json`); the yield gate reds on any >50 ms demo edit task; the
    content-vis gate reds if an off-screen host lacks the paired declaration;
    `proof:mwg-installed` reds on a partial clone (the `guides/` tree absent).
    Bite-proven by re-introducing the static `import * as monaco` → the spring LCP
    regression returns and the lighthouse gate reddens.

These three join inv α–ι + inv-16; they retire when E closes (the listener gestalt
complete, the idiom rent closed at every tier, the budget held) — but the gates
STAY in CI as the standing proof the debt does not silently return. E does NOT
re-letter D's invariants: inv η/θ/ι remain D's; inv κ/λ/μ are E's continuation.

**The deep-SOTA augmentation adds three more (inv ν/ξ/ο).** inv κ/λ/μ above were
the Baseline-checklist assay's invariants. The deep-SOTA assay (E.W7–W11, vs
libraries + the V8 cost model + the spec frontier — see §SOTA-augmentation) needs
three more, each net-new, each with a falsifiable gate that STAYS in CI.

- **inv ν — the engine is correct at compile time, isomorphic across playback
  modes, and zero-alloc on the primitive loop.** No setter mutates options the
  compile baked without re-deriving (`setColorSpace`/`setHueMethod` honor the
  live-options promise the comment makes — `engine.ts:428,444` today write + return
  with no `parse()`); no compiler indexes one array by another's offsets
  (`createFrame` — `frame-compiler.ts:150` seeks the compiled array by a template
  index); `parse()` is deterministic (byte-identical `frames[]` on identical input
  — the `frameId++` counter `frame-compiler.ts:147,182` is the purity hole); **the
  WAAPI path is lifecycle-isomorphic with the rAF path** — a finished delegated play
  `commitStyles()`+`cancel()`s, leaving zero residual filling animations (no cascade
  leak — `waapi.ts` today emits `fill:forwards` and never commits/cancels on the
  happy path); **the engine can read back its own emitted easings** — a `linear()`
  resolves to its true curve, not `easeInOutCubic` (`getTimingFunction` `utils.ts:103`
  has no `linear(` branch today); the **standalone** `interpFrames` allocates zero
  bytes/frame in steady state (the zero-alloc property holds for the primitive, not
  only the group composite) and the reused buffer stays in fast-properties mode.
  - **Gate (`proof:engine-correctness` + `proof:standalone-zero-alloc` — W7 + W8):**
    lock-tests red today + green on fix for each correctness item (the
    `setColorSpace("lab")`-after-`fromString` channel change; the 3-stop non-adjacent
    per-keyframe-easing inheritance; the WAAPI `cqw`-reject or docstring-match; **a
    finite delegated WAAPI play leaving `target.getAnimations()` === 0 residual**; a
    `linear(0, 0.5 25%, 1)` resolving to a callable sampling that shape, NOT
    `easeInOutCubic`); a sibling of `test/zero-alloc.test.ts` asserts the standalone
    `interpFrames` reuses one buffer reference + stays in fast-properties mode; the
    W8 byte-equality locks (`proof:compile-deterministic` two `parse()`s byte-identical;
    `proof:compile-incremental` the incremental path byte-equal to a full `parse()`).
    Every hot-path B-strand fold lands behind a **shaped** `interpolation.bench.ts`
    variant (threaded `out` buffer — the realistic playback shape the current bench
    omits) or is recorded-withheld with the measurement in-tree (the D-3 /
    `tryParseCache` posture). FALSIFIABLE: reds today on the colorSpace no-op + the
    `frameId` non-determinism + the `out={}` standalone alloc + the WAAPI
    residual-fill leak + the `linear()` silent-degrade (all verified live); greens on
    fix; reds again on any regression. Bite-proven by reverting one fix → the test reds.

- **inv ξ — the engine adopts the platform where Baseline-safe, feature-detected,
  with the JS path as the proven fallback.** A parsed `@property` registry is
  registered (not inert — zero `CSS.registerProperty(` in `src/` today, verified);
  reduced-motion is live-observed (not poll-per-play — `internal/reduced-motion.ts`
  has zero `change` listener today); native scroll/color/typed-custom paths attach
  behind a feature-detect with a behaviour-equivalence assertion to the JS path.
  Native color is admitted **only when the requested `(colorSpace, hueMethod)`
  matches the UA's `color-interpolation-method` default** AND the emitted endpoint is
  **non-legacy syntax** (else the JS path runs the exact requested space) — and the
  framing is honest: native color is *main-thread native interp + JS-hot-path
  removal*, NOT compositor offload (`r-css-color` F5 corrects `d-color-interp` D-6).
  The ScrollTimeline JS sampler is NOT replaced (the ARCH-kill holds — additive
  bridge only). Every adoption holds inv α (the boundary): the native paths ride the
  existing WAAPI/`loadAnimationEngine` dynamic edge; no new static value.js edge.
  - **Gate (`proof:platform-adopt` — W9):** per adopted feature: (a) a feature-detect
    guard test (no-op where unsupported — jsdom/SSR green); (b) a behaviour-equivalence
    test that the native path reproduces the JS-path output where both run; (c) the
    `@property` registry round-trips into a `CSS.registerProperty()` call (asserts the
    registry is no longer inert); (d) the live-PRM listener flips a mid-flight infinite
    animation to rest. FALSIFIABLE: reds today (zero `CSS.registerProperty`, zero PRM
    `change` listener — verified); each adoption greens its detect+equivalence test.

- **inv ο — the demo meets the SOTA bar it set itself, uniformly.** Every custom
  interactive surface carries the a11y semantics the demo's own gold-standard
  `role="slider"` proves (a consistency deficit — replication of an in-repo template,
  not invention); scene nav rides the platform's native View Transitions (with the
  `SpringProgress` engine-dogfood fallback); the idiom-ownership pass is complete at
  every layer (no divergent `--spring-snappy` token shadow, no copy-drift
  `progress-rail`/`progress-dot` recipe, no dead `.dock-inset` idiom); the first paint
  is PRM-guarded + **CLS-stable on the LCP `<h1>` (metric-matched `size-adjust` font
  fallback for the Instrument-Serif heading — `r-cwv-perf` B-1)** + signposted; the
  inactive Monaco panes cache render-state via `content-visibility:hidden` (instant
  switch-back, INP) and the active scene loop pauses on `document.hidden` (battery,
  re-basing the rAF clock on resume — no visible jump; corrected: NO `KeepAlive`, one
  scene mounted via keyed `<Suspense>`).
  - **Gate (`proof:demo-elevate` — W11):** the VT clause (`switchScene` routes the
    feature-detected helper; the no-VT fallback preserved + tested; PRM degrade
    asserted; focus routes to the new scene heading); the a11y-uniformity clause
    (every `role`/`tabindex` control inherits the demo-owned focus ring + correct
    role/keyboard or `aria-hidden`); the idiom-r3 clause (`--spring-snappy` resolves
    canonical, the recipe demo-local, `.dock-inset` defined-or-absent); the
    first-paint clause (`AnimatedText` PRM-guarded + no `200%` stop; the `size-adjust`
    descriptors present + CLS held on the LCP node); the CWV-levers clause (the Monaco
    panes `forceMount`ed + `content-visibility:hidden` when inactive behind the
    `@supports`/`display:none` fallback with `aria-hidden`+focus-move; the active scene
    loop pauses on `document.hidden`; the `@starting-style` artifact scene renders the
    emitted `linear(...)` behind a copy button + carries the PRM guard). FALSIFIABLE:
    reds today (one `:focus-visible` site, pointer-only timeline, divergent
    `--spring-snappy`, unguarded perpetual hero, no `size-adjust` fallback, no
    `visibilitychange` scene-pause — all verified); greens on the uniform pass; reds on
    any future bare-role custom control / token shadow. Bite-proven by stripping one
    `role` → the sweep reds.

inv ν/ξ/ο join inv α–μ + inv-16; they retire when the deep-SOTA waves close, but
their gates STAY in CI. They do NOT re-letter the earlier series: inv η/θ/ι remain
D's; inv κ/λ/μ are E's Baseline-checklist continuation; inv ν/ξ/ο are E's
deep-SOTA continuation.

## § Resolved design decisions

1. **`.gold-shimmer` is DEFINED demo-locally, not deleted-because-rented.**
   RESOLVED: it is used ×3 and feeds the live "detail easing/curve" affordance —
   it is referenced-and-rented (resolved via glass-ui today, ungated), not dead.
   The fix mirrors D.W2's resolution for `--rainbow-*`/`.scale-on-hover`: a
   single demo-local definition in the existing `design-idioms.css` (which E.W3
   EXTENDS, not re-authors), closing the ungated cross-repo rent by ownership
   (inv λ). Deleting the references would change the rendered surface; defining
   the idiom demo-locally makes the demo own the contract the source already
   intends. The provenance is stated honestly in FINAL: D.W2 owned the rented
   `var()`-idioms; E.W3 owns the one rented UTILITY-class idiom D.W2's clause
   shape did not match.

2. **The listener/observer transposition adopts vueuse 1:1 — with a documented
   allowlist, not a blanket ban.** RESOLVED: the mount-scope window listeners and
   the `ResizeObserver` sites map directly to `useEventListener`/`useResizeObserver`.
   The genuinely-dynamic `setPointerCapture` mid-gesture pattern (useDragCapture,
   useOrbitalPointer, the asset-manager drags) is ALSO covered — `useEventListener`
   returns a `stop()` handle and auto-cleans on scope dispose, so the imperative
   attach becomes `const stop = useEventListener(el, "pointermove", onMove)` with
   `stop()` on pointerup — net-deletion of the manual `removeEventListener`. The
   Three.js engine present-loop (AmigaScene) and any irreducibly-imperative site
   are ALLOWLISTED + documented in the gate, not forced. inv κ is "no hand-roll
   where vueuse is the thing" — not "no listeners," KISS over dogma.

3. **The performance budget targets the product AS USED, not just the cold paint.**
   RESOLVED: the lighthouse baseline is bimodal — the COLD-load surface holds
   Tranche B's band exactly (D moved nothing; the correct outcome — no cold-paint
   work is warranted beyond the Monaco defer, which lifts the spring outlier as a
   side effect), while the OPEN-PANEL editing state is the real target. inv μ's
   budget is declared per-scene against the captured baseline and instrumented by
   `proof:lighthouse-mobile`; E.W4 optimizes the editing surface (Monaco code-split,
   render-loop yield, INP relief), not the already-good first paint. The trap B's
   `_summary.json` half-fell into — conflating cold and open-panel — is avoided by
   capturing BOTH axes explicitly.

4. **The off-screen-scene `content-visibility` lever is MEASURE-FIRST.** RESOLVED:
   `content-visibility:auto` PAIRED with `contain-intrinsic-size` is the modern
   off-screen-scene primitive (0 uses in demo source today — genuinely unclaimed).
   E.W4 applies it ONLY where measured to help and ONLY paired (an unpaired
   `content-visibility:auto` causes scroll-jank from intrinsic-size guessing). If
   the measurement is negative the lever is recorded-withheld — the same
   measure-first discipline D-3 applied to the computed-unit round-trip. No
   speculative perf change ships unmeasured.

5. **The engine is at gestalt — E records, barely edits.** RESOLVED: the post-D
   assay found zero engine GAP against the modern-web guidance; the published
   library is the reference implementation. E.W5 carries only 2 BOOK items: the
   managed-animation pause contract is documented (a comment at `group.ts`, not
   code — it clarifies the existing honest `pause`/`resume`/`toggle` contract D.W4
   landed); `tryParseCache` eviction (`utils.ts:145`) lands ONLY if measured to
   matter (measure-first, the measurement in-tree — else recorded-withheld). E
   touches the published library minimally; `proof:boundary`/`proof:zero-alloc`/
   `proof:engine` stay green.

6. **Glass-ui-owned defects route outward (unchanged, inv-16).** The glass-ui
   `LabeledField` a11y defect (ASK-3) stays OUTWARD — E keeps the named lighthouse
   allowance (`bucket-glassui`), no vendor band-aid. VAL-9 `--spring-*` codegen
   (ASK-2) is glass-ui-owned — E keeps `springLinearStops()` export stable + value.js-free
   (the enabler). The "verify reka-ui dialogs/popovers ride native `<dialog>`/
   Popover API" check resolves NEGATIVE (reka-ui renders a role-`div` + JS
   focus-trap, not the native element) — recorded as an OUT observation, not an E
   demo-patch. The `<Role>Dock` base (AU.W8) is glass-ui's arm; D.W5 owns the
   keyframes-side dock-rename (D's close, gated on glass-ui 3.3.0). These are OUT,
   not E findings.

## § Wave table

| Wave | Title | Phase | Folds / scope |
|---|---|---|---|
| **E.W0** | Audit-fold + the path forward | DEV (now) | This E.md + the W1–W6 specs + PROGRESS; the 6-lane assay on disk (encapsulation / brittleness / styling / lighthouse / modern-web / engine); the lighthouse baseline (20 captured report artifacts) + the `modern-web-guidance` install + comparison checklist; the consolidated deferred ledger (zero KFE — D terminated every keyframes-owned deferral); the full prompt-recap (no drops). The E.W0 close = these artifacts. No engine, demo, or library source is written. |
| **E.W1** | Frontend encapsulation round 2 | IMPL | `App.vue` (452L) → `usePlaybackSnapshot` + `useSceneSwap` composables; `useOrbitalPointer.ts` (376L) thinned (the transform-application business logic → `OrbitalDrag.vue`); `EasingCurveCanvas.vue` (351L) recorded COHESIVE → LEFT. Net-deletion, zero pixel change. Gate: `proof:encapsulation` (size ceilings + render smoke). These are the NET-NEW residual the D.W1 decomposition did not target. |
| **E.W2** | The vueuse listener/observer gestalt (the inv-ζ analogue, completed) | IMPL | The ~15 manual `addEventListener` (6 files: SpringTarget / useOrbitalPointer / PlaybackRibbon[the `once:true` crutch] / useDragCapture / AssetViewport / AssetLayerPanel) + the 3 `new ResizeObserver` (EasingTarget / AmigaScene / CSSCodeEditor) → `useEventListener`/`useResizeObserver` (auto-cleanup; leak-fix); the 2 `querySelector` couplings (`AnimationControls.vue:190` `data-state=active`, `KeyframeCardList.vue:51` `querySelectorAll("pre")`) → owned refs / child-ref contract; the dynamic + engine-loop sites allowlisted + documented. Gate: `proof:brittleness` extended — zero hand-rolled listener/observer in reactive code (inv κ). Net-deletion. |
| **E.W3** | Styling localization round 2 (isomorphic) | IMPL | Define `.gold-shimmer` demo-locally (close the inv-λ rent — the one tier D.W2's clause missed); tokenize the recurring arbitrary values (`--dropdown-min-width` for `min-w-[12rem]`×3, `--target-viewport-w` for `w-[30vw]`, `--visualizer-track-gutter` for `w-[calc(100%-3rem)]`, a named cap for `EasingSelect max-h-[min(24rem,60dvh)]`); reconcile `--panel-max-h` `60vh`→`60dvh` (the mobile-correct unit, unifying 4 sites); dedup the `.progress-bar { @apply h-2 rounded-md }` rule (2 scoped copies → 1). Isomorphic — pixels unchanged except the named `vh`→`dvh` mobile-correctness delta. Gate: `proof:idioms` extended (`.gold-shimmer` demo-local; the named arbitrary values tokenized; inv λ). EXTENDS `design-idioms.css`, does not re-author it. |
| **E.W4** | Performance + modern-web alignment | IMPL (minor) | `npx modern-web-guidance@latest install`; lighthouse every scene × viewport (the captured baseline); the optimization strategy: **Monaco code-split** off the static graph (`CSSCodeEditor.vue:14` — the dominant `unused-javascript` lever, 2,664 KiB on spring; lifts the spring outlier, terminates the spring-mobile LCP 28.1 s regression, improves mobile FCP/LCP everywhere); **render-loop yield/pause off-screen + off-tab** (the amiga TBT 144,760 ms canary); **INP relief on the heavy editing UI** (`scheduler.yield`/`postTask` in the parse/format edit path); **`content-visibility:auto` + `contain-intrinsic-size` off-screen scenes** (measure-first, paired); align with `modern-web-guidance` (the native-`<dialog>` check resolved NEGATIVE → OUT; link-preload-on-hover; container-query/anchor-positioning where it removes hand-rolled JS). Gate: `proof:perf-budget`/`proof:modern-web` — per-scene mobile ceiling + the spring-LCP regression terminated + the yield/content-vis/checklist clauses (inv μ). Sequenced AFTER E.W1–W3 so lighthouse measures the FINAL surface. |
| **E.W5** | Engine housekeeping (BOOK-only) | IMPL | Document the managed-animation pause contract (a comment at `group.ts`, not code — clarifies the honest `pause`/`resume`/`toggle` D.W4 landed); `tryParseCache` eviction (`utils.ts:145`) ONLY if measured to matter (measure-first, the measurement in-tree — else recorded-withheld, exactly as D-3). The engine is at gestalt — E records, barely edits. Gate: `proof:engine` green + `npm test` green + `proof:boundary` green (no static value.js edge); no regression. Parallel to the demo waves. |
| **E.W6** | Close (recap · ledger · release) | IMPL (LAST) | FINAL.md (the consolidated ledger re-verified — zero KFE, every CLOSED item regression-checked, every OUT enabler kept stable, every ARCH recorded); the prompt-recap confirmed (every A→E ask ADDRESSED / PENDING-D-owned / E-SCOPE); the AFTER capture + DELTA via the checked-in harness (`scripts/capture.mjs after`, 0 console errors); the E changeset (**minor** — W9/W10 ship observable new public API; non-breaking, additive); the version owner named; **absorbs the E.W7–W11 gates** (`proof:engine-correctness` · `proof:standalone-zero-alloc` · `proof:compile-deterministic`/`-incremental` · `proof:platform-adopt` · `proof:orchestration` · `proof:demo-elevate`). The publish leg stays user-domain. |
| **E.W7** | Engine compile + runtime correctness and hot-path (measure-first) | IMPL (deep-SOTA band) | Correctness FIRST (pixel-affecting where currently-wrong, test-locked): FC-1 `setColorSpace`/`setHueMethod` compile-staleness no-op (`engine.ts:428,444` write options + `return this` with no `parse()`; color space is baked at compile into the segment); D-1 `createFrame` index-space conflation (`frame-compiler.ts:150` seeks the COMPILED array by a TEMPLATE index — latent until sparse non-adjacent per-keyframe-easing reconciles); WAAPI-F1 the computed-unit guard rejects nothing it documents (`vh`/`cqw`/`%` slip through) + docstring honesty (`@property` customs don't composite — `r-waapi` W4); **WAAPI-W1 the delegated animations are never `commitStyles()`'d/cancelled on finish** (`waapi.ts` emits `fill:forwards`, the `finally` clears `_waAnimations` but leaves N indefinitely-filling residual animations that fight `paintRest()` — a cascade non-isomorphism + compositor leak; `r-waapi` W1, NEW); **the `linear()` consumption gap** (`getTimingFunction` `utils.ts:103` has no `linear(` branch → the engine cannot read back its OWN emitted spring curve, silently degrades to `easeInOutCubic`; `r-css-values` §1 / `r-css-parsers` §5.1). THEN hot-path (pixel-identical, each behind a shaped bench): the standalone `interpFrames` loop made zero-alloc (E-RT-1 `out={}` + per-frame `processFrame` closure; D-RT-1 the `delete`-loop dictionary-mode deopt; D-RT-2 per-frame `Object.assign`; E-RT-3 unconditional per-frame DOM write; E-RT-2 promise/microtask churn; FC-3 dead `unflattenObject`; FC-6 bound `tryParseCache` — the E.W5-BOOKED item lands here with cost-model evidence). Gate: `proof:engine-correctness` + `proof:standalone-zero-alloc` (inv ν). W8 depends on W7. |
| **E.W8** | The FrameCompiler transposition (NumericAnimation SoA + incremental) | IMPL (deep-SOTA band) | *"`AnimationFrame` is a `NumericSegment` that forgot it was one."* Port `NumericAnimation`'s SoA + incremental-segment discipline (`numeric.ts:8-15,186-205` — ALREADY-SOTA in-tree) up to `FrameCompiler`. Four sub-moves: (1) parallel typed `Float64Array startTimes/stopTimes` time index; (2) compile-time output slots vs per-tick `Object.assign` (preserving the `ValueUnit` aliasing contract — SoA on the index/slot-map, NOT the rich leaves); (3) incremental `updateSegments(touchedKeyframeIx)` — re-run only the incident segments (the FOLD-E answer to D-2's double-compile-per-keystroke editor workload); (4) deterministic content-derived `frameId` (kill `this.frameId++` `frame-compiler.ts:147,182`). Demo prerequisite (pure cleanup, lands first): D-2(a) stop the editor double-compile (`useKeyframeOps.ts`). Gate: `proof:compile-deterministic` (byte-identical `frames[]` on identical input) + `proof:compile-incremental` (the incremental path byte-equal to a full `parse()`, CI-asserted; ships only on a measured editor-workload win) — inv ν extended. Carries W7's D-1 fix as the isomorphism guard. |
| **E.W9** | Modern-platform adoption (library, baseline-safe + feature-detected) | IMPL (minor — new API) | The platform features the engine parses-but-never-applies, each Baseline-dated + feature-detected with the JS path as the fallback: D-LIB-1 register the parsed `@property` registry (zero `CSS.registerProperty` in `src/` today — the registry is inert `engine.ts:995`; Baseline 2024-07); D-LIB-3 live reduced-motion observation (`internal/reduced-motion.ts` reads `.matches` once per `play()`, zero `change` listener); WAAPI-F3 dense sub-segment WAAPI keyframe sampling; **WAAPI-F2/D-6 native CSS Color L4 interpolation — MECHANISM CORRECTED** (`r-css-color` F5: the win is **main-thread native interp + JS-hot-path removal, NOT compositor offload** — paint props aren't compositor-accelerated; gated on the `(colorSpace,hueMethod)` matching the UA `color-interpolation-method` default — oklab non-legacy / sRGB legacy — and a **non-legacy-syntax emit** criterion `r-waapi` W2; else stays on the rAF path); `currentColor`/`light-dark()` frame-prep resolution policy (`r-css-color` F1/F2); D-LIB-2/F-5 the native `ScrollTimeline`/`ViewTimeline` WAAPI bridge (**additive only — the JS-sampler ARCH-kill HOLDS**, `r-scroll-view-transitions` S-1 / `r-waapi` W3); `composite:"add"` group delegation (Baseline-viable; per-iteration `iterationComposite` is NOT — BOOK, `r-waapi` W6); `interpolate-size`/`calc-size()` GAP-NAMED/BOOK (limited availability — the `0fr→1fr` grid trick is preferable on today's Baseline, `r-css-values` §5). Gate: `proof:platform-adopt` (inv ξ) — feature-detect + behaviour-equivalence per adoption. Needs value.js hand-off (`@property` round-trip · color-interp keyword/serializer). |
| **E.W10** | The orchestration tier (the competitive feature frontier) | IMPL (minor — new API) | Stagger · sequence · FLIP · drag/inertia — the layer every competitor leads with, where the engine ALREADY owns the hard physics (the closed-form `SpringProgress` `(x,v)` re-seat, `ElementMorph` = the FLIP invert half, `AnimationGroup.advanceTo` = the sequence substrate). Thin value.js-free light-side adapters: F-1 `stagger(n \| items, {each, from, ease})`; F-2 sequence/timeline orchestrator (**name-collision with the scroll `Timeline` resolved in design FIRST — BOOK the API surface as task 1**); F-3 `flip`/`flipShared` over `ElementMorph`; F-4 `drag`/`useDrag` + `decay` feeding `SpringProgress`; F-8 spring-eased + taxonomy presets; the spring `SpringProgress.fromDuration({duration,bounce})` Motion-idiom adapter (`r-interpolation` F-1 — pure construction-time translation, zero hot-path cost); D-4 the `animate(target,input,opts?)` single-call front door. Gate: `proof:orchestration` — per-primitive unit test + a dogfood demo scene + a `proof:boundary` re-check (the light helpers carry zero static value.js edge). Purely additive. The spring→`linear()` WAAPI round-trip is a **MATCH** (Motion ships `generateLinearEasing` — `r-interpolation` F-2); the LEAD narrows to solver-quality + single-source `{fn,css}` pairing + the multi-segment guard. |
| **E.W11** | Demo elevation (View Transitions · a11y uniformity · idiom r3 · first-paint) | IMPL (demo) | Consumes `d-demo-elevate.md`'s 4-theme synthesis verbatim. Theme 0 delete dead `CommandPalette.vue`; Theme 1 View Transitions for scene nav (route `switchScene` through glass-ui's shipped-but-unused `useViewTransition`, keep the `SpringProgress` fade as the no-VT dogfood fallback; Baseline 2025-10); Theme 2 apply the demo's own gold-standard `role="slider"`/`:focus-visible` a11y patterns UNIFORMLY (a consistency deficit — replication of an in-repo template); Theme 3 finish the D.W2/3 idiom-ownership pass into the layers it missed (kill the divergent `--spring-snappy` shadow ζ=0.65 vs canonical ζ=0.85; promote the twice-copied `progress-rail`/`progress-dot`; define-or-delete `.dock-inset`); Theme 4 harden the first paint (PRM-guard the perpetual hero, drop the invalid `200%` keyframe stop, **metric-matched `size-adjust` font fallback for the Instrument-Serif LCP `<h1>`** — `r-cwv-perf` B-1, the headline CWV gap); Theme 5 (NEW) the CWV interaction/battery levers (`content-visibility:hidden` to cache the inactive Monaco editor tab — INP, `r-cwv-perf` B-2; a `visibilitychange` pause for the active scene's rAF/WebGL loop — battery, B-3; **corrected: NO `KeepAlive`** — one scene mounted via keyed `<Suspense>`); a `@starting-style`+`allow-discrete` scene surfacing the spring `linear()` as a copy-pasteable CSS artifact (`r-interpolation` F-4). Gate: `proof:demo-elevate` (inv ο). Demo-only; rebases onto W1/W2/W3 shells. Corrected ALREADY-SOTA: the demo is already native-`color-mix()`-idiomatic (519 occurrences). |

**Wave count: 12 (E.W0–E.W11)** — 1 DEVELOPMENT (W0, run now) + 6 baseline-checklist
IMPLEMENTATION (W1–W6) + 5 deep-SOTA-assay IMPLEMENTATION (W7–W11). E.W7–W11 are
the augmentation's net-new waves (see §SOTA-augmentation); they slot in as a second
band after the W1–W3 demo waves and parallel to W5, and E.W6 absorbs their gates.

## § SOTA-augmentation (the deep-SOTA assay — E.W7–W11, honest provenance)

E's two bands have two honestly-different provenances, and the distinction is the
whole point of this section.

- **E.W0–W6 = the Baseline-checklist assay.** The original E charter was authored
  on the post-D verdict *"the engine is EXEMPLARY post-D; zero engine GAP; E barely
  touches the published library."* That verdict was correct **against the
  `modern-web-guidance` Baseline-capability checklist** — the published engine IS the
  reference implementation of `scheduler.yield`/WAAPI-delegation/`linear()`-spring/
  PRM. E.W1–W6 are the demo-side refinements the post-D 6-lane assay surfaced
  (encapsulation r2 · the vueuse-listener gestalt · styling r2 · perf+modern-web ·
  engine BOOK · close). They stand UNCHANGED.

- **E.W7–W11 = the deep-SOTA assay.** A 30-lane deep audit (`audit/sota/` — 16
  forward-research + 8 in-tree audit + 6 deepen lanes, all on disk, incl. the 6
  re-exec'd forward-SOTA lanes `r-waapi`/`r-css-color`/`r-css-values`/
  `r-interpolation`/`r-cwv-perf`/`r-css-parsers`) asked a **different, sharper
  question**: *measured against Motion/GSAP/anime.js v4, lightningcss/csstree, the V8
  cost model, and the W3C platform frontier (Color L4, Easing L2, `@property`,
  Scroll-Driven, View Transitions), where are the genuine gaps?* It found a NET-NEW
  body the checklist did not surface: engine correctness gaps the EXEMPLARY verdict
  masked (the `setColorSpace` no-op, the `createFrame` index conflation, the WAAPI
  guard that rejects nothing it documents, **the WAAPI animations never
  committed-then-cancelled on finish, the engine unable to read back its own emitted
  `linear()`**); a measured hot-path tier (the standalone loop is NOT zero-alloc even
  though the group composite is); a named compile-time transposition (port
  `NumericAnimation`'s SoA + incremental discipline up to `FrameCompiler` — the demo's
  own editor makes it load-bearing); Baseline-safe platform features the library
  parses-but-never-applies (`@property`, live PRM, the native scroll/color bridge);
  and the orchestration tier (stagger/sequence/FLIP/drag) every competitor leads with,
  for which the engine already owns the hard physics. These fold into E.W7–W11.

**The honest framing — net-new, NOT folded debt.** E.W7–W11 do NOT re-open E's
honest-provenance discipline. E's content remains NET-NEW: D was the terminal home
for every keyframes-owned deferral (P-invariant-28; zero KFE). These are not folded
chronic debt — they are findings of the post-D **deep** assay, surfaced by comparing
against the *libraries and the spec frontier* rather than only the Baseline-capability
checklist. The provenance is stated plainly: E.W1–W6 are baseline-checklist findings;
E.W7–W11 are deep-SOTA findings; neither is folded debt.

**The KERNEL is ALREADY-SOTA — the augmentation manufactures NO work there.** The
deep audit's largest honest finding: the engine's kernel is **at the frontier**, and
the augmentation records this at length (synthesis §7) so it does not invent
perf/feature work where the codebase already leads. ALREADY-SOTA (cross-lane
consensus, do not touch): the pre-resolved monomorphic `_lerp` dispatch + O(log N)
binary-search seek + pre-flatten + the **group** zero-alloc compositor
(`test/zero-alloc.test.ts`); the `NumericAnimation` zero-alloc SoA core (the *source*
of the W8 transposition, not a target); `scheduler.yield()` batched advance; the WAAPI
eligibility gate's easing-faithfulness discipline + the `var()`-rejection correct *by
reasoning* (registered `@property` customs don't composite — `r-waapi` W4); the
analytic closed-form spring with mid-flight `(x,v)` re-seat (LEADS on solver quality;
the spring→`linear()` round-trip is a **MATCH** — Motion ships `generateLinearEasing`
— `r-interpolation` F-2); layer blending; live-unified reduced-motion; the value.js
static/dynamic boundary; the demo's CWV loading critical path (`r-cwv-perf` A-3..A-9).

**The DECLINE / KILL records held + sharpened (do not re-litigate).**
- **WASM CSS parser — DECLINED, re-confirmed sharper.** `r-css-parsers` §6 verified
  the Rust crate has NO `cdylib`/`#[wasm_bindgen]` (it is unbuilt scaffolding); the
  forward path is **adopt the TS single-pass dispatched reader parse-that already
  ships**, not compile Rust. value.js-owned (the hand-off), not a kf concern.
- **Native `ScrollTimeline` *replacing* the JS sampler — KILLED, re-confirmed twice.**
  Native is Chromium-only/not-Baseline AND the JS `Timeline` is a strictly more general
  caller-polled sampler over arbitrary objects AND it applies `SmoothProgress`/boundary-
  snap the native `animation-range` path lacks (`r-waapi` W3 / `r-scroll-view-transitions`
  S-1). W9's bridge is **additive only** — the JS sampler is NOT deprecated.

**KISS discipline.** The augmentation folds only genuinely-warranted SOTA work. Every
perf fold is **MEASURE-FIRST** (lands only behind a shaped bench proving the
steady-state win, else recorded-withheld — the D-3 / E.W5 `tryParseCache` posture);
every platform adoption is **FEATURE-DETECTED** (the JS path is the proven fallback;
zero regression where unsupported). The `interpolate-size`/`calc-size()` native
height-to-`auto` lever is GAP-NAMED but BOOK (limited availability — the demo's
`0fr→1fr` grid trick is *preferable* on today's Baseline; do not modernize a working
cross-browser solution into a Chromium-only one).

**The value.js hand-off (cross-repo deliverable, inv-16).** Every lane that surfaced
a value.js item converged on the same handful — consolidated ONCE, de-duplicated, as a
single named **FOLD-VALUEJS-HANDOFF** proposal the value.js owner formalizes (kf
proposes a value.js tranche, never writes it). The keyframes-side index (the chronic
consumption-seam pin-bump; bounded parse/normalize memo caches; a lean interpolation
carrier; the computed-unit endpoint cache; the `Color.toString` per-frame cost; the
`@property` `syntax`/`inherits` round-trip; the `cssColorInterpKeyword` + L4-preserving
serializer; `decay`/`linear()` samplers; positioned-`linear()` stop parity; the ~24
no-op length units) is carried to E's `valuejs-sota-handoff.md`; the full charter is
the synthesis `audit/sota/_SYNTHESIS-valuejs-handoff.md`. Every item is
byte-/pixel-identical by construction; keyframes consumes the published result and
re-verifies via a kf integration test.

**Release escalation.** E was minor/patch (demo + non-breaking lib housekeeping). The
deep-SOTA band escalates the bump: the platform adoption (W9 — `@property`/native
paths) and the orchestration tier (W10 — `animate()`/`stagger`/`sequence`/`flip`/`drag`)
ship **observable new public API**. Those are **additive** (no renames, no breaks — the
engine reached gestalt in D's major), so **E becomes a minor** (escalated from
minor/patch), not a major. E.W6 names the version owner and renders the combined
published surface.

**Source of truth.** This section synthesizes `audit/sota/_SYNTHESIS-E-augmentation.md`
(the full per-wave scope/gates/isomorphism for E.W7–W11 + inv ν/ξ/ο),
`audit/sota/_SYNTHESIS-scorecard.md` (the 30-finding GAP/SOTA scorecard), and
`audit/sota/_SYNTHESIS-valuejs-handoff.md` (the value.js charter), each grounded in the
30 lane findings under `audit/sota/`. Every `file:line` cite in the W7–W11 wave rows +
inv ν/ξ/ο was re-grounded against the live tree (`engine.ts:428,444` ·
`frame-compiler.ts:147,150,182` · `utils.ts:103,145` · `waapi.ts` `FILL_MAP`/`fill` ·
`internal/reduced-motion.ts` · zero `CSS.registerProperty` in `src/` · `numeric.ts`
SoA · App.vue 452L / useOrbitalPointer 376L / EasingCurveCanvas 351L · the dead
`CommandPalette.vue` · `test/zero-alloc.test.ts`).

## § The DAG

```
E.W0 (DEV, now)
  │
  │  ── BAND 1: the Baseline-checklist demo waves (E.W1–W3) + engine BOOK (E.W5) ──
  ├─→ E.W1  (encapsulation round 2 — App.vue / useOrbitalPointer)   ┐
  ├─→ E.W2  (the vueuse listener/observer gestalt)                  ├─ parallel: file-disjoint
  ├─→ E.W3  (styling localization round 2)                          ┘  (encap-vs-listener-vs-style)
  │
  ├─→ E.W5  (engine housekeeping — BOOK-only)                          parallel to ALL demo waves
  │                                                                     (engine src/ ∦ demo @/)
  │
  │  ── BAND 2: the deep-SOTA assay waves (E.W7–W11) — second band, parallel to W5 ──
  ├─→ E.W7  (engine compile/runtime correctness + hot-path)   ┐
  │     │   (measure-first)                                   │ engine band —
  │     ▼                                                      │ src/animation/
  ├─→ E.W8  (FrameCompiler transposition — SoA + incremental) │  ∦ demo @/
  │     (DEPENDS on W7's correctness fixes + benches)         │  (W7 → W8;
  ├─→ E.W9  (modern-platform adoption — @property·PRM·scroll) │   W9 · W10 indep.)
  ├─→ E.W10 (orchestration — stagger·sequence·FLIP·drag)      ┘
  │
  └─→ E.W11 (demo elevation — View Transitions·a11y·idiom r3·1st-paint)
  │            demo @/ — parallel to the engine band; rebases onto W1/W2/W3 shells
  │
  └─→ (E.W1 ∥ E.W2 ∥ E.W3 settle · E.W11 settle)
         │
         ▼
       E.W4  (perf + modern-web — lighthouse the FINAL surface)         sequenced AFTER the
         │                                                              demo waves (now incl.
         │                                                              W11's VT scene-swap +
         │                                                              W9's content-visibility)
         ▼
       E.W6  (close — recap · ledger · release)                         LAST — absorbs the
                                                                        W7–W11 gates
```

- **E.W0 → (E.W1 ∥ E.W2 ∥ E.W3):** the three demo waves are largely file-disjoint
  — W1 touches component/composable *structure* (App.vue / useOrbitalPointer),
  W2 touches *listeners/observers* (the 6 listener + 3 observer files), W3 touches
  *styling* (`design-idioms.css` + the tokenized literals). They parallelize.
  Where they overlap a shell file (e.g. a component W1 splits whose listener W2
  converts), the later wave rebases — the same sequencing-allowance discipline D
  used (inv ε-recorded).
- **E.W5 ∥ all demo waves:** W5 is engine `src/animation/` only — disjoint from
  the demo `@/` tree entirely. It runs parallel to W1/W2/W3 and to W4.
- **The deep-SOTA second band (E.W7–W11) slots in parallel to E.W5:** W7/W8/W9/W10
  are engine `src/animation/` — file-disjoint from the demo waves (W1/W2/W3/W11)
  exactly as E.W5 is; they parallelize. **W8 DEPENDS on W7** (W7's correctness fixes
  + the shaped benches are the isomorphism guard W8's transposition rides — W8 carries
  W7's D-1 per-keyframe-easing fix as its one pixel change). W9 and W10 are independent
  of W7/W8 (platform adoption · orchestration adapters). E.W11 (demo elevation) is demo
  `@/` — parallel to the whole engine band; it rebases onto W1/W2/W3 where it touches a
  shell those waves restructure (the same sequencing-allowance D used, inv-ε-recorded).
- **E.W4 sequenced AFTER the demo waves settle:** lighthouse measures the page it
  traces — running W4 before W1/W2/W3 (and now W11) land would measure a surface E then
  changes. W4 runs last among the work waves so the budget gate scores the FINAL surface
  (the Monaco code-split + the yield + the content-vis on the post-W1/W2/W3 tree, PLUS
  W11's View-Transitions scene-swap and W9's `content-visibility`/font-fallback).
- **E.W4/W5/W7–W11 → E.W6:** the close is last — it cannot record the budget held + the
  engine BOOK landed + the deep-SOTA gates green until W4, W5, and the W7–W11 band
  complete. E.W6 ABSORBS the new gates (`proof:engine-correctness` ·
  `proof:standalone-zero-alloc` · `proof:compile-deterministic`/`-incremental` ·
  `proof:platform-adopt` · `proof:orchestration` · `proof:demo-elevate`) into FINAL.md +
  the changeset.
- **E is independent of D.W5/W6.** D.W5 (the dock-rename + the square/mobile
  occlusion close) and D.W6 (D's FINAL + the B/C/D version owner) gate on glass-ui
  PUBLISHING 3.3.0; D's heartbeat (`b5gt704vz`) auto-resumes them when 3.3.0 lands
  on npm. Every E wave is gate-free of glass-ui — E does not touch the dock, and
  E's budget/listener/idiom work does not depend on the dock close.

## § Constellation-cognizance (inv-16 — E writes only keyframes.js, independent of D.W5/W6)

E consumes the siblings' *published* surface, plans around their motion, and
writes none of them. E's waves are gate-free of glass-ui — the E DAG runs
independent of the D.W5/W6 dock close.

- **D.W5/W6 are D's close, NOT E's scope.** Verified at E-open: the source is
  still PRE-rename (`dock/index.ts`, `dock/TopDock.vue`,
  `animation-controls/AnimationMenuBar.vue` all present); `docs/tranches/D/FINAL.md`
  does NOT exist; the D changeset is CUT (`8ff893f`, version owner named) but the
  dock-rename + the square/mobile occlusion close + FINAL.md + the AFTER-capture
  remain unrun. D.W5 gates on glass-ui PUBLISHING 3.3.0 (the dock primitives + the
  touch-gate B′ fix); **D's heartbeat (`b5gt704vz`) auto-resumes D.W5/W6** when
  3.3.0 lands. E does not touch the dock; no E wave depends on the dock close.
- **glass-ui-AU** — the `LabeledField` a11y (ASK-3), the `--spring-*` codegen
  (ASK-2), the reka-ui dialog/popover seam (the native-`<dialog>` check resolves
  NEGATIVE — a role-`div` + JS focus-trap, not the native element), and the
  `<Role>Dock` base (AU.W8) are ALL glass-ui-owned. E keeps the named lighthouse
  allowance (`bucket-glassui`) stable, keeps the `springLinearStops()` export
  stable + value.js-free, and applies NO vendor band-aid (inv-16). OUT, not E
  findings.
- **value.js-M** — DIRTY/active (v1.0.0). keyframes' *demo* consumes value.js (the
  easing demo: `timingFunctions`/`parseCSSTime`); the *library*'s light barrel
  carries no static value.js edge (the heavy engine reaches value.js only via
  dynamic `loadAnimationEngine()` — `proof:boundary`). E pins the *published*
  value.js, never M's branch.
- **slides-E/F** — active, double-driven; the spring-dogfood `29a781a` was
  contributed (booked). Shared idioms: the `<Role>Dock` role-vocabulary (D.W5's
  rename names, not E's) + the `--spring-*` token contract. E converges, does not
  fork — `springLinearStops()` stays a stable export; the dock vocabulary is D's
  concern, not E's.
- **Edges:** consume published-not-branches; gate on keyframes' own green CI
  (inv-27). E's perf install (`modern-web-guidance`) lands under `.agents/`
  (tooling, not source — `npm i --no-save lighthouse`, `KF_PLAYWRIGHT_DIR` from
  the sibling value.js; no `package.json` edge added, inv-16). There is no
  newly-actionable cross-arm edge in E — the dock-rename edge is D's (W5).

## § Release

E is a **minor** (escalated from minor/patch by the deep-SOTA band). The changeset
(`.changeset/tranche-e.md`, **minor**) renders E's published surface. The original
E.W0–W6 surface is deliberately small — DEMO-side performance + frontend refinement +
non-breaking library housekeeping (the engine's two BOOK items — the documented
managed-pause contract; the measure-first `tryParseCache` eviction — are non-breaking:
a comment + a possible internal cache tweak behind the same public API). **The
deep-SOTA band (E.W7–W11) escalates the bump to a firm minor:** E.W9's platform
adoption (`@property` registration · live PRM · the native scroll/color bridge) and
E.W10's orchestration tier (`animate()` · `stagger` · `sequence` · `flip` · `drag` ·
`SpringProgress.fromDuration`) ship **observable new public API**. Those are
**additive** — no renames, no API change, no breaking surface (the engine reached
gestalt in D's major) — so E stays minor, never major. The version owner confirms at
close against what actually landed (W9/W10's additive API makes minor the floor).

E's minor ships alongside the **stacked B `3.1.0` + C `major` + D `major`
changesets** — all CUT, unpublished (the publish leg has been user-domain since
A). The version owner for B/C/D is named in D's changeset (Mike Babb); E.W6 names
its own and renders the combined published surface. The publish leg
(`changeset version` → tag → `release.yml`) stays **user-domain, confirm-first** —
identical to A, B, C, D. The npm-publish is the explicit cross-session unblock
point the user drives; everything up to ready-to-publish (CI green, the demo
deployed where no fresh publish is needed) is autonomous.

## § Audit evidence (E.W0 — on disk, sibling-authored)

The development deliverable is the tranche docs + the audit evidence, each lane
authored by a sibling agent into `audit/`:

```
docs/tranches/E/
  E.md                          (this plan)
  PROGRESS.md                   (status board)
  waves/E.W{0..6}.md            (wave specs)
  audit/
    encapsulation-findings.md   (the round-2 decomposition: App.vue / useOrbitalPointer / EasingCurveCanvas-cohesive)
    brittleness-findings.md     (the vueuse listener/observer gestalt: 6 listener files + 3 observers + 2 querySelector couplings)
    styling-findings.md         (the .gold-shimmer rent + the tokenized literals + the vh/dvh reconcile + the .progress-bar dedup)
    lighthouse-findings.md      (the post-D bimodal baseline: cold holds B, open-panel is the target)
    modern-web-findings.md      (the modern-web-guidance install + the platform comparison checklist)
    engine-findings.md          (the engine EXEMPLARY recording: zero GAP, 2 BOOK items)
    lighthouse/                 (20 captured report artifacts + _perf-summary.json + the perf-capture driver)
    deferred-ledger.md          (the whole-history A→E ledger — zero KFE; D was the terminal home)
    prompt-recap.md             (every request A→B→C→constellation→D→E, ADDRESSED / PENDING-D-owned / E-SCOPE)
```

The evidence is verified by: (1) the 6-lane assay on disk + re-runnable (the
`grep`/`wc`/lighthouse instruments each lane cites re-execute from the repo); (2)
the lighthouse baseline captured (`audit/lighthouse/`, 20 report artifacts across
the 6 scenes × {mobile, desktop} on the cold + open-panel axes, every score
naming its report file) + the `modern-web-guidance` install reproduced (137 guide
files under `.agents/skills/modern-web-guidance/guides/`); (3) the deferred ledger
confirming CLEAN — **zero KFE** (P-invariant-28 — D terminated every
keyframes-owned deferral; E folds no chronic debt; the E waves are findings, not
folds); (4) the prompt-recap confirming full A→E coverage with no drops; (5) the
wave specs each carrying a falsifiable hard gate. The IMPLEMENTATION (E.W1–W6) +
its CI gates (`proof:encapsulation`, the extended `proof:brittleness`/`proof:idioms`,
`proof:perf-budget`/`proof:modern-web`, `proof:engine`) open in a later,
explicitly-authorized phase — exactly D's dev→impl boundary, gated on keyframes'
own green CI, isomorphic + no-legacy throughout.

## § Style discipline

Greenfield voice — keyframes.js is the product. The §Mandate is the spine (NO
quick solutions / NO workarounds / transpositions for elegance·simplicity·
performance / NO legacy — binding, sweep-enforced). E's distinguishing discipline
is *honest provenance*: E's content is NET-NEW, not folded debt, and it says so
plainly — D was the terminal home for every keyframes-owned deferral (zero KFE),
so E's waves are the findings of a fresh post-D 6-lane assay, never re-litigated
debt or laundered punts. Em dashes unspaced. Every wave item carries WHAT + WHY;
goal + completion paired. E completes (the listener gestalt inv ζ left half-swept
— inv κ), localizes (the one idiom rent D.W2's clause shape missed — inv λ), and
budgets (a modern-web performance ceiling the demo holds, instrumented — inv μ),
keeping every styling change isomorphic (pixels unchanged unless highly befitting
+ named — the `vh`→`dvh` mobile-correctness delta is the sole named exception) and
the engine barely touched (it reached gestalt in D — E records, does not
re-architect). E is keyframes making its demo fast, modern, and maximally
idiomatic, completing the vueuse gestalt it began, and holding inv-16 throughout
(E writes only keyframes.js — every glass-ui-owned gap booked OUT, never
demo-patched).
</content>
</invoke>
