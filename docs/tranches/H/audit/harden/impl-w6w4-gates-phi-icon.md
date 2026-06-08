# H.W4 gate lane — `proof:phi-leaf-zero` + `proof:icon-idiom` (the φ-hero chronic SYSTEM-property gate + the 61-no-op icon lock)

**Branch:** `tranche-h-impl` · **Status:** both gates landed in-tree (NOT committed) · born-RED→GREEN verified · each clause mutation-tested to BITE · tsc-clean · `proof:ci-coverage` GREEN.

**Lane scope.** The two SYSTEM-property gates the W6→W4 shared-file lane left to author:
`proof:phi-leaf-zero` (the φ-hero chronic gate H.W8 S3 cites BY NAME, CH-2/M1) +
`proof:icon-idiom` (the 61-no-op icon-sizing lock, a-styling-idioms §1). The W4 SOURCE
side (the hero `text-display-mega` bump, the L1/L2 sweep, the `@utility icon-*` family) is
already landed in-tree (see `impl-w6w4-w4.md`); this lane authors the GATES that bite that
source, matches the icon shape the W4 lane chose, and wires both into the gate regime.

Both gates are STATIC (grep + source-shape parse — no browser, no build), so they ride the
`demo-smoke` job's static-gate block beside `proof:idioms` (no `KF_REQUIRE_BROWSER`), and
mirror the existing harness idioms exactly: the resolve-or-red shape from `proof:idioms`
clause-1, the anchored-rule-open + `blankComments` posture from `proof:no-dup-utility`.

---

## `proof:phi-leaf-zero` (`scripts/proof-phi-leaf-zero.mjs`)

The single citable gate asserting BOTH halves of the M1 system property in one gate — so
the chronic cannot close while either half is unmet (the re-paper the `proof:hero-rung`-
alone close would have left open).

### The two halves (both load-bearing)

- **HALF 1 — the leaf-tail SWEEP (zero raw rungs).** Two sub-sweeps over the demo SOURCE
  roots `demo/{@,app,easing,spring,sequence,motion-path}` (`.vue` + `.css`):
  - **1a — raw Tailwind rungs:** `\btext-(xs|sm|base|lg|xl|2xl|4xl|6xl|8xl)\b` = 0.
    Word-bounded so `.text-display-4` (a SEMANTIC φ rung) + `text-title`/`text-subheading`
    do NOT match — only the raw sizing utilities the φ-ladder retired.
  - **1b — bare numeric font-size:** `font-size:\s*[0-9.]` = 0, EXCLUDING SVG user-space.
- **HALF 2 — the hero on the TOP φ rung.** The start-screen `<h1>` carries
  `text-display-mega` (the audacious top tier, `≥ --type-display-mega`). A STATIC
  source-shape check (per CP-HIGH-3 / WV-W4-HIGH-1: "≥ --type-display-mega" compares two
  fluid `clamp()` tokens at runtime — unstable at narrow widths — so the static half asserts
  the resolved class is the TOP rung; the px-floor half is `proof:hero-rung`'s browser
  clause, a sibling W4 gate). Also reds on a regression to a LOWER rung
  (`text-display-{1..5}|audacious|hero`) — verified the glass-ui ladder order is
  `1<2<3<4<5<audacious<hero<mega` (typography.css), so `mega` is the peak.

### The exclusion set the "residual = 2, NOT 37" rests on (WV-W4-HIGH-1)

- `dist/` — the git-ignored build output that inlines glass-ui's compiled `.text-*` rungs +
  every literal font-size (the ~150 noise a naive demo-root grep returns, WV-W4-LOW-2). A
  source-shape gate reads SOURCE.
- vendored `ui/` shadcn (`demo/@/components/ui/`) — not demo-authored surface; its `text-sm`
  rungs are the upstream shadcn shape. **This is the exclusion the residual=2 rests on:** 37
  materializes ONLY by counting the vendored `ui/` the gate excludes; with `ui/` counted the
  gate could NEVER green (W4 swept only L1+L2).
- **`.svg` user-space font-size** — the L4 NOT-A-DEFECT
  `EasingCurveCanvas.vue .axis-label { font-size: 0.055px }`. The `.axis-label` is applied to
  `<text>` inside `<svg :viewBox="`0 … 1 …`">` — a fraction of a USER-SPACE unit, not a
  typographic px rung. Excluded STRUCTURALLY (not by a hard-coded line number): the gate
  excludes a font-size only when its selector is `.axis-label` AND the file hosts a `viewBox`
  whose origin is a bare `0` unit AND `.axis-label` is applied only to `<text>` (never an HTML
  tag). A `.axis-label` re-used on an HTML element, or a font-size on any other selector,
  still bites. (The viewBox is a Vue `:viewBox` template-literal binding — the regex allows the
  `"`+backtick wrapper run before the `0 ` origin.)

### Live residual (verified at author time)

L1 `AnimationMenuBar.vue:102` `text-xl`→`icon-lg` and L2 `MotionPathTarget.vue:119`
`font-size:1.25rem`→`var(--type-subheading)` are BOTH already swept in-tree. The only
non-`dist`/`ui` font-size literal is the SVG `.axis-label` (excluded). So the gate is GREEN
on both halves on the landed tree.

### Born-RED→GREEN — every clause BITES (mutation-tested)

| Mutation | Clause that reds | Result |
|---|---|---|
| re-introduce `text-xl` (re-grow L1) | 1a raw rungs | RED — names the site |
| add `font-size: 99px` to a non-SVG `.hero-display` rule | 1b bare font-size | RED — names the site |
| revert hero `text-display-mega`→`text-display-4` | HALF 2 | RED — "LOWER rung text-display-4, a φ-rung regression" |
| restore | — | GREEN |

Both halves are load-bearing: reverting EITHER reds the gate (the M1 escape — the chronic
closes while raw rungs linger, OR the hero stays middle-rung — is structurally locked).

---

## `proof:icon-idiom` (`scripts/proof-icon-idiom.mjs`)

The 61-no-op lock — matches the icon shape the W4 lane chose: the FIRST `@utility` family in
`design-idioms.css`, `@apply size-{3.5,4,5,6}` + a nested `& svg { @apply size-N }` cascade.

### The three clauses (each BITES)

1. **RESOLVE-OR-RED** — every `\bicon-(xs|sm|md|lg)\b` reference in demo `.vue` (excluding
   `ui/` + `dist/`) resolves to an `@utility icon-N { … }` (or `.icon-N { … }`) definition in
   `design-idioms.css`. The SAME resolve-or-red shape `proof:idioms` clause-1 uses for the
   `--rainbow-*` family — the references ARE the contract, derived LIVE (no hand-maintained
   list). Live count at author time: **62 refs** (xs×3 / sm×34 / md×13 / lg×12) — the W4 note
   said ~61; one drifted, which is exactly why the gate derives the set live rather than
   hard-coding 61.
2. **DIFFERENTIATE (xs < sm < md < lg)** — the four defined sizes are STRICTLY INCREASING by
   their `@apply size-N` spacing factor (3.5 < 4 < 5 < 6 → 14px < 16px < 20px < 24px). A
   flake-free, browser-free computed-size check: `size-N` is N×0.25rem on the box edge, so a
   strictly-increasing factor IS a strictly-increasing computed px (the W4 built-CSS
   verification confirmed each rule emits `width:calc(var(--spacing) * N)`). This is the
   contract's "computed size(icon-xs)<sm<md<lg differentiation" clause — the uniform-24px was
   the accident the family exists to retire.
3. **SVG CASCADE (WV-W4-MED-1)** — each defined `@utility icon-N` carries the nested
   `& svg { @apply size-N }` (or `[&_svg]:size-N`) rule, so a WRAPPER callsite shrinks its
   inner 24px Lucide glyph, not just the box. The gate SAMPLES a real WRAPPER callsite
   (`<CopyButton class="icon-md">`, `TimingFunctionPanel.vue:41`) AND a direct-glyph callsite
   (`<X class="icon-xs">`, `KeyframeTimeline.vue:96`) from the LIVE refs — both must resolve
   through the cascade.

The definition parser is brace-matched (reads the WHOLE rule body incl. the nested `& svg`),
tolerant of BOTH authoring shapes (`@utility icon-N` OR a `.icon-N` rule, per WV-W4-MED-4 —
the W4 lane chose `@utility`, which the gate matches).

### Born-RED→GREEN — every clause BITES (mutation-tested)

| Mutation | Clause(s) that red | Result |
|---|---|---|
| delete the `@utility icon-md` definition | resolve-or-red + svg-cascade(wrapper) | RED — "icon-md ×13 refs resolve to NO def" |
| make `icon-md` == `icon-sm` (size-4 == size-4) | differentiate | RED — "NOT strictly increasing: …=size-4 < …=size-4" |
| drop the `& svg` cascade from `icon-md` | svg-cascade | RED — "WRAPPER callsite leaves the inner 24px svg" |
| restore | — | GREEN |

Pre-fix (the born-RED state the gate was authored against): all 62 refs resolve to ZERO defs
+ all compute identical 24px — clause 1 + clause 2 both red. Green only once the differentiated,
SVG-cascading `@utility` family is owned (which W4 landed).

---

## Wiring

- **`package.json`** — added `"proof:phi-leaf-zero"` + `"proof:icon-idiom"` after
  `proof:no-orphan-specular` (the last H.W static demo-source gate); both also added to the
  `proof:all` local chain after `proof:idioms` (the static demo-source cluster).
- **`.github/workflows/ci.yml`** — both wired into the `demo-smoke` job's static-gate block
  immediately after `proof:idioms` (no `KF_REQUIRE_BROWSER` — they are static grep/source-
  shape gates, like `proof:idioms` itself).
- **`proof:ci-coverage`** — GREEN: all 55 `proof:*` gates (now incl. both) are invoked in CI.

## Verification summary

- `node scripts/proof-phi-leaf-zero.mjs` → PASS (3 clauses green); 3 mutations each red the
  exact clause; restore → green.
- `node scripts/proof-icon-idiom.mjs` → PASS (4 ✓ incl. both cascade samples); 3 mutations each
  red the exact clause(s); restore → green.
- `node scripts/proof-ci-coverage.mjs` → PASS (55 gates covered).
- `npm run check` (`tsc --noEmit`) → CLEAN (the gates are `.mjs`; no TS source touched).
- `ci.yml` parses as valid YAML.

## Files touched (4)

1. `scripts/proof-phi-leaf-zero.mjs` — NEW (the φ-hero chronic SYSTEM-property gate, both halves).
2. `scripts/proof-icon-idiom.mjs` — NEW (the 61-no-op icon-sizing lock, 3 clauses).
3. `package.json` — 2 script entries + 2 entries in the `proof:all` chain.
4. `.github/workflows/ci.yml` — 2 steps in the `demo-smoke` static-gate block.
