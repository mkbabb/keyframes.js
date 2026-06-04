# π — recorded at FULL (not floor)

B recorded π "binds at full" but shipped only a screenshot matrix + a jsdom
unit substitution (`matchMedia` mocked) — the exact tooling-contingency the
precept forbids passing off as full. C makes π bind at full, by a checked-in
re-runnable instrument, and records it here (inv ε applied to π).

C installed nothing B lacked (Playwright + a real Chromium), so the
tooling-contingency does NOT apply — π is recorded as BINDING, not provisional.

## The two FULL-only clauses, run

**1 — the ≥5-frame reduced-motion animation-timing probe.**
`scripts/capture.mjs --reduced-motion` toggles `prefers-reduced-motion: reduce`
(Playwright `emulateMedia` + a reduced-motion context) on the spring + cube
scenes in a real Chromium, captures 6 frames spanning the named 2000ms window,
and asserts the reduced-motion path renders the FINAL/REST frame (a non-empty
canvas/DOM pixel sample over the subject rect).

- **Sequencing (inv ε, recorded — not silently coupled):** the assertion is
  HARD only with `KF_RM_HONORED=1`. At C.W1 the demo did NOT yet honor
  reduced-motion (motion-dogfood 1), so the probe ran + emitted the artefact
  with the rest-frame check as a NOTE; C.W3 landed the honoring
  (`respectReducedMotion: true` at the `defaultAnimationOptions` source + the
  cube idle-bob `@media` gate).
- **Verified PASS (W3):** `KF_RM_HONORED=1 node scripts/capture.mjs
  --reduced-motion` →
  `capture — PASS: reduced-motion paints its rest frame; contrast measured.`
  (cube: 6 frames, final-frame non-empty: true; spring: 6 frames, final-frame
  non-empty: true). This is the runtime confirmation of B.W2's rest-position
  contract on the actual rendered scene — NOT the jsdom unit substitution
  (which stays as the unit floor, not accepted as the FULL artefact).
  Falsifiable: if the reduced-motion path rendered the INITIAL frame (motion
  not honored), the assertion reds.

**2 — the contrast-vs-background measurement.** The same harness emits a
per-surface measured luminance-ratio table (`reduced-motion-report.json` +
`capture-report.md`) for the display/heading/dock surfaces — a real artefact,
not Lighthouse's pass/fail flag. The spring scene's `.settled-badge` (measured
1.97:1 by axe) was closed at the W2 a11y close to ≥4.5:1 in light + dark.

## Verdict

π binds at FULL. Both FULL-only instruments are checked in and re-run from the
repo (not `/tmp`); the reduced-motion rest-frame assertion is HARD and PASSES;
the contrast table is a measured artefact. No tooling-contingency floor.
