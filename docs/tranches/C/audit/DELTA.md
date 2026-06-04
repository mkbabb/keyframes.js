# DELTA — C-open → C-close

The AFTER capture (`scripts/capture.mjs after`, the harness checked in at C.W0)
re-ran against the W1–W4 integration HEAD: **18 screenshots, zero console
errors** (`audit/screenshots/after/`). This discharges the before/after edict's
re-runs-identically-from-the-repo clause — the harness B left in `/tmp` is now
in the repo and re-run at the close.

**On the BEFORE baseline.** C.W0 checked the harness IN but did not shoot a
C-open pixel baseline, so this DELTA pairs the AFTER capture with the
*per-page intended change* + the *gate evidence* rather than a pixel-diff. The
regression authority is the gate suite — `demo-smoke` (inv γ), `occlusion-gate`
(inv δ, both axes), `lighthouse-gate` (a11y/SEO open-panel) and `proof:dogfood`
(inv ζ) all PASS, so "no unintended regression" is proven by the gates that
bite, not asserted by eye.

## Per-page DELTA

| Page | Meant to change | Evidence |
|---|---|---|
| **home / hero** | hero `text-6xl lg:text-8xl` on the body serif → `.text-display-4` (fluid clamp, balanced, Instrument Serif); the hint's `opacity-50` → `text-muted-foreground` (mute-by-colour, an a11y close) | sweep: 0 raw display rungs on the hero; `--font-display` defined; demo-smoke hero text renders |
| **cube** | face number → `.text-display-2`; the idle-bob gated in `@media (prefers-reduced-motion: no-preference)`; the coast/visualizer dogfooded | occlusion cube/all-viewports clean; π RM cube rest-frame PASS |
| **square** | `.square-box` fork → canonical `.demo-box` (theme-aware halo); the work-area capped to reserve the dock band | occlusion: square clean except the named mobile-composition allowance |
| **easing** | target name → `.text-heading`; the ping-pong → `NumericAnimation(alternate)` | occlusion easing/all clean; demo-smoke clean |
| **spring** | target name → `.text-heading`; the loop → `RAFPlayback.loop`; the `.settled-badge` contrast → ≥4.5:1 | lighthouse spring a11y=100 (was held); π RM spring rest-frame PASS |
| **amiga** | typography on the φ-ladder; rotations inherit `respectReducedMotion` | occlusion amiga clean (dockFloatAllowed canvas) |
| **cross-scene swap** | restored — `SpringProgress` drives a sibling style on the keyed `<Suspense>` host (NOT a `<Transition>` — the async loader untouched) | demo-smoke PASS (no blank-scene regression); 18 dead `.scene-*` CSS lines deleted |
| **editor chrome / dock / code editor** | NOT meant to change beyond the φ-ladder type migration + the real `<main>` landmark | occlusion + landmark gates green; 0 instrument-serif residue |

## Cross-cut: no unintended regression

- `landmark-one-main` passes (the real `<main>`); not held in any bucket.
- inv δ HARD both axes; only the named square/mobile allowance (self-cleaning
  stale-check).
- A11y: demo-owned clean (spring=100); the only allowance is bucket-glassui
  (ASK-3, outward).
- inv ζ: `proof:dogfood` clean (only the 3 justified rAF exceptions).
- π RM rest-frame PASS on cube + spring.
- 320 engine tests green; `proof:boundary` (hardened) green.

The intended changes are visible in `audit/screenshots/after/`; the gates prove
the un-intended surfaces did not regress.
