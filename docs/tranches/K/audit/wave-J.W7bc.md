# Tranche K — Audit: J.W7b + J.W7c

**Lane:** audit (DOCS ONLY — no source/test/gate/CI edits).
**Scope:** plan-vs-delivery for J.W7b (consume-edges + AX handoff) and J.W7c (U-register U1–U8), against their
spec + impl records + the live dist, cross-referenced with the user's same-day K-register findings.
**Tree:** `tranche-j-dev` == `master` @ `4f1fc4c`. `npm info @mkbabb/glass-ui version` → **3.13.0** (kf pins `~3.11.2`).
**Date:** 2026-06-11. Every claim cites file:line, a command + observed output, or a run ID (inv ε).
**Sibling lane docs (cross-ref):**
- `live-cold-play-path.md` — cold-path P0 root-cause + gate blindspot (B1 idle-bob)
- `live-session-gap-analysis.md` — full axis-coverage map (U-K1 through U-K20)
- `live-spring-sequence-mp-verdict.md` — spring/sequence/motion-path live-render audit

---

## §1 — J.W7b: PLAN vs DELIVERY

### 1.1 — What the spec claimed (J.W7b.md §S1 + §S2)

The wave had two bands:

- **Set (i)** — consume-on-3.9.0 + delete twin in one motion. Spec table: S1a (SegmentedTabs spring pill), S1b
  (ToggleChip cell), S1c (ScrubberTimeline base), S1d (fade-slide), S1e (MetricBadge/AnimatedDigit), S1f
  (StatusDot/Badge), S1g (gold-shimmer). Seven edges, each supposed to land at visual parity.
- **Set (ii)** — BOOK-with-target-version records for edges that require a FUTURE AX publish: eight entries
  (BOOK-1 through BOOK-8) with zero kf deletion, per the "narrow no-legacy suspension" rule.

### 1.2 — What actually landed (J.W7b-impl.md §A + §C)

**Set (i): 3 consumed, 4 parity-clause exits — majority did NOT consume.**

| Edge | Plan | Delivered | Evidence anchor |
|---|---|---|---|
| S1b / ADOPT-5 | consume ToggleChip cell | CONSUMED — both preset grids; `preset-active` deleted | `grep -rn "preset-active" demo/` = 0 (`J.W7b-impl.md §A`) |
| S1d / ADOPT-8 | consume fade-slide | CONSUMED — `<Transition name="fade-slide">`; 4 scoped KF rules deleted | `grep -rn "kf-editor" demo/` = 0 (`§A`) |
| S1g / RF-12 / STY-1 | consume gold-shimmer | CONSUMED — `.gold-shimmer` published utility; demo-local recipe deleted | `grep -n "@keyframes gold-shimmer-slide" design-idioms.css` = 0 (`§A`) |
| **S1a / ADOPT-7** | consume SegmentedTabs spring pill | **PARITY-CLAUSE EXIT** — primitive PUBLISHED but swap is appearance-bearing (animated indicator vs instant color change); twin survives `SpringScene.vue:8-26,211-236` | `J.W7b-impl.md §C-1` |
| **S1c / ADOPT-4** | consume ScrubberTimeline base | **PARITY-CLAUSE EXIT** — structurally non-isomorphic (PlaybackRibbon is ms-domain Slider; ScrubberTimeline is 0–1 normalized with own chrome) | `J.W7b-impl.md §C-2` |
| **S1e / ADOPT-1+2** | consume MetricBadge/AnimatedDigit | **PARITY-CLAUSE EXIT** — the swap IS the W7a appearance delta (`J.W7a.md D8`); moved to W7a lane | `J.W7b-impl.md §C-3` |
| **S1f / StatusDot/Badge** | consume or book | **BOOK (not consume)** — caveat probe found tone/auto-contrast NOT in 3.9.0 published palette; becomes BOOK-5 | `J.W7b-impl.md §B BOOK-5` + `§C-4` |

Plus STY-2..6 (hygiene: `50vh→50dvh`, named utility, token var, `transition: all` → enumerated) — all landed.
Set (ii): all 8 BOOK records written with zero kf deletion. Per-item absence proofs run against the 3.9.0 `dist/`.

**Assessment:** the plan's framing implied all seven S1 edges would be consumed; four exited on the parity clause.
The exits are legitimate (the parity clause is the spec's own safety valve, invoked correctly), but the accounting
is asymmetric — the wave header's "set(i) consumed" language can read as "all seven consumed" to a downstream reader.
A clear plan-vs-delivered table was not provided in the impl record; §C names the exits individually but a reader
must compare §A and §C to derive the split. Not a defect — a documentation clarity gap.

### 1.3 — The pin-state discrepancy (the W7b impl record's stated authority is WRONG)

The W7b impl record opens (`J.W7b-impl.md:1-7`):

> **Authority for every publish-state fact below:** the on-disk `node_modules/@mkbabb/glass-ui` **3.9.0**
> (pin `package.json "~3.9.0"`, lockfile resolves `registry.npmjs.org` 3.9.0).

But the git log shows:

```
56aa00f  chore(tranche-J): glass-ui ~3.9.0 → ~3.11.2 — the currency re-pin
73bf694  Merge branch 'j-impl-w7b' into tranche-j-dev
```

The re-pin to `~3.11.2` landed at `56aa00f` **BEFORE** the W7b merge at `73bf694`. The W7b worktree ran on 3.9.0,
but the post-merge integrated tree ran on `~3.11.2`. A further re-baseline at `1274b3b` ("the W7a worktree baseline
was captured on glass-ui 3.9.0; the merged tree carries ~3.11.2") confirms the slip was known and addressed for
visual-lock — but the W7b impl record's authority claim was never corrected.

**Consequence:** the §F verify ran `proof:visual-lock` on the merged tree (3.11.2), not the 3.9.0 tree the record
claims. The GREEN §F-1 result is true for 3.11.2, but the record's stated authority is 3.9.0. This is a documentation
error that could mislead a reader re-running the absence proofs (`§B` rows probed against 3.9.0 `dist/`) — the actual
on-disk authority during post-merge gating was 3.11.2. The W7b impl record should say "consumed on 3.9.0 / merged tree
and gated on 3.11.2."

P2 (documentation accuracy).

### 1.4 — Set (ii) BOOK-with-target-version: correctly structured

BOOK-1..8 each provide: (i) an absence proof via `grep -rl` against 3.9.0 `dist/`, (ii) the kf seam that survives
un-deleted, and (iii) a named GREEN-pending gate. The `no fabricated version number` rule (`§B` preamble) is respected
— no target version is invented. BOOK-5's resolution (the caveat probe → booked, not consumed) is the correct
procedure. BOOK-1 carries a slight ambiguity (`§C-1` parity-clause exit is for `variant="segmented"` but `§B BOOK-1`
books the connected-pill posture BEYOND the shipped variant) — these are distinct asks and the distinction is correctly
drawn, but the proximity could confuse; the parity-clause exit for S1a is explicitly not the same as the BOOK-1 posture
ask. Structurally correct.

### 1.5 — The clause-(a) completeness oracle (§D)

Per `J.W7b-impl.md §D`: every enumerated identity in `glassui-AX-handoff.md` is dispositioned with (i) evidence
anchor, (ii) consuming kf seam, (iii) terminal tag. One arithmetic softness flagged: REFINE attested 25 vs 24 distinct
items (readable as 24 or 25 depending on whether the `{types}` tail is counted once or twice). The impl record itself
flags this. Per-item completeness is not affected. Judgment: PASS with a disclosed count softness.

---

## §2 — J.W7c: PLAN vs DELIVERY (the U-register)

### 2.1 — What rendered vs what the impl record claimed

W7c impl record (`J.W7c-impl.md §U-register`) claims all eight user-register items fully dispositioned. The sibling
lane `live-spring-sequence-mp-verdict.md §1` confirms the THREE major redesigns (spring/sequence/motion-path) DO render
their claimed shapes on the built dist:

| U | Claim | Observed |
|---|---|---|
| U1 | `--phi` constant + golden bottom anchor (`style.css:128,138-139,223-229`) | CONFIRMED — `TransportDock.vue:8` consumes `--dock-bottom-anchor` |
| U2 | `GlassDock :always-expanded="false"` → collapsed pill with name + rainbow play | PARTIAL — see §2.3 |
| U3 | DockSelectTrigger → SelectTrigger (`EasingTarget.vue:64-70`); option span override killed (`EasingSelect.vue:68`) | CONFIRMED — both edits present in the live tree |
| U4 | `v-if="animationNames.length > 1"` on dock select; `v-else` static label | CONFIRMED — `TransportDock.vue:39`; logic lands; see §2.4 for judgment gap |
| U5 | SpringSidebar redesign: SegmentedTabs + labeled-field-grid + ToggleChip cells + `@keyframes` artifact section | CONFIRMED — shape renders; second-order defects remain (§2.5) |
| U6 | SequenceTarget redesign: contained frame + axis ruler + diagonal cascade + `--ball-p` shadow bug fixed | CONFIRMED — `sequence-full.png`; 5 rows, 5 handles, 5 axis ticks |
| U7 | MotionPathTarget stage sizes from slot; `block-size: min(100%, …)` (`:291-296`) | CONFIRMED — stage 416×416 INSIDE card; `overflowsCardBottom: false` |
| U8 | Folded into U5 (the spring sidebar IS the 03.21.14 pane) | CONFIRMED AS A JUDGMENT — see §2.6 |

So every U-register claim landed in source. The gap is the **unresolved K-register findings** that W7c did not catch.

### 2.2 — The work-order judgment gaps (U-K11 / U-K12 / U-K13 rooted)

#### U-K11 / U-K16: "spring still sucks — no proper keyframes editor"

W7c U5 introduced a "NEW ARTIFACT section — the KEYFRAMES VARIANT" (`J.W7c-impl.md:97`). The impl record calls it "a
REAL `@keyframes` block." What renders is a **read-only output** that overwrites user edits on every slider change:

- `artifactCss` is seeded by `watch(generatedArtifact, css => { artifactCss.value = css; })` (`SpringSidebar.vue:237-238`).
  Every preset/slider change clobbers whatever was typed.
- Editing does not feed back into `response`/`dampingFraction`.
- The `@keyframes` samples at 5 fixed stops (`SpringSidebar.vue:216`) — a preview, not an authoring surface.
- The visual-lock gate MASKS `.cm-editor` (`scripts/proof-visual-lock.mjs:237`) — treating it as ephemeral output.

**Work-order judgment wrong:** U5 interpreted "no proper keyframes editor" as "show a keyframes artifact" rather than
"mount an interactive editor with two-way binding." The engine OWNS the real editor (`KeyframesEditor.vue` /
`KeyframeTimeline.vue`); it was not wired to the spring scene. P1 unmet.

#### U-K12: "top tabs look awful (pills / dock-dropdown)"

W7c U3 addressed the **easing card** select (`EasingTarget.vue:64-70`, `EasingSelect.vue:68`) — a DockSelectTrigger →
SelectTrigger swap and option-span size correction. U3 did NOT touch `tab-trigger.css` or the `AnimationControls`
filing-tab chrome that the user meant by "top tabs":

- `demo/@/styles/animation-controls/controls/tab-trigger.css` — the Controls / Keyframes / Timeline tab pills —
  **zero W7c edits** (`git log --oneline 377eb3e -- demo/@/styles/animation-controls/controls/tab-trigger.css` = empty).
- The easing-card select is not "the top tabs" — it lives in the scene header, not in the controls panel tab bar.

**Work-order judgment wrong:** W7c misidentified U-K12's surface. The easing card select was a legitimate fix (U3
improves it) but it is not the tab chrome the user named. P1 unmet.

#### U-K13: "the two panes look awful — redesign idiomatically"

W7c U5 (spring) + U6 (sequence) addressed the primary layout defects. However, the spring scene renders **two left
control panes** simultaneously (`live-spring-sequence-mp-verdict.md §4`):

1. `SpringSidebar.vue` (top-left, 332px wide) — the U5 redesign: tabs + sliders + preset cells + artifact.
2. `StartingStyleTarget.vue` (bottom-left) — discrete demo: same 4 presets + a separate transport row.

The two panes drive the same `response`/`dampingFraction` — the four canonical presets appear THREE times total
(SpringSidebar cells + StartingStyle chips + the same spring visual output). The visual mismatch (cartoon-quiet card
with green rings vs pink-filled chips with a separate transport) is what the user called "awful." W7c never
consolidated the preset surface or the StartingStyle readout region. U8 was identified as "the spring sidebar" and
folded into U5, but U8 may have named the redundant StartingStyleTarget pane rather than the SpringSidebar itself.

**Work-order judgment partially wrong:** U5 redesigned SpringSidebar correctly (the impl record's U8 identification is
reasonable), but the TWO-PANE redundancy — the actual audit complaint — was not resolved. P1 partially unmet.

### 2.3 — U2 claim gap: bottom TransportDock does NOT collapse live

The W7c impl record claims (`J.W7c-impl.md:40-53`): the dock collapses to a "Rotations ▶" pill when unhovered.
`TransportDock.vue:23` carries `:always-expanded="false"`. But `live-cold-play-path.md §P1-2` proves otherwise:

```
BOTTOM (y:770): dock-layer--full is-active {visible,1},  dock-layer--summary {hidden,0}  → EXPANDED, w:315
```

The bottom transport renders its FULL layer at rest. Only the TOP dock (`:always-expanded` not set) collapses. The
collapse behavior for the bottom dock either has a glass-ui 3.11.2 contract mismatch (the RF-17 click-strand book,
`J.W7c-impl.md §GLASS-UI HANDOFF`, is related) or the `always-expanded="false"` prop is not sufficient to enforce
collapse without additional session-level gesture. The witness screenshot `desktop-transport-collapsed.png` in the
W7c impl record may have been captured in a specifically-triggered state rather than the default rest state.

P1 — the U2 "shrunken pill" claim does not hold live in the default cold mount.

### 2.4 — U4 / orchestrator's triage: NOT the cold-path root

The orchestrator suspected "U4 conditional-select deletion killed auto-binding side-effect." `live-cold-play-path.md §ROOT`
(git blame, `git show 377eb3e`) disproves this:

- The W7c U4 diff adds `<Select v-if="animationNames.length > 1">` + `<span v-else>` + the pointerdown actuation cure.
  Zero play-driver edits.
- The cold-path break is Tranche-H.W1 provenance (`256f6fe feat(tranche-H W1): the scene+playback state machine`).
- The actual root: `PLAY` effect → `adapter.resume()` → `scenePlaybackAdapters.ts:76-79` — `if (group.started && group.paused) group.resume()` — is a **no-op** for an unstarted group (`group.started === false` on first-ever entry).

The orchestrator's U4 suspicion is **disproven**. The defect predates J; W7c did not introduce it. It was already
present before any J wave, only surfaced by a cold hero CTA that no gate exercised.

### 2.5 — Spring scene second-order defects (unresolved after W7c)

From `live-spring-sequence-mp-verdict.md §2-5`:

- **Slider steps / scrubber thumb frozen** (`U-K15`): the spring transport scrubber is bound to the 6 Hz
  `PROGRESS_READOUT_HZ` readout mirror (`useSpringHotPath.ts:46,116`; `useSpringDemo.ts:416-422`). The scrubber thumb
  position is a 6-Hz step function, not a 60 Hz smooth value. Plus the rAF loop self-terminates on cold machine status
  `undefined` (`useSpringDemo.ts:166-169`), producing ~535 ms dead gaps. This is **P0** — the primary transport control
  non-functional on cold. W7c's spring redesign left this seam untouched.
- **U-K11/U-K16 unmet** — the read-only artifact, rooted in §2.2 above.
- **Active state is solid green, not red-dashed** (`U-K17`): `SpringSidebar.vue:80` and `StartingStyleTarget.vue:74`
  both use `data-[state=on]:shadow-[inset_0_0_0_1px_var(--color-progress)]` — a thin 1px solid green ring.
- **Two redundant panes** (`U-K13/U-K18`): §2.2 above.

### 2.6 — U8 identification confidence

The W7c impl record identifies "the 03.21.14 pane" as the spring sidebar, folding U8 into U5 (`J.W7c-impl.md:136-144`).
The reasoning is circumstantial (the spring sidebar is spring-adjacent and had a "jammed lone Monaco editor"). The user
may have meant the StartingStyleTarget pane (which also appears in the spring view and was not redesigned). Without the
original screenshot timestamp's content the identification is a reasonable inference, but the two-pane redundancy
remaining after the wave (§2.2) suggests the pane the user meant was NOT only the SpringSidebar. Confidence: medium.
Flag for K impl wave to re-probe what "03.21.14" shows.

---

## §3 — THE COLD-PATH P0 (U-K2 / U-K3 / U-K5)

### 3.1 — What the orchestrator triage said

The orchestrator's triage (a): "COLD PATH from HERO start screen is broken — clicking rainbow play does NOT smoothly
transition to cube animating; subjects freeze while playhead/slider advances. Suspect J.W7c U4 conditional-select
deletion killed auto-binding side-effect."

### 3.2 — Confirmed and rooted (`live-cold-play-path.md §P0-1`)

The cold-path break is **confirmed**. `probe-cold-play.mjs` + `probe-cold-precise.mjs` (fresh context, `localStorage.clear()`, single hero CTA click):

```
POST-CLICK SERIES (every 120ms, 16 samples):
  {t:120, hash:#/cube, slider:"0", isPlaying:false}  … identical for all 16
DISTINCT cubeTransform=1  slider=1  finalHash=#/cube
```

The navigation `#/ → #/cube` works. The engine never starts. The slider is frozen at 0. The rainbow play button stays
"Play animation" (never flips to "Pause"). `cold-cube-2s.png` (`screenshots-k/`) confirms the static state.

The root chain (`live-cold-play-path.md §ROOT`, file:line):

1. `useAnimationGroupPlayback.ts:65-67` — empty home group → `syncPlayState(true)` → emit `playStateChange`.
2. `useSceneMachineApp.ts:155-164` — `autoPlayNext=true; switchScene("cube"); dispatch(NAVIGATE)`.
3. `useSceneMachineApp.ts:100-130` — `markSceneReady → bindSceneAdapter → dispatch(SCENE_READY) → dispatch(PLAY)`.
4. `useSceneMachine.ts:171-179` — SCENE_READY: `restore()` skipped (fresh group, snapshot `playing:false, started:false`).
5. `useSceneMachine.ts:182-184` — PLAY: `if (changed) adapter?.resume()`.
6. `scenePlaybackAdapters.ts:76-79` — `resume(): if (group.started && group.paused) group.resume()` → **NO-OP** (group never started).

The machine's pure reducer wrote `{playing:true, started:true}` but the engine `AnimationGroup` was never started.
`group.started === false` so `resume()` is structurally unable to start it (`src/animation/group.ts:681-692`: `if (!this.started || !this.paused) return this`). The `AnimationControlsGroup.onMounted` fallback also misses: at mount
tick `animationGroup` is the EMPTY placeholder (length=0 check), real group binds later via `bindSceneAdapter`.

**W7c U4 provenance:** `git show 377eb3e -- …/TransportDock.vue` adds only the `v-if` guard + `v-else` span + pointerdown actuation. Zero play-driver edits. The orchestrator's U4 suspicion is **disproven**. The defect is
**Tranche-H.W1 latent** (`256f6fe feat(tranche-H W1): the scene+playback state machine`).

### 3.3 — The B1 gate blindspot (proof:live-session)

The W7c impl record claims: "`proof:live-session` — PASS (the gate-of-gates). B1 cube draw loop live (101 distinct
transforms)" (`J.W7c-impl.md §RUNTIME WITNESS`).

`k-verify-gate-blindspot.mjs` (documented in `live-session-gap-analysis.md §1`) ran the verbatim B1 oracle on the
cold-BROKEN state:

```
B1 distinct transforms: 101  → B1 verdict: PASS (GREEN)
ACTUAL engine state: play button = "Play animation"  → engine is NOT playing
```

The BREAKDOWN:
- `cubeCount: 0` — the `.cube` element (the engine-write surface) contributed ZERO distinct transforms.
- `graphCount: 1` — the `.graph` orbital tilt contributed 1.
- `idleHoverCount: 100` — the `.idle-hover` idle-bob animation contributed 100.

The `.idle-hover` CSS animation (`CubeTarget.vue:207-214`, `animation: idle-bob 3s ease-in-out infinite alternate`)
runs **unconditionally at rest** — it stops only when the class `.playing` is applied (`:210-211`). With the engine
OFF (never started), idle-bob runs freely and saturates the B1 `distinct >= 3` (or `>= 101`) threshold alone.

**The B1 claim is a gate blindspot, not a false pass.** The gate was authored to catch the E1 throw path (the original
"home empty-group throws" bug), which it does; but it was extended to serve as "cube draw loop live" evidence without
isolating the engine-write element from the CSS-animated elements. The gate's oracle (`distinct >= 3`) is satisfied by
the idle bob alone, so the B1 GREEN is structurally non-falsifying for "is the animation group running."

Additionally, the B1 leg (`proof-live-session.mjs:393-408`) navigates via `location.hash = "#/cube"` inside
`page.evaluate` AFTER the home play click — a DIFFERENT navigation mechanism from `runSceneSwitch` (which uses the
router) that may trigger a fresh remount/resolve, partially bypassing the broken home→cube handoff. The leg then fires
a SECOND `clickRainbowPlay` (`:409`), which IS the click that starts the real group on cube. So the gate exercises
the SECOND-click warm path, not the first-gesture cold path.

P1 — the B1 gate is GREEN over the broken cold path. Its oracle must be re-seeded with an isolated `.cube` write
assertion + play-aria-flip precondition + no seed + single gesture.

---

## §4 — GLASS-UI CURRENCY GAP

`package.json` `"@mkbabb/glass-ui": "~3.11.2"` in `optionalDependencies`. `npm info @mkbabb/glass-ui version` → **3.13.0**.

The tilde range `~3.11.2` permits patches (`3.11.x`) but blocks the minor bumps (3.12.x, 3.13.0). The gap is two minor
versions. The K-register U-K14 asks for the upgrade. `live-session-gap-analysis.md §2 F8` classifies this as
`(c) post-certification drift` — the pin was current at J WZ close; 3.12.0 and 3.13.0 published subsequently.

No changelog from 3.11.2→3.13.0 has been verified in this lane (docs-only constraint). The upgrade may resolve RF-17
(GlassDock collapse-crossfade click-strand, booked in `J.W7c-impl.md §BOOKS`) and/or RF-16 (PRM RO→render TDZ). The
kf-side interim mitigations (the pointerdown guard for RF-17; the `:freeze` guard for RF-16) remain load-bearing until
the relevant glass-ui fixes land and the re-pin verifies them.

P1 (currency gap; two minor bumps; no K wave plan yet).

---

## §5 — FOLD TABLE

| # | Finding | Sev | Seam (file:line) | Suggested wave-class |
|---|---|---|---|---|
| F1 | **Cold hero rainbow-play does NOT start the engine** — machine `PLAY` → `adapter.resume()` is a no-op (group unstarted); slider stuck 0; rainbow never vivid; 2nd click plays. Latent since H.W1. | **P0** | `useSceneMachine.ts:182-184` (PLAY→resume) + `scenePlaybackAdapters.ts:76-79` (resume no-op guard) + `useSceneMachineApp.ts:100-130` (markSceneReady / dispatch order) + `AnimationControlsGroup.vue:219-223` (onMounted autoplay missed) | **cold-play-engine fix** — adapter gains `play()` that handles unstarted group OR markSceneReady routes autoPlayNext through `group.play()` after bindSceneAdapter |
| F2 | **proof:live-session B1 greens over the broken cold path** — idle-bob (`.idle-hover`, always-on CSS) contributes 100/101 "distinct transforms"; cubeCount=0; B1 pre-seeds `isControlsPanelOpen` + fires a second click | **P1** | `proof-live-session.mjs:225-228` (seed) + `:393-411` (sample set + second click); `CubeTarget.vue:207-211` (idle-bob always-on) | **gate fix** — born-RED cold-entry leg: no seed, isolate `.cube`-only engine-write, assert slider advances from 0 under ONE gesture + play-aria flips |
| F3 | **U2 collapse claim does not hold live** — bottom TransportDock renders full layer at rest (not collapsed pill); W7c screenshot may be triggered-state, not default | **P1** | `TransportDock.vue:23` (`:always-expanded="false"`) vs observed `dock-layer--full is-active` at y:770 (`live-cold-play-path.md §P1-2`) | **dock-layout** (K) — decide transport default detent; glass-ui GlassDock collapse policy |
| F4 | **Spring transport scrubber frozen / stepping** — bound to 6 Hz `PROGRESS_READOUT_HZ` readout mirror + loop self-terminates on cold `status:undefined` (535 ms gaps) | **P0** | `useSpringHotPath.ts:46,116` (6 Hz gate) + `useSpringDemo.ts:166-169` (loop kills) + `:416-422` (6 Hz mirror to contractAnim.t) | **spring-transport-smoothness** — drive scrubber position off 60 Hz painter; fix loop-restart on cold machine |
| F5 | **U-K11 / U-K16 unmet: no real keyframes editor** — W7c U5 artifact is read-only output (overwritten on slider change; edits do not round-trip) | **P1** | `SpringSidebar.vue:216,230-238`; `KeyframesEditor.vue` (existing engine editor not wired) | **spring-keyframes-editor** — mount `KeyframesEditor`/`KeyframeTimeline` with two-way binding OR make the `@keyframes` output round-trip into solver params |
| F6 | **U-K12 wrong surface targeted** — W7c U3 fixed the easing card select (legitimate), NOT the AnimationControls filing-tab chrome (the user's "top tabs"); `tab-trigger.css` has zero W7c edits | **P1** | `demo/@/styles/animation-controls/controls/tab-trigger.css` (zero 377eb3e edits) vs `EasingTarget.vue:64-70` (what W7c touched) | **tab-chrome-refinement** (K) — the filing tabs / pill appearance |
| F7 | **U-K13 partial: two spring panes still redundant** — SpringSidebar + StartingStyleTarget both show 4 canonical presets + separate transport + overlapping readouts; U8 identified as "spring sidebar" when user may have meant the StartingStyle pane | **P1** | `SpringSidebar.vue:73-98` + `StartingStyleTarget.vue:68-80` (both drive `response`/`dampingFraction`); `live-spring-sequence-mp-verdict.md §4` | **spring-pane-consolidation** — one preset surface; demote StartingStyle to result card |
| F8 | **Active preset state solid green ring, not red-dashed** (U-K17) | **P1** | `SpringSidebar.vue:80`, `StartingStyleTarget.vue:74` (`var(--color-progress)` inset) | **final-state-token** — red + dashed outline for active/final state |
| F9 | **W7b pin-state authority mismatch** — impl record claims 3.9.0 authority; post-merge tree was 3.11.2 before W7b merge; §F verify ran against 3.11.2 | **P2** | `J.W7b-impl.md:1-7` vs `git log 56aa00f 73bf694`; `1274b3b` (post-merge re-baseline) | **documentation fix** — correct impl record authority claim |
| F10 | **glass-ui 3.11.2 pinned; 3.13.0 available** — tilde blocks two minor bumps | **P1** | `package.json` `"~3.11.2"`; `npm info @mkbabb/glass-ui version` = 3.13.0 | **chore: re-pin + verify RF-17/RF-16 fixes** (K upgrade wave) |
| F11 | **No gate drives the hero CTA cold** — all play-driving legs seed `isControlsPanelOpen` + hash-navigate directly to cube; hero is static-only in existing gate battery | **P1** | `scripts/proof-live-session.mjs:225-228` + entire gate battery; `live-session-gap-analysis.md §0` | **gate: born-RED cold-entry** (isolate cold path in dedicated B-leg, no seed) |
| F12 | **Sequence cold-freeze** — play engages (vivid) but master slider stuck at 0; same machine cold-status root as F1/F4 | **P1** | `SequenceTarget.vue` master transport; `live-cold-play-path.md §A-1`; cold `status:undefined` seam | shared with F1 cold-play-engine fix |
| F13 | **visual-lock re-baselined over the disliked state** — W7c re-captured the baseline in-motion; U-K13/K17 disliked state IS now the golden; drift user dislikes greens | **P2** | `scripts/baselines/visual-lock/*.png` (re-shot at `377eb3e`); `J.W7c-impl.md §VISUAL-LOCK` | **re-baseline after K refinement** — not before |
| F14 | **Orchestrator's U4 suspicion disproven** — W7c U4 is innocent; cold-path provenance is H.W1 latent | P2 (documentation) | `git show 377eb3e -- …/TransportDock.vue`; `live-cold-play-path.md §NOT W7c` | triage record correction (no source change needed) |

---

## §6 — SUMMARY OF JUDGMENT FAILURES

Where W7c's work-order judgment was explicitly wrong (beyond implementation gaps):

1. **U-K11 read-only artifact ≠ editor.** The user asked for "a proper keyframes editor." W7c delivered a
   read-only `@keyframes` preview that overwrites itself on every param change. The engine has the real editor
   (`KeyframesEditor.vue`). The work-order judgment interpreted the ask as "show the @keyframes text" rather than
   "make it authorable." P1 gap.

2. **U-K12 wrong surface.** The easing card select (U3) is a valid improvement but is not "the top tabs." The
   filing tabs in `tab-trigger.css` are the user-named surface. W7c's U3 fixed the correct tab within its own
   context (the easing select is a tab-peer in the dock) but left the AnimationControls panel tab chrome untouched.
   P1 gap.

3. **U-K13 only half-resolved.** W7c fixed the PRIMARY layout defects (dead checkerboard, slot overflow) but left
   the TWO-PANE redundancy and the mismatched visual grammar between SpringSidebar and StartingStyleTarget. The
   "awful" quality the user named is the redundancy + mismatch, not just the layout bugs. P1 gap.

4. **U8 identification.** Identifying "the 03.21.14 pane" as "the spring sidebar" when it may be the
   StartingStyleTarget is the first-order consequence of the above.
