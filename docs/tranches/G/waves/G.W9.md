# G.W9 — The rAF-leak lifecycle correction (HIGH — the one real NEW brittleness defect)

**Phase:** IMPL — spec authored in DEV, awaits authorization (the D/E/F dev/impl
boundary) · **Class:** SHIP-in-G (the demo brittleness surface — a HIGH correctness
fix: a perpetual rAF leak; behaviour-isomorphic for the live scene, the only delta is
the intended one — the leaked loop now stops on swap) · **Scope:** `demo/**` only —
`demo/easing/useEasingDemo.ts`, `demo/spring/useSpringDemo.ts` (the HIGH — re-home
the rAF cleanup), `demo/sequence/useSequenceDemo.ts`, `demo/app/scenes/AmigaScene.vue`
(the dead-but-harmless hooks), `demo/app/App.vue` (the fossil "KeepAlive" comments),
`demo/@/components/custom/animation-controls/controls/AnimationVisualizer.vue` (the
`coastPlayback` unmount stop) + the gate script (`scripts/proof-brittleness.mjs` —
extend clause 4 with the lifecycle sub-clause) — ZERO library (`src/**`) or CI edit ·
**DAG: independent of Bands 0/1** (the re-pin `G.W2` touches no demo scene loop; the
fix re-homes onto an in-tree seam — `a-frontend-brittleness §1`); runs in parallel —
Band-4 sibling of `G.W7` (encapsulation) + `G.W8` (state), file-disjoint from both ·
**Gated on:** keyframes' own green CI (inv-27). **SHIP FIRST in the frontend band**
(`_SYNTHESIS-frontend §6`: the one HIGH — a real, perpetual rAF leak with a biting gate).

**Title.** *Four scene loop-owners wire their rAF cleanup to `onDeactivated` — a
`<KeepAlive>`-only hook — but the scene host is a bare keyed `<Suspense>` with NO
`<KeepAlive>`, so those hooks NEVER fire. For Easing + Spring the dead hook is the
ONLY unmount-time `stop()`, so swapping away mid-play LEAKS the rAF preview loop,
perpetually, every swap. Re-home the cleanup on `onScopeDispose`/`onBeforeUnmount`,
mirroring `useRafLoop.ts:56`; delete the dead hooks + the App.vue fossil comments +
the unowned `coastPlayback`.*

This is an **inv-κ-class regression the E.W2 gate does NOT see** — `proof:brittleness`
clause 4 greps `addEventListener`/`ResizeObserver`, not lifecycle-hook misuse
(`a-frontend-brittleness §1` inv-ε note; verified `scripts/proof-brittleness.mjs`
clause-4 LISTENER regex is `\.addEventListener\s*\(|new\s+ResizeObserver\b`). The
inv-κ surface E.W2 closed is otherwise HOLDING — `proof:brittleness` PASSES all four
clauses, the querySelector couplings are owned refs / single-vendor contracts, the NEW
F scenes carry zero brittle DOM reaches (`a-frontend-brittleness §3`). The honest
residual is this ONE defect — and the gate that already forbids the raw listener should
forbid the dead activation hook, since both are "lifecycle not on the auto-dispose
seam." A focused lifecycle correction, gated. NOT a rebuild.

**The Mandate spine (binding — `_SYNTHESIS-gap-scorecard §THESIS` + the G charter).**
NO quick solution / NO workaround: the fix re-homes onto the GENUINE unmount seam
(`onScopeDispose`/`onBeforeUnmount`, the in-tree template `useRafLoop.ts:56`
`onUnmounted(stop)`), NOT a re-introduced `<KeepAlive>` to make the dead hooks fire
(which would re-open B.W3's blank-viewport blocker — `App.vue:109-118`). NO legacy: the
dead `onActivated`/`onDeactivated` hooks are dead code templated from an era when a
`<KeepAlive>` host was assumed — they are EXCISED, not preserved; the `App.vue` fossil
"KeepAlive" comments are deleted so the host's no-KeepAlive contract reads true. KISS ·
DRY: ONE cleanup seam (the auto-dispose seam the rest of the tree uses —
`useRafLoop.ts:56`, `AmigaScene`'s own `onBeforeUnmount`, `CubeScene`), not four bespoke
lifecycle wirings. Measure-first does NOT bind (a correctness fix — a perpetual leak —
not a perf claim); the gate is a falsifiable lifecycle-grep that BITES, not a bench.
Isomorphic: pixel- and behaviour-isomorphic for the LIVE scene (mount-time start is what
runs today; the dead hooks contribute nothing); the only behaviour DELTA is the intended
one — the leaked loop now stops on swap (`a-frontend-brittleness §1` isomorphism note).
inv ε: every claim below cites `file:line`, source-verified on `tranche-g-dev`, not
asserted. inv-κ (E.W2) HOLDS for the rest of the surface (`proof:brittleness` PASS) —
manufacture NO work where E led.

**Provenance.** `a-frontend-brittleness §1a` (the perpetual rAF leak — `useEasingDemo`
+ `useSpringDemo`, dead `onDeactivated` the only unmount stop; HIGH SHIP), `§1b`
(dead-but-harmless `onActivated`/`onDeactivated` + mid-play swap unowned loop —
`AmigaScene`/`useSequenceDemo` + the `App.vue` fossil; MED SHIP), `§2`
(`AnimationVisualizer` `coastPlayback` no unmount stop — bounded; LOW SHIP). Synthesised
at `_SYNTHESIS-frontend §2 TIER 1` (F-H1/F-H1b/F-H1c — "the single highest-leverage
correctness SHIP in the frontend band") + `_SYNTHESIS-gap-scorecard §1` (frontend-
brittleness row: "ALREADY-SOTA + 1 real NEW … Easing/Spring leak the rAF preview loop
perpetually") + `§2 Band 4 G.W9`.

---

## § State, verified (not asserted)

The live facts, `grep`- and read-confirmed on `tranche-g-dev`:

1. **The scene host has NO `<KeepAlive>`, by deliberate design.** Verified live
   `app/App.vue:109-118`: the scene host is a bare keyed `<Suspense>` (`:125`
   `<Suspense :key="activeSceneKey">`); the comment at `:110` documents *"NO <KeepAlive>"*
   — a wrapping `<KeepAlive>`/`<Transition>` over the keyed `<Suspense>` "never triggered
   the chunk fetch — amiga/square/easing/spring shipped a BLANK viewport, B.W3's headline
   blocker; the lazy boundary survives on the BARE `<Suspense>` alone." Exactly one scene
   mounted at a time, hard-cut on swap, full unmount/remount
   (`useSceneVisibilityPause.ts:7-8` states the same). Grep `KeepAlive`/`keep-alive` over
   `demo/**` `.vue` returns ONLY comments (`App.vue:110`, `:197`, `:268`) — ZERO real
   `<KeepAlive>` in the render tree.

2. **Vue fires `onActivated`/`onDeactivated` ONLY inside a `<KeepAlive>` boundary.** With
   no `<KeepAlive>` anywhere above the scene host (§State 1), every `onActivated`/
   `onDeactivated` in a scene is **dead code that never runs** (Vue 3 lifecycle contract —
   these are the cached-component activation hooks). Four scene loop-owners wire to them,
   verified live:
   - `easing/useEasingDemo.ts:180` `onActivated(ensureLoop)` / `:181`
     `onDeactivated(() => playback.stop())`.
   - `spring/useSpringDemo.ts:236` `onActivated(ensureLoop)` / `:237`
     `onDeactivated(() => playback.stop())`.
   - `sequence/useSequenceDemo.ts:232` `onDeactivated(…)` / `:236` `onActivated(…)`.
   - `app/scenes/AmigaScene.vue:118` `onDeactivated(…)` / `:122` `onActivated(…)`.

3. **(a) PERPETUAL rAF LEAK — `useEasingDemo` + `useSpringDemo` `[HIGH]`.** Verified
   live: each owns a raw `RAFPlayback` (`useEasingDemo.ts:135`
   `markRaw(new RAFPlayback())`, `useSpringDemo.ts:125`) started via an `immediate: true`
   watcher (`useEasingDemo.ts:176-178`, `useSpringDemo.ts:227-233`). Their ONLY
   unmount-time `playback.stop()` is the dead `onDeactivated` — there is NO
   `onUnmounted`/`onScopeDispose` in either file (grep returns only `onActivated`/
   `onDeactivated` for lifecycle). `RAFPlayback` carries no scope-tied auto-cleanup
   (`playback.ts:61-132` — `_run` reschedules via `requestAnimationFrame` while the step
   returns truthy). On unmount the component's `isPlaying` ref is NOT reset — it stays
   `true`, so after the Suspense hard-cut unmounts the scene, the detached loop keeps
   rescheduling FOREVER. Swap away from Easing- or Spring-while-playing → leak.
   `useSceneVisibilityPause` only pauses on tab-hide, not scene-swap (`§State 6`), so it
   does not cover this (`a-frontend-brittleness §1a`).

4. **(b) DEAD-BUT-HARMLESS — `AmigaScene` + `useSequenceDemo` `[MED]`.** Verified live:
   `AmigaScene.vue:136` has a REAL `onBeforeUnmount` (stops the render loop + Three.js
   disposal) and `onMounted` (not `onActivated`) starts the loop — so its dead
   `onActivated`/`onDeactivated` (`:118,:122`) cause NO leak but are dead code that
   misleads. `useSequenceDemo.ts:232-238`'s `onDeactivated` stops the mirror + sequence,
   but there is NO `onUnmounted` either; the current scene doesn't perpetually leak only
   because the Sequence's own `play().finally` + the mirror's self-terminating loop wind
   down at motion end — but a scene swapped away MID-PLAY leaves the RAFPlayback + mirror
   running until the sequence naturally completes (a bounded-but-unowned leak). The
   `onActivated` is pure dead code (`a-frontend-brittleness §1b`).

5. **The root cause is a copy-template; the `App.vue` fossils confirm it.** Verified live:
   all four carry a "KeepAlive lifecycle" comment (`useEasingDemo.ts:175`
   *"Auto-start + KeepAlive lifecycle"*, `useSpringDemo.ts:235`); `App.vue:197` carries
   the fossil *"Unified scene component/key/props for KeepAlive (requires single child)"*
   over the `activeSceneComponent` computed, and `App.vue:268` a second fossil *"KeepAlive
   slot transitions into the (possibly cached) CubeScene"* — both over a host that has NO
   KeepAlive (§State 1). The F.W10/W12 NEW scenes (`useSequenceDemo`) inherited the dead
   pattern verbatim (`a-frontend-brittleness §1` headline).

6. **The CORRECT seam is already in the tree.** Verified live `useRafLoop.ts:56`
   `onUnmounted(stop)` for its raw `RAFPlayback` (`:19`) — the auto-dispose template.
   `AmigaScene.vue:136` `onBeforeUnmount` + `CubeScene` use the genuine unmount seam.
   `useSceneVisibilityPause` rides `useDocumentVisibility` (an honest "only resume what IT
   paused" contract) but covers tab-hide, NOT scene-swap — which is precisely why the
   unmount cleanup must live on `onScopeDispose`, not rely on it
   (`a-frontend-brittleness §3`).

7. **`AnimationVisualizer.coastPlayback` has no unmount stop (bounded) `[LOW]`.** Verified
   live `AnimationVisualizer.vue:135` `const coastPlayback = new RAFPlayback()` (a second
   raw playback for the fling-coast); its sync loop rides `useRafLoop` (auto-cleaned,
   `:227-229`), but `coastPlayback` is stopped only on drag-start (`:192`) and
   self-terminates via `RAFPlayback.drive`'s settle loop (`:171`). There is NO
   `onUnmounted`/`onScopeDispose` for it (grep returns none). Unmounting mid-fling leaves
   it running until the spring settles — a BOUNDED micro-leak (distinct from §State 3's
   perpetual leak) (`a-frontend-brittleness §2`).

8. **The `proof:brittleness` clause-4 gate does NOT see this.** Verified live
   `scripts/proof-brittleness.mjs` clause 4: the LISTENER regex is
   `\.addEventListener\s*\(|new\s+ResizeObserver\b` — it greps manual listeners/observers,
   NOT lifecycle-hook misuse. The gap is real, the gate is blind to it
   (`a-frontend-brittleness §1` inv-ε). `proof:brittleness` is in `proof:all`
   (`package.json:46,64`).

The wave's job: excise the dead `onActivated`/`onDeactivated` from all four scene
loop-owners and re-home the cleanup on the genuine unmount seam (`onScopeDispose`/
`onBeforeUnmount`, mirroring `useRafLoop.ts:56`); add the `coastPlayback` dispose stop;
delete the `App.vue:197`/`:268` fossil comments; and extend `proof:brittleness` clause 4
with a lifecycle sub-clause that BITES today on the 4 files.

---

## § Goal

**What lands:**

- **The HIGH leak CLOSED — `useEasingDemo` + `useSpringDemo`.** Excise the dead
  `onActivated`/`onDeactivated` (`useEasingDemo.ts:180-181`, `useSpringDemo.ts:236-237`)
  and re-home the cleanup on `onScopeDispose(() => playback.stop())` (the composable seam,
  mirroring `useRafLoop.ts:56` `onUnmounted(stop)`). The `onActivated(ensureLoop)`
  start-on-activate is replaced by the `onMounted`/`immediate`-watcher start each scene
  already has (the scene re-mounts on every swap-in under Suspense, so mount-time start is
  correct and complete). After the SHIP, swapping away mid-play stops the loop.
- **The dead hooks DELETED — `useSequenceDemo` + `AmigaScene`.** Excise the dead
  `onActivated`/`onDeactivated` (`useSequenceDemo.ts:232-238`, `AmigaScene.vue:118-124`).
  `useSequenceDemo` re-homes its mirror + sequence stop on `onScopeDispose` (giving the
  mid-play swap an honest stop, §State 4); `AmigaScene` already has the REAL
  `onBeforeUnmount` (`:136`) — the dead hooks are pure deletion.
- **The `coastPlayback` unmount stop added.** Add
  `onScopeDispose(() => coastPlayback.stop())` in `AnimationVisualizer.vue` (next to the
  existing `useRafLoop` usage) — one line, completes the "every raw `RAFPlayback` owner
  stops on dispose" invariant (§State 7).
- **The `App.vue` fossil comments deleted.** Strike the `App.vue:197` + `:268` "KeepAlive"
  fossil comments so the host's no-KeepAlive contract (§State 1) reads true. (The `:110`
  comment, which CORRECTLY documents *"NO <KeepAlive>"* and WHY, stays.)
- **`proof:brittleness` clause-4 lifecycle sub-clause** (new) — grep demo `.vue`/`.ts`
  (comment-blanked, `dist/` excluded) for `onActivated(` / `onDeactivated(` and assert
  ZERO hits WHILE no real `<KeepAlive>`/`keep-alive` exists in the `demo/**` render tree
  (a PAIRED grep — currently zero real KeepAlive). BITES today on the 4 files; green after
  the SHIP. Stale-guard the KeepAlive grep so re-introducing a genuine `<KeepAlive>`
  re-permits the hooks in ONE motion (no silent rot).

**Why:** the rAF preview loop leaks perpetually on every play-then-swap for Easing +
Spring — a real, user-reachable resource leak (every swap-away-while-playing leaves a
detached `requestAnimationFrame` loop rescheduling forever). The cleanup is wired to a
hook that cannot fire (the host has no `<KeepAlive>`, by design), so the fix is to re-home
onto the genuine unmount seam the rest of the tree already uses. The dead hooks in
`useSequenceDemo`/`AmigaScene` and the `App.vue` fossils are the same copy-template
residue — excised so the no-KeepAlive contract is honest and the next NEW scene copies a
correct template. The gate that forbids the raw listener is extended to forbid the dead
activation hook — both are "lifecycle not on the auto-dispose seam."

**What does NOT land (recorded so no future lane re-raises):**
- **Re-introducing a `<KeepAlive>` host** — REJECTED: it re-opens B.W3's blank-viewport
  blocker (the `<KeepAlive>` wrapper never triggered the async chunk fetch —
  `App.vue:109-118`). The fix is the unmount seam, NOT making the dead hooks fire.
- **Touching `RAFPlayback` itself** (`src/animation/playback.ts`) — it is correct; it is
  NOT the engine's job to tie into a Vue scope, the demo consumer must call `stop()` on
  dispose (`a-frontend-brittleness` cross-repo: NONE). The fix is demo-side only.

---

## § Scope

### S1 — close the HIGH leak: re-home `useEasingDemo` + `useSpringDemo` cleanup on the unmount seam (`a-frontend-brittleness §1a`) — SHIP-in-G (HIGH, the spine of this wave)

**WHAT:** in `useEasingDemo.ts` and `useSpringDemo.ts`, delete the dead
`onActivated(ensureLoop)` + `onDeactivated(() => playback.stop())`
(`useEasingDemo.ts:180-181`, `useSpringDemo.ts:236-237`) and add
`onScopeDispose(() => playback.stop())` (the composable's genuine dispose seam, mirroring
`useRafLoop.ts:56`). The `immediate: true` watcher (`useEasingDemo.ts:176-178`,
`useSpringDemo.ts:227-233`) already starts the loop on mount (and each swap-in re-mounts
under Suspense), so the `onActivated` start is redundant and its deletion is complete.
Update the "KeepAlive lifecycle" comment (`useEasingDemo.ts:175`, `useSpringDemo.ts:235`)
to name the genuine seam.

**WHY:** §State 1/2/3 — the dead `onDeactivated` is the ONLY unmount-time `stop()` for two
loops that own a raw `RAFPlayback` and never reset `isPlaying` on unmount, so the detached
loop reschedules forever after a mid-play swap. Re-homing on `onScopeDispose` (the seam
the rest of the tree uses) CLOSES the leak. Pixel/behaviour-isomorphic for the live scene;
the only delta is the intended stop-on-swap.

### S2 — delete the dead hooks: `useSequenceDemo` + `AmigaScene` + the App.vue fossils (`a-frontend-brittleness §1b`) — SHIP-in-G (MED)

**WHAT:** delete the dead `onActivated`/`onDeactivated` from `useSequenceDemo.ts:232-238`
and `AmigaScene.vue:118-124`. `useSequenceDemo` re-homes its mirror-stop + `sequence.stop`
on `onScopeDispose` (an honest mid-play-swap stop, §State 4); `AmigaScene` already has the
real `onBeforeUnmount` (`:136`) — its dead hooks are pure deletion. Delete the
`App.vue:197` + `:268` fossil "KeepAlive" comments (keep the correct `:110` no-KeepAlive
note).

**WHY:** §State 4/5 — dead code that misleads (the `AmigaScene` comment even reasons about
resume behaviour that never executes), plus a bounded-but-unowned mid-play-swap leak in
`useSequenceDemo`, plus fossil comments that make the host read as if it had a KeepAlive it
does not. Deleting them makes the no-KeepAlive contract honest and the NEW-scene template
correct.

### S3 — the `coastPlayback` unmount stop (`a-frontend-brittleness §2`) — SHIP-in-G (LOW, folds with S1)

**WHAT:** add `onScopeDispose(() => coastPlayback.stop())` in `AnimationVisualizer.vue`
next to the existing `useRafLoop` usage (`:227`). One line.

**WHY:** §State 7 — `coastPlayback` (a raw `RAFPlayback`, `:135`) has no dispose stop;
unmounting mid-fling leaves it running until the spring settles (a bounded micro-leak).
The line completes the "every raw `RAFPlayback` owner stops on dispose" invariant — the
gate's lifecycle sub-clause widens to cover RAFPlayback-ownership, catching this site too.
Behaviour-isomorphic (the spring settles within the same frame budget either way; this only
bounds the unmount-mid-fling edge).

> **RECORDED / REJECTED in this band — so no future lane re-litigates:**
> - **Re-introducing `<KeepAlive>`** — REJECTED. The dead hooks were templated for a
>   `<KeepAlive>` host that B.W3 PROVED breaks the async-chunk boundary (blank viewport,
>   `App.vue:109-118`). Making the hooks fire by adding KeepAlive re-opens a closed blocker;
>   the only correct move is the unmount seam.
> - **`src/animation/playback.ts` (`RAFPlayback`)** — ALREADY-SOTA, untouched. It is not
>   the engine's job to tie into a Vue scope; the demo consumer owns the `stop()` on dispose
>   (which `useRafLoop`/`AmigaScene`/`CubeScene` already do and the four §1 sites now will).
>   Cross-repo: NONE (`a-frontend-brittleness §3`).
> - **The rest of the inv-κ surface** — ALREADY-SOTA (`a-frontend-brittleness §3`):
>   `proof:brittleness` PASSES all 4 clauses; the B10/B11 querySelector couplings are owned
>   refs / single-vendor contracts; the NEW F.W10/W12 scenes carry zero brittle DOM reaches;
>   the listener/observer surface rides vueuse end-to-end; zero `:deep()`. Manufacture NO
>   work here.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real re-runnable instrument,
not an assertion). **The extension is to `proof:brittleness` clause 4 (the inv-κ gate) —
the same shape that already forbids the raw listener, now forbidding the dead activation
hook:**

1. **`proof:brittleness` clause-4 lifecycle sub-clause PASSES — zero dead activation
   hooks.** The sub-clause greps demo `.vue`/`.ts` (comment-blanked, `dist/` excluded) for
   `onActivated(` / `onDeactivated(` and asserts ZERO hits, PAIRED with a grep asserting
   ZERO real `<KeepAlive>`/`keep-alive` in the `demo/**` render tree (currently zero). **BITE:**
   reds TODAY on the 4 files (`useEasingDemo.ts:180-181`, `useSpringDemo.ts:236-237`,
   `useSequenceDemo.ts:232-238`, `AmigaScene.vue:118-124`); green after S1+S2.
   Re-introducing a dead `onActivated`/`onDeactivated` while no KeepAlive exists reds. The
   stale-guard: if a genuine `<KeepAlive>` is ever added to the tree, the paired grep
   flips and the hooks are re-permitted in ONE motion (no silent rot).

2. **The leak is provably stopped — a swap-then-frame witness.** A test (jsdom or a
   browser-driven smoke) mounts the Easing (or Spring) scene, starts playback, unmounts it
   (simulating the Suspense hard-cut), and asserts the owned `RAFPlayback` is no longer
   `running` / no `requestAnimationFrame` reschedules after dispose. **BITE:** reds TODAY
   (the loop reschedules forever — §State 3); green after S1. Reverting the
   `onScopeDispose` stop → the loop survives unmount → the clause reds.

3. **Every raw `RAFPlayback` owner stops on dispose (the widened invariant).** The
   lifecycle sub-clause is widened to assert every `new RAFPlayback()` owner in `demo/**`
   has a dispose-time `stop()` (on `onScopeDispose`/`onBeforeUnmount`/`onUnmounted` or via
   `useRafLoop`'s auto-cleanup). **BITE:** reds TODAY on `coastPlayback`
   (`AnimationVisualizer.vue:135`, no dispose stop — §State 7); green after S3. A new raw
   `RAFPlayback` without a dispose stop reds.

4. **No regression — the correction is inert on the live scene + the rest of the gate.**
   `npm test` stays green; `proof:brittleness` clauses 1–3 (the querySelector / z-scale /
   `@supports` clauses) are UNTOUCHED and stay green; the live scenes render + animate
   byte-stable (mount-time start is what runs today); the demo builds. **BITE:** any
   clause-1/2/3 regression, any live-scene behaviour diff (other than the intended
   stop-on-swap), or any `src/**` edit attributed to this wave reds (the wave is
   `demo/**`-only; `RAFPlayback` itself is untouched).

---

## § Folds

Retires (by finding id):
- **`a-frontend-brittleness §1a`** (the perpetual rAF leak — Easing/Spring, dead
  `onDeactivated` the only unmount stop; HIGH) — S1 + gate clauses 1/2.
- **`a-frontend-brittleness §1b`** (dead `onActivated`/`onDeactivated` + mid-play swap
  unowned loop — AmigaScene/useSequenceDemo + the App.vue fossils; MED) — S2 + gate clause 1.
- **`a-frontend-brittleness §2`** (`coastPlayback` no unmount stop; LOW) — S3 + gate clause 3.

**RECORDED / REJECTED in this band (see S3 callout):**
- **Re-introducing `<KeepAlive>`** — REJECTED (re-opens B.W3's blank-viewport blocker).
- **`src/animation/playback.ts` (`RAFPlayback`)** — ALREADY-SOTA, untouched (not the
  engine's job to tie into a Vue scope).
- **`a-frontend-brittleness §3`** (inv-κ HOLDS · querySelector couplings resolved · vendor
  reaches single-sourced · NEW scenes clean · undo on vueuse · no `:deep`) — ALREADY-SOTA,
  `proof:brittleness` PASS verified.

---

## § Design decisions (the trade-offs RESOLVED)

1. **Re-home on the unmount seam, NOT re-introduce `<KeepAlive>` — the host has no
   KeepAlive BY DESIGN.** RESOLVED: there are two ways to make a dead `onDeactivated`
   meaningful — add a `<KeepAlive>` so it fires, or move the cleanup to a hook that DOES
   fire. The first is rejected: `App.vue:109-118` records that a `<KeepAlive>` wrapper over
   the keyed `<Suspense>` "never triggered the chunk fetch — amiga/square/easing/spring
   shipped a BLANK viewport, B.W3's headline blocker." So the only correct move is the
   unmount seam (`onScopeDispose`/`onBeforeUnmount`), the seam `useRafLoop.ts:56` +
   `AmigaScene`'s own `onBeforeUnmount` already use. The gate (clause 1) defends this by
   forbidding the dead hook WHILE no KeepAlive exists — and self-relaxing if one is ever
   genuinely added.

2. **`onScopeDispose` for composables, `onBeforeUnmount` for SFCs — the in-tree
   convention.** RESOLVED: the composables (`useEasingDemo`/`useSpringDemo`/`useSequenceDemo`)
   re-home on `onScopeDispose` (the scope-tied seam — `useRafLoop.ts:56` is `onUnmounted`,
   equivalent at the component scope; `onScopeDispose` is the composable-correct spelling
   and works under any effect scope). The SFC `AmigaScene` already has `onBeforeUnmount`
   (its dead hooks are pure deletion). One seam per kind, mirroring what the tree already
   does — no fourth bespoke wiring (KISS/DRY).

3. **`onActivated`-start is dropped, not re-homed — the mount-time start already covers
   it.** RESOLVED: `onActivated(ensureLoop)` was meant to re-arm the loop on KeepAlive
   re-activation. With no KeepAlive, each swap-in is a FULL re-mount under Suspense, so the
   `immediate: true` watcher (`useEasingDemo.ts:176-178`) starts the loop on mount — the
   `onActivated` is redundant, not load-bearing. Dropping it (rather than re-homing to
   `onMounted`) is correct: the watcher is the single start authority, and adding an
   `onMounted` start beside it would be a second spelling of the same thing.

4. **Extend the EXISTING inv-κ gate — the dead hook IS a clause-4-shaped offence.**
   RESOLVED: `proof:brittleness` clause 4 forbids hand-rolled `addEventListener`/
   `ResizeObserver` because the scope-tied vueuse seam supersedes them — the EXACT shape of
   the dead activation hook (a lifecycle wiring the auto-dispose seam supersedes). Folding
   the lifecycle sub-clause into clause 4 (not a bespoke new gate) is the principled
   extension: the gate that forbids the raw listener should forbid the dead activation hook,
   since both are "lifecycle not riding the auto-dispose seam" (`_SYNTHESIS-frontend §2`
   synthesis note). The widening to RAFPlayback-ownership (clause 3) catches `coastPlayback`
   in the same instrument.

5. **This wave is `demo/**`-only — ZERO library surface; the leak is a CONSUMER defect.**
   RESOLVED: the leak is not an `RAFPlayback` bug — the engine primitive is correct, it is
   not its job to tie into a Vue scope. The defect is that four demo consumers wired cleanup
   to a hook that cannot fire. The fix is demo-side (the consumer owns `stop()` on dispose);
   `src/animation/playback.ts` is untouched (cross-repo: NONE — `a-frontend-brittleness §3`).
   The gate edits `scripts/proof-brittleness.mjs` (the lock, clause 4) — the only
   non-`demo/**` file touched, and it is the instrument, not behaviour.
