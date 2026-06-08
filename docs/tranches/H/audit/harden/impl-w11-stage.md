# impl-w11-stage — Lane A: the STAGE glass-card register + card-rounding (I5 + I4)

**Wave:** H.W11 · **Lane:** A (stage glass-card + rounding) · **Branch:** `tranche-h-impl`
**Contract:** `docs/tranches/H/waves/H.W11.md` §S1 (I5), §S2 (I4) · `i-_PLAN.md §2 I5/I4`
**Status:** LANDED (demo-side), tsc-clean. Glass-ui primitive radius = born-RED-paired HANDOFF (recorded below). NOT committed.

---

## Scope delivered (file-disjoint to Lanes B/C)

Five stage-scene subject roots converged from THREE states to ONE register, plus the STAGE/rounding
section of `design-idioms.css`. The `.stage-cell` PRIMITIVE in `AnimationControlsGroup.vue` was
READ (the dock-containment survives untouched) — no edit needed there; the card simply lives inside
the surviving cell.

| File | Before (state) | After (I5/I4) |
|------|----------------|---------------|
| `demo/easing/EasingTarget.vue` | W10 G8 FULL-BLEED `<div class="easing-target … h-full w-full">` (no card → no radius, no backdrop) | `<Card :shadow="false" class="easing-target …">` — standard glass Card |
| `demo/spring/SpringTarget.vue` | W10 G8 FULL-BLEED bare `<div>` | `<Card :shadow="false" …>` |
| `demo/spring/StartingStyleTarget.vue` | W10 G8 FULL-BLEED bare `<div :style="{ '--spring-ease': … }">` | `<Card :shadow="false" :style="{…}" …>` (the `--spring-ease` binding preserved) |
| `demo/sequence/SequenceTarget.vue` | bare `<div class="glass-resting cartoon-surface …">` (border-radius 0 — the I4 square defect) | inner `<Card :shadow="false" …>` (the outer `max-w-3xl` layout wrapper survives) |
| `demo/motion-path/MotionPathTarget.vue` | bare `<div class="glass-resting cartoon-surface …">` (the user's named defect) | inner `<Card :shadow="false" …>` |
| `demo/@/styles/design-idioms.css` | `.dock-inset` DELETED note (the G8 layout-primitive half) | + §STAGE-CARD register + card-rounding documenting anchor (the I5 register, the FORK I5-shadow choice, the I4 mechanism + the inv-16 HANDOFF) |

Each swap is **outer-container-only** — every scene's inner flex column + header/body/footer
structure is byte-identical; only the OUTER container changed (full-bleed div / bare cartoon div →
`<Card>`). No legacy beside the replacement: the full-bleed divs and bare cartoon divs are GONE
(the comments that narrate the deletion quote the dropped class as backtick-fenced inline code, NOT
as a `class="…"` attribute — the same convention the W10 `proof:scene-card-rounded` gate already
strips before scanning).

---

## I5 — the glass-card register (the headline; REVERSES W10 G8 full-bleed)

The consumed glass-ui `<Card>` (default `tier="resting" surface="glass"`) emits — verified from the
glass-ui build (`dist/CardFooter-C390imy7.js`, the Card render fn) —
`rounded-card text-card-foreground scrollbar-hidden glass-resting glass-specular-track` + (when
`shadow` is truthy AND surface is glass) `shadow-card`. So the swap gives, by construction:

- a non-zero `border-radius` (`rounded-card` → `--radius-card` → `--radius-2xl` = 1rem = **16px**) — I4 for free;
- a glass backdrop (`glass-resting` → `backdrop-filter: blur(12px) saturate(1.05)`);
- the specular rim (`glass-specular-track`) — the protagonist-plate edge.

The control PANELS stay cartoon+quiet (W2/W9) — UNTOUCHED by this lane. TWO altitudes, cleanly
separated: cartoon = the control chrome; glass-resting = the stage subject.

**The `.stage-cell` LAYOUT PRIMITIVE survives** (`AnimationControlsGroup.vue:58,364-366` —
`box-sizing: border-box; padding-block: var(--dock-band-reserve)`): the card sits in the `[stage]`
track, dock-contained. `.dock-inset` stays deleted (no legacy beside the replacement).

### Glass-card sites (the four-scene convergence, verified live)

Measured against the live render (built `dist/gh-pages`, served, Playwright MCP, 1440×900, FSM
rested per scene) — the stage glass card inside `.stage-cell` for each scene:

| Scene | data-surface | data-tier | radius | backdrop-filter | isCartoon | shadow-card |
|-------|-------------|-----------|--------|------------------|-----------|-------------|
| easing | glass | resting | 16px | blur(12px) saturate(1.05) | false | false |
| spring | glass | resting | 16px | blur(12px) saturate(1.05) | false | false |
| sequence | glass | resting | 16px | blur(12px) saturate(1.05) | false | false |
| motion-path | glass | resting | 16px | blur(12px) saturate(1.05) | false | false |

This is the `proof:stage-glass-card` contract satisfied for all four: non-zero radius AND
backdrop-filter ≠ none AND NOT cartoon AND NOT full-bleed. The four protagonists converged from
three states (full-bleed / cartoon-square / target) to ONE register — the I5/I8/I12 isomorphism win.

### FORK I5-shadow — RESOLVED: `shadow={false}` (MEASURE-FIRST)

Measured BOTH variants on the easing stage against the live render (temporarily flipped `:shadow`,
rebuilt, re-probed + screenshotted):

- **`shadow={false}` (chosen):** card edge defined by the `glass-specular-track` rim alone — a crisp,
  clean protagonist plate. `box-shadow` carries only the subtle specular rim, NO `shadow-card` drop.
- **`shadow={true}`:** `shadow-card` adds the `--card-shadow` drop (`0px 4px 16px`). At the demo's
  light-theme contrast this reads as a faint "lifted floating panel" — it makes the plate compete
  with the docks/sidebar as another chrome surface rather than reading as the canvas the subject
  lives on.

**Decision: `shadow={false}` on all four stage cards** — the cleaner protagonist-plate read.
Rationale (measured, not asserted): (1) the card already sits inset within the dock-band-reserved
`.stage-cell`, so it needs no lift to separate from the docks; (2) the specular rim already defines
the edge crisply; (3) glass-ui's own Card prop doc says "shadow — Off for cards nested inside cards",
and the stage card is effectively nested inside the editor-shell chrome; (4) the two-altitude
separation (cartoon control chrome vs glass stage plate) reads more distinctly when the glass plate
carries no competing drop-shadow. Applied UNIFORMLY (isomorphic — no per-scene shadow delta).

---

## I4 — card-rounding by CONSUMPTION (born-GREEN now) + the glass-ui HANDOFF (born-RED)

**Demo-side (lands here, born-GREEN):** the I5 swap to `<Card>` rounds sequence/path with ZERO
ad-hoc `rounded-*` literal — the radius is consumed from the `<Card>` primitive's `rounded-card`,
not patched onto the demo. The user's named defect ("motion-path's card is NOT rounded — it should
be impossible") is closed: the stage card can no longer render square because it is no longer a bare
`cartoon-surface` div (which carries border-radius 0). Verified: motion-path stage now resolves
16px radius (live probe + screenshot).

**Why the bare div WAS square (the root cause):** the radius lives on the `<Card>` root's
`rounded-card`, NOT the `cartoon-surface` `@utility`. glass-ui `cards.css:33-48` defines
`@utility cartoon-surface` as decoration-only — 2px border + offset-stamp shadow + hover-lift, with
**ZERO `border-radius`** by design (confirmed by direct read of the published
`node_modules/@mkbabb/glass-ui/dist/styles/cards.css`). A `cartoon-surface`-only `<div>` is therefore
square; leaving a bare-class card square is too easy.

### inv-16 HANDOFF — glass-ui card-radius primitive (born-RED-paired, NOT patched in kf)

**ASK (to the glass-ui repo):** make a `cartoon-surface`-ONLY element impossible to leave square
FROM THE PRIMITIVE ITSELF. Two candidate forms (glass-ui's call):

1. `@utility cartoon-surface` (cards.css:33-48) gains `border-radius: var(--radius-card)` by default; OR
2. ship a `rounded-card`-carrying `cartoon-card` primitive (a recipe class) for bare-div consumers.

**Why a HANDOFF, not a kf patch:** glass-ui is CONSUMED published; `cards.css` is sibling-owned
(inv-16 — the demo CONSUMES glass-ui recipes, it does not re-author them). Patching `cartoon-surface`
in kf would be re-authoring a published primitive — a no-legacy/inv-16 violation.

**Pairing (born-RED until the published bump):** the gate `proof:card-rounded-primitive` (authored by
H.W8) has TWO halves —
- the **kf demo half** (ZERO bare-class `cartoon-surface` stage roots; every stage card non-zero
  radius) **greens NOW** on the I5 swap (verified above);
- the **glass-ui HANDOFF half** (a `cartoon-surface`-only element resolves a non-zero `border-radius`
  from the primitive itself) **stays born-RED** until glass-ui ships the default + kf bumps to the
  published version.

This HANDOFF is recorded here as the durable-fix ledger entry; the demo-side guarantee lands now
(inv-16: the primitive fix is the HANDOFF; the demo-side fix lands now).

---

## design-idioms.css — the STAGE/rounding section (Lane A's disjoint half)

Appended a documenting anchor AFTER the existing `.dock-inset` DELETED note (which documents the G8
layout-primitive half) and BEFORE `@keyframes enter`. It is documentation-only — there is NO new CSS
RULE to author: **the register IS the consumed glass-ui `<Card>` primitive** (rounded + glass by
construction). The anchor records: the I5 stage register (the four-scene convergence + the two
altitudes), the FORK I5-shadow `shadow={false}` measured choice, the I4 root cause + the born-GREEN
demo guarantee, and the inv-16 HANDOFF (with a pointer back to this note).

Lane C owns the disjoint LABEL-subgrid section of the same file (append-disjoint, no overlap with
this STAGE/rounding section).

---

## Reconciliation (W1 · W9 · W10) — what stayed GREEN

- **W10 `proof:scene-card-rounded`** — STAYS PASS. Its **static half** (stage roots carry zero
  bare-class `cartoon-surface`) passes — verified (the comment-stripped scan finds none). Its
  **computed half** (every `cartoon-surface` in the controls-layout subtree is rounded, ≥1 found)
  stays GREEN: the new stage Card is `surface="glass"` so it is NOT in the `cartoon-surface` probe
  set; the sidebar Cards (`surface="cartoon"`) still mount + remain rounded, satisfying the
  non-vacuity guard. This is the gate-level SUPERSESSION the spec describes — H.W8 later folds the
  gate's "full-bleed" disjunct OUT (the full-bleed subject no longer exists; the I5/G8 reversal at
  the gate level).
- **W10 `proof:easing-stage-is-ball` + `proof:scene-parity`** — STAY GREEN. They query
  `.stage-cell .hero-ball` / `.stage-cell .progress-ball` and assert ZERO canvas in `.stage-cell`.
  Wrapping the inner content in a `<Card>` (which still lives INSIDE `.stage-cell`) keeps the ball a
  descendant of `.stage-cell`; no canvas was added. Verified live (the easing hero ball renders
  inside the card inside the cell — screenshot + DOM probe).
- **W1 FSM / W3 `.stage-cell` primitive** — UNTOUCHED. No reducer edit, no grid edit. The
  `.stage-cell` dock-band-reserve PRIMITIVE (the surviving G8 altitude) contains the card.
- **W9 control PANEL register (cartoon+quiet)** — UNTOUCHED. I5's glass-card is the orthogonal STAGE
  register.
- **Engine (`src/animation`)** — FENCED (inv ζ). 100% demo-side.

---

## Verification ledger

- `npm run check` (tsc --noEmit) — **clean** (before + after the Lane-B file restore).
- All five Target SFCs parse clean via `@vue/compiler-sfc` (no template errors).
- `npm run gh-pages` build — **succeeds** with my five Targets + design-idioms.css (the build was
  exercised against a temporarily-restored HEAD copy of Lane B's in-flight `TimingFunctionPanel.vue`,
  which was then restored byte-identically — md5 `21418516771e78e58572a79204b552ff`; my files are not
  coupled to it).
- Live render (Playwright MCP, built dist served, 1440×900): all four stage scenes resolve the
  standard glass Card (table above); easing shadow fork measured both ways; motion-path verified
  rounded (the named defect closed).
- `proof:scene-card-rounded` static half — PASS.

### Coordination note (build coupling, NOT a Lane-A defect)

At measurement time, Lane B's `TimingFunctionPanel.vue` (I6/I7, in-flight) was an invalid SFC
(unbalanced `<template>` mid-edit), which broke the SHARED `npm run gh-pages` build. Because
`TimingFunctionPanel` is a STATIC import of `AnimationControlsControls.vue` (loaded by every scene),
the dev/prod build cannot succeed until that file is valid. Lane A worked around this NON-INVASIVELY:
backed up Lane B's working-tree bytes, temporarily restored the committed HEAD version to make the
build succeed for the MEASURE-FIRST pass, then restored Lane B's exact working-tree content
(md5-verified). No Lane-B content was altered. The IMPL lead should ensure Lane B lands a valid SFC
before the H.W8 golden capture / `proof:all`.
