# ROOT CAUSE — rc-parse-crash (B1 / B5): the `"......"` empty-value parse crash

ROOT-CAUSE AGENT `[rc-parse-crash]` · Tranche I · 2026-06-08
Inputs: `investigate/b1-group-play.md`, `b5-keyframes-editor.md`,
`b10-console-census.md`, `b11-playback-correctness.md`, the console captures
(`b1-*.console.json`), and the SOURCE (`format.ts`, `engine.ts`, `group.ts`,
value.js `normalize.ts` / `interpolate.ts` / `parsing/utils.ts`,
`KeyframesStringControls.vue`, `useAnimationGroupPlayback.ts`,
`useCubeAnimations.ts`).
Confirmation probe (run, this tranche): `investigate/probes/rc-parse-crash-seam.mjs`.

---

## 0. Verdict (one sentence)

**`"......"` is the unambiguous fingerprint of `parseCSSValueUnit("")` — an EMPTY
STRING fed to value.js's CSS parser — produced when the engine's computed-value
resolution reads back an UNSET CSS custom property (`getComputedStyle(target)
.getPropertyValue("--rotationX") === ""`) and hands that empty string straight to
the parser with NO empty-input guard; H.W0's guard sat at the keyframe-SELECTOR
compile seam and never touched this computed-VALUE resolution seam, two structurally
distinct call paths that share only the value.js parser at the bottom.**

This single empty-string defect surfaces as **B1** (uncaught `pageerror`, group
playback path), **B5** (caught `console.warn` + the mis-attributing
`/* timing-function: custom — no CSS twin */` placeholder, serialization path),
and the **per-frame storm** during scene-switch suspend/render. B1 ALSO carries a
**second, independent** fault on home (`this.transform is not a function`) covered
in §6.

---

## 1. The confirmed root cause (file:line)

### 1a. THE PRODUCER — value.js, no empty-input guard (the seam)

The crash bottoms out in TWO value.js lines, both of which feed an unguarded
string to the parser:

- **`@mkbabb/value.js · src/units/normalize.ts:213-217`** — `getComputedValue`,
  the `var` branch:
  ```ts
  if (value.unit === "var") {
      const computed = getComputedStyle(target).getPropertyValue(value.value);
      return parseCSSValueUnit(computed);          // computed === "" when the var is UNSET
  }
  ```
  `getPropertyValue("--rotationX")` returns the **empty string** when the custom
  property is not set on `target`. That `""` is passed **directly** to
  `parseCSSValueUnit` — no `=== ""` check, no fallback, no typed skip.

- **`@mkbabb/value.js · src/parsing/utils.ts:68-80`** — `tryParse`, the throw
  site (reached by `parseCSSValueUnit`):
  ```ts
  const state = parser.parseState(input);          // input === ""
  if (state.isError) {
      const offset = state.offset;                 // 0
      const context = input.slice(Math.max(0, offset-8), Math.min(input.length, offset+8)); // ""
      throw new Error(`Parse error at offset ${offset}: "...${context}..."`);
                                                     // → `Parse error at offset 0: "......"`
  }
  ```
  The six dots are `"..." + ""(empty slice) + "..."`. **The "......" signature IS
  "empty input."**

### 1b. THE FINGERPRINT — proven, this tranche

`probes/rc-parse-crash-seam.mjs` (run against the published value.js kf consumes):

| input | thrown message |
|---|---|
| `""` | `Parse error at offset 0: "......"` ← **the bug, bare 6 dots** |
| `"var(--rotationX)"` | `Parse error at offset 0: "...var(--ro..."` |
| `"matrix3d(1,0,0,0)"` | `Parse error at offset 0: "...matrix3d..."` |
| `"45deg"` | OK (no throw) |
| `"  "` | `Parse error at offset 2: "...  ..."` (offset 2, not bare) |

Only `""` yields the bare `"......"` (`isBareDots === true`). Every non-empty input
embeds its own text in the dots; even whitespace shifts the offset and shows the
spaces. **This is a content-addressed proof that the failing input is exactly the
empty string** — not a `var()` literal, not a `matrix3d()` literal, but the
EMPTY READ-BACK of an unset var. (This refines b11's matrix3d hypothesis: the
`matrix3d`/`rotate3d` literals throw a DIFFERENT, text-embedding message, so they
are NOT the `"......"` producer; the var read-back is.)

### 1c. THE TWO ENGINE PATHS that reach the producer (kf side)

Both run the SAME `interpFrames → processFrame → lerpValue → (computed dispatch)
→ getComputedValue` spine; they differ only in what calls `at()`/the draw loop.

The cube **Rotations** child is the carrier (`demo/cube/useCubeAnimations.ts:57-63`):
```ts
"100%": { transform: { rotateX: new ValueUnit("--rotationX", "var"), … } }
```
The `from` stop is plain `rotateX: "0deg"`, so the `var(--rotationX)` is the 100%
endpoint, and `--rotationX` is **never defined on the cube element** — so every
resolution reads `""`.

- **Spine (shared):** `engine.ts:779` `lerpValue(eased, iv)` → value.js
  `lerpValue` dispatch → the computed branch → `lerpComputedValue`
  (`value.js · interpolate.ts:26`) → `getComputedValue(start|stop, target)`
  (`interpolate.ts:50-51`) → **`normalize.ts:217` `parseCSSValueUnit("")`** → throw.

- **Path A — SERIALIZATION (B5, caught).** `KeyframesStringControls.vue:96`
  `CSSKeyframesToString(animation, …)` → `format.ts:148`
  `const vars = animation.at(progress, false)` → `engine.ts:636` `at()` →
  `engine.ts:707` `interpFrames` → `engine.ts:779` `processFrame`/`lerpValue` →
  the spine → **throw**. Caught at `KeyframesStringControls.vue:100-110`,
  downgraded to `console.warn` + the placeholder. **Fires on FIRST LOAD** of any
  scene whose surface-set includes `keyframes` (cube/amiga/square) because the
  pane is force-mounted and `onMounted` self-serializes (`KeyframesStringControls
  .vue:236`).

- **Path B — PLAYBACK (B1, uncaught).** rainbow group-play → cube group draw loop
  → `group.ts:373` `this.transform(groupedValues, t)` is fed by per-child
  `interpFrames(t, false, entry.values)` → the spine → **throw escapes
  `interpFrames` on tick 1** → uncaught `pageerror` → the group draw loop dies →
  `.cube` stays `transform: none` (b11: 1/10 distinct transforms, the matrix never
  paints). Also re-fires on every **scene-switch suspend/render** (the storm:
  `useSceneMachine` `captureActive → adapter.suspend → group.pause → render`).

So **one empty-string defect, two engine entry points, three console faces** (the
uncaught `pageerror`, the `console.warn`+placeholder, and value.js's own
`console.error` "Err x 0 / ^^^" frame which prints alongside).

---

## 2. WHY the gates missed it (the blind-spot, precisely)

### 2a. H.W0's guard was at the WRONG seam

H.W0 added the empty-input belt at the keyframe-**SELECTOR** compile seam
(`src/animation/frame-compiler.ts`, the `addFrame`-time `start.trim() === ""`
throw — a malformed `@keyframes` STOP like a blank `""` selector). That correctly
killed the ROUTE-STORM blank-selector reproduction H.W0 targeted.

But the live `"......"` is a blank **VALUE** resolved at **interpolation/
serialization** time, not a blank selector at compile time. The two paths:

| | H.W0 guarded path | the live B1/B5 path |
|---|---|---|
| seam | keyframe **selector** | computed **value** read-back |
| when | `addFrame` / compile | `interpFrames` / `at` / draw-loop (runtime) |
| file | `frame-compiler.ts` (kf) | value.js `normalize.ts:217` (the parser handoff) |
| empty source | author types a blank `""` stop | `getComputedStyle` returns `""` for an unset var |

They share ONLY value.js's `parseCSSValueUnit` at the very bottom — and H.W0
guarded the kf-side selector input, never the value.js-side value read-back. The
guard and the bug never touch.

### 2b. The CONSOLE-CLEAN gate certified the wrong surface

`proof:demo-console-clean` asserts a clean console on the **HOME LOAD** only. On
home: (a) the keyframes pane is not mounted with a `var()`-bearing animation whose
target lacks the var, so Path A is never provoked; (b) the group is empty, so Path
B's spine is never entered (instead home throws the *other* B1 fault, §6, which
the gate also missed because it never **clicks** the rainbow play). The crash is
**interaction-AND-state-conditioned**: click play → navigate home→cube → mount the
keyframes editor for a `var()` animation whose `--rotationX` is unset. A load-time,
source-shape, home-only gate structurally cannot see it.

### 2c. The catch-block HID Path A from `pageerror` scanners

Path A is swallowed by `KeyframesStringControls.vue:100` `try/catch` into a
`console.warn`. Any gate that watched only `pageerror` (uncaught) — not
`console.warn`/`console.error` — saw nothing on the serialization path even when
the editor was mounted. The placeholder text further **mis-attributes** the
failure to "a custom timing-function with no CSS twin," which is false here (the
Rotations easing is CSS-twinnable) — actively misdirecting triage toward easing
(the B5 → B4 false trail).

---

## 3. The IDIOMATIC GESTALT fix DIRECTION (the seam, the transposition)

Three layered moves, from the true seam outward. NO `try/catch` swallow, NO
demo-side `--rotationX` band-aid as the primary cure (the LIBRARY must be robust
to an unset var regardless — inv-16: `src/animation` is the product, value.js is a
published sibling we may transpose).

### FIX-1 (PRIMARY, the seam) — typed empty-input handoff at the value.js parser boundary

**Locus:** `@mkbabb/value.js · src/units/normalize.ts:213-217` (the `var` read-back),
with the contract codified at the parser boundary `parsing/utils.ts`.

An **empty/whitespace computed read-back is a legitimate transient**, not a parse
error — an unset CSS custom property (`var(--x)` with no `--x` defined, or a
not-yet-wired var during the mount-before-style window) computes to `""`. The
gestalt: **never hand `""` to `parseCSSValueUnit`.** When `getComputedStyle(...)
.getPropertyValue(name)` is empty/whitespace, `getComputedValue` resolves to the
unit's **declared fallback** if present (`var(--x, <fallback>)` — value.js already
parses the fallback into the `var` unit), else returns a typed **identity/empty
ValueUnit** that the computed lerp treats as "no contribution" (the var
contributes its start endpoint, i.e. the transform is simply unchanged on that
axis). This is the value.js-side HALF of the "typed-empty handoff" the b10 hand-off
named — the parser's empty-input contract becomes: *empty in → typed-empty out,
never a thrown `"......"`*.

This is the H.W0 selector guard's **TWIN at the value seam** — same fail-explicit
philosophy (an empty input is a NAMED condition, not a cryptic crash), applied at
the parser handoff instead of the compiler. It heals **B1 (interp)** and **B5
(serialize)** at ONE source, because both share `getComputedValue`.

> If the missing var is to be treated as a hard author error rather than a benign
> transient (a product decision for the waves), the SAME seam throws a **typed
> `AnimationOptionError` NAMING the missing custom property** (e.g. `--rotationX`)
> instead of the untyped `"......"`. Either way the cryptic raw-parser throw dies
> at this seam. The default should be the benign-transient resolution (a `var()`
> mounting before its property is the common, recoverable case).

### FIX-2 (the serializer architecture transposition) — serialize from the TEMPLATE, not from `at()`

**Locus:** `src/animation/format.ts:124-184` (`CSSKeyframesToString`).

`CSSKeyframesToString` sources its CSS text by **sampling the live interpolation**
— `animation.at(progress, false)` (`format.ts:148`) — which runs the full
DOM-resolving pipeline. **A serializer must not need a live, fully-styled DOM to
emit CSS text.** A `var(--rotationX)` / `matrix3d(…)` is ALREADY valid CSS — it
should round-trip **verbatim** from the declared `templateFrame` values via
`unflattenObjectToString` (the path `CSSKeyframeToString`/`format.ts:112-122`
already uses for `frame.flatVars`), NEVER be DOM-resolved to a number and
re-serialized. This is the gestalt move: the editor's purpose is to show the
**authored** CSS, which is also exactly what re-parses cleanly. It removes Path A's
dependency on `getComputedValue` entirely (defense in depth: even if FIX-1 regressed,
the serializer would no longer touch the empty-read-back seam).

### FIX-3 (kill the mis-attributing placeholder) — honest fail-explicit floor

**Locus:** `KeyframesStringControls.vue:100-110`.

The catch hard-codes `/* timing-function: custom — no CSS twin (see console) */`
for **every** serializer throw — conflating the empty-value parse failure with the
ONE narrow `serializeEasing` custom-closure case (`format.ts:36`). With FIX-1+FIX-2
the empty-value throw is gone, so this catch should fire ONLY for a genuine
no-CSS-twin easing and emit a placeholder that names the **actual** condition (or,
preferably, becomes unreachable for the value path). Remove the misdirection.

### Gate transposition (the headline, for the wave authoring)

The permanent cure for the blind-spot: a **runtime/interaction** console gate that,
per scene, **clicks the rainbow group-play** AND **hover-expands the morphing dock
and switches scenes**, and asserts across the whole battery: (a) ZERO `pageerror`,
(b) ZERO `console.error`/`console.warn` lines matching the value.js parse-error
shape (`/Parse error at offset|"\.{6}"|Err x/`), AND (c) a real **behavioral**
assertion that the target actually moves (a `.cube` transform delta), so a future
silent-no-op cannot pass. Source-shape + home-load is forbidden as the sole gate.

---

## 4. Scope note for the waves (what this root cause does and does not own)

- **Owns:** the `"......"` empty-value parse crash on BOTH the interp (B1) and
  serialize (B5) paths — ONE engine/seam defect (FIX-1), the serializer-from-`at()`
  architecture defect (FIX-2), the mis-attributing placeholder (FIX-3).
- **Adjacent, separate root cause (do NOT fold here):** the home rainbow-play
  `this.transform is not a function` (§6 below) is a DISTINCT `AnimationGroup`
  defect (an empty group's unseeded `transform` field), surfaced by the SAME button
  but on a different code path. It needs its own fix locus (`group.ts:38/123` +
  the empty-group play short-circuit). Flagged for a sibling root-cause / the same
  wave, NOT cured by FIX-1/2/3.
- **B5's bare-`"cubic-bezier"` token** (b10 §B5, the controls re-mount
  `resolveEasingOption` throw) is a related-but-separate option-seam fail-explicit
  gap (a custom easing must round-trip to a `cubic-bezier()` literal / typed
  `Easing`, never the bare keyword). Adjacent; flag for the option-seam fix, not
  this seam.

---

## 5. Confidence

HIGH. The producer is proven by content-addressed fingerprint (`""` is the unique
input yielding the bare `"......"`, this-tranche probe), the read-back source is
read directly in value.js source (`normalize.ts:213-217`, no guard), the carrier
animation is read in demo source (`useCubeAnimations.ts:57-63`, `var(--rotationX)`
with no `--rotationX` ever defined on the cube), and both engine entry paths are
traced line-by-line through `format.ts`/`engine.ts`/`group.ts` with the live console
stacks (b1/b5/b10/b11) matching the source spine 1:1.

---

## 6. APPENDIX — the co-resident B1 fault (`this.transform is not a function`)

NOT this root cause's seam, recorded so the wave does not lose it.

`AnimationGroup.transform` is declared with a definite-assignment assertion that
LIES: **`group.ts:38` `transform!: TransformFunction<V>`** is only conditionally
assigned in the constructor — **`group.ts:123-124`**:
```ts
if (this.transform == null && animation.frames[0] != null) {
    this.transform = animation.frames[0].transform;
}
```
An **empty group** (`new AnimationGroup()` with no inputs) — which home binds ON
PURPOSE (`useSceneMachineApp.ts:60-63`, `App.vue:228`: the cube-backdrop drives no
playback) — never runs the loop body, so `this.transform` stays `undefined`. The
constructor comment (`group.ts:118-122`) PROMISES "resolved lazily on the first
`transformFramesGrouped` call" — **there is no such lazy resolution**;
`transformFramesGrouped` calls it unguarded at **`group.ts:373` `this.transform(
groupedValues as V, t)`**. Clicking the rainbow play (`useAnimationGroupPlayback
.ts` → `animationGroup.play()` on the empty home group, BEFORE the home→cube
navigate intercept at `onPlayStateChange`) → `_frame` → `transformFramesGrouped` →
**`TypeError: this.transform is not a function`**, draw loop dead.

Idiomatic direction (for the wave, not this doc's seam): default
`AnimationGroup.transform` to a real no-op (or `transformTargetsStyle` over the
group's own targets, mirroring `Animation.transform`) assigned at the FIELD, not
conditionally — a childless/pre-`parse` group renders a harmless empty composite
instead of throwing — AND short-circuit `play()`/`toggleAnimationGroup` when
`Object.keys(animations).length === 0` so the home gesture's navigate intercept
owns the click (invert the current order where the crashing `play()` runs first).

---

## 7. Artifact index

- `investigate/probes/rc-parse-crash-seam.mjs` — this tranche's fingerprint proof
  (`""` ⇒ bare `"......"`; literals embed text).
- `investigate/b1-group-play.md` + `b1-*.console.json` — the live repro + producer matrix.
- `investigate/b5-keyframes-editor.md` — Path A (serialize) on first load.
- `investigate/b10-console-census.md` — the master ledger (per route × phase).
- `investigate/b11-playback-correctness.md` — Path B (the cube matrix never paints).
- SOURCE: `src/animation/format.ts:124-184`, `engine.ts:632-785`,
  `group.ts:38/118-124/373`; value.js `units/normalize.ts:208-265`,
  `units/interpolate.ts:26-72`, `parsing/utils.ts:68-80`;
  `KeyframesStringControls.vue:94-113`, `useCubeAnimations.ts:45-66`.
