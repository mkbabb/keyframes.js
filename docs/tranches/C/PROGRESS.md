# Tranche C — PROGRESS

Status board for keyframes.js' third tranche. The plan is `C.md`; the close
report is `FINAL.md` (authored at W5). Audit evidence is under `audit/`.

## Phase

**IMPLEMENTATION** (W1-W5 — AUTHORIZED, running on branch `tranche-c-impl`).
W0 (audit + planning + harness check-in) is closed on master; the user
authorized the implementation half in totality. Orchestrated as team-lead
waves with deep parallelization (file-disjoint lanes per wave), each wave
gated on the full local gate suite (= CI) before commit. inv-16 holds: only
keyframes.js is written; the glass-ui `LabeledField` defect stays OUTWARD
(ASK-3). The publish leg (changeset → tag → release) is user-domain,
confirm-first.

**DAG executed:** W1 (integrity foundation) → W2 ∥ W4 (demo CSS/tokens ∥
engine `src/`, file-disjoint) → W3 (demo dogfood; sequenced after W2 on the
`CubeTarget.vue`/`EasingTarget.vue` overlap) → W5 (close).

**Three named sequencing allowances (inv ε — recorded, not silently coupled; each removed at its enabling wave):**
- S3's π reduced-motion probe is authored + checked-in at W1 (runs, emits the
  ≥5-frame + contrast artefacts; verified: 6 frames/scene, final-frame
  non-empty); its hard "renders the rest/final frame under
  `prefers-reduced-motion`" assertion flips true at **W3** (`KF_RM_HONORED=1`).
- S6's lighthouse A11y=100 gate lands its machinery + the real `<main>` +
  the tracked-allowance framework at **W1** (verified PASS); the full `=100`
  hard assertion binds at **W2** close. Two named allowance buckets with
  removal triggers: `bucket-glassui` {button-name, label, aria-input-field-name}
  → ASK-3 (outward); `bucket-w2` {image-alt, color-contrast} → W2. CI green W1→W2.
- S2's HARD occlusion gate surfaced ONE real occlusion: `square/mobile`
  (closed+open) — the small 192×192 subject parks behind the bottom dock on
  mobile (the work-area overflows the viewport). Named in
  `W2_PENDING_OCCLUSION` with a self-cleaning stale-check; removal trigger:
  **W2**'s mobile work-area / `--dock-menubar-reserve` / `--work-area-vertical-bias`
  fix. The gate stays HARD on every other scene × viewport × axis + new
  occlusions + the `KF_OCCLUSION_INJECT` bite (verified: reddens on cube-inject).

## Wave status

| Wave | Title | Phase | Status | Hard gate |
|---|---|---|---|---|
| **C.W0** | Audit-fold + harness check-in + B-reconciliation | DEV | **done** | C.md + W1-W5 specs + this board; the 6-lane plan-audit + 6-lens design-audit on disk; `scripts/capture.mjs` checked in + re-runnable; deferred ledger complete; full P1+P2+P3 recap. |
| **C.W1** | The close made honest (inv ε) | IMPL | **done** (verified) | All 7 asserted-not-met gates TRUE + biting, each re-verified locally: real `<main>` (route a, byte-identical, landmark in a11y tree); occlusion dock-over-content HARD + controls-OPEN axis + inject bite (reddens on cube-inject); π RM probe (6 frames/scene, final-frame non-empty, contrast table); harness re-runs from repo (`scripts/lib/demo-driver.mjs` single-sourced); >50ms-trace bench gate (LoAF 2nd consumer, no >50ms blocking); inv β disposition-(b) honest prose; lighthouse A11y(demo-owned)/SEO open-panel gate with 2 named allowance buckets. |
| **C.W2** | The design system made true (φ-ladder + serif + tokens) | IMPL | **done** (CI-green) | φ-ladder adopted (58 instrument-serif sites → semantic ladder, sweep=0); `--font-display` formalized; cartoon-surface/`.demo-box`/EasingTarget-scoped; `--dock-menubar-reserve`/`--spring-snappy`(engine-generated)/vertical-bias defined; the a11y close emptied bucket-w2 (spring badge contrast → ≥4.5:1; spring a11y=100). |
| **C.W3** | The demo dogfoods the engine (inv ζ) | IMPL | **done** (CI-green) | 7 hand-rolled rAF → SmoothProgress/SpringProgress/NumericAnimation/RAFPlayback; `respectReducedMotion:true` + idle-bob `@media` gate (π RM probe now PASSES HARD); scene-swap restored via SpringProgress on a sibling style (Suspense untouched, no blank-scene regression); dead `.scene-*` CSS removed; `proof:dogfood` gate. Mobile work-area cap (square/mobile residual → named allowance). |
| **C.W4** | Engine residuals transposed (gestalt) | IMPL | **done** (lib CI-green) | play/drive/loop folded to one `_run` core (drive inherits `_gen`); one canonical `tickDt(ms)`; setColorSpace/setHueMethod fail-explicit (contract total); default css-twin VERIFIED-then-WITHHELD (no faithful single-bezier exists, proven); Timeline._advance dedup; proof:boundary false-negatives closed + rolldown declared + glass-ui pinned v3.2.0. Core net −20. |
| **C.W5** | Close (π full + DELTA + release) | IMPL (LAST) | **done** | AFTER capture (18 shots, 0 console errors — the harness re-runs from the repo); `audit/DELTA.md` + `audit/pi.md` (π recorded at FULL); `FINAL.md` reconciles B's 7 overclaims (inv ε's first application); the changeset (`.changeset/tranche-c.md`, major, folds B 3.1.0). Publish leg user-domain. |

## W0 audit evidence (on disk)

- **6-lane B-implementation audit** (`audit/plan-findings.txt`, lanes:
  engine-fidelity / plan-fidelity / boundary-ci / deferred-ledger /
  precept-adherence / prompt-recap). The headline: B's close OVERCLAIMED on 7
  gates (a11y landmark broken by `display:contents`; inv δ advisory not hard;
  π at floor not full; harness not checked in; LoAF 1-consumer; inv β
  papered; W5 hard gate deferred-while-done). Per-lane full reports under
  `audit/lanes/`.
- **6-lens demo-design inventory** (`audit/design-findings.txt`:
  component-idiom / typography-ladder / color-token / layout-rhythm /
  motion-dogfood / a11y-responsive). The φ-ladder fork (267 raw rungs, 44
  `.instrument-serif`, `--font-display` undefined → Georgia fallback); the
  reduced-motion-honored-nowhere CRITICAL; the dead scene-swap CSS; the
  undefined `--dock-menubar-reserve`/`--spring-snappy` breaking animations.
- **Lead grounding** (`audit/grounding.txt`) — the cross-check (0 src TODOs;
  57 serif sites; dead CSS App.vue:407-421; 7 rAF vs 1 light-engine). The "11 unnamed
  dock buttons" figure was a grep artifact — STRUCK per the cross-repo dock
  audit (all sites named); the residual is the unenforced glass-ui name
  contract (dock-forward WAVE-5, outward).
- **The capture harness** (`scripts/capture.mjs`) — CHECKED IN + re-runnable
  (18 screenshots, 0 console errors); closes the precept-adherence CRITICAL
  that B's harness lived in /tmp.
- **The animation audit** (`audit/animation/SUMMARY.md` + 6 lanes:
  dock-harden / slides-facility / ios-dock-animation / ios-animation-general /
  playwright-empirical / affordance-hierarchy). MEASURED (local playwright)
  verdict: the spring scene IS iOS-grade (runs `SpringProgress`, 0.5%
  overshoot) but everywhere else hand-rolls — the dock's MOST-SEEN morph plays
  a non-spring bezier on the VT path (+27.5%, no settle), scenes HARD-CUT, the
  cube bob is CSS not engine, and **reduced-motion is a measured FAIL (the demo
  gates NOTHING — the JS spring tweens under `reduce`)**. The headline gestalt:
  the constellation should DOGFOOD keyframes' iOS spring engine
  (`SpringProgress`/`springTimingFunction`/`Timeline`) for iOS-grade motion +
  free reduced-motion — extending C.W3's inv ζ from "no hand-rolled rAF" to
  "iOS-quality motion." The hardening also REFUTED 5 dock-plan claims (folded
  honestly into dock-forward.md §11: WAVE-1's fix is shape B′ not (A) — (A)
  would break keyframes' live collapsed play button; the VT-parity motion gap;
  3 stale claims struck).
  **C.W3 (inv ζ) extends to motion quality** — scene-swap as an engine-driven
  morph, cube idle-bob → `SpringProgress`, reduced-motion honored in every
  scene (the measured FAIL). The dock VT-parity + the slides dogfood (the
  `slides` repo bundles the `--spring-*` tokens but transitions with plain CSS,
  zero spring) route OUTWARD (glass-ui / slides own them).

## Verified facts at C-open

- **B is on master** (`c66e6f3`), CI green (run 26968498980), 3.1.0 changeset
  CUT but unpublished (the publish leg is user-domain).
- **The a11y landmark gate is BROKEN** — `<main class="contents">`
  (`EditorShell.vue:36`); `display:contents` strips the landmark role;
  `landmark-one-main` still fails. (verified)
- **inv δ is advisory** — `occlusion-gate.mjs` logs dock-over-content but does
  not fail on it, and never opens a controls panel.
- **`--font-display` is undefined** in the demo — display rungs fall to
  Georgia.
- **The capture harness was checked in at C.W0** — re-runnable from the repo.
- **Precepts synced** — gitlink at canonical `8ccf9f4`.

## Cross-repo / outward perimeter (USER-DOMAIN — confirm before each)

1. **glass-ui asks** — ASK-1 (dock double-click), ASK-2 (VAL-9 token regen),
   **ASK-3 (LabeledField label-association)** — glass-ui-owned (inv-16),
   filed in `docs/tranches/B/asks/glass-ui-adoption-asks.md`.
2. **The glass-ui DOCK-FORWARD proposal** — a constellation-wide dock audit
   (glass-ui source + the 3 consumers keyframes/value.js/fourier, 6 agents)
   refines ASK-1 into **7 ranked dock-forward waves** for glass-ui
   (`docs/tranches/B/asks/glass-ui-dock-forward.md`; evidence under
   `audit/dock/{glass-ui,keyframes,value-js,fourier,divergence-map}.md`):
   WAVE-1 `dock:touch-gate` (P0, the double-click fix + the missing touch
   behavioural test) → mutex / placement / expand-events convergences →
   a11y-contract → layer-transition de-fork → trigger/badge closers.
   keyframes proposes; glass-ui owns + runs (inv-16). The cross-repo synthesis
   STRUCK two stale figures (the "11 unnamed dock buttons" grep artifact + the
   "40px touch target" — glass-ui ships a 44px coarse floor).
   **The dock CONVERGENCE + naming plan**
   (`docs/tranches/B/asks/glass-ui-dock-convergence.md`) adds the two missing
   dimensions: a canonical role vocabulary (`ChromeDock`/`TransportDock`/
   `CanvasDock`/`ToolDock`) replacing the per-app names (TopDock/Dock/
   EditorControlsDock…), ONE canonical `useDock*` name per folded composable
   (today `useExclusiveSelect`≡`usePopupMutex`), and the leverage-the-base
   end-state (each consumer dock → a thin `<Role>Dock` slot-filler over the
   base, zero hand-roll). keyframes' OWN obligations (rename `TopDock`→
   `ChromeDock` + `AnimationMenuBar`→`TransportDock`; converge the two mutex
   copies; delete the local `dock/index.ts` re-export; swap each hand-roll for
   the base) are GATED on glass-ui landing the base dock waves, and land in C's
   demo waves once unblocked.
3. **The B 3.1.0 release + the C release** (W5 changeset → tag → publish) —
   user-domain, as in A/B.

## Open deferrals

None beyond the named-forward `Worker`/`OffscreenCanvas` archive (no
consumer) + the ScrollTimeline-native KILL (correct, permanent). C runs
zero-deferral: every B overclaim + every re-audit finding lands in a wave
with a real owner. The chronic LoAF/>50ms-trace subsystem — re-narrated by B
— is SHIP'd in C.W1 as one perf-evidence unit (the gestalt B claimed).
