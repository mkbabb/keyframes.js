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
| `proof:chronic-closure` | ✅ GREEN (R.W8) | was: dangling `proof:keyframes-vue-published` after R.W0's KILL | R.W8 re-pointed Q→R + DM-7 KILL (fold #1); non-vacuity proven (3 planted reds) |
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

## Open deferrals

**THE chronic-closure parse substrate (for `proof:chronic-closure`) — the R consolidated
open-deferrals ledger.** The DIRECT successor to Q's (`docs/tranches/Q/PROGRESS.md §"Open deferrals"`).
At R.W8 close the live `CHRONIC_LEDGER` in `scripts/proof-chronic-closure.mjs:117` re-points
`Q/PROGRESS.md` → THIS table and `LEDGER_LABEL` (`:493`) → `"R/PROGRESS.md"` — the no-skip discipline
the M.WZ/O.WZ/P.WZ re-points violated. Every prior chronic is re-stated here with its R-terminal
disposition + chronicity integer, so no chronic drops across the Q→R transition.

> **SUBSTRATE-TRANSITION NOTE (R.W8 §S1 — the Q→R re-point + co-edits + non-vacuity proof are ONE
> atomic commit).** This section's heading is EXACTLY `## Open deferrals` and the rows below are ONE
> flat table (the Q/L/K/J/I shape `parseChronicTable` accepts byte-for-byte). The band grouping
> (KILL / VERIFY-ONLY / RECORD) is carried in each row's Disposition cell, NOT in `### A…F`
> sub-headings (which would end the single-table parse region). The Q→R re-point was proven
> non-vacuous: three deliberately-malformed R-ledger rows (a FOLD citing a source-shape gate; a
> HANDOFF targeting an unpublished future sibling version; a ≥4-tranche bare BOOK) RED on the three
> clause shapes, then this clean terminal R ledger GREENed the gate. No parser change needed — the R
> substrate honors the Q flat-table shape; the gate-code co-edits are the two path constants + the
> success console label (`R ledger`).
>
> **DISPOSITION VOCABULARY:** `FOLD` · `HANDOFF` · `RE-AFFIRM` · `VERIFY-ONLY` · `BOOK` · `KILL` ·
> `RECORD` · `USER-DOMAIN` · `BUILD-IN` (a kf-owned ABSOLUTE terminal) · `FOLD-LANDED` · `OUT`.
> A `proof:*` name in BACKTICKS is a load-bearing closure oracle held to the band's contract; a bare
> (no-backtick) `proof:*` name is prose evidence (a named non-gate terminal mechanism), exactly the
> Q ledger's FOLD-LANDED convention.
>
> **BORN-RED + RUNTIME contract (the kf-runtime-closing bands FOLD/VERIFY-ONLY):** a backtick-wrapped
> closure oracle must resolve, run in the CORRECTNESS tier, be a RUNTIME gate (opens the dist +
> actuates), and carry a born-RED witness in prose. The ×7 VERIFY-ONLY chronics (DM-9…DM-15) cite
> correctness-tier RUNTIME gates that BIT in their origin tranche. The KILL / RECORD rows close by
> their own discipline (a non-gate terminal mechanism), NOT a kf runtime gate.

| Item | Born | Chronicity | Disposition | Owning R wave | Gate / evidence (closure oracle) |
|---|---|---|---|---|---|
| **[C] DM-7 keyframes-vue 0.1.0 unpublished** (E404; the overfit Vue adapter — the P-inv-28 belt closes as a KILL, NOT a published exit) | K.W12 | **6 (K,L,M,O,P,Q→R)** | **KILL — owner-ratified retraction (the MANDATORY exit; NO 7th carry)** | **R.W0** | **TERMINAL — KILL.** Non-gate terminal mechanism: RETRACTED in totality at R.W0 (commit `23a6867`) — npm-unpublished + `packages/keyframes-vue/` deleted + every ref scrubbed (the proof-keyframes-vue-published script + its package.json key + its CI tripwire removed). The dangling proof-keyframes-vue-published reference is EXCISED — NO gate is cited (the KILL band requires no runtime gate; the KILL disposition IS the closure). The belt does not silently revert to "open": this row records the owner KILL permanently. |
| **[B] DM-1 RF-17 dock click-strand** (`pointerHandled`/`onPlayPointerDown` in `TransportDock.vue`, 9 sites) | I (BLK-8) | **8 (I,J,K,L,M,O,P,Q→R)** | **KILL — contingency KILL of the band-aid (the 8th-carry HARD STOP exit; NO 9th carry)** | **R.W6-decomp** | **TERMINAL — KILL (the contingency, fired).** Non-gate terminal mechanism: glass-ui 4.0.1 lacked the BC `dockStrandKeepalive`, so the band-aid was EXCISED and replaced with a kf-internal disjoint `pointerup`+`keydown` handler (`a452349`). The closure ORACLE that BIT: `proof:workaround-deletion` S2 GREEN on the dist (a source-present detector — born-RED when the `pointerHandled` strand was present; the gate BIT, now GREEN on the excision). The 8th-carry HARD STOP is satisfied via a kf-owned terminal, not a 9th ride. |
| **[B] DM-5 S1 aria-orientation suppress** (`:aria-orientation="undefined"` at `SpringSidebar.vue:43` + `AnimationControls.vue`) | K | **6 (K,L,M,O,P,Q→R)** | **KILL — contingency KILL of the band-aid (the 6th-carry exit; NO 7th carry)** | **R.W6-decomp** | **TERMINAL — KILL (the contingency, fired).** Non-gate terminal mechanism: glass-ui 4.0.1 lacked the BC SegmentedTabs `ariaGuard`, so the suppress band-aid was EXCISED and replaced with a kf-internal ARIA-compliant `KfPillTabs.vue` (`a452349`). The closure ORACLE that BIT: `proof:workaround-deletion` S1 GREEN on the dist (born-RED when the `:aria-orientation="undefined"` suppress was present; the gate BIT, now GREEN on the excision). |
| **[E] DM-5 S8 FN_NAME clone-restamp residual** (the WeakMap clone-stamp ceremony — the VJ-Q4 `.fnName` consume) | K | **5 (K,L,M,O,P,Q→R)** | **VERIFY-ONLY — VERIFIED GREEN on the 1.2.0 dist** | **R.W3** | **TERMINAL — VERIFY-ONLY.** Non-gate terminal mechanism: the workaround-deletion node probe (proof:workaround-deletion S8 — a source-present detector over the dist, off-DOM; the foreign-symbol clone-stamp removed onto value.js 1.2.0 `flatLeaf .fnName`) GREEN. **Born-RED** on the foreign-symbol-stamp tree (the S8 arm BIT before the `.fnName` consume landed; now GREEN). Named in prose, NOT a runtime closure oracle. |
| **[C] DM-24 N-Stage unshelf** (the ~3,500-LOC `n-stage-impl` branch — the mobile scroll-snap carousel) | N | 3→4 (N,O,P→Q,Q→R) | **KILL — redundant (R RULED, not re-deferred)** | **R.W5/R.W6** | **TERMINAL — KILL.** Non-gate terminal mechanism: the mobile shelf-driver already shipped at Q.WC3 (the mobile scroll-snap carousel + typed VT landed in-tree), so the `n-stage-impl` branch unshelf is REDUNDANT. The branch is formally KILLED rather than rebased onto the 5.0.0 pins — R rules a terminal verdict (no silent re-BOOK across the ≥4 belt). |
| **[F] DQ-3 value.js `contrast-color()` consume** (value.js 1.2.0 shipped the parser; kf has no demo use-case) | Q | 1 (Q→R) | **KILL — reasoned (no kf demo use-case)** | **R.W4** | **TERMINAL — KILL.** Non-gate terminal mechanism: value.js 1.2.0 published the `contrast-color()` parser (the root capability is available upstream), but kf has NO demo use-case for `contrast-color()` at this time — no scene resolves it. The consume is KILLED with that reason rather than authoring a gate over an unused capability (the WATCH is retired terminally, not re-deferred). |
| **[F] VJ-Q9 color-serialization consume-edge** (`display-p3(…)` → `color(display-p3 …)` round-trip at the value.js 1.2.0 re-pin) | Q | 1 (Q→R) | **RECORD — covered GREEN by the round-trip corpus (the bare WATCH retired)** | **R.W3/R.W4** | **TERMINAL — RECORD.** Non-gate terminal mechanism: the `color(display-p3 …)` serialization round-trip is already covered GREEN by the roundtrip-fidelity + grammar-fuzz corpora (proof:roundtrip-fidelity + proof:grammar-fuzz, both GREEN on the R dist over value.js 1.2.0 — node-probe + vitest corpora, off-DOM, a parse↔serialize data-model lock with no browser to drive). The bare "WATCH" is retired; no dedicated runtime gate is warranted (the consume shape is a serialization round-trip, not a live interaction). Named in prose, NOT a runtime closure oracle. |
| **[E] DM-8 Lighthouse floors** | B-era | 5 (M,O,P,Q,Q→R) | **VERIFY-ONLY** | **R.W8** | **TERMINAL — VERIFY-ONLY.** Non-gate terminal mechanism: a measured quiet-host artifact (the lighthouse-mobile runner, proof:lighthouse-mobile, re-run with `KF_REQUIRE_LH=1` on the R dist — a load-rest score, never CI-hard-gated per inv-device-honesty; verifies in CI post-push on the quiet runner). Named in prose, NOT a runtime closure oracle; the K/M floors are the hard floor, any regression RED. |
| **[E] DM-9 specular** | D(D14)→H | **8 (D,H,I,K,M,O,Q,Q→R)** | **RE-AFFIRM** | **R.W8** | `proof:specular-absent-at-rest` GREEN; re-verify on the R dist. **Born-RED** in its origin tranche (the at-rest specular sheen; the gate BIT before the no-orphan-specular cure). |
| **[E] DM-10 typography** | D(D7)→I | **9 (D,I,J,K,L,M,O,Q,Q→R; TERMINATED)** | **VERIFY-ONLY** | **R.W8** | `proof:font-census` GREEN (correctness-tier RUNTIME gate — opens the dist + navToScene-drives a computed-font census across all scenes); re-run on the R dist. **Born-RED** in its origin tranche (the dock voice resolved system-sans; font-census BIT on the display tokens before the root fix). |
| **[E] DM-11 mobile** | D(D10) | **10 (D,H,I,J,K,L,M,O,Q,Q→R; TERMINATED)** | **VERIFY-ONLY** | **R.W8** | `proof:spring-slider-continuous` + `proof:subject-animates` GREEN (both correctness-tier RUNTIME gates — drive the live spring slider + the mobile-emulated subject motion over the dist); re-run on the R dist. **Born-RED** in K (the thumb `changeCount:0` over 240 frames + the spring slider literally stepped; the gates BIT before the 60 Hz painter cure). |
| **[E] DM-12 dock perf** | D(D5/D9) | **8 (D,H,I,K,M,O,Q,Q→R)** | **RE-AFFIRM** | **R.W8** | `proof:perf-frame-budget` GREEN (correctness-tier RUNTIME gate — drives the dock interaction + reads the frame budget); re-verify WITH the SoA-`processFrame` + the R.W2 engine split in place. **Born-RED:** the dock STRETCH + lag BIT pre-cure. |
| **[E] DM-13 empty-value** | A(W0)→H | **8 (A,H,I,K,M,O,Q,Q→R)** | **VERIFY-ONLY** | **R.W8** | `proof:engine-no-throw-on-play` GREEN (correctness-tier RUNTIME gate — opens the dist + clicks play on an empty-value input, asserting no throw); re-run WITH the NaN-frame play-time guard in place. **Born-RED** in its origin tranche (the empty-input parse threw on play; the gate BIT on that crash). |
| **[E] DM-14 DFA suspend** | H | **7 (H,I,K,L,M,O,Q,Q→R)** | **VERIFY-ONLY** | **R.W8** | `proof:fsm-suspend-resume-live` GREEN (correctness-tier RUNTIME gate — drives the live FSM suspend/resume over the dist); re-run. **Born-RED** in its origin tranche (the `_gen` DFA suspend threw; the gate BIT on that crash). |
| **[E] DM-15 scene-control-dfa** | I (post-close) | **7 (I,J,K,L,M,O,Q,Q→R)** | **VERIFY-ONLY** | **R.W8** | `proof:control-surface-single-writer` GREEN (correctness-tier RUNTIME gate — navToScene-drives the dock projection from the DFA per expected state); re-verify. **Born-RED** on CI run `27228309606` (trigger='null'-under-load before the cure; the gate BIT). |

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
