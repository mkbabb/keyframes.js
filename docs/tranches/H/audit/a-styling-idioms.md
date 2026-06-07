# Tranche H — Styling-Idiom Deep Audit (lane `a-styling-idioms`)

**Scope.** The demo styling-idiom surface on `tranche-h-dev` (kf 4.1.0 + all of
Tranche G), extending the D.W2 design-language-localization and the G.W10 post-F
finishing sweep: isomorphism, tokenization, **the design-idioms-layer OWNERSHIP
contract**, arbitrary values, `!important`, `@apply`, the φ-ladder leaf-tail. The
charge: *what idiom drift remains POST-G?* Grounded at `file:line` (source greps,
`demo/*/dist/` build artifacts excluded) + LIVE observation against the running demo
(`http://localhost:5174/`, Playwright computed-style reads). Read-only — zero source
edits.

**Method.** Read the G styling charter + record (`audit/a-styling.md` §1–§8,
`waves/G.W10.md`), confirmed **G.W10 landed** (`.status-badge` / `.code-token` /
`--controls-pane-width` / `--mask-fade` all promoted in `design-idioms.css`,
`proof:idioms` clauses 1–8 all GREEN — re-ran, PASS). Then diffed the LIVE demo
against the OWNED-IDIOMS contract: which glass-ui idioms does the demo *reference*
that `proof:idioms` clause-1 does NOT cover (the residual D.W2 rent), and which of
those resolve to **nothing**. Drove the OBSERVED DEFECTS (D2/D14 specular-radial,
D6 dot-fade, D7 φ-typography, D3 easing-editor) through the styling-idiom lens to
root-cause the CSS half of each.

**Headline.** **The styling surface remains ~90% SOTA and the G.W10 sweep genuinely
closed the post-F re-fork class — but the deep audit found the D.W2 OWNED-IDIOMS
contract has a real BLIND SPOT, and it is the styling-idiom root cause of three of
the user's defects.** `proof:idioms` clause-1 owns exactly the `--rainbow-*` /
`--color-gold` / `.scale-on-hover` / `.gold-shimmer` / `@keyframes enter` family —
the idioms D.W2 happened to enumerate. But the demo *references FOUR MORE glass-ui
idioms it does not own*, and **two of them resolve to NOTHING**:
**`icon-sm`/`icon-md`/`icon-lg`/`icon-xs` are 61 silent no-op classes — defined
nowhere (not demo, not glass-ui), every icon paints Lucide's default 24px** (LIVE:
`anyIconRuleInStylesheets: false`, all three compute `24px × 24px`); and the D2/D14
**radial-blur is the demo's `glass-specular-track` pointer-seam never wired** (LIVE:
12 specular hosts, 0 with `--mouse-x`/`--mouse-y`, so the catch-light pins centered
and blooms on hover). Plus `depth-text` + `text-mono-caption` are real glass-ui-grace
rents (used 2 + 20 demo files, demo-owned in zero). The residual is **one shape:
the OWNED-IDIOMS contract under-enumerated its membership** — exactly the D.W2 rent,
surviving in the idioms D.W2 did not list. The fix is a contract EXTENSION + two
genuine fixes (icon-sizing idiom; specular pointer-seam wiring), gated by extending
`proof:idioms` clause-1's membership to the full referenced-idiom set.

---

## §1 — `icon-sm` / `icon-md` / `icon-lg` / `icon-xs` are 61 SILENT NO-OP classes `[HIGH — SHIP-in-H]`

**The single largest idiom-ownership gap in the demo, and it has shipped silent the
entire time.** The demo applies an icon-sizing idiom — `icon-sm` (×34), `icon-md`
(×13), `icon-lg` (×11), `icon-xs` (×3) = **61 callsites across the demo** — that is
**defined NOWHERE**. Not in `design-idioms.css`, not in `style.css`, not in any
glass-ui stylesheet, and (git-confirmed) never authored as a CSS rule in repo history.

- **LIVE PROOF (Playwright, `http://localhost:5174/#/easing`).** Scanned every loaded
  stylesheet: `anyIconRuleInStylesheets: false` — no rule with a `.icon-(sm|md|lg|xs)`
  selector exists. The three sizes all compute IDENTICALLY: `icon-sm` → `24px × 24px`,
  `icon-md` → `24px × 24px`, `icon-lg` → `24px × 24px`. That `24px` is Lucide's
  default `<svg width="24" height="24">` attribute — **the class contributes zero
  CSS; the icons fall back to the vendored attribute default and every "size" renders
  the same.**
- **Source anchors.** e.g. `TimingFunctionPanel.vue:10` `<ArrowLeft class="icon-sm" />`,
  `:28` `<CopyButton class="scale-on-hover icon-md" .../>`. The idiom is sprinkled
  through the whole control suite expecting `xs < sm < md < lg` differentiation; it
  produces a flat 24px everywhere.
- **Why it is the headline.** This is a STRICTLY WORSE instance of the exact rent
  `design-idioms.css` exists to retire (`a-styling §8`: "demo REFERENCES an idiom
  everywhere but DEFINES it nowhere centralized"). `depth-text`/`text-mono-caption`
  at least resolve via the transitive glass-ui import; `icon-*` resolves to **literally
  nothing** — a 61-site idiom that is pure dead text in the class attribute. And
  `proof:idioms` clause-1 did not catch it because clause-1's membership is the
  hand-enumerated `--rainbow-*`/gold/`scale-on-hover` set, NOT "every idiom-shaped
  class the demo references."
- **Disposition.** **SHIP-in-H.** Define ONE icon-sizing idiom in `design-idioms.css`
  beside the other owned utilities — the idiomatic Tailwind shape is `@utility icon-sm
  { @apply size-4 } / icon-md { @apply size-5 } / icon-lg { @apply size-6 } / icon-xs
  { @apply size-3.5 }` (or `width`/`height` longhands on the `svg`), single-sourced and
  documented. The 61 callsites then resolve to a real, differentiated, demo-owned
  size. (Pick the sizes the design WANTS — the current uniform 24px is the accident,
  not the intent, so this is a NAMED visual delta, not isomorphic: the icons will
  finally differentiate. That is the correct fix, per the Mandate's "befitting named
  delta.")
- **Instrument.** Extend `proof:idioms` clause-1 (the OWNED-IDIOMS membership):
  `proof:idioms-style` greps every `\bicon-(xs|sm|md|lg)\b` reference in `demo/**`
  `.vue` and asserts each resolves to a `design-idioms.css` definition (the same
  resolve-or-red shape clause-1 uses for `--rainbow-*`). BITE: reds TODAY (61 refs,
  zero definitions); green once the idiom is owned. A future no-op idiom-class reds.
- **inv ε.** LIVE `anyIconRuleInStylesheets: false` + three `24px×24px` computed reads
  (`/#/easing`); 61 grep refs across 4 size names; `git log -S "@utility icon-sm"`
  empty (never authored).

---

## §2 — D2/D14: the radial-blur hover is the demo's `glass-specular-track` pointer-seam NEVER WIRED `[HIGH — SHIP-in-H + glass-ui-HANDOFF dock half]`

**Root-caused live. The "strange circular/radial blur on hover everywhere" (D2) is
NOT a glass-ui bug and NOT `design-idioms.css:263-269` (that is `.progress-dot`'s
conic ring, unrelated) — it is glass-ui's `glass-specular-track` opted onto the
demo's Cards WITHOUT the consumer pointer-position seam the idiom requires.**

- **The idiom (`node_modules/@mkbabb/glass-ui/dist/styles/glass-specular-track.css:1-105`).**
  A pointer-anchored moving specular: a `::before` paints `radial-gradient(circle at
  var(--specular-x) var(--specular-y), hsl(40 30% 100% / .55) 0%, … transparent 55%)`
  with `mix-blend-mode: screen`, opacity `--specular-intensity` (0.35 rest → 0.6
  hover → 0.85 active). The catch-light is meant to TRAVEL with the cursor — the
  consumer MUST write `--mouse-x`/`--mouse-y` onto the host (the documented seam,
  `glass-specular-track.css:19-22`: "the pointer-position WRITE … is the consumer's
  seam — DockIconButton wires it; Button glass + Card hover opt in").
- **LIVE PROOF (`/#/cube`).** 12 `glass-specular-track` hosts on the page (cards +
  dock buttons); **0 have `--mouse-x`/`--mouse-y` wired** (`hostsWithPointerSeamWired:
  0`). A visible Card's `::before` computes `background: radial-gradient(circle, …)`
  (no `at` position → the `var(--mouse-x, 50%)` floor → DEAD CENTER),
  `mix-blend-mode: screen`, `opacity: 0.35` at rest, `--mouse-x: (unset → 50% floor)`.
  On `:hover` the rule lifts intensity to 0.6. **Net: a static, dead-centered, white,
  screen-blended radial bloom that brightens on hover — exactly the user's "radial
  blur."** It appears "everywhere" because glass-ui's Card (the demo's panels, the
  header surfaces, the timeline card) all carry `glass-specular-track`, and the demo
  wires the seam on NONE of them.
- **D14 (the user's clarification).** "The glass is good; refine the specular-radial
  hover, reconcile with cartoon-shadow depth." Correct read: the specular idiom itself
  is right (a refined catch-light is the desired hover), it is just UNWIRED → it
  degrades to a centered bloom. The cartoon-shadow depth (D2's "should be cartoon
  shadows") is the SEPARATE depth idiom glass-ui ships as `cartoon-surface` +
  `--shadow-cartoon-{sm,md,lg}` (`cards.css:33`, `theme.css:319-321`) — the Memphis
  offset-stamp the demo ALREADY consumes correctly on the CSS editor
  (`CSSCodeEditor.vue:6` `cartoon-surface`, the C.W2 migration that "was CLOSED in
  Tranche C"). The reconcile: **wire the specular seam so the hover is a TRAVELLING
  catch-light (refined, D14), and let panels carry the cartoon-stamp depth at rest
  (D2) instead of relying on the centered-bloom-as-depth accident.**
- **Disposition.** **SHIP-in-H (demo half).** The demo owns the seam — wire a thin
  demo-local pointer-listener idiom (a `v-specular` directive or a `useSpecularTrack`
  composable that writes `--mouse-x`/`--mouse-y` percentages on `pointermove`) and
  apply it to the panels/cards that opt into specular-track. This is the IDIOMATIC
  fix: the demo OWNS the consumer side of the glass-ui contract (the same way it owns
  `--mouse-x` would be expected). Alternatively, if a card is NOT meant to track,
  drop `glass-specular-track` from it (don't opt in without the seam). **glass-ui-HANDOFF
  (dock half):** the dock-icon-button specular + the D5 dock lag are glass-ui's active
  AW tranche — TAG, do not patch in kf. (DockIconButton wires its own seam per the
  glass-ui comment; the CARD specular is the demo's unfilled seam.)
- **Instrument.** A `proof:idioms-style` visual lock + a DOM gate: assert every
  `.glass-specular-track` host in the demo either (a) has the pointer seam wired (a
  `v-specular`/composable attribute present) OR (b) is intentionally static (a named
  opt-out) — a host with specular-track and no seam reds. Pair with a Playwright
  visual lock: hover a panel, assert the `::before` specular center MOVES with the
  pointer (the `--specular-x` is not pinned to 50%). BITE: reds today on all 12 hosts.
- **inv ε.** LIVE `glass-specular-track.css:1-105` read; 12 hosts / 0 wired
  (`/#/cube`); centered `radial-gradient(circle, …)` + `screen` + `0.35` rest /
  `0.6` hover computed; `cartoon-surface` consumed at `CSSCodeEditor.vue:6`;
  `--shadow-cartoon-*` at `theme.css:319-321`.

---

## §3 — `depth-text` + `text-mono-caption` are glass-ui-grace RENTS the OWNED-IDIOMS contract does not cover `[MED — SHIP-in-H]`

**The same rent D.W2 retired for `--rainbow-*`/gold/`scale-on-hover`, surviving in
idioms D.W2 did not enumerate.** Two more glass-ui idioms the demo references heavily
but owns nowhere — they resolve ONLY by accident of the transitive glass-ui import,
and `proof:idioms` clause-1 does not assert them:

- **`depth-text`** (`utilities.css:231` in glass-ui — a 9-stop layered `text-shadow`
  drop-stamp). Applied on the LCP hero (`EditorStartScreen.vue:10,17`
  `class="depth-text"`, the headline typography). Demo-owned in ZERO files. The day
  glass-ui renames or drops it, the hero's depth-stamp silently flattens with no gate
  — the precise D.W2 failure mode, on the most prominent text on the page.
- **`text-mono-caption`** (`typography.css:378` in glass-ui — the mono caption rung).
  Used in **20 demo files** (the entire control suite's mono labels). Demo-owned in
  ZERO. The single most-referenced glass-ui idiom the demo does not own.
- **Why this rises now.** `a-styling §8` certified the OWNED-IDIOMS contract holds —
  but it certified it against the ENUMERATED set (`--rainbow-*`/gold/`scale-on-hover`/
  `gold-shimmer`/`enter`). The deep audit's contribution: the contract's MEMBERSHIP
  is hand-listed, so any idiom the demo adopts AFTER the enumeration (or that D.W2
  simply missed) is silently outside the gate. `depth-text` (hero) and
  `text-mono-caption` (×20) are exactly that — referenced everywhere, owned nowhere,
  ungated.
- **Disposition.** **SHIP-in-H.** Two sub-paths, both idiomatic:
  (a) **Own them** in `design-idioms.css` with glass-ui-matching values (isomorphic),
  the same motion D.W2 used for `.scale-on-hover`/`.gold-shimmer` — the demo's copy
  becomes authoritative + gate-able. This is the DRY-correct move for `depth-text`
  (a load-bearing hero idiom) and arguably `text-mono-caption`.
  (b) **OR** explicitly RECORD them as "consumed-from-glass-ui, intentionally not
  re-authored" (the `inv-16` carve `a-styling` already uses for `.rainbow-vivid`/
  `.rainbow-pastel`) — but then the gate must ASSERT they resolve from the glass-ui
  dep (a presence check), so a drop is caught. Either way the ungated silent rent is
  closed. Recommend (a) for `depth-text` (one place, load-bearing), the gated-consume
  carve for `text-mono-caption` (a pure typography rung better left glass-ui-owned,
  like `--type-caption`).
- **Instrument.** Extend `proof:idioms` clause-1's membership to the FULL referenced-
  idiom set: enumerate every idiom-shaped class the demo `<template>`s reference
  (`depth-text`, `text-mono-caption`, `icon-*`, `cartoon-surface`, `glass-*`) and
  assert each resolves to EITHER a demo-local definition OR a gated glass-ui carve.
  The contract stops being a hand-list and becomes "every referenced idiom is owned
  or carved." BITE: reds today on `depth-text`/`icon-*` (owned nowhere, no carve).
- **inv ε.** `depth-text` glass-ui def `utilities.css:231`; hero refs
  `EditorStartScreen.vue:10,17`; `text-mono-caption` glass-ui def `typography.css:378`,
  20 demo-file refs (grep); zero demo-local definition of either (grep
  `design-idioms.css` = 0).

---

## §4 — D6: the typing-dots (`dot-fade`) idiom broke when F.W16's WORD-split met the space-less `"..."` `[MED — SHIP-in-H]`

**Root-caused live. The "totally broken" typing dots are a styling-idiom regression:
the per-character stagger that made `"..."` read as typing dots was silently destroyed
when F.W16 refactored `AnimatedText` to a WORD-granular split for the hero a11y/balance
fix — and `"..."` has no spaces, so it collapses to ONE span.**

- **The break (`AnimatedText.vue:62-64,93-97`).** `words = text.split(/\s+/)` —
  for the ellipsis `"..."` this yields a SINGLE word `"..."`. The hero passes
  `class="dot-fade depth-text"` (`EditorStartScreen.vue:17`); with `inheritAttrs:false`
  those land on the one per-word `<span class="lift-down">` (`AnimatedText.vue:23-33`).
  So the single span carries `lift-down dot-fade depth-text` AND an inline
  `:style="{ animationDelay, animationDuration }"`.
- **LIVE PROOF (`/#/`).** The ellipsis span: `classes: "lift-down dot-fade depth-text"`,
  `inlineStyle: "animation-delay: 0s; animation-duration: 2.6s;"`,
  `animName: "dotFade-…"` (dot-fade's `animation` shorthand wins over `lift-down`'s),
  `opacity: 0.0085` (the whole ellipsis fading 0↔1 as ONE unit). **The three dots no
  longer fade in sequence — the entire `"..."` blinks together, and most of the time
  sits near-invisible.** The "typing dots" read (dot 1, then 2, then 3) is gone
  because there is no per-dot granularity left after the word-split.
- **The compounding idiom smell.** `.lift-down` and `.dot-fade` BOTH set the
  `animation` shorthand on the same element (`AnimatedText.vue:74` + `:95`) — a
  shorthand collision (only one `animation-name` survives), plus the inline
  `animation-duration` longhand partially overrides the shorthand. This is the
  brittle-cascade the styling layer should not have: two `animation` shorthands +
  an inline longhand fighting on one node.
- **Disposition.** **SHIP-in-H.** The idiomatic fix: make the dots their OWN
  primitive. `"..."` should NOT route through the word-split `AnimatedText` at all —
  give the hero a dedicated `.typing-dots` idiom in `design-idioms.css` that renders
  three `<span>`s (or `::before`/`::after` + one span) each with a staggered
  `dot-fade` `animation-delay`, so the stagger is structural and space-independent.
  This decouples the dots from the word-granular hero text (which F.W16 correctly made
  word-split for `text-wrap: balance`) and ends the dual-`animation`-shorthand
  collision. Keep the PRM guard (`AnimatedText.vue:113-121`).
- **Instrument.** A `proof:idioms-style` / Playwright visual lock: assert the three
  ellipsis dots have DISTINCT `animation-delay` values (a real stagger), and that no
  single element carries two competing `animation` shorthands. BITE: reds today (one
  span, one shared `dot-fade`, opacity collapsing together).
- **inv ε.** `AnimatedText.vue:62-64` (word split), `:74`/`:95` (dual `animation`
  shorthand), `:23-33` (inline longhand on the span); LIVE single `"..."` span,
  `dotFade` name, `opacity 0.0085` (`/#/`).

---

## §5 — D7: the hero is correctly φ-laddered but sits one rung below its weight; the φ-ladder is otherwise CLEAN `[LOW–MED — SHIP-in-H sizing, RECORD ladder]`

**The φ-typography audit (the lane's leaf-tail charge) is GREEN on hygiene — the
defect is a single rung selection, not idiom drift.**

- **φ-ladder hygiene is exemplary (already-SOTA — manufacture NO work).** LIVE census
  across `demo/**` `.vue`: **ZERO raw `text-sm`/`text-xs`/`text-base` leaf-tail**
  (`proof:idioms` clause-2 green, re-confirmed), **ZERO raw `text-[Npx]` arbitrary
  font-sizes**, and consistent named-rung usage: `text-small` ×29, `text-body` ×12,
  `text-heading` ×10, `text-subheading` ×6, `text-title` ×2, `text-display-4` ×1,
  `text-display-2` ×1, `text-display` ×1, `text-caption` ×1. Every size routes the
  glass-ui φ-ladder (`typography.css:102-123`, `--type-*` = √φ/φ/φ^(3/2)/…). The
  `style.css:41` `--font-display` Instrument-Serif binding is principled. The D.W2/
  G.W10 leaf-tail discipline HOLDS.
- **The D7 defect (sizing, not drift).** The hero "Select an animation"
  (`EditorStartScreen.vue:6`) is `text-display-4` — φ^(7/2), `clamp(3.33rem, …,
  5.382rem)`. The user wants it "properly sized + LARGER, using our GOLDEN (φ-ladder)
  typography." glass-ui ships TALLER rungs purpose-built for a hero:
  `text-display-hero` (φ^5, peak 287px, `typography.css:122,190`) and the tunable
  `text-hero` recipe (`typography.css:166-173`, `--text-hero-size` knob). The hero
  should step UP the SAME ladder — `text-display-hero` or `text-display-5` — staying
  on-φ, just at the rung its prominence earns.
- **Disposition.** **SHIP-in-H** (the rung bump — a NAMED size delta, one class swap
  `text-display-4` → `text-display-hero`/`text-display-5`, still φ-ladder). **RECORD**
  the ladder hygiene (already-SOTA; do not manufacture work). Note: the hero is the
  LCP node with a metric-matched fallback (`style.css:60-` E.W11.S5) — a larger rung
  must keep the CLS-stable fallback box; the `clamp()` rungs already handle this.
- **Instrument.** Folds under `proof:idioms` clause-2 (leaf-tail) + a Playwright
  visual lock on the hero rendered size (assert it resolves a `--type-display-*` rung,
  not an arbitrary px). BITE: a future raw-px hero reds.
- **inv ε.** Hero `text-display-4` at `EditorStartScreen.vue:6`; ladder rungs
  `typography.css:102-123,166-194`; census grep (zero leaf-tail, zero arbitrary
  font-size).

---

## §6 — D3: the easing-editor sizing/header are layout deltas, NOT idiom drift `[LOW — RECORD / cross-lane]`

**Named for completeness; the styling-IDIOM axis is clean here — the D3 defects are
component layout, owned by the frontend/layout lane.** The cubic-bézier header
(`TimingFunctionPanel.vue:19`) correctly uses `text-heading` (the φ rung); D3's "header
should be LARGER" is the same rung-bump shape as §5 (→ `text-title`, on-ladder). The
"too massive" canvas is `EasingCurveCanvas.vue:269-273` `min-height: 140px;
aspect-ratio: 1` (a forced square); the "inner border touching the header" is the
`GlassPanel variant="wash"` plate (`EasingCurveCanvas.vue:4`) inside a `CardHeader
p-0 pb-1` (only 4px gap, `:18`). The SVG axis-label `font-size: 0.055px`
(`:344`) and the stroke widths are befitting SVG user-space magic numbers (like the
cube's `1000vw` axis line, `a-styling §8`), NOT idiom drift.

- **Disposition.** **RECORD** (cross-lane to frontend/layout): bump the header rung
  (§5-shape), relax the canvas square (`aspect-ratio` → an `height` cap or a smaller
  `min-height`), add `CardHeader` bottom gap so the plate edge clears the title. No
  idiom-ownership concern.
- **inv ε.** `TimingFunctionPanel.vue:19` (header rung), `EasingCurveCanvas.vue:4,269-273,344`.

---

## §7 — Where the styling-idiom surface is ALREADY-SOTA (verified — manufacture NO work)

These are confirmed exemplary post-G; calling them gaps would be manufactured deficit:

- **G.W10 genuinely landed and holds.** `.status-badge` (parameterized,
  `design-idioms.css:344-365`, AA-lineage single-sourced), `.code-token`
  (`:374-377`), `--controls-pane-width: 400px` (`:106`), `--mask-fade: 2.5rem`
  (`:112`) all promoted; `proof:idioms` clauses 1–8 re-ran **PASS** (scene-refork:
  zero, the coupled 400px + two-named fade tokenized, `h-fit`). The post-F re-fork
  class `a-styling §1–§6` named is CLOSED.
- **The OWNED-IDIOMS layer is one localized, documented, gated file.**
  `design-idioms.css` (414L) imported immediately after the glass-ui cascade
  (`style.css:8`); the enumerated family (`--rainbow-*`/gold/`scale-on-hover`/
  `gold-shimmer`/`focus-ring`/`progress-*`/`status-badge`/`code-token`/`dock-inset`/
  `@keyframes enter`) is all owned + documented. The §1/§3 findings are the contract's
  MEMBERSHIP being under-enumerated — not the layer being absent.
- **Zero `!important`, zero SFC `@apply`.** LIVE grep: zero `!important` in
  `demo/**` source; zero `@apply` in component SFCs (the one `@apply` is `.progress-bar`
  in the owned layer, `design-idioms.css:236`). Cascade managed by `@layer` + `:where()`.
- **Arbitrary-value census is clean.** Non-`var()`/non-`data-[]` arbitraries are all
  befitting one-offs: `grid-cols-[auto_1fr]` ×3, `translate-x-[calc(100cqw_-_100%)]`,
  `scale-x-[-1]`, `min-h-[20vh]`/`min-h-[25vh]`, `max-w-[90vw]`,
  `transition-[max-height,opacity]`, `grid-rows-[…]` — local, non-recurring, idiomatic.
  No `text-[Npx]`, no raw `400px`/`z-[N]` survivor (G.W10 + brittleness gates hold).
- **φ-ladder leaf-tail SWEPT** (see §5): zero `text-sm`/`xs`/`base`, zero arbitrary
  font-sizes, consistent named rungs.
- **`cartoon-surface` consumed correctly.** The Memphis depth idiom glass-ui owns is
  applied idiomatically on the CSS editor (`CSSCodeEditor.vue:6`) — the C.W2 migration
  the user remembers; it is NOT regressed there (the D2 "regression" is the SEPARATE
  unwired specular, §2).

---

## Disposition summary

| # | Finding | Sev | Disposition | Class |
|---|---------|-----|-------------|-------|
| 1 | `icon-sm/md/lg/xs` — 61 SILENT no-op classes, every icon paints default 24px (LIVE: no rule, no glass-ui def, never authored) | **HIGH** | **SHIP-in-H** | OWNED-IDIOMS contract membership gap (worst case: resolves to NOTHING) |
| 2 | D2/D14: radial-blur hover = `glass-specular-track` pointer-seam never wired (LIVE: 12 hosts, 0 wired → centered screen bloom); reconcile with `cartoon-surface` depth | **HIGH** | **SHIP-in-H** (demo seam) · **glass-ui-HANDOFF** (dock half, D5) | demo owns the consumer side of a glass-ui idiom contract; unfilled |
| 3 | `depth-text` (hero) + `text-mono-caption` (×20) — glass-ui-grace rents the OWNED-IDIOMS gate does not cover | MED | **SHIP-in-H** (own `depth-text`; gated-consume carve `text-mono-caption`) | the D.W2 rent in idioms D.W2 did not enumerate |
| 4 | D6: `dot-fade` typing dots broke — F.W16 word-split collapsed `"..."` to one span; dual `animation` shorthand collision (LIVE: one span, opacity 0.0085) | MED | **SHIP-in-H** | regression — promote a `.typing-dots` stagger primitive |
| 5 | D7: hero `text-display-4` sits one φ-rung below its weight; φ-ladder otherwise CLEAN | LOW–MED | **SHIP-in-H** (rung bump) · **RECORD** (ladder SOTA) | named size delta, on-ladder |
| 6 | D3: easing-editor sizing/header — layout deltas, not idiom drift | LOW | **RECORD** (cross-lane frontend/layout) | component layout |
| 7 | G.W10 landed · one owned layer · 0 `!important` · 0 SFC `@apply` · clean arbitraries · φ-ladder swept · `cartoon-surface` correct | — | **RECORD** (already-SOTA) | verified exemplary |

**Cross-repo hand-offs.** §2 dock-specular + D5 dock lag → **glass-ui-HANDOFF** (its
active AW tranche — TAG, do not patch in kf). All other findings are demo-CSS concerns
in the demo's own idiom layer. No value.js / parse-that surface implicated.

**The one-paragraph thesis.** The styling surface is ~90% SOTA and G.W10 genuinely
closed the post-F re-fork class (`proof:idioms` 1–8 re-ran PASS). The deep audit's
contribution: **the D.W2 OWNED-IDIOMS contract has a real, demonstrated blind spot —
its membership is a hand-enumerated list (`--rainbow-*`/gold/`scale-on-hover`/…), so
every idiom the demo references OUTSIDE that list is ungated, and two of them
(`icon-*`, the demo-side `glass-specular-track` seam) resolve to a broken/empty
result that is the styling-idiom root cause of the user's defects.** `icon-sm/md/lg`
are 61 silent no-ops painting a flat 24px (§1, LIVE-proven); the D2/D14 radial-blur is
the specular catch-light pinned centered because the demo never wired the pointer seam
(§2, LIVE-proven); `depth-text`+`text-mono-caption` are glass-ui-grace rents (§3); the
D6 dots broke when F.W16's word-split met the space-less `"..."` (§4, LIVE-proven). The
SHIP is to OWN/wire the four under-enumerated idioms and **extend `proof:idioms`
clause-1 from a hand-list to "every referenced idiom resolves to a demo-local
definition OR a gated glass-ui carve"** — the same instrument, membership completed, so
the next un-owned idiom-class reds the day it is referenced. Not a rebuild; the D.W2
contract's enforcement extended to the idioms it never enumerated.
