# Tranche P — THE CONSOLIDATED DEFERRED / CHRONIC LEDGER (O → P)

**Lane:** L2-deferred-ledger · **Date authored:** 2026-06-20 · **Tree at author:**
`tranche-o-dev` (the O development tip; O is RATIFIED — docs locked; O implementation NOT
yet authorized; inv-16 holds throughout per `P.md`).

**Mandate.** THE O → P carry-forward ledger. Every deferral gets a row: the DM-1..DM-25+
rows from `docs/tranches/O/audit/deferred-ledger-O.md` carried forward with UPDATED
dispositions reflecting the P audit (32-lane triumvirate optimization re-audit, `P/audit/
AUDIT-DIGEST.md`, 2026-06-20), the P wave assignments from `P.md §3`, the S1–S9 workaround
arms with CORRECTED tripwires, and the net-new P findings (VJ-L1/L3 belt, codegen-consume
gating, demo-fleet shelving, mobile N-Stage unbuilt, S1 false-RED correction).

**THE CORRECTED O-state facts this ledger carries (the P re-audit findings — F1/F2/K5):**

1. **S1 is FALSE RED on glass-ui 4.1.0.** The O deferred-ledger re-targeted S1 from `BB
   4.1.0` to the BC cut, but did NOT correct the tripwire script. The P audit (F1 / K5
   lanes) confirmed that glass-ui 4.1.0 IS published yet `SegmentedTabs.vue:406` in that
   version STILL emits `:aria-orientation` unconditionally (the `role=group` conditional
   guard is ABSENT from 4.1.0). proof:workaround-deletion shows S1=RED but this is a
   FALSE RED — the sibling has not shipped the actual fix. **P.W12 must retarget S1 from
   the version probe to a conditional-guard content-present check.**
2. **S2 IS now deletable.** `useDockClickIntegrity` is confirmed present in glass-ui 4.0.1
   `dist/dock.js` — the content-present probe passes. S2 deletion is actionable on a BC cut
   re-pin. P.W12 is the owning wave.
3. **DM-5 S8/S9 at chronicity 4 = P-inv-28 belt fires THIS tranche.** VJ-L1 and VJ-L3
   absent from value.js 1.0.2. The chronicity is now 4 (K,L,M,O→P) — the P-inv-28 exit
   mandate is ACTIVE. Named terminal: value.js P VJ-L1/VJ-L3. P.W11 WeakMap early-cure is
   the kf-internal arm if value.js P slips.
4. **DM-7 keyframes-vue at chronicity 4 = P-inv-28 belt fires THIS tranche.** E404 at
   npm registry (K,L,M,O→P = 4 carries). USER-DOMAIN at P.WZ. No 5th carry.
5. **DM-1 RF-17 at chronicity 6 — CRITICAL window.** (I,J,K,L,M,O→P = 6 carries.) The
   pre-authored contingency KILL from deferred-ledger-O.md §6 carries forward unchanged.
   P.W12 is the terminal window. No 7th carry.
6. **DM-2/DM-3 at chronicity 9 — ABSOLUTE FINAL.** O.W5/O.W6 are the chartered BUILD-IN
   homes; implementation NOT yet executed (O impl unauthorized). If O.W5/O.W6 not yet
   implemented when P opens, P.W7/P.W5 are the ABSOLUTE final BUILD-IN homes. No 10th
   carry under any scenario.
7. **The codegen-consume (P.W4) is GATED — not a NOW wave.** Fires only when parse-that B
   ships `@mkbabb/parse-that/codegen` + value.js P consumes it to emit a generated parser.
   The kf-side gate (`proof:codegen-consume`) is born-RED today because the codegen parser
   does not yet exist.
8. **The mobile N-Stage is entirely unbuilt** (D6 lane, zero `@media (max-width…)` in
   CarouselDisk.vue) — the shelf-driver. P.W8 owns the CSS scroll-snap transposition.

---

## §0 — THE TAG SET (terminal dispositions)

Carries from O §0 unchanged:

| Tag | Meaning | Exit mechanism |
|---|---|---|
| **FOLD-LANDED** | already done on the post-consume master; gate GREEN | re-verify GREEN on P dist |
| **BUILD-IN** | kf builds the feature kf-side NOW; no sibling gate | born-RED kf gate, GREENed by the kf build |
| **HANDOFF** | sibling-gated; tripwire un-fired | born-RED kf consume-gate, STAGED-PENDING until sibling publishes |
| **KILL** | off-consumed-path; non-re-litigable | KILL record (named spec) |
| **DISPATCH** | a cross-repo ask authored in kf (inv-16); wave home named | the sibling receives + schedules |
| **VERIFY-ONLY** | terminated chronic; re-verify GREEN per dist | GREEN gate re-run |
| **USER-DOMAIN** | requires owner authorization | owner acts |

**P-invariant-28 reckoning (the P mandate):**

- **DM-2** GlassControlPoint (born E) — **9 carries through O.** O.W5 closes the forbidden
  8th carry via BUILD-IN (AUTHORIZED but NOT YET IMPLEMENTED). P.W7 is the **ABSOLUTE
  FINAL** home if O.W5 slips. No 10th carry.
- **DM-3** MorphSVG (born C) — **9 carries through O.** O.W6 closes the forbidden 8th carry
  via BUILD-IN (AUTHORIZED but NOT YET IMPLEMENTED). P.W5 is the **ABSOLUTE FINAL** home if
  O.W6 slips. No 10th carry.
- **DM-5 S8/S9** — chronicity 4 at P (K,L,M,O→P). **P-inv-28 belt FIRES THIS TRANCHE.**
  Named terminal home: value.js P VJ-L1 (S8) + VJ-L3 (S9). P.W11 WeakMap is the kf-internal
  P-inv-28 exit for S8 if VJ-L1 slips. No 5th carry without a terminal disposition.
- **DM-7** keyframes-vue — chronicity 4 at P (K,L,M,O→P). **P-inv-28 belt FIRES THIS
  TRANCHE.** Named terminal: USER-DOMAIN publish at P.WZ. No 5th carry.
- **DM-1** RF-17 (6-tranche entering P: I,J,K,L,M,O carried in-tree) — HANDOFF to P.W12
  (BC-gated). If BC cut does not ship before P.WZ, the pre-authored contingency KILL
  (deferred-ledger-O.md §6, carried forward below) FIRES. No 7th carry.

---

## §1 — THE FULL LEDGER (all DM rows + S-arms)

### 1a — HANDOFF rows (sibling-gated; tripwires un-fired at P auth)

| Item | Born | P Chronicity | Disposition | Owning P wave | Evidence (file:line) |
|---|---|---|---|---|---|
| **DM-1** RF-17 / GlassDock click-strand interim (`onPlayPointerDown`/`pointerHandled` in `TransportDock.vue`) | I (BLK-8) | **6 (I,J,K,L,M,O→P)** | **HANDOFF → P.W12 (BC-gated consume).** Delete S2 (`pointerHandled`/`onPlayPointerDown`) in ONE atomic commit on the BC cut re-pin. **P-inv-28 (6-tranche, CRITICAL TERMINAL WINDOW).** Pre-authored contingency KILL carries forward (see §6 below); fires only if BC cut absent at P.WZ. | P.W12 | `TransportDock.vue:15,151,196,342,348,358,361,366,373` — `onPlayPointerDown`/`pointerHandled` confirmed PRESENT; `proof:workaround-deletion` S2=PENDING (live); `audit/AUDIT-DIGEST.md F1-chronic:1176` + `F2-defer:1243` |
| **DM-7** keyframes-vue 0.1.0 unpublished | K.W12 | **4 (K,L,M,O→P) — P-inv-28 BELT FIRES** | **HANDOFF (USER-DOMAIN — Mike Babb). P-inv-28 belt active: NO 5th carry.** `proof:keyframes-vue-published` clause (b) RED-by-design (E404). The USER-DOMAIN publish is the P.WZ deploy-unblock precondition. Peer floor bump to `>=5.0.0` (post-5.0.0 cut) before publish. | P.WZ | `packages/keyframes-vue/dist/keyframes-vue.js` PRESENT; `npm show @mkbabb/keyframes-vue` → E404 (2026-06-20); `audit/AUDIT-DIGEST.md F1-chronic:1190` |
| **DM-24** N Stage scene-switcher HANDOFF | N (2026-06-18) | **2 (N,O→P)** | **HANDOFF (BC-gated for the formal unshelf trigger); P.W8 owns the mobile transposition NOW** (CSS scroll-snap carousel — the shelf-driver blocker). The 3D ring on `n-stage-impl` branch has ~3500 LOC; mobile is entirely unbuilt (zero `@media (max-width…)` — verified D6/P audit). P.W8 builds the mobile layer regardless of BC timing. | P.W8 | `n-stage-impl` branch (CarouselDisk.vue, SceneStage.vue, etc.); `audit/AUDIT-DIGEST.md D6-shell-switcher:860` (BLOCKER: zero responsive layout); K5 finding |

### 1b — BUILD-IN rows (kf builds NOW/SOON; no sibling gate)

| Item | Born | P Chronicity | Disposition | Owning P wave | Evidence (file:line) |
|---|---|---|---|---|---|
| **DM-2** GlassControlPoint / `DemoControlPoint` | E | **born E · 9 carries through O · ABSOLUTE FINAL** | **BUILD-IN (O.W5 home; if O.W5 not impl → P.W7 is FINAL).** `DemoControlPoint.vue` over the LIGHT `drag2D` in `demo/@/components/`. O.W5 AUTHORIZED but NOT YET IMPLEMENTED. P.W7 dogfoods it as the easing curve-editor drag handle. **Critical S-clause (D5 lane):** DemoControlPoint MUST construct drag2D with `springOptions:{dampingFraction:1}` (critically damped, no overshoot — the curve-editor precision requirement). **No 10th carry under any scenario.** | P.W7 (requires O.W5 substrate OR builds inline) | `grep -rn 'DemoControlPoint' demo/ src/` → ZERO (2026-06-20); `proof:demo-control-point` absent; `audit/AUDIT-DIGEST.md K4-demo-engine:542` + `D5-easing:824` (critical S-clause) |
| **DM-3** MorphSVG / `fromMorphSVG` | C | **born C · 9 carries through O · ABSOLUTE FINAL** | **BUILD-IN (O.W6 home; if O.W6 not impl → P.W5 is FINAL).** `fromMorphSVG` over value.js 1.0.2 `PathGeometry` (`dist/transform/path.d.ts:36-67` — confirmed published). P.W5 dogfoods it in the demo fleet morph scene. **No 10th carry under any scenario.** | P.W5 (requires O.W6 substrate OR builds inline) | `grep -rn 'fromMorphSVG' src/animation/` → ZERO; `ls scripts/proof-morphsvg-consume.mjs` → ABSENT; `node_modules/@mkbabb/value.js/dist/transform/path.d.ts:36-67` PRESENT; `audit/AUDIT-DIGEST.md K5-defer-O:587` |

### 1c — FOLD-LANDED rows (DONE on the post-consume master; re-verify GREEN on P dist)

| Item | Born | Chronicity | Disposition | Re-verify gate | Evidence (file:line) |
|---|---|---|---|---|---|
| **DM-4** PT-2 packrat soundness | E | **FOLD-LANDED (FIX per D4 + parse-that A.W2)** | **CORRECTED from M KILL disposition.** parse-that 0.11.0 WDM fix. | `proof:packrat-sound` GREEN re-run on P dist | `M-RECONCILIATION.md:128-168`; GREEN (live 2026-06-20) |
| **DM-6** true-CSS-parity P0 crashes | K | **FOLD-LANDED** (value.js 1.0.x; css-parity GREEN) | **FOLD-LANDED.** | `proof:css-parity` 8/8 GREEN re-run on P dist | `audit/AUDIT-DIGEST.md F1-chronic:x`; GREEN (live 2026-06-20) |
| **DM-17, DM-18, DM-19, DM-25** | L-M | **FOLD-LANDED** per O.W2 intakes | **FOLD-LANDED.** | respective gates GREEN | per `deferred-ledger-O.md §1c` |

### 1d — USER-DOMAIN rows

| Item | Born | P Chronicity | Disposition | Owning P wave | Evidence (file:line) |
|---|---|---|---|---|---|
| **DM-16** 5.0.0 version cut | L.W8 | **3 (L,M,O→P)** | **USER-DOMAIN (Mike Babb). Rides O.WZ; P inherits.** FOUR breaking changes confirmed; `proof:changelog-5.0.0` ABSENT (born-RED). | O.WZ → P.WZ inherits if slipped | `engine.ts:1192`; `timeline.ts:163,209`; `animations.ts:133`; `audit/AUDIT-DIGEST.md F2-defer:1254` |
| **DM-20** deploy round-trip not observed | L.WZ | **3 (L,M,O→P)** | **USER-DOMAIN + BAND-Z.** Observed as live-byte equality at each cut. | O.WZ → P.WZ inherits | `ci.yml:1595-1596` |

### 1e — VERIFY-ONLY / RE-AFFIRM rows (terminated chronics; re-verify on P dist)

| Item | Born | P Chronicity | Disposition | Re-verify gate |
|---|---|---|---|---|
| **DM-8** Lighthouse floors | B-era | 4 (L,M,O,P) | **VERIFY-ONLY** | `proof:lighthouse-mobile` `KF_REQUIRE_LH=1` on P dist |
| **DM-9** CH-1/B7 specular sheen | D(D14)→H | 7 (D,H,I,K,L,M,O→P) | **RE-AFFIRM** | `proof:specular-absent-at-rest` GREEN; re-verify on P dist |
| **DM-10** CH-2 typography | D(D7)→I | 8 (D,I,J,K,L,M,O,P; TERMINATED) | **VERIFY-ONLY** | `proof:font-census` GREEN; re-run on P dist |
| **DM-11** CH-3 mobile chronic | D(D10) | 9 (D,H,I,J,K,L,M,O,P; TERMINATED) | **VERIFY-ONLY** | `proof:spring-slider-continuous` + `proof:subject-animates` GREEN; re-run on P dist |
| **DM-12** CH-4 dock | D(D5/D9) | 7 (D,H,I,K,L,M,O→P) | **RE-AFFIRM** | `proof:perf-frame-budget` GREEN; re-verify on P dist |
| **DM-13** CH-5 empty-value crash | A(W0)→H | 7 (A,H,I,K,L,M,O→P) | **VERIFY-ONLY** | `proof:engine-no-throw-on-play` GREEN; re-run on P dist |
| **DM-14** CH-6 DFA suspend crash | H | 6 (H,I,K,L,M,O→P) | **VERIFY-ONLY** | `proof:fsm-suspend-resume-live` GREEN; born-RED provenance documented |
| **DM-15** scene-control-dfa | I (post-close) | 6 (I,J,K,L,M,O→P) | **VERIFY-ONLY** | `proof:control-surface-single-writer` GREEN; re-verify on P dist |

### 1f — NET-NEW M items inherited (DM-21..DM-23; status from O)

| Item | Born | P Chronicity | Disposition | Owning P wave | Evidence |
|---|---|---|---|---|---|
| **DM-21** `@property` drops from `compileToCSS` | L (mis-fixed) | **3 (L,M,O→P)** | **Band-B-fold NOW** (O.W3 chartered but NOT YET IMPLEMENTED; P.W9 inherits if O.W3 unexecuted). `proof:replay-equality` `@property` clause born-RED today. | P.W9 (if O.W3 not executed) | `src/animation/frame-compiler.ts:128`; `audit/AUDIT-DIGEST.md F1-chronic:1196` |
| **DM-22** named-selector frames → NaN-always-active | L (L.W1 S4 miss) | **3 (L,M,O→P)** | **Band-B-fold NOW** (O.W3 chartered; `NAMED_SELECTOR_NO_TIMELINE` typed at `errors.ts:46` but NEVER thrown; `utils.ts:398` → NaN frame-time). Born-RED gate: `proof:named-selector-no-nan`. P.W9 inherits if O.W3 unexecuted. | P.W9 (if O.W3 not executed) | `src/animation/utils.ts:398`; `audit/AUDIT-DIGEST.md X4-correctness:1080` |
| **DM-23** gate apparatus over-engineered | L (owner-flag) | **3 (L,M,O→P)** | **Band-A transposition** (O.W1/O.W2 chartered; `proof:lint-tier` + vitest-browser runner; P.W1 inherits if O.W1/W2 not executed). | P.W1 (if O.W1/W2 not executed) | `grep -c waitForTimeout scripts/*.mjs` → 276; `audit/AUDIT-DIGEST.md K5-defer-O:598` |

---

## §2 — THE WORKAROUND ARMS (S1–S9) WITH CORRECTED TRIPWIRES

`proof:workaround-deletion` tracks these arms in a three-state model:
`GREEN` (present=false) | `PENDING` (present=true, sibling=unpublished OR api-absent) |
`RED` (present=true, sibling=published + api-present → deletion owed).

**Live state at P auth (2026-06-20):**
S7=GREEN · S1=**FALSE RED** (published but guard ABSENT) · S2=PENDING-actionable (content-present
probe passes; version re-pin owed) · S8=PENDING · S9=PENDING.

**S1 FALSE-RED EXPLANATION (P audit F1/K5 critical finding):** The O DO-2 retarget of S1 from
`glass-ui@4.1.0` version probe to a conditional-guard content-present probe was authored in
deferred-ledger-O.md but NEVER EXECUTED in `proof-workaround-deletion.mjs`. The live script
still uses the version probe — which shows RED (4.1.0 IS published). But glass-ui 4.1.0
`SegmentedTabs.vue:406` STILL emits `:aria-orientation` unconditionally on `role=group`
(confirmed K5 lane: `'aria-orientation.*tablist'` absent from 4.1.0 tabs.js). **Deleting S1
on the current 4.1.0 would leave kf emitting non-ARIA-conformant markup.** P.W12 MUST
retarget the S1 tripwire before any deletion.

| Arm | Born | P Chronicity | What it witnesses | CORRECTED Tripwire | Delete target | P wave | Evidence |
|---|---|---|---|---|---|---|---|
| **S1** aria-orientation suppress | K | **4 (K,L,M,O→P) — P-inv-28 belt** | `:aria-orientation="undefined"` in `SpringSidebar.vue:43` + `AnimationControls.vue:72` | **glass-ui BC cut + the `SegmentedTabs.vue` `role=group` conditional-guard SFC fix landing.** NOT 4.1.0 version number (the guard is ABSENT from 4.1.0 — this is the corrected F1 over-claim). BC must author a net-new SFC wave guarding `:aria-orientation` to tablist-only. S1 tripwire must be retargeted to: `grep -q 'aria-orientation.*tablist\|aria-orientation.*role' dist/tabs.js` (content-present probe, not version). **P.W12 must execute the O.W2 DO-2 retarget that was never applied.** | `SpringSidebar.vue:43` + `AnimationControls.vue:72` | P.W12 (BC SFC guard) | `glass-ui/tabs.js` (4.1.0) unconditional; `audit/AUDIT-DIGEST.md F1-chronic:1175` (S1 FALSE RED documented) + K5:591 |
| **S2** RF-17 `onPlayPointerDown`/`pointerHandled` | I | **6 (I,J,K,L,M,O→P) — CRITICAL** | `pointerHandled\|onPlayPointerDown` in `TransportDock.vue` | **glass-ui BC cut re-pin** (content-present probe: `grep 'useDockClickIntegrity' node_modules/@mkbabb/glass-ui/dist/dock.js` — confirmed PRESENT in 4.0.1 and 4.1.0). S2 IS actionable on the BC cut re-pin. Pre-deletion: re-verify the BC-cut buttery dock eliminates the crossfade-strand root. | `TransportDock.vue` `pointerHandled`/`onPlayPointerDown` lines | P.W12 (BC-gated) | `dock.js:534` `useDockClickIntegrity` confirmed; `audit/AUDIT-DIGEST.md F1-chronic:1175` |
| **S7** `linear()` flat-comma regex | K | **GREEN (FIRED M consume)** | `timingFunction.replace` flat-comma fold | value.js VJ-L2 `linearStopsToCSS` — FIRED (value.js 1.0.0) | DELETED (M.W9) | — | GREEN |
| **S8** FN_NAME Symbol sidechannel | K | **4 (K,L,M,O→P) — P-inv-28 belt FIRES** | `FN_NAME\|Symbol("kf\.` in `src/animation/utils.ts:45-57` (7 sites) | **value.js P shipping VJ-L1 `flatLeaf` provenance API** — probed as `"fnName" in new ValueUnit(0,'px') === true`. **P-inv-28 belt active at chronicity 4.** P.W11 WeakMap fallback is the kf-internal early exit: replaces Symbol with `WeakMap<ValueUnit,string>` — clone-restamp ceremony STAYS (WeakMap does not survive clone()); strictly inferior to VJ-L1 but P-inv-28-compliant for THIS tranche. | `utils.ts:45-57` FN_NAME block | O.W16 (VJ-L1 publish arm) · P.W11 (WeakMap arm) | `utils.ts:45`; `audit/AUDIT-DIGEST.md X4-correctness:1086` + `K5-defer-O:611` (WeakMap fallback spec) |
| **S9** direct `@mkbabb/parse-that` import | K | **4 (K,L,M,O→P) — P-inv-28 belt FIRES** | `from "@mkbabb/parse-that"` in `utils.ts:1` + `package.json` production dep | **value.js P shipping VJ-L3 `parseCSSSubValue` helper** — probed as `"parseCSSSubValue" in vjs === true`. Delete: `utils.ts:1` import + `package.json` dep + two `as any` casts in ONE atomic commit. P.W10 W96 boundary scan (born-RED on `utils.ts:1` today) is the structural gate that bites even if VJ-L3 slips. **No fallback exists for S9** (kf needs value.js's CSS sub-value grammar; cannot be kf-internal). | `utils.ts:1` import + `package.json:215` | O.W16 (VJ-L3 publish arm) · P.W10 W96 scan (structural guard) | `utils.ts:1`; `package.json:215`; `audit/AUDIT-DIGEST.md X4-correctness:1089` |

---

## §3 — NET-NEW P FINDINGS (the P re-audit, 2026-06-20)

| Item | Born | Disposition | Owning P wave | Evidence |
|---|---|---|---|---|
| **DP-1** S1 false-RED tripwire + S2 NOW-deletable verdict | P re-audit | **FOLD → P.W12.** S1 tripwire MUST be retargeted to content-present probe (NOT version number). S2 IS deletable on BC cut re-pin. | P.W12 | `audit/AUDIT-DIGEST.md F1-chronic:1175`; K5:591; `glass-ui/tabs.js:306` (4.1.0) unconditional |
| **DP-2** codegen-consume (P.W4) GATED on parse-that B + value.js P | P re-audit | **HANDOFF → parse-that B.W3 → value.js P → kf P.W4.** The kf-side born-RED gate (`proof:codegen-consume`) is authored NOW (born-RED: codegen parser absent); GREEN only after sibling pipeline ships. `codegen-consume-decision.json` is the ADOPT/KILL verdict record. | P.W4 | `audit/AUDIT-DIGEST.md CONSTITUTION §4`; P4-codegen-span:320; X2-novel-triumvirate:999 |
| **DP-3** demo-fleet unbuilt items (spring heatmap; amiga drag2D transpose; easing hero handles; square velocity-tilt) | P re-audit | **FOLD → P Bands B/C.** Each has a named wave and born-RED gate. Spring heatmap → P.W6; amiga drag2D → P.W5; easing hero handles → P.W7; square → P.W6. | P.W5/W6/W7 | `audit/AUDIT-DIGEST.md D1-D5 lanes`; novel ideas per scene |
| **DP-4** mobile N-Stage entirely unbuilt | P re-audit | **FOLD → P.W8.** CSS scroll-snap transposition (not a patch). `proof:n-stage-mobile` born-RED (zero scroll-snap on 390px emulated). | P.W8 | `audit/AUDIT-DIGEST.md D6-shell-switcher:864`; `n-stage-impl` `grep -c max-width CarouselDisk.vue` → 0 |
| **DP-5** VJ-L1 WeakMap early-cure (S8 P-inv-28 belt exit) | P re-audit | **FOLD → P.W11.** WeakMap replaces FN_NAME Symbol; clone-restamp ceremony STAYS. P-inv-28-compliant kf-internal exit for S8 if value.js P slips. Does NOT retire S8 tripwire (S8=GREEN only on VJ-L1 api-present). | P.W11 | `audit/AUDIT-DIGEST.md X4-correctness:1115`; K5:609 (WeakMap spec) |
| **DP-6** leaves.ts BUNDLE-EXTERNALIZATION TRAP (F4 lane) | P re-audit | **FOLD → P.W10.** O.md:70's "import from `@mkbabb/value.js/math`" would RED `proof:boundary` (subpath specifier banned in LIGHT source). P.W10 authors W97 math-subpath-clean clause first; then externalizes as a bundle dep, not a src import. | P.W10 | `audit/AUDIT-DIGEST.md F4-precept:1325`; O.md:70 (the self-contradicting claim) |

---

## §4 — P-INVARIANT-28 ROLL-UP (the P mandatory-exit roster)

| Item | P chronicity | Exit form | Status |
|---|---|---|---|
| **DM-2** GlassControlPoint (born E) | **9 carries through O · ABSOLUTE FINAL** | BUILD-IN O.W5/P.W7 — `DemoControlPoint` over LIGHT `drag2D` (critically damped spring required); no 10th carry | O.W5 chartered; if not impl → P.W7 FINAL |
| **DM-3** MorphSVG (born C) | **9 carries through O · ABSOLUTE FINAL** | BUILD-IN O.W6/P.W5 — `fromMorphSVG` over published `PathGeometry`; no 10th carry | O.W6 chartered; if not impl → P.W5 FINAL |
| **DM-1** RF-17 | **6** | HANDOFF P.W12 (BC-gated) — no 7th carry; contingency KILL record carries | CRITICAL terminal window |
| **DM-5 S1** aria-orientation | **4** | HANDOFF P.W12 (BC SFC guard wave); P.W12 retargets tripwire first | P-inv-28 belt at 4 |
| **DM-5 S8** FN_NAME | **4** | HANDOFF O.W16 (VJ-L1); P.W11 WeakMap is kf-internal P-inv-28 exit | P-inv-28 belt FIRES THIS TRANCHE |
| **DM-5 S9** parse-that import | **4** | HANDOFF O.W16 (VJ-L3); P.W10 W96 scan is structural guard | P-inv-28 belt FIRES THIS TRANCHE |
| **DM-7** keyframes-vue | **4** | USER-DOMAIN P.WZ; NO 5th carry | P-inv-28 belt FIRES THIS TRANCHE |
| **DM-9** CH-1 specular | 7 | VERIFY-ONLY-TERMINATED: `proof:specular-absent-at-rest` GREEN | P-inv-28 satisfied |
| **DM-10** CH-2 typography | 8 | VERIFY-ONLY-TERMINATED: `proof:font-census` GREEN | P-inv-28 satisfied |
| **DM-11** CH-3 mobile | 9 | VERIFY-ONLY-TERMINATED: `proof:spring-slider-continuous` + `proof:subject-animates` GREEN | P-inv-28 satisfied |
| **DM-12** CH-4 dock | 7 | VERIFY-ONLY-TERMINATED: `proof:perf-frame-budget` GREEN | P-inv-28 satisfied |
| **DM-13** CH-5 empty-value | 7 | VERIFY-ONLY-TERMINATED: `proof:engine-no-throw-on-play` GREEN | P-inv-28 satisfied |
| **DM-14** CH-6 DFA suspend | 6 | VERIFY-ONLY-TERMINATED: `proof:fsm-suspend-resume-live` GREEN | P-inv-28 satisfied |
| **DM-15** scene-control-dfa | 6 | VERIFY-ONLY-TERMINATED: `proof:control-surface-single-writer` GREEN | P-inv-28 satisfied |

**DM-5 S8, S9, and DM-7 are all at chronicity 4 — the P-inv-28 belt fires THIS TRANCHE for
all three.** Named terminal homes exist for each (value.js P VJ-L1/VJ-L3 for S8/S9; USER-DOMAIN
publish for DM-7). P.W11 WeakMap is the kf-internal S8 exit if VJ-L1 slips. No 5th carry under
any scenario.

---

## §5 — THE P BORN-RED GATES FOR EACH ITEM

| Item | Gate | Born-RED witness today | GREEN condition |
|---|---|---|---|
| DM-2 GlassControlPoint | `proof:demo-control-point` (from O.W5) | `DemoControlPoint.vue` absent; `grep -rn 'DemoControlPoint' demo/` → ZERO | Component present; live-drag via `drag2D` with `dampingFraction:1` emits updated `(x,y)` |
| DM-3 MorphSVG | `proof:morphsvg-consume` (from O.W6) | `fromMorphSVG` absent; THROWS | `fromMorphSVG` exported; mid-t sample DISTINCT from both endpoints |
| DM-22 NaN-frame (DM-22 + DM-21) | `proof:named-selector-no-nan` (from O.W3) + `proof:replay-equality` extended | `utils.ts:398` NaN multiply; `NAMED_SELECTOR_NO_TIMELINE` never thrown | throw fires at parse OR frame-times NOT NaN; `@property` wired in compileToCSS |
| DM-23 apparatus | `proof:lint-tier` (from O.W1) | eslint absent; `find test -name '*.browser.test.ts'` → ZERO | eslint GREEN; ≥3 browser tests migrated |
| DM-5 S1 (FALSE RED) | `proof:workaround-deletion` S1 arm — RETARGETED to content-present guard probe | **FALSE RED today** (version probe fires; guard ABSENT from 4.1.0) | Retarget to `grep 'aria-orientation.*tablist'` in installed dist; arm transitions to PENDING until BC SFC guard wave ships |
| DM-5 S2 (NOW-deletable) | `proof:workaround-deletion` S2 arm — content-present probe | S2=PENDING (BC cut re-pin not yet done; `useDockClickIntegrity` IS in dist) | S2=GREEN after BC cut re-pin + atomic deletion of `TransportDock.vue` sites |
| DM-5 S8 FN_NAME | `proof:workaround-deletion` S8 arm + `proof:decomposition` | S8=PENDING (`flatLeaf in vjs === false`); `FN_NAME` grep → 7 hits | P.W11: S8 arm stays PENDING (WeakMap doesn't retire the tripwire); `proof:decomposition` GREEN (engine.ts ≤900L) |
| DM-5 S9 parse-that | `proof:workaround-deletion` S9 arm + `proof:boundary` W96 scan | S9=PENDING; W96 RED on `utils.ts:1` | S9=GREEN + W96 GREEN (on VJ-L3 publish + kf consume) |
| DM-24 N Stage mobile | `proof:n-stage-mobile` (NEW — P.W8) | Zero `@media (max-width…)` in CarouselDisk.vue; no scroll-snap on 390px | Scroll-snap carousel renders on phone-narrow; `@supports` gated; VT wired |
| DP-2 codegen-consume | `proof:codegen-consume` (NEW — P.W4) | Codegen parser absent; no `codegen-consume-decision.json` | `codegen-consume-decision.json` ADOPT record; kf bench shows ≥1.5× vs combinator |
| DP-5 VJ-L1 WeakMap | `proof:decomposition` (from O.W7) | `engine.ts` > LIBRARY_CEILING (1400L today) | `engine.ts` ≤900L (WeakMap cure + playback-machine split) |
| DP-6 leaves.ts TRAP | `proof:boundary` W97 `math-subpath-clean` clause (NEW — P.W10) | `internal/leaves.ts` PRESENT; `@mkbabb/value.js/math` NOT bundle-external in LIGHT build | W97 GREEN (math subpath confirmed grammar-free; bundle-external entry declared in `vite.config.ts`) |

---

## §6 — KILL RECORD (standing, carried from O + the P reckoning)

The O kills (W100 incremental-parse, `generate()`, DL-L7..DL-L13) carry as P's standing
anti-charter (non-re-litigable). The DM-4 KILL was **overturned to FIX** by D4 —
carried from O.

> **DM-4 KILL VOID — superseded by FIX (D4 + parse-that A.W2).** See deferred-ledger-O.md §6.

---

### DM-1 RF-17 — PRE-AUTHORED CONTINGENCY KILL (carries from O)

> **PRE-AUTHORED CONTINGENCY KILL (a standing, self-voiding record — carried from
> `docs/tranches/O/audit/deferred-ledger-O.md §6` unchanged).**
>
> **TRIGGER (falsifiable, AND-joined):** at the P.WZ close-gate, `proof:workaround-deletion`
> S2 still PENDING **AND** no glass-ui BC cut bearing `useDockClickIntegrity` is published.
>
> **DISPOSITION:** reclassify the S2 dock-pointer interim from "workaround pending sibling
> fix" to a DECLARED kf-internal input-integrity seam — annotated with a comment citing the
> unshipped glass-ui dependency + this KILL, and allow-listed in `proof:workaround-deletion`
> so S2 reports GREEN-as-declared-seam (not PENDING-against-a-phantom).
>
> **VOID CONDITION:** this KILL is VOID the instant glass-ui publishes a cut whose
> `useDockClickIntegrity` eliminates the crossfade-strand root — S2 reverts to the normal
> atomic delete-on-re-pin (the P.W12 exit).
>
> **RATIONALE:** the interim is correct defensive code curing a real pointer-swallow strand
> observed I→M; quarantining it as a declared seam is the honest no-workaround-compliant
> terminal when the sibling does not ship.
>
> **Cross-ref:** DM-1 row (§1a); `proof:workaround-deletion` S2 arm (§2); §4 P-inv-28 roll-up
> DM-1 row; `deferred-ledger-O.md §6` (the original pre-authoring).

---

## §7 — THE `proof:chronic-closure` SUBSTRATE TRANSITION

At P.WZ the orchestrator performs the atomic re-point (the O.WZ→O precedent):

1. Verify O.WZ executed its re-point (`CHRONIC_LEDGER` → `docs/tranches/O/PROGRESS.md`).
2. `scripts/proof-chronic-closure.mjs:114` `CHRONIC_LEDGER` changes from
   `docs/tranches/O/PROGRESS.md` to `docs/tranches/P/PROGRESS.md`.
3. Fix `LEDGER_LABEL` accordingly in the same commit.
4. The non-vacuity planted-probe: three deliberately-malformed P-ledger rows (a FOLD citing
   a source-shape gate as a runtime oracle; a HANDOFF targeting a phantom version; a ≥4-tranche
   bare BOOK) RED on all three clause shapes BEFORE being removed so the clean P ledger GREENs.
5. `proof:chronic-closure` runs → exit 0 on the clean ledger.

---

## §8 — DISPOSITION SUMMARY

| Tag | Count | Rows |
|---|---|---|
| **HANDOFF (sibling-gated, un-fired)** | 4 | DM-1 (BC, 6-tranche CRITICAL) · DM-7 (USER-DOMAIN, 4-tranche belt) · DM-24 (BC/N-Stage) · DP-2 (codegen-consume, parse-that B + value.js P) |
| **BUILD-IN (ABSOLUTE terminal — O or P final)** | 2 | DM-2 (9-tranche, O.W5/P.W7) · DM-3 (9-tranche, O.W6/P.W5) |
| **USER-DOMAIN** | 2 | DM-16 (5.0.0 cut) · DM-20 (deploy round-trip) |
| **FOLD-LANDED** | 7 | DM-4 · DM-5 S7 · DM-6 · DM-17 · DM-18 · DM-19 · DM-25 |
| **VERIFY-ONLY / RE-AFFIRM (terminated chronics)** | 8 | DM-8 … DM-15 |
| **NET-NEW P obligations (FOLD → named wave home)** | 6 | DP-1 (S1 false-RED + S2 now-deletable, P.W12) · DP-2 (codegen-consume, P.W4) · DP-3 (demo-fleet, P.W5-W7) · DP-4 (mobile N-Stage, P.W8) · DP-5 (VJ-L1 WeakMap, P.W11) · DP-6 (leaves.ts TRAP, P.W10) |

**P-INVARIANT-28 CLOSURE ASSERTION (P).** Every row carries (a) a tag, (b) a named owning
P wave, (c) a named tripwire or terminal disposition. **Zero rows are bare BOOKs.**
DM-2 (born E) and DM-3 (born C) are at 9 carries — ABSOLUTE FINAL (O.W5/P.W7 and O.W6/P.W5
respectively). DM-1 (6-tranche) has a named terminal window (P.W12; contingency KILL carries).
DM-5 S8/S9 and DM-7 are all at 4-tranche P-inv-28 belt — named terminal homes enforced THIS
TRANCHE. The VERIFY-ONLY-TERMINATED rows (DM-8..DM-15) satisfy P-inv-28 via born-RED oracle
provenance.

---

## §9 — EVIDENCE INDEX (re-verified against tranche-o-dev + P audit 2026-06-20)

- `docs/tranches/O/audit/deferred-ledger-O.md` — the primary O substrate (DM-1..DM-25 + DO-*)
- `docs/tranches/O/PROGRESS.md §2` — the O open-deferrals board (parallel source)
- `docs/tranches/P/audit/AUDIT-DIGEST.md` — F1 (chronic state), F2 (deferred plan), K5
  (O-as-unimplemented), X4 (correctness), D5 (easing drag2D critical S-clause), D6 (mobile
  unbuilt), CONSTITUTION §4 (codegen spine)
- `scripts/proof-workaround-deletion.mjs` — S1..S9 arm specs (S7 GREEN; S1 FALSE RED;
  S2 PENDING-actionable; S8/S9 PENDING on api-present probe)
- `glass-ui/dist/tabs.js` (4.1.0) — `:aria-orientation` unconditional at line 306 (S1 FALSE RED
  evidence; the guard is ABSENT from 4.1.0)
- `src/animation/utils.ts:1,45-57,229,236` — S9 direct import + S8 FN_NAME sidechannel
- `src/animation/frame-compiler.ts:418` — O(N²) findIndex (reconcileVars, DM-21 substrate)
- `src/animation/utils.ts:417` — per-frame Record alloc (transformTargetsStyle, P.W2)
- `src/animation/internal/leaves.ts` — duplicates clamp/scale/lerp/lerpArray (DP-6 TRAP)
- `n-stage-impl` branch — CarouselDisk.vue (zero max-width; mobile unbuilt — DP-4)
- `node_modules/@mkbabb/value.js/dist/transform/path.d.ts:36-67` — `PathGeometry` PRESENT
  (DM-3 build-in substrate, already published)
- Registry probes (live 2026-06-20): glass-ui `4.1.0` · value.js `1.0.2` · parse-that
  `0.11.0` · keyframes-vue E404. VJ-L1 `flatLeaf in vjs === false`; VJ-L3
  `parseCSSSubValue in vjs === false`. S1 FALSE RED confirmed (4.1.0 guard absent).
