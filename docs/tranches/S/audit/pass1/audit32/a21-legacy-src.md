# a21-legacy-src — LEGACY hunt over `src/` (Tranche R deep audit)

## Executive summary

`src/` is **clean of dead legacy code**. Exhaustive grep sweeps for
`@deprecated`, `TODO`/`FIXME`/`HACK`/`XXX`, `legacy`/`compat`/`workaround`,
`console.warn` deprecation notices, `if(false)`/unreachable dead branches, and
commented-out code blocks turn up **zero live footguns** — every hit is either
(a) a historical prose comment documenting a removal that already happened
(the `Animation` alias, the `ScrollTimeline`/`ScrollTimelineOptions`
PKG-3 aliases, the easing-registry comma-normalize fold), or (b) a genuinely
live, version-gated workaround with an explicit kill condition
(`VJS_PARAM_BUG_MAX` in `resolve-function.ts`). The `Animation` →
`KeyframesAnimation` rename (R's headline "no-legacy" claim) is verifiably
complete: no bare `Animation` export or re-export shim exists anywhere in
`src/animation/index.ts`. The any-cast census is small (0× `as any`, 0×
`@ts-ignore`/`@ts-expect-error`, 25× `as unknown as`) and every hit inspected
is a narrow, load-bearing type-system escape (SoA buffer aliasing, DOM/SVG
target coercion, `ValueUnit`↔`number` unwraps) rather than a laziness cast.

The one real finding is **not legacy code but a documentation/gestalt
honesty gap**: CLAUDE.md and FINAL.md both describe R's outcome as a
**"7-zone" / "seven cohesive zone" directory partition**, but the actual
partition — both as specified in R.W1 and as it exists on disk today — is
**12 top-level directories** under `src/animation/` (`physics`,
`orchestration`, `engine`, `group`, `compile`, `resolve`, `ingest`, `scroll`,
`svg`, `presets`, `internal`, `waapi`). `waapi/` in particular (894 LOC, 6
files) is a real, HEAVY, `index.ts`-barreled zone directory that is **never
named** in CLAUDE.md's "Project Tree" or zone-count prose, despite R.W1
itself calling out "10 zone directories" mid-wave (R.W1.md:477) and cataloging
`waapi/` as a directorized zone (R.W1.md:232-248). The god-class carve claim
holds up structurally (`engine.ts`'s 1420L god-module is gone — the largest
`engine/` file is now `animation.ts` at 499L), but `compile/` (10 flat
files, 2582 LOC) and `engine/` (12 flat files, 2758 LOC) are still flat
sibling families with zero sub-zoning, which is exactly the gap Tranche S's
mission brief already names as its own target (`compile/backward/`,
`compile/easing/`, `engine/css/`).

## Findings

### F1 — CLAUDE.md's "seven-zone" framing undercounts the actual partition (doc/gestalt, medium)

- Evidence: `/Users/mkbabb/Programming/keyframes.js/CLAUDE.md` — "each with an
  `index.ts` barrel — the LIGHT (value.js-free) zones (`physics/`,
  `orchestration/`) and the HEAVY (value.js-bearing) zones (`engine/`,
  `group/`, `compile/`, `resolve/`, `ingest/`, `scroll/`) + `presets/` +
  `svg/`" — this sentence itself enumerates **10** zone names while the
  section header calls it "seven cohesive zone directories."
  `docs/tranches/R/FINAL.md:5,18` repeats "7-zone directory partition."
  `docs/tranches/R/waves/R.W1.md:477` — "`internal/` is the sole exception to
  the barrel rule across **10 zone directories**" (R.W1's own count, already
  disagreeing with "seven"). Actual `find src/animation -maxdepth 1 -type d`
  → 12 directories: `compile engine group ingest internal orchestration
  physics presets resolve scroll svg waapi`.
- `waapi/` is un-named anywhere in CLAUDE.md's Project Tree despite being a
  real, `index.ts`-barreled, HEAVY zone directory
  (`src/animation/waapi/{delegation,densify,eligibility,emission,index,options}.ts`,
  894 LOC total) — R.W1.md:232-248 explicitly directorized it
  (`waapi.ts → waapi/waapi.ts`, `waapi-densify.ts → waapi/densify.ts`, new
  `waapi/index.ts` barrel) with its own evidence citation ("579L
  god-module"), yet it never made it into CLAUDE.md's canonical zone list or
  the "Architecture Notes" section beyond one inline `waapi.ts` filename
  reference (CLAUDE.md:104) that is itself now stale (the file is
  `waapi/eligibility.ts`, not `waapi.ts`).
- Failure scenario: an agent reading CLAUDE.md to orient itself in the
  codebase will not find `waapi/` in the tree, will not know it's a zone with
  its own barrel/boundary conventions, and may either duplicate WAAPI-related
  code elsewhere or violate the zone's internal-import discipline because the
  zone's existence was never disclosed.
- Verdict: KEEP the code (no code is wrong), **FIX the doc**. This is a
  Tranche-S-owned repair: recount and re-enumerate the actual zone roster in
  CLAUDE.md (13 total counting `internal/` as the light-leaves exception),
  name `waapi/` explicitly, and update the stale `waapi.ts` filename
  reference at CLAUDE.md:104.

### F2 — `compile/` and `engine/` remain flat sibling families (structural, medium — already Tranche-S-scoped)

- Evidence: `src/animation/compile/` — 10 files, 2582 LOC, no sub-directories
  (`backward-color.ts`, `backward-walk.ts`, `backward.ts`, `easing-option.ts`,
  `easing-registry.ts`, `format.ts`, `frame-compiler.ts`, `numeric-plan.ts`,
  `parse-flatten.ts`, `selector.ts`). `src/animation/engine/` — 12 files, 2758
  LOC, no sub-directories (`animation.ts` 499L, `playback.ts` 498L,
  `interpolate.ts` 307L, `css-animation.ts` 277L, `composition.ts` 221L,
  `options.ts` 193L, `css-metadata.ts` 169L, `element-resolve.ts` 162L,
  `option-setters.ts` 159L, plus `compile-bridge.ts`, `index.ts`,
  `public.ts`).
- R's own naming convention (R.W1.md:492) anticipated this: `<base>-<suffix>`
  flat-file naming (`compile-*.ts`, `waapi-*.ts`) was chosen as an
  intermediate step, not a terminus — R directorized the *top* level
  (`src/animation/<zone>/`) but left the *second* level flat everywhere
  except `group/` and `physics/spring/` (which got their own sub-directory,
  the "ring-break" per CLAUDE.md).
- Verdict: not a defect of R (R's scope was the top-level 7/10/12-zone
  partition, not recursive sub-zoning) — but it is exactly the residue
  Tranche S's mission brief already flags ("deeper sub-zoning of library
  zones (e.g. `compile/backward/`, `compile/easing/`, `engine/css/`)").
  Confirmed present, unaddressed, real.

### F3 — `VJS_PARAM_BUG_MAX` version-gated workaround (KEEP-justified, informational)

- Evidence: `src/animation/resolve/resolve-function.ts:20-35` —
  `normalizeParam` compensates for a value.js ≤1.2.0 `extractFunctions` bug
  (`@function --f(--x <length>: 0px)` mis-parses `<syntax>` onto `name` and
  the default onto `type`). `VJS_PARAM_BUG_MAX = "1.2.0"` is the currently
  pinned max-affected version. `package.json` pins
  `"@mkbabb/value.js": "^1.2.0"` and the installed version is `1.2.0` — the
  workaround is **currently live and necessary**, not vestigial.
- The comment explicitly documents its own kill lifecycle ("When value.js
  fixes `extractFunctions`, `normalizeParam` must be DELETED and this
  assertion bumped") and cites the upstream dispatch
  (`docs/tranches/R/audit/lib-legacy-sweep.md` B.1 exemplar).
- Verdict: KEEP. This is the correct pattern for a cross-repo workaround —
  version-pinned, self-documenting, fails loud (not silently) once the
  upstream fix lands and the pin moves past 1.2.0. Tranche S should re-check
  value.js's changelog for a fix before closing; if unfixed, carry forward
  unchanged.

### F4 — `easing-registry.ts` comma-normalize-fold workaround already retired in code, comment retained (informational, no action)

- Evidence: `src/animation/compile/easing-registry.ts:101-113` — the
  function body calls `parseLinearStops(timingFunction)` **directly** with no
  normalize step; the comment at lines 106-107 documents that "the former
  flat-comma normalize fold... is RETIRED with the consume of the root fix
  (`proof:workaround-deletion` S7)." This is accurate self-documentation of a
  deletion that already happened upstream in the code — not a live
  workaround, not dead code.
- Verdict: KEEP as-is. Good practice, no residue.

### F5 — any-cast census: small, load-bearing, no laziness casts (informational)

- Evidence: `grep -rn "as any\b" src/` → 0 hits (one prose-comment mention at
  `compile/parse-flatten.ts:127` referencing casts value.js used to have, not
  a cast in this repo). `@ts-ignore`/`@ts-expect-error` → 0 hits anywhere in
  `src/`. `as unknown as` → 25 hits across 14 files, concentrated in
  `svg/*.ts` (target-type coercion for `Partial<V>`/`ElementWithStyle`/
  `HTMLElement`), `compile/{backward-color,frame-compiler,numeric-plan}.ts`
  (`ValueUnit`↔primitive unwraps at the SoA numeric-plan boundary), and
  `engine/{animation,interpolate,composition}.ts` (documented CRTP-style
  `this as unknown as KeyframesAnimation<K>` self-casts, and one explicitly
  self-audited "NO `this as unknown as`" claim at `engine/playback.ts:21`
  describing the interface it replaced).
- Verdict: no KILL candidates found. Every cast inspected sits at a genuine
  structural-typing boundary (SoA buffers, DOM/SVG coercion, CRTP generic
  self-reference) with either an inline justification comment or self-evident
  necessity (e.g. `undefined as unknown as V` for a lazily-initialized frame
  slot). None reads as a shortcut around a real type error.

### F6 — `Animation` → `KeyframesAnimation` rename: verified complete, zero shim residue (confirms R's headline claim)

- Evidence: `src/animation/index.ts:236-237` — "the legacy `Animation`
  `@deprecated` alias... was DROPPED in 5.0.0 (Q.WE1 — NO-LEGACY)."
  `grep -n "^export.*\bAnimation\b" src/animation/index.ts` → 0 hits (no
  export named bare `Animation` remains). `grep -rn "\bclass Animation\b|new
  Animation("` → 0 hits anywhere in `src/`. `src/animation/engine/
  animation.ts:50-51` and `src/animation/group/group.ts:4` independently
  confirm the same drop from two different files.
- Verdict: KEEP (nothing to kill — already gone). This one specific claim in
  CLAUDE.md/FINAL.md is honest and independently verifiable, in contrast to
  F1's zone-count claim.

## Tranche-S implications

1. **Doc-fix wave (small, cheap, high leverage)**: re-enumerate CLAUDE.md's
   zone roster to match the actual 12-directory disk state; name `waapi/`
   explicitly in the Project Tree and Architecture Notes; fix the stale
   `waapi.ts` filename reference at CLAUDE.md:104 (should be
   `waapi/eligibility.ts` or the `waapi/` barrel). Drop "seven cohesive zone
   directories" language — either say "twelve zone directories (ten
   HEAVY/LIGHT partition zones + `internal/` + the `waapi/` compositor-
   eligibility zone)" or whatever count Tranche S's own re-zoning lands on.
   This should be folded into whichever wave does the CLAUDE.md refresh
   anyway (don't spin up a dedicated wave for a doc-only fix).
2. **Sub-zoning wave (already scoped in the mission brief, confirmed real)**:
   `compile/` (10 files/2582 LOC) and `engine/` (12 files/2758 LOC) are the
   two highest-value sub-zoning targets — both flat, both mixing concerns
   (compile/ mixes backward-resolution, easing, frame-compilation,
   flatten/parse; engine/ mixes CSS-specific machinery
   (`css-animation.ts`, `css-metadata.ts`, `element-resolve.ts`) with core
   playback/composition/interpolate). Concrete carve, following the
   `group/` and `physics/spring/` precedent already in the codebase:
   `compile/backward/{backward,backward-walk,backward-color}.ts`,
   `compile/easing/{easing-option,easing-registry}.ts`,
   `engine/css/{css-animation,css-metadata,element-resolve}.ts`.
3. **No legacy-deletion wave needed for `src/`.** This lane found nothing to
   kill. Tranche S's "NO legacy/deprecated code anywhere" mandate is already
   satisfied for `src/` as of R's close — direct further legacy-hunt effort
   at `demo/`, `scripts/`, and `test/` instead (out of this lane's scope but
   flagged for whichever lane covers those trees).
4. **Carry `VJS_PARAM_BUG_MAX` forward unchanged** unless Tranche S's value.js
   dispatch confirms the `extractFunctions` fix has landed upstream past
   1.2.0 — in which case DELETE `normalizeParam` per its own documented
   lifecycle (this is a good template for how cross-repo workarounds should
   read; no change to the pattern itself needed).
