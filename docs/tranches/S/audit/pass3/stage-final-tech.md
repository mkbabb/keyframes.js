# stage-final-tech — TECHNICAL RE-CRITIC, the Scene Stage prototype (Tranche S · pass 3 · ROUND 3, FINAL)

**Lane:** Fable technical critic · **Date:** 2026-07-03 · **Status:** FINAL — SCOPED to round-2 residue
**Round-2 critique:** `stage-recritique-tech.md` (3 §4 blockers) · **v3 report:** `stage-proto-v3.md`
**Source audited:** `.claude/worktrees/wf_2fbb9dbc-c40-1` — `demo/@/components/custom/scene-stage/` + `demo/stage-proto/`
**Method:** read the v3 diffs in place, re-derived each cure from the code, checked the A–G / occlusion / warm-Suspense driver assertions and the stored transcripts.

---

## Verdict

All three round-2 §4 blockers are LANDED in code under the terms round 2 set. The two structural HIGHs from earlier rounds stay closed; nothing in the v3 visual/harness changes re-opens them or introduces a new correctness hole. **100 / 100.**

---

## Per-blocker verdict (round-2 §4 → round-3)

### Tech-1 — gate wiring + clause G — **RESOLVED under the accepted terms**

The task authorizes accepting the `proof:*` wiring as integration-wave content **iff** (a) the report states the ownership and (b) the wave carries clause G. Both hold:

- **Clause G LANDED and genuine.** `adversarial.mjs:250–309`: settle on A(`cube`) → `tapFront` (arm → `committing`) → a REAL disk drag inside the dwell (`mouse.down` + 6× `mouse.move`, dx ≈ −150px, well past the 8px slop). It reads `is-dragging` latched mid-drag (`draggingMid`, 271–273 — proves a true drag, not a no-op tap), then asserts `frontDuringDrag === frontAfterDrag === committed === A` and `armedLog.at(-1).id === A` (288–296). Falsifiable: pre-lock code let a drag `centerIndex` the ring off the armed slot. This is exactly the pointer H1 scenario the keyboard-only A/B omitted.
- **Ownership stated.** Report §5 (lines 186–190) restates it explicitly: wiring the drivers as repo `proof:*` roster entries against served **dist** needs App.vue integration (dock-pill rewire, real `useSceneTransition` type-merge, Suspense siblinghood), is NOT discharged here, and remains the wave's born-RED integration debt (design-v2 §12 / tech §4-item-1). Both accepted-terms conditions met.

### Tech-2 — warmScene + Suspense `onResolve` await in the VT update path — **RESOLVED (real, not a stub)**

`ProtoApp.vue`: `warmScene(id)` `await`s `loadSlowChunk()` (93–99, memoized so warm + the async component share the import). `doUpdate` (137–166) arms the per-commit `readyGate` (`armSceneReadyGate`, resolved by `@resolve="onSuspenseResolve"` on the `<Suspense>`) BEFORE the synchronous scene-swap batch, then `await`s that gate (2s-bounded, 155–158). The witness proves the block is on `onResolve`, not the bound: cold `updateMs = 308ms` (report §4) — between the ~300ms chunk latency and the 2000ms ceiling — so the callback demonstrably waited on the Suspense resolve; warmed `updateMs = 2.8ms` (chunk already resolved, no fallback ever). `SlowScene.vue` behind `<Suspense>` with a `data-slow-fallback` spinner captured only on the no-VT path. The round-2 microtask stub is gone; the D2.2 onResolve-await is genuinely exercised.

### Tech-3 — dead `useContentVisibility` export deleted — **RESOLVED**

`grep -rn useContentVisibility demo/ src/` → exit 1, ZERO occurrences anywhere in the worktree. The `useLivePreviewLOD.ts` header is reconciled (29–31: "the LIT-BAND `v-if` … is the pause authority — a rear card is UNMOUNTED, so there is no content-visibility / IntersectionObserver mirror to keep"). The "v-if is the pause authority" contract is no longer contradicted by resident CV machinery.

---

## v3-specific audit (new-in-v3 surface)

- **Visual/mount tier decouple — correct.** `CarouselDisk.vue`: `showPreview = lit && a < OCC_END` (146) is the PAINT authority; `lit` (hysteresis `[1.5,2.5]·step`, 68–69/99–102) stays the MOUNT authority. `StageCard.vue`: preview `v-if="lit" v-show="showPreview"` (118–119), poster `v-if="!showPreview"` (135), face/plate/poster `opacity = occlusion` (121/137/149), `willChange ← showPreview` (63). A hysteresis-residual card is mounted-but-poster-faced; occlusion (0 at `a ≥ OCC_END`) fades that poster to 0 in the penumbra. No bright residual UI paints. The mid-transit `a ∈ (OCC_START, OCC_END)` partial-opacity live preview is a desirable transient sweep-fade, not a defect.
- **Occlusion witness — genuine machine read.** `shots-v3.mjs` reads `getComputedStyle` opacity of `.stage-card__plate` + `.stage-card__poster` per card, asserts `visible ≤ maxVisible` and every occluded card `plate ≤ 0.1 ∧ poster ≤ 0.12` (45–50). Matches the report §1 verbatim transcript (all occluded faces 0.00/0.00).
- **A–G transcript complete** in the report body (§5, all seven PASS with per-clause witnesses). Occlusion (§1) and warm-Suspense (§4) transcripts are verbatim driver output.
- **fps re-run in budget.** Report §6 v3 re-run: min 97.1 / LoAF 0ms / medianFrame 8.3ms / 0 frames>50ms — budget MET. The v3 delta (occlusion opacity + `display:none` residual previews) is monotonically paint-REDUCING, so it cannot regress below the round-2 baseline; both the stored round-2 witness (min 56.2, still ≥55) and the v3 re-run clear the ≥55fps / <8ms-scripting / 0-long-task budget.

## Non-blocking hygiene (NOT un-landed cures, NOT new defects — no score impact)

- `gates/adversarial-final.txt` (02:15) is a stale A–F artifact predating the 02:43 clause-G addition; the complete A–G transcript lives in the report body §5. Refresh or drop the side-file when wiring for real.
- `gates/fps-trace-gpu.txt` (02:15, min 56.2) is the pre-visual-change round-2 run, not the v3 re-run (report §6, min 97.1). Both are in budget; the side-file just lags the report.

Neither is an un-landed cure (the code + drivers are updated) nor a new-in-v3 defect (the authoritative transcripts are in the report). Per the scoring rule they do not block.

---

## Score

**100 / 100.** Tech-1 clause G landed as a genuine falsifiable pointer-drag-during-committing gate with the `proof:*` ownership explicitly restated (both accepted-terms conditions met); Tech-2 warmScene + the Suspense `onResolve` await are real in the VT update path (cold 308ms block witnesses the onResolve wait, not the timeout); Tech-3 dead export deleted to zero and the header reconciled. The visual/mount decouple, occlusion witness, A–G set, and fps re-run are all clean and in budget. No un-landed cure and no new-in-v3 defect. The pair is wave-spec-ready; the wave carries the served-dist `proof:*` wiring as born-RED integration debt.
