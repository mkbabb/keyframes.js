# K Audit — wave J.W2 (demo seam completion · plan-vs-delivery)

**Lane:** wave-J.W2 — plan-vs-delivery (Tranche K DOCS fleet; implementation-silent)
**Spec:** `docs/tranches/J/waves/J.W2.md` (BINDING)
**Impl record:** `docs/tranches/J/waves/J.W2-impl.md`
**Head audited:** `4f1fc4c` (tranche-j-dev == master, 2026-06-11)
**Date:** 2026-06-11

---

## Executive summary

J.W2 delivers every named scope item (S1–S6) to the claimed state. All six mechanical
deliverables are verified at HEAD: the two recovered drag surfaces route through the shared
seam (B6-a at TRUE zero for the spec's named surfaces), the `selectedControl` single-writer
contract holds (the rogue CubeScene watch is deleted, the DFA projection is the sole writer),
the M2 overclaim is cured (the `settled` signal drives `isPanelTransitionDone` on mobile), the
AnimationMenuBar rename is executed, the spring painters are off the render graph, and all five
LS-20 casts are typed. All three new proof gates are wired into `proof:correctness`.

Four findings survive the delivery:

1. **demo/CLAUDE.md:52 (P2)** — the stale `AnimationMenuBar.vue` entry was HANDED to J.W5 (per
   spec S4.3); J.W5's 204-line demo/CLAUDE.md delta did NOT update this entry. `AnimationMenuBar.vue`
   does not exist in the tree; `TransportDock.vue` is the live name. The CD-1 inv-ε violation is
   TERMINATED in source code but survives in documentation. A consumer reading `demo/CLAUDE.md`
   will find a component path that does not resolve.

2. **`TimelineTrack.vue` latent B6-a bypass (P2)** — the J.W2 spec named THREE pre-existing
   B6-a bypasses: EasingCurveCanvas (W4-3, S1 — DONE), PlaybackRibbon (W4-4, S1 — DONE), and
   OrbitalDrag (BOOK — live-verified safe). A FOURTH bypass was not in scope and remains:
   `TimelineTrack.vue:170,194` calls `setPointerCapture` on diamond markers with inline
   `onMarkerPointerDown`/`onTrackPointerDown` handlers; the `.timeline-track` div carries a
   static Tailwind `select-none` but NO `acquireSelectSuppression` call and NO `body.is-dragging`
   token. A diamond drag that sweeps outside the `.timeline-track` boundary onto dock or
   chrome labels is unprotected. `proof:drag-gesture`'s 6-item `DRAG_SURFACES` roster does not
   include timeline diamond drags (`scripts/proof-drag-gesture.mjs:111-136`); the gate cannot
   catch a regression here.

3. **`useSphereSpin.ts` B6-a bypass (P2, low-severity)** — `useSphereSpin.ts:96` calls
   `setPointerCapture` on the Three.js canvas element with NO select-suppression token
   (`grep acquireSelectSuppression demo/amiga/useSphereSpin.ts` = 0 hits). The canvas element
   itself does not contain selectable text (a WebGL surface), so the practical risk of chrome
   text selection during an orbital drag on the amiga scene is low; but the posture is
   structurally inconsistent with the J.W2 claim of "B6-a at TRUE zero." `proof:drag-gesture`
   does not cover the amiga drag surface.

4. **Hero cold-path gate blindspot (P1)** — the orchestrator triage names U-K2/U-K3: "hero
   rainbow-play → no smooth immediate transition to cube animating; subjects freeze while
   playhead/slider advances." `proof:live-session B1` is the cited oracle for "cube 101 distinct
   transforms after openControlsPanel+select+play," but its implementation (`proof-live-session.mjs:
   380-413`) does NOT test the hero cold path. The B1 leg: (1) seedControlsOpen (pre-seeds
   localStorage), (2) loads HOME, (3) clicks rainbow play on the empty group (the E1 throw
   repro), (4) waits 1200ms, then (5) DIRECTLY sets `location.hash = "#/cube"` — bypassing the
   `autoPlayNext` mechanism entirely. It then samples idle-bob (`.idle-hover`) transforms, not
   group-play subject motion. The gate is green because it overrides the navigation rather than
   testing it. The true hero cold path — fresh page, no localStorage, click rainbow play, expect
   smooth nav to cube + animation — is exercised by NO gate in `proof:correctness`. The
   orchestrator's live audit observes the defect; the gate system cannot catch or regress it.

---

## §1 — S1 delivery verification (the two recovered drag surfaces)

**DONE per spec.** Both W4-3 and W4-4 are migrated to `useDragCapture` at HEAD.

- **`EasingCurveCanvas.vue`** — the inline `@pointermove`/`@pointerup` handlers and the surface-local
  `setPointerCapture` call are DELETED (confirmed absent); `@pointerdown="startDragging"` (`:15`)
  retains only the handle hit-test (`:211-240`) and passes to `useDragCapture`'s `onPointerDown`
  (`:241`, `:269-272`). The former local `user-select:none` at `:370` is DELETED (comment at `:375`
  marks the deletion). `grep acquireSelectSuppression demo/@/components/custom/EasingCurveCanvas.vue`
  = 0 hits (suppression inherited from the global token via the composable).
  `demo/@/components/custom/EasingCurveCanvas.vue:108,269-272` (command: `grep -n "useDragCapture
  \|onPointerDown" EasingCurveCanvas.vue`).

- **`PlaybackRibbon.vue`** — `useEventListener(window, "pointerup", onSliderUp)` is GONE (confirmed
  absent; `grep -n "useEventListener.*window\|window.*pointerup" PlaybackRibbon.vue` = 0 hits);
  `useDragCapture` at `:117` owns the scrub via `onScrubPointerDown`. The capture-phase
  `@pointerdown.capture="gatedSliderDown"` (`:6`) remains as the mobile-touch gate and routes to
  the composable's `onPointerDown` (`:132`).

**Census (the I.W4 invariant, extended):** `grep -rn "user-select\s*:\s*none" demo --include="*.vue"
--include="*.ts" --include="*.css"` returns 5 sites at HEAD:
- `design-idioms.css:751-752` — IS the global token rule (`html:has(body.is-dragging)`) — CORRECT.
- `ControlsPaneWrapper.vue:327` — `.sheet-grab-handle` STATIC property beside `cursor:grab`/`touch-action:none` — CORRECT (not gesture-scoped).
- `OrbitalDrag.vue:331` — the BOOK (verified live, stays — `J.W2-impl.md §OrbitalDrag BOOK`).
- `SheetGrabHandle.vue:68-69` — the grab handle's OWN `user-select:none` static affordance.

The B6-a invariant holds for all spec-named surfaces. The TWO new UNSCOPED surfaces (TimelineTrack
diamonds, amiga sphere-spin) are post-J.W2 findings; see §Findings.

**Gate:** `proof:drag-gesture` extended to 6 surfaces (roster `:111-136`); both new surfaces pass
with LAND assertions (bezier `d` mutates, ribbon `aria-valuenow` scrubs). The 4 pre-existing
surfaces are not regressed.

---

## §2 — S2 delivery verification (single-writer completion)

**DONE per spec.** The `selectedControl` single-writer contract holds at HEAD.

| Claim | Verified at |
|---|---|
| CubeScene rogue write DELETED | `CubeScene.vue:81-89` — comment marks the deletion; `grep -n "selectedControl\s*=" demo/app/scenes/CubeScene.vue` = 0 assignment lines (only comments + reads) |
| Three-site writer census | `grep -rn "selectedControl\s*=" demo/` returns: `AnimationControls.vue:324` (derivation-sync), `AnimationControls.vue:430` (user-pick → DFA projection), `App.vue:334` (dock `onDockSelectControl` → DFA projection). Zero scene/ribbon/dock-side writes outside these three authority sites |
| DS-2 field type still `string` | `controlOptionsStore.ts:6` — `selectedControl: string`. Per spec §Folds, DS-2 is a NOT-folded BOOK-adjacent row; the writer-count cure (S2) does not require the retype |
| `selectedAnimation: string \| null` | `controlOptionsStore.ts:10` — typed (the S6 LS-20 cure landed here) |
| S4-stretch flat mount | `EasingScene.vue:44-53` — panel mounts flat (no TabsTrigger/TabsContent); `SpringScene.vue:81-89` — same pattern |
| `ACTIVE_SUPER_KEY` + suspend-on-leave | `injectionKeys.ts:8-25`; `AnimationControls.vue:315-328` — the `isActiveSceneHost` gate present |

**Gate:** `proof:control-surface-single-writer` (new; wired in `proof:correctness`). Clauses
(b1)/(b2)/(b3) confirmed present in `scripts/proof-control-surface-single-writer.mjs`.

---

## §3 — S3 delivery verification (M2 — the spring-settle signal)

**DONE per spec.** `useSheetSpring` exposes `settled: Ref<boolean>` driven off the spring's own
state; `useControlsLayout` consumes it on the mobile path.

| Claim | Verified at |
|---|---|
| `useSheetSpring` returns `{ sheetT, settled }` | `useSheetSpring.ts:86` — `return { sheetT, settled }` |
| `settled` driven off `spring.settled` | `:54-58` — `const settled = ref(spring.settled)`; write callback updates both |
| Un-settle-first on re-open | `:80` — `if (sheetT.value !== target) settled.value = false` |
| `ControlsPaneWrapper` forwards the signal | `ControlsPaneWrapper.vue:156-158` — `onSheetSettled` prop; `:195-196` — `watch([settled, sheetOpen], ([isSettled]) => props.onSheetSettled(isSettled))` |
| `useControlsLayout` consumes on MOBILE path only | `:52-59` — `isMobileLayout` guard; `isPanelTransitionDone = true` on settled + open + mobile |
| Desktop `transitionend` gate kept | `:31-38` — the `onPanelTransitionEnd` handler present; two paths dispatch on layout mode |
| `onScopeDispose` (S5) | `useSheetSpring.ts:84` |

**Gate:** `proof:sheet-reopen-scroll` (new; `scripts/proof-sheet-reopen-scroll.mjs`); wired in
`proof:correctness`. The 390×844 `hasTouch` re-open leg is present in the gate script.

---

## §4 — S4 delivery verification (AnimationMenuBar → TransportDock rename)

**DONE in source; ONE doc-rot residue survives (P2 finding).**

- `TransportDock.vue` exists at `demo/@/components/custom/animation-controls/TransportDock.vue`
  (21,052 bytes; confirmed: `ls -la`).
- `AnimationMenuBar.vue` is ABSENT from the source tree (`find demo -name "AnimationMenuBar.vue"` = 0).
- All 10 source-side reference sites swept:
  `AnimationControlsGroup.vue:90,124,239,319` (template, import, `useTemplateRef`, comment — all
  reference `TransportDock`); `App.vue:328-335` (comment + `onDockSelectControl`); `design-idioms.css`
  sweep done; `useEasingDemo.ts` comment; `useSequenceDemo.ts` comment — all `AnimationMenuBar`-free.
  `grep -rn AnimationMenuBar demo/@/.../animation-controls/ demo/app/ demo/easing/ demo/sequence/
  demo/@/styles/` = 0 hits.
- **Residue (P2):** `demo/CLAUDE.md:52` still reads: `**AnimationMenuBar.vue**, animationDescriptions.ts`.
  This is the row the spec HANDED to J.W5 (spec §S4.3: "NOT patched here, flagged so the two waves
  do not collide"). J.W5's demo/CLAUDE.md delta (`J.W5-impl.md` records "demo/CLAUDE.md (204-line
  delta, LS-6/7/8, LS-15..19)") did NOT update this line. The grep terminal condition `grep AnimationMenuBar
  demo/ = 0` (the CD-1 termination criterion) is NOT MET tree-wide; it is met only if the doc is
  excluded. The inv-ε violation (asserting a component name in docs that doesn't exist) is perpetuated
  in `demo/CLAUDE.md`. Evidence: `grep -n "AnimationMenuBar" /path/to/demo/CLAUDE.md` → `:52`
  (confirmed at HEAD).

---

## §5 — S5 delivery verification (spring non-reactive writes + `onScopeDispose`)

**DONE per spec.**

- **DotPainter idiom:** `useSpringDemo.ts:105-122` delegates to `useSpringHotPath` which owns the
  `registerSpringPainter` registry and `repaintSprings` hot path. The 60 Hz frame function
  (`useSpringDemo.ts:160-201`) writes `springLive` non-reactive fields ONLY (`:178-192`), calls
  `repaintSprings()` (the direct DOM write path), and calls `maybeFlushReadouts(now)` (the few-Hz
  gated reactive flush). The 17-refs/frame storm is confirmed collapsed: `grep -n "\.value\s*="
  demo/spring/useSpringDemo.ts` returns 8 lines total — NONE inside the hot `frame()` body (`:160-201`);
  the `.value =` writes are all outside the rAF loop (construction + scrub/restore). `SpringTarget.vue:95-110`
  and `SpringSidebar.vue:108-125` register painters that write `el.style.transform` directly.
- **`useRafLoop` → `onScopeDispose`:** `useRafLoop.ts:1` imports `onScopeDispose`; `:60` calls
  `onScopeDispose(stop)`. The `onUnmounted` outlier is GONE (confirmed: `grep -n onUnmounted
  useRafLoop.ts` = 0 hits).

---

## §6 — S6 delivery verification (LS-20 casts)

**DONE per spec.** All 5 LS-20 sites typed.

| Site | Status at HEAD |
|---|---|
| `useEasingDemo.ts:89` `jumpTerm as any` | GONE — no `as any` in the file (confirmed: `grep "as any" demo/easing/useEasingDemo.ts` = 0 assignment lines; only comments referencing the old cast) |
| `useEasingDemo.ts:389` `contractAnim as any` | GONE — `.value` unwrap at `:399` (comment at `:399`) |
| `AnimationControlsGroup.vue:198,272` `= null as any` | GONE — `controlOptionsStore.ts:10` types `selectedAnimation: string \| null`; `grep "as any" AnimationControlsGroup.vue` = 0 hits |
| `AnimationControlsGroup.vue:217` `emit as any` | GONE — `AnimationGroupPlaybackEmit` interface in `useAnimationGroupPlayback.ts:5-13`; the DS-5 emit half resolved |

**BOOK remaining per spec:** `useAnimationGroupPlayback.ts:16` — `storedControls: any` (the DS-5
storedControls half; `J.W2-impl.md §NOT folded` confirmed it stays a BOOK).

**New `as any` sites NOT in LS-20 (outside J.W2 scope, noted as K candidates):**
`AnimationControlsControls.vue:59,71` (`setDirection`/`setFillMode` enum casts),
`TimingFunctionPanel.vue:72,85` (`'steps' as any`), `useTimingFunctionEditor.ts:196`
(`timingFunctionLiteralFor as any`), `CSSCodeEditor.vue:68-69` (monaco theme `as any`),
`useKeyframeOps.ts:102` (`.fromKeyframes as any`). These were not in the LS-20 census and are
not regressions of J.W2.

---

## §7 — Findings

### F1 (P2) — `demo/CLAUDE.md:52` AnimationMenuBar doc-rot not closed

- **Seam:** `demo/CLAUDE.md:52` — `**AnimationMenuBar.vue**` reference in the animation-controls
  description.
- **Evidence:** `grep -n "AnimationMenuBar" /path/to/demo/CLAUDE.md` → line 52 confirmed at HEAD.
  `TransportDock.vue` is the live name; `AnimationMenuBar.vue` does not exist in the tree.
  `J.W2.md §S4.3` explicitly hands this row to J.W5. `J.W5-impl.md` records a 204-line
  `demo/CLAUDE.md` delta (LS-6/7/8, LS-15..19) but does NOT mention the AnimationMenuBar rename.
- **Impact:** Any agent, developer, or automated gate consuming `demo/CLAUDE.md` as ground truth
  will reference a non-existent component. The CD-1 termination criterion (`grep AnimationMenuBar demo/ = 0`)
  is NOT fully satisfied tree-wide (only in source code, not docs). The J.W2 impl record's terminal
  claim "ZERO" is accurate only if `demo/CLAUDE.md` is excluded.
- **Disposition:** K.Wx doc hygiene — update `demo/CLAUDE.md:52` to reference `TransportDock.vue`.
  S-effort.

### F2 (P2) — `TimelineTrack.vue` latent B6-a bypass (uncounted, unproven)

- **Seam:** `demo/@/components/custom/animation-controls/timeline/components/TimelineTrack.vue`
  `:170,194` — `(event.target as Element).setPointerCapture(event.pointerId)` on diamond markers
  (in `onTrackPointerDown` and `onMarkerPointerDown`), with NO `acquireSelectSuppression` call
  anywhere in the file. The `.timeline-track` div carries Tailwind `select-none` (`:24`), which
  sets `user-select:none` on that element only — chrome OUTSIDE the track boundary is unprotected.
- **Evidence:** `grep -n "acquireSelectSuppression\|body\.is-dragging\|useDragCapture" TimelineTrack.vue`
  = 0 hits. `grep "setPointerCapture" TimelineTrack.vue` → `:170,194`. `proof:drag-gesture`'s
  `DRAG_SURFACES` roster (`scripts/proof-drag-gesture.mjs:111-136`) contains 6 items — none covering
  timeline diamond drags. The I.W4 audit `§3` named THREE B6-a bypasses (EasingCurveCanvas,
  PlaybackRibbon, OrbitalDrag) and did NOT enumerate TimelineTrack.
- **Impact:** A timeline diamond drag that sweeps across a dock label or chrome element can select
  text. The `body.is-dragging` token is never set; `getComputedStyle(body).userSelect` is `auto`
  mid-gesture for these drags. Born-RED on a real page.mouse drag from a diamond marker to a dock
  label (the I.W4 clause-a scenario, replicated for this surface). The gate is unexercised — the
  gate cannot catch a regression here.
- **Disposition:** FOLD K: extend `TimelineTrack.vue` diamond marker drags to call
  `acquireSelectSuppression`/`releaseSelectSuppression` (or route through `useDragCapture`), extend
  `proof:drag-gesture`'s `DRAG_SURFACES` roster with the timeline diamond surface.

### F3 (P2) — `useSphereSpin.ts` B6-a bypass (structural, low live risk)

- **Seam:** `demo/amiga/useSphereSpin.ts:96` — `canvasEl!.setPointerCapture(e.pointerId)` with no
  `acquireSelectSuppression` call anywhere in the file (`grep acquireSelectSuppression
  demo/amiga/useSphereSpin.ts` = 0 hits). The Three.js canvas element does not contain selectable
  text, but a drag that physically sweeps outside the canvas boundary to dock labels or chrome is
  structurally unprotected.
- **Evidence:** command `grep -n "user-select\|acquireSelectSuppression\|useDragCapture\|body.*dragging"
  demo/amiga/useSphereSpin.ts` = 0 hits. `proof:drag-gesture`'s roster does not include the amiga
  drag surface.
- **Impact:** Low live risk (canvas = WebGL surface, no selectable text); but the structural posture
  is inconsistent with the J.W2 S1 "B6-a at TRUE zero" claim for the demo as a whole. A future
  amiga scene change that puts DOM content alongside the canvas could elevate the risk unnoticed.
- **Disposition:** BOOK K: measure-first (verify live on the built dist; if `getSelection()` is
  non-empty after a canvas-to-chrome drag, convert to `acquireSelectSuppression`; per the
  born-RED-or-leave rule). The OrbitalDrag precedent (`J.W2-impl.md §OrbitalDrag BOOK`) applies:
  `setPointerCapture` on a canvas likely routes the pointer stream away from text-selection
  machinery — verify before converting.

### F4 (P1) — Hero cold-path gate blindspot: B1 does not test the hero CTA

- **Seam:** `scripts/proof-live-session.mjs:380-413` (the B1 leg) vs the user-facing "hero
  start-screen → click rainbow play → smooth transition to cube animating" path (U-K2/U-K3 from
  the orchestrator's live audit, 2026-06-11).
- **Evidence:** The B1 implementation:
  1. `seedControlsOpen(page)` — pre-seeds `localStorage.isControlsPanelOpen = true` (bypasses cold state)
  2. `page.goto("/#/")` — loads HOME
  3. `await clickRainbowPlay(page)` — home empty-group play (the E1 throw repro)
  4. `await page.waitForTimeout(1200)` — 1.2s wait
  5. `location.hash = "#/cube"` — DIRECTLY NAVIGATES to cube, bypassing the `autoPlayNext`
     mechanism (`useSceneMachineApp.ts:162-163`: `autoPlayNext.value = true; runSceneSwitch("cube")`)
  6. Samples transforms from `.cube`, `.graph`, `.idle-hover` — idle-bob motion, NOT group-play
     subject motion
  7. Clicks rainbow play AGAIN on cube (a real group this time) → asserts `distinct >= 3`
  The true hero cold path — fresh page (no localStorage), click rainbow play, observe smooth nav
  to cube AND the group animation running — is NOT tested by B1. The direct hash navigation at
  step 5 overrides whatever the `autoPlayNext` flag would have done, making B1 pass regardless of
  whether the hero CTA path works. The orchestrator's live audit observes subjects freeze while the
  playhead/slider advances (U-K2/U-K3) — a defect that B1 structurally cannot detect.
- **Potential root cause (requires browser-probe to confirm):** The `autoPlayNext` + `switchScene`
  path in `useSceneMachineApp.ts:155-166` and `bindSceneAdapter` at `:55-86` (note `:60`: "if
  (!group || isHome.value) return early without registering the cube group") may produce a race or
  stale-group state on the home→cube no-remount transition (the two share the same Suspense key
  "cube" — no `@resolve` fires, only the `watch(currentSceneId)` branch at `:143-147` drives
  `markSceneReady`). The `autoPlayNext.value = true` must be set BEFORE `switchScene` reaches the
  watch, and `bindSceneAdapter` must see `isHome.value === false` when called from `markSceneReady`.
  Not rooted here — requires a live probe against the built dist.
- **Disposition:** K.Wx (early K, blocking the hero experience): (1) write a born-RED gate clause
  that navigates from a COLD context (no localStorage seed), clicks rainbow play on the true hero
  start screen, waits for the `autoPlayNext` navigation to complete (poll for `activeScene==="cube"`
  in localStorage, NOT a direct hash set), then asserts the cube group is playing (≥3 distinct
  subject transforms within 2s). (2) Probe and root-cause the freeze. Priority: P1 — this is the
  first user interaction with the product.

---

## §8 — Open books (carried from J.W2 spec, confirmed not closed)

| Book | Spec reference | Status at HEAD |
|---|---|---|
| DS-2 `selectedControl: string` → `ControlSurface` retype | `J.W2.md §Folds` "NOT folded" | OPEN — `controlOptionsStore.ts:6` still typed `string` |
| DS-5 `storedControls: any` in `useAnimationGroupPlayback.ts:16` | `J.W2.md §Folds` "BOOK per spec" | OPEN — `useAnimationGroupPlayback.ts:16` confirmed `storedControls: any` |
| OrbitalDrag B6-a bypass (measure-first BOOK) | `J.W2-impl.md §OrbitalDrag BOOK` | OPEN — `getSelection()` EMPTY verified live; BOOK stands with live measurement |
| `proof:perf-frame-budget` IN_CI observe-only (B8 CI blind) | `audit/wave-I.W4.md §3` | OPEN — both clause (c)/(d) are `note()` under `GITHUB_ACTIONS` |

---

## §9 — Gate census for J.W2 deliverables

| Gate | Script | Wired in `proof:correctness`? | Born-RED confirmed? |
|---|---|---|---|
| `proof:drag-gesture` (extended to 6 surfaces) | `scripts/proof-drag-gesture.mjs` | YES (`package.json:96`) | YES per impl record (both new roster rows born-RED on pre-J.W2 tree) |
| `proof:control-surface-single-writer` (new) | `scripts/proof-control-surface-single-writer.mjs` | YES (`package.json:106`) | YES — the perf-battery 2026-06-10 §2 recorded RED (`selectedControl:"spring"` in easing store) |
| `proof:sheet-reopen-scroll` (new) | `scripts/proof-sheet-reopen-scroll.mjs` | YES (`package.json:107`) | YES per impl record (390×844 re-open stays `overflow-hidden` on pre-J.W2 tree) |

All three satisfy the `proof:gate-is-runtime` meta-gate (open a real browser, actuate a real
interaction, assert a felt product property). The `proof:easing-editor-live` gate reads
`tabpanelState:"(flat)"` on every easing entry, corroborating S4-stretch.

**Gate-coverage gap (F2/F3/F4):** timeline diamond drags, amiga sphere-spin, and the hero CTA
cold path have NO coverage in any gate in `proof:correctness`.

---

## §FOLD table

| Finding | Severity | Seam | Suggested wave-class |
|---|---|---|---|
| F1 — `demo/CLAUDE.md:52` AnimationMenuBar stale entry | P2 | `demo/CLAUDE.md:52` | K.Wx doc hygiene (S-effort; the J.W5 hand-off was not executed) |
| F2 — `TimelineTrack.vue` diamond drags latent B6-a bypass (uncounted, unproven) | P2 | `TimelineTrack.vue:170,194` + `proof-drag-gesture.mjs` roster | K.Wx demo-seam (extend seam + gate; born-RED-or-leave on the live probe) |
| F3 — `useSphereSpin.ts` B6-a bypass (structural, low live risk) | P2 | `demo/amiga/useSphereSpin.ts:96` | K.Wx BOOK (measure-first per OrbitalDrag precedent) |
| F4 — hero cold-path gate blindspot: B1 bypasses hero CTA via direct hash nav | P1 | `proof-live-session.mjs:380-413` + `useSceneMachineApp.ts:155-166` + `bindSceneAdapter:60` | K.W0/K.W1 (early K; hero experience is the product's front door; born-RED gate + root-cause required) |
