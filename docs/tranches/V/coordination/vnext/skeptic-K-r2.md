# Skeptic K r2 (TRUE-FABLE) — kf pre-4.0 archaeology

## G0-prime tree pinning
| repo | path | branch | HEAD | note |
|---|---|---|---|---|
| keyframes.js (canonical) | /Users/mkbabb/Programming/keyframes-v-exec | master | `0dac636b` | v6.0.0; full history to 2021-02-05 |
| value.js | /Users/mkbabb/Programming/value.js | tranche-u | `db77dbd8` | read for cross-repo blob comparison only |
| parse-that | /Users/mkbabb/Programming/parse-that | master | `ef10d5b` | pinned; not substantively read |

Atlas NOT read (not needed for this lane). /Users/mkbabb/Programming/keyframes.js (dirty) NOT cited.
All evidence from git objects in keyframes-v-exec + value.js; every claim reproduces via the cited hash.

Phase 1 written before opening the prior Opus report. Phase 2 demarcations appended after.

---

## F1. The version chronology (the cut map) — [FABLE-NEW; Phase-2: partially UNION-CONFIRMED, see §P2]

Derived from `git log --diff-filter=M -- package.json` + tag dates:

- 2021-02-05 `f412f1b8` initial commits ("animato" era, package version 1.0.0 vanity).
- 2023-01-24..2023-02-21: the 0.5.0→0.6.2 era; the parsimmon parser enters at `33667a84` 2023-01-26 ("Updated parsing of unit values").
- 2024-06-23..2024-07-19: the 0.6.3→**0.9.97** sprint. `6ab701ae` 2024-07-11 splits the `src/units.ts` monolith into `src/units/` (styling/colors/parser overhaul). Last 2024 commit `1acf25c6` 2024-07-19 @ 0.9.97. **The owner's "2024-07-era baseline (about v0.9.97)" is exact**: 0.9.97 reached at `63a9322b` 2024-07-01 and never moved again.
- **2024-07-17: value.js is BORN as a carve-out of kf** — value.js initial commit `35cd9d5d` ("Initial move to new repo") contains `src/parsing/` + `src/units/` (+ math/utils) **byte-identical** to kf's (blob-hash proof in F5). kf 0.9.97 never consumed it; the 2024 era ends 2 days later.
- 19-month dormancy (2024-07-19 → 2026-02-24).
- 2026-02-24 tag `pre-modernization` = `4993757f` (still 0.9.97).
- **2026-02-25 `54424ee0` "feat: full modernization — TW4, reka-ui, deduplication, parse-that" → v1.0.0 `79a81bc2`**: parsimmon dep dropped; `@mkbabb/parse-that ^0.6.0` + `@mkbabb/value.js ^0.3.1` arrive (both in this ONE commit).
- 2026-02-26 `0487521e` (v1.0.1 era): WAAPI delegation + layering + benchmarks born.
- 2026-03-10 `899f528d` v1.2.0: NumericAnimation / SmoothProgress / ElementMorph / Timeline+ScrollTimeline+ManualTimeline born; `file:`/`latest` deps → registry ranges "for npm publishing".
- 2026-04-17 `c9403673` v2.0.0 (untagged) + **`58e75763` "delete keyframes.js shim files"** same day: the great deletion cut (F5).
- 2026-05-13 v2.1.0 `7561af3b`; 2026-05-26/27 `d89274dd`/`ddd34093`: SpringProgress + springTimingFunction born.
- 2026-06-02 v2.2.0 `f0920638`; 2026-06-03 v3.0.0 `2105e7e2`; the tranche burst (B/D/E/F): engine+easing `5af8eb7f` (B.W2, 06-04), frame-compiler `a0303fe5` (D.W4, 06-05), decay/drag/flip/stagger/sequence/animate + native-scroll bridge `4ee8e345` (E.W9+W10, 06-05).
- **2026-06-06 v4.0.0 `d2640533`**: src = 33 files, flat `src/animation/` + `internal/`; deps `parse-that ^0.8.2` + `value.js ^0.10.0`.
- Post-4.0 tails needed for zone completeness: DrawSVG `3d352a3f` (G, 06-07); scroll/ingest/compile-back round-trip `2784e463` (K.W8-W10, 06-16); fromMorphSVG `69ca7bf1` (O.W6, 06-23); parse-that dep removed `495484aa` (S9, 06-23, 4.4.0-era); the 7-zone directory partition `40834d26` (R.W1, 06-24, 5.x); emit carve `fb14e369` (07-12); Value-4 transpose `5a9183a7` v6.0.0 (07-16).

## F2. When did kf's own parser leave, and to where — [FABLE-NEW; Phase-2: stages 1–2 UNION-CONFIRMED, stage 0/3 FABLE-NEW]

**Answer: to value.js, in one false start + three real stages.**

- **Stage 0 — the 2024 false start (`35cd9d5d` value.js, 2024-07-17):** the parser was *copied out* to the new value.js repo (parsimmon-based, byte-identical), but kf 0.9.97 kept and used its own in-repo copy. A dual-copy era, kf side frozen for 19 months. The "departure" the owner asks about was *attempted* in 2024 and *completed* in 2026.
- **Stage 1 — modernization (`54424ee0`, 2026-02-25, v1.0.0):** unit + color parsing delegated to value.js; `src/parsing/units.ts` and all of `src/units/` become pure re-export shims (e.g. v1.0.0 `src/parsing/units.ts` = 7 lines re-exporting `CSSColor/parseCSSColor/CSSValueUnit/parseCSSValueUnit` from `@mkbabb/value.js`; `src/units/color/colorFilter.ts` = 1 line re-exporting `rgb2ColorFilter, cssFiltersToString`). The @keyframes grammar stays in kf but is **rewritten parsimmon → parse-that** (v1.0.0 `src/parsing/keyframes.ts`, 230 lines of parse-that combinators; `src/parsing/grammars/css-keyframes.bbnf`, 105 lines).
- **Stage 2 — the grammar leaves (`58e75763`, 2026-04-17):** `keyframes.ts` + `css-keyframes.bbnf` deleted; replaced by value.js `parseCSSStylesheet` / `extractKeyframes` / `extractAnimationOptions` behind a NEW kf-side `src/animation/adapter.ts` (`resolveKeyframes`) whose doc-comment says verbatim it "replaces the legacy `parseCSSKeyframes` / `parseCSSStyleBlock` / `parseCSSAnimationKeyframes` fork". value.js owned `parseCSSKeyframes` from its very first commit (`git log -S parseCSSKeyframes` in value.js → `35cd9d5d` 2024-07-17).
- **Stage 3 — the last parse-that thread (`495484aa`, 2026-06-23, 4.4.0-era "S9"):** kf's last direct `@mkbabb/parse-that` import (`src/animation/utils.ts:1` `any as parseAny`, still present at `58e75763`) removed; kf's parsing surface is value.js-only from here.

Corollary for the V-next split-parsing debate: the "value.js owns core CSS, kf owns an adapter" architecture the owner's prompt asks for has existed since 2026-04-17; kf has had **no parser of its own** since then — the pre-4.0 record contains no evidence a kf-resident CSS parser was ever missed.

## F3. When did the value.js dependency arrive — [FABLE-NEW; Phase-2: UNION-CONFIRMED on the date]

`git log -S '@mkbabb/value' -- package.json` → exactly one arrival: **`54424ee0` 2026-02-25, `@mkbabb/value.js ^0.3.1`** (same commit as parse-that `^0.6.0` and the parsimmon drop). Version walk pre-4.0: `^0.3.1` (v1.0.0) → `file:../value.js` + `latest` interregnum (visible at `3cb07022`/`58e75763`) → registry `^0.5.0` at `899f528d` v1.2.0 (2026-03-10, "Dependency fixes for npm publishing: Replace 'latest' and 'file:' refs with versioned ranges") → `^0.10.0` at v4.0.0. The later "NO file: for siblings" constellation law (registry-consumption ruling) had a pre-4.0 precedent at v1.2.0.

## F4. Zone births — date, trigger, DEMANDED vs SPECULATIVE — [FABLE-NEW except where tagged in §P2]

| zone | born (files) | commit | trigger on record | verdict |
|---|---|---|---|---|
| **waapi** | 2026-02-26 | `0487521e` | perf audit: fixes a REAL defect (broken `getComputedValue` memoization — JSON.stringify on HTMLElement → WeakMap) + compositor-thread delegation, `useWAAPI` default true, benchmarks added same commit | **DEMANDED** (defect+measurement-driven) |
| **timeline/scroll (JS driver)** | 2026-03-10 | `899f528d` | "General-purpose interpolation primitives decoupled from CSS" — no named consumer, no defect | **SPECULATIVE at birth**, ratified later (K-1 ARCH-kill re-affirmed thrice; K round-trip built on it) |
| **physics: SpringProgress** | 2026-05-26 | `d89274dd` | "Lands W9-α of speedtest AL SLIM plan" — a NAMED external consumer (speedtest) | **DEMANDED** |
| **physics: springTimingFunction** | 2026-05-27 | `ddd34093` | "spring→TimingFunction sampler for ElementMorph consumers" — named internal consumer | **DEMANDED** |
| **physics: decay/drag + flip/stagger/sequence (orchestration files)** | 2026-06-05 | `4ee8e345` E.W10 | E.md:530 verbatim: "The orchestration tier (**the competitive feature frontier**)... the layer every competitor leads with" | **PARITY-SPECULATIVE** (competitive positioning, no consumer/defect named) |
| **animate() front door** | 2026-06-05 | `4ee8e345` (E.W10 D-4) | same parity rationale | **SPECULATIVE — CONFIRMED BY DEATH**: deleted `aed363ed` 2026-07-03 (S.C1 "DELETE the animate.ts zombie cluster"), 28 days old. The type specimen of an undemanded E.W10 birth. |
| **compile (frame-compiler)** | 2026-06-05 | `a0303fe5` D.W4 | engine-gestalt transposition (B/D engine-debt findings; easing.ts born B.W2 `5af8eb7f` 06-04) | **DEMANDED** (structural/perf debt) |
| **compile-back/emit (CSS out) + ingest + scroll grammar** | 2026-06-16 | `2784e463` K.W8-W10 | "ingest the live web's CSS... compile BACK to zero-runtime CSS" — the tranche-K owner charter (round-trip TOTAL) | **DEMANDED (owner)** |
| **svg (DrawSVG)** | 2026-06-07 | `3d352a3f` G | tranche-G SOTA-parity ("DrawSVG+.finished") | **PARITY-SPECULATIVE** |
| **svg (fromMorphSVG)** | 2026-06-23 | `69ca7bf1` O.W6 | the P-inv-28 chronic-close (terminals M never built) | **DEMANDED** (chronic ledger) |
| **zone DIRECTORIES (scroll/waapi/svg/ingest/orchestration/physics/compile + engine/group/resolve/presets/internal)** | 2026-06-24 | `40834d26` R.W1 | the 7-zone partition of flat `src/animation/` (33-file flatland at v4.0.0) | structural, post-4.0 |
| **emit as named module** | 2026-07-12 | `fb14e369` | compile-zone responsibility carve | structural |

Note the asymmetry that survives to 6.0.0: every **DEMANDED** birth above still exists at v6.0.0 (`git ls-tree v6.0.0`: compile, engine, group, ingest, orchestration, physics, presets, resolve, scroll, svg, waapi); the one pure-speculative *API* birth (animate()) is the one that died. The speculative *zones* (drag/decay/flip/stagger/sequence, DrawSVG) survived but were carved, ceiling-gated, and repeatedly re-audited (R.W2b/W2c spring carves; T.F22 zone-cohesion) — the record shows their carrying cost was paid in at least 6 later commits.

## F5. What kf DELETED along the way — classified — [FABLE-NEW; Phase-2: color-blob-identity independently derived, see §P2]

| deletion | when | evidence | classification |
|---|---|---|---|
| `src/units.ts` monolith | 2024-07-11 | `6ab701ae` (split into `src/units/` dir) | **RIGHTLY** (refactor, not a drop) |
| parsimmon dep + parser internals | 2026-02-25 | `54424ee0` | **RIGHTLY** — replaced by parse-that/value.js; today's owner doctrine ("value.js should own the core CSS spec") retro-ratifies it |
| **`src/units/` + `src/units/color/` (colorFilter, normalize, constants, utils — kf's own color/gamut code)** | shimmed 02-25, deleted `58e75763` 2026-04-17 | **blob-hash proof**: every file of kf `1acf25c6:src/units/color/*` and `src/units/*` is byte-identical to value.js `35cd9d5d:src/units/...` (e.g. colorFilter `5ffd41c3…`, normalize `dbd2ede0…` — SAME in both repos). kf's copy had zero unique commits after the 2024-07-17 carve-out | **RIGHTLY — with cryptographic-grade certainty.** kf lost NOTHING unique; any gamut-drop archaeology (the double-gamut RESTORE debate) is value.js-side evolution AFTER `35cd9d5d`, not a kf-side loss. |
| `src/easing.ts` (13L), `src/math.ts` (12L), `src/utils.ts` | `58e75763` | already shims by then ("delete keyframes.js shim files"); substance consumed from value.js (`timingFunctions`, `clamp/lerp/scale`, memoize — visible in `58e75763` imports) | **RIGHTLY** |
| `src/parsing/keyframes.ts` (230L) + `css-keyframes.bbnf` (105L) | `58e75763` | replaced by value.js `parseCSSStylesheet` behind `adapter.ts`; the grammar-artifact lineage continued value.js-side (`src/css/grammar.ts`; BBNF grammar files + equivalence snapshots added at value.js `22b1eee8`/`432d10cf`) | **RIGHTLY** (no knowledge loss; spec artifact re-homed) |
| `animate.ts` (+ cluster) | 2026-07-03 | `aed363ed` S.C1 "zombie cluster (T6) + wire the gates" | **RIGHTLY** (born speculative E.W10, no consumer, gates wired at deletion) |
| kf 0.9.97's parsimmon `src/parsing/format.ts` | relocated (not deleted) `58e75763` | `src/{parsing => animation}/format.ts` | not a drop |

**No UNJUSTLY deletion was found in the pre-4.0 window.** The one UNCLEAR candidate examined (the .bbnf grammar artifact) resolved to RIGHTLY on the value.js-side lineage. The pre-4.0 record is unusually clean because the dominant deletion (`src/units/`+`src/parsing/`) was of *frozen byte-identical copies* of code that had already emigrated.

## F6. Recorded deliberate-KEEP / platform-reimpl rulings bearing on today's prune debates — [FABLE-NEW]

1. **K-1 — the JS ScrollTimeline-sampler ARCH-kill (the standing KEEP):** the JS `Timeline` sampler is deliberately KEPT; the native ScrollTimeline/ViewTimeline bridge is ADDITIVE-only, feature-detected (`4ee8e345` E.W9: "ADDITIVE only; the JS Timeline sampler stays (the ARCH-kill of REPLACING it HOLDS; no polyfill)"). Re-affirmed: F `r-scroll-vt-2026.md:51,221,358` ("RE-CONFIRMED against the LIVE W9 bridge"); G `a-scroll-orbital-quaternions.md:12,66` ("the ARCH-kill is *correct*", scroll arch ALREADY-SOTA); grounds: ScrollTimeline STILL not Baseline (`r-animation-sota.md:175`, Chrome/Edge only). **Any V-next prune of the JS sampler must overturn a thrice-re-affirmed ruling with new Baseline evidence.**
2. **The no-polyfill law** (E.md:44-45): `scroll-timeline-polyfill` banned BY NAME; feature-detect with the JS path as the genuine fallback. Bears on any "adopt platform, drop JS path" prune.
3. **The ARCH-kill wall K-1..K-9 + D1** — re-verified terminal at G (`G.md:604`) and I (`recap-deferred.md:302`: "no consumer pull; no live evidence reopens"). A prune lane must consult this wall before re-proposing any killed architecture.
4. **Zero-runtime-VT ruling** (G `r-modern-web.md:63`: "the engine ships ZERO VT... do not re-litigate") — S's later VT emitters are compile-time output, consistent with the ruling (emit ≠ runtime adoption).
5. **The bit-packing KILL / RECORD** (`G.md:287`): frame id stays an un-decoded SMI token; time un-packable; dispatch belongs to value.js `_lerp` predispatch — "RECORD so nobody packs the id/time/dispatch (`frame-compiler.ts:84,213`)". A standing anti-optimization fence in the compile zone.
6. **In-house spring solver KEEP rationale** (E.md:530): the closed-form solver is the LEAD over Motion ("solver-quality + single-source `{fn,css}` pairing + the multi-segment guard"); `SpringProgress.fromDuration` is a thin Motion-idiom adapter, not an adoption. Bears on any "drop physics for platform/Motion" debate.
7. **E.W9 platform-adopt discipline (inv ξ)**: @property registration, live reduced-motion, dense WAAPI sampling — adopt the platform where Baseline, keep the JS path as genuine fallback; the recorded needs-value.js-handoffs (S4 Color L4 WAAPI interp, S6 currentColor/light-dark) show the boundary was policed even mid-wave.
8. **OD-3 ppMode/ppmycota — owner-RULED KEEP 2026-07-05** (`T/OWNER-DECISIONS.md:28`: "Keep ppmycota" verbatim; intentional brand mark; the CUT follow-up gate is dead). Demo-side prunes must respect it.

---

# PHASE 2 — union with the prior (Opus) report

Read AFTER F1–F6 were written: `skeptic-K-kf-pre4-archaeology.md` (the only prior/adjudication file opened). Every material finding presumed INCORRECT and tested against on-disk evidence. Additional verification commands run in Phase 2 are cited inline.

## P2 demarcation ledger

| # | Opus claim (compressed) | test | tag |
|---|---|---|---|
| 1 | Baseline v0.9.97 `1acf25c6` 2024-07-19; modernization pivot `54424ee0` 2026-02-25, ONE commit, zero parsimmon after | matches F1/F2 exactly, independently re-derived | **UNION-CONFIRMED** |
| 2 | **"Pre-4.0 was a CONTRACTION, not the bloat"**: 22 files/6,953 LOC (v0.9.97) → 23/2,812 (v1.0.0, −60%) → 32/8,864 (v4.0.0); ~14k of the over-baseline gap is post-4.0 | **reproduced to the digit** on my own count (`git ls-tree -r <ref> -- src` non-test .ts + `git cat-file -p | wc -l`): 22/6953, 23/2812, 32/8864 | **UNION-CONFIRMED** (their headline survives on my evidence) |
| 3 | value.js dep arrival `^0.3.1` at `54424ee0`; walk ^0.4 (v1.1.0) → ^0.5 (v1.2.0) → ^0.10 registry pin at `e10063f0` v2.1.1 2026-05-28 → **^0.11.1 at v4.0.0** | walk verified (`b74ce1bc`=^0.4.0, `899f528d`=^0.5.0, `e10063f0`=^0.10.0) EXCEPT the terminal: **v4.0.0 `d2640533` pins `^0.10.0`, not ^0.11.1** (`git show d2640533:package.json`) | **UNION-CONFIRMED** with one corrected detail |
| 4 | Zone-birth table: numeric/smooth/timeline/ElementMorph `899f528d` v1.2.0; spring `d89274dd`; engine.ts + LIGHT/HEAVY + `loadAnimationEngine` born `f0920638` v2.2.0 (KF-B1); frame-compiler `a0303fe5` (D); orchestration tier `4ee8e345` (E.W10); scroll/ · ingest/ · morph-svg · compile-emit ABSENT at v4.0.0 (Tranche K / 4.3.0) | all re-derived: engine birth `git log --diff-filter=A -- src/animation/engine.ts` → `f0920638` "KF-B1 — value.js static/dynamic boundary [2.2.0]"; `git ls-tree v4.0.0` has no scroll/ingest/svg files; K `2784e463` 06-16 confirms | **UNION-CONFIRMED** |
| 5 | **D1: "gamut mapping → UNJUSTLY-DROPPED" at kf's modernization; "903-LOC gamut-bearing color/utils.ts (48 gamut/oklab/clip matches)"; "the mechanical origin of the owner's named 'major loss'"; RESTORE-class seed on the kf ledger** | **FALSE on the central premise.** (a) `git grep -ci gamut 1acf25c6 -- src` → ZERO matches in the entire baseline tree; `color/utils.ts` = 839 LOC (not 903) with 37 matches ALL of them "oklab" *conversion-function names* (oklab2xyz, xyz2oklab, …), 0 "gamut", 0 "clip"; normalize.ts also 0. **kf never possessed gamut-mapping code pre-4.0 — there was nothing to lose at this cut.** (b) Blob-hash identity (F5): every deleted color/units file already lived byte-identically in value.js since `35cd9d5d` 2024-07-17 — 19 months before kf deleted its frozen copy. (c) Addendum-2's own binding interpretation locates the gamut loss value.js-side ("the raytrace oracle class"). kf-side classification corrected: **RIGHTLY**. The owner's real loss is value.js-era and value.js-lane. | **OPUS-REFUTED** (the report's headline finding) |
| 6 | D1: "the parser itself → UNJUSTLY per owner ('ill-defined and slow parser')" as a kf-side drop classification | **FALSE as located.** The owner condemns the *current value.js regex rewrite* ("the loss's residue" — addendum-2 interp §2; V-next prompt condemns value.js's "custom, non-parse-that" parser) — i.e. the unjust event is value.js's LATER replacement of the measured parser, not kf's delegation. The owner's V-next prompt affirmatively ratifies the kf→value.js split ("value.js should own the core CSS spec"). kf-side exit: **RIGHTLY**; the UNJUSTLY row belongs on the value.js drops ledger | **OPUS-REFUTED** (mislocated) |
| 7 | D1: "colorFilter → UNCLEAR (delegated, no successor-parity check recorded)" | **FALSE.** Successor parity was on record AT the cut: v1.0.0 `src/units/color/colorFilter.ts` is a 1-line re-export of `rgb2ColorFilter, cssFiltersToString` from value.js, and the source file is blob-identical (`5ffd41c3…`) in value.js `35cd9d5d`. **RIGHTLY** | **OPUS-REFUTED** |
| 8 | motion-path born `4cf7adb8` 2026-06-06, "Tranche E platform-adoption; ships beside native `offset-path` it **duplicates**" → SPECULATIVE | sha/date confirmed, but the commit is **tranche-F W12**, not E, and its title is "CSS-native MotionPath (**offset-distance over offset-path**, WAAPI-eligible)" — it *drives* the native property (adoption), it does not duplicate it. The duplication-speculative grade falls | **OPUS-REFUTED** (attribution + characterization) |
| 9 | D2: v2.0.0 barrel re-export drop RIGHTLY; documented only retroactively; CHANGELOG mis-dates it "2025-09-09" | verified: `git show 2105e7e2:CHANGELOG.md:166` "## v2.0.0 — 2025-09-09" + "consumers must now import primitives from…" | **UNION-CONFIRMED** |
| 10 | "CHANGELOG born v3.0.0 (2026-06-03); changelog+tranche system absent for the whole v1.0.0→v2.1.x window" | CHANGELOG actually born at **v2.1.0 `7561af3b` 2026-05-13** (with retroactive sections); tranche-A docs born `12f8282f` 2026-06-02. The corrected silent window (2026-02-25 → 05-13) still covers BOTH big cuts (02-25, 04-17), so the SILENT-DROPS process finding **stands in substance** with corrected dates | **UNION-CONFIRMED** (corrected) |
| 11 | D3: LIGHT/HEAVY `loadAnimationEngine()` boundary born `f0920638` v2.2.0; grade UNCLEAR/OVERFIT (H1-disputed) | birth verified (row 4). The overfit grade is H1-lane judgment; no counter-evidence in my lane; carried as UNCLEAR pending the H1/adjudicator ruling | **UNION-CONFIRMED** (birth fact; grade deferred) |
| 12 | D4: v4.0.0 no-alias renames (tick→advanceTo, pause split, tickDt) RIGHTLY + properly tombstoned — "the one well-governed cut in the range" | verified in `d2640533:CHANGELOG.md` (advanceTo :68, tickDt :20-25, pause-honest :73) | **UNION-CONFIRMED** |
| 13 | Survivors: presets 36→45 exports; `fromString`/`fromVars`/`fromKeyframes` intact at v4.0.0 | verified: `grep -c ^export` on animations.ts = 36 (`1acf25c6`) → 45 (`d2640533`); 8 refs in `d2640533:src/animation/engine.ts` | **UNION-CONFIRMED** |
| 14 | E.W9 "admitted platform-overfit": native `createNativeTimeline` added while deliberately KEEPING the JS sampler | the fact is verbatim in `4ee8e345` ("ADDITIVE only; the JS Timeline sampler stays… no polyfill"). Union carries it WITH its governing context (my F6.1): a KEEP ruling re-affirmed at F (`r-scroll-vt-2026.md:51,221,358`) and G (`a-scroll-orbital-quaternions.md:12`) on Baseline grounds (ScrollTimeline Chrome/Edge-only, `r-animation-sota.md:175`) — recorded-deliberate, not oversight; "overfit" is H1's contested frame | **UNION-CONFIRMED** (fact; framing contextualized) |
| 15 | waapi born from "performance audit… no demo driver, pre-tranche" → SPECULATIVE | the commit `0487521e` ALSO fixes a real defect (broken `getComputedValue` memoization) and ships the benchmark apparatus in the same commit. Union verdict SPLIT: the memoization repair = defect-DEMANDED; the WAAPI delegation + layering system = perf-ambition SPECULATIVE-at-birth, re-justified later (E.W9 dense sampling, K compile). My Phase-1 blanket "DEMANDED" is hereby refined | **UNION-CONFIRMED** (their grade survives for the delegation half; refines my F4 row 1) |
| 16 | "today `c2c8915f` v6.0.0" pin | `c2c8915f` exists (2026-07-17 docs(V) FOLD-FORWARD), 1 doc-commit behind my HEAD pin `0dac636b`; immaterial | **UNION-CONFIRMED** (trivial) |

**Counts: FABLE-NEW 7 · UNION-CONFIRMED 12 · OPUS-REFUTED 4 · OPUS-UNVERIFIABLE 0.**

FABLE-NEW material absent from the Opus report: (1) the 2024-07-17 value.js carve-out/false-start (stage 0) with the blob-hash identity proof; (2) stage 3 — the S9 `495484aa` last parse-that import removal; (3) the no-gamut-in-kf proof (the decisive disproof instrument); (4) the demanded-vs-speculative refinement set with named consumers (SpringProgress ← speedtest AL SLIM W9-α; springTimingFunction ← ElementMorph; ingest/scroll-grammar/compile-back ← the K owner charter; fromMorphSVG ← the P-inv-28 chronic) plus the animate() birth-to-death arc (E.W10 06-05 → S.C1 `aed363ed` 07-03, "zombie cluster"); (5) the 8-ruling deliberate-KEEP/platform-reimpl register (F6: K-1 thrice-affirmed, no-polyfill law, ARCH-kill wall K-1..K-9+D1, zero-runtime-VT, bit-packing fence, in-house spring LEAD, E.W9 boundary discipline, OD-3 ppmycota); (6) the grammar-artifact lineage (css-keyframes.bbnf → value.js `src/css/grammar.ts` + BBNF equivalence snapshots `22b1eee8`/`432d10cf`); (7) the v1.2.0 file:→registry precedent of the later constellation law.

## Union product (FABLE-NEW + UNION-CONFIRMED only)

F1–F6 as written, amended by the surviving Opus rows: the LOC-contraction table and its headline (P2#2), the D2/D3/D4 drops ledger rows with their governance grades (P2#9–12), the survivors record (P2#13), the silent-drops process finding with corrected changelog dates (P2#10), and the waapi split verdict (P2#15, which refines F4 row 1: memoization-fix DEMANDED / delegation+layering SPECULATIVE-at-birth). The D1 family (gamut/parser/colorFilter UNJUSTLY-or-UNCLEAR at kf) is EXCLUDED as refuted; its corrected form — all three RIGHTLY kf-side, with the gamut and parser losses re-located to the value.js drops ledger — enters via F5.

## Headline verdicts (final)

1. The parser left kf **to value.js** in a 2024-07-17 carve-out (false start; dual-copy freeze) completed by the 2026-02-25 modernization (units/color delegated; parsimmon→parse-that in-repo grammar) and the 2026-04-17 grammar deletion (adapter.ts over `parseCSSStylesheet`); the last parse-that thread cut 2026-06-23 (S9). kf has had no parser of its own since 2026-04-17, and the owner's V-next doctrine ratifies that state.
2. The value.js dep arrived 2026-02-25 (`^0.3.1`, same commit that dropped parsimmon); pre-4.0 walk ends at `^0.10.0` (v4.0.0).
3. **No UNJUSTLY drop exists in kf's pre-4.0 window.** The dominant deletion (parsing + color/units) removed frozen byte-identical copies of code value.js had held for 19 months; **kf never had gamut-mapping code** — the owner's named gamut loss is value.js-lane entirely.
4. Pre-4.0 was a **contraction** (6,953 → 2,812 → 8,864 LOC); the bloat under V-next scrutiny is post-4.0 mass (scroll/ingest/emit/SoA), whose births split DEMANDED (waapi-fix, spring, frame-compiler, ingest/scroll/compile-back, fromMorphSVG) vs PARITY-SPECULATIVE (E.W10 orchestration extras, DrawSVG, waapi-delegation-half) — and the only pure-speculative API birth (animate()) died in 28 days.
5. Today's prune debates are fenced by 8 recorded KEEP/platform rulings (F6); the two silent cuts (2026-02-25, 04-17) predate the CHANGELOG (born v2.1.0, 05-13) and the tranche system (born A, 06-02) — governance existed for D4 and after, which is exactly where the record turns clean.
