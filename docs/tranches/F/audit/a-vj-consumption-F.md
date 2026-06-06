# a-vj-consumption-F — the value.js CONSUMPTION seam (Tranche F deep-SOTA audit)

**Lane.** `a-vj-consumption-F`. **Scope.** Audit the exact cross-repo edge keyframes
consumes from `@mkbabb/value.js` — the heavy engine surface, the version pin, and the
status of the E `valuejs-sota-handoff.md` Waves A–F *as seen from the consumer side*:
what kf still genuinely depends on value.js to land, what kf has already worked around
locally, and what the handoff over-states. This is research + audit ONLY: zero source
edits, the only artifact is this doc (inv-16 — kf NEVER writes value.js; it may PROPOSE).

**Method.** Every kf claim is `file:line`-grounded against the live `tranche-e-impl`
tree; every value.js claim is grounded against the live source at
`/Users/mkbabb/Programming/value.js` (branch `docs/constellation-grand-audit-2026-06-03`,
**tranche M open**) and the installed `node_modules/@mkbabb/value.js@0.10.0` dist.
I do not re-derive the E handoff's findings — I **diff** them against the post-E live
state and report what moved.

---

## 0. The headline (consumer-side)

1. **The pin is current and the seam is clean.** kf pins `@mkbabb/value.js ^0.10.0`
   (`package.json`); installed = 0.10.0; value.js HEAD `package.json` = 0.10.0. There is
   **no pin lag** — installed === HEAD-declared version. The entire E handoff (Waves
   A–F) remains **unconsumed and OPEN in value.js**: the M-tranche shipped *zero* of the
   kf-relevant items (verified: no `cssColorInterpKeyword`, no `linear()` parser, no
   `convertToPixels` `dvh`-family coverage in value.js src). M is web-app/CI work
   (sessions, palettes, deploy), orthogonal to this seam.

2. **The handoff's chronic §2 rename is ALREADY DISCHARGED — RECORD, do not re-carry.**
   The handoff §2 + ledger XR-1 name `AnimationOptions → CSSAnimationOptions` as "the one
   chronic unowned cross-history item," dispositioned as "a kf-side verification +
   pin-bump *when value.js publishes v1.0.0*." **This is stale.** value.js 0.10.0 — the
   version kf *already pins and ships* — has completed the rename: the published dist
   exports `CSSAnimationOptions` and **no bare `AnimationOptions`**
   (`node_modules/@mkbabb/value.js/dist/parsing/extract.d.ts`). And kf **never imports the
   type name at all** — it defines its own local `AnimationOptions`
   (`src/animation/constants.ts:117`, a renderer-extended superset) and consumes value.js's
   extractor purely *structurally* via `options: ReturnType<typeof extractAnimationOptions>`
   (`src/animation/adapter.ts:30,122`). The rename is therefore **fully transparent to kf
   today** — no pin-bump, no migration, nothing waiting on v1.0.0. **Disposition: RECORD —
   the chronic is closed by the current pin; F should strike it from the open ledger, not
   re-defer it to v1.0.0.** (Likewise `Color.L` / `Color.components`: kf imports `Color`
   **nowhere** — grep `\bColor\b.*import` over `src/` = 0 hits — so that half of §2 is
   vacuous for kf.)

3. **The seam got STRUCTURALLY CLEANER since the handoff was authored — and the root
   CLAUDE.md is now STALE.** The handoff (and the root `CLAUDE.md`) describe a `src/`
   full of re-export barrels (`src/parsing/`, `src/units/`, `src/units/normalize.ts`,
   `src/easing.ts`, `src/math.ts`, `src/utils.ts`). **Those barrels no longer exist** —
   the live `src/` is `src/animation/**` + `src/env.d.ts` only (verified: all six paths
   GONE). kf now imports value.js *directly at each consumption site* with no intermediate
   barrel. This is the ideal consumer shape (no thin-wrapper indirection, no
   re-export drift), and it means **`getComputedValue` / `normalize` are 100%
   value.js-owned** — kf wraps neither; it reaches the computed-unit round-trip purely
   transitively through `lerpValue(eased, iv)` → `iv._lerp` (`src/animation/engine.ts:629`).
   This is the strongest possible confirmation of the Wave C cross-repo edge: *kf consumes
   the entire D-3 fix unchanged because there is no kf-side normalize surface to migrate.*
   **Disposition: RECORD (a doc-truth nit for a future kf housekeeping pass: the root
   `CLAUDE.md` Project-Tree still lists the deleted barrels — out of F-lane scope to fix,
   noted for the owner).**

---

## 1. The COMPLETE consumed surface (ground truth)

kf consumes **exactly 41 names** from `@mkbabb/value.js`, across 9 modules, every one
inside the HEAVY graph (statically in `engine.ts` / `constants.ts` / `waapi.ts` /
`utils.ts` / `format.ts` / `frame-compiler.ts` / `adapter.ts` / `group.ts` /
`animations.ts`), reached only via `loadAnimationEngine()` (`src/animation/index.ts`,
the dynamic boundary). The light orchestration tier
(`stagger`/`flip`/`drag`/`decay`/`sequence`) carries **zero** static value.js edge
(verified — the only `@mkbabb/value.js` strings in those files are *comments asserting
that absence*, e.g. `src/animation/drag.ts:12`, `decay.ts:15`, `sequence.ts:52`).

The 41-name surface, bucketed by handoff wave (so F sees which consumed names each wave
touches):

| Bucket | Consumed names | Handoff wave it rides | Consumer site |
|---|---|---|---|
| **Per-frame interp hot path** | `lerpValue`, `prepareInterpVar`, `normalizeValueUnits`, `InterpolatedVar`, `ValueUnit`, `ValueArray` | **C** (computed-unit), **D** (carrier), **B** (color) | `engine.ts:629`, `utils.ts:339` |
| **Computed/length resolution** | `parseCSSValueUnit`, `convertToMs`, `seekPreviousValue`, `COMPUTED_UNITS` | **C5** (unit coverage), **A6** (per-frame parse), **C1–C7** | `frame-compiler.ts:17`, `waapi.ts:1,30` |
| **Color** | `COLOR_SPACE_RANGES`, `ColorSpace`, `HueInterpolationMethod` | **B** (color hot path), **S4** (WAAPI color) | `constants.ts:2,5,6`, `utils.ts` opts |
| **Easing / math** | `cssLinear`, `LinearStop`, `CSSCubicBezier`, `steppedEase`, `jumpTerms`, `timingFunctions`, `easeInOutCubic`, `clamp`, `scale` | **E1–E5** (parsers for existing evaluators) | `utils.ts:6,22`, `animations.ts:1`, `engine.ts:16,20` |
| **Parsing / format** | `parseCSSStylesheet`, `parseCSSTime`, `extractKeyframes`, `extractProperties`, `extractAnimationOptions`, `KeyframeRule`, `PropertyDescriptor`, `Stylesheet`, `flattenObject`, `unflattenObject`, `unflattenObjectToString`, `tryParse`, `CSSValues`, `CSSFunction`, `FunctionValue`, `formatCSS`, `camelCaseToHyphen`, `reverseCSSTime` | **A** (parse fast tier), **F4** (`@property`) | `adapter.ts`, `format.ts`, `utils.ts` |
| **Misc leaves** | `isObject`, `sleep` | — (stable utilities) | `engine.ts:17,21` |

**The single most-important consumer fact:** every Wave B/C/D change is consumed through
**one call site** — `lerpValue(eased, iv)` at `engine.ts:629`, where `iv` is an
`InterpolatedVar` minted by `prepareInterpVar(normalizeValueUnits(...))` at
`utils.ts:339`. Because dispatch is `iv._lerp`-internal, value.js can swap the carrier
(D1), cache the computed endpoints (C1), and rewrite the color serializer (B1) **without
kf changing a single line**. The handoff's "kf consumes it unchanged" is not aspirational
— it is structurally forced by this one dispatch seam. **This is ALREADY-SOTA seam design;
manufacture no kf-side work for B/C/D consumption.**

---

## 2. The needs-handoff items — RE-MEASURED, consumer-side (what moved since E)

### W9 S4 — native WAAPI color interp (`cssColorInterpKeyword` + L4-non-legacy serializer)

**Status: GENUINELY OPEN, value.js-blocked, correctly withheld.** Ground truth, live:

- kf's WAAPI eligibility gate **hard-blocks all color interpolation**:
  `reason: "color interpolation requires perceptual lerp"` when
  `iv.start?.unit === "color" || iv.stop?.unit === "color"` (`src/animation/waapi.ts:153-157`).
- The W9 platform-adopt landed `@property` registration, native ScrollTimeline, WAAPI
  fidelity, and PRM — but **did NOT lift the color block**: grep for `cssColorInterpKeyword`
  across `src/` = **0 hits**; the eligibility gate at `waapi.ts:153` is untouched.
- value.js HEAD has **not** shipped `cssColorInterpKeyword` (grep over value.js `src/` = 0)
  nor an L4-non-legacy/precision serializer.

So S4 is a *true* two-sided dependency: kf cannot admit color to the WAAPI path until
value.js publishes (a) `cssColorInterpKeyword(space, hueMethod)` so kf can emit
`<color-interpolation-method>` that matches its `(colorSpace, hueMethod)`, and (b) the
L4-space-preserving serializer (handoff B1/B2) so the emitted endpoints round-trip.
**The handoff's mechanism correction holds and is worth re-stating for F:** `color`/
`background-color` are **main-thread** (not compositor) — the S4 win is *not* thread
offload; it is eliminating value.js's per-frame `lerpColorValue` + 73-char serialize +
browser-reparse churn. **Disposition: value.js-HANDOFF (carry forward UNCHANGED from E —
Waves B1/B2 + the `cssColorInterpKeyword` surface). The kf-side eligibility lift is a
*paired* FOLD that lands the same motion value.js publishes; it is correctly NOT coded
yet (E measure-first withhold).**

### W9 S6 — `currentColor` / `light-dark()` sentinels

**Status: GENUINELY OPEN, value.js-blocked.** Ground truth: grep `currentColor|light-dark`
across kf `src/` = **0 hits** — kf has no resolution policy because value.js's parser
*rejects these inputs today* (they cannot reach kf's frame-prep). value.js HEAD has the
shapes **only in the BBNF grammar** (`css-color.bbnf:93` `lightDark`, line 6 mentions
`currentColor`) but **not in the live hand-written parser** — so they hard parse-fail.
`light-dark()` is **Baseline 2024-05-13** (confirmed via modern-web-guidance `dark-mode`:
"Newly available… since 2024-05-13"; Chrome 123 / Edge 123 / Firefox 120 / Safari 17.5).
`currentColor` is long-Baseline. **Disposition: value.js-HANDOFF (carry forward — handoff
F2: each → a sentinel kf resolves per-target via the computed-value seam; the kf-side
policy is the paired E.W9 S6 FOLD, gated on value.js shipping the parser sentinels). Note
the feature-detection requirement: `light-dark()` needs a fallback for sub-Baseline-2024
engines.**

### E.W7 S5 / handoff E1 — `linear()` round-trip

**Status: kf-side ALREADY LANDED — the handoff's "severed on BOTH ends" is now
HALF-true.** This is the most important *diff* from the E handoff. The handoff (E1,
§3, §5) repeatedly states the `linear()` round-trip is "severed on **both** ends — kf's
`getTimingFunction` has no `linear()` branch either." **That kf half is now closed.** kf
ships its own `linear()` *reader*:

- `LINEAR_LITERAL` regex (`src/animation/utils.ts:96`) + `parseLinearStops` (`utils.ts:106-130`)
  parse a `linear(0, 0.5 25% 75%, 1)` literal — including the explicit-input-% and
  flat-segment two-position forms — into value.js's `LinearStop[]` shape.
- These feed value.js's existing `cssLinear` **evaluator** (consumed, `utils.ts:6`).

So kf consumes value.js's `cssLinear` evaluator + `LinearStop` *type* and **hand-rolls
the parser locally** rather than waiting on value.js's E1 parser. **Consumer-side
consequence:** handoff E1 (and E2 `steps()`, which kf likewise parses locally —
`CUBIC_BEZIER_LITERAL` + steps handling in the same `getTimingFunction`) is **no longer a
kf consumption BLOCKER**. It demotes to a value.js-side DRY consolidation: value.js owns
the canonical grammar + a `cssLinear` it cannot itself parse-feed, while kf and value.js
now carry *two* `linear()` parsers. **Disposition: value.js-HANDOFF but RE-SCOPED
DOWN — E1/E2 are no longer cross-repo-critical for kf; they are a value.js-internal
round-trip-completeness + de-dup win. F should record the kf local parser as the
already-shipped consumer half and stop calling the round-trip "severed on both ends."**
(The `cssLinear` flat-segment tie-break E3 and the bezier solver E4 are pure value.js
evaluator internals kf consumes transparently — carry forward as value.js-HANDOFF,
no kf edge.)

### F4 — `@property` `syntax`/`inherits` lossless round-trip

**Status: ALREADY-SOTA — RECORD, the handoff's hedge is resolved in kf's favour.** The
handoff F4 hedges: "If value.js drops `<color>+` multipliers or unwraps `|` unions, kf's
registration is lossy." I verified this end-to-end:

- kf consumes `descriptor.syntax` (string), `descriptor.inherits ?? false`, and
  `descriptor.initialValue.toString()` and feeds them **verbatim** to
  `CSS.registerProperty` (`src/animation/engine.ts:1132-1147`), feature-detected
  (`registerProperties`, Baseline 2024-07-09).
- value.js stores `syntax` as the **raw author string with quotes stripped** —
  `desc.syntax = raw.replace(/^["']|["']$/g, "")` (`value.js/src/parsing/stylesheet.ts:386`)
  — it does **not** re-serialize from a parsed AST, so `<color>+` multipliers and `|`
  unions survive byte-exact. The `PropertyDescriptor.syntax?: string`
  (`value.js/.../stylesheet.d.ts:20`) is therefore **already lossless**.

So F4's "verification if already faithful" path is the one that applies: **it IS
faithful.** kf's `@property` registration is **not** lossy. **Disposition: RECORD
(ALREADY-SOTA). Strike F4's "small surface add if not" branch — value.js already
preserves the raw syntax string; F should mark F4 closed-by-verification.** (The one
residual kf-side robustness note, in-scope only as a FOLD observation: `registerProperties`
swallows *all* throws at `engine.ts:1148`, so a genuinely malformed `syntax` value.js
passed through would silently no-op rather than surface — a kf diagnostics nicety, not a
value.js dependency.)

### C5 — `convertToPixels` length-unit coverage (the 24-of-43 no-op)

**Status: GENUINELY OPEN, value.js-blocked, the cleanest falsifiable gate in the set —
re-confirmed live.** Re-grounded against live value.js `src/units/utils.ts`:

- `convertToPixels` (`:274`) handles exactly `em rem vh vw vmin vmax % ch ex` + the six
  `cq*` (`:283-343`). Everything else falls to `convertAbsoluteUnitToPixels` (`:351`).
- `convertAbsoluteUnitToPixels` (`:255-272`) converts only the 6 *absolute* units
  (`cm mm Q in pt pc`) and **`return pixels` = the raw value unchanged** for any relative
  unit. So `50dvh` → `50` → emitted as `50px` (silent wrong pixels — worse than a
  parse failure).
- The unhandled set is the full `dv*`/`sv*`/`lv*` family + `vi vb cap ic lh rlh`, all
  declared in `RELATIVE_LENGTH_UNITS` (`value.js/src/units/constants.ts`). The `dv*`/`sv*`/
  `lv*` units are Baseline 2022–2023.

**Consumer relevance:** this is the *only* path that bites the kf rAF resolver (the WAAPI
path **excludes** computed units — `waapi.ts:30` spreads `COMPUTED_UNITS`, and the
viewport-unit block at `waapi.ts:149-151`). So a kf `@keyframes` animating `50dvh`
silently paints `50px` on the JS path today. **Disposition: value.js-HANDOFF (carry
forward UNCHANGED — handoff C5; it is a standalone correctness fix that can lead Wave C,
and the falsifiable gate "any unit returning `value` unchanged is a bug" is exact). kf
consumes the fix unchanged — no kf edge.**

---

## 3. The Wave-by-Wave consumer disposition (the complete cross-repo edge F proposes)

The COMPLETE edge F proposes to value.js is the E handoff **carried forward intact**,
with **four consumer-side adjustments** F should make to keep the charter honest:

| Wave / item | E-handoff disposition | F consumer-side adjustment | Disposition |
|---|---|---|---|
| **A** (dispatch/spans/single-pass; A6 per-frame parse) | parse fast tier | UNCHANGED — kf consumes `parseCSSValueUnit`/`parseCSSStylesheet`/`tryParse`/`flattenObject` transparently; A6 helps kf's per-frame computed re-parse | **value.js-HANDOFF** (unchanged) |
| **B** (color hot path; B1/B2 serializer) | ~40×/frame lane | UNCHANGED — consumed through `lerpValue`; B1/B2 also unblock S4 | **value.js-HANDOFF** (unchanged) |
| **C1–C4, C6, C7** (computed-unit memo/cache) | the real D-3 win | UNCHANGED — kf consumes via `iv._lerp`; *strengthened* by the barrel-deletion (no kf normalize surface to migrate) | **value.js-HANDOFF** (unchanged) |
| **C5** (24-of-43 unit no-op) | correctness fix | UNCHANGED, RE-CONFIRMED live (`50dvh→50px`) | **value.js-HANDOFF** (unchanged) |
| **D1/D2** (interp carrier) | named tranche, gated | UNCHANGED — the riskiest, behind `prepareInterpVar`; kf's single `lerpValue` site (`engine.ts:629`) is carrier-agnostic | **value.js-HANDOFF / MEASURE-FIRST** |
| **E1/E2** (`linear()`/`steps()` parsers) | "severed on BOTH ends" | **RE-SCOPED DOWN** — kf's reader LANDED (`utils.ts:96-130`); no longer a kf blocker, demotes to value.js DRY/round-trip-completeness | **value.js-HANDOFF (re-scoped)** |
| **E3/E4/E5/E6/E7** (evaluator internals; calc type-fold; env/calc-size parsers) | additive | UNCHANGED — E5's calc-type fold *does* matter to kf (frame pairing keys on `(property, subProperty)` + resolved unit drives `getComputedValue` dispatch); kf consumes the rest transparently | **value.js-HANDOFF** (unchanged) |
| **F2/F2b/F2c** (`currentColor`/`light-dark()`/system/`contrast-color()`) | sentinels | UNCHANGED — the S6 dependency; kf has 0 policy because the parser rejects these | **value.js-HANDOFF** (unchanged) |
| **F4** (`@property` lossless syntax) | verify-or-add | **CLOSED by verification** — value.js stores the raw syntax string; kf registration is NOT lossy | **RECORD (ALREADY-SOTA)** |
| **F1, F3, F5, F6, F7** (matrix decomp, LRU memo, quantizer, sub-path exports, diagnostics leak) | bundle | UNCHANGED — F6 sub-path exports would let kf re-export named easing curves without re-adding the static value.js edge (a real consumer ergonomics win); F3/F7 cheap+iso; F1/F5 no direct kf consumer | **value.js-HANDOFF** (unchanged) |
| **§2 rename** (`AnimationOptions→CSSAnimationOptions`, `Color.L`) | "pin-bump at v1.0.0" | **DISCHARGED** — done in 0.10.0 (the pin kf already ships); kf imports neither name | **RECORD (closed)** |

---

## 4. Where the post-E consumer state is ALREADY-SOTA (manufacture NO work)

Stated plainly, per the mandate's KISS clause:

- **The boundary is exemplary and the barrel layer is *gone*.** kf imports value.js
  directly at 9 heavy sites with no re-export indirection; the light orchestration tier
  is provably value.js-free (the only `@mkbabb/value.js` tokens in those files are
  assertions of absence). `proof:boundary` gates it. There is no consumer-side
  refactor to propose here.
- **The single-dispatch consumption seam** (`lerpValue` → `iv._lerp`, `engine.ts:629`)
  is the ideal cross-repo contract: it lets value.js land Waves B/C/D with **zero** kf
  edits. This is the structural reason the handoff's "kf consumes it unchanged" is true,
  not hopeful.
- **The §2 rename is closed** by the current pin; the `Color.*` half is vacuous (kf
  imports no `Color`).
- **F4 `@property` round-trip is lossless** by verification.
- **kf's local `linear()`/`steps()`/`cubic-bezier()` readers** (`utils.ts:96-130` +
  `getTimingFunction`) already close the consumer half of the easing round-trip — a
  net-positive that *demotes* a handoff "both ends severed" item.

## 5. The honest residue F SHOULD carry (consumer-blocked, value.js-owned)

Four items are *genuinely* kf-blocked-on-value.js and correctly measure-first-withheld
by E — F carries them forward as the live cross-repo edge:

1. **S4** — native WAAPI color (needs B1/B2 + `cssColorInterpKeyword`). kf's color block
   at `waapi.ts:153` stands until value.js publishes.
2. **S6** — `currentColor`/`light-dark()` sentinels (needs F2 parser). kf has no policy
   because the inputs don't parse.
3. **C5** — the 24-of-43 unit no-op (`50dvh→50px`). Bites kf's rAF resolver today.
4. **C1/C2/D1** — the per-frame computed-memo + carrier perf. kf consumes the fix
   unchanged through the single `lerpValue` seam; the win lives in value.js.

These are NOT punts — each is the value.js half of a paired win where the kf half is
either landed (the eligibility/policy seams) or structurally free (the single-dispatch
consumption). **The cross-repo edge F proposes to value.js is the E handoff Waves A–F,
carried forward intact, minus the discharged §2 rename and the closed-by-verification
F4, with E1/E2 re-scoped from "kf blocker" to "value.js DRY/completeness."**

---

## inv-16 compliance

This lane wrote ONLY `docs/tranches/F/audit/a-vj-consumption-F.md`. It made ZERO
source-code edits to keyframes or value.js. Every value.js item above is a *proposal*
(a hand-off) the value.js owner sequences against its own tranche discipline; value.js
is dirty + active (tranche M open) and this lane does not touch it. Every kf claim is
`file:line`-grounded against the live `tranche-e-impl` tree; every value.js claim against
the live source + the installed 0.10.0 dist.
