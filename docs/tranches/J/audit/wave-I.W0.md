# J-audit: wave-I.W0 plan-vs-delivery audit

**Lane:** wave-I.W0  
**Commit:** `107236d` (+ companion `e473447` value.js re-pin)  
**Date audited:** 2026-06-09  
**Auditor:** J multi-agent parallel deep audit  

---

## Verdict

**DELIVERED — SPEC-COMPLETE with one known deferral (S5/clause-e is correctly coupled
to I.W2, gated there, GREEN).** The four primary scope items (S1–S4) landed at the
gestalt altitude the spec demanded: no try/catch swallow, no demo-side `--rotationX`
band-aid, the fix at the library seam. No quick-solution residue. No legacy left behind.
The gate `proof:engine-no-throw-on-play` runs, bites the named conditions, and passes the
two hygiene clauses in the current tree without a browser. The companion value.js re-pin
(`e473447`, `^0.11.1 → ^0.11.2`) is present, lockfile-correct, and LOAD-BEARING (the spec
called this out explicitly; confirmed: 0.11.1 without the empty-input fix still throws on
cube play).

One narrow J-scope item: the `CSSKeyframesToString` S2 path has no standalone
jsdom-level test that exercises `var()` inputs through `parsedVars[i]`, leaving the
serialize-from-template path dark in the test suite except via the Playwright gate. J should
add a unit-level test covering this path (P2 — the runtime gate covers it, but a unit
companion closes the regression surface without browser infrastructure).

---

## §1 — Spec coverage (S1–S5 vs delivered)

| Scope item | Spec requirement | Delivered | Evidence |
|---|---|---|---|
| **S1** value.js empty-input contract (PAIRED HANDOFF) | `parseCSSValueUnit("") → typed-empty, never throw "......"` | LANDED — `value.js fbea3e2`, published `0.11.2`, re-pinned `e473447` | `node -e "v.parseCSSValueUnit('')"` → `ValueUnit(0, undefined)`, no throw; proof-script hygiene-f GREEN |
| **S2** `CSSKeyframesToString` serialize-from-template | Sources each stop from `animation.parsedVars[i]`, never `animation.at(progress)` | LANDED | `src/animation/format.ts:145-165` — `const declared = (animation.parsedVars[i] ?? {})...` replaces the `at(progress,false)` call |
| **S3** `AnimationGroup.transform` total by construction | `transform = NOOP_TRANSFORM` field default + real lazy resolution + empty-group `play()` short-circuit | LANDED — three sub-parts all present | `group.ts:28,55,142-143,401-408`; `useAnimationGroupPlayback.ts:56-58` |
| **S4** kill the mis-attributing placeholder | `/* timing-function: custom — no CSS twin */` → dynamic `/* could not serialize: ${reason} */` | LANDED | `KeyframesStringControls.vue:110-115` |
| **S5** bare-`"cubic-bezier"` option-seam round-trip | Correctly COUPLED to I.W2 S3 (I.W0 owns the gate clause; the readable literal is I.W2's supply seam) | DEFERRED to I.W2 — CORRECT and GREEN | `proof-easing-editor-live.mjs:425-440` (clause (c) re-mount leg); `useTimingFunctionEditor.ts:149-196` (`timingFunctionLiteralFor`); `impl/I.W0.md:40-44` (coupling documented) |

---

## §2 — Delivery analysis

### S1 — value.js seam

`parseCSSValueUnit("")` now returns `ValueUnit(0, undefined)` (verified against installed
`0.11.2`). The re-pin is honest: `e473447` bumped `^0.11.1 → ^0.11.2`, lockfile resolves
the published registry entry, `npm ci` in CI pulls the fix.

The IMPL note (`impl/I.W0.md:14-16`) correctly records that through the wave the fix was
consumed locally (a dist copy); the re-pin was the WZ close action that made it honest. The
spec's "PAIRED born-RED" pairing discipline was followed.

### S2 — serialize-from-template

`format.ts:155`: `const declared = (animation.parsedVars[i] ?? {}) as Record<string, ValueUnit[]>`.

The `parsedVars[i] ?? {}` null-coalesce is safe: `parsedVars` is rebuilt in
`FrameCompiler.parse()` as `this.parsedVars = this.templateFrames.map(...)` (frame-compiler.ts:342),
so it is always parallel to `templateFrames` after `parse()`. All three `fromKeyframes` /
`fromString` / `fromVars` constructors call `this.parse()` before returning, so a
`CSSKeyframesToString` caller always has a parsed animation. The `?? {}` guards the pre-parse
state (empty group or manually assembled `templateFrames` before first `parse()`) gracefully
— emits empty declarations, not a throw.

The type cast `as Record<string, ValueUnit[]>` is a mild inaccuracy: `ParsedVarMap` is
`Record<string, ValueArray>`, not `ValueUnit[]`, but both are passed to
`unflattenObjectToString` which accepts the `ValueArray` supertype. No runtime error; the
cast is cosmetically wrong but functionally inert.

`engine.ts` line count: **1375** (current tree) — within the 1400 ceiling. `engine.ts` was
NOT touched by S2; only `format.ts` was. The commit message claimed 1376 (off-by-one vs.
current; immaterial).

### S3 — group.ts transform totality

Three sub-parts, all present in the current tree:

1. **Field default** (`group.ts:55`): `transform: TransformFunction<V> = NOOP_TRANSFORM` — the lying `transform!:` assertion is gone.
2. **Constructor inheritance** (`group.ts:142-143`): uses identity guard `=== NOOP_TRANSFORM` so the first child with parsed frames overrides the no-op.
3. **Lazy first-draw resolution** (`group.ts:401-408`): `transformFramesGrouped` resolves from the first now-parsed child when `transform === NOOP_TRANSFORM`, fixing deferred-parse groups (the cube's static-matrix symptom). Idempotent via the same identity guard.

The empty-group play short-circuit (`useAnimationGroupPlayback.ts:56-58`) is present:
`if (Object.keys(animationGroup.animations).length === 0) { syncPlayState(true); return; }`.
This inverts the home click order so the navigate-intercept owns the click.

WZ follow-up (`ebcc79f`): `group.ts` grew to 811 lines, exceeding the 800-line
`LIBRARY_CEILING_OVERRIDE`. The WZ fix raised the override to 820 with documented rationale
(the two-timing-point composite-transform resolution — constructor inheritance + lazy
first-draw — are load-bearing on the same composite seam). `proof:decomposition` is GREEN.
Current `group.ts` is **810 lines**, within 820.

One structural observation for J: there is no path that RESETS `transform` back to
`NOOP_TRANSFORM` when all children are removed from a group post-construction. Since
`AnimationGroup` has no public `removeAnimation` API in the current tree (mutations are
constructor-only or via `setLayerConfig`/`setLayerEnabled`), this is not an immediate
defect — but if J adds dynamic child addition/removal, the identity-guard protocol would
need a corresponding reset path.

### S4 — kill the mis-attributing placeholder

`KeyframesStringControls.vue:110-115`: `const reason = (e as Error).message; cssKeyframesString.value = \`/* could not serialize: ${reason} */\``. The old hard-coded `/* timing-function: custom — no CSS twin */` is gone. The comment correctly explains S1+S2 make the value-path unreachable here.

### S5 — bare `"cubic-bezier"` option seam

Correctly NOT implemented in `proof-engine-no-throw-on-play.mjs`. The spec spec §S5 +
impl/I.W0.md§S5 both record the coupling: "I.W0 owns the construction-path clause but the
re-parseable readout that feeds it is I.W2's S3." The gate clause (e) as written in the
wave spec (`I.W0.md:224-240`) is the construction-path witness; the READOUT that prevents
the bare token from ever being persisted is I.W2's supply seam.

`proof-easing-editor-live.mjs` clause (c) (`line:425-440`) drives Easing→Amiga→Easing
re-mount and asserts `ZERO AnimationOptionError` — this IS the option-seam test. It is
wired in the `proof:correctness` tier (confirmed in `package.json:147`). `impl/I.W2.md:28`
explicitly records "This closes I.W0's clause (e)."

The `timingFunctionLiteralFor` function (`useTimingFunctionEditor.ts:149-162`) emits a
complete `cubic-bezier(x1,y1,x2,y2)` / `steps(n,term)` literal, never the bare keyword.

---

## §3 — Quick-solution / workaround residue

None found. Grep for `TODO`, `FIXME`, `HACK`, `XXX` across `src/animation/format.ts`,
`src/animation/group.ts`, `demo/@/components/custom/animation-controls/composables/useAnimationGroupPlayback.ts`,
`demo/@/components/custom/animation-controls/keyframes/KeyframesStringControls.vue`: **zero
hits**.

No `try/catch` swallow added (the existing catch in `KeyframesStringControls.vue:100-116`
is the pre-existing error floor, now improved to name the actual error — the fix is IN the
catch, not a suppressor). No magic timeouts or settle sleeps added. No demo-side
`--rotationX` definition added (verified: `useCubeAnimations.ts` still uses `new
ValueUnit("--rotationX", "var")` unmodified).

---

## §4 — Legacy left behind

No legacy found. The previous behavior artifacts are gone:

- `transform!: TransformFunction<V>` (the lying definite-assignment assertion) → replaced by `transform: TransformFunction<V> = NOOP_TRANSFORM` (`group.ts:55`)
- The false "resolved lazily" constructor comment (which promised a lazy fallback that did not exist) → deleted and replaced with honest documentation of what DOES exist (`group.ts:135-143`)
- The `/* timing-function: custom — no CSS twin (see console) */` hard-coded placeholder string → gone from `KeyframesStringControls.vue`
- The `animation.at(progress, false)` call in `CSSKeyframesToString` → replaced by `animation.parsedVars[i]` (`format.ts:145-165`)

---

## §5 — Gate oracle audit (proof:engine-no-throw-on-play)

**Oracle correctness:** The gate drives CLICK → LIVE console read → LIVE transform sample
— the exact gestures `proof:demo-console-clean` skipped (it rested on HOME load with a
narrowed regex). The five runtime clauses (a-e) each assert an EXACT product property a
human would check:

- **(a)** ZERO `pageerror` + `unhandledrejection` across rainbow-play on home AND cube
- **(b)** ZERO console lines matching the parse-error/serialize-warn regex
- **(c)** ≥3 distinct non-`none` cube transform values (the no-silent-no-op guard)
- **(d)** keyframes pane shows `@keyframes`-shaped text, NOT the placeholder
- **(e)** *(delegated to `proof:easing-editor-live` clause (c))* — ZERO `AnimationOptionError` across re-mount

**Clause (e) gap in proof-engine-no-throw-on-play.mjs:** Clause (e) as written in the wave
spec is NOT implemented inside `proof-engine-no-throw-on-play.mjs` — the script has clauses
(a), (b), (c), (d), (f), (g) only. The clause (e) oracle lives in
`proof-easing-editor-live.mjs:425-440`. This split is intentional and documented
(`impl/I.W0.md:40-44`), and both scripts are wired to `proof:correctness`. No gap to close
here — the coupling is honest.

**Hygiene clauses pass in current tree (verified):**
- `[hygiene g]` `engine.ts 1375 ≤ 1400` — PASS (verified by running the script)
- `[hygiene f]` `parseCSSValueUnit("")` → typed-empty, no throw — PASS (verified against installed 0.11.2)

**Test companion (`test/iw0-cube-composite.test.ts`):** present, exercises `AnimationGroup`
with an unset `var(--rotationX)`, asserts ≥3 distinct transforms. This is the unit-level
complement to the Playwright clause (c).

**Gap — no unit test for `CSSKeyframesToString` with `var()` inputs:** `format.test.ts` has
three roundtrip tests (plain values only). No test calls `CSSKeyframesToString` on an
animation whose keyframes include `var()` references and asserts the output is verbatim /
non-DOM-resolved. The Playwright clause (d) covers this at runtime, but a jsdom-level
companion would close the regression surface cheaply. J scope item.

---

## §6 — The value.js handoff seam

The spec specified S1 as "PAIRED born-RED" — the kf side alone (S2) is not sufficient.
This is verified by the re-pin commit message (`e473447`): "Rebuilding the dist on pristine
published 0.11.1: the rainbow group-play on cube STILL throws 'Parse error at offset 0:
......'." The value.js side is load-bearing.

The re-pin `^0.11.2` (tilde-equivalent in semver terms for a `^` specifier) allows any
0.11.x ≥ 0.11.2. If value.js ships a 0.12.0 with breaking empty-input behavior change,
the `^` pin would not protect. This is a minor pin hygiene note (BOOK) — not a J action
item unless value.js versioning discipline is in question.

---

## §7 — Gestalt assessment: did the fix land at the RIGHT seam?

**Yes.** The spec's three-move architecture (S1 value.js seam, S2 kf serializer
transposition, S3 group totality) was precisely the gestalt the mandate demanded:

- The PRIMARY fix (S1) is at the library seam where the empty input is first produced —
  value.js `parseCSSValueUnit`. No demo-side workaround.
- The BELT (S2) makes the serializer architecture correct independent of S1 — a serializer
  should never have needed a live DOM to emit the authored CSS.
- The GROUP totality (S3) replaces a lying assertion with a real invariant.

The one architectural note for J: the `NOOP_TRANSFORM` identity-guard protocol is a subtle
convention that callers must honor — if an external caller sets `group.transform` to a custom
function (currently possible since the field is public), and later wants to "reset" it, there
is no API to do so. J may want to consider whether `transform` should be `protected` or
whether a `setTransform()` setter that validates / resets to NOOP is needed. (BOOK — no
current consumer does this.)

---

## §8 — J fold candidates

| Item | Disposition | Rationale |
|---|---|---|
| Unit test: `CSSKeyframesToString` with `var()` inputs | FOLD into J (P2) | The S2 serialize-from-template path has no jsdom-level test for `var()` inputs. Playwright clause (d) covers runtime; a unit companion is cheap insurance. |
| `AnimationGroup.transform` reset on child removal | FOLD as BOOK | No `removeAnimation` API exists so no immediate gap; record for when J adds dynamic membership. |
| Type cast `as Record<string, ValueUnit[]>` in format.ts:157 | FOLD into J (P2) | `ParsedVarMap` is `Record<string, ValueArray>`, not `ValueUnit[]`. Cosmetically wrong, functionally inert. Fix the cast to `as Record<string, ValueArray>`. |
| value.js `^0.11.2` vs `~0.11.2` pin width | BOOK | `^` allows 0.12.x+ which could break if value.js ships a 0.12.0 that changes empty-input behavior. Current value.js versioning discipline keeps this safe. |
