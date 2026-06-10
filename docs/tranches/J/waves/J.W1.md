# J.W1 — THE ENGINE TOTALITY PASS (∥ · the latent-seam closure: the I.W0 transposition made TOTAL, the guards made total, the pyramid righted)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-J (the latent
  defect-class closure at the seams I repaired; mixed sev — ENG-1/ENG-2/SEAM-1/SEAM-2/SEAM-4
  are P1 LATENT-B1-class, the unit pyramid + SEAM-3 + the LS-9/10/11 dead-source sweep are
  P2 hygiene-of-the-engine). The I.W0 close was DELIVERED-SPEC-COMPLETE at the seam it
  touched (`audit/wave-I.W0.md` Verdict) — but the audit finds the SAME serialize-from-template
  transposition applied at ONE seam only while the sibling per-card serializer
  `CSSKeyframesToStrings`/`CSSKeyframeToString` still rides the pre-transposition DOM-resolved
  interp-frame path, live-consumed by the editor (ENG-1, the headline). This wave makes the
  transposition TOTAL: ONE serialization authority, the old path dead in the same motion. ·
  **Scope (engine, inv-16 UNFENCED — `src/animation` is the kf PRODUCT under the permanent
  engine rule; the fence is against SIBLING forks only, `J.md §MANDATE`):** `src/animation/format.ts`
  (`CSSKeyframesToStrings`/`CSSKeyframeToString` — the per-card serializer unification + the
  `format.ts:157`-class cast nit) + `src/animation/frame-compiler.ts` (`createFrame`'s
  `seekPreviousValue(...)!` deref + the non-total selector guard) + the consuming demo seam
  `demo/@/components/custom/animation-controls/keyframes/useKeyframesParsing.ts:51` (retarget
  the per-card call onto the unified path) + the kf-side test pins (`test/format.test.ts`,
  `test/w0-crashes.test.ts`, the new `test/fixtures/keyframes/` trio + the bind-proof /
  binarySearch / decay unit files) + the value.js empty-input contract PIN (kf-side, value.js
  itself is consumed PUBLISHED) + the LS-9/10/11 dead-source deletions in `demo/.../stores/`
  and `demo/motion-path/`. · **DAG-deps:** **J.W1 ∥ J.W2 ∥ J.W6 run parallel AFTER J.W0**
  (file-disjoint: engine-correctness / demo-behavior / measurements — `J.md §WAVE MAP DAG`,
  `waves/README.md §3`). The runtime half (`proof:engine-no-throw-on-play` extended) consumes
  the J.W0 `navToScene` primitive + green-Linux CI to actuate the editor per-card pane over the
  BUILT dist; the unit pyramid + the dead-source sweep need no harness. **NOT on J.W4's
  critical path; nothing downstream waits on W1** — it is the engine-totality lane that runs
  beside the W2→W7a chain.

## §Provenance (the folded root causes + the I.W0 carry-forward)

- `audit/engine-core.md` ENG-1 (the headline, P1) — *"the I.W0 serialize-from-template
  transposition was applied at ONE seam only — the aggregate `CSSKeyframesToString` got the
  declared-template path, while the sibling per-card serializer `CSSKeyframesToStrings`/
  `CSSKeyframeToString` was left on the pre-transposition DOM-resolved `frame.flatVars`
  interp-frame path, still live-consumed by the editor."* The aggregate fix (I.W0 S2,
  `format.ts:145-180`) sources each stop from `animation.parsedVars[i]` (declared, unresolved);
  the per-card path was never retargeted. CONFIRMED first-hand: `format.ts:51-69`
  `CSSKeyframesToStrings` maps `animation.frames` (the INTERP pairs) → `CSSKeyframeToString`
  (`format.ts:112-119`) reads `unflattenObjectToString(frame.flatVars)` — the DOM-resolved
  interp surface, NOT the declared template. The live consumer is
  `useKeyframesParsing.ts:51` (`templateFrameStrings.value = await CSSKeyframesToStrings(animation)`).
  `grep CSSKeyframesToStrings test/w0-crashes.test.ts test/format.test.ts` → 0 (untested).
- `audit/engine-core.md` ENG-2 (P1) — the latent B1-class crash: `frame-compiler.ts:217-223`
  `const transformIx = seekPreviousValue(startIx, this.templateFrames, (f) => f.transform != null)!;`
  then `this.templateFrames[transformIx]!.transform`. `seekPreviousValue` returns
  `number | undefined` (value.js `dist/utils.d.ts:27`); on a bare `Animation` with NO transform
  on any keyframe (`new Animation().addFrame(0,{x:0}).addFrame(100,{x:100}).parse()`), the seek
  yields `undefined`, the `!` masks it, `templateFrames[undefined]` is `undefined`, and
  `undefined!.transform` throws. `CSSKeyframesAnimation` always assigns `_defaultTransform` so it
  never reaches this, BUT `Animation` is a documented public export (`src/animation/index.ts`,
  `src/animation/CLAUDE.md §Classes`) — the same typed-as-present-but-isn't shape B1 was.
  CONFIRMED first-hand: `frame-compiler.ts:215-224`, the `seekPreviousValue(...)!` non-null
  assertion is the one genuinely-masking TS escape in scope (`audit/engine-core.md §(g)`).
- `audit/parsing-units-valuejs-seam.md` SEAM-1 (P1) — the B1/H-A2 selector guard is NOT total:
  `frame-compiler.ts:163` guards ONLY `start.trim() === ""`. A non-empty INVALID selector sails
  past into `parseCSSValueUnit(start)` (`:171`) and throws the cryptic value.js error. Probe over
  the public API: `"abc"`/`"xyz"`/`"garbage"` → `Parse error at offset 0: "...abc..."` (cryptic,
  NOT typed); `"5px"` → silently COMPILED (a length accepted as a selector); `""` →
  `AnimationOptionError` (the ONLY caught case). The guard's own comment
  (`frame-compiler.ts:159-161`) PROMISES it turns the cryptic throw "into a clear, typed
  `AnimationOptionError` so a malformed selector is named, not cryptic" — it delivers that for the
  blank case ONLY (`audit/parsing-units-valuejs-seam.md` SEAM-1).
- `audit/parsing-units-valuejs-seam.md` SEAM-2 (P1) — the LOAD-BEARING value.js empty-input
  contract has NO kf-side pin. The I FINAL §4-A declares `parseCSSValueUnit("") → ValueUnit(0)`
  LOAD-BEARING (rebuilding `dist` on value.js 0.11.1 reds `proof:engine-no-throw-on-play`); the
  contract holds in installed 0.11.2 (probe: `"" → value=0 unit=undefined`, no throw). But NO
  kf-side test exercises `parseCSSValueUnit("")` directly (`grep -rn parseCSSValueUnit test/`
  hits ONLY a comment in `w0-crashes.test.ts:14`); the kf guard (SEAM-1) short-circuits empty
  input BEFORE value.js sees it, so `w0-crashes.test.ts` proves the GUARD, not the value.js
  contract. A future value.js empty-input regression would surface only on the live runtime gate
  (built dist + a `var()` animation mounting empty) — fragile and indirect, not a focused pin
  (`audit/parsing-units-valuejs-seam.md` SEAM-2).
- `audit/parsing-units-valuejs-seam.md` SEAM-4 (P1) + SEAM-3 (P2) — `rotate(45deg)` (a 2D Z-only
  rotation) serializes as `rotateX(45deg) rotateY(45deg) rotateZ(45deg)` (a DIFFERENT transform);
  origin is value.js's flatten/parse (the `transform.rotateX|Y|Z` key expansion); kf's serializer
  faithfully re-emits the WRONG expanded keys. `proof:roundtrip-fidelity` would NOT catch it even
  with a fixture because the divergence is SELF-CONSISTENT — re-parsing the expanded form
  re-expands identically, `midpointSig(before) === midpointSig(after)` passes VACUOUSLY (the
  gate-ORACLE failure mode reproduced for the serializer). The value.js half is the next-slice
  HANDOFF; kf-side an AUTHORED-vs-SERIALIZED byte-identity assertion makes the divergence
  falsifiable HERE (SEAM-4). And the round-trip corpus (`test/fixtures/keyframes/manifest.json`,
  13 fixtures) has NO `var()`/`calc()`/`matrix3d()` fixture though serialize-from-template
  round-trips all three verbatim (SEAM-3 — the de-vacuousing must be all THREE, not `var()`
  alone, `PROGRESS.md §"Open deferrals"` SEAM-3 row).
- `audit/tests-bench.md` TB-1/2/3 — the unit pyramid is INVERTED for the I engine fixes: TB-1
  (I.W0 S2 serialize-from-template has NO unit test — no `var()` fixture, no test calls
  `CSSKeyframesToString` on a `var()` animation and asserts verbatim round-trip; `proof:engine-no-throw-on-play`
  is the ONLY oracle); TB-2 (I.W1 bind-proof `RAFPlayback` has NO unit test — no test
  destructures `playback.stop` or passes a control method as a callback to verify bind-safety;
  `sync-step.test.ts` tests the sync path, not the bind contract; the live-only oracle is
  `proof:fsm-suspend-resume-live`); TB-3 (`internal/binarySearch.ts` has ZERO direct tests —
  `binarySearchRange` is the O(log N) hot path every `interpFrames` call rides; empty-array,
  single-element, exact-boundary edges untested). Plus `decay.ts` has only transitive coverage
  (`audit/tests-bench.md §(a)` — 2 importers, the one public module the charter names "no test",
  `J.md §publish boundary`).
- `audit/wave-I.W0.md` §5/§8 — the W0-5 gate clause (e) split: clause (e) (the
  bare-`"cubic-bezier"` option-seam round-trip) is NOT implemented inside
  `proof-engine-no-throw-on-play.mjs` — it is DELEGATED to `proof-easing-editor-live.mjs:425-440`
  (the Easing→Amiga→Easing re-mount leg) and the split is documented (`impl/I.W0.md:40-44`),
  both wired to `proof:correctness`. J re-verifies the delegation is HONEST or formally
  re-scopes (the implement-or-rescope-with-reason fold). Plus the `format.ts:157` type-cast nit:
  `as Record<string, ValueUnit[]>` where `ParsedVarMap` is `Record<string, ValueArray>` —
  cosmetically wrong, functionally inert (both flow into `unflattenObjectToString`), fix the cast
  (`audit/wave-I.W0.md §8`).
- `audit/legacy-sweep.md` LS-9/10/11 — the dead-SOURCE no-legacy band the marker-grep cannot see
  (no `legacy`/`deprecated`/`TODO` token): LS-9 the `ScenePlaybackState` back-compat alias
  (`stores/sceneMachine.ts:62-64` + the `stores/index.ts:42` re-export — `grep -rn ScenePlaybackState`
  finds zero consumers outside `stores/`, dead-on-arrival); LS-10 the dead `./animationStores`
  barrel comment (`stores/index.ts:1-3` — no consumer imports from `./animationStores`, the old
  directory never existed at that path); LS-11 `LEGACY_PATH_D` exported at
  `demo/motion-path/motionPathGeometry.ts:76` with ZERO importers (`grep -rn LEGACY_PATH_D` →
  only self-JSDoc at `:21,52,106` — a public dead export in a non-library file). The
  `PROGRESS.md` legacy-sweep §"Fold Candidates for J" homes these in **J W1** (`audit/legacy-sweep.md §"Fold Candidates"`,
  Summary rows LS-9/10/11). Verified against the tree TODAY: each grep-confirmed dead, NOT
  carrying a legacy/deprecated token.

## §The state, verified (file:line / probe-output — every claim re-checked first-hand on `tranche-j-dev`)

- **ENG-1 — the two serializers, the split confirmed.**
  | serializer | reads from | path | live consumer |
  |---|---|---|---|
  | `CSSKeyframesToString` (AGGREGATE) | `animation.parsedVars[i]` (DECLARED, unresolved) | I.W0 S2 serialize-from-template — `format.ts:145-180` | the bottom-bar CSS readout |
  | `CSSKeyframesToStrings` (PER-CARD) | `animation.frames` → `frame.flatVars` (DOM-RESOLVED interp) | PRE-transposition — `format.ts:51-69` → `CSSKeyframeToString` `:112-119` | `useKeyframesParsing.ts:51` (the per-card editor pane) |

  The aggregate sources the DECLARED template; the per-card maps the INTERP frames and reads
  `frame.flatVars` — the exact DOM-resolved surface I.W0 S2 transposed AWAY from for the
  aggregate. A `var(--rotationX)` whose property is unset resolves empty on the interp surface
  and is re-serialized DOM-resolved; the per-card pane is the residual B1 surface
  (`audit/engine-core.md` ENG-1). `CSSKeyframeToString` is ALSO the helper the AGGREGATE path no
  longer needs for `var()`-bearing stops — the unification target is the `parsedVars`/template
  iteration the aggregate already uses (`audit/engine-core.md §Transposition 1`).
- **ENG-2 — the deref, confirmed.** `frame-compiler.ts:215-224`:
  ```
  let transform = startFrame.transform;
  if (transform == null) {
      const transformIx = seekPreviousValue(startIx, this.templateFrames, (f) => f.transform != null)!;
      transform = this.templateFrames[transformIx]!.transform;
  }
  ```
  Two stacked `!`s. `seekPreviousValue` → `number | undefined` (value.js `dist/utils.d.ts:27`).
  On a transform-free `Animation`, `transformIx` is `undefined`; `templateFrames[undefined]` is
  `undefined`; `undefined!.transform` THROWS. The compiled `AnimationFrame.transform` is typed
  REQUIRED (`constants.ts:112`) — the typed-as-present-but-isn't shape. The SAME stacked-`!`
  pattern repeats at `:226-232` for `timingFunction` (but `timingFunction` is ALWAYS assigned at
  `addFrame` `frame-compiler.ts:180-183` — `timingFunction == null ? this.options.timingFunction : …`
  — so that seek always hits; transform alone is the live latent path).
- **SEAM-1 — the guard's partiality, confirmed.** `frame-compiler.ts:163-169` throws the typed
  `AnimationOptionError` ONLY for `typeof start === "string" && start.trim() === ""`; line `:171`
  `const parsedStart = parseCSSValueUnit(start)` receives every non-empty string raw. The comment
  (`:159-161`) claims the typed-naming for "a malformed selector" generally; it delivers it for
  blank ONLY. Probe (public `fromKeyframes`):
  ```
  "abc"     -> Error : Parse error at offset 0: "...abc..."       (cryptic value.js throw — NOT typed)
  "garbage" -> Error : Parse error at offset 0: "...garbage..."   (cryptic)
  "5px"     -> compiled OK                                         (a LENGTH silently accepted as a selector)
  ""        -> AnimationOptionError : "a keyframe selector must be …"  (typed — the only caught case)
  ```
  `test/w0-crashes.test.ts` asserts `""`/`"   "` only — the non-empty-garbage rows are uncovered
  (`audit/parsing-units-valuejs-seam.md` SEAM-1).
- **SEAM-2 — the pin gap, confirmed.** `parseCSSValueUnit("") → ValueUnit(0, undefined)` in
  installed value.js 0.11.2 (node probe; the I.W0 S1 fix, `audit/wave-I.W0.md §S1`). `grep -rn
  parseCSSValueUnit test/` → ONLY the comment at `w0-crashes.test.ts:14` — NO direct pin. The kf
  guard (SEAM-1) short-circuits `""` BEFORE value.js, so the existing suite proves the GUARD, not
  the contract; the `test/leaves-parity.test.ts` precedent (a kf test that locks kf's
  CONSUMPTION of a value.js property) is the pattern (`audit/parsing-units-valuejs-seam.md` SEAM-2).
- **SEAM-4 — the vacuous round-trip, confirmed.** `rotate(45deg)` → `parsedVars` keys
  `['transform.rotateX','transform.rotateY','transform.rotateZ']` (tsx probe over `engine.ts`); the
  serializer re-emits `rotateX(45deg) rotateY(45deg) rotateZ(45deg)`. `midpoint stable: YES`
  (re-parse re-expands identically) — `proof:roundtrip-fidelity`'s `midpointSig` check passes
  VACUOUSLY (`audit/parsing-units-valuejs-seam.md` SEAM-4).
- **The unit pyramid gaps, confirmed.** `grep CSSKeyframesToStrings test/*.test.ts` → 0 (TB-1
  per-card untested too); no test destructures `{stop} = playback` / passes a control method as a
  callback (TB-2 — the I.W1 bind-proof property is live-gate-only via `proof:fsm-suspend-resume-live`);
  `internal/binarySearch.ts` direct import count = 0 (TB-3); `decay.ts` 2 transitive importers,
  no direct edge-test (`audit/tests-bench.md §(a)/§(b)`).
- **W0-5 clause (e) + the cast, confirmed.** `proof-engine-no-throw-on-play.mjs` carries clauses
  (a),(b),(c),(d),(f),(g) — NOT (e); clause (e) lives at `proof-easing-editor-live.mjs:425-440`
  (`audit/wave-I.W0.md §5`). `format.ts:157`-class cast `as Record<string, ValueUnit[]>` (the
  audit's line ref; the I.W0 audit pins it as the `parsedVars[i] ?? {}` coalesce site,
  `audit/wave-I.W0.md §2 S2`) where `ParsedVarMap = Record<string, ValueArray>` — inert, fix it.
- **LS-9/10/11 — the dead source, confirmed.** `stores/sceneMachine.ts:62-64`
  (`export type ScenePlaybackState = PlaybackSnapshot;`) + `stores/index.ts:42` (re-export);
  `grep -rn ScenePlaybackState` → definition + re-export only, zero outside-`stores/` consumers.
  `stores/index.ts:1-3` (the `./animationStores` barrel comment) → no consumer imports that path.
  `demo/motion-path/motionPathGeometry.ts:76` (`export const LEGACY_PATH_D = "M 60 200 C …"`) →
  `grep -rn LEGACY_PATH_D` self-JSDoc only (`:21,52,106`), zero importers
  (`audit/legacy-sweep.md` C/E §, Summary LS-9/10/11).
- **The engine CEILINGS (the gate, not a hope — `audit/engine-core.md §(a)`, C-6).** `engine.ts`
  = **1375 / 1400** (`wc -l`; 25-line headroom). `Animation` class = **1075 / 1100**
  (`proof:engine`, `awk` measure; 25-line headroom). `group.ts` = **810 / 820**
  (`LIBRARY_CEILING_OVERRIDE` raised at I.WZ `ebcc79f`, `audit/wave-I.W0.md §2 S3`). The ENG-1
  unification is a `format.ts` transposition (NOT a ceiling file — `format.ts` is uncapped) +
  a `useKeyframesParsing.ts:51` retarget; ENG-2/SEAM-1 are `frame-compiler.ts` edits — NEITHER
  touches `engine.ts` (`format.ts`/`frame-compiler.ts` carry the serialize + compile mass that
  the I.W0 note already kept OFF `engine.ts`). The ceilings are NAMED below and the §Hard gate's
  hygiene clause re-asserts them.

## §Goal

Make the I.W0 transposition TOTAL and the engine seams it half-closed FULLY total — **ONE
serialization authority** (the declared-template path; the DOM-resolving per-card path dead in
the same motion), **`createFrame` total** (typed error or honest fallback, never `[undefined]!`),
**the selector guard total** (the typed `AnimationOptionError` for ALL non-conforming selectors,
the boundary of "conforming" NAMED), **the value.js contract PINNED kf-side** (a value.js
regression reds HERE, fast, named), **the vacuous round-trips de-vacuoused**, **the unit pyramid
righted** (the I engine fixes gain the jsdom companions the browser gate alone covered), **W0-5
clause (e) honestly dispositioned**, and **the dead source deleted** (no-legacy beside its
replacement). Each move at the gestalt altitude the mandate demands — NO `try/catch` swallow as
a cure, NO demo-side band-aid, NO second serializer kept "just in case" (the old path DIES in
the unification motion; `J.md §MANDATE` no-legacy):

1. **ONE serialization authority (S1, ENG-1):** the per-card serializer unifies onto
   serialize-from-template; `CSSKeyframesToStrings`/`CSSKeyframeToString` source the DECLARED
   `parsedVars`, never `frame.flatVars`; the pre-transposition DOM-resolving path is DELETED.
2. **`createFrame` totality (S2, ENG-2):** the `seekPreviousValue` result is checked, not
   `!`-masked — typed error OR honest fallback, never `templateFrames[undefined]!.transform`.
3. **The total selector guard (S3, SEAM-1):** validate the selector against the
   percentage/keyword grammar BEFORE `parseCSSValueUnit`; throw the typed `AnimationOptionError`
   for ANY non-conforming selector (the boundary of "conforming" named).
4. **The kf-side contract pin + de-vacuoused round-trips (S4, SEAM-2/3/4):** the
   `parseCSSValueUnit("")` pin; the AUTHORED-vs-SERIALIZED byte assertion for `rotate()`; the
   `var()`/`calc()`/`matrix3d()` fixture trio.
5. **The unit pyramid (S5, TB-1/2/3 + decay):** serialize-from-template `var()` round-trip; the
   bind-proof contract `const s = pb.stop; s()`; `binarySearch`; `decay` — each born-RED via a
   git-stash probe against the pre-fix tree.
6. **W0-5 clause (e) + the cast (S6):** clause (e) implement-or-rescope-with-reason; fix the
   `format.ts:157` cast.
7. **The dead-source sweep (S7, LS-9/10/11):** delete the `ScenePlaybackState` alias + its
   re-export, the dead `./animationStores` comment, and UNexport `LEGACY_PATH_D`.

## §Scope

- **S1 — ONE serialization authority: unify the per-card serializer onto serialize-from-template
  (ENG-1, the headline · KFI, engine · the elegance/coherence fold).** Locus:
  `src/animation/format.ts` `CSSKeyframesToStrings` (`:51-69`) + `CSSKeyframeToString`
  (`:112-119`) + the retarget at `useKeyframesParsing.ts:51`. The per-card serializer iterates
  `animation.frames` (the INTERP pairs) and reads `unflattenObjectToString(frame.flatVars)` (the
  DOM-resolved surface). FOLD it onto the SAME declared-template iteration the aggregate
  `CSSKeyframesToString` uses (`animation.parsedVars[i]`, `format.ts:145-180`): the per-card path
  emits each card's CSS by round-tripping the DECLARED `parsedVars[i]` values VERBATIM via
  `unflattenObjectToString` — a `var(--rotationX)`/`matrix3d(…)` round-trips as the authored CSS,
  never DOM-resolved to a number. The pre-transposition `frame.flatVars`-reading path is DELETED
  in the same motion (no second serializer kept beside its replacement — `J.md §MANDATE`
  no-legacy). **The unification target:** ONE `parsedVars`/template iteration that BOTH the
  aggregate (whole-block) and the per-card (per-stop) consumers project from — not
  declared-template-here / DOM-resolved-interp-there. Cost ~30 LOC + the one retarget
  (`audit/engine-core.md §Transposition 1`). **WHY (transposition for ELEGANCE):** a serializer
  must not need a live, fully-styled DOM to emit CSS text; the editor's purpose is to show the
  AUTHORED CSS, which is also exactly what re-parses cleanly. This is the I.W0 S2 move applied to
  the seam it missed — the residual B1 surface for the per-card editor closes WITH the coherence
  win (`audit/engine-core.md` ENG-1, NOT measure-first — a correctness/coherence fold). **Engine
  ceiling:** `format.ts` is UNCAPPED; this is a `format.ts`/`useKeyframesParsing.ts` edit, it does
  NOT add `engine.ts` mass (the 1375/1400 + 1075/1100 caps are untouched, §Hard gate clause (g)).

- **S2 — `createFrame` totality: `seekPreviousValue` made total, never `[undefined]!` (ENG-2 ·
  KFI, engine).** Locus: `frame-compiler.ts:217-223` (the transform seek). The
  `seekPreviousValue(...)!` non-null assertion masks `number | undefined`. Replace the lying
  `!` with a real check: when no preceding template carries a transform, take the HONEST FALLBACK
  — the animation's `_defaultTransform`/identity-no-op transform (the same total default a
  `CSSKeyframesAnimation` always carries, `audit/engine-core.md` ENG-2; mirrors the I.W0 S3
  group `NOOP_TRANSFORM` field-default philosophy — a total default, not a lying assertion) — OR,
  if the IMPL elects the HARD-error variant (a transform-free `Animation.parse()` reaching the
  compile is an author error), throw a typed `AnimationOptionError` NAMING the condition (never
  the untyped `undefined!.transform` TypeError). **Default = the honest fallback** (a
  transform-free `Animation` is a legitimate numeric/CSS-var animation; it should compile to a
  no-op transform, not crash) — the benign-transient resolution mirroring I.W0's resolved
  benign-default decision. Either way the masked `[undefined]!` deref dies. **WHY:** a non-null
  assertion that lies is the defect; the field must carry a total resolution, not a hope
  (the I.W0 S3 §Design-decisions verbatim, applied at the compile seam). **Engine ceiling:**
  `frame-compiler.ts` is uncapped; `engine.ts` untouched.

- **S3 — the total selector guard: the typed error for ALL non-conforming selectors (SEAM-1 ·
  KFI, engine).** Locus: `frame-compiler.ts:163-171`. Widen the guard to validate the selector
  against the keyframe-selector grammar BEFORE `parseCSSValueUnit`, throwing the typed
  `AnimationOptionError` for ANY non-conforming input. **The boundary of "conforming" (NAMED, so
  the guard is total not heuristic):** a keyframe selector is conforming iff it is (a) a
  percentage literal `<number>%` in `[0,100]` (e.g. `"0%"`, `"50%"`, `"100%"`), OR (b) one of the
  CSS keyframe keywords `from` / `to` (case-insensitive per CSS) — and NOTHING else.
  Specifically NON-conforming (each must throw the typed error): the blank case `""`/`"   "`
  (already caught); non-empty garbage `"abc"`/`"garbage"`; a LENGTH `"5px"` (currently
  silently-accepted — a length is not a selector); an out-of-range percent `"150%"`; any other
  unit/function token. The guard validates against (a)∪(b) and throws `AnimationOptionError("start",
  start, "a keyframe selector must be a percentage 0%–100% or the keyword 'from'/'to' — got …")`
  for everything else, BEFORE the raw value.js parse can produce the cryptic `"......"`. Add the
  non-empty-garbage + `"5px"` + `"150%"` rows to `w0-crashes.test.ts` (`audit/parsing-units-valuejs-seam.md`
  SEAM-1). **WHY:** the H.W0 selector guard's STATED intent (turn the cryptic throw into a named
  typed error) delivered for blank only — this is the TOTALITY the B1 close claimed but did not
  deliver; fail-explicit at the seam, the typed condition the human reads. **Engine ceiling:**
  `frame-compiler.ts` uncapped; `engine.ts` untouched.

- **S4 — the kf-side contract pin + the de-vacuoused round-trips (SEAM-2/3/4 · the
  consume-edge pins, paired born-RED).** Three test-side closures (the value.js half of SEAM-4 is
  the next-slice HANDOFF, OUT — `J.md §OUT band`):
  - **SEAM-2 the empty-input pin:** a kf-side test (the `leaves-parity.test.ts` precedent)
    asserting `parseCSSValueUnit("")` and `parseCSSValueUnit("   ")` return a typed-empty
    `ValueUnit` (value 0, no throw). The kf guard (S3) short-circuits empty input BEFORE value.js,
    so this pin must call `parseCSSValueUnit` DIRECTLY (not through the guard) — it locks kf's
    CONSUMPTION of the value.js contract; a future value.js empty-input regression reds HERE,
    fast, named (NOT only on the indirect runtime gate). **WHY:** the LOAD-BEARING contract
    (I FINAL §4-A) has no focused pin; a regression must red at the unit, not at a built-dist
    var()-mount race.
  - **SEAM-4 the de-vacuoused `rotate()`:** an AUTHORED-vs-SERIALIZED byte-identity assertion
    (NOT just `midpointSig`-stable) for at least `rotate(45deg)` — assert the serialized output
    EQUALS the authored `rotate(45deg)`, so the value.js `rotateX|Y|Z` expansion is FALSIFIABLE
    here and the value.js-HANDOFF has a kf-side witness. The assertion is born-RED on the CURRENT
    tree (the expansion makes them differ) and is the consume-signal that flips when value.js
    fixes the shorthand normalization (cross-ref the round-trip-fidelity RECORD style — the
    chromatic-color epsilon row already documents one value.js round-trip artifact in the same
    corpus). **WHY:** the byte-same midpoint check is BLIND to a self-consistent divergence — the
    gate-ORACLE failure mode; the byte assertion is the falsifiable witness.
  - **SEAM-3 the fixture trio:** add `var-calc.css` + `matrix3d.css` (the trio: `var()`, `calc()`,
    `matrix3d()`) byte-round-trip fixtures to `test/fixtures/keyframes/manifest.json` — serialize-from-template
    round-trips all three verbatim but the corpus covers NONE; the de-vacuousing is all THREE,
    not `var()` alone (`PROGRESS.md §"Open deferrals"` SEAM-3 row). **WHY:** closes the gap between
    the `format.ts` claim (the comment asserts var()/matrix3d round-trip verbatim) and its test.

- **S5 — the unit pyramid: the jsdom companions for the I engine fixes (TB-1/2/3 + decay · the
  pyramid righted, each born-RED via git-stash probe).** Locus: `test/format.test.ts` (or a new
  `serialize-from-template.test.ts`), `test/playback-bind.test.ts` (new), `test/binary-search.test.ts`
  (new), `test/decay.test.ts` (new). Four jsdom-level pins, each authored to be witnessed
  born-RED on the PRE-fix tree (the git-stash probe: stash the fix, run the test, observe RED;
  un-stash, observe GREEN — the §Hard gate's born-RED protocol):
  - **TB-1 serialize-from-template `var()` round-trip:** call `CSSKeyframesToString` AND the
    now-unified `CSSKeyframesToStrings` (S1) on an animation whose keyframes carry
    `transform: translateX(var(--x))` and assert the output is VERBATIM `var(--x)` (non-DOM-resolved,
    re-parses without throw) — born-RED on the pre-S1 tree (the per-card path DOM-resolves it).
  - **TB-2 the bind-proof contract `const s = pb.stop; s()`:** destructure a `RAFPlayback` control
    method off the instance and invoke it UNBOUND (`const s = pb.stop; s()` — and the same for the
    other arrow-field methods), asserting it operates on the right instance (no
    `this`-undefined throw) — the I.W1 bind-proof property as a UNIT pin, born-RED on the pre-bind
    tree (the former non-arrow method drops `this` under bare invocation; `audit/tests-bench.md`
    TB-2 — "no test destructures `playback.stop`").
  - **TB-3 `binarySearch`:** direct edge-case pins for `binarySearchRange` (`internal/binarySearch.ts`)
    — empty array, single element, exact-boundary hit, below-min, above-max — the O(log N) hot
    path every `interpFrames` rides (`audit/tests-bench.md` TB-3); born-RED-able against a planted
    off-by-one.
  - **decay:** direct edge-case coverage for `decay.ts` (the one public module the charter names
    untested, `J.md §publish boundary`) — `decay`/`decayRest` rest-point + the velocity-zero and
    over-distance cases; born-RED-able against a planted sign error. **WHY:** the pyramid is
    INVERTED — the I.W0 S2 / I.W1 bind-proof fixes have a browser gate as their ONLY oracle (minutes
    to run, infra-coupled); a `npm test` regression would not be caught. The unit companions close
    the regression surface cheaply (`audit/tests-bench.md §(b)`).

- **S6 — W0-5 clause (e) implement-or-rescope + the `format.ts:157` cast (the honest floor).**
  Two sub-items:
  - **Clause (e) disposition:** the bare-`"cubic-bezier"` option-seam round-trip clause is
    DELEGATED from `proof-engine-no-throw-on-play.mjs` to `proof-easing-editor-live.mjs:425-440`
    and the split is documented (`impl/I.W0.md:40-44`, both wired to `proof:correctness`,
    `audit/wave-I.W0.md §5`). J re-verifies the delegation BITES (the Easing→Amiga→Easing re-mount
    leg asserts ZERO `AnimationOptionError` across construct+serialize+re-parse) and is honest —
    IF it holds, RECORD it implemented-via-delegation (the clause IS satisfied, just in the
    sibling gate); IF the audit finds the delegation does NOT actuate the option seam, RE-SCOPE
    with the reason recorded (implement-or-rescope, no perpetual punt — P-invariant-28). NO new
    escape hatch: the clause is satisfied by a real actuating gate or honestly re-scoped, never
    quietly dropped.
  - **The cast:** fix `format.ts:157`'s `as Record<string, ValueUnit[]>` to the correct
    `as Record<string, ValueArray>` (`ParsedVarMap` is `Record<string, ValueArray>`) — functionally
    inert today (both flow into `unflattenObjectToString`'s `ValueArray` supertype) but cosmetically
    wrong (`audit/wave-I.W0.md §8`). **WHY:** the floor must not carry a wrong type even when inert
    — a future reader trusts the cast; with S1 retargeting this path, the cast must read true.

- **S7 — the LS-9/10/11 dead-source deletions (no-legacy beside its replacement · the
  dead-source sweep).** Locus: `demo/.../stores/sceneMachine.ts:62-64`, `demo/.../stores/index.ts:1-3,42`,
  `demo/motion-path/motionPathGeometry.ts:76`. Three grep-confirmed-dead deletions:
  - **LS-9:** delete the `ScenePlaybackState` back-compat alias (`sceneMachine.ts:62-64`) AND its
    `stores/index.ts:42` re-export — zero consumers outside `stores/` (`grep -rn ScenePlaybackState`),
    dead-on-arrival.
  - **LS-10:** delete the dead `./animationStores` barrel comment (`stores/index.ts:1-3`) — no
    consumer imports that path; a stale migration note.
  - **LS-11:** UNexport `LEGACY_PATH_D` (`motionPathGeometry.ts:76` — `export const` → `const`),
    KEEPING the JSDoc geometry witness (`:21,52,106`) — zero importers (`grep -rn LEGACY_PATH_D`),
    a public dead export in a non-library file.
  **WHY:** these are no-legacy items the marker-grep cannot see (`LEGACY_PATH_D` is a NAME not a
  marker; the dead alias and comment carry no token) — the legacy-sweep homes them in J.W1's
  light-cleanup motion (`audit/legacy-sweep.md §"Fold Candidates for J"`, `PROGRESS.md §3`
  no-legacy row). They are NON-engine demo-side; they ride J.W1 as the engine-totality wave's
  dead-source companion, not because they touch `src/animation` (they do not). The LS-20 `as any`
  demo casts are J.W2's (`PROGRESS.md §"Open deferrals"` LS-20 row) — NOT this wave.

- **S8 — the two engine-internal diagnostics rows on the typed error (K3-internal; the structured
  reason that rides S3's totality motion · NOT the full diagnostics channel).** Locus: the SAME
  totality seams S2/S3 already touch — `frame-compiler.ts:163-171` (the selector guard, S3) and the
  timing-function path. The two engine-internal rows the ingestion lane folds into J.W1 are a
  STRUCTURED REASON carried ON the typed error S3 already throws, NOT a new diagnostics CHANNEL:
  - **`EMPTY_PARSE`:** the empty-input selector case (`""`/`"   "`, S3's already-caught blank) carries
    a stable structured `code: "EMPTY_PARSE"` alongside the human message on the
    `AnimationOptionError` — so a programmatic consumer can branch on the reason without string-matching
    the message.
  - **`UNKNOWN_TIMING_FN`:** when a keyframe/option timing function is unrecognized (the silent-fallback
    site the totality pass makes explicit), the typed error carries `code: "UNKNOWN_TIMING_FN"` — the
    same structured-reason discipline applied to the timing seam.
  These are ~20 LoC, RIDE the same totality motion as the typed selector throw (S3): the guard is
  already becoming total; attaching a stable `code` to the typed error it throws is the natural
  companion, not a new surface. **THE BOUNDARY (BINDING — no scope creep):** this is a structured
  `code` on the TYPED throw ONLY. The FULL `ResolvedKeyframes.diagnostics` channel — the
  `Diagnostic[]` field with `severity`/`message`/`source`, the `CROSS_ORIGIN_SKIP` / WAAPI-reason
  rows, the every-silent-fallback-site sweep — STAYS a K.W0 seed item (it needs K1 live-stylesheet
  ingestion to have a producer). J.W1 folds ONLY the two engine-internal rows that the typed throw
  already wants; it does NOT build the channel (`audit/frontier/live-stylesheet-ingestion.md` K3 / §"K3's
  empty-parse + selector-guard diagnostic rows → J.W1" — "the two engine-internal rows are ~20 LoC and
  ride the same totality motion; the full diagnostics channel stays K-scoped"). **WHY:** a typed error
  a programmatic caller cannot branch on without parsing the message is half-total; a stable `code` on
  the throw completes the totality S3 starts, at the seam S3 already owns. **Engine ceiling:**
  `frame-compiler.ts` uncapped; `engine.ts` untouched (the rows attach to the already-thrown typed
  error, no new `engine.ts` mass).

## §Hard gate (the proof:* that BITES — born-RED on the pre-fix tree, GREEN-on-fix · RUNTIME/INTERACTION + the unit pyramid)

The wave's GREEN depends on the RUNTIME clauses (a)-(c); the unit-pyramid clauses (d)-(g) are
born-RED jsdom pins that CORROBORATE (the pyramid righting) but the headline oracle is the
EXTENDED `proof:engine-no-throw-on-play` — the rendered editor per-card pane is the ENG-1 oracle,
NOT the source.

- **clause (a) — the EDITOR per-card pane round-trips a `var()`-bearing animation (the ENG-1
  oracle is the RENDERED card; CORRECTNESS).** `proof:engine-no-throw-on-play` extended: on the
  BUILT `dist/gh-pages/`, navigate via the J.W0 `navToScene` primitive to a keyframes-pane scene
  carrying a `var()`-bearing animation whose custom property is UNSET (the cube Rotations
  `var(--rotationX)` carrier — `demo/cube/useCubeAnimations.ts`), open the keyframes pane, and
  assert the PER-CARD pane text (`useKeyframesParsing.ts:51` → `CSSKeyframesToStrings`) is a
  parseable `@keyframes` block that re-parses WITHOUT throw AND contains the VERBATIM `var(--rotationX)`
  token (non-DOM-resolved), NOT a resolved number, NOT the `/* could not serialize */` placeholder.
  **BITE:** reds on the pre-S1 tree (the per-card path DOM-resolves the unset `var()` through
  `frame.flatVars` → the empty read-back → the serialize face of B1, OR a resolved number where
  the authored `var()` should be); greens on S1 (the per-card path sources the DECLARED
  `parsedVars`). **The per-card pane is non-substitutable:** the AGGREGATE readout already
  round-trips (I.W0 S2 GREEN, `audit/wave-I.W0.md §5` clause (d)) — this clause reads the SIBLING
  per-card surface I.W0 missed, so an aggregate-only fix still REDs here.
- **clause (b) — the garbage-selector path asserts the TYPED error name in the live console
  (SEAM-1; CORRECTNESS).** Drive (unit-through-live or via a constructed animation on the built
  dist) a non-conforming selector (`"abc"`, `"5px"`, `"150%"`) through the public
  `fromKeyframes`/`fromString` construction path and assert the thrown error is the TYPED
  `AnimationOptionError` NAMING the selector condition — NOT the cryptic value.js
  `Parse error at offset 0: "...abc..."`. **BITE:** reds on the pre-S3 tree (`"abc"`/`"5px"`/`"150%"`
  cryptic-throw or silently-compile per the SEAM-1 probe); greens on S3 (the total guard throws
  the typed error before `parseCSSValueUnit`). **No-silent-accept guard:** the `"5px"`-silently-compiled
  row means a fix that only rejects garbage but still accepts a length still REDs here.
- **clause (c) — the existing `proof:engine-no-throw-on-play` battery stays GREEN across the
  re-seamed tree (CORRECTNESS, regression guard).** The I.W0 clauses (a)-(d) (rainbow-play total
  on home+cube, zero parse-error console line, the cube transform paints ≥3 distinct values, the
  AGGREGATE editor shows real CSS) all stay GREEN with S1/S2/S3 landed — the unification and the
  guards do not regress the I.W0 close. **BITE:** would red if S1 broke the aggregate path or S2
  broke the compile of a transform-bearing `CSSKeyframesAnimation`. **WHY:** the totality pass
  extends the seam, it must not crack the close it builds on (`audit/wave-I.W0.md §5`).
- **clause (d) — the unit pyramid is witnessed born-RED on the pre-fix tree (S5; HYGIENE-corroborator,
  the jsdom companions).** The four new `npm test` pins — TB-1 serialize-from-template `var()`
  round-trip, TB-2 the bind-proof `const s = pb.stop; s()`, TB-3 `binarySearch` edges, decay edges
  — each witnessed RED on the PRE-fix tree via the git-stash probe (stash the fix → RED; un-stash
  → GREEN), recorded in the wave note with the observed RED line. **BITE:** the git-stash probe
  IS the born-RED witness — a pin that greens on the pre-fix tree is vacuous and must be
  re-authored to bite. *(Labeled HYGIENE-corroborator per the three-tier taxonomy — the unit pins
  support the runtime clauses (a)-(c) but the CORRECTNESS oracle is the rendered editor + the live
  console; `J.md §invariants`, `waves/README.md §5`.)*
- **clause (e) — the kf-side `parseCSSValueUnit("")` pin reds on a value.js regression (S4/SEAM-2;
  HYGIENE-corroborator).** The direct pin asserts `parseCSSValueUnit("")`/`("   ")` → typed-empty
  (value 0, no throw), called DIRECTLY (bypassing the S3 guard). **BITE:** born-RED-able by
  rebuilding `dist` on value.js 0.11.1 (the I FINAL §4-A LOAD-BEARING witness) — the pin reds on a
  value.js empty-input regression, fast + named, where today only the indirect runtime gate would.
  *(HYGIENE-corroborator — it locks the consume-edge of a PUBLISHED value.js contract; the
  value.js itself is sibling-owned, consumed published, `J.md §inv-16`.)*
- **clause (f) — the round-trip corpus de-vacuoused (S4/SEAM-3/4; HYGIENE-corroborator).** The
  `var()`/`calc()`/`matrix3d()` fixture trio round-trips byte-verbatim in `proof:roundtrip-fidelity`;
  the AUTHORED-vs-SERIALIZED `rotate(45deg)` byte assertion is RED on the current tree (the
  value.js `rotateX|Y|Z` expansion) and is the consume-signal that flips GREEN on the value.js
  shorthand-normalization fix. **BITE:** the `rotate()` byte assertion reds TODAY (the vacuous
  `midpointSig` pass is replaced by the falsifiable byte check). *(HYGIENE-corroborator — the
  SEAM-4 value.js fix is the next-slice HANDOFF (OUT); this clause is its kf-side WITNESS.)*
- **clause (g) — `proof:engine-line-ceiling` / `proof:engine` hold (HYGIENE, the C-6 enforcement).**
  `engine.ts` ≤ **1400** (1375 at J-open, 25-line headroom), the `Animation` class ≤ **1100**
  (1075, 25-line headroom), `group.ts` ≤ **820** (810) — OR a NAMED, MEASURED, COHESIVE split
  landed and documented in the wave note. The S1 unification lives in `format.ts` (UNCAPPED) +
  `useKeyframesParsing.ts`; S2/S3 live in `frame-compiler.ts` (UNCAPPED) — NEITHER adds `engine.ts`
  mass, so the caps are not pressured; this clause makes "respect the ceiling" a GATE not a hope.
  **BITE:** would red if a transposition pushed `engine.ts` past 1400 or the class past 1100 with
  no landed split. *(Labeled HYGIENE per the three-tier taxonomy — a source-shape/line-count check
  that may NEVER substitute for a red runtime clause; clauses (a)-(c) remain the sole CORRECTNESS
  oracle.)*

**The §spine bar — MUST bite.** Clauses (a)-(c) are RUNTIME/INTERACTION: they navigate via
`navToScene` over the BUILT dist, READ the RENDERED per-card editor pane (the ENG-1 oracle — the
card, not the source), drive the garbage-selector construction path and READ the live thrown
error TYPE, and hold the I.W0 battery green across the re-seam. Each asserts an EXACT property (a
re-parseable `var()`-verbatim per-card pane; a TYPED `AnimationOptionError` for every
non-conforming selector; the I.W0 close un-regressed). Revert S1 → (a) reds (the per-card pane
DOM-resolves); revert S3 → (b) reds (the cryptic value.js throw returns); revert S2 → the
transform-free `Animation` compile crashes under a planted no-transform fixture (the ENG-2 born-RED).
**Three-tier taxonomy (`J.md §invariants`, `waves/README.md §5`):** the wave's GREEN depends on the
RUNTIME clauses (a)-(c); clauses (d) (the unit pyramid), (e) (the value.js pin), (f) (the
de-vacuoused corpus), and (g) (the line-ceiling) are HYGIENE-corroborators — they support but may
NEVER substitute for a red runtime clause. **The born-RED witness is CONCRETE:** the per-card pane
DOM-resolves the unset `var()` on the pre-S1 tree (clause (a)); `"abc"`/`"5px"`/`"150%"`
cryptic-throw-or-silently-compile on the pre-S3 tree (clause (b)); each unit pin reds under the
git-stash probe (clause (d)). This is a parallel engine wave (∥ J.W2 ∥ J.W6); it is NOT on
J.W4's critical path and nothing downstream waits on it.

## §No-workaround prohibitions (BINDING — the mandate's named forbiddings for this wave)

- **NO second serializer kept beside its replacement.** S1 unifies onto serialize-from-template;
  the pre-transposition `frame.flatVars`-reading per-card path is DELETED in the same motion — NOT
  kept "just in case" behind a flag. Two serialize authorities is the ENG-1 defect; ONE authority
  is the cure (`J.md §MANDATE` no-legacy beside its replacement).
- **NO `try/catch` swallow as the createFrame cure.** S2 makes `seekPreviousValue` total via a
  checked fallback or a typed throw — NOT a `try/catch` that swallows the `[undefined]!` TypeError.
  A swallow hides the typed-as-present-but-isn't shape; the field carries a total resolution
  (the I.W0 S3 discipline).
- **NO heuristic selector guard.** S3's guard validates against the NAMED conforming set
  (percentage 0%–100% ∪ `from`/`to`), not a "looks-invalid" regex sniff. A heuristic that catches
  `"abc"` but misses `"5px"`/`"150%"` is the partial guard SEAM-1 indicts — the boundary of
  conforming is total and named.
- **NO demo-side `--rotationX` band-aid.** The per-card pane round-trips the AUTHORED `var()` because
  the serializer sources the DECLARED template (S1), NOT because the demo defines `--rotationX`.
  Defining the var would silence THIS carrier and leave the library fragile for the next consumer
  (the I.W0 §Design-decisions verbatim, `audit/wave-I.W0.md §3`).
- **NO clause (e) quiet-drop.** S6 either RECORDs clause (e) satisfied via the documented sibling
  delegation (the actuating `proof:easing-editor-live` leg) OR re-scopes it with the reason
  recorded — never silently omits it. The option seam is policed by a real gate or honestly
  re-scoped (P-invariant-28).
- **NO vacuous round-trip pass.** S4's `rotate()` assertion is AUTHORED-vs-SERIALIZED byte-identity,
  NOT `midpointSig`-stable — the self-consistent value.js expansion must be FALSIFIABLE (the
  gate-ORACLE failure mode the vacuous `midpointSig` reproduces, `audit/parsing-units-valuejs-seam.md`
  SEAM-4).

## §Folds (every J.md-assigned fold, with its evidence citation)

- **ENG-1** (the sibling per-card serializer still on the DOM-resolved path, live-consumed by the
  editor) — S1 (the per-card serializer unified onto serialize-from-template; the DOM-resolving
  path dies in the same motion). `audit/engine-core.md` ENG-1; the headline. Gated by clause (a)
  (the rendered per-card pane round-trips a `var()`-bearing animation). `PROGRESS.md §"Open
  deferrals"` ENG-1 row.
- **ENG-2** (`createFrame` derefs `templateFrames[undefined]!.transform`) — S2 (the
  `seekPreviousValue` made total — typed error or honest fallback, never `[undefined]!`).
  `audit/engine-core.md` ENG-2, `frame-compiler.ts:217-223`. Born-RED unit on the pre-fix tree (a
  transform-free `Animation.parse()`). `PROGRESS.md §"Open deferrals"` ENG-2 row.
- **SEAM-1** (the selector guard catches only `trim()===""`; non-empty garbage cryptic-throws) —
  S3 (the total guard — the typed `AnimationOptionError` for ALL non-conforming selectors, the
  boundary named). `audit/parsing-units-valuejs-seam.md` SEAM-1, `frame-compiler.ts:163`. Gated by
  clause (b). `PROGRESS.md §"Open deferrals"` SEAM-1/2/4 row.
- **SEAM-2** (the LOAD-BEARING value.js empty-input contract has no kf-side pin) — S4 (the direct
  `parseCSSValueUnit("")` pin). `audit/parsing-units-valuejs-seam.md` SEAM-2, I FINAL §4-A. Gated
  by clause (e). `PROGRESS.md §"Open deferrals"` value.js-contract row (the kf-side pin AUTHORED in
  J.W1).
- **SEAM-3** (the round-trip corpus lacks `var()`/`calc()`/`matrix3d()` fixtures) — S4 (the
  fixture trio). `audit/parsing-units-valuejs-seam.md` SEAM-3, `PROGRESS.md §"Open deferrals"`
  SEAM-3 row (the de-vacuousing is all THREE, not `var()` alone). Gated by clause (f).
- **SEAM-4** (the `rotate()` shorthand round-trip is vacuous) — S4 (the AUTHORED-vs-SERIALIZED byte
  assertion, the kf-side witness for the value.js-HANDOFF). `audit/parsing-units-valuejs-seam.md`
  SEAM-4. The value.js shorthand-normalization fix is the next-slice HANDOFF (OUT, `J.md §OUT band`).
  Gated by clause (f).
- **TB-1/2/3** (the I engine fixes have NO unit tests — the inverted pyramid) — S5 (the
  serialize-from-template `var()` round-trip, the bind-proof `const s = pb.stop; s()`,
  `binarySearch`, decay — each born-RED via git-stash). `audit/tests-bench.md` TB-1/2/3 + §(a)
  (decay). Gated by clause (d). `PROGRESS.md §"Open deferrals"` ENG-totality cluster.
- **W0-5 clause (e)** (the bare-`"cubic-bezier"` option seam — gate clause delegated to
  `proof:easing-editor-live`) — S6 (implement-via-delegation RECORD or rescope-with-reason).
  `audit/wave-I.W0.md §5`, `impl/I.W0.md:40-44`. The `format.ts:157` cast — S6 (fix to
  `Record<string, ValueArray>`). `audit/wave-I.W0.md §8`.
- **LS-9/10/11** (the dead-source no-legacy band, no marker word) — S7 (delete the
  `ScenePlaybackState` alias + re-export; delete the `./animationStores` comment; UNexport
  `LEGACY_PATH_D`). `audit/legacy-sweep.md` LS-9 (`stores/sceneMachine.ts:62-64` + `stores/index.ts:42`),
  LS-10 (`stores/index.ts:1-3`), LS-11 (`demo/motion-path/motionPathGeometry.ts:76`),
  `PROGRESS.md §"Open deferrals"` LS-9/10/11 row (the dead-source REMOVAL in the engine-totality
  motion).
- **K3-internal** (the two engine-internal diagnostics rows — `EMPTY_PARSE` / `UNKNOWN_TIMING_FN`) —
  S8 (a structured `code` ON the typed error S3 throws, NOT the full diagnostics channel — that stays
  a K.W0 seed item, needing K1 ingestion to have a producer). Rides the same totality motion as the
  typed selector throw (S3); ~20 LoC. `audit/frontier/live-stylesheet-ingestion.md` K3 (post-fleet
  J-fold, K-SEED §4).
- **CH-5/B1+B5 `"......"` crash** (VERIFY-ONLY, TERMINATED) — J.W1 RE-RUNS `proof:engine-no-throw-on-play`
  on the built dist; `parseCSSValueUnit("") => {value:0}` no-throw confirmed (node probe, value.js
  0.11.2). J does NOT re-derive the I close; it re-runs + extends it (`PROGRESS.md §"Open
  deferrals"` CH-5 row, `audit/deferred-ledger.md §1-A`).
- **C-6 engine line-ceiling watch** (VERIFY-ONLY, CONTAINED) — J.W1 respects the ceiling; clause
  (g) re-asserts `engine.ts` 1375/1400 + the class 1075/1100; the S1/S2/S3 edits do not touch
  `engine.ts`. `PROGRESS.md §"Open deferrals"` C-6 row, `audit/engine-core.md §(a)`.
- **RECORD (do NOT touch):** the ALREADY-SOTA engine seams — the FrameCompiler/Animation/playback/group
  decomposition is the right seam (`tick` means one thing, snap symmetric, zero legacy re-exports,
  `audit/engine-core.md §(a)/(e)`); the `NOOP_TRANSFORM` field-default half IS done at the right
  depth (I.W0 S3 GREEN, `audit/wave-I.W0.md §2 S3`); the light/heavy value.js boundary is sound +
  gated (`proof:boundary`, `audit/parsing-units-valuejs-seam.md` SEAM-8). The ENG-3/ENG-4 hot-path
  allocations + ENG-7 duplication are MEASURE-FIRST/RECORD (BOOK, `audit/engine-core.md` ENG-3/4/7)
  — NOT this wave's scope (the perf-frontier riders are J.W6's).

## §Hand-off / cross-wave boundaries (BINDING)

- **← J.W0 (consumed, BINDING):** J.W1's runtime clauses (a)-(c) navigate the built dist via the
  `navToScene(page, sceneId, expected)` primitive J.W0 lands in `scripts/lib/demo-driver.mjs`, and
  require J.W0's green-Linux CI to actuate end-to-end (the per-card editor pane gate runs on the CI
  substrate only once the ~60-gate tail clears, `J.md §WAVE MAP`). J.W1 CONSUMES the primitive; it
  does not author it.
- **→ J.W2 (disjoint, BINDING):** J.W1 owns the ENGINE seams (`src/animation` + the consuming
  `useKeyframesParsing.ts` serialize retarget + the dead-source `stores/`/`motion-path/` deletions);
  J.W2 owns the DEMO-BEHAVIOR seams (the shared drag composable, the `selectedControl` single-writer,
  the mobile sheet, CD-1). The LS-20 `as any` demo casts are J.W2's (`PROGRESS.md §"Open deferrals"`
  LS-20), NOT this wave's LS-9/10/11. File-disjoint by construction.
- **→ J.W3 (the estate, BINDING):** the new jsdom pins (S5) + the fixture trio (S4) enter the test
  estate; they ride the existing `npm test` / `proof:correctness` roster, not a new gate lattice —
  J.W3 owns the net-deletion estate industrialization, J.W1 adds tests within the existing tier
  (no new `scripts/` gate authored here).
- **→ J.W6 (disjoint, RECORD):** the ENG-3/ENG-4 hot-path allocation + ENG-7 duplication
  MEASURE-FIRST items are the perf-frontier's, not J.W1's — J.W1 closes CORRECTNESS/coherence
  seams, J.W6 owns the measured perf riders (`audit/engine-core.md §Transposition 2/3`,
  `J.md §WAVE MAP` Terminations).
- **OUT / sibling (do NOT touch):** the SEAM-4 value.js `rotate`/`rotateX|Y|Z` shorthand-normalization
  fix → value.js next-slice HANDOFF (the kf-side byte witness is S4's; `J.md §OUT band`); the value.js
  empty-input contract ITSELF → value.js (consumed PUBLISHED 0.11.2, kf pins the consume-edge only,
  S4/SEAM-2); the value.js next-slice VJ-1..9 + the parse-that packrat → sibling-owned, ride the
  next re-pin (`audit/parsing-units-valuejs-seam.md` SEAM-9, `PROGRESS.md §4c`).

## §Design decisions (trade-offs RESOLVED)

- **ONE serialization authority, the old path DELETED — RESOLVED.** I.W0 S2 transposed the
  AGGREGATE serializer to the declared template but left the sibling per-card path on the
  DOM-resolving `frame.flatVars` surface (ENG-1). The cure is the SAME transposition applied to
  the missed seam — the per-card serializer sources `parsedVars`, and the pre-transposition path
  DIES in the same motion. NOT a second path kept behind a flag; ONE authority. The serializer
  never needed a live DOM (`audit/engine-core.md` ENG-1, the elegance/coherence fold).
- **The createFrame fallback is the honest no-op default, not a swallow — RESOLVED.** A
  transform-free `Animation` is a legitimate numeric/CSS-var animation; it compiles to a total
  no-op transform (mirroring the I.W0 S3 `NOOP_TRANSFORM` field-default), not a `try/catch`-swallowed
  TypeError. The hard-error-naming variant is RECORDED for IMPL as a product choice, but the
  default is benign so a transform-free public-`Animation` consumer never crashes
  (`audit/engine-core.md` ENG-2; the I.W0 benign-default decision verbatim).
- **The selector guard is total + named, not heuristic — RESOLVED.** "Conforming" = a percentage
  0%–100% OR the keyword `from`/`to`, and NOTHING else; everything else throws the typed
  `AnimationOptionError` BEFORE `parseCSSValueUnit`. The boundary is named so the guard is total,
  not a "looks-invalid" sniff that re-opens the SEAM-1 gap on the next unseen token
  (`audit/parsing-units-valuejs-seam.md` SEAM-1).
- **The value.js half of SEAM-4 is OUT; the kf byte-witness lands NOW — RESOLVED.** The
  `rotate`/`rotateX|Y|Z` shorthand expansion is a value.js flatten/parse decision (the next-slice
  HANDOFF); the kf-side AUTHORED-vs-SERIALIZED byte assertion lands in J.W1 as the falsifiable
  WITNESS (born-RED today, flips on the value.js fix). The vacuous `midpointSig` pass is the
  gate-ORACLE failure mode reproduced — the byte check is the cure (`audit/parsing-units-valuejs-seam.md`
  SEAM-4, `J.md §OUT band`).
- **The unit pyramid is righted at the jsdom tier — RESOLVED.** The I.W0 S2 / I.W1 bind-proof
  fixes had a browser gate as their ONLY oracle (the inverted pyramid); J.W1 adds the cheap jsdom
  companions (each born-RED via git-stash) so an `npm test` regression bites without browser infra
  — the pyramid base the I waves skipped (`audit/tests-bench.md §(b)`).
- **The dead source dies in the engine-totality motion, not perpetually deferred — RESOLVED.**
  LS-9/10/11 are no-legacy items the marker-grep cannot see; the legacy-sweep homes them in J.W1's
  light-cleanup band (`audit/legacy-sweep.md §"Fold Candidates"`). They are demo-side companions to
  the engine-totality pass — deleted, not annotated (`J.md §MANDATE` no-legacy; P-invariant-28 no
  perpetual punt).
- **∥ parallel, NOT on the critical path — RESOLVED.** J.W1 runs file-disjoint from J.W2
  (demo-behavior) and J.W6 (measurements) after J.W0 lands the primitive (`J.md §WAVE MAP DAG`,
  `waves/README.md §3`). Nothing downstream waits on the engine totality; W4's appearance legs gate
  on W7a, the input-modality legs on W0+W3 — neither on W1. The engine is un-fenced under the
  permanent engine rule (T2 resolved — `src/animation` is the kf PRODUCT, the fence is against
  SIBLING forks only, `J.md §MANDATE`).
