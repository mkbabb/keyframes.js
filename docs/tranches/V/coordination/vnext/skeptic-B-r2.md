# Skeptic B — r2 (TRUE-FABLE re-deployment) — draft-grounding, constellation/wedge/kf-fence axis

> Union-with-demarcation protocol. Phase 1 written BEFORE opening the prior
> (Opus) report. Phase 2 union appended below with provenance tags.

## G0-prime tree pins (every tree read)

| tree | branch | HEAD | state | role |
|---|---|---|---|---|
| /Users/mkbabb/Programming/keyframes-v-exec | master | `0dac636b` | clean | CANONICAL kf, v6.0.0 |
| /Users/mkbabb/Programming/value.js | tranche-u | `db77dbd8` | dirty (docs + dev.sh) | value.js current dev tree |
| /Users/mkbabb/Programming/glass-ui | master | `1b20f7d0` | dirty (docs only) | glass 7.0.0 |
| /Users/mkbabb/Programming/.p-totality/atlas | p/totality | `fe9abcf` | clean | ACTIVE atlas, v7.0.0 |
| /Users/mkbabb/Programming/keyframes.js | master | `a59d3a22` | DIRTY | NOT cited for source claims |
| /Users/mkbabb/Programming/parse-that | master | `ef10d5b` | dirty (untracked docs) | pinned, not read for this lane |
| /Users/mkbabb/Programming/bbnf-lang | master | `b3cf48e3b` | dirty | pinned, not read |
| /Users/mkbabb/Programming/atlas | master | `1e2b911` | — | STALE TRAP — not read, not cited |

npm registry reads: `@mkbabb/value.js@4.0.0`, `@mkbabb/keyframes.js@6.0.0`,
`@mkbabb/glass-ui@7.0.0` (2026-07-17, live `npm view`).

---

# PHASE 1 — fresh findings

## B-1. The true install-break graph (value 5.0.0 / kf 7.0.0)

**Published-registry graph today (all three manifests verified via `npm view` +
git tag `v4.0.0`):**

- `value.js@4.0.0` — **ZERO dependencies, ZERO peers** (git `show
  v4.0.0:package.json`: deps null, peers null; npm view prints empty).
- `keyframes.js@6.0.0` — `dependencies: {"@mkbabb/value.js": "4.0.0"}` — EXACT
  pin (npm + keyframes-v-exec/package.json). glass 7.0.0 is a
  **devDependency** (`"@mkbabb/glass-ui": "7.0.0"`) — demo-only; kf's
  published graph is glass-free. Exports map exactly `.` + `./engine`.
- `glass-ui@7.0.0` — peers `@mkbabb/keyframes.js ^6.0.0`, `@mkbabb/value.js
  ^4.0.0`, `@mkbabb/pencil-boil ^0.9.2` — **all three marked
  `optional: true` in peerDependenciesMeta** (in-tree @ `1b20f7d0` and npm,
  byte-identical). Optionality means: not auto-installed, no missing-peer
  error — but a peer PRESENT in the tree at an incompatible version still
  ERESOLVEs. The wedge therefore binds every CO-INSTALLING consumer (atlas
  installs all three), and spares only consumers that omit kf/value entirely.
- **ACTIVE atlas** (`.p-totality/atlas` @ `fe9abcf`, v7.0.0):
  devDependencies pin EXACT `glass-ui 7.0.0` / `keyframes.js 6.0.0` /
  `value.js 4.0.0` / `pencil-boil 0.9.2`; peerDependencies `^7.0.0` /
  `^6.0.0` / `^4.0.0` / `^0.9.2` (+ `pinia ^2.3||^3.0`, `vite ^7.0.0`,
  `vue ^3.5`, `vue-router ^4.5`). Atlas is itself a peered library — its
  consumers inherit the whole tuple.

**Break propagation:** a `value 5.0.0` does not break kf 6.0.0's install
(exact pin keeps resolving 4.0.0) — it breaks ADOPTION: kf 6.0.0 is
immutable, so consuming value 5 forces kf 7.0.0; kf 7.0.0 violates glass
7.0.0's `^6.0.0` (optional ⇒ conflict wherever co-installed, i.e. atlas and
both demos) and atlas's `^6.0.0` peer + exact devDep; value 5 likewise
violates glass's `^4.0.0` and atlas's `^4.0.0`. Full co-land set: value 5 →
kf 7 → glass peer-bump (glass 8 or a widened 7.x) → atlas successor. The
draft's G3 wedge is REAL with the optionality refinement.

**B-1-NEW (sharpest install-graph fact, absent from the draft):** the
value.js WORKING TREE (tranche-u @ `db77dbd8`) added a **production
`dependencies` block: `{"@mkbabb/glass-ui": "^7.0.0",
"@mkbabb/keyframes.js": "^6.0.0"}`** at commit `f2c8f565` ("feat(v-w44)!:
adopt @mkbabb/glass-ui 7.0.0 across the demo consumer surface") — a
demo-surface adoption placed in `dependencies`, not `devDependencies`
(contrast: kf made the same glass-7 adoption as a devDependency). The
package is not private and publishes `files: ["dist", ...]`; `dependencies`
always publish. If the next value cut (5.0.0 or any) ships this block:
(a) every value consumer transitively installs glass + kf + their peer
trees; (b) the registry acquires a kf↔value CYCLE; (c) under the
coordinated value-5/kf-7 cut, value 5's `kf ^6.0.0` forces a SECOND kf core
(kf 6 under value, kf 7 at root), and that kf 6's exact `value 4.0.0` pin
forces a SECOND value core — the dual-physical-core / class-identity wedge
this constellation has repeatedly fought ("one physical core" law). The R3
co-land protocol MUST include stripping/relocating this block; the draft
does not know it exists.

## B-2. The kf TimingFunction fence + the ACTIVE-atlas chase census

- Home: `keyframes-v-exec/src/animation/constants/types.ts:45` —
  `export type TimingFunction = (t: number) => number;` — **exactly line 45**.
- Root-barrel export: `src/animation/index.ts:159` (named `export type {...}
  from "./constants/types"` block, lines 158–170).
- **Atlas kf-import census (p/totality @ `fe9abcf`, src/, grep-reproducible):
  9 import statements across 8 files:**
  1. `src/platform/composables/useCountUp.ts:47` — `NumericAnimation, type TimingFunction`
  2. `src/charts/composables/activeViz.ts:38` — `RAFPlayback`
  3. `src/motion/useLoadSequence.ts:33–38` — `Sequence, loadAnimationEngine, type AnimationEngine, type CSSKeyframesAnimation`
  4. `src/motion/variant-registers.ts:9–13` — `springTimingFunction, springLinearStops, type StaggerOrigin`
  5. `src/motion/buildMarkAnimation.ts:6` — `NumericAnimation`
  6. `src/motion/buildMarkAnimation.ts:7` — `MorphSVG` from **`@mkbabb/keyframes.js/engine`** — the ONLY `/engine` subpath consumer in atlas; the `./engine` fence has a live external consumer.
  7. `src/motion/useScrollTimeline.ts:44` — `ManualTimeline, type TimingFunction`
  8. `src/motion/useScrollLettering.ts:53–58` — `stagger, springTimingFunction, type StaggerOrigin, type TimingFunction` — the `TimingFunction` token is on **line 57** (block closes :58).
  9. `src/motion/motion-director.ts:20` — `SpringProgress, NumericAnimation`
- **TimingFunction chase sites: EXACTLY THREE** — `useCountUp.ts:47`,
  `useScrollTimeline.ts:44`, `useScrollLettering.ts:57`. The draft's three
  cites, including the `:57`, are all correct on the ACTIVE tree.
- Atlas also carries 25 `@mkbabb/value.js` reference lines (exclusively the
  `/math` + `/easing` subpaths: `clamp`, `lerp`, `easeOutExpo`,
  `smoothStep3`, `CubicBezier`, `type EasingFunction`) and 46 files
  importing `@mkbabb/glass-ui`.
- `IN-ATLAS-3` is a real coordination-ledger row: value.js
  `docs/tranches/V/reformation/DISPOSITIONS.md:51` ("IN-ATLAS-3 (easing
  fence mirrored: W43 internal-only, /easing frozen)").
- **44-key runtime mirror CONFIRMED by execution**: `node` import of
  `keyframes-v-exec/dist/engine/index.js` (built 2026-07-17 05:09) →
  **44 keys**. Source: `src/animation/public.ts` (the `./engine` entry —
  vite.config.ts:170–173 maps `engine/index` → `public.ts`, NOT
  `engine/index.ts`).

## B-3. Blast radius: `src/animation` → `src` flatten + `internal/` rename (keyframes-v-exec @ `0dac636b`)

**Load-bearing config/gate anchors (the complete census):**

| # | file:line | anchor |
|---|---|---|
| 1 | `tsconfig.json:31` | `"@mkbabb/keyframes.js": ["./src/animation/index.ts"]` self-alias (types realm) |
| 2 | `vite.config.ts:39–41` | demo self-alias `@mkbabb/keyframes.js` → `src/animation/index.ts` |
| 3 | `vite.config.ts:154–157` | lib entry `keyframes` → `src/animation/index.ts` |
| 4 | `vite.config.ts:170–173` | lib entry `engine/index` → `src/animation/public.ts` |
| 5 | `vite.config.ts:224–231` | dts `entryRoot: "src/animation"` + `compilerOptions.rootDir` → `src/animation` — the two MUST move in lockstep or the roll-up degrades to a 12-byte `export {}` stub (the documented api-extractor failure; the CI dts byte-check is the only catch) |
| 6 | `vitest.config.ts:16–17` | self-alias → `src/animation` source |
| 7 | `.dependency-cruiser.cjs:84` | `LIGHT_FROM = ^src/animation/(?:…24-module allowlist…)\.ts$` |
| 8 | `.dependency-cruiser.cjs:93` | `ENGINE_PATH = ^src/animation/engine/` |
| 9 | `.dependency-cruiser.cjs:171` | rule-2 `from: ^src/animation/internal/` — the value.js-free-leaf law key |
| 10 | `.dependency-cruiser.cjs:132` | rule-1 `from: ^src/` — flatten-SAFE (the only one) |
| 11 | `scripts/gates/structure/index.mjs:91` | `{ exact: "@mkbabb/keyframes.js", to: "src/animation/index.ts" }` (R6 consumer-scan resolver) |
| 12 | `scripts/build/vite/engine-dts-rollup.ts:34,64` | `../../../src/animation/public.ts` + `rootDir: src/animation` (the independent ./engine dts roll-up) |
| 13 | `scripts/gates/surface/*.mjs` | 14 hits: `boundary.mjs` ×7, `published-surface.mjs` ×4, `readme-runs.mjs` ×2, `consume-bundle.mjs` ×1 |

**Import-site blast beyond configs** (grep `src/animation`, line counts):
`test/` **277 lines** across ~100 files (idiom: relative
`../../src/animation/…`, NOT alias), `bench/` **37**, `demo/` **8**,
`scripts/` **18** — ≈340 reference lines total. FOLD-FORWARD's W8 row
independently records a `CT-04 remainder (~8 deep @src/animation imports)`.

**`internal/` rename adds:** depcruise `:171`; the root barrel
`index.ts:50` (`./internal/reduced-motion`) + `public.ts:173`
(`./internal/scheduler`); surface-gate prose `boundary.mjs:126,640`;
and LT-10's own importer census — `leaves` 12, `errors` 11,
`reduced-motion` 10, `animation-id` 4, `binary-search` 2, `scheduler` 2,
`scroll-phases` 2 (~40+ edges).

**LT-10 verified verbatim** (`docs/tranches/V/audit/R2-05-lib-target-tree.md:285–300`):
"KEEP the `internal/` name — REJECT the `shared/` rename. Rationale:
`.dependency-cruiser.cjs` keys the value.js-free-leaf law on
`^src/animation/internal/` … renaming forces a load-bearing config edit
across 40+ importers for a taste preference." The draft's G4 parenthetical
is exactly right, including that the owner's edict supersedes a TASTE
ruling whose config-key consequence survives. LT-16: `PROGRESS.md:131`
(`drag/2d.ts` rename, kept without adjudication).

## B-4. value.js `src/subpaths/*.ts` — the true shape

- **7 files, 163 lines TOTAL, pure named re-export facades**: `color.ts`
  38L, `css.ts` 56L, `easing.ts` 25L, `math.ts` 17L, `quantize.ts` 2L,
  `transform.ts` 23L, `value.ts` 2L. No logic, no renames-for-compat, no
  dual paths — each maps one public export key onto internal zone barrels
  (`../color/index`, `../foundation/math`, …).
- Exports map: 7 keys (`/color /value /css /easing /math /transform
  /quantize`), **no `.` root** — each key → `dist/subpaths/*.js`.
- **62 public type exports across the 7 files — counted exactly 62.**
- **ZERO src-internal importers**: no file under `value.js/src/` imports
  `subpaths/` (sole grep hit is an unrelated SVG-path prose comment,
  `src/transform/path.ts:16`). Consumers: the exports map + **9 test
  files** (surface/stability tests, e.g. `test/v4-c1.test.ts:2–8`,
  `test/easing-export-stability.test.ts`).
- Verdict: these are NOT shims in the owner's "NO SHIMS" sense — they are
  the physical homes of frozen export KEYS (an exports-map implementation).
  One real caveat on "restructure the files freely": value's own D50 ruling
  (`docs/tranches/V/DECISIONS.md:78`) records that api-extractor's dts
  roll-up STACK-OVERFLOWS on implicit directory-index resolution through
  subpath re-exports — empirically bisected; restructure freedom has a
  build-tool boundary (explicit `/index` specifiers required).

## B-5. Tests-isomorphism reality, both repos

- **kf** (`keyframes-v-exec`): displaced `test/` tree whose zone dirs mirror
  12 of 13 `src/animation` zones (`compile engine physics group
  orchestration resolve waapi svg internal ingest scroll presets`; only
  `constants` lacks a dir). Non-mirroring extras: `test/_root`,
  `test/characterization`, `test/support`, `test/demo/*`. **No gate
  enforces it**: `proof:structure` (scripts/gates/structure/index.mjs, 755L)
  is R1–R6 over `src/` birth-scope (`:34–35`) — no isomorphism rule.
- **value.js**: `test/` is FLAT + two subdirs (`parsing/`, `transform/`),
  with DEMO-component tests (`picker-blob-config`, `preview-chips`,
  `slider-announcement`, `status-lamp`, `view-accents`) mixed at the root
  beside library tests — **NOT isomorphic** to `src/` zones (`color/ css/
  foundation/ transform/ …`). **No structure gate exists at all**: scripts
  are dev/build/gh-pages/typecheck/lint/test/test:e2e only.
- Consequence for R14: "kf already conforms" is TRUE at zone grain (with
  the named deltas); "value verifies" UNDERSTATES — value fails today and
  has no gate to extend; the rule must be BUILT there, and kf's gate needs
  a new rule (R7-class), not a re-run.

## Phase-1 verdicts on the assigned draft claims

| claim | verdict | note |
|---|---|---|
| G3 wedge | CONFIRMED, substance | + optionality refinement; + MISSES the value.js production-deps bomb (B-1-NEW) |
| G4 fences | CONFIRMED in every checkable particular | types.ts:45 exact; 3 chase sites incl. `:57` exact; `.`+`./engine`; 44-key mirror (executed); depcruise `:171`; LT-10 verbatim. Census extension: atlas consumes `/engine` (buildMarkAnimation.ts:7) |
| G5 structure-just-settled | CONFIRMED | proof:structure R1–R6 live; R2-05 blueprint + LT rows on disk |
| G7 subpaths | CONFIRMED | 7 keys, no root, 62 types EXACT; facades not shims; + D50 api-extractor caveat |
| G8 kf V state | CONFIRMED | FOLD-FORWARD.md W7/W8/W9/W10/W11/W13 + marks register = exactly 15 numbered rows |
| R3 co-land | SUPPORTED + SHARPENED | must also strip/relocate value's new prod-deps block or the cut self-wedges |
| R4 inherit structure authority | SUPPORTED | LT-10/LT-16 verified; depcruise repoint = 3 anchors (84/93/171), not 1; full census in B-3 |
| R13 shim vs export-home | SUPPORTED | with the D50 build-tool boundary |
| R14 tests-isomorphism | PARTIALLY WRONG as worded | neither repo has the gate; value is non-isomorphic TODAY (build, don't verify) |

---

# PHASE 2 — union with the prior (Opus) report

*(appended after Phase 1 was written; every prior material finding presumed
incorrect and tested against my own evidence or fresh probes)*

**Phase-1 correction (own report, for the record):** kf's non-mirroring test
extras are FIVE dirs, not four — `_root, characterization, demo, fixtures,
support` (`fixtures/` holds no `*.test.ts`, so my find-based census missed
it; `ls test/` shows it). B-5 stands otherwise.

## The Opus report's root defect: a stale-tree pin

Its atlas claims cite `/Users/mkbabb/Programming/atlas` (master @ `1e2b911`)
— the STALE TRAP the charter names. The ACTIVE atlas is
`.p-totality/atlas` @ p/totality `fe9abcf`, v7.0.0. Every Opus finding
downstream of that pin fails on the canonical tree; several of its quoted
lines (bare `from "@mkbabb/value.js"` root imports) are only POSSIBLE on
the stale tree, since value 4.0.0 has no `.` export — internal
corroboration of the contamination.

## OPUS-REFUTED (tested and wrong — 4)

1. **"atlas is REFUTED — 4.0.0 on disk, peers glass ^6/kf ^5.3.5/value
   ^3.1.0, already off-tuple, owes a bump today; G3's tuple claim false."**
   → **WRONG TREE.** ACTIVE atlas (`fe9abcf`) is `@mkbabb/atlas@7.0.0`,
   devDeps EXACT `glass-ui 7.0.0 / keyframes.js 6.0.0 / value.js 4.0.0 /
   pencil-boil 0.9.2`, peers `^7.0.0/^6.0.0/^4.0.0/^0.9.2`. The draft's G3
   tuple claim is TRUE. The entire "atlas inverts the wedge narrative /
   atlas-catch-up wave" amendment collapses. *The most consequential
   refuted item: it would have mis-scoped R3's co-land set.*
2. **"Optional peers ⇒ npm peer WARNING, not an install failure; the
   P127-class wedge severity is over-stated for the glass edge."**
   → **REFUTED BY EXECUTION.** Scratch probe (`scratchpad/peer-probe`,
   npm install --dry-run of `@mkbabb/glass-ui@7.0.0` +
   `@mkbabb/keyframes.js@5.3.5`): `npm error code ERESOLVE … peerOptional
   @mkbabb/keyframes.js@"^6.0.0" from @mkbabb/glass-ui@7.0.0 … Fix the
   upstream dependency conflict, or retry with --force or
   --legacy-peer-deps`. `peerDependenciesMeta.optional` exempts ABSENT
   peers only; a PRESENT-incompatible peer hard-fails the install. Every
   real consumer here co-installs kf+value+glass — the draft's wedge
   severity stands. (Derived casualty: the Opus "kf's exact pin is the ONE
   true hard break" framing dies with items 1+2; the pin FACT survives
   below.)
3. **"G4's chase-site citations mis-labeled: only useScrollTimeline.ts:44
   chases kf's TimingFunction; useCountUp:47 / useScrollLettering take
   value.js's TimingFunction."** → **WRONG TREE.** On the ACTIVE atlas:
   `useCountUp.ts:47` = `import { NumericAnimation, type TimingFunction }
   from "@mkbabb/keyframes.js"`; `useScrollLettering.ts:57` = the
   `type TimingFunction` token inside the kf import block (:53–58); those
   files' value.js imports are `/math` `clamp` (:48, :52) and `/easing`
   `easeOutExpo` — value's callable-easing type consumed in atlas is
   `EasingFunction` (`variant-registers.ts:9`), not a `TimingFunction`.
   The draft's three cites are all correct, `:57` included (B-2).
4. **"Doc-internal inconsistency (three atlas sites / THREE kf chase sites
   / 2 atlas sites) must be reconciled before transmit."** → **NOT an open
   inconsistency — a recorded correction chain.** `PROMPT-RECAP-V.md:130`
   (IN-ATLAS-3) is the OLD census (2 TimingFunction + 1 EasingFunction);
   `PROGRESS.md:143–145` records the atlas ACK + census CORRECTION as
   **IN-ATLAS-5**; `FOLD-FORWARD.md:37` carries the corrected THREE. Ground
   truth (B-2) = exactly three. Residue kept as a FABLE-NEW nit: the draft
   G4 should attribute the THREE to IN-ATLAS-5, not IN-ATLAS-3.

## OPUS-UNVERIFIABLE (excluded from the union product — 0 material)

None material. (The "P127-class" historical label was not re-derived from
its origin ledger, but the wedge MECHANISM it names is proven by execution
— the label rides as prose, not as a finding.)

## UNION-CONFIRMED (in the Opus report AND independently re-derived — 13)

1. glass 7.0.0 peers kf `^6.0.0` + value `^4.0.0` as RANGES (tree + npm).
2. Those peers (+ pencil-boil, vueuse, embla, tw-animate-css) are
   `optional: true` in `peerDependenciesMeta` — the FACT (not Opus's
   severity inference, refuted above).
3. kf pins value EXACTLY `"4.0.0"` (`keyframes-v-exec/package.json`, npm).
4. G4 fence core: `TimingFunction` home/name/signature at
   `constants/types.ts:45`; exports exactly `.` + `./engine`; 44-key
   mirror (I re-proved by EXECUTING `dist/engine/index.js` → 44 keys);
   depcruise leaf law at `.dependency-cruiser.cjs:171`.
5. `proof:structure` real: R1–R6 (`index.mjs:116`), R2-05 grammar, selftest
   proving each rule can pass AND fail.
6. The `src/animation` flatten is a coordinated config-and-graph move, not
   a rule tweak — R4 understates it (my B-3 census is the precise form:
   13 config/gate anchors + ≈340 relative-import lines; Opus's "9 depcruise
   anchors" = 9 grep hits of which 3 are functional regexes + `^src/`
   flatten-safe).
7. `subpaths/*.ts` = pure curated named re-export barrels (no logic, no
   runtime indirection); the KEYS are the frozen surface.
8. R13's own principle PERMITS dissolving the `subpaths/` directory
   (repoint the 7 keys at domain barrels) and that reading matches the
   owner's "code smell supreme" charge — WITH my D50 constraint attached
   (B-4: api-extractor stack-overflow on implicit directory-index through
   subpath re-exports; explicit `/index` specifiers required).
9. kf has NO subpaths/ analog; the kf indictment target is
   `src/animation/internal/` — 9 leaf files (ls-verified).
10. G8: FOLD-FORWARD.md rows W7/W8/W9/W10/W11/W13 + the 15-row §B marks
    register; R10's spec+dispatch ownership reading is faithful to the
    owner verbatim (lines 9, 13).
11. R1 rests on a misread — the verbatim is two composed segments (vision
    lines 3–65; formation governance 66–104, split at the "# Tranche
    formulation" header) — but the phase-labeling remedy is sound.
12. R14 is born-RED on BOTH repos: kf non-strict (5 support dirs + no
    `constants` test dir — a naive isomorphism rule reds), value.js
    non-isomorphic (flat root + `parsing/`+`transform/` only, demo-component
    tests mixed in) AND owns NO structure gate — the rule must be BUILT
    there, not "verified."
13. value.js's working-tree `dependencies` block (`glass ^7.0.0` +
    `kf ^6.0.0`) exists and puts value inside a manifest-level cycle the
    draft omits — Opus flagged the block's existence; my B-1-NEW carries
    the mechanics.

## FABLE-NEW (mine, absent from the Opus report — 9)

1. **The value.js prod-deps detonation mechanics** (B-1-NEW): block born at
   `f2c8f565` (demo-surface adoption mis-homed in `dependencies`;
   contrast kf's devDependency); package publishes `files:[dist]`, not
   private → the block SHIPS with the next cut; under a value-5/kf-7
   co-land it forces DUAL kf cores and DUAL value cores (value 5's
   `kf ^6.0.0` → kf 6 → its exact `value 4.0.0`), breaking the
   one-physical-core law. R3 must add a strip/relocate row.
2. **Published value 4.0.0 is deps-free and peers-free** (git tag
   `v4.0.0` + npm) — today's REGISTRY graph is acyclic; the cycle is
   working-tree-only, hence still preventable at formation.
3. **Atlas consumes the `./engine` subpath**:
   `src/motion/buildMarkAnimation.ts:7` (`MorphSVG` from
   `@mkbabb/keyframes.js/engine`) — the engine fence has a live EXTERNAL
   consumer; absent from the draft's fence pack.
4. **The full ACTIVE-atlas consume census** (B-2): 9 kf import statements /
   8 files; 25 value.js lines (exclusively `/math` + `/easing`); 46
   glass-ui-importing files — the chase ledger R3 asks to name in advance.
5. **IN-ATLAS-5 attribution nit**: the draft's THREE-site census is
   correct but should cite IN-ATLAS-5 (the correction), not IN-ATLAS-3
   (the superseded 2+1 census).
6. **The D50 build-tool boundary on subpath dissolution** (value
   `DECISIONS.md:78`): api-extractor dts roll-up stack-overflows on
   implicit directory-index resolution through subpath re-exports
   (empirically bisected) — any exports-map repoint must use explicit
   `/index` targets and re-verify the packed surface.
7. **Blast-radius census extensions** (B-3): the independent
   `scripts/build/vite/engine-dts-rollup.ts:34,64` roll-up; the structure
   gate's OWN self-alias map (`structure/index.mjs:91`); 14
   `scripts/gates/surface/*` anchors; the dts `entryRoot`/`rootDir`
   lockstep failure mode (12-byte stub); ≈340 relative
   `../../src/animation/…` import lines across test/bench/demo/scripts.
8. **LT-10 rationale verified verbatim** (`R2-05-lib-target-tree.md:285–300`):
   KEEP `internal/`, REJECT `shared/`, expressly because of the depcruise
   key + 40+ importer edits — the draft's G4 parenthetical is exact, and
   the LT-10 importer census (leaves 12, errors 11, reduced-motion 10, …)
   prices the rename.
9. **The empirical peer-conflict probe itself** (scratchpad/peer-probe):
   present-incompatible `peerOptional` ⇒ ERESOLVE hard failure, reproduced
   with the constellation's actual published artifacts — the wedge's
   severity is now measured, not asserted.

## Union product

**FABLE-NEW (9) + UNION-CONFIRMED (13).** The four OPUS-REFUTED items are
excluded and recorded above with their disproofs; zero material
OPUS-UNVERIFIABLE.

**Net verdicts on the assigned draft sections:** G3 CONFIRMED (+ optionality
precision + the value-deps bomb it missed); G4 CONFIRMED in every checkable
particular (cite IN-ATLAS-5); G5 CONFIRMED; G7 CONFIRMED (+ D50 caveat);
G8 CONFIRMED; R3 SUPPORTED + must add the value-deps strip row; R4
SUPPORTED with the full B-3 anchor checklist as gate rows; R13 SUPPORTED
(dissolution-permitted reading, D50-gated); R14 REWORD — born-RED gate on
BOTH repos, build-not-verify on value.
