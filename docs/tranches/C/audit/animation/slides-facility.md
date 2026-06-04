# slides-facility — the SLIDES system audited against the keyframes.js iOS-grade engine (tranche C / inv ζ)

**Lane:** the slides facility. **Scope:** `/Users/mkbabb/Programming/slides`
(the deck system) + glass-ui's `custom/glass-carousel/*` + `ui/carousel/*`.
**Frame (inv-16):** READ across all repos; this report is AUDIT + RECOMMENDATIONS
routed outward — slides and glass-ui are NOT keyframes' to edit. **Grounding:**
every finding is file:line; the slide-transition timing is an empirical Playwright
capture of the BUILT `slides/dist` (local chromium-1223 at `/tmp/kf-audit`,
`/tmp/slides-capture.mjs`).

---

## TL;DR — the verdict

slides is a **handsomely-engineered CSS deck** that **barely dogfoods the engine
it advertises**. It depends on `@mkbabb/keyframes.js@^2.2.0`
(`slides/package.json:30`) and names it in its README byline — but the engine
shows up in **exactly one runtime site**: a lazy `import("@mkbabb/keyframes.js")`
in `useDeckNav.ts:7` that pulls `springTimingFunction` to ease **one count-up on
one slide** (`Slide07.vue:111`). Everything that MATTERS for iOS-grade motion —
**the slide-to-slide transition itself** — is a hand-rolled CSS `opacity`+`translateX`
cross-fade on **monotone cubic-béziers** (`deck.css:200`), measured to settle with
**zero overshoot, zero spring** (capture below). The constellation's own
`--spring-snappy/-smooth/-bouncy/-gentle` tokens — which ARE keyframes.js
`springLinearStops()` output and ALREADY SHIP in the slides bundle — are
**referenced nowhere in the deck** (`grep spring-snappy slides/src` → 0). The
deck transition is a paging cross-dissolve, not a page slide: it has the LEAST
spring of any surface in the constellation.

**The gestalt to recommend:** the deck transition is the single highest-leverage
dogfood site in the whole constellation. Route slide paging through a
keyframes.js `springTimingFunction` (the `.css` twin → `transition-timing-function`,
or `SpringProgress`/`Timeline` for a gesture-tracking swipe), adopt the shipped
`--spring-*` tokens that are already in the bundle, and the deck inherits the
exact iOS curve the dock + glass surfaces already use. This is a **fold**, not a
fork: the slide-transition logic that's worth extracting (`useDeck` is already
carved as the seed of `@mkbabb/glass-ui/deck`) should consume keyframes, not
re-hand-roll a third paging easing.

---

## 1 — Architecture: how slides consumes glass-ui + keyframes.js

### 1.1 The runtime (well-factored, headless-core-first)

slides is a Vue 3.5 + Vite single-app multi-deck system. The runtime spine is
clean and already anticipates upstreaming:

| File | Role |
|---|---|
| `src/deck/useDeck.ts` | **headless** deck state — `index`/`progress`/`go`/`next`/`prev`, NO DOM. Explicitly carved as "the seed of a future `@mkbabb/glass-ui/deck`" (`useDeck.ts:4-8`). |
| `src/deck/useDeckNav.ts` | input glue — keyboard (`deckKeys.ts`), swipe (`:101-107`), the count-up replay (`:70-89`), print/export/freeze modes. **The ONLY keyframes.js consumer.** |
| `src/deck/DeckView.vue` | the deck shell — renders all slides stacked, drives the declarative `[data-state]` per slide off `index` (`:62-63`), mounts the glass-ui dock + Progress + edge arrows. |
| `src/deck/DeckSlide.vue` | per-slide host — applies `[data-state]` active/prev/next via attribute fall-through, provides slide context. |
| `src/deck/DeckPager.vue` | the dot-per-slide register (windowed, φ-scaled active pill). |
| `src/styles/deck.css` | **the design + MOTION spine** — tokens, type scale, AND every transition/keyframe. |

**glass-ui consumption is idiomatic and broad** (`DeckView.vue:5-8`): `GlassDock`
+ `DockIconButton` for the control dock, `DarkModeToggle`, `Progress` (gradient
variant) for the bottom bar, `Button`. The `index.css` pulls `@mkbabb/glass-ui/styles`
(`:13`) so the whole token cascade — including the `--spring-*` register — is
live. This is a **model glass-ui consumer**: it composes the shipped primitives
rather than re-skinning them, and even the deck's deliberate token DIVERGENCES
(`--card`, `--radius-*`, the cartoon shadows, NCSU red) are documented as
overrides-not-forks (`deck.css:64-68`).

### 1.2 keyframes.js consumption — one site, and it's the WRONG one

```ts
// useDeckNav.ts:5-14 — the entire keyframes.js footprint
let springEase = (t) => 1 - Math.pow(1 - t, 3);   // cubic-out fallback
import("@mkbabb/keyframes.js").then((m) => {
    const fn = m.springTimingFunction({ response: 0.5, dampingFraction: 0.8 });
    if (typeof fn === "function") springEase = fn;   // ⚠ BUG — see §2.4
}).catch(() => {});
```

That spring eases the count-up on `Slide07.vue:111` (the gauge `COMPLETION%`,
`dur=1500`, `delay=700`). **That's it.** `SpringProgress`, `Timeline`,
`ScrollTimeline`, `NumericAnimation`, `ElementMorph`, the reduced-motion gate,
`CSSKeyframesAnimation`, the 30+ presets — **all unused**. The deck transition,
the staggered reveals, the pager-pill elongation, the edge-arrow fade, the gallery
hover-lift — every one of them is **hand-rolled CSS** on the deck's own two
cubic-béziers (`--ease-out` / `--ease-standard`, `deck.css:119-120`).

**Does it hand-roll like the dock consumers?** Yes — and it's the same pattern the
dock-forward ask (`docs/tranches/B/asks/glass-ui-dock-forward.md`) catalogues for
the dock: a consumer re-deriving motion that the engine already ships. Here the
re-derivation is **two cubic-béziers + a linear-clock rAF count-up**, when the
constellation has a canonical spring solver one import away.

---

## 2 — The slide-transition ANIMATION, measured against iOS-grade paging

### 2.1 The mechanism (declarative, CSS-only)

Slides do not toggle in JS. Every slide is mounted stacked in one grid cell
(`deck.css:184` `grid-area: 1/1`); `DeckView` binds `[data-state]` = `active` /
`prev` / `next` off `index` (`DeckView.vue:62-63`), and CSS does the rest:

```css
/* deck.css:200 — the transition */
.slide { transition: opacity 0.5s var(--ease-standard), transform 0.6s var(--ease-out); }
.slide[data-state="prev"] { --tx: -6cqi; }   /* outgoing slides 6cqi (≈76.8px@1280) left  */
.slide[data-state="next"] { --tx:  6cqi; }   /* incoming starts 6cqi right, slides to 0    */
.slide[data-state="active"] { opacity: 1; }  /* opacity 0 → 1; non-active opacity 0         */
```

So it is a **cross-dissolve + a 6cqi parallax nudge**, NOT a full page-slide
(the slide moves ~76px, not a full 1280px viewport width — adjacent slides
cross-fade in place). `--ease-standard` is Material's `cubic-bezier(0.4,0,0.2,1)`;
`--ease-out` is the "expo-out" `cubic-bezier(0.16,1,0.3,1)`. **Both monotone — no
overshoot is even expressible.**

### 2.2 Empirical capture (BUILT dist, local chromium)

`ArrowRight` on `/til-briefing`, sampling the incoming slide's opacity + transform
each rAF (full data in `/tmp/slides-capture.mjs`):

```
COMPUTED: transition: opacity 0.5s cubic-bezier(0.4,0,0.2,1),
                      transform 0.6s cubic-bezier(0.16,1,0.3,1)

t=  4ms  in.op=0.000  out.op=1.000  in.tx=76.8px
t=104ms  in.op=0.085  out.op=0.915  in.tx=29.4px
t=204ms  in.op=0.540  out.op=0.460  in.tx= 9.1px
t=337ms  in.op=0.900  out.op=0.100  in.tx= 1.73px
t=470ms  in.op=0.994  out.op=0.006  in.tx= 0.18px
t=604ms  in.op=1.000  out.op=0.000  in.tx= 0.0002px   ← settles, MONOTONE
t=637ms  in.op=1.000  out.op=0.000  in.tx= 0px        ← no ring, no overshoot
```

The translateX decays **monotonically to 0** and stays there — the textbook
signature of a cubic-bézier, the OPPOSITE of an iOS spring (which would cross 0,
overshoot to a small negative, and ring back). **There is no spring in the slide
transition.** Measured settle ≈ 604ms (the 0.6s transform).

### 2.3 Against iOS-grade paging — the gaps

| iOS principle | iOS page transition | slides today | gap |
|---|---|---|---|
| **Timing / easing** | spring `(response≈0.5, ζ≈0.8–0.86)`, settle ~0.5s with micro-overshoot | monotone cubic-bézier, 0.5–0.6s | **no spring** — flat, "web-standard" feel |
| **Morphing / shared-element** | hero/title can carry between pages (Hero Animation / `matchedGeometryEffect`) | **none** — each slide is an independent `[data-state]` unit; no element persists across the cut | **no shared-element continuity** — `ElementMorph` is the engine's exact tool and is unused |
| **Choreography / staging** | content enters AFTER the page settles, staggered | reveals DO stagger (`deck.css:481` `--d × 0.09s + 0.12s`) — **this part is good** | reveal easing is cubic, not spring; no anticipation |
| **Paging / momentum / rubber-band** | swipe TRACKS the finger 1:1, momentum carries, edges rubber-band | swipe is a **threshold flick** (`useDeckNav.ts:106`: `|dx|>44` → discrete `go()`) — finger does NOT track, no momentum, no rubber-band at the deck ends | **no gesture-following** — the single biggest iOS-feel miss |
| **Anticipation / follow-through** | the outgoing page eases out as the incoming anticipates in | pure linear-in-time crossfade overlap | no anticipation |
| **Affordance** | the page edge peeks during drag | edge arrows fade in on hover (`useEdgeZones.ts`), dots, progress bar — **strong static affordance, zero kinetic affordance** | the deck never shows "there's a slide over there" by MOVING |

**The swipe is the headline gap.** `useDeckNav.ts:101-107` reads `touchstart`/
`touchend`, computes a delta, and if `|dx|>44px` fires a discrete `deck.go(±1)`.
There is no `touchmove` handler — the slide does not follow the finger, there's no
velocity carry, and dragging past slide 1 or slide N does nothing (no rubber-band
resistance cue). This is precisely what `SpringProgress` (live-target tracking,
overshoot) + a `ManualTimeline` (set raw drag offset → smoothed progress) were
built for. The engine's own `spring.ts` docstring sells exactly this use case
("gesture follows, drag, live data… the target may change mid-flight").

### 2.4 BUG — the count-up runs the spring over a LINEAR clock (and a swallowed return)

Two defects in the one keyframes site:

**(a) Easing-of-a-clock, not a spring.** `useDeckNav.ts:78-84` builds its own
rAF loop, computes `p = (now - started - delay) / dur` (a LINEAR wall-clock
fraction), then `springEase(p)`. So the spring curve is sampled by a uniform
clock — it's a static eased curve, never the analytic `SpringProgress` tracker.
With `dampingFraction: 0.8` the curve barely overshoots (verified: peaks **1.0149
at t=0.21**, `fn(1)=1` exactly), and `Math.round(target * springEase(p))`
(`:83`) **clamps away even that** — so the count never visibly overshoots its
target integer. The "spring" is cosmetically inert here. The engine ships
`NumericAnimation.play()` and `SpringProgress.play()` (managed rAF, reduced-motion
snap built in) that would do this loop correctly and delete the hand-rolled rAF.

**(b) The `.css` twin is discarded.** `springTimingFunction` returns a typed
`Easing` = `{ fn, css }` (`springTimingFunction.ts:119`); the capture confirms
the returned object carries a 418-char `linear()` string. `useDeckNav.ts:10-11`
does `const fn = springTimingFunction(...)` and tests `typeof fn === "function"`
— but the return is an **object**, not a function. **`typeof fn === "function"`
is `false`**, the `if` never fires, and the count-up **silently falls back to the
cubic-out** `(t)=>1-(1-t)³` on EVERY load. The one place slides claims to use the
spring engine **does not actually use it** — it always runs the fallback. (To use
it: `const ease = m.springTimingFunction(...); springEase = ease.fn;`.)

> This mirrors the dock-forward ask's "Symbol-tag silently dropped" class of bug
> (`waapi.ts` history): a typed-pair contract used as if it were the bare callable.
> The fix is one line, but the AUTHORING.md (`docs/AUTHORING.md:100`) advertises
> the count-up as "eased by keyframes.js's `springTimingFunction`" — which is
> currently **false in the shipped build**.

### 2.5 AUTHORING.md over-claims the spring adoption

`docs/AUTHORING.md:107`: *"CSS spring tokens (`--spring-bouncy`, `--spring-snappy`)
are ready in `deck.css`."* They are NOT in `deck.css` — `grep spring slides/src/styles/deck.css`
→ 0 hits; they arrive via glass-ui's cascade and the deck consumes **none** of
them. `:93` lists "springs (`--spring-bouncy`, `--ease-out`)" as deck tokens —
conflating a real glass-ui spring `linear()` with the deck's hand-rolled cubic.
The docs describe an adoption that the CSS never made.

---

## 3 — GlassCarousel + ui/carousel (the carousel API + animation)

slides uses **neither** carousel (`grep -i carousel slides/src` → 0). They're
audited here as the constellation's existing "slide-like" primitives — the natural
homes for any extracted slide-transition logic.

### 3.1 `ui/carousel/*` — embla-backed, momentum-correct, NOT glass-styled

`ui/carousel/useCarousel.ts` wraps `embla-carousel-vue` — so this surface DOES get
real momentum/drag/snap (embla's physics). `Carousel.vue` adds arrow-key nav and
ARIA `role="region"` / `aria-roledescription="carousel"`. `GlassCarouselPager.vue`
+ `CarouselDots.vue` provide paging affordance. **This is the momentum engine the
deck swipe lacks** — but it's a generic shadcn/embla carousel, not spring-tuned and
not glass-surfaced; its motion is embla's, not keyframes'.

### 3.2 `custom/glass-carousel/*` — glass-styled, but it's an EXPAND/COLLAPSE pill, not a pager

This is **not a slide pager at all** — it's a glass **dock-sibling**: a scroll-area
in a glass pill that animates between an `expanded` (items spread) and `collapsed`
(compact) state via a FLIP size morph (`useGlassCarousel.ts:137-208`). Findings:

- **Glass styling is idiomatic** — `border-radius: var(--radius-dock)`, the
  GlassDock visual language, `--glass-border-wash` / `--glass-shadow-wash`
  (`GlassCarousel.vue:127-149`). Good.
- **It DOES consume the spring tokens** — its size/transform transitions use
  `var(--spring-snappy)` (`GlassCarousel.vue:138-144`). So glass-carousel dogfoods
  the keyframes-derived spring CSS that **slides does not**. The token is proven in
  the constellation; slides simply hasn't adopted it.
- **Affordance** — overflow fade indicators (`fadeOverflow`, the scroll-state
  `@container` masks `:208-241` with a JS fallback) cue "more beyond the edge" — a
  kinetic affordance the deck lacks.
- **The FLIP is a hand-rolled `setTimeout`/`nextTick` choreography**
  (`useGlassCarousel.ts:128-208`): a 6-deep `nextTick`/rAF pyramid measuring
  `getBoundingClientRect`, pinning size, forcing reflow (`:189`), then animating.
  This is **exactly** the rect-to-rect morph `ElementMorph` (engine) was built for,
  and exactly the "FLIP via timers" anti-pattern the dock-forward ask flags as the
  `useLayerTransition` ergonomic gap (`glass-ui-dock-forward.md` P2). A
  glass-carousel + dock shared FLIP/morph primitive — backed by `ElementMorph` or
  `SpringProgress` — would retire both hand-rolls.

**Neither carousel is a slide pager.** glass-ui has no deck/pager primitive yet —
which is exactly the gap `slides/src/deck/useDeck.ts:4-8` is positioning to fill.

---

## 4 — Fork / hand-roll / fold analysis (the convergence opportunity)

slides does NOT fork glass-ui or keyframes source — it's a clean consumer. But it
**hand-rolls the slide-transition motion** that the engine should own, and it does
so with a THIRD independent easing vocabulary (after the dock's `--spring-*` and
glass-carousel's `--spring-snappy`). The fold opportunity is sharp and three-tiered:

### Tier 1 — slides adopts the SHIPPED spring tokens (zero new code, slides-owned)

The `--spring-*` tokens are already in the slides bundle (verified: the built
`index-*.css` contains the full `--spring-snappy: linear(…)`). Swap the deck's
hand-rolled cubics for them:

```css
/* deck.css:200 — TODAY */
.slide { transition: opacity 0.5s var(--ease-standard), transform 0.6s var(--ease-out); }
/* PROPOSED — the page-slide rides the same spring the dock + glass surfaces use */
.slide { transition: opacity 0.4s var(--ease-standard), transform 0.5s var(--spring-snappy); }
```

`--spring-snappy` peaks ~1.068 (a 6.8% overshoot) and settles by ~28% — so the
6cqi nudge would gain the iOS micro-overshoot the capture proved is absent.
**This is the single highest-ROI change in the lane.** Same for the reveals
(`deck.css:481`) and the pager pill (`:589`).

### Tier 2 — the swipe gesture rides `SpringProgress` / `ManualTimeline` (slides-owned, engine-backed)

Replace the threshold-flick (`useDeckNav.ts:101-107`) with a finger-tracking drag:
a `touchmove` handler feeds the drag offset into a `ManualTimeline` (raw → smoothed
progress) or a `SpringProgress` whose target is the committed slide; on release the
spring carries momentum + overshoot to the snapped slide, and over-drag past the
ends gets rubber-band resistance. This is the engine's headline use case
(`spring.ts` docstring) and is **the** change that makes the deck FEEL iOS-native.

### Tier 3 — fold the deck-transition primitive into glass-ui, backed by keyframes (constellation-owned)

`useDeck.ts` is already the carved seed of `@mkbabb/glass-ui/deck` (`:4-8`); the
`[data-state]` contract is the seed of an upstream `<DeckSlide>` (`DeckSlide.vue:10`).
When that lifts to glass-ui (≥2-consumer rule), the transition layer should consume
keyframes — NOT re-hand-roll a fourth easing. The shared-element/morph between
slides (the iOS hero transition) is `ElementMorph`. glass-ui's `--spring-*` tokens
are already keyframes output, so the dependency edge is established and clean.

**Where should slide-transition logic live?** The headless STATE
(`useDeck`/`pagerWindow`) → glass-ui (`@mkbabb/glass-ui/deck`). The MOTION
(spring curves, gesture tracking, shared-element morph) → keyframes.js, surfaced
to glass-ui as tokens (`--spring-*`, already done) + the JS engines
(`SpringProgress`/`Timeline`/`ElementMorph`). slides becomes the first consumer of
both. This is the same fold-not-fork verdict the dock-forward ask reaches for the
dock — and slides is the cleanest proof of it.

---

## 5 — Affordance + design (visual + MOTION) hierarchy of the deck

**Visual hierarchy: excellent.** The φ golden-ratio type ladder (`deck.css:87-99`),
the cqi-anchored 1280-canvas (`--cqx`, `:165`), the glass ladder, NCSU-red accent
discipline, the cartoon-shadow depth language, force-dark feature slides
(`.slide--dark`) — this is a genuinely refined, well-tiered visual system. The
gallery → deck → slide drill-down is clear; the chrome (dock, progress, dots) is
unobtrusive and idiomatic glass-ui.

**Static affordance: strong.** Multiple redundant paging affordances satisfy WCAG
2.5.1 (a non-gesture path): keyboard (arrows/space/PageUp-Dn/Home/End/digits via
`deckKeys.ts`), the edge-zone arrows (fine-pointer hover, `useEdgeZones.ts`), the
dock prev/next, the windowed dot-pager (`DeckPager.vue`, φ-scaled active pill +
clipped-edge cue), the bottom progress bar, swipe, deep-link hash sync, aria-live
slide announcements (`DeckView.vue:79`). The dot-pager's edge-clip cue
(`deck.css:594`) is a thoughtful "more beyond" signal. This is a model of
accessible paging affordance.

**MOTION hierarchy: the weak axis — and the whole point of this lane.** Every
moving thing rides the same two monotone cubics, so there is no MOTION hierarchy:
the page transition, the content reveal, the pager pill, and the edge arrow all
move with the same flat character. iOS earns its hierarchy through SPRING
DIFFERENTIATION — a snappy spring for the primary page change, a gentler spring
for secondary content settle, a bouncy spring for a delightful accent. The
constellation **already ships that exact vocabulary** (`--spring-snappy` /
`-smooth` / `-gentle` / `-bouncy`, all keyframes `springLinearStops()` output) and
slides uses **none of it**. Adopting the four springs — snappy for the page,
smooth for reveals, gentle for the progress fill, bouncy reserved for an accent —
would give the deck a felt motion hierarchy matching its strong visual one. The
**kinetic affordance** gap (the deck never MOVES to say "there's a slide over
there" — no peek, no rubber-band, no finger-track) is the same root: motion is
treated as decoration, not as an affordance/feedback channel. That is the iOS
delta, and it is entirely closable with the engine slides already depends on.

---

## 6 — Prioritized recommendations (routed: slides-owned vs glass-ui-owned)

| # | Change | Owner | Effort | Payoff |
|---|---|---|---|---|
| **R1** | **Fix the count-up spring bug** — `springTimingFunction` returns `{fn, css}`; use `.fn`, not the object (`useDeckNav.ts:10-11`). The shipped build silently runs the cubic fallback today. | slides | 1 line | the ONE keyframes site actually works; AUTHORING claim becomes true |
| **R2** | **Adopt `--spring-snappy` for the slide transition** (`deck.css:200`) — swap the hand-rolled `--ease-out`/`--ease-standard` cubics for the shipped spring `linear()`. Tokens already in the bundle. | slides | tiny | the page-slide gains iOS micro-overshoot; capture-verifiable |
| **R3** | **Spring-differentiate the motion hierarchy** — snappy=page, smooth=reveals (`deck.css:481`), gentle=progress/pager (`:589`). | slides | small | a felt MOTION hierarchy matching the visual one |
| **R4** | **Finger-tracking swipe via `SpringProgress`/`ManualTimeline`** — replace the threshold-flick (`useDeckNav.ts:101-107`) with `touchmove` drag + momentum + rubber-band at the ends. | slides | medium | closes the single biggest iOS-feel gap (gesture follow) |
| **R5** | **Replace the count-up rAF with `NumericAnimation.play()`** — delete the hand-rolled loop (`useDeckNav.ts:78-89`), inherit the engine's managed rAF + reduced-motion snap. | slides | small | deletes hand-rolled motion; correct spring sampling |
| **R6** | **Correct AUTHORING.md** (`:93,:100,:107`) — the `--spring-*` tokens are glass-ui's, the deck doesn't consume them, and the count-up currently falls back. After R1–R3 the claims become accurate. | slides | docs | truth in the authoring contract |
| **R7** | **Shared-element morph between slides** via `ElementMorph` — an opt-in `data-morph` hero/title that carries across the cut (iOS Hero Animation). | slides (engine-backed) | medium | the morphing/shared-element principle, currently absent |
| **R8** | **glass-carousel FLIP → `ElementMorph`/`SpringProgress`** — retire the 6-deep `nextTick`/`setTimeout` rect-morph pyramid (`useGlassCarousel.ts:137-208`); same fold as the dock's `useLayerTransition` gap. | glass-ui | medium | deletes a timer-FLIP hand-roll; one morph primitive |
| **R9** | **Lift `useDeck` → `@mkbabb/glass-ui/deck`, motion via keyframes** — when a 2nd consumer exists, the upstreamed deck primitive consumes keyframes for transition/gesture/morph, not a 4th hand-rolled easing. | glass-ui (+ keyframes tokens) | larger | the fold: state→glass-ui, motion→keyframes, slides=first consumer |

**The one-sentence gestalt:** slides ships the engine in its byline but runs a
monotone CSS cross-dissolve with a silently-broken count-up — route the page
transition, the swipe, and the count-up through the keyframes spring it already
depends on (and the `--spring-*` tokens already in its bundle), and the deck
inherits, for free, the iOS-grade motion the rest of the constellation already has.

---

### Appendix — provenance

- **Empirical capture:** `/tmp/slides-capture.mjs` (local chromium-1223 via
  `KF_PLAYWRIGHT_DIR=/tmp/kf-audit`), served the BUILT `slides/dist`, navigated
  `/til-briefing`, dispatched `ArrowRight`, sampled incoming-slide opacity+transform
  per rAF. Computed transition + the monotone settle reproduced inline §2.2.
- **`springTimingFunction` overshoot/twin:** verified against built
  `keyframes.js/dist/keyframes.js` — `{response:0.5, damping:0.8}` peaks 1.0149 @
  t=0.21, `fn(1)=1`, carries a 418-char `.css` twin (§2.4).
- **Key file:line:** `slides/src/deck/useDeckNav.ts:5-14,78-89,101-107`;
  `slides/src/styles/deck.css:119-120,200,210-211,481,589`;
  `slides/src/decks/til-briefing/slides/Slide07.vue:111`;
  `glass-ui/src/styles/tokens.css:158-161`;
  `glass-ui/src/components/custom/glass-carousel/{GlassCarousel.vue:138-144,useGlassCarousel.ts:137-208}`;
  `keyframes.js/src/animation/springTimingFunction.ts:65-119`, `spring.ts`.
