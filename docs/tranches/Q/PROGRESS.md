# Tranche Q — PROGRESS board (the no-deferral terminal tranche)

**Branch:** `tranche-q-dev` (Q development phase; rides the impl-drive tip — kf **4.4.0** shipped + live).
**Status:** **DEVELOPMENT PHASE.** This board + the Q charter (`Q.md`) + the Q.W\* wave specs + the
dispatch docs are authored docs; **no engine/demo/library/gate source is written.** Implementation
opens per-repo on explicit owner authorization, DAG-ordered, gated on each repo's own green CI.
**Version in tree:** **4.4.0** (the impl-drive cut; pins `@mkbabb/value.js` `^1.1.0`). The Q version
narrative: **5.0.0** (BREAKING — alias drop) → **5.1.x** (additive — perf + demo + emerging-CSS-P2
consuming value.js 1.2.0). Both cuts are USER-DOMAIN (Q.WZ).
**inv-16:** kf authors only keyframes.js; every cross-repo need is a DISPATCH doc (Band G), never a
foreign-tree edit. The owner mandate: NO quick solutions, NO workarounds — idiomatic, gestalt; NO
legacy code; **NO deferrals in Q** (every deferred + chronic item gets a complete terminal wave).

---

## §0 — THE HEADLINE (why Tranche Q exists atop the impl drive)

The impl drive shipped the constellation's critical path (parse-that 0.12.0 + value.js 1.1.0 +
kf 4.4.0 + the verified redeploy) and closed three genuine multi-tranche chronics in-realm (DM-3
fromMorphSVG built; DM-5 S9 parse-that dep removed; the S8 WeakMap realm-clean belt-exit). But
**"totality" was NOT reached:** ~10 planned waves were consciously deferred, and the 31-lane audit
found that **every deferral is a latent mid-tranche-deferral spring** — plus three NEW issues born in
the drive (the 0.12.0 packrat src-epoch re-entrancy defect; the 0.12.0 dead public API; value.js
BEHIND the platform on `contrast-color()`). And the deceptive-ledger findings: **DM-2
DemoControlPoint is a NINTH carry** (the worst P-inv-28 violation in the constellation); the
`proof:workaround-deletion` S1/S2 arms are **false-RED**; `proof:ci-coverage` is **RED** on the
impl-drive tree; **`CHRONIC_LEDGER` is pinned 3 tranches stale** (the M.WZ/O.WZ/P.WZ re-points ALL
skipped). Q is the **terminal** tranche that closes ALL of this with no new deferral.

The close criterion is unique to Q (the no-deferral law): not "the bands that landed are green" but
**"every Q wave gate is green AND every chronic is discharged with a system-gate exit"** — no
"ABSOLUTE FINAL" without a gate that BIT (the DM-2 lesson).

---

## §1 — THE WAVE BOARD (the 8-band roster, the phase, the DAG state)

**Phase axis:** NOW (kf-internal, executable on authorization) · DISPATCH (a cross-repo ask, authored
in-tree, scheduled by the sibling) · GATED (fires atomically on a named sibling publish) · USER-DOMAIN
(the owner's publish/KILL hand).

| Band | Wave | Phase | DAG predecessor(s) | Headline |
|---|---|---|---|---|
| **A** | **Q.W0** | NOW | — (the floor) | record-hygiene + shipped-truth reconcile + CHRONIC_LEDGER substrate authoring |
| **A** | **Q.WA1** | NOW | Q.W0 | the SLIM lint tier (dep-cruiser ONLY — eslint KILLED-down, redundant with tsc --strict + prettier-organize-imports; the 3-tranche carry) |
| **A** | **Q.WA2** | NOW | Q.W0 | drag2D LIGHT barrel export certification (the DemoControlPoint enabler) |
| **A** | **Q.WA3** | NOW | Q.W0 | CI-green + **master-merge reconcile (the FIRST motion)** + `proof:ci-coverage` fix + deploy round-trip oracle + device-dependence harden |
| **A** | **Q.WA4** | NOW | Q.W0 | `proof:wave-charter` + the DAG manifest + the constellation pin-ledger witness |
| **B** | **Q.WB1** | NOW | Q.WA4 | emerging-CSS Phase-2 element-aware arm (`if(style(--p))` / `sibling-index()` / `sibling-count()`) |
| **B** | **Q.WB2** | GATED | value.js 1.2.0 dashed-call parse (Q.WG2) | @function call-inlining |
| **B** | **Q.WB3** | NOW (color GATED) | Q.WA4; ColorChannelPlan (Q.WG2) for color | SoA completion (`processFrame` Float64 fold + the S8 `.fnName` parallel-array FALLBACK terminal — §S6, fires only on a VJ-Q4 decline; the PRIMARY is the Q.WG4 VJ-Q4 consume) |
| **B** | **Q.WB4** | NOW | Q.WA4 | WAAPI curvature-adaptive sub-segment densify |
| **C** | **Q.WC1** | NOW | Q.WA2 | **DemoControlPoint build-in** (the DM-2 9th-carry MANDATORY terminal) |
| **C** | **Q.WC2** | NOW | Q.WC1 | easing curve-editor dogfooding DemoControlPoint + the hero promotion |
| **C** | **Q.WC3** | NOW | Q.WA4 | N-Stage + the unbuilt mobile (scroll-snap carousel + typed-directional VT) |
| **C** | **Q.WC4** | NOW | Q.WA4 | the MorphSVG demo scene + the on-DOM render contract + orient-along-path |
| **C** | **Q.WC5** | NOW | Q.WA4 | amiga telemetry + residual scene refinements |
| **D** | **Q.WD1** | NOW | Q.WA4 (internal: bind-seam → play-guard) | the NaN-frame proper cure (deferred-resolution + play-time guard) |
| **D** | **Q.WD2** | NOW | Q.WA4 | grammar-fuzz fast-check arbitraries + the differential-vs-browser oracle |
| **E** | **Q.WE1** | NOW | Q.WA3, Q.WA1 | the @deprecated alias DROP + the ~33-consumer migration + `MIGRATION-5.0.0.md` |
| **E** | **Q.WE2** | GATED | value.js `/math` subpath (Q.WG2) | the leaves.ts externalization |
| **F** | **Q.WF1** | NOW | Q.WE1 (splits a CLEAN class) | engine.ts 1397→~900 split (lift the playback machine) |
| **F** | **Q.WF2** | NOW | Q.WA4 | the group.ts SoA decomposition |
| **G** | **Q.WG1** | DISPATCH | — | parse-that 0.13.0 (delete dead API; packrat re-entrancy; `*Span` decide; perf on the real corpus) |
| **G** | **Q.WG2** | DISPATCH | Q.WG1 | value.js 1.1.1 + 1.2.0 (`contrast-color()`; `if()` multibranch; color-arch out-params; VJ-L1 `.fnName`; `/math`; dashed-call) |
| **G** | **Q.WG3** | DISPATCH (USER-DOMAIN) | — | glass-ui BC (SegmentedTabs aria guard + dock collapse-crossfade) → kf S1/S2 delete GATED |
| **G** | **Q.WG4** | GATED | value.js 1.2.0 (Q.WG2) | the kf GATED consumes (re-pin `^1.2.0` → @function inline + leaves externalize + S8 VJ-L1 + if-multibranch) |
| **Z** | **Q.WZ** | NOW-author · USER-DOMAIN publish | ALL bands at terminal disposition | the terminal close + the 5.0.0/5.1.x cuts + the keyframes-vue belt terminal + the deploy round-trip |

**Band-G wave-id ↔ file map (so every `Q.WG*` reference resolves to its authored doc).** The Band-G
waves are authored across the three dispatch docs + the two GATED-consume wave specs; the wave-ids map:

| Wave-id | Authored file(s) | Role |
|---|---|---|
| **Q.WG1** | `KF-TO-PARSETHAT-Q.md` | the parse-that 0.13.0 DISPATCH (dead-API delete; packrat re-entrancy; `*Span` decide; perf) |
| **Q.WG2** | `KF-TO-VALUEJS-Q.md` | the value.js 1.1.1 + 1.2.0 DISPATCH (`contrast-color()`; `if()` multibranch; color-arch out-params; **VJ-Q4 `flatLeaf .fnName` — the PRIMARY S8 terminal**; `/math`; dashed-call; `ColorChannelPlan`) |
| **Q.WG3** | `KF-TO-GLASSUI-Q.md` | the glass-ui BC DISPATCH (SegmentedTabs aria guard + dock collapse-crossfade) → kf S1/S2 delete GATED |
| **Q.WG4** | `waves/Q.WG-GATED-CONSUMES.md` (the GATED atomic re-pin + consume edges) **+** `waves/Q.WG-S1S2-HYGIENE.md` (the NOW gate-hygiene retarget that precedes the GATED S1/S2 deletes) | the kf GATED consumes (re-pin `^1.2.0` → @function inline + leaves externalize + the S8 VJ-Q4 PRIMARY consume + if-multibranch + color-SoA; glass-ui re-pin → S1/S2 delete) |

**DAG state (Q.md §3 — acyclic, fully sequenceable, zero required mid-tranche deferrals):**

```
Q.WA3 master-merge-reconcile (NOW, all 3 repos to master — the FIRST motion)
   │
   ├─► parse-that 0.13.0 (Q.WG1) ─► value.js 1.1.1/1.2.0 (Q.WG2) ─► kf GATED consumes (Q.WG4)
   │                                      ├─► Q.WB2 @function inline (GATED: dashed-call parse)
   │                                      ├─► Q.WE2 leaves externalize (GATED: /math subpath)
   │                                      └─► Q.WB3-color SoA (GATED: ColorChannelPlan)
   │
   ├─► Q.WA2 drag2D LIGHT export ─► Q.WC1 DemoControlPoint ─► Q.WC2 easing-editor dogfood
   │
   ├─► Q.WD1-bind attach-resolution seam ─► Q.WD1 play-time guard (NEVER a parse-throw — the S4 floor)
   │
   └─► Q.WE1 alias-drop + ~33-consumer migrate ─► Q.WF1 engine.ts split (CLEAN class) ─► Q.WZ 5.0.0 cut
                                                                                          │
   glass-ui BC publish (Q.WG3, USER-DOMAIN) ─► kf S1/S2 delete (GATED) ──────────────────► Q.WZ
```

---

## Open deferrals

**THE chronic-closure parse substrate (for `proof:chronic-closure`) — the Q consolidated
open-deferrals ledger.** The DIRECT successor to L/M/O/P's (the M.WZ/O.WZ/P.WZ re-points were ALL
skipped — `CHRONIC_LEDGER` sat pinned 3-tranche-stale at `docs/tranches/L/PROGRESS.md`). Every prior
chronic is re-stated here with its Q-terminal disposition + chronicity integer, so no chronic drops
across the L→Q multi-tranche skip. The atomic **L→Q** re-point IS LANDED at **Q.WZ** (S1):
`scripts/proof-chronic-closure.mjs` now pins `CHRONIC_LEDGER = docs/tranches/Q/PROGRESS.md` +
`LEDGER_LABEL = "Q/PROGRESS.md"`. The durable audit companion is
`docs/tranches/Q/audit/chronic-ledger-Q.md`.

> **SUBSTRATE-TRANSITION NOTE (LANDED — the Q ledger is now the AUTHORITATIVE parse target).** The
> live `CHRONIC_LEDGER` in `scripts/proof-chronic-closure.mjs` points at THIS file
> (`docs/tranches/Q/PROGRESS.md §"Open deferrals"`) and `LEDGER_LABEL = "Q/PROGRESS.md"`. The L→Q
> re-point + the gate-code co-edits + the non-vacuity planted-row proof are ONE atomic Q.WZ §S1 commit.
> The L/K/J/I/H tables remain narrative history. This section's heading is EXACTLY `## Open deferrals`
> and the rows below are ONE flat table (the L/K/J/I shape `parseChronicTable` accepts byte-for-byte) —
> the band grouping (BUILD-IN / HANDOFF / USER-DOMAIN / FOLD-LANDED / VERIFY-ONLY / NET-NEW) is carried
> in each row's leading tag + its Disposition cell, NOT in `### A…F` sub-headings (which would end the
> single-table parse region).
>
> **GATE-CODE CO-EDIT NOTE (the Q.WZ §S1 re-point landed these, VERIFIED non-vacuous by the planted-row
> RED proof).** The Q ledger introduced substrate facts the gate code (frozen at the L/K substrate)
> could not parse; the re-point commit carried: (1) the `BUILD-IN` disposition is now EXIT-shaped
> (`isExitShaped()` gained `DISP.buildIn`) — the Q ledger uses it on the ≥4-tranche rows **DM-2 (9)** and
> **DM-22 (4)**, the strongest P-inv-28 exit (a kf-owned ABSOLUTE terminal); (2) the `EXPECTED` coverage
> array re-targets the L `CH-1…CH-6` tokens to the Q DM-N identity tokens (CH-1→DM-9 · CH-2→DM-10 ·
> CH-3→DM-11 · CH-4→DM-12 · CH-5→DM-13 · CH-6→DM-14 · + DM-15 scene-control-dfa) — the Q ledger renamed
> every chronic to its DM-N identity; (3) THIS substrate was FLATTENED to one table under an exact
> `## Open deferrals` heading (the spec's PREFERRED, lower-risk path — no parser change, the gate's
> flat-table reader is untouched). The gate CONTRACT is unchanged (it learned the Q substrate's
> vocabulary + shape, nothing more).
>
> **CHRONICITY COLUMN SHAPE (binding grammar contract):** every row's Chronicity cell leads with an
> explicit INTEGER tranche-span count; the gate reads the leading integer ONLY; the ≥4-tranche
> EXIT-ONLY mandate (P-invariant-28) is enforced mechanically off that integer. A row with NO machine
> integer (`FOLD-LANDED`, `1 (Q)` net-new) is read as <4 and is not held to the EXIT-ONLY clause —
> those rows close by their own band discipline.
>
> **DISPOSITION VOCABULARY:** `FOLD` · `HANDOFF` · `RE-AFFIRM` · `VERIFY-ONLY` · `BOOK` · `KILL` ·
> `USER-DOMAIN` · `BUILD-IN` (a kf-owned ABSOLUTE terminal — the strongest exit) · `FOLD-LANDED`
> (tripwire FIRED + gate GREEN) · `OUT`.
>
> **BAND GROUPING (carried in each row's tag, NOT in sub-headings):** **[A] BUILD-IN** (kf-owned, no
> sibling gate — the P-inv-28 ABSOLUTE terminals) · **[B] HANDOFF** (sibling-gated; tripwires live; the
> P-inv-28 belt) · **[C] USER-DOMAIN** (the owner's publish/KILL hand) · **[D] FOLD-LANDED** (tripwires
> FIRED; gates GREEN — no further carry) · **[E] VERIFY-ONLY / RE-AFFIRM** (terminated chronics;
> re-verify the GREEN state on the Q 5.0.0/5.1.x dist — the LAST live re-verify was the M/4.4.0 dist;
> any gate that reverts RED is a NEW Q regression to wave-assign) · **[F] NET-NEW Q obligations**
> (gate-first FOLD / DISPATCH; not carried as a prior-DM row).

| Item | Born | Chronicity | Disposition | Owning Q wave | Gate / evidence (closure oracle) |
|---|---|---|---|---|---|
| **[A] DM-2 GlassControlPoint → `DemoControlPoint`** (the NINTH carry — declared "ABSOLUTE FINAL" at O.W5 AND P.W7, never built; the worst P-inv-28 violation in the constellation) | E | **9 (E…M,O,P→Q)** | **BUILD-IN — LANDED at Q.WC1 (the MANDATORY exit; no 10th carry)** | **Q.WC1** (build) + **Q.WC2** (dogfood) | `proof:demo-control-point` GREEN (correctness-tier RUNTIME gate — opens the built dist + drives a live `page.mouse` drag, 5 clauses): `demo/@/components/custom/DemoControlPoint.vue` built over the LIGHT `drag2D` (`index.ts:88`), critically damped (`springOptions:{dampingFraction:1}`); `EasingCurveCanvas.vue` consolidated onto it (the bespoke `useEasingCurveDrag` CTM handler removed, the file deleted); the live drag re-shapes the bezier `d` AND re-times the subject ball (live-drag keystone), the handle lands on the drop point with no ring (damped-no-overshoot), and it arrow-key-nudges (keyboard-operable). **Born-RED:** the gate BIT on the unbuilt tree (the control-point absent from `demo/`, the curve-editor on the bespoke CTM handler). The glass-ui control-point-live tripwire was already RETIRED (Q.WA2/S2 — the `KF-TO-GLASSUI §GlassControlPoint` ask WITHDRAWN, BC ASK#5 = NO, `KF-INBOUND.md:16,30`). **The drag2D orphan-export RE-SCOPE is DISCHARGED** — `DemoControlPoint.vue` is the LIGHT `drag2D`/`Drag2DHandle` first live consumer (the CONTRIVANCE-AUDIT "no barrel export without a live consumer" RE-SCOPE). **No 10th ride.** |
| **[A] DM-22 named-selector NaN-frame** (the proper cure — the impl drive's parse-throw was REVERTED for breaking L.W1 S4 opaque-ingest) | L.W1 | **4 (L,M,O,P→Q)** | **BUILD-IN — deferred-resolution + PLAY-time guard (NOT a parse-throw)** | **Q.WD1** | `proof:nan-frame` GREEN (4 clauses, born-RED — the gate BIT on the NaN frame-times the named-selector ingest produced before the cure): S4 ingest round-trip preserved (parse never throws); the named phase resolves to numeric % at attach under a Scroll/ManualTimeline; `NAMED_SELECTOR_NO_TIMELINE` throws at PLAY-without-timeline (NOT at parse); zero NaN frame-times at play. |
| **[B] DM-1 RF-17 / dock click-strand interim** (`onPlayPointerDown` / `pointerHandled` in `TransportDock.vue`, 9 sites) | I (BLK-8) | **7 (I,J,K,L,M,O,P→Q)** | **HANDOFF — consume glass-ui BC cut + delete S2 atomically** | **Q.WG3** | `proof:workaround-deletion` S2 — the FALSE-RED corrected NOW (Q.WG3 retargets the version-probe to a content-present probe for `useDockClickIntegrity` in the installed dist); S2 GREEN on the BC re-pin + atomic deletion. **P-inv-28 (7-tranche — CRITICAL BELT):** no 8th carry; the contingency KILL record carries, VOID the instant BC ships. |
| **[B] DM-5 S1 aria-orientation suppress** (`:aria-orientation="undefined"` at `SpringSidebar.vue:43` + `AnimationControls.vue:72`) | K | **5 (K,L,M,O,P→Q)** | **HANDOFF — S1 delete GATED on the BC SegmentedTabs `role=group` conditional aria guard** | **Q.WG3** | `proof:workaround-deletion` S1 — the FALSE-RED corrected NOW (content-present guard probe, not a version probe); S1 GREEN on the BC SFC-guard publish + the kf delete. If BC slips, the contingency (a kf-internal ARIA-compliant replacement — a KILL of the band-aid, not a 6th carry) is named in the FINAL. |
| **[B] DM-5 S8 FN_NAME clone-restamp ceremony residual** (the WeakMap is realm-clean; the ceremony stays — honest inferiority) | K | **4 (K,L,M,O,P→Q)** | **HANDOFF (PRIMARY — the clean VJ-Q4 `flatLeaf .fnName` consume) + BUILD-IN (FALLBACK — the in-realm parallel-array terminal, only on a VJ-Q4 decline)** | **Q.WG4** (the PRIMARY VJ-Q4 consume, `Q.WG-GATED-CONSUMES` S4) · **Q.WB3 §S6** (the in-realm FALLBACK) | `proof:no-foreign-symbol-stamp` GREEN (realm-clean, shipped); `proof:workaround-deletion` S8 flips PENDING→GREEN on the PRIMARY VJ-Q4 `.fnName` consume (GATED on value.js 1.2.0) OR — if value.js declines VJ-Q4 — the in-realm parallel-array FALLBACK (Q.WB3 §S6). The two are MUTUALLY EXCLUSIVE (no double-cure); the dispatch (`KF-TO-VALUEJS-Q.md` VJ-Q4) declares VJ-Q4 PRIMARY. |
| **[C] DM-7 keyframes-vue 0.1.0 unpublished** (E404; peer floor `>=4.3.0`; the P-inv-28 belt CROSSED at the impl drive — kf 4.4.0 shipped WITHOUT it) | K.W12 | **5 (K,L,M,O,P→Q)** | **USER-DOMAIN — the MANDATORY exit (publish runbook OR owner-ratified KILL; NO 6th carry)** | **Q.WZ** (S3) | `proof:keyframes-vue-published` clause (b) RED-BY-DESIGN (E404); GREEN on the USER-DOMAIN publish + `PEER_FLOOR` bump to 5.0.0. The COMPLETE runbook (peer-floor bumps + the pre-cut `npm run check` + the `release.yml` `needs: publish` job) is in Q.WZ §S3. |
| **[C] DM-16 5.0.0 version cut** (the breaking alias drop; the planned major the impl drive never cut — shipped 4.4.0 MINOR instead) | L.W8 | **4 (L,M,O,P→Q)** | **USER-DOMAIN** | **Q.WZ** (S2) | `proof:changelog-5.0.0` (authored gate-first at Q.WE1, the SINGLE owner, beside `proof:alias-dropped`) — born-RED until the breaking set is documented; GREEN on the 5.0.0 cut + wired into `release.yml`. |
| **[C] DM-20 deploy round-trip** (re-observed on the cut) | L.WZ | **4 (L,M,O,P→Q)** | **USER-DOMAIN + BAND-Z** | **Q.WZ** (S6) | the live-byte oracle: CI→deploy auto path re-verified on the close-merge; the live `index-<hash>.js` EQUALS the merge-SHA `dist/gh-pages` artifact. |
| **[D] DM-3 MorphSVG → `fromMorphSVG`** (the 7-tranche ABSOLUTE — BUILT at the impl drive) | C | **FOLD-LANDED** (commit `69ca7bf`) | **FOLD-LANDED** | the impl drive | **TERMINAL — FOLD-LANDED.** Non-gate terminal mechanism: the morphsvg-consume node probe + its vitest corpus (proof:morphsvg-consume — `morph-svg.ts`; 13 tests, off-DOM, a path-interpolation data-model lock with no browser to drive) GREEN, born-RED on the absent-`fromMorphSVG` tree (the gate BIT). Named in prose, NOT a runtime closure oracle. Q.WC4 EXTENDS it with a demo-scene clause (the showcase the primitive enables). |
| **[D] DM-5 S9 parse-that direct import** (the production dep — REMOVED at the impl drive) | K | **FOLD-LANDED** (4→exit) | **FOLD-LANDED** | the impl drive | **TERMINAL — FOLD-LANDED.** Non-gate terminal mechanism: the boundary node probe (proof:boundary W96 — an import-graph census, off-DOM; the prod dep removed from `package.json`) GREEN, born-RED when the direct `@mkbabb/parse-that` specifier was present (the gate BIT). `utils.ts:9` now consumes value.js `parseCSSSubValue`; ZERO `@mkbabb/parse-that` specifiers. Named in prose, NOT a runtime closure oracle. |
| **[D] DM-5 S7 linear() flat-comma regex** | K | **FOLD-LANDED (RETIRED)** | **FOLD-LANDED** | M.W9 | **TERMINAL — FOLD-LANDED.** Non-gate terminal mechanism: the workaround-deletion node probe (proof:workaround-deletion S7 — a source-present detector, off-DOM) GREEN, the flat-comma regex workaround removed; born-RED when the regex was present (the gate BIT). Named in prose, NOT a runtime closure oracle. |
| **[D] DM-4, DM-6, DM-17, DM-18, DM-19, DM-25** | E-M | **FOLD-LANDED** | **FOLD-LANDED** | O.W2 intakes | **TERMINAL — FOLD-LANDED.** Non-gate terminal mechanism: each per-gate node-probe GREEN per the O/P deferred-ledger §1c (the source-shape locks removed/landed, off-DOM), born-RED on its origin defect tree. Named in prose, NOT runtime closure oracles. |
| **[E] DM-8 Lighthouse floors** | B-era | 5 (L,M,O,P,Q) | **VERIFY-ONLY** | **Q.WZ** | **TERMINAL — VERIFY-ONLY.** Non-gate terminal mechanism: a measured quiet-host artifact (the lighthouse-mobile runner, proof:lighthouse-mobile, re-run with `KF_REQUIRE_LH=1` on the Q dist — a load-rest score, never CI-hard-gated per inv-device-honesty). Named in prose, NOT a runtime closure oracle; the K/M floors are the hard floor, any regression RED. |
| **[E] DM-9 specular** | D(D14)→H | **8 (D,H,I,K,L,M,O,Q)** | **RE-AFFIRM** | **Q.WZ** | `proof:specular-absent-at-rest` GREEN; re-verify. |
| **[E] DM-10 typography** | D(D7)→I | **9 (D,I,J,K,L,M,O,P,Q; TERMINATED)** | **VERIFY-ONLY** | **Q.WZ** | `proof:font-census` GREEN (correctness-tier RUNTIME gate — opens the dist + navToScene-drives a computed-font census across all scenes); re-run on the Q dist. **Born-RED** in its origin tranche (the dock voice resolved system-sans; font-census BIT on the display tokens before the root fix). |
| **[E] DM-11 mobile** | D(D10) | **10 (D,H,I,J,K,L,M,O,P,Q; TERMINATED)** | **VERIFY-ONLY** | **Q.WZ** | `proof:spring-slider-continuous` + `proof:subject-animates` GREEN (both correctness-tier RUNTIME gates — drive the live spring slider + the mobile-emulated subject motion over the dist); re-run. **Born-RED** in K (the thumb `changeCount:0` over 240 frames + the spring slider literally stepped; the gates BIT before the 60 Hz painter cure). |
| **[E] DM-12 dock perf** | D(D5/D9) | **8 (D,H,I,K,L,M,O,Q)** | **RE-AFFIRM** | **Q.WZ** | `proof:perf-frame-budget` GREEN (correctness-tier RUNTIME gate — drives the dock interaction + reads the frame budget); re-verify WITH the SoA-`processFrame` + the engine split in place. **Born-RED:** the dock STRETCH + lag BIT pre-cure. |
| **[E] DM-13 empty-value** | A(W0)→H | **8 (A,H,I,K,L,M,O,Q)** | **VERIFY-ONLY** | **Q.WZ** | `proof:engine-no-throw-on-play` GREEN (correctness-tier RUNTIME gate — opens the dist + clicks play on an empty-value input, asserting no throw); re-run WITH the NaN-frame play-time guard in place (the KEY interlock — the guard fires ONLY at PLAY-without-timeline on a named selector). **Born-RED** in its origin tranche (the empty-input parse threw on play; the gate BIT on that crash). |
| **[E] DM-14 DFA suspend** | H | **7 (H,I,K,L,M,O,Q)** | **VERIFY-ONLY** | **Q.WZ** | `proof:fsm-suspend-resume-live` GREEN (correctness-tier RUNTIME gate — drives the live FSM suspend/resume over the dist); re-run. **Born-RED** in its origin tranche (the `_gen` DFA suspend threw; the gate BIT on that crash). |
| **[E] DM-15 scene-control-dfa** | I (post-close) | **7 (I,J,K,L,M,O,Q)** | **VERIFY-ONLY** | **Q.WZ** | `proof:control-surface-single-writer` GREEN (correctness-tier RUNTIME gate — navToScene-drives the dock projection from the DFA per expected state); re-verify. **Born-RED** on CI run `27228309606` (trigger='null'-under-load before the cure; the gate BIT). |
| **[F] DQ-1 the 0.12.0 packrat src-epoch re-entrancy defect** (per-memoizeFn-call reset, not at the parseState entry boundary; a nested `.parse(differentSrc)` mid-grow wipes module-global state; a >1MB source aliases memo cells) | Q (impl drive) | 1 (Q) | **DISPATCH → parse-that 0.13.0 (the named try/finally hardening + the key widen)** | **Q.WG1** | gate-first DISPATCH: author `proof:perf` first (in the parse-that repo — perf on the real CSS corpus + a re-entrancy correctness test) when parse-that 0.13.0 publishes the try/finally hardening; the dispatch carries a terminal-or-KILL (`KF-TO-PARSETHAT-Q.md`). |
| **[F] DQ-2 the 0.12.0 dead public API** (`thenMap`, `fuse()`, the `dispatch` subTable + the 15 `*Span` builders — ZERO consumers, contradicts parse-that's own substrate-deadcode precept) | Q (impl drive) | 1 (Q) | **DISPATCH → parse-that 0.13.0 (delete dead API; decide `*Span` adopt-or-deprecate)** | **Q.WG1** | gate-first DISPATCH: author `proof:no-dead-combinator` first (in the parse-that repo — greps the parse-that surface for any export with zero in-realm consumers) on the 0.13.0 dead-API delete; the dispatch carries a terminal-or-KILL (`KF-TO-PARSETHAT-Q.md`). |
| **[F] DQ-3 value.js BEHIND the platform on `contrast-color()`** (Baseline April 2026 — parses only as an opaque value; inverts the library-leads precept) | Q (impl drive) | 1 (Q) | **DISPATCH → value.js 1.1.1 (HANDOFF — published-consume-edge)** | **Q.WG2** | gate-first HANDOFF: author `proof:contrast-color-consume` first (kf-side, GATED) — born-RED until value.js 1.1.1 ships the parser; the published-consume-edge lights the gate on the value.js 1.1.1 publish + kf re-pin (`KF-TO-VALUEJS-Q.md`). |
| **[F] DQ-4 the false-RED S1/S2 arms** (proof:workaround-deletion version-probe, no content-probe) | Q (impl drive) | 1 (Q) | **FOLD → Q.WG3 (retarget to a content-present probe NOW)** | **Q.WG3** | **TERMINAL — FOLD.** Non-gate terminal mechanism: the workaround-deletion node probe (proof:workaround-deletion S1/S2 — a source-present detector over the installed dist, off-DOM) is retargeted to a content-present probe; it reports PENDING (the guard absent from the installed dist), not FALSE-RED on a version mismatch. Born-RED on the version-probe false-RED tree (the gate mis-fired before the retarget). Named in prose, NOT a runtime closure oracle. |
| **[F] DQ-5 ci-coverage RED** (6 new impl-drive gates unwired) + the stale decision-JSONs (`spring-vector-decision.json` dirty) | Q (impl drive) | 1 (Q) | **FOLD → Q.WA3 (CI-wire) + Q.W0 (commit the decision-JSONs)** | **Q.WA3 / Q.W0** | **TERMINAL — FOLD.** Non-gate terminal mechanism: the ci-coverage node probe (proof:ci-coverage — a bidirectional CI↔proof:all census, off-DOM) GREEN (every Q gate wired in `ci.yml` + reachable from `proof:all`); the decision-JSONs committed (`git status --porcelain scripts/*-decision.json` EMPTY). Born-RED on the unwired-gates tree (the gate BIT). Named in prose, NOT a runtime closure oracle. |
| **[F] DQ-6 the emerging-CSS Phase-2 element-aware seam** (typed-but-empty: `if(style(--p))` / `sibling-index()` / `sibling-count()` never resolve) | Q (4.4.0) | 1 (Q) | **FOLD → Q.WB1 (NOW — value.js already parses all three nodes)** | **Q.WB1** | **TERMINAL — FOLD.** Non-gate terminal mechanism: the emerging-css-resolve-P2 jsdom fixture (proof:emerging-css-resolve-P2 — a `--p`-bearing target resolves `if(style(--p))` to the concrete value post-`setTargets`, off-DOM in jsdom) GREEN, born-RED on the typed-but-empty seam (the test BIT before the resolve landed). Named in prose, NOT a runtime closure oracle. |
| **[F] DQ-7 the wave-charter contrivance enforcer** (never authored; the smell-test lived only as prose) | Q (audit) | 1 (Q) | **FOLD → Q.WA4 (lands FIRST so every Q perf wave is gate-protected)** | **Q.WA4** | **TERMINAL — FOLD.** Non-gate terminal mechanism: the wave-charter node probe (proof:wave-charter — a wave-header source-shape lock, off-DOM) GREEN (every PERF/[radical] wave carries the 7-question header + a target-name-matched born-RED bench + no-undecided-dual-path); born-RED on the script-absent tree (the gate BIT). Named in prose, NOT a runtime closure oracle. |

---

## §3 — P-invariant-28 terminal register (the ≥4-tranche roster at Q — the no-deferral binding criterion)

> **P-invariant-28:** a deferred item carried ≥4 tranches CANNOT ride to a 5th without a terminal
> verdict (BUILD-IN, KILL, USER-DOMAIN publish, or a published-consume HANDOFF). No re-BOOK. At Q —
> the no-deferral terminal — EVERY ≥4-tranche row MUST exit with a gate that BIT. `proof:chronic-closure`
> mechanizes this off the Chronicity-integer (a bare BOOK ≥4-tranche row REDs the whole gate).

| DM | Chronicity at Q | Verdict | Status |
|---|---|---|---|
| **DM-2 GlassControlPoint** | **9** (E…M,O,P→Q) — the NINTH carry | **BUILD-IN (ABSOLUTE terminal)** — the MANDATORY exit; no 10th carry | **Q.WC1** build + **Q.WC2** dogfood; `proof:demo-control-point` GREEN |
| **DM-11 mobile** | **10** (D…Q; TERMINATED) | **VERIFY-ONLY** — GREEN gate satisfies P-inv-28 | Q.WZ re-verify |
| **DM-10 typography** | **9** (D…Q; TERMINATED) | **VERIFY-ONLY** — GREEN gate satisfies P-inv-28 | Q.WZ re-verify |
| **DM-9 specular** | **8** (D,H,I,K,L,M,O,Q) | **RE-AFFIRM** — GREEN gate satisfies P-inv-28 | Q.WZ re-verify |
| **DM-12 dock perf** | **8** (D,H,I,K,L,M,O,Q) | **RE-AFFIRM** — GREEN gate satisfies P-inv-28 | Q.WZ re-verify |
| **DM-13 empty-value** | **8** (A,H,I,K,L,M,O,Q) | **VERIFY-ONLY** — GREEN gate + the NaN-guard interlock | Q.WZ re-verify |
| **DM-1 RF-17 dock interim** | **7** (I,J,K,L,M,O,P→Q) | **HANDOFF** — consume on the glass-ui BC cut (Q.WG3); the contingency KILL CARRIES FORWARD. **NO 8th carry.** | Q.WG3 — BC cut |
| **DM-14 DFA suspend** | **7** (H,I,K,L,M,O,Q) | **VERIFY-ONLY (TERMINATED)** | Q.WZ re-verify |
| **DM-15 scene-control-dfa** | **7** (I,J,K,L,M,O,Q) | **VERIFY-ONLY (TERMINATED)** | Q.WZ re-verify |
| **DM-7 keyframes-vue** | **5** (K,L,M,O,P→Q) — the belt CROSSED | **USER-DOMAIN** publish at Q.WZ (or owner-ratified KILL). P-inv-28 belt was CROSSED at the impl drive; **NO 6th carry.** | Q.WZ (S3) |
| **DM-5 S1 aria-suppress** | **5** (K,L,M,O,P→Q) | **HANDOFF** — S1 delete on the BC SFC guard (Q.WG3) OR the contingency (a KILL of the band-aid, NOT a 6th carry) | Q.WG3 — BC SFC guard |
| **DM-8 Lighthouse floors** | **5** (L,M,O,P,Q) | **VERIFY-ONLY** — GREEN gate satisfies P-inv-28 | Q.WZ re-verify |
| **DM-22 named-selector NaN-frame** | **4** (L,M,O,P→Q) | **BUILD-IN (in-realm TERMINAL)** — deferred-resolution + play-time guard (NOT a parse-throw) | Q.WD1; `proof:nan-frame` GREEN |
| **DM-5 S8 FN_NAME** | **4** (K,L,M,O,P→Q) | **HANDOFF (PRIMARY — the VJ-Q4 `flatLeaf .fnName` consume, GATED) + BUILD-IN (FALLBACK — the in-realm parallel-array, only on a VJ-Q4 decline)** — the WeakMap is realm-clean; the two cures are MUTUALLY EXCLUSIVE | Q.WG4 (PRIMARY VJ-Q4) / Q.WB3 §S6 (FALLBACK) |
| **DM-16 5.0.0 cut** | **4** (L,M,O,P→Q) | **USER-DOMAIN** publish at Q.WZ | Q.WZ (S2) |
| **DM-20 deploy round-trip** | **4** (L,M,O,P→Q) | **USER-DOMAIN + BAND-Z** — re-observed as live-byte equality | Q.WZ (S6) |

**THE PATH CONSTANT IS RE-POINTED (Q.WZ §S1 LANDED).** `scripts/proof-chronic-closure.mjs`
`CHRONIC_LEDGER` now points at `docs/tranches/Q/PROGRESS.md` (this file) and
`LEDGER_LABEL = "Q/PROGRESS.md"` — the atomic **L→Q** re-point + the gate-code co-edits (the
`BUILD-IN` exit shape; the Q DM-N coverage tokens; the markdown-emphasis-tolerant Chronicity-integer
read) + the non-vacuity planted-row proof (three malformed rows RED on the three clause shapes, then
GREEN on this clean terminal ledger). `node scripts/proof-chronic-closure.mjs` exits 0:
`✓ the Q ledger is TERMINAL`. The P-inv-28 ledger is TERMINATED — every ≥4-tranche chronic EXIT-shaped
with a gate that BIT (DM-2 (9) BUILD-IN, DM-11 (10) VERIFY-ONLY, DM-10 (9) VERIFY-ONLY, … DM-22 (4)
BUILD-IN); ZERO bare-BOOK ≥4-tranche rows.

---

## §4 — Open-deferrals summary (the Q deferral count at dev-phase)

| Disposition | Rows |
|---|---|
| **BUILD-IN (kf-owned, ABSOLUTE terminal — the MANDATORY exits)** | DM-2 (the 9th carry, Q.WC1) · DM-22 (NaN-frame, Q.WD1) · DM-5 S8 FALLBACK (the in-realm parallel-array, Q.WB3 §S6 — fires ONLY on a VJ-Q4 decline) |
| **HANDOFF, tripwire PENDING (sibling-gated)** | DM-1 (BC cut, 7-tranche — CRITICAL) · DM-5 S1 (BC SFC guard) · DM-5 S8 PRIMARY (the VJ-Q4 `flatLeaf .fnName` consume, value.js 1.2.0, Q.WG4 — mutually exclusive with the Q.WB3 §S6 fallback) |
| **USER-DOMAIN (the MANDATORY publish/KILL hand)** | DM-7 (keyframes-vue, belt CROSSED — Q.WZ) · DM-16 (5.0.0 cut, Q.WZ) · DM-20 (deploy, Q.WZ) |
| **FOLD-LANDED (tripwire FIRED + gate GREEN)** | DM-3 (fromMorphSVG, impl drive) · DM-5 S9 (parse-that dep removed) · DM-5 S7 · DM-4 · DM-6 · DM-17/18/19/25 |
| **VERIFY-ONLY / RE-AFFIRM (terminated chronics)** | DM-8 · DM-9 · DM-10 · DM-11 · DM-12 · DM-13 · DM-14 · DM-15 |
| **NET-NEW Q obligations (DISPATCH / FOLD → named wave home)** | DQ-1 (packrat re-entrancy, Q.WG1) · DQ-2 (dead API, Q.WG1) · DQ-3 (contrast-color, Q.WG2) · DQ-4 (S1/S2 false-RED, Q.WG3) · DQ-5 (ci-coverage + decision-JSONs, Q.WA3/Q.W0) · DQ-6 (emerging-CSS-P2, Q.WB1) · DQ-7 (wave-charter, Q.WA4) |

**P-INVARIANT-28 CLOSURE ASSERTION (Q — the no-deferral binding criterion).** Every row carries
(a) a tag, (b) a named owning Q wave, (c) a named tripwire or terminal disposition. **Zero rows are
bare BOOKs.** The two SHARPEST P-inv-28 findings the impl drive left: **DM-2** is at the NINTH carry
(declared "ABSOLUTE FINAL" twice, never built) — the MANDATORY BUILD-IN exit at Q.WC1, no 10th carry;
**DM-7** CROSSED the belt into a 5th carry (kf 4.4.0 shipped WITHOUT it) — the MANDATORY USER-DOMAIN
exit at Q.WZ, no 6th carry. DM-1 at 7-tranche carries the contingency KILL. Q.WZ cannot close until
`proof:chronic-closure` terminates non-vacuously over THIS ledger — the no-deferral law mechanized.

---

## Gate-first / born-RED discipline note

Every Q wave in this board authors its born-RED gate before any source cure, and the gate bites the
REAL observable, never a proxy. The load-bearing lessons carried into Q:

- **The green-source-shape-gates-miss lesson (the memory feedback):** demo waves (Band C) carry an
  appearance/interaction-axis gate, NOT a grep — `proof:demo-control-point` drives a real pointer-drag
  and asserts a handle MOVES; `proof:scene-switcher-mobile` asserts a scroll-snap carousel renders on a
  390px viewport; `proof:easing-curve-editor` asserts a live-drag edits the curve.
- **The S1/S2 false-RED lesson:** `proof:workaround-deletion` S1/S2 are FALSE-RED on a version probe.
  Q.WG3 retargets them to a content-present probe (the guard's presence in the installed dist), NOT a
  version number — deleting on the current glass-ui would break the kf consumers.
- **The NaN-frame revert lesson:** the impl drive's parse-time throw broke the L.W1 S4 opaque-ingest
  contract and was REVERTED. Q.WD1 performs the deferred-resolution + a PLAY-time guard (NOT a parse
  throw) — the gate asserts BOTH the S4 round-trip AND no-NaN-at-play.
- **The DM-2 no-declaration lesson:** "ABSOLUTE FINAL" without a gate that BIT is a P-inv-28 violation
  (DM-2 declared it twice, never built). At Q, a chronic exits ONLY via a gate that observes the cure.

**No wave starts impl without a born-RED gate on disk that bites the GENUINE defect on the unfixed
tree.** This is the non-negotiable law inherited from O/P's `inv-observable-truth`.
