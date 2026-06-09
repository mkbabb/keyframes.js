# I.W6 — IMPL record (the specular consume-edge + the Plus-Jakarta font reclaim)

**Status:** LANDED · `proof:specular-absent-at-rest` GREEN · `proof:demo-fonts` GREEN · `tsc` 0 ·
branch `tranche-i-dev`. The glass-ui v3.8.0/v3.9.0 publish (the wave's S1 coordination ask)
SHIPPED — kf consumed it; no kf fork.

## What landed

- **S1+S2 — the two-sided consume-edge (glass-ui PUBLISHED → kf bumps + rides the default).** The
  AX session published glass-ui **3.8.0** (Card `specular="off"` default) then **3.9.0** (the W54
  specular cohesion: the moving-specular `::before` folded into `.glass-material` with rest
  `--specular-intensity` defaulting to **0** — glass.css:110-114). kf bumped `@mkbabb/glass-ui`
  `~3.5.1 → ~3.9.0` (tilde; skipped 3.6/3.7 per the wave). **ZERO kf-side CSS, no fork, no
  `::before{content:none}` neutralizer.** Verified live (chrome-devtools-mcp): the dock-button +
  stage-card `::before` render `opacity: 0` at rest.
- **B7 — the bloom is GONE at rest.** `proof:specular-absent-at-rest` (the INVERTED gate): across
  cube/easing/spring/sequence/motion-path, ZERO of 23 glass `::before` catch-lights paint a bloom
  at rest (max rendered alpha 0 ≤ 0.05) — stage cards (specular="off") AND the 9–11 dock/play
  glass tracks (rest-intensity-0). The PRIMARY oracle is the rendered `::before` alpha (perceptual,
  not source-shape). Born-RED at 3.5.1 (0.22–0.35); GREEN at 3.9.0.
- **S4 — `proof:specular-handoff` DELETED.** The born-RED IOU against a then-vaporware target is
  gone (the target published; its concern folds into `proof:specular-absent-at-rest`, a state THIS
  repo reaches). The old `proof:no-orphan-specular`'s "record the residue" framing is superseded
  (its full retirement folds into I.W7's census).
- **THE PLUS-JAKARTA FONT RECLAIM (a 3.9.0 consume-edge side effect — user-flagged).** glass-ui
  3.9.0's typography.css force-applies its brand "Plus Jakarta Sans" to the body/text register of
  EVERY consumer (`body { font-family: var(--font-text) }`, `--font-text → --font-stack-text →`
  Plus Jakarta; the `@theme inline` bridge can't be overridden directly). keyframes.js does NOT use
  Plus Jakarta — its identity is Instrument Serif (display) + Fira Code (mono) over a clean native
  UI sans. Fix: override the underlying **`--font-stack-text`** at `:root` (the documented glass-ui
  consumer lever, tokens.css:6) so the body/dock/controls reclaim the demo's native sans — without
  the half-loaded webfont the demo build does not serve. `proof:demo-fonts` GREEN: NO Plus Jakarta
  on body/dock/chrome, display still Instrument Serif. **The gestalt fix (glass-ui scoping its brand
  typography opt-in) is a coordination ASK** authored to the AX session
  (`glass-ui/docs/tranches/AX/coordination/from-keyframes-I-totality.md`).
- **S3 — the substrate depth (NON-BLOCKING, M-2):** deferred as a follow-up — the bloom-removal
  (clause a) is the deliverable and is GREEN; the page-substrate legibility is a hygiene corroborator
  that does not gate the wave.

## Coordination (the AX session, in totality)

`glass-ui/docs/tranches/AX/coordination/from-keyframes-I-totality.md` — authored: (1) specular
RESOLVED + thank (W54 rest-intensity-0); (2) dock perf consumed (W06/W61 retune — kf's
`proof:perf-frame-budget` confirms the dock expand holds 0 dropped at 4× throttle); (3) THE ASK —
scope glass-ui's brand typography opt-in (decouple `--font-stack-sans` from `--font-stack-text`) so
a font-opinionated consumer isn't overridden; (4) the W61 dock-unify-root API notes.
