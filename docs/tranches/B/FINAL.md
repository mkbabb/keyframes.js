# Tranche B — FINAL

B is keyframes.js' second tranche: the demo made true, the engine's debt
transposed, and CI that cannot ship a blank app. This records the close —
gates met, invariants enforced, deferrals named, and A's record reconciled.
`CHANGELOG.md` is the changeset-rendered release record; this owns intent,
the changeset owns release — they do not duplicate.

## § Gate table (each gate bites, demonstrated)

| Wave | Hard gate | Status |
|---|---|---|
| **W1** deps | check:lib · build:lib + dts byte-check (48460 B, 15/15 symbols) · test · proof:boundary · gh-pages exit 0 | ✅ MET |
| **W2** engine | 309 tests green · widened proof:boundary green (negative bite: a per-module value.js edge → red → revert) · fail-explicit THROWS (strict-options suite) · `grep TODO\\( src/animation` = 0 · 26-agent adversarial review's 16 findings all fixed + tested | ✅ MET |
| **W3** demo / inv δ | occlusion gate green on 18 page×viewport (negative bite: re-introduce the cube clip → cube laptop/desktop red "97% of vw" → revert → green) · the 4 blank scenes render (34-47 els, was 9-10) | ✅ MET |
| **W4** perf / inv γ | demo-smoke green: real 240 KB entry (was 698 B shim) + 286 KB CSS · #app mounts · no monaco/three at first paint · no splash · prod perf measured (desktop FCP ~1.0 s, LCP ~1.3 s, perf 89-96) | ✅ MET |
| **W5** a11y/SEO | `<main>`=1 · 0 imgs without alt · meta description + robots.txt in the build · glass-ui outward asks filed (inv-16) | ✅ MET |
| **W6** CI | library gate (node v5, glass-ui-free, /tmp clean-runner green) + demo-smoke job (inv γ + inv δ, published glass-ui + chromium) · node20→node24 actions | ✅ MET |
| **W7** close | 18 AFTER captures (repaired prod build, 0 console errors) + per-page DELTA · FINAL reconciles A's 3 defects · changeset cut | ✅ MET |

## § Invariants

- **inv α — the boundary is gated, WIDENED.** `proof:boundary` now bundles
  EVERY light barrel export as its own entry (the entry set is PARSED from
  the barrel — self-enforcing; a new light export is proven automatically),
  asserts 0 value.js + 0 static engine edge per entry, asserts the heavy
  engine emits as a dynamic chunk behind `loadAnimationEngine`, and
  source-greps for dormant static specifiers (import / export-from / bare
  side-effect). The A coverage hole (only `SpringProgress` proven) is
  closed; both negative-bite forms demonstrated red→revert.
- **inv β — the library build is glass-ui-free, RECONCILED (disposition b,
  honestly stated; C.W1 S5).** The committed lockfile records
  `@mkbabb/glass-ui` as an optional `file:../glass-ui` dep with `optional:
  true` (the `../glass-ui` node + 5 references). On a sibling-absent clean
  runner `npm ci` LINKS a dangling `node_modules/@mkbabb/glass-ui ->
  ../../../glass-ui` whose target is MISSING — npm TOLERATES the dangling
  optional link non-fatally; it does NOT "cleanly skip" it. inv β survives
  because the library graph never dereferences the link: verified by a /tmp
  clean-runner archive run (`../glass-ui` ABSENT) — `npm ci` + check:lib +
  build:lib + test 309/309 + proof:boundary all green with the link dangling.
  Disposition (a) — a genuinely glass-ui-absent lockfile — is unreachable
  without deleting the `optionalDependencies` declaration, which breaks the
  `file:../glass-ui` demo dev install (verified C.W1 S5: removing the
  declaration leaves glass-ui unlinked even with the sibling present); (b) is
  the spec's reserved contingency, shipped. **This supersedes A's "regenerated
  glass-ui-absent" prose** — see § A-record reconciliation.
- **inv γ — the demo cannot ship blank (NEW).** `scripts/demo-smoke.mjs`
  asserts the BUILT `dist/gh-pages/` carries a substantial app entry that
  mounts + paints, CSS emits, no splash, heavy chunks off the critical
  path. Wired into `ci.yml` as a standing job. Negative bite: reverting the
  `index.html → main.ts` extraction restores the blank build → red.
- **inv δ — no page occludes on any viewport (NEW).**
  `scripts/occlusion-gate.mjs` asserts, per page × {375,1280,1440}, zero
  horizontal overflow + subject present + in-bounds + roughly centered. The
  subject-present check is the discriminator the W0 overflow-only report
  lacked (blank ≠ occlusion-free). Wired into `ci.yml`.

## § A-record reconciliation (the close-honesty checklist)

B inherits A's close record as ground-truth and corrects the three drifts
the W0 plan-audit catalogued — a known-wrong figure must not propagate to C:

1. **The stale `A/waves/W4.md` group-reduced-motion prose.** A's W4.md
   describes the group reduced-motion behavior the pre-publish review
   REVERSED. W2 authored the rest-position contract against the SHIPPED
   source (not the stale spec) and SUPERSEDES the whole tangle: `settle()`
   is now pure teardown (never paints), `reset()` is the explicit rewind,
   `restPosition` derives once from `fillMode`, completion paints the rest
   frame via `paintRest()`. The child-vs-group `reset()` asymmetry A's spec
   muddled is dissolved — both now have one pure `settle()` + one
   paint-then-settle `reset()`.
2. **The glass-ui-present-vs-"absent" lockfile claim.** A's FINAL/W1 assert
   the lockfile was "regenerated glass-ui-absent"; it was glass-ui-PRESENT
   (optional). B.W6 + C.W1 S5 RESOLVE this honestly: the lockfile records
   glass-ui optional with `optional: true` (disposition b), a clean runner
   LINKS a dangling `node_modules/@mkbabb/glass-ui` (target missing) which npm
   TOLERATES non-fatally — NOT a "clean skip." inv β holds because the library
   graph never dereferences the link, proven by the /tmp clean-runner archive
   run. Disposition (a) (genuinely glass-ui-absent) is unreachable without
   deleting the `optionalDependencies` declaration the demo dev install needs
   (verified C.W1 S5). The true inv β artefact is the tolerated-dangling-link
   under (b), stated exactly here and in W6.md / ci.yml — no "cleanly skips"
   claim survives.
3. **The `261→286` off-by-one.** A.md's title claimed `261→286` tests; the
   real A base was 260 (A's FINAL/PROGRESS were correct, the title was
   not). B treats A's FINAL as authority and records B's totals against the
   corrected base: **260 (A) → 309 (B)**, +49 (the resolve-easing,
   strict-options, leaves-parity, and waapi-lifecycle suites; the old
   string-easing/EasingResolvable contract tests rewritten).

Cosmetic A-doc drifts (the W5.md "13-test"→"15-test" mismatch; spaced
em-dash style) — recorded-as-reconciled per the audit's KILL→record
disposition, not re-waved.

## § Net-deletion / ι sweep

W2's transpositions delete more than they add: **−3 modules**
(`easing-resolvable.ts`, `internal/css-easing.ts`, `renderer.ts` — no
alias), **−16 in-code TODOs** (the CRITICAL + 4 HIGH setter cluster + the
group `reset/fill` TODO(HIGH) + the rest, all retired), the seven
hand-written reduced-motion snap bodies → one `withReducedMotion` gate +
per-surface one-liners, the three `_startLoop`/`_stopLoop` byte-siblings +
the group's 4th rAF loop → one `RAFPlayback` driver. `grep TODO\\(
src/animation` = 0. `dist/keyframes.js` carries 0 `@mkbabb/value.js`
specifiers (proof:boundary).

## § Overfitting (every new B artefact ≥2 consumers OR a demo OR not shipped)

| Artefact | Consumers | Verdict |
|---|---|---|
| rest-position/fill contract (`settle`/`reset`/`restPosition`/`paintRest`) | `Animation` + `AnimationGroup` completion + reduced-motion | ≥2 (net − the TODO + the fork + the quirk) |
| `RAFPlayback` driver (`play`/`drive`/`loop`) | `Animation` + `AnimationGroup` + smooth/spring/numeric + WAAPI shadow | ≥2 (net − 3 `_startLoop` copies + the 4th) |
| `withReducedMotion` gate | every play path (engine/group/playback/smooth/spring) | ≥2 (net − 7 snap bodies) |
| typed `Easing {fn,css?}` + `resolveEasing`/`toEasing`/`cssTwinFor` | `waapi` (`.css`) + light engines (callable-only) + `springTimingFunction` + format | ≥2 (retires 2 Symbol channels + the sync-API lie) |
| `parseOption`/`AnimationOptionError` (fail-explicit) | the 9 option setters + light-engine easing inputs | ≥2 |
| widened `proof:boundary` | `ci.yml` + `release.yml` | ≥2 CI |
| `demo-smoke.mjs` (inv γ) | `ci.yml` | standing CI + every future demo push |
| `occlusion-gate.mjs` (inv δ) | `ci.yml` + the before/after harness | ≥2 |
| LoAF observer | the prod-perf measure + the demo bench (co-landed, each the other's consumer — the chronic closed) | ≥2 |

No speculative surface ships.

## § Deferrals (named owner + trigger; zero perpetual punts)

- **φ-ladder typography migration + dual-serif formalization + the
  CSSCodeEditor cartoon-shadow token** — real (design-findings), DEFERRED
  to a demo-polish follow-up. Owner: keyframes demo. Trigger: next
  demo-touching wave. NOT phantom (W5 IS the demo-polish home; the gateable
  a11y/SEO + correctness landed here; the broad type migration is the
  residual, scoped, owned).
- **Dock double-click + VAL-9 spring-token regen** — glass-ui-owned outward
  asks (`asks/glass-ui-adoption-asks.md`, inv-16). keyframes' enabler
  (stable `springLinearStops` export) is LANDED; the mask removal (ASK-1) +
  the codegen (ASK-2) land in glass-ui.
- **ScrollTimeline native** — KILL with rationale (recorded permanent): the
  native `ScrollTimeline` drives an animation off-thread; keyframes'
  `Timeline` is a caller-polled sampling pipeline (`sample()→…→progress`) —
  the native API does not fit the contract, so feature-detecting it would
  not replace the JS sampler. No consumer asks for off-thread scroll
  binding. Re-open only if one appears.
- **Worker/OffscreenCanvas/Atomics** — PERMANENT-ARCHIVE (no consumer),
  unchanged from A.

## § Release

The changeset (`.changeset/`) renders B's release. Bump tier: **minor** —
W2's fail-explicit option validation throws on malformed PRESENT input but
genuine omission still defaults; the published `dist/` surface is otherwise
additive (typed `Easing`, `resolveEasing`/`toEasing`, the widened boundary).
The W1 majors are demo/tooling-only (the library deps were already latest),
so none reaches `dist/`. The light engines now reject a string easing name
(throw) where they formerly silently fell back to identity — a behavior
change at the construction boundary, cleanly, no shim. The version owner is
named here so the publish leg is not orphaned. The publish leg
(`changeset version` → tag → `release.yml` publish-with-provenance, the SAME
path A established) is **user-domain, confirm-first**.
