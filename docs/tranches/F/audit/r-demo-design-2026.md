# Tranche F — Demo Design Cogency Audit (lane `r-demo-design-2026`)

**Scope.** Modern web-app DESIGN SOTA for `demo/**` post-E.W11: the
design-system / motion-design / editor-UX frontier the demo consumes through
`@mkbabb/glass-ui`. Typography, color, motion choreography, the editing
experience, onboarding, responsive/mobile — **AFTER** E.W11 landed (VT scene
nav, a11y uniformity, idiom r3, first-paint, CWV). The mandate is to find what is
**still not-SOTA** without re-litigating E.W11, and to honestly mark where the
post-E state is exemplary.

**Method.** Read the E close (`docs/tranches/E/FINAL.md`) and the two prior
demo-design lanes (`audit/sota/a-demo-design.md`, `audit/sota/d-demo-elevate.md`)
to diff rather than repeat; read the W11 commit (`d400591`) to confirm exactly
what landed; read the live substrate (`@/styles/style.css`,
`@/styles/design-idioms.css`), the scenes, the start screen, the rail-bearing
scenes, the VT plumbing, and the glass-ui token/typography surface in
`node_modules/@mkbabb/glass-ui/dist/styles/`. Grounded every code claim at
`file:line`; grounded every SOTA claim on `modern-web-guidance` (Baseline-dated)
+ the glass-ui dependency. Disposition per finding.

**Headline.** E.W11 was a real, comprehensive elevation — the prior lanes'
headline items (View Transitions, the `:focus-visible` contract, the
PRM/first-paint hardening, the font CLS fallback, `--spring-snappy` reconcile,
`.dock-inset`, the dead `CommandPalette` delete) all genuinely landed and
verify. **The demo is ~90% SOTA.** What remains is a small, honest set of
residuals — two of them are items the prior lanes *named* but W11 closed only
partially (the rail/ball idiom; the VT shared-element morph), and three are
**new** frontier moves the prior lanes did not raise (the per-character hero
defeats `text-wrap: balance` + has no AT name; directional VT is now Baseline;
fluid display-type). None is a rebuild. Where the post-E state is exemplary, §6
says so plainly and I manufacture no work there.

---

## What E.W11 actually closed (verified — do NOT re-litigate)

Confirmed landed against `git show d400591` + live code:

- **View Transitions scene nav** — `app/useSceneTransition.ts:32` routes
  `switchScene` through glass-ui's `startViewTransition`, wrapping ONLY the
  synchronous key mutation; the `SpringProgress` cross-dissolve survives as the
  no-VT fallback; focus routes to the host on `finished` (`useSceneTransition.ts:33-35`).
- **The `:focus-visible` keystone** — single-sourced in `design-idioms.css:141-144`
  (`.focus-ring:focus-visible { box-shadow: var(--focus-ring-shadow) }`).
- **`--spring-snappy` reconcile** — `style.css:147` now aliases the canonical
  `--spring-smooth`; the ζ=0.65 shadow is gone.
- **`.dock-inset`** — defined at `design-idioms.css:269-271`
  (`padding-bottom: var(--dock-band-reserve)`); the two scenes that expect it
  now get the inset.
- **First-paint** — `AnimatedText` PRM-guarded (`AnimatedText.vue:100-108`), the
  invalid `200%` stop removed; the Capsize metric-matched `@font-face`
  (`style.css:80-87`) CLS-stabilizes the LCP `<h1>`.
- **`CommandPalette.vue` deleted** (dead code).

These are closed. The findings below are the residual / new surface only.

---

## §1 — The rail/ball idiom is STILL triplicated with drift (prior-named, W11-MISSED) `[MED]`

**The prior lanes named this precisely.** `a-demo-design.md §1.3` and
`d-demo-elevate.md Theme 3.2` both flagged the "progress-rail / progress-dot"
recipe re-authored across the Spring and Easing scenes and prescribed promoting
a `progress-rail` / `progress-dot` idiom pair to `design-idioms.css`.

**W11 closed only HALF, and the wrong half.** The W11 commit message
(`d400591`) says "progress-dot promoted to design-idioms.css" — but the thing
promoted is the **conic-gradient *playing-indicator* ring** (`design-idioms.css:244-256`,
driven by `--dot-p`, `radius-pill`, the active-playing companion to glass-ui's
`<StatusDot>`). That is a **different primitive** from the **rail-line + scrubber-ball**
the prior lanes meant. The rail/ball family is **still authored four times with drift**:

- `spring/SpringTarget.vue:143-193` — `.spring-rail-line` (`color-mix … 12%`,
  2px), `.spring-ball` (glow `color-mix … 40%`, **1.75rem**), `.sampler-ball`
  (`color-mix … 65%`), `.spring-target-marker` (dashed `… 50%`).
- `easing/EasingTarget.vue:294-327` — `.track-line` (`color-mix … 8%`, 2px),
  `.track-ball--active` (glow `color-mix … 35%`, **36px**), `.track-ball--muted`
  (`color-mix … 20%`).
- `spring/SpringSidebar.vue:162-184` — `.preset-line` (`color-mix … 10%`, 2px),
  `.preset-ball` (**1.1rem**, no glow).
- `@/components/custom/animation-controls/timeline/components/TimelineTrack.vue`
  — the timeline rail/playhead (the fourth instance of the same geometry).

**The cogency cost.** The drift is real and visible: a user moving
Spring → Easing → the spring sidebar sees the *same conceptual primitive* (a
green dot on a tinted rail) rendered with **three different rail tints (12 / 8 /
10%), two different glow strengths (40 / 35%), and four different ball sizes
(1.75rem / 36px / 1.1rem / …)**. This is exactly the cross-scene incoherence the
D.W2 idiom-ownership pass set out to eliminate, surviving in the newest scenes —
and the prior lanes' fix was *not* applied (only the unrelated `.progress-dot`
ring was). The `--track-ball-size-*` custom props EasingTarget already exposes
(`EasingTarget.vue:272-273`) are the right parameterization seam.

- **Disposition.** **SHIP-in-F.** Promote a real `progress-rail` /
  `progress-ball` idiom pair to `design-idioms.css` (parameterized by
  `--rail-tint`, `--ball-glow`, `--ball-size`, defaulting to EasingTarget's
  AA-contrast-lineage values), and have SpringTarget / EasingTarget /
  SpringSidebar / TimelineTrack consume it. One green, one glow, one rail
  recipe, one source. This is the literal completion of the prior lanes' Theme
  3.2 that W11's commit message *claimed* but did not deliver.
- **Isomorphism.** Pick EasingTarget's canonical tint/glow; a tiny pixel delta
  on the three other sites toward cohesion. Flag as a deliberate
  motion-coherence delta (same class as the W11 `--spring-snappy` reconcile).
- **inv ε note.** This is a HONEST correction of the E record: the E close
  (`FINAL.md` W11 row "progress-dot promoted") reads as if the rail idiom landed.
  It did not — verified by reading both the promoted `.progress-dot` block and
  the four still-scoped rail blocks. Recording it so F's ledger is accurate.

---

## §2 — The per-character hero defeats `text-wrap: balance` AND has no accessible name `[MED]`

**This is a NEW finding the prior lanes did not raise** (they fixed the hero's
*motion* PRM + the invalid keyframe in W11; they did not examine its *typographic
substrate* or its *AT reading*).

**The setup.** The LCP hero `<h1 class="text-display-4">`
(`EditorStartScreen.vue:5-21`) renders its title through `AnimatedText`, which
splits the string into **one `<span>` per character** for the lift-down stagger
(`AnimatedText.vue:2-12`), and does **manual JS line-breaking at `width < 768`**
(`AnimatedText.vue:45-55`, swapping a pre-broken string).

**Two defects, both about the most identity-bearing surface:**

1. **`text-wrap: balance` is silently defeated.** glass-ui's `.text-display-4`
   utility *already sets* `text-wrap: balance`
   (`node_modules/@mkbabb/glass-ui/dist/styles/typography.css:223` family,
   verified — every `.text-display-*` and `.text-title` carries it). But
   `text-wrap: balance` operates on the browser's line-breaking of a **text run**;
   when the run is shredded into per-character inline-block `<span>`s, the
   balancer has nothing to balance — so the demo's largest text gets *none* of
   the balanced-rag treatment glass-ui pays for, and instead relies on a hard
   `width < 768` JS breakpoint (`AnimatedText.vue:48`) that is itself a
   pre-container-query anti-pattern (a JS media query driving layout). The guide
   `improve-text-layout-and-legibility` (Baseline `text-wrap: balance` since
   **2024-05-13**) is explicit that balance is the SOTA path for short headings;
   the demo opted its hero *out* of it by construction.
2. **No accessible name.** The per-character `<span>`s carry no `aria-label` /
   `role` / `sr-only` mirror (grep-confirmed: `AnimatedText.vue` and
   `EditorStartScreen.vue` have zero `aria`/`role`/`sr-only`). A screen reader
   reads the hero `<h1>` as a stream of single characters
   ("S … e … l … e … c … t …") or — worse, with ` ` substitution
   (`AnimatedText.vue:23,37`) — as nothing meaningful. The demo's FIRST and
   largest heading is the one piece of text least legible to AT, and W11's a11y
   uniformity pass did not reach it (it guarded the *motion*, not the *reading*).

- **Disposition.** **SHIP-in-F.** Give `AnimatedText` an accessible name: render
  the whole word in an `aria-hidden`-wrapped visual layer of spans + a single
  visually-hidden `<span class="sr-only">{{ text }}</span>` (or set
  `aria-label` on the host and `aria-hidden="true"` on the span stream). For the
  balance: this is the deeper tension — per-character stagger and
  `text-wrap: balance` are mutually exclusive by construction. The SOTA
  resolution is to **stagger via animation-delay on a word/line wrapper that
  preserves the text run** (CSS can stagger `nth-child` spans at the *word*
  granularity while letting the run wrap+balance), OR drop the JS `width < 768`
  break entirely and let `text-wrap: balance` + a `container`-query / fluid
  width own the wrapping. At minimum, delete the manual `width < 768` JS
  line-break (`AnimatedText.vue:45-55`) in favor of CSS wrapping — it is a
  reactive `useWindowSize` listener driving a layout decision CSS now owns.
- **Isomorphism.** The AT name is additive (pixel-isomorphic). Restoring
  balance changes the hero's *wrap points* on narrow viewports (a befitting
  legibility delta) and removes a JS listener (a perf + idiom win).

---

## §3 — The VT "shared-element morph" is a cross-fade only (prior-named PRIZE, W11-PARTIAL) `[LOW–MED]`

**The prior lanes named the morph as the prize.** `a-demo-design.md §4.1` and
`d-demo-elevate.md Theme 1.1` both described the *real* View-Transitions reward
as a **shared-element morph**: tag the active dock scene-icon AND the incoming
scene's subject with a shared `view-transition-name` so the browser morphs
position/size between them (cube ↔ "Cube" dock icon visually connect).

**W11 shipped the cross-fade, not the morph.** `app/App.vue:332` sets exactly
ONE `view-transition-name: scene-subject` — on the scene *host* only. A single
name on a single persistent element yields a **cross-fade of the whole scene
plane**; it does NOT morph any element from a source position to a destination
position (that requires the same name on a *distinct outgoing* element and a
*distinct incoming* element). The dock icons (`TopDock.vue:174,197,214`) carry
NO `view-transition-name`. So the headline "shared-element morph" the prior lanes
sold is, as shipped, a compositor cross-fade — good, modern, and the right
baseline, but not the morph.

- **Disposition.** **BOOK** (discretionary polish, not a defect). The cross-fade
  is legitimately SOTA and the safe baseline; the morph is a *stretch* the prior
  lanes themselves tagged "(stretch)". If pursued: name the active dock
  scene-icon and the incoming scene subject with a shared transient
  `view-transition-name` (assigned for the duration of the swap, cleared after —
  the "≤1 element per name per state" runtime contract the App.vue comment
  already cites). Honest about cost: this needs per-swap name assignment logic,
  which is more than a CSS line.
- **inv ε note.** Recording so the E record is precise — the morph is described
  in `useSceneTransition.ts:10` and `App.vue:325` as if it morphs, but with a
  single host name it can only cross-fade. Not a bug; a naming-vs-reality nuance.

---

## §4 — Directional View Transitions are NOW Baseline — a clean progressive layer `[LOW — OPPORTUNITY]`

**NEW since the E lanes were written.** `d-demo-elevate.md Theme 1.1` explicitly
deferred directionality because *Active view transition* (the
`types:` / `:active-view-transition-type()` mechanism) was "Baseline Newly
Available only since 2026-01-13 … fresh; treat directionality as the progressive
layer." As of the F audit date (2026-06), that Baseline is **~5 months
matured** (`modern-web-guidance` `directional-navigation-transitions`: *Active
view transition* Baseline since **2026-01-13**; Chrome 125, Firefox 147, Safari
18.2). The deferral condition the E lane set has now been met.

**The fit.** The demo's nav has a natural directional axis: Home → a scene is
"forward"; scene → Home (or the back-nav) is "backward". The VT plumbing is
already in place (`useSceneTransition.ts`); adding directionality is purely
additive: pass `types: ['forward' | 'backward']` to the existing
`startViewTransition` call and add `html:active-view-transition-type(forward)
::view-transition-{old,new}(root)` slide rules to the demo CSS. Where unsupported
it silently degrades to today's cross-fade (the guide's stated progressive
enhancement). It costs one `types` argument + ~4 CSS rules.

- **Disposition.** **BOOK** (the E lane's own stretch, now Baseline-unblocked).
  Low code, real motion-cogency win (the swap gains a sense of place /
  direction). Not urgent; named because the E lane's deferral gate has cleared
  and F is the right place to record that.
- **Isomorphism.** Additive; supported path gains a directional slide,
  unsupported path unchanged.

---

## §5 — The hero title is fixed-step responsive, not fluid; subtitle/hint prose lacks `text-wrap: pretty` `[LOW]`

**NEW finding.** Two small typography-frontier gaps the prior lanes did not raise:

1. **Display type is breakpoint-stepped, not fluid.** The demo has **zero**
   `clamp()` on any `font-size` (grep-confirmed across `demo/**`). The hero size
   comes from glass-ui's `.text-display-4` utility, which is a fixed rung; the
   only responsive move is the `lg:mt-24` margin
   (`EditorStartScreen.vue:3`) and the JS `width < 768` break (§2). Fluid type
   (`clamp()` / container-query units) is the SOTA path for a hero that must read
   well across the demo's wide viewport range (`--work-area-max-width:
   clamp(72rem, 94vw, 120rem)`, `style.css:95`). This is largely **glass-ui's
   call** (it owns `.text-display-*`) — so the honest disposition is a *handoff
   candidate*, not a demo patch.
2. **Subtitle/hint prose gets no `text-wrap: pretty`.** The start-screen
   `<h2 class="text-title">` (subtitle) and `<h2 class="text-subheading">`
   (hint) at `EditorStartScreen.vue:22-31` are multi-line prose. glass-ui sets
   `text-wrap: balance` on `.text-title` (typography.css) but `pretty` (the
   orphan-avoidance algorithm for running prose) is the better fit for the
   subtitle's longer "from the list below, then press Play." copy. `pretty` is
   not yet Baseline-wide (Chrome/Safari only, no Firefox — guide
   `improve-text-layout-and-legibility`), so it is a pure progressive
   enhancement.

- **Disposition.** Item 1 → **value.js-HANDOFF is N/A** (it is glass-ui, not
  value.js) → **BOOK as a glass-ui ASK** (fluid `.text-display-*` rungs benefit
  every glass-ui consumer, not just this demo — author it once in the
  dependency, not as a demo override). Item 2 → **SHIP-in-F** if the demo wants
  it on its *own* prose (a scoped `text-wrap: pretty` on the start-screen
  subtitle is demo-owned and ≤1 line), else **BOOK**.
- **Isomorphism.** Both progressive enhancements; unsupported engines unchanged.

---

## §6 — Where the post-E demo is ALREADY SOTA (verified — manufacture NO work)

These are confirmed exemplary; calling them gaps would manufacture work:

- **Dark mode is owned by the dependency, idiomatically.** The demo consumes
  `useGlobalDark` from `@mkbabb/glass-ui/dark`
  (`@/.../useHighlightCSS.ts:2`, `CSSCodeEditor.vue:96`) and a `.dark` class
  contract; it does NOT hand-roll a color-mode store. The `light-dark()` CSS
  form is *correctly* avoided (the comment at `design-idioms.css:60-61` documents
  why: the demo toggles by class, which `light-dark()` would not track). Every
  demo-owned color token has an explicit `.dark` parity block
  (`style.css:178-184`, `design-idioms.css:119-123`). Exemplary.
- **The `:focus-visible` contract is single-sourced** (`design-idioms.css:141-144`)
  — the W11 keystone landed and holds.
- **The VT scene-swap is correct and safe** — `useSceneTransition.ts` wraps only
  the synchronous mutation (never the `<Suspense>` loader, the documented trap),
  feature-detects via the helper, falls through to the `SpringProgress`
  cross-dissolve fallback, and routes focus on `finished`. This is the textbook
  SPA View-Transitions pattern. The cross-fade-vs-morph nuance (§3) is a polish
  ceiling, not a defect.
- **`@starting-style` / `allow-discrete` is dog-fooded as a teaching scene** —
  `spring/StartingStyleTarget.vue:138-142` drives a real discrete entry/exit
  transition eased by a keyframes.js spring (the W11 artifact scene). The demo
  *demonstrates* the 2024-frontier discrete-transition platform feature. Strong.
- **The Capsize metric-matched `@font-face`** (`style.css:80-87`) is the correct
  CLS-stabilizing pattern for the CDN display font — mirrors glass-ui's own
  Capsize idiom; landed in W11.
- **Layout math is sophisticated** — the optical-balance offset pair
  (`style.css:105-109`), the cycle-free `--dock-band-reserve`
  (`style.css:119-122`, with a documented custom-property-cycle avoidance), the
  mobile work-area cap (`style.css:186-218`). Genuine craft, untouched by these
  findings.
- **Token + z-contract discipline holds** — the ordered-layer z-contract
  (`style.css:11-37`) is semantic and documented; the D.W2/3 idiom-ownership
  layer (`design-idioms.css`) single-sources rainbow/gold/hover-lift/tab-slide.
  §1 is its *completion* into the rail family, not a contradiction.
- **Scroll-driven affordances are correctly UNUSED at the page level** — the
  demo is a fixed-viewport editor (`overflow: hidden` on html/body,
  `style.css:228`). The `modern-web-guidance` `scrollability-affordance-hints`
  (container `scroll-state` queries) *could* dress the few inner
  `overflow-y-auto` panels (the Easing comparison list `EasingTarget.vue:62`,
  the shortcuts modal, the asset layer panel) with scroll-shadow hints — a
  genuine but **MINOR / discretionary** polish (a scroll-shadow tells the user
  "more below"). I do **NOT** manufacture this into the editor; **RECORD** it as
  a named-for-exhaustiveness micro-opportunity only.

---

## Disposition summary

| # | Finding | Sev | Disposition | Prior-lane status |
|---|---------|-----|-------------|-------------------|
| 1 | Rail/ball idiom still 4× with drift (rail tint 12/8/10%, glow 40/35%, ball 1.75rem/36px/1.1rem) | MED | **SHIP-in-F** | named (a-demo-design §1.3 / Theme 3.2), W11 promoted the WRONG primitive |
| 2 | Per-character hero defeats `text-wrap: balance` + no AT name + JS `width<768` break | MED | **SHIP-in-F** | NEW (W11 fixed motion, not typography/reading) |
| 3 | VT "shared-element morph" is a cross-fade only (single host name) | LOW–MED | **BOOK** | named PRIZE, W11 shipped the base cross-fade only |
| 4 | Directional VT now Baseline (2026-01-13) — progressive layer | LOW | **BOOK** | E-deferred; the deferral gate has now cleared |
| 5a | Display type fixed-step, not fluid (glass-ui owns `.text-display-*`) | LOW | **BOOK** (glass-ui ASK) | NEW |
| 5b | Start-screen subtitle/hint prose lacks `text-wrap: pretty` | LOW | **SHIP-in-F** or BOOK | NEW |
| 6 | Scroll-shadow affordance on inner `overflow-y-auto` panels | LOW | **RECORD** (do not manufacture) | NEW |

**value.js hand-offs: NONE in this lane.** The demo-design surface consumes
glass-ui + the engine. §5a touches a *glass-ui* typography rung (a glass-ui ASK,
not value.js). The value.js touchpoints in scene logic (`Color`,
`springLinearStops`, easing catalog) are correct usage, not design gaps — the
same null result both E demo-design lanes reached.

**The one-paragraph thesis.** E.W11 elevated the demo to ~90% SOTA and the
headline modernizations all landed. F's demo-design residual is small and honest:
**finish the rail/ball idiom consolidation the W11 commit message claimed but
did not deliver** (§1, the one real SHIP), **give the hero a typographic +
accessible substrate worthy of the LCP element** (§2, the one real
correctness-adjacent SHIP), and **record two now-unblocked progressive layers**
(directional VT §4, fluid display type §5a) as books — not a rebuild, the same
disciplined system extended to the two surfaces W11 reached only partway.
