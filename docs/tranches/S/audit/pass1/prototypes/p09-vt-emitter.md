# p09-vt-emitter — View-Transitions compile-emitter feasibility (Q9 / S.F1)

**Probe:** Pass-1E prototype p09 · Tranche S DEVELOPMENT · 2026-07-02
**Verdict: adjusts-spec** — the emitter is REAL and *thin* (proven live in Chromium 149),
but S.F1's input model needs three precisions: a per-name VT **role mapping** (old/new/group)
instead of a bare group walk, a **mandatory group-pseudo timing emission** (the UA owns the
geometry keyframes — that IS the zero-runtime FLIP), and a VT-specific **refusal-taxonomy
extension** over CC-3.

---

## 1. The question + the spec's assumption

**SPEC-v1.md §6 Q9** (`docs/tranches/S/audit/pass1/SPEC-v1.md:759`): *"Is the View-Transitions
compile emitter real? Hand-compile ONE flipShared group to ::view-transition-* CSS; drive both in
a live Chromium side by side. SUCCESS: visually equivalent morph … a refusal taxonomy drafted for
unsupported shapes. FAILURE: VT's snapshot model can't express the group's timing semantics →
demote F1 to dispatch-only."*

**S.F1's assumption** (`SPEC-v1.md:480-484`): a LIGHT `orchestration/view-transition/` dispatch
(flipShared fallback) + a `compile/` emitter that compiles *"a kf group to native
::view-transition-* @keyframes + view-transition-class, with honest refusal semantics"* — kf as
the only engine that compiles TO View Transitions (r5 F2, `research/r5-sota-animation.md:73-81`).

This probe's mandate additionally covers: the typed same-doc API (`ViewTransition.types` /
`:active-view-transition-type`), cross-doc `@view-transition` posture, WAAPI-on-VT-pseudos
(`getAnimations()` over `::view-transition-*`), and PRM degrade.

## 2. What I actually did

All prototype artifacts are throwaway, in the scratchpad
(`…/scratchpad/p09/{sketch.mjs, vt-emitted.css, vt-live.html}`). **Zero repo edits** — this report
is the only file written to the main tree (`git diff --stat` on the tree: only this file).

1. **Read the actual compile surface**: `src/animation/compile/backward.ts` (429L, whole),
   `format.ts` (exports at :43/:240/:298/:373/:397), `selector.ts`, `scroll/grammar.ts` (the
   house grammar-emitter pattern, whole), `orchestration/flip.ts` (whole),
   `physics/spring/linear-stops.ts` (whole), `engine/public.ts:130`, `load-engine.ts:76/188/327`,
   the demo's existing typed-VT seam `demo/app/useSceneTransition.ts` (whole), plus the gate
   scripts (`proof-published-surface.mjs`, `proof-engine.mjs`, `proof-boundary.mjs`).

2. **Node proof sketch against `dist/keyframes.js`** (`node …/p09/sketch.mjs` → **exit 0**):
   built two `CSSKeyframesAnimation`s (an exit + an enter track, spring
   `springTimingFunction({response:0.4, dampingFraction:0.7})`), ran the EXISTING
   `compileToCSS([exit, enter])` — `eligible: true`, `refusals: []`, the spring emitted as a
   26-stop `linear()` — then re-projected the two `.a0`/`.a1` class rules onto
   `:root:active-view-transition-type(forward)::view-transition-old(scene)` /
   `…::view-transition-new(scene)` by pure selector rewrite. The `@keyframes` blocks needed
   **zero changes**. Notably: the whole compile pipeline runs in **bare Node, no DOM** (the
   declared-template projection promise at `format.ts` — "a serializer must not need a live,
   fully-styled DOM" — holds).

3. **Live Chromium probe** (Playwright, Chrome 149, `vt-live.html` + the emitted CSS injected;
   two runs, both returned cleanly):
   - **Run 1** — `document.startViewTransition({ update, types: ["forward"] })` with the emitted
     stylesheet: `vt.types` = `["forward"]` (typed VT live); `document.getAnimations()` at
     `vt.ready` enumerated the kf-emitted animations **`a0` on `::view-transition-old(scene)`
     and `a1` on `::view-transition-new(scene)`, duration 350, easing
     `linear(0 0%, 0.30836 4%, 0.72933 8%, …)`** — the emitted rules REPLACED the UA
     `-ua-view-transition-fade-*` on that name (the UA fades survived only on `root`). WAAPI
     scrub on the pseudo animation (`currentTime = 100`) worked (`waapiScrubOK: true`);
     `vt.finished` settled.
   - **Run 2** — the flipShared-equivalence key: a **timing-only** override
     `::view-transition-group(scene) { animation-duration: 350ms; animation-timing-function:
     linear(…) }` kept the **UA-generated geometry keyframes**
     (`transform: matrix(1,0,0,1,40,40) → matrix(1,0,0,1,300,40)`, `width`/`height`/
     `backdropFilter`) while taking the emitted 350ms — i.e. the browser performs the FLIP
     (rect trajectory) natively and kf supplies only the curve/duration.

## 3. Findings (file:line evidence)

**F1 — The emitter is a selector projection over the EXISTING per-child compile, not a new
pipeline.** `compileChild` (`compile/backward.ts:186-342`) already produces exactly what a VT rule
needs: the `@keyframes` block (`keyframesBlock`, `format.ts:240`; oklab densify `backward-color`;
static-weight premultiply `format.ts:298`) + the `animation` shorthand
(`animationShorthand`, `format.ts:373`) + the composition longhand. The ONLY hardcoded piece is
the selector at **`backward.ts:339`**: `` `.${name} {\n  animation: …` ``. A VT emitter needs that
one seam parameterized (a rule-selector factory: `.name` → `::view-transition-old(name)` /
`…new(name)` / wrapped in `:active-view-transition-type(T)`). The Node sketch proved the output is
otherwise byte-reusable; the live probe proved the browser accepts and runs it on the pseudos.

**F2 — The group pseudo is a THIRD, timing-only emission surface — and it is mandatory.** In run 1
the old/new pseudos ran the emitted 350ms spring while `::view-transition-group(scene)` still ran
the UA default `-ua-view-transition-group-anim-scene` at **250ms/ease** — a temporally incoherent
transition (the geometry morph lands 100ms before the cross-tracks settle). Run 2 shows the cure:
the emitter must ALSO emit `::view-transition-group(name) { animation-duration; 
animation-timing-function }` (NO `@keyframes` — the UA's dynamically generated rect-morph
keyframes are the whole point; overriding `animation-name` there would forfeit the free FLIP).
This is the probe's one genuinely new design fact — S.F1's text ("::view-transition-* @keyframes")
reads as old/new only.

**F3 — flipShared ≡ VT-group under the same easing (Q9's equivalence).** `flipShared`
(`orchestration/flip.ts:146-176`) is a forward `ElementMorph` lerp between two rects;
the UA group animation (run 2) is the browser's lerp between the same two rects
(`matrix(…,40,40) → matrix(…,300,40)` for the probe's 40px→300px margin move), under the same
emitted `linear()` curve. Both are piecewise-linear interpolations of the identical endpoints
under the identical timing function — trajectory equivalence is analytic given the observed UA
keyframes; the born-RED wave gate should still do the side-by-side pixel/rect-tolerance assertion
(the probe's script is directly reusable as that gate's oracle).

**F4 — Typed VT + WAAPI-on-VT-pseudos both hold, and the house already has the consumer-side
pattern.** `vt.types` round-tripped (`["forward"]`); `:active-view-transition-type(forward)`
selector matched (the emitted rules fired). `document.getAnimations()` exposes every pseudo
animation with `effect.pseudoElement` (`"::view-transition-group(scene)"` etc.), timing readable,
`currentTime` writable — so (a) the wave's runtime gate has a structural, device-independent
oracle (names/durations/pseudo identities, not frame timings — the CI device-dependence lesson),
and (b) a future `adoptRunning`-style takeover of VT pseudos is API-feasible
(`ingest/adopt.ts:147-159` pattern; BOOK, not S-scoped). The demo already drives typed same-doc VT
through glass-ui's `startViewTransition(mutate, { types })` (`demo/app/useSceneTransition.ts:78`),
including the direction-type derivation and the feature-detect degrade — the LIGHT dispatch wave
is largely a library-side generalization of a pattern the demo has already de-risked.

**F5 — Refusal taxonomy (drafted — the Q9 success criterion).** Extends
`CompileRefusalReason` (`backward.ts:82-86`); the inherited four still apply
(weighted-blend, custom-renderer, perceptual-oklab beyond ΔE-ε — the densify itself works on
pseudos since `@keyframes` is `@keyframes` — computed-unit-drift). New, VT-specific:
- **`vt-scroll-grammar`** — a child carrying `scrollOptions` (`backward.ts:337`,
  `scrollLonghands`): same-doc VT pseudos are time-driven; `animation-timeline` on a VT pseudo has
  no defined behavior. REFUSE.
- **`vt-element-scoped-computed`** — `var()`/`cq*` declared relative to the ORIGINAL element:
  the pseudo tree hangs off the root element, so element-scoped custom properties and container
  contexts don't reach it (`:root`-scoped `var()` is fine and stays verbatim). Narrower than
  computed-unit-drift; REFUSE with the container/scope named.
- **`vt-snapshot-inapplicable`** — a property that does not apply to the snapshot pseudos
  (old/new are replaced content: transform/opacity/filter-class properties animate; layout-
  or content-affecting properties inside the snapshot do nothing). REFUSE per property, never
  silently drop.
- **`vt-name-collision`** — two same-tick children mapped to one `view-transition-name`
  (the ≤1-element-per-name platform rule; the demo comment at `useSceneTransition.ts:13` states
  it). The de-dup at `backward.ts:391-396` handles the class-name case; VT names need the same
  guard but as a REFUSAL (a renamed VT name silently detaches from the element's
  `view-transition-name`).

**F6 — Multi-element cohorts ride `view-transition-class`, not per-element rules.** A stagger
cohort maps to one `::view-transition-group(.kf-card)` class rule + per-element unique names
(Chromium 125+/Safari 18.4+, r5:77). Materialized per-child `animation-delay`
(`backward.ts:323-326`) cannot ride a single class rule — a staggered cohort therefore emits
per-NAME rules (the universal form), with the class rule reserved for uniform cohorts. This is an
emitter branch, not a refusal.

**F7 — Cross-doc posture: EMIT-only.** `@view-transition { navigation: auto }` (+ the `types`
descriptor) is a static at-rule the emitter can prepend under an opt-in flag; the JS dispatch
stays same-doc (cross-doc customization hooks — `pagereveal`/`pageswap` — are a different,
non-S surface). Chromium-only today (r5:77) → the emitted artifact carries a comment naming the
support boundary; honest-narrative, not refusal (the at-rule is inert where unsupported).

**F8 — PRM degrade is one emitted block + the existing LIGHT gate.** The compile artifact appends
`@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*),
::view-transition-new(*) { animation: none !important; } }` (VT then snaps — the platform's own
degrade, same shape glass-ui's `view-transition.css` ships, `useSceneTransition.ts:14-15`). The
LIGHT dispatch routes through the ONE `withReducedMotion` gate (`internal/reduced-motion.ts`) —
under PRM it calls `mutate()` directly and settles, skipping `startViewTransition` entirely.

## 4. VERDICT: **adjusts-spec**

The emitter is real — Q9's FAILURE branch (demote F1 to dispatch-only) is **dead**: VT's model
expresses the timing semantics (spring `linear()`, per-name duration, typed direction) and the
UA group animation IS the compiled flipShared. But S.F1 as written needs three adjustments:

1. **Input model.** Not "compile a kf group": an `AnimationGroup`/`Sequence` has no old/new axis.
   The emitter's input is a **name-keyed role spec** — per VT name, `{ old?: child, new?: child,
   group?: timing-or-child }` (children being the same `KeyframesAnimation`s `compileToCSS`
   walks) + `{ types?, class?, crossDocument?, reducedMotion? }` options. The bare-group overload
   can exist as sugar (children partitioned by a role callback) but the role spec is the primary
   shape.
2. **Three emission surfaces, group mandatory-by-default.** old/new get full kf `@keyframes` +
   shorthand; **group gets a timing-only override** (duration + timing-function, never
   `animation-name`) so the UA-generated geometry morph stays and stays coherent with the
   old/new tracks. Omitting the group emission (run 1's shape) ships a 250ms/ease incoherence.
3. **Refusal taxonomy extension** (F5): `vt-scroll-grammar`, `vt-element-scoped-computed`,
   `vt-snapshot-inapplicable`, `vt-name-collision`, atop the inherited four.

**Zone home: NO new zone.** The emitter is `compile/view-transition.ts` inside the existing
HEAVY `compile/` zone (it is `compileToCSS`'s sibling over the same `format.ts`/`backward-walk`
substrate — exactly where the scroll grammar's EMIT half landed, `backward.ts:328-341`). The
dispatch is LIGHT `orchestration/view-transition/` (per S.F1/r5 — composes `flip.ts` +
`internal/reduced-motion.ts`, zero value.js). Public surface: `compileToViewTransition` rides
`loadAnimationEngine()` + the `./engine` static mirror (`engine/public.ts:130` beside
`compileToCSS`); `viewTransition` joins the LIGHT static barrel.

### API shape (the wave's contract)

```ts
// LIGHT — orchestration/view-transition/ (static barrel export)
export interface ViewTransitionOptions {
    types?: string[];                       // typed same-doc VT; dropped where unsupported
    duration?: number;
    timingFunction?: TimingFunction | Easing; // springTimingFunction(...) for the springy VT
    fallback?: "flip" | "none" | ((mutate: () => void) => Promise<void>);
    shared?: ReadonlyArray<readonly [HTMLElement, HTMLElement]>; // flipShared pairs for the fallback
    respectReducedMotion?: boolean;         // routes through the ONE withReducedMotion gate
}
export interface ViewTransitionHandle {     // normalized: settles cleanly where VT is absent
    ready: Promise<void>; finished: Promise<void>; updateCallbackDone: Promise<void>;
    skip(): void;
    backend: "view-transition" | "flip" | "immediate"; // conservative-correct dispatch, queryable
}
export function viewTransition(mutate: () => void | Promise<void>,
    opts?: ViewTransitionOptions): ViewTransitionHandle;

// HEAVY — compile/view-transition.ts (loadAnimationEngine + ./engine mirror)
export type VTRoleSpec<V extends Vars> = {
    old?: KeyframesAnimation<V>;
    new?: KeyframesAnimation<V>;
    /** timing-only by design: duration + easing onto the UA geometry morph */
    group?: Pick<AnimationOptions, "duration" | "timingFunction"> | KeyframesAnimation<V>;
    class?: string;                          // view-transition-class cohort styling (uniform only)
};
export interface ViewTransitionCompileOptions extends CompileOptions {
    types?: string[];                        // wraps rules in :active-view-transition-type(...)
    crossDocument?: boolean;                 // prepend @view-transition { navigation: auto }
    reducedMotion?: boolean;                 // default true: append the PRM animation:none block
}
export type VTCompileRefusalReason = CompileRefusalReason
    | "vt-scroll-grammar" | "vt-element-scoped-computed"
    | "vt-snapshot-inapplicable" | "vt-name-collision";
export interface CompiledViewTransitionCSS extends Omit<CompiledCSS, "refusals"> {
    refusals: Array<CompileRefusal & { reason: VTCompileRefusalReason }>;
    names: string[];                         // the view-transition-name set the consumer assigns
}
export function compileToViewTransition<V extends Vars>(
    spec: Record<string, VTRoleSpec<V>>,     // keyed by view-transition-name
    opts?: ViewTransitionCompileOptions,
): Promise<CompiledViewTransitionCSS>;
```

### Wave decomposition (for S.F sizing)

- **VT-a (LIGHT dispatch, S).** `orchestration/view-transition/` — `viewTransition()` +
  feature-detects (startViewTransition / types-arg / PRM) + flipShared fallback + the normalized
  handle. jsdom tests exercise the fallback + immediate paths. ~2 source files + barrel + 1 test.
- **VT-b (compile seam carve, XS).** Parameterize the rule selector at `backward.ts:339` (a
  selector-factory arg threaded through `compileChild`; `.class` stays the default). Zero
  behavior change; existing `proof:compile-replay`/`compile-deterministic` stay green untouched.
- **VT-c (the emitter, M — the anchor).** `compile/view-transition.ts` (~250-300L): role-spec
  walk → per-role `compileChild` with VT selectors, the group timing-only branch, types wrapper,
  class-cohort branch (F6), cross-doc preamble, PRM block, the 4 new refusals. Surface wiring:
  `load-engine.ts` + `engine/public.ts` + `docs/published-surface.md` manifest + README anchor.
  **Born-RED gate `proof:vt-roundtrip`** (browser-actuating, library-correctness tier): this
  probe's Playwright script IS the oracle skeleton — emitted stylesheet + startViewTransition →
  assert via `getAnimations()` that the emitted names/durations/`linear()` drive the old/new
  pseudos AND the group carries the emitted duration; plus the flipShared side-by-side
  rect-tolerance clause (Q9's visual-equivalence letter). Structural assertions only — no
  absolute frame/ms thresholds (the Linux-runner lesson).
- **VT-d (demo + narrative, S).** Dogfood decision: `useSceneTransition` may swap glass-ui's
  `startViewTransition` for kf's own `viewTransition` (USER-DOMAIN call — glass-ui owns its
  helper; the swap is demo-side consumption, not a glass-ui patch). README/S.F6 claims →
  `proof:readme-runs` coverage.

## 5. Implementation-cost estimate (the real wave)

**Files touched (~12-14):** new `orchestration/view-transition/{index,view-transition}.ts`,
new `compile/view-transition.ts`; edits to `compile/backward.ts` (selector seam, ~20L),
`compile/index.ts`, `index.ts` (barrel), `load-engine.ts`, `engine/public.ts`,
`docs/published-surface.md`, README; new `test/view-transition.test.ts` +
`test/compile-vt.test.ts`; new `scripts/proof-vt-roundtrip.mjs`; `package.json` (gate wiring +
the S.B/Q8 gate-tier manifest row).

**Gates affected:** `proof:boundary` (self-enforcing — picks up the new LIGHT entries
automatically; must stay green: the dispatch imports only flip/reduced-motion/playback),
`proof:published-surface` (LIGHT set + HEAVY key count + manifest row — the barrel-parsed
clauses re-derive, the manifest must be co-edited), the `./engine` static-mirror equality
(`engine/public.ts` co-edit or it reds), `proof:compile-replay`/`proof:compile-deterministic`
(VT-b must not perturb them), `proof:readme-runs` (new claims), + the new born-RED
`proof:vt-roundtrip`.

**Risk: low-medium.** The compile substrate is proven (this probe ran it unmodified against dist
and the browser accepted the output verbatim); the two genuinely new behaviors (group
timing-override coherence, refusal detection for element-scoped computed values) are localized to
the new module. The main risks: (a) the browser-actuating gate on the slow Linux runner — mitigate
with structural assertions (names/durations via `getAnimations()`, no pixel-race clauses except
the one rect-tolerance check at settled state); (b) `view-transition-class` support skew
(Chromium/Safari yes, FF partial) — the class branch is opt-in per role spec, per-name rules are
the universal default; (c) Safari/FF lack `:active-view-transition-type` — the types wrapper is
opt-in, and untyped emission is the default (same degrade the demo already ships).

**Probe artifacts (throwaway):** `…/scratchpad/p09/sketch.mjs` (exit 0), `vt-emitted.css`,
`vt-live.html`; live runs on Chrome 149 headless via Playwright (both returned structured JSON,
recorded verbatim in §2-3).
