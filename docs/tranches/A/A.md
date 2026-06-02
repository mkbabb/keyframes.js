# Tranche A — keyframes.js enters the bbnf format (boundary ergonomics · CI repair · the engine's own modern-web baseline)

A is keyframes.js' **first** tranche. The engine has run on changesets since v2.0.0; every other constellation repo (glass-ui, bbnf-lang, fourier, speedtest, muster) runs the bbnf tranche format and keyframes is the lone hold-out. A does not replace the changeset — it reconciles the two so the tranche owns the binding question + waves + gates and the changeset stays the release mechanism. On that foundation A closes the three things the v2.2.0 KF-B1 boundary left open: the boundary's two ergonomic seams (the string-easing silent-linear footgun + the three hand-rolled `.ready()` copies), the release-CI break (the `file:../glass-ui` demo seam that `npm ci` cannot resolve on a clean runner), and the engine's own modern-web posture (it has never had a pass of its own — the constellation only ever treated it as the value.js gate).

A is in DEVELOPMENT now. W0-W1 formulate the tranche; W2-W5 are authored-now-run-later — the implementation phase opens only on explicit user authorization. The dev/impl boundary sits between W1 and W2.

## § Thesis

The v2.2.0 KF-B1 release carved the package along the value.js seam — light physics/interpolation engines stay static and value.js-free, the heavy CSS-parsing engine sits behind `loadAnimationEngine()`'s dynamic `import("./engine")`. The boundary is sound (dist confirms it: `keyframes.js` barrel 17.1 KB, `engine-*.js` 24.7 KB, `leaves-*.js` 1.0 KB). But the release shipped under three deferrals the changeset cadence could record but not resolve:

1. **The boundary's headline claim is asserted, not gated.** "A spring-only bundle contains no value.js code" lives in the CHANGELOG; nothing in CI proves a future light-module edit cannot reintroduce a static value.js edge. The binding-verification discipline the constellation flagged for keyframes consumers applies to the boundary itself.
2. **The lazy-easing path leaks a wrong-until-ready window.** A string easing *name* resolves lazily through the engine boundary; until it lands, `.at()` / `tick()` interpolate with a **linear fallback**. A stateless consumer who passes `"easeOutCubic"` and never `await .ready()` gets silently-wrong curves on the first frames — exactly the binding-verification class (vue-tsc passes, runtime quietly differs). And `.ready()` is hand-threaded three times across `numeric.ts`/`morph.ts`/`timeline.ts` with no shared contract and nothing surfacing that it exists or needs awaiting.
3. **The release was published locally because CI cannot build.** keyframes' `devDependencies` carries `"@mkbabb/glass-ui": "file:../glass-ui"` for the demo; the release workflow's `build` arm (`vite build --mode production`) and the gh-pages arm both run on a runner where that `file:` path does not resolve. The library build (`src/animation` → `dist/`) does not need glass-ui at all — only the demo does — so a runner cannot tell the two apart and the publish leg is forced local.

These three compose: they are the **complete** set of things the KF-B1 boundary opened and the changeset format could not close on its own. Folding keyframes into the tranche format is the act that lets them close with hard gates — and the same move earns keyframes its own modern-web identity (reduced-motion on the heavy path, `scheduler.yield()` in the group compositor, the `linear()`-widened WAAPI evaluation) that the value.js-gate framing never gave it.

## § Goal criterion

A succeeds when keyframes.js runs the bbnf tranche format with the v2.2.0 boundary hardened and the engine carrying its own modern-web baseline:

- **The format is reconciled, not duplicated.** `docs/tranches/A/` stands up; the changeset↔tranche contract is codified (the tranche owns the binding question + waves + gates; the changeset is the publish artefact; `FINAL.md` records the tranche close, `CHANGELOG.md` records the release — no duplication). The CI-break issue is filed (the audit's phantom "#177" replaced with a real artefact). `src/animation/CLAUDE.md` re-syncs to the boundary topology (it documents pre-KF-B1 geography: `index.ts` holding the heavy classes, `../parsing`/`../units`/`../easing`/`../math` paths that the value.js extraction retired).
- **CI builds the library with zero glass-ui resolution.** The library-only build splits from the demo build; a clean-runner `npm ci && npm run build:lib && npm test` is green with no `file:../glass-ui` resolution. The `file:` seam is demo-dev-only. The release dry-run reaches `npm publish --dry-run` on a runner.
- **The boundary's ergonomics close the silent-linear window.** The string-easing path no longer interpolates silently-linear before resolution: a `.at()` with a pending name BEFORE `.ready()` is detectable (eager-resolve-on-construct-when-name, or a dev-time signal) — the wrong-until-ready window is documented and not silent. The three hand-rolled `.ready()` copies collapse into one `EasingResolvable` contract (one memoized resolver, one `.ready()`, one documented "callable = sync, name = await" rule), with still **zero** static value.js edge on the light bundle.
- **The boundary is gated.** A `proof:boundary` gate builds a spring-only entry and asserts 0 value.js bytes + 0 static `engine-*` edge in the resulting chunk, and it **bites**: a negative test (reintroduce a value.js import into a light module) fails the gate.
- **The engine carries a modern-web baseline.** `prefers-reduced-motion` extends to the heavy `Animation` play path + `morph`/`timeline` (it is partial today — `numeric`/`smooth`/`spring` honor it via `respectReducedMotion`, the flagship engine does not); `scheduler.yield()` (Baseline-detected, ≤20 LOC fallback) breaks the `AnimationGroup` compositor's per-frame long task for large groups; the `linear()`-widened WAAPI eligibility for spring curves is evaluated against the existing `springLinearStops`/`springTimingFunction` primitives and either landed or refuted-in-the-record; the README gains a Baseline / tree-shaking / reduced-motion section.

## § Completion criterion

The development half (W0-W1) completes when the W0 audit-confirmation + this A.md + the W0-W5 wave specs + PROGRESS are authored and the W1 design slice verifies: the `EasingResolvable` contract shape is named (mixin vs base-class vs free function, with the value.js-free constraint proven against the three call sites); the silent-linear remediation is chosen (eager-resolve vs dev-warn) with its trade-off recorded; the `build:lib` split is specified against the live `vite.config.ts` (which mode, which entry, which `external`); the `proof:boundary` mechanism is named (the spring-only entry + the byte/edge assertion); the WAAPI `linear()` eligibility is investigated to a land-or-refute verdict.

The implementation half (W2-W5) completes when every wave's hard gate verifies: a clean-runner `build:lib` green with no `file:` resolution; the silent-linear window closed + the three `.ready()` copies retired with the light bundle still value.js-free; `proof:boundary` green AND its negative test red; reduced-motion snapping on the heavy path under the media query; the group loop breaking >50ms tasks under a Playwright trace; the README posture section; and the close ceremony's π (build-verification floor — the engine is library-not-visual) + ι + overfitting audit + `A/FINAL.md` + the changeset cut.

## § Inherited invariants

keyframes.js carries no prior tranche, so A inherits the constellation-shared precepts (the `docs/precepts` submodule, gitlink `63240e6`) rather than a sibling-letter ledger:

- **Substrate-without-consumer is binary** (the overfitting audit — every new artefact has ≥2 consumers OR a demo OR is not shipped). Gates A.W2's `EasingResolvable` (3 consumers — `numeric`/`morph`/`timeline` — clears trivially; it is de-duplication, a net deletion of two hand-rolled copies) and refuses any speculative surface (a `Worker`/`OffscreenCanvas` `NumericAnimation` stays unshipped — note-only, no consumer).
- **No backwards-compat aliases, no legacy code** (the constellation no-legacy precept). Gates A.W2: the `.ready()` unification RELOCATES the shared logic, it does not keep the three copies "for safety"; the silent-linear remediation changes behaviour at the construct/`.at()` boundary cleanly rather than adding a compatibility flag.
- **Baseline browser policy** — Widely → native; Newly → feature-detected fallback ≤20 LOC; Limited → progressive-only-with-current-path-default. Gates A.W4: `scheduler.yield()` is Baseline-Newly (feature-detect + ≤20 LOC `setTimeout`/`postTask` fallback); `prefers-reduced-motion` is Widely (native `matchMedia`, SSR-safe no-op); `linear()` is Baseline-Newly (feature-detect, rAF-spring current-path default).
- **Fail-explicit on library-internal contract violations** — library-owned subsystems throw on failure; browser-API degradation paths stay befitting-silent with rationale. Gates A.W2: a value.js-internal resolution failure is library-owned (throws), while the reduced-motion / scheduler / WAAPI degradation paths are browser-API and stay silent-with-rationale.

A introduces:

- **A inv α — the boundary is gated, not asserted.** The KF-B1 light/heavy split is proven by a CI gate (`proof:boundary`) that builds the real light entry and counts value.js bytes + static `engine-*` edges, not by a CHANGELOG sentence. A claim about the static graph that no gate measures is not an invariant. Lands A.W3; binds every future light-module edit.
- **A inv β — the library build is glass-ui-free.** The publishable artefact (`src/animation` → `dist/`) resolves zero `@mkbabb/glass-ui`. The `file:../glass-ui` seam is demo-dev-only and never on the release path. Lands A.W1; gates every future CI/release run.

## § Resolved design decisions

1. **The format reconciliation — tranche owns intent, changeset owns release.** RESOLVED: the tranche owns the binding question + waves + hard gates; the changeset stays the release mechanism (the `Version Packages` PR → tag → `release.yml`). A wave that ships a version writes its changeset at close; `CHANGELOG.md` is the changeset-rendered release record. `FINAL.md` records the *tranche* close (gates met, overfitting audit, deferrals) and does NOT duplicate the CHANGELOG. This is codified as the W0 DOC_UPDATE deliverable.
2. **The headline.** RESOLVED: **the boundary hardening (W2 ergonomics + W3 gate)** is the headline — it closes the two seams the v2.2.0 release shipped open and makes the boundary's central claim gated. The CI repair (W1) is the unblock that makes tag-release work; the modern-web pass (W4) is the engine's own identity. The headline is the boundary the release already shipped, made true.
3. **The silent-linear remediation — eager-resolve, dev-warn the residual.** RESOLVED to the W1 design slice: the primary fix is **eager-resolve-on-construct when easing is a string name** (the resolution kicks off in the constructor as `Timeline` already does — `numeric`/`morph` adopt the same), so `.ready()` is the rare opt-in for "I need it on the very first synchronous `.at()`". The residual synchronous-`.at()`-before-resolution window is closed by a **dev-only signal** (a `console.warn` is acceptable here because it is a browser-timing degradation hint, not a library-internal contract violation — the contract violation path throws). W1 confirms eager-resolve does not reintroduce a static value.js edge (the `import("./engine")` stays dynamic; only its *trigger* moves earlier).
4. **CI repair — split `build:lib` from the demo build (the glass-ui Q.W6 pattern).** RESOLVED: add a `build:lib` script that runs only the `production`-mode library build (entry `src/animation/index.ts`, `external` already excludes glass-ui — glass-ui is never imported by `src/`, only by `demo/`). CI's `build` step becomes `build:lib`; the demo/gh-pages build stays a separate arm that the release path does not require. This mirrors glass-ui's Q.W6 "split the gh-pages demo outDir from the library dist" — keyframes' `vite.config.ts` already routes gh-pages to `dist/gh-pages/`, so the outDir split exists; the missing piece is the *script* split so a runner builds the library without touching the demo graph.
5. **`proof:boundary` — a build-and-count gate, wired into CI.** RESOLVED: build a spring-only entry (`import { SpringProgress } from "@mkbabb/keyframes.js"`), then assert against the emitted chunk: 0 occurrences of value.js module-specifier bytes AND 0 static import edge to `engine-*`. Wire into `ci.yml` as a `proof:boundary` step. The gate must bite — a negative-test fixture that imports a value.js symbol into a light module turns the gate red (proven once at W3, then reverted).
6. **No promotion, no speculative substrate.** RESOLVED: A invents no public primitive beyond `EasingResolvable` (which is internal de-duplication, 3 consumers). The WAAPI `linear()` widening is land-or-refute — it ships only if it widens real eligibility for a real consumer (the demo's spring curves); a `Worker`/`OffscreenCanvas` path stays note-only (substrate-without-consumer).

## § Wave table

| Wave | Title | Phase | Agents | Closes-on (evidence) |
|---|---|---|---|---|
| **A.W0** | Format reconciliation + hygiene | DEV (now) | 1 | This A.md + the W0-W5 wave specs + PROGRESS; the changeset↔tranche contract codified; the CI-break issue filed; `src/animation/CLAUDE.md` re-sync diff matches `engine.ts`/`leaves.ts` geography; the precepts gitlink confirmed `63240e6`. |
| **A.W1** | Design slice + release-CI repair | DEV → IMPL hinge | 1-2 | Design doc `design/W1-boundary-and-ci.md` (the `EasingResolvable` contract shape proven value.js-free across the 3 call sites; the eager-resolve + dev-warn remediation with its trade-off; the `build:lib` split spec'd against `vite.config.ts`; the `proof:boundary` mechanism named; the WAAPI `linear()` land-or-refute verdict). The CI repair lands in W1 because it is the unblock and is mechanically isolated (a script + workflow edit, no engine code). Hard gate: clean-runner `npm ci && npm run build:lib && npm test` green with no `file:` resolution. **END OF DEV BOUNDARY at the design-doc close; the `build:lib` IMPL rides W1 as the hinge.** |
| **A.W2** | Boundary ergonomics | IMPL | 1 | `EasingResolvable` contract retires the 3 hand-rolled `.ready()` copies; the silent-linear window closed (eager-resolve on name + dev-warn the residual sync-`.at()`); a focused test proves `.at()` with a name pre-resolution is detectable; **still zero static value.js edge** on the light bundle. |
| **A.W3** | `proof:boundary` gate | IMPL | 1 | `proof:boundary` builds the spring-only entry, asserts 0 value.js bytes + 0 static `engine-*` edge, wired into `ci.yml`; the negative test (value.js import into a light module) turns it red, then reverts. |
| **A.W4** | Engine modern-web/perf pass | IMPL | 1-2 | `prefers-reduced-motion` on the heavy `Animation` play path + `morph`/`timeline` (focused test snaps to final frame under the media query); `scheduler.yield()` (Baseline-detected, ≤20 LOC fallback) in `AnimationGroup` (a Playwright `bench/playwright.bench.ts` trace shows the group loop breaking >50ms tasks); WAAPI `linear()` widening landed-or-refuted; README Baseline/tree-shaking/reduced-motion section. Overfitting audit: every new artefact ≥2 consumers or a demo. |
| **A.W5** | Close ceremony + release | IMPL (LAST) | 1 | π (build-verification floor) + ι sweep + overfitting + `A/FINAL.md` + the changeset cut (the publish leg is user-domain). |

**Wave count: 6 (A.W0-A.W5)** — 2 DEVELOPMENT (W0 reconciliation + W1 design) + 4 IMPLEMENTATION; the `build:lib` CI repair rides W1 as the dev→impl hinge because it is the unblock and is engine-code-free. Dev/impl boundary at the W1 design-doc close.

DAG — W0 first; W1 after W0; W2 (ergonomics, `src/animation/*.ts`) and W3 (`proof:boundary`, `scripts/` + `ci.yml`) are file-disjoint and parallelize after W1, but W3's gate is most honest run AFTER W2's relocation lands, so sequence W2 → W3; W4 (engine + README) is disjoint from the boundary work and parallelizes with W2/W3; W5 closes.

## § Modern-web spine mapping

The canonical 6-wave modern-web spine (W1 perf/INP · W2 CWV/content-visibility · W3 forms/a11y · W4 CSS-platform · W5 motion/VT · W6 security/PWA) maps onto a **library animation engine** only where a consumer-backed lever exists. The applicable levers are folded into A.W4 (the engine's own pass); the inapplicable ones are refuted-in-the-record:

| Spine wave | Lever | Disposition in A |
|---|---|---|
| **perf/INP** | `scheduler.yield()` in the `AnimationGroup` compositor loop | **FOLDED → A.W4.** The group composites N children per frame with no long-task break; a large group is a main-thread long task. Real consumers drive keyframes directly (canvas/WebGL — speedtest, fourier), so the INP lever belongs here, not in glass-ui. |
| **motion/VT** | `prefers-reduced-motion` on the heavy path; `linear()`-widened WAAPI for spring curves | **FOLDED → A.W4.** Reduced-motion is partial (light engines opt-in; the heavy `Animation`/`morph`/`timeline` have no opt-in) — the flagship engine is the gap. `linear()` widening is land-or-refute against the existing spring primitives. |
| **CSS-platform** | — | **REFUTED.** keyframes is a JS engine; it owns no stylesheet. Its CSS surface is the parsed-input grammar (`@keyframes`), not platform utilities. No CSS-platform lever. |
| **CWV/content-visibility** | — | **REFUTED.** `content-visibility` is a consumer-DOM concern; the engine renders no document. The consumer SPAs (words, bbnf-playground) own this — it is in their tranches, not keyframes'. |
| **forms/a11y** | — | **REFUTED.** keyframes mounts no form, no interactive control, no ARIA surface. a11y for keyframes reduces to reduced-motion, which is folded under motion/VT above; there is no forms surface. |
| **security/PWA** | — | **REFUTED.** keyframes ships no server, no service-worker, no document — it is a published npm library. Its supply-chain posture (the value.js boundary, `sideEffects:false`, the publish provenance) is the closest analogue and is covered by A.W1 (CI publish provenance) + A.W3 (`proof:boundary`), not a PWA wave. |

The applicable spine collapses to the **perf/INP + motion/VT** pair, both folded into A.W4. The other four waves have no consumer-backed lever for a headless animation engine and are refuted here rather than invented.

## § Folded ledger

Every deferred + chronically-deferred item from the A5 audit (`glass-ui/docs/constellation/next/audit/A5-keyframes-words-bbnf.md`) is assigned a wave or a named-forward:

| Audit finding | A wave |
|---|---|
| §0.2 — CI break: `file:../glass-ui` demo seam unresolvable on a clean runner | A.W1 (the `build:lib` split) |
| §0.2 — the unfiled "#177" CI issue (phantom number) | A.W0 (file the real issue) |
| §0.3 — string-easing silent-linear-fallback footgun | A.W2 (eager-resolve + dev-warn) |
| §0.3 — three hand-rolled `.ready()` copies (no shared contract) | A.W2 (`EasingResolvable`) |
| §1 — `prefers-reduced-motion` absent on the heavy/morph/timeline path | A.W4 |
| §1 — `scheduler.yield()` / INP absent in `AnimationGroup.tick()` | A.W4 |
| §1 — `linear()`-widened WAAPI eligibility for spring curves (half-present) | A.W4 (land-or-refute) |
| §1 — tree-shaking proof asserted not gated (`proof:boundary` missing) | A.W3 |
| §1 — README modern-web posture (Baseline/reduced-motion/tree-shaking) absent | A.W4 |
| §1.1 — `src/animation/CLAUDE.md` stale to pre-KF-B1 topology | A.W0 |
| §2.1 — changeset↔tranche reconciliation (the format question) | A.W0 |
| §0.1 — precepts submodule checkout advance to `63240e6` | A.W0 (CONFIRMED already at `63240e6` — gitlink + checkout both canonical; no action) |
| §1 — `Worker`/`OffscreenCanvas`/`Atomics` engine path | NAMED-FORWARD (substrate-without-consumer; note-only, no ship) |

The precepts submodule line in §0.1 framed keyframes as drifted behind (`f27627e`); the live state at A-open is checkout = gitlink = `63240e6`. W0 records the confirmation; there is no submodule action for keyframes (the words uncommitted-pointer debt in §0.1 is words-domain, not keyframes').

## § Cross-repo posture

A is **keyframes.js-internal**. keyframes resolves `@mkbabb/value.js` via the registry (`^0.10.0`); the only cross-repo seam is the `file:../glass-ui` demo-dev dependency, and A.W1's entire point is to take it OFF the library build + release path. No coordination artefact is required: A writes only keyframes' own surface, and the value.js boundary it hardens is a static-graph property of keyframes' own dist, not a value.js change. The publish leg (the changeset → tag → `release.yml` → `npm publish`) is user-domain (outward-facing, confirm-first); A.W1 makes that leg runnable on a clean runner for the first time, but does not run it.

## § Dev/impl boundary

W0 + the W1 design doc are DEVELOPMENT (reconciliation + design; write NO engine source). W2-W5 are IMPLEMENTATION — authored now as binding wave specs, they RUN only on explicit user authorization. The `build:lib` CI repair rides W1 as the dev→impl hinge: it is the unblock and is engine-code-free (a `package.json` script + a `ci.yml`/`release.yml` edit), so it lands with W1 rather than waiting on the IMPL gate. The boundary lands at the W1 design-doc close.

## § Critical files

```
DEVELOPMENT artefacts (W0-W1 — written, no engine source):
  docs/tranches/A/A.md                      (this plan)
  docs/tranches/A/PROGRESS.md               (execution log)
  docs/tranches/A/waves/W{0..5}.md          (wave specs)
  docs/tranches/A/design/W1-boundary-and-ci.md  (A.W1 design slice)
  docs/tranches/A/FINAL.md                  (A.W5)

IMPLEMENTATION targets (W1-W4 — authored-now-run-later):
  Owns (modify):
    package.json (scripts: + build:lib)            (A.W1 — the library-only build split; inv β)
    .github/workflows/ci.yml + release.yml         (A.W1 — build → build:lib; A.W3 — + proof:boundary)
    src/animation/numeric.ts + morph.ts + timeline.ts  (A.W2 — EasingResolvable + eager-resolve; no value.js edge)
    src/animation/engine.ts                        (A.W4 — prefers-reduced-motion on the heavy Animation play path)
    src/animation/group.ts                         (A.W4 — scheduler.yield() in the compositor; ≤20 LOC fallback)
    src/animation/waapi.ts                         (A.W4 — linear()-widened WAAPI eligibility [land-or-refute])
    src/animation/CLAUDE.md                        (A.W0 — re-sync to the boundary topology)
    README.md                                      (A.W4 — Baseline/tree-shaking/reduced-motion section)
    .changeset/                                    (A.W5 — the release artefact)
  Owns (create):
    src/animation/internal/easing-resolvable.ts    (A.W2 — the one shared resolver, 3 consumers)
    scripts/proof-boundary.mjs                     (A.W3 — build-and-count the spring-only entry)
  The v2.2.0 light/heavy boundary (0 static value.js edge on the light bundle) + the 261-test suite
  are the regression bar; proof:boundary makes the boundary a CI gate (inv α).
```

## § Style discipline

Greenfield voice — keyframes.js is the product. No migration language in prose, no "ported from", no version-history narration beyond the CHANGELOG (which is the release record, not the tranche record). Em dashes unspaced. No grandiloquence, no editorializing. Every wave item carries WHAT + WHY; goal + completion criteria paired. A DERIVES the shared `.ready()` contract from the three copies (a net deletion), relocates rather than aliases, and adds no compatibility shim. A is keyframes earning the format it has been the lone hold-out from — and using that format to make the v2.2.0 boundary gated, the CI runnable, and the engine modern-web-current.
