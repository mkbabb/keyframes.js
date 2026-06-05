# Tranche E — DELTA (E-open → E-close)

Per-surface intended change, each paired with the **biting gate** that is the
regression authority (the W6 discipline: the gates verdict, not the eye). The AFTER
screenshot matrix runs via the checked-in `scripts/capture.mjs` on a Playwright host /
CI; here the structural + behavioural regression authority is the gate suite
(`npm run proof:all` PASS at close).

## Library surface (the published API)

| Surface | Wave | Intended change | Pixel/behaviour | Gate evidence |
|---|---|---|---|---|
| `src/animation/{engine,frame-compiler,utils,waapi}.ts` | W7 | 5 correctness fixes (colorSpace re-derive · createFrame index · WAAPI guard · WAAPI commit-on-finish · linear() read-back) | pixel-affecting **where currently wrong** (test-locked); WAAPI/linear() isomorphism-RESTORING | `proof:engine-correctness` (6 lock-tests, each reds on revert) |
| `engine.ts` interpFrames | W7 | standalone playback reuses one buffer + `processFrame` method + scale zero-width snap | behaviour-identical | `proof:standalone-zero-alloc` + `npm test` |
| `frame-compiler.ts` frameId | W8 | monotonic → content-derived `(startIx,stopIx)` | invisible (no consumer keys on frame.id) | `proof:compile-deterministic` |
| `src/animation/{stagger,flip,drag,decay,sequence,animate}.ts` + spring/animations/index | W10 | NEW additive API (orchestration tier) | purely additive — no existing surface moves | unit tests + `proof:boundary` (light helpers value.js:0) |
| `src/animation/{engine,reduced-motion,timeline,waapi}.ts` | W9 | @property reg · live-PRM · dense WAAPI sampling · additive native ScrollTimeline | feature-detected; JS path unchanged where unsupported | `proof:platform-adopt` (17 tests + 6 source clauses) |
| `group.ts` / `src/animation/CLAUDE.md` | W5 | managed-pause contract documented (a note) | zero behaviour change | `proof:engine` managed-pause-doc clause |

## Demo surface

| Surface | Wave | Intended change | Pixel/behaviour | Gate evidence |
|---|---|---|---|---|
| `App.vue` (452→344) · `useOrbitalPointer` (376→249) · OrbitalDrag | W1 | encapsulation r2 — composables extracted, appliers moved | behaviour-isomorphic (same engine calls/emits) | `proof:decomposition` (extended) |
| 6 listener files + 3 observers + 2 querySelector | W2 | → `useEventListener`/`useResizeObserver`/owned refs | happy-path byte-identical; leaks closed | `proof:brittleness` clause 4 (allowlist EMPTY) |
| `design-idioms.css` · `style.css` + call sites | W3 | `.gold-shimmer` owned · tokens · `.progress-bar` dedup · **`--panel-max-h` `vh→dvh`** | isomorphic EXCEPT the **named** `dvh` delta (desktop identical; mobile slightly-shorter cap under expanded URL bar — a correctness win) | `proof:idioms` (extended) |
| `useKeyframeOps.ts` | W8/W4 | editor double→single compile + `yieldToMain` between parse and compile | behaviour-identical; INP relief | `proof:decomposition` async-blob + `npm test` |
| `App.vue`/`scenes.ts`/`useSceneTransition`/`useSceneSwap` | W11 | View-Transitions scene nav (feature-detected) + spring fallback | **named** VT cross-fade where supported; spring fade where not; PRM = instant cut | `proof:demo-elevate` VT clause |
| CopyButton · TimelineTrack · AnimationVisualizer · design-idioms `:focus-visible` | W11 | a11y uniformity (roles/keyboard/focus ring/inert) | keyboard/AT-only; visual unchanged | `proof:demo-elevate` a11y clause + `lighthouse-gate` aria-hidden-focus (inert fix) |
| `--spring-snappy` · `progress-dot` · `.dock-inset` | W11 | idiom r3 — ζ reconcile · promotion · define | **named**: the calmer ζ slide + the `.dock-inset` inset on 2 scenes | `proof:demo-elevate` idiom-r3 clause |
| `AnimatedText` · `style.css @font-face` · `EditorStartScreen` | W11 | first-paint — PRM guard · no 200% stop · `size-adjust` fallback · signpost | PRM/CLS-only; the `@font-face` is CLS-**stabilizing** (removes a shift, adds none) | `proof:demo-elevate` first-paint clause |
| `AnimationControls` (Monaco panes) + `useSceneVisibilityPause` | W11/W4 | forceMount + content-visibility + document.hidden pause | cost-only (cached pane same; paused scene resumes same) | `proof:demo-elevate` cwv clause |
| `StartingStyleScene`/`StartingStyleTarget` (NEW) | W11 | `@starting-style` + spring-`linear()` copy-paste artifact scene | a NEW surface — no existing pixels move | `proof:demo-elevate` cwv clause (scene exists + PRM guard) |
| `CSSCodeEditor.vue` | W4 | Monaco namespace + workers → dynamic import() at mount | editor renders identically once mounted; only the eager load disappears | `proof:modern-web` monaco-deferred (bundle-graph probe) + `demo-smoke` |
| `index.html` · `scenes.ts`/dock | W4 | font preload · route-chunk hover-warmup | zero behaviour change | `proof:modern-web` font-preload + hover-warmup clauses |
| `CommandPalette.vue` | W11 | DELETED (dead code, unimported) | pure net-deletion | `proof:demo-elevate` (the scene set renders) |

## No unintended regression

Every gate that bites — `proof:boundary` (inv α) · `proof:dogfood` (inv ζ) ·
`proof:zero-alloc` · `proof:engine` · `proof:decomposition` · `proof:brittleness` ·
`proof:idioms` · `proof:demo-elevate` (inv ο) · `proof:modern-web` ·
`proof:engine-correctness` (inv ν) · `proof:standalone-zero-alloc` ·
`proof:compile-deterministic` · `proof:platform-adopt` (inv ξ) · `npm test` (460) —
PASSES (`npm run proof:all`). The named pixel deltas are the only non-isomorphic
surfaces; every other change is isomorphic / keyboard-only / behaviour-identical,
proven by the gates, not asserted. The AFTER screenshot matrix is the visual
corroboration, captured on a Playwright host (CI) via the checked-in harness.
