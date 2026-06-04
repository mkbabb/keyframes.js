# Dock plan — adversarial hardening (the skeptic's pass)

**Lane.** HARDEN the dock plan. Re-verify every file:line claim in
`docs/tranches/B/asks/glass-ui-dock-forward.md` + `glass-ui-dock-convergence.md`
+ `docs/tranches/C/audit/dock/*.md` against LIVE source
(glass-ui `src/components/custom/dock/*`, `composables/dom/useTouchGate.ts`,
`src/styles/dock.css`, and the three consumer repos). Read-only audit, routed
outward (inv-16); WRITE confined to keyframes.js.

**Verdict in one line.** The plan's *spine is correct* — the touch-gate two-tap
is a real shipped bug, the value.js forks are real and sized as claimed, the
mutex/placement/expand-event convergences are genuine. **But five load-bearing
claims are FALSE or stale, and the WAVE-1 lead carries a structural error that
would break a real consumer.** The most important corrections below are flagged
**[REFUTED]** (a claim that is wrong) and **[STALE]** (right-in-spirit, wrong
coordinates). Three of the seven waves need a premise rewrite before they ship.

---

## §A — The headline refutations (ranked by blast-radius)

### A1. [REFUTED] WAVE-1 shape (A) BREAKS a real consumer — and the plan cites that very consumer as proof shape (A) is fine

This is the most serious defect in the plan. WAVE-1 names two fix shapes and
declares **(A) "collapsed-pill-as-single-disclosure" PREFERRED** — commit the
collapsed pill to being one expand-only target with **NO live controls** in the
summary slot (forward.md:90-99; glass-ui.md:246-258). It then cites keyframes'
`AnimationMenuBar.vue:181-184` `onCollapsedPlayClick()` as "the reference
implementation… the exact expand-then-act in one gesture" that glass-ui "should
generalize" (forward.md:111-117).

**Both halves are wrong, and they contradict each other.**

1. `AnimationMenuBar.vue` is mounted `:always-expanded="true"`
   (`AnimationMenuBar.vue:17`). With `alwaysExpanded`, `shouldGateTouch()`
   returns `false` (`GlassDock.vue:264-266`) — **the touch gate NEVER runs for
   this dock.** `onCollapsedPlayClick` is not a touch-gate workaround at all; it
   exists because the dock is always-expanded yet still renders a `#collapsed`
   slot for the *hover-collapse* visual, and the header comment
   (`AnimationMenuBar.vue:9-16`) states the real reason: positional stability of
   the play button across the summary↔full layers, **not** the two-tap bug.
   Citing it as the WAVE-1 reference is a category error.

2. That same `#collapsed` slot renders a **LIVE play button** that must act on a
   direct tap (`AnimationMenuBar.vue:127-138`: a `<Button … @click.stop=
   "onCollapsedPlayClick()">` with Play/Pause icons). This is a real consumer
   whose collapsed pill is *not* a pure disclosure — it presents a live control
   the user expects to fire. **Shape (A) — "pill = expand-only, no live controls
   to mis-tap" — would delete this affordance.** The plan asks the question
   "does shape (A) break a real consumer that needs live collapsed controls?"
   and the answer, from the plan's OWN cited consumer, is **YES**.

**Consequence.** Shape (A) is NOT the safe general default the plan claims. A
collapsed transport pill with a one-tap play button is an idiomatic, desirable
pattern (it is exactly iOS's Now-Playing mini-bar). The base dock must support
*live collapsed controls that act on first tap* — which is precisely what shape
(A) forbids and shape (B) enables. The ranking must invert: **(B)
capture-and-replay (or a cleaner variant, §A2) is the load-bearing fix; (A) is
an opt-in `collapsedDisclosure` mode** for docks whose summary is genuinely a
summary (keyframes `TopDock`, fourier's three). The plan presenting (A) as
PREFERRED and (B) as "only if a consumer needs live collapsed controls" is
backwards: a consumer needing live collapsed controls already exists and is the
plan's own exhibit.

### A2. [REFUTED] The capture-and-replay fallback (B) is racier than the plan admits — and a cleaner non-racing fix exists that the plan never considers

The plan's shape (B) dispatches a synthetic `click` via
`document.elementFromPoint()` **on the next frame after the layer swap settles**,
because inactive layers leave the hit-test tree (`pointer-events:none` on
`.dock-layer:not(.layer-active)`, live at `dock.css:420-424` — the audit cites
`:405-407`, **[STALE]** by ~15 lines). Stress the race:

- The replay must wait for `layer-active` to flip AND for `pointer-events:auto`
  to apply AND for the `--dock-motion-resize` width morph to expose the control
  at its final geometry. With the View-Transitions path
  (`useLayerTransition.ts:121-133`), the mutation is wrapped in
  `startViewTransition` and the old pane is *held painted* through the snapshot —
  so `elementFromPoint` during the VT may resolve the **leaving** (summary) pane,
  not the entering one. "Next frame" is insufficient; the replay must await
  `transition.finished`, which the plan's "NEXT frame AFTER the layer swap
  settles" hand-waves.
- `elementFromPoint(touch.clientX, touch.clientY)` assumes the control is at the
  same screen coordinate post-expand. During a width morph the controls
  *translate* — the finger's release point may now be over a different control
  or dead space. Synthetic-click-by-coordinate is geometrically unsound mid-morph.
- A synthetic `click` does not reproduce `:active`/`pointerdown` affordance
  feedback, and `@click.stop` handlers (like `AnimationMenuBar`'s) interact
  unpredictably with a programmatic dispatch.

**The fix the plan misses (cleaner than both A and B).** The two-tap is caused by
`onTouchStart`/`onTouchEnd` calling `preventDefault()` + `stopPropagation()` on
the collapsed pill (`GlassDock.vue:275-276, 290-291`), which suppresses the
compatibility `click`. But the gate only needs to **distinguish a tap from a
scroll** — it does NOT need to swallow the tap. The idiomatic fix is: on the
resolved-tap branch, **do not preventDefault the touchend** — let the native
compatibility `click` flow to the inner control, and let the *control's own
click* bubble to a root handler that expands the dock (or expand on the SAME
click via a capture-phase listener on the dock root). i.e. invert from
"swallow-then-replay" to "expand-on-the-real-click." This needs no
`elementFromPoint`, no synthetic dispatch, no frame sequencing — it rides the
browser's own tap→click. The plan never evaluates this; it should be shape (B′)
and is almost certainly the correct landing. (The scroll-cancel path keeps
`preventDefault` only when `handleScrollCheck` has fired >10px — `:141-150`.)

### A3. [REFUTED] "Zero touch coverage" is false — a `useTouchGate.test.ts` ships today (4 tests)

Both the forward plan ("zero behavioural coverage exists for the touch path",
forward.md:128) and the source audit ("The touch-gate (ASK-1) — ZERO coverage",
glass-ui.md:378-382) assert no touch test exists. **FALSE.**
`src/composables/__tests__/useTouchGate.test.ts` exists with 4 tests
(`:19-73`): desktop pass-through, the 150ms activation window, the >10px
scroll-cancel, and the return-shape contract. These are real behavioural tests
of the gate.

The corrected claim — which is *stronger and still supports WAVE-1* — is:
**the gate is unit-tested in isolation, but the `GlassDock`↔gate INTEGRATION (the
collapsed-pill two-tap) is untested.** Verified: `grep touch|tap|TouchEvent` in
`src/components/custom/dock/__tests__/*` → **0 matches** (the three dock tests
are structural — instrument-strip class, scroll-overflow axis, vt-name
distinctness). So the bug shipped because the *integration* has no fabric, not
because the gate is untested. This nuance matters: the existing unit test
**passes** with the two-tap bug present (it tests `activate()`, which IS correct
in isolation), proving a gate-level unit test can never catch this — the gate's
"activate" is sound; the *dock's interpretation* of activate as "expand only" is
the bug. **The hard gate must be a mounted-`GlassDock` integration test, and the
plan's spec (forward.md:134-143) is right to demand that — but its premise
("zero coverage") is wrong and must be corrected so the reviewer doesn't dismiss
the wave when they find the existing test.**

### A4. [REFUTED] WAVE-5 point 5 — the "sub-44px coarse-pointer" finding is already fixed in live source

forward.md:342-344 and glass-ui.md (§5.§7 via the retires list) demand: "44px
control default under `@media (pointer: coarse)`. `--dock-control-size` defaults
`2.5rem`/`2rem`… below WCAG 2.5.5 / Apple HIG 44px on touch. Bump the
coarse-pointer default token." **This already exists.** `dock.css:1134-1137`:

```css
@media (pointer: coarse) {
    .glass-dock[data-density] {
        --dock-control-size: var(--dock-touch-target, 2.75rem);   /* = 44px */
        --size-icon-btn: var(--dock-touch-target, 2.75rem);
    }
    .dock-icon-button:not(.dock-icon-button--compact) {
        min-block-size: var(--dock-touch-target, 2.75rem);
        min-inline-size: var(--dock-touch-target, 2.75rem);
    }
}
```

The comment block (`dock.css:1113-1133`) even documents the specificity fix
(`AP.W3 R0G-6`: the `.glass-dock[data-density]` presence-selector beats the
density setter that previously pinned the box at 40px). **The 44px coarse floor
is a LANDED feature with provenance.** WAVE-5's "bump the token" line is
retroactive — strike it, or rewrite as "verify the existing floor with a gate"
(the resolved-≥44px assertion in the hard gate is legitimate; the *premise* that
it's missing is not).

### A5. [REFUTED] WAVE-2 / convergence — `useExclusiveSelect.ts` does NOT exist; keyframes has ONE mutex copy, not two

forward.md:186 and convergence.md:11,61,109,127 assert keyframes carries TWO
single-open mutex copies — the inline `popupModel` in `TopDock.vue` PLUS a
standalone `demo/@/composables/useExclusiveSelect.ts` — and §10 books keyframes
to "converge its two internal mutex copies onto one NOW." **The file does not
exist.** `find demo -name useExclusiveSelect.ts` → nothing. Git shows it was
extracted (`ca2bcc6`) then deleted before HEAD; it survives only as a stale
bullet in `demo/CLAUDE.md:116`. The live keyframes mutex is exactly ONE copy: the
inline `popupModel` getter/setter in `TopDock.vue:84-103`. The "2 copies in one
repo — the convergence test fires WITHIN keyframes" framing (forward.md:186) is
false; the keyframes-side WAVE-2 obligation ("converge the two copies onto one
NOW", forward.md:209-210, §10) is a **no-op against a ghost**. The cross-repo
convergence (keyframes' `popupModel` ≡ value.js's `usePopupMutex`) is still
real and still the highest-multiplicity finding — but it's a 2-repo convergence,
not a "2-copies-in-keyframes-plus-value.js" one. (Bonus: the stale
`demo/CLAUDE.md:116` line should be struck as part of the keyframes C cleanup —
it's the *only* surviving reference and will mislead the next reader exactly as
it misled this plan.)

---

## §B — The motion / iOS-grade question (lane point 5) — the most consequential *correction in the plan's favor*

The plan treats `useLayerTransition` (WAVE-6) as an *ergonomics* gap (the
value.js fork) and never asks whether the dock's MOTION meets iOS-grade
timing/morphing. **It does — almost.** Grounded measurement:

- The dock's resize/morph transition is `--dock-motion-resize: var(--duration-
  normal) var(--spring-snappy)` (`dock.css:22`), applied to width/height/padding/
  transform (`dock.css:187-218, 383, 668-669`).
- `--spring-snappy` (`tokens.css:159`) is a **48-sample `linear()` spring** with
  the characteristic underdamped overshoot to ~106.8% at ~16% and a damped
  settle by ~44% — i.e. a real analytic spring, not a bezier guess.
- **Provenance is keyframes' own engine.** `tokens.css:139`: these stops are
  generated by *"`springLinearStops()` from `@mkbabb/keyframes.js` which solves
  the iOS-canonical (response, dampingFraction)"*. So the FLIP-fallback dock
  morph **already rides the SpringProgress / springTimingFunction this lane
  ships** (`src/animation/spring.ts`). This is the dogfooding the C-tranche inv ζ
  asks for — and it's already true on the FLIP path.

**The actual gap is narrow and the plan under-weights it.** The dock FORKED its
morph timing per engine (AQ.W6):

- **Native View-Transitions path** (`useLayerTransition.ts:121-133`, the default
  on any Chromium): the `::view-transition-group(.gl-dock-layer)` recipe uses
  `--vt-ease` = `--ease-apple-spring` = **`cubic-bezier(0.175, 0.885, 0.32,
  1.275)`** (`tokens.css:176`, `view-transition.css:53-55`). That bezier
  overshoots to ~+27.5% and **does not settle/ring** — it is NOT the analytic
  damped spring. So the *exact same identity morph FEELS different* depending on
  whether the browser took the VT path (apple-spring bezier, +27.5%, no settle)
  or the FLIP path (keyframes `linear()` spring, +6.8%, settles). On modern
  Chromium (the lane's "engine modern-web" target) **the VT path is the one users
  actually see**, and it is the *worse, non-iOS-grade* one.

This is already diagnosed by glass-ui's own AT tranche: `AT.W1b-dock.md:54-60`
books **W6-dock-c `proof:dock-motion-parity`** — mint `--dock-resize-spring:
var(--spring-snappy)` and feed BOTH paths from it. **Verified status: PLANNED /
IMPL, NOT landed** (`AT/PROGRESS.md:42` shows AT.W6 IMPL/PLANNED;
`grep dock-resize-spring src/ scripts/ package.json` → 0 — it exists only in AT
docs). So:

> **The animation audit's real dock fold is NOT WAVE-6's `layerProps(id)`
> ergonomics — it is the VT-path timing-fn parity.** The dock's headline morph
> (collapsed↔expanded width, the most-seen dock animation) plays a non-spring
> bezier with a 4× larger overshoot and no settle on exactly the modern browsers
> the constellation targets. The fix is to point `--vt-ease` (for `.gl-dock-
> layer`) at the keyframes-derived spring — i.e. emit the `linear()` form of the
> same `(response, dampingFraction)` for the VT path. This is the single
> highest-value MOTION improvement to the dock, it is keyframes-engine-native
> (springLinearStops already feeds the FLIP path), and the plan's WAVE-6 buries
> it under a 123-LOC-fork-deletion ergonomics story. **Elevate VT-parity to the
> motion lane's WAVE-6 headline; the fork deletion is the secondary benefit.**

(The lane also asks whether reduced-motion is honored: keyframes has a
`reduced-motion.ts` gate and `view-transition.css:52` notes "PRM zeroes the
animation above" — so the VT recipe respects PRM. Not a gap; noted for
completeness.)

---

## §C — File:line drift table (every claim re-checked)

Legend: ✓ exact · ±N off by N lines (semantics intact) · ✗ wrong/ghost.

| Plan claim | Live source | Status |
|---|---|---|
| `useTouchGate.ts:138` returns `false` (first contact) | `:138` `return false` | ✓ |
| `useTouchGate.ts:154-156` `handleTouchEnd`→`activate` | `:154-156` (`if isPending… activate` at `:156`) | ✓ |
| `useTouchGate.ts:74-80` 150ms pendingTimer | `:74-80` | ✓ |
| `useTouchGate.ts:141-150` scroll >10px check | `:141-150` | ✓ |
| `GlassDock.vue:268-294` the 3 touch handlers | `:268-294` | ✓ |
| `GlassDock.vue:274-277` preventDefault+stopProp | `:275-276` | ±1 |
| `GlassDock.vue:289-293` `expand()` only | `:285-294`; `expand()` at `:292` | ±1 |
| `GlassDock.vue:363-369` collapsed `<div @click>` | `:363-369` | ✓ |
| `GlassDock.vue:311` defineExpose | `:311` | ✓ |
| `GlassDock.vue:324` `bottom-[var(--dock-pos)]` | `:324` | ✓ |
| `dockContext.ts:31-33` `useOptionalDockContext` | not re-read; surface present | — |
| `dock.css` safe-area-inset → 0 matches | `grep` → **0** | ✓ |
| `--dock-control-size` `2.5rem`/`2rem` at `dock.css:92,107` | `:107`=2.5rem, `:92`=2rem | ✓ |
| inactive-layer `pointer-events` at `dock.css:405-407` | live `:420-424` | **±15 STALE** |
| coarse-pointer 44px is MISSING (W5.5) | live `dock.css:1134-1137` **PRESENT** | **✗ REFUTED** |
| `useLayerTransition` returns only low-level refs | `{onTransitionEnd, currentLayer, leavingLayer}` `:201` | ✓ |
| value.js fork lacks native-VT + axis, hardcodes `setTimeout(…,400)` | confirmed (`useLayerTransition.ts:122` `,400`; no `startViewTransition`/`axis`) | ✓ |
| value.js fork = 123 LOC | `wc -l` = **123** | ✓ |
| value.js `usePopupMutex.ts` = 85 LOC | `wc -l` = **85** | ✓ |
| value.js `Dock.vue:93` `:always-expanded="!isDesktop"` | `:93` | ✓ |
| value.js `Dock.vue:73` `isAnyOpen→keepOpen/release` | `:73` | ✓ |
| value.js `Dock.vue:77-87` precedence reducer | live `:75-90` | ±2 |
| value.js `Dock.vue:66` `isDesktop` useMediaQuery | `:66` | ✓ |
| keyframes `TopDock.vue:117` `:always-expanded="isMobile"` | live `:116` | ±1 |
| keyframes `TopDock.vue:114` `top: calc(max(…env…))` | live `:113` | ±1 |
| keyframes `TopDock.vue:65` `isMobile` | `:65` | ✓ |
| keyframes `TopDock.vue:81-103` popup mutex | `:81-103` | ✓ |
| keyframes `TopDock.vue:74-79` `watch(dockRef.expanded)` | live `:76-78` | ±2 |
| keyframes `AnimationMenuBar.vue:181-184` `onCollapsedPlayClick` | `:181-184` | ✓ (but mis-framed, §A1) |
| keyframes `demo/@/composables/useExclusiveSelect.ts` (2nd mutex copy) | **does not exist** | **✗ GHOST** |
| fourier `EditorControlsDock.vue:56` collapse-on-load | exists at `fourier-analysis/web/src/components/visualization/…:56` | ✓ (path) |
| fourier `CanvasControlsDock.vue:26,34-37` F12 `update:expanded` | `:26,34-37` | ✓ (but wrapper-level, §D2) |
| fourier `AnimationControls.vue:58-63` GlassDock collapse-on-load | `:58-63` | ✓ |
| `DockTabButton` 0 consumers across constellation | grep all 3 repos + slides → **0** | ✓ |
| `useTouchGate.test.ts` does not exist / "zero touch coverage" | **exists, 4 tests** | **✗ REFUTED** |

**Provenance-line correction.** Both plans say "re-verified against glass-ui
working tree HEAD 2026-06-04." glass-ui HEAD is `a09c2b6` (AT.W0b docs) and the
dock source last changed at `aace84e` (composables restructure). The line numbers
match the audit-time tree to ±1-2 in most files but have drifted ±15 in
`dock.css` and gone fully stale on the coarse-pointer and useExclusiveSelect
claims — i.e. the "re-verified at HEAD" stamp is **partially aspirational**. A
true HEAD re-verify would have caught A3, A4, A5.

---

## §D — Gaps in the 7 waves + the convergence

### D1. [convergence] The "hand-roll with no base home" check passes — but one fold IS app-specific and the plan half-admits it

The convergence §4 claims "NOTHING dock-shaped is left hand-rolled that the base
could own." Stress: the value.js **nested sub-layer-group** (`ActionBarLayer.vue`
— a 2nd crossfade INSIDE one layer) is folded under WAVE-6 as "rides the upstream
return" / "`DockLayerGroup` nesting" (forward.md:388, convergence.md:163). But the
live `DockLayerGroup` provides a single `DOCK_LAYER_GROUP_KEY` context and mints
ONE `view-transition-name` per group (`DockLayerGroup.vue:69-77`); **nesting two
groups would mint two VT names on nested boxes, which the VT spec does not
compose cleanly** (a nested `view-transition-name` inside an active
`view-transition-group` is undefined-ish). The plan asserts nesting works without
verifying the VT-name collision. This is a genuine open question the WAVE-6 gate
("FLIP A→B→A") does NOT cover — add a **nested-group VT-name uniqueness** assertion
or the fold may not be base-ownable as claimed. Mark WAVE-6's nested-group fold
**lower-confidence than stated.**

### D2. [WAVE-4] "fourier proves the shape" overstates — fourier proved the WORKAROUND, not the primitive

forward.md:42,280-281 and the ledger row ("fourier ALREADY got `update:expanded`
landed… proves the shape") imply fourier validated the *primitive* `v-model:
expanded`. Live source (`CanvasControlsDock.vue:29-37`) shows fourier emits
`update:expanded` from a **wrapper** via `watch(() => dockRef.value?.expanded)` —
i.e. the exact template-ref watch the plan elsewhere calls a hand-roll to be
RETIRED (forward.md:300-302). Fourier proves the *demand* and the *event name*,
not that the watch-free primitive shape works. Correct WAVE-4's thesis: "fourier
proves the event name + the demand; the primitive must still be built and gated
(the watch must move from wrapper into `GlassDock`, firing on `visualExpanded`
not raw `expanded`)." The plan's own hard gate (fire on `visualExpanded`,
forward.md:289-296) is right; the "already proved" framing is too strong.

### D3. [naming] One real collision the convergence scheme misses

`<Role>Dock` with `Role ∈ {Chrome, Transport, Canvas, Tool}` is coherent, BUT
the convergence maps BOTH keyframes `AnimationMenuBar` AND fourier
`AnimationControls` → `TransportDock` (convergence.md:80,135). Those two files
live in different repos so no filesystem collision — but the convergence's own
success test is `grep` returning a single vocabulary across the constellation,
and **two files named `TransportDock.vue` in two repos with materially different
internals** (keyframes: always-expanded play/pause/reset/select; fourier:
dropdown-trigger transport) defeats the "a reader recognizes any dock by role"
goal the moment someone greps `TransportDock` and gets two divergent
implementations. The scheme needs a repo-qualifier convention
(`kf/TransportDock`, `fa/TransportDock`) or the role vocabulary must accept that
role-name ≠ shared-code (it's a *documentation* convention, not a dedup). The
convergence presents it as both, which is contradictory. Also: the convergence
says "delete the local `dock/index.ts` re-export" (convergence.md:128,201) but
that file ALSO exports `TopDock` itself (`demo/@/components/custom/dock/index.ts:
2`) — it can't be deleted, only trimmed. Minor, but it's in the "mechanical
checklist" the plan calls verified.

### D4. [WAVE-3] The safe-area "boilerplate" is smaller and more correct than the plan implies

The plan frames `env(safe-area-inset-*)` as pure boilerplate every consumer
re-derives identically (forward.md:217-241). But the two keyframes sites are
*different*: `TopDock.vue:113` is `max(--work-area-top-offset, env(safe-area-
inset-top))` (a TOP dock combining chrome-exclusion with the inset) and
`AnimationMenuBar.vue:4,7` is `pb-[max(--dock-margin/2, env(safe-area-inset-
bottom))]` + `bottom: var(--work-area-bottom-offset)` (a BOTTOM dock). The
*exclusion geometry* (which chrome to avoid, top vs bottom) is app-specific — the
plan's §4 even admits this ("only the `env()` boilerplate folds"). The wave is
sound but its retirement claim should be scoped to ONLY the `env()` term, not the
`--work-area-*` offsets, which §4 contradictorily lists as both "folds" (the
table) and "stays per-consumer" (the prose). Tighten so glass-ui doesn't try to
own app-chrome geometry it can't know.

### D5. [WAVE-1] A latent gate bug worth folding while the file is open

`GlassDock.vue:136` constructs `useTouchGate(props.collapseDelay)` — passing the
**collapse delay (2000ms)** as the gate's `deactivateDelayMs` parameter (whose
default is 3000). The auto-deactivate timer is thus coupled to the *visual*
collapse delay by accident of argument position. Not the two-tap bug, but it
means a consumer tuning `collapseDelay` for hover-feel silently retunes the
touch-deactivate window. WAVE-1 touches exactly this constructor — flag it for
the same landing (decouple the two, or document the coupling intentionally).

---

## §E — Is the WAVE-1 behavioural test design sufficient to PREVENT regression?

**Partially — it has the right intent but three under-specified holes that would
let the bug regress through a green test.**

1. **The shim-ordering constraint is unstated and decisive.** `isTouchDevice` is
   captured as a `const` at gate *construction* (`useTouchGate.ts:62-63`), and
   `GlassDock` constructs the gate in `setup` (`:136`). So the test MUST define
   `window.ontouchstart` **before mounting** `<GlassDock>`, or the gate is built
   in desktop mode and the touch path is dead — yielding a test that passes
   while testing nothing. The existing unit test gets this right
   (`enableTouchDevice()` before `useTouchGate()`, `:29-30`); the plan's
   `GlassDock`-level spec (forward.md:134-143) never states it. A behavioural
   test that mounts first and shims second is the single most likely way this
   gate goes green-but-blind. **Make pre-mount shimming an explicit gate clause.**

2. **The spec asserts the wrong thing for the load-bearing case.** For shape (A)
   it asserts "a second tap fires it with NO further expand" — but per §A1 the
   consumer that matters has LIVE collapsed controls, where the correct assertion
   is **the inner control's `@click` fires on the FIRST gesture**. The shape-(A)
   assertion *encodes the two-tap as acceptable* (tap to open, tap to act). If
   shape (A) ships as the default, the test will lock in a two-tap-by-design that
   breaks the transport mini-bar. The test must assert the one-gesture-act path
   (shape B/B′) for a dock with a live collapsed control, or it gates the wrong
   behaviour.

3. **No coverage of the VT-path timing during replay.** If shape (B) ships, the
   replay races the View-Transition (§A2). The test runs in jsdom, which has NO
   `startViewTransition` — so `NATIVE_VT` is false and the test only ever
   exercises the FLIP fallback. **The exact path that ships to users (native VT)
   is the one the test cannot reach.** `elementFromPoint` is also a jsdom stub
   (returns null / unreliable). So a B-shape test in jsdom validates a code path
   users never hit and cannot validate the one they do. This is a fundamental
   limit: **the WAVE-1 regression guard for shape (B) needs a real-browser
   (Playwright) leg**, not just jsdom. The plan's hard gate is jsdom-only and
   therefore insufficient to prevent regression of the actually-shipped path.
   (The local `/tmp/kf-audit` chromium + `scripts/capture.mjs` pattern is exactly
   the harness for this — the plan should name a Playwright touch-emulation leg.)

**Net:** the test *intent* (mount collapsed, simulate touchstart→touchend, assert
one-gesture outcome + scroll-cancel) is correct and necessary. But as specified
it (a) omits the shim-ordering precondition that determines whether it tests
anything, (b) asserts the two-tap-as-feature for the case that must be one-tap,
and (c) is jsdom-bound to the non-shipped FLIP path. All three must be fixed or
the "fix MUST ship with this test or it can silently regress" promise is hollow.

---

## §F — What the plan gets RIGHT (so the corrections aren't read as a teardown)

- The two-tap bug is **real and correctly root-caused** to the
  `preventDefault`+`stopPropagation`-on-both-halves + activate-means-expand-only
  decoupling (`GlassDock.vue:275-292` × `useTouchGate.ts:138,156`). The trace is
  accurate.
- The value.js forks are **real and exactly sized** (85 + 123 LOC; the drift —
  no native-VT, no axis, hardcoded `setTimeout(…,400)` vs computed
  `cleanupDelayMs` — is verbatim true).
- `DockTabButton` 0-consumers, safe-area-inset 0-matches, the single-open mutex
  multiplicity (keyframes `popupModel` + value.js `usePopupMutex` + fourier
  parent-`v-if`), and the dock-badge/view-dot consumer hand-rolls all **verify**.
- The "AT design slice's 'no shipped dock bug' verdict is false" framing is
  **correct** — the touch two-tap is a shipped interaction bug the AT lenses
  missed, and folding WAVE-1 into AT.W6/W7 is the right routing.
- The dock already dogfoods the keyframes spring on the FLIP path
  (`springLinearStops` → `--spring-snappy`), which is the C-tranche inv-ζ win the
  plan doesn't even claim credit for.

---

## §G — The hardened directive (what to change before this plan ships)

1. **WAVE-1: invert the shape ranking.** Make the non-swallowing
   "expand-on-the-real-click" fix (§A2, shape B′) the default; demote shape (A)
   to an opt-in `collapsedDisclosure` mode for summary-only docks. **Stop citing
   `onCollapsedPlayClick` as the reference** — it's always-expanded and proves the
   opposite (live collapsed controls must act on first tap).
2. **WAVE-1 test: add the three clauses** — pre-mount `ontouchstart` shim;
   assert first-gesture-act for a live-collapsed-control dock; add a Playwright
   leg for the native-VT path (jsdom can't reach it).
3. **WAVE-5: strike point 5** (44px coarse floor is landed, `dock.css:1134-1137`)
   or rewrite as verify-only.
4. **WAVE-2 / §10 / convergence: delete the `useExclusiveSelect.ts` obligation**
   — the file is a ghost; keyframes has ONE mutex copy. Strike
   `demo/CLAUDE.md:116`. The cross-repo convergence remains.
5. **WAVE-6: elevate VT-path motion-parity to the headline** (the dock's
   most-seen morph plays a non-spring `cubic-bezier(…1.275)` on modern Chromium;
   point `--vt-ease`/`.gl-dock-layer` at the keyframes-derived spring via
   `--dock-resize-spring`). The 123-LOC fork deletion is the secondary benefit.
   Add a nested-group VT-name uniqueness assertion (D1).
6. **WAVE-4: downgrade "fourier proved the shape" to "fourier proved the demand +
   event name"** (it's a wrapper-level watch, the very hand-roll to retire).
7. **Correct the "re-verified at HEAD" stamp** — refresh the stale `dock.css`
   line numbers (±15), the coarse-pointer claim, and the useExclusiveSelect ghost
   before the plan is routed to glass-ui, or the glass-ui reviewer will discover
   them and discount the whole proposal.
8. **Path correction:** the fourier consumer is `fourier-analysis/web/src/
   components/visualization/`, not `fourier/…`. Fix every fourier path in both
   plan docs so the cross-repo checklist is followable.

**Bottom line.** The plan correctly identifies the bug and the convergences, but
ships shape (A) as the default fix when the plan's own cited consumer proves
shape (A) breaks live collapsed controls; carries five stale/false premises (two
of them — A4, A5 — are "fix a thing that's already fixed / converge a file that
doesn't exist"); under-specifies the regression test such that it can pass blind;
and buries the actual iOS-grade motion gap (the VT-path non-spring bezier) under
an ergonomics story. Fix items 1-8 and the spine is sound.
