# Tranche F · SOTA audit — WAAPI + platform-animation frontier (2026)

**Lane id:** `r-waapi-platform-2026`. **Branch:** `tranche-e-impl` (D+E landed/closed).
**Mandate:** research/audit ONLY — zero source changes; this doc is the only artefact.
**inv-16:** keyframes.js findings disposition-tagged; value.js needs → `value.js-HANDOFF`
(propose, never write). **inv ε:** every keyframes claim cites `file:line`; every SOTA
claim is dated/grounded.

**The lane's one-line job (from the brief):** *post-E the engine does dense WAAPI
sampling + an additive native-scroll bridge — what MORE can it delegate or adopt,
feature-detected? Diff `docs/tranches/E/audit/sota/r-waapi.md`.*

---

## 0. The diff that reframes this lane — E's `r-waapi.md` is mostly LANDED

The E forward-SOTA lane (`E/audit/sota/r-waapi.md`) and its synthesis
(`E/audit/sota/d-modern-platform.md`) named seven WAAPI items. **Re-grounding against
the live `tranche-e-impl` tree, four of the five actionable ones SHIPPED in E.W9** —
so this lane does NOT re-litigate them; it confirms-landed and moves the frontier
forward. The honest starting picture:

| E `r-waapi.md` item | E disposition | **Post-E live state (re-grounded)** |
|---|---|---|
| **W1** `commitStyles()`+cancel on finish (the headline) | FOLD-E | **LANDED** — `waapi.ts:329-354`: `await Promise.all(wa.finished)` → per-handle `wa.commitStyles()` (guarded `restPosition==="final"` + `typeof===function`) → `wa.cancel()`. Diagnostic comment cites MDN. |
| **W2** color lift via WAAPI oklab-default | GAP-NAMED + vj-HANDOFF | **STILL OPEN** — `waapi.ts:153-157` still rejects `unit==="color"`; the emit is still `unflattenObjectToString` (legacy syntax). Owned by the value.js handoff (`valuejs-sota-handoff.md` B1/B2 + `cssColorInterpKeyword`). **No new finding — confirm carried.** |
| **W3** native `ScrollTimeline`/`ViewTimeline` bind | GAP-NAMED (not Baseline) | **LANDED additively** — `waapi.ts:366-429` `attachNativeScrollTimeline`, `timeline.ts:207-260` `createNativeTimeline` (feature-detected `globalThis.ScrollTimeline`/`ViewTimeline`, ARCH-kill preserved). Tested `platform-adopt.test.ts:328-444`. |
| **W4** `@property`/`var()` rejection is correct | ALREADY-SOTA | **CONFIRMED + docstring rewritten** — `waapi.ts:19-22` now states the deliberate "registered customs don't composite anyway" rationale. **Still ALREADY-SOTA.** |
| **W5** `getComputedTiming`/`getKeyframes` introspection | BOOK | **STILL UNUSED** — grep confirms zero `getComputedTiming`/`getKeyframes`/`effect.` reads. Carried (see §4 P5). |
| **W6** `composite:"add"` for group additive layers | BOOK (Baseline split) | **STILL JS-side** — `group.ts:248-268` sums numeric `ValueUnit`s in JS; `toWAAPIOptions` never sets `composite`. Carried + sharpened (see §4 P4). |
| **W7** easing gate + shadow-tick lifecycle | ALREADY-SOTA | **CONFIRMED** — `waapi.ts:99-139` gate + `:316-327` shadow tick intact. **Leave it.** |

Plus E.W9 shipped **dense sub-segment WAAPI sampling** (`waapi.ts:166-231`,
`WAAPI_SUBSEGMENT_STOPS=8`), **@property registration** (`platform-adopt.test.ts:102`),
and **live reduced-motion** (`reduced-motion.ts` + `engine.ts:836` `_snapToReducedMotion`).

**So the E WAAPI surface is now genuinely mature.** This lane's real value is therefore
**not** "more of r-waapi" — it is the platform-animation frontier r-waapi did **not**
cover, which the 2026 Baseline calendar has since moved: the **discrete-animation
surface** (`@starting-style` / `transition-behavior: allow-discrete`, Baseline
2024-08-06) and the **intrinsic-size animation gap** (`interpolate-size` / `calc-size()`)
— the single most-requested animation a keyframes library structurally cannot do.
Those, plus a re-measure of the three E withholds and one new correctness nuance in the
freshly-landed W1, are the findings below.

**Disposition legend:** SHIP-in-F · MEASURE-FIRST · BOOK · KILL · RECORD ·
value.js-HANDOFF · ALREADY-SOTA.

---

## 1. Baseline ground truth (2026) — every disposition rides these

Cited from the `modern-web-guidance` skill (retrieved Jun 2026) so no disposition rests
on stale memory.

- **`@starting-style` + `transition-behavior: allow-discrete`** — **Baseline newly
  available 2024-08-06** (Chrome 117 Sep 2023, Edge 117, Firefox 129 Aug 2024, Safari
  17.5 May 2024). All three engines. Feature-detect:
  `CSS.supports('transition-behavior', 'allow-discrete')`. (`animate-element-entry-exit`.)
- **`interpolate-size` + `calc-size()`** — **limited availability — Chrome/Edge 129 (Sep
  2024) ONLY; unsupported in Firefox and Safari.** Progressive enhancement only; unsupported
  browsers do an instant size jump. Feature-detect:
  `@supports (inline-size: calc-size(auto, size + 0px))`. Key constraint: cannot animate
  keyword↔keyword; one end must be a fixed length. (`animate-to-intrinsic-sizes`,
  `calculate-with-intrinsic-sizes`.)
- **`commitStyles()` / `persist()`** — Baseline widely available since July 2020.
- **`KeyframeEffect.composite`** ("replace"/"add"/"accumulate") — Baseline widely
  available; **`iterationComposite`** — NOT Baseline (limited). (E `r-waapi.md` W6, dated.)
- **`getComputedTiming()` / `getKeyframes()`** — Baseline widely available.
- **Native `ScrollTimeline`/`ViewTimeline` JS constructors** — NOT Baseline (Chromium-only;
  Firefox/Safari absent for the *JS constructors* as of audit). The engine's `createNativeTimeline`
  feature-detects them — correct.
- **Composited (off-main-thread) properties** — `transform`, `opacity`, `filter`,
  `backdrop-filter` only. `background-color`/`color` run on the **main thread** even under
  WAAPI (E `r-css-color` F5, carried). This bounds every "delegate for thread-offload" claim.

---

## 2. The headline finding — the discrete-animation surface (`@starting-style` / `transition-behavior`) is **structurally absent**, and that is **correct for the engine** · RECORD (ALREADY-SOTA by layering) + one BOOK

**Claim.** keyframes.js has **zero** handling of CSS discrete-property animation —
`display`, `content-visibility`, `@starting-style`, `transition-behavior: allow-discrete`.
Grep is clean: `grep -rn "display\|starting-style\|transition-behavior\|allow-discrete"
src/animation/ src/parsing/` → **0 hits** (verified). The engine animates *values over a
keyframe timeline*; it does not model the **entry/exit (DOM-presence) lifecycle** that
`@starting-style` + `allow-discrete` exist to solve.

**Is this a gap? No — and the reasoning matters (the honest negative result this lane
owes).** `@starting-style`/`transition-behavior` are **declarative CSS-transition**
constructs for the *first-render* and *`display:none` toggle* moments — the two moments a
CSS *transition* (not a keyframe animation) historically could not catch. They are owned by
the **CSS transitions engine inside the browser**, triggered by class/attribute/DOM-presence
changes, and there is **no `Element.animate()` / WAAPI surface for them** — you cannot
"delegate to" `@starting-style`; you author it in a stylesheet. keyframes.js is a
*keyframe* engine (`@keyframes` → `AnimationFrame[]` → rAF/WAAPI sampling). The entry/exit
lifecycle is a **different animation primitive** (transitions, not keyframes), and it lives
in the **presentation layer** — exactly the inv-16 boundary `E/r-scroll-view-transitions.md`
S-2 drew for View Transitions ("the VT/scroll-CSS layer is a DOM-presentation concern,
glass-ui's domain; the progress-physics layer is keyframes.js's domain").

So an "add `@starting-style` support to the engine" finding would be a **layering
violation**. The engine correctly ships zero discrete-transition surface.

**Where it IS actionable — the demo, and even there it is BOOK, not SHIP.** The demo
(`demo/`) is the one place an entry/exit transition could appear (e.g. a panel/toast/menu
mount). But per `E/r-scroll-view-transitions.md` S-2 + `MEMORY.feedback_glass_ui_*`, the
demo's presentation primitives (View Transitions, scroll reveals, and by the same logic
discrete entry/exit) are **glass-ui's domain** — the demo *consumes* glass-ui idioms, it
does not hand-roll `@starting-style` CSS. The correct disposition is to **verify glass-ui
exports a discrete-entry/exit idiom** (analogous to its `startViewTransition`/
`useStaggerReveal`) and consume it if a demo surface needs one; if glass-ui lacks it, that
is a **glass-ui adoption ask (book OUT)**, never a demo patch.

**Disposition.**
- Engine: **RECORD / ALREADY-SOTA** — discrete-transition absence is correct by layering;
  do not build. Re-open trigger: a real keyframes-direct consumer asks the *engine* to drive
  a `display`-toggle keyframe (it cannot — `display` is discrete and WAAPI-ineligible; the
  honest answer is "use a CSS transition + `@starting-style`," not "extend the engine").
- Demo: **BOOK** (glass-ui-owned) — if a demo mount/unmount wants a polished entry/exit,
  consume a glass-ui discrete-entry idiom; absent one, file a glass-ui ask. Low value (the
  demo is a fixed full-viewport editor, `EditorShell.vue` `h-dvh overflow-hidden` per
  `E/r-scroll-view-transitions.md` S-4-context — few mount/unmount surfaces).

**Isomorphism note.** N/A — nothing built; this finding *prevents* a layering-violating
build and documents *why* the engine's silence here is correct.

---

## 3. The intrinsic-size animation gap — `height: 0 → auto` is the most-requested animation a keyframes library cannot do; the native primitive (`interpolate-size`/`calc-size()`) is **not Baseline** · GAP-NAMED (engine) + value.js-HANDOFF (the `calc-size()` parser)

**The gap, grounded.** keyframes.js cannot animate a property *to* an intrinsic-size
keyword (`auto`, `max-content`, `fit-content`, `min-content`). Confirmed in code: the
interpolation dispatch is numeric `lerp` / color / computed-unit DOM-resolution (per
`CLAUDE.md` "Interpolation dispatch"); there is **no branch that measures an element's
intrinsic size** and lerps a fixed length toward it. Grep:
`grep -rn "calc-size\|interpolate-size\|intrinsic\|max-content\|fit-content"
src/animation/ src/parsing/` → **0 relevant hits** (verified). An author who writes
`@keyframes expand { from { height: 0 } to { height: auto } }` gets a frame-pairing where
`auto` is not a numeric `ValueUnit` — it cannot interpolate, and the engine has no
intrinsic-size measurement fallback. This is the canonical "animate accordion/menu/card to
its natural height" use case, and it is the **single most-requested animation a keyframes
library structurally cannot do** (the `valuejs-sota-handoff.md` E7 cross-repo note calls it
exactly that: *"THE native primitive for the most-requested animation the library can't do
(height→auto)"*).

**The native primitive and its Baseline reality.** `interpolate-size: allow-keywords` +
`calc-size()` let the browser natively interpolate fixed↔intrinsic. **But they are
limited-availability — Chrome/Edge 129 only; NO Firefox, NO Safari** (§1). So they are a
*progressive enhancement*, never a Baseline drop-in. Two consequences:

1. **The native path is feature-detected-PE, not a default.** Any engine adoption must gate
   `@supports (inline-size: calc-size(auto, size + 0px))` and keep a fallback for the ~2/3
   of engines without it.
2. **The fallback is a JS intrinsic-size MEASURE** — measure the target's natural size
   (clone-measure or `getBoundingClientRect` after a transient `height:auto` write, the
   same forced-layout idiom value.js's computed-unit resolver already uses,
   `normalize.ts` round-trip), freeze it as a px endpoint at frame-prep, and lerp toward
   it. This is a **new engine interpolation branch** with its own eligibility (DOM target,
   layout-readable), its own resize/reflow contract, and a WAAPI-ineligibility note
   (intrinsic-size is layout-dependent → it stays on the rAF path, exactly as the existing
   computed-unit set does, `waapi.ts:29-39`).

**The two-repo split (the inv-16 line).**
- **value.js owns the `calc-size()` PARSER** — already named in `valuejs-sota-handoff.md`
  **E7** (re-scoped BOOK→FOLD): a bounded `createCalcParser` extension parsing
  `calc-size(<basis>, <calc-sum>)` to a structured node. Parsing `calc-size()` ≠ requiring
  browser support — value.js can round-trip the syntax today. **This lane re-affirms E7
  and adds the engine-side acceptance criterion**: the parsed node must expose the *basis
  keyword* (`auto`/`max-content`/…) and the `<calc-sum>` separately so the engine's measure
  fallback can resolve the basis to px and apply the calc delta.
- **keyframes.js owns the ENGINE intrinsic-size interpolation path** — GAP-NAMED in
  `valuejs-sota-handoff.md` §3 ("engine intrinsic-size animation path — height→auto via
  native `interpolate-size` or JS-measure — GAP-NAMED, its own wave"). This lane **promotes
  it from a parenthetical to a first-class GAP-NAMED finding with a concrete shape**: a new
  `IntrinsicSizeValue` interpolation branch + a `measureIntrinsicSize(target, prop)` leaf +
  a feature-detected native `interpolate-size` fast lane.

**Why GAP-NAMED, not SHIP-in-F.** (a) The native primitive is not Baseline — the win is a
PE fast lane over a non-trivial JS-measure fallback, not a Baseline adoption. (b) It is a
genuinely new interpolation branch (measure + resize contract + WAAPI-ineligibility), its
own wave, gated on the value.js E7 parser landing first. (c) It must be measure-first: the
JS-measure fallback forces layout, so it carries an INP cost the design must bound (measure
once at frame-prep, not per frame).

**Disposition.**
- Engine: **GAP-NAMED** — the intrinsic-size interpolation branch (native PE + JS-measure
  fallback). Own wave; gated on value.js E7. The highest-*user-value* gap in the lane.
- Parser: **value.js-HANDOFF** — re-affirm `valuejs-sota-handoff.md` **E7** (`calc-size()`
  parser, FOLD) + the engine-side acceptance criterion (expose basis keyword + calc-sum
  separately). value.js owner formalizes; this lane writes no value.js.

**Isomorphism note.** Additive new capability — today the animation is impossible (no
fallback exists), so any path is strictly additive. The native and JS-measure lanes must
produce the same final px (the JS measure IS what the native engine computes for `auto`);
an equivalence test must assert the JS-measure endpoint equals the resolved native size
within sub-pixel tolerance.

---

## 4. Re-measuring E's three WAAPI withholds (W1 / W6 / W5) — diff + verdict

### P1 — W1's commit-on-finish LANDED, with **one carried-forward nuance**: the `forwards`-but-not-`final` cascade case · MEASURE-FIRST (small) / RECORD

**Landed (confirm).** `waapi.ts:329-354` now does what E `r-waapi.md` W1 prescribed:
`await Promise.all(wa.finished)` → for each handle, *if* `restPosition === "final"` and
`commitStyles` exists, `wa.commitStyles()`, then unconditionally `wa.cancel()` (in a
try/catch). The `finally` clears `_waAnimations` and stops the shadow tick. The cancel-on-
halt path (`engine.ts:797-807` `_cancelWAAPI`) stays distinct. **This is the W1 fix, and it
is correct for the common case** — a `fill:forwards` animation no longer leaks as an
indefinitely-filling compositor animation; both paths converge to "rest frame inline,
zero residual animations." Good.

**The nuance the landed code is RIGHT to handle but worth locking.** `restPosition` derives
from `fillMode` (`engine.ts:520-525`): `forwards`/`both` → `"final"`; `none`/`backwards` →
`"initial"`. The commit guard `restPosition === "final"` (`waapi.ts:345`) means: for a
`fillMode: forwards`/`both` finish, `commitStyles()` bakes the final computed style inline,
then cancel. For a `fillMode: none`/`backwards` finish, **no `commitStyles`** — just cancel
— and the shared `onEnd → paintRest` (`engine.ts:670`) writes the *logical* rest
(`fillBackwards()` → initial) as inline style. The code comment (`waapi.ts:338-341`) states
this contract precisely: *"the shared `onEnd → paintRest` writes the LOGICAL rest for every
fill mode; `commitStyles` only guards the forwards case against the finish-before-paint
race."* **This is correct.** The single-writer concern E `r-waapi.md` W1 raised ("pick one
rest-writer") is resolved by *layering*: `commitStyles` only fires when it agrees with
`paintRest` (both → final), so there is no fight.

**What is worth a MEASURE-FIRST lock (not a fix).** There is **no test asserting the
finish-commit seam** — `test/waapi-lifecycle.test.ts` exists, but the platform-adopt suite's
WAAPI clauses (`platform-adopt.test.ts:243-322`) test *dense sampling*, not the
*commit-then-cancel-on-finish* lifecycle. A biting test would: stub `Element.animate` to
return a handle with spied `commitStyles`/`cancel` and a resolvable `finished`; play a
`fillMode:forwards` eligible animation; assert `commitStyles` called once then `cancel`
once, **and** `getAnimations()`-equivalent (the stub's residual set) is empty after finish;
and the `fillMode:none` case asserts `commitStyles` is NOT called but `cancel` IS. This
locks the isomorphism r-waapi W1 demanded against a future regression.

**Disposition — MEASURE-FIRST** (author the finish-commit lock test; the *code* is correct)
+ **RECORD** (the `restPosition`-guarded single-writer contract is a deliberate, correct
seam — note it so a future tranche doesn't "simplify" the guard away).

**Isomorphism note.** The code already restores isomorphism (both paths → rest inline,
zero residual). The test is the missing *proof*, not a behaviour change.

### P2 — W6 `composite:"add"` for AnimationGroup additive layers: the **semantic mismatch** is the real blocker, not Baseline · BOOK (sharpens the E W6 caveat)

**Live state.** `group.ts:248-268` (`case "add"`) sums numeric `ValueUnit` values
component-wise *in JS* (`existing.value = existing.value + incoming.value`); `toWAAPIOptions`
(`waapi.ts:247-285`) never sets `composite`. So group-additive blending is entirely main-
thread, never delegated.

**The sharpening (this lane's delta over E W6).** E `r-waapi.md` W6 pinned the Baseline
split (`composite:"add"` Baseline; `iterationComposite` not). But the **deeper blocker is
semantic**, and the live code proves it: native WAAPI `composite:"add"` composes **transform
lists by concatenation** (`translateX(10px)` add `translateX(5px)` → the list
`translateX(10px) translateX(5px)`, applied as matrix composition), whereas `group.ts`'s
`add` blend does **scalar summation of the parsed numeric value** (`10 + 5 = 15`). For a
single-component scalar property (`opacity`, a single-axis `translateX` after the engine's
own flattening) concatenation == summation, so delegation is safe. For a **multi-component
or multi-transform** layer the two diverge — native concatenation is matrix composition,
JS summation is component addition. So a native-`composite:"add"` lift is viable **only for
the scalar subset**, and the eligibility predicate would need to assert single-component-
per-key — a real, non-trivial gate the group does not have today.

**Why BOOK, not SHIP.** (a) The win is thread-offload only for *composited* properties
(transform/opacity) — the exact subset where concatenation==summation is *also* the subset
where it is safe, which is a nice coincidence but still needs the per-key single-component
gate. (b) `AnimationGroup` is the orchestration tier shipped in E.W10 as new public API;
adding a WAAPI delegation lane to it is a sizeable wave, not a fold. (c) `proof:zero-alloc`
(group composite) is a standing gate — a delegation path must preserve it.

**Disposition — BOOK** (group-level native-additive delegation; carries the E W6 Baseline
split + this lane's semantic-mismatch gate as the *real* precondition).

**Isomorphism note.** Native `composite:"add"` is isomorphic to the JS `add` blend **only**
on single-component-per-key layers (opacity, single-axis transform). The eligibility gate
must enforce that, or delegation silently changes pixels on multi-transform layers.

### P3 — W5 `getComputedTiming()` / `getKeyframes()` introspection: still unused, still optional · BOOK (carried)

**Live state.** Zero reads (grep confirmed §0). The shadow tick (`waapi.ts:316-327`) runs a
fully parallel JS clock via `animation.advanceTo(now)` and never reconciles against the
compositor's canonical `wa.effect.getComputedTiming()`.

**Verdict unchanged from E W5.** The shadow tick is already correct (E `a-kf-waapi.md` F6,
re-affirmed). `getComputedTiming()` reconciliation is a *refinement* with its own cross-
browser timing-model risk; `getKeyframes()` (browser-filled offsets) is a test/DX
round-trip affordance. Neither is a delegation lift. **One small note this lane adds:** with
dense sub-segment sampling now landed (`waapi.ts:166-231` emits ~8 interior stops/segment),
`getKeyframes()` would be a *cheap, high-signal* test affordance — assert the browser-
normalized offsets of the densified emit round-trip to the `toWAAPIKeyframes` output. That
is a test/DX nicety, still BOOK.

**Disposition — BOOK** (DX/diagnostics; the lifecycle is SOTA without it). Carried.

### P4 — `persist()` is the unused complement to the now-landed `commitStyles()` — and correctly stays unused · ALREADY-SOTA (by reasoning)

**Note.** E `r-waapi.md` paired `commitStyles()` with `persist()`. The landed W1 uses
`commitStyles()` + `cancel()` (`waapi.ts:348-350`) — the *bake-and-drop* pattern. It does
NOT use `persist()` (the *keep-the-filling-animation-alive* opt-out). **This is correct:**
`persist()` is the opposite intent (retain a filling compositor animation), which is exactly
the leak W1 set out to eliminate. The engine's terminal contract is "rest inline, zero
residual" — `persist()` would *reintroduce* the residual. So `persist()` staying unused is
the right call, not an omission. RECORD so a future tranche doesn't "add `persist()` for
symmetry."

**Disposition — ALREADY-SOTA** (the absence of `persist()` is correct; the landed
commit-then-cancel is the SOTA pattern).

---

## 5. Items confirmed ALREADY-SOTA post-E — manufacture no work

Stated plainly so Tranche F does not churn correct code:

- **The easing-faithfulness gate** (`waapi.ts:99-139`): uniform-TF requirement, CSS-twin-
  across-segments reject, no-faithful-CSS-twin reject (would run bare-linear). Canonical
  modern WAAPI discipline. E W7 + `a-kf-waapi.md` F5. **Leave it.**
- **The shadow-tick lifecycle** (`waapi.ts:316-327`, `engine.ts:786-789`): `wa.finished` +
  AbortError-swallow + parallel JS state machine for event parity. Mature delegation
  harness. E W7 + `a-kf-waapi.md` F6. **Leave it.**
- **The `var()`/`calc()` + computed-unit rejection** (`waapi.ts:29-43,141-152`): the
  docstring now states the *deliberate* "registered customs don't composite anyway"
  rationale (`waapi.ts:19-22`), closing the E W4 doc nit. The WAAPI-ineligible unit set
  correctly spans `%` + the full viewport/container families. **Correct by reasoning.**
- **Dense sub-segment sampling** (`waapi.ts:166-231`, `WAAPI_SUBSEGMENT_STOPS=8`): samples
  the true rAF curve at interior offsets so the compositor's piecewise-linear fill tracks
  the JS curve, not just endpoints. Equivalence-tested `platform-adopt.test.ts:271-310`.
  Strictly fidelity-improving, bounded. **SOTA — leave it.**
- **The additive native scroll bridge** (`waapi.ts:366-429`, `timeline.ts:207-260`): the
  ARCH-kill holds (JS sampler is the general fallback), native is a feature-detected
  fast lane, the smoothing-reconciliation caveat is documented and tested
  (`platform-adopt.test.ts:398-422`). This is E.W9 delivering E `r-waapi.md` W3 **correctly**.
  **Leave it.**
- **`@property` registration** (`platform-adopt.test.ts:102-166`): the parsed registry is
  now `CSS.registerProperty()`'d, feature-detected, `InvalidModificationError`-swallowed.
  E.W9 S1, delivering `d-modern-platform.md` D-LIB-1. **Leave it.**
- **Live reduced-motion** (`engine.ts:836-844` `_snapToReducedMotion` + `reduced-motion.ts`):
  a mid-flight OS flip snaps a running animation to rest; the WAAPI lane cancels its handles
  before settling. E.W9 S2, delivering D-LIB-3. **Leave it.**

---

## 6. value.js hand-off (inv-16) — re-affirm, do not re-write

This lane adds **no new** value.js item. It **re-affirms** two already in
`valuejs-sota-handoff.md`, with one sharpened acceptance criterion:

- **E7 — `calc-size()` parser (FOLD).** Re-affirmed as the parser half of §3's intrinsic-
  size gap. **Added acceptance criterion:** the parsed node must expose the *basis keyword*
  and the `<calc-sum>` separately so the engine's measure-fallback can resolve the basis to
  px and apply the calc delta. (The handoff already scopes the parse; this is the consumer's
  shape requirement.)
- **B1/B2 + `cssColorInterpKeyword` (Wave B).** Re-affirmed as the blocker for the still-
  open WAAPI color lift (E `r-waapi.md` W2, `waapi.ts:153-157` still rejects color). No new
  detail — carried verbatim; the non-legacy-syntax emit criterion in `valuejs-sota-handoff.md`
  §3 stands.

value.js owner formalizes both; this lane writes only this doc.

---

## 7. Dispositions roll-up

| # | Finding | File:line | Disposition |
|---|---|---|---|
| **§2** | Discrete-animation surface (`@starting-style`/`transition-behavior`) structurally absent — correct by layering | `src/animation/*` (0 hits) | **RECORD / ALREADY-SOTA** (engine) + **BOOK** (demo, glass-ui-owned) |
| **§3** | Intrinsic-size animation gap (`height:0→auto`) — most-requested missing animation; native primitive not Baseline | engine interp dispatch (no branch); `valuejs-sota-handoff.md` E7/§3 | **GAP-NAMED** (engine, own wave) + **value.js-HANDOFF** (E7 + acceptance criterion) |
| **P1** | W1 commit-on-finish LANDED; finish-commit seam untested | `waapi.ts:329-354`; `engine.ts:520-525,670` | **MEASURE-FIRST** (lock test) + **RECORD** (correct single-writer guard) |
| **P2** | `composite:"add"` group delegation — semantic mismatch (concat vs sum) is the real gate, beyond the Baseline split | `group.ts:248-268`; `waapi.ts:247-285` | **BOOK** (sharpens E W6) |
| **P3** | `getComputedTiming`/`getKeyframes` still unused; `getKeyframes` now a cheap densify-round-trip test affordance | `waapi.ts:316-327` (0 reads) | **BOOK** (carried) |
| **P4** | `persist()` correctly unused (would reintroduce the leak W1 killed) | `waapi.ts:348-350` | **ALREADY-SOTA** |
| **W2 (carried)** | Color WAAPI lift still open, owned by value.js handoff | `waapi.ts:153-157` | **value.js-HANDOFF** (re-affirm) |
| **§5** | Easing gate · shadow tick · var/calc reject · dense sampling · native scroll bridge · @property · live PRM | `waapi.ts:99-139,316-327,29-43,166-231,366-429`; `engine.ts:836` | **ALREADY-SOTA** (leave) |

**Net.** The E WAAPI lane is **mostly landed** — W1/W3/W4/W7 + dense sampling + @property +
live PRM all shipped in E.W9, and re-grounding confirms each is correct (§5). This lane's
genuine forward-SOTA delta is two findings the 2026 Baseline calendar surfaced that
r-waapi did not cover: the **discrete-animation surface** (correct to leave to the
presentation layer — an honest negative result, §2) and the **intrinsic-size animation
gap** (the highest user-value gap — a real engine wave gated on the value.js `calc-size()`
parser, §3). The three E withholds re-measure cleanly: W1 is correct but wants a lock test
(P1), W6's real blocker is semantic not Baseline (P2), W5 stays an optional BOOK (P3). **No
manufactured work; the post-E WAAPI engine is exemplary.**
