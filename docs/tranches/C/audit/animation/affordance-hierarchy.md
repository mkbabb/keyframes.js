# Affordance + Design Hierarchy — the synthesis lens

**Tranche C · audit/animation · inv ζ (dogfood the engine) · LANE: affordance + design hierarchy**

**Scope (inv-16).** READ across all repos (dock = glass-ui-owned; slides = its
own repo; the engine = keyframes.js); WRITE only under `keyframes.js`. This
report is AUDIT + RECOMMENDATIONS routed outward — never a patch of vendor
source. Every finding is grounded in `file:line`; the empirical numbers are the
sibling lanes' captured measurements (local chromium-1223, `/tmp/kf-audit`),
re-used not re-run, and the AFTER screenshots
(`docs/tranches/B/audit/screenshots/after/*.png`).

**This is the synthesis lens.** The sibling lanes measured the motion:
`ios-dock-animation.md` (the dock's six-interaction vocabulary, the FLIP-vs-VT
divergence, the dead press affordance), `slides-facility.md` (the deck's
monotone cross-dissolve, the silently-broken count-up, the swipe-flick), and
`dock-harden.md` (the adversarial pass — the two-tap bug, the VT-path non-spring
bezier as the real motion gap). This lane reads those three through ONE design
question: **does each surface SIGNAL its interactivity and rank its content
through motion + form — and is that signalling expressed through the keyframes
engine's primitives?** The thesis: across the constellation, **VISUAL hierarchy
is excellent and AFFORDANCE is strong but STATIC; MOTION hierarchy and KINETIC
affordance are the uniform gap** — and the gap is one design language, not a list
of bugs. The fix is a single principle: *motion is an affordance and a hierarchy
channel, and the engine that ships the iOS spring is the channel's source of
truth.*

---

## Part I — The two axes, stated

The principles of animation that this lane owns —
**affordance** (does it signal interactivity?) and **design hierarchy** (visual
+ MOTION: what is ranked, and does the choreography stage by importance?) — split
the constellation cleanly along an axis the other lanes circle but do not name:

| | **STATIC (form, layout, type, color)** | **KINETIC (motion, spring, choreography)** |
|---|---|---|
| **Affordance** | **STRONG** — cursor:pointer, hover-scale, chevron glyphs, edge arrows, dots, ARIA roles | **WEAK** — surfaces rarely *move to invite*; press is monotone; pages never peek; no finger-track |
| **Hierarchy** | **EXCELLENT** — the φ golden-ratio type ladder, the glass tiers, the dock density rungs | **WEAK** — everything rides ONE monotone cubic; no spring differentiation; no staged choreography |

The constellation has **mastered the static quadrants and barely touched the
kinetic ones** — even though it *ships the engine* (`SpringProgress`,
`springTimingFunction`, `Timeline`, `NumericAnimation`) that fills them. The
diagonal is the whole finding: static is done, kinetic is the work, and the
kinetic tools are one import away.

---

## Part II — VISUAL hierarchy (the strong axis) — grounded

### II.1 — The φ type ladder is exact and complete

glass-ui's type scale is a true golden-ratio ladder
(`glass-ui/src/styles/typography.css:104-123`):

```
--type-caption    0.75rem    --type-subheading 1.272rem (√φ)   --type-display-2 φ^(5/2)
--type-small      0.875rem   --type-heading    1.618rem (φ)    --type-display-3 φ^3
--type-body       1rem       --type-title      2.058rem (φ^3/2) ... → display-audacious φ^(11/2)
--type-prose      1.125rem   --type-display-1  φ^2
```

Each rung is a `clamp(min, fluid, max)` so the ladder scales fluidly with
viewport — the φ ratio holds at every breakpoint. The `--space-phi-*` spacing
rungs (`tokens.css:899-900`, φ²/φ³) and the instrument-rail's `1/φ²` cockpit
flex-basis (`instrument-rail.css:6,23`) extend the same constant to layout. This
is a **principled, single-authority visual hierarchy** — there is no ad-hoc
font-size in the dock or the deck; both consume the rungs. The AFTER screenshots
confirm it: the `spring-desktop.png` panel reads as a clean three-tier
stack (heading "response/dampingFraction" → preset cards → the `linear()` code
block), each tier visibly on its φ-rung.

### II.2 — The glass + density tiers rank surfaces by depth

The dock's control sizing is a documented density ladder
(`dock.css:92,107,120,137`): compact `2rem` → comfortable `2.5rem` → spacious
`2.75rem` → audacious `4rem`, with a `@media (pointer:coarse)` floor of `2.75rem`
= 44px (`dock.css:1134-1137`, the WCAG/HIG touch target — a LANDED feature, per
`dock-harden.md §A4`). The glass-wash shadow tiers
(`--glass-border-wash`/`--glass-shadow-wash`) layer the dock above the canvas
above the backdrop. **The depth hierarchy is real and tokenized.**

### II.3 — But the VISUAL hierarchy has ONE empirical defect: mobile z-order/staging collision

`home-mobile.png` and `cube-mobile.png` show the hero type "Select an
animation" / "from the list above" **overlapping the 3D cube** — the φ-ladder
display type wraps to three lines and collides with the cube's render layer, and
the cube's axis-lines cross the text. This is a *static* hierarchy break (two
primary elements competing for the same cell with no z-separation or reflow), but
it has a *motion* remedy the engine enables (II.3 → V.3): on a narrow viewport
the hero and the cube should not co-occupy; a staged entrance (hero settles, then
the cube scales in *behind* it, or the hero yields) would resolve the competition
by **time-separation** — exactly what a staged `Timeline` / `NumericAnimation`
delay-ladder does. Today nothing stages, so both land at once and fight.

**Visual-hierarchy verdict:** A-grade, one mobile collision to resolve. The
strong axis. The lane's weight is on the other three quadrants.

---

## Part III — AFFORDANCE — strong static, weak kinetic (the disclosure question)

### III.1 — The dock collapsed-pill: does it read "tap to open"? (the WAVE-1 question, answered)

The WAVE-1 disclosure question — *does the collapsed pill signal it's a
single expand target?* — splits into a STATIC answer (yes) and a KINETIC answer
(no), and the split is the finding.

**Static affordance: present, but consumer-supplied, not base-owned.** The base
`GlassDock` collapsed summary slot
(`glass-ui/src/components/custom/dock/GlassDock.vue:363-369`) is a bare
`<div @click="onClickCollapsed"><slot name="collapsed"/></div>` with
`cursor: pointer` (`dock.css:296`) and a `:hover` scale to
`--dock-collapsed-hover-scale` = `--scale-hover-dock` = 1.1
(`dock.css:312-316, 58`; `tokens.css:981`). So the pill *does* cue clickability
(cursor + grow-on-hover). The **disclosure glyph** — the "there's more here"
chevron — is hand-rolled by the consumer:
`keyframes TopDock.vue:217` renders a `<ChevronDown class="icon-xs
text-muted-foreground"/>` inside `#collapsed`. **keyframes already answers the
static half of the WAVE-1 question** — its collapsed pill carries the chevron the
base lacks. (This is the affordance `dock-harden.md §A1` orbits: shape (A)
"pill = pure disclosure" vs a live-control pill — the *form* cue is present
either way; the question is whether the *action* fires on tap.)

**Kinetic affordance: ABSENT — the pill never MOVES to say "open me."** On
hover the pill scales 1.0→1.1 through `--dock-motion-fast` =
`var(--duration-fast) var(--ease-standard)` = **0.2s `cubic-bezier(0.4,0,0.2,1)`**
(`dock.css:20`; `tokens.css:169`) — measured **monotone, peak 1.1000, no spring,
settle ~210ms** (`ios-dock-animation.md` II.3, `/tmp/icon-scale-probe.mjs`). iOS
collapsed mini-bars (Now-Playing, Dynamic Island) signal "tap to expand" by a
*spring lift* — a small overshoot-and-settle that reads as a physical surface
rising to meet the finger. Here the lift is a flat ramp: it grows, it stops. The
chevron is a static glyph, not a *breathing* one. **The pill SAYS "tap to open"
in form and SAYS NOTHING in motion** — and the engine ships the exact lift
(`springTimingFunction({response:0.3, dampingFraction:0.7}).css` → a `linear()`
that drops into `transition-timing-function`).

### III.2 — Icon press/hover hit-state: the affordance is half-served

Every dock icon's press and hover (`dock.css:743-751`):
`:hover → scale 1.1` (`--scale-hover-dock`), `:active → scale 0.92`
(`--scale-press-dock`, `tokens.css:983`), both through the same monotone
`--dock-motion-fast`. **The scale *direction* is correct iOS affordance** (press
shrinks under the finger, hover lifts) — but the *feel* is wrong: there's no
anticipation (no press-down bite), no follow-through (no elastic release
overshoot). On iOS the release springs back ~+3% past rest and rings; here it
snaps to 1.0 on a cubic. **The affordance principle is half-served: the form
answers the touch, the motion does not.** This is `ios-dock-animation.md`'s
Finding II.3 read as an *affordance* gap rather than a *timing* gap — they are the
same gap, and that's the point of this lane: timing IS affordance here.

The AFTER screenshots show the play button as the one icon that earns motion
weight — `home-desktop.png`/`cube-mobile.png` render it with the rainbow conic
fill (`spring-desktop.png` shows it filled orange in the playing state). That
color treatment is a *static* primary-action signal (good design hierarchy — the
primary control is chromatically loudest). But even the primary control's
press/hover rides the same flat cubic as every secondary icon — so the **most
important button has the same kinetic affordance as the least**. The hierarchy is
expressed in color, not in motion.

### III.3 — The slides paging affordance: strong static, zero kinetic (the headline gap)

From `slides-facility.md` §5, read through the affordance lens: the deck has
**multiple redundant STATIC paging affordances** (keyboard, edge-zone arrows,
dock prev/next, the windowed φ-scaled dot-pager with an edge-clip "more beyond"
cue at `deck.css:594`, the progress bar, deep-link hash, aria-live announcements)
— a model of WCAG-2.5.1 accessible paging. But **zero KINETIC affordance**: the
deck never MOVES to say "there's a slide over there." The swipe is a
threshold-flick (`useDeckNav.ts:106`: `|dx|>44 → discrete go()`) with **no
`touchmove` handler** — the page does not follow the finger, there's no peek, no
rubber-band resistance at the ends, no momentum carry. The transition itself is a
monotone cross-dissolve (`deck.css:200`) measured to settle with **zero
overshoot** (`slides-facility.md` §2.2). **The single biggest iOS-feel miss in
the constellation is a kinetic-affordance miss: the deck communicates "this
pages" through static chrome and never through motion.** The user is *told* it
pages; they never *feel* it page.

### III.4 — GlassCarousel: the one surface with kinetic affordance — proving the pattern

`glass-carousel` is the counter-example that proves the thesis. It DOES carry
kinetic affordance: `fadeOverflow` overflow-fade indicators (`GlassCarousel.vue:16,23,106`)
that cue "more beyond the edge," a `scale(var(--scale-press))` press feedback on
items (`GlassCarouselItem.vue:73`), and its size/transform transitions ride
`var(--spring-snappy)` (`GlassCarousel.vue:136-144`, `GlassCarouselItem.vue:59-63`)
— so it *springs* where the dock and deck use monotone cubics. **It is the
constellation's proof that the spring-token affordance works** — and it's the
surface the deck should learn from. (Its FLIP expand/collapse is a 6-deep
`nextTick`/`setTimeout` rect-morph pyramid, `useGlassCarousel.ts:137-208` — the
hand-roll `ElementMorph` should own; `slides-facility.md` R8. The *affordance* is
right; the *implementation* is the fold.)

**Affordance verdict:** static affordance is a model (chevrons, cursors, dots,
ARIA, edge cues). Kinetic affordance exists on exactly ONE surface
(glass-carousel) and is absent on the two highest-traffic ones (the dock pill,
the deck page). The engine ships the fix for both.

---

## Part IV — MOTION hierarchy — the uniform gap

This is the lane's core finding, and it is the *same* root as the kinetic
affordance gap. **Design hierarchy has two channels — visual and motion — and the
constellation expresses hierarchy almost entirely in the visual channel.**

### IV.1 — Everything moves with the same character → no motion hierarchy

The motion-hierarchy test: *does what-moves-first / what-moves-most draw the eye
to what-matters-most?* Today, across all three surfaces, **every moving thing
rides one of two monotone cubics**:

- **Dock:** icon hover/press, layer crossfade, dark-mode toggle, layer-tab — ALL
  `--dock-motion-fast` = `0.2s cubic-bezier(0.4,0,0.2,1)` (`dock.css:730-733,
  416,434,650-651,762-766`). Only the width-morph springs
  (`--dock-motion-resize` = `--spring-snappy`, `dock.css:22`) — and even that
  is FROZEN/time-compressed (`ios-dock-animation.md` II.1) and FORKED to a
  non-spring bezier on the VT path users actually see (`dock-harden.md §B` — the
  `--vt-ease` = `cubic-bezier(...,1.275)`, +27.5% overshoot, no settle).
- **Deck:** page transition, content reveal, pager pill, edge arrow — ALL the
  deck's two cubics (`--ease-standard`/`--ease-out`, `deck.css:119-120,200`).
- **Net:** the page change (primary), the content settle (secondary), and the
  affordance accent (tertiary) **all move identically**. There is no primary vs
  secondary motion; nothing is staged by importance.

iOS earns motion hierarchy through **spring differentiation**: a *snappy* spring
for the primary page change, a *smooth* spring for the secondary content settle,
a *bouncy* spring for a delightful accent, a *gentle* spring for ambient fills.
**The constellation already ships that exact four-spring vocabulary** —
`--spring-snappy`/`-smooth`/`-bouncy`/`-gentle` (`tokens.css:158-161`), each an
exact `springLinearStops()` output of a keyframes `(response, dampingFraction)`
preset (`ios-dock-animation.md` II.0 recovered them: smooth ζ0.86, snappy ζ0.65,
bouncy ζ0.45, gentle ζ1.0). **The dock uses one of the four; the deck uses none.**
The motion-hierarchy vocabulary is in the building, fully tuned, and unconsumed.

### IV.2 — The spring demo itself models the hierarchy the rest lacks

`spring-desktop.png` is the engine's own demo, and it is the one surface that
*shows* a motion hierarchy — the "canonical springs — re-seat all together" panel
animates the four springs (smooth/snappy/bouncy/gentle) as four simultaneous
tracks, each ball settling on its own curve, so the eye reads the *difference* in
character. **The demo teaches the exact vocabulary the dock and deck should
adopt** — it is the dogfood reference. The gap is that the chrome AROUND the demo
(the TopDock, the bottom transport bar) does NOT itself use that vocabulary: the
demo *displays* four springs while its own dock animates on one cubic. The engine
demonstrates its motion hierarchy in content and abandons it in chrome.

### IV.3 — The staging gap (choreography by importance)

No surface stages its content by importance. The dock expands all children at
once (`ios-dock-animation.md` III.6 — the "everything at once" anti-pattern; iOS
docks *unfurl*). The deck reveals DO stagger (`deck.css:481`, `--d × 0.09s` — the
one good staging in the constellation, `slides-facility.md` §2.3) but on a cubic,
not a spring, and the *page* doesn't stage relative to its *content* (content
should enter AFTER the page settles; here they overlap). The mobile home
collision (II.3) is a staging absence: hero and cube land together because
nothing sequences them. **Staging = `Timeline` with per-element delay + per-tier
spring** — the engine's exact shape, used nowhere in chrome.

**Motion-hierarchy verdict:** the weak axis, uniformly. One character for all
motion = no hierarchy. The four-spring vocabulary that would create the hierarchy
ships and is unconsumed outside the demo content.

---

## Part V — The gestalt fix: motion as affordance + hierarchy, via the engine

The affordance gap (Part III) and the hierarchy gap (Part IV) are **one gap with
one fix**: treat motion as a first-class affordance/hierarchy channel and source
it from the keyframes engine. The static channels are done; the kinetic channel is
the work; the engine is the tool. Three moves, ranked by ROI, each tying a
sibling lane's empirical finding to a design-language rule.

### V.1 — Spring lift = affordance (the press/pill/hover) — Tier A, ship first

**Rule:** *an interactive surface signals interactivity by springing under the
pointer.* Replace the monotone `--dock-motion-fast` on the press/hover/pill paths
with the keyframes press-spring twin — a pure token swap, zero new JS:

```
/* keyframes emits; glass-ui stores as a token (no engine import at runtime) */
--dock-spring-press: springTimingFunction({response:0.3, dampingFraction:0.7}).css   /* linear(...) */
--dock-motion-press: 0.42s var(--dock-spring-press);
.dock-icon-button, .glass-dock.collapsed:hover { transition: scale var(--dock-motion-press), ...; }
```

- **Press** (`:active`→0.92) bites fast and near-critical; **release** (→1.0) and
  **hover lift** (→1.1) ring back ~+3% — the iOS elastic feedback. Empirical
  target: peak ≈1.13 on release-from-press vs today's flat 1.1000
  (`ios-dock-animation.md` III.1).
- **The collapsed pill** gains the spring lift that, with the existing chevron
  (TopDock.vue:217), finally makes "tap to open" read in BOTH form and motion —
  closing the WAVE-1 affordance question's kinetic half (III.1).
- **Serves:** affordance + anticipation + follow-through, in one token. This is
  the highest-traffic motion in the constellation (every icon, every frame).

### V.2 — Spring differentiation = motion hierarchy — Tier A, ship with V.1

**Rule:** *rank motion by the four-spring vocabulary the constellation already
ships — snappy for primary, smooth for secondary, gentle for ambient, bouncy for
accent.* This is a pure adoption of `--spring-*` tokens already in every bundle:

| Tier | Motion | Spring | Today | Where |
|---|---|---|---|---|
| Primary | dock width-morph / deck page change | `--spring-snappy` (ζ0.65) | snappy (frozen) / monotone cubic | `dock.css:22` ✓ / `deck.css:200` ✗ |
| Secondary | content reveal / layer settle | `--spring-smooth` (ζ0.86) | cubic | `dock.css:416` / `deck.css:481` |
| Ambient | progress fill / pager pill | `--spring-gentle` (ζ1.0) | cubic | `deck.css:589` |
| Accent | a delight beat (sparingly) | `--spring-bouncy` (ζ0.45) | unused | reserve |

The deck adopting this is `slides-facility.md` R2+R3 (the single highest-ROI
slides change). The dock unifying its VT path onto `--spring-snappy` (instead of
the divergent apple-spring bezier) is `dock-harden.md §B`'s elevated headline.
**One vocabulary, four springs, applied by importance** — the motion hierarchy
appears for free because the tokens are already authored.

### V.3 — Staged Timeline = choreography by importance — Tier B

**Rule:** *what matters most moves first and most; sequence by hierarchy.* The
engine primitives:

- **Dock unfurl:** `NumericAnimation` per child with `delay = index × 30ms`, each
  on `--spring-snappy` — the dock unfurls instead of snapping wholesale
  (`ios-dock-animation.md` III.6).
- **Page-then-content:** a `Timeline` that springs the page (snappy), then on
  settle releases the staggered content reveal (smooth) — content enters AFTER
  the page, never overlapping (`slides-facility.md` §2.3 gap).
- **Mobile collision (II.3):** stage the hero and cube on a narrow viewport — hero
  settles, cube scales in behind — resolving the z-competition by
  time-separation. `NumericAnimation`/`Timeline` with a per-element delay ladder.

### V.4 — Kinetic affordance for paging = finger-tracking spring — Tier B (the headline)

**Rule:** *a pageable surface follows the finger and rubber-bands at its ends.*
The deck swipe (`useDeckNav.ts:101-107`, threshold-flick) becomes a `touchmove`
drag feeding a `SpringProgress` (live target = committed slide) or a
`ManualTimeline` (raw drag → smoothed progress); on release the spring carries
momentum + overshoot to the snapped slide; over-drag past the ends gets
rubber-band resistance. This is the engine's *headline* documented use case
(`spring.ts:64-80` docstring: "the target may change mid-flight (gesture follows,
drag, live data)") and the change that makes the deck FEEL iOS-native
(`slides-facility.md` R4). It is **kinetic affordance and motion hierarchy in one
gesture** — the page moves to say "I page," and it moves *more* than its content
(primary > secondary).

---

## Part VI — The one design-language recommendation (synthesis)

Tying the iOS-research lane (`ios-dock-animation.md`), the empirical lanes
(`slides-facility.md`, `dock-harden.md §B`), and this affordance/hierarchy lens
into ONE rule for the constellation's design language:

> **Motion is the constellation's second hierarchy channel and its primary
> kinetic affordance, and the keyframes spring engine is that channel's single
> source of truth.** Where the visual channel ranks by the φ type ladder and the
> glass tiers, the motion channel ranks by the four-spring vocabulary
> (`--spring-snappy`/`-smooth`/`-gentle`/`-bouncy`, all `springLinearStops()`
> output). Where static form signals interactivity (cursor, chevron, dot), motion
> signals it harder (the spring lift, the page peek, the finger-track). A surface
> is *iOS-grade* when its motion is as hierarchical and as affording as its form —
> and the engine that makes it so is one import away.

**The adoption posture (inv ζ).** The constellation already eats the engine's
*output* — the `--spring-*` tokens are `springLinearStops()` strings, and
glass-carousel proves they work as kinetic affordance (III.4). The synthesis is
to (1) eat the output MORE — adopt the four springs by tier for motion hierarchy
(V.2) and swap the press/hover/pill onto a press-spring token for kinetic
affordance (V.1) — both Tier A, pure token/CSS, zero new JS; and (2) eat the
engine's *runtime* — `SpringProgress` for the interruptible morph and the
finger-tracking swipe (V.4), `Timeline`/`NumericAnimation` for staged
choreography (V.3) — Tier B, the unlocks. Reduced motion is *inherited* not
re-built: every primitive routes its snap through the engine's one
`withReducedMotion` gate (`spring.ts:170-185`), the same semantics the global CSS
PRM gate already gives.

**The diagonal closes.** Static affordance + visual hierarchy are A-grade and
done. The work is the kinetic diagonal — kinetic affordance and motion hierarchy
— and it is entirely closable with the engine the constellation already ships,
already depends on, and already demonstrates (the spring demo) but does not yet
dogfood in its own chrome.

---

## Appendix — grounding map (file:line + screenshot + sibling lane)

**Visual hierarchy (strong axis):**
- φ type ladder: `glass-ui/src/styles/typography.css:104-123` (caption→audacious,
  each rung √φ/φ/φ^n, fluid `clamp`); φ spacing `tokens.css:899-900`; 1/φ²
  cockpit `instrument-rail.css:6,23`.
- Density ladder: `dock.css:92,107,120,137`; coarse 44px floor
  `dock.css:1134-1137` (landed, `dock-harden.md §A4`).
- Screenshots: `spring-desktop.png` (clean φ-tier panel stack);
  `home-mobile.png`/`cube-mobile.png` (the hero↔cube z-collision, II.3).

**Affordance:**
- Collapsed pill: base bare slot `GlassDock.vue:363-369`; `cursor:pointer`
  `dock.css:296`; hover-scale 1.1 `dock.css:312-316`,`tokens.css:981`; the
  consumer chevron `keyframes TopDock.vue:217` (the static disclosure cue the base
  lacks).
- Press/hover scale: `dock.css:743-751`; `--scale-hover-dock` 1.1 /
  `--scale-press-dock` 0.92 `tokens.css:981,983`; the monotone `--dock-motion-fast`
  `dock.css:20`,`tokens.css:169`; measured monotone peak 1.1000 no spring
  (`ios-dock-animation.md` II.3, `/tmp/icon-scale-probe.mjs`).
- Deck paging affordance: static-strong/kinetic-zero — `useDeckNav.ts:101-107`
  (threshold-flick, no `touchmove`); dot-pager edge-clip `deck.css:594`
  (`slides-facility.md` §5).
- GlassCarousel kinetic affordance (the proof): `fadeOverflow`
  `GlassCarousel.vue:16,23,106`; `scale-press` `GlassCarouselItem.vue:73`;
  `--spring-snappy` transitions `GlassCarousel.vue:136-144`,
  `GlassCarouselItem.vue:59-63`; the FLIP hand-roll `useGlassCarousel.ts:137-208`.

**Motion hierarchy (weak axis):**
- One cubic everywhere: dock `dock.css:730-733,416,434,650-651,762-766`; deck
  `deck.css:119-120,200`.
- The four-spring vocabulary (authored, under-consumed): `tokens.css:158-161`
  (`springLinearStops()` output, recovered ζ in `ios-dock-animation.md` II.0).
- VT-path divergence (the dock's most-seen morph is non-spring): `--vt-ease` =
  `cubic-bezier(...,1.275)` `tokens.css:1240,179`; `dock-harden.md §B`.
- The demo that models the hierarchy: `spring-desktop.png` (four-spring panel).

**Engine primitives (the fix's source of truth):**
- `SpringProgress` (live-target spring, interruptible) `spring.ts:82-402`; the
  gesture-track docstring `spring.ts:64-80`; the PRM gate `spring.ts:170-185`.
- `springTimingFunction` (spring → `{fn, css:linear()}` twin) — the press-spring
  token source (V.1).
- `--spring-*` tokens = `springLinearStops()` (V.2); `Timeline`/`NumericAnimation`
  for staging (V.3); `ElementMorph` for shared-element/FLIP folds.

**Sibling lanes synthesized:** `docs/tranches/C/audit/animation/ios-dock-animation.md`
(the six-interaction iOS vocabulary + the dock's FLIP/VT divergence),
`slides-facility.md` (the deck's monotone cross-dissolve, swipe-flick, count-up
bug), `dock-harden.md` (the adversarial pass: two-tap bug + VT-path non-spring
bezier as the real motion gap). This lane is their design-language synthesis:
static is done, kinetic is the work, the engine is the tool.
