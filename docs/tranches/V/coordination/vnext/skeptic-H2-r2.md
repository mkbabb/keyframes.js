# LANE H2 (r2, TRUE-FABLE) — value.js historical lens (owner addendum 1)

## G0-prime tree pinning

| repo | path | branch | HEAD |
|---|---|---|---|
| value.js (today) | /Users/mkbabb/Programming/value.js | tranche-u | `db77dbd8` (2026-07-17) |
| value.js (baseline) | same repo, historical commit | — | `2e60e864` (2025-05-05, v0.1.0, last commit ≥1yr old; next commit is 684c818f 2025-07-24) |
| keyframes-v-exec (canonical kf) | /Users/mkbabb/Programming/keyframes-v-exec | master | `0dac636b` (v6.0.0 era) |

Baseline selection: the owner demands "a year+ ago" (≈2025-07 or earlier). The last commit on or before 2025-07-17 is `2e60e864` (2025-05-05) — the parsimmon-era, package version **0.1.0**, pre-modernization (the `pre-modernization` tag itself is 2026-02-24 and is NOT a year old — it would be an invalid baseline). All baseline reads are `git show 2e60e864:<path>`.

Repos read READ-ONLY; no test runs executed (static evidence only: file:line, git hashes, reproducible greps).

---

## PHASE 1 — fresh findings

### Q-LOC: the core-vs-apparatus trajectory (the owner's "massive explosion" located)

Core library (`src/`, .ts, excluding .d.ts):

| | baseline `2e60e864` | today `db77dbd8` | delta |
|---|---|---|---|
| core src LOC | **5,020** (16 files) | **4,647** (25 files) | **−7.4%** |
| demo | 12,517 | 31,102 | +148% |
| test | 570 (2 files, suite later proven broken) | 3,823 | +571% |
| e2e | 0 | 13,405 (83 .ts files, `e2e/smoke`) | new |
| api | 0 | 13,155 / 138 files sans `api/dist` (full palette backend: Dockerfile, compose, DB, hono) — *Phase-2 correction: my first pass counted 20,478 by including `api/dist` build artifacts; corrected here* | new |
| docs (code probes: tranche-audit .mjs/.ts) | 0 | 10,954 | new |
| plugins+scripts+fixtures | 0 | 672 | new |
| **apparatus total** | **~13,087** | **62,157 strict (73,111 incl. docs probes)** | **×4.8–5.6** |
| apparatus : core ratio | **2.6 : 1** | **13.4 : 1 (15.7 : 1 incl. docs)** | ×5–6 |

**[F-H2-1] Headline: the core library SHRANK (5,020 → 4,647 LOC, −7.4%) over 14 months while gaining 7 color spaces, the whole CSS-stylesheet/timeline domain, easing, path geometry, and typed Results. The "massive explosion in complexity" the owner names is real but lives ~93% in the APPARATUS (demo/e2e/api/docs), not the core.** Fair-comparison caveat: baseline core included 372 LOC keyframes parsing (since correctly moved to kf) and 310 LOC of already-dead colorFilter code, so like-for-like the value/color domain core grew modestly — still, core-flat vs apparatus-×5 is the shape of the problem.

### Q1 — what the old library did RIGHT that was lost

1. **[F-H2-2] Single root export + dual ESM/CJS.** Baseline `package.json`: one `"."` export with `import` + `require` conditions (`git show 2e60e864:package.json`). Today (4.0.0): **seven subpath exports, NO root export, ESM-only**. A consumer must know the internal taxonomy to import anything. The owner independently condemns the mechanism that replaced it ("I don't like things like subpaths/ as a module. Code smell supreme. NO SHIMS" — OWNER-PROMPT-verbatim.md:15). The subpath *split* (tree-shaking, parse-that-free leaves) is defensible; the loss of a root entry point and the 7-file re-export shim layer (`src/subpaths/*`, 163 LOC of pure re-exports) is the lost ergonomics.
2. **[F-H2-3] A hold-in-your-head flat core.** Baseline: 2 zones (`parsing/`, `units/`), 16 files, avg 314 LOC/file, zero shim layers. Today: 7 zones + a shim zone, 25 files. Today's zoning is *better organized* but the property "one contributor can read the whole tree in a sitting" was diluted — and diluted far more by the 80k apparatus than by the core itself.
3. **That is the honest end of the list.** The rest of the baseline was demonstrably NOT right: `src/parsing/index.ts` opens with ~30 lines of commented-out dead imports (git show 2e60e864:src/parsing/index.ts:1-30); `colorFilter.ts` (310 LOC SPSA filter-solver) was exported by NOTHING and consumed by NOTHING even at baseline (`git grep -l "colorFilter\|ColorFilter" 2e60e864` → only the file itself) — already-dead code; the test suite was later found broken outright (commit `48a1daeb` 2026-02-24: "Replace broken test suite with 434 comprehensive tests"); parsing required the external `parsimmon` dependency. Nostalgia for the baseline is not supported by its tree.

### Q2 — overfit / superfluous today (with kf's TRUE imports established)

kf's true import surface (grep over keyframes-v-exec `src/`, 47 files importing `@mkbabb/value.js`):

| subpath | kf src import sites | distinct symbols |
|---|---|---|
| /css | 29 | 39 (KeyframeSelector, Stylesheet, parseStylesheet, collect*, parseTimingFunction, serializeCssColor, …) |
| /value | 16 | CssValue(15), CssCall, CssList, CssScalar, isLayoutTrackingUnit |
| /color | 7 | mixColors, convertColor, oklab, HueInterpolationMethod, SpaceId, Color/AnyColor |
| /math | 5 (+34 sites in kf demo) | lerp, clamp, scale, lerpArray |
| /easing | 3 | easing, CubicBezier, bezierPresets, linearEasing, steppedEase, … |
| /transform | 2 | **PathGeometry ONLY** |
| /quantize | **0** | — |

Consumer-less / demo-only public surface (each argued on superfluity, not raw count, per the owner edict):

1. **[F-H2-4] `src/transform/decompose.ts` (609 LOC) — zero consumers outside its own tests.** kf imports only `PathGeometry` from /transform (keyframes-v-exec `src/animation/svg/morph-svg.ts:45`, `morph-geometry.ts:18`); a grep for `decomposeMatrix|recomposeMatrix|interpolateDecomposed|slerp` across ALL of kf (src/demo/test/bench/e2e) returns **nothing**. Inside value.js, consumers are `test/v4-c1.test.ts` and `test/transform/decompose-targeted.test.ts` only. Superfluity argument beyond count: the natural consumer of matrix decompose/slerp/interpolateDecomposed is the animation engine — and kf already solves computed-transform interpolation via its DOM `getComputedStyle` pipeline and never adopted this API. A 609-LOC public provision whose one domain-consumer solved the problem another way is overfit. **Disposition candidate: PRUNE (or fold into kf if a kf wave adopts it — adoption must be a decided wave, not a standing shelf).**
2. **[F-H2-5] `src/quantize.ts` (139 LOC) + the `/quantize` subpath — zero kf consumers anywhere; consumed only by value.js's own demo** (`demo/workbenches/extract/quantize-worker.ts`, `useImageQuantize.ts`, `useExtractSession.ts`) plus tests. Image-pixel quantization (`quantizePixels`, `dominantColor`) is domain scope-creep for a CSS-value library's published surface. **Disposition candidate: DEMOTE to demo/ (or an explicit product decision to keep it published — but then it needs a consumer story).**
3. **[F-H2-6] `api/` (13,155 LOC / 138 files, sans build artifacts) — a full palette-backend service (Dockerfile, compose.yaml, DB, cron, hono tests) living inside the library repo.** Zero library imports touch it. Largest single apparatus zone after demo and e2e. **Disposition candidate: EXTRACT to its own repo/deploy unit; at minimum excise from library-tranche audit surface.**
4. **[F-H2-7] Published-dependency leak + package-level cycle.** Today's `package.json` `dependencies`: `@mkbabb/glass-ui ^7.0.0` and `@mkbabb/keyframes.js ^6.0.0` — yet both are imported ONLY under `demo/` (79 files) and `e2e/` (2). `files: ["dist", …]` ships dist only, but `dependencies` still install for every consumer: kf → value.js → kf `^6.0.0` is a **registry-level dependency cycle**, and every value.js consumer drags in glass-ui + all of keyframes.js. **Disposition candidate: reclassify both to devDependencies** (the "one physical core / dedupe" goal is served equally by devDeps within this repo). Baseline, for contrast, had exactly one runtime dep (parsimmon).
5. **[F-H2-8] Repo hygiene litter: 39 stray screenshot PNGs at repo root** (`ls *.png | wc -l` → 39: dock-*.png, before-triad082-*.png, …). Plus demo-component tests interleaved in the library `test/` dir (picker-blob-config, slider-announcement, status-lamp, view-accents, preview-chips). **Disposition: DELETE the litter; displace demo tests to a demo test tree** (the owner's tests-isomorphic-to-source edict, OWNER-PROMPT-verbatim.md:51).
6. **[F-H2-9] `src/subpaths/` (7 barrels + docs, 163 LOC pure re-export)** — the owner-condemned shim layer; exports map should point at real modules. **Disposition: RESTRUCTURE (mechanical), already an owner edict.**
7. **Demo-serving symbols inside core color** — `safeAccentColor` (exported publicly, consumed by value demo only: `demo/color-session/view-accent.ts`, `ink.ts`, atmosphere boot; zero kf use). Small (part of `color/operations.ts`), flag-not-fell: candidate to DEMOTE alongside quantize if a public-surface diet wave forms.

NOT overfit (tested and cleared): `color/anchors.ts` (377 LOC) is core-consumed (`src/css/grammar.ts`, `src/color/operations.ts`) — KEEP. `transform/path.ts` (564 LOC) is kf-consumed (morph/draw SVG) — KEEP. `/math`, `/easing`, `/value`, `/color`, `/css` all have real multi-site kf consumption — KEEP (css needs the parser rewrite, below).

### Q3 — genuinely better today, with measurement

1. **Coverage-per-LOC:** 10 color spaces at baseline (`assets/docs/`: rgb hsl hsv hwb lab lch oklab oklch xyz kelvin) → **17 spaces today** (`src/color/model.ts:4-7` SpaceId adds srgb-linear, display-p3, a98-rgb, prophoto-rgb, rec2020, ictcp, jzazbz) — in a core that is 7.4% SMALLER.
2. **Runtime parser dependency 1 → 0:** parsimmon gone; the grammar is in-tree (`src/css/grammar.ts`, 483 LOC). (The custom parser's *readability* is separately owner-condemned — see disposition table.)
3. **Measured perf, from CHANGELOG.md with named gates:** gamut-mapping path **37 → 9 allocs/call (MEASURED, gate `proof:gamut-alloc`)** [CHANGELOG.md:261-262]; Float64 ramp fold **~5× faster** than boxed per-element Color lerp at K=64 [CHANGELOG.md:311]; named-color lookup **37× median** (152 sequential regex → Set O(1)) [CHANGELOG.md:587]; HSL→RGB direct path **3.80–4.40×** [CHANGELOG.md:600]; L8 microbench gate held at **10.87×** (≥5× gate) [CHANGELOG.md:596]; dist 124,130 B tracked byte-exact [CHANGELOG.md:509].
4. **Measured correctness:** the sRGB near-black decode bug (values ≤10/255 decoded **~3.2× too bright**) fixed to IEC 61966-2-1 [CHANGELOG.md:80-87]; typed `Result`/ParseIssue error channel (`src/foundation/result.ts`) vs baseline's throw/NaN.
5. **Tests:** baseline 570 LOC / 2 files, later proven broken (commit `48a1daeb`) → 434 tests at modernization, 200+ `it()` in top-level `test/` today plus `parsing/`, `transform/` subtrees, plus born-consumer gates in kf (`test/compile/value4-color-emit.test.ts`).
6. **A real constellation consumer:** baseline v0.1.0 had no external consumer; today kf v6 imports 39 distinct /css symbols across 29 sites — the library earns its published surface (except the zones in Q2).

### Per-zone disposition-candidate table (value.js, deliverable)

| zone | LOC | consumers (true, today) | disposition candidate |
|---|---|---|---|
| `color/` (model, operations, anchors, index) | 891 | kf src ×7 + demo; anchors core-internal | **KEEP** (perf-measured; owner's zero-alloc/gamut interrogation applies here, separate lane) |
| `css/` (stylesheet 899, grammar 483, named-colors, types, timeline, syntax, index) | 1,948 | kf src ×29 sites / 39 symbols | **KEEP surface, REWRITE parser** — stylesheet.ts is the largest core file and the owner-condemned custom non-parse-that parser |
| `value.ts` | 36 | kf ×16 sites (CssValue ubiquitous) | **KEEP** |
| `foundation/` (math, result) | 126 | kf ×5 src + 34 demo sites | **KEEP** |
| `easing.ts` | 171 | kf ×3 sites, 9 symbols | **KEEP** |
| `transform/path.ts` | 564 | kf morph/draw SVG (PathGeometry) | **KEEP** |
| `transform/decompose.ts` | 609 | **none outside own tests** | **PRUNE or decided kf-adoption wave** [F-H2-4] |
| `quantize.ts` + `/quantize` subpath | 139+2 | **value demo only; zero kf** | **DEMOTE to demo** (or explicit keep-with-consumer-story) [F-H2-5] |
| `subpaths/` (7 barrels) | 163 | exports-map plumbing | **RESTRUCTURE away** (owner edict: NO SHIMS) [F-H2-9] |
| `api/` | 13,155 | none (standalone service) | **EXTRACT from repo** [F-H2-6] |
| `e2e/` | 13,405 (83 files) | — | **SHRINK** (scale challenge owned by the e2e lane; H2 flags magnitude only) |
| `demo/` | 31,102 | — | KEEP as product, but it is the explosion's epicenter; colocation edict applies |
| root `*.png` ×39 + demo tests in `test/` | — | — | **DELETE / displace** [F-H2-8] |
| `package.json` deps (glass-ui, keyframes.js in `dependencies`) | — | demo/e2e only | **FIX → devDependencies; breaks the kf↔value registry cycle** [F-H2-7] |

---

## PHASE 2 — union with the prior (Opus) report

*(Phase 1 above was frozen to disk before the prior report was opened. One self-correction from Phase-2 verification is marked inline above: my first api/ count included `api/dist` build artifacts — 20,478 corrected to 13,155; the prior report's figure was the righter one on that cell. Every material prior finding was presumed INCORRECT and tested against my own evidence.)*

The prior report (`skeptic-H2-report.md`, r1 seat at HEAD `4c1e927`, one commit behind mine) selected the SAME baseline (`2e60e86`, 2025-05-05) by the same argument. Its material findings, tested one by one:

1. **Core SHRANK 5020→4654 (−7%); null "over-built core" falsified** — **[UNION-CONFIRMED]**. Independently re-derived: 5,020 → 4,647 (mine excludes `vite-env.d.ts`; theirs 4,654 includes it — same substance).
2. **The explosion is the apparatus (~57k: demo 31k + api 13k + e2e 13k), "judge the library on the library"** — **[UNION-CONFIRMED]**. My strict re-derivation: 62,157 (adding test/plugins/scripts/fixtures they omitted), 73,111 with docs probes; their api figure (13,141/134 sans dist) re-derived at 13,155/138 at my HEAD. Direction and magnitude survive on my evidence.
3. **`transform/decompose.ts` (609 L) SUPERFLUOUS-PRUNE: zero consumers anywhere; DOMMatrix exists** — **[UNION-CONFIRMED]** [F-H2-4]. Re-derived: kf-wide grep (src/demo/test/bench/e2e) for `decomposeMatrix|recomposeMatrix|interpolateDecomposed|slerp` empty; value-side consumers are its own tests only (`test/v4-c1.test.ts`, `test/transform/decompose-targeted.test.ts`).
4. **`quantize.ts` (139 L) demo-only; demote from public API** — **[UNION-CONFIRMED]** [F-H2-5]. (Their consumer cite says "useImageSampler"; the actual demo consumers are `demo/workbenches/extract/quantize-worker.ts`, `useImageQuantize.ts`, `useExtractSession.ts` — immaterial naming slip, finding stands.)
5. **`subpaths/` 7-file re-export shim; LOST-VIRTUE-RESTORE (baseline aimed the vite entry straight at `src/units/index.ts`)** — **[UNION-CONFIRMED]** [F-H2-2/9]. Baseline vite lib entry verified at `2e60e864:vite.config.ts:51` (`entry: src/units/index.ts`, formats es+cjs).
6. **LOST VIRTUE: the one obvious `ValueUnit` primitive dissolved** — **[UNION-CONFIRMED]** (facts verified: `git grep ValueUnit HEAD -- src` empty in value.js AND no `ValueUnit` in kf v6; the unit-resolution machinery re-lives kf-side as `convertToPixels` at keyframes-v-exec `src/animation/resolve/browser.ts:77`, consumed by `compile/frame/interp-slot.ts:15,181-182`; baseline `units/` machinery = 712+339+195+199 = 1,445 LOC exactly as they computed). I co-sign their mitigant: the typed readonly `CssValue` split is cleaner; lean-KEEP with the lost-cohesion note.
7. **Mild LOST VIRTUE: flat `X2Y` conversions → `convertColor` anchor-graph indirection** — **[UNION-CONFIRMED]**. Baseline flat exports verified (`2e60e864:src/units/color/utils.ts:65,103,197,213,229,247` — hex2rgb, kelvin2rgb, hsv2hsl, hsl2hsv, hwb2hsl, hsl2hwb…); today routes via `CONVERSION_ANCHORS` (`src/color/anchors.ts:334`). Discoverability loss real, DRY win real; lean-KEEP.
8. **GENUINELY better: parsimmon dep dropped for a dep-free custom scanner; docs concede a combinator rewrite "would not be faster — possibly slower"** — **[UNION-CONFIRMED] in substance, with one STALE CITE corrected**: migration commit `470818c9` verified ("…parser migration"); the docs concession verified VERBATIM at `docs/tranches/D/research/Dm-CHALLENGE.md:143`. But their file:line cite "`stylesheet.ts:99-181 balancedText`" is FALSE against today's tree — `balancedText` does not exist in `src/` at their HEAD or mine; it was consolidated at `324da633` (S.W1 scanner slice) and retired with the pre-v4 src trees at `164343c1`/`7334c793` (v4 cut). The claim survives; the citation was to a dead tree.
9. **css/ KEEP-EARNED (dense kf consumption); only `collectDeclarations` orphaned** — **[UNION-CONFIRMED]**. My per-symbol import census (39 distinct /css symbols, 29 kf src sites) agrees; `collectDeclarations` has ZERO hits across all of kf (src/demo/test/bench/e2e). Their ×N figures are usage-occurrence counts, mine import-site counts — direction identical.
10. **Exotic color spaces kf-unused but KEEP (owner mandates all spaces; demo-earned)** — **[UNION-CONFIRMED]**; matches my /color census (kf pulls mixColors/convertColor/oklab + types only).
11. **`foundation/math` heaviest consumer (kf clamp×26)** — **[UNION-CONFIRMED]** in direction (my counts: 82 `clamp(` occurrences across kf src+demo; 34 `/math` import sites in kf demo alone).

**OPUS-REFUTED: none at the material-finding level.** The single disproven specific is the `balancedText stylesheet.ts:99-181` citation inside finding 8 (disproof above) — the finding itself independently survives. For the owner's record: this lane's r1 (Opus-run) report is substantively CORRECT under true-Fable re-derivation; the blanket presumption "every Opus-begat finding straight-up incorrect" is itself falsified for lane H2, on evidence.

**OPUS-UNVERIFIABLE: none material** (their "Total repo files 383→1949" and baseline "339 demo files" inventory cells were not load-bearing and were not re-derived; no disposition rests on them).

**Findings absent from the prior report — mine alone:**
- **[FABLE-NEW] [F-H2-7]** the published-dependency leak / registry cycle: `@mkbabb/glass-ui ^7.0.0` + `@mkbabb/keyframes.js ^6.0.0` sit in `dependencies` while imported ONLY under `demo/` (79 files) + `e2e/` (2) → every consumer install drags them in; kf→value→kf is a registry-level cycle. FIX → devDependencies. The sharpest actionable defect this lane surfaced.
- **[FABLE-NEW] [F-H2-8]** hygiene: 39 stray screenshot PNGs at repo root; demo-component tests (picker-blob-config, slider-announcement, status-lamp, view-accents, preview-chips) interleaved in the library `test/` dir against the owner's tests-isomorphic-to-source edict.
- **[FABLE-NEW]** (minor) `safeAccentColor`: publicly exported from `/color`, consumed only by value's own demo (`demo/color-session/view-accent.ts`, `ink.ts`, atmosphere boot); zero kf use — demote candidate alongside quantize in any public-surface diet wave.
- Also mine alone: the perf-history measurement ledger with CHANGELOG file:line cites (allocs 37→9 `proof:gamut-alloc` CHANGELOG.md:261; 37× name lookup :587; HSL→RGB 3.8–4.4× :600; ~5× Float64 ramp fold :311; sRGB near-black ~3.2× correctness fix :80-87) and the anti-nostalgia evidence (baseline `colorFilter.ts` 310 LOC already-dead at baseline; baseline suite replaced as "broken" at `48a1daeb`; commented-out dead code heading `2e60e864:src/parsing/index.ts`).

### Union product (FABLE-NEW + UNION-CONFIRMED only)

Everything in the Phase-1 disposition table stands as the deliverable, now with these provenance notes: rows decompose-PRUNE, quantize-DEMOTE, subpaths-RESTRUCTURE, api-EXTRACT, css-KEEP+parser-rewrite, core-shrank headline = UNION-CONFIRMED; rows deps-FIX, hygiene-DELETE, safeAccentColor flag = FABLE-NEW; plus the two UNION-CONFIRMED lost-virtue notes imported from the prior seat (ValueUnit cohesion; X2Y discoverability) which my Phase 1 had underweighted.

Tag census: **FABLE-NEW 3 · UNION-CONFIRMED 11 · OPUS-REFUTED 0 material (1 stale citation corrected in-place) · OPUS-UNVERIFIABLE 0 material.**
