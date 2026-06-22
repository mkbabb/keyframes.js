# P.W9 — Correctness: named-selector NaN-frame cure + grammar-fuzz harness + differential oracle

**Band:** D — Correctness.
**Phase:** NOW — kf-internal, zero sibling dependency for the primary NaN cure + fuzz harness;
the CDP differential oracle is a browser-tier gate (Playwright already in devDependencies).
**Sequence (the DAG edge):**
```
O.W3 (the Path-A throw spec, DEVELOPED-not-IMPLEMENTED) ─► P.W9 (this wave — IMPLEMENTS O.W3
   + extends the correctness oracle frontier with the grammar-fuzz harness and the kf-vs-browser
   differential oracle)
```
O.W3 authored the *specification* for the NaN-frame cure (Path A: throw `NAMED_SELECTOR_NO_TIMELINE`
in `parse()` before the NaN-producing sort) but — like all of O — was NEVER IMPLEMENTED. P.W9 is
the implementation tranche. It carries O.W3's designed cure faithfully (zero scope change) and adds
TWO new correctness oracle ideas from `AUDIT-DIGEST.md` X4-correctness: the fast-check grammar-fuzz
harness (V3-N5 / X4-N2) and the kf-vs-browser differential oracle (X4-N1). These three form one
Band-D wave because they share a single invariant: correctness is observable only at runtime over
real CSS, not by grepping source shapes.

**Owning DM / ideas:**
- **DM-22** (the NaN-always-active frame chronic, O.W3's principal subject — `AUDIT-DIGEST.md`
  X4 BLOCKER finding + F1-chronic HIGH·correctness)
- **X4-N2 (grammar-fuzz harness)** — `AUDIT-DIGEST.md` X4: "property-based grammar fuzz oracle:
  serialization idempotence over randomly generated CSS value strings"
- **X4-N1 (differential oracle)** — `AUDIT-DIGEST.md` X4: "differential browser oracle: compare
  kf.at(t) against live WAAPI getKeyframes() midpoint for every roundtrip-fidelity corpus fixture"
- **V3-N5 (grammar fuzz in value.js)** — `AUDIT-DIGEST.md` V3: "Grammar fuzz harness: fast-check
  model-based CSS generator with structural equality oracle" (the kf side of a dispatch item)

---

## Context

### The exact defect chain (all refs verified on today's tree, 2026-06-20)

The named-selector NaN bug has been DEVELOPED-and-documented across three tranches (M.W5 → O.W3)
without ever being IMPLEMENTED. The defect chain, inherited verbatim from O.W3, confirmed live:

| Step | Location | Verified fact |
|------|----------|---------------|
| 1 | `frame-compiler.ts:128` | `NAMED_SELECTOR_SUPERTYPE = "named-selector"` WRITTEN in `addFrame` — never READ in `parse()`, `engine.ts`, or `timeline.ts` (dead write confirmed by grep) |
| 2 | `frame-compiler.ts:228–231` | `addFrame` stores `new ValueUnit(selector, undefined, [NAMED_SELECTOR_SUPERTYPE])` with `.value = "entry"` (the raw string) |
| 3 | `frame-compiler.ts:449` | `parse()` sorts `templateFrames` by `a.start.value - b.start.value` → `"entry" - "exit"` = `NaN` |
| 4 | `utils.ts:398` | `calcFrameTime`: `(start.value * duration) / 100` → `"entry" * 1000 / 100` = `NaN` (confirmed live: `node -e "'entry' * 1000 / 100"` → `NaN`) |
| 5 | `internal/binarySearch.ts:28–35` | NaN range: `value < NaN === false` AND `value > NaN === false` → the frame is ALWAYS-ACTIVE; every `interpFrames(t)` applies the named-selector frame's vars at every progress position |
| 6 | `internal/errors.ts:46` | `NAMED_SELECTOR_NO_TIMELINE` is a typed `AnimationOptionErrorCode` but zero throw sites exist (confirmed: `grep -rn "NAMED_SELECTOR_NO_TIMELINE" src/animation/` → errors.ts only, never thrown) |
| 7 | `scripts/proof-named-selector-nan-frame.mjs` | script absent (`ls` → no file) |
| 8 | `test/fixtures/keyframes/` | NO named-selector fixture CSS file in the corpus (confirmed: `ls test/fixtures/keyframes/` — 15 files, none with `entry`/`exit`) |

The `NAMED_SELECTOR_NO_TIMELINE` error code is typed, the `NAMED_SELECTOR_SUPERTYPE` constant is
written — both dead weight until this wave makes them live.

### Why this is Band-D correctness, not a carry-forward of Band-B (O.W3)

O.W3 was chartered in O Band B ("engine correctness") and was the implementation spec. P.W9 is
chartered in P Band D because P sequences ATOP O — P.W9 IMPLEMENTS the cure O.W3 specified AND
extends it with the novel correctness oracle ideas the audit found. The spec (throw Path A + the
`proof:named-selector-nan-frame` gate design + the `proof:replay-equality` S4 re-target) is
INHERITED from O.W3 with zero change; P.W9 adds S3 (the grammar-fuzz harness) and S4 (the
differential oracle) as the "two oracle ideas the corpus tests miss" (AUDIT-DIGEST.md X4).

### The grammar-fuzz harness (X4-N2 / V3-N5)

The three confirmed inv-O-2 breaches in value.js (none→NaN, color() wrapper loss, round()
strategy-omit — V3-grammar-correct lane) were all hand-discovered in an audit. A property-based /
model-based fuzz oracle would have caught them automatically. The kf side of this idea: author a
fast-check `fc.oneof(colorArb, mathArb, gradientStopArb)` Arbitrary that generates structurally
valid CSS fragments, parses them through the full `CSSKeyframesAnimation.fromString` pipeline, and
asserts that the round-trip is structurally equal (parse → serialize → re-parse produces
semantically identical frames). This is a **kf-hosted** gate because kf already imports value.js
and runs the full parse pipeline — it is the end-to-end oracle for the constellation's grammar
correctness. The value.js-internal fuzz (V3-N5) is a DISPATCH item; this is the kf-side consume.

**What would have been caught:** the none→NaN breach would have caused a color frame's `opacity`
channel to serialize as `"NaN"`, which is not a valid CSS number — the structural re-parse would
produce a different unit type, failing the equality check. The color() wrapper loss would have
caused `color(display-p3 ...)` to round-trip as `display-p3(...)` — a different function name,
failing the round-trip check. The round() strategy-omit would have thrown during parse — a gate
failure by exception.

### The kf-vs-browser differential oracle (X4-N1)

The existing `proof:roundtrip-fidelity` + `proof:replay-equality` oracles prove internal
consistency (kf→format→kf round-trip) but are blind to browser divergence. The differential oracle
drives the WAAPI `Element.animate(keyframes, opts).effect.getKeyframes()` path in a real Chromium
instance (Playwright, already a devDep) and compares the midpoint-interpolated value from WAAPI
against `kf.at(0.5)` for every fixture in `test/fixtures/keyframes/`. A divergence (e.g. an
oklab float-precision drift, a color gamut rounding discrepancy, an easing function mismatch)
surfaces as a gate failure. The gate operates at the corpus level — each fixture is a named row,
each mismatching row is a reported gap. This is the long-term correctness investment: it closes
the "JS model matches browser" claim that the existing purely-JS oracles cannot prove.

**Constraint: the differential oracle is sequential.** It requires the DM-23 vitest-browser runner
(O.W2) for the full inline test form. As a standalone gate script it uses the `scripts/lib/demo-
driver.mjs` `withPage`/`navToScene` Playwright harness already established. The gate does NOT
require a running demo (it injects its own minimal fixture page). Wired to `proof:correctness` with
`observe-only` posture on the Linux runner (browser-tier, the device-dependence lesson).

---

## Scope

### S1 — `parse()` throws `NAMED_SELECTOR_NO_TIMELINE` instead of producing NaN frames (Path A)

**Breach.** A bare named-selector `@keyframes` animation (no `ScrollTimeline` attached) ingests
without throwing and produces `frame.time = { start: NaN, stop: NaN }` (chain: `frame-compiler.ts:449`
sort → `utils.ts:398` `calcFrameTime`); `binarySearchRange` at `internal/binarySearch.ts:28–35`
treats the NaN range as ALWAYS-ACTIVE — every `interpFrames(t)` applies the named-selector frame's
vars at every progress position.

**Cure (Path A — the structured throw, from O.W3.md S1).** In `parse()` (`frame-compiler.ts:446`),
BEFORE the `templateFrames.sort(...)` that produces the NaN ordering, scan the template frames for
any entry where `start.superType?.includes(NAMED_SELECTOR_SUPERTYPE)`. If none → no-op (the common
path — zero behavior change for every non-named animation). If any such frame exists, throw:

```ts
throw new AnimationOptionError(
    "start",
    /* offending selector value */ start.value,
    `named scroll-range selector ("${start.value}") requires a ScrollTimeline or ` +
    `ManualTimeline to resolve to a numeric position; attach one before calling parse()`,
    "NAMED_SELECTOR_NO_TIMELINE",
);
```

The `NAMED_SELECTOR_SUPERTYPE` constant (written at `addFrame` time, `frame-compiler.ts:128`) is
NOW READ at the `parse()` seam — the dead write becomes live. The `NAMED_SELECTOR_NO_TIMELINE` code
(typed at `errors.ts:46`, never thrown) is NOW THROWN — the typed-never-thrown placeholder becomes
a real code path.

**Path B is explicitly excluded.** This wave does NOT bind named selectors to numeric `%` via a
`ScrollTimeline` phase mapper — that is Path B, requiring an optional timeline parameter to `parse()`
or a post-parse `bindTimeline()` re-resolve pass. Path B is a future wave. The `superType` read site
S1 creates is the exact seam Path B extends.

**Constraint.** The throw is the same `AnimationOptionError` the engine raises for all malformed-
present input. A named selector WITHOUT a timeline is malformed-present (an unresolvable position
was authored). No silent drop, no invented number, no fallback to 0 or 100%.

**Gate bite (S2 born-RED clause + S1 behavior).** `proof:named-selector-nan-frame` `throw-or-finite`
clause: RED today (NaN produced, no throw). Green after S1: `parse([])` on a bare `entry`/`exit`
animation throws `AnimationOptionError` with `code === "NAMED_SELECTOR_NO_TIMELINE"`.

### S2 — `proof:named-selector-nan-frame` born-RED gate (the standalone correctness gate)

**Breach.** No `proof:named-selector-nan-frame` gate exists (`ls scripts/proof-named-selector-nan-
frame.mjs` → no file). The existing `proof:replay-equality` S4 clause (`proof-replay-equality.mjs:173–178`)
is a source-shape regex (`/entry|exit|cover|contain/` over `frame-compiler.ts`) — GREEN on "the
token set appears in the guard" and BLIND to whether frame times are NaN (the inv-M-observable-truth
proxy failure the O.W3 charter documented).

**Cure (from O.W3.md S2 + S3).** Author `scripts/proof-named-selector-nan-frame.mjs`, a standalone
correctness gate. Wire into `proof:hygiene` alongside `proof:engine-correctness` (the hygiene roster
owns the unit-level correctness checks). Clauses:

1. **`throw-or-finite`** (the primary behavioral observable — born-RED today):

   ```js
   const anim = new CSSKeyframesAnimation().fromString(
       `@keyframes x { entry { opacity: 0 } exit { opacity: 1 } }`
   );
   try {
       anim.parse([]);
       // Must not reach here — check every frame time is finite
       const allFinite = anim.frames.every(
           f => Number.isFinite(f.time.start) && Number.isFinite(f.time.stop)
       );
       assert(allFinite, "parse() produced NaN frames without throwing");
   } catch (e) {
       assert(e instanceof AnimationOptionError, "wrong error type");
       assert(e.code === "NAMED_SELECTOR_NO_TIMELINE", "wrong error code");
   }
   ```

   RED today: `parse([])` does NOT throw; `frame.time = { start: NaN, stop: NaN }` —
   `Number.isFinite(NaN) === false` → the assertion fires. Green after S1.

2. **`dead-write-becomes-live`** (source-shape corroborator):
   `grep -n "NAMED_SELECTOR_SUPERTYPE" src/animation/frame-compiler.ts` returns hits in BOTH the
   `addFrame` write site AND in the `parse()` body. Today: parse() has zero hits → RED. Green after
   S1 inserts the scan.

3. **`no-throw-typed-becomes-thrown`** (source-shape corroborator):
   `grep -rn "NAMED_SELECTOR_NO_TIMELINE" src/animation/` returns hits beyond `errors.ts` (at
   minimum the `parse()` throw site). Today: only `errors.ts:46` → RED. Green after S1.

4. **`non-named-unaffected`** (regression guard — the common path is byte-identical):
   `new CSSKeyframesAnimation().fromString('@keyframes x { 0% {opacity:0} 100% {opacity:1} }').parse([])`
   does NOT throw, all frame times are finite. Must stay green before and after S1.

Additionally, **re-target the `proof:replay-equality` S4 clause** from the source-shape regex to
the behavioral anchor (throw-OR-finite contract). The new S4 clause drives the same named-selector
fixture through the engine and asserts the disjunction; the old regex is REPLACED (not kept).

### S3 — Grammar-fuzz harness: `proof:grammar-fuzz` with fast-check model arbitraries

**Breach.** No property-based / model-based fuzz harness exists in the keyframes.js test suite
(`grep -rn "fast-check\|fc\.\|fc\.oneof" test/ scripts/` → zero hits). The three confirmed inv-O-2
breaches in value.js (none→NaN, color() wrapper loss, round() strategy-omit) were all discovered
by manual audit — they would have been surfaced automatically by a round-trip fuzz oracle. The
`test/fixtures/keyframes/` corpus is hand-crafted and thin (15 files, zero named-selector, zero
color-none-channel, zero round()-with-omitted-strategy coverage — `AUDIT-DIGEST.md` X4: "corpus
coverage … entirely absent for property-based / differential-vs-browser testing").

**Cure.** Add `fast-check` as a devDependency (`npm install --save-dev fast-check`). Author
`test/grammar-fuzz.test.ts` — a vitest test that uses fast-check arbitraries to generate
structurally valid CSS `@keyframes` fragments and asserts round-trip structural equality:

```
Arbitrary<CSSFragment> → parse via CSSKeyframesAnimation.fromString()
  → serialize via format.ts (format())
  → re-parse via CSSKeyframesAnimation.fromString()
  → assert: every compiled frame in round-1 and round-2 has the same property keys, the same
    value units (by unit string), and numerically close values (|v₁ - v₂| < 1e-4 for numeric
    leaves — tolerating float-precision serialization rounding)
```

**The three Arbitrary families** (model-grammar, not raw-string fuzz):

1. **`colorArb`** — generates `oklch(L C H)`, `oklch(L none H)` (the none-channel form),
   `color(display-p3 R G B)` (the wrapper-loss form), `rgb(R,G,B)`, `color-mix(in oklch, ...)` with
   bounded numeric channels from `fc.float({ min: 0, max: 1 })`. The `oklch(L none H)` arm is the
   planted regression for the none→NaN breach.

2. **`mathArb`** — generates `calc(<expr>)`, `clamp(<min>, <val>, <max>)` with `fc.float()` leaves.
   The `round(<number>)` (bare strategy-omit) arm is **SKIPPED** (not a permanent-RED born-RED): it
   is omitted from `mathArb` until value.js P ships the strategy-branch fix, then added in a
   follow-on commit. The gate uses `fc.context()` to document the skipped arm with
   `"round-strategy-omit: SKIP until value.js P — V3-correctness dispatch"` so the harness is
   useful and GREEN on today's value.js 1.0.2, not blocked on a sibling.

3. **`keyframeStopArb`** — generates `@keyframes x { <stop%> { <prop>: <colorArb|mathArb> } }` with
   `fc.integer({ min: 0, max: 100 })` selector percentages, one to three stops.

**Born-RED only on the absent devDep, not on the sibling fix.** The fuzz harness is born-RED today
because `fast-check` is absent from devDependencies (the gate cannot import it → exits 1). Once
`fast-check` is added, the `colorArb` + `keyframeStopArb` arms run TODAY against value.js 1.0.2
and are GREEN (the none→NaN breach and the color() wrapper-loss form are already fixed in 1.0.2).
The `round(<number>)` arm is SKIPPED (not RED) until value.js P ships — so the harness ships
useful coverage now and gains the round() arm as a follow-on. A harness that is permanently RED
until a sibling ships is a blocked harness — the SKIP posture makes it immediately useful.

**Gate:** `proof:grammar-fuzz` (NEW — `node scripts/proof-grammar-fuzz.mjs`, thin wrapper driving
`vitest run test/grammar-fuzz.test.ts`). Wire into `proof:hygiene` alongside
`proof:roundtrip-fidelity`. The fast-check run defaults to 200 cases; the gate times out at 30s.
Seed is fixed (`fc.seed(42)`) for reproducibility on CI; a randomized run is available as a
`proof:grammar-fuzz-random` variant for pre-release stress sweeps.

**Planted-failure (born-RED proof).** Today: `fast-check` is absent from `devDependencies`
(`grep "fast-check" package.json` → zero hits) — the gate script cannot import it → exits 1.
After `fast-check` is added: the `colorArb` + `keyframeStopArb` arms run against today's
value.js 1.0.2 and turn GREEN immediately (the `none→NaN` and `color()` wrapper-loss forms are
fixed in 1.0.2). The `round(<number>)` arm is SKIPPED with an explicit note — the gate is GREEN
and useful now. When value.js P ships the round() fix, add the `round(<number>)` case to `mathArb`
and remove the SKIP — the gate stays GREEN through the extension.

### S4 — Differential oracle: `proof:kf-differential` kf.at(t) vs WAAPI interpolation

**Breach.** The existing correctness oracles (`proof:roundtrip-fidelity`, `proof:replay-equality`)
are purely JS-model oracles — they prove internal consistency but cannot detect browser
divergences. No browser-differential gate exists (`ls scripts/proof-kf-differential*` → no file;
`ls scripts/proof-differential*` → no file — confirmed).

**Cure.** Author `scripts/proof-kf-differential.mjs` using the established Playwright harness
(`scripts/lib/demo-driver.mjs` `withPage`). The gate does NOT use `navToScene` (it does not
exercise the demo); instead it injects a minimal fixture page with a blank `<div id="target">`
and the dist bundle, then for each fixture file in `test/fixtures/keyframes/` runs:

```
1. Parse: new CSSKeyframesAnimation(opts).fromString(css) → kf (kf-side)
2. Sample: kfMid = kf.at(0.5) → { [prop]: value } map for all animated props
3. WAAPI: target.animate(kf.toWAAPIKeyframes(), kf.toWAAPIOptions()).effect.getKeyframes()
          → sample the midpoint frame from the browser's WAAPI getKeyframes() output
4. Compare: for each numeric property in kfMid, assert |kfMid[prop] - waapiMid[prop]| < TOLERANCE
            (tolerance = 0.01 for opacity/unitless, 0.5px for length properties,
             2° for hue channels — browser float formatting allows modest rounding)
```

**The WAAPI divergence surface.** WAAPI `getKeyframes()` returns the browser's interpolated stops,
not raw keyframe values. At `t = 0.5` with a `linear` (or `ease`) timing function, the browser
applies its own interpolation — which for numeric+unit properties should match kf's linear lerp
within tolerance. A divergence flags either: a kf lerp bug (a percentage-vs-unitless confusion), a
color space discrepancy (WAAPI defaults to `sRGB`; kf defaults to `oklab` — the oracle uses
`srgb` color space on test fixtures to ensure identical gamut), or an easing mis-application.

**Corpus subset.** The gate runs the subset of `test/fixtures/keyframes/` that is WAAPI-eligible
(no computed units, no color interpolation in non-sRGB space, uniform timing): `opacity-3stop.css`,
`multi-prop.css`, `transform-multiarg.css`, `per-kf-easing.css`. The non-eligible fixtures
(color-achromatic, color-chromatic, var-calc, box-shadow) are SKIPPED with a note — they would
require a custom color-space normalization step the gate defers to a future extension.

**CI posture: `observe-only` on Linux runner.** The differential oracle is a browser-tier gate.
Per the device-dependence lesson (`project_ci_device_dependence_greening`): declare `declarePosture
("observe-only", { reason: "browser differential — Chromium render timing varies on slow runner" })`
in `ci-env.mjs`. The gate runs on macOS CI + local but does not block the Linux runner. Wire into
`proof:correctness` (the RUNTIME interaction tier), NOT into `proof:hygiene` (headless unit gates
only).

**Born-RED (the planted regression).** The gate is born-RED today because the script file is
absent (exits 1 on `ls`). After authoring the script, RED on the WAAPI-ineligible-subset branch
(the gate would skip too many fixtures and report < 4 eligible rows — a minimum-coverage
assertion). GREEN after the eligible-subset is confirmed and all four core fixtures produce
`|kf.at(0.5) - waapiMid| < TOLERANCE` for all numeric properties.

**Note on the full differential oracle (X4-N1 deferred body).** The AUDIT-DIGEST.md X4-N1 idea
extends this to ALL corpus fixtures (not just WAAPI-eligible), using CDP `getComputedStyle` to
sample the browser's mid-animation paint rather than WAAPI `getKeyframes()`. That full-corpus path
requires the DM-23 vitest-browser runner (O.W2 deliverable) and is a P-tranche deferred item
(recorded in `deferred-ledger-P.md`). S4 is the SUBSET that is immediately implementable over the
existing Playwright harness and proves the differential-oracle infrastructure works before
committing to the broader CDP path.

---

## Born-RED gate

**Primary gate:** `proof:named-selector-nan-frame` (NEW — `scripts/proof-named-selector-nan-frame.mjs`).
**Secondary gates:** `proof:grammar-fuzz` (NEW) · `proof:kf-differential` (NEW).

The four born-RED observables, witnessed on today's tree:

| Gate / clause | Witness today (the GENUINE defect) | RED observable | GREEN condition |
|---|---|---|---|
| `proof:named-selector-nan-frame` `throw-or-finite` **(KEYSTONE)** | `new CSSKeyframesAnimation().fromString('@keyframes x { entry {opacity:0} exit {opacity:1} }').parse([])` does NOT throw; produces `frame.time = {start: NaN, stop: NaN}` — confirmed live with `node -e "'entry'*1000/100"` → `NaN` | `Number.isFinite(frame.time.start) === false` AND no throw | `parse([])` throws `AnimationOptionError` with `code === "NAMED_SELECTOR_NO_TIMELINE"` |
| `proof:named-selector-nan-frame` `dead-write-becomes-live` | `grep "NAMED_SELECTOR_SUPERTYPE" frame-compiler.ts` → write site only, zero reads in `parse()` body | `parse()` body has zero `NAMED_SELECTOR_SUPERTYPE` reads | `parse()` body reads `NAMED_SELECTOR_SUPERTYPE` in the pre-sort scan |
| `proof:named-selector-nan-frame` `no-throw-typed-becomes-thrown` | `grep -rn "NAMED_SELECTOR_NO_TIMELINE" src/animation/` → `errors.ts:46` only, zero throw sites | zero throw sites | at least one throw site in `frame-compiler.ts:parse()` |
| `proof:grammar-fuzz` (harness absent) | `grep "fast-check" package.json` → zero; `test/grammar-fuzz.test.ts` absent | gate script cannot import `fast-check` → exits 1 | `fast-check` in devDeps; 200 generated CSS fragments (colorArb + keyframeStopArb arms) parse + round-trip with structural equality; `round()` arm SKIPPED with explicit note until value.js P |
| `proof:kf-differential` (script absent) | `ls scripts/proof-kf-differential.mjs` → no file | exits 1 | script present; ≥4 WAAPI-eligible fixtures run; all numeric props within tolerance |

**Born-RED on the keystone defect (the NaN-frame bug).** The `throw-or-finite` clause is the
genuine observable of DM-22: `parse([])` on a bare named-selector animation produces always-active
NaN frames. Neither the throw disjunct (the error code is typed but never thrown) nor the finite
disjunct (NaN is not finite) holds. A gate that merely greps for `NAMED_SELECTOR_SUPERTYPE` in
source would green on the DEAD WRITE — it would pass today while the bug is live. The
`throw-or-finite` runtime assertion is the ONLY gate that bites the genuine defect.

**Planted-failure (born-RED proof).** To confirm the gate was authored before the cure:

1. On an unmodified tree (today's master), `proof:named-selector-nan-frame` exits 1 — the
   `throw-or-finite` clause fires because `parse([])` produces NaN frames.
2. If a future stub inserts the error throw WITHOUT fixing the actual NaN path (e.g. an empty
   `if(NAMED_SELECTOR_SUPERTYPE...) throw` at the top of `parse()` that never reaches the sort),
   the `dead-write-becomes-live` clause confirms the SUPERTYPE constant is read — but the
   `non-named-unaffected` regression guard catches any over-throw (non-named animations must not
   throw). The three corroborator clauses together prevent a false-green stub.
3. The `proof:grammar-fuzz` gate's `round(<number>)` arm is SKIPPED (not a permanent-RED planted
   regression — CONTRIVANCE-AUDIT.md #5): the harness ships with `colorArb` + `keyframeStopArb`
   arms GREEN on today's value.js 1.0.2; the round() arm is added as a follow-on when value.js P
   ships the fix. A gate that is permanently RED on a sibling is a blocked gate — the SKIP posture
   ships useful coverage now.

---

## Dependencies

- **value.js 1.0.2 (already pinned) — NO sibling gate for S1/S2.** `ValueUnit.superType?: string[]`
  is a published top-level field in `dist/units/index.d.ts`; `parse()` can read
  `frame.start.superType?.includes(NAMED_SELECTOR_SUPERTYPE)` TODAY. S1 + S2 are pure kf-internal
  changes with zero cross-repo dependency.

- **S3 grammar-fuzz is GREEN on today's value.js 1.0.2.** The `colorArb` + `keyframeStopArb` arms
  work against the current value.js and turn GREEN immediately once `fast-check` is added. The
  `round(<number>)` arm is SKIPPED (not a permanent-RED blocking dep) until value.js P ships the
  round() strategy-branch fix — see CONTRIVANCE-AUDIT.md #5. Wire the gate with a clear skip note:
  `"round-strategy-omit: SKIP until value.js P — V3-correctness dispatch"`. The gate is useful now,
  not blocked on a sibling. The round() arm is a follow-on addition, not a gate-blocking precondition.

- **S4 differential oracle depends on O.W2 (DM-23 vitest-browser runner) for the FULL oracle path.**
  The subset (WAAPI-eligible fixtures via Playwright) is implementable NOW using the established
  `demo-driver.mjs` harness. The full CDP `getComputedStyle` path is deferred to a P.WZ+ item
  pending O.W2's landing.

- **Playwright (already a devDependency) — S4.** `node_modules/playwright` is present
  (`package.json devDependencies`); `scripts/lib/demo-driver.mjs` is the established harness.
  No new browser dependency for S4.

- **fast-check (NEW devDependency) — S3.** Must be added via `npm install --save-dev fast-check`
  before `test/grammar-fuzz.test.ts` is authored. Version: `^3.x` (the current stable major).

- **Couples to O.W3 spec** — P.W9 implements O.W3 faithfully (Path A throw, S1 + the
  `proof:replay-equality` S4 re-target from O.W3 S2). O.W3's spec is AUTHORITATIVE for S1/S2;
  P.W9 adds S3/S4 as novel oracle extensions. Zero spec conflict.

- **Couples to value.js P (DISPATCH) for the round() arm only.** The grammar-fuzz harness (S3)
  ships GREEN on today's value.js 1.0.2 (the `colorArb` + `keyframeStopArb` arms). The round()
  arm is SKIPPED until value.js P ships the strategy-branch fix; the skip is recorded in the
  dispatch packet `docs/tranches/P/KF-TO-VALUEJS-P.md`. The harness is NOT blocked on value.js P
  for its initial authoring and CI wiring.

- **Independent of every other P-Band wave.** P.W9 touches:
  `src/animation/frame-compiler.ts` (insert the `NAMED_SELECTOR_SUPERTYPE` scan in `parse()`) +
  `scripts/proof-named-selector-nan-frame.mjs` (NEW) +
  `scripts/proof-grammar-fuzz.mjs` (NEW, thin wrapper) +
  `scripts/proof-kf-differential.mjs` (NEW) +
  `test/grammar-fuzz.test.ts` (NEW) +
  `test/fixtures/keyframes/` (add `named-selector.css` fixture) +
  `scripts/proof-replay-equality.mjs` (S4 clause re-target) +
  `package.json` (add devDep + gate wiring).

  No collision with P Band B (engine-perf, touches `engine.ts`/`group.ts`), P Band C (demo-fleet,
  touches demo/), P Band E (no-legacy, touches `leaves.ts` externalization), P Band F (unblock,
  touches `utils.ts` Symbol→WeakMap), or P Band G (consume, touches demo glass-ui call sites).

---

## dev→impl boundary

This file is the Tranche P DEVELOPMENT spec for P.W9 — DOCS ONLY. It writes zero engine, demo,
or library source (inv-16: kf writes only keyframes.js; the value.js round() fix is a DISPATCH,
not a kf edit). The IMPLEMENTATION opens only on the owner's explicit authorization, per the P.md
dev→impl boundary (P.md:7-9). When it opens, the implementation order is:

1. **Gate-first** (the P-inv-28 born-RED requirement): author `scripts/proof-named-selector-nan-
   frame.mjs` + `test/grammar-fuzz.test.ts` BEFORE S1's engine cure lands. Confirm RED on today's
   tree. Add `fast-check` devDep.
2. **S1 engine cure**: insert the `NAMED_SELECTOR_SUPERTYPE` scan in `frame-compiler.ts:parse()` +
   the `NAMED_SELECTOR_NO_TIMELINE` throw. Re-run `proof:named-selector-nan-frame` → GREEN.
3. **S2 re-target**: update `proof-replay-equality.mjs` S4 clause to the behavioral anchor (replace
   the source-shape regex). Confirm `proof:replay-equality` stays GREEN for all existing fixtures.
4. **S3 grammar-fuzz**: confirm `proof:grammar-fuzz` exits GREEN on the `colorArb` +
   `keyframeStopArb` arms (both work against value.js 1.0.2 today); the `round(<number>)` arm is
   SKIPPED with an explicit note — the gate is immediately useful, not blocked on value.js P. Add
   the round() arm as a follow-on once value.js P ships.
5. **S4 differential oracle**: author `scripts/proof-kf-differential.mjs`; confirm GREEN on the
   four WAAPI-eligible corpus fixtures on macOS.
6. **Wire gates**: add `proof:named-selector-nan-frame` + `proof:grammar-fuzz` to `proof:hygiene`;
   add `proof:kf-differential` to `proof:correctness` (observe-only CI posture). Add the `named-
   selector.css` fixture to `test/fixtures/keyframes/` (the O.W3-named addition).
7. **Confirm no regression**: `npm test` + `npm run proof:replay-equality` + `npm run proof:engine-
   correctness` all green; no existing non-named animation behavior changes.

**observable-truth, no-legacy, gestalt, P-inv-28.** The keystone clause is the RUNTIME
`throw-or-finite` assertion — not a source-shape grep. The dead-write (`NAMED_SELECTOR_SUPERTYPE`
written-never-read) and the typed-never-thrown error code are both made live by S1; the no-legacy
precept forbids leaving them as dead weight. The gestalt: ONE correctness band owns ALL of {the
NaN-frame cure, the grammar oracle, the differential oracle} because they share the single
invariant that correctness is observable only at runtime over real CSS inputs, never by inspecting
source shapes. DM-22 exits here (an 8th carry to P.WZ would violate P-inv-28 for this chronic,
first chartered at M.W5, developed at O.W3, implementation pending across two tranches).
