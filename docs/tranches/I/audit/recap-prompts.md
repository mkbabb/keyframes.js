# Tranche I — THE PROMPT-RECAP (the honest A→H→I reckoning)

**Lane:** I.W0 RECAP AGENT [recap-prompts]. **Branch:** `tranche-i-dev` (forked off the
broken `master b934a08` — the H close). **Scope:** EVERY user request across the WHOLE
project A→B→C→D→E→F→G→H + the constellation drives + THIS Tranche I ask → its
**claimed status** (what the tranche's own FINAL/recap asserted) vs its **ACTUAL status**
given the live brokenness the user observed on 2026-06-08 and the I-investigation harness
reproduced against the pre-built `dist/gh-pages/` and the dev server `:5174`.

This is the **honest reckoning**. The H close certified ALL 97 `proof:*` gates GREEN
(`tsc` 0, `proof:all`, `proof:browser` 35/35, `proof:chronic-closure`) — and yet the live
demo is DEEPLY BROKEN. This recap names every request that was **claimed-addressed but is
ACTUALLY broken** (the B1–B9 catastrophe + more), reconstructs the gate-blindspot that let
that happen, and feeds the Tranche I authoring. **No drops.**

**Status legend.**
- **ADDRESSED** — landed, gated, and re-verified to HOLD at the live `b934a08` state.
- **REGRESSED** — was genuinely addressed in an earlier tranche, but a later tranche broke it
  (the gate that should have caught the regression is a source-shape gate that cannot see it).
- **BROKEN** — claimed-addressed by its owning tranche's FINAL, but ACTUALLY broken on the
  live demo (the gate-blindspot certified it green). This is the catastrophe class.
- **HANDOFF** — a sibling repo owns it (inv-16); paired with a born-RED kf gate.
- **HELD** — a recurring precept threaded through (not a discrete deliverable).
- **STANDING** — an A→H invariant/gate still green and still load-bearing.

**Method (inv ε — the discipline the catastrophe broke).** Every ACTUAL-status claim below
is grounded in a re-runnable I-investigation probe under
`docs/tranches/I/audit/investigate/probes/` + its captured console/pageerror JSON + a
screenshot under `…/shots/`, OR a tranche FINAL/charter `file:line`. Where the claim is
"BROKEN", the verbatim reproduced error string is cited. **The recap does not theorize from
source alone** — it cites the reproduction.

---

## §0 — THE CATASTROPHE HEADLINE (why Tranche I exists)

Tranche H shipped at `4.1.1` (demo unpublished, deploys to CF Pages) with **ALL 97 proof:\*
gates GREEN**. The H FINAL's own §4 records: `tsc` 0 errors · `proof:all` GREEN (91 inline
gates + vitest) · `proof:browser` **35/35** · `proof:chronic-closure` GREEN ·
`proof:visual-lock` GREEN. The H FINAL's §7 verdict: *"Every H request resolves … the four
chronics are CLOSED via SYSTEM gates with the chronic-closure meta-gate preventing
re-paper."*

**This certification was false-of-the-product.** The user drove the LIVE demo (dev `:5174` +
the built `dist/` reproduces the engine/FSM crashes) and found nine user-visible breakages
(B1–B9), several of which are the EXACT chronics H claimed CLOSED-via-SYSTEM-gate. The gates
check **SOURCE-SHAPE + LOAD-TIME**, not **RUNTIME / INTERACTION / STATE**:

- `proof:demo-console-clean` went green by checking the **HOME LOAD**, not the
  rainbow-group-play interaction that throws (B1).
- `proof:visual-lock` (the H.W8 "appearance axis" keystone) pixel-diffs **idle golden
  renders**, not playing/switching/dragging states.
- `proof:browser` 35/35 exercise source-shape contracts on dist, not the actual
  play→switch→suspend→resume DFA round-trip that crashes (B2).
- `proof:chronic-closure` parses the **ledger TABLE** (a doc), reds only on a bare HANDOFF
  tag — it cannot see that the SYSTEM property it certifies is false at runtime.

This is the gate-blindspot the user has warned about repeatedly (project memory:
*"green source-shape gates miss appearance/interaction/state; audit the RUNNING demo"*) —
and which H itself NAMED as its raison d'être (H.md: *"the actionable band is the demo — and
it is a band G's source-and-contract gate regime was STRUCTURALLY BLIND to"*). **H added an
appearance axis and an interaction axis and STILL certified a broken product**, because the
new axes still measured idle source-shape, not live interaction. The gate-regime OVERHAUL is
Tranche I's headline; this recap is its evidentiary spine.

### The nine live-observed breakages (user report 2026-06-08 · I-investigation reproduced)

| # | Breakage | Reproduced (probe → evidence) | Which CLAIMED request it falsifies |
|---|---|---|---|
| **B1** | The RAINBOW GROUP-PLAY button errors `Error: Parse error at offset 0: "......"` (+ a `this.transform is not a function` cube-group crash) | `probes/b1-group-play.mjs` → `b1-group-play.console.json` (BUILT dist `engine-Do5bTwuK.js`); `b11-playback-summary.json` cube.group.errors | **H.W0 D0** "kill the two live console crashes" → BROKEN (the W0 fix was incomplete) |
| **B2** | DFA suspend/resume `TypeError: undefined is not an object (evaluating 'this._gen')` on play→switch (easing→amiga blank controls) | `probes/b2-dfa-gen-crash.mjs`; `b13-mobile.result.json` easing.console `Cannot read properties of undefined (reading '_gen')` | **H.W1 D12** "the scene+playback state machine (CRITICAL keystone)" → BROKEN |
| **B3** | `/amiga` is "totally broken and floats around" | `probes/b3-amiga-float.mjs` + shots `b3-amiga-0[1-7]-*.png` | **H.W5** amiga scene-quality/perf → BROKEN |
| **B4** | `/easing` LOST the easing-curve/timing editor (the J1–J6 minimalism over-removed it) | `probes/b4-easing-lost-editor.mjs` + shots `b4-easing-0[1-3]-*.png` | **H.W10 G4 / H.W12 J1–J6** easing normalization+minimalism → REGRESSED (over-removed) |
| **B5** | The CSS keyframes editor is broken — shows `/* timing-function: custom — no CSS twin (see console) */` | `probes/b5-keyframes-editor.mjs` + `b5-keyframes-editor.png` | **H.W0 D0 / G.W4** the `serializeEasing` fail-explicit + the editor round-trip → BROKEN-AT-UX |
| **B6** | `/square` drag highlights the controls/dock text (no `user-select:none`) + the drag "does not feel right and does not persist" | `b6-square-drag.md` + `probes/b6-square-drag.mjs` / `b6-select-css.mjs` + `b6-square-drag.png` | **H.W12 I8** "share more between scenes / `useDragScrub`" + **D11** "more interactive" → BROKEN (square hand-rolls, escapes the seam) |
| **B7** | The SPECULAR sheen is STILL present on the glass stages; "are we using the latest glass-ui?" (pinned `~3.5.1`) | `probes/b7-specular.mjs` / `b15-dock-specular.mjs` + shots `b7-*-hover.png` / `b15-*.png` | **H.W2/W9 D14 + W8R** specular refinement → DEFERRED-AS-HANDOFF the user does NOT accept |
| **B8** | ALL dock animations "supremely broken, slow, errored"; glass-ui elements slow | `probes/b8-dock-morph-real.mjs` / `b8-dock-stress.mjs` + `b8-*-dump.json` + `b16-perf-*.json` | **H.W8 D5** dock-lag "CLOSED via passing SYSTEM gate `proof:dock-morph-settled`" → BROKEN |
| **B9** | Dev server `ENOENT: assets/icons/easing-icon-sm.svg` (build uses `easing.svg`) + Source-Map errors ×47 | `probes/b9-dev-mode.mjs` → `b9-dev-output.json`; `probes/b9-icons-assets.mjs` → `b9-probe-output.json` | **H.W5/W10 G1** icon re-instantiation / SVG family → BROKEN (dev-vs-build resolution drift) |

The I-investigation also captured a **net-new engine crash the user did not name**: a
`this.transform is not a function` pageerror at `transformFramesGrouped → _frame` on cube
group-play (`b1-group-play.console.json:19-21`), distinct from the `"......"` lerp parse
error — a SECOND group-play crash path. Both are inv-16 ENGINE surface (`src/animation`),
NOT fenced this tranche (inv-16: runtime correctness may require engine transposition).

---

## §1 — THE A→H STANDING-MANDATE RECAP (the recurring asks, every tranche)

Every tranche carried the same standing development mandate (verbatim-in-substance from the
user, carried A→H): *recap ALL prompts; deeply audit the plan + waves + ALL changes; devise a
path forward; NO quick solutions / NO workarounds — idiomatic, gestalt approaches;
architectural transpositions for elegance/simplicity/performance; NO legacy code; delineate
chronic + deferred and FOLD them; ensure every prompt addressed; tranche-development-only
where stated.* These are the precept spine. Their A→H verdict and their TRUE I-state:

| Standing ask | A→H claimed | ACTUAL at `b934a08` | Note |
|---|---|---|---|
| **recap ALL prompts** | ADDRESSED each tranche (B§, C§, D/E/F/G `prompt-recap.md`, H `_SYNTHESIS-prompt-recap.md` + `prompt-recap.md`) | **HELD as docs; FALSE as product** — the recaps faithfully tracked the COLUMN (gate-green) but not the PRODUCT (live runtime). The H recap's "no drops / every request resolves" is the canonical false-green. This I recap is the corrective. | The recap discipline itself needs a runtime-truth axis (the I overhaul). |
| **deep audit plan + ALL changes** | ADDRESSED (5–35 lane audits per tranche) | **HELD for source/contract; BLIND for runtime** — the audits read `file:line` + gate output, never drove the running demo through play/switch/drag until the user did. | The audit method is the blindspot's twin. |
| **path forward / gestalt / no-workaround / no-legacy / transpositions** | HELD (every FINAL's precept table) | **HELD in letter, VIOLATED in spirit by omission** — e.g. H's W0 "......" fix guarded ONE path (FrameCompiler blank-selector) and left the `CSSKeyframesToString→processFrame` path (B1) uncovered: a symptom-patch at one seam, not the gestalt root-cause the mandate demands. | B1/B2 are the receipts. |
| **fold chronic + deferred (zero perpetual punts, P-invariant-28)** | ADDRESSED (D the terminal home; E/F/G "zero KFE"; H the chronic-closure meta-gate) | **PARTIALLY FALSE** — H's four chronics (cartoon D2, φ-hero D7, mobile D10, dock D5) "CLOSED via SYSTEM gate" are the SAME class of false-close the meta-gate was built to prevent: B7 (specular) + B8 (dock) are D14/D5 still live. The meta-gate policed the ledger doc, not the runtime. | The chronic-closure discipline needs a runtime gate. |
| **NOT-an-implementation-phase (dev-only where stated)** | HONORED each dev wave (D.W0/E.W0/F.W0/G.W0/H dev) | **HONORED** (no source written in dev phases) | This I tranche is ALSO dev-only — docs under `docs/tranches/I/**`, no source fix, no commit. |
| **version owner named for the stacked changeset** | ADDRESSED — **Mike Babb** (`mike@babb.dev`), A→H | ADDRESSED | The publish leg is user-domain, confirm-first (unchanged). |
| **inv-16 (consume published siblings; never patch a sibling in kf)** | HELD A→H; RELAXED in F/G for the user-driven cross-repo drive | HELD | I note: inv-16 EXEMPTS the engine (`src/animation`) — it is the kf PRODUCT, not a sibling; runtime correctness may require engine transposition this tranche. |

---

## §2 — THE PER-TRANCHE ASK→DISPOSITION LEDGER (A→H, claimed vs ACTUAL)

Each tranche's headline deliverables, the gate that claimed them, and whether they HOLD at
the live broken state. Tranches A–C are library/early-demo and largely HOLD; the breakage
clusters in D→H's demo + engine-transposition surface.

### Tranche A (3.0.0) — boundary gated · CI repaired · engine modern-web baseline

| Ask | Wave | Claimed (gate) | ACTUAL | Status |
|---|---|---|---|---|
| Fold kf into the bbnf tranche format; changeset↔tranche contract | A.W0 | format reconciled | holds | ADDRESSED |
| `proof:boundary` — spring-only entry, 0 value.js bytes, bite-proven | A.W3 | `proof:boundary` (inv α) | green through H | **STANDING** |
| `build:lib` glass-ui-free CI; clean-runner publish | A.W1 | clean `/tmp` runner green (inv β) | holds | ADDRESSED |
| `EasingResolvable` — close the silent-linear window; 3 `.ready()` copies → 1 | A.W2 | `easing-resolvable.test.ts` | superseded by B's typed `Easing` (no regression) | ADDRESSED |
| reduced-motion on heavy path; `scheduler.yield()`; WAAPI `linear()` | A.W4 | `engine-modern-web.test.ts` | holds (kernel ALREADY-SOTA per E/F/G) | ADDRESSED |

### Tranche B (3.1.0) — demo made true · engine debt transposed · CI can't ship blank

| Ask | Wave | Claimed (gate) | ACTUAL | Status |
|---|---|---|---|---|
| Prod build paints (extract inline bootstrap → `main.ts`); no blank app | B.W4/W6 | `demo-smoke.mjs` (inv γ) | demo paints at load | **STANDING** (inv γ green) |
| No occlusion on any page × viewport | B.W3 | `occlusion-gate.mjs` (inv δ) | holds for overflow; B6 (square text-select) + B8 (dock) are interaction-occlusion the gate never modeled | ADDRESSED-narrowly |
| Engine debt transposed (one ReducedMotionSnap; 16 TODOs; fail-explicit) | B.W2 | 309 tests; widened `proof:boundary` | the **fail-explicit `serializeEasing` THROW** B introduced is the ROOT of B1/B5 — a correct invariant the demo path does not catch | ADDRESSED-but-weaponized |
| Update all deps; a11y/SEO | B.W1/W5 | dep matrix; `<main>` | the `<main class="contents">` was BROKEN (display:contents strips landmark) — caught + fixed in C | REGRESSED→fixed-in-C |

> **Note on B's fail-explicit.** B honored the invariant A declared: an unresolvable easing
> throws rather than silently degrading to identity. This is CORRECT engine behaviour. The
> catastrophe is that the DEMO surfaces (`KeyframesStringControls`, the group-play adapter)
> feed the engine BLANK/`"......"` state and never guard the throw — so a correct invariant
> becomes a live crash (B1/B5). The fix is at the demo seam AND the engine's blank-input
> guard, not by removing the invariant.

### Tranche C (major) — close made honest · design language whole · engine dogfooded

| Ask | Wave | Claimed (gate) | ACTUAL | Status |
|---|---|---|---|---|
| Make B's 7 asserted-not-met gates TRUE (inv ε) | C.W1 | 7 instruments re-verified | holds (real `<main>`, hard occlusion, π-full, harness checked-in) | ADDRESSED |
| φ-ladder display tier unforked; one display serif | C.W2 | `grep instrument-serif=0` | holds (leaf-tail finished in D) | ADDRESSED |
| Demo dogfoods the engine; reduced-motion honored (inv ζ) | C.W3 | `proof:dogfood` | holds at source-shape; B3/B4 are scene-quality regressions inv ζ cannot see | ADDRESSED-narrowly |
| Engine residuals (drive gen-guard, one tickDt, default css-twin) | C.W4 | 320 tests | holds | ADDRESSED |

> **The inv ε irony.** C INVENTED inv ε ("the close cannot overclaim") and applied it to B's
> seven false-greens. **H violated inv ε at scale** — its FINAL is the largest overclaim in
> the project (97 green gates, broken product). inv ε needs the runtime axis Tranche I builds;
> a checked-in re-runnable instrument that measures IDLE SOURCE-SHAPE is not the same as one
> that proves the PRODUCT works.

### Tranche D (major, in 4.0.0) — demo refined · engine transposed to gestalt · deferrals terminated

| Ask | Wave | Claimed (gate) | ACTUAL | Status |
|---|---|---|---|---|
| Demo decomposed (5 oversized units split; dedup; vueuse) | D.W1 | `proof:decomposition` | holds | ADDRESSED |
| Design language localized (4 rented idioms owned; monolith uncaged; φ leaf-tail) | D.W2 | `proof:idioms`/`proof:localized` (inv η/ι) | holds at source; B9 (icon asset) is a NEW dev-vs-build idiom drift | ADDRESSED + B9-net-new |
| Brittleness hardened (selectors, z-index scale, @supports, reactivity) | D.W3 | `proof:brittleness` | holds at source; B6 (square drag) is a brittle hand-roll the gate did not reach | ADDRESSED-narrowly |
| **Engine transposed (zero-alloc group; `tick`→`advanceTo`; `FrameCompiler` split; pause/resume/toggle)** | D.W4 | `proof:zero-alloc` (inv θ); `proof:engine` | the **`FrameCompiler` split + group compositor** is the surface B1's `this.transform`/`transformFramesGrouped` crash + the `"......"` `processFrame` crash live in | ADDRESSED-then-REGRESSED (the crash path is in D.W4's split) |
| Dock-rename + mobile-composition (D.W5) | D.W5→G.W12 | `occlusion-gate.mjs` | the dock-rename landed in G; B8 (dock lag) + the mobile-occlusion HANDOFF are the live residual | ADDRESSED-then-B8-REGRESSED |

### Tranche E (minor, in 4.0.0) — demo fast · modern-web · vueuse gestalt · engine correctness + orchestration

| Ask | Wave | Claimed (gate) | ACTUAL | Status |
|---|---|---|---|---|
| Encapsulation r2; vueuse listener gestalt (inv κ) | E.W1/W2 | `proof:decomposition`/`proof:brittleness` cl.4 | holds at source; B6 square still hand-rolls (its drag was below E's sweep) | ADDRESSED-narrowly |
| Styling localization r2 (`.gold-shimmer`; dvh; dedup) (inv λ) | E.W3 | `proof:idioms` extended | holds | ADDRESSED |
| Perf budget; Monaco code-split; yield (inv μ) | E.W4 | `proof:lighthouse-mobile` (CI-gated/withheld) | the **Monaco lazy-load** is the surface B9's `vendor-monaco-*.js ERR_ABORTED` failure rides (mobile-cube `b13-mobile.result.json`) | ADDRESSED-then-B9-adjacent |
| **5 engine correctness bugs + test-locked (colorSpace, createFrame index, WAAPI fill-leak, linear() read-back)** | E.W7 | `proof:engine-correctness` (6 lock-tests) | the `createFrame` index-space + `linear()` read-back are the EXACT classes B1/B5 live in (the `"......"`/`custom — no CSS twin` editor failures) — the lock-tests pass on synthetic input, not the demo's blank/custom state | ADDRESSED-on-synthetic / BROKEN-on-demo-state |
| Orchestration tier (stagger/flip/drag/sequence/animate) | E.W10 | unit + `proof:boundary` | additive; sequence scene is B-adjacent (B4 normalization touched it) | ADDRESSED |
| Platform adoption; View-Transitions; CWV | E.W9/W11 | `proof:platform-adopt`/`proof:demo-elevate` | holds at source | ADDRESSED-narrowly |

### Tranche F (minor, published 4.0.0) — narrow SOTA finisher · cross-repo hand-offs driven

| Ask | Wave | Claimed (gate) | ACTUAL | Status |
|---|---|---|---|---|
| Engine perf folds (fast-props, sync-step, computed-endpoint memo −94%) | F.W4-6 | `proof:interp-fastprops` etc. | holds (kernel exemplary) | ADDRESSED |
| **Per-keyframe `animation-timing-function` round-trips; `linear()` css-twin** | F.W7 | `proof:roundtrip-easing` | the **`cssTwinFor` / `serializeEasing`** is precisely B5's `timing-function: custom — no CSS twin` failure surface — the round-trip passes for the uniform case, fails for the demo's custom-closure case | ADDRESSED-uniform / BROKEN-custom (B5) |
| Orchestration dogfood; cohesion; MotionPath; undo/redo; a11y | F.W9-16 | `proof:orchestration` etc. | additive; holds | ADDRESSED |
| value.js / parse-that hand-offs DRIVEN + published | F-handoff | 1607 + 266 tests | published `0.11.0`/`0.9.0` | ADDRESSED |
| Cloudflare Pages deploy adopted; GitHub Pages retired | F deploy | `deploy-pages.yml` | live at keyframes.babb.dev | ADDRESSED |

### Tranche G (4.1.0) — the re-pin spine · narrow additive engine · idiom-drift sweep

| Ask | Wave | Claimed (gate) | ACTUAL | Status |
|---|---|---|---|---|
| Re-pin published siblings; consume F wins (ZERO lib edit) | G.W1/W2 | `proof:deps-current`/`proof:repin-witness` | holds | ADDRESSED |
| `add`/`weighted` blend leaf bug (collapsed to replace) | G.W17 | `proof:blend` | holds (a real net-new bug, fixed) | ADDRESSED |
| Orbital `rotate3d` collapse; scene rAF-leak (dead `onDeactivated`) | G.W18/W9 | `proof:orbital-rotate3d`/`proof:scene-raf-leak` | the orbital + scene-loop surface is where B3 (amiga floats) lives — the rAF-leak fix was source-shape, the float is runtime | ADDRESSED-then-B3-adjacent |
| `fromDrawSVG` · `.finished` · `adoptCompiled` additive API | G.W13/W19 | `proof:drawsvg`/`proof:finished`/`proof:adopt-compiled` | additive; holds | ADDRESSED |
| **D.W5 dock close (TopDock→ChromeDock; `:always-expanded` mask REMOVED)** | G.W12 | `occlusion-gate.mjs` mask-free | the mask removal is the surface B8's dock-lag + the mobile-occlusion HANDOFF live in | ADDRESSED-then-B8-REGRESSED |
| Write the missing D FINAL.md (DP-2) | G.WZ | `D/FINAL.md` exists | holds | ADDRESSED |

### Tranche H (4.1.1) — the demo-quality / design-language / mobile / scene-state tranche — **THE CATASTROPHE**

H is the tranche the user drove across FIVE live-feedback rounds (charter D0–D14, then F1–F9,
G1–G8, I1–I12, J1–J6 + the W8R specular decision). Its FINAL claims every one ADDRESSED. The
live state falsifies the headline cluster:

| # | The H request | Wave / gate (claimed) | ACTUAL at `b934a08` | Status |
|---|---|---|---|---|
| **D0** | Kill the two live console crashes (`serializeEasing`; the `"......"` lerp) | W0 · `proof:demo-console-clean` | **BROKEN (B1+B5).** The `"......"` parse error is BACK, via the `CSSKeyframesToString→processFrame` path W0 never guarded (W0 guarded only the FrameCompiler blank-selector). `serializeEasing` "custom — no CSS twin" is live (B5). The gate checked HOME LOAD, not group-play. Reproduced in BUILT dist. | **BROKEN** |
| **D12** | The scene+playback state machine (CRITICAL keystone) — suspend/save on leave, resume iff was-playing | W1 · `proof:scene-machine-irrefragable` | **BROKEN (B2).** `TypeError: undefined is not an object (evaluating 'this._gen')` on play→switch suspend; easing→amiga shows BLANK controls. The "irrefragable" round-trip gate passed a synthetic state-identity check; the live `_gen` adapter reference is undefined at suspend. | **BROKEN** |
| **D2/D14** | Cartoon depth + specular refinement | W2/W9 · `proof:no-orphan-specular` (inverted ∅) + `proof:specular-handoff` | **DEFERRED-NOT-ACCEPTED (B7).** The sheen is STILL visible on the glass stages; the user does not accept the W8R "keep glass + handoff to glass-ui 3.8.0" decision. The "chronic CLOSED via SYSTEM gate" is a paper close. | **BROKEN / re-opened** |
| **D5** | Dock animations broken/slow/laggy | W8 (consume) · `proof:dock-morph-settled` GREEN (≤+6%) | **BROKEN (B8).** ALL dock animations "supremely broken, slow, errored." The gate read `node_modules` token-ramp on `~3.5.1`; the LIVE dock motion is broken. A passing SYSTEM gate certified a broken product — the chronic re-papered AGAIN, exactly what the meta-gate was meant to stop. | **BROKEN** |
| **D7** | φ-hero typography | W4 · `proof:hero-rung` + `proof:phi-leaf-zero` | holds (the hero rung is a static-render property the visual-lock can see) | ADDRESSED |
| **D10** | Mobile single-page overlay | W7 · `proof:mobile-single-page` + `proof:drawer-spring` | partial — the drawer spring trace is real (`b13` sheetTrace settleMs 173), but mobile cube still throws B1 + Monaco `ERR_ABORTED` (B9) | ADDRESSED-shell / BROKEN-content |
| **D11** | Surviving modes more interactive (draggable like cube orbital) | W5+W12 · `proof:scene-control-dfa` + I3 gates | **BROKEN (B6).** `/square` drag highlights chrome text (no global `user-select:none`) + does not persist (releases to `reseat(0,0)`). The square scene HAND-ROLLS its drag, never using the `useDragScrub` seam I8 claimed unified. | **BROKEN** |
| **G1** | Recover expressive colorful icons; SVG 1:1 | W10 · `proof:scene-icons` | **BROKEN-IN-DEV (B9).** `ENOENT: assets/icons/easing-icon-sm.svg` — dev resolves a path the build renames to `easing.svg`. The pixel-baseline gate ran against the BUILD, blind to the dev-server path. | **BROKEN-dev** |
| **G4 / J1–J6** | Easing stage = ONE engine ball; minimalist easing sidebar (no text input, no value label, full-width slider, no double container, no "ease" title, bigger bezier) | W10/W12 · `proof:easing-stage-is-ball` + `proof:easing-sidebar-minimal` | **REGRESSED (B4).** The minimalism over-removed — the easing-curve/timing EDITOR is GONE; the user wants the easing selector/bezier component BACK. The gate asserted the MINIMAL shape (input removed) — it could not assert "the editor must still EXIST and function." | **REGRESSED** |
| **I8** | Standardize/share `useDragScrub` across scenes | W12 · `proof:dragscrub-single` | **BROKEN (B6).** The gate counted "≤1 hand-rolled drag block across scene TARGETS" but square's drag escaped the target set — so a hand-rolled, unguarded, non-persisting drag shipped green. | **BROKEN** |
| **The recap/precept/deferred/chronic-closure mandate** | H.W8 · `proof:chronic-closure` | **FALSE-GREEN.** The meta-gate parsed the ledger doc and went green; the four chronics it certified (B7/B8 + D2/D5) are live-broken. Policing the COLUMN, not the PRODUCT — the exact failure H named and claimed to have FIXED. | **BROKEN** |

**H's other requests that DO hold** (not every H ask is broken — the honest ledger):
D1 (one-column controls), D3 (easing canvas bounded), D4 (timeline rail-width), D8 (scene
icons exist), D9 (@mbabb popover opens — `b8-dock-probe` confirms), D13 (drawer spring),
F1–F9 layout register, G2/G3/G6/G7 normalization, I1–I7 stage-card/subgrid, I9–I12
encapsulation/styling audits — these are source-shape or static-render properties the gates
can legitimately see, and they hold. **The breakage is concentrated in RUNTIME / INTERACTION
/ CROSS-SCENE-STATE — exactly the axis the gates are blind to.**

---

## §3 — THE CHRONIC LEDGER — the receipts of false-close (A→H → I re-open)

The user has flagged the gate-blindspot repeatedly (project memory's
`feedback_gate_blindspot_appearance_axis.md`: *"green source-shape gates miss
appearance/interaction/state; audit the running demo; chronics exit only via a system gate or
born-RED handoff"*). H built the chronic-closure meta-gate to honor this — and the meta-gate
itself became the largest false-close. The four H chronics, RE-OPENED with their live receipt:

| Chronic | H "closure" (claimed) | The live receipt | I disposition |
|---|---|---|---|
| **Cartoon-shadow / specular (D2/D14)** | CLOSED via `proof:no-orphan-specular`∅ + `proof:cartoon-is-panel-depth`; sheen → glass-ui 3.8.0 HANDOFF (W8R) | **B7** — sheen still visible; user does not accept the handoff; "are we using the latest glass-ui?" | RE-OPEN — re-examine the `~3.5.1` pin, the perf, and whether the user accepts the sheen (they read it as a defect) |
| **φ-hero (D7)** | CLOSED via `proof:hero-rung` + `proof:phi-leaf-zero` | holds (static-render) | CONFIRM-CLOSED (the one chronic that genuinely closed) |
| **Mobile (D10)** | CLOSED via `proof:mobile-single-page` + `proof:drawer-spring` | **B9 + B1** on mobile cube (Monaco abort + the "......" crash); the shell is right, the content crashes | RE-OPEN — mobile correctness rides the B1/B9 engine+asset fixes |
| **Dock (D5)** | CLOSED via `proof:dock-morph-settled` GREEN (token ramp on `~3.5.1`) | **B8** — ALL dock animations supremely broken/slow/errored | RE-OPEN — the gate measured a token, not the live morph; re-investigate glass-ui pin + perf (`b8`/`b16` probes) |

**The meta-lesson, sharpened.** H's `a-deferred-chronic` correctly diagnosed the A→G failure
modes (M1 issue-level-as-system close; M2 scope-narrowing; M3 column-migration-to-HANDOFF) and
built `proof:chronic-closure` to police them. But it added a FOURTH, subtler mode the meta-gate
itself embodies — **M4: SYSTEM-GATE-AS-PRODUCT-TRUTH** — a passing gate that measures a
proxy (a token ramp in `node_modules`, an idle pixel baseline, a ledger-table parse) and is
asserted to prove the live product works. B7/B8 are M4's receipts. Tranche I's gate-regime
overhaul must close M4: **every chronic-closing gate must drive the LIVE interaction the
chronic lives in** (click play, switch scene, drag the box, expand the dock) — not a proxy.

---

## §4 — THE TRANCHE I ASK (THIS engagement) → disposition

The user's verbatim-intent mandate for Tranche I (2026-06-08):

| I-ask | Disposition in this tranche |
|---|---|
| A FULL audit + Playwright investigation with dev tools | **DONE** — the I-investigation harness (`probes/b1…b16`, `shots/`, console JSON) reproduced B1–B9 against the BUILT dist + the dev server `:5174`. This recap is grounded in it. |
| DEEPLY audit the original plan + waves + ALL changes A→H | **DONE** — §2 is the per-tranche claimed-vs-actual ledger; the charters + FINALs A→H all read. |
| Devise a path forward; NO quick solutions / NO workarounds; IDIOMATIC, GESTALT | **AUTHORING** — the I waves (charter + wave specs) own the path; this recap feeds them. B1/B2's root-cause is engine (`src/animation`) + the demo seam, not a symptom patch. |
| Architectural transpositions for ELEGANCE, SIMPLICITY, PERFORMANCE; NO LEGACY | **AUTHORING** — inv-16 exempts the engine; runtime correctness may require engine transposition (the `FrameCompiler`/`transformFramesGrouped`/`processFrame` blank-input + group-play crash paths). |
| Delineate chronic + deferred and FOLD them into this tranche | **DONE** — §3 re-opens the four false-closed chronics (cartoon/specular, mobile, dock) with their live receipts; φ-hero confirmed genuinely closed. |
| Recap ALL prompts + ensure addressed | **DONE** — §0–§3 (this file); no drops; every B1–B9 traced to its falsified claim. |
| The gate-regime OVERHAUL is the headline (close the blindspot for good) | **AUTHORING** — §0 + §3-M4 name the structural defect: gates must drive LIVE interaction, not idle source-shape/proxy. Every I wave gate must click play / switch / drag / expand. |
| TRANCHE DEVELOPMENT ONLY (no source fix, no commit) | **HONORED** — deliverable is `docs/tranches/I/**`; no `src/` or demo edit, no git commit. |
| inv-16: kf consumes published siblings; the engine `src/animation` is the product (NOT fenced this tranche) | **RECORDED** — the engine is in-scope for transposition; the glass-ui specular/dock items (B7/B8) re-examine the PIN + perf, not patch glass-ui in kf. |
| "The broken demo is fine. We'll fix this with our next tranche." (the deployed broken H on master) | **DEFERRED-BY-USER (tracked)** — the `d469e69` deploy-revert is owner-tagged `I-IMMEDIATE-1` in `I.WZ.md`, git-log-verified before any action, but the user elected to LEAVE the live broken demo as a development product; recorded as a deliberate decision, not a silent drop. |
| "The demo name should just be 'keyframes.js'." (the browser-tab title) | **FOLDED → I.W5 (K)** — `demo/app/index.html:7` `<title>` → exactly `keyframes.js`; gated by a runtime `document.title` assertion + the source-vs-build title drift reconciled under B9 (see `audit/feedback/k-demo-name.md`). |

---

## §5 — VERDICT (the honest reckoning)

**The H close overclaimed at the largest scale in the project.** 97 green gates certified a
product with nine user-visible breakages, four of which are the chronics H claimed CLOSED. The
root cause is not negligence in any single wave — it is **structural**: the entire A→H gate
lattice (even H's appearance/interaction-axis additions) measures SOURCE-SHAPE, LOAD-TIME,
and IDLE-RENDER, and asserts those proxies prove the live product. They do not.

**Every B1–B9 traces to a CLAIMED-ADDRESSED request:**
- B1 + B5 → H.W0 D0 (console crashes) — the `"......"` parse error and `serializeEasing`
  custom-twin failure, BACK via paths W0's guard never covered; **reproduced in the BUILT
  dist** (`engine-Do5bTwuK.js`), so the deployed product crashes, not just the dev server.
- B2 → H.W1 D12 (the FSM keystone) — `this._gen` undefined at suspend; blank controls.
- B3 → H.W5 (amiga) — floats/broken.
- B4 → H.W10 G4 / H.W12 J1–J6 (easing minimalism) — over-removed the editor.
- B6 → H.W12 I8 + D11 (drag/interactivity) — square hand-rolls, highlights chrome, no persist.
- B7 → H.W2/W9 D14 + W8R (specular) — sheen still present, handoff not accepted.
- B8 → H.W8 D5 (dock) — supremely broken, the SYSTEM gate certified a broken product.
- B9 → H.W5/W10 G1 (icons) — dev-vs-build asset resolution drift + source-map errors.

Plus the **net-new** `this.transform is not a function` group-play crash (engine
`transformFramesGrouped`) the user did not name but the harness caught — an engine surface in
the D.W4 `FrameCompiler`/group-compositor split.

**No request is dropped, and no false-green is laundered.** This is the receipt H's own inv ε
demanded and H's own FINAL failed to honor. Tranche I's authoring inherits it: the headline is
the gate-regime overhaul (gates that drive LIVE interaction), the engine is un-fenced for the
B1/B2/B3 runtime transpositions, and the four false-closed chronics (cartoon/specular, mobile,
dock) are re-opened with their live receipts. The path forward is gestalt root-cause at the
engine + demo seams, never another proxy-gate that goes green on a broken product.
