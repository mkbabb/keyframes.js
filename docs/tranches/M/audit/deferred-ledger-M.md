# Tranche M — THE CONSOLIDATED DEFERRED / CHRONIC LEDGER (K → L → M)

**Lane:** deferred-ledger-M · **Date authored:** 2026-06-17 · **Tree at author:**
`tranche-m-dev` (M.W0 DEV phase — docs only; no engine/demo/library source is written;
impl opens on explicit authorization only; inv-16 holds throughout per `M.md:5`).

**Mandate.** THE consolidated **K → L → M** deferred/chronic substrate — the item-by-item
terminal ledger that `M/PROGRESS.md §"Open deferrals"` will summarize and `proof:chronic-closure`
will parse once M.WZ re-points its `CHRONIC_LEDGER` path constant from `docs/tranches/L/PROGRESS.md`
to `docs/tranches/M/PROGRESS.md` (`scripts/proof-chronic-closure.mjs:114`). It is the direct
successor to `docs/tranches/L/audit/deferred-ledger-L.md` (51 DLL rows, TERMINAL at the L.WZ close)
and the lane-28 chronic-ledger seed (the 20 DM rows). The 20 DM rows below REFINE the
`PROGRESS.md §"Open deferrals"` cluster (the 13 DL-L cluster rows + the 7 carried K-chronics, each
incremented by one tranche). Every row cross-links its lane evidence and its terminal disposition.

**Method (inv ε — verify before asserting).** Every row cites a `file:line`, a lane § that itself
cites the ground truth, a `DLL-N`/`DL-Ln` predecessor row, a `⚠M#` precept finding, or a re-runnable
command. Substrate parsed:
- `docs/tranches/L/audit/deferred-ledger-L.md` — the 51-row L terminal ledger (21 Band-A-fold,
  11 Band-B-gated-consume, 6 BOOK-with-tripwire, 13 KILL).
- `docs/tranches/L/PROGRESS.md §"Open deferrals"` — the 13 DL-L cluster rows + the 7 carried
  K-chronics (CH-1…CH-6, scene-control-dfa) + the Band-B consume-edge table.
- `docs/tranches/M/audit/lane-{01..32}-*.md` — the 32-lane deep re-audit (`file:line` ground truth).
- `M.md` — the charter (the wave map, the invariant set, the precept reckoning table ⚠M1–⚠M9).
- Live registry probes (this tree): glass-ui `4.0.0` · value.js `0.13.0` · parse-that `0.9.0` ·
  keyframes-vue E404. **All gate outputs re-run directly on this tree; all sibling publishes probed.**

**The two inv-ε CORRECTIONS this ledger carries (the M-audit findings):**

1. **viol-M4 — FOUR breaking changes, not three.** `L/FINAL.md:141` + `:274` state "THREE breaking
   type changes." The source documents **FOUR**: `Animation`→`KeyframesAnimation`
   (`engine.ts:1192`), `ScrollTimelineOptions`→`KeyframesScrollTimelineOptions` (`timeline.ts:163`),
   `ScrollTimeline`→`KeyframesScrollTimeline` (`timeline.ts:209`), `presets.flip`→`flipPreset`
   (`animations.ts:133` `BREAKING (5.0.0)`). Read-verified on this tree (the four annotations all
   present). The M cure is M.WZ's `proof:changelog-5.0.0` (the 5.0.0 changelog names FOUR). Recorded
   in DM-16 + §3. (⚠M4, `M.md:139`; lane-27 §1.)
2. **viol-M5 — value.js `PathGeometry` is PRESENT, not absent.** `deferred-ledger-L.md DLL-21` +
   `DL-L8` premise that "value.js `PathGeometry` / the arc-length sampler is absent at 0.13.0" is a
   **factual error**. value.js 0.13.0 ships the `PathGeometry` class with `getTotalLength()` /
   `getPointAtLength(length)` / `getPointAtPathLength()` plus the module-level `getTotalLength(d)` /
   `getPointAtLength(d, length)` (Read-verified: `node_modules/@mkbabb/value.js/dist/transform/path.d.ts`
   lines 36–67). MorphSVG is therefore a kf-side **build-in NOW** (`fromMorphSVG` composited over the
   published `PathGeometry`), not a sibling-gated HANDOFF. The M cure is M.W14's `proof:morphsvg-consume`
   build-in. Recorded in DM-3 + §3. (⚠M5, `M.md:140`; lane-25 §3; lane-19.)

---

## §0 — THE TAG SET (the terminal dispositions, carried from L §0)

P-invariant-28 (`M.md:79`, the J/K/L spine): **no ≥4-tranche item rides as a bare BOOK; every item
that has ridden ≥4 tranches MUST exit in M via a consume, a build-in, a measurement, or a reasoned
KILL/EXITED verdict.** A bare BOOK on a fifth (now in M, often seventh) ride is forbidden. Every row
below carries exactly one tag.

| Tag | Meaning | Exit mechanism | When it greens |
|---|---|---|---|
| **Band-A-fold / LANDED** | kf-internal cure on the published siblings; no new sibling gate | a born-RED gate authored FIRST, GREENed by the kf cure | the M Band-A/B wave lands |
| **Band-B-gated-consume / HANDOFF** | a defect at a published sibling; fixed AT the sibling, consumed via re-pin (inv-L-acyclic-purity) | a born-RED kf-side consume/deletion gate, STAGED-PENDING until the sibling publishes | the sibling publishes + kf re-pins (+ the workaround is deleted in the same commit) |
| **BUILD-IN** | the L-ledger HANDOFF premise was wrong — the API is already published; kf builds the feature kf-side NOW (no sibling gate) | a born-RED kf-side build gate, GREENed by the kf build | the M build wave lands (no sibling publish required) |
| **KILL** | researched negative result; non-re-litigable anti-charter or off-the-consumed-path reframe | RECORD permanent (a named spec gates any future re-look) | never (the KILL-GUARD re-confirms) |
| **VERIFY-ONLY / RE-AFFIRM** | a TERMINATED chronic; the gate was born-RED on the defect tree, is GREEN on the L close tree; the carry is a regression re-verify | a GREEN gate re-run on the M dist | each new dist re-verifies GREEN (a revert is a NEW M regression) |
| **USER-DOMAIN** | a motion only the owner (Mike Babb) authorizes (a publish, a version cut, a TASTE verdict) | the owner executes | the owner acts |

**The chronicity column.** The leading INTEGER is the tranche-span count `proof:chronic-closure`
reads; the tranche-letter provenance follows in parentheses (e.g. `4 (I,J,K,L→M)`). The ≥4-tranche
EXIT-ONLY mandate (P-inv-28) is enforced mechanically off that integer.

**The runtime-band citation contract (carried from `L/PROGRESS.md:277`).** A Band-A/build-in row's
backticked `` `proof:*` `` is a load-bearing RUNTIME oracle (resolves to a `package.json` key, runs in
the `proof:correctness` tier, opens a browser over the built dist) OR a NODE/VITEST data-model gate
per inv-M-two-axis (`M.md:94` — the typed three-axis: a RUNTIME gate for a UI/interaction chronic, a
fast NODE/VITEST gate for a data-model chronic, a sub-second STATIC rule for a source-shape invariant).
A HYGIENE/source-shape gate is named in PLAIN PROSE; the row's terminal mechanism is the non-gate keyword.

**inv-M-observable-truth (`M.md:88`).** Every born-RED gate must bite the REAL observable verified by
a live probe — never a proxy (the L.W1 S4 gate tested no-throw + string round-trip while the real
breach was NaN frame-times). Where a DM row's M cure carries a gate, the gate's witness is the genuine
defect, named in the row.

---

## §1 — THE L→M CHRONICITY INCREMENT (every row that carries; from lane-28 §1)

The 20 rows in the `proof:chronic-closure` L substrate (`L/PROGRESS.md §"Open deferrals"`) carry into
M with their chronicity integers incremented by 1. Rows at FOLD-LANDED or KILL-RECORD need no further
M action on the chronic ledger (DONE; not re-opened). Only HANDOFF, VERIFY-ONLY/RE-AFFIRM, and
USER-DOMAIN rows carry a live M obligation.

| L row (DL-Ln) | L chronicity | M chronicity | L disposition at close | M obligation (DM row) |
|---|---|---|---|---|
| DL-L1 replay-equality breach family | 1 (L) | n/a | FOLD LANDED (L.W1+W2) | **NOT DONE — re-opened.** The L gates tested the WRONG observables (inv-M-observable-truth): `@property` drops from `compileToCSS`; named-selector → NaN-always-active. → **DM-21 / DM-22** (M.W5; net-new M correctness). |
| DL-L2 gate-corpus blind-spot | 1 (K→L) | n/a | FOLD LANDED (L.W4) | **Partially re-opened** — the apparatus is over-engineered (the owner's flag). → **DM-23** (M.W1–W4; the runner transposition). |
| DL-L3 / CH F-2 peer-cycle | 2 (K,L) | n/a | FOLD LANDED (gate) + HANDOFF cure | The gate is PENDING (`proof:peer-satisfied` RED); the M obligation is the CONSUME on glass-ui 4.1.0. → **DM-1 / DM-5** (M.W8). |
| DL-L4 ED-3 dogfood inversion | 2 (K,L) | n/a | FOLD LANDED (L.W8) | DONE — no M carry. |
| DL-L5 keyframes-vue unpublished | 2 (K,L) | n/a | FOLD LANDED (prep); publish USER-DOMAIN | USER-DOMAIN (Mike Babb) — the npm publish. → **DM-7** (M.WZ). |
| DL-L6 RF-17 / DL-K9 GlassDock | 3 (I,J,K→L) | **4 (I,J,K,L→M)** | HANDOFF (tripwire UN-FIRED) | **P-inv-28 belt TRIGGERED at M.** → **DM-1** (M.W8; consume glass-ui 4.1.0 + delete S2). |
| DL-L7 GlassControlPoint | 6 (E…K→L) | **7 (E…L→M)** | HANDOFF (tripwire UN-FIRED) | P-inv-28 belt (≥4 ALL OF L; ABSOLUTE terminus at M). → **DM-2** (M.W14; consume OR build-in Option B). |
| DL-L8 MorphSVG / FB-3 | 6 (C…K→L) | **7 (C…L→M)** | HANDOFF (tripwire UN-FIRED) — **PREMISE WRONG (viol-M5)** | P-inv-28 belt (ABSOLUTE terminus at M); the API IS published → BUILD-IN. → **DM-3** (M.W14). |
| DL-L9 PT-2 packrat soundness | 5 (E…K→L) | **6 (E…L→M)** | HANDOFF (tripwire UN-FIRED) | P-inv-28 belt; the unsoundness is off the consumed path → KILL. → **DM-4** (M.W10/M.W14). |
| DL-L10 constellation workarounds | 1 (K→L) | **2 (K,L→M)** | HANDOFF (all 5 arms PENDING) | CONSUME on sibling publish (arm-by-arm). → **DM-5** (M.W8 + M.W9). |
| DL-L11 true-CSS-parity frontier | 1 (K→L) | **2 (K,L→M)** | HANDOFF (research spike LANDED; IMPL gated) | Author `proof:css-parity` NOW (Band-A) + coordinated close. → **DM-6** (M.W11). |
| DL-L12 Lighthouse floors | 1 (L) | **2 (L→M)** | VERIFY-ONLY | Re-verify on M dist at M.WZ. → **DM-8**. |
| DL-L13 T1 formal resolution | 1 (K→L) | n/a | FOLD LANDED (L.W0 derivation gate) | DONE — no M carry. |
| CH-1/B7 specular sheen | 4 (D,H,I,K→L) | **5 (D,H,I,K,L→M)** | RE-AFFIRM (GREEN) | Re-verify on M dist. → **DM-9**. |
| CH-2 typography | 5 (D,I,J,K→L) | **6 (D,I,J,K,L→M)** | VERIFY-ONLY (GREEN) | Re-verify on M dist. → **DM-10**. |
| CH-3 mobile chronic | 6 (D,H,I,J,K→L) | **7 (D,H,I,J,K,L→M)** | VERIFY-ONLY (GREEN) | Re-verify on M dist. → **DM-11**. |
| CH-4 dock | 4 (D,H,I,K→L) | **5 (D,H,I,K,L→M)** | RE-AFFIRM (GREEN) | Re-verify on M dist. → **DM-12**. |
| CH-5 empty-value crash | 4 (A,H,I,K→L) | **5 (A,H,I,K,L→M)** | VERIFY-ONLY (GREEN) | Re-verify on M dist. → **DM-13**. |
| CH-6 DFA suspend crash | 3 (H,I,K→L) | **4 (H,I,K,L→M)** | VERIFY-ONLY (GREEN) | **P-inv-28 belt triggered at M** (satisfied via born-RED oracle). → **DM-14**. |
| scene-control-dfa | 3 (I,J,K→L) | **4 (I,J,K,L→M)** | VERIFY-ONLY (GREEN) | **P-inv-28 belt triggered at M** (satisfied via born-RED oracle). → **DM-15**. |

**Items NEWLY hitting the P-inv-28 ≥4-tranche belt at M** (chronicity 3→4): **DL-L6 RF-17** (DM-1 —
no 4th-tranche carry under no-workaround; MUST consume on glass-ui 4.1.0 or KILL); **CH-6 DFA
suspend** (DM-14) and **scene-control-dfa** (DM-15) — both VERIFY-ONLY-TERMINATED with a GREEN gate +
born-RED provenance; the P-inv-28 mandate IS satisfied by the BORN-RED oracle fact.

---

## §2 — THE M OPEN-DEFERRALS SUBSTRATE (DM rows — the NEXT `proof:chronic-closure` parse target)

These DM rows form the proposed `M/PROGRESS.md §"Open deferrals"` table M.WZ will transition the
`CHRONIC_LEDGER` path constant to read. Each inherits its L predecessor and adjusts the chronicity
integer. The CHRONICITY COLUMN SHAPE is identical to L: every row leads with an explicit integer
tranche-span count, the tranche-letter provenance in parentheses — `proof:chronic-closure` reads the
leading integer only.

### 2a — HANDOFF rows (sibling-gated; tripwires un-fired at this audit)

| # | Item | Born | M Chronicity | Disposition | Owning wave | Lane evidence + gate / terminal disposition |
|---|---|---|---|---|---|---|
| **DM-1** | **RF-17 / DL-K9 / DL-L6 GlassDock click-strand interim** (`onPlayPointerDown`/`pointerHandled` in `TransportDock.vue` — a glass-ui dock-layer crossfade defect worked around kf-side) | I (BLK-8) | **4 (I,J,K,L→M)** | **HANDOFF — consume glass-ui 4.1.0 + delete S2 in ONE commit** | M.W8 | **lane-23** (F-2 deploy blocker) · **lane-21** (glass-ui BB) · **lane-25 §1** (build-in NOT viable under inv-16 — genuinely sibling-gated). `proof:workaround-deletion` S2 PENDING (re-run live — `TransportDock.vue:15,151,196,342,348,358,361,366,373` confirmed); glass-ui@4.1.0 E404. **TRIPWIRE:** glass-ui 4.1.0 ships `W-DOCK-MORPH-FAMILY` → S2 GREEN on the re-pin + simultaneous deletion. **P-inv-28 (4-tranche):** no-workaround forbids a 5th carry; MUST consume or KILL at M. **Terminal disposition:** EXIT at M.W8 (the glass-ui 4.1.0 atomic consume); the deploy UNLOCK rides this row. |
| **DM-2** | **GlassControlPoint / DL-K7 / DL-L7** (the curve-editor primitive; absent from glass-ui@4.0.0 dist) | E | **7 (E,F,G,H,I,J,K,L→M)** | **HANDOFF — consume on glass-ui BB publish OR build-in Option B (a `DemoControlPoint` over the LIGHT `Draggable`)** | M.W14 | **lane-25 §2** (build-in Option B analysis — kf ALREADY has `drag`/`Draggable`; the build-in is architecturally sound + KISS) · **lane-21**. `proof:control-point-live` RED-BY-DESIGN (re-run live — ZERO hits in `node_modules/@mkbabb/glass-ui/dist/`). **P-inv-28 (7-tranche, re-BOOK CLOSED since L.WZ — ABSOLUTE terminus at M):** at M.WZ this MUST be EXITED (consumed) or BUILT-IN (Option B) — no 8th ride. **Terminal disposition:** M.W14 builds a thin internal `DemoControlPoint` composable over the LIGHT `Draggable` (Option B); `proof:control-point-live` is RETIRED or re-pointed at the kf component. |
| **DM-4** | **PT-2 parse-that packrat / DL-L9** (Warth-Douglass-Millstein (id,offset) soundness; `packrat.ts` self-documents an UNSOUND id-only key in the LR grow path) | E | **6 (E,F,G,H,I,K,L→M)** | **KILL (the unsoundness is off the value.js-consumed path; the risk is nil)** | M.W10 / M.W14 | **lane-20** (parse-that) · **lane-25 §4** (KILL analysis — verified against the published 0.9.0 dist). The published `dist/packrat.js` (0.9.0) uses a composite `(id,offset)` key; the source unsoundness is in the LR grow path activated ONLY via an explicit `packrat: true` opt-in that value.js's grammar does NOT use; `proof:packrat-sound` ABSENT through six tranches — the clearest signal the "unsoundness" is theoretical, not a product defect. **P-inv-28 (6-tranche):** the KILL is the KISS-respecting exit. **Terminal disposition (KILL form, lane-28 §5):** *the LR grow-path id-only key is NOT exercised by value.js's grammar; the published 0.9.0 dist already uses composite (id,offset) on all production paths; any future opt-in consumer of the LR grow path must author `proof:packrat-sound` as its OWN gate-first obligation.* |
| **DM-5** | **Constellation workarounds / DL-L10** (FN_NAME Symbol ⚠18; `linear()` regex ⚠20; direct parse-that dep ⚠24; aria-orientation suppress ⚠1-3) | K | **2 (K,L→M)** | **HANDOFF (each arm retires on its sibling publish; all 5 PENDING)** | M.W8 (S1/S2) + M.W9 (S7/S8/S9) | **lane-26** (workaround-deletion S-clause map) · **lane-19** (value.js O) · **lane-21** (glass-ui BB). `proof:workaround-deletion` 0 GREEN / 5 PENDING / 0 RED (re-run live). Tripwires: (S1) glass-ui 4.1.0 SegmentedTabs aria fix → `SpringSidebar.vue:43` + `AnimationControls.vue:72` `:aria-orientation` deletes; (S2) glass-ui 4.1.0 RF-17 → `pointerHandled`/`onPlayPointerDown` delete; (S7) value.js VJ-L2 `linearStopsToCSS` → `utils.ts:185-196` regex deletes; (S8) value.js VJ-L1 `flatLeaf`/typed API → `utils.ts:45-57` FN_NAME Symbol deletes; (S9) value.js VJ-L3 `parseCSSSubValue` → `utils.ts:1` + `package.json` direct parse-that dep deletes. **Terminal disposition:** S1+S2 EXIT at M.W8 (glass-ui 4.1.0); S7+S8+S9 EXIT at M.W9 (value.js O 0.14.0) — each ONE atomic commit per sibling; no arm carries to a third tranche. |
| **DM-6** | **True-CSS-parity frontier / DL-L11** (CSS Nesting THROWS; bare `linear-gradient(red,blue)` THROWS — two P0 hard-crashes on Baseline CSS; url-token mis-tokenized; @container/@layer/@scope/env/system-color opaque; W10 spike landed; IMPL gated on coordinated publish) | K | **2 (K,L→M)** | **HANDOFF (Band-A gate NOW + coordinated value.js-O + parse-that publish for the IMPL close)** | M.W11 | **lane-24** (css-parity capability matrix — 8 runtime-invocation rows over value.js's REAL 0.13.0 failure modes) · **lane-19** · **lane-20**. `proof:css-parity` ABSENT from `scripts/` today — **but M reverses the L deferral: author the Band-A capability-matrix gate NOW** (born-RED on the real crashes/drops that bite today), then the coordinated grammar closes it. **TRIPWIRE:** value.js O (0.14.0, the 2 P0 crash fixes + grammar totality) + parse-that coordinated publish → kf re-pins → `proof:css-parity` GREENs on the IMPL. **Terminal disposition:** M.W11 authors the born-RED gate (Band-A), the IMPL closes on the coordinated publish; W100 incremental-parse KILL re-affirmed (BOOK-with-tripwire). |

### 2b — BUILD-IN rows (the L HANDOFF premise was wrong; kf builds the feature NOW — no sibling gate)

| # | Item | Born | M Chronicity | Disposition | Owning wave | Lane evidence + gate / terminal disposition |
|---|---|---|---|---|---|---|
| **DM-3** | **MorphSVG / FB-3 / DL-L8** (`fromMorphSVG` arc-length morph; the L-ledger premise "value.js `PathGeometry` absent at 0.13.0" is a **FACTUAL ERROR — viol-M5**) | C | **7 (C,F,G,H,I,J,K,L→M)** | **BUILD-IN — `fromMorphSVG` over the ALREADY-PUBLISHED value.js 0.13.0 `PathGeometry`** | M.W14 | **lane-25 §3** (the CRITICAL NUANCE — `PathGeometry` / `getPointAtLength` / `getTotalLength` EXPORTED in 0.13.0, Read-verified at `dist/transform/path.d.ts:36-67` + `dist/value.js` PathGeometry class) · **lane-19** (value.js O — VJ.W4 is a deepening, NOT a prerequisite) · **lane-28 §5/§6 M.W-MORPHSVG**. **viol-M5 CORRECTION:** the L `DLL-21`/`DL-L8` premise (the API is absent) does NOT hold — `PathGeometry.getPointAtLength(t)` IS the full arc-length sampler in 0.13.0; `fromMorphSVG` is a kf-side compositor (sample both `d`-strings at N uniform-arc-length intervals, pair, interpolate) requiring NO new value.js API. **P-inv-28 (7-tranche, ABSOLUTE terminus at M):** the BUILD-IN is the mandatory exit. **Terminal disposition:** M.W14 ships `fromMorphSVG` over the published `PathGeometry`; `proof:morphsvg-consume` (born-RED on the absent kf-side `fromMorphSVG`, NOT a sibling gate) GREENs on the kf build. No 8th BOOK; no sibling publish required. |

### 2c — USER-DOMAIN rows

| # | Item | Born | M Chronicity | Disposition | Owning wave | Lane evidence + gate / terminal disposition |
|---|---|---|---|---|---|---|
| **DM-7** | **keyframes-vue 0.1.0 unpublished / DL-L5** (the adapter is prepped + built; clause (b) of `proof:keyframes-vue-published` RED — E404) | K.W12 | **2 (K,L→M)** | **HANDOFF (USER-DOMAIN — Mike Babb)** | M.WZ | **lane-27** (USER-DOMAIN finale). `proof:keyframes-vue-published` clause (b) RED-BY-DESIGN (re-run: E404); clause (a) built-artifact GREEN (`packages/keyframes-vue/dist/keyframes-vue.js` PRESENT). The publish is `npm publish --access public` in `packages/keyframes-vue/`. **Terminal disposition:** the USER-DOMAIN publish is the M.WZ precondition for the deploy round-trip; rides the 5.0.0 cut (DM-16). |
| **DM-16** | **5.0.0 version cut** (the FOUR documented breaking type changes — **viol-M4 corrected** — + the silent-lossy multi-color refusal semantic break + the barrel-dogfood flip; L recommends 5.0.0 MAJOR) | L.W8 | **1 (L→M)** | **USER-DOMAIN (Mike Babb authorizes the cut)** | M.WZ | **lane-27 §1** (the UNDER-COUNT finding). **viol-M4 CORRECTION:** the four are `Animation`→`KeyframesAnimation` (`engine.ts:1192`), `ScrollTimelineOptions`→`KeyframesScrollTimelineOptions` (`timeline.ts:163`), `ScrollTimeline`→`KeyframesScrollTimeline` (`timeline.ts:209`), `presets.flip`→`flipPreset` (`animations.ts:133` `BREAKING (5.0.0)`) — Read-verified on this tree; `L/FINAL.md:141`+`:274` say "THREE". **Terminal disposition:** M.WZ's `proof:changelog-5.0.0` names FOUR; the exact version string is USER-DOMAIN. |

### 2d — VERIFY-ONLY / RE-AFFIRM rows (terminated defects; re-verified on each new dist)

Each row is a TERMINATED chronic: the defect was cured, the gate was born-RED on the defect tree, the
gate is GREEN on the L close tree. The M obligation is RE-VERIFY the GREEN state on the M dist. A
revert to RED is a NEW M regression to wave-assign. Each satisfies P-inv-28 via the BORN-RED oracle
fact (the gate WAS born-RED on the defect tree; the GREEN gate IS the close-down form).

| # | Item | Born | M Chronicity | Disposition | Gate (re-verify at M.WZ) | Lane / note |
|---|---|---|---|---|---|---|
| **DM-8** | **Lighthouse floors / DL-L12** (K floors: home 68/cube 66/amiga 52/square 65/easing 63/spring 55) | B-era | **2 (L→M)** | **VERIFY-ONLY** | `proof:lighthouse-mobile` `KF_REQUIRE_LH=1` on M dist | lane-29 §9. Runner-calibrated; wall-clock CATEGORY per inv-L-device-honesty; RECORDED, never CI-hard-gated. |
| **DM-9** | **CH-1/B7 specular sheen** (cartoon specular at rest) | D(D14)→H | **5 (D,H,I,K,L→M)** | **RE-AFFIRM** | `proof:specular-absent-at-rest` GREEN; re-verify on M dist | lane-28 §1. `proof:specular-handoff` DELETED (self-guard in place); the GREEN gate IS the exit form. |
| **DM-10** | **CH-2 typography** (φ-hero typography, dock voice) | D(D7)→I(TYP-2) | **6 (D,I,J,K,L→M)** | **VERIFY-ONLY (TERMINATED)** | `proof:font-census` GREEN; re-run on M dist | lane-28 §1. ONE voice-token authority; dock-label binds the display serif. |
| **DM-11** | **CH-3 mobile chronic** (spring slider STEPS; /square broken) | D(D10) | **7 (D,H,I,J,K,L→M)** | **VERIFY-ONLY (TERMINATED)** | `proof:spring-slider-continuous` + `proof:subject-animates` GREEN; re-run on M dist | lane-28 §1. 60 Hz painter owns position; /square cured by K.W4. |
| **DM-12** | **CH-4 dock** (D5 lag + D9 popover) | D(D5/D9) | **5 (D,H,I,K,L→M)** | **RE-AFFIRM** | `proof:perf-frame-budget` GREEN; re-verify on M dist | lane-28 §1. D5 lag RE-AFFIRM; dock anchoring EXITED K.W3. |
| **DM-13** | **CH-5 empty-value crash** (`"......"` input) | A(W0)→H | **5 (A,H,I,K,L→M)** | **VERIFY-ONLY (TERMINATED)** | `proof:engine-no-throw-on-play` GREEN; re-run on M dist | lane-28 §1. `parseCSSValueUnit("")=>{value:0}` no throw. |
| **DM-14** | **CH-6 DFA suspend crash** (`_gen` DFA suspend) | H | **4 (H,I,K,L→M)** | **VERIFY-ONLY (TERMINATED)** | `proof:fsm-suspend-resume-live` GREEN; re-run on M dist | lane-28 §1/§4. **P-inv-28 (4-tranche):** BORN-RED provenance documented; the GREEN gate IS the exit form. No re-BOOK. |
| **DM-15** | **scene-control-dfa** (deploy-block + product lag) | I (post-close) | **4 (I,J,K,L→M)** | **VERIFY-ONLY (TERMINATED)** | `proof:control-surface-single-writer` GREEN; re-verify on M dist | lane-28 §1/§4. **P-inv-28 (4-tranche):** BORN-RED provenance documented; the GREEN gate IS the exit form. No re-BOOK. |

### 2e — NET-NEW M items (from the 32-lane audit findings — not carried as DL-L rows)

The L gates structurally could not see these (inv-M-observable-truth — the L gates tested the wrong
observables). They are net-new M correctness/apparatus obligations.

| # | Item | Born | Chronicity | Proposed disposition | Owning wave | Lane evidence + the REAL observable |
|---|---|---|---|---|---|---|
| **DM-17** | **`proof:packrat-sound` gate absent** (named in DL-L9 but NOT authored in `scripts/`) | L.WZ | 1 (L→M) | **RESOLVED-BY-KILL (DM-4)** | M.W10 / M.W14 | lane-28 §3/§5. `grep "proof:packrat-sound" scripts/` → ZERO. Gate-first-correct for a gated-on-sibling BOOK; **moot once DM-4 KILL is chosen** (no gate ever authored). |
| **DM-18** | **`proof:css-parity` gate absent** (named in DL-L11 but NOT authored in `scripts/`) | L.WZ | 1 (L→M) | **Band-A: author the capability-matrix gate NOW (M reverses the L deferral)** | M.W11 | lane-24 · lane-28 §3. `ls scripts/proof-css-parity.mjs` → not found. M authors it born-RED over the REAL 0.13.0 crashes (CSS Nesting THROW, bare-gradient THROW) — the L "defer until siblings publish" is reversed for the Band-A capability matrix (it bites today). DM-6 carries the IMPL close. |
| **DM-19** | **`proof:rf17-net-deletion` gate absent** (named in `KF-TO-GLASSUI-BB-ASKS.md §2`; the S2 arm of `proof:workaround-deletion` subsumes it) | L.W9 | 1 (L→M) | **CANONICALIZE: retire the name; S2 is the authoritative oracle (KISS)** | M.W8 | lane-28 §3/§7 DMM-A. `grep "proof:rf17-net-deletion" scripts/ package.json` → ZERO. The S2 arm (`grep -rn 'pointerHandled\|onPlayPointerDown' demo/` → 0) IS the net-deletion check. **Terminal disposition:** retire the `rf17-net-deletion` name (the S2 subsumption is the KISS path). |
| **DM-20** | **deploy round-trip not yet observed at L close** (L `FINAL.md §S6` HANDOFFS it: gated on `proof:all` GREEN + glass-ui BB peer fix + USER-DOMAIN version cut) | L.WZ | 1 (L→M) | **USER-DOMAIN + Band-C: HANDOFF until the three preconditions satisfy; then OBSERVE + record the EXACT build hash** | M.WZ | lane-27 · lane-28 §7 DMM-C. Preconditions: (1) `proof:all` GREEN on the consolidated runner (M.W1–W4); (2) `proof:peer-satisfied` GREEN (glass-ui BB ⇒ DM-1/DM-5 S1+S2); (3) USER-DOMAIN cut (DM-16 + DM-7). **Terminal disposition:** M.WZ CLAIMS the observed CI→deploy→live-bytes round-trip with the exact build hash, or honestly states what blocked it (the L HANDOFF form is NOT carried to M). |
| **DM-21** | **`@property` drops from `compileToCSS` / `compileChild`** (the compile artifact loses the `@property` block while `CSSKeyframesToString` re-emits it — the L.W1 gate tested the string round-trip, missing the compile-surface gap; inv-M-observable-truth) | L (mis-fixed) | 1 (L→M) | **Band-B-fold (value.js 0.13.0 sufficient — `serializeStylesheetItem` published)** | M.W5 | **lane-01** (replay-equality) · **lane-02** (compiler). **The REAL observable:** a compiled artifact animating a `@property`-registered custom-prop loses its typing block (the L `proof:replay-equality` `@property` row tested `CSSKeyframesToString`, not `compileToCSS`). M.W5 wires `@property` into `compileToCSS`/`compileChild`; `proof:replay-equality` extended — born-RED on today's tree (the compile artifact drops the block). |
| **DM-22** | **named-selector frames → NaN-always-active** (`NAMED_SELECTOR_NO_TIMELINE` is typed at `errors.ts:46` but NEVER thrown; `NAMED_SELECTOR_SUPERTYPE` written at `frame-compiler.ts:128`, never read — a placeholder masquerading as wiring; the L.W1 S4 gate tested no-throw + string round-trip while the real breach is NaN frame-times → every frame always-active) | L (the L.W1 S4 keystone miss) | 1 (L→M) | **Band-A-fold (parse-time throw; the NaN-frame dead-code cure)** | M.W5 | **lane-01** · **lane-31** (precept reckoning ⚠M1). **The REAL observable (inv-M-observable-truth keystone):** named-selector frames compute NaN frame-times → always-active; the L gate tested the PROXY (no-throw + string round-trip). M.W5 makes the parse-time `throw NAMED_SELECTOR_NO_TIMELINE` real OR resolves the frames (never NaN-always-active); the gate tests the NaN observable, born-RED on today's tree. (⚠M1, `M.md:136`.) |
| **DM-23** | **the gate apparatus is over-engineered in its IMPLEMENTATION** (142 leaf gates in `proof:all`; 72 spawn a fresh chromium with zero warm reuse, chained as a serial `&&` of 141 clauses with no report-all → O(N²) iterate-to-green = the owner's 3-hour flag; 264 `waitForTimeout` settle-sleeps; eslint + dependency-cruiser ABSENT) | L (the owner-flag, M-quantified) | 1 (L→M) | **Band-A: the parallel report-all runner + LINT tier + @vitest/browser integration tier + synthetic clock (the transposition to ONE three-tier vitest architecture)** | M.W1–W4 | **lane-13** (apparatus SOTA) · **lane-14** (serial O(N²)) · **lane-15** (two-harness) · **lane-16** (superfluity) · **lane-17** (browser cold-boot) · **lane-18** (precept contrivance). **The REAL observable:** a planted multi-red tree aborts on the FIRST red today (serial `&&`). M.W1 makes it report ALL reds in ONE pass; M.W2 authors `proof:lint-tier` (born-RED — no eslint config exists); M.W3 migrates the 72 runtime gates to `*.browser.test.ts` over ONE shared chromium; M.W4 replaces 264 `waitForTimeout` with a synthetic rAF clock + reforms the runtime-ONLY precept to inv-M-two-axis. **The largest measurable perf win of the tranche** (3-hour → single-digit minutes). (⚠M6/⚠M7/⚠M9, `M.md:141-144`.) |

---

## §3 — THE inv-ε CORRECTIONS (the two M-audit findings — verified against ground truth)

These are the two factual errors the 32-lane re-audit caught in the L close artifacts. Both are
documentation-only corrections (no code defect); both are Read-verified on this tree.

### viol-M4 — FOUR breaking changes, not three (⚠M4, `M.md:139`; lane-27 §1)

**Finding.** `L/FINAL.md:141` ("THREE breaking type changes recorded for…") + `:274` ("…THREE
breaking type changes") UNDER-COUNT. The source documents **FOUR** (Read-verified on this tree):

| # | Breaking change | Source `file:line` (verified) |
|---|---|---|
| 1 | `Animation` → `KeyframesAnimation` | `engine.ts:1192` (`@deprecated Renamed to KeyframesAnimation in 5.0.0`) |
| 2 | `ScrollTimelineOptions` → `KeyframesScrollTimelineOptions` | `timeline.ts:163` (`@deprecated Renamed … in 5.0.0`) |
| 3 | `ScrollTimeline` → `KeyframesScrollTimeline` | `timeline.ts:209` (`@deprecated Renamed … in 5.0.0`) |
| 4 | `presets.flip` → `flipPreset` | `animations.ts:133` (`BREAKING (5.0.0): the access path is now presets.flipPreset`) |

The L FINAL collapsed (2) and (3) into one "ScrollTimeline rename" and omitted the `presets.flip`
break. **M cure (DM-16 + DM-23):** M.WZ's `proof:changelog-5.0.0` names FOUR; the M FINAL.md
version-cadence note states FOUR with the rationale. Precept: inv-ε (no over/under-claim). Not a code
defect — does not affect correctness.

### viol-M5 — value.js `PathGeometry` is PRESENT, not absent (⚠M5, `M.md:140`; lane-25 §3; lane-19)

**Finding.** `deferred-ledger-L.md DLL-21` + `DL-L8` carry the premise that the value.js arc-length
sampler (`PathGeometry` / `getPointAtLength`) is **absent at 0.13.0** and gated on the value.js O
VJ.W4 remainder. This is a **factual error.** value.js 0.13.0 ships it (Read-verified on this tree):

```
node_modules/@mkbabb/value.js/dist/transform/path.d.ts:36  export declare class PathGeometry {
                                                       :40    getTotalLength(): number;
                                                       :46    getPointAtLength(length: number): Point;
                                                       :47    /** As getPointAtLength, but t normalized to [0,1] */
                                                       :61  export declare function getTotalLength(d: string): number;
                                                       :67  export declare function getPointAtLength(d: string, length: number): Point;
```

The `PathGeometry` class is a published, working arc-length sampler (binary-search + local
interpolation over an offline `d`-string — distinct from the DOM's `SVGGeometryElement`, which is for
live elements). **M cure (DM-3):** M.W14 builds `fromMorphSVG` kf-side as a compositor over the
PUBLISHED `PathGeometry` (sample both `d`-strings at N uniform-arc-length intervals, pair, interpolate)
— **NO new value.js API required**, **NO sibling publish gate.** This DISCHARGES the 7-tranche P-inv-28
mandate at M (BUILD-IN, the absolute terminus). Precept: inv-ε (factual error). The `proof:morphsvg-consume`
gate is born-RED on the absent kf-side `fromMorphSVG` (NOT on the sibling, which is present), and the
gate's description must be corrected from "APIs absent in 0.13.0" to "kf-side `fromMorphSVG` not yet built."

---

## §4 — THE P-INVARIANT-28 ROLL-UP (the ≥4-tranche mandatory-exit roster)

Items at M-chronicity ≥4 that P-invariant-28 governs. HANDOFF/BUILD-IN rows exit via a named
consume-edge or a kf build + a born-RED kf gate. VERIFY-ONLY-TERMINATED rows satisfy the mandate via
born-RED oracle provenance (the gate WAS born-RED on the defect tree; the GREEN gate is the close-down
form). Only a bare BOOK would violate — **there are none.**

| Item (DM row) | M chronicity | Exit form | Status |
|---|---|---|---|
| DM-1 RF-17 | 4 | HANDOFF: glass-ui 4.1.0 + `proof:workaround-deletion` S2 | **MUST consume at M (M.W8) — no 5th carry under no-workaround** |
| DM-2 GlassControlPoint | 7 | HANDOFF/BUILD-IN: glass-ui BB OR Option B over LIGHT `Draggable` | **MUST consume OR build-in at M.W14 (re-BOOK CLOSED since L.WZ)** |
| DM-3 MorphSVG | 7 | **BUILD-IN: `fromMorphSVG` over the PUBLISHED `PathGeometry` (viol-M5)** | **MUST exit at M.W14 (build-in — no sibling publish needed; re-BOOK CLOSED)** |
| DM-4 PT-2 packrat | 6 | **KILL: the unsoundness is off the value.js-consumed path** | **Exits via the KILL record (M.W10/W14); the KISS choice** |
| DM-9 CH-1 specular | 5 | VERIFY-ONLY-TERMINATED: `proof:specular-absent-at-rest` GREEN | Satisfies P-inv-28 (born-RED oracle) |
| DM-10 CH-2 typography | 6 | VERIFY-ONLY-TERMINATED: `proof:font-census` GREEN | Satisfies P-inv-28 |
| DM-11 CH-3 mobile | 7 | VERIFY-ONLY-TERMINATED: `proof:spring-slider-continuous` + `proof:subject-animates` GREEN | Satisfies P-inv-28 |
| DM-12 CH-4 dock | 5 | VERIFY-ONLY-TERMINATED: `proof:perf-frame-budget` GREEN | Satisfies P-inv-28 |
| DM-13 CH-5 empty-value | 5 | VERIFY-ONLY-TERMINATED: `proof:engine-no-throw-on-play` GREEN | Satisfies P-inv-28 |
| DM-14 CH-6 DFA suspend | 4 | VERIFY-ONLY-TERMINATED: `proof:fsm-suspend-resume-live` GREEN | **NEWLY ≥4; satisfies via BORN-RED oracle; re-verify on M dist** |
| DM-15 scene-control-dfa | 4 | VERIFY-ONLY-TERMINATED: `proof:control-surface-single-writer` GREEN | **NEWLY ≥4; satisfies via BORN-RED oracle; re-verify on M dist** |

**Items that MUST terminate in M (re-BOOK CLOSED since L.WZ):**
- **DM-2 GlassControlPoint** (7-tranche): consume OR build-in Option B (a `DemoControlPoint` over the
  LIGHT `Draggable`).
- **DM-3 MorphSVG** (7-tranche): **BUILD-IN over the published `PathGeometry`** (viol-M5 corrected — no
  sibling gate).

**Items that SHOULD terminate in M with a valid exit form:**
- **DM-1 RF-17** (4-tranche): no-workaround forbids a 5th carry; MUST consume on glass-ui 4.1.0 (M.W8).
- **DM-4 PT-2 packrat** (6-tranche): the **KILL** (off-consumed-path reframe) is the KISS choice.

---

## §5 — KILL RECORD (the DM-4 packrat — the standing M anti-charter addition)

The L 13 KILLs (DLL-33…DLL-45: VT-A/B, CE-2/3, EPF-2/5, K-T1/T3, CC-7-blanket-@starting-style, ED-6,
PHYS-A, Worker/OffscreenCanvas/GPU, GEN-1) carry as M's standing anti-charter (non-re-litigable). M
adds **W100 incremental/streaming parse** (re-affirmed KILL — full reparse of a 10-keyframe block is
sub-ms inside the 300ms editor debounce; BOOK-with-tripwire only) and **`generate()`** (the L.W6
anti-charter — the LLM generates, kf validates+compiles). M ALSO converts DM-4 from HANDOFF to KILL:

> **DM-4 PT-2 packrat soundness — KILL** (the LR grow-path `id`-only key is NOT exercised by value.js's
> grammar; the published 0.9.0 dist already uses a composite `(id,offset)` key on all production code
> paths; any future opt-in consumer of the LR grow path must author `proof:packrat-sound` as its OWN
> gate-first obligation before using that path).

Evidence anchor: `packrat.ts` self-document; lane-25 §4; lane-20; lane-28 §5.

---

## §6 — THE `proof:chronic-closure` SUBSTRATE TRANSITION (the M.WZ final motion — NOT executed here)

At M.WZ the orchestrator performs the atomic re-point in ONE commit (the K.WZ→J / L.WZ→K precedent):

1. `scripts/proof-chronic-closure.mjs:114` `CHRONIC_LEDGER` changes from
   `docs/tranches/L/PROGRESS.md` to `docs/tranches/M/PROGRESS.md`.
2. The non-vacuity planted-probe proof: three deliberately-malformed M-ledger rows (a FOLD citing a
   source-shape gate as a runtime oracle; a HANDOFF targeting an unpublished future version with no
   consume-edge; a ≥4-tranche bare BOOK) RED on all three clause shapes BEFORE being removed so the
   clean M ledger GREENs.
3. `proof:chronic-closure` runs → exit 0 on the clean M ledger.

This is the ORCHESTRATOR'S ATOMIC FINAL MOTION — NOT executed by this DOCS-ONLY lane. The DM rows
above (DM-1 through DM-23) form the proposed `M/PROGRESS.md §"Open deferrals"` substrate; M.WZ refines
and finalizes them.

---

## §7 — DISPOSITION SUMMARY

| Tag | Count | Rows |
|---|---|---|
| **HANDOFF (sibling-gated)** | 5 | DM-1 · DM-2 · DM-5 · DM-6 · DM-7 |
| **BUILD-IN (viol-M5 corrected)** | 1 | DM-3 |
| **KILL** | 1 | DM-4 |
| **USER-DOMAIN** | 2 | DM-7 (publish) · DM-16 (cut) |
| **VERIFY-ONLY / RE-AFFIRM** | 7 | DM-8 … DM-15 (DM-9 + DM-12 RE-AFFIRM; the rest VERIFY-ONLY) |
| **NET-NEW M (Band-A/B correctness + apparatus)** | 7 | DM-17 … DM-23 |

(DM-7 is counted under both HANDOFF and USER-DOMAIN — it is the USER-DOMAIN publish of a HANDOFF row.)

**P-INVARIANT-28 CLOSURE ASSERTION.** Every DM row carries (a) a tag, (b) a named owning wave, and
(c) a named tripwire or terminal disposition. **Zero rows are bare BOOKs.** The two 7-tranche items
(DM-2 GlassControlPoint, DM-3 MorphSVG) EXIT at M (build-in Option B / build-in over published
`PathGeometry`); the 6-tranche DM-4 EXITS via KILL; the 4-tranche DM-1 MUST consume at M.W8. The
VERIFY-ONLY-TERMINATED ≥4-tranche rows (DM-9…DM-15) satisfy P-inv-28 via born-RED oracle provenance.
The two inv-ε corrections (viol-M4 FOUR breaking changes, viol-M5 `PathGeometry` PRESENT) are folded
into DM-16/DM-3 and §3, each Read-verified on this tree.

---

## §8 — EVIDENCE INDEX (re-verified on this tree)

- `scripts/proof-chronic-closure.mjs:114` `CHRONIC_LEDGER` = `docs/tranches/L/PROGRESS.md` (the L close
  re-point; M.WZ re-points to M) — lane-28 §0.
- `proof:workaround-deletion` 0 GREEN / 5 PENDING / 0 RED (re-run live) — lane-26, lane-28 §0.
- `proof:control-point-live` RED-BY-DESIGN (ZERO hits in glass-ui@4.0.0 dist) — lane-25 §2, lane-28 §0.
- `proof:peer-satisfied` RED-BY-DESIGN (glass-ui@4.0.0 peer `^0.10.0||^0.11.0` rejects 0.13.0) — lane-23.
- **viol-M4:** `engine.ts:1192`, `timeline.ts:163`, `timeline.ts:209`, `animations.ts:133` — four
  breaking-change annotations (Read-verified); `L/FINAL.md:141`+`:274` say "THREE" — lane-27 §1.
- **viol-M5:** `node_modules/@mkbabb/value.js/dist/transform/path.d.ts:36-67` — `PathGeometry` class +
  `getTotalLength`/`getPointAtLength` PRESENT at 0.13.0 (Read-verified); installed value.js 0.13.0 —
  lane-25 §3, lane-19.
- `scripts/proof-packrat-sound.mjs` ABSENT; `scripts/proof-css-parity.mjs` ABSENT (gate-first state) —
  lane-28 §3.
- Registry probes (live): glass-ui `4.0.0` · value.js `0.13.0` · parse-that `0.9.0` · keyframes-vue E404.
- Predecessor: `docs/tranches/L/audit/deferred-ledger-L.md` (51 DLL rows, TERMINAL at L.WZ).
- Seed: `docs/tranches/M/audit/lane-28-chronic-ledger.md` (the 20-row DM substrate).
