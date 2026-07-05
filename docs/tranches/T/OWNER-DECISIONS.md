# Tranche T — the OWNER DECISION register (OD-1 … OD-6)

> **Status: DEVELOPMENT. Six rulings PENDING-OWNER. Every ruling slot is EMPTY.**
> This is charter §3 materialized as a live register: one row per pending disposition, each with
> the decision, the options + their lane evidence, the prototype/artifact that serves the call,
> and an EMPTY ruling slot the owner fills.
>
> **THE MECHANISM (T.M2, lane 26 rec 1 — binding).** *No design wave's born-RED oracle is
> authored until its OD row carries an owner token.* The prototypes are the vehicle: the S.E
> lesson — **critic consensus ≠ owner verdict** (11×100% critic-converged, rejected on sight) —
> applied UPSTREAM. A wave marked **BORN-OWNER** below cannot green (indeed cannot be authored)
> until the ruling slot is filled with an owner token per T.M's `proof:owner-verdict-recorded`
> mechanism. The **RULED** sub-parts inside a row are ordinary born-RED and land now.
>
> **Prototypes** are kept worktrees served on `:5180` for owner live review; capture packets
> commit under `audit/prototypes/`. The owner token is the taste sign-off recorded here + in the
> gated wave's verdict slot.

---

## The register

| # | Decision (the fork) | RULED already | Needs the token | Served by | Ruling |
|---|---|---|---|---|---|
| **OD-1** | morph + motion-path: **PRUNE** outright vs **FUSE** into one `scenes/svg/` | compose is pruned (independent); the SVG factories are LIBRARY, untouched | which of PRUNE / FUSE | **T.E2** (FUSE) ∥ **T.E3** (PRUNE) — mutually exclusive, both spec'd; the svg-fusion sketch | ⬜ **PENDING-OWNER** |
| **OD-2** | Cursor light: **REMOVE** outright vs **relocate** to the home hero on glass-ui `Aurora` | the compose-scene `--mouse-x` wash dies EITHER way (rides compose prune); no hand-rolled tracker survives | REMOVE vs Aurora-on-hero | **T.D13** + the Aurora-on-hero prototype | ⬜ **PENDING-OWNER** |
| **OD-3** | `ppMode`/ppmycota brand toggle: **KEEP** as an intentional brand mark vs **CUT** as decorative library-orthogonal chrome | nothing (no VERDICT line names it directly) | KEEP vs CUT | **this register** (lane 15 F5) + the CUT follow-up gate spec below | ⬜ **PENDING-OWNER** |
| **OD-4** | The hero DIRECTION: "ink on graph paper" φ-band seat + per-CHAR two-tier uplift | per-char uplift is RULED (#3); honest ink (weight 400, de-glow) is RULED | the whole home COMPOSITION (seat, deck voice, two-focal balance) | **T.D9 / T.D10 / T.D11** + the live hero prototype | ⬜ **PENDING-OWNER** |
| **OD-5** | Panel chrome: **two floating GlassPanels**, no surrounding pane | the surrounding pane is OUT (#7 "remove the surrounding pane") | the two-floating-panel REPLACEMENT composition | **T.B** (panel facility) + the live panel prototype | ⬜ **PENDING-OWNER** |
| **OD-6** | Theme: Jakarta body + honest-weight serif + ONE violet accent ramp | the red-kill (`--accent-red` → destructive-only, ~168 refs) is RULED; Jakarta body is RULED | the violet ramp CHOICE (the oklch hue/chroma arms) | **T.D7** + the live theme prototype | ⬜ **PENDING-OWNER** |

---

## OD-1 — morph + motion-path: PRUNE vs FUSE

**The fork.** VERDICT #23 ("motion-path, morph, and compose likely need to just be pruned") is a
"likely," not a ruling. Lane 07 measured both scenes **mostly work live**, and a fusion of the
three SVG factories (MotionPath · MorphSVG · DrawSVG) onto ONE standard panel facility collapses
**3,584L → ≈450L** — the demo would then dogfood all three library factories through one honest
scene instead of two broken bespoke ones.

- **Option A — FUSE (`scenes/svg/`).** One scene, three sub-animations on the standard triad
  facility. Evidence: lane 07 rec 2; the library `morph-renders-d`/`-orients`/`morphsvg-consume`
  gates SURVIVE and get an honest consumer. Served by **T.E2** (BORN-OWNER).
- **Option B — PRUNE.** Delete morph + motion-path outright (compose is pruned regardless).
  Evidence: lane 07 rec 2 (alt); VERDICT #20/#21 (both "barely works"/"does not work at all").
  Served by **T.E3** (BORN-OWNER).

**Gated waves (cannot be authored until the token).** T.E2 (FUSE) and T.E3 (PRUNE) are mutually
exclusive — the ruling selects exactly one. The other's gate is never authored.

**Ruling:** ⬜ **PENDING-OWNER** — token: `___`

---

## OD-2 — cursor light: REMOVE vs Aurora-on-hero

**The fork.** VERDICT #22: "strange light that follows the cursor, but only partially — if you're
going to implement this, it should be done right." Lane 12 characterized the hand-rolled compose
wash across five axes of partiality (one surface of nine; hard-clipped to the foundry rect;
desktop-mouse-only; near-imperceptible intensity; and a ~1,100–2,000× forced-layout cost per
pointermove). **Both options are compliant**; the bespoke wash dies either way.

- **Option A — Aurora-on-hero (DO-IT-RIGHT).** Retire the compose wash; if a signature
  cursor-reactive light is wanted, home it on the **home hero** (the one page every visitor sees,
  already redesigning per OD-4) via glass-ui's **public** `@mkbabb/glass-ui/aurora` (`Aurora` +
  `useCursorInteraction` + `setCursor`), low `opacityCeiling` so the per-char hero stays dominant.
  A straight import — Aurora ships the rAF-coalescing, PRM-safe fallback, DPR budget, lazy-arm.
  Evidence: lane 12 T-CL-1. Served by **T.D13**.
- **Option B — REMOVE.** Excise the casting-floor key-light outright, no replacement. Evidence:
  lane 12 T-CL-2 (subsumed by compose's prune anyway). Served by **T.D13**.

**RULED regardless:** the compose-side `--mouse-x`/`foundry-keylight` wash is deleted (rides T.E
compose prune); `proof:cursor-light-no-sync-layout` (T.D13 / lane 12 T-CL-3) forbids a THIRD
hand-rolled pointer-tracker recurrence. The glass-ui GAP for a subtler DOM-content wash is **BG-7**
in `KF-TO-GLASSUI-BG.md` (do NOT hand-copy glass-ui's internal `createSpecularWriter`).

**Gated wave.** T.D13's disposition-specific oracle is not authored until the token picks A or B.

**Ruling:** ⬜ **PENDING-OWNER** — token: `___`

---

## OD-3 — the `ppMode`/ppmycota brand toggle: KEEP vs CUT  *(this register owns it)*

**The fork (lane 15 F5).** `MbabbMenu.vue:55-66` mixes two registers in one dropdown: product
chrome (Share, Dark mode) and a **personal-brand toggle** — the "ppmycota" row that flips
`ppMode` (`getStoredAnimationGroupControlOptions(...).ppMode`). It is **not dead** (5+ live
consumers: `scenes/cube/CubeScene.vue`, `scenes/cube/CubeTarget.vue`,
`scenes/easing/EasingHeroStage.vue`, `easing-editor/{EasingCurveCanvas,EasingSelect}.vue`, +
three stylesheets), and the owner — this repo's author — may well want their own brand mark in
their own demo.

**But** it is exactly the class of decorative, library-orthogonal element the VERDICT repeatedly
rules OUT elsewhere: #2 (the kf-source-egg card), #8 (gesture legends), #13 (curve telemetry),
#15 (the Gallery button) — all "remove all elements like this." **No VERDICT line names `ppMode`
directly**, so lane 15 did NOT fold it into any PRUNE list; it is surfaced here for an explicit
call, not assumed either way.

- **Option A — KEEP.** An intentional brand mark in the author's own demo. No wave; the 5+
  consumers stay. Recorded here as a deliberate keep so no downstream sweep silently cuts it.
- **Option B — CUT.** Fold it into the same "remove decorative, library-orthogonal chrome" sweep
  the VERDICT applies everywhere else. Removes the `ppMode` row from `MbabbMenu.vue` **and** its
  5+ downstream consumers + the three stylesheets. Follow-up gate authored **only if CUT**:
  `grep -ri ppmode demo/` → 0 (a decision-triggered gate, not a standing born-RED — lane 15 rec 5).

**Nothing is gated on this today** — it is a scope/taste call with no born-RED wave pending; the
outcome routes to either "recorded KEEP" or a CUT wave in **T.E/T.F** (decorative-chrome sweep)
with the grep gate attached at that time.

**Ruling:** ⬜ **PENDING-OWNER** — token: `___`

---

## OD-4 — the hero direction ("ink on graph paper" φ-seat + per-char two-tier)

**The fork.** VERDICT #3: "the original hero animation is totally broken and should uplift each
individual char" (the word-granular F.W16 split REJECTED; per-CHAR wanted); "should be lower on
the page, more towards the centre — it's OK if it sits a bit on top of the cube." Lane 01 designed
an "ink on graph paper" φ-band re-seat with a two-tier per-char uplift (sr-only mirror + X-5
kept), honest ink, and a serif-italic deck ramp.

- **RULED (born-RED now):** per-char uplift (T.D10), honest ink (weight 400, de-glow — shared
  with T.D2/BG-6), the φ-seat lower-on-page direction.
- **Needs the token:** the whole home COMPOSITION signed off live — the seat geometry, the deck
  voice (serif-italic vs Jakarta body — this row RESOLVES the T.D3-vs-01 sub-header conflict), the
  two-focal balance (hero over cube).

**Served by** T.D9 (φ-seat + two-focal capture gate), T.D10 (per-char uplift), T.D11 (deck ramp) +
the live hero prototype.

**Gated waves (BORN-OWNER):** T.D9's two-focal capture oracle + T.D11's deck-voice oracle are not
authored until OD-4 carries a token.

**Ruling:** ⬜ **PENDING-OWNER** — token: `___`

---

## OD-5 — panel chrome: two floating GlassPanels, no surrounding pane

**The fork.** VERDICT #7: "remove the surrounding pane — it's superfluous" (the outer wrapper
around the panel card). Lanes 10/23 designed the replacement as **two floating GlassPanels** (the
Controls/Keyframes/Timeline triad + one additive scene facet) with no surrounding pane.

- **RULED (born-RED now):** the surrounding pane is REMOVED.
- **Needs the token:** the two-floating-panel composition itself signed off live — geometry,
  float behavior, the triad + facet arrangement (VERDICT #25 "we forgot about that facility
  entirely" — the facility must RETURN, honestly, for every sub-animation).

**Served by** T.B (the `SceneFacility` panel facility, surrounding-pane removal) + the live panel
prototype.

**Gated wave (BORN-OWNER):** T.B's panel-composition capture oracle is not authored until OD-5
carries a token; the mechanical pane-removal is RULED and lands now.

**Ruling:** ⬜ **PENDING-OWNER** — token: `___`

---

## OD-6 — theme: Jakarta body + honest-weight serif + ONE violet accent ramp

**The fork.** VERDICT #16 ("I don't like this latent red theme"; "re-designed with glass-ui in
mind") + #24 (fonts/sizes consistency). Lane 09 designed: Instrument Serif 400 (display only),
Plus Jakarta Sans (body/chrome, already bundled), Fira Code (data only), and ONE oklch violet
accent ramp unifying periwinkle (`--ppmycota-primary` 248°) + glass-ui's dark orchid (318°), with
`--accent-red` returning to destructive-only.

- **RULED (born-RED now):** the red-kill — `--accent-red` → destructive-only, ~168 refs repointed
  by the one-token lever (T.D7's mechanical half); Jakarta as the body register (T.D3); mono
  demoted to data (T.D5).
- **Needs the token:** the violet ramp CHOICE — the exact oklch hue/chroma light+dark arms
  (proposal: `--accent-kf: light-dark(oklch(0.56 0.17 295), oklch(0.74 0.13 305))`) signed off
  live, since the whole field's identity turns on it.

**Served by** T.D7 (the one oklch accent authority) + the live theme prototype; the color VALUES
of T.D2/T.D3/T.D8/T.D17 all consume this token, so its ramp choice is upstream of them.

**Gated wave (BORN-OWNER):** T.D7's accent-census oracle is not authored until OD-6 carries a
token (the red-kill mechanical lever is RULED and lands now; the ramp values ride the token).

**Ruling:** ⬜ **PENDING-OWNER** — token: `___`

---

## Cross-band index (which band's waves each ruling unblocks)

| OD | Owning band | Gated waves (BORN-OWNER until the token) |
|---|---|---|
| OD-1 | **T.E** | T.E2 (FUSE) ∥ T.E3 (PRUNE) |
| OD-2 | **T.D** | T.D13 (cursor disposition oracle) |
| OD-3 | **T.E/T.F** (if CUT) | the `grep -ri ppmode demo/` follow-up gate (decision-triggered) |
| OD-4 | **T.D** | T.D9 (two-focal), T.D11 (deck voice) |
| OD-5 | **T.B** | the panel-composition capture oracle |
| OD-6 | **T.D** | T.D7 (accent-census) |

All six are recorded in the T.M `PROMPT-RECAP.md` owner-token census; T.Z's close requires every
slot filled (or explicitly deferred with a reason) before the design waves are authored.
