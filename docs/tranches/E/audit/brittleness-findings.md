# E audit — brittleness lane (the listener/observer + selector assay)

D.W3 hardened the demo's brittle DOM-selector + reactivity seam: the global
`document.querySelectorAll("pre")` was scoped (`KeyframeCardList.vue`), the
`.closest(".easing-target")` / `.querySelector(".track-container")` string walks
became owned `useTemplateRef`s (`EasingTarget.vue`), the `[data-sonner-toaster]`
coupling was single-sourced into a documented contract (`useToastGuard.ts`), and
the `useAnimationSync` rAF bridge was gated by a settle-detect
(`proof:brittleness` landed). But D.W3 swept the **rAF + selector** surface — it
never touched the **listener/observer** primitive. The post-D assay finds the
analogue debt the rAF gestalt (C.W3's inv ζ) left untouched: **~10 sites still
hand-roll `addEventListener` / `new ResizeObserver`** with manual
`removeEventListener` / `disconnect` bookkeeping where `@vueuse/core`'s
`useEventListener` / `useResizeObserver` already ARE the thing (auto-cleanup via
`tryOnScopeDispose`), plus **2 `querySelector` couplings** that reach into reka-ui
DOM by attribute selector where an owned / child ref is more robust.

This is **THE BIG E THEME** — the SECOND half of the dogfood discipline inv ζ
began for rAF. Every site below is `grep`-verified against the live tree on
`tranche-d-impl` (2026-06-05), `file:line` cited — **verified, not asserted.**
The FOLD findings land in **E.W2** (the vueuse listener/observer gestalt); the
BOOK / LEAVE-hardened items are recorded so the verdict is on disk, not assumed.

This is **net-NEW** content. D's deferred ledger is CLEAN (P-invariant-28: D
terminated every keyframes-owned deferral, zero KFE); nothing here is folded
debt. The listener/observer analogue is the gestalt inv ζ did NOT cover — it is
NET-NEW, surfaced fresh in the E assay, NOT a re-open of inv ζ (the rAF gestalt
is closed; `proof:dogfood` stays green and untouched).

## Findings

| # | Finding | Evidence (file:line) | Severity | E-disposition |
|---|---|---|---|---|
| B1 | `SpringTarget.vue` — `onPointerDown` attaches `window.addEventListener("pointermove"/"pointerup")`, `onPointerUp` manually removes them — the mount-scope window-listener pair `useEventListener` replaces directly | `spring/SpringTarget.vue:96-97` (add), `:107-108` (remove) | Medium | **FOLD-E.W2** (S1) |
| B2 | `PlaybackRibbon.vue` — the **`{ once: true }` crutch**: `onSliderDown` registers `pointerup` with `{ once: true }` while `onSliderCommit` ALSO `removeEventListener`s it (`:129`) AND `onUnmounted` removes it again (`:159`) — three cleanup mechanisms double/triple-guarding ONE listener | `controls/PlaybackRibbon.vue:116` (add `{once:true}`), `:129` + `:159` (dual manual remove) | Medium | **FOLD-E.W2** (S1) |
| B3 | `useDragCapture.ts` — the existing drag-capture composable hand-rolls `el.addEventListener("pointermove"/"pointerup"/"pointercancel")` + a `removeListeners` body; the abstraction itself does not ride vueuse | `controls/composables/useDragCapture.ts:36-38` (add), `:43-45` (remove) | Medium | **FOLD-E.W2** (S2) |
| B4 | `useOrbitalPointer.ts` — the orbital doc-listener set: `onPointerDown` attaches `doc.addEventListener(pointermove/pointerup/pointercancel)`, `removeDocListeners` detaches; PLUS a `wheelTimeout` `setTimeout`/`clearTimeout` (the wheel-dampen) — both vueuse-migration targets | `orbital-drag/composables/useOrbitalPointer.ts:353-355` (add), `:314-316` (remove), `:59`+`:258-259` (`wheelTimeout`) | Medium | **FOLD-E.W2** (S2; the orbital seam thins in E.W1 FIRST) |
| B5 | `AssetViewport.vue` — TWO drag handlers (asset-move + resize/rotate-handle) each re-hand-roll the `setPointerCapture` + add/remove `pointermove`/`pointerup` pattern inline | `asset-manager/AssetViewport.vue:211-212` + `:271-272` (add), `:207-208` + `:267-268` (remove) | Medium | **FOLD-E.W2** (S2 — adopt `useDragCapture`) |
| B6 | `AssetLayerPanel.vue` — the row-reorder drag re-hand-rolls the SAME `setPointerCapture` + add/remove pattern inline (the third asset-manager re-implementation) | `asset-manager/AssetLayerPanel.vue:171-172` (add), `:167-168` (remove) | Medium | **FOLD-E.W2** (S2 — adopt `useDragCapture`) |
| B7 | `EasingTarget.vue` — `resizeObs = new ResizeObserver(() => measureTrackWidth())` + manual `observe` (`onMounted`) / `disconnect` (`onUnmounted`); reads OWNED refs already (D.W3.S1), only the observer construction is hand-rolled | `easing/EasingTarget.vue:231` (new), `:232` (observe), `:236` (disconnect) | Medium | **FOLD-E.W2** (S3) |
| B8 | `CSSCodeEditor.vue` — the **deferred-init** observer (waits for the container to gain non-zero size → `initEditor()` → self-`disconnect`) is hand-rolled; a one-shot "wait for visible" lifecycle `useResizeObserver`'s `stop()` expresses | `keyframes/CSSCodeEditor.vue:156` (new), `:164` (observe), `:159`+`:169` (disconnect) | Medium | **FOLD-E.W2** (S3) |
| B9 | `AmigaScene.vue` — `const ro = new ResizeObserver(...)` (canvas-resize → camera-aspect) inside the imperative Three.js setup block that also owns the `requestAnimationFrame` present loop (`:102`, already engine-loop-allowlisted) | `app/scenes/AmigaScene.vue:84` (new), `:92` (observe), `:127` (disconnect) | Low | **FOLD-E.W2** (S3 — convert preferred; else the ONE `LISTENER_ALLOWLIST` entry, engine-loop-coupled) |
| B10 | `AnimationControls.vue` — `scrollActiveTabIntoView` queries `header.querySelector("button[data-state=active]")` (re-reads state Vue already tracks via `selectedControl`) + `onMounted` queries `[role=tablist]` (reka-ui's rendered markup) | `controls/AnimationControls.vue:190` (`data-state=active`), `:196` (`[role=tablist]`) | Medium | **FOLD-E.W2** (S4 — `data-state` read → Vue state + owned ref; `[role=tablist]` → documented vendor contract) |
| B11 | `KeyframeCardList.vue` — `getPreElements()` does `listEl.value.querySelectorAll("pre")` (already `listEl`-scoped, D.W3.S1 — no longer a global reach) but still IMPERATIVELY queries `<pre>` rather than collecting declared child refs | `keyframes/components/KeyframeCardList.vue:51` | Low | **FOLD-E.W2** (S4 — scoped query → owned child-ref contract) |
| B12 | EasingTarget `getComputedStyle` token-read — reads `--track-ball-size-*` custom properties off an OWNED ref to bridge CSS tokens into JS; the comment at `:269` documents it as a deliberate token-bridge | `easing/EasingTarget.vue:142` (`getComputedStyle(root)`), `:269` (doc comment) | — | **BOOK** (legitimate token-bridge; root is an owned ref, D.W3.S1) |
| B13 | snapshotCapture `getComputedStyle` — reads computed style to BUILD keyframes from a DOM element (the timeline's snapshot-to-keyframe capture); reading computed style IS its purpose | `timeline/utils/snapshotCapture.ts:12,37,44` | — | **BOOK** (computed-style read is the feature, not a coupling) |
| B14 | `useToastGuard.ts` — the `[data-sonner-toaster]` reach is a SINGLE documented vendor contract (`TOAST_ROOT_SELECTOR`), single-sourced with the dep version pinned + a "if vue-sonner ships a public predicate, adopt it" note | `@/utils/useToastGuard.ts:18` (const), `:1-17` (the contract doc) | — | **LEAVE-hardened** (D.W3.S1 closed the two-site coupling) |
| B15 | `useAnimationSync.ts` — the `markRaw` rAF bridge is now settle-gated: `useRafFn` pauses when the polled state holds stable across a 30-frame window AND `isPlaying` is false, resumes on INPUTS (play-state edge, tab visibility, scrub `wake()`) it does not own — no per-panel permanent loop, no deadlock | `controls/composables/useAnimationSync.ts:40-70` (settle-gate), `:82,87` (input-driven resume) | — | **LEAVE-hardened** (D.W3.S4 gated it; the B6-D.W3 hazard closed) |

## B1–B2 — the mount-scope + `{ once: true }` window listeners (E.W2 S1)

The two cleanest transpositions — a `window` listener attached at a known point
and removed at another, exactly `useEventListener`'s shape.

**B1 — `SpringTarget.vue:90-109`.** `onPointerDown` (`:92`) sets `dragging = true`,
captures the pointer on `railEl`, then attaches the window pair:

```js
window.addEventListener("pointermove", onPointerMove);   // :96
window.addEventListener("pointerup", onPointerUp);       // :97
```

`onPointerUp` (`:105`) clears `dragging` and removes both (`:107-108`). A textbook
`useEventListener(window, "pointermove"/"pointerup", …)` gated by the `dragging`
flag (the listeners stay registered, the handlers early-return when not dragging
— the idiomatic vueuse form), OR an adoption of `useDragCapture` if the rail
supports pointer capture (it already calls `setPointerCapture`, `:94`).
Net-deletion of the add/remove pair.

**B2 — `PlaybackRibbon.vue:113-160` (the `{ once: true }` crutch).** This is the
fragile one. `onSliderDown` (`:113`) registers:

```js
window.addEventListener("pointerup", onSliderUp, { once: true });   // :116
```

while `onSliderCommit` (`:126`) ALSO calls `window.removeEventListener("pointerup",
onSliderUp)` (`:129`), AND `onUnmounted` (`:158`) removes it a THIRD time (`:159`).
So ONE listener carries THREE cleanup mechanisms — the `once:true` self-removal,
the commit-path manual remove, and the unmount-path manual remove. The
`once:true` and the manual removes double/triple-guard the same registration: a
missed path leaks or double-fires, and the reader cannot tell which cleanup is
authoritative. The fix is a single `useEventListener(window, "pointerup",
onSliderUp)` whose `stop()` handle is called on commit — one honest cleanup path,
no `once:true` crutch, no triple-bookkeeping. **The assay named this the crutch.**

## B3–B6 — the dynamic drag listeners converge on useDragCapture (E.W2 S2)

The `setPointerCapture` + dynamic add/remove pattern is hand-rolled at **four**
sites when ONE composable already abstracts it — the DRY headline of E.W2.

**B3 — `useDragCapture.ts` (the abstraction itself, 64L).** `addListeners`
(`:34-39`) attaches `pointermove`/`pointerup`/`pointercancel` on the captured
element; `removeListeners` (`:41-47`) detaches; `onUnmounted(removeListeners)`
(`:61`) is the unmount guard. The composable IS the drag-capture abstraction
(consumed by `AnimationVisualizer.vue`) — but its own internals hand-roll the
listener pair instead of riding `useEventListener`'s `stop()` handle, whose
`tryOnScopeDispose` covers the unmount-mid-drag leak the manual
`onUnmounted(removeListeners)` only partially guards.

**B4 — `useOrbitalPointer.ts` (the orbital doc listeners + `wheelTimeout`).**
`onPointerDown` (`:347`) calls `setPointerCapture` then attaches the document
listener set:

```js
doc.addEventListener("pointermove", onPointerMove);     // :353
doc.addEventListener("pointerup", onPointerUp);         // :354
doc.addEventListener("pointercancel", onPointerCancel); // :355
```

`removeDocListeners` (`:312-317`) detaches them, called from `onPointerUp`
(`:319`) / `onPointerCancel` (`:330`) on the captured document. PLUS the
wheel-dampen `setTimeout`: `wheelTimeout` is declared at `:59`, cleared +
re-armed at `:258-259` (`if (wheelTimeout) clearTimeout(wheelTimeout); wheelTimeout
= setTimeout(...)`) — the same vueuse-async transposition (`useTimeoutFn`) D.W1
applied to the controls tree. **Ordering note:** this file is also E.W1's
structural-thin target (376L → ≤250L); E.W1 thins it FIRST, E.W2 re-homes its
dynamic listeners + `wheelTimeout` SECOND — recorded so the two waves do not fork
the file.

**B5 — `AssetViewport.vue` (TWO inline re-implementations).** The asset-move drag
(`onPointerDown`, the move-handler closure) attaches `el.addEventListener
("pointermove"/"pointerup")` at `:211-212`, removes at `:207-208`; the
resize/rotate-handle drag (`onHandlePointerDown`, `:216`) attaches at `:271-272`,
removes at `:267-268`. Each is a verbatim inline copy of the `setPointerCapture`
+ add/remove pattern `useDragCapture` provides.

**B6 — `AssetLayerPanel.vue` (the third inline re-implementation).** The
row-reorder drag attaches `el.addEventListener("pointermove"/"pointerup")` at
`:171-172`, removes at `:167-168` — again the exact pattern.

**Convergence (E.W2 S2):** the asset-manager sites (B5, B6) ADOPT the existing
`useDragCapture` composable — three inline bodies collapse to three
`useDragCapture({ onStart, onMove, onEnd })` calls (DRY, net-deletion + leak-fix).
`useDragCapture` itself (B3) + `useOrbitalPointer`'s doc listeners (B4) ride
`useEventListener`'s `stop()` (the inv-ζ posture all the way down). The
`setPointerCapture` pattern is NOT an exception — vueuse `useEventListener`
returns a `stop()` handle AND auto-cleans on scope dispose, so the imperative
mid-gesture attach becomes `const stop = useEventListener(...)` + `stop()` on
pointerup, fully covered. It converts; it does not get allowlisted.

## B7–B9 — the ResizeObservers → useResizeObserver (E.W2 S3)

A `new ResizeObserver` + manual `observe`/`disconnect` is the observer analogue
of the hand-rolled listener — `useResizeObserver` owns the lifecycle and returns
`stop()`.

**B7 — `EasingTarget.vue:217-237`.** `resizeObs = new ResizeObserver(() =>
measureTrackWidth())` (`:231`), `observe(trackContainerEl.value)` (`:232`) in
`onMounted`, `disconnect()` (`:236`) in `onUnmounted`. The owned refs are already
in place (`trackContainerEl` `:201`, `trackEls` `:207`, D.W3.S1) — ONLY the
observer construction is hand-rolled. → `useResizeObserver(trackContainerEl, () =>
measureTrackWidth())`; net-deletion of the `resizeObs` var + the observe/disconnect
bookkeeping.

**B8 — `CSSCodeEditor.vue:151-171` (the deferred-init observer).** `onMounted`
(`:151`) checks `el.offsetWidth/Height > 0` and either `initEditor()` immediately
or installs a `new ResizeObserver` (`:156`) that waits for the container to gain
non-zero size, then `disconnect()`s itself (`:159`) and `initEditor()`s (`:161`).
A one-shot "wait for visible" lifecycle — exactly what `useResizeObserver`'s
returned `stop()` expresses (call `stop()` once the size is non-zero). The
`onUnmounted(disconnect)` (`:169`) is replaced by vueuse's auto-cleanup.

**B9 — `AmigaScene.vue:78-97` (the one judgment call).** `const ro = new
ResizeObserver(...)` (`:84`) handles canvas-resize → `camera.aspect` +
`renderer.setSize`, `observe(canvas)` (`:92`), stored as `resizeObserver` (`:96`)
and `disconnect()`'d in `onBeforeUnmount` (`:127`). It lives INSIDE the imperative
Three.js setup block (`onMounted`) the rest of which is already engine-loop
territory — the sibling `requestAnimationFrame` present loop (`startRenderLoop`,
`:99-107`) is allowlisted by `proof:decomposition`'s `ASYNC_ALLOWLIST`. E.W2's
default is to CONVERT it like B7/B8 (KISS — fewer exceptions); if the Three.js
renderer-lifecycle coupling argues for the imperative form, it is the ONE
`LISTENER_ALLOWLIST` entry, with the same rationale `proof:decomposition` gives
its present loop. Either way it is recorded, not silent.

## B10–B11 — the querySelector couplings → owned / child refs (E.W2 S4)

**B10 — `AnimationControls.vue:187-198` (the brittle one).**
`scrollActiveTabIntoView` (`:187`) reads:

```js
const activeBtn = header.querySelector<HTMLElement>("button[data-state=active]");  // :190
```

and `onMounted` (`:194`) reads:

```js
tabsListElRef.value = tabsHeaderEl.value?.querySelector<HTMLElement>("[role=tablist]") ?? null;  // :196
```

The `button[data-state=active]` read is brittle on TWO counts: it couples to
reka-ui's `data-state` attribute AND re-reads state Vue already tracks
(`storedControls.selectedControl` IS the active tab key). Reading the Vue state +
scrolling an owned tab-trigger ref into view is robust to a reka-ui markup change
and idiomatic — **read the state, not the DOM, for state Vue holds.** The
`[role=tablist]` read is intrinsic to reka-ui's rendered structure (no public
ref), so it becomes a DOCUMENTED single vendor contract — the same disposition
D.W3 applied to `[data-sonner-toaster]` (B14), not removed (there is no vendor
API for "the tablist element").

**B11 — `KeyframeCardList.vue:45-53` (the last step).** `getPreElements()` does
`Array.from(listEl.value.querySelectorAll("pre"))` (`:51`) — already `listEl`-
scoped (D.W3.S1 hardened the former GLOBAL `document.querySelectorAll("pre")`). It
is no longer a global reach, but it still IMPERATIVELY queries `<pre>` rather than
collecting them as declared child refs. The `KeyframeCard` children already expose
`$el` via `cardRefs` (`:47`); the LAST step is to have `KeyframeCard` expose its
`<pre>` ref and `KeyframeCardList` collect them — scoped query → declared
child-ref ownership, the brittleness analogue of D.W3's own-the-reference
principle. **Low** — already scoped, correct today, brittle to edit.

## B12–B15 — the BOOK / LEAVE-hardened sites (recorded, no E action)

The E mandate asked the assay to look for the FULL listener/observer/selector +
reactivity surface — these four come back **BOOK** (legitimate, not a coupling)
or **LEAVE-hardened** (D.W3 already closed the hazard). Recorded so the verdict is
on disk.

- **B12 — EasingTarget `getComputedStyle` (BOOK).** `readBallSizes` (`:139`)
  reads `getComputedStyle(root)` (`:142`) for `--track-ball-size-active`/`-muted`
  off an OWNED ref (`easingTargetEl ?? trackContainerEl`, both `useTemplateRef`,
  D.W3.S1). This is the legitimate CSS-token → JS bridge: the sizes are authored
  as design tokens and JS reads them once to size the comparison balls; the
  comment at `:269` documents the contract ("read by JS via getComputedStyle").
  Not a coupling — the canonical token-bridge pattern. BOOK.
- **B13 — snapshotCapture `getComputedStyle` (BOOK).** `timeline/utils/
  snapshotCapture.ts:12,37,44` reads `getComputedStyle(element)` to BUILD
  keyframes from a live DOM element (the timeline's snapshot-to-keyframe capture)
  — reading computed style IS the feature (you cannot capture a frame's resolved
  values without it). Not a brittle reach. BOOK.
- **B14 — `useToastGuard.ts` (LEAVE-hardened).** The `[data-sonner-toaster]`
  reach is a SINGLE documented vendor contract: `TOAST_ROOT_SELECTOR` (`:18`),
  with a header (`:1-17`) naming it as vue-sonner's private DOM attribute, pinning
  the dep version, and noting "if vue-sonner ships a public predicate, adopt it
  here." D.W3.S1 collapsed the former two-site coupling (CSSPasteDialog +
  KeyframesEditor) into this one greppable module. No E action — the contract is
  explicit, single-sourced, and owner-noted.
- **B15 — `useAnimationSync.ts` (LEAVE-hardened).** The D-audit B6 hazard (a
  permanent per-panel rAF loop running unconditionally) is CLOSED by D.W3.S4: the
  loop now rides `useRafFn` with a settle-detect (`SETTLE_FRAMES = 30`, `:27`) —
  it PAUSES when the three polled values hold stable across the window AND
  `isPlaying` is false (`:62-67`), and RESUMES only on INPUTS it does not own (the
  `isPlaying` edge `:82`, tab visibility `:87`, scrub `wake()` `:95`) — avoiding
  the `isStarted`-output deadlock the prior docstring named. No permanent loop, no
  deadlock. LEAVE — hardened.

## Verification (re-runnable)

```sh
cd demo
# B1–B6 — every manual addEventListener (15 raw calls, 6 files):
grep -rn "addEventListener" --include="*.vue" --include="*.ts" . | grep -v "/dist/" | grep -v "node_modules"
# B7–B9 — every new ResizeObserver (3 files):
grep -rn "new ResizeObserver" --include="*.vue" --include="*.ts" . | grep -v "/dist/" | grep -v "node_modules"
# B2 — the {once:true} crutch + the dual/triple manual remove:
grep -n "once: true\|removeEventListener" @/components/custom/animation-controls/controls/PlaybackRibbon.vue
# B4 — the orbital wheelTimeout setTimeout:
grep -n "wheelTimeout\|setTimeout" @/components/custom/orbital-drag/composables/useOrbitalPointer.ts
# B10–B11 — the 2 querySelector couplings:
grep -n 'querySelector<HTMLElement>("button\[data-state=active\]")\|querySelector<HTMLElement>("\[role=tablist\]")' @/components/custom/animation-controls/controls/AnimationControls.vue
grep -n 'querySelectorAll("pre")' @/components/custom/animation-controls/keyframes/components/KeyframeCardList.vue
# B12–B13 — the BOOK getComputedStyle reads:
grep -rn "getComputedStyle" --include="*.vue" --include="*.ts" . | grep -v "/dist/" | grep -v "node_modules"
# B14 — the single-sourced sonner contract:
grep -n "TOAST_ROOT_SELECTOR\|data-sonner-toaster" @/utils/useToastGuard.ts
# B15 — the settle-gated rAF bridge (D.W3.S4):
grep -n "SETTLE_FRAMES\|useRafFn\|pause()\|wake" @/components/custom/animation-controls/controls/composables/useAnimationSync.ts
```

**Hard gate for E.W2** — `proof:brittleness` (EXTENDED, clause 4, the
listener/observer gestalt): the existing instrument
(`scripts/proof-brittleness.mjs`) gains a clause that greps demo `.vue`/`.ts`
(comment-blanked via the existing `blankComments` helper, `dist/` excluded) for
`\.addEventListener\(` and `new\s+ResizeObserver\b` and asserts every hit is on a
documented `LISTENER_ALLOWLIST` (a `Set` mirroring `proof:decomposition`'s
`ASYNC_ALLOWLIST`, holding ONLY the genuinely-imperative engine-loop sites — e.g.
AmigaScene's Three.js observer if B9 keeps it imperative — each with a rationale +
a stale-entry guard so the list cannot rot). The clause BITES today: the 6
`addEventListener` files (B1–B6) + the 3 `ResizeObserver` files (B7–B9) red it;
after E.W2 only the allowlisted engine-loop site (if any) remains. The clause-1
`document.querySelector*` check already gates the global reach (B11 is already
scoped); B10's `data-state=active` read is covered by the new clause's spirit + a
documented vendor-contract comment for the `[role=tablist]` half. The gate reddens
on a re-introduced manual listener/observer outside the allowlist, an
un-allowlisted entry, or a stale allowlist path — the exact pattern E.W2 removes,
so "the listener/observer gestalt is completed" means what it says (inv ε).
