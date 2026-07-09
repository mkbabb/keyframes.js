# a20 · svg/ + presets/ + internal/ + boundary root — SPEC vs SHIPPED vs GESTALT

**Lane:** a20-zone-svg-presets-internal-boundary (structural-quality). **Scope:**
`src/animation/svg/**`, `src/animation/presets/**`, `src/animation/internal/**`, and the
boundary/root files (`index.ts`, `load-engine.ts`, `adapter.ts`, `animate.ts`, `easing.ts`,
`validate.ts`, `constants.ts`, and the now-gone `utils.ts`) as shipped on `master`
(a15cd48..18e8617), read on `tranche-s-dev`. Read-only.
**Sibling context:** a02 (zone-partition), a05/a12 (decomposition + `LIBRARY_CEILING_OVERRIDE`),
a06 (cycle-ring, the R.W2c DI seams), a08/a09 (subpath + animate excision), a17 (engine core),
a18 (compile). This lane owns the three peripheral zones + the root boundary.

---

## Executive summary

Three zones with three very different verdicts.

**`svg/` is the healthiest zone in the library** — correctly HEAVY (every factory constructs
`CSSKeyframesAnimation`; `morph-svg.ts` carries the ONE legitimate value.js edge, `PathGeometry`),
a barrel that is a *real* surface (`engine/public.ts:70,78` consumes it), and three factories built
to one honest contract ("the browser/value.js owns the geometry, kf interpolates a scalar/polyline").
The only residue is a **one-method API-family asymmetry** (`MotionPath` lacks the `.finished` getter
`DrawSVG`/`MorphSVG` both expose) and a modest **three-class delegation duplication**.

**`presets/` is correctly HEAVY and cohesively kind-split**, but carries two pieces of residue: a
**dead `SPRING_SMOOTH` constant kept alive by a `void` suppression hack** (`presets/spring.ts:17,21`)
— exactly the no-legacy target S charters — and **`classic.ts` still riding a `LIBRARY_CEILING_OVERRIDE`
entry** (`scripts/proof-decomposition.mjs:139-155`, cap 750). The keystone R.W0 said *delete* the
override machinery; the impl kept it down to one honest data-volume entry. Defensible under R.md §7,
but the mechanism the keystone marked for deletion survives, and the deeper SOTA move — extracting the
34 raw-CSS-string constants to a data module the gate does not measure as algorithmic source — was
never taken.

**`internal/` is the grab-bag the prompt suspected, and its two structural facts undercut its own
name.** (1) Its `index.ts` barrel — added by R.W1 §2h "for genuine consistency" — has **ZERO
consumers**: all 44 internal imports are deep-path (`grep` verified). It is symmetry-for-symmetry.
(2) `internal/` is a **misnomer**: five of its members are *public API* (`reducedMotionScale`,
`ReducedMotionPolicy`, `AnimationOptionError`, `UnknownEasingError` off the barrel;
`getAnimationId` off the engine barrel). It is not "internal" — it is *the value.js-free leaf zone*.

**The boundary root carries the lane's two sharpest findings:**

- **`animate.ts` is fully orphaned dead code** (213L) + 2 test files. R.W4 excised `animate()` from
  the published surface but *kept the file*, justified (R.W4 §2.5, `index.ts:156`) as "a HEAVY chunk
  reachable via `loadAnimationEngine`." **That justification is false** — nothing in the built graph
  imports `./animate` (`grep 'from ".*/animate"'` returns nothing; it is absent from `load-engine.ts`'s
  `Promise.all` and every engine barrel). Only the two test files reach it, directly from source. It
  ships to no consumer. FINAL.md (`:21-22`) frames it as a "removal," but the implementation lingers.

- **The parse-that seam is entirely gone** — `@mkbabb/parse-that` is not in `package.json` deps *or*
  devDeps, and no `src/` file imports it (`parse-flatten.ts:125-128` records the removal). Yet **both**
  `CLAUDE.md` (project root) and `src/animation/CLAUDE.md` still document `src/animation/utils.ts` as
  "the parse-that `any`-combinator seam." `utils.ts` does not exist (it became `compile/parse-flatten.ts`).
  The answer to the prompt's question — *"is utils.ts still needed post-5.x?"* — is **no, and neither is
  the parse-that documentation around it.**

Net: `svg/` needs a one-line fix and an optional base-class; `presets/` needs a dead-const deletion and
a data-extraction decision; `internal/` needs a gestalt (drop the unused barrel, rename or re-scope);
the root needs `animate.ts` deleted and the two remaining HEAVY marooned modules (`adapter`, `validate`)
homed into zones so the root holds only the boundary + the light seam.

---

## Findings

### F1 — `MotionPath` lacks the `.finished` getter its two sibling factories expose (MEDIUM, API-family consistency)

**Evidence.** The three `svg/` factory classes are meant to be one family (same "class form of the
`from*` factory" docstring). Two expose `.finished`, one does not:
- `DrawSVG` — `draw-svg.ts:210-213` `get finished(): Promise<void> { return this.animation.finished; }`
- `MorphSVG` — `morph-svg.ts:467-470` same getter.
- `MotionPath` — `motion-path.ts:164-191` — `play`/`pause`/`stop` only. **No `.finished`.**

Yet `motion-path.ts`'s own factory docstring (`:88`) advertises "the `animate()` contract — `.play()` /
`.pause()` / `.stop()` / the awaitable play promise" as the returned handle's surface. A consumer who
learns the family on `DrawSVG` and reaches for `motionPath.finished` gets `undefined` — a silent
appearance-axis gap a green source-shape gate never sees (the MEMORY gate-blindspot lesson exactly).

**Proposal.** Add the three-line `get finished()` to `MotionPath` (`motion-path.ts`, after `:190`).
Trivial; closes the asymmetry. See F2 for the structural version.

---

### F2 — three factory classes hand-duplicate the play/pause/stop/finished delegation (LOW-MEDIUM, DRY)

**Evidence.** `MotionPath` (`motion-path.ts:164-191`), `DrawSVG` (`draw-svg.ts:185-214`), `MorphSVG`
(`morph-svg.ts:415-471`) each declare `readonly animation: CSSKeyframesAnimation<V>` and re-implement the
identical `play()` / `pause()` / `stop()` (and, for two of three, `finished`) as verbatim one-line
delegations to `this.animation`. The only per-class members are the constructor and one extra
(`MorphSVG.sampleD`, `MorphSVG.samples`). That is ~15 lines of copy-paste × 3, and it is the mechanism
by which F1's asymmetry crept in (the `.finished` getter was added to two classes and missed on the third
because there is no shared source of truth).

**Proposal.** Introduce a tiny shared base in `svg/` — `abstract class SVGAnimationHandle<V> { readonly
animation; play(); pause(); stop(); get finished(); }` — and have the three factory classes extend it,
setting `this.animation` in their constructors. `MorphSVG` adds `sampleD`/`samples`; the rest inherit.
This makes F1 impossible by construction. LOW-MEDIUM: real DRY + a correctness guard, but the classes are
already thin ergonomic wrappers over the canonical `from*` functions, so the win is modest. Pairs with F1.

---

### F3 — `SPRING_SMOOTH` is a dead constant kept alive by a `void` suppression hack (MEDIUM, S "no legacy" charter)

**Evidence.** `presets/spring.ts:17-21`:
```
const SPRING_SMOOTH = { response: 0.5, dampingFraction: 0.86 } as const;
const SPRING_SNAPPY  = { response: 0.35, dampingFraction: 0.78 } as const;
const SPRING_BOUNCY  = { response: 0.5, dampingFraction: 0.5 } as const;
const SPRING_GENTLE  = { response: 0.7, dampingFraction: 0.95 } as const;
void SPRING_SMOOTH;
```
`grep -rn SPRING_SMOOTH src/` returns only the definition and the `void` line. The four preset factories
consume `SPRING_BOUNCY` (×2), `SPRING_SNAPPY`, `SPRING_GENTLE` — **never `SPRING_SMOOTH`**. The `void
SPRING_SMOOTH;` statement exists solely to dodge `noUnusedLocals`. The module docstring (`:10`) claims
"the four `SPRING_*` constants mirror the glass-ui `--spring-*` token presets (smooth / snappy / bouncy /
gentle) — the single source of truth" — but `smooth` has no consumer, so the "single source of truth"
claim is aspirational, not shipped.

This is a textbook no-legacy residue: a `void`-suppressed dead binding advertised as if it were live.

**Proposal.** Either (a) delete `SPRING_SMOOTH` + the `void` line (honest: three springs are used), or
(b) if the glass-ui-token-mirror intent is real, ship a `springSmooth` factory that consumes it (honest:
four springs, four presets). NOT the `void` middle ground. Given S's no-dead-code charter, (a) unless a
demo/token consumer is identified.

---

### F4 — `classic.ts` still rides `LIBRARY_CEILING_OVERRIDE`; the keystone's *mechanism* survived (MEDIUM, cross-ref a05/a12)

**Evidence.** `presets/classic.ts` is 728L, over the 500L `.ts` decomposition ceiling
(`scripts/proof-decomposition.mjs:130`). It clears the gate only via a surviving override entry
(`proof-decomposition.mjs:139-155`): `["src/animation/presets/classic.ts", { cap: 750, why: "DATA-VOLUME
exception …" }]`. The R.W0 **keystone** (R.md §5) was unambiguous: *"DELETE the `LIBRARY_CEILING_OVERRIDE`
allowlist … the resulting reds ARE the decomposition backlog … REJECT the proposed budget/diff
meta-gate-governance machinery."* R.md §7 then carved the tension: *"the `presets/classic.ts` data-volume
case takes a documented override, NOT a forced 3-way split."*

The impl resolved §5-vs-§7 by keeping the `Map` reduced to **one** entry (classic.ts, fixed cap 750,
not a self-raising +1). That is a genuine improvement over Q's self-certifying caps — but the *machinery*
the keystone said to delete still exists, and the door it opens (a future carve hiding under a new
"documented" override) is exactly what §5 wanted shut. The comment even concedes it
(`:112` "R.W0 KEYSTONE (the gate-truth reset)") while retaining the Map.

The deeper miss: `classic.ts`'s 728L is **~54% raw CSS-string data** (34 preset constants). The
argument against a *cohesion* split is correct (F5 in a18's spirit — don't fragment a data list for a
line gate). But the SOTA move that satisfies *both* the keystone and §7 was never taken: **extract the
raw CSS strings to a data module** (`presets/classic-data.ts` as a flat `Record<string, string>`, or a
`.css`-imported blob) so `classic.ts` holds only the ~330L of *factory logic* and drops under 500
without an override *and* without a contrived taxonomy split. The gate would then measure algorithm, not
data — which is precisely what a line-count decomposition gate is *for*.

**Proposal.** S decomposition wave: split `classic.ts` into `classic-data.ts` (the 34 CSS-string
constants, pure data) + `classic.ts` (the factory functions over them). Delete the
`LIBRARY_CEILING_OVERRIDE` entry — and if that empties the Map, delete the Map (finishing the keystone).
Cross-ref a05/a12, who own the gate; this lane supplies the presets-specific disposition.

---

### F5 — `internal/index.ts` barrel has ZERO consumers — consistency-symmetry ceremony (MEDIUM, cosmetic)

**Evidence.** `internal/index.ts` (`internal/index.ts:11-18`) re-exports all eight members via
`export *`. It was added by R.W1 §2h explicitly *"for genuine consistency … internal/ is the sole
exception to the barrel rule across 10 zone directories"* (R.W1.md:467-477, 534-536). But no module
imports it: `grep -rn 'from "[^"]*internal"' src/ demo/ test/` returns **0**; all **44** internal imports
are deep-path (`from "../internal/leaves"`, `from "../internal/errors"`, …). The svg barrel, by contrast,
*is* consumed (`engine/public.ts:70,78`), and the presets barrel is consumed (`engine/public.ts:83`,
`load-engine.ts:101`, two test files). The internal barrel alone is dead.

The reason is structural, not incidental: the LIGHT/HEAVY re-export seam that justifies the *other*
barrels (the barrel is where a zone presents a curated surface to `loadAnimationEngine`) **does not apply
to `internal/`** — internal members are consumed as raw leaves by deep path, by design. R.md §2's
challenge lane flagged exactly this risk ("argue it on its merits, or give internal/ a barrel too for
genuine consistency … don't mis-cite the precedent"). R chose "give it a barrel" — and produced one
nobody imports. The consistency is cosmetic: the tree *looks* uniform, but the barrel carries no load.

**Proposal.** Delete `internal/index.ts`. It has no consumer, `export *` risks future accidental
name-collisions across eight unrelated leaves, and its existence mis-signals that `internal/` has a
curated surface it does not. If S instead wants a real internal barrel, it must first give it a *reason*
(a consumer that imports the zone as a unit) — absent that, deletion is the honest move. (This is the
inverse of a18's compile-barrel finding: there the barrel over-claimed; here it is simply unused.)

---

### F6 — `internal/` is a misnomer: it is the value.js-free LEAF zone and houses five PUBLIC exports (MEDIUM, gestalt)

**Evidence.** The prompt asks for `internal/`'s gestalt. Its members split into three unrelated kinds,
and — decisively — several are *public API*, contradicting the name:
- **Public exports off the `.` barrel:** `reducedMotionScale` + `ReducedMotionPolicy`
  (`index.ts:51-52` → `internal/reduced-motion`), `AnimationOptionError` + `UnknownEasingError`
  (`index.ts:128` → `internal/errors`).
- **Public export off the engine barrel:** `getAnimationId` (`internal/animation-id.ts`, re-exported for
  the published heavy surface, per its own header `:12`).
- **R.W2c DI ring-break seams (genuinely internal):** `group-factory.ts` (the neutral
  `registerGroupFactory`/`getGroupFactory` seam that breaks the engine↔group cycle) and `animation-id.ts`
  (moved out of engine so group/compile stop reaching back for a name) — these are honest, load-bearing
  R.W2c residents (a06's territory) and earn their place.
- **Pure value.js-free leaves:** `binarySearch.ts`, `leaves.ts` (rAF shims + the `@mkbabb/value.js/math`
  re-export), `scheduler.ts` (`yieldToMain`).
- **A data constant masquerading as a leaf:** `scroll-phases.ts` (`PHASE_FRACTIONS`, 16L) — a shared
  default-fraction table dissolving a scroll/compile duplication.

So `internal/` is really *"the zone with no static value.js grammar edge"* (enforced by the
`leaf-no-engine-no-valuejs` lint rule), NOT *"the private zone."* The name actively misleads: an author
grep-ing for the public `AnimationOptionError` finds it in a directory named `internal/`.

**Proposal (gestalt).** Rename `internal/` → `leaf/` (or `light-leaf/`) to name what it *is* — the
value.js-free leaf tier — resolving the "why is public API in internal/?" confusion. Do NOT sub-partition
it further into `leaf/di/`, `leaf/errors/`, etc.: at 9 small files the flat leaf zone is the right
altitude (over-zoning a leaf tier is the churn R.md §7 forbids). The one *content* cleanup: `reduced-motion.ts`
(162L) welds three concerns — the detector (`prefersReducedMotion`/`onReducedMotionChange`), the ONE gate
(`withReducedMotion`), and the public amplitude resolver (`reducedMotionScale`). It is under the ceiling
and cohesive-by-topic, so a split is optional; flag, don't force.

---

### F7 — `animate.ts` is fully orphaned dead code + 2 test files; the "stays reachable" justification is false (HIGH, S "no legacy" charter)

**Evidence.** R.W4 §2.5 (owner-ratified) excised `animate()` from the *published surface* but kept the
file, justified thus: *"The file stays (it is a HEAVY chunk loaded by `loadAnimationEngine`)"*
(R.W4.md:138), echoed verbatim in the shipped comment `index.ts:154-158` (*"`animate.ts` stays a HEAVY
chunk reachable via deep import"*). **This is false.** The built graph does not reach it:
- `grep -rn 'from "[^"]*\./animate"' src/ demo/ test/` → **only** `test/animate.test.ts` and
  `test/animate-orchestration.test.ts` (verified).
- `load-engine.ts:243-287`'s `Promise.all` lists engine/group/svg/ingest/scroll/compile/validate/presets/
  format/parse-flatten/scheduler — **no `./animate`**.
- No engine barrel (`engine/index.ts`, `engine/public.ts`) imports it; `public.ts:13` says "(minus
  `animate`, which R.W4 excised)".

So `animate.ts` (213L, with its own `AnimateInput`/`AnimateOptions`/`KeyframeMap`/`MotionPathInput` types
and the 6-way `isMotionPathInput`/`isKeyframeMap` dispatch) is imported by **nothing that ships**. It is
dead source kept alive only by two test files exercising a symbol no consumer can reach. FINAL.md
(`:21-22`) lists `animate()` under "removals … zero/near-zero-adoption trims," but the code was *de-exported*,
not *removed*. The tree still carries the full implementation.

This is the sharpest no-legacy violation in the lane: the exact "excise from surface but leave the body +
its tests" half-measure S's "NO legacy/deprecated code anywhere" charter exists to close.

**Proposal.** Delete `src/animation/animate.ts` and its two test files. The dispatch logic is not lost to
"the universe" as R.W4.md:136 claimed — it was *already* claimed to be reachable via `loadAnimationEngine`
and is not, so there is no reachability to preserve. If a future S wave wants a one-call front door, it
should be *authored onto the `./engine` subpath and dogfooded in ≥1 scene* (the promote-and-dogfood
alternative the owner declined 2026-06-24) — not resurrected as an unexported orphan. Until then, delete.

---

### F8 — the parse-that seam is gone; both CLAUDE.md files still document `utils.ts`/`@mkbabb/parse-that` (HIGH, docs-drift + dead-dep audit)

**Evidence.** The prompt asks whether `utils.ts` (the parse-that `any`-combinator seam) is still needed.
It is not — and the seam it named is fully gone:
- `utils.ts` does not exist (`ls src/animation/utils.ts` → No such file); it became
  `compile/parse-flatten.ts` (R.W1.md:268; a18 F10).
- `@mkbabb/parse-that` is **not a dependency at all**: `package.json` `dependencies` = `{"@mkbabb/value.js":
  "^1.2.0"}` only; not in `devDependencies` either (verified via node).
- No `src/` file imports parse-that: `grep -rn 'from "@mkbabb/parse-that"' src/` → 0. `parse-flatten.ts:125-128`
  records the removal: *"removes kf's direct `@mkbabb/parse-that` production."*

Yet the documentation still presents it as live:
- Project `CLAUDE.md` Dependencies table: *"`@mkbabb/parse-that` | Parser combinators; consumed directly
  only in `src/animation/utils.ts` (the `any` combinator over value.js's parsers — a cross-realm nominal-type
  seam)"* — false on three counts (no dep, no utils.ts, no consumer).
- `src/animation/CLAUDE.md` Files block lists `utils.ts` at the root and its Dependencies section names
  `utils.ts` as a value.js importer; the whole doc still documents the **pre-R flat layout** (`engine.ts`,
  `group.ts`, `animate.ts`, `animations.ts`, `format.ts` at root; `internal/` shown with 5 members, not the
  shipped 9). a18 F10 flagged the compile slice; this lane confirms the parse-that/utils.ts slice.

**Proposal.** (1) Answer recorded: `utils.ts` is obsolete post-5.x; the parse-that seam is gone. (2) Docs
wave: strike the `@mkbabb/parse-that` row from the project `CLAUDE.md` dependency table (or footnote it as a
*transitive* value.js dep if it survives there — but kf has no *direct* edge). (3) Regenerate
`src/animation/CLAUDE.md`'s Files/Classes/Dependencies from the shipped 7-zone tree (fold into the a12/a13
docs wave). (4) S should add a born-RED gate clause asserting no source references a non-existent
`utils.ts`/parse-that path — the drift recurred once (Q→R) and will recur again without a tripwire.

---

### F9 — the root mixes the LIGHT boundary with three marooned HEAVY modules (MEDIUM, gestalt)

**Evidence.** Post-R, `src/animation/` root holds (excluding the two `CLAUDE.md`s): the boundary pair
(`index.ts`, `load-engine.ts` — correct, these ARE the seam per project CLAUDE.md), the light seam
(`easing.ts` — LIGHT, value.js-free), `constants.ts` (the shared type home; see F10), and **three HEAVY
modules with no zone home**: `adapter.ts` (329L, value.js-bearing — `extractKeyframes`/`parseCSSStylesheet`,
imports `./resolve`), `validate.ts` (242L, value.js-bearing — imports `./engine`/`./compile`/`./waapi`),
and `animate.ts` (213L, F7's orphan). R's own tree comment ("`src/animation/` — nothing else but
`animation/` + `env.d.ts`") frames the root as a boundary, but three HEAVY zone-less modules loiter there.

`adapter.ts` is the *forward parse adapter* (`resolveKeyframes`: input → `ResolvedKeyframes`, the
`DiagnosticCode` enum). It is dependency-adjacent to `resolve/` (which it imports) and to `ingest/` (the
live-CSSOM analogue). `validate.ts` is the *forward validation verb* — a read-only projection over
`compile`/`adapter`/`waapi`. Neither belongs at the boundary root next to the light `easing.ts`.

**Proposal.** Home the HEAVY marooned modules so the root holds ONLY the boundary + the light seam:
- `animate.ts` → **deleted** (F7).
- `adapter.ts` → `resolve/adapter.ts` (it already imports `./resolve`; the forward-parse adapter is the
  resolve zone's public entry) OR a new `ingest/`-forward home if S unifies the forward-parse pipeline.
- `validate.ts` → `compile/validate.ts` (a18 F1's `compile/backward/` split makes `compile/` the natural
  home for the forward-validation verb) OR its own tiny `agent/` verb zone if S grows the agent surface.
- `easing.ts`, `constants.ts` stay (light seam + type home).

This is a gestalt cleanup, not a behavior change — the barrel/subpath re-export paths are unaffected
(they already reach these by deep path). Sequence it with F7/a18-F1 so import churn happens once.

---

### F10 — `constants.ts` is value.js-runtime-bearing but consumed type-only by LIGHT (INFO, verified-safe)

**Evidence.** `constants.ts:1-10` statically imports **runtime values** from `@mkbabb/value.js`
(`easeInOutCubic`, `timingFunctions`, `COLOR_SPACE_RANGES`) to build `defaultOptions`/`COLOR_SPACES`.
So the module carries a real value.js edge. The boundary holds only because **no LIGHT zone imports a
runtime value from it**: `grep` of `physics/`+`orchestration/` for non-type constants imports → 0 (every
light consumer uses `import type`, erased under `verbatimModuleSyntax`; `easing.ts:19` is `import type`).
The barrel re-exports from `constants` are all `export type` (`index.ts:134-148`).

It is safe as shipped, but `constants.ts` is a *mixed* file: the shared **type home** (needed by every
zone) welded to a value.js-bearing **defaults provider**. The safety rests entirely on discipline (no
light module importing a runtime const) rather than structure — a single future `import { defaultOptions }`
in a physics module would silently pull value.js onto the light path (the boundary gate would catch it,
but the file *invites* the mistake).

**Proposal.** Optional, low-priority: split `constants.ts` into `constants.ts` (pure types — light, no
value.js edge) + a HEAVY defaults module (`engine/defaults.ts`, the `defaultOptions`/`COLOR_SPACES`
runtime that needs value.js). This makes the light/heavy line structural rather than disciplinary. Flag,
don't force — the gate covers the risk today.

---

### F11 — `easing.ts` is the exemplary LIGHT boundary module — keep verbatim (INFO, positive)

**Evidence.** `easing.ts` is the model the other root files should aspire to. It is value.js-free at the
static edge, and its `resolveEasing` (`:76-97`) does the *narrow* dynamic import —
`import("./compile/easing-registry")`, **only** the timing-function registry chunk, not the full engine
(`:79`, "R.W1 narrow — not the full engine chunk; lib-support F7"). It is fail-explicit (throws
`UnknownEasingError` / rethrows chunk-load failure named, `:80-91`), with no identity fallback and no
resolver class (the docstring `:12-17` records the `EasingResolvable` anti-pattern it replaced). `cssTwinFor`
(`:50-55`) is reused honestly by `compile/easing-option.ts:12` and `engine/css-animation.ts:29` (verified).

No action. Recorded so S does not "clean up" a module that is already right, and as the reference bar for
F9's homing decisions.

---

## Ideal layouts (the design)

```
svg/                        # HEALTHY — HEAVY, real barrel; +F2 base class, +F1 fix
├── index.ts                # zone surface (consumed by engine/public.ts) — keep
├── handle.ts               # ← F2: abstract SVGAnimationHandle (play/pause/stop/finished)
├── motion-path.ts          # fromMotionPath + MotionPath extends handle (F1 fixed by base)
├── draw-svg.ts             # fromDrawSVG  + DrawSVG   extends handle
└── morph-svg.ts            # fromMorphSVG + MorphSVG  extends handle (+ sampleD/samples)

presets/                    # HEAVY, cohesive; +F3 dead-const delete, +F4 data-extract
├── index.ts                # 1:1 re-export barrel — keep
├── classic.ts              # factory LOGIC only (~330L, under 500 without override)
├── classic-data.ts         # ← F4: the 34 raw-CSS-string constants (pure data)
├── spring.ts               # F3: drop SPRING_SMOOTH + the `void` line
└── taxonomy.ts             # discovery index (honest re-org) — keep

leaf/                       # ← F6 rename of internal/ (the value.js-free leaf tier)
│                           #    F5: DELETE index.ts (zero consumers)
├── leaves.ts               # rAF shims + @mkbabb/value.js/math re-export
├── binarySearch.ts         # segment lookup
├── errors.ts               # AnimationOptionError/UnknownEasingError (PUBLIC) + parseOption
├── reduced-motion.ts       # detector + gate + reducedMotionScale (PUBLIC)
├── scheduler.ts            # yieldToMain
├── scroll-phases.ts        # PHASE_FRACTIONS data table
├── animation-id.ts         # getAnimationId (PUBLIC) — R.W2c ring-break seam
└── group-factory.ts        # register/getGroupFactory — R.W2c ring-break seam

src/animation/  (root = the boundary + the light seam ONLY)
├── index.ts                # LIGHT barrel + loadAnimationEngine re-export (boundary)
├── load-engine.ts          # dynamic half of the boundary
├── easing.ts               # LIGHT easing seam (the exemplar, F11)
├── constants.ts            # shared type home (F10: optionally split heavy defaults out)
├── adapter.ts   → resolve/ # ← F9 (forward-parse adapter; already imports ./resolve)
├── validate.ts  → compile/ # ← F9 (forward-validation verb over compile/adapter/waapi)
└── animate.ts   → DELETED  # ← F7 (orphaned dead code + 2 test files)
```

**Rejected: sub-partitioning `leaf/`.** At 9 small files the flat leaf tier is the right altitude;
`leaf/di/`+`leaf/math/`+`leaf/errors/` would be the over-zoning R.md §7 forbids.
**Rejected: splitting `morph-svg.ts` (471L).** It is one cohesive concern (sample → pair → interpolate →
reassemble); the largest svg file but a sealed unit, like a18's `FrameCompiler` verdict.

---

## Tranche-S implications

Wave-shaped, ordered so import churn happens once:

1. **S-wave "no-legacy sweep — the lane's two dead bodies" (F7 + F3 + F8).** Delete `animate.ts` +
   `test/animate.test.ts` + `test/animate-orchestration.test.ts`; delete `SPRING_SMOOTH` + the `void`
   line in `presets/spring.ts`; strike the `@mkbabb/parse-that`/`utils.ts` documentation from both
   CLAUDE.md files. Born-RED a gate clause: *no source or test imports `./animate`*, and *no doc/source
   references a `utils.ts` or `@mkbabb/parse-that` path*. This is the highest-charter-value wave in the
   lane — two dead implementations and a dead-dependency doc, all under "NO legacy/deprecated code
   anywhere."

2. **S-wave "svg family closure" (F1 + F2).** Add `svg/handle.ts` (abstract `SVGAnimationHandle` with
   play/pause/stop/finished); make the three factory classes extend it. Closes the `MotionPath.finished`
   asymmetry *by construction*. Verify via a targeted test that all three handles expose `.finished`.

3. **S-wave "presets data-extraction + finish the keystone" (F4).** Split `classic.ts` → `classic-data.ts`
   (the 34 CSS-string constants) + `classic.ts` (factory logic, now <500). Delete the
   `LIBRARY_CEILING_OVERRIDE` entry; if the Map empties, delete the Map (completing R.W0 §5's
   "delete the machinery"). Coordinate with a05/a12 (they own the gate). This is the SOTA answer to the
   §5-vs-§7 tension the impl finessed with a surviving override.

4. **S-wave "leaf zone gestalt" (F5 + F6).** Delete the unused `internal/index.ts` barrel. Rename
   `internal/` → `leaf/` (or `light-leaf/`) to name the value.js-free leaf tier and resolve the
   "public API in a directory called internal/" confusion. Retarget the 44 deep-path imports (mechanical).
   Optionally split `reduced-motion.ts`'s three concerns — flag, don't force.

5. **S-wave "root = boundary only" (F9, sequenced with a18-F1).** Home `adapter.ts` → `resolve/`,
   `validate.ts` → `compile/` (after a18's `compile/backward/` lands, so `compile/` is the settled
   forward+backward home). Leaves the root as `index`/`load-engine`/`easing`/`constants` — the true
   boundary + light seam. No behavior change; the subpath/barrel deep-paths absorb the move.

6. **Optional / low-priority (F10).** Split `constants.ts` into a light type-home + a heavy defaults
   module (`engine/defaults.ts`) so the light/heavy line is structural, not disciplinary. Defer unless S
   is already touching `constants.ts`.

**Method critique for the owner.** This lane exposes a specific R failure pattern: **"excise from the
surface, keep the body, and narrate it as removed."** `animate.ts` (F7) is the clean case — R.W4's own
spec asserted the file "stays reachable via `loadAnimationEngine`" and FINAL.md called it a "removal," but
the code is reachable by *nothing that ships* and was never removed. The parse-that dependency (F8) is the
same pattern in the docs: the seam was deleted in code but left standing in two CLAUDE.md files. And the
`internal/` barrel (F5) is the inverse — a structure added "for consistency" that carries zero load. All
three are invisible to R's green source-shape gates: no gate checks that a *retained* file is *reached*,
that a *documented* dependency is *installed*, or that an *added* barrel is *imported*. S's decomposition
and no-legacy waves should be driven by the **import/dependency graph and the shipped `package.json`**, not
by file presence — and should add three tripwire clauses: *(a) every non-test source file is reachable from
the barrel or a test; (b) every CLAUDE.md-documented dependency is in `package.json`; (c) every zone barrel
has ≥1 importer.* Those three would have caught all of F5/F7/F8 at R's close.
