# Tranche C — PROGRESS

Status board for keyframes.js' third tranche. The plan is `C.md`; the close
report is `FINAL.md` (authored at W5). Audit evidence is under `audit/`.

## Phase

**DEVELOPMENT** (W0 — audit + planning + the harness check-in, RUN now). The
implementation half (W1-W5) is authored-now-run-later and opens only on
explicit user authorization. No engine or demo source is written in
development. The dev/impl boundary lands at the W0 close (this board + C.md +
the W1-W5 specs + the audit evidence + the checked-in capture harness).

## Wave status

| Wave | Title | Phase | Status | Hard gate |
|---|---|---|---|---|
| **C.W0** | Audit-fold + harness check-in + B-reconciliation | DEV | **in progress** | C.md + W1-W5 specs + this board; the 6-lane plan-audit + 6-lens design-audit on disk; `scripts/capture.mjs` checked in + re-runnable; deferred ledger complete; full P1+P2+P3 recap. |
| **C.W1** | The close made honest (inv ε) | IMPL | planned | The 7 asserted-not-met gates TRUE + biting: real `<main>`; occlusion dock-over-content HARD + controls-open; π FULL; harness re-runs from repo; >50ms-trace gate = LoAF 2nd consumer; inv β reconciled; A11y=100 + SEO CI gate. |
| **C.W2** | The design system made true (φ-ladder + serif + tokens) | IMPL | planned | glass-ui φ-ladder adopted; 267 raw rungs + 44 `.instrument-serif` retired; `--font-display` formalized; cartoon-shadow/SquareScene/EasingTarget tokenized; undefined CSS vars defined; consumption sweep clean. |
| **C.W3** | The demo dogfoods the engine (inv ζ) | IMPL | planned | 7 hand-rolled rAF → light engines; reduced-motion honored in demo; scene-swap restored via the engine + dead `.scene-*` CSS removed. |
| **C.W4** | Engine residuals transposed (gestalt) | IMPL | planned | `drive` gen-guard / fold drive+loop; one canonical `tickDt(ms)`; setColorSpace/HueMethod fail-explicit; default-easing css-twin; Timeline._advance dedup; boundary hardening + rolldown declared + glass-ui pin. Net deletion. |
| **C.W5** | Close (π full + DELTA + release) | IMPL (LAST) | planned | AFTER capture (checked-in harness) + DELTA; π FULL recorded; ι + overfitting (LoAF ≥2-consumer or cut); FINAL reconciles B's overclaims (inv ε's first application); changeset (B 3.1.0 + C). |

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
