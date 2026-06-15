# K.W10 — THE COMPILE (the XL anchor · the round-trip's parser run BACKWARD over the same data model: compile the orchestration graph → zero-runtime CSS, proven by replay-pixel-equality, refused honestly where it cannot be faithful)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-K (Band II · the XL
  ANCHOR; born-RED in the FRONTIER sense — NO compiler exists TODAY: `reverseAnimationShorthand`
  (the value.js RIPE primitive CC-1 consumes) is NOT consumed in kf
  (`grep -rn "reverseAnimationShorthand" src/` → **ZERO hits**, §State-verified), and no
  group/sequence/stagger → CSS walker exists. The moat is the FAITHFULNESS, not the feature: kf's
  internal model IS parsed CSS keyframes, so compiling back to CSS is the parser's INVERSE over the
  SAME data structure — `format.ts` is `keyframes.ts` run backward (`../audit/frontier/css-compiler.md
  §1`). GSAP/Motion/anime author in a bespoke tween model; "export to CSS" for them is a lossy
  re-derivation nobody ships — the structural moat no competitor can occupy.) · **Scope (a NEW
  compile module over the `format.ts` serialize lineage — DISJOINT from W7's `engine.ts` read
  path; the value.js half is SPLIT — CC-1 core RIPE, CC-2 densify VJ.W2-gated):** CC-1 compile
  `AnimationGroup`/`Sequence`/`stagger` → zero-runtime CSS (`@keyframes` + `animation-*` longhands
  + `linear()` springs + `animation-composition` layering — INVERTING W7's honoring; materialized
  stagger delays; consuming the RIPE 0.12.0 `reverseAnimationShorthand`) + CC-2 oklab densify
  (VJ.W2-gated, DISPATCHED) + CC-3 the ineligibility report (the FOUR refusals: weighted blend /
  custom renderers / perceptual oklab / computed-unit drift — `waapiIneligibleReason` generalized
  to the CSS domain) + CC-4 the "Export CSS" editor button (the CSS-animation IDE) + the
  `proof:compile-replay-equal` gate (the compiled CSS replays PIXEL-EQUAL side-by-side to the JS
  playback, or CC-3 REFUSES). ·
- **DAG-deps:** **FOLLOWS K.W7 + K.W8** (`K.md §WAVE MAP`: "K.W10 (compile, the XL anchor) follows
  W7 (inverts the honoring) + W8 (composes with ingest)"). It INVERTS W7's honoring (it EMITS the
  `animation-composition` layering W7 taught the engine to READ — a fidelity floor it must first
  HONOR before it can EMIT; a read-then-emit dependency, README §4B) and COMPOSES with W8 (K1∘CC-1
  = the full ingest→recompile loop). Runs **∥ K.W11 (physics)** — file-disjoint (W10 a new compile
  module over the `format.ts` lineage; W11 the `group.ts` blend-WEIGHT tier — README §4B "W11 and
  W10 run in parallel WITHOUT touching each other's files"). **W9's scroll grammar** optionally
  feeds CC-6 (the `@supports (animation-timeline: scroll())` PE-variant emit — BOOK). The value.js
  half is SPLIT: CC-1 core proceeds on the RIPE 0.12.0 `reverseAnimationShorthand`; CC-2 oklab
  densify born-RED-gates on the OPEN VJ.W2 `sampleColorRamp` (DISPATCHED via
  `../KF-TO-VALUEJS-GRAMMAR-ASKS.md §VJ.W2` — the source half lands born-RED, the densify consume
  edge lights on the publish).

## §Provenance (the frontier lane this wave consumes + the booked roots)

- **`../L-SEED.md §1 #1` — THE decisive frontier input (the §body→K.W10 map row).** The body-item
  map: "**CC-1 / CC-2 / CC-3 / CC-4** — the CSS COMPILER (§1 #1, the XL anchor) | compile to
  zero-runtime CSS; oklab densify (**VJ.W2-gated**); the four refusals; the 'Export CSS' button |
  **K.W10** COMPILE". The §1 TOP-3 body (`../L-SEED.md §1`): "CC-1 — the CSS COMPILER — Compile
  `AnimationGroup`/`Sequence`/`stagger` → a ZERO-RUNTIME pure-CSS artifact (@keyframes +
  animation-* longhands + linear() springs + animation-composition layering), with an honest
  ineligibility report (the four refusals … `waapiIneligibleReason` generalized to the CSS domain,
  CC-3). Structurally impossible for GSAP/Motion/anime — their tween model is not CSS, so 'export
  to CSS' is a lossy re-derivation nobody ships; kf's `format.ts` is the parser run backward over
  the same data model. … Out-expresses hand-authored CSS on oklab densify (CC-2) and eased
  origin-aware stagger. The demo's 'Export CSS' button (CC-4) makes the editor a CSS animation
  IDE. Gate: the compiled CSS replayed side-by-side vs JS playback, pixel-compared."
- **`../audit/frontier/css-compiler.md §1-§8` — the wave-ready engineering detail (the verdict
  ledger).** §1 (the decisive prior fact — half exists, the parser run backward): the
  single-animation serializer is DONE and honest (`CSSKeyframesToString` `format.ts:124-194` emits
  a complete `.class { animation-* }` block + `@keyframes` from the DECLARED template values —
  `format.ts:155`, the I.W0 S2 fix, never a DOM-resolving `at(progress)` sample, so a
  `var()`/`matrix3d()` round-trips VERBATIM); the easing→CSS path is fail-explicit
  (`serializeEasing` `format.ts:30-45` THROWS `AnimationOptionError` for a custom closure with no
  faithful CSS twin — "the ineligibility-report idiom the whole compiler generalizes"); the
  spring→`linear()` compiler is done (`springLinearStops.ts:46-73`); the eligibility-report
  pattern is proven at the WAAPI seam (`isWAAPIEligible` `waapi.ts:98-208` returns `{ eligible,
  reason }`); the parse path already captures the layering metadata (`adapter.ts:107-133` — the
  composition map W7 honors). "The structural asymmetry the lane exploits: kf's input is a string
  of CSS and its internal frame model is the parsed form of CSS keyframes. So 'compile back to
  CSS' is the parser's inverse over the SAME data structure — `format.ts` is literally
  `keyframes.ts` run backward. … This is the moat." §2 (the compilable core — the platform
  threshold): `linear()` Baseline Widely Available 2026-06-11; `animation-composition` Baseline
  2026-01-04; `@property` Baseline. §3 (the four named refusals + the stagger novelty): §3a
  `weighted` blend has NO CSS twin (REFUSE — `BlendMode` `replace|add|weighted` `constants.ts:196`
  vs CSS `replace|add|accumulate`; the `weighted` arm is kf's unique axis-3, "the compiler PROVING
  axis-3's uniqueness from the other side"); §3b STAGGER (PARTIAL-COMPILE — materialize the eased
  origin-aware distribution into per-element literal `nth-child` delays via the EXISTING
  `stagger.delays(total)` `stagger.ts:167`, "expressing a curve `sibling-index()` cannot"); §3c
  PERCEPTUAL OKLAB (REFUSE-or-DEGRADE — the CC-2 densify: bake N intermediate `oklab()` stops
  sampled from kf's JS lerp, "the one place the compiler OUT-EXPRESSES naive CSS"; the proof gate
  decides which ships — ΔE pixel-compare); §3d `@starting-style` is a TRANSITION construct
  (SCOPE — emit ONLY the entry-transition leg, NOT a blanket wrapper; CC-7 KILL); §3e computed
  units — the compiler is STRICTLY BETTER than WAAPI (emit `vh`/`cqw`/`calc()` VERBATIM, CSS
  re-resolves natively — "the best target for kf's hardest unit class is CSS itself"). §4 (the
  moat — no competitor can do this). §6 (the demo gain — the editor becomes a CSS animation IDE).
  §7 (effort L-XL, the proof gate non-negotiable — pixel-compare). §8 verdict ledger: CC-1
  K-HEADLINE-CANDIDATE; CC-2/CC-3/CC-4 K-CANDIDATE; CC-5 (pre-multiply static weights) BOOK; CC-6
  (`@supports` PE variants) BOOK; CC-7 (`@starting-style` blanket) KILL; CC-8 (compile `weighted`)
  KILL.
- **`../audit/frontier/compositor-eligibility.md §1,§5` — the platform-physics ROOTS of CC-3's
  oklab + computed-unit refusals (the consumed KILLs).** The compositor lane's CE-2/CE-3 KILLs are
  the same two refusals viewed from the WAAPI side, and they PROVE the CC-3 refusals are the
  PLATFORM's boundary, not kf timidity: **CE-3 KILL** (§1 fact 2, §5) — color does NOT composite
  (paint-triggering; "compositor-offloaded perceptual color" is platform-false), so the perceptual-
  oklab axis is genuinely beyond a faithful pure-CSS twin unless CC-2 densifies under ΔE-ε; **CE-2
  KILL** (§1 facts 3-4, §5) — a registered `@property` custom rasterizes per-frame on the MAIN
  thread (`var()` substitution is Chromium #1411864, unshipped), so the computed-unit class cannot
  be offloaded. BUT the lane's crucial INVERSION carries into CC-3 (`css-compiler.md §3e` vs
  `compositor-eligibility.md §1`): the CSS COMPILER is STRICTLY BETTER than the compositor for
  computed units — it emits `vh`/`cqw`/`calc()` VERBATIM and CSS re-resolves at use, where WAAPI
  freezes to px once (`waapi.ts:14-18`). So CC-3's computed-unit refusal is the NARROW DRIFT residue
  (the rare case a unit cannot be authored-string-emitted), NOT a blanket reject of the unit class —
  "the best target for kf's hardest unit class is CSS itself." The compositor lane's lone SURVIVOR
  (CE-1, the per-property split, K-CANDIDATE) is a SEPARATE WAAPI-delegation surface, NOT this wave
  (it composes with the scroll tier, `compositor-eligibility.md §4`); this wave consumes only its
  two KILLs as the refusal-roots.
- **The value.js half (SPLIT — RIPE core + OPEN densify).** `../VALUEJS-N2-ASKS.md §2 row 12`:
  "**The RIPE-NOW edges all stand** | `reverseAnimationShorthand` (`:276`) | … KF-CC1 → CC-1 |
  unchanged from L-SEED RIPE-NOW; now one publish fresher." So CC-1's `reverseAnimationShorthand`
  consume is RIPE (shipped in 0.12.0). `../VALUEJS-N2-ASKS.md §3`: "**VJ.W1 SCROLL GRAMMAR + VJ.W2
  `sampleColorRamp`** — the two genuine L gates remain net-new … Confirmed ABSENT in 0.12.0
  (`VALUEJS-N2-ASKS.md:61,124`)." And `K.md §value.js coordination`: "**VJ.W2 PERCEPTUAL RAMP**
  (gates K.W10's CC-2): `sampleColorRamp(from,to,n,{space,hueMethod})` beside `mix.ts`, reusing
  `lerpColorValue` + `gamutMapOKLab` (MEASURE-FIRST). Confirmed ABSENT in 0.12.0." The outbound ask
  is `../KF-TO-VALUEJS-GRAMMAR-ASKS.md §VJ.W2`.
- **The booked invariant roots:** `K.md §invariant set` — the **replay-equality invariant** (Band
  II born; "compiled CSS (K.W10) replays equal side-by-side to the JS playback it emitted from
  (pixel-compared); what cannot round-trip faithfully is REFUSED with a named reason
  (`waapiIneligibleReason` generalized to the CSS domain — the four refusals), never silently
  approximated. The moat is the faithfulness; a lossy emitter forfeits it") + the **acyclic-spine
  invariant** (CC-1 RIPE; CC-2 densify born-RED-gates on the OPEN VJ.W2 — the source half lands
  born-RED, the densify consume edge lights on value.js's publish). The compiler INVERTS W7's
  honoring (`K.md §MANDATE`: "the compiler is the round-trip's parser run BACKWARD over the same
  data model, NOT a re-derived lossy emitter").

## §The state, verified (file:line / grep / version anchors)

- **NO compiler exists; `reverseAnimationShorthand` is UNCONSUMED (CONFIRMED against the tree,
  2026-06-15 — the born-RED root):** `grep -rn "reverseAnimationShorthand" src/` → **ZERO hits**
  (the §State-verified probe printed "(ZERO — reverseAnimationShorthand NOT consumed: CC-1
  born-RED)"). No group/sequence/stagger → CSS walker exists. The capability is net-new.
- **Half the compiler is SHIPPED (the parser run backward — CONFIRMED):** `CSSKeyframesToString`
  (`format.ts:124-194` region) emits a complete `.class { animation-* }` + `@keyframes` from the
  declared template; `serializeEasing` (`format.ts:30-45` region) THROWS `AnimationOptionError`
  for a custom closure (the fail-explicit ineligibility idiom); `springLinearStops`
  (`springLinearStops.ts:46-73` region) compiles a spring to `linear()`. The single-ANIMATION
  serializer is done; CC-1 extends it to the GROUP/SEQUENCE/STAGGER graph.
- **`BlendMode` is `replace|add|weighted` at constants.ts:196 (CONFIRMED — the §3a refusal root +
  HARDENING-5 HAZARD-2 drift):** `grep -n "BlendMode" src/animation/constants.ts` → `constants.ts:196
  export type BlendMode = "replace" | "add" | "weighted";`. The lane cites `:184` — DRIFTED; current
  is `:196`. CSS `animation-composition` is `replace|add|accumulate` — `weighted` has NO CSS twin
  (the load-bearing refusal CC-8 KILL / CC-3 reports).
- **`stagger.delays(total)` materializes the distribution (CONFIRMED):** the construction-time
  delay distribution (`stagger.ts` — `from: center/edges/index` + the easing reshape) materializes
  via `stagger.delays(total)`; CC-1 consumes the EXISTING public API to emit per-element literal
  `nth-child` delays (near-zero new surface for the stagger leg —
  `../audit/frontier/css-compiler.md §3b`).
- **CC-1's value.js consume is RIPE; CC-2's is OPEN (CONFIRMED):** `@mkbabb/value.js@0.12.0`
  published; `reverseAnimationShorthand` PRESENT (the §State-verified `.d.ts` grep printed
  `reverseAnimationShorthand` among `deltaEOK`/`lerpArray`); `sampleColorRamp` ABSENT (the probe
  returned nothing — VJ.W2 OPEN confirmed, registry-verified `VALUEJS-N2-ASKS.md:61`). So CC-1 core
  proceeds; CC-2 densify born-RED-gates on VJ.W2.
- **`deltaEOK` is RIPE (CONFIRMED — gates the CC-2 pixel proof):** the §State-verified `.d.ts` grep
  printed `deltaEOK` — the perceptual-distance kernel the CC-2 densify's ΔE-ε pixel proof consumes
  (`VALUEJS-N2-ASKS.md §2 row 12` KF-DELTAE → CC-2). So CC-2's PROOF kernel is RIPE even while its
  PRODUCER (`sampleColorRamp`) is OPEN — the densify gates on the producer, the proof gates on
  `deltaEOK` (already shipped).

## §Goal

Make the round-trip TOTAL in the BACKWARD direction: **kf compiles an `AnimationGroup`/`Sequence`/
`stagger` authored interactively in JS into a PURE, ZERO-RUNTIME CSS artifact — `@keyframes` blocks
+ per-element `animation-*` longhands + `animation-composition` layering + `linear()` springs +
materialized stagger delays — that a human pastes into a stylesheet and ships with ZERO kf bytes on
the page; and what it cannot compile faithfully it REFUSES with a named reason, never silently
approximated.** The compiler is the parser's INVERSE over the SAME data model — `format.ts` is
`keyframes.ts` run backward — the structural moat no competitor can occupy (their authoring object
is not CSS). The faithfulness is the moat; a lossy emitter forfeits it. Four moves + the gate:

1. **CC-1 — the compilable core (S1 — RIPE on `reverseAnimationShorthand`).** The
   GROUP/SEQUENCE/STAGGER walker emits multi-animation CSS: each child `Animation` → one
   `@keyframes` + one `animation` shorthand; the `replace`/`add` layering → `animation-composition`
   (INVERTING W7's honoring); springs → `linear()` (the SHIPPED `springLinearStops`); the eased
   origin-aware stagger → materialized per-element `nth-child` literal delays (the SHIPPED
   `stagger.delays`); computed units (`vh`/`cqw`/`calc()`) → VERBATIM (CSS re-resolves natively —
   STRICTLY BETTER than WAAPI). Consumes the RIPE 0.12.0 `reverseAnimationShorthand`.
2. **CC-2 — the oklab densify (S2 — VJ.W2-gated).** Bake the perceptual color curve into N
   intermediate `oklab()` stops sampled from kf's JS lerp (the one place the compiler OUT-EXPRESSES
   naive `@keyframes`), consuming the dispatched value.js `sampleColorRamp` — the source half lands
   born-RED, the densify consume edge lights on the publish; the ΔE-ε pixel proof (consuming the
   RIPE `deltaEOK`) decides ship-vs-refuse.
3. **CC-3 — the ineligibility report (S3 — the FOUR refusals; value.js-INDEPENDENT).** The
   `waapiIneligibleReason` idiom generalized to the CSS domain: REFUSE `weighted` blend (no CSS
   twin — proves axis-3's uniqueness), custom renderers (a closure cannot be CSS), perceptual
   oklab (where CC-2 cannot densify under ΔE-ε), and computed-unit drift (where verbatim emit would
   be wrong) — each with a typed reason. The trust surface; the refusal is marketing for the moat.
4. **CC-4 — the "Export CSS" editor button (S4 — the demo leg, rides K.W12's repaired demo).** The
   demo editor gets an Export CSS button → a pure-CSS artifact + the honest ineligibility report
   for anything that did not compile (the CSS-animation IDE — a category the field lacks).

## §Scope

- **S1 — CC-1 the compilable core (a NEW compile module over the `format.ts` lineage; RIPE).**
  Locus: a NEW `src/animation/compile.ts` (HEAVY — reached via `loadAnimationEngine()`) over the
  `format.ts` serialize lineage — DISJOINT from W7's `engine.ts` interp read path (README §4B).
  The walker: `compileToCSS(group | sequence | stagger)` → for every child animation, one
  `@keyframes` + one `animation` shorthand (extending the SHIPPED single-animation
  `CSSKeyframesToString`); the `replace`/`add` layering → `animation-composition` (INVERTING W7's
  honoring — the operator W7 taught the engine to READ is now EMITTED); springs → `linear()` (the
  SHIPPED `springLinearStops`); the eased origin-aware stagger → materialized per-element `nth-child`
  literal delays via the SHIPPED `stagger.delays(total)`; computed units VERBATIM. Consumes the
  RIPE 0.12.0 `reverseAnimationShorthand` (the `animation`-shorthand round-trip — `VALUEJS-N2-ASKS.md
  §2 row 12`). **WHY the parser run backward:** the compiler is the INVERSE of the parser over the
  SAME data model (`../audit/frontier/css-compiler.md §1`); it emits from the DECLARED template
  (`format.ts:155` — never a DOM-resolved sample), so `var()`/`matrix3d()`/`cqw` round-trip
  VERBATIM. **NO-WORKAROUND:** NOT a re-derived lossy emitter (the moat is the faithfulness —
  `K.md §MANDATE`); NOT a `sibling-index()` stagger emit (Chromium-only — the universal literal-
  delay form is the default; the `@supports (sibling-index)` PE-variant is CC-6 BOOK).
- **S2 — CC-2 the oklab densify (VJ.W2-gated; the acyclic-spine source half).** Locus: the compile
  module's color leg + the value.js `sampleColorRamp` consume. The densify: bake the perceptual
  color curve into N intermediate `oklab()` stops sampled from kf's JS lerp (`sampleColorRamp(from,
  to, n, {space, hueMethod})` — the dispatched VJ.W2 producer), so the browser's
  piecewise-linear-per-segment fill tracks kf's perceptual curve — "the one place the compiler can
  OUT-EXPRESS naive CSS" (`../audit/frontier/css-compiler.md §3c`). **WHY VJ.W2-gated:**
  `sampleColorRamp` is ABSENT in 0.12.0 (registry-verified), DISPATCHED to value.js's post-N
  tranche. **The acyclic-spine handling (BINDING):** the kf source half (the densify consumer that
  CALLS `sampleColorRamp`) lands born-RED against the recorded VJ.W2 absence — the consume edge
  born-RED-gates kf-side, NEVER a `file:` link and NEVER a vendored copy of `sampleColorRamp`; the
  edge lights when value.js publishes. **MEASURE-FIRST (the ship-vs-refuse decision):** the densify
  ships ONLY if the N-stop emit pixel-matches kf's JS oklab lerp under ΔE-ε (consuming the RIPE
  `deltaEOK` — `VALUEJS-N2-ASKS.md §2 row 12`); else CC-3 REFUSES with the perceptual-oklab reason;
  the stop-count N is chosen by the same densification bench `WAAPI_SUBSEGMENT_STOPS` already
  justifies. **NO-WORKAROUND:** the densify is GATED on the ΔE pixel proof (it ships only where
  faithful), NOT an unconditional bake (a drifting densify is worse than an honest refusal); the
  `sampleColorRamp` consume is PUBLISHED, NEVER `file:`/vendored.
- **S3 — CC-3 the ineligibility report (the FOUR refusals; value.js-INDEPENDENT).** Locus: the
  compile module's refusal surface, generalizing `waapiIneligibleReason` (`waapi.ts:98-208`) to the
  CSS domain. The four refusals (`../audit/frontier/css-compiler.md §3`): (1) `weighted` blend —
  "weighted layer blend has no animation-composition equivalent (replace/add/accumulate only)" (the
  §3a refusal — `BlendMode` `weighted` `constants.ts:196` vs CSS `replace|add|accumulate`; CC-8 the
  direct-compile is KILLED; the refusal PROVES axis-3's uniqueness); (2) custom renderers — a custom
  `transform` closure cannot be CSS (same gate as `waapi.ts:117`); (3) perceptual oklab — where CC-2
  cannot densify under ΔE-ε (the platform ROOT: color does NOT composite and has no faithful
  `@keyframes` twin — `../audit/frontier/compositor-eligibility.md §1` CE-3, so the refusal is the
  PLATFORM's boundary, not kf timidity); (4) computed-unit drift — the NARROW residue where a unit
  cannot be authored-string-emitted (NOT a blanket reject — the compiler emits `vh`/`cqw`/`calc()`
  VERBATIM and is STRICTLY BETTER than WAAPI, `css-compiler.md §3e`; the registered-custom case that
  CANNOT round-trip is the CE-2 root, `compositor-eligibility.md §1`). **WHY the trust surface:** "a compiler is
  only as trustworthy as its refusal report" (`../audit/frontier/css-compiler.md §3`); the refusal
  is the receipt that kf's unique axes (weighted blend, perceptual color) are genuinely beyond CSS —
  "the refusal is marketing for the moat" (§6). **NO-WORKAROUND:** NO silent approximation — what
  cannot round-trip faithfully is REFUSED with a named reason (the replay-equality invariant's
  honest-refusal clause); NO `@starting-style` blanket wrapper (CC-7 KILL — `@starting-style` is a
  TRANSITION construct, emit ONLY the entry-transition leg — §3d).
- **S4 — CC-4 the "Export CSS" editor button (the demo leg; rides K.W12's repaired demo).** Locus:
  the demo editor (the `@/components` editor-shell) gains an Export CSS button → `compileToCSS` →
  a pure-CSS artifact + the CC-3 ineligibility report UI. **WHY:** the editor becomes a CSS
  animation IDE — "not a CSS generator (authors from scratch) but a CSS COMPILER (inverts a played
  animation)" (`../audit/frontier/css-compiler.md §6`); the ineligibility report TEACHES the user
  where kf's unique axes exceed pure CSS. **CROSS-WAVE (BINDING):** CC-4 touches the demo editor —
  it rides Band I's repaired demo (K.W4's re-cut panes) AND K.W12's dogfood inversion (the demo
  consumes the published barrel); CC-4 lands AFTER the demo is honest (the editor button is the
  user-facing dogfood of the round-trip axis). **NO-WORKAROUND:** the button calls the SAME
  `compileToCSS` the gate proves (no demo-local re-emit); the report UI shows the CC-3 reasons
  VERBATIM (no softened "could not compile" — the named refusal is the product value).

## §Hard gate (the proof:* that BITES — born-RED in the FRONTIER sense · the compile replay-equality oracle, backward direction)

**The oracle (per the replay-equality + acyclic-spine invariants + the gate-ORACLE precept):**
`proof:compile-replay-equal` compiles a clean input to zero-runtime CSS, replays the COMPILED CSS
side-by-side vs the JS playback, and PIXEL-COMPARES them; for every REFUSED input, CC-3 names the
reason and the JS playback is the only faithful path. "The gate is the entire point — a compiler
that drifts is worse than no compiler" (`../audit/frontier/css-compiler.md §7`). Born-RED in the
FRONTIER sense: no compiler exists (`reverseAnimationShorthand` unconsumed — the §State-verified
ZERO grep).

- **clause (a) — CC-1 a clean group compiles + replays PIXEL-EQUAL (CORRECTNESS · replay-equality
  · value.js-INDEPENDENT for the non-color core).** A clean spring + stagger + `replace`/`add`-group
  input (no `weighted`, no custom renderer, no color interp, no computed-unit drift) compiles to
  zero-runtime CSS; the compiled CSS replayed in a real browser is pixel-equal to the kf JS playback
  within ε at sampled `t` (the chrome-devtools-mcp screenshot-diff idiom). **BORN-RED WITNESS:**
  there is no `compileToCSS` to call today (`reverseAnimationShorthand` unconsumed → no walker) →
  the gate reds by construction. **BITE:** reds until S1 ships the compiler; greens when the
  zero-JS CSS artifact is visually isomorphic to the JS playback. **NO escape:** the assert is
  PIXEL-equality vs the JS playback, not a "did it emit a string" check — a lossy emit (wrong
  `animation-composition`, dropped stagger delay) reds even though it emitted CSS.
- **clause (b) — the `animation-composition` layering round-trips (CORRECTNESS · inverts W7).** A
  `replace`/`add`-layered group compiles its layering to `animation-composition: replace`/`add`;
  the compiled CSS replays the SAME layered result as the JS playback (which honors `add` post-W7).
  **WHY this proves the W7→W10 inversion:** the operator W7 taught the engine to READ is the
  operator W10 EMITS; the round-trip is faithful ONLY because the JS playback (post-W7) honored
  `add` in the first place (a compiled `add` replays equal to JS playback iff JS playback was
  itself `add` — the read-then-emit dependency). **BITE:** reds if the compiled layering drifts
  from the honored JS layering. **NO escape:** the assert is the layered pixel result, not the
  emitted keyword alone.
- **clause (c) — the FOUR refusals RED the compile (CORRECTNESS · CC-3 · value.js-INDEPENDENT).** A
  planted `weighted`-blend input → the compile REFUSES with "weighted layer blend has no
  animation-composition equivalent"; a custom-renderer input → REFUSES; a perceptual-oklab input
  that cannot densify under ΔE-ε → REFUSES; a computed-unit-drift input → REFUSES. Each refusal is
  a typed reason, and the JS playback is the only faithful path. **BORN-RED WITNESS:** a planted
  `weighted`-blend/custom-renderer/oklab input MUST force the refusal (the born-RED → green
  discipline — `../audit/frontier/css-compiler.md §7`: "a planted custom-renderer/weighted-blend/
  oklab input must RED the compile (force the refusal)"). **BITE:** reds if a refused input
  silently emits (wrong) CSS instead of refusing; the refusal is the honest-refusal clause of the
  replay-equality invariant. **NO escape:** the four refusals are NAMED reasons, never a silent
  approximation.
- **clause (d) — CC-2 the oklab densify ships-or-refuses on the ΔE proof (CORRECTNESS · value.js-GATED
  on VJ.W2 · the acyclic-spine form).** A color-interpolating animation: IF the N-stop `oklab()`
  densify (via the dispatched `sampleColorRamp`) pixel-matches kf's JS lerp under ΔE-ε (consuming
  the RIPE `deltaEOK`), the densified CSS SHIPS and replays equal; ELSE CC-3 REFUSES. **BORN-RED
  WITNESS (the acyclic-spine form):** `sampleColorRamp` is ABSENT in 0.12.0 → the densify cannot run
  → the clause REDS against the recorded born-RED (the source half lands; the densify consume edge
  is dark; CC-3's perceptual-oklab refusal is the FALLBACK until VJ.W2 publishes). **The consume
  edge LIGHTS when value.js publishes VJ.W2** — the densify clause greens on the publish, born-RED-
  gated kf-side, NEVER a `file:` link. **Until then, the wave is GREEN via the REFUSAL** (clause c's
  perceptual-oklab refusal) — color animations refuse honestly; the densify is a WIDENING that
  lights on VJ.W2, not a blocker. **BITE:** reds if a color animation silently emits a drifting
  densify (without the ΔE proof) or emits a wrong two-stop RGB lerp; greens on either the faithful
  densify (post-VJ.W2) or the honest refusal (pre-VJ.W2). **NO escape:** the densify is GATED on the
  ΔE-ε proof; the refusal is the named fallback.
- **clause (e) — CC-4 the Export button calls the gated `compileToCSS` (HYGIENE — the demo leg,
  labeled).** The editor Export CSS button calls the SAME `compileToCSS` the gate proves; the
  report UI shows the CC-3 reasons verbatim. *(Labeled HYGIENE — it corroborates the user-facing
  dogfood; the wave's GREEN depends on the replay-equality clauses (a)-(d). The button's APPEARANCE
  closes on the TASTE review packet, not green.)*

**The §spine bar — MUST bite.** Clauses (a)-(d) are the backward-direction replay-equality oracle:
the gate compiles a clean input over the BUILT `dist/keyframes.js`, replays the COMPILED CSS
side-by-side vs the JS playback, and PIXEL-compares (a); proves the `animation-composition`
inversion of W7 (b); forces the four refusals on planted inputs (c); and ships-or-refuses the oklab
densify on the ΔE proof (d). The born-RED is in the FRONTIER sense: no compiler exists
(`reverseAnimationShorthand` unconsumed). **Two-tier taxonomy:** the wave's GREEN depends on the
replay-equality correctness clauses (a)-(d); clause (e) is a HYGIENE corroborator (the demo leg).
**Replay-equality posture (declared):** this wave IS the backward half of the round-trip; its hard
gate IS the replay-equality invariant (compiled CSS replays pixel-equal to JS playback, or CC-3
refuses — `K.md §invariant set`). The moat is the faithfulness; the gate is non-negotiable.
**Acyclic-spine posture (declared — the SPLIT handling):** CC-1 core (a)/(b) + CC-3 (c) are RIPE
(`reverseAnimationShorthand` shipped) — they land and green on K.W7's substrate WITHOUT VJ.W2; CC-2
densify (d) born-RED-gates on the OPEN VJ.W2 — the source half lands born-RED, the densify consume
edge lights on value.js's publish, and UNTIL then the wave is GREEN via the honest perceptual-oklab
REFUSAL (the densify is a WIDENING, not a blocker). **K's impl never blocks on VJ.W2** — CC-1/CC-3
run regardless; only CC-2's densify waits for the publish (the same acyclic cadence value.js's
0.12.0 demonstrated — `K.md §value.js coordination`). **P6 posture (declared):** the structural
legs (the emitted CSS string structure, the four refusals, the byte round-trip) are device-
INDEPENDENT → they hard-gate on the Linux runner; the PIXEL-equality legs (a, b, d's densify proof)
need a real renderer → they run on the headed chrome-devtools-mcp tier with a per-EXPECTED predicate
(the sampled-`t` pixel diff / the ΔE-ε threshold via `deltaEOK`), NOT a fixed settle. **Budget 0**
(the gate asserts POSITIVE product properties — the compile replays equal, the refusals fire — not
an error count; CC-3's refusals are NAMED reasons, the positive honesty surface, not throws).
**value.js gate status:** SPLIT — CC-1's `reverseAnimationShorthand` RIPE (shipped 0.12.0); CC-2's
`sampleColorRamp` OPEN, DISPATCHED via `../KF-TO-VALUEJS-GRAMMAR-ASKS.md §VJ.W2`; the densify
consume edge lights on the publish, the wave green via refusal until then.

## §No-workaround prohibitions (BINDING — the mandate's named forbiddings for this wave)

- **NO re-derived lossy emitter (S1 — the moat).** The compiler is the parser run BACKWARD over
  the SAME data model — it emits from the DECLARED template (`format.ts:155`, never a DOM-resolved
  `at(progress)` sample), so `var()`/`matrix3d()`/`cqw` round-trip VERBATIM. A re-derived emitter
  that re-samples or re-computes the keyframes forfeits the moat (the faithfulness —
  `K.md §MANDATE`: "the compiler is the round-trip's parser run BACKWARD over the same data model,
  NOT a re-derived lossy emitter (the moat is the faithfulness, not the feature)").
- **NO silent approximation (S3 — the four refusals).** What cannot round-trip faithfully is
  REFUSED with a NAMED reason — `weighted` blend / custom renderers / perceptual oklab (where CC-2
  cannot densify under ΔE-ε) / computed-unit drift — never silently approximated (the replay-
  equality invariant's honest-refusal clause). CC-8 (compile `weighted` to CSS directly) is KILLED;
  the refusal is correct and PROVES axis-3's uniqueness.
- **NO `@starting-style` blanket wrapper (S1/S3 — CC-7 KILL).** `@starting-style` is a TRANSITION
  construct (an `@keyframes 0%` stop already animates from its declared start —
  `../audit/frontier/css-compiler.md §3d`); emit it ONLY for the entry-transition/FLIP leg, NOT a
  blanket wrapper on every compiled `@keyframes` (over-claiming it would be a correctness bug).
- **NO `sibling-index()` stagger emit as the default (S1 — CC-6 BOOK).** The materialized literal
  `nth-child` delays (via `stagger.delays`) are the UNIVERSAL default (Baseline everywhere, and
  expressing an eased origin-aware curve `sibling-index()` cannot — `../audit/frontier/css-compiler.md
  §3b`); the `@supports (sibling-index)` PE-variant one-liner is a flagged BOOK (Chromium-only), NOT
  the default emit.
- **NO unconditional oklab densify (S2 — gated on the ΔE proof).** CC-2 ships the densify ONLY
  where the N-stop emit pixel-matches kf's JS lerp under ΔE-ε (via `deltaEOK`); else CC-3 REFUSES.
  A drifting densify is worse than an honest refusal (the gate decides ship-vs-refuse —
  `../audit/frontier/css-compiler.md §3c`).
- **NO `file:` link or vendored `sampleColorRamp` (S2 — the acyclic-spine's named forbidding).** The
  VJ.W2 densify consume edge is a PUBLISHED consume (value.js publishes; kf consumes one tranche
  behind on the publish), NEVER a `file:` link to value.js's WIP tree and NEVER a vendored copy of
  `sampleColorRamp` (`K.md §invariant set`).

## §Folds (every K.md-assigned fold, with its frontier-lane + L-SEED/N2 citation)

- **CC-1** (the compilable core — RIPE) — S1. `../L-SEED.md §1 #1` + the §body→K.W10 map;
  `../audit/frontier/css-compiler.md §1,§2,§8` (CC-1 K-HEADLINE-CANDIDATE); `format.ts:124-194`
  (the shipped single-animation serializer the walker extends), `springLinearStops.ts` (springs →
  `linear()`), `stagger.ts` `stagger.delays` (the materialized stagger); `reverseAnimationShorthand`
  RIPE (`VALUEJS-N2-ASKS.md §2 row 12`); `src/` ZERO `reverseAnimationShorthand` (born-RED).
- **CC-2** (the oklab densify — VJ.W2-gated) — S2. `../audit/frontier/css-compiler.md §3c,§8` (CC-2
  K-CANDIDATE, MEASURE-FIRST); the value.js dispatch `../KF-TO-VALUEJS-GRAMMAR-ASKS.md §VJ.W2` (the
  OPEN gate); `deltaEOK` RIPE for the ΔE proof (`VALUEJS-N2-ASKS.md §2 row 12`); `sampleColorRamp`
  absent in 0.12.0 (born-RED, `VALUEJS-N2-ASKS.md:61`).
- **CC-3** (the four refusals — value.js-INDEPENDENT) — S3. `../audit/frontier/css-compiler.md
  §3a,§3c,§8` (CC-3 K-CANDIDATE, the trust surface); `waapi.ts:98-208 isWAAPIEligible` (the
  generalized idiom); `BlendMode` `constants.ts:196` (the `weighted` refusal root); CC-8 (compile
  `weighted`) KILL, CC-7 (`@starting-style` blanket) KILL (`../L-SEED.md §5`-adjacent / `css-compiler.md §8`).
- **CC-4** (the Export CSS button — the demo leg) — S4. `../audit/frontier/css-compiler.md §6,§8`
  (CC-4 K-CANDIDATE, the CSS-animation IDE); rides K.W4's repaired panes + K.W12's dogfood inversion.
- **CC-5 (pre-multiply static weights), CC-6 (`@supports` PE variants)** — BOOKs with named
  tripwires (`../audit/frontier/css-compiler.md §8`; CC-5 "a real partial-compile, premature";
  CC-6 "both NOT Baseline — Chromium-only; the universal literal-delay form is the default").
  RECORDED, not claimed.

## §Hand-off (the BINDING file-ownership boundary — §4B of the README, restated)

W10 follows W7 + W8, runs ∥ W11. Its loci (`waves/README.md §4B`):

- **W10 owns a NEW compile module over the `format.ts` serialize lineage — NOT `engine.ts`.** The
  compiler is the parser run BACKWARD; it does NOT edit `engine.ts`'s interp path (W7's). W7 lands
  FIRST (it LEADS Band II); W10 then INVERTS the honoring by EMITTING the `animation-composition`
  layering — a read-then-emit dependency, NOT a co-edit of `engine.ts` (README §4B: "W7 lands FIRST
  … W10 then INVERTS the honoring by EMITTING … a read-then-emit dependency, not a co-edit").
- **`group.ts` is W11's alone.** The physics blend-WEIGHT tier (W11) is file-disjoint from the W10
  compiler — "W11 and W10 run in parallel WITHOUT touching each other's files" (README §4B). The
  compiler READS `group.ts`'s `BlendMode`/layering as DATA (to emit or refuse); it does not EDIT
  `group.ts`.
- **W10 composes with W8 (the ingest→recompile loop) — a temporal compose, not a co-edit.** K1∘CC-1
  = ingest a page's `@keyframes` (W8), recompile to CSS (W10). W10 follows W8; the loop closes when
  both land.
- **`format.ts` may be touched by BOTH W9 (the scroll round-trip serialize) and W10 (the compile
  module over the lineage).** DISJOINT concerns — W9 round-trips the SCROLL declarations; W10
  compiles the GROUP/SEQUENCE/STAGGER graph. They land as separable commits, each gate reding only
  on its half.
- **The value.js consume edges are PUBLISHED consumes, NEVER `file:`/vendored** (the acyclic-spine
  invariant). CC-1's `reverseAnimationShorthand` is RIPE (consumed on the K.W1 re-pin); CC-2's
  `sampleColorRamp` born-RED-gates on VJ.W2's publish. The grammar lands in value.js's tree (its
  own repo/authorization); kf consumes one tranche behind on the publish.

## §Design-decisions (the named calls this spec makes, so the impl does not re-litigate)

- **The compiler is the parser run BACKWARD — the moat is the faithfulness.** kf's internal model
  IS parsed CSS keyframes; compiling back to CSS is the parser's inverse over the SAME data model
  (`format.ts` is `keyframes.ts` run backward). GSAP/Motion/anime cannot do this (their authoring
  object is not CSS — "export to CSS" is a lossy re-derivation nobody ships); the structural moat
  is the faithfulness, NOT the feature (`K.md §MANDATE`).
- **W10 INVERTS W7's honoring — the read-then-emit ordering is BINDING.** W7 teaches the engine to
  READ `animation-composition`; W10 EMITS it. The compile replay-equality (clause b) is provable
  ONLY because the JS playback (post-W7) honored `add` — a compiled `add` replays equal to JS
  playback iff JS playback was itself faithful. So W7 leads, W10 inverts (the replay-equality
  invariant made causal).
- **The acyclic-spine is handled by SPLITTING CC-1 (RIPE) from CC-2 (OPEN).** CC-1 core +
  CC-3 refusals land + green on K.W7's substrate (`reverseAnimationShorthand` shipped); CC-2 densify
  born-RED-gates on VJ.W2, and UNTIL value.js publishes, the wave is GREEN via the honest
  perceptual-oklab REFUSAL (the densify is a WIDENING that lights on the publish, not a blocker).
  K's impl never blocks on VJ.W2 (`K.md §value.js coordination`).
- **The four refusals PROVE the uniqueness of kf's axes from the other side.** The `weighted`-blend
  refusal is the receipt that axis-3 is genuinely beyond CSS; the perceptual-oklab refusal (where
  CC-2 cannot densify) is the receipt that axis-2 is beyond naive `@keyframes`. "The refusal is
  marketing for the moat" (`../audit/frontier/css-compiler.md §6`).
- **The line-drift is corrected (HARDENING-5 HAZARD-2).** `BlendMode` is `constants.ts:196`, NOT
  the lane's frozen `:184` — the impl re-greps current line:nums, never copies the frozen lane's.
