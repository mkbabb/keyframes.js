# K.W4 — THE PANE VERDICTS, ROUND 2 (the spring made an EDITOR · the stepping slider cured at ROOT · the green→red-dashed motion authority · the readout panes re-cut · single-option-select TOTALITY · the left-clip un-clipped + draggable · the FourierField REMOVED from the hero — and the design band closes ONLY on the user's TASTE review-packet verdict)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** DESIGN-TOTALITY-in-K
  (the round-2 pane verdicts — the surfaces the user indicted by NAME after J.W7c BUILT
  them: U-K11/K12/K13/K15/K16/K17/K18/K20. J's W7c landed the named shapes (the spring
  tabs/cells/artifact, the sequence contained cascade, the slot-sized motion-path stage all
  render as claimed — `live-spring-sequence-mp-verdict.md §1`); **the user's same-day
  verdict on the same panes was "still sucks", "awful", "looks awful"** (`K.md §the TASTE
  boundary`, citing `live-spring-sequence-mp-verdict.md`). This wave re-cuts those panes at
  the design altitude the mandate demands — on the W1 glass-ui 3.13.0 surface, in the W2
  display voice, over the W3 grid/anchoring tier — and **the design band closes ONLY on the
  user's verdict on a review packet** (the TASTE boundary; the named USER-DOMAIN step,
  scheduled BEFORE the K close). · **Scope (demo product half — inv-16 UNFENCED on the demo;
  the spring/dock/easing panes + the hero start screen + the motion-color token authority):**
  the spring scene re-cut to a PROPER keyframes-editor variant + the stepping slider cured at
  ROOT (`demo/spring/{useSpringHotPath.ts,useSpringDemo.ts,SpringSidebar.vue,StartingStyleTarget.vue}`);
  the green→red-dashed motion-color authority collapsed (`demo/@/styles/{style.css,design-idioms.css}`,
  `PlaybackRibbon.vue`); the tabs re-skinned to pills / merged into dock-dropdown items
  (`SpringSidebar.vue`, `tab-trigger.css`, `AnimationControls.vue`); the single-option-select
  rule made TOTAL (`ChromeDock.vue` + the sweep sites `live-dock-tabs-selects.md §3`); the
  left-clipped control panes un-clipped + draggable (the two spring panes); the FourierField
  REMOVED from the hero + the grid lines dialed less opaque
  (`demo/@/components/custom/editor-shell/EditorStartScreen.vue`, `demo/@/styles/design-idioms.css`).
  · **DAG-deps:** **K.W4 FOLLOWS W2+W3** (`K.md §WAVE MAP`: "K.W4 (the panes) follows W2+W3
  — the redesigns consume the new voice + grid"), and W2/W3 themselves follow **W1** (the
  glass-ui 3.13.0 re-pin — the `MetricCell`/`MetricStack`/`SegmentedTabs pill`/`Configurator`
  3.13.0 primitives this wave consumes presuppose it, `design-synthesis-k.md §4.1`,
  `live-glassui-currency.md §3`). The longest serial path is **W0 → W1 → (W2 ∥ W3) → W4 →
  WZ** (`K.md §WAVE MAP`). The cold-path P0's `proof:cold-entry` oracle and the de-vacuoused
  B1 (W0's own hard gate) are CONSUMED by this wave's verification — the spring/sequence
  cold-freeze (`live-spring-sequence-mp-verdict.md §2b/§7`) is W0's seam, NOT this wave's; this
  wave verifies its re-cut panes through the W0-honest engine-write oracle, never the idle
  bob. **K.W5's TASTE-boundary leg generates the review packets at THIS wave's close** (`K.md
  §WAVE MAP`: "the TASTE packets generate at W4's close").

## §Provenance (the consumed audit lanes + the U-K rows discharged)

- `live-spring-sequence-mp-verdict.md` — THE decisive input, the live verdict over the BUILT
  dist (1440×900 @2×, `scripts/lib/demo-driver.mjs withPage`, every claim file:line- +
  observed-output-rooted, inv ε): the three scenes DO render their W7c shapes (§1, the honest
  positive), but the second-order axis the source-shape gates never caught is the user's
  K-register. **The stepping slider, dual-rooted (§2):** the user-visible readouts + the
  sampler quantize to ~6 Hz (§2a — `PROGRESS_READOUT_HZ = 6` at `useSpringHotPath.ts:46`,
  the readout-accent measured changing at `[25,176,350,158,167,518,173] ms`, the sampler
  `style.left` 24 distinct values over 120 frames, max dwell 54 frames); the transport
  scrubber thumb NEVER MOVES + the loop self-terminates (§2b — the thumb `changeCount: 0`
  over 240 frames; `contractAnim.t` mirrored from `progress` via `watch(progress, p =>
  contractAnim.t = p*duration)` at `useSpringDemo.ts:419`, and `progress` is itself a 6 Hz
  readout mirror written only inside `flushReadouts`; the loop dies whenever
  `machine.status.value !== "playing"` at `useSpringDemo.ts:166-168`). **No real keyframes
  EDITOR (§3):** the `@keyframes` artifact is READ-ONLY output — `artifactCss` seeded by
  `watch(generatedArtifact, css => artifactCss.value = css, {immediate:true})`
  (`SpringSidebar.vue:238`), the comment explicit "*The editor is read-mostly here*"
  (`:230`); sampled at 5 fixed stops; the `KeyframesEditor` the engine OWNS
  (`animation-controls/keyframes/KeyframesEditor.vue` — confirmed present) is NOT mounted.
  **Two panes look awful + redundant (§4):** the spring scene mounts TWO left control panes
  (`SpringSidebar.vue` top-left x=71 w=332 + `StartingStyleTarget.vue` bottom-left), the SAME
  four presets shown THREE times. **The green final-state vs preferred red-dashed (§5):** both
  panes paint the active state a thin SOLID GREEN ring (`SpringSidebar.vue:80`,
  `StartingStyleTarget.vue:74`, both `inset_0_0_0_1px_var(--color-progress)`); neither pane is
  draggable; the left-clip is width-dependent. **U-K19 ROOTED OUT (§6 — handoff, NOT this
  lane):** zero `resize != none` across all three scenes — U-K19 belongs to the playground-only
  `AssetViewport` (square/asset-manager), dispositioned RECORD/playground-scope in **K.W6 §T5**
  (the drag-seam terminations wave, NOT K.W4). **Sequence/motion-path residuals (§7):** sequence labels
  cramped at 52px (P2), motion-path clean.
- `live-dock-tabs-selects.md` — U-K12 (tabs-vs-pills) + U-K16 (single-option totality). **The
  "awful tabs" rooted (§1):** the in-panel `tab-trigger-base` rule uses `var(--font-serif)` at
  `--type-prose` (1.125rem) — the DISPLAY voice oversized for a control-panel tab switcher
  (`tab-trigger.css:28`); the user's preferred replacement is "pills if tabs at all, likely
  dock-dropdown items instead" (Option A pill-strip / Option B dock-dropdown — the SpringSidebar
  view/artifact `SegmentedTabs` at `SpringSidebar.vue:29-34,110-115` are the in-app sites, the
  `tab-trigger-base` serif-leak is the standalone site). **The single-option violation rooted
  (§2.1, the S1 row):** `ChromeDock.vue:200` guards the controls-tab `<Select>` with
  `v-if="hasControlPanel"` = `allControlTabs.value.length > 0` — so easing (`["easing"]`) +
  spring (`["spring"]`) render a 1-item dropdown (the U4 dead-chrome case, `controlSurfaceDFA.ts:76-85`);
  the fix is `> 1` + a static label `v-else` (mirroring `TransportDock.vue:92-95`). The full
  sweep (§3, twelve sites S1-S12): S1 is the only VIOLATION; S2-S12 are OK (4-static-option
  selects, 2-option segmented tabs, the already-guarded transport name select); S9
  (AssetPropertiesPanel) is BORDERLINE P2 + **playground-only — NOT deployed-SPA scope (U-K19
  recorded, not folded here)**.
- `live-fourier-grid.md` — U-K20 (the FourierField removal + grid opacity). **The single mount
  point (§1.1):** `EditorStartScreen.vue:65-86` (the `.fourier-vacancy` block) + imports
  (`:91,92,96,97`) + the RF-16 freeze guard (`:101-118`) + the scoped style (`:178-205`);
  desktop-only (≥1024px). **Live-verified PRESENT (§1.2):** `CANVAS_3s {found:true, w:416,
  h:252, nonZeroAlpha:2197}` — the field actively draws. **The removal seam (§2, 7 hunks),
  all consumers exclusively here** (`grep -rn "@mkbabb/glass-ui/fourier|/color" demo/` → only
  EditorStartScreen.vue:96-97). **The vacancy after removal is HONEST blank grid (§3.1):** the
  lower-left quadrant is pure two-tier graph paper; no fabricated replacement — "the user's
  intent is clearance, not substitution" (K20-E). **The grid opacity (§4):**
  `--graph-opacity: 5%` / `--graph-major-opacity: 12%` at `design-idioms.css:182-183`;
  suggested landing 3% / 8% — but the 12% was deliberately raised above a former 0.10α floor
  to satisfy a substrate-legibility gate (§4.1 caveat — **the wave must re-check that gate, not
  just the user's eye**).
- `design-synthesis-k.md` — the design-language synthesis (the suffusion verdict). **The
  one-line synthesis (§0):** the demo has a coherent display-language at the HERO that does
  NOT propagate inward; every control pane drops to a flatter/greener/quieter register that
  loses the audacious-typography pop, swaps the hero's RED-dashed motion-language for the
  disliked GREEN, gives equal weight to chrome and data, and does not re-cluster on
  pathological widths. **The U-K17 incongruence (§3, the load-bearing color finding):** the
  user's PREFERRED anchor ALREADY EXISTS — a solid red ball chasing a dashed-red destination
  twin in the cube AnimationVisualizer (`AnimationVisualizer.vue:21,35`); the disliked GREEN is
  a SEPARATE palette (`--color-progress: hsl(142 71% 45%)` at `style.css:275`) driving the
  spring slider thumbs + preset rings + balls + the scrub track `.timeline-green`
  (`PlaybackRibbon.vue:156`); the incongruence in ONE control is the cube ribbon's RED ball ON a
  GREEN track. The unification is a TOKEN-level fix (the spatial-color analog of the W2
  display-token collapse): **ONE motion-color authority, the red-dashed, suffused across every
  ball/track/ring**. **The ADOPT table (§4.1):** the five 3.13.0 primitives — `MetricCell`
  (the display-tier big-number readout, the missing audacious type IN the pane), `MetricStack`
  (the single container-queried readout primitive replacing the two-pane split), `SegmentedTabs
  variant="pill"` (U-K12), `Configurator` (the row-based parameter editor — the structural
  answer to "no proper keyframes editor"), `DockRail` (multi-context dock nav). **The
  taste-anchor ledger (§5):** the four the user named — the rainbow play (PRESERVE), the icon
  family (PRESERVE + EXTEND as the in-pane accent source), the hero serif (PROPAGATE), the
  red-dashed final state (UNIFY). **What is already correct (§6 — do NOT "refine"):** the hero
  pane, the dock glass chrome, the cube controls-card grammar, the rainbow play CTA verbatim,
  the `.labeled-field-grid` subgrid idiom.

The U-K register rows this wave OWNS (each rooted to a consumed lane + the K.md cluster row):
**U-K11** (no proper keyframes editor), **U-K12** (the awful tabs → pills/dropdown), **U-K13**
(two panes look awful), **U-K15** (the slider literally steps — cured at root), **U-K16**
(single-option-select totality + real options), **U-K17** (the green→red-dashed final state +
the left-clip + draggable), **U-K18** (better hierarchy, less useless information), **U-K20**
(remove the FourierField + dial grid opacity). Plus the design-synthesis suffusion items
WITHIN PROPORTION (`design-synthesis-k.md §2` — the pane-suffusion contract; bounded by `§6
what is already correct`).

## §The state, verified (file:line / observed-output anchors — confirmed against the tree at K author-time)

- **The stepping slider's two roots (U-K15), confirmed in source:**
  - `demo/spring/useSpringHotPath.ts:46` — `const PROGRESS_READOUT_HZ = 6;` (verified
    present); `:116` — `if (now - lastReadoutAt >= 1000 / PROGRESS_READOUT_HZ) {` →
    `flushReadouts()` (verified). The reactive `progress`/`x`/`v`/`settled` refs are written
    ONLY inside `flushReadouts` — the 6 Hz mirror. The HOT positional path `repaintSprings`
    (`:93`) paints at 60 Hz off a NON-reactive snapshot — so the SAMPLER ball is smooth but
    every reactive consumer (badges, scrubber) steps.
  - `demo/spring/useSpringDemo.ts:419` — `contractAnim.t = p * contractAnim.options.duration;`
    inside `watch(progress, …)` (verified) — so the bottom TransportDock scrubber, bound to
    `contractAnim.t`, is a SECOND-order 6 Hz mirror. `:166-168` — `if (machine.status.value
    !== "playing") { … return false; }` (verified) — the rAF loop self-terminates on a
    settled spring / a cold machine whose persisted `status` is `undefined` (the
    `live-spring-sequence-mp-verdict.md §2b` cold-status root, SHARED with the W0 cold-path
    seam).
- **The read-only "editor" (U-K11), confirmed:** `demo/spring/SpringSidebar.vue:237` —
  `const artifactCss = ref("");`; `:238` — `watch(generatedArtifact, (css) => {
  artifactCss.value = css; }, { immediate: true });` (verified) — every param change
  OVERWRITES the editor buffer; `:230` the comment "*The editor is read-mostly here (the
  model mirrors the generated artifact)*". The real `KeyframesEditor.vue` exists at
  `demo/@/components/custom/animation-controls/keyframes/` (verified: `KeyframesEditor.vue`,
  `KeyframeCard.vue`, `CSSCodeEditor.vue`, `composables/`, `utils/` all present) — the cube
  grammar the spring does not mount.
- **The green final-state ring (U-K17), confirmed:** `demo/spring/SpringSidebar.vue:80` —
  `data-[state=on]:shadow-[inset_0_0_0_1px_var(--color-progress)]` (verified); the same
  `--color-progress` inset at `StartingStyleTarget.vue:74` (per the lane). `--color-progress`
  resolves the disliked green; the preferred red-dashed lives ONLY at
  `AnimationVisualizer.vue:21,35` (`design-synthesis-k.md §3`).
- **The single-option violation (U-K16), confirmed:** `demo/@/components/custom/dock/ChromeDock.vue:101`
  — `const hasControlPanel = computed(() => allControlTabs.value.length > 0);` (verified);
  `:182,196,200,223` all gate on `hasControlPanel` — so a 1-tab scene renders the `<Select>`
  + separators. The fix is the `> 1` partition + a static label.
- **The FourierField (U-K20), confirmed:** `demo/@/components/custom/editor-shell/EditorStartScreen.vue`
  mounts `<FourierField>` (per `live-fourier-grid.md §1.1`, the single mount point); the grid
  tokens at `demo/@/styles/design-idioms.css:182-183` (per `styling-typography-k.md §7`,
  `live-fourier-grid.md §4`).

## §Goal

Re-cut the panes the user indicted by name — so the FELT product meets the bar, not just the
source shape. **The user's same-day verdict on the W7c-built panes was "still sucks" / "awful"
/ "looks awful"; this wave's GREEN is the user's verdict on a review packet, not an agent's
"designer-eye PASS"** (the TASTE boundary, `K.md` inv). Nine moves, each at the gestalt altitude
the mandate demands (NO few-Hz mirror driving a position; NO read-only artifact passed off as an
editor; NO per-pane green patch; NO single-option dropdown anywhere; NO retuned magic offset):

1. **The spring made a PROPER keyframes EDITOR (S1).** Mount the engine-owned `KeyframesEditor`
   (the cube grammar) in the spring scene — two-way bound, per-stop editable, add/remove stop —
   so U-K11/U-K16's "real options" is met. The read-only artifact viewer is RETIRED (no-legacy).
2. **The stepping slider cured at ROOT (S2).** The continuous 60 Hz sampler position drives the
   scrubber directly (painter-style, off the readout); the 6 Hz throttle is kept for the TEXT
   numerals ONLY, never a POSITION; the loop does not self-terminate while the sampler sweeps.
   **The few-Hz readout mirror MUST NOT drive the slider** (`K.md` cluster row — the named root).
3. **The motion-color authority collapsed to RED-DASHED (S3).** ONE motion-color authority — the
   red-dashed — suffused across every ball/track/ring; the final/settled state is the dashed
   outline everywhere (mirroring `AnimationVisualizer.vue:35`); `--color-progress` /
   `--color-slider-track` / `--ball-tone` repoint to the `--accent-red` family. The final-state
   register = the main-controls red with dashed outline (U-K17's explicit preference).
4. **The tabs → pills OR dock-dropdown items (S4).** The SpringSidebar view/artifact tabs move
   to `SegmentedTabs variant="pill"` (the 3.13.0 surface), OR merge into the dock-dropdown idiom;
   the `tab-trigger.css` serif-leak is decided against the W2 single display token (boundary).
5. **The readout panes re-cut (S5).** ONE readout surface (the `MetricStack`/`MetricCell`
   tier ladder), less information, a display-tier anchor for the primary datum — the inverted
   info (dense controls in the small pane, empty readout in the big pane) corrected (U-K13/K18).
6. **Single-option-select TOTALITY (S6).** The U4 rule applied by CONSTRUCTION across ALL panes:
   `ChromeDock`'s controls-tab select gates `> 1` with a static label `v-else`; the sweep
   confirms every other site (S2-S12) is already total; the vizs gain REAL options (the S1
   keyframes editor). **NOT a raised count threshold — the rule is the boundary.**
7. **The left-clip un-clipped + the control panes DRAGGABLE (S7).** The width-dependent left-clip
   cured; the two spring control panes gain a drag affordance (the library's own `drag`/`Draggable`
   — a kf primitive, dogfooded). U-K17's draggable half.
8. **The FourierField REMOVED from the hero (S8).** The 7 removal hunks; the vacancy left as
   HONEST blank grid (no fabricated replacement); the grid lines dialed less opaque — and the
   substrate-legibility gate RE-CHECKED, not just the eye (U-K20, the honest vacancy).
9. **The design-synthesis suffusion WITHIN PROPORTION (S9).** The pane-suffusion contract — a
   display-tier anchor, the red-dashed motion language, icon-hue accents over the green palette
   — applied bounded by `design-synthesis-k.md §6` (do NOT touch the hero/dock-glass/cube-card
   grammar/rainbow play). Proportion is the constraint, not a license to redesign the correct.

## §Scope

- **S1 — the spring made a PROPER keyframes EDITOR (the cube grammar; the read-only viewer
  RETIRED).** Locus: `demo/spring/SpringSidebar.vue` (the artifact fork) consuming the
  engine-owned `demo/@/components/custom/animation-controls/keyframes/KeyframesEditor.vue` (+
  its `KeyframeCard`/`composables`/`utils`). **Root-cause confirmation FIRST (born-RED
  discipline):** re-confirm LIVE on the BUILT dist that an edit typed into the spring's
  `@keyframes` block is OVERWRITTEN on the next slider/preset change (the
  `watch(generatedArtifact, css => artifactCss.value = css)` round-trip, `SpringSidebar.vue:238`)
  — proving it is a viewer, not an editor. THEN the cure: mount `KeyframesEditor` (the SAME
  surface the cube scene uses — `live-spring-sequence-mp-verdict.md §3`,
  `design-synthesis-k.md §1.3`) so the spring exposes EDITABLE keyframe rows (per-stop value,
  add/remove stop, two-way binding). The `@keyframes` output must either round-trip into the
  solver params, OR the editor is the PRIMARY authoring surface and the solver is a derived
  preset path — the design-decision (resolved below). **The `linear()`/`@keyframes`
  read-only artifact + its `CopyButton` are RETIRED** (no-legacy: the viewer dies WITH the
  editor's arrival; do NOT keep both). **WHY (transposition for elegance):** the engine
  ALREADY OWNS a real keyframes editor; the spring hand-rolled a sparse 5-stop read-only
  preview beside it (`live-spring-sequence-mp-verdict.md §3`) — the gestalt move is to
  consume the one authoritative surface, not maintain a second worse one. **NO workaround:**
  NOT a wider artifact viewer with an "edit" button that still overwrites; NOT a Monaco
  free-text field with no per-stop model — the EDITOR is the engine's keyframe-row grammar.

- **S2 — the stepping slider cured at ROOT (the 60 Hz painter drives the position; the 6 Hz
  throttle stays on the TEXT only; the loop does not self-terminate mid-sweep).** Locus:
  `demo/spring/useSpringHotPath.ts` (the readout cadence) + `demo/spring/useSpringDemo.ts`
  (the `contractAnim.t` mirror + the loop-termination guard). **Root-cause confirmation FIRST
  (born-RED):** re-measure LIVE — the `.readout-accent` / sampler `style.left` quantizing to
  ~6 Hz (the `[25,176,…,518] ms` intervals, 24 distinct values over 120 frames,
  `live-spring-sequence-mp-verdict.md §2a`) AND the bottom scrubber thumb FROZEN
  (`changeCount: 0` over 240 frames, `§2b`) — proving the few-Hz readout mirror drives the
  slider. THEN the cure, at the seam: **the scrubber position is driven by the CONTINUOUS 60
  Hz sampler-sweep truth (painter-style), NOT the 6 Hz `progress`/`contractAnim.t` mirror.**
  Either the sampler-sweep position drives the scrubber thumb directly off the hot path
  (`repaintSprings` at `useSpringHotPath.ts:93` writes the thumb the same frame it writes the
  ball), OR `progress`/`contractAnim.t` update EVERY frame while the sweep runs (the
  `PROGRESS_READOUT_HZ = 6` throttle is retained for the TEXT NUMERALS ONLY — `x`/`v`/`settled`
  badges, where a few-Hz cadence is correct for legibility, `live-spring-sequence-mp-verdict.md
  §2`). Plus: the rAF loop must NOT self-terminate while the sampler ping-pong is still
  sweeping (`useSpringDemo.ts:166-168` — the loop dies on `status !== "playing"`; the sampler
  is continuous even when the live spring settles, so the termination guard must key on the
  SWEEP, not only the machine status). **The cold-status root (`status: undefined` on a cold
  machine) is W0's seam (`live-session-gap-analysis.md F1`, `K.md §cold-entry cluster`) — this
  wave's S2 cures the POSITION-vs-readout mirror; it does NOT re-implement the cold-path play
  fix (BINDING boundary, below).** **WHY (the named root):** a few-Hz readout cadence is
  CORRECT for a text numeral (a human cannot read a number changing 60×/s) and WRONG for a
  position (the eye sees a 6 Hz thumb step). The cure separates the two channels — the
  position rides the 60 Hz painter, the text rides the 6 Hz throttle. **NO workaround:** NOT
  raising `PROGRESS_READOUT_HZ` to 60 (that would un-throttle the text — a re-paint storm on
  the badges, the very thing the throttle exists to prevent); NOT a CSS transition smoothing
  the stepped value (a band-aid masking the 6 Hz writes — the position must be born-continuous).

  > **The W0 boundary (BINDING):** the spring/sequence COLD-FREEZE (the loop self-terminates +
  > re-arms on a cold machine whose `status` is `undefined`, `live-spring-sequence-mp-verdict.md
  > §2b/§7`) is the SAME `status`-restore class as the hero-CTA P0 — **W0 owns the cold-path
  > play fix at the ADAPTER seam (`scenePlaybackAdapters.ts`, the resume-made-total,
  > `live-session-gap-analysis.md F1`); K.W4's S2 owns ONLY the 60 Hz-position-vs-6 Hz-readout
  > mirror.** Disjoint seams: W0 at the machine/adapter restore; K.W4 at the hot-path/reactive
  > mirror. If the IMPL finds the loop-termination guard (`useSpringDemo.ts:166-168`) is the same
  > edit as W0's cold-status restore, W0's fix lands FIRST (it is the P0) and K.W4 verifies the
  > slider is smooth ON the W0-honest engine. The cold-entry oracle this wave verifies its
  > re-cut panes through is W0's `proof:cold-entry` — never the idle bob (the engine-write
  > disambiguation rule, `K.md` inv).

- **S3 — the motion-color authority collapsed to RED-DASHED (the token-collapse; the
  spatial-color analog of the W2 display-token collapse).** Locus: `demo/@/styles/style.css`
  (`--color-progress`/`--color-slider-track`, `:275-296`) + `demo/@/styles/design-idioms.css`
  (`--ball-tone`, `:455-466`) + `demo/spring/SpringSidebar.vue:80` +
  `StartingStyleTarget.vue:74` (the preset-cell rings) + `PlaybackRibbon.vue:156`
  (`.timeline-green` scrub track). **Root-cause confirmation FIRST (born-RED):** re-confirm
  LIVE — the cube playback ribbon carries the RED ball (`AnimationVisualizer.vue:21`) ON a
  GREEN track (`.timeline-green`, `PlaybackRibbon.vue:156`) — TWO motion-color languages in
  ONE widget (`design-synthesis-k.md §3`). THEN the cure: **ONE motion-color authority — the
  red-dashed.** Repoint `--color-progress` / `--color-slider-track` / `--ball-tone` to the
  `--accent-red` family; make the SETTLED/FINAL state the dashed-outline treatment EVERYWHERE
  (mirroring `AnimationVisualizer.vue:35`'s `border-2 border-dashed border-accent-red/40
  bg-accent-red/15`). **The final-state register = the main-controls red with dashed outline
  (U-K17's explicit preference; the spring preset-cell active/final state at
  `SpringSidebar.vue:80` becomes red + dashed, not the solid green inset).** **WHY (the named
  root):** the demo has TWO motion-color identities (red-dashed for the visualizer,
  green-progress for sliders/balls/presets) — the user wants ONE, the red-dashed
  (`design-synthesis-k.md §3/§5`). This is a TOKEN-level collapse, not a per-pane patch —
  exactly the W2 lesson at the color axis. **NO workaround:** NOT a per-component
  `border-accent-red` class on each ball (that re-introduces the per-site hand-roll the
  abstraction-gap names, `design-synthesis-k.md §4.3` `MotionBall`); the ONE token authority is
  the seam. **The rainbow play CTA is PRESERVED VERBATIM** (`design-synthesis-k.md §5/§6` — the
  one sanctioned multi-color pop; do NOT flatten it to red).

- **S4 — the tabs → pills OR dock-dropdown items (U-K12).** Locus: the SpringSidebar
  `SegmentedTabs` (view switcher `:29-34`, artifact fork `:110-115`) +
  `demo/@/components/custom/animation-controls/controls/tab-trigger.css` (the serif-leak) +
  the in-panel `AnimationControls.vue:44-67` tab strip (standalone path). The user's preference:
  "pills if tabs at all, likely dock-dropdown items instead" (`live-dock-tabs-selects.md §1`).
  **The cure (the lane's Option A / Option B):** the in-app SpringSidebar tabs move to
  `SegmentedTabs variant="pill"` (the 3.13.0 surface — `live-glassui-currency.md §3.4`,
  `design-synthesis-k.md §4.1`: the new `segmented-tabs.css` liquid `--stretch` indicator) — a
  legible on-brand chip, NOT the near-invisible `variant="underline"` artifact fork that "reads
  as an unlabeled divider"; OR (the user-preferred Option B) the view/artifact fork merges into
  the dock-dropdown idiom (`DockSelectTrigger`). The `tab-trigger.css` serif-leak
  (`var(--font-serif)` at 1.125rem, `:28`) is decided against the W2 single display token (the
  boundary below — W4 does NOT re-author the font tokens; it CONSUMES W2's single authority and
  decides the tab register against it). **WHY:** the SegmentedTabs GRAMMAR is right; the
  COLOR/register is wrong (`design-synthesis-k.md §4.2`). **NO workaround:** NOT keeping
  `variant="underline"` (the near-invisible fork — the user calls it awful).

  > **The W2 boundary (BINDING):** W2 owns the SINGLE display-voice authority (the
  > `--font-serif` ≡ `--font-display` collapse to ONE token + the `tab-trigger.css` font
  > decision, `styling-typography-k.md §3/§9`). **K.W4 does NOT author the font tokens — it
  > CONSUMES W2's single display authority and decides the tab/pill REGISTER against it.** The
  > `tab-trigger.css:28` `var(--font-serif)` retype is W2's edit (the typography-root pass);
  > K.W4's S4 is the pill-vs-dropdown structural choice + the SegmentedTabs `variant`. If the
  > IMPL finds the two are the same file-touch, W2's font-token decision lands FIRST and K.W4's
  > S4 consumes it.

- **S5 — the readout panes re-cut for hierarchy with less information (U-K13/U-K18).** Locus:
  `demo/spring/SpringSidebar.vue` + `demo/spring/StartingStyleTarget.vue` (the SECOND pane) +
  `SpringTarget.vue` (the readout badges). **Root-cause confirmation FIRST (born-RED):**
  re-confirm LIVE — the spring scene mounts TWO left control panes
  (`live-spring-sequence-mp-verdict.md §4`: `SpringSidebar.vue` x=71 w=332 +
  `StartingStyleTarget.vue` bottom-left), the SAME four canonical presets shown THREE times
  (the SpringSidebar cells `:73-98`, the StartingStyle chips `StartingStyleTarget.vue:68-80`,
  both driving the SAME `response`/`dampingFraction`), and the info INVERTED (the dense editable
  controls in the cramped ~290px sidebar, the low-information readout in the large near-empty
  "SpringProgress" stage panel, `design-synthesis-k.md §1.3`). THEN the cure: **collapse the
  preset surface to ONE** (the StartingStyle pane demoted to a single tinted result card without
  its own preset row + redundant transport, `live-spring-sequence-mp-verdict.md §4`); the readout
  re-tiered with the 3.13.0 `MetricStack`/`MetricCell` (`design-synthesis-k.md §4.1`): a
  `MetricCell appearance="dashboard"` display-tier big-number for the PRIMARY datum (the missing
  audacious-type-in-the-pane), the secondaries demoted to `compact`/`bare`; the single-card
  `Card tier="quiet"` (`SpringSidebar.vue:22`) split into a loud header tier + a quiet body so
  the tiers do not collapse (`design-synthesis-k.md §4.2`). **WHY:** today both the primary and
  secondary readouts are the same small `MetricBadge` size (U-K18); the info is inverted. **NO
  workaround:** NOT shrinking the big empty panel (that leaves the inversion); the re-tier moves
  the display weight to the primary datum and collapses the triple-shown presets to one.

- **S6 — single-option-select TOTALITY (U-K16; the U4 rule by CONSTRUCTION).** Locus: the ONE
  VIOLATION `demo/@/components/custom/dock/ChromeDock.vue:200` (the controls-tab `<Select>`
  gated `v-if="hasControlPanel"` = `length > 0`) — change to `allControlTabs.value.length > 1`
  and render the single-tab label as STATIC TEXT in a `v-else` (mirroring
  `TransportDock.vue:92-95`'s single-animation pattern, `live-dock-tabs-selects.md §2.1/§5`).
  The sweep (`live-dock-tabs-selects.md §3`, S1-S12) confirms every OTHER select is already
  total (S2-S12 OK); **S9 (AssetPropertiesPanel, the playground "None"+1 borderline) is
  playground-ONLY — RECORD, NOT deployed-SPA scope (U-K19/U-K19-adjacent dispositioned per
  `K.md §pane verdicts cluster`: "U-K19 recorded playground-only").** **WHY (the rule is the
  boundary):** the U4 rule is documented as "total" (U-K16); a 1-item dropdown that opens onto
  the value the trigger already shows is dead chrome. **NO workaround (the named forbidding):**
  NOT raising the count threshold to paper a specific scene — the rule is `> 1 ⇒ select,
  else static label`, applied by construction. The "real options" half (U-K16) is met by S1
  (the keyframes editor gives the spring genuine authoring options, not a lone read-only view).

- **S7 — the left-clip un-clipped + the control panes DRAGGABLE (U-K17's second half).** Locus:
  the two spring control panes (`SpringSidebar.vue` + `StartingStyleTarget.vue`, statically
  positioned per `live-spring-sequence-mp-verdict.md §5`). **Root-cause confirmation FIRST
  (born-RED):** the lane found at 1440w the StartingStyle pane is NOT clipped (`clippedLeft:
  false`) — the clip "likely manifests at narrower widths or on the floating layout"
  (`live-spring-sequence-mp-verdict.md §5`); the IMPL must reproduce the clip at the witnessed
  narrow width before curing it (do NOT cure a clip that does not reproduce — measure first).
  THEN: (a) cure the width-dependent left-clip (the pane's left edge must remain on-screen
  across the responsive range — the W3 grid/anchoring tier is the home for the position math,
  boundary below); (b) the two control panes gain a DRAG affordance — **the library's own
  `drag`/`Draggable` primitive** (`src/animation/drag.ts`, a LIGHT named export — a kf primitive
  DOGFOODED, the gestalt move) — a drag handle on each control card. **WHY:** the draggable ask
  is simply unimplemented (`live-spring-sequence-mp-verdict.md §5/§7` — "the draggable ask is a
  missing affordance"); dogfooding the library's own `Draggable` is the idiomatic answer (the
  product animates with its own engine). **NO workaround:** NOT a free-floating
  `position:absolute` drag that escapes the grid (the pane must drag WITHIN the W3 work-area
  cluster, not into the dead gutter); NOT a third-party drag lib (the kf `Draggable` is the
  sanctioned primitive).

  > **The W3 boundary (BINDING):** W3 owns the grid/anchoring TIER — the macro `.controls-layout`
  > grid, the dock-anchor derivation (NO hardcoded offsets), the pathological-screen cluster
  > (`layout-grid-k.md §3/§4`, `design-synthesis-k.md §1.5`). **K.W4 does NOT re-author the
  > layout grid — it owns ONLY the spring-pane left-clip cure + the draggable affordance.** The
  > clip's POSITION math (where the pane sits in the responsive range) is W3's grid tier; K.W4's
  > S7 ensures the pane's left edge stays on-screen AND adds the drag handle. If the clip's root
  > is the macro grid track (the W3 `clamp()`/`minmax()` rail), W3 owns it; if it is a pane-local
  > overflow, K.W4 owns it. The IMPL partitions exactly: W3 = the grid track + dock anchors;
  > K.W4 = the spring control panes' clip + drag.

- **S8 — the FourierField REMOVED from the hero + the grid lines dialed less opaque (U-K20).**
  Locus: `demo/@/components/custom/editor-shell/EditorStartScreen.vue` (the 7 removal hunks,
  `live-fourier-grid.md §2.1`) + `demo/@/styles/design-idioms.css:182-183` (the grid tokens).
  **The removal (the 7 hunks):** delete the template `.fourier-vacancy` block (`:65-86`), the
  `FourierField` + `defaultBlobColorResolver` imports (`:96,97`), the
  `usePreferredReducedMotion` import (`:92`, sole use was the freeze guard), the `computed`
  import (`:91`, sole use was `prefersReducedMotion`), the RF-16 freeze-guard script
  (`:101-118`), the scoped `.fourier-vacancy` style (`:178-205`). **The vacancy is left as
  HONEST blank grid** — the lower-left quadrant is pure two-tier graph paper (`live-fourier-grid.md
  §3.1`); **NO fabricated replacement** (NOT a Constellation swap, NOT a `<GraphFrame>` — "the
  user's intent is clearance, not substitution", K20-E; `design-synthesis-k.md §1.1`: two
  math-backgrounds is one too many, the grid alone is the stronger quieter choice). The RF-16
  TDZ consumer-guard becomes moot (the AX-handoff record annotated, K20-B — a docs note in the
  same wave, NOT a glass-ui edit). **The grid opacity:** lower `--graph-opacity` (5% → ~3%) and
  `--graph-major-opacity` (12% → ~8%) at `design-idioms.css:182-183` (`live-fourier-grid.md §4.2`,
  `styling-typography-k.md §7`). **WHY:** the FourierField was J-ADDED (W7a S4/D18) and the user
  now rejects it (`prompt-recap-k.md §7`). **NO workaround (the substrate-legibility re-check —
  the named guard):** the 12% major opacity was DELIBERATELY raised above a former 0.10α
  near-invisible floor to satisfy a substrate-legibility gate (`§Hard-gate clause-g`,
  `styling-typography-k.md §7` caveat, `live-fourier-grid.md §4.1`) — lowering it re-approaches
  that floor; **S8 MUST re-check that gate, not just the user's eye** (the new opacity stays
  above the legibility floor the gate asserts).

- **S9 — the design-synthesis suffusion WITHIN PROPORTION (the pane-suffusion contract;
  bounded).** Locus: the panes re-cut in S1-S7. The pane-suffusion contract
  (`design-synthesis-k.md §2`): when a pane mounts it inherits (1) a display-voice anchor for
  its primary datum (S5's `MetricCell dashboard` — the W2 voice), (2) the red-dashed motion
  language for any progress/ball (S3), (3) icon-hue accents instead of the green palette (S3 +
  the icon-family taste anchor, `design-synthesis-k.md §5`), within PROPORTION. **The PROPORTION
  bound is the constraint (`design-synthesis-k.md §6` — what is already correct, do NOT
  "refine"):** the hero pane (only the FourierField removal + grid-opacity touch it), the dock
  GLASS chrome, the cube controls-card GRAMMAR, the rainbow play CTA (verbatim), the
  `.labeled-field-grid` subgrid idiom are CORRECT — S9 does NOT redesign them. **WHY:** the
  five suffusion axes all LIVE at the hero and DIE at the pane edge (`design-synthesis-k.md §2`);
  S9 propagates them inward — but the directive is "within a sense of proportion" (`K.md
  §MANDATE`), so the suffusion is bounded by §6. **NO workaround:** NOT a "more glass / more
  serif / more color" sweep over every surface (that violates proportion — the §6 correct
  surfaces stay); the contract applies to the panes being re-cut, not the whole app.

## §Hard gate (the proof:* that BITES — born-RED on the BUILT dist today, GREEN-on-fix · plus the TASTE review-packet USER-DOMAIN verdict)

**The two-part gate (the TASTE boundary, `K.md` inv):** the per-finding RUNTIME oracles carry
CORRECTNESS (the slider is smooth, the editor is two-way, the single-option select is gone, the
red-dashed token resolves, the FourierField is absent); **they do NOT carry the design VERDICT.**
**The wave's design band closes ONLY on the user's verdict on a review packet** (per-pane
before/after, desktop+mobile, the named deltas) — a named USER-DOMAIN step, scheduled BEFORE the
K close, never after. An agent's "designer-eye PASS" is corroboration, NEVER the verdict. The
runtime clauses ride W0's `proof:cold-entry` + the de-vacuoused B1 (the engine-write
disambiguation rule — every liveness assertion reads the engine's own write channel, never bare
`getComputedStyle` churn / the idle bob).

- **clause (a) — the spring scrubber position is CONTINUOUS, not 6-Hz-stepped (U-K15;
  CORRECTNESS).** On the BUILT dist, cold-enter the spring scene via W0's `proof:cold-entry`
  (the engine ON), sample the scrubber `.slider-thumb` bounding-x over a play window. Assert:
  the thumb advances with ≥1 distinct position per ~3 frames (continuous, NOT the ~6 Hz / 167 ms
  cadence) AND `changeCount > 0` (NOT the frozen `0` over 240 frames) — read off the engine's
  60 Hz painter, not the readout mirror. **BORN-RED WITNESS:** the thumb `changeCount: 0` over
  240 frames + the sampler 24 distinct values / max-dwell-54 over 120 frames on today's tree
  (`live-spring-sequence-mp-verdict.md §2a/§2b`). **BITE:** reds on the pre-cure tree (the 6 Hz
  `progress`/`contractAnim.t` mirror drives the thumb); greens on S2 (the 60 Hz painter drives
  the position). **NO escape:** NOT satisfied by a CSS transition smoothing the value (the
  oracle samples the rendered position per-frame; a transition lerping a stepped target still
  reads as ≤6 distinct target values under the hood — assert the SOURCE writes, the
  `--ball-p`/`contractAnim.t` per-frame delta, not just the painted pixel).
- **clause (b) — the spring keyframes editor is TWO-WAY (U-K11/U-K16; CORRECTNESS).** On the
  BUILT dist, type an edit into a keyframe stop, then assert it PERSISTS (is NOT overwritten on
  the next solver/preset interaction) AND the subject reflects the edited keyframe. **BORN-RED
  WITNESS:** on today's tree an edit is overwritten by `watch(generatedArtifact, css =>
  artifactCss.value = css, {immediate:true})` (`SpringSidebar.vue:238`) — the editor is
  read-only output. **BITE:** reds pre-cure (the edit vanishes on the next param change); greens
  on S1 (the `KeyframesEditor` two-way model). **NO escape:** assert the EDITED value drives the
  animation, not merely that a textarea accepts keystrokes.
- **clause (c) — single-option-select TOTALITY: NO 1-item dropdown renders anywhere in the
  deployed SPA (U-K16; CORRECTNESS).** On the BUILT dist, cold-enter EACH scene; for every
  `<Select>`/dropdown trigger, assert: if it opens to exactly ONE `SelectItem`, FAIL — a
  single-option site must render a static label instead. Specifically the S1 ChromeDock
  controls-tab select on easing + spring (today a 1-item dropdown, `live-dock-tabs-selects.md
  §2.1`) renders a static label. **BORN-RED WITNESS:** easing/spring render a 1-item
  controls-tab `<Select>` on today's tree (`ChromeDock.vue:101` gates `> 0`, not `> 1`).
  **BITE:** reds pre-cure (the 1-item dropdown is present); greens on S6 (the `> 1` guard +
  static label). **NO escape:** the assertion is by-construction across ALL deployed-SPA
  selects (the playground S9 site is OUT of scope — playground-only, RECORD).
- **clause (d) — ONE motion-color authority: the red-dashed token resolves, the green palette is
  GONE on the re-cut panes (U-K17; CORRECTNESS — token-level).** On the BUILT dist, read the
  computed style of the spring slider thumb + preset-cell active ring + the scrub track; assert
  `--color-progress`/`--color-slider-track`/`--ball-tone` resolve the `--accent-red` family
  (NOT `hsl(142 71% 45%)` green); assert the settled/final preset-cell state is a DASHED outline
  (mirroring `AnimationVisualizer.vue:35`), NOT the solid green inset
  (`SpringSidebar.vue:80`). **BORN-RED WITNESS:** today the spring thumb/ring/ball resolve the
  green `--color-progress` + the active state is a solid green inset
  (`live-spring-sequence-mp-verdict.md §5`, `design-synthesis-k.md §3`). **BITE:** reds pre-cure
  (green resolves); greens on S3 (the token repoint). **NO escape:** assert the TOKEN authority
  resolves red (not a per-component `border-accent-red` class — the abstraction-gap forbidding,
  `design-synthesis-k.md §4.3`). **The rainbow play CTA is asserted UNCHANGED** (the gradient on
  the play glyph still resolves — S3 must not flatten the taste anchor, `design-synthesis-k.md
  §6`).
- **clause (e) — the FourierField is ABSENT from the hero; the grid stays above the legibility
  floor (U-K20; CORRECTNESS).** On the BUILT dist at ≥1024px, assert: NO `<FourierField>`
  canvas mounts in the hero (the `live-fourier-grid.md §1.2` `CANVAS_3s {found:true, …}` probe
  now reads `found:false`); the `@mkbabb/glass-ui/fourier-field` + `/color` symbols are
  tree-shaken from the index chunk (`live-fourier-grid.md §1.3`). AND the grid lines resolve the
  dialed opacity (`--graph-opacity ~3%` / `--graph-major-opacity ~8%`) while STILL satisfying
  the substrate-legibility gate (`§Hard-gate clause-g`, `styling-typography-k.md §7` — the new
  major opacity stays above the former 0.10α floor). **BORN-RED WITNESS:** today the
  FourierField actively draws (2197 non-zero-alpha pixels, `live-fourier-grid.md §1.2`); the
  grid is at 5%/12%. **BITE:** reds pre-cure (the canvas is present); greens on S8 (removed +
  dialed). **NO escape:** assert BOTH the absence AND the legibility-floor re-check — lowering
  opacity below the gate's floor reds the substrate-legibility gate (the named guard).
- **clause (f) — the spring control panes are DRAGGABLE + un-clipped (U-K17; CORRECTNESS).** On
  the BUILT dist at the witnessed narrow width, assert: the pane's left edge is on-screen (left
  ≥ 0 — NOT clipped); a synthetic pointer drag on the pane's handle TRANSLATES the pane (its
  bounding-box origin moves) and does NOT resize it (its width/height are invariant — the
  U-K19-class gesture-confusion guard, distinguishing drag from resize). **BORN-RED WITNESS:**
  today neither pane is draggable (no `Draggable`/handle, `live-spring-sequence-mp-verdict.md
  §5`); the clip is width-dependent (re-confirmed at the narrow width). **BITE:** reds pre-cure
  (drag is a no-op / the clip reproduces); greens on S7 (the `Draggable` affordance + the
  un-clip). **NO escape:** assert TRANSLATE-not-resize (the gesture is drag, not the U-K19
  resize-instead-of-drag defect).
- **clause (g) — THE TASTE review packet + the USER-DOMAIN verdict (the design band's ONLY
  close; NAMED USER-DOMAIN).** The close motion (rides K.W5's TASTE-boundary leg, generated AT
  this wave's close, `K.md §WAVE MAP`) produces a REVIEW PACKET: per-pane BEFORE/AFTER
  screenshots (the spring scene, the readout panes, the tab register, the hero with/without the
  FourierField, the final-state ring color), DESKTOP + MOBILE, with the named deltas (S1-S9).
  The packet is presented to the user (Mike Babb, `mike@babb.dev`) BEFORE the K close. **The
  design band of this wave closes ONLY on the user's recorded verdict on that packet** — PASS,
  or a named residual that re-opens the relevant S-clause. **This is NOT a runtime assertion —
  it is the TASTE boundary made explicit:** the runtime clauses (a)-(f) prove the panes are
  CORRECT (smooth slider, two-way editor, no dead chrome, red-dashed token, no FourierField,
  draggable); they CANNOT prove "looks good / refined" — that verdict is the user's, packaged,
  scheduled, and recorded. An agent's "designer-eye PASS" is corroboration, NEVER the verdict
  (the J taste-tension that produced agent-PASS-vs-user-"awful" is the precise failure this
  clause exists to prevent, `K.md §the TASTE boundary`).

**The §spine bar — MUST bite.** Clauses (a)-(f) are RUNTIME oracles over the BUILT dist, each
born-RED on a CONCRETE observed fact on today's tree (the thumb `changeCount:0`; the
overwrite-on-param-change editor; the easing/spring 1-item dropdown; the green
`--color-progress`; the 2197-pixel FourierField canvas; the non-draggable clipped panes) and
GREEN-on-fix — each reads the ENGINE'S OWN WRITE CHANNEL (the W0 disambiguation rule), never the
idle bob. Revert S1 → (b) reds; revert S2 → (a) reds; revert S3 → (d) reds; revert S6 → (c)
reds; revert S7 → (f) reds; revert S8 → (e) reds. **Clause (g) is the TASTE boundary — the
design band closes ONLY on the user's packet verdict** (NAMED USER-DOMAIN, scheduled BEFORE the
close). **Two-tier taxonomy:** clauses (a)-(f) are CORRECTNESS (device-independent — computed
style, DOM membership, per-frame source-write deltas, gesture geometry — they hard-gate);
clause (g) is the USER-DOMAIN verdict (NEITHER a CI gate NOR an agent judgment — the user's, by
protocol). **P6 posture (declared):** clauses (a)-(f) are device-INDEPENDENT correctness gates
(computed CSS, DOM membership, source-write count, geometry containment) — they hard-gate on the
CI substrate via the W5 `proof:cold-entry`/`proof:subject-animates` extension; clause (g) is
USER-DOMAIN (out of CI by construction — taste is not device-measurable). **The born-RED
witnesses are CONCRETE:** every (a)-(f) clause names an observed fact on the BUILT dist at K
author-time; the gate is RED on those facts BEFORE the cure and GREEN after.

## §No-workaround prohibitions (BINDING — the mandate's named forbiddings for this wave)

- **NO few-Hz readout mirror driving the slider.** The cure (S2) is the CONTINUOUS 60 Hz
  sampler-painter driving the scrubber position; the 6 Hz `PROGRESS_READOUT_HZ` throttle stays
  on the TEXT numerals ONLY. NOT raising `PROGRESS_READOUT_HZ` to 60 (a re-paint storm on the
  badges — the throttle exists for the text legibility), NOT a CSS transition smoothing the
  stepped value (a band-aid masking the 6 Hz source writes — the position must be born-continuous,
  `live-spring-sequence-mp-verdict.md §2`). This is `K.md`'s named root: "the stepping slider
  cured at its root (the few-Hz readout mirror must not drive the slider)".
- **NO read-only artifact passed off as an editor.** S1 mounts the engine-owned
  `KeyframesEditor` (the cube grammar — two-way, per-stop, add/remove). NOT a wider
  `CSSCodeEditor` with an "edit" button that still overwrites on the next param change; NOT a
  free-text Monaco field with no per-stop model. The read-only `linear()`/`@keyframes` viewer is
  RETIRED (no-legacy — it does not survive beside the editor).
- **NO per-pane green patch.** S3 is the ONE motion-color TOKEN collapse (`--color-progress` /
  `--color-slider-track` / `--ball-tone` → `--accent-red`). NOT a per-component
  `border-accent-red`/`bg-accent-red` class sprinkled on each ball/ring (that re-introduces the
  per-site hand-roll the abstraction-gap names, `design-synthesis-k.md §4.3`). ONE token
  authority — the spatial-color analog of the W2 display-token collapse.
- **NO raised single-option count threshold.** S6 is the U4 rule by CONSTRUCTION (`> 1 ⇒
  select, else static label`), applied across ALL deployed-SPA selects. NOT bumping a specific
  scene's threshold to paper its dropdown — the rule is the boundary (the K.md cluster forbidding:
  "single-option selects NEVER render").
- **NO fabricated hero replacement for the FourierField vacancy.** S8 leaves the vacancy as
  HONEST blank grid. NOT a Constellation swap (`live-glassui-currency.md §3.9` — available but
  NOT a drop-in; the user wants clearance), NOT a `<GraphFrame>` / static-SVG motif (booked
  W7b edge — OUT of K.W4 scope, `live-fourier-grid.md §3.2`). The grid alone is the math texture.
- **NO grid opacity below the legibility floor.** S8 dials the grid less opaque BUT re-checks the
  substrate-legibility gate (`§Hard-gate clause-g`) — the 12% major was raised above a former
  0.10α floor deliberately; the new opacity stays above that floor (`styling-typography-k.md §7`,
  `live-fourier-grid.md §4.1`). NOT lowering to the user's eye alone (the gate, not just the eye).
- **NO free-floating drag that escapes the work-area grid.** S7's `Draggable` panes drag WITHIN
  the W3 cluster, not into the dead gutter; the kf library's own `drag`/`Draggable` primitive is
  the sanctioned vehicle (dogfood), NOT a third-party lib.
- **NO agent "designer-eye PASS" substituting for the user verdict.** Clause (g) is the user's
  recorded verdict on the review packet — the design band closes ONLY there. An agent's taste
  assessment is corroboration, never the verdict (the J failure this clause exists to prevent).
- **NO suffusion beyond proportion.** S9 propagates the pane-suffusion contract bounded by
  `design-synthesis-k.md §6` (the hero/dock-glass/cube-card/rainbow-play/subgrid stay). NOT a
  "more glass/serif/color" sweep over the already-correct surfaces.

## §Folds (every consumed-lane fold row discharged, with its U-K id + evidence citation)

| Fold row | U-K id | Discharged by | Evidence |
|---|---|---|---|
| **F2** spring slider STEPS — readouts + scrubber thumb bound to the 6 Hz `PROGRESS_READOUT_HZ` mirror | **U-K15** | S2 (the 60 Hz painter drives the position; the 6 Hz throttle stays on the text) | `live-spring-sequence-mp-verdict.md §2a §FOLD F2` (`useSpringHotPath.ts:46,110,116`) |
| **F3** spring transport thumb FROZEN + loop self-terminates on cold machine | **U-K15** (position) | S2 (the position mirror) — the loop-termination guard keys on the SWEEP; the cold-`status` restore is W0's seam (BINDING boundary) | `live-spring-sequence-mp-verdict.md §2b §FOLD F3` (`useSpringDemo.ts:166-168,419`) |
| **F4** no real keyframes EDITOR — the artifact is read-only output (overwritten on every param change) | **U-K11/U-K16** | S1 (mount the engine-owned `KeyframesEditor`; retire the viewer) | `live-spring-sequence-mp-verdict.md §3 §FOLD F4` (`SpringSidebar.vue:216,230-238`); the editor present at `animation-controls/keyframes/` (verified) |
| **F5** two spring panes look awful + redundant (presets shown 3×; two readout regions) | **U-K13/U-K18** | S5 (collapse the preset surface to ONE; re-tier the readout with `MetricStack`/`MetricCell`) | `live-spring-sequence-mp-verdict.md §4 §FOLD F5` (`SpringSidebar.vue:73-98` + `StartingStyleTarget.vue:68-80`) |
| **F6** active/final state is solid GREEN ring, not preferred red-dashed | **U-K17** | S3 (the red-dashed token authority; the final state = dashed outline) | `live-spring-sequence-mp-verdict.md §5 §FOLD F6` (`SpringSidebar.vue:80`, `StartingStyleTarget.vue:74`) |
| **F7** control panes not draggable; left-clip width-dependent | **U-K17** | S7 (the kf `Draggable` affordance; the un-clip — the W3 grid boundary for the position math) | `live-spring-sequence-mp-verdict.md §5 §FOLD F7` (both panes statically positioned) |
| **F8** U-K19 (drag resizes container) NOT in spring/sequence/mp — zero `resize` | **U-K19** | RECORD/HANDOFF — OUT of K.W4 → **K.W6 §T5** (the playground-only `AssetViewport` disposition, RECORD/playground-scope; the drag-seam suppression gaps DL-K15 are K.W6 §T4); the clause-(f) translate-not-resize guard CITES it | `live-spring-sequence-mp-verdict.md §6 §FOLD F8` (zero `resize != none`; `useDragScrub.ts:112-147` clean) |
| **F9** sequence row labels cramped at 52px; sequence static (cold) until scrub | **U-K13** (labels) | S9 (the label legibility within the suffusion pass); the cold-freeze is W0's seam (BINDING) | `live-spring-sequence-mp-verdict.md §7 §FOLD F9` (`SequenceTarget.vue:283,363-366`) |
| **S1** ChromeDock controls-tab select renders 1-item dropdown for easing/spring (U4 not total) | **U-K16** | S6 (the `> 1` guard + static label; the totality sweep) | `live-dock-tabs-selects.md §2.1 §FOLD S1` (`ChromeDock.vue:200`/`:101`) |
| **AnimationControls tab strip serif at 1.125rem** (wrong register) | **U-K12** | S4 register decision — the FONT retype is W2's edit (BINDING boundary); S4 owns the pill/dropdown structure | `live-dock-tabs-selects.md §1 §FOLD` (`tab-trigger.css:26-29`) |
| **SpringSidebar SegmentedTabs `segmented`/`underline`** — user prefers pills/dropdown | **U-K12** | S4 (`variant="pill"` or dock-dropdown; the underline fork retired) | `live-dock-tabs-selects.md §FOLD` (`SpringSidebar.vue:29-34,110-115`) |
| **AssetPropertiesPanel single-option** (playground "None"+1) | (U-K16-adjacent) | RECORD — playground-only, NOT deployed-SPA scope | `live-dock-tabs-selects.md §2.9/§FOLD S9` (`AssetPropertiesPanel.vue:114`) |
| **K20-A** FourierField actively renders at hero; user wants it removed (7 hunks) | **U-K20** | S8 (the removal) | `live-fourier-grid.md §FOLD K20-A` (`EditorStartScreen.vue:65-86` + 6 more) |
| **K20-B** removal eliminates the RF-16 consumer freeze guard; the AX handoff record annotated | **U-K20** | S8 (the freeze-guard removal is moot once the component is gone; a docs note, NOT a glass-ui edit) | `live-fourier-grid.md §FOLD K20-B` (`glassui-AX-handoff.md:868-882`) |
| **K20-C** FourierField bundled in the main index chunk (~8 KB); removal yields a first-load win | **U-K20** | S8 (implicit — tree-shaken on rebuild; clause (e) asserts the symbols gone) | `live-fourier-grid.md §FOLD K20-C` (`dist/gh-pages/assets/index-*`) |
| **K20-D** grid fine/major opacity tune (5%/12% → 3%/8%) | **U-K20** | S8 (the token dial + the legibility-floor re-check) | `live-fourier-grid.md §FOLD K20-D` + `styling-typography-k.md §7` (`design-idioms.css:182-183`) |
| **K20-E** vacancy after removal = HONEST blank grid; no replacement designed | **U-K20** | S8 (the honest vacancy — no fabricated replacement) | `live-fourier-grid.md §FOLD K20-E` (design note, not a defect) |
| **§3 U-K17 design-synthesis** — TWO motion-color identities; the cube ribbon carries red ball ON green track | **U-K17** | S3 (the ONE red-dashed authority) | `design-synthesis-k.md §3 §FOLD` (`style.css:275-296`, `design-idioms.css:455-466`, `PlaybackRibbon.vue:156`) |
| **§1.3 U-K11/K13/K16 spring pane fails hierarchy** (flat quiet card, green-saturated, no display anchor, read-only editor, inverted info) | **U-K11/K13/K16** | S1+S3+S4+S5 (the editor + the red-dashed + the pills + the re-tier) | `design-synthesis-k.md §1.3 §FOLD` (`SpringSidebar.vue:22,118`, `SpringTarget.vue`) |
| **§2 suffusion DIES at the pane edge** (the pane-suffusion contract missing) | **U-K13/K18** | S9 (the pane-suffusion contract, within proportion) | `design-synthesis-k.md §2 §FOLD` (the missing pattern) |
| **U-K18 equal-weight readouts** (primary + secondary same-size MetricBadge) | **U-K18** | S5 (promote primary to `MetricCell dashboard`; demote secondaries) | `design-synthesis-k.md §FOLD U-K18` (`SpringTarget.vue:31-39`) |
| **§4.1 ADOPT** — `MetricCell`/`MetricStack`/`SegmentedTabs pill`/`Configurator` 3.13.0 primitives | (enabler) | S1/S4/S5 CONSUME them (presupposes W1's re-pin — BINDING) | `design-synthesis-k.md §4.1 §FOLD` (verified in the 3.13.0 tarball) |
| **§4.3 ABSTRACT** — the `MotionBall` primitive + the demo hand-rolls (glass-ui ROOT gaps) | (handoff) | OUT — glass-ui ROOT (born-RED handoff to the glass-ui repo, NOT a kf-side patch — inv-16) | `design-synthesis-k.md §4.3 §FOLD` (glass-ui repo) |

## §Hand-off / cross-wave boundaries (BINDING)

- **→ W0 (the cold-path engine, BINDING):** W0 owns the cold-path PLAY fix at the ADAPTER seam
  (`scenePlaybackAdapters.ts`, the resume-made-total) + the de-vacuoused B1 + `proof:cold-entry`
  (the engine-write disambiguation rule). **K.W4 owns ONLY the spring 60 Hz-position-vs-6 Hz-readout
  mirror (S2);** it does NOT re-implement the cold-`status` restore. The spring/sequence
  cold-freeze (`live-spring-sequence-mp-verdict.md §2b/§7`) is W0's seam; K.W4 verifies its re-cut
  panes THROUGH `proof:cold-entry` (the engine ON), never the idle bob. If the loop-termination
  guard is the same edit as W0's cold-status restore, W0 lands FIRST.
- **→ W1 (the glass-ui 3.13.0 re-pin, BINDING):** W1 owns the `~3.11.2 → ~3.13.0` re-pin + the
  `proof:deps-current` floor advance (`live-glassui-currency.md §5`). **K.W4 CONSUMES the 3.13.0
  primitives** (`MetricCell`/`MetricStack`/`SegmentedTabs variant="pill"`/`Configurator`/`DockRail`,
  `design-synthesis-k.md §4.1`, `live-glassui-currency.md §3`); K.W4 does NOT re-pin. The re-pin
  PRECEDES K.W4 (the longest serial path W0→W1→(W2∥W3)→W4, `K.md §WAVE MAP`).
- **→ W2 (the typographic root, BINDING):** W2 owns the SINGLE display-voice authority (the
  `--font-serif` ≡ `--font-display` collapse + the dock-band binding + the `tab-trigger.css` font
  retype, `styling-typography-k.md §3/§9`). **K.W4 CONSUMES W2's single display token** and
  decides the tab/pill REGISTER against it (S4); K.W4 does NOT author the font tokens. The
  `tab-trigger.css:28` `var(--font-serif)` retype is W2's edit; K.W4's S4 is the pill-vs-dropdown
  structural choice.
- **→ W3 (the layout transposition, BINDING):** W3 owns the grid/anchoring TIER (the macro
  `.controls-layout` grid, the dock-anchor derivation, the pathological-screen cluster,
  `layout-grid-k.md §3/§4`). **K.W4 owns ONLY the spring-pane left-clip cure + the draggable
  affordance (S7);** the clip's POSITION math is W3's grid tier. If the clip's root is the macro
  grid track, W3 owns it; if pane-local overflow, K.W4 owns it.
- **→ W5 (the gate-truth + the TASTE packet, BINDING):** W5 owns the `proof:cold-entry` /
  `proof:subject-animates`-extended-to-real-scenes / the single-option-select gate / the
  engine-write disambiguation — K.W4's runtime clauses (a)-(f) RIDE those W5 gates (they land as
  the surfaces they certify land, `K.md §WAVE MAP`: "the remaining gate-truth legs land as the
  surfaces they certify land"). **The TASTE-boundary review-packet generator (clause (g)) is
  W5's instrumented protocol (the packet generator rides the W3-lib capture harness, `K.md
  §gate-truth cluster`), GENERATED AT K.W4's close.** K.W4 DECLARES the packet contents (the
  per-pane before/after, the named deltas S1-S9); W5 builds the generator; the user gives the
  verdict.
- **→ WZ (the close, BINDING):** the TASTE review packets are PRESENTED + the user verdict
  RECORDED at the WZ close (`K.md` WZ row: "the TASTE review packets presented + the user verdict
  recorded … BEFORE the version cut"). K.W4's design band closes ONLY on that verdict (clause (g));
  the version cut (the design band may justify a minor, `K.md` WZ row) follows the verdict.
- **OUT / sibling (do NOT touch):** U-K19 (drag-resizes-container) → **K.W6 §T5** (the
  playground-only `AssetViewport` RECORD/playground-scope disposition; the W2-noted drag-seam
  suppression gaps DL-K15 are K.W6 §T4 — NOT spring/sequence/mp, `live-spring-sequence-mp-verdict.md §6`); the
  AssetPropertiesPanel single-option → RECORD (playground-only); the `MotionBall`/`--dock-label-font`/
  `paper-backdrop` ABSTRACT gaps → glass-ui ROOT (born-RED handoff, inv-16 — NEVER a kf-side
  patch, `design-synthesis-k.md §4.3`); the version cut + publish → WZ (USER-DOMAIN, Mike Babb);
  the `KeyframesEditor` itself (it EXISTS — K.W4 MOUNTS it, does not re-author the engine surface).

## §Design decisions (trade-offs RESOLVED)

- **The spring authoring surface is the ENGINE'S `KeyframesEditor`, NOT a second hand-roll —
  RESOLVED.** The engine owns a real keyframes editor (the cube grammar); the spring built a
  sparse 5-stop read-only viewer beside it (`live-spring-sequence-mp-verdict.md §3`). S1 mounts
  the ONE authoritative surface (transposition for elegance/simplicity); the viewer is retired
  (no-legacy). **The keyframes editor is the PRIMARY authoring path; the solver presets are a
  derived convenience** (the editor round-trips the `@keyframes` into the displacement, or the
  presets seed the editor's stops — the IMPL picks the cleaner direction, but the editor is
  authoritative, not a mirror).
- **The slider position rides the 60 Hz painter; the text rides the 6 Hz throttle — RESOLVED.**
  A few-Hz cadence is correct for a TEXT numeral (legibility) and wrong for a POSITION (the eye
  sees the step). S2 separates the channels: the sampler-sweep 60 Hz truth drives the scrubber
  thumb (painter-style), `PROGRESS_READOUT_HZ = 6` is retained for `x`/`v`/`settled` text ONLY
  (`live-spring-sequence-mp-verdict.md §2`). NOT un-throttling the text (a re-paint storm).
- **ONE motion-color authority — the red-dashed — RESOLVED.** The demo has TWO motion-color
  identities (red-dashed visualizer, green-progress sliders/balls/presets); the user wants ONE,
  the red-dashed (`design-synthesis-k.md §3/§5`). S3 is the TOKEN collapse (the spatial-color
  analog of W2's display collapse), NOT a per-pane patch. The final/settled state is the dashed
  outline everywhere. The rainbow play CTA is PRESERVED (the one sanctioned multi-color pop).
- **The tabs become PILLS in-app (Option A) with dock-dropdown reserved where the dock manages
  the tab — RESOLVED.** The user's preference is "pills if tabs at all, likely dock-dropdown
  items instead" (`live-dock-tabs-selects.md §1`). In the main app the dock ALREADY manages the
  tab selection (the in-panel strip is hidden when `tabsExternallyManaged`, §1.2); the
  SpringSidebar view/artifact forks become `variant="pill"` (legible chips, the 3.13.0 surface),
  NOT the near-invisible `underline`. The font register is W2's single display token (boundary).
- **ONE readout surface, less information, a display-tier anchor — RESOLVED.** The two panes +
  triple-shown presets collapse to ONE preset surface + ONE re-tiered readout (`MetricStack`/
  `MetricCell dashboard` for the primary, `compact`/`bare` secondaries,
  `design-synthesis-k.md §4.1`); the StartingStyle pane is demoted to a single tinted result
  card. The info inversion (dense controls in the small pane) is corrected.
- **Single-option-select totality is the RULE by construction, NOT a per-scene threshold —
  RESOLVED.** `> 1 ⇒ select, else static label`, across ALL deployed-SPA selects (the sweep
  confirms S1 is the only violation; S2-S12 already total; S9 playground-only RECORD). The
  "real options" half is met by S1.
- **The FourierField vacancy is HONEST blank grid — RESOLVED.** The user wants clearance, not
  substitution (`live-fourier-grid.md §3.1`, K20-E); two math-backgrounds is one too many
  (`design-synthesis-k.md §1.1`). NO Constellation swap, NO `<GraphFrame>` (the W7b edge is OUT).
  The grid opacity dials less opaque BUT re-checks the substrate-legibility gate (not the eye
  alone).
- **The control panes drag via the kf `Draggable` primitive (dogfood), WITHIN the W3 grid —
  RESOLVED.** The library animates with its own engine; the `drag`/`Draggable` LIGHT export is
  the sanctioned vehicle (NOT a third-party lib). The panes drag within the work-area cluster,
  not into the dead gutter (the W3 boundary).
- **The design band closes ONLY on the user's review-packet verdict — RESOLVED (the TASTE
  boundary).** The runtime clauses (a)-(f) carry CORRECTNESS; the design VERDICT is the user's,
  on a packaged per-pane before/after packet, desktop+mobile, scheduled BEFORE the close. An
  agent's "designer-eye PASS" is corroboration, never the verdict — the J taste-tension
  (agent-PASS vs user-"awful") is the failure this resolves (`K.md §the TASTE boundary`).
- **Suffusion is bounded by PROPORTION — RESOLVED.** S9 propagates the pane-suffusion contract
  (display anchor, red-dashed motion, icon-hue accents) ONLY to the panes being re-cut; the
  already-correct surfaces (`design-synthesis-k.md §6` — hero, dock glass, cube card, rainbow
  play, subgrid) stay. "Within a sense of proportion" is the constraint (`K.md §MANDATE`), not a
  license to redesign the correct.
