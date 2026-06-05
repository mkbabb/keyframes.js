# E — the consolidated prompt recap (A → B → C → D → constellation → E-ask)

Every user request and recurring precept across the FULL project history, each
with its **origin**, its **terminal status**, and **evidence**. This chains and
supersedes the per-tranche recaps:

- B: `B/FINAL.md` §Prompt recap (P1+P2)
- C: `C/audit/lanes/prompt-recap.md` (P1+P2+P3)
- D: `D/audit/prompt-recap.md` (P1→P5, A→B→C→constellation→D)

**No drops.** Every prior-tranche request resolves **ADDRESSED** (landed +
verified) or correctly **PENDING** (a D-owned close gated on glass-ui, NOT E's
scope). The E ask's items are **E-SCOPE** — net-NEW refinement findings from the
post-D 6-lane assay, not folded debt.

Status legend:

- **ADDRESSED** — landed + verified in a prior tranche; no E obligation
- **PARTIAL** — landed in part; the remainder has a named home (a D wave or an E wave)
- **PENDING** — authored + gated; D-owned close (D.W5/W6 on glass-ui 3.3.0) — **NOT E's scope**
- **E-SCOPE** — a net-NEW E finding (an E.W1–W6 wave); a *finding*, not a fold
- **HONORED** — a recurring precept threaded through (verified §Precepts)

---

## P1 (tranche A) — all ADDRESSED, chain-verified, no E obligation

| # | Request | Origin | Status | Evidence |
|---|---|---|---|---|
| A1 | Execute tranche A in full | A | ADDRESSED | A W0–W5 landed (`d84faf5`); `A/PROGRESS.md` all-waves-landed |
| A2 | Publish 3.0.0 first | A | ADDRESSED | `v3.0.0` tag + SLSA provenance |
| A3 | Export `RAFPlayback` PRM gate | A | ADDRESSED | `index.ts` exports `RAFPlayback`; B.W2 generalized → shared `Tickable` |
| A4 | Changesets + `--provenance` | A | ADDRESSED | `release.yml` `npm publish --provenance --access public` + `id-token:write` |
| A5 | Gate on green CI | A | ADDRESSED | `ci.yml` library gate chain; B/C/D extended (demo-smoke/occlusion/lighthouse) |
| A6 | `proof:boundary` (the value.js seam gated) | A | ADDRESSED | `scripts/proof-boundary.mjs` (hardened C.W4); boundary holds |
| A7 | `EasingResolvable` lazy-easing path | A | ADDRESSED-then-SUPERSEDED | A's resolver landed; B/C superseded with fail-explicit `resolveEasing`/`toEasing`; the A-era class is GONE (no alias) |

---

## P2 (tranche B) — every discrete request, ADDRESSED

| # | Request | Origin | Status | Evidence |
|---|---|---|---|---|
| B1 | Update all deps to latest | B | ADDRESSED | B.W1 (`6487c7f`); `B/audit/dep-upgrade-matrix.txt` |
| B2 | 6-agent deep audit of plan + changes | B | ADDRESSED | `B/audit/plan-findings.txt` (46 findings, 11 high) — all folded |
| B3 | Path forward · gestalt · no-workaround · no-legacy · transpositions | B | ADDRESSED (precept; threads to D + E) | `B.md` + `B/audit/architecture-gestalt.md`; net-deletion; **D transposed the engine to gestalt; E continues demo-side** |
| B4 | Fold chronically-deferred + deferred | B | ADDRESSED | `B.md` §fold; **terminated in D — see `deferred-ledger.md`** |
| B5 | Recap ALL prompts | B | ADDRESSED (chains forward) | `B.md` §Prompt recap; C→D→**this E recap** extend it |
| B6 | NOT an implementation phase (dev-only authoring) | B | ADDRESSED | B.W0 dev-only; user later authorized W1–W7 |
| B7 | Full lighthouse + best-practices, every page + facet | B | ADDRESSED (E re-runs the baseline) | `B/audit/lighthouse/after-prod/` (14 reports); **E.W4 re-runs lighthouse on every scene vs the B baseline** |
| B8 | Pull precepts + sync + before/after edict | B | ADDRESSED | precepts `8ccf9f4` on origin/main; capture harness checked in (C.W0) |
| B9 | Remove loading screen + improve loading | B | ADDRESSED | B.W4: splash removed (criticalCSSPlugin); monaco/three lazy; inv γ |
| B10 | 6 frontend-design agents audit design + glass-ui | B | ADDRESSED (E re-audits) | `B/audit/design-findings.txt` (43 findings); **E's 6-lane assay is the post-D re-audit** |
| B11 | Create next tranche with perfected CI | B | ADDRESSED (cadence) | the tranche cadence; library gate + demo-smoke in `ci.yml` |
| B12 | Audit every page desktop+mobile, NO occlusion, dock perfected, fully Playwright | B | ADDRESSED (HARDENED in C) | B.W3 `occlusion-gate.mjs`; advisory→HARD in C.W1 (§drift) |

---

## P3 (tranche C) — all ADDRESSED

| # | Request | Origin | Status | Evidence |
|---|---|---|---|---|
| C1 | Re-audit with 6 agents | C | ADDRESSED | `C/audit/plan-findings.txt` + `design-findings.txt` + animation audit |
| C2 | Devise the path forward | C | ADDRESSED | `C.md` (W0–W5); executed on `tranche-c-impl` (PR #3, CI-green) |
| C3 | Recap all prompts | C | ADDRESSED (chains forward) | `C/audit/lanes/prompt-recap.md`; D→**this E recap** extend it |
| C4 | NOT an implementation phase (then authorized) | C | ADDRESSED | C.W0 dev-only; user authorized W1–W5 |
| C5 | Fold deferred (owner + trigger) | C | ADDRESSED | C carried every B deferral forward; **D terminated the keyframes-owned set** |
| C6 | 6-agent demo design inventory | C | ADDRESSED | `C/audit/design-findings.txt` (6 lenses) |
| C7 | Make B's close honest (inv ε) | C | ADDRESSED | C.W1 + C FINAL §B-overclaim reconciliation — all 7 corrected by re-runnable instruments |
| C8 | Make the design language whole (φ-ladder) | C | ADDRESSED (display tier) | C.W2: 58 sites → semantic ladder; sweep = 0. **Leaf-tail → D.W2 (closed; chronic ENDED in D)** |
| C9 | Make the shop-window run on its own engine (inv ζ) | C | ADDRESSED | C.W3: 7 hand-rolled rAF → light engines; `proof:dogfood`. **The listener/observer analogue is E.W2 (net-new)** |
| C10 | Before/after capture (re-runnable from repo) | C | ADDRESSED | `scripts/capture.mjs` checked in; `C/audit/DELTA.md` |
| C11 | π at full | C | ADDRESSED | `C/audit/pi.md` — π binds at FULL (`KF_RM_HONORED=1` + contrast table) |

---

## P4 (the constellation drive) — keyframes-relevant requests

| # | Request | Origin | Status | Evidence |
|---|---|---|---|---|
| D-C1 | The dock+animation convergence (keyframes' arm) | constellation | ADDRESSED | the VT-parity spring shipped in glass-ui (PR #1); slides spring-dogfood `29a781a` clean |
| D-C2 | The dock convergence + naming plan (keyframes' obligations) | constellation | **PENDING — D.W5 (D-PENDING-ON-E1)** | the local renames (`TopDock`→`ChromeDock`, `AnimationMenuBar`→`TransportDock`) + `dock/index.ts` deletion are D.W5, gated on glass-ui 3.3.0; the `<Role>Dock` base-component leverage is OUT (AU.W8). **D's close, NOT E's** |
| D-C3 | Consume published-not-branches; gate on own green CI (inv-27) | constellation | ADDRESSED (posture, threads to E) | D pins published value.js/glass-ui; **E's waves are gate-free of glass-ui (independent of D.W5/W6)** |
| D-C4 | Keep `springLinearStops()` stable (the slides/glass-ui enabler) | constellation | ADDRESSED (E keeps stable) | the export stays light + value.js-free (`proof:boundary`); **OUT-2; E.W5 does not touch it** |

---

## P5 (tranche D) — the four constraints + the dev-only authoring boundary

| # | Request | Origin | Status | Evidence |
|---|---|---|---|---|
| D1 | The demo refined (decompose the oversized units, KISS) | D | ADDRESSED (D.W1) — **E.W1 is round 2** | D.W1 decomposed the 5 oversized units (landed `905a8c3`). **E.W1 is encapsulation r2 — the NET-NEW residual the D decomposition did not target (App.vue, useOrbitalPointer)** |
| D2 | The design language localized + un-caged (styling gestalt) | D | ADDRESSED (D.W2) — **E.W3 is round 2** | D.W2 owned the rented idioms + φ-ladder leaf-tail (landed). **E.W3 is styling r2 — the NET-NEW residual (gold-shimmer rent, arbitrary-value tokens, dvh reconcile)** |
| D3 | Brittleness hardened (selectors · reactivity · fragile rules) | D | ADDRESSED (D.W3) — **E.W2 completes the gestalt** | D.W3 hardened the querySelector/reactivity set (landed). **E.W2 is the vueuse listener/observer gestalt — the inv-ζ analogue D.W3 began** |
| D4 | The engine transposed to its gestalt (elegance · perf) | D | ADDRESSED (D.W4) | D.W4 (group zero-alloc, `advanceTo`, computed round-trip, `Animation` split, honest pause, `\|any` + re-exports) landed (`a0303fe`/`6e29236`). **The engine is EXEMPLARY post-D; E.W5 is BOOK-only housekeeping** |
| D5 | The dock leveraged + the mobile composition closed | D | **PENDING — D.W5 (D-PENDING-ON-E1)** | gated on glass-ui PUBLISHING 3.3.0; the heartbeat (`b5gt704vz`) auto-resumes. **D's close, NOT E's** |
| D6 | Every keyframes-owned deferral terminated (P-invariant-28) | D | ADDRESSED | `D/audit/deferred-ledger.md` — zero un-dispositioned punts. **The consolidated ledger (`deferred-ledger.md`) confirms ZERO KFE for E** |
| D7 | Recap ALL prompts | D | ADDRESSED (chains forward) | `D/audit/prompt-recap.md`; **this E recap extends it** |
| D8 | NOT an implementation phase (D.W0 dev-only) | D | ADDRESSED | D.W0 = the tranche docs + audit. Then authorized; D.W1–W4 landed; W5/W6 pending |
| D9 | elegance / simplicity / performance · transpositions · NO legacy · KISS · isomorphic | D | HONORED (precept; threads to E — §Precepts) | D-1..D-6 carry the rationale; **E threads the same precepts (see §Precepts)** |
| D10 | The version owner named for the stacked changesets | D | **PENDING — D.W6** | D.W6 names the version owner. `D/FINAL.md` not yet written (D.W6 closes after D.W5). **D's close, NOT E's** |

---

## P6 (this E ask) — the net-NEW E findings (E-SCOPE) + the dev-only boundary

Every E ask item is **E-SCOPE** — a net-NEW finding the post-D 6-lane assay
surfaced, NOT folded debt. Each is file:line-grounded + verifiable.

| # | Request | Origin | Status | E wave + evidence (file:line, verified at E-open) |
|---|---|---|---|---|
| E1 | Lighthouse every page; perf optimization strategy | E ask | **E-SCOPE (E.W4)** | the B baseline (`B/audit/lighthouse/after-prod/`, 14 reports, Perf 89–96) → target ≥95 per scene; Long-Task/INP relief, LCP/font-loading, `content-visibility` off-screen scenes |
| E2 | Compare core primitives + last-tranche items vs developer.chrome.com/docs/modern-web-guidance | E ask | **E-SCOPE (E.W4)** | the engine is modern-API-aligned (scheduler.yield live-probed, WAAPI delegated, reduced-motion unified, ScrollTimeline correctly JS-driven — ARCH-1); `npx modern-web-guidance@latest install` → a comparison checklist; verify reka-ui dialogs/popovers ride native `<dialog>`/Popover API |
| E3 | Frontend encapsulation / composables / state audit | E ask | **E-SCOPE (E.W1)** | App.vue **452L** (verified `wc -l`) → `usePlaybackSnapshot` + `useSceneSwap`; useOrbitalPointer **376L** (`orbital-drag/composables/useOrbitalPointer.ts`) thinned (transforms → OrbitalDrag.vue); EasingCurveCanvas **351L** cohesive → leave. Naming/colocation/stores/markRaw/provide-inject idiomatic |
| E4 | Non-idiomatic Tailwind / global-monolith / deprecated-CSS / fragile-rules audit | E ask | **E-SCOPE (E.W3)** | `.gold-shimmer` ungated rent — used ×3 (`AnimationControlsControls.vue:69`, `EasingSelect.vue:23,59`), **ZERO demo-local definition** (verified `grep '\.gold-shimmer' demo/**.css` = empty) → own locally; `min-w-[12rem]`×3, `w-[30vw]`, `w-[calc(100%-3rem)]`, `EasingSelect max-h-[min(24rem,60dvh)]` → tokens; `--panel-max-h: 60vh` (`design-idioms.css:79`) vs `60dvh` variants (`ResponsiveSelect.vue:58`) → reconcile; `.progress-bar` dup → dedup |
| E5 | Deeply-nested / brittle selectors audit | E ask | **E-SCOPE (E.W2)** | manual `addEventListener` in **6 files** (15 sites — SpringTarget, PlaybackRibbon, useDragCapture, useOrbitalPointer, AssetViewport, AssetLayerPanel; verified `grep`); **3** `new ResizeObserver` (EasingTarget.vue:231, AmigaScene.vue:84, CSSCodeEditor.vue:156) → `useEventListener`/`useResizeObserver`; 2 querySelector couplings (KeyframeCardList.vue:51 `querySelectorAll("pre")`, AnimationControls.vue:190 `data-state=active`) → owned refs |
| E6 | Engine housekeeping (the post-D BOOK items) | E ask | **E-SCOPE (E.W5, BOOK-only)** | document the managed-animation pause contract (a comment — `group.ts:126,579`); `tryParseCache` eviction (`utils.ts:145`) ONLY if measured (measure-first, else recorded-withheld). The engine is at gestalt — E records, barely edits |
| E7 | Recap ALL prompts | E ask | ADDRESSED (this file) | this recap chains A→B→C→D→constellation→E; **no drops**; the two drifts tracked §drift |
| E8 | The clean deferred-ledger (zero KFE) | E ask | ADDRESSED | `deferred-ledger.md` — D terminated EVERY keyframes-owned deferral; **ZERO KFE for E**; P-invariant-28 satisfied (E folds no chronic debt) |
| E9 | NOT an implementation phase (E.W0 dev-only authoring) | E ask | HONORED | E.W0 = the E tranche docs + audit evidence (lighthouse baseline, modern-web checklist, the 6-lane assay, this recap, the ledger). **No engine/demo/library source written this turn.** E.W1–W6 open only on explicit authorization — exactly D's dev→impl boundary |
| E10 | inv-16 (E writes only keyframes.js) | E ask | HONORED | every E artefact lands under `/Users/mkbabb/Programming/keyframes.js/docs/tranches/E/`; glass-ui (ASK-2/3, AU.W8) stays OUTWARD; no sibling tree written |

---

## §Precepts — the recurring constraints, verified HONORED across A→E

Each is a STANDING precept the user has reasserted; verified threaded through
the E tranche (not asserted — checked against the plan + the live repo).

| Precept | Origin | Status across A→E | E-specific verification |
|---|---|---|---|
| **NO legacy / deprecated codepaths** | B3, D9 | HONORED — D.W4 DELETED the deprecated path-compat re-exports outright (no deprecation shim); the A-era `EasingResolvable` class is gone (no alias) | E adds no legacy; E.W3 closes the `gold-shimmer` rent by OWNERSHIP (not a shim); E.W2 replaces manual listeners with the idiomatic vueuse form (no compat wrapper) |
| **NO quick solutions / workarounds** | B3, D9 | HONORED — the dock mask was NOT patched in-demo (a glass-ui-root fix, per memory); every fix is the gestalt transposition | E.W2 is `useEventListener`/`useResizeObserver` (the idiomatic primitive), not a hand-rolled cleanup; E.W4 prefers container-query/anchor-positioning where it REMOVES hand-rolled JS |
| **idiomatic + gestalt** | B3, D9 | HONORED — inv ζ (rAF dogfood), the engine transposition, the φ-ladder | E.W1 (composables), E.W2 (the vueuse listener gestalt — the inv-ζ analogue completed), E.W3 (design tokens) are all the idiomatic form |
| **architectural transpositions (elegance/simplicity/performance)** | D9 | HONORED — D.W4 was the engine's gestalt transposition | E.W1 net-deletes via composable extraction; E.W4 transposes hand-rolled JS → native platform (content-visibility, `<dialog>`/Popover, anchor-positioning) |
| **isomorphic styling (pixels unchanged unless HIGHLY befitting + named)** | D9 | HONORED — D.W2 was isomorphic | E.W3 is explicitly isomorphic: gold-shimmer owned locally (pixels identical — same cascade, demo-local source), arbitrary values → tokens (same computed value), `dvh` reconcile NAMED. The capture harness AFTER ≈ BEFORE |
| **KISS** | D9 | HONORED — net-deletion across waves | E.W1/W2 net-delete; E.W5 is BOOK-only (a comment, not code; eviction measure-first) — E barely edits the library |
| **inv-16 (writes only keyframes.js)** | D, E ask | HONORED — D wrote only keyframes; the glass-ui tranche was begotten into the hub | E writes ONLY under `keyframes.js/docs/tranches/E/`; glass-ui asks stay OUTWARD (OUT-1..4); no sibling tree touched |

**No precept is dropped.** Each recurring constraint is verified honored in the
E tranche, file:line- or plan-grounded, never asserted.

---

## § The two historical drifts — corrected in C, preserved (NOT dropped)

The chain preserves both corrections so they are not silently re-absorbed:

### Drift 1 — B's falsely-closed LoAF

- **The drift:** B's FINAL marked the LoAF >50ms-trace subsystem closed with a
  2nd consumer that was a stub.
- **The correction (C.W1):** `bench/playwright.bench.ts` became the REAL 2nd
  consumer (200-cell AnimationGroup, reads `window.__kfLoaf`, fails on >50ms;
  reddens on a >50ms inject). D verified no regression (D-1 gave headroom).
- **E's posture:** CL-4. E.W4's Long-Task/INP relief is *aligned* — it should
  give the gate further headroom, never regress it. The drift stays tracked.

### Drift 2 — B's advisory inv δ

- **The drift:** B demanded "zero dock-over-content overlap" but shipped a
  console NOTE, never running controls-open.
- **The correction (C.W1):** the gate was promoted to a HARD failing assertion
  (content-rect intersection, both axes, bite-proven). One real occlusion
  (square/mobile) → a named self-cleaning allowance → terminated in D.W5.
- **E's posture:** CL-3. The HARD gate stays HARD; E's demo waves must not
  reintroduce an occlusion. The advisory→hard promotion is the template for E's
  own "falsifiable hard gate per wave" discipline.

---

## Verdict

No P1/P2/P3/P4/P5 request is DROPPED. Every prior-tranche request resolves
**ADDRESSED** or correctly **PENDING** (D.W5/W6 — D's close, gated on glass-ui
3.3.0, NOT E's scope). Every E-ask item resolves **E-SCOPE** (a net-NEW finding
with a named E wave + file:line evidence) or **HONORED** (the dev-only boundary +
inv-16). The recurring precepts (no-legacy, no-workaround, idiomatic+gestalt,
isomorphic, KISS, inv-16) are each verified HONORED across A→E. The two
historical drifts are corrected-and-preserved. The only un-orphaned-by-design
loose end is the stacked publish leg (USER-DOMAIN; version owner named in D.W6
for B/C/D, E names its own in E.W6).

**E's content is net-NEW, stated honestly:** the deferred ledger is CLEAN (zero
KFE — D was the terminal home for every keyframes-owned deferral); E folds no
chronic debt because none remains (P-invariant-28). The E waves are findings
from the post-D 6-lane assay, not inherited deferral.
