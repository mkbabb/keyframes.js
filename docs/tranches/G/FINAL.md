# Tranche G — FINAL

G is keyframes.js' seventh tranche and the narrowest yet: a re-pin spine that finally
CONSUMES the published F sibling-wins kf drove but never received, two narrow additive
engine surfaces, the post-F idiom-drift sweep, the two gated decisions taken, and the
cross-repo hand-offs the user drives under relaxed inv-16. It proved itself net-new by
what it left untouched as much as by what it shipped — ~90–95% of the post-F stack was
ALREADY-SOTA and re-touched by NO wave. **Landed on `tranche-g-impl`, `proof:all` GREEN
(35 gates · 637 tests + 1 expected-fail), tsc + `check:lib` clean, the demo builds.**

This is the close report (G.WZ). The charter is `G.md`; the board is `PROGRESS.md`; the
deep-audit evidence is under `audit/` (16 phase-1 lanes + the Playwright demo lane + 5
synthesis lanes + the 8 supplemental lanes). The cross-repo hand-off charter is
`valuejs-parsethat-glassui-handoff.md`.

## The commit ledger

| Commit | Wave(s) | Headline |
|---|---|---|
| `a8b618b` | G.W0 | develop the tranche — charter + 21 wave specs + hand-off + audit (docs) |
| `d308699` | G.W1 · G.W2 | the dep RE-PIN spine — consume the published F sibling-wins (ZERO lib edit) |
| `3d352a3` | G.W4 · W17 · W13 · W19 · W5 | engine: fail-explicit · blend leaf · DrawSVG+`.finished` · adoptCompiled · line-ceiling decision |
| `7e86c40` | G.W15 · W16 | the interpolate-anything / color-fidelity / computed-resolution / round-trip corpora |
| `1b9b05f` | G.W7 · W8 · W9 · W3 · W10 · W11 · W18 · W12 | frontend: Vue idiom · store singleton · rAF-leak fix · resize fold · idiom sweep · Playwright SHIPs · orbital · dock D.W5 close |
| `5954d1c` | G.W6 · W14 + integration | CI workflow hygiene · modern-web checklist · wire the 12 G gates |
| `bbc0212` | convergence | adversarial review fixes — orbital reverse-path · demo-usability bite · DrawSVG fail-explicit · gate hardening |

The sibling unblock that the spine consumed lives in the value.js repo:
`value.js@0.11.1` (`4c8c532` + the `b4defb0` CI fix) — drop the broken `development`
export condition `0.11.0` shipped, published provenanced on `v0.11.1`.

## The spine — G.W1 + G.W2 (the headline)

**G.W2 is the single highest-leverage, lowest-source-cost motion in the whole ledger.**
kf 4.0.0 shipped consuming stale siblings — `value.js ^0.10.0`, `parse-that ^0.8.2`, a
`glass-ui file:../glass-ui` LINK — while the published `0.11.x` / `0.9.0` / `3.3.0`
carried the F hand-off wins kf DROVE: the −94% computed-endpoint memo, the color-channel
plan, the 2.41× dispatch LUT, the C5 24-no-op-unit *correctness* fix, the parse-that
soundness hardening. The whole F.W6 architecture was load-bearing on "kf consumes it on
re-pin"; the re-pin never happened. G.W2 lands it through the single
`lerpValue → iv._lerp` seam (`engine.ts:731`) with **ZERO library source edit** — the
consume-unchanged lock held (no `src/`, `test/`, or demo-SFC edit on the bump).

- **G.W1** — the measure-first safety lock (`proof:repin-safe`, a pre-stage gate not
  chained into `proof:all`): fetched the PUBLISHED typings via `npm pack` into a temp
  dir and certified 44/44 kf-consumed value.js names survive `0.11.x`, kf's one direct
  parse-that import survives `0.9.0`, zero `.memoize(` call-sites.
- **G.W2** — the re-pin + `proof:deps-current` (installed ≥ floor; no
  `file:`/`link:`/`git:` protocol in manifest OR lockfile; parse-that realm convergence
  surfaced as a fail-explicit non-gating value.js-HANDOFF — value.js still declares
  parse-that `^0.8.2`) + `proof:repin-witness` (the C1 computed endpoint resolves 1
  fresh write over 600 steady frames — O(frames)→O(1)) + the CF-1 compile-% witness.

**The one sibling defect the re-pin surfaced + drove to fix.** Consuming the *registry*
`value.js 0.11.0` broke the demo build + the full vitest suite: `0.11.0` added an
`exports` `"development": "./src/index.ts"` condition while `files: ["dist"]` omits
`src/`, so Vite/Vitest applied the condition and could not resolve the package (Node
ignored it). `0.10.0` never had it. Fixed in value.js (`0.11.1`, the condition removed,
republished provenanced) — the upstream unblock; kf re-pinned `^0.11.1`. The demo build
also needed a one-line fold: with glass-ui consumed from the *registry* (not a workspace
link), glass-ui's bare `import … from "@mkbabb/keyframes.js"` had no installed package to
resolve, so `vite.config.ts` self-aliases `@mkbabb/keyframes.js → src` (the demo dedups
glass-ui onto its own engine instance; supersedes the contract-v2 no-self-alias rule
that presupposed the `file:` symlink the registry pin removed).

## The waves — what landed, each gated

**G.W3 — the C1 container-resize staleness fold.** `AnimationVisualizer` wires
`bumpLayoutEpoch()` on its container `ResizeObserver` (the re-pin's computed-endpoint
memo introduced `cqw` staleness under a non-window resize); the library container-unit
contract documented (no generic auto-observer without a bench). Gate `proof:resize-tracks`.

**G.W4 — backend fail-explicit close.** `serializeEasing` THROWS a typed
`AnimationOptionError` on a custom-closure easing with no CSS twin instead of silently
emitting `"linear"` (the curve was lost on round-trip). Gate `proof:roundtrip-easing`
negative control. The one genuine silent-degrade in the backend, closed.

**G.W5 — the library line-ceiling GATED DECISION.** Decided, not re-deferred (the
P-invariant): `proof:decomposition` extended to `src/animation/**` with per-file ceilings
+ RECORDED gated exceptions (`engine.ts` 1400 file / `animations.ts` 900 god-LIST / …),
and `proof:engine`'s Animation-class guard re-baselined 1050→1100 for the cohesive
additive W13/W19 growth. The class is at its cohesive gestalt (F.md NEW-3, re-verified);
a compile re-inline (~1311) still bites. NOT a reflexive split.

**G.W6 — CI workflow-hygiene gate.** The stale `^0.10.0` version-literal de-hardcoded;
the duplicated glass-ui clone block → a `setup-glass-ui` composite action; the stale
`v3.2.0`→`v3.3.0` pin; the missing `concurrency:` on ci/release (release
`cancel-in-progress: false` — the publish-safety asymmetry). `proof:ci-coverage` extended.

**G.W7/W8/W9 — frontend encapsulation / state / brittleness.** 8 template-bound refs →
`useTemplateRef`; `useToastGuard → toastGuard`; type/util modules re-homed out of
`composables/`. `useAssetManager` brought into the `createGlobalState` singleton (ref
identity), the dead `stateVersion` deleted. **The one HIGH NEW defect** — four scene
loop-owners wired rAF cleanup to a dead `onDeactivated` (`<KeepAlive>`-only, no host) →
Easing/Spring leaked the preview loop on every play-then-swap; re-homed onto
`onScopeDispose`/`onBeforeUnmount`. Gates `proof:demo-template-refs`,
`proof:asset-store-singleton`, `proof:brittleness` clause-4 lifecycle, `proof:scene-raf-leak`.

**G.W10/W11/W12 — styling / usability / the dock.** The post-F `sequence/`/`motion-path/`
scenes re-forked idioms D.W2 + F§1 retired — promoted `.status-badge`/`.code-token` to
the one idiom layer, `.mp-traveller` consumes `.progress-ball`, the coupled `400px` +
the two-name fade tokenized (`proof:idioms` clause 8). The Playwright SHIPs: the
unreachable Discrete route added, the hero LCP word-spacing fixed (rendered
"Selectananimation"), the duplicate Play aria-label disambiguated (`proof:demo-usability`,
browser-gated, hard-fails CI under `KF_REQUIRE_BROWSER`). **D.W5 closed** (the one
legitimately-blocked A→F carry, unblocked by the glass-ui 3.3.0 pin): `TopDock →
ChromeDock`, the `dock/index.ts` pass-through barrel deleted, the `:always-expanded`
occlusion mask REMOVED (not tuned — `occlusion-gate.mjs` stays green mask-free), the
vitest VT stub realigned. The mobile-occlusion residual is a glass-ui-HANDOFF (fixed in
the dock root, never re-masked).

**G.W13 — DrawSVG + `.finished` (the additive public API → the minor).** `fromDrawSVG`
mirroring `motion-path.ts` (one `getTotalLength()`, `stroke-dashoffset L→0`,
WAAPI-eligible, zero value.js dep) behind `loadAnimationEngine()`; `get finished()` over
the held play promise on every loop-owner. Gates `proof:drawsvg` + `proof:finished`.

**G.W14 — modern-web checklist completeness.** +3 catalog rows (`sibling-index()`,
Custom Highlight API, `<dialog closedby>`) with live Baseline strings; all 18 existing
rows hold. `proof:modern-web`.

**G.W15/W16 — the testing corpora (test-only).** `proof:interpolate-anything` (every
value type asserts its exact midpoint) + `proof:color-fidelity` (known-coordinate
equality per space + a value.js parity gate) + the `it.fails` fn-arity-pad witness
(GREEN today, flips RED the instant value.js's MCI-5 identity-aware pad lands — the
consume-leg signal); `proof:computed-real-dom` (Playwright — the ONLY place the C5 fix
is provable on the genuine layout path, SUPERSEDES the un-runnable G.W2 S4 `50dvh`-rAF
clause) + the jsdom injection-seam unit + `proof:roundtrip-fidelity`.

**G.W17 — the dead `add`/`weighted` blend leaf (HIGH, the ONE real net-new bug).** The
guard tested a bare `ValueUnit` but the leaf is a `ValueUnit[]`, so both UI-exposed
blend modes silently collapsed to `replace`. Fixed to an element-wise in-place blend
(`min(length)`, per-element numeric guard, zero-alloc intact, un-clamped per GL-6, no
length-1 special case). Gate `proof:blend` (`add`→1.0, `weighted` w=0.5→0.25).

**G.W18 — the orbital `rotate3d` output collapse.** The container render collapsed from
a gratuitous quaternion→Euler→re-apply round-trip (with a self-inflicted gimbal branch)
to ONE native `rotate3d` off the quaternion's axis-angle. The pure quaternion↔Euler math
was extracted to a colocated `quaternionEuler.ts` (the natural concern seam — keeping the
SFC under its line ceiling). The Euler v-model (slider/share) is preserved (O-1a). The
convergence pass restored the **two-way** path: an external Euler write (matrix-editor
Reset / slider / share) re-seeds the quaternion via a watch (echo-skipped against the
forward path's own write). Gate `proof:orbital-rotate3d` (rotate3d form + gimbal-pole
parity + the reverse-path clause). Honest delta: the render leg is the simplification —
the SFC net change is small (the function survived for the v-model), NOT "net-negative
lines" as the charter headline first projected.

**G.W19 — the `adoptCompiled()` engine seam (MED).** `Animation.adoptCompiled(source)`
transplants `{options, compiler, unflatten}` atomically, re-binds
`this.options === this.compiler.options` (the `6e29236` live-options invariant by
construction), recomputes the stable key-set; `compiler` tightens to a read-only
accessor. The demo's only cross-boundary reach-in collapses to one verb. Gate
`proof:adopt-compiled`.

## Adversarial review + convergence

A 5-lane adversarial review (gates-bite · precepts · engine · frontend · spec+integration)
ran read-only over the full impl diff. **One HIGH, one MED, two LOW, NITs — all fixed in
`bbc0212`; the precepts/engine/frontend/spec lanes returned clean verdicts** (the diff is
precept-clean; the gates bite; the G.W5 ceiling decision is sound; no wave dropped a
promised fold):
- **HIGH** — the W18 orbital collapse had dropped the external-Euler→render path (the
  v-model is two-way; the old code rendered Euler directly). Restored + a biting
  reverse-path gate clause.
- **MED** — `proof:demo-usability` ignored `KF_REQUIRE_BROWSER`: its two browser-only
  clauses skipped silently while reporting PASS. Now hard-fails under the env CI sets.
- **LOW** — DrawSVG `from`/`to` read a bare number as a percent (`0.5`→0.5%); set the
  unambiguous fraction-or-percent-string contract, fail-explicit out of range.
- **LOW** — `proof:deps-current` clause 2b now keys on the lockfile node NAME, so a
  stale `file:` `@mkbabb/*` sibling can't escape the protocol sweep.
- **NIT** — the AnimatedText hero-gap comment re-attributed to its real cause (Vue
  `whitespace: 'condense'`, not HTML inline-block collapse); the G.md/PROGRESS G.W18
  headline reconciled to the O-1a reality.

## The deferred ledger — CLEAN (zero KFE)

D was the terminal home for every keyframes-owned deferral (P-invariant-28, held through
F); G inherited a clean ledger and folded NO chronic debt — its content is net-new
findings from the post-F deep audit. Every standing gate (`proof:boundary`, inv γ/δ/ζ/ε/κ)
stays green. The one true chronic (the value.js charter, C-1) is CHRONIC-by-design and
correct — the inv-16 process ships a slice every tranche; G consumed the landed `0.11.x`
slice via the re-pin. **No perpetual keyframes-owned punt survives.** The missing D close
report (DP-2) is written — `docs/tranches/D/FINAL.md`.

## Cross-repo hand-offs (Band V — the user drives under relaxed inv-16)

See `valuejs-parsethat-glassui-handoff.md` for the full charter. Status at G-close:

- **value.js** — `0.11.1` PUBLISHED (the `development`-export fix; the upstream unblock
  the spine consumed). The residual charter slice (VJ-F1 path-geometry sampler, the E1/E2
  `linear()`/`steps()` parser that retires kf's `parseLinearStops` shim, the MCI-5
  identity-aware fn-arity pad that flips the `it.fails` witness, the F2/F2b color
  sentinels, the structured-diagnostics sink) remains value.js-owned — kf consumes each
  through the unchanged seam with zero kf edit.
- **parse-that** — the withheld `(id,offset)` packrat re-key (build `proof:packrat-position`
  THEN re-key); the realm convergence (value.js re-pins its own parse-that to collapse the
  dual realm — surfaced non-gating by `proof:deps-current`).
- **glass-ui** — its AW tranche is beginning. kf's contribution is **keyframes 4.1.0
  itself** (the re-pin re-published — the upstream unblock AW named). On that land, AW
  widens BOTH glass-ui peers together (`keyframes ^2.2||^3||^4` + `value ^0.10||^0.11`,
  build-verified, with a born-RED `proof:peer-conformance` gate). **The demo's
  `@mkbabb/keyframes.js → src` dedup-alias STAYS until then** (AW endorses keeping it);
  glass-ui 3.3.0's stale peers (`keyframes ^2.2||^3`, `value ^0.10`) are AW's to widen,
  not a kf-side patch. The mobile dock occlusion + `startViewTransition({types})` (H-1)
  remain glass-ui-owned.
- **deploy** — distil `deploy-pages.yml` into the spine CF-Pages template; fix
  `dns-cf-sync.sh` (`keyframes.pages.dev`→`keyframes-8uq.pages.dev`); refresh the
  CONSTELLATION roster.

## Release

G stacks atop the released `4.0.0` and is cut at **`4.1.0` (minor)** — the re-pin is a
shipped-product-correctness fix (pixel-identical, it lights the F wins consume-unchanged),
and `fromDrawSVG` + `get finished()` + `adoptCompiled()` ship observable additive new
public API. The changeset is `.changeset/tranche-g.md`. The re-publish is a USER-DOMAIN
confirm-first leg atop the clean `4.0.0` base; everything up to "ready-to-publish, CI
green" is autonomous. **Version owner: Mike Babb.**

## The honest bottom line

G is the narrow re-pin-spined finisher with a large, honest ALREADY-SOTA refusal. The
spine finally pays kf the F wins it drove; around it, two cheap additive engine surfaces,
the one real correctness bug fixed, the post-F idiom-drift swept, the two gated decisions
taken not re-deferred, the four Playwright demo SHIPs, the CI drift closed, and the
cross-repo hand-offs sequenced. Everything else — the kernel, steppers, WAAPI harness,
FrameCompiler, the value.js boundary, the color science, the parse grammar, the
frontend-state tier, both largest source files at their cohesive gestalt — is ALREADY-SOTA
and left untouched. G proved itself net-new by what it left alone as much as by what it
shipped.
