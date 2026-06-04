# B.W5 — glass-ui adoption asks (outward, inv-16)

Two glass-ui-owned defects the demo surfaces. Per the standing rule
(inv-16 / project memory: *all glass-ui & dock changes go in the glass-ui
repo, never patched in the demo*), keyframes does NOT patch them — it files
them here and the keyframes-side enabler (where one exists) is landed in
this repo. The fix lands in glass-ui on its own clean checkout, gated on its
own CI.

## ASK-1 — Dock double-click (glass-ui `useTouchGate` / `GlassDock`)

**Symptom.** A collapsed glass dock requires TWO taps on touch: the first
expands the pill, the second dispatches the intended control. The demo masks
this by mounting the docks `:always-expanded="isMobile"`
(`demo/@/components/custom/dock/TopDock.vue:117`,
`AnimationMenuBar.vue`), so a collapsed-pill first-tap is never the live
state on mobile — but the bug lives in glass-ui's touch-gate, not the demo.

**Ask.** In glass-ui, make a collapsed-dock control's FIRST tap both expand
the dock AND dispatch the intended action (or make the collapsed pill a
single full-pill button that expands-then-acts in one gesture). Owner:
glass-ui `useTouchGate`/`GlassDock`. Trigger: glass-ui's next dock/motion
tranche.

**keyframes-side enabler.** None — purely glass-ui-internal. The demo's
`always-expanded` mask stays until glass-ui ships the fix, then is removed.

## ASK-2 — VAL-9: glass-ui `--spring-*` token regen from the keyframes mint

**Symptom.** glass-ui ships committed-static `--spring-*` `linear()` design
tokens. They were authored by hand from a spring solver and can DRIFT from
keyframes' canonical `springLinearStops()` solver — there is no codegen
binding them to the mint, so a change to the solver silently desyncs the
tokens (grand-audit §4.2; the chronic VAL-9).

**Ask.** In glass-ui, regenerate the `--spring-*` `linear()` tokens from
keyframes' `springLinearStops()` at build time (a codegen step), so the
tokens cannot drift from the solver. Owner: glass-ui (token regen).
Trigger: glass-ui's next spring-token edit.

**keyframes-side enabler — LANDED.** `springLinearStops()` is a stable
public export with a versioned, documented signature
(`src/animation/springLinearStops.ts`; barrel `src/animation/index.ts:40`,
exported with its `SpringLinearStopsOptions` type). It is the value.js-free
light-surface mint glass-ui's codegen consumes — proven value.js-free by
`proof:boundary` (the `springLinearStops` entry, 0 value.js edges). The
writer (keyframes, the mint) ↔ reader (glass-ui, the codegen) boundary is:
glass-ui imports `springLinearStops` from `@mkbabb/keyframes.js` and emits
its `--spring-*` tokens; keyframes guarantees the export's signature
stability across minors. The drift-gate is glass-ui's to add (assert its
committed tokens equal a fresh `springLinearStops()` mint in glass-ui CI).

## Recording

Both asks are also surfaced to the constellation ledger
(`HUB/docs/constellation/ADOPTION-ASKS.md`) by the orchestration lead — that
file is fourier-owned (inv-16); keyframes authors the ask here and the lead
binds it into the ledger. keyframes' obligation is the enabler (ASK-2
`springLinearStops` stable export — landed) and the mask removal (ASK-1)
once glass-ui ships.

## ASK-3 — glass-ui `LabeledField` renders a `<label>` with no control association (C.W1)

**Symptom.** glass-ui's `LabeledField` (consumed across the demo's controls)
renders a visible `<label>` element that is NOT associated with its control
(no `for`/`id` pairing, no wrapping). Lighthouse flags `label` +
`aria-input-field-name` on every page with an open controls panel (a11y
craters to 75-79 — tranche-C design-findings, a11y-responsive CRITICAL). The
demo cannot fix this without forking the vendor component.

**Ask.** In glass-ui, associate `LabeledField`'s `<label>` with its slotted
control — either wrap the control in the `<label>`, or generate an `id` +
`for`, or forward `aria-labelledby`. Owner: glass-ui `LabeledField`. Trigger:
glass-ui's next a11y/forms tranche.

**keyframes-side enabler.** None — purely glass-ui-internal. The demo's
controls consume `LabeledField` idiomatically; the fix is the vendor's. Until
it ships, the demo's open-panel a11y is capped by the vendor component, which
C.W1 records (it does NOT aria-band-aid around the vendor, inv-16).
