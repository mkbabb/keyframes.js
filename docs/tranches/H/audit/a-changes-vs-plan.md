# H audit lane — a-changes-vs-plan

**Lane charge.** Audit the changes made D→G against the original + remaining plan.
What did each tranche promise vs deliver? What drifted? What remains? Characterize
the quality gap the observed defects (D1–D14) expose: the gates went green while the
demo carries these defects — *why didn't the gates catch them?*

**Method.** Read every tranche FINAL (`docs/tranches/{D,E,F,G}/FINAL.md`), the D
prompt-recap (`docs/tranches/D/audit/prompt-recap.md`), the cross-repo handoffs, the
process LESSONS-LEARNED (`docs/precepts/instructions/LESSONS-LEARNED.md`), and the
live gate suite (`package.json` `proof:*`, `scripts/proof-*.mjs`,
`scripts/{occlusion,demo-smoke,lighthouse}-gate.mjs`). Cross-checked source anchors
against the running demo (server confirmed live on :5174 and :5173, HTTP 200). This
lane is the META lane: per-defect root-cause belongs to the sibling lanes
(`a-controls-sidebar`, `a-cartoon-shadow`, `a-glow-artifact`, `a-easing-editor`,
`a-timeline-width`, `a-typing-dots`, `a-hero-typography`, `a-scene-icons`,
`a-store-architecture`, `a-perf-dock-lag`, `a-mbabb-popover`, `a-mobile-architecture`,
…); this lane characterizes the *systemic* gap and the gate-design failure.

---

## 0. The bottom line (read this first)

**Each tranche D→G delivered exactly what it promised — measured against its own
charter and gates. Every charter promise has a landing commit and a green gate. The
defects D1–D14 are NOT broken promises against the lettered charters. They are the
*shadow* of a structural choice: A→G optimized for a SOURCE-and-CONTRACT gate regime
(does the token exist · is it single-sourced · is the literal tokenized · does the
value-type interpolate · is the boundary intact) and a SCOPE that treated the demo as
a "shop-window" for the engine, narrowing each tranche to "net-new assay findings."
That regime is genuinely SOTA at what it measures. It is BLIND to visual fidelity,
felt quality, and cross-scene runtime state — the exact dimensions D1–D14 live in.**

The gap is not dishonesty (the FINALs are unusually honest; inv ε holds). The gap is
that **"gates green" and "looks/feels right" were never the same target, and the gate
suite was never asked to be the second.** The demo was hardened as an *artifact of
source cohesion*, not as a *product a person uses*. D1–D14 are what a person sees.

---

## 1. Promise vs deliver — per tranche

Each row: the charter headline (the promise) · the landing evidence (the deliver) ·
the drift (what the promise's words implied but the deliver did not reach).

### D (4.0.0 `[major]`) — "demo refined to the engine's encapsulation, engine transposed to its gestalt"
Source: `docs/tranches/D/FINAL.md`, `docs/tranches/D/audit/prompt-recap.md`.

| Promise (D ask) | Delivered | Drift |
|---|---|---|
| D1 demo refined — decompose 5 oversized units, KISS | LANDED: AnimationControlsGroup 552→335, KeyframesEditor 487→263, useKeyframesEditor 383→56, KeyframeTimeline 441→254, useTimeline 251→74 (`FINAL.md:81-99`). `proof:decomposition`. | Decomposition is a SOURCE metric (line ceilings, single adapter body). It says nothing about whether the *resulting* controls layout reads right (D1 two-column sidebar) or whether the timeline width is cogent (D4). The units got smaller; the composition was not re-judged. |
| D2 design language localized + uncaged | LANDED: `design-idioms.css` owns `--rainbow-*` / `--color-gold` / `.scale-on-hover` / `@keyframes enter`; `utils.css` DELETED; φ-ladder leaf-tail swept (`FINAL.md:100-122`). `proof:idioms` (8 clauses). | `proof:idioms` verifies idioms are DEFINED, SINGLE-SOURCED, and TOKENIZED — never that the rendered idiom is the RIGHT one. The hover idiom shipped as `.scale-on-hover` (scale lift) + radial glow box-shadows; the **cartoon-shadow depth treatment is NOT a demo idiom** (it survives only inside `CSSCodeEditor.vue:6` as `cartoon-surface` on the editor border — `grep cartoon demo/@ --exclude dist` returns ONE hit). D2/D14's defect is exactly this: the gate is satisfied by a *coherent* idiom that is the *wrong* idiom. |
| D3 brittleness hardened (selectors · reactivity · fragile rules) | LANDED: querySelector→useTemplateRef, z-index scale, `@supports` guards, reactivity gates (`FINAL.md:123-135`). `proof:brittleness`. | Brittleness ≠ correctness-under-navigation. None of the clauses model scene→scene→scene transitions (D12 scene-state corruption). |
| D4 engine transposed to its gestalt `[major]` | LANDED: group zero-alloc, `tick→advanceTo`, `Animation`/`FrameCompiler` split, `pause→pause/resume/toggle` (`FINAL.md:35-79`). `proof:engine`, `proof:zero-alloc`. | Genuinely SOTA; ALREADY-SOTA-grade. No drift — the engine is exemplary. The drift is that the engine got a god-object split while the *demo's* play/pause STATE machine across scenes (D12) was never modeled at all. |
| D5 dock leveraged + mobile composition | PARTIAL→deferred: dock-rename + mask removal **blocked on glass-ui 3.3.0**, closed later in G.W12. Mobile-occlusion residual → glass-ui-HANDOFF (`FINAL.md:137-167`). | The ONE legitimately-blocked carry. Honestly recorded. But "mobile composition closed" was the WORDS; the deliver was "dock renamed + occlusion gate green mask-free." D10 (mobile single-page, affixed docks, animation-as-background) was never in D5's actual scope — it was implied by the words, deferred in fact, and is still open. |
| D6 every deferral terminated (P-inv-28) | LANDED: `deferred-ledger.md`, zero un-dispositioned punts. | **The cartoon-shadow row is the tell.** `FINAL.md:196`: "LoAF · EasingTarget leak · dead scene CSS · **cartoon-shadow** | CLOSED | done in C; D verifies no regression | the C gates (bite)." The cartoon-shadow was marked CLOSED with "verifies no regression" — but **no gate renders or checks the cartoon shadow.** "Verified no regression" meant "the C source migration still parses," not "the depth treatment still looks like a cartoon shadow." D2 is a regression a source-gate cannot see. |

**D verdict:** delivered to charter. The engine half is ALREADY-SOTA. The demo half
delivered *source cohesion* and called it *refinement*; refinement-as-felt-quality
(layout, hover, mobile) was outside the gate regime and is where D1/D2/D4/D10/D14 sit.

### E (4.0.0 minor) — "demo elevated to the modern-web standard the engine already held"
Source: `docs/tranches/E/FINAL.md`.

| Promise | Delivered | Drift |
|---|---|---|
| W1 encapsulation r2 (App.vue 452→344, useOrbitalPointer 376→249) | LANDED. `proof:decomposition`. | More line-ceiling work; same blind spot as D1. |
| W9 modern-platform adoption (feature-detected) | LANDED: @property, PRM, WAAPI fidelity, native scroll. `proof:platform-adopt`. | SOTA. |
| W10 orchestration tier (stagger/flip/drag/sequence/animate) — NEW public API | LANDED additive. | SOTA — the spring/sequence/path PRIMITIVES land here; their DEMO SCENES (D8 modes) get authored downstream in F with no design/icon pass. |
| W11 demo elevation — View-Transitions · a11y · idiom r3 · first-paint · CWV | LANDED feature-detected. `proof:demo-elevate` (5 clauses, SOURCE gate). | `proof:demo-elevate` is a SOURCE gate (clause grep over demo source). "Elevation" was measured as feature-flag presence, not as rendered polish. |
| W4 Monaco deferred · CWV · lighthouse-mobile | LANDED; lighthouse gate AUTHORED but **honest-WITHHELD off-CI** (sandbox CPU inflates scores — `FINAL.md:54`). | The one runtime-quality gate (lighthouse) is the one that does NOT run in the dev loop. The honest withholding is correct per the §Mandate — but it means the suite's only felt-quality instrument is dark by default. |

**E verdict:** delivered to charter; net-NEW, measure-first, no legacy. E "elevated"
the demo's *platform-adoption* and *a11y* surfaces (real wins) but "elevation" never
meant "a designer looked at every scene." E manufactured the spring/sequence
primitives whose demo scenes F would author — the modes D8 now questions.

### F (4.0.0 minor) — "the narrow finishing layer; ~90% ALREADY-SOTA, left untouched"
Source: `docs/tranches/F/FINAL.md`.

| Promise | Delivered | Drift |
|---|---|---|
| W4 engine perf — interp ~3.0× (measured, pixel-identical) | LANDED. `proof:interp-fastprops`. | SOTA. |
| W7/W8 parsing correctness (per-keyframe ATF round-trip, composition capture) | LANDED. `proof:roundtrip-easing`, `proof:adapter-capture`. | SOTA. |
| W9 Sequence transport · W12 MotionPath demo scenes | LANDED: `Sequence`+stagger scene, `animate({path})` front-door, motion-path scene (`FINAL.md:62-75`). | **These are D8's modes.** Spring / Sequence / Path scenes were authored as ENGINE-DOGFOOD vehicles (prove `decay()`/`Sequence`/`fromMotionPath`), not as designed product surfaces. They shipped WITHOUT scene-nav icons (D8), without the interactivity the cube has (D11), and — F's own self-correction notwithstanding — the typing-dots / hero typography in those scenes were never design-reviewed (D6/D7). The "narrow finishing layer" framing is exactly why: F's thesis was "90% ALREADY-SOTA, touch little," so new SCENES rode in on the engine's coattails with no design gate. |
| W13 `text-wrap: pretty` · W16 hero a11y/typography substrate | LANDED: hero `sr-only` mirror, `aria-hidden` decorative spans, `text-wrap: balance` (`FINAL.md:77,87`). | The hero got an A11Y + WRAP substrate — not a SIZE/φ-ladder judgment. D7 ("hero must be LARGER, golden φ-ladder typography") is the felt-size dimension the substrate work did not touch. |

**F verdict:** delivered to charter; the ALREADY-SOTA refusal is principled and largely
correct. But the "narrow finisher / touch little" posture is the mechanism by which
**new demo scenes (the modes) entered the product WITHOUT a design or visual-runtime
gate** — they were engine dogfood that became user-facing surface. D8/D11/D6/D7 are
the bill.

### G (4.1.0 minor) — "the re-pin spine + two additive engine surfaces + idiom-drift sweep"
Source: `docs/tranches/G/FINAL.md`.

| Promise | Delivered | Drift |
|---|---|---|
| W2 the re-pin spine (consume published F siblings, ZERO lib edit) | LANDED. `proof:deps-current`, `proof:repin-witness`. The headline. | SOTA — highest leverage / lowest cost motion in the ledger. |
| W7/W8/W9 frontend encapsulation/state/brittleness — incl. the rAF-leak HIGH | LANDED: `onDeactivated`→`onScopeDispose` (Easing/Spring leaked the preview loop on play-then-swap), `createGlobalState` asset singleton (`FINAL.md:90-97`). `proof:scene-raf-leak`, `proof:asset-store-singleton`. | G found+fixed a real scene-lifecycle leak — and STOPPED at the leak. The *adjacent* defect (D12: play/pause state not suspended/restored across scene switches; controls left in an impossible routed state) is the SAME failure domain (scene lifecycle), one step deeper, and G's gate (`proof:scene-raf-leak`) only asserts the loop is cancelled, not that PLAYBACK STATE is correctly suspended/restored. The store work (`createGlobalState`) is the substrate D12's robust state machine needs — but the state machine itself was never specified. |
| W11/W12 styling/usability/dock — the 4 Playwright SHIPs · D.W5 dock close | LANDED: Discrete route added, hero word-spacing ("Selectananimation"→spaced), duplicate Play aria disambiguated, `TopDock→ChromeDock`, mask removed (`FINAL.md:99-110`). `proof:demo-usability` (browser-gated). | **This is the closest the suite gets to felt quality — and it proves the ceiling.** G shipped a BROWSER gate (`proof:demo-usability`) that catches THREE specific defects (dead route, collapsed word-gap, dupe aria). It is the right SHAPE of instrument. But it asserts only the three named pixels — it does not generalize to "is the layout right / is the hover right / is the easing editor sized right." Every D1–D14 defect is one a `proof:demo-usability`-shaped gate COULD catch, but for which no clause was authored, because no one *looked*. |
| W18 orbital rotate3d collapse · W17 blend-leaf bug | LANDED + adversarially corrected. `proof:orbital-rotate3d`, `proof:blend`. | SOTA. |

**G verdict:** delivered to charter; narrow re-pin finisher with a large honest
ALREADY-SOTA refusal. G *invented the right gate genus* (`proof:demo-usability`,
browser, biting on rendered defects) and then under-populated it — three clauses
where D1–D14 needed thirty. The dock LAG (D5) and the dead @mbabb popover (D9) are
explicitly glass-ui-domain (G left the dedup-alias in place pending glass-ui's AW
tranche, `FINAL.md:197-204`) — correctly deferred, still open.

---

## 2. The remaining plan — what every tranche named-forward, still open

The lettered tranches each closed with a CLEAN deferred ledger (D was the terminal
home; E/F/G manufactured zero chronic debt). So "remaining plan" is NOT a punt-list —
it is the set of **named-forward cross-repo handoffs** plus the **scope dimensions no
tranche ever owned.**

**(a) Named-forward cross-repo handoffs (correctly open, sibling-owned):**
- glass-ui — the dock (D5 lag, D9 popover), mobile dock occlusion, `startViewTransition({types})` (H-1). G left these glass-ui-owned + kept the `@mkbabb/keyframes.js → src` dedup-alias until glass-ui's AW tranche widens its peers (`G/FINAL.md:197-204`). **D5/D9 are these.** TAG: glass-ui-HANDOFF.
- value.js — VJ-F1 path-geometry sampler, the `linear()`/`steps()` parser that retires kf's `parseLinearStops` shim, the MCI-5 identity-aware fn-arity pad, the F2 color sentinels (`G/FINAL.md:189-193`). TAG: value.js-HANDOFF.
- parse-that — the `(id,offset)` packrat re-key, the realm convergence (`G/FINAL.md:194-196`). TAG: parse-that-HANDOFF.

**(b) Scope dimensions NO tranche ever owned (the real remaining plan — and the
source of D1–D14):**

| Dimension | Why it was never owned | Defects it covers |
|---|---|---|
| **Visual fidelity / felt design** | No tranche charter had a "a designer reviews every rendered scene" wave. D2 design-language was SOURCE-ownership; E/F a11y+platform; the design lens (the "6 frontend-design agents" of the B/C audits, `D/audit/prompt-recap.md:47,57`) audited the PLAN, never gated the RENDER. | D1, D2, D3(easing), D4(timeline), D7, D14 |
| **The new demo MODES as product** | They entered as engine dogfood (E primitives, F scenes) under F's "touch little" thesis — never a "design + icon + interactivity" pass. | D6, D7, D8, D11 |
| **Cross-scene runtime STATE machine** | G fixed a rAF leak (one slice of scene lifecycle); the play/pause SUSPEND/RESTORE + per-scene state delineation was never specified. The substrate (`createGlobalState`, `scenePlayback.ts`) exists; the machine does not. | D12 (CRITICAL) |
| **Mobile as a first-class composition** | D5's words implied it; D5's deliver was the dock rename + occlusion gate. "Mobile single-page, affixed docks, animation-as-background, springy drawer" was never a wave. | D10, D13 |

---

## 3. The quality gap — why "gates green" ≠ "looks/feels right"

This is the lane's core charge. Five mechanisms, each evidenced.

### 3.1 The gate suite is structurally SOURCE-biased (the 31/6 ratio)
Of the ~37 `proof:*`/gate scripts, **31 are SOURCE/structural** (grep/AST/unit over
files) and **6 are BROWSER/runtime** (`demo-smoke`, `occlusion-gate`, `lighthouse-gate`,
`proof-computed-real-dom`, `proof-demo-usability`, `proof-lighthouse-mobile`)
[classification: `grep -l chromium|playwright scripts/*.mjs`]. A source gate verifies
*intent* (the token is defined, the literal is tokenized, the value-type interpolates);
it cannot verify *appearance*. D1–D14 are appearance/behavior defects. The suite was
built to gate the ENGINE (where source = truth) and extended to the DEMO with the same
genus, where source ≠ truth. This is `LESSONS-LEARNED 2026-04-29 "Runtime Truth Beats
Source Claims"` and `2026-05-05 "Read-Only Audits Miss Runtime + tailwind-merge
Interactions"` — both ALREADY IN the repo's own lessons, and both un-applied to the
demo's design surface.

### 3.2 The few browser gates assert NAMED PIXELS, not fidelity
`proof:demo-usability` (`scripts/proof-demo-usability.mjs`) is the best instrument in
the suite — it loads the BUILT demo in Chromium and measures rendered geometry. But
its three clauses are: route-reachability, hero inter-word gap > 0, unique aria-label.
Each was authored *after* the user reported that exact defect in G (X-3/X-5/X-6). The
gate is **reactive and point-wise** — it locks the three defects already found, and
generalizes to none. `occlusion-gate.mjs` asserts no dock-over-content overlap — a
binary geometry fact, not "does the sidebar read as one column" (D1) or "is the easing
editor too massive" (D3). **No gate measures: column count of a control grid, hover
box-shadow morphology (cartoon vs radial — D2/D14), element size relative to a φ-ladder
rung (D3/D7), or panel width parity (D4).** These are all browser-measurable; none are
measured.

### 3.3 The browser gates are DARK by default
The browser halves SKIP unless `KF_REQUIRE_BROWSER=1` AND `dist/gh-pages` is built
(`proof-demo-usability.mjs:94-104`, the `skipOrFail` branch; the lighthouse gate is
"honest-WITHHELD off-CI", `E/FINAL.md:54`). In the autonomous dev loop (`proof:all`),
the runtime gates that COULD see D1–D14 either skip silently or are not in the chain.
`proof:all` (package.json) runs the 31 source gates + vitest; the felt-quality
instruments run only in CI under an env flag. So the loop that agents iterate against
**never renders the demo.** This is precisely `LESSONS-LEARNED 2026-05-06 "Visual-Runtime
Probe Coverage Stop-Rule"` (≥3 viewports, animation-timing on every state-toggle,
contrast-vs-bg) — authored from glass-ui's identical failure, never adopted here.

### 3.4 "CLOSED / verifies no regression" was asserted on un-rendered claims
The cartoon-shadow ledger row is the cleanest proof. `D/FINAL.md:196` marks
cartoon-shadow CLOSED with "done in C; D verifies no regression | the C gates (bite)."
But the C "cartoon-shadow → `.cartoon-surface`" migration (`C.md:227`) only ever scoped
the treatment to ONE element (`CSSCodeEditor.vue:6`); it never made cartoon-shadow the
demo's hover/depth idiom. "Verifies no regression" verified the SOURCE migration still
parsed — not that the rendered depth treatment survived as the design intent. The
demo-wide hover became `.scale-on-hover` + radial glow (`design-idioms.css:177-184,
263-269`). D2 is therefore a "regression" against an intent that was never gated, marked
CLOSED against a gate that never rendered it. This is `LESSONS-LEARNED 2026-05-06 "Per-
Story Consumption Sweep"` + `"Visual Load-Bearing-ness Bar"` (an artefact can be
quantitatively wired and visually unmade) — exactly the cartoon case.

### 3.5 SCOPE narrowing compounded the gate blindness
Each post-D tranche framed itself NARROWER than the last (E "net-new assay findings,"
F "~90% ALREADY-SOTA touch little," G "narrowest yet"). This is good discipline against
churn — but it meant **no tranche ever re-opened the whole demo and asked "is this a
good product?"** The new modes rode in as engine dogfood; the controls layout was
decomposed but never re-judged; the hero got a11y but not size. The ALREADY-SOTA
refusal (correct for the engine, parser, color science) was *generalized to the demo's
design surface*, where it should not have been — the demo's design was never SOTA, it
was never measured, so "left untouched" preserved un-measured defects. `LESSONS-LEARNED
2026-05-05 "Read-Only Audits ... returned clean; a Playwright visual probe immediately
found a runtime regression"` is the template: the read-only/source lanes can return
clean over a demo that a single visual probe would condemn.

---

## 4. Per-defect → plan provenance (where each defect's gate SHOULD have lived)

| Defect | Tranche that touched the surface | Why the gate missed it | DISPOSITION |
|---|---|---|---|
| D1 two-column sidebar | D1 decomposition (`AnimationControlsControls.vue:294` subgrid) | `proof:decomposition`/`proof:idioms` gate line-count + token-source, not grid column count | SHIP-in-H (sidebar lane owns the fix; +`proof:demo-usability` clause: controls grid computed `grid-template-columns` resolves to ONE column) |
| D2 / D14 radial-blur hover vs cartoon shadow | D2 idiom-ownership; cartoon CLOSED in C ledger | `proof:idioms` checks idiom DEFINED/single-sourced, never the box-shadow MORPHOLOGY; "CLOSED verifies no regression" was source-only | SHIP-in-H (cartoon-shadow + glow-artifact lanes; +visual-lock: hover `box-shadow` is layered offset shadow, not `0 0 blur radial`) |
| D3 easing editor too massive / inner border / small header | E/F editor work; never a size judgment | no gate measures element size vs φ-ladder | SHIP-in-H (easing-editor lane; +visual-lock on container max-size + header rung) |
| D4 timeline full-width vs sidebar-width | D1 decomposition (RibbonBar/PlaybackRibbon split) | width parity is not a `proof:idioms` clause | SHIP-in-H (timeline-width lane; +`proof:demo-usability` width-parity clause) |
| D5 dock lag / popover | glass-ui domain; G kept dedup-alias pending AW | not a kf gate; glass-ui's own perf | glass-ui-HANDOFF (perf-dock-lag lane) |
| D6 typing-dots broken | F mode scenes (dogfood) | no scene-level visual gate on the new modes | SHIP-in-H (typing-dots lane; +visual-lock the dot-fade renders) |
| D7 hero size / φ-typography | F.W16 hero a11y+wrap substrate (not size) | `proof:demo-usability` clause 2 checks word-GAP, not SIZE/rung | SHIP-in-H (hero-typography lane; +clause: hero `font-size` resolves a `text-display-*` φ rung) |
| D8 missing mode icons / pertinence | E primitives / F scenes, no design pass | no gate on scene-nav completeness | SHIP-in-H after pertinence verdict (scene-icons + modes-pertinence lanes; +`proof:demo-usability` clause: every routed scene has an icon) |
| D9 @mbabb popover dead | App.vue dock (glass-ui dock breakage, ties to D5) | not gated; dock is glass-ui | glass-ui-HANDOFF + SHIP-in-H wiring (mbabb-popover + historical-dock lanes) |
| D10 mobile single-page composition | D5 words implied; never a wave | occlusion-gate is binary overlap, not composition | SHIP-in-H (mobile-architecture lane; new viewport-matrix visual gate) |
| D11 modes more interactive | F scenes were static dogfood | no interactivity gate | SHIP-in-H (mode-interactivity lane) after pertinence verdict |
| D12 scene-state corruption (CRITICAL) | G fixed rAF leak (adjacent), state machine never specified | `proof:scene-raf-leak` asserts loop cancelled, NOT playback-state suspend/restore | SHIP-in-H (store-architecture lane; new `proof:scene-state-machine` gate: switch easing→cube→easing restores valid options + suspended/restored play state) |
| D13 mobile drawer not springy/slow | D10/D5 mobile never a wave | no animation-timing gate on the drawer | SHIP-in-H (mobile-architecture lane; dogfood SpringProgress; timing-sample gate) |

---

## 5. Falsifiable instruments H should gate with (the generalization the suite needs)

The fix for the gap is NOT "more source gates." It is **promote the
`proof:demo-usability` genus from point-wise to a coverage discipline**, per the repo's
own un-adopted lessons. Concretely, H should author:

1. **`proof:visual-fidelity` (browser, viewport-matrix).** Loads the built demo at
   ≥3 viewports (375 / 768 / 1280 — the `LESSONS-LEARNED 2026-05-06` stop-rule), walks
   EVERY routed scene, and asserts a small set of GENERAL rendered invariants that bite
   on D1–D14 as a CLASS, not one-by-one:
   - controls grid computed `grid-template-columns` column-count == 1 (D1);
   - hover `box-shadow` is a layered offset shadow, not a `0 0 <blur> radial` glow on
     panels/header/timeline (D2/D14 — measure the resolved shadow on `:hover`);
   - timeline/ribbon rendered width == controls-pane rendered width ±tol (D4);
   - hero `font-size` resolves a `text-display-*` φ rung ≥ the named floor (D7);
   - every routed scene exposes a nav icon node (D8);
   - easing-editor container `max-height`/`max-width` ≤ the cogent bound + header rung
     correct (D3).
   Each clause BITES on the exact defect and is authored from a *rendered* probe, never
   a grep. Hard-fails under `KF_REQUIRE_BROWSER=1`; wired into `demo-smoke` (the CI
   browser job), NOT skippable-silent.

2. **`proof:scene-state-machine` (the D12 instrument).** Drive route
   easing→cube→easing (and easing→amiga→easing); assert (a) controls/options return to
   a VALID per-scene state (no impossible routed state), (b) a scene that was PLAYING
   on leave is suspended and RESTORED on return, (c) a scene that was PAUSED stays
   paused. Bites on the current corruption. This is the gate D12 (CRITICAL) demands and
   that `proof:scene-raf-leak` only partially covers.

3. **`proof:motion-timing` (the D13 instrument).** Sample the mobile-drawer
   collapse/expand over rAF frames; assert it dogfoods SpringProgress (overshoot
   signature present) and completes under a fast budget. `LESSONS-LEARNED 2026-05-06`:
   "animation-timing samples on every state-toggle the tranche modified."

4. **Cartoon-shadow visual-lock (the D2/D14 regression-bite).** A rendered probe that
   the depth/hover treatment is the layered cartoon shadow — so a future source
   migration that quietly drops it (the C→now silent loss) REDS the gate, where
   "CLOSED verifies no regression" did not.

These four close the 3.1–3.4 mechanisms: they move truth from source to RUNTIME, make
the runtime gate a COVERAGE discipline (not point-wise), keep it LIT in the dev loop
(not env-dark), and lock visual intent so "CLOSED" means "rendered, not parsed."

---

## 6. Honest ALREADY-SOTA (where the work is exemplary — do not re-litigate)

The engine half of this codebase is genuinely SOTA and the FINALs do not overclaim it.
The following are exemplary and should be CITED, not touched, by H:
- the `Animation`/`FrameCompiler` god-object split + zero-alloc compositor (`D/FINAL.md:35-79`);
- the F.W4 interp ~3.0× fast-properties win, MEASURED + pixel-identical (`F/FINAL.md:31-37`);
- the G.W2 re-pin spine — ZERO library source edit through the `lerpValue→iv._lerp`
  seam, the single highest-leverage motion in the ledger (`G/FINAL.md:32-43`);
- the value.js / parse-that boundary, color science, parse grammar — re-touched by no
  wave, correctly (`G/FINAL.md:218-228`);
- inv ε discipline itself: the FINALs are unusually honest (the cartoon-shadow row is
  mis-CLOSED, but it is the ONLY such row I found across four FINALs; the C audit
  CAUGHT B's overclaims and the chain preserves them — `D/audit/prompt-recap.md:99-133`).

The gap is NOT a quality failure of the engineering. It is a SCOPE-and-GATE-GENUS
failure of the demo's design dimension: the team built a source-cohesion gate regime,
proved it green, and never built the runtime-fidelity gate regime the demo (a product
a person uses) required. H's job is to add that second regime and ship the D1–D14 fixes
behind it.

---

## 7. Dispositions (summary)

- **SHIP-in-H:** D1, D2, D3, D4, D6, D7, D10, D12, D13, D14, and (post-pertinence-verdict)
  D8/D11 — each owned by its sibling lane, each gated by a NEW runtime/visual instrument
  (§5), not a source gate.
- **glass-ui-HANDOFF:** D5 (dock lag), D9 (popover, ties to D5). Audit+suggest only;
  fix in the glass-ui root per the §Mandate + `G/FINAL.md:197-204`.
- **RECORD (process):** the gate-genus gap (§3) and the four new instruments (§5) —
  H's FINAL must record that the demo's runtime-fidelity gate regime did not exist
  before H, so the next tranche inherits it.
- **ALREADY-SOTA (do not touch):** the engine, the re-pin spine, the boundary, the
  color/parse stack (§6).
- **No KILL** in this lane (modes-pertinence lane owns any KILL verdict on D8 modes).

**The one-sentence answer to the charge:** every tranche delivered its charter and its
gates bit — but the gates measured SOURCE COHESION, the charters scoped ENGINE
GESTALT + DEMO ENCAPSULATION, and nobody ever built the RUNTIME-FIDELITY gate or
scoped the DEMO-AS-PRODUCT wave, so D1–D14 lived in the un-gated, un-scoped seam
between "the source is clean" and "the thing looks and feels right."
