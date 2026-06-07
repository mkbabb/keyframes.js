# Tranche G deep audit — animation SOTA 2026 frontier vs the POST-F kf engine

**Lane:** `r-animation-sota` (FOCUS: the 2026 animation-library / platform-motion SOTA
frontier vs the kf engine *after* F shipped MotionPath + the Sequence transport + the
orchestration dogfood + the spring/decay/drag analytics). **Branch:** `tranche-g-dev`
(D+E+F IMPLEMENTED + RELEASED — kf 4.0.0, value.js 0.11.0, parse-that 0.9.0;
keyframes.babb.dev on Cloudflare Pages). **Method:** live code (`file:line`) grounded
against the current published surface of Motion (motion.dev v12.35, Mar 2026), GSAP 3.13
(100% free, Webflow), anime.js v4, Theatre.js, Rive, the WAAPI / ScrollTimeline /
ViewTimeline / MotionPath / View-Transitions platform frontier, and the spring/physics
SOTA. RESEARCH / AUDIT ONLY — ZERO source edits.

**Diff base (cite + extend, do not repeat):** `F/audit/r-anim-libs-2026.md` (the *pre-F*
lane: F26-1..F26-6), `F/FINAL.md` (what F landed — F.W9 Sequence transport, F.W10 dogfood,
F.W12 MotionPath), `F/F.md § ALREADY-SOTA` + Band-4 `GAP-NAMED` block (lines 461-472),
`F/audit/_SYNTHESIS-deferred-ledger.md` (§3.3 VJ-F1, §4.6 NEW-33/36/37, §5 K-1/K-2),
`F/audit/_SYNTHESIS-gap-scorecard.md` (§1.3 E1/E2), `F/valuejs-sota-handoff-v2.md`
(§1 Wave-F F9=VJ-F1, E7 `calc-size()`).

---

## TL;DR — F closed the orchestration + MotionPath frontier; ONE real engine gap remains, and it is BOOK-shaped (value.js-blocked)

The pre-F lane (`r-anim-libs-2026`) named six items. **F shipped F26-1a (CSS-native
MotionPath, `motion-path.ts` — F.W12), F26-2 (the complete Sequence transport, `sequence.ts`
— F.W9), and F26-3 (the orchestration dogfood, `useOrbitalInertia` onto `decay()` — F.W10),
and KILLed F26-5 / RECORDed F26-6.** I verified each in the live tree. What is STILL
not-SOTA is *exactly what F BOOKed* — and the frontier has NOT widened since F (the
competitive map is stable, the SVG triad + SplitText were the gap then and remain the gap):

1. **The SVG-geometry triad (MorphSVG · DrawSVG · numeric MotionPath) is the one real
   persisting competitor-feature gap — and it is BLOCKED on value.js VJ-F1, which value.js
   0.11.0 did NOT ship.** (G26-1, BOOK + value.js-HANDOFF — verified `value.js/src/` has no
   path-geometry module.)
2. **DrawSVG is the SHIP-able sliver of that triad** — stroke line-drawing is
   `stroke-dasharray`/`stroke-dashoffset` keyed off ONE `getTotalLength()` read; it needs NO
   `d`-parse, NO point-count reconciliation, and is WAAPI-eligible. This is the F26-1a-class
   "CSS-native sliver" of the SVG suite that F did not separate out. (G26-2, **SHIP-in-G** —
   the one real gap with a cheap engine-side close.)
3. **`splitText` (Intl.Segmenter)** completes the stagger story; the demo grapheme-bug F26-4
   flagged is FIXED (F.W16 rewrote `AnimatedText.vue` to word-split), but the engine still
   ships no split primitive. (G26-3, BOOK — re-confirmed, demo-fix discharged.)
4. **Intrinsic-size (`height: 0 → auto`)** — the most-requested animation kf can't do —
   stays GAP-NAMED, gated on value.js `calc-size()` (E7) + non-Baseline native
   `interpolate-size`. (G26-4, BOOK — RECORD don't-adopt-native-until-Baseline.)
5. **`.finished` completion front-door** (NEW-10, BOOKed in F, did not land) is the smallest
   honest ergonomic gap vs Motion/GSAP/WAAPI. (G26-5, **SHIP-in-G** — additive getter.)

**The honest headline: manufacture almost nothing.** F did the heavy lifting; the
spring/decay/drag analytics, the WAAPI harness, the orchestration tier, the Sequence
transport, the MotionPath sliver, and the value.js boundary are all genuinely SOTA and must
be left alone (§ALREADY-SOTA). The one true SHIP-in-G is **DrawSVG** (the CSS-native sliver
of the SVG suite); the one small ergonomic SHIP is **`.finished`**. Everything else is BOOK
(value.js-blocked) or RECORD.

---

## Competitive map — re-drawn for the POST-F state (2026 libraries)

Sources grounded inline; this DIFFS the pre-F map (`r-anim-libs-2026 §Competitive-map`).

| Capability | Motion 12.35 | GSAP 3.13 (free) | anime.js v4 | kf (post-F) | Verdict |
|---|---|---|---|---|---|
| CSS `@keyframes` text → runtime | ✗ | ✗ | ✗ | ✓ `engine.ts fromString` | **LEAD** (unchanged) |
| Perceptual color interp (oklab/oklch) | partial | sRGB | sRGB | ✓ value.js | **LEAD** (unchanged) |
| Analytic spring + live re-seat | numeric | numeric | numeric | ✓ closed-form `spring.ts:149` | **LEAD** (unchanged) |
| Spring → CSS `linear()` (WAAPI) | ✓ generateLinearEasing | ✗ | ✗ | ✓ `springTimingFunction.ts` | **MATCH** (unchanged) |
| `{visualDuration, bounce}` spring | ✓ | partial | ✓ | ✓ `spring.ts:79-90` | **MATCH** (unchanged) |
| Stagger | ✓ | ✓ | ✓ (as position) | ✓ `stagger.ts` | **MATCH** (unchanged) |
| Sequence/labels/position + **transport** | ✓ | ✓ (gold std) | ✓ | ✓ `sequence.ts` (pause/resume/reverse/timeScale/progress/repeat/yoyo) | **MATCH** (F.W9 CLOSED F26-2) |
| FLIP / layout | ✓ | ✓ Flip | ✗ | ✓ `flip.ts` | **MATCH** (unchanged) |
| Drag + inertia/fling | ✓ | ✓ Draggable+Inertia | ✓ Draggable | ✓ `drag.ts`+`decay.ts` | **MATCH** (unchanged) |
| Native scroll-driven delegation | ✓ ViewTimeline | ✓ ScrollTrigger | partial | ✓ `timeline.ts:251` bridge | **MATCH** (unchanged) |
| **MotionPath / offset-path (CSS-native)** | ✓ offsetPath | ✓ MotionPath | ✓ createMotionPath | ✓ `motion-path.ts` (F.W12) | **MATCH** (F CLOSED F26-1a) |
| **MotionPath (numeric, SVG `<path>` sample)** | ✓ | ✓ | ✓ | ✗ | **GAP (G26-1c)** — value.js VJ-F1 |
| **SVG shape morph (MorphSVG)** | partial | ✓ MorphSVG (free) | ✓ morphTo | ✗ | **GAP (G26-1a)** — value.js VJ-F1 |
| **SVG line-drawing (DrawSVG)** | ✗ | ✓ DrawSVG (free) | ✓ createDrawable | ✗ | **GAP (G26-1b → SHIP G26-2)** |
| **Text-splitting (SplitText)** | partial | ✓ SplitText (free) | ✓ splitText | ✗ (demo word-split only) | **GAP (G26-3)** — BOOK |
| **Intrinsic-size (`height:auto`)** | partial | ✗ (plugin) | ✗ | ✗ | **GAP (G26-4)** — value.js E7 |
| **`.finished` completion getter** | ✓ | ✓ (`.then`) | ✓ | ✗ (awaited `play()` only) | **GAP-SMALL (G26-5)** — SHIP |
| Reactive motion-value graph | ✓ useFollowValue | ✗ | ✗ | partial (`SpringProgress.subscribe`) | **RECORD (G26-6)** — binding-layer |
| Layer blending (weighted) | ✗ | ✗ | ✗ | ✓ `group.ts` | **LEAD** (unchanged) |
| State-machine / GPU runtime (Rive) | ✗ | ✗ | ✗ | ✗ (out of lane) | **RECORD (G26-7)** — different product |

---

## Findings

### G26-1 — The SVG-geometry triad (MorphSVG · numeric MotionPath) is the one real persisting gap — value.js VJ-F1 NOT shipped · **BOOK + value.js-HANDOFF**

- **Where (verified absent):** `grep -rniE "getPointAtLength|getTotalLength|morphTo|stroke-dasharray|new Path2D|<path" src/animation/` → **zero hits** (re-run live). The only path surface is `motion-path.ts`, which is the CSS-native sliver: it sweeps `offset-distance` over an author `offset-path` the *browser* resolves, and explicitly docstrings that "the heavier SVG-geometry half — parse a path `d` to a length-parametrized sampler (numeric/canvas MotionPath, MorphSVG, DrawSVG) — is value-domain geometry math, routed OUT to value.js (VJ-F1) and BOOKED, NOT manufactured here" (`motion-path.ts:18-23`).
- **The block is real and UNMOVED:** the F charter routed the path-geometry sampler to value.js as **VJ-F1** (`F/valuejs-sota-handoff-v2.md §1 Wave-F F9`; `F/_SYNTHESIS-deferred-ledger §3.3`). **value.js 0.11.0 did NOT ship it** — `value.js/src/` has `easing/math/parsing/quantize/transform/units` only; `grep -rniE "PointAtLength|TotalLength|parsePath|pathSegment|morph" value.js/src/` → zero geometry hits. So MorphSVG (`d`-lerp with point-count reconciliation) and numeric MotionPath (sample an SVG `<path>` via `getPointAtLength`, feed `NumericAnimation`) remain blocked exactly where F left them.
- **2026 SOTA (grounded, re-confirmed — frontier has NOT widened since F):** GSAP went 100% free in 2025 (Webflow) — MorphSVG/DrawSVG/MotionPath/SplitText baseline-expected [css-tricks.com/gsap-is-now-completely-free, gsap.com/svg]. anime.js v4 ships `morphTo(path, precision)` (converts to cubic béziers, pads points), `createMotionPath()`, `createDrawable()` as core SVG modules [github.com/juliangarnier/anime v4.0.0 release; wiki "What's new in V4"]. This is the *same* map F drew — no new entrant, no new capability; the SVG triad is stable table-stakes.
- **The transposition (idiomatic, unchanged from F):** path-`d` parse → typed segment AST → length-parametrized sampler + point-count-reconciling `d`-lerp is **value-domain geometry math** (CSS/SVG value parsing + interpolation), the natural neighbor of value.js's existing `transform/decompose.ts` (matrix decomposition already lives there — the geometry home exists). It must NOT grow a second geometry home in kf (the §Mandate's no-boundary-breach). The kf-side consumer is thin: feed the sampler's output to `NumericAnimation` (already the zero-alloc SoA carrier) for morph, or to a CSS-string lerp for `d`.
- **Disposition:** **BOOK + value.js-HANDOFF (VJ-F1, re-affirmed for G).** value.js 0.11.0 closed Wave B/C color+computed wins but NOT the path-geometry wave; VJ-F1 carries forward UNCHANGED into the G value.js charter. kf consumes it transparently once value.js publishes it (the same `NumericAnimation`/string-lerp seam). The SHIP-able sliver of the triad is DrawSVG — split out as **G26-2**.
- **Isomorphism:** fully additive; no existing pixel moves.

### G26-2 — DrawSVG is the SHIP-able CSS-native sliver of the SVG suite — one `getTotalLength()` read, WAAPI-eligible · **SHIP-in-G**

- **The insight F did NOT separate:** the F lane (`r-anim-libs-2026 F26-1c`) and the charter (`F.md:466-469`) bundled DrawSVG *with* MorphSVG under VJ-F1 ("Park beside 1b"). **That bundling is wrong on re-examination.** DrawSVG is line-drawing: animate `stroke-dashoffset: L → 0` where `L = el.getTotalLength()`, with `stroke-dasharray: L`. It needs **NO `d`-parse, NO point-count reconciliation, NO value.js geometry** — only ONE `getTotalLength()` DOM read at construction (the exact pattern of MotionPath's "browser owns the geometry, kf interpolates a scalar"). It is the *DrawSVG analogue of F26-1a's CSS-native MotionPath sliver* — and F's own reasoning for shipping 1a separately (`motion-path.ts:14-16`: "the one path capability that is pure CSS the compositor resolves") applies identically.
- **Where it slots:** a `fromDrawSVG(svgPathEl, { from?: "0%", to?: "100%" })` factory that (1) reads `getTotalLength()` once, (2) sets `stroke-dasharray: L`, (3) builds a `CSSKeyframesAnimation` over `stroke-dashoffset: L*(1-from) → L*(1-to)`. It mirrors `motion-path.ts` exactly — HEAVY boundary (imports `./engine`), no value.js edge, behind `loadAnimationEngine()`. **WAAPI-eligible:** `stroke-dashoffset` is a `<length>` (animatable, compositor-friendly — anime.js/GSAP both delegate it); it passes `isWAAPIEligible` unchanged (no computed unit, no color, uniform timing). Verify against the gate at `waapi.ts:160`.
- **2026 SOTA:** GSAP DrawSVGPlugin "animates the stroke of an SVG path by tweening its stroke-dasharray and stroke-dashoffset" — exactly this [gsap.com/svg]; anime.js `createDrawable()` exposes a `draw` proxy property over the same mechanism [animejs v4 wiki].
- **Disposition:** **SHIP-in-G.** This is the genuine highest-ROI engine-side close of the post-F frontier — a competitor-feature gap with a cheap, value.js-free, WAAPI-eligible engine implementation that reuses the exact `motion-path.ts` shape. MorphSVG + numeric MotionPath stay BOOKed under VJ-F1 (G26-1) — they DO need the geometry sampler; DrawSVG does not.
- **Falsifiable instrument (per SHIP):** `proof:drawsvg` — (a) a unit test asserting `stroke-dasharray === getTotalLength()` and `stroke-dashoffset` sweeps `L → 0` for `from:0% to:100%`; (b) a WAAPI-eligibility lock asserting `fromDrawSVG(...)` over a uniform CSS-twin easing passes `isWAAPIEligible` (the `motion-path.ts` `proof:motion-path` sibling). The negative control: a non-uniform/computed-unit draw stays on rAF.
- **Isomorphism:** additive factory; no existing pixel moves.

### G26-3 — `splitText` (Intl.Segmenter) — completes the stagger story; the demo grapheme-bug is FIXED, the engine primitive is not · **BOOK**

- **Where (verified):** `grep -rniE "splitText|Intl.Segmenter|grapheme" src/` → zero. The engine's text story is the `typewriter` preset (`animations.ts`, `steps()`/clip) and the demo. **The F26-4 demo grapheme-bug is DISCHARGED:** F.W16 rewrote `AnimatedText.vue` to split by `/\s+/` into WORD spans with a visually-hidden AT mirror + `text-wrap: balance` (`AnimatedText.vue:1-14,52-53` — the old raw-UTF-16 per-char split is gone). So the demo correctness concern the F lane raised is closed; what remains is purely the *engine primitive*.
- **2026 SOTA:** GSAP SplitText (free) is the genre reference — "break text into lines, words, or letters, with automatic resizing and built-in masking" [css-tricks GSAP-free]; anime.js v4 `splitText` "splits strings into spans for text animations" [animejs v4 release]. SplitText + stagger is the single most-reached-for designer combination — and kf has the stagger half (`stagger.ts`) but not the split half to feed it.
- **The transposition:** a value.js-free `splitText(element, { by: "chars"|"words"|"lines" })` over **`Intl.Segmenter`** (Baseline 2024 — grapheme-correct, the platform-native splitter), wrapping each unit in a span, returning the indexed array designed to hand to `stagger`. It belongs on the LIGHT barrel (DOM-only, no value.js, no CSS parse). It is the natural *completion* of the stagger story E shipped.
- **Disposition:** **BOOK (re-affirmed for G; demo-fix discharged).** High designer-ROI and it completes the stagger story, but it is net-new DOM surface (wrap/unwrap, a11y aria reconstruction, line re-split on resize) that deserves a deliberate design pass, not a drive-by. The §Mandate's KISS + measure-first: promote to SHIP only with a concrete demo scene driving it. The grapheme-correctness floor (`Intl.Segmenter`) is the non-negotiable for any future implementation. NOTE the difference from G26-2: DrawSVG is a tiny `getTotalLength`-and-sweep wrapper (SHIP); `splitText` is genuine new surface with a11y/resize lifecycle (BOOK).

### G26-4 — Intrinsic-size (`height: 0 → auto`) — the most-requested animation kf can't do · **BOOK (value.js E7 + non-Baseline native)**

- **Where (verified absent):** `grep -rniE "interpolate-size|calc-size|intrinsic" src/animation/` → zero. kf cannot animate `height: 0 → auto` (or `width`/`grid-template-rows`).
- **2026 platform status (grounded):** native `interpolate-size: allow-keywords` + `calc-size()` is **NOT Baseline** — Chrome/Edge 129 only, Firefox/Safari absent (re-confirmed June 2026; the platform CWV/scroll corpus and `r-waapi-platform-2026 §3` agree). The native delegation is a guarded enhancement, NOT a drop-in.
- **The two-track shape F named (`F.md:462-465`, GAP-NAMED, unchanged):** (1) a native PE fast-lane behind feature-detect; (2) a JS-measure fallback (`getBoundingClientRect` the auto height, animate the px, snap to `auto` on finish). The native delegation needs value.js's `calc-size()` parser (E7, `F/valuejs-sota-handoff-v2.md §1 Wave-E E7`) — value.js 0.11.0 did NOT ship E7 (`grep -rniE "calc-size" value.js/src/` → zero).
- **Disposition:** **BOOK + value.js-HANDOFF (E7) + RECORD don't-adopt-native-until-Baseline.** This is genuine net-new engine surface (an `IntrinsicSizeValue` interp branch) that deserves its own wave with the JS-measure fallback as the portable path; the native lane is a guarded enhancement gated on Baseline. Not a G drive-by. Carries forward UNCHANGED from F's GAP-NAMED record.

### G26-5 — No `.finished` completion front-door · **SHIP-in-G**

- **Where (verified):** `grep -nE "get finished|finished:" src/animation/engine.ts src/animation/group.ts` → zero public getter. kf exposes completion ONLY via the awaited `play()` return promise (the `wa.finished` references at `engine.ts:893`, `waapi.ts:374` are internal WAAPI plumbing, not a public surface). `Sequence` exposes `play(): Promise<void>` (`sequence.ts:335`) — same pattern.
- **2026 SOTA:** Motion, GSAP (`.then`), and WAAPI all expose a `.finished` promise / completion handle as the idiomatic "await this animation" front-door. A consumer who holds an already-playing `Animation` and wants to await its completion has no clean getter — they must have captured the `play()` return.
- **The transposition (small, additive):** `get finished(): Promise<void>` on `Animation`/`CSSKeyframesAnimation`/`AnimationGroup`/`Sequence`, returning the in-flight play promise (or an immediately-resolved one when settled). Pure surface — it exposes the promise the engine already holds; no new lifecycle.
- **Disposition:** **SHIP-in-G** (F BOOKed this as NEW-10; it is small enough and idiomatic enough to land). The smallest honest ergonomic gap vs the genre baseline.
- **Falsifiable instrument:** `proof:finished` — `anim.play(); await anim.finished;` resolves exactly once at end (and a pre-resolved `.finished` on an already-settled animation); a negative control: `.finished` on a never-played animation does not resolve prematurely. Co-locate with the existing playback lifecycle tests.
- **Isomorphism:** additive getter; existing `play()`-await semantics unchanged.

### G26-6 — Reactive motion-value graph (Motion `useFollowValue`/`followValue`) · **RECORD (out of engine scope; binding-layer)**

- **Where:** `SpringProgress.subscribe` (`spring.ts:116`) + `Draggable.subscribe` (`drag.ts:23`) give the *push* half of a reactive value. There is no value-derives-from-value graph.
- **2026 SOTA:** Motion 12.35 (Mar 2026) added `useFollowValue`/`followValue` — `useSpring`-style motion values that follow any source through any transition [motion.dev/changelog]. It is Motion's framework-binding ergonomic (React/Vue reactivity).
- **Why RECORD (unchanged from F26-6):** kf is deliberately framework-AGNOSTIC; a reactive value-graph is a binding-layer concern (Vue `ref`/`computed`, React `useState`), and the demo already does this idiomatically (`useOrbitalInertia`/`useSpringDemo` bridge `subscribe`/reads into Vue reactivity via the documented `markRaw` + rAF-poll). Shipping a `useFollowValue` analogue in the engine would either pick a framework (anti-gestalt) or duplicate what `subscribe` + a 3-line composable already provides. The engine's job ends at `subscribe`.
- **Disposition:** **RECORD** — out of engine scope by design; the `subscribe`/reads surface is the right primitive and complete. (A tiny `useMotionValue` Vue composable would be the *demo's* idiomatic showcase, NOT an engine addition — a demo-lane note.)

### G26-7 — Rive's state-machine / GPU runtime is a DIFFERENT PRODUCT, not a kf gap · **RECORD (assessed, leave)**

- **2026 SOTA:** Rive ships state machines, blend states, mesh deformation, GPU-accelerated rendering — an *interactive-experience engine* for designer-authored `.riv` assets, GPU-rendered to canvas [rive.app; help.rive.app/runtimes/state-machines]. Theatre.js ships a visual timeline-scrubbing editor for designer-authored sequences [theatrejs.com]. The 2026 framing (Lottie vs Rive vs CSS): "Rive for interactive stateful animations, Lottie for designer-created, CSS for UI transitions" [pkgpulse.com 2026].
- **Why RECORD (not a gap):** kf's lane is **CSS `@keyframes` text → runtime animation of any JS object/DOM element** — the LEAD no other library has (the competitive map's top row). Rive's value is a GPU canvas runtime for a binary asset format authored in a proprietary editor; Theatre.js's is a visual scrubbing editor. Neither is a capability the kf engine "lacks" — they are different products at a different layer. Adopting either's model (a GPU canvas runtime, a binary asset format, a visual editor-as-runtime) would abandon kf's CSS-text differentiator and its zero-asset, framework-agnostic, value.js-boundary gestalt. The §Mandate forbids manufacturing a deficit; this is not one.
- **Disposition:** **RECORD** — assessed and rejected as a non-gap. Note for the record so a future lane does not raise "kf lacks a state machine / GPU runtime" as an unexamined deficit. (The orchestration tier — `Sequence`/`stagger`/`flip`/`AnimationGroup` layer blending — is kf's idiomatic answer to "compose and transition between animations," at the right layer for a CSS-keyframes engine.)

---

## ALREADY-SOTA after F — manufacture NO work here (the bulk, binding per §Mandate)

Re-verified live on `tranche-g-dev`; extends `F/F.md § ALREADY-SOTA` (lines 653-697). Do
NOT re-touch:

- **A-G1 — The spring/decay/drag analytics are at the 2026 frontier.** `SpringProgress`
  (`spring.ts:149`) is a closed-form 2nd-order ODE with live re-seat and the
  `{visualDuration, bounce}` surface (`spring.ts:79-90`: `response = visualDuration`,
  `dampingFraction = 1 − bounce` — the documented Motion mapping). The spring SOTA survey
  confirms the genre baseline is *numeric* integration (Motion/GSAP/anime/Android/SwiftUI all
  step a damped harmonic oscillator); kf's **analytic closed form with no frame-rate drift**
  LEADS [the spring-physics survey: "x(t) = closed-form damped oscillator"; Motion/Android use
  numeric stepping]. `decay`/`decayRest` (`decay.ts:59,94`) is the analytic frictional form;
  `Draggable` (`drag.ts:87`) is windowed-velocity + C¹ fling. LEAVE.
- **A-G2 — The Sequence transport is now COMPLETE (F.W9 closed F26-2).** `sequence.ts` ships
  `pause`/`resume` (`:519,536`), `reverse` (`:576`), `timeScale` (`:556`), `progress`
  getter/setter (`:186,190`), `repeat` (`:587`), `yoyo` (`:602`) — all as scalar-field
  arithmetic over the existing `seek`, with the seek↔play C⁰-continuity parity gate
  (`sequence.ts:267-271,427-432`). This MATCHES the GSAP Timeline gold standard it named. The
  F26-2 gap is CLOSED. LEAVE.
- **A-G3 — CSS-native MotionPath (F.W12 closed F26-1a).** `motion-path.ts` sweeps
  `offset-distance` over an author `offset-path` the browser resolves; WAAPI-eligible via the
  surgical `offset-distance` `%`-exemption (`motion-path.ts:24-25`, `waapi.ts:50-53`),
  compositor-thread, zero value.js dep. MATCHES Motion `offsetPath`/GSAP MotionPath/anime
  `createMotionPath` for the CSS-native case. LEAVE.
- **A-G4 — The WAAPI harness + the native ScrollTimeline/ViewTimeline bridge.** The
  easing-faithfulness gate (`waapi.ts:151-160`: delegate ONLY when the curve has a faithful
  CSS twin — the bespoke-callable rejection is correct-by-reasoning), commit-on-finish,
  the feature-detected native `ScrollTimeline`/`ViewTimeline` attachment (`timeline.ts:251`)
  with the JS sampler retained as the general fallback. **The platform validates the
  ARCH-kill K-1:** ScrollTimeline/ViewTimeline are STILL not Baseline (Chrome/Edge only;
  Safari/Firefox absent — re-confirmed June 2026 [MDN scroll-driven-animations: "not Baseline";
  caniuse animation-timeline]). The JS-sampler kill HOLDS and is *demonstrated* by the dual
  surface. LEAVE (the platform-correct posture).
- **A-G5 — The orchestration tier (E.W10) + its dogfood (F.W10) + gate (F.W3).**
  stagger/flip/drag/decay/Sequence/animate, value.js-free on the LIGHT boundary; F.W10
  swapped `useOrbitalInertia` off the hand-rolled `Math.pow` decay onto the engine's
  `decay()` (F26-3 closed); `proof:orchestration` locks the behaviour. LEAVE.
- **A-G6 — The interpolation core + boundary.** `NumericAnimation`'s zero-alloc SoA leads
  Motion (stateless fn over numbers) + GSAP (AoS PropTween) [`r-interpolation-carrier F-5`];
  in-place `value.value` mutation, serialize-only-at-write-boundary; the whole heavy surface
  reached through the single `lerpValue → iv._lerp` seam (`engine.ts:629`) so value.js lands
  Wave B/C/D with ZERO kf edits. LEAVE.
- **A-G7 — The demo's directional-VT / scroll-driven story (F.W13/W16).** The modern-web
  corpus confirms directional View Transitions (`:active-view-transition-type()` + `types`
  array) is the platform idiom; F.W13 BOOKed the typed-scene-VT behind the glass-ui `types`
  helper (H-1) and shipped the `text-wrap: pretty` sliver. The demo VT story is at the
  frontier for the demo lane (out of this engine-SOTA lane's scope; cross-ref
  `a-glass-ui.md` for the H-1 helper). LEAVE.

The honest record: **F left the engine substantially SOTA.** The §ALREADY-SOTA bulk is
larger post-F than pre-F (F closed three of the six pre-F gaps and the spring/Sequence/
MotionPath tiers are now exemplary). G manufactures NO work here.

---

## value.js / cross-repo HAND-OFFs (inv-16 relaxed for G impl — still AUDIT each surface)

- **VJ-F1 — SVG/path-geometry sampler (re-affirmed, NOT shipped in 0.11.0).** Path-`d` parse
  → typed segment AST → length-parametrized sampler + point-count-reconciling `d`-lerp
  (the anime.js `morphTo(path, precision)` model). value.js 0.11.0 shipped Wave-B/C
  color+computed wins but NOT this geometry wave (`value.js/src/` has no geometry module —
  verified). It unblocks G26-1a (MorphSVG) + G26-1c (numeric MotionPath). The natural home is
  beside `value.js/src/transform/decompose.ts` (the existing geometry surface). **HAND-OFF:
  carry VJ-F1 forward UNCHANGED into the G value.js charter.** (G26-2 DrawSVG needs NONE of
  this — it ships engine-side in G.)
- **E7 — `calc-size()` parser (re-affirmed, NOT shipped in 0.11.0).** Gates the native
  intrinsic-size delegation (G26-4); `grep -rniE "calc-size" value.js/src/` → zero. Carry
  forward; the kf-side JS-measure fallback does NOT depend on it (the portable path ships
  independently if/when G26-4 is promoted).
- No NEW value.js item this lane originates — the animation-SOTA frontier's remaining gaps are
  either kf-engine-local (DrawSVG, `.finished`) or already-charter'd (VJ-F1, E7).

---

## Priority recommendation for Tranche G (this lane's view)

1. **G26-2 — DrawSVG (CSS-native sliver)** — **SHIP-in-G.** The one real engine-side close of
   the post-F frontier: a `fromDrawSVG` factory mirroring `motion-path.ts`, one
   `getTotalLength()` read, WAAPI-eligible, zero value.js dep. Gate: `proof:drawsvg`.
2. **G26-5 — `.finished` completion getter** — **SHIP-in-G.** Smallest honest ergonomic gap;
   additive getter over the held play promise. Gate: `proof:finished`.
3. **G26-1 — MorphSVG + numeric MotionPath** — **BOOK + value.js-HANDOFF (VJ-F1).** Blocked
   on the value.js geometry sampler value.js 0.11.0 did not ship.
4. **G26-3 — `splitText` (Intl.Segmenter)** — **BOOK.** Completes the stagger story; net-new
   DOM surface deserving a design pass. (Demo grapheme-fix already discharged in F.W16.)
5. **G26-4 — intrinsic-size (`height:auto`)** — **BOOK + value.js-HANDOFF (E7) + RECORD
   don't-adopt-native-until-Baseline.** Own wave; JS-measure fallback is the portable path.
6. **G26-6 reactive value-graph — RECORD** (binding-layer, out of engine scope).
   **G26-7 Rive/Theatre.js — RECORD** (different product; CSS-text LEAD forbids adopting it).

Every SHIP item is additive and isomorphism-safe. The spring/decay/drag analytics, the
complete Sequence transport, the CSS-native MotionPath, the WAAPI harness + native-scroll
bridge, the orchestration tier, the interpolation core, and the value.js boundary are
genuinely SOTA and must be left alone. **G's net-new engine surface is NARROW** — the DrawSVG
sliver and the `.finished` getter — with the rest BOOK (value.js-blocked) or RECORD.

---

## Diff vs the pre-F baseline (`r-anim-libs-2026`) — explicit

| Pre-F finding | Pre-F disposition | POST-F status (verified) |
|---|---|---|
| F26-1a MotionPath (CSS-native) | SHIP-in-F | **LANDED** `motion-path.ts` (F.W12) — ALREADY-SOTA (A-G3) |
| F26-1b MorphSVG | BOOK + VJ-F1 | **STILL BOOK** — VJ-F1 not shipped in vj 0.11.0 → **G26-1a** |
| F26-1c DrawSVG | BOOK (beside 1b) | **RE-SPLIT → SHIP-in-G** (CSS-native sliver, no geometry dep) → **G26-2** |
| F26-2 Sequence transport | SHIP-in-F | **LANDED** `sequence.ts` (F.W9) — ALREADY-SOTA (A-G2) |
| F26-3 orchestration dogfood | SHIP-in-F | **LANDED** `useOrbitalInertia`→`decay()` (F.W10) — ALREADY-SOTA (A-G5) |
| F26-4 SplitText / demo grapheme | BOOK + demo-fix | **demo-fix DISCHARGED** (F.W16 word-split); engine primitive **STILL BOOK** → **G26-3** |
| F26-5 per-property easing | KILL | **re-affirmed KILL** (CSS-`@keyframes` per-frame fidelity is the LEAD) |
| F26-6 reactive value-graph | RECORD | **re-affirmed RECORD** (Motion `useFollowValue` is binding-layer) → **G26-6** |
| (NEW-10) `.finished` getter | BOOK | **did not land → SHIP-in-G** → **G26-5** |
| (NEW-37) intrinsic-size | GAP-NAMED + E7 | **STILL BOOK** — E7 + native both not Baseline → **G26-4** |
| **NEW (G frontier)** | — | **G26-7** Rive/Theatre.js state-machine/GPU → RECORD (different product) |

---

## Sources (2026 SOTA grounding)

- Motion — [motion.dev/changelog](https://motion.dev/changelog) (v12.35, Mar 2026:
  ViewTimeline in useScroll, `trackContentSize`, `useFollowValue`/`followValue`),
  [motion.dev/docs/scroll](https://motion.dev/docs/scroll).
- GSAP 3.13 — [css-tricks.com/gsap-is-now-completely-free](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/),
  [gsap.com/svg](https://gsap.com/svg/) (MorphSVG/DrawSVG/MotionPath/SplitText 100% free,
  Webflow), [gsap.com MorphSVGPlugin](https://gsap.com/docs/v3/Plugins/MorphSVGPlugin/).
- anime.js v4 — [github.com/juliangarnier/anime v4.0.0](https://github.com/juliangarnier/anime/releases/tag/v4.0.0),
  [wiki: What's new in V4](https://github.com/juliangarnier/anime/wiki/What's-new-in-Anime.js-V4)
  (`morphTo`/`createMotionPath`/`createDrawable`, `splitText`, `createTimeline`, stagger-as-position).
- Rive — [rive.app](https://rive.app/), [help.rive.app/runtimes/state-machines](https://help.rive.app/runtimes/state-machines);
  [pkgpulse.com Lottie-vs-Rive-vs-CSS 2026](https://www.pkgpulse.com/guides/lottie-vs-rive-vs-css-animations-web-animation-formats-2026).
- Theatre.js — [theatrejs.com](https://www.theatrejs.com/).
- Spring/physics SOTA — [Motion spring guide](https://www.mintlify.com/motiondivision/motion/guides/spring-animations)
  (`visualDuration`/`bounce`), [Android spring-animation](https://developer.android.com/develop/ui/views/animations/spring-animation)
  (numeric mass/stiffness/damping), [SwiftUI spring 2026 manifesto](https://medium.com/@amosgyamfi/the-meaning-maths-and-physics-of-swiftui-spring-animation-amos-gyamfis-manifesto-0044755da208)
  (closed-form damped oscillator).
- Platform — [MDN scroll-driven-animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
  ("not Baseline" — Chrome/Edge only, June 2026), [caniuse animation-timeline scroll()](https://caniuse.com/mdn-css_properties_animation-timeline_scroll);
  modern-web-guidance corpus — `directional-navigation-transitions` (`:active-view-transition-type()` + `types`),
  `dynamic-sibling-animations` (`sibling-index()`), `scroll-entry-exit-effects`, `Intl.Segmenter` (Baseline 2024).
