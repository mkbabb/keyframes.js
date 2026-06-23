# Tranche Q — precept-reckoning-Q · WHERE THE SHIPPED 4.4.0 STANDS + WHAT Q REDRESSES

**Lane:** `B4-precept-reckoning` (Q audit, DOCS-ONLY). **Method (inv ε):** every verdict is VERIFIED
against the tree (file:line / commit), the immutable mandate (`J/J.md:111-119`), and the 31-lane Q
audit. Each precept is HONORED / VIOLATED-and-redressed / RISK-pre-empted, with the Q wave that
terminalizes the redress. **Tree:** kf **4.4.0**; `@mkbabb/value.js` `^1.1.0`; the live origin serves
`index-DwKmrGBp.js`.

The reckoning's headline: **the shipped 4.4.0 HONORS the precepts it CLAIMS to honor** (inv-16 clean —
the parse-that prod dep genuinely removed; record-as-built honesty exemplary; the engine-core batch
gestalt/KISS/performance evidenced). 4.4.0 is honestly-recorded as roughly HALF of the planned
campaign — the breaking 5.0.0 cut, the engine split, the NaN-frame cure, the demo-fleet build-ins, and
the cross-repo consume legs were consciously deferred. Q is the no-deferral terminal that redresses
each VIOLATION + pre-empts each RISK with a named wave.

---

## 1. HONORED — the precepts the shipped 4.4.0 genuinely holds (record-as-built; NOT re-opened)

| Precept | Verdict | Evidence (verified) |
|---|---|---|
| **inv-16 (the acyclic fence)** | **HONORED — CLEAN in 4.4.0** | S9 removed the direct `@mkbabb/parse-that` PRODUCTION dep entirely (kf reaches parse-that only transitively through value.js); `proof:boundary` W96 GREEN (`utils.ts:9` consumes value.js `parseCSSSubValue`; ZERO parse-that specifiers); all value.js needs were DISPATCHED, never foreign-tree-edited |
| **record-as-built honesty** | **HONORED — the drive's STRONGEST discipline** | `IMPL-RUN-BOARD.md:23` states the honest semver call plainly ("kf shipped 4.4.0 MINOR… the planned 5.0.0 awaits the deferred O.W9 breaking alias-drops"); lines 27-33 enumerate a HONEST DEFERRED FOLLOW-UPS section; the S8 honest-inferiority record + the corrected spring prose are exemplary |
| **KISS / gestalt (the engine-core batch)** | **HONORED** | the SoA compositor (`group.ts`) is a single PARTITION dispatch, NOT a legacy dual-path (numeric keys fold through the Float64 SoA plan; the non-numeric tail keeps the boxed path via `boxedKeys`); `_styleOut` is a one-pass egress; `resolve-values.ts` Phase-1 is a one-pass compile-time lowering |
| **performance-above-all (evidenced, not asserted)** | **HONORED** | SoA add 2.54×/weighted 2.35× on the REAL `transformFramesGrouped` path (Amdahl-scoped, honest framing — NOT the inflated 3.7× isolated figure); color2Into 84→37 allocs (56%); spring heatmap closed-form 272-507× — each measured, not transplanted |
| **S8 realm-cleanliness (the WeakMap terminal)** | **HONORED (realm-clean TERMINAL)** | the `FN_NAME_MAP` WeakMap (`utils.ts:52`) retired the foreign-Symbol-stamp realm breach; `proof:no-foreign-symbol-stamp` HARD + GREEN; the instance is a KEY never mutated — realm-clean |

**These are TERMINAL.** Q records them ADDRESSED, does NOT re-litigate. The Q waves that touch these
paths (Q.WB3 extends the SoA fold; Q.WG4 consumes VJ-L1) EXTEND, they do not re-open.

---

## 2. VIOLATED — the no-legacy precept (RECORDED-but-DEFERRED in 4.4.0; Q's terminal redress)

The single sharpest precept tension: **NO legacy code.** The shipped 4.4.0 carries four legacy classes,
each honestly recorded as deferred:

| Violation | Verified location | Q terminal |
|---|---|---|
| **the @deprecated runtime aliases** (`Animation`→`KeyframesAnimation`; `ScrollTimeline`→`KeyframesScrollTimeline`; `ScrollTimelineOptions`→…) survive on the published d.ts | `engine.ts:1205` + `timeline.ts:171/218` + `load-engine.ts:127/258` (the 2 interface-key aliases); the migration surface is ~33 sites (BIGGER than the brief's 22 — B2-ow9 adds 5 test value-imports + the kf-ScrollTimeline test/README sites + the type-side interface keys) | **Q.WE1** (alias drop + ~33-consumer migrate + `MIGRATION-5.0.0.md`) → **Q.WZ** (5.0.0 cut); `proof:alias-dropped` / `proof:changelog-5.0.0` born-RED over the BUILT d.ts |
| **internal/leaves.ts** re-implements value.js's clamp/scale/lerp/lerpArray "byte-for-byte equivalent" | `leaves.ts:14,56-62` (the file's OWN comment `:57-58` records the W97 externalization debt) | **Q.WE2** (the bundle-externalization TRAP — consume value.js `/math` as a bundle-external, NOT a src import that REDs `proof:boundary`); GATED on the value.js `/math` subpath (Q.WG2); `proof:boundary` W97 math-subpath-clean |
| **the 0.12.0 dead public API** (parse-that `thenMap`/`fuse()`/subTable + the 15 `*Span` builders — zero consumers; contradicts parse-that's OWN substrate-deadcode precept) | the impl drive shipped these with ZERO consumers (the ONE contrivance that slipped — B3-contrivance-recheck) | **Q.WG1 dispatch → parse-that 0.13.0** (delete the dead API; decide `*Span` adopt-or-deprecate); `proof:no-dead-combinator` |
| **the dead `proof:control-point-live`** (its premise — a glass-ui `GlassControlPoint` — was killed by BC) | `scripts/proof-control-point-live.mjs` (zero `GlassControlPoint` in the installed glass-ui dist) | **Q.WC1** RETIRES it (re-pointed/deleted when DemoControlPoint lands) |

---

## 3. VIOLATED — library-leads-the-platform (value.js BEHIND on `contrast-color()`)

| Violation | Verified | Q terminal |
|---|---|---|
| value.js parses `contrast-color()` ONLY as an opaque value (Baseline April 2026 — the platform shipped it; the library is now BEHIND, inverting "the library leads, browsers catch up") | `B1-valuejs-cssgaps` (absent from value.js 1.1.0 src + dist) | **Q.WG2 dispatch → value.js 1.1.1** (the catch-up); `proof:contrast-color-consume` (kf-side, GATED) |

---

## 4. VIOLATED — P-invariant-28 (no perpetual punts; the deceptive-ledger findings)

| Violation | Verified | Q terminal |
|---|---|---|
| **DM-2 DemoControlPoint is the NINTH carry** (declared "ABSOLUTE FINAL" at O.W5 AND P.W7, never built — the worst P-inv-28 violation in the constellation) | `grep -rn DemoControlPoint demo/ src/` → ZERO | **Q.WC1 BUILD-IN** + **Q.WC2** dogfood — the MANDATORY exit, no 10th carry; `proof:demo-control-point` (live pointer-drag) |
| **the false-RED S1/S2 arms** (`proof:workaround-deletion` version-probe, no content-probe — a gate that mis-reports the chronic state) | `B3` (S1/S2 FALSE-RED on a glass-ui version mismatch, the guard is NOT in the dist) | **Q.WG3** retargets to a content-present probe NOW; the delete GATED on the BC publish |
| **the `CHRONIC_LEDGER` is 3-tranche-stale** (the M.WZ/O.WZ/P.WZ re-points ALL skipped; the closure machine itself the longest chronic) | `scripts/proof-chronic-closure.mjs:114` → `L/PROGRESS.md`; `:468` `LEDGER_LABEL = "K/PROGRESS.md"` (label≠path) | **Q.WZ** (the atomic L→Q re-point + `LEDGER_LABEL` correction) + **Q.W0** (the Q substrate) |
| **DM-7 keyframes-vue CROSSED the P-inv-28 belt** (declared "no 5th carry, terminal P.WZ"; kf 4.4.0 shipped WITHOUT it → chronicity 5) | `npm show @mkbabb/keyframes-vue` → E404; `proof-keyframes-vue-published.mjs:63` `PEER_FLOOR = "4.3.0"` | **Q.WZ USER-DOMAIN publish** (runbook + gate) — the MANDATORY exit, no 6th carry |

---

## 5. RISK — mid-tranche deferrals baked into shipped code (pre-empted NOW)

The completeness-critic backstop (B6-completeness-critic): every shipped-code seam that could spawn a
mid-tranche deferral is pre-empted with its enabling wave NOW.

| Risk | Verified | Pre-emption (the enabling wave NOW) |
|---|---|---|
| **the NaN-frame is LATENT in shipped code** (the parse-throw was REVERTED; `frame-compiler.ts:449` carries the DEFERRED comment; NaN is latent at sample-without-timeline) | `frame-compiler.ts:449,453-460` (the explicit DEFERRED note) | **Q.WD1** — the deferred-resolution + PLAY-time guard (NOT a parse-throw); the bind-seam sub-wave pre-empts the "no attach point" deferral; `proof:nan-frame` asserts BOTH the S4 round-trip AND no-NaN-at-play |
| **resolve-values.ts ships ONLY the element-INDEPENDENT arm** (Phase-2 `style(--p)`/`sibling-index/count` is a typed-but-EMPTY seam — a wave secretly needing a not-yet-resolved element context) | `resolve-values.ts:62-67` (the empty typed fields) | **Q.WB1** — the element-aware re-resolve runs AFTER `setTargets` over the SAME ResolveContext; value.js ALREADY parses all three nodes (no sibling gate); the guard-widen is a precondition of the pass running |
| **the engine.ts god-object split is masked by its own override** (`proof:decomposition` cap:1400 masks the 1397L file) | `proof-decomposition.mjs:130-132` (cap:1400; the file is 3L under) | **Q.WF1** — the split REMOVES the override + asserts engine.ts ≤~900 + engine-playback.ts exists; runs AFTER Q.WE1 (splits a class with no trailing @deprecated re-export — a clean seam) |
| **the @function call-inlining seam awaits an unpublished sibling API** (a wave secretly needing value.js call-parse) | `resolve-values.ts:375,394` (the value.js-P-gated seam) | **Q.WG2 dispatch** (the dashed-call parse arm) → **Q.WB2** (GATED kf inlining) — the dispatch carries a terminal-or-KILL so it cannot become a perpetual punt |
| **the perf-gate floor is run-variable** (the SoA ratio swings 1.97-2.54× on the same machine; an absolute-hz floor flakes RED on the slow Linux runner) | `B1-kf-soa` (the run-variance finding) | **Q.WA4** `proof:wave-charter` (portable `baselineCase×floorFraction` ratio discipline) + **Q.WA3** device-dependence CI-harden — every Q perf gate is a portable ratio, never an absolute number |

---

## 6. The honest semver call — 4.4.0 vs the planned 5.0.0

| Observation | Verdict |
|---|---|
| the constellation DAG named "keyframes O+P (5.0.0 major)" but the drive shipped 4.4.0 MINOR | **HONEST semver** — no breaking change actually landed (the alias-drops were deferred). The friction is that the PLAN promised a major; the SHIP was honestly a minor. Q lands the honest 5.0.0: the alias drop (Q.WE1) IS the breaking change; the cut (Q.WZ) IS the major. The 5.1.x additive tier (perf + demo + emerging-CSS-P2, consuming value.js 1.2.0) rides after. |
| `proof:changelog-5.0.0` is ABSENT (the gate that would PROVE the semver claim) | **Q.WE1** authors it gate-first (the SINGLE owner; Q.WA3/Q.WZ only REFERENCE it) — born-RED over the missing breaking-change entries; wired into `release.yml` pre-publish so a 5.0.0 publish with an incomplete CHANGELOG is BLOCKED |

---

## 7. The precept reckoning in one line

**The shipped 4.4.0 is precept-DISCIPLINED on what it claims (inv-16 clean; record-as-built exemplary;
the engine-core batch gestalt/KISS/performance evidenced) and HONEST about what it deferred (~half the
campaign).** The Q-redressable violations — the un-dropped @deprecated aliases (Q.WE1/Q.WE2/Q.WG1), the
library-behind-on-`contrast-color()` (Q.WG2), the P-inv-28 punts (DM-2 the 9th carry → Q.WC1; the
false-RED S1/S2 → Q.WG3; the stale ledger → Q.WZ; the keyframes-vue belt crossed → Q.WZ), and the
honest 4.4.0→5.0.0 semver gap (Q.WE1/Q.WZ) — each have a named terminal Q wave. **No violation is
carried; no risk is left un-pre-empted.** Q is the terminal that closes the precept ledger.
