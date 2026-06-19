# Tranche O — PROGRESS (the board + the O open-deferrals chronic ledger)

**Branch:** `n-stage-impl` (O's development phase rides the M consume tip; M.W1 + M.W8-Phase-1 +
M.W9/S7 + M.W10 + M.W11 IMPLEMENTED on `master` @ `aef3ef3`; the remaining M waves are
DEVELOPED-only and superseded by the O scope below.)
**Type:** TRANCHE O — **DEVELOPMENT PHASE.** This board records the wave plan + the consolidated
O open-deferrals ledger. §1 carries each wave's status (DEVELOPED with born-RED gate named; impl
opens on explicit authorization); the §"Open deferrals" ledger is the NEXT chronic-closure parse
substrate (M's `M/PROGRESS.md §"Open deferrals"` remains the AUTHORITATIVE parse target until the
orchestrator's atomic O.WZ re-point).
**Dev-phase date:** 2026-06-19 — the 32-lane constellation re-audit completed (`audit/AUDIT-DIGEST.md`);
all O waves DEVELOPED; the eight-band DAG finalized; born-RED gates named for every wave; the two
P-inv-28 ABSOLUTE chronics (DM-2, DM-3) assigned BUILD-IN homes in Band C. **Version in tree:**
`4.3.0` (the K close cut, unchanged through M). O's version cut (`5.0.0` — the breaking renames +
Oscillator publish) + close-merge round-trip are USER-DOMAIN (Mike Babb, confirm-first), proposed
at O.WZ.

This board is the spine of the O development phase: §0 (why O exists — the M as-built delta and
what the 32-lane re-audit found), §1 (the wave board — per-wave DEVELOPED + headline born-RED gate +
phase axis), §2 (open-deferrals ledger, the O chronic substrate), §3 (the P-inv-28 terminal
register). Companion documents:

- **`O.md`** — the binding charter (the eight bands + phase axis; the DAG; the chronic terminal
  mandate; the sibling dispatches; the 5.0.0 cut rationale; the dev→impl boundary).
- **`audit/AUDIT-DIGEST.md`** — the 32-agent constellation re-audit corpus. Every §1 born-RED
  witness and §2 cluster anchor cites this digest by lane section + re-runnable `file:line`.

---

## §0 — THE HEADLINE (why Tranche O exists)

Tranche M was developed as a 16-wave plan and **partially implemented**: M.W1 (parallel runner),
M.W8-Phase-1 (lockfile), M.W9/S7 (linear-stops delete), M.W10 (packrat-sound/FOLD-FIX), and M.W11
(css-parity gate) are GREEN on `master`. The remaining twelve waves — Band-A apparatus (M.W2/W3/W4),
Band-B correctness (M.W5/W6 partial, M.W7 done), Band-D transposition (M.W12/W13), Band-E terminal
belt (M.W14), and M.WZ close — are DEVELOPED-only. The re-audit (32 agents, `audit/AUDIT-DIGEST.md`,
2026-06-19) confirms this gap and adds corrections:

| M-wave DEVELOPED | as-built on `master` | O home |
|---|---|---|
| M.W2/W3/W4 Band-A apparatus | eslint ABSENT; `@vitest/browser` ABSENT; 264 `waitForTimeout` alive | **O Band A** |
| M.W5 compile-surface | `@property` dropped by `compileToCSS`; S4 clause is source-shape proxy; `NAMED_SELECTOR_NO_TIMELINE` never thrown | **O Band B** |
| M.W6 multi-color densify | `colorToOklabCSS` unconditional (`compile-color.ts:191`); non-color props dropped | **O Band B** |
| M.W12 perf | `bench/sync-step.bench.ts` unwired; color-interp bench absent; `postTask` unprobed | **O Band D** |
| M.W13 engine-seam | `engine.ts` 1397L; LIBRARY_CEILING_OVERRIDE live; blocked on VJ-L1 flatLeaf | **O Band D** (VJ-P-gated) |
| M.W14 terminal belt | `fromMorphSVG` ABSENT; `DemoControlPoint` ABSENT; `proof:control-point-live` stale (BC said NO) | **O Band C** (BUILD-IN) |
| M.W8-Phase-2 / M.W-DESIGN-PAINT / M.W15 | S1/S2 PENDING; `proof:design-paint` ABSENT; lighthouse observe-only | **O Band F** (BC-gated) |
| M.WZ close | `proof:changelog-5.0.0` ABSENT; Oscillator not in npm@4.3.0; round-trip not observed | **O Band Z** |

Three re-audit corrections applied to O's ledger (not in the M PROGRESS.md as-written):

- **DM-4** flips from KILL → FOLD-LANDED (parse-that A.W2 FIX per D4 owner decision; `proof:packrat-sound` GREEN).
- **DM-5 S7** flips from PENDING → GREEN (linear() flat-comma regex retired; `proof:workaround-deletion` 1 GREEN / 4 PENDING live).
- **DM-6** tripwire FIRED (value.js 1.0.x published; `proof:css-parity` GREEN) → FOLD-LANDED.
- **DM-5 S1/S2** tripwire re-targeted from `glass-ui@4.1.0` (never published; BB closed at 4.0.1) → **glass-ui BC cut** (≥BC-CUT, USER-DOMAIN version, not frozen).
- **Vendor sub-chunk server gap** confirmed (D17/D18 lanes): `proof-engine-no-throw-on-play.mjs` / `proof-subject-animates.mjs` serve only 2 vendor files; value.js 1.0.0+ is a 10-chunk barrel → 404 cascade.

---

## §1 — THE WAVE BOARD

**Phase legend:** `NOW` = kf-internal, zero sibling dependency, executable on authorization.
`DISPATCH` = cross-repo ask authored here (inv-16 — kf writes zero foreign-tree source).
`GATED` = fires atomically on a named sibling publish. **Status legend:** `DEVELOPED` = wave plan
authored this dev phase, born-RED gate named; impl opens on explicit authorization.

| Wave | Band | Phase | Title | Status | Born-RED gate | Unblock trigger |
|---|---|---|---|---|---|---|
| **O.W0** | — | NOW | Charter + ledger hygiene | **DEVELOPED** | `proof:audit-artifacts-O` (NEW) — 32-lane digest on disk; dev→impl boundary witness; DM-4/DM-5/DM-6 corrections applied; `proof:chronic-closure` LEDGER_LABEL corrected | M is the substrate (O.W0 follows M.W1 GREEN on master) |
| **O.W1** | A | NOW | Lint tier (eslint + dep-cruiser) | **DEVELOPED** | `proof:lint-tier` (NEW — `eslint` ABSENT from `node_modules/`, verified) — a planted source-shape violation (oversize file, restricted import) REDs the ONE static pass | NOW (no sibling dep) |
| **O.W2** | A | NOW | Ledger re-point + stale-gate retarget | **DEVELOPED** | `proof:chronic-closure` re-pointed L→M with non-vacuity planted-row RED discipline (three malformed rows RED before clean run) + `proof:workaround-deletion` S1/S2 sibling re-targeted from `@4.1.0` → BC cut content-present probe | NOW (no sibling dep) |
| **O.W3** | B | NOW | Named-selector NaN-frame cure | **DEVELOPED** | `proof:replay-equality` S4 RE-TARGETED: ingests `entry 0%` and asserts `frame.time.start` IS NOT NaN; `NAMED_SELECTOR_NO_TIMELINE` ACTUALLY thrown (today: dead code at `frame-compiler.ts:128`; typed at `errors.ts:46`, never reached) | NOW (no sibling dep) |
| **O.W4** | B | NOW | Multi-color densify fidelity + ingest / vendor sub-chunk fix | **DEVELOPED** | `proof:compile-replay` EXTENDS: `oklch-densify-emits-oklch` (today `compile-color.ts:191` calls `colorToOklabCSS` unconditionally) + `densify-preserves-non-color`; PLUS `proof:engine-no-throw-on-play` J.W1-b clause GREEN (vendor server expanded to serve value.js 1.0.0+ sub-chunks) | NOW (no sibling dep) |
| **O.W5** | C | NOW | DemoControlPoint build-in (DM-2, 7-tranche ABSOLUTE terminal) | **DEVELOPED** | `proof:demo-control-point` (NEW — does NOT exist; `DemoControlPoint.vue` ABSENT: `grep -rn 'DemoControlPoint' demo/` → zero hits) born-RED on the absent component; retire `proof:control-point-live` (stale premise: BC said NO to GlassControlPoint) | NOW — no sibling gate; build over LIGHT `Draggable`/`drag2D` |
| **O.W6** | C | NOW | `fromMorphSVG` build-in (DM-3, 7-tranche ABSOLUTE terminal) | **DEVELOPED** | `proof:morphsvg-consume` (NEW — ABSENT: `ls scripts/proof-morphsvg-consume.mjs` → not found; `fromMorphSVG` export ABSENT: `grep -rn 'fromMorphSVG' src/` → zero) born-RED; GREEN when a live morph sample differs from both `d` endpoints | NOW — no sibling gate; `PathGeometry` in value.js 1.0.2 (`dist/transform/path.d.ts:36-67`) |
| **O.W7** | D | GATED (VJ-P) | Engine-seam transposition (`engine.ts` 1397→~900L) | **DEVELOPED** | `proof:decomposition` with `LIBRARY_CEILING_OVERRIDE` entry REMOVED (the cap reverts to 550L base — the born-RED trigger) | Unblocked by VJ-L1 flatLeaf (removes FN_NAME stamp the split is blocked on); fires on value.js P publish |
| **O.W8** | D | NOW | Perf closure (bench taxonomy + color-interp + scheduler) | **DEVELOPED** | `proof:bench-taxonomy` EXTENDED (sync-step.bench.ts, color-interp.bench.ts, numeric-soa.bench.ts wired; observe-only floor) + `proof:scheduler-posttask` RE-TARGETED onto real-browser INP delta (NOT `typeof scheduler.postTask === "function"` proxy) | NOW (no sibling dep) |
| **O.W9** | D | NOW | No-legacy cuts (deprecated aliases + `leaves.ts`→`/math`) | **DEVELOPED** | `proof:changelog-5.0.0` (NEW — ABSENT: `ls scripts/proof-changelog*` → no matches) born-RED asserting FOUR breaking changes (`Animation`→`KeyframesAnimation`, `ScrollTimeline`→`KeyframesScrollTimeline`, `ScrollTimelineOptions`→`KeyframesScrollTimelineOptions`, `presets.flip`→`flipPreset`) + `proof:boundary` W96 parse-that-scan extension (born-RED on `utils.ts:1` today) | NOW (no sibling dep for the alias purge; W96 unblocks S9 delete on VJ-L3) |
| **O.W10** | E | DISPATCH | `KF-TO-VALUEJS-P-ASKS` (VJ-L1 flatLeaf + VJ-L3 parseCSSSubValue) | **DEVELOPED** | Not a kf gate — the dispatch doc IS the deliverable (inv-16); born-RED kf-side: `proof:workaround-deletion` S8 = PENDING (`flatLeaf` absent from value.js 1.0.2 live probe) + S9 = PENDING (`parseCSSSubValue` absent) | DISPATCH authored at O.W10; kf gates GREEN on value.js P publish |
| **O.W11** | E | DISPATCH | glass-ui BC aria-orientation CORRECTION (S1 premise fix) | **DEVELOPED** | Not a kf gate — the corrected ask IS the deliverable (inv-16); born-RED kf-side: `proof:workaround-deletion` S1 = PENDING (both suppress lines present: `AnimationControls.vue:72` + `SpringSidebar.vue:43`); BC still emits `:aria-orientation` unconditionally on `role=group` (`SegmentedTabs.vue:406`) | DISPATCH authored at O.W11; kf S1 delete fires on BC publish of the conditional-guard SFC fix |
| **O.W12** | F | GATED (BC cut) | S1 + S2 delete + BC re-pin (DM-1, DM-5 S1/S2 close) | **DEVELOPED** | `proof:workaround-deletion` S1 + S2 GREEN (today both PENDING — `AnimationControls.vue:72`, `SpringSidebar.vue:43`, `TransportDock.vue` 9 sites); BC re-pin to `~<BC>.x` | Fires on glass-ui BC cut publish; S1 conditional guard (O.W11 ask answered) + S2 `useDockClickIntegrity` confirmed curing the crossfade-strand case |
| **O.W13** | F | GATED (BC cut) | `proof:design-paint` pixel-readback gate (M.W-DESIGN-PAINT) | **DEVELOPED** | `proof:design-paint` (NEW — ABSENT: `ls scripts/proof-design-paint.mjs` → not found) born-RED by construction; S1 authored pre-BC; S4 BC baseline lock fires on consume | S1 gate authoring is NOW (kf-internal); S4 baseline lock fires on BC cut |
| **O.W14** | F | GATED (BC cut) | Lighthouse posture flip + N Stage unshelf (DM-24) | **DEVELOPED** | `proof:lighthouse-mobile` flips from `observe-only` → `hard` posture (`scripts/proof-lighthouse-mobile.mjs:71` today `declarePosture("observe-only")`; SCENE_CEILINGS updated); `proof:content-visibility-gated` (NEW — ABSENT) authored born-RED | Fires on glass-ui BC cut (dock engine + tabs S1 fix); DM-24 unshelf follows |
| **O.W15** | F | GATED (BC cut) | Demo-perf + CWV (M.W15 posture) | **DEVELOPED** | `proof:lighthouse-mobile` clause (b) sequence + motion-path floors added (today ABSENT from SCENE_CEILINGS → silently skipped) | Fires on glass-ui BC cut; measured floors update to post-BC actuals |
| **O.W16** | G | GATED (VJ-P) | S8 FN_NAME + S9 parse-that delete; `proof:boundary` W96 GREEN | **DEVELOPED** | `proof:workaround-deletion` S8 + S9 GREEN (today PENDING: `utils.ts:45-55` FN_NAME Symbol 7 sites; `utils.ts:1` direct parse-that import; `package.json` parse-that dep) + `proof:boundary` W96 parse-that-scan GREEN | Fires on value.js P shipping VJ-L1 + VJ-L3; one atomic commit: delete FN_NAME + direct parse-that + swap `lerpArray` to `@mkbabb/value.js/math` |
| **O.WZ** | Z | NOW-author · USER-DOMAIN publish | Close + 5.0.0 cut + deploy round-trip | **DEVELOPED** | `proof:changelog-5.0.0` (NEW) + `proof:chronic-closure` re-pointed M→O (non-vacuity planted-probe RED before clean) + `proof:all` GREEN on full O runner + `proof:published-surface` Oscillator clause | Z closes when Band A+B+C+D.W8+D.W9 GREEN + F consumed + USER-DOMAIN publish fires; deploy round-trip observed as live-byte equality (`CI<run>→deploy<run>→live serves index-<hash>.js exact`) |

**The DAG (phase-ordered, from O.md §3):**
```
O.W0 charter ─► A{W1 lint, W2 ledger} ─► B{W3 nan-frame, W4 densify+vendor} ─► C{W5 DemoControlPoint, W6 MorphSVG}
                       │                                                                  │
                       ├─────────────────────► D.W9 no-legacy (NOW) ────────────────────┤
                       │                                                                  ▼
   E.W10 value.js-P ask ──┐                                               D.W7 engine-seam ◄── (VJ-P)
   E.W11 glass-ui aria ──┐│                                                           │
                         ▼▼                                                           ▼
                 G.W16 (VJ-P publish) ──────────────────────────────────► O.WZ close ◄─── F{W12 S1/S2, W13 paint, W14 LH+N-Stage, W15 perf} (BC cut)
```

---

## §2 — Open deferrals

**THE chronic-closure parse substrate (for `proof:chronic-closure`) — the O consolidated
open-deferrals ledger.** Built from `M/PROGRESS.md §"Open deferrals"` (the authoritative M substrate
— 20 rows parsed by `proof:chronic-closure` today; still pointing at `L/PROGRESS.md` pending the
O.WZ re-point) + re-audit corrections (DM-4 KILL→FOLD-LANDED, DM-5 S7 PENDING→GREEN, DM-6
HANDOFF→FOLD-LANDED, DM-5 S1/S2 tripwire BB→BC) + net-new O rows (DO-*). Chronicity integers
incremented for each tranche of CARRY.

> **SUBSTRATE-TRANSITION NOTE.** Through O's development phase the AUTHORITATIVE parse target for
> `proof:chronic-closure` REMAINS `L/PROGRESS.md` (`scripts/proof-chronic-closure.mjs:114`
> `CHRONIC_LEDGER` points there — and LEDGER_LABEL carries the stale `K/PROGRESS.md` text to
> correct at O.W2). The DO rows below form the proposed O substrate; O.WZ finalizes them. The
> re-point (`L/PROGRESS.md → O/PROGRESS.md §"Open deferrals"`) is the ORCHESTRATOR'S ATOMIC FINAL
> MOTION at O.WZ — not executed in this DOCS-ONLY development board. The re-point is NOT vacuous:
> the non-vacuity planted-probe proof (three malformed rows RED before cleaning) PRECEDES the final
> `proof:chronic-closure` GREEN-on-clean-ledger exit.
>
> **CHRONICITY COLUMN SHAPE (binding grammar contract):** Every row's Chronicity cell leads with an
> explicit INTEGER tranche-span count (`7 (C,F,G,H,I,J,K,L,M→O)`, etc.). The gate reads the leading
> integer ONLY. ≥4-tranche EXIT-ONLY mandate (P-invariant-28) is enforced mechanically off that integer.
>
> **DISPOSITION VOCABULARY:** `FOLD` · `HANDOFF` · `RE-AFFIRM` · `VERIFY-ONLY` · `BOOK` · `KILL` ·
> `USER-DOMAIN` · `FOLD-LANDED` (tripwire FIRED + gate GREEN) · `OUT`.

### A — HANDOFF rows (sibling-gated; tripwires live; the P-inv-28 belt)

| Item | Born | Chronicity | Disposition | Owning wave | Gate / evidence (closure oracle) |
|---|---|---|---|---|---|
| **DM-1 RF-17 / dock click-strand interim** (`onPlayPointerDown` / `pointerHandled` in `TransportDock.vue`) | I (BLK-8) | **5 (I,J,K,L,M→O)** | **HANDOFF — consume glass-ui BC cut + delete S2 in ONE commit** | **O.W12** | `proof:workaround-deletion` S2 PENDING (9 sites: `TransportDock.vue:15,151,196,342,348,358,361,366,373`). **TRIPWIRE:** glass-ui BC cut ships `useDockClickIntegrity` (confirmed at BC HEAD `c93d0b88` `dock.js:534`) + buttery-dock engine eliminates the crossfade-strand root → S2 GREEN on re-pin + atomic deletion. **P-inv-28 (NEWLY 5-tranche at O):** no 6th carry under the no-workaround precept. (`audit/A3-bc-dock §3`) |
| **DM-5 Constellation workarounds (residual arms S1, S2, S8, S9)** | K | **3 (K,L,M→O)** | **HANDOFF: S1/S2 on BC cut (O.W12); S8/S9 on value.js P (O.W16)** | **O.W12** (S1/S2) · **O.W16** (S8/S9) | `proof:workaround-deletion` 1 GREEN (S7 RETIRED) / 4 PENDING / 0 RED. **S1 PENDING:** `:aria-orientation=undefined` at `AnimationControls.vue:72` + `SpringSidebar.vue:43` — correction ask dispatched at O.W11; fires on BC SFC fix. **S2 PENDING:** see DM-1. **S8 PENDING:** `FN_NAME` Symbol (`utils.ts:45-55`) — `flatLeaf` absent from value.js 1.0.2 (live probe). **S9 PENDING:** direct parse-that import (`utils.ts:1`, `package.json:215`) — `parseCSSSubValue` absent from value.js 1.0.2. Each arm: atomic delete-with-re-pin on its sibling publish. (`audit/B10-vjl1-vjl3`, `audit/C11-cross-realm-seams`) |

### B — BUILD-IN rows (kf-owned, no sibling gate — the P-inv-28 ABSOLUTE terminals)

| Item | Born | Chronicity | Disposition | Owning wave | Gate / evidence (closure oracle) |
|---|---|---|---|---|---|
| **DM-2 GlassControlPoint / DL-K7 / DL-L7 → `DemoControlPoint`** (7-tranche; BC decided NO; kf builds thin component over LIGHT `Draggable`/`drag2D`) ★‡ | E | **8 (E,F,G,H,I,J,K,L,M→O)** | **BUILD-IN (ABSOLUTE terminal — the forbidden 9th carry is closed; BC said NO — `KF-BC.md:75`)** | **O.W5** | `proof:demo-control-point` (NEW — ABSENT: `ls scripts/proof-demo-control-point.mjs` → not found; `grep -rn DemoControlPoint demo/ src/` → zero). Born-RED on absent component; GREEN on `DemoControlPoint.vue` built in `demo/@/components/`. RETIRE `proof:control-point-live` (stale premise). **P-inv-28 (8-tranche, ABSOLUTE terminal):** no 9th ride under any scenario. (`audit/C16-kf-demo §DM-2`, `audit/D17-demo-gate-red §DM-2`) |
| **DM-3 MorphSVG / FB-3 / DL-L8 → `fromMorphSVG`** (7-tranche; `PathGeometry` confirmed published in value.js 1.0.2) ★‡ | C | **8 (C,F,G,H,I,J,K,L,M→O)** | **BUILD-IN (ABSOLUTE terminal — no 9th ride)** | **O.W6** | `proof:morphsvg-consume` (NEW — ABSENT: `ls scripts/proof-morphsvg-consume.mjs` → not found; `grep -rn fromMorphSVG src/` → zero). Born-RED on absent export; GREEN when a live morph sample over two `d` strings differs from both endpoints. **P-inv-28 (8-tranche, ABSOLUTE terminal):** the `PathGeometry.getLength()` / `getPointAtLength()` API is ALREADY published at value.js 1.0.2 `dist/transform/path.d.ts:36-67`. No sibling gate. (`audit/C13-kf-deferred-ledger §DM-3`, `audit/F25-chronic-deferrals §DM-3`) |

### C — USER-DOMAIN rows

| Item | Born | Chronicity | Disposition | Owning wave | Gate / evidence |
|---|---|---|---|---|---|
| **DM-7 keyframes-vue 0.1.0 unpublished** (`packages/keyframes-vue` PREPPED; clause (b) of `proof:keyframes-vue-published` RED — E404) | K.W12 | 3 (K,L,M→O) | **HANDOFF (USER-DOMAIN — Mike Babb)** | **O.WZ** | `proof:keyframes-vue-published` clause (b) RED-BY-DESIGN (E404). Build GREEN; peer floor correct. Bump peer floor to `>=5.0.0` before publish. (`audit/D19-deploy-roundtrip`) |
| **DM-16 5.0.0 version cut** (FOUR breaking changes + Oscillator publish; Oscillator absent from npm@4.3.0; `proof:changelog-5.0.0` ABSENT) | L.W8 | 2 (L,M→O) | **USER-DOMAIN** (Mike Babb authorizes the version string) | **O.WZ** | `proof:changelog-5.0.0` (NEW — born-RED; asserting all FOUR: `Animation`→`KeyframesAnimation` `engine.ts:1192`; `ScrollTimeline`→`KeyframesScrollTimeline` `timeline.ts:209`; `ScrollTimelineOptions`→`KeyframesScrollTimelineOptions` `timeline.ts:163`; `presets.flip`→`flipPreset` `animations.ts:133`). Oscillator LOCAL-ONLY in 4.3.0 tarball (confirmed: `grep Oscillator /tmp/package/dist/keyframes.js` → zero); 5.0.0 cut carries all 8 missing LIGHT exports. (`audit/D20-oscillator-republish`) |
| **DM-20 deploy round-trip not yet observed** (gated on `proof:all` GREEN + BC peer fix + USER-DOMAIN cut) | L.WZ | 2 (L,M→O) | **USER-DOMAIN + HANDOFF** (three preconditions; O.WZ closes all) | **O.WZ** | The CI→deploy-pages.yml auto path is BLOCKED by two born-RED tripwires: `proof:keyframes-vue-published` (DM-7) + `proof:control-point-live` (DM-2 stale premise). O.W5 clears DM-2; O.WZ clears DM-7 (USER-DOMAIN publish). Observed as live-byte equality (`CI<run>→deploy<run>→live serves index-<hash>.js exact`), recorded in O/FINAL.md. (`audit/D19-deploy-roundtrip`) |
| **DM-24 N Stage unshelf** (11-stage STAGE-SPEC on `n-stage-impl`; DM-24 HANDOFF on glass-ui BC dock + ASK-3 resolved) | N | 1 (N→O) | **HANDOFF (BC-gated; unshelf on BC cut)** | **O.W14** | DM-24 fires when glass-ui BC cut publishes (Band-2 dock engine DONE at BC HEAD `c93d0b88`; CUT tier 27 pending). **ASK-3 NOTE:** scene-select affordance is kf-owned (kf's ChromeDock composition), NOT a BC API surface — BC ships the stable dock morph substrate; kf builds atop it. Do NOT rebase `n-stage-impl` before BC cut. (`audit/A3-bc-dock §DM-24`) |

### D — FOLD-LANDED rows (tripwires FIRED; gates GREEN — no further carry)

| Item | Born | Chronicity | Disposition | Owning wave | Gate / evidence |
|---|---|---|---|---|---|
| **DM-4 PT-2 parse-that packrat** (D4 owner decision: FIX, not KILL; parse-that A.W2 WDM shipped) | E | **7 (E,F,G,H,I,K,L,M→O)** | **FOLD-LANDED** (parse-that A.W2 WDM fix shipped at 0.11.0; D4 owner decision overrides M-ledger KILL verdict) | **O.W2** (intake correction) | `proof:packrat-sound` GREEN (parse-that 0.11.0 composite `(id,offset)` WDM key; M-RECONCILIATION §4 D4 flip). Update DM-4 + DM-17 dispositions from KILL/RESOLVED-BY-KILL to FOLD-LANDED/RESOLVED-BY-FIX at O.W2. (`audit/C13-kf-deferred-ledger §DM-4`) |
| **DM-5 S7 linear() flat-comma regex** (`utils.ts:119,185` — value.js 1.0.x emits canonical space-joined; the regex is obsolete) | K | 1 (K→O as resolved) | **FOLD-LANDED (RETIRED)** — `proof:workaround-deletion` S7 GREEN on master | **O.W2** (intake record) | `proof:workaround-deletion` S7 GREEN (live run 2026-06-19: S7 retired in the cascade commits). Update DM-5 prose to "1 GREEN / 4 PENDING" at O.W2. |
| **DM-6 True-CSS-parity frontier** (CSS Nesting THROWS; bare-gradient crash; `proof:css-parity` gate authored at M.W11) | K | **3 (K,L,M→O)** | **FOLD-LANDED** (value.js 1.0.x shipped; `proof:css-parity` GREEN on master) | **O.W2** (intake correction) | `proof:css-parity` GREEN (8/8 clauses; live run 2026-06-19). Update DM-6 disposition from HANDOFF/UN-FIRED to FOLD-LANDED at O.W2. (`audit/C13-kf-deferred-ledger §DM-6`) |
| **DM-17 `proof:packrat-sound` gate absent** | L.WZ | 1 (L→O as resolved) | **RESOLVED-BY-FIX** (DM-4 flips KILL→FOLD-LANDED; DM-17 disposition updates RESOLVED-BY-KILL→RESOLVED-BY-FIX) | **O.W2** (intake correction) | See DM-4. (`audit/C13-kf-deferred-ledger §DM-17`) |
| **DM-18 `proof:css-parity` gate absent** | L.WZ | 1 (L→O as resolved) | **FOLD** (gate authored at M.W11; GREEN on master) | **M.W11** | `proof:css-parity` GREEN. (`M/PROGRESS.md §D DM-18`) |
| **DM-19 `proof:rf17-net-deletion` name ambiguity** | L.W9 | 1 (L→O as resolved) | **CANONICALIZE** (S2 IS the authoritative oracle; name retired at M.W8) | **M.W8** | S2 arm of `proof:workaround-deletion` is the canonical check. (`M/PROGRESS.md §D DM-19`) |
| **DM-25 `proof:consume-bundle` gate** (M-RECONCILIATION §9; gate present on master — M-RECONCILIATION was DOCS-ONLY, the script already shipped) | M | 1 (M→O born-closed) | **FOLD-LANDED** (born-closed: `scripts/proof-consume-bundle.mjs` present on master; in `proof:hygiene`) | **O.W2** (intake record) | `ls scripts/proof-consume-bundle.mjs` → present. Update M-RECONCILIATION §9 to record SHIPPED. (`audit/F26-recent-deferrals §DM-25`) |

### E — VERIFY-ONLY / RE-AFFIRM rows (the carried K-chronics — terminated; re-run on O dist)

Each row is TERMINATED. The O obligation is RE-VERIFY the GREEN state on the O dist (5.0.0 cut).
If any gate reverts RED, that is a NEW O regression to wave-assign.

| Item | Born | Chronicity | Disposition | Owning wave | Closure oracle |
|---|---|---|---|---|---|
| **DM-8 Lighthouse floors** | B-era | 3 (L,M,O; K EXITED) | **VERIFY-ONLY** | **O.WZ** | Non-gate terminal mechanism (measured quiet-host artifact): re-run `proof:lighthouse-mobile` with `KF_REQUIRE_LH=1` on O close dist; K floors are hard floor; regression = RED. |
| **DM-9 CH-1/B7 specular sheen** | D(D14)→H | **6 (D,H,I,K,L,M→O)** | **RE-AFFIRM** | **O.WZ** | `proof:specular-absent-at-rest` GREEN (runtime gate; flat-default consume cured it; born-RED in origin tranche). Re-verify on O dist. |
| **DM-10 CH-2 typography** | D(D7)→I(TYP-2) | **7 (D,I,J,K,L,M,O; TERMINATED)** | **VERIFY-ONLY** | **O.WZ** | `proof:font-census` GREEN (runtime gate; dock-voice ONE token; born-RED in K). Re-run on O dist. |
| **DM-11 CH-3 mobile chronic** | D(D10) | **8 (D,H,I,J,K,L,M,O; TERMINATED)** | **VERIFY-ONLY** | **O.WZ** | `proof:spring-slider-continuous` + `proof:subject-animates` GREEN (runtime gates; 60 Hz painter owns position; born-RED in K). Re-run on O dist. |
| **DM-12 CH-4 dock** | D(D5/D9) | **6 (D,H,I,K,L,M→O)** | **RE-AFFIRM** | **O.WZ** | `proof:perf-frame-budget` GREEN (runtime gate; D5 lag + D9 popover; born-RED in K). Re-verify on O dist. |
| **DM-13 CH-5/B1+B5 empty-value crash** | A(W0)→H | **6 (A,H,I,K,L,M→O)** | **VERIFY-ONLY** | **O.WZ** | `proof:engine-no-throw-on-play` GREEN (runtime gate; `parseCSSValueUnit("")` no-throw; born-RED in origin). Re-run on O dist. **NOTE:** vendor sub-chunk server gap (O.W4) must be cured first for this gate to pass on value.js 1.0.2+. |
| **DM-14 CH-6/B2 `_gen` DFA suspend** | H | **5 (H,I,K,L,M→O)** | **VERIFY-ONLY** | **O.WZ** | `proof:fsm-suspend-resume-live` GREEN (runtime gate; bind-proof RAFPlayback; born-RED in H). Re-run on O dist. P-inv-28 (5-tranche): GREEN gate + documented born-RED provenance IS the exit form. |
| **DM-15 scene-control-dfa** | I (post-close) | **5 (I,J,K,L,M→O)** | **VERIFY-ONLY** | **O.WZ** | `proof:control-surface-single-writer` GREEN (runtime gate; CI green→auto-deploy closed it at J.W0). Re-verify on O dist. P-inv-28 (5-tranche): GREEN gate + born-RED provenance IS the exit form. |

### F — NET-NEW O obligations (gate-first BOOK / HANDOFF; not carried as an M-DM row)

| Item | Born | Chronicity | Disposition | Owning wave | Gate / evidence |
|---|---|---|---|---|---|
| **DO-1 vendor sub-chunk server gap** (value.js 1.0.0+ is a 10-chunk barrel; `proof-engine-no-throw-on-play.mjs` + `proof-subject-animates.mjs` serve only 2 vendor files → 404 cascade on sub-chunks) | O (audit A3/D17/D18) | 1 (O→O) | **FOLD → O.W4** (kf-internal fix; extend vendor server to serve full `dist/` tree; `proof:engine-no-throw-on-play` J.W1-b clause GREEN) | **O.W4** | `proof:engine-no-throw-on-play` J.W1-b clause born-RED today (`probeError: Failed to fetch`); GREEN after vendor prefix expansion (`/__kf-vendor__/value-vendor/*` → `node_modules/@mkbabb/value.js/dist/*`). (`audit/D17-demo-gate-red §3`, `audit/D18-ci-device-dependence §1`) |
| **DO-2 `proof:workaround-deletion` S1/S2 tripwire stale (BB→BC re-target)** (`sibling: { pkg: '@mkbabb/glass-ui', version: '4.1.0' }` at `scripts/proof-workaround-deletion.mjs:228`; BB closed at 4.0.1, never published 4.1.0; `useDockClickIntegrity` already ships at 4.0.1) | O (audit A2-bc-kf-seam) | 1 (O→O) | **FOLD → O.W2** (retarget S2 check from version sentinel to `useDockClickIntegrity` content-present probe on installed dist; S1 re-targeted to the conditional-guard SFC fix) | **O.W2** | `proof:workaround-deletion` S2 probe updated to `grep 'useDockClickIntegrity' node_modules/@mkbabb/glass-ui/dist/dock.js` — already present at 4.0.1, so S2 transitions PENDING→HANDOFF correctly. (`audit/A2-bc-kf-seam §HIGH`) |
| **DO-3 `proof:chronic-closure` LEDGER_LABEL stale** (`scripts/proof-chronic-closure.mjs` has `LEDGER_LABEL = "K/PROGRESS.md"` while `CHRONIC_LEDGER` points at `L/PROGRESS.md`) | O (audit C13) | 1 (O→O) | **FOLD → O.W2** (correct `LEDGER_LABEL` to `"L/PROGRESS.md"` in the same O.W2 ledger-hygiene commit that retargets S1/S2 tripwires) | **O.W2** | Non-gate mechanism: one-line constant correction + re-run `proof:chronic-closure` exits 0 on clean L substrate. (`audit/C13-kf-deferred-ledger §§DM-20 close note`) |
| **DO-4 DM-24 / DM-25 / DM-W1-bridge rows absent from live ledger** (M-RECONCILIATION §7/§9 specified these rows but the §11 edit-spec was DOCS-ONLY and was never applied to `deferred-ledger-M.md` or `PROGRESS.md §D`) | O (audit F26) | 1 (O→O) | **FOLD → O.W0** (apply M-RECONCILIATION §11 edit-specs at O.W0 ledger-hygiene wave: insert DM-24 N-Stage HANDOFF row, DM-25 consume-bundle FOLD-LANDED row, DM-W1-bridge verify-record row; update DM-4 KILL→FOLD-LANDED, DM-17 RESOLVED-BY-KILL→RESOLVED-BY-FIX, DM-5 "0 GREEN / 5 PENDING" → "1 GREEN / 4 PENDING") | **O.W0** | Non-gate mechanism: one-commit ledger-hygiene applying M-RECONCILIATION §11. (`audit/F26-recent-deferrals §§DM-24`) |
| **DO-5 `AnimationControls.vue` ARIA ownership violation** (`role=tabpanel` with `role=group` owner at `AnimationControls.vue:90,121,141`; WAI-ARIA forbids `tabpanel` under `group`) | O (audit A4-bc-aria-ax) | 1 (O→O) | **FOLD → O.W12** (fix as part of the BC consume wave: switch SegmentedTabs to `variant=underline` or replace `role=tabpanel` with `role=region` + `aria-label`; add a born-RED gate clause) | **O.W12** | Born-RED: `proof:workaround-deletion` or a new `proof:aria-tabpanel-owner` clause asserts that `role=tabpanel` divs are NOT owned by a `role=group` ancestor. (`audit/A4-bc-aria-ax §HIGH`) |
| **DO-6 Oscillator absent from npm@4.3.0** (Oscillator in local dist + barrel but not in published tarball; BC building glass-ui-local `useOscillator` mirror as interim) | O (audit D20) | 1 (O→O) | **FOLD → O.WZ** (rides the 5.0.0 cut atomically; `proof:published-surface` Oscillator clause asserts it in the LOCAL dist; no separate gate for registry delta — the cut IS the gate) | **O.WZ** | `proof:changelog-5.0.0` + `proof:published-surface` Oscillator clause GREEN post-cut. BC must delete `useOscillator` mirror on BC.W-CUT re-pin. (`audit/D20-oscillator-republish`) |

### The O ledger disposition tally (DEVELOPED — substrate ready for O.WZ re-point)

| Disposition | Rows |
|---|---|
| **HANDOFF, tripwire PENDING (sibling-gated)** | DM-1 (glass-ui BC cut, 5-tranche) · DM-5 S1/S2 (glass-ui BC cut) · DM-5 S8/S9 (value.js P) · DM-24 (N Stage, BC cut) |
| **BUILD-IN (kf-owned, ABSOLUTE terminal — no sibling gate)** | DM-2 DemoControlPoint (8-tranche, O.W5) · DM-3 fromMorphSVG (8-tranche, O.W6) |
| **USER-DOMAIN** | DM-7 (keyframes-vue publish) · DM-16 (5.0.0 cut) · DM-20 (deploy round-trip) |
| **FOLD-LANDED (tripwire FIRED + gate GREEN)** | DM-4 (packrat FIX per D4) · DM-5 S7 (linear() retire) · DM-6 (css-parity GREEN) · DM-17 (RESOLVED-BY-FIX) · DM-18 (css-parity gate authored) · DM-19 (rf17-net-deletion canonicalized) · DM-25 (consume-bundle present) |
| **VERIFY-ONLY / RE-AFFIRM (the 7 carried K-chronics + DM-8 Lighthouse)** | DM-8 · DM-9 · DM-10 · DM-11 · DM-12 · DM-13 · DM-14 · DM-15 |
| **NET-NEW O obligations (FOLD)** | DO-1 (vendor sub-chunk, O.W4) · DO-2 (S1/S2 tripwire re-target, O.W2) · DO-3 (LEDGER_LABEL fix, O.W2) · DO-4 (missing DM-24/25/W1-bridge rows, O.W0) · DO-5 (ARIA ownership, O.W12) · DO-6 (Oscillator publish, O.WZ) |

---

## §3 — P-invariant-28 terminal register (the ≥4-tranche roster at O)

> **P-invariant-28:** a deferred item carried ≥4 tranches CANNOT ride to a 5th without a
> terminal verdict (BUILD-IN, KILL, or permanent-NO with a named rationale). No re-BOOK.

| DM | Chronicity at O | Verdict | Status |
|---|---|---|---|
| **DM-2 GlassControlPoint** | **8** (E,F,G,H,I,J,K,L,M→O) | **BUILD-IN (ABSOLUTE terminal)** — `DemoControlPoint` over LIGHT `Draggable`; no 9th ride | O.W5 — gate-first born-RED |
| **DM-3 MorphSVG** | **8** (C,F,G,H,I,J,K,L,M→O) | **BUILD-IN (ABSOLUTE terminal)** — `fromMorphSVG` over value.js `PathGeometry`; no 9th ride | O.W6 — gate-first born-RED |
| **DM-11 CH-3 mobile** | **8** (D,H,I,J,K,L,M,O; TERMINATED) | **VERIFY-ONLY** — GREEN gate + born-RED provenance satisfies P-inv-28; no re-BOOK | O.WZ re-verify |
| **DM-10 CH-2 typography** | **7** (D,I,J,K,L,M,O; TERMINATED) | **VERIFY-ONLY** — GREEN gate + born-RED provenance satisfies P-inv-28 | O.WZ re-verify |
| **DM-4 PT-2 packrat** | **7** (E,F,G,H,I,K,L,M→O; TERMINATED via FIX) | **FOLD-LANDED** — D4 FIX (parse-that A.W2 WDM); GREEN gate. No re-BOOK. | O.W2 intake correction |
| **DM-9 CH-1 specular** | **6** (D,H,I,K,L,M→O; TERMINATED) | **RE-AFFIRM** — GREEN gate + born-RED provenance satisfies P-inv-28 | O.WZ re-verify |
| **DM-12 CH-4 dock** | **6** (D,H,I,K,L,M→O; TERMINATED) | **RE-AFFIRM** — GREEN gate satisfies P-inv-28 | O.WZ re-verify |
| **DM-13 CH-5 empty-value** | **6** (A,H,I,K,L,M→O; TERMINATED) | **VERIFY-ONLY** — GREEN gate + born-RED provenance; O.W4 vendor fix needed before re-run | O.WZ re-verify |
| **DM-1 RF-17 dock interim** | **5** (I,J,K,L,M→O) | **HANDOFF** — consume on BC cut (O.W12); P-inv-28 forbids 6th carry; **TERMINAL WINDOW IS NAMED**: O.W12 is the last permitted carry; if BC cut slips past O.WZ, owner must issue a reasoned KILL | O.W12 — BC cut |
| **DM-9 specular / DM-14 DFA suspend / DM-15 scene-control-dfa** | 5 or 5 | **VERIFY-ONLY (TERMINATED)** — same mechanism | O.WZ re-verify |

**THE PATH CONSTANT IS NOT RE-POINTED HERE.** `scripts/proof-chronic-closure.mjs:114` `CHRONIC_LEDGER`
still points at `docs/tranches/L/PROGRESS.md` (verified on this tree) — L's ledger remains the
authoritative parse target until the orchestrator's atomic final motion at O.WZ. This DEVELOPMENT board
only defines the O substrate so the re-point is READY.

---

## Gate-first / born-RED discipline note

Every O wave in this board authors its born-RED gate before any source cure, and the gate bites the
REAL observable, never a proxy. The load-bearing lessons carried forward:

- **The L.W1 S4 proxy lesson (inv-M-observable-truth):** the L S4 gate tested no-throw + string
  round-trip while the real breach was NaN frame-times. O.W3 RE-TARGETS that clause onto the genuine
  NaN observable.
- **The M observable-truth extension:** the S2 tripwire was set against `glass-ui@4.1.0` (never
  published; BB closed at 4.0.1). O.W2 re-targets to a content-present probe on the installed dist.
- **The vendor sub-chunk lesson (DO-1):** the `proof-engine-no-throw-on-play.mjs` gate appeared to
  test the real observable but was silently 404ing on value.js 1.0.0+ sub-chunks. O.W4 fixes the
  server before any cure lands.

**No wave starts impl without a born-RED gate on disk that bites the GENUINE defect on the unfixed
tree.** This is the non-negotiable law of Tranche O, inherited from M's `inv-M-observable-truth`
and sharpened by the re-audit's three stale-gate findings.
