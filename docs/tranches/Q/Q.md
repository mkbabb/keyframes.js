# Tranche Q — the no-deferral terminal tranche (audit-driven, post-impl-drive)

> **DEVELOPMENT ONLY.** This charter + the Q wave specs are authored docs; no engine/demo/library
> source is written. Implementation opens only on explicit owner authorization, per-repo, DAG-ordered —
> exactly the O/P dev→impl boundary. inv-16 holds in development (kf authors only keyframes.js; every
> cross-repo need is a DISPATCH doc). The owner mandate: **NO quick solutions, NO workarounds —
> idiomatic, gestalt; architectural transpositions for elegance/simplicity/performance are DESIRABLE;
> NO legacy code; NO deferrals in Q** — every deferred + chronic item gets a complete terminal wave
> spec NOW, and every point that could spawn a mid-tranche deferral is pre-empted with its enabling
> wave NOW.

Authored 2026-06-23 from a **31-lane deep audit** (`docs/tranches/Q/audit/` — `wr33rzcqc` 23 lanes +
`wijlkkw6p` 8 re-deployed; 6 bands: shipped-change verification, deferred-item terminalization, chronics,
recaps, architectural transpositions, mid-tranche-friction pre-emption). The audit covered the original
O + P + value.js-P + parse-that-B plan AND the just-shipped impl drive (parse-that 0.12.0 + value.js
1.1.0 + keyframes 4.4.0 + the verified redeploy + the demo-fleet polish).

## 1 — Why Tranche Q exists (the post-impl-drive reality)

The impl drive shipped the constellation's **critical path** (the DAG: 3 publishes + a verified deploy)
and closed three genuine multi-tranche chronics in-realm (DM-3 fromMorphSVG built; DM-5 S9 parse-that
dep removed; the S8 WeakMap realm-clean belt-exit). But "totality" was **not** reached: ~10 planned
waves were consciously deferred for risk-management, and the audit found that **every deferral is a
latent mid-tranche-deferral spring** — plus three NEW issues born in the drive:

1. **A shipped correctness defect** — the 0.12.0 packrat src-epoch reset is *per-memoizeFn-call*, not at
   the parseState entry boundary the FULL-LOOP ledger specified. A nested `.parse(differentSrc)` mid-grow
   wipes the outer grow's module-global state → a `TypeError` (re-entrancy regression). The named
   try/finally hardening was never implemented; a >1MB source aliases memo cells (20-bit offset budget).
   *(Unreached in the live constellation — value.js does not consume packrat — but a real public-API
   correctness defect.)* → **Q Band G / parse-that 0.13.0.**
2. **Dead public API born this tranche** — parse-that 0.12.0 shipped `thenMap`, `fuse()`, and the
   `dispatch` subTable with **zero consumers** anywhere; this contradicts parse-that's *own*
   substrate-deadcode precept (delete public surface with zero workspace consumers). → **Q Band G.**
3. **The library is BEHIND the platform on `contrast-color()`** (Baseline April 2026) — it parses only as
   an opaque value, inverting the "library leads, browsers catch up" precept. → **Q Band G / value.js 1.1.1.**

And the deceptive-ledger findings: **DM-2 DemoControlPoint is a NINTH carry** (declared "ABSOLUTE FINAL"
at O.W5 and again, never built — the worst P-inv-28 violation in the constellation); the
`proof:workaround-deletion` S1/S2 arms are **false-RED** (version-probe, no content-probe);
`proof:ci-coverage` is **RED** on the impl-drive tree (6 new gates unwired); `CHRONIC_LEDGER` is pinned
3 tranches stale. Q is the **terminal** tranche that closes ALL of this with no new deferral.

## 2 — The eight bands (the wave roster)

Mirrors the O/P 8-band template, re-phased for the post-drive reality. **Phase axis:** NOW (kf-internal,
executable on authorization), DISPATCH (a cross-repo ask, authored in-tree, scheduled by the sibling),
GATED (fires atomically on a named sibling publish), USER-DOMAIN (the owner's publish/KILL hand).

| Band | Wave(s) | Phase | Headline |
|---|---|---|---|
| **A — Apparatus** | Q.W0 (record-hygiene + shipped-truth reconcile + CHRONIC_LEDGER re-pin), Q.WA1 (the SLIM lint-tier — eslint `import/no-cycle` + `no-restricted-imports` + dep-cruiser, the 3-tranche O-Band-A carry), Q.WA2 (**drag2D LIGHT barrel export** — the DemoControlPoint enabler), Q.WA3 (CI-green + **master-merge reconcile** + `proof:ci-coverage` fix + the deploy round-trip oracle + the device-dependence CI-harden), Q.WA4 (`proof:wave-charter` + the DAG manifest + the constellation pin-ledger witness) | NOW | the floor every Q wave stands on — the lint tier finally lands, the drag2D export unblocks DM-2, CI goes genuinely green, the contrivance smell-test becomes a gate |
| **B — Engine-perf + emerging-CSS Phase-2** | Q.WB1 (emerging-CSS **Phase-2 element-aware arm**: `if(style(--p))` / `sibling-index()` / `sibling-count()` via a post-`setTargets` pass over the SAME ResolveContext), Q.WB2 (**@function call-inlining** — GATED on value.js 1.2.0 dashed-call parse), Q.WB3 (**SoA completion** — extend the Float64 fold to single-animation `processFrame` + dispatch a value.js ColorChannelPlan for the permanently-boxed color/computed paths), Q.WB4 (WAAPI curvature-adaptive sub-segment densify) | NOW (WB2/WB3-color GATED) | finish what 4.4.0 started: the element-dependent emerging-CSS arm, @function lowering now that `extractFunctions` ships, the SoA beyond the compositor |
| **C — Demo-fleet** | Q.WC1 (**DemoControlPoint build-in** over LIGHT drag2D — the DM-2 9th-carry MANDATORY terminal), Q.WC2 (the easing curve-editor dogfooding DemoControlPoint + the hero promotion — P.W7 verbatim), Q.WC3 (**N-Stage + the unbuilt mobile** — a native scroll-snap carousel + a typed-directional VT scene-switch; the N-Stage *unshelf* stays a GATED spec), Q.WC4 (**the MorphSVG demo scene** + the morph on-DOM render contract O.W6 left as vapor + orient-along-path), Q.WC5 (amiga telemetry + residual scene refinements) | NOW | the visible Band-C fleet the drive deferred — every chronic build-in terminalized, the mobile shelf-driver built, the library-built MorphSVG finally demoed |
| **D — Correctness** | Q.WD1 (**the NaN-frame proper cure** — named scroll selectors stay opaque/round-trip at ingest [the L.W1 S4 floor]; a deferred-resolution step maps them to numeric % under a Scroll/ManualTimeline at attach; the typed `NAMED_SELECTOR_NO_TIMELINE` throw fires only at PLAY-without-timeline — NOT at parse; the enabling timeline-binding seam authored as a sub-wave), Q.WD2 (grammar-fuzz fast-check arbitraries + the differential-vs-browser oracle — the P.W9 S3/S4 split) | NOW | the correct cure for the defect the drive's parse-throw reverted — both the S4 round-trip AND the no-NaN-at-play hold |
| **E — No-legacy → 5.0.0** | Q.WE1 (**the @deprecated alias drop** — `Animation`/`ScrollTimeline`/`ScrollTimelineOptions` runtime aliases + the 22-demo-consumer migration + `docs/MIGRATION-5.0.0.md` + `proof:alias-dropped` gate-first), Q.WE2 (**the leaves.ts externalization** — Arm B terminal: consume a value.js `/math` tree-shakeable subpath + DELETE the kf `internal/leaves.ts` duplicates + `proof:no-cross-realm-cast`) | NOW (E2 GATED on value.js `/math`) | the explicit NO-legacy terminal — the breaking 5.0.0 surface, the bundle-externalization transposition |
| **F — Engine-split (the architectural transposition)** | Q.WF1 (**engine.ts 1397→~900** — lift the standalone-play lifecycle machine into `engine-playback.ts`; the O.W7 transposition the drive twice declined, now sequenced AFTER the alias-drop so it splits a clean class), Q.WF2 (the group.ts SoA decomposition — extract the `_soaPlans`/`_compositeBuf` fold machinery into a module; `proof:decomposition` green) | NOW | elegance/simplicity — the god-object split at the right seam, the compositor fold extracted |
| **G — Consume (cross-repo dispatches + GATED consumes)** | Q.WG1 (**parse-that 0.13.0** dispatch — delete `thenMap`/`fuse`; decide the `*Span` surface; the **packrat re-entrancy + key hardening**; `dispatch` subTable consume-or-retract; `proof:perf` on the real CSS corpus), Q.WG2 (**value.js 1.1.1 + 1.2.0** dispatch — `contrast-color()` [the library-leads catch-up]; `if()` multibranch; the **color-arch out-param family** [xyz2\*Into / mixColorsInto / sampleColorRampAt / structural clone]; **VJ-L1 flatLeaf `.fnName`** [the S8 terminal]; the `/math` subpath; the dashed-call parse arm), Q.WG3 (**glass-ui BC** dispatch — publish the already-authored SegmentedTabs aria guard + the dock collapse-crossfade strand fix; the kf S1/S2 delete GATED on the publish), Q.WG4 (the kf GATED consumes — re-pin value.js 1.2.0 → @function inlining + leaves externalize + S8 VJ-L1 + if-multibranch) | DISPATCH + GATED | the constellation legs — every cross-repo need a dispatch with a terminal-or-KILL, every consume a GATED atomic edge |
| **Z — Close + the 5.0.0/5.1.x cut** | Q.WZ (the ledger fully terminated; the **5.0.0 breaking cut** [USER-DOMAIN publish]; the **5.1.x minor** [the additive perf+demo+emerging-CSS-P2]; the keyframes-vue P-inv-28 belt terminal [USER-DOMAIN publish runbook]; the deploy round-trip re-observed) | NOW-author · USER-DOMAIN publish | the terminal close — every chronic discharged, every prompt addressed, the version narrative landed |

## 3 — The DAG (the ordering chains + the cross-repo publish chain — the no-deferral spine)

The audit (`B6-dag-ordering`) confirmed the Q DAG is **acyclic and fully sequenceable with zero required
mid-tranche deferrals**. Four internal ordering chains + one cross-repo publish chain carry real
merge-correctness risk and are gate-enforced:

```
Q.WA3 master-merge-reconcile (NOW, all 3 repos to master — the FIRST motion)
   │
   ├─► parse-that 0.13.0 (Q.WG1) ─► value.js 1.1.1/1.2.0 (Q.WG2) ─► kf GATED consumes (Q.WG4)
   │                                      │
   │                                      ├─► Q.WB2 @function inline (GATED: dashed-call parse)
   │                                      ├─► Q.WE2 leaves externalize (GATED: /math subpath)
   │                                      └─► Q.WB3-color SoA (GATED: ColorChannelPlan)
   │
   ├─► Q.WA2 drag2D LIGHT export ─► Q.WC1 DemoControlPoint ─► Q.WC2 easing-editor dogfood
   │
   ├─► Q.WD1-bind attach-resolution seam ─► Q.WD1 play-time guard (NEVER a parse-throw — the S4 floor)
   │
   └─► Q.WE1 alias-drop + 22-consumer migrate ─► Q.WF1 engine.ts split (splits a CLEAN class) ─► Q.WZ 5.0.0 cut
                                                                                                    │
   glass-ui BC publish (Q.WG3, USER-DOMAIN) ─► kf S1/S2 delete (GATED) ──────────────────────────► Q.WZ
```

**The four pre-empted friction chains** (each redressed with its enabling wave NOW, per the completeness-critic):
1. **The breaking-cut spine** — alias-drop must precede the engine-split (else the split lifts a class still
   carrying the @deprecated re-export, a dirty seam) which must precede the 5.0.0 cut. `proof:alias-dropped`
   (gate-first) + the migration enumeration (the 22 sites listed in Q.WE1) pre-empt the "migration discovers
   23 scattered consumers mid-tranche" deferral.
2. **The DemoControlPoint chain** — `drag2D` must be a LIGHT barrel export (Q.WA2) BEFORE the demo consumes
   it; without the export the demo build either reaches into HEAVY (a boundary breach) or stalls. The stale
   `proof:control-point-live` "needs drag2D" gate is corrected NOW (the export it waited for is authored this band).
3. **The NaN-frame pipeline** — the play-time guard throw must land AFTER the attach-time deferred-resolution
   seam (Q.WD1-bind), or it re-breaks the L.W1 S4 ingest floor (the exact trap the impl drive fell into). The
   sub-wave ordering is gate-enforced (`proof:nan-frame` asserts BOTH S4-round-trips AND no-NaN-at-play).
4. **The cross-repo consume edges** — every GATED kf consume (Q.WB2/WE2/WB3-color/WG4) names the EXACT sibling
   publish that fires it; no kf wave consumes an unpublished surface. The value.js/parse-that dispatches carry
   a terminal-or-KILL so they cannot become perpetual punts.

## 4 — The version narrative (the publish chain)

| Repo | Version | Contents | Phase |
|---|---|---|---|
| **parse-that** | **0.13.0** | delete `thenMap`/`fuse` (zero-consumer dead API); the `*Span` decision (adopt-or-deprecate); the packrat re-entrancy + key hardening; `dispatch` subTable consume-or-retract; `proof:perf` on the real corpus | DISPATCH (Q.WG1) |
| **value.js** | **1.1.1** | `contrast-color()` L7 (the library-leads catch-up) | DISPATCH (Q.WG2) |
| **value.js** | **1.2.0** | `if()` multibranch; the color-arch out-param family (xyz2\*Into / mixColorsInto / sampleColorRampAt / structural clone); VJ-L1 `flatLeaf .fnName`; the `/math` subpath; the dashed-call parse arm | DISPATCH (Q.WG2) |
| **glass-ui** | **BC** | publish the authored SegmentedTabs aria-orientation guard + the dock collapse-crossfade strand fix | DISPATCH (Q.WG3, USER-DOMAIN) |
| **keyframes** | **5.0.0** | the BREAKING no-legacy cut — drop the @deprecated aliases + migrate consumers | USER-DOMAIN publish (Q.WZ) |
| **keyframes** | **5.1.x** | the additive perf + demo-fleet + emerging-CSS Phase-2 + @function inlining, consuming value.js 1.2.0 | USER-DOMAIN publish (Q.WZ) |

DAG: `parse-that 0.13.0 → value.js 1.2.0 → kf 5.0.0 (breaking) → kf 5.1.x (additive)`. The master-merge
reconcile (Q.WA3) lands FIRST — all three published tranche tips merge to master before any new cut, so the
deploy-of-record (CF Pages, branch `master`) is live-correct.

## 5 — Prompt recap (ALL prompts addressed; the two DROPPED obligations folded)

The full A→P→impl-drive→this-audit recap lives in `docs/tranches/Q/audit/prompt-recap-Q.md` (Q.W-RECAP,
chain-trusting `prompt-recap-P.md`: A→P verified held). Every request is ADDRESSED, has a terminal Q wave,
or is a recorded KILL. The two obligations the impl drive left DROPPED-flagged, now folded:
- **"totality"** — the ~10 deferred waves are each a terminal Q wave (this charter); Q.WZ cannot close until
  every one is discharged (no "ABSOLUTE FINAL" without a system-gate exit — the DM-2 lesson).
- **the keyframes-vue P-inv-28 belt** — the USER-DOMAIN publish runbook + a gate (Q.WZ); the belt is named,
  not left open.

## 6 — Precept reckoning (where the shipped 4.4.0 stands; what Q must redress)

The shipped 4.4.0 HONORS its claimed precepts (inv-16 clean — parse-that prod dep genuinely removed;
record-as-built honesty exemplary; the engine-core batch gestalt/KISS). The Q-redressable violations:
- **NO-legacy** — the 0.12.0 dead API (thenMap/fuse/subTable) + the un-dropped @deprecated aliases + the
  leaves.ts duplicates + the kept zero-consumer `*Span` surface. → Bands E, F, G.
- **library-leads** — value.js behind on `contrast-color()`. → Q.WG2 (1.1.1).
- **P-inv-28 (no perpetual punts)** — DM-2 the 9th carry; the false-RED S1/S2 gates; the stale ledger. → Bands A, C.
- **the honest 4.4.0→5.0.0 semver gap** — the planned breaking major was deferred; Q.WE1/Q.WZ land it.

## 7 — Contrivance re-check (the smell-test over the shipped code + the Q waves)

Per `docs/tranches/P/CONTRIVANCE-AUDIT.md`, the 7-question smell-test was re-run (`B3-contrivance-recheck`):
the shipped SoA/_styleOut/resolve-values are GROUNDED (measured on real paths, bit-identical, one-pass). The
0.12.0 dead API is the one contrivance that slipped (speculative fusion seams with no consumer) — Q Band G
retires it. Every Q perf wave carries a **measure-first born-RED gate on its OWN target path** (the
`proof:wave-charter` discipline, Q.WA4) so no transplanted-ratio charter escapes. No Q wave is chartered on
a speculative-dependency that the consumer could self-solve.

## 8 — dev→impl boundary

This charter + the Q.W\* specs + the dispatch docs (`KF-TO-PARSETHAT-Q.md`, `KF-TO-VALUEJS-Q.md`,
`KF-TO-GLASSUI-Q.md`) + the recaps are the Q.W0 deliverable. **No source is written.** Implementation opens
per-repo on explicit authorization, DAG-ordered, gated on each repo's own green CI. The 5.0.0 publish + the
glass-ui publish stay USER-DOMAIN (the owner's hand). Isomorphic, no-legacy, gestalt throughout.
