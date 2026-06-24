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
and `git -C ../keyframes-r-demo log` for track progress; check the task board (#266–275); the
in-flight wave is whichever track task is `in_progress`. A retry-cron (`13 */2 * * *`) re-enters this
drive if a session-limit wall is hit; DELETE it once shipped.

| In-flight | Wave | Agent | Status |
|---|---|---|---|
| Track L | R.W1 directory partition | Opus (bg) | DISPATCHED 2026-06-24 |
| Track D | R.W5 scene fusion | Opus (bg) | DISPATCHED 2026-06-24 |

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
