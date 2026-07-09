# RE-CRITIQUE (Pass-2) — sd-demo (Band S.D: Demo gestalt)

**Agent:** re-critique / convergence check · **Band:** S.D · **Date:** 2026-07-02
**Inputs:** pass1/critique/sd-demo.md (10 blocking edits, 35%) · SPEC-v3 §3 S.D (l.761-862) +
§2.2 rulings (C-17/C-23/C-24) + §6.2/6.3 + §9 disposition table (SD rows) + Pass-2 addendum (P2-1) +
the DAG · prototypes/p04 + p06 (inherited) · **pass2/p2-1-demo-shared-carve.md** (the NEW D2 probe).

**Headline:** ALL 10 Pass-1 blocking edits are absorbed IN THE BAND TEXT (not merely tabled), and the
single largest Pass-1 gap — SD-9, "D2 is UNPROTOTYPED" — is now discharged by an executed probe (P2-1,
verdict **confirms-spec**) whose 5 adjustments are each folded into §3 S.D2 with quoted evidence. No
mis-absorption, no v3-introduced contradiction, no dropped evidence item. **Convergence: 100%.**

---

## A. Pass-1 blocking edits — absorption verified in v3 band text

**SD-1 — directional proof:app-is-shell + stale-depth clause.** VERIFIED. §3 S.D1 l.776-782:
"born-RED **proof:app-is-shell** — (i) no file under `app/` is imported by **exactly one non-app
area** (mis-home; cross-area files — ≥2 scenes per C-23, or app-shell — may reside in `app/runtime/`);
(ii) no moved file's relative import escapes into a stale depth (catches the depth-bump class by
construction); (iii) shell-ness is structural…". Born-RED anchor present: "Born-RED today via
`cubeTransformStore.ts` (single-scene-consumed, lives in app/)" — directional AND reachable-to-GREEN,
exactly the r2-anti-pattern fix Pass-1 §2.1 demanded.

**SD-2 — reclassify the five as cross-scene → app/runtime/; evict ONLY cubeTransformStore; delete
"evict the five".** VERIFIED. §3 S.D1 l.765-769: "The five cross-scene files (…) are cross-scene
recipes (≥6 scene importers, verified) and stay IN `app/runtime/` — v1's 'evict the five scene-tier
files to their real homes' contradicted the layout the probe validated and is **DELETED** (sd-#2);
only `cubeTransformStore.ts` is evicted OUT → `scenes/cube/`." Fold row 30 rewritten (l.1341: "evict
ONLY cubeTransformStore → scenes/cube/; the five are cross-scene recipes → app/runtime/"). The §2.2
scope conflict is resolved.

**SD-3 — six-item touch set, SCENE_GATE_META.compose FIRST.** VERIFIED. §3 S.D3 l.836-847 enumerates
items 1-6; item 1 (l.837-838): "**`SCENE_GATE_META.compose` in `scripts/lib/demo-driver.mjs` —
FIRST** (fail-loud: without it all 82 demo-driving gates throw at module load)". All six match p06
§4.1 (DFA triple, SCENE_DIRS+=compose, published-surface minus playground, S9 egg re-point, "8 scenes"
prose sweep).

**SD-4 — DAG edge S.G→compose-fleet-green; proof:compose-scene closes after G.** VERIFIED. §3 S.D3
l.851-855: "authored at D3 but **CLOSES after S.G** (compose auto-enrolls in the
occlusion/a11y/font/stage-visible runtime fleet; DAG edge S.G1/G2 → compose-fleet-green →
proof:compose-scene close; else the wave born-GREENs-then-reds mid-band, a T4 violation)." DAG block
l.1277 carries `S.D3 ──► … S.G2(compose items)`, so the close-after-G ordering is in the diagram too
(G2 discharges the compose fleet after D3 registers). The born-GREENs-then-reds T4 violation is
averted.

**SD-5 — scenes.ts depth bump (16) + same-commit atomicity (demo-driver feeds 5 gates).** VERIFIED.
§3 S.D1 l.769-773: "`scenes.ts` reaches the sibling tree through 16 `../scenes/…` imports — the move
requires the `../scenes/` → `../../scenes/` depth bump (8× TS2307 if missed). **Same-commit
atomicity:** the gate/lib path-swaps (7 proof scripts + `scripts/lib/demo-driver.mjs:83`, which feeds
5 gates) land in the SAME commit as the file moves — there is no intermediate green."

**SD-6 — define "consuming area" for proof:shared-has-n-consumers.** VERIFIED. C-23 (l.434-439):
"**Per-scene counting:** each `demo/scenes/<name>/` is its own area; `app/` is one area; each `@/`
top-level module is one area… Collective counting (all scenes = one area) is **rejected**". Wired
into the gate at §3 S.D2 l.828: "any @/ module with <2 consuming areas (C-23: per-scene counting)
REDs". The ambiguity that blocked gate authoring is pinned.

**SD-7 — de-numeric the App.vue ≤360L shell gate.** VERIFIED. §3 S.D1 l.780-782 clause (iii):
"shell-ness is structural (imports/concern membership) — App.vue's line count is an **observed
tripwire recorded in the wave doc, NOT a GREEN criterion**." The C-5/T2 arithmetic-in-a-gate
contradiction is removed; §7 T2 corroborates (disposition table SD-7).

**SD-8 — settle use<Name>Demo BEFORE D3; add compose to SCENE_DIRS with chosen peer.** VERIFIED.
C-17 (l.371-374): "The demo composable naming convention is `use<Name>Demo` — **ruled NOW, before
D3**… S.D3 registers compose as `useComposeDemo.ts` from birth". §3 S.D3 item 3 l.841 adds compose to
SCENE_DIRS "with the `demo: useComposeDemo.ts` peer". The p06 self-inconsistency
(useComposeAnimations vs useComposeDemo) is terminally resolved; no rename churn.

**SD-9 — prototype D2 OR author its gate against an explicit census-derived touch-set.** VERIFIED —
**both branches delivered.** §6.2 l.1457 records **P2-1 EXECUTED** (confirms-spec); the born-RED
`proof:shared-has-n-consumers` gate is authored against the a24 census + the P2-1-measured touch-set
in §3 S.D2. This was the -10 "missing evidence-demanded item" and the highest-risk hole; it is now
closed by a run probe, not an assertion.

**SD-10 — carry p04's D1 cost + relax/re-justify A4→D1.** VERIFIED. §3 S.D1 l.785-786: "**DAG
relaxed (sd-#10):** D1 reds NO frozen appearance gate (p04 F4 …), so D1 runs parallel to A4… **Deps:
A0.** (Cost carried from p04: ~16 moved + ~10 source-edit sites + 2 test files + 8 gate/lib sites.)"
DAG block l.1275 lists `S.D1` under `S.A0` (not A4); l.1290-1291 re-justifies ("A4's FROZEN-set
declaration precedes any demo wave that reds a *layout/appearance* gate (D3, E, G — NOT D1)").

---

## B. P2-1 probe adjustments — folding verified (the NEW v3 content this round must check)

The probe returned **confirms-spec** (mechanical; no unknown coupling; no @/ re-inventory). Its five
adjustments (Pass-2 addendum P2-1.1-.5, l.1806-1812) are each folded:

1. **Cost split by operation (P2-1.1).** VERIFIED. §3 S.D2 l.799-812 carries "**The P2-1 cost model
   (binding — the two move operations have OPPOSITE fallout profiles):** *Stores hoist:* HIGH source /
   ~ZERO structural gate reds — ~46 edit sites (9 moved + 3 config + 22 demo import-swaps + 7
   test-swaps + 1 injectionKeys + 4 gate path-constants)… *Transport peer move (6 shells):* LOW source
   — **1 real external import edge** (EditorShell.vue) + 9 intra-shell rewrites (**the a24 census
   over-counted comment/JSDoc mentions as import edges**) / **HIGH gate: ~7–10 gates hardcode the
   shell paths as curated scope-file SETS**… Author `proof:shared-has-n-consumers` AND repoint those
   shell-path gates in the SAME commit". The ~46 arithmetic and the 7 named gates
   (control-surface-single-writer:89, drawer-spring, mobile-single-page, no-single-option-select,
   demo-shell-grid S1-S4, cartoon-is-panel-depth S1, idioms:603-605) match P2-1 §5 + F1/F2/F3 exactly.

2. **Walker-root arming audit (P2-1.2).** VERIFIED. §3 S.D2 l.817-820: "**The walker-root
   arming-audit (T7; P2-1 F5):** a peer move is blindspot-safe ONLY while the structural walkers root
   at `demo/` — D2 audits every structural gate's walk root before the move; **`proof:decomposition`
   (roots at `animation-controls/`, `:79`) is the named one** to verify does not silently drop the
   peer-moved files." Matches P2-1 F5 (the named `:79`/`:200` root) precisely.

3. **@state bare+wildcard pair + gh-pages gate run (P2-1.3).** VERIFIED. §3 S.D2 l.820-825: "the
   `@state` alias needs the **bare + wildcard tsconfig pair** (`"@state"` AND `"@state/*"` — the
   wildcard alone leaves the bare barrel import at 8× TS2307) across vite/vitest/tsconfig; and
   `tsc --noEmit` does NOT type-check `.vue` SFCs — **the D2 gate run MUST include `gh-pages`** (two
   broken `.vue` `./stores` imports passed `check` in the probe and were caught only by vite), plus
   vitest after `build:lib`." Matches P2-1 F7. The gate's verification run is restated at l.829
   ("`check` AND `gh-pages` AND the vitest set").

4. **497L/477L carve reframed as CSS/template split (P2-1.4).** VERIFIED. §3 S.D2 l.813-816: "*The
   497L/477L carve, REFRAMED (P2-1 F6):* ControlsPaneWrapper = 298L scoped CSS + 71L script + 123L
   template — the carve is a **scoped-CSS/template split**, import-neutral by construction (the public
   SFC keeps its name/interface; zero external importer changes), NOT a logic decomposition; do not
   expect it to relieve any logic-complexity gate." Matches P2-1 F6 line-census verbatim.

5. **D2 ⟵ G1 edge KEPT (P2-1.5).** VERIFIED. §3 S.D2 l.825-830: "**Sequencing (C-24; P2-1 F8 — the
   edge is CONFIRMED load-bearing, not relaxable):** D2 lands AFTER G1 (`proof:stage-visible` does not
   exist pre-G1) and re-runs it green on the post-carve tree… **Deps: D1, G1.**" C-24 (l.441-445) and
   DAG l.1277 (`S.A4 + S.D1 ──► S.G1 ──► S.D2`) both encode G1→D2. The edge is not relaxed — matches
   P2-1 F8.

---

## C. Admissible new-blocking scan (mis-absorption / v3 contradiction / dropped evidence)

- **Mis-absorption:** none. Every SD row and every P2-1 addendum row is delivered in the band text,
  quoted above — not table-only.
- **v3-introduced contradiction:** none. The one structural move v3 made (D1's dep A4→A0) is
  internally consistent: G1 still requires `S.A4 + S.D1` (l.1277), D2 requires `D1, G1` (l.830), D3
  requires `D2, A4` (l.856); no edge is left dangling and no cross-band collision arises. The
  A4→D1 relaxation is justified by p04 F4 (D1 reds only source-path gates), not asserted.
- **Dropped evidence:** none. The `proof:scene-colocated` three-wave edit-order hazard (Pass-1 §7,
  soft) is carried at l.1292 ("canonical edit order A4 → D2 → D3"). The a12 F1/F2 KfPillTabs HIGH
  defect (Pass-1 cross-band) is fold row 71 with the wave pointer corrected to S.D2/B7.

**No admissible blocking items.**

---

## D. Polish (non-blocking)

- The compose "close-after-G" relationship is fully specified in §3 S.D3 prose but the DAG *diagram*
  block (l.1277) shows only `S.D3 ──► S.G2(compose items)`; an explicit `S.G2(compose) ──►
  proof:compose-scene close` node would make the diagram self-contained. Wording/diagram nicety, not a
  gap — the prose is unambiguous.
- The D3 Image/SVG asset-kind decision (l.848, "make real or drop the menu items") is an orthogonal
  impl-time sub-item; correctly scoped as independent of the mount path. Fine as-is.

---

## E. Score

| Pass-1 deduction | v3 disposition | Recovered |
|---|---|---|
| −15 proof:app-is-shell undefined predicate (§2.1) | SD-1 directional gate, born-RED + reachable | +15 |
| −10 "evict five" contradicts a23/p04 (§2.2) | SD-2 reclassified cross-scene; only cubeTransformStore out | +10 |
| −10 D2 UNPROTOTYPED (§5) | SD-9 P2-1 EXECUTED (confirms-spec) + census-derived gate | +10 |
| −10 "area" granularity undefined (§4.1) | SD-6 / C-23 per-scene counting | +10 |
| −10 App.vue ≤360L numeric target (§4.2) | SD-7 structural shell-ness; count = tripwire | +10 |
| −10 compose name settled before D4 rule (§4.3) | SD-8 / C-17 use<Name>Demo ruled NOW | +10 |

All six Pass-1 deductions recovered; the §3 mechanical undercounts (depth-bump, six-item touch set,
DAG close-after-G) absorbed; all five P2-1 probe adjustments folded with matching evidence.

**Convergence: 100%.** Band S.D is implementable-as-written: the largest wave (D2) is now
probe-validated with a binding, operation-split, census-derived cost model; every gate is directional
and falsifiable-to-closure; the DAG sequencing (A0→D1 ∥ A4; A4+D1→G1→D2→D3; close-after-G) is
consistent. blocking = empty.
