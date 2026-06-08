# H.WZ — THE VERIFY LANE (the final ship-readiness check)

**Lane:** H.WZ VERIFY — the ship-readiness gate. **Branch:** `tranche-h-impl` (19 commits
ahead of `master`; W8 the close keystone at `1f506b2`). **Scope:** run the full CI-equivalent
suite, report each result verbatim, confirm the working tree + the three close docs (FINAL.md ·
prompt-recap · changeset, Lane A/B/C) are coherent, and render the SHIP-READY verdict. This lane
does **not** commit / merge / publish / deploy — those are the LEAD's + the user's (deploy is
user-domain, confirm-first).

**Playwright resolution (as CI does):** `npm i --no-save @playwright/test` + `npx playwright
install chromium` (chromium already cached). `resolveChromium()` (`scripts/lib/demo-driver.mjs`)
resolves from the repo root → OK; the browser gates ran under `KF_REQUIRE_BROWSER=1` (LIT, not
skipped).

---

## 1. The result table (verbatim)

| # | Check | Command | Result | Exit |
|---|---|---|---|---|
| 1 | **`tsc --noEmit`** | `npx tsc --noEmit` | **0 errors — clean** | **0** |
| 1b | `check:lib` (library-scoped) | `npm run check:lib` (`tsc --noEmit -p tsconfig.lib.json`) | **0 errors** | **0** |
| 2 | **`npm test`** (vitest) | `npx vitest run` | **68 files passed · 682 passed + 2 expected-fail (684)** | **0** |
| 3 | **library build** | `npm run build` (`vite build --mode production`) | **`dist/keyframes.js` (16 KB) + `dist/keyframes.d.ts` (127 KB) built; engine/timeline/animations chunks emitted** | **0** |
| 4 | **demo build** | `npm run gh-pages` (`vite build --mode gh-pages`) | **`dist/gh-pages/index.html` + assets built** (non-fatal rolldown `#__PURE__`/dynamic-import warnings only) | **0** |
| 5 | **`proof:all`** | `KF_REQUIRE_BROWSER=1 npm run proof:all` | **GREEN — 91 inline gates + `vitest run`** | **0** |
| 6 | **`proof:browser`** | `KF_REQUIRE_BROWSER=1 npm run proof:browser` | **35/35 browser gates GREEN** | **0** |
| 7a | **`proof:chronic-closure`** (meta-gate, 4 chronics) | `npm run proof:chronic-closure` | **GREEN — all 4 chronics exit to discipline** | **0** |
| 7b | **`proof:manifest-sourced`** | `npm run proof:manifest-sourced` | **GREEN — SCENES ≡ scenes.ts ids (8 scenes, bidirectional set-equality)** | **0** |
| 7c | **`proof:ci-coverage`** | `npm run proof:ci-coverage` | **GREEN — 97 gates CI-invoked (5 recorded exclusions); version-literal synced; registry-clean; concurrency present** | **0** |
| 7d | **`proof:boundary`** | `npm run proof:boundary` | **GREEN — library value.js-free on the light surface, engine on the dynamic boundary, API-stable (inv α)** | **0** |
| 8 | **`proof:specular-handoff`** (born-RED HANDOFF) | `npm run proof:specular-handoff` | **PASS (born-RED witness held) — HANDOFF correctly PENDING; flips RED when glass-ui 3.8.0 ships** | **0** |

### Verbatim gate tails

**`proof:chronic-closure`** (the four-chronic meta-gate):
```
✓ proof:chronic-closure — every chronic exits to discipline (PROGRESS.md §"Open deferrals"):
    • cartoon-shadow depth (D2) / specular (D14)
        load-bearing: proof:cartoon-is-panel-depth, proof:no-orphan-specular, proof:glass-and-cartoon, proof:specular-handoff · HANDOFF-paired born-RED · RETIRED(absent): proof:cartoon-specular-coexist, proof:specular-calm
    • φ-hero typography (D7)
        load-bearing: proof:phi-leaf-zero, proof:hero-rung
    • mobile architecture (D10)
        load-bearing: proof:mobile-single-page, proof:drawer-spring
    • dock LAG (D5) + @mbabb popover (D9)
        load-bearing: proof:dock-morph-settled, proof:dock-popover-opens, proof:single-toggle · HANDOFF-paired born-RED
```

**`proof:ci-coverage`** (the 97-gate / version-literal claim):
```
✓ coverage — all 97 proof:* gates are invoked in CI (5 recorded exclusions); the inv-tagged gates run.
✓ version-literal (G.W6 S1) — no ci.yml version literal disagrees with package.json's declared @mkbabb/* range (the dep-order floor is single-sourced).
✓ registry-glass-ui (G.W6 S2 re-grounded) — ZERO workflow clones the glass-ui sibling or carries a file: glass-ui reference; the demo jobs consume the published registry package via `npm ci`.
✓ concurrency (G.W6 S4) — all 3 workflows declare a top-level `concurrency:` block.
```

**`proof:boundary`** (the library stays value.js-free / API-stable):
```
proof:boundary — PASS: every barrel light entry is value.js-free, the
heavy engine rides only the dynamic boundary, and no dormant static
specifier sits in light source. inv α holds across the full light surface.
```

**`proof:specular-handoff`** (born-RED HANDOFF, exit 0):
```
◐ HANDOFF PENDING (born-RED witness — EXPECTED) — glass-ui has NOT shipped the calmer Card default + wire-or-omit seam …
proof:specular-handoff — PASS (born-RED witness held): the glass-ui Card-default + dock-icon
specular HANDOFFs are correctly PENDING; the consume-leg is not yet due.
```

---

## 2. The gate-regime count — independently re-derived (matches FINAL.md §4)

| Claim (FINAL.md / changeset) | Re-derived | Verdict |
|---|---|---|
| **102 `proof:*` npm scripts** (100 leaves + `proof:all` + `proof:browser`) | `Object.keys(scripts).filter(proof:)` → **102** (both aggregators present) | ✓ |
| **`proof:all` chains 91 distinct gates** inline + trailing `vitest run` | `npm run proof:*` invocations in `proof:all` → **91 distinct**, ends with bare `vitest run` → **true** | ✓ |
| **`proof:browser` = 35 browser gates** | CANDIDATE_GATES resolved against package.json → **35/35 resolve** | ✓ |
| **`proof:ci-coverage` = 97 CI-invoked gates** (5 recorded exclusions) | gate self-reports **97 invoked, 5 exclusions** | ✓ |
| glass-ui consumed at **`~3.5.1`** | `node_modules/@mkbabb/glass-ui` → **3.5.1** | ✓ |

---

## 3. The library-surface / SemVer claims — independently verified (Lane C coherence)

| Claim (changeset audit) | Re-derived | Verdict |
|---|---|---|
| `src/animation/index.ts` **byte-stable vs master** | `git diff master...HEAD -- src/animation/index.ts` → **empty** | ✓ |
| only **2** `src/` files changed vs master | `git diff master...HEAD --name-only -- src/` → **`frame-compiler.ts` + `env.d.ts`** | ✓ |
| the W0 blank-selector guard is present + throws **`AnimationOptionError`** | `frame-compiler.ts:163-164` — `if (typeof start === "string" && start.trim() === "")` → `throw new AnimationOptionError(...)` | ✓ |
| `AnimationOptionError` is an **already-public** export | `index.ts:80` — `export { AnimationOptionError, UnknownEasingError } from "./internal/errors"` | ✓ |
| only **`.changeset/tranche-h.md`** pending (clean 4.1.0 base → straight PATCH) | `ls .changeset/*.md | grep -v README` → **`tranche-h.md`** only | ✓ |
| changeset declares **`patch`** (4.1.0 → 4.1.1) | `.changeset/tranche-h.md` front-matter → `"@mkbabb/keyframes.js": patch` | ✓ |

---

## 4. Working-tree hygiene — confirmed

`git status --short` — the ONLY untracked paths are the four WZ close artifacts (zero stray
uncommitted source):

```
?? .changeset/tranche-h.md
?? docs/tranches/H/FINAL.md
?? docs/tranches/H/audit/impl-wz-changeset.md
?? docs/tranches/H/audit/prompt-recap.md
```

(This `impl-wz-verify.md` is the fifth WZ doc, added by this lane.) `src/` is at exactly the
two-file fenced delta; `dist/` is built-fresh + git-ignored (`git ls-files dist/` → 0). No
stray source beyond the WZ docs.

---

## 5. The three close docs are coherent (Lane A/B/C cross-check)

The FINAL.md (Lane A), the prompt-recap (Lane B), and the changeset + rationale (Lane C) agree on
every load-bearing fact — independently confirmed against the running gates and the git state:

- **The bump:** all three → **PATCH 4.1.0 → 4.1.1**, sole library delta = the W0
  `frame-compiler.ts` blank-selector → typed `AnimationOptionError` BUGFIX; `env.d.ts` demo-only;
  the engine FENCED (inv ζ) save that one fix. Verified: §3 above.
- **The four chronics:** all three → CLOSED via SYSTEM gates (D2 partitioned `no-orphan-specular`
  + `cartoon-is-panel-depth` + `glass-and-cartoon`; D7 `phi-leaf-zero` + `hero-rung`; D10
  `mobile-single-page` + `drawer-spring`; D5 `dock-morph-settled` on consumed `~3.5.1`);
  `proof:chronic-closure` GREEN. Verified: §1 row 7a.
- **The born-RED handoffs:** all three → glass-ui Card-specular sheen (`proof:specular-handoff`,
  resolves glass-ui 3.8.0 `specular="off"`, kf's W34 leg), value.js/parse-that slices (standing),
  the CF Pages deploy (user-domain). Verified: §1 row 8.
- **The version owner:** all three → **Mike Babb (`mike@babb.dev`)**; publish + deploy are
  user-domain, confirm-first.
- **No drops / honest ledger:** the prompt-recap carries D0–D14 + F1–F9 + G1–G8 (+ the icon
  RE-INSTANTIATION correction) + I1–I12 + J1–J6, each ADDRESSED-with-gate or born-RED HANDOFF;
  the two genuine forks (F6 remove-specular; W8R glass-stage-sheen) recorded as USER-DECISIONS.
  Zero un-dispositioned punts.

---

## 6. Residuals (diagnosed honestly)

1. **`dist/keyframes.cjs` is never emitted — a documentation artifact, NOT a build target or a
   ship blocker.** CLAUDE.md, FINAL.md (§5 line 30 of the changeset-audit), and the changeset all
   describe the library building to "`dist/keyframes.js` + `.cjs` + `.d.ts`". The actual config
   emits ESM only: `vite.config.ts` lib block declares `formats: ["es"]`, and `package.json`
   `exports["."]` has **no `require` condition** — only `import` + `default`, both →
   `./dist/keyframes.js`. **This is PRE-EXISTING:** `formats: ["es"]` is byte-identical on
   `master` (H did not touch the lib block — the only `vite.config.ts` H delta is the demo-side
   svg-loader plugin). No published consumer path requires a `.cjs`; the package is ESM-only by
   design. **Disposition: NON-BLOCKING documentation drift** (the prose over-describes the output).
   It carries no SemVer signal and does not affect the release leg. A one-word doc fix ("ESM" not
   "ESM + CJS") would reconcile it, but it is out of this VERIFY lane's write-scope (docs/tranches
   only) and is not a CI gate.

2. **Non-fatal `npm run gh-pages` build warnings** — rolldown `[INVALID_ANNOTATION] #__PURE__`
   (from `@vueuse/core`'s vendored dist), `[INEFFECTIVE_DYNAMIC_IMPORT]` (CubeScene / engine.ts
   statically+dynamically imported), and a `>500 kB chunk` advisory. All are advisory; the demo
   built `✓` with `dist/gh-pages/index.html` present. **Disposition: NON-BLOCKING** (vendor-origin
   + chunking advisories; no error, exit 0).

No residual reaches the ship-readiness bar. Every gate is green or a NAMED born-RED HANDOFF.

---

## 7. SHIP-READINESS VERDICT

**SHIP-READY.** CI would pass.

- `tsc --noEmit` → **0**. `check:lib` → **0**.
- `npm test` → **684 (682 + 2 expected-fail), 0 unexpected, exit 0**.
- `npm run build` (library) + `npm run gh-pages` (demo) → **both built, exit 0**.
- `proof:all` → **GREEN** (91 inline gates + vitest). `proof:browser` → **35/35**.
- `proof:chronic-closure` → **GREEN** (the four chronics close, none can re-paper).
- `proof:manifest-sourced` / `proof:ci-coverage` (97 gates, `~3.5.1` synced) / `proof:boundary`
  (library value.js-free, API-stable) → **GREEN**.
- `proof:specular-handoff` → **exit 0** (born-RED HANDOFF, witness held — correctly pending).

The acceptance bar is met: **EVERY gate is green or a NAMED born-RED HANDOFF.** The working tree
carries no stray uncommitted source beyond the WZ docs. FINAL.md, the prompt-recap, and the
changeset are mutually coherent and match the running gates + the git state. The library is a
clean PATCH (4.1.0 → 4.1.1, the W0 BUGFIX, engine FENCED); the demo is CF-Pages-deploy-ready.

The merge to master, the npm publish (PATCH, version owner Mike Babb), and the CF Pages deploy
(`keyframes.babb.dev`, user-domain) are the LEAD's + the user's to trigger — NOT this workflow.
