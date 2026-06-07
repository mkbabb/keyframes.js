# Tranche G — PROGRESS

Status board for keyframes.js' seventh tranche. The plan is `G.md` (the canonical
charter); the close report is `FINAL.md` (authored at G.WZ). Audit evidence is under
`audit/` — 16 phase-1 lanes + the `a-demo-playwright` Playwright assay + 5 `_SYNTHESIS-`
docs. The wave specs are authored under `waves/` at implementation-open. The
LOAD-BEARING blueprint is `audit/_SYNTHESIS-gap-scorecard.md` (the THESIS + the §1 gap
map + the §2 band→wave map + the §3 disposition roll-up) — read it first.

G's single duty, inherited from F's honest close: **land the dep RE-PIN spine and the
narrow finishing sweep the post-F deep audit surfaced — and prove G net-new by what it
leaves untouched.** The post-F stack is dominated by ALREADY-SOTA on every axis
(`audit/_SYNTHESIS-gap-scorecard.md §THESIS`, binding): the engine kernel + steppers +
WAAPI eligibility, the FrameCompiler split, the value.js boundary, the color science,
the single-grammar parse + the parse-that leaf tier, the frontend-state Mandate-hardest
rules, the inv-κ brittleness surface, the modern-web §4 surface, and the CI deploy spine
are exemplary and re-touched by NO wave. **Both largest source files are at their
cohesive gestalt** (`engine.ts` 1313L, `group.ts` 752L — F.md NEW-3 ruling re-verified
post-growth). **G manufactures NO work where D+E+F lead — this is binding.**

**G's content is NET-NEW, stated honestly.** D was the terminal home for every
keyframes-owned deferral (P-invariant-28, held through F). The deferred ledger G inherits
is CLEAN — **zero KFE** (`audit/_SYNTHESIS-deferred-ledger.md`; no chronic debt folds
into a G wave). **G is a NARROW finishing tranche with ONE spine and a long
ALREADY-SOTA refusal.** The spine is the dep RE-PIN: kf `4.0.0` ships consuming **stale
siblings** (`value.js ^0.10.0`, `parse-that ^0.8.2`, `glass-ui file:../glass-ui` LINK)
while the published `0.11.0` / `0.9.0` / `3.3.0` carry the F hand-off wins kf DROVE — the
−94% computed-endpoint memo, the 3.96× color-channel plan, the 2.41× parse dispatch, the
C5 *correctness* fix (24 no-op length units), the parse-that soundness hardening. **The
whole F.W6 architecture was load-bearing on "kf consumes it on re-pin"; the re-pin never
happened.** This is not a chore — it is a *shipped-product-correctness* fix and the
unlock for most of the value.js charter, achievable with ZERO kf source edit through the
single `lerpValue → iv._lerp` seam (`engine.ts:731`). Eight audit lanes converge on this
ONE SHIP. Around the spine: thin re-audit lanes confirming ~90–95% SOTA, the post-F
W10/W12-scene idiom-drift finishing sweep (styling + lifecycle + brittleness, same
scenes), the Playwright demo SHIPs, two gated DECISIONS (the engine line-ceiling, the
back-compat-flag framing), two narrow net-new engine SHIPs (DrawSVG, `.finished`), the
CI drift-closure, and the cross-repo HAND-OFFs.

**The SUPPLEMENTAL perf / testing / engine assay (8 lanes the user requested ON TOP)
WIDENS G MODESTLY — ~4–5 new waves — but the spine STILL LEADS and the dominant yield
is a deeper refusal** (`audit/_SYNTHESIS-perf-testing-engine.md §THESIS/§3`, binding).
It adds Band T (testing-robustness: **G.W15** the interpolate-anything + color-fidelity
corpus, **G.W16** the computed-resolution + parse/round-trip corpora — jsdom + real-DOM
split, supersedes the un-runnable G.W2 S4 `50dvh`-on-rAF clause), Band G (group
correctness: **G.W17** the dead `add`/`weighted` blend leaf — the ONE real net-new bug),
Band O (scroll/orbital: **G.W18** the orbital `rotate3d` output collapse — net-negative
lines), and Band M (deep-modularity: **G.W19** the `adoptCompiled()` engine seam). It
SHARPENS the spine without opening new SHIP there: G.W2 is now also a V8-perf-correctness
fix (HP-1 — the published TypedArray substrate is dark only because kf pins `^0.10.0`)
with a compile-latency map (CF-1 — `parse()` is 87–91% of `fromString`, value.js-bound)
and a compile-% gate clause; the booked SoA MEASURE-FIRST gains the V8 dispatch mechanism
(HP-2, 3.06–3.47× at K=6–10), the cross-engine portability argument (X-1), and the
bit-packing KILL (HP-4/X-3/CF-3). **But the LARGEST supplemental contribution is a deeper,
more-grounded ALREADY-SOTA refusal** — the V8 object-model kernel, the cross-engine SoA
portability + universal dict-mode avoidance, the O(N) compiler + four-form pre-flatten,
the DI/pipeline/dynamism/hygiene posture (confirming godmodules by an orthogonal route),
the modern-CSS interpolation kernel matrix (MCI-6), the scroll arch + gimbal-free orbital
accumulation, and the group BUFFER machinery (the defect is purely the blend LEAF, NOT
the architecture) all manufacture ~nothing.

## Phase

**IMPLEMENTED + CLOSED** on branch `tranche-g-impl` (cut `4.1.0` minor — the re-pin +
DrawSVG/`.finished`/`adoptCompiled` additive API). `proof:all` GREEN (35 gates · 637
tests + 1 expected-fail), tsc + `check:lib` clean, the demo builds. **Every wave
G.W1..G.WZ landed** (the per-wave status rows below carry the as-authored spec text;
the authoritative LANDED close, the convergence record, and the honest deltas are
`FINAL.md`). The re-pin consumed the published `value.js 0.11.1` (the
`development`-export fix kf drove + republished provenanced), `parse-that 0.9.0`,
`glass-ui 3.3.0`. The re-publish leg is USER-DOMAIN, confirm-first; version owner Mike
Babb.

**Status notes for the rows below (as-authored spec, now landed):** the G.W18 row
projects "DELETE `quaternionToEulerDegrees` (33 lines) / net-negative lines" — the
LANDED O-1a outcome KEEPS the function (it drives the Euler v-model) and EXTRACTS it
(plus the reverse `eulerDegreesToQuaternion`) to a colocated `quaternionEuler.ts`; the
*render leg* collapsed to one native `rotate3d`, and the two-way v-model render path is
preserved (the convergence pass added the external-Euler→quaternion re-seed). See
`FINAL.md` for the reconciled record.

**The development genesis (historical).** G was authored in TRANCHE DEVELOPMENT on
`tranche-g-dev` — the deep audit (G.W0) on disk under `audit/` (16 phase-1 lanes +
`a-demo-playwright` + 5 `_SYNTHESIS-` docs + the 8 supplemental lanes), the charter
`G.md`, this board, the wave specs under `waves/`, and the cross-repo hand-off charter.
Implementation opened on explicit authorization, gated on keyframes' own green CI
(inv-27), exactly D.W0's / E.W0's / F.W0's dev/impl boundary.

**The MANDATE is BINDING + sweep-enforced** (`G.md § Mandate`, verbatim-in-substance):
NO quick solutions / NO workarounds (the re-pin is the REAL fix through the unchanged
`lerpValue` seam, not an escape-hatch beside it; the line-ceiling is a gated DECISION,
NOT a reflexive split; the `serializeEasing` fix THROWS, it does not silently emit
`"linear"`), architectural transpositions for elegance·simplicity·performance, NO legacy
(the `parseLinearStops` shim RETIRES on the E1/E2 value.js land — not patched in place;
no silent/graceful handling unless befitting), NO god-modules (decompose >500L ONLY where
genuinely cohesive — `engine.ts`/`group.ts` are at gestalt per F.md NEW-3; the
line-ceiling is a gated DECISION), KISS · DRY · no nested imports · no test-in-src,
styling ISOMORPHIC unless highly befitting (named deltas), MEASURE-FIRST (every perf
claim behind a biting bench or recorded-withheld WITH the number). **inv-16 RELAXED for
G impl** (the user drives value.js / parse-that / glass-ui too) but each sibling is its
own surface → cross-repo items are HAND-OFF-tagged. **inv ε:** every claim cites a
phase-1 lane or a live `file:line`. **The § ALREADY-SOTA record is BINDING — manufacture
NO work where D+E+F lead.**

**Planned DAG (run-later):** **Band 0** G.W1 (re-pin SAFETY verification — the
measure-first lock; leads, gates the spine); → **Band 1** G.W2 (THE RE-PIN — lands
FIRST after verification; unblocks the honest value.js/parse-that re-measure) → G.W3 (the
C1 container-resize fold, the one kf-side fold the bare re-pin does NOT cover); ∥
**Band 2** G.W4 (backend fail-explicit close, indep) ∥ G.W5 (the line-ceiling GATED
DECISION, indep); ∥ **Band 3** G.W6 (CI workflow-hygiene gate, indep); ∥ **Band 4**
G.W7 ∥ G.W8 ∥ G.W9 (frontend encapsulation / state / brittleness — independent of the
engine bands; G.W9 is the one real HIGH NEW defect); ∥ **Band 5** G.W10 ∥ G.W11 ∥ G.W12
(styling idiom sweep ∥ demo Playwright SHIPs ∥ the dock affordance — G.W12's kf-demo half
pairs the glass-ui HAND-OFF); ∥ **Band 6** G.W13 (DrawSVG + `.finished`, engine-side
additive) ∥ G.W14 (the modern-web checklist completeness, byte-cheap). **SUPPLEMENTAL
bands (run-later, on top):** **Band T** G.W15 ∥ G.W16 (testing-robustness — both DEPEND
on G.W2: the re-pin changes the boundary the corpora protect; G.W16 supersedes the
un-runnable G.W2 S4 `50dvh`-on-rAF clause) ∥ **Band G** G.W17 (the dead-blend correctness
fix — indep of the spine, SEQUENCE before any FB-1 rAF-composition) ∥ **Band O** G.W18
(the orbital `rotate3d` collapse — indep, demo-side, net-negative) ∥ **Band M** G.W19
(the `adoptCompiled()` seam — indep, additive engine method). **Band V** G.WV is
orthogonal (the user drives the sibling repos under relaxed inv-16; kf consumes through
the unchanged seams; the supplemental CF-6 F3-LRU re-grounding + MCI-2 color sentinels
fold here). **Band Z** G.WZ closes (the D FINAL + the G FINAL + the re-publish leg).
**Critical path:** `G.W1 → G.W2 → G.W3` (the re-pin spine gates the honest re-measure of
every value.js row; G.W15/G.W16 ride the same spine).

## Wave status

| Wave | Title | Phase | Status | Hard gate (falsifiable instrument) |
|---|---|---|---|---|
| **G.W0** | Deep audit confirmation (this board + the synthesis) | DEV | **DONE** | The 16-lane + Playwright + 5-synthesis assay is on disk under `audit/` + re-runnable (each lane cites a grep/wc/bench instrument that re-executes from the repo); `_SYNTHESIS-gap-scorecard.md` (load-bearing), this board, and the four sibling synthesis docs are present; the deferred ledger confirms **zero KFE** (P-invariant-28 held through F); every G.W1..G.WZ finding carries its own falsifiable hard gate. |
| **G.W1** | Re-pin SAFETY verification (the measure-first lock) | IMPL (Band 0) | **authored — awaits auth** | `proof:repin-safe` (a NEW pre-stage gate, NOT chained into `proof:all`): `proof:boundary` GREEN + a symbol-survival check — all 29 kf-consumed value.js names survive `0.11.0` (`a-valuejs-leverage §0`); `0.9.0`'s only break — the `.memoize()` removal — has ZERO kf/value.js call-sites, `any` still exported (`a-parsethat-leverage G-PT-1`). Pre-stages the Band-1 re-pin; ships NO source. |
| **G.W2** | THE RE-PIN (the headline SHIP — 8 lanes converge) | IMPL (Band 1) | **authored — awaits auth (DEPENDS on G.W1)** | `proof:deps-current` / `proof:vj-pin-current` (new) — installed ≥ published floor; NO `file:`/`link:`/`git:` protocol in any `@mkbabb/*`; bites TODAY (`package.json:84-85,88` = `value.js ^0.10.0` / `parse-that ^0.8.2` / `glass-ui file:../glass-ui`). Re-pin `^0.11.0`/`^0.9.0`/`^3.3.0`; full suite + `proof:all` GREEN with NO kf edit (any required edit = a finding against the consume-unchanged charter). Plus the C1 computed-frame resolve-count witness (`interp-buffer.bench` computed-unit variant) + the supplemental CF-1 compile-% clause (`compile.bench` `parse()` ≥ 85% of `fromString` at N≥50). **The C5 `50dvh` non-identity correctness test is NOT a G.W2 clause** — it is structurally un-runnable on the jsdom rAF path, so it is SUPERSEDED + MOVED to `G.W16` (the value.js injection-seam unit test + the Playwright `proof:computed-real-dom` real-DOM corpus, the only genuine path). Folds `GS-0/RP-1/2/3`, `F-BL-1`, `G-CONST-1/2`, `GG-1`, `F-VJ-1`, `G-1`, `G-PT-1`. |
| **G.W3** | The C1 container-resize staleness fold | IMPL (Band 1) | **authored — awaits auth (DEPENDS on G.W2)** | A resize-without-window-resize test asserting the ball tracks the new `100cqw`. The re-pin INTRODUCES C1 staleness for `cqw` animations under a non-window resize (bites `AnimationVisualizer`); wire `bumpLayoutEpoch()` on the container `ResizeObserver` (demo) + document the container-unit contract (NO library-generic auto-observer without a biting bench — the boundary-breach concern that kept F.W6's wrapper out of kf). Folds `a-valuejs-leverage F-VJ-2`. |
| **G.W4** | Backend fail-explicit close | IMPL (Band 2) | **authored — awaits auth (∥ engine bands)** | `proof:roundtrip-easing` negative control — `serializeEasing` THROWS on a custom-closure easing (no CSS twin = fail-explicit, NOT silent `"linear"`); the genuine-`linear` registry still serializes `linear`. Bites TODAY: `format.ts:22-29` silently emits `"linear"` for a custom closure (curve lost). Folds `a-backend-legacy F-BL-2` (SHIP) + the `F-BL-6` back-compat→conservative-default re-word (RECORD). |
| **G.W5** | The library line-ceiling GATED DECISION | IMPL (Band 2) | **authored — awaits auth (∥ engine bands)** | The extended gate IS the lock: `proof:decomposition` extended to `src/animation/**` with a per-file ceiling + a RECORDED gated exception for `engine.ts` carrying the F.md NEW-3 cohesion ruling — OR a re-baseline of the class guard with the F.W7/W8 rationale. DECIDE, do NOT re-defer (P-invariant). Bites TODAY: `engine.ts` 1313L (`wc -l`, +130 since F-open), un-ceilinged by the demo-only `proof:decomposition`. Do NOT reflexively split. Folds `a-deferred-ledger C-6` + `a-backend-godmodules G-GM-1`. |
| **G.W6** | CI workflow-hygiene gate (ONE gate, four findings) | IMPL (Band 3) | **authored — awaits auth (indep)** | One extended `proof-ci-coverage.mjs` clause — version-literal-consistency + clone-DRY + concurrency-present. Closes: the stale `^0.10.0` comment, the byte-duplicated glass-ui clone block (→ a `setup-glass-ui` composite action), the stale glass-ui pin `v3.2.0`→`v3.3.0` (gated by demo-smoke green), the missing `concurrency:` on ci/release. (Node-24 delta = a naming comment, `§5` RECORD.) Folds `a-ci-streamline §1/§2/§3/§4`. |
| **G.W7** | Vue idiom convergence | IMPL (Band 4) | **authored — awaits auth (indep)** | `proof:demo-template-refs` (new) — zero bound `ref<…>(null)` template refs, only `useTemplateRef`; plus a pure-module-named-`use*` detector. Bites TODAY: two template-ref idioms side-by-side (`useTemplateRef` ×28 vs legacy `ref<…>(null)` ×7, 3 files mix BOTH); the `useToastGuard` pure-predicate misname; the `*Types.ts`/`timingCurveUtils` mislocation under `composables/`. Folds `a-frontend-encapsulation §1` (MED) + `§2/§3` (LOW). |
| **G.W8** | Frontend-state store-idiom close | IMPL (Band 4) | **authored — awaits auth (indep)** | `proof:asset-store-singleton` (new) — `useAssetManager()===useAssetManager()` ref identity; plus a `proof:no-dead-export`. Bites TODAY: `useAssetManager` is the lone stateful store outside `createGlobalState`, double-instantiated → 2 refs over 1 key (correctness on a vueuse internal); the dead `stateVersion` counter. Wrap in `createGlobalState`, symmetrize `resetAllStores`. Folds `a-frontend-state §1` (MED) + `§2` (LOW). |
| **G.W9** | The rAF-leak lifecycle correction (HIGH — the one real NEW defect) | IMPL (Band 4) | **authored — awaits auth (indep)** | `proof:brittleness` clause-4 lifecycle sub-clause (new) — zero `onActivated`/`onDeactivated` while no `<KeepAlive>` in the tree (KeepAlive-grep stale-guarded). Bites TODAY: 4 scene loop-owners wire rAF cleanup to dead `onDeactivated` (no `<KeepAlive>` host) → Easing/Spring **leak the rAF preview loop perpetually on every play-then-swap**. Re-home cleanup on `onScopeDispose`/`onBeforeUnmount` (mirroring `useRafLoop.ts:56`); delete the dead hooks + the `App.vue:197` fossil comment; `coastPlayback` unmount stop. Folds `a-frontend-brittleness §1` (HIGH) + `§2` (LOW). |
| **G.W10** | The W10/W12-scene idiom finishing sweep | IMPL (Band 5) | **authored — awaits auth (indep)** | The `proof:idioms` clause-shape D.W2 uses — each idiom defined ONCE, zero scene re-fork. Bites TODAY (post-F scenes re-fork idioms D.W2 + F§1 already retired — SAME drift class, SAME surfaces): `.settled-badge`/`.tracking-badge` dup, `.code-token` dup, `.mp-traveller` hand-rolls `.progress-ball`, the `400px` coupled magic number, the mask-fade token shadow, the `h-[fit-content]`→`h-fit` nit. Promote `.status-badge`/`.code-token` to `design-idioms.css`; `.mp-traveller` consumes `.progress-ball`; token `--controls-pane-width` + `--mask-fade`. Folds `a-styling §1–§6`. |
| **G.W11** | The demo usability SHIPs (the Playwright SHIP set) | IMPL (Band 5) | **authored — awaits auth (indep)** | A `demo-smoke` route-reachability assertion + an `AnimatedText` inter-word-gap > 0 assertion + a unique-aria-label assertion. Bites TODAY: **X-6** the Discrete scene is unreachable (no `starting-style` route — verified `router.ts:25` catch-all redirects home; a whole registered scene is dead); **X-5** the hero LCP renders "Selectananimation" (inter-word `inline-block` gap = 0px, `AnimatedText.vue`); **X-3** duplicate "Play animation" aria-label (transport vs menubar, every editor scene). Folds `a-demo-playwright X-5/X-6/X-3`. |
| **G.W12** | The dock affordance (glass-ui-HANDOFF + kf-demo D.W5 close) | IMPL (Band 5) | **authored — awaits auth (pairs the glass-ui HAND-OFF)** | The existing `occlusion-gate.mjs` HARD assertion re-run mask-free (must stay green WITHOUT the crutch) + a `proof:decomposition` barrel-absent clause. The #1 usability gap is the dock; the kf-demo half (D.W5, unblocked by 3.3.0): rename `TopDock→ChromeDock`, delete the `dock/index.ts` pass-through barrel, REMOVE the `:always-expanded` occlusion mask, collapse the dead single-layer group, realign the drifted vitest VT stub. The mobile-occlusion residual = glass-ui-HANDOFF (fix in the dock root, never re-mask in the demo). Folds `a-demo-playwright X-1` + `a-glass-ui GG-5` + `GG-2`. |
| **G.W13** | The two narrow net-new engine SHIPs | IMPL (Band 6) | **authored — awaits auth (engine-side, additive)** | `proof:drawsvg` (new — `dasharray===getTotalLength`, dashoffset sweep, WAAPI-eligibility lock) + `proof:finished` (new — resolves once at end; pre-resolved when settled). F closed the frontier; two cheap additive gaps remain: **DrawSVG** (`fromDrawSVG`, one `getTotalLength()`, mirrors `motion-path.ts`, WAAPI-eligible, zero value.js dep) + **`get finished()`** over the held play promise. Folds `r-animation-sota G26-2` + `G26-5`. |
| **G.W14** | The modern-web checklist completeness fix (byte-cheap) | IMPL (Band 6) | **authored — awaits auth (indep)** | The existing `proof:modern-web` (extend `CHECKLIST`; deletion re-falsifies the coverage claim). Add 3 post-F catalog rows (`sibling-index()` N-A, Custom Highlight API N-A, `<dialog closedby>` OUT) to the `proof:modern-web §S6` CHECKLIST. Zero demo pixels move; all 18 existing rows HOLD. Folds `r-modern-web MW-CHK-1`. |
| **G.W15** | The interpolate-anything + color-fidelity corpus (SUPPLEMENTAL, Band T) | IMPL (Band T) | **authored — awaits auth (DEPENDS on G.W2)** | `proof:interpolate-anything` (each corpus row asserts its exact midpoint) + `proof:color-fidelity` (known-coordinate equality per space + a value.js color-parity gate mirroring `leaves-parity.test.ts`) + `proof:fn-arity-pad` + `proof:cqw-resolution`. The suite is depth-SOTA but ~6 value types wide — no multi-arg transform/filter/gradient/box-shadow/custom-prop midpoint assertion (TR-1), color tested for inequality not fidelity (TR-2). **BITE:** drop a transform channel / swap the colorSpace default → the row reds; `proof:fn-arity-pad` is the RIDING-RED witness locked as a `test.fails` expected-fail (GREEN today against the live `ValueUnit(0)` pad — `brightness`→0 at t=0 — so it never reds `proof:all`; it FLIPS RED the instant value.js's MCI-5 identity-aware pad lands and `brightness` holds `1`, forcing the wrapper's removal — the consume-leg signal). Test-only, ZERO source. Records TR-5 (the SoA correctness twin — `proof:interp-soa` requires `proof:interpolate-anything` green). Folds `a-testing-robustness TR-1/TR-2` + `a-modern-css-interp MCI-1/MCI-5`. |
| **G.W16** | The computed-resolution + parse/round-trip corpora (jsdom + real-DOM split) | IMPL (Band T) | **authored — awaits auth (DEPENDS on G.W2; SUPERSEDES G.W2 S4)** | `proof:computed-real-dom` (S2, Playwright — the ONLY place the C5 `50dvh` fix is provable on the genuine path; jsdom resolves `50vh`→`"50vh"`, no `matrix()` form) + the S1 value.js injection-seam unit test (`50dvh@768→384`) + `proof:roundtrip-fidelity` (parse→format→reparse→`interpFrames(0.5)` byte-same midpoint). **SUPERSEDES the un-runnable G.W2 S4 `50dvh`-on-rAF clause** (no gate that passes vacuously); natural sibling of G.W3's `proof:resize-tracks`. **BITE:** revert the resolver to drop the unit / a serializer that drops a transform channel → the live page freezes / the round-trip midpoint diverges. Test-only, ZERO source. Folds `a-testing-robustness TR-3/TR-4`. |
| **G.W17** | The dead `add`/`weighted` blend leaf correction (HIGH — the ONE real net-new bug) | IMPL (Band G) | **authored — awaits auth (indep; SEQUENCE before any FB-1 rAF-composition)** | `proof:blend` — a 2-child value-assertion: `add` of two `opacity 0→1` mid-frame → exactly `1.0`; `weighted` weight=0.5 → exactly `0.25`; a multi-component leaf row (GL-2); the GL-6 add-clamp contract. Bites TODAY: `add` + `weighted` are DEAD CODE (collapse to `replace`) — the leaf is a `ValueUnit[]` (`frame-compiler.ts:364`) but the `isNumericUnit` guard tests a bare `ValueUnit` (`group.ts:18-19`); proven `add`→0.5 (want 1.0), `weighted`→0.5 (want 0.25); UI-exposed, zero value-level test coverage. The fix is a CONTAINED element-wise loop (`min(existing.length, incoming.length)`), zero new machinery, in-place mutation preserved (zero-alloc intact). RE-TAGS FB-1 (the "accumulation substrate ready" premise FALSIFIED — GL-4). Folds `a-group-layering GL-1/GL-2` (+ GL-4/GL-6 BOOK/RECORD). |
| **G.W18** | The orbital `rotate3d` output collapse (simplicity + correctness, net-negative) | IMPL (Band O) | **authored — awaits auth (indep)** | `proof:orbital-rotate3d` — `containerStyle.transform` contains `rotate3d(` and NOT `rotateX/Y/Z`; a gimbal-pole parity test (drive the quaternion near a pole, assert the rendered `rotate3d` matches `getAxisAngle` within epsilon — reds against the Euler path, greens against `rotate3d`). The orbital OUTPUT gratuitously round-trips quaternion→Euler→re-apply (`OrbitalDrag.vue:58,74-106`, an `asin`-based gimbal branch for a problem it CREATED); the engine ALREADY interpolates axis-angle `rotate3d` (`useCubeAnimations.ts:95-96`). Collapse the CSS render to `rotate3d`, DELETE `quaternionToEulerDegrees` (33 lines); keep the Euler v-model for the slider/share (O-1a). Net-negative lines, zero new dep. RECORDS S-1 (stale "Chromium-only" rationale); BOOKS S-2 (`view()` named ranges). Folds `a-scroll-orbital-quaternions O-1`. |
| **G.W19** | The `adoptCompiled()` engine seam (MED — close the cross-boundary reach-in) | IMPL (Band M) | **authored — awaits auth (indep)** | `proof:adopt-compiled` — `a.adoptCompiled(b)` yields `a.compiler === b.compiler` AND `a.options === a.compiler.options` (the `6e29236` live-options reference re-bound) AND `a.flatKeys` reflects `b`'s compiled key-set (`_stableKeys` recomputed). Bites TODAY: the demo transplants three public-but-internal fields `animation.options/.compiler/.unflatten =` (`useKeyframeOps.ts:107-109`) — the ONLY cross-boundary reach-in in `demo/` — carrying the live-options invariant in a COMMENT, not the seam. The fix: a ~10-line additive `Animation.adoptCompiled(source): this`; the `compiler` field tightens to `get`-only. **BITE:** transplant `compiler` WITHOUT re-binding `options` → the assertion reds. RECORDS MD-6 (thin public JSDoc, optional rider). Folds `a-modularity-deep MD-1`. |
| **G.WV** | The sibling-repo HAND-OFFs (the user drives under relaxed inv-16) | IMPL (Band V) | **authored — awaits auth (USER-DOMAIN; each AUDITED as its own surface)** | Each sibling is its own surface, sequenced behind its producer. **value.js-HANDOFF:** VJ-F1 path-geometry sampler (unblocks MorphSVG/numeric-MotionPath G26-1), VJ-F4 buffer-reusing `unflattenObjectToString`, the structured-diagnostics sink + `tryParse` `furthest` swap, F3 LRU bound, E1/E2 `linear()`/`steps()` parser (retires kf's `parseLinearStops` shim), the `dispatch`-LUT inner forks, the parse-that peer-declare. **parse-that-HANDOFF:** the WITHHELD `(id,offset)` packrat re-key (build `proof:packrat-position` THEN re-key). **glass-ui-HANDOFF:** `startViewTransition({types})` + `:active-view-transition-type()`, the mobile dock occlusion in the rebuilt dock, the reka `SelectIcon` re-export. **deploy-HANDOFF:** distil `deploy-pages.yml` into the spine CF-Pages template; fix `dns-cf-sync.sh` (P0); refresh the stale CONSTELLATION roster. Folds `F-VJ-4..8`, `G-PT-2/3/4/5`, `a-deferred-ledger PT-4`, `a-glass-ui GG-3/GG-4/GG-6`, `a-constellation-gaps G-CONST-3 / G-HANDOFF-1..4`. |
| **G.WZ** | The G FINAL + the D FINAL + the changeset + provenance | IMPL (LAST) | **authored — awaits auth** | `G/FINAL.md` reconciles the consolidated ledger (zero KFE re-verified; every SHIP regression-checked, every BOOK/RECORD/HANDOFF stable); `docs/tranches/D/FINAL.md` written (the one MISSING tranche record — DP-2; verified absent; describes the LANDED D content + notes D.W5 now closed via G.W12); the prompt-recap confirms every A→G ask ADDRESSED / PENDING (sibling-owned) / G-SCOPE; the stacked re-publish changeset cut (version owner **Mike Babb**); **absorbs the G.W1–G.W14 gates**; the full proof suite green; no unintended regression. Folds `a-deferred-ledger DP-2/PUB-1`. |

## W0 audit evidence (on disk)

The deep audit lands under `audit/` — 16 phase-1 lanes + the `a-demo-playwright` demo
assay + 5 `_SYNTHESIS-` docs, each `file:line`-grounded with a
SHIP/MEASURE-FIRST/BOOK/HANDOFF/RECORD disposition and a re-runnable instrument. The five
synthesis docs are the load-bearing reconciliation:

- **`_SYNTHESIS-gap-scorecard.md`** (**LOAD-BEARING — read first**) — the honest post-F
  GAP MAP: ALREADY-SOTA (manufacture no work) vs GAP (the net-new G content), per axis,
  each row → a lane + `file:line` (§1). Plus the canonical band→wave structure with G.W
  ids (§2), the THESIS (G is NARROW — one re-pin spine + a long ALREADY-SOTA refusal),
  and the §3 disposition roll-up. The §ALREADY-SOTA binding record lives here.
- **`_SYNTHESIS-deferred-ledger.md`** — the whole-history A→G ledger. CLEAN — **zero
  KFE** (D was the terminal home for every keyframes-owned deferral; G folds no chronic
  debt). The dep re-pin (`RP-1/2/3`) is the spine; `C-6` (the line-ceiling) is the gated
  decision; `DP-2` (the absent D FINAL) closes at G.WZ; the rest are sibling-gated.
- **`_SYNTHESIS-frontend.md`** — the frontend-tier synthesis (encapsulation / state /
  brittleness reconciled into G.W7/G.W8/G.W9): the Mandate-hardest rules HONORED, one
  real HIGH NEW defect (the rAF leak), the rest MED/LOW finishing.
- **`_SYNTHESIS-backend-constellation.md`** — the backend + CI + constellation synthesis
  (G.W4/G.W5/G.W6 + the deploy HAND-OFFs): the fail-explicit surface is the reference,
  the god-module premise is REFUTED (all 7 candidates ALREADY-SOTA), the CI is SOTA + a
  residual drift-closure.
- **`_SYNTHESIS-prompt-recap.md`** — the full A→B→C→constellation→D→E→F→G recap; confirms
  the recurring precepts (no-legacy, no-workaround, idiomatic+gestalt, isomorphic,
  measure-first, KISS, inv-16) HONORED across A→G with no drops.

The 16 phase-1 lanes under `audit/` (`a-prompt-recap`, `a-deferred-ledger`,
`a-frontend-encapsulation`, `a-frontend-state`, `a-frontend-brittleness`, `a-styling`,
`a-backend-legacy`, `a-backend-godmodules`, `a-ci-streamline`, `a-constellation-gaps`,
`a-glass-ui`, `a-valuejs-leverage`, `a-parsethat-leverage`, `r-animation-sota`,
`r-modern-web`, `a-engine-perf`) plus `a-demo-playwright` each carry their own
`file:line` evidence; `G.md` cites them per-wave.

**The SUPPLEMENTAL audit (the 8 lanes the user requested ON TOP, + its synthesis — all
on disk under `audit/`).** The supplemental perf / testing / engine assay consolidated
into G.W15..G.W19 (Bands T/G/O/M) + the FOLD-INTO-EXISTING sharpening on G.W2 + the
booked SoA item:

- **`_SYNTHESIS-perf-testing-engine.md`** (the supplemental synthesis — read §2 the new
  bands/waves, §3 the reconciliation table, §4 the new-wave roll-up) — the supplemental
  gap map (ALREADY-SOTA vs net-new, per supplemental axis), the proposed `G.W15+` ids,
  and the reconciliation with the existing G thesis (the spine STILL leads; G widens
  MODESTLY; the dominant yield is a deeper refusal).
- The 8 supplemental lanes: **`r-perf-hotpath-v8`** (HP-1..HP-5, the V8 object-model
  kernel), **`r-perf-crossengine`** (X-1..X-4, the SpiderMonkey/JSC portability of the
  carrier), **`a-perf-compile-flatten-bitpack`** (CF-1..CF-6, the COMPILE step + the four
  derived forms + the bit-packing KILL), **`a-testing-robustness`** (TR-1..TR-5, the
  test-suite breadth holes → G.W15/G.W16), **`a-modern-css-interp`** (MCI-1..MCI-6, the
  per-facility interpolation path), **`a-group-layering`** (GL-1..GL-9, the compositor —
  the ONE real net-new correctness bug → G.W17), **`a-scroll-orbital-quaternions`**
  (S-1/S-2/O-1/O-2/O-3, the scroll tiers + the orbital quaternion output → G.W18),
  **`a-modularity-deep`** (MD-1..MD-6, the deep DI / pipeline / dynamism / boundary axes
  → G.W19). Each is `file:line`-grounded with a re-runnable instrument and a
  SHIP/MEASURE-FIRST/BOOK/RECORD/HANDOFF/KILL disposition.
- The five supplemental wave specs (`waves/G.W15..G.W19.md`) are authored under `waves/`,
  each in the F/G wave-spec shape (header · provenance · §State verified `file:line` ·
  §Goal · §Scope · §Hard gate · §Folds · §Design decisions). **The dominant supplemental
  yield is MORE refusal, more grounded** — the V8 / cross-engine / compile / deep-
  modularity / modern-CSS-kernel axes manufacture ~nothing (see the §ALREADY-SOTA pointer
  + `G.md § ALREADY-SOTA` for the binding supplemental additions).

## Verified facts at G-open

Every figure below is a re-runnable `wc -l` / `grep` / `cat` measurement against the live
tree on `tranche-g-dev` (2026-06-06), not the plan's prose — **verified, not asserted.**

- **The pins are STALE — kf `4.0.0` consumes pre-F-handoff siblings.**
  `package.json:84-85,88` declares `"@mkbabb/parse-that": "^0.8.2"`,
  `"@mkbabb/value.js": "^0.10.0"`, and `"@mkbabb/glass-ui": "file:../glass-ui"` (a dirty
  local LINK) while `0.9.0` / `0.11.0` / `3.3.0` are PUBLISHED carrying the F hand-off
  wins kf drove. The installed value.js / parse-that in `node_modules` are
  **`0.10.0` / `0.8.2`** (`cat node_modules/@mkbabb/*/package.json` — stale, matching the
  floor) while glass-ui in `node_modules` already resolves **`3.3.0`**. The re-pin lands
  ZERO kf source edit through the `lerpValue → iv._lerp` seam (`engine.ts:731`). (verified
  `grep` + `cat`)
- **`engine.ts` is 1313L** (`wc -l`) — +130 since F-open (~1179L); the `group.ts`
  compositor is 752L. Both are at their cohesive gestalt (F.md NEW-3 ruling re-verified
  post-growth); the library line-ceiling is a gated DECISION for G.W5, NOT a reflexive
  split. The demo's `proof:decomposition` does not yet cover `src/animation/**`.
  (verified `wc -l`)
- **`docs/tranches/D/FINAL.md` is ABSENT** — the one MISSING tranche record (DP-2); D was
  IMPLEMENTED + RELEASED but never got its close report. G.WZ writes it (describes the
  LANDED D content + notes D.W5 closed via G.W12). (verified — file does not exist)
- **The `starting-style` / Discrete route is ABSENT** — `demo/app/router.ts:16-25`
  registers 8 named scenes (`home`/`cube`/`amiga`/`square`/`easing`/`spring`/`sequence`/
  `motion-path`); `router.ts:25` is a `/:pathMatch(.*)*` catch-all that **redirects to
  `/`**. A registered "Discrete" scene has no route → it is UNREACHABLE (any
  `/discrete`-style URL silently redirects home). G.W11 (X-6) adds the route. (verified
  `cat router.ts`)
- **The deferred ledger is CLEAN — zero KFE.** D was the terminal home for every
  keyframes-owned deferral (P-invariant-28, held through F). No item folds chronic debt
  into a G wave. (verified `_SYNTHESIS-deferred-ledger.md`)
- **The changesets are CLEAN on `tranche-g-dev`.** `.changeset/` holds only `README.md`
  + `config.json` — no stale unpublished tranche changesets carry on this branch (the
  D+E+F stack RELEASED at `4.0.0`). G.WZ cuts the re-pin re-publish changeset atop the
  clean `4.0.0` base. (verified `ls .changeset/`)

## Cross-repo / USER-DOMAIN perimeter (confirm before each)

G is keyframes-internal in its keyframes-local waves; **inv-16 is RELAXED for G impl**
(the user explicitly drives value.js / parse-that / glass-ui too), but each sibling is
its own surface → cross-repo items are HAND-OFF-tagged (Band V, G.WV) and the sibling
owner sequences them. kf still consumes each sibling through its unchanged published seam.

1. **value.js / parse-that HAND-OFFs (Band V).** VJ-F1 path-geometry sampler (unblocks
   MorphSVG/numeric-MotionPath), VJ-F4 buffer-reusing `unflattenObjectToString`, the
   structured-diagnostics sink + `tryParse` `furthest` swap, F3 LRU bound (ONCE in
   value.js — no 2nd kf policy), E1/E2 `linear()`/`steps()` parser (kf's
   `parseLinearStops` shim RETIRES on land — no-legacy), the `dispatch`-LUT inner forks,
   the parse-that peer-declare, and the WITHHELD `(id,offset)` packrat re-key (build
   `proof:packrat-position` THEN re-key). Each pairs a sibling wave but requires ZERO kf
   edit to land the kf half.
2. **glass-ui HAND-OFF.** `startViewTransition({types})` + `:active-view-transition-
   type()` CSS (= H-1, unblocks the demo scene-VT), the mobile dock occlusion in the
   rebuilt dock (the `GG-5` glass-ui half — fix in the dock ROOT, never re-mask in the
   demo), the reka `SelectIcon` re-export. The kf-demo D.W5 half (rename, barrel-delete,
   mask-removal) lands kf-side in G.W12.
3. **deploy HAND-OFF.** Distil kf's `deploy-pages.yml` into the deploy spine's missing
   CF-Pages template; fix `dns-cf-sync.sh` (`keyframes.pages.dev`→`keyframes-8uq.pages.
   dev`, P0); refresh the stale CONSTELLATION roster.
4. **The re-publish leg (USER-DOMAIN — confirm-first).** The re-pin re-publish
   (`4.0.1` patch — isomorphic re-pin lighting the shipped F wins — or `4.1.0` minor if
   DrawSVG + `.finished` ship observable additive new public API) is a USER-DOMAIN
   confirm-first leg ATOP the clean `4.0.0` base. Everything up to "ready-to-publish, CI
   green" is autonomous; the npm-publish leg the user drives in dependency order,
   confirm-first. The version owner is **Mike Babb**.

## Release tier (reconciled)

G stacks atop the RELEASED `4.0.0` (D `major` + E + F landed + published). G's own tier
is decided by what ships:

- **`4.0.1` (patch)** if G is the re-pin + the isomorphic finishing sweep alone — the
  re-pin is pixel-identical (it lights the SHIPPED F wins, consume-unchanged), the
  backend fail-explicit fix corrects a WRONG silent value to a right throw, the demo +
  styling + lifecycle SHIPs are demo-local, the CI/checklist fixes are gate-internal.
- **`4.1.0` (minor)** if G.W13 (DrawSVG + the `.finished` getter) lands — those ship
  observable additive new public API.

The re-pin is a *shipped-product-correctness* fix regardless of tier (kf `4.0.0` ships
consuming stale siblings while the published ones carry the wins kf drove). The version
owner (**Mike Babb**) names G's tier definitively at G.WZ. The re-pin + the folds it
carries are the spine of the release.

## Open deferrals

Zero perpetual punts. **Zero KFE.** D was the terminal home for every keyframes-owned
deferral (P-invariant-28, held through F); the ledger G inherits is CLEAN. G folds no
chronic debt because none remains — G's content is NET-NEW findings from the post-F deep
audit (the re-pin spine + the finishing sweep), not folded debt. The full whole-history
A→G ledger is in `audit/_SYNTHESIS-deferred-ledger.md`; the terminal summary:

| Item | Tag | Terminal status / G duty |
|---|---|---|
| `proof:boundary` · inv γ · inv δ · inv ζ · inv ε · inv κ (the standing gates) | **CLOSED** | landed A–F, F-verified; G keeps green (no-regress) |
| every keyframes-owned chronic deferral | **KFD-TERMINATED (D)** | D was the terminal home — zero KFE rows; G manufactures no fold |
| the dep RE-PIN (`RP-1/2/3` — value.js `^0.11.0` / parse-that `^0.9.0` / glass-ui `^3.3.0`) | **THE G SPINE** | kf `4.0.0` ships stale; the published siblings carry the F wins kf drove — G.W2 re-pins (ZERO kf edit) |
| the library line-ceiling (`C-6`) | **GATED DECISION at G** | DECIDE, do not re-defer (P-invariant) — G.W5 extends `proof:decomposition` to `src/animation/**` w/ the recorded gestalt exception, OR re-baselines the class guard |
| the absent `docs/tranches/D/FINAL.md` (`DP-2`) | **CLOSED at G** | the one missing tranche record — G.WZ writes it (the LANDED D content; D.W5 closed via G.W12) |
| the value.js charter · MorphSVG/numeric-MotionPath · the packrat re-key | **value.js / parse-that HAND-OFF** | inv-16 RELAXED — the user drives the siblings; G hands off (Band V, G.WV); kf consumes unchanged |
| `startViewTransition({types})` (H-1) · the mobile dock occlusion · the reka `SelectIcon` | **glass-ui-HANDOFF** | glass-ui-owned; G.WV hands off; G.W12 lands the kf-demo D.W5 half |
| the re-publish leg (`4.0.1`/`4.1.0` atop `4.0.0`) | **USER-DOMAIN** | confirm-first; G.WZ cuts the changeset + names the version owner (**Mike Babb**) |

**There is no KFE row.** No item folds chronic debt into a G wave. The G waves are
findings (the re-pin spine + the finishing sweep), not folds. No item is named-forward to
an eighth tranche. The cross-repo items are HAND-OFFs (inv-16 RELAXED — the user drives
them as their own surfaces), not kf-owned debt.

## § ALREADY-SOTA pointer (binding)

The bulk of the post-F stack is exemplary and re-touched by NO G wave — the engine kernel
+ the steppers + the WAAPI eligibility, the FrameCompiler split, the color science, the
single-grammar parse + the parse-that leaf tier, the value.js boundary (the re-pin IS the
leverage — kf consumes unchanged), **both largest source files at their cohesive gestalt**
(`engine.ts` 1313L, `group.ts` 752L — F.md NEW-3 re-verified post-+99L growth), the
frontend-state Mandate-hardest rules (never-destructure-`defineProps`,
getter-fn-for-composables, typed provide/inject, disciplined `markRaw` — HONORED, not
violated), the inv-κ brittleness surface (`proof:brittleness` PASS modulo the one HIGH
NEW rAF-leak G.W9 fixes), the modern-web §4 surface (all 18 §S6 rows HOLD), the CI deploy
spine (inv-28, provenance, `pages-deploy.sh`), and the demo's accessible-names /
focus-rings / shortcut-discovery / explainer-prose / mobile dock. The full binding record
is `audit/_SYNTHESIS-gap-scorecard.md §THESIS + §3 §ALREADY-SOTA`, cross-confirmed by
`a-engine-perf G-4/§ALREADY-SOTA`, `a-backend-godmodules` (all 7 candidates),
`r-animation-sota §ALREADY-SOTA`, `r-modern-web §4`, `a-valuejs-leverage §3.1/§4`, and
`a-parsethat-leverage §6`.

**The SUPPLEMENTAL §ALREADY-SOTA additions are likewise BINDING**
(`audit/_SYNTHESIS-perf-testing-engine.md §3(d)`, folded into `G.md § ALREADY-SOTA`): the
runtime kernel at the V8 object-model level (fast-props buffers, PACKED arrays,
monomorphic `_lerp` IC, escape-elided accessors — HP-3/HP-4/HP-5); the SoA carrier's
cross-engine portability + the universal dict-mode avoidance (X-1/X-2); the O(N) compiler
+ the four-form pre-flatten (CF-2/CF-5); the DI/pipeline/dynamism/hygiene posture
(MD-2..MD-5, confirming godmodules by an orthogonal route); the modern-CSS interpolation
kernel matrix (MCI-6 — calc/var/@property/color-mix/relative-color/9 `color()` spaces/
gradients/transforms/matrix3d/filters all interpolate today); the scroll two-tier arch +
the gimbal-free orbital ACCUMULATION + the inertia `decay()` dogfood (S-3../O-2); the
group BUFFER machinery (null-fill clear, whitelist key-skip, zero-alloc — GL-7/GL-8).
**The defect in the group is purely the blend LEAF (G.W17), NOT the compositor
architecture.**

**Per the §Mandate (KISS), no wave may manufacture a deficit
where the post-F state leads — G manufactures NO work where D+E+F lead. This is binding.**
