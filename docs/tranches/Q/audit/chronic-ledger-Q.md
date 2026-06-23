# Tranche Q — chronic-ledger-Q · THE P-INVARIANT-28 LEDGER (the durable chronic record)

**Lane:** `B3-chronic-ledger` (Q audit, DOCS-ONLY). **Method (inv ε):** every chronicity integer +
disposition is VERIFIED against the tree (file:line / commit), the prior PROGRESS ledgers (L/M/O/P),
and the 31-lane Q audit. This is the durable audit companion to `Q/PROGRESS.md §2/§3` (the
`proof:chronic-closure` parse substrate). **Tree:** kf **4.4.0**; the live `CHRONIC_LEDGER` pinned
3-tranche-stale at `docs/tranches/L/PROGRESS.md`.

> **P-invariant-28:** a deferred item carried ≥4 tranches CANNOT ride to a 5th without a terminal
> verdict (BUILD-IN · KILL · USER-DOMAIN publish · a published-consume HANDOFF). No re-BOOK. At Q —
> the **no-deferral terminal** — EVERY ≥4-tranche row MUST exit with a **gate that BIT**: no "ABSOLUTE
> FINAL" without a system-gate exit (the DM-2 lesson). `proof:chronic-closure` mechanizes this off the
> Chronicity-integer (`proof-chronic-closure.mjs:367-381` — a bare BOOK ≥4-tranche row REDs the gate).

---

## 0. The two SHARPEST findings (the deceptive-ledger headline)

The impl drive made REAL chronic progress (three 4-to-7-tranche chronics CLOSED in-realm: DM-3
fromMorphSVG, DM-5 S9 parse-that-dep removal, the S8 WeakMap realm-clean belt-exit) but left the
ledger in a state that violates the no-deferral precept. The two structural failures Q MUST close:

1. **DM-2 DemoControlPoint is a NINTH carry.** Declared "ABSOLUTE FINAL / forbidden-8th-carry CLOSED"
   at **O.W5** (deferred-ledger-O.md:94) AND "ABSOLUTE FINAL" at **P.W7** (deferred-ledger-P.md:177) —
   yet `grep -rn DemoControlPoint demo/ src/` → **ZERO**. The single clearest P-inv-28 violation in
   the constellation. **MANDATORY EXIT at Q.WC1 (BUILD-IN) — no 10th carry under any scenario.**
2. **DM-7 keyframes-vue CROSSED the belt.** Declared a P-inv-28 BELT item at chronicity 4 with terminal
   "USER-DOMAIN publish at P.WZ, NO 5th carry" (deferred-ledger-P.md:204). The impl drive published kf
   4.4.0 (`c69bbb0`) WITHOUT publishing keyframes-vue (still E404) → DM-7 is now at **chronicity 5**.
   **MANDATORY EXIT at Q.WZ (USER-DOMAIN publish or owner-ratified KILL) — no 6th carry.**

Plus three secondary structural failures: the `proof:workaround-deletion` S1/S2 arms are **false-RED**
(version-probe, no content-probe); `proof:ci-coverage` is **RED** (6 impl-drive gates unwired); the
`CHRONIC_LEDGER` is **3-tranche-stale** (the M.WZ/O.WZ/P.WZ re-points ALL skipped — the closure machine
itself the longest-running chronic).

---

## 1. THE ≥4-TRANCHE TERMINAL REGISTER (the P-inv-28 belt at Q — sorted by chronicity)

Every row carries (a) the chronicity integer, (b) the disposition (EXIT-shaped), (c) the named Q wave,
(d) the gate that BITS. **Zero rows are bare BOOKs** — the no-deferral binding criterion.

| # | Chronic | Born | Chronicity at Q | Disposition (EXIT-shaped) | Q wave | Gate that BITS | Verified anchor |
|---|---|---|---|---|---|---|---|
| 1 | **DM-2 GlassControlPoint → DemoControlPoint** (the NINTH carry) | E | **9** (E,F,G,H,I,J,K,L,M,O,P→Q) | **BUILD-IN** — the MANDATORY exit | **Q.WC1** + Q.WC2 | `proof:demo-control-point` (live pointer-drag MOVES a handle; the bespoke `useEasingCurveDrag` retired onto LIGHT drag2D) | `grep DemoControlPoint demo/ src/` → ZERO |
| 2 | **DM-11 CH-3 mobile** | D(D10) | **10** (D,H,I,J,K,L,M,O,P,Q; TERMINATED) | **VERIFY-ONLY** | **Q.WZ** | `proof:spring-slider-continuous` + `proof:subject-animates` re-verified GREEN on Q dist | terminated chronic |
| 3 | **DM-10 CH-2 typography** | D(D7) | **9** (D,I,J,K,L,M,O,P,Q; TERMINATED) | **VERIFY-ONLY** | **Q.WZ** | `proof:font-census` re-verified GREEN | terminated chronic |
| 4 | **DM-9 CH-1 specular** | D(D14) | **8** (D,H,I,K,L,M,O,Q) | **RE-AFFIRM** | **Q.WZ** | `proof:specular-absent-at-rest` re-verified GREEN | terminated chronic |
| 5 | **DM-12 CH-4 dock perf** | D(D5/D9) | **8** (D,H,I,K,L,M,O,Q) | **RE-AFFIRM** | **Q.WZ** | `proof:perf-frame-budget` re-verified GREEN (WITH the SoA-`processFrame` + the engine split in place) | terminated chronic |
| 6 | **DM-13 CH-5 empty-value** | A(W0) | **8** (A,H,I,K,L,M,O,Q) | **VERIFY-ONLY** | **Q.WZ** | `proof:engine-no-throw-on-play` re-verified GREEN (the NaN-guard interlock — the guard fires ONLY at PLAY-without-timeline) | terminated chronic |
| 7 | **DM-1 RF-17 dock click-strand interim** | I (BLK-8) | **7** (I,J,K,L,M,O,P→Q) | **HANDOFF** — consume on the BC cut; contingency KILL CARRIES; NO 8th carry | **Q.WG3** | `proof:workaround-deletion` S2 (the false-RED retargeted to a content-present probe NOW; GREEN on the BC re-pin + atomic deletion) | `TransportDock.vue` 9 sites |
| 8 | **DM-14 CH-6 DFA suspend** | H | **7** (H,I,K,L,M,O,Q) | **VERIFY-ONLY (TERMINATED)** | **Q.WZ** | `proof:fsm-suspend-resume-live` re-verified GREEN | terminated chronic |
| 9 | **DM-15 scene-control-dfa** | I (post-close) | **7** (I,J,K,L,M,O,Q) | **VERIFY-ONLY (TERMINATED)** | **Q.WZ** | `proof:control-surface-single-writer` re-verified GREEN | terminated chronic |
| 10 | **DM-7 keyframes-vue** (the belt CROSSED) | K.W12 | **5** (K,L,M,O,P→Q) | **USER-DOMAIN** publish (or owner-ratified KILL); NO 6th carry | **Q.WZ** | `proof:keyframes-vue-published` clause (b) E404→GREEN on the publish + `PEER_FLOOR` bump to 5.0.0 | `npm show @mkbabb/keyframes-vue` → E404 |
| 11 | **DM-5 S1 aria-orientation suppress** | K | **5** (K,L,M,O,P→Q) | **HANDOFF** — S1 delete on the BC SFC guard; OR the contingency (a KILL of the band-aid, NOT a 6th carry) | **Q.WG3** | `proof:workaround-deletion` S1 (content-present guard probe, not a version probe) | `SpringSidebar.vue:43` + `AnimationControls.vue:72` |
| 12 | **DM-8 Lighthouse floors** | B-era | **5** (L,M,O,P,Q) | **VERIFY-ONLY** | **Q.WZ** | `proof:lighthouse-mobile` `KF_REQUIRE_LH=1` re-verified GREEN | terminated chronic |
| 13 | **DM-22 named-selector NaN-frame** | L.W1 | **4** (L,M,O,P→Q) | **BUILD-IN (in-realm TERMINAL)** — deferred-resolution + PLAY-time guard (NOT a parse-throw) | **Q.WD1** | `proof:nan-frame` (4 clauses: S4 round-trip preserved; attach-resolution; `NAMED_SELECTOR_NO_TIMELINE` at PLAY; zero NaN at play) | `frame-compiler.ts:449` (the DEFERRED comment) |
| 14 | **DM-5 S8 FN_NAME clone-restamp ceremony** | K | **4** (K,L,M,O,P→Q) | **PRIMARY = HANDOFF (value.js VJ-Q4/VJ-L1 `flatLeaf .fnName`, clone()-preserved, GATED at Q.WG4) · EXPLICIT FALLBACK = in-realm parallel-array (Q.WB3 §S6, CONTINGENT-NOW, fires ONLY on a recorded VJ-Q4 decline)** — mutually-exclusive, no double-cure | **Q.WG4** (primary) / **Q.WB3 §S6** (fallback) | `proof:no-foreign-symbol-stamp` GREEN (realm-clean, shipped); `proof:workaround-deletion` S8 PENDING→GREEN on whichever terminal fires | `utils.ts:52` `FN_NAME_MAP` |
| 15 | **DM-16 5.0.0 version cut** | L.W8 | **4** (L,M,O,P→Q) | **USER-DOMAIN** | **Q.WZ** | `proof:changelog-5.0.0` (authored gate-first at Q.WE1 (the SINGLE owner)); GREEN on the 5.0.0 cut + wired into `release.yml` | `package.json:4` = 4.4.0 (the phantom 5.0.0) |
| 16 | **DM-20 deploy round-trip** | L.WZ | **4** (L,M,O,P→Q) | **USER-DOMAIN + BAND-Z** | **Q.WZ** | the live-byte oracle: live `index-<hash>.js` EQUALS the merge-SHA `dist/gh-pages` artifact | the Q opening oracle: `index-DwKmrGBp.js` |

---

## 2. THE FOLD-LANDED ROSTER (the impl-drive in-realm chronic closures — EXITED, no further carry)

These three multi-tranche chronics GENUINELY EXITED at the impl drive. Q records them FOLD-LANDED,
does NOT re-carry (the record-as-built honesty):

| Chronic | Chronicity at exit | Exit form | Verified anchor |
|---|---|---|---|
| **DM-3 MorphSVG → fromMorphSVG** | 7 (born C → exit) | **BUILD-IN (FOLD-LANDED)** — the 7-tranche ABSOLUTE, built | `morph-svg.ts`; `proof:morphsvg-consume` GREEN; 13 tests; commit `69ca7bf`. Q.WC4 EXTENDS with a demo-scene clause |
| **DM-5 S9 parse-that direct import** | 4 (K→exit) | **FOLD-LANDED** — the production dep REMOVED | `utils.ts:9` consumes value.js `parseCSSSubValue`; `proof:boundary` W96 GREEN; ZERO `@mkbabb/parse-that` specifiers |
| **DM-5 S8 FN_NAME realm-breach** | 4 (K→exit, the realm half) | **FOLD-LANDED (realm-clean)** — the foreign-Symbol stamp retired to a WeakMap | `utils.ts:52` `FN_NAME_MAP`; `proof:no-foreign-symbol-stamp` GREEN. (The ceremony residual is row 14 above — a SEPARATE, lesser chronic) |

---

## 3. THE NET-NEW Q CHRONICS (born this audit — chronicity 1, named terminals)

The three NEW issues born in the impl drive + the deceptive-ledger gate findings, each with a Q wave
home (chronicity 1 — not yet a P-inv-28 belt item, but terminalized NOW per the no-deferral mandate):

| DQ | Item | Disposition | Q wave | Gate |
|---|---|---|---|---|
| **DQ-1** | the 0.12.0 packrat src-epoch re-entrancy defect | **DISPATCH → parse-that 0.13.0** (the try/finally hardening + key widen) | Q.WG1 | `proof:perf` + a re-entrancy correctness test |
| **DQ-2** | the 0.12.0 dead public API (`thenMap`/`fuse()`/subTable/`*Span`) | **DISPATCH → parse-that 0.13.0** (delete; `*Span` decide) | Q.WG1 | `proof:no-dead-combinator` |
| **DQ-3** | value.js BEHIND on `contrast-color()` | **DISPATCH → value.js 1.1.1** | Q.WG2 | `proof:contrast-color-consume` |
| **DQ-4** | the false-RED S1/S2 arms | **FOLD → Q.WG3** (content-present retarget NOW) | Q.WG3 | `proof:workaround-deletion` S1/S2 (PENDING, not FALSE-RED) |
| **DQ-5** | `proof:ci-coverage` RED + the dirty decision-JSONs | **FOLD → Q.WA3 / Q.W0** | Q.WA3/Q.W0 | `proof:ci-coverage` bidirectional GREEN |
| **DQ-6** | the emerging-CSS Phase-2 element-aware empty seam | **FOLD → Q.WB1** (NOW) | Q.WB1 | `proof:emerging-css-resolve-P2` |
| **DQ-7** | `proof:wave-charter` never authored | **FOLD → Q.WA4** (lands FIRST) | Q.WA4 | `proof:wave-charter` |

---

## 4. THE L→Q SUBSTRATE RE-POINT (the closure machine's own chronic, terminated at Q.WZ)

| Fact | Verified | Q terminal |
|---|---|---|
| `CHRONIC_LEDGER` pinned 3-tranche-stale | `proof-chronic-closure.mjs:114` → `docs/tranches/L/PROGRESS.md` | **Q.WZ §S1** — the atomic L→Q re-point |
| `LEDGER_LABEL` disagrees with the path (the SECOND staleness) | `proof-chronic-closure.mjs:468` → `"K/PROGRESS.md"` | **Q.WZ §S1** — corrected to `"Q/PROGRESS.md"` in the SAME commit |
| the M.WZ (L→M), O.WZ (L→O), P.WZ (O→P) re-points ALL skipped | the gate has audited stale paperwork for 3 tranches | **Q.WZ** re-points **L→Q DIRECTLY** — re-stating every prior chronic with its Q-terminal disposition + chronicity integer, so no chronic drops across the multi-tranche skip (the coverage clause `:489` enforces it) |
| the Q substrate authored | `Q.W0 §S4` authors `Q/PROGRESS.md §"Open deferrals"` + this companion | **Q.W0** (the substrate) → **Q.WZ** (the re-point + the non-vacuity proof) |

**The non-vacuity protocol (the K/L/M/O/P precedent).** Before the re-point greens, three planted
malformed Q-ledger rows MUST RED on all three clause shapes (a FOLD citing a source-shape gate; a
HANDOFF targeting an unpublished sibling version; a bare BOOK at chronicity ≥4). Only then does the
clean terminal Q ledger green it. Output: `✓ proof:chronic-closure — the Q ledger is TERMINAL`.

---

## 5. THE P-INV-28 CLOSURE ASSERTION (Q — the no-deferral binding criterion)

**Every ≥4-tranche row in §1 carries an EXIT-shaped disposition with a gate that BITS. Zero bare
BOOKs.** The two SHARPEST findings are MANDATORY exits: **DM-2** (the NINTH carry) is the BUILD-IN at
Q.WC1 — no 10th carry; **DM-7** (the belt CROSSED into a 5th carry) is the USER-DOMAIN publish-or-KILL
at Q.WZ — no 6th carry. DM-1 at 7-tranche carries the contingency KILL (VOID the instant glass-ui BC
ships). The terminated VERIFY-ONLY/RE-AFFIRM roster (DM-8…DM-15) exits via a GREEN gate re-verified on
the Q dist — a green gate + born-RED provenance IS the P-inv-28 exit form.

**Q.WZ cannot close until `proof:chronic-closure` terminates non-vacuously over THIS ledger** (the
re-pointed L→Q substrate). The no-deferral law is mechanized: a bare BOOK ≥4-tranche row REDs the whole
gate, so "totality" is CHECKABLE — Q does not close while any chronic lacks a system-gate exit. This is
the binding criterion that distinguishes Q from every prior `*.WZ`: at Q, "ABSOLUTE FINAL" requires the
gate that BIT, not a declaration (the DM-2 lesson made law).
