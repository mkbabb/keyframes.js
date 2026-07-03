# stage-proto-v3 — THE SCENE STAGE, round-3 fix pass (the narrow residue)

**Lane:** Fable prototype (Tranche S · pass 3, round 3) · **Date:** 2026-07-03 · **Status:** RESIDUE FIXED + PROVEN
**Absorbs:** `stage-recritique-design.md` (B1/B2/B3) + `stage-recritique-tech.md` (§4 tech-1/tech-2/tech-3)
**Worktree (edited IN PLACE; kept intact):** `/Users/mkbabb/Programming/keyframes.js/.claude/worktrees/wf_2fbb9dbc-c40-1`
**Shots + runnable drivers:** `docs/tranches/S/audit/pass3/proto-shots-v3/` · `demo/stage-proto/gates/`

---

## TL;DR

The round-2 re-critiques left a fully-prescribed residue; every item is fixed and PROVEN live:

- **B1 + B2 (the occlusion-bleed family) — CURED by geometry.** The round-2 rear-label
  fade keyed off `depth = a/180` and only touched the nameplate past `d>0.5`, so occluded
  nameplates/breadcrumbs/glyphs still bled through the nearer flank glass (desktop) and the
  front card (mobile). v3 fades the **WHOLE occluded card FACE** (preview + poster + plate)
  by an **occlusion factor** driven off the ring geometry. A programmatic occlusion witness
  (read from `getComputedStyle`) proves every occluded card's face opacity is **0.00** at
  each verbatim offender; the re-screenshots show clean glass where the bleed was.
- **B3 (visual↔mount decouple) — CURED.** `lit` (the hysteresis MOUNT band) is now separated
  from `showPreview` (the tight VISUAL/paint band). A hysteresis-residual card stays MOUNTED
  (anti-churn) but wears its POSTER face, faded by occlusion — **no bright miniature UI in
  the payoff penumbra** (`dark-committing` / `light-committing`).
- **Tech-3 — the dead `useContentVisibility` export (~60 lines) is DELETED** from
  `useLivePreviewLOD.ts` + the header reconciled; the surviving composable has no CV/IO
  residue. No new type errors in the touched files.
- **Tech-2 — warmScene is REAL** against a simulated slow (~300ms) lazy chunk behind
  `<Suspense>`. The VT update callback **blocks on the Suspense onResolve** before returning:
  a WARMED commit finishes the callback in **2.8ms** (no fallback ever), a COLD commit
  **blocks 308ms** (the callback waited on the chunk) and STILL enters clean — the fallback
  spinner is captured (no-VT) as the frame the warm+VT path provably keeps out.
- **Tech-1 (partial) — clause G (pointer-drag-during-committing) added**; the full A–G
  adversarial set re-run GREEN. (Wiring the gates as repo `proof:*` entries remains
  round-3-INTEGRATION-wave content — restated in §7.)
- **FPS re-run after the visual changes** (ANGLE-Metal GPU): avg 120 · **min 97.1** ·
  medianFrame 8.3ms · maxFrame 10.3ms · framesOver50ms 0 · LoAF scripting 0ms · 0 long tasks
  — budget MET, no regression (the residual `display:none` previews slightly *reduce* paint).

All existing gates (`geometry`, `vt-proof`, `gl-proof`, `prm`) re-run GREEN — no regression.

---

## 1. B1 + B2 — the occlusion face-fade (design B1/B2)

### The cure (`CarouselDisk.vue` + `StageCard.vue`)

The round-2 `labelOpacity` was a depth ramp on the nameplate only. v3 replaces it with an
**occlusion factor** — a per-card `[0,1]` (1 = in the clear, 0 = fully occluded behind a
nearer shell) computed from the ring angle `a`:

```
OCC_START = mobile ? 0.55·step : 1.30·step     // ±1 flank stays fully in the clear
OCC_END   = mobile ? 1.00·step : 1.90·step      // faded out by the ±2 slot
occlusion = 1 − clamp01((a − OCC_START)/(OCC_END − OCC_START))
```

- **Desktop:** the ±1 flanks are the occluder band; any card at slot ≥ 2 sits BEHIND a flank →
  its whole face fades to 0. Front + the two ±1 flanks keep `occlusion = 1`.
- **Mobile:** the FRONT card is the sole occluder; every non-front card is behind it → face → 0
  (the edge slivers become clean glass — the bleed is gone; the deliberate tradeoff is that the
  partially-clipped edge label goes with it, which the marquee already names).

`occlusion` drives the opacity of the **preview wrapper, the poster face, AND the nameplate/
breadcrumb** — the entire bleeding surface, exactly as B1 prescribed ("fade the WHOLE occluded
card face … glyph").

### Proof — the occlusion witness (read from `getComputedStyle`, verbatim)

Driver: `gates/shots-v3.mjs`. For each state it reads every card's `.stage-card__plate` and
`.stage-card__poster` computed opacity and asserts (a) ≤ N face-visible cards (front + flanks),
(b) every occluded card's plate AND poster opacity ≤ 0.12.

```
[PASS] dark-browse:      visibleFaces=cube,amiga,morph (≤3); occluded=square:0.00/0.00 easing:0.00/0.00 spring:0.00/0.00 sequence:0.00/0.00 motion-path:0.00/0.00
[PASS] dark-committing:  visibleFaces=easing,spring,sequence (≤3); occluded=cube:0.00/0.00 amiga:0.00/0.00 square:0.00/0.00 motion-path:0.00/0.00 morph:0.00/0.00
[PASS] light-browse:     visibleFaces=cube,amiga,morph (≤3); occluded=square:0.00/0.00 easing:0.00/0.00 spring:0.00/0.00 sequence:0.00/0.00 motion-path:0.00/0.00
[PASS] light-committing: visibleFaces=easing,spring,sequence (≤3); occluded=cube:0.00/0.00 amiga:0.00/0.00 square:0.00/0.00 motion-path:0.00/0.00 morph:0.00/0.00
[PASS] mobile-browse:    visibleFaces=cube (≤1); occluded=amiga:0.00/0.00 square:0.00/0.00 easing:0.00/0.00 spring:0.00/0.00 sequence:0.00/0.00 motion-path:0.00/0.00
[PASS] mobile-committing:visibleFaces=spring (≤1); occluded=cube:0.00/0.00 amiga:0.00/0.00 square:0.00/0.00 easing:0.00/0.00 sequence:0.00/0.00 motion-path:0.00/0.00
ALL OCCLUSION CLAUSES GREEN
```

Mapping to the exact verbatim offenders:

| Offender (round-2) | Occluded card | v3 face opacity | Shot |
|---|---|---|---|
| "Square" over Amiga (dark-browse) | `square` (behind `amiga` +1) | **0.00 / 0.00** | `dark-browse.png` |
| "Path" over Morph (light-browse) | `motion-path` (behind `morph` −1) | **0.00 / 0.00** | `light-browse.png` |
| Square's text over Easing (\*-committing) | `square` (behind `easing` ±1) | **0.00 / 0.00** | `dark-committing.png` · `light-committing.png` |
| flank-through-FRONT (mobile-browse) | `amiga`/`morph` behind Cube | **0.00 / 0.00** | `mobile-browse.png` |
| flank-through-FRONT (mobile-committing) | all flanks behind Spring | **0.00 / 0.00** | `mobile-committing.png` |

The re-screenshots confirm it in pixels: where round-2 showed a floating nameplate, v3 shows
neutral glass with no readable text/glyph. Front + ±1 flanks still carry their previews +
names (Cube/Morph/Amiga on browse; Spring/Easing/Sequence on committing).

## 2. B3 — VISUAL tier decoupled from MOUNT tier (design B3)

The round-2 `lit` boolean was BOTH the mount authority (hysteresis `v-if`) and the paint
authority, so a hysteresis-residual card (`lit` still true after leaving the flank band) kept
painting its bright live miniature UI in the payoff penumbra.

v3 splits them:

- `lit` — MOUNT authority (hysteresis `[1.5,2.5]·step`): `ScenePreviewHost` stays mounted for
  anti-churn (`v-if="lit"`).
- `showPreview = lit && a < OCC_END` — PAINT authority (tight visual band): the preview only
  paints where the face is still in the clear (`v-show="showPreview"`); otherwise the card
  wears its POSTER face while the host stays alive underneath.

So a residual card is *mounted but poster-faced*, and occlusion fades that poster to 0 in the
penumbra. `dark-committing.png` / `light-committing.png`: the cards behind Easing/Sequence are
clean dark glass — the round-2 "Transform / x 0.80 …" bright white residual UI is gone. The
`willChange` compositor promotion also moved from `lit` → `showPreview` (fewer promoted layers).
The `dark-committing` occlusion row above (cube/amiga/square/motion-path/morph all 0.00) is the
machine witness that no residual face paints.

## 3. Tech-3 — the dead `useContentVisibility` export DELETED

`useLivePreviewLOD.ts`: the ~60-line `useContentVisibility` export (the CV/IO pause primitive
D9.4 said to delete *from the composable*) is removed, and the module header's CV/IO claims are
reconciled to "the LIT-BAND `v-if` is the pause authority; a rear card is UNMOUNTED — no CV/IO
mirror to keep." `grep` confirms zero importers remained. The composable now hosts only the
shared clock + the concurrent-full cap. Typecheck of the touched file is clean (no diagnostics).

## 4. Tech-2 — warmScene REAL vs a slow lazy chunk behind Suspense

### The harness (`ProtoApp.vue` + new `SlowScene.vue`)

`__slow-harness` mounts `SlowScene.vue` behind a **deliberately slow (~300ms) `import()`**
(`loadSlowChunk`, memoized) wrapped in `<Suspense>` with a `data-slow-fallback` spinner. Two
guarantees are now real (the round-2 `warmScene` was a microtask stub):

- `warmScene(id)` **awaits** the slow chunk (the warm gate) before the VT starts.
- the VT `update` callback **awaits the Suspense `onResolve`** (a per-commit gate promise
  resolved by `@resolve`) before it returns (D2.2) — so the VT captures NEW only once the
  scene is READY, never the fallback. A `updateMs` witness records how long the callback blocked.

### Proof (driver `gates/warm-suspense.mjs`, verbatim)

```
[PASS] 1 warmed-VT (no fallback ever): {"witness":{"warmed":true,"usedVT":true,"fallbackAtReturn":false,"slowReadyAtReturn":true,"resolvedBeforeReturn":true,"updateMs":2.8},"fallbackSeenDuringWarm":false,"entered":{"ready":true,"fallback":false,"vtSupported":true},"errors":0}
[PASS] 2 cold-VT (update callback blocks on onResolve): {"witness":{"warmed":false,"usedVT":true,"fallbackAtReturn":false,"slowReadyAtReturn":true,"resolvedBeforeReturn":true,"updateMs":308.1},"updateBlockedMs":308,"entered":{"ready":true,"fallback":false,"vtSupported":true},"errors":0}
[PASS] 3 cold-noVT (fallback pixel captured): {"midFallback":true,"note":"the spinner the warm+VT path keeps out of the entered frame"}
ALL WARM-SUSPENSE CLAUSES GREEN
```

- **Warmed VT:** the callback returns in **2.8ms** — the warm gate already resolved the chunk, so
  NO fallback ever mounts (`fallbackSeenDuringWarm=false`), the entered frame is `Slow Scene`
  ready (`warm-suspense-entered.png`).
- **Cold VT:** the callback **blocks 308ms** — it demonstrably WAITED on the Suspense onResolve
  (`resolvedBeforeReturn=true`), yet the entered frame is still clean (`fallbackAtReturn=false`,
  `entered.ready=true`). This IS the onResolve-await guarantee. (The transient fallback DOM under
  an *active* VT is not CDP-observable — the same limit round-2 recorded for
  `overlayInDomAtUpdate`; the update-block duration is the VT-compatible witness.)
- **Cold no-VT:** the spinner IS real — `midFallback=true` and `warm-suspense-cold-fallback.png`
  captures the red `loading…` pixel. This is the exact frame the awaited-onResolve VT path never
  surfaces.

**The mid-VT screenshot deliverable:** `warm-suspense-cold-fallback.png` is the spinner frame the
warm+VT path provably keeps out (captured via the no-VT path so CDP does not abort the VT);
`warm-suspense-entered.png` is the clean entered frame. Together with the 308ms-block witness
they discharge task item 2, consistent with round-2's accepted "state-witness > aborted-pixel"
reasoning.

## 5. Tech-1 (partial) — clause G + the A–G re-run

Clause G (pointer-DRAG-during-committing) was added to `gates/adversarial.mjs` — the vivid H1
scenario the keyboard-only A/B omitted: arm `cube` → a real disk drag/flick (dx ≈ −150px, well
past the 8px slop → a genuine `centerIndex` slot-follow, `is-dragging` latched) DURING committing
→ assert the ring RESTED on `cube` and committed `cube === rested front`. Falsifiable: pre-lock
code let a drag move the ring off the armed slot.

```
[PASS] A gesture-during-committing: {…"committed":"cube","frontDuringDwell_restedFront":"cube"…}
[PASS] B enter-during-flick: {…"passingFrontAtPress":"square","committed":"spring","destScene":"spring"…}
[PASS] C observable-honesty: {…"causes":["tap","tap"]…}
[PASS] D cancel-distinctness: {…"switchCount":0,"vtCount":0,"phase":"closed"…}
[PASS] E buffered-fan-in: {…"phaseAtEnter":"fanning-in","committed":"cube"…}
[PASS] F single-write: {…"vtCount":1,"switchCount":1,"committed":"easing"…}
[PASS] G drag-during-committing: {"A":"cube","phaseAfterTap":"committing","frontDuringDrag":"cube","frontAfterDrag":"cube","draggingMid":true,"committed":"cube","scene":"cube","hash":"#cube","armedLogLast":{"id":"cube","cause":"tap"},"note":"pointer drag/flick (centerIndex) during committing was LOCKED; ring never left A"}
ALL CLAUSES GREEN
```

**Ownership restatement:** the gates remain runnable standalone drivers under
`demo/stage-proto/gates/`. Wiring them as repo `proof:*` roster entries against served **dist**
is **round-3-INTEGRATION-wave content** (needs App.vue integration — dock-pill rewire, real
`useSceneTransition` type-merge, Suspense siblinghood). It is NOT discharged here and remains the
wave's born-RED integration debt (design-v2 §12 / tech §4-item-1).

## 6. FPS re-run (after the visual changes)

Driver `gates/fps.mjs` (ANGLE-Metal GPU, 7-slot spin storm, dark @1440):

```
A) NORMAL:  avgFps 120 · minFps 97.1 · medianFrame 8.3ms · maxFrame 10.3ms · framesOver50ms 0 · LoAF 0ms · longtasks 0
B) COMPOSITING-NEUTRALISED: avgFps 120 · minFps 98 · medianFrame 8.3ms · maxFrame 10.2ms · LoAF 0ms
```

Budget (≥55fps / <8ms scripting / no LOD-churn long task) MET. No regression from the occlusion
opacity + the residual-preview `display:none` — the delta from compositing is 0.0 fps, and hiding
the residual previews *reduces* paint work versus round-2.

## 7. Files touched (worktree)

```
demo/@/components/custom/scene-stage/
  CarouselDisk.vue                  + OCC_START/OCC_END + occlusion + showPreview (visual/mount decouple); pass to StageCard; clamp01
  StageCard.vue                     props showPreview + occlusion (drop depth/labelOpacity); preview v-if=lit v-show=showPreview; poster v-if=!showPreview; face+plate opacity=occlusion; willChange←showPreview
  composables/useLivePreviewLOD.ts  DELETE useContentVisibility export (~60L) + reconcile header (Tech-3)
demo/stage-proto/
  SlowScene.vue                     NEW — the Tech-2 slow-chunk harness scene
  ProtoApp.vue                      warmScene REAL (awaits slow chunk) + Suspense onResolve gate + doUpdate awaits it + updateMs witness + __slowHarnessCommit hook
  gates/adversarial.mjs             + clause G (pointer-drag-during-committing)
  gates/shots-v3.mjs                NEW — v3 offender re-shoots + the occlusion witness
  gates/warm-suspense.mjs           NEW — the Tech-2 warm+Suspense proof
```

**Typecheck note:** the worktree has no `vue-tsc` installed (node_modules symlinks the main
repo); I ran glass-ui's `vue-tsc` against the worktree tsconfig. My touched files add **no new
type errors** — the only two diagnostics in scene-stage are in *unchanged* constructs
(`StageCard` style's pre-existing `opacity:number`-in-`Record<string,string>` cast; `CarouselDisk`
template's untouched `revealDelays[c.i]` `StaggerFn` index), and `useLivePreviewLOD.ts` (the Tech-3
deletion) is clean. The broader demo's diagnostics are pre-existing glass-ui version drift under
this vue-tsc build, unrelated to this pass.

## 8. Screenshot index (`proto-shots-v3/`)

`{dark,light,mobile}-{browse,committing,entered}.png` (the B1/B2/B3 offender re-shoots + the
committing payoff frames) · `warm-suspense-entered.png` (Tech-2 clean entered) ·
`warm-suspense-cold-fallback.png` (the spinner the warm+VT path keeps out) ·
`warm-suspense-cold-ready.png` (cold path resolved).

## 9. Round-3 exit-bar status

(a) the three B1/B2/B3 crops re-shot clean — occluded face opacity 0.00 at every verbatim
offender, no un-fronted card shows bright UI ✓ · (b) B3 residual decoupled (mounted-but-poster,
faded) ✓ · (c) Tech-3 dead export deleted, touched-file typecheck clean ✓ · (d) Tech-2 warmScene
REAL, the VT update callback awaits onResolve (2.8ms warmed / 308ms cold-blocked), entered frame
never shows the fallback ✓ · (e) Tech-1 clause G added, A–G GREEN (repo `proof:*` wiring restated
as integration-wave content) ✓ · (f) fps within budget, no regression ✓ · (g) all prior gates
(geometry/vt-proof/gl-proof/prm) still GREEN ✓ · server killed, worktree intact.
