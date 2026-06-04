# Tranche B — keyframes.js: the demo made true · the engine's debt transposed · CI that cannot ship a blank app

B is keyframes.js' second tranche. A made the v2.2.0 boundary gated, the release CI runnable, and gave the engine a modern-web baseline — and shipped 3.0.0. B turns the lens on the two surfaces A's library-first framing left under-audited: the **demo** (the engine's shop-window, which an exhaustive lighthouse + Playwright + 6-agent design audit found is shipping a blank production build and four blank scenes) and the **engine's own architectural debt** (16 uncounted in-code TODOs, a fail-explicit invariant declared-but-not-honored, three near-duplicated reduced-motion snap paths, a boundary gate that proves only one of seven light entry points). B is the forcing function for every chronically-deferred item, and it codifies the constellation's first **before/after-every-page** capture edict — authored here, in precepts, as the standing instrument against the "a fix on page X broke page Y" class.

B is in DEVELOPMENT now. The audits (W0) are RUN — the evidence is on disk under `audit/`. W1-W7 are authored-now-run-later wave specs; the implementation phase opens only on explicit user authorization. No engine or demo source is written in development.

## § Thesis

A was scoped library-first: it hardened the value.js boundary, repaired the release CI, and gave the engine a reduced-motion / `scheduler.yield()` / WAAPI-spring baseline. That scope was correct for A's headline, but it left three classes unmeasured, which B's audits surface with hard evidence:

1. **The demo is broken in production and incomplete on every non-cube page.** The `vite build --mode gh-pages` output is a 698-byte preload shim with no app entry and no CSS — vite-8/rolldown tree-shook the inline `<script type="module">` bootstrap out of `demo/app/index.html`, so the deployed demo paints nothing. Four of six scenes (amiga, square, easing, spring) render an empty viewport at idle in every viewport. The cube clips off the right edge on desktop (the stage spans grid cols 2-4, off-center) and the start-screen hero prints directly over the cube on mobile. None of this is caught by CI — `ci.yml` gates only the library.
2. **The engine carries debt A's ledger never counted.** 16 in-source TODOs (1 CRITICAL, 4 HIGH) sit outside A's deferred-ledger entirely; the `AnimationGroup.reset()` `interpFrames(0,true)` fillBackwards is a self-described workaround (TODO(HIGH)) that B's group reduced-motion fix had to route *around* rather than *through*; the reduced-motion snap is implemented three separate ways (`RAFPlayback`, `Animation._playReducedMotion`, `AnimationGroup._playReducedMotion`) where one contract would do; the fail-explicit invariant A declared ("a value.js-internal resolution failure throws") is not honored — a typo'd easing name degrades to identity silently and permanently, and the eager-resolve `import("./engine")` has no `.catch`, so a chunk-load failure is an unhandled rejection.
3. **The boundary gate and the release artefact are narrower than their prose.** `proof:boundary` builds only the `SpringProgress` entry — five of seven light modules are unproven, so a static value.js edge in `smooth`/`numeric`/`morph`/`timeline` that `SpringProgress` does not transitively reach passes the gate. The committed lockfile is glass-ui-*present* (recorded optional), contradicting FINAL.md's "regenerated glass-ui-absent" — inv β survives only because `optional:true` lets `npm ci` skip the dangling sibling link, not because the graph is absent.

These compose into B's mandate: make the demo *true* (it paints, it fits, it loads fast), transpose the engine's debt with gestalt fixes rather than patches (NO workarounds, NO legacy), and widen the gates so neither a blank app nor an unproven boundary edge can ship again. The same move earns the constellation its before/after-capture edict.

## § Goal criterion

B succeeds when the demo is production-true and occlusion-free, the engine's architectural debt is transposed (not patched), and CI gates the demo as hard as the library:

- **The demo paints in production.** The gh-pages build emits a real app entry + CSS; a CI demo-build smoke gate asserts the entry is non-trivial and the app mounts. The loading splash is removed and first paint is instant via critical-CSS / instant-paint, not a content-swap flash. Heavy chunks (monaco, three) lazy-load. Real lighthouse perf is measured on the fixed prod build (the dev-mode FCP/LCP of 4-24s are not authoritative).
- **No occlusion or overlap on any page in any viewport.** All six scenes render their subject centered and within bounds at 375 / 1280 / 1440; the cube never clips; the hero never overlays the target; the top dock clears the safe-area on mobile; the four blank scenes render their subject at idle. The scripted Playwright occlusion gate (zero element overflowing the viewport, zero dock-over-content overlap) is green on every page × viewport.
- **The engine's debt is transposed, gestalt.** The group reset/fill contract is defined explicitly (the TODO(HIGH) workaround retired, not relocated); the three reduced-motion snap paths collapse to one contract; the fail-explicit invariant is honored (unresolvable easing name throws or surfaces, never silent-permanent identity); the eager-resolve import is failure-handled; the 16 in-code TODOs are each SHIP/KILL/BOOK'd. No new workaround, no legacy, no alias.
- **The gates are widened.** `proof:boundary` proves every light entry point (not just `SpringProgress`); the lockfile/inv-β prose is reconciled to the shipped artefact (regenerate glass-ui-absent, or correct the claim); the before/after π gate is wired and runs at full visual binding (tooling is now available); a11y (`landmark-one-main`, `image-alt`) and SEO (75-82) regressions close.
- **The format carries the edict.** The before/after-every-page capture edict is committed to precepts SPEC.md (authored at B.W0), the constellation gitlink synced, and B itself runs the protocol (BEFORE captured at open, AFTER + DELTA at close).
- **Dependencies are current.** The dep-upgrade matrix is resolved — the library deps are already latest; the demo/tooling majors (zod 3→4, vue-sonner 1→2, @iconify/vue 4→5, jsdom 26→29, vite-plugin-dts 4→5, @types/node 24→25) and minors land behind a regression gate.

## § Completion criterion

The development half (W0) completes when the audit evidence is on disk (it is: `audit/` holds the dep matrix, 18 BEFORE screenshots, the occlusion report, the lighthouse reports, the 46 plan-audit + 43 design-audit findings, this B.md, PROGRESS, and the W1-W7 wave specs), the before/after edict is committed to precepts (it is, at `8ccf9f4`, push pending), the deferred + chronically-deferred ledger is complete (every A named-forward + the 16 in-code TODOs classified), and the full prompt recap confirms every P1+P2 request is addressed or wave-assigned.

The implementation half (W1-W7) completes when every wave's hard gate verifies: the prod build paints under a CI smoke gate; the occlusion gate is green on every page × viewport; the engine transpositions land with the test suite green and `proof:boundary` widened-and-green; the loading splash gone with a measured prod-perf improvement; the design system adopts the glass-ui φ-ladder + single display serif; a11y/SEO regressions closed; the AFTER capture + DELTA.md show no unintended regression; FINAL.md + the changeset cut.

## § Inherited invariants

B inherits A's two invariants and the constellation precepts (the `docs/precepts` submodule, now advancing to `8ccf9f4` for the before/after edict B authors):

- **inv α — the boundary is gated, not asserted** (A). B *widens* it: `proof:boundary` must prove every light entry point, not only `SpringProgress` (the audit found 5 of 7 light modules unproven). The gate stays the regression bar; B closes its coverage hole.
- **inv β — the library build is glass-ui-free** (A). B *reconciles* it: the committed lockfile is glass-ui-present (optional); B either regenerates it genuinely glass-ui-absent or corrects the FINAL.md prose, and verifies with a /tmp clean-runner archive run at the π floor.
- **Substrate-without-consumer is binary; no-legacy/no-alias; fail-explicit on library-internal contracts; Baseline browser policy** (constellation). B enforces the fail-explicit precept A declared-but-missed (the silent-identity easing degradation), and runs the new before/after edict.

B introduces:

- **B inv γ — the demo cannot ship blank.** A CI demo-build smoke gate asserts the gh-pages build emits a real app entry that mounts and paints; a blank/tree-shaken build fails CI. Lands B.W6; gates every future demo build.
- **B inv δ — no page occludes on any viewport.** The scripted Playwright occlusion gate (zero viewport overflow, zero dock-over-content overlap, every scene subject visible at idle) is green on all pages × {375, 1280, 1440}. Lands B.W3; runs at every close via the before/after harness.

## § Resolved design decisions

1. **The dep update is plan-as-wave, not executed now (locked).** B.W1 records the upgrade matrix (`audit/dep-upgrade-matrix.txt`) and authors the bump behind a regression gate. The library's own deps (`@mkbabb/value.js`, `@mkbabb/parse-that`) are already latest — the work is demo + tooling. Majors (zod 3→4 is the headline risk via `@vee-validate/zod`; vue-sonner 1→2; @iconify/vue 4→5; jsdom 26→29; vite-plugin-dts 4→5; @types/node 24→25) each get a breaking-change read.
2. **The headline is the demo made true.** The blank prod build + four blank scenes + the occlusion set are the most user-visible defects A's library-first scope skipped. The engine transpositions (W2) and the gate-widening (W6) are the depth behind the headline.
3. **Gestalt over patch — the reduced-motion contract.** RESOLVED to the W2 design: the three snap implementations collapse to one `ReducedMotionSnap` contract the heavy `Animation`, `AnimationGroup`, and the light `RAFPlayback` all consume, AND the `AnimationGroup.reset()` fillBackwards workaround is replaced by an explicit reset/fill contract (the TODO(HIGH) retired). This is the no-workaround transposition the user mandated, not the `_playReducedMotion`-avoids-reset() patch A shipped.
4. **The prod build fix is root-caused.** RESOLVED: the inline `<script type="module">` bootstrap in `demo/app/index.html:38-46` is tree-shaken by rolldown; the fix is to extract it to a real `demo/app/main.ts` referenced via `<script src>`. B.W4's first step.
5. **The before/after edict is authored, not invented per-tranche.** RESOLVED: committed to precepts SPEC.md's π-lane (`8ccf9f4`) so every constellation tranche inherits it; the capture harness is checked into `audit/` and re-runs identically at open/close.
6. **Glass-ui-owned fixes route outward.** The dock double-click bug (masked in the demo by `always-expanded` on mobile) is glass-ui-owned — a cross-repo adoption ask, never patched in the demo (per the standing rule). The φ-ladder type utilities already ship in glass-ui 3.1.1; B adopts them rather than re-authoring.

## § Wave table

| Wave | Title | Phase | Closes-on (evidence) |
|---|---|---|---|
| **B.W0** | Audit + precept edict + before/after harness | DEV (now) | This B.md + W1-W7 specs + PROGRESS; the precept before/after edict committed (`8ccf9f4`, push pending); the BEFORE harness + 18 screenshots + occlusion report + lighthouse + dep matrix on disk; the deferred ledger complete (16 TODOs + A named-forwards classified); the full prompt recap. |
| **B.W1** | Dependency upgrade (matrix → gated bump) | IMPL | Demo/tooling deps to latest behind a regression gate; majors (zod/vue-sonner/@iconify/jsdom/vite-plugin-dts/@types-node) each breaking-read; library deps confirmed already-latest; `check:lib`/`build:lib`/`test`/`proof:boundary` + the new demo smoke gate green. |
| **B.W2** | Engine debt transposed (gestalt) | IMPL | One `ReducedMotionSnap` contract replaces the 3 snap paths; the group reset/fill contract retires the TODO(HIGH) workaround; fail-explicit honored (unresolvable easing throws/surfaces); eager-resolve import failure-handled; the 16 in-code TODOs each SHIP/KILL/BOOK'd; `proof:boundary` widened to all light entries. Tests green; no new workaround/legacy/alias. |
| **B.W3** | Demo correctness + occlusion-free | IMPL | The 4 blank scenes render their subject at idle; the cube never clips (desktop stage centered full-viewport when controls closed); hero never overlays the target; top dock clears mobile safe-area. The scripted Playwright occlusion gate (inv δ) green on every page × {375,1280,1440}. |
| **B.W4** | Loading perf (prod build + splash + lazy) | IMPL | gh-pages build emits a real entry+CSS (extract inline bootstrap → `main.ts`); the loading splash removed + instant-paint critical CSS; monaco/three lazy; real lighthouse prod-perf measured + improved; demo smoke gate (inv γ) green. |
| **B.W5** | Design system (φ-ladder + serif + a11y/SEO) | IMPL | Demo adopts glass-ui's `text-display-*`/`--type-*` φ-ladder, retires raw Tailwind rungs; one display serif; ad-hoc CSS → glass-ui tokens; a11y (`landmark-one-main`, `image-alt`) + SEO closed; dock double-click → glass-ui adoption ask (outward). |
| **B.W6** | Perfected CI (inv γ + δ + boundary + lockfile) | IMPL | Demo-build smoke gate (inv γ); occlusion gate wired (inv δ); `proof:boundary` all-entries; lockfile reconciled glass-ui-absent (or prose corrected) + /tmp clean-runner verify; before/after π gate wired; node-20 actions bumped to v5; dep regression gate. |
| **B.W7** | Close ceremony (π full + DELTA + release) | IMPL (LAST) | AFTER capture + per-page DELTA.md (the new edict, full visual binding — tooling now available); π visual-runtime at full not floor; ι + overfitting + `FINAL.md` + the changeset; FINAL reconciles the A fidelity defects (stale W4.md, lockfile prose, off-by-one). |

**Wave count: 8 (B.W0-B.W7)** — 1 DEVELOPMENT (W0, run now) + 7 IMPLEMENTATION (authored-now-run-later).

DAG — W0 first (done). W1 (deps) is the modern baseline the rest builds on. W2 (engine, `src/animation/*`) and W3/W4/W5 (demo, `demo/*`) are file-disjoint and parallelize after W1; W4's prod-build fix is prerequisite to authoritative perf, so W4 before the W7 perf re-measure. W6 (CI/gates) rides after W2's boundary-widen + W3's occlusion gate + W4's smoke gate exist. W7 closes.

## § Deferred + chronically-deferred fold (zero perpetual punts)

Every A named-forward + every uncounted in-code TODO + every audit BOOK gets a B wave, trigger, and owner. (Full per-item table: `audit/plan-findings.txt` + `audit/design-findings.txt`.)

| Item | Source | B disposition |
|---|---|---|
| **CHRONIC: LoAF observer** | A.W4 named-forward (grand-audit §2.4) | SHIP B.W4 — now has a consumer (the prod-perf measurement + the demo bench). |
| **CHRONIC: Playwright >50ms-trace gate** (a pure stub predating A) | A.W4 HARD-gate downgraded | SHIP B.W3/B.W7 — the occlusion+π harness backs it for real; the stub is replaced. |
| **CHRONIC: ScrollTimeline native** | grand-audit §3, `timeline.ts:196` | BOOK B.W2 — feature-detect native `animation-timeline` beside the JS fallback. |
| **CHRONIC: VAL-9 `--spring-*` token regen** | grand-audit §4.2 | BOOK B.W5 outward — glass-ui regenerates tokens from keyframes' `springLinearStops()` mint. |
| 16 in-code TODOs (1 CRIT/4 HIGH/9 MED/2 LOW) — incl. `group.ts` reset/fill TODO(HIGH), `constants.ts:148` blend-mode TODO(MED) | NEVER in A's ledger | SHIP — each classified in B.W2; the group one is the W2 headline transposition. |
| Demo-polish BOOKs (hero φ-ladder, dual-serif, scene-swap VT) — **phantom owner** | grand-audit §3 | SHIP B.W5 — B *is* the demo-polish home A's BOOK pointed at but never created. |
| Worker/OffscreenCanvas/Atomics engine path | A §Folded-ledger | KILL/named-forward — still no consumer; note-only (unchanged). |
| `dev.sh`/`deploy.sh` library-shape adoption | adoption fold §1 | BOOK B.W6 — `do_build`→`build:lib`, demo deploy is dev-machine. |
| Dock double-click bug | design audit, project memory | BOOK B.W5 outward — glass-ui-owned, never patched in demo. |
| Fail-explicit gap (silent-identity easing) | precept-adherence audit | SHIP B.W2 (honor the invariant A declared). |
| inv α coverage hole (only SpringProgress proven) | boundary audit | SHIP B.W2/B.W6 (widen the gate). |
| glass-ui-present lockfile vs "absent" prose | plan-fidelity audit | SHIP B.W6 (reconcile). |
| Stale W4.md (pre-fix group behavior), off-by-one test claim | plan-fidelity audit | SHIP B.W7 (FINAL reconciles A's record). |

## § Prompt recap — every request addressed (P1 + P2)

**P1 (tranche A)** — fully ADDRESSED, verified on disk: execute A in full ✓ (W0-W5 landed); 3.0.0 re-release ✓ (`npm view` → 3.0.0, `v3.0.0` tag); exported RAFPlayback PRM gate ✓ (`index.ts:48` + the gate); changesets/--provenance ✓ (`release.yml` `npm publish --provenance` + `id-token:write`, SLSA attestation verified); publish 3.0.0 first ✓; gate on green CI ✓ (library-scoped chain on push + before publish).

**P2 (this engagement)** — a DEVELOPMENT engagement; deliverables are B's waves:
- update all deps to latest → **B.W1** (matrix captured; plan-as-wave per locked decision) ✓ recorded.
- 6-agent deep audit of plan + changes → **DONE** (`audit/plan-findings.txt`, 46 findings).
- devise a path forward / recap prompts+plans+precepts / gestalt / no-workaround / no-legacy / architectural transpositions → **this B.md** + B.W2.
- delineate chronically-deferred + deferred, fold into B → **§ fold above**.
- recap ALL prompts → **this section**.
- NOT an implementation phase / tranche development only → **honored** (W0 is audit + planning; no engine/demo source written).
- full e2e lighthouse + best-practices of every page + library facet → **DONE** (`audit/lighthouse/`, dev-mode; prod-perf pends the W4 build fix); fixes in B.W4/B.W5.
- pull latest precepts + sync constellation + before/after-screenshot edict → **B.W0 DONE** (synced to `main`; edict committed `8ccf9f4`, push pending).
- remove the loading screen + dramatically improve loading times → **B.W4**.
- 6 frontend-design agents audit design + glass-ui → **DONE** (`audit/design-findings.txt`, 43 findings); fixes in B.W3/B.W5.
- create the next tranche with perfected CI → **this tranche** + B.W6.
- audit every page desktop + mobile, NO occlusion/overlap, dock perfected, fully Playwright validation → **DONE** (occlusion report + 18 screenshots × 3 viewports); the occlusion-free gate is **B.W3 (inv δ)**.

No request is dropped. The single highest drop-risk item the audit flagged — the committed before/after edict — is authored and committed (push pending your go-ahead).

## § Critical files

```
DEVELOPMENT artefacts (W0 — written now):
  docs/tranches/B/B.md                          (this plan)
  docs/tranches/B/PROGRESS.md                   (status board)
  docs/tranches/B/waves/W{0..7}.md              (wave specs)
  docs/tranches/B/audit/
    dep-upgrade-matrix.txt                       (current vs latest)
    plan-findings.txt  design-findings.txt       (46 + 43 audit findings)
    occlusion-report.json  lighthouse/           (Playwright + lighthouse evidence)
    screenshots/before/<page>-<viewport>.png     (18 BEFORE captures)
  docs/precepts/instructions/tranche/SPEC.md     (the before/after edict — committed 8ccf9f4)

IMPLEMENTATION targets (W1-W7 — authored-now-run-later):
  package.json + package-lock.json               (B.W1 deps; B.W6 lockfile reconcile)
  src/animation/group.ts                         (B.W2 reset/fill contract + reduced-motion)
  src/animation/{playback,engine}.ts             (B.W2 one ReducedMotionSnap contract)
  src/animation/internal/easing-resolvable.ts    (B.W2 fail-explicit + import catch)
  scripts/proof-boundary.mjs                     (B.W2/W6 all-light-entries)
  demo/app/index.html → demo/app/main.ts         (B.W4 extract bootstrap; remove splash)
  demo/app/App.vue + scenes/*                    (B.W3 blank scenes + cube clip + hero overlay)
  demo/@/components/custom/dock/TopDock.vue       (B.W3 mobile safe-area)
  demo/@/styles/*.css + EditorStartScreen.vue     (B.W5 φ-ladder + serif + a11y)
  .github/workflows/ci.yml + release.yml          (B.W6 demo smoke + occlusion + boundary gates)
```

## § Style discipline

Greenfield voice — keyframes.js is the product. No migration narration beyond the CHANGELOG. Em dashes unspaced. Every wave item carries WHAT + WHY; goal + completion paired. B transposes debt rather than patching it (the user's gestalt mandate), folds every deferred item with a real owner (no phantom destinations), and gates the demo so it cannot ship blank. B is keyframes making its shop-window true and repaying the debt A's library-first scope deferred.
