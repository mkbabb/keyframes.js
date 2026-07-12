# Tranche U — THE BOARD

> The board of record for THE DISSOLUTION TRANCHE. Amended AT THE EVENT (the T.M9
> freshness discipline) — never reconstructed at close. The charter is `U.md`; the
> band docs are `waves/U.<band>.md`.

## Band status

| Band | Title | State |
|---|---|---|
| U.A | THE APPARATUS DISSOLUTION | **IN PROGRESS — A1 coverage inversion landed**: `proof:ci-coverage` now treats tier reachability as authority and the transitional `proof:observed` tier preserves previously unaggregated leaves; the gate population/CI collapse and ledger deletion remain A2–A10 |
| U.B | THE DEMO TRANSPOSITION | **IN PROGRESS — U.B1 COMPLETE** (`969990f6..27073789`): canonical homes, dock, SceneFacility/runtime/lifecycle moves green; P5 semantics execute once in U.B2, CLAUDE delete-last remains U.E7 |
| U.C | THE LIBRARY TRANSPOSITION | **IN PROGRESS** — C1/C3(partial)/C4/C5/C6/C7/C8/C9/C10/C11/C12/C13/C14/C15/C16 landed on `tranche-u-impl`; only the explicit color/value covenant remainder is routed to U.F |
| U.D | THE PERFORMANCE FRONTIER | **IN PROGRESS** — D3 WAAPI shadow-tick fast path landed; D2 microtask-hop harness and remaining frontier rows pending |
| U.E | NO-DEFERRAL DISCHARGE + LEGACY ZERO | **IN PROGRESS** — E7/E8/E9 complete; E10 D2–D7 complete; only D1 owner-ridden and D8/D9 documented keeps remain |
| U.F | CONSTELLATION COVENANTS | **IN PROGRESS — F1/F2/F3/F4/F7 landed**: 63 library/demo consumers transposed to value.js 3.1.0 subpaths; glass-ui F5/F6 remain release-held under OD-U4 |
| U.G | THE DESIGN CODEX | **IN PROGRESS** — G1/G2/G3/G5 codex landed; G4 owner-golden blessing remains |
| U.H | THE TEST SUBSTRATE (FIRST) | **COMPLETE** — stable-surface characterization + library/demo Vitest split + real-glass demo pool + test mirror + measurement re-home + 13 thin alias deletions landed before any move (`7dc1d1be..286aae16`) |
| U.R | PROMPT-RECAP-U (STANDING) | **COMPLETE** — U.R2 retargeted to tree-cleared witness; `proof:prompt-recap-u` passes all seven clauses |
| U.L | THE CONVERGENCE LOOP (Track A + Track B) | **TERMINATED** — 5 passes (73→97→96→98.4→98.8%); 9/10 items at 100, N2 residue chartered (U.E9); the wave-set development order RATIFIED (`loop/PASS-5.md` §7) and FOLDED into U.B/U.C/U.E/U.F/U.Z |
| U.Z | THE CLOSE | **IN PROGRESS** — publish bundle and certifying sweep are executable; close remains gated by owner-golden blessing and glass-ui 5.0.0 release readiness |

**IMPL AUTHORIZED** — OD-U22; implementation branch `tranche-u-impl` opened from
green master and the ratified corpus merged at `0b423142`.

## Session log

- **2026-07-12** — **U.A1 COVERAGE-CONTRACT INVERSION.** The transitional
  coverage contract now derives authority from correctness/hygiene tier
  membership rather than requiring every package `proof:*` key to be repeated as
  a literal CI step. `proof:publish` is a hygiene-tier leaf, and the twelve
  previously unaggregated but green browser leaves are reachable through an
  explicit `proof:observed` migration tier. `npm run check`, `proof:ci-coverage`,
  and `proof:publish` pass. The tier is transitional: A2–A10 still must delete
  the old self-policing population and collapse CI; no glass-ui source or pin was
  changed.

- **2026-07-12** — **RECORDS AUDIT / EXTERNAL HOLDS PRESERVED.** Commits
  `1b1ba5d4` and `53bd96fd` reconcile the wave headers and record U.G4's
  owner-golden hold. The current witness is the inherited 12-cell matrix;
  `proof:owner-golden` reports 12 checks green but skips its render leg without
  a new blessing token and built `dist/gh-pages/`. U.G4 still requires
  sequence-light/sequence-dark (12→14) and the `PANE=LIT` idle-state pin. The
  glass-ui 5.0.0 consume edge remains untouched and release-held. This entry
  is an evidence correction, not a close claim.

- **2026-07-12** — **U.F SUBPATH TRANSPOSITION + U.R2 RETARGET.** Commits
  `5377d2e2`, `6161215c`, and `10ddaa15` move the published heavy value.js
  consumers (library and demo) onto the frozen 3.1.0 subpaths, including the
  easing default and its boundary oracle. `b9505bb1` replaces the T recap gate
  with the tree-cleared U witness; all 7 clauses pass. Full library (931 passed,
  2 expected failures, 15 skipped) and demo (141 passed) suites pass, as do
  `check`, `build:lib`, `proof:boundary`, `proof:published-surface`, and
  `proof:deps-current`. Glass-ui remains untouched pending its published 5.0.0.

- **2026-07-12** — **U.Z1 PUBLISH BUNDLE AUTHORED.** Commit `d30db16c` adds
  `proof:publish` (boundary + published surface + dependency currency) and
  wires it into the release workflow. The bundle and `proof:ci-coverage` pass;
  the owner-golden render leg still skips without the external blessing token.

- **2026-07-12** — **U.E HYGIENE RE-ARM AFTER E8/E10.** Commit `244a8c3a`
  reconciles the standing structural records after the suppression-ledger and
  measured demo sweeps: the dissolved dependency-cruiser ledger is witnessed as
  an absent zero-entry baseline, the demo `any` ratchet is tightened to its live
  97-line count, and the glass-ui gap ledger follows the relocated pill-tabs
  composable. `proof:ci-coverage` remains green; focused no-flat-siblings,
  any-ceiling, and glass-ui-gap-tripwire proofs pass. The glass-ui package and
  source remain release-held and untouched.

- **2026-07-12** — **U.G CODEX COMPLETE FOR G1/G2/G3/G5.** Commit `db1e7795`
  promotes `demo/DESIGN.md` from a stub to the ten-chapter design authority:
  material/voice/card registers, stage/φ/z contract, idiom/token homes,
  OD-U9's one-direction 3D instrument register, component/API grammar, and
  Vue R1–R7 law. Font, colocation, crayon, check, and related doc witnesses
  pass; G4's owner-golden blessing and known deferred styling rows remain
  routed.

- **2026-07-12** — **U.F3 + U.E10 DOGFOOD CLOSURES.** Commit `43b28182`
  authors `KF-TO-VALUEJS-U.md` with verified value.js 3.1.0 subpath facts,
  frozen consume contract, upstream asks, and explicit ring-fences. Commit
  `fc2ecba3` completes the measured 43-site demo clamp sweep; the follow-up
  fixes the remaining `clampSweep` call to the value.js math clamp. Demo 141/141,
  `npm run check`, `proof:dogfood`, and a zero-residue nested-clamp grep pass.
  Glass-ui remains release-held; no package or glass-ui source changed.

- **2026-07-12** — **U.C15/C16 + U.E9 IMPLEMENTATION COMPLETE.** Commits
  `f93c003b`, `c98b26dd`, `f54769b1`, `725de850`, and `449d96e0` unify the
  additive composition operator axis (including `accumulate`, the weighted
  compatibility alias, and unit-mismatch refusal), wire native group lowering
  into managed lifecycle with safe rAF fallback, and dissolve the six retired
  decision gates plus every named residue. Group/scroll suites pass (98 tests,
  one expected failure); `proof:blend`, `proof:portable-perf`, and the lead
  `proof:bench-taxonomy` pass (86 classified cases and all budget floors).
  The post-integration full suites are green: library 90 files / 931 passed
  (2 expected failures, 15 skips) and demo 24 files / 141 passed.

- **2026-07-12** — **U.C11 DRIVE COMPOSITION COMPLETE.** Commit `fa3b7e7a`
  adds the additive `driveScrollCSS` entry and exact `{ scene, trigger?, backend,
  reason? }` handle, fanning one parsed scroll value into the continuous scene,
  optional trigger, and native/JS dispatch. README and the published-surface
  manifest now teach the new export. `npm run check`, scroll/mirror tests
  (34 passed, 4 skipped), `build:lib`, `proof:boundary`, and
  `proof:published-surface` pass.

- **2026-07-12** — **U.C13 + U.E7 SURFACE/LEGACY CLOSURES LANDED.** Commit
  `74bc4696` collapses the heavy loader onto `public.ts`, preserves the
  API-Extractor-compatible member interface, rationalizes ESM exports, and
  moves ambient demo types out of the library graph. Commit `94f3fe57` deletes
  the three live CLAUDE mirrors and their reader gate, re-homing the managed
  lifecycle and structural contracts. `npm run check`, `build:lib`,
  `proof:boundary`, `proof:engine-subpath-mirror`, `proof:lint-clean`,
  `proof:no-dead-dependency`, `proof:engine`, and `proof:published-surface` pass.
  Frozen evidence worktrees remain intentionally untouched.

- **2026-07-12** — **U.E8 SUPPRESSION-BY-FIXING COMPLETE.** Commit `c61ffec5`
  deletes the dependency-cruiser known-violations ledger, removes
  `--ignore-known` from lint/proof paths, and breaks the spring runtime cycle by
  importing the dependency-free solver directly. `npm run lint`,
  `proof:lint-clean`, and `proof:no-silent-fallback` pass; all planted cycle and
  boundary violations still bite. E7's CLAUDE delete-last act remains untouched.
  A post-build published-surface run passes clauses (a,b,d,f,g,h,i) and reds only
  the stale root CLAUDE test count (113 recorded vs 117 actual), which remains
  routed to E7's delete-last cleanup rather than patched in place.

- **2026-07-12** — **POST-C3 REGRESSION CURE + E10 D6 COMPLETE.** Commit
  `516de469` filters epoch-cleared composite leaves at the style output boundary
  so shape-stable grouped maps remain compatible with value.js serialization;
  it also re-anchors the playback visualizer mirror witness. The zero-allocation
  and mirror suites (12 tests), `npm run check`, and `proof:dogfood` passed.
  Commit `d770b99b` routes the four Sequence/Spring `clamp01` copies through
  value.js math; its demo checks and dogfood proof passed. E7/E8 delete-last work
  remains intentionally untouched.
  The post-cure full suites are green: library 88 files / 924 passed (2
  expected failures, 15 skipped) and demo 24 files / 141 passed.

- **2026-07-12** — **U.C11 DISPATCH-DEDUPE SLICE COMPLETE.** Commit `a664442c`
  re-homes `ScrollBackend` beside dispatch and passes the precomputed WAAPI
  eligibility/timeline context into native attachment, avoiding the duplicate
  scan and construction while preserving direct-caller fallback behavior.
  `npm run check` and the scroll/WAAPI suites passed (46 tests, 4 skipped).
  The additive `driveScrollCSS` composition entry remains routed.

- **2026-07-12** — **U.E9/E10 RECONNAISSANCE RECORDED.** Commit `094424fe`
  adds the measured 39-hit residue census, KNOWN_PRIOR_ART classification,
  current demo clamp families, and the sequencing/gate anchors for the
  delete-last cleanup. No CLAUDE, suppression, gate, or glass-ui files were
  changed; E7/E8 re-anchoring and the bounded E9/E10 implementation remain
  routed.

- **2026-07-12** — **U.C16 CONSERVATIVE LOWERING PRIMITIVE COMPLETE.** Commit
  `5ebf19f0` adds a single-target, all-eligible group gate and one native
  `Element.animate` effect per admitted layer, with weighted, masked, disabled,
  mixed-target, and ineligible stacks refusing to the rAF compositor. The
  focused lowering suite (2 tests) and `npm run check` passed. Lifecycle wiring,
  replay parity, and declarative-stack integration remain explicitly routed.

- **2026-07-12** — **U.D3 WAAPI SHADOW-TICK CURE COMPLETE.** Commit `d5f89b43`
  keeps steady `playWAAPI` reconciliation synchronous and defers only a
  genuinely thenable first tick, removing the forced per-frame Promise/
  microtask hop. `npm run check` and the sync-step, event-ordering, and WAAPI
  lifecycle suites (20 tests) passed. D2's dedicated microtask-hop harness and
  the remaining performance frontier stay routed forward.

- **2026-07-12** — **U.C15 WEIGHT-AXIS SLICE COMPLETE.** Commit `67fd0f8e`
  centralizes static layer-weight normalization in a single resolver, clamps
  transition targets before spring seed/reseat, and preserves live spring
  overshoot. The normalized-weight and adjacent group suites passed (21 tests)
  with `npm run check`; the operator-axis merge, unit/colour guards, and WAAPI
  lowering remain routed to the following C15/C16 work.

- **2026-07-12** — **U.C3/C14 SHAPE-STABILITY SLICE COMPLETE.** Commit
  `71f1e0b1` excludes disabled layers from the grouped-key union and replaces
  frame-local contribution-set deletion with per-key epochs; structural
  reconfiguration still removes retired union keys. New regressions cover
  disabled-layer filtering and stable object shape. `npm run check`, the
  composite-state boundary suite (6/6), and the group suites (56 passed plus
  one pre-existing expected failure) passed. The Renderer/plain-vars seam and
  declarative layer-stack descriptor remain routed to later C3/C15 work.

- **2026-07-12** — **U.C10 DEAD-CALLBACK CURE COMPLETE.** Commit `ecec148c`
  removes the unreachable `OnParseError` callback sink from the compile adapter
  and makes `validate.parseable` depend only on the real `EMPTY_PARSE` signal.
  Measurement found that `DiagnosticCode.PARSE_ERROR` remains live in the
  independent CSSOM-ingest path, so the enum is retained and full excision is
  routed to the U.F value.js diagnostics covenant. `npm run check`, the adapter /
  validator / ingest suites (29 tests), and `proof:boundary` passed.

- **2026-07-12** — **U.C12 PRESET CATALOG COMPLETE.** Commit `60a3bf55`
  replaces the classic/spring split hand-lockstep lists with one typed 38-row
  `PRESET_SPECS` catalog and `definePreset` generator. Named factories and the
  enter/exit/attention/loop taxonomy derive from that table; all CSS rows pass
  through the bare-body normalizer, including the four historical wrapped
  constants. The focused preset suites (56 tests), `npm run check`,
  `build:lib`, and `proof:boundary` passed. C13 remains measured as an
  API-Extractor-sensitive surface-collapse lane; no glass-ui consume-edge
  change was made.

- **2026-07-12** — **U.B1 KEYSTONE COMPLETE.** The canonical-home dissolution
  (`969990f6`) removed `demo/@`, `components/custom`, and `components.json`,
  re-anchoring the 72-file measurement across all three alias planes, tests,
  gates, and live prose; only the nine provenance files retain the old spelling.
  The dock moved out of the app shell (`ddca40d1`), and shared SceneFacility /
  scene-runtime contracts plus app lifecycle guards reached their terminal
  homes (`27073789`). Each stage independently passed `npm run check`, both
  Vitest projects, and its named structural gates. Three frozen-script premises
  were measured false and amended rather than inherited: Step ① had assumed the
  dock prototype already landed; the custom-path count was 28 sites / 22 files,
  not 26 / 20; and Step ④'s intermediate P5 shape would immediately be moved
  again by U.B2. Accordingly P5's ChannelGroup/ChannelControls/ChannelOptions
  semantics land directly in U.B2's terminal owner modules, while skeleton,
  barrel, editor, shell, and inline work remains with B10/B12/B4/B5/B14. The
  CLAUDE.md delete-last act remains U.E7 with its redistribution/fold-map.
- **2026-07-12** — **THE U IMPL DRIVE OPENED; U.H COMPLETE.** Forked
  `tranche-u-impl` from green master, merged the ratified corpus (`0b423142`),
  and landed the required pre-move test substrate in three isolated lanes.
  Stable package/scene-entry characterization (`7dc1d1be`), the library/demo
  Vitest split and 13-alias collapse (`b72562e5`), the area mirror/value-only
  test deletion/preset fold (`902c4f04`), and the merged-tree re-anchor repair
  (`286aae16`) are green together: library 84 files / 909 tests; demo 24 / 141;
  `npm run check` green. Independent verification caught and cured two misses
  before close: the mirror initially rejected the new characterization tier,
  and four runnable aliases still named the old flat demo paths. glass-ui
  consume-edge work remains HELD: its sibling tree reports a local 5.0.0
  version but no `v5.0.0` tag/release-ready state and an unresolved
  `goo-blob`/`blob` export contradiction. U.H tested current 4.0.1 and records
  the mandatory post-release demo-project re-run.

- **2026-07-09** — U opened by the owner's dissolution edict (verbatim at
  `ORIGINAL-PROMPT.md`, committed to master at `b95973a` mid-T-close). Received
  while the T deploy-of-record was in flight; the two tracks ran in parallel.
- **2026-07-10** — **THE 32-LANE AUDIT FLEET COMPLETE** (`wf_3e2440f9-452`: 31/32
  structured + 1 report-only [lane 12, StructuredOutput cap; report real at 186L;
  lane 14's structured summary was junk but its report is real at 279L], 3.8M
  tokens, ~83min, 11 batches of 3; design lanes 24–26 on Fable + frontend-design).
  Reports at `audit/lane-*.md`. The four root causes converged hard: the apparatus
  IS the legacy (73.5k scripts LOC vs 22k src; ~40/227 gates real); the structure
  edict was executed tolerantly (T #26 overstated — F1/F2 skipped, the keystone
  gate shaped around them); the perf frontier is misallocated (the render seam is
  ~95% of tick cost, untouched; 8MB dead Monaco workers = 48% of shipped JS); the
  constellation edges drift vacuously (tilde-frozen glass-ui + installed-dist-only
  tripwires). parse-that certified CLEAN (transitive-only, zero specifiers).
- **2026-07-10** — the Fable synthesis: `U.md` (4 root causes → 10 bands → DAG →
  ring-fences), `OWNER-DECISIONS.md` (OD-U1..U9; three PRE-RATIFIED off the edict's
  plain text), `OWNER-ASKS.md`. The wave-doc fleet launched (`wf_8eeb3b4c-d2b`,
  10 band authors, batches of 3, U.G on Fable + frontend-design).
- **2026-07-10** — T-close interleave (master, not this branch): the first
  fully-green master CI in the tranche era (`72d1873`) after the close-out chain —
  styling-idioms dead-refs, demo-elevate re-arm, easing-gallery selector,
  KEEP labels, pin-ledger, dock-zorder→tripwire, library-gate timeout,
  no-cross-realm-cast catastrophic-backtracking regex (never once completed on CI),
  deploy-preflight gh-api --jq bug on its first live firing (fixed `2810268`);
  5.2.0 published to npm (latest); break-glass dispatch fired while the fixed
  auto-path re-proves.
- **2026-07-10** — the 3-critic harden pass (`wf_0703d8a4-940`: coverage / DAG-edges /
  edict-conformance, all SOUND-WITH-FIXES — 1 blocker [the U.C4 spring-oracle ownership,
  now U.H1's named deliverable], 7 major, 9 minor) APPLIED across 8 corpus docs; the two
  new-gate anti-sprawl sign-offs registered as OD-U10/OD-U11.
- **2026-07-10** — **THE 2026-07-10 RULING BATCHES EXECUTED (OWNER-ASKS rows 3-4).**
  The owner's two verbatim ruling batches propagated through the corpus: OD-U1..U13 now
  register terminal-or-confirm — OD-U1 (the RULED 10× wall-clock + zero-loss fold-map
  exit criteria), OD-U2 (component-CORE redesign to the glass-ui post-BH idiom + the
  `demo/@/` DISSOLUTION revised-reco, pending one-word confirm; `components/custom/`
  dissolution STANDS), OD-U4 (glass-ui **5.0.0** — the pin moves on its publish, the
  joint BG+BH cut), OD-U5 (Monaco kept FULLY-FEATURED but ON-DEMAND), OD-U7
  (tests-stay), OD-U8 (**5.3.0** — U binds to a compatible published surface, additive
  only), OD-U9 (RULED — instrument the 3D scenes, designed ONE direction, no both-ways
  fork), OD-U10/OD-U11 (both proposed standalone gates DROPPED to clauses), OD-U12 (the
  scene-facet loading model — verbatim design authority), OD-U13 (the amiga +
  suspend/resume in-U cure). The glass-ui post-BH idiom audit LANDED
  (`audit/glassui-idioms-post-bh.md` — the OD-U2 homogeneity evidence, feeding
  U.B/U.F/U.G). The amiga + scene suspend/resume first-principles investigation
  DISPATCHED (OD-U13; dossier → `audit/defect-amiga-suspend-resume.md`; the fix is the
  new wave **U.B13**). **ZERO new standalone gates survive the rulings** (OD-U10/U11 —
  both fold into clauses on existing gates; net NEW standalone gates in U = ZERO). The
  corpus propagation applied to `U.md` + six wave docs
  (`U.A`/`U.B`/`U.C`/`U.D`/`U.F`/`U.G`).
- **2026-07-10** — **THE OD-U13 DOSSIER LANDED** (`audit/defect-amiga-suspend-resume.md`):
  the "amiga broken" mandate root-caused to a LIVE 5.2.0 LIBRARY BUG — the plain-vars
  projection (`compile/plain-vars.ts:109`) caches a `ValueUnit[]` leaf reference that
  `engine/interpolate.ts:194` re-points on every keyframe-segment crossing; the
  `singleTarget`+`unflatten` path (amiga alone) reads the orphaned frozen leaf and the
  sphere pins at the 25% pose ~2s into every play (introduced `efcb244`+`f060c17`,
  Tranche T 2026-07-05; three green gates each sample BEFORE the 2000ms boundary — the
  vacuous-green exhibit made concrete). Suspend/resume machinery otherwise SOUND (no
  orphaned rAF; cube/easing clean); one real gap — amiga's tab-hide pauses the WebGL
  loop but not the group clock. Chartered: **U.C14** (the projection-as-view cure +
  the born-RED past-the-boundary characterization) + **U.B13 re-cut** (the ONE
  symmetric suspend contract, consuming C14).
- **2026-07-10** — **THE OD-U14 COMPOSITOR ASSAY LANDED** (`wf_418fb3a3-3f1`: the
  3-lane first-principles assay — semantics · behavior · architecture — over the
  owner's named "primary issue" [compositing/stacking/layering]; dossiers at
  `audit/assay-compositor-{semantics,behavior,architecture}.md`). **Headline:** the
  C14 amiga freeze is ONE of a THREE-instance stale-leaf-cache CLASS — the composite
  `_grouped` is a POINTER TABLE into borrowed frame-leaf buffers the interpolator
  re-points at every segment crossing; besides the plain-vars projection (D1, amiga),
  the SoA `add`/`weighted` plan capture (D2) silently collapses the blended layer to
  the base at the first boundary — **demo-reachable** via `LayerConfigPanel`'s blend
  selector on the FLAT/DOM path, NOT gated by `unflatten`, and green under every gate
  (`proof:blend`/`proof:soa-composite` all sample within a single segment) — and
  layer-removal leaks frozen keys (D3). Beyond the class: blending is unit-blind +
  colour-blind across layers, `weighted` is a non-normalized order-dependent lerp that
  drops a lone layer's weight, and the group zone has ZERO WAAPI references (any
  animation drops to main-thread rAF the instant it joins a group). **Chartered into
  U.C:** **U.C14 WIDENED** (the plain-vars cure → THE COMPOSITE-STATE CURE — the
  composite becomes a value store the compositor OWNS; born-RED gates for D1/D2/D3;
  size M→L), **U.C3 RE-CHARTERED** (the group-zone redesign — owned `CompositeState`
  in a carved `group/draw.ts` + a `Renderer` seam + a declarative layer stack; M→L),
  **U.C15 NEW** (one op axis `replace|add|accumulate` + orthogonal normalized weight;
  unit/colour correctness guards; M), **U.C16 NEW** (group WAAPI lowering — a
  single-target all-eligible group lowers to N native `target.animate(kf,
  {composite})` calls; L). All ADDITIVE on the OD-U8 5.3 bind. Corpus propagation:
  OD-U14 disposition (ASSAY COMPLETE) + `U.md` §1 RC-2b + §2 U.C row + `waves/U.C.md`
  (wave index/DAG/Risks R4+R8) + `waves/U.B.md` (U.B3 gains the
  LayerConfigPanel-inert-on-multi-target reconciliation, behavior lane D4).
- **2026-07-10** — **THE CONVERGENCE-LOOP MANDATE REGISTERED (OWNER-ASKS row 6,
  verbatim; OD-U15..U18).** The owner mandated the 5-step convergence loop as U's
  development methodology (research ≤8∥ → synthesis → worktree prototype fleet →
  critique fleet with % convergence → agglomerator, looped to 100%, then the exact
  wave sets develop) — ratified as **OD-U18** and chartered as band **U.L** (Track A =
  the spec coherence/cogency workflow; Track B = the library+demo module-restructure
  pass, pass 1 deployed: 8 research lanes → SPEC-B1 → 6 worktree prototypes →
  critiques → agglomerator; artifacts under `loop/`). Three companion rulings
  registered: **OD-U15** (ALL CLAUDE.md files deleted totally, content re-homed
  inline/README — placeholder home **U.E7**), **OD-U16** (module granularity BOTH
  directions — the carve direction rides U.C7/U.C8; the small-module inlining + the
  per-module assay arrive from the loop), **OD-U17** (suppression files removed by
  FIXING the violations — placeholder home **U.E8**). Prototypes are EVIDENCE (kept
  worktree branches), never merged; the owner review sits inside the loop.
- **2026-07-10** — **TRACK A SPEC-COHERENCE PASS APPLIED** (4 lenses — consistency ·
  cogency/plain-language · coverage-overlap · dag-integrity — 36 findings: 3 blocker,
  18 major, 15 minor; ~half landed in the earlier wall-salvage commit `51d495c`, the
  remainder applied this pass). Load-bearing corrections: U.Z fully conformed to
  OD-U8 RULED (5.3.0 fixed; the surface diff is a CONSTRAINT CHECK, never a 6.0.0
  trigger; the close ledger widened to OD-U1..U18 + the four-part V-inherits-NOTHING
  check gains clause (d) for the loop rulings); OD-U15/U16/U17/U18 given explicit
  homes (band U.L in `U.md` §2/§3; **U.E7** CLAUDE.md deletion + **U.E8** suppression
  removal authored in `waves/U.E.md`; OD-U16 cited at U.C7/U.C8 + the granularity
  note); every "law lives in demo/CLAUDE.md" clause re-targeted to the DESIGN codex
  (U.G5) and every CLAUDE.md reconcile/fix re-cut as a deletion (U.B/U.C/U.E);
  U.H1 gains golden (d) — the suspend/resume coverage U.B13's witnessed-cure edge
  consumes — plus the → U.C4/→ U.B13 consumer edges; U.R's recap census widened from
  "two rows" to ALL OWNER-ASKS rows (1–6, growing); the plain-language sweep landed
  (CLASS-N gate titles → plain deletions, the U.C3/U.C6/U.C14 index cells rewritten
  cold-readable, FSM expanded at first use, "load-bearing conclusion" headers → "Why
  this band exists", tranche-code shorthand demoted to parenthetical cites); the
  C-band edge glyphs harmonized (→ precedes / ← depends / ↔ co-scheduled, stated
  once) killing the false 2-cycles (C1↔C3, C9↔C10, C11↔C13) and the one-sided
  C14→C16 edge.
- **2026-07-10** — **THE CONVERGENCE LOOP TERMINATED (OD-U18) + THE WAVE-SET DEVELOPMENT
  ORDER RATIFIED AND FOLDED.** Track B ran **five passes** (overall convergence
  73 → 97 → 96 → 98.4 → **98.8%**; ~7.9M subagent tokens across the research / prototype /
  critique / agglomerator fleets) and TERMINATED at pass 5 (`loop/PASS-5.md` — the RATIFIED
  "## The wave-set development order"). **Nine of the ten scored items stand at 100**
  (P1–P6, N1, N3, SPEC-B5); the one non-100 is **N2 at 88** — its cures green and
  independently verified twice (the critique's 13/13 + the agglomerator's `proof:bench-taxonomy`
  PASS), its residue a fully-measured, line-located, disposition-named comment/prose class
  **chartered into the meta-legacy wave (U.E9) under ruling 23**, witnessed by U.Z's
  certifying sweep (the un-earned 12 points convert to chartered impl work, never a
  self-certified 100 — the exact failure mode the loop existed to prevent). **The yield:**
  nine frozen evidence worktrees (`wf_ca7d0632-287-{10,11,12,16,17,18}` = P1–P6;
  `wf_645e7d37-d7f-{11,12,13}` = P7/N1 · P8/N2 · P9/N3, EVIDENCE never merged), four
  work-order artifacts (`N1-MOVE-SCRIPT.md`, `N2-DELETION-LEDGER.md`, `N3-EXCISION-LEDGER.md`,
  `loop/P3-FOLD-MAP.md`), **25 binding rulings**, and **SPEC-B5** as the governing spec
  (16 errata measured — E14 books D-GAP-5/6 to U.F, E15 the seven-subpath truth, E16
  `components.json` rm + sweep-as-measurement). **The wave-set development order (PASS-5 §7)
  is RATIFIED and FOLDED into the corpus:** `U.md` §2/§3 (the U.B keystone now cites
  `N1-MOVE-SCRIPT.md` §①–⑤ verbatim; the new **U.B14** small-module-inline wave; the
  ratified impl-sequencing line) + new **§7** (the loop's yield); `waves/U.B.md` (B1 = the
  N1 move script verbatim; U.B14; P5's recut TEMPLATE on transport / editors / scenes);
  `waves/U.C.md` (U.C8 absorbs P1 `287-10`; the P1/R11/R21 standing-law header; the
  constants fold on P2's byte-clean evidence `287-11`); `waves/U.E.md` (U.E7 = P3's
  fold-map, U.E8 = P4's suppression-dies-by-fixing archetype, new **U.E9** meta-legacy =
  N2's §§1+4 + the ruling-23 residue, new **U.E10** dogfood = N3's §§1–3 + R20);
  `waves/U.F.md` (the D-GAP-1/5/6 letter-row set + E15's seven-subpath ground truth);
  `waves/U.Z.md` (the four loop sweep witnesses on the terminal tree). **The owner-ride
  queue of FOUR** (`demo/DESIGN.md` KEEP · the `@`-dissolution one-word confirm · D1 easing
  canonicality · D5 oklab eyeball) **is the ONLY thing between the corpus and impl
  authorization** — which remains NOT authorized (ring-fence 4).

## State of play — THE U IMPL-DRIVE ENTRY ANCHOR (2026-07-11, written at compaction-prep)

**AUTHORIZATION: the owner's 2026-07-11 "Ratify all. Prepare for compaction and
tranche execution." (OWNER-ASKS row 8, OD-U22) — the impl drive begins immediately
post-compaction.** Everything needed to open the drive without re-derivation:

1. **The order of record**: `docs/tranches/U/loop/PASS-5.md` "## The wave-set
   development order" — RATIFIED, folded into the corpus (U.md §7 + the wave docs).
   The governing spec is `loop/SPEC-B5.md` (over the B1→B4 chain; 16 measured
   errata; 25 rulings). The sequencing one-liner: owner-rides DONE → U.H
   (characterization net FIRST) → the keystone (N1-MOVE-SCRIPT §①–⑤ verbatim,
   NOW UNGATED) → B/C recuts + carves with co-scheduled gate re-anchors (U.A's
   deletions first where a gate would re-anchor twice) → meta-legacy (U.E9) +
   dogfood (U.E10) waves ride the same passes → U.D after U.C settles hot paths →
   U.F letters from day 1 → U.G codex early → U.E terminal adjudication → U.Z
   (zero open deferrals; the 5.3.0 cut per OD-U8).
2. **The ride-queue ratifications (terminal)**: DESIGN.md KEEP · @-dissolution
   CONFIRMED (step ① executes in full: demo/@ + custom/ dissolve, components.json
   rm, the 72-file by-name sweep, ci.yml:496 re-word) · D1 = value.js bezierPresets
   canonical (23 rows adopt; 6 quart/quint documented-delta pending D-GAP-1; the
   gallery curve change is a recorded CORRECTION) · D5 oklab blessed.
3. **The frozen evidence worktrees (NEVER purge)**: wf_ca7d0632-287-{10,11,12,16,
   17,18} (P1 compile/easing carve · P2 inline sweep + fold-map · P3 CLAUDE.md
   fold + P3-FOLD-MAP · P4 known-violations kill · P5 component recut template ·
   P6 README) + wf_645e7d37-d7f-{11,12,13} (N1 one-home move + N1-MOVE-SCRIPT ·
   N2 meta-legacy + N2-DELETION-LEDGER · N3 dogfood + N3-EXCISION-LEDGER). The T
   blessed prototypes (wf_1e744f4d-2bb-{1,2,3}, wf_558e7859-5ca-3) also stay.
   "Absorbs" = the wave replays the frozen worktree's record, never re-derives.
4. **Standing law in EVERY wave**: P1's re-anchor template + R11's 8-class site
   sweep; R21 sweeps-are-measurements (+ ruling 24 by-name disposal); R16/R20 a
   measured refutation AMENDS the charter; the OD-U1 zero-loss fold-map on every
   deletion; per-stage compile-green commits (the T wall lesson); merge-U-first in
   every lane prompt; the orchestrator independently re-runs claimed gates on the
   merged tree (T4/T5); batches of 3 (rate walls are real — 3 walls hit in U-dev,
   all salvaged via committed stages + resumeFromRunId).
5. **Hard binds**: 5.3.0 at close (published surface additive-only — OD-U8);
   glass-ui 5.0.0 is the consume edge (watch for its publish; the five caps
   re-probe against its dist; the letter reconciles); value.js letter rows =
   D-GAP-1/5/6 exactly (consume-edge only, its tranche is active elsewhere);
   NO new standalone gates (net DOWN; OD-U10/U11 dropped); CLAUDE.md files DELETE
   (U.E7, delete-LAST per wave 6 coupling); the 10× CI target (≤4 min merge path)
   + zero-loss fold-map are U.A's exit criteria.
6. **Environment**: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui for
   browser gates; worktree node_modules via ln -sfn (NEVER git add); npm run
   build THEN gh-pages (build clobbers gh-pages); the roster false-red classes
   (worktree-glob contamination, roster contention, MODULE_NOT_FOUND masquerade,
   zsh glob-abort, pipe-masked exits) are in the T memory. Master is GREEN
   (deploy-of-record observed; keyframes.babb.dev serves 5.2.0; npm latest 5.2.0).
   The U corpus lives on `tranche-u-dev`; the impl branch forks master with the
   corpus merged (the T pattern: `tranche-u-impl`, draft PR onto master).
