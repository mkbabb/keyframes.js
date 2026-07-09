# a31-dependency-surface — Tranche R Audit

**Lane**: dependency + published surface (package.json census, exports map, files[], engines, npm artifact sanity)
**Range audited**: master `a15cd48..18e8617` (Tranche R)
**Method**: `git diff`/`git show` (read-only) over the R range; `npm view` registry queries (network, read-only); local gate execution (`node scripts/proof-*.mjs`, read-only); `npm pack` of the published `5.1.0` tarball into a temp dir.

## Executive summary

Tranche R's dependency footprint is **honest but narrow**: R.W4/R.W8 touched exactly two things in
`package.json` — the `./engine` exports subpath and the version/CHANGELOG cut to `5.1.0` — plus a churn
of new `proof:*` script entries. **Zero lines in `dependencies`/`devDependencies`/`optionalDependencies`
changed anywhere in the R range** (verified: `git diff a15cd48 18e8617 -- package.json` touches only
`version`, `exports`, and `scripts`). That narrowness is fine as far as it goes — R's charter was the
`src/`/`demo/` partition, not a dependency sweep — but it leaves two classes of residue that R's own
"hygiene" and "legacy-excision" framing implicitly promised to catch and did not:

1. **A currently-RED, CI-wired gate on master's HEAD.** `proof:pin-ledger-current` (blocking, wired into
   `ci.yml:441-442`, no `continue-on-error`) fails 6 of its 13 assertions right now — `ledger.shipped.self.version`
   still reads `4.4.0` against `package.json`'s `5.1.0`, and both `@mkbabb/value.js` (1.1.0→1.2.0) and the
   transitive `@mkbabb/parse-that` (0.12.0→0.13.0) drifted off the ledger's witnessed `shipped` set. R bumped
   the version and rode the ambient `^1.2.0`/transitive-`0.13.0` installs without re-authoring
   `docs/tranches/Q/PIN-LEDGER.json`. **FINAL.md's "Close state (gate roster)" table (docs/tranches/R/FINAL.md:180-197)
   does not mention this gate at all** — it is absent from both the roster and every wave doc in
   `docs/tranches/R/waves/`. R.W8's "proof:hygiene-chain GREEN" (implied by the final commit's own message,
   `18e8617`, chasing `proof:gate-is-runtime`) was evidently never actually run to a clean exit, or was run
   before the `value.js`/`parse-that` bumps and never re-verified after.
2. **Eight dead shadcn-vue-scaffold devDependencies survive untouched** — `v-calendar`, `vaul-vue`,
   `embla-carousel-vue`, `@unovis/ts`, `@unovis/vue`, `vee-validate`, `@vee-validate/zod`, `zod` — all present
   since the repo's `6fee7c2 initial testing` commit, all zero-importers today (`grep -rl` across `demo/` and
   `src/` returns nothing for any of the eight, including component-name greps: `VCalendar`, `Drawer`,
   `Carousel`, `Unovis`/`VisXY`/`VisLine`, `useForm`/`toTypedSchema`). R.W3's charter is explicitly "the
   legacy/workaround/fallback excision sweep," and R.W5 Band A did do a component-level dead-code sweep
   (deleted `SceneSwitcherCarousel.vue`, `Animated.vue`, `ResponsiveSelect.vue` — none of which even used the
   dead libs they might have justified). Neither wave looked one layer up to the manifest. This is
   pre-existing chronic debt R did not introduce, but R's own "no-legacy-anywhere" framing (CLAUDE.md /
   FINAL.md §6) claims a scope R's diff does not substantiate at the dependency layer.

Everything else on this lane is clean: the `5.1.0` npm artifact matches `package.json` exactly (registry
`npm view` cross-checked), the tarball's `files[]` whitelist works correctly (28 files, no `dist/gh-pages`
leakage, `dist/engine/{index.js,index.d.ts}` present), `exports` map resolves both `.` and `./engine`
correctly, `engines.node: >=22` is honored by CI (`node-version: 24`), and the static/dynamic LIGHT/HEAVY
boundary gates (`proof:boundary`, `proof:published-surface`) both genuinely pass.

## Findings

### 1. `proof:pin-ledger-current` is RED on master HEAD right now — a CI-blocking gate R shipped over without re-verifying (CRITICAL)

- **Evidence**: running `node scripts/proof-pin-ledger-current.mjs` on the current tree (`master` /
  `tranche-s-dev` at parity with `18e8617`) prints:
  ```
  FAIL  (c.1)/self-version  DRIFT: ledger.shipped.self.version (4.4.0) != package.json version (5.1.0)
  FAIL  (c.2)/@mkbabb/value.js/installed  DRIFT: node_modules/@mkbabb/value.js is 1.2.0, ledger says 1.1.0
  FAIL  (c.2)/@mkbabb/value.js/lockfile   DRIFT: package-lock.json resolves @mkbabb/value.js to 1.2.0, ledger says 1.1.0
  FAIL  (c.2)/@mkbabb/value.js/declared   DRIFT: package.json declares @mkbabb/value.js as ^1.2.0 (dependencies), ledger says ^1.1.0
  FAIL  (c.2)/@mkbabb/parse-that/installed DRIFT: node_modules/@mkbabb/parse-that is 0.13.0, ledger says 0.12.0
  FAIL  (c.2)/@mkbabb/parse-that/lockfile  DRIFT: package-lock.json resolves @mkbabb/parse-that to 0.13.0, ledger says 0.12.0
  ```
  exit code 1.
- **This gate is wired blocking into CI**: `.github/workflows/ci.yml:441-442` — a plain `run:` step, no
  `continue-on-error`, inside the "fast library gates" job alongside `proof:lint-clean`/`proof:wave-charter`.
  It is also inside `npm run proof:hygiene-chain` (`package.json` — `proof:pin-ledger-current` appears in the
  chain string both before and after the R diff).
- **`docs/tranches/Q/PIN-LEDGER.json`'s `shipped.self.version` is still `"4.4.0"`** (`git log --oneline -- docs/tranches/Q/PIN-LEDGER.json`
  shows exactly one commit, `ac40f72`, from Tranche Q — R never touched it). Q shipped `5.0.0` after that
  commit, and R shipped `5.1.0` after that — the ledger was never re-authored across either cut.
- **R's own close docs never mention it.** `docs/tranches/R/FINAL.md`'s "Close state (gate roster)" table
  (lines 180-197) lists 6 gates (`chronic-closure`, `ci-coverage`, `decomposition`, `lint-clean`, `build`,
  `test`) — `pin-ledger-current` is absent. `grep -rn "pin-ledger" docs/tranches/R/` returns zero hits across
  `R.md`, `FINAL.md`, and every `waves/R.W*.md`. The gate is not in R's plan, not in R's waves, not in R's
  close — but it is in R's shipped CI, and it is RED.
- **Failure scenario**: any CI run on `master` HEAD (`18e8617`) today fails at
  `proof:pin-ledger-current`, which is a blocking step in the "fast library gates" job — the job that runs
  earliest and gates the rest of the matrix. A contributor or the next tranche's CI run inherits a genuinely
  broken pipeline, not a green one, contradicting the "and green on `tranche-r-dev`" claim in
  `docs/tranches/R/FINAL.md:7`.
- **Severity**: CRITICAL — a currently-failing, non-optional CI gate on the tip of the branch R closed as
  green.

### 2. Eight zero-importer shadcn-vue-scaffold devDependencies survive the R "legacy excision" charter (MEDIUM)

- **Evidence**: `grep -rln` across `demo/` and `src/` (`.ts`/`.vue`) for each package name AND its
  characteristic component/API surface returns **zero hits** for all eight:
  - `v-calendar` (no `VCalendar`, no `DatePicker` import)
  - `vaul-vue` (no `vaul`, no `Drawer` import)
  - `embla-carousel-vue` (no `Carousel`, no `embla` import — R.W5's own deleted `SceneSwitcherCarousel.vue`
    was hand-rolled, confirmed via `git show 9c1d9bd^:demo/@/components/custom/SceneSwitcherCarousel.vue |
    grep -i embla` → no output, i.e. embla was already dead before R deleted the component that might have
    used it)
  - `@unovis/ts` / `@unovis/vue` (no `Unovis`, `VisXY`, `VisLine` import)
  - `vee-validate` / `@vee-validate/zod` / `zod` (no `useForm`, `toTypedSchema`, `from "zod"` anywhere)
  - All eight first appear in `git log --oneline --all -S '"<pkg>":' -- package.json` at the single commit
    `6fee7c2 initial testing` — pre-dating every lettered tranche.
- **R's charter directly claims this scope.** `docs/tranches/R/R.md:129` — "C lib hygiene | R.W3 | The
  legacy/workaround/fallback excision sweep." R.W5 Band A (`9c1d9bd`) *did* do component-level dead-code
  excision in the same spirit (deleted `SceneSwitcherCarousel.vue`, `useScrollSnapScene.ts`, `Animated.vue`,
  `ResponsiveSelect.vue` — "zero importers" is the exact criterion used in that commit message) but never
  extended the same "zero importers" test one layer up to `package.json`. `proof:no-dup-utility` and
  `proof:no-brittle-selector` audit source-level duplication; nothing in the R gate roster audits the
  manifest for unused packages.
- **Failure scenario**: none at runtime (dead deps don't break anything directly) — but every `npm install`
  pulls ~8 unused package trees (vee-validate's zod resolver chain, unovis's d3-dependency graph, monaco
  adjacent visualization libs), inflating `node_modules`, `npm run build` dependency-resolution time, and
  Dependabot/`npm audit` noise for code that is not shipped or reachable. It is exactly the kind of "legacy"
  R's own no-legacy-anywhere framing (CLAUDE.md, FINAL.md §6) claims to have swept — but the diff shows the
  sweep stopped at the file layer.
- **Severity**: MEDIUM — no functional break, real hygiene debt Tranche S's charter ("NO legacy/deprecated
  code anywhere") explicitly re-opens.

### 3. `@mkbabb/glass-ui` pin sits two minors behind npm `latest` (~4.0.0 vs 4.2.0), untouched by R (LOW, tracked elsewhere)

- **Evidence**: `package.json:260` — `"optionalDependencies": { "@mkbabb/glass-ui": "~4.0.0" }`, installed
  `4.0.1` (tilde admits patch-only). `npm view @mkbabb/glass-ui version` → `4.2.0`. `git log -p --follow --
  package.json | grep glass-ui` shows this pin has been `~4.0.0` since Tranche K's `1786:feat(tranche-K W1′):
  adopt glass-ui 4.0.0`, i.e. **R inherited it unchanged**, consistent with the R diff showing zero
  dependency-bucket edits.
- This is a *known*, actively-tracked gap, not a fresh R miss: `proof:peer-satisfied` (born-RED-by-design,
  `L.W4 S8`, correctly excluded from the blocking `proof:hygiene-chain` and `proof:all` — verified via
  `grep -n "proof:peer-satisfied" .github/workflows/ci.yml:1709` "EXCLUDED from the blocking `failed` set")
  already flags that glass-ui `4.0.1`'s own `peerDependencies` declares `@mkbabb/keyframes.js: "^4.0.0"` —
  which the *installed* `5.1.0` self violates. Running it live confirms: `glass-ui@4.0.1 declares peer
  @mkbabb/keyframes.js@"^4.0.0" but installed is 5.1.0 (ELSPROBLEMS)`. The memory ledger
  (`project_glassui_specular_consume_edge.md`) already frames this as a "born-RED HANDOFF until glass-ui
  4.2.0-era specular="off"" (F6-vs-I5 partition) — i.e. the fix is USER-DOMAIN / cross-repo, not an R
  omission.
- **Severity**: LOW as an R finding (R correctly left an owner-gated cross-repo pin alone); recorded here so
  Tranche S's dependency wave has the exact live number (glass-ui is now 2 minors behind, not 1 — 4.0.0→4.2.0)
  when it re-evaluates the BC-gated re-pin.

### 4. Two MAJOR-behind devDependencies outside caret range: `dependency-cruiser` (17→18) and `fast-check` (3→4) (LOW)

- **Evidence**: `npm view dependency-cruiser version` → `18.0.0` (declared `^17.4.3`); `npm view fast-check
  version` → `4.8.0` (declared `^3.23.2`). Both are real major bumps a caret range does not silently absorb.
  `dependency-cruiser` is the tool behind `npm run lint` / `proof:lint-clean` (the R.W1-authored gate); a
  major bump could change violation-detection behavior (new default rules, deprecated config keys) and is
  worth a deliberate, tested re-pin rather than an incidental one. `fast-check` has exactly one consumer
  (`test/grammar-fuzz.test.ts`) so its bump is contained.
- Neither was touched by R (R's `package.json` diff never enters `devDependencies`). Not a regression R
  introduced — general devDependency currency drift, worth a deliberate Tranche S wave line-item since S's
  charter calls for SOTA uplift.
- **Severity**: LOW.

### 5. `@types/node` (`^25.9.1`) is ahead of the `engines.node: ">=22"` floor by 3 majors (INFO)

- **Evidence**: `package.json:186` engines declares `node: >=22`; `devDependencies["@types/node"]` is
  `^25.9.1` (latest `26.1.0`, also ahead). `@types/node` versions track Node.js majors 1:1 since Node 18 —
  pinning `^25.x` types while declaring an `>=22` floor means the ambient DOM/Node lib types checked in CI
  (`node-version: 24` per `.github/workflows/ci.yml:59`) are for a Node major (25) that is neither the
  floor (22) nor the CI runner (24). In practice TS structural typing rarely breaks on this, but it is an
  inconsistency a future contributor running Node 22 locally could hit a type/runtime mismatch on (e.g. a
  `@types/node` 25-only global not actually present under Node 22).
- **Severity**: INFO — no observed breakage, just a pin-hygiene note.

### 6. Published artifact sanity — no findings (verification, not a defect)

- `npm view @mkbabb/keyframes.js version` → `5.1.0`, `dist-tags.latest` → `5.1.0`: matches `package.json`
  exactly, confirming the R.W8 publish runbook (`docs/tranches/R/FINAL.md:165-176`) executed correctly.
- `npm view ... exports` mirrors `package.json`'s `.`/`./engine` map exactly; `npm view ... dependencies` →
  `{ "@mkbabb/value.js": "^1.2.0" }`; `optionalDependencies` → `{ "@mkbabb/glass-ui": "~4.0.0" }` — both
  match declared pins (confirming the *published npm package* is not itself the source of the pin-ledger
  drift — the drift is entirely in the stale `PIN-LEDGER.json` witness file, finding 1 above).
  `engines` → `{ "node": ">=22" }`.
- `npm pack @mkbabb/keyframes.js@5.1.0` → 28 files: `LICENSE`, `README.md`, `package.json`, `dist/keyframes.js`
  + `dist/keyframes.d.ts` + `dist/engine/{index.js,index.d.ts}` + the hash-named lazy-split chunks
  (`animation-*`, `compile-*`, `group-*`, `presets-*`, `sequence-*`, `engine-*`×2, `easing-registry-*`×2,
  `parse-flatten-*`×2, `draw-svg-*`, `morph-svg-*`, `motion-path-*`, `grammar-*`, `ingest-*`, `scroll-*`,
  `scheduler-*`, `format-*`, `delegation-*`, `validate-*`). No `dist/gh-pages/**`, no `dist/_*` — the
  `files[]` negation patterns (`package.json:36-38`) work as declared.
- `proof:published-surface` and `proof:boundary` both genuinely PASS live on the current tree (not merely
  claimed) — the LIGHT/HEAVY static/dynamic split is real, not cosmetic.

## Tranche-S implications

1. **Immediate, cheap fix — re-author `docs/tranches/Q/PIN-LEDGER.json`'s `shipped` block** to
   `self.version: "5.1.0"`, `value.js: ^1.2.0`/installed `1.2.0`, `parse-that` installed `0.13.0` (transitive
   still holds — kf declares no direct spec), `glass-ui` unchanged (`~4.0.0`/`4.0.1`). This single doc edit
   flips `proof:pin-ledger-current` GREEN; verify by re-running `node scripts/proof-pin-ledger-current.mjs`
   before closing the wave. This should be an S-wave-zero item (it is currently the only genuinely BROKEN
   gate found on this lane) — likely folds naturally into whatever wave re-does the R→S chronic-ledger
   handoff, since it is exactly the kind of drift the ledger exists to catch.
2. **Add a manifest-level dead-dependency sweep to the S "no legacy anywhere" wave.** Remove (or prove live
   use of) `v-calendar`, `vaul-vue`, `embla-carousel-vue`, `@unovis/ts`, `@unovis/vue`, `vee-validate`,
   `@vee-validate/zod`, `zod` — 8 confirmed zero-importer devDependencies. Consider a new gate
   (`proof:no-dead-dependency` or fold into `proof:no-dup-utility`'s remit) that greps `package.json`
   dependency names against `demo/`+`src/` import specifiers and reds on an unreachable package, so this
   class of debt cannot silently regrow.
3. **Fold the glass-ui `~4.0.0`→`4.2.0` + `@mkbabb/keyframes.js` peer-range mismatch into whatever wave picks
   up the tracked `F-2` cross-repo ask** — it is unchanged by R (correctly, since it's cross-repo/USER-DOMAIN),
   but S's dependency wave should record the live gap is now 2 minors (not 1) so the eventual glass-ui BC
   re-pin has an accurate target.
4. **Line-item devDependency majors for a deliberate, tested bump**: `dependency-cruiser` 17→18 (re-verify
   `proof:lint-clean`'s baseline `[]` still holds post-bump — it drives the R.W1 no-cycle floor) and
   `fast-check` 3→4 (single consumer, low risk). Not urgent, but "SOTA uplift" is explicitly in S's charter
   and both are real major-version gaps a caret silently hides.
5. **Consider widening `proof:deps-current`'s remit** (currently only asserts `@mkbabb/*` sibling floors +
   protocol + realm-purity) or adding a sibling gate that would have caught finding 1 automatically — today
   nothing in the fast/cheap tier cross-checks `package.json.version` against `PIN-LEDGER.json` except the
   one gate that already exists and was simply not re-run/updated at the R.W8 cut. The gate design is sound;
   the process gap is that a version-bump wave (R.W8) didn't treat "re-run `proof:hygiene-chain` to a clean
   exit, not just the gates named in FINAL.md's roster" as part of its own definition of done.
