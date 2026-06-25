# Tranche R — PROGRESS

**Branch:** `tranche-r-dev` · **Phase:** DEV (the R.W0 audit-fold) · **Opened:** 2026-06-24

The surgical refactor: encapsulation (the 7-zone directory partition + the two god-class carves),
the no-legacy excision sweep, the honest API "in," and the demo scene-fusion. See `R.md` for the
charter; `audit/` for the 32-lane evidence.

## IMPL DRIVE (opened 2026-06-24) — live orchestration state

**Owner authorized the full IMPL drive** ("Begin and continue the current tranche… complete the
plan IN TOTALITY… maximal parallelism and workflow usage… authorized to publish/push/deploy").
Team-lead orchestration via two parallel git worktrees (file-disjoint `src/` vs `demo/`):

- **Track L (library)** → worktree `../keyframes-r-lib` on branch `r-track-lib`:
  R.W1 → R.W2 → R.W3(lib §2A–2E + the new `proof:no-silent-fallback` gate) → R.W4 → R.W7. Sequential
  (one worktree, coupled barrel/gates). Opus for the structural carves, Sonnet for mechanical sweeps.
- **Track D (demo)** → worktree `../keyframes-r-demo` on branch `r-track-demo`:
  R.W5 → R.W6 (+ the standalone R.W3 demo §2F/2I/2J/2K/2M items). Sequential.
- **Integration** (main repo `tranche-r-dev`): merge both branches, reconcile the shared files
  (`package.json` scripts, `proof:ci-coverage` roster, the `proof:no-silent-fallback` gate spanning
  both, README), run the full proof suite, then **R.W8 close** → 5.1.0 → publish + Cloudflare deploy.

**Baseline confirmed 2026-06-24** (main repo): build GREEN; the four charter-reds reproduce
(`proof:decomposition`, `proof:chronic-closure`, `proof:agent-surface`, `proof:lint-clean` all exit 1).

**Resume protocol** (for the retry-cron / a fresh session): check `git -C ../keyframes-r-lib log`
and `git -C ../keyframes-r-demo log` for track progress; check the task board (#266–278); the
in-flight wave is whichever track task is `in_progress`. A retry-cron (`13 */2 * * *`) re-enters this
drive if a session-limit wall is hit; DELETE it once shipped.

> **LIVENESS SIGNAL (lesson, 2026-06-24):** an agent's `tasks/<id>.output` transcript size is
> UNRELIABLE — R.W2c's stayed at 146 bytes while the agent committed + wrote files actively. The
> TRUE liveness signals are (a) new commits on the track branch and (b) recent worktree write-mtimes
> (`find <wt>/src -printf '%TT %p' | sort -r | head`). A clean tree + no new commits + no writes for
> >15 min ⇒ stalled. Recent writes (seconds/low-minutes ago) ⇒ ALIVE — do NOT edit its files.

**Track progress (commit on each branch):**
- **R.W1 ✅ GREEN** (`r-track-lib` @ `b52ad3e`) — 7-zone partition; keystone deleted; 3 gate co-edits + `proof:no-flat-siblings`; build/test/boundary/engine/no-flat-siblings/ci-coverage/lint-clean all green; known-violations 15→9. Decomposition backlog (9 files >500L): engine/animation 1408, group/group 925, resolve/index 797, sequence 699, compile/frame-compiler 670, spring/progress 628, scroll/scene 528, compile/backward 536, waapi 573. → engine+group = R.W2; the other 7 = R.W2b (2 of them — resolve, frame-compiler — take R.md §5 narrow overrides; 5 carve).
- **R.W5 ✅ GREEN** (`r-track-demo`, 11 commits @ `b8b7263`) — dead-code excised; 4 cross-cutting extractions; 8 scenes fused to `demo/scenes/<name>/`; `proof:scene-colocated` green; re-pointed 24 gate scripts that hardcoded old scene paths. Demo oversize backlog (R.W6-decomp): cube/CubeTarget 560, amiga/AmigaScene 539, square/SquareScene 505.

- **R.W6-core ✅ GREEN** (`r-track-demo` @ `5f3f04e`, 4 commits) — vueuse residuals, callbacks-as-props→emits, typed SceneExposedApi, state-drift fixes, z-index comma-default excise, --spring-snappy un-shadow + the standalone R.W3 demo legacy items; `proof:brittleness` 9/9 green; check + gh-pages clean. (Surviving `shallowRef<any>`/`--spring-snappy` greps are comments only — verified.)

- **R.W6-decomp ✅ GREEN** (`r-track-demo` @ `a452349`, 6 commits) — amiga 539→307 (`useAmigaThree.ts`), cube 560→495 (`CubeAxisLines.vue`), square 505→446 (`useSquareKeyboard.ts`); `proof:demo-no-oversize` green; **DM-1 + DM-5 chronic exits = CONTINGENCY KILL** (glass-ui 4.0.1 lacks BC `dockStrandKeepalive`/`ariaGuard`; kf-internal disjoint-event handler + `KfPillTabs.vue`); `proof:workaround-deletion` S1/S2/S7/S8/S9 green. **8th-carry HARD STOP satisfied.**

### ✅ TRACK D (demo) COMPLETE — `r-track-demo` @ `a452349`
R.W5 + R.W6-core + R.W6-decomp all green. Clean tree. Pre-existing non-R red noted: `proof:demo-elevate` (reds identically on the untouched main baseline — glass-ui handoff, dispositioned at R.W8/integration).

- **R.W2 ✅ GREEN** (`r-track-lib` @ `81a5114`, 3 commits) — engine carve: `PlaybackState` DI, `PlaybackHost` cast + interface ELIMINATED (grep-0), engine/animation.ts 1407→**497** (class body 440), CSSKeyframesAnimation→css-animation.ts, +interpolate/option-setters/compile-bridge/element-resolve. Group carve: scaffold demoted (forcePause/forcePlay/onStart/onEnd/soaBlendLayer excised), group/group.ts 924→**495**, layer-springs 4-way split (entries/scheduler/springs/layer-api) + compositor carve, transformFramesGrouped private (demo+bench fixed). `proof:engine` clauses a/b/c/d green (ceiling 500); 11 gate co-edits (gate-follows-code). engine+group OFF the decomposition red list.

**GATE REGRESSIONS found by independent triage (green-on-main, red-on-lib-wt) — folded into R.W2b:**
`proof:platform-adopt` (ENOENT stale `src/animation/engine.ts`), `proof:roundtrip-fidelity` + `proof:grammar-fuzz` (`[no-source-edit]` — test imports of engine+serializer moved), `proof:compile-replay` (stale path). The R.W1/R.W2 agents mis-reported these as "pre-existing"; they are R-introduced and MUST be retargeted (gate-follows-code).

- **R.W2b ✅ GREEN** (`r-track-lib` @ `8e2fde1`, 9 commits) — ALL 7 over-ceiling files CARVED ≤500 (no new override; resolve 797→290 via `resolveNode` injection breaking the p2-pinned recursion; waapi 4-concern split; sequence/spring/scroll/compile carves). `proof:decomposition` GREEN (1 documented data-volume override = presets/classic.ts 728). The 3 triaged gate regressions (platform-adopt/roundtrip-fidelity/grammar-fuzz) + compile-replay FIXED green. known-violations 15→9.

**LINT/CYCLE finding (R.md §8's "engine↔group↔waapi no-cycle ring"):** the partition's zone barrels created **26 live no-cycle violations** (`engine/index` re-exports `AnimationGroup` from `../group` while `group` imports `engine/animation`; shared `getAnimationId` runtime edge). leaves.ts/value.js-math charter edge ALREADY resolved (R.W1 `pathNot`). Sequenced a dedicated **R.W2c cycle-break** before R.W3 (R.W3's `proof:no-silent-fallback` clause 2 needs lint green).

- **R.W2c ✅ GREEN** (`r-track-lib` @ `d3c6976`, 3 commits) — cycle ring BROKEN: getGroupFactory DI seam inverts engine→group back-edge; `getAnimationId` + spring `solver.ts` → neutral `internal/` leaves; zone barrels stop cross-zone re-export (AnimationGroup composed in load-engine); no-cycle rule honored its documented type-only exemption (`dependencyTypesNot`). **known-violations 9→0 (empty []); `proof:lint-clean` GREEN**; depcruise --no-ignore-known clean; runtime smoke confirms zero public-API change. engine/animation 499L, group/group 496L.

### ✅ TRACK L structural phase COMPLETE (R.W1/R.W2/R.W2b/R.W2c) — `r-track-lib` @ `d3c6976`
decomposition GREEN · lint-clean GREEN · boundary/engine/no-flat-siblings/ci-coverage GREEN · build/test GREEN. Remaining lib charter reds: `proof:agent-surface` (R.W4), `proof:chronic-closure` (R.W8 fold #1).

- **R.W3lib ✅ GREEN** (`r-track-lib`, 5 commits @ `72fa3b0`) — §2A css-metadata FAIL-EXPLICIT, §2B getComputedStyle instanceof guard, §2C resolve CUSTOM_FN_ARG_DROP diagnostic, §2D morph invariant throw, §2E leaf-rule plant verified bites; `proof:no-silent-fallback` authored (lib clauses + lint green; demo addendum integration-deferred). All lib gates green.
- **R.W4 ✅ core GREEN** (`r-track-lib4`, 3 commits @ `297f066`) — `./engine` subpath emits `dist/engine/index.js` (416B thin re-export, zero dup) + `.d.ts`; `animate()` EXCISED from published surface; AnimationEngine JSDoc slimmed; README Quick Start → subpath import + `ts run`; agent-surface scrubbed + regenerated. `proof:in-is-importable`/`agent-surface`/`boundary`/`published-surface`/`readme-runs` green. **GAP: subpath returned `AnimationGroup: undefined`** (engine/index zone-pure post-R.W2c) → R.W4b.

- **R.W4b ✅ GREEN** (`r-track-lib4` @ `c88fb63`) — subpath = FULL static heavy surface via `engine/public.ts` composition barrel; **39 keys ≡ `loadAnimationEngine()`** (AnimationGroup/MotionPath/DrawSVG/MorphSVG/presets/compileToCSS/validate all resolve); `dist/engine/index.js` 1.8KB (no dup); baseline still `[]`; ambient `ScrollAxis`→local alias for API-Extractor followability. All gates green.

### ✅ LIB MERGE COMPLETE — `r-track-lib` @ `437d7e0`
Merged r-track-lib4 (R.W4+R.W4b) → r-track-lib (R.W3lib). One conflict (package.json `proof:hygiene-chain`) resolved keeping BOTH new gates. Integration artifact fixed: `proof:in-is-importable` wired into `ci.yml` gates job (R.W4 had missed it) + `llms` regenerated. **ALL lib gates green** (boundary/engine/decomposition/lint-clean/no-flat-siblings/in-is-importable/no-silent-fallback/agent-surface/published-surface/ci-coverage). Subpath 39 keys intact. Remaining lib charter red: `proof:chronic-closure` (R.W8 fold #1).

**Integration prep (verified):** demo deep-imports library internals **0×** (uses only the `@mkbabb/keyframes.js` barrel — R.W1 restructure is transparent to the demo); demo never touches `scenePlaybackAdapters.ts` (lib R.W2's edit, no conflict). The lib↔demo merge is low-risk; conflicts limited to additive gate-wiring (package.json hygiene-chain, ci-coverage roster, ci.yml).

| In-flight | Wave | Agent | Worktree | Status |
|---|---|---|---|---|
| Track L | R.W7 — README slim · CHANGELOG · llms reclassify · proof:readme-paths-live | Sonnet (bg) | `keyframes-r-lib` (r-track-lib @ 437d7e0) | DISPATCHED 2026-06-24 |

**Next:** R.W7 → integrate `r-track-lib` + `r-track-demo` into `tranche-r-dev` (resolve additive gate-wiring) → full proof suite (cross-track `proof:no-silent-fallback` demo clauses + `proof:scene-colocated` + `proof:brittleness` go green on the merged tree) → R.W8 close (chronic re-point Q→R, ledger, FINAL.md, 5.1.0) → publish + Cloudflare deploy.

## The wave board

| Band | Wave | Title | Status |
|---|---|---|---|
| A | **R.W0** | Audit-fold + the keystone gate-truth reset | **DEV — authored.** keyframes-vue KILLED (`23a6867`); root-file dispositions applied; this board + the fold + the recap landed. The keystone (DELETE `LIBRARY_CEILING_OVERRIDE`) is an authored R.W1 precondition. |
| B | R.W1 | Directory-ize the flat tree (7-zone partition) + 3 gate co-edits | ✅ SPEC — authored; awaits IMPL auth |
| B | R.W2 | The two god-class carves (engine, group) — DI not param-bags | ✅ SPEC — authored; awaits IMPL auth |
| C | R.W3 | The legacy/workaround/fallback excision sweep | ✅ SPEC — authored; awaits IMPL auth |
| C | R.W4 | The honest API "in" + boundary slim | ✅ SPEC — authored; awaits IMPL auth |
| D | R.W5 | Demo scene fusion + dead-code excision | ✅ SPEC — authored; awaits IMPL auth |
| D | R.W6 | Demo brittleness · state · styling | ✅ SPEC — authored 2026-06-24 |
| E | R.W7 | Docs surface (README slim · CHANGELOG convention · llms reclassify) | ✅ SPEC — authored; awaits IMPL auth |
| E | R.W8 | Close (deferred-ledger re-point Q→R · prompt-recap · release) | ✅ SPEC — authored; awaits IMPL auth |

## The surfaced-reds backlog (the reds ARE the charter)

R.W0 restored the load-bearing lint config, which SURFACED real reds the deletions had hidden. These
are R's measured backlog — they go green wave-by-wave, not by a self-raising cap:

| Gate | State | Cause | Discharged by |
|---|---|---|---|
| `proof:decomposition` | RED | resolve-values.ts 796 > 600; the override allowlist masks engine/group | R.W1 (DELETE the override → reds = backlog) → R.W1/R.W2 carve them green |
| `proof:chronic-closure` | RED | dangling `proof:keyframes-vue-published` after R.W0's KILL | R.W8 (re-point Q→R + DM-7 KILL; fold #1) |
| `npm run lint` / `proof:lint-clean` | RED | `leaves.ts → @mkbabb/value.js/math` violates `leaf-no-engine-no-valuejs` (a Q-era WE2 edge vs the rule; already red at HEAD) | R.W3 (reconcile the rule vs the deliberate /math edge) |
| `proof:agent-surface` | RED | the curated index advertises `Animation`/`ScrollTimeline` (dropped 5.0.0) | R.W4 (no-legacy curation cleanup) + the llms reclassify |

## Prompt-recap (A→R) — ZERO dropped

Full table: `audit/retro-prompt-recap.md` (re-verified against the tree). ~40 distinct requests
A→Q→R; 35 ADDRESSED, 4 PARTIAL→FOLD (all the decomposition lineage — R's headline), 1 REVERSED
(keyframes-vue), **zero DROPPED**. The settled ARCH kills (Typed-OM, the codegen spine, SpanParser)
are recorded terminal, not dropped. The recurring precepts (no-legacy, no-workaround, gestalt, KISS,
DRY, isomorphic, encapsulation, inv-16) hold throughout — and ARE the R charter.

## Root-file deletion dispositions (R.W0)

| File | Verdict | Disposition |
|---|---|---|
| `.dependency-cruiser.cjs` | load-bearing (CI: lint + proof:lint-clean) | **RESTORED** |
| `.dependency-cruiser-known-violations.json` | load-bearing (the `--ignore-known` baseline) | **RESTORED** (eliminate entries as R.W1/W2 fix the cycles) |
| `CLAUDE.md` | load-bearing (AI-context + README links) | **RESTORED** |
| `src/animation/CLAUDE.md` | load-bearing (README links the inventory) | **RESTORED** |
| `CONTRIBUTING.md` | junk (a thin wrapper over README/CLAUDE content) | **DELETION ENDORSED** (R.W7 trims the README link) |
| `llms.txt`, `llms-full.txt` | generated artifacts | **KEPT DELETED** (R.W7 reclassifies as build-output: gitignore + CI-generate) |

## §"Open deferrals" — the chronic ledger (the R re-point target; `proof:chronic-closure` substrate at R.W8)

> This is the FORWARD ledger authored at R.W0. At R.W8 close, `proof:chronic-closure` re-points its
> `CHRONIC_LEDGER` from `Q/PROGRESS.md` to THIS table (the no-skip discipline the M/O/P re-points
> violated), and the gate goes green on the re-pointed, accurate substrate. Carries are re-counted
> into R; a row carried ≥4 tranches MUST exit (P-invariant-28).

| Chronic | Born | Chronicity (→R) | Disposition | Closure / exit mechanism |
|---|---|---|---|---|
| **[C] DM-7 keyframes-vue** | K.W12 | 6 (K,L,M,O,P,Q→R) | **KILL** (owner-ratified R.W0) | RETRACTED in totality at R.W0 (`23a6867`): npm-unpublished + `packages/keyframes-vue/` deleted + all refs scrubbed. NO gate cited (the terminal mechanism is the owner-ratified retraction). The dangling `proof:keyframes-vue-published` reference is EXCISED. |
| **DM-1 dock click-strand** (`pointerHandled`/`onPlayPointerDown`, 9 sites) | I (BLK-8) | **8 (I,J,K,L,M,O,P,Q→R) — HARD STOP** | **FOLD → R (no 9th carry)** | R.W6: the glass-ui-BC `DockDropdownTrigger` fix lands + S2 deletes atomically, OR the contingency **KILL** fires (a kf-internal pointer-clean replacement, the band-aid excised). `proof:workaround-deletion` S2. |
| **DM-5 S1 aria-orientation suppress** (`SpringSidebar.vue:43`) | K | 6 (K,L,M,O,P,Q→R) | **FOLD → R** | R.W6: BC SegmentedTabs `role=group` aria-guard publish + kf delete, OR the contingency kf-internal ARIA-compliant replacement (KILL of the band-aid). `proof:workaround-deletion` S1. |
| **DM-24 N-Stage unshelf** | N | 3→4 if it rides R | **FOLD → R (unshelf OR KILL)** | R.W5/R.W6: unshelf+rebase the `n-stage-impl` branch off the 5.0.0 pins, OR formal KILL (the mobile shelf-driver already shipped Q.WC3 — the unshelf may be redundant). R must RULE, not re-defer. |
| **DQ-3 value.js `contrast-color()` consume** | Q | 1 (Q→R) | **FOLD → R** | R.W4: value.js 1.2.0 shipped the parser; author `proof:contrast-color-consume` + wire the resolve, OR ratify a KILL with a reason. |
| **VJ-Q9 color-serialization consume-edge** | Q | 1 (Q→R) | **FOLD → R** | R.W3/R.W4: lock the `color(display-p3 …)` consume shape (round-trip assert), OR record terminally. Retire the bare "WATCH." |
| **DM-5 S8 FN_NAME cure** | K | 5 (K,L,M,O,P,Q→R) | **VERIFY-ONLY → R** | R.W3: confirm `proof:workaround-deletion` S8 GREENED on the 1.2.0 dist (VJ-Q4 `.fnName`, WeakMap retired); fold the consume if still PENDING. |
| **DM-8…DM-15 (×8 VERIFY-ONLY chronics)** | various | 5–10 | **VERIFY-ONLY → R (UNVERIFIED — re-run required)** | Re-verify on the R dist (specular, font-census, mobile, perf-budget, no-throw, DFA, single-writer, lighthouse). Any RED revert is a NEW R wave. NOT "verified green" — rostered to verify. |

## Owner rulings (2026-06-24)

- **Version: `5.1.0`** — stay in the 5.x line ("5.0 is fine"). No 6.0.0. The `/engine` subpath is
  additive, the directory restructure internal, the zero-adoption trims (`animate()`, the granular
  `load*` accessors) recorded as removals — not a major. (R.W8 §S5.)
- **`animate()`: EXCISE** — "remove animate() in favor of our more idiomatic solutions." The idiomatic
  "in" is the `@mkbabb/keyframes.js/engine` subpath + direct `new CSSKeyframesAnimation(...)` (the
  32-site demo pattern). The promote-and-dogfood fork is DECLINED. (R.W4 §2.5.)

## Notes

- The chronic ledger above is the binding fold list (`audit/retro-deferred-ledger.md` §"Disposition
  summary," 10 items). The **structural lesson**: the M/O/P ledger re-points were ALL skipped, leaving
  a stale substrate; R re-points Q→R atomically at close with the gate co-edits, and keeps the no-skip
  discipline so the next tranche inherits a GREEN, accurate ledger.
- The glass-ui-BC-gated items (DM-1, DM-5) are USER-DOMAIN by design (owner WIP) — but P-invariant-28
  forbids a silent re-book: R either lands the BC delete or fires the contingency KILL. DM-1's 8th
  carry is a HARD STOP.
