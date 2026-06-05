# Tranche E · SOTA Audit — Lane: CWV / INP / LCP / Long-Tasks / content-visibility

**Lane.** The dedicated forward-SOTA Core-Web-Vitals lane: INP (`scheduler.yield`/
`postTask`/Long-Tasks), LCP (font/`fetchpriority`/CRP), CLS (display-font swap,
`contain-intrinsic-size`), `content-visibility` for offscreen heavy panes, bf-cache,
and the per-frame engine cost mapped onto the **demo's** real surfaces (the heavy
editor, the lazy Monaco/Three chunks, the fonts).

**Source of truth.** `modern-web-guidance@latest`
(`break-up-long-tasks`, `defer-rendering-heavy-content`, `faster-spa-view-transitions`,
`efficient-background-processing`, `schedule-tasks-by-priority`, `performance`),
Baseline dates as the guide reports them, + live code reads (`file:line`).

**inv-16.** keyframes.js findings → **FOLD-E**; value.js findings →
**FOLD-VALUEJS-HANDOFF** (none surfaced this lane — CWV is demo/CRP-bound, value.js is
a parse-time concern off the runtime hot path). This file only.

**Method note / corrections.** I re-grounded every claim against the live tree because
the sibling `r-modern-web-digest.md` and `d-modern-platform.md` lanes carry **two stale
assertions** this lane corrects with evidence:
1. *"`KeepAlive` retains multiple scenes"* — **false now.** `App.vue:137` ships a
   **keyed `<Suspense>` with NO `<KeepAlive>`** (the comment block `App.vue:111-135`
   documents KeepAlive was removed for cause — it broke the async loader). Only **one**
   scene is mounted at a time. This collapses the "pause N offscreen scene rAF loops"
   finding to a much narrower shape (§B-3).
2. *"zero `color-mix()` in demo author styles"* — **false.** `grep` counts **519**
   `color-mix()` occurrences across `demo/` author CSS (`EasingSidebar.vue`,
   `SpringTarget.vue`, `PlaybackRibbon.vue`, `playback-button.css`, the critical-CSS
   tokens at `vite.config.ts:84-85`, …). The demo is already native-`color-mix()`-idiomatic.
   Recorded ALREADY-SOTA (§C-7) so no tranche manufactures this work.

Legend — disposition: **FOLD-E** (actionable keyframes.js/demo wave) · **GAP-NAMED**
(real gap, named, may defer) · **BOOK** (backlog note) · **ALREADY-SOTA** (we do this;
do not manufacture work).

---

## Headline verdict

The demo's **loading critical path is already at-or-ahead of SOTA** — inlined critical
CSS for an instant layout-stable first paint, non-render-blocking main stylesheet +
fonts via the `media="print"/onload` swap, a real module-graph-root bootstrap, Monaco
(3.7 MB) / Three / Prettier / html2canvas all code-split AND excluded from
`modulepreload`, scenes lazy via `defineAsyncComponent`, the heavy editor tabs
double-gated behind `defineAsyncComponent` + reka `<TabsContent>` unmount, and a
textbook `yieldToMain()` (native `scheduler.yield` → `MessageChannel` → `setTimeout`,
live-probed, SSR-safe). bf-cache is unobstructed (**zero** `unload`/`beforeunload`).

The **named gaps are three CWV-specific, fully-Baseline wins the demo leaves on the
table**, none of them correctness bugs:

- **LCP+CLS (the one real metric gap):** the LCP element is the hero `<h1>` rendered in
  **Instrument Serif** (`--font-display`), web-font-swapped with `display=swap` and **no
  metric-matched (`size-adjust`) fallback** — a guaranteed font-swap layout shift on the
  largest text, the canonical "CDN display-font CLS" the lane brief calls out. **§B-1, FOLD-E.**
- **INP / fast view-switching:** `content-visibility: hidden` on the inactive editor
  surface (Monaco/timeline tab DOM) caches its render state for instant tab-return —
  the exact 3-to-5-view case `faster-spa-view-transitions` blesses. **§B-2, FOLD-E.**
- **Battery/CPU offscreen:** the single active scene's rAF/WebGL loop has **no**
  `contentvisibilityautostatechange` / `visibilitychange` pause when the tab is
  backgrounded or the canvas scrolls out. **§B-3, FOLD-E (narrowed).**

Everything else CWV-shaped is **ALREADY-SOTA** and recorded as such (§C) so the tranche
does not re-do solved work.

---

## A. ALREADY-SOTA — verified, do not manufacture work

### A-1 · INP / `scheduler.yield` long-task relief — fully SOTA incl. non-Chromium fallback
- **file:line** — `src/animation/internal/scheduler.ts:38-50` (`yieldToMain`), consumed
  by `src/animation/group.ts:4,57` (`AnimationGroup` batches a large per-frame composite
  and yields between slices).
- **Assessment** — This is the canonical `break-up-long-tasks` pattern, *better* than the
  guide's reference: native `scheduler.yield()` is **live-probed on every call**
  (`scheduler.ts:41-46`) so a polyfill / late-installed scheduler is honored; the fallback
  is a **`MessageChannel` macrotask** (front-of-queue-ish, cheaper than `setTimeout(0)`'s
  ≥4 ms clamp) and only then `setTimeout(0)` (`scheduler.ts:25-37`); the fallback *choice*
  is cached (capabilities are fixed for the env lifetime) while the native probe stays
  live; SSR-safe. The lane brief's ask — *"confirm the non-Chromium fallback"* — is
  **confirmed present and correct**. modern-web-guidance `break-up-long-tasks` marks
  `scheduler.yield` limited (Chrome/Edge 129 Sep 2024, FF 142 Aug 2025, **no Safari**) and
  the `setTimeout` fallback MANDATORY — the engine satisfies this and exceeds it.
- **Baseline** — `scheduler.yield`: limited (per guide). The fallback ladder needs no
  Baseline.
- **disposition** — **ALREADY-SOTA**. (Engine-side; the demo inherits it through
  `AnimationGroup`.)
- **isomorphism** — perf-only; pixel-stable.

### A-2 · Long Animation Frames (LoAF) INP attribution — textbook, dev-only DCE
- **file:line** — `demo/app/loaf-observer.ts:45-101`, wired dev-only at
  `demo/app/main.ts:27-32` behind `import.meta.env.DEV` (bundler-DCE'd → **0 bytes** to
  prod) and a dynamic `import()` (off the dev critical path too).
- **Assessment** — Matches `identify-heavy-scripts`/`identify-inp-causes` exactly:
  `long-animation-frame` entryType, `buffered:true`, `blockingDuration`, first-script
  `sourceURL`/`invoker` attribution, feature-detected via
  `PerformanceObserver.supportedEntryTypes` (`loaf-observer.ts:64-72`) so non-Chromium
  no-ops, returns a disconnect handle, exposes the ring on `window.__kfLoaf` for the
  Playwright >50 ms-trace gate.
- **Baseline** — LoAF: limited (Chrome/Edge 123 Mar 2024, no FF/Safari) — correctly
  feature-detected.
- **disposition** — **ALREADY-SOTA**. (`d-modern-platform.md` D-LIB-5 separately BOOKs
  promoting it to a library export — not a CWV concern; not duplicated here.)
- **isomorphism** — pure measurement; zero behaviour/pixel impact.

### A-3 · LCP critical-path: inlined critical CSS + non-render-blocking stylesheet & fonts
- **file:line** — `vite.config.ts:44-128` (`criticalCSSPlugin`): hand-written <2 KB
  critical block (color tokens + `color-scheme` + body reset) inlined as
  `<style data-critical>` (`:114`), and the main `index-*.css` `<link>` rewritten to
  `media="print" onload="this.media='all'"` + `<noscript>` fallback (`:121-123`).
  Pre-paint dark-mode FOUC guard inline (`index.html:36-50`). Real module-file bootstrap
  (`index.html:53`, `main.ts` header) — a graph ROOT rolldown cannot DCE.
- **Assessment** — Matches the `performance` CRP guide: the render-blocking CSS is
  removed from the critical path while a layout-stable first paint is guaranteed by the
  inlined tokens; no splash to content-swap (`index.html:55-59`).
- **Baseline** — established patterns (no gate).
- **disposition** — **ALREADY-SOTA**. (The one residual LCP gap is the *font swap shift*,
  not the CSS path — see §B-1.)
- **isomorphism** — first-paint-stable.

### A-4 · Font loading — Fira self-hosted; Instrument Serif non-blocking swap
- **file:line** — `index.html:18-34`: `preconnect` to `fonts.googleapis.com` +
  `fonts.gstatic.com (crossorigin)`; Instrument Serif via the non-blocking
  `media="print"/onload` swap + `<noscript>`; Fira Code self-hosted through
  `@mkbabb/glass-ui` (no third-party RTT). This is correct per `optimize-preload-priority`
  for the *loading* of the font (non-render-blocking).
- **disposition** — **ALREADY-SOTA for load-strategy**; the **`display=swap` reflow** it
  implies is the separate CLS gap in §B-1 (the font *arrives* non-blockingly but still
  *shifts* the LCP heading on arrival).
- **isomorphism** — load-path stable.

### A-5 · Heavy-chunk code-splitting + modulepreload exclusion (INP/LCP transitive win)
- **file:line** — `vite.config.ts:229-311`: `advancedChunks` groups `vendor-monaco`
  (`node_modules/monaco`), `vendor-three`, `vendor-prettier`, `vendor-highlight`,
  `vendor-reka-ui`, `vendor-lucide`; a `preload-helper` micro-chunk for vite's
  `__vitePreload` (so no vendor group can drag 4 MB of Monaco onto the entry's critical
  path — inv γ); and `modulePreload.resolveDependencies` (`:251-257`) **strips the lazy
  chunks from `<link rel=modulepreload>`** so Monaco/Three are never speculatively fetched.
  `deferLazyCSSPlugin(["vendor-monaco"])` (`:315`) keeps Monaco CSS off render-block.
- **Assessment** — This is the strongest single guarantor that the editor's 3.7 MB Monaco
  payload does **not** regress LCP/INP on first load. Aligns with `optimize-script-priority`
  (don't preload what isn't critical).
- **disposition** — **ALREADY-SOTA**.
- **isomorphism** — load-path stable.

### A-6 · Monaco / heavy editor is double-gated off the initial interaction path
- **file:line** — `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:114,127-128`:
  `KeyframesStringControls` and `KeyframeTimeline` (the only `CSSCodeEditor`/Monaco
  hosts) are **`defineAsyncComponent`**, rendered inside reka `<TabsContent value="keyframes|timeline">`
  (`:43-73`) which **unmounts inactive tabs by default** (reka/radix semantics). So Monaco
  is (a) a separate chunk, (b) not requested until the user opens the Keyframes tab, and
  (c) unmounted (DOM + workers torn down) when the tab is inactive. `html2canvas` is
  further deferred to a runtime `await import("html2canvas")`
  (`timeline/composables/useTimelineBuild.ts:102`).
- **Assessment** — This is *why* the `content-visibility` opportunity (§B-2) is a tab-DOM
  refinement, not a load-time emergency: the heaviest content is already lazy + unmounted.
- **disposition** — **ALREADY-SOTA** (load gating). §B-2 is the *switch-back latency*
  refinement on top.
- **isomorphism** — load-path stable.

### A-7 · bf-cache eligibility — unobstructed
- **evidence** — `grep -rn "beforeunload|'unload'|\"unload\""` over `src/` + `demo/`
  (excluding `dist/`) → **zero hits**. No `unload`/`beforeunload` listener exists to
  disqualify the page from the back/forward cache. The SPA is hash-routed
  (`router.ts`), so cross-document bf-cache applies on true external nav/back.
- **Assessment** — The single most common bf-cache killer is absent. (The page also has
  no `Cache-Control: no-store` author control here — that's a GH-Pages hosting concern,
  not code.) Matches the `performance` guide's bf-cache section by *correct absence*.
- **disposition** — **ALREADY-SOTA** (by absence — recorded so an `unload` handler is
  never reintroduced as a "cleanup").
- **isomorphism** — N/A.

### A-8 · `fetchpriority` on images — correctly absent (no LCP image)
- **evidence** — `grep fetchpriority` → 0. The LCP is the hero `<h1>` text
  (`EditorStartScreen.vue:5`, `text-display-4`), not an image; scene/dock icons are tiny
  (`w-5 h-5`) and above-fold. `optimize-image-priority` would be a no-op-or-regression
  here.
- **disposition** — **ALREADY-SOTA** (by correct absence).
- **isomorphism** — N/A.

### A-9 · `color-mix()` author CSS — already native-idiomatic (digest correction)
- **evidence** — **519** `color-mix()` occurrences across `demo/` author styles (corrects
  the `r-modern-web-digest.md` §1F "zero color-mix" claim). The demo speaks native
  `color-mix(in srgb, …)` for tints/glass tokens including the critical-CSS block
  (`vite.config.ts:84-85`).
- **disposition** — **ALREADY-SOTA**. Not a CWV finding per se, recorded to prevent
  manufactured work and to correct the cross-lane record.
- **isomorphism** — N/A.

---

## B. Named CWV gaps — the FOLD-E cluster (demo)

### B-1 · LCP display-font (`Instrument Serif`) swaps with no `size-adjust` fallback → CLS on the largest text — FOLD-E ★ (the headline CWV gap)
- **file:line** — `demo/@/styles/style.css:48` (`--font-display: "Instrument Serif",
  Georgia, serif;`), applied to the **LCP element** — the hero `<h1 class="text-display-4">`
  at `demo/@/components/custom/editor-shell/EditorStartScreen.vue:5-21`. The face loads via
  `index.html:24-29` with **`&display=swap`** and **no `@font-face` `size-adjust`/
  `ascent-override`/`descent-override` metric-matched fallback** (`grep size-adjust|
  ascent-override` over `demo/@/styles` + `demo/app` → **0**).
- **SOTA gap** — `display=swap` renders the hero immediately in the **Georgia** fallback,
  then **re-lays-out** when Instrument Serif arrives over the network. Instrument Serif is
  a *condensed display serif* whose glyph metrics differ markedly from Georgia → the
  largest text block on the page **reflows on font arrival** = a layout shift that lands on
  the **LCP node itself**, the worst CLS placement. This is exactly the "CDN display-font
  CLS" the lane brief names. The platform fix is a **metric-adjusted fallback `@font-face`**
  (`size-adjust` + `ascent/descent/line-gap-override`) so the Georgia placeholder occupies
  the *same box* the web font will, making the swap visually shift-free
  (`visually-stable-font-fallbacks` guidance; web.dev "Improved font fallbacks").
- **perf/elegance rationale** — Eliminates a CLS contribution on the LCP element for
  ~zero runtime cost (a few `@font-face` descriptor lines); also removes the
  "Georgia→Serif jump" flash that reads as jank on the brand headline. The metrics are
  derivable once (e.g. via the Fontaine/`@capsizecss/metrics` approach or a hand-tuned
  `size-adjust`). No JS, no extra request.
- **Baseline** — `size-adjust` / `ascent-override` / `descent-override` /
  `line-gap-override` `@font-face` descriptors: **Baseline widely available** (Chrome 87,
  FF 89, Safari 17). Safe now.
- **Fallback / feature-detect** — none needed; unsupported engines simply ignore the
  descriptors and fall back to today's behaviour. Keep `display=swap` (correct) and add the
  metric-matched fallback face; optionally switch the *fallback* to `display=optional` is
  **not** advised here (would risk the web font not showing on slow links — the brand wants
  it).
- **disposition** — **FOLD-E** (demo). Define a metric-adjusted `@font-face` for the
  Georgia fallback used in the `--font-display` stack (and ideally the `--font-serif`
  body stack), sized to Instrument Serif's metrics.
- **isomorphism** — Pixel-*stabilizing*: the headline lands in its final box from first
  paint; only the inter-swap shift is removed. Befitting, not a regression.

### B-2 · `content-visibility: hidden` to cache the inactive editor-tab render state (instant tab-return) — FOLD-E
- **file:line** — `AnimationControls.vue:28-73`: the Controls | Keyframes | Timeline tab
  panes (`<TabsContent>`), of which Keyframes/Timeline host the heavy Monaco/timeline DOM.
  Today inactive reka `<TabsContent>` **unmounts** (cheap RAM, but a full
  re-mount+re-layout+Monaco-recreate cost on every switch-back). Only `contain: style`
  exists in the demo, at `demo/cube/CubeTarget.vue:164` — nothing on the editor panes.
- **SOTA gap** — `faster-spa-view-transitions` blesses **`content-visibility: hidden`** for
  exactly a *small, fixed (3-to-5) view count* to **cache the rendered state** of the
  inactive pane (skip layout/paint, keep style containment) for near-instant switch-back —
  *superior to `display:none`/unmount* because Monaco isn't destroyed+recreated. For the
  3-tab control surface this is squarely inside the guide's "DO" envelope (no eviction
  strategy needed — bounded view count).
- **perf/elegance rationale** — Switching to the Keyframes tab currently pays Monaco
  re-instantiation (editor model, themes, web-worker spin-up) — a classic INP spike on the
  interaction. Keeping the pane mounted but `content-visibility: hidden` trades a bounded
  RAM cost for **layout/paint skip while hidden** + **instant reveal**, turning a
  multi-hundred-ms tab switch into a sub-frame one. This is the single biggest *INP*
  (interaction-latency) win available in the demo.
- **Baseline** — `content-visibility`: **Baseline newly available 2025-09-15** (Chrome 108,
  Edge 108, FF 130 Sep 2024, **Safari 26 Sep 2025**).
- **Fallback / feature-detect** — keep reka's unmount as the fallback, or per the guide:
  ```css
  @supports not (content-visibility: hidden) { .editor-pane.inactive { display: none; } }
  @supports (content-visibility: hidden) {
    .editor-pane.inactive { content-visibility: hidden; }   /* render-state cached */
    .editor-pane.inactive { position: absolute; }            /* out of layout flow  */
  }
  ```
  Requires `forceMount` on the reka `<TabsContent>` (so the pane stays in the DOM) +
  toggling an `.inactive` class instead of unmounting — a deliberate trade vs today's
  unmount. **MANDATORY a11y (per guide):** set `aria-hidden` on the hidden pane and move
  focus into the revealed pane on switch (reka tabs already manage roving focus — verify it
  survives `forceMount`).
- **disposition** — **FOLD-E** (demo). Scope it to the Keyframes/Timeline (Monaco-heavy)
  panes where re-mount cost is real; the lightweight Controls pane can stay unmounted.
- **isomorphism** — Pixel-stable when active; only the *cost* of switch-back changes
  (re-layout → cached). Must verify Monaco's own ResizeObserver re-measures correctly on
  reveal from `content-visibility: hidden` (it inits deferred via ResizeObserver per
  `demo/CLAUDE.md` — reveal fires a resize, so this is expected to work; verify).

### B-3 · Pause the active scene's rAF / WebGL loop when offscreen/backgrounded — FOLD-E (narrowed from the digest's stale KeepAlive premise)
- **file:line** — Amiga Three.js loop: `demo/app/scenes/AmigaScene.vue:102-111`
  (`requestAnimationFrame(animate)` → `renderer.render`); cube CSS-3D idle bob + the
  easing/spring rAF demos (`EasingTarget.vue`, `SpringTarget.vue`, `useRafLoop`). **No**
  `visibilitychange`, `contentvisibilityautostatechange`, or `IntersectionObserver` pause
  anywhere (`grep` over `src/` + `demo/` → 0).
- **Correction to prior lanes** — `r-modern-web-digest.md §2.4` / `d-modern-platform.md`
  framed this as "pause N offscreen KeepAlive scene loops." **There is no KeepAlive**
  (`App.vue:111-135`): exactly **one** scene is mounted at a time via keyed `<Suspense>`,
  so there are never multiple live scene loops to pause. The *real* remaining waste is the
  **single active scene's** loop continuing to burn CPU/GPU/battery when (a) the **browser
  tab is backgrounded** (no `visibilitychange` gate), or (b) the canvas/target **scrolls
  out** of the editor viewport.
- **SOTA gap / rationale** — `efficient-background-processing`: pause `<canvas>`/WebGL/rAF
  when not rendered, resume just-in-time. For the Amiga Three.js scene a backgrounded tab
  still drives a full WebGL render every rAF — pure battery drain. Two cheap gates:
  `document.addEventListener('visibilitychange', …)` to halt on `document.hidden`, and/or
  `contentvisibilityautostatechange` (paired with `content-visibility: auto` on the scene
  host) for the scroll-out case. The guide's note — the event **does not bubble**, attach
  directly or use `{capture:true}` — applies.
- **perf/elegance rationale** — Removes wasted main-thread + GPU work for a backgrounded /
  offscreen animated demo (the WebGL scene especially); a measurable CPU/INP/battery win
  with no visible behaviour change while visible. The engine already exposes `managed`/
  pause controls, so this is demo-side wiring (`Animation.pause()` / Three
  `setAnimationLoop(null)` on hidden).
- **Baseline** — `visibilitychange` / Page Visibility: **Baseline widely available**.
  `content-visibility` + `contentvisibilityautostatechange`: **Baseline newly available
  2025-09-15** (use `IntersectionObserver` fallback for the scroll-out case per the guide).
- **Fallback / feature-detect** — `visibilitychange` needs none. For the
  `contentvisibilityautostatechange` path: `'contentVisibility' in
  document.documentElement.style` → else `IntersectionObserver({rootMargin:'200px'})`
  (the guide's exact fallback).
- **disposition** — **FOLD-E** (demo wiring; engine already exposes pause/resume). Start
  with the `visibilitychange` gate (universal, biggest battery win, trivial) and BOOK the
  scroll-out `content-visibility` path as a refinement.
- **isomorphism** — Only pauses invisible work; resumes on return. Pixel-stable when
  visible. Verify the rAF clock re-bases on resume so the animation doesn't "jump" by the
  hidden elapsed time (engine's `startTime`/`pausedTime` machinery, used by
  `restoreGroupPlaybackState` in `App.vue`, already does this — reuse it).

---

## C. BOOK — real, lower-priority CWV notes

### C-1 · `content-visibility: auto` on below-the-fold heavy panels — BOOK
- The editor is largely a single above-the-fold viewport (no long feed), so the
  `content-visibility: auto` *below-the-fold* pattern (`defer-rendering-heavy-content`) has
  thin surface here — the Timeline bottom-bar (when expanded) and any tall scrollable
  control list are the only candidates. **MANDATORY** `contain-intrinsic-size` if adopted
  (else scrollbar jump). Marginal; measure-first with the existing LoAF observer.
- **Baseline** — `content-visibility` newly avail 2025-09-15. **disposition — BOOK.**

### C-2 · `scheduler.postTask('background')` for parse/frame-compile — BOOK
- `schedule-tasks-by-priority`: the one-shot `parse()`/`FrameCompiler` work (CSS →
  `AnimationFrame[]`) could run at `postTask('background')` priority so a big paste doesn't
  contend with user input. The engine already *yields within* group ticks (A-1); this is
  the orthogonal *prioritization* of one-shot compile. Engine-side; opportunistic.
  `scheduler.postTask` limited (Chrome/Edge 94, FF 142, no Safari) — needs a `setTimeout`
  fallback like A-1. **disposition — BOOK** (engine; not a CWV headline).

### C-3 · `fetchpriority="high"` on the module bootstrap — BOOK
- `index.html:53` `<script type="module" src="./main.ts">` is the LCP-critical graph root;
  `fetchpriority="high"` is a marginal, safe nudge (`optimize-script-priority`). Module
  scripts already fetch with reasonable priority; the win is small. **disposition — BOOK.**

### C-4 · Forced-reflow audit in hot drag paths — BOOK
- `interactions-in-complex-layouts`: spot-check read-then-write batching in
  `AnimationVisualizer` pointer-drag, `KeyframeTimeline` scrub, and `useTransformState`'s
  rAF-debounced matrix watcher for layout-thrash (interleaved `getComputedStyle`/style
  writes). `EasingTarget.vue` reads ball sizes via `getComputedStyle` in `onMounted`
  (`:229`) — one-shot, fine. No obvious per-frame thrash spotted; a focused audit would
  confirm. **disposition — BOOK.**

### C-5 · `scrollend`-debounced handlers — BOOK / N/A
- No heavy per-scroll handlers found; `defer-work-until-scroll-ends` has no current surface.
  **disposition — N/A** (recorded for completeness).

---

## D. Summary table

| ID | Surface | Finding | Baseline | Disposition |
|----|---------|---------|----------|-------------|
| A-1 | engine | `yieldToMain` native `scheduler.yield` + MessageChannel/`setTimeout` fallback, live-probed | limited (guide) | **ALREADY-SOTA** |
| A-2 | demo | LoAF INP observer, feature-detected, dev-only DCE | limited (Chrome 123) | **ALREADY-SOTA** |
| A-3 | demo | inlined critical CSS + non-render-blocking stylesheet | established | **ALREADY-SOTA** |
| A-4 | demo | Fira self-hosted; Instrument Serif non-blocking load | widely avail | **ALREADY-SOTA** (load) |
| A-5 | demo | Monaco/Three code-split + modulepreload-excluded | established | **ALREADY-SOTA** |
| A-6 | demo | editor/Monaco double-gated (async + tab unmount) | established | **ALREADY-SOTA** |
| A-7 | demo | bf-cache unobstructed (no `unload`/`beforeunload`) | established | **ALREADY-SOTA** |
| A-8 | demo | `fetchpriority` correctly absent (text LCP) | — | **ALREADY-SOTA** |
| A-9 | demo | `color-mix()` author CSS (519×) — digest correction | widely avail | **ALREADY-SOTA** |
| **B-1** | **demo** | **LCP display-font swaps, no `size-adjust` fallback → CLS** | **widely avail** | **FOLD-E ★** |
| **B-2** | **demo** | `content-visibility: hidden` to cache inactive editor tab | newly avail 2025-09 | **FOLD-E** |
| **B-3** | **demo** | pause active scene rAF/WebGL when hidden/offscreen | widely/newly | **FOLD-E** |
| C-1 | demo | `content-visibility: auto` on below-fold panels | newly avail 2025-09 | **BOOK** |
| C-2 | engine | `postTask('background')` for parse/frame-compile | limited | **BOOK** |
| C-3 | demo | `fetchpriority="high"` on module bootstrap | broad | **BOOK** |
| C-4 | demo | forced-reflow audit in drag/scrub paths | — | **BOOK** |
| C-5 | demo | `scrollend`-debounce — no surface | — | **N/A** |

---

## E. Cites

- modern-web-guidance (`@latest`): `break-up-long-tasks` (`scheduler.yield` limited —
  Chrome/Edge 129, FF 142, no Safari; `setTimeout` fallback MANDATORY) ·
  `defer-rendering-heavy-content` (`content-visibility: auto/hidden`, Baseline newly avail
  2025-09-15, Chrome 108 / FF 130 / Safari 26; `contain-intrinsic-size` MANDATORY) ·
  `faster-spa-view-transitions` (`content-visibility: hidden` for 3-to-5 fixed views,
  CPU↓/RAM↑ trade, `@supports not` → `display:none` fallback, MANDATORY focus mgmt) ·
  `efficient-background-processing` (`contentvisibilityautostatechange` — does NOT bubble;
  `IntersectionObserver` fallback `rootMargin:'200px'`) · `schedule-tasks-by-priority`
  (`scheduler.postTask`) · `optimize-script-priority`, `optimize-preload-priority`,
  `performance` (CRP/LCP/INP/CLS/bf-cache).
- web.dev "Improved font fallbacks" / `visually-stable-font-fallbacks` —
  `size-adjust`/`ascent-override`/`descent-override`/`line-gap-override` `@font-face`
  descriptors (Baseline widely available) to eliminate font-swap CLS.
- Live code: `src/animation/internal/scheduler.ts:38-50`, `src/animation/group.ts:57`,
  `demo/app/loaf-observer.ts`, `demo/app/main.ts:27-32`, `demo/app/index.html:18-53`,
  `demo/app/App.vue:111-149`, `vite.config.ts:44-128,229-316`,
  `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:28-73,127-128`,
  `demo/@/components/custom/editor-shell/EditorStartScreen.vue:5-21`,
  `demo/@/styles/style.css:40-48`, `demo/app/scenes/AmigaScene.vue:102-111`.

**inv-16 compliance.** Only this file written. All findings keyframes.js/demo → FOLD-E /
BOOK / ALREADY-SOTA. No value.js findings surfaced this lane (CWV is a CRP/runtime
concern; value.js parse-time work is off the CWV hot path) → no FOLD-VALUEJS-HANDOFF.
