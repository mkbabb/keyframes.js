# Critique — S.F SOTA Animation Uplift

**Agent:** adversarial critique · **Band:** S.F (S.F1–S.F6) · **Track:** lib
**Probe evidence:** p09-vt-emitter (adjusts S.F1 / Q9 — the VT emitter is REAL and thin)
**Verdict:** the flagship (F1) is strongly validated by p09 and is largely *absorbable* — three
precise adjustments turn it implementable. But the band's weight is uneven: **F5 is a
seven-item kitchen-sink behind one gate with an unbudgeted Typed-OM fork**, **F3 smuggles a
second output grammar into a keyframes-only compiler with no prototype and no home ruling**, and
**F1's gate as-written is the exact device-dependence trap the tranche exists to cure**. F2/F4/F6
are sound with named gaps. Convergence **52%**.

---

## 0. Scope + what I verified

Assigned item: S.F (VT compile-emitter, SplitText, `@starting-style`, `animation-trigger`, perf
frontier — zero-alloc completion, Typed-OM verdict, colorTail). Read: SPEC-v1 §1–2, §S.F
(`:472-508`), the DAG (`:585-595`), C-10 (`:203-207`), Q9 (`:759-763`), T1–T12 (`:786-825`);
p09 whole; r5 digest; a32/a04/a26 digests. Source spot-checks (all confirm probe/audit citations):

- `compile/backward.ts:339` — the ONE hardcoded selector seam `` `.${name} {\n  animation:…` `` is
  real (the VT-b carve target). Verified.
- `compile/backward.ts:82-86` — `CompileRefusalReason` = exactly the inherited four
  (`weighted-blend | custom-renderer | perceptual-oklab | computed-unit-drift`). Verified — F5's
  VT extension is a clean union add.
- `group/compositor.ts:182` — `const onlySet = only ? new Set(only) : undefined;` — the per-frame
  Set (a32 F3). Verified.
- `engine/public.ts:130` — `export { compileToCSS } from "../compile";` — the `./engine` mirror
  slot `compileToViewTransition` rides beside. Verified.
- `grep TypedOM|StylePropertyMap|attributeStyleMap src/` → **zero hits.** The Typed-OM "verdict" is
  from-scratch research with no existing seam and no prototype. Load-bearing for D2.
- `proof:zero-alloc` = `vitest run test/zero-alloc.test.ts …` (package.json:71) — the mixed-leaf
  clause is a test extension, not a new gate script. Absorbable.

---

## 1. What p09 ADJUSTED that SPEC-v1 has NOT absorbed (F1 — the load-bearing corrections)

SPEC-v1 §S.F1 (`:480-485`) predates p09. Its input model and gate are both now stale. All three
adjustments are *mechanically absorbable* (p09 supplied the exact API shape and wave decomposition
at p09:183-249) — but they are MANDATORY, because F1 as written ships a correctness bug.

### 1.1 Input model: "compile a kf group" is wrong — the primary shape is a name-keyed role spec
SPEC-v1:481 says *"compile a kf group to native ::view-transition-* @keyframes."* p09 F1/§4.1
(p09:72-80, 159-165) shows an `AnimationGroup`/`Sequence` **has no old/new/group axis** — VT's model
is per-`view-transition-name` roles. The emitter input is `Record<name, {old?, new?, group?,
class?}>` (p09:202-208); the bare-group overload can survive only as sugar behind a role callback.
**SPEC-v2 edit:** replace "compile a kf group" with the `VTRoleSpec` role-keyed shape (p09:201-224).

### 1.2 The group pseudo is a THIRD, timing-only, MANDATORY-by-default emission surface
This is p09's one genuinely-new design *fact* (p09:82-90, 166-169), and SPEC-v1 misses it entirely
("::view-transition-* @keyframes" reads old/new only). In live Chromium run 1 (p09:56-65), emitting
only old/new left `::view-transition-group(scene)` on the UA default **250ms/ease** while the
cross-tracks ran the emitted 350ms spring — a **temporally incoherent transition** (geometry lands
100ms early). Run 2 (p09:66-68) is the cure: the emitter MUST also emit
`::view-transition-group(name) { animation-duration; animation-timing-function }` with **NO
`@keyframes`** (the UA's dynamically-generated rect-morph keyframes ARE the free zero-runtime FLIP;
overriding `animation-name` there forfeits it). **SPEC-v2 edit:** F1 must state the three surfaces
and mark the group timing-only emission mandatory-by-default. Omitting this is not a nicety — it
ships the run-1 incoherence.

### 1.3 The refusal taxonomy is under-specified — four VT-specific reasons, named
Q9's success criterion is "a refusal taxonomy drafted" (SPEC-v1:761). p09 F5 (p09:113-132) drafts it
atop the inherited four: **`vt-scroll-grammar`** (a child with `scrollOptions` — `animation-timeline`
on a VT pseudo is undefined; REFUSE), **`vt-element-scoped-computed`** (element-scoped `var()`/`cq*`
don't reach the root-hung pseudo tree; narrower than `computed-unit-drift`), **`vt-snapshot-
inapplicable`** (layout/content properties on replaced-content snapshots do nothing; REFUSE
per-property, never silent-drop), **`vt-name-collision`** (the ≤1-element-per-name platform rule —
the `backward.ts:391-396` de-dup must become a REFUSAL here, not a silent rename). **SPEC-v2 edit:**
list the four in F1's gate clause ("refusals enumerated" → these named four).

### 1.4 Zone home + surface wiring — RULED by p09, absent from SPEC-v1
p09 §4 (p09:173-179) rules: **NO new zone.** `compile/view-transition.ts` (compileToCSS's sibling
over the same `format.ts`/backward substrate) + LIGHT `orchestration/view-transition/` dispatch.
Public: `compileToViewTransition` on `loadAnimationEngine()` + the `./engine` static mirror
(`engine/public.ts:130`); `viewTransition` on the LIGHT static barrel. This is genuine
idiomatic-gestalt fit (axis 1: it lands *exactly* where the scroll grammar's EMIT half landed,
`backward.ts:328-341` — not a band-aid). **SPEC-v2 edit:** name the two files + the two surface
entries in F1; add the `proof:published-surface` LIGHT-set/HEAVY-key co-edit + the `./engine`
mirror equality to F1's "gates affected" (p09:260-265).

### 1.5 VT-b: the selector-seam carve is a distinct, gate-neutral sub-step SPEC-v1 hides
p09 VT-b (p09:232-234) isolates the ONE behavior-neutral prerequisite: parameterize the rule
selector at `backward.ts:339` (thread a selector-factory through `compileChild`; `.class` stays
default) so `.name` → `::view-transition-old(name)` etc. This must NOT perturb
`proof:compile-replay`/`compile-deterministic`. **SPEC-v2 edit:** decompose F1 into VT-a (LIGHT
dispatch, S) / VT-b (selector carve, XS) / VT-c (emitter, M — the anchor + born-RED gate) / VT-d
(demo+narrative, S) per p09:229-248 — the current single-bullet F1 hides a 12-14-file wave (p09:252).

---

## 2. Gate honesty (axis 2) — would these gates catch the R residue / are they runtime-honest?

### 2.1 F1's gate as-written is the device-dependence trap the tranche exists to cure (D1 — MANDATORY)
SPEC-v1:483-484: *"an emitted VT stylesheet replays visually equivalent to the flipShared baseline
in a live browser."* A "visually equivalent … replays" oracle is a **pixel/timing-race assertion on
the slow Linux runner** — the exact failure catalogued in r8 / MEMORY (device-dependence greening;
absolute frame/ms thresholds red on Linux, green on macOS). p09 VT-c (p09:238-244) gives the honest
form and it is device-INDEPENDENT: **structural `getAnimations()` assertions** (emitted
names/durations/`linear()` drive the old/new pseudos; the group carries the emitted duration; pseudo
identities via `effect.pseudoElement`) **plus ONE settled-state rect-tolerance clause** for Q9's
visual-equivalence *letter* — no per-frame pixel race (p09:104-107, 242-244). This IS runtime-tier
and T1-compliant (it opens the dist and actuates a real browser). But SPEC-v1's literal phrasing is
not; it would flake exactly as K→R gates flaked. **SPEC-v2 edit:** rewrite F1's gate to the
structural-`getAnimations()` + single-settled-rect-tolerance form; name it `proof:vt-roundtrip`,
library-correctness tier, structural-only.

### 2.2 F5's single gate does NOT cover three of its own named deliverables (D3 — MANDATORY)
SPEC-v1:498-504 packs SEVEN items into F5, but the gate (`:503-504`) covers only three:
`proof:zero-alloc` mixed-leaf clause, taxonomy budgeted floors, Typed-OM verdict-recorded. The
other four have **no born-RED clause**:
- **WAAPI multi-segment densify → single `linear()`** (`:500-501`, a32) — this is a genuine *feature*
  (compositor-eligibility for multi-segment easings), not a hygiene tweak, and it ships un-gated.
  There is a `proof:waapi-adaptive-densify` in the roster (package.json) — F5 must state whether it
  extends it or ships a new clause. Un-named = T4 laundering risk (a deliverable with no re-run-green
  oracle).
- **`bench/resolve.bench.ts`** (887L zone, zero coverage — a26) — adding a bench is not self-gating;
  it needs a taxonomy row + a `proof:bench-taxonomy`/`proof:bench-runs` coverage clause or it rots.
- **static-vs-dynamic cold-import bench** (a26) — same; ties naturally to `proof:consume-bundle`.

**SPEC-v2 edit:** split F5 into F5a (zero-alloc completion: boxedKeys-Set + mixed-leaf clause +
colorTail/replace-arm budgeted ratios — one coherent perf-alloc wave, gate = the mixed-leaf
`proof:zero-alloc` clause born-RED + taxonomy floors), F5b (bench-coverage: resolve.bench +
cold-import bench, gate = `proof:bench-taxonomy` coverage extended, born-RED on the missing rows),
and F5c (Typed-OM + WAAPI-densify — the two *feature/verdict* items, each with its own gate). One
gate per closeable unit is T4's letter.

### 2.3 F6's byte-count claim is not covered by its stated gate
SPEC-v1:505-508 gates F6 on `proof:readme-runs` — which *executes README snippets*, it does not
verify that a stated "X kB light-entry vs Motion 2.3kB" number is TRUE. A prose byte count is not a
runnable snippet; it can rot silently (the r5 "info" claim, r5 findings 7/9). **SPEC-v2 edit:** tie
the measured byte-count claim to `proof:consume-bundle` (which measures the LIGHT edge), not
`readme-runs`. Minor, but it is the same "claim with no runtime oracle" pattern the tranche condemns.

### 2.4 Gates that ARE honest (credit)
- F3 (`:492-493`) and F4 (`:496`) both gate on a **live-browser actuation** ("drives a display:none
  entry natively in a live Chromium"; "round-trips grammar→behavior … browser-actuated") — runtime-
  tier, falsifiable, T1-compliant in kind.
- F1's `proof:vt-roundtrip` (once rewritten per 2.1) is the strongest gate in the band: the probe's
  Playwright oracle is directly reusable (p09:238-244), and it is device-independent by construction.

---

## 3. Open design questions (axis 4/5 — not mechanically absorbable)

### 3.1 F5 Typed-OM ADOPT/KILL is an unbudgeted fork with no prototype (D2 — BLOCKING)
SPEC-v1:499-500 asks for a "Typed-OM write-path ADOPT/KILL on a real-browser bench" and a "verdict
recorded terminally" (`:504`). But: (a) **no prototype ran** — the prototype fleet (p01-p12) has no
Typed-OM probe; the only near-neighbor, p02, is the PlaybackState FSM (B-band). (b) `grep` confirms
**zero Typed-OM surface exists in src** — ADOPT is a *from-scratch write-path rewrite* (replace the
CSS-string setter path with `attributeStyleMap.set(prop, CSSNumericValue)` across the hot render
loop), which is unbounded and would touch the same hot path a32 warns about. (c) The spec pre-books
neither the ADOPT contingency scope nor the bench threshold that decides it. "Record a verdict" is a
*research decision*, not an implementable wave — the failure mode is a wave that closes GREEN having
merely written a paragraph, or one that balloons into a render-path rewrite. **SPEC-v2 edit:**
pre-book it: *default = KILL-with-recorded-measurement* (a bench that shows Typed-OM's per-set cost
≥ string-set on the target browsers → documented non-adoption, one line + the bench artifact); ADOPT
fires ONLY if a pre-stated write-throughput threshold is beaten, and if so it is a SEPARATE authored
wave, not folded into F5. This mirrors Q9's own FAILURE-branch discipline (SPEC-v1:762).

### 3.2 F3 `@starting-style` emits a DIFFERENT output grammar than compileToCSS knows (D4 — BLOCKING)
SPEC-v1:490-491 says *"compileToCSS + an authoring helper emit @starting-style +
transition-behavior:allow-discrete."* But `compile/backward.ts` is a **`@keyframes` + `animation`
shorthand** compiler (the selector at `:339` emits `animation:…`). `@starting-style` is a
**transition** primitive — it supplies starting values for `transition-behavior: allow-discrete`
(the display:none→block couplet r5 finding 4 names). That is `transition-property` /
`transition-behavior` / `@starting-style` — a distinct CSS mechanism, NOT the keyframes substrate.
**No prototype validated that compileToCSS can express a transition-mode output**, and the emitter
home is unruled — is it a `backward.ts` branch, or (parallel to p09's VT ruling) a new
`compile/entry.ts` sibling over `format.ts`? p09 proved the VT case is byte-reusable *because* VT
rides the same `@keyframes`; F3 has NO such proof and the substrate visibly differs. **SPEC-v2
edit:** rule the F3 emitter home explicitly, and either (a) demote F3 to DEVELOP-only pending a Q9-
style hand-compile prototype of the `@starting-style`/transition output, or (b) state the new
`compile/entry.ts` sibling + its refusal semantics ("refusal recorded elsewhere" at `:493` is
currently a dangling pointer — name the home). This is the band's second-largest unabsorbed risk
after Typed-OM.

### 3.3 F2 line-splitting layout-dependence + the "AT-tree assertion" mechanism are unspecified (D5)
SPEC-v1:486-489 (r5: "grapheme/word/line split") gates on "fragments animate … with the pre-split
accessible name preserved (AT-tree assertion)." Two gaps: (a) **line splitting is the hard,
font/layout-measurement-dependent case** (getClientRects per visual line, reflow on resize) — it is
precisely what GSAP's 2025 rewrite centered on, and the spec hand-waves it; word/grapheme are easy,
line is an open sub-question (does kf measure lines, or refuse `by:"line"` under
container-query/resize instability?). (b) The **"AT-tree assertion" gate mechanism is unnamed** —
the honest form is a computed-accessible-name equality (`aria-label` on the container + `aria-hidden`
on fragments → the computed name equals the original string, asserted via a browser a11y query, per
T8's interaction-axis mandate). **SPEC-v2 edit:** state the line-split posture (measure-or-refuse)
and the accessible-name-equality gate mechanism (browser-actuated, not source-shape — T8).

---

## 4. Idiomatic-gestalt check (axis 1) — band-aid vs transposition

- **F1: transposition, not band-aid (credit).** p09 proves the emitter is a selector-projection over
  the EXISTING per-child compile (p09:72-80) — it reuses `keyframesBlock`/`animationShorthand`/the
  oklab densify byte-for-byte and lands in `compile/` beside `compileToCSS`. This is the owner-binding
  precept honored: no new pipeline, no parallel string-builder. Zone home is the same slot the scroll
  EMIT half occupies. Clean.
- **F5 boxedKeys-Set: transposition (credit).** Precompute the `new Set(only)` at
  `buildSoAPlans` (`group/soa.ts:236`) into `SoALayerPlan` — kills the per-frame alloc at its source
  (a32 F3, `compositor.ts:182`), not a suppress-the-symptom patch. Idiomatic.
- **F5 as a wave: band-aid-by-bundling.** Seven unrelated items (alloc, Typed-OM research, WAAPI
  feature, two benches, colorTail ratios) behind one gate is itself the anti-pattern — it lets the
  weak items (Typed-OM) hide behind the strong ones (boxedKeys) at close. The split in §2.2 is the
  gestalt fix.
- **F3: unresolved (see 3.2)** — cannot certify gestalt until the emitter home is ruled.

---

## 5. Cost/DAG honesty (axis 3)

- **F1 cost is HONEST and now measured.** p09:250-275: ~12-14 files, risk low-medium, substrate
  proven (ran unmodified against dist; browser accepted output verbatim). SPEC-v1's DAG deps
  `B2/B3, A0` (`:485`) are correct (compile must be sub-zoned first; A0 keystone). **SPEC-v2 edit:**
  absorb the VT-a..VT-d sizing (p09:229-248) so F1 is not costed as one atom.
- **F5 dep `B2/B4` (`:504`, `:590`) is right** for the SoA/compositor items, but the Typed-OM and
  WAAPI-densify items have NO B-dep and NO prototype — the DAG understates F5's risk by treating it
  as one B-gated node. The §2.2 split surfaces this.
- **F3 dep `B3` (`:493`)** assumes compileToCSS is the home — false until 3.2 is ruled; the dep may
  need to point at a new compile sibling.
- **F4 dep "B-zone stable" (`:497`)** is vague (not a named wave) — tighten to the specific B wave
  that freezes `scroll/scene.ts`'s takeover surface.

---

## 6. Prune / recorded-future (axis 6)

- **Prune from F5:** the Typed-OM item, if the pre-booked default (3.1) is KILL, collapses to "run
  one bench, record the number, one doc line" — not a perf-frontier wave. Do not let it inflate the
  band's SOTA-perf headline.
- **Recorded-future, correctly (credit):** SPEC-v1:476-478 already parks anchor-positioned motion,
  Lottie/Theatre→compileToCSS, Rive. r5 finding 6 confirms anchor is low-demand and the Lottie
  importer is a separate charter. No over-reach here — this is the correct scope discipline.
- **F6 is genuinely near-zero-code** and correctly sequenced last (deps F1-F4 text final, `:508`) —
  keep, but re-home the byte-count gate (§2.3).

---

## 7. Deductions (explicit) → convergence 52%

| # | Deduction | Type | Pts |
|---|-----------|------|-----|
| D1 | F1 gate "visually equivalent … replays in a live browser" is device-dependent — the exact Linux-runner flake the tranche cures; must be rewritten to structural `getAnimations()` + one settled-rect clause (p09:238-244) | gate not-runtime-honest-as-written | −10 |
| D2 | F5 Typed-OM ADOPT/KILL — open design question, ZERO prototype, no existing seam (`grep`=0), ADOPT fork unbounded, no pre-booked contingency | open design Q | −10 |
| D3 | F5 kitchen-sink — WAAPI multi-segment densify (a feature), resolve.bench, cold-import bench are named deliverables with NO born-RED clause; one gate ≠ one gate per closeable unit (T4) | missing gate coverage | −10 |
| D4 | F3 `@starting-style`/allow-discrete is a transition+starting-style output grammar distinct from compileToCSS's `@keyframes` substrate; no prototype, home unruled | open design Q | −10 |
| D5 | F2 line-split layout/font-dependence unaddressed (measure-or-refuse) + "AT-tree assertion" gate mechanism unnamed (accessible-name equality, browser-actuated per T8) | missing evidence-demanded detail | −8 |

The F1 probe *adjustments* (§1.1-1.5) are NOT separately deducted — p09 supplied the exact API
shape and wave decomposition, so they are mechanically absorbable — but they are all BLOCKING edits
(without §1.2 alone, F1 ships the run-1 250ms/ease incoherence, a correctness bug). Base 100 − 48 =
**52%**.

---

## 8. BLOCKING edits for SPEC-v2 (mandatory before impl authorization)

1. **F1 input model:** replace "compile a kf group" with the name-keyed `VTRoleSpec`
   (`Record<name,{old?,new?,group?,class?}>`) as the primary shape; bare-group is sugar (p09:201-224).
2. **F1 group surface:** state the THREE emission surfaces and mark `::view-transition-group(name)`
   timing-only (duration + timing-function, NEVER `animation-name`) as mandatory-by-default — omitting
   it ships the observed 250ms/ease incoherence (p09:82-90).
3. **F1 refusals:** enumerate the four VT-specific reasons — `vt-scroll-grammar`,
   `vt-element-scoped-computed`, `vt-snapshot-inapplicable`, `vt-name-collision` (p09:113-132).
4. **F1 zone/surface + carve:** name `compile/view-transition.ts` + `orchestration/view-transition/`;
   add `compileToViewTransition` (`./engine` mirror) + `viewTransition` (LIGHT barrel); add the VT-b
   selector-factory carve at `backward.ts:339`; add the `published-surface`/`./engine`-mirror
   co-edits; decompose F1 into VT-a..VT-d (p09:173-179, 229-265).
5. **F1 gate:** rewrite to `proof:vt-roundtrip` — structural `getAnimations()` assertions
   (names/durations/`linear()`/pseudo-identity) + ONE settled-state rect-tolerance clause; NO
   per-frame pixel/ms threshold (device-independence — r8 lesson, p09:242-244).
6. **F5 split:** into F5a (zero-alloc: boxedKeys-Set + mixed-leaf clause + colorTail/replace-arm
   ratios), F5b (bench coverage: resolve.bench + cold-import, gated via `proof:bench-taxonomy`
   coverage rows), F5c (Typed-OM + WAAPI-densify features) — one born-RED gate per unit.
7. **F5 Typed-OM:** pre-book the verdict — default KILL-with-recorded-bench-measurement; ADOPT fires
   only above a pre-stated write-throughput threshold and, if so, as a SEPARATE authored wave.
8. **F5 WAAPI densify:** state whether it extends `proof:waapi-adaptive-densify` or ships a new
   born-RED clause (no un-gated feature).
9. **F3 home ruling:** rule the `@starting-style`/transition emitter home (compileToCSS branch vs new
   `compile/entry.ts` sibling) and either demote F3 to DEVELOP-only pending a Q9-style hand-compile
   prototype, or state the new sibling + its refusal home ("refusal recorded elsewhere" is a dangling
   pointer at `:493`).
10. **F2:** state the line-split posture (measure-or-refuse under resize/container instability) and
    make the a11y gate a browser-actuated accessible-name-equality assertion (T8), not a source-shape
    check.
11. **F6:** re-home the measured byte-count claim onto `proof:consume-bundle`, not `readme-runs`.
