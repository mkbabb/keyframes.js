# Constellation IMPLEMENTATION run-board (the resumable state)

> The autonomous implementation drive authorized 2026-06-22 ("complete the plan IN TOTALITY";
> publish/push/deploy authorized). This file is the **resume anchor** — the retry cron (job 12232700,
> fires :17/:47) reads it to know the current phase + last-completed leg. Update it after EVERY leg.

**DAG:** `parse-that B (0.12.0) ─► value.js P (1.1.0 API · 1.2.0 perf) ─► keyframes O+P (5.0.0 major · 5.1.x perf) ─► Cloudflare deploy`

## Phase ledger

| # | Phase | Repo | Deliverables | Status |
|---|-------|------|--------------|--------|
| 0 | Grounding + setup | — | RUN-BOARD + tasks + retry cron | ✅ DONE (2026-06-22) |
| 1 | **parse-that B** | parse-that | PT-B1 packrat fix (BLOCKER) · PT-B3 fusion+dispatch+proof:perf · PT-B4 SpanParser KILL → publish **0.12.0** | ✅ DONE — **0.12.0 PUBLISHED** (registry-verified), pushed `tranche-b`+tag; build clean, 111/111 tests, 6/6 gates GREEN; value.js consumes it green (1871 tests) |
| 2 | **value.js P** | value.js | VJ-L3 parseCSSSubValue · VJ-P1 color2Into · VJ-P3 :any→string · VJ-CSS1 extractFunctions · VJ-CSS2 sibling-index → publish **1.1.0** (contrast-color/if-multibranch deferred to a follow-up patch) | ✅ DONE — **1.1.0 PUBLISHED** (registry-verified), pushed `tranche-p`+tag; 1901 tests, gates green; color2Into 84→37 allocs (56%); proof:perf-target no regression (0.12.0≈0.11.0, isolation-proven) |
| 3a | **keyframes O substrate** | keyframes.js | O.W7 engine-seam split (1397→~900) · O.W6 fromMorphSVG · O.W5 DemoControlPoint · O.W8 perf · O.W9 no-legacy · O.W16 WeakMap S8 + VJ-L3 S9 consume → **5.0.0** | ⬜ PENDING |
| 3b | **keyframes P** | keyframes.js | P.W1 apparatus · P.W2 SoA · P.W3 _styleOut · P.W6 heatmap · P.W11 WeakMap · P.W13 emerging-CSS · P.W5/W7/W8 demo fleet · P.W9 correctness · P.W10 no-legacy · P.W12 S2 consume → **5.1.x** | ⬜ PENDING |
| 4 | **Deploy** | keyframes.js | CI green · build gh-pages · Cloudflare deploy keyframes.babb.dev · round-trip verify | ⬜ PENDING |

## Last-completed leg
**Phase 1 ✅ (parse-that 0.12.0 published) · Phase 2 ✅ (value.js 1.1.0 published) · Phase 3a IN PROGRESS.**
kf pins bumped to value.js ^1.1.0 + parse-that ^0.12.0, installed, baseline GREEN (891 tests, tsc clean).
**Phase 3a Batch 1 (workflow, 3 Opus lanes) running:** L1 utils.ts (S9 parseCSSSubValue consume + drop parse-that dep + S8 WeakMap FN_NAME + P.W3 _styleOut), L2 group.ts (P.W2 SoA Float64 compositor), L3 compile-pipeline (P.W13 resolve-values.ts if/spring NOW + P.W9 NaN-frame cure).
NEXT: integrate+verify Batch 1 (tsc + 891 tests + new gates) → Batch 2 (O.W6 fromMorphSVG · P.W1 apparatus+O.W8 · O.W9 no-legacy) → Phase 3b demo fleet → build+deploy.
SCOPE NOTE: O.W7 engine.ts split DEFERRED (risky internal re-org, no deploy/perf benefit; O.W9 alias-drop kept per no-legacy). VJ-CSS3 contrast-color + if() multibranch deferred to value.js follow-up.

---
### (historical) Phase 1 parse-that B detail:
- **PT-B1 (BLOCKER) DONE** — packrat.ts: src-epoch auto-reset guard + float64 multiply-key (id*2^20+offset, fixing the int32 `<<20` overflow at id≥4096) + offset-extraction via `% MEMO_OFFSET_SPAN`; getCijKey exported; 3 cross-input tests in memoize.test.ts; gate `scripts/proof-packrat-cross-input.mjs`.
- **PT-B4 (KILL) DONE** — span.ts: deleted the SpanParser introspection tier (tagged-union/callSpan/spanParserToParser/*Node ctors) + span-dispatch.bench.ts; A.W3 paragraph in future-research.md §7; gate `scripts/proof-span-parser-killed.mjs`. **RECONCILIATION:** the `*Span` closure builders are a PUBLISHED+gated surface (./index + ./core, dist-surface.test.ts) → KEPT (deleting them would break the "0.12.0 BC-additive" promise; FULL-LOOP "delete them" overreached). PT-B2 stays deferred.
- **PT-B3 (fusion+dispatch+proof:perf)** — re-deployed after a rate wall (workflow running).
- NEXT after B3: integrate (wire package.json scripts: proof:packrat-cross-input, proof:span-parser-killed, proof:perf, bench), run full suite + typecheck + build + gates, publish **0.12.0**.

## Invariants for the drive
- DAG-ordered: never consume an unpublished sibling surface. Build+test GREEN before every publish.
- Idiomatic/gestalt, no workarounds, no-legacy. Each wave's born-RED gate must go GREEN on its real observable.
- npm publish + git push + Cloudflare deploy are all authorized (owner, 2026-06-22).
- Workflow fanout = Opus/Sonnet; core model (Opus 4.8) orchestrates + verifies + integrates + publishes.
