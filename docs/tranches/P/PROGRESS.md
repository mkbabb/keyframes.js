# Tranche P — PROGRESS (the board + the P open-deferrals chronic ledger)

**Branch:** `tranche-p-dev` (P's development phase rides the O dev tip; O is RATIFIED —
DEVELOPMENT phase docs locked 2026-06-20; O implementation NOT yet authorized).
**Type:** TRANCHE P — **DEVELOPMENT PHASE.** This board records the wave plan + the consolidated
P open-deferrals ledger. §1 carries each wave's status (DEVELOPED with born-RED gate named; impl
opens on explicit authorization); the §"Open deferrals" ledger is the NEXT chronic-closure parse
substrate (O's `O/PROGRESS.md §"Open deferrals"` is the current AUTHORITATIVE parse target until
the orchestrator's atomic P.WZ re-point).
**Dev-phase date:** 2026-06-20 — the 32-lane triumvirate optimization re-audit completed
(`P/audit/AUDIT-DIGEST.md`); all P waves DEVELOPED; the 8-band DAG finalized; born-RED gates
named for every wave. **Version in tree:** `4.3.0` (the K close cut, unchanged through O dev
phase). P's version cut (`5.1.x` — perf is non-breaking; rides AFTER O's 5.0.0 major) + close
round-trip are USER-DOMAIN (Mike Babb, confirm-first), proposed at P.WZ.

This board is the spine of the P development phase: §0 (why P exists — the O substrate +
the optimization mandate), §1 (the wave board — per-wave DEVELOPED + headline born-RED gate +
phase axis), §2 (open-deferrals ledger, the P chronic substrate), §3 (the P-inv-28 terminal
register). Companion documents:

- **`P.md`** — the binding charter (the 8 bands + phase axis; the DAG; the chronic terminal
  mandate; the sibling dispatches; the 5.1.x cut rationale; the dev→impl boundary).
- **`CONSTELLATION-OPTIMIZATION-CAMPAIGN.md`** — the shared constitution (topology, DAG,
  headline novel ideas §5, version split; the three sibling sessions cite it). §4 codegen spine is RETIRED.
- **`audit/AUDIT-DIGEST.md`** — the 32-lane triumvirate optimization audit corpus. Every §1
  born-RED witness and §2 cluster anchor cites this digest by lane section + re-runnable
  `file:line`.
- **`audit/deferred-ledger-P.md`** — the P consolidated deferred/chronic ledger (the file
  you are reading is the PROGRESS board; the deferred ledger is companion).

---

## §0 — THE HEADLINE (why Tranche P exists atop O)

Tranche O is the **correctness-and-honesty** tranche: it implements what M developed, terminates
the two forbidden-8th-carry absolute chronics (DM-2 `DemoControlPoint` / DM-3 `fromMorphSVG`),
executes the engine-seam split (O.W7, VJ-L1-gated), dispatches the sibling asks, consumes the
glass-ui BC cut, and cuts 5.0.0. O is RATIFIED (docs locked 2026-06-20) but
**implementation remains UNauthorized** — P is the tranche that sequences on top of O's corrected
tree.

Tranche P is the **optimization + frontend-design** tranche. The audit (CONSTELLATION §1)
corrected three stale premises:
- Both siblings **already have bench infrastructure** (value.js 9 bench files + portable
  JSON.parse-ratio gate; parse-that `test/benchmarks/`) — the perf frontier has a substrate.
- **Codegen (BBNF-lang) is out of this campaign's scope** — retired by owner directive 2026-06-22; codegen is BBNF-lang's job in a completely separate session; P.W4 is a RETIRED tombstone.
- **glass-ui 4.1.0 published BUT `SegmentedTabs.vue:406` STILL emits `:aria-orientation`
  unconditionally** (audit F1 finding, K5 finding) — S1 deletion is NOT safe on 4.1.0 (the
  `role=group` conditional guard is absent); only **S2/dock** (`useDockClickIntegrity`, shipped
  4.0.1) is deletable NOW per Band G.

| O substrate P sequences atop | O home | P consumption |
|---|---|---|
| DM-2/DM-3 chronic terminals (DemoControlPoint / fromMorphSVG) | O.W5/O.W6 | P Band C dogfoods them in the demo fleet |
| O.W7 engine-seam (engine.ts 1397→~900, VJ-L1-gated) | O Band D (GATED) | P Band B transposes at the TRUE seam (Playhead value-object); P.W11 WeakMap early-cure unblocks it |
| O.WZ 5.0.0 cut | O Band Z | P.WZ cuts 5.1.x |
| value.js 1.0.2 PathGeometry + ./math + VJ-L1(P) + VJ-L3(P) | constellation | P Bands B/E/F/G consume |

---

## §1 — THE WAVE BOARD

**Phase legend:** `NOW` = kf-internal, zero sibling dependency, executable on authorization.
`DISPATCH` = cross-repo ask authored here (inv-16 — kf writes zero foreign-tree source).
`GATED` = fires atomically on a named sibling publish. **Status legend:** `DEVELOPED` = wave
plan authored this dev phase, born-RED gate named; impl opens on explicit authorization.

| Wave | Band | Phase | Title | Status | Born-RED gate | Unblock trigger |
|---|---|---|---|---|---|---|
| **P.W1** | A | NOW | Lint-tier coverage + bench-coverage + portable-perf-gate-infra | **DEVELOPED** | `proof:lint-tier` (NEW — `eslint` ABSENT, planted violation exits 1); `proof:bench-taxonomy` EXTENDED (new bench files wired; ratio-floor assertions for perf ideas) + portable `baselineCase×floorFraction` for every new bench arm | NOW — no sibling dep; extends O.W1/O.W8 apparatus |
| **P.W2** | B | NOW | SoA compositor + computed-unit cache (engine perf NOW) | **DEVELOPED** | `proof:soa-composite` (NEW — ratio born-RED: `SoA-engine-hz / per-channel-engine-hz < 1.0` at K=8 over FULL interp corpus today — numeric-soa.bench.ts + interp-buffer.bench.ts) + `proof:zero-alloc` heap-delta arm EXTENDED (transformTargetsStyle out-buffer alloc = 0; reconcileVars O(1) Map) | NOW — no sibling dep; value.js 1.0.2 `./math` subpath already published |
| **P.W3** | B | NOW | Typed-OM write path (DOM mutation batching) | **DEVELOPED** | `proof:typed-om-eligible` (NEW — born-RED: a pure-transform animation reports `waapiDelegated===false` and `typedOmUsed===false` today) + `proof:typed-om-eligible` throughput ratio (Typed-OM path ≥ 1.15× string-serialize path in a 200-frame bench; LIMITED AVAILABILITY: Chrome/Edge 66+, Safari 16.4+, NO Firefox — progressive-enhancement, feature-detect-gated) | NOW — CSS Typed OM LIMITED AVAILABILITY (Chrome/Edge 66+, Safari 16.4+, no Firefox); no sibling dep |
| ~~**P.W4**~~ | B | **RETIRED** | ~~Codegen-consume (kf-side)~~ — **RETIRED TOMBSTONE (2026-06-22, owner directive).** Codegen is BBNF-lang's job in a completely separate session. This slot is kept as a tombstone so P.W5..P.WZ numbering is stable. | **RETIRED** | N/A — no gate; no impl; no further action. The A.W3 falsification record (SpanParser runtime-switch slower on V8) is preserved in the AUDIT-DIGEST as historical evidence; the campaign's NON-adoption is recorded here. | N/A |
| **P.W5** | C | NOW | Cube + Amiga demo-fleet design pass | **DEVELOPED** | `proof:cube-design-paint` (NEW — born-RED: `SegmentedTabs.vue:406` unconditional; plus cube rainbow-wrapper absent; amiga telemetry absent) — Playwright pixel-readback clauses per scene | NOW — no sibling dep; dogfoods DemoControlPoint (O.W5 BUILD-IN) |
| **P.W6** | C | NOW | Square + Spring demo-fleet design pass | **DEVELOPED** | `proof:square-design-paint` + `proof:spring-design-paint` (NEW — born-RED: `role=slider` missing `aria-valuenow` at SquareScene.vue:37; SpringTrace.vue linear() stop parser assigns wrong x-coordinates; no phase-portrait or heatmap element in DOM) | NOW — no sibling dep; dogfoods springLinearStopsArray() (P.W6 adds it to LIGHT surface) |
| **P.W7** | C | NOW | Easing curve-editor + DemoControlPoint showcase | **DEVELOPED** | `proof:easing-design-paint` (NEW — born-RED: `≥2 draggable handles` absent from hero stage; DemoControlPoint over drag2D with `dampingFraction:1` critically-damped absent — the O.W5 spring-tuning S-clause) | NOW — requires O.W5 DemoControlPoint BUILD-IN as substrate |
| **P.W8** | C | NOW | N-Stage switcher unshelf (DM-24) + mobile layout | **DEVELOPED** | `proof:n-stage-boundary` (NEW — born-RED: HEAVY chunk present in stage module graph) + `proof:n-stage-mobile` (NEW — born-RED: 390px emulated viewport shows no scroll-snap carousel; zero `@media (max-width…)` in CarouselDisk.vue) | NOW (kf-internal); the mobile blocker dissolves via CSS scroll-snap transposition (D6 lane); BC cut fires the formal DM-24 unshelf (O.W15) |
| **P.W9** | D | NOW | NaN-frame cure + grammar fuzz + differential oracle | **DEVELOPED** | `proof:named-selector-no-nan` RE-TARGETED (born-RED on `utils.ts:398` NaN multiply TODAY — DM-22, O.W3 unimplemented) + `proof:differential-oracle` (NEW — born-RED: zero `*.browser.test.ts` diff files; ≥10 random oklch values must round-trip through value.js vs browser CDP) | NOW — no sibling dep; fuzz oracle requires O.W2 vitest-browser runner |
| **P.W10** | E | NOW (TRAP-aware) | leaves.ts externalization (TRAP) + deprecated-aliases + cross-realm-seam gate | **DEVELOPED** | `proof:boundary` W97 math-subpath-clean clause (NEW — born-RED: `internal/leaves.ts` present + `@mkbabb/value.js/math` NOT bundle-external in the LIGHT build today) + `proof:no-deprecated-Animation-import` (born-RED on 22 hits today) + W96 parse-that scan born-RED | NOW — the leaves.ts cut is a BUNDLE-EXTERNALIZATION, not a simple delete (F4 lane precept trap); no sibling dep for the alias purge |
| **P.W11** | F | NOW | VJ-L1 WeakMap early-cure → unblock O.W7 | **DEVELOPED** | `proof:decomposition` with `LIBRARY_CEILING_OVERRIDE` engine.ts entry REMOVED (born-RED at engine.ts:~1400 today — same gate as O.W7) + `proof:playhead-decoupled` (NEW — born-RED: grep `KeyframesAnimation` in `engine-playback.ts` returns hits today) | NOW (kf-internal WeakMap<ValueUnit,string> — dissolves the FN_NAME Symbol sidechannel WITHOUT clone-survival; explicitly inferior to VJ-L1 but sufficient to unblock O.W7 per the O.W7 spec §S8 fallback; the clone-restamp ceremony STAYS until VJ-L1 ships) |
| **P.W12** | G | NOW S2 (re-pin only — `useDockClickIntegrity` ALREADY published+installed; no sibling WAIT) · GATED S1 (waits on the UNshipped BC SFC aria guard) | S2-delete NOW + S1-GATED-on-guard | **DEVELOPED** | `proof:workaround-deletion` S2 GREEN (born-RED: S2 PENDING today at `TransportDock.vue` 9 sites — `useDockClickIntegrity` IS in glass-ui 4.0.1 but kf not yet consuming) + S1 GATED on the conditional-guard SFC fix NOT yet in 4.1.0. **S1 proof-script bug (decision #12):** S1 arm has `version:'4.1.0'` + NO `apiPresent` field — S1 is FALSELY RED. P.W12 MUST extend `apiPresent` to S1: a `grepDist` check that the installed glass-ui dist's tabs emits the `role=group`-conditional aria guard (absent today → correctly PENDING, not FALSE-RED-on-phantom-version). | **S2:** NOW (re-pin on BC cut; content-present probe — `useDockClickIntegrity` in installed dist already passes); **S1:** GATED on BC authoring the `role=group` conditional-guard SFC wave (O.W11 dispatch; `SegmentedTabs.vue:406` STILL unconditional in 4.1.0) |
| **P.WZ** | Z | NOW-author · USER-DOMAIN publish | Close + 5.1.x cut + deploy round-trip | **DEVELOPED** | `proof:chronic-closure` re-pointed O→P (non-vacuity planted-probe RED before clean) + `proof:all` GREEN on full P runner + `proof:bench-taxonomy` all arms classified | Z closes when Bands A+B+C+D+E green; F consumed; USER-DOMAIN publish fires; deploy round-trip observed |

**The DAG (phase-ordered, from P.md §3):**
```
P.W1 apparatus ─► B{P.W2 SoA+cache, P.W3 Typed-OM, [P.W4 RETIRED tombstone]} ─► C{P.W5 cube/amiga, P.W6 sq/spring, P.W7 easing, P.W8 N-Stage}
                         │                                                                 │
                         ├──────────────────► D{P.W9 correctness} ───────────────────────┤
                         │                                                                 │
                         ├──────────────────► E{P.W10 no-legacy TRAP} ──────────────────┤
                         │                                                                 ▼
   P.W11 (VJ-L1 WeakMap early-cure) ─► unblocks O.W7 engine-seam ──────────────────► P.WZ close
                                                                                         ▲
   G.P.W12 (glass-ui BC cut, S2 NOW + S1 GATED on guard) ───────────────────────────────┘
```

---

## §2 — Open deferrals

**THE chronic-closure parse substrate (for `proof:chronic-closure`) — the P consolidated
open-deferrals ledger.** Built from `O/PROGRESS.md §"Open deferrals"` (the authoritative O
substrate — pointing at `L/PROGRESS.md` pending the O.WZ re-point) + net-new P rows (DP-*).
Chronicity integers incremented for each tranche of CARRY.

> **SUBSTRATE-TRANSITION NOTE.** Through P's development phase the AUTHORITATIVE parse target for
> `proof:chronic-closure` REMAINS wherever O.WZ re-points it (currently `O/PROGRESS.md` per O.WZ
> spec — the O.WZ re-point has NOT yet executed; the live `CHRONIC_LEDGER` in
> `scripts/proof-chronic-closure.mjs` still points at `docs/tranches/L/PROGRESS.md`). The DP rows
> below form the proposed P substrate; P.WZ finalizes them. The re-point
> (`O/PROGRESS.md → P/PROGRESS.md §"Open deferrals"`) is the ORCHESTRATOR'S ATOMIC FINAL
> MOTION at P.WZ — not executed in this DOCS-ONLY development board.
>
> **CHRONICITY COLUMN SHAPE (binding grammar contract):** Every row's Chronicity cell leads with
> an explicit INTEGER tranche-span count. The gate reads the leading integer ONLY. ≥4-tranche
> EXIT-ONLY mandate (P-invariant-28) is enforced mechanically off that integer.
>
> **DISPOSITION VOCABULARY:** `FOLD` · `HANDOFF` · `RE-AFFIRM` · `VERIFY-ONLY` · `BOOK` · `KILL` ·
> `USER-DOMAIN` · `FOLD-LANDED` (tripwire FIRED + gate GREEN) · `OUT`.

### A — HANDOFF rows (sibling-gated; tripwires live; the P-inv-28 belt)

| Item | Born | Chronicity | Disposition | Owning wave | Gate / evidence (closure oracle) |
|---|---|---|---|---|---|
| **DM-1 RF-17 / dock click-strand interim** (`onPlayPointerDown` / `pointerHandled` in `TransportDock.vue`) | I (BLK-8) | **6 (I,J,K,L,M,O→P)** | **HANDOFF — consume glass-ui BC cut + delete S2 in ONE commit** | **P.W12** | `proof:workaround-deletion` S2 PENDING (9 sites: `TransportDock.vue:15,151,196,342,348,358,361,366,373`). **TRIPWIRE:** glass-ui BC cut ships `useDockClickIntegrity` (confirmed at 4.0.1 `dock.js:534`) → S2 GREEN on re-pin + atomic deletion. **P-inv-28 (NEWLY 6-tranche at P — CRITICAL BELT ZONE):** no 7th carry under the no-workaround precept. The pre-authored contingency KILL record in `deferred-ledger-O.md §6` carries forward — VOID the instant BC ships. (`audit/A3-bc-dock`) |
| **DM-5 Constellation workarounds — residual S1, S8, S9** (S2 is now Band G `P.W12`; S7 FOLD-LANDED) | K | **4 (K,L,M,O→P)** | **HANDOFF: S1 on BC SFC guard (P.W12); S8/S9 on value.js P (O.W16 inherited)** | **P.W12** (S1) · **O.W16→P** (S8/S9) | `proof:workaround-deletion` S1=PENDING (`:aria-orientation=undefined` at `AnimationControls.vue:72` + `SpringSidebar.vue:43` — BC asked; S1 delete GATES on the `role=group` conditional guard shipping — `SegmentedTabs.vue:406` STILL unconditional in 4.1.0, verified K5/F1 finding); S8=PENDING (FN_NAME Symbol, VJ-L1 absent from value.js 1.0.2); S9=PENDING (direct parse-that import, VJ-L3 absent). **P-inv-28 belt fires at chronicity 4 (THIS TRANCHE)** for S8/S9 — named terminal home: value.js P VJ-L1 + VJ-L3. |
| **DM-7 keyframes-vue 0.1.0 unpublished** (`packages/keyframes-vue` PREPPED; clause (b) of `proof:keyframes-vue-published` RED — E404) | K.W12 | **4 (K,L,M,O→P)** | **HANDOFF (USER-DOMAIN — Mike Babb)** | **P.WZ** | `proof:keyframes-vue-published` clause (b) RED-BY-DESIGN (E404). Build GREEN; peer floor correct. **P-inv-28 belt fires at chronicity 4 (THIS TRANCHE).** Named terminal: USER-DOMAIN publish at P.WZ (rides the 5.1.x cut). No 5th carry under any scenario. |

### B — BUILD-IN rows (kf-owned, no sibling gate — the P-inv-28 ABSOLUTE terminals from O)

| Item | Born | Chronicity | Disposition | Owning P wave | Gate / evidence (closure oracle) |
|---|---|---|---|---|---|
| **DM-2 GlassControlPoint → `DemoControlPoint`** (ABSOLUTE terminal: born E · 7 carries through M · O charters forbidden-8th-carry close O.W5 · P INHERITS + IMPLEMENTS; P carries the PROOF if O.W5 impl has not fired) | E | **born E · 7 carries through M · O charters O.W5 · P INHERITS+IMPLEMENTS (ABSOLUTE terminus: no further carry)** | **BUILD-IN (O.W5 home; P dogfoods it in Band C)** — if O.W5 NOT YET IMPLEMENTED when P opens, P.W7 is the FINAL BUILD-IN home; no further carry | **P.W7** (demo-fleet showcase: the curve-editor drag handle IS `DemoControlPoint`) | `proof:demo-control-point` (from O.W5 — born-RED on absent component; GREEN on `DemoControlPoint.vue` live-drag via LIGHT `drag2D`). P.W7 requires O.W5 as substrate. If O.W5 NOT IMPLEMENTED, P.W7 builds it first. |
| **DM-3 MorphSVG → `fromMorphSVG`** (ABSOLUTE terminal: born C · 7 carries through M · O charters forbidden-8th-carry close O.W6 · P INHERITS + IMPLEMENTS; P carries the PROOF if O.W6 impl has not fired) | C | **born C · 7 carries through M · O charters O.W6 · P INHERITS+IMPLEMENTS (ABSOLUTE terminus: no further carry)** | **BUILD-IN (O.W6 home; P adds the topology-aware topology extension)** — if O.W6 NOT YET IMPLEMENTED when P opens, P.W5 is the FINAL BUILD-IN home; no further carry | **P.W5** (demo-fleet: the morph scene dogfoods `fromMorphSVG`) | `proof:morphsvg-consume` (from O.W6 — born-RED on absent export; GREEN when mid-t sample DISTINCT from both endpoints). P.W5 requires O.W6 as substrate or builds it inline. |

### C — USER-DOMAIN rows

| Item | Born | Chronicity | Disposition | Owning wave | Gate / evidence |
|---|---|---|---|---|---|
| **DM-16 5.0.0 version cut** (FOUR breaking changes + Oscillator publish; still awaiting O.WZ USER-DOMAIN) | L.W8 | **3 (L,M,O→P)** | **USER-DOMAIN** (Mike Babb authorizes at O.WZ; P inherits the closed-or-carry) | **O.WZ → P inherits** | `proof:changelog-5.0.0` (NEW at O.WZ — born-RED today; four breaking renames + Oscillator clause). |
| **DM-20 deploy round-trip not yet observed** | L.WZ | **3 (L,M,O→P)** | **USER-DOMAIN + BAND-Z** | **O.WZ → P.WZ inherits if slipped** | CI→deploy auto path re-verified at each cut; observed as live-byte equality. |
| **DM-24 N Stage unshelf** (BC-gated; impl on `n-stage-impl` branch) | N | **2 (N,O→P)** | **HANDOFF (BC-gated; P.W8 is the full design + mobile transposition wave)** | **P.W8** | `proof:n-stage-boundary` born-RED (HEAVY chunk absent from stage modules); `proof:n-stage-mobile` born-RED (no scroll-snap on 390px). P.W8 owns the mobile transposition (CSS scroll-snap carousel) regardless of BC cut timing. |

### D — FOLD-LANDED rows (tripwires FIRED; gates GREEN — no further carry)

| Item | Born | Chronicity | Disposition | Owning wave | Gate / evidence |
|---|---|---|---|---|---|
| **DM-4 PT-2 packrat** (A.W2 WDM fix) | E | **FOLD-LANDED** (parse-that A.W2; GREEN at O) | **FOLD-LANDED** | O.W2 (intake) | `proof:packrat-sound` GREEN. |
| **DM-5 S7 linear() flat-comma regex** | K | **GREEN (FIRED M consume)** | **FOLD-LANDED (RETIRED)** | M.W9 | `proof:workaround-deletion` S7 GREEN. |
| **DM-6 True-CSS-parity** (css-parity GREEN) | K | **FOLD-LANDED** (value.js 1.0.x) | **FOLD-LANDED** | O.W2 (intake) | `proof:css-parity` 8/8 GREEN. |
| **DM-17, DM-18, DM-19, DM-25** | L-M | **FOLD-LANDED** (resolved per O.W2 intakes) | **FOLD-LANDED** | O.W2 | per-gate GREEN per O deferred-ledger-O.md §1c. |

### E — VERIFY-ONLY / RE-AFFIRM rows (terminated chronics; re-verify on P dist)

Each row is TERMINATED. The P obligation is RE-VERIFY the GREEN state on the P dist (5.1.x cut).
If any gate reverts RED, that is a NEW P regression to wave-assign.

| Item | Born | Chronicity | Disposition | Owning wave | Closure oracle |
|---|---|---|---|---|---|
| **DM-8 Lighthouse floors** | B-era | 4 (L,M,O,P) | **VERIFY-ONLY** | **P.WZ** | `proof:lighthouse-mobile` `KF_REQUIRE_LH=1` re-run on P 5.1.x dist. |
| **DM-9 CH-1/B7 specular** | D(D14)→H | **7 (D,H,I,K,L,M,O→P)** | **RE-AFFIRM** | **P.WZ** | `proof:specular-absent-at-rest` GREEN; re-verify on P dist. |
| **DM-10 CH-2 typography** | D(D7)→I | **8 (D,I,J,K,L,M,O,P; TERMINATED)** | **VERIFY-ONLY** | **P.WZ** | `proof:font-census` GREEN; re-run on P dist. |
| **DM-11 CH-3 mobile** | D(D10) | **9 (D,H,I,J,K,L,M,O,P; TERMINATED)** | **VERIFY-ONLY** | **P.WZ** | `proof:spring-slider-continuous` + `proof:subject-animates` GREEN; re-run on P dist. |
| **DM-12 CH-4 dock** | D(D5/D9) | **7 (D,H,I,K,L,M,O→P)** | **RE-AFFIRM** | **P.WZ** | `proof:perf-frame-budget` GREEN; re-verify on P dist. |
| **DM-13 CH-5 empty-value** | A(W0)→H | **7 (A,H,I,K,L,M,O→P)** | **VERIFY-ONLY** | **P.WZ** | `proof:engine-no-throw-on-play` GREEN; re-run on P dist. |
| **DM-14 CH-6 DFA suspend** | H | **6 (H,I,K,L,M,O→P)** | **VERIFY-ONLY** | **P.WZ** | `proof:fsm-suspend-resume-live` GREEN; re-run on P dist. |
| **DM-15 scene-control-dfa** | I (post-close) | **6 (I,J,K,L,M,O→P)** | **VERIFY-ONLY** | **P.WZ** | `proof:control-surface-single-writer` GREEN; re-verify on P dist. |

### F — NET-NEW P obligations (gate-first BOOK / HANDOFF; not carried as an O-DM row)

| Item | Born | Chronicity | Disposition | Owning wave | Gate / evidence |
|---|---|---|---|---|---|
| **DP-1 S1 FALSE-RED corrected / S2 NOW-deletable** (F1/K5 audit finding: proof:workaround-deletion S1 shows FALSE RED on 4.1.0 — the aria guard is NOT in it; S2 is NOW deletable via content-present probe) | P (2026-06-20) | 1 (P→P) | **FOLD → P.W12** (retarget S1 from version probe to conditional-guard content-present check; S2 delete on BC cut re-pin; S1 delete GATES separately on the SFC guard wave) | **P.W12** | Audit K5 + F1: `SegmentedTabs.vue:406` line 306 in 4.1.0 tabs.js still unconditional. S2: `grep 'useDockClickIntegrity' node_modules/@mkbabb/glass-ui/dist/dock.js` present → S2 actionable. |
| ~~**DP-2 codegen-consume deferral**~~ (P.W4 kf-side codegen gate) | P (2026-06-20) | — | **RETIRED (2026-06-22, owner directive).** Codegen is BBNF-lang's separate session; P.W4 is a RETIRED tombstone; `proof:codegen-consume` is NOT authored; `codegen-consume-decision.json` is NOT authored. Historical evidence (the audit RAISED codegen; the campaign did NOT adopt it) lives in AUDIT-DIGEST.md. | ~~P.W4~~ | **RETIRED — no gate, no impl.** |
| **DP-3 demo-fleet unbuilt items** (spring heatmap; amiga drag2D transpose; easing hero-stage handles; N-Stage mobile) | P (2026-06-20) | 1 (P→P) | **FOLD → P Bands B/C** (each has its named wave home) | **P.W5/W6/W7/W8** | Per-scene `proof:*-design-paint` born-RED gates. |
| **DP-4 mobile N-Stage entirely unbuilt** (D6 lane: zero `@media (max-width…)` in CarouselDisk.vue; the shelf-driver) | P (2026-06-20) | 1 (P→P) | **FOLD → P.W8** (CSS scroll-snap transposition is the mobile architecture, not a patch) | **P.W8** | `proof:n-stage-mobile` born-RED (390px viewport — no scroll-snap carousel); GREEN when native scroll-snap carousel renders on phone-narrow viewport. |
| **DP-5 VJ-L1 WeakMap early-cure P-inv-28 arm** (S8 at chronicity 4 = P-inv-28 belt fires; kf-internal WeakMap is the named early-exit if value.js P slips) | P (2026-06-20) | 1 (P→P) | **FOLD → P.W11** (WeakMap replaces Symbol; clone-restamp ceremony STAYS; inferior to VJ-L1 but P-inv-28-compliant) | **P.W11** | `proof:decomposition` born-RED (engine.ts >900L ceiling); GREEN on WeakMap cure + engine.ts ≤900L; does NOT retire S8 arm (S8 GREEN only on VJ-L1 api-present probe). |

---

## §3 — P-invariant-28 terminal register (the ≥4-tranche roster at P)

> **P-invariant-28:** a deferred item carried ≥4 tranches CANNOT ride to a 5th without a
> terminal verdict (BUILD-IN, KILL, or permanent-NO with a named rationale). No re-BOOK.

| DM | Chronicity at P | Verdict | Status |
|---|---|---|---|
| **DM-2 GlassControlPoint** | **born E · 7 carries through M · O charters forbidden-8th-carry close (O.W5) · P INHERITS + IMPLEMENTS** | **BUILD-IN (ABSOLUTE terminal via O.W5; if O.W5 not impl, P.W7 is FINAL)** — no further carry | P.W7 requires O.W5 as substrate or executes inline |
| **DM-3 MorphSVG** | **born C · 7 carries through M · O charters forbidden-8th-carry close (O.W6) · P INHERITS + IMPLEMENTS** | **BUILD-IN (ABSOLUTE terminal via O.W6; if O.W6 not impl, P.W5 is FINAL)** — no further carry | P.W5 requires O.W6 as substrate or executes inline |
| **DM-11 CH-3 mobile** | **9** (D,H,I,J,K,L,M,O,P; TERMINATED) | **VERIFY-ONLY** — GREEN gate + born-RED provenance satisfies P-inv-28 | P.WZ re-verify |
| **DM-10 CH-2 typography** | **8** (D,I,J,K,L,M,O,P; TERMINATED) | **VERIFY-ONLY** — GREEN gate satisfies P-inv-28 | P.WZ re-verify |
| **DM-1 RF-17 dock interim** | **6** (I,J,K,L,M,O→P) | **HANDOFF** — consume on BC cut (P.W12); P-inv-28 mandates resolution THIS tranche; **NO 7th carry.** Pre-authored contingency KILL from deferred-ledger-O.md §6 CARRIES FORWARD. | P.W12 — BC cut |
| **DM-5 S8 FN_NAME** | **4** (K,L,M,O→P) | **HANDOFF** — terminal at value.js P VJ-L1; P.W11 WeakMap early-cure is the kf-internal P-inv-28 exit if VJ-L1 slips | P.W11 (internal arm) + O.W16 (VJ-L1 publish arm) |
| **DM-5 S9 parse-that import** | **4** (K,L,M,O→P) | **HANDOFF** — terminal at value.js P VJ-L3; P.W10 W96 boundary scan is the gate that bites even if VJ-L3 slips | O.W16 (VJ-L3 publish arm) |
| **DM-7 keyframes-vue** | **4** (K,L,M,O→P) | **USER-DOMAIN — Mike Babb at P.WZ; P-inv-28 belt ACTIVE; NO 5th carry** | P.WZ |
| **DM-9 CH-1 specular** | 7 | **RE-AFFIRM** — GREEN gate satisfies P-inv-28 | P.WZ re-verify |
| **DM-12 CH-4 dock** | 7 | **RE-AFFIRM** — GREEN gate satisfies P-inv-28 | P.WZ re-verify |
| **DM-13 CH-5 empty-value** | 7 | **VERIFY-ONLY** — GREEN gate + born-RED provenance | P.WZ re-verify |
| **DM-14 CH-6 DFA suspend** | 6 | **VERIFY-ONLY (TERMINATED)** — GREEN gate satisfies P-inv-28 | P.WZ re-verify |
| **DM-15 scene-control-dfa** | 6 | **VERIFY-ONLY (TERMINATED)** — GREEN gate satisfies P-inv-28 | P.WZ re-verify |

**THE PATH CONSTANT IS NOT RE-POINTED HERE.** `scripts/proof-chronic-closure.mjs:114`
`CHRONIC_LEDGER` currently points at `docs/tranches/L/PROGRESS.md` (per pre-O.WZ state) —
L's ledger remains the authoritative parse target until the orchestrator's atomic final motion
at O.WZ (re-points to O); P.WZ re-points O→P. This DEVELOPMENT board only defines the P
substrate so the P.WZ re-point is READY.

---

## §4 — Open-deferrals summary (the P deferral count at dev-phase)

| Disposition | Rows |
|---|---|
| **HANDOFF, tripwire PENDING (sibling-gated)** | DM-1 (BC cut, 6-tranche — CRITICAL) · DM-5 S1 (BC SFC guard) · DM-5 S8/S9 (value.js P, P-inv-28 belt at 4) · DM-24 (N Stage, BC cut + P.W8 mobile) |
| **USER-DOMAIN (P-inv-28 belt at 4)** | DM-7 (keyframes-vue, P.WZ) · DM-16 (5.0.0 cut, O.WZ→P) · DM-20 (deploy) |
| **BUILD-IN (kf-owned, ABSOLUTE terminal — O or P must close)** | DM-2 (born E · O.W5/P.W7 DemoControlPoint · P INHERITS+IMPLEMENTS) · DM-3 (born C · O.W6/P.W5 fromMorphSVG · P INHERITS+IMPLEMENTS) |
| **FOLD-LANDED (tripwire FIRED + gate GREEN)** | DM-4 · DM-5 S7 · DM-6 · DM-17 · DM-18 · DM-19 · DM-25 |
| **VERIFY-ONLY / RE-AFFIRM (terminated chronics)** | DM-8 · DM-9 · DM-10 · DM-11 · DM-12 · DM-13 · DM-14 · DM-15 |
| **NET-NEW P obligations (FOLD → named wave home)** | DP-1 (S1 false-RED + S2 now-deletable, P.W12) · ~~DP-2 (codegen-consume, RETIRED)~~ · DP-3 (demo-fleet unbuilt, Bands C) · DP-4 (mobile N-Stage, P.W8) · DP-5 (VJ-L1 WeakMap early-cure, P.W11) |

**P-INVARIANT-28 CLOSURE ASSERTION (P).** Every row carries (a) a tag, (b) a named owning wave,
(c) a named tripwire or terminal disposition. **Zero rows are bare BOOKs.** DM-1 is at
6-tranche — the contingency KILL record carries. DM-2 (born E, O charters forbidden-8th-carry
close O.W5, P INHERITS+IMPLEMENTS) and DM-3 (born C, O charters O.W6, P INHERITS+IMPLEMENTS)
are ABSOLUTE FINAL BUILD-INs. DM-5 S8/S9 and DM-7 are at chronicity-4 P-inv-28 belt — named
terminal homes are ENFORCED. DP-2 (codegen-consume) is RETIRED (2026-06-22) — not a HANDOFF,
not a BOOK; tombstoned in P.W4.

---

## Gate-first / born-RED discipline note

Every P wave in this board authors its born-RED gate before any source cure, and the gate bites
the REAL observable, never a proxy. The load-bearing lessons carried from O:

- **The S1 false-RED lesson (K5/F1 lanes, 2026-06-20):** the O.W2 DO-2 retarget of S1 from
  `glass-ui@4.1.0` version probe to a conditional-guard content-present probe was NEVER
  EXECUTED. The live run shows S1=RED (glass-ui 4.1.0 IS published) — but the aria guard is
  NOT in it (`SegmentedTabs.vue:406` still unconditional). P.W12 MUST author the content-present
  probe (`grep 'aria-orientation.*tablist'` or equivalent) as the S1 tripwire, not the version
  number. Deleting S1 on the current 4.1.0 would break the kf consumers.
- **The leaves.ts TRAP lesson (F4 lane):** O.md's "import from `@mkbabb/value.js/math`" claim
  would RED `proof:boundary` (subpath specifier banned in LIGHT source). P.W10 performs a
  BUNDLE-EXTERNALIZATION transposition — not a delete. The W97 clause confirms the math subpath
  is grammar-free BEFORE authoring the externalization.
- **The no-bench FALSE-PREMISE lesson (V1/P1 lanes):** both siblings already have bench
  infrastructure. P.W1 extends it rather than creating it from scratch. Every new perf bench
  arm uses `baselineCase×floorFraction` ratio normalization (device-independent, CI-portable).

**No wave starts impl without a born-RED gate on disk that bites the GENUINE defect on the
unfixed tree.** This is the non-negotiable law inherited from O's `inv-M-observable-truth`.
