# J.W5 — THE PUBLISHED SURFACE (the PUBLISH·DOCS boundaries · `proof:published-surface` · the honest minor · the doc-rot rewritten to the tree)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-J (P1·MED-risk,
  HIGH-honesty). The library is CORRECT (I closed the engine; the orchestration tier is
  demo-proven live — `scope-adversary.md §1` row 3); the DEFECT is at the two distribution
  boundaries: what `npm i` INSTALLS is a version two architectural eras stale, and what the
  DOCS claim is a tree that no longer exists. No engine, no demo, no gate-runtime change to
  the product — this wave installs ONE new boundary gate and rewrites prose to the tree. ·
  **Scope (docs + packaging + changesets + ONE gate; NO engine/demo/test source):**
  `README.md` (§Beyond CSS completion), root `CLAUDE.md` + `src/animation/CLAUDE.md` +
  `demo/CLAUDE.md` (rewrite to the tree), `vite.config.ts` (`publicDir: false` in production
  mode — BP-1), `.changeset/**` (the `tranche-j` minor consolidation), a new
  `scripts/proof-published-surface.mjs`, the supersession pointer on I's `PROGRESS.md §0`,
  and the stray `b2-gen-crash-easing-visibility.png` relocation. · **DAG-deps:** PARALLEL to
  all impl waves (file-disjoint from engine/demo/estate); its changeset cut is LAST among
  waves (`J.md §WAVE MAP` — "J.W5 is parallel to all (docs/packaging) with its changeset cut
  LAST among waves"); the version cut + npm publish stay USER-DOMAIN at **J.WZ**. The
  AnimationEngine drift clause (S1c, ENG-6) reads the engine's runtime surface but writes no
  engine source — READ-ONLY against `src/animation/`.

## §Provenance (the folded findings + the boundary-ORACLE)

- **`scope-adversary.md §0`** — the headline: *"J = SHIP THE PRODUCT. The library's public
  API has out-run its published version by a full orchestration tier (16 exports, four
  tranches E→I) and npm is frozen at `4.1.0`."* §6 dissents from the consolidation reading
  precisely because it leaves THIS gap open. The precept-extension this wave installs is
  named there: *"the gate-ORACLE precept, carried to the DISTRIBUTION boundary —
  `proof:published-surface` asserts that the thing a human `npm i`s exposes exactly the API
  the source declares and the README teaches. I proved 'green means a human USING it sees it
  work'; J proves 'the thing a human INSTALLS is the thing we describe.' Same precept, next
  boundary."* This is the J charter's **boundary-ORACLE extension** (`J.md §invariant set` —
  *"the PUBLISH oracle is the packed tarball's surface == the source's public exports == the
  README's taught API (`proof:published-surface`); the DOCS oracle is every structural claim
  in CLAUDE.md/README verifiable against the tree"*).
- **`scope-adversary.md §1`** — the 16-export inventory (the decisive evidence row 2):
  `src/animation/index.ts` exports `SpringProgress`, `springLinearStops`,
  `springTimingFunction`, `RAFPlayback`, `stagger`, `flip`/`flipShared`, `drag`/`Draggable`,
  `decay`/`decayRest`, `Sequence`, the `animate` front-door types, `MotionPathOptions`,
  `DrawSVGOptions` — accreted E (`4ee8e34`) → F (`4cf7adb`) → G (`3d352a3`) → never
  published. The `proof:published-surface` concept (§0-§2): the npm tarball's surface == the
  source's public exports == the README's taught API; one clean re-runnable oracle
  (`npm view`, `npm pack --dry-run`, the changeset diff).
- **`build-packaging-release.md`** — the packaging ground truth:
  - **BP-1 (P1):** `dist/_redirects` (25 B, from `public/_redirects:1` `/* /index.html 200`)
    ships in `npm pack --dry-run` and rides every publish. Vite 8 lib mode copies `publicDir`
    (default `"public"`) into `outDir` because the production config block
    (`vite.config.ts:283-337`) sets neither `publicDir: false` nor a separate library `outDir`.
    Cargo-cult leak — CF Pages routing material in a library tarball. Fix:
    `publicDir: false` in the production-mode block.
  - **§1 exports-map verification:** `package.json:21-27` `"."` → `types`/`import`/`default`,
    ESM-only (`vite.config.ts:291` `formats: ["es"]`); `dist/keyframes.d.ts` rolls up the
    public symbols and `ci.yml:68-98` verifies 15/15. The hash-named chunks
    (`engine-*.js`, `animate-*.js`, `motion-path-*.js`, `draw-svg-*.js`, `springTimingFunction-*.js`,
    `timeline-*.js`) are legitimate lazy-load splits from the `loadAnimationEngine()` dynamic
    boundary (`index.ts:197-220`) — NOT leakage. **The tarball is correct EXCEPT `_redirects`.**
  - **§3 changeset semantics:** two PENDING changesets — `.changeset/tranche-h.md` (`patch`,
    `frame-compiler.ts` blank-selector belt + demo-only) and `.changeset/tranche-i.md`
    (`patch`, `format.ts` serialize-from-template + `group.ts` no-op transform default + the
    value.js `^0.11.1 → ^0.11.2` floor). Under changeset collapse they stack `4.1.0 → 4.1.1
    → 4.1.2`. The §3 recommendation: ship **`4.2.0` (minor)** — the value.js empty-input
    floor advance is a contractual tightening protecting consumers who pin value.js
    themselves; advertising it as minor is the honest signal. *(BP-2/BP-3/BP-9/BP-10 — the
    CLAUDE.md CJS/test-count rot, the robots.txt dead Sitemap, the empty `author` field —
    fold into S3/S4 below.)*
- **`legacy-sweep.md` LS-1..8 (P1, category I) + LS-12..19 (P2)** — the full stale-claim
  inventory, per doc, every claim probed against `ls`:
  - **LS-1 (`CLAUDE.md:30–49`):** the ENTIRE `src/parsing/` + `src/units/` + `src/easing.ts`
    + `src/math.ts` + `src/utils.ts` subtree is phantom — `ls src/` → `animation/` + `env.d.ts`
    only. The referenced `parsing/CLAUDE.md` + `units/CLAUDE.md` do not exist.
  - **LS-2 (`CLAUDE.md:90`):** the primary-exports list omits 17+ symbols.
  - **LS-3 (`CLAUDE.md:52–61`):** the demo tree carries 4 PHANTOM dirs (`simple/`, `balls/`,
    `boxes/`, `bench/`) and OMITS 5 real ones (`app/`, `easing/`, `motion-path/`, `sequence/`,
    `spring/`).
  - **LS-4 (`CLAUDE.md:63–78`):** the test file list claims "15 files / 261 tests" — actual
    **69 files / 685 tests** (`tests-bench.md §State of the Fleet`); names 2 phantom files
    (`parsing.test.ts`, `units.test.ts`), omits 54.
  - **LS-5 (`src/animation/CLAUDE.md` file tree):** 9 module files unlisted — `stagger.ts`,
    `flip.ts`, `drag.ts`, `decay.ts`, `sequence.ts`, `draw-svg.ts`, `motion-path.ts`,
    `animate.ts`, `frame-compiler.ts` (all exist, all exported from `index.ts`).
  - **LS-6 (`demo/CLAUDE.md:26–29,109–115`):** the `@/composables/` section is entirely
    wrong — claims 5 files; `ls` → `gestureSelectSuppression.ts`, `useDragScrub.ts` only.
  - **LS-7 (`demo/CLAUDE.md:25`):** claims "shadcn-vue (50+)" UI components — `ls
    demo/@/components/ui/` → ONE dir `menubar/` (16 files); the ~50 migrated to glass-ui. 3×
    wrong.
  - **LS-8 (`demo/CLAUDE.md:131–138`):** Key Dependencies OMIT `@mkbabb/glass-ui`
    (`package.json:173` `~3.9.0`, a first-class pinned dep used throughout the demo).
  - **The verdict the precept demands (`J.md §MANDATE`):** *"the doc-rot dies by REWRITING
    the docs to the tree — NOT annotating the lies"* — *"stale docs are legacy and die with
    the rewrite."* These three CLAUDE.md files are REWRITTEN to the tree, never annotated.
- **`tests-bench.md` TB-4 (P1):** `CLAUDE.md:63` "15 files / 261 tests" vs actual 69 files /
  685 tests, listing 3 deleted files (`editor-parsing.test.ts`, `parsing.test.ts`,
  `units.test.ts` — deleted in `58e7576`); undercounts bench (claims 3, actual 8 —
  `interpolation.bench.ts`, `parser.bench.ts`, `playwright.bench.ts`, `compile.bench.ts`,
  `computed-real-dom.bench.ts`, `interp-buffer.bench.ts`, `spring-tick.bench.ts`,
  `sync-step.bench.ts`). The real count `685 = 683 pass + 2 it.fails` (`vitest list`).
- **`engine-core.md` ENG-5 (P1) + ENG-6 (P2):**
  - **ENG-5:** root `CLAUDE.md:90` "Primary exports" reads as if `Animation`,
    `CSSKeyframesAnimation`, `AnimationGroup`, … `getAnimationId` are STATIC named exports —
    they are HEAVY-side, reachable ONLY via `loadAnimationEngine()` (`index.ts:114-220`); the
    doc never mentions `loadAnimationEngine`/the static-dynamic boundary
    (`grep -n loadAnimationEngine CLAUDE.md` → NONE) and omits the LIGHT-surface
    `SpringProgress`/`RAFPlayback`. The rewrite (S3) must teach the boundary.
  - **ENG-6:** the hand-maintained `AnimationEngine` interface (`index.ts:145-177`, "Spelled …
    because API Extractor cannot resolve a `typeof import()`") has NO drift gate: a new
    `export const` added to `engine.ts` is returned at RUNTIME by the `Object.assign` in
    `loadAnimationEngine` (`:197-220`) but silently absent from the TYPE. No script asserts
    the interface keys ≡ the runtime keys. S1c gates this.
- **`final-vs-tree-inv-epsilon.md` FVT-4 (= the changeset finding P1-2, §B):** §8 of I's FINAL
  is silent on `.changeset/tranche-i.md` (mentions only `tranche-h.md`); the I changeset itself
  flags the unresolved SemVer question (*"The dependency floor move is the reason a maintainer
  may elect to ship this as a `minor`"*). Disposition FOLD: *"J's close must reconcile BOTH
  pending changesets and resolve the patch-vs-minor tier (a real open USER-DOMAIN decision,
  not a punt). P-invariant-28: this deferral needs a terminal home in J."* Plus **P2-1 §B**
  (the supersession pointer — the I FINAL §8 staleness facts are now historically stale and
  the FINAL carries no "superseded by WZ" pointer): J docs cross-link them (S6). Plus
  **LS-12 (legacy-sweep §H):** the untracked `b2-gen-crash-easing-visibility.png` at repo
  root — a diagnostic from the I.B2 investigation, generated in the root by mistake, never
  moved or committed (`git status` → `?? b2-gen-crash-easing-visibility.png`). Relocate/delete
  in S6.

## §The state, verified (file:line / command / live anchors)

- **The version freeze:** `package.json:3` `"version": "4.1.0"`; `npm view
  @mkbabb/keyframes.js version` → `4.1.0`; `git tag` tops at `v4.1.0`
  (`scope-adversary.md §1` rows 1, build-packaging §3). The published library predates the
  ENTIRE orchestration tier.
- **The 16-export orchestration tier, light/heavy split (read first-hand from
  `src/animation/index.ts`):**
  - **LIGHT static surface (runtime value exports, value.js-free — `index.ts:30-80`):**
    `NumericAnimation`, `SmoothProgress`, `SpringProgress`, `springLinearStops`,
    `springTimingFunction`, `ElementMorph`, `Timeline`, `ScrollTimeline`, `ManualTimeline`,
    `createNativeTimeline`, `RAFPlayback`, `stagger`, `flip`, `flipShared`, `drag`,
    `Draggable`, `decay`, `decayRest`, `Sequence`, `resolveEasing`, `toEasing`,
    `AnimationOptionError`, `UnknownEasingError`.
  - **HEAVY surface (reached ONLY via `loadAnimationEngine()` — `index.ts:145-220`,
    `AnimationEngine` keys):** `Animation`, `CSSKeyframesAnimation`, `AnimationGroup`,
    `getAnimationId`, `getTimingFunction`, `resolveKeyframes`, `animate`, `MotionPath`,
    `fromMotionPath`, `DrawSVG`, `fromDrawSVG`, `presets`, `DIRECTIONS`, `FILL_MODES`,
    `defaultOptions`, `defaultLayerConfig`.
- **What the README §Beyond CSS teaches today (verified `grep -nE "^#{1,4} " README.md`):**
  exactly FOUR dedicated subsections — `NumericAnimation` (`:335`), `SmoothProgress`
  (`:360`), `ElementMorph` (`:373`), `Timeline` (`:392`). The §"Beyond CSS" intro
  (`:331-333`) frames "general-purpose interpolation primitives." `decay`/`Sequence`/
  motion-path/draw-svg/spring/stagger/flip/drag have ZERO dedicated coverage
  (`scope-adversary.md §1` row 5, `SCOPE-5`).
- **The README primitive deficit (~13 primitives, 4 taught):** the ~13 general-purpose
  primitives a `npm i` user reaches are `NumericAnimation`, `SmoothProgress`, `SpringProgress`,
  `springLinearStops`, `springTimingFunction`, `ElementMorph`, `Timeline`/`ScrollTimeline`/
  `ManualTimeline`, `RAFPlayback`, `stagger`, `flip`/`flipShared`, `drag`/`Draggable`,
  `decay`/`decayRest`, `Sequence` (the LIGHT tier) + the HEAVY single-call `animate` front
  door + `MotionPath` + `DrawSVG`. README teaches 4 — the rest are an API the README cannot
  teach.
- **The tarball leak:** `npm pack --dry-run` lists `dist/_redirects 25 B`
  (`build-packaging §1`); `public/_redirects:1` = `/*    /index.html    200`;
  `package.json:28` `"files": ["dist"]`; the production block `vite.config.ts:283-337` sets
  neither `publicDir: false` nor a library `outDir`.
- **The two patch changesets:** `.changeset/tranche-h.md` (`"@mkbabb/keyframes.js": patch`)
  and `.changeset/tranche-i.md` (`"@mkbabb/keyframes.js": patch`) — the I one's own body:
  *"The dependency floor move is the reason a maintainer may elect to ship this as a `minor`
  instead of a `patch` — version owner's call."*
- **The AnimationEngine drift surface:** `index.ts:145-177` (interface) vs `:197-220`
  (`loadAnimationEngine`'s `Object.assign({animate, MotionPath, fromMotionPath, DrawSVG,
  fromDrawSVG, presets}, engine)`). The interface is hand-spelled; nothing asserts parity
  (ENG-6).
- **The supersession gap:** I's `PROGRESS.md §0` (and FINAL §8) carry DEV-phase staleness
  facts (`master` "10 commits behind" — now 0; the live demo "the broken H tip" — now
  `4072af9`) with NO "superseded by WZ" pointer (`final-vs-tree FVT P2-1`).
- **The stray PNG:** `git status` → `?? b2-gen-crash-easing-visibility.png` at repo root;
  `.gitignore` has no `*.png` rule (`legacy-sweep §H`).

## §Goal

The PUBLISH boundary and the DOCS boundary each tell the truth — proven, not asserted. ONE
new boundary gate (`proof:published-surface`) makes the three-way agreement
machine-checkable: the packed tarball's file set == the `files` declaration (no `_redirects`,
the d.ts complete), AND every `index.ts` public export is reachable to a `npm i` user through
EITHER a README-taught snippet OR the documented-surface manifest, AND the hand-maintained
`AnimationEngine` interface keys ≡ the runtime `loadAnimationEngine()` surface. The README
§Beyond CSS grows from 4 to the full ~13-primitive roster, with EVERY taught snippet
EXECUTING against the built `dist` (the docs oracle is runnable truth, not prose). The
three CLAUDE.md files are REWRITTEN to the tree — the phantom subtree, the phantom demos,
the wrong counts, the missing boundary all corrected (never annotated). `_redirects` leaves
the tarball at the seam (`publicDir: false`), not by a periodic `rm`. The two patch
changesets consolidate into ONE honest `tranche-j` MINOR that names the E→I orchestration
tier export-by-export; the version cut + publish remain USER-DOMAIN at WZ. The single root
is: **what `npm i` installs and what the docs claim must each equal what the tree holds** —
and a gate that BITES on any divergence is the precondition.

## §Scope

- **S1 — `proof:published-surface` (the boundary-ORACLE's PUBLISH oracle; the headline).**
  Locus: a new `scripts/proof-published-surface.mjs`. A THREE-WAY oracle, all three clauses
  load-bearing CORRECTNESS-tier (the published artifact a human installs is the product
  property a human would check — the gate-ORACLE precept at the publish boundary, per
  `J.md §invariant set`):
  - **S1a — tarball == `files` declaration.** Run `npm pack --dry-run --json` (programmatic,
    no network) and assert the emitted file set is EXACTLY the `dist/` build output declared
    by `package.json:28 "files": ["dist"]` — and that `dist/_redirects` (or ANY
    `public/`-origin non-library asset) is ABSENT, AND `dist/keyframes.d.ts` is present and
    non-empty (the d.ts roll-up — `ci.yml:68-98` already verifies 15/15 symbols; this clause
    asserts the file's PRESENCE in the packed surface). **BITE:** reds TODAY — `_redirects`
    leaks (`build-packaging §1`); greens on S5's `publicDir: false`.
  - **S1b — every `index.ts` public export ∈ (README-taught ∪ documented-surface manifest).**
    Parse the public export set from `src/animation/index.ts` (the LIGHT static exports +
    the HEAVY `AnimationEngine` keys) — value exports only, `import type` erased exports are
    excluded by construction. For each export, assert it is EITHER (i) taught by a dedicated
    README §Beyond CSS / §Animation subsection (matched by a normalized heading or an
    in-snippet identifier reference) OR (ii) enumerated in a single committed
    **documented-surface manifest** (`docs/published-surface.md` — the authoritative roster:
    every public export, its tier LIGHT/HEAVY, and either its README anchor or a one-line
    "intentionally manifest-only" note). NO export may be in NEITHER set — an untaught,
    unmanifested export reds the gate. **BITE (born-RED TODAY):** the README teaches 4 of
    ~13; the following LIGHT-tier value exports are taught NOWHERE and absent from any
    manifest — they RED the gate today (enumerated): **`SpringProgress`**,
    **`springLinearStops`**, **`springTimingFunction`**, **`RAFPlayback`**, **`stagger`**,
    **`flip`/`flipShared`**, **`drag`/`Draggable`**, **`decay`/`decayRest`**, **`Sequence`**
    (plus the HEAVY **`animate`**, **`MotionPath`/`fromMotionPath`**, **`DrawSVG`/`fromDrawSVG`**
    front doors). Greens only when S2 teaches them and/or the manifest enumerates them.
    *(The `_redirects` leak (S1a) AND these untaught exports (S1b) are the two born-RED
    witnesses TODAY, per `J.md §WAVE MAP` — "witnessed born-RED on the CURRENT tree (the
    `_redirects` leak + the 9 untaught exports red it today)".)*
  - **S1c — the AnimationEngine interface drift clause (ENG-6).** Assert the hand-maintained
    `AnimationEngine` interface keys (`index.ts:145-177`) ≡ the runtime keys returned by
    `loadAnimationEngine()` (the `Object.assign({animate, MotionPath, fromMotionPath, DrawSVG,
    fromDrawSVG, presets}, engine)` union, `:197-220`) — by importing the built engine
    chunk(s) under Node and diffing `Object.keys` against the interface's declared members
    (extracted from the d.ts roll-up). **BITE:** reds on a tree where a new `engine.ts`
    `export const` is returned at runtime but missing from the interface (or vice-versa);
    greens when they agree. This is the drift gate ENG-6 names — the hand-maintained
    interface can no longer silently diverge from the runtime surface. **WHY:** §6 of
    `engine-core.md` — *"An export added to `engine.ts` is returned at RUNTIME but silently
    absent from the TYPE. No `scripts/proof-*.mjs` asserts the interface ≡ the union."*
  - **WHY the gate, not a manual audit:** `scope-adversary §0` — the precept I installed
    inward ("green means a human USING it sees it work") has an OTHER half no gate covered:
    "the thing a human INSTALLS is the thing we describe." This gate IS that half. The oracle
    actuates the SHIPPED artifact (the packed tarball + the declared public surface), not a
    proxy — gate-ORACLE-compliant at the publish boundary.

- **S2 — README §Beyond CSS completion (the DOCS oracle, runnable).** Locus: `README.md`
  §Beyond CSS (after `:392`'s `Timeline`). Author dedicated subsections for the untaught
  ~9 primitives **with the care of the existing 4** (each: a one-line intent, the signature,
  a minimal runnable snippet, the options line) — the roster:
  - **`SpringProgress`** — physics-driven progress (the spring engine under `drag`/`decay`);
    **`springLinearStops`** + **`springTimingFunction`** — the CSS `linear()` stop generator
    + the timing-function builder (the value.js-free light helpers).
  - **`RAFPlayback`** — the single rAF owner (the bind-proof playback primitive — I.W1);
    teach the `const s = pb.stop; s()` bind-safe destructure as the canonical example.
  - **`stagger`** — the pure delay generator; **`flip`/`flipShared`** — FLIP composition over
    `ElementMorph`; **`drag`/`Draggable`** — the spring-backed drag primitive;
    **`decay`/`decayRest`** — inertial decay + its rest predictor; **`Sequence`** — the
    TEMPORAL orchestrator driving `Animation.advanceTo` over a master clock.
  - **The HEAVY front doors** (taught under §Animation or a §"The dynamic engine" note,
    since they ride `loadAnimationEngine`): **`animate`** (the single-call dispatch +
    auto-target + auto-play), **`MotionPath`/`fromMotionPath`** (CSS-native offset-path),
    **`DrawSVG`/`fromDrawSVG`** (stroke-dashoffset sweep), and the README must teach the
    `loadAnimationEngine()` boundary itself (it is HOW a consumer reaches the heavy tier).
  - **The EXECUTABLE-snippet rule (the docs oracle made runnable — `J.md §WAVE MAP`: "The
    README examples EXECUTE … the docs oracle is runnable truth, not prose").** Spec the
    runner: a `scripts/proof-readme-runs.mjs` clause OF `proof:published-surface` (or a
    sibling wired into the correctness tier) EXTRACTS every fenced ` ```ts ` snippet from
    `README.md` §Beyond CSS / §Animation that is tagged runnable, and EXECUTES it against the
    BUILT `dist/` (import from `./dist/keyframes.js`, `await loadAnimationEngine()` where the
    snippet uses the heavy tier, run under Node with a minimal jsdom/`globalThis` shim for
    the DOM-touching ones), asserting NO throw and — where the snippet asserts a value (e.g.
    the existing `anim.at(0.5) // => { x: 50, y: 100, opacity: 0.5 }`) — that the comment's
    stated result MATCHES the computed value. **The MINIMUM-count clause (un-gameable by
    under-tagging):** the runner MUST assert the count of runnable-tagged §Beyond CSS /
    §Animation snippets is ≥ the count of newly-taught primitives in the S2 roster (the ~9
    LIGHT subsections) AND ≥1 per HEAVY front door taught — derived from the taught roster,
    NOT a frozen integer (count the subsections teaching an S1b export; the runnable-snippet
    count must meet that floor). Today the README carries 12 ` ```ts ` fences but only ONE
    `// =>` assertion (the `anim.at(0.5)` one — verified `grep -cF '// =>' README.md` → 1),
    so WITHOUT this floor a runner that iterates only the `runnable`-tagged set passes
    vacuously the instant IMPL tags zero snippets runnable — the absent-element / note()-not-
    fail false-green the I lesson forbids. The floor pins the green to the snippets actually
    existing AND running. **BITE:** reds on a snippet that imports a non-existent export, or
    whose stated `// =>` result is wrong against the built dist, OR on a taught primitive
    with NO runnable snippet (count below the roster floor — the empty-set degenerate case
    REDs); greens when every taught snippet runs, agrees, and the runnable set covers the
    roster. **WHY:** a README that teaches an API the dist cannot run is the publish-boundary
    analogue of the source-shape gates I retired — the snippet must EXECUTE, not merely read
    plausibly, and it must EXIST and be RUN, not silently left un-tagged.

- **S3 — the doc-rot purge (REWRITE to the tree, never annotate — LS-1..8, ENG-5, TB-4,
  BP-2/3).** Locus: `CLAUDE.md` (root), `src/animation/CLAUDE.md`, `demo/CLAUDE.md`. Each is
  REWRITTEN to the tree as it stands at the impl date — the precept is rewrite, not
  annotation (`J.md §MANDATE`: "the doc-rot dies by REWRITING the docs to the tree — NOT
  annotating the lies"). The per-file scope:
  - **Root `CLAUDE.md`:**
    - **The §Project Tree (LS-1):** DELETE the phantom `src/parsing/` + `src/units/` +
      `src/easing.ts` + `src/math.ts` + `src/utils.ts` subtree (and the phantom
      `parsing/CLAUDE.md`/`units/CLAUDE.md` pointers). The real `src/` is `animation/` +
      `env.d.ts` only; `src/animation/` holds 28 entries — enumerate the real set
      (`engine.ts`, `group.ts`, `frame-compiler.ts`, `playback.ts`, `numeric.ts`, `smooth.ts`,
      `spring.ts`, `springLinearStops.ts`, `springTimingFunction.ts`, `morph.ts`,
      `timeline.ts`, `stagger.ts`, `flip.ts`, `drag.ts`, `decay.ts`, `sequence.ts`,
      `animate.ts`, `motion-path.ts`, `draw-svg.ts`, `animations.ts`, `constants.ts`,
      `utils.ts`, `format.ts`, `adapter.ts`, `waapi.ts`, `index.ts`, `internal/`, …) — the
      authoritative count is read from `ls src/animation/` at impl time, not transcribed
      from here.
    - **The §Library Entry Point + Primary exports (LS-2, ENG-5):** rewrite to teach the
      STATIC/DYNAMIC boundary — the LIGHT static surface (the value.js-free named exports) vs
      the HEAVY surface reached ONLY through `loadAnimationEngine()` (`Animation`,
      `CSSKeyframesAnimation`, `AnimationGroup`, `getAnimationId`, `animate`, `MotionPath`,
      `DrawSVG`, `presets`, the option constants). The current list reads as if the heavy
      classes are static named exports — they are not (ENG-5). Name `loadAnimationEngine`.
    - **The §Build comment (LS-13, BP-2):** correct `npm run gh-pages  # demo (cube) → dist/`
      to the real `demo/app/` multi-scene SPA → `dist/gh-pages/`; DELETE the stale
      `keyframes.cjs` claims (`:8`, `:88`) — the package is ESM-only (`formats: ["es"]`, no
      `.cjs` emitted; CJS removed in `e49855d`); correct the `npm run dev` port if the
      transcribed `:8080` is wrong (verify at impl time).
    - **The §Project Tree demo + test + bench sections (LS-3, LS-4, TB-4, LS-14):** rewrite
      the demo tree to the real `ls demo/` (`@`, `amiga`, `app`, `cube`, `easing`,
      `motion-path`, `playground`, `sequence`, `spring`, `square` + `CLAUDE.md`/`DESIGN.md`);
      DELETE the phantom `simple/`/`balls/`/`boxes/`/`bench/`. Replace "15 files / 261 tests"
      with the real count read at impl time (currently 69 files / 685 tests = 683 pass + 2
      `it.fails`); DELETE the phantom `parsing.test.ts`/`units.test.ts`/`editor-parsing.test.ts`.
      Correct the bench count (3 → 8). **Do NOT hand-transcribe a count that will re-rot** —
      where feasible the rewritten section states the count as "read `ls test/*.test.ts |
      wc -l`" rather than a frozen integer, so the doc cannot drift again.
    - **The §Dependencies (LS-13):** correct the `@mkbabb/parse-that` role — it is the
      cross-realm nominal-type bridge in `src/animation/utils.ts:1,251,258`, NOT the
      `@keyframes` grammar (the grammar lives in value.js).
  - **`src/animation/CLAUDE.md` (LS-5):** ADD the 9 unlisted module files (`stagger.ts`,
    `flip.ts`, `drag.ts`, `decay.ts`, `sequence.ts`, `draw-svg.ts`, `motion-path.ts`,
    `animate.ts`, `frame-compiler.ts`) to the file-tree section, each with its one-line role.
  - **`demo/CLAUDE.md` (LS-6/7/8, LS-15..19):** rewrite the `@/composables/` section to the
    real two files (`gestureSelectSuppression.ts`, `useDragScrub.ts`); correct "shadcn-vue
    (50+)" to the real single `ui/menubar/` (16 files, the rest migrated to glass-ui); ADD
    `@mkbabb/glass-ui ~3.9.0` to Key Dependencies; correct the `stores/` listing
    (`scenePlayback.ts` is phantom — split into `sceneMachine.ts` + `scenePlaybackAdapters.ts`;
    ADD `controlSurfaceDFA.ts`, `useSceneMachine.ts`); DELETE the phantom `CubicBezierControls.vue`,
    `ColorInterpolationPanel.vue`, `IconTooltip.vue`, `LabeledInput.vue`, `LabeledSelect.vue`,
    `utils.css`, the `animationStores/` dir name (it is `stores/`).
  - **WHY rewrite not annotate:** stale docs are legacy code; the no-legacy precept forbids
    leaving the lie beside its correction. The rewrite IS the deletion (`J.md §MANDATE`).
  - **The doc-rot is gated by the existing inv-ε discipline + the closure motion, NOT a new
    runtime gate** (these are prose facts, not product behavior) — the §Hard gate's tree-claim
    corroborator (S-Hard clause d) spot-checks the headline structural claims; the doc oracle
    proper is S2's executable-snippet runner over the README, which IS a runtime gate.

- **S4 — tarball hygiene (BP-1).** Locus: `vite.config.ts:283` (the production-mode config
  block). Add `publicDir: false` to the production (library) mode so Vite stops copying
  `public/_redirects` into `dist/`. **WHY at the seam, not a periodic `rm`:** the leak is
  structural (Vite 8 lib mode copies `publicDir` into `outDir` absent the flag) — the fix is
  the flag, not a recurring clean. S1a then proves it stays out. *(Fold the adjacent
  metadata hygiene the build-packaging lane surfaced in the SAME motion: BP-10
  `package.json:156 "author": ""` → `"Mike Babb <mike@babb.dev>"`; BP-9 the dead
  `robots.txt:4` github.io Sitemap directive (the site is `keyframes.babb.dev`, no
  `sitemap.xml` exists) — delete it. These are tarball/site-metadata hygiene in the same
  publish-boundary band; each labeled HYGIENE, none gating the wave GREEN.)*

- **S5 — the changeset consolidation (the honest minor; FVT-4/SCOPE-3/DL-8).** Locus:
  `.changeset/`. AUTHOR ONE new `.changeset/tranche-j.md` declaring
  `"@mkbabb/keyframes.js": minor` whose body NAMES the E→I orchestration tier
  **export-by-export** — the published surface this version actually adds:
  `SpringProgress`, `springLinearStops`, `springTimingFunction`, `RAFPlayback`, `stagger`,
  `flip`/`flipShared`, `drag`/`Draggable`, `decay`/`decayRest`, `Sequence`, the `animate`
  single-call front door, `MotionPath`/`fromMotionPath`, `DrawSVG`/`fromDrawSVG`, and the
  `loadAnimationEngine` dynamic boundary — plus the two BUGFIXES the consumed patches carried
  (the `frame-compiler.ts` blank-selector belt from `tranche-h.md`; the `format.ts`
  serialize-from-template + `group.ts` no-op-transform default + the `@mkbabb/value.js
  ^0.11.1 → ^0.11.2` floor advance from `tranche-i.md`). CONSUME the two patches: DELETE
  `.changeset/tranche-h.md` and `.changeset/tranche-i.md` in the SAME motion (they are
  superseded — leaving them beside the minor would stack `4.1.0 → 4.1.1 → 4.1.2 → 4.2.0`
  and re-paper the very dishonesty the wave closes). **WHY minor, not patch:** the tier is a
  FORENSIC question (`scope-adversary §4` — "SemVer must be EARNED … The E→I additions are
  ADDITIVE (new exports), which is `minor`"); the additions are purely additive new exports
  (no broken signature ⇒ not major) AND the value.js floor advance is a contractual
  tightening (`build-packaging §3` — "advertising it as `minor` is the honest signal"). The
  honest minor is the de-legacy move (`scope-adversary §3` — "Cutting the real version IS
  the de-legacy move").
  - **The version cut + npm publish stay USER-DOMAIN at J.WZ.** This wave AUTHORS the
    changeset; it does NOT run `changeset version`, does NOT tag, does NOT publish. The
    version owner is **Mike Babb (`mike@babb.dev`)**, confirm-first (`J.md §chronic fold —
    USER-DOMAIN`); the publish leg fires at WZ via `release.yml` (tag-triggered:
    `check:lib → build:lib → test → proof:boundary → npm publish --provenance`) after a green
    CI. The wave's deliverable is the HONEST changeset + the surface gate + the docs, not the
    registry mutation.
  - **`proof:deps-current` floor advances (BP-5/BP-6) are OWNED BY J.W3, not here** — recorded
    so this wave does not silently narrow: the value.js floor `0.11.1 → 0.11.2` and glass-ui
    `3.5.1 → 3.9.0` that protect the changeset's contractual claims live in the estate wave
    (`J.md §J.W3`). S5 only names them as the changeset's contractual premise.

- **S6 — the supersession annotations (pointer-only) + the stray PNG relocation (FVT P2-1,
  LS-12).** Locus: I's `docs/tranches/I/PROGRESS.md §0` (and FINAL §8) + the repo root.
  - **The supersession pointer (pointer-only, NOT a rewrite of frozen history):** I's
    `PROGRESS.md §0` and FINAL §8 are FROZEN DEV/close artifacts (the I close cannot be
    re-litigated); add a single one-line "**Superseded by:** `docs/tranches/I/impl/I-WZ-verify.md`
    (the post-close deploy/CI state) + Tranche J" pointer at the head of each so a future
    reader is not misled by the now-stale "master 10 commits behind" / "live demo is the
    broken H tip" facts (`final-vs-tree P2-1` — "the authoritative current deploy state is
    `I-WZ-verify.md`, not FINAL §8"). POINTER-ONLY — the body of the frozen artifact is not
    edited; the false-when-read facts are routed to their correction, not deleted (these are
    historical records, RECORD-tier, not live legacy).
  - **The stray PNG (LS-12):** relocate `b2-gen-crash-easing-visibility.png` from the repo
    root to its intended `docs/tranches/I/audit/investigate/shots/` home (the path
    `docs/tranches/I/audit/investigate/b2-dfa-gen-crash.md:73` already references), OR delete
    it as a transient diagnostic — DEFAULT: relocate to the documented `shots/` path (it is a
    cited investigation artifact, not pure noise). Add a `/*.png` guard to `.gitignore` for
    root-level PNGs so a future stray diagnostic cannot re-accrete at the root. **WHY:**
    `git status` shows it untracked; it is the one orphan file at the repo root
    (`legacy-sweep §H`).

- **S7 — the spurious `vue ^3.5.0` peerDependency removal + the peer-dep honesty clause (ED-5;
  the framework-agnostic-library boundary lie · the frontier ecosystem fold).** Locus:
  `package.json:161-162` (the `"peerDependencies": { "vue": "^3.5.0" }` block). DELETE the block —
  the shipped library is Vue-FREE: `grep -rn "from 'vue'" src/` finds the ONLY `vue` reference in
  `src/` is the dev-only `*.vue` SFC module-type shim in `src/env.d.ts` (a TypeScript declaration,
  NOT a runtime import); the dist imports zero framework code. `vue` correctly STAYS in
  `devDependencies` (`package.json:217`, the demo's runtime) — only the spurious PEER declaration
  dies, so the demo build is untouched while a `npm i @mkbabb/keyframes.js` consumer stops being
  forced to satisfy a Vue peer the library never touches. This is the
  publish-boundary-lies-about-the-surface shape J.W5 exists to kill, one fold the existing BP band
  ($S4$: `_redirects`/`author`/`robots.txt`) does NOT name (`audit/frontier/ecosystem-distribution.md`
  ED-5 / §0.2 — "a latent distribution-boundary defect J.W5 does NOT name … exactly the
  publish-boundary-lies-about-the-surface shape J.W5 exists to kill, one fold short"). **WHY:** a
  framework-agnostic interpolation library that declares a framework peer FORCES every consumer's
  resolver to reckon with a dependency the runtime never imports — a declared peer that is not a
  real runtime peer is the dependency-graph analogue of a README teaching an API the dist cannot
  run. **The proof:published-surface extension — the peer-dep honesty clause (clause (f), below):
  every declared `peerDependencies` entry MUST be a real runtime peer** — imported (statically or
  dynamically) by the SHIPPED `dist/`, not merely by the demo or the dev shim — so the gate that
  proves the tarball/exports/README honest also proves the DEPENDENCY DECLARATION honest. **NO
  workaround:** the peer is DELETED, not narrowed to an `optionalPeer` or papered with a
  `peerDependenciesMeta` flag — the library has no Vue peer, optional or otherwise; the honest
  declaration is its ABSENCE. *(Per `package.json:166-168` in the lane's transcription; the
  authoritative line at impl is `package.json:161-162` — verified at authoring 2026-06-10:
  `"peerDependencies": { "vue": "^3.5.0" }` is the only peer block, `src/env.d.ts` the only `src/`
  vue reference, `vue ^3.5.35` present in `devDependencies:217`.)*

- **S8 — the WAAPI-Level-2 positioning paragraph + correspondence table (WL2-A; the production
  GroupEffect/SequenceEffect the platform never shipped · docs-only · API-mimicry FORBIDDEN).**
  Locus: `README.md` §Beyond CSS — the `AnimationGroup`/`Sequence` subsections S2 authors. Add a
  short positioning paragraph + a correspondence table, as PURE DOCUMENTATION (zero API change,
  zero new surface): **`AnimationGroup` and `Sequence` ARE the production realization of Web
  Animations Level 2's `GroupEffect`/`SequenceEffect` model — semantics the platform has never
  shipped in ANY browser (polyfill-only, L2 Working Draft) — over real WAAPI children where
  eligible, with weighted blend and a GSAP-class transport the spec lacks.** The correspondence
  table maps L2 concept → kf surface so the naming rationale is legible without changing one API
  line: `GroupEffect.parallel` → `AnimationGroup`; `SequenceEffect` / `align:sequence` → `Sequence`
  auto-append; `EffectTiming.align:start` → `Sequence`'s `at:0`
  (`audit/frontier/waapi-level-2.md` WL2-A / §3). **The KILL rider (BINDING — no workaround):
  API-mimicry of the unshipped L2 spec is FORBIDDEN.** kf MUST NOT rename/restructure its public
  API to mirror L2 class shapes, MUST NOT add an `L2`-named class tree
  (`ParallelEffect`/`StaggerEffect`/`GroupEffect` types), MUST NOT polyfill the missing native API
  — the spec is mid-redesign and `SequenceEffect` is PROPOSED FOR DELETION upstream (CSSWG
  `csswg-drafts #9557` — fold sequential ordering into an `EffectTiming.align` option, removing the
  `SequenceEffect` class; a competing declarative-CSS GroupEffect direction `#9554` may win
  instead). Pinning kf's surface to a class name the CSSWG is actively removing would be
  legacy-chasing — the opposite of frontier; `sequence.ts:5-30` already records the principled
  naming, honor it. **WHY a docs fold, not a wave:** the capability is SHIPPED (the master-playhead
  orchestrators are a strict superset of the unsettled `align` model); the "positioning" is a
  naming-rationale move on the `Sequence`/`AnimationGroup` doc sections S2 already owns — one
  paragraph + one table inside an already-scheduled wave, exactly the on-brand framing those
  sections should carry.

- **S9 — the "structural stagger, the CSS way" docs recipe (K-T4; zero new code · the honest a11y
  framing · the SplitText answer).** Locus: `README.md` §Beyond CSS — a recipe entry adjacent to
  the `stagger` subsection S2 authors. Author a teaching recipe (NOT a primitive — zero new code),
  the CSS-keyframes engine's honest answer to GSAP's SplitText: (1) **don't split text into
  letters** — cite the a11y matrix (letter-splitting produces non-functional accessibility markup
  across SR/browser pairs, a 2026-documented hazard); if text must be revealed, reveal at the
  **word or line** granularity with an `aria-label` on a true container + `aria-hidden` fragments
  (or a visually-hidden duplicate) — the working mitigations; (2) drive the reveal with kf's
  EXISTING `stagger` + `SpringProgress` over the consumer-OWNED fragments — the primitive kf
  already ships (taught by S2), no DOM mutation kf performs; (3) where `sibling-index()` is
  available, the stagger emits as native zero-runtime CSS via `animation-delay: calc(sibling-index()
  * <each>)` (the CSS-only structural stagger — note `sibling-index()` is NOT yet Baseline,
  expected mid-late 2026, and CANNOT enter `@keyframes` nor carry the easing curve, so the recipe
  frames it as the progressive-enhancement path, not the default); (4) perceptual color across the
  reveal is free — kf's default oklab already applies. The on-brand thesis the recipe teaches: **we
  don't split your DOM; we stagger and spring over structure you own — visual-only reordering that
  does NOT change reading/tab order, with an honest a11y framing as its distinguishing content**
  (`audit/frontier/text-ranges-stagger.md` K-T4 / §3). **WHY J.W5:** it is the TEACHING of a
  primitive that already ships (`stagger`, one of the untaught exports S2 completes) plus an honest
  a11y framing — exactly S2's §Beyond CSS charter, no new surface; it folds whether or not the
  `staggerCSS()` emitter (the K-T2 headline) ever ships. **Effort S, risk: none beyond keeping the
  a11y citation current.**

## §Hard gate (the proof:* that BITES — born-RED on the CURRENT tree, GREEN-on-fix · PUBLISH/DOCS boundary)

**`proof:published-surface`** — a Node-tier oracle over the BUILT `dist/` + the packed
tarball + the declared public surface + the README snippets. The boundary-ORACLE precept's
PUBLISH/DOCS oracle (`J.md §invariant set` — the PUBLISH oracle is *"the packed tarball's
surface == the source's public exports == the README's taught API"*; the DOCS oracle is
*"every structural claim in CLAUDE.md/README verifiable against the tree"*). The oracle
actuates the SHIPPED ARTIFACT (the tarball + the dist a consumer imports), not a source-shape
proxy — boundary-ORACLE-compliant:

- **clause (a) — tarball == declaration (S1a · CORRECTNESS).** Assert `npm pack --dry-run
  --json` emits EXACTLY the `dist/` set declared by `package.json "files"`, with NO
  `_redirects` and NO other `public/`-origin asset, and `dist/keyframes.d.ts` present +
  non-empty. **BITE (born-RED TODAY):** `dist/_redirects` leaks on the current tree
  (`build-packaging §1`); greens on S4's `publicDir: false`.
- **clause (b) — every public export is taught or manifested (S1b · CORRECTNESS).** Assert
  every value export of `src/animation/index.ts` (LIGHT named exports + HEAVY
  `AnimationEngine` keys) is in (README-taught ∪ `docs/published-surface.md` manifest). **BITE
  (born-RED TODAY):** the untaught, unmanifested LIGHT exports `SpringProgress`,
  `springLinearStops`, `springTimingFunction`, `RAFPlayback`, `stagger`, `flip`/`flipShared`,
  `drag`/`Draggable`, `decay`/`decayRest`, `Sequence` (+ the HEAVY `animate`/`MotionPath`/
  `DrawSVG` front doors) RED the gate today; greens only when S2 teaches them and the
  manifest enumerates the full set. **This is the runtime-of-the-publish-boundary assertion
  the absence of any gate could not make.**
- **clause (c) — the README snippets EXECUTE against the built dist (S2 · CORRECTNESS).**
  Extract every runnable ` ```ts ` snippet from README §Beyond CSS / §Animation and RUN it
  against `./dist/keyframes.js` (heavy snippets via `await loadAnimationEngine()`; DOM
  snippets under a minimal shim) — assert NO throw AND every stated `// =>` result matches
  the computed value. **The MINIMUM-count assertion (no vacuous green):** the count of
  runnable-tagged §Beyond CSS / §Animation snippets MUST be ≥ the count of newly-taught
  primitives in the S2 roster (the ~9 LIGHT subsections), AND ≥1 per HEAVY front door taught
  (`animate`, `MotionPath`, `DrawSVG`) — so a tree that teaches a primitive without a
  runnable snippet REDs the gate. The clause derives the expected floor from the taught
  roster, not a frozen integer: it counts the §Beyond CSS / §Animation subsections that
  teach a primitive on the S1b export set and asserts the runnable-snippet count meets that
  floor. **BITE:** reds on a snippet importing a non-existent export or asserting a wrong
  result, AND reds on a taught primitive with NO runnable snippet (the count falls below the
  floor — including the degenerate case where IMPL tags ZERO snippets runnable: the set is
  empty, the floor is the roster size, the clause REDs). Greens when every taught snippet
  runs, agrees, and the runnable set covers the roster. **This is the DOCS oracle made
  runnable — prose that the dist cannot run REDs here; and the MINIMUM floor makes "the
  README executes" un-gameable by simply NOT tagging snippets runnable — a taught-but-
  unrunnable API REDs, which is the publish-boundary lie this clause exists to catch (the
  absent-element / note()-not-fail false-green of the I-lesson shape).**
- **clause (d) — the AnimationEngine interface ≡ the runtime surface (S1c/ENG-6 ·
  CORRECTNESS).** Assert the `AnimationEngine` interface keys (`index.ts:145-177`) ≡ the
  runtime keys of `loadAnimationEngine()` (`:197-220`). **BITE:** reds on an engine export
  returned at runtime but absent from the interface (or vice-versa); greens when they agree.
- **clause (e) — the doc-rot structural-claim tripwire (S3 · HYGIENE corroborator).** A
  spot-check that the headline structural claims in root `CLAUDE.md` resolve against the tree:
  the `src/` subtree named exists (`src/parsing/`/`src/units/` ABSENT), the demo dirs named
  exist (no `simple/`/`balls/`/`boxes/`/`bench/`), the stated test/bench counts (if frozen as
  integers) match `ls … | wc -l`. **BITE:** reds on a CLAUDE.md that re-asserts a phantom
  path or a wrong count; greens on the rewritten tree-true doc. *(Labeled HYGIENE — a
  structural-claim corroborator. The DOCS correctness oracle proper is clause (c)'s executable
  README; (e) corroborates the prose rewrite and may NOT substitute for a red runtime clause.)*
- **clause (f) — the peer-dep honesty clause (S7/ED-5 · CORRECTNESS).** Assert every entry in
  `package.json "peerDependencies"` is a REAL runtime peer of the SHIPPED `dist/` — i.e. imported
  (statically or dynamically) by the built library, NOT merely by the demo or the dev `*.vue`
  shim. The check: parse the `dist/` import graph (the built `keyframes.js` + the
  `loadAnimationEngine` chunks) and assert `peerDependencies ⊆ {modules dist actually imports}`. A
  declared peer absent from the dist import graph REDs. **BITE (born-RED TODAY):** `vue ^3.5.0` is
  declared (`package.json:161-162`) but the dist imports zero Vue (`grep -rn "from 'vue'" src/` →
  only `src/env.d.ts`, a dev-only declaration); the clause reds today, greens on S7's deletion of
  the block. **This is the dependency-declaration analogue of clause (b): the thing a `npm i` user
  is forced to resolve must be a thing the library actually uses.** *(`audit/frontier/ecosystem-distribution.md`
  ED-5 — "a declared peer that is not a real runtime peer is the publish-boundary-lies-about-the-surface
  shape J.W5 exists to kill.")*

**The §spine bar — MUST bite.** Clauses (a)/(b)/(c)/(d) actuate the SHIPPED ARTIFACT: the
packed tarball (a), the declared public surface a `npm i` user reaches (b), the README the
user reads RUN against the dist (c), the hand-maintained interface vs the runtime surface
(d). RED on the CURRENT tree — the `_redirects` leak (a) AND the untaught orchestration-tier
exports (b) are the two born-RED witnesses TODAY (`J.md §WAVE MAP`); GREEN only when the
tarball, the exports, the README snippets, and the interface all AGREE. This gate is the
publish-boundary analogue of `proof:live-session` — the thing a human INSTALLS is the thing
the source declares and the README teaches.

- **The TWO-TIER TAXONOMY, applied to THIS wave's gate.** The **RUNTIME / load-bearing
  CORRECTNESS oracle** is clauses **(a) tarball==declaration**, **(b) exports
  taught-or-manifested**, **(c) README snippets EXECUTE**, **(d) interface≡runtime**, **(f)
  peer-deps are real runtime peers** — the wave is GREEN iff ALL FIVE pass against the built
  artifact. Clause **(e) doc-rot-tripwire** is the **HYGIENE / corroborating** tier (a
  structural-claim check over prose): it strictly corroborates S3 and **may NOT substitute for
  a red runtime clause** — if any of (a)/(b)/(c)/(d)/(f) is RED, the wave is RED no matter what
  (e) reports. The headline correctness axis is **the shipped artifact == the declared, taught
  surface** (runtime over the tarball + dist), with the prose-rewrite check strictly
  hygiene-corroborating. **NO workaround:** the publish gap closes with the HONEST minor, the REAL
  documented surface, and the HONEST dependency declaration — NOT a rubber-stamp patch
  (`J.md §MANDATE`); no `continue-on-error`, no `IN_CI` escape on (a)-(d)/(f), no bare
  snippet-skip on (c), no `optionalPeer`/`peerDependenciesMeta` paper over (f).
- **`proof:published-surface` enters the CORRECTNESS tier and the `proof:all` roster** — its
  membership is owned by the J.W3 `proof:ci-coverage` two-way equivalence (so the new
  correctness gate cannot escape `proof:all`/CI). Recorded here so the wave does not strand
  its own gate outside the roster; the wiring lands in J.W3's estate motion.

## §Folds

- **SCOPE-1** (the 16-export orchestration tier unpublished) — S5 (the honest minor names it
  export-by-export) + S1b/S2 (the surface is taught + gated). **SCOPE-5** (README teaches
  4/~13) — S2 (the roster completed) + clause (b)/(c). **SCOPE-3 / DL-8 / FVT-4** (two patch
  changesets unconsumed + the patch-vs-minor decision owed) — S5 (consolidated into ONE
  minor; both patches deleted in the same motion; the version cut stays USER-DOMAIN).
- **BP-1** (`dist/_redirects` ships) — S4 (`publicDir: false`) + clause (a) (proven out of
  the tarball). **BP-2/BP-3 + TB-4** (CLAUDE.md CJS claim + stale test/bench counts) — S3
  (rewrite to the tree) + clause (e). **BP-9/BP-10** (dead robots.txt Sitemap + empty
  `author`) — S4 (metadata hygiene, HYGIENE-tier).
- **LS-1..8** (the P1 doc-rot band, per file) — S3 (root `CLAUDE.md` + `src/animation/CLAUDE.md`
  + `demo/CLAUDE.md` REWRITTEN to the tree, never annotated). **LS-12** (the stray PNG) — S6
  (relocate to `shots/` + `.gitignore` `/*.png` guard). **LS-13..19** (the P2 doc-rot tail) —
  S3 (folded into the same per-file rewrite).
- **ENG-5** (root CLAUDE.md stale vs the static/dynamic boundary) — S3 (rewrite to teach
  `loadAnimationEngine` + the LIGHT/HEAVY split). **ENG-6** (AnimationEngine interface
  ungated) — S1c + clause (d) (the drift gate).
- **FVT P2-1** (the I FINAL §8 / PROGRESS §0 supersession gap) — S6 (pointer-only annotation,
  frozen body untouched).
- **ED-5** (the spurious `vue ^3.5.0` peerDependency on the Vue-free library) — S7 (DELETE
  `package.json:161-162`; `vue` stays in `devDependencies`) + clause (f) (the peer-dep honesty
  clause — every declared peer must be a real runtime peer of the shipped dist; reds today).
  `audit/frontier/ecosystem-distribution.md` ED-5 (post-fleet J-fold, K-SEED §4).
- **WL2-A** (the WAAPI-Level-2 positioning paragraph + correspondence table) — S8 (README
  §Beyond CSS docs-only positioning: `AnimationGroup`/`Sequence` ARE the production
  GroupEffect/SequenceEffect the platform never shipped; the API-mimicry KILL rider —
  SequenceEffect proposed for deletion upstream `csswg-drafts #9557`).
  `audit/frontier/waapi-level-2.md` WL2-A (post-fleet J-fold, K-SEED §4).
- **K-T4** (the "structural stagger, the CSS way" docs recipe) — S9 (README §Beyond CSS recipe,
  zero new code: `sibling-index()`/`nth-child` delays + the shipped kf `stagger`, with the honest
  a11y framing). `audit/frontier/text-ranges-stagger.md` K-T4 (post-fleet J-fold, K-SEED §4).
- **The exports map + the lazy-load chunks are CORRECT — RECORD, do NOT re-architect.** The
  ESM-only `"."` exports map, the hash-named `engine-*/animate-*/motion-path-*/draw-svg-*`
  chunks (the `loadAnimationEngine` splits), the d.ts roll-up — all correct
  (`build-packaging §1`). The ONLY tarball flaw is `_redirects` (S4). Preserve the boundary
  architecture; this wave teaches it, gates it, and ships it honestly.

## §Design decisions (trade-offs RESOLVED)

- **A gate over the SHIPPED artifact, not a manual surface audit — RESOLVED.** The publish
  gap recurs every tranche the surface grows; a one-time manual reconciliation re-rots. The
  `proof:published-surface` oracle actuates the packed tarball + the declared exports + the
  RUN README, so a future export added without a teaching/manifest entry REDs at the publish
  boundary, where it lives. This is the gate-ORACLE precept at the distribution boundary
  (`scope-adversary §0`), not paperwork.
- **The honest MINOR, consuming both patches — RESOLVED, not punted.** The tier is forensic:
  additive new exports ⇒ minor; the value.js floor advance is a contractual tightening that
  minor honestly signals (`build-packaging §3`, `scope-adversary §4`). A `4.1.0 → 4.1.1 →
  4.1.2` patch stack would paper a tranche-spanning new public surface — the exact accreted
  dishonesty the precept rejects. The two patches DIE into the minor in one motion (consumed,
  not stacked). The version cut + publish stay USER-DOMAIN at WZ (Mike Babb, confirm-first) —
  this wave owns the honest changeset, not the registry mutation.
- **REWRITE the docs, never annotate — RESOLVED.** Stale docs are legacy code; the no-legacy
  precept forbids the lie beside its correction (`J.md §MANDATE`). The three CLAUDE.md files
  are rewritten to the tree at the impl date; where a count would re-rot, the rewrite states
  the derivation (`ls … | wc -l`) rather than a frozen integer. The ONE exception is I's
  frozen `PROGRESS §0`/FINAL §8 — historical records, NOT live legacy — which get a
  POINTER-ONLY supersession line (S6), not a rewrite, because re-writing a frozen close
  artifact would itself be dishonest.
- **EXECUTABLE README snippets, not prose plausibility — RESOLVED.** A README that teaches an
  API the dist cannot run is the publish-boundary twin of the source-shape gates I retired.
  The snippet runner (S2/clause (c)) makes the docs oracle runnable truth: every taught
  snippet imports from the built `dist` and runs, and every stated result is checked. The
  cost (a Node runner with a minimal DOM shim) is small against the recurrence it prevents.
- **MED-risk, HIGH-honesty — RESOLVED.** The product is already correct (I closed the engine;
  the orchestration tier is demo-proven live). This wave changes NO engine/demo runtime
  behavior — it installs ONE boundary gate, completes the README, rewrites prose, and authors
  the honest changeset. The risk is a snippet runner or a packing assertion; the honesty
  return is the distribution boundary finally telling the truth — the single most
  "legacy/workaround"-shaped thing in the tree (a published `4.1.0` that lies about the
  surface) cured at its seam.
