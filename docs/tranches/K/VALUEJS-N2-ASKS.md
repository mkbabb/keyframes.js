# VALUEJS-N2-ASKS — the value.js 0.12.0 inbound (the re-pin + witness-flip slate, the easing-editor hand-off, the VJ.W1/VJ.W2 re-anchor → RATIFIED N.W11.D/N.W11′, 0.13.0)

**Provenance:** authored 2026-06-12 by value.js Tranche-N second-fleet lane X-KF-ITEMS (a
SANCTIONED docs-only cross-repo write; the value.js fleet does not commit kf's tree — this file
is left uncommitted for the kf owner to fold). Evidence of record, value.js side:
`value.js/docs/tranches/N/audit/impl/W7C.md` (the 0.12.0 cut),
`impl/W7A-recon.md` (the per-item spec + GREEN verification table),
`audit/lanes2/X-KF.md` (the K↔N overlap matrix this doc consummates).

**Who consumes this:** (a) **K.W1's re-pin-re-confirm clause** — DL-K18/DL-K20/DL-K21 are all
dispositioned "HANDOFF, consume on the value.js publish (K.W1 owning, re-pin re-confirm)"
(`K.W1.md:550-556`, `PROGRESS.md` DL rows); the publish has now HAPPENED — this is the census
that clause records. (b) **L's preface** — the L-SEED §7 value.js census is one tranche stale
(§1 below). This doc adds NO K wave, re-litigates NO K decision, and duplicates NO K spec.

---

## §1 — Census correction (supersedes `L-SEED.md` §7 "Census correction of record")

- **`@mkbabb/value.js@0.12.0` is PUBLISHED** (registry-verified 2026-06-12; gate battery at cut:
  vitest 1709/41, build/lint green, 295,294 B unpacked — `W7C.md`). The L-SEED prediction
  "VJ.W0 RIPEN → publishes 0.11.3/0.12.0" (`L-SEED.md:199`) is discharged.
- **value.js Tranche M is SUPERSEDED by Tranche N** (M never dispatched). N is live: W0–W5+W7
  landed; N.W7 was the library-asks wave that shipped this slice. When L develops, its preface
  re-anchors on `value.js/docs/tranches/N/PROGRESS.md`, NOT on L-SEED §7's census.
- **The parse-that dual-realm gap is closed upstream**: value.js now pins `@mkbabb/parse-that
  ^0.9.0` (`value.js/package.json:65`), matching kf's `^0.9.0` (`package.json:178`). The PKG-9
  realm-split HANDOFF row (`packaging-k.md`, DL-K34) is resolved on the value.js side; kf's
  `utils.ts:248` half re-confirms on the re-pin.

## §2 — The re-pin + witness-flip slate

**The re-pin:** `@mkbabb/value.js ^0.11.2 → ^0.12.0` (`package.json:179`). K's charter posture
stands: K.W1's hard gate is the GLASS-UI currency; the value.js rows ride W1 as
record/re-confirm, and the wired consume is L's (`L-SEED.md:30-43`). **Disposition is the kf
owner's confirm-first call** — charter-conservative (hold `^0.11.2` through K, wire at L's open)
or opportunistic (the slate below is S-effort and engine-light except rows 1–2's wiring notes).
Either way, every row below is **born-RED-able TODAY** — the DL-K20 "the instant its primitive
publishes" condition is met.

| # | Flip / consume edge | value.js producer (0.12.0, verified) | kf seam | What flips |
|---|---|---|---|---|
| 1 | **MCI-5 identity-aware arity pad** — THE live witness | `functionIdentityValue` (`src/units/utils.ts:71`, barrel `index.ts:25`) + `FUNCTION_IDENTITY` (`units/constants.ts:128`, barrel `:39`) | `padToLength` pushes `new ValueUnit(0)` (`src/animation/utils.ts:317`) → `functionIdentityValue(fnName) ?? new ValueUnit(0)` | `test/interpolate-anything.test.ts:256` `it.fails` flips RED → remove the wrapper AND the positive control (`:271-277`) in the same motion. **Wiring note:** the pad site must know the absent function's NAME — verify the leaf context carries it; this is more than a one-line swap if not. |
| 2 | **E1 `linear()` parser** (VJ-1 / the EF-3 retirement) | `parseLinearStops` (`src/parsing/easing.ts:78`, barrel `:238`) | delete kf's shim (`src/animation/utils.ts:106-130`, ~30 LoC) | No `it.fails`; the shim deletes (net-deletion idiom). **Contract deltas:** value.js takes the FULL `linear(...)` string (shim took the inner); THROWS on malformed (shim returned `undefined` → fall-through) — wrap or thread `OnParseError`; accepts ≥1 stop where the shim required ≥2 (the Level-2 grammar's `<linear-stop>#`, `sepBy(comma, 1)` at `parsing/easing.ts:56-57`; semantic resolution is `cssLinear`'s). |
| 3 | **E2 `steps()` parser** | `parseSteps` / `StepsArgs` / `JumpTerm` (`parsing/easing.ts:132`, barrel `:238`) | the local `STEPS_LITERAL` re-implementation retires | Throws on `count < 1` / non-integer; `jumpTerm` defaults `jump-end`. |
| 4 | **VJ-3 sentinels** | `currentColor` / `light-dark()` parse as sentinels, never baked to RGB (`parsing/color.ts:568-617`) | the hard parse-fail class disappears; per-target resolution at frame-prep stays the kf BOOK (resolve against the TARGET's computed `color-scheme`, not `:root`) | ingestion robustness for K1/L. |
| 5 | **B1 `toAnimationString`** | `Color.toAnimationString(digits?, outputSpace?)` zero-alloc (`units/color/index.ts:399`) | the apply-path serializer (~28 chars vs ~73 full-precision) | the WAAPI/CSS emit path consumes it. |
| 6 | **B2 output-space emit** | `cssColorInterpKeyword` + the syntax-family emit (`units/color/dispatch.ts:334`; `units/color/constants.ts:235,256`; barrel `:144`) | the kf WAAPI S4 4-clause gate's value.js half is now shipped | default-`oklab` requests emit non-legacy syntax regardless of input family. |
| 7 | **B4 egress gamut** | `gamutMap(color, targetSpace)` (`dispatch.ts:269`) | P3 egress stays P3 (no silent sRGB clip) | wide-gamut output correctness. |
| 8 | **F3/VJ-F6 LRU memoize bound** → **DL-K18** | `memoize` LRU + `{maxCacheSize}` (`src/utils.ts:97-165`) | `tryParseCache` unbounded Map (`src/animation/utils.ts:203` kf-side — DL-K18's bare `utils.ts:203` shorthand resolves here) consumes the bound | the 6-tranche DL-K18 row exits via the published-consume-edge form. |
| 9 | **VJ-F1 path sampler** → **DL-K21 / FB-3** | `PathGeometry`, `getTotalLength`, `getPointAtLength` — point + tangent angle for `rotate: auto` (`src/transform/path.ts:478,512`; standalone fns `:551,560`; barrel `:342`) | the "gated on value.js VJ.W4" clause is satisfied for the SAMPLER half (incl. orient — `PathSample.angle`, `path.ts:30-31`); MorphSVG shape-interp product work stays kf's L | DL-K21's tripwire fires: the primitive is published. |
| 10 | **VJ-F2 diagnostics producer** → **DL-K17** | `ParseDiagnostic` / `OnParseError` (`parsing/utils.ts:65,80`; barrel `:320`) | `ResolvedKeyframes.diagnostics` (`adapter.ts:18`, field absent) can CONSUME the producer — DL-K17's "OR consume the value.js VJ.W3 producer" arm is now real; the L channel decision should prefer it over authoring a kf-local channel | the full-diagnostics deferral resolves by consume, not authorship. |
| 11 | **VJ-F4 buffer-reuse unflatten** | `unflattenObjectToString(flatObj, out?)` opt-in, byte-identical (`units/utils.ts:188`) | the per-frame serialize alloc; do NOT re-open the measured-zero diff-skip | apply-path GC pressure. |
| 12 | **The RIPE-NOW edges all stand** | `lerpArray` KEPT (barrel `:191` — N.W7.B's demote question resolved KEEP *because of* kf's KF-1 edge), `deltaEOK` (`:172`), `reverseAnimationShorthand` (`:276`) | KF-1 → `NumericAnimation.at()`; KF-DELTAE → ED-4/CC-2; KF-CC1 → CC-1 | unchanged from L-SEED RIPE-NOW; now one publish fresher. |

## §3 — What 0.12.0 does NOT ship (no witness should be expected to flip)

- **SEAM-4 `rotate()` shorthand** — `test/serialize-from-template.test.ts:143` `it.fails` does
  **NOT** flip. value.js recorded it ADJACENT, outside the 11-item slice (`W7A-recon.md §14`);
  the rotate→rotateX/Y/Z expansion is still live. Keep the witness AND its positive control.
- **VJ.W1 SCROLL GRAMMAR + VJ.W2 `sampleColorRamp`** — the two genuine net-new grammar gates remain
  absent in 0.12.0; value.js first recorded them for a post-N successor (`X-KF.md §3.2/O5`), then
  RATIFIED the fold into N's own library track — VJ.W2 → **N.W11.D**, VJ.W1 → **N.W11′**, both shipping
  in the **0.13.0** cut (`value.js …/N/GRAMMAR-FOLD.md`). Under the 2026-06-15 total fold these are
  K Band II's K.W9/K.W10 gates (the frontier folded WHOLESALE into K — **there is no residual L**);
  the kf-side OUTBOUND dispatch is `KF-TO-VALUEJS-GRAMMAR-ASKS.md`, the consume edges lighting on
  value.js's 0.13.0 publish.
- **VJ-9 FULL partial-input totality** — partial: the `parseCSSValueUnit("")` contract shipped at
  0.11.2 (`fbea3e2`); the every-public-entry totality (the K1 ingestion precondition) is broader
  and remains open.
- **VJ-5 out-buffer** — not a named item in the 0.12.0 slice; the shipped buffer-reuse surface is
  VJ-F4 (row 11). Verify identity-or-openness at L's open.
- **F2b `contrast-color()`** — MED/BOOK, unshipped (distinct from `safeAccentColor`; do not alias).
- **VJ-1 `cssLinearFromString` as a named symbol** — **SATISFIED-BY-COMPOSITION**:
  `cssLinear(parseLinearStops(s))` is the string→fn path on two published symbols
  (`index.ts:233,238`). No convenience wrapper shipped or owed; the EF-3 retirement proceeds on
  the composition.

## §4 — The easing-editor hand-off (U27/U8 — kf as DONOR → glass-ui first-class)

The value.js user audit (`value.js/docs/tranches/N/audit/user-audit-2026-06-12/LEDGER.md` U27)
mandates: *"the easing area → a FIRST-CLASS easing selector + configurator, ABSTRACTED FROM
keyframes.js INTO glass-ui, supporting the panoply of easing fns, styled like keyframes.js"* —
and U8 names kf's bounded easing dropdown as the reference mechanism glass-ui must make
first-class. **Neither kf's K nor glass-ui's BA schedules the publish** (`X-KF.md §1.2`); the
glass-ui tranche item is seeded by value.js N's fleet on the glass-ui side. kf's stake:

**The donor (what kf contributes):** the trio `demo/@/components/custom/EasingEditor.vue`
(composition root, props-in/events-out) + `EasingCurveCanvas.vue` (editable bezier canvas:
drag handles, rubber-band clamp, `MAX_OVERSHOOT` viewBox, container-bounded square, traveling
progress dot) + `EasingSelect.vue` (grouped dropdown, 10 families, per-curve SVG previews,
`max-h-[var(--easing-dropdown-max-h)]` bounded scroll — the exact U8 mechanism) +
`demo/easing/easingGroups.ts`. glass-ui's BA `BezierEditor.vue` is the Tailwind-first twin
(its own header credits the kf chassis); BA's `StepsEditor` fold should land IN the published
primitive, not as a fourth demo-only fork.

**What kf CEDES (on the glass-ui publish):** the editor COMPONENT — the three demo-local SFCs
delete in the same motion the published primitive is consumed (K.W1's net-deletion idiom),
re-pointing the easing rail + `TimingFunctionPanel` hosts.

**What kf KEEPS (permanently, per the L-SEED §7 boundary law):** spring/decay math and
PLAYBACK — the progress dot in kf hosts is driven by kf's own `anim.t`; the published primitive
takes progress as a prop. `useDragCapture` stays kf's — glass-ui re-expresses the pointer math
in its own drag idiom (the BA `BezierEditor` precedent; the port must NOT pull the kf composable
wholesale).

**What value.js KEEPS:** the curve MATH substrate the primitive consumes — `CSSCubicBezier`,
`bezierPresets`, `timingFunctions`, `timingFunctionDescriptions`, `cssLinear`+`parseLinearStops`,
`steppedEase`+`parseSteps` (`value.js/src/index.ts:226-238`). Three-way ownership: value.js =
values, glass-ui = the published editor component, kf = time/playback.

**Coordination with K's DESIGN-TOTALITY (no collision, one caution):** K.W4 touches the SPRING
scene's `KeyframesEditor` and the U-K16 single-option-select sweep (the `["easing"]` scene's
1-item `ChromeDock.vue:200` dropdown), NOT the easing canvas; `EasingSelect` is rated OK
(`live-dock-tabs-selects.md §2.8`). The one standing request: **any K.W2/K.W4 restyle that
touches the trio stays token-routed** — the trio is about to be transposed; per-site styles
would fork the donor mid-hand-off. The kf consume edge is L-or-later with the named tripwire
*"glass-ui publishes the easing primitive"* — the DL-K published-consume-edge form, never a
bare BOOK.

## §5 — K-planned value.js asks, acknowledged

This doc is the INBOUND record (the 0.12.0 edges kf consumes); the OUTBOUND dispatch of the two
net-new grammar items is `KF-TO-VALUEJS-GRAMMAR-ASKS.md`. Under the 2026-06-15 total fold the
frontier folded WHOLESALE into K Band II — **there is no residual L**. The ledger's N-status:
**VJ.W0 — LANDED** (0.12.0: E1/E2 parsers, the LRU bound, parse-that `^0.9.0`; VJ-1 by
composition, §3). **VJ.W3 — PARTIAL** (diagnostics producer shipped; full partial-input totality
open). **VJ.W4 — PARTIAL** (sampler+tangent, MCI-5, VJ-F4 shipped; VJ-5 verify; MorphSVG product
half is kf's). **VJ.W1 / VJ.W2 — OPEN @0.12.0**, the two genuine net-new grammar gates, RATIFIED
into value.js's **N.W11.D / N.W11′ library track** (the 0.13.0 cut, `value.js …/N/GRAMMAR-FOLD.md`);
they gate K Band II's K.W9/K.W10. The acyclic spine holds: value.js publishes grammar (0.13.0); kf
consumes one tranche behind; no cycle, no contention.
