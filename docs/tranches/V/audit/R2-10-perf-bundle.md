# Lane R2-10 — PERF + BUNDLE TRUTH COMPLETION

Finding-ID prefix: `PB-`. Auditor: R2-10 (Sonnet). Date: 2026-07-17. Source: the AUDIT COPY at `scratchpad/kf-audit-copy` (fresh Glass linkage `glass@e7da7b5c`, AUDIT-PROBE TooltipProvider patch). All numbers are from a fresh `npm run gh-pages` build I ran in the copy (EXIT=0, "built in 1.84s"); no npm install/ci was performed.

## Verdict

The bundle is HONEST and the fresh-Glass linkage does **not** change its shape. A fresh production demo build totals **6,765,373 bytes** across 53 files (50 in `assets/`) — a delta of only **+4,501 bytes (+0.067%)** versus the 6,760,872-byte untrusted baseline the handoff recorded, so the swapped-in `glass@e7da7b5c` package is byte-neutral (its `glass-ui-*.js` chunk is 76,519 B). Monaco laziness is REAL and I verified it three independent ways: the entry chunk `index-2rQEN_Q3.js` contains **zero** occurrences of `vendor-monaco`/`vendor-three`/`vendor-highlight`/`worker-` (grep count 0), `index.html`'s modulepreload set does not list any of them, and the `proof:publish` eager-leak gate PASSES ("50 assets, 34343B deferred highlight chunk"). The two runnable quick benches and the soa `.mjs` integration bench all execute clean against current source, reproducing R1-12's PF-1/PF-3/PF-5 conditions with fresh numbers. This lane closes R1-12's four coverage gaps (bundle bytes, chunk map, quick-bench baseline, PF-3 target) and adds the per-script observe-hook classification DP-03 named. All findings here are baseline-completion, not new defects; PB-1 is the one delta worth a row (the PF-3 fix target is now pinned to an exact surviving case).

---

## The perf/bundle baseline table (the lane deliverable)

### Bundle — fresh gh-pages build, `glass@e7da7b5c` linkage

| Metric | Value | Evidence |
|---|---|---|
| Total `dist/gh-pages` | **6,765,373 B** (53 files) | `find dist/gh-pages -type f -exec cat {} + \| wc -c` |
| Handoff baseline | 6,760,872 B | prompt (handoff-recorded, untrusted) |
| **Delta (fresh Glass)** | **+4,501 B (+0.067%)** | byte-neutral; linkage does not reshape the bundle |
| Entry chunk `index-2rQEN_Q3.js` | **480,492 B** | `ls -la dist/gh-pages/assets` |
| Eager (index.html-preloaded JS+CSS) | **~1,499,906 B (~1.5 MB)** | sum of the 14 modulepreload/entry refs below |
| `glass-ui-POXuRcWh.js` chunk | 76,519 B | eager, in modulepreload |

**Eager set** (everything `index.html` preloads or the entry pulls synchronously): `index-2rQEN_Q3.js` 480,492 + `index-PEL4Lke-.css` 573,690 + `vendor-reka-ui` 302,190 + `glass-ui` 76,519 + `css-6ALh6sc4.js` 41,629 + `vendor-lucide` 11,595 + `progress` 8,333 + `smooth` 1,629 + `Input-9BlLluik-*` 1,355 + `preload-helper` 1,208 + `rolldown-runtime` 694 + `errors` 416 + `_plugin-vue_export-helper` 84 + `result-CZJK1CwL-*` 72. The two heaviest eager items are the **573 KB stylesheet** and **302 KB vendor-reka-ui** — not Monaco.

**Lazy heavy chunks** (correctly OFF the critical path, no modulepreload, absent from entry): `vendor-monaco` **2,525,021 B**, `css.worker` 1,054,628, `vendor-three` 538,069, `editor.worker` 279,948, `vendor-prettier` 240,387, `html2canvas` 199,579, `vendor-highlight` 34,343.

### Monaco laziness — CONFIRMED (three ways)

1. `grep -oE '(vendor-monaco|vendor-three|vendor-highlight|worker-|css\.worker|editor\.worker)[A-Za-z0-9_-]*\.js' dist/gh-pages/assets/index-2rQEN_Q3.js` → **0 matches**.
2. `index.html` modulepreload set = `{index, _plugin-vue_export-helper, rolldown-runtime, preload-helper, vendor-reka-ui, vendor-lucide, progress, glass-ui, Input, result, css, errors, smooth}` + `index.css` — **no vendor-monaco/three/prettier/worker**.
3. `node scripts/gates/surface/index.mjs` → `proof:publish — U.D6 PASS: eager entry has no editor/vendor edges; 50 assets, 34343B deferred highlight chunk.` The gate reads the real built `index-*.js` (`scripts/gates/surface/index.mjs:34-37`, `forbiddenEntryEdges` filter) — it is a REAL, non-vacuous gate WHEN `dist/gh-pages` exists (it self-defers on the library-only path, L60).

### Bench — `bench/interp-buffer.bench.ts` (library project, `vitest bench --run`)

| Case | hz | Notes |
|---|---|---|
| K=2 · 600-frame steady window | 10,076.56 | ±0.88% |
| K=5 · 600-frame steady window | 4,349.41 | ±1.36% |
| K=12 · 600-frame steady window | 1,800.10 | ±1.52% |
| NumericFoldPlan · K=3 · 600-frame window | 7,146.42 | ±1.06% |
| **NumericFoldPlan · K=8 · 600-frame window** | **2,739.87** | ±1.43% — **PF-3 target** |
| NumericFoldPlan · K=12 · 600-frame window | 1,906.33 | ±1.46% |
| memoized heavy surface (warmEngine) | 9,252,510.37 | ±0.53% |

**7 live cases confirmed** — exactly the set R1-12/PF-1 named; still 0/23 match `taxonomy.json`'s interp-buffer block (PF-1 unchanged).

### Bench — `bench/resolve.bench.ts` (library project)

| Case | hz |
|---|---|
| resolveKeyframes · if()/media 4-stop pipeline | 23,321.22 |
| resolveKeyframes · @function nested inline | 53,081.15 |
| resolveKeyframes · spring() timing resolution | 125,085.78 |
| resolveKeyframes · all-concrete 6-stop (zero-cost sniff) | 28,841.27 |
| resolveValues · if() CssValue (core recursion) | 903,839.35 |
| hasResolvableValue · nested concrete scan (common-case skip) | 2,468,334.74 |
| springCssToOptions · (m,k,c,v0) → (response, damping) | 38,696,940.68 |

### Bench — `bench/group-soa-integration.mjs` (`npx tsx`, EXIT=0)

| Layers | hzFull | hzInterpOnly | blendSharePct | wholeFrameWin | verdict |
|---|---|---|---|---|---|
| 3 | 675,497 | 765,168 | 11.7% | **1.09×** | MODEST |
| 4 | 506,148 | 572,172 | 11.5% | **1.09×** | MODEST |

Reproduces PF-5: honest MODEST verdict; the 3.67× is the *isolated blend* headline, delivered whole-frame win is only 1.09×. Still no npm/workflow runner for any `.mjs` bench.

---

## PB-1 — PF-3's fix target pinned: `interpolate.ts:259` should cite `NumericFoldPlan · K=8 · 600-frame window`

- Severity: **P2** (completes R1-12/PF-3; the citation target, not a new defect)
- Family: deleted-code-provenance / dangling-evidence

`src/animation/engine/interpolate.ts:257-259` (verified in the copy) still reads:

```
// Q.WB3 S2 — the numeric SoA fold (ADOPT-verdicted; the interp-equal +
// fold-taken oracles live in `test/engine/processframe-soa-identity.test.ts`,
// the ADOPT floor in `bench/taxonomy.json`'s budgeted K=8 SoA-lerpArray row).
```

R1-12/PF-3 asked which surviving case should replace the deleted `K=8 … SoA Float64Array+lerpArray` provenance. Answer, verified by running the suite: **`NumericFoldPlan · K=8 · 600-frame window`** at `bench/interp-buffer.bench.ts:74`. It exercises the identical live path — `bench/interp-buffer.bench.ts:59-77` builds `frame._numericPlan` and asserts `plan.numeric.length === 8`, then benches `animation.interpFrames(...)` over a 600-frame window, i.e. the very `processFrame` numeric fold `interpolate.ts` describes. Measured hz this run: **2,739.87** (K=3 2.61× faster, K=12 1.44× slower — the expected K-ladder). Critical caveat for the fix wave: this is an **absolute run-check with no residual twin**, so the comment must be reworded to drop the "ADOPT *floor* / budgeted … row" framing (which implied a reproducible ratio) and instead cite the `NumericFoldPlan · K=8` run-check as the surviving perf artifact. Do not restore "floor" language unless the comparative `SoA-vs-per-channel-_lerp` bench is re-authored.

Disposition: **fold** into the PF-1 taxonomy-reconciliation wave (unchanged from R1-12); this row supplies the exact target string so the wave needs no re-derivation.

---

## PB-2 — Observe-hook classification: 3 of 6 demo observe scripts have NO `page.on("pageerror")` (DP-03's exact missing hook)

- Severity: **P2** (completes DP-03; cross-ref FAM-02/FAM-03)
- Family: gate-blindspot (masked-fallback)

DP-03 (R1-14) established the blank-demo crash is a Vue **pageerror**, not a `console.error`, so any capture keyed only on `console.error` greens over a blank build. I classified all six `scripts/observe/demo/*.mjs` (the lane's "5 observe scripts" undercounts — there are **six** demo observe scripts plus `scripts/observe/lighthouse.mjs`). The shared `withPage`/`withBrowser` helper (`scripts/lib/demo-driver.mjs:490,597`) registers **no** pageerror hook, so each script must add its own:

| Script | `pageerror` hook | `console.error` hook | render-shape assert | Catches blank? | Missing hook |
|---|---|---|---|---|---|
| `smoke.mjs` | **NO** | YES (L131-133) | YES — `#app` kids + `innerHTML>500` (L141), hero "Select an animation" (L162) | **Yes, via shape** (step-7 console arm is blind) | `page.on("pageerror")` |
| `usability.mjs` | **NO** | NO | YES — `h1 .wave-char ≥ 2` (L164), `h1` hero (L184) | **Yes, via shape** | `page.on("pageerror")` (no error capture at all) |
| `occlusion.mjs` | **NO** | NO | YES — `if (!subject) → "subject ABSENT (blank ≠ occlusion-free)"` (L235) | **Yes, via shape** | `page.on("pageerror")` |
| `subject-animates.mjs` | **YES** (L176) | NO | Play-button wait (L257) | **Yes, via pageerror + shape** | — |
| `live-session.mjs` | **YES** (L146) | YES (L150) | scene-mount asserts | **Yes, via pageerror** (HARD budget=0) | — |
| `live-session-mobile.mjs` | **YES** (L123) | YES (L127) | drawer asserts | **Yes, via pageerror** | — |

Conclusion: **all six would catch the blank demo**, but via two different mechanisms — three (`subject-animates`, `live-session`, `live-session-mobile`) trap the actual Vue `pageerror` directly (the robust path); three (`smoke`, `usability`, `occlusion`) have **no pageerror hook** and are saved only by their render-shape assert. `smoke.mjs` step-7 ("zero console errors during mount", L181-184) is the exact blind arm DP-03 named — it would report green in isolation; it survives solely because steps 5-6 assert `#app` children + hero text. Per-script fix: add `page.on("pageerror")` to `smoke.mjs`, `usability.mjs`, `occlusion.mjs` so the crash is trapped at the source, not inferred from a missing element. NOTE the larger point is FAM-03's: none of these six is wired into a CI job and all self-skip when playwright is unresolved (`KF_REQUIRE_BROWSER`), so in practice they SKIP — the hook fix matters only once FAM-03 makes them runnable.

Disposition: **fold** into the FAM-02/FAM-03 gate-soundness wave — add the pageerror hook to the three shape-only scripts as part of making the observe roster real.

---

## Negatives (checked and found sound)

- **Fresh-Glass linkage is byte-neutral.** +4,501 B / +0.067% total; `glass-ui` chunk 76,519 B, eager, correctly in the modulepreload set. The consume wave will not face a bundle-size surprise from Glass 7.
- **Monaco/three/prettier/workers are genuinely lazy.** Entry chunk grep = 0; not in modulepreload; eager-leak gate PASS. vendor-monaco (2.5 MB) + css.worker (1.05 MB) never touch first paint.
- **Deferred-highlight budget holds.** `vendor-highlight` = 34,343 B < the gate's 40,000 B ceiling (`scripts/gates/surface/index.mjs:49`).
- **All three benches run clean against current Value-4 source** — interp-buffer EXIT=0 (7 cases, positive hz), resolve EXIT=0 (7 cases), soa `.mjs` EXIT=0 (honest MODEST verdict). Reproduces R1-12's runnability claim with fresh execution, not inference.
- **7 live interp-buffer cases confirmed by execution** (not just grep): `K=2/5/12 · 600-frame steady window`, `NumericFoldPlan · K=3/8/12 · 600-frame window`, `memoized heavy surface`. PF-1's 0/23 taxonomy match is unchanged.
- **`withPage`/`withBrowser` add no hidden pageerror hook** — confirmed by reading `scripts/lib/demo-driver.mjs:597-660`; the per-script classification in PB-2 is complete, not masked by a shared registration.

## Coverage gaps

- Did **not** run the full `vitest bench` suite, `computed-real-dom.bench.ts`, or `playwright.bench.ts` (browser-only / long; out of lane) — same gap as R1-12. Their PF-4 uncovered status is unchanged (not re-verified this round).
- Did **not** measure gzip/brotli transfer sizes — only on-disk bytes. The build log reports `vendor-monaco` gzip 647.23 kB; other chunks' compressed sizes were not enumerated.
- Did **not** diff the `glass-ui` chunk's internal composition vs a pre-linkage build (the Jul-16 build was overwritten by my fresh build); the byte-neutrality claim rests on the total-bytes delta, not a chunk-level diff.
- Did **not** re-run the observe scripts under a browser to empirically confirm each catches blank — the PB-2 classification is by source reading (hook presence + assert target) against DP-03's established pageerror mechanism, not by live blank-render execution.
- Bundle numbers are from the AUDIT COPY with the fresh-Glass swap; the immutable Glass 7 consume may differ if the published package diverges from `glass@e7da7b5c`.
