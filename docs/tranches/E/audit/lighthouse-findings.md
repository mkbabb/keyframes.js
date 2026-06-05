# E audit — lighthouse lane (the post-D performance baseline)

This is the EVIDENCE lane for E.W4 (performance + modern-web alignment): the real
Lighthouse baseline of the demo **as it stands at the close of Tranche D**,
captured fresh against a from-source build (`npm run gh-pages`, `dist/gh-pages`,
2026-06-05) and driven by the SAME shared `scripts/lib/demo-driver.mjs` the
checked-in `scripts/lighthouse-gate.mjs` uses. Every score below is a re-runnable
measurement, not an assertion — the harness + the raw `*.json` reports sit beside
this file under `docs/tranches/E/audit/lighthouse/`, and every row names the file
it came from.

The headline is honest and bimodal: **the COLD-LOAD surface holds Tranche B's
baseline exactly** (desktop Perf 88–96, the B band), while **the OPEN-PANEL
editing state — the product as actually used — is the real E.W4 target**, where a
live driven rAF loop under Lighthouse's CPU throttle exposes a Long-Task / INP
problem the cold pass cannot see. E.W4 optimizes the editing surface, not the
already-good cold paint.

## How this was measured (two distinct, deliberate axes)

Lighthouse scores the page it traces. The demo has two materially different
states, and conflating them is the trap B's `_summary.json` half-fell into, so E
captures BOTH, explicitly:

| Axis | What it traces | Harness | Comparable to |
|---|---|---|---|
| **COLD** | Lighthouse's own clean navigation — panel CLOSED, no seeded `localStorage`, no driven animation. The first-paint surface. | `npx lighthouse <url> --only-categories=performance [--preset=desktop]` against a served `dist/gh-pages` (raw CLI, its own headless chromium). Reports: `lighthouse/cli-*.json` / `cli-*.report.json`. | B `after-prod/_summary.json` (B also measured the fresh, panel-closed load). |
| **OPEN-PANEL** | The product AS USED — first animation selected, controls pane open, the editing rAF loop LIVE during the trace (`disableStorageReset: true` keeps the seeded state). The worst case. | `lighthouse/perf-capture.mjs` (full `performance` category over the shared `openControlsPanel` driver). Reports: `lighthouse/<scene>-<form>.json` + `_perf-summary.json`. | NET-NEW (B never scored the open-panel state for Performance — only for a11y/SEO). |

Tooling provenance (so the run reproduces): `lighthouse` resolved from the
keyframes repo root (`npm i --no-save lighthouse` — NOT added to `package.json`,
inv-16); chromium resolved from the sibling `value.js/node_modules/playwright-core`
(`KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`) — the only on-disk
playwright in the workspace, launch-verified (chromium 148.0.7778.96). Viewports:
`mobile 375×667 @2×`, `desktop 1440×900 @1×` — the gate's own `VIEWPORTS`.

Re-run, exactly:

```sh
npm run gh-pages    # build dist/gh-pages

# a11y/SEO gate (checked-in) — the OPEN-panel a11y baseline
KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
KF_LIGHTHOUSE_DIR=$(pwd) node scripts/lighthouse-gate.mjs

# OPEN-PANEL performance axis (this lane's harness)
KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
KF_LIGHTHOUSE_DIR=$(pwd) \
  node docs/tranches/E/audit/lighthouse/perf-capture.mjs

# COLD performance axis (raw CLI, served dist on :8099)
CHROME_PATH="$(node -e "console.log(require('/Users/mkbabb/Programming/value.js/node_modules/playwright-core').chromium.executablePath())")" \
  npx lighthouse "http://127.0.0.1:8099/#/cube" \
  --only-categories=performance --preset=desktop --quiet \
  --chrome-flags="--headless=new --no-sandbox"
```

---

## 1 — Accessibility + SEO + Best-Practices (the checked-in gate, post-D)

`scripts/lighthouse-gate.mjs` drives every scene × viewport into its OPEN-panel
editing state and scores a11y + SEO. The post-D run (full log: this lane's
console; reproducible above) **PASSES** and shows a categorical improvement over
B's `after-prod`:

| Scene | A11y (post-D) | A11y (B after-prod) | SEO (post-D) | SEO (B) | Held a11y audits (post-D) |
|---|---|---|---|---|---|
| home/mobile   | **100** | 98 | **100** | 82 | — |
| home/desktop  | **100** | 98 | **100** | 82 | — |
| cube/mobile   | **100** | 92 | **100** | 75 | — |
| cube/desktop  | **100** | 92 | **100** | 75 | — |
| amiga/mobile  | 86 | 79 | **100** | 75 | button-name, label, aria-input-field-name |
| amiga/desktop | 86 | 79 | **100** | 75 | button-name, label, aria-input-field-name |
| square/mobile | 86 | **75** | **100** | 75 | button-name, label, aria-input-field-name |
| square/desktop| 86 | **75** | **100** | 75 | button-name, label, aria-input-field-name |
| easing/mobile | 85 | 78 | **100** | 75 | button-name, label, aria-input-field-name |
| easing/desktop| 85 | 78 | **100** | 75 | button-name, label, aria-input-field-name |
| spring/mobile | **100** | 98 | **100** | 82 | — |
| spring/desktop| **100** | 98 | **100** | 82 | — |

Source: `scripts/lighthouse-gate.mjs` PASS run (2026-06-05), each row vs
`docs/tranches/B/audit/lighthouse/after-prod/_summary.json`.

**Reading it:**
- **SEO = 100 everywhere** (B was 75–82). The B SEO gap closed completely in C/D.
- **`image-alt` and `landmark-one-main` no longer fire** (B's universal a11y fails) —
  C/D's `<main>` landmark + alt closes landed. `color-contrast` (B's square fail)
  is also gone (the `.settled-badge` fix held).
- **The only remaining a11y holds are the `bucket-glassui` triad**
  (`button-name`/`label`/`aria-input-field-name`) — ONE glass-ui root cause
  (`LabeledField` label-association, ASK-3). inv-16: glass-ui-owned, **NOT an E
  finding** — E keeps the enabler stable; the gate empties this bucket the moment
  glass-ui ASK-3 adopts. **E has no demo-owned a11y debt.**
- **Best-Practices = 100** on every scene (unchanged from B; not re-tabled).

**E.W4 a11y/SEO disposition: NOTHING TO DO** — the demo-owned a11y/SEO surface is
green; the residual is OUT (glass-ui). This lane's perf findings below are E.W4's
actual work.

---

## 2 — Performance: COLD load (comparable to B `after-prod`)

The clean first-paint surface. Desktop runs use `--preset=desktop`; mobile is the
default (mobile emulation + 4× CPU throttle).

| Scene/form | Perf (cold, post-D) | Perf (B after-prod) | FCP | LCP | TBT | CLS | SI | Report |
|---|---|---|---|---|---|---|---|---|
| cube/desktop   | **96** | 96 | 0.9 s | 1.3 s | 0 ms | 0 | 0.9 s | `cli-cube-desktop.report.json` |
| easing/desktop | **94** | 95 | 1.1 s | 1.4 s | 0 ms | 0 | 1.1 s | `cli-easing-desktop.report.json` |
| amiga/desktop  | **88** | 89 | 1.2 s | 1.9 s | 60 ms | 0 | 1.2 s | `cli-amiga-desktop.json` |
| spring/desktop | **62** | 63 | 2.7 s | 4.8 s | 20 ms | 0.007 | 2.7 s | `cli-spring-desktop.json` |
| cube/mobile    | **65** | 64 | 4.8 s | 6.6 s | 80 ms | 0 | 4.8 s | `cli-cube-mobile.json` |
| easing/mobile  | **59** | 61 | 5.4 s | 7.3 s | 190 ms | 0.005 | 5.4 s | `cli-easing-mobile.json` |

Each post-D cell is within ±2 of B's `after-prod/_summary.json` — **statistical
noise.** The COLD surface is UNCHANGED across the whole D tranche: D refactored the
demo (decomposition, localization, brittleness) and transposed the engine without
moving the first-paint number. That is the correct outcome — D was correctness +
localization, not bytes.

**The cold outlier is `spring` (62 desktop / a slow mobile too).** Its dominant
opportunity dwarfs every other scene's:

| Scene/form | unused-javascript | total-byte-weight | Report |
|---|---|---|---|
| cube/desktop   | 332 KiB (~320 ms) | (passes) | `cli-cube-desktop.report.json` |
| easing/desktop | 306 KiB (~290 ms) | (passes) | `cli-easing-desktop.report.json` |
| amiga/desktop  | 522 KiB | (passes) | `cli-amiga-desktop.json` |
| **spring/desktop** | **2,664 KiB** | **5,249 KiB total** | `cli-spring-desktop.json` |

`unused-javascript` breakdown on `spring/desktop` (from `cli-spring-desktop.json`):

| Chunk | Total | Unused |
|---|---|---|
| `vendor-monaco-*.js` | 4,042 KiB | **2,351 KiB** |
| `vendor-reka-ui-*.js` | 332 KiB | 166 KiB |
| `index-*.js` | 245 KiB | 89 KiB |
| `engine-*.js` | 122 KiB | 59 KiB |

**This is the single biggest cold lever, and it is named: Monaco.** The bundle's
heaviest assets (verified, `ls -lS dist/gh-pages/assets`): `ts.worker 6.9 MB`,
`vendor-monaco 4.1 MB`, `css.worker 1.0 MB`, `vendor-highlight 926 KiB`,
`html.worker 720 KiB`, `vendor-three 533 KiB`. CSSCodeEditor.vue:14 does
`import * as monaco from "monaco-editor"` — a **static, top-level import** that
pulls all 4 MB of Monaco (+ its workers, lines 26–27) into the eager module
graph. The spring scene loads it without rendering the CSS editor first, so
nearly all of it is unused at paint. **The scenes are already route-lazy**
(`demo/app/scenes.ts:27–60`, `defineAsyncComponent(() => import(...))`) — but
Monaco's static import in CSSCodeEditor short-circuits that win.

## 3 — Performance: OPEN-PANEL editing state (the NET-NEW E.W4 signal)

The product as a user holds it (first animation selected, controls pane open, the
editing rAF loop LIVE during the trace). Source: `_perf-summary.json`.

| Scene/form | Perf | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| home/mobile    | 64 | 4.8 s | 6.9 s | 80 ms | 0.017 | 4.8 s |
| home/desktop   | 56 | 4.8 s | 6.5 s | 80 ms | 0 | 4.8 s |
| cube/mobile    | 65 | 4.8 s | 6.6 s | 80 ms | 0 | 4.8 s |
| cube/desktop   | 56 | 4.8 s | 6.6 s | 80 ms | 0 | 4.8 s |
| **amiga/mobile**  | **48** | 5.0 s | 9.9 s | **570 ms** | 0.008 | 5.0 s |
| **amiga/desktop** | **25** | 6.4 s | 10.5 s | **144,760 ms** ⚠ | 0 | 6.4 s |
| square/mobile  | 62 | 5.0 s | 6.7 s | 170 ms | 0 | 5.0 s |
| square/desktop | 52 | 5.0 s | 6.7 s | 160 ms | 0 | 5.0 s |
| easing/mobile  | 62 | 5.0 s | 6.8 s | 160 ms | 0.008 | 5.0 s |
| easing/desktop | 52 | 5.1 s | 6.8 s | 160 ms | 0 | 5.1 s |
| **spring/mobile** | 52 | 5.4 s | **28.1 s** ⚠ | 280 ms | 0.016 | 8.4 s |
| **spring/desktop**| 48 | 15.6 s | **28.1 s** ⚠ | 210 ms | 0.007 | 15.6 s |

**Reading it — two things are happening, and only one is a real defect:**

1. **The systematic open-panel drop (desktop 52–56 vs cold 88–96)** is the live
   editing rAF loop running under Lighthouse's throttle, NOT a first-paint
   regression. Desktop here scores LOWER than mobile (56 vs 64–65) — the inverse
   of normal — because `--preset=desktop` was NOT used for the open-panel axis
   (it shares the gate's emulation), so both forms throttle, and the desktop's
   larger surface drives more per-frame work. **This is the INP / Long-Task /
   editing-cost signal E.W4 must relieve** — it is invisible to the cold pass and
   net-new to E.

2. **The ⚠ outliers are measurement artifacts of an unthrottled render loop, not
   product bugs** — but they POINT at the real lever:
   - **amiga/desktop TBT = 144,760 ms** — the Three.js render loop (`AmigaScene`)
     ran continuously during the trace with `disableStorageReset` holding the
     scene live; Lighthouse attributes every frame's main-thread time to blocking.
     The signal: **the amiga scene's animation does not yield / pause off the
     active tab** — a `content-visibility` / `IntersectionObserver`-pause / WAAPI
     hand-off candidate.
   - **spring LCP = 28.1 s** — the spring scene's heavy Monaco-bearing chunk
     (the 2,664 KiB cold finding) pushes the largest paint far out once the editor
     mounts. Same root cause as §2's Monaco lever.

**Recurring open-panel opportunities (count across the 12 runs, `_perf-summary.json`):**

| Opportunity | Hits | E.W4 reading |
|---|---|---|
| `interactive` (TTI) | 12/12 | downstream of JS parse/exec — the Monaco/bundle weight |
| `largest-contentful-paint` | 12/12 | paint blocked by the same JS |
| `first-contentful-paint` | 12/12 | same |
| `speed-index` | 12/12 | same |
| `unused-javascript` | 12/12 | **the lever** — Monaco eager import |
| `max-potential-fid` | 12/12 | the editing-loop Long-Task signal |
| `cache-insight` (1,001 KiB) | 11/12 | **measurement caveat** — local static server sends no `Cache-Control` (`ttl=0`); GitHub Pages serves real cache headers on the live deploy. NOT a demo defect; do not chase. |
| `network-dependency-tree-insight` | 8/12 | the critical-request chain (Monaco workers) |
| `bf-cache` | (cube) | reports "Internal error" under headless — a Lighthouse/CDP caveat, not actionable here |

---

## 4 — Modern-web cross-checks (verified, the input to E.W4's checklist)

- **`content-visibility`: 0 uses in demo source** (`grep -rn content-visibility demo --include=*.css --include=*.vue`, excluding `/dist/` = 0). The plan's "`content-visibility` for off-screen scenes" lever is genuinely net-new and unclaimed.
- **Scenes already route-lazy** — `demo/app/scenes.ts:27–60` is `defineAsyncComponent(() => import(...))` for all five scenes. The lazy-loading win exists; Monaco's static import (CSSCodeEditor.vue:14) is what undermines it. E.W4's code-split target is Monaco, NOT the scenes.
- **Monaco eager import** — CSSCodeEditor.vue:14 `import * as monaco from "monaco-editor"` + :26–27 worker imports. Defer behind a `defineAsyncComponent` / dynamic `import()` so the editor (and its 4 MB + workers) loads only when the keyframes editor mounts, not on first paint of every scene.
- **Best-Practices = 100, CLS ≈ 0** everywhere — no layout-shift or
  console-error debt to chase; E.W4 is purely a JS-weight + render-loop play.

---

## 5 — Prioritized optimization levers for E.W4

In descending impact, each grounded above:

1. **Defer Monaco (HIGH — the dominant lever).** `import * as monaco` at
   CSSCodeEditor.vue:14 (+ workers :26–27) eagerly graphs 4 MB. Make the editor a
   dynamic import / async component so Monaco loads on editor-mount, not on every
   scene's first paint. Directly attacks `unused-javascript` (332 KiB typical,
   **2,664 KiB on spring**), `interactive`, `largest-contentful-paint`,
   `first-contentful-paint` — the 12/12 recurring opportunities — and the spring
   LCP=28.1 s outlier. Expected: spring cold Perf 62 → the cube/easing band (94–96);
   mobile FCP/LCP relief across the board.
2. **Pause/yield off-screen + off-tab render loops (HIGH for amiga, MED elsewhere).**
   The amiga/desktop open-panel TBT=144,760 ms is the Three.js loop never yielding.
   Gate scene animation on `IntersectionObserver` / `document.visibilityState` /
   `content-visibility: auto` so an off-screen or background scene stops driving the
   main thread. Attacks `max-potential-fid` (12/12), TBT, and the INP/Long-Task
   signal in the editing state.
3. **`content-visibility: auto` on off-screen scene shells (MED).** 0 uses today;
   the inactive route's DOM still costs layout/paint. A net-new, low-risk lever for
   the editing-state TTI/SI on the busier scenes (easing/square/spring).
4. **Verify reka-ui dialogs/popovers ride native `<dialog>`/Popover API (MED).**
   `vendor-reka-ui 332 KiB` shows 166 KiB unused on spring; confirm the demo's
   dialogs/popovers use the modern primitives (no hand-rolled focus-trap/overlay
   JS to retire). Part of E.W4's `proof:modern-web` checklist.
5. **Link-preload-on-hover for scene routes (LOW–MED).** The scenes are async
   chunks; a hover-preload removes the navigation stall when switching scenes.
   Cheap, modern, no behavior change.
6. **NON-LEVERS (recorded so E.W4 does not chase phantoms):**
   - `cache-insight` (1,001 KiB) and `ttl=0` — a **local-server artifact** (no
     `Cache-Control` from the audit's static server); GitHub Pages serves real
     cache headers. Do NOT add a service-worker or fight this number.
   - `bf-cache` "Internal error" — a headless-CDP Lighthouse quirk, not a demo bug.
   - The COLD desktop scores (88–96) — already at/above the ≥95 target on
     cube/easing; **no cold-paint work is warranted** beyond the Monaco defer,
     which lifts spring into the band as a side effect.

## Bottom line for E.W4

The demo's **cold paint is already at Tranche B's baseline and needs no work** —
D held it while transposing everything beneath it. The genuine, net-new
performance surface is **(a) Monaco's eager 4 MB import** (one code-split lands the
biggest win, lifts the spring outlier, and improves mobile FCP/LCP everywhere) and
**(b) the render loops that don't yield off-screen/off-tab** (the amiga TBT
artifact is the canary). a11y/SEO/Best-Practices are green and demo-owned-clean;
the only a11y hold is glass-ui's (OUT, inv-16). E.W4 is a focused JS-weight +
render-loop tranche, exactly as the plan framed it — not a broad perf rescue.
