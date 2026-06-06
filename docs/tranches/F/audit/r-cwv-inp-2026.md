# Tranche F · SOTA audit — CWV / INP / perf frontier (post-D+E re-measure)

**Lane id:** `r-cwv-inp-2026` · **Branch at audit:** `tranche-e-impl` (D+E IMPLEMENTED
+ CLOSED). **Scope:** the 2026 CWV/INP/perf SOTA — INP/LoAF guidance,
`scheduler.yield`/`postTask` priority, `content-visibility`/`content-visibility:auto`,
speculation-rules-vs-SPA-prefetch, the loading critical path, bf-cache — diffed against
`docs/tranches/E/audit/sota/r-cwv-perf.md` and **re-measured against what E.W4/W11
actually landed.** **inv-16:** I may PROPOSE value.js changes (hand-off); I write ONLY
this keyframes.js doc, ZERO source edits. **inv ε:** every keyframes claim is
`file:line`-grounded; every SOTA/Baseline claim is sourced.

This is a **re-measure, not a re-derivation.** E's `r-cwv-perf.md` named a three-item
FOLD-E cluster (B-1 font-CLS, B-2 content-visibility-cache, B-3 scene-pause) + four
BOOKs (C-1 content-visibility:auto, C-2 postTask, C-3 fetchpriority, C-4 forced-reflow).
**E.W11 + E.W4 SHIPPED the entire B-cluster.** My job is to (1) confirm each landed
correctly and is now ALREADY-SOTA, (2) re-assess the four BOOKs against the 2026 catalog
+ the actual post-E surface, and (3) find anything NEWER than the E audit. The honest
headline: **the post-E CWV/INP surface is exemplary — there is no FOLD-in-F CWV wave to
manufacture.** Two small, genuinely-new recordings + a re-confirmation of E's deferrals
is the entire actionable output.

Legend — disposition: **SHIP-in-F** · **MEASURE-FIRST** · **BOOK** · **KILL** ·
**RECORD** · **value.js-HANDOFF** · **ALREADY-SOTA** (we do this; manufacture no work).

---

## Headline verdict

E's `r-cwv-perf` left exactly three FOLD-E CWV gaps. **All three landed in E.W11/W4,
each idiomatically and feature-detected** — verified live this audit:

| E `r-cwv-perf` gap | E wave that closed it | Post-E status (verified) |
|---|---|---|
| **B-1** LCP display-font swaps with no `size-adjust` fallback → CLS | W11 S5 | **CLOSED** — Capsize metric-matched `@font-face` (`style.css:80-87`), wired into `--font-display`/`--font-serif` (`:40,:53`), gated by `proof:demo-elevate` first-paint clause |
| **B-2** `content-visibility:hidden` to cache the inactive Monaco tab | W11 S6 + W4 | **CLOSED** — force-mount + `content-visibility:hidden` + `inert` + focus-on-reveal + Monaco re-measure (`AnimationControls.vue:52-58,200-222,285-296`), `@supports not` → `display:none` fallback |
| **B-3** pause the active scene rAF/WebGL when backgrounded | W11 S6 | **CLOSED** — `useSceneVisibilityPause` (`demo/app/useSceneVisibilityPause.ts`) wired in **all four** animated scenes (amiga/cube/easing/spring), with the only-resume-what-we-paused honesty contract |

Beyond the closed cluster, the 2026 CWV frontier surfaces **nothing new that bites this
demo.** The INP threshold is unchanged (200 ms p75); the "March-2026 core update tightens
INP" claims are SEO-blog marketing, not a platform-threshold change (see §New-1).
`scheduler.yield` gained no priority argument — it *inherits* context priority — and the
engine's use is already the correct semantic (§New-2). Speculation Rules remains MPA-only;
the demo's hash-routed SPA correctly uses Vite hover-warmup (§E-1, re-confirm KILL).

**The two genuinely-new recordings** (both RECORD/BOOK, neither a forced wave):
- **New-2 · the yield-before-paint vs yield-to-scheduler distinction** — newly emphasized
  in the 2026 web.dev INP guidance: `scheduler.yield()` does *not* guarantee a paint before
  the continuation; the "respond visually then compute" case wants `rAF`+`setTimeout`. The
  engine + the editor both use the *correct* tool for their case (RECORD — no change).
- **New-3 · `contain-intrinsic-size` absent on the `content-visibility:hidden` Monaco pane**
  — the guide's pairing note. For `hidden` (vs `auto`) it is a near-no-op, but recording the
  reasoned exemption is the honest call (RECORD).

Everything else CWV-shaped is **ALREADY-SOTA**, re-confirmed (§A) so no F wave re-does it.

---

## A. The B-cluster — verified CLOSED, now ALREADY-SOTA

### A-1 · B-1 (font-swap CLS on the LCP heading) — CLOSED, exemplary
- **file:line** — `demo/@/styles/style.css:80-87` defines `@font-face { font-family:
  "Instrument Serif Fallback"; src: local("Georgia"); size-adjust: 105.9310%;
  ascent-override: 96.6667%; descent-override: 37.7604%; line-gap-override: 0% }`; wired
  into the stack at `:40` (`--font-serif`) and `:53` (`--font-display`), so the LCP hero
  `<h1 class="text-display-4">` resolves `Instrument Serif → Instrument Serif Fallback →
  Georgia`. The metrics are Capsize-derived (Instrument Serif upm 1000 / ascent 1024 /
  descent 400 / x-height 510 vs Georgia upm 2048 / x-height 986 — `style.css:70-78`),
  mirroring glass-ui's own bundled-face idiom (no ad-hoc invention).
- **Assessment** — This is *exactly* what E's `r-cwv-perf` §B-1 prescribed: a
  metric-adjusted fallback so the Georgia placeholder occupies the same box the web font
  will, making the `display=swap` (correctly KEPT) shift-free. The `proof:demo-elevate`
  first-paint clause (`scripts/proof-demo-elevate.mjs:117-120`) bites on the descriptor
  trio — a regression reds.
- **Baseline** — `size-adjust`/`ascent-override`/`descent-override`/`line-gap-override`:
  widely available (Chrome 87, FF 89, Safari 17); silently ignored where unsupported, no
  feature-detect needed (correctly noted in the comment).
- **disposition** — **ALREADY-SOTA**. The E gap is closed and gated. Manufacture nothing.

### A-2 · B-2 (content-visibility:hidden cache for the Monaco pane) — CLOSED, hardened
- **file:line** — `AnimationControls.vue:52-58` force-mounts the keyframes `<TabsContent>`
  with `:class="['monaco-pane', keyframesActive ? '' : 'inactive']"` + `:inert="!keyframesActive"`;
  `:285-296` applies `.monaco-pane.inactive { content-visibility: hidden }` with the
  `@supports not (content-visibility: hidden) { display: none }` fallback; `:204-222`
  moves focus into the revealed pane on `nextTick` and lets Monaco's deferred
  ResizeObserver re-measure on the layout pass that `content-visibility` restoration
  triggers. **W4 hardened it** beyond the E.W11 form: the inactive pane uses `inert`
  (removes focusable Monaco descendants from BOTH the tab order and the AT tree), closing
  the bare-`aria-hidden`-focus a11y defect the E audit's §B-2 flagged as MANDATORY.
- **Assessment** — This is the `faster-spa-view-transitions` / `defer-rendering-heavy-content`
  "Toggle State → `content-visibility: hidden`" pattern (the guide's row 2), applied to a
  bounded 3-tab surface — squarely inside the guide's "DO" envelope. The cache trades a
  bounded RAM cost for a sub-frame switch-back (no Monaco worker/model/theme re-spin),
  which was E's named single-biggest-INP win. Focus management + the inert a11y contract
  + the `@supports` fallback all match the guide's MANDATORY clauses. Gated by
  `proof:demo-elevate` cwv clause (`proof-demo-elevate.mjs:128-131`).
- **Baseline** — `content-visibility`: Newly available, Baseline 2025-09-15 (Chrome 108 /
  FF 130 / Safari 26). The `@supports not` fallback covers the long tail.
- **disposition** — **ALREADY-SOTA** (+ one RECORD sub-note — see New-3 on
  `contain-intrinsic-size`). The timeline (the *other* potential Monaco host) is NOT
  content-visibility-cached — it is `v-if`-gated/Teleported (`AnimationControls.vue:95-109,
  196-198`); that is correct (the timeline is the expand-to-bottom-bar surface, a different
  lifecycle than a peer tab), not a gap.

### A-3 · B-3 (pause the active scene loop when backgrounded) — CLOSED, all four scenes
- **file:line** — `demo/app/useSceneVisibilityPause.ts` rides `@vueuse/core`'s
  `useDocumentVisibility` (honoring the E.W2 listener-gate forbidding a raw
  `visibilitychange` `addEventListener`), with the honesty contract: it only auto-resumes
  what *it* paused (`:36-51` — `autoPaused` flag, `wasRunning()` probe at hide time). Wired
  in **all four** animated scenes:
  - amiga (WebGL present loop): `demo/app/scenes/AmigaScene.vue:126-135`
    (`() => rafId != null`, `stopRenderLoop`, `startRenderLoop`);
  - cube (engine group): `demo/cube/useCubeAnimations.ts:107-116`
    (`animationGroup.pause()`/`.resume()`, re-bases via child `pausedTime`);
  - easing: `demo/easing/useEasingDemo.ts:188`;
  - spring: `demo/spring/useSpringDemo.ts:243`.
- **Assessment** — `efficient-background-processing`: pause `<canvas>`/WebGL/rAF when not
  rendered, resume just-in-time. The E audit's §B-3 narrowed the digest's stale "N KeepAlive
  loops" premise to "the single active scene's loop on a backgrounded tab" — and that is
  exactly what landed, the universal/biggest-battery-win `visibilitychange` gate. The clock
  re-base on resume (so the animation doesn't jump by the hidden elapsed time) is real:
  the engine's `pause()`/`resume()` `pausedTime`/`startTime` machinery, reused per the
  `useSceneVisibilityPause` docstring.
- **Baseline** — Page Visibility / `visibilitychange`: widely available.
- **disposition** — **ALREADY-SOTA**. The E audit BOOKed the `contentvisibilityautostatechange`
  *scroll-out* refinement on top of the `document.hidden` gate; I re-assess that BOOK as
  **KILL/RECORD** (see B-2 below) — the scroll-out case does not exist in this demo
  (the scene canvas is the editor's central above-the-fold subject, never scrolled out
  of its own viewport while a peer scene is hidden, because exactly one scene mounts).

### A-4 · the rest of the E ALREADY-SOTA set — re-confirmed unchanged
Re-verified live, all still true post-E (no regression, no new gap):
- **`yieldToMain` INP relief** — `src/animation/internal/scheduler.ts:38-49`: native
  `scheduler.yield()` live-probed per call (`:43-45`), `MessageChannel` macrotask fallback
  (`:25-37`), cached fallback choice, SSR-safe. Consumed by `AnimationGroup` (`group.ts:57`)
  and the editor parse→compile (`useKeyframeOps.ts:78`). **ALREADY-SOTA** (§New-2 adds the
  one nuance, which the engine already satisfies).
- **LoAF observer** — dev-only, DCE'd to 0 prod bytes, feature-detected
  (`demo/app/loaf-observer.ts`). **ALREADY-SOTA**.
- **bf-cache** — re-grepped `beforeunload|'unload'|"unload"` over `src/`+`demo/` (excl
  `dist/`/`node_modules`) this audit → **ZERO hits**. Still unobstructed. **ALREADY-SOTA**
  (by correct absence — recorded so no `unload` "cleanup" is ever reintroduced).
- **Critical-path / Monaco code-split / modulepreload-exclusion / `fetchpriority`-absent**
  (text LCP) / `color-mix()` author CSS — all re-confirmed unchanged from E §A-3/A-5/A-6/
  A-8/A-9. **ALREADY-SOTA**.

---

## B. The four E BOOKs — re-assessed against the post-E surface + 2026 catalog

### B-1 · C-1 `content-visibility: auto` on below-the-fold panels — re-assess: **RECORD (precondition still absent)**
- **E's call** — BOOK; "thin surface — the editor is a single above-the-fold viewport".
- **W4 S6's explicit deferral** — E.W4 recorded S3 (content-visibility:auto) as **N-A**:
  "one scene mounts at a time via keyed `<Suspense>`, above-the-fold — the lever's
  precondition does not exist" (verified: `App.vue` keyed `<Suspense>`, NO `KeepAlive`).
- **2026 re-grounding** — the `defer-rendering-heavy-content` guide is **emphatic** that
  `content-visibility: auto` is for "large self-contained blocks **strictly below the
  initial fold**" and **"DO NOT apply to elements within the initial above-the-fold
  viewport — doing so forces the browser to evaluate visibility boundaries before
  rendering, which paradoxically delays critical page load"** (guide, MANDATORY). The demo
  is a single-viewport editor: the scene subject, the controls dock, and the tab panel are
  **all above the fold**. Applying `content-visibility:auto` here would be a **regression**,
  not a win — the guide's own anti-pattern.
- **The one honest candidate, re-examined** — the Timeline expand-to-bottom-bar
  (`AnimationControls.vue:95-109`) is the only tall, optionally-offscreen surface. But it is
  `v-if`-gated (not rendered until expanded), so there is no offscreen heavy DOM to defer —
  `content-visibility:auto` has nothing to skip. The keyframe-card list is similarly gated.
- **disposition** — **RECORD** (re-confirm E.W4's N-A with the 2026 guide's explicit
  above-the-fold prohibition as the *reason*, not just "thin surface"). **Precondition
  genuinely absent.** Trigger to revisit: if a future demo grows a long scrollable feed
  (an asset gallery, a preset grid) below the fold, `content-visibility:auto` +
  `contain-intrinsic-size` becomes the right tool then. Today: do not adopt.
- **value.js:** none.

### B-2 · the `contentvisibilityautostatechange` scroll-out pause (E §B-3's booked refinement) — re-assess: **KILL (no surface) / RECORD**
- **E's call** — B-3 shipped the `document.hidden` gate and BOOKed the
  `contentvisibilityautostatechange` scroll-out path "as a refinement".
- **Re-grounding** — `efficient-background-processing` pairs
  `contentvisibilityautostatechange` with `content-visibility: auto` on the heavy host.
  But B-1 just established `content-visibility:auto` has no valid surface here (the scene
  subject is the above-the-fold focal element). With no `content-visibility:auto`, the
  `contentvisibilityautostatechange` event **never fires** — there is nothing to wire.
  The *scroll-out* case the E refinement imagined (canvas scrolls out of the editor
  viewport) does not occur: the single-mounted scene subject is the viewport's centerpiece,
  not a feed item. The `document.hidden` gate (landed) already captures the real waste
  (backgrounded tab).
- **disposition** — **KILL the booked scroll-out refinement** (it has no surface absent a
  scrollable-feed restructure) / **RECORD** the reasoning so it is not re-proposed. If
  B-1's "future long feed" trigger ever fires, this pairs with it then.
- **value.js:** none.

### B-3 · C-2 `scheduler.postTask('background')` for parse/frame-compile — re-assess: **BOOK (unchanged) — but the engine yield is the correct primitive**
- **E's call** — BOOK (engine-side; orthogonal prioritization of the one-shot compile).
- **2026 re-grounding** — `schedule-tasks-by-priority`: `postTask('background')` defers
  not-time-critical work. The kf one-shot `parse()`/`FrameCompiler` *could* run at
  `background` so a large paste doesn't contend with input. **But** the editor already
  awaits the engine's `yieldToMain` between parse and compile (`useKeyframeOps.ts:78`), so
  a big edit never lands as one >50ms long task — the INP-relief is *already* present via
  the yield ladder. `postTask('background')` would add *prioritization* (the compile runs
  behind user-blocking input) but at the cost of a `setTimeout` polyfill (Scheduler API is
  limited — Chrome/Edge 129, FF 142, **no Safari**) for a one-shot operation that is already
  yielded. The marginal win is small and the polyfill weight unjustified for one call site.
- **Note (§New-2 connection)** — `scheduler.yield()` *inherits* `postTask`'s priority if
  called inside one (MDN, this audit). So a future `postTask('background')` wrapper around
  the compile would automatically make the inner `yieldToMain` continuations background-priority
  — a clean composition IF this is ever adopted. The engine needs no change to benefit.
- **disposition** — **BOOK** (re-confirm E; engine-side, opportunistic, not a CWV headline).
  Not a forced F wave. Trigger: a measured input-contention regression on a huge paste.
- **value.js:** none (engine-side, off the value.js parse-time concern).

### B-4 · C-3 `fetchpriority="high"` on the module bootstrap / C-4 forced-reflow audit — re-assess: **BOOK / RECORD**
- **C-3** — `index.html` module bootstrap is the LCP-critical graph root; `fetchpriority="high"`
  is a marginal, safe nudge. Module scripts already fetch at reasonable priority; the win is
  small. **BOOK** (re-confirm E; not a forced F change). The font preload (W4 S4,
  `rel=preload as=font crossorigin` for the LCP heading) is the higher-leverage CRP lever
  and **already landed**.
- **C-4** — the forced-reflow audit of hot drag/scrub paths (`AnimationVisualizer`,
  `KeyframeTimeline` scrub, `useTransformState`). E spotted no per-frame thrash; a focused
  audit would confirm. This is a **MEASURE-FIRST** item with no observed defect — the
  `proof:lighthouse-mobile` + the `bench/playwright.bench.ts` >50ms-LoAF gate are the
  instruments that would catch a real reflow regression, and they are green. **RECORD**
  (no evidence of a problem; verify-if-a-bench-lane-runs, do not manufacture).
- **value.js:** none.

---

## New (genuinely newer than `r-cwv-perf`, 2026)

### New-1 · INP threshold / "March-2026 core update tightens INP" — RECORD (no platform change)
- **Claim circulating** — SEO blogs assert a "March 2026 core update formalized INP <150ms
  for ranking stability." **Grounding** — the *platform* INP threshold is **unchanged**:
  good = ≤200 ms at p75 (web.dev / corewebvitals.io, this audit); INP remains the
  most-commonly-failed CWV (≈43% of sites fail 200ms). The "<150ms" figure is a
  ranking-margin recommendation from SEO commentary, **not** a Web-Vitals threshold change.
- **kf relevance** — none actionable. The demo's interaction surface (controls,
  scrub, tab-switch) is already yielded (A-4) + content-visibility-cached (A-2); the B-cluster
  closure *is* the INP work. No new metric obligation.
- **disposition** — **RECORD** (so no F wave chases a phantom threshold change).

### New-2 · `scheduler.yield()` — no priority arg; the yield-before-paint distinction — RECORD (engine already correct)
- **Fact 1 (priority)** — `scheduler.yield()` takes **no arguments**; it *inherits* the
  surrounding context's priority (`user-visible` at top level; the enclosing `postTask`
  priority if nested; `background` inside `requestIdleCallback`), and its continuation is
  enqueued at the **front** of that priority's queue (boosted vs `postTask`) — MDN, this
  audit. The engine docstring (`scheduler.ts:7-12`) already states the front-of-queue
  semantic correctly. **No engine change** — and the §B-3 `postTask('background')` BOOK
  would compose cleanly with it (the inner yield would inherit background priority for free).
- **Fact 2 (the NEW nuance — yield-before-paint)** — the 2026 web.dev INP guidance newly
  emphasizes: `scheduler.yield()` does **NOT** guarantee a paint has occurred before the
  continuation runs. For the "respond visually *then* run heavy logic" pattern, the correct
  tool is `requestAnimationFrame` + `setTimeout` (paint, then next-frame work), not
  `scheduler.yield()`. **kf re-assessment:**
  - The engine's `yieldToMain` slices a **compute-bound group composite** (`group.ts:57`) —
    the goal is "let input/render through between slices," for which front-of-queue
    scheduler-yield is the *correct* semantic (it is NOT a "paint this result first" case).
  - The editor's parse→compile yield (`useKeyframeOps.ts:78`) splits **one >50ms long task**
    into two — again the "don't monopolize the thread" case, correctly a scheduler-yield.
  - Neither site is a "paint the visual response before computing" case, so neither wants
    the rAF+setTimeout idiom. **The engine + editor each use the correct tool for their case.**
- **disposition** — **RECORD**. Already-SOTA; the new nuance confirms (not contradicts) the
  engine's choice. No change. (Documented so a future "switch to rAF-yield" suggestion is
  correctly rejected for these two compute-bound sites.)

### New-3 · `contain-intrinsic-size` absent on the `content-visibility:hidden` Monaco pane — RECORD (reasoned exemption)
- **file:line** — `AnimationControls.vue:285-287`: `.monaco-pane.inactive { content-visibility:
  hidden }` carries **no** `contain-intrinsic-size`. The only `contain` in the demo is
  `contain: style` at `CubeTarget.vue:164` (a different surface).
- **Grounding** — the guide marks `contain-intrinsic-size` **MANDATORY** *for
  `content-visibility: auto`* (else the off-screen box collapses to 0px, causing scrollbar
  jump on scroll). For `content-visibility: **hidden**` the case is materially weaker: the
  pane is a force-mounted peer tab that is fully out of layout flow while inactive (the
  active tab owns the panel box), it is **not scroll-driven**, and on reveal the
  `.inactive` class is removed (restoring full `content-visibility: visible`) before the
  user sees it — there is no "off-screen placeholder that must reserve scroll space"
  scenario. So the omission does **not** cause the CLS/scrollbar-jump the descriptor guards
  against. It is a defensible exemption, not a bug.
- **disposition** — **RECORD** (reasoned exemption). *Optional* hardening: adding
  `contain-intrinsic-size: auto` to the inactive pane would let the browser "remember" the
  pane's box if a future layout ever measured it while hidden — a belt-and-suspenders nicety
  with ~zero downside, but **not required** for the `hidden` (vs `auto`) case and below the
  F threshold for a source edit. If a demo-elevation wave touches this block for another
  reason, fold it in then; do not open a wave for it.
- **value.js:** none.

---

## E-1 · Speculation Rules vs SPA prefetch — re-confirm KILL/N-A
- **2026 grounding** — Speculation Rules API targets **document URLs** → "makes sense for
  MPAs rather than SPAs; for an SPA, use your framework's prefetch/prerender API" (MDN /
  web.dev, this audit). It composes with bf-cache for cross-document nav.
- **kf** — the demo is a **hash-routed SPA** (`createWebHashHistory`, per the sibling
  `r-modern-web-2026.md` §6 / E `r-cwv-perf` A-7). E.W4 S5 shipped the SPA-correct lever:
  **Vite hover-warmup** (scene dock targets warm the route chunk's dynamic-import on
  pointer-enter) — explicitly "not Speculation Rules." This is the **correct** SPA choice;
  Speculation Rules has no document-navigation surface here.
- **disposition** — **KILL / N-A** (re-confirm; structurally inapplicable to a hash SPA).
  The bf-cache eligibility (A-4) is the cross-document half, already clean.

---

## C. The lighthouse honest-withhold — re-assessed for F: KEEP (do not "fix")

- **state** — `scripts/proof-lighthouse-mobile.mjs` is **honest-by-construction**
  (`:21-39`): in a shared/contended sandbox, Lighthouse's 4× CPU throttle layered under
  host contention systematically inflates the absolute scores, so the numbers are
  reproducible-but-not-comparable to the CI baseline. The gate therefore RECORDS-WITHHELD
  with an explicit reason and exits 0 off-CI, and **hard-asserts the per-scene B-baseline
  ceilings in CI** (`KF_REQUIRE_LH=1`, `:63`). A `--probe` flag prints sandbox numbers
  without asserting (`:62`). The per-scene ceilings are the B after-prod MOBILE figures used
  as no-regression floors (`:66-75`).
- **re-assessment** — This is **exactly right** and must NOT be "resolved" in F. The
  §Mandate forbids asserting an unmeasured win; the sandbox cannot produce a comparable
  measurement; the gate refuses to fabricate one. The honest disposition is to **KEEP** the
  withhold as authored. The real perf proof lives where it can be measured: the CI runner
  (`KF_REQUIRE_LH=1`) + the `bench/playwright.bench.ts` >50ms-LoAF gate (`window.__kfLoaf`,
  the 2nd LoAF consumer). F adds no obligation here.
- **disposition** — **RECORD / KEEP**. The honest-withhold is a feature, not a debt. Do not
  manufacture a "make lighthouse pass locally" change — that would be the workaround the
  Mandate forbids. (If a future tranche gains a calibrated runner, it runs the existing
  gate unchanged; the instrument is already authored.)

---

## D. Summary table

| # | Surface | Finding | Baseline (live) | Disposition |
|---|---|---|---|---|
| A-1 | demo | B-1 font-CLS — Capsize `@font-face` landed (W11 S5) | widely avail | **ALREADY-SOTA** |
| A-2 | demo | B-2 content-visibility:hidden Monaco cache landed + inert-hardened (W11/W4) | newly 2025-09 | **ALREADY-SOTA** |
| A-3 | demo | B-3 scene-loop pause, all 4 scenes (W11 S6) | widely avail | **ALREADY-SOTA** |
| A-4 | engine/demo | yieldToMain · LoAF · bf-cache · CRP · code-split — re-confirmed | mixed | **ALREADY-SOTA** |
| B-1 | demo | `content-visibility:auto` — above-the-fold precondition absent | newly 2025-09 | **RECORD** (re-confirm N-A) |
| B-2 | demo | `contentvisibilityautostatechange` scroll-out pause — no surface | newly 2025-09 | **KILL/RECORD** |
| B-3 | engine | `postTask('background')` for compile — yield already covers INP | limited (no Safari) | **BOOK** (re-confirm) |
| B-4 | demo | `fetchpriority=high` bootstrap (BOOK) · forced-reflow audit (RECORD) | broad / — | **BOOK / RECORD** |
| New-1 | — | INP threshold unchanged (200ms); "tighter" claims are SEO noise | — | **RECORD** |
| New-2 | engine | `scheduler.yield` no priority arg; yield-before-paint nuance — engine correct | limited | **RECORD** (no change) |
| New-3 | demo | `contain-intrinsic-size` absent on `content-visibility:hidden` pane | — | **RECORD** (reasoned exemption) |
| E-1 | demo | Speculation Rules MPA-only; SPA hover-warmup is correct | — | **KILL/N-A** (re-confirm) |
| C | infra | lighthouse honest-withhold | — | **RECORD/KEEP** (do not "fix") |

**Net.** E's `r-cwv-perf` named a 3-item FOLD-E CWV cluster + 4 BOOKs; **E.W11/W4 shipped
the entire cluster** — font-CLS fallback, content-visibility:hidden Monaco cache (inert-
hardened), and the all-four-scenes background pause — each idiomatic, feature-detected, and
gated. The four BOOKs re-assess to **RECORD/KILL/BOOK** with the 2026 catalog confirming
their deferral (content-visibility:auto is the guide's above-the-fold anti-pattern here;
postTask is redundant against the landed yield; Speculation Rules is MPA-only). The 2026
frontier adds **no new biting gap**: the INP threshold is unchanged, `scheduler.yield`'s
priority-inheritance + the yield-before-paint nuance both confirm the engine's existing
choices, and the one descriptor omission (New-3) is a reasoned exemption. **There is no
FOLD-in-F CWV/INP wave to manufacture — the post-E CWV/INP surface is exemplary.** F's
honest output here is this record + the lighthouse honest-withhold KEEP.

---

## value.js hand-off (inv-16)

**None surfaced this lane.** CWV/INP is a CRP/runtime/demo concern; value.js's parse-time
work is off the CWV hot path (E `r-cwv-perf` reached the same conclusion). The one
runtime-adjacent value.js item — the per-frame computed-unit resolver cost — is the
**Wave C** of `docs/tranches/E/valuejs-sota-handoff.md` (the D-3 win), already filed and
out of this CWV lane's scope. F adds no new value.js CWV surface.

---

## E. Re-runnable evidence

```sh
# B-cluster landed (the three E FOLD-E gaps, now closed):
grep -n "size-adjust\|ascent-override\|Instrument Serif Fallback" demo/@/styles/style.css   # → :80-87 + stack :40,:53
grep -n "content-visibility\|force-mount\|inert\|@supports" \
  demo/@/components/custom/animation-controls/controls/AnimationControls.vue                # → :52-58,:285-296
grep -rln "useSceneVisibilityPause" demo | grep -v dist   # → amiga, cube, easing, spring (+ the composable)

# bf-cache still clean (no regression since E):
grep -rn "beforeunload\|'unload'\|\"unload\"" src demo | grep -v dist | grep -v node_modules   # → 0

# content-visibility:auto has no above-the-fold surface (W4 S6 N-A confirmed):
grep -rn "content-visibility: auto\|contain-intrinsic-size" demo src | grep -v dist            # → 0 (only contain:style at CubeTarget:164)

# the gates that bite:
grep -n "first-paint\|cwv\|size-adjust" scripts/proof-demo-elevate.mjs                          # → :117-120 (font), :128-131 (cv)
grep -n "KF_REQUIRE_LH\|RECORDS-WITHHELD\|honest" scripts/proof-lighthouse-mobile.mjs           # → the honest-withhold

# Live SOTA (this audit):
#  scheduler.yield: no args, inherits context priority, front-of-queue continuation (MDN)
#  scheduler.yield does NOT guarantee paint-before-continuation → rAF+setTimeout for that case (web.dev optimize-inp)
#  INP good threshold unchanged at 200ms p75 (web.dev / corewebvitals.io)
#  content-visibility: Baseline 2025-09-15; auto is a below-the-fold-ONLY tool (modern-web-guidance defer-rendering-heavy-content)
#  Speculation Rules: MPA document-URL only; SPAs use framework prefetch (MDN)
```

**inv-16 compliance.** Only this file written. All findings keyframes.js/demo →
ALREADY-SOTA / RECORD / BOOK / KILL. No value.js CWV surface opened (re-affirm E).
**inv ε:** every code claim is `file:line`-grounded on `tranche-e-impl`; every SOTA/Baseline
claim is sourced to the live `modern-web-guidance@latest` guide string or a named 2026
web.dev/MDN source at this audit. Verified, not asserted.
```
