# p04 — demo/app partition + layout-gate fallout (Pass-1E prototype probe)

**Probe:** p04-demo-app-partition · **Tranche:** S DEVELOPMENT (pass 1) · **Date:** 2026-07-02
**Worktree:** `.claude/worktrees/wf_f9faf42c-6b8-4` (throwaway; deliverable is THIS report)
**Question tested:** SPEC-v1 §3 **S.A4 / Wave S-app-partition** + a27 F2 — execute a23's Layout C
partition of `demo/app/` and measure the layout-gate fallout. **Does the "~54 demo-layout gate"
migration behave as the spec assumes — mostly mechanical (path-constant), not structural?**

---

## 1. The question + the spec's assumption

- **a23** (`audit32/a23-demo-app-partition.md`) recommends **Layout C**: three shallow concern
  subdirs under `demo/app/` — `scene/` (5 files), `transition/` (3), `runtime/` (7) — plus evicting
  `cubeTransformStore.ts` → `demo/scenes/cube/`. It estimates the cost as *"`@app/*` specifiers at the
  **four** scene consumers change … **contained (4 files, ~6 import lines) and mechanical**"* (a23:279).
- **a27** (`audit32/a27-gate-roster.md` F2) declares ~54 gates "ossify the current demo appearance"
  and will red on any demo rewrite; SPEC S.A4 treats the ~54 as a **FROZEN SET** the demo rewrite is
  *authorized to red*, each discharged by deletion-with-cause or migration to a layout-invariant
  system-property gate.
- **The assumption under test:** the partition is *mostly mechanical* — gate breakage is
  path-constant (swap a hardcoded source-path string), not structural (a gate encoding an assumption
  about the file layout that the move invalidates by meaning, not by string).

---

## 2. What I actually did (commands + exit codes)

Executed Layout C in the worktree, fixed all imports, typechecked, built the demo, then ran the
source-path-coupled gates and a representative slice of the structural/DOM gates.

| Step | Command | Exit |
|---|---|---|
| Move 16 files into `scene/`·`transition/`·`runtime/`; evict `cubeTransformStore.ts`→`scenes/cube/` | `mkdir` + `mv` | 0 |
| Fix intra-app imports (App.vue ×8, main.ts ×2, useSceneTransition ×1 cross-dir) | `perl -0pi` | 0 |
| Fix `@app/*` scene consumers (7 files, 13 lines) + cube store (1) + 2 test files | `perl -0pi` | 0 |
| Fix `scenes.ts` sibling deep-imports `../scenes/`→`../../scenes/` (16 lines) | `perl -0pi` | 0 |
| **Typecheck** | `npm run check` (`tsc --noEmit`) | **0** (after the `scenes.ts` fix; **8 TS2307 before**) |
| **Demo build** | `npm run gh-pages` | **0** (76 asset chunks; only pre-existing warnings) |
| **Lib build** (needed for vitest self-import) | `npm run build:lib` | 0 |
| Patch 7 gate scripts + `scripts/lib/demo-driver.mjs` path constants | `perl -0pi` | 0 |

**`git diff --stat` (excluding `dist/`):** 35 files changed, 43 insertions(+), 1425 deletions(-)
(the deletions are the 16 moved files registering as deletes-at-old-path; the 3 new subdirs +
`scenes/cube/cubeTransformStore.ts` are untracked — never `git add`ed per worktree rules).

Touch-set that carried real edits (not pure moves):

```
demo/app/App.vue                       8 specifiers  (./scene/ ./transition/ ./runtime/)
demo/app/main.ts                       2 specifiers  (./scene/router ./runtime/loaf-observer)
demo/app/transition/useSceneTransition 1 specifier   (../scene/scenes — cross-subdir)
demo/app/scene/scenes.ts              16 lines       (../scenes/ → ../../scenes/  ← THE gotcha)
demo/scenes/{easing,cube,amiga,spring,sequence}/*  13 @app lines across 7 files
demo/scenes/cube/CubeScene.vue         1 line        (@app/cubeTransformStore → ./cubeTransformStore)
test/e-w1-encapsulation.test.ts        1 line        (../demo/app/useSceneSwap → …/transition/…)
test/scene-visibility-pause.test.ts    1 line        (…/useSceneVisibilityPause → …/runtime/…)
scripts/proof-*.mjs (7) + scripts/lib/demo-driver.mjs   path constants
```

---

## 3. Findings (file:line evidence)

### F1 — Every gate that broke broke on a hardcoded SOURCE-PATH STRING (ENOENT). Zero structural reds.

Seven gates + one shared lib hardcode `demo/app/<file>` source paths. On the moved tree each RED with
a pure "file not found":

| Gate | Broken ref | Post-move error |
|---|---|---|
| `proof:manifest-sourced` | `demo/app/scenes.ts` (own + `demo-driver.mjs:83`) | `ENOENT … demo/app/scenes.ts` |
| `proof:morphsvg-consume` | `proof-morphsvg-consume.mjs:328` | `ENOENT … demo/app/scenes.ts` |
| `proof:morph-scene` | `proof-morph-scene.mjs:56` + driver | `ENOENT … demo/app/scenes.ts` |
| `proof:no-deprecated-guard` | `proof-no-deprecated-guard.mjs:34` (`router.ts`) | `ERROR: router not found at demo/app/router.ts` |
| `proof:icon-paint-live` | `proof-icon-paint-live.mjs:63` + driver | `ENOENT … demo/app/scenes.ts` |
| `proof:modern-web` | `scenes.ts:362` + `useSceneVisibilityPause.ts:332` | file-read fail |
| `proof:demo-elevate` | `useSceneTransition.ts:46` `useSceneSwap.ts:47` `useSceneVisibilityPause.ts:157` | file-read fail |

After swapping the path constants (8 files: 7 gate scripts + `scripts/lib/demo-driver.mjs`), every one
went green **or** dropped to a residual red that is **pre-existing on master and unrelated to the move**
(verified by re-running the same gate in the main tree):

- `proof:manifest-sourced` → **exit 0**; `proof:morphsvg-consume` → **0**; `proof:morph-scene` → **0**;
  `proof:no-deprecated-guard` → **0**; `proof:font-census` → **0**; `proof:mobile-single-page` → **0**.
- `proof:modern-web` residual red = `proof:mwg-installed: guidance corpus absent` (environmental —
  the modern-web-guidance skill isn't installed in this tree; nothing to do with the move).
- `proof:demo-elevate` residual reds = `--spring-snappy linear() shadow` + `hand-rolled
  startViewTransition` — **identical on master** (`node scripts/proof-demo-elevate.mjs` in the main
  tree prints the same two ✗).
- `proof:icon-paint-live` residual red = DC-8 `::view-transition-*` grep + a live-browser leg —
  **also identical on master** (master run points at `demo/app/scene-transition.css`, the pre-move
  path); the DC-8 grep even *re-found* the same 5 rules in the moved `transition/scene-transition.css`,
  proving that grep is recursive and layout-invariant.

**No gate encoded a structural assumption about the layout.** The single thing that resembles one —
`proof:scene-colocated` — asserts the *absence* of the long-deleted `demo/app/scenes/` scatter dir and
was **green throughout** (my move doesn't recreate it; evicting `cubeTransformStore.ts` INTO
`scenes/cube/` doesn't trip it either).

### F2 — The ONE non-alias edit a23 missed: `scenes.ts` sibling deep-imports are DEPTH-sensitive.

`scenes.ts` reaches the sibling `demo/scenes/` tree through **16** relative imports/dynamic-imports of
the form `"../scenes/<name>/…"` (`scenes.ts:27-36` static, `:143-221` lazy loaders). `../scenes` from
`demo/app/scenes.ts` meant `demo/scenes/`; after the move to `demo/app/scene/scenes.ts` the SAME
string resolves to `demo/app/scenes/` — wrong. This is the **only** edit in the whole partition that
is not a flat find-replace of an alias/path-constant: it requires understanding that the specifier is
*depth-relative to a directory outside `demo/app`*. It surfaced as **8 `error TS2307` "Cannot find
module ../scenes/…"** on the first `npm run check`; fixing `../scenes/`→`../../scenes/` cleared all 8
and the build. a23's cost line does not mention `scenes.ts`'s outward reach at all. Still mechanical
(one uniform `../`→`../../` bump), but it is the reason a naive `git mv` + alias-only sweep would leave
the tree red.

### F3 — a23's cost estimate is a ~3× undercount; it misses two whole reference tiers.

a23:279 says *"4 files, ~6 import lines."* The measured touch-set:

- **7 scene consumer files, 13 `@app/*` import lines** (not 4/6): `easing/useEasingDemo.ts` (4),
  `spring/useSpringDemo.ts` (2), `sequence/useSequenceDemo.ts` (3), `cube/useCubeAnimations.ts` (1),
  `cube/CubeScene.vue` (1, the `cubeTransformStore` eviction), `amiga/AmigaScene.vue` (1),
  `spring/useSpringHotPath.ts` (1).
- **2 TEST files** import `demo/app` sources by relative path — a23 lists zero:
  `test/scene-visibility-pause.test.ts:24` (`useSceneVisibilityPause`→`runtime/`) and
  `test/e-w1-encapsulation.test.ts:16` (`useSceneSwap`→`transition/`). These back
  `proof:composable-encapsulation`; unfixed they fail vitest resolution.
- **A shared-lib tier:** `scripts/lib/demo-driver.mjs:83` hardcodes `../../demo/app/scenes.ts` and is
  consumed by *five* gates (manifest-sourced, morph-scene, icon-paint-live, font-census,
  mobile-single-page). a23 enumerates none of the gate/lib references — its scope was the app files,
  not the gate roster that reads them.

### F4 — The ~54 a27 "demo-appearance" gates are structurally immune to the SOURCE move.

The a27 layout/appearance gates (`proof:layout-cluster`, `demo-shell-grid`, `occlusion`,
`scene-card-rounded`, `stage-glass-card`, …) read the **built `dist/gh-pages` DOM / served HTML**, not
source file paths. Because the demo bundle is produced from the SAME modules through the SAME
`@app`/`@src` aliases, the built output is byte-equivalent after a pure file-move — so these gates are
invariant to the partition **by construction**. The move I performed does not touch a single one of
them. (This is the important corollary for the S diet: the ~54 "will red on the demo rewrite" is about
*visual/DOM* changes S.E/S.G make, **not** about the file partition — the partition alone reds only
the ~7 source-path gates in F1.)

### F5 — vitest self-import (`@mkbabb/keyframes.js`) is a worktree BUILD-STATE artifact, not a break.

`e-w1-encapsulation.test.ts` first failed with `Failed to resolve import "@mkbabb/keyframes.js" from
demo/app/transition/useSceneSwap.ts`. This is **not** partition fallout: the package self-export maps
`@mkbabb/keyframes.js`→`./dist/keyframes.js` (`package.json:24`), and the worktree had no `dist/`
(I'd run only `gh-pages`, not `build:lib`). A bare specifier resolves location-independently, so the
move cannot affect it; the same test **passes on master** and **passes in the worktree once
`npm run build:lib` creates `dist/keyframes.js`** (re-run → 3 passed). Flagged so the real wave doesn't
misread it as a regression.

---

## 4. VERDICT: **confirms-spec** (mechanical), with a cost-line adjustment to a23.

The spec's core assumption holds: **the partition is mechanical.** No gate encodes a structural
assumption that the move invalidates by meaning — every red is a hardcoded source-path string (F1),
discharged by a find-replace, and the residual reds are pre-existing/environmental. The ~54 a27
appearance gates are untouched by a source move (F4). Typecheck and demo build are green.

**Adjustment (to a23's cost line, not to the ruling):** replace *"4 files, ~6 import lines,
mechanical"* with the measured touch-set — **7 scene files / 13 `@app` lines + 2 test files + 16
depth-sensitive `scenes.ts` lines + 7 gate scripts + 1 shared lib (`demo-driver.mjs`, feeding 5
gates)**. Add an explicit callout that `scenes.ts`'s outward `../scenes/` deep-imports need a
depth bump (`../../scenes/`) — the one edit that is not a flat alias swap and the one that reds
`tsc` if forgotten. The S wave's born-RED gate should assert *both* concern-dir membership **and**
that no moved file's relative import escapes into a stale depth (catch F2 by construction).

---

## 5. Implementation-cost estimate for the real S wave (Wave S-app-partition, Layout C)

- **Files touched:** ~16 moved + ~10 source import-edit sites (App.vue, main.ts, useSceneTransition,
  scenes.ts, 7 scene consumers, CubeScene) + 2 test files + **8 gate/lib path-constant sites**
  (7 `proof-*.mjs` + `scripts/lib/demo-driver.mjs`) + docs (`demo/CLAUDE.md` structure block +
  `@app` alias note per a23 F7). ≈ **38 files**, ~60 edited lines. Half a day.
- **Gates affected (all discharge by path-swap, none by re-architecture):** `manifest-sourced`,
  `morphsvg-consume`, `morph-scene`, `no-deprecated-guard`, `icon-paint-live`, `modern-web`,
  `demo-elevate`, + the driver-fed `font-census` / `mobile-single-page`. **Do NOT touch** the ~54
  a27 appearance gates — they are layout-invariant here (F4); folding them belongs to S.A4/S.Wy, a
  separate lever from this partition.
- **Risk: LOW.** The only non-trivial edit is the `scenes.ts` depth bump (F2) — mechanical but
  tsc-visible if missed. Verify with `npm run check` (catches F2) + `npm run gh-pages` (catches the
  `@app` alias sweep) + `npx vitest run test/e-w1-encapsulation.test.ts test/scene-visibility-pause.test.ts`
  **after `build:lib`** (F5). No config change needed: the `@app`→`demo/app` alias (vite.config.ts:315,
  tsconfig.json:35, vitest.config.ts:15) is unchanged — only `@app/*` *subpaths* move, so no
  vite/vitest/tsconfig alias edit is required (contra any worry that aliases need re-pointing).
- **Sequencing note:** land the gate/lib path-swaps IN THE SAME commit as the file moves — the
  `demo-driver.mjs` shared lib means five gates go red together on a partial move; there is no
  intermediate green state.
