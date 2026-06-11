# Tranche I — PROGRESS (the board + the open-deferrals chronic ledger)

**Branch:** `tranche-i-dev` (forked off the broken master `b934a08` = Tranche H's tip).
**Type:** TRANCHE DEVELOPMENT. The deliverable is the docs under `docs/tranches/I/**` — the charter,
the wave specs, the audit corpus, this board, and `PATH-FORWARD.md`. **No source is fixed in the
development phase. No commit is made.**
**Date:** 2026-06-08. **Version in tree:** `4.1.0` (H planned a `4.1.1` patch that did not change the
live engine; I un-fences the engine and will own its own bump at I.WZ).

This board is the spine of the tranche: the catastrophe headline, the wave plan with its REAL
runtime/interaction gates, the per-breakage status, and the §"Open deferrals" chronic ledger that
FOLDS every chronic + deferred item the A→H recaps surfaced. Companion documents:

- **`PATH-FORWARD.md`** — the executive summary (what broke, why the gates missed it, the remediation
  sequence, the deploy-damage-control recommendation).
- **`audit/recap-prompts.md`** — the honest A→H→I prompt reckoning (every request, claimed vs actual).
- **`audit/recap-precepts.md`** — the precept audit (which H precept was honored vs violated, why).
- **`audit/recap-chronic.md`** + **`audit/recap-deferred.md`** — the chronic + non-chronic ledgers
  this board's §"Open deferrals" folds.
- **`audit/rootcause-rc-*.md`** — eight per-surface root-cause docs (the design input for the waves).
- **`audit/investigate/**`** — the Playwright probes, console JSON, and screenshots that reproduced
  B1–B9 first-hand against the built `dist/gh-pages/` + the dev server `:5174`.

---

## §0 — THE HEADLINE (why Tranche I exists)

> **Superseded by:** `docs/tranches/I/impl/I-WZ-verify.md` (the post-close deploy/CI state) +
> Tranche J. This section's deploy/staleness facts (master behind, the live demo on the broken H
> tip, the d469e69 revert recommendation) are DEV-phase history, frozen as written (J.W5 S6,
> pointer-only).

Tranche H shipped with **ALL ~97 `proof:*` gates GREEN** — `tsc` 0, `proof:all`, `proof:browser`
35/35, `proof:visual-lock`, `proof:chronic-closure` — and its FINAL declared every request resolved
and the four chronics CLOSED. **The certification is false of the product.** The user drove the live
demo on 2026-06-08 and found NINE user-visible breakages; the I-investigation harness reproduced all
nine first-hand. The single gesture the user performs first — press the rainbow group-play — throws an
uncaught error.

**The root cause is structural, not a single negligent wave.** Every H gate's ORACLE is a PROXY one or
more steps removed from the running product (source text · jsdom · a localStorage snapshot · a
subject-masked self-baseline · a design-token number · a markdown table). The born-RED→green discipline
laundered each proxy into a correctness claim. ~54 of ~98 nominal correctness gates (102 `proof:*` proof
keys − 4 meta/aggregators; see `audit/rootcause-rc-gate-blindspot.md §1` for the census) cannot by
construction see a runtime defect; the ~34 that open a browser rest on load, round-trip a proxy store,
diff a masked self-baseline, or assert the wrong DOM projection — **and not one drives PLAY-then-SWITCH
and asserts a clean console.** The keystone `proof:chronic-closure` is ITSELF a source-shape gate that
parses a markdown table. **The gate-regime OVERHAUL is the tranche's headline — bound at I-open as a
charter invariant (the gate-ORACLE precept, mechanically prior), and CLOSED by I.W7 whose
`proof:live-session` battery assembles from each wave's interaction leg.**

**IMMEDIATE (acted on independent of the waves — see `PATH-FORWARD.md §4`).** `keyframes.babb.dev` is
a Cloudflare Pages project that auto-deploys on **every GREEN-CI master push** (`deploy-pages.yml`, the
tip-commit path filter dropped at `d469e69`). H's close `b934a08` pushed to master GREEN → **the broken
demo is almost certainly LIVE.** Recommendation: **REVERT master to `d469e69`** (the last pre-H commit,
a clean ancestor 20 commits back) to take the broken product off the air; HOLD the npm publish; do NOT
re-deploy until I lands. The gate-blindspot that certified the breakage green is the same mechanism
that auto-shipped it.

---

## §1 — THE BOARD (waves × status)

Status legend: **AUTHORED** (wave spec written this dev phase) · **PENDING** (spec to author) ·
**LANDS** (implementation-phase, not this tranche). Every wave's gate is a REAL
runtime/interaction gate (drives PLAY / SWITCH / DRAG and asserts a product property) — the precept the
overhaul binds; no source-shape check may carry correctness authority.

| Wave | Charge | Owns | Headline gate (REAL runtime) | Dev status |
|---|---|---|---|---|
| **I.W0** | **B1/B5 the empty-value parse crash (CRITICAL, engine transposition — LEADS the fix waves, poison removal)** — value.js never hands `""` to the parser (empty read-back → declared fallback / typed-empty unit, the H.W0 selector-guard's TWIN at the value seam); serialize from the DECLARED template not a DOM-resolving `at()`; default `AnimationGroup.transform` to a no-op at the FIELD; short-circuit empty-group `play()`; kill the mis-attributing placeholder | `src/animation` (un-fenced) · value.js (defense-in-depth) · the serialize seam | the session probe reds on the play click at HEAD (CLICK rainbow play on HOME — the empty-home-group repro — AND cube); greens only when both seams are total + a `.cube` transform delta proves the loop is live | AUTHORED (#147) |
| **I.W1** | **B2 the DFA suspend/resume crash (CRITICAL, engine + composable)** — make `RAFPlayback`'s control surface BIND-PROOF by construction (closes the whole unbound-method class); consolidate the duplicated raw-rAF boilerplate into one `useRafScene` with bound callbacks; PRESERVE the pure reducer's suspend/resume-iff-was-playing algebra; order-independent control-panel mount | `src/animation/playback.ts` · the demo raw-rAF composables | the session probe plays a raw-rAF scene, fires `visibilitychange→hidden` (the SYNTHETIC born-RED-of-record) in ONE persistent context → no throw + the leaving scene suspends + the incoming resumes-iff-was-playing + destination controls non-blank; the dock-Select switch leg is the integration assertion, gated after B8's dock is hit-testable. `unbound-method` lint is a HYGIENE corroborator | AUTHORED (#148) |
| **I.W2** | **B4 the easing editor blank-on-switch + restoration** (folds mobile M2 controls-reachability) — single-source the SELECTED control surface from the DFA so `<Tabs>` is born-correct on every entry; `force-mount` single-surface scenes; KEEP the dropdown + editable bezier, fold back read-only value+copy, unify the two bezier hosts onto one `EasingEditor` | the controls-Tabs seam · the easing editor | switch INTO easing → `.easing-curve-canvas` present + `display!==none` + a handle-drag MUTATES the path `d`; the dropdown re-renders the curve; the mobile sheet body can SCROLL to its content (M2) | AUTHORED (#149) |
| **I.W3** | **B3 the amiga geometry** — unify subject = orbit pivot = framing (centre the sphere, `controls.target` tracks it) so the centre HITS the sphere + the drag-to-spin→decay-glide is reachable | the amiga scene runtime | drive a centre-canvas drag → the SPHERE moved + the room did NOT tumble | AUTHORED (#150) |
| **I.W4** | **B6/B8 drag + perf** (folds mobile M3 dock retune; folds B3 RC-2) — lift global gesture-scoped select-suppression into the shared `useDragScrub` seam; migrate square's hand-roll onto it with `releasePolicy: persist`; drive the easing sweep dot via a non-reactive `style.transform` write; ONE composed `RAFPlayback` driver per scene; drop `content-visibility:auto` from the live WebGL root (B3 RC-2) | the shared drag composable · the per-scene frame driver · the WebGL root | `proof:drag-gesture` (no text-selection over swept chrome + transform persists, EVERY drag surface) + `proof:perf-frame-budget` (CDP CPU-throttled, threshold BOUND from `b16`, dropped-frames ≤ the bound budget on the playing scene + dock expand; fails on ReadPixels/content-visibility warns) | AUTHORED (#151) |
| **I.W5** | **B9/K hygiene + shell chrome** (folds mobile M1 layout; DC-8) — collapse the demo build to one canonical `outDir` (the default-outDir landmine); delete the Mar-25 `demo/app/dist/` orphan; dev SPA-fallback 404s asset-extension misses honestly; tab title = exactly `keyframes.js`; verify DC-8 dead-CSS grep = 0 (default KILL); `sheet.bottom ≤ menubar.top` from MEASURED menubar height (M1) | the build/asset single-source · the shell chrome | one runtime icon-paint + zero-asset-404-during-interaction gate (clicks every scene + the editor); retire source-shape `proof:scene-icons`; `document.title === "keyframes.js"`; a HYGIENE-tier `engine.ts ≤ 1400 OR named-measured split` ceiling clause (C-6) | AUTHORED (#152) |
| **I.W6** | **B7 the specular consume-edge** (folds mobile M3 dock `transition` retune via the same pin) — two-sided, no kf fork: (1) drive glass-ui to PUBLISH `v3.8.0` (the `specular="off"` default exists at glass-ui HEAD, tagged locally, unpublished — coordination ask to AX); (2) bump kf's pin to v3.8.0 + ride the new flat default (zero kf CSS); give the page substrate real depth to refract | the glass-ui consume-edge · the demo page chrome | invert the gate — assert the bloom is ABSENT at rest on a RUNNING stage + dock tracks, the PRIMARY oracle a PERCEPTUAL luminance delta (class-absence is a HYGIENE corroborator, NOT an OR-escape); DELETE `proof:specular-handoff`; REJECT the `::before{content:none}` workaround | AUTHORED (#153) |
| **I.W7** | **THE GATE-REGIME OVERHAUL (headline; CLOSES)** — install `proof:gate-is-runtime` (the machine enforcer of the t=0 gate-ORACLE precept charter invariant); ASSEMBLE `proof:live-session` (the interaction-driven, zero-error-budget session probe) from the per-wave legs; the structured error-budget allowlist (defined once, inherited); two-tier HYGIENE/CORRECTNESS taxonomy; re-author `proof:chronic-closure` to verify cited gates are runtime gates that BIT; DELETE `proof:specular-handoff`; author `proof:no-route-storm`'s real intent INTO the harness | the whole gate regime | `proof:live-session` — per scene: load → CLICK play → hover-expand dock + SWITCH every scene → fire visibilitychange on a playing raw-rAF scene → DRAG square + bezier handles → switch back → replay; oracle = accumulated error budget 0 + product-facing DOM; GREEN only once I.W0–I.W6 land | AUTHORED (#154) |
| **I.WZ** | the close — FINAL.md · prompt-recap · the IMMEDIATE `d469e69` deploy-revert tracked+verified · the I changeset (version owner **Mike Babb**) · the deploy (user-domain, confirm-first) | — | the full I suite GREEN on a tree where a human using the product sees it work | PENDING |

> **Wave dependency note.** The gate-ORACLE precept LEADS as a CHARTER INVARIANT bound at I-open
> (t=0), mechanically prior, enforced by `proof:gate-is-runtime` — NOT as a wave. The gate-regime
> OVERHAUL (I.W7) CLOSES: its `proof:live-session` battery is the UNION of every wave's interaction
> leg, so it is fully green only once I.W0–I.W6 land. Among the FIX waves, I.W0/W1 (the crashes) lead
> — they "poison every other measurement." I.W2–W6 follow. The engine is un-fenced for I.W0/W1/W3
> (inv-16 for I: `src/animation` is the kf PRODUCT, runtime correctness may require engine
> transposition). The mobile seams (M1/M2/M3) fold into I.W2/I.W4/I.W5/I.W6, not a separate wave.

---

## §2 — THE BREAKAGE LEDGER (B1–B9 + K → root cause → falsified claim → wave)

Every breakage is reproduced first-hand (probe + console JSON + screenshot under `audit/investigate/`)
and traced to a confirmed root cause (`file:line`) in its owning `rootcause-*.md`.

| # | Breakage (user report) | Confirmed root cause | Falsified H claim | Wave |
|---|---|---|---|---|
| **B1** | rainbow play throws `"......"` + `this.transform is not a function` | `group.ts:373` unguarded `this.transform()` on an empty group (field `:38` never assigned, dead lazy-comment `:118-122`) + value.js `normalize.ts:213-217` `parseCSSValueUnit("")` on an unset `var(--rotationX)` | H.W0 D0 "kill the two live console crashes" — the W0 fix guarded the FrameCompiler blank-SELECTOR, never the computed-VALUE read-back | I.W0 |
| **B2** | DFA suspend throws `this._gen`; easing→amiga blanks controls | `useEasingDemo.ts:227` + `useSpringDemo.ts:365` pass UNBOUND `playback.stop` → `playback.ts:216` `this._gen++` throws in the Vue flush | H.W1 D12 "the scene+playback state machine (CRITICAL keystone)" — the gate round-tripped a localStorage snapshot, stubbed the live adapter | I.W1 |
| **B3** | `/amiga` "totally broken, floats around" | subject `(-5,-5,-5)` ≠ `OrbitControls.target (0,0,0)` (`AmigaScene.vue:137-150`) → centre drag tumbles the room; `content-visibility:auto` over a live WebGL loop (`:263-266`) → ReadPixels stall | H.W5 amiga scene-quality/perf — `proof:visual-lock` masked the canvas OUT and self-captured a defect baseline | I.W3 (geometry) + I.W4 (RC-2 perf) |
| **B4** | `/easing` lost the curve/timing editor | reka `<Tabs>` `useVModel` latches `passive` from `modelValue===undefined` on switch-mount → `TabsContent value="easing"` `isSelected:false` → `display:none` (panel hidden, NOT removed) | H.W10 G4 / H.W12 J1–J6 — `proof:scene-control-dfa` asserted the chrome tab LABEL, not the mounted PANEL; the minimal-shape gate codified the strip | I.W2 |
| **B5** | keyframes editor `/* timing-function: custom — no CSS twin */` | the SAME empty-`var()` parse defect as B1 on the serialize path, swallowed by a `try/catch` floor that mis-attributes every throw | H.W0 D0 / G.W4 — the gate asserted the placeholder EXISTS (the floor IS the success criterion) | I.W0 |
| **B6** | `/square` drag highlights chrome + does not persist | no GLOBAL select-suppression (`SquareScene.vue:2` scopes it over a `window` drag); `pointerup → reseat(0,0)` (`:104`) discards the drag; square hand-rolls, bypassing `useDragScrub` | H.W12 I8 + D11 — `proof:dragscrub-single` counted drag blocks, never DROVE a drag | I.W4 |
| **B7** | specular sheen STILL present; "latest glass-ui?" | glass-ui `~3.5.1` `<Card surface="glass">` emits `.glass-specular-track` with `--mouse-x` never written → dead-centred bloom on stages + 9–11 dock tracks; opt-out only in unpublished glass-ui `v3.8.0`; 3.7.0 makes it worse | H.W2/W9 D14 + W8R — `proof:no-orphan-specular` recorded the bloom as accepted residue; `proof:specular-handoff` born-RED against vaporware 3.8.0 | I.W6 |
| **B8** | ALL dock animations "supremely broken, slow, errored" | composite: dock `transition: width` (`dock.css:512`) under `backdrop-filter` → 12/114 dropped on expand; `/easing` per-rAF reactive `ref` → 243-node SVG storm 46fps; 4–6 stacked rAF loops/scene; "errored" = B1 console bleed | H.W8 D5 "CLOSED via `proof:dock-morph-settled`" — the gate measured a token-ramp peak, not the live frame budget | I.W0 (B1 console half) + I.W4 (perf + B7 pin) |
| **B9** | dev `ENOENT easing-icon-sm.svg` + 47 source-map errors | stale `demo/app/dist/` (Mar-25 default-outDir landmine) + stale Vite graph; SPA-fallback masks it as 200-HTML; built `dist/` is CLEAN; x47 = dev-only dep-optimizer noise | H.W5/W10 G1 icons — `proof:scene-icons` checked source-shape + the build; the orphaned-rename hid behind the SPA fallback | I.W5 |
| **K** | tab title should be exactly `keyframes.js` | `demo/app/index.html:7` long subtitle; a build-time short title masks the source drift (B9 family) | new feedback (2026-06-08) | I.W5 |

**Net-new engine fault the user did not name** (harness-caught, folded into I.W0): the
`this.transform is not a function` cube-group crash (`group.ts:373`) is a SECOND group-play crash path
distinct from `"......"` — an empty group's unseeded `transform` field.

---

## §3 — THE A→H PRECEPT RECKONING (which precept held, which broke)

From `recap-precepts.md`. The precepts that police SOURCE HYGIENE held; every precept that bears on
RUNTIME CORRECTNESS was violated, because the gate regime locks source-shape + load-time and calls it
correctness.

| Precept | H verdict | The decisive anchor |
|---|---|---|
| **no-legacy** | HONORED (mechanically) | replacements deleted in one motion; the one precept whose oracle (source text) IS the right oracle |
| **no-workaround** | **VIOLATED** | W0's `serializeEasing`/`"......"` fixes were symptom-neutralizers at the WRONG seam + a narrowed-regex gate; B1 is BACK via the un-guarded serialize path |
| **idiomatic + gestalt** | **VIOLATED** | the FSM keystone throws `this._gen` on its own suspend transition (B2); a gestalt FSM cannot throw on its primary edge |
| **isomorphic styling** | PARTIAL / moot | the 7 named deltas held as authored, but B3/B6/B7 prove the rendered RESULT was never measured against intent |
| **KISS** | **VIOLATED** | 88 proof scripts, 13 waves, a 1074-line FSM gate — and the product is more broken than at 4.1.0; the simplest oracle (a human opening the demo) would have caught B1–B9 |
| **measure-first** | **VIOLATED at the meta-level** | every PERF claim was benched; every CORRECTNESS claim was asserted against a gate that never measured the live interaction |
| **inv-16** | HONORED (but masking) | kf consumed glass-ui `~3.5.1` un-forked — but inv-16 was the vehicle to defer B7/B8 to HANDOFFs against vaporware |
| **chronic-closure / born-RED gate** | **CATASTROPHICALLY VIOLATED (the headline)** | `proof:chronic-closure` parses a markdown table — a source-shape gate auditing other gates' paperwork; the durability keystone is the deepest expression of the blindspot it was built to close |

**The I-born precept (BOUND as a charter invariant at I-open, t=0 — see `I.md §invariant set` +
`§ The precept is MECHANICALLY PRIOR`; enforced by `proof:gate-is-runtime`):** *A gate's ORACLE must
be the PRODUCT PROPERTY a human would check, exercised through the SAME surface the human uses, with
an ERROR BUDGET OF ZERO across PLAY + SWITCH + DRAG. A gate whose oracle is source text, a jsdom unit,
a serialized snapshot, a self-captured baseline, a design-token number, or a paperwork ledger is a
HYGIENE gate,
not a CORRECTNESS gate, and MUST be labeled as such — it may never count toward a correctness or
chronic-closure tally.*

---

## §4 — Open deferrals (THE CHRONIC LEDGER — folds chronic + deferred from the recaps)

This is the canonical fold the I mandate requires: every chronic + deferred item the A→H recaps
surfaced, with its TRUE live state and an I disposition. It supersedes H's `## Open deferrals` table,
which `proof:chronic-closure` parsed as the durability oracle. **Per the I-born precept, NO row in this
ledger may close via a source-shape / load-rest / proxy gate — closure requires a runtime/interaction
gate that was witnessed born-RED on the defect tree.** Disposition vocabulary: **FOLD** (into an I
wave) · **RE-OPEN** (false-closed chronic, folded) · **RE-AFFIRM** (genuinely closed; do not
re-litigate) · **HANDOFF** (sibling-owned, paired with a kf gate) · **BOOK** (net-new, stays deferred)
· **MEASURE-FIRST** · **RECORD/KILL** (terminal).

## Open deferrals

**The canonical chronic-closure substrate (the parseable table `proof:chronic-closure` reads).** This
table SUPERSEDES H's `## Open deferrals` table. Per the I-born precept (S4), every closure cell cites
a RUNTIME gate — its script opens a browser AND ACTUATES the product (click / switch / drag / fire
visibility) AND was witnessed born-RED on the `b934a08` defect tree — never a source-shape / load-rest
/ proxy-store gate. A HANDOFF row may target ONLY a PUBLISHED version or a kf-owned consume-edge fix,
never a future version number / unreleased commit (the B7 vaporware lesson); and every gate must
measure the PIXEL / INTERACTION the user reports (the M1 mobile / B9 icons / B8 dock lessons). The
narrative 4a–4f tables below carry the full live-state probe + disposition; this table is the gate's
parse target.

| Chronic | Prior false-close mode | I closure (the RUNTIME gate that BIT) |
|---|---|---|
| **CH-1 cartoon-shadow / specular (D2/D14)** | H closed via the source-shape `proof:no-orphan-specular` (RECORDED the bloom as residue) + a born-RED HANDOFF against the VAPORWARE glass-ui 3.8.0 (`proof:specular-handoff`) | **SYSTEM gate** — `proof:specular-absent-at-rest` (RUNTIME: the rendered `::before` alpha at rest is ≤0.05 on every glass stage + dock track, by the pixels; born-RED on the 3.5.1 bloom). The vaporware IOU `proof:specular-handoff` is DELETED; the consume-edge is the PUBLISHED + consumed glass-ui `~3.9.0` flat default (a kf-owned consume-edge, NOT a future version). The cartoon-PANEL depth half stays re-affirmed at the H source-shape scope (the panels read correctly; not re-opened). |
| **CH-2 φ-hero typography (D7)** | M1 — issue-level close as system close | **RE-AFFIRM** — genuinely closed at the asserted scope (the user did not re-flag it). The runtime appearance is now corroborated by `proof:live-session` (RUNTIME: the body-typography leg of the interaction battery, born-RED on `b934a08`); no I re-open. |
| **CH-3 mobile architecture (D10)** | M2 — scope-narrowing + wrong-axis gates (`sheet.top` not `sheet.bottom`); then a DESKTOP-oracle closure (`proof:perf-frame-budget`+`proof:drag-gesture` at 1440 — the felt seams, but never the mobile axis; INVE-2) | **SYSTEM gate (RE-CERTIFIED at J.W4 S7 on the chronic's OWN axis)** — `proof:live-session-mobile` (RUNTIME: a REAL 390×844 + `hasTouch` context drives the sheet open/scroll/close/RE-OPEN + dock switch + touch-drag + play, ALL touch gestures, and HARD-gates the occlusion geometry `sheet.bottom ≤ menubar.top` at BOTH detents — device-INDEPENDENT per P6, never observe-only'd; born-RED of record: the gate BIT on the live pre-cure tree where the always-expanded TransportDock overran the token-derived `--dock-band-reserve` and the menubar painted over the open sheet's bottom control row by 32px at 390×844 — sheet.bottom 762 > menubar.top 730, the M1 class live; cured by deriving the sheet anchor from the MEASURED menubar, `--menubar-measured-h` via TransportDock ResizeObserver + style.css max(), exactly this row's prescribed cure; RED→GREEN witnessed, plus the planted-detent dist mutation re-witness). This REPLACES the desktop-oracle closure: the felt-perf half stays `proof:perf-frame-budget` (observe-only-in-CI per P6); the human-visible occlusion half now hard-gates ON the mobile viewport. |
| **CH-4 dock (D5 lag + D9 popover)** | M3 — D5 column-migration to the source-shape `proof:dock-morph-settled` (a `--spring-dock` token-peak, NOT the felt frame budget) | **SYSTEM gate** — `proof:perf-frame-budget` (RUNTIME: drives the dock hover-expand + measures dropped frames under a CPU throttle — the felt budget the token-peak proxy could not see; born-RED witness HEAD 12/114). The D5 spring re-affirms; the felt "broken dock" the user reported decomposes into B1 (`proof:engine-no-throw-on-play`) + the dock perf (`proof:perf-frame-budget`). |
| **CH-5 the `"......"` empty-value crash (B1/B5)** | H.W0 claimed KILL; guarded only the FrameCompiler blank-selector — the source-shape `proof:demo-console-clean` rested + narrowed its regex | **SYSTEM gate** — `proof:engine-no-throw-on-play` (RUNTIME: CLICKS the rainbow group-play on home + cube, reads the LIVE console for the bare-`"......"` parse fingerprint + the cube draw-loop transform; born-RED on `b934a08`). |
| **CH-6 the `_gen` DFA suspend/resume crash (B2)** | H.W1 keystone claimed a suspend→restore identity via the proxy-store `proof:scene-machine-irrefragable` (a localStorage round-trip; never fired visibilitychange) | **SYSTEM gate** — `proof:fsm-suspend-resume-live` (RUNTIME: PLAYS a raw-rAF scene + fires a synthetic visibilitychange→hidden + switches → asserts ZERO `_gen` throw against the LIVE adapter; born-RED on the source-mapped `:5174` deterministic reproduction). |
| **CH-7 lost easing editor (B4)** | NEW — H's `proof:scene-control-dfa` asserted the chrome tab LABEL, not the mounted PANEL (wrong-projection) | **SYSTEM gate** — `proof:easing-editor-live` (RUNTIME: SWITCHES into easing + asserts the `.easing-curve-canvas` mounts active + a handle-DRAG mutates the path; born-RED on the reka passive-latch blank). |
| **CH-8 amiga floats (B3)** | NEW — H's `proof:visual-lock` MASKED the canvas out (self-baseline) | **SYSTEM gate** — `proof:amiga-subject-is-pivot` (RUNTIME: a CENTRE-DRAG moves the subject not the room, measured by canvas-region MAD; born-RED on the HEAD whole-room re-projection). |
| **CH-9 square drag selects text / no persist (B6)** | NEW — un-gated (no gate existed) | **SYSTEM gate** — `proof:drag-gesture` (RUNTIME: a real `page.mouse` DRAG over a chrome label selects no text + the box transform persists; born-RED on the missing select-suppression seam). |
| **CH-10 dev ENOENT icon + the demo title (B9/K)** | NEW — the source-shape `proof:scene-icons` was blind to the orphaned-rename (the SPA fallback masked the 404) | **SYSTEM gate** — `proof:icon-paint-live` (RUNTIME: every `SceneDescriptor.icon` PAINTS a non-zero inline `<svg>` + zero asset-404 during interaction + `document.title === "keyframes.js"`; born-RED on the orphaned-rename). |

### 4a — The four H "closed" chronics, re-examined against the running demo

| Chronic | H claimed | I live TRUE state (probe) | I disposition |
|---|---|---|---|
| **CH-1 cartoon-shadow / specular (D2/D14)** | CLOSED via `proof:no-orphan-specular`∅ + `proof:cartoon-is-panel-depth`; sheen → glass-ui 3.8.0 HANDOFF | cartoon PANELS read correctly; the SHEEN is STILL on every glass stage + 9–11 dock tracks/scene (`--mouse-x` never written); HANDOFF target VAPORWARE (`b7`/`b15`) | **RE-OPEN → FOLD I.W6** — re-own the consume-edge; invert the gate to assert bloom ABSENT at rest; delete `proof:specular-handoff` |
| **CH-2 φ-hero typography (D7)** | CLOSED via `proof:phi-leaf-zero` + `proof:hero-rung` | GENUINELY CLOSED at the asserted scope — the user did not re-flag it; the model close (enforced 0 leaves + the hero rung) | **RE-AFFIRM — do NOT re-litigate.** (B4 is a SEPARATE easing-editor defect, not this chronic) |
| **CH-3 mobile (D10/D13)** | CLOSED via `proof:mobile-single-page` + `proof:drawer-spring` | bones REAL (full-bleed stage + real underdamped `SpringProgress` drawer, settle 169–175ms); THREE un-gated seams: **M1** menubar (z40) occludes the sheet (z20) by 12px; **M2** sheet body clips controls (the editor unreachable, folds B4); **M3** `transition:all` dock jank (folds B8) (`b13`) | **PARTIALLY-PAPERED → FOLD** — derive sheet anchor from MEASURED menubar height; drive `isPanelTransitionDone` off the spring settle; scope dock transitions; gates measure `sheet.bottom ≤ menubar.top` + controls reachability |
| **CH-4 dock (D5 lag + D9 popover)** | D5 CLOSED via `proof:dock-morph-settled`; D9 via `proof:dock-popover-opens` | D5 spring GENUINELY settled (dock-morph stress 120fps, `widthWrites:0`, `b8`); the user's "broken dock" is a DIFFERENT bundle = B1 console flood + M3 `transition:all` + RC-2 ReadPixels stalls | **D5/D9 RE-AFFIRM; the felt "broken dock" → FOLD as B1 + M3 + RC-2** (I.W0 + I.W4 + I.W6 pin) |

**The meta-lesson (the durability mechanism's two failure modes the overhaul must close):**
(1) a born-RED HANDOFF parked against a VAPORWARE version never bites (specular → 3.8.0); (2) a SYSTEM
gate that measures the wrong axis passes vacuously (mobile `sheet.top` not `sheet.bottom`; icons hidden
by the SPA fallback; dock token-peak not frame budget). The chronic-closure ARCHITECTURE is sound — the
I overhaul does not replace it; it forbids born-RED gates against unpublished/vaporware targets and
forces every cited gate to measure the PIXEL/INTERACTION the user reports.

### 4b — The crash chronics (H-era regressions BACK via un-gated paths — the headline folds)

| Item | History | I live TRUE state | I disposition |
|---|---|---|---|
| **B1/B5 the `"......"` empty-value crash** | H.W0 (`25a6434`) claimed to KILL it; guarded the FrameCompiler blank-SELECTOR only | BACK via `CSSKeyframesToString → at() → processFrame → parseCSSValueUnit("")` (interp) + the serialize path; reproduced in BUILT dist | **FOLD I.W0 (CRITICAL)** — engine transposition (serialize-from-template + group no-op transform) + value.js empty-input contract (defense-in-depth); kill the lying placeholder |
| **B2 the `_gen` DFA suspend/resume crash** | H.W1 (`256f6fe`) keystone claimed suspend→restore an identity | unbound `RAFPlayback.stop` throws `this._gen` in the Vue flush; blank controls on switch | **FOLD I.W1 (CRITICAL)** — bind-proof `RAFPlayback` + `useRafScene` consolidation; preserve the (correct) pure reducer |

### 4c — The other live defects (B3/B4/B6/B9 + K)

| Item | Class | I disposition |
|---|---|---|
| **B3 amiga floats** | NEW (H.W5 rebuild defect — subject ≠ orbit pivot + RC-2) | **FOLD I.W3** (geometry) **+ I.W4** (RC-2 perf) — geometric transposition (centre subject = pivot = framing); drop `content-visibility:auto` from the WebGL root |
| **B4 lost easing editor** | NEW (controlled-`<Tabs>` `passive`-latch desync on switch; NOT a J over-removal) | **FOLD I.W2** — single-source the selected surface from the DFA; restore dropdown+bezier+readout on one `EasingEditor` |
| **B6 square drag** | NEW + LATENT-CLASS (no global select-suppression anywhere; non-persist) | **FOLD I.W4** — lift select-suppression + `releasePolicy` into the shared drag seam |
| **B9 dev ENOENT + sourcemaps** | HYGIENE (built dist clean) | **FOLD I.W5 (low)** — one canonical `outDir`; delete the Mar-25 orphan; SPA-fallback 404s asset misses; runtime icon-paint gate |
| **K demo name** | trivial shell chrome | **FOLD I.W5** — `<title>keyframes.js</title>`; gate `document.title` on the deployed demo |
| **DC-8 scene-swap dead-CSS** | twice-deferred A→C carry (out of forward-references) | **FOLD I.W5-DECIDE (no fourth defer)** — `grep` = 0 after KILL-or-RESTORE-via-`startViewTransition` (default KILL unless a live VT consumer exists) |

### 4d — Sibling HANDOFFs / pins (re-verified live; correctly OUT, save the two prime folds)

| Item | Live state | I disposition |
|---|---|---|
| **glass-ui specular `specular="off"`** | the fix is at glass-ui HEAD, tagged local `v3.8.0`, **UNPUBLISHED** (npm latest 3.7.0, which makes the bloom MORE pervasive) | **HANDOFF + KFI consume-edge (I.W6)** — drive a glass-ui PUBLISH, then bump kf + ride the new flat default; do NOT re-park born-RED against vaporware |
| **glass-ui dock `transition:all` → transform/opacity** (M3/B8) | `~3.5.1` dock primitive animates layout, mobile-acute jank | **HANDOFF (glass-ui, rides the I.W6 v3.8.0 pin) + born-RED kf perf gate (I.W4)** |
| **glass-ui dock-spring retune (D5)** | GENUINELY landed — 120fps clean, gated, honest (the model HANDOFF) | **RE-AFFIRM (done)** — the dock-spring memory rule ("dock fixes in glass-ui, never patched in demo") is CORRECT; do NOT relax it |
| **glass-ui pin currency** ("latest glass-ui?") | kf `~3.5.1`, npm latest 3.7.0; a naive bump WORSENS the sheen | **MEASURE-FIRST (I.W6)** — coupled to the specular disposition; bump straight to v3.8.0, skip 3.6/3.7 |
| **value.js empty-input parse contract** (B1) | NEVER a booked handoff; the value.js half of the I.W0 fix | **value.js-HANDOFF (defense-in-depth) + KFI engine transposition (I.W0)** |
| **value.js next-slice** (linear parser, path sampler, color sentinels, identity pad, diagnostics sink, buffer overload, LRU) | OPEN in 0.11.1; rides the next re-pin ZERO kf edit; the `it.fails` MCI-5 witness IS the consume signal | **value.js-HANDOFF (CHRONIC-by-design C-1, the process working) — NOT an I wave** |
| **parse-that `(id,offset)` packrat re-key** (PT-1) | WITHHELD; isolated opt-in, zero production consumers | **parse-that-HANDOFF — author `proof:packrat-position` first; NOT an I fold** |
| **`{types}` directional VT helper** (GH-4/FB-4) | glass-ui-owned (AX); the demo VT consumer waits | **glass-ui-HANDOFF (BOOK) — folds only IF I elects D11 scene interactivity** |
| **glass-ui `LabeledField orientation`** (G-3) | glass-ui-owned; kf greens demo-side `grid-cols-[auto_1fr]` | **glass-ui-HANDOFF (HIGH for the durable home); kf demo-side path exists** |

### 4e — Engine / perf BOOKs (net-new scope; stay deferred unless elected)

| Item | State | I disposition |
|---|---|---|
| **`animation-composition` HONORING** (FB-1) | CAPTURE landed; the G.W17 blend prereq is FIXED | **BOOK (engine, un-blocked) — SHIP-if-elected** |
| **`Animation`/group async sync-step half** (FB-2) | still async `advanceTo` (carries `yieldToMain` INP relief) | **MEASURE-FIRST — build `proof:event-ordering` first** |
| **SoA `lerpArray`** (G-2) | gated MEASURE-FIRST (real-K corpus + byte-lock) | **MEASURE-FIRST** |
| **MorphSVG consumer** (FB-3) | `fromDrawSVG` landed; the arc-length sampler needs value.js VJ-F1 | **BOOK + value.js-HANDOFF — the one real persisting competitor gap** |
| **intrinsic-size `0→auto`** (FB-5) | no path; not cross-engine Baseline as of 2026-06 | **BOOK (guarded-enhancement) + value.js-HANDOFF — VERIFY Baseline first** |
| **`Mod+K` palette** (FB-6) | discovery trigger landed; no palette component | **BOOK (demo, LOW) — decide owner** |
| **`ResolvedKeyframes.diagnostics`** (VJ-F2 kf half) | producer half landed (parse-that PT-1) | **BOOK (kf seam) + value.js-HANDOFF — cross-ref B1 (cleanest empty-parse signal)** |
| **engine line-ceiling watch** (C-6) | `engine.ts` ~1375/1400 at H-open | **RECORD + GATE — the I.W0 serialize-from-template transposition must respect the ceiling; I.W5 carries a HYGIENE-tier `engine.ts ≤ 1400 OR named-measured cohesive split` clause so the ceiling is enforced, not hoped** |
| **A7 cube idle-bob CSS dogfood · A9 matrix `acos` Euler** | cohesion / latent-correctness BOOKs | **BOOK / MEASURE-FIRST — not user defects** |

### 4f — Deploy + RECORD/KILL (terminal; do not re-litigate)

| Band | I disposition |
|---|---|
| **deploy** — `dns-cf-sync.sh` CNAME (DEP-1, P0); `deploy-pages.yml` template distil (DEP-2); roster docs-lag (DEP-3) | **deploy-HANDOFF (kf AUTHORS the target, deploy WRITES). The IMMEDIATE revert to `d469e69` is the §0 damage-control action — separate from these.** |
| **ARCH kills** — ScrollTimeline-native, Worker/OffscreenCanvas, WASM-parser, Typed-OM carrier, per-property easing, bit-packing, dev.sh/deploy.sh, `ValueUnit` monomorphization | **RECORD permanent — no consumer pull A→H; do NOT re-litigate** |
| **value.js / parse-that charter** (C-1) | **CHRONIC-by-design (re-affirm) — the re-pin process working; untouched** |

---

## §5 — HONEST ALREADY-DONE (manufacture NO I work here)

The honest ledger names what genuinely holds, so the waves do not re-litigate the sound parts:

- **CH-2 φ-hero typography IS genuinely closed** — `proof:phi-leaf-zero` polices the leaves (enforced
  0) AND the hero rung; the user did not re-flag it. The model close.
- **The dock SPRING (D5) IS genuinely settled** — the consume-leg bump worked; dock-morph stress is
  120fps clean. The model glass-ui HANDOFF (published fix, consumed via bump, gated, honest).
- **The mobile spring + full-bleed bones ARE real** — `SpringProgress` drawer overshoot 0.015, settle
  169–175ms; full-bleed `position:fixed` stage. The architecture is sound; only the edge seams leaked.
- **The cartoon PANELS read correctly** — H.W2's `surface="cartoon"` adoption is exemplary; the defect
  is the glass STAGE sheen, not the panels.
- **The chronic-closure ARCHITECTURE is the right repair** — the M1/M2/M3 escape taxonomy and "SYSTEM
  gate OR born-RED HANDOFF" invariant are sound; the I overhaul fixes its two failure modes (vaporware
  targets; wrong-axis gates), it does not replace the architecture.
- **The engine / parse / color / re-pin kernels stay ALREADY-SOTA** — H did not touch them (save W0);
  the I crash-fixes (B1/B2) are surgical corrections at the serialize/playback/binding seams, not a
  re-litigation of the engine.
- **The pure scene-machine reducer is CORRECT** — the suspend/save/resume-iff-was-playing algebra
  holds; B2 lives in the EFFECT layer (the unbound adapter method), not the reducer. I.W1 PRESERVES it.

---

## §6 — inv-16 / inv ε compliance + the I-tranche invariants

- **This development phase wrote ONLY docs under `docs/tranches/I/**`** — zero source/test/CI/demo
  edits, no git commit. The deliverable is the charter + waves + audit + this board + `PATH-FORWARD.md`.
- **inv-16 for I** un-fences `src/animation` — it is the kf PRODUCT, not a sibling; runtime correctness
  MAY require engine transposition (B1/B2/B3). The glass-ui specular/dock items re-examine the PIN +
  perf, never patch glass-ui in kf (the consumer-suppression workaround is REJECTED).
- **inv ε (the close cannot overclaim)** — every B1–B9 claim is grounded in a re-runnable probe +
  console JSON + screenshot, OR a tranche FINAL/source `file:line`; the four H "closed" chronics were
  RE-EXAMINED against the running demo one by one. No chain-of-trust over prior FINALs — the live demo
  is the arbiter.
- **The I-born precept** is the headline CHARTER INVARIANT, BOUND AT I-OPEN (t=0): a gate's oracle is
  the running product, exercised through the human's surface, error budget 0 across PLAY + SWITCH +
  DRAG. It is MECHANICALLY PRIOR — enforced from t=0 by the `proof:gate-is-runtime` meta-gate, which
  REDS any wave that registers a source-shape-only oracle as its correctness gate (so the precept is
  enforced by machine, not asserted backward by the last wave). Every I wave gate (I.W0–I.W7) inherits
  it; no source-shape gate carries correctness or chronic-closure authority.
- **The error-budget ALLOWLIST is a CHARTER INVARIANT** (H-2): the `proof:live-session` budget is ONE
  structured definition, inherited by every wave's console clause — HARD-zero on `pageerror` /
  `unhandledrejection` / `console.error` / the value.js `"......"` line; PROMOTED-zero on the
  ReadPixels / content-visibility `warning`/`verbose` GPU-stall lines; MINUS the named-benign dev
  source-map noise. Defined once in I.W7 S2; no per-wave drift.
- **The two-tier oracle taxonomy is a CHARTER INVARIANT** (H-4): every wave's GREEN depends on its
  RUNTIME clause; the config / lint / class-shape clauses are HYGIENE-tier, strictly CORROBORATING,
  and may NEVER substitute for a red runtime clause. The taxonomy applies to the NEW I gates, not just
  the retired ones — the overhaul holds itself to its own taxonomy.
- **P-invariant at the I level:** every carry in §4 exits with an I disposition (FOLD / RE-OPEN /
  RE-AFFIRM / HANDOFF / BOOK / MEASURE-FIRST / RECORD-KILL); the two fictional handoffs (B1's
  never-authored gate, B7's vaporware target) are converted to real I-folds; zero perpetual punts.
- **Version owner:** Mike Babb (`mike@babb.dev`). The I library bump + the deploy are user-domain,
  confirm-first, at I.WZ — AFTER the immediate revert to `d469e69` takes the broken product off the air.
</content>
