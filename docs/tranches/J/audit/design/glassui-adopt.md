# TRANCHE-J — GLASS-UI ADOPTION MAP (lane: glassui-adopt)

Audit of glass-ui 3.9.0's surface vs keyframes.js demo consumption. READ-ONLY —
proposals only. Every item names the local code it would replace (net-deletion is
the win) and grounds the visual difference in a screenshot where one would show.

Method: read `glass-ui/src/index.ts` (root barrel), the 23 `src/styles/*.css`
sheets, and `src/components/{ui,custom}`; grep the demo for glass-ui imports +
classes; read `demo/@/styles/{style,brand,design-idioms}.css` (the three local
sheets, 56KB total). The demo's `design-idioms.css` is an explicit, well-documented
"own-what-you-depend-on" layer — much of what it owns is *correctly* owned (tokens,
the rainbow family). The gaps below are where it hand-rolls a COMPONENT-shaped thing
glass-ui ships as a primitive.

---

## Consumption baseline (what kf already adopts well)

kf consumes glass-ui broadly and idiomatically already, so this is refinement, not
rescue:
- Surfaces: `Card`, `cartoon-surface`, `rounded-card`, `glass-resting`, `dock-panel`.
- Typography: `text-display-mega` (hero), `text-title/heading/subheading`,
  `text-mono-caption`, `dock-label`, `--font-display`=Instrument Serif via `@theme`.
- Dock: `StatusDot` (menubar + ChromeDock), the dock subpath primitives.
- Dark mode: `useGlobalDark` (App + CSSCodeEditor + useHighlightCSS) — wired correctly.
- Transitions: glass-ui's `--spring-*`, `--duration-*`, `--ease-*` tokens are
  referenced in scoped styles (good token discipline); `--spring-snappy` was
  deliberately re-aliased to the canonical `--spring-smooth` (style.css:173).

The deltas below are the under-used surface.

---

## (a) glass-ui idioms kf does NOT use but SHOULD (net-deletion wins)

### A1 — `MetricBadge` / `MetricPill` for the five hand-rolled numeric readouts  [ADOPT · P1-shaped reuse]
Every stage scene paints a live math readout as a bare
`<span class="text-mono-caption text-muted-foreground tabular-nums whitespace-nowrap">`
with manual `toFixed()` interpolation. glass-ui ships `MetricBadge` (and the
`MetricPill` composition over it) for EXACTLY this: an `amount`/`unit`/`label` shape,
a `size` ladder (`sm→xl`, mono-caption→mono-prose), `color`, and `placeholder`.
- `easing/EasingTarget.vue:24-26` — `f(0.95) = 0.999`
- `spring/SpringTarget.vue:20-21` — `x = 1.000 · v = 0.00`
- `spring/SpringTarget.vue:68` — sampled value readout
- `sequence/SequenceTarget.vue:15-16` — `stagger × 5 · progress 0%`
- `sequence/SequenceTarget.vue:95-96` — `master playhead 0.000`
- `motion-path/SequenceTarget` siblings (grep: 6 `toFixed` readouts across these targets)

Evidence: `easing-desktop-open.png` (header `ease  F(0.95) = 0.999`),
`spring-desktop-open.png` (`SpringProgress  X = 1.000 · V = 0.00`),
`sequence-desktop.png` (`Sequence  STAGGER × 5 · PROGRESS 0%`, `master playhead 0.000`).
Proposal: replace each with `<MetricBadge :amount unit label size>`. Deletes the
five `text-mono-caption…tabular-nums` span recipes; the `amount` slot can later carry
`AnimatedDigit` for a free metric-swap roll (item A2). Net: 5 ad-hoc spans → 1 primitive.
Owner: **kf-demo**.

### A2 — `AnimatedDigit` + `.metric-swap` transition for live values  [ADOPT · OPP]
The readouts above update every rAF frame with a hard snap. glass-ui ships
`AnimatedDigit` (a numeric crossfade/roll) and the `.metric-swap-*` Vue `<Transition>`
class set (transitions.css:129-144, PRM-guarded at :219). This is the dogfood-perfect
move for an *animation engine's own* readouts. Evidence: the static digits in
`spring-desktop-open.png` (`X = 1.000`) and `sequence-desktop.png` (`0.000`).
Proposal: feed the MetricBadge `amount` through `AnimatedDigit`. No local deletion (new
capability) but it retires the per-frame-snap feel. Owner: **kf-demo**.

### A3 — `MetricBadge` (or `StatusDot` w/ label) for the SETTLED / READY / TRACKING chips  [ADOPT · P2]
The scene status chips are hand-rolled `.status-badge` + `.settled-badge` /
`.tracking-badge` / `.reverse-badge` (design-idioms.css:435-456 — 22 lines of
color-mix + AA-contrast lineage the demo MAINTAINS itself), applied at
`spring/SpringTarget.vue:25-26` and `sequence/SequenceTarget.vue:32`. glass-ui ships
`MetricBadge` and `StatusDot` (variant `active/paused/idle/error` + `label`) for status
pills. Evidence: `spring-desktop-open.png` (green `SETTLED` chip top-right),
`sequence-desktop.png` (`READY` chip top-right). Proposal: the demo carries a real
AA-contrast burden here that glass-ui's badge tokens already solve; route the three
tones to `MetricBadge`/`StatusDot` variants. CAVEAT: the demo's tones are scene-semantic
(progress-green / reverse-violet), so this is "adopt the surface, keep the tone token" —
verify the variant palette covers the green/violet pair before deleting the 22 lines.
Owner: **kf-demo** (adopt); the missing variant palette, if any, is **glass-ui-handoff**.

### A4 — `FourierField` (+ `aurora`/`goo-blob`) on the empty stage field  [ADOPT · OPP — the headline suffusion]
glass-ui ships three generative Canvas2D backgrounds — `FourierField` (an inverse-DFT
epicycle trace), `Aurora`, `GooBlob`, `Constellation`, `WatercolorDot` — kf imports
NONE. `FourierField` is the single most on-brand component glass-ui offers an
easing/animation engine: it literally renders "drawing with circles" (the math IS the
brand), composes `useCanvas2D` (offscreen/tab-hidden/reduced-motion freeze for free),
takes `:color="var(--primary)"` + `:seed`, and ships its pure math on the
`@mkbabb/glass-ui/fourier-math` subpath. The empty calm stage fields are the canvas.
Evidence: the vast empty white card in `easing-desktop-open.png` (the ball sits in a
near-empty plate), the empty `SpringProgress` field in `spring-desktop-open.png`, the
empty checker void in `amiga-desktop.png` / `home-desktop.png`. Proposal: a single
low-`:intensity` `FourierField` behind the easing/spring stage subject (NOT the chrome)
suffuses the math+motion brand into the dominant calm field WITHOUT decorating chrome —
exactly the proportion the user asked for (dominant calm field + the comet trail as the
one orchestrated motion accent). Owner: **kf-demo** (consume); see ABSTRACT note ABS-1
for the grid-field complement.

### A5 — the `.fade-slide` / `.pop` / `.dropdown` / `.pane-swap` `<Transition>` class library  [ADOPT · P2 — deletes hand-rolled CSS]
glass-ui's transitions.css (a layered, PRM-guarded `<Transition>` class set:
`fade`, `fade-slide`, `dialog-scale`, `pop`, `dropdown`, `tab-fade`, `pane-swap`,
`metric-swap`) is under-consumed. kf hand-rolls one of these:
- `KeyframeTimeline.vue:288-291` defines `.kf-editor-{enter,leave}-*` — a near-exact
  copy of glass-ui's `.fade-slide` (opacity + Y-translate, fast). Proposal: rename
  `<Transition name="kf-editor">` (:74) → `name="fade-slide"`, delete lines 288-291
  (4 rules) AND inherit the PRM guard the local copy lacks. Net deletion + free a11y.
Owner: **kf-demo**.

### A6 — `text-math` / `cm-serif` for the `f(t)=` math labels  [ADOPT · OPP]
glass-ui ships `text-math` (italic, text-font) and `text-math-body` and `cm-serif`
(Computer-Modern-style serif math) — used NOWHERE in kf (grep: 0 hits). The curve
readouts (`f(t)`, `f(0.95) = 0.999`) and axis labels are rendered in plain mono. For an
easing engine, the function-notation `f(t)` reads more like *mathematics* in
`text-math` italic than in uppercase mono-caption. Evidence: the `f(t)` axis label and
`F(0.95) = 0.999` header in `easing-desktop-open.png` (curve canvas top-left + header).
Proposal: render the function-notation portion (`f(t)`, `f(x) =`) in `text-math`; keep
the numeric operand in mono tabular. A small, befitting math-typography pop. Owner:
**kf-demo**.

---

## (b) places kf hand-rolls what glass-ui ships

### B1 — `.gold-shimmer` (the KNOWN case)  [confirmed]
design-idioms.css:292-318 re-authors glass-ui's gold-shimmer recipe (the comment at
:281-291 documents this as a deliberate "own-the-rent" localization with glass-ui-matching
values). This is the documented duplication. Verdict: the demo's *intent* (own the token
so a glass-ui rename can't silently flatten it) is sound, but the GRADIENT RECIPE itself
(background-size 250%, the 5-stop sweep, the `@keyframes gold-shimmer-slide`) is byte-near
glass-ui's. Proposal: this is a glass-ui contract question — if glass-ui exposes
`.gold-shimmer` as a stable `@utility` consuming `--color-gold*` tokens, the demo keeps
ONLY the token override and deletes the 27-line recipe + keyframe. Owner: **glass-ui-handoff**
(stabilize the `@utility`), then **kf-demo** deletes the recipe.

### B2 — `.status-badge` family  [see A3]
22 lines of color-mix status-pill recipe (design-idioms.css:435-456) that `MetricBadge`/
`StatusDot` cover. Same item as A3 from the deletion angle.

### B3 — `.progress-bar` / `.progress-dot` / `.progress-rail` / `.progress-ball`  [PARTIAL — keep, but check overlap]
design-idioms.css:326-409 owns four progress idioms. NUANCE: glass-ui's
`glass-progress-rail` (`glass.css:823`) is a TRACK-FILL `<Progress>` variant (a hairline
rail with a moving fill + leading-edge glow), which is a DIFFERENT primitive from kf's
`.progress-ball` (a draggable SCRUBBER ball travelling a tinted rail). So this is NOT a
direct duplicate — the demo's scrubber-ball idiom has no glass-ui equivalent. KEEP, but:
the `.progress-bar` rainbow gradient (the brush-sweep, :326) and the `.progress-dot`
conic ring (:349) are demo-specific color-pops that are correctly owned. No change; noted
so a future pass doesn't mistakenly "consolidate" them into the track-fill rail.
Owner: n/a (correctly owned).

### B4 — `.icon-{xs,sm,md,lg}` sizing family  [keep — but candidate to ABSTRACT]
design-idioms.css:209-232 hand-rolls a 4-rung icon-size `@utility` family (the comment
documents 61 callsites). glass-ui ships no equivalent icon-sizing primitive. KEEP locally,
but this is a clean ABSTRACT candidate (ABS-2) — a 4-rung Lucide-glyph sizing utility is
generic design-system furniture, not demo-specific. Owner: **glass-ui-handoff** (abstract).

---

## (c) glass-ui tokens kf bypasses with arbitrary values

kf's token discipline is strong (the z-scale is fully semantic, spring/duration/ease are
referenced). The residual arbitrary-value debt is mostly LAYOUT, which the demo already
named into its OWN `:root` tokens (design-idioms.css:88-127). Findings:
- **C1 — grid-background SVG is a raw data-URI, twice** (EditorShell.vue:181 + dark :186)
  — a hand-painted checker, no token. This is the GRID brand pillar rendered ad-hoc.
  Not a glass-ui token bypass (glass-ui ships no grid utility) — it's the ABSTRACT case
  ABS-1. Owner: **glass-ui-handoff**.
- **C2 — `--font-sans` redeclared in both `@theme` (style.css:60) and `:root`
  (style.css:113-117)** with the same value, because glass-ui bridges `--font-text`→
  `--font-stack-text` via `@theme inline`. This is correct (the documented glass-ui
  consumer lever) but verbose; if glass-ui exposed a single `--font-stack-text` override
  hook that the `@theme` bridge honored, the demo could set ONE token. Owner:
  **glass-ui-handoff** (consider a documented single-token font override). Low priority.
- No raw `z-[N]`, no arbitrary `cubic-bezier()`/`ease-` literals found in source scoped
  styles (the 12 files with `transition:` all reference `var(--duration-*) var(--ease-*)`).
  Token discipline here is good.

---

## (d) dark-mode & reduced-motion posture

### D1 — dark mode  [good]
kf wires `useGlobalDark` (App.vue:265, CSSCodeEditor.vue:96, useHighlightCSS.ts:64) and
class-based `.dark` overrides. glass-ui provides `installDarkModeSync` on the `/dark`
subpath; kf uses the `toggleDark`/`isDark` API. No gap. The demo's class-based gold/axis
dark overrides (design-idioms.css:151-155, style.css:204-210) are correct given the
imperative `color-scheme` toggle. No change.

### D2 — reduced motion  [GAP — kf hand-authors PRM in 7 places]
PRM is authored ad-hoc across 7 files (cube/CubeTarget, motion-path/MotionPathTarget,
spring/StartingStyleTarget, design-idioms.css, AnimatedText, TypingDots,
ControlsPaneWrapper). glass-ui ships TWO PRM mechanisms kf under-leans-on:
(i) the GLOBAL PRM bracket in utilities.css (restricts `transition-property` under
`prefers-reduced-motion: reduce` on `*:not([data-allow-motion])` — design-idioms.css:242-253
already documents relying on this for `.scale-on-hover`); and (ii) the per-transition PRM
guards baked into every transitions.css `<Transition>` class (:212-262). Proposal: where
kf hand-rolls a `<Transition>` + its own `@media (prefers-reduced-motion)` block (the
`kf-editor` case A5), adopting the glass-ui transition class deletes the manual PRM guard
for free. The CANVAS scenes (cube, motion-path) legitimately need bespoke PRM; the
chrome-transition cases do not. Owner: **kf-demo** (route chrome transitions through
glass-ui classes); no glass-ui change owed.

---

## glassUiItems summary (the structured ledger)

**ADOPT (consume in kf):** A1 MetricBadge readouts · A2 AnimatedDigit/metric-swap ·
A3 MetricBadge/StatusDot status chips · A4 FourierField stage field · A5 fade-slide
transition · A6 text-math labels.

**REFINE-IN-GLASS-UI:** B1 gold-shimmer (stabilize the `@utility` so the demo can
delete the recipe) · C2 single-token font override hook · A3 status variant palette
(verify green/violet coverage).

**ABSTRACT-INTO-GLASS-UI:** ABS-1 a grid/graph-paper background utility (the GRID brand
pillar, currently a raw data-URI in EditorShell — and a math/grid motif is design-system
furniture, the natural sibling to FourierField/Aurora) · ABS-2 the `.icon-{xs,sm,md,lg}`
Lucide-glyph sizing family (generic, 61-callsite-proven, currently demo-local).
