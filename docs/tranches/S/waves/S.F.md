# S.F — SOTA uplift: animation library

> **This is a TRANCHE-DEVELOPMENT phase, NOT implementation.** This document is the
> wave-spec for band **S.F** of Tranche S, transcribed with zero load-bearing loss from the
> converged **SPEC-v3** (`docs/tranches/S/audit/pass1/SPEC-v3.md`, 1,833 lines — the standalone
> source of truth). Every gate definition, co-edit set, DAG edge, cost estimate, born-RED clause,
> ruling reference, refusal-taxonomy entry, and fold-row this band carries is reproduced here; an
> implementer must NOT need to read SPEC-v3. Nothing runs until the owner authorizes an impl drive.
> A wave is CLOSED only when its born-RED gate is GREEN **re-run on the merged tree** (T4, inv-16),
> and S.Z2 re-executes that oracle at close. **Branch:** `tranche-s-dev` · **Track:** lib.

---

## 0. Band charter — SOTA uplift that compiles back to zero-runtime CSS

S.F is the band where S **lifts the library to the mid-2026 platform frontier** — View Transitions,
SplitText, `@starting-style`/`allow-discrete`, `animation-trigger` — in the one way no peer can
match: **every uplift compiles back to zero-runtime, current-spec CSS through the round-trip engine
(r5)** (SPEC §1, §3 S.F).

**Selection rule (r5, SPEC §3 S.F preamble).** Only primitives whose kf version is **structurally
better because the round-trip engine compiles them back to zero-runtime, current-spec CSS** are
in-scope. **S-scoped:** View Transitions, SplitText, `@starting-style`/`allow-discrete` (PROMOTED to
the EN wave-set at Pass-2 — C-22), `animation-trigger`. **Recorded-future (§8):** anchor-positioned
motion, Lottie/Theatre→`compileToCSS` importer, Rive — these are NOT S-scoped and are booked forward,
not silently dropped.

### The tier reconciliation note — browser-actuating library-value gates (SPEC §3 S.F preamble, p08 coherence)

The band ships gates that carry **library-value severity** but must **open a browser to actuate**:
`proof:vt-roundtrip` (S.F1), `proof:entry-roundtrip` (S.F3/EN-c), and — as the upstream dependency
homed in S.B3 — the **EN-a browser-parse clause**. **These enroll in the browser-harness
(demo-correctness) chain**, and **their library-value severity is recorded in their taxonomy rows.**

This is the p08 **symmetric mis-tier clause working as designed, NOT an exception to it**: under
S.A4's three-tier taxonomy (library-correctness / demo-correctness / hygiene), a
`proof:library-correctness` member's script must NOT carry browser-harness anchors. Placing
`proof:vt-roundtrip` / `proof:entry-roundtrip` / the EN-a clause in `proof:library-correctness` would
**correctly RED** under that symmetric clause — the clause firing on a browser-anchored gate mis-filed
into the library-correctness tier. So they live in the demo-correctness (browser-harness) chain with a
taxonomy-row severity annotation, and that placement is the honest home. **Do not "promote" these
gates to `proof:library-correctness` to reflect their severity** — the tier is defined by harness, the
severity by the taxonomy row; the two are orthogonal by S.A4's construction.

### The band's dependency posture — B-band frozen surfaces (SPEC §3 DAG)

Every S.F wave rides a B-band-frozen library surface. The DAG edges are load-bearing (not "B-zone
stable" hand-waving — each names the specific B wave that freezes the surface it builds on):

```
S.B2/B3 ──► S.F1                                          (VT-c re-targets backward.ts:339 + rides compileToCSS per-child)
S.B3 (carrying EN-a + EN-b) ──► S.F3/EN-c ──► EN-d        (EN-c is UNSHIPPABLE on today's serializeEasing — C-25)
S.B4        ──► S.F4                                       (B4 freezes scroll/scene.ts's takeover surface)
S.B2/B4     ──► S.F5a / S.F5b / S.F5c                      (compositor + SoA + engine surfaces frozen)
S.B1        ──► S.F2                                       (constants seam / LIGHT boundary frozen)
S.F1 / S.F2 / S.F4 text final ──► S.F6                     (narrative rides the shipped feature text)
```

**The C-25 DAG edge is the band's spine.** EN-a and EN-b — the two P2-2-discovered
**library-correctness bugs on the shipped `@keyframes` surface** — are **homed in S.B3, NOT in
S.F** (same-file cohesion, honesty-first sequencing; S.B.md is their authoritative home). F3's EN-c
anchor **cannot ship** until B3 lands them, because EN-c projects entry endpoints through the
EN-a-fixed `serializeEasing` and the EN-b substrate (`declaredKeyframeBodyFor`). §Appendix D below
carries the EN-a/EN-b context an F3 implementer needs, and points to S.B.md/S.B3 as the home.

### Rulings this band executes (SPEC §2.2)

- **C-10 — colorTail benches → budgeted device-independent ratios in S.F5a; NO raw absolute fps
  anywhere in the plan.** Observe-only was correct at Q's measure-first moment but insufficient for
  S's SOTA-perf claims. **No raw absolute fps threshold may be a CI closure anywhere in the
  plan** — the rule stands plan-wide (its former S.E application is moot since the 2026-07-03
  shelf; no S.E waves exist). **S.F5a owns the colorTail
  budgeted-ratio conversion.**
- **C-13 — speculative LIGHT exports forced to a decision inside S, no carry.** The
  `reseatToSpring`-vs-`decayRest` **bench lands in S.F5a** (the bench half); the **Oscillator
  build-or-strip decision lands in S.G2** (the ONE decision wave — se-B7; that half is NOT in this
  band). Fold row 56 is aligned across the two.
- **C-22 (REVISED at Pass-2) — the F3 emitter: home CONFIRMED, substrate ADJUSTED, wave PROMOTED
  (P2-2).** `@starting-style` + `transition-behavior: allow-discrete` is a **transition-grammar
  output**, distinct from `compileToCSS`'s `@keyframes` substrate. P2-2 executed the hand-compile
  live: **`compile/entry.ts` is CONFIRMED as the home**, but as a **`format.ts`-substrate SIBLING
  projecting from the DECLARED ENDPOINTS** (`declaredKeyframeBodyFor` for the first/last stop bodies;
  easing via the EN-a twin-fixed `serializeEasing`) — **NOT a post-transform over the `compileToCSS`
  artifact** (refuted by the EN-b mixed-track bug; unlike p09's VT emitter, which re-targets the SAME
  blocks, the entry emitter shares the substrate, not the artifact). **F3 is PROMOTED from
  DEVELOP-only to the authored EN-a..EN-d wave-set.** Refusals live on `compile/entry.ts`'s own
  `CompiledEntryCSS.refusals` channel with `EntryRefusalReason` = 3 inherited + 6 entry-specific —
  `perceptual-oklab` explicitly **INVERTS** to the narrower `entry-color-space` (native Oklab is a
  feature of this surface, not a refusal).
- **C-25 (NEW, Pass-2) — EN-a and EN-b are homed in S.B3, not in S.F.** The two P2-2-discovered
  defects are library-correctness bugs on the shipped `@keyframes` surface, **independent of F3**.
  **DAG edge, stated: `S.B3 (carrying EN-a + EN-b) ──► S.F3/EN-c ──► EN-d`.** Consequence outside
  this band: S.B3's former "delete dead `declaredKeyframeBodyFor`" item is **REVERSED** — a18 F3's
  "likely-dead" call is overturned by P2-2 (F1/F5); the export is the load-bearing substrate EN-b
  threads and EN-c projects from (fold row 58 updated). **S.F carries EN-c + EN-d; S.B3 carries
  EN-a + EN-b.**

### Precepts this band operationalizes (SPEC §7)

- **T4 (DEVELOPED ≠ SHIPPED).** Every wave ships a born-RED gate (or, for the plan's publish-coupled
  external edge — the S.H4 gates — born-SPECIFIED; it does not live in this band)
  that is GREEN only re-run on the merged tree; S.Z2 re-executes at close. Development-only.
- **T6 (no cosmetic excision).** Where a wave inverts or retires a refusal (the `perceptual-oklab`
  inversion in EN-c), the change deletes the stale refusal path and its narration, not just its
  citation.
- **T7 (gate follows code — including its fixtures and coverage set).** S.F5b's new benches enroll
  in `proof:bench-taxonomy` (a bench without a taxonomy row rots). The EN-a/EN-b emit-change T7
  fixture co-edits (`proof:compile-replay` / `proof:compile-deterministic`) are in **S.B3's** blast
  radius — a C-25 sequencing reason for homing them there (SPEC §2.2 C-25 (iii)).
- **T8 (interaction-axis / browser-actuated acceptance for hand-rolled + platform-parity
  primitives).** S.F1's `proof:vt-roundtrip`, S.F2's computed-accessible-name-equality gate, S.F3's
  `proof:entry-roundtrip`, and S.F4's browser-actuated trigger round-trip are all
  **browser-actuated**, not source-shape; live verification via chrome-devtools-mcp per stage.
- **T10 (clean close).** Every S.F gate appears in the FINAL closeable roster (C-21).
- **T12 (external gates are named, not assumed).** **S.F introduces ZERO external consume-edges.**
  The plan's only external motion is the single external SPINE (S.H4's parse-that 1.0.0 cut →
  value.js's 2.0.x `^1.0.0`-carrying follow-on → the kf re-pin+consume at S.C4/S2 — owner rulings
  3+5+6; the former glass-ui edge left at the 2026-07-03 S.E shelf), and no leg of it is in this band.
  Every S.F gate is **internally closable** on the kf tree.
- **§2.1-5 — no numeric line count is a born-RED gate's GREEN criterion.** File-size figures in this
  band (`compile/entry.ts` ~250–300L, etc.) are **observed tripwires**, never gate oracles.

**Mode declarations (C-14, one per wave).** **S.F1 REWRITE (additive) · S.F2 REWRITE (additive) ·
S.F3 REWRITE (additive) · S.F4 REWRITE (additive) · S.F5a REFINE · S.F5b REFINE · S.F5c MEASURE +
additive · S.F6 REFINE.** "Additive" marks a wave that ADDS a new primitive/surface without mutating
a behavior-preserving zone; the REFINE/MEASURE waves advance perf floors and settle verdicts without
adding a shipped feature (except F5c's gated WAAPI densify extension).

---

## S.F1 — View Transitions (the flagship)

**Mode: REWRITE (additive).** **Deps: B2/B3, A0.** **Cost: ~12–14 files (measured, p09).**
*(SPEC §3 S.F1; §2.1-12; C-14; SF-1..SF-5; p09 adjusts — fully absorbed.)*

### Charter

Ship kf-hosted View Transitions whose emitted CSS is **zero-runtime, current-spec** — the round-trip
engine compiles a name-keyed role spec to `@keyframes` + the three VT emission surfaces. **The VT
emitter is REAL and thin (p09, live Chromium 149):** the existing `compileToCSS` per-child pipeline is
**byte-reusable**; the only hardcoded piece is the rule selector at `backward.ts:339` (SPEC §2.1-12).
**Q9's FAILURE branch (demote to dispatch-only) is DEAD** (SPEC §2.1-12). Decomposed per p09 into
four sub-waves (VT-a..VT-d).

### Scope items — the four sub-waves (p09)

- **VT-a — LIGHT dispatch (S).** `orchestration/view-transition/` — `viewTransition(mutate, opts)`
  returning a **normalized `ViewTransitionHandle`** (`backend: "view-transition" | "flip" |
  "immediate"`, **queryable**). Feature-detects `startViewTransition` / the types-arg; **falls back
  to `flipShared` pairs**; **PRM routes through the ONE `withReducedMotion` gate** (mutate directly,
  settle). **jsdom tests exercise the fallback + immediate paths.** This is the LIGHT-tier entry
  (value.js-free); it sits on the LIGHT barrel.

- **VT-b — the compile-seam carve (XS).** **Parameterize the ONE hardcoded rule selector at
  `backward.ts:339`** via a **selector-factory threaded through `compileChild`** (`.class` stays the
  default). **Behavior-neutral:** `proof:compile-replay` / `proof:compile-deterministic` stay green
  **untouched** (the default selector reproduces today's output byte-for-byte).

- **VT-c — the emitter (M — the anchor).** `compile/view-transition.ts` (~250–300L).
  - **Input model (p09 §4.1) — the name-keyed role spec is PRIMARY (SF-1):**
    `compileToViewTransition(spec: Record<name, VTRoleSpec>, opts)` with
    `VTRoleSpec = { old?, new?, group?, class? }`. **A bare group/Sequence has no old/new axis** and
    survives **only as sugar behind a role callback** — the group-as-primary reading is REJECTED
    (a group has no old/new axis; SPEC §2.1-12).
  - **THREE emission surfaces, group mandatory-by-default (SF-2, §2.1-12):**
    1. `old`/`new` get **full kf `@keyframes` + shorthand**;
    2. `::view-transition-group(name)` gets a **timing-only** override (**duration +
       timing-function, NEVER `animation-name`** — the UA's dynamically-generated rect-morph
       keyframes ARE the free zero-runtime FLIP);
    3. **omitting the group emission ships the observed 250ms/ease temporal incoherence** — so the
       group pseudo is a **third, timing-only, MANDATORY-by-default emission surface** (SPEC §2.1-12).
  - **Class-cohort branch** for **uniform** cohorts (staggered cohorts emit **per-NAME** rules —
    materialized delays can't ride one class rule).
  - **Cross-doc preamble opt-in:** `@view-transition { navigation: auto }`.
  - **PRM block appended by default:** `animation: none`.

  **The four VT refusals, ENUMERATED (p09 F5; SF-3) — atop the inherited four:**
  | Refusal | Fires when | Behavior |
  |---|---|---|
  | `vt-scroll-grammar` | scrollOptions on a VT pseudo (undefined semantics) | REFUSE |
  | `vt-element-scoped-computed` | element-scoped `var()`/`cq*` — they don't reach the root-hung pseudo tree | REFUSE |
  | `vt-snapshot-inapplicable` | layout/content properties on replaced-content snapshots | REFUSE **per property, never silent drop** |
  | `vt-name-collision` | the ≤1-element-per-name platform rule violated | **a REFUSAL, not a silent rename** |

  **Surface wiring (named in the wave):** `compileToViewTransition` on `loadAnimationEngine()` **+
  the `./engine` static mirror** (`engine/public.ts`, beside `compileToCSS`); **`viewTransition` on
  the LIGHT barrel**; **`proof:published-surface` LIGHT-set / HEAVY-key + `./engine`-mirror co-edits
  named in the wave.**

- **VT-d — demo + narrative (S).** The **`useSceneTransition` dogfood decision** (demo-side
  consumption; **glass-ui owns its helper** — kf does not write glass-ui); **README claims →
  `readme-runs` coverage.**

### The HARD GATE

**Gate name:** **`proof:vt-roundtrip`** — born-RED, **browser-actuating, device-INDEPENDENT**
(rewritten per SF-5 / p09).

**Gate criterion (structural — NO per-frame pixel/ms threshold):**
- **structural `getAnimations()` assertions**: the emitted names/durations/`linear()` drive the
  old/new pseudos via `effect.pseudoElement`; **the group pseudo carries the emitted duration**;
- **ONE settled-state rect-tolerance clause** for the `flipShared` visual-equivalence letter.

**The p09 Playwright script is the oracle skeleton.**

**Born-RED witness plan.** No `compile/view-transition.ts` exists today and the selector at
`backward.ts:339` is hardcoded — so `proof:vt-roundtrip` (asserting the group pseudo carries the
emitted timing via `getAnimations()`) has **no emitter to actuate → RED**. After VT-b parameterizes
the selector and VT-c ships the emitter, the browser-actuated `getAnimations()` assertions green and
the settled-state rect clause holds.

**Falsifiability (both ways).** Omitting the mandatory group-pseudo timing emission REDs the gate
(the group animation carries no emitted duration → the 250ms/ease temporal-incoherence signature p09
observed). Emitting `animation-name` on the group pseudo (instead of timing-only) REDs (it clobbers
the UA's free rect-morph). A per-frame pixel/ms threshold is FORBIDDEN as the closure (C-10 governs
the whole plan) — the gate is structural + one settled-rect tolerance clause only. VT-b regressing
`proof:compile-replay` proves the selector-factory is NOT behavior-neutral and REDs.

### Cost + DAG

~12–14 files (measured, p09): `orchestration/view-transition/` (VT-a), the `backward.ts:339`
selector-factory carve (VT-b), `compile/view-transition.ts` ~250–300L + surface wiring (VT-c), the
demo dogfood + README (VT-d). **Deps: B2/B3, A0** (B3 freezes the `compileChild`/backward seam VT-b
carves; A0 makes the browser-harness chain honest).

### Verification

`proof:vt-roundtrip` (structural `getAnimations()` + one settled-rect clause) born-RED today (no
emitter); `proof:compile-replay` / `proof:compile-deterministic` stay green through VT-b (behavior-
neutral selector default); `proof:published-surface` co-edits (LIGHT `viewTransition` + HEAVY
`compileToViewTransition` + `./engine` mirror) green. Development-only; re-run at S.Z2.

---

## S.F2 — SplitText

**Mode: REWRITE (additive).** **Deps: B1.** *(SPEC §3 S.F2; C-14; SF-10.)*

### Charter

Ship an a11y-first SplitText primitive that rides the existing engine — `splitText(el, {by, a11y})`
returning a **fragment cohort + a ready stagger**. **GSAP's 2025 rewrite is the reference bar** (SPEC
§3 S.F2). The primitive lives at `orchestration/split-text/` (LIGHT tier).

### Scope items

- **S1 — the primitive.** `orchestration/split-text/` — `splitText(el, {by, a11y})` returning a
  **fragment cohort + ready stagger**, riding the existing engine; **a11y-first.**
- **S2 — the line-split posture, STATED (SF-10): measure-or-refuse.** `by: "word" | "grapheme"` are
  **layout-independent**; `by: "line"` is **measure-or-refuse** — lines measured via
  `getClientRects` with **re-measure on resize**, and **REFUSED (typed error) under
  container-query/resize instability where re-measure cannot hold**. (A line-split that silently goes
  stale on reflow is the failure mode this posture forbids.)
- **S3 — the a11y gate mechanism, NAMED (SF-10):** a **browser-actuated computed-accessible-name
  equality** assertion — `aria-label` on the container + `aria-hidden` fragments → **the computed
  name equals the pre-split string**, queried via the **browser a11y tree** (T8), **NOT source-shape.**

### The HARD GATE

**Gate name / criterion:** fragments animate under the engine with **computed-accessible-name
equality green** (the container's computed accessible name == the original pre-split string, via the
browser a11y tree); **LIGHT boundary green** (the primitive is value.js-free and does not pull
`@mkbabb/value.js` into the LIGHT graph).

**Born-RED witness plan.** No `orchestration/split-text/` exists today → the browser-actuated
accessible-name-equality assertion has no split container to query → RED. After S1/S3 land, the
post-split container exposes `aria-label` == the pre-split string with `aria-hidden` fragments, and
the a11y-tree query greens; the fragments animate under the engine stagger.

**Falsifiability (both ways).** A split that shatters the accessible name (per-fragment text exposed
to the a11y tree without `aria-label` consolidation) REDs the computed-name-equality assertion —
proving the gate is a11y-real, not source-shape. A `by:"line"` split under container-query instability
that does NOT refuse (emits stale line rects on reflow) violates the measure-or-refuse posture. Pulling
`value.js` into the primitive REDs the LIGHT boundary.

### Cost + DAG

`orchestration/split-text/` (the `splitText` primitive + the measure-or-refuse line-split path + the
typed refusal error) + jsdom/browser a11y-tree test harness. **Deps: B1** (the LIGHT boundary /
constants seam must be frozen so the LIGHT-tier primitive lands clean).

### Verification

Fragments animate under the engine; browser-actuated accessible-name equality green; LIGHT boundary
green; `by:"line"` refuses (typed error) under container-query/resize instability. Development-only;
born-RED (no primitive today); re-run at S.Z2.

---

## S.F3 — Modern entry/exit compilation (EN-c + EN-d) — PROMOTED at Pass-2

**Mode: REWRITE (additive).** **Deps: B3 (carrying EN-a + EN-b — the C-25 DAG edge; EN-c is
unshippable on today's `serializeEasing`); EN-c → EN-d.**
*(SPEC §3 S.F3; §2.1-15; C-22 revised; C-25; SF-9; P2-2.1/P2-2.2/P2-2.3/P2-2.4; fold rows 58/73/74.)*

### Charter

Ship kf-hosted `@starting-style` + `transition-behavior: allow-discrete` entry/exit compilation.
**PROMOTED at Pass-2: P2-2 executed the hand-compile live (Chromium 149) and the SUCCESS branch
fired** — SPEC-v1's demote-to-DEVELOP-only clause is **discharged** (SF-9). A hand-compiled
`@starting-style` artifact drove a native `display:none → block` entry (the `@starting-style` values
ARE the observed t=0 style; the kf spring `linear()` matched the stop-lerp to 6 decimals) AND a
display-held exit (mid-exit computed `display: block`, flip at transition end; `overlay` held in the
top layer for popovers). **The FAILURE branch is DEAD for the two-endpoint class** (SPEC §2.1-15).

**The binding substrate ruling (C-22 revised / P2-2.1):** the emitter is a **declared-endpoint
projection over the `format.ts` substrate** (first/last stop bodies via `declaredKeyframeBodyFor`;
easing via the **EN-a twin-fixed** `serializeEasing`) — **NOT a post-transform over the
`compileToCSS` artifact** (refuted live by attempt A: the compiled artifact came out color-only and
16-stop; unlike p09's VT emitter which re-targets the SAME blocks, the entry emitter shares the
**substrate**, not the artifact).

**The two pre-req correctness fixes EN-a and EN-b are homed in S.B3 per C-25** (§Appendix D carries
their context; S.B.md/S.B3 is the authoritative home). **F3 comprises EN-c + EN-d.**

### EN-c — the anchor (M, ~12 files)

**Scope: `compile/entry.ts` (~250–300L), `compileToCSS`'s sibling.**

**The three-rule grammar (P2-2 F2 — the WHOLE output shape):**
1. **base/closed rule** = exit's last frame + `display: none` + the **EXIT** transition list;
2. **open rule** = enter's last frame + the open `display` + the **ENTRY** transition list;
3. **`@starting-style { <open selector> { enter's FIRST frame } }`.**

**Grammar facts (P2-2, proven live):**
- Transitions read the **after-change style's** `transition-*`, so **asymmetric entry/exit
  duration+easing ride the two lists** (proven: **350ms spring entry / 250ms bezier exit**).
- `display <dur> allow-discrete` + `overlay <dur> allow-discrete` **ride BOTH lists** (they are
  EXIT-load-bearing); **`overlay` emits UNCONDITIONALLY** — it materializes only for top-layer
  elements and is **inert-but-harmless elsewhere** (proven S1/S3 vs S7).
- `linear()` springs **ride transitions verbatim** (stop-lerp fidelity to 6 decimals).
- **Color: `oklab()` endpoint canonicalization** — CSS Color 4 interpolates non-legacy colors in
  **Oklab by default**, so kf's default perceptual space ships **natively with NO densify and ZERO
  intermediate stops** (the `perceptual-oklab` refusal **INVERTS to a feature** on this surface).

**API contract (P2-2):**
```
compileToEntry(spec: Record<selector, EntryRoleSpec>, opts): CompiledEntryCSS

EntryRoleSpec       = { enter?, exit? }         // 2-stop each; exit defaults to enter-reversed
EntryCompileOptions = {
  openSelector?  : ".open" | "[data-open]" | ":popover-open" | "[open]",
  display?       : <css-display>,
  overlay?       : boolean   // default TRUE
  printWidth?    : number
}
CompiledEntryCSS    = { …, refusals: EntryRefusal[] }
```

**The refusal taxonomy — `EntryRefusalReason` = 3 inherited + 6 entry-specific (P2-2.3):**

*3 inherited:*
| Reason | Fires when |
|---|---|
| `custom-renderer` | a non-DOM-style renderer is in play |
| `weighted-blend` | weighted layer blending (no transition twin) |
| `computed-unit-drift` | `var()`/`calc()`/`vh` endpoints that don't ride verbatim (otherwise they DO ride verbatim) |

*6 entry-specific:*
| Reason | Fires when |
|---|---|
| `entry-multi-keyframe` | **>2 declared stops** — a transition is a two-endpoint grammar |
| `entry-iteration` | `iterationCount ≠ 1` or alternate directions. **`reverse` is an endpoint-swap branch, NOT a refusal;** **`fillMode` is absorbed entirely — the two rules ARE the rest states** |
| `entry-composition` | `add`/`accumulate` — no transition twin; **never silently flatten** |
| `entry-scroll-grammar` | scroll grammar on the entry surface |
| `entry-color-space` | `oklch` or a non-default `hueMethod` — **transitions expose no interpolation-space control** (this is the narrower successor to the INVERTED `perceptual-oklab` — native Oklab is a feature; only non-default spaces refuse) |
| `entry-easing-twin` | **no faithful CSS twin** — with the **`linear()` densify of the callable as the universal PRE-refusal remedy** |

**Surface wiring:** `load-engine.ts` + `engine/public.ts` (the `./engine` mirror) +
`docs/published-surface.md` row + README.

### The HARD GATE (EN-c)

**Gate name:** **`proof:entry-roundtrip`** — born-RED, **browser-actuating** (enrolled in the
demo-correctness browser-harness chain per the band tier note). **P2-2's `live.mjs` IS the oracle
skeleton.** **Scrub-based structural assertions only — ZERO frame/ms races.**

**The S1–S7 clause map (P2-2):**
| Clause | Asserts |
|---|---|
| **S1** | entry transitions exist with the emitted duration/`linear()`; **scrub-0 equals the `@starting-style` endpoint** |
| **S2** | control: **without `@starting-style` → ZERO transitions** |
| **S4** | control: **without `allow-discrete` → instant vanish** |
| **S3** | mid-exit computed `display` **HELD `block`**; **post-finish `none`** |
| **S7** | top-layer **`overlay` hold** |

**Gate/doc semantics (P2-2 F7 / P2-2.4):**
- **born-open elements RUN the entry at first render** (a platform semantic — **documented +
  demo-stated**; escape hatch = **not matching the open selector at initial render**, or a documented
  **`.kf-no-initial` guard**);
- **entry `display` (`none → block`) produces NO CSSTransition** — **gate assertions target the EXIT
  hold only** (S3/S7);
- **`overlay` emits unconditionally** (top-layer-only materialization, inert elsewhere — S1/S3 vs S7);
- **Degrade-honest** where `transition-behavior` is unsupported (**snap-entry, correct end state**).

**Born-RED witness plan.** No `compile/entry.ts` exists today; and even the substrate is
browser-dead until EN-a lands (`serializeEasing` emits registry names → `animation-name: none`) — so
`proof:entry-roundtrip`'s S1 (entry transitions with the emitted duration/`linear()`) has nothing to
actuate → RED. After **B3 lands EN-a+EN-b** and EN-c ships `compileToEntry`, the browser-actuated
S1–S7 scrub assertions green.

**Falsifiability (both ways).** Emitting the entry without `@starting-style` REDs S2's control clause
(transitions appear where the control expects zero). Dropping `overlay` from the exit list REDs S7's
top-layer hold. Building EN-c as a **post-transform over `compileToCSS`** (the refuted attempt A)
produces a color-only 16-stop artifact that fails S1's declared-endpoint scrub-0 equality — the
substrate ruling is falsifiable. A >2-stop entry that does NOT raise `entry-multi-keyframe`, or an
`add`/`accumulate` entry that silently flattens instead of raising `entry-composition`, violates the
refusal taxonomy.

### EN-d — the demo + narrative twin (S, ~2–3 files)

**Scope:** the **demo dialog/popover entry-exit pane** riding the compiled artifact (the natural
S.F6 narrative twin) + **README claims → `proof:readme-runs`.**

**Gate:** `proof:readme-runs` covers the EN-d README entry/exit snippets (they execute against the
shipped `compileToEntry`). **Deps: EN-c → EN-d** (the demo pane rides EN-c's compiled artifact).

**Born-RED witness plan.** No demo entry/exit pane exists today; README carries no runnable
entry-compile snippet → `proof:readme-runs` has no snippet to execute for this feature. After EN-c
ships and EN-d authors the pane + README claims, `readme-runs` executes them green.

### Cost + DAG (whole F3 / EN wave-set)

**Total ≈ 20–22 files across the four EN waves** (incl. **B3's two — EN-a + EN-b**). EN-c ≈ 12 files
(`compile/entry.ts` ~250–300L + surface wiring + gate); EN-d ≈ 2–3 files. **Risk low-medium** — both
genuinely new behaviors were exercised by the probe against the **UNMODIFIED dist**. **Deps: B3
(carries EN-a + EN-b — C-25 DAG edge); EN-c → EN-d.**

### Verification

`proof:entry-roundtrip` (S1–S7 scrub-based structural clauses, browser-actuated) born-RED today (no
emitter; substrate browser-dead pre-EN-a); `proof:readme-runs` covers the EN-d snippets;
`proof:published-surface` co-edit (HEAVY `compileToEntry` + `./engine` mirror + `published-surface.md`
row). Development-only; re-run at S.Z2. **DEV boundary:** F3 is unshippable until S.B3 lands EN-a/EN-b
(the C-25 DAG edge is load-bearing, not advisory).

---

## S.F4 — Drive animation-trigger

**Mode: REWRITE (additive).** **Deps: B4** (the named wave that freezes `scroll/scene.ts`'s takeover
surface — replaces v1's vague "B-zone stable"). *(SPEC §3 S.F4; C-14; r5.)*

### Charter

Realize the **already-parsed** `animation-trigger` grammar in the JS driver: **`scroll/scene.ts`
realizes the trigger grammar** (idle→active→done; backward/repeat) — **native where Chrome 145+
ships, kf `ScrollScene` everywhere else** (r5). The grammar is already parsed; F4 wires it to
behavior.

### Scope items

- **S1 — realize the grammar in the driver.** `scroll/scene.ts` realizes the idle→active→done
  state machine (+ backward/repeat) over the already-parsed trigger grammar.
- **S2 — native/fallback split.** Native `animation-trigger` where **Chrome 145+** ships it; **kf
  `ScrollScene` everywhere else** (the cross-browser zero-peer story — r5).

### The HARD GATE

**Gate name / criterion:** **a trigger round-trips grammar→behavior in the JS driver**
(**browser-actuated** — T8). The parsed trigger grammar drives the observed idle→active→done
transitions in the `ScrollScene` driver.

**Born-RED witness plan.** `scroll/scene.ts` does not yet realize the trigger grammar → a
grammar→behavior round-trip test has no driver behavior to actuate → RED. After S1/S2, the
browser-actuated driver transitions through idle→active→done (+ backward/repeat) as the grammar
declares, greening the round-trip.

**Falsifiability (both ways).** A parsed trigger whose declared idle→active→done sequence does NOT
produce the corresponding driver state transitions REDs the round-trip. A raw absolute fps threshold
is FORBIDDEN as the closure (C-10) — the gate asserts the grammar→behavior mapping, not a frame rate.

### Cost + DAG

`scroll/scene.ts` trigger-grammar realization (idle→active→done + backward/repeat) + the
native/fallback branch. **Deps: B4** (B4 freezes `scroll/scene.ts`'s takeover surface — the named
frozen dependency, not "B-zone stable").

### Verification

A trigger round-trips grammar→behavior in the JS driver (browser-actuated). Development-only; born-RED
(the driver does not realize the grammar today); re-run at S.Z2.

---

## S.F5a — Zero-alloc completion + budgeted perf floors

**Mode: REFINE.** **Deps: B2/B4.** *(SPEC §3 S.F5a; C-10; C-13 (bench half); SF-6; fold rows 42/56;
a32 F3; a04 F6.)*

### Charter

Complete the zero-alloc story at its source and **replace observe-only benches with budgeted
device-independent floors** (the SOTA-perf claims must be floored, not merely observed). This is the
wave that discharges C-10's colorTail conversion and C-13's `reseatToSpring`-vs-`decayRest` bench
half.

### Scope items

- **S1 — precompute `boxedKeys` as a Set on `SoALayerPlan` (a32 F3).** At `buildSoAPlans`
  (`group/soa.ts:236`) — this **kills the per-frame `new Set(only)` at `compositor.ts:182` at its
  source** (the allocation is hoisted to plan-build time).
- **S2 — extend `proof:zero-alloc` to the mixed-leaf shape (a32 F3, a04 F6).** The gate covers the
  mixed-leaf allocation shape (born-RED today — the per-frame `new Set` is live).
- **S3 — colorTail → budgeted device-independent ratios (C-10; fold row 42).** Convert the **6
  colorTail arms + the compositor replace-arm** from observe-only to **budgeted device-independent
  ratios** (Q's observe-only was correct at the measure-first moment; insufficient for S's SOTA
  claims). **No raw absolute fps threshold** (C-10 governs the plan).
- **S4 — the `reseatToSpring` vs `decayRest` bench (C-13's bench half; fold row 56).** **Bench
  `reseatToSpring` against the current `decayRest`** and **wire the winner OR record the measured
  reason it stays.** (The Oscillator build-or-strip half of C-13 is S.G2's, not this wave's.)

### The HARD GATE

**Gate name / criterion:** **`proof:zero-alloc` mixed-leaf clause born-RED today**; the **taxonomy
budgeted floors hold** (the colorTail arms + the compositor replace-arm carry budgeted
device-independent ratios, not observe-only rows).

**Born-RED witness plan.** Today the per-frame `new Set(only)` at `compositor.ts:182` allocates on
the mixed-leaf shape → the extended `proof:zero-alloc` mixed-leaf clause REDs. After S1 hoists
`boxedKeys` to `buildSoAPlans`, the per-frame allocation is gone and the clause greens. The colorTail
arms are observe-only today (unfloored) → the budgeted-ratio floors are born-RED until S3 converts
them.

**Falsifiability (both ways).** Re-introducing a per-frame `new Set` on the mixed-leaf path REDs the
zero-alloc clause. A colorTail arm that regresses past its budgeted device-independent ratio REDs the
taxonomy floor. A raw absolute fps number as the floor is FORBIDDEN (C-10) — the ratio must be
device-independent.

### Cost + DAG

The `boxedKeys` Set hoist at `group/soa.ts:236` + the `proof:zero-alloc` mixed-leaf extension + the
6 colorTail arms + compositor replace-arm budgeted-ratio conversion + the `reseatToSpring`/`decayRest`
bench + wire-or-record. **Deps: B2/B4** (the compositor + SoA + engine surfaces must be frozen).

### Verification

`proof:zero-alloc` mixed-leaf clause born-RED today → GREEN post-hoist; taxonomy budgeted floors hold
(no raw fps); the `reseatToSpring`/`decayRest` bench wired-or-recorded. Development-only; re-run at
S.Z2.

---

## S.F5b — Bench coverage

**Mode: REFINE.** **Deps: B2/B4.** *(SPEC §3 S.F5b; SF-6; fold row 45; a26.)*

### Charter

Close the bench-coverage gap on the zero-coverage `resolve/` zone and the static-vs-dynamic
cold-import edge, with the coverage enforced by a **born-RED taxonomy clause** (a bench without a
taxonomy row rots — sf-#6).

### Scope items

- **S1 — add `bench/resolve.bench.ts` (fold row 45).** The `resolve/` zone is **887L with zero bench
  coverage** — add the bench.
- **S2 — add the static-vs-dynamic cold-import bench (a26).** Ties to `proof:consume-bundle` (the
  LIGHT-edge measurement).

### The HARD GATE

**Gate name / criterion:** **`proof:bench-taxonomy` coverage rows extended — born-RED on the missing
rows** (sf-#6). A bench without a taxonomy row rots; the gate REDs while a covered-zone bench lacks
its taxonomy row.

**Born-RED witness plan.** Today `resolve/` has zero bench coverage and no taxonomy row for it → the
extended `proof:bench-taxonomy` coverage row for `resolve/` is born-RED. After S1/S2 add the benches
and their taxonomy rows, the gate greens.

**Falsifiability (both ways).** Adding a bench without its taxonomy row REDs (the anti-rot clause).
Removing the `resolve/` bench while its taxonomy row remains REDs (the row points at nothing).

### Cost + DAG

`bench/resolve.bench.ts` + the cold-import static-vs-dynamic bench + the `proof:bench-taxonomy`
coverage-row extension (tied to `proof:consume-bundle`). **Deps: B2/B4.**

### Verification

`proof:bench-taxonomy` coverage rows extended and green (the `resolve/` + cold-import benches carry
taxonomy rows). Development-only; born-RED (the missing rows); re-run at S.Z2.

---

## S.F5c — Typed-OM verdict + WAAPI densify (the feature/verdict pair, each gated)

**Mode: MEASURE + additive.** **Deps: B2/B4.** *(SPEC §3 S.F5c; SF-7; SF-8; fold rows 43/44; §8-11.)*

### Charter

Settle two long-deferred items, **each with its own gate**: the Typed-OM adopt/kill **verdict**
(pre-booked default KILL-with-recorded-bench) and the WAAPI multi-segment densify **feature**
(shipped as an extension of the existing gate). Neither may close as a bare "decided" — the verdict
carries its bench artifact; the feature carries a born-RED gate clause.

### Scope items

- **S1 — Typed-OM, pre-booked (SF-7; fold row 43; §8-11).** **grep confirms ZERO Typed-OM surface in
  src and no prototype exists** — the **default verdict is KILL-with-recorded-bench-measurement**
  (**one real-browser bench: Typed-OM per-set cost vs the string-set path**; the artifact + one doc
  line close it). **ADOPT fires ONLY if a pre-stated write-throughput threshold is beaten**, and
  **then as a SEPARATE authored wave** (never folded here — the render-path rewrite is unbounded).
- **S2 — WAAPI multi-segment densify → single `linear()` (SF-8; fold row 44).** Ships as an
  **extension of the existing `proof:waapi-adaptive-densify`** with a **new born-RED clause** (the
  multi-segment case is **refused today → eligible after**; sf-#8 — no un-gated feature).

### The HARD GATE

**Gate name / criterion:**
- the **WAAPI densify clause born-RED** (the multi-segment case refused today, eligible after — a new
  clause on `proof:waapi-adaptive-densify`, per SF-8's RULING that it EXTENDS the existing gate rather
  than adding a new one);
- the **Typed-OM verdict recorded terminally with its bench artifact** (the one real-browser
  per-set-cost bench + one doc line — a terminal record, not an observe-in-CI carry).

**Born-RED witness plan.** Today `proof:waapi-adaptive-densify` REFUSES the multi-segment case → the
new densify clause is born-RED (the multi-segment artifact is ineligible). After S2 ships the single-
`linear()` densify, the clause greens (the multi-segment case becomes eligible). The Typed-OM verdict
is open today → it closes only when the bench artifact + doc line land.

**Falsifiability (both ways).** A multi-segment WAAPI case that stays refused after S2 REDs the new
clause. A Typed-OM verdict that closes WITHOUT its recorded bench artifact is not terminal (C-20:
observe/decide without a witness is not a terminal) — the verdict must carry the measurement. ADOPT
folded into THIS wave (instead of a separate authored wave) is the forbidden shape — the render-path
rewrite is unbounded.

### Cost + DAG

The Typed-OM real-browser per-set-cost bench + the doc-line verdict + the `proof:waapi-adaptive-
densify` densify-clause extension (the multi-segment `linear()` densify). **Deps: B2/B4.**

### Verification

The WAAPI densify clause born-RED (multi-segment refused today) → GREEN after; the Typed-OM verdict
recorded terminally with its bench artifact (default KILL-with-recorded-bench; ADOPT only above the
pre-stated threshold as a separate wave). Development-only; re-run at S.Z2.

---

## S.F6 — Narrative (near-zero code)

**Mode: REFINE.** **Deps: F1/F2/F4 text final.** *(SPEC §3 S.F6; SF-10; r5.)*

### Charter

Market the emerging-CSS resolver **honestly** and floor the light-entry byte-count claim on the gate
that actually measures it. Near-zero code — this is the narrative-truth wave over the shipped feature
text.

### Scope items

- **S1 — market the emerging-CSS resolver honestly (r5).** **kf animates `if()`/`@function`/`env()`
  cross-browser today; the platform is Chromium-only** — stated honestly, no over-claim. Add the
  **dated WebKit-`linear()` re-check note** in `eligibility.ts`.
- **S2 — the byte-count claim rides the RIGHT gate (SF-10).** The **measured light-entry byte-count
  claim rides `proof:consume-bundle`** (which measures the LIGHT edge), **NOT `readme-runs`** (which
  executes snippets and **cannot verify a prose kB number**). `readme-runs` covers the executable
  claims; `consume-bundle` carries the byte floor.

### The HARD GATE

**Gate name / criterion:** **`proof:readme-runs` covers the executable claims; `proof:consume-bundle`
carries the byte floor.** (The two-gate split is the SF-10 correction: prose kB numbers belong on the
bundle-measuring gate, not the snippet-executing gate.)

**Born-RED witness plan.** The light-entry byte-count claim is unfloored today (or floored on the
wrong gate) → `proof:consume-bundle`'s byte floor for the LIGHT edge is the born-RED anchor until the
claim is verified against the measured edge. The executable resolver snippets green under
`readme-runs` once the honest narrative lands.

**Falsifiability (both ways).** Putting the prose kB byte-count claim on `readme-runs` (which cannot
verify a number) is the forbidden shape SF-10 corrects. A light-entry byte regression past the
`consume-bundle` floor REDs. An over-claim ("cross-browser emerging-CSS platform" without the
Chromium-only caveat) contradicts the honest-narrative posture.

### Cost + DAG

Near-zero code: the honest resolver narrative + the dated WebKit-`linear()` re-check note in
`eligibility.ts` + the byte-count-claim gate re-home (`consume-bundle`, not `readme-runs`). **Deps:
F1/F2/F4 text final** (the narrative rides the shipped feature text).

### Verification

`proof:readme-runs` covers the executable claims; `proof:consume-bundle` carries the byte floor; the
emerging-CSS resolver marketed honestly (Chromium-only platform stated; dated WebKit re-check note).
Development-only; re-run at S.Z2.

---

## Appendix A — Fold rows this band owns (SPEC §4, verbatim dispositions)

Every §4 chronic/deferral fold row whose S-disposition names an S.F wave, restated so an implementer
need not consult SPEC-v3. **"Terminal" uses C-20's structural definition** (a deterministic re-shaped
gate or an owner-ratified KILL with a re-run witness — never observe-in-CI / WATCH / a re-verify
verb); every disposition is re-derived from a locally-reproduced signature at impl, never inherited
from the table (SPEC §4 header).

| # | Item | Born | Chronicity | S-disposition |
|---|------|------|-----------|---------------|
| 42 | 6 colorTail benches observe-only (SOTA claims unfloored) | Q.WB3 | 1 | **WAVE S.F5a** (budgeted device-independent ratios) |
| 43 | Typed-OM adopt/kill undecided | P | 3 | **WAVE S.F5c** (pre-booked default KILL-with-recorded-bench; ADOPT only above a pre-stated threshold, as a separate wave) |
| 44 | WAAPI multi-segment densify unshipped | P | 3 | **WAVE S.F5c** (extends proof:waapi-adaptive-densify with a born-RED clause) |
| 45 | resolve/ zone zero bench coverage | P–Q | 2 | **WAVE S.F5b** (gated via proof:bench-taxonomy rows) |
| 56 | Oscillator fictional demo claim; reseatToSpring unconsumed | L–P | 3 | **WAVE S.G2 (the ONE decision wave — C-13 pinned, se-B7) + S.F5a (the bench)** — *S.F owns only the F5a `reseatToSpring`/`decayRest` bench half; the Oscillator build-or-strip decision is S.G2's* |

**Fold row 58 (S.B3-owned; carried here as F3 substrate context — NOT owned by this band):**

| # | Item | Born | Chronicity | S-disposition |
|---|------|------|-----------|---------------|
| 58 | declaredKeyframeBodyFor "dead export" | Q | 1 | **WAVE S.B3 — REVERSED at Pass-2** (a18 F3 overturned by P2-2 F1/F5: the export is the EN-b/**EN-c** load-bearing substrate; constructed, not deleted) — *EN-c (this band) projects the entry endpoints from it; the export's home is S.B3* |

---

## Appendix B — Critique disposition rows (SPEC §9 sf-sota-animation, 10 edits)

The band's traceability to the critique fleet — every sf-sota-animation blocking edit and its
absorption site (SPEC §9). All ABSORBED; none DISPUTED.

| # | Edit | Absorbed at |
|---|------|-------------|
| SF-1 | Replace "compile a kf group" with the name-keyed VTRoleSpec as the primary shape (bare group = sugar) | **ABSORBED** §3 S.F1 VT-c — this doc S.F1 (Input model) |
| SF-2 | State the THREE emission surfaces; ::view-transition-group(name) timing-only (never animation-name), mandatory-by-default | **ABSORBED** §3 S.F1 VT-c, §2.1-12 — this doc S.F1 (three surfaces) |
| SF-3 | Enumerate the four VT refusals (vt-scroll-grammar / vt-element-scoped-computed / vt-snapshot-inapplicable / vt-name-collision) | **ABSORBED** §3 S.F1 VT-c — this doc S.F1 (refusal table) |
| SF-4 | Name compile/view-transition.ts + orchestration/view-transition/ + the two surface entries + the VT-b selector carve at backward.ts:339; decompose into VT-a..VT-d | **ABSORBED** §3 S.F1 (four sub-waves + surface wiring + co-edits) — this doc S.F1 |
| SF-5 | Rewrite F1's gate to proof:vt-roundtrip — structural getAnimations() + ONE settled-rect clause; no per-frame pixel/ms threshold | **ABSORBED** §3 S.F1 (gate) — this doc S.F1 (HARD GATE) |
| SF-6 | Split F5 into F5a/F5b/F5c — one born-RED gate per closeable unit | **ABSORBED** §3 S.F5a/b/c — this doc S.F5a/S.F5b/S.F5c |
| SF-7 | Pre-book Typed-OM: default KILL-with-recorded-bench; ADOPT only above a pre-stated threshold, as a separate wave | **ABSORBED** §3 S.F5c, fold row 43, §8-11 — this doc S.F5c/S1 |
| SF-8 | State the WAAPI densify gate home (extends proof:waapi-adaptive-densify or a new clause) | **ABSORBED** §3 S.F5c (RULED: extends the existing gate with a born-RED clause), fold row 44 — this doc S.F5c/S2 |
| SF-9 | Rule the F3 emitter home (compile/entry.ts sibling) and demote to DEVELOP-only pending a hand-compile prototype; fix the dangling refusal pointer | **ABSORBED** C-22, §3 S.F3, §6.2 P2-2 — *the demote clause is now DISCHARGED: P2-2 executed and F3 PROMOTED (Pass-2 addendum P2-2.1)* — this doc S.F3 |
| SF-10 | F2: line-split posture (measure-or-refuse) + browser-actuated accessible-name-equality gate; F6: byte-count claim → proof:consume-bundle | **ABSORBED** §3 S.F2 + §3 S.F6 — this doc S.F2/S.F6 |

**Pass-2 addendum absorption (SPEC §9 Pass-2 — P2-2, the entry emitter; the parts this band carries):**

| # | Adjustment | Absorbed at (this band) |
|---|------------|-------------------------|
| P2-2.1 | Substrate ruling: the emitter projects from DECLARED ENDPOINTS (`declaredKeyframeBodyFor` + twin-fixed `serializeEasing`) as a `format.ts` sibling — NOT a `compileToCSS` post-transform; `compile/entry.ts` home CONFIRMED; F3 PROMOTES from DEVELOP-only to the EN wave-set | **ABSORBED** C-22 (revised), §3 S.F3 (EN-c/EN-d), §2.1-15 — this doc S.F3 (Charter + substrate ruling) |
| P2-2.2 | TWO pre-existing compile bugs become named pre-req waves — EN-a (`serializeEasing` registry-name→CSS-twin; browser-parse clause) and EN-b (`compileChild` whole-block densify swap; `bodyByStop`; mixed-artifact clause) | **ABSORBED** C-25 (**HOMED IN S.B3** — the C-25 DAG edge `S.B3 → EN-c` stated), fold rows 73/74; the a18-F3 `declaredKeyframeBodyFor` deletion REVERSED (fold row 58) — this doc §Appendix D + S.F3 (Deps) |
| P2-2.3 | Refusals: `CompiledEntryCSS.refusals` with `EntryRefusalReason` = 3 inherited + 6 entry-specific; `perceptual-oklab` does NOT carry over — native Oklab is a feature (no densify, zero stops) | **ABSORBED** §3 S.F3 EN-c (the 9-reason taxonomy + the inversion), C-22, §2.1-15 — this doc S.F3 (refusal taxonomy) |
| P2-2.4 | Gate/doc semantics: born-open elements run the entry at first render (escape hatch named); entry `display` produces NO CSSTransition (gate asserts the EXIT hold only); `overlay` emits unconditionally | **ABSORBED** §3 S.F3 EN-c (gate/doc semantics; `proof:entry-roundtrip`'s S1–S7 clause map) — this doc S.F3 (S1–S7 + gate/doc semantics) |

**Probe-adjustment absorption touching S.F (SPEC §9 probe index):** **p09 → S.F1** (role spec; three
surfaces; refusals; structural gate; VT-a..d). **P2-2 → S.F3** (entry emitter — adjusts-spec; SUCCESS
branch fired; substrate ruling; the 9-reason refusal taxonomy + the Oklab inversion; the S1–S7 gate
clause map; the two pre-req bugs → S.B3). Supplementary P2-2 carries: the API contract
(`compileToEntry`/`EntryRoleSpec`/`EntryCompileOptions`) → §3 S.F3 EN-c; the `transition-behavior`
support-skew **degrade-honest** posture → §3 S.F3 EN-c; the **browser-gate tier reconciliation with
p08's symmetric mis-tier clause → §3 S.F band preamble** (this doc §0 tier note).

---

## Appendix C — DEV→IMPL boundary (binding for every S.F wave)

Every wave above is **DEVELOPMENT ONLY** (SPEC §1 "What S is NOT"). Each ships a falsifiable
**born-RED gate** (plan-wide, the only born-SPECIFIED exception is the publish-coupled external
edge — the S.H4 gates — which does not live in this band); nothing runs
until the owner authorizes an impl drive (inv-16). A wave is **CLOSED
only when its born-RED gate is GREEN re-run on the merged tree** (T4, r2 F4), exit code recorded in
PROGRESS.md; **S.Z2 re-executes that oracle at close** (a re-run, not a re-read). Parallel drives
re-run every touched gate from a clean independent checkout — "pre-existing" claims are verified by
triage, never accepted (T5, a15); node_modules symlinks are never git-added.

**No raw absolute frame/ms threshold is a CI closure anywhere in this band (C-10, plan-wide).**
`proof:vt-roundtrip` is structural `getAnimations()` + ONE settled-rect tolerance; `proof:entry-
roundtrip` is scrub-based structural (S1–S7); S.F4's trigger gate asserts grammar→behavior; S.F5a's
perf floors are **budgeted device-independent ratios**, not fps numbers. **No numeric line count is a
GREEN criterion (§2.1-5)** — the `~250–300L` figures are observed tripwires.

**The band's browser-actuating library-value gates** (`proof:vt-roundtrip`, `proof:entry-roundtrip`,
and — upstream in S.B3 — the EN-a browser-parse clause) **enroll in the demo-correctness
browser-harness chain**, with their library-value severity recorded in their taxonomy rows; placing
them in `proof:library-correctness` would correctly RED under S.A4's symmetric mis-tier clause (the
clause working as designed — SPEC §3 S.F preamble; this doc §0).

**S.F introduces ZERO external consume-edges (T12).** The plan's only external motion is the single
external SPINE (S.H4's parse-that 1.0.0 cut → value.js's 2.0.x `^1.0.0`-carrying follow-on → the kf
re-pin+consume at S.C4/S2 — owner rulings 3+5+6; the former glass-ui edge left at the 2026-07-03 S.E
shelf) and no leg of it is in this band. Every S.F gate is internally closable on the kf tree.

---

## Appendix D — EN-a / EN-b context (the S.B3 dependency an F3 implementer needs)

**EN-a and EN-b are HOMED IN S.B3 (C-25) — this appendix is context, NOT the authoritative home.**
See `docs/tranches/S/waves/S.B.md` §S.B3 for the full wave-spec (charter, scope, gate, verification).
They are carried here because **F3/EN-c cannot ship until they land** — the C-25 DAG edge
`S.B3 (carrying EN-a + EN-b) ──► S.F3/EN-c ──► EN-d` is the F3 dependency spine, and EN-c projects the
entry endpoints through EN-a's fixed `serializeEasing` and EN-b's substrate.

**Both are library-correctness bugs on the SHIPPED `@keyframes` surface, independent of the F3
feature (SPEC §2.1-15, §2.2 C-25; fold rows 73/74):**

- **EN-a (XS — the `serializeEasing` CSS-twin fix; P2-2 F6; fold row 73).** `format.ts:43-58` returns
  **hyphenated registry names (`ease-out-cubic`) that are NOT CSS `<easing-function>`s** — the
  browser **drops the whole declaration** (computed `animation-name: none`), so the **shipped
  `@keyframes` artifact is browser-dead for most registry easings TODAY** (only the accidental
  `{linear, ease, easeIn/Out/InOut, stepStart/End}` subset survives). **Fix:** registry name → its
  **CSS twin** (the Penner set has closed-form `cubic-bezier()`s; the universal fallback is a
  **`linear()` densify of the callable**); throw preserved for twinless closures. **~3 files.**
  **Born-RED gate clause (browser-parse, by necessity):** a **browser-actuated parse of an emitted
  `easeOutCubic` artifact (computed `animation-name !== none`)** — the **kf-parser round-trip
  structurally CANNOT catch this** (the artifact round-trips through KF but not through the BROWSER),
  which is exactly why the clause is browser-harness and why it enrolls in the demo-correctness chain
  (the tier note, §0).
- **EN-b (S — the mixed-track densify body-drop fix; P2-2 F5; fold row 74).** `compileChild` swaps
  the **WHOLE block** for the densified one (`backward.ts:289-293`) while `densifyColorBlock` builds
  from **color declarations only** — so a mixed `opacity + transform + color` track compiles
  (eligible, zero refusals) to a `@keyframes` that animates **ONLY the color**. **Fix:** thread the
  densify through `keyframesBlock`'s **`bodyByStop`** (merge color stops WITH the declared non-color
  declarations) per `format.ts:212-222`'s own design. **~3–4 files.** **Born-RED gate clause:** a
  **mixed `opacity+color` compile artifact contains BOTH properties.**

**The reversed a18 F3 call (fold row 58):** `declaredKeyframeBodyFor` is **NOT deleted** — a18 F3's
"likely-dead" call is overturned by P2-2 (F1/F5); the export is the **load-bearing substrate EN-b
threads (via `bodyByStop`) and EN-c projects the entry endpoints from.** S.B3's former "delete dead
`declaredKeyframeBodyFor`" item is REVERSED (constructed, not deleted).

**T7 fixture co-edit (in S.B3's blast radius, a C-25 sequencing reason):** EN-a/EN-b **change existing
emit** — the `proof:compile-replay` / `proof:compile-deterministic` fixtures are co-edited in the
same commit as the fixes. This is one of the three C-25 reasons EN-a/EN-b are homed in B3 (same-file
cohesion; honesty-first sequencing; the T7 fixture co-edits already in B3's blast radius).
