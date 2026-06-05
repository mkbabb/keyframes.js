# SOTA audit — the A→E (kf) + A→M (vj) tranche-set retrospective

**Lane:** tranche-set retrospective. **Scope:** what the two tranche sets
ACHIEVED vs the SOTA gaps that REMAIN, the cross-repo boundary coherence, the
chronically-unaddressed, and a consolidated disposition map. **Method:** every
FINAL.md (kf A/B/C + the in-flight D/E plans; vj A/B/C/D/E/F/G/H/I/J/L FINALs +
the in-flight K/M plans), grounded against live code (`file:line`), the sibling
SOTA research docs already on disk (`r-anim-libs.md`, `r-modern-web-digest.md`,
`r-scroll-view-transitions.md`, `r-wasm-compile-perf.md`), and the
`modern-web-guidance` Baseline-dated corpus.

**inv-16:** keyframes.js findings → `FOLD-E`; value.js findings →
`FOLD-VALUEJS-HANDOFF` (value.js is dirty + active K/M; propose a value.js
tranche, do NOT write it). This file is the only one this lane writes.

**Disposition legend:** `FOLD-E` · `FOLD-VALUEJS-HANDOFF` · `BOOK` · `GAP-NAMED`
· `ALREADY-SOTA`.

---

## 0. Headline verdict

**The two tranche sets converged on a genuinely SOTA core with a deliberate,
honestly-recorded boundary — and the residual gaps are an ORCHESTRATION-LAYER
feature set on the kf side and a published-surface-drift hygiene item on the
boundary, not a modernity deficit.** Neither repo carries a chronically-unowned
*correctness* or *spec-currency* debt in its hot path. The single
chronically-unaddressed cross-repo item across BOTH histories is the
**keyframes ↔ value.js consumption seam** (pin drift + the `AnimationOptions →
CSSAnimationOptions` rename + the `Color.components.get` → `Color.L` migration +
the precept-pin divergence) — named in value.js D.W3, E, F, G, H but never
executed on the keyframes side because value.js cannot write keyframes (inv-16
from the other direction) and no keyframes tranche has owned it.

What is NOT a gap (verified, not assumed): CSS spec currency. value.js's library
`src/` is at the CSS Color L4/L5 + Easing L2 frontier — `linear()`, relative
color syntax, `color-mix()`, `oklch`/`oklab`/`display-p3`/`rec2020`, `none`/
powerless components, hue-interpolation methods all ship
(`value.js/src/easing.ts:16,33`, `value.js/src/parsing/color.ts:66-205`). The
keyframes engine is the reference implementation of compositor-thread spring
delegation (`linear()`-twin via WAAPI) that almost no library ships.

---

## 1. What the kf tranche set (A→E) ACHIEVED

The kf arc is short (5 tranches) and tightly scoped — it is a library + demo
co-evolution, not a backend. Each tranche's load-bearing achievement, grounded:

| Tranche | Headline achievement | Evidence |
|---|---|---|
| **A** | The value.js light/heavy **boundary gated, not asserted** (inv α) — a spring-only entry bundles 0 value.js bytes + 0 static `engine.ts` edge, CI-gated; `EasingResolvable` retires 3 hand-rolled `.ready()` copies; reduced-motion + `scheduler.yield` + WAAPI spring `linear()` land | `kf A/FINAL.md §1-3`; `scripts/proof-boundary.mjs`; `src/animation/internal/{reduced-motion,scheduler}.ts` |
| **B** | The demo **made true** (no blank ship — inv γ) + **no-occlusion** gate (inv δ); the engine's rest-position/fill contract transposed (`settle`/`reset`/`paintRest`); typed `Easing {fn,css?}` retires 2 Symbol channels | `kf B/FINAL.md §Invariants`; `scripts/{demo-smoke,occlusion-gate}.mjs` |
| **C** | The close **made honest** (inv ε — audited its OWN predecessor's claims, folded 7 B overclaims); the **φ-ladder display tier unforked**; the **demo dogfoods its own engine** (inv ζ — 7 hand-rolled rAF loops → `SmoothProgress`/`SpringProgress`/`NumericAnimation`/`RAFPlayback`) | `kf C/FINAL.md §B-overclaim-reconciliation` |
| **D** | The engine **transposed to its gestalt** — `AnimationGroup` zero-alloc compositor (inv θ), `tick`→`advanceTo` driver canon, the ~1019-line `Animation` god-object split at the **`FrameCompiler` seam**, honest `pause`/`resume`/`toggle`; the design language **localized** (4 rented idioms owned — inv η); P-invariant-28 terminal (zero perpetual punts) | `kf D.md §Goal`; `src/animation/frame-compiler.ts` (332L); `src/animation/group.ts` (681L); `kf E.md §Thesis` confirms 336 tests · tsc 0 |
| **E** (in-flight) | Demo **fast + modern-web-aligned** — Monaco code-split, render-loop yield, the vueuse listener/observer gestalt (inv κ), styling round-2 (inv λ), a modern-web perf budget (inv μ); the engine assay found **zero engine GAP** | `kf E.md §Thesis`; `audit/engine-findings.md` "EXEMPLARY post-D" |

**Net arc:** A gated the boundary, B made the shop-window real + non-occluding,
C made the close-honesty discipline self-applying, D transposed the engine to
its gestalt, E is making the demo fast and the listener surface idiomatic. By D
the engine is "EXEMPLARY" against modern-web guidance and the deferred ledger is
clean — `kf E/audit/deferred-ledger.md` proves **zero KFE** (no chronic kf debt
folds into E).

---

## 2. What the vj tranche set (A→M) ACHIEVED

The vj arc is long (13 letters A→M; C retired via the AB+1 pattern) and splits
into two distinct bodies: the **library `src/`** (the color/parsing/easing/math
surface keyframes consumes) and the **api/ + demo + cohort** (CRUD-CONTRACT,
palette domain, frontend). The library surface — what matters to the kf boundary
— was hardened to its gestalt by **G/H and has been essentially frozen since**:

| Tranche | Library-relevant achievement | Evidence |
|---|---|---|
| **A/B** | Demo un-break + glass-ui idiomatic consumption; library-side mandate (#12 AND) scoped forward to D | `vj A/FINAL.md §3`; `vj B/FINAL.md §3 row H` |
| **C** | **RETIRED** (AB+1 retrospective) — the palette-domain plan was discharged-in-substance by D/E under different theses; the library `Palette` axis is **orphaned absent user re-mandate** | `vj C/FINAL.md §2 Axis-2` |
| **D** | **Color<T> flatten** (Map→own-properties, 11× channel-access speedup); contract-v2 exports collapse; `AnimationOptions → CSSAnimationOptions` rename; recursion-guard primitives (inv D7) | `vj D/FINAL.md §2 D.W1 L8`; tag `v0.6.0` |
| **E** | **Architectural transposition** — 152-branch nameParser → broad-regex+Set (37× faster); DIRECT_PATHS color2 hot-path table; WhitePoint lift; `lerpLegacy` arg-order canon | `vj E/FINAL.md §7`; tag `v0.7.0` |
| **F** | **NO LEGACY** — `lerpLegacy` deleted (the lone BREAKING); typed `Memoized<T>`; Rolldown codeSplitting; −16.5 KB bundle | `vj F/FINAL.md §6`; tag `v0.8.0` |
| **G** | **Color/utils god-module decomposed** (1430L → 9 modules ≤350L); `as any` corpus 35→0; 6 invariant proof-scripts codified | `vj G/FINAL.md §2`; `value.js/src/units/color/conversions/*`; tag `v0.9.0` |
| **H** | Cascade-correctness (`withTransaction` 9→16); `as unknown as` 4→2; demo ≤400L; cross-tree proof-scripts | `vj H/FINAL.md §2`; tag `v0.10.0` (the version kf currently pins) |
| **I/J/L** | **api/ + cohort only** — CRUD-CONTRACT v2.0.0 conformance (visibility/soft-delete/SOTA envelopes), palette REMIX + atom-diff, api/src legacy-excision. **Zero library `src/` edits** | `vj I/FINAL.md`; `vj J/FINAL.md §0`; `vj L/FINAL.md §1` |
| **K/M** (in-flight) | **Cross-repo cohesion + v1.0.0** — acyclic color topology (glass-ui→vj-lib→nothing), aurora-derive, blob-extirpation, demo modern-web parity, the `development` exports-fossil retirement | `vj K.md §0`; `vj M.md §1` |

**Net arc:** the library reached its gestalt at G/H (color flatten + nameParser
+ DIRECT_PATHS + god-module decomp + `as any`→0 + Color L4/L5 + Easing L2 all
landed). I→L are backend/cohort (palette CRUD). K/M are the cross-repo cohesion
endgame cutting **v1.0.0**. **The published library surface keyframes consumes
has been spec-current and frozen since `v0.10.0` (H).**

---

## 3. SOTA gaps that REMAIN

### 3.1 — keyframes.js: the orchestration layer (the real residual)

The kf engine LEADS on the *interpolation/physics/color/parsing* axes
(`r-anim-libs.md` TL;DR) but GAPS on the *orchestration & interaction* layer
that Motion/GSAP/anime.js v4 have made table-stakes. These are net-new, not
chronic debt — D's ledger is clean — and they are E-SCOPE or post-E:

- **No stagger primitive.** Highest-ROI gap. `r-anim-libs.md:45` (F-1) → **FOLD-E**
  (`src/animation/stagger.ts`, value.js-free `(i,total)=>delay`). Isomorphic — a
  new light helper, no behaviour change to existing surface.
- **No timeline sequencing / labels / position-based insertion.** The single
  biggest competitive gap. `r-anim-libs.md:54` (F-2) → **FOLD-E after a BOOKED
  API-design pass** (name collision: `Timeline` already means the scroll/manual
  progress driver — `src/animation/timeline.ts`; the sequence orchestrator needs
  a distinct name + a decision on subsuming `AnimationGroup`).
- **FLIP/layout animation is manual-only.** `r-anim-libs.md:63` (F-3) → **FOLD-E**
  (a `flip()`/`flipShared()` over `ElementMorph`; batch the `getBoundingClientRect`
  reads to avoid layout thrash). Isomorphic.
- **Drag/gesture + velocity-handoff (inertia) absent — physics core is right
  there.** `r-anim-libs.md:72` (F-4) → **FOLD-E** (`drag.ts` + `decay.ts` sibling
  of the spring). The value.js-free boundary holds.
- **`ScrollTimeline` is JS-rAF-only; no native `animation-timeline: scroll()/
  view()` delegation.** `r-anim-libs.md:81` (F-5) → **FOLD-E** (extend WAAPI
  delegation to a native timeline, keep JS as fallback). NOTE: the ARCH-kill of
  *replacing* the JS sampler with native scroll-timeline correctly HOLDS —
  `r-scroll-view-transitions.md §0` re-confirms it against live 2026 Baseline
  (native scroll-driven is Firefox-partial/flagged, Interop-2026 in-flight; the
  engine's `Timeline` is a strictly more general caller-polled sampler over
  arbitrary objects, not a substitute). **ALREADY-SOTA** on the kill;
  **GAP-NAMED → FOLD-E** only on the additive *delegation* path.
- **No MotionPath / offset-path following.** `r-anim-libs.md:90` (F-6) → **BOOK**
  (leans on SVG geometry — a larger surface; the geometry sampler hands off to
  value.js, see §5 VJ-2).
- **No View-Transitions interop helper.** `r-anim-libs.md:98` (F-7) → **BOOK**
  (thin platform wrapper; the demo's "don't own it" stance is already correct).
- **Preset taxonomy lacks entrance/exit/loop + spring presets.**
  `r-anim-libs.md:106` (F-8) → **FOLD-E (small)**, pairs with the F-1 stagger demo.

### 3.2 — keyframes.js demo: declarative-CSS platform wins on the table

`r-modern-web-digest.md` finds the demo modern in *architecture* (`@layer`,
tokens, lazy scenes, reduced-motion, INP instrumentation) but leaving a cluster
of platform wins unclaimed — these are **E-SCOPE (inv μ)** or post-E:

- **Monaco eager 4 MB import** (`CSSCodeEditor.vue:14`) — the dominant
  `unused-javascript` lever, drives the spring-mobile LCP regression. → **FOLD-E**
  (E.W4, code-split). Already named in `kf E.md §1.4`.
- **Render loops don't yield off-screen/off-tab** (amiga TBT canary). → **FOLD-E**
  (E.W4 render-loop yield).
- **`content-visibility:auto` for the KeepAlive panes** (0 uses in demo source).
  → **FOLD-E (measure-first, paired with `contain-intrinsic-size`)** — E.W4
  resolved-design-decision #4 already gates this correctly.
- **View Transitions for scene switches; `@starting-style`/`allow-discrete` for
  overlays; `interpolate-size`; `fetchpriority`.** → **BOOK** (SOTA-leverage, not
  correctness; ship on a concrete consumer story). The native-`<dialog>`/Popover
  check resolves NEGATIVE (reka-ui renders role-div + JS focus-trap) — recorded
  OUT, glass-ui-owned, not a demo patch (`kf E.md §6`). Correct.

### 3.3 — keyframes.js: compile-time / parse perf

`r-wasm-compile-perf.md`: runtime hot paths are **ALREADY-SOTA**
(`prepareInterpVar` pre-resolves dispatch; `allInterpVars` pre-flattened
zero-alloc; parse fns memoized). The realistic wins:

- **Build-time preset precompilation** (presets re-parse CSS at runtime). →
  **FOLD-E** (a build step emitting compiled `AnimationFrame[]`).
- **WASM for the parser** → **DECLINE / GAP-NAMED** (KISS — honest cost-benefit;
  `r-wasm-compile-perf.md:F1`). Correct non-action.

### 3.4 — value.js: the gaps are demo/cohort-side, not library-spec

The library `src/` is spec-current (§0). The remaining vj gaps are the in-flight
K/M cohort work (modern-web parity in the *demo*, aurora-derive, blob-extirpation,
the acyclic color topology, the `development` exports-fossil) — all **already
owned by K/M**, all value.js-internal, none on the kf boundary. From the kf
retrospective's vantage these are **OUT (value.js-owned, K/M tranches)**, not kf
findings. The library-`Palette` domain object remains **orphaned absent user
re-mandate** (`vj C/FINAL.md §2 Axis-2`) — a 6-tranche chronic, but correctly
parked (no consumer demand), not a SOTA deficit.

---

## 4. Cross-repo coherence — the boundary & shared idioms

### 4.1 — The boundary is architecturally SOUND and gated

The kf light/heavy seam (`proof:boundary`) is the model cross-repo discipline:
the light interpolation/physics engines carry **0 static value.js edges**; the
heavy CSS-parsing engine reaches value.js only via dynamic
`loadAnimationEngine()` (`kf A/FINAL.md §1`, hardened in B/C). value.js
reciprocally honors `proof:resolution` (contract-v2 dev-resolution) and the
acyclic-topology invariant K is establishing (glass-ui → vj-lib → nothing). The
two repos share a clean, gated, ONE-DIRECTION dependency edge. **ALREADY-SOTA**
on the architecture.

### 4.2 — The shared idioms cohere

- **Spring solver — one home, three surfaces.** keyframes owns the spring
  emitter (`springLinearStops`/`springTimingFunction`); glass-ui's `--spring-*`
  tokens regenerate from it; the WAAPI `linear()` twin runs the same solver on
  the compositor. value.js correctly **KILLED** lifting a spring consumer into
  itself (`vj J/FINAL.md §2` VAL-9 — "a third home wins no de-dup"). The
  constellation's three spring surfaces are provably one solver. **ALREADY-SOTA.**
- **Color core — one canonical home.** value.js `src/units/color/` is the single
  OKLab/OKLCh/sRGB authority; K deletes glass-ui's duplicate and routes it to
  value.js (inv-K-2, 1e-6 equivalence canary). keyframes consumes value.js's
  color engine for perceptual interpolation (oklab default). **ALREADY-SOTA.**
- **Easing registry.** keyframes' `springLinearStops` reuses value.js's
  `cssLinear`/`CSSCubicBezier`/`steppedEase` (`src/animation/animations.ts:1`
  imports `CSSCubicBezier, steppedEase` from value.js). The shared easing math
  has one home. Coherent.

### 4.3 — The ONE chronically-unaddressed coherence item: the consumption seam

This is the single cross-repo debt that BOTH histories name and NEITHER closes:

- **kf pins `@mkbabb/value.js ^0.10.0`** (`keyframes.js/package.json`) — current
  against the published surface (vj git tags stop at `v0.10.0`; I→M / v1.0.0 are
  unpublished), so the pin is NOT broken today. But it is one publish away from
  drift, and the consumption *contract* has moved underneath it:
  - **`AnimationOptions` → `CSSAnimationOptions` rename** shipped in vj D.W1
    (`vj D/FINAL.md §2 D.W1 L6`), but kf still uses `AnimationOptions`
    internally as its OWN type (`src/animation/engine.ts:39` — confirmed it is a
    kf-local constant, NOT the value.js import; this is a NAME COLLISION the kf
    side should be cognizant of, not a broken import).
  - **`Color.components.get("L")` → `Color.L`** migration (the Color<T> flatten,
    vj D.W1 L8) — kf should verify it reads channels via the flat accessor.
  - **The precept-pin divergence** (`458c2d1` vs upstream `68d9b20`) — named in
    vj D.W3, E.W5, F.W7, G.W7, H carry-forward; **standing across 5 value.js
    tranches**, re-check-triggered on "keyframes.js maintainer's next
    submodule-rebase signal" (`vj G/FINAL.md §7`).
  - The kf lerp-arg-order migration WAS done (vj F.W2 applied the codemod at kf
    `470814e`, LEAVE-LOCAL per user ratification) — so the seam is partially
    reconciled, but the push status is itself a carry-forward (`vj G/FINAL.md §7`
    R11).
- **Disposition: GAP-NAMED → FOLD-E (a verification + pin-bump sub-item) when
  value.js publishes v1.0.0.** This is the keyframes-side terminal home for the
  consumption-seam reconciliation value.js has filed five times and cannot
  execute itself (inv-16). It is NOT urgent (the pin is current against
  published), but it is the genuine chronic — book it explicitly so it does not
  fall through the inv-16 crack in BOTH directions. ISOMORPHISM: a pin-bump +
  internal-name-collision audit is behaviour-neutral by construction (verified by
  the existing test suite + `proof:boundary`).

---

## 5. value.js hand-offs (FOLD-VALUEJS-HANDOFF)

Consolidated from the sibling SOTA lanes. Each is value-domain math/parsing that
belongs beside value.js's existing registry, NOT a second math home in keyframes.
**Propose a value.js tranche; do not write value.js.**

- **VJ-1 — `decay`/inertia closed-form + a generic "JS-easing → `linear()`
  stops" sampler** in value.js's easing registry. keyframes will build `decay()`
  locally for F-4 over its spring, but the frictional-decay closed form + a
  generic sampler are value-domain math beside `timingFunctions`; landing them in
  value.js lets `springLinearStops` collapse to a thin caller.
  `r-anim-libs.md:134`.
- **VJ-2 — `offset-path`/SVG path geometry helpers** (`getPointAtLength`-equiv,
  path sampling) for F-6 MotionPath. Path geometry is value-domain CSS/SVG math.
  Hand off only if MotionPath graduates from BOOK. `r-anim-libs.md:135`.
- **VJ-3 — `color-mix()`/`oklch()`/`oklab()` parse + serialize round-trip
  parity** (CSS Color L4/L5). value.js computes in oklab internally and the
  relative-color/`color-mix` PARSERS exist (`value.js/src/parsing/color.ts:196`);
  the hand-off is to FORMALIZE round-trip serialize coverage if the demo/engine
  begin emitting these function forms in author CSS that flows back through
  value.js. `r-modern-web-digest.md:184`.
- **VJ-4 — `@property` `syntax` grammar in the value-type registry** (CSS
  Properties & Values API L1). If keyframes animates `@property`-registered
  custom props, value.js's value parser should understand the `syntax`
  descriptor's component grammar (`<length>`/`<color>`/`<angle>` + `+`/`#`
  multipliers) to interpolate registered custom properties correctly.
  `r-modern-web-digest.md:185`.
- **VJ-5 — bounded memo caches (LRU) + lazy sub-grammar construction** in
  value.js's parser. The kf engine BOOKs `tryParseCache` eviction measure-first
  (`kf E.md §5.5`); the value.js-side parse-fn memo caches are unbounded and the
  sub-grammars eagerly construct. `r-wasm-compile-perf.md:H1,H2 (F5)`. Med
  priority; measure-first.

**Note on inv-16 symmetry:** value.js has repeatedly filed the kf-consumption
asks (the rename, the Color accessor, the precept-pin) it cannot execute (it
cannot write keyframes). This retrospective's §4.3 is the keyframes-side mirror —
keyframes should not assume value.js will (or can) close them. The two
hand-off ledgers (vj→kf in `vj coordination/Q.md`; kf→vj here as VJ-1..5) are the
honest accounting of a boundary that is architecturally sound but operationally
under-reconciled.

---

## 6. The disposition map (consolidated)

| ID | Finding | Repo | Disposition | Priority |
|---|---|---|---|---|
| F-1 | Stagger primitive | kf | **FOLD-E** | High (top ROI) |
| F-2 | Timeline sequencing / labels | kf | **FOLD-E** (BOOK API design first — name collision) | High |
| F-3 | FLIP / layout animation | kf | **FOLD-E** | Med-High |
| F-4 | Drag/gesture + inertia (`decay`) | kf | **FOLD-E** (+ VJ-1) | Med-High |
| F-5 | Native scroll-timeline WAAPI delegation | kf | **FOLD-E** (additive); replace-the-sampler = **ALREADY-SOTA kill** | Med |
| F-6 | MotionPath / offset-path | kf | **BOOK** (+ VJ-2 on graduation) | Low |
| F-7 | View-Transitions interop helper | kf | **BOOK** | Low |
| F-8 | Entrance/exit/loop + spring presets | kf | **FOLD-E (small)** | Med |
| MW-1 | Monaco eager import | kf demo | **FOLD-E** (E.W4) | High (named) |
| MW-2 | Render-loop yield off-screen/off-tab | kf demo | **FOLD-E** (E.W4) | High (named) |
| MW-3 | `content-visibility` panes | kf demo | **FOLD-E** measure-first (E.W4) | Med (named) |
| MW-4 | VT scenes / `@starting-style` / `interpolate-size` / `fetchpriority` | kf demo | **BOOK** | Low |
| CP-1 | Build-time preset precompilation | kf | **FOLD-E** | Med |
| CP-2 | WASM parser | kf | **GAP-NAMED / DECLINE** | — |
| **XR-1** | **The kf↔vj consumption seam** (pin-bump + rename name-collision audit + Color-accessor verify + precept-pin) | boundary | **GAP-NAMED → FOLD-E** when vj v1.0.0 publishes | **Chronic — the one cross-history unowned item** |
| VJ-1 | `decay` + JS-easing→`linear()` sampler | vj | **FOLD-VALUEJS-HANDOFF** | Med |
| VJ-2 | SVG path geometry sampler | vj | **FOLD-VALUEJS-HANDOFF** (on F-6 graduation) | Low |
| VJ-3 | `color-mix`/`oklch` serialize round-trip parity | vj | **FOLD-VALUEJS-HANDOFF** | Low-Med |
| VJ-4 | `@property` `syntax` grammar | vj | **FOLD-VALUEJS-HANDOFF** | Low-Med |
| VJ-5 | Bounded LRU memo + lazy sub-grammar | vj | **FOLD-VALUEJS-HANDOFF** measure-first | Med |
| — | Library `Palette` domain object | vj | **OUT** (orphaned, no consumer; vj-owned re-mandate) | — |
| — | vj K/M demo modern-web parity, aurora, blob, exports-fossil | vj | **OUT** (K/M-owned, value.js-internal) | — |
| — | CSS Color L4/L5, Easing L2, perceptual interp, spring `linear()` twin, gated boundary, one-canonical-color-core, zero-alloc compositor | both | **ALREADY-SOTA** (do not manufacture work) | — |

---

## 7. Retrospective summary

**The arc is healthy.** Both tranche sets practiced honest close-discipline
(kf inv ε self-auditing; vj's per-tranche FINAL gate matrices + zero-deferral
invariants), and both reached a genuine gestalt — kf at D (engine EXEMPLARY),
vj at G/H (library spec-current + decomposed + `as any`→0). The recent vj
tranches (I→M) correctly pivoted to api/cohort/v1.0.0 because the *library* was
done; the recent kf tranche (E) correctly pivoted to demo-perf + listener-gestalt
because the *engine* was done.

**What remains is two clean buckets, not a rescue:**
1. **kf orchestration layer** (stagger, sequence-timeline, FLIP, gesture/inertia,
   native-scroll delegation, MotionPath) — the highest-value, isomorphism-safe,
   net-new feature surface that closes the Motion/GSAP/anime.js v4 competitive gap.
   These are E-SCOPE-or-later FOLD-E items, NOT chronic debt.
2. **the boundary consumption seam** (XR-1) — the ONE chronically-unaddressed
   cross-history item, named five times by value.js, never owned by keyframes
   because inv-16 binds it from both sides. The retrospective's recommendation:
   keyframes book XR-1 as an explicit FOLD-E sub-item triggered on vj v1.0.0
   publish, so a seam that is architecturally sound stops being operationally
   under-reconciled.

**Nothing chronic on the SOTA/spec-currency axis.** The honest answer to "are we
fully modern, up-to-spec" is YES on the core (Color L4/L5, Easing L2, perceptual
interpolation, compositor spring, gated boundary, one canonical color core) and
"deliberately additive-pending" on orchestration. No manufactured work; no
modernity deficit; one real boundary-hygiene chronic.
