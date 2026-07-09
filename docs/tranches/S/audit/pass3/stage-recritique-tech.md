# stage-recritique-tech — TECHNICAL RE-CRITIC, the Scene Stage prototype (Tranche S · pass 3 · ROUND 2)

**Lane:** Fable technical critic · **Date:** 2026-07-03 · **Status:** ADVERSARIAL RE-REVIEW (round 2)
**Round-1 critique:** `stage-critique-tech.md` (8 blocking + polish)
**v2 delta:** `stage-design-v2.md` (D1–D11 + §P) · **v2 report:** `stage-proto-v2.md`
**Source audited:** `.claude/worktrees/wf_2fbb9dbc-c40-1` — `demo/@/components/custom/scene-stage/` + `demo/stage-proto/`
**Live verification (this pass):** I resolved `playwright-core` via the glass-ui require (as instructed), stood up the strict-port proto dev server, and **independently re-ran** `adversarial.mjs`, `vt-proof.mjs`, `gl-proof.mjs`, `geometry.mjs`, `prm.mjs`, `fps.mjs` against the served source. Every gate reproduced GREEN on my run (not a stale transcript). The fps GPU trace reproduced **cleaner** than the report's number (min 96 fps vs the reported 56).

---

## Verdict in one paragraph

The two HIGH structural holes are genuinely closed, and I confirmed the cures by re-deriving the event×state matrix from the new code AND by re-running the adversarial harness live. **H1 (stale-arm) is cured by construction, not by patch:** `setTargetIndex` is the *sole* orbit mutator, and every path that can reach it during `committing` is gated — `step`/`centerIndex` return early under the lock, the flick/drag/wheel/arrow-repeat verbs all route *through* those two, and even `grab` (halt-coast) is wired to `centerIndex` so it too is locked. The only re-target that survives inside `committing` is the arm's own spin-to-front, which targets `armed` — so `armed === orbit.target === rested front` is a true invariant. I tried five novel interleavings beyond the gate (hold-arrow + Enter, wheel-during-committing, Esc-during-warm, PRM + Enter-flick, concurrent double-fire) and could not desync front from armed. **H2 (VT double-capture) is cured:** the overlay tears down *inside* the `startViewTransition` update callback (`commitClose` sets `phase=closed` in the same synchronous batch, then the callback awaits the DOM flush before NEW is snapshotted); `overlayInDomAtUpdate === false` and no `view-transition-name` anywhere in the tree — both reproduced. The miniatures LOD-tier contract, the WebGL poster/create-at-front-settled/2s-debounced-dispose/≤1-context machinery, the hysteresis band, the 1-full concurrency ruling, the content-visibility drop (at the consumer), the ≥2 s re-armable failsafe, and the adversarial gate spec are all real in code and pass live. **What is NOT clean:** exit-bar clause (g) — "both gates *wired as real `proof:*` entries this round*" — is **not met** (re-deferred to round-3 integration, same posture round 1 was told to fix); the `useContentVisibility` machinery still lives as a dead export in `useLivePreviewLOD.ts` though D9.4 said delete it *from the composable*; no mid-VT screenshot was produced (task item 2's literal deliverable); and the adversarial gate has no pointer-drag-during-committing clause. None of these re-open a correctness hole — they are scope/hygiene carries the wave spec must own. The pair is wave-spec-ready.

---

## 1. Per-blocker verdict (round-1 → round-2)

### (1) H1/H1b — stale-arm — **RESOLVED (structural; re-derived + re-run)**

**Re-derived matrix from the new `useSceneStage.ts`.** States unchanged; the load-bearing change is the guard on the browse verbs:

| verb during `committing` | round-1 | round-2 (`useSceneStage.ts`) |
|---|---|---|
| `step(dir)` | guarded `carousel ∨ committing` → **moved ring** | guard `phase !== "carousel"` → early return + `devLockedBrowse` (206) |
| `centerIndex(i)` | same hole | same lock (212) |
| `requestCommit(other)` | re-armed | `id !== armed → ignored + dev-logged` (259) |
| `requestCommit(same)` | re-armed | no-op (259) |

**Why the lock is airtight (the part a matrix alone doesn't show).** `setTargetIndex` (useCarouselOrbit) is the only function that re-seats the ring spring. Its callers: `stage.step`/`stage.centerIndex` (both locked), and `stage.open` (guarded `phase==="closed"`). The gesture layer adds no new orbit access — `useStageGestures` converges every input on `step`/`centerIndex`/`requestCommit`: drag-move → `centerIndex(target)` (119), flick projection → `centerIndex(front+extra)` (155), wheel → `step` (167), front-tap → `requestCommit`, flank-tap → `centerIndex`. `grab` (the D1.1 halt-coast) is wired in `SceneStage.vue:195` to `stage.centerIndex(front)` — **so grab is itself locked during committing** (I checked this specifically because a direct-to-orbit grab would have re-opened H1 through the pointerdown seam; it does not). Arrow auto-repeat (`armRepeat`) calls `stage.step` — locked. Therefore, during `committing`, the *only* re-target is the arm's own spin-to-front toward `indexOfScene(armed)` (270–272). `target === armed` holds from the arm; the ring converges to `armed`; `maybeFire` fires only when `!spinning ∧ centered === armed`. Invariant proven.

**D1.1 moving-target arm.** `onKeydown` Enter resolves the id *at the call site*: `spinning ? sceneAt(targetIndex) : centeredSceneId` (413–415). `targetIndex` is the spring's **destination** (exposed newly in `useCarouselOrbit`, a `computed` off the discrete `targetIndex` ref that `setTargetIndex` writes *before* motion), never the passing live angle. Correct.

**Live re-run (my machine, fresh server):** all six clauses GREEN. Clause B this run latched `spring` (dest) while `square` was the passing front and `spinning===true` — `passingFront !== armed`, `armedLog.last === committed === "spring"`. Reproduced the H1b kill.

**Novel interleavings I tried to break it with (beyond the gate):**
- *Hold ArrowRight (repeat running) + Enter:* Enter reads `targetIndex` synchronously (consistent with the last `step`), arms it, locks the repeat's subsequent `step`s → converges. Safe.
- *Wheel during committing:* `step` → locked no-op. Safe.
- *Esc during the `warmScene` await:* `fire()` re-checks `phase !== "committing"` after the await (342) → aborts, `firing=false`. Safe.
- *Concurrent fire (settle-watch + failsafe + dwell):* `fire()` guards `phase!=="committing" ∨ firing` and `firing` is set synchronously before the await → later calls no-op. Idempotent.
- *PRM + Enter-flick:* PRM snaps `setTargetIndex` (spinning=false immediately), so Enter arms the snapped front, dwell=0, fires on armed. Safe.

**Residual nit (not blocking):** the adversarial **clause A "falsifies round-1" claim is imprecise.** It taps an *already-front, settled* card; round-1 code fired that case via an immediate `queueMicrotask(fire)` *before* the subsequent `ArrowRight` could move the ring — so round-1 would also have committed A. Clause A therefore tests *"the lock holds given the new 280 ms dwell"* (a real v2 guard), not a faithful reproduction of round-1's exact hole. **Clause B is the faithful H1b reproduction** (arm-while-coasting), and it does falsify the pre-cure semantics. Adequate as a guard; the A-falsification prose overclaims.

### (2) VT-frame exit — **RESOLVED in code; the mid-VT screenshot deliverable is missing**

`fire()` → `runSceneSwitch(id, { onUpdate: () => commitClose(id) })`; `commitClose` sets `phase="closed"` (overlay `v-if` unmounts) in the same synchronous mutation the scene-swap runs in, and `ProtoApp.doUpdate` then `await`s `nextTick`/350 ms before the callback resolves — so NEW is captured with no overlay. Re-ran `vt-proof.mjs`: `overlayInDomAtUpdate === false`, VT-name set `[]`, `stagePresentNow === false`, scene `spring`, zero console errors. VT-2 (`["stage", direction]` merge, never replace) and VT-3 (old `scene-subject` fades opacity→0 over 300 ms, not `animation:none`) are both in `ProtoApp`. The commit path never enters `zooming-in` (that phase is cancel-only) — confirmed by reading `fire`/`close`/`commitClose`.
**Gap:** task item 2 asked for *"code + the mid-VT screenshot."* No mid-VT frame was produced; the report argues CDP screenshotting pauses the compositor and aborts the VT. That is a *defensible* engineering claim, and `overlayInDomAtUpdate===false` is arguably a *stronger* witness than a pixel (it proves the DOM state at the exact capture boundary). But the literal deliverable is unmet — I mark it a minor documentation gap, not a correctness defect.

### (3) miniatures tier-2 + WebGL machinery — **RESOLVED**

D3 adopted as contract (square real, seven dioramas, amiga poster+GL). The WebGL lifecycle is **real machinery over a fake-GL body** in `ScenePreviewHost.vue`: `createGL` is the only mint site, gated on `props.settled = front && !spinning` (CarouselDisk 122); `disposeGL` runs on a 2 s debounce that a re-front cancels (138–144); `onContextLost` → `posterPermanent` + dispose; unmount disposes immediately. Re-ran `gl-proof.mjs`: `no-create-mid-transit ✓ · created@settled ✓ · single-create(reuse across <2 s overshoot) ✓ · dispose@2 s ✓ · maxContexts ≤1 ✓`. The report is honest that the GL body is a CSS stand-in; the *lifecycle* — the thing round 1 said "the architecture actively fights" — is genuinely inverted and proven. Real Three wiring is correctly scoped to round-3 integration.

### (4) hysteresis + concurrency — **RESOLVED; design↔code consistent**

`CarouselDisk`: `litMountT = step·1.5`, `litUnmountT = step·2.5` (mobile 0.5/1.0), applied as sticky per-card `litFlags` in `updateBands` (`a <= mount` sets, `a > unmount` clears) — exactly D9.1. `maxConcurrentFull: 1` (desktop AND mobile) — exactly D9.2; `useLivePreviewLOD` enforces the cap front-first (162–196). The proto's round-1 `2+1` is reverted. Deviation 4 (a swept card stays lit through `[1.5,2.5]·step`, so >3 cards can be transiently lit after a multi-slot spin) is D9.1 working as specified; the cadence cap bounds *render* cost to 1 full. Visible in `dark-committing.png` (Easing + Spring + Sequence all lit) — a **look** consequence for the design re-critic, not a perf one.

### (5) fps trace vs ≥55 fps / <8 ms — **RESOLVED (budget met); lighting-stack re-evaluated**

Re-ran `fps.mjs` (ANGLE-Metal, `--use-angle=metal --enable-gpu`, 7-slot spin storm, dark @1440): **avg 120 · min 96.2 · median 8.3 ms · maxFrame 10.4 ms · framesOver50ms 0 · LoAF maxScript 0 ms · 0 long tasks.** Budget (≥55 fps / <8 ms scripting / no LOD-churn long task) MET, with more headroom than the report's own (conservative) 56 fps. The D9.3 cuts landed in code and I verified each: `.stage-dim` is a plain radial-gradient scrim (no `backdrop-filter`); card `backdrop-filter` only on lit tier (front 6 px, flank 14 px, rear static-gradient glass); `will-change` only on lit cards (`StageCard` 48); the origin-scene rAF competition is a round-3 integration item (proto has no live scene). Two honest caveats: the `minFps` metric is *single-worst-frame*-driven (fragile — one 10–18 ms frame sets it), and under SwiftShader software raster the stack is 24 fps — but C-10 is explicitly a **LOCAL GPU acceptance**, and it passes. Scripting (the CI-honest number) is a clean 0 ms.

### (6) content-visibility ruling — **EXECUTED at the consumer; DEAD CODE remains in the composable**

`ScenePreviewHost` no longer imports or calls the CV/IO path: `visible === lit`, `v-if` is the stated pause authority (D9.4). **But D9.4 said "Delete the CV/IO pause path *from `useLivePreviewLOD`*"** — and `useContentVisibility` is still an **exported function** (`useLivePreviewLOD.ts:240–288`, ~50 lines) with a stale header comment (14/29–30/229–236) describing the deleted design. `grep` confirms **zero external importers**. So the ruling is *functionally* executed (no runtime effect, tree-shakeable, no behavior) but the *literal* deletion is half-done. **Polish** — the wave must actually delete the dead export + reconcile the header, or the "v-if is the authority" story is contradicted by 50 lines of resident CV machinery.

### (7) adversarial gate catches the H1 class — **RESOLVED (with one coverage nit)**

`proof:scene-stage-commits` (= `adversarial.mjs`) asserts `committed === rested front` (clauses A/B) — the exact property the H1 class violates — plus D (cancel distinctness: `switchCount 0 ∧ vtCount 0`), E (buffered fan-in), F (single-write `vtCount===1 ∧ switchCount===1`). All six reproduced GREEN live. **Nit:** the interleaving coverage is keyboard-only — clause A dispatches a single `ArrowRight`, B an `Enter`. There is **no pointer-drag / flick during-committing clause**, which was round 1's most vivid H1 scenario. Structurally covered (drag → `centerIndex` → locked, verified above), but the gate itself doesn't exercise it. Add a drag-during-committing clause when wiring for real.

### (8) failsafe ≥2 s re-armable — **RESOLVED**

`FAILSAFE_MS = 2000`; reset on every (re-)arm (`if (failsafe) clearTimeout(failsafe)` then re-set, 275–291); 280 ms minimum dwell makes `data-stage-phase="committing"` honestly paint (cures H6) and is 0 under PRM. The failsafe carries a loud invariant-breach `console.warn` if `front !== armed` at fire — good defensive telemetry that, under the lock, should never trigger.

---

## 2. Round-1 polish items — status (spot-checked in code)

- **Gold wedge KILLED (D5.6):** the glyph renders only in the `v-else` unlit branch (`StageCard` 121); a lit card renders `ScenePreviewHost`, never the silhouette. `dark-committing.png` confirms no top-left wedge. The dead `void d` depth-proxy is gone.
- **`fanTimer` cleared on cancel (H4):** `SceneStage.vue:130–132`.
- **Esc-during-committing = documented cancel (H2-adjacent):** matrix row + gate clause D.
- **fanning-in × requestCommit = BUFFER (H3-fan):** `pendingCommit` latch drained on `carousel` (196–200) + gate clause E.
- **Salvage bug the cure surfaced + fixed:** `setTargetIndex` no-move re-seat left `spinning` stuck `true` (park-without-emit); now sets `spinning=false` + mirrors angle (161–171). Same class fixed for the PRM open beat (SceneStage phase-watch hand-drives the snap). Legitimate finds; verified in code.

---

## 3. Deviations the report self-declares — my ruling on each

1. **Miniatures kept / real-target retired** — correct per D3. Accepted.
2. **Mobile cull uses `v-show` not `v-if`** — equivalent observable (unlit → no preview host mounted; the shell is cheap), avoids flick churn. Accepted.
3. **rAF direct-write ring NOT built (D9.3.4)** — justified: the GPU trace clears the budget with LoAF scripting at 0 ms, so the reactive round-trip is not the bottleneck. Pre-authorized cut, not required. Accepted.
4. **Transient >3 lit after a multi-slot spin** — D9.1 as specified; render cost capped by `maxConcurrentFull=1`. Accepted (perf); the *look* is the design re-critic's call.
5. **Gates NOT wired into `package.json`/`proof:*`** — **the one deviation that contradicts the binding delta.** D11 and exit-bar (g) both mandate *this round*: "both wired as real `proof:*` entries … proven-live-but-unwired in round 1." The proto re-defers with round-1's exact posture (now adversarial). The justification (served-dist wiring needs App.vue integration: dock-pill rewire, real `useSceneTransition`, Suspense siblinghood) is *legitimate* — you cannot wire a served-dist gate against a standalone harness — but it means **exit-bar (g) is not met by round 2.** This is a *scope carry*, not a re-opened defect: the wave spec (design-v2 §12) already names it. The wave must own it explicitly and treat the gate-wiring as born-RED integration work.
6. **`__stageDebug`** dev-only (`import.meta.env.DEV`) introspection seam — never shipped. Accepted.

---

## 4. What the wave spec MUST carry (technical)

**Blocking for the wave (not re-opened defects — integration/hygiene the round-2 substrate could not host):**
1. **Wire both gates as real `proof:*` entries against served dist** — the exit-bar (g) debt. Include a **pointer-drag/flick-during-committing** clause (the one H1 scenario the current gate omits) and keep A/B's `committed === rested front` assertion.
2. **Resolve the VT + async-Suspense ordering for real** — the proto's `warmScene` is a microtask stub and `doUpdate` awaits a `nextTick`/350 ms race; the real path must `await` the lazy scene chunk's Suspense `onResolve` before the update callback returns, or the VT grows a spinner. (Design D2.2 specifies it; the proto cannot exercise it.)
3. **Delete the dead `useContentVisibility` export + stale header from `useLivePreviewLOD.ts`** (D9.4's literal instruction) so the "v-if is the pause authority" contract isn't contradicted by resident CV machinery.

**Polish / documentation:**
- Produce a mid-VT frame (or state definitively, with a repro, that CDP capture aborts the VT and that `overlayInDomAtUpdate` is the canonical witness) — close task item 2's deliverable.
- Correct the adversarial gate's clause-A prose: it guards the lock-given-dwell; clause B is the faithful H1b falsifier.
- Re-evaluate the `minFps` single-worst-frame metric (consider a p95-frame budget) so a lone 12 ms frame doesn't drive the headline number.
- Real Three renderer behind the D3.3 lifecycle; miniature screenshot-diff-vs-hero pairing + maintenance rule (D3.4); origin-scene pause via `useSceneVisibilityPause`; dock-pill glass-ui affordance scoping — all round-3 integration, already enumerated in design-v2 §12.

---

## 5. Verification log (this pass)

| Gate (driver) | Re-ran | Result |
|---|---|---|
| `adversarial.mjs` (A–F) | yes | **ALL GREEN** (B latched `spring` dest while `square` passed front, spinning) |
| `vt-proof.mjs` | yes | PASS — `overlayInDomAtUpdate=false`, VT-name `[]`, stage gone, 0 errors |
| `gl-proof.mjs` | yes | PASS — 1 create @settled, dispose @2 s, ≤1 ctx, no mid-transit create |
| `geometry.mjs` (+ during-commit clause) | yes | PASS — body-child, no VT-name, rotateX(-15°), 1100px, back 281<front 468, widths 508→430→290→192, minOpacity 0.50, overlay-absent-at-update |
| `prm.mjs` | yes | PASS — arm→commit 50 ms (dwell=0), causes `[key,key]`, 0 errors |
| `fps.mjs` (ANGLE-Metal) | yes | avg 120 / **min 96.2** / maxFrame 10.4 ms / LoAF 0 ms / 0 long tasks — budget MET |

Source read in full: `useSceneStage.ts`, `useCarouselOrbit.ts`, `useStageGestures.ts`, `SceneStage.vue`, `CarouselDisk.vue`, `StageCard.vue`, `ScenePreviewHost.vue`, `ProtoApp.vue`, `useLivePreviewLOD.ts` (CV region), `useStageLight.ts` (flare), `sceneStageRegistry.ts`, all six gate drivers + `lib.mjs`. Shots present in the main repo (`proto-shots-v2/`, 30 files); `dark-committing.png` confirms the payoff frame (flare + ember bloom + press, marquee "Spring", no gold wedge).

---

## Score

**90 / 100.** Both HIGH round-1 blockers (H1 stale-arm, H2 VT double-capture) are cured *structurally* and independently re-verified live; the six adversarial clauses reproduce GREEN on a fresh run; the WebGL lifecycle, hysteresis, concurrency, CV-at-consumer, ≥2 s re-armable failsafe, and gold-wedge kill are all real in code. No unresolved *technical* design uncertainty remains — the residuals are (g) the gate-wiring debt that only App.vue integration can discharge, one dead-code deletion D9.4 left half-done, a missing mid-VT screenshot, and a keyboard-only adversarial gate. The design+prototype pair is **wave-spec-ready**; the wave must carry the four §4 items forward, chief among them wiring the (now genuinely adversarial) gates against served dist.
