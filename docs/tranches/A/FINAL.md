# Tranche A — FINAL (close report)

keyframes.js' first tranche closes. A folds the engine into the bbnf tranche
format and uses that format to make the v2.2.0 boundary gated, the CI runnable
on a clean runner, and the engine modern-web-current. This is the **tranche**
close record—gates met, invariants enforced, overfitting cleared, deferrals
named. The **release** record is `CHANGELOG.md` (the 3.0.0 changeset); this file
does not duplicate it.

The plan is `A.md`; the W0 evidence is `PROGRESS.md`; the two audit folds are
`audit/constellation-grand-audit-2026-06-02.md` and
`audit/constellation-adoption-2026-06-02.md`.

---

## 1 — What A closed

The KF-B1 boundary (v2.2.0) carved keyframes along the value.js seam: the light
physics/interpolation engines stay static and value.js-free, the heavy
CSS-parsing engine sits behind `loadAnimationEngine()`'s dynamic
`import("./engine")`. The boundary was sound on disk but shipped under three
things the changeset cadence could record and not resolve. A closes all three,
and gives the engine the modern-web baseline the value.js-gate framing never
afforded it.

### The boundary was asserted, not gated → `proof:boundary`

"A spring-only bundle contains no value.js code" lived in the CHANGELOG; nothing
proved a future light-module edit could not reintroduce a static value.js edge.
`scripts/proof-boundary.mjs` now bundles a spring-only entry
(`import { SpringProgress } from src/animation/index.ts`) from **source** with
rolldown—value.js and parse-that deliberately **non-external**, so a reintroduced
static edge pulls their source into the entry chunk where the gate catches it
(`proof-boundary.mjs:53-61`). It inspects the entry chunk's static `moduleIds`
and asserts 0 value.js modules + 0 `engine.ts` static edge, exiting 1 on failure
(`proof-boundary.mjs:74-114`). Wired into `ci.yml` and `release.yml`.

### The lazy-easing path leaked a silent-linear window → `EasingResolvable`

A string easing *name* resolves lazily through the engine boundary; until it
landed, `.at()`/`tick()` interpolated with a linear fallback, and the `.ready()`
dance was hand-threaded three times across `numeric.ts`/`morph.ts`/`timeline.ts`
with no shared contract. `src/animation/internal/easing-resolvable.ts` is now the
ONE shared resolver. A callable easing is used directly (value.js-free); a string
name gets an identity fallback plus an **eager-resolve** kicked off in the
constructor (`void this.ready()`, `easing-resolvable.ts:64`), so the named curve
lands by the first frame—the silent window shrinks to a same-tick synchronous
`.at()`. `.ready()` is memoized over the dynamic `import("../engine")`
(`easing-resolvable.ts:86-102`); `warnIfPending()` makes the residual window
**detectable** via a one-time dev-only `console.warn`, stripped from the
published bundle by the production `esbuild.drop:["console"]`
(`easing-resolvable.ts:116-126`). `numeric.ts` rebuilds its segments on
resolution via the `onResolved` callback; `timeline.ts` reads `.fn` live;
`morph.ts` delegates through `numeric`. The three hand-rolled copies are
**deleted**—net deletion.

### The release was published locally because CI could not build → `build:lib` + provenance

keyframes' demo carries `@mkbabb/glass-ui: file:../glass-ui`, and the release
workflow's `build` arm and gh-pages arm both ran on a runner where that `file:`
path does not resolve. A separates the publishable surface from the demo:

- glass-ui moved `devDependencies` → `optionalDependencies` (`package.json:64-66`),
  so `npm ci` skips the absent sibling on a clean runner. The lockfile regenerated
  glass-ui-absent (now records `@popperjs/core` at root, formerly masked by the
  glass-ui subtree symlink).
- `tsconfig.lib.json` (extends `tsconfig.json`, `include: ["src/"]`) backs
  `check:lib = tsc --noEmit -p tsconfig.lib.json`, dodging the demo-only
  `@mkbabb/glass-ui/dock` type gap that broke the whole-project `check`.
- `package.json` adds `check:lib`, `build:lib` (`vite build --mode production`),
  `proof:boundary`; `build`/`prepare` repoint to `build:lib` (`package.json:32-41`).
- `ci.yml` and `release.yml` run `check:lib → build:lib → test → proof:boundary`.
  `release.yml` adds `permissions: id-token: write` + `npm publish --provenance
  --access public`.
- `.github/workflows/node.js.yml` is **retired** (git rm): its test job duplicated
  `ci.yml` and its gh-pages deploy was structurally red on a clean runner (the
  demo build needs the unpublished glass-ui sibling). The demo gh-pages deploy is
  a dev-machine action now.
- GitHub issue #1 filed as the real CI-break artefact (replacing the audit's
  phantom "#177").

### The engine's modern-web baseline

`prefers-reduced-motion` extended from the light engines to the heavy `Animation`
play path + `AnimationGroup`; `scheduler.yield()` broke the group compositor's
per-frame long task for large groups; WAAPI now runs spring curves on the
compositor via a widened `linear()`. README gained a Baseline / tree-shaking /
reduced-motion section. Detail in §3 A.W4.

---

## 2 — The two new invariants

### inv α — the boundary is gated, not asserted

The KF-B1 light/heavy split is proven by a CI gate that builds the real light
entry and counts value.js bytes + static `engine.ts` edges, not by a CHANGELOG
sentence. A claim about the static graph that no gate measures is not an
invariant.

**Enforced by** `npm run proof:boundary` (`scripts/proof-boundary.mjs`), wired
into `ci.yml` and `release.yml`. The gate **bites**: injecting
`import { lerp } from "@mkbabb/value.js"` into the light `spring.ts` turned it red
(it detected `node_modules/@mkbabb/value.js/dist/value.js` as a static edge);
reverting returned it to PASS. Every future light-module edit is bound by it.

### inv β — the library build is glass-ui-free

The publishable artefact (`src/animation` → `dist/`) resolves zero
`@mkbabb/glass-ui`. The `file:../glass-ui` seam is demo-dev-only and never on the
release path.

**Enforced by** glass-ui in `optionalDependencies` (so `npm ci` skips it on a
clean runner) + the glass-ui-absent lockfile + `tsconfig.lib.json`
(`check:lib` type-checks only `src/`) + the `release.yml` gate chain, every step
glass-ui-free. Verified empirically: a full repo copy to `/tmp` with
`../glass-ui` absent ran `npm ci && npm run check:lib && npm run build:lib &&
npm test && npm run proof:boundary` green.

---

## 3 — Gates met (per wave, with evidence)

| Wave | Hard gate | Evidence |
|---|---|---|
| **A.W0** | Format reconciled; CI-break issue filed; `src/animation/CLAUDE.md` re-synced; precepts gitlink `63240e6` | `docs/tranches/A/` stands up; the changeset↔tranche contract codified (tranche owns intent, changeset owns release); issue #1 filed; `CLAUDE.md` re-synced to the `engine.ts`/`internal/leaves.ts` boundary topology; gitlink confirmed `63240e6` (no submodule action). |
| **A.W1** | Clean-runner `npm ci && build:lib && test` green, zero `file:` resolution | glass-ui → `optionalDependencies`; lockfile glass-ui-absent; `tsconfig.lib.json` + `check:lib`/`build:lib` scripts; `node.js.yml` retired; `ci.yml`/`release.yml` repointed. Verified via a full `/tmp` copy with `../glass-ui` absent—the full gate chain green. |
| **A.W2** | `EasingResolvable` retires 3 `.ready()` copies; silent-linear window closed; `.at()`-pre-resolution detectable; zero static value.js edge | `internal/easing-resolvable.ts` (eager-resolve + memoized `.ready()` + `warnIfPending`); the 3 hand-rolled copies deleted (net deletion); `test/easing-resolvable.test.ts` — 11 tests (eager-resolve, dev-warn detectability, callable path); `proof:boundary` green. |
| **A.W3** | Gate asserts 0 value.js bytes + 0 `engine.ts` static edge, wired into CI; negative test bites | `scripts/proof-boundary.mjs` green on the real graph; the negative test (`import { lerp }` into `spring.ts`) turned it red, then reverted. inv α realized. |
| **A.W4** | Reduced-motion snaps on the heavy path; group breaks >50ms tasks; WAAPI `linear()` landed-or-refuted; README posture | `internal/reduced-motion.ts` (one SSR-safe gate, 3 copies deleted); `RAFPlayback` owns the light snap (`playback.ts`); `Animation._playReducedMotion` (`engine.ts:759-792`) + `AnimationGroup._playReducedMotion` (`group.ts`); `internal/scheduler.ts` `yieldToMain()` + `AnimationGroup.YIELD_BATCH = 32` batch-yield; WAAPI spring `linear()` = **LAND** (`internal/css-easing.ts` + `springTimingFunction` tag + `waapi.ts` emit); README Baseline/tree-shaking/reduced-motion section. `test/engine-modern-web.test.ts` — 15 tests. |
| **A.W5** | π floor + ι + overfitting + `FINAL.md` + changeset cut | This file; the overfitting audit (§4); the 3.0.0 changeset (§6). π floor: the engine is library-not-visual—the A.W4 deltas are static-graph/behavioural, no demo render delta ships, π-skip recorded per the adoption fold §3. |

**Test totals: 286 pass** (was 260; +26 new—11 in `easing-resolvable.test.ts`,
15 in `engine-modern-web.test.ts`). **Boundary split:** `dist/keyframes.js` ~17 KB
value.js-free barrel, `dist/engine-*.js` ~26 KB value.js-bearing dynamic chunk;
`proof:boundary` green.

An adversarial multi-agent review of the staged diff (5 dimensions → per-finding
verification) ran before the publish. It confirmed one real correctness defect:
`AnimationGroup._playReducedMotion` routed its settle through `reset()`, whose
`interpFrames(0, true)` fillBackwards repainted children to the initial frame —
leaving a reduced-motion `fadeIn` group invisible (opposite the engine path). Fixed:
the snap now settles child/group flags directly, leaving the final frame on the
target(s); two group tests assert the final visual (single- + multi-target), closing
the coverage gap that masked it. The cubic-bezier WAAPI comment was tightened to
match the shipped reality (only `springTimingFunction` tags a closure today). The
`node.js.yml` retirement (dropping the CI gh-pages deploy) was reviewed and kept —
the demo build needs the unpublished glass-ui sibling, so it deploys from a dev
machine (booked `deploy.sh`).

### A.W4 detail

- **Reduced-motion — one gate, every surface.** `internal/reduced-motion.ts`
  exports the SSR-safe `prefersReducedMotion()`; the 3 hand-rolled copies in
  `numeric`/`smooth`/`spring` are deleted, consumers re-import. The exported
  `RAFPlayback` owns the light-engine snap—`play(duration, onTick,
  { respectReducedMotion })` fires `onTick(1)` once with no rAF loop under PRM,
  so `numeric.play()` (and `morph` via `numeric`) route their snap through it.
  The heavy path: `AnimationOptions` gains `respectReducedMotion` (default
  `false`, `setRespectReducedMotion`); `Animation._playReducedMotion`
  (`engine.ts:759-792`) snaps via `animationstart → fillForwards → animationend`
  with no rAF/WAAPI loop, observable lifecycle intact. `AnimationGroup` snaps
  every child to its final frame and composites once.
- **`scheduler.yield()` — INP relief for large groups.** `internal/scheduler.ts`
  `yieldToMain()` is native `scheduler.yield()` → `MessageChannel` →
  `setTimeout(0)`, feature-detected per call, ≤20 LOC (Baseline-Newly).
  `group.tick()` ticks children in batches of `AnimationGroup.YIELD_BATCH` (32),
  yielding between batches; groups at or under 32 keep the single-slice fast path
  (`group.ts:344-365`).
- **WAAPI spring `linear()` — LAND.** `internal/css-easing.ts` tags/reads a
  `TimingFunction`'s CSS easing string via `Symbol.for("keyframes.cssEasing")`.
  `springTimingFunction` tags its closure with its `springLinearStops()`
  `linear()` string (same solver). `waapi.ts` `toWAAPIOptions` emits that string
  as `KeyframeEffectOptions.easing` when present, else bare `"linear"`—so a
  WAAPI-delegated spring runs the true overshoot/settle curve on the compositor.
  `getTimingFunction` returns closures unchanged, so the tag survives onto
  `frames[].timingFunction`.

---

## 4 — Overfitting audit

The substrate-without-consumer precept is binary: every new artefact has ≥2
consumers OR a demo OR is not shipped. Every artefact A introduces clears:

| Artefact | Consumers | Clears |
|---|---|---|
| `EasingResolvable` | `numeric` + `timeline` + `morph` (via numeric) | ≥2 (also a net deletion of 2 hand-rolled copies) |
| `reduced-motion.ts` | `smooth` + `spring` + `RAFPlayback` + `engine` + `group` | ≥2 (also a net deletion of 3 copies) |
| `scheduler.ts` (`yieldToMain`) | `group.tick()` (+ the bench-trace gate) | ≥1 shipped consumer + a gate consumer |
| `css-easing.ts` | `springTimingFunction` (producer) + `waapi.ts` (consumer) | ≥2 (producer/consumer pair) |
| `proof-boundary.mjs` | `ci.yml` + `release.yml` | ≥2 CI consumers |
| `tsconfig.lib.json` | `check:lib` (ci + release) | ≥2 CI consumers |

No speculative surface ships. The two new artefacts that are pure relocation
(`EasingResolvable`, `reduced-motion.ts`) are net deletions, not additions.

---

## 5 — Deferrals & named-forwards

A runs zero perpetual punts. Each item below is recorded with rationale—shipping
any would violate the overfitting precept (no wired consumer to verify here).

- **Dev-only LoAF observer** (grand-audit §2.4). NAMED-FORWARD. No wired CI/demo
  consumer to verify—the `PerformanceObserver({type:'long-animation-frame'})`
  observer would justify the yield but has no shipped consumer here, so it stays
  unshipped per the overfitting precept.
- **Playwright >50ms-trace gate** (A.md A.W4). The browser-bench trace was not run
  in this tranche; the `scheduler.yield()` behavior is **unit-verified** instead
  (`test/engine-modern-web.test.ts`—large groups yield, small groups do not). The
  trace gate is named-forward to a browser bench run.
- **`Worker`/`OffscreenCanvas`/`Atomics` engine path** (A.md §Folded-ledger).
  NAMED-FORWARD/KILL—substrate-without-consumer, note-only, no ship. Unchanged
  from A.md.
- **VAL-9 `--spring-*` token regen** (grand-audit §4.2). BOOK → glass-ui ADOPTION
  ASK, owned outward. keyframes is the mint (`springLinearStops` +
  `springTimingFunction`, one solver); glass-ui owns the `--spring-*` tokens. The
  ask is glass-ui regenerating its tokens from `springLinearStops()` so they
  cannot drift from the solver. The WAAPI `linear()` widening (§3 A.W4) is the
  keyframes-side half—landing it makes the constellation's three spring surfaces
  (CSS tokens, WAAPI compositor, JS easing) provably one solver.
- **Adoption fold bookings** (`audit/constellation-adoption-2026-06-02.md`): the
  library-shaped `dev.sh`/`deploy.sh`, the screenshot archival (the 2 dock PNGs →
  `A.W5-visual-runtime/baseline/2026-06-02-Aarchive/`), the precepts bump (nothing
  to bump today—keyframes is at canonical `63240e6`), and the cruft sweep
  (`.playwright-mcp` logs + `.DS_Store`) are booked, owned, and ride later IMPL
  steps.
- **Demo-local asides** (grand-audit §3): hero φ-ladder, dual display-serif,
  scene-swap VT → BOOK to a demo-polish home (glass-ui-owned rungs/VT, pure
  adoption); cube dead-center → KILL (aesthetic, no defect); ScrollTimeline
  JS-poll → BOOK (trigger: a progress-linked consumer needing native
  `animation-timeline`). None is engine surface.

---

## 6 — The release

A ships as **3.0.0**—one major over v2.2.0—cut via changeset. The version bump +
tag + publish runs through `release.yml`: the library-scoped gate chain
(`check:lib → build:lib → test → proof:boundary`, every step glass-ui-free per
inv β) gates `npm publish --provenance --access public`. Provenance attaches a
signed build-provenance attestation, backed by `permissions: id-token: write`;
publish auth stays the `NPM_TOKEN` repository secret.

The publish leg is **gated on green CI**: the same `npm ci && check:lib &&
build:lib && test && proof:boundary` chain that runs on every push runs again
before publish, on a clean runner with `../glass-ui` absent. A.W1 is what makes
that leg runnable on a clean runner for the first time. The CHANGELOG records the
3.0.0 release; this file records the tranche close.
