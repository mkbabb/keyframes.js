# J.W1-impl — the engine-totality pass (wave-close record)

**Status:** LANDED · branch `j-impl-w1` · spec `waves/J.W1.md` (binding) ·
gates of record re-run at wave close on the final tree (2026-06-10, §Gates below):
`proof:engine-no-throw-on-play` (EXTENDED, KF_REQUIRE_BROWSER=1 over fresh
`npm run build` + `npm run gh-pages`) **PASS all clauses** · `proof:engine` **PASS**
(seam + ceilings) · `proof:roundtrip-fidelity` **PASS** (29 tests over the
de-vacuoused corpus) · `npm test` **74 files, 738 passed | 3 expected fail** (the
three intentional born-RED handoff witnesses: SEAM-4 `rotate()` byte-witness,
`group-snapshot-identity`, `interpolate-anything` MCI-5).

## §Per-item dispositions (file:line, verified on the final tree)

### S1 — ONE serialization authority (ENG-1, the headline) — IMPLEMENTED

- `src/animation/format.ts:74-96` — `declaredKeyframeBody(animation, i, defaultEasing)`
  is the ONE declared-template projection: sources `animation.parsedVars[i] ?? {}`
  (typed `ParsedVarMap`, no cast — see S6), emits via `unflattenObjectToString`,
  rides per-stop easing per CSS Animations L1.
- `src/animation/format.ts:108-130` — `CSSKeyframesToStrings` (the per-card
  serializer) iterates `animation.templateFrames` — one card per DECLARED stop —
  and projects each body through `declaredKeyframeBody`. The former
  `animation.frames` (interp-pair) iteration is gone: the off-by-one card list
  (N stops → N−1 interp pairs) and the DOM-resolved `frame.flatVars` read both
  died with the unification.
- `src/animation/format.ts:194-206` — the aggregate `CSSKeyframesToString`
  projects every stop from the SAME function (`declaredKeyframeBody` at `:199`).
  ONE `parsedVars`/template projection; both serialize surfaces share it.
- **The DOM-resolving path is DELETED:** `grep -rn 'CSSKeyframeToString\b'`
  across `src/ demo/ test/ scripts/` → **0 hits**. `flatVars` survives in
  `format.ts` only inside two explanatory comments (`:65`, `:105`).
- **Consumer retarget:**
  `demo/@/components/custom/animation-controls/keyframes/composables/useKeyframesParsing.ts:51`
  (`templateFrameStrings.value = await CSSKeyframesToStrings(animation)`; import
  at `:5`). *(The spec's locus path lacked the `composables/` segment — same file.)*

### S2 — `createFrame` totality (ENG-2) — IMPLEMENTED (the honest-fallback variant)

- `src/animation/frame-compiler.ts:241-259` — the transform seek:
  `seekPreviousValue` result CHECKED (`transformIx === undefined` arm), miss →
  `NOOP_TRANSFORM` (the I.W0 S3 field-default philosophy at the compile seam).
  The stacked `seekPreviousValue(...)!` + `templateFrames[undefined]!.transform`
  deref is GONE.
- `src/animation/frame-compiler.ts:261-273` — the timingFunction seek given the
  same totality: miss → `this.options.timingFunction` (the same default
  `addFrame` would assign).
- `src/animation/constants.ts:65` — `NOOP_TRANSFORM` hoisted to ONE shared
  export; `src/animation/group.ts:11` re-imports it (the old group-local copy
  deleted — no second copy beside the hoist); `frame-compiler.ts:31` imports it.

### S3 — the total selector guard (SEAM-1) — IMPLEMENTED

- `src/animation/frame-compiler.ts:97-102` — the NAMED conforming grammar:
  `SELECTOR_KEYWORD_RE` (`from`/`to`, case-insensitive per CSS, `:97`) ∪
  `SELECTOR_PERCENT_RE` (percentage literal, `:98`) with the `[0,100]` range
  check at the guard; `SELECTOR_REASON` (`:100-102`) is the one human message.
- `src/animation/frame-compiler.ts:168-186` — the guard validates BEFORE
  `parseCSSValueUnit` (`:193`): blank → typed `AnimationOptionError` with
  `code: "EMPTY_PARSE"` (`:170-175`); EVERY other non-conforming selector
  (`"abc"`, `"5px"`, `"150%"`, `"500ms"`, …) → the typed error naming the
  grammar (`:177-185`). No silent accept: a length / out-of-range percent rejects.
- The dead `convertFrameStart` time-selector branch died with the guard (a time
  is not a keyframe selector) — `grep -rn convertFrameStart` → only the
  explanatory comment at `frame-compiler.ts:191`.

### S4 — the consume-edge pins (SEAM-2/3/4) — IMPLEMENTED

- **SEAM-2 (the value.js empty-input contract pin):** `test/valuejs-contract.test.ts`
  (7 tests) calls `parseCSSValueUnit("")`/`("   ")` DIRECTLY (bypassing the S3
  guard — the `leaves-parity.test.ts` consume-edge precedent), asserts the
  typed-empty `ValueUnit` (value 0, no throw) + a positive control.
- **SEAM-4 (the de-vacuoused `rotate()`):** `test/serialize-from-template.test.ts:134-181`
  — the `it.fails` AUTHORED-vs-SERIALIZED byte witness (`:143-157`):
  `rotate(45deg)` must serialize byte-verbatim; born-RED TODAY on the value.js
  `rotateX|Y|Z` flatten expansion (the next-slice value.js HANDOFF's kf-side
  consume-signal — flips GREEN on the value.js shorthand-normalization fix).
  Plus the live-expansion positive control (`:159-171`, pins the CURRENT
  expanded keys so the witness can't rot silently) and the `rotateZ(45deg)`
  conforming sibling (`:173-181`, byte-verbatim GREEN).
- **SEAM-3 (the fixture trio):** `test/fixtures/keyframes/var-calc.css` +
  `test/fixtures/keyframes/matrix3d.css` added to
  `test/fixtures/keyframes/manifest.json` — `var-calc.css` rides `"roundtrip":
  "text"` with 4 verbatim tokens (`calc(100% - 20px)`, `calc(50% + 10px)`,
  `translateX(var(--x))`, `translateX(var(--y))`); `matrix3d.css` rides
  `"roundtrip": "byte"` with the two verbatim `matrix3d(…)` literals. Text-mode
  handling (serialize→reparse→serialize byte-stable + authored tokens survive
  VERBATIM) at `test/roundtrip-fidelity.test.ts:99-143`. The trio (`var()` /
  `calc()` / `matrix3d()`) is complete — not `var()` alone.

### S5 — the unit pyramid (TB-1/2/3 + decay) — IMPLEMENTED, each born-RED-witnessed

- **TB-1:** `test/serialize-from-template.test.ts` (9 tests incl. the SEAM-4
  expected-fail) — `CSSKeyframesToString` AND the unified `CSSKeyframesToStrings`
  on `var()`-bearing animations, verbatim non-DOM-resolved output, re-parses clean.
- **TB-2:** `test/playback-bind.test.ts` (6 tests) — the bind-proof contract:
  `const s = pb.stop; s()` and every arrow-field control method invoked UNBOUND
  + passed as a bare callback + the two-instance destructure pin.
- **TB-3:** `test/binary-search.test.ts` (7 tests) — `binarySearchRange` edges:
  empty array, single element, exact-boundary, below-min, above-max, odd/even counts.
- **decay:** `test/decay.test.ts` (11 tests) — `decay`/`decayRest` rest-point,
  velocity-zero, over-distance, the glide-asymptote identity.
- Born-RED witnesses: §Hard gate clause (d) table below.

### S6 — W0-5 clause (e) + the cast — DISPOSITIONED

- **Clause (e): RECORDED implemented-via-delegation.** The bare-`"cubic-bezier"`
  option-seam round-trip clause is satisfied by the SIBLING gate
  `scripts/proof-easing-editor-live.mjs` (the Easing→Amiga→Easing re-mount leg,
  ~`:426-445`), wired into `proof:correctness` beside `proof:engine-no-throw-on-play`.
  Re-verified ACTUATING this wave (KF_REQUIRE_BROWSER=1, built dist): the gate
  forces a controls RE-MOUNT across the scene sweep, asserts ZERO
  `AnimationOptionError`, and its clause (c) asserts the persisted readout is a
  COMPLETE re-parseable literal — observed `cubic-bezier(0.75, 0.88, 0.25, 1.00)`,
  gate PASS. The delegation BITES (a bare-token persistence would re-mount into
  the typed throw and red the leg). No re-scope needed; no new escape hatch.
- **The cast: GONE entirely.** The former `as Record<string, ValueUnit[]>` does
  not survive in any form — `format.ts:79` types `animation.parsedVars[i] ?? {}`
  directly as `const declared: ParsedVarMap` (no cast at all; the declaration
  reads true).

### S7 — the LS-9/10/11 dead-source sweep — DELETED

- **LS-9:** the `ScenePlaybackState` back-compat alias
  (`demo/@/components/custom/animation-controls/stores/sceneMachine.ts`) AND its
  `stores/index.ts` re-export DELETED — `grep -rn ScenePlaybackState` across
  `demo/ src/ test/ scripts/` → **0 hits**.
- **LS-10:** the dead `./animationStores` barrel comment (`stores/index.ts:1-3`)
  DELETED — `grep -rn animationStores demo/` → **0 hits**.
- **LS-11:** `LEGACY_PATH_D` UNexported (`export const` → `const`,
  `demo/motion-path/motionPathGeometry.ts:76`), the JSDoc geometry witness KEPT
  (`:21`, `:52`, `:106`) — zero importers before and after.
- **Companion (fix round 1):** the stale `demo/CLAUDE.md` stores block corrected
  (the deleted `ScenePlaybackState`/`scenePlayback.ts` doc mention → the real
  `stores/` contents).

### S8 — the two structured codes (K3-internal) — IMPLEMENTED, boundary held

- `src/animation/internal/errors.ts:35` —
  `export type AnimationOptionErrorCode = "EMPTY_PARSE" | "UNKNOWN_TIMING_FN"`;
  `:38-63` — optional `readonly code?: AnimationOptionErrorCode` on
  `AnimationOptionError` (set only when passed; branch on `code`, never the message).
- Wired at `frame-compiler.ts:174` (`EMPTY_PARSE`, the blank-selector throw) and
  `frame-compiler.ts:71` (`UNKNOWN_TIMING_FN`, the unrecognized timing function —
  the former silent-fallback site made explicit).
- All three code rows pinned in `test/w0-crashes.test.ts:177-218` (blank →
  `EMPTY_PARSE`; unknown timing fn → `UNKNOWN_TIMING_FN`; garbage non-blank
  selector → typed but `code === undefined` — the codes are the two named rows
  ONLY). **No diagnostics CHANNEL built** — the full `ResolvedKeyframes.diagnostics`
  surface stays the K.W0 seed (needs K1 ingestion to have a producer), per the
  spec's BINDING boundary.

### Fix round 1 — the runtime half (was the blocking gap)

- `scripts/lib/demo-driver.mjs` — `navToScene(page, sceneId, expectedTrigger,
  {timeout})` + `SCENE_MACHINE_KEY` AUTHORED per the J.W0 S2 spec-verbatim shape
  (`J.W0.md §S2`, `audit/ci-linux-open-item.md §4.2`). **Cross-wave seam note:**
  the spec says J.W0 authors the primitive and J.W1 consumes it; the primitive
  was ABSENT in this tree at fix time, so it is landed here byte-shaped to the
  J.W0 spec (a parallel J.W0 landing converges; J.W0's two gate MIGRATIONS —
  `scene-control-dfa`/`scene-transition-perf` off `navByHash` — remain J.W0's,
  untouched here).
- `scripts/proof-engine-no-throw-on-play.mjs` — extended with clauses `[J.W1 a]`
  / `[J.W1 b]` + the live built-library probe surface (an import-map page over
  `dist/keyframes.js` + the installed `@mkbabb/value.js` / `@mkbabb/parse-that`
  — the same bare-specifier resolution a consumer bundler performs).

## §Hard gate — clause-by-clause

### clause (a) — the rendered editor round-trips the declared `var()` — IMPLEMENTED, RE-SCOPED oracle (reason recorded)

**The spec's named oracle cannot exist in the product.** The spec reads the
PER-CARD pane (`useKeyframesParsing.ts` → `CSSKeyframesToStrings` →
`KeyframeCardList` cards). First-hand findings (fix round 1):

- `KeyframesEditor.vue` (the card list's ONLY mount) has **no importer anywhere
  in the tree** — and none at `765fad6` (F.W14), `905a8c3` (D), `391533e` (E);
  the last consumer edge is the pre-D barrel `2221047` (long dead).
- `"CSS for keyframe"` (the card `<pre>` aria-label) occurs **nowhere in the
  built `dist/gh-pages/`** — the per-card component is tree-shaken out.
- `CSSKeyframesToStrings` is in **NO built artifact**: the demo bundles only the
  aggregate path; the library does not export `format.ts` (npm export surface
  frozen at 4.1.0 — adding exports is out of a fix round's authority).

The audit's ENG-1 "live-consumed by the editor" held on the IMPORT GRAPH only —
the render axis was never checked (the known gate-blind-spot class). Per
implement-or-rescope-with-reason (P-invariant-28, the spec's own §No-workaround
fold):

**Implemented rump (the strongest actuatable rendered oracle):** `[J.W1 a]` in
`proof-engine-no-throw-on-play.mjs` — `navToScene(page, "cube", "Keyframes")`
over the BUILT `dist/gh-pages/`; the pane state seeded through the SAME
persisted store the dock selects write; the pane TEXT read via the REAL user
gesture (click into the editor → select-all → copy → clipboard — the rendered
editor's FULL model, not a virtualized viewport slice). Asserts: VERBATIM
`rotateX(var(--rotationX))` (declared template, NOT a DOM-resolved number), NO
placeholder, AND the pane text RE-PARSES without throw through the BUILT
`dist/keyframes.js` `fromString` in the live probe page. **Observed GREEN at
wave close:** `415 chars`, verbatim token present, re-parse clean.

**Bite analysis (honest):** the clause reds on ANY rendered serializer surface
that DOM-resolves the declared `var()` (the B1 serialize face). Under the
`format.ts` stash-probe it stays GREEN — expected: the AGGREGATE path at HEAD is
already the I.W0 declared-template path; the S1-SPECIFIC (per-card) bite cannot
exist on a rendered surface the product does not render, and lives at the jsdom
tier (`test/serialize-from-template.test.ts`, witnessed born-RED below). An
aggregate-only regression still REDs here; the per-card regression REDs in
`npm test`.

**RECORDED HANDOFF (not a quiet drop):** the orphaned per-card editor
(`KeyframesEditor.vue` + `KeyframeCardList.vue` + `KeyframeCard.vue` + its
composable chain) is dead-in-render but live-in-source — under no-legacy it must
be either RE-MOUNTED (a demo-behavior/product decision — J.W2's lane) or DELETED
(J.WZ adjudication). Outside J.W1 fix-round authority; flagged here and in the
gate's clause comment.

### clause (b) — the typed selector error, live on the built dist — IMPLEMENTED, born-RED witnessed

`[J.W1 b]`: a probe page (import-map onto the installed deps) imports the BUILT
`dist/keyframes.js`, `loadAnimationEngine()`, and drives `"abc"` / `"5px"` /
`"150%"` through the public `fromKeyframes` construction path LIVE in chromium.
Asserts each throws `AnimationOptionError` (by name) NAMING the selector grammar
(`/keyframe selector/`), never `/Parse error at offset/`, never a silent
compile; the conforming control (`from`/`50%`/`to`) compiles; zero pageerror +
zero cryptic console line during the probe.

**Born-RED witness (fix round 1):** `git stash push -- src/animation/format.ts
src/animation/frame-compiler.ts` → `npm run build && npm run gh-pages` → gate run:

```
✗ [J.W1 b] selector "abc" threw the WRONG shape — Error: Parse error at offset 0: "...abc..." (want the typed AnimationOptionError, not the cryptic value.js throw)
✗ [J.W1 b] selector "5px" SILENTLY COMPILED — the no-silent-accept guard (a length / out-of-range percent is not a keyframe selector)
✗ [J.W1 b] selector "150%" SILENTLY COMPILED — the no-silent-accept guard (a length / out-of-range percent is not a keyframe selector)
```

— the SEAM-1 probe table reproduced exactly (cryptic-throw + the two silent
accepts). `git stash pop` → rebuild → gate GREEN (all `[J.W1 b]` checks ✓,
re-confirmed at wave close).

### clause (c) — the I.W0 battery un-regressed — GREEN

All I.W0 clauses GREEN across the re-seamed tree on the wave-close run:
(a) rainbow-play total on home+cube (zero pageerror), (b) zero parse-error
console lines, (c) cube paints LIVE (120 distinct non-none matrices this run;
112-123 across runs), (d) keyframes pane real CSS (359 chars, no placeholder),
hygiene (f) `parseCSSValueUnit("")` typed-empty, (g) `engine.ts` 1376 ≤ 1400.

### clause (d) — the unit pyramid born-RED witnesses (the recorded table)

| pin | probe (command) | observed RED line |
|---|---|---|
| TB-1 `serialize-from-template.test.ts` | `git stash push -- src/animation/format.ts` → `npx vitest run test/serialize-from-template.test.ts` | `Tests 5 failed \| 3 passed \| 1 expected fail (9)` — e.g. *"a per-stop easing that differs from the default rides the card"* → `AssertionError: expected '  0% {\n    opacity: 0;\n  }\n' to contain 'animation-timing-function: cubic-bezier…'` (the pre-S1 `frame.flatVars`/interp-pair path) |
| ENG-2 `frame-compiler.test.ts` | `git stash push -- src/animation/frame-compiler.ts` → `npx vitest run test/frame-compiler.test.ts` | `Tests 2 failed \| 6 passed (8)` — *"the documented public Animation surface compiles + interpolates transform-free"* → `TypeError: Cannot read properties of undefined (reading 'transform')` (the spec's predicted `[undefined]!` crash) |
| SEAM-1/S8 `w0-crashes.test.ts` | same frame-compiler stash → `npx vitest run test/w0-crashes.test.ts` | `21 tests \| 12 failed` — `"abc"`/`"garbage"` → `expected Error: Parse error at offset 0: "...abc..." to be an instance of AnimationOptionError`; `"5px"`/`"150%"`/`"-10%"`/`"500ms"`/`"1.5s"`/`"50"` → `expected undefined to be an instance of AnimationOptionError` (SILENT accept); `EMPTY_PARSE`/`UNKNOWN_TIMING_FN` codes absent |
| TB-2 `playback-bind.test.ts` | **planted mutation** (stash impossible kf-side: the I.W1 arrow-field fix is committed I-history) — `stop = (): void => {…}` → prototype `stop(): void {…}` in `src/animation/playback.ts` | `Tests 4 failed \| 2 passed (6)` — `TypeError: Cannot read properties of undefined (reading '_gen')` at `stop` (`playback.ts:231`) under `const s = pb.stop; s()` and the two-instance destructure pin · mutation REVERTED, file byte-clean vs HEAD |
| TB-3 `binary-search.test.ts` | **planted off-by-one** — `while (lo <= hi)` → `while (lo < hi)` in `internal/binarySearch.ts` | `Tests 3 failed \| 4 passed (7)` — *"locates the right range across an odd AND an even count"* → `AssertionError: expected -1 to be 1` · REVERTED |
| decay `decay.test.ts` | **planted sign error** — `Math.exp(-k * t)` → `Math.exp(k * t)` in `decay.ts` | `Tests 5 failed \| 6 passed (11)` — *"returns x0 + v0/k (and matches the glide's asymptote)"* → `AssertionError: expected -2.61e+175 to be close to 60` · REVERTED |

Post-probe confirmation: all pin files GREEN on the restored tree; the probe
stashes/mutations were dropped/reverted cleanly (`git diff` on the probe-mutated
source files: empty).

### clause (e) — the kf-side value.js contract pin — IMPLEMENTED

`test/valuejs-contract.test.ts` calls `parseCSSValueUnit("")`/`("   ")` DIRECTLY
(bypassing the S3 guard) and asserts the typed-empty `ValueUnit` (value 0, no
throw) + a positive control. RED-able by rebuilding `node_modules` on value.js
0.11.1 (the I FINAL §4-A LOAD-BEARING witness — recorded, not re-run: value.js
is consumed PUBLISHED at 0.11.2 and the gate's hygiene (f) clause re-proves the
consumed build on every run).

### clause (f) — the de-vacuoused corpus — IMPLEMENTED

The `var-calc.css` + `matrix3d.css` fixtures round-trip in
`proof:roundtrip-fidelity` (29 tests GREEN at wave close — text-mode byte-stable
+ verbatim-token survival for `var()`/`calc()`, byte-mode for `matrix3d()`); the
AUTHORED-vs-SERIALIZED `rotate(45deg)` byte assertion is the `it.fails`
expected-fail in `test/serialize-from-template.test.ts` — born-RED TODAY on the
value.js `rotateX|Y|Z` expansion, the consume-signal that flips GREEN on the
value.js shorthand-normalization fix (the next-slice HANDOFF, OUT).

### clause (g) — the ceilings — GREEN

`engine.ts` **1375/1400** (`wc -l`; gate reads 1376 ≤ 1400 — untouched by the
wave) · `Animation` class **1075/1100** (`proof:engine` ✓) · `group.ts`
**801/820**. The S1/S2/S3 mass lives in `format.ts` (220 lines) /
`frame-compiler.ts` (469 lines) — both uncapped.

## §Gates of record (wave close, 2026-06-10, final tree)

- `npm test` — **74 files, 738 passed | 3 expected fail (741)** (the intentional
  born-RED handoff witnesses: SEAM-4 rotate byte-witness,
  `group-snapshot-identity`, `interpolate-anything` MCI-5).
- `npm run proof:engine` — **PASS** (seam run-state-free, class 1075 ≤ 1100,
  pause-honest, snap-symmetric, no-legacy rows all ✓).
- `npm run build` + `npm run gh-pages` — clean.
- `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui KF_REQUIRE_BROWSER=1
  npm run proof:engine-no-throw-on-play` — **PASS, all clauses ✓**: I.W0 (a)-(d),
  hygiene (f)/(g), `[J.W1 a]` ×2 (verbatim `rotateX(var(--rotationX))` at 415
  chars + re-parse through the built dist), `[J.W1 b]` ×4 (`"abc"`/`"5px"`/`"150%"`
  typed + the conforming control compiles).
- `npm run proof:roundtrip-fidelity` — **PASS** (29 tests, the de-vacuoused corpus).
- `proof:easing-editor-live` — **PASS** (fix round 1, the S6 delegation
  re-verification; wired in `proof:correctness`).
