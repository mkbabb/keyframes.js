# Tranche O — THE CONSOLIDATED DEFERRED / CHRONIC LEDGER (M → O)

**Lane:** L2-deferred-ledger · **Date authored:** 2026-06-19 · **Tree at author:**
`n-stage-impl` / master `aef3ef3` (the M-consumed state; O is DEVELOPMENT — docs only;
impl opens on explicit owner authorization; inv-16 holds throughout per `O.md:8`).

**Mandate.** THE M → O carry-forward ledger. Every deferral gets a row: the DM-1..DM-25
rows from `docs/tranches/M/audit/deferred-ledger-M.md` carried forward with UPDATED
dispositions reflecting the post-consume master state (`aef3ef3`), the O wave assignments
from `O.md §3`, the S1–S9 workaround arms with CORRECTED tripwires, and the net-new O
findings (VJ-L1/L3 dispatches, the aria misidentification, the no-legacy alias drops).

**The CORRECTED M-state facts this ledger carries (the O re-audit findings):**

1. **DM-4 KILL → FIX/FOLD-LANDED.** The M ledger says KILL (packrat unsoundness off
   consumed path). Per `M-RECONCILIATION.md §4`, the owner issued a D4 verdict:
   parse-that Tranche A.W2 shipped the WDM `(id,offset)` key FIX (parse-that 0.11.0).
   `proof:packrat-sound` is GREEN on the live tree. Disposition: **FOLD-LANDED (FIX)**
   — `audit/AUDIT-DIGEST.md C13`.
2. **DM-5 S7 FIRED and GREEN.** The M ledger claims "0 GREEN / 5 PENDING." The live
   tree shows 1 GREEN (S7 — `linearStopsToCSS` regex retired on value.js 1.0.0 consume).
   The corrected count entering O is **1 GREEN / 4 PENDING** (S1, S2, S8, S9).
3. **DM-6 tripwire FIRED.** M says HANDOFF/UN-FIRED. `proof:css-parity` is GREEN on the
   live tree (value.js 1.0.x shipped the P0 crash fixes). Disposition: **FOLD-LANDED**.
   `audit/AUDIT-DIGEST.md C13`.
4. **DM-17 RESOLVED-BY-KILL → RESOLVED-BY-FIX.** DM-4 exit is FIX (D4 + A.W2), not
   KILL; DM-17 inherits the correction. `audit/AUDIT-DIGEST.md C13`.
5. **DM-24 never inserted.** `M-RECONCILIATION.md §7` specified adding DM-24 (N Stage
   HANDOFF) to the live ledger, but neither `deferred-ledger-M.md` nor `PROGRESS.md §D`
   carry the row. This ledger adds it. `audit/AUDIT-DIGEST.md F26/F27`.
6. **DM-25 never inserted.** Same — `M-RECONCILIATION.md §9` specified DM-25
   (consume-bundle gate). `proof:consume-bundle` is already GREEN per the M consume.
   This ledger adds it as **FOLD-LANDED** (`audit/AUDIT-DIGEST.md F26`).
7. **S1/S2 tripwire version: BB 4.1.0 → BC cut.** The M ledger gates S1/S2 on
   `glass-ui@4.1.0`. BB closed at 4.0.1 (never published 4.1.0). The correct tripwire
   is the **glass-ui BC cut** (version USER-DOMAIN, `≥4.1.0` as placeholder until BC
   publishes). `audit/AUDIT-DIGEST.md A2-bc-kf-seam`.
8. **S1 aria misidentification.** KF-BC.md ASK#2 was marked "CONFIRMED — emitting a
   real axis-derived value." The O re-audit found `SegmentedTabs.vue:406` STILL emits
   `:aria-orientation` unconditionally, including on `role=group` (ARIA 1.2 disallows it
   on that role). No BC wave is byte-fenced to fix this — a new SFC wave in BC is
   required. O.W11 dispatches the corrected ask; S1 delete gates on that fix shipping,
   NOT merely on BC cut version. `audit/AUDIT-DIGEST.md A4-bc-aria-ax`.
9. **S8/S9 sibling version stale.** The M gate checks `@mkbabb/value.js@0.14.0` but
   0.14.0 is already published without VJ-L1/VJ-L3. The three-state model is ambiguous.
   O retargets the tripwire to the API-present probe (`flatLeaf in vjs` / `parseCSSSubValue
   in vjs`) rather than a version string. `audit/AUDIT-DIGEST.md B10-vjl1-vjl3`.

---

## §0 — THE TAG SET (terminal dispositions)

Carries from M §0 with one addition:

| Tag | Meaning | Exit mechanism |
|---|---|---|
| **FOLD-LANDED** | already done on the post-consume master; gate GREEN | re-verify GREEN on O dist |
| **BUILD-IN** | kf builds the feature kf-side NOW; no sibling gate | born-RED kf gate, GREENed by the kf build |
| **HANDOFF** | sibling-gated; tripwire un-fired | born-RED kf consume-gate, STAGED-PENDING until sibling publishes |
| **KILL** | off-consumed-path; non-re-litigable | KILL record (named spec) |
| **DISPATCH** | a cross-repo ask authored in kf (inv-16); wave home named | the sibling receives + schedules |
| **VERIFY-ONLY** | terminated chronic; re-verify GREEN per dist | GREEN gate re-run |
| **USER-DOMAIN** | requires owner authorization | owner acts |

**P-invariant-28 reckoning (the O mandate):**

- DM-2 GlassControlPoint (born E) — **7 carries through M · O closes the forbidden 8th
  carry via BUILD-IN** (O.W5). No further ride.
- DM-3 MorphSVG (born C) — **7 carries through M · O closes the forbidden 8th carry
  via BUILD-IN** (O.W6). No further ride.
- DM-5 S8/S9 — chronicity 3 at O (K, L, M → O). P-inv-28 does not mandate exit at 3,
  but the no-perpetual-punts precept demands a NAMED terminal home. Named: value.js P
  (VJ-L1 + VJ-L3). P-inv-28 belt fires at chronicity 4 (kf-P) if value.js P slips.
- DM-1 RF-17 (5-tranche entering O: I,J,K,L,M carried in-tree) — HANDOFF to O.W12
  (BC-gated). If BC cut does not ship before O.WZ, the owner must issue a reasoned KILL
  or re-negotiate — no 6th carry under no-workaround.

---

## §1 — THE FULL LEDGER (all DM rows + S-arms)

### 1a — HANDOFF rows (sibling-gated; tripwires un-fired at O auth)

| Item | Born | O Chronicity | Disposition | Owning O wave | Evidence (file:line) |
|---|---|---|---|---|---|
| **DM-1** RF-17 / GlassDock click-strand interim (`onPlayPointerDown`/`pointerHandled` in `TransportDock.vue`) | I (BLK-8) | **5 (I,J,K,L,M→O)** | **HANDOFF → O.W12 (BC-gated consume).** Delete S2 (`pointerHandled`/`onPlayPointerDown`) in ONE atomic commit on the BC cut. P-inv-28 belt ACTIVE (4-tranche at M; 5-tranche at O). If BC cut does not ship before O.WZ, owner must KILL or re-negotiate — no 6th carry. **CORRECTED TRIPWIRE:** glass-ui BC cut (not BB 4.1.0 — BB closed at 4.0.1, never published 4.1.0). **PRE-AUTHORED CONTINGENCY KILL on file — see §6 DM-1 RF-17 CONTINGENCY KILL** (fires only if O.WZ S2 STILL PENDING AND no BC cut bearing `useDockClickIntegrity` — VOID the instant BC ships the cure). | O.W12 | `TransportDock.vue:15,151,196,342,348,358,361,366,373` — `onPlayPointerDown`/`pointerHandled` confirmed PRESENT; `proof:workaround-deletion` S2=PENDING (live 2026-06-19); `audit/AUDIT-DIGEST.md A3-bc-dock:64`; `A2-bc-kf-seam:41` (stale 4.1.0 tripwire) |
| **DM-7** keyframes-vue 0.1.0 unpublished | K.W12 | **3 (K,L,M→O)** | **HANDOFF (USER-DOMAIN — Mike Babb).** `proof:keyframes-vue-published` clause (b) RED-by-design; clause (a) artifact GREEN. The USER-DOMAIN publish is the O.WZ deploy-unblock precondition. | O.WZ | `packages/keyframes-vue/dist/keyframes-vue.js` PRESENT; npm shows E404; `audit/AUDIT-DIGEST.md D19-deploy-roundtrip:502` |
| **DM-24** N Stage scene-switcher HANDOFF (**NET-NEW — never inserted into deferred-ledger-M.md; added here per M-RECONCILIATION §7**) | N (2026-06-18) | **1 (N→O)** | **HANDOFF (BC-gated).** N Stage implementation exists on `n-stage-impl` (`SceneStage.vue`, `CarouselDisk.vue`, `StageArrows.vue`, composables/, previews/). Shelved by owner directive (commit `e2375b8`). **CORRECTED TRIPWIRE:** glass-ui BC cut (not `W-DOCK-MORPH-FAMILY` — the BB wave name was contradicted/rebuilt under BC names; the N unshelf fires on the BC cut publish + dock-engine landing). Pre-unshelf: rebase `n-stage-impl` onto O master (11 commits behind; pins pre-constellation stack `^0.13.0`/`^0.9.0`). Scene-select affordance (ASK-3) is kf-owned (kf's ChromeDock composition atop the BC stable dock substrate) — no BC wave authors a scene-select slot. | O.W15 | `docs/tranches/M/M-RECONCILIATION.md:289` (DM-24 spec); `git rev-list ...n-stage-impl --count → 4`; `audit/AUDIT-DIGEST.md F27-n-stage:714`; `A2-bc-kf-seam:43` (ASK-3 silently dropped) |

### 1b — BUILD-IN rows (kf builds NOW; no sibling gate)

| Item | Born | O Chronicity | Disposition | Owning O wave | Evidence (file:line) |
|---|---|---|---|---|---|
| **DM-2** GlassControlPoint / `DemoControlPoint` | E | **born E · 7 carries through M · O closes the forbidden 8th carry via BUILD-IN** | **BUILD-IN (O.W5) — FORBIDDEN 8TH CARRY CLOSED.** `DemoControlPoint.vue` over the LIGHT `drag2D` in `demo/@/components/`. BC confirmed NO to `GlassControlPoint` (`KF-BC.md:75`). Retire `proof:control-point-live`; author `proof:demo-control-point` born-RED on the absent component. P-inv-28 ABSOLUTE terminus: no 9th carry. | O.W5 | `grep -rn 'DemoControlPoint' demo/ src/` → ZERO (2026-06-19); `proof:control-point-live` RED-by-design; `src/animation/index.ts:88` `export { drag, Draggable, drag2D }` LIGHT; `audit/AUDIT-DIGEST.md C13-kf-deferred-ledger:334` + `F25-chronic-deferrals:658` |
| **DM-3** MorphSVG / `fromMorphSVG` | C | **born C · 7 carries through M · O closes the forbidden 8th carry via BUILD-IN** | **BUILD-IN (O.W6) — FORBIDDEN 8TH CARRY CLOSED.** `fromMorphSVG` over value.js 1.0.2 `PathGeometry` (`dist/transform/path.d.ts:36-67` — `getTotalLength`, `getPointAtLength`, `getPointAtT` confirmed exported). Author `proof:morphsvg-consume` born-RED on absent `fromMorphSVG`. No sibling gate. P-inv-28 ABSOLUTE terminus: no 9th carry. | O.W6 | `grep -rn 'fromMorphSVG' src/animation/` → ZERO; `ls scripts/proof-morphsvg-consume.mjs` → ABSENT; `node_modules/@mkbabb/value.js/dist/transform/path.d.ts:36-67` PRESENT; `audit/AUDIT-DIGEST.md C13-kf-deferred-ledger:331` + `F25-chronic-deferrals:661` |

### 1c — FOLD-LANDED rows (DONE on the post-consume master; re-verify GREEN on O dist)

| Item | Born | M Chronicity | Disposition | Re-verify gate | Evidence (file:line) |
|---|---|---|---|---|---|
| **DM-4** PT-2 packrat soundness | E | ~~KILL~~ **FOLD-LANDED (FIX per D4 + parse-that A.W2)** | **CORRECTED from M KILL disposition.** parse-that 0.11.0 A.W2 shipped the WDM `(id,offset)` composite key FIX. `proof:packrat-sound` GREEN. Owner D4 verdict: FIX, not KILL. | `proof:packrat-sound` GREEN re-run on O dist | `M-RECONCILIATION.md:128-168`; `audit/AUDIT-DIGEST.md C13-kf-deferred-ledger:328`; `proof:packrat-sound` GREEN (live 2026-06-19) |
| **DM-6** true-CSS-parity P0 crashes | K | 2 (K,L→M) | **FOLD-LANDED.** value.js 1.0.x shipped the 8/8 P0 crash fixes; `proof:css-parity` GREEN (live 2026-06-19). The IMPL (coordinated grammar totality) is closed. | `proof:css-parity` 8/8 GREEN re-run on O dist | `audit/AUDIT-DIGEST.md C13-kf-deferred-ledger:325`; `scripts/proof-css-parity.mjs` GREEN |
| **DM-17** `proof:packrat-sound` gate absent | L.WZ | 1 (L→M) | **RESOLVED-BY-FIX (corrected from RESOLVED-BY-KILL).** DM-4 exited via FIX (A.W2), not KILL; DM-17 inherits. Gate GREEN on live tree. | `proof:packrat-sound` GREEN | `M-RECONCILIATION.md §4`; `audit/AUDIT-DIGEST.md C13-kf-deferred-ledger:329` |
| **DM-18** `proof:css-parity` gate absent | L.WZ | 1 (L→M) | **RESOLVED (FOLD-LANDED with DM-6).** Gate authored and GREEN. | `proof:css-parity` GREEN | `scripts/proof-css-parity.mjs` PRESENT + GREEN |
| **DM-19** `proof:rf17-net-deletion` name | L.W9 | 1 (L→M) | **CANONICALIZED.** S2 arm of `proof:workaround-deletion` IS the net-deletion oracle (KISS). Name retired; S2 is authoritative. | S2 arm of `proof:workaround-deletion` | `scripts/proof-workaround-deletion.mjs` S2 arm present |
| **DM-25** consume-side bundle gate (`proof:consume-bundle`) (**NET-NEW — never inserted; added here per M-RECONCILIATION §9**) | M re-audit | 0 (net-new) | **FOLD-LANDED.** `proof:consume-bundle` GREEN on the live tree (post-M consume). The gate exists and passes — the dist's `exports` map + `sideEffects:false` are correct. | `proof:consume-bundle` GREEN re-run on O dist | `docs/tranches/M/M-RECONCILIATION.md:338`; `scripts/proof-consume-bundle.mjs` GREEN (live 2026-06-19); `audit/AUDIT-DIGEST.md F26-recent-deferrals:688` |

### 1d — USER-DOMAIN rows

| Item | Born | O Chronicity | Disposition | Owning O wave | Evidence (file:line) |
|---|---|---|---|---|---|
| **DM-16** 5.0.0 version cut | L.W8 | **2 (L,M→O)** | **USER-DOMAIN (Mike Babb).** FOUR breaking changes confirmed (viol-M4): `Animation→KeyframesAnimation` (`engine.ts:1192`), `ScrollTimelineOptions→KeyframesScrollTimelineOptions` (`timeline.ts:163`), `ScrollTimeline→KeyframesScrollTimeline` (`timeline.ts:209`), `presets.flip→flipPreset` (`animations.ts:133`). Plus the multi-color refusal semantic break + the barrel-dogfood flip. `proof:changelog-5.0.0` ABSENT — O.WZ authors it. | O.WZ | `engine.ts:1192`, `timeline.ts:163`, `timeline.ts:209`, `animations.ts:133`; `audit/AUDIT-DIGEST.md F28-prompt-recap:764` |
| **DM-20** deploy round-trip not observed | L.WZ | **2 (L,M→O)** | **USER-DOMAIN + BAND-Z.** Live deploy at M close was MANUAL (`scripts/pages-deploy.sh`); the auto CI→deploy-pages.yml round-trip never fired (two blocking born-RED tripwires: DM-7 + DM-2 in `check-failures`). O.WZ claims the observed round-trip or records what blocked it. | O.WZ | `ci.yml:1595-1596`; `audit/AUDIT-DIGEST.md D19-deploy-roundtrip:490`; M-CONSUME-CLOSE.md |

### 1e — VERIFY-ONLY / RE-AFFIRM rows (terminated chronics; re-verify each new dist)

| Item | Born | O Chronicity | Disposition | Re-verify gate |
|---|---|---|---|---|
| **DM-8** Lighthouse floors | B-era | 3 (L,M→O) | **VERIFY-ONLY** | `proof:lighthouse-mobile` `KF_REQUIRE_LH=1` on O dist (observe-only until O.W14 posture flip, BC-gated) |
| **DM-9** CH-1/B7 specular sheen | D(D14)→H | 6 (D,H,I,K,L,M→O) | **RE-AFFIRM** | `proof:specular-absent-at-rest` GREEN; re-verify on O dist |
| **DM-10** CH-2 typography | D(D7)→I | 7 (D,I,J,K,L,M→O) | **VERIFY-ONLY (TERMINATED)** | `proof:font-census` GREEN; re-run on O dist |
| **DM-11** CH-3 mobile chronic | D(D10) | 8 (D,H,I,J,K,L,M→O) | **VERIFY-ONLY (TERMINATED)** | `proof:spring-slider-continuous` + `proof:subject-animates` GREEN; re-run on O dist |
| **DM-12** CH-4 dock | D(D5/D9) | 6 (D,H,I,K,L,M→O) | **RE-AFFIRM** | `proof:perf-frame-budget` GREEN; re-verify on O dist |
| **DM-13** CH-5 empty-value crash | A(W0)→H | 6 (A,H,I,K,L,M→O) | **VERIFY-ONLY (TERMINATED)** | `proof:engine-no-throw-on-play` GREEN; re-run on O dist |
| **DM-14** CH-6 DFA suspend crash | H | 5 (H,I,K,L,M→O) | **VERIFY-ONLY (TERMINATED)** | `proof:fsm-suspend-resume-live` GREEN; BORN-RED provenance documented |
| **DM-15** scene-control-dfa | I (post-close) | 5 (I,J,K,L,M→O) | **VERIFY-ONLY (TERMINATED)** | `proof:control-surface-single-writer` GREEN; re-verify on O dist |

### 1f — NET-NEW M items (DM-21..DM-23; from M audit; carried into O with updated status)

| Item | Born | O Chronicity | Disposition | Owning O wave | Evidence (file:line) |
|---|---|---|---|---|---|
| **DM-21** `@property` drops from `compileToCSS` | L (mis-fixed) | **2 (L,M→O)** | **Band-B-fold NOW** — `serializeStylesheetItem` published in value.js 1.0.2. `compileToCSS`/`compileChild` must wire `@property` blocks. `proof:replay-equality` `@property` clause born-RED on today's tree. | O.W3 | `src/animation/frame-compiler.ts:128`; `audit/AUDIT-DIGEST.md G30-tranche-O-shape:836` |
| **DM-22** named-selector frames → NaN-always-active | L (L.W1 S4 miss) | **2 (L,M→O)** | **Band-B-fold NOW** — `NAMED_SELECTOR_NO_TIMELINE` typed at `errors.ts:46` but NEVER thrown; `frame-compiler.ts:128` writes supertype, never reads it; `utils.ts:398` → NaN frame-time → always-active. Born-RED gate: `proof:named-selector-no-nan`. | O.W3 | `src/animation/frame-compiler.ts:128`; `src/animation/internal/errors.ts:46`; `src/animation/utils.ts:398`; `audit/AUDIT-DIGEST.md C15-kf-engine:374` |
| **DM-23** gate apparatus over-engineered | L (owner-flag) | **2 (L,M→O)** | **Band-A transposition NOW** — 276 `waitForTimeout` settle-sleeps; 72 cold-Chromium launches per run; serial `&&` chain aborts on first red; no eslint/dep-cruiser. O.W1 (lint tier) + O.W2 (vitest-browser) cure. Born-RED: `proof:lint-tier` absent → exit 1; zero `*.browser.test.ts` → the shared-chromium tier absent. | O.W1, O.W2 | `grep -c waitForTimeout scripts/*.mjs` → 276; `find test -name '*.browser.test.ts'` → ZERO; `audit/AUDIT-DIGEST.md G30-tranche-O-shape:830` |

---

## §2 — THE WORKAROUND ARMS (S1–S9) WITH CORRECTED TRIPWIRES

`proof:workaround-deletion` tracks these arms in a three-state model:
`GREEN` (present=false) | `PENDING` (present=true, sibling=unpublished OR api-absent) | `RED` (present=true, sibling=published + api-present → deletion owed).

**Live state at O auth (2026-06-19):** S7=GREEN · S1,S2,S8,S9=PENDING · S3..S6=N/A.

| Arm | Born | O Chronicity | What it witnesses | CORRECTED Tripwire | Delete target | O wave | Evidence |
|---|---|---|---|---|---|---|---|
| **S1** aria-orientation suppress | K | **3 (K,L,M→O)** | `:aria-orientation="undefined"` in `SpringSidebar.vue:43` + `AnimationControls.vue:72` (BOTH sites — not just `:43` as KF-BC.md misreported) | **glass-ui BC cut + the SegmentedTabs.vue SFC guard landing.** NOT merely the BC version number — S1 must NOT be deleted if BC ships without the `role=group` conditional guard (`:aria-orientation` disallowed on `role=group` per ARIA 1.2; BC.W-TABS-IOS byte-fence forbids it in Band 3; a NEW BC SFC wave required). O.W11 dispatches the corrected ask. | `SpringSidebar.vue:43` + `AnimationControls.vue:72` | O.W12 (BC-gated) | `SegmentedTabs.vue:406` unconditional; `audit/AUDIT-DIGEST.md A4-bc-aria-ax:91`; `A2-bc-kf-seam:37` |
| **S2** RF-17 `onPlayPointerDown`/`pointerHandled` | I | **5 (I,J,K,L,M→O)** | `pointerHandled\|onPlayPointerDown` in `TransportDock.vue` | **glass-ui BC cut.** `useDockClickIntegrity` is live in 4.0.1 dist (confirmed). The stale S2 tripwire in `proof-workaround-deletion.mjs:228` hard-codes `4.1.0` — O retargets to BC-cut published. Pre-deletion: re-verify the BC-cut buttery dock eliminates the crossfade-strand root (run `proof:live-session` S5 motion-path PLAY BEFORE deleting). | `TransportDock.vue` `pointerHandled`/`onPlayPointerDown` lines | O.W12 (BC-gated) | `TransportDock.vue:313-338` K.W1 RE-OBSERVED comment; `audit/AUDIT-DIGEST.md A3-bc-dock:67`; `A2-bc-kf-seam:41` |
| **S7** `linear()` flat-comma regex | K | **GREEN (FIRED M consume)** | `timingFunction.replace` flat-comma fold in `utils.ts` | value.js VJ-L2 `linearStopsToCSS` — FIRED (value.js 1.0.0) | DELETED (M.W9 consume) | — | `audit/AUDIT-DIGEST.md C13-kf-deferred-ledger:322` |
| **S8** FN_NAME Symbol sidechannel | K | **3 (K,L,M→O)** | `FN_NAME\|Symbol("kf\.` in `src/animation/utils.ts:45-57` (7 sites) | **value.js P shipping VJ-L1 `flatLeaf` provenance API** — probed as `"flatLeaf" in vjs === true` (NOT the version string `0.14.0` which is already published without VJ-L1; the api-present probe is the honest oracle). P-inv-28 belt fires at chronicity 4 (kf-P) if value.js P slips. Two-arm fallback if value.js P slips: (a) kf-side WeakMap<ValueUnit,string> populated at flatten time (realm-CLEAN, dissolves the foreign-object-annotation breach, kf-internal-sufficient — BUT does NOT survive ValueUnit.clone() so the clone-restamp ceremony stays, hence VJ-L1 is still strictly preferred); (b) DECLARED spine-edge quarantine (allow-listed in proof:boundary — breach persists but not silent). Both strictly inferior to the value.js-P consume. | `utils.ts:45-57` FN_NAME block | O.W16 (value.js-P-gated) | `utils.ts:45`; `audit/AUDIT-DIGEST.md B10-vjl1-vjl3:237`; `C15-kf-engine:380` |
| **S9** direct `@mkbabb/parse-that` import | K | **3 (K,L,M→O)** | `from "@mkbabb/parse-that"` in `utils.ts:1` + `package.json` production dep | **value.js P shipping VJ-L3 `parseCSSSubValue` helper** — probed as `"parseCSSSubValue" in vjs === true`. Delete: `utils.ts:1` import + `package.json` dep + the two `as any` casts (`utils.ts:229,236`) in ONE atomic commit. Also: delete stale cross-realm comment at `utils.ts:224-228` (single shared module instance confirmed — the cross-realm framing is factually stale). W96 `proof:boundary` parse-that-scan clause added at O.W9 (born-RED on `utils.ts:1` today). P-inv-28 belt fires at chronicity 4 (kf-P) if value.js P slips. Two-arm fallback if value.js P slips: S9 (direct parse-that import) is NOT eliminable without VJ-L3 (kf needs value.js's CSS sub-value grammar); the only fallback is a DECLARED spine-edge quarantine (allow-listed in proof:boundary, breach persists but not silent). Strictly inferior to the value.js-P consume. | `utils.ts:1` import + `package.json:215` | O.W16 (value.js-P-gated) | `utils.ts:1`; `package.json:215`; `audit/AUDIT-DIGEST.md B10-vjl1-vjl3:241`; `B9-parsethat-arch:217` |

---

## §3 — NET-NEW O FINDINGS (from the 32-lane O re-audit)

These items have no DM predecessor — they are born in the O re-audit.

| Item | Born | Disposition | Owning O wave | Evidence |
|---|---|---|---|---|
| **DO-1** VJ-L1 `flatLeaf` dispatch (VJ-L1) | O re-audit | **DISPATCH → value.js P** (O.W10). kf's S8 FN_NAME sidechannel exists ONLY because `ValueUnit` lacks a first-class `fnName` provenance field. VJ-L1 = add optional `fnName?: string` to `ValueUnit`, preserved by `clone()` (additive, BC-clean). Dispatched via `KF-TO-VALUEJS-P-ASKS.md`. | O.W10 | `utils.ts:45`; `audit/AUDIT-DIGEST.md B10-vjl1-vjl3:246`; `O.md §5` |
| **DO-2** VJ-L3 `parseCSSSubValue` dispatch | O re-audit | **DISPATCH → value.js P** (O.W10). kf's S9 direct `parse-that` dep exists ONLY because value.js exposes no `parseCSSSubValue` helper. VJ-L3 = expose `parseCSSSubValue(property, value)` at the value.js root wrapping `tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), value)`. Dispatched via `KF-TO-VALUEJS-P-ASKS.md`. | O.W10 | `utils.ts:229,236`; `audit/AUDIT-DIGEST.md B10-vjl1-vjl3:246`; `O.md §5` |
| **DO-3** glass-ui aria-orientation CORRECTION dispatch | O re-audit | **DISPATCH → glass-ui BC** (O.W11). KF-BC.md ASK#2 "CONFIRMED" is factually wrong. `SegmentedTabs.vue:406` still emits `:aria-orientation` unconditionally on `role=group` (ARIA 1.2 §6.3 disallows it). BC.W-TABS-IOS T4 byte-fences `SegmentedTabs.vue` as unchanged. A NEW BC SFC wave must guard `:aria-orientation` to tablist-only. S1 delete gates on THIS fix, not just BC cut version. | O.W11 | `glass-ui/src/components/custom/tabs/SegmentedTabs.vue:406`; `audit/AUDIT-DIGEST.md A4-bc-aria-ax:91`; `O.md §5` |
| **DO-4** no-legacy alias drops (5.0.0 surface cleanse) | O re-audit | **Band-D NOW** (O.W9). `Animation` type alias (`engine.ts:1192`, 19 demo consumers) → `KeyframesAnimation`; `@deprecated ScrollTimeline`/`ScrollTimelineOptions` aliases (`timeline.ts:209,218`) → dropped; `internal/leaves.ts` duplicates (`clamp`/`scale`/`lerp`/`lerpArray`) → import from `@mkbabb/value.js/math` (published at 1.0.2; `dist/subpaths/math.js` confirmed; verify `proof:boundary` stays GREEN). The 5.0.0 major cut (DM-16) is the honest container for the renames; the `leaves.ts` transposition is kf-internal and immediate. | O.W9 | `engine.ts:1192`; `timeline.ts:163,209`; `animations.ts:133`; `src/animation/internal/leaves.ts`; `node_modules/@mkbabb/value.js/dist/subpaths/math.js`; `audit/AUDIT-DIGEST.md F29-precept-reckoning:789` |
| **DO-5** `AnimationControls.vue` ARIA ownership violation | O re-audit | **Band-F CONSUME (O.W12 or pre-O.W12 kf-side fix).** `AnimationControls.vue:90,121,141` uses `role="tabpanel"` with a `role=group` SegmentedTabs owner. ARIA ownership requires `tabpanel` to be owned by `tablist`. Fix: either switch the AnimationControls strip to `variant=underline` (role=tablist), or replace `role=tabpanel` with `role=region + aria-label`. NOT a glass-ui dispatch — this is a kf-demo authoring error. | O.W12 (kf-side, on BC consume) | `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:90,121,141`; `audit/AUDIT-DIGEST.md A4-bc-aria-ax:99` |
| **DO-6** vendor sub-chunk 404 in probe servers | O re-audit | **Band-A NOW** (O.W2 or dedicated O.W-VENDOR-FIX). `proof-engine-no-throw-on-play.mjs:150-158` + `proof-subject-animates.mjs:67-76` serve exactly 2 vendor files; value.js 1.0.2 dist is a barrel importing 10+ hashed sub-chunks → 404 cascades → gate failures masked by other born-RED tripwires. Fix: expand VENDOR map to serve `dist/*` directory for both value.js and parse-that. | O.W2 | `scripts/proof-engine-no-throw-on-play.mjs:150-158`; `node_modules/@mkbabb/value.js/dist/` (12 chunk files); `audit/AUDIT-DIGEST.md D18-ci-device-dependence:469` |

---

## §4 — P-INVARIANT-28 ROLL-UP (the O mandatory-exit roster)

| Item | O chronicity | Exit form | Status |
|---|---|---|---|
| **DM-2** GlassControlPoint (born E) | **7 carries through M · forbidden 8th closed** | BUILD-IN O.W5 — `DemoControlPoint` over LIGHT `drag2D`; retire `proof:control-point-live`; author `proof:demo-control-point` born-RED | **O closes the forbidden 8th carry via BUILD-IN — no 9th carry** |
| **DM-3** MorphSVG (born C) | **7 carries through M · forbidden 8th closed** | BUILD-IN O.W6 — `fromMorphSVG` over published `PathGeometry`; author `proof:morphsvg-consume` born-RED | **O closes the forbidden 8th carry via BUILD-IN — no 9th carry** |
| **DM-1** RF-17 | 5 | HANDOFF O.W12 (BC-gated) — no 6th carry under no-workaround; if BC slips past O.WZ, owner must KILL or re-negotiate | **5-tranche; P-inv-28 belt ACTIVE; terminal window named** |
| **DM-5 S8** FN_NAME | 3 | HANDOFF O.W16 (value.js-P-gated VJ-L1); P-inv-28 belt fires at chronicity 4 (kf-P) if P slips | Named terminal home: value.js P VJ-L1; tripwire = api-present probe |
| **DM-5 S9** parse-that import | 3 | HANDOFF O.W16 (value.js-P-gated VJ-L3); same P-inv-28 belt at chronicity 4 (kf-P) | Named terminal home: value.js P VJ-L3; tripwire = api-present probe |
| **DM-9** CH-1 specular | 6 | VERIFY-ONLY-TERMINATED: `proof:specular-absent-at-rest` GREEN | P-inv-28 satisfied (born-RED oracle) |
| **DM-10** CH-2 typography | 7 | VERIFY-ONLY-TERMINATED: `proof:font-census` GREEN | P-inv-28 satisfied |
| **DM-11** CH-3 mobile | 8 | VERIFY-ONLY-TERMINATED: `proof:spring-slider-continuous` + `proof:subject-animates` GREEN | P-inv-28 satisfied |
| **DM-12** CH-4 dock | 6 | VERIFY-ONLY-TERMINATED: `proof:perf-frame-budget` GREEN | P-inv-28 satisfied |
| **DM-13** CH-5 empty-value | 6 | VERIFY-ONLY-TERMINATED: `proof:engine-no-throw-on-play` GREEN | P-inv-28 satisfied |
| **DM-14** CH-6 DFA suspend | 5 | VERIFY-ONLY-TERMINATED: `proof:fsm-suspend-resume-live` GREEN | P-inv-28 satisfied |
| **DM-15** scene-control-dfa | 5 | VERIFY-ONLY-TERMINATED: `proof:control-surface-single-writer` GREEN | P-inv-28 satisfied |

**DM-2 (born E) and DM-3 (born C) carried 7 tranches through M and MUST exit at O.W5/O.W6
(O closes the forbidden 8th carry via BUILD-IN).** Both were declared "ABSOLUTE terminal at M"
in the M ledger and STILL NOT built. The O re-audit explicitly designates these as the
top-priority impl actions — before any other O wave. `proof:chronic-closure` will flag a bare
BOOK with 7+ carries as a planted-probe failure.

---

## §5 — THE O BORN-RED GATES FOR EACH ITEM

Each item requiring a kf-side gate has a born-RED proof script. The table names the gate,
its born-RED witness on today's tree, and the GREEN condition.

| Item | Gate | Born-RED witness today | GREEN condition |
|---|---|---|---|
| DM-2 GlassControlPoint | `proof:demo-control-point` (NEW) | `DemoControlPoint.vue` absent; `grep -rn 'DemoControlPoint' demo/` → ZERO | `DemoControlPoint` rendered; `drag2D`-backed live drag emits updated `(x,y)` |
| DM-3 MorphSVG | `proof:morphsvg-consume` (NEW) — 4 clauses; keystone: `live-morph` | `fromMorphSVG` absent; `morph-svg.ts` absent; live-morph THROWS | `morph-svg.ts` authored; `fromMorphSVG` behind `loadAnimationEngine()`; mid-t sample DISTINCT from both endpoints |
| DM-22 named-selector NaN | `proof:named-selector-no-nan` (NEW) + `proof:replay-equality` extended | `NAMED_SELECTOR_NO_TIMELINE` typed but never thrown; named-selector frames produce NaN frame-times → always-active | throw fires at parse time OR frames compute valid times; gate asserts NOT NaN |
| DM-23 apparatus | `proof:lint-tier` (NEW born-RED — eslint config absent) | `ls .eslintrc* eslint.config*` → ZERO | eslint config present; `proof:lint-tier` GREEN |
| DO-4 no-legacy aliases | `proof:no-deprecated-Animation-import` (NEW grep gate) | `grep -rn "import.*{ Animation }" demo/` → 22 hits | 0 hits; all consumers migrated to `KeyframesAnimation` |
| DO-6 vendor sub-chunks | existing `proof:engine-no-throw-on-play` J.W1 clause | `b` clause fails: "Failed to fetch" 404 on sub-chunks | VENDOR map expanded; gate GREEN |
| S8 FN_NAME | `proof:workaround-deletion` S8 arm | S8=PENDING (`flatLeaf in vjs === false`) | S8=GREEN (`flatLeaf in vjs === true` + `FN_NAME` grep → ZERO) |
| S9 parse-that | `proof:workaround-deletion` S9 arm + `proof:boundary` W96 scan (NEW clause — scan HEAVY source for `@mkbabb/parse-that` imports, assert ZERO) | S9=PENDING (`parseCSSSubValue in vjs === false`); W96 RED on `utils.ts:1` | S9=GREEN + W96 GREEN |
| DM-24 N Stage | `proof:n-stage-boundary` (N.W2 spec authored, script absent) | gate script absent; `n-stage-impl` not rebased | gate authored born-RED; rebase done; BC cut published; O.W15 unshelf executes |

---

## §6 — KILL RECORD (standing, carried from M + the O reckoning)

The M kills (W100 incremental-parse, `generate()`, DL-L7..DL-L13) carry as O's standing
anti-charter (non-re-litigable). The DM-4 KILL was **overturned to FIX** by D4
(`M-RECONCILIATION §4`) — the KILL record for DM-4 is VOID; the FIX is the dispositive
exit form.

> **DM-4 KILL VOID — superseded by FIX (D4 + parse-that A.W2).** The parse-that WDM
> `(id,offset)` composite key FIX shipped at parse-that 0.11.0 (A.W2). `proof:packrat-sound`
> GREEN on the live tree. The KILL reasoning (LR-grow tier off the consumed path) remains
> accurate but the repair made it moot — the FIX is idiomatic and preferred over a KILL on
> a now-correct codebase.

---

### DM-1 RF-17 — PRE-AUTHORED CONTINGENCY KILL

> **PRE-AUTHORED CONTINGENCY KILL (a standing, self-voiding record).**
>
> **TRIGGER (falsifiable, AND-joined):** at the O.WZ close-gate, `proof:workaround-deletion`
> S2 still PENDING **AND** no glass-ui BC cut bearing `useDockClickIntegrity` is published.
>
> **DISPOSITION:** reclassify the S2 dock-pointer interim from "workaround pending sibling
> fix" to a DECLARED kf-internal input-integrity seam — annotated with a comment citing the
> unshipped glass-ui dependency + this KILL, and allow-listed in `proof:workaround-deletion`
> so S2 reports GREEN-as-declared-seam (not PENDING-against-a-phantom).
>
> **VOID CONDITION:** this KILL is VOID the instant glass-ui publishes a cut whose
> `useDockClickIntegrity` eliminates the crossfade-strand root — S2 reverts to the normal
> atomic delete-on-re-pin (the intended O.W12 exit).
>
> **RATIONALE:** the interim is correct defensive code curing a real pointer-swallow strand
> observed I→M; quarantining it as a declared seam is the honest no-workaround-compliant
> terminal when the sibling does not ship.
>
> **Cross-ref:** DM-1 row (§1a); `proof:workaround-deletion` S2 arm (§2); §4 P-inv-28
> roll-up DM-1 row.

---

## §7 — THE `proof:chronic-closure` SUBSTRATE TRANSITION

At O.WZ the orchestrator performs the atomic re-point (the M.WZ→L / L.WZ→K precedent):

1. `scripts/proof-chronic-closure.mjs:114` `CHRONIC_LEDGER` changes from
   `docs/tranches/L/PROGRESS.md` to `docs/tranches/O/PROGRESS.md` (M.WZ never re-pointed
   L→M; O.WZ leaps directly to O — the ledger re-point target is `docs/tranches/O/PROGRESS.md`).
2. Fix `LEDGER_LABEL` accordingly in the same commit.
3. Populate `M/PROGRESS.md §"Open deferrals" §D` with the DM-24 + DM-25 + DM-W1-bridge
   rows (IMPL-OPEN per `M-RECONCILIATION §11` — never executed).
4. The non-vacuity planted-probe: three deliberately-malformed O-ledger rows (a
   FOLD citing a source-shape gate as a runtime oracle; a HANDOFF targeting a phantom
   version; a ≥4-tranche bare BOOK) RED on all three clause shapes BEFORE being removed
   so the clean O ledger GREENs.
5. `proof:chronic-closure` runs → exit 0 on the clean ledger.

---

## §8 — DISPOSITION SUMMARY

| Tag | Count | Rows |
|---|---|---|
| **HANDOFF (sibling-gated, un-fired)** | 3 | DM-1 (BC) · DM-7 (USER-DOMAIN) · DM-24 (BC/N Stage) |
| **DISPATCH (cross-repo ask authored)** | 3 | DO-1 VJ-L1 · DO-2 VJ-L3 · DO-3 aria correction |
| **BUILD-IN (forbidden 8th carry closed via BUILD-IN)** | 2 | DM-2 born-E (O.W5 DemoControlPoint) · DM-3 born-C (O.W6 MorphSVG) |
| **Band-D NOW (no-legacy transpositions)** | 1 | DO-4 (alias drops + leaves.ts→math) |
| **Band-B NOW (correctness)** | 2 | DM-21 (@property compileToCSS) · DM-22 (NaN named-selector) |
| **Band-A NOW (apparatus)** | 2 | DM-23 (runner transposition) · DO-6 (vendor sub-chunks) |
| **Band-F CONSUME (BC-gated kf-side a11y)** | 1 | DO-5 (AnimationControls ARIA ownership) |
| **FOLD-LANDED** | 5 | DM-4 (FIX/A.W2) · DM-6 (css-parity) · DM-17 (corrected) · DM-18 · DM-25 (consume-bundle) |
| **USER-DOMAIN** | 2 | DM-16 (5.0.0 cut) · DM-20 (deploy round-trip) |
| **VERIFY-ONLY / RE-AFFIRM** | 8 | DM-8 … DM-15 |
| **CANONICALIZED (retired)** | 2 | DM-19 (rf17-net-deletion name) · S7 (GREEN) |
| **VALUE.JS-P-GATED HANDOFF** | 2 | S8 (O.W16) · S9 (O.W16) |

**P-INVARIANT-28 CLOSURE ASSERTION (O).** Every row carries (a) a tag, (b) a named owning
O wave, and (c) a named tripwire or terminal disposition. **Zero rows are bare BOOKs.**
DM-2 (born E) and DM-3 (born C) carried 7 tranches through M — O closes the forbidden 8th
carry via BUILD-IN at O.W5/O.W6. The 5-tranche DM-1 is a named HANDOFF with a named
terminal window (BC cut; if it slips, owner must KILL or re-negotiate). The S8/S9
chronicity-3 items have a named terminal home (value.js P VJ-L1/VJ-L3) with a P-inv-28
belt tripwire at chronicity 4 (kf-P). The VERIFY-ONLY-TERMINATED rows (DM-8..DM-15)
satisfy P-inv-28 via born-RED oracle provenance.

---

## §9 — EVIDENCE INDEX (re-verified against aef3ef3 + n-stage-impl)

- `docs/tranches/M/audit/deferred-ledger-M.md` — the 23-row source substrate (DM-1..DM-23)
- `docs/tranches/M/M-RECONCILIATION.md:§4,§7,§9,§11` — the DM-4 FIX correction, DM-24,
  DM-25, DM-W1-bridge edit-specs (IMPL-OPEN at audit date)
- `docs/tranches/O/audit/AUDIT-DIGEST.md` — A1-A5 (BC seam), B10 (VJ-L1/L3), C13 (ledger
  staleness), C15 (engine), C16 (demo), D17-D19 (gate/CI), F25-F28 (chronic/N-stage/precept)
- `docs/tranches/O/O.md §3,§4,§5` — the 8-band DAG, P-inv-28 reckoning, sibling dispatches
- `scripts/proof-workaround-deletion.mjs:204,219,231,248,264` — S1,S2,S7,S8,S9 arm specs
  (S7 GREEN; S1/S2 PENDING on BC-cut not BB 4.1.0; S8/S9 PENDING on api-present probe)
- `glass-ui/src/components/custom/tabs/SegmentedTabs.vue:406` — unconditional
  `:aria-orientation` (S1 aria misidentification)
- `src/animation/utils.ts:1,45-57,229,236` — S9 direct import + S8 FN_NAME sidechannel
- `src/animation/frame-compiler.ts:128` + `internal/errors.ts:46` + `utils.ts:398` — DM-22
  NaN-always-active dead-code evidence
- `node_modules/@mkbabb/value.js/dist/transform/path.d.ts:36-67` — `PathGeometry` PRESENT
  (the DM-3 build-in unblocked; no sibling gate required)
- Registry probes (live 2026-06-19): glass-ui `4.0.1` · value.js `1.0.2` · parse-that
  `0.11.0` · keyframes-vue E404. VJ-L1 `flatLeaf in vjs === false`; VJ-L3
  `parseCSSSubValue in vjs === false`.
