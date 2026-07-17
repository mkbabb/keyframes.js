# Lane R1-09 — Consumer Truth: Registry + Import Graph

**Date:** 2026-07-16 · **Prefix:** CT- · **Scope:** package boundary from both sides — npm registry vs local manifest/lock, and the demo→library import graph (barrel / `./engine` subpath / deep `@src` / value.js subpaths / vite aliasing).

## Verdict

The **published library boundary is clean and honest**: `@mkbabb/keyframes.js@6.0.0` and `@mkbabb/value.js@4.0.0` are on the registry with the integrity the local lock records; the exports maps match published byte-for-byte; the `./engine` static mirror is INTACT (44 == 44 == 44, exact); src imports value.js through subpaths ONLY with zero references to the deleted root/`./parsing`/`./units` (the P0 trap passes cleanly).

The **demo consumer graph, however, is not what its own contract prose claims.** The uncommitted 5.3.5→6.0.0 transaction deletes the `@mkbabb/glass-ui` pin from *both* package.json and the lockfile while 43 demo files still import `@mkbabb/glass-ui` — and CI/deploy both run `npm ci`, which would then omit it. The glass-ui actually sitting in `node_modules` is version **7.0.0, which does not exist on the npm registry (E404)** and is absent from the lock: a phantom local-link artifact no reproducible install can obtain. Two lower-severity truths: the vite self-alias silently shadows the published package (the "dogfood the PUBLISHED barrel" narrative is cosmetic — it resolves to `src/`), and the demo reaches library internals through 11 deep `@src/animation/*` imports that bypass every public surface, directly contradicting `demo/kf-engine.ts`'s stated contract.

---

## CT-01 — glass-ui dropped from manifest + lock, still consumed by 43 demo files; `npm ci` deploy would omit it

**Severity:** P1 · **Family:** undeclared-dependency / declared-capture-missing

**Evidence.** The uncommitted transaction removes the glass-ui declaration:

`git diff package.json`:
```
     "dependencies": {
-        "@mkbabb/value.js": "^3.1.0"
-    },
-    "optionalDependencies": {
-        "@mkbabb/glass-ui": "6.0.0"
+        "@mkbabb/value.js": "4.0.0"
     },
```
`git diff package-lock.json` removes the `node_modules/@mkbabb/glass-ui` node (`-82` lines). Working-tree state:
- `grep -c glass-ui package-lock.json` → **0**; `node -e "require('./package.json').optionalDependencies"` → **undefined**; glass-ui is in no dependency section.
- Demo still consumes it: `grep -rln "@mkbabb/glass-ui" demo/ | wc -l` → **43 files** (App.vue, every scene, dock, instrument suite).

Both pipelines install with `npm ci`, which installs strictly from the lock and prunes extras:
- `.github/workflows/ci.yml:40` `run: npm ci`; `:67` `npm ci (demo consumer graph)`
- `.github/workflows/deploy-pages.yml:71` `npm ci (demo consumer graph)`

No workflow or script installs glass-ui out of band (`grep -rn "glass-ui" .github/` → no install line). Therefore a clean `npm ci` → `vite build` (the deploy path for keyframes.babb.dev) resolves `@mkbabb/glass-ui` against nothing → demo build fails. HEAD (`5.3.5`) declared `optionalDependencies["@mkbabb/glass-ui"] = "6.0.0"` and carried it in the lock; the 6.0.0 transaction drops it without a replacement. Note this also diverges from the ratified consume-edge in memory ("cut the smallest versioned kf successor with exact 6.0.0"): the successor should *pin* glass-ui 6.0.0, not delete it.

**Disposition — BUILD (transaction-blocking).** Before the 6.0.0 transaction is committed, re-add the glass-ui pin so a clean `npm ci` installs it (`optionalDependencies` or `devDependencies` — the demo is a devtime consumer). glass-ui 6.0.0 still exists on the registry (`npm view @mkbabb/glass-ui@6.0.0` → integrity `sha512-olsSrfnd…`), so pinning `6.0.0` reproduces deterministically. If glass-ui is genuinely meant to leave the manifest, add an explicit install step to `ci.yml`/`deploy-pages.yml` and regenerate the lock — do not leave the demo's largest UI dependency undeclared.

## CT-02 — installed glass-ui is 7.0.0, a version that does not exist on the registry (E404); phantom local-link, unlockable

**Severity:** P1 · **Family:** phantom-dependency / unpinned-local-link

**Evidence.**
- `require('./node_modules/@mkbabb/glass-ui/package.json').version` → **7.0.0**
- `npm view @mkbabb/glass-ui@7.0.0` → **`npm error 404 No match found for version 7.0.0`**
- Its own manifest peers `@mkbabb/keyframes.js: ^6.0.0` and `@mkbabb/value.js: ^4.0.0` (version-consistent with the transaction), but 7.0.0 is unpublished — a sibling-repo dev build (`/Users/mkbabb/Programming/glass-ui`, memory: "Glass 6 → versioned kf successor → Atlas 2 edge queued") linked into `node_modules` out of band.
- It is not in the lock (CT-01), and it is newer than the 6.0.0 the HEAD lock pinned, so even the pre-transaction lock would not reproduce what is on disk.

Consequence: the demo currently builds locally only because a phantom glass-ui 7.0.0 happens to be present; that state is not reproducible by anyone via `npm ci`/`npm install`. This is why CT-01's break is invisible locally — the on-disk phantom masks the missing declaration.

**Disposition — BUILD (fold with CT-01).** Pin glass-ui to a *published* version (6.0.0 today). If the demo must ride the unreleased Glass 7 line, that dependency has to become a published artifact before the 6.0.0 kf transaction can honestly claim a reproducible demo build — otherwise the deploy depends on a workstation-local link. Treat as the R1 registry-truth blocker.

## CT-03 — vite self-alias shadows the published package; the "dogfood the PUBLISHED barrel" claim is cosmetic

**Severity:** P2 · **Family:** masking-fallback / alias-smuggling

**Evidence.** `vite.config.ts:39-42`:
```
"@mkbabb/keyframes.js": path.resolve(import.meta.dirname, "src/animation/index.ts"),
```
Every demo `import … from "@mkbabb/keyframes.js"` (94 occurrences via `grep`) resolves to local source, not the installed/published 6.0.0 tarball. Yet `demo/kf-engine.ts:4-6` asserts: *"The demo consumes the PUBLISHED kf barrel (`@mkbabb/keyframes.js`), not the deep `@src/animation/*` source paths."* The alias is documented and intentionally justified (glass-ui's bare `@mkbabb/keyframes.js` import must dedupe onto one instance — `vite.config.ts:28-38`), but the effect is that the demo does **not** exercise the published package surface; it exercises `src/`. Any regression that exists only in the built `dist/keyframes.js` (e.g. a bad exports emit) would pass every demo build. The self-alias is a package-shadowing alias — precisely the masking-fallback class the lane flags.

**Disposition — FOLD.** Keep the alias (it is load-bearing for glass-ui dedup) but stop the prose claiming "consumes the PUBLISHED barrel" — reword `kf-engine.ts` to say the demo consumes the barrel *source via `@src`-equivalent alias*. If genuine published-tarball dogfood is wanted, add one CI job that installs the packed tgz and imports `@mkbabb/keyframes.js` without the alias.

## CT-04 — demo bypasses the public surface with 11 deep `@src/animation/*` imports reaching internals

**Severity:** P2 · **Family:** barrel-bypass / import-graph-inconsistency

**Evidence.** `grep -rn "from ['\"]@src/animation/" demo/` → **11 imports across 8 files**:
- `@src/animation/internal/helpers` ×4 — `debounce` (CSSCodeEditor.vue:42, useKeyframeOps.ts:4, useKeyframesParsing.ts:1, …)
- `@src/animation/resolve/browser` ×3 — `convertPixelsToCh` (CSSCodeEditor.vue:40, useKeyframesState.ts:1, …)
- `@src/animation/compile/emit/css-text` ×3 — `reverseCSSTime`, `serializeTimingFunction` (useKeyframeOps.ts:1, parseAnimationCSS.ts:7)
- `@src/animation/compile/selector` ×1 — `namedSelectorToFraction` (keyframeSelector.ts:12)

None of these five symbols is on any public surface:
- `grep -c` in `src/animation/index.ts` (the `.` barrel) → **0** for all five; the barrel re-exports none of `internal/helpers`, `resolve/browser`, `compile/selector`, `compile/emit/css-text`.
- `public.ts` (the `./engine` subpath) exports none of them either (read in full).

So the demo reaches library *internals* through deep source paths — a direct contradiction of `kf-engine.ts`'s claim of "not the deep `@src/animation/*` source paths." The import surface is therefore **inconsistent**: barrel (`@mkbabb/keyframes.js`, 94×) + `@kf-engine` seam (17×) + undocumented deep `@src` internals (11×). A real `npm i` consumer could not write these imports at all — they have no public path.

**Disposition — BUILD (small).** Either (a) promote the genuinely reusable helpers (`debounce`, `convertPixelsToCh`, `reverseCSSTime`, `serializeTimingFunction`, `namedSelectorToFraction`) onto a public surface (the `.` barrel or a documented `./engine` re-export) and switch the demo to it, or (b) accept them as demo-private and delete the false "not the deep `@src`" claim from `kf-engine.ts`. Do not let the contract prose and the graph disagree.

## CT-05 — parse-that 1.0.0 orphan residue in node_modules

**Severity:** P3 · **Family:** node_modules-drift

**Evidence.** `node_modules/@mkbabb/parse-that/package.json` → **1.0.0** present on disk, but `grep -c parse-that package-lock.json` → **0**. The transaction's lock diff removes `node_modules/@mkbabb/parse-that` (it was a transitive of `@mkbabb/value.js@3.1.0`, whose removed lock lines show `"@mkbabb/parse-that": "^1.0.0"`). value.js 4.0.0 is rootless (`node -e require('.../value.js/package.json').dependencies` → **undefined**), so parse-that is no longer reachable; the on-disk copy is stale. src references it only in comments (`internal/leaves.ts:9-10` — asserting the light subpath is "parse-that-FREE"), never as an import. Cosmetic — a re-`npm ci` prunes it.

**Disposition — RETIRE.** Prune on next clean install; no code action. Track only as evidence the working tree is mid-transaction (matches CT-01/CT-02 drift).

---

## Negatives (checked and found sound)

1. **Registry versions + integrity verified.** `npm view @mkbabb/keyframes.js@6.0.0 version` → `6.0.0` (integrity `sha512-mpb3gSxU…`); `@mkbabb/value.js@4.0.0` → `4.0.0` (integrity `sha512-Z8ywb4ht…`). The local lock's value.js node records **exactly** `sha512-Z8ywb4htSxJlRFvoU1DNtvzr9Bsuaw9ahT/hvNlKbnRj6fTnLuXjn0itKq1Q5s6rwg24ct0zcLZ04BuR3/SzGw==` and the npmjs.org tarball URL — matches published. Installed value.js is 4.0.0.
2. **Exports maps match published, both packages.** Local kf `package.json` exports = `{".": {types, default}, "./engine": {types, default}}` == `npm view @mkbabb/keyframes.js@6.0.0 exports`. value.js published exports = the **7 subpaths only** (`./color ./value ./css ./easing ./math ./transform ./quantize`) == the installed `node_modules/@mkbabb/value.js` exports; **no root, no `./parsing`, no `./units`** — deletions confirmed on the registry surface.
3. **value.js consumed via subpaths ONLY — the P0 trap passes.** All ~70 `@mkbabb/value.js` imports in `src/` target the seven live subpaths; `grep` for `from "@mkbabb/value.js"` (root), `@mkbabb/value.js/parsing`, `@mkbabb/value.js/units` → **zero matches**. No deleted-subpath import anywhere in src.
4. **`./engine` static mirror INTACT — 44 == 44 == 44, exact.** The `AnimationEngine` interface (`load-engine.ts`) declares **44** members; `public.ts` (the `./engine` entry source, `vite.config.ts:170`) re-exports them; the built `dist/engine/index.js` has **44** runtime named exports, set-equal to the interface (verified by dynamic `import()` + key sort). No mirror drift, no missing/extra key. The loader and subpath share one module (`import("./public")`), so a name cannot land in one and not the other.
5. **Published library dependency boundary is clean.** kf 6.0.0 declares exactly one runtime dep — `@mkbabb/value.js: 4.0.0` (`npm view … dependencies`). glass-ui and parse-that are correctly absent from the *published library* deps (they are demo-only); the shipped tarball is not polluted.
6. **No alias other than the self-alias shadows a published package.** The remaining vite aliases (`@src`, `@styles`, `@state`, `@components`, `@utils`, `@kf-engine`, `@composables`) are demo-private namespaces, not published-package names.

## Coverage gaps

- **Did not observe the CT-01 break at runtime.** node_modules currently carries the phantom glass-ui 7.0.0, so a local `vite build --mode gh-pages` would *pass* — the break manifests only under a clean `npm ci`, which the lane's hard rules forbid me from exercising. Severity rests on static reading of the `npm ci` workflows plus the empty lock, not a reproduced failing build.
- **`dist/keyframes.js` light-barrel boundary** (does value.js beyond `/math` leak onto the static `.` barrel?) is `proof:boundary`'s territory and another lane's — not verified here.
- **Sibling glass-ui repo state** (why it is at unreleased 7.0.0) is read-only/out-of-scope; I confirmed only that 7.0.0 is not on the registry.
- **Whether the transaction author intends to re-add the glass-ui pin before commit** is unknowable from the tree; findings describe the on-disk state as it stands at audit time.
