# J.W5 — IMPL record (THE PUBLISHED SURFACE — the PUBLISH·DOCS boundaries landed)

**Status:** LANDED · `proof:published-surface` GREEN (all five runtime clauses + the
hygiene tripwire, against the BUILT `dist/` + the packed tarball) · `proof:readme-runs`
GREEN (17/17 snippets executed against dist, 20 `// =>` results verified) · born-RED
WITNESSED on the pre-fix tree for clauses (a)/(b)/(e)/(f), clause (c), and a planted
clause-(d) drift · `check:lib` 0 · vitest **69 files · 683 passed + 2 expected-fail**
· `proof:ci-coverage` GREEN (104 gates) · `proof:gate-is-runtime` GREEN · branch
`j-impl-w5` · impl date 2026-06-10.

No engine, no demo, no test source touched — the wave is docs + packaging + changesets
+ ONE new boundary gate, exactly per spec scope.

## §Dispositions (S1–S9, file:line)

- **S1 — `proof:published-surface` (the PUBLISH oracle): LANDED.**
  `scripts/proof-published-surface.mjs` (625 lines) + `package.json:42`
  (`"proof:published-surface"`). The three spec clauses plus the two folds:
  - **S1a / clause (a)** — `npm pack --dry-run --json` (programmatic, no network) ==
    the `files: ["dist"]` declaration; `dist/_redirects` (or ANY `public/`-origin
    asset) absent; `dist/keyframes.d.ts` present + non-empty (128,690 B). Packed
    surface today: 13 files (10 dist + 3 npm metadata).
  - **S1b / clause (b)** — every public VALUE export of `src/animation/index.ts`
    (24 LIGHT static + 16 HEAVY `AnimationEngine` keys = 40) ∈ (README-taught ∪
    `docs/published-surface.md`). The manifest (72 lines) is itself machine-checked
    in BOTH directions — a row naming a non-existent export also reds.
  - **S1c / clause (d)** — `AnimationEngine` interface keys (extracted from the
    `dist/keyframes.d.ts` roll-up) ≡ runtime `Object.keys(await loadAnimationEngine())`
    (the engine chunk imported under Node). 16 ≡ 16 today; the ENG-6 drift gate exists.
  - **clause (e) (HYGIENE corroborator)** — root `CLAUDE.md` structural claims resolve
    against the tree: phantom `src/parsing`/`src/units` paths red, phantom demo dirs
    (`simple/`/`balls/`/`boxes/`/`bench/`) red, tree-named src files checked (28),
    frozen counts cross-checked (`test/*.test.ts` 69, `bench/*.bench.ts` 8). May NOT
    substitute for a red runtime clause (enforced by tier in the script's exit logic).
  - **S7 fold / clause (f)** — peer-dep honesty: declared `peerDependencies` ⊆ the
    modules the SHIPPED dist actually imports (the dist import graph parses to
    `@mkbabb/parse-that`, `@mkbabb/value.js`). Declared peers today: **(none)**.
- **S2 — README §Beyond CSS completion + the executable-snippet runner: LANDED.**
  `README.md` grew 4 → **13 §Beyond CSS subsections** (`:432-747`): `NumericAnimation`,
  `SmoothProgress`, `ElementMorph`, `Timeline` (the original four, now runnable-tagged
  and assertion-bearing) + NEW `SpringProgress` (`:531`), `springLinearStops` &
  `springTimingFunction` (`:556`), `RAFPlayback` (`:578` — teaches the
  `const s = pb.stop; s()` bind-safe destructure as the canonical example), `stagger`
  (`:608`), `flip`/`flipShared` (`:662`), `drag`/`Draggable` (`:679`),
  `decay`/`decayRest` (`:700`), `Sequence` (`:715`). The HEAVY tier is taught under
  §Animation: **The dynamic engine — `loadAnimationEngine()`** (`:225`, the boundary
  itself), `animate` (`:243`), `MotionPath` (`:261`), `DrawSVG` (`:281`).
  The runner: `scripts/proof-readme-runs.mjs` (499 lines) + `package.json:43` — extracts
  every ` ```ts run `-tagged fence from §Beyond CSS / §Animation, executes each verbatim
  against `dist/keyframes.js` (one child process per snippet; minimal jsdom shim;
  HEAVY snippets via real `await loadAnimationEngine()`), asserts no-throw + every
  `// =>` matches the computed value (the child also reports its executed-assertion
  count, so a silently-skipped assertion reds). **The minimum-count floor is derived
  from the taught roster, not a frozen integer:** every subsection whose heading names
  a public export must carry ≥1 runnable fence; each HEAVY front door taught must be
  exercised; ZERO-tagged degenerates red. README today: 17 ` ```ts run ` fences, 21
  `// =>` assertion lines (was 12 untagged fences / 1 assertion).
- **S3 — the doc-rot purge (REWRITE to the tree, never annotate): LANDED.**
  - **Root `CLAUDE.md` (163-line delta):** the phantom `src/parsing/` + `src/units/` +
    `src/easing.ts`/`math.ts`/`utils.ts` subtree DELETED — the real tree is `src/` =
    `animation/` + `env.d.ts`, with all 28 `src/animation/` entries enumerated with
    one-line roles (LS-1); §Project Tree's demo section rewritten to the real `ls demo/`
    — phantom `simple/`/`balls/`/`boxes/`/`bench/` deleted, real `app/`/`easing/`/
    `motion-path/`/`sequence/`/`spring/` named, with the per-scene-dirs-are-not-apps
    truth (LS-3); the test/bench claims state the DERIVATION (`ls test/*.test.ts |
    wc -l`) instead of a frozen integer so they cannot re-rot (LS-4/TB-4); the
    §Build block corrected (`gh-pages` → `demo/app` SPA → `dist/gh-pages/`; ESM-only —
    every `keyframes.cjs` claim deleted, BP-2); §Library Entry Point rewritten to teach
    the STATIC/DYNAMIC boundary — the LIGHT value.js-free barrel vs the HEAVY surface
    reached ONLY via `loadAnimationEngine()` (ENG-5, LS-2); the `@mkbabb/parse-that`
    role corrected to the cross-realm nominal-type bridge (LS-13).
  - **`src/animation/CLAUDE.md` (+72-line delta, LS-5):** the 9 unlisted modules added
    with roles — `stagger.ts`, `flip.ts`, `drag.ts`, `decay.ts`, `sequence.ts`,
    `draw-svg.ts`, `motion-path.ts`, `animate.ts`, `frame-compiler.ts`.
  - **`demo/CLAUDE.md` (204-line delta, LS-6/7/8, LS-15..19):** `@/composables/`
    rewritten to the real TWO files (`gestureSelectSuppression.ts`, `useDragScrub.ts`);
    "shadcn-vue (50+)" corrected to the ONE remaining `ui/menubar/` dir (16 files, rest
    migrated to glass-ui); `@mkbabb/glass-ui` added to Key Dependencies; the `stores/`
    listing corrected (`sceneMachine.ts` + `scenePlaybackAdapters.ts` +
    `controlSurfaceDFA.ts` + `useSceneMachine.ts`; phantom `scenePlayback.ts` and the
    phantom component/css names deleted).
- **S4 — tarball hygiene (BP-1 + BP-9/BP-10): LANDED.** `vite.config.ts:295`
  `publicDir: false` in the production (library) mode block — the seam fix, with the
  full causal comment (`:284-294`); clause (a) proves it STAYS out. HYGIENE folds:
  `package.json:159` `"author": "Mike Babb <mike@babb.dev>"` (was `""`, BP-10);
  `demo/app/public/robots.txt` dead `Sitemap:` github.io directive deleted (BP-9).
- **S5 — the changeset consolidation (the honest minor): LANDED.**
  `.changeset/tranche-j.md` AUTHORED (`"@mkbabb/keyframes.js": minor`) — names the E→I
  orchestration tier **export-by-export** (all 13 LIGHT additions + the
  `loadAnimationEngine` boundary + the 3 HEAVY front doors), carries the two consumed
  bugfixes (tranche-h blank-selector belt; tranche-i serialize-from-template + no-op
  group transform + the value.js `^0.11.1 → ^0.11.2` floor), and names the version
  owner. `.changeset/tranche-h.md` + `.changeset/tranche-i.md` DELETED in the same
  motion (consumed, not stacked). Full disposition below.
- **S6 — supersession pointers + the stray PNG: LANDED.** Pointer-only (frozen bodies
  untouched): `docs/tranches/I/FINAL.md:229-233` (§8 head) +
  `docs/tranches/I/PROGRESS.md:28-32` (§0 head), each routing to
  `docs/tranches/I/impl/I-WZ-verify.md` + Tranche J. The stray
  `b2-gen-crash-easing-visibility.png` relocated repo-root →
  `docs/tranches/I/audit/investigate/shots/` (the path
  `b2-dfa-gen-crash.md:73` already cites); `.gitignore` gains the `/*.png` root-stray
  guard (LS-12).
- **S7 — the spurious `vue ^3.5.0` peerDependency: DELETED.** The whole
  `peerDependencies` block removed from `package.json` (the dist imports zero Vue —
  the only `src/` vue reference is the dev-only `env.d.ts` SFC shim); `vue ^3.5.35`
  STAYS in `devDependencies` (`package.json:216`, the demo's runtime). Not narrowed to
  `optionalPeer`, not papered with `peerDependenciesMeta` — the honest declaration is
  its ABSENCE, enforced forever by clause (f).
- **S8 — the WAAPI-Level-2 positioning (WL2-A, docs-only): LANDED.** README `:741-747`
  (§Sequence) — the positioning paragraph (`AnimationGroup`/`Sequence` ARE the
  production realization of L2's `GroupEffect`/`SequenceEffect`, semantics no browser
  ever shipped; `SequenceEffect` proposed for deletion upstream,
  csswg-drafts #9557) + the correspondence table (`GroupEffect.parallel` →
  `AnimationGroup`; `SequenceEffect`/`align: sequence` → `Sequence` auto-append;
  `align: start` → `at: 0`), cross-linked from §AnimationGroup (`:373`). The KILL
  rider honored: zero API change, zero L2-named class, zero polyfill.
- **S9 — "structural stagger, the CSS way" recipe (K-T4, zero new code): LANDED.**
  README `:624-660` (§stagger child section) — don't split text into letters (the
  2026-documented SR hazard named); word/line granularity over consumer-owned markup
  (`aria-label` container + `aria-hidden` fragments); the reveal driven by the shipped
  `stagger` + `SpringProgress`; `sibling-index()` framed as the
  progressive-enhancement path (NOT Baseline, expected mid–late 2026; cannot enter
  `@keyframes`, cannot carry the spring curve). The recipe's snippet is
  runnable-tagged and EXECUTES under the gate.

### The one scope addition beyond the spec letter: ci.yml wiring (forced by an existing gate)

The spec routes `proof:all`/correctness-roster membership to **J.W3**'s estate motion.
But the EXISTING `proof:ci-coverage` (already in CI) reds on any `proof:*` script
declared in `package.json` and never invoked in `ci.yml` — landing the two new gates
without invocation left a correctness-roster gate RED on the close tree (witnessed:
`proof:ci-coverage — FAIL (1): … NEVER invoked in ci.yml: proof:published-surface,
proof:readme-runs`). Its own FAIL text prescribes the fix ("wire it into the `gates`
job (library-scoped)"), so `.github/workflows/ci.yml:101-112` now runs both in the
library `gates` job (after `build:lib`; Node-only, no demo build, no browser, no
`continue-on-error`, no `IN_CI` escape). `proof:ci-coverage` GREEN again (104 gates).
The J.W3 motion still owns `proof:all`/`proof:correctness` tier membership +
the two-way equivalence — recorded as the open handoff to J.W3.

## §Born-RED excerpt (witnessed on the pre-fix tree, 2026-06-10)

Method: the six fix files (`README.md`, root/`src/animation`/`demo` `CLAUDE.md`,
`package.json`, `vite.config.ts`) stashed back to HEAD, `docs/published-surface.md`
hidden, `dist/` REBUILT under the pre-fix vite config (the `_redirects` leak
reproduces: `ls dist/ | grep redirect` → `_redirects`), then both gates run unmodified.

`node scripts/proof-published-surface.mjs` → **exit 1, FAIL (15 findings)**:

```
clause (f) — peer-dep honesty: declared peers ⊆ dist imports (S7 · ED-5)
  declared peers: vue · dist imports: @mkbabb/parse-that, @mkbabb/value.js

proof:published-surface — FAIL (15 finding(s); the published surface lies):
  ✗ (a) NON-LIBRARY ASSET in tarball: dist/_redirects (25 B) (BP-1: the CF-Pages routing
      relic — Vite lib mode copied `publicDir` into `outDir`; fix is `publicDir: false`
      in the production block)
  ✗ (b) 30 public export(s) are NEITHER README-taught NOR manifested — an API a `npm i`
      user reaches that the docs cannot teach:
      `AnimationOptionError` (LIGHT), `DIRECTIONS` (HEAVY), `Draggable` (LIGHT),
      `DrawSVG` (HEAVY), `FILL_MODES` (HEAVY), `MotionPath` (HEAVY), `RAFPlayback` (LIGHT),
      `Sequence` (LIGHT), `SpringProgress` (LIGHT), … `springLinearStops` (LIGHT),
      `springTimingFunction` (LIGHT), `stagger` (LIGHT), `toEasing` (LIGHT)
  ✗ (e) root CLAUDE.md re-asserts the phantom path `src/parsing` — the doc-rot the S3
      rewrite killed is back.   [+ 10 more (e) findings: src/units, simple/, balls/,
      boxes/, bench/, keyframes.ts, units.ts, normalize.ts, colorFilter.ts, math.ts]
  ✗ (f) declared peerDependency `vue` is NOT imported by the shipped dist …
      The honest declaration is its absence.
```

`node scripts/proof-readme-runs.mjs` (same pre-fix tree) → **exit 1, FAIL (10 findings)**:

```
  teaching subsections: 12 · taught (heading names a public export): 4 · runnable-tagged fences: 0
  ✗ floor: ZERO runnable-tagged snippets — the floor is the taught roster (4); an un-run
      README is prose, not proof.
  ✗ floor: taught subsection "`NumericAnimation`" has NO runnable snippet … [×4]
  ✗ floor: HEAVY front door animate is not taught … [animate, MotionPath, DrawSVG]
  ✗ floor: ZERO `// =>` assertions across all runnable snippets — the computed-result
      oracle is empty.
```

**Clause (d) BITE (planted drift, ENG-6):** `DIRECTIONS` removed from the
`AnimationEngine` interface in `src/animation/index.ts`, rebuilt, gate run:

```
clause (d) — AnimationEngine interface ≡ runtime surface (S1c · ENG-6)
  interface keys: 15 · runtime keys: 16
  ✗ (d) returned at RUNTIME by loadAnimationEngine() but ABSENT from the AnimationEngine
      interface (the silent-type-drift ENG-6 names): `DIRECTIONS`
```

(plant reverted; 16 ≡ 16 GREEN on the landed tree). Additionally, clause (c) BIT on
real rot during impl (recorded in the runner's header): the pre-S2 §SmoothProgress
taught `smooth.tick()` — a method that does not exist on the shipped class (`tickDt`
only) — and §NumericAnimation/§Timeline referenced the free identifier `easeOutCubic`,
importable from nowhere on the package surface. Both had survived because nothing ran
them; both are fixed in the landed README and now execute.

## §README-harness result (clause (c), the landed tree)

`npm run proof:readme-runs` → **PASS**:

```
  teaching subsections: 25 · taught (heading names a public export): 17 · runnable-tagged fences: 17
  executing 17 runnable snippet(s) against dist/keyframes.js …
  ✓ animation › The dynamic engine — `loadAnimationEngine()` ✓ `animate` ✓ `MotionPath` ✓ `DrawSVG`
  ✓ beyond css › `NumericAnimation` (asserts: 1/1) ✓ `SmoothProgress` (1/1) ✓ `ElementMorph`
  ✓ `Timeline` (1/1) ✓ `SpringProgress` (2/2) ✓ `springLinearStops` & `springTimingFunction` (6/6)
  ✓ `RAFPlayback` (1/1) ✓ `stagger` (3/3) ✓ Recipe — structural stagger, the CSS way
  ✓ `flip` / `flipShared` ✓ `drag` / `Draggable` (1/1) ✓ `decay` / `decayRest` (3/3) ✓ `Sequence` (1/1)

proof:readme-runs — PASS: 17 snippet(s) executed against the built dist, 20 stated
result(s) verified, the runnable set covers the taught roster (17).
```

Every taught subsection carries ≥1 runnable fence (roster floor 17/17 met); all three
HEAVY front doors exercised via a real `await loadAnimationEngine()`.

## §Doc-truth sample (the rewritten claims vs the tree, first-hand)

| Rewritten claim | Probe | Result |
| --- | --- | --- |
| `src/` = `animation/` + `env.d.ts` — nothing else | `ls src/` | `animation`, `env.d.ts` ✓ |
| `src/animation/` 28 enumerated entries | clause-(e) check + `ls src/animation/ \| wc -l` | 28 tree-named files verified (29 entries incl. `internal/`) ✓ |
| tests stated as derivation, not frozen integer | `ls test/*.test.ts \| wc -l` / vitest | 69 files · 683 + 2 expected-fail ✓ |
| bench count | `ls bench/*.bench.ts \| wc -l` | 8 ✓ |
| `@/composables/` = exactly 2 files | `ls demo/@/composables/` | `gestureSelectSuppression.ts`, `useDragScrub.ts` ✓ |
| ONE shadcn-vue dir remains (`ui/menubar/`) | `ls demo/@/components/ui/` | `menubar` only ✓ |
| demo dirs (no `simple/`/`balls/`/`boxes/`/`bench/`) | `ls demo/` | `@ app amiga cube easing motion-path playground sequence spring square` ✓ |
| ESM-only (no `keyframes.cjs` claim anywhere) | `ls dist/` | `keyframes.js` + `keyframes.d.ts` + 7 lazy chunks; no `.cjs` ✓ |
| phantom-path tripwire is armed | clause (e) on pre-fix CLAUDE.md | 11 RED findings (see born-RED excerpt) ✓ |

## §Changeset disposition

- **`.changeset/tranche-h.md` — DELETED (consumed).** Its patch (the
  `frame-compiler.ts` blank-selector `AnimationOptionError` belt) is named in the
  minor's body.
- **`.changeset/tranche-i.md` — DELETED (consumed).** Its patch (the `format.ts`
  serialize-from-template, the `group.ts` no-op transform default, the
  `@mkbabb/value.js ^0.11.1 → ^0.11.2` floor) is named in the minor's body; its own
  open patch-vs-minor question is RESOLVED here, not punted.
- **`.changeset/tranche-j.md` — AUTHORED: `"@mkbabb/keyframes.js": minor`.** The tier
  is forensic: the E→I additions are purely ADDITIVE new exports (⇒ minor, not major;
  a patch stack `4.1.0 → 4.1.1 → 4.1.2` would paper a tranche-spanning new public
  surface) and the value.js floor advance is a contractual tightening that minor
  honestly signals. The body names the full surface export-by-export (13 LIGHT + the
  `loadAnimationEngine` boundary + `animate`/`MotionPath`/`DrawSVG` HEAVY front doors)
  + both consumed bugfixes + the packaging honesty (no `_redirects`, no vue peer).
- **The version cut + npm publish remain USER-DOMAIN at J.WZ** — version owner
  **Mike Babb (`mike@babb.dev`)**, confirm-first; `changeset version` → tag →
  `release.yml` (`check:lib → build:lib → test → proof:boundary → npm publish
  --provenance`) fires only there. This wave's deliverable is the honest changeset +
  the gate + the docs — the registry is not mutated here.

## §Verification matrix (the landed tree)

| Check | Result |
| --- | --- |
| `npm run proof:published-surface` | PASS — clauses (a)(b)(d)(e)(f); tarball 13 files, no `_redirects`; 40/40 exports taught-or-manifested; interface 16 ≡ 16; peers (none) |
| `npm run proof:readme-runs` | PASS — 17 snippets executed, 20 `// =>` verified, roster floor 17/17 |
| `npm run check:lib` (tsc) | 0 errors |
| `npx vitest run` | 69 files · 683 passed · 2 expected-fail |
| `npm run proof:ci-coverage` | PASS — 104 gates invoked in CI (incl. the two new) |
| `npm run proof:gate-is-runtime` | PASS (self-posture HYGIENE recorded) |
| born-RED | clauses (a)/(b)/(e)/(f) 15 findings + clause (c) 10 findings on the pre-fix tree; clause (d) on a planted drift — all excerpted above |

## §Open handoffs

- **J.W3** — `proof:published-surface` + `proof:readme-runs` membership in
  `proof:all`/`proof:correctness` + the `proof:ci-coverage` two-way equivalence (the
  ci.yml invocation already landed here, forced by the existing one-way gate).
- **J.WZ** — the version cut (`changeset version` off the honest minor), tag, publish
  (USER-DOMAIN, Mike Babb, confirm-first).
