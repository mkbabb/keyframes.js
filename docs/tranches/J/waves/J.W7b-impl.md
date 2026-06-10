# J.W7b — IMPL: set (ii) BOOK ledger + the boundary-oracle completeness record

**Branch:** `j-impl-w7b` (worktree `/Users/mkbabb/Programming/kf-j-w7b`, base `e9f2f8a` —
W0/W1/W2/W5/W6 merged). **Authority for every publish-state fact below:** the on-disk
`node_modules/@mkbabb/glass-ui` **3.9.0** (pin `package.json "~3.9.0"`, lockfile resolves
`registry.npmjs.org` 3.9.0). The sibling glass-ui checkout on disk is 3.10.1 and is **IGNORED**
per inv-16 (kf consumes PUBLISHED only). Date: 2026-06-10. NOT committed; no push.

This file is the wave note `J.W7b.md §S2` names: the **BOOK-with-target-version records** for the
consume-on-FUTURE-AX-publish band (NO kf deletion — the B7 vaporware lesson), the parity-clause
exit records for the S1 edges that could NOT land pixel-isomorphic, and the clause-(a)
completeness-oracle result over `glassui-AX-handoff.md`. The deduped per-item REFINE/ABSTRACT
register stays in the ledger doc (S3: REFERENCED, not duplicated).

---

## §A — set (i) landed index (consume + twin DELETED in one motion · clause (b) greps)

| Edge | Consumed (3.9.0) | Deleted (same motion) | Gone-grep |
|---|---|---|---|
| **S1b / ADOPT-5** | `ToggleChip variant="cell"` (`dist/toggle-chip.js`, reka `Toggle`, `aria-pressed`) — BOTH preset grids | `SpringSidebar.vue` Button-outline cells + `.preset-active` ring; `StartingStyleTarget.vue` `.preset-active` rule + cells | `grep -rn "preset-active" demo/` = **0** |
| **S1d / ADOPT-8** | `<Transition name="fade-slide">` (published, PRM-guarded — `transitions.css:23-37`) | `KeyframeTimeline.vue` the 4 `.kf-editor-{enter,leave}-*` scoped rules (the PRM-less near-copy) | `grep -rn "kf-editor" demo/` = **0** |
| **S1g / RF-12 / STY-1** | the published `.gold-shimmer` `@utility` (`utilities.css:356-365` + keyframe `animations.css:139`) painting through the demo-owned `--color-gold*` ramp | `design-idioms.css` the 27-line recipe + `@keyframes gold-shimmer-slide` (tombstone at `:296`); token ramp + dark bridge KEPT (consumer configuration) | `grep -n "@keyframes gold-shimmer-slide\|^\.gold-shimmer" design-idioms.css` = **0** |
| **STY-2** | — (hygiene) | `50vh → 50dvh` at the detail-panel host cap (`AnimationControlsControls.vue`) + the mirrored `TimingFunctionPanel.vue` cap | — |
| **STY-3** | — (hygiene) | the repeated `stroke-[var(--ppmycota-primary,var(--foreground))]` → named `@utility ppmycota-stroke` (`design-idioms.css`), `EasingSelect.vue` ×2 | — |
| **STY-4** | — (hygiene) | `.easing-edit-btn { color: var(--color-gold) }` scoped rule → the owned `.text-gold` idiom at the call site | — |
| **STY-5** | — (hygiene) | `EditorHeader.vue` raw `max-width: 500px` → `var(--header-items-max-w)` (token, same value) | — |
| **STY-6** | — (hygiene) | `tab-trigger.css` `transition: all` → enumerated `color, background, font-weight` | — |

Every set (i) edge is a SOURCE swap at visual parity (clause (c)): no baseline re-capture, no
appearance delta. The per-edge isomorphism probes are in the set (i) disposition report.

---

## §B — set (ii): the BOOK-with-target-version records (NO kf deletion · published-only)

**The target-version rule, applied.** Per `I.W6.md §Hard gate clause (c)` a handoff may target
only a PUBLISHED version — so every record's **target** is *the first PUBLISHED glass-ui release
shipping the named primitive (> 3.9.0), consumed in the SAME motion as the kf re-pin that brings
it on disk*; **no fabricated version number** is written anywhere. Each paired kf gate stays
GREEN-pending (never parked born-RED against vaporware); the kf interim survives BESIDE its
booked replacement ONLY because the replacement does not yet exist (the narrow no-legacy
suspension, `J.W7b.md §Goal`). On publish, each row migrates S2 → S1-shaped consume-to-delete.

### BOOK-1 — `SegmentedControl` connected-pill POSTURE (S2f-posture · ledger RF-5)
- **Absence proof (3.9.0):** `grep -rl "SegmentedControl" dist/` = **0**. (The BASE
  `SegmentedTabs variant="segmented"` IS published — `SegmentedTabs.vue.d.ts`,
  `SegmentedTabsVariant = "segmented"|"pill"|"underline"` — see §C-1: its consume exits W7b on
  the parity clause, NOT into this book.)
- **The ask:** a dedicated connected-pill `SegmentedControl` wrapper over `ToggleGroup` (sliding
  active-indicator track), or documenting `ToggleChip variant="chip"` as the segmented-member —
  the posture BEYOND the shipped `segmented` variant (`glassui-abstract.md B3`).
- **kf seam (interim survives):** `SpringScene.vue:8-26` hand-rolled tablist + `:211-236` scoped
  classes — un-deleted.
- **Gate:** `proof:segmented-control` (the future-wrapper half) — GREEN-pending on publish + re-pin.

### BOOK-2 — `ScrubberTimeline` `#overlay`/`#handle` slot + `inertia` prop (S2f-inertia · C5 · ledger AX-11)
- **Absence proof (3.9.0), re-verified at IMPL:** `ScrubberTimeline.vue.d.ts` props =
  `{ modelValue?: number; label?: string }` + `scrubStart`/`scrubEnd` emits ONLY — no slot
  surface, no momentum affordance; `grep -rl "inertia" dist/` = **0**.
- **The ask:** an optional decorative-handle/overlay slot + an `inertia` prop absorbing the
  `SmoothProgress`-velocity + `SpringProgress`-coast release behavior.
- **kf seam (interim survives):** `AnimationVisualizer.vue` — the 256-line decorative scrubber
  (pointer-capture, velocity estimate, release-coast, decorative ball) — un-deleted.
- **Gate:** `proof:scrubber-inertia` — GREEN-pending on publish + re-pin.

### BOOK-3 — `cartoon-surface` default `border-radius` (S2d · C1 · ledger RF-1)
- **Absence proof (3.9.0), re-verified at IMPL:** `dist/styles/cards.css` `@utility
  cartoon-surface` carries exactly `border-width: 2px`, `box-shadow`, `translate: 0`, the
  `transition` pair, and the `&:hover` lift — **NO `border-radius`** (the 6-lane DEDUPED item,
  "Verified STILL TRUE" holds on this worktree's node_modules).
- **The ask:** `border-radius: var(--radius-card)` on the utility, or a `cartoon-card` primitive.
- **kf seam (interim survives):** the `<Card>`-wrapper workaround (I4/I5) — un-deleted.
- **Gate:** `proof:card-rounded-primitive` (glass-ui half) — GREEN-pending on publish + re-pin.

### BOOK-4 — headless-typography `--font-stack-text` lever (S2e · C2 · ledger RF-2 · CONST-4)
- **Absence proof (3.9.0):** no typography opt-in mechanism in the published package (no
  CHANGELOG ships in the tarball; `constellation-edges.md §1c`/CONST-4 — "UNADDRESSED in the
  published release"); the `@theme inline` bridge still hard-wires Plus Jakarta.
- **The ask:** ONE documented opt-out token (or `<GlassProvider brand-fonts="off">`).
- **kf seam (interim survives):** `style.css:100-117` the four-token `:root` force-apply —
  un-deleted, held by `proof:demo-fonts` (GREEN via the workaround; re-points at the single lever
  on publish). Disposition per `constellation-edges.md §1c`: OUT (glass-ui-owned), workaround
  sufficient + gated — J does not revisit absent a pin bump.

### BOOK-5 — the status-badge `tone` + `auto-contrast` recipe (S2c · **the S1f fallback, ACTIVATED** · ledger AX-3 + RF-6)
- **The S1f CAVEAT probe (the consume-or-book decision, read from the published palette at impl
  time per `J.W7b.md §S1f`):**
  - `Badge` (`dist/components/ui/badge/index.d.ts`): `variant: "default" | "destructive" |
    "outline" | "secondary" | "success" | "warning" | "info"` — **no `tone`, no `auto-contrast`,
    no violet**.
  - `StatusDot` (`StatusDot.vue.d.ts`): `variant: "active" | "paused" | "idle" | "error"` + raw
    `color` string + `pulse`/`size`/`label` — the four LIFECYCLE variants on a **dot**, no
    AA-lifted pill text recipe, no `color-mix toward --foreground` lift.
  - `MetricBadge` (`MetricBadge.vue.d.ts`): `size`/`color`/`label`/`unit` — no tone variant.
  - **Verdict: the scene-semantic green/violet pair at AA contrast is NOT covered → S1f does NOT
    consume; the recipe is BOOKED, not deleted.**
- **kf seam (interim survives):** `design-idioms.css:411-456` — the 22-line
  `.status-badge`/`.settled-badge`/`.tracking-badge`/`.reverse-badge` AA-contrast recipe,
  consumed at `SpringTarget.vue:25-26` + `SequenceTarget.vue:32-33` — un-deleted.
- **The ask:** extend `Badge`/`StatusDot` with `tone` + `auto-contrast` baking the documented
  `color-mix toward --foreground 50%` AA lift, covering the scene-semantic green/violet pair.
- **Gate:** `proof:badge-tone-recipe` — GREEN-pending; greens on the published variant at
  computed contrast ≥ 4.5:1 + the four-class grep-zero.

### BOOK-6 — net-new `GlassControlPoint` + `useSvgPointer` (S2a · ledger AX-1 — the headline)
- **Absence proof (3.9.0):** `grep -rl "GlassControlPoint\|useSvgPointer\|CurveCanvas" dist/` =
  **0** — the one genuine net-new (no existing twin).
- **kf seams (interims survive):** `EasingCurveCanvas.vue` (373-line SVG curve editor) +
  `MotionPathTarget.vue:63-90` (`.mp-handle*` nodes) — the SAME handle grammar twice, un-deleted.
- **Gate:** `proof:control-point-primitive` — GREEN-pending on publish + re-pin.

### BOOK-7 — `GlassRail` + `GlassRailBall` (S2b · ledger AX-2)
- **Absence proof (3.9.0):** `grep -rl "GlassRail\|progress-ball" dist/` = **0**; the only
  `progress-rail` hit is `@utility glass-progress-rail` (`dist/styles/glass.css:785`) — the
  `<Progress>` track-fill, DISTINCT from the scrubber-ball idiom (the distinction the ledger
  AX-2 already records).
- **kf seam (interim survives):** `design-idioms.css:363-409` rail/ball pair (+ the legitimate
  per-scene `--ball-size`/`--ball-glow` modifiers, which STAY post-consume as consumer config).
- **Gate:** `proof:rail-ball-primitive` — GREEN-pending on publish + re-pin.

### BOOK-8 — the S2g REFINE/ABSTRACT tail (roll-up · pointer to the ledger rows)
Absence-probed where mechanical, all **0 hits** in 3.9.0 `dist/`: `CopyableArtifact` (AX-4),
`graph-paper` (AX-5), `PlayheadTrack` (AX-7), `float-idle` (AX-8), `SceneHeader`/`MetricHeader`
(AX-9), `rainbow-outlined` (AX-10), `LabeledField` `orientation` (RF-3 — grep over
`labeled-field/*.d.ts` = 0). The per-item asks, seams, and gates live in
`glassui-AX-handoff.md` §1/§2 (AX-4..10, AX-12/13, RF-3/4/7..11/13/14 + the tails) — REFERENCED,
not duplicated. No kf deletion for any row; each rides its future publish + re-pin.

---

## §C — the S1 edges that did NOT land in W7b (parity-clause exits — nothing silently narrowed)

Per `J.W7b.md §Goal`: *"if a consume cannot land at visual parity, it is a W7a delta, not a W7b
edge — and it moves out of this wave."* These primitives are PUBLISHED in 3.9.0, so they are
**NOT future-AX books** (booking them would misfile a parity question as a publish question);
their kf twins survive un-deleted and the swaps exit to the appearance-owning lane.

1. **S1a / ADOPT-7 — `SegmentedTabs variant="segmented"` (the spring pill).** Published ✓
   (`SegmentedTabs.vue.d.ts`). The primitive ships a spring-eased animated pill-slider indicator;
   the kf twin is the SP-7 instant state change ("no animated indicator … just changes
   color/background instantly"). The swap is appearance-bearing by construction → exits W7b.
   `J.W7a.md` does not currently name this swap (its D-table carries no spring-pill row) —
   **flagged for W7a/WZ routing**. Twin survives: `SpringScene.vue:8-26,211-236`.
2. **S1c / ADOPT-4 — `ScrubberTimeline` BASE (the PlaybackRibbon scrubber).** Published ✓. The
   ribbon's scrubber is a glass-ui `<Slider variant="timeline">` in MILLISECOND domain
   (`:max="animation.options.duration"`) themed by the scoped `.timeline-green` `--slider-*`
   tokens (`PlaybackRibbon.vue:10-18,156-163`); `ScrubberTimeline` is a normalized-0..1 component
   with its own chrome (caret tooltip, own track paint). Structurally non-isomorphic at the seam
   → appearance-bearing swap, exits W7b. Plumbing survives (the shared-drag seam from J.W2 is
   untouched). The C5 enrichment is **BOOK-2** regardless.
3. **S1e / ADOPT-1 + ADOPT-2 — `MetricBadge`/`AnimatedDigit` (the math readouts).** Published ✓.
   The swap IS the LOUDER readout — explicitly W7a's named appearance delta (`J.W7a.md D8`:
   "Live readouts → `MetricBadge size='xl'` + `AnimatedDigit` (published)"). Sites untouched by
   W7b: `EasingTarget.vue:24-26`, `SpringTarget.vue:20-21/:68`, `SequenceTarget.vue:15-16/:95-96`.
4. **S1f — `StatusDot`/`Badge` (the status chips).** CAVEAT resolved to **BOOK** — see §B BOOK-5.
   Twin survives: `design-idioms.css:411-456` + the two consuming sites.
5. **ADOPT-3 `FourierField` / ADOPT-9 `glass-wash` / ADOPT-6 `text-math`** — W7a-owned appearance
   consumes from the start (`J.W7a.md` D18 / D5 / the S4 typography motion); never W7b edges.
   Recorded so the ledger's §3 "land THIS tranche (J.W7b)" preamble reads honestly (annotated
   pointer-style in the ledger).

---

## §D — clause (a): the `glassui-AX-handoff.md` COMPLETENESS-oracle result

**Per-item completeness: PASS.** Every enumerated identity is dispositioned with (i) an evidence
anchor (design-lane § + `file:line`), (ii) the consuming kf seam, and (iii) a terminal tag
(consume-on-3.9.0 / consume-on-future-AX-publish / RECORD / VERIFY-ONLY / OUT-gated):
§1 ABSTRACT = AX-1..13 headlined + the 8 roll-up consume/fold rows; §2 REFINE = RF-1..15
headlined + the 9 enumerated tail rows + the RF-tail (`{types}`) section; §3 = ADOPT-1..9 each
with evidence + verified-shipped + seam. **No dispositionless row; no row missing an anchor; no
future edge parked born-RED against a version number** (every future gate is GREEN-pending per
§4's interim-vs-wait table; RF-13 docs-only and RF-15 RECORD-only disclose their no-gate status
explicitly, covered by §0's ASKS-vs-AWARENESS partition).

**Self-attestation counts: arithmetic verified, ONE aggregate softness flagged.**
- **ABSTRACT 21 = 13 + 8: EXACT** as enumerated. (Note: roll-up row 8, "the `rainbow-outlined`
  idle affordance (AX-10)", cites the headlined AX-10 itself — a same-identity dedup citation
  inside the 8; the arithmetic as written still totals 21.)
- **REFINE attested 25 vs 24 distinct enumerated identities** (15 RF rows + 9 tail rows, where
  the tail's `{types}` mention IS the RF-tail section, counted once). The attested 25 is
  reachable only by reading the tail's "dark-token gold/axis override **confirmations**"
  (`glassui-adopt.md D1`) as TWO RECORD rows (gold + axis), which the plural supports. Flagged as
  an aggregate-count softness ONLY — the per-item requirement of clause (a) is unaffected (every
  identity is dispositioned with anchor + seam), and per the doc's own §0: "the ledger is
  COMPLETE when every item is DISPOSITIONED," which holds.

**Anchor drift after set (i) (design-idioms.css edits): negligible, re-verified.** rail/ball
block still `:363-409` ✓; `.status-badge` section still starts `:411` ✓; `.code-token` `:465` ✓;
icon family `@utility` block now `:213-231` (cited 209-232 — comment-line drift only); RF-12's
cited `:292-318` recipe is now the DELETION tombstone beginning `:296` (annotated on RF-12).

**Reconciliations applied to the ledger (pointer-style only, no re-authoring):** §3 status block
(ADOPT-5/8 CONSUMED; ADOPT-1/2/3/6/9 ride W7a; ADOPT-4/7 parity-clause exits); AX-3 + RF-6 (the
S1f probe → BOOK-5); RF-12 (consume-half LANDED; residual ask narrowed to the stability
contract); RF-1, RF-2, AX-11 (absence re-verified at IMPL).

---

## §E — clause (c): parity posture

W7b re-captured NO baseline and owns NO appearance delta. Set (i) landed as measured SOURCE
swaps at parity (per-edge probes in the set (i) report); set (ii) landed ZERO kf pixels by
construction (book records + ledger annotations only). `proof:visual-lock` remains W7a's,
untouched here.
