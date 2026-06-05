---
"@mkbabb/keyframes.js": minor
---

Tranche E — the demo elevated to the modern-web standard the engine already held, the
engine's correctness gaps closed, and the orchestration tier shipped.

This release ships atop the stacked **Tranche B (`tranche-b-3-1-0`) + Tranche C
(`tranche-c`) + Tranche D (`tranche-d`)** changesets — all cut, never published —
folded so one provenance-signed publish ships the whole B+C+D+E provenance (the
combined SemVer tier is **major**, driven by C/D; E's own contribution is a
non-breaking **minor**).

**E's published-library surface:**

- **New public API (additive, the orchestration tier — E.W10):** `stagger`,
  `flip`/`flipShared`, `drag`/`Draggable` + `decay`/`decayRest`, the `Sequence`
  temporal orchestrator (named to not shadow the published `Timeline`),
  `SpringProgress.fromDuration({ duration | visualDuration, bounce })`, and the
  single-call `animate(target, input, opts?)` front door. The light helpers carry
  zero static value.js edge (`proof:boundary` holds); `animate` rides
  `loadAnimationEngine`.
- **Modern-platform adoption (E.W9, feature-detected):** `@property` registration via
  `CSS.registerProperty`, live `prefers-reduced-motion` observation
  (`onReducedMotionChange`), dense WAAPI sub-segment sampling, and an ADDITIVE native
  `ScrollTimeline`/`ViewTimeline` bridge (`createNativeTimeline` /
  `attachNativeScrollTimeline`) — the JS sampler stays as the proven fallback (the
  native-replace ARCH-kill holds).
- **Engine correctness (E.W7, test-locked):** `setColorSpace`/`setHueMethod` re-derive
  compiled color carriers; `createFrame` seeks the correct (template) index space;
  the WAAPI guard rejects the layout-dependent unit set; a finite delegated WAAPI play
  commits-then-cancels (zero residual filling animations); `getTimingFunction` reads
  back `linear()` to its true curve. Plus standalone zero-alloc playback (E.W7) and a
  deterministic content-derived `frameId` (E.W8).

The **demo** (E.W1 encapsulation r2 · E.W2 the vueuse listener gestalt · E.W3 styling
r2 · E.W4 perf + modern-web · E.W11 View-Transitions/a11y/first-paint) lands in the
demo + CI gates and does not change the published API. E.W5 is BOOK-only (a doc note).

**The version owner** for the combined B+C+D+E publish is **Mike Babb**
(`mike@babb.dev`), who finalizes the SemVer tier and drives `changeset version` → tag →
`release.yml`. The publish leg stays user-domain, confirm-first.
