# Harden lane `hd-live-crashes` — DEEP re-verify of the two H.W0 born-RED crashes

**Charge.** Live re-verify (Playwright :5173, kf 4.1.0 + Tranche G on branch
`tranche-h-dev`) the two H.W0 crashes: the `serializeEasing` THROW on Cube load
(H-A1) and the `"......"` lerp parse-error (H-A2). Confirm/refute the born-RED
claims with exact console output, and sweep ALL routes for OTHER uncaught errors
the audit missed.

**Method.** Playwright MCP. Full-route hash cycle with live `error`/
`unhandledrejection`/`console.error` hooks; deterministic engine repro through
the app's live module graph (`/@fs/.../src/animation/{engine,format,utils,
animations}.ts` + `node_modules/@mkbabb/value.js/dist/value.js`); source read of
`format.ts`, `engine.ts`, `utils.ts`, `useCubeAnimations.ts`,
`useAmigaAnimations.ts`, `AnimatedText.vue`, `EditorStartScreen.vue`,
`KeyframesStringControls.vue`. Installed deps verified: value.js **0.11.1**,
parse-that **0.9.0**, glass-ui **3.4.0**, kf **4.1.0**.

**Verdict in one line.** The crashes are **half-real and badly mislocated**. The
`serializeEasing` THROW is LIVE and real — but its source is the **amiga scene's
`CSSCubicBezier(...)` callable** (`useAmigaAnimations.ts:31,74`) plus **12
library presets in `animations.ts`**, NOT the Cube `Rotations`/`Matrix` presets
H.W0 names; the Cube presets serialize **CLEAN** (born-GREEN). The `"......"`
lerp crash is **NOT reproducible on the current branch** — `AnimatedText` is now
CSS-only and the engine's `interpFrames` no longer routes a bare string leaf
into `_lerp`; the born-RED claim for that crash is **refuted**. H.W0 as written
will send the implementer to the wrong scene, wrong files, and wrong line
numbers, and **two of its four hard-gate clauses ((c) and (d)) are born-GREEN,
not born-RED** — they pass vacuously today and prove nothing.

---

## FINDINGS

### F1 [BLOCKER] — H-A1's root cause is mislocated: the Cube presets do NOT throw; **amiga + 12 `animations.ts` presets** do

**Doc location.** `H.W0.md §Provenance` (H-A1), `§The state` (":H-A1 reproduces
4× on EVERY Cube load"), `§Scope S1` ("the Cube preset animations… `Rotations`/
`Matrix`… constructed with a faithful `Easing.css` twin"), `§Hard gate clause
(d)` (`CSSKeyframesToString(cubeRotationsAnimation)`).

**Defect + evidence.** H.W0 asserts the Cube `Rotations`/`Matrix` presets "carry
programmatic-closure timing functions with no `.css` twin." They do not:

- `demo/cube/useCubeAnimations.ts` builds `Matrix`/`Rotations` from
  `getStoredAnimationOptions(...)` — there is **no closure literal** at the cube
  call site. The resolved easing is the default `{ fn: easeInOutCubic }`
  (`src/animation/constants.ts:178`), whose `fn` IS a value.js registry entry,
  so `serializeEasing` (`format.ts:30-44`) reverse-looks-it-up and returns
  `ease-in-out-cubic` — **no throw**.
- LIVE: a cold `#/cube` load settled to `#/cube?anim=Rotations`, easing readout
  shows `ease-in-out`, and the `error`+`unhandledrejection` hooks captured **0
  throws** over a 2.5s settle. A full 10-route hash cycle (home→easing→spring→
  cube→home→motion-path→starting-style→sequence→square→**amiga**) captured **0
  throws until amiga**, then **2** `AnimationOptionError`.
- Deterministic engine repro through the app's module graph:
  `CSSKeyframesToString(cubeRotations)` → **`OK (born-GREEN) len=390`**;
  `CSSKeyframesToString(amigaLike built with CSSCubicBezier(0.2,0.65,0.6,1))` →
  **THROW `AnimationOptionError: …custom TimingFunction has no CSS …`**.
- The REAL source is value.js `CSSCubicBezier(...)` returning a **bare
  `function` with no `.css` twin** (`cb_type:"function"`, `cb_css:
  "IS-FUNCTION-no-css"`), passed directly as `timingFunction` at
  `demo/amiga/useAmigaAnimations.ts:31` and `:74`. Surveying `animations.ts`,
  **12 presets throw on serialize**: `accordionExpand, bounce,
  notificationBounce, rotateIn, rotateScale, slideIn, slideInLeft,
  slideInRight, slideOutLeft, slideOutRight, typewriter, typingCursor` — every
  one that uses `CSSCubicBezier(...)` (`animations.ts:97,145,162,…`).

**Why it matters.** H.W0's S1 ("give the Cube presets `.css` twins") fixes
**nothing** — the Cube presets already serialize. The crash will still ship from
amiga and from any consumer of a `CSSCubicBezier` preset. The gestalt fix belongs
at the **easing-normalization seam**: `getTimingFunction` (`utils.ts:148-167`)
returns the bare `CSSCubicBezier(...)` callable for a `cubic-bezier()` literal
**without attaching `.css`** — yet `setTimingFunction('cubic-bezier(…)')` (the
string path) DOES twin it (live: `fromStr_tf_css: "cubic-bezier(0.2,0.65,0.6,1)"`
→ serialize OK). The asymmetry is the bug: a `CSSCubicBezier`-shaped callable
must carry its `.css`, OR amiga must pass the **string** `"cubic-bezier(…)"`
(which already twins correctly).

**Concrete doc edit.**
1. Rewrite `§The state` and `§Scope S1`: replace "the Cube presets `Rotations`/
   `Matrix`" with "the **amiga scene** (`useAmigaAnimations.ts:31,74`, two
   `CSSCubicBezier(0.2,0.65,0.6,1)` callables passed directly as
   `timingFunction`) and the **12 `animations.ts` presets** built with
   `CSSCubicBezier(...)`." State the verified live trigger: the throw fires when
   the **Keyframes-string editor panel is mounted** over an animation whose
   easing is a bare `cubic-bezier` closure — observed on the amiga route.
2. Re-author S1 as a TWO-PART fix: (a) demo-side — amiga passes the
   `"cubic-bezier(0.2, 0.65, 0.6, 1)"` **string** (the path that already twins),
   removing the direct-callable mistake; (b) engine/value.js seam — either
   `getTimingFunction` (`utils.ts:166`) attaches `{ fn, css: "cubic-bezier(…)" }`
   when it resolves a bezier, OR value.js's `CSSCubicBezier` returns the twinned
   `Easing` (a **value.js-HANDOFF**, since the curve→CSS knowledge lives there).
   The cube-preset edit is DELETED — it is a no-op.

---

### F2 [BLOCKER] — Hard-gate clause (d) is **born-GREEN**, not born-RED: it cannot bite

**Doc location.** `H.W0.md §Hard gate clause (d)` + `§The spine bar`
("Clauses (a)+(d) RED on the live tree TODAY… GREEN on S1's `.css` twins";
"`proof:roundtrip-easing` unit lock (d) — `CSSKeyframesToString(cubeRotations
Animation)` resolves… reds TODAY").

**Defect + evidence.** Clause (d) asserts `CSSKeyframesToString(cubeRotations
Animation)` "reds TODAY — the closure easing has no `.css` twin." Live repro:
`CSSKeyframesToString(cubeRotations)` → **`OK len=390`, no throw**. The cube
Rotations easing is the registry `easeInOutCubic`, serialized as
`ease-in-out-cubic`. The clause therefore **passes vacuously on the live tree
right now** — it is a green-on-day-zero gate that proves nothing and would stay
green whether or not S1 lands. This violates the Mandate's "MUST bite /
born-RED-today" gate discipline the wave's own §spine-bar invokes.

**Concrete doc edit.** Re-target clause (d) to a preset that ACTUALLY throws:
`CSSKeyframesToString(amigaSphereRotation)` (the `CSSCubicBezier` animation at
`useAmigaAnimations.ts:31`) OR `CSSKeyframesToString(animations.bounce())`. State
the bite as the verified live throw (`AnimationOptionError` from
`serializeEasing`, `format.ts:36`). The "strip the `.css` twin → the lock reds"
falsification clause must reference the bezier-twin seam from F1, not a cube
preset.

---

### F3 [BLOCKER] — H-A2's `"......"` lerp crash is **NOT reproducible** on the current branch; clauses (b)+(c) are born-GREEN

**Doc location.** `H.W0.md §Provenance` (H-A2), `§The state` ("H-A2 reproduces
on home↔scene transition… `Error: Parse error at offset 0: "......"`"), `§Scope
S3` (the discrete-leaf classification), `§Hard gate clauses (b)` and `(c)`.

**Defect + evidence.** The audit's H-A2 model — "a `CSSKeyframesAnimation` is
being fed the hero ellipsis text as a non-interpolable string leaf… value.js's
`_lerp` tries to parse `"......"`" — is **stale**. On `tranche-h-dev`:

- `demo/@/components/custom/AnimatedText.vue` is **100% CSS** (post-F.W16): it
  splits `text` into word spans and animates via `@keyframes dotFade`/`liftDown`
  bound through CSS `animation:` (lines 72-121). The ellipsis `"..."` from
  `EditorStartScreen.vue:49` reaches `AnimatedText` as `:text` and is rendered
  as DOM text — it **never enters a `CSSKeyframesAnimation` value position.** A
  tree-wide source grep finds **no** `content:`/`label:`/`text:` string leaf fed
  into `fromVars`/`fromKeyframes`.
- LIVE: the full 10-route hash cycle captured **zero** `"......"` Parse errors.
  Steady state on the default landing (`#/easing?anim=Easing+Preview`) =
  **0 console errors**.
- Deterministic engine repro: `CSSKeyframesAnimation.fromVars([{label:'...'},
  {label:'...'}]).interpFrames(t)` for t∈{0,.25,.5,.75,1} → **OK, no-throw**;
  `{content:'...'}→{content:'...'}` → **OK, no-throw**; `{label:'a'}→{label:'b'}`
  → **OK, no-throw**. The engine `interpFrames` path (`engine.ts:657`→
  `processFrame :769`→`lerpValue :779`) no longer routes a bare string leaf into
  value.js `_lerp` on this branch.

The ONLY surviving fragment: value.js's parser **still throws** on bare dots in
isolation — `parseCSSValueUnit('...')` → `Parse error at offset 0: "........."`.
So the defect is latent **inside value.js**, but there is **no live demo path
that reaches it.** The `"......"` lines I captured at session start were from
chaotic startup navigation churn and a stale prior session (port `:5174`, the
audit's own server — see F5), not a current steady-state reproduction.

**Why it matters.** Clause (b) ("home→scene transition = 0 console errors…
greens ONLY on S3") and clause (c) ("`{label:a}→{label:b}` … reds TODAY — the
leaf reaches value.js `_lerp` and throws") are **both born-GREEN**: clause (c)'s
exact corpus row already returns no-throw live; clause (b) is already 0-errors
across every transition. Neither bites. S3 (the engine discrete-leaf guard) is
defensible as **belt-and-suspenders hardening**, but it is NOT fixing a live
crash, and the wave must not claim it does.

**Concrete doc edit.**
1. Re-classify H-A2 from "SHIP-in-H live crash" to "**latent value.js parser
   hardening** (no live demo repro on the current branch — `AnimatedText` is
   CSS-only post-F.W16; `interpFrames` no longer routes bare strings to
   `_lerp`)." State the residual precisely: `parseCSSValueUnit('...')` still
   throws inside value.js — a **value.js-HANDOFF** is the real home of the deeper
   fix.
2. Demote clauses (b)+(c) or re-author their bite. Clause (c) must be born-RED
   to be the load-bearing consume-signal the §Folds claim it is — but it is
   born-GREEN. Either (i) cite the value.js seam directly (`parseCSSValueUnit`
   born-RED, the kf corpus row born-GREEN as the consume-witness that stays
   green when value.js publishes), and re-label S3 as hardening not crash-fix;
   or (ii) drop the born-RED framing. Remove the §spine-bar claim that (b)+(c)
   "RED on the live tree TODAY."

---

### F4 [HIGH] — Stale file/line citations throughout H.W0 will misdirect the implementer

**Doc location.** `H.W0.md §Provenance`, `§The state`, `§Scope S2`+`S3` (the
`format.ts` / `engine.ts` / `KeyframesStringControls.vue` line anchors).

**Defect + evidence (current-branch line numbers).**
- `serializeEasing` throw is at **`format.ts:36`** (fn at `:30`); H.W0 cites
  `format.ts:24` (that line is JSDoc).
- The serializer call is `CSSKeyframesToString` whose `serializeEasing` calls
  are at **`format.ts:95, 143, 155`**; H.W0 cites `format.ts:82` (which is now
  `CSSKeyframesToStrings`, the plural list builder — wrong function).
- The readout consumer: the throwing invocation is **`KeyframesStringControls
  .vue:222-224`** (an `onMounted` calling `updateCSSAnimationKeyframesString
  FromAnimation` at `:94-101`, which calls `CSSKeyframesToString` at `:95`).
  H.W0 cites `:46`, `:94`, and a "post-flush watcher at `:140`." `:94` is right
  for the readout fn; `:46` is an import; `:140` is `onEditorChange`, NOT the
  readout trigger. The trigger is `onMounted`, not a watcher.
- Engine interp: `interpFrames` at **`engine.ts:657`**, `processFrame` at
  **`:769`**, `lerpValue(eased, iv)` at **`:779`**. H.W0 cites `engine.ts:516`,
  `:576`, `:778` — those are the **running-build source-map lines** (the
  `.vite`-transformed positions in the captured stack), not the on-disk TS. An
  implementer opening the cited lines lands in the wrong place.

**Concrete doc edit.** Re-anchor every `file:line` in H.W0 to the on-disk TS:
`format.ts:30/36/95/143/155`, `KeyframesStringControls.vue:94/222-224`,
`engine.ts:657/769/779`. Add a note that the audit's `engine.ts:516,576` were
build-mapped lines, to prevent the same drift recurring.

---

### F5 [MED] — The "4× per Cube load" count is an artifact of a polluted multi-session capture; the real per-load count is **0 on a clean load**

**Doc location.** `H.W0.md §The state` ("H-A1 reproduces 4× on EVERY Cube
load… the console throws four times, every load") and `§Hard gate clause (a)`
("reds TODAY — exactly **4** `AnimationOptionError` throws on every Cube load").

**Defect + evidence.** A clean cold `#/cube` load throws **0** times (F1). The
"4×" figure traces to a `console_messages({all:true})` dump that conflated THREE
sessions: (i) the current `:5173` session, (ii) a stale `:5174` session (the
audit's own dev server — both ports appear in the same dump), and (iii) **188
`TypeError: Failed to execute 'getComputedStyle' on 'Window'`** entries whose
stack is `at eval (eval at … evaluate(:302:30))` — i.e. **Playwright
`browser_evaluate` injection artifacts from a prior probing session**, not demo
defects. The dump's own header read "Errors: 2" for the live page while
returning 201 historical entries. The exact `4` likely reflects a prior state
where the Keyframes panel auto-mounted on cube; on the current branch that panel
is lazy and does not auto-mount, so cube load is clean.

**Concrete doc edit.** In clause (a), drop "exactly 4 on every Cube load."
Re-state the bite as: "a fresh load of a route whose mounted Keyframes-string
editor targets a `cubic-bezier`-closure animation (amiga, or any `CSSCubicBezier`
preset) asserts 0 console errors; born-RED because the readout `onMounted`
(`KeyframesStringControls.vue:224`) throws `AnimationOptionError` —
verified live: 2 `unhandledrejection` on the route-cycle into `#/amiga`." Note
for whoever writes `proof:demo-console-clean`: scope console capture to the
**single navigation** (never `{all:true}`) and strip any `eval`-stacked
`getComputedStyle` TypeError as test-harness noise.

---

### F6 [MED] — S2 (the readout `try/catch` floor) is the only part of H-A1 that is correctly placed — but it is mis-prioritized

**Doc location.** `H.W0.md §Scope S2`, `§Design decisions` ("The `.css` twin is
the fix, not a readout `try/catch`").

**Defect + evidence.** Given F1 (the throw source is the bezier-twin seam, not a
cube preset table) and the live fact that the readout `onMounted`
(`KeyframesStringControls.vue:224`) has **no `try/catch`** (the only `try` is at
`:173`, the editor *apply* path — confirmed), S2's "render a
`/* timing-function: custom */` placeholder" guard is the one fix that actually
neutralizes the LIVE throw regardless of where the closure originates (amiga,
preset, or a user typing `cubic-bezier()` in the editor). H.W0 frames S2 as the
fallback "floor" subordinate to S1 — but since S1 (cube-preset twins) is a no-op
(F1), the wave's primary fix evaporates and S2 becomes load-bearing by default,
unacknowledged.

**Concrete doc edit.** Promote S2 to a co-equal primary: the readout must never
throw into `onMounted`/a watcher (it is a display surface). Pair it with the
F1 normalization fix (twin every `cubic-bezier` easing) so the placeholder is
only reached by a genuinely non-CSS-representable closure (e.g. a hand-written
`(t)=>t*t`, which DOES legitimately throw — verified). Keep the "no silent
`linear` degrade" constraint.

---

## ROUTE / CONSOLE SWEEP (all routes, the deliverable's "OTHER errors" charge)

Driven live; per-navigation capture (NOT `{all:true}`):

| Route | Steady-state console errors | Notes |
|-------|-----------------------------|-------|
| `#/` (home) | 0 | clean |
| `#/easing` (default landing) | 0 | `?anim=Easing+Preview`, stable |
| `#/spring` | 0 | clean |
| `#/cube` | 0 | easing `ease-in-out`; **refutes 4×** |
| `#/motion-path` | 0 | clean |
| `#/starting-style` | 0 | clean |
| `#/sequence` | 0 | clean |
| `#/square` | 0 | clean |
| `#/amiga` (bare load) | 0 | clean on bare load |
| `#/amiga` (Keyframes panel mounted over the `CSSCubicBezier` anim) | **2 `AnimationOptionError`** | the ONLY live throw family |

**No NEW uncaught error families** beyond the `serializeEasing` throw were found.
The `"......"` family did not reproduce (F3). The 188 `getComputedStyle`
TypeErrors in the initial `{all:true}` dump are Playwright eval-injection
artifacts, not demo errors (F5).

**Secondary observation (route churn, NOT a crash — flag for H.W1, not H.W0).**
On startup the URL transiently bounces (`/cube` → `/cube#/easing` →
`?anim=Rotations` → settles at `#/easing?anim=Easing+Preview`) before
stabilizing; steady state is stable (12 samples identical). This is the H.W1
"route storm" surface, not an H.W0 crash — recorded so the harden does not
conflate it with the engine throw. It produced warnings, not errors.

---

## NET ASSESSMENT FOR H.W0

- **The wave targets a real defect family (un-serializable `cubic-bezier`
  closures → `serializeEasing` THROW) but binds it to the wrong scene, wrong
  files, wrong fix, and a born-GREEN gate.** S1 (cube-preset twins) is a no-op;
  the live throw is amiga + 12 `animations.ts` presets, rooted in the
  `getTimingFunction`/`CSSCubicBezier` non-twinning asymmetry (value.js-HANDOFF
  candidate). [F1, F2]
- **The H-A2 `"......"` crash is not live on `tranche-h-dev`** (CSS-only
  `AnimatedText` + bare-string-safe `interpFrames`); S3 is hardening, not a
  crash-fix, and clauses (b)+(c) are born-GREEN. [F3]
- **Two of four hard-gate clauses do not bite as written** ((c),(d) born-GREEN;
  (a)'s "4×" is a capture artifact). [F2, F3, F5]
- **All file:line anchors are stale** (build-mapped, not on-disk). [F4]

H.W0 needs a substantive re-author of §The-state, §Scope (S1/S3), and §Hard-gate
before it is implementable. The Mandate's "MUST bite / born-RED-today" discipline
is currently violated by the wave's own gate set.
