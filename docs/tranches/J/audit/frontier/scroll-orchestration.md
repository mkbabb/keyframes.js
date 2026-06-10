# Frontier lane — Scroll orchestration, divined the kf way

**Lane:** scroll-orchestration (FRONTIER-RESEARCH fleet, K-tranche seeding · 2026-06-10,
attempt 2). **Charter:** the named **#1 capability gap** (`sota-landscape.md §4 BEHIND-1`:
"nothing in ScrollTrigger's class — pin, scrub smoothing, snap, enter/leave, batch — the
single largest capability gap"). Is a ScrollTrigger-class scroll tier a frontier-defining,
ON-BRAND K-tranche headline for keyframes.js — and which seam can ONLY a
CSS-source-of-truth / spring / conservative-WAAPI-delegation engine occupy?

Method: internal source surface (`file:line`) + the value.js extractor evidence (what kf
parses TODAY) + WebSearch/WebFetch-verified June-2026 platform facts (§Sources). Verdict
vocabulary per the fleet charter. **Skeptical of its own lane:** the brief offers four
sub-capabilities (pin / scrub / snap / the CSS grammar); two of them (scrub-smoothing, snap)
are ALREADY-BUILT primitives needing only a driver, one (the grammar) is the genuinely
novel on-brand headline, and one (pin) is a researched HALF-KILL (CSS `position: sticky`
synthesis wins; transform-pinning is rejected). The honest shape is: **one
K-HEADLINE-CANDIDATE (the CSS scroll-grammar round-trip), two K-CANDIDATE driver waves
that mostly COMPOSE shipped primitives, one J-FOLD, and one explicit half-KILL.**

---

## §0 The decisive distinction up front — this is NOT the ScrollTimeline-native KILL

The ARCH kill list carries **ScrollTimeline-native-REPLACE** (recorded B-KILL,
`C.md:265`; "permanent KILL, RECORD do NOT re-litigate" `I.md:421`; carried forward
`J.md:335`). The killed thing is precise: **replacing kf's JS `Timeline` progress driver
with the native `animation-timeline` so the JS sampler ceases to exist.** The kill's reason
(`A/audit/constellation-grand-audit-2026-06-02.md:87`, `timeline.ts:210-226`): native
scroll-driven is Chromium-gated/not-Baseline, and the JS `Timeline` is *strictly more
general* — it drives non-DOM targets and applies `SmoothProgress` smoothing + boundary snap
the native `animation-range` path has none of.

**The fleet charter states the boundary explicitly:** *"NET-NEW scroll ORCHESTRATION
capability is NOT this kill and is fair game; `createNativeTimeline` already wraps native
timelines."* This lane is squarely inside that grant. Three reasons it is categorically not
the killed thing:

1. **It ADDS a tier above the driver; it replaces no driver.** kf already SHIPS the
   conservative-correct delegation this lane extends: `attachNativeScrollTimeline`
   (`waapi.ts:440-473`) attaches an eligible DOM animation to a native
   `ScrollTimeline`/`ViewTimeline` for compositor sampling, and `createNativeTimeline`
   (`timeline.ts:227-259`) feature-detects the native globals and returns `null` (caller
   keeps the JS sampler) where absent. The kill was about DELETING the JS path; this lane's
   delegation matrix (§4) KEEPS it as the universal fallback — the identical "additive fast
   lane, no polyfill, JS sampler is the general driver" philosophy already in the source
   (`waapi.ts:426-428`, the CRITICAL comment).

2. **The orchestration capabilities the platform CANNOT do are JS-only by construction**
   (§3): scrub-smoothing, snap-to-range with spring/decay, velocity-aware enter/leave,
   Firefox/Safari-<26 coverage. These have no native primitive to replace.

3. **The headline (§2) is a PARSE capability, orthogonal to the driver entirely** — reading
   `animation-timeline`/`animation-range`/`timeline-scope` declarations from author CSS and
   round-tripping them. The kill never touched the parser.

A proposal here only re-enters the kill if it argues *"delete the JS `ScrollTimeline`,
native is enough now."* It is not (§1) and this lane never argues it. **Distinction
cleared.**

---

## §1 The platform frontier (verified, June 2026)

| Fact | Status | Source |
|---|---|---|
| `animation-timeline: scroll()` / `view()` (scroll-driven progress) | **NOT Baseline** — Chrome/Edge 115+, **Safari 26** (shipped), **Firefox behind a flag** (default in Nightly; requires non-zero `animation-duration`). ~85% caniuse. | MDN; caniuse; design.dev |
| `animation-range` / named timelines / `timeline-scope` | Ships WITH the above; **named timelines are scope-restricted** — referenceable only by the creating element + descendants unless hoisted via `timeline-scope` on a shared ancestor | MDN Timelines; kizu.dev |
| **`animation-trigger` + `timeline-trigger`** (DISCRETE scroll-triggered playback — the enter/leave/toggle layer) | **Chrome 145, 2026** (NEW — Dec 2025 announce). `animation-trigger: --t play-forwards play-backwards;` · `timeline-trigger: --t view() entry 100% exit 0% / entry 0% exit 100%;`. The CSS WG is itself absorbing ScrollTrigger's `toggleActions`. | Chrome blog (scroll-triggered-animations); bram.us 2025-12-12 |
| `scroll-state()` container queries (`stuck` / `snapped` / `scrollable`) | **Chrome 133+** — declarative styling on stuck/snapped state; not Baseline | Chrome blog; Chrome Wrapped 2025 |
| `scrollsnapchange` / `scrollsnapchanging` events + `SnapEvent` | **Chrome 129+ / Edge ONLY** — not Baseline; experimental | Chrome blog scroll-snap-events; MDN SnapEvent |
| **The pure-CSS limits that keep JS alive** | scroll-driven `linear()` means "match scroll EXACTLY" — adding an easing curve DOUBLE-eases (wrong); only compositor props (transform/opacity) get the perf win; **no scrub-smoothing, no snap-with-physics, no velocity, no main-thread sequencing**. "Reach for JavaScript when you need complex sequencing, physics-based animations, or all-browser support today." | dev.to 2026; sitepoint 2026; Josh Comeau |
| GSAP ScrollTrigger capability set (the bar) | pin (with auto-padding), scrub (`scrub: 1` = 1s catch-up smoothing), snap (progress values + directional + velocity), `toggleActions` (`onEnter onLeave onEnterBack onLeaveBack`), batch (rAF-windowed callback grouping), ScrollSmoother (native-scroll-based smooth scroll). | gsap.com ScrollTrigger docs |

**The load-bearing read:** the platform in mid-2026 has the *progress* layer (scroll-driven
timelines, Safari-26-shipped) and is *just now* growing the *trigger* layer
(`animation-trigger`, Chrome-145-only). Neither covers Firefox-default, **none** covers
scrub-smoothing / physics-snap / velocity / cross-browser-today — the exact band GSAP owns
and the exact band kf's SHIPPED `SmoothProgress` / `SpringProgress` / `decay` already
inhabit. **The gap is real and durable; the question is purely whether kf's occupation is
ON-BRAND or a me-too ScrollTrigger clone.**

---

## §2 The HEADLINE seam — scroll orchestration AS CSS (the only-kf move)

kf's #1 unique axis is **CSS `@keyframes` as a parseable, round-trippable source of truth**
(`sota-landscape.md §4 AHEAD-1`). Every competitor — GSAP, Motion, anime — expresses scroll
binding in a *proprietary imperative API* (`ScrollTrigger.create({trigger, start, end,
scrub, pin})`). **Only kf could express it as the CSS the platform itself standardized**, by
extending its parser to the scroll-binding declarations and round-tripping them.

**The decisive prior fact — the grammar gap is one extractor away.** value.js's stylesheet
extractor (`/value.js/src/parsing/extract.ts:114-176`) already parses `animation-name`,
`-duration`, `-delay`, `-iteration-count`, `-direction`, `-fill-mode`,
`-timing-function`, `-composition`, AND the `animation:` shorthand
(`animation-shorthand.ts`). It does **NOT** parse `animation-timeline`, `animation-range`,
`scroll()`/`view()` functions, `timeline-scope`, or the new `animation-trigger` /
`timeline-trigger`. That is the precise, bounded grammar subset kf would add — and because
kf already *serializes back from the declared template* (`format.ts`, the
serialize-from-template authority, `J.md` ENG-1), it would be the **only library that
round-trips a scroll-driven stylesheet**: parse author CSS → animate (via native delegation
where eligible, JS driver where not) → serialize back to valid CSS.

### The capability spec sketch — `K-HEADLINE: the scroll-grammar round-trip`

**The grammar subset to parse (value.js extractor + a kf-side `ScrollScene` adapter):**

```css
/* Author writes STANDARD CSS. kf parses, drives, round-trips. */
@keyframes reveal { from { opacity: 0; translate: 0 40px } to { opacity: 1; translate: 0 0 } }

.card {
  animation: reveal linear both;
  animation-timeline: view();          /* ← NEW: parse scroll/view timeline */
  animation-range: entry 0% cover 40%;  /* ← NEW: parse the range */
}
/* and the 2026 trigger layer, where kf is the cross-browser polyfill: */
.panel {
  animation: slide-in linear;
  animation-trigger: --t play-forwards play-backwards;  /* ← NEW */
  timeline-trigger: --t view() entry 100% exit 0%;       /* ← NEW */
}
```

**What kf does with the parse (the "one declaration, two backends" pattern, identical to
the WAAPI seam and the scene-swap VT seam in the sibling `view-transitions.md` lane):**

- **Eligible + native supported (Chrome/Safari-26)** → delegate to native via the EXISTING
  `attachNativeScrollTimeline` (`waapi.ts:440`) — compositor sampling, zero main-thread.
- **Native absent (Firefox-default, Safari <26, jsdom, SSR) OR ineligible (computed units,
  color interp, custom transform, the WAAPI-ineligible set)** → drive via a JS `ScrollScene`
  riding the SHIPPED `ScrollTimeline` sampler (`timeline.ts:162`) + the engine.
- **Round-trip** → `format.ts` re-emits the `animation-timeline`/`animation-range`
  declarations faithfully from the template (the serialize-from-template authority).

**Why ONLY kf:** the round-trip closes the loop no imperative library can. A design tool, a
no-code builder, or a CSS-first author writes scroll-driven CSS; kf parses it, makes it work
on Firefox-today AND non-DOM targets AND with physics the platform lacks, and hands back
valid CSS that degrades to the native engine when the browser catches up. **The CSS IS the
source of truth; kf is the universal interpreter + the graceful-degradation bridge.** This
is the parse/round-trip axis extended to the single largest gap — the most on-brand move
available.

**Effort: L** (the value.js extractor extension is a sibling HANDOFF — it lives where the
`animation-*` parsing already lives; the kf-side `ScrollScene` adapter + the
eligible/native/JS dispatch is a thin composition over `attachNativeScrollTimeline` +
`ScrollTimeline`). **Measure-first gate:** none for the parse itself (correctness, not
perf); the dispatch's perf claim ("native delegation = zero main-thread") is already proven
by the existing WAAPI bench posture.

---

## §3 The JS-only orchestration band — what the platform CANNOT do, kf already half-owns

These are the capabilities GSAP sells that NO native CSS primitive provides. The striking
finding: **kf has already SHIPPED the hard physics primitives; what is missing is the scroll
DRIVER that wires them in.** This is composition, not invention.

| ScrollTrigger capability | The kf primitive that ALREADY exists | What is genuinely missing |
|---|---|---|
| **scrub smoothing** (`scrub: 1` = 1s catch-up) | **`SmoothProgress`** (`smooth.ts`) — exponential damping with `damping`/`snapThreshold`/`targetEpsilon`/boundary-snap; the `ScrollTimeline` pipeline ALREADY runs it (`timeline.ts:79-110`) | nothing — it is the `ScrollTimeline` default. The native lane CANNOT smooth (`waapi.ts:430-437` documents this divergence). **kf's scrub-smoothing is a STRICT capability native scroll-driven lacks.** |
| **snap** (reposition playhead to progress values when scroll stops) | **`decay`** (`decay.ts`: `decayRest` = closed-form projected fling endpoint) + **`SpringProgress`** (settle to a target) + the `scrollsnapchange` event (Chrome-only) | the snap DECISION layer: on scroll-idle, pick the nearest range boundary and `SpringProgress`/`decay` the scroll (or the progress) to it. ~thin. |
| **enter/leave/toggle** (`toggleActions`) | **`AnimationGroup`** play/pause/reverse + the engine's direction/fill; the `animation-trigger` CSS (Chrome-145) is the native twin to parse | the threshold-crossing detector (IntersectionObserver-class, but kf would derive it from the parsed `animation-range` to stay CSS-sourced). |
| **pin** (lock element between scroll positions) | — | the synthesis. See §3.1 — researched HALF-KILL. |
| **batch** (rAF-window callback grouping) | **`AnimationGroup.YIELD_BATCH=32`** (`group.ts`) already batches child ticks with `scheduler.yield` for INP relief | the scroll-entry batching is the same idiom applied to enter callbacks. Likely a J-FOLD, not a wave. |

### §3.1 PIN — the researched HALF-KILL: `position: sticky` synthesis WINS, transform-pinning LOSES

The brief asks to research both. The evidence is decisive and it is a *sibling-confirmed*
verdict:

- **Transform-pinning** (lock via `transform: translateY()` tracking scroll) is **rejected.**
  The web consensus (CSS-Tricks "Scroll-Driven Sticky Heading"; Josh Comeau): scroll
  repaints run on a different thread, so transform-tracked pins jitter/desync against the
  compositor; `position: sticky`/`fixed` "deliver better performance overall." This is the
  SAME structural lesson the sibling `view-transitions.md §2` records from glass-ui: the dock
  team BUILT a transform-ish VT-snapshot morph and DELETED it for a spring scalar —
  rasterized/transform-tracked layout is "the wrong primitive." kf must not repeat it.
- **`position: sticky` synthesis is the on-brand pin.** The 2026 idiom (Chrome scroll-driven
  docs; Frontend Masters "Scroll-Driven Sections"): pin with `position: sticky`, then drive
  the *animation* off a `view()`/`scroll()` timeline of the sticky element's container. kf's
  role is NOT to reimplement sticky (the browser does it natively, on the compositor) — it is
  to **emit the sticky CSS as part of the parsed `ScrollScene`** and drive the pinned
  interval's animation through the §2 dispatch. kf synthesizes the `position: sticky` +
  range CSS from a `pin()` author intent and round-trips it.

**Verdict on pin: BOOK the transform-pin path as KILLED (sibling-confirmed wrong primitive);
the `sticky`-synthesis pin folds into the §2 `ScrollScene` headline as a CSS-emit helper, not
a separate physics engine.** kf owns no pinning *mechanism* — it owns the CSS *authoring* of
the platform's pinning mechanism. That is the only kf-shaped pin.

---

## §4 The native-vs-JS delegation matrix (the conservative-correct seam, extended)

This is the WAAPI eligibility gate (`waapi.ts` `isWAAPIEligible`) generalized to the scroll
clock. The discipline is identical: **delegate to the compositor where provably correct,
fall back to the always-correct JS driver otherwise, never polyfill, query the reason.**

| Condition | Backend | Why |
|---|---|---|
| DOM target · WAAPI-eligible curve (no computed units, no color interp, default renderer, uniform easing) · native `ScrollTimeline`/`ViewTimeline` present | **NATIVE** via `attachNativeScrollTimeline` (`waapi.ts:440`) | compositor sampling, zero main-thread; already shipped |
| Native present BUT scrub-smoothing / snap-physics / velocity requested | **JS** `ScrollScene` over `ScrollTimeline` | native `animation-range` has no smoother (`waapi.ts:430-437`); SmoothProgress/decay are JS-only by construction |
| Native ABSENT (Firefox-default, Safari <26, jsdom, SSR) | **JS** `ScrollScene` | the kill-proof general fallback; `createNativeTimeline → null` (`timeline.ts:230`) |
| Non-DOM target (plain object, canvas, WebGL uniform) | **JS** `ScrollScene` over `NumericAnimation`/`Timeline` | native scroll-driven is DOM-only; the JS driver is the only general one (the kill's core reason) |
| Computed/container-unit (`cqw`/`calc`/`var`) or color-interp animation | **JS** `ScrollScene` | WAAPI-ineligible set; needs per-frame DOM resolution / oklab — kf's other two unique axes |
| `animation-trigger` discrete toggle, Chrome 145 | **NATIVE** where present, **JS** enter/leave detector elsewhere | kf is the cross-browser polyfill for the trigger layer until Baseline |

The `ScrollScene` exposes a queryable `nativeAttachment` / `ineligibleReason` exactly like
`waapiIneligibleReason` (`waapi.ts`) — the proof-gated honesty kf already practices. **No new
philosophy: the WAAPI seam, pointed at the scroll clock.**

---

## §5 The capability-spec primitives (the K-tranche surface sketch)

A coherent, KISS surface — three names, each composing shipped parts, light-boundary clean
(no static value.js edge; the parse is the heavy/HANDOFF half):

```ts
// LIGHT — composes ScrollTimeline + SmoothProgress + decay + the engine's group
createScrollScene(spec | css): ScrollScene
  .pin(selector?)        // emits position:sticky CSS + range; NOT a transform engine (§3.1)
  .scrub(seconds)        // → SmoothProgress damping (shipped)
  .snap(ranges, spring)  // → decayRest/SpringProgress settle on scroll-idle (shipped)
  .on('enter'|'leave', cb)   // threshold detector derived from parsed animation-range
  .attach()              // runs the §4 dispatch: native where eligible, JS otherwise
  get nativeAttachment   // queryable honesty, mirrors waapiIneligibleReason

// The Sequence orchestrator (sequence.ts) becomes the master playhead a ScrollScene
// can drive: scroll progress → Sequence.advanceTo (the timeScale/reverse already exist).
```

The `Sequence` class (`sequence.ts:97`) ALREADY is a master-playhead orchestrator with
`advanceTo`, `_rate` (timeScale/reverse), `_repeatCount`, labels, and `"+="`/`"-="`
positions — a scroll-driven `ScrollScene` drives `Sequence.advanceTo(scrollProgress *
duration)` for free. **The orchestration spine exists; the scroll DRIVER is the new part.**

---

## §6 Verdicts (skeptical of own lane)

| # | Proposal | Verdict | One-line reason |
|---|---|---|---|
| SO-1 | **The scroll-grammar round-trip** (parse `animation-timeline`/`-range`/`timeline-scope`/`animation-trigger`; dispatch native↔JS; serialize back) | **K-HEADLINE-CANDIDATE** | the ONLY library that round-trips scroll-driven CSS; extends kf's #1 unique axis at the #1 gap |
| SO-2 | **`ScrollScene` JS driver** (scrub via SmoothProgress, snap via decay/spring, enter/leave) — the Firefox-today / non-DOM / physics band | **K-CANDIDATE** | net-new capability, but COMPOSES shipped primitives; a K wave under SO-1 |
| SO-3 | **`sticky`-synthesis pin** (emit `position: sticky`+range CSS from `pin()` intent) | **K-CANDIDATE** (folds into SO-1's `ScrollScene`) | kf authors the platform's pin; owns no pin mechanism |
| SO-4 | **Transform-pinning** (track scroll via `transform: translateY`) | **KILL** | sibling-confirmed wrong primitive (cross-thread repaint jitter; the glass-ui dock-VT scar); `sticky` wins |
| SO-5 | **Scroll-entry batching** (rAF-window enter callbacks) | **J-FOLD** → reuses `AnimationGroup.YIELD_BATCH`/`scheduler.yield` idiom; too small for a wave | already the group's batching idiom |
| SO-6 | **Native ScrollTimeline REPLACE the JS driver** | **KILL** (re-affirm ARCH) | the permanent kill; this lane never proposes it (§0) |

**The honest synthesis.** Scroll orchestration IS a frontier-defining K-tranche headline for
kf — but the headline is NOT "build ScrollTrigger." It is **"be the only engine that treats
scroll-driven CSS as a parseable, round-trippable source of truth, drives it on the
compositor where the platform allows and on its shipped physics primitives where the platform
falls short, and hands back valid CSS that degrades into the native engine as browsers catch
up."** Two of the four hard pieces (scrub, snap) are SHIPPED primitives awaiting a driver;
the third (pin) is a CSS-emit helper, not an engine; the fourth (the grammar) is the genuine
novel work and the most on-brand move kf has available. The platform is actively standardizing
the *trigger* layer (`animation-trigger`, Chrome-145) — which makes the round-trip MORE
valuable, not less: kf becomes the cross-browser interpreter of the very syntax the CSS WG is
shipping. **Recommend SO-1 as a K-tranche headline anchor, SO-2/SO-3 as its constituent
waves, SO-4 recorded KILLED, SO-5 a J-FOLD candidate.**

---

## §7 Sources

[MDN scroll-driven timelines](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines) ·
[MDN animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline) ·
[caniuse animation-timeline scroll()](https://caniuse.com/mdn-css_properties_animation-timeline_scroll) ·
[design.dev scroll-timeline guide](https://design.dev/guides/scroll-timeline/) ·
[Chrome blog — CSS scroll-triggered animations are coming](https://developer.chrome.com/blog/scroll-triggered-animations) ·
[bram.us — scroll-triggered animations Chrome](https://www.bram.us/2025/12/12/css-scroll-triggered-animations-are-coming-to-chrome/) ·
[Chrome blog — scroll snap events](https://developer.chrome.com/blog/scroll-snap-events) ·
[MDN SnapEvent](https://developer.mozilla.org/en-US/docs/Web/API/SnapEvent) ·
[GSAP ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) ·
[CSS-Tricks — Scroll-Driven Sticky Heading](https://css-tricks.com/scroll-driven-sticky-heading/) ·
[Josh W. Comeau — Scroll-Driven Animations](https://www.joshwcomeau.com/animation/scroll-driven-animations/) ·
[Frontend Masters — Scroll-Driven Sections](https://frontendmasters.com/blog/scroll-driven-sections/) ·
[dev.to — Complex scroll-driven animations pure CSS 2026](https://dev.to/nickbenksim/creating-complex-scroll-driven-animations-with-pure-css-in-2026-17l) ·
[SitePoint — Scroll-Driven CSS in 2026](https://www.sitepoint.com/scrolldriven-css-in-2026-building-carousels-without-javascript/) ·
[kizu.dev — Future CSS scroll-driven](https://kizu.dev/scroll-driven-animations/)
