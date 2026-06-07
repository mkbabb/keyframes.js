# Tranche H Deep Audit — Lane `a-gate-blindspots`

**Charge:** WHY did the six green gates (`proof:idioms`, `proof:brittleness`,
`occlusion-gate`, `demo-smoke`, `lighthouse`, `proof:demo-usability`) NOT catch
D1–D11? Each defect → which gate SHOULD have caught it + the gate's blind spot.
Propose the new/extended falsifiable instruments H needs. Load-bearing for H's
gates.

**Method:** read all six gate scripts + the shared `scripts/lib/demo-driver.mjs`
manifest end-to-end; reproduced D1/D2/D6/D7/D8 live against the running dev server
(`http://localhost:5174`, kf 4.1.0 + Tranche G) via Playwright. Every claim below
carries a `file:line` or a live-observation anchor.

---

## 0. The two ROOT blind spots (every D1–D11 miss reduces to one of these)

Before the per-defect table, two structural truths explain the whole class of
misses. Fix these two and ~9 of 11 defects become gate-able.

### ROOT-A — Every gate is either a STATIC GREP or a NARROW RUNTIME ASSERTION. There is ZERO pixel/visual-regression baseline in the repo.

- `proof:idioms` (`scripts/proof-idioms.mjs`) and `proof:brittleness`
  (`scripts/proof-brittleness.mjs`) are 100% `fs.readFileSync` + regex over
  `demo/`. They assert a token/selector is **DEFINED** and not **re-forked** —
  never that it renders the **right pixels**. `proof:idioms` clause 1
  (`proof-idioms.mjs:80-181`) proves `.scale-on-hover` *exists* in
  `design-idioms.css`; it cannot tell that the *hover treatment looks like a
  radial blur instead of a cartoon shadow* (D2/D14).
- The runtime gates (`occlusion-gate`, `lighthouse-gate`, `demo-smoke`,
  `proof:demo-usability`) probe **geometry, scores, mount, and 3 named usability
  clauses** — never **appearance**. `occlusion-gate.mjs` measures rects and
  overlap; `demo-smoke.mjs:175-211` checks "#app has children + hero text exists";
  neither compares against a reference image.
- Verified: `grep -rlE 'toMatchSnapshot|toHaveScreenshot|pixelmatch|visual.?regression|baseline' scripts/ test/`
  returns **only** scoring scripts (`lighthouse`, `demo-elevate`) — i.e. **no
  pixel-diff anywhere**. The screenshots under `docs/tranches/B|C/audit/screenshots/`
  are one-off capture artefacts (`scripts/capture.mjs`), never diffed in CI.
- **Consequence:** D1 (two-column), D2/D14 (radial blur vs cartoon shadow), D3
  (oversized easing editor / inner border / small header), D4 (full-width
  ribbon), D6 (broken dot-fade), D7 (hero too small) are **all appearance/layout
  regressions** — the exact class no existing gate can see. They passed green
  because **green meant "the tokens are defined and the page is not blank," not
  "the page looks right."**

### ROOT-B — The shared SCENES manifest is STALE: the runtime gates never visit the 3 new modes.

- `scripts/lib/demo-driver.mjs:40-59` declares `SCENES` = **6** scenes:
  `home, cube, amiga, square, easing, spring`. This single array is the truth for
  `occlusion-gate`, `lighthouse-gate`, AND `capture.mjs`.
- The demo now ships **9** scenes — `demo/app/scenes.ts:48,56,62,68,74,80,90,103,115`
  adds `sequence`, `motion-path`, `starting-style`.
- Therefore **`sequence`, `motion-path`, `starting-style` are NEVER navigated by
  any runtime gate.** They are not occlusion-checked, not lighthouse-scored, not
  captured. D8 (no icons), D11 (not interactive), and any visual/occlusion defect
  on those three scenes is structurally invisible.
- The one gate that *does* know about them — `proof:demo-usability` clause 1
  (`proof-demo-usability.mjs:56-86`) — only checks **route-reachability statically**
  (does `scenes.ts` id resolve a non-redirect `router.ts` route). It passes,
  because `router.ts:23,24,29` *does* register the routes. So the new modes are
  "reachable" on paper and "unseen" in every pixel/geometry probe. Worst of both:
  the gate that lists them never looks at them; the gates that look never list them.

---

## 1. Per-defect blind-spot table (D1–D11)

| Defect | Gate that SHOULD have caught it | Why it did NOT (the blind spot) | Anchor |
|---|---|---|---|
| **D1** two-column controls (should be one) | `proof:idioms` (layout idiom) / a new layout-lock | No gate measures **grid column count / track layout**. The defect is `grid-cols-[auto_1fr]` + `grid-cols-[subgrid]` laying a label/field pair across the full pane width; `proof:idioms` only greps that *tokens* exist, never computed `grid-template-columns`. | `AnimationControlsControls.vue:4,6,294`; live: the field grid computed `grid-template-columns: 212px 466px` (two real columns) on `/cube` |
| **D2 / D14** radial-blur hover (should be cartoon shadow / refined specular) | `proof:idioms` (hover-treatment idiom) | Pure source grep: `proof-idioms.mjs:106` proves `.scale-on-hover` is *defined*, never that its **visual** is a shadow vs a radial blur. cartoon-shadow was CLOSED in Tranche C with **no lock**, so its regression is invisible. The actual radial blur is the consumed glass-ui hover + the `.progress-dot` glow (`design-idioms.css:269` `box-shadow: 0 0 ... color-mix(--color-progress 40%)`), neither of which any gate renders. | `design-idioms.css:177-182` (`.scale-on-hover`), `:258-270` (`.progress-dot` radial glow); no cartoon-shadow token survives (`grep cartoon` = 0 hits) |
| **D3** easing editor too massive, inner border touches header, header too small | new layout/typography lock | Same as D1: no computed-size/spacing assertion. `TimingFunctionPanel.vue` + `CubicBezierControls.vue` render unbounded; no gate caps panel height or asserts header rung. | `TimingFunctionPanel.vue:78` (`grid grid-cols-[auto_1fr]`); no height/header gate exists |
| **D4** ribbon full-width (should match sidebar width) | new layout-lock | `PlaybackRibbon.vue` is teleported full-bleed; `--controls-pane-width` token exists (`design-idioms.css`) but **nothing asserts the ribbon consumes it**. `proof:idioms` clause 8c locks the *grid track* + *pane min-width* to the token (`proof-idioms.mjs:560-564`) but **not the ribbon width** — a near-miss the lock simply does not cover. | `PlaybackRibbon.vue:24`; `proof-idioms.mjs:560-564` (locks pane, not ribbon) |
| **D5** dock laggy/broken popover | dock-perf budget (none exists) / glass-ui | **No runtime perf/INP budget gate exists** (`grep INP\|frame.?budget scripts/` = none). `demo-smoke` checks console-clean at mount, not interaction latency. The popover-not-opening is a behavior defect no gate clicks the dock to verify. *(glass-ui-HANDOFF for the fix; kf owns the gate.)* | live: 4 console errors on `/cube` mount; no perf gate in `package.json` |
| **D6** dot-fade typing animation broken | a decorative-motion liveness gate (none) | No gate verifies a decorative CSS animation **actually advances**. The hero dots use `animation: dotFade v-bind("duration")` (`AnimatedText.vue:95`); if `duration` is undefined the shorthand silently drops and the dots freeze — invisible to every gate. `demo-smoke` only asserts the hero **text** exists, not that it animates. | `AnimatedText.vue:93-107` (`.dot-fade` + `@keyframes dotFade`); `demo-smoke.mjs:196-211` (text-presence only) |
| **D7** hero too small (should use φ-ladder, larger) | `proof:demo-usability` (already probes hero) / a φ-typography lock | `proof:demo-usability` clause 2 probes the hero's **inter-word gap > 0** and that a `text-display-*` class is present (`proof-demo-usability.mjs:200-203`) — but **never asserts the computed font-size meets a φ-rung floor**. "A balance class is present" ≠ "the hero is the right φ size." So a hero shrunk below its golden rung passes. | `proof-demo-usability.mjs:200-237` (balance-host check, no size floor); `proof:idioms` leaf-tail (`proof-idioms.mjs:183-220`) bans raw `text-sm` but never **requires** a display rung |
| **D8** new modes (spring/seq/path/discrete) have no icons | extended `proof:demo-usability` / icon-parity lock | No gate asserts **scene-nav icon parity**. The new modes are also outside the SCENES manifest (ROOT-B), so even a runtime probe would skip them. No instrument counts icons-per-scene. | `demo-driver.mjs:40-59` (6 scenes, missing the 3); no icon gate |
| **D9** @mbabb logo popover no longer opens | `proof:demo-usability` (interaction) / glass-ui | Tied to D5 dock breakage. No gate **clicks** the trigger and asserts a popover appears. `proof:demo-usability` clicks only to seed the editor (`demo-driver.mjs:148-225`), never to verify a popover opens. | `App.vue:17-66` (DockDropdownTrigger); no popover-open assertion in any gate |
| **D10** mobile single-page affixed docks, bg = animation area | `occlusion-gate` mobile / a mobile-layout lock | `occlusion-gate` runs `375×667` (`occlusion-gate.mjs:56-60`) but only checks **overflow + subject-present + dock-doesn't-cover-content** — never the **mobile architecture** (affixed top/bottom docks, page-as-background). It even has a **standing `PENDING_OCCLUSION` allowance for `square/mobile`** (`occlusion-gate.mjs:91-94`) — proof the mobile axis is known-weak and tolerated. | `occlusion-gate.mjs:56-94`; the allowance set names the mobile residual |
| **D11** new modes not interactive (drag/click) | extended `proof:demo-usability` / interactivity lock | No gate exercises **scene interactivity** (the cube's orbital drag, draggable handles). Combined with ROOT-B (new modes unmanifested), there is nothing to drive a drag against on the new scenes. | no interactivity probe in any gate; `demo-driver.mjs` manifest excludes the new modes |

**Summary of the misses:** D1, D3, D4, D6, D7, D10 ⇒ **ROOT-A** (no appearance/layout
lock). D8, D11 ⇒ **ROOT-B** (stale manifest) + no parity/interactivity lock. D2/D14
⇒ **ROOT-A** + a *closed-but-unlocked* feature (cartoon-shadow, Tranche C) regressed.
D5, D9 ⇒ no interaction/perf gate (+ glass-ui domain). The convergence is stark:
**the gates lock SOURCE SHAPE and PAGE-NOT-BLANK; they do not lock how the product
LOOKS, MEASURES (latency), or BEHAVES on interaction.**

---

## 2. Proposed new / extended instruments for H (the gestalt, falsifiable set)

Each instrument names the gate it extends (or a new gate), the falsifiable BITE,
and a disposition. The binding mandate applies: **idiomatic, single-motion,
measure-first.** Where two defects share a root, ONE instrument covers both — no
per-defect band-aids.

### I-1 · `occlusion-gate` + `lighthouse` + `capture` — RE-SOURCE the SCENES manifest from `scenes.ts` (kills ROOT-B). **SHIP-in-H**
- **Gestalt:** delete the hand-maintained 6-entry array in `demo-driver.mjs:40-59`;
  derive `SCENES` from `demo/app/scenes.ts` (the single source the router already
  trusts), so adding a scene auto-enrolls it in every runtime gate. The
  `subjectSelector` + `dockFloatAllowed` become a small per-scene manifest **keyed
  by the scenes.ts id**, with a **stale-key guard** (a manifest key with no
  scenes.ts id reds — mirrors the `proof:brittleness` `LISTENER_ALLOWLIST` stale
  guard, `proof-brittleness.mjs:75-77,422-430`).
- **proof:** add a clause to `proof:demo-usability` (or the gate's own preflight):
  every `scenes.ts` id appears in the runtime `SCENES` manifest; **BITE:** add a
  scene to `scenes.ts` without a manifest entry → reds. This is the load-bearing
  fix — it makes D8/D11 *checkable at all*.

### I-2 · NEW `proof:visual-lock` — checked-in pixel baseline + diff (kills the bulk of ROOT-A: D1, D3, D4, D6, D7, D10). **SHIP-in-H** (measure-first on tolerance)
- **Gestalt:** one Playwright harness (reuse `serveDist` + the re-sourced `SCENES`),
  screenshot each scene × {mobile 375, desktop 1440} × {controls closed, open} to a
  **committed baseline** under `docs/tranches/H/audit/visual-baseline/`, diff via
  `pixelmatch` with a named per-region tolerance. This is the missing peer to the
  one-off `capture.mjs` — `capture` already produces the frames; H promotes the
  frames to a **gated diff**.
- **proof / BITE:** revert any of D1/D3/D4/D6/D7 → the affected region's diff
  exceeds tolerance → reds. **Measure-first:** establish the tolerance from 3
  consecutive identical runs (anti-flake) before binding it HARD.
- **Note:** this is the broadest lever — it converts six appearance defects into one
  re-runnable instrument. Scope it to **named regions** (controls pane, hero,
  ribbon, easing editor) not full-page, so anti-aliasing noise does not flap it.

### I-3 · EXTEND `proof:idioms` — the LAYOUT-IDIOM locks (D1 one-column, D4 ribbon-width). **SHIP-in-H**
- **Gestalt:** `proof:idioms` already locks coupled tokens to call sites (clause 8c,
  `proof-idioms.mjs:545-580`). Extend the same shape:
  - **one-column lock (D1):** the AnimationControlsControls field layout reads a
    `--controls-columns: 1` idiom (or asserts the rendered field grid is
    single-column) — grep the template for the multi-column class, **OR**
    (stronger) a runtime computed-`grid-template-columns` single-track assertion in
    I-2's harness. **BITE:** re-introduce the `auto_1fr` two-up field pairing → reds.
  - **ribbon-width lock (D4):** extend clause 8c's `--controls-pane-width` coverage
    (currently `proof-idioms.mjs:560-564` locks the grid track + pane min-width) to
    **also require `PlaybackRibbon.vue` to read `var(--controls-pane-width)`**.
    **BITE:** ribbon authored full-bleed → reds. This is a *one-line extension* of an
    existing, proven lock — DRY, no new gate.

### I-4 · NEW `proof:hover-depth` — the radial-blur BAN + cartoon-shadow lock (D2/D14). **SHIP-in-H** (+ glass-ui-HANDOFF for the consumed hover)
- **Gestalt:** the cartoon-shadow idiom must be **OWNED and LOCKED** in
  `design-idioms.css` (it was closed in Tranche C with no lock and regressed).
  Two clauses:
  - **radial-blur ban (static):** zero `box-shadow: 0 0 <spread> <blur>
    color-mix(... --color-progress ...)` on a **hover** selector in demo source
    (the symmetric, blur-bearing 0/0 offset *is* the radial-glow signature — note
    `design-idioms.css:269` is exactly this shape but on `.progress-dot`, a
    playing-ring, not a hover; the ban targets `:hover` selectors). Mirror the
    existing `BALL_BOX_SHADOW` anchored grep (`proof-idioms.mjs:522-523`).
  - **cartoon-shadow lock (static):** a `--cartoon-shadow` / `.cartoon-shadow` (or
    the refined-specular token) is defined in `design-idioms.css` and consumed by
    the hover-lift sites. **BITE:** delete the token / re-introduce a radial blur on
    hover → reds.
  - **runtime tint (I-2):** the hover-state screenshot of a panel is in I-2's
    matrix → a visual radial blur trips the diff.
- **glass-ui-HANDOFF:** the *consumed* glass-ui hover treatment (the "specular
  radial") is glass-ui's; kf SUGGESTS the refined specular + cartoon-shadow
  reconciliation and **gates only the demo-owned layer** — never patches glass-ui
  in kf (inv-16, `lighthouse-gate.mjs:64-68`).

### I-5 · EXTEND `proof:demo-usability` — the φ-TYPOGRAPHY hero lock (D7). **SHIP-in-H**
- **Gestalt:** clause 2 already probes the hero (`proof-demo-usability.mjs:179-237`)
  and even reads `getComputedStyle(h1)`. Add a **computed font-size floor**: the LCP
  `h1` measures ≥ the golden display rung (the glass-ui `text-display-*` φ value,
  not a magic px — read the rung from the token so the lock tracks the ladder).
  Also extend `proof:idioms`' leaf-tail (which BANS raw rungs,
  `proof-idioms.mjs:183-220`) with a **positive** clause: the hero **REQUIRES** a
  display rung class.
- **proof / BITE:** shrink the hero below its φ rung → computed size < floor → reds;
  strip the `text-display-*` class → the positive φ clause reds.

### I-6 · NEW `proof:motion-liveness` — decorative animations actually ADVANCE (D6). **SHIP-in-H**
- **Gestalt:** runtime probe (reuse the I-2 harness): for each named perpetual
  decorative animation (the hero `.dot-fade`, `.lift-down`), sample the element's
  `getComputedStyle` opacity/transform across ≥5 rAF frames and assert it **changes**
  (and settles correctly under `prefers-reduced-motion`, reusing the existing RM
  probe pattern in `capture.mjs`). This is the dual of `proof:dogfood`'s rAF
  discipline — it proves the animation *runs*, not just that the `@keyframes` exists.
- **proof / BITE:** break the `v-bind("duration")` (`AnimatedText.vue:95`) so the
  shorthand drops → opacity never changes across frames → reds. Catches D6's exact
  silent-drop failure mode.

### I-7 · NEW `proof:scene-parity` — icon + interactivity parity for surviving modes (D8, D11). **SHIP-in-H** (gated on the modes-pertinence verdict)
- **Gestalt:** depends on I-1 (re-sourced manifest). For every scene that **survives
  the H hardening** (the `a-modes-pertinence` lane's verdict), assert:
  - **icon parity (D8):** the scene-nav entry renders a non-empty designed SVG
    thumbnail (matching home/cube/amiga/square/easing), not a fallback/blank.
  - **interactivity parity (D11):** the scene exposes ≥1 pointer-interactive
    affordance (a `setPointerCapture` drag or a clickable target) — the same
    interaction class the cube's orbital drag establishes.
- **proof / BITE:** add a scene without an icon, or a non-interactive surviving
  mode → reds. **MEASURE-FIRST / book the order:** this gate binds *after*
  `a-modes-pertinence` decides which modes survive — gating interactivity on a mode
  slated for KILL would be wasted rent.

### I-8 · NEW `proof:dock-perf` — interaction-latency budget for the dock (D5, D9). **MEASURE-FIRST → glass-ui-HANDOFF**
- **Gestalt:** there is **no runtime perf/INP gate today** (verified absent). The
  dock lag (D5) and the dead @mbabb popover (D9) are interaction defects. kf should
  own a **demo-side INP/latency budget**: drive a dock click via Playwright, measure
  time-to-popover-paint and main-thread block, assert ≤ a budget; assert the
  DockDropdownTrigger popover **actually opens** (a node appears).
- **Disposition:** the *budget gate* is kf's to author (MEASURE-FIRST: establish
  the budget from a clean baseline before binding). The *root-cause fix* (the lag,
  the popover) is **glass-ui-HANDOFF** — the dock is actively worked in glass-ui's
  AW tranche. kf gates the *symptom* it can observe (popover opens, latency under
  budget); glass-ui fixes the cause. AUDIT + SUGGEST only inside kf.

### I-9 · EXTEND `occlusion-gate` — the MOBILE-ARCHITECTURE lock (D10). **SHIP-in-H** (after I-1)
- **Gestalt:** the mobile axis exists (`375×667`, `occlusion-gate.mjs:56-60`) but
  only tests overflow/subject/dock-cover, and carries a standing `square/mobile`
  allowance (`occlusion-gate.mjs:91-94`). Add mobile-architecture assertions: the
  top + bottom docks are `position: fixed`/affixed (not in normal flow), the
  scene/animation area fills the viewport as background, and (per-mode) the page
  body is single-column. **BITE:** un-affix a dock, or let the page become
  multi-column on mobile → reds. Retire the `square/mobile` allowance as part of
  H's mobile pass (the gate's own stale-guard already forces this:
  `occlusion-gate.mjs:347-353` reds if a pending allowance starts passing).

---

## 3. The meta-lesson for H's gate philosophy (inv ε)

The six gates were authored A→G as **SOURCE-SHAPE** instruments (`proof:idioms`,
`proof:brittleness`) and **NOT-BLANK / NOT-OCCLUDED / SCORE-FLOOR** instruments
(`demo-smoke`, `occlusion-gate`, `lighthouse`, the 3 `demo-usability` clauses). That
lattice is **exemplary at what it covers** — it bites on token re-forks, DOM
reach, z-drift, dead routes, collapsed word-gaps, a11y scores (the
`proof:demo-usability` hero word-gap clause and the `lighthouse` open-panel scoring
are genuinely SOTA closes). The honest assessment: **the lattice has no APPEARANCE
axis and no INTERACTION axis, and its runtime manifest drifted from `scenes.ts`.**

H's gates need exactly three additions to close the D1–D11 class, in priority order:
1. **Re-source the manifest (I-1)** — cheap, unblocks everything else, one motion.
2. **A pixel/visual-regression baseline (I-2)** — the single broadest lever; it
   converts six appearance defects into one re-runnable diff. Build it once, scope
   it to named regions, measure tolerance first.
3. **An interaction axis (I-6 motion-liveness, I-7 parity, I-8 dock-perf,
   I-9 popover-open)** — proves the product *behaves*, not just *renders static*.

The static idiom/typography locks (I-3, I-4, I-5) are **one-line extensions of
existing, proven gates** (`proof:idioms` clause-8c shape, `proof:demo-usability`
clause-2 hero probe) — DRY, no new god-scripts, each biting on the exact regression
it forbids.

---

## Dispositions roll-up

| Instrument | Covers | Disposition |
|---|---|---|
| I-1 re-source SCENES manifest | ROOT-B (enables D8, D11, mobile) | **SHIP-in-H** |
| I-2 `proof:visual-lock` pixel baseline | D1, D3, D4, D6, D7, D10 | **SHIP-in-H** (MEASURE-FIRST tolerance) |
| I-3 layout-idiom locks (extend `proof:idioms`) | D1, D4 | **SHIP-in-H** |
| I-4 `proof:hover-depth` (radial ban + cartoon lock) | D2, D14 | **SHIP-in-H** (+ glass-ui-HANDOFF for consumed hover) |
| I-5 φ-typography hero lock (extend `proof:demo-usability`) | D7 | **SHIP-in-H** |
| I-6 `proof:motion-liveness` | D6 | **SHIP-in-H** |
| I-7 `proof:scene-parity` (icon + interactivity) | D8, D11 | **SHIP-in-H** (after `a-modes-pertinence`) |
| I-8 `proof:dock-perf` budget | D5, D9 | **MEASURE-FIRST** (gate) + **glass-ui-HANDOFF** (fix) |
| I-9 mobile-architecture lock (extend `occlusion-gate`) | D10 | **SHIP-in-H** (after I-1) |

**inv ε ledger:** every claim above is anchored to a `file:line` in the gate
scripts / demo source, or to a live observation against `localhost:5174` (cube
field-grid computed `212px 466px`; 4 console errors on `/cube` mount; `grep` for
pixel-diff infra = none; `scenes.ts` 9 ids vs `demo-driver.mjs` 6 manifest entries).
The gates are honestly SOTA at source-shape + not-blank; the gap is appearance +
interaction + a drifted manifest.
