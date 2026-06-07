# Tranche H DEEP harden — lane `hd-w0` (H.W0: kill the live crashes)

**Charge.** Red-team H.W0 substantively: are BOTH crashes real TODAY? is each fix
CORRECT + FEASIBLE? does each gate genuinely BITE? is any fix a workaround vs. the
real seam? Verified live at `:5173`, in unit reproduction (vitest, project resolver),
and against the current source + value.js `0.11.1` API.

**Method.** Live Playwright drive of `#/cube` / home↔scene with cleared and dirty
localStorage (console-error capture). Source read: `src/animation/{format,engine,
frame-compiler,utils,easing}.ts`, `demo/cube/useCubeAnimations.ts`, `demo/easing/
useEasingDemo.ts`, `KeyframesStringControls.vue`, `AnimatedText.vue`,
`EditorStartScreen.vue`. value.js API checked in `node_modules/@mkbabb/value.js/dist/
units/{interpolate,index}.d.ts`. Five throwaway vitest probes (written, run, deleted —
tree clean) reproducing the serialize + interp paths.

**VERDICT: the wave's GOAL is right (the two crashes are real and must die first), but
the wave is MIS-ROOT-CAUSED on BOTH crashes, and TWO of its four gates do NOT bite as
written.** H-A1's throw is NOT in the Cube presets — it is the **easing-scene
`contractAnim`** built from a bare closure (`useEasingDemo.ts:268-274`); S1's "give Cube
presets `.css` twins" fixes a file that does not throw. H-A2's `{label:"a"}→{label:"b"}`
corpus row and `{content:"..."}` reproduction **do NOT throw today** (proven in unit) —
the engine already tolerates a bare text leaf — so gate (c) is GREEN-today / vacuous, and
the audit's "the hero ellipsis reaches a `CSSKeyframesAnimation` lerp" root cause is
provably wrong (`AnimatedText` is pure CSS, no engine). Two BLOCKERs, two HIGH, plus the
file:line drift.

---

## BLOCKER-1 — S1 targets the wrong file: the Cube presets do NOT throw; the easing-scene `contractAnim` does

**Doc location:** H.W0.md §Scope S1 / §Provenance H-A1 / §The state ("H-A1 reproduces 4×
on EVERY Cube load… the Cube presets `Rotations`, `Matrix` carry programmatic-closure
timing functions"); H.md:190, :309, :313 (S1).

**Defect.** The wave's S1 scope is `demo/cube/cubeAnimations.ts` — "every preset whose
`timingFunction` is a programmatic closure (`Rotations`/`Matrix`)". This is wrong on
three counts, each verified:

1. **The file is `demo/cube/useCubeAnimations.ts`, not `cubeAnimations.ts`** (the named
   file does not exist).
2. **No Cube preset carries a closure timing function.** Read `useCubeAnimations.ts`:
   - `matrixAnim` / `rotationAnim` take `getStoredAnimationOptions(...).animationOptions`
     — store default `timingFunction: "ease-in-out"` (`stores/animationOptionsStore.ts:39`),
     a **string**. `resolveEasingOption` (`frame-compiler.ts:47`) sets `cssTwinFor("ease-in-out")`
     → `"ease-in-out"` (CSS native keyword), so the Easing is `{ fn, css:"ease-in-out" }` and
     `serializeEasing` returns at `format.ts:31` (`if (easing.css !== undefined)`). **No throw.**
   - `changeGraphPerspectiveAnim` is `timingFunction: "easeInBounce"` (`useCubeAnimations.ts:93`)
     — a registry name; `serializeEasing`'s reverse-lookup (`format.ts:32-34`) matches
     `timingFunctions["easeInBounce"]` → `camelCaseToHyphen` → `"ease-in-bounce"`. **No throw.**
   - `hoverAnim` = `animations.hover(...)` — same store-default path.
3. **Unit-proven.** `CSSKeyframesToString(cubeRotationsAnimation)` and the `easeInBounce`
   animation BOTH serialize without throwing (probe: `ROT_OK len 354`, `BOUNCE_OK has
   ease-in-bounce`). The throw reproduces ONLY for a genuine non-registry closure
   (probe: `CSSCubicBezier(...)` → THROW; `steppedEase(...)` → THROW; `ease` registry fn
   → NO THROW).

**The REAL surface (proven).** `demo/easing/useEasingDemo.ts:268-274` builds `contractAnim`
with `timingFunction: currentEasingFn.value`, and `currentEasingFn` (`:71-85`) returns a
**bare `TimingFunction` closure** for `cubic-bezier` (`CSSCubicBezier(...)`), `steps`
(`steppedEase(...)`), `step-start/end`, and the `(t)=>t` fallback. None carries `.css`;
none is a registry entry whose `.fn` reverse-looks-up — so `serializeEasing` THROWS for
any of those selections. Probe `PROBE4`: the cubic-bezier and steppedEase `contractAnim`
both THROW the exact `AnimationOptionError` seen live; the `ease` registry fn does not.
This is why the live throw is **localStorage-state-dependent**: a fresh `#/cube` with
**cleared** localStorage produced **0 console errors** live (verified); the dirty-storage
load restored a persisted `cubic-bezier`/custom easing-scene selection (the route storm
cross-pollinates scenes), which is what threw.

**Why BLOCKER.** S1 as written edits a file with no defect; the readout would still
throw the moment a user picks cubic-bezier in the easing scene. The fix lands on the
wrong seam — the spine's "fix at the real seam, not a symptom site" is violated by
construction.

**Concrete doc edit.** Rewrite S1 (and H.md:313, :190, :309):
- Replace the scope file with `demo/easing/useEasingDemo.ts:268-274` (the `contractAnim`)
  AND any other scene `contractAnim` built from a bare scene easing fn (spring/sequence —
  grep `contractAnim` finds `useEasingDemo.ts:268`; the synthesis lane `a-scene-state-machine
  §3(a)` calls this the placeholder reaching the serializer).
- The engine-faithful fix is: the scene's easing computed must yield a **typed `Easing`
  `{ fn, css }`**, not a bare closure — the demo already has the CSS twin in hand
  (`useEasingDemo.ts:87-98` `cssValue` computes `cubic-bezier(...)`/`steps(...)`/name).
  Pass `{ fn: currentEasingFn.value, css: cssValue.value }` (or a registry NAME) to
  `contractAnim`'s `timingFunction`, so `serializeEasing` round-trips at `format.ts:31`.
  This is genuinely the DRY/engine-faithful move the wave wants — but on the right file.
- Delete the false "4× on every Cube load / Cube presets carry closures" anchor; replace
  with the verified anchor: "the easing-scene `contractAnim` throws when the persisted/
  selected easing is `cubic-bezier`/`steps` (a bare closure); a cleared-storage `#/cube`
  load is 0 errors — the throw rides restored cross-scene state."

---

## BLOCKER-2 — gate (c) does NOT bite: a bare text leaf does NOT throw today; the audit's H-A2 root cause (ellipsis → CSSKeyframesAnimation lerp) is provably wrong

**Doc location:** H.W0.md §Hard gate clause (c) ("`{label:"a"}→{label:"b"}` … reds
TODAY — the leaf reaches value.js `_lerp` and throws"); §Scope S3/S4; §Provenance H-A2;
H.md:192-196, :313-314.

**Defect.** The central H-A2 claim — "the engine has no fail-soft for a bare text leaf;
a `{label:"a"}→{label:"b"}` row reaches `lerpValue → _lerp` and throws TODAY" — is FALSE
in the current engine. Unit-proven, project resolver, current `engine.ts` + value.js
`0.11.1`:
- `{label:"a"}→{label:"b"}` via `fromVars`, `interpFrames(50)` → **NO THROW** (`LABEL_INTERP`).
- `{content:"..."}→{content:"..."}` (the doubled-dots reproduction) → **NO THROW** (`DOTS_INTERP`).
- bare `"..."→"..."`, mismatched `"..."→"......"`, `"a"→"b"`, `"auto"→"auto"`, quoted
  `content` → ALL **NO THROW** (`PROBE2`).
- `fromString` with `content:"..."` (quoted and unquoted) → **NO THROW** (`PROBE3`).

So gate (c) passes **vacuously TODAY** (the wave asserts it "reds TODAY … greens on S3",
but it is already green). A gate that is green before the fix cannot prove the fix lands
anything — it is exactly the "no clause passes vacuously" failure the §spine-bar
paragraph claims to forbid. Reverting S3 would NOT red it.

**The audit's root cause is wrong.** H-A2 (and H.W0 §The state :19) assert the `"......"`
is "value.js concatenating two `"..."` frames" fed from "the hero ellipsis
`EditorStartScreen.vue:49` … passed to `AnimatedText` … a `CSSKeyframesAnimation` is fed
the hero ellipsis text as a non-interpolable string leaf." Verified false: `AnimatedText.vue`
is **pure CSS** — it splits text into `<span>`s and animates via the `.dot-fade` CSS
`@keyframes dotFade` (`AnimatedText.vue:93-119`). It never constructs a
`CSSKeyframesAnimation` and never feeds the ellipsis into the engine. The only `"..."`
literal in the live tree (`EditorStartScreen.vue:49`) reaches CSS, not `lerpValue`.

**The live `"......"` IS real but un-isolated.** I captured it live on the
dirty-storage `#/cube` load: `Error: Parse error at offset 0: "......"` at `_lerp
(value.js)` ← `processFrame (engine.ts:576)` ← `interpFrames (engine.ts:516)`. But none
of the four leaf shapes I tried reproduce it, so the trigger is a NARROWER, specific
path (not "any bare text leaf"). S3 as written ("classify a non-numeric/non-color/non-unit
STRING as discrete") will not necessarily intercept the actual leaf, because the actual
leaf is NOT a plain unparsed string — it already passes through `interpFrames` untouched
when it is one. The throw originates inside value.js's `_lerp` parse step on a leaf that
value.js DID build an iv for (e.g. a parsed `ValueUnit` whose `.value` becomes `"......"`
under some concat), which the kf-side `processFrame` guard at the `lerpValue` call site
may not see as "a bare string."

**Why BLOCKER.** The wave's headline H-A2 fix is specified against a reproduction that
does not reproduce; the gate that is supposed to make it falsifiable is green before any
fix. The fix could "land" (S3 written and merged) and the live `"......"` could STILL
fire, with the gate green throughout — the worst outcome for a born-RED discipline.

**Concrete doc edit.**
1. H.W0 must FIRST isolate the real `"......"` leaf before specifying S3 — add a
   §MEASURE-FIRST clause: "the offending leaf is NOT a plain `fromVars`/`fromString`
   string leaf (proven: `{label:a}→{label:b}`, `{content:"..."}`, `"..."→"......"` all
   no-throw on `interpFrames` today); the trigger is a specific path that builds a
   value.js iv whose `_lerp` parses `"......"`. Identify it (instrument value.js's
   parser input live, or grep scene keyframes that synthesize a doubled-token string)
   and re-anchor S3 to the actual seam."
2. Rewrite gate (c) so it bites the ACTUAL reproduction once isolated. If the real leaf
   is a parsed-`ValueUnit` concat artifact, the corpus row must construct THAT, not
   `{label:a}→{label:b}`. As written, delete the "reds TODAY" claim on (c) — it is false.
3. Strike the "hero ellipsis → CSSKeyframesAnimation lerp" root cause from H.W0 §The
   state (:19), §Provenance, and H.md:192-196; replace with "`AnimatedText` is pure CSS
   (no engine); the `"......"` source is [the isolated path]." (The D6 typing-dots visual
   fix in H.W6 is unaffected — it is a CSS-cadence fix, correctly scoped there.)

---

## HIGH-1 — file:line anchors are stale across the wave (wrong dir, wrong lines)

**Doc location:** H.W0.md §Scope (`src/animation/engine.ts:516,576`), throughout;
H.md:309 (`src/parsing/format.ts:24`), :313.

**Defect, each verified:**
- **`src/parsing/format.ts:24` does not exist.** There is NO `src/parsing/` directory
  (the project `CLAUDE.md` tree is aspirational/stale). The serializer is
  `src/animation/format.ts`, and the throw is at **line 36**, not 24 (line 24 is a
  doc-comment line). H.md:309 carries the wrong path AND wrong line; H.W0.md:7,15 use
  the correct `format.ts:24` form but 24 is still the comment, not the throw.
- **`engine.ts:516,576` are running-build source-map lines, not source.** In the current
  `engine.ts`, line 516 is inside `setRespectReducedMotion`, line 576 inside `setOptions`.
  The real interp dispatch is `interpFrames` at **`engine.ts:657`**, `processFrame` at
  **`:769`**, and the unguarded `lerpValue(eased, iv)` call at **`:779`** (the audit's
  own `:778-780` is correct for source; the wave's `:516,576` are the Vite-served
  build-map lines I confirmed live in the stack trace). The wave should cite the SOURCE
  lines, with a note that `516/576` are the dev-server map.
- **`KeyframesStringControls.vue:46/94/140` drifted.** Current source: the readout call
  is `:95` (`CSSKeyframesToString`), the `import` is `:45`, and it is invoked from
  **`onMounted` (`:222-224`)**, NOT "a Vue post-flush watcher at `:140`". (The live stack
  maps to `:46/:140` because the onMounted async hook flushes via `flushPostFlushCbs` —
  so "post-flush" is right but "watcher" is wrong; it is a mount hook.) The "4×"
  multiplicity claim hangs on "watcher-driven"; an `onMounted` fires once per mount, so
  the count is mount-driven, not watcher-driven.

**Why HIGH.** An implementer following these anchors edits the wrong file
(`src/parsing/format.ts`) and the wrong lines. The wave's own §spine demands every claim
cite a real `file:line`.

**Concrete doc edit.** Global replace in H.W0.md + H.md:
`src/parsing/format.ts:24` → `src/animation/format.ts:36` (the throw);
`engine.ts:516,576` → `engine.ts:769 processFrame / :779 lerpValue call (reached via
:657 interpFrames; the 516/576 in live stacks are the Vite dev source-map lines)`;
`KeyframesStringControls.vue:46,94,140 (watcher)` → `:95 (the readout call), invoked from
:222 onMounted (flushes post-render)`.

---

## HIGH-2 — gate (d) "born-RED today" is FALSE for the named animation; it greens vacuously

**Doc location:** H.W0.md §Hard gate clause (d) ("`CSSKeyframesToString(cubeRotationsAnimation)`
resolves … reds TODAY — the closure easing has no `.css` twin and `serializeEasing`
throws"); §Scope S4.

**Defect.** Clause (d) asserts the serializer over the Cube `Rotations` preset is RED
today. Unit-proven FALSE: `CSSKeyframesToString` over the `Rotations` preset (built
exactly as `useCubeAnimations.ts` does, `ease-in-out`) resolves to a 354-char string
with no throw (`ROT_OK`). So (d) is GREEN today; it cannot witness S1's landing (there
is nothing to fix on that animation). This is the same mis-root-cause as BLOCKER-1,
surfacing in the gate.

**Why HIGH (not BLOCKER).** The gate's INTENT (the serializer must be total over the
live closure-easing surface) is sound and bites — but only if pointed at the surface
that actually throws (the easing-scene `contractAnim` with a `cubic-bezier`/`steps`
selection), not `cubeRotationsAnimation`.

**Concrete doc edit.** Re-target clause (d): "`CSSKeyframesToString` over the easing
scene's `contractAnim` with `currentEasingName='cubic-bezier'` (a bare `CSSCubicBezier`
closure) resolves without throw. BITE: reds TODAY — the bare closure has no `.css` twin
and `serializeEasing` throws (proven: `PROBE4`); greens on S1's typed-Easing `{fn,css}`
pass-through. Strip the `.css` twin → reds." Keep `proof:roundtrip-easing` as the host
test (it already exists, `test/roundtrip-easing.test.ts`), adding this row.

---

## MED-1 — S2 readout-guard altitude is sound, but the "consumer never throws" claim leans on the wrong primary

**Doc location:** H.W0.md §Scope S2, §Design decisions ("the `.css` twin is the fix, not
a readout `try/catch`").

**Assessment (mostly sound).** The S2 design — a graceful `/* timing-function: custom */`
placeholder, never the silent `"linear"` degrade, as the FLOOR not the primary — is the
correct altitude and matches the spine (a display surface must not throw into a render
hook). The readout consumer genuinely has no `try/catch` around `CSSKeyframesToString`
(`KeyframesStringControls.vue:95`; the only `try` is the apply path `:173`). That half is
accurate and the guard is feasible.

**Defect (scoped).** The §Design-decisions framing says S1 (the `.css` twin) makes "the
readout never throw because the value IS serializable" — but with BLOCKER-1, S1 as
written does nothing, so S2 (the floor) becomes the ONLY thing standing between a
cubic-bezier selection and the throw. The wave under-weights S2 by calling it the floor
when, until S1 is re-targeted to the easing `contractAnim`, S2 is load-bearing. Also: a
placeholder comment requires detecting "this easing is non-serializable" WITHOUT calling
the throwing `serializeEasing` — the cleanest seam is a try/catch around the single
`CSSKeyframesToString` call at `:95` substituting the placeholder string, which the wave
should state explicitly (it currently says "wrap the single call site" — fine, but name
that `serializeEasing` itself still throws, so the catch must be at the
`CSSKeyframesToString` boundary, not inside the serializer).

**Concrete doc edit.** In S2, name the exact seam: "catch at the `CSSKeyframesToString`
call (`KeyframesStringControls.vue:95`), not inside `serializeEasing` (which must keep
its fail-explicit throw per G.W4). On catch, set `cssKeyframesString.value` to a
`/* timing-function: custom — non-CSS-representable curve */` placeholder." Note that
once S1 is re-targeted (BLOCKER-1) the easing-scene curve is representable, so S2 only
fires for a genuinely non-representable future closure — restoring it to the floor.

---

## MED-2 — the value.js-HANDOFF disposition is under-specified; the dispatch already lives in value.js

**Doc location:** H.W0.md §Scope S3 ("confirm the leaf-class seam… if value.js's
`flattenObject`/`createInterpVarValue`, RECORD as value.js-HANDOFF"); §Folds; §Design
decisions ("value.js-HANDOFF vs kf guard — both, sequenced").

**Assessment.** The seam is now confirmable (the wave leaves it as "confirm"): the lerp
dispatch lives ENTIRELY in value.js. `lerpValue` is imported from `@mkbabb/value.js`
(`engine.ts:18`); its dispatch `_lerp` is pre-resolved by value.js's `prepareInterpVar`
(value.js `units/interpolate.d.ts:60-69`). The kf-side `createInterpVarValue`
(`src/animation/utils.ts:283-341`) builds each iv via `prepareInterpVar(normalizeValueUnits(l,r,opts))`
— so kf HAS the `ValueUnit` leaves (`.value`, `.unit`) in hand at compile time and CAN
classify there, and `processFrame` (`engine.ts:779`) calls `lerpValue` and discards the
return (the iv `.value` is mutated in place; `lerpValue` already returns
`ValueUnit | undefined`).

**Defect.** Because the throw happens INSIDE value.js's `_lerp` parse (the live stack:
`_lerp` ← `processFrame`), a kf-side guard at the `processFrame` `lerpValue` call site
must classify-and-skip BEFORE calling `lerpValue` — but to do so it must recognize the
leaf as "discrete." `createInterpVarValue` is the better kf seam (it can stamp a
discrete flag on the iv at compile, e.g. when `l.unit === undefined && typeof l.value
=== "string"` and value.js cannot parse it). The wave conflates "the `processFrame`
guard" with "the classify point"; they are different lines. And the genuinely correct
home IS value.js (where the parse and `_lerp` dispatch live) — so this should lean
HANDOFF-primary with the kf compile-time stamp as the belt, not a runtime `processFrame`
type-sniff on every frame (a hot-path cost the engine's zero-alloc contract resists).

**Concrete doc edit.** In S3, distinguish the two seams: "(a) kf compile-time
classification in `createInterpVarValue` (`utils.ts:283`) — stamp a `discrete` flag on
the iv when the leaf is an unparseable bare string, so the hot path skips `lerpValue`
with no per-frame type-sniff (honors zero-alloc); (b) the value.js-HANDOFF — `_lerp`/
`prepareInterpVar` should classify a non-numeric/non-color/non-unit leaf as discrete at
its source (value.js `units/interpolate.ts`), since that is where the parse + dispatch
live. Land (a) now as the belt; HANDOFF (b) paired with the born-RED corpus row." Avoid
specifying a runtime `typeof` check at `engine.ts:779` — that is the wrong altitude for
the hot loop.

---

## LOW-1 — `proof:demo-console-clean` is net-new and sound, but overlaps `proof:demo-usability` which already visits `#/cube`

**Doc location:** H.W0.md §Hard gate (the new `proof:demo-console-clean`).

**Assessment.** Confirmed the new gate is genuinely net-new in the console-error axis:
the existing `proof:demo-usability` (`scripts/proof-demo-usability.mjs`, G.W11) navigates
`${base}/#/cube` (`:241`) and `${base}/` (`:163`) but asserts route-reachability / hero
gap / dead-route (X-3/X-5/X-6), NOT zero console errors. So a console-error clause does
not exist today and the gate adds a real dimension.

**Defect (minor).** The wave authors a NEW script `proof:demo-console-clean` rather than
adding a console-error clause to the existing live-Playwright `proof:demo-usability`
(same browser harness, same `#/cube` + home navigations already wired). The spine's
"no new machinery / DRY" favors extending the existing gate over a parallel script that
re-stands-up Playwright.

**Concrete doc edit.** In §Hard gate, prefer "add a zero-console-error clause to the
existing `proof:demo-usability` (it already drives `#/cube` and `/` live —
`scripts/proof-demo-usability.mjs:163,241`)" over a separate `proof:demo-console-clean`
script; keep the distinct name only if the synthesis wants a standalone re-run target.

---

## NIT-1 — "4× per Cube load" is unverifiable and likely state-dependent multiplicity

The live load showed **3** errors first, then **0** after clearing storage; the
session-cumulative log showed 6+6 across many navigations. The "exactly 4" count
(H.W0.md:15,47; H.md:190) is not reproducible and depends on how many scene
`contractAnim`s the route-storm restored. Replace "exactly 4" with "1 per restored
closure-easing scene readout (state-dependent; 0 on cleared storage)" so the gate's
"asserts an EXACT console-error count (zero)" remains the only count claim.

---

## What is SOUND (no finding — do not manufacture)

- **The §Goal is correct.** Both crashes ARE real and live (I reproduced both); killing
  them before visual lanes measure a clean console is the right sequencing.
- **The §Design-decision against a silent `"linear"` degrade** is right; G.W4's
  fail-explicit `serializeEasing` (`format.ts:30-45`) is correct engine policy and must
  not be reverted.
- **S2's altitude** (placeholder comment, never silent degrade; display ≠ contract
  surface) is the right floor.
- **The ALREADY-SOTA refusal** (G.W17 blend / G.W18 orbital / G.W13 finished / G.W19
  `adoptCompiled` untouched) holds — none is in the crash path; `adoptCompiled` is indeed
  the correct landing for a `.css`-twinned easing (`engine.ts adoptCompiled`,
  `a-engine-regressions H-A7`). H.W0 touching none of them is correct.
- **The value.js dispatch reality** matches the HANDOFF framing: `lerpValue`/`_lerp`/
  `prepareInterpVar` are value.js exports (`0.11.1`), so the deeper classification
  genuinely belongs there — the HANDOFF tag is honest.

## Net

H.W0's THESIS (kill two real live crashes first) survives. Its EXECUTION does not as
written: S1 + gate (d) are aimed at the Cube presets, which do not throw — the throw is
the easing-scene `contractAnim` built from a bare closure (`useEasingDemo.ts:268-274`),
state-restored across the route storm. S3 + gate (c) are aimed at a "bare text leaf"
reproduction that does not throw today, atop a root cause (ellipsis → engine) that is
provably wrong (`AnimatedText` is pure CSS). The wave must (1) re-target S1/(d) to the
easing `contractAnim` and pass a typed `{fn,css}`; (2) isolate the ACTUAL `"......"` leaf
before specifying S3/(c) so the gate bites; (3) fix the dead file:line anchors
(`src/parsing/format.ts` does not exist; `516/576` are dev-map lines; the readout is an
`onMounted`, not a watcher). Until then H.W0 is NOT implementable as written.
