# E audit — modern-web lane (the `modern-web-guidance` comparison)

The user's E mandate: compare keyframes.js' core primitives + the last
tranche-set items against `developer.chrome.com/docs/modern-web-guidance`, and
`npx modern-web-guidance@latest install`. This lane runs that install, digests
the installed guidance into a concrete platform checklist, and compares it
against the live tree — separating the **ENGINE** (the published library, which
the post-D audit found EXEMPLARY — leave it) from the **DEMO** (the E.W4
opportunities). Every row is `file:line`-grounded + verifiable (`grep` / `wc` /
the captured lighthouse JSON), **verified not asserted** — inv ε.

The constraints hold throughout: **no legacy / no workaround**; idiomatic +
gestalt; **isomorphic** (pixels unchanged unless highly befitting + named);
KISS; **inv-16** (E writes only keyframes.js — every glass-ui-owned gap is
booked **OUT**, never patched in the demo). E's content is **net-NEW** findings,
not folded debt: D terminated every keyframes-owned deferral (the ledger is
clean, zero KFE), so this lane introduces genuinely-fresh modern-web items.

All findings land in **E.W4** (performance + modern-web alignment) unless tagged
otherwise. Line numbers are the live state at audit (branch `tranche-d-impl`).

---

## 0. The install — what `modern-web-guidance` shipped

`cd /Users/mkbabb/Programming/keyframes.js && npx --yes modern-web-guidance@latest install`
ran **non-interactively** (it auto-detected the Claude-Code agent) and reported:

- **Source**: `https://github.com/GoogleChrome/modern-web-guidance.git` (cloned).
- **Found 2 skills · selected 1**: `modern-web-guidance`. **71 agents** bundled.
- **Installed to**: `.agents/skills/modern-web-guidance/` (universal install for
  Codex/Cursor/Zed/Amp/Antigravity +12 more; **symlinked** for Claude Code).
- **Risk assessment**: Gen=Safe · Socket=0 alerts · Snyk=Med Risk.
- It is a **search/retrieve skill**, not a passive doc dump:
  `SKILL.md:33-76` documents `npx modern-web-guidance@latest {search,list,retrieve}`
  — an agent queries a use-case, gets a guide `id`, retrieves the markdown. The
  guidance corpus lives on disk under `guides/{css,html,performance,security,`
  `accessibility,css-layout,user-experience,forms,passkeys,privacy,webmcp,`
  `built-in-ai}/` (**137 guide files** under `guides/`; 138 incl `SKILL.md` —
  `find … -type f | wc -l`).

**Verification (`proof:mwg-installed`).** `test -d`
`.agents/skills/modern-web-guidance/guides` ∧ `wc -l < SKILL.md` > 0 ∧ the
category index files (`guides/css/css.md`, `guides/html/html.md`,
`guides/performance/performance.md`, `guides/security/security.md`,
`guides/accessibility/accessibility.md`) all exist. Bite: a failed/partial
clone leaves the `guides/` tree absent → the test reds. The install is
idempotent (re-running re-clones into the same path).

> **inv-16 note.** The skill installs under the repo's `.agents/` (tooling, not
> source). It is a dev-environment artifact — E authors no library/demo source
> from it; it informs the E.W4 spec. The `.agents/` path is gitignore-candidate
> housekeeping for E.W4/W6 to decide (it is agent tooling, not a build input).

---

## 1. The checklist (digested from the installed guidance)

The platform recommendations across the mandated axes, each with its guide
source. This is the instrument the per-item comparison (§2-§4) scores against.

| # | Axis | Recommendation | Guide source (installed) |
|---|---|---|---|
| C1 | Perf/INP | Break long main-thread tasks with `scheduler.yield()` + `setTimeout`/`MessageChannel` fallback; 50ms slice rule (`<50` sync · `50-250` slice · `>250` Worker) | `performance/break-up-long-tasks.md`, `performance/performance.md:84-129` |
| C2 | Perf/LCP | LCP element in raw HTML, `fetchpriority="high"`, preload CSS-bg LCP, never `loading=lazy` above-fold | `performance/performance.md:48-82`, `html.md:130-196` |
| C3 | Perf/render | `content-visibility:auto` + `contain-intrinsic-size` on **off-screen** heavy blocks; `contain:layout style paint` to isolate widgets | `performance/defer-rendering-heavy-content.md`, `performance/performance.md:147-182`, `css.md:439-473` |
| C4 | Perf/fonts | Preload critical fonts (`crossorigin`); non-blocking load for non-critical; subset; `preconnect` font origins | `performance/performance.md:286-311` |
| C5 | Perf/next-nav | Speculation Rules (`<script type=speculationrules>`) prefetch/prerender on hover (`eagerness`); **MPA only — DO NOT use on SPAs** | `performance/improve-next-page-load-performance.md:113` |
| C6 | Perf/hover-preview | `interestfor` Interest Invokers (`interest`/`loseinterest`, `:interest-target`) — declarative hover/focus previews | `user-experience/interest-triggered-action-previews.md` |
| H1 | HTML/overlays | Native `<dialog>` (`.showModal()`, `closedby="any"`, `::backdrop`, `<form method=dialog>`) for modals; Popover API (`popover` attr, `popovertarget`) for non-modal | `html.md:198-253`, `user-experience/declarative-dialog-popover-control.md` |
| H2 | HTML/commands | Invoker Commands (`commandfor`/`command`) — declarative open/close, no JS listener | `user-experience/declarative-dialog-popover-control.md:1-61` |
| H3 | HTML/semantics | `lang`, viewport meta, single `<h1>`, landmarks (`<main>`/`<nav>`/`<header>`), `<button>` vs `<a>`, `defer`/`type=module` scripts | `html.md:13-71`, `html.md:130-145` |
| CSS1 | CSS/`:has()` | `:has()` to style parents on child state instead of JS class-toggling | `css.md:64-69` |
| CSS2 | CSS/container | `@container`/`cqw`-`cqi` for component-driven responsive layout | `css.md:303-307` |
| CSS3 | CSS/dvh | Dynamic viewport units (`dvh`/`dvw`) over `vh`/`vw` to survive mobile-UI chrome | `css.md:303-307` |
| CSS4 | CSS/color | `color-mix()` / gradients in `oklab`/`oklch` (not `srgb`); `light-dark()`; `color-scheme` | `css.md:236-261`, `css.md:347-382` |
| CSS5 | CSS/transitions | Animate `opacity`/`transform`/individual transforms (compositor); `@starting-style`+`allow-discrete` for `display`/dialog; scroll-driven (`animation-timeline`) over JS | `css.md:433-473` |
| CSS6 | CSS/easing | `linear()` for physics (spring/bounce); store as `--token`; fallback to `cubic-bezier` | `user-experience/physics-based-easing.md` |
| CSS7 | CSS/a11y-motion | `prefers-reduced-motion` per-case (NOT a global `0.01ms`); View-Transition `animation:none` under PRM | `css.md:475-503`, `user-experience/same-document-transitions.md:150-159` |
| UX1 | UX/view-transitions | `document.startViewTransition()` + `view-transition-name` for SPA view-swaps; route focus after `finished`; PRM-gate | `user-experience/same-document-transitions.md` |
| A11Y1 | A11y | Landmarks + `<h1>` outline; `:focus-visible`; 24×24 touch targets; native-over-ARIA | `accessibility/accessibility.md`, `css.md:206-219` |
| SEC1 | Security/CSP | `script-src` nonce/hash, `base-uri 'none'`, report-only → enforce; `frame-ancestors`; HSTS/`X-Content-Type-Options`/`Referrer-Policy` | `security/security.md` |
| SEC2 | Security/sinks | Avoid `innerHTML`/`eval`/`document.write` with untrusted input; `textContent`/Sanitizer/Trusted-Types | `security/security.md:60-77` |

---

## 2. ENGINE comparison — the published library (mostly ALIGNED — leave)

The post-D audit found the engine EXEMPLARY; this lane confirms it against the
guidance and finds **zero engine GAPs**. The engine is the *reference
implementation* of several of these recommendations — it is the published
surface (inv-16 lets E touch it only for E.W5 BOOK housekeeping, and even there
measure-first). **No engine row routes to E.W4.**

| # | Item | Status | Evidence (file:line) | Disposition |
|---|---|---|---|---|
| E-1 | **C1** INP / `scheduler.yield` | **ALIGNED** | `internal/scheduler.ts:39-50` — `yieldToMain()` probes native `scheduler.yield` LIVE per call, caches a `MessageChannel`→`setTimeout(0)` fallback (the guide's exact ladder, `break-up-long-tasks.md:49-58`). Driven by `group.ts:4,57` to slice a large group's per-frame composite. SSR-safe. | LEAVE — reference impl. |
| E-2 | **CSS7** reduced-motion | **ALIGNED** | `internal/reduced-motion.ts:25-37` — ONE SSR-safe `prefersReducedMotion()` gate (`window.matchMedia("(prefers-reduced-motion: reduce)")`), unifying the formerly per-stepper copies; `withReducedMotion(snap,run)` unifies the *response*. Consumed by `smooth.ts:1,84`, `group.ts:3,465`, `numeric.ts:87`, `Animation.play`. **Per-case snap, never the anti-pattern global `0.01ms`** the guide forbids (`css.md:479`). | LEAVE — reference impl. |
| E-3 | **CSS5** WAAPI compositor delegation | **ALIGNED** | `waapi.ts:11-94` — `isWAAPIEligible()` delegates to compositor-thread WAAPI only when faithful (DOM targets, uniform timing, faithful CSS easing, no color-lerp); else rAF runs the true curve. This *is* the guide's "keep animation on the compositor thread" discipline, with a correctness gate the guide doesn't even demand. | LEAVE — exceeds guidance. |
| E-4 | **CSS6** `linear()` physics easing | **ALIGNED** | `springLinearStops.ts:1-40` — exports `springLinearStops()`, sampling a spring response into a CSS `linear()` string (`physics-based-easing.md`'s exact recommendation: generate stops, store as token). The demo's spring scene + glass-ui (ASK-2) both consume it. | LEAVE — and keep stable (the OUT enabler). |
| E-5 | **UX1**/ScrollTimeline | **ALIGNED (by-design JS)** | `timeline.ts:163-178` — `ScrollTimeline` with injectable `getScrollY`/`getViewportHeight`. The guide's `animation-timeline:scroll()` is CSS-only for *DOM* scroll effects; keyframes.js animates **arbitrary objects** (not just DOM), so a JS-driven timeline is the correct primitive, not a gap. The native CSS path was recorded as an **ARCH KILL** in D (do not re-litigate). | LEAVE — ARCH-recorded. |
| E-6 | **SEC2** dangerous DOM sinks | **ALIGNED** | `grep -rn "innerHTML\|outerHTML\|document.write\|eval(" src/` over the library = **0** in hot/parse paths (the engine builds `AnimationFrame[]`, never injects HTML). | LEAVE — clean. |

**Engine verdict.** The library is the reference implementation of C1, CSS6,
CSS7, and CSS5-compositor; ALIGNED on the rest; zero GAP. **E barely touches the
published library** — exactly the plan's premise. (E.W5's two BOOK items —
`tryParseCache` eviction measure-first, managed-pause doc — are unrelated to
modern-web and are recorded in the engine lane, not here.)

---

## 3. DEMO comparison — the E.W4 opportunities

The demo is where the modern-web opportunities live. Each GAP is a **net-NEW**
finding (not folded debt), `file:line`-grounded, with the modern-web guide it
maps to and a falsifiable E.W4 instrument. **inv-16**: every glass-ui-owned item
is **OUT** (booked, never demo-patched).

### 3.1 The lighthouse baseline — the real opportunity is MOBILE

Two baselines exist and they MUST NOT be conflated. (i) The **B after-prod
baseline** (`docs/tranches/B/audit/lighthouse/after-prod/_summary.json` — 12
reports, 6 scenes × {mobile,desktop}) is the historical cold/panel-closed
ground truth B captured. (ii) The **E open-panel capture**
(`audit/lighthouse/_perf-summary.json` — the product AS USED, panel open, the
editing rAF loop LIVE) is the axis E.W4's gate (`proof:lighthouse-mobile`)
actually traces and asserts against. The two disagree on the heavy scenes (the
open-panel loop is the worst case), so **the gate cites the E-capture numbers,
not these B figures.**

**Baseline (i) — B after-prod** (`docs/tranches/B/audit/lighthouse/after-prod/`
`_summary.json`), tabulated (`performance` / `lcp` / `tbt`):

| scene | mobile perf | mobile LCP | mobile TBT | desktop perf | desktop LCP |
|---|---|---|---|---|---|
| home | 63 | 6.9 s | 90 ms | 95 | 1.3 s |
| cube | 64 | 6.8 s | 70 ms | 96 | 1.2 s |
| amiga | **49** | **10.2 s** | **420 ms** | 89 | 1.8 s |
| square | 62 | 7.2 s | 160 ms | 94 | 1.4 s |
| easing | 61 | 7.3 s | 170 ms | 95 | 1.4 s |
| spring | **52** | **28.5 s** | 180 ms | 63 | 4.8 s |

**Baseline (ii) — E open-panel capture** (`audit/lighthouse/_perf-summary.json`,
mobile axis — the gate's authority), tabulated (`performance` / `lcp`):

| scene | mobile perf | mobile LCP |
|---|---|---|
| home | 64 | 6.9 s |
| cube | 65 | 6.6 s |
| amiga | **48** | **9.9 s** |
| square | 62 | 6.7 s |
| easing | 62 | 6.8 s |
| spring | **52** | **28.1 s** |

**The honest correction to the E plan premise.** The plan framed the target as
"B baseline Perf 89-96 → target ≥95" — that is the **desktop** figure. The
evidence says the desktop surface is already near-target (89-96, one outlier:
spring-desktop 63), but the **mobile axis is the real opportunity**: on the
E open-panel capture (the gate's axis) Perf 48-65, LCP 6.6-9.9 s, and
**spring-mobile a pathological LCP 28.1 s**. E.W4 must measure + target **mobile
per scene** against the E open-panel capture, not desktop and not the B
after-prod baseline. (Best-Practices is a clean **100** on every report — the
security/best-practices axis is already satisfied for this static deploy; see
§4.)

| # | Item | Status | Evidence | Guide | Wave |
|---|---|---|---|---|---|
| D-1 | **C2** LCP — mobile LCP 6.6-28.1 s (E open-panel capture) | **GAP** | baseline (ii) above; the LCP element is JS-mounted (Vue `#app`, `app/index.html:55`) not raw HTML — the guide's `html.md:54` "avoid relying on JS to mount the LCP element" | C2 | E.W4 |
| D-2 | **C1** INP — heavy editing UI | **GAP (demo)** | `CSSCodeEditor.vue` (monaco) + `KeyframesEditor.vue` parse/format on every edit; the demo has a LoAF observer (`app/loaf-observer.ts`) but **no `scheduler.yield`/`postTask` in demo code** (`grep "scheduler\|yieldToMain\|postTask" demo/**/*.{vue,ts}` = the observer comment only). The engine yields; the demo's own heavy parse/format doesn't. | C1 | E.W4 |
| D-3 | **C3** `content-visibility` off-screen scenes | **GAP** | `grep "content-visibility\|contain-intrinsic-size" demo/**/*.{vue,css}` (excl dist) = **0** (the only `contain` hit is a lone `contain: style` at `CubeTarget.vue:164` — a paint-isolation hint, not the off-screen skip). The off-screen scene host (`App.vue:135` wrapper `<div>`) + the long keyframe/timeline lists are unmounted-or-painted, never `content-visibility`-skipped. **Measure-first** — guide warns it hurts on small pages (`defer-rendering-heavy-content.md:21`). | C3 | E.W4 |
| D-4 | **C4** font-loading | **PARTIAL → tighten** | `app/index.html:18-32` ALREADY does the non-blocking pattern (`media=print` + `onload="this.media='all'"`) for Instrument Serif, `<noscript>` fallback, and `preconnect` to `fonts.googleapis.com`/`gstatic.com` (`:16-17`, crossorigin). Fira Code is self-hosted via glass-ui. **Remaining**: no `rel=preload as=font crossorigin` for the above-the-fold heading face; verify subset. | C4 | E.W4 |
| D-5 | **UX1**/CSS5 View Transitions for scene-swap | **N-A-with-reason (nuanced)** | `App.vue:108-145` — the scene-swap is a **deliberately engine-dogfooded** `SpringProgress` cross-dissolve on a SIBLING wrapper, NOT a `<Transition>` (B.W3 proved a `<Transition>`/`<KeepAlive>` around the keyed async `<Suspense>` shipped a BLANK viewport — the async loader never fired). The View-Transitions API operates on **snapshots** and the guide forbids transitioning elements with active animations (`same-document-transitions.md:147`); it would also re-introduce the exact wrapper the async-loader fix removed. The engine-dogfooded fade is the inv-ζ "demo eats its own engine" posture. **Recorded-withheld** unless E.W4 proves it composes with `<Suspense>` async-load AND PRM AND beats the spring fade — else KEEP the dogfood. | UX1 | E.W4 (record) |
| D-6 | **C5** Speculation Rules (link-preload-on-hover) | **N-A-with-reason** | The demo is a **single-page Vue app** (`app/index.html:55` one `#app`, client-routed scenes via `switchScene`, `App.vue:11`). The guide is explicit: **"DO NOT use speculation rules on SPAs"** (`improve-next-page-load-performance.md:113`) — they fire on document navigation, which an SPA never does. The closest fit is **route-chunk prefetch on hover** (Vite dynamic-import warmup), NOT Speculation Rules. | C5 | E.W4 (chunk-prefetch variant) |
| D-7 | **C6** Interest Invokers (`interestfor`) | **N-A (limited avail)** | `interest-triggered-action-previews.md:50` — Chrome/Edge 142 only, no Firefox/Safari, needs a polyfill. For a demo, not worth the polyfill weight; the existing reka-ui tooltips (glass-ui) already cover hover-preview. | C6 | record (N-A) |

### 3.2 CSS / HTML — mostly ALIGNED, two named tightenings

| # | Item | Status | Evidence | Wave |
|---|---|---|---|---|
| D-8 | **CSS2** container queries | **ALIGNED** | `style.css:242` `container-type: inline-size`; `AnimationVisualizer.vue:30` `translate-x-[calc(100cqw_-_100%)]` — the demo dogfoods `cqw` exactly as the guide recommends (`css.md:303-307`). | — |
| D-9 | **CSS3** dvh over vh | **PARTIAL → reconcile (E.W3)** | `style.css` has **11** `dvh`/`100vh` hits; the E.W3 styling lane already owns the `--panel-max-h: 60vh` ↔ work-area `dvh` inconsistency (the guide's exact CSS3 rule). Modern-web confirms E.W3's call; no separate E.W4 work. | E.W3 (confirmed) |
| D-10 | **CSS1** `:has()` | **ALIGNED** | `:has(`/`color-mix(`/`@starting-style` present in **9** demo source files (`EasingTarget.vue`, `SquareScene.vue`, `SpringTarget.vue`, `playback-button.css`, …) — the demo already styles parents on child-state via `:has()` rather than JS class-toggling (`css.md:64`). | — |
| D-11 | **CSS4** `color-mix`/oklab | **ALIGNED** | `color-mix(` present in the §D-10 set; the engine interpolates color in **oklab by default** (CLAUDE.md "perceptual oklab default") — both demo CSS and engine honor the guide's "in oklab/oklch, not srgb" (`css.md:347-352`). | — |
| D-12 | **H3** HTML semantics | **ALIGNED** | `app/index.html` — `lang="en"` (`:2`), viewport meta (`:6`), `<meta name=description>`, canonical, robots, `type=module` real-file entry (`:55`, with a documented anti-tree-shake rationale), pre-paint dark-mode sync (`:35-48`, FOUC fix). Strong baseline. | — |
| D-13 | **H1**/H2 native `<dialog>`/Popover/Invoker | **OUT (glass-ui-owned)** | The demo's dialogs/popovers (`KeyboardShortcutsModal.vue`, `CSSPasteDialog.vue`, `SharePopover.vue`, `CommandPalette.vue`) import `Dialog`/`Popover` from `@mkbabb/glass-ui` (`KeyboardShortcutsModal.vue:47`). glass-ui's `DialogContent.vue:5-11` wraps **reka-ui** `DialogContent`/`DialogPortal`, whose `DialogContentImpl.js:77` renders a `Primitive` (`as` default `div`) with `role:"dialog"` + JS `FocusScope`/`DismissableLayer` — **NOT** the native `<dialog>` element or the Popover API. **The "verify reka-ui rides native `<dialog>`/Popover" check resolves NEGATIVE.** Per inv-16 this is glass-ui's seam, NOT a demo patch — booked OUT. (Migrating reka-ui → native `<dialog>`/`popover` is a glass-ui/reka-ui decision; the keyframes demo only consumes the published component.) | **OUT** |

---

## 4. Security — the static-deploy reality (CSP)

| # | Item | Status | Evidence | Disposition |
|---|---|---|---|---|
| D-14 | **SEC1** CSP / security headers | **N-A-with-reason (static GH-Pages)** | The demo deploys to **GitHub Pages** (`vite.config` `mode === "gh-pages"`, `base:"./"`, `outDir dist/gh-pages`) — a **static host with no server to set response headers**, so the guide's header-based CSP/HSTS/`X-Frame-Options`/`Referrer-Policy`/COOP/CORP (`security/security.md` Phase 1/3) are **not deployable** here. The only available surface is a `<meta http-equiv="Content-Security-Policy">` tag — `grep "Content-Security-Policy" demo/` = **0** (none present). Lighthouse **Best-Practices = 100 on all 12 reports** confirms no security finding the tooling flags for a static page. | record; OPTIONAL meta-CSP in E.W4 |
| D-15 | **SEC2** dangerous sinks (demo) | **ALIGNED** | The demo is Vue `<script setup>` (templates auto-escape); no untrusted-`innerHTML` parse path. The CSS-paste flow routes through the engine parser (`parseCSSAnimationKeyframes`), not a DOM sink. A confirming `grep "v-html\|innerHTML\|eval(" demo/**/*.{vue,ts}` sweep is the E.W4 instrument. | record (verify) |

**Security verdict.** For a static GH-Pages SPA, the header-CSP track is N-A; the
honest E.W4 action is an **optional** meta-tag CSP (a hardening nicety, not a
header-equivalent) plus a `v-html`/`innerHTML` sweep — both LOW-value given
Best-Practices already scores 100. Not a forced E.W4 line item.

---

## 5. Last-tranche (A→D) items vs the guidance

A spot-check that the prior tranches' work is consistent with the modern-web
guidance (not contradicted by it):

| Tranche item | Guide | Consistency |
|---|---|---|
| C/D engine `scheduler.yield` INP relief (B.W4 §4) | C1 | **CONFIRMED** — the guide's exact pattern (`internal/scheduler.ts`). |
| C/D unified `prefersReducedMotion` gate | CSS7 | **CONFIRMED** — per-case snap, not the forbidden global `0.01ms`. |
| B non-blocking Instrument-Serif font load (`index.html:18-32`) | C4 | **CONFIRMED** — the guide's `media=print`+`onload` deferral, `preconnect`+crossorigin. |
| B critical-CSS inline + pre-paint dark-mode (`index.html:35-58`) | Perf CRP | **CONFIRMED** — inline critical CSS, no `@import`, real-file module entry. |
| C inv-ζ dogfood (demo eats its engine: scene-swap spring, `cqw` visualizer) | CSS2/CSS6/UX1 | **CONFIRMED** — `cqw` container-query + `linear()`/`SpringProgress` are the guide's recommended primitives; the spring cross-dissolve is *why* View-Transitions is N-A here (D-5). |
| D engine WAAPI maximal delegation | CSS5 compositor | **CONFIRMED** — exceeds the guidance (adds a faithfulness gate). |

No prior-tranche item is contradicted by the guidance. The two-tranche
`scheduler.yield` claim (B→C) is now **independently corroborated** by the
installed `break-up-long-tasks.md`.

---

## 6. Disposition summary

| # | Item | Status | Layer | Evidence | Wave |
|---|---|---|---|---|---|
| E-1..E-6 | scheduler / PRM / WAAPI / linear() / ScrollTimeline / sinks | **ALIGNED** | ENGINE | `internal/scheduler.ts`, `reduced-motion.ts`, `waapi.ts`, `springLinearStops.ts`, `timeline.ts` | LEAVE |
| D-1 | mobile LCP 6.6-28.1 s | **GAP** | DEMO | E `_perf-summary.json` (open-panel mobile axis) | E.W4 |
| D-2 | demo INP (heavy editor, no `scheduler.yield`) | **GAP** | DEMO | `loaf-observer.ts`; grep=0 in demo | E.W4 |
| D-3 | `content-visibility` off-screen scenes | **GAP (measure-first)** | DEMO | `content-visibility`/`contain-intrinsic-size` grep=0 | E.W4 |
| D-4 | font preload tighten | **PARTIAL** | DEMO | `index.html:18-32` | E.W4 |
| D-5 | View-Transitions scene-swap | **N-A-w-reason / record-withheld** | DEMO | `App.vue:108-145` | E.W4 (record) |
| D-6 | Speculation Rules | **N-A (SPA)** → chunk-prefetch variant | DEMO | `improve-next-page-load-performance.md:113` | E.W4 |
| D-7 | Interest Invokers | **N-A (limited avail)** | DEMO | guide browser-support | record |
| D-8,D-10,D-11,D-12 | container-query / `:has()` / color-mix / HTML semantics | **ALIGNED** | DEMO | `style.css:242`, 9-file set, `index.html` | — |
| D-9 | dvh ↔ vh reconcile | **PARTIAL** | DEMO | `style.css` 11 hits | **E.W3** (confirmed) |
| D-13 | native `<dialog>`/Popover (reka-ui = role-div + JS focus-trap) | **OUT (glass-ui)** | DEMO | `DialogContentImpl.js:77` | OUT |
| D-14 | CSP / headers | **N-A (static GH-Pages)** | DEMO | `vite.config` gh-pages; BP=100 | E.W4 (optional meta) |
| D-15 | demo DOM sinks | **ALIGNED** | DEMO | Vue auto-escape | record (verify) |

**Net.** ENGINE: 6 ALIGNED, 0 GAP — leave (the published library is the
reference impl). DEMO: **3 real GAPs** (D-1 mobile-LCP, D-2 demo-INP, D-3
content-visibility) + 1 PARTIAL (D-4 fonts) → **E.W4**; 1 styling reconcile
(D-9) → **E.W3** (modern-web confirms the existing call); 3 N-A-with-reason
(D-5 view-transitions vs the dogfood/async-loader constraint, D-6 SPA-excludes-
speculation-rules, D-7 limited-avail); 1 **OUT** (D-13 reka-ui dialogs are
glass-ui's seam — inv-16); 1 N-A static-deploy (D-14 CSP). Every row is
`file:line` or captured-JSON grounded — verified, not asserted. **The headline
E.W4 instrument is per-scene MOBILE lighthouse** (not desktop), traced against
the E open-panel capture (`audit/lighthouse/_perf-summary.json`), with the
spring-mobile 28.1 s LCP as the sharpest target.

---

## 7. The E.W4 falsifiable gate (`proof:modern-web`)

A re-runnable checklist instrument the E.W4 spec lands, asserting:

1. **`proof:mwg-installed`** — `.agents/skills/modern-web-guidance/guides/` on
   disk (the install reproduces). Bite: absent tree → reds.
2. **`proof:lighthouse-mobile`** — `npm run gh-pages` + lighthouse **mobile**
   per scene; assert each scene's mobile Performance ≥ a declared per-scene
   ceiling (a real delta over the B baseline: home/cube/square/easing 61-64,
   amiga 49, spring 52), and spring-mobile LCP < a declared bound (the 28.1 s
   regression terminated). Bite: a perf regression below the recorded
   baseline → reds. Deterministic via the captured `_summary.json` diff.
3. **`proof:demo-yield`** — the heavy demo parse/format path yields
   (`grep "scheduler.yield\|yieldToMain\|postTask"` in the demo edit path > 0,
   OR a LoAF-trace assertion that no demo edit task exceeds 50 ms). Bite:
   reintroduce a blocking parse → the LoAF assertion reds.
4. **`proof:content-vis`** (IF D-3 lands measure-first positive) — the
   off-screen scene host carries `content-visibility:auto`+`contain-intrinsic-size`;
   assert paired (never `content-visibility` without the size, the guide's
   CLS-mandatory pairing). Bite: drop the intrinsic-size → reds.
5. **The checklist table (§1)** is re-scored each E.W4 close — every row
   ALIGNED / GAP-closed / N-A-with-recorded-reason, no row left un-dispositioned.

Verified not asserted: every cite is a live `file:line` on `tranche-d-impl` or a
field in the captured B lighthouse JSON; every gate is a re-runnable instrument
with a stated bite. The ENGINE stays untouched (it is the reference impl); the
DEMO carries the three real GAPs to E.W4; the glass-ui-owned dialog seam stays
OUT (inv-16).
