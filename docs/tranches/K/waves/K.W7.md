# K.W7 — THE FIDELITY FLOOR (LEADS Band II · the round-trip made HONEST before it is widened: the engine HONORS the `animation-composition` it currently drops + the diagnostics channel)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-K (Band II · frontier
  CORRECTNESS floor; born-RED in the FRONTIER sense — the engine DROPS a declared CSS operator
  TODAY: `adapter.ts:24-29,107-133` captures the author-declared `animation-composition`
  (`replace`/`add`/`accumulate`) onto `ResolvedKeyframes.composition: Map<string,string>`, and
  `engine.ts` reads it NEVER — grep-verified ZERO `composition` tokens in `engine.ts`
  (§State-verified), `waapi.ts` emits ZERO `composite` (the sole `composite` token is the prose
  "does not composite anyway" `waapi.ts:21`). So a user authors `@keyframes x { 50% { transform:
  translateX(10px); animation-composition: add } }`, kf parses the operator, stores it in a Map,
  and silently runs `replace` on BOTH the rAF and WAAPI paths — a correctness gap on kf's
  SIGNATURE axis (parse author CSS, animate faithfully). The round-trip must be HONEST before it
  is widened: the compiler (K.W10) INVERTS this honoring — it cannot faithfully EMIT a layering
  operator the engine cannot faithfully HONOR.) · **Scope (engine-internal, value.js-INDEPENDENT;
  ONE captured-value read + ONE producer consume):** the `animation-composition` HONORING wired
  from the captured `adapter.ts:120-126` Map into the rAF additive-accumulate blend leaf
  (`group.ts:316-375`, the G.W17-fixed element-wise loop) + the WAAPI `composite` pass-through
  (`waapi.ts` `toWAAPIKeyframes`/`toWAAPIOptions`, a Baseline keyword forward) + the
  `ResolvedKeyframes.diagnostics` channel consuming the SHIPPED 0.12.0 `ParseDiagnostic`/
  `OnParseError` producer (N2 row 10) + the `proof:composition-honored` and
  `proof:diagnostics-channel` gates, both born-RED in the frontier sense. ·
- **DAG-deps:** **LEADS Band II** (`K.md §WAVE MAP`: "K.W7 (fidelity floor) LEADS the frontier
  band — engine-internal, value.js-independent, the round-trip made HONEST before it is widened").
  Consumes K.W0's de-vacuoused liveness oracle + B1 engine-write disambiguation (the
  `proof:composition-honored` gate reads the ENGINE's own blend write, never decorative churn —
  the engine-write disambiguation rule applies in the frontier band too). **K.W8 (ingest)
  FOLLOWS W7** — it consumes the `ResolvedKeyframes.diagnostics` channel this wave authors for
  its CORS-skip / robustness surface (`K.md §WAVE MAP`; README §1 "W8 … consumes W7's diagnostics
  channel"). **K.W10 (compile) FOLLOWS W7** — it INVERTS the honoring (emits the
  `animation-composition` layering W7 taught the engine to READ; a read-then-emit dependency, not
  a co-edit — README §4B). **K.W11 (physics) runs ∥ W7** but is file-disjoint (`group.ts`
  blend-WEIGHT tier vs W7's `group.ts` blend-MODE leaf — see §Hand-off for the exact seam). The
  value.js half is RIPE-CONSUMED (no OPEN gate): `ParseDiagnostic`/`OnParseError` shipped in
  0.12.0 (`VALUEJS-N2-ASKS.md` §2 row 10), so W7 carries NO acyclic-spine born-RED edge — it is
  the one frontier wave whose every dependency is already published.

## §Provenance (the frontier lanes this wave consumes + the booked roots)

- **`../L-SEED.md §2 WL2-B` — THE decisive frontier input (the §body→K.W7 map row).** The
  body-item map (`../L-SEED.md` "§body-item → K wave map"): "**WL2-B** — animation-composition
  HONORING (§2; the K.W0-LEAD designation now reads K.W7) | the engine reads the captured
  `adapter.ts:120-126` value it currently drops + the diagnostics channel | **K.W7** FIDELITY
  FLOOR". The §2 verbatim body (`../L-SEED.md §2`): "the RIPEST item in the fleet and the
  designated K.W0 LEAD: `adapter.ts:24-29,120-126` already captures the author-declared
  `animation-composition` (add/accumulate); `engine.ts` never reads it (grep-verified zero hits)
  — the engine silently DROPS a declared CSS operator. Honoring it on rAF (the additive
  accumulate path) and WAAPI (composite support) is M-effort, born-RED-witnessable, and a
  CORRECTNESS floor the compiler (CC-1) then inverts. The round-trip must be honest before it is
  widened."
- **`../audit/frontier/waapi-level-2.md §4` — the wave-ready engineering detail (the FB-1
  headline).** §4.1 the exact gap (file:line): the composition operator is CAPTURED then DROPPED
  — `adapter.ts:24-29` captures per-keyframe `animation-composition` onto
  `ResolvedKeyframes.composition`, `adapter.ts:120-126` populates the Map; `engine.ts fromString`
  never reads `resolved.composition` (the `for` loop consumes `resolved.keyframes` +
  `resolved.timingFunctions` but the `.composition` Map is dead on arrival); `toWAAPIOptions`
  never emits `composite` (zero `composite` references in `waapi.ts` — the delegated
  `element.animate(...)` call passes keyframes + options with NO composite, so a CSS-declared
  `animation-composition: add` runs as silent `replace` on the compositor). §4.3 the two halves,
  both already substrated: (a) the rAF/object-target half is WIRING, not new machinery — the
  blend leaf in `transformFramesGrouped` (`group.ts:316-375`) ALREADY does element-wise `add`
  (un-clamped, per the CSS spec) and `weighted` lerp; FB-1's rAF half routes a per-keyframe
  `composition: add|accumulate` from the captured Map into the per-frame blend mode; the
  `accumulate` operator (repeat-aware) is the one new semantic, "a bounded leaf, not a new
  pipeline" — "the G.W17-recorded FIX, not a green-field add". (b) the WAAPI half is pass-through
  of a Baseline keyword (`composite` is Baseline Chrome/Edge 112, Safari 16, Firefox 115 — §1).
  §4.4 the ONE real design cost (NEW-39): what does `add` mean for a non-numeric leaf — a color,
  a transform LIST, a `<custom-ident>`; kf's leaf already falls back to `replace` for non-numeric
  units (`group.ts:339-341,367-369`), "the safe subset"; the K wave must decide: ship the
  numeric+transform-list subset (matching where WAAPI `composite` is well-defined) and
  `replace`-fallback the rest, with a queryable diagnostic — OR book the transform-list concat
  case. §4.6: clear of every ARCH kill (not per-property easing, not Typed-OM, not
  monomorphization, no Worker/WASM). §4 verdict: K-CANDIDATE, effort M, "the round-trip must be
  honest before it is widened."
- **`../audit/frontier/live-stylesheet-ingestion.md §3 K3` — the diagnostics channel (the
  consumed BOOK).** §1: "**LD-DIAG is already booked.** `recap-deferred.md:268`:
  `ResolvedKeyframes.diagnostics` channel — producer half landed — BOOK (kf seam) +
  value.js-HANDOFF (the structured sink)." K3 (§3): give `ResolvedKeyframes` a `diagnostics:
  Diagnostic[]` field carrying the empty-parse signal (`adapter.ts` silently re-wraps and may
  yield zero frames), the cross-origin-sheet skip (§2.1, load-bearing for K.W8's honesty), the
  unrecognized per-stop timing functions (silent fallback), and the WAAPI-ineligibility reasons.
  "The producer half landed upstream; this elects the kf-side sink." Verdict K-CANDIDATE — "the
  FULL channel (CORS skip, WAAPI reasons) is K-scoped because it presupposes K1 [K.W8]". The two
  engine-INTERNAL rows (EMPTY_PARSE / UNKNOWN_TIMING_FN) were J-FOLDED into J.W1 (§4 of the lane;
  `../L-SEED.md §4` K3-internal); W7 authors the FIELD on `ResolvedKeyframes` + the producer
  CONSUME — the cross-origin/WAAPI-reason rows land WITH K.W8 (which produces them).
- **The N2 consume edge (RIPE, no acyclic-spine born-RED).** `../VALUEJS-N2-ASKS.md §2 row 10`:
  "**VJ-F2 diagnostics producer** → **DL-K17** | `ParseDiagnostic` / `OnParseError`
  (`parsing/utils.ts:65,80`; barrel `:320`) | `ResolvedKeyframes.diagnostics` (`adapter.ts:18`,
  field absent) can CONSUME the producer — DL-K17's 'OR consume the value.js VJ.W3 producer' arm
  is now real; the L channel decision should prefer it over authoring a kf-local channel | the
  full-diagnostics deferral resolves by consume, not authorship." This is a PUBLISHED-CONSUME
  edge already shipped in 0.12.0 — W7 is the wave that lights it; DL-K17 exits via this
  consume-edge (the row also discharged in K.W6's parallel terminations band — see §Hand-off).
- **The booked invariant roots:** `K.md §invariant set` — the **replay-equality invariant**
  (Band II born; W7's honoring is a PRECONDITION for the compile replay-equality of K.W10 — a
  compiled `animation-composition: add` block replays equal to JS playback ONLY if the JS
  playback honored `add` in the first place) + the **engine-write disambiguation rule** (the
  `proof:composition-honored` gate reads the engine's own blend write — the mid-frame SUM value —
  never bare `getComputedStyle` churn) + the **acyclic-spine invariant** (W7's value.js half is
  RIPE-consumed; no OPEN gate, no born-RED edge). DL-K17 (the diagnostics-producer chronic) exits
  via the published-consume-edge form (`deferred-ledger-k.md`, `K.W6.md`).

## §The state, verified (file:line / grep / version anchors)

- **The captured value EXISTS and is populated (CONFIRMED against the tree, 2026-06-15):**
  `adapter.ts:18` `export interface ResolvedKeyframes {`; `adapter.ts:29`
  `composition: Map<string, string>;`; `adapter.ts:107` `const composition = new Map<string,
  string>();`; `adapter.ts:120-126` populates it from `(rule as { composition?: string
  }).composition`; `adapter.ts:133` returns it on the `ResolvedKeyframes`. The docstring
  (`adapter.ts:24-26`) is explicit: "per-keyframe `animation-composition`
  (`replace`|`add`|`accumulate`), keyed by percent string — value.js lifts it onto
  `rule.composition`". **The producer is live; the consumer is missing.**
- **`engine.ts` has ZERO reads of the captured value (CONFIRMED — the born-RED root):**
  `grep -n "composition" src/animation/engine.ts` → **NO hits** (the §State-verified probe
  printed "(no composition token in engine.ts)"). The `fromString` keyframe loop consumes
  `resolved.keyframes` and `resolved.timingFunctions` but never `resolved.composition` — the Map
  is dead on arrival. **This is the born-RED root: the engine drops the operator.**
- **`waapi.ts` emits ZERO `composite` (CONFIRMED):** `grep -n "composite" src/animation/waapi.ts`
  → the SOLE hit is the prose `waapi.ts:21` ("a registered `@property` custom does not composite
  anyway") — never a `KeyframeEffect.composite` or `element.animate(..., { composite })`. The
  delegated WAAPI path forwards no composite keyword, so a CSS-declared `animation-composition:
  add` runs as silent `replace` on the compositor.
- **The rAF blend leaf is BUILT and correct (CONFIRMED):** `group.ts:336` `case "weighted":`,
  `group.ts:356` reads `layer.weight`, and the element-wise loop (`group.ts:316-375`) does
  un-clamped `add` and `weighted` lerp. The G.W17 dead-leaf fix is in the tree (the `add` path
  was collapsed to `replace` until G.W17 — `../audit/frontier/waapi-level-2.md §2`). So the rAF
  ACCUMULATION substrate is live; only the WIRING from the captured composition Map to that
  substrate is missing.
- **The `ResolvedKeyframes.diagnostics` field is ABSENT (CONFIRMED):** `grep -n "diagnostics"
  src/animation/adapter.ts` → NO hits; the interface (`adapter.ts:18`) carries `keyframes`,
  `timingFunctions`, `composition`, `properties`, `options` — no `diagnostics`. The producer is
  PUBLISHED (value.js 0.12.0 `ParseDiagnostic`/`OnParseError`); the kf-side sink is unwired.
- **The value.js producer is SHIPPED and RIPE (CONFIRMED):** `@mkbabb/value.js@0.12.0` is
  published on npm (`npm view @mkbabb/value.js@0.12.0 version` → `0.12.0`, 2026-06-15); it ships
  `ParseDiagnostic`/`OnParseError` (`VALUEJS-N2-ASKS.md:52`, `parsing/utils.ts:65,80`, barrel
  `:320`). **The installed pin is `^0.11.2` (`package.json:179`)** — K.W1 re-pins to `^0.12.0`
  BEFORE W7 (the re-pin precedes the design AND frontier bands; `K.md §Phase`). W7's diagnostics
  consume rides the K.W1 re-pin (a BINDING ordering — see §No-workaround).
- **No collision with the SHIPPED `adoptCompiled` (CONFIRMED — HARDENING-5 HAZARD-1 scoped):**
  `engine.ts:324` `adoptCompiled(source: Animation<V>): this` is the COMPILED-state internal
  adopt (gated by `proof:adopt-compiled`) — UNRELATED to W7's honoring; it is named here only to
  fence W8's `adopt()` (the mid-flight `getAnimations()` takeover) from it (see `K.W8.md`
  §No-workaround). W7 touches neither `adoptCompiled` nor `getAnimations`.

## §Goal

Make the round-trip HONEST at its floor: **the engine HONORS the `animation-composition` operator
the author declared — the `add`/`accumulate`/`replace` the CSS source carries is the
`add`/`accumulate`/`replace` the engine produces, on rAF AND on WAAPI — and the parse result
carries a structured diagnostics channel so every silent fallback becomes a citable signal.** The
fidelity floor is the PRECONDITION for the round-trip's two widening waves: K.W8 ingests the live
web's CSS (and reports its CORS skips through THIS channel), and K.W10 compiles kf's orchestration
BACK to CSS (emitting the `animation-composition` layering THIS wave taught the engine to read).
A compiler that emits an operator the engine cannot honor is a lossy emitter — the moat forbidden
(`K.md §MANDATE`: "the compiler is the round-trip's parser run BACKWARD … NOT a re-derived lossy
emitter"). So the honoring leads. Four moves, each at the gestalt altitude the mandate demands:

1. **The rAF honoring (S1 — the captured Map → the blend leaf).** `engine.ts fromString` READS
   `resolved.composition` and threads each per-keyframe operator into the engine's interpolation
   so a single animation's `add` keyframe accumulates onto the underlying value the way the
   group's `add` layer does (the same un-clamped element-wise leaf, `group.ts:316-375`). The
   `accumulate` operator (repeat-aware accumulation) is the one new semantic — a bounded leaf,
   NOT a new pipeline.
2. **The WAAPI honoring (S2 — the Baseline keyword pass-through).** `toWAAPIKeyframes` emits
   per-keyframe `composite` onto the Keyframe objects (or `toWAAPIOptions` emits a top-level
   `composite`), and the eligibility gate admits `add`/`accumulate` (today it never sees them).
   This is forwarding a keyword the browser already honors — no polyfill, no new platform
   dependency; per the existing eligibility discipline, color/computed-unit cases still stay on
   rAF, so the WAAPI composite path only ever runs where it is pixel-correct.
3. **The non-numeric refusal decision (S3 — NEW-39 resolved at a contained altitude).** Ship the
   numeric + transform-list subset (matching where WAAPI `composite` is well-defined); the
   non-numeric leaf (color, `<custom-ident>`, discrete) `replace`-falls-back AND emits a
   diagnostic row naming the fallback (the honesty surface — never a silent wrong pixel). The
   transform-list concat case is decided IN this wave (ship or book), not deferred to impl
   guesswork.
4. **The diagnostics channel (S4 — the consumed producer).** `ResolvedKeyframes` gains a
   `diagnostics: ParseDiagnostic[]` field consuming the value.js 0.12.0 `ParseDiagnostic`/
   `OnParseError` producer (N2 row 10). The engine-internal rows (EMPTY_PARSE / UNKNOWN_TIMING_FN
   — J.W1-landed) are JOINED by the composition-fallback row (S3); the CORS-skip / WAAPI-reason
   rows land WITH K.W8 (which produces them — the field is authored here, the producers populate
   it as each surface lands). A flat additive field with stable `code`s, NOT a logging framework
   (KISS — `../audit/frontier/live-stylesheet-ingestion.md §3 K3` "keep it a flat additive field
   with stable codes").

## §Scope

- **S1 — the rAF honoring (the captured Map → the blend leaf).** Locus: `engine.ts fromString`
  (the keyframe loop that today reads `resolved.keyframes`/`resolved.timingFunctions`) gains a
  read of `resolved.composition`; the per-keyframe operator threads into the interpolation's blend
  mode. The blend MACHINERY already exists (`group.ts:316-375` — the un-clamped element-wise `add`,
  the `weighted` lerp); S1 is the WIRING that routes a single animation's per-keyframe `add` onto
  the same leaf, plus the `accumulate` repeat-aware accumulation (the one new semantic — repeat
  iteration N accumulates onto the prior iteration's end, per the CSS spec). **WHY this is wiring,
  not new machinery:** `../audit/frontier/waapi-level-2.md §4.3` — "FB-1's rAF half is: route a
  per-keyframe `composition: add|accumulate` from the captured Map into a per-frame blend mode on
  the engine's interpolation … This is the G.W17-recorded FIX, not a green-field add." **MEASURE-FIRST
  (the one perf-adjacent risk):** the per-frame blend-mode branch in the `interpFrames` hot path —
  extend the `bench/interpolation.bench.ts` (the recorded ~996k ops/s 2-frame opacity baseline,
  `../audit/sota-landscape.md §5`) with a `composite:add` keyframe row; the FB-1 branch must NOT
  regress the `replace` path (a predictable branch on a per-keyframe constant should be free —
  `../audit/frontier/waapi-level-2.md §4.5`). **NO-WORKAROUND:** the honoring is the engine
  READING the captured value, NOT a re-parse of the CSS at apply time (the value is already in the
  Map; re-parsing would be the doc-rot the audit forbids).
- **S2 — the WAAPI honoring (the Baseline keyword pass-through).** Locus: `waapi.ts`
  `toWAAPIKeyframes`/`toWAAPIOptions` (the keyframe/options emit consumed by the delegated
  `element.animate(...)`) + the `isWAAPIEligible` gate. `composite` is forwarded per-keyframe (or
  top-level where uniform); the eligibility gate ADMITS `add`/`accumulate` (today it neither
  emits nor rejects them — it never sees them). **WHY pass-through, not new capability:**
  `composite` is Baseline (Chrome/Edge 112, Safari 16, Firefox 115 — `../audit/frontier/waapi-level-2.md
  §1`); the browser already honors it; S2 forwards a keyword the platform owns.
  **RAF/WAAPI PARITY (the load-bearing gate clause):** the same `add` keyframe produces the same
  mid-frame SUM value on the rAF path (S1) and the WAAPI path (S2) — the parity assert is the
  proof the operator is honored IDENTICALLY across backends. **NO-WORKAROUND:** S2 does NOT widen
  the eligible set to admit color/computed-unit composite (those stay rAF — the existing
  eligibility discipline holds; the WAAPI composite path runs ONLY where it is pixel-correct).
- **S3 — the non-numeric refusal decision (NEW-39 resolved).** Locus: the blend leaf's
  non-numeric branch (`group.ts:339-341,367-369` — the existing `replace`-fallback for non-numeric
  units) + the diagnostics emit (S4). The DECISION (named in this spec, not left to impl): ship
  the numeric + transform-list-concat subset where WAAPI `composite` is well-defined; the color /
  `<custom-ident>` / discrete leaf `replace`-falls-back AND emits a `COMPOSITION_FALLBACK`
  diagnostic naming the property and the reason. **WHY contained:** the CSS spec answers per
  property type (numeric add, transform-list concatenation, discrete = replace-at-50%); kf's leaf
  already does the safe subset (`replace`-fallback for non-numeric); S3 is the explicit choice of
  the eligible subset + the honesty row, "a contained decision, not a research project"
  (`../audit/frontier/waapi-level-2.md §4.4`). **The transform-list concat case is decided IN
  this wave** — either it ships (transform-list `add` = concatenation, matching CSS) with a parity
  gate row, or it books with a named tripwire; the impl does not guess. **NO-WORKAROUND:** the
  fallback is NEVER silent — a non-honored leaf ALWAYS emits its diagnostic row (the
  replay-equality invariant's "honest refusal" clause applied to the blend leaf).
- **S4 — the diagnostics channel (the consumed producer).** Locus: `adapter.ts:18`
  (`ResolvedKeyframes` gains `diagnostics: ParseDiagnostic[]`) + the consume of the value.js
  0.12.0 `OnParseError`/`ParseDiagnostic` producer threaded through `resolveKeyframes`. The
  channel carries: the composition-fallback row (S3), the engine-internal EMPTY_PARSE /
  UNKNOWN_TIMING_FN rows (J.W1-landed — `../L-SEED.md §4` K3-internal; W7 lifts them onto the
  structured field), and the value.js parse diagnostics surfaced through `OnParseError`. The
  CORS-skip and WAAPI-ineligibility rows are PRODUCED by K.W8 (which has the CSSOM walk) — W7
  AUTHORS the field; W8 populates the ingest rows. **WHY consume, not author:** `VALUEJS-N2-ASKS.md
  §2 row 10` — "the L channel decision should prefer [the value.js producer] over authoring a
  kf-local channel; the full-diagnostics deferral resolves by CONSUME, not authorship." This is
  the acyclic-spine in its RIPE form: value.js ships the producer, kf consumes it one tranche
  behind (the producer shipped in 0.12.0; kf consumes on the K.W1 re-pin). **NO-WORKAROUND:** NOT
  a kf-local diagnostics framework re-implementing the producer (the published producer is
  consumed; a kf-local re-author would breach inv-16 published-only consumption AND the
  net-deletion idiom — there is nothing to delete, but a re-author would be the legacy the mandate
  forbids); NOT a logging framework (a flat additive field with stable codes, KISS).

## §Hard gate (the proof:* that BITES — born-RED in the FRONTIER sense · the round-trip's fidelity floor)

**The oracle (per the gate-ORACLE precept + the replay-equality + engine-write-disambiguation
invariants):** `proof:composition-honored` drives a 2-keyframe `composite:add` animation on BOTH
the rAF path and the WAAPI path and asserts the mid-frame value is the SUM, not the replace — the
engine's OWN blend write, never decorative churn. `proof:diagnostics-channel` asserts every
silent-fallback site is mirrored by a diagnostic row. Both are born-RED in the FRONTIER sense: the
engine has ZERO reads of the captured value today (the capability is ABSENT, not regressed).

- **clause (a) — the rAF `add` honoring produces the SUM (CORRECTNESS).** A 2-keyframe
  `@keyframes x { 0% { opacity: 0.5 } 100% { opacity: 0.5; animation-composition: add } }` over a
  target with underlying `opacity: 0.3`: at the mid-frame the rAF apply writes the SUM
  (`0.3 + lerp(0.5,0.5) = 0.8`), NOT the replace (`0.5`). The assert reads the ENGINE's apply
  write (the inline-style mutation attributable to `interpFrames(apply=true)` — the
  `proof:subject-animates` discipline from K.W0/K.W5, the engine-write channel), never bare
  `getComputedStyle` churn. **BORN-RED WITNESS:** on today's tree the engine drops the operator
  (`grep "composition" engine.ts` = ZERO) → the mid-frame is the replace (`0.5`) → the SUM assert
  REDS. **BITE:** reds on the pre-cure tree (the operator is dropped); greens on S1 (the captured
  Map is read, the leaf accumulates). **NO escape:** the assert is the SUM value, an engine-write
  the `replace` path provably cannot produce.
- **clause (b) — the rAF `accumulate` is repeat-aware (CORRECTNESS).** A `composite:accumulate`
  animation with `iteration-count: 2`: iteration 2 accumulates onto iteration 1's end value (per
  the CSS spec's repeat-aware accumulation), NOT a fresh replace each iteration. **BITE:** reds on
  the pre-cure tree (no accumulate semantic exists); greens on S1's `accumulate` leaf. **NO
  escape:** the second-iteration value is provably distinct under accumulate vs replace.
- **clause (c) — rAF↔WAAPI PARITY (CORRECTNESS — the load-bearing cross-backend assert).** The
  SAME `composite:add` keyframe produces the SAME mid-frame value on the rAF path (S1) and the
  WAAPI path (S2) — pixel-compared (the chrome-devtools-mcp screenshot-diff idiom) or
  computed-style-compared within ε. **WHY load-bearing:** the round-trip's honesty is that the
  operator is honored IDENTICALLY regardless of backend; a divergence is a silent infidelity.
  **BORN-RED WITNESS:** today `waapi.ts` emits no `composite` → the WAAPI path runs `replace`
  while (post-S1) the rAF path runs `add` → parity REDS. **BITE:** reds whenever one backend
  honors and the other drops; greens when both honor. **NO escape:** parity is the SUM-vs-SUM
  comparison across backends.
- **clause (d) — the non-numeric fallback is HONEST (CORRECTNESS — the refusal surface).** A
  `composite:add` on a COLOR keyframe (no faithful numeric add) `replace`-falls-back AND emits a
  `COMPOSITION_FALLBACK` diagnostic naming the property + reason; it does NOT silently produce a
  wrong color SUM. **BITE:** reds if a non-numeric leaf either (i) produces a garbage SUM (silent
  infidelity) or (ii) falls back with NO diagnostic (silent drop — the class the proof culture
  forbids). **NO escape:** the fallback ALWAYS carries its row (the replay-equality invariant's
  honest-refusal clause).
- **clause (e) — the diagnostics channel mirrors every silent-fallback site
  (`proof:diagnostics-channel`; CORRECTNESS).** Each diagnostic `code` has a born-RED test: an
  empty parse emits `EMPTY_PARSE`; an unrecognized per-stop timing fn emits `UNKNOWN_TIMING_FN`;
  a composition fallback emits `COMPOSITION_FALLBACK`. The channel is correct IFF every
  silent-fallback site in `adapter.ts`/`engine.ts` is mirrored by a diagnostic row
  (`../audit/frontier/live-stylesheet-ingestion.md §3 K3` measure-first gate). **BORN-RED
  WITNESS:** `ResolvedKeyframes` has no `diagnostics` field today (`grep "diagnostics" adapter.ts`
  = ZERO) → the channel-population assert REDS. **BITE:** reds if a silent fallback exists without
  its row. **NO escape:** the producer is the value.js `OnParseError`; the rows are the consumed
  surface, not a kf re-author.
- **clause (f) — the `interpFrames` hot path does NOT regress (HYGIENE — labeled, MEASURE-FIRST).**
  The `bench/interpolation.bench.ts` `composite:add` row holds the recorded ~996k ops/s `replace`
  baseline within the bench's ε (a predictable per-keyframe-constant branch is free). *(Labeled
  HYGIENE — it corroborates that the honoring is zero-cost on the `replace` path but the wave's
  GREEN does not depend on a perf number; it depends on the correctness clauses (a)-(e).)*

**The §spine bar — MUST bite.** Clauses (a)-(e) are the fidelity-floor correctness oracle: the
gate drives a real `composite:add`/`accumulate` animation over the BUILT `dist/keyframes.js`,
reads the ENGINE's own blend write (the SUM value, the engine-write channel — never decorative
churn), asserts rAF↔WAAPI parity, and the diagnostics channel mirrors every silent fallback.
Revert S1 → (a)(b) red (the operator is dropped, the mid-frame is the replace). Revert S2 → (c)
red (WAAPI runs replace while rAF runs add). Revert S4 → (e) red (no field to populate). **The
born-RED witness is CONCRETE:** today's tree has ZERO `composition` reads in `engine.ts` and ZERO
`composite` emits in `waapi.ts` (the §State-verified grep), so a `composite:add` animation
produces the REPLACE value on both paths — the new clauses red on exactly that observed shape.
**Two-tier taxonomy:** the wave's GREEN depends on the correctness clauses (a)-(e); clause (f) is
a HYGIENE corroborator (the hot-path bench may NEVER substitute for a red correctness clause).
**Replay-equality posture (declared):** this wave's honoring is the PRECONDITION for K.W10's
compile replay-equality — a compiled `animation-composition: add` block replays pixel-equal to JS
playback ONLY because the JS playback (post-W7) honors `add`; W7 is born-RED in the FRONTIER sense
(the engine drops the operator today), and the wave never claims the floor landed until clauses
(a)-(e) are GREEN. **P6 posture (declared):** clauses (a)-(e) are device-INDEPENDENT correctness
gates (the SUM value / the parity / the diagnostic row are computed facts, device-independent) →
they hard-gate on the Linux runner; the WAAPI parity leg (c) that needs a real compositor runs on
the headed chrome-devtools-mcp tier with a per-EXPECTED predicate (the SUM value), NOT a fixed
settle. **Budget 0** (the gate asserts a POSITIVE product property — the operator is honored — not
an error count; the pre-cure tree threw NOTHING, it silently dropped). **value.js gate status:**
RIPE-CONSUMED — `ParseDiagnostic`/`OnParseError` shipped in 0.12.0; W7 carries NO acyclic-spine
born-RED edge (the one frontier wave whose every dependency is already published; the consume
rides the K.W1 re-pin).

## §No-workaround prohibitions (BINDING — the mandate's named forbiddings for this wave)

- **NO re-parse of the CSS at apply time (S1).** The honoring is the engine READING the captured
  `resolved.composition` Map (already populated at `adapter.ts:120-126`), NOT a re-parse of the
  `@keyframes` text at apply time. Re-parsing would re-introduce the doc-rot the audit forbids
  (the value is already in the data model; the round-trip is the parser run ONCE, the engine
  reading the parsed form).
- **NO widening the WAAPI eligible set to admit color/computed-unit composite (S2).** Color and
  computed-unit composite cases STAY on the rAF path — the existing `isWAAPIEligible` discipline
  holds (`waapi.ts` rejects color interp + computed units regardless of composite). S2 forwards
  `composite` ONLY where the animation is already WAAPI-eligible; it never makes an ineligible
  animation eligible because it carries a composite operator.
- **NO silent fallback (S3/S4).** A non-honored blend leaf (a non-numeric `add`) ALWAYS emits its
  `COMPOSITION_FALLBACK` diagnostic — never a silent `replace` substitution and never a garbage
  SUM. The honest-refusal clause of the replay-equality invariant applies to the blend leaf: what
  cannot be honored faithfully is REFUSED with a named reason, never silently approximated
  (`K.md §invariant set`).
- **NO kf-local diagnostics framework (S4).** The `diagnostics` channel CONSUMES the value.js
  0.12.0 `ParseDiagnostic`/`OnParseError` producer (`VALUEJS-N2-ASKS.md §2 row 10`), NOT a
  re-authored kf-local channel. A kf-local re-author breaches inv-16 (published-only consumption)
  AND is the legacy-beside-its-replacement the mandate forbids. It is a FLAT additive field with
  stable codes, NOT a logging framework (KISS).
- **NO raised distinct-count / decorative-churn read in the gate.** `proof:composition-honored`
  reads the engine's OWN blend write (the SUM value, the inline-style mutation attributable to the
  apply), never bare `getComputedStyle` churn or the `.idle-hover` bob — the engine-write
  disambiguation rule (`K.md §invariant set`) carries into the frontier band exactly as it does
  in K.W0/K.W5.
- **NO touching the W11 blend-WEIGHT tier (the §Hand-off file seam).** W7 reads the blend-MODE
  leaf (`group.ts:316-375` — the `add`/`accumulate`/`replace` operator); W11 drives the
  blend-WEIGHT (`group.ts` `layer.weight` → a spring). They are file-adjacent in `group.ts` and
  run ∥ — the boundary is BINDING (§Hand-off §4B): W7's diff is the per-keyframe COMPOSITION
  operator read; W11's diff is the per-layer WEIGHT stepper read. Neither edits the other's lines.

## §Folds (every K.md-assigned fold, with its frontier-lane + L-SEED/N2 citation)

- **WL2-B / FB-1** (the animation-composition HONORING) — S1 (rAF honoring) + S2 (WAAPI
  honoring) + S3 (the non-numeric refusal). `../L-SEED.md §2 WL2-B` + the §body→K.W7 map;
  `../audit/frontier/waapi-level-2.md §4` (the FB-1 headline, K-CANDIDATE, effort M);
  `adapter.ts:24-29,120-126` (captured), `engine.ts` (ZERO reads — born-RED), `group.ts:316-375`
  (the G.W17-fixed leaf). **The fidelity floor the compiler (K.W10) inverts.**
- **K3 / LD-DIAG / DL-K17** (the diagnostics channel) — S4 (the `ResolvedKeyframes.diagnostics`
  field consuming the value.js 0.12.0 `ParseDiagnostic`/`OnParseError` producer). `../L-SEED.md §7`
  + `../audit/frontier/live-stylesheet-ingestion.md §3 K3`; `VALUEJS-N2-ASKS.md §2 row 10`
  (the RIPE consume edge); `deferred-ledger-k.md` DL-K17. **DL-K17 exits via the
  published-consume-edge form** (the producer shipped in 0.12.0; the consume rides the K.W1
  re-pin) — co-discharged in K.W6's terminations band (the row is named in BOTH waves; W7 lights
  the consume, W6 records the chronic exit).
- **The two engine-internal diagnostic rows (EMPTY_PARSE / UNKNOWN_TIMING_FN)** — J.W1-landed
  (`../L-SEED.md §4` K3-internal: "the two engine-internal diagnostics rows ride the same totality
  motion as the typed selector throw; the FULL diagnostics channel stays K.W0 [now K.W7]"); W7
  LIFTS them onto the structured `diagnostics` field (S4). NOT re-authored — the J.W1 throws
  become rows on the new field.

## §Hand-off (the BINDING file-ownership boundary — §4B of the README, restated)

W7 is the FIRST Band-II wave; it touches `engine.ts` (the honoring read) and `adapter.ts` (the
`diagnostics` field). The disjoint-loci contract (`waves/README.md §4B`):

- **`engine.ts` is W7's (the honoring read), NOT W10's.** W7 reads `resolved.composition` in the
  `fromString` keyframe loop. W10's compiler is a NEW module over the `format.ts` serialize
  lineage — it does NOT edit `engine.ts`'s interp path. W7 lands FIRST (it LEADS Band II); W10
  then INVERTS the honoring by EMITTING the `animation-composition` layering — a read-then-emit
  dependency, NOT a co-edit of `engine.ts`.
- **`adapter.ts` is touched by BOTH W7 (the `diagnostics` field on `ResolvedKeyframes`) and W8
  (the `fromStyleSheets()` producer that calls `resolveKeyframes`).** They edit DISJOINT concerns:
  the TYPE (W7) vs the new CSSOM-walk producer (W8). W8 FOLLOWS W7 (it consumes the diagnostics
  channel), so these land in SEQUENCE, not in parallel — the seam is temporal.
- **`group.ts` blend-MODE leaf is W7's; `group.ts` blend-WEIGHT tier is W11's.** W7 reads the
  per-keyframe COMPOSITION operator into the `add`/`accumulate`/`replace` leaf (`group.ts:316-375`);
  W11 reads the per-layer WEIGHT into a spring (`group.ts` `layer.weight`). File-adjacent, run ∥,
  DISJOINT line concerns — the boundary is a HARD CONTRACT (each wave's §Hard gate reds only on
  its half).
- **The value.js consume edge (the `ParseDiagnostic` producer) is a PUBLISHED consume, NOT a
  `file:` link or a vendored copy** (the acyclic-spine invariant). It rides the K.W1 re-pin
  (`^0.11.2 → ^0.12.0`); W7 consumes the producer one tranche behind, born-RED-gated kf-side (the
  field is absent today; the consume lights on the re-pin). W7 is the RIPE case — no OPEN gate, no
  unpublished symbol; the producer is already on npm.

## §Design-decisions (the named calls this spec makes, so the impl does not re-litigate)

- **The honoring leads the frontier band, NOT the compiler.** The compiler (K.W10) is the
  round-trip's backward direction; it cannot faithfully EMIT a layering operator the engine cannot
  faithfully HONOR (a lossy emitter forfeits the moat — `K.md §MANDATE`). So the floor lands
  first: the engine honors `add`/`accumulate`, THEN the compiler emits it knowing the JS playback
  it round-trips against is itself faithful. This ordering is the replay-equality invariant made
  causal (W10's compile replay-equality is provable ONLY on W7's honest substrate).
- **The non-numeric subset is decided HERE (S3), not at impl.** Ship numeric + transform-list-concat
  where WAAPI `composite` is well-defined; `replace`-fallback + diagnose the color/`<custom-ident>`/
  discrete leaf. The transform-list concat case ships WITH a parity gate row IF the leaf's
  concatenation matches CSS, else books with the named tripwire "transform-list `add` parity
  proven" — the impl picks ship-vs-book on the parity measurement, not on guesswork
  (`../audit/frontier/waapi-level-2.md §4.4` "a contained decision, not a research project").
- **The diagnostics channel is a CONSUME, not an authorship (S4).** The value.js 0.12.0 producer
  is the structured sink; kf consumes it. This is the acyclic-spine's RIPE form — the one place in
  Band II where value.js's grammar is ALREADY published, so the consume edge lights immediately on
  the K.W1 re-pin with no born-RED wait (unlike K.W9/K.W10's CC-2, which gate on the OPEN VJ.W1/VJ.W2).
- **The fidelity floor is value.js-INDEPENDENT for the honoring itself.** S1/S2/S3 read a value
  ALREADY captured by the SHIPPED 0.11.2/0.12.0 adapter — the honoring needs no net-new value.js
  grammar; only S4's diagnostics CONSUME edge rides the (already-published) 0.12.0 producer. So W7
  can author and run the moment K.W0/K.W1 land — it does not wait on value.js's post-N tranche
  (that is K.W9/K.W10's wait).
