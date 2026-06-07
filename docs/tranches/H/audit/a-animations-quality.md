# Tranche H Deep Audit — Lane `a-animations-quality`

**inv ζ — Does the demo DOGFOOD its own engine for its OWN chrome animations?**

Charge: audit whether the demo's *chrome* motion (typing dots, dock springs, hero
entrance, scene transitions, hover lifts, idle bob, shimmer, tab slide) runs on
keyframes.js (`CSSKeyframesAnimation`, `NumericAnimation`, `SpringProgress`,
`springLinearStops`/`springTimingFunction`, `AnimationGroup`) or on hand-rolled CSS
`@keyframes` / glass-ui. Where it should be kf and is not = a finding. Grounds D6
(typing dots) and D7 (hero) in the dogfooding lens.

Branch: `tranche-h-dev`. Demo served at `http://localhost:5174/`. Every claim below
carries a `file:line` or a live observation.

---

## EXECUTIVE VERDICT

The demo is **bifurcated**. The *scene subjects* (cube, easing sweep, spring tracker,
sequence stagger, motion-path, discrete) are **exemplary dogfood** — they are literally
shop-windows for the engine (`useEasingDemo.ts`, `useSpringDemo.ts`,
`useSequenceDemo.ts`, `useSceneSwap.ts`). That work is **ALREADY-SOTA** and must not be
disturbed.

But the *chrome* — the demo's own UI furniture that frames those subjects — is almost
entirely **hand-rolled CSS `@keyframes` / CSS `transition`**, NOT engine-driven. The
demo that exists to prove "CSS keyframe animations for anything in JavaScript" animates
its OWN furniture with raw CSS `@keyframes` it could trivially author through its own
parser. This is the inv-ζ gap, and it is the root cause of **D6** (typing dots) and a
contributing cause of **D7** (hero) and **D13** (drawer not springy).

**The honest exception** — `CopyButton.vue` — proves the idiom is cheap and correct:
it drives its icon feedback through `new CSSKeyframesAnimation(...).fromString(...)`
inside an `AnimationGroup` (`CopyButton.vue:52-92`). That is the template every other
chrome animation should follow. The dogfood pattern is PROVEN in-tree; it is simply not
applied uniformly.

---

## DOGFOOD LEDGER (the chrome inventory)

| Chrome animation | Where | Driven by | Should be |
|---|---|---|---|
| **Typing dots** "..." (D6) | `AnimatedText.vue:93-107` `.dot-fade`/`@keyframes dotFade` | hand-rolled CSS, BROKEN | kf `NumericAnimation` per-dot stagger |
| **Hero word lift** (D7) | `AnimatedText.vue:72-91` `.lift-down`/`@keyframes liftDown` | hand-rolled CSS | kf `CSSKeyframesAnimation` + `stagger` |
| **Cube idle bob** | `CubeTarget.vue:140-155` `@keyframes idle-bob` | hand-rolled CSS | kf `CSSKeyframesAnimation` (alternate) |
| **Gold shimmer** | `design-idioms.css:215-227` `@keyframes gold-shimmer-slide` | hand-rolled CSS | RECORD (cosmetic bg-position sweep) |
| **Tab-panel slide** | `design-idioms.css:404-413` `@keyframes enter` | hand-rolled (tw-animate-css twin) | BOOK |
| **Drawer collapse/expand** (D13) | `ControlsPaneWrapper.vue:147-200` CSS `transition` | CSS transition w/ `--spring-snappy` token | kf spring (`linear()` emit OR JS) |
| **Hover lift** | `design-idioms.css:177-188` `.scale-on-hover` | CSS `transition` | RECORD (transition is correct here) |
| **Scene cross-dissolve** | `useSceneSwap.ts:45` `new SpringProgress(...)` | **kf `SpringProgress`** ✅ | ALREADY-SOTA |
| **Copy-button feedback** | `CopyButton.vue:52-76` `CSSKeyframesAnimation` | **kf** ✅ | ALREADY-SOTA |
| **Pane-slide spring token** | `style.css:147` `--spring-snappy: var(--spring-smooth)` | glass-ui token (transitive dogfood) | see F2 |

---

## FINDINGS

### F1 — D6: Typing dots are not "dots", not "typing", and double-bound — and not dogfooded. **[SHIP-in-H]**

**Anchor:** `AnimatedText.vue:23-33` (template), `:72-107` (the two `@keyframes`),
`EditorStartScreen.vue:15-20` (the `dot-fade depth-text` host).

**Root cause (three compounding bugs, all from hand-rolled CSS):**

1. **One span, not three.** The ellipsis text `"..."` is fed through
   `words = props.text.split(/\s+/).filter(...)` (`AnimatedText.vue:62-64`). `"..."`
   has no whitespace → ONE word → ONE `<span>`. So there is exactly one `.dot-fade`
   element containing all three dots — they pulse opacity *as a unit*. There is no
   per-dot stagger, no "typing" cadence. It is a single blinking glyph-clump, not a
   typing indicator. (Confirmed by source; the per-word split that helps the *hero*
   actively *defeats* the dots.)

2. **Double-bound animation shorthand.** Each per-word span carries
   `class="lift-down"` *hardcoded* (`AnimatedText.vue:24`) AND inherits `dot-fade
   depth-text` via `v-bind="$attrs"` (`:25`, the classes `EditorStartScreen.vue:18`
   passes). So the ellipsis span has BOTH `.lift-down` (`animation: liftDown …`,
   `:74`) and `.dot-fade` (`animation: dotFade …`, `:95`) setting the **same CSS
   `animation` shorthand**. Only one wins per cascade source-order (`.dot-fade` is
   later → `dotFade` wins), but the inline `:style` then overrides
   `animationDelay`/`animationDuration` (`:27-28`) with the *lift* timing math
   (`duration = text.length * offset + offset*10`, `:66-68` — a duration computed for
   the lift, mis-applied to the fade). The result is an opacity pulse on a
   lift-tuned clock: visually broken, exactly as reported.

3. **Wrong primitive entirely.** A typing indicator is a *staggered, per-element*
   animation — the engine's `stagger()` (`src/animation/stagger.ts:127`) +
   `NumericAnimation` is the canonical primitive and is ALREADY imported by the
   sequence scene (`useSequenceDemo.ts:6`). The demo demonstrates stagger on its
   scene subject but hand-rolls (and breaks) it on its own chrome.

**Gestalt fix (no-workaround, dogfood):** Replace the conflated `AnimatedText`
dual-class with a dedicated, tiny dogfooded primitive. Render the ellipsis as N
explicit dot `<span>`s and drive their opacity through ONE `NumericAnimation` per dot
seated at `stagger(N)` delays (or a single `CSSKeyframesAnimation` per dot with a
per-dot `delay`), sharing the engine's reduced-motion authority instead of the
hand-mirrored `@media (prefers-reduced-motion)` block (`:113-121`). This deletes BOTH
`@keyframes dotFade` and the class-collision; the dots become a genuine kf showcase.
Separate the *lift* (hero words) from the *fade* (dots) so no element ever carries two
`animation` shorthands.

**Falsifiable instrument:** `proof:typing-dots` — a visual lock + DOM assertion: the
ellipsis renders ≥3 distinct dot elements, each with a *distinct* computed
`animationDelay`/sampled opacity at a fixed `t` (stagger present), AND no element in the
hero carries two competing `animation` shorthands (assert `getComputedStyle` resolves a
single animation-name per dot). Gate: a screenshot diff of the dots mid-cycle showing a
phase gradient across the three dots, not a uniform clump.

---

### F2 — D13: Drawer collapse/expand is a CSS transition aliased to a glass-ui token — not the engine's own spring. **[SHIP-in-H + glass-ui-HANDOFF for the token]**

**Anchor:** `ControlsPaneWrapper.vue:149,154,193` (the transitions),
`style.css:133-147` (the `--spring-snappy` reconcile), `useSpringDemo.ts:12`
(`SpringProgress` already imported one directory over).

**Observation:** The mobile drawer height is a CSS `transition: grid-template-rows
var(--duration-panel) var(--ease-out)` (`ControlsPaneWrapper.vue:149`) — a plain eased
transition, NO spring at all on the *height* axis. The desktop pane-slide DOES reach for
a spring token: `transform … var(--spring-snappy)` (`:193`). But `style.css:147` reveals
`--spring-snappy: var(--spring-smooth)` — a **glass-ui** token, and the commentary
(`style.css:133-146`) records that the demo *used to* emit its own
`springLinearStops({ response: 0.35, dampingFraction: 0.65 })` here and **deleted it**
in D.W11, aliasing to glass-ui's calmer canonical curve.

So the demo's most-visible structural motion is (a) NOT springy on the mobile height
axis (D13: "not springy + too slow"), and (b) on desktop, springy only via a *foreign*
token — the dogfood is now "transitive" (glass-ui generates its springs with the same
`springLinearStops`), which satisfies coherence but means **the demo no longer drives
its own chrome spring from its own engine**. For a product whose thesis is "spring
linear() emitted from JS," that is a self-defeating omission directly in the chrome.

**Gestalt fix:** The mobile drawer is a discrete open/close height transition — the
*idiomatic* kf treatment is to emit a `linear()` from `springLinearStops()` for a
*fast, snappy* preset (e.g. `response: 0.30, dampingFraction: 0.70`) and apply it to the
`grid-template-rows`/`max-height` transition-timing-function, with a *short* duration
(D13: "too slow" — drop from the panel duration to a fast spring window). This is the
EXACT primitive `StartingStyleTarget.vue:94-99` already dogfoods for its discrete card
(`springLinearStops` → `--spring-ease`); the drawer should mirror that scene's pattern.
The demo thus re-acquires a *demo-owned* spring on its own chrome while staying coherent
with glass-ui's family. Do NOT re-introduce a second landlord — emit it from the engine
into a demo-owned token, name the delta, and let glass-ui keep its own family.

The `--spring-snappy` *token alias itself* (whether glass-ui's family should expose a
"snappy fast" member) is a **glass-ui-HANDOFF**.

**Falsifiable instrument:** `proof:drawer-spring` — sample the drawer's transition-
timing-function at open: assert it is a `linear()` with ≥3 stops emitted from
`springLinearStops` (not a `cubic-bezier`/`ease`), AND assert the open→settle wall-clock
is under a fast budget (e.g. < 350ms to 99% height). Visual lock: the drawer overshoots
then settles (a spring signature), captured mid-transition.

---

### F3 — D7: Hero word-lift is hand-rolled CSS `@keyframes`, not engine-driven. **[SHIP-in-H]**

**Anchor:** `AnimatedText.vue:72-91` (`@keyframes liftDown`),
`EditorStartScreen.vue:9-13` (the hero host, `text-display-4`).

**Observation:** The hero entrance/idle motion is `animation: liftDown 3s
var(--ease-standard) infinite` (`AnimatedText.vue:74`) — a hand-rolled keyframe. The
*typography* substrate is correct and ALREADY-SOTA: the hero uses glass-ui's φ-ladder
`text-display-4` (`EditorStartScreen.vue:6`) on `--font-display` Instrument Serif with a
metric-matched CLS fallback (`style.css:41-75`). D7's "must be LARGER + golden
typography" is therefore a *sizing* tune on a sound token (a sibling-lane styling
concern), but the **motion** is the inv-ζ miss in MY lane: the LCP hero — the single
most prominent animation on the landing page — is the one place the engine should be
front-and-center, and it runs raw CSS.

**Gestalt fix:** Drive the per-word lift through `CSSKeyframesAnimation` seated at
`stagger(words.length)` delays, sharing the dot fix's primitive (F1). One
`AnimationGroup` for the hero (words + dots) makes the landing page a live, honest
keyframes.js demonstration from first paint — the strongest possible "this is what the
library does" statement, replacing two hand-rolled `@keyframes`. Keep the φ-ladder
typography untouched (it is the substrate); only the motion layer transposes to kf.

**Falsifiable instrument:** `proof:hero-dogfood` — assert the hero's word spans are
driven by a live `Animation`/`AnimationGroup` instance reachable on the component (not a
CSS `animation-name`), and that disabling JS leaves the words in their resting frame
(graceful no-JS fallback, not a CSS-only animation). Visual lock on the staggered lift.

---

### F4 — Cube idle-bob is hand-rolled CSS `@keyframes` beside an otherwise fully-dogfooded scene. **[SHIP-in-H, low effort]**

**Anchor:** `CubeTarget.vue:140-155` (`@keyframes idle-bob`).

**Observation:** The cube scene is the flagship `AnimationGroup` dogfood, yet its idle
ambient bob is `animation: idle-bob 3s var(--ease-standard) infinite alternate`
(`CubeTarget.vue:142`) — raw CSS, with a hand-mirrored reduced-motion gate
(`:140`). It is a textbook `CSSKeyframesAnimation` with `direction: "alternate"` +
`iterationCount: "infinite"` (the engine's reduced-motion authority would replace the
CSS `@media` twin). Small, but it is an inconsistency in the *one* scene that most loudly
claims to be engine-driven.

**Gestalt fix:** Fold idle-bob into the cube's existing `useCubeAnimations.ts` group as
one more managed `CSSKeyframesAnimation` (or a `NumericAnimation` on `translateY`),
suspended/resumed by the same play-state machine — so the bob participates in D12's
scene-state restore for free instead of being an orphan CSS loop.

**Falsifiable instrument:** `proof:cube-idle` — assert no `@keyframes idle-bob` survives
in built CSS and the bob is a member of the cube `AnimationGroup` (so it pauses when the
scene's playback is suspended). Visual: bob halts when the cube animation is paused.

---

### F5 — D5: Dock animation/lag is glass-ui's, but the demo's `keepOpen()`/`release()` + hover-sync coupling can compound the lag. **[glass-ui-HANDOFF + RECORD the kf-side coupling]**

**Anchor:** `ChromeDock.vue:73-102` (`dockRef`, the `keepOpen`/`release` watch, the
`controlsPaneHover` sync), `:116` (`<GlassDock :collapse-delay="2500"
:start-collapsed="true">`).

**Observation (live):** The dock's collapse/expand spring + the @mbabb popover are
glass-ui-owned (`@mkbabb/glass-ui/dock`, `:8-10`) — per the mandate I AUDIT + SUGGEST,
not patch. The lag (D5) and the non-opening DockDropdownTrigger popover (D5/D9) are
glass-ui's AW-tranche domain. **However**, the demo adds two coupling points that can
amplify perceived lag and must be tagged for the handoff so glass-ui doesn't chase a
ghost: (a) `ChromeDock.vue:76-78` watches `dockRef.value?.expanded` and writes a
*provide/inject* hover flag on every expand toggle, and (b) `:99-102` calls
`keepOpen()`/`release()` on every popup-open change. If glass-ui's dock re-runs its
spring on `keepOpen`/`release`, these demo writes can re-trigger the spring mid-flight —
a plausible contributor to the "laggy" feel. The `collapse-delay="2500"` (`:116`) also
makes the dock feel "stuck open" for 2.5s, which reads as sluggish.

**Gestalt suggestion (for the handoff):** glass-ui should make `keepOpen`/`release`
idempotent w.r.t. the running spring (no re-fire if already in the target state), and
expose whether `expanded` toggles should suppress the demo's hover-sync during an
in-flight spring. The demo side should debounce/guard its watch so it doesn't write on
every spring frame. The popover-not-opening is squarely glass-ui (D9 restore depends on
it).

**Falsifiable instrument (kf-side):** `proof:dock-coupling` — assert the demo's
`keepOpen`/`release` watch fires at most once per state edge (not per spring frame), and
that the hover-sync write is guarded. The lag-itself gate lives in glass-ui's tranche.

**Tag:** `glass-ui-HANDOFF` (the spring lag + popover) · `RECORD` (the kf-side coupling
guard).

---

### F6 — Scene-hop under corrupted state throws a live engine parse error: `Parse error at offset 0: "......"`. **[SHIP-in-H — hardening; cross-lane with D12]**

**Anchor (live observation):** Reproduced at `http://localhost:5174/` by rapid
scene-hopping after `localStorage.clear()` + re-navigation. Console error:

```
Error: Parse error at offset 0: "......"
  at CSSKeyframesAnimation.processFrame (src/animation/engine.ts:576)
  at CSSKeyframesAnimation.interpFrames (src/animation/engine.ts:516)
  ... value.js _lerp → keyFn
```

The string `"......"` is the hero ellipsis `"..."` *doubled* (two keyframe endpoints of
`"..."`), being fed to `value.js`'s lerp as if it were an interpolable value — it parses
at offset 0 and throws. A **clean** load of any single scene (e.g.
`#/starting-style`) shows **0 errors**; the throw appears only on the corrupted
multi-hop path. This is the animations-quality face of **D12** (scene-state corruption):
a stale/leaked animation carrying the hero's text content survives a scene switch and
gets driven by `interpFrames`.

**Why it's MY lane too:** it confirms F1/F3 — the hero ellipsis text is leaking into an
*engine* animation it should never reach (the hero should be a clean dogfooded
`NumericAnimation` on *opacity*, never a keyframe whose *value* is the literal `"..."`).
Fixing F1/F3 (drive the dots/words by opacity, not by interpolating the glyph string)
*also* removes the class of value that can throw here. The state-machine restore is
D12's lane; the "don't interpolate text content" invariant is mine.

**Gestalt fix:** Hero/dots animations interpolate *numeric* properties (opacity,
translateY) only — never the text content. Combined with D12's suspend/restore, no
animation should outlive its scene. Add an engine guard: `processFrame` should treat a
non-interpolable value (a bare string that is not a known unit/color) as a discrete
hold, not a hard throw — but the *primary* fix is upstream (don't feed it text).

**Falsifiable instrument:** `proof:no-text-lerp` — a console-error gate: hop
easing→cube→easing→spring→starting-style→home 5× and assert **0** `Parse error` / 0
uncaught engine errors. Plus a unit lock: `CSSKeyframesAnimation` built from the hero
primitive never enqueues a string-valued keyframe to `_lerp`.

---

### F7 — Gold shimmer + tab-panel `enter` are hand-rolled, but these are the JUSTIFIED CSS cases. **[RECORD / BOOK]**

**Anchor:** `design-idioms.css:215-227` (`@keyframes gold-shimmer-slide`),
`:404-413` (`@keyframes enter`).

**Honest assessment:** Not every chrome animation must be kf. The gold shimmer is a
perpetual `background-position` sweep on a text-clip gradient — a pure paint effect with
no JS state, no scrub, no scene coupling. Driving it through the engine would be
*ceremony without benefit* (the engine's value is interpolation/orchestration; a
2-keyframe infinite bg-position loop is the CSS sweet spot). **RECORD** as a deliberate
CSS-native choice; do not dogfood for dogma.

The `@keyframes enter` tab slide (`:404`) is a `tw-animate-css` twin the demo localized
to escape the cross-repo rent (well-documented at `:394-403`). It is reactive to
`[data-state=active]` (reka-ui state), which CSS handles natively. **BOOK** a small
review of whether the tab slide *should* dogfood (it could, via `AnimationGroup` keyed
on the active tab), but it is low-value and the current localization is sound. This is an
*honest already-reasonable* call — flagged so H doesn't over-correct into dogma.

**Falsifiable instrument:** none needed — these are RECORD/BOOK; the gate is the F1–F4
dogfood set, not these.

---

### F8 — `.scale-on-hover` hover lift is correctly a CSS transition (D2/D14 reconcile note). **[RECORD]**

**Anchor:** `design-idioms.css:177-188`.

**Observation:** The 13-site hover lift is `transition: scale var(--duration-fast)
var(--ease-standard)` on the `scale` longhand (`:179`) — a state-driven hover, which is
the *correct* CSS primitive (a hover is a binary state toggle, not a timeline). It does
NOT need kf. D2/D14 (the broken radial-blur vs. the wanted cartoon-shadow + refined
specular hover) is a *styling* defect in a sibling lane (`a-glow-artifact`), NOT a
dogfooding gap — the hover *mechanism* (CSS transition) is right; only the *property
being transitioned* (the radial-blur box-shadow at `.progress-dot`,
`design-idioms.css:263-269`) is wrong. **RECORD** here to disambiguate: do not convert
hover lifts to kf; the cartoon-shadow restoration is the glow lane's job.

---

## DISPOSITION SUMMARY

| # | Finding | Disposition |
|---|---|---|
| F1 | D6 typing dots: one-span clump + double-bound + wrong primitive; dogfood via stagger+NumericAnimation | **SHIP-in-H** |
| F2 | D13 drawer not springy / foreign spring token; emit own `linear()` per StartingStyle pattern | **SHIP-in-H** + glass-ui-HANDOFF (token) |
| F3 | D7 hero lift hand-rolled; dogfood via CSSKeyframesAnimation + stagger (typography already SOTA) | **SHIP-in-H** |
| F4 | Cube idle-bob hand-rolled beside dogfooded scene; fold into the group | **SHIP-in-H** |
| F5 | D5 dock lag is glass-ui; demo `keepOpen`/`release` + hover-sync coupling can amplify | **glass-ui-HANDOFF** + RECORD |
| F6 | Live `Parse error "......"` — hero text leaking into engine lerp on corrupted hop | **SHIP-in-H** (cross-lane D12) |
| F7 | Gold shimmer + tab `enter`: justified CSS, do not over-dogfood | **RECORD / BOOK** |
| F8 | `.scale-on-hover` correctly CSS; D2/D14 is styling not dogfooding | **RECORD** |

## ALREADY-SOTA (do not touch)
- Scene cross-dissolve via `SpringProgress` (`useSceneSwap.ts:45`).
- CopyButton feedback via `CSSKeyframesAnimation` + `AnimationGroup` (`CopyButton.vue:52-92`) — the reference dogfood pattern.
- Scene subjects (easing/spring/sequence/motion-path/discrete) — they ARE the engine showcase; `springLinearStops`/`SpringProgress`/`stagger`/`NumericAnimation` all dogfooded (`useEasingDemo.ts`, `useSpringDemo.ts`, `useSequenceDemo.ts`, `StartingStyleTarget.vue:94`).
- Hero φ-ladder typography substrate (`style.css:41-75`) — sound; D7 is a sizing tune + the motion transpose (F3), not a token change.

## THE THESIS (for H synthesis)
keyframes.js's tagline is "CSS keyframe animations for **anything** in JavaScript." The
demo proves this for its *scene subjects* but contradicts it on its *own chrome*, where
it hand-rolls (and breaks — D6, F6) the very `@keyframes` it could parse. The fix is not
dogma (F7/F8 stay CSS): it is to dogfood the *stateful, staggered, scene-coupled*
chrome — the hero, the dots, the drawer spring, the idle bob — so the landing page is,
from first paint, a live instance of the product it sells. The reference pattern already
exists in-tree (`CopyButton.vue`); H applies it uniformly.
