# D — the deferred ledger (every item, tagged, terminated)

Tranche D is the terminal home for every keyframes-owned deferral. The
constraint is **P-invariant-28: no perpetual punts** — every item carries a
real disposition, a named owner, and a trigger; **zero un-dispositioned punts**.
This ledger expands the plan's ledger table into prose, one entry per item.

Tags:

- **KFD** — fold into D (a keyframes-owned item with a D wave as its terminal home)
- **OUT** — sibling-booked (a different repo owns it; D keeps the named allowance + enabler stable)
- **ARCH** — permanent KILL (recorded with rationale; do not re-litigate)
- **CLOSED** — done in C (D verifies no regression only)

Verified not asserted: each KFD item's evidence is a live `file:line` on
`tranche-d-dev`; each OUT item names the cross-repo edge it pins; each ARCH item
carries its KILL rationale; each CLOSED item names the gate that proves it held.

---

## KFD — folded into D (keyframes-owned, terminal home named)

### KFD-1 — the φ-ladder leaf-tail F6 (89 body sites) · CHRONIC A→B→C

- **Disposition:** D.W2 — the terminal migration. The 89 `text-sm` / `text-xs`
  / `text-base` body sites migrate to the semantic golden-ratio ladder; the
  display tier closed in C.W2 (58 instrument-serif sites → the ladder; sweep =
  0), so D.W2 is the body-tier follow-on, not a fresh fork.
- **Owner:** keyframes demo (D.W2).
- **Trigger:** the body-tier consumption sweep — D.W2 is THE next demo-touching
  styling wave, so the deferral cannot slip a fourth cycle.
- **History:** deferred A→B (B FINAL §Deferrals: "the broad type migration is
  the residual, scoped, owned"), carried to C as the headline design item, where
  the *display* tier landed (C.W2) and the *leaf-tail* was BOOKED to the
  mechanical follow-on (C FINAL §Deferrals: "the headline tier shipped clean").
  D is the leaf-tail's terminal home — the chronic ends here.
- **The P-28 stakes:** this is the highest drop-risk item (C prompt-recap Part
  5.1: "if C does not absorb it, the deferral becomes a perpetual punt"). C
  absorbed the display tier; D absorbs the leaf-tail. A third slip would be the
  violation — D.W2 closes it.

### KFD-2 — the square-scene mobile-composition occlusion

- **Disposition:** D.W5 — the terminal fix. The named `square/mobile` occlusion
  (the optical-split under-reserve in the closed state + the controls-grid
  row-starve in the open state) is fixed; the allowance's self-cleaning
  stale-check in `occlusion-gate.mjs` fires (reds) when the occlusion is closed,
  proving the fix landed.
- **Owner:** a focused square-scene mobile-composition pass (D.W5).
- **Trigger:** D.W5's mobile work-area / `--dock-menubar-reserve` /
  `--work-area-vertical-bias` fix — the same knobs C.W3's work-area cap
  mitigated but did not fully close.
- **History:** surfaced by C.W1's HARD occlusion gate as the ONE real occlusion
  (C PROGRESS §S2); named in `occlusion-gate.mjs` as a self-cleaning allowance
  (C FINAL §Deferrals), mitigated by C.W3's work-area cap. The smallest demo
  scene; D.W5 is its terminal home, co-landed with the dock-leverage work that
  reshapes the same mobile band.

### KFD-3 — the consumer dock-rename + `dock/index.ts` deletion · was gated, NOW UNBLOCKED

- **Disposition:** D.W5 — the keyframes-side home. `TopDock` → `ChromeDock`,
  `AnimationMenuBar` → `TransportDock` as **local component renames** adopting
  the AU.W8 docs role-vocabulary (shared with slides — not forked), each still
  composing the **published glass-ui dock primitives** (`GlassDock` +
  `DockLayerGroup`/`DockLayer`/`DockIconButton`/`DockSelectTrigger` — these DO
  ship in 3.3.0); DELETE the local re-export
  `demo/@/components/custom/dock/index.ts` (it re-exports `GlassDock`/
  `DockLayerGroup` from glass-ui + the local `TopDock` — `index.ts:1-2`). There
  is **no `<Role>Dock` base component to slot-fill over** — that vocabulary is a
  glass-ui AU.W8 docs-convention + base-rename deliverable, and a role-typed
  BASE COMPONENT is BOOK in glass-ui until a 2nd consumer appears.
- **Owner:** keyframes demo (D.W5).
- **Trigger:** PARTIALLY RESOLVED — the dock CORRECTNESS base + the touch-gate
  B′ fix landed (`f0b0ffb`, ships in 3.3.0), unblocking the local renames + mask
  removal. The `<Role>Dock` base-COMPONENT leverage remains **gated on glass-ui
  AU.W8** (BOOK in glass-ui until a 2nd consumer) — a named cross-session edge:
  if AU.W8 ships a role-typed dock base and keyframes is its 2nd consumer,
  keyframes circles back to adopt it; otherwise the docks stay local components
  composing the published primitives.
- **The pin:** D moves the local `file:../glass-ui` pin (`package.json:66`) to a
  published `^3.3.0` when AT ships, consuming the *published* base — D pins the
  package, never the sibling branch (inv-16).
- **History:** specified in C's dock-convergence plan
  (`docs/tranches/B/asks/glass-ui-dock-convergence.md`), GATED on glass-ui
  landing the base (C PROGRESS §2). The gate is now gone; D.W5 is the home.

### KFD-4 — the `always-expanded="isMobile"` double-tap mask

- **Disposition:** D.W5 — removed on the glass-ui 3.3.0 pin (the touch-gate B′
  fix published). Two live mask sites:
  - `demo/@/components/custom/dock/TopDock.vue:117` —
    `:always-expanded="isMobile"` (the conditional mobile mask)
  - `demo/@/components/custom/animation-controls/AnimationMenuBar.vue:17` —
    `:always-expanded="true"` (the menubar's unconditional always-expanded)
- **Owner:** keyframes demo (D.W5).
- **Trigger:** glass-ui PUBLISHING 3.3.0 with the touch-gate B′ fix
  (`f0b0ffb`). The mask exists only because the dock double-tap (ASK-1) was
  unfixed; with B′ published, the mask is removable.
- **History:** the mask was the ONLY outstanding demo-side residue at C-close (C
  prompt-recap Part 1.11: "remove it once glass-ui's touch-gate fix lands").
  Per project memory, dock double-click is a glass-ui-root fix, never patched in
  the demo — so the mask stayed until the published fix. D.W5 removes it on the
  pin bump.

### KFD-5 — the engine W0-slipped residuals (`_snapSettled` · `leaves.ts | any` · deprecated re-exports)

- **Disposition:** split across D.W3 + D.W4 (full detail in
  `audit/engine-transposition.md` D-6):
  - **D-6a** the `_snapSettled` asymmetry (`smooth.ts:99-103` lacks the
    `_playback.stop()` that `spring.ts:196` has) → **D.W3** (snap symmetry).
  - **D-6b** `leaves.ts:75` `| any` widening → **D.W4** (tighten to the real
    handle union).
  - **D-6c** the deprecated path-compat re-exports (`src/animation/utils.ts:34-42`,
    `src/animation/format.ts:12-16`) → **D.W4** (delete; no legacy).
- **Owner:** keyframes engine (D.W3 + D.W4).
- **Trigger:** the engine-transposition wave (D.W4) + the brittleness wave
  (D.W3, where the snap-symmetry correctness fix co-lands with the reactivity
  hardening).
- **History:** all three were BOOKED at C.W0 and SLIPPED C.W4 (the engine
  residual wave closed on the steppers/loop-core but left these three). D is
  their terminal home — each carries a falsifiable gate (D-6 §).

---

## OUT — sibling-booked (cross-repo owner; D keeps the enabler stable)

### OUT-1 — bucket-glassui (ASK-3 `LabeledField` a11y label-association)

- **Disposition:** glass-ui owns the `LabeledField` label-association fix; D
  keeps the named lighthouse allowance (`bucket-glassui` in
  `lighthouse-gate.mjs`) and applies NO vendor band-aid in the demo (inv-16).
  The full lighthouse A11y=100 SCORE binds when glass-ui ships it.
- **Owner:** glass-ui (ASK-3, filed
  `docs/tranches/B/asks/glass-ui-adoption-asks.md`).
- **Trigger:** glass-ui publishing the `LabeledField` fix → the demo bumps the
  pin → `bucket-glassui` empties → the A11y=100 hard assertion binds with zero
  allowances.
- **Why OUT not KFD:** the defect is in glass-ui's `LabeledField`; patching it
  in the demo would be the exact vendor-band-aid inv-16 forbids (project memory:
  glass-ui-root changes go in glass-ui).

### OUT-2 — VAL-9 `--spring-*` token codegen (ASK-2)

- **Disposition:** glass-ui owns the `--spring-*` token regeneration; D keeps
  the enabler — the `springLinearStops()` export — stable and value.js-free, so
  glass-ui can codegen its spring tokens from keyframes' proven stop generator.
- **Owner:** glass-ui (ASK-2).
- **Trigger:** glass-ui consuming `springLinearStops()` for its token codegen;
  D's obligation is only to not break the export's signature/output (the
  boundary gate `proof:boundary` keeps it light).
- **Why OUT:** the codegen lives in glass-ui's build; keyframes provides the
  generator, not the tokens.

### OUT-3 — the dock double-tap (ASK-1) · RESOLVED

- **Disposition:** RESOLVED by instrument in glass-ui — the touch-gate B′ fix
  (`f0b0ffb`). D's only remaining action is the consequent demo-side mask
  removal, which is KFD-4 (D.W5).
- **Owner:** glass-ui (ASK-1, fixed); keyframes (the mask removal, KFD-4).
- **Trigger:** glass-ui publishing 3.3.0 (carries B′) → KFD-4 fires.
- **Note:** this is the cross-arm edge that *became actionable* — ASK-1's fix is
  what unblocks both KFD-3 (rename) and KFD-4 (mask) in D.W5.

### OUT-4 — glass-ui foundational slices (reka-Tabs rail, strict-templates, `<Role>Dock` role-vocabulary)

- **Disposition:** glass-ui's AT arm (AU.W8 — the dock-design headline) owns the
  reka-Tabs rail + strict-templates slices **and the `<Role>Dock` role-vocabulary
  + base-rename machinery**. D depends ONLY on the *published dock primitives*
  (`GlassDock` + `DockLayer`/`DockLayerGroup`/`DockIconButton`/
  `DockSelectTrigger`, which ship in 3.3.0), NOT on a role-typed base component.
  D adopts the AU.W8 role-vocabulary as **local component rename names**, but
  takes no dependency on the unfinished AT slices; any leverage of a glass-ui-side
  `<Role>Dock` base component is gated on AU.W8 (BOOK until a 2nd consumer).
- **Owner:** glass-ui (AT's own arm, AU.W8).
- **Trigger:** none on the D side for the renames + mask removal (D consumes the
  published primitives). A `<Role>Dock` base-component adoption gates on glass-ui
  AU.W8 landing a role-typed base AND keyframes graduating it as the 2nd consumer.
- **Why OUT:** these are glass-ui-internal refactors; keyframes neither blocks on
  nor drives them — it consumes the published primitives, not a role-typed base.

---

## ARCH — permanent KILL (recorded; do not re-litigate)

### ARCH-1 — ScrollTimeline-native

- **Disposition:** permanent KILL with rationale. The native `ScrollTimeline`
  drives an animation off the compositor thread; keyframes' `Timeline` is a
  caller-polled sampling pipeline (`sample() → clamp → easing → boundary snap →
  smoothing → progress`, `timeline.ts:80-111`). The native API does not fit the
  contract — feature-detecting it would not replace the JS sampler. No consumer
  asks for off-thread scroll binding.
- **Trigger to re-open:** a real consumer requiring off-thread scroll-driven
  animation appears. None has across A→B→C→D.
- **History:** KILLed-with-rationale in B (B FINAL §Deferrals), re-affirmed C.

### ARCH-2 — Worker / OffscreenCanvas / Atomics

- **Disposition:** permanent ARCHIVE — no consumer. Unchanged from A through D.
- **Trigger to re-open:** a consumer needing worker-thread animation appears.
- **History:** PERMANENT-ARCHIVE since A; re-affirmed B and C.

### ARCH-3 — `dev.sh` / `deploy.sh`

- **Disposition:** KILLed-with-rationale (C.W4 S7, the terminal call) — the npm
  scripts (`npm run dev` / `build` / `gh-pages`) are the canonical surface; a
  shell-script duplicate is a legacy parallel path.
- **Trigger to re-open:** none — the npm scripts are the contract.
- **History:** the terminal call landed in C.W4.

---

## CLOSED — done in C (D verifies no regression only)

### CLOSED-1 — LoAF / >50ms-trace

- **Done in:** C.W1 — `bench/playwright.bench.ts` is the real 2nd consumer (a
  200-cell AnimationGroup composite reading `window.__kfLoaf`, failing on >50ms
  main-thread blocking; runner-calibrated, the 50ms threshold unchanged).
- **D's duty:** verify no regression — the >50ms gate stays green (D-1's
  zero-alloc group transposition should give it *headroom*, not regress it).
- **Drift note:** this subsystem was **falsely closed by B** (B claimed a 2nd
  consumer that was a stub) and **corrected in C** (the real bench consumer) —
  the correction is preserved, not dropped (see prompt-recap §drift).

### CLOSED-2 — EasingTarget leak

- **Done in:** C — the `.glass-card` global-scope override that leaked
  `--track-ball-size-*` app-wide was scoped to the easing track (C design
  finding 7).
- **D's duty:** verify no regression (no unscoped vendor-utility mutation
  reappears).

### CLOSED-3 — dead scene-swap CSS

- **Done in:** C.W3 — the orphaned `.scene-*` rules (App.vue, post-`<Transition>`
  removal) were deleted; the scene-swap restored via `SpringProgress` on a
  sibling style of the keyed `<Suspense>` host (no blank-scene regression).
- **D's duty:** verify no regression (`proof:dogfood` + `demo-smoke` stay green).

### CLOSED-4 — cartoon-shadow / SquareScene halo / modal blur / dock a11y labels

- **Done in:** C (the demo-polish set — CSSCodeEditor `.cartoon-surface`,
  SquareScene `color-mix` halo, KeyboardShortcutsModal blur removal, demo-owned
  dock a11y labels).
- **D's duty:** verify no regression (the lighthouse + occlusion gates stay
  green; D.W2/W3's styling work does not reintroduce a hand-roll).

---

## Loose end (un-orphaned by design)

### The stacked publish leg (B 3.1.0 + C major + D major)

- **Disposition:** USER-DOMAIN by design — the publish leg
  (`changeset version` → tag → `release.yml`) is confirm-first, identical to
  A/B/C. D.W6 names the **version owner** for the stacked changesets so the
  publish is not orphaned across tranches (the only loose end the recap leaves —
  by design, not by drop). Current state: `package.json:1` version `3.0.0`;
  `.changeset/` holds `tranche-b-3-1-0.md` + `tranche-c.md`; D adds its own.
- **Owner:** the user (the publish owner finalizes the SemVer tier).
- **Trigger:** the user driving the publish in dependency order (the library
  legs are gate-free per `proof:boundary`; only the demo/deck legs gate).

---

## Ledger summary

| Item | Tag | Owner | Trigger | D wave |
|---|---|---|---|---|
| φ-ladder leaf-tail F6 (89) | KFD | keyframes demo | next styling sweep (= D.W2) | D.W2 |
| square/mobile occlusion | KFD | square mobile pass | mobile work-area fix | D.W5 |
| dock-rename + `index.ts` delete | KFD | keyframes demo | correctness base + B′ landed; `<Role>Dock` base-component leverage gated on glass-ui AU.W8 | D.W5 |
| `always-expanded` mask | KFD | keyframes demo | glass-ui 3.3.0 published | D.W5 |
| engine W0-slips (snap/`\|any`/re-exports) | KFD | keyframes engine | D.W3/W4 | D.W3 + D.W4 |
| bucket-glassui (ASK-3) | OUT | glass-ui | glass-ui ships `LabeledField` | — |
| VAL-9 `--spring-*` codegen (ASK-2) | OUT | glass-ui | glass-ui consumes `springLinearStops` | — |
| dock double-tap (ASK-1) | OUT-RESOLVED | glass-ui | published (→ KFD-4) | — |
| glass-ui rail / strict-templates / `<Role>Dock` vocab | OUT | glass-ui AT (AU.W8) | none on D side (renames adopt the vocab locally); base-component leverage gated on AU.W8 | — |
| ScrollTimeline-native | ARCH | — | off-thread consumer appears | — |
| Worker/OffscreenCanvas/Atomics | ARCH | — | worker consumer appears | — |
| dev.sh/deploy.sh | ARCH | — | none (npm scripts canonical) | — |
| LoAF/>50ms · EasingTarget · scene CSS · polish set | CLOSED | — | verify no regression | all |
| stacked publish leg | USER-DOMAIN | user | publish in dep order | D.W6 |

Zero un-dispositioned punts. Every KFD has a D wave; every OUT names its
cross-repo owner + edge; every ARCH carries its KILL rationale; every CLOSED
names its proving gate. P-invariant-28 holds.
