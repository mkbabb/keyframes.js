# Tranche G supplemental audit — lane `a-testing-robustness`

**Lane mandate.** Test-coverage robustness across the WHOLE surface — the
animation engine (lifecycle/playback/group/timeline), the parsing engine (the
`@keyframes` grammar, the adapter, the round-trips), COLOR parsing +
interpolation + testing (the value.js color seam kf consumes), COMPUTED-VALUE
testing (`vh`/`dvh`/`calc`/`var`/`cqw` — the DOM-resolution path), and
"interpolate through ANYTHING" (every value type: lengths/colors/calc/
transforms/filters/gradients/custom-props). Find the GAPS, propose the
robustness waves + corpora.

**Research/audit ONLY — ZERO source/test/CI/demo edits.** This doc is the sole
artifact. inv ε: every claim is `file:line`-grounded against the live
`tranche-g-dev` tree; value.js claims against `/Users/mkbabb/Programming/value.js`;
every probe number is from a re-runnable node v26.0.0 invocation reproduced in
§Probes, and I say so. Branch: `tranche-g-dev`.

**Relation to the authored G board (what I EXTEND, never repeat).** The 16-lane
assay confirms the engine kernel, the value.js boundary, the FrameCompiler split,
the color science, and the single-grammar parse are ALREADY-SOTA *as code*
(`_SYNTHESIS-gap-scorecard §3 §ALREADY-SOTA`). G.W2's re-pin proposes ONE C5
`50dvh` correctness test + a C1 resolve-count witness; `a-engine-perf G-2`
proposes `proof:interp-soa` on a "real-K corpus". **My distinct contribution is
the dimension none of those lanes carry: whether the TEST SUITE actually
exercises the surfaces those wins live on.** It does not. The suite is
bite-disciplined where it bites (501 tests across 50 files, every F/E/D finding
lock-tested), but it has **systematic value-type and computed-resolution holes**
— and two of the G.W2 / G-2 gates it proposes either cannot run on the real path
under jsdom, or have no correctness twin to protect the perf transposition. This
lane finds those holes and names the falsifiable waves + corpora that close them.

---

## The honest headline (read first)

**F's bite-discipline is real, but it is depth-first, not breadth-first.** Every
landed finding (E.W7 correctness, F.W4 buffer fold, F.W5 sync-step, F.W7/W8
adapter) has a precise lock-test with a noted BITE. That is exemplary and I
manufacture NO work against it (`§ALREADY-SOTA` below). But the suite's coverage
of the *core library promise* — "interpolate through ANYTHING" — is narrow:

1. **The "interpolate through anything" matrix is ~6 value types wide, not the
   full surface.** Every interpolation-result assertion in the suite touches only
   `opacity`, `left`/`top`/`width`/`height` (single-arg `px`), `translateX` (one
   `px`), and `color` via `rgb()`. There is **ZERO** correctness coverage of:
   multi-arg transforms (`matrix3d`/`rotate`/`scale`/`skew`/`translate3d` — the
   K=6–10 shape `a-engine-perf G-2` calls the *dominant* regime), filters
   (`blur`/`brightness`/`hue-rotate`/`drop-shadow`), gradients, `box-shadow`, and
   custom-property *value* interpolation. **TR-1 (SHIP).**

2. **The COLOR tests are "is it different", not "is it RIGHT".** The two color
   tests that exist (`engine-correctness.test.ts:22,42`) assert only string
   *inequality* across colorSpace/hueMethod switches (`afterLab !== before`).
   No test asserts the oklab midpoint of red→blue lands at its known coordinate,
   nor that the 3.96× color-channel plan the re-pin lights produces the SAME
   value as the old path. The color seam kf consumes (`createInterpVarValue` →
   `normalizeValueUnits` → `iv._lerp`, `utils.ts:288-340`) has no value-fidelity
   gate. **TR-2 (SHIP).**

3. **The COMPUTED-VALUE DOM-resolution path is structurally UNTESTABLE under
   jsdom — and the G.W2 C5 `50dvh` gate as specified cannot run on it.** jsdom's
   `getComputedStyle` returns `vh`/`dvh` *un-resolved* (`"50vh"`, not `384px`),
   does NOT fully resolve mixed-unit `calc()`, and never emits the `matrix(...)`
   form the runtime `getComputedValue` round-trip parses (§Probe-1, reproduced
   live). The MEMORY-documented resolution flow (`getComputedValue` → set CSS →
   read `getComputedStyle` → parse matrix → extract sub-value) has **no test that
   reaches a resolved number.** G.W2 S4 asks for a `50dvh`→`0.5×viewport`
   assertion "on the rAF path" (`a-valuejs-leverage §line116`) — under jsdom that
   path returns `50vh` and the assertion is unwritable as specified.
   **TR-3 (SHIP — split the gate: an injection-seam unit test + a Playwright
   real-DOM corpus).**

4. **Round-trips are frame-count + property-name shaped, not value-fidelity
   shaped, and there is no parse corpus.** `format.test.ts:46-91` round-trips
   assert frame count and property-name preservation; no round-trip asserts the
   interpolated *value* survives parse→format→reparse for colors/transforms/calc.
   There is no `@keyframes` parse corpus (a directory of inputs × expected ASTs)
   — the grammar is tested by inline one-liners scattered across files.
   **TR-4 (SHIP — a round-trip + parse corpus).**

The disposition spread: **4 SHIP** (TR-1..TR-4, each a wave with a biting gate),
**1 RECORD** (TR-5, the perf-correctness twin obligation on G-2), a large honest
**ALREADY-SOTA** refusal. Net-new lines are test-only — ZERO source touched.

A stale-doc note that motivates the whole lane: `CLAUDE.md` (project tree)
advertises a "15 files, 261 tests" suite including `test/units.test.ts`,
`test/parsing.test.ts`, `test/editor-parsing.test.ts`. **None of those three
files exist** (verified live — `test/` has 50 files, 501 tests, and no
`units`/`parsing`/`color`/`computed` file). The unit/parse/color *layer* moved
wholesale into value.js (`src/units/` and `src/parsing/` do not exist on this
branch — `src/` is `animation/` + `env.d.ts` only). That migration is correct
(the boundary is value.js-owned), but it ORPHANED the consumer-contract tests:
the units/color/parsing tests that CLAUDE.md still names were the only place the
"interpolate through anything" matrix lived, and they did not move with the code.
**The holes below are the shadow of that un-replaced migration** — the §Mandate's
"no replaced surface beside its replacement" applied to the test surface.

---

## §The evidence (file:line-grounded)

### The full interpolation-result corpus, enumerated

Every `expect(...interp...)` value assertion in the suite, by value type:

| Value type | Where asserted | Verdict |
|---|---|---|
| `opacity` (unitless) | `equivalence.test.ts:80-86`, `interp-fastprops.test.ts:66` | COVERED |
| `left`/`top`/`width`/`height` (single `px`) | `equivalence.test.ts:94-143` | COVERED |
| `translateX` (one `px` in a transform) | `equivalence.test.ts:22-23,327` | COVERED (single-arg only) |
| `color` via `rgb()` | `engine-correctness.test.ts:22-55`, `interp-fastprops.test.ts:66-67` | PARTIAL — inequality only, never the *value* (TR-2) |
| **multi-arg transform** (`matrix3d`/`rotate`/`scale`/`skew`/`translate3d`) | — | **ABSENT (TR-1)** |
| **filter** (`blur`/`brightness`/`hue-rotate`/`drop-shadow`) | — | **ABSENT (TR-1)** |
| **gradient** (`linear-gradient` stops) | preset *name* only (`presets.test.ts:8,21`) | **ABSENT (TR-1)** |
| **box-shadow** | — | **ABSENT (TR-1)** |
| **custom property** (`--x: 0 → 1` value) | registration spied (`platform-adopt.test.ts:102-160`), value never interpolated | **ABSENT (TR-1)** |
| **computed** (`vh`/`dvh`/`calc`/`var`/`cqw` resolved number) | eligibility-guard *reject* only (`engine-correctness.test.ts:79-95`) | **ABSENT on the resolve path (TR-3)** |

The library's headline — "CSS keyframe animations for **anything**" (`CLAUDE.md`
title) — is correctness-tested for ~6 of the value types it claims to interpolate
through. The transform-multi-arg gap is the sharpest: `a-engine-perf G-2`
(`docs/tranches/G/audit/a-engine-perf.md:70`) measures the live K distribution
bimodal with "every transform animation K=6–10 (translate3d+scale+rotate+opacity
= 10 numeric channels)" — and proposes a SoA `lerpArray` transposition through
that exact shape. **No test in the suite interpolates a K≥2 transform and asserts
the result.** The perf transposition would have no correctness twin to red if it
mis-orders the channels (TR-5).

### COLOR — the seam is value.js-delegated and tested for re-derivation, not value

The color path: `createInterpVarValue` (`src/animation/utils.ts:288`) bakes
`colorSpace`/`hueMethod` into the interpVar via `normalizeValueUnits` (value.js,
`utils.ts:339`); the lerp itself runs in `iv._lerp` at `engine.ts:731`. The two
existing color tests:

- `engine-correctness.test.ts:22-40` (FC-1): switches oklab→lab, asserts the
  midpoint string *changes* (`afterLab).not.toBe(before)`), then back restores.
  This locks "the setter re-derives" — a real F finding — but proves nothing
  about *which* color either space produces.
- `engine-correctness.test.ts:42-54`: switches hueMethod shorter→longer on
  oklch, asserts the string *changes*. Same shape.

There is **no** assertion that, e.g., the oklab mix of `rgb(255,0,0)`→
`rgb(0,0,255)` at t=0.5 equals its known coordinate, nor that the
re-pinned 0.11.0 color path produces the byte-same output as 0.10.0 for a fixed
corpus (the re-pin's "consume-unchanged" claim — `G.W2 S2` — is asserted for
*frame count / proof:all green*, never for *color value identity*). `hueMethod`
has zero coverage beyond the option-setter throw (`strict-options.test.ts:125`)
and the one inequality above. **This is the exact shape `leaves-parity.test.ts`
already solves for `clamp`/`lerp`/`scale`** (`test/leaves-parity.test.ts:18-41`
imports value.js and locks the consumer contract across a grid) — the color seam
needs the same parity gate.

### COMPUTED VALUES — jsdom cannot resolve them; the gate as specified cannot run

**Probe-1 (live, node v26.0.0, jsdom from the project's node_modules):**

```
50vh                  -> "50vh"        (NOT resolved to px)
calc(10px + 20px)     -> "calc(30px)"  (partial; NOT a final px, no mixed-unit resolve)
translateX(10px)      -> "translateX(10px)"  (NOT the matrix() form the runtime parses)
window.innerHeight    -> 768
```

The environment is jsdom (`vitest.config.ts:25`). The runtime computed path
(MEMORY: `getComputedValue` sets CSS on the target, reads `getComputedStyle`,
parses the resulting `matrix(...)`, extracts the sub-value) depends on three
behaviors jsdom does not have: viewport-relative resolution, mixed-unit `calc()`
resolution, and `transform`→`matrix()` normalization. So:

- The ONLY computed-unit test in the suite tests the WAAPI **eligibility guard**
  (`engine-correctness.test.ts:79-95`) — a *string-pattern* rejection
  (`elig.reason).toMatch(/cqw/)`) that needs no resolution. Correct, but it never
  resolves a unit.
- G.W2 S4 specifies "a C5 `50dvh` non-identity assertion ... resolves to the live
  `0.5 × dynamic-viewport-height` (not `50`) on the rAF path"
  (`a-valuejs-leverage.md:116-117`). On the rAF path under jsdom, `50dvh`
  resolves to `"50dvh"` and the assertion is unwritable as stated — it would
  either pass vacuously (string compare) or require a real browser.

The re-pin's headline correctness fix (C5: the 24 previously-no-op relative units
`dvh`/`svh`/`lvh`/`cqw`… now resolving instead of dropping to a bare number —
`a-valuejs-leverage.md:100-104`) is therefore the LEAST-protected change in G: it
is a *DOM-resolution* correctness fix in a *DOM-less* test environment.
**TR-3 splits the gate** into (a) a kf-side unit test against value.js's
*injectable* resolution seam (value.js exposes the viewport/container resolvers as
overridable inputs — the same injection idiom `ScrollTimeline` uses for
`getScrollY`/`getViewportHeight`, `CLAUDE.md Architecture Notes`), proving kf
forwards the resolved px; and (b) a Playwright real-DOM corpus
(`bench/playwright.bench.ts` already drives a real Chromium —
`bench/playwright.bench.ts`) that animates `50dvh`/`calc(50% + 10px)`/`100cqw`
and reads the *actual* computed px from the live page. (b) is the only place the
C5 fix can be proven on the genuine path.

### PARSING / ROUND-TRIPS — no corpus; round-trips are shape-only

The `@keyframes` grammar is exercised by inline `fromString(\`@keyframes …\`)`
one-liners scattered across ~20 files; there is no `@keyframes` parse corpus
(inputs × expected ASTs) and no fixture directory. The adapter seam
(`adapter-capture.test.ts:22-69`) covers the F.W8 shorthand/composition/bare-list
findings well, but only those three. Round-trips (`format.test.ts:46-91`) assert
frame count and property-name/value-string preservation across
parse→format→reparse — never that the *interpolated result* survives the round
trip for a non-trivial value (a color, a multi-arg transform, a `calc()`).
The `d3-changed-keys.measure.test.ts` is the cited gold-standard *measure* bar
(`G.md:79`) — there is no equivalent gold-standard *value-fidelity* bar for the
parse/interp round-trip. **TR-4** adds the corpus + the value-fidelity round-trip.

---

## §Findings — disposition-tagged, each with a falsifiable instrument

### TR-1 — the "interpolate through anything" value-type matrix · SHIP-in-G

**Gap.** The interpolation-result corpus is ~6 value types wide; the library
promise is "anything". Absent: multi-arg transforms (`matrix3d`/`rotate`/`scale`/
`skew`/`translate3d`), filters, gradients, `box-shadow`, custom-property values.

**SHIP.** A new `test/interpolate-anything.test.ts` (heavy-side, may import
value.js — the `leaves-parity` precedent) driving a value-type CORPUS through
`interpFrames(t=0.5)` and asserting the midpoint per type. Each row is a fixed
`@keyframes` with a known midpoint:

| Type | Fixture from→to | Midpoint assertion |
|---|---|---|
| multi-arg transform | `translate3d(0,0,0) scale(1)` → `translate3d(100px,100px,0) scale(2)` | each channel at its lerp midpoint (50px,50px,0,1.5) |
| `rotate` | `rotate(0deg)` → `rotate(90deg)` | `45deg` |
| filter | `blur(0) brightness(1)` → `blur(10px) brightness(2)` | `blur(5px) brightness(1.5)` |
| `drop-shadow` | offset/blur lerp | each numeric channel at midpoint |
| `box-shadow` | offset/blur/color lerp | numeric channels + color at midpoint |
| gradient stops | `linear-gradient(…0%…)` → `(…100%…)` | stop position at midpoint |
| custom property value | `--w: 0px` → `--w: 100px` | `50px` |

**Falsifiable gate (`proof:interpolate-anything`).** Each corpus row asserts the
exact midpoint. **BITE:** drop one channel from the transform interp (a K-ordering
regression — exactly the failure mode TR-5 warns G-2's SoA fold could introduce)
→ the `scale` or `translate3d.z` row reds. Wire into `npm test`; re-run by a
`scripts/proof-interpolate-anything.mjs` (the F advisory→hard idiom).

**Design note.** This is breadth the suite owes regardless of G — but G.W2 + G-2
make it URGENT: the re-pin changes the boundary (A2 maximal-munch unit
classifier, C5 24 units) and `a-engine-perf G-2` proposes re-shaping the transform
hot path. Both land on value types with no correctness twin today.

### TR-2 — color value-fidelity + the re-pin parity lock · SHIP-in-G

**Gap.** Color is tested for *re-derivation* (string inequality on space/hue
switch) but never for *value*; the re-pin's "consume-unchanged" claim has no
color-identity twin.

**SHIP.** Extend `test/interpolate-anything.test.ts` (or a sibling
`test/color-interp.test.ts`) with (a) a known-coordinate lock: the oklab mix of
two fixed colors at t=0.5 equals its computed coordinate to N digits, per space
(`oklab`/`oklch`/`lab`/`srgb`); (b) a **value.js color-parity gate** mirroring
`leaves-parity.test.ts` — import value.js's `normalizeColorUnits`/the lerp seam
and assert the kf-consumed path produces the byte-same output as the canonical
value.js function across a color grid; (c) a hueMethod *value* lock (shorter vs
longer on oklch lands at the two known distinct coordinates, not merely "not
equal").

**Falsifiable gate (`proof:color-fidelity`).** Known-coordinate equality +
value.js parity across the grid. **BITE:** swap the colorSpace default seam to a
wrong space → the known-coordinate row reds; drift value.js's color export → the
parity row reds (catches a silent re-pin color regression the frame-count round
trip cannot). This is the missing twin for the re-pin's 3.96× color-channel plan
(`_SYNTHESIS-gap-scorecard §THESIS`).

### TR-3 — computed-value resolution: the injection-seam unit test + the real-DOM corpus · SHIP-in-G

**Gap.** The computed-resolution path (`vh`/`dvh`/`calc`/`var`/`cqw`) is
structurally untestable under jsdom (Probe-1); the G.W2 C5 `50dvh` gate as
specified cannot run on the rAF path under jsdom.

**SHIP — split the gate into the two seams that CAN bite:**

- **S1 (kf-side, jsdom-OK): the injection-seam unit test.** value.js resolves
  viewport/container units through injectable resolvers (the same idiom kf's
  `ScrollTimeline` uses for `getScrollY`/`getViewportHeight` —
  `CLAUDE.md Architecture Notes`). Drive `interpFrames` with a stubbed resolver
  returning a known viewport height; assert kf forwards the *resolved px*
  (50dvh@768 → 384px), not the bare number `50`. This proves kf's *consumption*
  of the C5 fix without needing jsdom to do layout. **BITE:** revert the resolver
  to drop the unit (the pre-C5 no-op) → the test reds at `50 !== 384`.
- **S2 (real-DOM, Playwright): the computed-unit corpus.**
  `bench/playwright.bench.ts` already drives a real Chromium. Add a
  `proof:computed-real-dom` Playwright spec animating `50dvh`, `calc(50% + 10px)`,
  `100cqw` (under a `container-type: inline-size` ancestor), and `var(--x)` in a
  laid-out page; read `getComputedStyle().width` and assert the *actual* px.
  This is the ONLY place the C5 fix is provable on the genuine path. **BITE:**
  stub value.js to skip `convertToPixels` for `dvh` → the live page freezes at
  the un-resolved value and the spec reds.

**Folds + supersedes.** This REPLACES the un-runnable G.W2 S4 "`50dvh` on the rAF
path" clause with a gate that actually bites (the §Mandate: no gate that passes
vacuously). G.W3's `proof:resize-tracks` (`cqw` under a non-window resize,
`G.md:231`) is the natural sibling — it too needs the real-DOM corpus, not jsdom.

### TR-4 — the parse + round-trip value-fidelity corpus · SHIP-in-G

**Gap.** No `@keyframes` parse corpus; round-trips are frame-count/name shaped,
not value-fidelity shaped.

**SHIP.** (a) A `test/fixtures/keyframes/` corpus (inputs × expected normalized
ASTs / frame structures) covering: per-keyframe easing, `linear()`/`steps()`,
multi-property frames, bare-list, `@property` blocks, computed units, color
formats (hex/rgb/hsl/named/oklch). (b) A value-fidelity round-trip:
parse→format→reparse→`interpFrames(0.5)` must produce the byte-same midpoint as
the original for each corpus row — extending `format.test.ts:46-91` from
"same frame count" to "same interpolated value".

**Falsifiable gate (`proof:roundtrip-fidelity`).** Corpus-driven midpoint
equality across the round trip. **BITE:** a serializer that drops a transform
channel on format (the `serializeEasing` silent-`"linear"` class G.W4 already
fights — `G.md:248`) → the round-trip midpoint diverges and the row reds. This
generalizes G.W4's `proof:roundtrip-easing` from easing-only to the full value
matrix.

### TR-5 — the perf-transposition correctness twin (the G-2 / SoA obligation) · RECORD

**Observation, not new work — a binding obligation on G-2.** `a-engine-perf G-2`
proposes a SoA `lerpArray` transposition through the K=6–10 transform shape, gated
by `proof:interp-soa` "on the demo's real-K corpus" (a *perf* gate,
`a-engine-perf.md:70`). A perf gate proves *speed*, not *correctness*: a channel
mis-order or an off-by-one in the SoA pack would pass a ns-bench and ship a wrong
pixel. **RECORD:** G-2 must NOT land without TR-1's transform-interp correctness
rows as its twin — the byte-lock `a-engine-perf` itself names
(`G.md:288` "byte-identical-event-sequence" idiom) applied to the interp output.
The instrument already exists once TR-1 ships; this row just binds them. No
separate wave — a gate dependency: `proof:interp-soa` requires
`proof:interpolate-anything` green on the same corpus.

---

## §ALREADY-SOTA (binding — manufacture NO work)

The suite's **depth** discipline is exemplary and I touch none of it:

- **Every landed finding is lock-tested with a noted BITE.** E.W7 correctness
  (`engine-correctness.test.ts`), F.W4 buffer fold (`interp-fastprops.test.ts`,
  `zero-alloc.test.ts`, `standalone-zero-alloc.test.ts`), F.W5 sync-step
  (`sync-step.test.ts`), F.W7/W8 adapter (`adapter-capture.test.ts`,
  `roundtrip-easing.test.ts`), the measure gold-standard
  (`d3-changed-keys.measure.test.ts`). This is the F bite-discipline `G.md:79`
  praises and it HOLDS.
- **The value.js consumer-contract parity idiom already exists** —
  `leaves-parity.test.ts:18-41` is the exact template TR-2 generalizes to color.
  The pattern is endorsed; it is just under-applied.
- **The platform/WAAPI/timeline/group lifecycle surface is well covered** —
  `waapi-lifecycle.test.ts` (235L), `platform-adopt.test.ts` (444L),
  `group.test.ts` (425L), `timeline.test.ts`, `sequence-transport.test.ts`
  (399L). The lifecycle/playback/group/timeline axis is NOT a gap.
- **The injection-seam discipline that makes TR-3 S1 possible is already kf's
  idiom** (`ScrollTimeline`'s `getScrollY`/`getViewportHeight`,
  `CLAUDE.md Architecture Notes`) — TR-3 reuses it, invents nothing.

The gaps are exclusively in **breadth across value types** and the **computed
DOM-resolution path jsdom cannot reach** — the orphaned shadow of the
units/parsing/color layer's migration into value.js. Closing them is test-only,
zero source, and it gives the re-pin (G.W2) and the SoA fold (G-2) the
correctness twins they currently ship without.

---

## §Probes (re-runnable)

**Probe-1 (jsdom computed-unit resolution, node v26.0.0).** From the project root:
`node -e "const {JSDOM}=require('./node_modules/jsdom'); const w=new JSDOM('<div
id=t></div>').window; const el=w.document.getElementById('t'); el.style.width='50vh';
console.log(w.getComputedStyle(el).width); el.style.height='calc(10px + 20px)';
console.log(w.getComputedStyle(el).height); el.style.transform='translateX(10px)';
console.log(w.getComputedStyle(el).transform);"` →
`50vh` / `calc(30px)` / `translateX(10px)`. Confirms jsdom resolves none of the
three computed forms the runtime path needs.

**Probe-2 (the value-type corpus, grep).** Over `test/*.ts`:
`matrix3d|rotate3d|rotateX|skew|perspective|scale3d|translate3d` → **0 hits**;
`blur(|brightness|hue-rotate|drop-shadow|box-shadow` (as interp fixtures) →
**0 hits**; color value assertion (`toBe/toEqual` against an `rgb/oklab/#hex`) →
only the colorSpace *option* strings (`animation.test.ts:348,359`,
`strict-options.test.ts:114`) + the inequality re-derivation tests
(`engine-correctness.test.ts:31,36`). Confirms the §matrix.

**Probe-3 (orphaned suite).** `CLAUDE.md` advertises `test/units.test.ts`,
`test/parsing.test.ts`, `test/editor-parsing.test.ts` — `ls test/` shows none
exist; `src/units/` and `src/parsing/` do not exist (`ls src/` → `animation/`,
`env.d.ts`). The unit/parse/color layer is value.js-resident; its consumer tests
did not migrate.

---

## §inv-16 / inv ε compliance

This lane wrote ONLY `docs/tranches/G/audit/a-testing-robustness.md`. ZERO
source/test/CI/demo edits. Every claim cites a live `file:line` on `tranche-g-dev`
or a re-runnable probe reproduced in §Probes. All five findings are
disposition-tagged (4 SHIP-in-G + 1 RECORD), each SHIP carries a named falsifiable
`proof:*` gate with a stated BITE, and the §ALREADY-SOTA record is honest — F's
test depth-discipline is exemplary and untouched. The cross-repo color/computed
*resolution* lives in value.js; kf's exposure is the CONSUMER contract, and the
proposed gates test kf's consumption (the `leaves-parity` idiom), not value.js
internals — no inv-16 breach. TR-3 S2's real-DOM corpus is Playwright (kf-local
`bench/`), not a sibling-repo hand-off.
