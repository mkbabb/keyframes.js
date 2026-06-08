# I.W0 — ENGINE EMPTY-INPUT + SERIALIZATION CORRECTNESS (Band 0 · LEADS · the demo must not throw — for real this time)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-I (CRITICAL; the
  `"......"` parse crash + the `this.transform is not a function` group crash are LIVE,
  reproducible, uncaught engine exceptions in the BUILT `dist/gh-pages/` — they poison every
  other wave's "clean console" measurement and are the literal first thing the user hit) ·
  **Scope (engine, inv-16 UNFENCED):** value.js `units/normalize.ts` (the `var` read-back
  seam) + `src/animation/format.ts` (`CSSKeyframesToString` — serialize-from-template
  transposition) + `src/animation/group.ts` (`AnimationGroup.transform` field default +
  the empty-group `play()` short-circuit) + `demo/@/components/custom/animation-controls/keyframes/KeyframesStringControls.vue`
  (kill the mis-attributing placeholder) + the option seam for the bare-`"cubic-bezier"`
  token (B5 secondary). · **DAG-deps:** **LEADS the tranche** — the `"......"` storm floods
  the shared console on home/cube load AND every scene-switch, so no downstream
  console-oracle gate is readable until it is dead (`rc-parse-crash §2`, `b10-console-census
  §1`). Folds B5. The co-resident `this.transform` crash (a DISTINCT `AnimationGroup` defect)
  ships in the SAME wave, same button.

## §Provenance (the folded root causes + investigation)

- `rootcause-rc-parse-crash.md` — the PRIMARY: `"......"` is the content-addressed
  fingerprint of `parseCSSValueUnit("")` (the unique input yielding the bare 6 dots; every
  non-empty input embeds its own text — proven this tranche by `probes/rc-parse-crash-seam.mjs`).
  The producer is value.js `units/normalize.ts:213-217` (the `var` branch hands an unset
  `getPropertyValue("--rotationX") === ""` straight to the parser, NO empty-input guard);
  the throw site is `parsing/utils.ts:68-80` (`tryParse`). The carrier is the cube
  **Rotations** child (`demo/cube/useCubeAnimations.ts:57-63`, `rotateX: new
  ValueUnit("--rotationX", "var")` whose `--rotationX` is NEVER defined on the cube element,
  so every resolution reads `""`).
- `rootcause-rc-parse-crash.md §6` (APPENDIX) — the CO-RESIDENT fault:
  `AnimationGroup.transform` declared with a LYING definite-assignment assertion
  (`group.ts:38 transform!: TransformFunction<V>`), only conditionally assigned
  (`group.ts:123-124`, from `animation.frames[0].transform`). An empty home group (bound on
  purpose at `useSceneMachineApp.ts:60-63`) never runs the loop body, so `transform` stays
  `undefined`; the constructor comment PROMISES a lazy fallback that DOES NOT EXIST;
  `transformFramesGrouped` calls it unguarded at `group.ts:373`.
- `b10-console-census.md` — the master ledger: E1 `this.transform is not a function`
  (home › play), E2/E4 `Parse error at offset 0: "......"` (cube › play + storms on
  switch-away), E3 `[KeyframesString] could not serialize …` (cube › load, the serialize
  face), E5 the amiga WebGL warns (out of scope — I.W3). The crash is isolated to the
  AnimationGroup / cube engine path, NOT the raw-rAF scenes.
- `b1-group-play.md`, `b5-keyframes-editor.md`, `b11-playback-correctness.md` — the live
  repros; the BUILT-dist evidence (`engine-Do5bTwuK.js`), the cube matrix never painting.
- `recap-deferred §3.A` + `recap-chronic §2` — B1 is the H.W0 INCOMPLETE fix re-opened:
  H.W0 guarded the keyframe-SELECTOR compile seam (`frame-compiler.ts`), never the computed-
  VALUE read-back seam (`normalize.ts`) — two structurally distinct paths sharing only the
  value.js parser at the bottom. inv-16 for I: `src/animation` is the product, NOT fenced.

## §The state, verified (file:line / live anchors)

- **The producer (value.js, no guard):** `units/normalize.ts:213-217` —
  `if (value.unit === "var") { const computed = getComputedStyle(target).getPropertyValue(value.value);
  return parseCSSValueUnit(computed); }`. `getPropertyValue("--rotationX")` returns `""`
  when the custom property is UNSET; that `""` is passed DIRECTLY to `parseCSSValueUnit` —
  no `=== ""` check, no fallback, no typed skip.
- **The fingerprint (proven this tranche):** `probes/rc-parse-crash-seam.mjs` —
  `""` ⇒ `Parse error at offset 0: "......"` (bare 6 dots, `isBareDots:true`);
  `"var(--rotationX)"` ⇒ `"...var(--ro..."`; `"matrix3d(...)"` ⇒ `"...matrix3d..."`;
  `"  "` ⇒ offset 2 (shows the spaces). ONLY `""` yields the bare `"......"`. The failing
  input is EXACTLY the empty string — not a `var()` literal, not a `matrix3d()` literal: the
  empty READ-BACK of an unset var. (Refines b11's matrix3d hypothesis.)
- **The two engine entry paths (kf side, shared spine):** both run `interpFrames →
  processFrame → lerpValue → (computed dispatch) → lerpComputedValue → getComputedValue →
  normalize.ts:217 parseCSSValueUnit("") → throw`.
  - **Path A — SERIALIZATION (B5, caught):** `KeyframesStringControls.vue:96
    CSSKeyframesToString → format.ts:148 animation.at(progress, false) → engine.ts:636 at()
    → interpFrames → spine → throw`. Caught at `KeyframesStringControls.vue:100-110`,
    downgraded to `console.warn` + the placeholder `/* timing-function: custom — no CSS
    twin */`. Fires on FIRST LOAD of any keyframes-pane scene (cube/amiga/square) because the
    pane self-serializes in `onMounted (:236)`.
  - **Path B — PLAYBACK (B1, uncaught):** rainbow group-play → cube group draw loop →
    `group.ts:373 this.transform(groupedValues, t)` fed by per-child `interpFrames(t, false,
    entry.values)` → spine → throw escapes `interpFrames` on tick 1 → uncaught `pageerror` →
    the group draw loop dies → `.cube` stays `transform: none` (b11: 1/10 distinct
    transforms, the matrix never paints). Re-fires on every scene-switch suspend/render (the
    storm).
- **The co-resident `this.transform` fault:** `group.ts:38 transform!: TransformFunction<V>`
  (definite-assignment LIE) + `group.ts:123-124` (conditional assign) + `group.ts:118-122`
  (constructor comment promising a lazy fallback that does not exist) + `group.ts:373`
  (unguarded call). Empty home group (`useSceneMachineApp.ts:60-63`, `App.vue:228` — the
  cube-backdrop drives no playback) → `transform === undefined` → `TypeError: this.transform
  is not a function` on the rainbow-play click, BEFORE the home→cube navigate intercept.
- **B5 secondary (the option seam):** an earlier hash-nav census surfaced
  `AnimationOptionError: Invalid value for animation option "timingFunction": "cubic-bezier"
  — unknown timing function` at `resolveEasingOption ← setTimingFunction ← new
  CSSKeyframesAnimation` — a bare `"cubic-bezier"` token (no `(…)` literal) passed where a
  callable / typed `Easing` / registry name / `cubic-bezier()` literal is required
  (`b10 §B5`, `rc-parse-crash §4`). A related-but-separate option-seam fail-explicit gap.

## §Goal

Make the demo produce **zero `pageerror` and zero parse-error console lines** across the
human battery — click the rainbow group-play on home AND cube, switch scenes, mount the
keyframes editor for a `var()`-carrying animation whose custom property is unset — AND make
the cube transform ACTUALLY PAINT (a real behavioral assertion, so a silent no-op cannot
pass). Three layered moves from the true seam outward, each at the gestalt altitude the
mandate demands (NO `try/catch` swallow as the cure, NO demo-side `--rotationX` band-aid as
the primary — the LIBRARY must be robust to an unset var regardless):

1. **The seam (FIX-1):** never hand `""` to `parseCSSValueUnit`. An empty/whitespace computed
   read-back is a LEGITIMATE transient (an unset `var()`, or a `var()` mounting before its
   property is wired), not a parse error. The value.js parser's empty-input contract becomes
   *empty in → typed-empty out, never a thrown `"......"`*.
2. **The serializer transposition (FIX-2):** `CSSKeyframesToString` serializes from the
   DECLARED template, not from a live `at()` interpolation sample. A `var()`/`matrix3d()` is
   ALREADY valid CSS — it round-trips verbatim, never DOM-resolved to a number.
3. **The group default (FIX-3):** `AnimationGroup.transform` defaults to a real no-op at the
   FIELD, not conditionally; an empty/pre-`parse` group renders a harmless empty composite;
   `play()` short-circuits on a childless group so the home gesture's navigate intercept owns
   the click.

Plus kill the mis-attributing placeholder (the honest fail-explicit floor) and the
bare-`"cubic-bezier"` option-seam round-trip (B5 secondary).

## §Scope

- **S1 — FIX-1 (PRIMARY, the seam): typed empty-input handoff at the value.js parser boundary
  (value.js-HANDOFF, PAIRED born-RED).** Locus: value.js `units/normalize.ts:213-217` (the
  `var` read-back), contract codified at `parsing/utils.ts`. When
  `getComputedStyle(...).getPropertyValue(name)` is empty/whitespace, `getComputedValue`
  resolves to the unit's DECLARED fallback if present (`var(--x, <fallback>)` — value.js
  already parses the fallback into the `var` unit), ELSE returns a typed IDENTITY/EMPTY
  ValueUnit that the computed lerp treats as "no contribution" (the var contributes its start
  endpoint — the transform is simply unchanged on that axis). This is the H.W0 selector
  guard's TWIN at the value seam — same fail-explicit philosophy (an empty input is a NAMED
  condition, not a cryptic crash), applied at the parser handoff instead of the compiler. It
  heals B1 (interp) and B5 (serialize) at ONE source (both share `getComputedValue`). **WHY:**
  inv-16 says the engine is the product; value.js is a published sibling we may transpose —
  the LIBRARY must be robust to an unset var regardless of any demo wiring. **The HANDOFF
  pairing:** the value.js half rides a value.js release; the kf-side belt (S2's
  serialize-from-template) makes B5 robust EVEN IF the value.js fix is not yet consumed.
  > Default = benign-transient resolution (a `var()` mounting before its property is the
  > common recoverable case). If the missing var is to be a HARD author error instead (a
  > product decision for IMPL), the SAME seam throws a typed `AnimationOptionError` NAMING the
  > missing custom property (e.g. `--rotationX`) — never the untyped `"......"`. Either way the
  > cryptic raw-parser throw dies at this seam.

- **S2 — FIX-2 (the serializer architecture transposition): serialize from the TEMPLATE, not
  from `at()` (KFI, the kf-side belt + the elegance move).** Locus: `src/animation/format.ts:124-184`
  (`CSSKeyframesToString`). Source the CSS text by round-tripping the DECLARED `templateFrame`
  values VERBATIM via `unflattenObjectToString` (the path `CSSKeyframeToString`/`format.ts:112-122`
  ALREADY uses for `frame.flatVars`) — NEVER DOM-resolve a `var(--rotationX)` / `matrix3d(…)`
  to a number and re-serialize. **WHY:** a serializer must not need a live, fully-styled DOM
  to emit CSS text; the editor's purpose is to show the AUTHORED CSS, which is also exactly
  what re-parses cleanly. This removes Path A's dependency on `getComputedValue` entirely
  (defense in depth: even if FIX-1 regressed, the serializer no longer touches the
  empty-read-back seam). **Respect the engine line-ceiling — and it is a GATE, not a
  hope** (H-3, C-6 watch-note, `recap-deferred §9`): `engine.ts` is **1375/1400 at I-open
  (verified — 25L headroom)**, and S2 is an `engine.ts`/`format.ts` transposition that adds
  serialize-from-template mass. If this transposition needs room, re-baseline with a NAMED,
  MEASURED, COHESIVE split (documented in the wave note, NOT silent). The HYGIENE-tier
  `proof:engine-line-ceiling` clause (§Hard gate clause (g)) reds if the transposition blows
  1400 with no landed split — the C-6 ceiling is enforced by machine, not authorial fiat.

- **S3 — FIX-3 (the group default): `AnimationGroup.transform` is total by construction
  (KFI, engine).** Locus: `group.ts:38` (the field) + `:118-124` (the dead lazy-comment +
  conditional assign) + `:373` (the unguarded call). Assign `transform` a real default at the
  FIELD — a no-op, or `transformTargetsStyle` over the group's own targets (mirroring
  `Animation.transform`) — so a childless / pre-`parse` group renders a harmless empty
  composite instead of throwing. AND short-circuit `play()`/`toggleAnimationGroup`
  (`useAnimationGroupPlayback.ts:43`) when `Object.keys(animations).length === 0`, INVERTING
  the current order where the crashing `play()` runs first — so the home gesture's navigate
  intercept (`onPlayStateChange`) owns the rainbow-play click. Delete the false lazy-resolution
  promise in the constructor comment (no-legacy). **WHY:** a definite-assignment assertion that
  lies is the defect; the field must carry a total default, not a hope.

- **S4 — kill the mis-attributing placeholder (FIX-4, the honest floor).** Locus:
  `KeyframesStringControls.vue:100-110`. The catch hard-codes `/* timing-function: custom —
  no CSS twin (see console) */` for EVERY serializer throw — conflating the empty-value parse
  failure with the ONE narrow `serializeEasing` custom-closure case (`format.ts:36`). With
  S1+S2 the empty-value throw is GONE, so this catch fires ONLY for a genuine no-CSS-twin
  easing and must emit a placeholder that names the ACTUAL condition (or, preferably, becomes
  unreachable for the value path). Remove the misdirection (it actively sent triage toward
  easing — the B5→B4 false trail). **WHY:** the floor is not the fix; the placeholder must
  never lie about WHY it fired.

- **S5 — the bare-`"cubic-bezier"` option-seam round-trip (B5 secondary).** A custom/bezier
  easing must round-trip to a `cubic-bezier()` literal / a typed `Easing`, NEVER the bare
  keyword `"cubic-bezier"` that `resolveEasingOption` rejects (`b10 §B5`). Locus: the control
  component that constructs the `CSSKeyframesAnimation` with the bare token + the
  serialize→re-parse round-trip. **WHY:** adjacent fail-explicit gap on the same editor
  surface; fixing it closes the second B5 face. (Ties to I.W2's `EasingEditor` — the easing
  value readout must emit a re-parseable literal.)

## §Hard gate (the proof:* that BITES — born-RED on `b934a08`, GREEN-on-fix · RUNTIME/INTERACTION)

**`proof:engine-no-throw-on-play`** — a Playwright session over the BUILT `dist/gh-pages/`
(the `proof-no-orphan-specular.mjs` harness: `serveDist` port 0 + chromium via
`KF_PLAYWRIGHT_DIR` + fresh context). For HOME (`#/`) AND CUBE (`#/cube`):

- **clause (a) — the rainbow group-play click is total, and the HOME-EMPTY-GROUP case is the
  named E1 witness (H-7a).** The clause drives the rainbow play on BOTH routes, but the E1
  born-RED witness is SPECIFIC: the empty HOME group, with NO animation selected. On **HOME
  (`#/`)** — where `useSceneMachineApp.ts:60-63` binds a FRESH childless `markRaw(new
  AnimationGroup())` (the `!group || isHome.value` branch — the cube backdrop drives no
  playback, so the group has zero children and `selectedAnimation` is unset) — load → CLICK
  the rainbow group-play pill (`button[aria-label*="Play animation"]`) with **no animation
  selected** (the EXACT E1 repro, `b10 §E1`/§B1: *"Clicking it with no animation selected
  throws E1"*) → assert **ZERO** `pageerror` + **ZERO** `unhandledrejection` across the click
  + the next 1.5s of frames. On **CUBE (`#/cube`)** the same click bites E2 (`"......"`
  escaping `interpFrames`). **BITE:** reds TODAY on HOME (E1 `this.transform is not a
  function`, the unseeded `group.ts:373 this.transform(...)` call on the empty home group)
  and on CUBE (E2); greens on S3 (the no-op `transform` field default + the
  empty-group `play()` short-circuit that lets the home navigate-intercept own the click) and
  S1 (the typed-empty handoff). **The HOME leg is non-substitutable:** a fix that only seeds
  cube but leaves the empty home group unguarded still REDs here, because the E1 throw lives
  in the childless-group path, NOT the cube path.
- **clause (b) — the console carries no parse-error line across the battery.** Across load +
  play + hover-expand-the-dock + switch to every other scene + switch back, assert **ZERO**
  `console.error`/`console.warn` matching `/Parse error at offset|"\.{6}"|Err x|could not
  serialize/`. **BITE:** reds TODAY on cube load (E3 the serialize warn) and on every
  switch-away (the per-frame storm); greens on S1+S2.
- **clause (c) — the cube transform ACTUALLY PAINTS (the behavioral assertion).** After
  group-play on `#/cube`, sample `getComputedStyle(.cube).transform` across N frames and
  assert it takes ≥3 DISTINCT non-`none` matrix values (the draw loop is LIVE, the matrix
  paints). **BITE:** reds TODAY — the loop dies on tick 1 so `.cube` stays `transform: none`
  (b11: 1/10 distinct transforms); greens when S1 lets the spine complete every frame. **This
  clause is the no-silent-no-op guard:** a future fix that swallows the throw but leaves the
  loop dead still REDs here.
- **clause (d) — the keyframes editor shows real round-trippable CSS, not the placeholder.**
  Mount the keyframes pane on `#/cube` (the Rotations `var()` animation) → assert the pane
  text is a parseable `@keyframes` block (it re-parses without throw) and is NOT the
  `/* timing-function: custom — no CSS twin */` string. **BITE:** reds TODAY (the placeholder
  is what renders — B5); greens on S2 (serialize-from-template) + S4 (kill the placeholder).
- **clause (e) — the bare-`"cubic-bezier"` option-seam round-trips with NO
  `AnimationOptionError` (B5 secondary, its OWN born-RED witness — H-7b).** A custom/bezier
  easing must construct AND re-mount through the controls path WITHOUT the engine's option
  seam rejecting a bare `"cubic-bezier"` keyword. Drive the construction path that throws it
  (`resolveEasingOption ← setTimingFunction ← new CSSKeyframesAnimation`, `b10 §B5`): on a
  keyframes-pane scene, select/apply a custom cubic-bezier easing, then force the controls
  RE-MOUNT (toggle the controls panel / re-select the animation — the exact `setTimingFunction`
  re-entry the editor performs on re-mount) → assert **ZERO** `AnimationOptionError` (no
  `Invalid value for animation option "timingFunction": "cubic-bezier"`) across the
  construct + serialize + re-parse round-trip. **BITE:** reds TODAY (`engine…:38` —
  `resolveEasingOption` rejects the bare token the readout emits, `b10 §B5`); greens on S5
  (the round-trip emits a `cubic-bezier()` literal / typed `Easing`, never the bare keyword).
  **This is E-B5's own witness, NOT inferred from clause (d):** clause (d) asserts the editor
  shows a re-parseable `@keyframes` block (the serialize face); clause (e) drives the OPTION
  seam (the construction face) — distinct paths, distinct repros. (Ties to I.W2 S3 — the
  `EasingEditor` readout that feeds the re-parseable literal; this clause witnesses the engine
  consume-edge that I.W2 S3 supplies.)
- **clause (f) — engine unit lock (jsdom, HYGIENE tier, supporting):** `parseCSSValueUnit("")`
  / `getComputedValue` over an unset-`var` carrier returns a typed-empty result and does NOT
  throw; `new AnimationGroup()` (childless) `.transformFramesGrouped(...)` does NOT throw.
  **BITE:** reds TODAY; greens on S1+S3. *(Labeled HYGIENE per the I.W7 precept — it supports
  the runtime clauses but does not by itself certify correctness; clauses (a)-(e) are the
  CORRECTNESS oracle.)*
- **clause (g) — `proof:engine-line-ceiling` (HYGIENE tier, the C-6 enforcement — H-3):**
  `engine.ts` ≤ **1400** lines, OR a NAMED, MEASURED, COHESIVE split landed and documented in
  the wave note (NOT a silent overflow). The S2 serialize-from-template transposition adds
  `engine.ts`/`format.ts` mass against the 1375/1400 baseline (25L headroom, verified at
  I-open); this clause makes "respect the ceiling" a GATE, not a hope. **BITE:** would red if
  the transposition pushes `engine.ts` past 1400 with no landed split. *(Labeled HYGIENE per
  the I.W7 two-tier taxonomy — a source-shape/line-count check that may NEVER substitute for a
  red runtime clause; clauses (a)-(e) remain the sole CORRECTNESS oracle. The wave's green
  depends on the runtime clauses; the line-ceiling is hygiene.)*

**The §spine bar — MUST bite.** Clauses (a)-(e) are RUNTIME/INTERACTION: they CLICK the
rainbow play (on the EMPTY HOME group with no animation selected — the named E1 witness),
SWITCH scenes via the morphing dock, READ the per-frame console + the live `.cube` transform,
and RE-MOUNT the controls on a custom-bezier easing (the option-seam round-trip) — the exact
gestures `proof:demo-console-clean` skipped (it rested on the HOME LOAD with a narrowed regex;
`rc-parse-crash §2b`). Each asserts an EXACT property (zero pageerror, zero parse-line, ≥3
distinct transforms, a re-parseable editor, zero `AnimationOptionError`). Revert any of
S1/S2/S3/S5 and the matching clause reds (load-bearing). **Two-tier taxonomy (H-4):** the
wave's GREEN depends on the RUNTIME clauses (a)-(e); clauses (f) (engine unit lock) and (g)
(line-ceiling) are HYGIENE — they corroborate but may NEVER substitute for a red runtime
clause. This is the headline-prerequisite gate: it is RED on `b934a08` with the live crashes,
the dead draw loop, and the option-seam throw, and it is a CLAUSE of the I.W7
`proof:live-session` battery (the group-play leg).

## §Folds

- **B1** (the `"......"` group-play crash) — S1 (the value.js seam, the primary) + S3 (the
  `this.transform` co-resident default). Both faces of the rainbow-play click, one wave.
- **B5** (the `/* no CSS twin */` placeholder + the option-seam `AnimationOptionError`) — S2
  (serialize-from-template) + S4 (kill the placeholder), gated by clause (d); + S5 (the
  bare-`"cubic-bezier"` round-trip), gated by its OWN born-RED clause (e) — the construction
  face (`resolveEasingOption`), distinct from the serialize face (d). One seam as B1's
  serialize face.
- **B8 "errored" half** — the dock console bleed is B1's `"......"` flooding the shared
  console while the dock is on screen (`rc-drag-perf §2d`, `b8-spring-engine-dump.json ›
  consoleErr`). NO dock change closes it; it dies when S1+S2 land. Cross-ref I.W4.
- **value.js-HANDOFF (PRIMARY for the seam, born-RED-paired):** the empty-input parse
  contract lives in value.js `normalize.ts`/`parsing/utils.ts` — define `parseCSSValueUnit("")`
  behaviour (typed-empty, not throw). It also connects to VJ-5 (the structured diagnostics
  sink would surface an empty read-back cleanly). The kf-side serialize-from-template (S2)
  lands in I regardless as the belt; clause (f)'s engine unit lock is the consume-signal that
  stays green either way. (`recap-deferred §2 VJ-5, §3.A`.)
- **RECORD (do NOT touch):** the ALREADY-SOTA engine waves — G.W17 blend, G.W18 orbital,
  G.W13 `.finished`/DrawSVG, G.W19 `adoptCompiled` — are sound and proof-green; the live
  errors are in `format.ts`/`processFrame`/`group.ts`, not those seams.

## §Design decisions (trade-offs RESOLVED)

- **The seam fix is value.js-side PRIMARY, kf-side belt — RESOLVED.** The empty-read-back
  parse belongs in value.js (where `parseCSSValueUnit` parses + throws). But inv-16 unfences
  the engine this tranche, and the user mandate forbids a workaround — so S2 (serialize-from-
  template) lands in kf NOW as the gestalt elegance move (the serializer should never have
  needed a live DOM), making B5 robust immediately, while S1 (the value.js empty-input
  contract) is the PRIMARY HANDOFF that also heals B1's interp path. Both, sequenced: the kf
  belt unblocks the editor today; the value.js seam closes the class.
- **The benign-transient default over the hard-error throw — RESOLVED (default benign).** An
  unset `var()` is the COMMON recoverable case (a var mounting before its property is wired);
  the default resolution is the declared fallback else a typed-empty "no contribution." The
  hard-error-naming-the-var variant is RECORDED for IMPL as a product choice, but the default
  must be benign so a transient mount-order race never crashes playback. Either way the
  cryptic `"......"` is dead.
- **NOT a demo-side `--rotationX` band-aid — RESOLVED.** Defining `--rotationX` on the cube
  element would silence THIS carrier but leave the library fragile for the next consumer. The
  fix is at the seam (the library must tolerate an unset var), per the mandate's no-workaround
  precept and inv-16 (`src/animation` is the product).
- **The group `transform` default is at the FIELD, not lazy — RESOLVED.** The constructor's
  promised lazy resolution does not exist (the defect). A definite-assignment assertion must
  be backed by a real assignment; the field carries a total no-op default, and the
  empty-group `play()` short-circuit inverts the order so the home navigate-intercept owns the
  click. The false lazy-comment is deleted (no-legacy).
- **The placeholder is killed, not re-worded — RESOLVED.** With S1+S2 the value path never
  throws, so the catch should be UNREACHABLE for it; if it fires (a genuine no-CSS-twin
  easing) it names the actual condition. A floor that mis-attributes is worse than no floor —
  it sent the user's triage down the B5→B4 false trail.
- **CRITICAL, leads the tranche — RESOLVED.** Two LIVE uncaught engine exceptions ship in the
  BUILT dist (reproduced in `engine-Do5bTwuK.js`), and the `"......"` storms the console on
  every switch — poisoning every downstream console-oracle gate. H put W0 first for the same
  reason; H's W0 fix was incomplete (wrong seam). This is the corrected, gestalt W0.
