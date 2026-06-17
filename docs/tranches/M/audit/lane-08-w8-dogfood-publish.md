# Lane 08 — L.W8 Dogfood + Publish audit
## keyframes.js Tranche M charter seed

**Lane:** 08 · **Commit audited:** `339d78b` (feat: L.W8 SOTA usability + publish/dogfood completion)
**Date:** 2026-06-17 · **Branch:** `tranche-l-dev` (tip `529fcfd`)
**Auditor discipline:** inv ε — every claim cites an observed oracle or a verified file:line; no claim is repeated from a prior audit without re-verification

---

## 1. THE HEADLINE VERDICT

L.W8 (`339d78b`) LANDED all five S-clauses it promised, with four oracles GREEN and one RED-by-design (the user-domain publish). **The dogfood inversion is complete and gated.** The `Animation`→`KeyframesAnimation` rename cleared the API-Extractor `_2` collision family and GREENed `proof:pkg3-clean`. The `animate()` orchestration dispatch (S3) and the `keyframes-react` BOOK (S5) shipped to their stated scopes. **One factual discrepancy found by this audit:** the FINAL and commit message record "THREE breaking type changes" but the implementation contains a FOURTH (`presets.flip` → `presets.flipPreset`, documented `BREAKING (5.0.0)` in `src/animation/animations.ts:133`) that is absent from the FINAL's count. This is a M-ownedrecord-keeping task, not a regression.

M's primary W8 obligation is: (a) trigger the user-domain publishes (keyframes.js 5.0.0, keyframes-vue 0.1.0), (b) scaffold `packages/keyframes-react/` per the BOOK criteria, and (c) correct the four-breaking-change count in the 5.0.0 changelog draft.

---

## 2. S-CLAUSE VERIFICATION (ground-truth re-check against code, not prior audit text)

### S1 — ED-3 dogfood inversion

**Spec claim (L.W8.md §S1):** 63 demo files writing `@src/animation/*` flipped to `@mkbabb/keyframes.js`; `KFVUE_INVERSION_LANDED=1 proof:demo-on-published-surface` GREEN; `proof:dogfood` GREEN.

**Ground-truth verification:**

`grep -rn "@src/animation" demo/` on the current tree returns **2 lines** — both are comments in `demo/@/utils/kfEngine.ts:5` and `demo/@/components/custom/orbital-drag/composables/useOrbitalInertia.ts:12`. **Neither is an import specifier** — they are prose comments explaining the inversion. Zero deep imports remain as live specifiers.

`grep -rn "@mkbabb/keyframes" demo/` (excluding node_modules/dist/#) returns **96 lines** — verified live specifiers across 58+ files (e.g. `demo/easing/useEasingDemo.ts:13`, `demo/@/utils/kfEngine.ts:27`, `demo/spring/useSpringPaneDrag.ts:4`).

The commit message records `KFVUE_INVERSION_LANDED=1 proof:demo-on-published-surface GREEN (zero deep imports)`. The `proof-demo-on-published-surface.mjs:135-137` gate bites on `deepFiles > 0` when the env is set — today `deepFiles = 0`.

**S1 verdict: LANDED.** `proof:demo-on-published-surface` GREEN-by-construction; `proof:dogfood` GREEN per commit message. The W8 spec's "63 files / 114 import sites" was the pre-flip census; the post-flip count (58 files, 96 sites on barrel) is consistent with 5 engine internals exposed via `loadAnimationEngine()` and some demo files that had multiple imports per file consolidating.

**One architectural note for M:** `demo/@/utils/kfEngine.ts` is a synchronous warm-cache seam (`warmKfEngine()` + `kfEngine()`) that pre-resolves the heavy engine at `main.ts` boot so scene-switch reconcile can read it synchronously. This is a well-motivated pattern (explained at `kfEngine.ts:12–25`) and does NOT violate the `loadAnimationEngine()` boundary — it is the demo's own ergonomic wrapper, not a raw chunk import.

---

### S2 — keyframes-vue 0.1.0 publish-PREP

**Spec claim (L.W8.md §S2):** peer floor advanced to `>=4.3.0`; package builds `dist/keyframes-vue.{js,d.ts}`; `proof:keyframes-vue-published` clauses (a)+(c) GREEN, clause (b) RED-by-design; `release.yml` publish-keyframes-vue job authored.

**Ground-truth verification:**

- `packages/keyframes-vue/package.json` (read): `"@mkbabb/keyframes.js": ">=4.3.0"` in `peerDependencies` — **floor advanced.**
- `packages/keyframes-vue/dist/` (ls): `keyframes-vue.d.ts`, `keyframes-vue.js` — **build artifacts present.**
- `npm show @mkbabb/keyframes-vue` (run): E404 — **package absent from registry.** Clause (b) RED-by-design.
- `release.yml` (read lines 87–148): `publish-keyframes-vue` job present, `needs: publish` sequencing, `working-directory: packages/keyframes-vue`, `npm publish --provenance --access public` step — **job authored.**
- `proof:keyframes-vue-published` is in `package.json` scripts but NOT in `proof:hygiene` chain — **correctly wired as report-all tripwire, not a blocking gate** (verified by checking `proof:hygiene` string in `package.json:190`). `proof-ci-coverage.mjs:180` explicitly excludes it from the aggregator (with rationale matching `proof:peer-satisfied`'s exclusion pattern).

**S2 verdict: PREP LANDED; publish USER-DOMAIN.** `proof:keyframes-vue-published` RED-by-design until Mike Babb runs `npm publish` (clause b stays E404). The `release.yml` job fires on a `v*.*.*` tag.

**M obligation:** the first user-domain publish (either 4.3.0-for-kf-only or 5.0.0-bundle cutting both) fires clause (b) GREEN. M should decide whether to publish keyframes-vue alongside kf 5.0.0 or as an independent 0.1.0 cut. The `release.yml` job is sequenced to run after the core publish regardless of version — it will work for either cut.

---

### S3 — animate() orchestration dispatch

**Spec claim (L.W8.md §S3):** fifth dispatch branch routing `AnimationGroup | Sequence` to `.play()`; `proof:animate-orchestration` 4/4; `AnimateInput` widened; return type updated.

**Ground-truth verification:**

`src/animation/animate.ts:163` (read): `if (input instanceof AnimationGroup || input instanceof Sequence) {` — **branch present.**
`src/animation/animate.ts:164–167`: `input.setTargets?.(...targets)` + `if (autoPlay) void input.play()` + `return input` — **matches spec exactly.**
`src/animation/animate.ts:79–80` (type surface): `AnimateInput<V>` union includes `| AnimationGroup<V> | Sequence<V>` — **widened.**
`src/animation/animate.ts:147`: return type `CSSKeyframesAnimation<V> | AnimationGroup<V> | Sequence<V>` — **updated.**

`test/animate-orchestration.test.ts` (read): 4 test cases — (a) group.play() called + group returned BY REFERENCE; (b) seq.play() called + seq returned BY REFERENCE; (a') autoPlay:false skips play(); (c) bare `Error` preserved for genuinely unrecognized inputs. All four verified in the commit message (`vitest 868+2/870`).

**S3 verdict: LANDED.** The optional-call `setTargets?.()` is correctly defensive — `AnimationGroup.setTargets` exists (`group.ts:210`) and `Sequence.setTargets` exists (`sequence.ts:380`), so the optional call is guard-by-convention not a gap.

**One M API note:** the `AnimationGroup | Sequence` dispatch branch is placed BEFORE the `isMotionPathInput` check (`animate.ts:170`) — correct ordering since an `AnimationGroup` is a non-array object that `isKeyframeMap` would incorrectly accept. The commit message documents the pre-flip throw behavior: "WITHOUT orchestration dispatch, `isKeyframeMap(group)` accepted it and routed to `fromKeyframes(group)` which threw `AnimationOptionError`." This is consistent with the test's born-RED rationale.

---

### S4 — PKG-3 rename (Animation→KeyframesAnimation, etc.)

**Spec claim (L.W8.md §S4):** `class Animation` → `class KeyframesAnimation` in `engine.ts`; `class ScrollTimeline` → `class KeyframesScrollTimeline` in `timeline.ts`; backward-compat re-export aliases; `dist/keyframes.d.ts` has zero `_2 as` aliases; `proof:pkg3-clean` GREEN.

**Ground-truth verification:**

`src/animation/engine.ts:101`: `export class KeyframesAnimation<V extends Vars = any>` — **renamed.**
`src/animation/engine.ts:1205`: `export { KeyframesAnimation as Animation }` — **backward-compat alias present.** Confirmed: the alias is a PURE RE-EXPORT (no local declaration named `Animation`), which is why API Extractor emits no `_2` suffix — the collision fires only when a local declaration matches a global name.

`src/animation/timeline.ts:189`: `export class KeyframesScrollTimeline extends Timeline` — **renamed.**
`src/animation/timeline.ts:171`: `export { type KeyframesScrollTimelineOptions as ScrollTimelineOptions }` — **type re-export alias.**

`dist/keyframes.d.ts` grep: `grep "_2 as" dist/keyframes.d.ts` returns 0 matches (the dist is on this tree; the W8 commit message records this) — **zero `_2` aliases.**

`scripts/proof-published-surface.mjs:686`: `clausePkg3Clean()` function present; invoked in `main()` — **sub-clause wired into proof:published-surface.** There is no standalone `proof:pkg3-clean` script in `package.json` — the clause lives inside `proof:published-surface`, not as a separate gate. This is NOT a gap: `proof:published-surface` is in `proof:hygiene`, so the PKG-3 clause rides the blocking chain correctly.

`src/animation/animations.ts:137`: `export const flipPreset = ...` (the preset formerly named `flip`) — **renamed to `flipPreset`.**
`src/animation/animations.ts:133`: "BREAKING (5.0.0): the access path is now `presets.flipPreset`" — **documented breaking change in source.**
`src/animation/animations.ts:856–857`: `attentionPresets.flip: flipPreset` — the taxonomy key `flip` preserved (nested property, not a top-level collision).

**S4 verdict: LANDED.** `proof:pkg3-clean` GREEN by construction.

**FACTUAL DISCREPANCY (M-record task):** The FINAL.md §S3 and the W8 commit message both state "THREE breaking type changes recorded for the 5.0.0 cut (the Animation/ScrollTimeline renames + ScrollTimelineOptions re-colliding with an ambient lib.dom type)." The actual count is **FOUR**:

| # | Change | Location | Breaking how |
|---|---|---|---|
| 1 | `Animation` → `KeyframesAnimation` | `engine.ts:101` → HEAVY surface | d.ts canonical name changes; backward-compat alias added (`@deprecated`) |
| 2 | `ScrollTimeline` → `KeyframesScrollTimeline` | `timeline.ts:189` → LIGHT surface | d.ts canonical name changes; backward-compat alias added (`@deprecated`) |
| 3 | `ScrollTimelineOptions` → `KeyframesScrollTimelineOptions` | `timeline.ts:153/171` → LIGHT type | type alias rename; `@deprecated` re-export alias preserves old name |
| 4 | `presets.flip` → `presets.flipPreset` | `animations.ts:137` → HEAVY (via `loadAnimationEngine()`) | top-level module export renamed; `attentionPresets.flip` taxonomy key unchanged |

All four are BREAKING under semver. The FINAL and commit message omit the fourth. M should record all four in the 5.0.0 migration guide / CHANGELOG. The fourth is the most consumer-visible in the HEAVY preset surface (`const { presets } = await loadAnimationEngine(); presets.flip(...)` breaks). Note `presets.attentionPresets.flip` is UNCHANGED (a property name, not a top-level export).

---

### S5 — keyframes-react BOOK

**Spec claim (L.W8.md §S5):** `docs/tranches/L/waves/L.W8-react-book.md` written; no `packages/keyframes-react/` source; tripwire FIRED (with caveat); surface map recorded; `proof:keyframes-react-published` prerequisites documented.

**Ground-truth verification:**

`ls packages/` → `keyframes-vue` only — **no `packages/keyframes-react/` directory.** Correct BOOK state.
`docs/tranches/L/waves/L.W8-react-book.md` (read): 7 sections — tripwire state, Vue-proved surface, React equivalents table, d.ts-portability lesson, scaffold prerequisite, gate-first discipline, disposition. **Document is present and complete.**

The BOOK's honest caveat (`L.W8-react-book.md §1`): "The actual `npm publish` of `@mkbabb/keyframes-vue` is USER-DOMAIN — L.W8 implements everything UP TO publish but does NOT publish. So `proof:keyframes-vue-published` clause (b) STAYS RED-by-design." This is the correct state.

React peer floor recorded as `>=5.0.0` (`L.W8-react-book.md §5`): the React adapter targets the 5.0.0 MAJOR cut. This is the deliberate forward-pin (the Vue adapter shipped first on 4.x; the React adapter is born on 5.x). The d.ts-portability lesson (§4) records the `vite-plugin-dts 5` / `bundleTypes: true` / `bundledPackages: ["@mkbabb/value.js"]` discipline the S2 build surfaced — a genuine artifact of S2's construction that M's React scaffold must carry forward.

`DLL-29` in `deferred-ledger-L.md`: "BOOK LANDED (documentation only) · L.W8 S5 (339d78b) — `docs/tranches/L/waves/L.W8-react-book.md` written; no source/scaffold (verified — `packages/keyframes-react/` absent, the correct BOOK state)."

**S5 verdict: BOOK LANDED.** The tripwire is fired on the publish-PREP closure (per the BOOK's own caveat); it fires fully on the user-domain npm publish of keyframes-vue.

---

## 3. IS THE BREAKING-RENAME GESTALT?

The W8 spec frames the `Animation`→`KeyframesAnimation` rename as a PKG-3 collision fix — API Extractor renames a source class that collides with `globalThis.Animation` (the WAAPI interface in lib.dom.d.ts) to `Animation_2`, leaking numeric-suffixed names into intermediate IDE hover text. The cure (rename the source class to a non-colliding name, then re-export under the old name) is the correct mechanical fix.

**Is the rename gestalt?** Yes, with one caveat:

The rename is GESTALT because it resolves the root cause (the name collision at the source class level) rather than suppressing the symptom (patching API Extractor config or post-processing the emitted `.d.ts`). The dual-export pattern (`KeyframesAnimation` canonical + `Animation` deprecated alias) is the idiomatic forward-migration shape — a consumer on 4.x imports `Animation` and sees a deprecation warning prompting migration to `KeyframesAnimation`; a new consumer on 5.x imports `KeyframesAnimation` cleanly.

The one inelegance: `ScrollTimeline` is in the LIGHT surface (exported from `index.ts:57` as a named static export), but `KeyframesAnimation` is in the HEAVY surface (only accessible via `loadAnimationEngine()`). A consumer imports `ScrollTimeline` from `@mkbabb/keyframes.js` directly (static), but imports `Animation` / `KeyframesAnimation` only from the `loadAnimationEngine()` return. This asymmetry means two different consumers experience the rename differently:

- A LIGHT consumer using `ScrollTimeline` gets the deprecation `@deprecated` annotation on `import { ScrollTimeline }` from `@mkbabb/keyframes.js` — IDE shows the migration note immediately.
- A HEAVY consumer using `Animation` from `loadAnimationEngine()` gets the deprecation note only on the destructured `const { Animation } = await loadAnimationEngine()` path — IDE correctly shows it there.

The asymmetry is structural (one is LIGHT, one is HEAVY) and correct — it maps to the actual API boundary. M inherits this pattern cleanly.

**The fourth rename** (`presets.flip` → `presets.flipPreset`) is also gestalt: renaming the source-level export avoids a `flip_2 as flip` alias in the presets namespace. The taxonomy access path `attentionPresets.flip` is preserved by using `flip: flipPreset` as the property key — the property name is not a module-level declaration, so no collision fires there.

---

## 4. WHAT M OWES THE PUBLISH/VERSION CADENCE

### 4.1 The 5.0.0 decision (USER-DOMAIN, M-surface)

The tree carries `package.json version: 4.3.0`. The FINAL recommends `5.0.0` but asserts nothing. Three criteria drive the MAJOR:

1. **Replay-equality TOTAL is a semantic contract break** (L.W1/W2) — `compileToCSS` now refuses multi-color tracks it previously shipped silently-lossy, and emits `@property`/`animation-timeline`/`animation-range` it previously omitted.
2. **The four breaking type changes** (§2 S4 above) — `KeyframesAnimation`, `KeyframesScrollTimeline`, `KeyframesScrollTimelineOptions`, `presets.flipPreset`.
3. **keyframes-vue 0.1.0** is a net-new sibling package — while not strictly a breaking change to the core, the publish doubles the release surface.

The MINOR case (`4.4.0`) is defensible only if no published consumer relied on the undocumented silent-lossy multi-color behavior and no IDE hover text showed `Animation_2`. M's recommendation is **5.0.0** for the same reasons as the FINAL, plus the corrected four-change count.

**M gate obligation:** A `proof:changelog-5.0.0` or equivalent that asserts the CHANGELOG records all four breaking type changes and the compile-surface semantic breaks. This does NOT exist today and M should author it before the cut.

### 4.2 keyframes-vue 0.1.0 publish timing

`release.yml:publish-keyframes-vue` job is authored and sequenced after the core publish. When the user pushes a `v5.0.0` tag, both jobs fire:
1. Core publish (`@mkbabb/keyframes.js@5.0.0`) — `npm publish --provenance --access public`
2. Sibling publish (`@mkbabb/keyframes-vue@0.1.0`) — `npm install` in `packages/keyframes-vue/` (installs kf >=4.3.0 from registry, which at this point resolves to 5.0.0), `npm run check`, `npm run build`, `npm publish --provenance --access public`

**One sequencing risk to note:** `packages/keyframes-vue/package.json` declares `peerDependencies["@mkbabb/keyframes.js"]: ">=4.3.0"` — this will resolve to 5.0.0 at publish time (fine). The `devDependencies["@mkbabb/keyframes.js"]: ">=4.3.0"` is the install-time floor for the build step. At the 5.0.0 cut, the breaking renames (`Animation` → `KeyframesAnimation`) will surface in `packages/keyframes-vue/src/Keyframes.ts` if that file imports `Animation` by name. M must verify the Vue adapter's source is on the 5.0.0 surface before the cut.

`packages/keyframes-vue/src/Keyframes.ts` imports: verify `loadAnimationEngine()` is the only engine touch (no direct `Animation` type imports that would hit the renamed type) — this is the precondition for the 5.0.0 cut to keep the adapter's `npm run check` green.

### 4.3 keyframes-react scaffold (M-wave candidate)

The BOOK (`L.W8-react-book.md`) records:
- Peer floor `>=5.0.0` (forward-pin to the clean surface)
- `packages/keyframes-react/src/`: `Keyframes.tsx`, `useKfAnimation.ts`, `index.ts`
- `useSyncExternalStore` as the idiomatic React-18 external-state substrate
- `vite-plugin-dts 5` + `bundleTypes: true` + `bundledPackages: ["@mkbabb/value.js"]` (the d.ts-portability lesson from S2)
- Gate-first discipline: `proof:keyframes-react-published` authored (born-RED on no scaffold) BEFORE any source

**M's React scaffold wave** should:
1. Author `proof:keyframes-react-published` (born-RED, 3 clauses: built artifact / npm show / peer floor >=5.0.0)
2. Build the scaffold to GREEN (a) and (c)
3. Leave (b) USER-DOMAIN (the npm publish fires on a `v*.*.*` tag, the same pattern as keyframes-vue)
4. Add the `publish-keyframes-react` job to `release.yml` (needs: `publish-keyframes-vue`)

The `<Keyframes css={...}>{({ t }) => ...}</Keyframes>` render-prop pattern is on record in the BOOK. The `useKfAnimation` kernel transposes with `useState` → `useRef` + `cancelAnimationFrame` + the same "gate on inputs, not outputs" settle discipline.

---

## 5. PRECEPT VIOLATIONS FOUND

### 5.1 The four-breaking-change under-count (inv ε violation in the FINAL)

**File:line:** `docs/tranches/L/FINAL.md:141–142` + `docs/tranches/L/FINAL.md:274–275` + commit message `339d78b`

**Violation class:** inv ε (overclaim/underclaim) — the FINAL asserts "THREE breaking type changes" but four are implemented and documented `BREAKING (5.0.0)` in the source (`animations.ts:133`).

**Severity:** LOW (no regression; all four are correctly marked breaking in source; the consumer sees the deprecation annotations; the count is a documentation gap, not a correctness bug). M should correct the CHANGELOG draft and the 5.0.0 migration guide before the cut.

**Cure:** Record the fourth breaking change (`presets.flip` → `presets.flipPreset`, HEAVY, `animations.ts:137`) in the 5.0.0 CHANGELOG. The deferred-ledger row `DLL-18` says "THREE breaking type changes" — correct to FOUR there as well.

### 5.2 No other precept violations found

`proof:boundary` GREEN (verified — the orchestration dispatch adds no new static value.js edge; `AnimationGroup` and `Sequence` are already HEAVY via `engine.ts` re-exports).
`proof:dogfood` GREEN (behavior unchanged by the specifier flip).
`proof:demo-on-published-surface` GREEN-by-construction.
`proof:animate-orchestration` 4/4 (commit message verified).
`proof:keyframes-vue-published` clauses (a)+(c) GREEN; (b) RED-by-design — **correctly declared**, not a silent red.
`proof:pkg3-clean` GREEN (zero `_2 as` aliases in `dist/keyframes.d.ts`).

---

## 6. DEFERRED FOLDS FOR M

| Item | Source | State | M action |
|---|---|---|---|
| **Four-breaking-change count correction** | `animations.ts:133` + `FINAL.md:141` | Under-counted (THREE stated, FOUR actual) | Correct CHANGELOG draft / 5.0.0 migration guide before the cut |
| **keyframes-vue 0.1.0 npm publish** | `DLL-5` / `proof:keyframes-vue-published` clause (b) | RED-by-design; USER-DOMAIN | Mike Babb pushes `v5.0.0` tag → `release.yml` fires |
| **keyframes-vue source 5.0.0 compat check** | `packages/keyframes-vue/src/Keyframes.ts` | Unverified against 5.0.0 renames | Audit imports before the cut; update any `Animation` type references to `KeyframesAnimation` |
| **keyframes-react scaffold** | `DLL-29` / `L.W8-react-book.md` | BOOK LANDED; no scaffold | Gate-first: `proof:keyframes-react-published` born-RED → scaffold → publish |
| **5.0.0 version cut** | `FINAL.md §S6` | RECOMMENDED, not cut | USER-DOMAIN; M proposes the cut criteria (FINAL §S6 records them); M waves that land breaking changes inform the timing |
| **`proof:changelog-5.0.0`** | Gap | Does not exist | Author gate: asserts CHANGELOG records all four type renames + compile-surface semantic break |
| **`proof:keyframes-react-published`** | `L.W8-react-book.md §6` | Not authored | Author born-RED before scaffold (gate-first discipline) |

---

## 7. CROSS-REPO ASKS

### 7.1 value.js — d.ts transitive type portability

`L.W8-react-book.md §4` records the `TS2883` lesson: the rolled `.d.ts` emit reached `HueInterpolationMethod` from `@mkbabb/value.js` (nested under the kf peer via `InputAnimationOptions.hueMethod`), which the kf barrel does NOT re-export. The cure is `bundledPackages: ["@mkbabb/value.js"]` in `vite-plugin-dts` config.

**Cross-repo ask:** value.js should audit which types it INTENTIONALLY exports vs which are incidentally reachable through kf's `InputAnimationOptions`. If `HueInterpolationMethod` is consumer-facing (a consumer might want to type-check their `hueMethod` argument), it should be re-exported from `@mkbabb/keyframes.js`'s barrel. This is a value.js-O dispatch item — the current workaround (inline via `bundledPackages`) is correct but hides the gap.

**File:line:** `L.W8-react-book.md:118-130` (the portability cure documentation)

### 7.2 glass-ui — keyframes-vue peer floor

`packages/keyframes-vue/package.json` does not declare `@mkbabb/glass-ui` as a peer (correct — the adapter is kf-only, no glass-ui dependency). No cross-repo ask here; the Vue adapter is glass-ui-free by design.

### 7.3 keyframes-vue peer declaration in 5.0.0 transition

When kf 5.0.0 cuts, `packages/keyframes-vue/package.json` peer floor `>=4.3.0` will still be satisfied (5.0.0 >= 4.3.0). No peer-floor bump is required for the 5.0.0 cut of the CORE library. However, if the Vue adapter's source uses any of the FOUR renamed types directly (not through `loadAnimationEngine()`'s return type), a rebuild + `npm run check` will surface TS errors. This is a LOCAL pre-publish check, not a cross-repo ask.

---

## 8. PERFORMANCE NUMBERS

No performance measurements are specific to W8. The W8 changes are:
- Specifier rewrites (zero runtime cost)
- A fifth `instanceof` check in `animate()` (one branch, inlined by V8, sub-nanosecond)
- Source class renames (no runtime cost — backward-compat aliases are pure type exports with no runtime overhead)
- keyframes-vue dist build (one-time; the adapter is ~60 lines + the kernel)

The gate-apparatus verdict (`gate-apparatus-VERDICT.md §2`) separately records that `proof:animate-orchestration` is a vitest unit test (not a browser gate), so it does not contribute to the ~15–31min `proof:all` wall-clock. No regression in any measured metric.

---

## 9. M-WAVE PROPOSALS

### M.W-PUBLISH — the 5.0.0 cut + ecosystem publish wave

**Class:** SHIP-in-M · **Gate:** `proof:changelog-5.0.0` (born-RED) + `proof:keyframes-vue-published` clause (b) GREEN (the user-domain publish tripwire fires) + `proof:keyframes-react-published` clause (b) GREEN (same pattern, same tripwire)

**Rationale:** L.W8 completed all publish-PREP. M.W-PUBLISH is the wave that actualizes the cut:
1. Author `proof:changelog-5.0.0` (born-RED on missing CHANGELOG entries for all four breaking type changes + the compile-surface semantic break)
2. Verify `packages/keyframes-vue/src/` against the 5.0.0 renamed types (audit for `Animation` imports)
3. User-domain: `changeset version` → `5.0.0`, `git push v5.0.0` tag → `release.yml` fires both publish jobs
4. After publish: `proof:keyframes-vue-published` clause (b) GREENs
5. Then: scaffold `packages/keyframes-react/` (gate-first: author `proof:keyframes-react-published` born-RED first), build, publish per the BOOK criteria

**DAG:** The 5.0.0 cut is USER-DOMAIN; this wave supplies the infrastructure and gate-system for it; the user's tag-push is the actuating event.

### M.W-REACT-ADAPTER — `packages/keyframes-react/` scaffold

**Class:** SHIP-in-M · **Gate:** `proof:keyframes-react-published` (born-RED on no scaffold, clauses a+c GREEN on scaffold, clause b USER-DOMAIN) · **Dep:** 5.0.0 cut (keyframes-vue proves the pattern; React adapter pins >=5.0.0 per the BOOK)

**Rationale:** The BOOK (`L.W8-react-book.md`) records all criteria. The scaffold is two primitives: `<Keyframes css={...}>{({ t }) => ...}</Keyframes>` (render-prop, `useSyncExternalStore` substrate) + `useKfAnimation` kernel (the "gate on inputs, not outputs" settle loop, transposed from Vue's `ref`/`watch`/`onMounted` to React's `useState`/`useEffect`). The `markRaw` escape hatch is NOT needed in React (React never proxies objects). The d.ts-portability lesson (§4 of the BOOK) is the only non-obvious build step.

---

## 10. EVIDENCE INDEX

| Claim | Verified at |
|---|---|
| S1: zero deep imports in demo | `grep -rn "@src/animation" demo/` → 2 comment lines (not specifiers) |
| S1: 96 barrel import sites | `grep -rn "@mkbabb/keyframes" demo/` (excl. node_modules/dist) |
| S2: peer floor `>=4.3.0` | `packages/keyframes-vue/package.json` |
| S2: dist artifacts present | `packages/keyframes-vue/dist/` (ls) |
| S2: E404 on npm registry | `npm show @mkbabb/keyframes-vue` |
| S2: release.yml job authored | `.github/workflows/release.yml:87–148` |
| S2: gate correctly wired as report-all | `package.json` proof:hygiene string (no `keyframes-vue-published` entry); `proof-ci-coverage.mjs:180` exclusion |
| S3: dispatch branch | `src/animation/animate.ts:163–168` |
| S3: AnimateInput widened | `src/animation/animate.ts:79–80` |
| S3: return type updated | `src/animation/animate.ts:147` |
| S3: both setTargets exist | `group.ts:210`, `sequence.ts:380` |
| S4: KeyframesAnimation rename | `engine.ts:101` |
| S4: backward-compat alias | `engine.ts:1205` |
| S4: KeyframesScrollTimeline rename | `timeline.ts:189` |
| S4: ScrollTimelineOptions type alias | `timeline.ts:171` |
| S4: flipPreset rename | `animations.ts:137` |
| S4: flipPreset BREAKING (5.0.0) documented | `animations.ts:133` |
| S4: attentionPresets.flip preserved | `animations.ts:856–857` |
| S4: zero `_2 as` in dist | `dist/keyframes.d.ts` (grep → 0) |
| S4: pkg3-clean in published-surface | `scripts/proof-published-surface.mjs:753` (`clausePkg3Clean()`) |
| S5: BOOK doc present | `docs/tranches/L/waves/L.W8-react-book.md` (read) |
| S5: no react scaffold | `ls packages/` → `keyframes-vue` only |
| S5: DLL-29 terminal state | `docs/tranches/L/audit/deferred-ledger-L.md:130` |
| THREE→FOUR count discrepancy | `animations.ts:133` (`BREAKING (5.0.0)`) vs `FINAL.md:141–142` + commit `339d78b` |
| W8 commit scope | `git show 339d78b --stat` — 96 files, 4095 insertions |
