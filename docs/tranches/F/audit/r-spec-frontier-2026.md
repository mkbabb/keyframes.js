# Tranche F · SOTA audit — the W3C/CSS/WHATWG spec frontier (2026)

**Lane id:** `r-spec-frontier-2026`. **Branch at audit:** `tranche-e-impl` (D+E
IMPLEMENTED + CLOSED). **Scope:** the spec frontier *not* covered by the sibling
F lanes — **CSS Houdini** (Animation Worklet, Paint/Layout worklets, **Typed OM**,
the Properties & Values API beyond `@property` registration), **Web Animations
Level 2** (group/sequence effects, custom-effect `onupdate`, animation triggers,
per-effect playback rate), and the **Anchor Positioning + Popover + Invoker
Commands** overlay surface. The honest *"what is Baseline-now vs what is coming"*
adoption map, each finding with a feature-detect note.

**Mandate:** research/audit ONLY — ZERO source changes; this doc is the only
artefact. **inv-16:** keyframes.js findings disposition-tagged; value.js needs →
`value.js-HANDOFF` (propose, never write); the demo's overlay substrate is
**glass-ui-owned** (MEMORY `feedback_glass_ui_root_changes` — never patch glass-ui
in the demo) → `glass-ui-HANDOFF`. **inv ε:** every keyframes claim cites
`file:line`; every Baseline date is grounded (modern-web-guidance retrieval +
MDN/caniuse/W3C, cited §9).

**Disposition legend:** SHIP-in-F · MEASURE-FIRST · BOOK · KILL · RECORD ·
value.js-HANDOFF · glass-ui-HANDOFF · ALREADY-SOTA.

---

## 0. The diff — what the sibling lanes already own, so this lane does NOT re-derive

This lane's scope abuts three siblings; the boundary is drawn explicitly so no
body is duplicated.

| Already covered (do not re-litigate) | Owning doc |
|---|---|
| `@property` parse → `CSS.registerProperty()` **(LANDED E.W9)** | E `d-modern-platform.md` D-LIB-1; F `r-waapi-platform-2026.md` §5 |
| Native `ScrollTimeline`/`ViewTimeline` WAAPI bridge **(LANDED E.W9)** | E `d-modern-platform.md` D-LIB-2; F `r-waapi-platform-2026.md` §0/§5 |
| `@starting-style` / `transition-behavior: allow-discrete` (correct-to-omit in engine; LANDED in a demo scene E.W11) | F `r-waapi-platform-2026.md` §2; F `r-modern-web-2026.md` §0 |
| `interpolate-size` / `calc-size()` intrinsic-size animation | E `r-css-values.md` §5; F `r-waapi-platform-2026.md` §3 |
| `linear()` easing round-trip, L4 math, container units | E `r-css-values.md` §1–§7 |
| View-Transition **types** API (`{update,types}`) for the demo scene-nav | F `r-scroll-vt-2026.md` H-1/B-1 |
| Scroll-driven CSS (`animation-timeline:scroll()/view()`) engine ARCH-kill | E `r-scroll-view-transitions.md` S-1; F `r-modern-web-2026.md` §0 |

**This lane's genuinely-net-NEW contribution** is the spec surface *none* of those
reached:

1. **CSS Typed OM is Baseline** (Chrome 66+/Safari 16.4+/Edge 79+ — only Firefox
   absent, ~92% global) **and the engine's per-frame style write is a stringly-
   typed `setProperty` that the browser re-parses every frame** — the canonical
   Typed OM adoption site, with a real measure-first perf rationale (§2). This is
   the lane's headline and the only finding with a SHIP-class disposition.
2. **Houdini Animation Worklet / Paint / Layout worklets are NOT Baseline and
   never became cross-engine** (Chromium-only, MVP perpetually "in development") —
   the honest negative result: do not build for them (§3).
3. **Web Animations Level 2's group/sequence/custom-effect surface** is the spec
   the engine's own `AnimationGroup` (E.W10) and `Timeline` family are the JS
   analogues of — a clean map + one `composite`-ordering correctness nuance, all
   BOOK/RECORD (§4).
4. **Anchor Positioning crossed into Baseline 2026** and **Popover (2025-01-27) +
   Invoker Commands (2025-12-12)** are newly cross-engine — but the demo's
   overlays (`Popover`/`DropdownMenu`/`HoverCard`) are **glass-ui/reka-ui-owned**,
   so this is a `glass-ui-HANDOFF` map, not a demo patch (§5).

ALREADY-SOTA, stated plainly so the tranche manufactures no work: §6.

---

## 1. Baseline ground truth (2026) — every disposition rides these

Dated at retrieval; sources §9.

- **CSS Typed OM** (`Element.attributeStyleMap`, `computedStyleMap()`,
  `CSSStyleValue`/`CSSUnitValue`/`CSSKeywordValue`/`CSSTransformValue`, the
  `CSS.px()`/`CSS.deg()` numeric factories) — **Baseline / widely deployed:
  Chrome 66+ (2018), Edge 79+, Safari 16.4+ (Mar 2023), Opera 53+, Samsung 9.2+;
  ~92.23% global usage. UNSUPPORTED in Firefox (all versions through 154).**
  Feature-detect: `"attributeStyleMap" in Element.prototype` (or
  `"computedStyleMap" in Element.prototype`). (caniuse `wf-css-typed-om`; MDN
  CSS Typed OM.)
- **Houdini Animation Worklet** (`CSS.animationWorklet`, `registerAnimator`,
  `WorkletAnimation`) — **NOT Baseline. Chromium-only, behind a flag / origin-
  trial-class; "MVP in development"; unsupported in Firefox & Safari, and they
  have signalled no intent.** (W3C `css-animation-worklet-1` WD; Chrome Platform
  Status 5762982487261184; MDN Houdini APIs.)
- **Houdini Paint Worklet** (`CSS.paintWorklet`, `registerPaint`) — limited;
  Chrome/Edge only, no FF/Safari. **Layout Worklet** — Chromium-only, even less
  shipped. Both non-Baseline.
- **Web Animations L2** — `KeyframeEffect.composite` ("replace"/"add"/
  "accumulate") + `animation-composition` CSS: **Baseline widely available.**
  Group/Sequence Effects, custom-effect `onupdate`, animation triggers
  (`animation-trigger`/`timeline-trigger`), per-effect playback rate,
  non-monotonic progress timelines: **WD / draft; `animation-trigger` is
  Chrome-only landing ~Chrome 145 (2026), no FF/Safari.** (W3C/drafts
  `web-animations-2`; MDN `animation-composition`; Chrome `scroll-triggered-
  animations` blog.)
- **CSS Anchor Positioning** (`anchor-name`, `anchor()`, `position-anchor`,
  `position-area`, `@position-try`/`position-try-fallbacks`) — **Baseline 2026:
  Chrome 125+ (2024), Safari 26 / 18.4 (`@position-try` needs 18.4), Firefox 147
  (stable 2026-01-13) — now cross-engine.** The **anchor-position *container
  queries*** subfeature (`@supports (container-type: anchored)`) remains
  **limited — Chrome/Edge 143 (Dec 2025) only, no FF/Safari.** Feature-detect the
  base: `CSS.supports("anchor-name: --x")` or `@supports (position-anchor: auto)`.
- **Popover API** (`popover` attribute, `showPopover()`/`togglePopover()`,
  `::backdrop`, top-layer) — **Baseline newly available 2025-01-27** (Chrome 116,
  Edge 116, Firefox 125, Safari 17 / iOS 18.3). Feature-detect:
  `"popover" in HTMLElement.prototype`; polyfill `@oddbird/popover-polyfill`.
- **Invoker Commands** (`command` + `commandfor` button attributes:
  `toggle-popover`/`show-modal`/`close`…) — **Baseline newly available
  2025-12-12** (Chrome 135 Apr 2025, Edge 135, Firefox 144 Oct 2025, Safari 26.2
  Dec 2025). Brand-new — *post-dates the E digest.* Feature-detect:
  `"command" in HTMLButtonElement.prototype`.

---

## 2. HEADLINE — the engine's per-frame style write is stringly-typed `setProperty`; CSS **Typed OM is Baseline** and is the SOTA write substrate · MEASURE-FIRST (→ SHIP-in-F if the bench bites)

**The claim, grounded in code.** The rAF hot loop writes computed values to the
DOM as **strings the browser must re-parse on every frame**:

- The per-tick driver: `engine.ts:747` calls `this.interpFrames(t, true,
  this._interpOut)` each rAF frame; `apply=true` invokes the transform callback.
- The default transform is `_defaultTransform` (`engine.ts:170-171`) →
  `transformTargetsStyle(vars, this.targets)` (`utils.ts:363`).
- Inside, every frame: `unflattenObjectToString(vars)` (`utils.ts:370`, a
  **value.js string serialization** of the interpolated `ValueUnit`s) → then
  `target.style.setProperty(key, value)` (`utils.ts:374`) — a **string** the CSS
  parser must tokenize back into typed values inside the engine.
- The morph/flip leaves do the same: `morph.ts:100,113` and `flip.ts:83-95` write
  `element.style.transform = <template-string>` (e.g.
  `` `translate(${x}px, ${y}px) scale(${sx}, ${sy})` `` ).
- Grep confirms **zero** Typed OM anywhere in `src/`:
  `grep -rn --include='*.ts' "attributeStyleMap\|CSSStyleValue\|CSSUnitValue\|
  computedStyleMap\|CSSKeywordValue" src/` → **0 hits** (verified).

So the engine, every frame, takes already-typed numeric `ValueUnit`s, **serializes
them to a string** (`unflattenObjectToString`), hands the string to
`setProperty`, and the browser **re-parses the string back into typed values**.
That is a round-trip — typed → string → typed — on the single hottest path in the
library, for a value the engine already holds in typed form.

**The SOTA substrate.** CSS Typed OM exists precisely to delete this round-trip:
`el.attributeStyleMap.set("transform", new CSSTransformValue([...]))` (or
`el.attributeStyleMap.set("opacity", CSS.number(v))`, `set("width", CSS.px(v))`)
writes a **typed object** the engine consumes without the CSS parser — Chrome's
own guidance frames it as *"eliminating the CSS parser altogether"* for the
write path (developer.chrome.com `css-ui/cssom`). For a keyframe engine whose
output is a stream of typed numerics on a per-frame budget, this is the textbook
Typed OM use case.

**Why this is NET-NEW and not a sibling-lane repeat.** No E or F doc examined the
*style-write substrate*. The sibling WAAPI lane covers the *compositor-delegated*
path (`waapi.ts`); this is the **rAF main-thread write path** that runs for every
animation the WAAPI gate rejects (computed units, color lerp, custom transforms —
the common case for this engine). The prior tranches' assumption that Typed OM is
a fringe Houdini feature is **wrong as of 2026**: caniuse classifies it Baseline
at ~92% global; only Firefox lacks it — exactly the shape that warrants a
feature-detected fast lane with the existing `setProperty` write as the verbatim
fallback.

**Why MEASURE-FIRST (the §Mandate forbids asserting an unmeasured win), with a
SHIP-in-F upgrade path.** The perf win is *plausible and well-documented* but
**must be measured on this engine before it ships** — three honest caveats the
benchmark must resolve:

1. **The win is per-write parse-avoidance, but the engine also pays
   `unflattenObjectToString` to BUILD the string.** A faithful Typed OM lane would
   build `CSSStyleValue`s directly from the interpolated `ValueUnit`s and skip
   *both* the string-build and the re-parse — so the bench must compare
   `interp → unflatten-to-string → setProperty(string)` against `interp →
   build-CSSStyleValue → attributeStyleMap.set(typed)`, not just the write call in
   isolation. The current `bench/interpolation.bench.ts` harness is the right home.
2. **`CSSTransformValue` construction has its own allocation cost** — a per-frame
   `new CSSTransformValue([...])` could regress the engine's zero-alloc posture
   (the standalone hot path is buffer-hoisted, `engine.ts:153` `_interpOut`,
   `proof:standalone-zero-alloc`). A Typed OM lane must preserve that — reuse a
   hoisted `CSSStyleValue` builder or it trades a parse win for an alloc loss. The
   bench must report allocations, not just throughput.
3. **`transform` specifically** is the high-value target (it is the most
   re-parsed property and the morph/flip leaves write it as a template string),
   but `CSSTransformValue` requires the component list
   (`CSSTranslate`/`CSSScale`/`CSSRotate`) — value.js already holds the transform
   as structured `FunctionValue`s, so the builder is a clean map from a shape the
   engine already has. This is where the win is most likely real.

**The shape of the fold (if the bench bites).** A feature-detected branch in
`transformTargetsStyle` (`utils.ts:363`): if `"attributeStyleMap" in target`,
build typed values and `attributeStyleMap.set(key, typedValue)`; else the current
`setProperty(key, string)` path verbatim. Firefox (no Typed OM) and SSR/jsdom take
the string fallback unchanged — strict progressive enhancement, byte-identical
output. The `_defaultTransform` reference-identity contract (`engine.ts:175`
`usesDefaultRenderer`) is preserved (one transform fn, branch inside it).

**Disposition — MEASURE-FIRST** (author the `interpolation.bench.ts` A/B:
string-`setProperty` vs typed-`attributeStyleMap`, reporting throughput **and**
allocations, on `transform`/`opacity`/`width`; **SHIP-in-F** the feature-detected
fast lane *iff* the bench shows a non-trivial win with zero-alloc preserved).
**The highest-leverage net-NEW finding in the lane.**

**Isomorphism note.** Strictly additive PE — the typed write produces the same
computed style as the string write (the browser parses the string to the same
typed value the Typed OM path sets directly); an equivalence test asserts
identical `getComputedStyle` output across both branches. Firefox path unchanged.

**value.js touchpoint (inv-16).** value.js owns `unflattenObjectToString` and the
`ValueUnit`/`FunctionValue` shapes the builder maps from. If the cleanest Typed OM
builder wants a value.js helper (`ValueUnit → CSSUnitValue`, `FunctionValue →
CSSTransformComponent`), that is a **value.js-HANDOFF** — but the keyframes-side
lane can build the typed values locally from the already-exposed `ValueUnit` API
without a value.js change, so this is FOLD-E-shaped, not handoff-blocked. Flag the
helper as an *optional* value.js convenience, not a precondition.

---

## 3. Houdini Animation Worklet / Paint / Layout — NOT Baseline, never cross-engine · RECORD (honest negative result) + KILL

**The claim.** The engine has **zero** Houdini-worklet surface
(`grep -rni "animationworklet\|registerAnimator\|WorkletAnimation\|paintWorklet\|
registerPaint\|layoutWorklet" src/ demo/` → 0 hits outside `dist/` build
artefacts and the `engine.ts:1115-1147` `registerProperty` block, which is
Properties-&-Values, not a worklet). **This absence is correct and must stay.**

**The reasoning (the honest negative result this lane owes).** Animation Worklet
was the Houdini promise of a *worklet-thread* (off-main, off-compositor) animation
callback — `registerAnimator` + `WorkletAnimation` driving a `animate(currentTime,
effect)` on a dedicated thread, with scroll/time timelines. It is the closest
spec to *"what if keyframes.js's tick ran off the main thread."* **But it never
shipped cross-engine.** As of 2026 it is **Chromium-only, behind a flag / origin-
trial-class, MVP "in development,"** and Firefox & Safari have signalled no intent
(W3C WD `css-animation-worklet-1`; Chrome Platform Status; MDN Houdini APIs). The
modern-web-guidance corpus — the Baseline-adoption authority — **has no Animation
Worklet, Paint Worklet, or Layout Worklet guide at all** (searched
`"houdini paint worklet"`, `"animation worklet"` — 0 worklet guides returned).
That is the corpus saying *"this is not on the adoption frontier."*

For a library whose whole boundary discipline is "feature-detect, keep the JS
path as the verbatim fallback," a Chromium-flag-gated worklet is **all fallback
and no Baseline** — the cost (a worklet module, a separate build target, the
serialization boundary to the worklet thread) is paid for a path no Baseline user
reaches. The engine's main-thread rAF + WAAPI-compositor split is the *correct*
2026 threading model; the worklet thread the spec promised did not arrive. The
relevant off-main-thread win that DID arrive — compositor-resident animations via
WAAPI + native ScrollTimeline — the engine **already has** (E.W9, ALREADY-SOTA per
`r-waapi-platform-2026.md` §5).

**Paint / Layout worklets** are even more clearly out of scope: they are
*rendering* extensions (custom `paint()` backgrounds, custom layout algorithms),
not animation; Chromium-only; and the demo's visual effects are author CSS +
glass-ui idioms, not custom paint. No engine or demo surface wants them.

**Disposition.**
- Engine Animation Worklet: **KILL** (re-affirmed permanently — like the
  scroll-driven CSS engine ARCH-kill, the JS sampler is the more-general,
  cross-engine primitive; the worklet path is non-Baseline and adds a build/serial
  boundary for zero Baseline reach).
- Paint/Layout worklets: **RECORD / out-of-scope** (rendering extensions, not
  animation; Chromium-only; no surface wants them).
- Re-open trigger: *iff* Firefox **and** Safari both ship Animation Worklet to
  stable (no signal of this as of 2026), re-measure an off-main-thread JS-tick
  delegation lane. Until then, building for it violates the no-speculative-
  machinery precept.

**Isomorphism note.** N/A — nothing built; this finding *prevents* a non-Baseline
build and documents *why* the engine's worklet silence is correct SOTA.

---

## 4. Web Animations Level 2 — the engine's `AnimationGroup`/`Timeline` are the JS analogues; the spec is the map, not a gap · BOOK + one RECORD

**The frame.** WA2 (W3C/drafts `web-animations-2`) adds, beyond L1: **Group
Effects** (nest effects in a tree, run as a unit), **Sequence Effects**
(auto-sequenced start times), **custom effects** (an `onupdate` callback receiving
iteration progress — augment an existing effect with a function), **per-effect
playback rate** (distinct from animation-level), **non-monotonic progress
timelines** (scroll-based), and **animation triggers** (`animation-trigger` /
`timeline-trigger` — declarative play-on-scroll-crossing). The striking thing for
this codebase: **the engine already ships the JS analogues of the first four.**

- **Group / Sequence Effects** ↔ `AnimationGroup` (`group.ts`, E.W10) — a
  multi-animation compositor with layer blending (`replace`/`add`/`weighted`,
  `group.ts:248-268`), batched ticking with `scheduler.yield` INP relief, and a
  managed-child lifecycle. This **is** a Group Effect, in JS, *more general than
  WA2's* (WA2 group effects compose keyframe effects; `AnimationGroup` composes
  arbitrary engine animations over arbitrary objects). The `weighted` blend and
  the cross-object reach have no WA2 equivalent.
- **Custom effect `onupdate`** ↔ the engine's `TransformFunction<V>` /
  `_defaultTransform` seam (`engine.ts:170`) — a per-tick callback receiving the
  interpolated vars **is** a custom effect, and the engine's is value.js-typed and
  cross-object, where WA2's `onupdate` only augments a native effect.
- **Non-monotonic progress timelines** ↔ the `Timeline`/`ScrollTimeline`/
  `ManualTimeline` family (`timeline.ts`) — the `sample()→clamp→easing→snap→
  smoothing→progress` pipeline (per `CLAUDE.md`) is a progress timeline, and E.W9
  already bridged it to the *native* `ScrollTimeline` where WAAPI-eligible
  (`timeline.ts:207-260`).

So WA2's group/effect tier is **not a gap** — the engine leads it for its domain
(cross-object, weighted, value.js-typed). The honest disposition is RECORD this
parity (so a future tranche doesn't "discover" WA2 group effects and re-build what
`AnimationGroup` already is) + BOOK the two genuinely-new WA2 primitives the
engine does *not* have:

**B-1 · `KeyframeEffect.composite` ordering on the WAAPI path — the carried W6
nuance, re-framed as WA2.** `composite:"add"`/`"accumulate"` is **Baseline widely
available**, but the engine's `AnimationGroup` `add` blend sums numeric values in
JS (`group.ts:248-268`) and `toWAAPIOptions` never sets `composite`
(`waapi.ts` — confirmed by `r-waapi-platform-2026.md` P2). The **WA2-grounded
correctness nuance** (sharpening the sibling lane): native `composite:"add"`
composes **transform lists by concatenation** (matrix composition), whereas the JS
`add` blend does **scalar component summation** — they agree only on
single-component-per-key layers. This is the *same* gate `r-waapi-platform-2026.md`
P2 named; this lane adds the spec citation (WA2 §"iteration composite operations":
discrete vs accumulate). **BOOK** — defer to the sibling lane's P2; do not
duplicate the disposition.

**B-2 · Animation triggers (`animation-trigger`) — declarative play-on-scroll —
NOT Baseline.** WA2 + the Scroll-Triggered-Animations explainer add
`animation-trigger`/`timeline-trigger`: play an animation when a scroll offset is
*crossed* (vs scroll-*scrubbed*) — the declarative IntersectionObserver-replacing
primitive. **Chrome-only, landing ~Chrome 145 (2026), no FF/Safari.** The engine's
`Timeline.sample()` + a play-gate is the JS analogue and the correct fallback. Not
Baseline → not actionable in F. **BOOK** (re-open when cross-engine; the engine's
sampler is the more-general fallback, mirroring the scroll-driven ARCH-kill).

**Disposition.**
- Group/Sequence/custom-effect parity: **RECORD / ALREADY-SOTA** — the engine
  leads WA2 for its domain; do not re-build.
- `composite` ordering: **BOOK** — defer to `r-waapi-platform-2026.md` P2 (this
  lane adds only the WA2 spec citation + the concat-vs-sum gate framing).
- `animation-trigger`: **BOOK** — not Baseline; the `Timeline` sampler is the
  cross-engine fallback.

**Isomorphism note.** N/A — nothing built; RECORD parity, BOOK the non-Baseline
primitives.

---

## 5. Anchor Positioning (Baseline 2026) + Popover (2025-01-27) + Invoker Commands (2025-12-12) — the overlay frontier is glass-ui-owned · glass-ui-HANDOFF + demo BOOK

**The claim, grounded.** The demo's overlays — the share popover, the dock menu,
the cube info card — are built on **glass-ui / reka-ui** primitives, not native
platform overlays:

- `SharePopover.vue:2-14` uses `<Popover>`/`<PopoverTrigger>`/`<PopoverContent>`
  from `@mkbabb/glass-ui` (`:51-52`); positioned via reka-ui's `align`/
  `:side-offset` props (`:14`) — i.e. **JS positioning (Floating UI), not CSS
  anchor positioning**.
- `App.vue:152` imports `DropdownMenu`/`DropdownMenuContent`/… from
  `@mkbabb/glass-ui`; `App.vue:22` positions via `align`/`:side-offset`.
- `CubeScene.vue:26-28,106-114` uses `HoverCard`/`HoverCardContent` from
  `@mkbabb/glass-ui`.
- `package.json:79` pins `@mkbabb/glass-ui` (`file:../glass-ui`), `:107`
  `reka-ui ^2.9.9`. reka-ui positions overlays with **Floating UI (JS)**, not the
  now-Baseline CSS Anchor Positioning, and renders them as portalled `<div>`s, not
  native `[popover]` top-layer elements.

**The 2026 frontier.** Three overlay-surface features crossed Baseline *after* the
demo's overlay substrate was built:

1. **CSS Anchor Positioning** went **cross-engine Baseline 2026** (Firefox 147,
   2026-01-13 closed the last engine). `anchor-name` + `position-anchor` +
   `@position-try` flip-fallbacks let an overlay tether to its trigger and reflow
   off viewport edges **with zero JS** — the direct replacement for Floating UI's
   per-frame `getBoundingClientRect` + transform writes that reka-ui runs today.
2. **Popover API** (Baseline 2025-01-27): the `popover` attribute + top-layer +
   `::backdrop` + light-dismiss + focus management, natively — replacing reka-ui's
   portal + focus-trap + outside-click JS.
3. **Invoker Commands** (Baseline 2025-12-12 — brand-new, post-dates the E
   digest): `<button commandfor="x" command="toggle-popover">` toggles a popover
   with **no JS event listener at all** — declarative, natively accessible.

Together these are the SOTA "overlays without a JS positioning library" stack —
exactly what reka-ui/Floating UI exist to do, now native and Baseline.

**Why glass-ui-HANDOFF, not SHIP-in-F (the inv-16 line + MEMORY discipline).**
The demo's overlay substrate is **glass-ui's domain** — MEMORY
`feedback_glass_ui_root_changes`: *"all glass-ui/dock changes must go in glass-ui
repo, never patched in demo"*; `feedback_glass_ui_storage_colorpicker`: *"leverage
glass-ui idiomatically."* The demo *consumes* `<Popover>`; it must not hand-roll
native `[popover]` + `anchor-name` CSS in a demo component — that would fork the
substrate and violate the established boundary (the identical logic the sibling
`r-scroll-vt-2026.md` H-1 applied to `startViewTransition`). The correct
disposition is a **glass-ui-HANDOFF**: glass-ui's reka-ui overlay primitives
should adopt CSS Anchor Positioning (feature-detected, Floating-UI fallback) and
optionally the native Popover top-layer, *at the substrate*; the demo inherits the
upgrade for free. reka-ui upstream is itself moving this way — the ask is that
glass-ui track it.

**Where the engine touches this (the one keyframes-side seam) — `ElementMorph` as
an anchor-position twin · RECORD.** The engine's `ElementMorph` (`morph.ts`)
interpolates position/scale between two DOM rects via measured `getBoundingClient-
Rect` + transform writes — structurally the *same* "tether element A to element
B's box" problem CSS Anchor Positioning solves declaratively (cf. the modern-web
`anchor-positioning-tab-underline` guide: animate an underline between two tab
anchors). But `ElementMorph` is the *general, animated, cross-engine* primitive
(it interpolates a transition between rects over a curve; anchor positioning is a
*static* tether) — so this is **RECORD parity, not a gap**: `ElementMorph` is the
animation twin, anchor positioning is the static-layout twin; neither subsumes the
other, and `ElementMorph` is correctly engine-owned and Firefox-safe. Do not
"replace ElementMorph with anchor positioning" — they solve adjacent problems.

**Disposition.**
- Demo overlays: **glass-ui-HANDOFF** (glass-ui's reka-ui substrate adopts CSS
  Anchor Positioning + native Popover/Invoker Commands, feature-detected; the demo
  inherits it) + **demo BOOK** (consume once glass-ui ships it — no demo patch).
- `ElementMorph` ↔ anchor positioning: **RECORD / ALREADY-SOTA** — adjacent
  primitives; `ElementMorph` is the animated cross-engine twin, correctly engine-
  owned. No build.

**Isomorphism note.** N/A at the keyframes layer (no source change). The glass-ui
handoff, when taken, must be feature-detected PE (Floating-UI fallback for
Firefox-pre-147 / non-anchor engines) so overlay positions are pixel-stable.

---

## 6. ALREADY-SOTA across the spec frontier — manufacture no work

Stated plainly so Tranche F does not churn correct code:

- **`@property` registration (E.W9, `engine.ts:1125-1156`).** The parsed registry
  is `CSS.registerProperty()`'d, feature-detected (`typeof CSS.registerProperty
  !== "function"` guard, `:1126-1131`), `InvalidModificationError`-swallowed
  per-descriptor (`:1146-1154`), `syntax`-null-skipped (`:1137`). This is the
  Properties & Values API adopted *correctly* — the engine's full Houdini-PAV
  surface, and it is exemplary. **Leave it.** (Owned by E `d-modern-platform.md`
  D-LIB-1 / F `r-waapi-platform-2026.md` §5.)
- **WAAPI dense sub-segment sampling (`waapi.ts:188-231`).** The compositor
  keyframe emit densifies interior offsets so the piecewise-linear fill tracks the
  JS curve (`WAAPI_SUBSEGMENT_STOPS`, `:208-218`) — the SOTA fidelity discipline.
  **Leave it.**
- **Native ScrollTimeline/ViewTimeline bridge (E.W9, `timeline.ts:207-260`,
  `waapi.ts:366-429`).** Feature-detected (`globalThis.ScrollTimeline`/
  `ViewTimeline`), the JS sampler ARCH-kill holds as the cross-engine fallback.
  This is the *correct* off-main-thread animation adoption — the win Animation
  Worklet promised and never delivered, captured via the path that actually
  shipped. **Leave it.** (Owned by E `d-modern-platform.md` D-LIB-2.)
- **The `Timeline` family as a progress-timeline (WA2 non-monotonic) twin
  (`timeline.ts`).** Caller-driven, cross-object, more general than WA2's
  scroll-timeline. **Leave it.**
- **`AnimationGroup` as a Group/Sequence-Effect twin (`group.ts`, E.W10).**
  Cross-object, weighted-blend, INP-yielding — leads WA2 group effects for the
  engine's domain. **Leave it.**

---

## 7. Dispositions roll-up

| # | Finding | File:line / spec | Baseline | Disposition |
|---|---|---|---|---|
| **§2** | Per-frame style write is stringly-typed `setProperty` (typed→string→re-parse round-trip); **Typed OM is Baseline** and is the SOTA write substrate | `utils.ts:363-377`, `engine.ts:170-171,747`, `morph.ts:100-114`, `flip.ts:83-95`; caniuse `wf-css-typed-om` | Typed OM widely deployed (no FF) | **MEASURE-FIRST** → **SHIP-in-F** (feature-detected fast lane iff bench bites, zero-alloc preserved) — *lane headline* |
| **§3** | Houdini Animation Worklet / Paint / Layout — engine ships none, correctly | `src/` (0 hits); W3C WD `css-animation-worklet-1` | NOT Baseline (Chromium-only) | **KILL** (Animation Worklet) + **RECORD** (Paint/Layout out-of-scope) |
| **§4** | WA2 group/sequence/custom-effect — engine's `AnimationGroup`/`Timeline` are the JS analogues (lead for the domain) | `group.ts`, `timeline.ts`, `engine.ts:170`; `web-animations-2` | mixed | **RECORD / ALREADY-SOTA** (parity) |
| **§4 B-1** | `KeyframeEffect.composite` ordering (concat-vs-sum gate) | `group.ts:248-268`, `waapi.ts`; WA2 | composite widely avail | **BOOK** (defer to `r-waapi-platform-2026.md` P2; +WA2 spec citation) |
| **§4 B-2** | `animation-trigger` declarative play-on-scroll | `timeline.ts` (JS analogue); WA2 / scroll-triggered explainer | NOT Baseline (Chrome ~145) | **BOOK** (Timeline sampler is the cross-engine fallback) |
| **§5** | Anchor Positioning (Baseline 2026) + Popover (2025-01-27) + Invoker Commands (2025-12-12) — demo overlays are glass-ui/reka-ui (Floating-UI JS) | `SharePopover.vue:2-52`, `App.vue:152`, `CubeScene.vue:26-114`, `package.json:79,107` | Anchor 2026 · Popover/Invoker newly avail | **glass-ui-HANDOFF** + **demo BOOK** (consume once shipped) |
| **§5** | `ElementMorph` ↔ anchor positioning — adjacent primitives (animated cross-engine twin vs static tether) | `morph.ts`; anchor-positioning spec | — | **RECORD / ALREADY-SOTA** (no build) |
| **§6** | `@property` reg · dense WAAPI sampling · native scroll bridge · Timeline · AnimationGroup | `engine.ts:1125-1156`, `waapi.ts:188-231,366-429`, `timeline.ts:207-260`, `group.ts` | — | **ALREADY-SOTA** (leave) |

---

## 8. inv-16 compliance

Only this file written; **zero source changes.**

- **keyframes.js → FOLD-E-shaped (SHIP/MEASURE):** §2 Typed OM write substrate
  (MEASURE-FIRST → SHIP-in-F; the keyframes-side builder can be local, no value.js
  precondition).
- **value.js → value.js-HANDOFF (optional):** §2 — *if* the Typed OM builder wants
  a `ValueUnit → CSSUnitValue` / `FunctionValue → CSSTransformComponent` helper, a
  named convenience for the value.js owner; **not a blocker** (the builder can read
  the already-exposed `ValueUnit`/`FunctionValue` API). No other value.js item.
- **glass-ui → glass-ui-HANDOFF:** §5 — the reka-ui overlay substrate adopts CSS
  Anchor Positioning + native Popover/Invoker Commands; never a demo patch (MEMORY
  `feedback_glass_ui_root_changes`).
- **KILL / RECORD:** §3 Animation Worklet (KILL), Paint/Layout (RECORD); §4 WA2
  parity (RECORD), `composite`/`animation-trigger` (BOOK); §5 `ElementMorph`
  parity (RECORD).
- **ALREADY-SOTA:** §6 — the post-E platform-adoption surface is exemplary; this
  lane manufactures no work there.

Cross-refs to `r-waapi-platform-2026.md` (§3/§5/P2), `r-scroll-vt-2026.md` (H-1),
`r-modern-web-2026.md` (§0), E `r-css-values.md` (§1–§7), E `d-modern-platform.md`
(D-LIB-1/D-LIB-2) are explicit; no sibling body is duplicated. This lane's
net-NEW contribution: the Typed OM **write-substrate** finding (untouched by any
prior lane), the honest **Animation Worklet KILL** (non-Baseline, corpus-silent),
the **WA2 ↔ AnimationGroup/Timeline parity map**, and the **Anchor/Popover/Invoker
glass-ui-HANDOFF** map with fresh 2026 Baseline dates.

---

## 9. Cites

- **modern-web-guidance** (`npx modern-web-guidance@latest`, retrieved this audit):
  `resilient-context-menus-and-nested-dropdowns`, `position-aware-tooltips`,
  `anchor-positioning-tab-underline` (Anchor Positioning + the
  `@supports (container-type: anchored)` limited subfeature, Chrome/Edge 143 Dec
  2025); `declarative-dialog-popover-control` (**Popover Baseline 2025-01-27**;
  **Invoker Commands Baseline 2025-12-12** — Chrome 135/Edge 135/Firefox 144/Safari
  26.2; polyfill `@oddbird/popover-polyfill`, feature-detect `"popover" in
  HTMLElement.prototype`); `animate-to-from-top-layer`; `html`/`css`/`css-layout`
  guides. **No Animation/Paint/Layout Worklet guide exists in the corpus** (searched
  — the adoption authority's silence is itself evidence).
- **caniuse** `wf-css-typed-om` — CSS Typed OM ~92.23% global; Chrome 66+, Edge
  79+, Safari 16.4+, Opera 53+, Samsung 9.2+; **Firefox unsupported (all through
  154)**; classified Baseline. MeasureThat.net `setProperty vs attributeStyleMap`
  bench (perf direction, must be re-measured on this engine).
- **MDN / Chrome for Developers** — CSS Typed OM API + `developer.chrome.com
  /docs/css-ui/cssom` ("eliminating the CSS parser"); Houdini APIs (Animation
  Worklet Chromium-only, no FF/Safari intent); `animation-composition`.
- **W3C / drafts.csswg.org** — `web-animations-2` (Group/Sequence/custom effects,
  per-effect playback rate, non-monotonic progress timelines, animation triggers);
  `css-animation-worklet-1` (WD, Chromium-only); CSS Snapshot 2026.
- **Chrome Platform Status** 5762982487261184 (Animation Worklet MVP "in
  development"); `developer.chrome.com/blog/scroll-triggered-animations`
  (`animation-trigger` Chrome ~145, 2026, no FF/Safari).
- **Anchor Positioning Baseline 2026** — Firefox 147 stable 2026-01-13 (last
  engine); Safari 26 / 18.4 (`@position-try` 18.4); Chrome 125+ (MDN
  `position-anchor`; OddBird "Anchor Positioning Updates Fall 2025").
- **Live code:** keyframes.js `src/animation/{utils.ts:363-377, engine.ts:170-171,
  747,1125-1156, morph.ts:100-114, flip.ts:83-95, waapi.ts:188-231,366-429,
  group.ts:248-268, timeline.ts:207-260}`; `demo/{@/components/custom/editor-shell/
  SharePopover.vue:2-52, app/App.vue:152, app/scenes/CubeScene.vue:26-114}`;
  `package.json:79,107`.
