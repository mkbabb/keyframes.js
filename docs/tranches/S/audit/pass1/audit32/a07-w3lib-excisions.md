# a07 — R.W3lib §2A–2E FAIL-EXPLICIT excisions + proof:no-silent-fallback

**Lane:** a07-w3lib-excisions · **Audit target:** R.W3 (`docs/tranches/R/waves/R.W3.md`), commits
`c2ea674`, `255e00b`, `73aa2e7`, `88b8d74`, `72fa3b0` (lib track) + `0a33f5a`, `9c1d9bd` (demo track,
the "standalone R.W3 demo items" folded into R.W5/R.W6) on `master` a15cd48..18e8617.

## Executive summary

The §2A–2E lib excisions (the five FAIL-EXPLICIT/diagnostic rewrites + the dep-cruiser
`VALUEJS_MATH_SUBPATH` narrowing) were shipped **exactly as spec'd**, with byte-level diffs
matching the R.W3.md IMPL blocks almost verbatim (`engine/css-metadata.ts:148-165`,
`engine/element-resolve.ts:135-149`, `resolve/resolve-function.ts:118-135,220-239`,
`svg/morph-svg.ts:210-227`). `proof:no-silent-fallback` is a **real three-clause runtime
detector**, not a token check: Clause 2/3 actually shell out to `depcruise` and mutate-then-revert
`leaves.ts` with a planted `../engine` import to prove the dep-cruiser rule narrowing didn't
disable the boundary rule; Clause 1 is a scoped regex grep but only over the exact 4 files R.W3
touched. Re-running the gate now (HEAD `18e8617`) confirms all three clauses still GREEN.

The one honest gap: **Clause 1's file set (`EXCISE_SET_LIB`) is 4 files wide, not `src/`-wide.**
The gate's name ("no-silent-fallback") over-promises; it is really "no regression at these 4
specific R.W3 sites." A grep of the rest of `src/` turns up zero NEW bare-catch/`?? 0` masking
patterns introduced during Tranche R (the `waapi/delegation.ts` catches pre-date R, moved intact
during the R.W2b carve) — so today's tree is clean — but nothing in CI would catch a *new*
silent-swallow introduced anywhere outside those 4 files in a future tranche. That is a
structural blind spot S should either accept explicitly (rename the gate) or close (widen Clause 1
to a `src/`-wide deny-pattern grep with an explicit KEEP-allowlist, mirroring the R.W3.md `## Items
confirmed KEEP` table).

The demo-side excisions (§2F, §2I, §2J, §2L, most of §2K, §2M) were shipped correctly and in some
cases (§2G/§2H — the carousel) were excised more aggressively than spec'd (whole files deleted
rather than just the dead callback). **One demo item was never shipped**: §2K row 4
(`useTimingFunctionEditor.ts:196` — `timingFunctionLiteralFor(key) as any`) is still live, doing a
type-laundering cast on a real (non-dead) assignment, contradicting both the spec's own
"dead expression" characterization and the close docs' claim of full item coverage. No gate ever
checked this specific cast (it isn't `catch{}` or `navigator.platform`, so it's outside
`proof:no-silent-fallback`'s pattern set), and neither `PROGRESS.md` nor `FINAL.md` names it
individually — it silently fell through the fold. This is the one concrete survivor.

## Findings

### 1. §2A–2D lib FAIL-EXPLICIT rewrites shipped verbatim to spec — SEVERITY: info (no action)

**Evidence:** `c2ea674` (css-metadata.ts:148-165), `255e00b` (element-resolve.ts:135-149),
`73aa2e7` (resolve-function.ts:22-33,118-135,220-239), `88b8d74` (morph-svg.ts:210-227,356-361,
444-450).

All four diffs match the R.W3.md IMPL blocks near-verbatim: `CSS.registerProperty` now narrows the
catch to `DOMException("InvalidModificationError")` and pushes `PROPERTY_REGISTER_REJECTED` for any
other throw; `getComputedStyle` is now guarded by `instanceof Element` (try/catch removed
entirely, not just narrowed); `resolveFunctionCall`'s two silent-DROP sites push
`CUSTOM_FN_ARG_DROP` with the value.js-bug provenance comment + `VJS_PARAM_BUG_MAX = "1.2.0"`
version-gate; `morph-svg.ts`'s per-frame renderer throws on a missing coordinate leaf instead of
masking to `(0,0)`, while the two legitimate construction-time `?? 0` sites got `KEEP:`-labeled
comments (matching `proof-no-silent-fallback.mjs`'s own `KEEP_COMMENT_PATTERN` filter — the gate
and the code co-evolved correctly).

No deviation from spec found. No further action for S.

### 2. `proof:no-silent-fallback` is a genuine runtime detector, confirmed still GREEN — SEVERITY: info

**Evidence:** `scripts/proof-no-silent-fallback.mjs:251-336` (Clause 2 shells to
`execFileSync("npx", ["depcruise", "src", "--ignore-known"])`; Clause 3 `cpSync`s a backup,
appends a live `import { getTimingFunction as _probe } from "../engine"` to
`src/animation/internal/leaves.ts`, re-runs depcruise, asserts the specific rule id
`leaf-no-engine-no-valuejs` fires in the output, then restores from backup in a `finally`).
Ran read-only at HEAD (`18e8617`) this session: all three clauses PASS, including the plant/revert
round-trip (verified `git status` clean after the run — no `leaves.ts.proof-nsf-bak` residue).

This is not a config-token check; it exercises the real `depcruise` binary against a live
mutation of the source tree and reverts it. Rare and commendable rigor for a lint-adjacent gate.

### 3. Clause 1's excise-set is 4 files, not `src/`-wide — the gate name over-promises — SEVERITY: medium

**Evidence:** `scripts/proof-no-silent-fallback.mjs:126-133` —

```js
const EXCISE_SET_LIB = [
    join(src, "animation", "engine", "css-metadata.ts"),
    join(src, "animation", "engine", "element-resolve.ts"),
    join(src, "animation", "svg", "morph-svg.ts"),
    join(src, "animation", "resolve", "resolve-function.ts"),
];
```

Clause 1 greps ONLY these 4 files for bare-`catch{}`/unlabeled-`?? 0` regressions. A grep of the
rest of `src/` (17 other `} catch` sites across `easing.ts`, `waapi/delegation.ts`,
`resolve/resolve-if.ts`, `ingest/cssom.ts` ×2, `ingest/adopt.ts`, `compile/backward.ts` ×2,
`compile/easing-registry.ts` ×2, `engine/playback.ts`, `engine/options.ts`) turns up zero NEW
silent-swallow patterns today — every one of these either carries a documented diagnostic push
(`ingest/cssom.ts:279` → `PARSE_ERROR`, `:366` → `CORS_SKIP`) or matches one of the R.W3.md
"confirmed KEEP" rows verbatim (`compile/backward.ts:422` Prettier fallback, `engine/options.ts:34`
`tryParseTime`, `waapi/delegation.ts` cancel/abort swallows pre-date R — moved intact by the
R.W2b carve, confirmed via `git show a15cd48:src/animation/waapi.ts`). So the *current* tree is
clean by inspection, but the gate itself provides zero enforcement against a NEW silent-fallback
introduced anywhere in the other ~150 `.ts`/`.vue` library files in a future tranche — the gate
would stay GREEN even if S (or a future tranche) added a fresh `catch { return defaultX; }` in,
say, `compile/frame-compiler.ts`. The gate's generic name ("no-silent-fallback") does not signal
this narrow scope to a reader of `npm run proof:hygiene-chain`'s output.

**Proposal:** either (a) rename the gate to `proof:no-silent-fallback-r-w3` /
`proof:w3-excise-regression` to be honest about scope, or (b) widen Clause 1 to a `src/`-wide
deny-pattern scan (bare `catch{}`, unlabeled `?? 0`/`?? ""`/`?? []` immediately after a
`try`-block variable, `.catch(() => {})`) with an explicit allowlist keyed off the R.W3.md
"confirmed KEEP" table (12 rows) — turning the KEEP table from prose into a machine-checked
baseline the same way `.dependency-cruiser.cjs`'s known-violations baseline works for the lint
rule. Option (b) is the more honest fix and directly reuses the precept the wave already applies
to lint (baseline the known-good, red on anything new).

### 4. §2K row 4 (`useTimingFunctionEditor.ts:196`) never shipped — the one true survivor — SEVERITY: medium

**Evidence:** `docs/tranches/R/waves/R.W3.md` §2K table, row 4: *"`useTimingFunctionEditor.ts:196`
— dead expression `timingFunctionLiteralFor(key) as any` | Delete the dead expression."*
Current file at `demo/@/components/custom/animation-controls/controls/composables/useTimingFunctionEditor.ts:195-196`:

```ts
storedAnimationOptions.animationOptions.timingFunction =
    timingFunctionLiteralFor(key) as any;
```

`git log --oneline a15cd48..18e8617 -- demo/@/.../useTimingFunctionEditor.ts` returns **zero
commits** — the file was never touched during Tranche R. The expression is not dead: it is a live
assignment into `storedAnimationOptions.animationOptions.timingFunction` (the I.W2.S3-cited persist
seam per its own adjacent comment), laundered through `as any`. R.W3.md's own characterization
("dead expression") appears to have been wrong at spec time (or went stale between DEV and IMPL),
and because the IMPL commit that landed §2K (`0a33f5a`) only touched 3 of the 4 listed sites
(`SquareScene.vue`, `useCubeAnimations.ts`, `TimingFunctionPanel.vue` — all confirmed clean of
`as any` at HEAD), this fourth item silently fell out of the batch with no gate catching the gap
(it isn't a `catch{}`/`navigator.platform` pattern, so `proof:no-silent-fallback` never looked at
it) and no close doc (`PROGRESS.md`, `FINAL.md`) naming it individually — `PROGRESS.md:42` just
says "the standalone R.W3 demo legacy items" as a blanket claim.

**Proposal:** S kills the `as any` at `useTimingFunctionEditor.ts:196` — type `timingFunctionLiteralFor`'s
return against `AnimationOptions["timingFunction"]` properly (likely a small return-type widen on
`timingFunctionLiteralFor` itself, not a cast at the call site). Low effort, single-line-adjacent
fix; the survivor is notable more for what it says about wave-closure discipline (an itemized
table row silently dropped, undetected by any gate, unflagged by any close doc) than for its own
severity.

### 5. §2G/§2H demo excisions exceeded spec (in a good way) — SEVERITY: info

**Evidence:** `9c1d9bd` deleted `SceneSwitcherCarousel.vue` (178L) + `useScrollSnapScene.ts` (72L)
in totality, rather than just excising the dead `onScroll` body as R.W3.md §2H literally
specified ("delete `onScroll` from both the composable and the `@scroll` binding... delete
`nearestCenterId` from the return object"). The commit message states the ChromeDock `Select` is
the sole ungated switcher on all breakpoints, making the entire carousel dead, not just its scroll
handler — a correct escalation once the R.W5 dead-code audit (`proof-scene-colocated.mjs`)
established zero live callers. No residue; this is the tranche method working as intended
(spec as floor, not ceiling).

One transient process note (already recorded in project memory, not a residual risk): `9c1d9bd`
git-added the `node_modules` symlink (`node_modules -> ../node_modules`, mode 120000) as a tracked
blob. Confirmed via `git ls-tree HEAD -- node_modules` that it is **absent from HEAD**
(`18e8617`) — self-healed by a later commit before the tranche closed. No action needed; flagged
here only so S's audit trail doesn't need to re-discover it.

### 6. §2E dep-cruiser reconciliation used a cleaner mechanism than the spec's regex option — SEVERITY: info

**Evidence:** R.W3.md §2E proposed a negative-lookahead regex,
`@mkbabb/value\.js(?!/math$|/math/)`. The shipped `.dependency-cruiser.cjs` instead kept
`VALUEJS_PATH = "@mkbabb/value\\.js"` unchanged and added a separate `pathNot: VALUEJS_MATH_SUBPATH`
exclusion clause on the rule (`.dependency-cruiser.cjs:94,103,170,174,213,217`). Functionally
equivalent, more readable, and it's what Clause 3's plant/revert test actually verifies against.
No deviation of substance; the IMPL improved on the DEV spec's proposed regex.

## Tranche-S implications

- **Rename or widen `proof:no-silent-fallback`.** Pick one: (a) rename to signal its true R.W3-only
  scope (cheap, honest, does nothing for future regressions), or (b) widen Clause 1 to a
  `src/`-wide deny-pattern scan with a machine-checked KEEP-allowlist sourced from the R.W3.md KEEP
  table (12 rows) — this is the wave-shaped fix and should ride any S wave that touches
  `compile/`/`resolve/`/`ingest/` sub-zoning, since those are the zones most likely to grow new
  try/catch surface as S deepens the partition (`compile/backward/`, `compile/easing/`,
  `engine/css/` per the MISSION CONTEXT).
- **Kill `useTimingFunctionEditor.ts:196`'s `as any`.** One-line-adjacent fix, zero risk, should be
  folded into whatever S wave touches `demo/@/components/custom/animation-controls/` (the
  `demo/app is a mess` mission thread already implies touching this directory tree).
- **Adopt the R.W3 KEEP-table-as-baseline pattern as a general Tranche-S authoring convention.**
  The `KEEP_COMMENT_PATTERN` (`KEEP:` inline comments the gate greps for and excludes) worked well
  for `morph-svg.ts`'s two legitimate `?? 0` sites — it turned a prose judgment call into a
  greppable, gate-enforced contract. S's "NO legacy/deprecated code anywhere" mandate should
  standardize this `KEEP:`-comment idiom across the widened Clause 1 deny-pattern scan (finding 3)
  rather than re-deriving per-site judgment calls each tranche.
- **No re-litigation needed of §2A–2D.** These four excisions are correct, complete, and
  gate-verified; S should treat them as settled ground and not re-open.
