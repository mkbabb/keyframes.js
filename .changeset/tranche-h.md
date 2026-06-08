---
"@mkbabb/keyframes.js": patch
---

Tranche H — the demo restored to its design language, the scene+playback state machine
made the keystone, the four chronics CLOSED via SYSTEM gates, and the durability
gate-regime sealed. H is overwhelmingly a **demo** tranche — the published library
surface (`src/animation/index.ts`) is **byte-stable vs 4.1.0**, so the npm bump is a
**patch** (4.1.0 → 4.1.1). The demo (the bulk of H — unpublished, `files: ["dist"]`)
deploys to **Cloudflare Pages** (`keyframes.babb.dev`) separately; it is NOT an npm
release.

**The one library-touching change (the patch — a BUGFIX).** `frame-compiler.ts` gains a
fail-explicit belt at the compile seam (H.W0 H-A2): a blank/whitespace keyframe selector
used to reach value.js's `parseCSSValueUnit("")` and throw the cryptic, un-typed
`Parse error at offset 0: "......"` — one of the two live console crashes H opened on.
The seam now throws the **already-public** `AnimationOptionError` (re-exported from
`index.ts` since Tranche A) naming the malformed selector. No new export, no signature
change, no behavior change for any well-formed input — a strictly-more-correct error
path. Locked by `test/w0-crashes.test.ts` (typed error on `""` / `"   "` + a
no-false-positive guard that a valid keyframe map still compiles + interpolates).

The engine stayed **FENCED** (inv ζ): the only `src/` deltas are this `frame-compiler.ts`
bugfix and `src/env.d.ts` (a demo-only `*.svg?component` ambient module declaration for
the vite-svg-loader icon seam — not part of the published `dist` library surface).

**The demo work (unpublished — Cloudflare Pages, NOT this npm bump).**

- **W1 — the scene+playback state machine (the keystone):** a single FSM owns scene
  selection + playback so the route-storm blank state (the W0 crash trigger) is
  structurally dead.
- **W2/W9/W10/W11/W12 — the design language restored + refined across four feedback
  rounds:** cartoon depth as panel-depth (D2), glass-card stages, the control-surface
  DFA, uniform labels, re-instantiated expressive scene icons, the rail·stage·rail one-
  grid layout (W3), easing-sidebar minimalism, sequence/motion-path enrichment, and the
  per-scene easter eggs.
- **W4/W5/W6 — easing/hero/icon idiom · scene icons + Discrete→Spring merge + cube/amiga
  perf · the typing-dots dogfood.**
- **W7 — the mobile single-page overlay + the springy `SpringProgress` drawer (D10/D13).**
- **W8 — the gate-regime close (the durability keystone):** the chronic-closure meta-gate
  + the consume-leg reconciliation.

**The four chronics — CLOSED (the H repair = the chronic-closure meta-gate, so none can
re-paper).**

- **cartoon-shadow (D2)** → CLOSED via SYSTEM gates: `proof:no-orphan-specular`
  (partitioned) + `proof:cartoon-is-panel-depth` + `proof:glass-and-cartoon`.
- **φ-hero (D7)** → CLOSED via `proof:phi-leaf-zero` + `proof:hero-rung` SYSTEM gates.
- **mobile (D10)** → CLOSED via `proof:mobile-single-page` + `proof:drawer-spring`.
- **dock (D5)** → CLOSED via `proof:dock-morph-settled` GREEN (the consumed glass-ui
  ~3.5.1 retune). `proof:chronic-closure` (the meta-gate) is GREEN.

**Cross-repo handoffs (born-RED, inv-16 — kf consumes published siblings, never
forks/patches).**

- **glass-ui Card-specular SHEEN** on the sanctioned glass stages (the user's W8R "keep
  glass + handoff the sheen" decision) rides `proof:specular-handoff` born-RED; it
  resolves at glass-ui **3.8.0** `specular="off"`, at which point kf bumps as the W34
  consumer-adoption leg (cosmetic). Coordination filed at
  `glass-ui/docs/tranches/AX/coordination/from-keyframes-W8-specular-consume-edge.md`
  and kf-side `docs/tranches/H/glass-ui-AX-handoff.md`.
- **value.js / parse-that** slices (standing — consumed on re-pin through the
  `lerpValue → iv._lerp` seam).

**Version owner: Mike Babb (`mike@babb.dev`).** The npm publish leg is **user-domain,
confirm-first** — Mike finalizes the SemVer tier and drives `changeset version` → tag
`v4.1.1` → `release.yml` (which re-runs `check:lib` → `build:lib` → `test` →
`proof:boundary` before `npm publish --provenance`). The Cloudflare Pages demo deploy
(`keyframes.babb.dev`) is the user's separate, user-domain trigger. CI must be green
first on both legs.
