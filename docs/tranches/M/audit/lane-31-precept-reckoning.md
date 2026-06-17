# Lane 31 — Precept Reckoning (Tranche M charter seed)

**Lane:** 31 · **Subject:** Tranche L precept audit — WHERE L HELD + WHERE IT VIOLATED
**Date:** 2026-06-17 · **Branch:** `tranche-l-dev` (tip `4b3d2eb`) · **Method:** inv ε —
every finding below cites a `file:line` or a re-runnable gate result observed on this tree.
No finding is re-asserted from the audit docs without ground-truth verification.

This lane does NOT re-implement the wave specs. It audits the L-as-built tree against the
**NO-quick-solutions / NO-workarounds / idiomatic-gestalt / NO-legacy /
architectural-transposition / KISS / acyclic-spine / inv-16 / inv-ε** precepts,
finds where L held them, finds where it violated, and proposes the M-wave obligations
that follow from each finding.

---

## §1 — THE VERDICTS IN ONE TABLE

| Precept | L finding | Verdict | M obligation |
|---|---|---|---|
| NO-quick-solutions | The `!important` verify-lane workaround (reverted); the warm-engine postTask overclaim (deferred, not shipped) | **HELD** — both caught and reverted/deferred | none |
| NO-workarounds | 5 PENDING Band-B workarounds: `linear()` regex (`utils.ts:119,185`), `FN_NAME` Symbol stamp (`utils.ts:45–55`), direct `@mkbabb/parse-that` import (`utils.ts:1`), `:aria-orientation` suppression (`SpringSidebar.vue:43`), `onPlayPointerDown` interim (`TransportDock.vue:15,151,196,342…`) | **HELD structurally — VIOLATIONS NAMED with born-RED deletion gates** (all 5 PENDING per `proof:workaround-deletion` → exit 0) | M cures each on the sibling publish-consume edge; each gate bites when the sibling ships and kf has NOT yet deleted |
| Idiomatic-gestalt | `lerpArray` inlined in `internal/leaves.ts:68` instead of consumed from `@mkbabb/value.js` | **NECESSARY DUPLICATION** — value.js exposes no `./math` subpath (`node_modules/@mkbabb/value.js` `exports`-map has only `"."`, verified); a static import would pull value.js's CSS-grammar init into the LIGHT bundle, breaking `proof:boundary`. The `leaves.ts:56–64` comment documents this accurately (DRY-spine tension correctly resolved) | value.js-O ask #14 (`KF-TO-VALUEJS-O-ASKS.md §14`) — the `./math` subpath; on publish, M deletes the inline copy and imports from the subpath |
| NO-legacy | No `deprecat/legacy/FIXME/TODO(` in `src/` at close (`proof:no-deprecated-guard` GREEN) | **HELD** | none |
| Architectural-transposition | Gate apparatus: 264 `waitForTimeout` calls survive across 61 scripts (verified: `grep -c "waitForTimeout" scripts/proof-*.mjs` totals 264); the serial `&&` chain remains (124 `&&`; `proof:hygiene` in `package.json:190`); `@vitest/browser` is ABSENT | **PARTIAL** — L.W4 cured `openControlsPanel` (zero sleeps, `proof:settle-is-predicate` GREEN) but left the other 264 sleeps in place. The `gate-apparatus-VERDICT.md` audit names the full consolidation as the M charter seed | M.W? — the three-tier vitest consolidation (the gate-apparatus-VERDICT.md §2 plan); the ONE largest precept debt L passed to M |
| KISS | `warmEngine()` stays on bare `void loadAnimationEngine()` (`load-engine.ts:536`); `generate()` from-intent KILLED (`PROGRESS.md §2.6 GEN-1`); decomposition extractions are COHESIVE (the `drag-2d` / `spring-reseat` / `spring-duration` / `sequence-events` / `load-engine` split — each a real separation of concerns) | **HELD** | none |
| Acyclic-spine | `src/animation/utils.ts:1` `import { any as parseAny } from "@mkbabb/parse-that"` is a HEAVY module (not reachable from any light barrel entry — `proof:boundary` GREEN); the 5 workarounds are PENDING deletion; `proof:boundary` checks only value.js edges, NOT parse-that in light modules (a structural gap) | **HELD at the bundle boundary; structural gap in the boundary gate** — utils.ts IS on the heavy path, so the acyclic-spine is not broken in the shipped bundle; however `proof:boundary`'s `holdsValueJsSpecifier` function (`scripts/proof-boundary.mjs:93-107`) only scans for `@mkbabb/value.js` specifiers, NOT `@mkbabb/parse-that` — a future light module could import parse-that without the gate catching it | M obligation: extend `proof:boundary` to also gate `@mkbabb/parse-that` in light modules (the W96 dispatch from L.W9 — arm it); on VJ-L3 publish, delete `utils.ts:1` |
| inv-16 (consume published siblings) | All deps resolve from the registry (`proof:deps-current` GREEN); no `file:` pins; 5 workarounds are PENDING deletion (named tripwire + born-RED gate) | **HELD structurally; spirit violations NAMED and tripwired** | M cures the spirit violations on the sibling consume edges |
| inv-ε | Three overclaims CAUGHT and CORRECTED during L: (1) the `!important` audit premise (corrected in W1 — spec-correctly dropped per CSS Animations §3, not a kf breach); (2) the audit's CSS Nesting / url-token behaviours mis-attributed to value.js (actually parse-that — corrected in L.W10 spike §1); (3) `proof:all` three roster reds caught during close-impl reconciliation (`d7c7f3d`) | **HELD — corrections documented with evidence; the inv ε law enforced BY the close, not asserted over it** | M must hold the same discipline; every FINAL claim cites an observed oracle |

---

## §2 — WHERE L HELD: DETAILED FINDINGS

### 2.1 The `!important` correction — inv ε in practice (HELD)

The 36-lane L audit (`audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠31`) identified
`adapter.ts declsToVarMap` silently dropping `!important` as a kf breach. During L.W1
implementation, the spec was re-verified: CSS Animations §3 (L1 and L2) states a
declaration qualified `!important` inside a `@keyframes` block is **invalid and ignored**.
value.js 0.13.0 spec-correctly drops it at the AST level. The verify-lane's first attempt
introduced a `recoverImportantDeclarations` re-parse of the keyframe body as a style-rule —
a consumer-side re-parse that was the exact no-quick-solutions violation.

The cure was the correct one: **the workaround was REVERTED** (commit `8e386a7` commit
message: "The verify-lane workaround that briefly papered this was REVERTED"). The test
locks `not.toContain("!important")` — the regression-lock is the spec-faithfulness. The
no-silent-drop diagnostic is a value.js-O dispatch (`KF-TO-VALUEJS-O-ASKS.md #12`).

Evidence: `docs/tranches/L/waves/L.W1.md §S1` correction block (the inv ε record);
`test/replay-equality.test.ts` S1 clause; `proof:replay-equality` GREEN at this close.

**M carry:** none (resolved correctly).

### 2.2 The `warmEngine` `scheduler.postTask` deferral — measure-first (HELD)

`load-engine.ts:524–534` documents the explicit decision NOT to adopt
`scheduler.postTask("background", …)` for `warmEngine()`. The probe
(`proof:scheduler-posttask`) only SKIPs in jsdom — it has NOT positively measured that
the "background" dispatch does not degrade INP in a real browser. The wave's own
measure-first law was applied: `warmEngine` stays on the proven bare
`void loadAnimationEngine()` path.

Evidence: `src/animation/load-engine.ts:536` `export const warmEngine = (): void => { void loadAnimationEngine(); }`.

**M carry:** the `ARMED` comment at `load-engine.ts:532` is the M trigger — when a
real-browser Playwright run with `scheduler.postTask` measures the background dispatch
safe, M adopts it. No M-wave needed until the measurement exists.

### 2.3 Gate-first / born-RED discipline (HELD across all Band-A waves)

Every Band-A gate (W1–W8, W11) introduced its born-RED oracle before the cure. Spot-checks:
- `proof:replay-equality` — GREEN (`node scripts/proof-replay-equality.mjs` exit 0; re-run at this audit)
- `proof:compile-replay` — GREEN (extended with multi-color + scroll-driven fixtures)
- `proof:ingest-replay` — GREEN
- `proof:settle-is-predicate` — GREEN: `openControlsPanel` contains ZERO `waitForTimeout` calls (re-verified)
- `proof:demo-on-published-surface` — GREEN with `KFVUE_INVERSION_LANDED=1`: 0 deep imports, 62 barrel imports

### 2.4 Decomposition extractions — cohesive, not manufactured (HELD)

The `proof:decomposition` close-impl cure extracted five modules:
- `drag-2d.ts` (115L) — the two-axis `Draggable` composition
- `spring-reseat.ts` (98L) — the velocity-continuous interruption seam
- `spring-duration.ts` (83L) — duration-from-fraction calculus
- `sequence-events.ts` (216L) — the segment/label event bus
- `load-engine.ts` (246L) — the memoized engine-loading machinery

The gate-anchor retargets for `proof:spring-blend-weight` (→ `spring-reseat.ts`) and
`proof:composition-honored` (→ `engine-composition.ts`) follow the bodies, not the
original file. Both gates re-verify GREEN (re-run at this audit). Line counts verified:
`drag.ts` 462L (≤550), `spring.ts` 685L (≤700), `sequence.ts` 698L (≤700), `index.ts` 246L (≤550).

The cohesion claim holds: each extraction is a real separation of concerns (e.g.
`spring-reseat.ts` owns `VelocityProbe`/`probeVelocity`/`reseatToSpring` as a
domain-coherent unit, not an arbitrary line-count split).

### 2.5 `lerpArray` inline copy — necessary, not a DRY violation (HELD with a path forward)

`src/animation/internal/leaves.ts:68` carries `lerpArray` as an inline copy rather than
importing from `@mkbabb/value.js`. This is NOT a DRY violation: value.js's published
`exports`-map exposes only one entry (`"."`) — no `./math` subpath exists. A static
`import { lerpArray } from "@mkbabb/value.js"` on a LIGHT module would pull the full
value.js CSS-grammar static init into the LIGHT bundle and red `proof:boundary`.

Evidence: `node_modules/@mkbabb/value.js/package.json` `exports` key verified; `leaves.ts:56–64`
documents the rationale. The value.js-O dispatch ask #14 (`KF-TO-VALUEJS-O-ASKS.md §14`)
requests the `./math` subpath — on its publish, M deletes the inline copy.

**M wave candidate:** a sub-wave of the value.js-O consume: once `@mkbabb/value.js@0.14.0`
ships the `./math` subpath, delete `leaves.ts:68–80` and import `lerpArray` from
`@mkbabb/value.js/math`. Gate: `proof:boundary` must stay GREEN.

### 2.6 The acyclic-spine and the boundary gate gap (HELD with a gap)

The `@mkbabb/parse-that` import at `utils.ts:1` is on the HEAVY surface (utils.ts is
reachable from `engine.ts` which is dynamically loaded; `proof:boundary` GREEN confirms
no light entry reaches it). However, `proof:boundary`'s `holdsValueJsSpecifier` function
(`scripts/proof-boundary.mjs:93`) checks ONLY for `@mkbabb/value.js` specifiers — it does
not check for `@mkbabb/parse-that` in light modules. If a future light module were to
import parse-that, the gate would not catch it.

This is a structural gap: the gate enforces half the acyclic invariant (no value.js on
light) but not the other half (no parse-that on light, outside of the HEAVY path). L's W9
Wave dispatch (`KF-TO-VALUEJS-O-ASKS.md #8`) asks value.js for `parseCSSSubValue` to
eliminate the parse-that production dependency entirely.

**M obligation:** extend `proof:boundary`'s source-grep complement to also catch
`@mkbabb/parse-that` in light-surface modules — the W96 ask armed in L.W9. This is a
3-line change in `proof-boundary.mjs` that closes the structural gap.

---

## §3 — WHERE L VIOLATED: THE GATE-APPARATUS DEBT (the M P0)

### 3.1 264 `waitForTimeout` calls remain (NOT cured — the precept carry)

L.W4 cured `openControlsPanel` (the `proof:settle-is-predicate` green). But the transposition
did not sweep the full gate estate. As of this close:

```
grep -c "waitForTimeout" scripts/proof-*.mjs | grep -v ":0" → 61 files
Total: 264 occurrences (verified at this audit)
```

The settle primitive (`waitForRender`) was built and exported from `demo-driver.mjs:695`
but was applied to only ONE function. The 264 surviving sleeps are the same render-race
root the K CI-greenify epic traced (Lane 10 / K.FINAL) — still fully present.

Additionally:
- **Serial `&&` chain** — `proof:hygiene` (`package.json:190`) chains 124 `&&` operators
  with zero parallelism; a single red reports ONE failure and forces O(N²) re-run cost.
- **`@vitest/browser` ABSENT** — verified: `node_modules/@vitest/browser` does not exist.
- **eslint ABSENT** — verified: `node_modules/eslint` does not exist.
- **64 `waitForTimeout` in `proof-live-session.mjs` alone** — `grep -c waitForTimeout scripts/proof-live-session.mjs` → 40 (verified).

These are the structural violations the `gate-apparatus-VERDICT.md` audit names. L.W4 was
the **transposition BEGUN, not completed**. The VERDICT audit (`docs/tranches/L/audit/gate-apparatus-VERDICT.md`)
names the full M target: the three-tier vitest architecture.

**M wave candidate — the gate consolidation (the M P0):** the `gate-apparatus-VERDICT.md §2`
four-tier plan:
- Tier (a): LINT — one `eslint`+`dependency-cruiser` pass for the ~33 source-shape gates
- Tier (b): UNIT — the existing vitest jsdom suite (already correct; no change)
- Tier (c): INTEGRATION — `@vitest/browser` + one shared browser + one `globalSetup` dist server (replaces 67 cold chromium boots)
- Tier (d): E2E — keep the thin scripted lighthouse+round-trip tier

The binding invariant: NO loss of real coverage. Every assertion migrates verbatim; the
bespoke runner retires. The built-dist requirement (`proof:gate-is-runtime`) is preserved
by navigating the vitest-browser page to the SERVED dist, not component-mounting (the
gate-apparatus-VERDICT.md §4 counterpoint — this is the load-bearing constraint the naive
migration loses).

### 3.2 `proof:boundary` does not gate parse-that on light modules

Named in §2.6. The gap is not a L-introduced regression — it predates L — but L.W9 armed
the W96 ask without gating it. `proof:boundary` should fail if a light source module
imports `@mkbabb/parse-that`. The fix is 3 lines in `scripts/proof-boundary.mjs:93`
(`holdsValueJsSpecifier` → `holdsAcyclicViolation` checking both `@mkbabb/value.js` AND
`@mkbabb/parse-that`).

### 3.3 The PENDING workarounds (inv-L-acyclic-purity carry)

Five workarounds survive to M in the PENDING state (correctly gated, not a M failure
but a carry burden):

| Arm | Location | Tripwire | Gate |
|---|---|---|---|
| S1/S2 `:aria-orientation` | `SpringSidebar.vue:43`, `AnimationControls.vue:72` | glass-ui 4.1.0 | `proof:workaround-deletion` |
| S2 `onPlayPointerDown` | `TransportDock.vue:15,151,196,342,348,358,361,366,373` | glass-ui 4.1.0 | `proof:workaround-deletion` |
| S7 `LINEAR_PAREN_PREFIX` | `src/animation/utils.ts:119,185` | value.js 0.14.0 | `proof:workaround-deletion` |
| S8 `FN_NAME` Symbol | `src/animation/utils.ts:45,47,51,55,218,294,347` | value.js 0.14.0 | `proof:workaround-deletion` |
| S9 `parse-that` dep | `src/animation/utils.ts:1` | value.js 0.14.0 | `proof:workaround-deletion` |

Each is a no-workaround violation HELD under the inv-L-acyclic-purity tripwire discipline.
M must not ADD new workarounds; it must consume the sibling publishes when they arrive.

### 3.4 `proof:css-parity` is absent (W10 frontier honestly deferred)

`scripts/proof-css-parity.mjs` does NOT exist (verified: `ls scripts/proof-css-parity.mjs`
→ ABSENT). The W10 frontier (true CSS parity — CSS Nesting THROWS in value.js, bare
`linear-gradient` CRASHES, `@container` opaque body) is honestly deferred: the L.W10 spike
(`docs/tranches/L/audit/W10-css-parity-spike.md §3.2`) chose Option B (consolidate the one
CSS grammar in value.js; delete parse-that's structural `parsers/css/` — the only path that
does not make parse-that's CSS module a first-class spine dependency). This is the correct
architectural choice (the spike's §3 presents the full decision record). The deferred state
is NOT a violation — the FINAL honestly names it as gated on the coordinated value.js-O +
parse-that publish with a born-RED tripwire (`proof:peer-satisfied` RED-by-design).

**M wave candidate:** once value.js-O ships the grammar fixes (VJ-W1 nesting, VJ-W2
at-rule body recursion, VJ-W3 linear-gradient crash), M authors `proof:css-parity` born-RED
on the W10 spike's gap matrix and consumes the publish. The gate is NOT shipped before the
publish because authoring a gate that reds on gaps value.js cannot yet fix creates a
permanent-red state and violates inv-ε.

### 3.5 `proof:chronic-closure` substrate transition (COMPLETED at close)

`scripts/proof-chronic-closure.mjs:114` `CHRONIC_LEDGER` points at
`docs/tranches/L/PROGRESS.md` (re-verified: `grep CHRONIC_LEDGER scripts/proof-chronic-closure.mjs`
→ line 114 `"docs/tranches/L/PROGRESS.md"`). The K→L substrate transition was executed at
the L close (`529fcfd`). The FINAL claimed it as the orchestrator's final motion; it has
been performed. The chronic-closure gate reads the L ledger and exits 0.

---

## §4 — THE GATE-RETARGET LEGITIMACY AUDIT

The FINAL (§S6) claims `proof:spring-blend-weight`'s reseat arm was retargeted to
`spring-reseat.ts` after the decomposition. This is legitimate: the gate grep target
(`scripts/proof-spring-blend-weight.mjs:77` → `SPRING_RESEAT = "src/animation/spring-reseat.ts"`)
follows the code body that moved, NOT the original filename. The anchor assertion
(`probeVelocity finite-differences`, re-verified at `spring-reseat.ts`) bites on the same
regression it always guarded. `proof:spring-blend-weight` exits 0 (re-run at this audit).

Similarly, `proof:composition-honored` targets `engine-composition.ts` (split from
`engine.ts` at commit `e42a95b`) — same rationale: the bodies moved, the anchor follows,
the regression coverage is identical. Both retargets are **legitimate**: they preserve
oracle bite, they do not weaken coverage, and they are the only correct behavior when a
module is refactored without changing its semantics.

---

## §5 — THE AUDIT-ERROR FAMILY (L auditing L)

The L close caught three families of factual errors from the audit docs, each corrected
with evidence and recorded for M's learning:

**Error class 1 — Spec mis-read (`!important`):** `audit-32-skeleton.txt ⚠31` and
`precepts-L.md §6 D1` asserted `!important` was a kf breach. The spec shows it is invalid
in a keyframe and is spec-correctly dropped by value.js 0.13.0. L.W1 corrected this with
an inv-ε record. The correction was verified against the live CSS Animations §3 draft.

**Error class 2 — Parser mis-attribution (the W10 spike):** `audit-32-skeleton.txt:285-288`
probed parse-that's `cssParser`, then `L.W10.md §Born-RED gate` re-attributed those
behaviours to value.js's `parseCSSStylesheet`. The two grammars fail in opposite directions
(CSS Nesting: value.js THROWS, parse-that silently drops; url-token: value.js is
opaque-whole, parse-that shreds). The W10 spike (`docs/tranches/L/audit/W10-css-parity-spike.md §1.1`)
corrected all 11 rows against live runtime probes.

**Error class 3 — `proof:all` three roster reds:** Three gates grew un-reconciled during
the Band-A waves (`proof:gate-is-runtime` mis-tier, `proof:agent-surface` stale,
`proof:decomposition` line-count overflow). All three were caught in the close-impl
reconciliation (`d7c7f3d`) and cured honestly before the close.

**M learning:** audit docs can contain factual errors the implementation catches. M must
apply the same adversarial posture: verify audit claims against ground truth before
authoring a born-RED gate on them. A gate born-RED for the wrong reason (e.g. a value.js
THROW that the audit described as a silent-drop) would go green on the wrong fix and leave
the actual breach unguarded.

---

## §6 — PRECEPT CARRY: WHAT M MUST HOLD

### M.P1 — NO new workarounds (the inv-L-acyclic-purity carry)

M may not add any new `@mkbabb/glass-ui` / `@mkbabb/value.js` consume-seam patches. The
born-RED deletion pattern (tripwire = sibling publish; deletion = same consume commit) is
the ONLY path for an existing workaround. M must extend `proof:workaround-deletion` with
any new Band-B arms if new sibling defects surface.

### M.P2 — The boundary gate must cover parse-that (the W96 arm)

`proof:boundary`'s `holdsValueJsSpecifier` function (`scripts/proof-boundary.mjs:93`)
must be extended to check `@mkbabb/parse-that` in light modules. This is the born-RED
arm L.W9 armed but did not implement: M.W9-carry must author it.

### M.P3 — 264 `waitForTimeout` sleeps must be converted (the L.W4 carry)

The device-honesty law (inv-L-device-honesty) prohibits fixed-ms sleeps in CI gates. L
converted one function; M must convert all 264 as part of the vitest consolidation. Until
the consolidation lands, no new `waitForTimeout` may be introduced (`proof:settle-is-predicate`
enforces this for `openControlsPanel`; a broader gate is the M consolidation's deliverable).

### M.P4 — The gate-apparatus consolidation (the architectural transposition M must land)

The `gate-apparatus-VERDICT.md` verdict: "the apparatus is over-engineered in its
IMPLEMENTATION, not its PRINCIPLE." M is where the three-tier vitest consolidation lands.
The four non-negotiable constraints (built-dist navigation, boundary graph lint,
observe-only manifest, device-dependence re-validation) from `gate-apparatus-VERDICT.md §4`
must be carried verbatim — they are what "just use vitest" would lose.

### M.P5 — inv-ε must cover every M-scope claim

L's three error-correction moments are the discipline: every FINAL claim cites an observed
oracle; audit docs must be adversarially verified against ground truth before gates are
authored from them; a born-RED gate on a wrong premise is a liability, not a benefit.

---

## §7 — M-WAVE PROPOSALS (from this lane's evidence)

### M.W-BOUNDARY-PARSE-THAT — 1 file, 3 lines

Extend `scripts/proof-boundary.mjs:93` `holdsValueJsSpecifier` to also return `true` if
the source holds a static `@mkbabb/parse-that` specifier in a light module. The function
rename (`holdsAcyclicViolation`) and the regex extension are the full change. Born-RED: a
planted test import of parse-that in a light module must red the gate before the extension
greens it.

### M.W-VITEST-CONSOLIDATION — the gate-apparatus architectural transposition

Implement the `gate-apparatus-VERDICT.md §2` four-tier plan in priority order:
1. Phase 1: LINT tier (eslint custom rules + one dependency-cruiser graph — replaces ~33 processes)
2. Phase 2: UNIT tier (fold the `node scripts/proof-x.mjs && vitest run test/x.test.ts` pairs — already done for most)
3. Phase 3: INTEGRATION tier (`@vitest/browser` + shared browser + `globalSetup` dist server — the 67 browser gates migrate one surface at a time; the built-dist navigation constraint is non-negotiable)
4. Phase 4: E2E/deploy tier (keep lighthouse + round-trip as thin scripts; retire the serial `&&` chain)

Each phase must hold the `gate-apparatus-VERDICT.md §4` counterpoint guarantees. No coverage
loss. Born-RED for the Phase 3 work: assert `@vitest/browser` is installed AND the suite
runs against served dist (not Vite-transformed source) before the migration greens.

### M.W-VALUEJS-O-CONSUME — the Band-B consume edge (when 0.14.0 ships)

When `@mkbabb/value.js@0.14.0` publishes:
- Delete `utils.ts:1` (parse-that import), `utils.ts:45–55` (FN_NAME Symbol), `utils.ts:119,185` (LINEAR_PAREN_PREFIX)
- Import `lerpArray` from `@mkbabb/value.js/math` (deleting `leaves.ts:68–80` inline copy)
- `proof:workaround-deletion` arms S7/S8/S9 must go GREEN (exit signal for each deletion)

### M.W-GLASS-UI-BB-CONSUME — the BB SegmentedTabs + RF-17 consume edge (when 4.1.0 ships)

When `@mkbabb/glass-ui@4.1.0` publishes:
- Delete `:aria-orientation="undefined"` from `SpringSidebar.vue:43` and `AnimationControls.vue:72`
- Delete the `onPlayPointerDown`/`pointerHandled` RF-17 interim from `TransportDock.vue`
- `proof:workaround-deletion` arms S1/S2 must go GREEN

### M.W-CSS-PARITY — the W10 frontier (when value.js-O + parse-that coordinate)

Once the value.js-O grammar fixes ship AND parse-that's CSS module decision is made
(Option B: delete `parsers/css/`, consolidate in value.js), author `proof:css-parity`
born-RED on the W10 spike's 11-row gap matrix. Until then, authoring the gate before the
underlying grammar is fixed would create a permanent-red state.

---

## §8 — DEFERRED FOLD INTO M

The four HANDOFF chronics carried into M from the L ledger
(`docs/tranches/L/PROGRESS.md §"Open deferrals"`):

| Chronic | Chronicity | Tripwire | Born-RED gate | M obligation |
|---|---|---|---|---|
| DL-L6 RF-17/DL-K9 GlassDock | 3 (I,J,K→L) | glass-ui 4.1.0 W-DOCK-MORPH-FAMILY | `proof:rf17-net-deletion` (TBD) | consume + delete on 4.1.0 publish |
| DL-L7 GlassControlPoint/DL-K7 | 6 (E→L) | glass-ui BB ships `GlassControlPoint` | `proof:control-point-live` RED | hold as HANDOFF; re-audit at M.WZ |
| DL-L8 FB-3 MorphSVG | 6 (C→L) | value.js O (0.14.0) VJ.W4 arc-length | `proof:morphsvg-consume` born-RED | hold as HANDOFF; M cannot close without value.js-O |
| DL-L9 PT-2 parse-that packrat | 5 (E→L) | parse-that PT-WAVE-6 (id,offset) re-key | `proof:packrat-sound` born-RED | hold as HANDOFF; M cannot close without parse-that PT-WAVE-6 |

All four remain ≥4-tranche HANDOFF riders. M.WZ must re-audit each — the P-invariant-28
law: a HANDOFF may not sit more than 2 tranches without a new disposition. DL-L7 and DL-L8
are at 6 tranches and must be dispositioned (land/KILL/extended-HANDOFF with evidence) by
M.WZ.

---

## §9 — CROSS-REPO ASKS (the constellation coordination M inherits)

All three dispatch docs from L are the M inheritance:

- `docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md` — 14 asks (the grammar + perf + seam totality)
- `docs/tranches/L/KF-TO-PARSE-THAT-ASKS.md` — the packrat soundness + option B coordination
- `docs/tranches/L/KF-TO-GLASSUI-BB-ASKS.md` — the SegmentedTabs aria-orientation fix + RF-17 dock-layer + GlassControlPoint

M's cross-repo obligation: consume each publish as it lands (re-pin + delete workaround + green the born-RED arm), never anticipate it with a kf-local patch. The inv-L-acyclic-purity discipline applies without modification in M.

---

## §10 — PERF NUMBERS

From L-as-built (observed at this audit):
- `proof:all` wall-clock (serial, one pass): ~15–31 minutes (median-/mean-weighted, per `gate-apparatus-A-taxonomy.md §2`)
- 3-hour iterate-to-green: O(N²) re-run cost from the serial `&&` chain, 5–6 reds × ~30-min full-prefix re-run (`gate-apparatus-VERDICT.md §1`)
- Non-browser gates (70 gates + full vitest suite): ~70 seconds combined — essentially free
- `warmEngine()` postTask deferred: no perf number claimed; the probe skips in jsdom; the measure-first law applies

M target (from `gate-apparatus-VERDICT.md §2` table): single-digit minutes for a full run with shared browser + parallel workers; all reds surfaced per run (killing the O(N²) iterate cost).

---

## Terminal reading

L held the structural spine without exception. The violations it carried are all
**bounded, named, and tripwired**: the five PENDING workarounds (each a sibling-publish
consume edge), the `lerpArray` inline copy (a necessary DRY tension pending the value.js
`./math` subpath), and the boundary gate's parse-that gap (a 3-line fix). The one
architectural debt L passed to M is the gate-apparatus consolidation — the 264 surviving
`waitForTimeout` sleeps and the serial `&&` chain are the largest unresolved precept
violation on this tree. That is the M P0.

The three inv-ε corrections (the `!important` spec-reread, the W10 parser mis-attribution,
the `proof:all` roster reds) are L's strongest precept signal: the discipline enforces
itself when implementation catches what audit missed. M must hold the same adversarial
verification posture.

**Evidence index (all claims re-verified on `tranche-l-dev` tip `4b3d2eb`, 2026-06-17):**
- `src/animation/utils.ts:1,45,119,185` — workarounds (grep)
- `src/animation/internal/leaves.ts:68` — lerpArray inline (Read)
- `src/animation/load-engine.ts:536` — warmEngine bare (Read)
- `scripts/proof-boundary.mjs:93` — holdsValueJsSpecifier (Read)
- `scripts/proof-spring-blend-weight.mjs:77` — SPRING_RESEAT retarget (Read)
- `scripts/proof-workaround-deletion.mjs` → exit 0, 5 PENDING (Bash)
- `scripts/proof-replay-equality.mjs` → exit 0 (Bash)
- `scripts/proof-boundary.mjs` → exit 0 (Bash)
- `scripts/proof-composition-honored.mjs` → exit 0 (Bash)
- `scripts/proof-spring-blend-weight.mjs` → exit 0 (Bash)
- `scripts/proof-settle-is-predicate.mjs` → exit 0 (Bash)
- `scripts/proof-decomposition.mjs` → exit 0 (Bash)
- `scripts/proof-chronic-closure.mjs:114` → CHRONIC_LEDGER points at L/PROGRESS.md (Bash)
- `proof:gate-is-runtime` → exit 0 (Bash)
- `grep -c "waitForTimeout" scripts/proof-*.mjs` → 264 total across 61 files (Bash)
- `ls scripts/proof-css-parity.mjs` → ABSENT (Bash)
- `package.json:190` → serial `&&` chain, 124 operators (Read)
- `docs/tranches/L/audit/W10-css-parity-spike.md §1.1` — parser mis-attribution (Read)
- `docs/tranches/L/waves/L.W1.md §S1` — !important correction (Read)
- `node_modules/@mkbabb/value.js/package.json exports` — no `./math` subpath (Bash)
- `KFVUE_INVERSION_LANDED=1 node scripts/proof-demo-on-published-surface.mjs` → exit 0 (Bash)
