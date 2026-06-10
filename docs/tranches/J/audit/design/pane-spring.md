# Tranche-J Design Audit — Pane: Spring

> Lane: `pane-spring` | Breakpoints audited: mobile 375w, laptop 1280w, desktop 1440w (closed + open)
> Screenshots: `spring-{mobile,laptop,desktop}.png` + `-open` variants

---

## Composition Walk-through (before findings)

### What the eye sees first (desktop closed)

The stage card is a large, calm glass plate occupying ~60% of the horizontal canvas. Attention goes immediately to the two text strings sitting in the upper-left of that plate: the bold `SpringProgress` label and its inline `x = 1.000 · v = 0.00` telemetry. The interactive ball is positioned at the far right rail and only occupies roughly 1.75 rem — proportionally small given the vast glass expanse. The `SETTLED` badge draws a secondary accent at the top-right corner. The instruction prose and the `springTimingFunction sweep` section sit in the lower half, quietly sub-visual.

On laptop, the same structure holds; the stage card is slightly narrower at 1280w but the proportions are almost identical.

### Mobile (closed)

The entire visible area is the controls sidebar — only a sliver of the stage card is visible on the right. The spring icon + "Spring" dock title and the two-tab pill switcher float above. The view-mode segmented pill ("Live solver" / "Discrete transition") is partially clipped at the right edge by the sidebar: the right half of the second tab is behind the stage card edge.

### Panel-open state (laptop/desktop)

The rail pane (controls panel, `--rail-width: 400px`) is open on the left. Two stacked cards appear: the spring params card (response/damping sliders + four preset buttons + the canonical comparison row + the Monaco CSS output) and below it the PlaybackRibbon card (scrub slider + Pause/Reverse buttons + visualizer ball). The stage card sits to the right, clearly narrowed. The two cards in the rail are identical in surface (`cartoon + quiet`) and identical in rounded-card radius — visually cohesive. The stage card and the two sidebar cards all appear on one visual plane; there is no depth-layering reading that makes the stage the protagonist and the rail the chrome.

---

## Findings

| ID | Sev | Title | Screenshot region | Owner |
|----|-----|-------|-------------------|-------|
| SP-1 | P1 | Stage ball is the protagonist but reads as a footnote — vast empty glass above it | spring-desktop.png: upper two-thirds of stage card | kf-demo |
| SP-2 | P1 | `SpringProgress` heading rung (text-heading = φ ≈ 26px) is the same scale used by every scene — there is no display moment for this scene's mathematical identity | spring-desktop.png: upper-left of stage card | kf-demo |
| SP-3 | P1 | Mobile: "Discrete transition" tab label is clipped by the stage card right edge — the view switcher overflows its containment | spring-mobile.png: top of screen, tab pill | kf-demo |
| SP-4 | P2 | Preset labels in the sidebar comparison row use uppercase `text-mono-caption` (SMOOTH / SNAPPY / BOUNCY / GENTLE) which clashes with the Fira Code mono register — should be lowercase-mono or title-case to match the preset buttons above | spring-laptop-open.png: sidebar comparison row | kf-demo |
| SP-5 | P2 | Rail vs stage depth parity: both registers (`cartoon+quiet` panels and the glass-resting stage card) sit on exactly the same visual plane — no perceptible depth differential. The stage card is the protagonist but does not read as "closer" or "lit" relative to the controls chrome | spring-desktop-open.png: left rail vs right stage card | kf-demo |
| SP-6 | P2 | `springTimingFunction sweep` label is `text-small text-foreground` (14px, normal weight) and looks identical in weight to the `SpringProgress` heading's subtitle row — two levels, one visual weight | spring-desktop.png: lower stage card | kf-demo |
| SP-7 | P2 | The view-mode segmented control (`glass-resting cartoon-surface rounded-full`) is a hand-rolled pill tab — glass-ui ships `SegmentedTabs` (`variant="segmented"`) with a spring-animated indicator. The demo re-authors the pattern from scratch | spring-desktop.png: view switcher above stage card | glass-ui-handoff (adopt SegmentedTabs) → kf-demo |
| SP-8 | P2 | Ghost target marker (dashed ring) and the live ball both use `--color-progress` green at different opacities — the only color in the scene besides the spring icon's accent dot. No warm/cool contrast between the ball (where it IS) and the ghost (where it IS GOING), making the directionality harder to read at a glance | spring-desktop.png: interactive rail, right half | kf-demo |
| SP-9 | OPP | The stage card carries a large empty upper region above the rail (roughly the top 40% of the card). This is dead white glass — an opportunity to place an audacious display-type label (e.g. `text-display-2` "Spring" in Instrument Serif, `--color-progress`-tinted, low opacity) as a behind-the-rail watermark, suffusing the math-is-the-brand aesthetic | spring-desktop.png: upper half of stage card | kf-demo |
| SP-10 | OPP | The spring icon SVG (`assets/icons/spring.svg`) uses `--color-progress` for the wave path and `--rainbow-green` for the terminal dot. The icon is only ever rendered at `icon-sm` (16px) in the dock — the expressive color geometry is lost. A larger echo of the spring waveform could be a faint decorative motif behind the rail (at 10–15% opacity, it would read as mathematical texture, not noise) | spring-laptop.png: dock icon (top-center), stage card (empty space) | kf-demo |
| SP-11 | OPP | The `SETTLED` status badge is the one saturated accent on the stage card at rest. It's positioned top-right in small-caps mono — visually it wins first attention even though it is a secondary readout. Inverting the hierarchy: the live ball + the velocity telemetry should pop; the badge should recede (reduce `text-admin-label` to caption size, nudge opacity to 70%) | spring-desktop.png: top-right badge | kf-demo |
| SP-12 | OPP | The canonical-springs comparison row in the sidebar shows four preset balls travelling four rails — all the same green, same size, all settled at the right edge. When playing, the stagger is where the design language's "spring as math" lives. The green-only encoding squanders the rainbow family: assigning each preset a distinct hue from `--rainbow-{red,orange,blue,violet}` would make the four curves legible at a glance (bouncy in orange, gentle in blue, etc.) — a proportionate, befitting color pop in the one place the scene shows all springs simultaneously | spring-laptop-open.png: comparison row in sidebar | kf-demo |
| SP-13 | OPP | `springLinearStops() → CSS` section: the Monaco code block shows the raw `linear(…)` token — a technically rich output. A small labeled annotation above the code (e.g. "φ-sampled at 40 stops / ζ = 0.86") in `text-mono-caption` would suffuse the math/precision identity without adding noise | spring-desktop-open.png: bottom of sidebar | kf-demo |
| SP-14 | OPP | PlaybackRibbon's `Re-seat` button (the second row in the open panel) is styled `btn-interactive` while `Pause` is `btn-playback btn-playback-accent` — two visual registers side by side with no intentional difference. `Re-seat` is the spring's domain verb; giving it a mild `--color-progress` tint (or using the `btn-playback-accent` skin) would let it read as "the spring verb" rather than "another generic button" | spring-desktop-open.png: bottom of rail | kf-demo |

---

## Detail Notes by Finding

### SP-1 — Protagonist ball lost in empty glass

In `spring-desktop.png` the interactive ball sits at position x≈1175px on the stage (right end of the rail), occupying roughly 28px diameter in a 730×520 card. The upper ~200px of the card is entirely empty glass — a calm field that neither recedes as chrome nor acts as a stage. The animation target (the ball, the rail) is vertically centered but with `justify-center` and `gap-8` the three sections (header, rail, sweep) are spread across the full height with large gaps. The perceptual center-of-mass is the header text, not the ball.

**Source**: `demo/spring/SpringTarget.vue:12` — `class="flex flex-col items-center justify-center gap-8 h-full ..."`. Consider `justify-start` with generous but controlled top padding and a larger ball size to make the ball the unambiguous protagonist.

### SP-2 — Missing display moment for the spring's math identity

`text-heading` = 25.9px. The scene's primary label "SpringProgress" uses this rung — same as "Sequence" (SequenceTarget.vue:14) and "Easing" (EasingTarget.vue:21). There is no display-level typographic moment that announces this scene's mathematical identity. The φ-ladder offers `text-title` (32.9px) and `text-display-*` tiers that are only used on the start screen.

**Source**: `demo/spring/SpringTarget.vue:17` — `class="text-heading text-foreground truncate"`. Promoting to `text-title` (φ^(3/2) ≈ 33px) or pairing with a smaller Instrument Serif display label would establish a clear hierarchy without redesigning the card.

### SP-3 — Mobile view-tab clipped

In `spring-mobile.png` and `spring-mobile-open.png` the two-tab pill is positioned above the stage card. At 375px the pill renders at the full viewport width (it has `align-self: center`) but the stage card's left edge begins at approximately pixel 330, so the "Discrete transition" label is cut off at roughly "Discrete transi—". The view switcher is inside `SpringScene.vue`'s outer `flex flex-col items-center` wrapper at `demo/app/scenes/SpringScene.vue:2`. The `spring-view-switch` class only adds `align-self: center` — no max-width or overflow handling.

**Proposed fix**: add `max-w-[calc(100vw-2rem)]` or `w-full` to the pill wrapper so it fills and wraps rather than overflowing the stage card boundary on narrow viewports.

### SP-4 — Uppercase preset names conflict with Fira Code register

The sidebar comparison row at `demo/spring/SpringSidebar.vue:58` uses `class="preset-label text-mono-caption ..."` with values like "SMOOTH", "SNAPPY" etc. These are rendered uppercase because the preset `name` field in `springPresets.ts` is lowercase ("smooth") — the uppercase rendering comes from CSS `text-transform` inherited from somewhere in the admin-label chain, or these are in fact uppercase in the DOM. Looking at `style.css` the `text-admin-label` register is 10px uppercase mono. The preset button spans above these labels at line 45 render the SAME `t.preset.name` with `capitalize` class — so we get "Smooth" in the button but "SMOOTH" in the comparison row. This is inconsistent.

**Source**: `demo/spring/SpringSidebar.vue:45,58`.

### SP-5 — No depth differential between stage and chrome

The `<Card :shadow="false">` at `SpringTarget.vue:10` suppresses the card shadow (the I5-shadow fork). Both the stage card and the two sidebar cards are flat glass surfaces. The I5 rationale ("the plate sits inside the dock-band-reserved `.stage-cell`; a drop-shadow reads as noise") is valid, but the result is three flat cards at identical visual altitude. The eye cannot distinguish "stage" from "chrome" by surface alone. A single thin ring-shadow on the stage card (e.g. `box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-progress) 12%, var(--border))`) would signal "this is the stage" without noise.

### SP-7 — Hand-rolled segmented pill vs. glass-ui SegmentedTabs

`demo/app/scenes/SpringScene.vue:8` authors a `role="tablist"` with `glass-resting cartoon-surface rounded-full` and two `role="tab"` buttons. glass-ui exports `SegmentedTabs` (dist/components/custom/tabs/SegmentedTabs.vue) with `variant="pill"` that provides a spring-animated indicator behind the active option — exactly what this switcher needs. The hand-rolled version has no animated indicator; the `spring-view-active` class just changes color/background instantly.

**Proposal**: replace the hand-rolled pill with `<SegmentedTabs variant="segmented" :options="[{value:'solver',label:'Live solver'},{value:'discrete',label:'Discrete transition'}]" v-model="demo.view.value" />`. The spring indicator IS the brand — a spring-eased tab indicator on the spring scene's own view switcher is a perfect suffusion moment.

### SP-12 — Four green balls: squandered rainbow opportunity

`demo/spring/SpringSidebar.vue:62-64` renders each preset's `.preset-ball` with no per-preset color override — all four balls inherit `--color-progress` (the global green). The design language reserves the rainbow family for expressive pops. The canonical-springs comparison row is the one place the demo shows four distinct spring personalities simultaneously: assigning each a token from the rainbow family (`--rainbow-red` for bouncy, `--rainbow-orange` for snappy, `--rainbow-blue` for gentle, `--color-progress` for smooth — or any cohesive mapping) costs four CSS custom property overrides but gives the row visual identity. The four-ball rainbow moment would make the comparison legible without prose.

---

## Glass-UI Gaps / Handoff Items

| Item | Kind | Evidence | Proposal |
|------|------|----------|----------|
| `SegmentedTabs` not used for the spring view switcher | ADOPT | `SpringScene.vue:8-32` — hand-rolled `role="tablist"` pill with no animated indicator | Replace with `<SegmentedTabs variant="segmented">` from glass-ui; the spring-animated indicator suffuses the brand |
| `cartoon-surface` primitive has no default border-radius | REFINE-IN-GLASS-UI | design-idioms.css:505-523 — the I4 comment documents that `rounded-card` lives on `<Card>`, NOT on `cartoon-surface`; a bare `cartoon-surface` div is born-square | Add `border-radius: var(--radius-card)` to `@utility cartoon-surface` in glass-ui cards.css; makes the safe default rounded (the kf-demo gate greens now via `<Card>`, but the glass-ui primitive remains unsafe for new consumers) |
| Status badge depth/size token | ABSTRACT-INTO-GLASS-UI | `design-idioms.css:411-456` — `.status-badge / .settled-badge / .tracking-badge / .reverse-badge` are four rules the demo owns locally but the pattern (hue-tinted pill with AA-contrast text mix) is general | Promote to glass-ui as a `<StatusBadge tone="progress|muted|violet">` primitive or at minimum as a CSS recipe in glass-ui's utilities layer |
