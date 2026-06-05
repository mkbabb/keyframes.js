# SOTA Audit — Demo Design Cogency / Elegance (lane: demo · FOLD-E)

**Scope.** `/Users/mkbabb/Programming/keyframes.js/demo` — design coherence within
the established aesthetic (Instrument Serif display + Fira Code mono + glass-ui
warm-cream/jewel palette), visual hierarchy, the demo-owned design-idioms layer
(D.W2/3), motion design, the rainbow/gold idioms, dark mode, spacing/type rhythm.

**Method.** Read the live design substrate (`@/styles/style.css`,
`design-idioms.css`, `brand.css`), the glass-ui token surface the demo consumes
(`node_modules/@mkbabb/glass-ui/dist/styles/*`), every scene + its target/sidebar,
the dock, EditorShell, and the idiom application sites. Grounded each claim at
file:line. Cited `modern-web-guidance` (skill) guides with Baseline status and the
glass-ui DESIGN substrate.

**Headline.** The demo is, on the whole, **strongly SOTA-aligned and unusually
disciplined** — near-zero raw color literals in chrome, near-zero arbitrary Tailwind
sizing values, a fully-tokenized z-contract, optical-balance layout math, a11y
contrast notes baked into scoped CSS, reduced-motion authority delegated to the
engine. The D.W2/3 idiom-ownership work is real and holds. The gaps that remain are
**a handful of specific incoherences** (a divergent shadowed spring token, a dead
no-op utility, a missing scene icon, an unguarded perpetual hero animation with an
invalid keyframe) plus **two genuine SOTA opportunities** the platform now affords
(native View Transitions for scene nav; a calibrated fallback face for the one
CDN-loaded display font). Most findings are small, surgical, isomorphic-or-better.

---

## §1 — Motion / token coherence

### 1.1 — `--spring-snappy` is shadowed by a STALE, divergent hand-pasted copy `[HIGH]`
- **Where.** `@/styles/style.css:106-133` redefines `--spring-snappy` in the demo
  `:root` (which is OUTSIDE `@layer`, so it overrides glass-ui). The demo's copy is
  `linear(0, 0.31649 4%, 0.75711 8%, 1.06762 16% …)` — generated (per its own
  comment, style.css:99-105) from `(response: 0.35, dampingFraction: 0.65)`.
- **The gap.** glass-ui's CANONICAL `--spring-snappy`
  (`node_modules/@mkbabb/glass-ui/dist/styles/tokens.css` §2) is
  `linear(0, 0.10438 2.041%, 0.32622 4.082% …)` from `(0.35s, ζ=0.85)` — a 49-stop
  curve with ~7% peak overshoot. The demo's is a 26-stop curve at ζ=0.65 with a much
  larger ~7% overshoot AND a different stop cadence. The SOLE demo consumer is the
  controls-pane slide (`ControlsPaneWrapper.vue:193`,
  `transform … var(--spring-slow) var(--spring-snappy)`). Net effect: the demo's
  single most-visible structural transition (the controls pane opening) springs on a
  curve that **does not match any glass-ui spring** the rest of the system uses, and
  diverges in damping from glass-ui's own "snappy". This is exactly the
  cross-repo-token incoherence the D.W2 idiom-ownership pass set out to eliminate,
  surviving in the motion layer.
- **Disposition.** **FOLD-E.** Either (a) DELETE the demo override and consume
  glass-ui's canonical `--spring-snappy` (the pane slide then matches the system —
  preferred, KISS, and the regen comment becomes glass-ui's responsibility), or (b)
  if the demo deliberately wants a bouncier pane slide, name it
  `--spring-pane` / consume `--spring-bouncy` and document the deviation. Do NOT keep
  a same-named shadow that silently diverges from the dependency.
- **Isomorphism.** Adopting (a) CHANGES the pane-slide curve (less overshoot, calmer
  settle) — a befitting motion-coherence delta, not a regression. Flag it in the
  changeset as a deliberate isomorphism break toward system cohesion.

### 1.2 — `AnimatedText` (the hero title) runs perpetual unguarded motion + an INVALID keyframe `[HIGH]`
- **Where.** `@/components/custom/AnimatedText.vue:59-97`. `.lift-down` is
  `animation: liftDown 3s … infinite` and `.dot-fade` is
  `animation: dotFade … infinite` — both run forever on every character of the hero
  display title (`EditorStartScreen.vue:9-20`), with NO `prefers-reduced-motion`
  guard anywhere in the file (confirmed: the only PRM sites are App.vue, CubeTarget,
  AnimationVisualizer, design-idioms.css, animationOptionsStore — not here).
- **Two defects.** (1) **Accessibility/motion:** a perpetual, infinitely-looping
  hero animation that ignores reduced-motion is the canonical PRM violation — the
  rest of the demo is scrupulous about this (App.vue scene-swap is
  `respectReducedMotion: true`; design-idioms `.scale-on-hover` has a PRM block).
  (2) **Invalid CSS:** `@keyframes liftDown` (AnimatedText.vue:78) contains a
  `200% { … }` stop. CSS keyframe selectors are percentages in `[0%, 100%]`;
  `200%` is invalid and is dropped by every engine — so it is dead text that misleads
  the reader into thinking the curve does something past 100%.
- **Rationale.** This is the demo's FIRST paint (the start-screen hero) — the most
  identity-bearing surface. A SOTA hero respects reduced-motion and ships valid CSS.
- **Disposition.** **FOLD-E.** Wrap `.lift-down` / `.dot-fade` in a
  `@media (prefers-reduced-motion: reduce)` block that parks them at their resting
  frame (the demo's established PRM idiom — see design-idioms.css:121-125), and
  delete the dead `200%` stop. Optionally re-express the per-char stagger via the
  engine the demo demonstrates (it already drives the scene-swap via SpringProgress)
  for dog-fooding cohesion.
- **Isomorphism.** Pixel-identical for motion-OK users; correct degrade for PRM
  users. Deleting `200%` is a pure no-op cleanup.

### 1.3 — Spring/Easing target rails re-author a near-identical "progress rail" idiom `[MED]`
- **Where.** `spring/SpringTarget.vue:128-194` (`.spring-rail-line`, `.spring-ball`,
  `.sampler-ball`, `.spring-target-marker`) and `easing/EasingTarget.vue:268-345`
  (`.track-line`, `.track-ball--active/--muted`). Both scoped blocks independently
  build: a 2px `--color-progress`-tinted centered rail line (`color-mix(… 8/12% …)`),
  a filled `--color-progress` ball with a `box-shadow` glow
  (`color-mix(… 35/40% …)`), and a muted companion ball
  (`color-mix(… 20/65% …)`). The geometry, the color-mix recipe family, the glow,
  the `will-change`, and the centering math are the same idiom typed twice with small
  drift (rail tint 8% vs 12%; glow 35% vs 40%; ball 1.75rem vs 36px).
- **The gap.** This is the SAME latent rent D.W2.S1 named for the rainbow/gold/
  hover-lift idioms — a recurring visual recipe defined nowhere as a single source,
  resolving by copy. The two newest scenes (E-tranche) re-introduced it. The drift
  (different tints/glows for what reads as the same "progress dot on a rail") is a
  subtle cross-scene incoherence: a user moving Spring→Easing sees two slightly
  different greens/glows for the conceptually identical primitive.
- **Disposition.** **FOLD-E.** Promote a `progress-rail` / `progress-dot` idiom pair
  to `design-idioms.css` (parameterized by the `--track-ball-size-*` custom props the
  EasingTarget already exposes, EasingTarget.vue:274-277), and have both targets
  consume it. Single green, single glow recipe, one source. This extends the exact
  pattern the demo already owns for rainbow/gold.
- **Isomorphism.** Choose one canonical tint/glow (recommend EasingTarget's, which
  carries the AA-contrast lineage) — a tiny pixel delta on one scene, toward cohesion.

---

## §2 — Visual hierarchy / consistency gaps

### 2.1 — `dock-inset` is a DEAD no-op class (defined nowhere) `[MED]`
- **Where.** Applied on the root of both `spring/SpringTarget.vue:2` and
  `easing/EasingTarget.vue:2` (`… overflow-hidden dock-inset`). Grep across the
  entire demo tree AND glass-ui's built CSS returns **zero definitions** of
  `.dock-inset` — it is a class that styles nothing.
- **The gap.** The name promises bottom-dock clearance (the menubar dock band the
  layout system reserves via `--dock-band-reserve` / `--dock-menubar-reserve`,
  style.css:85-97). Both these scenes' cards are `flex-1` full-height; the intent was
  almost certainly to inset them above the bottom menubar. Today that inset silently
  does NOT apply — the class is a no-op, so on small viewports a tall target card can
  reach under the dock band (the same residual style.css:188-194 flags for the cube
  with the controls pane open). It's both a dead-class smell AND a latent layout bug.
- **Disposition.** **FOLD-E.** Either define `.dock-inset` in `design-idioms.css`
  (e.g. `padding-bottom: var(--dock-band-reserve)` or a margin against the reserve
  token) so the promised clearance is real and single-sourced, OR delete the class if
  the `dock-inset` clearance is already handled by the editor-shell grid (verify in
  the running app). A named class that styles nothing is exactly the un-gated rent
  D.W2 set out to remove.
- **Isomorphism.** If the inset was never visually present, defining it is a small
  intentional layout improvement; deleting it is a pure no-op cleanup. Decide by
  observing the running small-viewport layout.

### 2.2 — The `spring` scene is the ONLY scene with no dock icon (Home fallback) `[MED]`
- **Where.** `@/components/custom/dock/TopDock.vue:27-32` `sceneIcons` maps
  `cube / amiga / square / easing` to image assets, but has NO `spring` entry. The
  scene IS registered (`app/scenes.ts:56-59`, `id: "spring"`). At TopDock.vue:173 and
  :195 the scene-select trigger/items do
  `v-if="sceneIcons[currentSceneId]" … :else Home icon` — so Spring uniquely renders
  the generic `Home` glyph in the scene dropdown, breaking the visual rhythm of the
  icon column (every other scene has a bespoke mark).
- **Confirmed.** `assets/icons/` contains cube/amiga/square/easing marks; there is no
  `spring-icon-*` asset.
- **The gap.** Icon-set incompleteness reads as an unfinished scene. The Spring scene
  is otherwise the most polished E-tranche surface (live tracker, velocity readout,
  settled/tracking badge) — the missing dock icon undersells it.
- **Disposition.** **FOLD-E.** Add a `spring-icon-sm` asset (matching the
  easing-icon's `.svg` treatment — see 2.3) and register it in the `sceneIcons` map.
- **Isomorphism.** Additive; no existing pixels change.

### 2.3 — Scene icon format drift: easing is `.svg`, the rest are `.png` `[LOW]`
- **Where.** `TopDock.vue:22-25` imports `cube/amiga/square` as `*-icon-sm.png` but
  `easing` as `easing-icon-sm.svg`. The `.svg` is the SOTA choice (crisp at any DPR,
  themeable). The `.png` marks will be soft on hi-DPR and cannot adapt to dark mode.
- **Disposition.** **BOOK** (polish, not blocking). Migrate the three `.png` scene
  marks to `.svg` for parity + retina crispness + potential dark-mode tinting; the
  new spring icon (2.2) should be `.svg` from the start.
- **Isomorphism.** Visual near-identical; sharper on retina.

### 2.4 — Start-screen copy "from the list above" vs the bottom-anchored dock `[LOW]`
- **Where.** `EditorStartScreen.vue` default props: subtitle "from the list",
  subtitleSuffix "above." The animation selector lives in the BOTTOM menubar dock
  (`AnimationMenuBar.vue`), which is fixed at the bottom of the viewport — and the
  scene/animation choosers in `TopDock` are at the TOP. "above" is ambiguous: the
  list the hint refers to is below (menubar) on most scenes.
- **Disposition.** **BOOK** (copy polish). Reword to point at the actual affordance
  ("from the dock below" / "from the menu") or make it scene-aware. Minor, but it's a
  first-impression coherence nick.
- **Isomorphism.** Copy-only; no layout change.

---

## §3 — Color / dark-mode

### 3.1 — Cube face colors are raw saturated `rgba` primaries with no dark-mode adaptation `[LOW — likely INTENTIONAL]`
- **Where.** `cube/CubeTarget.vue:124-129` — six faces at
  `rgba(255,0,0,0.8) … rgba(0,255,255,0.8)` (pure RGB+CMY primaries). These do not
  consume any token and do not shift in dark mode.
- **Assessment.** This is demo CONTENT (a Rubik-style identity cube), not chrome —
  pure primaries are a legitimate, recognizable aesthetic choice and the `0.8` alpha
  lets the dark grid show through. Calling it a "gap" would be manufacturing work.
  The ONE refinement worth naming: the six primaries are a perfect candidate to read
  off glass-ui's `--section-color-*` jewel palette (tokens.css §6) — which are
  perceptually-tuned, dark-mode-aware jewel tones — IF a more sophisticated cube
  identity is wanted. That would also make the cube faces harmonize with the rest of
  the demo's jewel-forward identity rather than reading as a separate "primary"
  vocabulary.
- **Disposition.** **ALREADY-SOTA** as content (pure primaries are a deliberate
  identity). **BOOK** the optional jewel-palette re-tone as a discretionary
  refinement only if the cube's "toy primaries" register is judged off-brand against
  the warm-cream/jewel system.
- **Isomorphism.** Re-toning would change the cube's pixels materially — only do it
  as a deliberate identity decision, not a silent token-migration.

### 3.2 — `grid-background` dot uses hard black/white, not theme tokens `[LOW]`
- **Where.** `EditorShell.vue:150-157` — the inlined SVG grid uses implicit black
  `fill-opacity:0.10` (light) and `fill='white' fill-opacity='0.08'` (dark). It works
  and is theme-forked correctly, but the values are literal rather than
  `--foreground`-derived (the demo's canonical surface-tint approach,
  cf. glass-ui's `--surface-tint-*` family, tokens.css §5).
- **Assessment.** Data-URI SVG can't reference CSS custom properties for fill, so a
  literal is somewhat forced here; the dark fork already exists. Marginal.
- **Disposition.** **ALREADY-SOTA-ENOUGH.** The two-fork data-URI is the pragmatic
  pattern; a `mask` + `background-color: var(--foreground)` rewrite would token-ify
  it but adds complexity for negligible gain. Leave it; noted for completeness.

---

## §4 — SOTA platform opportunities (the demo could leverage)

### 4.1 — Scene navigation hand-rolls an opacity fade; glass-ui ships a View Transitions substrate `[OPPORTUNITY — MAJOR]`
- **Where today.** `app/App.vue:231-249` drives scene swaps with a `SpringProgress`
  binding (`sceneSwapStyle`: opacity + scale) on a sibling wrapper — a deliberate,
  well-reasoned choice (the comment at App.vue:108-135 documents why a `<Transition>`
  around the keyed `<Suspense>` broke the async loader). The cross-dissolve is good.
- **The opportunity.** glass-ui ALREADY ships a native View Transitions substrate the
  demo does not touch: `node_modules/@mkbabb/glass-ui/dist/styles/view-transition.css`
  (token-first `gl-list-item` recipes, `::view-transition-*` PRM `animation: none`
  degrade built in) PLUS a `useViewTransition` helper in
  `@mkbabb/glass-ui/motion-core` that wraps the DOM mutation with a ≤20-LOC
  feature-detected instant fallback. Grep confirms the demo uses NEITHER
  (`view-transition` / `startViewTransition` appear nowhere in `demo/`).
- **Why it's SOTA.** The native View Transitions API runs the cross-fade on the
  compositor (off the rAF/Vue-reactive path the SpringProgress binding currently
  occupies), and — the real prize — enables **shared-element morphs**: tag the active
  scene's dock icon and the incoming scene's subject with a shared
  `view-transition-name` and the browser morphs position/size/style between them, so
  the cube ↔ "Cube" dock icon (or scene-card ↔ hero) visually connect across the swap
  instead of a flat cross-dissolve.
  - Guide: `same-document-transitions` (modern-web-guidance) — "transition occurs in
    the top layer, above even elements with high z-index"; MANDATORY ≤1 element per
    `view-transition-name` per state. Baseline: same-document view-transitions +
    `view-transition-class` = **Newly Available** per glass-ui's own
    `view-transition.css` header.
- **The catch (honest).** App.vue's comment establishes that the async `<Suspense>`
  loader is fragile under wrapping transitions. View Transitions sidestep that exact
  trap: `startViewTransition(() => mutate())` wraps only the DOM MUTATION (the
  `activeSceneKey` flip), not a component that intercepts the async loader — so it is
  architecturally compatible where `<Transition>` was not. The glass-ui helper's
  instant fallback also means non-supporting engines (or the loader's first paint)
  degrade to today's hard-cut + the existing spring fade as a belt-and-suspenders.
- **Disposition.** **GAP-NAMED → FOLD-E** as a scoped experiment: adopt
  `useViewTransition` + the glass-ui `view-transition.css` substrate for the scene
  swap, keep the SpringProgress fade as the no-VT fallback, and (stretch) add a
  shared-element morph for the scene icon. This is the single biggest "be FULLY
  modern" lever in the demo's motion design AND it dog-foods the platform feature the
  library's own engine is conceptually adjacent to.
- **Isomorphism.** The supported-path swap CHANGES (a real VT cross-fade/morph vs a
  JS opacity ramp) — a deliberate motion upgrade. The unsupported path is unchanged.

### 4.2 — Scroll-driven animation substrate is shipped by glass-ui, unused by the demo `[OPPORTUNITY — MINOR/CONTEXTUAL]`
- **Where.** glass-ui ships `scroll-driven.css` (native `animation-timeline:
  scroll()/view()` recipes that move scroll-progress + stagger-reveal OFF the main
  thread — the INP lever). The demo uses none of it (grep: zero
  `animation-timeline`/`scroll(`/`view(` in `demo/`).
- **Assessment.** HONEST: the demo is a fixed-viewport editor (`overflow: hidden` on
  html/body, style.css:214) — there is essentially no page scroll to drive. The
  scroll-driven substrate is the right tool for a scrolling marketing/docs page, not
  this editor shell. The ONE place it could apply is the multi-track Easing comparison
  list (`EasingTarget.vue:59-95`, `overflow-y-auto`) — a scroll-progress indicator or
  scroll-reveal on the track rows is a candidate, but marginal.
- **Disposition.** **ALREADY-SOTA / N/A.** Do NOT manufacture scroll-driven work into
  a non-scrolling editor. Named only so the audit is exhaustive; revisit only if a
  scrolling docs/landing surface is ever added.

### 4.3 — Instrument Serif loads from Google Fonts with `font-display: swap` and NO calibrated fallback face (CLS on the hero) `[OPPORTUNITY — MED]`
- **Where.** `app/index.html:22-30` (and `playground/index.html:14-19`) load
  Instrument Serif from the Google Fonts CDN with `display=swap`, via the correct
  non-blocking `media="print"/onload` pattern + `<noscript>` fallback. `--font-display`
  / `--font-serif` resolve to `"Instrument Serif", Georgia, serif` (style.css:40-48).
- **The gap.** Instrument Serif is the demo's DISPLAY face — it paints the largest,
  most identity-bearing text (the `text-display-4` hero title, EditorStartScreen.vue,
  and every glass-ui display/title/heading rung). With `font-display: swap` and NO
  metric-calibrated fallback `@font-face` (Instrument Serif swaps directly to
  `Georgia`, a face with very different metrics), the hero title will visibly REFLOW
  when the CDN font arrives — a Cumulative Layout Shift on the largest element, on
  every cold load. Contrast: glass-ui self-hosts Fira Code + Plus Jakarta Sans with
  `@capsizecss/core`-derived `size-adjust`/`ascent-override`/`descent-override`
  fallback faces (typography.css:24-94) so THEIR swap is geometry-neutral (zero CLS).
  Instrument Serif gets no such treatment because it lives outside glass-ui's font
  subsystem (index.html:20 documents this explicitly).
- **Why it matters.** CLS is a Core Web Vital; the demo is otherwise scrupulous about
  layout stability (the critical-CSS inline at index.html:51-54 exists precisely for
  "layout-stable first paint"). The hero font swap undercuts that on the single
  biggest element.
- **Disposition.** **FOLD-E** the calibrated-fallback half (demo-owned): add a
  `@font-face { font-family: "Instrument Serif Fallback"; src: local("Georgia") …;
  size-adjust/ascent-override/descent-override: … }` (derive via `@capsizecss/core`,
  the exact tool glass-ui used) and append it to the `--font-display`/`--font-serif`
  stacks. **FOLD-VALUEJS-HANDOFF is NOT applicable** (this is glass-ui/demo font
  territory, not value.js). Optionally self-host the Instrument Serif woff2 to drop
  the CDN round-trip on the LCP path entirely (the demo already self-hosts Fira via
  glass-ui) — but the calibrated fallback is the high-value, low-cost half.
- **Isomorphism.** The resting (font-loaded) pixels are identical; the SWAP WINDOW
  becomes metrically neutral (no reflow). Pure stability win.

---

## §5 — Where the demo is ALREADY SOTA (don't manufacture work)

These are deliberately called out so the audit is honest about the high baseline:

- **Token discipline.** Effectively zero arbitrary Tailwind sizing/spacing values
  (the bracket scan found only `data-[state]` variants + `grid-cols/rows-[…]`
  templates, all legitimate). Effectively zero raw color literals in chrome (the 13
  hits are Three.js scene lights, the cube identity faces, `@supports` mask probes,
  and one default color-picker value — all justified content, not chrome).
- **The D.W2/3 idiom-ownership layer is real and holds.** `design-idioms.css` genuinely
  single-sources the rainbow family, gold accent, hover-lift scale, the tab-slide
  keyframe, layout tokens, and the `--z-behind` rung; `brand.css` correctly colocates
  the recurring ppmycota mark; the z-contract (style.css:11-37) is documented and
  semantic with no raw `z-[N]` drift. The rainbow idioms are consumed via tokens at
  every site (AnimationControlsGroup SVG gradient, KeyframesEditor progress bar,
  RibbonBar Apply, AnimationMenuBar play CTA) — coherent.
- **Layout math is sophisticated and correct.** The optical-balance offset pair
  (0.42:0.58, style.css:64-75), the cycle-free dock-band reserve (style.css:83-97),
  and the documented mobile work-area cap (style.css:172-205) reflect genuine craft;
  the dvh + `@supports not` fallback (EditorShell.vue:135-148) is the right pattern.
- **Reduced-motion authority is delegated to the engine and respected nearly
  everywhere** — App.vue scene-swap (`respectReducedMotion: true`),
  `.scale-on-hover` PRM block, the engine's own `CSSKeyframesAnimation` for the brush
  sweep (user-gated). The ONLY blind spot is AnimatedText (§1.2).
- **A11y is baked into the design, not bolted on.** SpringTarget's settled-badge
  contrast note (SpringTarget.vue:196-205, the C.W2 leaf), the `<main>` landmark
  reasoning (EditorShell.vue:34-40), the rail `role="slider"` + arrow-key scrubbing
  (SpringTarget.vue:24-33, 111-125), `aria-label`s throughout the dock.
- **Glass-ui consumption is idiomatic** — `glass-card`, `text-*` φ-ladder rungs,
  `--color-progress`/`color-mix` tinting, `DockSelectTrigger`/`StatusDot`/`Slider`
  variants, `dock-label`, semantic radius/shadow tokens. Matches the demo's own
  DESIGN.md self-assessment ("already well-aligned").
- **View-transition tooling availability is the only thing left to reach for** (§4.1) —
  and that's an upgrade, not a defect.

---

## Disposition summary

| # | Finding | Severity | Disposition |
|---|---------|----------|-------------|
| 1.1 | `--spring-snappy` stale divergent shadow | HIGH | FOLD-E |
| 1.2 | AnimatedText perpetual unguarded motion + invalid `200%` keyframe | HIGH | FOLD-E |
| 1.3 | Spring/Easing rails re-author a shared progress-rail idiom | MED | FOLD-E |
| 2.1 | `dock-inset` is a dead no-op class (latent layout bug) | MED | FOLD-E |
| 2.2 | `spring` scene has no dock icon (Home fallback) | MED | FOLD-E |
| 2.3 | Scene icon format drift (svg vs png) | LOW | BOOK |
| 2.4 | Start-screen "above" copy vs bottom dock | LOW | BOOK |
| 3.1 | Cube face raw primaries / no dark adapt | LOW | ALREADY-SOTA (content) · BOOK optional re-tone |
| 3.2 | grid-background hard black/white | LOW | ALREADY-SOTA-ENOUGH |
| 4.1 | Hand-rolled scene fade vs native View Transitions (glass-ui substrate unused) | OPPORTUNITY-MAJOR | GAP-NAMED → FOLD-E |
| 4.2 | Scroll-driven substrate unused | OPPORTUNITY | ALREADY-SOTA / N/A (no scroll) |
| 4.3 | Instrument Serif CDN swap, no calibrated fallback (hero CLS) | OPPORTUNITY-MED | FOLD-E |

**No value.js findings in this lane** — the demo-design surface consumes glass-ui +
the engine, not value.js's parser/color/units directly. (The value.js dependency
appears only as `Color`/`timingFunctions`/`camelCaseToHyphen` imports in scene logic,
which is correct usage, not a design gap.) Hence no `FOLD-VALUEJS-HANDOFF` items here.
