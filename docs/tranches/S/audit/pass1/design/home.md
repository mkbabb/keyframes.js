# Home / Start Screen — S pass-1 design audit

> Screenshots: `docs/tranches/S/audit/pass1/design/screenshots/home-{mobile,laptop,desktop}.png`
> Source spine: `demo/app/App.vue`, `demo/@/components/custom/editor-shell/EditorStartScreen.vue` +
> `useHeroSourceEgg.ts` + `EditorShell.vue`, `demo/@/components/custom/dock/ChromeDock.vue`
> Prior treatment: `docs/frontend-design/demo/home.md` (the L-era drafting-table doc — largely IMPLEMENTED)

**Grade: B — a genuinely distinctive, engine-dogfooding landing whose first-run
wayfinding (an anonymous collapsed dock + copy that points the wrong way) and a
hollowed-out mobile experience hold it off the A.**

---

## 1. Product truth — what the page IS and is FOR

Home is a distinct machine state, not a scene: `CubeScene` rendered as a passive
backdrop (`hideLoader`, no group registered, no control surfaces — App.vue:314–332,
the home↔cube split) under the `EditorStartScreen` overlay (App.vue:104–116;
EditorShell.vue:46–52). Its job is to (a) make a first impression for a CSS
`@keyframes` engine — which it does via the Instrument-Serif mega hero riding the
engine's own `AnimatedText`/`TypingDots`, the graph-paper substrate
(EditorShell.vue:213–235), and the L.W11.S1 live `@keyframes` source card that
types, parses (`CSSKeyframesAnimation.fromString`), lifts the hero, and serializes
back (`useHeroSourceEgg.ts:62–119`) — and (b) route the visitor into a scene,
for which the ONLY authority is the ChromeDock's scene `<Select>`
(ChromeDock.vue:269–305), a top-center pill that starts collapsed to an icon
circle (`:start-collapsed="true"`, ChromeDock.vue:197).

## 2. Usability · affordance discoverability · interactability

### What a first-time visitor can find unaided

- **The hero instruction** ("Select an animation from the list ☰ below, then
  press Play. / or drag M. cubert") — legible at every breakpoint; it is an
  empty-state caption rather than a pitch (the prior treatment's finding §1
  stands: the moat sentence never shipped; only the egg did).
- **The transport pill** (reset / clear / rainbow-play, bottom-center) — the
  strongest affordance on the page; the rainbow play chip reads as the "Play"
  the copy names.
- **The live source card** (desktop only) — self-animating, so it advertises
  itself; its hover-recompile (`@pointerenter="recompile"`,
  EditorStartScreen.vue:98, useHeroSourceEgg.ts:131–136) is a delightful but
  entirely undiscoverable interaction (no cursor change, no hint).

### What is hidden

- **THE SCENE LIST — the page's single most important control.** The dock
  starts collapsed (`start-collapsed`, ChromeDock.vue:197) to a frosted circle
  holding only a `text-muted-foreground` Home glyph (ChromeDock.vue:329–332).
  In all three screenshots it reads as a blurred gray smudge — indistinguishable
  from decoration. Nothing signals "hover/tap me to get the scene list." Desktop
  users must *happen* to hover it; mobile users must *happen* to tap it. For the
  sole scene-switching authority on the landing page, this is the page's
  cardinal discoverability failure.
- **Directional copy bug.** The subtitle says *"from the list below"* — but the
  dock is anchored **top**-center (`top: var(--dock-top-anchor)`,
  ChromeDock.vue:189). The only thing "below" is the transport pill, which holds
  no list. The one instruction the page gives points away from its target
  (defaults at EditorStartScreen.vue:148–150). The inline `<List>` icon
  (EditorStartScreen.vue:72) *looks* like it might be a button; it is inert.
- **Cube draggability.** The hint says "or drag M. cubert" but the cube gives
  no grab tell — no cursor affordance visible at rest, no idle nudge (the prior
  doc's micro-interaction #3 never shipped). The ZWJ emoji `🙂‍↔️` (App.vue:115)
  renders as a fallback plain/zany face on platforms without the head-shaking
  sequence (visible in the screenshots), muddying the joke.
- **Keyboard path.** Scene switching by keyboard requires the dock's Select
  trigger to be focusable while the dock is collapsed/expanded — the collapsed
  layer goes `visibility:hidden` on the expanded content (per the BLK-8/D9
  commentary, App.vue:388–418), so the tab-order path into the scene Select from
  a cold collapsed dock needs runtime verification. The `?` shortcuts modal is
  discoverable via the header-ribbon keyboard icon (EditorShell.vue:24–34) —
  good.

### Feedback loops, empty/loading states

- Scene switch rides a View Transition with focus routed to the scene host on
  `finished` (App.vue:380–386) — good. `@pointerenter` scene warming
  (ChromeDock.vue:295) makes picks feel instant. The Suspense fallback
  ("Loading scene…", App.vue:161–165) covers the async chunk.
- Pressing Play on home: home registers **no** animation group (App.vue:314–318)
  — the instructed CTA lands on a transport bound to an empty group. What "then
  press Play" does *on this page* is at best a no-op until a scene is picked;
  the copy promises a payoff the state machine can't deliver from home.

### Touch targets

Dock circle and transport buttons are comfortably ≥40px. The `rx 0° ry 0° rz 0°`
telemetry (bottom-left) is decorative mono at ~10px — fine as texture, but at
375px it crowds the transport pill's left edge (home-mobile.png).

### Mobile (375px) specifically

1. The collapsed dock circle is even more anonymous at phone scale — and it is
   the ONLY nav (no swipe, no on-canvas list).
2. The hero band works (the J.W7a TYP-1 step-down landed; no cube collision),
   but the **middle third of the screen is empty paper**: the source-card egg is
   `display:none` below lg (EditorStartScreen.vue:263–267), so mobile home has
   no moat moment at all — just instruction text and a distant cube.
3. "from the list below" is doubly wrong on mobile — the list is above, behind
   an unlabeled circle.
4. The hint emoji fallback (above).
5. Telemetry/transport crowding (above).

### Laptop (1280px) regression

In home-laptop.png the hero wraps to two lines and the `TypingDots` ellipsis —
carrying the `depth-text` cartoon shadow — lands **directly on top of the red
cube**: three dark dots floating on the subject's face. The mobile collision was
cured (TYP-1) but the 1024–1366 band has its own hero/subject overlap. At 1440+
the single-line hero clears it.

## 3. Aesthetic critique — against the glass-ui system

- **Typography: the page's crown.** Instrument Serif at `text-display-mega`
  with the 0.92 poster leading (EditorStartScreen.vue:175–177), the φ-rung
  subtitle ladder, Fira Code as the machine voice in the egg card and telemetry.
  The serif-intent/mono-output conversation the design doc named is real and
  visible. Distinctive — nothing Inter-flavored anywhere.
- **Color: disciplined crayon.** One dominant red: the cube, the egg's caret +
  LIVE dot (`--accent-red`, EditorStartScreen.vue:296–301, 322–330), the axis
  crayons; the rainbow family fires exactly once, on the play chip. This is the
  proportioned-crayon verdict, honored.
- **Motion: the dogfood is now visible** — the single biggest win since the L
  treatment. The egg card parses the same string it types and the hero lifts on
  the engine's clock (useHeroSourceEgg.ts:72–96), then serializes back — the
  round-trip moat rendered. `TypingDots` and `AnimatedText` are engine-driven.
  What's missing is the *orchestrated arrival*: at t=0 everything simply exists
  (only the egg card has an entrance, `kf-source-rise` at
  EditorStartScreen.vue:261); the ≤900ms staggered curtain-up (prior doc,
  MOTION #2) never shipped.
- **Composition.** The desktop diagonal (hero top-left → cube center → egg
  lower-left) is asymmetric and confident; the graph paper gives it a drafting
  table read. Remaining flatness: the substrate is uniform to the horizon (no
  vignette/grain — prior doc BACKGROUND items unshipped), and the lower-right
  quadrant is dead at every width.
- **Memorable or generic?** Memorable. A serif mega-hero on engineering graph
  paper with a self-compiling `@keyframes` card is not a template anyone else
  ships. The page is an instance of its own engine — the bar the design doc set
  — on desktop. On mobile it degrades to a generic caption-over-object.

### The ChromeDock as scene-switching authority

Expanded, the dock is excellent: DFA-gated controls triad (correctly absent on
home — `hasControlPanel` false, ChromeDock.vue:101), icon+StatusDot scene rows,
warm-on-hover, `@mbabb` menu. Collapsed, it fails its authority role: an
icon-only circle (K.W4 F6's necessary label-clip fix, ChromeDock.vue:314–332)
with a muted-foreground glyph carries zero "menu lives here" semantics on a page
whose copy explicitly directs users to "the list." Desktop hover-to-expand is
learnable; mobile tap-to-expand is pure luck. The one thing the collapsed circle
must communicate — *scenes are inside* — it does not.

## 4. Ranked tasteful refinements (wave-shaped)

1. **W1 — Fix the directional copy + make the List glyph live.**
   WHAT: change the subtitle defaults ("below" → "up top" / "in the dock") and
   make the inline `<List>` icon a real button that opens the dock's scene
   Select (emit up to App → `sceneSelectOpen`).
   WHERE: EditorStartScreen.vue:70–73, 148–150; ChromeDock.vue:159 (expose the
   popup model), App.vue:104–116.
   WHY: the page's only instruction currently misdirects; one word + one wired
   icon converts the caption into a working affordance.

2. **W2 — First-visit dock reveal.**
   WHAT: on home first-load, mount the dock EXPANDED and let the existing
   2500ms `collapse-delay` teach the collapse (a `:start-collapsed="!isHomeFirstVisit"`
   prop threaded from App; persist the seen-flag in the existing stored
   controls).
   WHERE: ChromeDock.vue:197; App.vue dock props.
   WHY: the sole nav authority must be *seen once* to be findable; the collapse
   animation itself then teaches where it lives.

3. **W3 — Cure the 1024–1366 hero/cube collision.**
   WHAT: a scoped media rule for the laptop band — either step the hero to
   `--type-display-4` up to ~1366px (extend the existing 1023px rule) or cap
   `max-inline-size` so the TypingDots never wrap onto the subject.
   WHERE: EditorStartScreen.vue:186–190 (extend the pattern); evidence
   home-laptop.png.
   WHY: dark ellipsis dots sitting on the red cube is the same TYP-1 class of
   collision the tranche already outlawed — one band was missed.

4. **W4 — Mobile round-trip, one line.**
   WHAT: replace the egg's `display:none` below lg with the prior doc's SPATIAL
   fallback — a single typed mono line under the hint
   (`20% { transform: translateY(-22px); }` + caret), driving the same hero
   lift; no card chrome.
   WHERE: EditorStartScreen.vue:263–267 + a compact variant of the egg markup;
   useHeroSourceEgg.ts unchanged.
   WHY: mobile home currently has zero moat moment and a large empty paper
   band; one line restores the signature without re-fighting TYP-1.

5. **W5 — Tie "press Play" to its target.**
   WHAT: a one-shot crayon-red attention ring on the transport play chip ~4s
   into home idle (PRM-skipped) — and gate the copy/pulse on the group actually
   having something to play, or route home's Play to `runSceneSwitch('cube')` +
   autoplay so the promised payoff exists.
   WHERE: PlaybackRibbon/TransportDock (animation-controls), App.vue:363–376.
   WHY: the instructed CTA is currently unmarked and, on home, semantically
   empty.

6. **W6 — The drag tell.**
   WHAT: after ~3s idle, one slow 15° nudge-and-return on the cube (a one-shot
   real `CSSKeyframesAnimation`; PRM skip) — the universal "grab me" signal the
   hint copy already promises.
   WHERE: scenes/cube (CubeTarget), gated on `isHome`.
   WHY: prior doc micro-interaction #3, still unshipped; the hint currently
   sells an affordance with no tell.

7. **W7 — Egg card honesty: copyable + described.**
   WHAT: make the `// serialized →` line a `CopyButton` press target (the demo
   already owns the component), swap `aria-hidden="true"` for `role="img"` +
   `aria-label="Live @keyframes source: the engine parses this block, animates
   the title, and serializes it back to CSS"`.
   WHERE: EditorStartScreen.vue:96–115.
   WHY: the design doc promised "actually copyable"; and an interactive,
   pointer-enabled card that is `aria-hidden` hides the page's best story from
   AT entirely.

8. **W8 — Emoji hardening.**
   WHAT: replace the ZWJ `🙂‍↔️` with a broadly-supported glyph or a tiny inline
   drag-arrows SVG in the hint.
   WHERE: App.vue:115.
   WHY: the fallback rendering (a plain face) breaks the joke and reads as a
   glitch in the screenshots.

## 5. The easter egg (one, on-aesthetic)

**"M. cubert says wheee."** The bottom-left mono telemetry (`rx 0° ry 0° rz 0°`)
is the page's machine voice. When a visitor drags the cube through a full 360°
on any axis, the readout — for one beat — breaks register: it flips from Fira
Code to Instrument Serif italic crayon-red (*"wheee — rx 360°"*), then settles
back to mono as the angle normalizes. Cheap (one watched threshold on the
orbital-drag quaternion + a CSS class swap, PRM-safe since it's a text/color
swap, not motion), discoverable exactly via the existing "or drag M. cubert"
hint, and perfectly in the page's own voice: the serif/mono conversation —
human intent vs machine output — collapsing into one line when the machine,
briefly, has fun.

## 6. Accessibility notes (from source)

- **PRM discipline is exemplary**: the egg rests on the completed block with no
  typing/lift (useHeroSourceEgg.ts:138–146), caret blink gated on
  `no-preference` (EditorStartScreen.vue:331–335), entrance animation disabled
  (268–272); VT degrade rides glass-ui's view-transition.css (App.vue:466–469).
- **Focus routing**: scene host `tabindex="-1"` receives programmatic focus on
  VT `finished` with the ring suppressed (App.vue:470–487) — correct.
- **ARIA**: dock triggers carry `aria-label`s ("Scene", "Controls tab",
  "@mbabb menu" — ChromeDock.vue:230, 275; App.vue:44). The collapsed dock
  circle's accessible name is glass-ui's — verify it announces as the scene
  menu, not just "Home". The egg card is `aria-hidden` yet pointer-interactive
  (see W7). The `hint`/`subtitle` are `<h2>`s used decoratively — heading-level
  semantics for what is really a paragraph pair; harmless but `<p>` would be
  truer.
- **Contrast**: near-black serif on paper is strong; `text-muted-foreground`
  hint italic is the floor — verify ≥4.5:1 in dark mode. Graph lines at 3%/11%
  are decorative (correctly non-semantic). The collapsed dock's
  muted-foreground glyph inside a frosted circle is a *visual* contrast
  problem more than a WCAG one — it's the discoverability finding wearing its
  contrast hat.
- **Keyboard**: `?` shortcuts modal + visible header trigger
  (EditorShell.vue:24–34, 165) — good. The collapsed-dock → scene-Select
  keyboard path needs a runtime check (the expanded layer's
  `visibility:hidden` collapse could orphan focus).
