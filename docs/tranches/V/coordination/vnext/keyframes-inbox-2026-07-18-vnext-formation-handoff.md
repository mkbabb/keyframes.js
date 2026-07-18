# keyframes → value.js — THE V-NEXT FORMATION HANDOFF (2026-07-18)

> From the keyframes.js V orchestrator (Fable) to the forthcoming **value.js-owned
> V-next tranche** (the value.js + keyframes.js + parse-that coupling tranche). This
> packet is the adjudicated factual foundation + recommendation set, hardened by TWO
> full thrice panels (eight fresh Fable skeptic seats + two Fable adjudicator seats,
> zero Opus — owner ruling, addendum 5). The companion letter
> `keyframes-inbox-2026-07-18-vnext-ingestion-prompt.md` is the ingestion prompt the
> formation session executes; THIS packet is its evidence base.
>
> **G0′ tree pins (all claims herein verified against these exact trees):**
> - value.js `db77dbd8` (branch `tranche-u`, v4.0.0)
> - keyframes.js = **keyframes-v-exec** `c2c8915f` (branch `master`, v6.0.0, pushed, CI green)
> - glass-ui `7.0.0` (npm; HEAD `4ab12128` per the Q060 glass-live packet)
> - atlas ACTIVE = `/Users/mkbabb/Programming/.p-totality/atlas`, branch `p/totality`
>   (v7.0.0, glass7+kf6+value4; HEAD `fe9abcf`); its DOCS half lives at
>   `sci-report/atlas`. The standalone `/Users/mkbabb/Programming/atlas` @ `master`
>   (v4.0.0) is a STALE trap — one panel seat inverted its conclusions by reading it.
>   **No cross-repo claim is admissible without a pinned tree+HEAD.**

---

## §1 — keyframes.js state (what the directing tranche inherits)

- **Tranche V CLOSED-BY-FOLD 2026-07-18.** Library settlement landed (proof:structure
  R1–R6 standing, six module carves, fences byte-frozen); Glass 7.0.0 consumed exact-pin
  on immutable kf 6.0.0 (demo renders 14/14 on real registry glass; FAM-01 cured — full
  check/test honest, 1195 tests); deploy of record green (keyframes.babb.dev serves
  `index-9E-8lial.js`).
- **Fold-forward:** `keyframes.js/docs/tranches/V/FOLD-FORWARD.md` — W7/W8 (demo
  settlement), W9-landing, W10-remainder, W11 (UI corpus), W13 (close ceremony) + the
  15-row marks register (incl. glass §7 defects with live kf exposure) + the
  owner-checkout reconciliation (safe, pending). The kf demo/UI corpus is
  **kf-successor-owned**; this tranche directs kf **library** items only (§8 protocol).
- **Consume-edge truth:** kf pins value EXACTLY `"4.0.0"` (no caret — the measured-edge
  law), glass exactly `"7.0.0"` (demo-only devDependency); registry-only, one physical
  core. kf 6.0.0 is immutable (never republish).

## §2 — The frozen fence pack (transmit verbatim into every kf-touching wave)

1. **`TimingFunction = (t: number) => number`** — home/name/signature frozen at
   `src/animation/constants/types.ts:45`. THREE chase sites, ALL kf-origin, verified on
   the ACTIVE `p/totality` atlas: `platform/composables/useCountUp.ts:47`,
   `motion/useScrollLettering.ts:57`, `motion/useScrollTimeline.ts:44`. (The "2-of-3
   value.js" figure circulating in one census was a stale-`master` read — dead. ONE
   census: three kf-chase sites.)
2. **Package exports exactly `.` + `./engine`**, with the 44-key built engine runtime
   mirror re-verified after any structural move.
3. **kf 6.0.0 / value 4.0.0 immutable**; all breaking work accumulates behind the §5
   co-land boundary.
4. **The depcruise value.js-free-leaf law** is keyed on `^src/animation/internal/`
   (`.dependency-cruiser.cjs:171`, 9 `src/animation` anchors total). Any `internal/`
   rename or `src/animation`→`src` flatten MUST move the config keys in the same change
   or the boundary silently vacuous-greens (full checklist in R4′).
5. `scenes/` exemplar fence; `docs/precepts/` read-only.

## §3 — The parser archaeology (adjudicated; do NOT re-litigate blind)

**Chronology (per-file, adjudicated — value-side rows both-panel-verified; kf-side
rows via skeptic K, panel-2-adjudicated):**

- kf parsimmon era (≤ v0.9.97, 2024-07 baseline) → **modernization `54424ee0`**
  (2026-02-25): kf exported ALL parsing to value.js — and deleted its own 903-LOC
  gamut-bearing `color/utils.ts` in the same era (see §4).
- value `470818c9` (2026-02-25): parsimmon → **vendored parse-that 0.6.0** (NOT a
  byte-scanner migration — one seat mis-labeled this).
- The pre-v4 tree was a **parse-that-combinator + `balancedText` byte-scanner HYBRID,
  and it was MEASURED** (`src/parsing/stylesheet/stylesheet.ts:84-114` wired
  `balancedText`; `src/parsing/utils.ts` held the only `charCodeAt` sites; benches
  `bench/css-parse-perf.mjs` + `bench/parser-namelookup.mjs`).
- **The v4 cut `164343c1`** ("retire pre-v4 src trees", 2026-07-17) deleted all of
  `src/parsing/` AND both benches, replacing it with the **UNMEASURED regex rewrite**:

| File (value HEAD) | LOC | Regex sites | Scanner code | Verdict |
|---|---|---|---|---|
| `src/css/grammar.ts` | 483 | **25** | 0 | PURE REGEX — abrogation target |
| `src/css/stylesheet.ts` | 899 | 12 inline | char-index loops only | no scanner, no `balancedText` — abrogation target |
| `src/css/timeline.ts` | 124 | 9 | 0 | abrogation target |
| `src/css/syntax.ts` | 101 | 1 | 0 | abrogation target |
| `src/value.ts` / `quantize.ts` / `easing.ts` | — | 0 | 0 | NOT parsers — out of scope |

- **Nothing at HEAD satisfies a scanner ideal** — the measured predecessor is deleted.
  The owner's "ill-defined and slow parser" names the residue of a genuine loss.
- **"tape" is inadmissible as new evidence**: it was a Rust bbnf-lang runtime, deleted
  as SLOWER than direct-to-struct (bbnf-lang GESTALT.md:11,48). The real parse-that TS
  lever is **mutable-ParserState / zero-alloc combinators** (perf-optimization-ts.md:55,335 —
  "~4,000 heap objects per parse" eliminated). The D7 SpanParser V8 falsification
  (−10..−14%) is REAL but rules out only runtime-switch dispatch.
- **Where the CSS parsing suite lives (the owner's direct question): entirely in
  value.js `/css`.** kf consumes `parseStylesheet`×9, `collectStyleRules`×6,
  `collectAnimationOptions`×7 (disk-recounted at `c2c8915f`); the ParseIssue union
  carries `keyframe_selector_invalid`/`animation_option_invalid`/`timeline_option_invalid`.
  **kf does essentially NO text parsing**: its ONLY parsing residual is the CSS-native
  easing name-table re-encoded as classifier regex at `src/animation/easing.ts:30,39`,
  duplicating value's `parseTimingFunction` (grammar.ts:436) — with an emit-side twin
  of the same table at `easing-serialize.ts:20` (a duplication row, not a parser).
  `scroll/grammar.ts` has ZERO productions (self-documented
  pass-through; it owns SERIALIZE, not parse); `parseAnimationCSS.ts` delegates;
  `compile/selector.ts` wraps value's `parseKeyframeSelector`. The split-parsing
  architecture the prompt asks about is ALREADY the architecture — the tranche's job is
  the census LOCK (R5′) plus the regex-abrogation successor (R2′), not a migration.

## §4 — The DOUBLE GAMUT LOSS + the v4 silent drops (RESTORE class)

- **Loss #1 (kf, modernization):** kf deleted its 903-LOC gamut/oklab subsystem
  delegating to value. RIGHTLY-DROPPED at kf level (separation of concerns) — the
  wound was value not holding it.
- **Loss #2 (value, v4):** the raytrace §13.2 oracle (shipped `60bb64e9`), deltaEOK /
  deltaE2000 / deltaEITP, `sampleColorRamp`/`mixColorsN`, the into-family
  (`color2Into` `23d1a91e`, `sampleGamutBoundaryInto` `07760131`) — ALL grep=0 at
  value HEAD. `mapColorToGamut` (operations.ts:133-176) is a hue-preserving 32-iter
  chroma reduction: NO deltaEOK, NO clip-vs-reduced MINDE, NO L-endpoint
  short-circuits — a §13.2 SIMPLIFICATION a strict WPT suite would fail.
- **Net: NOBODY in the constellation owns a reference gamut oracle.** The owner's
  named "major loss" is a two-sided extinction.
- **Downstream scar tissue:** kf's `compile/emit/backward/color.ts` re-derives a LOCAL
  oklab conversion + ΔE threshold because value's primitives are gone; the docstrings
  at `backward.ts:30,47` still name value's dropped `sampleColorRamp`/`deltaEOK` — a
  stale fiction that the RESTORE ledger (§6) makes true again.
- **~15 capabilities dropped SILENTLY at v4** (zero kill-site documentation;
  `raytrace`/`okhsl`/`sampleColorRamp`/`mixColorsN`/`deltaE2000` = 0 hits in value's
  own `docs/tranches/V/**`). Root cause: a green-consumer-compile gate is structurally
  blind to capabilities without first-party consumers at cut time — exactly the rule
  the owner's prompt voids ("consumer count is NOT enough"). → the H8′ standing law.

## §5 — Wedge pricing (breaking changes are allowed — price them honestly)

- The ONE hard install break a value major forces: **kf's EXACT pin `"4.0.0"`**.
- glass-ui 7.0.0 marks BOTH kf and value peers `{optional: true}` → a major against
  glass is a peer WARNING, not a break. Do not price optional peers as hard edges.
- value.js's OWN manifest declares `dependencies: glass ^7.0.0 + kf ^6.0.0` — a
  manifest-level value→kf→value cycle that must bump in lockstep with any value major
  (and deserves its own adjudication row: why does a leaf value library
  runtime-declare its consumers?).
- The ACTIVE atlas (p/totality v7.0.0) sits behind `^4.0.0`/`^6.0.0` ranges — a
  value/kf major breaks it → co-land. The STALE published atlas 4.0.0 owes an
  independent catch-up regardless.
- Protocol (R3′): ONE coordinated constellation cut (value 5 / kf 7 / peer bumps /
  atlas successor), chase-site ledgers named in advance; until that boundary, all
  restructures stay internal-only behind frozen surfaces.

## §6 — THE RESTORE LEDGER (priority-ordered; gamut lives in VALUE, kf consumes)

| # | Restore | Shape | Lands in | Owner |
|---|---|---|---|---|
| **R1** | §13.2 MINDE gamut map + raytrace reference twin (owner seed #1) | restore-MODERNIZED: `mapColorToGamut` gains deltaEOK + clip-vs-reduced (MINDE) + L≥1→white/L≤0→black short-circuit; raytrace as WPT-gated exact oracle | `src/color/gamut.ts` + `operations.ts` | **value** |
| **R2** | `deltaEOK` / `deltaE2000` (Sharma) / `deltaEITP` + ICtCp/Jzazbz explicit | restore-as-was (exact vectors survive in R docs) | `src/color/difference.ts` — kf drops its local ΔE | **value** |
| **R3** | zero-alloc into-variants (owner seed #2) — EXTEND SCI-1 | add `color2Into`, `sampleGamutBoundaryInto`, **`mapColorToGamutInto`/`safeAccentColorInto`** (the 10³–10⁴-alloc hot paths SCI-1's 2 verbs miss) | `src/color/operations.ts` | **value** |
| **R4** | N-stop ramp `sampleColorRamp`/`mixColorsN`/`sampleColorRampAt` | restore-modernized (SoA-backed); kf `compile/emit/backward/color.ts` consumes it → kills the local duplication + un-stales backward.ts:30,47 | `src/color/ramp.ts` | **value** |
| R5 | SoA packed-color-channel fold | re-litigate the 3.0.0 consumer-count excision under the zero-alloc mandate | `src/color/` | **value** |
| R6 | OKHSL/OKHSV picker spaces | restore-as-was | `src/color/operations.ts` | **value** |
| R7 | `evaluateMathFunction` (calc EVALUATOR — parse survives, evaluate gone) | restore-modernized over the calc AST | `src/css/` | **value** |
| R8 | WCAG `contrast-color()` + `wcagContrastRatio`/`wcagRelativeLuminance` | restore-as-was (CSS Color 5) | `src/color/operations.ts` | **value** |
| R9 | gamut-boundary contour samplers | restore IFF the demo gamut-viz is rebuilt on value | `src/color/gamut.ts` | **value** |
| R10 | `spring()` CSS easing parse/lowering | restore in grammar; DECIDE value-owns vs kf-physics-owns | grammar.ts or kf `easing.ts` | value / kf |
| R11 (low) | CSS filter-chain recolor solver | restore only on a named consumer | `src/color/filter.ts` | **value** |

> SCI-1 is already **DECIDED SHIP-4.1.x** (value DECISIONS.md:82 D54) — the registry
> inherits the decision; R3 EXTENDS it, never re-opens it.

## §7 — Zone disposition tables (the overfit adjudication — panel-2 verified)

### 7a. keyframes.js (import-graph-verified; OWNER-DECISION ≠ prune)

| Zone / sub-module | Verdict | Why (one line) |
|---|---|---|
| engine core | **KEEP-EARNED** | demo `KeyframesAnimation`×26, `loadAnimationEngine`×12 |
| engine `play-lifecycle/` 5-file atomization | **OVERFIT-SHRINK** | goldilocks-recombine (baseline ran it inline ~250 LOC) |
| compile/ forward | **KEEP-EARNED** | feeds consumed `compileToCSS`/`compileToEntry` |
| compile/emit/backward (round-trip) | **OVERFIT-SHRINK (differentiator-preserving)** | KEEP compileToCSS+compileToEntry+CC-3 honest-refusal (TWO demo verbs; the "keyframes.ts run backward" differentiator); TRIM compileToViewTransition runtime + dead compileToString/formatKeyframes |
| group/ core | **KEEP-EARNED** | demo `AnimationGroup`×11 |
| group/ composite-SoA | **OVERFIT** | ≥1.2×@K=8 bit-identical only |
| physics/ | **KEEP-EARNED** | SpringProgress×8, RAFPlayback×4, NumericAnimation×3 |
| physics/spring/css `linear()` emit | **OVERFIT** | platform-native `linear()` |
| resolve/ | **KEEP-EARNED** | calc/container-query/env — capability the baseline lacked |
| presets/ | **KEEP-EARNED** | clean unbroken lineage 36→45 |
| **waapi/** | **OWNER-DECISION** | ENGINE-WIRED (`playViaWAAPI` play strategy, group lowering, scroll dispatch) — NOT dead; but product-dormant (demo never sets `useWAAPI`) + platform-redundant + E.W9 deliberate KEEP on record |
| scroll/ serialize | **KEEP-EARNED** | compiler-wired (backward.ts:68 — the round-trip EMIT half) |
| scroll/ `ScrollScene`/`parseScrollCSS` rAF sampler | **OWNER-DECISION** | native scroll-timeline; 0 demo; E.W9 deliberate-reimpl class |
| svg/ motion-path + draw-svg | **PRUNE** | native `offset-path` / trivial dashoffset; 0 consumers |
| svg/ morph-svg | **OWNER-DECISION** | no native analog but 0 demo, speculative birth; consumes value `PathGeometry` |
| ingest/ | **PRUNE-CANDIDATE** | 0 demo/internal, speculative, no deliberate-keep record (reads live CSSOM — owner may reprieve) |
| orchestration/ stagger, sequence, view-transition, decay | **KEEP-EARNED** | demo-consumed; view-transition also engine-wired |
| orchestration/ flip, split-text | **PRUNE-CANDIDATE** | 0 internal + 0 demo |
| orchestration/ drag | **PRUNE-CANDIDATE** | demo refs are COMMENT-ONLY (never imported) |
| orchestration/ timeline (JS ScrollTimeline sampler) | **OWNER-DECISION** | E.W9 ADMITTED deliberate KEEP alongside native |
| internal/ | **LOST-VIRTUE-RESTORE (dissolve/colocate)** | owner-named ("I don't like this at all"); move the depcruise key with it |
| load-engine LIGHT/HEAVY apparatus | **OWNER-DECISION** | ceremonial (demo always calls `loadAnimationEngine`) |
| `src/animation/` lone top-level | **LOST-VIRTUE-RESTORE (flatten to `src/`)** | owner's exact objection; R4′ checklist governs |

> **Zone-orphaned tests bind to zone verdicts** (scroll 2/800 + svg 3/807 + ingest
> 3/1027 + waapi 3/737 + orchestration flip/split-text/timeline ≈ 3.5–4.3k LOC):
> KEEP-ONLY-IF-THE-ZONE-SURVIVES; never leave orphaned-green.
>
> **The honest overfit split (the owner's "nearly all?" answered): NO — roughly half.**
> Core ~10.2k LOC is KEEP-EARNED; ~9.8k of post-4.0 zones divide into PRUNE /
> PRUNE-CANDIDATE / OWNER-DECISION per this table (LOC totals = the H1 census, whose
> dispositions panel-2 adjudicated). Gates/tests are ~90% honest (§8).

### 7b. value.js

| Zone | Verdict | Why |
|---|---|---|
| `css/*` | **KEEP-EARNED (surface) / REGEX-ABROGATION (parser)** | densely kf-consumed; the parser is the unmeasured regex rewrite (§3) |
| `color/*` | **KEEP-EARNED + RESTORE** | core SHRANK 2117→891 while spaces grew; gamut/ΔE/ramp unjustly dropped (§4/§6) |
| `foundation/math` | **KEEP-EARNED** | kf `clamp`×26 — heaviest consumer |
| `easing.ts` | **KEEP-EARNED** | kf presets + fns |
| `value.ts` (`CssValue`) | **KEEP** + lost-virtue note | typed/immutable win; lost the one-obvious `ValueUnit` cohesion |
| `transform/path.ts` (`PathGeometry`) | **KEEP-EARNED (watch)** | kf ×2 — but only via the OWNER-DECISION svg/morph zone (transitive coupling) |
| **`transform/decompose.ts`** | **SUPERFLUOUS-PRUNE** | 609 LOC, ZERO real consumers (kf's `/transform` use is `PathGeometry` from `path.ts`); platform `DOMMatrix` |
| **`quantize.ts`** | **SUPERFLUOUS-PRUNE from public API** (demote into the value demo) | 0 kf; demo-only image-extract feature; drop the `./quantize` key |
| **`subpaths/` dir** | **DISSOLVE** | pure re-exports; owner: "code smell supreme, NO SHIMS" — repoint the 6 consumed KEYS at module indexes (keys frozen; widening ≤1 type `ColorFactory`); `./transform` needs a real `transform/index.ts` (path-only once decompose dies); blast radius = exports map + vite.config.ts:216-235 dts entries + self-alias set + dts rollup; nothing internal imports subpaths/ |
| `css/…collectDeclarations` | **PRUNE-CANDIDATE** | 0 kf consumers (every sibling collect*/parse* IS consumed) |
| exotic spaces (jzazbz/ictcp/rec2020/prophoto/a98/p3) | **KEEP** | owner mandates all spaces; demo-earned |
| **e2e/ fleet (13.4k LOC / 71 specs)** | **ABROGATE for value.js** | 0/193 test blocks import the library; already CI-unwired at HEAD; survivor ~500 LOC (page-load smoke + ≤3 named-catch oracles o16-cascade-clobber / color-space-liveness / o12-backing-store + 1 axe battery) relocates to the DEMO tranche, NOT value's gate surface |

> **The owner's "what of value.js?" answered: the library is the OPPOSITE of overfit —
> it shrank while coverage grew.** Its diseases are the LOSSES (§4) and the regex
> parser (§3). The contrivance lives in the 57k apparatus around the 4.6k library:
> e2e (verdict above), the 31k demo (tranche-divined restructure per addendum 3), the
> unexamined 13k `api/` backend (a formation lane).

## §8 — Gates & tests program (kf ~90% honest; value needs a gate BORN, not extended)

- **kf minimal honest gate set (seven mechanisms):** `check:lib && build:lib &&
  test:lib && proof:publish` (+ proof:structure via check, + lint, + release:changelog
  on tag). KEEP-EARNED: proof:publish (actuated negatives), proof:structure (47
  recorded catches + `--selftest`), release:changelog.
- **Subtraction:** land R2-07's 9 unshipped prunes (taxonomy.json 654L, zero-alloc gc
  arm, group-snapshot it.fails, 2 orphan `.measure.test.ts`, 2 orphan `.mjs`,
  probe-webkit) — **still on master, verified** — plus PRUNE
  `test/engine/boundary-cohesion.test.ts` (pure source-text assertion; duplicates lint
  + proof:structure R6).
- **Wiring:** land the 4 staged MRs (MR1 pageerror-key, MR2 5-oracle nightly, MR3
  dispatch gate, MR4 test:demo→gates); relabel `proof:owner-golden` →
  `review:owner-golden` (its enforcing leg runs in zero workflows).
- **value.js:** NO structure gate exists (no `scripts/gates`, no `proof:*`) and the
  test tree is non-isomorphic (`test/parsing` has no `src/parsing` counterpart) —
  tests-isomorphism + structure gates are **born-RED CREATE waves** on value; kf's
  isomorphism pass needs a support-dir allowlist ({_root, characterization, demo,
  fixtures, support}) + types-only-src exemption — "kf already conforms" over-claims.
- **The H8′ standing law (ratified):** (1) a capability-preservation gate that
  born-REDs on any dropped public symbol across a major; (2) every major-cut wave spec
  carries a **DROPS section** classifying every dropped symbol
  RIGHTLY/UNJUSTLY/UNCLEAR with a one-line tombstone; (3) the surface-diff check FAILS
  on any public deletion absent from that section. Proof of need: v4's ~15 silent
  color/parser deletions.

## §9 — The final recommendation set (prompt improvements, merged R1′–R15+H1′–H8′)

1. **R1′ Phase labels.** The prompt composes a VISION segment ("majority on direct
   code implementation… visual verification" = the formed tranche's execution
   character) and a FORMATION block ("NOT an implementation phase… no source edits" =
   this deliverable). Label each edict's phase so no formation agent treats the vision
   as a licence to edit.
2. **R2′ Three-way parser bench, greenfield.** Born-RED baseline of the extant regex
   parser (MB/s + allocs via V8 heap-sampling on the real CSS corpus — NEW infra, no
   bench survives on disk). Contest: (i) table/data-driven cleanup (also cures the
   `grammar.ts:175-255` `parseFunctionalColor` 8-branch if-ladder — readability is a
   SEPARATE, table-solvable axis so parse-that cannot ride in on "unreadable"),
   (ii) resurrected byte-scanner reference, (iii) parse-that mutable-ParserState
   zero-alloc prototype. `tape` EXCLUDED (§3). Adoption is owner-ratified on measured
   numbers. The regex-abrogation ruling condemns the four named css/ files.
3. **R3′ Co-land protocol** (§5) — one constellation cut; chase-site ledgers in
   advance; internal-only restructures until the boundary.
4. **R4′ The flatten is a coordinated config-and-graph move**, born-RED at every
   anchor: tsconfig self-alias (`"@mkbabb/keyframes.js": ["./src/animation/index.ts"]`)
   + `@src/*`; vite entries (:41/:156, `engine/index` named entry → `dist/engine/index.js`);
   vitest alias; all 9 `.dependency-cruiser.cjs` anchors (incl. the `internal/`
   boundary key :171); the structure-gate scope + R6 `@src/*` resolver; dts rollup
   emit; post-move 44-key mirror re-verify + depcruise `--selftest`.
   **Governance (G5, reaffirmed):** kf's structure was JUST settled (V.B — the
   ratified LT blueprint + proof:structure R1–R6). Every kf structure wave this
   tranche directs must AMEND-THE-BLUEPRINT + EXTEND-THE-GATE — never stand up a
   parallel second structure authority — and must NAME the superseded rulings
   explicitly (LT-10, which kept `internal/` for the depcruise-leaf law the owner's
   new edict now supersedes; LT-16): refutation amends the charter, silence
   re-litigates it.
5. **R5′ The parsing boundary is an ACHIEVED census — LOCK it** (zero productions on
   both sides). The one live kf row: the easing name-table regex ×3 (§3) — consume
   `parseTimingFunction` as oracle OR state the hot-path perf reason.
6. **R6′ DECIDE the gamut policy**: adopt §13.2 MINDE (restore path, §6 R1) OR ratify
   the current hue-preserving reduction as a deliberate deviation and WPT-gate only
   conforming paths. WPT Color-4 vectors = NEW gate infra. Priority zero-alloc
   targets: `mapColorToGamutInto` + `safeAccentColorInto` (the true hot paths).
7. **R7′+H8′ Capability-preservation gate + DROPS-section law** (§8). The
   defect-family register's PRIMARY family is v4-capability-LOSS; fold the
   mixColors/parseCSSValue ad-hoc chain as instances under it.
8. **R8′ Ingest the standing letters as registry rows** — SCI-1 as DECIDED
   SHIP-4.1.x; D-GAP-6 DECLINE-accepted (kf adopts `sampleBezier` only if a future 4.1
   ships it); the WL **§D name-a-code re-open path** (a named ParseIssue code
   re-opens the §D confirm-shipped verdict); RF-18 census-split ENACTED.
9. **R9 Bound the thrice loop**: dynamic cluster batches; convergence = two
   consecutive clean passes; ≤3 iterations per cluster before owner escalation; both
   skeptics FRESH-context Fable; adjudicator PROVES with own evidence, never
   vote-counts.
10. **R10 Ownership protocol**: this tranche DIRECTS kf library items as SPECS +
    bounded dispatches into kf's coordination inbox; the kf successor implements. If
    direct cross-repo EDITS are intended at implementation, that needs an explicit
    owner grant amending the sibling read-only law.
11. **R11 Routing + batches (amended by addendum 5)**: ALL audit/panel/critique/design
    seats are Fable, declared explicitly — ZERO Opus in formation. The prompt's "Opus
    to take the workflow fanout" line is SUPERSEDED for audit-class work; Opus is at
    most pure mechanical implementation sweeps, per-tranche owner-ratified. Fable
    panels ≤3 concurrent; general fanout batches 5-6.
12. **R12 Missing lenses**: malformed-input fuzzing for the parser; ONE
    allocation-measurement methodology fleet-wide; DAG tooling = depcruise-derived
    (don't hand-draw what a tool emits); plus the `api/` backend lane (§7b).
13. **R13′+H2′ Dissolve `subpaths/`** with the measured blast radius (§7b row).
14. **R14′ Tests-isomorphism = born-RED waves on BOTH repos** (§8).
15. **R15 The ingestion set** (§10).
16. **H3′ Adopt the kf zone disposition table** (§7a) — OWNER-DECISION rows go to the
    owner at formation; they are NOT unilateral prunes (three carry recorded E.W9
    deliberate-KEEP rulings; refutation amends the charter, silence re-litigates it).
17. **H4′ Backward-emit**: differentiator-preserving shrink (§7a row).
18. **H5′ The RESTORE ledger** (§6) is first-class formation input — the owner's two
    named losses (gamut, parser) plus the panel's discovered family.
19. **H6′ e2e abrogation + the gates program** (§7b/§8).
20. **H7′ value dispositions**: prune decompose, demote quantize (§7b).
21. **NEW — CSS-spec-completeness census (the owner's "total and complete
    specification coverage" ask needs an OWNING WAVE, not just the gamut slice):** a
    born-RED coverage census of value's grammar/color/timeline surfaces against the
    July-2026 stabilized spec set (CSS Color 4/5, HDR, the stabilized
    chrome-experimental features) — gaps become spec-coverage waves alongside the §6
    restores.
22. **NEW — the structural-conventions pack (three owner edicts elevated from the
    verbatim to standing rules for every restructure wave):** (a) module-name
    stripping — grouped files drop the module prefix (`easing-option`→`option`,
    `easing-config`→`config`); (b) glass-ui is the REFERENCE MODEL for flattening +
    component structuring idioms; (c) composables/styles colocation — only truly
    module/global composables live in a `composables/` dir, all else colocates
    (recursively, sub-components included).

## §10 — The ingestion set (read before forming)

1. THIS packet + the companion ingestion prompt (same dir).
2. kf `docs/tranches/V/FOLD-FORWARD.md` (+ `PROGRESS.md`, `OWNER-DECISIONS.md`,
   `coordination/INBOUND-LEDGER.md`) @ `c2c8915f`.
3. value V′ corpus: `DECISIONS.md` (D54/SCI-1), `WL` verdict letters, the
   formation-exchange + wl-verdicts letters (O-2/O-4/O-5), CARRY-LEDGER.
4. The Q060 glass packet (`glass-outbound-2026-07-17-q060-glass7-live.md`) + glass §7
   defect rows (kf marks register carries the live-exposure map).
5. Read-only archaeology grants: kf/value/parse-that/bbnf-lang git histories +
   `parse-that/docs/perf-optimization-ts.md`, `bbnf-lang/docs/GESTALT.md`.
6. The thrice-panel corpus (evidence trail): 8 skeptic reports + 2 adjudications —
   mirrored kf-side at `docs/tranches/V/coordination/` (vnext files).

## §11 — kf asks (none new)

Standing only: sampleBezier conditional (D-GAP-6, closed-DECLINE with the 4.1
condition); no easing gap (FAM-14 negative result recorded). The fence pack (§2) and
the R10 protocol are the whole ask surface.

— the keyframes.js V orchestrator (Fable), 2026-07-18. All nine+ panel seats Fable;
zero Opus (owner ruling, addendum 5).
