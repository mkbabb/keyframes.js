# E.W2 — The vueuse listener/observer gestalt (the inv-ζ analogue, completed)

The completion wave for the dogfood discipline. C.W3 closed inv ζ — the demo
stopped hand-rolling rAF loops and dogfooded its own engine
(`SmoothProgress`/`SpringProgress`/`NumericAnimation`/`RAFPlayback`), gated by
`proof:dogfood` (7 hand-rolled rAF loops transposed; reddens on a
non-allowlisted rAF — `audit/deferred-ledger.md` CL-5). D.W3 hardened the
brittle DOM-selector + reactivity seam (`proof:brittleness`). But inv ζ covered
only the **rAF** primitive — the **listener/observer** primitives were never
swept. The post-D assay found the analogue debt the rAF gestalt left untouched:
~10 sites still hand-roll `addEventListener`/`new ResizeObserver` with manual
`removeEventListener`/`disconnect` bookkeeping where `@vueuse/core`'s
`useEventListener`/`useResizeObserver` already are the thing (auto-cleanup via
`tryOnScopeDispose`), plus 2 `querySelector` couplings that reach into vendor
DOM by attribute selector where an owned/child ref is more robust. E.W2 is the
listener/observer transposition — the exact inv ζ "do not hand-roll what a
shipped engine is" discipline, applied to the demo's listener/observer surface.
**Net-deletion + a leak-fix, bite-proven.** Grounds: `audit/prompt-recap.md` D3
("E.W2 completes the gestalt") + `audit/deferred-ledger.md` CL-5 ("the
listener/observer analogue inv ζ did NOT cover — they are NET-NEW") + the live
greps below.

This is NET-NEW, not a re-open of inv ζ (the rAF gestalt is closed) and not
folded debt (zero KFE — D terminated every keyframes-owned deferral). It is the
analogue the assay surfaced: the SECOND half of the dogfood discipline.

## § The state, verified (not asserted)

The live facts — `grep -rn "addEventListener\|new ResizeObserver\|querySelector"
demo --include="*.vue" --include="*.ts"` (excluding `dist/`), read-confirmed:

1. **6 files carry manual `addEventListener` (15 raw calls).** Two classes:
   - **Mount-scope window listeners** that `useEventListener` replaces directly:
     `SpringTarget.vue:96-97` (`window.addEventListener("pointermove"/"pointerup")`
     attached in `onPointerDown`, manually removed in `onPointerUp` `:107-108`).
   - **The `{ once: true }` crutch:** `PlaybackRibbon.vue:116`
     (`window.addEventListener("pointerup", onSliderUp, { once: true })`) — a
     one-shot pointerup with a SEPARATE `removeEventListener` path at `:129`
     for the commit case, so the `once:true` and the manual remove BOTH guard
     the same listener (a fragile double-bookkeeping the assay named the crutch).
   - **Dynamic-during-`setPointerCapture` listeners** (the drag pattern):
     `useDragCapture.ts:36-38` (the existing drag-capture composable —
     `pointermove`/`pointerup`/`pointercancel` on the captured element, removed
     at `:43-45`), `AssetViewport.vue:211-212` + `:271-272` (2 drag handlers,
     each add/remove on the captured `el`), `AssetLayerPanel.vue:171-172` (the
     row-reorder drag), and `useOrbitalPointer.ts:353-355` (the orbital doc
     listeners, removed at `:314-316`). These attach AFTER
     `setPointerCapture(pointerId)` and detach on pointerup — the imperative
     capture pattern.

2. **3 files carry `new ResizeObserver`:**
   - `EasingTarget.vue:231` (`resizeObs = new ResizeObserver(() => measureTrackWidth())`,
     `observe` at `:232`, `disconnect` in `onUnmounted` `:236`) — measures the
     comparison-track width. Already reads off OWNED refs (`trackEls` `:207`,
     D.W3.S1 landed) — only the observer itself is hand-rolled.
   - `CSSCodeEditor.vue:156` (`resizeObserver = new ResizeObserver(...)`,
     `observe` at `:164`, `disconnect` at `:159`/`:169`) — the deferred-init
     observer that waits for the container to gain non-zero size before
     `initEditor()`, then self-disconnects. A one-shot "wait for visible"
     observer — a specific lifecycle vueuse's `useResizeObserver` returns a
     `stop()` for.
   - `AmigaScene.vue:84` (`const ro = new ResizeObserver(...)`, `observe` at
     `:92`, stored as `resizeObserver` `:96`) — the Three.js canvas resize→
     camera-aspect handler, inside the same `onMounted` that owns the
     `requestAnimationFrame` present loop (`:102`).

3. **2 `querySelector` couplings reach into vendor DOM by attribute:**
   - `AnimationControls.vue:190`
     (`header.querySelector<HTMLElement>("button[data-state=active]")`) +
     `:196` (`tabsHeaderEl.value?.querySelector<HTMLElement>("[role=tablist]")`).
     Both query the component's OWN subtree (rooted at the `tabsHeaderEl`
     template ref) but BY string-attribute selector into reka-ui's rendered tab
     markup (`data-state=active`, `role=tablist`) — brittle to a reka-ui DOM
     change, and `data-state=active` re-reads the DOM for state Vue already
     tracks (`storedControls.selectedControl`).
   - `KeyframeCardList.vue:51`
     (`listEl.value.querySelectorAll("pre")`) — already SCOPED to the
     component's own `listEl` ref (the D.W3.S1 hardening of the former GLOBAL
     `document.querySelectorAll("pre")`). It is no longer a global reach, but it
     still IMPERATIVELY queries `<pre>` rather than collecting them as declared
     child refs — the last step from "scoped query" to "owned ref contract."

4. **The legitimately-dynamic + engine-loop sites need an allowlist, not a
   ban.** Three patterns are NOT a hand-roll a vueuse primitive replaces 1:1:
   - The `setPointerCapture` dynamic-listener pattern (useDragCapture,
     useOrbitalPointer, the asset-manager drags) attaches listeners IMPERATIVELY
     mid-gesture. vueuse `useEventListener` DOES cover this — it returns a
     `stop()` handle AND auto-cleans on scope dispose, so the imperative attach
     becomes `const stop = useEventListener(el, "pointermove", onMove)` with
     `stop()` on pointerup — net-deletion of the manual `removeEventListener`
     bookkeeping. So these CONVERT (they are not exceptions); the convergence
     point is the existing `useDragCapture` composable (§State 1, already the
     drag abstraction) — the asset-manager sites should ADOPT `useDragCapture`
     (DRY) rather than each re-hand-rolling the pattern.
   - The Three.js present loop in `AmigaScene.vue:102` (`requestAnimationFrame`)
     is already engine-loop-allowlisted by `proof:decomposition`
     (`ASYNC_ALLOWLIST` precedent, the comment names AmigaScene at
     `proof-decomposition.mjs:80-87`). Its sibling `ResizeObserver` (`:84`) is
     part of the same imperative Three.js setup block — a documented allowlist
     candidate (the canvas-resize→camera-aspect handler is tightly coupled to
     the renderer lifecycle, not a Vue reactive observer).

The wave's job is to make the listener/observer surface ride vueuse (the inv-ζ
posture), with a SMALL documented allowlist for the genuinely-imperative
engine-loop sites — honestly, not by manufacturing exceptions for sites that
convert cleanly (the asset-manager drags DO convert, via `useDragCapture`).

## § Goal

**What lands:**
- The mount-scope + `once:true` listeners → `useEventListener`:
  `SpringTarget.vue` and `PlaybackRibbon.vue` lose their manual
  `addEventListener`/`removeEventListener` pairs (and the `once:true` crutch);
  vueuse owns the lifecycle. The `EasingTarget`/`CSSCodeEditor`/`AmigaScene`
  observers → `useResizeObserver` (with the AmigaScene observer recorded on the
  allowlist if its Three.js coupling warrants it).
- The dynamic drag listeners CONVERGE on ONE abstraction: the asset-manager
  drags (`AssetViewport`, `AssetLayerPanel`) ADOPT the existing `useDragCapture`
  composable (DRY — they re-hand-roll exactly what it does), and `useDragCapture`
  itself + `useOrbitalPointer`'s dynamic doc listeners ride `useEventListener`'s
  `stop()` handle (auto-cleanup replaces the manual `removeListeners`). No site
  hand-rolls the `setPointerCapture` + add/remove pattern inline.
- The 2 `querySelector` couplings → owned/child refs:
  `AnimationControls.vue`'s `button[data-state=active]` + `[role=tablist]`
  reads become owned refs (a `useTemplateRef` on the tablist + reading active
  state from Vue's `selectedControl`, not the DOM `data-state`);
  `KeyframeCardList.vue`'s `querySelectorAll("pre")` becomes a declared child-ref
  contract (collect the `<pre>` elements as refs, not a query).
- `proof:brittleness` EXTENDED with a new clause: zero manual
  `addEventListener` / `new ResizeObserver` in demo reactive code OUTSIDE a
  documented `LISTENER_ALLOWLIST` (the few genuinely-imperative engine-loop
  sites). The clause BITES on every un-allowlisted hand-roll. Net-deletion
  (the manual bookkeeping vanishes), leak-fix (vueuse's `tryOnScopeDispose`
  closes the cases where a mid-flight unmount leaked a listener).

**Why:** the listener/observer surface is the SECOND half of the dogfood
discipline inv ζ began. A manual `addEventListener` with a hand-rolled
`removeEventListener` is the exact pattern inv ζ removed for rAF: it re-implements
lifecycle vueuse already owns, leaks on an unmount that skips the cleanup path,
and carries manual id/handle bookkeeping. `useEventListener`/`useResizeObserver`
provide `tryOnScopeDispose` cleanup, return a `stop()` handle for the dynamic
case, and delete the bookkeeping — net-deletion + a leak-fix with zero
happy-path change. The 2 `querySelector` couplings are the brittleness analogue:
querying vendor DOM by `data-state`/`role` (`AnimationControls`) breaks when
reka-ui changes its markup and re-reads state Vue already tracks; an owned ref +
Vue state is robust and idiomatic. The no-legacy mandate forbids leaving a
hand-rolled listener where the shipped composable is the thing; KISS favors
`useEventListener` over the add/remove pair.

## § Scope

### S1 — Mount-scope + `once:true` window listeners → useEventListener — prompt-recap D3

**WHAT:** two direct transpositions:
- **`SpringTarget.vue:96-108`** — the `onPointerDown` attaches
  `window.addEventListener("pointermove"/"pointerup")` and `onPointerUp`
  removes them. Replace with `useEventListener(window, "pointermove", onMove)` +
  `useEventListener(window, "pointerup", onUp)` gated by the `dragging` flag
  (the listeners stay registered, the handlers early-return when not dragging —
  the idiomatic vueuse form), OR adopt `useDragCapture` (S2) if the rail element
  supports pointer capture. The manual add/remove pair is DELETED.
- **`PlaybackRibbon.vue:113-132`** — the `onSliderDown` registers
  `window.addEventListener("pointerup", onSliderUp, { once: true })` while
  `onSliderCommit` ALSO calls `removeEventListener("pointerup", onSliderUp)`
  (`:129`) — the `once:true` and the manual remove double-guard one listener.
  Replace with a single `useEventListener(window, "pointerup", onSliderUp)`
  whose `stop()` handle is called on commit (one cleanup path, no `once:true`
  crutch, no double-bookkeeping).

**WHY:** these are the cleanest transpositions — a `window` listener attached at
a known point and removed at another, exactly `useEventListener`'s shape. The
`once:true` crutch (verified §State 1) is the fragile case: two cleanup
mechanisms for one listener, where a missed path leaks or double-fires; the
single `useEventListener` + `stop()` is one honest cleanup. Net-deletion of the
add/remove pairs + the crutch.

### S2 — The dynamic drag listeners converge on useDragCapture / useEventListener — prompt-recap D3

**WHAT:** the `setPointerCapture` + dynamic add/remove pattern has ONE home —
the existing `useDragCapture.ts` composable (§State 1, today consumed by
`AnimationVisualizer.vue`). Two moves:
- **Adopt `useDragCapture` at the asset-manager sites.** `AssetViewport.vue`
  (`:211-212`, `:271-272` — the asset-move drag + the resize/rotate-handle
  drag) and `AssetLayerPanel.vue` (`:171-172` — the row-reorder drag) each
  re-hand-roll the EXACT pattern `useDragCapture` provides (set capture, add
  `pointermove`/`pointerup`, remove on up). Refactor each to
  `useDragCapture({ onStart, onMove, onEnd })`, deleting the inline add/remove.
  DRY — three re-implementations collapse to one consumed abstraction.
- **`useDragCapture` itself + `useOrbitalPointer`'s doc listeners ride
  `useEventListener`'s `stop()`.** Inside `useDragCapture.ts:34-47` and
  `useOrbitalPointer.ts:307-356`, the manual `el.addEventListener` /
  `doc.addEventListener` + the `removeListeners` bodies become
  `const stop = useEventListener(target, event, handler)` captured in the
  drag-start, called in the drag-end — vueuse's `tryOnScopeDispose` covers the
  unmount-mid-drag leak the manual `onUnmounted(removeListeners)` only partially
  guards. (`useOrbitalPointer`'s `wheelTimeout` `setTimeout` at `:59`/`:259` →
  `useTimeoutFn`, the same vueuse-async transposition D.W1 applied to the
  controls tree — folded here since E.W2 owns the listener/timer surface of the
  orbital seam E.W1 thinned.)

**WHY:** the drag-capture pattern is hand-rolled at FOUR sites (useDragCapture,
useOrbitalPointer, AssetViewport ×2, AssetLayerPanel) when ONE composable
already abstracts it (verified §State 1, 4). Converging the asset-manager sites
ON `useDragCapture` is net-deletion (three inline bodies → three composable
calls) AND a leak-fix (the composable's lifecycle replaces the manual
`removeEventListener`). Routing `useDragCapture`'s own internals + the orbital
doc listeners through `useEventListener` makes even the abstraction ride vueuse
— the inv-ζ posture all the way down. The `setPointerCapture` pattern is NOT an
exception (it converts cleanly via `stop()`); only the engine-loop sites are.

### S3 — The ResizeObservers → useResizeObserver (+ the engine-loop allowlist) — prompt-recap D3

**WHAT:** three observer transpositions, two clean + one allowlist candidate:
- **`EasingTarget.vue:231-236`** — `resizeObs = new ResizeObserver(() =>
  measureTrackWidth())` + `observe`/`disconnect` →
  `useResizeObserver(trackContainerEl, () => measureTrackWidth())`. The owned
  refs are already in place (D.W3.S1, `:201-207`); only the observer construction
  is hand-rolled. Net-deletion of the `resizeObs` var + the `onMounted`/
  `onUnmounted` observe/disconnect bookkeeping.
- **`CSSCodeEditor.vue:151-171`** — the deferred-init observer (wait for the
  container to gain non-zero size → `initEditor()` → self-disconnect) →
  `useResizeObserver`, calling the returned `stop()` once the size is non-zero
  (the one-shot lifecycle vueuse expresses with `stop()`). The
  `onUnmounted(disconnect)` bookkeeping is replaced by vueuse's auto-cleanup.
- **`AmigaScene.vue:84-96`** — the canvas-resize→camera-aspect observer. EITHER
  transpose to `useResizeObserver` (preferred — it converts like the others),
  OR, if the Three.js renderer-lifecycle coupling makes the imperative form
  clearer (the observer is created inside the same setup block as the renderer +
  the present loop), record it on the `LISTENER_ALLOWLIST` with the same
  rationale `proof:decomposition` uses for the AmigaScene rAF present loop (an
  engine-loop site, not a Vue reactive observer). §Design-Decision 4 records the
  choice; the default is to convert (KISS — fewer exceptions).

**WHY:** a `new ResizeObserver` + manual `observe`/`disconnect` is the observer
analogue of the hand-rolled listener — `useResizeObserver` owns the lifecycle
and returns `stop()` (verified §State 2). EasingTarget + CSSCodeEditor convert
cleanly (net-deletion). AmigaScene is the one genuine judgment call: its
observer is part of an imperative Three.js setup the rest of which is already
allowlisted — converting it is preferred, but if the coupling argues for the
imperative form, the allowlist (with rationale) is the honest home, not a silent
hand-roll.

### S4 — The querySelector couplings → owned / child refs — prompt-recap D3

**WHAT:** two selector hardenings:
- **`AnimationControls.vue:187-198`** — `scrollActiveTabIntoView` queries
  `header.querySelector("button[data-state=active]")` (`:190`) and `onMounted`
  queries `tabsHeaderEl.value?.querySelector("[role=tablist]")` (`:196`). Two
  changes: (a) the `[role=tablist]` element → a `useTemplateRef`
  (`tabsListElRef`) bound declaratively if the tablist is in the component's own
  template, or — since it is reka-ui-rendered — kept as a single documented
  vendor-DOM read with an explicit comment naming the reka-ui `role=tablist`
  contract (the same "documented vendor contract" pattern D.W3 applied to
  `[data-sonner-toaster]`); (b) the `button[data-state=active]` read → driven by
  Vue's `storedControls.selectedControl` (the active tab is the one whose key
  matches `selectedControl`), scrolling the owned tab-trigger ref into view
  rather than re-reading `data-state` from the DOM. The DOM is queried for
  STATE Vue already holds — read the state, not the DOM.
- **`KeyframeCardList.vue:45-53`** — `getPreElements()` does
  `Array.from(listEl.value.querySelectorAll("pre"))` (already `listEl`-scoped,
  D.W3.S1). Convert to a declared child-ref contract: collect each card's `<pre>`
  as a ref (the `KeyframeCard` children already expose `$el` via `cardRefs`
  `:47`) — `KeyframeCard` exposes its `<pre>` ref, `KeyframeCardList` collects
  them, no `querySelectorAll`. The highlight scope becomes a declared ownership,
  not an imperative query.

**WHY:** `AnimationControls`'s `data-state=active` read (verified §State 3) is
the brittle one — it couples to reka-ui's `data-state` attribute AND re-reads
state Vue already tracks (`selectedControl`); reading the Vue state + an owned
trigger ref is robust to a reka-ui markup change and idiomatic. The
`[role=tablist]` read is intrinsic to reka-ui's rendered structure (no public
ref), so it becomes a DOCUMENTED single vendor contract (not removed — there is
no vendor API for "the tablist element," same disposition as
`[data-sonner-toaster]`). `KeyframeCardList`'s `querySelectorAll("pre")` is
already scoped (not a global reach), so this is the LAST step — from scoped
query to declared child-ref ownership, the brittleness analogue of D.W3's
own-the-reference principle.

### S5 — The `proof:brittleness` extension (the falsifiable close) — prompt-recap D3

**WHAT:** EXTEND `scripts/proof-brittleness.mjs` with a new clause (clause 4,
the listener/observer gestalt), mirroring its existing clause-1
(`document.querySelector*`) structure:
- **Zero manual `addEventListener` / `new ResizeObserver` in demo reactive code
  OUTSIDE a documented `LISTENER_ALLOWLIST`.** `grep` over `demo/` `.vue`/`.ts`
  (excluding `dist/`, comment-blanked via the existing `blankComments` helper at
  `proof-brittleness.mjs:82`) for `\.addEventListener\(` and
  `new\s+ResizeObserver\b`; every hit must be on the allowlist or the gate reds.
  The `LISTENER_ALLOWLIST` is an explicit `Set` (mirroring the existing
  `ASYNC_ALLOWLIST` in `proof:decomposition`) holding ONLY the
  genuinely-imperative engine-loop sites (e.g. AmigaScene's Three.js observer,
  if S3 keeps it imperative) — each with a rationale, plus a stale-entry guard
  (an allowlisted path with no matching hit reds, so the list cannot rot).
  BITES: the 6 `addEventListener` files + the 3 `ResizeObserver` files red it
  today; after S1–S3 only the allowlisted engine-loop site (if any) remains.
- The clause-1 `document.querySelector*` check already gates the global reach;
  S4's `data-state=active` read is covered by the new clause's spirit + a
  documented vendor-contract comment (the `[role=tablist]`/`[data-sonner-toaster]`
  pattern), recorded in the gate's allowlist commentary.

**WHY:** the close is only honest if a gate BITES on the hand-roll's return
(inv ε, `audit/deferred-ledger.md` CL-6). A grep for manual
`addEventListener`/`new ResizeObserver` outside an explicit allowlist is the
falsifiable form of "the listener/observer surface rides vueuse" — exactly the
form `proof:dogfood` took for rAF. The allowlist (with a stale-entry guard) keeps
the few engine-loop exceptions deliberate + greppable, not silent. The gate reds
on the exact pattern this wave removes, so "the listener gestalt is completed"
means what it says.

## § Hard gate — `proof:brittleness` (extended · inv κ)

The wave closes when every clause VERIFIES (each BITES — a real grep/render,
not an assertion):

1. **Zero manual `addEventListener` / `new ResizeObserver` outside the
   allowlist.** `npm run proof:brittleness` clause 4 PASSES: every
   `.addEventListener(` / `new ResizeObserver` in demo `.vue`/`.ts` (comment-
   blanked, `dist/` excluded) is on the documented `LISTENER_ALLOWLIST` (only
   the engine-loop sites, each with a rationale). BITES: the 6+3 W2-flagged
   files red it today.
2. **The mount-scope + `once:true` listeners are gone.** `SpringTarget.vue` +
   `PlaybackRibbon.vue` carry no `window.addEventListener`; the `once:true`
   crutch is replaced by a single `useEventListener` + `stop()`.
3. **The drag pattern has ONE home.** `AssetViewport.vue` + `AssetLayerPanel.vue`
   consume `useDragCapture` (no inline `setPointerCapture` + add/remove);
   `useDragCapture` + `useOrbitalPointer`'s doc listeners ride
   `useEventListener`'s `stop()`. `grep` finds the asset-manager add/remove
   bodies GONE.
4. **The observers ride `useResizeObserver`.** `EasingTarget` + `CSSCodeEditor`
   carry no `new ResizeObserver` (and AmigaScene either converts or is the ONE
   allowlisted observer with its rationale).
5. **The querySelector couplings are owned.** `AnimationControls` reads the
   active tab from Vue state (`selectedControl`) + an owned trigger ref, not
   `data-state=active` from the DOM (the `[role=tablist]` read, if retained, is
   a single documented vendor contract); `KeyframeCardList` collects `<pre>` as
   declared child refs, not `querySelectorAll`.
6. **Net-deletion + leak-fix, no regression.** The E.W2 diff is net-negative on
   demo LOC (the manual bookkeeping deleted exceeds the vueuse-import + `stop()`
   plumbing added); `git diff --stat` shows a net `-`. The leak cases close
   (mid-drag unmount no longer leaks a listener — vueuse's `tryOnScopeDispose`).
   `demo-smoke`, `occlusion`, `proof:dogfood` stay green; the drag/scrub/resize
   gestures behave identically (happy path byte-identical).
7. **No new legacy.** No compat wrapper, no re-export; the transposition is the
   idiomatic vueuse form, not a shim over the old listeners. The `LISTENER_ALLOWLIST`
   holds only genuinely-imperative engine-loop sites, each justified.

Every clause is a grep/render instrument that reds on its negative case.

## § Folds

Retires (by finding id):
- **prompt-recap D3** (the vueuse listener/observer gestalt — the inv-ζ analogue
  D.W3 began) — S1 (mount-scope + `once:true`) + S2 (the drag convergence) +
  S3 (the observers) + S4 (the querySelector couplings) + S5 (the gate).
- **`audit/deferred-ledger.md` CL-5** (inv ζ — the listener/observer analogue
  inv ζ did NOT cover, NET-NEW) — completed here; `proof:dogfood` stays green
  (this is the analogue, not a re-open).

This wave folds NO chronic deferral — zero KFE (`audit/deferred-ledger.md`).
E.W2 is net-new post-D refinement.

**Routed OUTWARD / RECORDED (not this wave):**
- **The `[role=tablist]` vendor-DOM read** (`AnimationControls.vue:196`) — there
  is no reka-ui public ref for "the tablist element," so it is DOCUMENTED as a
  single named vendor contract (the `[data-sonner-toaster]` disposition D.W3
  used), not removed. If reka-ui ships a public ref, a later follow-on adopts
  it — RECORDED, not deferred-without-owner.
- **The AmigaScene Three.js observer/loop** — if S3 keeps it imperative, it is
  the named `LISTENER_ALLOWLIST` entry (engine-loop, renderer-lifecycle-coupled),
  consistent with the `proof:decomposition` `ASYNC_ALLOWLIST` precedent for its
  present loop. Not a hand-roll the wave failed to fix — a justified exception.
- **The orbital seam structural thin (useOrbitalPointer 376L → ≤250L)** —
  E.W1's job; E.W2 only re-homes the composable's dynamic doc listeners +
  `wheelTimeout` AFTER E.W1 thins it. The two waves share `useOrbitalPointer.ts`:
  E.W1 first (structural), E.W2 second (listeners) — recorded so they do not
  fork the file.

## § Design decisions

1. **The listener/observer gestalt is the SECOND half of inv ζ — net-new, not a
   re-open.** RESOLVED + HONEST (inv ε): inv ζ (C.W3) closed the rAF hand-roll;
   it never touched listeners/observers. E.W2 is the analogue the assay surfaced
   (`audit/deferred-ledger.md` CL-5 states this plainly) — `proof:dogfood`
   (rAF) stays green and untouched; the new `proof:brittleness` clause 4
   (listeners/observers) is the parallel gate. The FINAL claims "E.W2 completed
   the listener/observer gestalt inv ζ began for rAF," NOT "E.W2 re-opened inv ζ."

2. **The `setPointerCapture` drag pattern CONVERTS — it is not an exception.**
   RESOLVED: vueuse `useEventListener` returns a `stop()` handle AND auto-cleans
   on scope dispose, so the imperative mid-gesture attach becomes
   `const stop = useEventListener(...)` + `stop()` on pointerup — fully covered,
   net-deletion of the manual remove. The asset-manager sites converge on the
   EXISTING `useDragCapture` (DRY); only the genuinely-imperative engine-loop
   sites (AmigaScene's Three.js setup) are allowlist candidates. The wave does
   NOT manufacture exceptions for sites that convert cleanly.

3. **Read Vue state, not the DOM, for state Vue tracks.** RESOLVED:
   `AnimationControls`'s `button[data-state=active]` read re-derives the active
   tab from reka-ui's DOM attribute when `storedControls.selectedControl`
   already IS the active tab — reading the state + scrolling the owned trigger
   ref is robust to a reka-ui markup change and idiomatic. The `[role=tablist]`
   read is intrinsic (no vendor ref) → documented contract, not removed.
   Trade-off: a documented vendor-DOM read is marginally less pure than a ref —
   but there is no ref to use, so the honest move is to NAME the coupling, the
   D.W3 `[data-sonner-toaster]` precedent.

4. **Convert the observers; allowlist only the engine-loop case.** RESOLVED:
   EasingTarget + CSSCodeEditor convert to `useResizeObserver` cleanly
   (net-deletion). AmigaScene's observer is the one judgment call — its Three.js
   renderer-lifecycle coupling MAY argue for the imperative form, in which case
   it joins the `LISTENER_ALLOWLIST` with the same rationale `proof:decomposition`
   gives its rAF present loop. Default is to convert (KISS — fewer exceptions);
   the allowlist is for the genuinely-imperative, not the merely-unconverted.

5. **The gate's allowlist cannot rot.** RESOLVED: the `LISTENER_ALLOWLIST` carries
   a stale-entry guard (an allowlisted path matching no hit reds the gate),
   exactly like `proof:decomposition`'s `ASYNC_ALLOWLIST` stale guard
   (`proof-decomposition.mjs:334-342`). So a future justified exception is a
   deliberate diff to the array with a rationale, and a no-longer-needed
   exception is forced out — the allowlist stays honest, the same discipline the
   rAF allowlist holds.
