# D.W3 — Brittleness hardened (selectors · reactivity · fragile rules)

The hardening wave. The demo is well-built — 100% `<script setup>`, idiomatic
stores, good colocation — but a thin seam of BRITTLENESS runs through it: DOM
queries that reach OUTSIDE their component by string selector (a global
`document.querySelectorAll("pre")`, a `.closest(".easing-target")` traversal,
a `[data-sonner-toaster]` cross-library coupling), CSS that depends on
browser features with no `@supports` fallback (`env()`, `dvh`,
`-webkit-mask-image`), and three reactivity paths that are fragile under churn
(an ungated rAF bridge that burns frames when idle, an array-watch that can
flush stale, a scroll listener re-attach). Plus one ENGINE residual the W0
ledger slipped into D: the `_snapSettled` asymmetry between the two steppers
(D-6). D.W3 makes the brittle owned, the fragile robust, and the asymmetric
symmetric — each closed by a re-runnable instrument. Grounds: the brittleness
lane (`audit/brittleness-findings.md`); C.md §deferred-ledger (the W0-slipped
`_snapSettled`, KFD to D.W3).

## § The state, verified (not asserted)

The live facts, grep- and read-confirmed, so the wave's framing is honest:

1. **The global `document.querySelectorAll("pre")` is live** at
   `KeyframesEditor.vue:439` — a component reaching across the WHOLE document
   to re-highlight every `<pre>` on the page (`pres.forEach(highlight)`). It
   touches `<pre>` elements owned by other components; a brittle global mutation
   from a component file.
2. **The `.closest(".easing-target")` traversal is live** — C.W2 already moved
   the EasingTarget vars off the leaked global `.glass-card` onto an owned
   `.easing-target` class, and the JS reads them via
   `container.closest(".easing-target")` (`demo/easing/EasingTarget.vue:142`; the
   sibling `.querySelector(".track-container")` at `:217`; `:268` is the
   documenting comment). The brittleness REMAINING is the string-class DOM walk
   itself — a `ref` is more robust than a `closest(".class")` that breaks if the
   class is renamed.
3. **The `[data-sonner-toaster]` coupling is live at TWO sites**
   (`CSSPasteDialog.vue:7`, `KeyframesEditor.vue:78`): `target?.closest('[data-sonner-toaster]')`
   guards a paste handler against firing inside a toast. It couples the demo to
   sonner's private DOM attribute — undocumented, unowned, breaks silently if
   sonner renames it.
4. **The z-index scale is ALREADY single-sourced — in glass-ui, not the demo.**
   `--z-content:10 / --z-controls:20 / --z-bar:30 / --z-dock:40 / --z-overlay:50
   / --z-popover:130 / --z-modal:140` are defined in
   `node_modules/@mkbabb/glass-ui/dist/styles/tokens.css:270-280`; the demo
   consumes them via Tailwind utilities (`z-dock`, `z-content`, `z-controls`,
   `z-bar`, `z-popover`, `z-modal` — 22 sites). There are ZERO raw `z-[N]`
   bracket-arbitrary values in demo source and ONE orphan raw `z-index: -10`
   (`CubeTarget.vue:199`, a behind-the-plane axis line). Besides those, four raw
   tailwind rungs (`z-10` `CubeTarget.vue:42`, `z-20` `CubeScene.vue:117`, `z-10`
   `MatrixEditor.vue:13`, `z-0` `KeyframeCard.vue:23`) consume the scale by number
   rather than the semantic `z-dock`/`z-content`/etc. names. So the demo does NOT
   need a NEW scale — it needs the EXISTING scale DOCUMENTED as an ordered layer
   contract, the one orphan raw `z-index` reconciled to it, and the four raw rungs
   reconciled to named layers (where they map to a documented rung) or recorded
   as deliberate local stacking.
5. **There are ZERO `@supports` guards in the demo** (`grep -rln "@supports"
   demo/` excluding `dist/` = empty), yet the demo depends on `env(safe-area-inset-*)`
   (`AnimationMenuBar.vue:4`, `TopDock.vue:114`, `style.css:54`), `dvh`
   (`EditorShell.vue:3`, `style.css` work-area chain), and `-webkit-mask-image`
   (`AnimationControlsGroup.vue:548-549`, `AnimationControls.vue:229-235`) with
   NO fallback. On a browser lacking any, the affected rule degrades silently.
6. **The work-area `calc()` chain is already cycle-free + documented** — C.W2
   landed the optical-balance pair (`--work-area-vertical-bias-top/bottom`) and
   the `--dock-band-reserve` that breaks the `max-height → bottom-offset →
   slack → height → max-height` custom-property cycle (`style.css:31-60`, with
   the rationale inline). So D.W3 HARDENS this chain with `@supports` guards +
   the viewport-trap audit, NOT a rebuild.
7. **`useAnimationSync` runs its rAF bridge UNCONDITIONALLY** — the docstring
   states "The loop runs unconditionally … gating on isPlaying/isStarted creates
   chicken-and-egg problems where isStarted never flips because the loop that
   reads it isn't running." So a `useRafLoop` polls three refs every frame for
   every synced animation, forever, even when nothing animates — a real
   battery/CPU cost the demo pays at idle, with a real (named) hazard if naively
   gated.
8. **`useScrollFade` already re-attaches** via `watch(el)` / `watch(observeEl)`
   (`useScrollFade.ts:136,144`) and tracks `boundScrollEl` for cleanup
   (`:104-111`). The brittleness is the re-attach ROBUSTNESS (stale
   `boundScrollEl` if `el` changes mid-flight), not a missing re-attach.
9. **The `_snapSettled` asymmetry is real** (`src/animation/{smooth,spring}.ts`):
   spring's `_snapSettled` (`spring.ts:188`) resets origin/velocity/elapsed,
   emits, AND calls `this._playback.stop()`; smooth's `_snapSettled`
   (`smooth.ts:99`) snaps value, sets `isSettled`, emits — but does NOT stop a
   running loop. Two steppers, one reduced-motion-snap contract, two different
   behaviours — the D-6 residual.

The wave's job is to make each brittle/fragile/asymmetric seam OWNED and GATED,
honestly — not to manufacture a crisis where C already did the structural work
(the z-scale, the work-area chain), but to close the SEAMS those structures
still leave open.

## § Goal

**What lands:**
- The brittle DOM selectors become owned refs / documented contracts: the
  global `document.querySelectorAll("pre")` → a scoped `useTemplateRef` (or a
  provide/inject highlight registry); the `.closest(".easing-target")` → an
  owned `ref` passed by the component that owns the element; the
  `[data-sonner-toaster]` coupling → a documented, named contract (a single
  `isInsideToaster()` helper with the attribute centralized + commented as a
  sonner-version dependency).
- The z-index scale DOCUMENTED as an ordered layer contract — the existing
  glass-ui `--z-*` tokens recorded as ONE ordered set in a demo doc/comment, a
  gate forbidding raw `z-[N]` drift in demo source, and the one raw `z-index:
  -10` reconciled to a named `--z-behind` (or documented as the deliberate
  below-plane exception).
- `@supports` guards for the named properties — `env(safe-area-inset-*)`,
  `dvh`, `-webkit-mask-image` each get a fallback path so the rule degrades
  gracefully, plus the viewport-trap audit (the `h-dvh` / `overflow-hidden`
  shell verified not to trap content off-screen on any viewport).
- The reactivity paths hardened: `useAnimationSync`'s rAF bridge GATED (run
  only while an animation can change state — respecting the named chicken-and-egg
  hazard, e.g. via visibility + a settle-detect, not a naive `isPlaying`
  guard); `useKeyframesEditor`'s array-watch flush fixed (deterministic flush
  timing so a stale frame array cannot paint); `useScrollFade`'s listener
  re-attach made robust against a mid-flight `el` swap.
- The engine `_snapSettled` symmetry (D-6): the two steppers' reduced-motion
  snap made contract-equivalent — either both stop their loop or the difference
  is justified + documented as intentional.
- A `proof:brittleness` instrument: zero global `document.querySelector*` in
  demo components; the z-scale single-sourced (no raw `z-[N]` outside it);
  `@supports` guards present for the named properties. Each BITES.

**Why:** brittleness is the gap between "works on my machine today" and "works
under churn" — a global selector breaks when another component adds a `<pre>`,
a `.closest(".class")` breaks when the class is renamed, an unguarded `env()`
breaks on a browser without it, an ungated rAF burns a phone's battery at idle,
an asymmetric `_snapSettled` means reduced-motion behaves differently on two
steppers that promise the same contract. Each is a latent failure the demo
ships armed. Hardening them — owned refs, documented contracts, `@supports`
fallbacks, gated loops, symmetric steppers — is robustness without behaviour
change (the happy path is byte-identical; only the failure path improves). The
no-legacy mandate forbids leaving a brittle coupling in place; KISS favors an
owned ref over a global query.

## § Scope

### S1 — Brittle DOM selectors → owned refs / documented contracts — brittleness-findings §1

**WHAT:** three selector hardenings:

- **The global `document.querySelectorAll("pre")`** (`KeyframesEditor.vue:439`,
  `pres.forEach(highlight)`) → scope the highlight to the component's OWN
  `<pre>` elements via `useTemplateRef` (the editor already holds
  `cssKeyframesStringEl` as a ref; collect the component's `<pre>` refs the
  same way) OR a provide/inject highlight registry if multiple components must
  share one highlighter. A component must not re-highlight the whole document.
- **The `.closest(".easing-target")` traversal** (the JS reader at
  `demo/easing/EasingTarget.vue:142`, documented at `:268`) → pass the owned
  element as a `ref` from the component that renders it, instead of walking the
  DOM by class name. The component already owns the `.easing-target` element;
  give it a `useTemplateRef` and read the vars off that ref, not off a
  `closest(".easing-target")` string match.
- **The `[data-sonner-toaster]` coupling** (`CSSPasteDialog.vue:7`,
  `KeyframesEditor.vue:78`) → centralize into ONE documented helper
  (`isInsideToaster(el)` in a composable or util) whose single body holds the
  `closest('[data-sonner-toaster]')` check with an explicit comment naming the
  sonner DOM contract + version it depends on. Two duplicated brittle checks
  become one named, documented contract; if sonner renames the attribute, ONE
  place changes and the comment says so.

**WHY:** these are the three brittle DOM reaches the lane isolated. The global
`querySelectorAll("pre")` is the worst — a component mutating the entire
document's `<pre>` elements (verified §State 1); a `useTemplateRef` confines it
to the component's own markup (the idiomatic Vue 3 ownership). The
`.closest(".class")` walk is fragile to a class rename (verified §State 2 — C
already moved the vars to an owned class; this finishes the job by owning the
REFERENCE too). The `[data-sonner-toaster]` check couples to a vendor's private
DOM with no documentation (verified §State 3); a named helper makes the coupling
deliberate + greppable. All three are robustness wins with zero behaviour change
on the happy path.

### S2 — The z-index scale documented as an ordered layer contract — brittleness-findings §2

**WHAT:** the z-index work, scoped to what the demo ACTUALLY needs (C already
single-sourced the scale upstream):
- **Document the ordered layer set.** The glass-ui `--z-*` family
  (`content:10 < controls:20 < bar:30 < dock:40 < overlay:50 < popover:130 <
  modal:140`, glass-ui `tokens.css:270-280`) is the demo's z-order contract —
  record it as ONE ordered layer set in a demo doc/comment (which demo surface
  sits at which rung + why), so a new component knows where to stack without
  guessing a number.
- **Forbid raw `z-[N]` drift.** A gate clause asserts zero raw `z-[N]`
  bracket-arbitrary value in demo source (today: zero — the gate LOCKS the clean
  state against future drift).
- **Reconcile the one orphan raw `z-index` + the four raw rungs.**
  `CubeTarget.vue:199` `z-index: -10` (the below-plane axis line) → a named
  `--z-behind: -10` token in the demo's z-contract (the only raw `z-index:` in
  the tree). The four raw tailwind rungs that consume the scale by number rather
  than the semantic names (`z-10` `CubeTarget.vue:42`, `z-20` `CubeScene.vue:117`,
  `z-10` `MatrixEditor.vue:13`, `z-0` `KeyframeCard.vue:23`) → reconcile to named
  layers where they map to a documented rung, or record them as deliberate local
  stacking — so EVERY z-value in the demo reads off ONE ordered, named set or is
  explicitly noted.

**WHY:** an undocumented z-index scale is a guessing game — a new component
picks a number and hopes; a documented ordered set is a contract. The demo
already CONSUMES the single-sourced glass-ui scale (verified §State 4 — 20+
`z-dock`/`z-content`/etc. sites, zero raw `z-[N]`), so the work is DOCUMENTING
the contract + GATING against drift + reconciling the one orphan raw value
(`z-index: -10`), NOT inventing a scale the demo lacks. The lane's "undocumented
z-index scale" finding is honest about the gap (no document) without
overclaiming (the scale exists + is consumed cleanly).

### S3 — `@supports` guards + the viewport-trap audit — brittleness-findings §3

**WHAT:** add fallback paths for the browser-dependent properties + audit the
viewport shell:
- **`env(safe-area-inset-*)`** (`AnimationMenuBar.vue:4`, `TopDock.vue:114`,
  `style.css:54`) → already wrapped in `max(…, …)` / `calc(…, fallback)` in
  some sites; ensure every consumer has a `0px` fallback inside the `env()`
  AND an `@supports not (padding: env(safe-area-inset-bottom))` path where the
  layout needs the non-`env` baseline. The dock band must reserve correctly on
  a browser without safe-area support.
- **`dvh`** (`EditorShell.vue:3` `h-dvh max-h-dvh`, the `style.css` work-area
  chain) → an `@supports not (height: 100dvh)` fallback to `vh` (or `%`), so
  the shell sizes on a browser without `dvh` (older Safari/Firefox). The
  work-area chain's `min(100dvh, …)` already degrades, but the bare `h-dvh`
  shell needs the guard.
- **`-webkit-mask-image`** (`AnimationControlsGroup.vue:548-549`,
  `AnimationControls.vue:229-235`, the scroll-fade gradients) → an `@supports`
  guard so a browser without mask-image support shows the content un-faded
  (graceful) rather than a broken mask. Pair the `mask-image` and
  `-webkit-mask-image` declarations and gate the fade.
- **The viewport-trap audit.** Verify the `h-dvh max-h-dvh overflow-hidden`
  editor shell (`EditorShell.vue:3`) never traps content off-screen — that the
  inner scroll regions can always reach their content under the dock band on
  every viewport. Run the C occlusion gate's controls-OPEN axis as the
  empirical check (it already drives that state).

**WHY:** the demo depends on three browser features with ZERO `@supports`
fallback (verified §State 5 — no `@supports` anywhere in the demo), so each
degrades silently on a browser lacking it. `env()` without a fallback means the
safe-area reserve collapses; `dvh` without a fallback means the shell mis-sizes;
`mask-image` without a guard means a broken fade. Each guard is a few lines that
make the failure path graceful — the robustness the no-legacy mandate implies
(ship code that degrades, not breaks). The viewport-trap audit confirms the
`overflow-hidden` shell + the work-area chain (already cycle-free, §State 6)
never park content where it cannot be reached — the empirical close on the
mobile-cramp class of bug C named.

### S4 — Reactivity hardened: rAF bridge gate · array-watch flush · listener re-attach — brittleness-findings §4

**WHAT:** three reactivity hardenings, each respecting its named hazard:
- **Gate the `useAnimationSync` rAF bridge.** Today it polls three refs every
  frame UNCONDITIONALLY (verified §State 7) with a documented chicken-and-egg
  hazard (gating naively on `isStarted` deadlocks). Gate it CORRECTLY: run the
  loop while the animation CAN change (playing, or a transition is in flight,
  or the page is visible AND a settle has not been observed), and idle the loop
  when the animation is provably static — using a settle-detect + visibility,
  NOT the naive `isStarted` guard the docstring warns against. The happy path
  (animating) is byte-identical; only the idle path stops burning frames.
  Prefer `useRafFn`'s `pause`/`resume` (vueuse) over the hand-rolled
  `useRafLoop` if the gating logic is cleaner expressed there (aligns with
  D.W1's vueuse adoption).
- **Fix the `useKeyframesEditor` array-watch flush.** The
  `watch(animation.templateFrames, async () => …)` (`useKeyframesEditor.ts:353`)
  re-derives `templateFrameStrings` from a churning array; ensure a
  deterministic flush (`flush: 'post'` or an explicit `nextTick` barrier) so a
  stale frame array cannot paint between the array mutation and the derived
  string recompute — the array-watch races the render today.
- **Harden the `useScrollFade` listener re-attach.** It already re-attaches on
  `watch(el)` / `watch(observeEl)` and tracks `boundScrollEl` (verified §State
  8); harden the cleanup so a mid-flight `el` swap always detaches the OLD
  `boundScrollEl` before binding the new one (no leaked listener on the prior
  element), and the `onUnmounted` path is idempotent.

**WHY:** these are the three reactivity seams that fail under churn (verified
§State 7-8). The ungated rAF bridge is a real idle cost on battery devices — a
loop polling forever for an animation that finished; gating it (respecting the
documented deadlock hazard) is free CPU at idle with no happy-path change. The
array-watch race can paint a stale keyframe between mutation and recompute; a
deterministic flush closes it. The scroll listener re-attach is mostly sound —
the hardening is the edge (mid-flight `el` swap leaking the old listener). Each
is robustness under the exact churn the demo's interactive editing produces.

### S5 — The engine `_snapSettled` symmetry (D-6) — C.md §deferred-ledger (W0-slipped)

**WHAT:** make the two steppers' reduced-motion snap contract-equivalent.
Today (verified §State 9):
- `SpringProgress._snapSettled` (`spring.ts:188`) resets
  origin/velocity/elapsed, calls `this.emit()`, AND calls `this._playback.stop()`.
- `SmoothProgress._snapSettled` (`smooth.ts:99`) sets `currentValue =
  targetValue`, `isSettled = true`, calls `this._onFrame?.(…)` — but does NOT
  stop a running managed loop.

Reconcile: both `_snapSettled` paths must leave the stepper in the SAME settled
state — value at target, settled true, the managed loop NOT spinning, one
terminal emit. If smooth's managed loop should stop on snap (the spring
behaviour), make it stop; if smooth's loop is structurally different (it
auto-resumes on `_onFrame` re-attach, per `smooth.ts:90-94`) and must NOT stop,
document WHY the asymmetry is intentional + correct. Either way the contract is
explicit, not accidental.

**WHY:** this is the W0-booked residual that slipped W4 (C.md §deferred-ledger,
`_snapSettled` asymmetry KFD to D.W3). Two steppers implementing one
reduced-motion-snap contract with different loop behaviour is exactly the
gestalt-tail D exists to close — either a real bug (smooth leaks a spinning
loop after a reduced-motion snap) or an undocumented intentional difference
(which the no-legacy mandate says must be documented, not latent). The fix is
small + scoped to the two `_snapSettled` bodies; the close is a test that both
steppers leave the same settled state after a reduced-motion snap.

### S6 — The `proof:brittleness` instrument — brittleness-findings §5 (the falsifiable close)

**WHAT:** a checked-in, re-runnable instrument (`scripts/proof-brittleness.mjs`,
wired `npm run proof:brittleness`) that BITES on three clauses:
1. **Zero global `document.querySelector*` in demo components.** `grep -rn
   "document\.querySelector"` over `demo/` `.vue`/`.ts` (excluding `dist/` +
   the allowlisted `document.head.querySelector("#…")` style-element idioms,
   which are the documented dynamic-stylesheet pattern, not DOM reaches) = 0.
   BITES: `KeyframesEditor.vue:439`'s `document.querySelectorAll("pre")` fails
   it today.
2. **The z-scale single-sourced — no raw `z-[N]` outside it.** `grep -rno
   "z-\\[[0-9]" demo/` (excluding `dist/`) = 0, AND every `z-index:` raw value
   in demo source resolves to a named `--z-*` token. BITES: locks the clean
   state + catches the one raw `z-index: -10` until it is named.
3. **`@supports` guards present for the named properties.** Assert the demo's
   built CSS carries `@supports` rules covering `dvh`,
   `env(safe-area-inset-*)`, and `-webkit-mask-image`. BITES: today the demo
   has zero `@supports` rules (verified §State 5), so this reds until the
   guards land.

Plus the engine test for S5: `test/smooth.test.ts` + `test/spring.test.ts`
assert both steppers leave the identical settled state after a reduced-motion
`_snapSettled` (no spinning loop, value at target, one emit).

The instrument runs in CI's demo job; the stepper test runs in `npm test`.

**WHY:** brittleness closure is only honest if a gate BITES on the brittle
pattern's return (inv ε). A grep for global `document.querySelector*` is the
falsifiable form of "no component reaches outside itself"; a grep for raw
`z-[N]` + a check that every `z-index` is named is the falsifiable form of "the
z-scale is single-sourced"; an `@supports`-presence check is the falsifiable
form of "the named properties degrade gracefully." Each reds on the exact
brittleness this wave removes, so "brittleness hardened" means what it says.

## § Hard gate

The wave closes when every clause VERIFIES (each BITES — a real grep / render /
test, not an assertion):

1. **Zero global `document.querySelector*` in demo components.** `npm run
   proof:brittleness` clause 1 PASSES (the allowlisted `document.head.querySelector("#styleId")`
   dynamic-stylesheet idiom excepted + documented). BITES:
   `KeyframesEditor.vue:439` reds it today.
2. **The z-scale single-sourced.** `proof:brittleness` clause 2: zero raw
   `z-[N]` in demo source AND every `z-index:` raw value resolves to a named
   `--z-*` token (the `z-index: -10` → `--z-behind`). The ordered layer set is
   documented. BITES: locks the clean state; catches the one orphan raw value.
3. **`@supports` guards present.** `proof:brittleness` clause 3: the built demo
   CSS carries `@supports` rules for `dvh`, `env(safe-area-inset-*)`, and
   `-webkit-mask-image`. BITES: the demo has zero `@supports` today.
4. **The brittle selectors are owned.** `EasingTarget` reads its vars off an
   owned `ref`, not `.closest(".easing-target")`; the `<pre>` highlight is
   scoped to the component's own refs; the `[data-sonner-toaster]` check is ONE
   documented `isInsideToaster()` helper. (verified by read + the clause-1 grep)
5. **The reactivity paths are hardened.** `useAnimationSync`'s rAF bridge idles
   when the animation is provably static (verified: a capture shows the loop
   paused at idle — e.g. no rAF callbacks logged after settle — and resuming on
   play, with NO chicken-and-egg deadlock); `useKeyframesEditor`'s array-watch
   flushes deterministically (no stale-frame paint under rapid edit);
   `useScrollFade` detaches the old listener on a mid-flight `el` swap (no
   leaked listener). The occlusion + dogfood gates stay green.
6. **The `_snapSettled` symmetry holds.** `test/smooth.test.ts` +
   `test/spring.test.ts` assert both steppers leave the identical settled state
   after a reduced-motion snap (value at target, settled true, loop not
   spinning, one terminal emit) — OR the asymmetry is documented as intentional
   with the test asserting the documented difference. BITES: today smooth's
   `_snapSettled` does not stop its loop while spring's does.
7. **No regression, no new legacy.** The engine tests stay green (the
   `_snapSettled` change is scoped to the two snap bodies); the demo gates
   (occlusion, lighthouse, dogfood, the new `proof:idioms` from D.W2) stay
   green; the happy paths are byte-identical (only failure/idle paths improve).
   No new brittle selector, no new unguarded feature, no new raw z-value.

## § Folds

Retires (by finding id / ledger item):
- **brittleness-findings §1** (the brittle DOM selectors: global `pre`,
  `.closest(".easing-target")`, the `[data-sonner-toaster]` coupling) — S1 +
  S6.1.
- **brittleness-findings §2** (the undocumented z-index scale) — S2 + S6.2.
  HONEST scope: the scale EXISTS + is consumed cleanly (glass-ui-single-sourced,
  zero raw `z-[N]`); the gap closed is the DOCUMENTATION + the drift gate + the
  one orphan raw `z-index: -10`.
- **brittleness-findings §3** (no `@supports` fallback for `env()`/`dvh`/
  `-webkit-mask-image`; the viewport-trap audit) — S3 + S6.3.
- **brittleness-findings §4** (the reactivity seams: ungated rAF bridge,
  array-watch flush, listener re-attach) — S4.
- **C.md §deferred-ledger** (the W0-slipped engine `_snapSettled` asymmetry,
  KFD to D.W3) — S5 + S6 (the stepper test).

**Routed OUTWARD / RECORDED (not this wave):**
- **The sonner DOM attribute contract** (`[data-sonner-toaster]`) — the
  coupling is INTRINSIC to guarding against in-toast paste; D does not remove it
  (there is no public sonner API for "is this element inside a toast"), it
  DOCUMENTS + centralizes it (S1). If sonner ships a public predicate, a later
  follow-on adopts it — RECORDED, not deferred-without-owner.
- **The `useRafLoop` vs `useRafFn` choice** — the rAF-bridge gating (S4) may
  adopt vueuse's `useRafFn` (its `pause`/`resume` express the gate cleanly),
  converging with D.W1's vueuse adoption; the exact composable is a D.W1/D.W3
  shared call, recorded so the two waves do not fork the rAF primitive.

## § Design decisions

1. **Own the reference, not just the element.** RESOLVED: C.W2 already moved the
   EasingTarget vars off the leaked global `.glass-card` onto an owned
   `.easing-target` class — D.W3 finishes the ownership by reading the element
   via a `useTemplateRef` instead of `.closest(".easing-target")`. The string-
   class DOM walk is the LAST brittleness in that path: robust against a class
   rename, idiomatic Vue 3, and it makes the component's ownership of its own
   DOM total. Trade-off: passing a ref through the component tree is marginally
   more plumbing than a `closest()` call — but the plumbing is explicit
   ownership, which is the point.

2. **Document + gate the z-scale; do NOT invent one.** RESOLVED + HONEST (inv
   ε): the demo already consumes the glass-ui single-sourced `--z-*` scale with
   zero raw `z-[N]` drift (verified). The lane's "undocumented z-index scale"
   finding is honest about the missing DOCUMENT without overclaiming a missing
   scale. D documents the ordered layer set, gates against future raw drift, and
   names the one orphan raw `z-index: -10` — the smallest correct intervention.
   The FINAL must not claim "D built the z-scale" (glass-ui did, consumed in C);
   it claims "D documented + gated the z-contract + named the last orphan."

3. **Gate the rAF bridge WITHOUT the chicken-and-egg deadlock.** RESOLVED: the
   `useAnimationSync` docstring names a real hazard — gating naively on
   `isStarted` deadlocks (`isStarted` never flips because the loop reading it is
   gated off). D respects this: the gate is a settle-detect + visibility (idle
   only when the animation is PROVABLY static and the page hidden/settled), not
   the naive guard. Trade-off: the gating logic is more than `if (isPlaying)` —
   but a few lines of correct gating buy a phone's idle battery back, and the
   happy path stays byte-identical. The capture proves the loop idles at settle
   and resumes on play with no deadlock.

4. **`@supports` guards make the FAILURE path graceful — the happy path is
   untouched.** RESOLVED: every guard wraps a FALLBACK for the no-feature
   browser; the feature-present path (the overwhelming majority) renders
   identically. `dvh` → `vh` fallback, `env()` → `0px`/baseline fallback,
   `mask-image` → un-faded content. Trade-off: a handful of `@supports` blocks
   add lines — but they convert silent breakage into graceful degradation, the
   robustness the no-legacy mandate implies. Isomorphic on every modern browser;
   only the unsupported edge changes (for the better).

5. **`_snapSettled` symmetry: equalize OR document the difference.** RESOLVED:
   the two steppers must leave the same settled state after a reduced-motion
   snap, OR the difference must be documented as intentional + correct (smooth
   auto-resumes on `_onFrame` re-attach, which spring does not — that MAY justify
   smooth not stopping its loop, but only if documented + tested). The
   no-legacy mandate forbids a latent asymmetry; the close is a test asserting
   the (equalized or documented) contract. Trade-off: equalizing is the simpler
   contract (one reduced-motion behaviour); documenting the difference preserves
   smooth's auto-resume — the implementation chooses based on whether smooth's
   loop SHOULD spin after a reduced-motion snap (it should not — reduced motion
   means no loop), favoring equalization unless the auto-resume semantics
   genuinely require otherwise.
