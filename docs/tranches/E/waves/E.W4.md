# E.W4 — Performance + modern-web alignment

**Phase:** IMPL · **Class:** MINOR (demo-side; non-breaking) · **Scope:**
`demo/` (the published library is OUT — the post-D audit found the engine
EXEMPLARY) · **Parallel to:** E.W5 (engine BOOK) · **Runs after:** the demo
waves E.W1/W2/W3 settle, so lighthouse measures the FINAL surface · **Gated on:**
keyframes' own green CI (inv-27).

The demo's cold paint is already at Tranche B's baseline (D held it while
transposing everything beneath it). The genuine, net-NEW performance surface is
**(a) Monaco's eager 4 MB import** — one code-split lands the biggest win,
lifts the spring outlier, and improves mobile FCP/LCP everywhere — and **(b) the
render loops that don't yield off-screen / off-tab** (the amiga TBT artifact is
the canary). a11y / SEO / Best-Practices are green and demo-owned-clean (the only
a11y hold is glass-ui's, OUT, inv-16). E.W4 is a focused JS-weight + render-loop
+ modern-web-alignment tranche — exactly as the plan framed it, **not** a broad
perf rescue. Evidence: `audit/lighthouse-findings.md` (the two-axis baseline),
`audit/modern-web-findings.md` (the `modern-web-guidance` comparison). Every
finding below is `file:line`-grounded + verifiable (`grep` / `wc` / the captured
lighthouse JSON), **verified not asserted** — inv ε.

The constraints hold throughout: **no legacy / no workaround**; idiomatic +
gestalt; architectural transpositions where they buy elegance/simplicity/perf;
**isomorphic** (pixels unchanged unless highly befitting + named); KISS;
**inv-16** (E writes only keyframes.js — every glass-ui-owned gap is booked
**OUT**, never demo-patched). E's content is **net-NEW**: D terminated every
keyframes-owned deferral (the ledger is clean, zero KFE), so this wave carries
fresh modern-web findings, not folded debt.

---

## § 0 — Setup: `npx modern-web-guidance@latest install`

The wave's first act (already run in the E.W0 evidence lane, recorded here as the
reproducible setup step):

```sh
cd /Users/mkbabb/Programming/keyframes.js
npx --yes modern-web-guidance@latest install
```

It runs **non-interactively** (auto-detects the Claude-Code agent), clones
`github.com/GoogleChrome/modern-web-guidance`, and installs the
`modern-web-guidance` search/retrieve skill under
`.agents/skills/modern-web-guidance/` (137 guide files under `guides/`, symlinked
for Claude Code). It is a **query skill**, not a doc dump:
`npx modern-web-guidance@latest {search,list,retrieve}` against the on-disk
corpus (`audit/modern-web-findings.md` §0).

**inv-16 note.** The skill installs under `.agents/` — **tooling, not source**.
E authors no library/demo source FROM it; it informs this spec. The `.agents/`
path is a gitignore-candidate housekeeping decision (it is agent tooling, not a
build input) carried to E.W6's close ledger, not a demo edit.

---

## § The state, verified (not asserted)

The live facts (the Evidence lanes captured these; this wave re-grounds the ones
it acts on, line-confirmed on `tranche-d-impl`):

1. **The COLD-load surface is UNCHANGED across D** — desktop Perf 88–96 (the B
   band), within ±2 of `docs/tranches/B/audit/lighthouse/after-prod/_summary.json`
   per scene. D refactored + transposed without moving the first-paint number;
   the correct outcome (`audit/lighthouse-findings.md` §2). **No cold-paint work
   is warranted** beyond the Monaco defer (which lifts the spring outlier as a
   side effect).

2. **Monaco is the dominant lever, and it is named.** `CSSCodeEditor.vue:14`
   (`demo/@/components/custom/animation-controls/keyframes/CSSCodeEditor.vue`)
   does `import * as monaco from "monaco-editor"` — a **static, top-level
   import** — plus the worker imports at `:26-27`. This eagerly graphs all 4 MB
   of Monaco (`vendor-monaco 4.1 MB` + `ts.worker 6.9 MB` + `css.worker 1.0 MB` +
   `html.worker 720 KiB`, verified `ls -lS dist/gh-pages/assets`). On the spring
   scene — which loads it WITHOUT rendering the CSS editor first — `unused-javascript`
   is **2,664 KiB** (`cli-spring-desktop.json`: `vendor-monaco` alone is 2,351 KiB
   unused at paint). The scenes are ALREADY route-lazy
   (`demo/app/scenes.ts:27-60`, `defineAsyncComponent(() => import(...))`), but
   Monaco's static import short-circuits that win.

3. **The render loops don't yield off-screen / off-tab.** `AmigaScene.vue:102`
   runs a bare `requestAnimationFrame(animate)` Three.js loop with no
   `visibilitychange` / `IntersectionObserver` gate (`grep` over the file for
   those = the `requestAnimationFrame` line only). Under the OPEN-PANEL trace the
   loop never yields → `amiga/desktop TBT = 144,760 ms` (a measurement artifact
   of an unthrottled render loop, but it POINTS at the real lever:
   `audit/lighthouse-findings.md` §3).

4. **`content-visibility` is unused — 0 hits in demo source.**
   `grep -rn "content-visibility\|contain-intrinsic-size" demo --include=*.css
   --include=*.vue` (excl `/dist/`) = **0** (the lone `contain: style` at
   `CubeTarget.vue:164` is a paint-isolation hint, not the off-screen skip). The
   off-screen scene host (`App.vue:136`, the `<div class="h-full w-full">` sibling
   wrapper hosting the keyed `<Suspense>` at `:137`) is painted, never
   `content-visibility`-skipped. The plan's "off-screen scenes" lever is
   genuinely net-new and unclaimed (`audit/modern-web-findings.md` D-3).

5. **Font-loading is PARTIAL-good — one tighten remains.** `app/index.html:16-29`
   already does the non-blocking pattern (`preconnect` to `fonts.googleapis.com`/
   `gstatic.com` `:16-17` crossorigin; Instrument Serif via `media="print"` +
   `onload="this.media='all'"` `:24-26`; `<noscript>` fallback `:29`). Fira Code is
   self-hosted via glass-ui. **Remaining**: no `rel=preload as=font crossorigin`
   for the above-the-fold heading face (`audit/modern-web-findings.md` D-4).

6. **The reka-ui dialogs/popovers do NOT ride native `<dialog>`/Popover.** The
   demo's modals/popovers (`KeyboardShortcutsModal.vue`, `CSSPasteDialog.vue`,
   `SharePopover.vue`, `CommandPalette.vue`) import `Dialog`/`Popover` from
   `@mkbabb/glass-ui`, which wraps **reka-ui** `DialogContent`/`DialogPortal`,
   whose `DialogContentImpl.js:77` renders a `Primitive` (`as` default `div`) with
   `role:"dialog"` + a JS `FocusScope`/`DismissableLayer` — **NOT** the native
   `<dialog>` element or the Popover API (`audit/modern-web-findings.md` D-13).
   **The "verify reka-ui rides native `<dialog>`/Popover" check resolves
   NEGATIVE — and is OUT** (glass-ui/reka-ui's seam, inv-16; the demo only
   consumes the published component).

7. **The demo's heavy edit path does NOT yield.** `CSSCodeEditor.vue` (Monaco) +
   `KeyframesEditor.vue` parse/format on every edit; the demo has a LoAF observer
   (`app/loaf-observer.ts`) but **no `scheduler.yield`/`postTask` in demo code**
   (`grep "scheduler\|yieldToMain\|postTask" demo/**/*.{vue,ts}` = the observer's
   comment only). The ENGINE yields (`internal/scheduler.ts`, the reference impl);
   the demo's own heavy parse/format doesn't (`audit/modern-web-findings.md` D-2).

8. **The scene-swap is a deliberately engine-dogfooded `SpringProgress`
   cross-dissolve, NOT a `<Transition>`.** `App.vue:108-145` — the fade drives
   `sceneSwapStyle` on a SIBLING wrapper `<div>` (`:136`), with the bare
   `<Suspense :key>` (`:137`) untouched. The inline comment (`:108-135`) records
   WHY: B.W3 proved a `<Transition>`/`<KeepAlive>` around the keyed `<Suspense>`
   shipped a BLANK viewport (the async loader never fired). This is the inv-ζ
   "demo eats its own engine" posture. View-Transitions would re-introduce that
   exact wrapper AND the guide forbids transitioning elements with active
   animations (`same-document-transitions.md:147`) — so View-Transitions is
   **N-A-with-reason / recorded-withheld** here (`audit/modern-web-findings.md`
   D-5).

The wave's job: land the two real levers (Monaco defer · render-loop yield),
add the net-new off-screen `content-visibility` (measure-first), tighten the one
font preload, and ALIGN the modern-web checklist honestly — each closed by a
re-runnable instrument that bites.

---

## § Goal

**What lands:**
- **Monaco deferred** off the eager module graph — the editor (and its 4 MB +
  workers) loads only when the keyframes editor mounts, not on every scene's
  first paint. The route-lazy win (already present) stops being short-circuited.
- **The render loops yield off-screen / off-tab** — an off-screen or background
  scene stops driving the main thread (`IntersectionObserver` /
  `document.visibilityState` / `content-visibility: auto` gate).
- **`content-visibility: auto` + `contain-intrinsic-size`** on the off-screen
  scene shell — net-new, low-risk, MEASURE-FIRST (the guide warns it can hurt on
  small pages, `defer-rendering-heavy-content.md:21`); landed only if it measures
  a real win.
- **The font preload tightened** — `rel=preload as=font crossorigin` for the
  above-the-fold heading face (the one font GAP).
- **The demo's heavy edit path yields** — `scheduler.yield` / `postTask` (the
  engine's pattern, `internal/scheduler.ts`) on the demo's own parse/format, OR a
  LoAF assertion that no demo edit task exceeds 50 ms.
- **The modern-web checklist aligned + scored** — every row ALIGNED / GAP-closed /
  N-A-with-recorded-reason; the reka-ui-dialog seam booked OUT; the
  SPA-excludes-Speculation-Rules + Interest-Invokers-limited-avail rows recorded;
  the View-Transitions row recorded-withheld (keep the dogfood unless it provably
  beats it AND composes with `<Suspense>` async-load AND PRM).
- **The `proof:modern-web` instrument** — a checked-in, re-runnable checklist that
  asserts the adopted items (`file`/`grep` checks) + a per-scene MOBILE lighthouse
  Performance target. Each clause BITES.

**Why:** the cold paint is already good — the honest opportunity is the editing
surface as the product is actually USED (the OPEN-PANEL axis the cold pass cannot
see) and the modern-web items that REMOVE hand-rolled work. Deferring Monaco is
the single biggest JS-weight win (it attacks the 12/12 recurring opportunities —
`unused-javascript`, `interactive`, `largest-contentful-paint`,
`first-contentful-paint` — and the spring LCP=28.1 s outlier in one move). Yielding
the render loop converts a main-thread hog into a well-behaved off-screen pause.
`content-visibility` is the guide's exact off-screen lever, net-new here. Each is
robustness + speed with zero happy-path behaviour change — exactly the no-legacy,
KISS, isomorphic posture.

---

## § Scope

### S1 — Defer Monaco (the dominant lever) — lighthouse-findings §5.1, modern-web D-2

**WHAT:** the static `import * as monaco from "monaco-editor"` at
`CSSCodeEditor.vue:14` (+ the worker imports `:26-27`) moves off the eager module
graph. The editor becomes a **dynamic import / `defineAsyncComponent`** so Monaco
(and its 4 MB + workers) loads only when the keyframes editor actually mounts —
NOT on every scene's first paint. Options (the impl picks the idiomatic one):

- Wrap `CSSCodeEditor.vue` in a `defineAsyncComponent(() => import("./CSSCodeEditor.vue"))`
  at the consumer (the keyframes editor), so the chunk + Monaco graph splits out
  behind the editor-mount boundary; OR
- Defer the Monaco namespace inside the component via a dynamic `import()` at
  mount (the workers already use Vite `?worker` imports, which are chunk
  boundaries — the namespace import at `:14` is the eager edge to break).

The route-lazy scenes (`scenes.ts:27-60`) stay as they are — they are NOT the
target; Monaco's static import is what undermined them.

**WHY:** the single biggest cold + open-panel lever, named (§State 2):
`unused-javascript` 2,664 KiB on spring, `vendor-monaco` 2,351 KiB unused at
paint. Deferring it attacks the 12/12 recurring opportunities AND the spring
LCP=28.1 s outlier in one move. Expected: spring cold Perf 62 → the cube/easing
band (94–96); mobile FCP/LCP relief across the board (`audit/lighthouse-findings.md`
§5 lever 1). Isomorphic: the editor renders identically once mounted — only the
EAGER load of a not-yet-visible editor disappears.

### S2 — Yield / pause off-screen + off-tab render loops — lighthouse-findings §5.2

**WHAT:** gate the scene animation loops so an off-screen or background scene
stops driving the main thread. The canary is `AmigaScene.vue:102`'s bare
`requestAnimationFrame(animate)` (§State 3); the gate is one of (impl picks the
idiomatic, vueuse-aligned form):

- **`document.visibilityState` / `useDocumentVisibility`** (vueuse) — pause the
  rAF loop when the tab is hidden (a background tab should not run a Three.js
  loop); resume on `visible`.
- **`IntersectionObserver` / `useIntersectionObserver`** (vueuse) — pause when the
  scene host is scrolled/swapped off-screen; resume on intersect.
- **`content-visibility: auto`** on the off-screen scene shell (S3) gives the
  browser the layout/paint skip; the rAF gate gives the JS skip — the two pair.

Prefer the vueuse composable (converging with E.W2's listener/observer gestalt)
over a hand-rolled listener.

**WHY:** the amiga/desktop TBT=144,760 ms is the Three.js loop never yielding
(§State 3). A background or off-screen scene driving the main thread is wasted
CPU + battery; gating it is free (the happy path — the active, visible scene —
is byte-identical). Attacks `max-potential-fid` (12/12), TBT, and the
INP/Long-Task signal in the editing state (`audit/lighthouse-findings.md` §5
lever 2).

### S3 — `content-visibility: auto` on the off-screen scene shell (MEASURE-FIRST) — lighthouse-findings §5.3, modern-web D-3

**WHAT:** the off-screen scene host (`App.vue:136`, the sibling wrapper `<div>`)
+ the long keyframe/timeline lists are candidates for
`content-visibility: auto` + a paired `contain-intrinsic-size` (the guide's
CLS-mandatory pairing — `content-visibility` without the size reflows on reveal).
0 uses today (§State 4).

**MEASURE-FIRST — the gate is a lighthouse delta, not an assertion.** S3 lands
ONLY if the captured per-scene MOBILE lighthouse shows a real, reproducible
TTI/SI reduction on the busier scenes (easing/square/spring) WITHOUT a CLS
regression. The guide explicitly warns `content-visibility` can HURT on small
pages (`defer-rendering-heavy-content.md:21`); if the measured delta is within
noise OR introduces CLS, S3 is **withheld with the measurement recorded** (the
D-3 measure-first discipline — a perf claim is proven or it is not shipped).

**WHY:** the inactive route's DOM still costs layout/paint; `content-visibility:
auto` lets the browser skip rendering off-screen content until it scrolls into
view — the guide's exact off-screen lever, net-new here. Low-risk WHEN paired
with `contain-intrinsic-size` (no CLS) AND measured (no small-page regression).

### S4 — Tighten font-loading + yield the heavy edit path — modern-web D-4, D-2

**WHAT:** two named tightenings:

- **Font preload (D-4).** Add `rel=preload as=font crossorigin` for the
  above-the-fold heading face (the Instrument Serif display face used in the
  brand heading), alongside the existing non-blocking pattern at
  `index.html:16-29`. Verify the subset (the heading uses a small glyph set). The
  existing `media="print"`+`onload` deferral stays — preload + non-blocking-load
  is the guide's full C4 pattern (`performance.md:286-311`).
- **Heavy-edit yield (D-2).** The demo's own parse/format on every edit
  (`KeyframesEditor.vue`, the Monaco onChange path) yields the main thread via
  `scheduler.yield` / `postTask` — REUSING the engine's exact ladder
  (`internal/scheduler.ts:39-50`, `yieldToMain()`), NOT a new hand-rolled one
  (no-legacy, gestalt). OR, if the parse is already sub-50 ms after S1's Monaco
  defer, a LoAF assertion that no demo edit task exceeds 50 ms suffices (the cheaper
  close). The engine yields; the demo's heavy path should too.

**WHY:** the heading face is the LCP element on the home/scene surface; preloading
it removes the font-swap stall (C4). The heavy edit path is the demo's own INP
signal (the engine yields, the demo doesn't — §State 7); reusing
`yieldToMain()` is the gestalt move (one yield ladder in the codebase, not two).

### S5 — Link-preload-on-hover for scene routes (LOW–MED) — lighthouse-findings §5.5, modern-web D-6

**WHAT:** the scenes are async chunks (`scenes.ts:27-60`); a **route-chunk
prefetch on hover** warms the dynamic-import on pointer-enter of a scene
nav/dock target, so switching scenes has no navigation stall. NOTE: the guide's
**Speculation Rules are N-A** — the demo is a single-page Vue app
(`improve-next-page-load-performance.md:113`: "DO NOT use speculation rules on
SPAs"; they fire on document navigation, which an SPA never does). The fit is the
**Vite dynamic-import warmup** (call the async component's loader on hover), NOT
`<script type=speculationrules>` (`audit/modern-web-findings.md` D-6).

**WHY:** cheap, modern, zero behaviour change — removes the chunk-fetch stall on
scene-swap. Correctly scoped to the SPA-appropriate primitive (chunk-prefetch),
not the MPA-only Speculation Rules the guide excludes.

### S6 — The modern-web checklist aligned + the N-A rows recorded — modern-web §3, §6

**WHAT:** re-score the §1 checklist table from `audit/modern-web-findings.md`,
every row dispositioned:

- **ALIGNED (verify, no work):** container queries (D-8, `style.css:242`
  `container-type: inline-size`; `AnimationVisualizer.vue:30`
  `translate-x-[calc(100cqw_-_100%)]`); `:has()` (D-10, 9-file set); `color-mix`/
  oklab (D-11, the engine's oklab default + demo `color-mix`); HTML semantics
  (D-12, `index.html` `lang`/viewport/`type=module`/pre-paint dark-mode).
- **OUT (glass-ui, inv-16 — never demo-patched):** native `<dialog>`/Popover/
  Invoker (D-13 — reka-ui = role-div + JS focus-trap, `DialogContentImpl.js:77`).
  The "verify reka-ui rides native" check resolves NEGATIVE; the migration is
  glass-ui/reka-ui's decision; the demo consumes the published component.
- **N-A-with-recorded-reason:** View-Transitions (D-5 — recorded-WITHHELD: keep
  the engine-dogfooded spring fade unless E.W4 proves View-Transitions composes
  with `<Suspense>` async-load AND PRM AND beats the spring fade); Speculation
  Rules (D-6 — SPA-excluded → S5's chunk-prefetch variant); Interest Invokers
  (D-7 — Chrome/Edge 142 only, no polyfill worth the weight for a demo; reka-ui
  tooltips already cover hover-preview); CSP/headers (D-14 — static GH-Pages has
  no server to set headers; the only surface is an OPTIONAL `<meta>`-CSP, LOW-value
  given Best-Practices = 100).
- **dvh ↔ vh reconcile (D-9):** OWNED BY E.W3 (modern-web confirms the existing
  call; no separate E.W4 work — recorded as cross-wave so the two do not fork).

**WHY:** the checklist is the falsifiable form of "modern-web aligned" — every
row resolves to ALIGNED / GAP-closed / N-A-with-reason, none left
un-dispositioned. The OUT + N-A rows are recorded WITH their reason (inv-16 for
the glass-ui seam; the SPA/browser-support reasons for the N-A rows) so a future
reader does not re-litigate them — the D-discipline of recording a kill, not
dropping it.

### S7 — The `proof:modern-web` instrument — modern-web §7 (the falsifiable close)

**WHAT:** a checked-in, re-runnable instrument (`scripts/proof-modern-web.mjs`,
wired `npm run proof:modern-web`) that BITES on these clauses:

1. **`proof:mwg-installed`** — `.agents/skills/modern-web-guidance/guides/` on
   disk (the install reproduces idempotently). BITES: a failed/partial clone
   leaves the `guides/` tree absent → reds.
2. **`proof:monaco-deferred`** — Monaco is NOT on the eager graph:
   `grep -n "import \* as monaco" CSSCodeEditor.vue` resolves only inside a
   dynamic-import / async-component boundary (asserted by a bundle probe: the
   `vendor-monaco` chunk is NOT in the entry/initial graph of a non-editor scene's
   first paint — the `proof:boundary`-style entry-graph check applied to the demo
   build). BITES: re-introduce the top-level static import → the `vendor-monaco`
   chunk reappears in the initial graph → reds.
3. **`proof:lighthouse-mobile`** — `npm run gh-pages` + lighthouse **MOBILE** per
   scene; assert each scene's mobile Performance ≥ a declared per-scene ceiling
   (a real delta over the B baseline: home/cube/square/easing 61–64, amiga 49,
   spring 52 — `B/audit/lighthouse/after-prod/_summary.json`), AND spring-mobile
   LCP < a declared bound (the 28.1 s regression terminated by the Monaco defer).
   BITES: a perf regression below the recorded baseline → reds. Deterministic via
   the captured `_summary.json` diff.
4. **`proof:loop-yield`** — the off-screen/off-tab render loop pauses:
   `grep "useDocumentVisibility\|useIntersectionObserver\|visibilityState\|content-visibility"`
   in the scene-loop path > 0 (the bare `requestAnimationFrame` at
   `AmigaScene.vue:102` is gated). BITES: re-introduce an ungated background loop →
   reds.
5. **`proof:demo-yield`** — the heavy demo parse/format yields:
   `grep "scheduler.yield\|yieldToMain\|postTask"` in the demo edit path > 0, OR a
   LoAF-trace assertion that no demo edit task exceeds 50 ms. BITES: re-introduce a
   blocking parse → the LoAF assertion reds.
6. **`proof:content-vis`** (IF S3 lands measure-first positive) — the off-screen
   scene host carries `content-visibility:auto` PAIRED with
   `contain-intrinsic-size` (never one without the other — the guide's CLS-mandatory
   pairing). BITES: drop the intrinsic-size → reds.
7. **The checklist table (§S6)** is re-scored at close — every row ALIGNED /
   GAP-closed / N-A-with-recorded-reason, no row left un-dispositioned.

The instrument runs in CI's demo job; the lighthouse-mobile clause runs over a
fresh `npm run gh-pages` build via the shared `scripts/lib/demo-driver.mjs` the
checked-in `scripts/lighthouse-gate.mjs` already uses.

**WHY:** modern-web closure is only honest if a gate BITES on the regression's
return (inv ε). A bundle-graph probe is the falsifiable form of "Monaco is
deferred"; a per-scene MOBILE lighthouse delta is the falsifiable form of "the
perf target held"; a `grep` for the visibility/IO gate is the falsifiable form of
"the loop yields off-screen." Each reds on the exact regression this wave removes,
so "modern-web aligned" means what it says.

---

## § Hard gate (`proof:perf-budget` / `proof:modern-web` — inv μ · falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real grep / bundle
probe / lighthouse delta / LoAF trace, not an assertion). The clauses below are
inv μ's `proof:perf-budget` umbrella (`proof:lighthouse-mobile` + `proof:demo-yield`
+ `proof:content-vis`) plus `proof:modern-web` — the gate names E.md's §E-specific
invariants assign to this wave:

1. **`proof:mwg-installed`** PASSES — the guidance corpus is on disk
   (`.agents/skills/modern-web-guidance/guides/`). BITES: absent tree → reds.
2. **`proof:monaco-deferred`** PASSES — `vendor-monaco` is NOT in any non-editor
   scene's initial paint graph; the `import * as monaco` at `CSSCodeEditor.vue:14`
   resolves only behind the dynamic-import/async-component boundary. BITES:
   re-add the top-level static import → the chunk reappears in the initial graph.
3. **`proof:lighthouse-mobile`** PASSES — each scene's MOBILE Performance ≥ its
   declared per-scene ceiling (the real delta over the B baseline), AND
   spring-mobile LCP < the declared bound. BITES: a regression below the recorded
   baseline → reds. **This is the per-scene lighthouse TARGET gate the plan
   mandates** — calibrated to the MOBILE baseline (the honest opportunity), NOT
   the already-near-target desktop figure (`audit/modern-web-findings.md` §3.1).
4. **`proof:loop-yield`** PASSES — the scene render loop pauses off-tab/off-screen
   (`AmigaScene.vue:102`'s bare rAF gated). BITES: re-introduce an ungated
   background loop → reds.
5. **`proof:demo-yield`** PASSES — the heavy demo parse/format yields (the engine
   ladder reused), OR no demo edit task exceeds 50 ms (LoAF). BITES: a blocking
   parse → reds.
6. **`proof:content-vis`** PASSES IF S3 landed (measure-first positive) — the
   off-screen scene host carries `content-visibility:auto` + `contain-intrinsic-size`
   paired; OTHERWISE S3 is recorded-withheld with the measurement, and this clause
   is N-A (recorded). BITES (when active): drop the intrinsic-size → reds.
7. **The `proof:modern-web` checklist** PASSES — every §S6 row ALIGNED /
   GAP-closed / N-A-with-recorded-reason; the reka-ui-dialog seam OUT; the
   View-Transitions row recorded-withheld (or adopted only on its three-part
   proof). No row un-dispositioned.
8. **No regression, no new legacy.** The standing demo gates
   (`demo-smoke`/inv γ, `occlusion-gate`/inv δ, `lighthouse-gate`/a11y-SEO,
   `proof:dogfood`/inv ζ, `proof:boundary`/inv α) stay green; the engine
   (`proof:boundary` heavy/light edge) is UNTOUCHED (the library is the reference
   impl — E.W4 writes only `demo/`). The happy paths are byte-identical (only the
   eager-load + off-screen-loop + font-swap paths improve). No new hand-rolled
   listener (the loop gate is vueuse), no second yield ladder (the engine's is
   reused).

---

## § Folds

Retires (by finding id):
- **lighthouse-findings §5 lever 1** (Monaco eager 4 MB) — S1 + S7.2.
- **lighthouse-findings §5 lever 2** (off-screen/off-tab render loops) — S2 +
  S7.4.
- **lighthouse-findings §5 lever 3** + **modern-web D-3** (`content-visibility`
  off-screen, measure-first) — S3 + S7.6.
- **modern-web D-4** (font preload tighten) + **D-2** (demo-INP yield) — S4 +
  S7.5.
- **modern-web D-6** (Speculation Rules → SPA chunk-prefetch variant) — S5.
- **modern-web §1 checklist** (the whole table) — S6 + S7.7.

**Routed OUTWARD / RECORDED (not this wave):**
- **D-13 native `<dialog>`/Popover** — the reka-ui dialogs are glass-ui's seam
  (`DialogContentImpl.js:77` = role-div + JS focus-trap); migrating reka-ui →
  native is glass-ui/reka-ui's decision. **OUT** (inv-16) — the demo consumes the
  published component; E does not patch it.
- **D-9 dvh ↔ vh reconcile** — OWNED BY E.W3 (modern-web confirms the existing
  styling call; recorded cross-wave so the two do not fork the dvh reconcile).
- **D-5 View-Transitions for scene-swap** — RECORDED-WITHHELD: the engine-dogfooded
  `SpringProgress` cross-dissolve (`App.vue:108-145`) stays UNLESS E.W4 proves
  View-Transitions (a) composes with the bare `<Suspense>` async-loader (the B.W3
  blank-viewport re-break), (b) PRM-gates correctly, and (c) beats the spring
  fade. The guide forbids transitioning elements with active animations
  (`same-document-transitions.md:147`), so the bar is high. If unproven, KEEP the
  dogfood (inv-ζ).
- **D-7 Interest Invokers** — N-A (Chrome/Edge 142 only; the polyfill weight isn't
  worth it for a demo; reka-ui tooltips cover hover-preview). RECORDED.
- **D-14 CSP / security headers** — N-A for a static GH-Pages SPA (no server to
  set headers); an OPTIONAL `<meta>`-CSP is LOW-value given Best-Practices = 100.
  RECORDED; not a forced line item.
- **The a11y/SEO residual** — the only a11y hold is the `bucket-glassui` triad
  (`button-name`/`label`/`aria-input-field-name`, glass-ui's `LabeledField`
  ASK-3). **OUT** (inv-16); the gate empties this bucket the moment glass-ui
  adopts. E has NO demo-owned a11y/SEO debt (SEO = 100, Best-Practices = 100
  everywhere — `audit/lighthouse-findings.md` §1).

---

## § Design decisions

1. **Defer Monaco — don't rip it.** RESOLVED: Monaco IS the demo's CSS editor
   (the dogfood surface); the lever is to LOAD it lazily (behind editor-mount),
   not to remove or replace it. The scenes are already route-lazy; the fix is to
   stop Monaco's static `import * as monaco` (`CSSCodeEditor.vue:14`) from
   short-circuiting that lazy boundary. Trade-off: the first editor-open pays the
   Monaco load (a spinner / skeleton covers it); every non-editor scene's first
   paint stops paying it. The product spends the 4 MB exactly when the editor is
   wanted — KISS, isomorphic on the editor surface.

2. **Gate the loop off-screen/off-tab via vueuse, not a hand-rolled listener.**
   RESOLVED: the off-screen/off-tab pause is `useDocumentVisibility` /
   `useIntersectionObserver` (vueuse), converging with E.W2's listener/observer
   gestalt — NOT a new `addEventListener('visibilitychange')`. The happy path (the
   active visible scene) is byte-identical; only the background/off-screen case
   stops burning CPU. Trade-off: a tiny gate around the rAF loop — but it converts
   a main-thread hog into a well-behaved pause, and it reuses the demo's vueuse
   primitive instead of forking a listener.

3. **`content-visibility` is MEASURE-FIRST — the guide warns it can hurt.**
   RESOLVED: `content-visibility: auto` lands ONLY if the per-scene MOBILE
   lighthouse measures a real TTI/SI win WITHOUT a CLS regression (the guide:
   it can hurt on small pages, `defer-rendering-heavy-content.md:21`). Paired
   with `contain-intrinsic-size` (CLS-mandatory). If it doesn't measure, it is
   withheld with the measurement recorded (the D-3 discipline — a perf claim is
   proven or not shipped). No speculative perf.

4. **Reuse the engine's yield ladder, don't author a second.** RESOLVED: the
   demo's heavy-edit yield (S4) reuses `internal/scheduler.ts`'s `yieldToMain()`
   (the live `scheduler.yield` probe + cached fallback — the reference impl the
   guide recommends), NOT a new hand-rolled `scheduler.yield` in demo code. One
   yield ladder in the codebase (gestalt); the demo imports the engine's, or — if
   that crosses the light/heavy boundary — a thin demo-local re-use of the same
   primitive (the impl confirms the import path stays `proof:boundary`-clean).

5. **The lighthouse TARGET is MOBILE per-scene — the honest opportunity.**
   RESOLVED + HONEST (inv ε): the plan's "B baseline 89–96 → target ≥95" is the
   DESKTOP figure; the evidence says desktop is already near-target (89–96, one
   outlier spring-desktop 63), and the REAL opportunity is MOBILE (Perf 49–64,
   LCP 6.8–28.1 s, spring-mobile a pathological 28.1 s). The gate calibrates to
   the MOBILE baseline per scene (a real delta over B), with spring-mobile LCP as
   the sharpest target — not a flat ≥95 that the desktop already meets and the
   mobile can't (`audit/modern-web-findings.md` §3.1). The FINAL must not claim a
   flat ≥95; it claims the per-scene MOBILE delta the gate actually proves.

6. **View-Transitions stays RECORDED-WITHHELD — the dogfood is the gestalt.**
   RESOLVED: the engine-dogfooded `SpringProgress` cross-dissolve (`App.vue:108-145`)
   is the inv-ζ "demo eats its own engine" posture AND the workaround for B.W3's
   blank-viewport re-break (a `<Transition>` around the `<Suspense>` broke the
   async loader). View-Transitions would re-introduce that wrapper AND the guide
   forbids transitioning active-animation elements. The bar to ADOPT is the
   three-part proof (composes-with-Suspense + PRM + beats-the-fade); absent it,
   KEEP the dogfood. The no-workaround mandate cuts BOTH ways — replacing a
   working dogfood with an unproven API that re-breaks the loader IS the
   workaround to avoid.
