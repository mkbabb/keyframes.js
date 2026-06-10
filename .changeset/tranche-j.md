---
"@mkbabb/keyframes.js": minor
---

Tranche J — THE PUBLISHED SURFACE: the honest minor. npm has been frozen at `4.1.0`
while the library's public API out-ran it by a **full orchestration tier** accreted
across four tranches (E → F → G → I) and never published. This release names that
surface export-by-export, ships the two bugfix patches the pending `tranche-h`/
`tranche-i` changesets carried (CONSUMED into this minor — deleted in the same motion,
not stacked `4.1.0 → 4.1.1 → 4.1.2 → 4.2.0`), and installs the publish-boundary gate
(`proof:published-surface`) that makes the tarball == exports == README agreement
machine-checkable.

**The new public surface (additive — the reason this is a `minor`).**

The LIGHT static tier (value.js-free named exports; importing only these pulls zero
`@mkbabb/value.js` into the consumer graph):

- **`SpringProgress`** — closed-form spring-physics progress tracker (the engine under
  `drag`/`decay`).
- **`springLinearStops`** — spring → CSS `linear()` stops string.
- **`springTimingFunction`** — spring → typed `Easing` (`{ fn, css }` — one curve, two
  forms).
- **`RAFPlayback`** — THE managed, bind-proof rAF driver (`play`/`drive`/`loop`); no
  other module owns a rAF handle.
- **`stagger`** — pure construction-time per-index delay generator.
- **`flip` / `flipShared`** — FLIP (First-Last-Invert-Play) composition over
  `ElementMorph`.
- **`drag` / `Draggable`** — pointer-capture drag/fling input layer over
  `SpringProgress`; release velocity re-seats the closed-form spring.
- **`decay` / `decayRest`** — closed-form frictional glide
  `x(t) = x0 + (v0/k)(1 − e^(−kt))` + its projected resting point.
- **`Sequence`** — the master-playhead TEMPORAL orchestrator (GSAP-Timeline-class
  sequencing beside `AnimationGroup`'s spatial blending).
- **`createNativeTimeline`**, **`resolveEasing`** / **`toEasing`** (the async easing
  factory + normalizer), **`AnimationOptionError`** / **`UnknownEasingError`** (the
  typed fail-explicit errors).

**The `loadAnimationEngine()` dynamic boundary** — the documented front door to the
HEAVY tier (`Animation`, `CSSKeyframesAnimation`, `AnimationGroup`, `getAnimationId`,
`getTimingFunction`, `resolveKeyframes`, `presets`, the option constants) and the new
HEAVY front doors:

- **`animate`** — single-call dispatch on input shape (CSS string / keyframe map /
  vars array / MotionPath spec) + auto-target + auto-play.
- **`MotionPath` / `fromMotionPath`** — CSS-native `offset-distance` sweep over an
  author `offset-path`.
- **`DrawSVG` / `fromDrawSVG`** — stroke-dashoffset line drawing over ONE
  `getTotalLength()` read.

**The bugfixes (consumed from the two pending patch changesets).**

- From `tranche-h`: `frame-compiler.ts` gains a fail-explicit belt at the compile seam —
  a blank/whitespace keyframe selector now throws the typed, already-public
  `AnimationOptionError` naming the malformed selector instead of value.js's cryptic
  `Parse error at offset 0`.
- From `tranche-i`: `format.ts` serializes from the declared template (`parsedVars[i]`),
  not the live DOM-resolving sample; `group.ts` defaults the compositor `transform` to a
  typed no-op (a childless group no longer composites an empty value set); and the
  **`@mkbabb/value.js` floor advances `^0.11.1` → `^0.11.2`** (the published empty-input
  contract: `parseCSSValueUnit("")` returns `ValueUnit(0)`, never throws). The floor
  advance is a contractual tightening protecting consumers who pin value.js themselves —
  advertising it as `minor` is the honest signal.

**Packaging honesty (the same boundary, same motion).** `dist/_redirects` (a CF-Pages
routing relic) no longer rides the tarball (`publicDir: false` at the library seam); the
spurious `vue ^3.5.0` peerDependency is DELETED — the shipped library is Vue-free
(`vue` remains a devDependency of the demo only); `proof:published-surface` +
`proof:readme-runs` gate the tarball contents, the taught/manifested export roster, the
README snippets EXECUTING against the built dist, the `AnimationEngine` interface ≡
runtime parity, and peer-dep honesty.

**Version owner: Mike Babb (`mike@babb.dev`).** The version cut (`changeset version`) →
tag → `release.yml` → `npm publish --provenance` leg is **user-domain, confirm-first at
J.WZ**; this changeset is the wave's deliverable, not the registry mutation.
