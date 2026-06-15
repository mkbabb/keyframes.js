# K.W10 — THE COMPILE (the XL anchor · the round-trip's parser run BACKWARD over the same data model: compile the orchestration graph → zero-runtime CSS, proven by replay-pixel-equality, refused honestly where it cannot be faithful)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-K (Band II · the XL
  ANCHOR; born-RED in the FRONTIER sense — NO compiler exists TODAY: `reverseAnimationShorthand`
  (the value.js RIPE primitive CC-1 consumes) is NOT consumed in kf
  (`grep -rn "reverseAnimationShorthand" src/` → **ZERO hits**, §State-verified), and no
  group/sequence/stagger → CSS walker exists. The moat is the FAITHFULNESS, not the feature: kf's
  internal model IS parsed CSS keyframes, so compiling back to CSS is the parser's INVERSE over the
  SAME data structure — `format.ts` is `keyframes.ts` run backward (`../../J/audit/frontier/css-compiler.md
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
- **`../../J/audit/frontier/css-compiler.md §1-§8` — the wave-ready engineering detail (the verdict
  ledger).** §1 (the decisive prior fact — half exists, the parser run backward): the
  single-animation serializer is DONE and honest (`CSSKeyframesToString` `format.ts:124-194` emits
  a complete `.class { animation-* }` block + `@keyframes` from the DECLARED template values —
  `format.ts:155`, the I.W0 S2 fix, never a DOM-resolving `at(progress)` sample, so a
  `var()`/`matrix3d()` round-trips VERBATIM) *(NOTE — the lane's `:124-194`/`:155` anchors are
  FROZEN at the lane's authoring date; the §State-verified current 2026-06-15 is `:173-220` /
  the declared-template projection at `format.ts:79` in the `format.ts:53-85` region — the impl
  re-greps, never copies the frozen lane)*; the easing→CSS path is fail-explicit
  (`serializeEasing` `format.ts:30-45` THROWS `AnimationOptionError` for a custom closure with no
  faithful CSS twin — current `:31-52`, see §State-verified — "the ineligibility-report idiom the
  whole compiler generalizes"); the
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
- **`../../J/audit/frontier/compositor-eligibility.md §1,§5` — the platform-physics ROOTS of CC-3's
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
- **The value.js half (SPLIT — RIPE 0.12.0 core + the OPEN 0.13.0-fold densify; the TWO cuts NOT
  conflated, per the K.W7 acyclic-spine disambiguation).** `../VALUEJS-N2-ASKS.md §2 row 12`:
  "**The RIPE-NOW edges all stand** | `reverseAnimationShorthand` (`:276`) | … KF-CC1 → CC-1 |
  unchanged from L-SEED RIPE-NOW; now one publish fresher." So CC-1's `reverseAnimationShorthand`
  consume is the **0.12.0 / N.W7 ship** — RIPE, ALREADY PUBLISHED (the published-surface probe
  above), riding the K.W1 re-pin. CC-2's `sampleColorRamp` is a DIFFERENT, LATER edge:
  `../VALUEJS-N2-ASKS.md §3`: "**VJ.W1 SCROLL GRAMMAR + VJ.W2 `sampleColorRamp`** — the two genuine
  net-new grammar gates remain absent in 0.12.0 … RATIFIED into N's library track (VJ.W2 → N.W11.D,
  VJ.W1 → N.W11′, the 0.13.0 cut)" (`VALUEJS-N2-ASKS.md:61,124`). And
  `K.md §value.js coordination`: "**VJ.W2 PERCEPTUAL RAMP** (gates K.W10's CC-2):
  `sampleColorRamp(from,to,n,{space,hueMethod})` beside `mix.ts`, reusing `lerpColorValue` +
  `gamutMapOKLab` (MEASURE-FIRST). Confirmed ABSENT in 0.12.0." **The producer is now RATIFIED-as-
  proposed** (the dispatch's live disposition): value.js's arm folded VJ.W2 into **N.W11.D** (a 4th
  LANE of the color-SOTA wave N.W11, beside `mix.ts`/`gamut.ts`) shipping in the **0.13.0** cut —
  `../KF-TO-VALUEJS-GRAMMAR-ASKS.md §4` + the executable producer spec
  `value.js/docs/tranches/N/GRAMMAR-FOLD.md PART I` (the signature `sampleColorRamp(from, to, n,
  {space, hueMethod}): Color[]` at `GRAMMAR-FOLD.md:60-66`, ~S-effort, a COMPOSITION over shipped
  kernels; the value.js-side born-RED `test/color-ramp.test.ts` reds on the undefined import,
  greens on the N.W11.D publish — `GRAMMAR-FOLD.md §I.2`). So CC-2's consume edge lights on the
  **0.13.0 publish** (whichever cut ships it — 0.13.0/N.W11.D or the named post-N Tranche O
  fallback, `GRAMMAR-FOLD.md §I.4`), born-RED-gated kf-side, the wave GREEN via CC-3's honest refusal
  until then. The outbound ask is `../KF-TO-VALUEJS-GRAMMAR-ASKS.md §2` (VJ.W2). **DO NOT conflate
  the two value.js cuts:** CC-1's `reverseAnimationShorthand` is the 0.12.0/N.W7 RIPE edge; CC-2's
  `sampleColorRamp` is the 0.13.0/N.W11.D OPEN edge — exactly the disambiguation K.W7's §Provenance
  draws for its sibling.
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
- **Half the compiler is SHIPPED (the parser run backward — CONFIRMED against the tree,
  2026-06-15; the line:nums RE-GREPPED, NOT copied from the frozen lane — HARDENING-6 HAZARD-2):**
  `CSSKeyframesToString` (`format.ts:173-220` — the whole-block readout; the §State-verified
  `grep -n "export function CSSKeyframesToString"` printed `:173`, the closing `}` at `:220`, the
  file is only 220 lines TOTAL) emits a complete `.class { animation-* }` + `@keyframes` from the
  declared template; `animationOptionsToString` (`format.ts:145-171`) emits every `animation-*`
  longhand (`-name`/`-duration`/`-timing-function`/`-iteration-count`/`-direction`/`-fill-mode`,
  and `-delay` via `reverseCSSTime` `format.ts:165`); `serializeEasing` (`format.ts:31` — the
  function opens at `:31`, spans `:31-52`) THROWS `AnimationOptionError` for a custom closure (the
  fail-explicit ineligibility idiom); `springLinearStops` (`springLinearStops.ts:46-73` — the
  whole 73-line file) compiles a spring to `linear()` (the body emits `linear(${stops.join})`
  `springLinearStops.ts:72`). The single-ANIMATION serializer is done; CC-1 extends it to the
  GROUP/SEQUENCE/STAGGER graph. **THE LANE-FROZEN ANCHORS ARE DRIFTED (corrected here, the impl
  re-greps):** `../../J/audit/frontier/css-compiler.md §1` cites `format.ts:124-194` for
  `CSSKeyframesToString`, `:30-45` for `serializeEasing`, and `:155` for the serialize-from-template
  authority — ALL drifted on today's tree; the §State-verified current is `:173-220` /
  `:31-52` / the declared-template projection at `format.ts:79` (`const declared: ParsedVarMap =
  animation.parsedVars[i] ?? {}`, inside the `format.ts:53-85` projection region the
  `../KF-TO-VALUEJS-GRAMMAR-ASKS.md §1.3` mirror cites). The impl re-greps current line:nums; it
  never copies the frozen lane's (the same HAZARD-2 discipline the `:184→:196` `BlendMode` drift
  established below).
- **`BlendMode` is `replace|add|weighted` at constants.ts:196 (CONFIRMED — the §3a refusal root +
  HARDENING-5 HAZARD-2 drift):** `grep -n "BlendMode" src/animation/constants.ts` → `constants.ts:196
  export type BlendMode = "replace" | "add" | "weighted";`. The lane cites `:184` — DRIFTED; current
  is `:196`. CSS `animation-composition` is `replace|add|accumulate` — `weighted` has NO CSS twin
  (the load-bearing refusal CC-8 KILL / CC-3 reports).
- **`stagger.delays(total)` materializes the distribution (CONFIRMED):** the construction-time
  delay distribution (`stagger.ts` — `from: center/edges/index` + the easing reshape) materializes
  via `stagger.delays(total)`; CC-1 consumes the EXISTING public API to emit per-element literal
  `nth-child` delays (near-zero new surface for the stagger leg —
  `../../J/audit/frontier/css-compiler.md §3b`).
- **CC-1's value.js consume is RIPE; CC-2's is OPEN (CONFIRMED BY DIRECT PUBLISHED-SURFACE PROBE,
  2026-06-15 — the K.W7 tarball-probe precedent, not `.d.ts` hearsay):** `npm view
  @mkbabb/value.js@0.12.0 version` → `0.12.0`; `npm pack @mkbabb/value.js@0.12.0` →
  `package/dist/index.d.ts:35` `export { parseAnimationShorthand, reverseAnimationShorthand, }
  from './parsing/animation-shorthand';` AND `package/dist/parsing/animation-shorthand.d.ts:19`
  `export declare const reverseAnimationShorthand: (opts: CSSAnimationOptions) => string;` — the
  CC-1 consume symbol is in the PUBLISHED surface (not merely source), and its signature
  (`(opts: CSSAnimationOptions) => string`) is the `animation`-shorthand inverse CC-1's per-child
  emit calls (the round-trip producer for each `Animation`'s `animation` longhand). `sampleColorRamp`
  ABSENT — `grep -rc "sampleColorRamp" package/dist/` → ZERO across every file (VJ.W2 OPEN
  confirmed; the SAME absence the value.js producer-side records by direct probe,
  `value.js/docs/tranches/N/GRAMMAR-FOLD.md:147` "`grep -rc sampleColorRamp src/ dist/` → ZERO @0.12.0").
  So CC-1 core proceeds; CC-2 densify born-RED-gates on VJ.W2.
- **THE INSTALLED PIN IS `^0.11.2`; the producer is RIPE-but-NOT-YET-REACHABLE until the K.W1 re-pin
  (CONFIRMED — the K.W7 nuance, load-bearing):** `grep -n '"@mkbabb/value.js"' package.json` →
  `package.json:179 "@mkbabb/value.js": "^0.11.2"`; the on-disk `node_modules/@mkbabb/value.js`
  `package.json` `version` is `0.11.2`. So `reverseAnimationShorthand` is PUBLISHED on npm (RIPE)
  but NOT yet in kf's module graph — the CC-1 consume is born-RED-witnessable kf-side until **K.W1
  re-pins `^0.11.2 → ^0.12.0`** (the re-pin precedes the design AND frontier bands — `K.md §Phase`,
  `K.W1`; the SAME ordering K.W7's diagnostics consume rides). CC-1's consume edge lights on that
  re-pin, resolved through `node_modules/@mkbabb/value.js`'s `exports`→`dist` (the contract-v2
  resolution, `docs/precepts/cross-repo-dev-resolution.md §2.1`), NEVER a manifest `file:` specifier
  and NEVER a hard `dist/` alias (`cross-repo-dev-resolution.md §2.4`).
- **`deltaEOK` is RIPE (CONFIRMED BY PUBLISHED-SURFACE PROBE — gates the CC-2 ΔE pixel proof):** the
  2026-06-15 tarball probe printed `deltaEOK` in `package/dist/units/color/gamut.d.ts` + the barrel
  `package/dist/index.d.ts` (the value.js producer-side anchors it at `gamut.ts:53`,
  `GRAMMAR-FOLD.md:98`) — the perceptual-distance kernel the CC-2 densify's ΔE-ε pixel proof consumes
  (`VALUEJS-N2-ASKS.md §2 row 12` KF-DELTAE → CC-2). So CC-2's PROOF kernel is RIPE even while its
  PRODUCER (`sampleColorRamp`) is OPEN — the densify gates on the producer, the proof gates on
  `deltaEOK` (already shipped). **The moment value.js publishes the 0.13.0 / N.W11.D fold, kf's
  densify consumer lights AND its ΔE proof is already in hand** (`GRAMMAR-FOLD.md §I.3` step 3).

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
  §2 row 12`; the published-surface signature `(opts: CSSAnimationOptions) => string`
  `package/dist/parsing/animation-shorthand.d.ts:19`, §State-verified). **WHY the parser run
  backward:** the compiler is the INVERSE of the parser over the SAME data model
  (`../../J/audit/frontier/css-compiler.md §1`); it emits from the DECLARED template (the
  serialize-from-`parsedVars[i]` authority — `format.ts:79`, inside the `format.ts:53-85` projection
  region; NOT the frozen lane's drifted `:155`; never a DOM-resolved `at(progress)` sample), so
  `var()`/`matrix3d()`/`cqw` round-trip VERBATIM. **NO-WORKAROUND:** NOT a re-derived lossy emitter (the moat is the faithfulness —
  `K.md §MANDATE`); NOT a `sibling-index()` stagger emit (Chromium-only — the universal literal-
  delay form is the default; the `@supports (sibling-index)` PE-variant is CC-6 BOOK).
- **S2 — CC-2 the oklab densify (VJ.W2-gated; the acyclic-spine source half).** Locus: the compile
  module's color leg + the value.js `sampleColorRamp` consume. The densify: bake the perceptual
  color curve into N intermediate `oklab()` stops sampled from kf's JS lerp (`sampleColorRamp(from,
  to, n, {space, hueMethod})` — the dispatched VJ.W2 producer), so the browser's
  piecewise-linear-per-segment fill tracks kf's perceptual curve — "the one place the compiler can
  OUT-EXPRESS naive CSS" (`../../J/audit/frontier/css-compiler.md §3c`). **WHY VJ.W2-gated:**
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
  CSS domain. The four refusals (`../../J/audit/frontier/css-compiler.md §3`): (1) `weighted` blend —
  "weighted layer blend has no animation-composition equivalent (replace/add/accumulate only)" (the
  §3a refusal — `BlendMode` `weighted` `constants.ts:196` vs CSS `replace|add|accumulate`; CC-8 the
  direct-compile is KILLED; the refusal PROVES axis-3's uniqueness); (2) custom renderers — a custom
  `transform` closure cannot be CSS (same gate as `waapi.ts:117`); (3) perceptual oklab — where CC-2
  cannot densify under ΔE-ε (the platform ROOT: color does NOT composite and has no faithful
  `@keyframes` twin — `../../J/audit/frontier/compositor-eligibility.md §1` CE-3, so the refusal is the
  PLATFORM's boundary, not kf timidity); (4) computed-unit drift — the NARROW residue where a unit
  cannot be authored-string-emitted (NOT a blanket reject — the compiler emits `vh`/`cqw`/`calc()`
  VERBATIM and is STRICTLY BETTER than WAAPI, `css-compiler.md §3e`; the registered-custom case that
  CANNOT round-trip is the CE-2 root, `compositor-eligibility.md §1`). **WHY the trust surface:** "a compiler is
  only as trustworthy as its refusal report" (`../../J/audit/frontier/css-compiler.md §3`); the refusal
  is the receipt that kf's unique axes (weighted blend, perceptual color) are genuinely beyond CSS —
  "the refusal is marketing for the moat" (§6). **NO-WORKAROUND:** NO silent approximation — what
  cannot round-trip faithfully is REFUSED with a named reason (the replay-equality invariant's
  honest-refusal clause); NO `@starting-style` blanket wrapper (CC-7 KILL — `@starting-style` is a
  TRANSITION construct, emit ONLY the entry-transition leg — §3d).
- **S4 — CC-4 the "Export CSS" editor button (the demo leg; rides K.W12's repaired demo).** Locus
  (VERIFIED 2026-06-15 — the editor-shell surface, NOT a vague `@/components`): the demo editor
  shell `demo/@/components/custom/editor-shell/EditorShell.vue` + its header
  `EditorHeader.vue` gain an Export CSS action (the natural home is BESIDE the EXISTING share
  surface `SharePopover.vue` / `useShareState.ts` — the editor already has a "produce an artifact
  from this animation" affordance the Export CSS button extends, not a net-new chrome), calling
  `compileToCSS` (the SAME HEAVY export reached via `loadAnimationEngine()`) → a pure-CSS artifact +
  the CC-3 ineligibility report UI. **WHY:** the editor becomes a CSS animation IDE — "not a CSS
  generator (authors from scratch) but a CSS COMPILER (inverts a played animation)"
  (`../../J/audit/frontier/css-compiler.md §6`); the ineligibility report TEACHES the user where kf's
  unique axes exceed pure CSS. **CROSS-WAVE (BINDING — reciprocal pointers):** CC-4 touches the demo
  editor — it rides Band I's repaired demo (K.W4's re-cut panes:
  `demo/@/components/custom/editor-shell/EditorStartScreen.vue` + the spring/dock/easing panes
  re-cut at root, `K.W4.md §Scope`) AND K.W12's dogfood inversion (the demo consumes the PUBLISHED
  barrel `@mkbabb/keyframes.js`, NOT `@src` — `proof:demo-on-published-surface`, `K.W12.md §ED-3`,
  the boundary-ORACLE at the package boundary). CC-4 lands AFTER the demo is honest (the editor
  button is the user-facing dogfood of the round-trip axis — a dogfood onto a BROKEN demo would
  certify a broken product against its own package, `K.md §The two bands`). **NO-WORKAROUND:** the
  button calls the SAME `compileToCSS` the gate proves (no demo-local re-emit — the demo-local
  re-author is the legacy-beside-its-replacement the mandate forbids); the report UI shows the CC-3
  reasons VERBATIM (no softened "could not compile" — the named refusal is the product value).

## §Hard gate (the proof:* that BITES — born-RED in the FRONTIER sense · the compile replay-equality oracle, backward direction)

**The oracle (per the replay-equality + acyclic-spine invariants + the gate-ORACLE precept):**
`proof:compile-replay-equal` compiles a clean input to zero-runtime CSS, replays the COMPILED CSS
side-by-side vs the JS playback, and PIXEL-COMPARES them; for every REFUSED input, CC-3 names the
reason and the JS playback is the only faithful path. "The gate is the entire point — a compiler
that drifts is worse than no compiler" (`../../J/audit/frontier/css-compiler.md §7`). Born-RED in the
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
  discipline — `../../J/audit/frontier/css-compiler.md §7`: "a planted custom-renderer/weighted-blend/
  oklab input must RED the compile (force the refusal)"). **BITE:** reds if a refused input
  silently emits (wrong) CSS instead of refusing; the refusal is the honest-refusal clause of the
  replay-equality invariant. **NO escape:** the four refusals are NAMED reasons, never a silent
  approximation.
- **clause (d) — CC-2 the oklab densify ships-or-refuses on the ΔE proof (CORRECTNESS · value.js-GATED
  on VJ.W2 · the acyclic-spine form).** A color-interpolating animation: IF the N-stop `oklab()`
  densify (via the dispatched `sampleColorRamp`) pixel-matches kf's JS lerp under ΔE-ε (consuming
  the RIPE `deltaEOK`), the densified CSS SHIPS and replays equal; ELSE CC-3 REFUSES. **BORN-RED
  WITNESS (the acyclic-spine form — the CAPABILITY-ABSENT sense):** `sampleColorRamp` is ABSENT in
  the PUBLISHED 0.12.0 surface (the §State-verified `grep -rc "sampleColorRamp" package/dist/` →
  ZERO; the value.js producer-side records the SAME absence by direct probe,
  `value.js/docs/tranches/N/GRAMMAR-FOLD.md:147`) → there is no producer to CALL → the densify
  cannot run → the clause REDS against the recorded born-RED (the source half — the `compile.ts`
  color leg that CALLS `sampleColorRamp` — lands; the densify consume edge is dark; CC-3's
  perceptual-oklab refusal is the FALLBACK until the producer publishes). **The consume edge LIGHTS
  when value.js publishes the now-RATIFIED-as-proposed 0.13.0 / N.W11.D fold** (`sampleColorRamp`
  beside `mix.ts`, the signature `(from, to, n, {space, hueMethod}): Color[]`
  `GRAMMAR-FOLD.md:60-66`; OR the named post-N Tranche O fallback — the kf consume edge is identical
  either way, `GRAMMAR-FOLD.md §I.4`) — the densify clause greens on whichever cut publishes,
  born-RED-gated kf-side, NEVER a `file:` link, NEVER a vendored `sampleColorRamp`. **Until then,
  the wave is GREEN via the REFUSAL** (clause c's
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
**value.js gate status:** SPLIT across TWO distinct value.js cuts (the disambiguation, NOT
conflated) — CC-1's `reverseAnimationShorthand` is the **0.12.0 / N.W7** edge: RIPE, ALREADY
PUBLISHED (`package/dist/parsing/animation-shorthand.d.ts:19`, §State-verified), the consume riding
the K.W1 re-pin `^0.11.2 → ^0.12.0` (the installed pin is STILL `^0.11.2`, so the consume is
born-RED-witnessable kf-side until the re-pin). CC-2's `sampleColorRamp` is the LATER **0.13.0 /
N.W11.D** edge: OPEN, DISPATCHED via `../KF-TO-VALUEJS-GRAMMAR-ASKS.md §2`, now RATIFIED-as-proposed
into N's color-SOTA library wave (the executable producer spec
`value.js/docs/tranches/N/GRAMMAR-FOLD.md PART I`; the post-N Tranche O the named fallback). The
densify consume edge lights on whichever cut publishes `sampleColorRamp`, the wave green via CC-3's
honest refusal until then. **Conflating the two cuts (treating CC-1 and CC-2 as one gate) would
mis-gate this wave** — CC-1 lands and greens on the 0.12.0 re-pin; CC-2 waits for the 0.13.0 fold.

## §No-workaround prohibitions (BINDING — the mandate's named forbiddings for this wave)

- **NO re-derived lossy emitter (S1 — the moat).** The compiler is the parser run BACKWARD over
  the SAME data model — it emits from the DECLARED template (the serialize-from-`parsedVars[i]`
  authority `format.ts:79` in the `format.ts:53-85` projection region — the §State-verified current,
  NOT the frozen lane's `:155`; never a DOM-resolved `at(progress)` sample), so
  `var()`/`matrix3d()`/`cqw` round-trip VERBATIM. A re-derived emitter
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
  `../../J/audit/frontier/css-compiler.md §3d`); emit it ONLY for the entry-transition/FLIP leg, NOT a
  blanket wrapper on every compiled `@keyframes` (over-claiming it would be a correctness bug).
- **NO `sibling-index()` stagger emit as the default (S1 — CC-6 BOOK).** The materialized literal
  `nth-child` delays (via `stagger.delays`) are the UNIVERSAL default (Baseline everywhere, and
  expressing an eased origin-aware curve `sibling-index()` cannot — `../../J/audit/frontier/css-compiler.md
  §3b`); the `@supports (sibling-index)` PE-variant one-liner is a flagged BOOK (Chromium-only), NOT
  the default emit.
- **NO unconditional oklab densify (S2 — gated on the ΔE proof).** CC-2 ships the densify ONLY
  where the N-stop emit pixel-matches kf's JS lerp under ΔE-ε (via `deltaEOK`); else CC-3 REFUSES.
  A drifting densify is worse than an honest refusal (the gate decides ship-vs-refuse —
  `../../J/audit/frontier/css-compiler.md §3c`).
- **NO `file:` link or vendored `sampleColorRamp` (S2 — the acyclic-spine's named forbidding).** The
  VJ.W2 densify consume edge is a PUBLISHED consume (value.js publishes the 0.13.0 / N.W11.D fold;
  kf consumes one tranche behind on the publish, resolved through `node_modules/@mkbabb/value.js`'s
  `exports`→`dist` — the contract-v2 resolution, `docs/precepts/cross-repo-dev-resolution.md §2.1`),
  NEVER a `file:` link to value.js's WIP tree and NEVER a vendored copy of `sampleColorRamp`, and
  NEVER a hard `dist/` `resolve.alias` (`cross-repo-dev-resolution.md §2.4` — the named prohibitions;
  `K.md §invariant set` the acyclic-spine invariant). The same one-directional spine the whole
  constellation holds: value.js → kf (grammar); kf → glass-ui (spring); no back-edge.
- **NO consuming `reverseAnimationShorthand` from an unpublished/`src/` value.js (S1 — the RIPE
  edge's acyclic forbidding).** CC-1's `reverseAnimationShorthand` consume is the PUBLISHED 0.12.0
  symbol reached through the K.W1 re-pin's `exports`→`dist` (NOT value.js's `src/`, struck under
  contract-v2 — `cross-repo-dev-resolution.md §1.1,§2.2`; NOT a `file:` specifier in
  `package.json`). The RIPE edge is no less bound by the spine than the OPEN one.

## §Folds (every K.md-assigned fold, with its frontier-lane + L-SEED/N2 citation)

- **CC-1** (the compilable core — RIPE) — S1. `../L-SEED.md §1 #1` + the §body→K.W10 map;
  `../../J/audit/frontier/css-compiler.md §1,§2,§8` (CC-1 K-HEADLINE-CANDIDATE); `format.ts:173-220`
  (`CSSKeyframesToString`, the shipped single-animation serializer the walker extends — the
  §State-verified current, NOT the lane's drifted `:124-194`), `format.ts:145-171`
  (`animationOptionsToString`, the `animation-*` longhand emit), `springLinearStops.ts:46-73`
  (springs → `linear()`), `stagger.ts:167` `stagger.delays` (the materialized stagger; type decl
  `stagger.ts:69`); `reverseAnimationShorthand` RIPE in PUBLISHED 0.12.0
  (`package/dist/parsing/animation-shorthand.d.ts:19`; `VALUEJS-N2-ASKS.md §2 row 12`); `src/` ZERO
  `reverseAnimationShorthand` (born-RED — `grep -rn "reverseAnimationShorthand" src/` → ZERO,
  §State-verified).
- **CC-2** (the oklab densify — VJ.W2-gated; the 0.13.0/N.W11.D edge) — S2.
  `../../J/audit/frontier/css-compiler.md §3c,§8` (CC-2 K-CANDIDATE, MEASURE-FIRST); the value.js dispatch
  `../KF-TO-VALUEJS-GRAMMAR-ASKS.md §2` (the OPEN gate) + the RATIFIED-as-proposed producer spec
  `value.js/docs/tranches/N/GRAMMAR-FOLD.md PART I` (`sampleColorRamp(from, to, n, {space,
  hueMethod}): Color[]` beside `mix.ts`, the 0.13.0/N.W11.D fold); `deltaEOK` RIPE for the ΔE proof
  (PUBLISHED 0.12.0 `package/dist/units/color/gamut.d.ts`; `VALUEJS-N2-ASKS.md §2 row 12`);
  `sampleColorRamp` absent in PUBLISHED 0.12.0 (born-RED — `grep -rc "sampleColorRamp" package/dist/`
  → ZERO, §State-verified; `VALUEJS-N2-ASKS.md:61`).
- **CC-3** (the four refusals — value.js-INDEPENDENT) — S3. `../../J/audit/frontier/css-compiler.md
  §3a,§3c,§8` (CC-3 K-CANDIDATE, the trust surface); `waapi.ts:98-208 isWAAPIEligible` (the
  generalized idiom); `BlendMode` `constants.ts:196` (the `weighted` refusal root); CC-8 (compile
  `weighted`) KILL, CC-7 (`@starting-style` blanket) KILL (`../L-SEED.md §5`-adjacent / `css-compiler.md §8`).
- **CC-4** (the Export CSS button — the demo leg) — S4. `../../J/audit/frontier/css-compiler.md §6,§8`
  (CC-4 K-CANDIDATE, the CSS-animation IDE); rides K.W4's repaired panes + K.W12's dogfood inversion.
- **CC-5 (pre-multiply static weights), CC-6 (`@supports` PE variants)** — BOOKs with named
  tripwires (`../../J/audit/frontier/css-compiler.md §8`; CC-5 "a real partial-compile, premature";
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
- **W10 composes with W8 (the ingest→recompile loop) — a temporal compose, not a co-edit
  (reciprocal with `K.W8.md`).** K1∘CC-1 = ingest a page's `@keyframes` (W8's `fromStyleSheets()`/
  `fromLiveAnimations()`), recompile to CSS (W10's `compileToCSS`) — `K.W8.md §DAG-deps`: "**K.W10
  (compile) COMPOSES with W8** — K1∘CC-1 is the full ingest→recompile loop … W10 follows W8". W10
  FOLLOWS W8 in the DAG; the loop closes when both land. The compose is TEMPORAL (ingest produces a
  kf object graph; the compiler emits CSS from it) — NOT a co-edit: W8 owns the CSSOM-walk producer
  (`adapter.ts`'s new `fromStyleSheets`), W10 owns the NEW `compile.ts` emit module; neither edits
  the other's file.
- **`format.ts` may be touched by BOTH W9 (the scroll round-trip serialize) and W10 (the compile
  module over the lineage).** DISJOINT concerns — W9 round-trips the SCROLL declarations (threading
  value.js's `serializeAnimationTimeline` through `format.ts`'s declared-template authority,
  `../KF-TO-VALUEJS-GRAMMAR-ASKS.md §1.3`); W10 compiles the GROUP/SEQUENCE/STAGGER graph (a NEW
  `compile.ts` module OVER the `format.ts` lineage, not editing `format.ts`'s scroll leg). They land
  as separable commits, each gate reding only on its half.
- **W12's CC-4 reciprocity (the demo leg's package-boundary seam).** S4's Export CSS button rides
  K.W12's dogfood inversion (`K.W12.md §ED-3` — `proof:demo-on-published-surface`: the demo consumes
  the PUBLISHED barrel `@mkbabb/keyframes.js`, NOT `@src`). CC-4 calls `compileToCSS` THROUGH the
  published barrel's `loadAnimationEngine()` — the SAME HEAVY export the gate proves; the button is
  the user-facing dogfood of the round-trip axis, honest ONLY on Band I's repaired demo (it lands
  AFTER K.W4 + K.W12). W10 authors `compileToCSS`; W12 makes the demo consume it through the package
  boundary — a temporal compose, not a co-edit.
- **The value.js consume edges are PUBLISHED consumes, NEVER `file:`/vendored** (the acyclic-spine
  invariant; the constellation law `docs/precepts/cross-repo-dev-resolution.md §2.1,§2.4,§6` — a
  sibling resolves through its `exports` map to its built `dist/`, dev and prod alike, NEVER `src/`
  and NEVER a hard `dist/` alias). **The TWO edges, NOT conflated:** CC-1's `reverseAnimationShorthand`
  is the **0.12.0 / N.W7** RIPE edge (consumed on the K.W1 re-pin `^0.11.2 → ^0.12.0`; the installed
  pin is STILL `^0.11.2`, so the consume is born-RED-witnessable kf-side until the re-pin); CC-2's
  `sampleColorRamp` is the LATER **0.13.0 / N.W11.D** edge (born-RED-gated on the publish; the
  RATIFIED-as-proposed producer `value.js/docs/tranches/N/GRAMMAR-FOLD.md PART I`, the post-N Tranche
  O the named fallback). The grammar lands in value.js's tree (its own repo/authorization —
  `../KF-TO-VALUEJS-GRAMMAR-ASKS.md:32` "kf does not write value.js's tree"); kf consumes one tranche
  behind on the publish. W10 NEVER writes value.js's tree; the acyclic spine is one-directional.

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
- **The acyclic-spine is handled by SPLITTING CC-1 (RIPE 0.12.0) from CC-2 (OPEN 0.13.0) — the
  TWO value.js cuts are DISTINCT, never conflated.** CC-1 core + CC-3 refusals land + green on
  K.W7's substrate (`reverseAnimationShorthand` shipped in the PUBLISHED 0.12.0 surface, consumed on
  the K.W1 re-pin — the installed pin is still `^0.11.2`); CC-2 densify born-RED-gates on the LATER
  **0.13.0 / N.W11.D** publish (the RATIFIED-as-proposed `sampleColorRamp` fold,
  `value.js/docs/tranches/N/GRAMMAR-FOLD.md PART I`; the post-N Tranche O the named fallback —
  identical kf consume edge either way), and UNTIL value.js publishes it, the wave is GREEN via the
  honest perceptual-oklab REFUSAL (the densify is a WIDENING that lights on the publish, not a
  blocker). K's impl never blocks on the 0.13.0 fold (`K.md §value.js coordination`). **Treating the
  two cuts as one gate would mis-schedule the wave** — CC-1 is ready at the 0.12.0 re-pin; CC-2 waits
  a beat for 0.13.0 (the same K.W7-drawn disambiguation for its RIPE-vs-OPEN sibling edges).
- **The four refusals PROVE the uniqueness of kf's axes from the other side.** The `weighted`-blend
  refusal is the receipt that axis-3 is genuinely beyond CSS; the perceptual-oklab refusal (where
  CC-2 cannot densify) is the receipt that axis-2 is beyond naive `@keyframes`. "The refusal is
  marketing for the moat" (`../../J/audit/frontier/css-compiler.md §6`).
- **The line-drift is corrected ACROSS EVERY anchor (HARDENING-6 HAZARD-2 — the frozen-lane copy is
  the recurring footgun).** The frontier lane `css-compiler.md` froze its `file:line` anchors at its
  2026-06-10 authoring; SEVERAL have drifted on today's tree. The §State-verified current
  (2026-06-15, re-grepped, NOT copied):
  - `BlendMode` → `constants.ts:196` (NOT the lane's frozen `:184`).
  - `CSSKeyframesToString` → `format.ts:173-220` (NOT the lane's `:124-194`; the file is only 220
    lines total).
  - `serializeEasing` → `format.ts:31-52` (NOT the lane's `:30-45`).
  - the serialize-from-DECLARED-template authority → `format.ts:79` (`parsedVars[i]`), in the
    `format.ts:53-85` projection region (NOT the lane's `:155`).
  - `animationOptionsToString` → `format.ts:145-171`; `springLinearStops` → `springLinearStops.ts:46-73`
    (correct as the lane cites); `stagger.delays` → `stagger.ts:167` (type decl `:69`).
  The impl re-greps current line:nums at impl time; it NEVER copies the frozen lane's. The
  §Provenance quote of `css-compiler.md §1` preserves the lane's frozen anchors AS A QUOTE (with the
  inline NOTE pointing here), but every CLAIM this spec makes uses the verified current anchor.
- **The value.js consume is a PUBLISHED-surface fact, proven by tarball probe (the K.W7 precedent).**
  `reverseAnimationShorthand`/`deltaEOK` are confirmed in the PUBLISHED 0.12.0 `dist/` (npm pack,
  2026-06-15), not merely value.js's `src/`; `sampleColorRamp` is confirmed ABSENT from the published
  0.12.0 `dist/`. The impl re-probes the published surface at re-pin time, never trusts a stale
  `.d.ts` grep of an installed copy.
