# Tranche A — PROGRESS

Status board for keyframes.js' first tranche. Updated at wave boundaries.
The plan is `A.md`; the close report is `FINAL.md` (authored at W5).

## Phase

**COMPLETE** — all six waves landed on explicit user authorization (2026-06-03);
released as 3.0.0 (one major) via the changeset + the CI provenance publish. The
tranche close is `FINAL.md`; the release record is `CHANGELOG.md`. 286 tests
green (was 260; +26); clean-runner library gate + `proof:boundary` green. An
adversarial multi-agent review ran before publish and caught one real defect (the
`AnimationGroup` reduced-motion snap repainting children to the initial frame via
`reset()`); fixed + gated by two new final-visual assertions.

## Wave status

| Wave | Title | Phase | Status | Hard gate |
|---|---|---|---|---|
| **A.W0** | Format reconciliation + hygiene | DEV | **landed** | Scaffold + W0-W5 specs + design doc + FINAL authored; changeset↔tranche contract codified; CI-break issue #1 filed; `src/animation/CLAUDE.md` re-synced to the boundary topology; precepts gitlink confirmed `63240e6`; hygiene (gitignore + dock-PNG archival). |
| **A.W1** | Design slice + release-CI repair | DEV→IMPL hinge | **landed** | Design doc authored; glass-ui→optionalDependencies + lockfile regen + `tsconfig.lib.json`/`check:lib`/`build:lib` + provenance + `node.js.yml` retired. Clean-runner `npm ci && check:lib && build:lib && test && proof:boundary` green with no `file:` resolution (verified via a full repo copy to /tmp). |
| **A.W2** | Boundary ergonomics | IMPL | **landed** | `EasingResolvable` retires the hand-rolled resolvers (numeric/timeline; morph delegates); silent-linear window closed (eager-resolve + dev-warn); `.at()`-pre-resolution detectable; zero static value.js edge. 11 focused tests. |
| **A.W3** | `proof:boundary` gate | IMPL | **landed** | `scripts/proof-boundary.mjs` builds a spring-only source entry, asserts 0 value.js + 0 `engine.ts` static edge, wired into CI; negative test (value.js import into `spring.ts`) turned it RED → reverted → PASS. |
| **A.W4** | Engine modern-web/perf pass | IMPL | **landed** | Exported RAFPlayback PRM gate; heavy `Animation`/`AnimationGroup` reduced-motion snaps; `scheduler.yield()` group batching (INP); WAAPI spring `linear()` = LAND; README posture. 15 tests. LoAF observer + Playwright >50ms trace named-forward (see W4.md). |
| **A.W5** | Close ceremony + release | IMPL (LAST) | **landed** | π build-verification floor (286 tests + build:lib + proof:boundary green) + ι + overfitting audit + `FINAL.md` + 3.0.0 changeset cut; publish via the CI provenance leg on the `v3.0.0` tag. |

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
3. **Constellation-adoption fold** — `audit/constellation-adoption-2026-06-02.md` books keyframes' dev.sh/deploy.sh (library SHAPE) + screenshot archival (2 dock PNGs → `-Aarchive`) + before/after π adoption (A.W4-conditional) + precepts bump + cruft sweep (51 logs + 7 `.DS_Store`); all BOOKED, none executed.

## Open deferrals

None at A-open beyond the named-forward `Worker`/`OffscreenCanvas` substrate (no consumer; note-only). A runs zero-deferral: every audit item lands in a wave, retires with rationale, or is a recorded named-forward.
