# Tranche J audit — build / packaging / release

Lane: **build-packaging**. Scope: `package.json` (scripts, exports, files, deps), `vite.config.ts`,
`tsconfig*`, `.changeset/**`, `dist/` state, `npm pack --dry-run`.
Tree: `master` @ `4072af9`. Date 2026-06-09. Read-only.

---

## §0 — Snapshot commands run

```
npm pack --dry-run         # observed tarball contents
npm ls --depth=0           # installed dep tree
python3 -c "…"             # proof:all vs CI coverage diff (inline below)
```

---

## §1 — Exports map / shipped file set

**npm pack --dry-run output (package.json:28 `"files": ["dist"]`):**

```
dist/_redirects            25 B   ← CF Pages SPA routing config (see §4)
dist/animate-CbYJT2p8.js  960 B
dist/animations-Bh4iSiMM.js  12.7 kB
dist/draw-svg-gICVS7eq.js  1.5 kB
dist/engine-Dcgwzp_B.js   36.5 kB
dist/keyframes.d.ts       128.7 kB
dist/keyframes.js          16.0 kB
dist/motion-path-Cf2Vi7p0.js  1.0 kB
dist/springTimingFunction-Dqeea4sG.js  6.1 kB
dist/timeline-DGmUwYQF.js  8.8 kB
```

**Exports map** (`package.json:21-27`):

```json
".": {
    "types": "./dist/keyframes.d.ts",
    "import": "./dist/keyframes.js",
    "default": "./dist/keyframes.js"
}
```

Observations:
- ESM-only build confirmed: `vite.config.ts:291` `formats: ["es"]` — no `"require"` condition.
- Hash-named chunks (`engine-Dcgwzp_B.js` etc.) are legitimate lazy-load splits from
  `src/animation/index.ts:203-207`'s dynamic `import("./engine")` boundary.  `keyframes.js:448-452`
  static-imports them at `loadAnimationEngine()` call time — correct for the shipped ESM.
- `"main": "./dist/keyframes.js"` (`package.json:19`) covers legacy resolvers; fine for ESM-only.
- `dist/keyframes.d.ts` rolls up all public symbols — CI step at `ci.yml:68-98` verifies 15/15.

**Finding BP-1 (P1):** `dist/_redirects` (`public/_redirects:1` — `/* /index.html 200`) is a
Cloudflare Pages SPA routing directive, not library material.  Vite 8 lib mode copies `publicDir`
(default `"public"`) into `outDir` even for library builds unless `publicDir: false` is set.  The
production-mode config at `vite.config.ts:283-337` sets neither `publicDir: false` nor a separate
`outDir` for the library — so `public/_redirects` lands in `dist/` and rides every `npm publish`.
Consumer `node_modules/@mkbabb/keyframes.js/dist/_redirects` is harmless at runtime but is dead
weight in the tarball and technically a cargo-cult leak.  Fix: add `publicDir: false` to the
production-mode config block (`vite.config.ts:283`).

---

## §2 — CJS / verbatimModuleSyntax

`"type": "module"` (`package.json:17`) + `formats: ["es"]` (`vite.config.ts:291`) + no `"require"`
export condition: **the package is ESM-only by construction**.  This is correct and consistent.

**Finding BP-2 (P2 / stale docs):** `CLAUDE.md:8` states:

> `npm run build  # library → dist/keyframes.js + keyframes.cjs + keyframes.d.ts`

and `CLAUDE.md:88`:

> `src/animation/index.ts — builds to dist/keyframes.js (ESM) + dist/keyframes.cjs (CJS) + dist/keyframes.d.ts`

No `keyframes.cjs` exists in `dist/` and the vite config never emits one.  Git history shows CJS
was removed (`e49855d` "remove stale dist build artifacts").  Both CLAUDE.md claims are stale
and mislead J contributors about the package surface.

**Finding BP-3 (P2 / stale docs):** `CLAUDE.md:246-260` — the test suite section states
"15 files, 261 tests".  Actual count: **69 test files** (`ls test/*.test.ts | wc -l`).  The library
tests grew through tranches E–I and the docs were never updated.

---

## §3 — Dual changeset / SemVer recommendation

`.changeset/tranche-h.md` — `patch`:
- `frame-compiler.ts` blank-selector fail-explicit belt (bugfix, no signature change).
- Demo work only, library byte-stable vs 4.1.0.

`.changeset/tranche-i.md` — `patch`:
- `format.ts`: serialize from declared template, not DOM-resolving `at(progress)` (bugfix).
- `group.ts`: typed no-op `transform` default + lazy adopt (bugfix).
- `@mkbabb/value.js` floor advance `^0.11.1 → ^0.11.2` (the B1 empty-input contract).

**Stack:** two unpublished `patch` changesets → `4.1.0 → 4.1.2` under changeset's normal collapse
rule (each patch produces one version increment; the two changesets would stack as `4.1.1` then
`4.1.2`).

**The floor-move question.** The tranche-i changeset itself flags this: "the dependency floor move
is the reason a maintainer may elect to ship this as a `minor`."  The argument for `minor` (4.2.0):
advancing a required dependency's minimum version is a contractual tightening — consumers on
`value.js 0.11.1` (a validly-published version within the old declared range `^0.11.1`) would now
get a `value.js` upgrade they did not opt into.  The argument for `patch`: (a) it is a bugfix
(`parseCSSValueUnit("")` now returns `ValueUnit(0)` rather than throwing), (b) `value.js` is an
implementation dependency, not a peer, (c) the `^` range resolves to `>=0.11.2 <0.12.0` so the
floor advance is contained within the declared minor series.

**Recommendation (for version owner):** ship `4.2.0` (minor).  The empty-input-contract floor
advance protects consumers who pin `value.js` themselves from a runtime throw that existed in
4.1.x; advertising it as `minor` is the honest signal.  Tranche H's bugfix (`frame-compiler.ts`
blank-selector) is strictly backward-compatible and can ride the same bump.

---

## §4 — proof: script-key estate (109 keys)

`package.json` contains **109 `proof:` keys** + 11 non-proof = 120 total.  The proof: keys ARE
the gate registry — they are the authoritative `npm run` handles, the CI step commands, and the
inputs to `proof:gate-is-runtime` and `proof:ci-coverage`.

**Architecture verdict: package.json is the correct single home.**  The alternative (a separate
`gate-manifest.json`) would require synchronizing three sources (manifest + CI steps + proof:ci-
coverage exclusion list) instead of two (package.json + CI steps), and `proof:gate-is-runtime`
already reads `package.json` directly.  The sprawl is a readability issue, not an architecture
bug.  The two-tier aggregators (`proof:correctness` / `proof:hygiene`) correctly partition the
estate.

**Finding BP-4 (P1): 3 CI-wired gates absent from `proof:all`.**

```
proof:dock-zorder          ci.yml:826  →  NOT in proof:hygiene or proof:correctness
proof:scene-control-dfa    ci.yml:322  →  NOT in proof:hygiene or proof:correctness
proof:scene-transition-perf ci.yml:338 →  NOT in proof:hygiene or proof:correctness
```

Verified by:
```python
# ci_proof ∩ proof_all_chain complement → {proof:dock-zorder, proof:scene-control-dfa, proof:scene-transition-perf}
```

`proof:all` is documented as the local-run equivalent of CI, but running it locally skips these
three gates.  `proof:ci-coverage` (clause 0) requires every `proof:*` key to be invoked in CI —
which they are — but does NOT enforce that every CI-run gate is in `proof:all`.  This is a silent
divergence between local `proof:all` and the CI gate matrix.  Fix: add all three to `proof:hygiene`
(they are HYGIENE-tier: FSM correctness is owned by correctness-tier gates; these lock shape and
perf budget).

---

## §5 — proof:deps-current FLOORS stale (two stale floors)

`scripts/proof-deps-current.mjs:58-66`:

```js
const FLOORS = {
    "@mkbabb/value.js": "0.11.1",   // stale: H.W8 floor; should be 0.11.2
    "@mkbabb/parse-that": "0.9.0",  // current
    "@mkbabb/glass-ui": "3.5.1",    // stale: H.W8 floor; should be 3.9.0
};
```

**Finding BP-5 (P1): `value.js` floor 0.11.1 does not protect the B1 regression.**  The I.W0
bugfix requires `value.js ≥ 0.11.2` (the empty-input-contract publish, per the changeset).  A
developer who manually pins `value.js` to `0.11.1` (within the old declared range) will pass the
floor gate but re-introduce the `Parse error at offset 0: "......"` crash (B1/B5).  The floor
should track the correctness minimum: `0.11.2`.

**Finding BP-6 (P1): `glass-ui` floor 3.5.1 does not protect the B7 regression.**  The I.W6
consume-edge requires `glass-ui ≥ 3.9.0` (the flat specular default).  Installed is 3.9.0;
declared is `~3.9.0`; but the floor gate passes any version ≥ 3.5.1.  A resolver that downgrades
to 3.7.x (within the old ~3.5.1 range) would pass the floor check but re-introduce the specular
bloom (B7).  The floor should be `3.9.0`.

Both floors were authored at H.W8 time and were not advanced when tranche I bumped the pins.

---

## §6 — Stale version comments in workflows

**Finding BP-7 (P2): `ci.yml:199` and `ci.yml:200` reference `~3.5.1`.**

```yaml
# PUBLISHED registry package (`@mkbabb/glass-ui ~3.5.1`, the H.W8 BLK-5
# consume-leg + re-pin — TILDE (>=3.5.1 <3.6.0), NOT caret: it consumes
```

Actual pin: `"~3.9.0"` (`package.json:173`).  The comment belongs to H.W8 and was not updated when
I.W6 re-pinned to `~3.9.0`.  `proof:ci-coverage` clause 1 only checks bare `^0.NN.0` caret
literals — tilde-range comment prose escapes the gate.

**Finding BP-8 (P2): `deploy-pages.yml:58` references `^3.4.0`.**

```yaml
# registry package (`@mkbabb/glass-ui ^3.4.0`); `npm ci` installs it
```

Pre-dates the H.W8 re-pin entirely.  The comment is from a much earlier wave.

---

## §7 — vite.config.ts post-I.W5 audit (ONE build root)

I.W5 (`bea5f27`) established the single canonical `outDir` rule:

| Mode | root | outDir | emptyOutDir |
|------|------|--------|-------------|
| `production` (library) | project root | `dist/` (vite default) | not set |
| `gh-pages` | `./demo/app/` | `./dist/gh-pages/` | true |
| default (dev build) | `./demo/app/` | `./dist/demo-app/` | true |
| `playground` | `./demo/playground/` | not set (dev only) |  |

The `demo/app/dist/` orphan (the B9-b landmine) is **STRUCTURALLY DEAD** — the default dev
non-build mode points `outDir` at `dist/demo-app/`, so no `vite build` can spawn the orphan
path.  `vite.config.ts:219` (`DEMO_DEFAULT_OUTDIR`) documents this invariant explicitly.

The `assetExtension404Plugin` (`vite.config.ts:247-278`) correctly intercepts `apply: "serve"`
and neutralizes the SPA fallback for asset-extension misses (B9-a).  DEV only, no build impact.

The `criticalCSSPlugin` and `deferLazyCSSPlugin` are gh-pages-only (`mode.mode === "gh-pages"`),
no library-build impact.

No issues found in the vite config post-I.W5 beyond BP-1 (`publicDir` not disabled in `production`
mode).

---

## §8 — tsconfig audit

`tsconfig.json`: `strict: true`, `verbatimModuleSyntax: true`, `exactOptionalPropertyTypes: true`,
`moduleResolution: "bundler"`, `target: "ES2022"` — all correct.

`tsconfig.lib.json` extends root and restricts `include: ["src/"]` — the glass-ui-free CI gate.
Verified: `check:lib` runs `tsc --noEmit -p tsconfig.lib.json`.

The API Extractor warning:

```
*** The target project appears to use TypeScript 6.0.3 which is newer than the bundled
    compiler engine; consider upgrading API Extractor.
```

appears on every `build:lib` run (`npm pack --dry-run` output).  `@microsoft/api-extractor:
^7.58.7` (`package.json:178`).  The warning is non-fatal and the dts rolls up correctly (verified:
`dist/keyframes.d.ts` = 128.7 kB, 15/15 public symbols).  The bundled TS in api-extractor's
own dist is behind the project's `typescript@^6.0.3`.  This is a low-friction cosmetic noise item;
upgrading `@microsoft/api-extractor` to a version that bundles TS 6.x would silence it.

---

## §9 — Dependency hygiene

`npm ls --depth=0` extraneous packages:

```
@emnapi/core@1.10.0 extraneous
@emnapi/runtime@1.10.0 extraneous
@emnapi/wasm-runtime@1.2.1 extraneous
@napi-rs/wasm-runtime@1.1.4 extraneous
@tybys/wasm-util@0.10.2 extraneous
```

These are transitive dependencies of `rolldown@1.1.0` (napi-rs wasm runtime modules).  They are
extraneous because keyframes.js does not declare them directly; npm hoisted them from rolldown's
subtree.  They pose no correctness risk and are not included in the published tarball (only `dist/`
is in `"files"`).

`rolldown@1.0.0` declared in `package.json:205`, resolved to `1.1.0` (minor auto-update within
the `^1.0.0` range).  No issue.

`"vue": "^3.5.0"` is correctly a `peerDependency` (demo-only; library externalizes it).

`"@mkbabb/glass-ui": "~3.9.0"` is correctly an `optionalDependency` (the tilde rationale per
`MEMORY.md`: tilde caps at `<3.10.0` to avoid consuming unreleased API-breaking glass-ui changes
while the specular-off default is baked in 3.9.x).  The tilde is correct; `~3.9.0 = >=3.9.0
<3.10.0`.

**Finding BP-9 (P2 / stale docs): `deploy-pages.yml:58` and `robots.txt:4` are two more stale
refs.**  `demo/app/public/robots.txt:4`:

```
Sitemap: https://mkbabb.github.io/keyframes.js/sitemap.xml
```

The site is at `keyframes.babb.dev` (Cloudflare Pages, per MEMORY.md).  The github.io URL is the
old GitHub Pages path.  No `sitemap.xml` exists in the repo.  The Sitemap directive is dead.

**Finding BP-10 (P2): `package.json:156` `"author": ""`.**  Empty author field.  Minor metadata
hygiene; should be `"Mike Babb <mike@babb.dev>"`.

---

## §10 — CI / release workflow hygiene

`release.yml`: triggered on `v*.*.*` tag push, runs `check:lib → build:lib → test →
proof:boundary → npm publish --provenance`.  The gate set is deliberately minimal (library-only).
The `proof:boundary` step is load-bearing (the value.js static/dynamic boundary invariant).
`concurrency.cancel-in-progress: false` is correct (a mid-publish cancel would corrupt the
registry).

`deploy-pages.yml`: green-CI-gated via `workflow_run` on `ci` SUCCESS + `head_branch == master`.
The `workflow_dispatch:` fallback is present.  The `concurrency.cancel-in-progress: true` is
correct here (a superseded deploy on the same SHA can be safely replaced).

---

## §11 — Findings table

| ID | Sev | Title | Evidence |
|----|-----|-------|----------|
| BP-1 | P1 | `public/_redirects` ships in npm tarball | `npm pack --dry-run` → 25 B `dist/_redirects`; `vite.config.ts:283-337` no `publicDir: false`; `public/_redirects:1` matches |
| BP-2 | P2 | CLAUDE.md claims CJS build (`keyframes.cjs`) that does not exist | `CLAUDE.md:8,88`; `vite.config.ts:291` `formats: ["es"]`; `ls dist/*.cjs` → nothing |
| BP-3 | P2 | CLAUDE.md test count stale (claims 15 files) | `CLAUDE.md:246`; `ls test/*.test.ts \| wc -l` → 69 |
| BP-4 | P1 | 3 CI-wired gates absent from `proof:all` | `ci.yml:322,338,826`; `package.json` proof:hygiene/correctness chains verified |
| BP-5 | P1 | `proof:deps-current` value.js floor 0.11.1 allows B1-regression version | `scripts/proof-deps-current.mjs:61`; `package.json` range `^0.11.2` |
| BP-6 | P1 | `proof:deps-current` glass-ui floor 3.5.1 allows pre-B7 version | `scripts/proof-deps-current.mjs:64`; `package.json` range `~3.9.0` |
| BP-7 | P2 | `ci.yml` comment says glass-ui `~3.5.1` (stale H.W8) | `ci.yml:199-200`; actual: `package.json:173` `~3.9.0` |
| BP-8 | P2 | `deploy-pages.yml` comment says glass-ui `^3.4.0` (pre-H) | `deploy-pages.yml:58`; actual: `package.json:173` `~3.9.0` |
| BP-9 | P2 | `robots.txt` Sitemap points to dead github.io URL | `demo/app/public/robots.txt:4`; site is `keyframes.babb.dev`; no `sitemap.xml` in tree |
| BP-10 | P2 | `package.json` `"author": ""` empty | `package.json:156` |
