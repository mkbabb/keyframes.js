# Tranche G — Audit: demo frontend brittleness (lane `a-frontend-brittleness`)

**Scope.** Brittle selectors + reactivity in the demo on `tranche-g-dev` (post
D+E+F, kf 4.0.0). Two axes: (1) **CSS/DOM** — deeply-nested selectors, global
`document.querySelector` reaches, `.closest()`/`[data-*]` couplings, owned-ref vs
query; (2) **reactivity** — fragile watchers, re-attach hazards, rAF/listener
leaks not on vueuse. The binding charge is the **inv-κ surface** that E.W2 closed
(zero hand-rolled listener/observer in reactive code; the two `querySelector`
couplings → owned refs): VERIFY none regressed + none new. Read-only; zero source
edits (tranche dev). Every claim `file:line`-grounded against the live tree.

**Method.** Re-ran `proof:brittleness` (`scripts/proof-brittleness.mjs`) on
`tranche-g-dev` — **PASS, all 4 clauses green.** Re-greped the inv-κ surface
(`addEventListener` / `new ResizeObserver` / `querySelector` / `.closest` /
`:deep`) source-only across `demo/**`. Diffed the E.W2 brittleness ledger
(`docs/tranches/E/audit/brittleness-findings.md`, B1–B15) and the F.W10/W12 NEW
scenes (`sequence/`, `motion-path/` — landed AFTER the F demo audit
`docs/tranches/F/audit/a-demo-post-e.md`, which never saw them) against the live
code. Cross-checked the rAF-cleanup seam (vueuse `useRafFn` / `useRafLoop`'s
`onUnmounted` vs raw `RAFPlayback`).

---

## Headline

**The inv-κ surface E.W2 closed is HOLDING — verified, not asserted.**
`proof:brittleness` passes all four clauses; the `LISTENER_ALLOWLIST` is empty
and the stale-guard is green; the only `addEventListener` greps are two prose
comments (`useSceneVisibilityPause.ts:11`, `useOrbitalPointer.ts:224`); zero
`new ResizeObserver`/`MutationObserver`/`IntersectionObserver` in source; the two
former `querySelector` couplings are resolved (B10 → Vue-state read +
`tabTriggerEls` owned ref at `AnimationControls.vue:236-240`; B11 → child-ref
contract). The two surviving DOM reaches are the documented single-vendor
contracts (`[role=tablist]` at `AnimationControls.vue:249`; `[data-sonner-toaster]`
at `useToastGuard.ts:18-27`) — both LEAVE-hardened, both with owner notes. Zero
`:deep()`/`>>>` vendor-piercing selectors. **D+E left this exemplary.**

**The one NEW finding is a reactivity-lifecycle defect the F.W10/W12 NEW scenes
inherited from a copy-template, and it is real:** four scene loop-owners
(`useEasingDemo`, `useSpringDemo`, `useSequenceDemo`, `AmigaScene`) wire their
rAF cleanup to **`onDeactivated`** — a **`<KeepAlive>`-only lifecycle hook** —
while the scene host is a **bare keyed `<Suspense>` with NO `<KeepAlive>`**
(`App.vue:109-118`, `useSceneVisibilityPause.ts:7-8`). Vue **never fires
`onActivated`/`onDeactivated` without a `<KeepAlive>` ancestor**, so those hooks
are **dead code**. For two of the four (`useEasingDemo`, `useSpringDemo`) the
dead `onDeactivated` is the ONLY unmount-time `playback.stop()` — so swapping
away from the Easing or Spring scene **while it is playing leaks the rAF preview
loop**, perpetually, every swap. The correct seam is already in the same codebase:
`useRafLoop.ts:56` does `onUnmounted(stop)`, and `AmigaScene`/`CubeScene` use
`onBeforeUnmount`. This is an inv-κ-class regression (an rAF leak not riding the
auto-cleanup seam) the E.W2 gate does NOT catch — its clause 4 greps
`addEventListener`/`ResizeObserver`, not lifecycle-hook misuse.

---

## §1 — Scene rAF cleanup wired to dead `onDeactivated` hooks (no KeepAlive) → leak on swap `[HIGH — NEW, inv-κ class]`

**The host has NO `<KeepAlive>`, by deliberate design.** `App.vue:109-118`
documents it: a wrapping `<KeepAlive>`/`<Transition>` over the keyed `<Suspense>`
"never triggered the chunk fetch — amiga/square/easing/spring shipped a BLANK
viewport, B.W3's headline blocker"; the lazy boundary "survives on the BARE
`<Suspense>` alone." The scene host is a keyed `<Suspense>` (`App.vue:125`,
`:key="activeSceneKey"`) — **exactly one scene mounted at a time, hard-cut on
swap, full unmount/remount** (`useSceneVisibilityPause.ts:7-8` states this:
"a keyed `<Suspense>`, NO `KeepAlive`").

**Vue fires `onActivated`/`onDeactivated` ONLY inside a `<KeepAlive>` boundary**
(Vue 3 lifecycle contract — these are the cached-component activation hooks). With
no `<KeepAlive>` anywhere above the scene host, **every `onActivated`/`onDeactivated`
in a scene is dead code that never runs.** Four scene loop-owners wire to them:

| File | Hook | What it (never) does |
|------|------|----------------------|
| `easing/useEasingDemo.ts:180-181` | `onActivated(ensureLoop)` / `onDeactivated(() => playback.stop())` | start/STOP the rAF preview sweep |
| `spring/useSpringDemo.ts:236-237` | `onActivated(ensureLoop)` / `onDeactivated(() => playback.stop())` | start/STOP the shared spring rAF |
| `sequence/useSequenceDemo.ts:232-238` | `onDeactivated(stopMirror + sequence.stop)` / `onActivated(syncFromSequence)` | STOP the mirror + sequence loop |
| `app/scenes/AmigaScene.vue:118-124` | `onDeactivated(stopRenderLoop)` / `onActivated(startRenderLoop)` | STOP/start the WebGL present loop |

Two distinct consequences, by file:

**(a) PERPETUAL rAF LEAK — `useEasingDemo` + `useSpringDemo` `[HIGH]`.** These two
own a raw `RAFPlayback` (`useEasingDemo.ts:135`, `useSpringDemo.ts:125`) and
start the loop via an `immediate: true` watcher (`useEasingDemo.ts:176-178`,
`useSpringDemo.ts:227-233`). Their ONLY unmount-time `playback.stop()` is the
dead `onDeactivated`. There is **NO `onUnmounted`/`onScopeDispose`** in either
file (verified — grep returns only `onActivated`/`onDeactivated`). `RAFPlayback`
carries no scope-tied auto-cleanup (`playback.ts:61-132` — `_run` reschedules via
`requestAnimationFrame` while the step returns truthy; the `_gen` guard only
protects stop()+restart races, not dispose). The `frame` callback returns `false`
only when `!isPlaying.value` (`useEasingDemo.ts:138-144`), but on unmount the
component's `isPlaying` ref is NOT reset — it stays `true`, so **after the
Suspense hard-cut unmounts the scene, the detached loop keeps rescheduling
forever.** Swap away from Easing-while-playing → leak; swap away from
Spring-while-playing → leak. `useSceneVisibilityPause` only pauses on tab-hide,
not on scene-swap, so it does not cover this.

**(b) DEAD-BUT-HARMLESS — `AmigaScene` + `useSequenceDemo` `[MED — correctness/clarity]`.**
`AmigaScene.vue:136-139` has a REAL `onBeforeUnmount` that calls `stopRenderLoop()`
+ full Three.js disposal, and `onMounted:84` (not `onActivated`) starts the loop —
so the dead `onActivated`/`onDeactivated` (`:118-124`) cause **no leak**, but are
dead code that misleads (the comment at `:126-129` even reasons about resume
behaviour that never executes). `useSequenceDemo.ts:232-235`'s `onDeactivated`
stops the mirror + sequence — but there's no `onUnmounted` either; the *current*
scene doesn't perpetually leak only because the Sequence's own `play().finally`
(`:157-161`) and the mirror's self-terminating `loop` (`:144-147`, returns
`isPlaying.value`) wind down when motion ends — but a scene swapped away
**mid-play** leaves the Sequence's RAFPlayback + the mirror running until the
sequence naturally completes (a bounded-but-unowned leak, the same isPlaying-ref
mechanism as (a)). The `onActivated(syncFromSequence)` is pure dead code.

**The root cause is a copy-template.** All four carry a "KeepAlive lifecycle"
comment (`useEasingDemo.ts:175`, `useSpringDemo.ts:235`, `AmigaScene` implicit) —
they were templated from an era when a `<KeepAlive>` host was assumed. `App.vue:197`
still carries the fossil comment *"Unified scene component/key/props for KeepAlive
(requires single child)"* over the `activeSceneComponent` computed — but there is
no KeepAlive. The F.W10/W12 NEW scenes (`useSequenceDemo`) inherited the dead
pattern verbatim. The CORRECT seam is in the same tree: `useRafLoop.ts:56`
(`onUnmounted(stop)`) and `AmigaScene`'s own `onBeforeUnmount`.

- **Disposition. SHIP-in-G.** Excise the dead `onActivated`/`onDeactivated` from
  all four and re-home the cleanup on the genuine unmount seam — `onScopeDispose`
  (composables) / `onBeforeUnmount` (SFC), mirroring `useRafLoop.ts:56`. For (a)
  this CLOSES the leak; for (b) it deletes dead code and gives the mid-play swap
  an honest stop. The `onActivated` start-on-activate is replaced by the
  `onMounted`/`immediate`-watcher start each scene already has (the scene
  re-mounts on every swap-in under Suspense, so mount-time start is correct and
  complete). Also delete the `App.vue:197` fossil "KeepAlive" comment so the
  host's no-KeepAlive contract reads true.
- **Falsifiable instrument.** Extend `proof:brittleness` clause 4 (the inv-κ
  gate) with a **lifecycle sub-clause**: grep demo `.vue`/`.ts` (comment-blanked,
  `dist/` excluded) for `onActivated(` / `onDeactivated(` and assert ZERO hits
  while no `<KeepAlive>` exists in the demo render tree (a paired grep for
  `<KeepAlive`/`keep-alive` over `demo/**` — currently zero). The clause BITES
  today on the 4 files; after the SHIP it's green. This is the exact shape of
  clause 4 (a hand-rolled lifecycle the scope-tied seam supersedes) — the gate
  that already forbids the raw listener should forbid the dead activation hook,
  since both are "lifecycle not riding the auto-dispose seam." Stale-guard the
  KeepAlive grep so re-introducing a real `<KeepAlive>` re-permits the hooks in
  one motion (no silent rot).
- **Isomorphism.** Pixel- and behaviour-isomorphic for the live scene (mount-time
  start is what runs today; the dead hooks contribute nothing). The only behaviour
  DELTA is the intended one: the leaked loop now stops on swap.
- **inv ε.** Host no-KeepAlive verified `App.vue:109-136` + `useSceneVisibilityPause.ts:7`;
  dead hooks at the four `file:line`s above; `RAFPlayback` no-auto-cleanup at
  `playback.ts:61-132`; the correct seam at `useRafLoop.ts:56`; `AmigaScene`
  unmount cleanup at `:136-139`. `proof:brittleness` clause-4 scope (greps
  `addEventListener`/`ResizeObserver`, NOT lifecycle hooks) verified
  `scripts/proof-brittleness.mjs:373-439` — the gap is real, the gate does not see it.

---

## §2 — `AnimationVisualizer` coastPlayback has no unmount stop (bounded) `[LOW]`

`AnimationVisualizer.vue:135` owns a second raw `RAFPlayback` (`coastPlayback`)
for the fling-coast; its sync loop rides `useRafLoop` (auto-cleaned,
`:227`), but `coastPlayback` is stopped only on drag-start (`:192`) and
self-terminates via `RAFPlayback.drive`'s settle loop (`:171-176`,
`coastSpring.settled`). There is **no `onUnmounted`/`onScopeDispose` for
`coastPlayback`** (grep returns none). Unmounting the controls mid-fling (a
sub-second transient) leaves it running until the spring settles — a **bounded**
micro-leak, not perpetual, since `drive` is settle-terminating. Distinct from §1's
perpetual leak.

- **Disposition. SHIP-in-G** (cheap, folds with §1). Add
  `onScopeDispose(() => coastPlayback.stop())` next to the existing `useRafLoop`
  usage — one line, completes the "every raw RAFPlayback owner stops on dispose"
  invariant. The §1 instrument (a "raw `new RAFPlayback` must have a dispose-time
  stop" grep) would catch this site too if widened from lifecycle-hooks to
  RAFPlayback-ownership; recommend the instrument cover both.
- **Isomorphism.** Behaviour-isomorphic (the spring settles within the same frame
  budget either way; this only bounds the unmount-mid-fling edge).

---

## §3 — Where the post-F demo brittleness surface is ALREADY-SOTA (verified — manufacture NO work)

These are confirmed exemplary on the brittleness axis; calling them gaps would be
manufactured work:

- **inv-κ (E.W2) HOLDS — `proof:brittleness` PASS, all 4 clauses.** Re-ran on
  `tranche-g-dev`: zero global `document.querySelector*`; z-scale single-sourced;
  `@supports` guards present (6 blocks); zero manual `addEventListener`/`new
  ResizeObserver` outside the (empty) `LISTENER_ALLOWLIST`. The two `addEventListener`
  greps are **prose comments** (`useSceneVisibilityPause.ts:11` JSDoc,
  `useOrbitalPointer.ts:224` code comment) — blanked by the gate's `blankComments`,
  not real calls. The B1–B9 sites all now consume vueuse (`useEventListener` /
  `useResizeObserver` / `useDragCapture` — verified each file imports them).
- **The two B10/B11 querySelector couplings are RESOLVED.** B10's brittle
  `button[data-state=active]` read is GONE — `AnimationControls.vue:236-240`
  reads Vue state (`storedControls.selectedControl`) and scrolls the OWNED
  `tabTriggerEls.get(...)` trigger ref; only the `[role=tablist]` survives as a
  DOCUMENTED single-vendor contract (`:243-249`, with an "if reka-ui ships a ref,
  adopt it" note). B11's `querySelectorAll("pre")` is now the child-ref contract
  (`KeyframeCard.vue:71` comment confirms "a declared child-ref contract, no
  querySelector"; `KeyframeCardList.vue:59`).
- **The surviving vendor reaches are single-sourced + owner-noted.**
  `[data-sonner-toaster]` lives in ONE module (`useToastGuard.ts:18-27`) with the
  dep version pinned + adopt-on-public-API note; `[role=tablist]` likewise. Both
  are the LEAVE-hardened disposition D.W3/E.W2 set — not removable (no vendor API
  exists), correctly contained.
- **The `document.head.querySelector("#id")` style-element idiom** is the
  allowlisted dynamic-stylesheet pattern (`useHighlightCSS.ts:14,75`), explicitly
  carved out by the gate (`proof-brittleness.mjs:168-185`) — not a cross-component
  reach.
- **Zero `:deep()`/`>>>`/`/deep/` vendor-piercing selectors** across all demo
  `<style>` blocks (grep returns nothing). No deeply-nested brittle selector
  coupling to vendor markup.
- **The NEW F.W10/W12 scenes are clean on selectors + listeners.** `sequence/`
  and `motion-path/` (added after the F demo audit) have ZERO
  `addEventListener`/`ResizeObserver`/`querySelector`/`closest`/`document.`/`window.`
  reaches (grep). `SequenceTarget.vue` uses `useEventListener(window, ...)` for
  the scrubber (`:166-173`, auto-cleaned), `useTemplateRef` (`:149`) + a
  function-ref `setRowEl` (`:135-137`) for owned per-row refs, `setPointerCapture`
  on the owned ref (`:162`). `MotionPathTarget.vue` uses `useTemplateRef` for both
  refs (`:51-52`). The brittleness *deviation* is purely §1's lifecycle-hook
  misuse in `useSequenceDemo`, not their DOM surface.
- **F.W14 undo/redo rides vueuse idiomatically.** `useTimeline.ts:3,78-83` uses
  `useRefHistory` + `debounceFilter` over the centralized keyframe-state ref — no
  hand-rolled snapshot stack, auto-cleanup via scope dispose; the clone+debounce
  caveats are documented (`:67-73`). This is the seam `a-demo-post-e.md §1`
  prescribed, landed correctly.
- **The vueuse rAF surface is SOTA where it's used.** `useOrbitalInertia`,
  `useAnimationSync`, `useTimelineBuild` all ride `useRafFn` (auto-cleanup);
  `useRafLoop.ts:56` does `onUnmounted(stop)` for its raw `RAFPlayback` — the
  correct template §1 should propagate to. `useAnimationSync` remains the
  settle-gated bridge (B15) — LEAVE-hardened, unchanged.
- **`useSceneVisibilityPause` is the right primitive.** Rides
  `useDocumentVisibility` (`:34`, not a raw `visibilitychange` listener — the
  E.W2 gate forbids that), with an honest "only resume what IT paused"
  contract (`:36-51`). The ONE gap is that it covers tab-hide, not scene-swap —
  which is precisely why §1's unmount cleanup must live on `onScopeDispose`, not
  rely on this.

---

## Disposition summary

| # | Finding | Sev | Disposition | Instrument |
|---|---------|-----|-------------|------------|
| 1a | rAF preview loop LEAKS on scene swap — cleanup wired to dead `onDeactivated`, no `<KeepAlive>` host (`useEasingDemo.ts:180-181`, `useSpringDemo.ts:236-237`) | **HIGH** | **SHIP-in-G** | `proof:brittleness` clause-4 lifecycle sub-clause: zero `onActivated`/`onDeactivated` while no `<KeepAlive>` in tree |
| 1b | Dead `onActivated`/`onDeactivated` (harmless leak-wise) + mid-play swap unowned loop (`AmigaScene.vue:118-124`, `useSequenceDemo.ts:232-238`) + `App.vue:197` fossil comment | **MED** | **SHIP-in-G** | same gate clause |
| 2 | `coastPlayback` no unmount stop (bounded, self-terminating) (`AnimationVisualizer.vue:135`) | LOW | **SHIP-in-G** (folds w/ §1) | widen §1 instrument to "raw RAFPlayback owner must stop on dispose" |
| 3 | inv-κ HOLDS · querySelector couplings resolved · vendor reaches single-sourced · NEW scenes clean · undo on vueuse · no `:deep` | — | **RECORD** (already-SOTA) | `proof:brittleness` PASS verified |

**Cross-repo hand-offs: NONE.** Every finding is demo-local Vue-lifecycle /
demo-rAF; no value.js / parse-that / glass-ui touchpoint surfaced. `RAFPlayback`
itself (kf engine, `playback.ts`) is correct — it is not the engine's job to tie
into a Vue scope; the demo consumer must call `stop()` on dispose, which
`useRafLoop`/`AmigaScene`/`CubeScene` already do and the four §1 sites must.

**The one-paragraph thesis.** The inv-κ surface E.W2 hardened is HOLDING —
`proof:brittleness` passes all four clauses, the querySelector couplings are
owned refs / single-vendor contracts, the NEW F scenes carry zero brittle DOM
reaches, and the demo's listener/observer surface rides vueuse end-to-end. The
honest residual is ONE inv-κ-class regression the gate doesn't yet see: four
scene loop-owners wire rAF cleanup to **dead `onDeactivated` hooks** (the host is
a bare keyed `<Suspense>` with NO `<KeepAlive>` — those hooks never fire), and for
the Easing + Spring scenes that dead hook is the *only* unmount-time `stop()`, so
the rAF preview loop **leaks perpetually on every play-then-swap**. The fix is
the exact seam already in the tree — `onScopeDispose`/`onBeforeUnmount`, mirroring
`useRafLoop.ts:56` — and the gate that already forbids the raw listener should
forbid the dead activation hook (both are "lifecycle not on the auto-dispose
seam"). A focused lifecycle correction, gated, not a rebuild.
