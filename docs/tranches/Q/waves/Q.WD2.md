# Q.WD2 — Grammar-fuzz fast-check harness + kf-vs-browser differential oracle (the P.W9 S3/S4 split)

**Band:** D — Correctness.
**Phase:** NOW — kf-internal. `fast-check` is a new devDependency. The differential oracle (S3) rides the established `scripts/lib/demo-driver.mjs` `withPage`/`withBrowser` harness, which resolves chromium via `resolveChromium()` (`demo-driver.mjs:275–283` — `playwright-core`/`@playwright/test`/`playwright` resolved from `KF_PLAYWRIGHT_DIR` via `createRequire`, exactly like every existing browser-tier gate). NOTE (VERIFIED 2026-06-23): Playwright is NOT a `package.json` devDependency — `grep -i playwright package.json` → ZERO; the browser is provided EXTERNALLY by the CI environment (`KF_PLAYWRIGHT_DIR`) and `npm install` prunes it. So S3 adds NO new dependency and, when chromium is unresolvable, the gate emits the established `[CI observe-only]` note (it never passes vacuously under `KF_REQUIRE_BROWSER=1`). `fast-check` is the ONLY new dependency. No sibling publish dependency.
**Sequence (DAG edges):**
```
Q.WA3 master-merge ─► Q.WD1 (NaN-frame proper cure, the named-selector-resolve seam)
                             │
                             ▼
                        Q.WD2 (this wave — fuzz harness + differential oracle OVER the corrected surface)
```
Q.WD2 depends on Q.WD1 landing first: the differential oracle's named-selector fixture arm is SKIPPED until Q.WD1 resolves them; once Q.WD1 lands, the arm becomes a real clause. The fuzz harness (S1/S2) is independent of Q.WD1 but shares the correctness posture; authoring them together is the gestalt (the P.W9 B-band split into its own Q wave).

**Owning ideas:**
- **P.W9 S3 (grammar-fuzz harness, RE-SCOPED)** — authored in P.W9 but NOT IMPLEMENTED; this wave is the implementation tranche. The RE-SCOPE from the 2026-06-22 loop-harden still applies: the none→NaN and color()-wrapper-loss breaches are LIVE in value.js 1.1.0 (re-confirmed in this session: `parseCSSValue('oklch(0.6 none 200)')` → `"oklch(0.6 NaN 200)"`; `parseCSSValue('color(display-p3 1 0 0)')` → `"display-p3(1 0 0)"`). The `round()` breach was fixed in value.js 1.1.0 (`parseCSSValue('round(nearest, 3.7px, 1px)')` → round-trips correctly). So the Q-state RE-SCOPE: only the none-channel and color()-wrapper arms need expected-failure tripwires; the `round()` arm is now a GREEN standard arm.
- **P.W9 S4 (differential oracle, SPLIT)** — the kf-vs-browser differential oracle remains unimplemented; this wave authors it as `proof:kf-differential`. The WAAPI-eligible subset is the immediate-horizon arm; the full CDP path defers to a future wave.
- **X4-N2 / V3-N5 / X4-N1** — the `AUDIT-DIGEST.md` ideas that seeded P.W9 S3+S4.

Audit lanes: **B2-pw9-nanframe** (the split rationale), **B5-kf-engine-arch** (the outstanding correctness oracle frontier).

This wave **implements the P.W9 S3+S4 split** exactly as the P.W9 spec developed it (the development spec is authoritative, zero scope change), RE-SCOPED for the actual value.js 1.1.0 state (round() is now GREEN; none-channel + wrapper-loss are still LIVE in 1.1.0, dispatched to value.js 1.2.0 as expected-failure tripwires). The grammar-fuzz and differential oracle are genuinely INDEPENDENT of the NaN-frame cure (different files, different test fixtures, different failure modes) — the split is the gestalt.

---

## Context

### Why these are Band-D correctness, not a carry-forward of Band-B

P.W9 was chartered in P Band D because all three of {the NaN-frame cure, the grammar oracle, the differential oracle} share ONE invariant: **correctness is observable only at runtime over real CSS inputs, never by inspecting source shapes**. Q.WD2 inherits this posture: the fuzz harness asserts round-trip structural equality (a runtime observable over generated CSS fragments), and the differential oracle asserts `|kf.at(0.5) - waapiMid| < TOLERANCE` (a browser-tier runtime observable).

### The grammar-fuzz harness (P.W9 S3, RE-SCOPED for value.js 1.1.0)

The three confirmed inv-O-2 breaches in value.js that seeded P.W9 S3 have PARTIALLY landed in 1.1.0:

| Breach | P.W9 status (vs. value.js 1.0.2) | Q.WD2 status (vs. value.js 1.1.0, probe confirmed 2026-06-23) |
|--------|----------------------------------|---------------------------------------------------------------|
| `oklch(0.6 none 200)` → `"oklch(0.6 NaN 200)"` (none→NaN) | LIVE, expected-failure tripwire | STILL LIVE: `parseCSSValue('oklch(0.6 none 200)')` → `"oklch(0.6 NaN 200)"` → expected-failure tripwire (VJ-Q9 dispatch, 1.2.0) |
| `color(display-p3 1 0 0)` → `"display-p3(1 0 0)"` (wrapper-loss) | LIVE, expected-failure tripwire | STILL LIVE: `parseCSSValue('color(display-p3 1 0 0)')` → `"display-p3(1 0 0)"` → expected-failure tripwire (VJ-Q9 dispatch, 1.2.0) |
| `round(nearest, 3.7px, 1px)` throws `TypeError: t is not iterable` | LIVE for ALL forms, SKIP entirely | FIXED in value.js 1.1.0: `parseCSSValue('round(nearest, 3.7px, 1px)')` → round-trips correctly → now a STANDARD GREEN arm |

The Q.WD2 re-scope: the `round()` arm UNFOLDS from a SKIP to a standard green arm (the value.js P fix landed). The none-channel + wrapper-loss arms remain expected-failure tripwires pointing at value.js 1.2.0. The harness ships GREEN-today on today's tree once `fast-check` is added.

**What the harness catches (the round-trip oracle).** A structural round-trip failure means:
- `oklch(0.6 none 200)` → serializes `"NaN"` in the channel → re-parse produces a different unit type → equality fails.
- `color(display-p3 ...)` → round-trips as `display-p3(...)` → different function name → equality fails.
- Any `round()` serialization regression (if value.js regresses on `round()` after 1.1.0) → round-trip breaks → the gate auto-detects.

**born-RED today.** `fast-check` is absent from devDependencies (`grep "fast-check" package.json` → zero; `ls node_modules/fast-check` → ABSENT). The gate script cannot import it → exits 1.

### The differential oracle (P.W9 S4)

The existing `proof:roundtrip-fidelity` + `proof:replay-equality` oracles prove internal consistency but are blind to browser divergence. `proof:kf-differential` captures the kf engine's WAAPI projection (via an `Element.prototype.animate` spy around `kf.setUseWAAPI(true); kf.play()`), runs the captured keyframes/options as a real `Element.animate(...)` in Chromium (resolved by the `demo-driver.mjs` `resolveChromium()` harness — see Dependencies; Playwright is NOT a `package.json` devDep), seeks it to the midpoint, and compares the browser's `getComputedStyle(target)` against `kf.at(0.5)` for every WAAPI-eligible fixture in `test/fixtures/keyframes/`.

**WAAPI-eligible corpus for Q.** The P.W9 S4 spec identified four eligible fixtures: `opacity-3stop.css`, `multi-prop.css`, `transform-multiarg.css`, `per-kf-easing.css`. These are UNCHANGED in the Q.WD2 tree (among the 14 `*.css` fixture files in `test/fixtures/keyframes/` today — VERIFIED `ls test/fixtures/keyframes/*.css | wc -l` → 14, plus `manifest.json`; none of the 14 use `entry`/`exit` selectors, which would require Q.WD1). The Q delta: a named-selector fixture (`named-selector.css`) added by S2 becomes WAAPI-eligible AFTER `bindTimeline` resolves the selectors — the Q.WD2 gate skips it until Q.WD1 lands, then adds it as a 5th eligible fixture. This is pre-specified as a `FUTURE_AFTER_WD1` note in the gate, not a blocking dependency.

**born-RED today.** `proof:kf-differential` script is absent (`ls scripts/proof-kf-differential.mjs` → no file) → exits 1.

---

## Scope

### S1 — Add `fast-check` devDependency and author `test/grammar-fuzz.test.ts`

**Breach.** No property-based fuzz oracle exists (`grep -rn "fast-check\|fc\.\|fc\.oneof" test/ scripts/` → zero hits). The three confirmed inv-O-2 breaches were hand-discovered in audits; a round-trip fuzz oracle would have caught them automatically. `test/fixtures/keyframes/` has zero named-selector, zero color-none-channel, zero `color()` wrapper fixtures.

**Cure.** Add `fast-check` as a devDependency (`npm install --save-dev fast-check`, version `^3.x`). Author `test/grammar-fuzz.test.ts` — a vitest test using fast-check arbitraries:

```
Arbitrary<CSSFragment> → parse via CSSKeyframesAnimation.fromString()
  → serialize via `await CSSKeyframesToString(animation, name)` (format.ts:435 —
    the async whole-block serializer; the SAME round-trip surface
    proof:roundtrip-fidelity uses, roundtrip-fidelity.test.ts:15. NOTE: there is
    NO bare `format()` export in format.ts; the serialize surface is
    CSSKeyframesToString / keyframesBlock, VERIFIED 2026-06-23)
  → re-parse via CSSKeyframesAnimation.fromString(keyframesBlock(serialized))
  → assert: every compiled frame in round-1 and round-2 has the same property keys,
    same value units (by unit string), and numerically close values
    (|v₁ - v₂| < 1e-4 for numeric leaves — tolerating float-precision serialization rounding)
```

(The test is `async` — `CSSKeyframesToString` returns a Promise; the fast-check property body is an async predicate. The `keyframesBlock(...)` re-extraction mirrors roundtrip-fidelity.test.ts:139.)

**The three Arbitrary families (model-grammar, not raw-string fuzz):**

1. **`colorArb`** — the GREEN-today arms on value.js 1.1.0:
   - Standard arms (pass): `oklch(L C H)` (plain, no `none` channel), `rgb(R,G,B)`, `color-mix(in oklch, ...)` with bounded numeric channels from `fc.float({ min: 0, max: 1 })`.
   - Expected-failure tripwires (auto-flip on the VJ-Q9 serialization-fidelity fix, consumed via the Q.WG4 `^1.2.0` re-pin):
     - `oklch(L none H)` — none-channel → serializes `"NaN"`, round-trip breaks. Tripwire: `fc.assert(fc.property(noneChannelArb, css => expectKnownBroken(css, /NaN/)))` — documents the known-broken state and auto-flips when value.js fixes none-channel serialization (VJ-Q9).
     - `color(display-p3 R G B)` — wrapper-loss → round-trips as `display-p3(...)`. Tripwire: same pattern, detects the wrapper-loss symptom. Feed the exact probe output to `docs/tranches/Q/KF-TO-VALUEJS-Q.md` as the regression corpus for the VJ-Q9 dispatch to fix against.

2. **`mathArb`** — `calc(<expr>)`, `clamp(<min>, <val>, <max>)`, `round(nearest, <val>, <step>)` with `fc.float()` leaves. ALL three pass GREEN on value.js 1.1.0 (the `round()` breach was fixed). The `round()` arm unfolds from the P.W9 SKIP to a standard passing arm — the Q.WD2 delta vs. P.W9.

3. **`keyframeStopArb`** — generates `@keyframes x { <stop%> { <prop>: <colorArb|mathArb> } }` with `fc.integer({ min: 0, max: 100 })` selector percentages, one to three stops, using only the GREEN-today arms of `colorArb` and `mathArb`.

**Scoped-GREEN posture (the anti-blocked-harness discipline).** A harness permanently RED on a sibling publish is a blocked harness — the P.W9 spec captured this correctly. The Q.WD2 harness ships GREEN-today by: (a) running only the confirmed-green arms as standard passing cases; (b) converting none-channel + wrapper-loss into expected-failure tripwires that document the known-broken state and auto-flip when value.js fixes them (the VJ-Q9 dispatch, consumed via Q.WG4 `^1.2.0`); (c) making `round()` a standard passing arm (fixed in 1.1.0 — the re-scope). The green arms ARE the gate's contribution to coverage NOW; the tripwires ARE the VJ-Q9 serialization-fidelity regression detectors.

**CI run budget.** Default 200 cases (cap at 50 for CI); fixed seed `fc.seed(42)` for reproducibility; 30s timeout; randomized variant `proof:grammar-fuzz-random` for pre-release stress sweeps.

**Gate wire.** `proof:grammar-fuzz` (NEW — `node scripts/proof-grammar-fuzz.mjs`, thin wrapper driving `vitest run test/grammar-fuzz.test.ts`). Wire into `proof:hygiene` alongside `proof:roundtrip-fidelity`.

### S2 — Add a named-selector fixture to `test/fixtures/keyframes/` (the Q.WD1-aligned addition)

**Breach.** `test/fixtures/keyframes/` has zero named-selector fixtures (`ls test/fixtures/keyframes/ | grep named` → zero; confirmed). The O.W3 spec named this addition; P.W9 carried it; it was never executed. The fuzz harness's structural-equality oracle needs at least one named-selector fixture to exercise the Q.WD1 `bindTimeline` seam.

**Cure.** Add `test/fixtures/keyframes/named-selector.css`:

```css
@keyframes scroll-reveal {
  entry { opacity: 0; transform: translateY(20px); }
  entry 50% { opacity: 0.5; }
  exit { opacity: 0; transform: translateY(-10px); }
}
```

This fixture exercises: (a) the bare `entry` and bare `exit` named selectors, (b) the range-fraction form `entry 50%`, (c) two properties on the same named stop, (d) Q.WD1's `bindTimeline` seam (the fixture is ONLY usable with a bound timeline — tests that exercise it call `bindTimeline(new ManualTimeline())` first).

**MANDATORY manifest co-edit (the integration constraint — VERIFIED 2026-06-23).** `test/fixtures/keyframes/` is NOT a free drop directory: `proof:roundtrip-fidelity` (`test/roundtrip-fidelity.test.ts:78–87`) asserts `manifest.fixtures.length === (count of *.css files)` AND that EVERY `.css` round-trips against its manifest row. Dropping `named-selector.css` with NO manifest row → the count assertion REDS; a row demanding the standard `byte` round-trip → REDS (named selectors do not resolve to numeric `%` without a timeline). The resolution: add a `manifest.json` row for `named-selector.css` with **`roundtrip: "text"`** and `verbatim: ["entry", "exit"]` — the existing `text`-mode oracle (J.W1 SEAM-3: serialize→reparse→serialize BYTE-SAME, every `verbatim` token appears authored, never DOM-resolved) is EXACTLY the L.W1 S4 opaque-ingest floor for named selectors (`entry`→`entry` round-trips verbatim through `format.ts` WITHOUT a timeline). `keys` lock the flattened `parsedVars` shape (`opacity`, `transform.translateY`). This row makes the fixture a first-class corpus member without tripping `proof:roundtrip-fidelity`.

**Integration with the fuzz gate.** The fuzz harness's `keyframeStopArb` uses only `%` selectors (model-grammar) — not named selectors. The named-selector fixture is a CORPUS addition to `test/fixtures/keyframes/` for the DIFFERENTIAL ORACLE (S3) and the VITEST regression suite, not for the fuzz Arbitrary.

**Gate bite.** `proof:grammar-fuzz` `fixture-count` clause: `test/fixtures/keyframes/` has ≥ 15 `*.css` fixture files AND each has a `manifest.json` row (the glob is `*.css`, EXCLUDING `manifest.json`). Today: 14 `*.css` files (VERIFIED: `ls test/fixtures/keyframes/*.css | wc -l` → 14) → RED; after Q.WD2 adds `named-selector.css` + its manifest row: 15 `*.css` files, all manifest-covered → GREEN. (The clause re-asserts `proof:roundtrip-fidelity`'s own coverage invariant on the new fixture, catching an accidental deletion of either the fixture or its row.)

### S3 — `proof:kf-differential` kf.at(t) vs WAAPI interpolation (the differential oracle)

**Breach.** No browser-differential gate exists (`ls scripts/proof-kf-differential.mjs` → no file; `ls scripts/proof-differential.mjs` → no file — confirmed). The existing `proof:roundtrip-fidelity` + `proof:replay-equality` oracles are purely JS-model oracles — blind to browser divergences (a kf lerp bug, a color space discrepancy, an easing mis-application). This is the long-term correctness investment the P.W9 spec named: "it closes the 'JS model matches browser' claim that the existing purely-JS oracles cannot prove."

**Cure.** Author `scripts/proof-kf-differential.mjs` using the established harness (`scripts/lib/demo-driver.mjs` `withPage`, `demo-driver.mjs:513`). The gate injects a minimal fixture page (blank `<div id="target">` + the dist bundle loaded via `loadAnimationEngine()`) and for each WAAPI-eligible fixture in `test/fixtures/keyframes/` runs:

```
1. Parse: const { CSSKeyframesAnimation } = await loadAnimationEngine();
          const kf = new CSSKeyframesAnimation(opts).fromString(css).setTargets(target)
2. Sample: kfMid = kf.at(0.5) → { [prop]: value } map for all animated props
3. WAAPI keyframes/options CAPTURE — `toWAAPIKeyframes`/`toWAAPIOptions`
   (waapi.ts:260 / :356) are FREE functions, HEAVY, and NOT barrel-exported,
   so the gate cannot import them off the dist surface. Instead, capture what
   the engine passes to `Element.animate` by spying on the prototype before
   the WAAPI play:
       const calls = [];
       const orig = Element.prototype.animate;
       Element.prototype.animate = function (kfs, opts) {
           calls.push({ kfs, opts });
           return orig.call(this, kfs, opts);   // real WAAPI Animation
       };
       kf.setUseWAAPI(true); await kf.play();    // engine delegates → playWAAPI
       Element.prototype.animate = orig;
   The captured `{ kfs, opts }` is exactly the engine's WAAPI projection. Then
   sample WAAPI's interpolated midpoint:
       const waapiAnim = target.animate(calls[0].kfs, { ...calls[0].opts, fill: "both" });
       waapiAnim.currentTime = (calls[0].opts.duration ?? opts.duration) / 2;
       const waapiMid = getComputedStyle(target);   // mid-animation computed values
       waapiAnim.cancel();
4. Compare: for each numeric property in kfMid,
            assert |kfMid[prop] - waapiMid[prop]| < TOLERANCE
            (tolerance = 0.01 for opacity/unitless; 0.5px for lengths; 2° for hue)
```

(The `Element.prototype.animate` spy is the grounded WAAPI-projection capture — it requires NO new public API on the animation and exercises the REAL `playWAAPI` delegation at `waapi.ts:420`. Reading the midpoint via `getComputedStyle(target)` on a `currentTime`-seeked WAAPI animation is the browser's own interpolation, the true differential reference — strictly stronger than parsing `effect.getKeyframes()`, which returns only the author stops, not the interpolated midpoint.)

**WAAPI-eligible corpus subset.** Eligible fixtures on today's tree (the same set P.W9 S4 identified, now re-verified on the Q state):

| Fixture | Reason eligible |
|---------|----------------|
| `opacity-3stop.css` | numeric only, uniform linear easing, no computed units, no color interpolation |
| `multi-prop.css` | multiple properties, default ease, no computed units |
| `transform-multiarg.css` | transform shorthand, uniform timing |
| `per-kf-easing.css` | per-stop easing, WAAPI-eligible timing variety |

**Not yet eligible (and why):**
- `color-achromatic.css`, `color-chromatic.css` — color interpolation in oklab (WAAPI defaults to sRGB; kf uses oklab by default); the oracle would need explicit `color-interpolation-method: oklab` in the fixture and a sRGB-normalized comparison. SKIP with note: "color-space divergence — use `in srgb` fixtures for differential testing".
- `var-calc.css` — computed units; WAAPI evaluates at computed-value time, kf defers. SKIP with note.
- `named-selector.css` (added by S2) — NOT eligible until Q.WD1 resolves the named selectors via `bindTimeline`. Gate note: `"FUTURE_AFTER_WD1: add after Q.WD1 lands; call kf.bindTimeline(new ManualTimeline()) before the WAAPI play so the named starts resolve to numeric % (otherwise kf.at(0.5) throws NAMED_SELECTOR_NO_TIMELINE — the Q.WD1 guard)"`. This pre-specifies the Q.WD1-extension point without blocking it.

**Minimum coverage assertion.** The gate asserts ≥ 4 WAAPI-eligible fixtures were exercised (not just present — actually run). This prevents a scenario where the eligible list is EMPTY due to a fixture change and the gate false-greens by skipping everything.

**WAAPI-actually-took assertion (the spy-capture robustness).** For each eligible fixture, the gate MUST assert the `Element.prototype.animate` spy captured a call (`calls.length > 0`) — i.e. the engine genuinely took the WAAPI path. If `isWAAPIEligible` (`waapi.ts:109`) returns false in the headless Chromium (the engine falls back to rAF and never calls `Element.animate`), the spy captures nothing and the gate must FAIL with the queryable `kf.waapiIneligibleReason`, NOT silently skip. This closes the "the gate green-passes because WAAPI never ran" hole — the differential is only meaningful when WAAPI actually drove the animation.

**Tolerance policy.** Matching the P.W9 S4 spec: `0.01` for opacity/unitless, `0.5px` for lengths, `2°` for hue channels. Browser float formatting allows modest rounding; the tolerance covers serialization noise (the `getComputedStyle(target)` midpoint read on a `currentTime`-seeked WAAPI animation returns resolved values that may differ in the 3rd decimal due to browser-internal interpolation float precision + sub-frame seek granularity).

**CI posture: `observe-only` on Linux runner.** Per the device-dependence lesson (`project_ci_device_dependence_greening`): use the `observeOnlyInCI(reason, label)` mechanism (`scripts/lib/ci-env.mjs:53–65` — it emits the established `[CI observe-only — <reason>] <label>` note; `POSTURES` includes `"observe-only"` at `ci-env.mjs:44`) with reason `"browser differential — Chromium render timing varies on slow runner"`. The gate runs hard on macOS CI + local but is observe-only on the Linux runner. Wire into **`proof:hygiene`** (`package.json:200`) — the SAME roster its named observe-only siblings `proof:scene-transition-perf` and `proof:lighthouse-a11y` occupy (VERIFIED 2026-06-23: both are in `proof:hygiene`, NOT `proof:correctness`). `proof:correctness` (`package.json:199`) is the live-demo interaction tier (subject-animates, easing-editor-live) — not the home of the browser-differential observe-only family.

**born-RED today.** The script file is absent → exits 1. After authoring: born-RED on the minimum-coverage check until the four eligible fixtures are confirmed and produce `|kf.at(0.5) - waapiMid| < TOLERANCE` for all numeric properties.

### S4 — `proof:grammar-fuzz` and `proof:kf-differential` wired into the gate roster; the two DISPATCH notes filed

**Breach.** The none-channel and wrapper-loss expected-failure tripwires need a value.js 1.2.0 dispatch, and the overall gate roster is missing both new gates.

**Cure.**
1. Wire `proof:grammar-fuzz` into `proof:hygiene` (`package.json:200`, blocking, non-observe-only — headless vitest, no browser; alongside `proof:roundtrip-fidelity`).
2. Wire `proof:kf-differential` into `proof:hygiene` (`package.json:200`, observe-only on the Linux runner via `observeOnlyInCI`; alongside the existing observe-only browser-tier siblings `proof:scene-transition-perf` + `proof:lighthouse-a11y`). NOT `proof:correctness` — that roster (`package.json:199`) is the live-demo interaction tier and holds neither of those siblings.
3. **File the kf-side dispatch note + name the owning VJ-Q slot.** Append to `docs/tranches/Q/KF-TO-VALUEJS-Q.md` the exact probe outputs as the regression corpus, AND name the concrete value.js obligation that gives the two tripwires a GATED auto-flip exit (per inv-16: the kf wave authors only this cross-reference note; the foreign-tree FIX is the dispatch doc's VJ-Q slot). The probe corpus:
   - `oklch(0.6 none 200)` → expected `'oklch(0.6 none 200)'`, got `'oklch(0.6 NaN 200)'` (none→NaN LIVE on 1.1.0 — probe re-confirmed 2026-06-23)
   - `color(display-p3 1 0 0)` → expected `'color(display-p3 1 0 0)'`, got `'display-p3(1 0 0)'` (wrapper-loss LIVE on 1.1.0 — probe re-confirmed 2026-06-23)

   **CROSS-DOC DEPENDENCY (the GATED exit — must be honored by the dispatch-doc-owning lane):** `KF-TO-VALUEJS-Q.md` currently has VJ-Q1…VJ-Q8 but NO slot owning the **none-channel + `color()`-wrapper serialization-fidelity** fix (VERIFIED 2026-06-23: `grep "none-channel\|wrapper-loss\|display-p3(1" KF-TO-VALUEJS-Q.md` → ZERO). Without an owning VJ-Q slot + its own value.js born-RED gate, these two tripwires are orphaned (auto-flip at the kf-gate level on ANY serialization fix, but with no value.js OBLIGATION to ship it — the perpetual-tripwire risk friction-pre-empt #5 names). This wave's S4 therefore REQUIRES a NET-NEW dispatch slot **VJ-Q9 (CSS serialization fidelity — none-channel `<percentage>`/`<number>`-or-`none` powerless-channel round-trip + `color()`-wrapper preservation)** added to `KF-TO-VALUEJS-Q.md`, 1.2.0, with value.js born-RED gate `proof:serialize-fidelity` asserting `parseCSSValue('oklch(0.6 none 200)').toString() === 'oklch(0.6 none 200)'` AND `parseCSSValue('color(display-p3 1 0 0)').toString() === 'color(display-p3 1 0 0)'`. The kf tripwires auto-flip when VJ-Q9 lands and kf re-pins `^1.2.0` (Q.WG4). This S-clause is a cross-doc note (a dependency the dispatch lane owns), NOT a foreign-tree edit by this wave.
4. Add `fast-check ^3.x` to `devDependencies` in `package.json`.

**Gate bite.** `proof:grammar-fuzz` and `proof:kf-differential` both absent from `package.json` gate roster today; the VJ-Q9 dispatch slot absent from `KF-TO-VALUEJS-Q.md` today → all RED.

---

## Born-RED gate

**Gates:** `proof:grammar-fuzz` (NEW — `scripts/proof-grammar-fuzz.mjs`) · `proof:kf-differential` (NEW — `scripts/proof-kf-differential.mjs`).

The born-RED observables, witnessed on today's tree (2026-06-23):

| Gate / clause | Witness today (the GENUINE absence / defect) | RED observable today | GREEN condition |
|---|---|---|---|
| `proof:grammar-fuzz` — gate absent | `ls scripts/proof-grammar-fuzz.mjs` → no file; `grep "fast-check" package.json` → zero; `ls node_modules/fast-check` → ABSENT | gate script cannot import `fast-check` → exits 1 | `fast-check` in devDeps; GREEN-today arms (plain oklch, rgb, color-mix, calc, clamp, round, keyframeStopArb over those) pass; none-channel + wrapper-loss arms as expected-failure tripwires (auto-flip on the VJ-Q9 serialization-fidelity fix consumed via the Q.WG4 `^1.2.0` re-pin); named-selector fixture added (15 `*.css` files, all manifest-covered) |
| `proof:grammar-fuzz` — none-channel tripwire | `parseCSSValue('oklch(0.6 none 200)')` → `"oklch(0.6 NaN 200)"` (probe confirmed 2026-06-23 against installed value.js 1.1.0) | the arm detects the known-broken state and records it as EXPECTED_FAILURE | auto-flips to standard GREEN when the VJ-Q9 fix lands (`oklch(0.6 none 200)` round-trips verbatim) and kf re-pins `^1.2.0` |
| `proof:grammar-fuzz` — wrapper-loss tripwire | `parseCSSValue('color(display-p3 1 0 0)')` → `"display-p3(1 0 0)"` (probe confirmed 2026-06-23 against installed value.js 1.1.0) | the arm detects the known-broken state and records it as EXPECTED_FAILURE | auto-flips to standard GREEN when the VJ-Q9 fix lands (`color(display-p3 1 0 0)` round-trips verbatim) and kf re-pins `^1.2.0` |
| `proof:grammar-fuzz` — round() arm | `parseCSSValue('round(nearest, 3.7px, 1px)')` → round-trips correctly (probe confirmed 2026-06-23, FIXED in 1.1.0) | arm is GREEN on today's tree (once fast-check is installed) — this is the Q.WD2 re-scope delta vs. P.W9 | standard GREEN arm, no tripwire needed |
| `proof:kf-differential` — gate absent | `ls scripts/proof-kf-differential.mjs` → no file | exits 1 | script present; ≥4 WAAPI-eligible fixtures run; all numeric props within tolerance |
| `proof:kf-differential` — minimum coverage | `test/fixtures/keyframes/` has ≤4 WAAPI-eligible fixtures exercised | exits 1 if < 4 eligible fixtures ran | ≥4 eligible fixtures run (opacity-3stop, multi-prop, transform-multiarg, per-kf-easing) |

**Born-RED on the keystone defect (the absent harnesses).** The `proof:grammar-fuzz` gate is born-RED because `fast-check` is absent from devDependencies — the gate cannot import it → exits 1. The `proof:kf-differential` gate is born-RED because the script file is absent → exits 1. Both are genuine born-RED states (not proxy REDs from a sibling ship).

**Planted-failure (born-RED proof).** On an unmodified tree:
- `proof:grammar-fuzz` exits 1: `fast-check` absent; the gate script cannot run.
- `proof:kf-differential` exits 1: script absent.

After `fast-check` is added and gates are authored:
- `proof:grammar-fuzz` GREEN-today arms (plain oklch, rgb, color-mix, calc, clamp, round, keyframeStopArb over those) pass on today's value.js 1.1.0 tree; the none-channel + wrapper-loss arms run as EXPECTED_FAILURE (documented known-broken state); the gate is USEFUL NOW.
- `proof:kf-differential` GREEN on the four WAAPI-eligible corpus fixtures on macOS; observe-only on Linux CI.

**The three broken arms are NOT permanent-RED planted regressions** (CONTRIVANCE-AUDIT anti-pattern). The harness ships with the GREEN-today arms passing; the two broken arms ship as expected-failure tripwires; the `round()` arm is a standard green arm (fixed). A gate that is permanently RED on a sibling publish is a blocked gate — the scoped-GREEN posture is the correct discipline.

---

## Dependencies

- **`fast-check ^3.x` (NEW devDependency).** Must be added (`npm install --save-dev fast-check`) before `test/grammar-fuzz.test.ts` is authored. Version: `^3.x` (the current stable major). No production dependency.
- **Chromium via `scripts/lib/demo-driver.mjs` `withPage` (`demo-driver.mjs:513`).** The established harness for browser-tier gates. Chromium is resolved by `resolveChromium()` (`demo-driver.mjs:275–283`) from `KF_PLAYWRIGHT_DIR` — Playwright is NOT a `package.json` devDependency (VERIFIED: `grep -i playwright package.json` → ZERO; `npm install` prunes it). The CI environment provides it; locally the gate notes `[CI observe-only]` when chromium is unresolvable. No new browser dependency is added.
- **value.js 1.1.0 (already pinned `^1.1.0`).** S1's GREEN-today arms run against 1.1.0. The two expected-failure tripwires are dispatched to value.js 1.2.0 via `docs/tranches/Q/KF-TO-VALUEJS-Q.md`.
- **Q.WD1 (dependency for the named-selector fixture arm in S3).** S3's `FUTURE_AFTER_WD1` note pre-specifies the extension point. S3 is authored and wired into CI without waiting for Q.WD1 — the named-selector fixture arm is SKIPPED until Q.WD1 lands (`proof:nan-frame` is the Q.WD1 gate; `proof:kf-differential` notes the dependency).
- **Independent of every other Q Band wave.** File surfaces: `test/grammar-fuzz.test.ts` (NEW), `test/fixtures/keyframes/named-selector.css` (NEW), `scripts/proof-grammar-fuzz.mjs` (NEW), `scripts/proof-kf-differential.mjs` (NEW), `package.json` (devDep + gate roster), `docs/tranches/Q/KF-TO-VALUEJS-Q.md` (dispatch notes). No collision with Q.WD1 (touches `engine.ts`/`frame-compiler.ts`), Q.WA* (touches CI/ledger), Q.WB* (touches `engine.ts`/`group.ts`).

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WD2 — DOCS ONLY. It writes zero engine, demo, or library source (inv-16: kf writes only keyframes.js; the none-channel + wrapper-loss dispatch is a `KF-TO-VALUEJS-Q.md` cross-ref note naming the owning **VJ-Q9** slot, not a foreign-tree edit — the value.js serialization FIX is the dispatch-doc lane's, fired GATED via the Q.WG4 `^1.2.0` re-pin). The IMPLEMENTATION opens only on the owner's explicit authorization, DAG-ordered AFTER Q.WA3 master-merge and ideally after Q.WD1 (so the named-selector fixture arm unfolds immediately). When it opens, the implementation order is:

1. **Gate-first** (the born-RED requirement): author `scripts/proof-grammar-fuzz.mjs` + `scripts/proof-kf-differential.mjs` BEFORE any test is authored. Confirm both exit 1 on today's tree (`fast-check` absent; gate scripts absent).
2. **S1 devDep**: add `fast-check ^3.x` to `devDependencies`. Confirm `npm install` completes cleanly.
3. **S1 test**: author `test/grammar-fuzz.test.ts` with the three Arbitrary families (colorArb GREEN arms + two expected-failure tripwires, mathArb including `round()` as a standard green arm, keyframeStopArb). Run `proof:grammar-fuzz` → GREEN (GREEN-today arms pass; tripwires detect the known-broken state as EXPECTED_FAILURE).
4. **S2 fixture**: add `test/fixtures/keyframes/named-selector.css`. Run `proof:grammar-fuzz` `fixture-count` clause → 15 `*.css` files → GREEN (14 today + the named-selector addition; the glob is `*.css`, EXCLUDING `manifest.json`).
5. **S3 oracle**: author `scripts/proof-kf-differential.mjs`. Confirm the four WAAPI-eligible fixtures produce `|kf.at(0.5) - waapiMid| < TOLERANCE` for all numeric properties on macOS. Mark the gate `observeOnlyInCI(reason, label)` (`ci-env.mjs:53`) so the slow Linux runner is observe-only, never blocking.
6. **S4 wire + dispatch**: wire `proof:grammar-fuzz` into `proof:hygiene`; wire `proof:kf-differential` into `proof:hygiene` (observe-only — alongside `proof:scene-transition-perf`/`proof:lighthouse-a11y`, NOT `proof:correctness`). File the probe-corpus note in `docs/tranches/Q/KF-TO-VALUEJS-Q.md` AND confirm the owning **VJ-Q9 serialization-fidelity** dispatch slot is present (the cross-doc dependency — the GATED exit for the tripwires). Run `proof:hygiene` (macOS) — GREEN.
7. **Confirm no regression**: `npm test` + `proof:roundtrip-fidelity` + `proof:replay-equality` all green. No existing fixture behavior changes.

**Observable-truth.** The fuzz harness's `throw-or-finite` is the runtime observable for any grammar breach the Arbitraries expose; the `expected-failure` discipline prevents false-greens on known-broken arms while auto-detecting fixes. The differential oracle's `|kf.at(0.5) - waapiMid| < TOLERANCE` is the runtime observable for a browser divergence. Neither gate is a source-shape grep.

---

## Mid-tranche friction pre-empted

1. **The blocked-harness anti-pattern (none-channel + wrapper-loss).** If the none-channel and wrapper-loss arms were authored as HARD-RED standard arms (not expected-failure tripwires), the harness would be permanently RED until the VJ-Q9 serialization-fidelity fix ships — a blocked gate. Pre-empted: the two arms are expected-failure tripwires that document the known-broken state and auto-flip when value.js fixes them (the VJ-Q9 dispatch, consumed via the Q.WG4 `^1.2.0` re-pin). The harness is GREEN-today and useful NOW.

2. **The Q.WD1 blocked named-selector arm.** The differential oracle's named-selector arm (S3) needs Q.WD1's `bindTimeline` to produce finite values. Pre-empted: the arm is pre-specified as `FUTURE_AFTER_WD1` and SKIPPED in the initial gate; it unfolds to a real clause once Q.WD1 lands. The gate's minimum-coverage assertion (≥4 eligible fixtures) is met by the four `%`-selector fixtures alone — the gate does not block on Q.WD1.

3. **The `round()` re-scope vs. P.W9.** P.W9 specified ALL `round()` forms as permanently-SKIP (ALL threw in value.js 1.0.2). Q.WD2 has re-confirmed that `round()` is FIXED in value.js 1.1.0. An implementer reading P.W9 might still add the SKIP. Pre-empted: Q.WD2 explicitly locks the re-scope — `round()` is a standard green arm, the `round()` SKIP note from P.W9 is OBSOLETE for the Q.WD2 tree.

4. **The CI device-dependence trap.** The differential oracle is a browser-tier gate. Adding it as a HARD (blocking) gate on the Linux runner would produce flakes (the exact `project_ci_device_dependence_greening` lesson). Pre-empted: the gate is wired into `proof:hygiene` (`package.json:200`) but marked `observeOnlyInCI` so the Linux runner is observe-only — the SAME roster + SAME treatment as the browser-tier observe-only siblings `proof:scene-transition-perf` and `proof:lighthouse-a11y` (both live in `proof:hygiene`, VERIFIED 2026-06-23 — NOT in `proof:correctness`).

5. **The orphaned-tripwire risk (the "always-RED tripwire").** If Q ships the two expected-failure tripwires WITHOUT a value.js OBLIGATION owning the fix, they could auto-flip at the kf-gate level but with no sibling commitment to ever ship the serialization fix — a soft perpetual. Pre-empted at TWO levels: (a) the tripwires are EXPECTED_FAILURE (green-now, self-terminating at the gate — never block CI); (b) S4 names the concrete **VJ-Q9 serialization-fidelity dispatch slot** (a cross-doc dependency the dispatch-doc-owning lane must add to `KF-TO-VALUEJS-Q.md` with its own value.js born-RED gate `proof:serialize-fidelity`) so there is a real value.js obligation + a Q.WG4 `^1.2.0` consume edge — the GATED exit. This satisfies inv-16 (kf authors only the cross-ref note, never the foreign-tree edit) AND the no-deferral precept (a system-gate exit, not a perpetual punt).

---

## Bite — what regression each gate catches

| Gate / clause | Regression it prevents |
|---------------|------------------------|
| `proof:grammar-fuzz` GREEN-today arms (plain oklch, rgb, color-mix, calc, clamp, round) | A value.js serialization regression (a round-trip structural-equality break) on any of the commonly-used CSS value types — these were HAND-DISCOVERED in audits before; the fuzz oracle auto-detects them going forward |
| `proof:grammar-fuzz` none-channel + wrapper-loss expected-failure tripwires | The none→NaN breach or color()-wrapper-loss breach is FIXED in a value.js publish but the kf grammar-fuzz arm is not updated — the tripwire auto-flips to GREEN (the fix is detected automatically, not discovered in a future audit) |
| `proof:grammar-fuzz` `fixture-count` | The named-selector fixture added by S2 is accidentally deleted or the fixture directory drops below 16 entries — the gate reds, flagging the regression |
| `proof:kf-differential` `|kf.at(0.5) - waapiMid| < TOLERANCE` | A kf lerp bug (a percentage-vs-unitless confusion), a color space discrepancy (kf uses oklab by default; the oracle fixtures use sRGB-compatible colors), an easing mis-application on any of the four WAAPI-eligible corpus fixtures — divergences between kf's JS model and the browser's WAAPI interpolation surface as gate failures |
| `proof:kf-differential` minimum coverage (≥4 eligible) | The eligible fixture list is inadvertently emptied (e.g. all four fixtures become WAAPI-ineligible after a config change) — the gate reds instead of false-greening by vacuous skip |

---

## Excluded from this wave

- **The full-corpus differential oracle over the WAAPI-INELIGIBLE fixtures (X4-N1 deferred body).** Extending the differential oracle to the color-interpolation and computed-unit fixtures (`color-*.css`, `var-calc.css`) requires reconciling kf's oklab-default interpolation against WAAPI's sRGB default (or pinning `color-interpolation-method`) and resolving computed units at the same lifecycle point — a P-tranche deferred item pending a DM-23 vitest-browser runner. The WAAPI-eligible subset (S3, via the `Element.prototype.animate` spy + `getComputedStyle` midpoint read) proves the differential-oracle infrastructure works; the WAAPI-ineligible corpus is a future wave.
- **The value.js serialization FIX for none-channel + wrapper-loss.** This wave files only the kf-side cross-ref note naming the owning **VJ-Q9** slot in `KF-TO-VALUEJS-Q.md` (the dispatch doc, authored by the Q.WG2 dispatch lane — Q.WD2 does NOT edit value.js source per inv-16). The GATED kf consume (re-pin `^1.2.0`, the tripwires auto-flip) is Q.WG4. Q.WD2 authors only the note + the cross-doc dependency; the value.js fix and the kf consume are separate GATED waves.
- **Grammar-fuzz Arbitrary coverage extension (CSS gradient stops, shadow layers, transform chains).** These are future extensions of the `keyframeStopArb` family; Q.WD2 authors the infrastructure (the three core Arbitrary families); the coverage broadens incrementally as the harness proves its value.
- **NaN-frame cure.** That is Q.WD1. Q.WD2 authors the correctness oracles OVER the corrected surface; the cure itself is not in scope here.
