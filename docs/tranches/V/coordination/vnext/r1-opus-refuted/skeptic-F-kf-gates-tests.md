# SKEPTIC F (Fable seat) — the kf gates/tests challenge

Repo read-only: `/Users/mkbabb/Programming/keyframes-v-exec` @ **master `c2c8915f`**
(NOT `keyframes-v-exec` branch; that commit does not exist here — V has already
**folded to the successor**, last commit "the adoption record + FOLD-FORWARD ledger").
All runs below are mine, re-actuated, not inherited.

---

## 0. THE HEADLINE THE PRIOR RECORD BURIES: R2-07's prune NEVER LANDED

R2-07 (69 rows) + R1-02 + R1-06 correctly adjudicated the apparatus. Then **W9 staged
the whole surgery on `v/w9-staging` and it was never merged** — V folded to the successor
with the prune unshipped. I checked every named target on master:

| R2-07/W9 target | On master today? |
|---|---|
| `bench/taxonomy.json` (654L, zero-consumer) | **PRESENT** |
| `bench/group-soa-integration.mjs`, `bench/typed-om-validate.mjs` | **PRESENT** |
| `bench/d3-changed-keys.measure.test.ts`, `bench/sync-step.measure.test.ts` (no runner glob) | **PRESENT** |
| `scripts/probe-webkit-linear-accel.mjs` ("NOT a CI gate") | **PRESENT** |
| `test/engine/zero-alloc.test.ts` gc arm (`expect(true).toBe(true)` :117) | **PRESENT** |
| `test/group/group-snapshot-identity.test.ts` `it.fails` wrapper | **PRESENT** |
| `proof:owner-golden` → `review:owner-golden` relabel | **NOT DONE** (`package.json:52` still `proof:owner-golden`) |
| MR1 pageerror-key / MR2 wire-oracles / MR3 dispatch-gate / MR4 wire-demo-tests | **NONE landed** (`ci.yml` has no `test:demo`/oracle step; `deploy-pages.yml:38,41` still `if != workflow_dispatch`) |

**Only three things from the whole V gate/test effort actually landed:** `proof:structure`
(W4), the R6 unused-export sweep (W6, 35 demotions), and the `mirror.test.ts` prune (W4,
`test/support/` now holds only `group-probe.ts`). Everything else R2-07 called contrivance
is **still live**. So the successor's question isn't "what survived the prune" — the prune
didn't happen; it's "re-ratify R2-07, land it, and fix what R2-07 itself missed."

---

## 1. APPARATUS CATALOG (LOC + wiring)

### Package scripts (`package.json:35-56`)
| Script | Wiring | Blocks? |
|---|---|---|
| `check` = tsc + tsc-test + **proof:structure** | dev / (not in CI) | dev |
| `check:lib` | ci.yml gates + release.yml | **BLOCKS** |
| `build:lib` (`build`, `prepare`, `build:watch`, `gh-pages`) | ci + release + deploy | **BLOCKS** |
| `test` (both projects) | local only | no |
| `test:lib` (`--project library`) | ci gates + release | **BLOCKS** |
| `bench`, `bench:color-fidelity` | manual/instrument | no |
| `lint` (`depcruise src`) | **not in any workflow** | no (dev only) |
| `gen:agent-surface` (`scripts/gen-agent-surface.mjs`, 83L) | generator | no |
| `proof:structure` (`gates/structure/index.mjs`, 755L) | via `check` only | dev |
| `proof:publish` (`gates/surface/index.mjs`, 63L → 6 sub-gates) | ci gates + nightly + release | **BLOCKS** |
| `proof:owner-golden` (`gates/visual/index.mjs`, 375L) | **NO workflow** | never |
| `demo:correctness` (`run-demo-roster.mjs`) | nightly/dispatch only | non-blocking |
| `audit:lighthouse` (343L) | nightly, masked `\|\| echo` | never (observe) |
| `release:changelog` | release.yml | **BLOCKS** (release) |

### proof:publish sub-gates (`scripts/gates/surface/`)
`index.mjs`(63) orchestrates: `boundary.mjs`(740), `published-surface.mjs`(873),
`consume-bundle.mjs`(101), `readme-runs.mjs`(497), `agent-surface.mjs`(67),
`verify-diff.mjs`(176). **8,082 LOC of gate/observe script total.**

### Observe fleet (`scripts/observe/demo/`) — nightly/dispatch, non-blocking
smoke(200), occlusion(327), usability(410), subject-animates(341),
live-session(1612), live-session-mobile(1202), lighthouse(343).

### CI (verified line-by-line)
- **`ci.yml` gates job** (BLOCKS, `:27-48`): check:lib → build:lib → test:lib → proof:publish. Library-only; no Glass. **The real merge gate.**
- **`ci.yml` demo-correctness** (`:53`, `if schedule||dispatch`, non-blocking): builds gh-pages, re-runs proof:publish (U.D6 clause bites here only), demo roster, lighthouse(masked). **No `test:demo`, no oracle step** — MR2/MR4 absent.
- **`deploy-pages.yml`**: preflight asserts CI-green + `last-demo-green` ancestry, **both guarded `if != workflow_dispatch`** (`:38,41`) → dispatch = no-op preflight (MR3 unfixed).
- **`release.yml`**: tag==version → check:lib → build:lib → test:lib → proof:publish → release:changelog → `npm publish --provenance`. Sound.

### The staged-but-unlanded MR quartet (`v/w9-staging` 95e53f5e)
MR1 pageerror-key smoke/usability/occlusion; MR2 wire 5 browser oracles nightly;
MR3 `require_demo_green` dispatch gate; MR4 `test:demo` → gates job. Each carries a
recorded RED witness. **None are contrivance — they are the missing enforcement.** The
contrivance is leaving them staged forever.

---

## 2. CATCH ARCHAEOLOGY (named catches / unique defect class)

| Gate | Recorded catches | Verdict |
|---|---|---|
| **proof:structure** (755L) | R1: **7 dir-stutters** incl. the **AM-1 "seventh stutter"** `drag-2d.ts→drag/2d.ts` caught mid-Round-A (`e7fcff3f`); R2: 4 fragments/shims; R3: 1 impure barrel; **R6: 35 unused exports** demoted (W6-demotion-table). Born-RED logs in `audit/gates/W4-red-R{1,2,3}.log`, `W6-red-R6.log`. Ships a `--selftest` non-vacuity mode (`index.mjs:45`). | **KEEP-EARNED** (strongest new) |
| **proof:publish/boundary** (740L) | Enforced negative in its own header: add `import "@mkbabb/value.js"` to a light module → RED (R1-02 actuated). Self-derives entry set + CORE floor. | KEEP-EARNED |
| **proof:publish/published-surface** (873L) | Actuates `npm pack --dry-run` + imports built dist + diffs `Object.keys(loadAnimationEngine())` vs d.ts (real runtime). PKG-3 `_2`-alias grep. | KEEP-EARNED |
| **proof:publish/readme-runs** (497L) | Executes 20 README snippets + 29 `// =>` asserts AND asserts the count ran (silent-skip reds). | KEEP-EARNED |
| **proof:publish/agent-surface** (67L) | DR-1 caught llms.txt export-drift after the U dissolution; regenerates-then-asserts export-reality + getTimingFunction absence. Folded INTO the battery, not a new genre — the discipline the owner wants. | KEEP-EARNED |
| **release:changelog** | Caught `getTimingFunction` removed 5.3.5→6.0.0, verified documented in MIGRATION. | KEEP-EARNED |
| **render-truth harness / MR1** | Caught the V P0: blank on all 14 route×viewport, sole `TooltipProvider` **pageerror**, ZERO console.error (console-keyed gate greened over blank); + 5/7 scenes masked `timingFunction` pageerror (AV-DP02). | KEEP but **STAGED, unlanded** |
| **lint (depcruise)** | R.W1 broke the cycle ring; **0 violations since**; comment cites a `.dependency-cruiser-known-violations.json` **that does not exist** (GS-04). Real rule, **zero post-fix catches**, stale-fiction comment. | KEEP-preventive (weak; fix comment) |
| **proof:owner-golden** (375L) | Static leg = sha256 of PNGs it also owns (near-tautological drift of own files). Enforcing dHash leg needs browser+built demo and **runs in no workflow**. Zero automated catch, ever. | **CONTRIVANCE → FOLD/relabel** |
| **taxonomy.json** (654L) | **No gate/script/test reads it**; 23 stale interp-buffer rows, 0 match the 7 live cases. A wrong catalog worse than none. | **CONTRIVANCE → PRUNE** |
| **audit:lighthouse** | Masked `\|\| echo` — cannot fail the job by construction. | KEEP as honest observe-only |

---

## 3. TEST CORPUS CENSUS (130 files / 22,221 LOC; I re-ran the suite)

`npx vitest run --project library` (mine): **98 passed | 5 skipped | 1040 pass / 1
expected-fail / 14 skipped, 5.16s.** 103 library files, 27 demo files.

### By class (LOC est.)
| Class | Files/LOC | Examples | Verdict |
|---|---|---|---|
| **behavior-bearing** (observable lib behavior) | bulk: compile 25/3577, engine 22/~3900, physics 14/2397, group 10/1559, resolve 4/850, presets 2/171 | adapter-capture, equivalence(417), reduced-motion, spring, blend | **KEEP** — real, fast, falsifiable |
| **contract-bearing** (public law / roundtrip) | characterization, compile-roundtrip(646), replay-equality, readme-runs(gate) | byte-stable compileToCSS, 5 Band-A round-trips | **KEEP** |
| **implementation-shape** (asserts internal STRUCTURE, not behavior) | **`engine/boundary-cohesion.test.ts` (86L)** — the pure case; partials: `physics/oscillator.test.ts:196,212`, `demo/instrument/resize-tracks.test.ts:137`, `demo/scenes/orbital-rotate3d.test.ts` (all `readFileSync(src)`) | see §4/§5 | **PRUNE (boundary-cohesion) / FLAG (rest)** |
| **vacuous / witness** | `zero-alloc` gc arm (`:117` permanent `expect(true)`), `group-snapshot` `it.fails` | — | **PRUNE arm / FOLD wrapper** (R2-07, unlanded) |
| **duplicative** | ~none material. VT trio proven distinct (R1-06); engine "correctness" cluster (c6/engine-correctness/modern-web/equivalence/w0-crashes/replay) I sampled — **titles are behaviorally distinct** (scratch-per-instance vs color re-derive vs reduced-motion vs interp-equivalence vs crash-corpus vs round-trip). Naming is tranche-prefix accretion (H.W0/E.W7/L.W1), not content-dup. | — | **KEEP** (cosmetic rename only) |
| **zone-orphaned** (guards an H1 prune-candidate zone — **dies with its zone**) | scroll 2/800, svg 3/807, ingest 3/1027, waapi 3/737, orchestration split-text/flip/timeline (~part of 9/1916). **≈ 3,371–4,300 LOC** | scroll-scene(497), morph-svg(418), ingest(500), waapi-densify(309) | **KEEP-IF-ZONE-SURVIVES** — conditional; NOT independently keepable |

### The zone coupling (my independent verification — grep over `demo/`)
`ScrollScene`/`parseScrollCSS`=0, `morphSVG`/`drawSVG`/`motionPath`=0, `fromStyleSheets`/
`fromLiveAnimations`/`adoptRunning`=0, `densify`=0, `splitText`=0, `flip(`=0. **Only
`Draggable`(2)/`drag(`(1) is consumed.** Every zone H1 flags SUPERFLUOUS has zero demo
call-sites — and a fat, "real contract" test file. Those tests are contract-bearing **for
a zone nobody uses**: sound as assertions, ballast as guards. **R2-07 never modeled this
coupling** (it treated the 122-file bulk as monolithic KEEP-by-census, and R1-06 admits it
"did not line-audit" them, keeping "by default from title/structure"). If the successor
prunes scroll/svg/ingest/waapi per H1, ~3.5–4.3k test LOC must go WITH them, not survive as
orphaned green.

---

## 4. R2-07 RE-AUDIT (under-prune / over-keep / under-coverage)

**UNDER-COVERAGE (the biggest gap):** R2-07's master table **omits `proof:structure`
entirely** — the newest, largest gate (755L, wired into `check`), born the very day R2-07
was written. The blueprint that "already adjudicated this once" never adjudicated the
biggest new gate. (Verdict is easy — KEEP-EARNED — but the omission means R2-07 is not the
complete ledger it presents as.)

**OVER-KEEP #1 — `engine/boundary-cohesion.test.ts` marked KEEP, unread.** R1-06's census
row: "KEEP | boundary cohesion." I read it. It asserts: *"the waapi/ surface has no
open-coded `Math.max(0, Math.min(1, …))`", "timeline index.ts deleted the local clamp01",
"the group compositor does not import lerp from the light leaf."* This is **pure
implementation-shape** — same class as `mirror.test.ts` which R2-07 **did** prune. Worse,
its intent (import-tier + no-open-coded-clamp) is **already enforced structurally by
`lint`(depcruise leaf/light rules) + `proof:structure` R6** — so it is both contrivance AND
duplicative of two standing gates. **Verdict: PRUNE** (R2-07 missed it; R1-06 kept it
without reading it).

**OVER-KEEP #2 — the zone-orphan coupling (§3).** R2-07's "KEEP 49" bulk silently absorbs
~3.5k LOC of tests whose keepability is contingent on zone decisions R2-07 didn't cross-ref.

**UNDER-PRUNE:** none of R2-07's 9 PRUNE rows are wrong — but **all 9 are still on the tree**
(the prune never merged). taxonomy.json, the two orphan `.measure.test.ts`, the two orphan
`.mjs`, probe-webkit, the gc arm, the it.fails, the owner-golden pretense — all live.

**SOUND (do not re-litigate):** the proof:publish spine (crown jewel, negatives actuate);
the 122-file library behavior/contract bulk; release.yml; the 11 live benches. R2-07 was
right about these; I re-confirmed the spine is real.

---

## 5. VERDICTS

### Gates
| Gate | Verdict | Rationale |
|---|---|---|
| proof:publish (6 sub-gates) | **KEEP-EARNED** | crown jewel; actuated negatives; release-blocking |
| proof:structure (755L) | **KEEP-EARNED** | 47 recorded catches (7+4+1+35) + selftest; the strongest NEW keep |
| check:lib / build:lib / test:lib | **KEEP-EARNED** | the merge/release spine, <6s |
| lint (depcruise) | **KEEP** (fix GS-04 stale comment) | preventive, real rule, thin catch history |
| release:changelog | **KEEP-EARNED** | caught getTimingFunction removal |
| **proof:owner-golden** (375L) | **FOLD → `review:owner-golden`** | enforcing leg runs nowhere; static leg = sha of own files; **strongest single contrivance** |
| MR1/MR3/MR4 (staged) | **LAND** | honest MAKE-REALs guarding named bites (blank-P0, dispatch-bypass, ungated demo) |
| MR2 (staged) | **LAND nightly** | wires 5 load-bearing oracles that run in zero jobs; device-flaky → nightly not merge |
| audit:lighthouse | **KEEP observe-only** | honestly masked |
| taxonomy.json | **PRUNE** | zero consumer + 23 stale rows |
| orphan mjs/measures/probe-webkit | **PRUNE** | no runner glob / self-labeled non-gate |

### Test families
| Family | Verdict |
|---|---|
| behavior + contract bulk (~14k LOC) | **KEEP** |
| `boundary-cohesion.test.ts` | **PRUNE** (implementation-shape + duplicates lint+R6) |
| `zero-alloc` gc arm / `group-snapshot` it.fails | **PRUNE arm / FOLD wrapper** (R2-07 rows, land them) |
| oscillator/resize-tracks/orbital source-reads | **FLAG** — narrow shape-asserts; verify each guards a real value not a code shape |
| scroll/svg/ingest/waapi/split-text tests (~3.5–4.3k LOC) | **KEEP-IF-ZONE-SURVIVES** — bind the verdict to the zone-prune decision, do not keep orphaned |
| demo project (27 files, ungated) | **KEEP + WIRE** (MR4) |

### The MINIMAL HONEST GATE SET (the one-command truth)
One merge command, seven real mechanisms, no process farm:

```
npm run check:lib && npm run build:lib && npm run test:lib && npm run proof:publish
```
plus `proof:structure` (already inside `check`), `lint`, and `release:changelog` on the
release tag. **That is the entire honest surface.** Everything else is either observe-only
(the demo roster + lighthouse — keep, non-blocking, nightly) or must be **relabeled or
wired-or-cut**: `proof:owner-golden` → manual `review:` harness; the 5 browser oracles →
land MR2 or delete the skipIf theatre; the demo vitest project → land MR4; the dispatch
deploy bypass → land MR3. No new gate genre is warranted — the owner's instinct (little
process, direct verification) is already 90% met by the proof:publish spine; the work is
**subtraction (land R2-07's 9 prunes + boundary-cohesion) and honest wiring (land the 4
MRs)**, not construction.

---

## 6. SUMMARY (10 lines)

1. **The prune never shipped.** R2-07 adjudicated correctly, W9 staged it, V folded to the successor — master `c2c8915f` still carries every contrivance (taxonomy.json, gc arm, it.fails, orphan benches, owner-golden pretense, 5 never-wired oracles). Only proof:structure + R6 sweep + mirror.test.ts prune landed.
2. **Minimal honest gate set:** `check:lib && build:lib && test:lib && proof:publish` (+ proof:structure via `check`, + lint, + release:changelog on tag). Seven mechanisms; everything else is observe-only or relabel/wire/cut.
3. **Strongest KEEP:** the `proof:publish` spine (actuated negatives, real tarball/runtime diff) tied with `proof:structure` (47 recorded catches — 7 stutters incl. the AM-1 seventh, 4 shims, 1 barrel, 35 unused exports — plus a `--selftest` non-vacuity mode).
4. **Strongest contrivance (gate):** `proof:owner-golden` (375L, enforcing dHash leg runs in zero workflows, static leg is sha256 of PNGs it owns) → relabel `review:`. Purest zero-consumer contrivance: `taxonomy.json`.
5. **Strongest contrivance (test), R2-07 missed it:** `engine/boundary-cohesion.test.ts` — pure implementation-shape ("no open-coded Math.max", "does not import lerp from the light leaf"), the `mirror.test.ts` class, AND duplicative of lint+R6. R1-06 kept it unread.
6. **Test-corpus split:** ~14k LOC behavior/contract-bearing = KEEP; ~3.5–4.3k LOC zone-orphaned (scroll/svg/ingest/waapi/split-text, all zero demo consumption) = KEEP-**only-if-the-zone-survives**; ~100 LOC implementation-shape/vacuous = PRUNE; duplication ≈ none (engine "correctness" cluster is distinct, just tranche-prefix-named).
7. **R2-07's own gaps:** UNDER-COVERAGE (omits proof:structure, the biggest new gate); OVER-KEEP (the zone-orphan test coupling + boundary-cohesion); its 9 PRUNE rows are all correct but all still live.
8. **The 4 staged MRs are not contrivance** — they are the missing enforcement (blank-P0 pageerror-key, dispatch-bypass gate, demo-tests-in-CI, browser-oracles-nightly). Landing them IS the honest move.
9. **depcruise** is real but weak: 0 catches since R.W1 fixed the cycle ring, and its comment cites a known-violations baseline file that does not exist — keep preventive, fix the comment.
10. **Net:** the apparatus is ~90% honest already; the successor's job is **subtraction + wiring, not building** — land R2-07's prune, prune boundary-cohesion, bind zone-tests to their zones, land the 4 MRs, relabel owner-golden.
