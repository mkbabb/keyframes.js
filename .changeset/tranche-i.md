---
"@mkbabb/keyframes.js": patch
---

Tranche I — the runtime-integrity / gate-blindspot closure. I recovered **nine live
breakages** (B1–B9 + K) that Tranche H's 97 green gates had certified over a broken
demo — because every H oracle was a *proxy* (source-shape / jsdom / localStorage /
self-baseline / token / markdown). I fixes the breakages at their seams AND overhauls
the gate regime so "green" means **a human using the product would see it work**.

**The library-touching changes (the patch — strictly-more-correct BUGFIXES).** Unlike H,
I is **not** byte-stable vs 4.1.0 — two `src/animation` deltas land, both bugfixes with
no signature change and no behavior change for well-formed input:

- **`format.ts` — `CSSKeyframesToString` serializes from the declared template
  (`parsedVars[i]`), not the live `at(progress)` DOM-resolving sample (I.W0 / B5).** The
  old path round-tripped an interpolated frame and could emit a degraded/empty selector;
  the template source is the faithful, deterministic serialization.
- **`group.ts` — `AnimationGroup` defaults its compositor `transform` to a typed no-op
  and lazily adopts the first child frame's transform (I.W0 / B1).** A childless group no
  longer runs a composite over an empty value set.

The empty-input crash B1/B5 opened on (`parseCSSValueUnit("")` throwing the cryptic
`Parse error at offset 0: "......"`) is **two-sided**: the kf-side seam above is *not*
self-sufficient — the rainbow group-play still reaches the bare-empty parse. The
load-bearing half is **`@mkbabb/value.js`'s `parseCSSValueUnit` empty-input contract**
(return `ValueUnit(0)`, never throw), so this release **re-pins
`@mkbabb/value.js` `^0.11.1` → `^0.11.2`** (the version that publishes the contract).
Verified by falsification: rebuilding the demo on pristine published 0.11.1 reds
`proof:engine-no-throw-on-play`; the re-pin greens it. **The dependency floor move is the
reason a maintainer may elect to ship this as a `minor` instead of a `patch` — version
owner's call.**

**The gate-regime overhaul (the durability keystone — unpublished, CI-only).** The proxy
lattice is retired and replaced by a two-tier `proof:all` = `proof:correctness`
(10 *actuating* runtime gates that open a browser over the built `dist` and drive
PLAY + SWITCH + DRAG) + `proof:hygiene` (structure/meta). The headline is
**`proof:live-session`** — ONE interaction-driven session accumulating a single S2a
error-budget = 0 across the whole battery plus the product-facing DOM (B1–B9 + font).
**`proof:gate-is-runtime`** machine-enforces that every wave's §Hard gate is
interaction-driven and wired to the correctness tier; **`proof:chronic-closure`** is
rewired so every chronic exits via a runtime gate that *bit*. Five H proxy gates retired
(`proof:demo-console-clean`, `proof:dock-morph-settled`, `proof:no-orphan-specular`,
`proof:scene-icons`, `proof:dragscrub-single`) — each folded into its actuating successor.

**The demo work (unpublished — Cloudflare Pages `keyframes.babb.dev`, NOT this npm bump).**

- **I.W1/B2** — bind-proof `RAFPlayback` + `useRafScene` consolidation: a synthetic
  `visibilitychange` on a playing raw-rAF scene raises no `_gen` throw.
- **I.W2/B4** — control-surface single authority + the unified `EasingEditor`.
- **I.W3/B3** — amiga subject = orbit-pivot = framing; the WebGL root sheds
  `content-visibility` (the RC-2 ReadPixels GPU-stall source is gone — `cvAnc=null`).
- **I.W4/B6/B8** — one drag seam owns gesture-in-flight + a single composed frame driver
  + the dock width-morph holds 0 dropped frames at 4× throttle (consumed from glass-ui).
- **I.W5/B9/K** — icon single-source + one build root + an honest 404 + the page title.
- **I.W6/B7** — the specular consume-edge (glass-ui **~3.9.0** flat-default, no kf fork)
  + the Plus-Jakarta reclaim (override `--font-stack-text` at `:root` — the demo's
  identity is Instrument Serif + Fira Code over native sans, not glass-ui's brand font).

**Cross-repo (inv-16 — kf consumes PUBLISHED siblings, never forks/patches).**
`@mkbabb/value.js` **0.11.2** (published this tranche — the B1 empty-input contract) and
`@mkbabb/glass-ui` **~3.9.0** (the specular flat-default + dock retune) are both consumed
as published registry packages. The glass-ui brand-typography opt-in ask is filed to the
AX session (`glass-ui/docs/tranches/AX/coordination/from-keyframes-I-totality.md`).

**Version owner: Mike Babb (`mike@babb.dev`).** The SemVer tier (patch vs minor, given
the value.js floor move) and the `changeset version` → tag → `release.yml` → `npm publish`
leg are **user-domain, confirm-first**. The Cloudflare Pages demo deploy is the separate
green-CI-gated trigger (the close merges `tranche-i-dev` → `master`, superseding the
`d469e69` damage-control revert by shipping the actual fix). CI must be green first.
