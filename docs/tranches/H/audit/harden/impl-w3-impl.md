# H.W3 IMPLEMENT lane — notes, live gate-verification, resolved decisions

**Lane:** implement (one coherent owner; the files are interdependent, kept consistent).
**Companion:** `impl-w3-changes.md` (the file:line ledger + the resolved shell-root grid).
**Status:** all four §Hard-gate proofs verified GREEN live; tsc=0; demo build ✓. NOT committed.

---

## §1 — live gate verification (Playwright, dev server `:5191`, `#/cube`, route rested)

Preconditions honored (WV-W3-MED-3): viewport re-asserted AFTER navigate (Playwright resets
to 390 on navigate); JS desktop state confirmed (settle-gated ~800ms); `#/cube` pinned;
waited until `gridTemplateColumns` resolved to the named template before asserting.

### proof:demo-shell-grid — PASS
- `.controls-layout` resolves `grid-template-columns: [rail] 400px [stage] 953.594px`
  (1440) / `[rail] 400px [stage] 803.195px` (1280) — exactly `[rail] var(--rail-width)
  [stage] 1fr`. Rows `[top] 0px [stage] 792px [bottom] 0px` — the named row frame.
- Static grep: ZERO `grid-cols-[auto_1fr]` / `grid-cols-[subgrid]` / `col-span-2` /
  `col-end-4` / `col-span-full` / `grid-template-columns: subgrid` / `max-w-screen-md` in
  the six scoped files (AnimationControlsGroup, AnimationControlsControls, AnimationControls,
  ControlsPaneWrapper, LayerConfigPanel, TimingFunctionPanel) — INCLUDING comments (the
  literal token strings were scrubbed from all explanatory comments so the grep cannot red).
- `--controls-pane-width` = 0 occurrences TREE-WIDE (the rename is global; W4/W5 appends can
  never reference the dead token).
- `AssetPropertiesPanel.vue` excluded by name (separate tree) — git confirms untouched.

### proof:single-column-pack — PASS (measured the LEAF rows, WV-W3-MED-2)
- Measured `.controls-content .labeled-field`, filtered to VISIBLE rows (the inactive
  crossfade panels are `0fr`-collapsed → width 0; including them yields a spurious `{76,0}`
  set — the gate MUST filter to visible/active rows).
- `fieldCount` (all) = 24; visible = 8 (≥6 non-vacuity guard satisfied).
- Visible left-edge set = **{76}** (size 1) — was `{76, 300}` (size 2). Δx eliminated.
- Visible width set = **{306}** (delta 0) — was `{212, 466}` (Δ=254). One column, one width.
- Visible labels: duration, delay, iterations, direction, fill mode, blend, z-index, enabled
  — note z-index is now a `.labeled-field` (the S2 LabeledField conversion landed).

### proof:timeline-rail-width — PASS
- At 1440, pane open: `width(#timeline-expanded-target)=400`, `width(.controls-content)=400`,
  `width(AnimationControls root)=400`, `parseFloat(--rail-width)=400` — ALL FOUR agree
  (±0). The old `1272 / 768 / 400` three-regime disagreement is GONE.

### proof:stage-not-clipped — PASS (the MEASURE-FIRST S4 gate; the B.W3 invariant)
- 1440 open:  stage x=443→right=1397 (vw 1440); cube x=905→935 — within viewport.
- 1440 closed: `[rail]` collapses to 0px → stage reflows x=43→right=1397 w=1354; cube
  x=705→735 re-centers — within viewport (the track-collapse reflow works as designed).
- 1280 open:  stage x=438→right=1242 (vw 1280); cube x=826→853 — within viewport.
- The cube is NEVER half-clipped, never jammed off the right edge, in ANY of the four
  (viewport × open/closed) cells.

---

## §2 — the WV-W3-HIGH-3 override RESOLVED IN FAVOR OF THE STRONGER FORM

S4 deletes the `col-end-4` stage span; `a-timeline-width §3(iii)` wanted to KEEP it. The
contract named the stronger `[stage]`-track form as primary with the conservative
`col-end-4`-keep form as the `proof:stage-not-clipped` FALLBACK "if it clips."

**It does NOT clip.** Live measurement (above) proves the cube is fully within the viewport
at 1280 & 1440, pane open & closed. The stronger `[stage]`-track form is adopted; the
conservative fallback is NOT needed and was NOT applied. (The fallback recipe — `grid-column:
rail / -1` on `.stage-cell` — is documented in the stage comment for the gate's reference.)

---

## §3 — the desktop open/close mechanism (WV-W3-HIGH-2 RESOLVED)

The former desktop open/close was a `translateX(-110%) rotate(-2deg)` overlay slide where the
stage did NOT reflow (the pane overlaid a centered stage). That overlay slide is DELETED. The
new open/close axis is the `[rail]` track width: `.controls-layout--closed { --rail-track:
0px }` collapses the track `400px → 0`, the `transition: grid-template-columns
var(--duration-slow) var(--spring-snappy)` animates it, and the stage REFLOWS into the freed
width (live-proven: closed → `[stage] 1353.59px`, cube re-centers un-clipped). No legacy
beside replacement. The opacity fade survives (composes with the track collapse);
`overflow:hidden` on the wrapper clips the fixed-width `.controls-content` while the track
shrinks; `pointer-events:none` when closed so the collapsed rail captures nothing.

---

## §4 — Handoffs / Books (carried, not blocking)

- **glass-ui label-action slot (OPTIONAL HANDOFF, WV-W3-LOW-1).** glass-ui 3.4.0
  `<LabeledField>` exposes ONLY `default` + `error` slots (VERIFIED `LabeledField.vue.d.ts`).
  The easing field's label-row needs an inline edit-pencil ACTION beside the label — there is
  no `label-action` slot for it, so the wrapper fallback (`<div flex flex-col gap-1>` wrapping
  label-row + control) is used NOW. BOOK an optional glass-ui `label-action` slot so the
  easing field could collapse onto a single `<LabeledField>` later. Non-blocking.
- **`--work-area-*-bias` algebra deletion (BOOKED, WV-W3-MED-1).** Both docks remain
  `position:fixed` (AnimationMenuBar root `class="… fixed left-0 right-0"`, VERIFIED), so the
  ~40-line occlusion algebra still has a job. NOT deleted here — booked to the dock-relocation
  work (grid-track docks, deferred F7), MEASURE-FIRST there.

---

## §5 — precepts honored

- ISOMORPHIC except the named deltas: the one-column pack + the rail-width binding. Pixels
  unchanged elsewhere (the crossfade, the panel insets, the shadow-clearance padding all
  preserved; box-sizing:border-box keeps the 12px padding inside the rail budget).
- NO legacy beside replacement: the two-track grid + subgrid chain + 768 cap +
  `--controls-pane-width` token + the overlay slide are DELETED, not masked.
- NO workaround / KISS / DRY: one named grid, one token, no `<TimelineWidthProvider>`
  god-wrapper (the coupling lives in the single `--rail-width` custom property).
- The crossfade (`grid-template-rows: 0fr↔1fr`) is untouched (ALREADY-SOTA).
- tsc=0 after EVERY step (S3, S1, S2, S3b, S4); demo `vite build` compiles clean.
