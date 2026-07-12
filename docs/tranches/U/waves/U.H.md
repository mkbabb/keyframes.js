# U.H — THE TEST SUBSTRATE (FIRST)

> **Status: DEVELOPMENT. Implementation NOT authorized.** Docs-only wave specs.
>
> **Charter sentence (U.md §2).** Stand up the restructure-safe characterization tier
> BEFORE any transposition — goldening OBSERVABLE behavior imported only through the
> two package "ins" (`.`/`index.ts` LIGHT + `./engine`/`public.ts` HEAVY) and the demo
> scene public entries — then split vitest into `library`/`demo` projects (deleting the
> glass-ui stub), ratify the `test/<area>` mirror as a gate-checked invariant (OD-U7),
> re-home the `*.measure.test.ts` artifacts under `bench/`, delete/re-charter the
> value.js-testing `easing.test.ts`, and collapse the 13 thin `vitest run <file>`
> proof-alias keys into vitest project/tag selectors — so a file MOVE reds nothing and a
> behavior DRIFT reds loudly.
>
> **Provenance lanes:** 10 (test-suite-audit — F1–F8 + the bench cross-cut), 26
> (design-colocation-idiom-vue — Finding 5 / RULING R5, the mirror-survives ruling and
> the `test/demo/<area>` regroup).
>
> **Ring-fences honored (U.md §4):** the two package "ins" remain the only entries and
> U.H LOCKS their observable behavior before any move (fence 5); the LIGHT/HEAVY
> boundary is honored — the net imports the LIGHT surface through `index.ts` and the
> HEAVY surface through `public.ts`/`./engine`, never crossing the static/dynamic seam
> (fence 2); NET GATE COUNT ONLY GOES DOWN — U.H adds ZERO new standalone `proof-*.mjs`
> (the mirror invariant lands as a vitest test, the 13 aliases collapse into ONE project
> run), and removes ≥14 package.json keys (§6 anti-sprawl). DEVELOPMENT ONLY.

---

## §H.0 — The measured ground truth (read @ 5.2.0, `tranche-u-dev`)

| Fact | Value | Source (verified) |
|---|---|---|
| `*.test.ts` files / vitest tests | **113 / 1052** | lane 10 (CLAUDE.md-consistent) |
| `test/**` top dirs | 13 zone mirrors + `demo/` + `fixtures/`+`stubs/`+`support/` | `find test -maxdepth 1 -type d` |
| vitest pools | **ONE** — `include: ["test/**/*.test.ts", "test/**/*.measure.test.ts"]`, jsdom | `vitest.config.ts:44-46` |
| glass-ui stub | `test/stubs/glass-ui-motion-core.ts` aliased for the whole suite | `vitest.config.ts:35-38` |
| demo tests inside the library gate | **24** (`test/demo/*.test.ts`, flat) | `ls test/demo/*.test.ts` / lane 10 F2 |
| glass-ui availability | peer `~4.0.0`, **installed 4.0.1** in `node_modules` | `package.json:297`; `node_modules/@mkbabb/glass-ui` |
| `easing.test.ts` | 4 tests, imports ONLY `@mkbabb/value.js` — zero kf code | `test/easing/easing.test.ts:1-6` / lane 10 F3 |
| `*.measure.test.ts` in the correctness glob | **2** (`sync-step`, `d3-changed-keys`) | `find test -name '*.measure.test.ts'` / lane 10 F5 |
| thin `vitest run <file>` proof-alias keys | **13** (all confirmed present) | `package.json` grep (§H.2 table) / lane 10 F6 |
| the consume-edge model that IS correct | `test/compile/valuejs-contract.test.ts` | lane 10 F3 (the contrast) |
| no test tier imports through the two "ins" | confirmed — every test deep-imports `../../src/animation/<zone>/<file>` | lane 10 F7 |

The one sentence (lane 10): **the suite's behavioral core is sound but WELDED to the
source SHAPE the grand transposition will dissolve** — so a colocation move reds the
suite for cosmetic reasons while no stable-surface net catches the behavior that
matters. U.H builds that net FIRST, then peels the shape-coupling.

---

## §H.1 — The wave table

| # | Title | Substance | Size | Gate / oracle | Edges |
|---|---|---|---|---|---|
| **U.H1** | THE CHARACTERIZATION NET (FIRST — before any move) | Author `test/characterization/` importing ONLY through the two "ins" + demo scene public entries; golden OBSERVABLE behavior (compiled-CSS bytes via `compileToCSS`; sampled frame values over a fixed clock; the six demo scenes mount→play→switch). No deep source paths. | M | IS the oracle — `npm test` runs it; it stays green across every U.B/U.C move and reds only on behavior drift (one-shot: move a file, net green) | ROOT of the DAG (U.md §3 "BEFORE any move"); precedes ALL U.B/U.C/U.D moves; needed by U.A1 |
| **U.H2** | The vitest `library`/`demo` project split — glass-ui stub DELETED | Two `test.projects`: `library` globs `test/<zone>/**` + `test/characterization/**`, glass-ui never in scope; `demo` globs `test/demo/**`, resolves the REAL installed `@mkbabb/glass-ui`. `git rm test/stubs/glass-ui-motion-core.ts` + the alias. | M | `npm test --project=library` green with ZERO demo files + ZERO glass-ui in scope; `--project=demo` green against real glass-ui | U.H1; co-sched **U.A2** (surviving value tests home in `library`) + **U.A6** (ci.yml runs the two projects, not 13 steps); alias re-point rides **U.B1** (`@→shared`) |
| **U.H3** | The `test/<area>` mirror ratified (OD-U7) + gate-checked; `test/demo/` regrouped | Ratify R5/OD-U7 (tests MIRROR, never colocate). Regroup flat `test/demo/*` → `test/demo/{scenes,instrument,state,app}/`. Give root files (`easing.ts`/`validate.ts`/`index.ts`/`public.ts`) a `test/_root/` home. The mirror lands as a VITEST TEST (`test/support/mirror.test.ts`), NOT a new `proof-*.mjs`. | M | `test/support/mirror.test.ts` under `npm test` — every library `test/` dir maps to a `src/animation/` zone-or-root and every demo test's primary import resolves into its filed area | U.H2 (projects exist); **OD-U7 ruling** (carve-out must be owner-blessed); co-sched **U.B** (demo moves re-file the mirrored tests WITH the move) |
| **U.H4** | The `*.measure.test.ts` artifacts re-homed under `bench/` | Drop `test/**/*.measure.test.ts` from the vitest `include`; re-home `sync-step.measure` beside `sync-step.bench.ts` and `d3-changed-keys.measure` under `bench/` (on-demand, off the correctness pass). | S | the vitest `include` no longer matches `*.measure`; `npm test` runs only invariants | U.H2 (the split settles the include globs); feeds **U.D2** (the perf harness owns the throughput floor these probes fed) |
| **U.H5** | `test/easing/easing.test.ts` DELETED; load-bearing value.js behavior re-chartered as a named consume-edge contract | `git rm test/easing/easing.test.ts` (it tests `@mkbabb/value.js`, not kf — dead coverage). Any value.js behavior kf truly relies on is pinned beside `test/compile/valuejs-contract.test.ts` as a named consume-edge contract. Relocate `resolve-easing.test.ts` (it DOES test `src/animation/easing.ts`) to the `test/_root/` home (`easing.ts` is a root file, not a zone). | S | `npm test` green without `easing.test.ts`; the mirror gate (U.H3) no longer flags `test/easing/` as a false zone | U.H3 (`_root/` home exists); constellation ring-fence 1 (consume-edge ONLY, no value.js-internal work); references **U.F** (the value.js coordination letter) |
| **U.H6** | The 13 thin `vitest run <file>` proof-alias keys collapsed into project/tag selectors | Delete the 13 one-line `proof:*` keys (§H.2); their files run as part of the pooled `--project=library` (or `--project=demo` for the 3 demo members). Reserve `proof:*` for a NON-vitest apparatus. | S | `ci.yml` runs the two projects, not 13 per-file `npm run proof:*` steps; 13 keys drop from `package.json` | U.H2 (projects exist); co-sched **U.A6** (ci.yml collapse) + **U.A2** (the doubling collapse); nets 13 keys toward the anti-sprawl target |
| **U.H7** | Preset-taxonomy identity assertions folded into the property loop | Fold the ~15 `enterPresets.fadeIn === fadeIn` / `Object.keys(presetTaxonomy)` structural echoes (`test/presets/spring-presets.test.ts:66-90`) into the single `:92` property loop — "every taxonomy leaf IS the canonical exported factory AND constructs a valid animation." | S | the one behavioral invariant replaces ~15 structural `toBe` lines; `npm test` green | U.H1 (net exists as safety); independent |

**The cross-cut (lane 10, deferred to U.D).** The jsdom-free color-lerp / computed-value
micro-bench and the "one bench row per interpolation-dispatch branch" ask are FORWARDED
to **U.D** (the performance frontier owns the bench roster + `proof:bench-taxonomy`).
U.H does not own new bench arms — only the RE-HOMING of the two measure artifacts (H4).

---

## §H.2 — The 13 thin vitest-alias keys (verified present, collapsed at H6)

Every key below is a one-line `vitest run <file>` alias — one `package.json` line + one
`ci.yml` step per test file, run individually instead of as one pooled project. (lane
10 F6; verified against `package.json.scripts` this session.)

| Key | File | Post-split project |
|---|---|---|
| `proof:engine-correctness` | `test/engine/engine-correctness.test.ts` | library |
| `proof:sync-step` | `test/physics/sync-step.test.ts` | library |
| `proof:event-ordering` | `test/engine/event-ordering.test.ts` | library |
| `proof:adapter-capture` | `test/compile/adapter-capture.test.ts` | library |
| `proof:standalone-zero-alloc` | `test/engine/standalone-zero-alloc.test.ts` | library |
| `proof:compile-deterministic` | `test/compile/compile-deterministic.test.ts` | library |
| `proof:roundtrip-easing` | `test/compile/roundtrip-easing.test.ts` | library |
| `proof:cohesion` | `test/engine/boundary-cohesion.test.ts` | library |
| `proof:group-snapshot-identity` | `test/group/group-snapshot-identity.test.ts` | library |
| `proof:zero-alloc` | `test/engine/zero-alloc.test.ts` + 2 siblings | library |
| `proof:scene-raf-leak` | `test/demo/scene-raf-leak.test.ts` | **demo** |
| `proof:scene-contract-identity` | `test/demo/scene-contract-identity.test.ts` | **demo** |
| `proof:resize-tracks` | `test/demo/resize-tracks.test.ts` | **demo** |

The three demo members are why the split (H2) precedes the collapse (H6): they must
land in the `demo` project (real glass-ui), not the `library` project. `proof:zero-alloc`
already pools three files — the pattern the whole roster should follow — and its heap-
delta content is superseded by **U.D2**'s vitest-runnable allocation harness.

---

## §H.3 — Wave detail

### U.H1 — THE CHARACTERIZATION NET (FIRST — before any move)

**Substance.** Author a `test/characterization/` tier that imports ONLY through the
stable surfaces the whole U restructuring is defined to preserve:

- the LIGHT barrel `src/animation/index.ts` (via the `@mkbabb/keyframes.js` self-alias,
  `vitest.config.ts:15-19`) for the value.js-free primitives;
- the HEAVY mirror `src/animation/public.ts` / `./engine` for `CSSKeyframesAnimation`,
  `compileToCSS`, `presets`, the ingest/scroll round-trip;
- the demo scene public entries (`demo/app/scene/scenes.ts:143-189` `lazyScene`
  descriptors — the six live scenes cube/amiga/square/easing/spring/sequence).

It goldens OBSERVABLE behavior, never source shape: (a) compiled-CSS BYTES from
`compileToCSS` over a fixed keyframe corpus; (b) sampled frame VALUES over a fixed
clock (the `KeyframesScrollTimeline`/`ManualTimeline` injectable-clock idiom — no rAF,
no wall-clock); (c) each scene MOUNTS → plays → switches without throwing (behavior,
not the `SceneExposedApi` field shape — so it stays green across U.B7's
`animationGroup?`/`scenePlayback?` field deletion); (d) each scene's
visibility-pause / suspend→resume observable behavior over the injectable clock
(tab-hidden suspends the group clock; resume produces NO forward jump) — goldened
BEFORE U.B13's fix lands, so the suspend cure is WITNESSED green-across-the-fix,
never asserted (the OD-U13 discipline U.B13 consumes). The model already in-tree is
`test/demo/scene-machine-reducer.test.ts` (pure, path-shallow, one public symbol).

**Named deliverable — the spring trajectory oracle (U.C4's pre-condition).** U.H1
AUTHORS the spring scalar≡vector trajectory-equality characterization test — the
scalar `.evaluateAt(t)` trajectory ≡ the vector `tickVector` lane trajectory across
the underdamped/critical/overdamped regimes to float tolerance, in THIS
characterization tier, born-RED-on-divergence — as the pre-condition oracle for
**U.C4**'s deletion of the copied ODE at `vector.ts:126-151`. Prove the current copy
already rings identically, then prove the unified modal kernel keeps it so; C4 may
NOT delete the copy until this test is green-on-equality. One unambiguous owner —
U.H1 authors this oracle, U.C4 consumes it (the ordering stated on both sides).

**Why FIRST.** Lane 10 F7: every existing test binds deep source paths; the grand
recursive colocation will MOVE nearly all of them → mass RED unrelated to behavior. A
net pinned to the two "ins" distinguishes "a file moved" (stays green) from "a behavior
changed" (reds loudly) — the safety net the whole restructure needs. U.md §3 places
U.H BEFORE any move for exactly this reason; ring-fence 5 makes it the LOCK on the two
"ins".

**Gate/oracle.** IS the oracle — it runs under `npm test`. The witness is procedural: a
throwaway file move (or a U.B dry-run) leaves the net GREEN; a deliberate one-frame
behavior perturbation reds it.

**Edges.** ROOT of the impl DAG. Precedes all U.B/U.C/U.D moves. Needed by U.A1 (the
apparatus target's "A2 test-half survival is provable" clause depends on this net
existing). → **U.C4** (owns the spring trajectory oracle C4's ODE-deletion gates on);
→ **U.B13** (owns the suspend/resume coverage — golden (d) — that B13's witnessed-cure
discipline consumes).

**Evidence.** `vitest.config.ts:15-19` (self-alias → source, ONE realm);
`demo/app/scene/scenes.ts:143-189` (the six lazy scene entries);
`test/demo/scene-machine-reducer.test.ts` (the right model); CLAUDE.md (the two "ins" +
`compileToCSS` on the HEAVY surface); lane 10 F7.

---

### U.H2 — The vitest `library`/`demo` project split — glass-ui stub DELETED

**Substance.** `vitest.config.ts` runs ONE pool (`:44-46`) that mixes 89 library suites
with 24 demo suites, and resolves the whole thing only because `:35-38` aliases
`@mkbabb/glass-ui/motion-core` to a hand-written stub kept in lockstep with the
published contract. Split into two `test.projects`:

- **`library`** — globs `test/<zone>/**` (the 13 zone mirrors) + `test/characterization/**`
  + `test/_root/**`; glass-ui NEVER in scope; keeps the `@mkbabb/keyframes.js`→source
  self-alias so the library shares ONE realm with the code under test.
- **`demo`** — globs `test/demo/**`; resolves the REAL installed `@mkbabb/glass-ui`
  (peer `~4.0.0`, present as 4.0.1 in `node_modules`, verified) — no stub needed; runs
  in the `demo-smoke` job that already carries the demo build context.

`git rm test/stubs/glass-ui-motion-core.ts` and delete the
`@mkbabb/glass-ui/motion-core` alias. The library gate then depends on ZERO demo files
and needs no stub that silently rots against the real glass-ui.

**Why gestalt.** Lane 10 F2: the "glass-ui-free library gate" is NOT library-only — it
runs 24 demo suites bound to demo internals, and the grand restructuring moves nearly
every `demo/@`/`demo/app`/`demo/scenes` path they hard-code → mass RED plus a rotting
stub. Two projects sever the coupling permanently.

**Gate/oracle.** `npm test --project=library` green with zero demo files + zero glass-ui
in scope; `--project=demo` green against the real glass-ui. One-shot: grep the library
project's resolved module graph for `glass-ui` → zero hits.

**Edges.** U.H1 (the characterization net files under `library`). Co-scheduled with
**U.A2** (the surviving value-test halves of the doubling collapse home in `library`)
and **U.A6** (ci.yml runs the two projects, replacing per-file steps). The `@components`/
`@state`/`@styles`/`@utils` demo aliases re-point in the SAME motion as **U.B1**'s
`@→shared` rename — one coordinated alias edit, never two (lane 32).

**Evidence.** `vitest.config.ts:35-38` (the stub alias), `:44-46` (the single pool);
`test/stubs/glass-ui-motion-core.ts`; `package.json:297` (peer `~4.0.0`);
`node_modules/@mkbabb/glass-ui` (installed 4.0.1); `ci.yml:49,110` (the library-gate job
running `npm test`); lane 10 F2.

---

### U.H3 — The `test/<area>` mirror ratified (OD-U7) + gate-checked; `test/demo/` regrouped

**Substance.** Ratify RULING R5 / OD-U7: tests MIRROR their source tree
(`test/<zone>/` for the library, `test/demo/<area>/` for the demo) and NEVER colocate
into `src/`/`demo/`. Then:

- Regroup the flat `test/demo/*` (24 files) into
  `test/demo/{scenes,instrument,state,app}/` mirroring `demo/{scenes,@/components/custom/instrument,@/state,app}/`.
- Give the library ROOT files a home: `test/_root/` for `easing.ts`/`validate.ts`/
  `index.ts`/`public.ts` (they are root files beside the barrels, NOT zones — the
  current `test/easing/` is a false zone, lane 10 F4).
- The mirror INVARIANT lands as a VITEST TEST — `test/support/mirror.test.ts` —
  asserting (a) every library `test/` dir maps to a `src/animation/` zone-or-root and
  vice-versa, and (b) every demo test's primary import resolves INTO the area it is
  filed under. NOT a new `proof-*.mjs` (anti-sprawl: the surviving mechanism is
  `npm test`; a filesystem-mirror assertion is idiomatically a test, and U.A5 deletes
  the `zone-cohesion`/`decomposition` gates that R5/lane-26 named as fold homes).

**Why gestalt.** Lane 26 Finding 5 / R5: colocating tests would tax every structural
gate keyed to `src/animation`/`demo` sweeps with exclusion carve-outs, split the
one-environment vitest story, and inject test-only edges into the HMR module graph —
for zero published benefit (`files: ["dist"]`). The edict's own abstraction clause
("befitting for the language") supports the carve-out: tests are the truly module-level
members of ONE `test/` tier. OD-U7 requires the owner bless this carve-out.

**Gate/oracle.** `test/support/mirror.test.ts` under `npm test`. Reds if a test dir has
no source twin, if a root file has no `_root/` home, or if a demo test's primary import
escapes its filed area. ZERO new standalone gates.

**Edges.** U.H2 (the projects must exist so the mirror knows which tree each test
belongs to). **OD-U7 ruling** (the carve-out must be owner-blessed before this wave
closes). Co-scheduled with **U.B** (every demo module move re-files its mirrored test in
the SAME commit — never a strand-and-re-home window).

**Evidence.** `vitest.config.ts:42-44` (the mirror comment — today a CLAIM, not a
gate); lane 10 F4 (the two dishonest dirs `test/easing/`+`test/demo/`); lane 26
Finding 5 / R5 (mirror-survives + the `test/demo/<area>` regroup); OD-U7 (NEEDS RULING).

---

### U.H4 — The `*.measure.test.ts` artifacts re-homed under `bench/`

**Substance.** `vitest.config.ts:45` pulls `test/**/*.measure.test.ts` into the
correctness pool, burning runtime every `npm test` on two DECISION-SUPPORT probes that
assert no invariant: `test/engine/d3-changed-keys.measure.test.ts` (records an
"unchanged-key fraction" for a WITHHELD transposition — "proves the local hot-path win
is ~0") and `test/physics/sync-step.measure.test.ts` (explicitly "arm-neutral… the
DECISION is made on-device from the printed numbers"). Drop the `*.measure.test.ts`
glob from `include`; re-home the two beside their bench siblings
(`bench/sync-step.bench.ts` already exists) so measurement runs on demand / on the impl
host, never in the CI correctness glob.

**Why gestalt.** Lane 10 F5: "measurement rotting inside the correctness pool." The
correctness suite must assert only invariants — faster and honest. Measurement belongs
to `bench/`.

**Gate/oracle.** the vitest `include` no longer matches `*.measure`; `npm test` runs
only invariants (a one-shot: `vitest list` shows zero `.measure` entries).

**Edges.** U.H2 (the split settles the `include` globs). Feeds **U.D2** — the
performance frontier's vitest-runnable allocation + throughput harness SUBSUMES the
decision these probes fed (the re-baselined ratios live there, not in the correctness
pool).

**Evidence.** `test/engine/d3-changed-keys.measure.test.ts:1-15`;
`test/physics/sync-step.measure.test.ts:12-27`; `vitest.config.ts:45`; lane 10 F5.

---

### U.H5 — `easing.test.ts` DELETED; value.js behavior re-chartered as a consume-edge contract

**Substance.** `test/easing/easing.test.ts:1-6` imports ONLY `@mkbabb/value.js`
(`CSSCubicBezier`, `steppedEase`, `timingFunctions`) — its 4 tests assert value.js's own
registry has keys and its bezier evaluates; ZERO `src/animation` code is exercised. It
even mis-labels itself "easing re-exports (smoke tests)" though kf re-exports none of
these. `git rm` it — value.js owns that coverage in its own (active) tranche. Any
value.js behavior kf TRULY relies on is pinned as a NAMED consume-edge contract beside
`test/compile/valuejs-contract.test.ts` (the correct model: "a kf test that locks kf's
CONSUMPTION of a value.js property," `parseCSSValueUnit("") → ValueUnit(0)`). Relocate
`test/easing/resolve-easing.test.ts` — it DOES test `src/animation/easing.ts`, a root
file — into the `test/_root/` home (H3), dissolving the false `test/easing/` zone.

**Why gestalt.** Lane 10 F3/F4: dependency-testing living in the kf correctness pool is
redundant (value.js has its own suite) and it is one of the two dirs that break the
mirror honesty. Ring-fence 1: kf may charter against value.js ONLY as a named
consume-edge contract, never as a dependency smoke test.

**Gate/oracle.** `npm test` green without `easing.test.ts`; the H3 mirror test no longer
flags `test/easing/` as a false zone (the dir is gone).

**Edges.** U.H3 (`test/_root/` exists for the relocated `resolve-easing.test.ts`).
Ring-fence 1 (consume-edge ONLY). References **U.F** — if the value.js coordination
letter surfaces a NEW load-bearing behavior kf depends on, it is pinned as a
consume-edge contract here, not re-added as a dependency smoke test.

**Evidence.** `test/easing/easing.test.ts:1-6` (value.js-only, 4 tests, no
`src/animation` import); `test/compile/valuejs-contract.test.ts:1-16` (the correct
contrast); `test/easing/resolve-easing.test.ts` (tests kf's `easing.ts`); lane 10
F3/F4.

---

### U.H6 — The 13 thin `vitest run <file>` proof-alias keys collapsed into project selectors

**Substance.** 13 `proof:*` keys are pure `vitest run <file>` one-liners (§H.2 table,
all verified present) — one `package.json` line + one `ci.yml` step per test file, run
INDIVIDUALLY instead of as one pooled project run. Delete all 13 keys; the files run as
part of `--project=library` (10 of them) or `--project=demo` (the 3 demo members
`scene-raf-leak`/`scene-contract-identity`/`resize-tracks`). Reserve `proof:*` keys for
gates with a NON-vitest apparatus (bundle boundary, published surface, source greps that
survive U.A). This is a concrete slice of the 227→target descent and greens the
`roster-ceiling` pressure (which U.A5 then deletes outright).

**Why gestalt.** Lane 10 F6: the tautological CI the owner named — 13 per-file
`npm run proof:*` steps where ONE `vitest --project=library` does the same work, faster,
with a shared jsdom setup. Combined with U.A2's source-grep retirement, this is the
path from 228 → the target.

**Gate/oracle.** `ci.yml` runs the two projects (H2), not 13 per-file steps; the 13 keys
drop from `package.json` (net −13, verified at close). No new gate.

**Edges.** U.H2 (the projects exist). Co-scheduled with **U.A6** (the ci.yml collapse
removes the per-file steps in the same pass) and **U.A2** (the doubling collapse — same
class of package.json shrinkage). The 3 demo members MUST land in `--project=demo`, so
H6 strictly follows H2.

**Evidence.** the §H.2 table (13 keys verified against `package.json.scripts`);
`ci.yml:238-274` (per-file `npm run proof:*` steps per lane 10 F6); lane 10 F6.

---

### U.H7 — Preset-taxonomy identity assertions folded into the property loop

**Substance.** `test/presets/spring-presets.test.ts:66-90` asserts
`enterPresets.fadeIn === fadeIn`, `presetTaxonomy.enter === enterPresets`,
`Object.keys(presetTaxonomy) === ["enter","exit","attention","loop"]` — ~15 structural
echoes testing that a hand-written index references its members. Fold them into the
existing `:92` property loop → "every taxonomy leaf IS the canonical exported factory
AND constructs a valid animation." One behavioral invariant replaces the ~15 `toBe`
lines.

**Why gestalt.** Lane 10 F8: low signal — the identity/key-shape lines guard only a
copy-paste re-implementation the property loop already covers. This also anticipates
**U.C**'s "presets 34×4 hand-lists → ONE data table" (OD-U6): once the four lists ARE one
table, the identity assertions are vacuous by construction — folding them now keeps the
preset test honest through that transposition.

**Gate/oracle.** the single property loop under `npm test`; ~15 structural lines gone.

**Edges.** U.H1 (the net is the safety margin for the edit). Independent of the other
H waves; anticipates **U.C** OD-U6 (presets-to-data).

**Evidence.** `test/presets/spring-presets.test.ts:66-90` (identity + key-shape) vs
`:92-100` (the real property loop); lane 10 F8; OD-U6.

---

## Risks + the re-arm map

The stale-era re-arm class is EXPECTED (U.md §5): every U.H move invalidates some
config/gate expectation. Disposition is DELETE (the coupling is dissolved) or RE-ARM
(re-pointed at the new tree) — cited per wave.

| Wave | Invalidates / at risk | Disposition |
|---|---|---|
| **H1** | nothing (pure addition of a stable-surface net) | ADD; it is the re-arm TARGET for every downstream move's "did behavior change?" question |
| **H2** | the single-pool `vitest.config.ts`; the glass-ui stub + its alias; the library-gate job's "runs everything" assumption | RE-ARM as two `test.projects`; DELETE the stub (real glass-ui in the demo project); `ci.yml` re-armed at U.A6 |
| **H3** | the `test/<zone>` mirror COMMENT (`vitest.config.ts:42-44`); the flat `test/demo/`; `test/easing/`+`test/demo/` as honest zones; the R5/lane-26 fold homes `zone-cohesion`/`decomposition` (deleted at U.A5) | RE-ARM the comment as a VITEST TEST (`test/support/mirror.test.ts` — NOT a new proof-*.mjs); REGROUP `test/demo/`; the fold home is `npm test`, not a deleted hygiene gate |
| **H4** | the `*.measure.test.ts` include glob | DELETE the glob; RE-HOME the 2 artifacts under `bench/` (fed to U.D2) |
| **H5** | `test/easing/easing.test.ts` (dependency coverage); the false `test/easing/` zone; `test/easing/resolve-easing.test.ts` path | DELETE `easing.test.ts`; RELOCATE `resolve-easing.test.ts` → `test/_root/`; value.js behavior re-armed ONLY as a named consume-edge contract |
| **H6** | 13 `proof:*` package.json keys + their per-file `ci.yml` steps | DELETE the 13 keys; RE-ARM as pooled `--project=library`/`--project=demo` runs (co-sched U.A6) |
| **H7** | ~15 structural `toBe` lines in `spring-presets.test.ts` | FOLD into the one property loop (no config change; anticipates U.C OD-U6) |

**Standing invalidation the band CREATES, not clears (forwarded):**

- **H1 is the DAG root** — if it slips, every U.B/U.C/U.D move loses its behavior-drift
  net and the restructure proceeds blind. It HARD-GATES the impl start (U.md §3).
- **H3 is HARD-GATED on OD-U7** — the mirror carve-out (tests do not colocate) reverses
  the edict's own "colocation everywhere" for the test tier; if the owner does not bless
  it, the regroup target is undefined. NEEDS RULING before H3 closes.
- **H2's demo-alias re-point is COUPLED to U.B1** (`@→shared`) — one coordinated alias
  edit; the interim (H2 lands the projects, U.B1 lands the rename) must not double-edit
  `vitest.config.ts`. Lane 32's one-coordinated-pass discipline applies.

**Net gate delta (the band's headline):** −14 package.json keys minimum (13 vitest
aliases at H6 + `easing.test.ts`'s absence unblocking the mirror), the glass-ui stub
deleted, TWO `*.measure` files off the correctness pass, ZERO new standalone
`proof-*.mjs` (the mirror invariant is a vitest test). Every row is DOWN or flat — the
test substrate leads the anti-sprawl descent it enables for the rest of U.
