# G.W16 — The computed-resolution + parse/round-trip corpora (jsdom-OK + real-DOM split; SUPERSEDES the un-runnable G.W2 S4 `50dvh`-rAF clause)

**Phase:** IMPL — spec authored in DEV, awaits authorization (the D/E/F dev/impl
boundary) · **Class:** SHIP-in-G (TEST-ONLY — net-new lines are tests + fixtures +
two `proof:*` scripts; **ZERO source/test-of-record-mutation/CI-config/demo edit** to
the engine, the parser, or the serializer; the new test files + the Playwright spec
ride the existing `npm test` / `npm run bench` surfaces) · **Class (the engine):**
`Animation` / `CSSKeyframesAnimation` (the rAF interp path + `fromString`/`format`
round-trip) — exercised, never modified · **Scope (files, all NEW):**
`test/computed-resolution.test.ts` (S1, the value.js viewport-resolver injection-seam
unit test, jsdom), `bench/computed-real-dom.bench.ts` + `bench/computed-scene.html`
(S2, the Playwright real-DOM computed-unit corpus, mirroring
`bench/playwright.bench.ts`), `test/fixtures/keyframes/` + `test/roundtrip-fidelity.test.ts`
(TR-4, the `@keyframes` parse corpus + the value-fidelity round-trip), and the two
re-runnable gate scripts `scripts/proof-computed-real-dom.mjs` (Playwright launcher,
the `bench/playwright.bench.ts` chromium-resolution convention) +
`scripts/proof-roundtrip-fidelity.mjs` (the F advisory→hard idiom). **NO `src/` edit** —
any required source edit to make a gate bite is a FINDING (the consume-unchanged /
test-only charter), surfaced, not patched. · **DAG-deps:** **depends on G.W2** (the
re-pin is the change under test — the C5 24-no-op-unit fix and the A2 maximal-munch
classifier change the boundary the corpus must protect; the corpus is meaningless
against the stale `0.10.0` that resolves `50dvh→50px`). Band T, after the spine.
**Natural sibling of G.W3** (`proof:resize-tracks`): both need a real laid-out DOM
that jsdom cannot give; this wave establishes the Playwright computed-unit corpus
G.W3's `cqw`-under-non-window-resize check rides into.

The §Mandate (`G.md §Mandate` / the gap-scorecard §THESIS) is the spine; this wave most
tests **no gate that passes vacuously + measure-first**. G.W2 S4 asked for a `50dvh`
non-identity assertion "on the rAF path" — but under jsdom the rAF path returns the
un-resolved string `"50dvh"`, so that assertion is unwritable as specified: it would
either compare strings (vacuous) or silently never resolve a number (`a-testing-robustness
Probe-1`, reproduced live). The §Mandate forbids a gate that cannot bite. This wave
SUPERSEDES that clause with the TWO seams that CAN: a jsdom-OK injection-seam unit test
that proves kf *forwards* the resolved px (S1), and a Playwright real-DOM corpus that
proves the C5 fix on the genuine layout path (S2) — the only place it is provable.

This is the **test-only twin** the re-pin's headline correctness fix (C5) ships without
today. The C5 24-no-op-unit fix (`50dvh`/`svh`/`lvh`/`vi`/`vb`/… now resolving instead
of dropping to a bare number — `a-valuejs-leverage F-VJ-1`, `value.js units/utils.ts:256-309`)
is a *DOM-resolution* correctness fix landing in a *DOM-less* test environment; it is
therefore the LEAST-protected change in all of G (`a-testing-robustness TR-3`). Closing
that hole is the binding job here. Verified, not asserted (inv ε), against the live
`tranche-g-dev` tree + the published `value.js@0.11.0` source.

**Provenance (the supplemental lanes).** `a-testing-robustness TR-3`
(`docs/tranches/G/audit/a-testing-robustness.md:268-297` — the computed-resolution path
is structurally untestable under jsdom; SPLIT the G.W2 C5 gate into an injection-seam
unit test + a Playwright real-DOM corpus) + `TR-4` (`:298-317` — the absent `@keyframes`
parse corpus + the value-fidelity round-trip: parse→format→reparse→`interpFrames(0.5)`
byte-same midpoint, generalizing G.W4's `proof:roundtrip-easing` from easing-only to the
full value matrix). Synthesised at `_SYNTHESIS-perf-testing-engine §2 Band T G.W16`
(`:191-217`) + `§3(c)` (the disposition table: "TR-3/TR-4 → NEW `G.W16` (supersedes G.W2
S4)", `:333`) + `§4` (the new-wave roll-up, `:364-365`). Carries `a-modern-css-interp
MCI-1`'s bare-`cqw`/`dvh` rAF-resolution note only as a corpus row witness
(`a-modern-css-interp.md:70-120`), not a new SHIP.

---

## § The state, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-g-dev` + the published
`value.js@0.11.0` source at `/Users/mkbabb/Programming/value.js`:

1. **jsdom resolves NONE of the three computed forms the runtime path needs.** Probe-1
   (`a-testing-robustness.md:156-163`, re-runnable, reproduced live):
   `el.style.width="50vh"` → `getComputedStyle(el).width === "50vh"` (NOT `384px`);
   `calc(10px + 20px)` → `"calc(30px)"` (partial, no mixed-unit resolve);
   `transform: translateX(10px)` → `"translateX(10px)"` (NOT the `matrix(...)` form the
   runtime `getComputedValue` round-trip parses). The test env IS jsdom
   (`vitest.config.ts`). So the runtime computed path (MEMORY: `getComputedValue` sets CSS,
   reads `getComputedStyle`, parses `matrix(...)`, extracts the sub-value) cannot reach a
   resolved number under jsdom. The ONLY computed-unit test in the suite tests the WAAPI
   *eligibility-guard reject* (a string-pattern match needing no resolution) — it never
   resolves a unit (`a-testing-robustness.md:165-171`).

2. **The G.W2 S4 `50dvh`-rAF assertion is unwritable as specified.** G.W2 S4
   (`G.W2.md:170-179`) asks a `@keyframes` over `50dvh` to "resolve to the live `0.5 ×
   dynamic-viewport-height` on the rAF path". Under jsdom the rAF path emits `"50dvh"`
   (un-resolved) → the assertion passes vacuously (string compare) or needs a real browser
   (`a-testing-robustness.md:173-180`). G.W2 ITSELF records the limit: "C5 is …
   jsdom-uncatchable in the value.js suite (no layout, `a-deferred-ledger §0 RP-3`); the
   kf-realm `50dvh` non-identity test is the only place it bites" (`G.W2.md:184-186`) — but
   on the rAF path that test cannot be written. This wave is where that bite actually lands.

3. **value.js's viewport resolution reads `window.innerHeight` directly — and jsdom's
   `window.innerHeight` IS settable.** `convertToPixels` resolves `vh`/`vmin`/`vmax` and
   the `dvh`/`svh`/`lvh` family against `window.innerHeight`
   (`value.js units/utils.ts:305,309,415,419,421`; the `dvh` branch reads
   `visualViewport?.height ?? window.innerHeight`, and jsdom's `visualViewport` is
   `undefined` — verified live — so the fallback IS the settable `window.innerHeight`).
   Probe (live, jsdom): `w.innerHeight = 384` is a writable own-property → the S1 unit test
   can drive `50dvh@768→384` by setting `window.innerHeight`, the jsdom analogue of the
   `ScrollTimeline.getViewportHeight` injection idiom — NO real browser needed for S1.

4. **kf's own injection-seam idiom is already established (S1's template).** `ScrollTimeline`
   accepts overridable `getScrollY` / `getViewportHeight` resolvers, defaulting to
   `() => window.scrollY` / `() => window.innerHeight` (`src/animation/timeline.ts:157-172`)
   — the documented pattern for testing a layout-coupled value without a real DOM
   (`CLAUDE.md` Architecture Notes; `a-testing-robustness.md:186-189`). S1 REUSES this
   idiom (drive the resolved viewport, assert kf forwards the px), inventing nothing.

5. **kf reaches the entire computed-resolution path through ONE seam.** The C5-resolved
   leaf flows through `lerpValue(eased, iv)` at `engine.ts:731` (verified live); the pad +
   pairing is `createInterpVarValue` (`src/animation/utils.ts:283-323`). S1 drives this
   seam under a controlled viewport; the corpus rows in S2 ride the same seam on the real
   path. No new value.js edge is added (gate clause 5).

6. **There is no `@keyframes` parse corpus and round-trips are shape-only.** The grammar is
   exercised by inline `fromString(\`@keyframes …\`)` one-liners scattered across ~20 files;
   no fixture directory of inputs × expected ASTs exists (`a-testing-robustness.md:195-207`).
   `format.ts` serializes (`serializeEasing:22`, `CSSKeyframeToString:96`, the F.W7
   per-keyframe-easing round-trip `:120`), and `format.test.ts` round-trips assert frame
   count + property-name/value-string preservation — never that the *interpolated value*
   survives parse→format→reparse for a color / multi-arg transform / `calc()`
   (`a-testing-robustness.md:195-204`). G.W4 ships `proof:roundtrip-easing` for the
   easing channel only (`G.W4.md:1-19`); this wave generalizes that to the full value matrix.

7. **The Playwright real-DOM harness already exists (S2's template).** `bench/playwright.bench.ts`
   launches Chromium against a served bench page, drives a scene, and reads `window.*`
   state, with a chromium-resolution convention (`KF_PLAYWRIGHT_DIR`, SKIP-locally /
   HARD-FAIL-in-CI under `KF_REQUIRE_BROWSER`, self-skip under jsdom) and a serve-the-three-
   dist-trees importmap (`bench/playwright.bench.ts:61-177`). S2 MIRRORS this harness — it
   manufactures no new browser-launch machinery.

The wave's job: author the S1 injection-seam unit test (jsdom), the S2 Playwright real-DOM
computed-unit corpus (the only genuine-path C5 proof), and the TR-4 parse corpus +
value-fidelity round-trip; chain the two new gates; SUPERSEDE the un-runnable G.W2 S4
clause; ZERO source touch.

---

## § Goal

**What lands (the IMPL the spec gates):**

- **S1 — the computed-resolution injection-seam unit test (SHIP — jsdom-OK, test-only).**
  `test/computed-resolution.test.ts`: drive `interpFrames` over a `@keyframes` whose leaf
  is `50dvh`, with `window.innerHeight` set to a known value (768), and assert kf forwards
  the *resolved* px (`50dvh@768 → 384`), NOT the bare number `50` the pre-C5 no-op
  classifier painted. This proves kf's *consumption* of the C5 fix without asking jsdom to
  do layout — the value.js resolver reads the settable `window.innerHeight`
  (`value.js units/utils.ts:309`), the `ScrollTimeline.getViewportHeight` idiom applied to
  the viewport unit. (SHIP-in-G.)

- **S2 — the Playwright real-DOM computed-unit corpus (SHIP — the genuine-path C5 proof).**
  `bench/computed-real-dom.bench.ts` + `bench/computed-scene.html`, mirroring
  `bench/playwright.bench.ts`: launch Chromium against a served, laid-out page that animates
  `50dvh`, `calc(50% + 10px)`, and `100cqw` (the last under a `container-type: inline-size`
  ancestor), then read the *actual* `getComputedStyle().width` mid-animation and assert the
  resolved px. This is the ONLY place the C5 fix is provable on the genuine path
  (`a-testing-robustness.md:284-292`). It is the natural sibling of G.W3's `proof:resize-tracks`
  (the `cqw`-under-non-window-resize check rides this same corpus + harness). (SHIP — the
  genuine-path twin.)

- **TR-4 — the parse corpus + value-fidelity round-trip (SHIP — test-only).**
  `test/fixtures/keyframes/` (inputs × expected normalized ASTs / frame structures) +
  `test/roundtrip-fidelity.test.ts`: a corpus covering per-keyframe easing,
  `linear()`/`steps()`, multi-property frames, bare-list, `@property` blocks, computed
  units, and color formats (hex/rgb/hsl/named/oklch); plus the value-fidelity round-trip —
  parse→format→reparse→`interpFrames(0.5)` produces the BYTE-SAME midpoint as the original
  for each corpus row. This extends `format.test.ts` from "same frame count" to "same
  interpolated value" and generalizes G.W4's `proof:roundtrip-easing` to the full matrix.
  (SHIP — the value-fidelity round-trip.)

- **The two standing gates (SHIP — the gates ship WITH the corpora).**
  `proof:computed-real-dom` (the S2 Playwright launcher, chained where `proof:all` runs the
  browser-gated band, SKIP-local / HARD-FAIL-CI per the bench convention) +
  `proof:roundtrip-fidelity` (the corpus-driven midpoint-equality script). The S1 test rides
  `npm test` (no separate gate script — it is a plain jsdom unit test). (SHIP.)

**Why:** the re-pin's C5 fix changes WRONG pixels to right (`50dvh`→`0.5 × viewport`,
`a-valuejs-leverage F-VJ-1`), the single named isomorphism-break of the whole spine
(`G.W2.md:282-289`) — and it is the change with the thinnest protection: a DOM-resolution
fix the jsdom suite cannot reach. A correctness fix without a biting test is a charter
promise. The §Mandate forbids both the un-runnable gate (G.W2 S4 as specified) and the
correctness fix that ships untested. The two seams that CAN bite are: kf *forwards* the
resolved px (S1, jsdom-OK via the settable viewport), and the resolution holds on the
genuine layout path (S2, Playwright). Beside them, TR-4 closes the suite's parse/round-trip
hole — the re-pin's A2 maximal-munch classifier changes how units parse, and a serializer
that drops a channel on format would diverge silently; the value-fidelity round-trip is the
falsifiable lock. All test-only; the re-pin makes it URGENT (it changes the boundary the
tests must protect), but the suite owes it regardless of G.

---

## § Scope

### S1 — The computed-resolution injection-seam unit test (jsdom-OK) — `a-testing-robustness TR-3 S1`

**WHAT:** `test/computed-resolution.test.ts`. Set `window.innerHeight = 768` (a writable
jsdom own-property — verified live, §State 3), build a `CSSKeyframesAnimation` over
`@keyframes { from { height: 0dvh } to { height: 50dvh } }` (or drive `interpFrames(1)` to
the `50dvh` endpoint), and assert the resolved leaf is `384px` (= `50 × 768/100`), NOT the
bare `50` the pre-`0.11.0` no-op classifier painted. The viewport value enters through
value.js's `convertToPixels` reading `window.innerHeight` (`value.js units/utils.ts:309`) —
the same injection idiom `ScrollTimeline` formalizes as `getViewportHeight`
(`timeline.ts:157-172`). The test owns the viewport input; jsdom does no layout.

**WHY:** this is the jsdom-OK half of the split G.W2 S4 gate — it proves kf *consumes* the
C5 resolution (forwards the resolved px through `lerpValue → iv._lerp`, `engine.ts:731`)
without requiring a real browser. The §Mandate's no-vacuous-gate: unlike the un-runnable rAF
assertion, this one resolves an actual number under a controlled viewport and bites on the
pre-C5 no-op. inv ε: revert to `^0.10.0` (or stub the resolver to drop the unit) → the test
reds at `50 !== 384`. **RECORD (value.js-HANDOFF, do NOT manufacture here):** value.js does
not yet EXPORT a first-class overridable viewport/container resolver — `convertToPixels`
reads `window.innerHeight`/`visualViewport` directly. A `setViewportResolver(fn)` export
(the `ScrollTimeline.getViewportHeight` idiom lifted into value.js) would make S1 a pure
resolver-injection rather than a `window.innerHeight`-set; it is a value.js-HANDOFF, NOT kf
scope. S1 ships TODAY on the settable `window.innerHeight` — no handoff blocks it.

### S2 — The Playwright real-DOM computed-unit corpus (the genuine-path C5 proof) — `a-testing-robustness TR-3 S2`

**WHAT:** `bench/computed-real-dom.bench.ts` + `bench/computed-scene.html`, mirroring the
existing `bench/playwright.bench.ts` harness (chromium resolution via `KF_PLAYWRIGHT_DIR`,
the three-dist-tree importmap, SKIP-local / HARD-FAIL-CI under `KF_REQUIRE_BROWSER`,
self-skip under jsdom — `bench/playwright.bench.ts:61-177,190-199`). The served scene lays
out a page with a known viewport and a `container-type: inline-size` ancestor (mirroring the
flagship `AnimationVisualizer` container, `style.css:256`), animates a corpus —
`width: 0 → 50dvh`, `width: 0 → calc(50% + 10px)`, `width: 0 → 100cqw`, and a `var(--x)`
row — then reads `getComputedStyle(el).width` mid-animation and asserts the *actual*
resolved px against the page's known geometry. A `scripts/proof-computed-real-dom.mjs`
launcher runs it as a gate (the F advisory→hard idiom; the bench surface is `npm run bench`).

**WHY:** S2 is the ONLY place the C5 fix is provable on the genuine path — jsdom resolves
none of `50dvh`/`calc(50%+10px)`/`100cqw` (§State 1, Probe-1). The §Mandate's measure-first:
the C5 headline correctness number is asserted on the real layout engine, not a string
compare. It is the natural sibling of G.W3's `proof:resize-tracks` — both need a laid-out
DOM; this wave establishes the corpus + harness that G.W3's container-resize check extends.
inv ε: stub value.js to skip `convertToPixels` for `dvh` (or revert the re-pin) → the live
page freezes at the un-resolved value and the spec reds (`a-testing-robustness.md:291-292`).

### S3 — The `@keyframes` parse corpus + the value-fidelity round-trip — `a-testing-robustness TR-4`

**WHAT:** (a) `test/fixtures/keyframes/` — a corpus of inputs × expected normalized ASTs /
frame structures: per-keyframe easing, `linear()`/`steps()`, multi-property frames,
bare-list, `@property` blocks, computed units, color formats (hex / rgb / hsl / named /
oklch). (b) `test/roundtrip-fidelity.test.ts` — the value-fidelity round-trip: for each
corpus row, `fromString(css)` → `format` → `fromString` (reparse) →
`interpFrames(0.5)` must produce the BYTE-SAME midpoint as the original's `interpFrames(0.5)`.
This extends `format.test.ts` from "same frame count / property name" to "same interpolated
value", and lifts G.W4's `proof:roundtrip-easing` (the easing channel only, `G.W4.md:1-19`)
to the whole value matrix (colors, multi-arg transforms, `calc()`). A
`scripts/proof-roundtrip-fidelity.mjs` runs it as a standing gate.

**WHY:** the re-pin's A2 maximal-munch unit classifier changes how the grammar tokenizes,
and `format.ts`'s serializer is the surface where a dropped channel would silently corrupt a
round trip (the `serializeEasing` silent-`"linear"` class G.W4 fights, generalized). The
§Mandate's no-silent-degrade: a serializer that drops a transform channel must RED, not pass
a frame-count check. inv ε: drop one channel on format → the round-trip midpoint diverges and
the row reds (`a-testing-robustness.md:311-315`). The corpus is the parse-side artifact the
suite owes — the grammar is currently tested by scattered one-liners with no fixture
directory (§State 6).

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real check, not narration):

1. **S1 — kf forwards the resolved px (jsdom).** `test/computed-resolution.test.ts`: with
   `window.innerHeight = 768`, a `50dvh` leaf resolves to `384px` through the kf interp seam,
   NOT `50`. BITES: revert to `value.js ^0.10.0` (the pre-C5 no-op classifier) or stub the
   resolver to drop the unit → the test reds at `50 !== 384`. (`a-testing-robustness TR-3 S1`.)
2. **`proof:computed-real-dom` — the C5 fix holds on the genuine path (Playwright).** The S2
   corpus animates `50dvh`/`calc(50% + 10px)`/`100cqw` under a laid-out page + a
   `container-type` ancestor and reads the *actual* `getComputedStyle().width` = the expected
   px. BITES: stub value.js to skip `convertToPixels` for `dvh` → the live page freezes at
   the un-resolved value → the spec reds; revert the re-pin → the raw-number resolution
   returns → reds. (The ONLY genuine-path C5 proof; `a-testing-robustness TR-3 S2`.)
3. **`proof:roundtrip-fidelity` — the value survives the round trip.** For every corpus row,
   parse→format→reparse→`interpFrames(0.5)` is byte-same to the original midpoint. BITES: a
   serializer that drops a transform channel on `format` → the round-trip midpoint diverges →
   the row reds (`a-testing-robustness TR-4`). Generalizes G.W4's `proof:roundtrip-easing`.
4. **The parse corpus exists + is authoritative.** `test/fixtures/keyframes/` is non-empty and
   each fixture's expected normalized AST / frame structure is asserted (not just a smoke
   parse). BITES: delete a fixture's expected AST → the corpus claim is un-falsifiable → the
   gate reds (no fixture asserts shape) — the suite cannot regress the grammar silently.
   (`a-testing-robustness TR-4`.)
5. **Test-only, boundary intact (ZERO source edit).** `git status` over `src/` shows zero
   modification; the new lines are tests + fixtures + the two gate scripts only; the
   consumption flows through the unchanged `lerpValue → iv._lerp` seam (`engine.ts:731`) with
   no new value.js edge; `proof:boundary` stays green. BITES: any `src/` edit required to make
   a clause bite → a finding against the test-only charter, surfaced not patched; a new static
   value.js edge → `proof:boundary` reds. (`G.md §Mandate`, the test-only charter.)
6. **The supersession is clean (no double-counted / vacuous gate).** The un-runnable G.W2 S4
   "`50dvh` on the rAF path" clause is SUPERSEDED by clauses 1+2; the G.W2 S4 entry is re-read
   to "the C1 resolve-count witness (b); the C5 `50dvh` correctness gate is OWNED by G.W16
   S1+S2". BITES: if G.W2 still carries a standalone `50dvh`-rAF assertion AND it passes, it
   passes vacuously (string compare) — the §Mandate's no-vacuous-gate is violated; the
   re-tag removes the duplicate. (`_SYNTHESIS-perf-testing-engine §2`, `:206-210`.)

---

## § Folds

Retires (by finding id):
- **`a-testing-robustness TR-3`** — the computed-resolution path is structurally untestable
  under jsdom; the G.W2 C5 `50dvh` gate as specified cannot run on the rAF path — SPLIT into
  S1 (the jsdom-OK injection-seam unit test) + S2 (the Playwright real-DOM corpus) — S1 + S2
  + gate clauses 1, 2, 6.
- **`a-testing-robustness TR-4`** — no `@keyframes` parse corpus; round-trips are
  frame-count/name shaped, not value-fidelity shaped — the corpus + the value-fidelity
  round-trip — S3 + gate clauses 3, 4.

**SUPERSEDES (the explicit re-tag, `_SYNTHESIS-perf-testing-engine §2`, `:206-210`):**
- **G.W2 S4 (the `50dvh`-on-the-rAF-path clause)** — un-runnable as specified under jsdom
  (the rAF path returns `"50dvh"`); the C5 `50dvh` correctness proof MOVES here (S1 the
  jsdom-OK consumption proof + S2 the genuine-path proof). G.W2 S4 RETAINS only its (b) clause
  — the C1 computed-frame resolve-count witness (the `interp-buffer.bench` computed-unit
  variant), which is a perf/resolve-count witness, not a `50dvh` value assertion. **G.W2's
  hard-gate clause 3 ("C5 — `50dvh` resolves non-identity") is re-pointed at G.W16's gate
  clauses 1+2** (it was the un-runnable rAF assertion; it now reads "owned by G.W16"). The
  re-pin (G.W2) still SHIPS on `proof:all` GREEN + the C1 witness; the C5 *correctness* proof
  is this wave's job. (DAG: G.W16 depends on G.W2 — the C5 fix is the change under test.)

**RECORD (carried so no future lane re-raises):**
- **TR-5 — the SoA correctness twin obligation, re-stated** (`a-testing-robustness TR-5`,
  `:318-330`). `a-engine-perf G-2`'s booked SoA `lerpArray` transposition is gated by a
  *perf* bench (`proof:interp-soa`) that proves speed, not a correct pixel; its correctness
  twin is the *interpolate-anything* transform corpus, which lands in **G.W15** (TR-1), not
  here. RECORDED so the dependency is explicit: `proof:interp-soa` requires
  `proof:interpolate-anything` (G.W15) green — NOT `proof:roundtrip-fidelity` (this wave).
  G.W16's round-trip corpus protects the parse↔format channel; G.W15's protects the interp
  channel. No overlap, no double-book.
- **The S1 value.js-HANDOFF (the injectable viewport/container resolver export).** value.js
  resolves the viewport directly off `window.innerHeight` / `visualViewport`
  (`value.js units/utils.ts:305-309,415-421`); it exposes no `setViewportResolver(fn)` /
  `setContainerResolver(fn)` (the `ScrollTimeline.getViewportHeight` idiom lifted into
  value.js). Such an export would make S1 a pure resolver-injection; it is a value.js-HANDOFF
  (kf proposes, never writes — `a-valuejs-leverage §3.2`; folds into `G.WV`), NOT a blocker —
  S1 ships TODAY on the settable jsdom `window.innerHeight`. RECORDED.
- **`a-modern-css-interp MCI-1` rides as a corpus row, not a new SHIP.** The bare-`cqw`/`dvh`
  rAF case emits a `cqw` STRING the browser resolves each frame (correct-by-accident for the
  bare case); the mixed `cqw↔px` case freezes to px at prepare with no epoch invalidation
  (`a-modern-css-interp.md:94-120`). S2's `100cqw` row WITNESSES the bare-resolution behaviour
  on the genuine path; the mixed-unit *freeze* documentation is MCI-1's own disposition (a
  documented contract + a value.js-HANDOFF classifier fix), NOT a G.W16 SHIP. RECORDED so the
  corpus row is not mistaken for a fix.

**RECORD (already-SOTA — `a-testing-robustness §ALREADY-SOTA`, `:334-360`):** the suite's
DEPTH discipline is exemplary and untouched — every landed E/F/D finding is lock-tested with a
noted BITE (E.W7 `engine-correctness.test.ts`, F.W4 `interp-fastprops`/`zero-alloc`, F.W5
`sync-step`, F.W7/W8 `adapter-capture`/`roundtrip-easing`, the measure gold-standard
`d3-changed-keys.measure.test.ts`); the value.js consumer-contract PARITY idiom already exists
(`leaves-parity.test.ts:18-41`); the lifecycle/playback/group/timeline axis is well covered
(`waapi-lifecycle`/`platform-adopt`/`group`/`timeline`/`sequence-transport`); the injection-seam
discipline S1 reuses is already kf's idiom (`ScrollTimeline`, `timeline.ts:157-172`). This wave
adds ONLY the breadth the orphaned units/parsing migration left un-replaced — the
computed-resolution path jsdom cannot reach + the parse/round-trip corpus. Manufacture no
work against the depth discipline. LEAVE.

---

## § Design decisions

1. **The C5 gate SPLITS into an injection-seam unit test (S1) + a real-DOM corpus (S2) —
   RESOLVED.** A single gate cannot be both jsdom-runnable (so `npm test` protects the
   consumption) AND genuine-path-true (so the resolution is proven on real layout). jsdom does
   no viewport/container/calc resolution (§State 1, Probe-1), so the un-split G.W2 S4 rAF
   assertion is unwritable. The split gives each seam its own bite: S1 proves kf *forwards* the
   resolved px under a controlled viewport (jsdom-OK, rides `npm test`); S2 proves the C5 fix on
   the genuine path (Playwright, the only place it is true). Trade-off: two gates instead of one,
   and S2 needs a browser — but S2 reuses the existing `bench/playwright.bench.ts` harness
   verbatim (SKIP-local / HARD-FAIL-CI), and the alternative (a single jsdom gate) is the
   vacuous gate the §Mandate forbids.

2. **S1 ships on the settable `window.innerHeight`, NOT on a fabricated value.js resolver export
   — RESOLVED.** The brief frames S1 as "against value.js's overridable viewport/container
   resolver (the `ScrollTimeline getScrollY/getViewportHeight` idiom)". The honest live fact:
   value.js does not yet EXPORT such an override — `convertToPixels` reads `window.innerHeight`
   directly (`value.js units/utils.ts:309`). But jsdom's `window.innerHeight` IS a writable
   own-property (verified live), so the test injects the viewport the same way `ScrollTimeline`
   defaults to `() => window.innerHeight` — by controlling that window value. The clean
   resolver-injection export is a value.js-HANDOFF (RECORD above), not a blocker. Trade-off: S1
   sets a global (`window.innerHeight`) rather than passing an injectable callback — but that IS
   the live seam value.js reads, it is restored in `afterEach`, and inventing a kf-side resolver
   shim would be the duplicate-policy DRY violation the §Mandate forbids (the resolution lives
   ONCE in value.js).

3. **TR-4's round-trip is value-fidelity, NOT frame-count — RESOLVED + the no-silent-degrade
   clause.** `format.test.ts` already round-trips frame count + property names; that cannot catch
   a serializer dropping a transform channel (the value is wrong but the count is right). The
   §Mandate's no-silent-degrade demands the round-trip assert the *interpolated value* survives
   — so the gate diffs `interpFrames(0.5)` across parse→format→reparse, byte-same. This
   generalizes G.W4's `proof:roundtrip-easing` (easing only) to the full value matrix. Trade-off:
   a value-fidelity round-trip is stricter (a legitimate serialization re-ordering that produces
   the same pixels but a different byte sequence could red) — but the corpus rows are chosen to
   have a stable canonical serialization (the F.W7 round-trip already locks the easing channel
   this way), and byte-same-midpoint is the falsifiable form; a "close enough" tolerance would
   re-admit the silent-drop the gate exists to catch.

4. **This is a NEW testing wave, NOT a fold into G.W2 — RESOLVED.** The re-pin (G.W2) is a
   *consume-unchanged* manifest+lockfile SHIP gated on `proof:all` GREEN + the C1 witness; the
   testing band is a SEPARATE, larger test-authoring effort (a Playwright real-DOM path + a
   fixture corpus) the suite owes regardless of G but that the re-pin makes URGENT (it changes
   the boundary the tests must protect). It MUST land AFTER G.W2 (to protect the new C5/A2
   behaviour) and it is the correctness twin the C5 fix ships without today
   (`_SYNTHESIS-perf-testing-engine §2`, `:212-217`). Trade-off: it front-loads a browser-gated
   band into the testing effort — but the C5 fix is the spine's single named correctness break,
   and a named break without a biting genuine-path test is exactly the charter-promise-not-shipped
   the §Mandate forbids.

5. **The corpus is the orphaned-migration's un-replaced shadow — RESOLVED.** `CLAUDE.md` still
   advertises `test/units.test.ts` / `test/parsing.test.ts` / `test/editor-parsing.test.ts` —
   none exist (`a-testing-robustness.md:84-97,383-388`); the units/parse/color layer migrated
   wholesale into value.js but its consumer-contract tests did NOT move with the code. The
   computed-resolution + parse/round-trip holes are the shadow of that un-replaced migration
   (the §Mandate's "no replaced surface beside its replacement" applied to the test surface).
   Trade-off: closing it adds test files for a layer kf no longer OWNS — but kf still CONSUMES
   that layer through `lerpValue → iv._lerp`, and the consumer-contract test (the `leaves-parity`
   idiom) is precisely what the migration orphaned; authoring it here is the gestalt close, not
   new surface. (The stale `CLAUDE.md` "15 files, 261 tests" line is a doc-only RECORD owned by
   G.WZ's FINAL reconciliation, not edited here — test-only charter.)
