# Q DAG — the machine-readable Tranche-Q dependency manifest

**Author:** keyframes.js Tranche Q DEVELOPMENT (the `B6-dag-ordering` acyclic-spine witness).
**Phase:** NOW — kf-internal, zero sibling dependency. **DOCS ONLY:** this manifest edits no source.
**Owning wave:** **Q.WA4 §S2/§S3** (the wave-charter gate + DAG manifest); it is the artifact
`proof:wave-charter` (`scripts/proof-wave-charter.mjs`) parses to assert acyclicity + no-unpublished-consume.
**Pattern note:** neither `docs/tranches/O/DAG.md` nor `docs/tranches/P/DAG.md` exists — **Q introduces the
machine-readable-DAG pattern.** O and P drew their DAGs in prose only (`O.md §3`, `P.md §3`); Q.WA4 makes
the spine *checkable*, not asserted.

This file is the single source of record for the Q DAG. It is a **derivative** of `Q.md §3` (the prose
ordering chains + the cross-repo publish chain) + `Q.md §4` (the version narrative) + each wave spec's
`**Sequence (DAG edges):**` header — it MUST match them exactly; §5 below records the cross-check and any
drift. The reconciled facts it encodes (post-orchestrator §2/§3 reconcile):

- **`drag2D` is ALREADY a LIGHT barrel export** (`src/animation/index.ts:88,93`, gate-proven by
  `proof:drag-gesture` S4). The feared "demo reaches into HEAVY for drag2D" breach **cannot occur**, so the
  **`drag2D → DemoControlPoint` gating edge is DISSOLVED** and **Q.WC1 is NOW-buildable** (no gating edge).
  That edge MUST NOT appear in the manifest below (§4 asserts its absence).
- The kf source-graph lint tier is **dep-cruiser ONLY** (eslint KILLED-down as redundant with
  `tsc --strict` + prettier-organize-imports — `Q.WA1`). This is a node attribute, not a DAG edge.
- The migration surface is **~33 consumers**, not the charter's earlier "22" (`Q.WE1`; the `B2-ow9`
  enumeration). This is a node attribute (the migration count), not a DAG edge.

---

## §1 — The manifest (the machine-readable node + edge list)

`proof:wave-charter` (Q.WA4 §S3) parses the fenced `json` block below and asserts:
**(a)** a topological sort of `edges` over `nodes` **succeeds** (acyclic — the `B6-dag-ordering`
"acyclic and fully sequenceable" verdict, made checkable);
**(b)** every node with `"phase": "GATED"` carries a non-empty `gatedOn` whose `siblingPublish` is EITHER
already published OR named by a DISPATCH-with-terminal-or-KILL (`dispatchDoc` non-null) — i.e. **no kf wave
consumes an unpublished sibling surface** (the `Q.md §3` friction-chain-4 invariant).

```json
{
  "tranche": "Q",
  "schemaVersion": 1,
  "source": ["Q.md#3", "Q.md#4", "waves/Q.W*.md#Sequence"],
  "phaseAxis": ["NOW", "DISPATCH", "GATED", "USER-DOMAIN"],
  "dissolvedEdges": [
    {
      "from": "drag2D-light-export",
      "to": "Q.WC1",
      "reason": "drag2D is ALREADY a LIGHT barrel export (index.ts:88,93, gate-proven by proof:drag-gesture S4); the gating edge is dissolved and Q.WC1 is NOW-buildable. Q.WA2 CERTIFIES the existing export (no-op enabler) and retires the stale proof:control-point-live 'needs drag2D' premise.",
      "assertAbsentFromEdges": true
    }
  ],
  "nodes": [
    { "id": "Q.W0",   "band": "A", "phase": "NOW", "title": "record-hygiene + shipped-truth reconcile + CHRONIC_LEDGER re-pin (charter substrate)" },
    { "id": "Q.WA1",  "band": "A", "phase": "NOW", "title": "the SLIM lint-tier (dep-cruiser ONLY; eslint KILLED)" },
    { "id": "Q.WA2",  "band": "A", "phase": "NOW", "title": "drag2D LIGHT certification (NO-OP confirm; retires the stale proof:control-point-live premise)" },
    { "id": "Q.WA3",  "band": "A", "phase": "NOW", "title": "CI-green + master-merge reconcile + proof:ci-coverage fix + deploy round-trip oracle (the FIRST motion)" },
    { "id": "Q.WA4",  "band": "A", "phase": "NOW", "title": "proof:wave-charter + this DAG manifest + the pin-ledger witness" },

    { "id": "Q.WB1",  "band": "B", "phase": "NOW",   "title": "emerging-CSS Phase-2 element-aware arm (if(style(--p)) / sibling-index() / sibling-count())" },
    { "id": "Q.WB2",  "band": "B", "phase": "GATED", "title": "@function call-inlining",
      "gatedOn": { "siblingPublish": "value.js 1.2.0 (dashed-call parse arm)", "dispatchDoc": "KF-TO-VALUEJS-Q.md", "firesVia": "Q.WG-GATED-CONSUMES" } },
    { "id": "Q.WB3-numeric", "band": "B", "phase": "NOW",   "title": "SoA completion — single-animation processFrame Float64 numeric fold" },
    { "id": "Q.WB3-color",   "band": "B", "phase": "GATED", "title": "SoA completion — color/computed arm (ColorChannelPlan)",
      "gatedOn": { "siblingPublish": "value.js 1.2.0 (ColorChannelPlan surface)", "dispatchDoc": "KF-TO-VALUEJS-Q.md", "firesVia": "Q.WG-GATED-CONSUMES" } },
    { "id": "Q.WB4",  "band": "B", "phase": "NOW", "title": "WAAPI curvature-adaptive sub-segment densify" },

    { "id": "Q.WC1",  "band": "C", "phase": "NOW", "title": "DemoControlPoint build-in over LIGHT drag2D (the DM-2 9th-carry terminal — NOW-buildable, gating edge dissolved)" },
    { "id": "Q.WC2",  "band": "C", "phase": "NOW", "title": "the easing curve-editor dogfooding DemoControlPoint + the hero promotion" },
    { "id": "Q.WC3",  "band": "C", "phase": "NOW", "title": "N-Stage + the mobile scroll-snap carousel + typed-directional VT scene-switch (NOW layer)" },
    { "id": "Q.WC3-NSTAGE-UNSHELF", "band": "C", "phase": "GATED", "title": "the N-Stage unshelf architecture decision",
      "gatedOn": { "siblingPublish": "glass-ui BC cut", "dispatchDoc": "KF-TO-GLASSUI-Q.md", "firesVia": "Q.WG3" } },
    { "id": "Q.WC4",  "band": "C", "phase": "NOW", "title": "the MorphSVG demo scene + the morph on-DOM render contract + orient-along-path" },
    { "id": "Q.WC5",  "band": "C", "phase": "NOW", "title": "amiga telemetry + residual scene refinements" },

    { "id": "Q.WD1-bind", "band": "D", "phase": "NOW", "title": "the attach-time deferred-resolution seam (namedSelectorToFraction + bindTimeline) — the L.W1 S4 floor" },
    { "id": "Q.WD1",  "band": "D", "phase": "NOW", "title": "the NaN-frame play-time NAMED_SELECTOR_NO_TIMELINE guard (NEVER a parse-throw)" },
    { "id": "Q.WD2",  "band": "D", "phase": "NOW", "title": "grammar-fuzz fast-check arbitraries + the differential-vs-browser oracle" },

    { "id": "Q.WE1",  "band": "E", "phase": "NOW",   "title": "the @deprecated alias drop + the ~33-consumer migration + MIGRATION-5.0.0.md + proof:alias-dropped (gate-first)" },
    { "id": "Q.WE2",  "band": "E", "phase": "GATED", "title": "the leaves.ts externalization (consume value.js /math subpath + DELETE the kf duplicates)",
      "gatedOn": { "siblingPublish": "value.js 1.2.0 (/math tree-shakeable subpath)", "dispatchDoc": "KF-TO-VALUEJS-Q.md", "firesVia": "Q.WG-GATED-CONSUMES" } },

    { "id": "Q.WF1",  "band": "F", "phase": "NOW", "title": "engine.ts 1397→~900 (lift the standalone-play lifecycle into engine-playback.ts)" },
    { "id": "Q.WF2",  "band": "F", "phase": "NOW", "title": "the group.ts SoA decomposition (extract the _soaPlans/_compositeBuf fold; restore proof:decomposition green)" },

    { "id": "Q.WG1",  "band": "G", "phase": "DISPATCH", "title": "parse-that 0.13.0 dispatch (delete thenMap/fuse; *Span decision; packrat re-entrancy + key hardening; dispatch subTable consume-or-retract; proof:perf)",
      "dispatchDoc": "KF-TO-PARSETHAT-Q.md", "terminalOrKill": true },
    { "id": "Q.WG2",  "band": "G", "phase": "DISPATCH", "title": "value.js 1.1.1 + 1.2.0 dispatch (contrast-color(); if() multibranch; color-arch out-param family; VJ-L1 flatLeaf .fnName; /math subpath; dashed-call parse arm)",
      "dispatchDoc": "KF-TO-VALUEJS-Q.md", "terminalOrKill": true },
    { "id": "Q.WG3",  "band": "G", "phase": "USER-DOMAIN", "title": "glass-ui BC dispatch (publish the authored SegmentedTabs aria guard + the dock collapse-crossfade strand fix + the keyframes.js peer-range widen to admit 5.0.0 — the Q.WZ S6 deploy precondition)",
      "dispatchDoc": "KF-TO-GLASSUI-Q.md", "terminalOrKill": true },
    { "id": "Q.WG-S1S2-HYGIENE", "band": "G", "phase": "NOW", "title": "the S1/S2 gate-hygiene retarget (version-probe → content-probe) — precedes the GATED deletes; turns the false-RED into a correct PENDING-until-publish edge" },
    { "id": "Q.WG-GATED-CONSUMES", "band": "G", "phase": "GATED", "title": "the GATED kf consume orchestrator (the single ^1.2.0 re-pin point + the glass-ui re-pin + the S1/S2 deletes); the atomic edge each band consume hangs off",
      "gatedOn": { "siblingPublish": "value.js 1.2.0 (Q.WG2) + glass-ui BC (Q.WG3)", "dispatchDoc": "KF-TO-VALUEJS-Q.md|KF-TO-GLASSUI-Q.md", "firesVia": "self" } },
    { "id": "Q.WG4",  "band": "G", "phase": "GATED", "title": "the kf GATED consumes (re-pin value.js 1.2.0 → @function inlining + leaves externalize + S8 VJ-L1 + if-multibranch) — the logical consume set Q.WG-GATED-CONSUMES orchestrates",
      "gatedOn": { "siblingPublish": "value.js 1.2.0 (Q.WG2)", "dispatchDoc": "KF-TO-VALUEJS-Q.md", "firesVia": "Q.WG-GATED-CONSUMES" } },

    { "id": "Q.WZ",   "band": "Z", "phase": "USER-DOMAIN", "title": "the ledger terminated; the 5.0.0 breaking cut + the 5.1.x additive minor + the keyframes-vue P-inv-28 belt + the deploy round-trip re-observed (NOW-author · USER-DOMAIN publish)" }
  ],
  "edges": [
    { "from": "Q.W0", "to": "Q.WA1", "kind": "substrate" },
    { "from": "Q.W0", "to": "Q.WA2", "kind": "substrate" },
    { "from": "Q.W0", "to": "Q.WA3", "kind": "substrate" },
    { "from": "Q.W0", "to": "Q.WA4", "kind": "substrate" },

    { "from": "Q.WA4", "to": "Q.WB1", "kind": "charter-gate", "note": "proof:wave-charter must protect every Band-B perf charter (the transplanted-ratio bite); Q.WA4 lands FIRST among the perf-relevant Band-A waves" },
    { "from": "Q.WA4", "to": "Q.WB3-numeric", "kind": "charter-gate" },
    { "from": "Q.WA4", "to": "Q.WB4", "kind": "charter-gate" },

    { "from": "Q.WA3", "to": "Q.WB1", "kind": "merge-floor", "note": "master-merge-reconcile is the FIRST motion; every NOW engine/demo wave edits above the merged tree" },
    { "from": "Q.WA3", "to": "Q.WB3-numeric", "kind": "merge-floor" },
    { "from": "Q.WA3", "to": "Q.WB4", "kind": "merge-floor" },
    { "from": "Q.WA3", "to": "Q.WC1", "kind": "merge-floor" },
    { "from": "Q.WA3", "to": "Q.WC3", "kind": "merge-floor" },
    { "from": "Q.WA3", "to": "Q.WC4", "kind": "merge-floor" },
    { "from": "Q.WA3", "to": "Q.WC5", "kind": "merge-floor" },
    { "from": "Q.WA3", "to": "Q.WD1-bind", "kind": "merge-floor" },
    { "from": "Q.WA3", "to": "Q.WD2", "kind": "merge-floor" },
    { "from": "Q.WA3", "to": "Q.WE1", "kind": "merge-floor" },
    { "from": "Q.WA3", "to": "Q.WF2", "kind": "merge-floor" },
    { "from": "Q.WA3", "to": "Q.WG1", "kind": "merge-floor", "note": "the cross-repo publish chain starts after the master-merge reconcile" },
    { "from": "Q.WA3", "to": "Q.WG-S1S2-HYGIENE", "kind": "merge-floor" },

    { "from": "Q.WA1", "to": "Q.WE1", "kind": "lint-floor", "note": "the SLIM lint tier is the iterate-to-green floor the alias-drop migration edits above" },

    { "from": "Q.WA2", "to": "Q.WC1", "kind": "certify-noop", "note": "drag2D-LIGHT-export-CONFIRM (NO-OP) — NOT a gating edge; the substrate already shipped. The dissolved drag2D→DemoControlPoint gating edge does NOT appear; this is the certify-confirm ordering only." },

    { "from": "Q.WC1", "to": "Q.WC2", "kind": "demo-substrate", "note": "Q.WC1 builds DemoControlPoint.vue; Q.WC2 dogfoods it as the easing curve-editor's direct-manipulation instrument (HARD precondition)" },
    { "from": "Q.WC3", "to": "Q.WC3-NSTAGE-UNSHELF", "kind": "intra-wave", "note": "the NOW scroll-snap/VT layer ships without the unshelf; the GATED unshelf sequences after the BC cut" },

    { "from": "Q.WD1-bind", "to": "Q.WD1", "kind": "correctness-ordering", "note": "the play-time guard throw must land AFTER the attach-time deferred-resolution seam or it re-breaks the L.W1 S4 ingest floor (the exact impl-drive trap); proof:nan-frame asserts BOTH S4-round-trip AND no-NaN-at-play" },

    { "from": "Q.WE1", "to": "Q.WF1", "kind": "breaking-cut-spine", "note": "alias-drop BEFORE engine-split: the split must not lift a class still carrying the @deprecated re-export (a dirty seam)" },
    { "from": "Q.WF2", "to": "Q.WF1", "kind": "decomposition-baseline", "note": "Q.WF2 restores proof:decomposition green FIRST so Q.WF1's born-RED witness (the engine.ts override removal) is the sole remaining failure" },
    { "from": "Q.WF1", "to": "Q.WZ", "kind": "breaking-cut-spine", "note": "the engine-split lands before the 5.0.0 cut" },
    { "from": "Q.WE1", "to": "Q.WZ", "kind": "breaking-cut-spine", "note": "the 5.0.0 cut absorbs the breaking alias-drop renames (proof:changelog-5.0.0)" },

    { "from": "Q.WG1", "to": "Q.WG2", "kind": "cross-repo-publish-chain", "note": "parse-that 0.13.0 BEFORE value.js 1.1.1/1.2.0 (value.js consumes the re-entrancy-sound parser behind the CSSKeyframesAnimation facade)" },
    { "from": "Q.WG2", "to": "Q.WG-GATED-CONSUMES", "kind": "cross-repo-publish-chain", "note": "value.js 1.2.0 publish fires the single ^1.2.0 re-pin point" },
    { "from": "Q.WG2", "to": "Q.WG4", "kind": "cross-repo-publish-chain", "note": "Q.WG4 is the logical kf consume set that Q.WG-GATED-CONSUMES orchestrates on the value.js 1.2.0 publish" },
    { "from": "Q.WG-GATED-CONSUMES", "to": "Q.WB2", "kind": "gated-consume", "note": "@function inline fires on the value.js 1.2.0 dashed-call-parse re-pin" },
    { "from": "Q.WG-GATED-CONSUMES", "to": "Q.WE2", "kind": "gated-consume", "note": "leaves externalize fires on the value.js 1.2.0 /math subpath re-pin" },
    { "from": "Q.WG-GATED-CONSUMES", "to": "Q.WB3-color", "kind": "gated-consume", "note": "the SoA color arm fires on the value.js 1.2.0 ColorChannelPlan re-pin" },
    { "from": "Q.WG4", "to": "Q.WB2", "kind": "gated-consume-logical" },
    { "from": "Q.WG4", "to": "Q.WE2", "kind": "gated-consume-logical" },
    { "from": "Q.WG4", "to": "Q.WB3-color", "kind": "gated-consume-logical" },
    { "from": "Q.WG-GATED-CONSUMES", "to": "Q.WZ", "kind": "cross-repo-publish-chain", "note": "the 5.1.x additive cut absorbs the consume re-pins" },

    { "from": "Q.WG-S1S2-HYGIENE", "to": "Q.WG3", "kind": "gate-hygiene-precond", "note": "the content-probe retarget lands FIRST so the GATED deletes fire against a correct probe (not the broken version sentinel)" },
    { "from": "Q.WG3", "to": "Q.WC3-NSTAGE-UNSHELF", "kind": "glassui-publish-gate", "note": "the N-Stage unshelf rebases off the BC cut" },
    { "from": "Q.WG3", "to": "Q.WG-GATED-CONSUMES", "kind": "glassui-publish-gate", "note": "the glass-ui BC publish fires the glass-ui re-pin + the kf S1/S2 deletes" },
    { "from": "Q.WG3", "to": "Q.WZ", "kind": "glassui-publish-gate", "note": "glass-ui BC publish ─► kf S1/S2 delete (GATED) ─► Q.WZ; the SAME BC publish carries the keyframes.js peer-range widen to \"^4.0.0 || ^5.0.0\" — the Q.WZ S6 5.0.0-cut deploy precondition (else the post-5.0.0 master tree REDs proof:peer-satisfied and blocks the auto-deploy)" }
  ],
  "topologicalOrder": [
    "Q.W0",
    "Q.WA1", "Q.WA2", "Q.WA3", "Q.WA4",
    "Q.WG1", "Q.WG2",
    "Q.WB1", "Q.WB3-numeric", "Q.WB4",
    "Q.WC1", "Q.WC2", "Q.WC3", "Q.WC4", "Q.WC5",
    "Q.WD1-bind", "Q.WD1", "Q.WD2",
    "Q.WE1", "Q.WF2", "Q.WF1",
    "Q.WG-S1S2-HYGIENE", "Q.WG3", "Q.WG-GATED-CONSUMES", "Q.WG4",
    "Q.WB2", "Q.WB3-color", "Q.WE2", "Q.WC3-NSTAGE-UNSHELF",
    "Q.WZ"
  ],
  "invariants": {
    "acyclic": true,
    "noUnpublishedConsume": true,
    "dissolvedEdgeAbsent": "drag2D-light-export → Q.WC1"
  }
}
```

---

## §2 — The four internal ordering chains + the cross-repo publish chain (prose ↔ manifest map)

The manifest's `edges` encode EXACTLY the `Q.md §3` chains. Each chain below names its manifest edges so a
reader (and `proof:wave-charter`) can confirm the prose↔JSON correspondence is total.

### Chain 1 — the breaking-cut spine (`Q.md §3` friction-chain 1)
```
Q.WA1 (lint floor) ─► Q.WE1 (alias-drop + ~33-consumer migrate) ─► Q.WF1 (engine.ts split, a CLEAN class) ─► Q.WZ (5.0.0 cut)
                                                            ▲
                                       Q.WF2 (group.ts decomposition, clean proof:decomposition baseline)
```
Manifest edges: `Q.WA1→Q.WE1`, `Q.WE1→Q.WF1`, `Q.WF2→Q.WF1`, `Q.WF1→Q.WZ`, `Q.WE1→Q.WZ`.
The migration ENUMERATION (the **~33** sites listed in Q.WE1, not the charter's earlier "22") + the
gate-first `proof:alias-dropped` pre-empt the "migration discovers N scattered consumers mid-tranche"
deferral. The split lifts a class whose `@deprecated Animation` re-export is already gone (no dirty seam).

### Chain 2 — the NaN-frame pipeline (`Q.md §3` friction-chain 3 / the bind→guard chain)
```
Q.WD1-bind (attach-time deferred-resolution seam) ─► Q.WD1 (play-time NAMED_SELECTOR_NO_TIMELINE guard — NEVER a parse-throw)
```
Manifest edge: `Q.WD1-bind→Q.WD1`. The guard throw must land AFTER the attach-time seam, or it re-breaks the
**L.W1 S4 opaque-ingest floor** (the exact trap the impl drive fell into with a parse-time throw it had to
revert). `proof:nan-frame` asserts BOTH the S4-level `fromString` round-trip AND no-NaN-at-play.

### Chain 3 — the cross-repo publish chain (`Q.md §3` friction-chain 4 / `Q.md §4`)
```
Q.WA3 master-merge ─► parse-that 0.13.0 (Q.WG1) ─► value.js 1.1.1/1.2.0 (Q.WG2) ─► kf GATED consumes (Q.WG-GATED-CONSUMES / Q.WG4)
                                                                  │
                                                                  ├─► Q.WB2 @function inline   (GATED: dashed-call parse)
                                                                  ├─► Q.WE2 leaves externalize  (GATED: /math subpath)
                                                                  └─► Q.WB3-color SoA           (GATED: ColorChannelPlan)
                                                                                                        ▼
                                                                                                     Q.WZ (5.1.x additive cut)
```
Manifest edges: `Q.WA3→Q.WG1`, `Q.WG1→Q.WG2`, `Q.WG2→Q.WG-GATED-CONSUMES`, `Q.WG2→Q.WG4`,
`Q.WG-GATED-CONSUMES→{Q.WB2, Q.WE2, Q.WB3-color}`, `Q.WG4→{Q.WB2, Q.WE2, Q.WB3-color}` (logical),
`Q.WG-GATED-CONSUMES→Q.WZ`. Every GATED kf consume names the **EXACT** sibling publish that fires it (the
`gatedOn.siblingPublish` field); the value.js/parse-that dispatches carry `terminalOrKill: true` so they
cannot become perpetual punts. **No kf wave consumes an unpublished surface** (§4 below).

### Chain 4 — the glass-ui publish → S1/S2 delete chain (`Q.md §3` / `Q.md §4`)
```
Q.WG-S1S2-HYGIENE (NOW gate retarget) ─► glass-ui BC publish (Q.WG3, USER-DOMAIN) ─► kf S1/S2 delete (GATED, via Q.WG-GATED-CONSUMES) ─► Q.WZ
                                                            └─► Q.WC3-NSTAGE-UNSHELF (GATED)
```
Manifest edges: `Q.WG-S1S2-HYGIENE→Q.WG3`, `Q.WG3→Q.WG-GATED-CONSUMES`, `Q.WG3→Q.WC3-NSTAGE-UNSHELF`,
`Q.WG3→Q.WZ`. The NOW content-probe retarget (`Q.WG-S1S2-HYGIENE`) lands FIRST so the GATED deletes fire
against a correct content-probe (not the false-RED version sentinel the audit found). The glass-ui CUT is
**USER-DOMAIN** (`BD.W-CUT` confirm-first — the owner's hand).

### The DemoControlPoint chain — friction DISSOLVED (`Q.md §3` friction-chain 2)
```
Q.WA2 drag2D-CERTIFY (NO-OP, the export already shipped) ─► Q.WC1 DemoControlPoint (NOW-buildable) ─► Q.WC2 easing-editor dogfood
```
Manifest edges: `Q.WA2→Q.WC1` (`kind: certify-noop`), `Q.WC1→Q.WC2`. **`drag2D` is ALREADY a LIGHT barrel
export**, so the gating edge `drag2D → DemoControlPoint` is **DISSOLVED** and **MUST NOT appear** in `edges`
(it is recorded in `dissolvedEdges` with `assertAbsentFromEdges: true`). `Q.WA2` is a certification NO-OP
that boundary-locks the existing export and retires the stale `proof:control-point-live` "needs drag2D"
premise — it is an ordering-confirm edge, NOT a substrate-gating edge. The 9th-carry DM-2 has no remaining
blocker.

---

## §3 — The topological order (the acyclicity witness)

The `topologicalOrder` array in §1 is a valid linearization of `edges` — every edge `from` precedes its
`to`. A spot-check of the load-bearing edges:

| Edge | `from` index | `to` index | `from` < `to`? |
|---|---|---|---|
| `Q.W0 → Q.WA3` | 0 | 3 | ✓ |
| `Q.WA1 → Q.WE1` | 1 | 18 | ✓ |
| `Q.WE1 → Q.WF1` | 18 | 20 | ✓ |
| `Q.WF2 → Q.WF1` | 19 | 20 | ✓ |
| `Q.WF1 → Q.WZ` | 20 | 29 | ✓ |
| `Q.WD1-bind → Q.WD1` | 15 | 16 | ✓ |
| `Q.WA3 → Q.WG1` | 3 | 5 | ✓ |
| `Q.WG1 → Q.WG2` | 5 | 6 | ✓ |
| `Q.WG2 → Q.WG-GATED-CONSUMES` | 6 | 23 | ✓ |
| `Q.WG-GATED-CONSUMES → Q.WB2` | 23 | 25 | ✓ |
| `Q.WC1 → Q.WC2` | 10 | 11 | ✓ |
| `Q.WG-S1S2-HYGIENE → Q.WG3` | 21 | 22 | ✓ |

Every edge's `from` precedes its `to` in the §1 `topologicalOrder` array (the Band-G cluster orders the NOW
`Q.WG-S1S2-HYGIENE` retarget BEFORE the USER-DOMAIN `Q.WG3` publish, matching the `Q.WG-S1S2-HYGIENE → Q.WG3`
edge). The array in human-readable grouping:

```
Q.W0
Q.WA1 · Q.WA2 · Q.WA3 · Q.WA4
Q.WG1 · Q.WG2
Q.WB1 · Q.WB3-numeric · Q.WB4
Q.WC1 · Q.WC2 · Q.WC3 · Q.WC4 · Q.WC5
Q.WD1-bind · Q.WD1 · Q.WD2
Q.WE1 · Q.WF2 · Q.WF1
Q.WG-S1S2-HYGIENE · Q.WG3 · Q.WG-GATED-CONSUMES · Q.WG4
Q.WB2 · Q.WB3-color · Q.WE2 · Q.WC3-NSTAGE-UNSHELF
Q.WZ
```

`Q.WE2` (leaves externalize) is a **GATED** consume (value.js 1.2.0 `/math` subpath) and so sorts AFTER the
`Q.WG-GATED-CONSUMES` re-pin orchestrator alongside the other GATED consumes (`Q.WB2`, `Q.WB3-color`) — NOT
in the NOW Band-E/F cluster, even though Band E is its band. (Its NOW structural-gate legs —
`proof:no-cross-realm-cast`, the W97 clause — are authored earlier, but the externalize that the manifest
node represents fires on the GATED edge.) Because a topological order EXISTS, the graph is **acyclic** — the `B6-dag-ordering` "acyclic and fully
sequenceable with ZERO required mid-tranche deferrals" verdict, made checkable. (`proof:wave-charter`
computes its own Kahn/DFS sort over `edges`; this printed order is the human-readable witness, not the
gate's input — the gate reds if ANY valid order fails to exist, regardless of this array.)

---

## §4 — The no-unpublished-consume assertion (the no-deferral spine's second invariant)

Every node with `"phase": "GATED"` (or a GATED arm) carries a `gatedOn.siblingPublish` naming the EXACT
sibling surface that fires it, AND a `gatedOn.dispatchDoc` proving the consume is dispatched-or-published —
so **no kf wave consumes an unpublished sibling surface** (the `Q.md §3` friction-chain-4 invariant). The
roster:

| GATED node | Consumes | Sibling publish (the exact edge) | Dispatch doc (terminal-or-KILL) |
|---|---|---|---|
| `Q.WB2` | `@function` call-inlining | value.js **1.2.0** dashed-call parse arm | `KF-TO-VALUEJS-Q.md` (Q.WG2) ✓ |
| `Q.WB3-color` | ColorChannelPlan SoA | value.js **1.2.0** ColorChannelPlan surface | `KF-TO-VALUEJS-Q.md` (Q.WG2) ✓ |
| `Q.WE2` | `leaves.ts` externalize | value.js **1.2.0** `/math` subpath | `KF-TO-VALUEJS-Q.md` (Q.WG2) ✓ |
| `Q.WG4` / `Q.WG-GATED-CONSUMES` | the kf re-pin set | value.js **1.2.0** (Q.WG2) + glass-ui **BC** (Q.WG3) | `KF-TO-VALUEJS-Q.md` + `KF-TO-GLASSUI-Q.md` ✓ |
| `Q.WC3-NSTAGE-UNSHELF` | the N-Stage unshelf rebase | glass-ui **BC** cut | `KF-TO-GLASSUI-Q.md` (Q.WG3) ✓ |

The two NOW arms that touch a sibling surface that **already ships** are explicitly NOT GATED and carry no
`gatedOn` edge: `Q.WB1` (value.js 1.1.0 ALREADY parses `if(style(--p))`/`sibling-*` — confirmed
`B1-kf-emerging`), `Q.WC4` (`fromMorphSVG` + `PathGeometry.sampleAtLength` ALREADY published + installed),
`Q.WB3-numeric` (the `interp-buffer.bench.ts` SoA arm already exists). These are correctly NOW, not GATED —
no false gate on an already-shipped surface.

**The DISSOLVED edge assertion.** `proof:wave-charter` (Q.WA4 §S3) additionally asserts that
`dissolvedEdges[0]` (`drag2D-light-export → Q.WC1`) does **NOT** appear in `edges` — the reconciled fact
that drag2D is already LIGHT-exported, so Q.WC1 carries no substrate-gating edge. A future re-introduction of
that edge (a regression to the stale "demo reaches into HEAVY" premise) reds the gate.

---

## §5 — Cross-check against `Q.md §3` + `Q.md §4` (drift sweep)

I read `Q.md §3` (the prose DAG + the four pre-empted friction chains) and `Q.md §4` (the version narrative)
and cross-checked every edge. **No drift found.** The reconciliation points the orchestrator applied are all
honored:

| Claim | `Q.md` source | Manifest encoding | Match? |
|---|---|---|---|
| drag2D→DemoControlPoint edge DISSOLVED; Q.WC1 NOW-buildable | §2 (Q.WA2 row), §3 friction-chain 2, §3 line 76 | `dissolvedEdges[0]` + `Q.WA2→Q.WC1` is `certify-noop`, NOT gating | ✓ |
| lint tier is dep-cruiser ONLY (eslint KILLED) | §2 (Q.WA1 row) | `Q.WA1.title` "dep-cruiser ONLY; eslint KILLED" | ✓ |
| migration surface ~33, not 22 | §2 (Q.WE1 row), §3 friction-chain 1 | `Q.WE1.title` "~33-consumer migration" + §2 prose | ✓ |
| alias-drop → engine-split → 5.0.0 cut | §3 spine + friction-chain 1 | `Q.WE1→Q.WF1→Q.WZ` (+ `Q.WE1→Q.WZ`) | ✓ |
| NaN-frame bind → guard | §3 spine + friction-chain 3 | `Q.WD1-bind→Q.WD1` | ✓ |
| parse-that 0.13.0 → value.js 1.2.0 → kf consumes | §3 spine + §4 publish chain | `Q.WG1→Q.WG2→Q.WG-GATED-CONSUMES/Q.WG4` | ✓ |
| glass-ui BC publish → kf S1/S2 delete | §3 spine | `Q.WG3→Q.WG-GATED-CONSUMES→Q.WZ` (+ `Q.WG-S1S2-HYGIENE→Q.WG3`) | ✓ |
| master-merge reconcile is the FIRST motion | §3 line 68, §4 close paragraph | `Q.WA3` is the source of every NOW `merge-floor` edge; Q.WG1 (chain head) also descends from it | ✓ |
| Q.WA2 drag2D CERTIFY has NO gating edge | §3 line 76 ("NO gating edge") | `Q.WA2→Q.WC1` `kind: certify-noop` (ordering-confirm, not gating) | ✓ |
| every GATED consume names the exact publish | §3 friction-chain 4 | every GATED node's `gatedOn.siblingPublish` | ✓ |
| dispatches carry terminal-or-KILL | §3 friction-chain 4, §4 | `Q.WG1/Q.WG2/Q.WG3` `terminalOrKill: true` | ✓ |
| version chain pt0.13.0 → vj1.2.0 → kf5.0.0 → kf5.1.x | §4 DAG line + table | publish chain edges + `Q.WZ` (5.0.0 breaking, then 5.1.x additive) | ✓ |

**One representational decision recorded (not a drift).** `Q.md §2/§4` references the Band-G dispatches as
the logical waves **Q.WG1–Q.WG4**, while the wave-spec FILES on disk are `KF-TO-PARSETHAT-Q.md` (Q.WG1),
`KF-TO-VALUEJS-Q.md` (Q.WG2 + Q.WG4), `KF-TO-GLASSUI-Q.md` (Q.WG3), plus the two Band-G mechanics files
`Q.WG-GATED-CONSUMES.md` (the GATED re-pin orchestrator) and `Q.WG-S1S2-HYGIENE.md` (the NOW gate-retarget
precondition). The manifest carries BOTH the logical `Q.WG1…Q.WG4` nodes (matching `Q.md` prose) AND the two
mechanics nodes (matching the on-disk waves), with `Q.WG4` and `Q.WG-GATED-CONSUMES` representing the same
atomic re-pin from two views (the logical consume set vs. the orchestrator that fires it) — the
`gated-consume` and `gated-consume-logical` edge `kind`s distinguish them. This is intentional
double-representation so the manifest matches BOTH the charter's prose roster AND the wave-file roster; it
introduces no cycle (both descend from `Q.WG2`, neither points back).

---

## §6 — The terminal reading (the DAG, in one paragraph)

The Q DAG is acyclic and fully sequenceable with zero required mid-tranche deferrals. `Q.WA3`
master-merge-reconcile is the FIRST motion (all three repos to master so the deploy-of-record is
live-correct); from it descend every NOW engine/demo/correctness wave and the head of the cross-repo publish
chain. Four ordering chains carry real merge-correctness risk and are gate-enforced: the breaking-cut spine
(`Q.WA1`→`Q.WE1` alias-drop+~33-migrate →`Q.WF1` engine-split of a clean class →`Q.WZ` 5.0.0 cut, with
`Q.WF2` first to clear the decomposition baseline); the NaN-frame pipeline (`Q.WD1-bind` attach-seam →
`Q.WD1` play-time guard, NEVER a parse-throw — the L.W1 S4 floor held); the cross-repo publish chain
(parse-that 0.13.0 → value.js 1.1.1/1.2.0 → the kf GATED consumes → the 5.1.x additive cut); and the
glass-ui publish chain (the NOW S1/S2 content-probe retarget → the USER-DOMAIN BC publish → the GATED S1/S2
deletes + the N-Stage unshelf → close). The feared `drag2D → DemoControlPoint` gating edge is DISSOLVED —
drag2D is already a LIGHT barrel export, so `Q.WC1` is NOW-buildable and `Q.WA2` is a certification NO-OP;
that edge is asserted-absent from the graph. Every GATED kf consume names the EXACT sibling publish that
fires it and is backed by a terminal-or-KILL dispatch, so no kf wave consumes an unpublished surface. The
spine holds: acyclic, no-unpublished-consume, no dissolved-edge regression — checkable by
`proof:wave-charter`, not merely asserted.
