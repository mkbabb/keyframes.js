# K-audit / wave-J.W1 — Plan-vs-delivery audit of J.W1 (engine totality)

**Lane:** plan-vs-delivery, engine totality pass
**Auditor:** Tranche-K fleet, K-audit lane
**Date:** 2026-06-11
**Branch at audit:** `tranche-j-dev` @ `4f1fc4c`
**Spec:** `docs/tranches/J/waves/J.W1.md` (binding)
**Impl record:** `docs/tranches/J/waves/J.W1-impl.md`
**Scope:** `src/animation/format.ts`, `src/animation/frame-compiler.ts`,
`src/animation/constants.ts`, `src/animation/internal/errors.ts`,
`demo/@/.../keyframes/composables/useKeyframesParsing.ts`,
`test/serialize-from-template.test.ts`, `test/playback-bind.test.ts`,
`test/binary-search.test.ts`, `test/decay.test.ts`, `test/valuejs-contract.test.ts`,
`test/w0-crashes.test.ts`, `test/frame-compiler.test.ts`,
`demo/motion-path/motionPathGeometry.ts`, `demo/@/.../stores/sceneMachine.ts`,
`demo/@/.../stores/index.ts`

---

## §1. Audit method

Each spec item verified by: (a) reading the cited source file:line, (b) running the
named test or proof gate, (c) grepping for residue or missing deletion. All commands
below were executed on the HEAD of `tranche-j-dev` (`4f1fc4c`). Claims from the impl
record are accepted only where the source agrees.

---

## §2. S1 — ONE serialization authority (ENG-1)

**Spec claim:** unify `CSSKeyframesToStrings`/`CSSKeyframeToString` onto the
declared-template path; delete the DOM-resolving `frame.flatVars` per-card path; ONE
`declaredKeyframeBody` projection shared by aggregate and per-card.

**Verification:**

```
grep -rn 'CSSKeyframeToString\b' src/ demo/ test/ scripts/
→ 0 hits
```

`CSSKeyframeToString` (the old per-card DOM-resolving helper) is gone from the tree.
`src/animation/format.ts:74-96` defines `declaredKeyframeBody` — a single function
projecting `animation.parsedVars[i] ?? {}` (typed `ParsedVarMap`, no cast) via
`unflattenObjectToString`. Both `CSSKeyframesToStrings` (`:108-130`) and
`CSSKeyframesToString` (`:173-220`) invoke it. The per-card path now iterates
`animation.templateFrames` (N stops, index-aligned) rather than `animation.frames`
(N−1 interp pairs). The `flatVars` name survives only in two explanatory comments at
`format.ts:65,105` — no production read-path.

`useKeyframesParsing.ts:51` calls `CSSKeyframesToStrings(animation)` directly (import
at `:5`); the old DOM-resolved call is gone.

**Test bite:** `test/serialize-from-template.test.ts` — 9 tests, 1 expected-fail.
`npm test` run observed: **5 files, 35 passed | 1 expected fail (36)** for the W1 pyramid.
Born-RED witness recorded in impl §Hard gate (d): TB-1 stash against `format.ts` → 5 failed
(the N−1 card count + the `flatVars`-interp path).

**One minor residue noted (P2):** `src/animation/format.ts:183` contains
`Map<string, ValueUnit[]>` for the percent-grouping map inside `CSSKeyframesToString`.
This stores `ValueUnit` percent stops (not var-map entries), so it is NOT the
`ValueUnit[]` vs `ValueArray` cast the spec targeted (that was on the `parsedVars[i]`
coalesce site, now typed `const declared: ParsedVarMap` — no cast at all, `format.ts:79`).
The `Map` stores percentages and is correctly typed. **No residue defect here** — the
S6 cast removal is complete; the `Map<string, ValueUnit[]>` is a separate, correct use.

**Verdict: DELIVERED per spec.** The old path is dead, ONE authority exists, consumer
retargeted.

---

## §3. S2 — `createFrame` totality (ENG-2)

**Spec claim:** replace the stacked `seekPreviousValue(...)!` + `templateFrames[undefined]!.transform`
double-dereference with a checked resolution; miss → `NOOP_TRANSFORM` (the honest-fallback
variant); the same totality applied to the timing-function seek.

**Verification:**

`src/animation/frame-compiler.ts:241-253`:

```typescript
const transformIx = seekPreviousValue(
    startIx,
    this.templateFrames,
    (f) => f.transform != null,
);
transform =
    (transformIx === undefined
        ? undefined
        : this.templateFrames[transformIx]!.transform) ??
    NOOP_TRANSFORM;
```

The lying `!` on `seekPreviousValue(...)` is gone. `transformIx === undefined` arm
explicitly takes `undefined`, the coalesce `?? NOOP_TRANSFORM` supplies the honest
default. `src/animation/constants.ts:65` exports `NOOP_TRANSFORM` as the single shared
constant; `src/animation/group.ts:11` re-imports it (the group-local copy deleted — no
second copy beside the hoist).

The timingFunction seek at `:261-272` has the same totality structure (miss → `this.options.timingFunction`).

**Test bite:** `test/frame-compiler.test.ts` §ENG-2 — `"the documented public Animation
surface compiles + interpolates transform-free"` → born-RED witness recorded: stash of
`frame-compiler.ts` produced `TypeError: Cannot read properties of undefined (reading
'transform')` (the spec's predicted crash). Un-stash: GREEN.

**Verdict: DELIVERED per spec.**

---

## §4. S3 — total selector guard (SEAM-1)

**Spec claim:** the guard validates against the NAMED conforming grammar (percentage
0%–100% ∪ `from`/`to`) BEFORE `parseCSSValueUnit`; typed `AnimationOptionError` for
every non-conforming selector; blank carries structured code `"EMPTY_PARSE"`.

**Verification:**

`src/animation/frame-compiler.ts:97-102` — constants:
```
SELECTOR_KEYWORD_RE = /^(?:from|to)$/i;
SELECTOR_PERCENT_RE = /^(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?%$/;
SELECTOR_REASON = "a keyframe selector must be a percentage 0%–100% …";
```

Guard at `:168-186`: blank → typed throw with `code: "EMPTY_PARSE"` (`:170-175`);
every other non-conforming input (garbage, length, out-of-range) → typed throw naming
the grammar (`:177-185`). `parseCSSValueUnit` at `:193` is unreachable for non-conforming
input.

**Test bite:** `test/w0-crashes.test.ts` — 21 tests, all PASS.
Born-RED witness (impl §Hard gate d): stash of `frame-compiler.ts` → 12 failed:
`"abc"/"garbage"` produced the cryptic value.js throw; `"5px"/"150%"/"-10%"/"500ms"`
silently accepted; codes absent.

**Probe-concordance with spec SEAM-1 table:**

| selector | pre-S3 (stash) | post-S3 (HEAD) |
|---|---|---|
| `"abc"` | `Parse error at offset 0: "...abc..."` (cryptic) | `AnimationOptionError` (typed) |
| `"5px"` | compiled OK (silent accept) | `AnimationOptionError` (typed) |
| `"150%"` | compiled OK (silent accept) | `AnimationOptionError` (typed) |
| `""` | `AnimationOptionError` with no code | `AnimationOptionError` + `code: "EMPTY_PARSE"` |
| `"50%"` | compiled OK | compiled OK (conforming) |

**Verdict: DELIVERED per spec. Guard is total, boundary named.**

---

## §5. S4 — consume-edge pins (SEAM-2/3/4)

**Spec claims:**
- SEAM-2: direct `parseCSSValueUnit("")` pin in a kf-side test (bypass the S3 guard).
- SEAM-3: `var-calc.css` + `matrix3d.css` fixture trio in `test/fixtures/keyframes/manifest.json`.
- SEAM-4: `it.fails` AUTHORED-vs-SERIALIZED byte witness for `rotate(45deg)`.

**Verification:**

`test/valuejs-contract.test.ts` (7 tests) calls `parseCSSValueUnit("")`/`("   ")` directly
and asserts the typed-empty `ValueUnit` (value 0, no throw). Import is direct, not via
the frame-compiler guard.

```
ls test/fixtures/keyframes/ | grep -E 'var|matrix|manifest'
→ manifest.json  matrix3d.css  var-calc.css
```

`proof:roundtrip-fidelity` run observed: **29 tests, all PASS** — text-mode for
`var-calc.css` (verbatim `calc(100% - 20px)`, `translateX(var(--x))` etc.); byte-mode
for `matrix3d.css`.

`test/serialize-from-template.test.ts:143-157` — `it.fails` byte-witness for
`rotate(45deg)`: born-RED TODAY on value.js `rotateX|Y|Z` flatten expansion. The
positive control at `:159-171` locks the CURRENT expansion keys so the witness cannot
rot silently. `rotateZ(45deg)` conforming sibling at `:173-181` is GREEN.

**Verdict: DELIVERED per spec. The `rotate()` witness is intentionally RED (it.fails) —
the kf-side consume-signal for the value.js next-slice HANDOFF (OUT), per spec.**

---

## §6. S5 — unit pyramid (TB-1/2/3 + decay)

**Spec claims:** four new jsdom pins, each born-RED witnessed via git-stash / planted mutation.

**Verification — test files present:**

```
ls test/ | grep -E 'serial|playback|binary|decay|valuejs'
→ binary-search.test.ts  decay.test.ts  playback-bind.test.ts
  serialize-from-template.test.ts  valuejs-contract.test.ts
```

**Run observed:**

```
npx vitest run test/serialize-from-template.test.ts \
  test/playback-bind.test.ts test/binary-search.test.ts \
  test/decay.test.ts test/valuejs-contract.test.ts
→ Test Files 5 passed (5)
   Tests 35 passed | 1 expected fail (36)
```

Born-RED witnesses recorded in impl §Hard gate (d) table (reproduced summary):

| pin | probe | observed RED |
|---|---|---|
| TB-1 `serialize-from-template` | stash `format.ts` | 5 failed — `frame.flatVars`/interp-pair path |
| ENG-2 `frame-compiler` | stash `frame-compiler.ts` | 2 failed — `TypeError: ... (reading 'transform')` |
| SEAM-1 `w0-crashes` | same stash | 12 failed — cryptic throw + silent accepts |
| TB-2 `playback-bind` | planted prototype mutation in `playback.ts` | 4 failed — `TypeError: ... (reading '_gen')` |
| TB-3 `binary-search` | planted `while (lo < hi)` off-by-one | 3 failed — wrong range |
| decay | planted sign error `Math.exp(k * t)` | 5 failed — diverges to ±∞ |

All mutations reverted clean (`git diff` empty on probe files per impl record).

**Verdict: DELIVERED per spec. Pyramid is non-vacuous.**

---

## §7. S6 — W0-5 clause (e) + cast

**Spec claims:** implement-via-delegation RECORD or rescope; fix `format.ts:157` cast.

**Verification:**

Clause (e): impl records it IMPLEMENTED-via-delegation at `proof-easing-editor-live.mjs`
(the Easing→Amiga→Easing re-mount leg, `:426-445`); re-verified actuating at wave close —
observed `cubic-bezier(0.75, 0.88, 0.25, 1.00)` round-trip, gate PASS. The delegation
bites (bare token → typed throw on re-mount). No new escape hatch, no quiet drop.

Cast: `format.ts:79` reads `const declared: ParsedVarMap = animation.parsedVars[i] ?? {}`
— no cast at all. The `as Record<string, ValueUnit[]>` is gone entirely. One unrelated
`Map<string, ValueUnit[]>` remains at `:183` for the percent-grouping accumulator
(storing `ValueUnit` stop percentages, not var-map entries — a different, correct use).

**Verdict: DELIVERED per spec.**

---

## §8. S7 — LS-9/10/11 dead-source sweep

**Spec claims:** delete `ScenePlaybackState` alias + re-export; delete `./animationStores`
comment; unexport `LEGACY_PATH_D`.

**Verification:**

```
grep -rn 'ScenePlaybackState' demo/ src/ test/ scripts/
→ 0 hits

grep -rn 'animationStores' demo/
→ 0 hits

grep -n '^export const LEGACY_PATH_D' demo/motion-path/motionPathGeometry.ts
→ (no match — it is `const LEGACY_PATH_D = …`, not exported)
```

`LEGACY_PATH_D` remains as a private `const` (unexported); the JSDoc geometry witness
at `:21,52,106` is kept per spec. Zero public importers (grep before and after: empty).

**Verdict: DELIVERED per spec.**

---

## §9. S8 — structured codes (K3-internal)

**Spec claims:** `AnimationOptionErrorCode = "EMPTY_PARSE" | "UNKNOWN_TIMING_FN"` in
`errors.ts`; codes attached at `frame-compiler.ts` throw sites; no full diagnostics
channel built (K.W0 seed).

**Verification:**

`src/animation/internal/errors.ts:35`:
```typescript
export type AnimationOptionErrorCode = "EMPTY_PARSE" | "UNKNOWN_TIMING_FN";
```
`:46` — `readonly code?: AnimationOptionErrorCode` on `AnimationOptionError`.

`frame-compiler.ts:174` — blank selector carry `"EMPTY_PARSE"`.
`frame-compiler.ts:71` — unrecognized timing function carries `"UNKNOWN_TIMING_FN"`.

`test/w0-crashes.test.ts:178-218` pins both codes and the `code === undefined` row for
non-blank non-coded throws.

No `ResolvedKeyframes.diagnostics` channel exists in the tree (`grep -rn 'diagnostics.*Diagnostic\|Diagnostic\[\]' src/` → 0 hits). K.W0 seed is untouched.

**Verdict: DELIVERED per spec. Boundary held.**

---

## §10. Gate concordance

| gate | spec | observed at HEAD |
|---|---|---|
| `npm test` | 74 files, 738 passed, 3 expected fail | **77 files, 751 passed, 3 expected fail** (W3/W6 additions since W1 close — consistent) |
| `npm run proof:engine` | PASS (ceilings) | **PASS** — `Animation` class 1099 ≤ 1100; engine.ts 1399 ≤ 1400 (W6 added 24 lines post-W1; ceiling holds) |
| `npm run proof:roundtrip-fidelity` | PASS (29 tests) | **PASS** — 29 tests, de-vacuoused corpus |
| `npm run proof:boundary` | PASS | **PASS** — zero static value.js edges in light barrel |

---

## §11. Residues and open items

### RES-1 — `KeyframesEditor.vue` orphaned: dead-in-render, live-in-source (P2)

**Finding:** The impl record acknowledges (§Hard gate clause (a) RE-SCOPE RECORD) that
`KeyframesEditor.vue` has **no importer anywhere in the tree** — the per-card component
is tree-shaken out of every built artifact (`grep -rn "import.*KeyframesEditor" demo/` →
only the self-import inside `KeyframesEditor.vue:89`). The full chain
(`KeyframesEditor.vue` + `KeyframeCardList.vue` + `KeyframeCard.vue` +
`useKeyframesEditor.ts` + `useKeyframesParsing.ts`) is live-in-source and
dead-in-render. The W1 impl records this as: *"dead-in-render but live-in-source — under
no-legacy it must be either RE-MOUNTED (J.W2's lane) or DELETED (J.WZ adjudication)."*

**Status at HEAD:** Neither re-mounting nor deletion occurred. The chain is still
live-in-source. `J.WZ.md` does not mention it; `K-SEED.md` does not index it. The
handoff destination ("J.W2's lane or J.WZ adjudication") was not executed.

**Impact:** U-K11 ("no proper keyframes editor") is the live user complaint (seeded from
the orchestrator triage). The orphaned chain contains `CSSKeyframesToStrings` (the S1
unified per-card serializer) — the entire ENG-1 fix is functionally correct but the
rendered surface it was written for does not exist. A user who navigates to any scene and
opens controls will never see a per-card keyframes editor. The serializer correctness
is gated at the jsdom level (serialize-from-template tests) but the PRODUCT surface is
absent.

**Seam:** `demo/@/components/custom/animation-controls/keyframes/KeyframesEditor.vue`
(no importer outside itself).

**Suggested wave-class:** K.W0 or K.W1 — demo-behavior, product surface. Re-mounting
the editor pane (wiring `KeyframesEditor.vue` into `AnimationControls.vue`) closes both
the no-legacy residue and U-K11 simultaneously.

---

### RES-2 — S1 rendered oracle is aggregate-only; per-card bite is jsdom-only (P2)

**Finding:** The spec's clause (a) oracle (the RENDERED per-card pane round-trips a
`var()`-bearing animation) was RE-SCOPED in the impl because `KeyframesEditor.vue` has
no mount point. The strongest actuatable runtime oracle reads the Monaco aggregate
editor pane (which uses `CSSKeyframesToString`, already correct since I.W0 S2 — the
pre-W1 aggregate path). The S1-SPECIFIC per-card regression is caught ONLY at the jsdom
tier (`test/serialize-from-template.test.ts`). A regressor who reverts `CSSKeyframesToStrings`
back to `animation.frames`/`flatVars` would fail the jsdom suite but pass the browser
clause (a) oracle.

**Impact:** The unit pyramid correctly bites (the born-RED witnesses confirm it); the
RUNTIME oracle cannot substitute. This is an honest re-scope (recorded in impl with
reason), not a quiet drop — but the underlying product surface gap (RES-1) means the
re-scope is permanent until the editor is re-mounted.

**Seam:** `scripts/proof-engine-no-throw-on-play.mjs` §[J.W1 a] RE-SCOPE comment;
`test/serialize-from-template.test.ts` (the unit-only bite).

**Suggested wave-class:** P2 — resolves with RES-1 (re-mounting the editor restores the
runtime oracle as specified).

---

### RES-3 — `SELECTOR_PERCENT_RE` accepts negative-exponent scientific notation (P2)

**Finding:** `SELECTOR_PERCENT_RE = /^(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?%$/` at
`frame-compiler.ts:98` accepts `"1e-2%"` (= 0.01%) and `"1e+2%"` (= 100%) — these pass
the regex and the `parseFloat(selector) <= 100` range check. `"1e+3%"` = 1000% correctly
rejects. This is a minor spec-conformance ambiguity: CSS keyframe selectors do not use
scientific notation in practice, but the grammar allows digits-only percent literals.
The spec says "a percentage literal `<number>%` in `[0,100]`" — scientific notation is
technically a valid `<number>` representation but not a keyframe selector convention.
No practical author will pass `"1e-2%"` as a selector; the range check catches
out-of-range cases; the behavioral impact is zero. Noted as a future precision point
if the guard is formally specified as a CSS grammar subset.

**Seam:** `src/animation/frame-compiler.ts:98`

**Suggested wave-class:** P2 hygiene, K.W0 if the total-guard spec is formalized.

---

### RES-4 — `KeyframesEditor.vue` orphan not indexed in K-SEED or deferred ledger (P2)

**Finding:** The impl's RECORDED HANDOFF text says the orphan is for "J.W2's lane or
J.WZ adjudication." Neither J.W2-impl.md nor J.WZ addressed it. The K-SEED.md does not
list it as a K item (U-K11 "no proper keyframes editor" appears only in the orchestrator
triage, not in the formal seed). The deferred ledger (`audit/deferred-ledger.md`) does
not index it. The orphan is mentioned ONCE in `J.W1-impl.md:209-213` and once in the
`proof-engine-no-throw-on-play.mjs` clause comment.

**Impact:** A K developer scanning K-SEED.md and the deferred ledger to understand the
scope of K.W0/W1 demo work will not find this item. U-K11's root cause (the orphaned
per-card editor chain) is not formally seeded.

**Suggested wave-class:** K.W0 planning — add the orphan as a named K-item (RE-MOUNT
or DELETE decision) to the K deferred ledger.

---

## §12. Summary assessment

**Spec completeness:** All eight spec items (S1–S8) are delivered as specified. The
engine seam closures (S1, S2, S3, S8) are total and correctly structured. The test
pyramid (S4, S5) is non-vacuous, with born-RED witnesses on record. Dead source (S7) is
fully deleted. The gate battery (proof:engine, proof:roundtrip-fidelity, proof:boundary,
npm test) runs GREEN at HEAD.

**Delivery quality:** HIGH. The `NOOP_TRANSFORM` hoist (S2), the `declaredKeyframeBody`
unification (S1), the named-grammar total guard (S3), and the structured codes (S8) are
all executed at the right altitude — no `try/catch` swallows, no heuristic guards, no
second serializer kept beside its replacement.

**Residues:** Four items, all P2 (zero P0/P1). The dominant residue is the orphaned
per-card editor chain (RES-1/RES-2): ENG-1's fix is functionally correct and
pyramid-tested, but the product surface it serves is not rendered. This is the open
root of U-K11 and requires a K-wave decision (re-mount or delete). The other residues
(RES-3 scientific-notation edge, RES-4 seed-index gap) are cosmetic.

---

## §FOLD

| Finding | Severity | Seam | Suggested wave-class |
|---|---|---|---|
| RES-1: `KeyframesEditor.vue` + card chain dead-in-render / live-in-source; S1 fix has no rendered surface | P2 | `demo/@/.../keyframes/KeyframesEditor.vue` (no importer outside itself) | K.W0 or K.W1 — RE-MOUNT or DELETE decision; closes U-K11 and the no-legacy residue simultaneously |
| RES-2: S1 per-card oracle is jsdom-only; runtime clause (a) reads the aggregate path (already I.W0 S2 GREEN) | P2 | `scripts/proof-engine-no-throw-on-play.mjs` §[J.W1 a] re-scope; `test/serialize-from-template.test.ts` | Resolved by RES-1 (editor re-mount restores the spec's runtime oracle) |
| RES-3: `SELECTOR_PERCENT_RE` accepts scientific-notation percent literals (e.g. `"1e-2%"`) — no practical impact | P2 | `src/animation/frame-compiler.ts:98` | K.W0 hygiene if the guard spec is formalized as a CSS grammar subset |
| RES-4: orphaned per-card editor not indexed in K-SEED.md or deferred ledger; U-K11 root untracked formally | P2 | `docs/tranches/J/audit/frontier/K-SEED.md` / `docs/tranches/J/audit/deferred-ledger.md` | K planning — add named K-item to deferred ledger before K.W0 wave authoring |
