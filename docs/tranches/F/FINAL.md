# Tranche F — FINAL

F is keyframes.js' sixth tranche, implemented on `tranche-f-impl` (off the D+E
`tranche-e-impl` HEAD). It is the narrow finishing layer the post-E deep-SOTA assay
(F.W0) surfaced — **net-new, NARROW, and ~90% of the post-E stack ALREADY-SOTA and
left untouched** (`F.md § ALREADY-SOTA`, binding, held throughout). Every wave landed
behind a falsifiable gate that BITES; the full proof suite is green and wired into CI.

This engagement also **drove the cross-repo hand-offs directly** (the user explicitly
relaxed inv-16 for this drive): the value.js charter v2 and the parse-that hand-off are
implemented on each sibling's own `tranche-f-handoff` branch (kf consumes them unchanged
through the `lerpValue → iv._lerp` seam on re-pin — ZERO kf edit needed).

## Wave-by-wave (landed · gated)

**Band 0 — Verification**
- **F.W1** — fixed the broken benches (the type-only-barrel import → the `engine` value
  module) + authored `interp-buffer` / `sync-step` / `compile` / `spring-tick` benches +
  shaped `parser.bench.ts`. `proof:bench-runs` (run-check, non-empty). The Band-1
  measure-first substrate.
- **F.W2** — every `proof:*` gate wired into CI (the library cohort into `gates`, the demo
  cohort — `proof:dogfood`/`demo-elevate`/`modern-web`/`platform-adopt`, three inv-tagged,
  previously **0** matches — into `demo-smoke`). `proof:ci-coverage` (21 gates invoked, 3
  recorded exclusions; bites on a dropped gate).
- **F.W3** — `proof:orchestration` (stagger/FLIP/decay-rest/Sequence-ordering behaviour
  locks) + the two public-API tests (`createNativeTimeline` guard-absent, `toEasing`
  normalizer). Closed the E.W10 gate asymmetry.

**Band 1 — Engine perf (measured, pixel-identical)**
- **F.W4 (headline)** — the stable-key null-fill clear replaces the `delete`-loop at
  `engine.ts`/`group.ts`, so the reused buffers stay in V8 fast-properties mode
  (`%HasFastProperties === true`, proven under `node --allow-natives-syntax`); a
  single-frame alias returns `flatVars` directly on the no-buffer path. **Real-engine
  threaded-buffer interp ~3.0× (K=2) / 3.0× (K=5) / 2.8× (K=12) faster**; zero-alloc
  preserved; pixel-identical (the full suite is the lock). `proof:interp-fastprops`.
- **F.W5** — the `drive` loop-core reschedules synchronously (no per-frame microtask hop
  for `SmoothProgress`/`SpringProgress`/`Draggable`); the `Animation`/group half HELD
  behind the event-ordering lock (the §Mandate's no-ship-on-assertion). `proof:sync-step`.
- **F.W6** — the computed-unit endpoint cache. **DISPOSITION:** the clean home is value.js
  (`lerpComputedValue` + the `getComputedValue` memo); a kf-side wrapper would duplicate
  value.js's resolver + add a library-global resize listener for a niche path, so per the
  §Mandate (no boundary breach) the win **landed in value.js (C1/C2/C4/C7** — −94%
  measured, resolve-count O(frames)→O(1), `bumpLayoutEpoch()` exposed). kf consumes it
  unchanged through `iv._lerp` on re-pin (the spec's sanctioned value.js-half path).

**Band 2 — Parsing consumption seam (correctness, byte-stable for the common case)**
- **F.W7** — per-keyframe `animation-timing-function` round-trips on re-serialize (it was
  read but silently dropped — a CSS-Animations-L1 violation biting the live editor every
  keystroke); the E.W7 `linear()` half closed (`cssTwinFor` recognizes `linear()`; the
  per-keyframe css twin is preserved), so the engine's OWN spring `linear()` round-trips.
  `proof:roundtrip-easing` (+ spring).
- **F.W8** — `animation-composition` captured on `ResolvedKeyframes`; the dead
  `resolved.options` field consumed (a sibling style rule's `animation` shorthand applied
  as the option base, constructor-explicit overriding); `wrapBareKeyframes` decides on the
  parsed AST (a `/* @keyframes */` comment no longer defeats bare-list detection).
  `proof:adapter-capture`.

**Band 3 — Orchestration + arch cohesion**
- **F.W9** — the `Sequence` transport completed (`pause`/`resume`/`reverse`/`timeScale`/
  `progress`/`repeat`/`yoyo`) via scalar-field arithmetic over the existing `seek`;
  seek↔play pixel-identical, C⁰-continuous at flips (`test/sequence-transport.test.ts`).
- **F.W10** — the orchestration tier dogfooded: `useOrbitalInertia` swapped off the
  hand-rolled `Math.pow` decay onto the engine's `decay()`/`Draggable` (the inv-ζ analogue),
  a `Sequence`+`stagger` scene added, `animate({ path })` front-door dispatch wired.
  inertia-parity test + `proof:dogfood` exercises the new scene. _(see the F.W10 commit.)_
- **F.W11** — the boundary cohesion folds: presets routed through the heavy
  `loadAnimationEngine` surface (the `presets` namespace; the README's dead
  `import { fadeIn }` reconciled); the 4× clamp converged onto `internal/leaves.clamp`;
  `group.ts`'s `lerp` retargeted to value.js. Byte-identical. `proof:cohesion` +
  `proof:boundary` holds.

**Band 4 — Modern platform / SVG**
- **F.W12** — CSS-native `MotionPath` / `fromMotionPath` — animates `offset-distance` over
  an author `offset-path`, compositor-thread (a surgical WAAPI `%` exemption for
  `offset-distance`), zero value.js dependency. `proof:motion-path`.
- **F.W13** — `text-wrap: pretty` SHIP (scoped, ≤1 surface); the directional View-Transition
  `types` helper is a glass-ui-HANDOFF (H-1); typed scene-VT / `Mod+K` palette / intrinsic-
  size / SplitText BOOKed.

**Band 5 — Demo design cogency**
- **F.W14** — undo/redo for the destructive editor (`useRefHistory`, debounced; `Mod+Z`/
  `Mod+Shift+Z` through the existing registry; a visible toolbar pair).
- **F.W15** — the a11y SHIPs (the `contenteditable` pane labeled + focus-ring; the asset
  `<img>` alt; a visible shortcuts-discovery trigger).
- **F.W16** — the rail/ball idiom promoted to `design-idioms.css` (the honest correction of
  the W11 record); the hero gets an `sr-only` mirror + `aria-hidden` decorative spans and
  lets `text-wrap: balance` own wrapping (the JS `width<768` break deleted).

## Cross-repo hand-offs (driven directly, on each sibling's `tranche-f-handoff`)
- **value.js** — A2 the latent unit-regex correctness bug, C5 the 24 no-op length units, B1b
  `formatColor` `/alpha`, A1 `any()`→`dispatch()` (2.41×), B3+B5 the color-channel plan
  (3.96×), D2 the SoA carrier (K-gated), F4 verified-no-change, F7 the leak; **+ C1/C2/C4/C7
  the computed-endpoint memo** (the F.W6 win, −94%). 1607 tests green. NOT published.
- **parse-that** — the non-reentrant error state threaded onto `ParserState`, the unsound
  id-only packrat isolated off the hot path (+~36ns/parse), the span dist completed (0.9.0),
  the `§1.5` expose; the risky `(id,offset)` re-key honestly withheld (booked). 266 tests
  green. NOT published.

## Deferred ledger — CLEAN (zero KFE)
P-invariant-28 is VACUOUS for F — D was the terminal home for every keyframes-owned
deferral. F folded **no** chronic debt; its content is net-new assay findings. The F.W6
kf-side wrapper is recorded-withheld (the win landed in value.js C1, its clean home). The
BOOKs (composition-honoring, the held `Animation`/group sync half, the typed scene-VT,
SplitText/MorphSVG/DrawSVG → value.js VJ-F1) each carry their own gate in the wave spec and
are stable. No item is named-forward to a seventh tranche; the one chronic-by-design item
(the value.js charter, C-1) is chronic *correctly* — and this drive implemented it anyway.

## Release tier + the outward legs (USER-DOMAIN — confirm-first)
F's own tier is **minor** (additive `MotionPath` + `Sequence` transport + `presets`
surface; the perf folds isomorphic; the parsing fixes correct a WRONG value to right,
byte-stable for the uniform case; the demo SHIPs additive). The combined **B + C + D + E +
F** publish tier is **major**, driven by C/D — one provenance-signed publish ships the whole
stack. The **version owner is Mike Babb** (`mike@babb.dev`).

The outward legs stay USER-DOMAIN, confirm-first: (1) push `tranche-f-impl` + the
merge-to-master strategy; (2) the **gh-pages deploy** → keyframes.babb.dev (the `deploy.yml`
workflow authored this tranche, or the established peaceiris push); (3) the **npm publish**
(`changeset version` → tag → `release.yml`), in dependency order
(value.js → parse-that → keyframes), each re-pinning the consumer. Everything up to
"ready-to-publish, CI green, demo built + validated" is autonomous.
