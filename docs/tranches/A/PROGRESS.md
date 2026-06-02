# Tranche A — PROGRESS

Status board for keyframes.js' first tranche. Updated at wave boundaries.
The plan is `A.md`; the close report is `FINAL.md` (authored at W5).

## Phase

**DEVELOPMENT** (W0 reconciliation + W1 design). The implementation half (W2-W5)
is authored-now-run-later and opens only on explicit user authorization. The
dev/impl boundary lands at the W1 design-doc close; the `build:lib` CI repair
rides W1 as the dev→impl hinge.

## Wave status

| Wave | Title | Phase | Status | Hard gate |
|---|---|---|---|---|
| **A.W0** | Format reconciliation + hygiene | DEV | planned | Scaffold + W0-W5 specs authored; changeset↔tranche contract codified; CI-break issue filed; `src/animation/CLAUDE.md` re-synced to boundary topology; precepts gitlink confirmed `63240e6`. |
| **A.W1** | Design slice + release-CI repair | DEV→IMPL hinge | planned | Design doc authored; clean-runner `npm ci && npm run build:lib && npm test` green with no `file:` resolution. |
| **A.W2** | Boundary ergonomics | IMPL | planned | `EasingResolvable` retires the 3 `.ready()` copies; silent-linear window closed; `.at()`-pre-resolution detectable; zero static value.js edge. |
| **A.W3** | `proof:boundary` gate | IMPL | planned | Gate builds spring-only entry, asserts 0 value.js bytes + 0 `engine-*` static edge, wired into CI; negative test bites. |
| **A.W4** | Engine modern-web/perf pass | IMPL | planned | Reduced-motion snaps on the heavy path; `scheduler.yield()` breaks >50ms group tasks (Playwright trace); WAAPI `linear()` landed-or-refuted; README posture section. |
| **A.W5** | Close ceremony + release | IMPL (LAST) | planned | π (build-verification floor) + ι + overfitting + `FINAL.md` + changeset cut (publish user-domain). |

## Verified facts at A-open (W0 evidence)

- **Boundary is live + sound.** `dist/` confirms the KF-B1 split: `keyframes.js` barrel 17.1 KB (static, value.js-free), `engine-DuAFoqZF.js` 24.7 KB (the value.js-bearing dynamic chunk), `leaves-Bu89334e.js` 1.0 KB (the light leaf math). `package.json` carries `"sideEffects": false`.
- **The silent-linear footgun is real.** `src/animation/numeric.ts:112` — `this.timingFn = linear; this._pendingEasingName = easing;` — a string name interpolates linearly via `.at()` until `.ready()` resolves it through `import("./engine")`.
- **Three hand-rolled `.ready()` copies confirmed.** `numeric.ts:170` (`ready()` + `_easingReady` memoize + `_pendingEasingName`), `morph.ts:94` (delegates to `animation.ready()`), `timeline.ts:74,91` (`resolveEasingName` + `ready()`). No shared contract.
- **CI cannot build the library without glass-ui.** `ci.yml`/`release.yml` run `npm run build` = `vite build --mode production`; `package.json` devDeps carry `"@mkbabb/glass-ui": "file:../glass-ui"`. `engines: >=22`, all workflows pin node 24 (node pin is clean — the node-20 issue is glass-ui's, not keyframes'). `vite.config.ts` already routes gh-pages to a separate `dist/gh-pages/` outDir; the missing split is the *script* (`build:lib`).
- **`prefers-reduced-motion` is partial.** `numeric.ts:46,50` + `smooth`/`spring` honor it via `respectReducedMotion` (SSR-safe `matchMedia`); `engine.ts` (`Animation`/`CSSKeyframesAnimation` play path), `morph.ts`, `timeline.ts` have no opt-in.
- **`scheduler.yield()` absent.** `group.ts:323` `tick()` awaits all child `tick()` promises then `draw()` composites with no long-task break; `grep scheduler|postTask|yieldToMain` → 0 hits.
- **WAAPI is rAF-first + conservative.** `waapi.ts:171` emits `easing: "linear"` for delegation; `springLinearStops`/`springTimingFunction` exist but do not widen WAAPI eligibility to spring curves yet.
- **Tree-shaking is asserted, not gated.** No `proof:*` gate in `package.json`; the boundary claim lives only in `CHANGELOG.md`.
- **README has no modern-web posture.** `grep -i baseline|reduced-motion|scheduler|tree-shak|sideEffects` in `README.md` → 0 hits.
- **`src/animation/CLAUDE.md` is stale.** Documents `index.ts` holding `Animation, CSSKeyframesAnimation` and `../parsing`/`../units`/`../easing`/`../math` paths — pre-KF-B1 / pre-value.js-extraction geography. The heavy classes now live in `engine.ts`; leaf math is `internal/leaves.ts`.
- **Precepts submodule canonical.** Checkout HEAD = recorded gitlink = `63240e6` (the audit's "drifted to `f27627e`" is already resolved; no keyframes submodule action — the words uncommitted-pointer debt in A5 §0.1 is words-domain).
- **No `docs/tranches/` existed before A.** keyframes ran on changesets only; A is the first tranche.

## Trigger / scope-reveal log

(empty — populated at execution)

## Cross-repo perimeter (USER-DOMAIN — recorded, not executed)

1. **The changeset cut + tag + publish.** A.W5 writes the changeset; the `Version Packages` PR → `v*.*.*` tag → `release.yml` → `npm publish` is user-domain (outward-facing, confirm-first). A.W1 makes that leg runnable on a clean runner for the first time but does not run it.
2. **File the CI-break issue** (A.W0) — `gh issue create` is a write to the GitHub remote; orchestrator/user-domain.

## Open deferrals

None at A-open beyond the named-forward `Worker`/`OffscreenCanvas` substrate (no consumer; note-only). A runs zero-deferral: every audit item lands in a wave, retires with rationale, or is a recorded named-forward.
