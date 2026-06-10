# J.W7b — THE CONSUME-EDGE + glass-ui HANDOFF (the design directive's sibling-coordination half · inv-16 only · file-disjoint from W7a · NOT on J.W4's critical path · AX-gated · ZERO kf appearance delta)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-J (P2-shaped reuse,
  HIGH-honesty; this is the half of the design directive that DELETES kf code by routing it to
  a published glass-ui primitive, plus the cross-repo HANDOFF ledger. No crash, no kf
  appearance change — the visual-lock baseline is W7a's and W7b touches NO kf design delta.) ·
  **Scope (glass-ui consume-edge + the AX coordination ledger; NO kf-side glass-ui patch/fork,
  NO appearance re-skin):** the consume-to-delete edges where glass-ui 3.9.0 ALREADY ships the
  primitive (each kf-hand-rolled surface DELETED in the same motion the published primitive is
  consumed — `SpringScene.vue` tablist → `SegmentedTabs`, `SpringSidebar.vue` preset grid →
  `ToggleChip variant="cell"`, `PlaybackRibbon`/`AnimationVisualizer` scrub → `ScrubberTimeline`
  base, the `kf-editor` transition → `.fade-slide`, the per-frame-snap readouts → `metric-swap`/
  `AnimatedDigit`, the `status-badge` family + the math readouts → `StatusDot`/`MetricBadge`,
  `.gold-shimmer` → the glass-ui `@utility`), the STY-2..6 token-hygiene items, AND the
  `glassui-AX-handoff.md` companion ledger (the deduped 25 REFINE + 21 ABSTRACT corpus →
  the AX session). · **DAG-deps:** PARALLEL to the whole `W2→W7a` chain (`J.md §WAVE MAP` —
  "file-disjoint from W7a, gated only on AX PUBLISH, and runs PARALLEL to the W2→W7a chain — it
  is NOT on J.W4's critical path"). Each consume-on-3.9.0 edge depends only on the published
  3.9.0 pin already on disk (`package.json:173 ~3.9.0`, lockfile `3.9.0` — `constellation-edges.md §1a`);
  each consume-on-FUTURE-AX-publish edge depends on the named AX publish and lands NO kf
  deletion until it ships. Independent of J.W0–J.W6 except the shared `serveDist` harness.

## §Provenance (the folded findings + the boundary-ORACLE)

- **`glassui-adopt.md §(a)/(b)`** — the consumption map over glass-ui 3.9.0: kf "consumes
  glass-ui broadly and idiomatically already, so this is refinement, not rescue" (§Consumption
  baseline). The under-used surface: A1 `MetricBadge`/`MetricPill` for the five hand-rolled
  numeric readouts (`easing/EasingTarget.vue:24-26`, `spring/SpringTarget.vue:20-21`/`:68`,
  `sequence/SequenceTarget.vue:15-16`/`:95-96`); A2 `AnimatedDigit` + `.metric-swap` for the
  per-rAF-snap readouts (transitions.css:129-144, PRM-guarded :219); A3 `MetricBadge`/`StatusDot`
  for the SETTLED/READY/TRACKING chips (the 22-line `status-badge` AA-contrast recipe,
  design-idioms.css:435-456); A5 the `.fade-slide` transition class deleting the hand-rolled
  `kf-editor` copy (`KeyframeTimeline.vue:288-291`, "a near-exact copy of glass-ui's `.fade-slide`
  … delete lines 288-291 (4 rules) AND inherit the PRM guard the local copy lacks"); B1 the
  `.gold-shimmer` documented duplication (design-idioms.css:292-318 vs the glass-ui `@utility`).
- **`glassui-abstract.md §A/§B/§C`** — the abstraction-gap corpus over glass-ui 3.9.0: the
  headline is *"glass-ui 3.9.0 already ships `MetricBadge`, `MetricCell`, `ToggleChip`,
  `ScrubberTimeline`, `ContinuousRail`, `StatusDot`, `LabeledField` — and kf is hand-rolling
  local twins of several of them"* (`:7`). B1 `MetricBadge size="xl"` for the 3-scene stat
  readouts; B2 `ToggleChip variant="cell"` for the Spring preset grid (`SpringSidebar.vue:35-48`,
  `.preset-active` ring at `:145-148`); B3 the segmented `Live solver / Discrete transition`
  toggle (`SpringScene.vue:7-32`); B4 `ScrubberTimeline` for the PlaybackRibbon slider +
  AnimationVisualizer; A1 the **single genuine net-new** `CurveEditorCanvas`/control-point
  primitive (the one item with NO existing 3.9.0 twin); A3 the `.progress-rail`/`.progress-ball`
  promotion; A4 the `.status-badge` tone+AA-contrast recipe; A2 the `CopyableArtifact` chip;
  C1 cartoon-surface default radius (REFINE); C2 the headless-typography lever (REFINE); C5 the
  inertia-coast `ScrubberTimeline` enrichment (REFINE, paired with B4).
- **`styling-design-system.md` STY-1..6 (FOLD) / STY-7..10 (BOOK)** — the residual token-hygiene
  band: STY-1 the `.gold-shimmer` re-author (`design-idioms.css:292-317` vs
  `glass-ui/utilities.css:356-367`, "identical recipe"); STY-2 the `50vh→50dvh` literals
  (`AnimationControlsControls.vue:350`, `TimingFunctionPanel.vue:241`); STY-3 the
  `ppmycota-stroke` repeated arbitrary value (`EasingSelect.vue:14,50`); STY-4
  `.easing-edit-btn { color: var(--color-gold) }` bypassing `.text-gold`
  (`AnimationControlsControls.vue:366`); STY-5 the raw 500px cap (`EditorHeader.vue:89`); STY-6
  the over-broad `transition: all` (`tab-trigger.css:30`).
- **`constellation-edges.md §1`** — the glass-ui edge ground truth: the `~3.9.0` pin is "correct
  and protocol-clean" (§1a); the specular consume-edge is CLOSED (§1b, VERIFY-ONLY); the Plus
  Jakarta typography ASK is "OUT (glass-ui-owned)" with the kf `--font-stack-text` `:root`
  override held by `proof:demo-fonts` (§1c — the C2 future edge); the cartoon-radius (C1),
  `LabeledField orientation` (§1f), and `{types}` directional VT are all OUT/glass-ui-owned. The
  realm-split, the value.js next-slice, and the parse-that packrat are NON-W7b sibling HANDOFFs.
- **The boundary-ORACLE this wave answers (`J.md §invariant set`, the inv-16 row):** *"kf
  consumes glass-ui/value.js/parse-that PUBLISHED; every glass-ui item in the design fold is a
  HANDOFF to the AX session or a consume-edge of a published version, never a kf-side patch."*
  W7b is the inv-16 sibling-coordination half: it consumes what 3.9.0 ships (deleting the kf
  twin in one motion), BOOKS what only a future AX publish can ship (carrying NO kf deletion
  against vaporware — the B7 lesson, `I.W6.md §Hard gate clause (c)`), and routes the full
  REFINE/ABSTRACT corpus to one companion doc. **No kf APPEARANCE delta is owned here** — the
  consume-to-delete edges swap a hand-rolled surface for the published primitive at visual
  PARITY; any LOUDER/re-skinned reading (the `MetricBadge xl` rung, the `--ball-tone` hue, the
  segmented spring-indicator as a brand moment) is W7a's appearance delta, re-baselined by W7a's
  visual-lock motion — W7b changes the SOURCE (hand-rolled → primitive), W7a changes the LOOK.

## §The state, verified (file:line / node_modules anchors / live probes)

**The decisive partition fact — VERIFIED first-hand against the installed glass-ui 3.9.0**
(`node_modules/@mkbabb/glass-ui` version `3.9.0`, lockfile-resolved): the README sibling doc's
provisional read that the segmented POSTURE is a future-AX item (`glassui-abstract.md B3` — "the
existing primitives don't have that posture") is SUPERSEDED by the on-disk surface — `SegmentedTabs`
ships in 3.9.0 with a first-class `segmented` variant. The partition below is drawn from the
node_modules probe, not from the design-lane prose:

| Primitive | 3.9.0 on disk? | Anchor (verified) | Disposition |
|---|---|---|---|
| `SegmentedTabs` (`variant="segmented"`, default pill-slider; mobile-Select collapse; ToggleGroup multi) | **YES** | `dist/components/custom/tabs/SegmentedTabs.vue.d.ts` — `SegmentedTabsVariant = "segmented" \| "pill" \| "underline"`; `pane-spring.md SP-7` confirms | **S1 consume-on-3.9.0** |
| `ToggleChip` (`variant="cell"` — square icon+label card, reka Toggle `aria-pressed`) | **YES** | `dist/components/custom/toggle-chip/index.d.ts` — `toggleChipVariants … variant?: "cell" \| "chip"`; subpath `"./toggle-chip"` | **S1 consume-on-3.9.0** |
| `ScrubberTimeline` BASE (single-track 0..1, pointer-capture, `role=slider` keyboard, `scrubStart`/`scrubEnd`) | **YES** | `dist/components/custom/timeline/ScrubberTimeline.vue.d.ts` — `__VLS_Props={modelValue?:number,label?:string}`; via `<GlassTimeline variant="scrubber">` | **S1 consume-on-3.9.0** (base) |
| `MetricBadge` / `MetricCell` / `StatusDot` | **YES** | `dist/components/custom/{metric-badge,metric-cell,status-dot}/*.vue.d.ts`; subpaths `"./metric-badge"`,`"./status-dot"` | **S1 consume-on-3.9.0** |
| `.fade-slide` + `.metric-swap` `<Transition>` classes (PRM-guarded) | **YES** | `dist/styles/transitions.css:23-37` (`.fade-slide-*`), `:130-141` (`.metric-swap-*`), PRM guard `:201` | **S1 consume-on-3.9.0** |
| `.gold-shimmer` `@utility` (consuming `--color-gold*`) | **YES** | `dist/styles/utilities.css:356-365` (`.gold-shimmer` + `gold-shimmer-slide` ref); keyframe `animations.css:139` | **S1 consume-on-3.9.0** (STY-1) |
| `AnimatedDigit` (numeric crossfade/roll) | **YES** | `glassui-adopt.md A2` (transitions.css `.metric-swap-*` companion) | **S1 consume-on-3.9.0** (OPP, paired with `MetricBadge`) |
| `cartoon-surface` default `border-radius` | **NO** | `dist/styles/cards.css` `@utility cartoon-surface` — NO `border-radius` (grep = 0); `glassui-abstract.md C1` "Verified STILL TRUE in glass-ui 3.9.0" | **S2 consume-on-FUTURE (REFINE)** |
| `SegmentedControl`-as-connected-pill / inertia-coast `ScrubberTimeline` (C5) | **NO** | `ScrubberTimeline.vue.d.ts` has NO overlay slot / `inertia` prop; `glassui-abstract.md C5` | **S2 consume-on-FUTURE (REFINE)** |
| headless-typography / `--font-stack-text` opt-in lever (C2) | **NO** | `constellation-edges.md §1c` — "UNADDRESSED in the published release" | **S2 consume-on-FUTURE (REFINE)** |
| `CurveEditorCanvas`/`GlassControlPoint` 2D control-point primitive (A1) | **NO (net-new)** | `glassui-abstract.md A1` — "the *only* item … a genuine net-new glass-ui primitive (no existing twin)" | **S2 consume-on-FUTURE (ABSTRACT)** |

- **kf hand-rolled surfaces to DELETE (live anchors, verified):**
  - the spring view tablist: `demo/app/scenes/SpringScene.vue:8` (`spring-view-switch glass-resting
    cartoon-surface rounded-full`), `:9` `role="tablist"`, `:15-26` the two `spring-view-tab`/
    `spring-view-active` buttons, `:227-236` the three scoped classes (`pane-spring.md SP-7`:
    "no animated indicator … the spring-view-active class just changes color/background instantly").
  - the spring preset grid: `demo/spring/SpringSidebar.vue:39` (`variant="outline"`), `:42`
    (`'preset-active'`), `:145` the `.preset-active` ring (`glassui-abstract.md B2`: "no
    `aria-pressed` and re-authors the active ring").
  - the `kf-editor` transition: `demo/@/components/custom/animation-controls/timeline/KeyframeTimeline.vue:74`
    (`<Transition name="kf-editor">`) + `:288-291` (the 4 hand-rolled `.kf-editor-{enter,leave}-*`
    rules — a near-exact copy of `.fade-slide`, MISSING the PRM guard; `glassui-adopt.md A5`).
  - the `status-badge` family: `demo/@/styles/design-idioms.css:411-456` (the 22-line
    `.status-badge`/`.settled-badge`/`.tracking-badge`/`.reverse-badge` AA-contrast recipe),
    consumed at `demo/spring/SpringTarget.vue:25-26` + `demo/sequence/SequenceTarget.vue:32-33`.
  - the per-frame-snap math readouts: the five `text-mono-caption…tabular-nums` spans
    (`glassui-adopt.md A1` anchors) + the per-rAF hard-snap (`A2`).
  - `.gold-shimmer`: `demo/@/styles/design-idioms.css:292-311` (the recipe + `@keyframes
    gold-shimmer-slide`) — the demo keeps ONLY the `--color-gold*` token override (`:74` the gold
    RAMP) and the dark-mode bridge (`:150`).
- **The PlaybackRibbon / AnimationVisualizer scrub:** `glassui-abstract.md B4` — kf imports the
  glass-ui timeline family in ZERO files (verified); the PlaybackRibbon `<Slider variant="timeline">`
  re-implements the `ScrubberTimeline` 0..1 contract. The BASE consume lands on 3.9.0; the
  `AnimationVisualizer` decorative-ball + inertia-coast (256 lines) is the C5 REFINE — it stays kf-side
  until AX ships the overlay-slot + `inertia` prop (`glassui-abstract.md C5`).
- **The pin + the published-only premise:** `package.json:173 "@mkbabb/glass-ui": "~3.9.0"`;
  lockfile resolves `3.9.0` via `registry.npmjs.org`; no `file:`/`link:` (`constellation-edges.md
  §1a`, `proof:deps-current` clause 2 PASS). The tilde cap is load-bearing (the I.W6 deliberate
  3.6/3.7 skip). The `proof:deps-current` glass-ui floor advance `3.5.1 → 3.9.0` is **owned by
  J.W3** (`constellation-edges.md CONST-1`), not here — named so this wave does not silently
  narrow.
- **The companion doc:** `docs/tranches/J/glassui-AX-handoff.md` is ON DISK / AUTHORED (61 KB,
  the second half of this W7b DEV deliverable per `waves/README.md §3`); W7b's deliverable is BOTH
  this spec AND that ledger doc — the spec authors the consume-edge + the disposition rules; the
  ledger doc owns the deduped 46-item REFINE/ABSTRACT corpus + the per-item evidence anchor + the
  consuming kf seam.

## §Goal

**The DELIVERABLE (the consume-edge end-state):** every kf surface that hand-rolls a primitive
glass-ui 3.9.0 ALREADY ships is DELETED in the same motion the published primitive is consumed —
no legacy beside its replacement, the hand-rolled twin GONE the instant the consume lands. **The
HANDOFF end-state:** the full REFINE/ABSTRACT corpus (the 25 REFINE + 21 ABSTRACT design items,
headlined by the net-new `CurveEditorCanvas`/control-point primitive, the rail/ball pair, the
status-badge tone recipe, cartoon-surface radius, the headless-typography lever) is COMPLETE in
`glassui-AX-handoff.md` — every item dispositioned with its evidence anchor + the consuming kf
seam named — and kf consumes ONLY what AX PUBLISHES (inv-16): the future edges exit as a
BOOK-with-target-version against the FUTURE publish, NEVER parked born-RED against vaporware, and
carry NO kf deletion in J.

**ZERO kf appearance delta, ZERO baseline re-capture.** This is the inv-16 sibling-coordination
half — file-disjoint from W7a, off J.W4's critical path. The visual-lock baseline is W7a's; W7b
re-captures nothing. Every consume-to-delete edge is a SOURCE swap at visual PARITY (the rendered
pixels do not change because the consume lands) — and where a primitive WOULD change the look (the
`MetricBadge xl` rung reading LOUDER, the segmented spring-indicator animating, the `--ball-tone`
hue), that appearance delta is W7a's named isomorphic exception, re-baselined by W7a in W7a's
close motion. W7b owns the swap; W7a owns the look. The two are file-coordinated (both name the
same scene files) but disposition-disjoint: a W7b consume that lands BEFORE its W7a re-skin is
GREEN on the UNCHANGED visual-lock baseline; if a consume cannot land at visual parity, it is a
W7a delta, not a W7b edge — and it moves out of this wave.

**The honest exception to no-legacy — gated on PUBLISH.** The no-legacy precept (`J.md §MANDATE`:
"a replaced surface is replaced in ONE motion") binds the consume-on-3.9.0 set ABSOLUTELY: those
edges delete the kf twin THIS tranche. For the consume-on-FUTURE-AX-publish set, the kf surface
survives BESIDE its booked replacement ONLY because the replacement does not yet exist — the
honest, narrow suspension of no-legacy, gated on PUBLISH per inv-16's published-only rule (the
vaporware lesson — `I.W6.md §Hard gate clause (c)`: "a HANDOFF gate may only target a PUBLISHED
version, never a future version number"). Claiming the "one motion" deletion for the future set
would over-promise a landing that cannot occur until AX publishes.

## §Scope

- **S1 — CONSUME-TO-DELETE (the 3.9.0 edges — the published primitive consumed, the kf twin
  DELETED in ONE motion; no legacy beside its replacement).** Each edge names the kf-local
  CSS/markup it DELETES in the same motion the published 3.9.0 primitive is consumed. Every
  primitive below was VERIFIED present in `node_modules/@mkbabb/glass-ui` 3.9.0 (§The state) —
  anything that probed ABSENT moved to S2.

  | # | Consume (3.9.0 primitive · seam) | DELETE (kf hand-rolled surface, in the SAME motion) | Evidence anchor |
  |---|---|---|---|
  | **S1a — the spring pill** | `<SegmentedTabs variant="segmented" :options=[{value:'solver',label:'Live solver'},{value:'discrete',…}] v-model="demo.view.value">` (the spring-eased indicator + `role`/`aria-selected` from the primitive) | `SpringScene.vue:8-9,15-26` the hand-rolled `role="tablist"` + the two `spring-view-tab`/`spring-view-active` buttons + `:227-236` the three scoped classes | `glassui-abstract.md B3`, `pane-spring.md SP-7` (`SegmentedTabs.vue.d.ts`, `variant="segmented"` verified) |
  | **S1b — the preset grid** | `<ToggleChip variant="cell" v-model=…>` per preset (reka `aria-pressed` + keyboard toggle from the primitive) | `SpringSidebar.vue:39,42` the `<Button variant="outline">` cells + `:145` `.preset-active` ring | `glassui-abstract.md B2` (`ToggleChip … variant:"cell"` verified) |
  | **S1c — the scrubbers** | `<ScrubberTimeline>` / `<GlassTimeline variant="scrubber">` for the PlaybackRibbon slider (the 0..1 pointer-capture + `role=slider` keyboard + `scrubStart`/`scrubEnd` from the primitive) | the PlaybackRibbon `<Slider variant="timeline">` scrub/commit/touch-gate plumbing + the AnimationVisualizer's `progressFromPointerX`/`setBallProgress` scrub MATH (the decorative ball + inertia-coast STAY — that is the C5 REFINE, S2g) | `glassui-abstract.md B4` (`ScrubberTimeline.vue.d.ts` base contract verified) |
  | **S1d — the `.fade-slide` PRM transition** | `<Transition name="fade-slide">` (the published, PRM-guarded class) | `KeyframeTimeline.vue:74` rename `name="kf-editor"` → `name="fade-slide"`, DELETE `:288-291` the 4 `.kf-editor-{enter,leave}-*` rules (INHERIT the PRM guard the local copy lacks — `transitions.css:201`) | `glassui-adopt.md A5` (`.fade-slide-*` `transitions.css:23-37` verified) |
  | **S1e — the math readouts** | `<MetricBadge :amount :unit :label size>` (the `amount` slot through `AnimatedDigit` + the `.metric-swap` transition — retiring the per-rAF hard snap) | the five `text-mono-caption…tabular-nums` `toFixed` spans (`EasingTarget.vue:24-26`, `SpringTarget.vue:20-21`/`:68`, `SequenceTarget.vue:15-16`/`:95-96`) | `glassui-adopt.md A1/A2` (`metric-badge`/`.metric-swap` verified) |
  | **S1f — the status chips** | `<StatusDot>`/`<MetricBadge>` (or `<Badge tone auto-contrast>`) for the SETTLED/READY/TRACKING pills — CAVEAT: verify the variant palette covers the scene-semantic green/violet tone pair before deleting | the 22-line `.status-badge`/`.settled-badge`/`.tracking-badge`/`.reverse-badge` AA-contrast recipe (`design-idioms.css:411-456`), consumed at `SpringTarget.vue:25-26` + `SequenceTarget.vue:32-33` | `glassui-adopt.md A3`/`B2`, `glassui-abstract.md A4` (`status-dot` verified; the tone-palette coverage is the S1f gate's CAVEAT) |
  | **S1g — gold-shimmer dedup (STY-1)** | `.gold-shimmer` the glass-ui `@utility` (`utilities.css:356-365`) consuming the demo's `--color-gold*` token override | `design-idioms.css:292-311` the 27-line recipe + `@keyframes gold-shimmer-slide` — KEEP ONLY the `--color-gold*` token override (`:74`) + the dark bridge (`:150`) | `styling-design-system.md STY-1`, `glassui-adopt.md B1` (`.gold-shimmer` `@utility` verified) |

  **The S1f CAVEAT (no silent narrowing — `glassui-adopt.md A3`):** the demo's status tones are
  SCENE-SEMANTIC (progress-green / reverse-violet) and carry a documented AA-contrast color-mix
  the bare token does not. S1f is "adopt the surface, keep the tone token" — the consume lands
  ONLY if `StatusDot`/`Badge` variants cover the green/violet pair at AA contrast; if they do
  NOT, S1f's tone recipe is the A4 ABSTRACT handoff (S2f) and the kf recipe survives BOOKED. The
  consume-or-book is decided by reading the published variant palette at impl time, not assumed.

  **The STY-2..6 token-hygiene items (FOLD, in the same publish-band motion — `styling-design-system.md`):**
  these are NOT glass-ui consume-edges but the residual kf-local token debt the styling lane
  folds beside S1; each is a one-locus correction labeled HYGIENE:
  - **STY-2:** `50vh → 50dvh` at `AnimationControlsControls.vue:350` + `TimingFunctionPanel.vue:241`
    (the honest fix per the lane — replace the host-cap literal, not the scoped override band-aid).
  - **STY-3:** the repeated `stroke-[var(--ppmycota-primary,var(--foreground))]` (`EasingSelect.vue:14,50`)
    → a named `@utility ppmycota-stroke`.
  - **STY-4:** `.easing-edit-btn { color: var(--color-gold) }` (`AnimationControlsControls.vue:366`)
    → the owned `.text-gold` idiom (`design-idioms.css:183`).
  - **STY-5:** `EditorHeader.vue:89` `max-width: 500px` → a token-backed cap (no magic pixel).
  - **STY-6:** `tab-trigger.css:30` `transition: all` → the enumerated `color, background,
    font-weight` (the over-broad transition narrowed).

- **S2 — the AX-PUBLISH-gated band (BOOK-with-target-version; NO kf deletion until it ships —
  the published-only rule, the B7 lesson).** Each edge names (i) its `glassui-AX-handoff.md` ask,
  (ii) the kf consume seam that activates ON publish, and (iii) the charter no-block rule. Every
  primitive below probed ABSENT in 3.9.0 (§The state) — so the kf surface survives BESIDE its
  booked replacement (the narrow no-legacy suspension), NEVER parked born-RED against the future
  version number.

  | # | The AX ask (`glassui-AX-handoff.md`) | The kf consume seam (activates ON publish) | Disposition |
  |---|---|---|---|
  | **S2a — net-new `CurveEditorCanvas`/`GlassControlPoint`** | A `GlassControlPoint` SVG-handle primitive + a `useSvgPointer` (`getScreenCTM().inverse()` + rubber-band clamp + touch hit-radius) + an optional `CurveCanvas` shell | `EasingCurveCanvas.vue` mounts `<GlassControlPoint>` for its two bezier handles; `MotionPathTarget.vue:63-90` for its anchor/control handles — ONE handle grammar | ABSTRACT (the one genuine net-new — `glassui-abstract.md A1`) |
  | **S2b — the rail/ball pair** | `GlassRail` + `GlassRailBall` (or `@utility progress-rail/progress-ball`) parameterized by `--rail-tint`/`--ball-glow`/`--ball-size` (verbatim adoption — kf already named the variance axes) | kf deletes `design-idioms.css:363-409` + imports the utilities; the per-scene `--ball-size`/`--ball-glow` modifiers stay (legitimate per-site deltas) | ABSTRACT (`glassui-abstract.md A3`, `pane-amiga.md`/`pane-sequence.md` rows) |
  | **S2c — the status-badge tone recipe** | extend `Badge`/`MetricBadge` with a `tone` + `auto-contrast` variant baking the `color-mix toward --foreground 50%` AA lift (the hue-survives-the-mix insight) | S1f's recipe lands here IF the 3.9.0 `StatusDot`/`Badge` palette does NOT cover green/violet at AA — then the kf recipe is BOOKED, not deleted, until the variant ships | ABSTRACT (`glassui-abstract.md A4`; the S1f fallback) |
  | **S2d — cartoon-surface default radius** | `@utility cartoon-surface` gains `border-radius: var(--radius-card)` (or a `cartoon-card` primitive) | the kf `<Card>`-wrapper workaround (I4/I5) retires; `proof:card-rounded-primitive`'s glass-ui half greens | REFINE (`glassui-abstract.md C1`, `pane-*.md` cartoon rows — verified ABSENT in 3.9.0) |
  | **S2e — headless-typography lever** | a documented single `--font-stack-text` opt-out token (or `<GlassProvider brand-fonts="off">`) decoupling `--font-stack-sans` from the `@theme inline` bridge | the kf four-token `:root` force-apply (`style.css:100-117`) collapses to one documented prop; `proof:demo-fonts` updates | REFINE (`glassui-abstract.md C2`, `constellation-edges.md §1c` — UNADDRESSED in 3.9.0) |
  | **S2f — segmented POSTURE / inertia `ScrubberTimeline`** | (only IF a connected-pill `SegmentedControl` posture is wanted BEYOND the 3.9.0 `segmented` variant) + the C5 `ScrubberTimeline` overlay slot + `inertia` prop (absorbing AnimationVisualizer's coast) | S1c's decorative ball + 256-line coast math moves into the primitive's slot + `inertia` flag | REFINE (`glassui-abstract.md C5`/B3 — the base segmented IS in 3.9.0, S1a; the INERTIA enrichment is future) |
  | **S2g — the remaining REFINE band** | `CopyableArtifact` (A2), `LabeledField orientation="horizontal"`+subgrid (C3), the `--spring-snappy` token-vocabulary docs (C4), `RibbonBar`/`ActionRibbon` tab-slots (C6), `FourierField`/grid-field background utilities (A4/ABS-1/ABS-2 icon-sizing), `text-math`/`cm-serif` (A6) | the per-item kf consume seams named in `glassui-AX-handoff.md` | REFINE/ABSTRACT (the corpus tail — `glassui-adopt.md`, `glassui-abstract.md`) |

  **The charter no-block rule (the published-only invariant — inv-16, the B7 lesson):** every
  S2 edge stays OPEN in the handoff ledger, consumed by a FUTURE re-pin, NEVER parked born-RED
  against vaporware. A born-RED gate against a future version number is un-dischargeable (it can
  only pass via an external publish nobody in this repo controls — `I.W6.md §Hard gate clause
  (c)`). The kf surface survives BESIDE its booked replacement (the narrow no-legacy suspension)
  ONLY because the replacement does not yet exist; the consume-leg + the kf deletion fire in the
  SAME motion as the FUTURE re-pin (a later tranche or a J re-pin), at which point the edge
  migrates from S2 to an S1-shaped consume-to-delete. No S2 edge holds the W7b ledger's GREEN
  hostage to an AX publish: the ledger is COMPLETE when every item is DISPOSITIONED (consume-now
  / book-on-publish), not when every item is consumed.

- **S3 — the companion-doc pointer (`glassui-AX-handoff.md` owns the deduped ledger — REFERENCE,
  do NOT duplicate).** Locus: `docs/tranches/J/glassui-AX-handoff.md` (the W7b companion
  deliverable, ON DISK / AUTHORED — `waves/README.md §3`). It owns the DEDUPED 25 REFINE + 21
  ABSTRACT corpus: each item carries (i) its evidence anchor (the design-lane § + the
  `design-idioms.css`/component `file:line`), (ii) the proposed glass-ui shape, (iii) the
  consuming kf seam that activates on publish, and (iv) its disposition (consume-on-3.9.0 / REFINE
  / ABSTRACT / net-new). The dedup is load-bearing — the same item recurs across lanes (the
  cartoon-radius REFINE appears in `pane-amiga.md:144`, `pane-easing.md:48`, `pane-sequence.md:52`,
  `pane-spring.md:94`, `pane-motion-path.md MP-GU1`, `glassui-abstract.md C1`; the rail/ball
  ABSTRACT in `pane-amiga.md:145`, `pane-motion-path.md MP-GU2`, `glassui-abstract.md A3`; the
  status-badge tone recipe in `pane-sequence.md:54`, `pane-spring.md:95`, `glassui-abstract.md A4`).
  **This spec REFERENCES that ledger; it does NOT duplicate it** — the W7b spec owns the
  consume-edge IMPL (the seam, the delete, the §Hard gate), the ledger doc owns the per-item
  REFINE/ABSTRACT register. The single de-dup'd 46-item ledger is the boundary-oracle's evidence
  base (the COMPLETE-ledger half of §Hard gate). The handoff is FILED to the AX session per
  `feedback_glass_ui_root_changes` (all glass-ui changes go in the glass-ui repo, never patched
  in the kf demo) — the ledger doc is the kf-side record of the ask, not a kf-side patch.

- **S4 — the inv-16 posture (all glass-ui work in the glass-ui repo via AX; kf consumes PUBLISHED;
  zero kf-side patches).** The permanent fence (`J.md §invariants`, the inv-16 row + the permanent
  engine rule): glass-ui is a SIBLING; every REFINE/ABSTRACT item is AX-owned, authored/merged/
  published in the glass-ui repo, consumed by kf only when PUBLISHED. kf authors NOTHING glass-ui-
  side here — it CONSUMES (S1, the 3.9.0 edges) and ASKS (S2/S3, the future edges). The REJECTED
  shape (a kf-side CSS neutraliser, a `:deep()` override that re-skins a published primitive, a
  forked twin kept beside the consume) is forbidden by `feedback_glass_ui_root_changes` + inv-16 —
  it masks the seam instead of consuming it. Where a published primitive's contract is INSUFFICIENT
  (the S1f tone palette, the C5 inertia slot), the answer is the AX ask (S2), NOT a kf-side patch
  on top of the primitive. The one legitimate kf-side residue is a per-SITE delta the primitive's
  API explicitly parameterizes (the `--ball-size`/`--ball-glow` modifiers, S2b; the scene-semantic
  tone token, S1f) — these are CONSUMER configuration, not a fork.

## §Hard gate (the BOUNDARY oracle that BITES — NOT a kf appearance gate · the handoff ledger COMPLETE + the consume-to-delete grep)

**The boundary oracle** (`J.md §J.W7b row`, `waves/README.md §J.W7b`): the `glassui-AX-handoff.md`
ledger is COMPLETE — every one of the 46 REFINE/ABSTRACT items dispositioned with its evidence
anchor + the consuming kf seam named — AND each consume-to-delete edge lands delete+consume in ONE
motion with the hand-rolled-surface-GONE grep as the labeled hygiene corroborator. **There is NO
kf appearance delta to re-baseline and NO born-RED kf-runtime witness shared with W7a** — this
half changes the SOURCE (hand-rolled → published primitive) at visual parity, not the LOOK.

- **clause (a) — the HANDOFF LEDGER is COMPLETE (the boundary oracle — CORRECTNESS-of-the-boundary).**
  Assert `docs/tranches/J/glassui-AX-handoff.md` carries EVERY one of the 46 REFINE/ABSTRACT items
  (25 REFINE + 21 ABSTRACT), each row DISPOSITIONED with (i) an evidence anchor (a design-lane § +
  a `file:line`), (ii) the consuming kf seam, and (iii) a terminal disposition tag
  (consume-on-3.9.0 / REFINE-on-FUTURE / ABSTRACT-on-FUTURE / net-new). **NO item un-dispositioned;
  NO item without an evidence anchor; NO future edge parked born-RED against a version number.**
  **BITE:** reds on a ledger missing an item, carrying a dispositionless row, or naming a future
  edge as a kf-deletion-this-tranche (the over-promise the B7 lesson forbids); greens when every
  item is dispositioned with its anchor + seam. The ledger is the boundary's proof-of-completeness —
  the publish-boundary analogue of `proof:published-surface`'s "every export taught-or-manifested."
- **clause (b) — each consume-to-delete edge lands delete+consume in ONE motion (the no-legacy
  oracle, SCOPED to the S1 3.9.0 set).** For each S1 edge (S1a–S1g), assert (i) the published
  3.9.0 primitive is consumed at the named seam (the import resolves; the component/utility renders)
  AND (ii) the kf hand-rolled twin is DELETED — **the hand-rolled-surface-GONE grep is the labeled
  HYGIENE corroborator:** `grep -rn "spring-view-switch\|spring-view-tab\|spring-view-active"
  demo/` = 0 (S1a), `grep -rn "preset-active" demo/` = 0 (S1b), `grep -rn "kf-editor" demo/@/**` =
  0 (S1d), `grep -rn "\.status-badge\|\.settled-badge\|\.tracking-badge\|\.reverse-badge"
  design-idioms.css` = 0 (S1f, IF S1f consumed), `grep -n "@keyframes gold-shimmer-slide\|^\.gold-shimmer"
  design-idioms.css` = 0 (S1g). **BITE:** reds the instant a consume lands WITHOUT its delete (the
  legacy twin surviving beside its replacement — the no-legacy violation) OR a delete lands without
  its consume (a dangling reference); greens when each edge is delete+consume atomic. **Labeled
  HYGIENE corroborator** — it proves the no-legacy motion mechanically; the CORRECTNESS-of-the-
  boundary axis is clause (a) (the ledger COMPLETE).
- **clause (c) — NO kf appearance delta, NO baseline change (the parity oracle — the W7b/W7a
  fence).** Assert `proof:visual-lock` (W7a's appearance-drift tripwire, re-baselined by W7a)
  stays GREEN across the W7b consume-edges on the W7a baseline — a W7b consume that lands at visual
  parity does NOT drift the baseline. **BITE:** reds if a W7b consume changes the rendered pixels
  beyond the W7a-named isomorphic exception (then it is a W7a delta misfiled in W7b — it moves to
  W7a, not re-baselined here); greens when every S1 consume is a SOURCE swap at parity. **W7b
  re-captures NO baseline** (`J.md §isomorphic styling`: "J.W7b … owns NO appearance delta and
  re-captures NO baseline; it is inv-16 sibling-coordination only") — the parity is asserted
  against W7a's baseline, not a fresh W7b capture.

**The §spine bar — the boundary oracle, NOT a runtime appearance witness.** The boundary this
wave certifies is the SIBLING-COORDINATION boundary: clause (a) — the COMPLETE handoff ledger
(every item dispositioned with anchor + seam, no vaporware born-RED) — is the boundary-of-record;
clause (b) — the delete+consume-in-one-motion grep — is the labeled HYGIENE corroborator proving
the no-legacy motion landed; clause (c) — `proof:visual-lock` UNCHANGED — is the fence proving W7b
changed the source, not the look. **No born-RED kf-runtime witness is shared with W7a** (`J.md
§J.W7b row`: "this half has no kf appearance delta to re-baseline"); the W7b oracle is the
ledger's completeness + the consume-to-delete grep, not a kf-appearance assertion. The
published-only rule (S2's no-block) is enforced by clause (a): a future edge parked born-RED
against a version number REDS clause (a), because that is not a disposition — it is a vaporware
IOU the B7 lesson retired.

- **The TWO-TIER TAXONOMY, applied to THIS wave's gate.** The **boundary CORRECTNESS oracle** is
  clause **(a) — the COMPLETE handoff ledger** (the boundary-of-record per `J.md`'s boundary-ORACLE
  extension). Clause **(b) — the hand-rolled-surface-GONE grep** is the labeled **HYGIENE
  corroborator** (it proves the no-legacy motion mechanically; it may NOT substitute for the
  ledger's completeness). Clause **(c) — `proof:visual-lock` unchanged** is the W7b/W7a fence
  (the parity assertion, not a kf-appearance correctness witness W7b owns — that is W7a's). **NO
  workaround:** the consume-edges close by consuming the PUBLISHED primitive and deleting the twin
  — NOT a kf-side `:deep()` re-skin, NOT a forked twin kept beside the consume, NOT a born-RED
  park against a future version (`J.md §MANDATE` + inv-16 + the B7 lesson).
- **`proof:visual-lock` is W7a's, re-affirmed-not-re-captured here** — W7b's clause (c) ASSERTS
  it stays green on W7a's baseline; W7b does NOT re-baseline (T3 — the `visual-lock` re-label is
  W7a's close motion, `waves/README.md §4 clause 3`). Recorded here so this wave does not strand
  a baseline re-capture it is forbidden to own.

## §Folds

- **The consume-to-delete band (the design directive's CONSUME-EDGE half — `J.md §J.W7b row`):**
  S1a SegmentedTabs (the spring pill — `glassui-abstract.md B3`, `pane-spring.md SP-7`); S1b
  ToggleChip `variant="cell"` (the preset grid — `glassui-abstract.md B2`); S1c ScrubberTimeline
  base (the hand-rolled scrubbers — `glassui-abstract.md B4`); S1d the `.fade-slide` PRM transition
  classes (the `kf-editor` copy — `glassui-adopt.md A5`); S1e MetricBadge/AnimatedDigit/metric-swap
  (the math readouts — `glassui-adopt.md A1/A2`); S1f StatusDot/Badge (the SETTLED/READY/TRACKING
  chips — `glassui-adopt.md A3`, with the green/violet-palette CAVEAT); S1g gold-shimmer dedup
  (STY-1 — `styling-design-system.md STY-1`, `glassui-adopt.md B1`); the STY-2..6 token items
  (`styling-design-system.md`). Each names the kf-local CSS/markup it DELETES in the same motion
  the published primitive is consumed (clause (b)).
- **The AX-PUBLISH-gated band (the REFINE/ABSTRACT corpus → `glassui-AX-handoff.md`):** S2a the
  net-new CurveEditorCanvas/control-point (`glassui-abstract.md A1`); S2b the rail/ball pair (A3);
  S2c the status-badge tone recipe (A4 / the S1f fallback); S2d cartoon-surface radius (C1 —
  "Verified STILL TRUE in glass-ui 3.9.0"); S2e the headless-typography lever (C2 /
  `constellation-edges.md §1c`); S2f the segmented posture / inertia ScrubberTimeline (B3/C5); S2g
  the REFINE tail (CopyableArtifact A2, LabeledField horizontal C3, the spring-token docs C4,
  RibbonBar slots C6, FourierField/grid-field/icon-sizing A4/ABS-1/ABS-2, text-math A6). Each stays
  OPEN in the ledger, consumed by a FUTURE re-pin, never parked born-RED (the charter no-block rule).
- **The OUT/sibling-HANDOFF reaffirmations (NOT W7b consume-edges — `constellation-edges.md §1f/§2/§3`):**
  the value.js next-slice (VJ-F1/MCI-5/VJ-F2/VJ-7 — value.js-owned, ride the re-pin), the parse-that
  packrat re-key (PT-1 — parse-that-owned), the `{types}` directional VT (GH-4/FB-4 — glass-ui-BOOK,
  folds only if J elects scene interactivity) — recorded as NOT-W7b so the ledger does not absorb
  sibling work outside the design corpus.
- **The specular consume-edge is CLOSED — RECORD, do not re-open** (`constellation-edges.md §1b`):
  the B7 sheen resolved two-sided at I.W6 (glass-ui published 3.9.0 default-off; kf bumped the pin;
  `proof:specular-absent-at-rest` GREEN; `proof:specular-handoff` DELETED). J disposition is
  VERIFY-ONLY (re-run on the J branch after any re-pin) — NOT a W7b consume-edge.
- **REJECTED (the workarounds):** (i) a kf-side `:deep()` re-skin of a published primitive (a fork
  by another name — `feedback_glass_ui_root_changes`); (ii) a forked twin kept BESIDE the consume
  (the no-legacy violation clause (b) reds on); (iii) a born-RED park against a future glass-ui
  version number (the un-dischargeable IOU the B7 lesson retired — `I.W6.md §Hard gate clause (c)`);
  (iv) claiming the "one motion" deletion for an S2 future edge (over-promising a landing that
  cannot occur until AX publishes — clause (a) reds on a future edge tagged as a this-tranche
  deletion).

## §Design decisions (trade-offs RESOLVED)

- **Partition by VERIFIED publish state, not by design-lane prose — RESOLVED.** The S1-vs-S2
  split is drawn from the `node_modules/@mkbabb/glass-ui` 3.9.0 probe (§The state), not from the
  audit lanes' provisional reads. The decisive correction: `SegmentedTabs` ships a `segmented`
  variant in 3.9.0 (`SegmentedTabs.vue.d.ts` verified), so the spring pill is a consume-on-3.9.0
  edge (S1a) — the `glassui-abstract.md B3` read ("the existing primitives don't have that
  posture") is SUPERSEDED by the on-disk surface; `pane-spring.md SP-7` is the corroborating lane.
  Anything that probed ABSENT (cartoon-radius, the inertia ScrubberTimeline overlay, the
  headless-typography lever, the net-new control-point primitive) moved to S2. The probe is the
  authority because the partition is a PUBLISH fact, and inv-16 turns on PUBLISH.
- **ZERO kf appearance delta — the W7b/W7a fence, RESOLVED.** W7b owns the SOURCE swap (hand-rolled
  → published primitive) at visual PARITY; W7a owns the LOOK (the LOUDER `MetricBadge xl` rung, the
  segmented spring-indicator as a brand moment, the `--ball-tone` hue). The two name the same scene
  files but are disposition-disjoint: clause (c) asserts `proof:visual-lock` UNCHANGED across the
  W7b consume-edges on W7a's baseline. A consume that CANNOT land at parity is a W7a delta, not a
  W7b edge — it moves out of this wave. W7b re-captures NO baseline (the re-capture is W7a's close
  motion — `J.md §isomorphic styling`).
- **The published-only rule, gated on PUBLISH — RESOLVED (the B7 lesson).** The consume-on-3.9.0
  set deletes its twin THIS tranche (no-legacy ABSOLUTE). The consume-on-FUTURE set carries NO kf
  deletion: the kf surface survives BESIDE its booked replacement ONLY because the replacement does
  not yet exist — the narrow, honest suspension of no-legacy, gated on PUBLISH. A born-RED park
  against a future version number is REJECTED (it can only pass via an external publish nobody in
  this repo controls — `I.W6.md §Hard gate clause (c)`). The ledger is COMPLETE when every item is
  DISPOSITIONED, not when every item is consumed — the boundary oracle (clause (a)) does not wait
  on AX.
- **The companion ledger REFERENCED, not duplicated — RESOLVED.** `glassui-AX-handoff.md` owns the
  deduped 46-item REFINE/ABSTRACT register (the per-item anchor + proposed shape + consuming seam +
  disposition); this spec owns the consume-edge IMPL (the seam, the delete, the §Hard gate). The
  dedup is load-bearing (the cartoon-radius REFINE recurs across six lanes; the rail/ball ABSTRACT
  across three) — one authoritative ledger, referenced by the spec, filed to AX. The handoff is the
  kf-side RECORD of the ask, never a kf-side patch (`feedback_glass_ui_root_changes`).
- **inv-16: consume PUBLISHED, ASK for the rest, patch NOTHING — RESOLVED.** All glass-ui work
  lands in the glass-ui repo via AX; kf consumes what 3.9.0 ships (S1) and asks for what it does
  not (S2/S3). The one legitimate kf-side residue is a per-site delta the primitive's API
  parameterizes (the `--ball-size`/`--ball-glow` modifiers, the scene-semantic tone token) —
  consumer configuration, not a fork. A `:deep()` re-skin or a forked twin is the REJECTED shape;
  where a contract is insufficient, the answer is the AX ask, not a kf patch on top.
