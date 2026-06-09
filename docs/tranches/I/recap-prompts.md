# Tranche I — THE PROMPT-RECAP (the I-CLOSE ask→disposition ledger)

**Lane:** I.WZ — the I prompt-recap. **Branch:** `tranche-i-dev` (forked off the BROKEN
`master b934a08` = Tranche H's tip; 10 commits ahead of `master`). **Scope:** EVERY user
prompt across the Tranche I drive → its disposition (**ADDRESSED** + how, with `file:line`
or the RUNTIME gate that bit; or correctly **GATED** / **HANDOFF** / **USER-DOMAIN**). This
is the I-specific recap of the IMPL DRIVE; the A→H→I honest *reckoning* (claimed-vs-actual,
the gate-blindspot reconstruction, the B1–B9 receipts) is the SEPARATE pre-impl document
`audit/recap-prompts.md` — which this file does NOT re-derive (it is the authoritative
catastrophe-reconstruction half). This file is the HONEST I ledger of what the user ASKED
across the drive and where each ask LANDED: **no drops**, every claim cites a `file:line` +
the runtime gate, and nothing is asserted green past the gate that earns it.

**Status legend.** ADDRESSED (landed + committed this tranche, cites the wave/commit + its
RUNTIME gate) · GATED (the falsifiable RUNTIME instrument that locks it — never a
source-shape proxy) · HANDOFF (a sibling repo owns it under inv-16 — kf consumes PUBLISHED,
never forks/patches; the published target named) · USER-DOMAIN (the version/publish/deploy
leg the user owns, confirm-first) · HELD (a recurring precept threaded throughout).

**The I shape.** I is the **runtime-integrity / gate-blindspot-closure** tranche. H shipped
`4.1.1` with **all ~97 `proof:*` gates GREEN over a product that crashes on the first
gesture** (`audit/recap-prompts §0`). The user drove the LIVE demo, reported nine
user-visible breakages **B1–B9** + the tab-title **K**, and mandated: *FULL audit +
Playwright investigation with dev tools; deeply audit the plan + waves + ALL changes;
idiomatic gestalt transpositions; NO workarounds, NO legacy; fold chronic + deferred; recap
ALL prompts; and — the headline — CLOSE THE GATE-BLINDSPOT FOR GOOD* (`I.md:83-96`). The
drive recovered B1–B9 + K behind ACTUATING runtime gates across **I.W0–I.W7**, then the
gate-regime overhaul made "green" mean "a human using the product would see it work."
**No request is dropped.**

---

## §0 — The grounded close facts (the spine every row rests on)

- **Nine breakages + K, recovered across eight waves, each behind an ACTUATING runtime gate:**
  - **I.W0** (`107236d`) **B1/B5** — kill the empty-input parse crash (the `"......"` throw) +
    serialize-from-template (`format.ts`) + group `transform` default-total (`group.ts`).
    Gate `proof:engine-no-throw-on-play`.
  - **I.W1** (`8a40cf4`) **B2** — bind-proof `RAFPlayback` (4 arrow class-field methods) +
    `useRafScene` consolidation. Gate `proof:fsm-suspend-resume-live`.
  - **I.W2** (`e2085c8`) **B4** — control-surface single authority (`controlSurfaceDFA.ts`) +
    unified `EasingEditor.vue`. Gate `proof:easing-editor-live`.
  - **I.W3** (`b8659fe`) **B3** — amiga subject=pivot=framing geometry + shed
    `content-visibility:auto` over the WebGL root. Gate `proof:amiga-subject-is-pivot`.
  - **I.W4** (`3afd49f`) **B6/B8** — one drag seam owns gesture-in-flight + `releasePolicy:
    persist` + composed frame driver + dock perf. Gates `proof:drag-gesture` +
    `proof:perf-frame-budget`.
  - **I.W5** (`bea5f27`) **B9/K** — icon single-source + one build root + honest 404 + title +
    DC-8 restore. Gate `proof:icon-paint-live`.
  - **I.W6** (`4103c22`) **B7** — specular consume-edge (glass-ui **3.9.0** default-off) + the
    Plus-Jakarta font reclaim (override `--font-stack-text` at `:root`). Gates
    `proof:specular-absent-at-rest` + `proof:demo-fonts`.
  - **I.W7** (`1a708cf`) **THE GATE-REGIME OVERHAUL** — `proof:live-session` (the gate-of-gates:
    ONE interaction-driven session over the BUILT dist; PLAY+SWITCH+DRAG; one accumulated
    error-budget = 0 + the product-facing DOM B1–B9+font) + `proof:gate-is-runtime` (the
    meta-gate) + `proof:chronic-closure` REWIRED + the two-tier `proof:correctness` (10
    actuating gates) / `proof:hygiene` taxonomy; the 5 H proxy gates RETIRED.

- **The two-tier gate taxonomy is LIVE in `package.json`.** `proof:all` = `proof:correctness`
  (the 10 actuating gates: `engine-no-throw-on-play`, `fsm-suspend-resume-live`,
  `easing-editor-live`, `amiga-subject-is-pivot`, `drag-gesture`, `perf-frame-budget`,
  `icon-paint-live`, `specular-absent-at-rest`, `demo-fonts`, `live-session`) **&&**
  `proof:hygiene` (the ~80 source-shape/jsdom gates + `gate-is-runtime` + `chronic-closure`,
  stripped of correctness authority). The 5 retired proxy gates
  (`proof-demo-console-clean`, `proof-dock-morph-settled`, `proof-no-orphan-specular`,
  `proof-scene-icons`, `proof-dragscrub-single`) are gone from the tally.

- **THE VALUE.JS DEPENDENCY (B1 is two-sided — the load-bearing consume-edge).** kf I.W0's
  `format.ts` serialize-from-template + the empty-group short-circuit in
  `useAnimationGroupPlayback.ts` is NOT self-sufficient: rebuilding the dist on pristine
  PUBLISHED value.js `0.11.1` (no empty-input fix) REDS `proof:engine-no-throw-on-play`
  clauses [a] + [hygiene f] (the rainbow group-play on cube STILL throws `Parse error at
  offset 0: "......"`). So value.js `parseCSSValueUnit("") → ValueUnit(0)` (the empty-input
  contract) is LOAD-BEARING. It was consumed locally (a dist `cp`) through the wave; this
  drive PUBLISHED value.js **0.11.2** (registry-confirmed; value.js commit `0cb5dd2`
  `chore(release)`) and RE-PINNED kf `@mkbabb/value.js ^0.11.1 → ^0.11.2` (kf commit
  `e473447`). The lockfile now resolves `0.11.2`
  (`package-lock.json` integrity `sha512-Xh8qNi2…`). `proof:engine-no-throw-on-play` AND
  `proof:live-session` are both GREEN on the PUBLISHED dependency (no local `cp`). CI
  `npm ci` now pulls the fix.

- **THE GLASS-UI CONSUME-EDGE (B7 — published, no kf fork).** kf bumped
  `@mkbabb/glass-ui ~3.5.1 → ~3.9.0` (`package.json`; lockfile resolves `3.9.0`). The AX
  W54 specular cohesion folded the moving `::before` into the `.glass-material` mixin with
  rest `--specular-intensity` defaulting to 0 (`glass.css:110-114`); AX commit `89edffc`
  already acknowledged folding kf's I.W6 dock/Button specular (19 tracks) into W54. **ZERO
  kf-side CSS** — the `.glass-specular-track::before{content:none}` consumer-neutralizer was
  REJECTED at the SOURCE (`I.md:108`). The earlier DEV-phase plan targeted a *vaporware*
  glass-ui `v3.8.0` (`specular="off"` tagged local-only, unpublished); the IMPL drive
  SUPERSEDED that with the PUBLISHED **3.9.0** consume — a kf-owned consume-edge, never a
  future version. The `proof:specular-handoff` born-RED vaporware IOU is DELETED.

- **VERSION + DEPLOY.** kf version in tree is **`4.1.0`** (a tranche-h PATCH changeset is
  PENDING/unconsumed in `.changeset/tranche-h.md` — it bumps 4.1.0 → 4.1.1 for H's
  `frame-compiler.ts` bugfix and predates I). **I IS NOT byte-stable vs 4.1.0** — unlike H,
  the I LIBRARY surface IS touched (I.W0 changed `src/animation/format.ts` + `group.ts`; the
  value.js floor moved `^0.11.2`). The library deltas are strictly-more-correct BUGFIXES
  (empty-input no longer crashes). **Version owner: Mike Babb (`mike@babb.dev`)** — the
  changeset tier + npm publish are USER-DOMAIN, confirm-first.
  **keyframes.babb.dev is Cloudflare Pages** (NOT GitHub Pages), deployed via
  `.github/workflows/deploy-pages.yml` on green-CI `workflow_run` on `master`. `master` is
  **10 commits BEHIND** `tranche-i-dev` — the LIVE demo is still the BROKEN H tip. The honest
  close = merge `tranche-i-dev → master → green CI → CF auto-deploys the FIX`. This
  **SUPERSEDES** the `d469e69` damage-control revert (no need to revert to a pre-H ancestor
  when the actual fix can ship); the `d469e69` disposition is **SUPERSEDED-BY-FIX-SHIP**
  (recorded, not executed).

---

## §1 — THE STANDING DEVELOPMENT MANDATE (the verbatim-in-substance A→H ask, carried into I)

The user's verbatim-intent mandate for Tranche I (2026-06-08, `I.md:83-90`): *A FULL audit +
Playwright investigation with dev tools; DEEPLY audit the original plan + waves + ALL changes;
devise a path forward; recapitulate ALL original prompts / plans / precepts; NO quick
solutions, NO workarounds — IDIOMATIC, GESTALT approaches; architectural transpositions for
ELEGANCE, SIMPLICITY, PERFORMANCE; NO LEGACY CODE; delineate chronic + deferred and FOLD them;
recap ALL prompts + ensure addressed.*

| Standing ask | Disposition this tranche |
|---|---|
| **FULL audit + Playwright investigation with dev tools** | **ADDRESSED (DEV phase)** — the I-investigation harness (`audit/investigate/probes/b1…b16`, `shots/`, console JSON) reproduced B1–B9 against the BUILT `dist/` + dev `:5174`; chrome-devtools-mcp leveraged for live debugging (the font/perf/amiga/specular legs — §3). |
| **Deeply audit the original plan + waves + ALL changes A→H** | **ADDRESSED** — `audit/recap-prompts.md` §2 is the per-tranche claimed-vs-actual ledger; the 8 `rootcause-rc-*.md` root-cause docs ground every B. |
| **Devise a path forward; NO quick solutions / NO workarounds; IDIOMATIC, GESTALT** | **ADDRESSED + EXECUTED** — `PATH-FORWARD.md` + the wave specs; the IMPL drive landed each fix at the GESTALT seam (the empty-input value seam is made total, NOT another `try/catch` placeholder; `RAFPlayback` is bound-by-construction, NOT two arrow-wraps; the specular dies at glass-ui SOURCE, NOT a kf neutralizer) — every NO-workaround prohibition in `I.md:98-114` HELD (§4). |
| **Architectural transpositions for ELEGANCE, SIMPLICITY, PERFORMANCE; NO LEGACY** | **ADDRESSED** — inv-16 un-fenced `src/animation`: I.W0 (`format.ts`/`group.ts` empty-input + group-transform), I.W1 (`playback.ts` bind-proof) are real engine transpositions, not symptom patches; every replaced surface dies in ONE motion (§4 no-legacy). |
| **Delineate chronic + deferred and FOLD them** | **ADDRESSED** — `audit/recap-chronic.md` + `impl/I-TOTALITY-ASSAY §1` re-open the four false-closed chronics (CH-1 specular, CH-3 mobile, CH-4 dock) with their live receipts and fold them into I.W2–I.W6; CH-2 (φ-hero) is RE-AFFIRMED genuinely closed, not re-litigated. |
| **Recap ALL prompts + ensure addressed** | **ADDRESSED** — `audit/recap-prompts.md` (the A→H→I reckoning) + THIS file (the I-drive ask→disposition ledger). No drops. |
| **The gate-blindspot — CLOSE IT FOR GOOD (the I headline)** | **ADDRESSED** — I.W7 (`1a708cf`): `proof:live-session` (the gate-of-gates) + `proof:gate-is-runtime` (machine-enforces the gate-ORACLE charter invariant) + `proof:chronic-closure` REWIRED (each chronic cites a RUNTIME gate that BIT) + the two-tier `proof:correctness`/`proof:hygiene` taxonomy + the 5 H proxy gates RETIRED (§2). |
| **Version owner named for the stacked changeset** | **Mike Babb** (`mike@babb.dev`) — the I library bump (off 4.1.0; NOT byte-stable, I touches `src/`) + the deploy are USER-DOMAIN, confirm-first (`I.md:425`, `PROGRESS.md:298`). |
| **inv-16: consume PUBLISHED siblings; the engine `src/animation` is the kf PRODUCT (un-fenced this tranche)** | **HELD** — value.js consumed via PUBLISHED `0.11.2`, glass-ui via PUBLISHED `~3.9.0`; the engine transpositions are kf-PRODUCT changes, not sibling forks (§4 inv-16). |

---

## §2 — THE IMPL AUTHORIZATION + THE GATE-REGIME OVERHAUL (the headline ask)

| # | The user prompt / ask | Disposition | Evidence (`file:line` / RUNTIME gate) |
|---|---|---|---|
| **I-AUTH** | **Begin / continue the tranche — the IMPL phase, maximal parallelism + workflows** (the boundary is exactly D.W0/E.W0/F.W0/G.W1: DEV authors, IMPL awaits explicit user authorization gated on kf's own green CI — `I.md:72,347-357`) | **ADDRESSED** — IMPL ran maximally-parallel across the wave board: I.W0–I.W3 + I.W5 landed as committed waves, I.W4/I.W6/I.W7 closed the board. | The 8 commits `107236d`→`1a708cf` + `e473447`; `I-TOTALITY-ASSAY §2` (the wave board). |
| **I-GATE** | **The gate-blindspot — every wave gate must be a REAL runtime/interaction gate (playwright clicking play, switching scenes, dragging) — NOT a source-shape check; close it for good** (`I.md:92-96`, the I headline) | **ADDRESSED** — `proof:live-session` is the ONE interaction-driven session over the BUILT `dist/gh-pages/`: PLAY (rainbow group-play) + SWITCH (hover-expand dock + every scene) + DRAG (square + bezier handles + amiga centre) with a single accumulated **error-budget = 0** + the product-facing DOM assertions (canvas mounted, handle-drag mutates, cube transform paints, box persists, subject moves, bloom absent, glyph paints). Born-RED on `b934a08`, GREEN only when I.W0–I.W6 land. | `scripts/proof-live-session.mjs`; `proof:live-session` (gate-of-gates); commit `1a708cf`; `package.json` `proof:correctness` aggregator. |
| **I-GATE-META** | **The chronic-closure meta-gate must police the PRODUCT, not paperwork; a chronic exits only via a runtime gate that BIT** | **ADDRESSED** — `proof:chronic-closure` REWIRED: each cited `proof:*` must open a browser AND actuate AND be witnessed born-RED; a HANDOFF row may target ONLY a published version / kf-owned consume-edge (the B7 vaporware lesson). `proof:gate-is-runtime` INSTALLED — every wave's §Hard gate must be interaction-driven + wired to the correctness tier, machine-enforcing the gate-ORACLE charter invariant from t=0. | `scripts/proof-chronic-closure.mjs`; `scripts/proof-gate-is-runtime.mjs`; `I.md:160` (the chronic-closure meta-invariant). |
| **I-RETIRE** | (implied by the overhaul) **retire the source-shape proxy gates that certified the broken product green** | **ADDRESSED** — 5 H proxy gates RETIRED: `proof-demo-console-clean` (→ live-session console budget), `proof-dock-morph-settled` (→ `proof:perf-frame-budget`), `proof-no-orphan-specular` (→ `proof:specular-absent-at-rest`), `proof-scene-icons` (→ `proof:icon-paint-live`), `proof-dragscrub-single` (→ `proof:drag-gesture`); the dangling `proof:no-route-storm` reference removed. The ~80 surviving source-shape gates RE-TIERED to `proof:hygiene` (kept, cheap, correctness-authority stripped). | `package.json` `proof:correctness` / `proof:hygiene` split; commit `1a708cf`. |

---

## §3 — THE LIVE-DEBUG / DEV-TOOLS + CROSS-REPO COORDINATION ASKS

| # | The user prompt / ask | Disposition | Evidence (`file:line` / gate) |
|---|---|---|---|
| **DT-1** | **Leverage chrome-devtools-mcp for live debugging** (font/perf/amiga work) while CI gates stay headless playwright-core (project memory `feedback_chrome_devtools_mcp.md`) | **ADDRESSED** — chrome-devtools-mcp drove the live debugging legs: B7 specular verified LIVE (rest `::before` opacity 0 on dock-icon-button + stage card — `I-TOTALITY-ASSAY §1` B7, `PROGRESS.md` 3.9.0 note); the Plus-Jakarta font leak diagnosed live (the dock half-loaded fallback); the amiga centre-drag + perf legs observed live. The CI gates stay HEADLESS playwright-core (`proof-*.mjs` `serveDist` + `KF_PLAYWRIGHT_DIR` chromium, modelled on `proof-no-orphan-specular.mjs`). | `proof:specular-absent-at-rest`, `proof:demo-fonts`, `proof:amiga-subject-is-pivot`, `proof:perf-frame-budget` (all headless playwright-core); live-confirm via chrome-devtools-mcp. |
| **DT-2** | **Pull glass-ui 3.9 + the publish/deploy authorization** ("are we using the latest glass-ui?" → consume the published specular-cohesion; AUTHORIZE the value.js publish + re-pin + the CF-Pages deploy) | **ADDRESSED** — glass-ui bumped `~3.5.1 → ~3.9.0` (PUBLISHED; lockfile `3.9.0`); value.js PUBLISHED `0.11.2` + re-pinned (`e473447`); the publish/push/deploy is AUTHORIZED + actionable (`I-TOTALITY-ASSAY §3.A`, §5). The version/publish/deploy execution stays USER-DOMAIN (Mike Babb), confirm-first. | `package.json` (`glass-ui ~3.9.0`, `value.js ^0.11.2`); `e473447`; `I-TOTALITY-ASSAY §3,§5`. |
| **DT-3** | **The fonts don't seem correct on the dock — we don't use Plus Jakarta (that's a glass-ui default)** | **ADDRESSED** — glass-ui `~3.9.0` `typography.css` force-applies "Plus Jakarta Sans" to every consumer's body/text register; kf RECLAIMED its identity (Instrument Serif display + Fira Code mono over native UI sans) by overriding `--font-stack-text` at `:root` (the documented glass-ui consumer lever; the `@theme-inline` bridge can't be overridden directly). ZERO Plus Jakarta lands on a kf surface. **GATED** by a RUNTIME gate (the rendered computed font is the oracle). | `proof:demo-fonts` (clause a: no "Plus Jakarta" on body/dock/chrome; b: Instrument Serif display survives; c: no half-loaded font); `scripts/proof-demo-fonts.mjs:1-30`. |
| **CO-1** | **The coordination workflow + the glass-ui agent report** (the AX coordination doc + the consolidated I-TOTALITY-ASSAY both lean on one ledger) | **ADDRESSED** — `impl/I-TOTALITY-ASSAY.md` is the single inv-ε ledger the close (I.WZ) and the glass-ui coordination both lean on; it records AX commit `89edffc` (folding kf's 19 specular tracks into W54) + the Plus-Jakarta default-font leak filed as a NEW glass-ui-HANDOFF (the GESTALT fix — glass-ui should not force its brand font onto a consumer's body register — is glass-ui-side; the kf reclaim is the documented consumer lever in the interim). | `I-TOTALITY-ASSAY §1` (B7), §3 (the Plus-Jakarta consume-edge finding + handoff). |

---

## §4 — THE PER-BREAKAGE ASK→DISPOSITION LEDGER (B1–B9 + K — the user's nine live defects + the title)

Each is a CLAIMED-ADDRESSED H request that the user re-flagged broken on the live demo
(`audit/recap-prompts §0`); each lands this tranche at the gestalt seam behind an actuating
runtime gate.

| # | The user-observed breakage | Wave / commit | How addressed (the seam — `file:line`) | RUNTIME GATE |
|---|---|---|---|---|
| **B1** | RAINBOW GROUP-PLAY errors `Parse error at offset 0: "......"` + a `this.transform is not a function` cube-group crash | **I.W0** `107236d` | (a) value.js `parseCSSValueUnit("") → ValueUnit(0)` (the empty-input contract, PUBLISHED 0.11.2, re-pinned `e473447` — the load-bearing consume-edge §0); (b) `group.ts` `transform = NOOP_TRANSFORM` total-by-construction + lazy composite from first parsed child; (c) `useAnimationGroupPlayback.toggleAnimationGroup` short-circuits a childless group | `proof:engine-no-throw-on-play` — BUILT dist: rainbow-play on HOME + cube → 0 `pageerror`/`unhandledrejection`; cube transform PAINTS LIVE (123 distinct non-`none` matrices) |
| **B5** | Keyframes pane shows `/* timing-function: custom — no CSS twin */` (the lying placeholder) | **I.W0 + I.W2** | `format.ts` `CSSKeyframesToString` serializes from the DECLARED `parsedVars[i]` template via `unflattenObjectToString` (`var()`/`matrix3d()` round-trip verbatim); the catch names the ACTUAL error, kills the placeholder; I.W2 persists a complete re-parseable `cubic-bezier(…)`/`steps(…)` literal | `proof:engine-no-throw-on-play` clause (d): pane shows real round-trippable `@keyframes`, NOT the placeholder |
| **B2** | DFA suspend `TypeError … 'this._gen'` on play→switch; controls blank on switch | **I.W1** `8a40cf4` | `playback.ts` — `RAFPlayback`'s `play`/`drive`/`loop`/`stop` are arrow class-fields, BIND-PROOF by construction; NEW `useRafScene.ts` consolidates the raw-rAF recipe with bound callbacks; the unbound `useEasingDemo.ts:227`/`useSpringDemo.ts:365` refs DELETED; the pure resume-iff-was-playing reducer PRESERVED | `proof:fsm-suspend-resume-live` — synthetic `visibilitychange→hidden` on a PLAYING easing scene → 0 `_gen`/throw; live easing(PLAYING)→amiga switch → destination controls NON-BLANK (pane opacity 1.00) |
| **B4** | `/easing` LOST the curve/timing editor (J1–J6 minimalism over-removed it) | **I.W2** `e2085c8` | `stores/controlSurfaceDFA.ts` pure `selectedControlSurfaceFor(scene, preferred)` → `<Tabs>` born CORRECT on the mounting tick (the reka passive-latch desync dies at source); single-surface scenes `forceMount`; ONE `EasingEditor.vue` (dropdown + editable `EasingCurveCanvas` + readout/copy) mounted by BOTH rail + panel | `proof:easing-editor-live` — switch INTO easing → `.easing-curve-canvas` present + `display:block`; handle-drag MUTATES the bezier `d` AND re-animates the subject |
| **B3** | `/amiga` "totally broken and floats around" | **I.W3** `b8659fe` | `useAmigaAnimations.ts` `SPHERE_HOME = 0` (room origin = box centre = camera look-at); `AmigaScene.vue` sphere seated at `(0,0,0)` + `controls.target.copy(sphereMesh.position)` makes the orbit pivot TRACK the subject; `content-visibility:auto` REMOVED from the WebGL root, occlusion driven off `IntersectionObserver` | `proof:amiga-subject-is-pivot` — centre-drag is a LOCAL subject change (`centreMAD 8.7 >> peripheryMAD 0.0`); 0 WebGL ReadPixels/GPU-stall lines over a ≥2s loop |
| **B6** | `/square` drag highlights chrome text (no `user-select:none`) + "does not feel right and does not persist" | **I.W4** `3afd49f` | lift a GLOBAL select-suppression token + `releasePolicy: persist` into `useDragScrub.ts`/`useDragCapture.ts`; migrate square's hand-rolled `window`-drag onto the seam; `settle()` in place, NOT `reseat(0,0)` on `pointerup` | `proof:drag-gesture` — no text-selection over swept chrome (`getSelection()` empty) + transform PERSISTS, EVERY drag surface |
| **B8** | ALL dock animations "supremely broken, slow, errored"; glass-ui elements slow | **I.W4 + I.W0/I.W6** | (a) "errored" half = B1 console bleed → DIED with I.W0; (b) dock `transition`-under-`backdrop-filter` retune RODE glass-ui 3.9.0 (AX dock-unify-root, consumed); (c) `/easing` per-rAF reactive `ref` storm + stacked rAF loops → ONE composed driver (non-reactive `style.transform` write) | `proof:perf-frame-budget` — 4× CPU throttle, BOUND ceilings: dock-expand `dropped ≤ 2`, easing-play `dropped ≤ 3` |
| **B7** | SPECULAR sheen STILL present on the glass stages; "are we using the latest glass-ui?" | **I.W6** `4103c22` | RESOLVED at the consume-edge: kf bumped `~3.5.1 → ~3.9.0`; AX W54 folded the moving `::before` into `.glass-material` with rest `--specular-intensity` 0 (`glass.css:110-114`). ZERO kf-side CSS; the `::before{content:none}` workaround REJECTED. Stage cards `specular="off"` default + the 9–11 dock/play tracks rest-intensity-0 | `proof:specular-absent-at-rest` — BUILT dist: bloom ABSENT at rest on EVERY stage glass `::before` AND every dock/play `<Button>`; PRIMARY oracle = perceptual luminance delta (class-absence is HYGIENE corroborator). `proof:specular-handoff` (vaporware IOU) DELETED |
| **B9** | Dev `ENOENT: assets/icons/easing-icon-sm.svg` (build uses `easing.svg`) + 47 source-map errors | **I.W5** `bea5f27` | `vite.config.ts` — ONE canonical `DEMO_DEFAULT_OUTDIR` + `emptyOutDir`; the Mar-25 orphan deleted; `assetExtension404Plugin()` declines to rewrite `*.svg`/`*.png`/`*.map` misses to index.html (404s honestly, was 200-HTML hiding the orphan); the dev source-map noise ACCEPTED + documented (built `dist/` clean) | `proof:icon-paint-live` — every `SceneDescriptor.icon` (7/7) + favicon PAINTS a non-zero inline `<svg>`; the asset-404 set is EMPTY across 7 navigations + Select + editor mount |
| **K** | "The demo name should just be 'keyframes.js'" (the browser-tab title) | **I.W5** `bea5f27` | `demo/app/index.html` `<title>keyframes.js</title>` — single-sourced, no build-time rewrite; gh-pages ships verbatim; the source-vs-build title drift (the long subtitle) reconciled under B9 | `proof:icon-paint-live` clause (c): `document.title === "keyframes.js"` |
| **DC-8** | (folded) scene-swap dead-CSS (twice-deferred A→C) — no fourth defer | **I.W5** `bea5f27` | Verified first-hand: a LIVE `startViewTransition` consumer EXISTS (`useSceneTransition.ts:32`, `App.vue` `.scene-host`); the orphan grep finds ZERO demo-side scene-swap CSS → DC-8 = RESTORE (KILL target ∅) | `proof:icon-paint-live` clause (e): a real dock-Select switch FIRES the live VT + zero orphan demo-side VT CSS |

---

## §5 — THE DEPLOY / RE-RUN-THE-WORKFLOW + CHRONIC ASKS

| # | The user prompt / ask | Disposition | Evidence |
|---|---|---|---|
| **DEP-1** | **Re-deploy the workflow** (ship the FIX live — the demo on `master` is still the broken H tip) | **ADDRESSED (path bound; execution USER-DOMAIN)** — the honest close = merge `tranche-i-dev → master → green CI → CF auto-deploys`; `deploy-pages.yml` auto-deploys on every green-CI master push (`d469e69` dropped the tip-commit path filter, so any green master push deploys). The merge + deploy is confirm-first user-domain. | `.github/workflows/deploy-pages.yml`; `master..tranche-i-dev = 10`; `I-TOTALITY-ASSAY §5.4`. |
| **DEP-2** | **The deploy-damage-control revert to `d469e69`** ("the broken demo is fine; we'll fix this with our next tranche" → the DEV-phase `I-IMMEDIATE-1` revert) | **GATED → SUPERSEDED-BY-FIX-SHIP** — the DEV phase tracked an immediate revert to a pre-H ancestor to take the broken product off the air (`PATH-FORWARD §4`, `PROGRESS.md:48-52`). The IMPL drive makes that UNNECESSARY: the actual fix can ship. Disposition recorded as **SUPERSEDED-BY-FIX-SHIP** — record it, do NOT execute it (no revert to a pre-H ancestor when the fix merges). | `PATH-FORWARD.md §4`; `I-TOTALITY-ASSAY §3` (deploy facts); §0 (this file). |
| **DEP-3** | **Hold the npm publish until the engine is whole** (the library entry is engine source B1/B2 transpose) | **ADDRESSED** — the engine repair landed (I.W0/I.W1); the I library bump is now actionable off 4.1.0 (NOT byte-stable — I touches `src/`); the publish is USER-DOMAIN (Mike Babb), confirm-first. | `I.md:425`; `PROGRESS.md:298`; `.changeset/` (the H patch changeset is unconsumed; the I changeset is the I.WZ owner-cut). |
| **CH-1** | (chronic) cartoon-shadow / specular (D2/D14) — re-opened | **ADDRESSED** — resolved at the 3.9.0 consume (B7); the cartoon PANELS already read correctly (RE-AFFIRMED). `proof:specular-handoff` (vaporware) DELETED. | `proof:specular-absent-at-rest`; `recap-chronic §7`; `PROGRESS.md:163`. |
| **CH-2** | (chronic) φ-hero typography (D7) | **RE-AFFIRMED genuinely closed** — `proof:phi-leaf-zero` enforced-0 leaves + the hero rung; the user did not re-flag it; B4 was a SEPARATE easing-editor defect. No I gate owed. | `I-TOTALITY-ASSAY §1` CH-2. |
| **CH-3** | (chronic) mobile (D10/D13) — re-opened | **ADDRESSED (folded)** — bones REAL (full-bleed stage + underdamped `SpringProgress` drawer, settle 169–175ms); M1 menubar-occludes-sheet → I.W5 anchor; M2 sheet-body → I.W2 single-authority mount (LANDED); M3 dock `transition:all` → I.W4/I.W6 (folds B8). | `I-TOTALITY-ASSAY §1` CH-3; `proof:easing-editor-live` (M2), `proof:perf-frame-budget` (M3). |
| **CH-4** | (chronic) dock (D5 lag + D9 popover) — re-opened | **ADDRESSED** — the "broken dock" decomposed: B1 console flood (I.W0) + M3 `transition:all` (I.W4/I.W6 consume) + RC-2 ReadPixels stalls (I.W3 amiga); D5 spring genuinely settled, D9 un-double-wrapped (RE-AFFIRMED). The "dock fixes in glass-ui, never patched in demo" memory rule HELD. | `I-TOTALITY-ASSAY §1` CH-4; `proof:perf-frame-budget`, `proof:amiga-subject-is-pivot`. |

### The B3 amiga live-session leg (the integrated-battery resolution)

The integrated battery's B3 leg charged 4 PROMOTED "GPU stall due to ReadPixels" warnings.
Root-caused **NOT** the product render loop (the amiga code does zero `readPixels`;
`cvAnc=null` confirms the RC-2 content-visibility-over-WebGL source is gone). The 4 stalls
are a ONE-TIME cold-GPU-process init burst at t≈400ms (shader compile + the first
backdrop-filter composite reading the transparent `alpha:0` WebGL canvas back under the
`.glass-dock` blur, flagged a "stall" ONLY under headless SwiftShader); a WARMED second load
emits ZERO. **Fix:** B3 split into a STEADY-STATE present-loop GPU oracle (warm-then-observe;
a per-frame-readback regression still stalls every frame regardless of warmup, so it still
bites the real RC-2 defect) + a declared-READBACK MAD leg (the harness `page.screenshot` is
the measurement INSTRUMENT, not the product, so it does not charge). This mirrors the
canonical `proof:amiga-subject-is-pivot` clause (a)/(c) split. A B1 verdict bug (the leg set
`live` but not the `pass` field the verdict reads) was also fixed.

---

## §6 — THE RECURRING PRECEPTS — verified HELD across the I drive

| Precept | Verdict | Anchor |
|---|---|---|
| **no-legacy / no codepath beside its replacement** | **HELD** | the mis-attributing "no CSS twin" placeholder dies WITH the serialize-from-template fix (I.W0); the two unbound `playback.stop` call sites + the duplicated raw-rAF boilerplate die WITH the bound `RAFPlayback` + `useRafScene` (I.W1); the per-scene reka-Tabs `selectedControl` pokes die WITH the machine-projected surface (I.W2); the square hand-rolled `window`-drag dies WITH its `useDragScrub` migration (I.W4); every retired source-shape gate is DELETED/re-labeled hygiene in the SAME motion its runtime supersessor lands (I.W7). |
| **no quick solutions / no workarounds — idiomatic gestalt** | **HELD** | the `"......"` crash dies because the EMPTY-INPUT VALUE seam is made TOTAL — NOT another `try/catch` placeholder (that floor IS B5); the `_gen` crash dies because `RAFPlayback` is BOUND-BY-CONSTRUCTION — NOT an arrow wrapped around two call sites; the specular dies because kf consumes the PUBLISHED default-off — NOT a `.glass-specular-track::before{content:none}` neutralizer (REJECTED at source); the gate overhaul is the ORACLE re-point — NOT N more proxy gates (`I.md:98-114`). |
| **idiomatic + gestalt (the whole, not the column)** | **HELD** | each B's fix is one gestalt root-cause, not a per-symptom patch: B8's "broken dock" decomposes to B1+M3+RC-2 (each owned by its real seam); the four chronics get PRODUCT-level terminals (a runtime gate that bit); `proof:live-session` collapses ~34 proxy browser gates into ONE driven battery. |
| **measure-first** | **HELD** | the dock expand (12/114 dropped, p95 25ms), the `/easing` render storm (46fps playing vs 60 paused), the specular paint posture — all MEASURED behind CPU-throttled drop-counting running-scene gates (`proof:perf-frame-budget`), not asserted (`I.md:115-122`). |
| **inv ε (verify, do not assert — the oracle must measure the PRODUCT, not a proxy)** | **HELD + SHARPENED** | every B1–B9 claim grounded in a re-runnable probe + captured console/pageerror + a screenshot; the I correction made inv ε MECHANICAL — `proof:gate-is-runtime` enforces that a correctness gate's oracle is the running product, from t=0 (`I.md:153`). This recap asserts NOTHING green past the gate that earns it. |
| **inv-16 (kf writes only kf; siblings consumed PUBLISHED)** | **HELD** | value.js consumed via PUBLISHED `0.11.2` (re-pinned `e473447`, lockfile-resolved); glass-ui via PUBLISHED `~3.9.0` (lockfile-resolved); parse-that `^0.9.0`. The glass-ui specular + Plus-Jakarta items are HANDOFFs (AX `89edffc` folded the specular; the font gestalt fix is a NEW glass-ui-HANDOFF) — never patched in kf. The SINGULAR relaxation: `src/animation` is the kf PRODUCT, un-fenced for the B1/B2/B3 engine transpositions — NOT a sibling fork (`I.md:156`). |

**The precept verdict.** The binding mandate held across all eight waves + the re-pin + the
deploy-path. The headline precept — the gate ORACLE must be the running product — is now
MACHINE-ENFORCED (`proof:gate-is-runtime` + the `proof:correctness`/`proof:hygiene` taxonomy),
so the gate-blindspot that made H's close the largest overclaim in the project cannot recur.

---

## §7 — VERDICT (no drops)

**Every I prompt resolves.** The standing development mandate (audit + investigation +
gestalt path + recap + fold) → executed across the DEV-phase audit (`audit/**`,
`PATH-FORWARD.md`) and the IMPL drive (the 8 commits `107236d`→`1a708cf` + the re-pin
`e473447`). The IMPL authorization (begin/continue, maximal parallelism + workflows) →
ADDRESSED, the full wave board closed. The headline gate-blindspot ask → ADDRESSED by I.W7:
`proof:live-session` (the gate-of-gates), `proof:gate-is-runtime` (the machine enforcer),
the `proof:chronic-closure` rewire, the two-tier `proof:correctness`/`proof:hygiene` taxonomy,
and the 5 retired proxy gates — "green" now means "a human using the product would see it
work."

**Every B1–B9 + K traces to its falsified H claim and lands at the gestalt seam behind an
actuating runtime gate** (§4): B1/B5 (I.W0 + the load-bearing value.js `0.11.2` consume-edge),
B2 (I.W1 bind-proof), B4 (I.W2 single authority), B3 (I.W3 subject=pivot), B6/B8 (I.W4 drag
seam + composed driver + dock perf), B9/K (I.W5 single-source + title), B7 (I.W6 glass-ui
`~3.9.0` consume-edge). The four false-closed chronics (CH-1 specular, CH-3 mobile, CH-4 dock)
get PRODUCT-level terminals; CH-2 (φ-hero) is RE-AFFIRMED genuinely closed.

**The cross-repo + deploy asks resolve honestly and inv-16-clean.** The dev-tools ask
(chrome-devtools-mcp for live debugging; CI stays headless playwright-core) → ADDRESSED; the
glass-ui 3.9 pull + the publish/deploy authorization → ADDRESSED (value.js `0.11.2` + glass-ui
`~3.9.0` both PUBLISHED + lockfile-resolved); the font fix (NOT Plus Jakarta — reclaimed via
`--font-stack-text` at `:root`) → GATED by `proof:demo-fonts`; the coordination workflow +
glass-ui agent report → the AX coordination + `I-TOTALITY-ASSAY` single ledger (AX `89edffc`);
the re-deploy-the-workflow ask → the merge `tranche-i-dev → master → green CI → CF auto-deploy`
path (the `d469e69` revert SUPERSEDED-BY-FIX-SHIP). **SEMVER:** I is NOT byte-stable vs 4.1.0
(the library `format.ts`/`group.ts` BUGFIXES + the value.js floor moved); the bump + publish +
deploy are USER-DOMAIN. **Version owner: Mike Babb.** The recurring precepts — no-legacy,
no-workaround, idiomatic+gestalt, measure-first, inv ε, inv-16 (kf writes only kf; siblings
consumed PUBLISHED) — each verified HELD. **No request is dropped.**
