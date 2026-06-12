# Tranche K AUDIT — LIVE spring / sequence / motion-path verdict

**Lane:** the redesigned panes (spring + sequence + motion-path + readouts) vs the user's K-register
(U-K11 / U-K13 / U-K15 / U-K16 / U-K17 / U-K18 / U-K19) — what the J.W7c IMPL RECORD *claimed* vs what
actually *renders* on the **built dist**.
**Date:** 2026-06-11. **Authority:** DOCS-ONLY audit lane (no source/test/gate/CI edits).
**Witness env:** `npm run gh-pages` → `dist/gh-pages`; `scripts/lib/demo-driver.mjs withPage`;
chromium 1440×900 @2×; `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui`, `KF_REQUIRE_BROWSER=1`.
Every claim cites file:line + a command/observed-output (inv ε). Screenshots under `screenshots-k/`.

---

## §0 — THE ENVIRONMENT FOOTGUN (observed first, blocks every browser lane)

A background **`vite build --watch --mode production`** process (`ps aux` → PID 31288, started 3:03PM)
runs the LIBRARY build on watch. `npm run build` **empties `dist/gh-pages`** (the memory's recorded
build/dist footgun). Across this audit `dist/gh-pages/index.html` was wiped **three separate times**
between probe invocations (observed: `ls dist/gh-pages/index.html` → `No such file or directory` after a
run that had just served it). Every browser probe had to `npm run gh-pages` immediately before running.
**P1 — workspace hazard:** any K browser lane that does not rebuild-right-before-serve will FAIL
vacuously (`HarnessRequiredError: dist/gh-pages not built`) through no fault of its own. The watch process
belongs to a sibling workspace, not this lane — but the K fleet must either kill it or every lane must
guard with a just-in-time rebuild. This is also a latent CI hazard if the two builds ever co-schedule.

---

## §1 — WHAT W7c CLAIMED vs WHAT RENDERS (the three scenes do render, redesigned)

The orchestrator's triage flagged a COLD-PATH freeze. **Confirmed and rooted below**, but first the
honest positive: contrary to a "totally broken" read, all three redesigned scenes **DO render their W7c
shapes** on a plain `#/spring` / `#/sequence` / `#/motion-path` hash-nav (no hero-CTA needed once the
route mounts; my first probes returned 0-inventories only because `navToScene`'s per-state settle landed
before the keyed `<Suspense>` resolved — a ≥3 s settle shows full content).

| Scene | W7c CLAIMED (J.W7c-impl.md) | RENDERS (observed) |
|---|---|---|
| spring | SegmentedTabs view fork + gridded sliders + 2×2 preset cells w/ in-cell balls + `linear()`/`@keyframes` artifact fork + editor (`:84-101`) | ALL PRESENT — `spring-panel.png`, `spring-scene-full.png`. SegmentedTabs "Live solver / Discrete transition", two LabeledSliders, 4 ToggleChip cells (Smooth/Snappy/Bouncy/Gentle) each with a green mini-ball, `linear()`/`@keyframes` underline tabs, CodeMirror artifact |
| sequence | contained frame + 0/400/800/1200/1600 axis ruler + violet→green diagonal cascade + green master scrubber (`:118-120`) | ALL PRESENT — `sequence-full.png`. 5 rows, 5 handles, 5 axis ticks, scrub-ball; card 704×446, contained stage 670×253 |
| motion-path | slot-sized cyan stage, no overflow collision (`:129`, `:277-296`) | HOLDS — `motion-path-rest.png`. stage 416×416 INSIDE card 704×664; `stageBottom 627 < cardBottom 782`; `overflowsCardBottom: false`. The U7 overflow fix is REAL |

So the redesign LANDED. The user's K-register is NOT "it's all broken" — it's **the second-order
defects the W7c source-shape gates never caught** (the appearance/interaction/state axis the memory's
gate-blindspot feedback names). Each rooted below.

---

## §2 — U-K15 · THE SPRING SLIDER LITERALLY STEPS — ROOTED (P0)

**The defect (observed, two distinct sub-roots):**

### 2a — the user-visible readouts + the sampler quantize to ~6 Hz
The hot positional path (the sampler ball, the live ball) is painted at 60 Hz off a NON-reactive snapshot
(`useSpringHotPath.ts:69-95`, `repaintSprings`). But every **reactive** consumer — the `x`/`v`
MetricBadges, the `settled` badge, the `springTimingFunction sweep` readout-accent, AND the bottom
TransportDock scrubber — reads refs flushed by `maybeFlushReadouts` at:

> `const PROGRESS_READOUT_HZ = 6;` — `demo/spring/useSpringHotPath.ts:46`
> `if (now - lastReadoutAt >= 1000 / PROGRESS_READOUT_HZ)` — `useSpringHotPath.ts:116`

**Measured:** the `.readout-accent` (showing `demo.sampled`) changed at intervals
`[25, 176, 350, 158, 167, 518, 173] ms` over a 1.6 s window — i.e. **~6 Hz at best (167 ms), stalling to
518 ms**, with values jumping `0.364 → 1.004 → 1.000 → 0.866` (large discrete steps = visible stepping).
The sampler ball's painted `style.left` showed only **24 distinct values over 120 frames** with a
**max dwell of 54 consecutive identical frames**.

### 2b — the bottom transport scrubber thumb NEVER MOVES, and the loop self-terminates
The TransportDock scrubber/PlaybackRibbon binds to `contractAnim.t`, which is mirrored from `progress`
via `watch(progress, p => contractAnim.t = p * duration)` (`useSpringDemo.ts:416-422`) — and `progress`
is itself a 6 Hz readout mirror (`useSpringHotPath.ts:110`, written only inside `flushReadouts`).
**Measured:** the `.slider-thumb` bounding-x was **FROZEN — `changeCount: 0` over 240 frames**, dwell 120
(distinct=1). The transport reported `aria-label="Pause animation"` (UI thinks it's playing) while the
thumb did not advance one pixel.

The loop also **self-terminates and re-arms**, producing ~535 ms hard stalls: the sampler `style.left`
change-intervals showed `[534.9, 13.7, 12.9, …, 23.9, 551.4, 13.2, …]` — bursts of 60 Hz (~12 ms)
separated by **~535 ms dead gaps**. Root: `frame()` returns `false` and the rAF loop dies whenever
`machine.status.value !== "playing"` (`useSpringDemo.ts:166-169`); on a settled spring + a cold machine
whose persisted `status` is `undefined` (observed: `localStorage["keyframes-js-scene-machine"]` =
`{"activeScene":"spring"}` — **no `status` field at all**), the loop arms at mount then dies and only
re-arms on a re-seat, so the slider/sampler stall for half-seconds at a time.

**This is the U-K15 "the spring animation slider literally steps" — the few-Hz readout cadence IS driving
the slider, exactly the orchestrator's suspected mirror.** P0: a core demo's primary transport control is
non-smooth/frozen for a human on the cold path. The seam: the sampler-sweep position (a continuous 60 Hz
truth) must drive the scrubber directly (painter-style, off the 6 Hz readout), OR `progress`/`contractAnim.t`
must update every frame while the sweep runs (the readout-numeral 6 Hz throttle is fine for TEXT, wrong for
a POSITION). Plus: the loop must not self-terminate while the sampler ping-pong is still sweeping (the
sampler is continuous even when the live spring settles).

---

## §3 — U-K11 / U-K16 · STILL NO PROPER KEYFRAMES EDITOR (P1)

W7c U5 claims a "KEYFRAMES VARIANT … a real `@keyframes` block" (`J.W7c-impl.md:84-98`). What renders is a
**read-only OUTPUT**, not an editor:

- `artifactCss` is seeded by `watch(generatedArtifact, css => { artifactCss.value = css; })`
  (`SpringSidebar.vue:237-238`) — every slider/preset change **overwrites** whatever the user typed.
  The comment is explicit: *"The editor is read-mostly here (the model mirrors the generated artifact)"*
  (`SpringSidebar.vue:230-231`). Edits do not feed back into `response`/`dampingFraction`.
- The `@keyframes` block is sampled at 5 fixed stops `[0, .25, .5, .75, 1]` (`SpringSidebar.vue:216`) —
  a sparse preview, not an authorable timeline.
- The visual-lock gate **MASKS `.cm-editor`** (`scripts/proof-visual-lock.mjs:237`) precisely because it
  is treated as ephemeral live output — corroborating that nobody intends it as an editor surface.

So U-K11 ("spring UI still inadequate — no proper keyframes editor") and U-K16 ("real OPTIONS — keyframes
etc.") are **unmet**: the spring exposes exactly two read-only artifacts (`linear()` / `@keyframes`) and a
copy button — no editable keyframe rows, no add/remove stop, no two-way binding. P1 (the engine OWNS a real
keyframes editor — `animation-controls/keyframes/KeyframesEditor.vue` — that the spring scene does not
mount). The seam: wire the spring artifact to the existing `KeyframesEditor`/`KeyframeTimeline`, or make
the `@keyframes` output round-trip into the solver params.

---

## §4 — U-K13 / U-K18 · TWO PANES "LOOK AWFUL" + READOUT NOISE — IDENTIFIED + ROOTED (P1)

The spring scene mounts **TWO left control panes** (`spring-scene-full.png`):

1. **`SpringSidebar.vue`** (top-left, x=71 w=332) — the U5 redesign: tabs + 2 sliders + 4 preset cells +
   artifact editor.
2. **`StartingStyleTarget.vue`** (bottom-left) — the @starting-style discrete demo: "Pause / Reverse /
   Re-seat" controls + **4 pink/red-filled preset chips** + a "Reveal/Dismiss" button.

**The redundancy (U-K18 "less useless information; two readout panes"):** the spring scene presents the
SAME four canonical presets THREE times — the SpringSidebar cells (`SpringSidebar.vue:73-98`), the
StartingStyle chips (`StartingStyleTarget.vue:68-80`), and they drive the SAME
`response`/`dampingFraction` (both call `demo.response.value = p.response`). Plus two live readout regions
(the SpringTarget header `x`/`v`/`settled` MetricBadges + the StartingStyle "eased by springLinearStops()"
caption). Confirmed readout inventory on spring: `x 1.000`, `v 0.00`, `settled`, `readout-accent 0.059` —
several overlapping. The two panes are visually mismatched (one cartoon-quiet card with green rings, one
with pink-filled chips + a different transport row), which reads as "awful / inconsistent." P1. Seam:
collapse the preset surface to ONE; demote the StartingStyle pane to a single tinted result card without
its own preset row + redundant transport.

---

## §5 — U-K17 · THE GREEN FINAL-STATE vs PREFERRED RED-DASHED — CONFIRMED (P1)

The user dislikes the green and wants "the main-controls red with dashed outline for the final state."
Both spring panes paint the active/final state as a **thin SOLID GREEN ring**:

- `SpringSidebar.vue:80` — `data-[state=on]:shadow-[inset_0_0_0_1px_var(--color-progress)]`
- `StartingStyleTarget.vue:74` — identical `inset_0_0_0_1px_var(--color-progress)`
- `--color-progress` is the spring scene's green tone (`SpringTarget.vue:184-186`,
  `--ball-tone: var(--color-progress)`).

So the active preset reads as a **solid 1px green inset**, not a red **dashed** outline. Visible in
`spring-panel.png` (the "Smooth" cell). P1. The "left-clipped draggable pane" half of U-K17: at 1440w the
StartingStyle pane is NOT clipped (`x=71`, `clippedLeft:false`) and neither pane is draggable (no
`Draggable`/drag handle on either control card — they are statically positioned). The clip likely
manifests at narrower widths or on the floating layout; the **draggable** ask is simply unimplemented for
the control panes. P2 for the clip (width-dependent), P1 for "should be draggable" (a missing affordance).

---

## §6 — U-K19 · "DRAGGING RESIZES THE CONTAINER" — NOT IN THIS LANE (rooted-out, handoff)

The orchestrator asked this lane to root U-K19. **It is not in spring/sequence/motion-path:**

- `getComputedStyle` over EVERY element across all three loaded scenes → **zero elements with
  `resize != none`** (observed: `U-K19 resize!=none: []`).
- The motion-path stage uses `aspect-ratio: 1` + `block-size: min(100%, 26rem)` + `inline-size: auto`
  (`MotionPathTarget.vue:291-296`); a synthetic traveller drag left `stageResized: false` (416×416 →
  416×416).
- A synthetic sequence row-handle drag re-timed the handle (`handleDx: 100`) with `cardResized: false`.
- The shared `useDragScrub` seam uses `setPointerCapture` + window listeners (`useDragScrub.ts:112-147`)
  — no width/height mutation anywhere.

So U-K19's "dragging resizes the container instead of dragging" belongs to a DIFFERENT demo — the likely
suspects are the **square box-drag** (`demo/square/`) or the **asset-manager / playground** viewport
(`AssetViewport.vue`), neither in this lane. P1 **HANDOFF** to the square/asset-manager lane: search there
for a `resize:` CSS or a pointer handler that writes `style.width/height`.

---

## §7 — SEQUENCE + MOTION-PATH PANES (U-K13 "awful panes") — the residual defects (P2)

The W7c redesigns genuinely fixed the gross "dead checkerboard" / "just broken" complaints (the contained
frame + the slot-sized stage both render correctly, §1). The residual refinements:

- **Sequence row labels are cramped/tiny** (`sequence-full.png`, `sequence-labels-crop.png`): the
  `--label-col: 3.25rem` (`SequenceTarget.vue:283`) packs a stacked index + `@Nms` at `text-mono-caption`
  with `opacity: 0.8` (`:363-366`) into a 52 px column — at desktop it reads as a dense smudge against the
  axis ruler. P2 (legibility, not breakage).
- **Sequence cold-freeze (shared with §2 root):** the scene mounts at `progress 0%`, badge "READY", master
  playhead pinned far-left — it does not auto-play on cold entry (same machine `status: undefined` root as
  §2b). The diagonal cascade is STATIC until the user scrubs/plays. P1 (cold-path, same seam as U-K15/U-K2).
- **Motion-path** renders clean (§1) — no residual layout defect found in this lane; the only nit is the
  traveller drag projecting to nearest-point-on-path can feel like it "jumps" off the cursor, but that is
  by-design projection, not a defect. P2 at most.

---

## §FOLD

| # | Finding | Sev | The seam (file:line) | Suggested wave-class |
|---|---|---|---|---|
| F1 | `vite build --watch` empties `dist/gh-pages` mid-audit (3× observed); any browser lane fails vacuously without a just-in-time rebuild | P1 | workspace process PID 31288 (`npm run build` watch) vs `npm run gh-pages` | INFRA / fleet-setup (kill watch or guard every lane) |
| F2 | **Spring slider STEPS** — readouts + scrubber thumb bound to the 6 Hz `PROGRESS_READOUT_HZ` mirror | **P0** | `useSpringHotPath.ts:46,110,116`; `useSpringDemo.ts:416-422` | spring-transport-smoothness (drive position off 60 Hz painter, not 6 Hz readout) |
| F3 | **Spring transport thumb FROZEN** + loop self-terminates (~535 ms stalls) on cold machine (`status: undefined`) | **P0** | `useSpringDemo.ts:166-169` (loop dies); machine cold-status seam | cold-path / scene-machine status restore (shared with hero CTA) |
| F4 | No real keyframes EDITOR — the `@keyframes` artifact is read-only output (overwritten on every param change) | P1 | `SpringSidebar.vue:216,230-238`; masked at `proof-visual-lock.mjs:237` | spring-keyframes-editor (mount `KeyframesEditor`/two-way bind) |
| F5 | Two spring panes look awful + redundant (presets shown 3×; two readout regions) | P1 | `SpringSidebar.vue:73-98` + `StartingStyleTarget.vue:68-80` | spring-pane-consolidation |
| F6 | Active/final state is solid GREEN ring, not preferred red-dashed outline | P1 | `SpringSidebar.vue:80`, `StartingStyleTarget.vue:74` (`var(--color-progress)`) | final-state-token (red + dashed) |
| F7 | Control panes not draggable; left-clip width-dependent | P1 (drag) / P2 (clip) | both spring panes statically positioned (no `Draggable`) | draggable-control-panes |
| F8 | U-K19 (drag resizes container) NOT in spring/sequence/mp — zero `resize`, zero stage-resize on drag | P1 HANDOFF | `useDragScrub.ts:112-147` clean; suspect square/asset-manager | HANDOFF → square / asset-manager lane |
| F9 | Sequence row labels cramped at 52 px; sequence static (cold) until scrub | P2 / P1 | `SequenceTarget.vue:283,363-366`; cold-freeze = F3 seam | sequence-label-legibility + (F3) |

**Verdict:** the W7c redesigns LANDED their stated shapes (spring tabs/cells/artifact, sequence contained
cascade, motion-path slot-sized stage all render as claimed). The user's K-register is the **un-gated
second-order axis** — the 6 Hz readout cadence driving the slider (F2/F3, the U-K15 root), the read-only
"editor" (F4), the redundant green-ringed twin panes (F5/F6), and the cold-path freeze (F3, shared with
the hero CTA). U-K19 is rooted OUT of this lane (F8 handoff).
