# Harden lane `hd-w3` — H.W3 (rail·stage·rail grid · one-column · ribbon-width)

**Charge:** DEEPER adversarial pass on H.W3. Does collapsing the 3-track grid to
`[rail] var(--rail-width) [stage] 1fr` actually solve D1+D4 without breaking the
Teleport timeline expansion, the `lg:max-w-screen-md` cap, and the responsive
breakpoints? Is `--rail-width` single-sourcing sidebar + expanded-timeline +
mobile-sheet feasible? Do the grep-gates over-constrain?

**Method:** read `waves/H.W3.md` + `H.md §H.W3` + the three folded lanes
(`a-controls-sidebar`, `a-timeline-width`, `a-demo-architecture`); read the five
in-scope source files (`AnimationControlsGroup.vue`, `ControlsPaneWrapper.vue`,
`AnimationControls.vue`, `AnimationControlsControls.vue`, `LayerConfigPanel.vue`) +
`design-idioms.css` + `style.css`; grepped the whole `demo/` tree for every gate
token; verified glass-ui `3.4.0` `LabeledField.vue.d.ts` (installed); drove the live
demo (Playwright, localhost:5173) and measured the grid/widths/field-edges at 1440
desktop AND 390 mobile.

**VERDICT:** H.W3 is **largely SOUND and well-grounded** — every headline number is
live-true (3-track collapse `1353.59px 0px 0px`, lopsided `{214,468}` ≈ the lane's
`{212,466}`, three width regimes `1276/781/400`, both H.W0 crashes + the route storm
still firing). S1/S2/S3 are feasible and correctly net-deletion. **But four substantive
defects bite at IMPL time**: (1) the `proof:demo-shell-grid` grep-gate over-constrains
onto legitimate out-of-scope code; (2) S4 cites a desktop "existing idiom" for the
rail-track collapse that does not exist (desktop open/close is `translateX`, not a
grid-track animation); (3) the "~40-line work-area-algebra deletion" requires relocating
two `position:fixed` docks the wave explicitly defers; (4) the wave (S4) and its own
folded lane (`a-timeline-width §3(iii)`) give CONTRADICTORY instructions on `col-end-4`.
None is a hard BLOCKER for S1–S3; #2/#3/#4 are HIGH/MED scoping defects in S4 (the
MEASURE-FIRST step) that must be edited before authorization.

---

## Findings

### HIGH-1 — `proof:demo-shell-grid` grep-gate over-constrains onto legitimate out-of-scope code
**Loc:** `H.W3.md §Hard gate` (`:41`, the `proof:demo-shell-grid` clause) +
`H.md §H.W3 :353`.

**Defect.** The gate asserts "ZERO surviving occurrences of `grid-cols-[auto_1fr]`,
`grid-cols-[subgrid]`, `col-span-2`, `col-end-4`, `col-span-full`,
`grid-template-columns: subgrid`, and `--controls-pane-width`" over "the controls tree."
The grep (source only, `/dist/` excluded) shows these tokens have LEGITIMATE live uses
the H.W3 scope explicitly does NOT touch:

- `grid-cols-[auto_1fr]`:
  - `controls/TimingFunctionPanel.vue:78` — the cubic-bézier/steps **detail panel**, the
    D3 easing-editor lane. `a-controls-sidebar.md:194-197` explicitly **BOOKs this to the
    D3 lane** ("Do not fold it into this fix"). It is owned by **H.W4** (`H.md :359-368`,
    `TimingFunctionPanel.vue:17-19` is H.W4 scope), NOT H.W3.
  - `asset-manager/AssetPropertiesPanel.vue:6` — a completely separate component tree
    (the playground), no relationship to the controls sidebar.
- `col-span-2`:
  - `controls/TimingFunctionPanel.vue:3` — again the D3 detail panel, out of H.W3 scope.

`TimingFunctionPanel.vue` sits **inside** `animation-controls/controls/`, so scoping the
grep to "the controls tree" does NOT save it. A blanket grep-gate over the controls tree
**reds on legitimate, deliberately-retained, out-of-scope code** — it would either block
a correct H.W3 implementation or pressure the implementer to over-reach into the H.W4
detail panel (a scope leak the spine forbids).

**Fix (concrete doc edit).** Narrow the grep-gate's PATH SET to the files H.W3 actually
rewrites, and EXCLUDE the D3/asset-manager files by name. Replace the `proof:demo-shell-grid`
grep clause with:

> grep-gate over **exactly** `AnimationControlsControls.vue`, `AnimationControlsGroup.vue`,
> `ControlsPaneWrapper.vue`, `AnimationControls.vue`, `LayerConfigPanel.vue` (the S1–S4
> rewrite set): ZERO `grid-cols-[auto_1fr]`, `grid-cols-[subgrid]`, `col-span-2`,
> `col-end-4`, `col-span-full`, `grid-template-columns: subgrid`, `--controls-pane-width`.
> **Explicitly OUT of the gate's path set** (legitimate, H.W3-untouched):
> `TimingFunctionPanel.vue` (`grid-cols-[auto_1fr]:78`, `col-span-2:3` — the D3 detail
> panel, owned by H.W4) and `asset-manager/AssetPropertiesPanel.vue:6` (separate tree).
> The `--controls-pane-width` token-deletion clause separately asserts the token name no
> longer appears anywhere in `demo/` source (the rename to `--rail-width` IS global) —
> that one is correctly tree-wide.

(Note the asymmetry the edit must preserve: the GRID/SPAN tokens are file-scoped because
the same Tailwind utility is legitimate elsewhere, but the `--controls-pane-width` token
RENAME is genuinely global — keep those two clauses split.)

---

### HIGH-2 — S4 cites a desktop rail-track collapse "idiom" that does not exist on desktop
**Loc:** `H.W3.md §Scope S4` (`:33`): "when the pane closes, the `[rail]` track animates
to `0` via the existing `grid-template-columns` transition idiom (the same one
`ControlsPaneWrapper.vue:147-155` uses for rows)."

**Defect (verified by source read).** `ControlsPaneWrapper.vue:147-155` is the **MOBILE**
block (`grid-template-rows: 0fr↔1fr` on `.controls-pane-wrapper`, the `@media`-unguarded
default that the `min-width:1024px` block at `:168-211` OVERRIDES). On **desktop**
(`:168-201`) the wrapper is `display: block` (`:175`) and the open/close transition is
`opacity` + `transform: translateX(-110%) rotate(-2deg)` on the inner `.controls-pane`
(`:188-201`) — the pane **slides off-canvas as an overlay**; the grid track is NEVER
animated on desktop. The track is a fixed `var(--controls-pane-width)` reservation that
the pane overlays (`a-demo-architecture.md:210-216` calls it exactly this — "a centred
stage with a left rail overlaid on top of it"; the pane is `z-controls` `position:relative`
`col-start-1` per `ControlsPaneWrapper.vue:6`). So:

1. The cited "existing idiom" is mobile-rows, not desktop-columns — it cannot be
   "the same one" reused for the desktop rail-track collapse.
2. Animating the desktop `[rail]` track `400px↔0` is a **genuinely new mechanism**, and it
   changes the open/close GESTURE: today the pane slides over a stage that never reflows
   (the stage is centred in the full grid via `col-end-4`); under S4 the stage would
   REFLOW horizontally every time the pane opens/closes (the `1fr` stage grows/shrinks).
   That is a behavioral change, not a "same idiom" reuse — and it interacts directly with
   the B.W3 "cube half-clipped" invariant S4 is gated on.

**Fix (concrete doc edit).** In S4, replace "via the existing `grid-template-columns`
transition idiom (the same one `ControlsPaneWrapper.vue:147-155` uses for rows)" with an
HONEST description: "via a NEW desktop `grid-template-columns: var(--rail-width) 1fr ↔ 0 1fr`
transition on `.controls-layout`, REPLACING the desktop overlay-slide
(`ControlsPaneWrapper.vue:175,188-201` `display:block` + `translateX(-110%)`) — note this
makes the stage REFLOW on open/close (it no longer overlays a statically-centred stage),
which is precisely why S4 is gated on `proof:stage-not-clipped` at pane OPEN **and CLOSED**."
Also add the overlay-slide removal (`ControlsPaneWrapper.vue:188-201`) to the S4 scope
list — it is "legacy beside its replacement" once the track animates, and the spine
requires it die in the same motion.

---

### HIGH-3 — S4 and its own folded lane (`a-timeline-width §3(iii)`) give CONTRADICTORY `col-end-4` instructions
**Loc:** `H.W3.md §Scope S4` (`:33`) vs `a-timeline-width.md:98-113` (folded as
"(iii)" per `H.W3.md §Folds :48`).

**Defect.** The wave's S4 says: "delete the `lg:col-start-1 lg:col-end-4` span at `:54-57`
and the pane-overlay collapse-to-zero dance; the stage gets its OWN `[stage]` track." But
`a-timeline-width §3(iii)` — the lane H.W3 cites as the SOURCE for step (iii) — says the
**opposite**: "**keep `col-end-4` on the stage** but ensure the controls track is
`var(--controls-pane-width)` with the remainder explicitly inert … the track only needs
to be a stable 400px reservation … the `1fr 1fr` remainder simply soaks the rest under
the overlaid, centered stage." The lane deliberately PRESERVES the overlay-centred-stage
model (to protect the B.W3 cube-clip invariant); the wave DEMOLISHES it (own `[stage]`
track, stage reflows). These are mutually exclusive architectures, and the wave presents
the lane as its grounding without flagging that it overrides the lane.

This is not fatal — the wave is allowed to adjudicate beyond a lane (the gap-scorecard is
authoritative) — but as written the wave **misattributes** its more-aggressive S4 to a
lane that recommends the gentler path, and provides no rationale for the override. An
implementer reading both will not know which to follow.

**Fix (concrete doc edit).** In `H.W3.md §Folds`, change the `(iii)` fold line to name the
override explicitly: "(iii) the grid-track tightening — S4 **ADOPTS THE STRONGER FORM**
(stage gets its own `[stage]` track, `col-end-4` deleted) rather than `a-timeline-width
§3(iii)`'s conservative 'keep `col-end-4`, inert remainder' form, BECAUSE the named
`rail·stage·rail` frame (the D1/D4/D10 cohesion thesis, `a-demo-architecture` F4) requires
a real `[stage]` track; the lane's conservative form is the FALLBACK if
`proof:stage-not-clipped` reds at pane-close reflow." That makes the divergence a resolved
trade-off, not a silent contradiction, and gives the implementer an explicit fallback.

---

### MED-1 — the "~40-line `--work-area-*-bias` algebra deletion" depends on relocating two `position:fixed` docks the wave defers
**Loc:** `H.W3.md §The state, verified :21` + `§Scope S4 :33` ("DELETES … the
`--work-area-*-bias` occlusion algebra") + `§Design decisions :56`.

**Defect (verified live + by grep).** The `--work-area-*` algebra (`style.css:95-130`,
~40 lines) is consumed by MORE than the centred-stage geometry:

- `AnimationMenuBar.vue:5` — `fixed left-0 right-0 z-dock` + `:7` `bottom:
  var(--work-area-bottom-offset)` (the bottom dock IS `position:fixed`).
- `ChromeDock.vue:108` — `top: calc(max(var(--work-area-top-offset), env(safe-area-inset-top)) …)`
  (the top dock positions off the same algebra).
- `AnimationControlsGroup.vue:330-331` — `.controls-layout` width/height clamp to
  `--work-area-max-{width,height}`.
- `ControlsPaneWrapper.vue:144` — mobile max-height consumes `--dock-menubar-reserve`
  (which references `--work-area-bottom-offset`).

The bias algebra exists to vertically centre the work-area BETWEEN two `position:fixed`
docks. Deleting it requires the docks to become grid tracks (`[top]`/`[bottom]`) so they
reserve space without the offset math. **But the wave does NOT move the docks** — `§Folds
F7` (`:49`) explicitly reserves "the `[top]`/`[bottom]` dock tracks for the
glass-ui-HANDOFF dock" and defers the dock itself. With the docks still `position:fixed`,
the bias algebra still has a job (keeping fixed docks off the stage). So S4 cannot delete
~40 lines by the grid change alone; at most it deletes the `col-end-4`/`col-span-full`
hacks. The line-count win is overstated and its precondition (grid-track docks) is unmet
in H.W3.

The wave DOES tag this MEASURE-FIRST (`:56`: "gate before claiming the line-count win"),
which is the right discipline — but it frames the algebra deletion as a *consequence of
the grid* when it is actually gated on a dock relocation that lives in a different
(deferred) work item.

**Fix (concrete doc edit).** In S4 and §Design-decisions, downgrade the algebra-deletion
claim: "S4 deletes ONLY the `col-end-4`/`col-span-full`/collapse-to-zero stage hacks. The
`--work-area-*-bias` algebra (`style.css:95-130`) stays in H.W3 because both docks remain
`position:fixed` (`AnimationMenuBar.vue:5`, `ChromeDock.vue:108`) — the algebra keeps the
fixed docks off the stage. Its deletion is BOOKED to the H.W7/dock-HANDOFF work that moves
the docks into the `[top]`/`[bottom]` grid tracks; only THEN is the ~40-line win claimable
(MEASURE-FIRST at that point, not here)."

---

### MED-2 — `proof:single-column-pack` is scene-blind; the route storm + field-less scenes make it red vacuously
**Loc:** `H.W3.md §Hard gate :39` (`proof:single-column-pack`).

**Defect (verified live).** The clause says "In the open controls pane, assert ALL
top-level field rows share ONE left-edge `x` … AND every row width within ±2px" but does
NOT pin a scene. Live measurement at 1440 desktop with the pane open on
`#/easing?anim=Easing+Preview` (where the route storm parks): `fieldCount: 0` — the easing
scene renders NO `.labeled-field` rows (it shows the easing-preview/curve panel, not the
duration/delay/iterations grid). `new Set([]).size === 1` is `false`, so the gate reds —
but **vacuously** (no fields exist), NOT because of the two-column defect. A vacuous red is
not a biting gate; worse, after the fix it would STILL red on easing (still zero fields),
so it can never green there. The genuine two-column bite (`{214,468}` widths, `{45/76,243/300}`
edges) is only observable on a scene that renders the multi-field grid (cube/simple/square),
which I confirmed live on cube (`fieldWidths: [214,468]`, 21 fields).

**Fix (concrete doc edit).** Add scene-pinning + a non-empty guard to
`proof:single-column-pack`: "navigate `#/cube`, settle-gate (per the H.W1 rest predicate
below), open the controls pane AND select an animation (the cube `Rotations` group renders
the full duration/delay/iterations/direction/fill/easing grid), assert `fieldCount >= 6`
(NON-VACUOUS guard — reds if the scene renders no field grid), THEN assert the
single-left-edge + ±2px-width clauses." Mirror the cube-pin into the prose so the gate
cannot be wired against easing/spring/sequence/path/starting-style (which render no
standard field grid).

---

### MED-3 — the settle-gate predicate only holds in the desktop-open state; it can never fire post-S4 or pane-closed
**Loc:** `H.W3.md §Hard gate :37` ("wait until
`getComputedStyle('.controls-layout').gridTemplateColumns.split(' ')[0]` resolves to the
`--rail-width` value before asserting"); same predicate in `a-timeline-width.md:151-154`.

**Defect (verified live).** The predicate assumes track-1 == the token. Live, three states
break it:
1. **Mobile / sub-lg** (`innerWidth < 1024`): `.controls-layout` is `grid-cols-1` → ONE
   track (`split(' ')[0]` = the full `390px`, never `400px`). Measured live at 390:
   `gridCols: "390px"`. The settle-gate never fires; the test hangs/times out.
2. **Pane closed on desktop**: track-1 is still `1353.59px` (the live `1353.59px 0px 0px`)
   because the `400px` token track GROWS when cols 2-3 are `0fr` under the overlaid stage
   (a-timeline-width §2 Regime A). `split(' ')[0]` = `1353.59px` ≠ `400px` → never fires
   unless the pane is open.
3. **Post-S4**: once S4 collapses to `[rail] var(--rail-width) [stage] 1fr` AND the rail
   animates to `0` on close (HIGH-2), `split(' ')[0]` is `0px` when closed and
   `var(--rail-width)` when open — the predicate ONLY holds at desktop + open + rested.

**Fix (concrete doc edit).** Make the settle-gate predicate explicit about its
preconditions: "settle-gate = (a) viewport ≥ 1024 (the desktop lg branch — the gate is
desktop-scoped per `a-timeline-width §1`), (b) controls pane OPEN, (c) the route rested
(hash unchanged for ≥500ms — the H.W1 `proof:no-route-storm` rest condition), THEN poll
until `gridTemplateColumns.split(' ')[0]` parses to `var(--rail-width)` (±2px). If any
precondition is unmet the gate is N/A, not RED." This also tightens the cross-reference to
H.W1's rest gate, which is the actual flake-defeating mechanism (verified: the route storm
auto-navigated `/#/cube` → `#/easing?anim=Easing+Preview` mid-measurement twice in my
session, exactly `a-timeline-width §4`'s "390px mid-swap").

---

### LOW-1 — S2's easing label-slot conditional is resolvable NOW against glass-ui 3.4.0 (no slot exists)
**Loc:** `H.W3.md §Scope S2 :31` ("OR adopt `<LabeledField>` with the edit-pencil in its
label slot if glass-ui exposes one") + `§Folds F4 :47`.

**Verification (glass-ui `3.4.0` installed, `node_modules/@mkbabb/glass-ui/dist/
components/custom/labeled-field/LabeledField.vue.d.ts`).** The bare `<LabeledField>`
exposes exactly TWO slots: `default` (the form control) and `error` (the error region).
Its label is built INTERNALLY from the `label`/`tooltip`/`labelClass` props + an
IconTooltip — there is **no label-action / label-suffix slot** to host the easing
edit-pencil. So the conditional resolves: glass-ui does NOT expose a label slot → the
easing row CANNOT adopt `<LabeledField>`-with-pencil-in-label without the named
glass-ui-HANDOFF. The wave correctly provides the fallback (option B: wrap label-row +
`EasingSelect` in one `<div class="flex flex-col gap-1">`), so this is NOT a blocker — but
the wave leaves the conditional open ("if glass-ui exposes one") when it is decidable now.

**Fix (concrete doc edit).** Resolve the conditional in S2: "glass-ui 3.4.0's
`<LabeledField>` exposes only `default` + `error` slots (verified
`LabeledField.vue.d.ts`) — NO label-action slot — so the easing row takes the wrapper
fallback (one `<div class='flex flex-col gap-1'>` around the label-row + `<EasingSelect>`);
the label-action slot is BOOKED as an OPTIONAL future glass-ui-HANDOFF (`§4`), not a
blocker for H.W3." This removes a dangling "if" from a SOURCE-class wave.

---

### LOW-2 — S2 z-index conversion is feasible but check the `<LabeledField>` numeric-input pattern
**Loc:** `H.W3.md §Scope S2 :31` ("convert `LayerConfigPanel.vue:14-22` z-index from a
bare `<label>` + `<Input>` pair to `<LabeledField>` + slotted `<Input>`").

**Verification.** `LayerConfigPanel.vue:14-22` is today a bare `<label>` (`:15`) + a bare
`<Input>` (`:17-22`, `@change` parseInt) — two cells in the old split shape. glass-ui
`<LabeledField>` accepts a slotted control (`default` slot) per its d.ts, so wrapping the
`<Input>` is feasible and DRYs onto the one-cell paradigm. **Caveat (LOW):** the four
sibling wrappers (`LabeledInput`/`LabeledSelect`/etc.) auto-wire `aria-errormessage` to the
field's `errorId` slot-prop; a raw `<LabeledField>` + slotted `<Input>` must bind it
manually (the d.ts header note, lines 19-26). For a non-validated z-index this is cosmetic,
but the implementer should know the raw-field a11y wiring is manual.

**Fix (concrete doc edit).** Append to S2: "the raw `<LabeledField>`+slotted-`<Input>`
path requires manual `aria-errormessage`/`controlId` binding (the four wrappers auto-wire
it; `LabeledField.vue.d.ts:19-26`) — fine for the unvalidated z-index, but bind
`controlId`/`labelledBy` from the default-slot props so the label↔control association is
not lost."

---

### NIT-1 — line-number drift on the `.panel-row` subgrid rule
**Loc:** `H.W3.md` cites `AnimationControlsControls.vue:293` for
"`grid-template-columns: subgrid`" (`:16`, `:30`, `§Scope S1`); `H.md §H.W3 :350`
cites `:294`.

**Defect.** Verified by read: `AnimationControlsControls.vue:293` is `display: grid;` and
`:294` is `grid-template-columns: subgrid;`. The wave H.W3.md uses `:293`; the charter
H.md uses `:294`. The grep-gate target (`grid-template-columns: subgrid`) is at `:294`.

**Fix (concrete doc edit).** Normalize the wave's `:293` references for the
`grid-template-columns: subgrid` rule to `:294` (and keep `:293` only when it means the
`.panel-row { display:grid; ... }` block start, which is what must be PRESERVED per the
ALREADY-SOTA crossfade note). This matters because S1 says "KEEP `display:grid;
grid-template-rows`" — the kept line IS `:293` and the deleted line IS `:294`, so the two
must be cited distinctly to avoid deleting the wrong one.

---

## What is SOUND (no finding — recorded so the verdict is honest)

- **The core thesis is live-true.** 3-track collapse (`1353.59px 0px 0px`), lopsided
  columns (`{214,468}` ≈ the lane's `{212,466}`), three width regimes
  (ribbon `1276` / AC-root `781`≈768+pad / token `400`), both H.W0 crashes
  (`"......"` lerp at `engine.ts:516,576`; `serializeEasing` at `format.ts:24`), and the
  autonomous route storm — ALL reproduced live. The wave is not manufacturing a deficit.
- **S1/S3 (collapse to single-column stacked flow) is correct + net-deletion.** glass-ui
  `LabeledField` is single-cell (`utilities.css:62`, no `display:contents` — verified);
  the two-track grid IS the wrong substrate; the subgrid chain + `col-span-2` markers are
  dead weight; deleting them and laying `flex flex-col gap-2` is the idiomatic gestalt.
- **S3 token rename (`--controls-pane-width` → `--rail-width`) + floor→width is sound.**
  The token is decorative today (live `400px` token vs `1276px` ribbon); pinning
  `.controls-content` to `width` and deleting the `lg:max-w-screen-md` (768) cap is the
  one-token DRY collapse, no god-wrapper — correctly resolved against a
  `<TimelineWidthProvider>`.
- **The crossfade-survival carve-out is correct.** S1 keeps `display:grid;
  grid-template-rows` on `.panel-row` and removes only `grid-template-columns` — the
  `0fr↔1fr` crossfade (`:295-302`) is orthogonal and must survive (matches
  `a-controls-sidebar.md:242-245`).
- **The DAG-dep on H.W1 (settle-gate on FSM rest) is load-bearing and well-founded** —
  the route storm actively corrupted my own measurements (auto-nav to easing twice). The
  layout gates genuinely cannot be measured without it.
- **The Teleport pipeline is NOT broken by the fix.** `AnimationControlsControls.vue:154`
  (ribbon) and `:95` (timeline-expanded) teleport by `#id` target, decoupled from the
  grid topology; S1–S4 change container layout, not the teleport targets — confirmed the
  targets (`#controls-ribbon-target`, `#timeline-expanded-target`) are plain `<div>`s
  whose POSITION (not existence) changes. No teleport-lifecycle risk.

---

## Severity roll-up

| # | Sev | One-line |
|---|-----|----------|
| HIGH-1 | HIGH | `proof:demo-shell-grid` grep over-constrains onto TimingFunctionPanel (D3/H.W4) + AssetPropertiesPanel — narrow to the S1–S4 file set |
| HIGH-2 | HIGH | S4 "existing grid-template-columns idiom" is mobile-rows, not the desktop translateX overlay it must replace — rail-track-collapse is a NEW mechanism + stage now reflows |
| HIGH-3 | HIGH | S4 deletes `col-end-4`; its folded lane `a-timeline-width §3(iii)` says KEEP it — name the override + fallback |
| MED-1 | MED | the ~40-line work-area-algebra deletion needs grid-track docks (deferred F7); not deletable by the grid change alone — BOOK to dock-HANDOFF |
| MED-2 | MED | `proof:single-column-pack` is scene-blind; reds vacuously on field-less scenes — pin `#/cube` + `fieldCount>=6` guard |
| MED-3 | MED | settle-gate predicate only holds desktop+open+rested; never fires mobile/closed/post-S4 — make preconditions explicit |
| LOW-1 | LOW | S2 easing label-slot conditional decidable now: glass-ui 3.4.0 LabeledField has no label slot — resolve to the wrapper fallback |
| LOW-2 | LOW | S2 raw `<LabeledField>`+`<Input>` needs manual aria/control-id wiring (d.ts:19-26) |
| NIT-1 | NIT | `.panel-row` line drift: `:293`=display:grid (KEEP), `:294`=grid-template-columns:subgrid (DELETE) — cite distinctly |
