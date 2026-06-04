# Tranche C — FINAL

keyframes.js' third tranche closes. C had three duties: make B's close honest
(inv ε), make the design language whole (the φ-ladder the demo forked), and make
the shop-window run on its own engine (inv ζ). All three landed, gated on
keyframes' own green CI (PR #3, branch `tranche-c-impl`), and — the discipline C
exists to establish — **every gate this FINAL records MET resolves to a
checked-in, re-runnable instrument shown to PASS, not a narration.**

This is C's defining move: it audited its OWN predecessor's *claims*, not just
its code, and folded the corrections. The seven gates B's FINAL asserted MET
that its committed artefacts recorded FAILING are each made true here.

## § B-overclaim reconciliation (inv ε's first application)

Each of B's seven asserted-not-met gates, now corrected + verified:

1. **The a11y landmark.** B wrapped the shell in `<main class="contents">` and
   marked `landmark-one-main` MET — but `display:contents` strips the landmark
   role, so it failed on every page. **NOW:** a REAL `<main class="grid
   place-items-center place-self-stretch">` occupies the grid's centre cell
   (byte-identical layout, real landmark box). Verified: the lighthouse gate
   (S6) drives the open-panel state and `landmark-one-main` is not held in any
   bucket — it MUST pass, and does (C.W1).

2. **inv δ.** B's spec demanded "zero dock-over-content overlap"; the shipped
   gate downgraded it to a console NOTE and never ran the controls-open state.
   **NOW:** `occlusion-gate.mjs` promotes dock-over-content to a HARD failing
   assertion (content-rect intersection, per-scene `dockFloatAllowed`), runs
   BOTH `controls:{closed,open}` axes, and is bite-proven (`KF_OCCLUSION_INJECT=cube`
   reddens it). One real occlusion surfaced (square/mobile) → a NAMED allowance
   with a self-cleaning stale-check, not a silent advisory (C.W1 + the W3
   work-area cap).

3. **π at FULL.** B recorded π "binds at full" but shipped only screenshots +
   a jsdom unit substitution. **NOW:** the `--reduced-motion` probe captures
   ≥5 frames over the named duration on cube + spring and asserts the
   reduced-motion path renders the REST frame (`KF_RM_HONORED=1`) — VERIFIED
   PASS once W3 honored reduced-motion; a per-surface contrast table is emitted.
   π binds at full, recorded (audit/pi.md).

4. **The capture harness.** B authored the before/after edict but the harness
   lived in `/tmp` — "re-runs identically" was unsatisfiable. **NOW:**
   `scripts/capture.mjs` is checked in (C.W0) and re-run at the close (S1, the
   AFTER capture under `audit/screenshots/after/`).

5. **The LoAF observer.** B shipped it claiming a 2nd consumer that was a stub.
   **NOW:** `bench/playwright.bench.ts` is the real 2nd consumer — it drives a
   200-cell AnimationGroup composite, reads `window.__kfLoaf`, and fails on
   >50ms main-thread blocking (CI-green; runner-calibrated composite size, the
   strict 50ms threshold unchanged). Overfitting closed (C.W1).

6. **inv β.** B claimed `npm ci` "cleanly skips" the absent glass-ui sibling;
   it actually links a DANGLING symlink. **NOW:** the prose matches the
   artefact exactly (disposition b — "npm tolerates the dangling optional link
   non-fatally; the library graph never dereferences it"); W6.md/FINAL.md/ci.yml
   de-contradicted (C.W1).

7. **W5's hard gate (A11y=100 + SEO).** B left it deferred while marking W5
   done. **NOW:** `scripts/lighthouse-gate.mjs` is wired into CI's demo job,
   drives the OPEN-panel editing state, and is HARD on any a11y audit outside
   ONE remaining named allowance bucket (bucket-glassui → ASK-3) + SEO<90. The
   demo-owned bucket (bucket-w2: image-alt + the spring-badge color-contrast)
   was EMPTIED at the W2 a11y close — spring scenes now score a11y=100 (C.W1 +
   W2).

## § The gate table (each VERIFIED by a checked-in instrument)

| Gate | Instrument | Verified |
|---|---|---|
| inv α — boundary | `proof:boundary` (hardened: bare-import / subpath / `export const` classes closed) | PASS (CI) |
| inv γ — paints | `scripts/demo-smoke.mjs` | PASS (CI) |
| inv δ — occlusion | `scripts/occlusion-gate.mjs` (HARD, both axes, bite-proven) | PASS + reddens-on-inject |
| π — reduced-motion + contrast | `scripts/capture.mjs --reduced-motion` (`KF_RM_HONORED=1`) | PASS (rest frame, both scenes) |
| LoAF 2nd consumer | `bench/playwright.bench.ts` | PASS (CI); reddens on >50ms inject |
| landmark + A11y/SEO | `scripts/lighthouse-gate.mjs` (open-panel) | PASS (CI); bucket-glassui only |
| inv ζ — dogfood | `scripts/proof-dogfood.mjs` | PASS; reddens on a non-allowlisted rAF |
| design fork | the consumption sweep (`grep instrument-serif demo/` = 0) | PASS |
| engine residuals | `npm test` (one-core / one-tickDt / fail-explicit / css-twin gates) | 320 PASS |
| default css-twin | `test/default-easing-css-twin.test.ts` | PASS (proven-withheld) |

## § Invariants

- **inv α — hardened.** The boundary gate's residual false-negative classes
  closed; `rolldown` declared; the CI glass-ui clone pinned to `v3.2.0`.
- **inv β — honest.** disposition (b), prose == artefact (no "clean skip"
  fiction).
- **inv γ — holds.** the demo paints (the four blank scenes stay fixed; the
  scene-swap restored by dogfooding without re-breaking async loading).
- **inv δ — HARD.** dock-over-content is a failing assertion across both
  control axes; the one real occlusion (square/mobile) is a named,
  self-cleaning allowance.
- **inv ε — established + applied.** every MET gate above is a re-runnable
  instrument's passing run; the seven B overclaims are reconciled (§ above).
- **inv ζ — established.** the demo carries no hand-rolled rAF loop a shipped
  light engine already is (the seven transposed onto
  `SmoothProgress`/`SpringProgress`/`NumericAnimation`/`RAFPlayback`); reduced-
  motion is honored; `proof:dogfood` is the standing gate.

## § Overfitting verdict

Every C artefact clears the ≥2-consumer bar. The LoAF observer's second
consumer (the >50ms bench gate) is real + CI-wired. The light engines
(`SmoothProgress`/`SpringProgress`/`RAFPlayback`) gained their ≥2nd EXTERNAL
consumer via the demo dogfood. Net: the engine residual transposition is
net-deletion at its core (−20); the additions are gate-hardening + proof tests.

## § Deferrals (named, owned, triggered — zero perpetual punts)

- **The square-scene mobile composition** (the residual square/mobile occlusion
  — the optical-split under-reserve closed-state + the controls-grid starving
  the row open-state) — a NAMED allowance in `occlusion-gate.mjs` with a
  self-cleaning stale-check; owner: a focused square-scene mobile-composition
  pass. The smallest demo scene; the W3 work-area cap mitigated it.
- **bucket-glassui** (button-name / label / aria-input-field-name) — the
  glass-ui `LabeledField` label-association, ASK-3, OUTWARD (inv-16). The full
  lighthouse A11y=100 SCORE binds when glass-ui ships it.
- **The leaf-tail φ-ladder F6** (~128 `text-sm`/`text-xs`/`text-base` body
  sites) — BOOKED to C's mechanical follow-on (the headline tier shipped clean).
- **Permanent archives** — ScrollTimeline-native (KILL, correct); Worker/
  OffscreenCanvas (no consumer). dev.sh/deploy.sh — KILLed-with-rationale (W4
  S7, the terminal call).

## § Release

The changeset (`.changeset/tranche-c.md`, **major**) renders C's published
surface (the W4 engine residuals) and ships alongside the folded B `3.1.0`
changeset — one provenance-signed publish for both tranches. **The publish leg
(`changeset version` → tag → `release.yml`) is user-domain, confirm-first** —
identical to A and B; the publish owner finalizes the SemVer tier.

## § Constellation note

C is one arm of the dock+animation convergence
(`fourier-analysis/docs/constellation/DOCK-ANIMATION-CONVERGENCE.md`). The
convergent headline — the VT-parity spring `--dock-resize-spring:
var(--spring-snappy)`, which keyframes' animation audit AND glass-ui's own
AT.W1b-dock independently prescribed — shipped in glass-ui (PR #1, its own green
CI). The slides spring-dogfood landed clean (`29a781a`) for the slides owner to
integrate (slides is double-driven by its own tranche-E session — booked, not
written).

C closes keyframes making its close honest, its design language whole, and its
shop-window run on its own engine.
