# Skeptic D (r2, TRUE-FABLE) — the drops archaeology (owner addendum 2)

## G0-prime tree pinning

| Tree | Path | Branch | HEAD | Version |
|---|---|---|---|---|
| keyframes (canonical) | /Users/mkbabb/Programming/keyframes-v-exec | master | `0dac636b` | 6.0.0 |
| value.js | /Users/mkbabb/Programming/value.js | tranche-u | `db77dbd8` | 4.0.0 |
| parse-that | /Users/mkbabb/Programming/parse-that | master | `ef10d5b` | (workspace, no root package.json) |

All history read via tags in these two repos (`git ls-tree`/`git show`/`git grep <tag>`), no checkouts, all repos read-only. Neither atlas tree was read (not needed for this lane).

Key cut commits pinned:
- value.js v4.0.0 producer cut: `164343c1` "feat(v4)!: value 4.0 producer surface + packed-surface gate; retire pre-v4 src trees" — **129 files, +4,117 / −24,330**. Tag `v4.0.0` = `44ddaff7` (2026-07-16/17).
- value.js majors: v1.0.0 `dd9beb5c` (2026-06-19), v2.0.0 `96f124d7` (2026-07-03), v3.0.0 `1537fed0` (2026-07-05), v3.1.0 `964c3992`.
- keyframes: pre-modernization `4993757f` (v0.9.97, parsimmon parser + own units/color), v1.0.0 (2026-02-25, parse-that ^0.6 + value.js ^0.3.1), v4.4.0 (parse-that dep gone), v5.1.0 (R: engine files re-zoned, `animate()` excised), v5.3.x (U dissolution), v6.0.0 (Value-4 transposition, `5a9183a7`).

---

## PHASE 1 — fresh findings (written before opening any prior report)

### 1. THE headline: value.js 4.0.0 (`164343c1`) is the mass-extinction event

One commit deleted the entire pre-v4 `src/units/`, `src/parsing/`, `src/quantize/` trees, `src/easing.ts` (643 L → 171 L successor), all 11 `bench/*` files, and 11 `scripts/gates/proof-*` gates. Every owner-named seed traces to THIS cut. Drops at 1.0/2.0/3.0 were, by contrast, small and documented (see §5 governance).

### 2. Owner seed 1 — the gamut mapping loss: CONFIRMED, precisely characterized [D-r2-01, UNJUSTLY-DROPPED]

What existed at v3.1.0 (`src/units/color/gamut*.ts`, re-zoned `gamut/` by T):
- **Analytical Ottosson engine** (`gamut.ts` 526 L): `computeMaxSaturation` (polynomial cusp), `findCusp`, `findGamutIntersection` (ONE Halley step — zero-iteration hot path), `gamutMapOKLab`, `gamutMapSRGB`, adaptive anchor `GAMUT_ALPHA = 1.0` (the 2.0.0 washed-out-gamut cure, U10/Q7), `deltaEOK` + `DELTA_E_OK_JND = 0.02`.
- **Raytrace exact-boundary reference** (`gamut/raytrace.ts` 137 L, S.W1-10/R-4): bracketed root-finding of the cube-membership crossing to ~2⁻⁴⁰, "the oracle's oracle" — validates the analytical map (agreement pinned in `gamut-raytrace.test.ts`).
- **Boundary samplers** (`gamut/boundary.ts` 604 L): `sampleGamutBoundary(Into)`, `sampleOKLChSliceBoundaryInto`, goldens locked @1e-3, made public at 2.0.0.
- Zero-alloc `*Into` variants throughout (`gamutMapOKLabInto`, `oklabToLinearSRGBInto`, `srgbToOKLabInto`).

What v4.0.0 has instead (`src/color/operations.ts:133` `mapColorToGamut`): a 32-iteration binary search on OKLCh chroma, allocating ~3 Result/color objects per probe (`makeColor` + `convertColor` + `numericSource` × 32), no ΔE stop criterion, no JND clip-acceptance (so NOT CSS Color 4 §13 `css-gamut-map` conformant), no cusp math, no exact-boundary reference, no zero-alloc path. `safeAccentColor` (operations.ts:207) iterates candidates through this mapper — compounding the per-call allocation storm.

Verdict: **UNJUSTLY-DROPPED**. The v4 CHANGELOG claims "/color owns … gamut mapping" — nominal continuity masking an algorithmic downgrade (slower, allocating, less principled, spec-nonconformant). Owner's "iterative color out of gamut algorithm must be ruthlessly interrogated" lands exactly here.

### 3. Owner seed 2 — the measured parser loss: CONFIRMED, and it is TWO losses [D-r2-02, UNJUSTLY-DROPPED]

- The dropped parser: parse-that combinators + **byte-scanner fast paths** (`src/parsing/utils.ts`, 16 `charCodeAt` scan sites at v3.1.0; born at O.W6 `dd9beb5c` "SOTA perf — dispatch() table + byte scanners → value.js 1.0.0").
- The dropped MEASUREMENT: `bench/css-parse-perf.mjs`, `bench/parser-namelookup.mjs`, and the CI-wired portable ratio gate `scripts/gates/proof-perf-target.mjs` (192 L; measured dist parser throughput against a co-scaling parse-that normaliser — the U-F14-hardened device-independence design). All deleted at `164343c1`.
- The successor: `src/css/grammar.ts` (658 L) + `stylesheet.ts` (940 L) + `timeline.ts` + `syntax.ts` — regex/substring recursive descent (24 regex sites in grammar.ts alone; `.match()` allocation per token), **written fresh inside the v4 cut itself**. The `bench/` directory NO LONGER EXISTS in value.js; there is no perf gate. The owner's "custom, non-parse-that implementation" was born at `164343c1` (2026-07-17), not in any earlier tranche; simultaneously the parse-that runtime dep was dropped (deps: v3.1.0 `{parse-that ^1.0.0}` → v4.0.0 none).

Verdict: **UNJUSTLY-DROPPED** (both the measured implementation and the measurement harness). Relative speed of old vs new was NOT re-benched in this lane (successor adjudication is panel-1's bench lane); the drop of all measurement capability is proven regardless.

### 4. Owner/panel-1 seed 3 — the zero-alloc Into family: CONFIRMED [D-r2-03, UNJUSTLY-DROPPED]

Fourteen exported `*Into` out-param functions existed at v3.1.0; ZERO survive at 4.0.0 (grep `Into(` over current src: empty):
`color2Into` (dispatch.ts:249), `mixColorsInto` (mix.ts:197), `gamutMapOKLabInto`, `oklabToLinearSRGBInto`, `srgbToOKLabInto` (gamut.ts), `transformMat3Into` (matrix.ts:34), `xyz2linearSrgbInto` / `xyz2displayP3Into` / `xyz2adobeRgbInto` / `xyz2rec2020Into` / `xyz2proPhotoInto` (conversions/xyz-extended.ts), `sampleGamutBoundaryInto` / `sampleOKLChSliceBoundaryInto` (boundary.ts). Lineage: born P (1.1.0, `23d1a91e` "color2Into gamut zero-alloc") + Q (1.2.0 "perf (color-arch out-params)"), hardened through S/T. The v4 model is allocation-per-operation by design (frozen structural Result values). Directly contradicts the owner's "near perfected zero-alloc color facilities for all spaces."

### 5. Silent-drop governance: value.js 4.0.0 FAILS at the capability grain; earlier cuts were honest [D-r2-04]

- **v4.0.0 CHANGELOG** (verified at `git show 164343c1:CHANGELOG.md`): documents packaging-grain breaks (root export removed, Result types, "removed … raw color-conversion exports, and other root-barrel internals") but NEVER names: raytrace, the analytical gamut engine, ΔE-2000/ΔE-ITP/ΔE-OK, OKHSL/OKHSV, the 14 Into exports, colorFilter, boundary samplers, sampleColorRamp, color-mix()/relative-color/contrast-color() parse loss, the bench corpus, or the perf gate. Worse, it asserts "/color owns … gamut mapping, contrast …" — continuity language over an engine swap. No drops register exists in value.js docs/ for the V′ formation (grep over docs/ finds the deleted capabilities only in R-era documents).
- **2.0.0** shipped with NO changelog entry at all (v2.0.1's CHANGELOG jumps 2.0.1 → 1.2.0); transcribed retroactively at S.W0 `a9c5854a` — a lapse acknowledged and cured in-history.
- **3.0.0** is the governance MODEL: a by-name BREAKING migration table (logerp arg reorder; `color-soa.ts` `buildColorChannelPlan`/`packColorChannels`/`lerpColorChannels` EXCISED with rationale "orphan API, phantom keyframes.js consumer, zero real consumers"). RIGHTLY-DROPPED with tombstone.
- **keyframes 6.0.0 CHANGELOG + docs/MIGRATION-6.0.0.md**: documents every kf drop by name (getTimingFunction, printWidth, BlendMode/"weighted", legacy flattened-value carriers). kf-side governance GOOD.

### 6. The full v4 drop ledger (beyond the seeds)

| # | Dropped capability | Last home (v3.1.0) | Classification | Evidence |
|---|---|---|---|---|
| D1 | Analytical+raytrace gamut engine + ΔE-OK JND | units/color/gamut* | **UNJUSTLY** | §2 |
| D2 | ΔE-2000 (14 Sharma vectors) + ΔE-ITP | units/color/difference.ts (243 L) | **UNJUSTLY** | added 2.0.0; kf now hand-rolls ΔE (§8) |
| D3 | 14× zero-alloc `*Into` family | dispatch/mix/gamut/matrix/xyz-extended/boundary | **UNJUSTLY** | §4 |
| D4 | Byte-scanner measured parser + parse-that base + bench/ + perf gate | src/parsing/* + bench/ + scripts/gates | **UNJUSTLY** | §3 |
| D5 | OKHSL / OKHSV color spaces | units/color/okhsl.ts (270 L) | **UNJUSTLY** | v4 `SPACE_SCHEMA` = 17 spaces, no okhsl/okhsv; born 2.0.0 (documented output-changing feature); standard picker spaces; no tombstone |
| D6 | `color-mix()` parse | parsing/color.ts | **UNJUSTLY** | zero `color-mix` hits in current src/; grammar.ts:371 color-call whitelist excludes it; owner mandate "total and complete specification coverage" |
| D7 | Relative color `rgb(from …)` parse | parsing/color/relative-color.ts (191 L) | **UNJUSTLY** | grammar.ts:176 hard-fails `\bfrom\b` → `color_context_required` |
| D8 | `contrast-color()` parse + public WCAG metrics (`wcagRelativeLuminance`/`wcagContrastRatio`) | parsing + units/color/contrast.ts (332 L) | **UNJUSTLY** (parse) / UNCLEAR (public metric exports) | zero `contrast-color` hits in current src/; VJ-Q1 (1.1.1) was a "library-LEADS" CSS Color 5 catch-up; internal luminance/contrast survive inside safeAccentColor only |
| D9 | `sampleColorRamp` / `sampleColorRampAt` | units/color/mix.ts:403/459 | **UNJUSTLY** | oracle'd (13-test monotone-ΔE suite); kf densify now re-derives ramps via repeated `mixColors` (kf color.ts:181) |
| D10 | calc()/math-function static evaluator (min/max/clamp/round/…, 536 L) | parsing/math.ts | **UNJUSTLY** (weak) | v4 treats `calc` as opaque unit (src/value.ts:26); kf resolves computed slots via DOM only — no non-DOM静 eval anywhere |
| D11 | `rgb2ColorFilter` CSS-filter-chain solver (305 L) | units/color/colorFilter.ts | **UNCLEAR** | lineage kf-pre-mod → value.js → deleted; no successor, no tombstone, no named consumer found; plausibly overfit |
| D12 | Gamut boundary samplers + their 1e-3 goldens | units/color/gamut/boundary.ts | **UNCLEAR** | made public at 2.0.0 "so consumers get a registry export instead of forked math"; primary consumer was the value.js demo |
| D13 | Easing surface halved: easeIn{Sine,Quad,Cubic,Expo,Circ}, easeOut{Sine,Quad,Circ}, bounce{In,Out,InOut}Ease(+Half), stepStart/stepEnd, `timingFunctions` registry, `timingFunctionDescriptions`, `cssLinear`, `CSSCubicBezier`, `solveCubicBezierX` | src/easing.ts 643 L → 171 L | registry: **RIGHTLY** (S found live "browser-dead registry easings" compile bug); curve-family halving: **UNCLEAR** (asymmetric keep-what-kf-uses: easeInOutQuad kept, easeInQuad gone — no principled line, no tombstone) | export diff v3.1.0 vs current; kf registry.ts imports only the survivors |
| D14 | quantize/cluster internals (597 L → 139 L) | src/quantize/ | **UNCLEAR-minor** | public surface (quantizePixels/dominantColor) retained; internal algorithm shrunk — capability parity unverified |
| D15 | Legacy value contracts: ValueUnit/ValueArray/InterpolatedVar/normalizeValueUnits/prepareInterpVar/memoize | src/units/* + root barrel | **RIGHTLY** | documented in v4 CHANGELOG; kf 6.0.0 migrated in lockstep to structural interp-slots (coordinated transposition, both changelogs) |
| D16 | ICtCp / Jzazbz / Kelvin spaces | — | **NOT DROPPED** | all three survive in v4 `SPACE_SCHEMA` (model.ts:56–125) — recorded to preempt false claims |
| D17 | BBNF grammar reference files (css-color.bbnf, css-values.bbnf) | src/parsing/grammars/ | **RIGHTLY** | excised S.W0 `36f918d2` as dead surfaces, documented |
| D18 | color-soa channel-plan API | color-soa.ts | **RIGHTLY** | 3.0.0 migration table: orphan API, zero real consumers — tombstoned |

### 7. keyframes.js drop ledger (4.x → 5.x → 6.0, + the pre-4.0 note)

| # | Drop | Cut | Classification | Evidence |
|---|---|---|---|---|
| K1 | `animate()` API excised | 5.1.0 (R impl) | **RIGHTLY** | owner-chartered R excision, documented |
| K2 | keyframes-vue package killed (npm-revoked, repo-scrubbed) | R | **RIGHTLY** | owner ruling "overfit" |
| K3 | kf parse-that dep removed; parsing ceded to value.js | 4.4.0 (S9) | **RIGHTLY** | architectural consolidation; deps table v4.0.0 `{parse-that ^0.8.2, value.js ^0.10.0}` → v4.4.0 `{value.js ^1.1.0}` |
| K4 | parsimmon parser + kf-owned units/color (hsv/hsl/rgb/xyz/lab/lch/oklab conversions, colorFilter, COLOR_SPACE_RANGES clamps) | modernization (0.9.97 → 1.0.0, 2026-02-24/25) | **RIGHTLY** (transfer, not loss) | pre-mod tree `4993757f`; the color subsystem MOVED to value.js (same-day pre-modernization tags, identical file names colorFilter.ts/constants.ts/normalize.ts/utils.ts). **Owner's question answered: kf owned a color-CONVERSION subsystem, never a gamut-MAPPING engine; the only piece whose lineage later DIED (at value v4) is the colorFilter solver (D11).** |
| K5 | proof-* gate fleet + scripts/baselines (incl. visual goldens amiga-checkerboard.json, crayon-preserved.json, lighthouse-*) | 5.3.x (U dissolution) | **RIGHTLY** (owner-ordered apparatus collapse) — with the note that the visual-baseline GOLDENS died with the apparatus (a measurement-capability loss, not a product loss) | diff v5.2.0→v5.3.5 |
| K6 | parse-flatten.ts + plain-vars.ts (ValueUnit flatten pipeline) | 6.0.0 `5a9183a7` | **RIGHTLY** | coordinated Value-4 transposition; successor = compile/value/compile.ts (kf-owned `parseAndFlattenObject` over structural CssValue) + frame/interp-slot.ts; documented |
| K7 | `getTimingFunction` export, `printWidth` option, `BlendMode` type + `"weighted"` composite op | 6.0.0 | **RIGHTLY** | named in CHANGELOG + MIGRATION-6.0.0.md |
| K8 | bench/group-soa-validate.mjs | 6.0.0 | **RIGHTLY** | superseded by bench/group-soa-integration.mjs (present) |
| K9 | **INHERITED losses via the value 4.0 exact pin**: color-mix()/relative-color/contrast-color() animation endpoints unparseable; ΔE import gone; named-easing registry curtailed | 6.0.0 | **UNJUSTLY (inherited)** | kf can no longer parse what value 3.1.0 parsed; cure = the value.js RESTORE rows |

### 8. kf-side scar tissue (local duplications + stale docstrings born of vanished value.js primitives) [D-r2-05, FABLE-NEW]

| Site | Scar |
|---|---|
| `src/animation/compile/emit/backward/color.ts:123` | **Hand-rolled Euclidean ΔE-OK** (`Math.hypot(L2-L1, a2-a1, b2-b1)`) — local duplication of the deleted value.js `deltaEOK` |
| `src/animation/compile/emit/backward/color.ts:181` | Ramp re-derived by repeated `mixColors` calls — allocation-heavy local substitute for deleted `sampleColorRamp` |
| `src/animation/compile/emit/backward/backward.ts:30,32,47` | Stale docstrings citing "value.js's `sampleColorRamp`" and "`deltaEOK`" — both symbols no longer exist anywhere in value.js |
| `src/animation/easing.ts:44` | Stale docstring citing `bounceInEase` as a live "value.js bespoke curve" — deleted at v4 |
| `src/animation/compile/emit/format/format.ts:62,154,237` | Stale docstrings citing `unflattenObjectToString` — a deleted value.js export (the projection is now kf-internal under another name) |

### 9. RESTORE-candidate rows (UNJUSTLY-DROPPED only)

| Row | What | Restore mode | Owning library | Landing module |
|---|---|---|---|---|
| R1 | Analytical (Ottosson cusp+Halley) gamut map + raytrace exact-boundary reference + ΔE-OK JND clip criterion (CSS-4 css-gamut-map conformance) | **modernized** (into the v4 structural model; zero-alloc kernel under the immutable facade; raytrace kept as test-side reference oracle) | value.js | `src/color/` (operations + a gamut kernel module; raytrace under `test/`or a reference submodule) |
| R2 | ΔE family: deltaEOK (+JND), deltaE2000, deltaEITP | as-was (typing modernized) | value.js | `src/color/` |
| R3 | Zero-alloc Into family — scoped set: convert-into, mix-into, gamut-map-into, ramp-sample-into over flat channel arrays | **modernized** (out-param channel buffers compatible with the frozen public types) | value.js | `src/color/` |
| R4 | The measured parser: successor per panel-1 bench adjudication (byte-scanner reference vs parse-that mutable-ParserState) + resurrect `bench/` + the portable ratio perf gate (carry the U-F14 co-scaling-normaliser lesson) | **modernized** | value.js | `src/css/` + `bench/` + CI |
| R5 | OKHSL / OKHSV spaces | as-was (they reuse R1's cusp math) | value.js | `src/color/` |
| R6 | `color-mix()` grammar + structural node | modernized | value.js | `src/css/grammar.ts` |
| R7 | Relative color `from` syntax | modernized | value.js | `src/css/grammar.ts` |
| R8 | `contrast-color()` grammar (+ decision rider: re-publish WCAG metrics) | modernized | value.js | `src/css/` (+ `src/color/`) |
| R9 | `sampleColorRamp(At/Into)` — kf backward-emit densify re-adopts, deleting the kf scar (§8) | modernized | value.js | `src/color/` |
| R10 | calc()/math-function static evaluator (weak candidate — DOM-free eval; owner spec-coverage mandate) | modernized | value.js | `src/css/` or `src/foundation/math.ts` |

kf-side restore work is limited to CONSUMING R1–R9 (delete the §8 scars); no kf-owned capability needs restoration — every kf drop was either owner-ordered or a coordinated transposition.

---

## PHASE 2 — union with demarcation (vs skeptic-D-drops-ledger.md, the Opus-begat prior)

Every material prior finding was presumed INCORRECT and tested against on-disk evidence (tag-pinned `git grep`/`git show` at `164343c1^`, v3.1.0, v5.0.0/v5.1.0, plus today's trees and `docs/tranches/V/{DECISIONS,CONSUMER-CUT}.md`). The prior report pinned older HEADs (value `91fa1368`, kf `c2c8915f`); both trees have advanced one/few commits — no finding turned on the delta.

### UNION-CONFIRMED (in the prior report AND independently re-derived — survive on MY evidence) — 20 families

| # | Finding | My re-derivation |
|---|---|---|
| U1 | ONE-cut headline: pre-v4 additive, v4 `164343c1` = the mass extinction | §1; +4,117/−24,330 stat |
| U2 | Raytrace gamut oracle dropped (`gamutMapOKLabRaytrace`/`gamutMapSRGBRaytrace`); successor `mapColorToGamut` has no ΔE/MINDE/clip criterion | export names verified at `164343c1^:src/units/color/gamut/raytrace.ts:91,123`; successor read in full (§2) |
| U3 | ΔE family dropped (deltaEOK/deltaE2000/deltaEITP); kf forced into local duplication | §2, §8; kf color.ts:123 |
| U4 | Into-family dropped; D54 SCI-1 SHIP-4.1.x restore is UNDER-SCOPED (mixColorsInto+toRgba8Into only; no color2Into/boundary/gamut-hot-path coverage) | my 14-name census (§4); D54 text verified in `docs/tranches/V/DECISIONS.md:82` + INBOX O-5 |
| U5 | `mixColorsN`/`sampleColorRamp`/`sampleColorRampAt` dropped; kf densify falls back to per-pair `mixColors` | verified exports at `164343c1^:src/index.ts:196`; kf color.ts:181 |
| U6 | OKHSL/OKHSV dropped | §6 D5 |
| U7 | Gamut-boundary samplers deleted silently at the value level | §6 D12; zero hits current src |
| U8 | `rgb2ColorFilter`/`cssFiltersToString` dropped, zero rationale anywhere → UNCLEAR | §6 D11 |
| U9 | `contrast-color()` + public WCAG helpers lost their home; `safeAccentColor` the sole survivor | §6 D8; zero `contrast-color` hits |
| U10 | `evaluateMathFunction` (calc evaluator) dropped — parse-without-evaluate gap | verified export `164343c1^:src/index.ts:444`; matches my D10 |
| U11 | `parseSpring`/`lowerSpringEasing` (CSS `spring()` grammar) dropped — I MISSED this in Phase 1; verified at `164343c1^:src/index.ts:333` → survives on my evidence | fresh grep |
| U12 | Stylesheet pretty-print/round-trip serialization capability dead (AMENDED — see refutation R3 below: the mechanism differs) | kf css-text.ts read: no `formatCSS`, no Prettier |
| U13 | `validateSyntax`/`parseSyntaxDescriptor` narrowed to `coerceToSyntax` | CONSUMER-CUT.md:50 verified |
| U14 | The rename/move families are RIGHTLY (parseCSS*→parseCss*, ParseResult-ification; css-text quartet moved to kf) | CONSUMER-CUT §2 table + kf css-text.ts exports verified on disk |
| U15 | `flattenObject`/`unflattenObject` family RIGHTLY-dropped WITH tombstones (D28 "DECLINED AS SUPERSEDED", D54 §C) | DECISIONS.md:55,82 verified |
| U16 | OO Color/ValueUnit model flip RIGHTLY (documented tombstone; cite corrected — see R4) | DECISIONS.md:17 "Disciplined final objects" |
| U17 | color-soa 3.0.0 excision was pure consumer-count rationale → legitimate re-litigation under the zero-alloc mandate | 3.0.0 migration table (§5); their RESTORE row R5 adopted |
| U18 | kf lost almost nothing library-level: 5.0.0 alias drops (MIGRATION-5.0.0.md verified), 5.1.0 `loadEngine`/`loadCompiler`/`loadIngest` cut (v5.0.0 index exported them; v5.1.0 keeps only `loadAnimationEngine` — verified), animate.ts zombie (`aed363ed` verified) | fresh tag greps |
| U19 | Silent-drop governance thesis + process defect (no capability-preservation gate; "no audited consumer" rule the owner voids) | my §5; V-docs 0-hit greps re-run independently |
| U20 | kf regex census: THREE copies of the CSS-native easing name-table (easing.ts:30,39 + easing-serialize.ts:20); scroll/grammar.ts is a regex-free consume adapter; kf does essentially zero text parsing | all four sites verified on disk |

### OPUS-REFUTED (tested and wrong — disproofs) — 4, all detail-grade

| # | Prior claim | Disproof |
|---|---|---|
| R1 | "the `color-soa.ts` FILE lingered to v3.1.0, deleted entirely at v4" | `git ls-tree -r v3.1.0 -- src/ | grep -i soa` = EMPTY; same at `164343c1^`. The file died with the 3.0.0 excision, not at v4 |
| R2 | `toRgba8Into` listed among the DELETED pre-v4 into-variants | `git grep toRgba8Into 164343c1^ -- src/` = 0 hits. It never existed pre-v4 — it is a NEW primitive proposed in SCI-1. The accurate deleted set is my 14-name census (§4) |
| R3 | "`formatCSS` (Prettier) … is NOT in the move manifest" | CONSUMER-CUT.md:53 EXPLICITLY lists `formatCSS` moving to kf `css-text.ts`. The move was manifested but NEVER LANDED (kf css-text.ts has no formatCSS/Prettier; kf has no prettier dep). The capability-loss conclusion stands; the mechanism is worse than claimed — a manifest-vs-tree drift (see F10) |
| R4 | OO-flip tombstone cited as "D17/D18" | DECISIONS.md D17 = per-site BI component adoption; D18 = the banked CLAUDE.md deletions. The actual tombstone is the "Disciplined final objects / BUILD W7–W9" row (DECISIONS.md:17). Substance unaffected |

### OPUS-UNVERIFIABLE (neither provable nor refutable here — EXCLUDED from the union product) — 2

1. The D46b SpectrumCanvas gamut-overlay "~−983 LoC" figure (the value-level primitive-silence stands on my own grep; the demo LoC figure was not re-derived).
2. The "≈70 → 23 exports" color-subpath counts (counting method unstated; my counts differ: ~98 exported symbol lines → a 38-line barrel; not material either way).

### FABLE-NEW (mine, absent from the prior report) — 14 families

F1. **THE MEASURED-PARSER STORY (owner seed 2) — wholly absent from the Opus report.** Byte-scanner fast paths + parse-that combinator base dropped; `proof-perf-target.mjs` CI ratio gate + `css-parse-perf.mjs`/`parser-namelookup.mjs` benches deleted in the same cut; `bench/` no longer exists; the regex successor was born UNMEASURED inside `164343c1`; the parse-that runtime dep died at v4 (§3).
F2. `color-mix()` grammar parse dropped (D6).
F3. Relative color `rgb(from …)` grammar parse dropped — hard-fail at grammar.ts:176 (D7).
F4. Easing curve-family halved without a principled line (D13) + kf stale `bounceInEase` docstring (easing.ts:44).
F5. 2.0.0 shipped with NO changelog entry; transcribed retroactively at S.W0 `a9c5854a` (§5).
F6. Owner-question answered: kf pre-4.0 owned a color-CONVERSION subsystem (pre-mod `src/units/color/`), ceded whole to value.js at the 2026-02 modernization; NEVER a gamut-mapping engine; the colorFilter solver's kf→value lineage ENDS at v4 (K4, D11).
F7. Additional kf scars: format.ts:62/154/237 stale `unflattenObjectToString` docstrings (§8).
F8. U-dissolution killed the visual-baseline goldens with the apparatus (K5 note).
F9. kf 6.0.0 INHERITED-loss row: the exact `4.0.0` pin imports every value-4 parse loss into kf's animation surface (K9).
F10. CONSUMER-CUT.md:53 manifest-vs-tree drift: the formatCSS move is claimed, unexecuted — a doc-truth defect to file with V-next.
F11. Successor gamut-map allocation profile quantified (~3 Result allocs × 32 iterations per mapped color; `safeAccentColor` multiplies it) + CSS Color 4 css-gamut-map nonconformance stated precisely (§2).
F12. NOT-DROPPED preemptive rows: ICtCp/Jzazbz/Kelvin SPACES survive in v4 `SPACE_SCHEMA` (the raw transform EXPORTS died; the spaces did not) (D16).
F13. The prior's open "container-query-unit resolution home unverified" is CLOSED: kf owns it at `src/animation/resolve/browser.ts:69–101` (queryContainer + containerType) → the convertTo* family reclassifies RIGHTLY-moved.
F14. Governance refinement of U19: the silence was SELECTIVE — consumer-advocated rows (flattenObject, cubicBezierToSVG, syntax coercion) received documented dispositions (D28/D54); capabilities with no consumer advocate (raytrace, ΔE, OKHSL, ramps, filter solver, the parser+benches) died with zero paper. The defect is precisely "no advocate ⇒ no tombstone."

### FINAL UNION PRODUCT (FABLE-NEW + UNION-CONFIRMED)

The union RESTORE table = my Phase-1 R1–R10 MERGED with the prior's surviving rows, yielding: R1 gamut engine (analytical+raytrace+ΔE-OK JND clip, css-gamut-map conformant, zero-alloc kernel) · R2 ΔE family · R3 Into family EXTENDED beyond SCI-1 (convert/mix/gamut-map/ramp + `mapColorToGamutInto`/`safeAccentColorInto` hot path) · R4 measured parser + bench/ + ratio-gate resurrection (successor per panel-1 adjudication) · R5 OKHSL/OKHSV · R6 color-mix() grammar · R7 relative-color grammar · R8 contrast-color() + WCAG metrics rider · R9 sampleColorRamp/mixColorsN (kf scar deletion rider) · R10 calc/math evaluator (`evaluateMathFunction`, weak) · R11 spring() grammar (ownership decision value-vs-kf) · R12 SoA channel-fold re-litigation (zero-alloc mandate) · R13 boundary samplers IFF the gamut viz rebuilds (UNCLEAR-gated). All land in value.js `src/color/` + `src/css/` (+bench/CI); kf's only work is consuming the restores and deleting §8 scars.

Rightly-dropped tombstones (never re-litigate): OO Color/ValueUnit model flip; legacy kf aliases (5.0.0); animate.ts zombie; loadEngine/loadCompiler/loadIngest accessors; flattenObject/unflattenObject; cubicBezierToSVG; timingFunctions aggregate registry; BBNF grammar files; color-soa AS-3.0.0-DECIDED (the capability re-enters via R12 as a NEW primitive under the zero-alloc mandate, not as a relitigation of the 3.0.0 record); parse-that combinator re-exports; kf parsimmon parser + kf units/color (transferred, not lost); the U apparatus collapse (owner-ordered).
