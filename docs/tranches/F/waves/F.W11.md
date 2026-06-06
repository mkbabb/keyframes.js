# F.W11 — The boundary cohesion folds (presets onto the heavy barrel · the 4× clamp convergence · group.ts's inverted-tier lerp)

**Phase:** IMPL · **Class:** PATCH (the published library — three isomorphic cohesion
folds: one export-plumbing reachability fix + two byte-identical convergence retargets; no
new behaviour, no changed pixel) · **Scope:** `src/animation/index.ts` +
`src/animation/engine.ts` (the heavy re-export hub) + `README.md` (the preset barrel);
`src/animation/{smooth,timeline,waapi,spring}.ts` (the 4× clamp) + `src/animation/group.ts`
(the inverted-tier lerp) — Band 3, the architecture-cohesion folds · **DAG: F11 is
INDEPENDENT** (`F.md §The DAG` — the arch folds share no surface with F9's
transport or F10's dogfood; runs in parallel within Band 3) · **Gated on:** keyframes' own
green CI (inv-27).

**Title.** *Three corners the codebase's own convergence passes missed: 870L of presets on
no barrel (the README's most-copied import resolves nothing), `clamp` open-coded four ways
beside its canonical `leaves.clamp`, and a heavy module borrowing the light-side value.js
shadow for one `lerp`. Converge them — isomorphic, byte-identical.*

The post-E architecture is exemplary and F manufactures no work where it leads
(`a-boundary-arch-F §ALREADY-SOTA` — the boundary, the FrameCompiler split, the easing
seam, the single-authority `reduced-motion`/`playback`, the heavy re-export hub are all
LEAVE). These three are the corners that missed the prior convergence passes: the E D-1
preset fold SLIPPED, `clamp` is the one leaf that has a canonical home but never got the
`reduced-motion.ts`-style convergence, and `group.ts` reaches across the tier for a `lerp`
it could take from value.js directly. Each is the codebase's OWN convergence idiom applied
to the spot it skipped.

**The Mandate spine (binding — `F.md §Mandate`).** NO quick solution / NO
workaround: route presets through the HEAVY surface (they are value.js-bearing — they
cannot sit on the light static barrel without reddening `proof:boundary`); converge the
clamp through `leaves.clamp` (the codebase's own idiom), NOT a new `clamp01` spelling.
NO legacy: a replaced surface replaced in one motion — the 4× open-coded clamps are
REMOVED, not left beside the leaf; `group.ts`'s `leaves.lerp` import is RETARGETED, not
dual-sourced. Measure-first does not bind (zero hot-path cost — the leaf is a trivial
`Math.min(Math.max())` the JIT inlines identically, `a-boundary-arch-F F-A2`).
Isomorphic/byte-identical: the inlined clamp expressions ARE `clamp`'s body; `leaves.lerp`
is byte-equivalent to value.js's `lerp` (`leaves.ts:14-16`); the presets already run, only
their reachability changes. inv ε: every claim cites `file:line` against live
`tranche-e-impl`.

**Provenance.** `a-boundary-arch-F F-A3` (`animations.ts` on no barrel — the D-1 fold still
live, SHIP-in-F heavy surface), `a-boundary-arch-F F-A2` (`clamp` open-coded 4× while
`leaves.clamp` exists, SHIP-in-F), `a-boundary-arch-F F-A4` (`group.ts` borrows `leaves.lerp`
for one call, SHIP-in-F tidy).

---

## § State, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`:

1. **`animations.ts` (870L of presets) is on NO barrel — the README import resolves
   nothing.** Verified: `grep -n animations src/animation/index.ts` → 0 hits (the package
   barrel does not re-export them). `engine.ts`'s tail re-export hub (`engine.ts:1169-1179`)
   re-exports `AnimationGroup`, `getTimingFunction`, `resolveKeyframes`, the option
   constants — but NOT `animations`. The `loadAnimationEngine` `AnimationEngine` interface
   (`index.ts:130-149`) lists `Animation`/`CSSKeyframesAnimation`/`AnimationGroup`/
   `getAnimationId`/`getTimingFunction`/`resolveKeyframes`/`animate`/the constants — but NOT
   the presets, and `loadAnimationEngine` (`index.ts:169-177`) merges `engine` + `animate`
   with no `animations`. So the README's most-copied snippet — `import { fadeIn, bounce,
   spinner } from "@mkbabb/keyframes.js"` (`README.md:288`, `const anim = fadeIn({ duration:
   500 })` `:290`) — hits a resolution FAILURE for a published consumer. The presets are
   correct, tested, and exist; they are simply not on the export surface (the E
   `a-kf-api-dx` D-1 fold dispositioned FOLD-E and SLIPPED, `a-boundary-arch-F F-A3`).

2. **`clamp` is open-coded FOUR ways beside `leaves.clamp`.** `internal/leaves.ts:23-25`
   exports a correct `clamp(value, min, max)` (the value.js-free leaf, the single intended
   home). Yet the light surface re-inlines it (verified):
   - `smooth.ts:78` — `target = Math.max(0, Math.min(1, target));`
   - `smooth.ts:132` — `this.currentValue = Math.max(0, Math.min(1, this.currentValue));`
   - `timeline.ts:34` — `const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));`
     (a FOURTH named local duplicating `leaves.clamp(v, 0, 1)`)
   - `waapi.ts:225` — `offset: Math.max(0, Math.min(1, t / duration))`
   - `spring.ts:110` — `const dampingFraction = 1 - Math.min(1, Math.max(-1, bounce));`
     (a `[-1,1]` clamp — the same shape, different bounds)

   Meanwhile the modules that DO import `leaves.clamp` are `numeric.ts:4`, `stagger.ts:28`,
   `sequence.ts:59` (and `playback.ts` per `a-boundary-arch-F F-A2`). So the leaf is adopted
   in exactly half the light surface and open-coded in the other half (`a-boundary-arch-F
   F-A2`).

3. **`group.ts` (HEAVY) borrows `internal/leaves.lerp` for ONE call.** `group.ts` is a
   HEAVY module — it imports `ValueUnit` from `@mkbabb/value.js` directly (`group.ts:1`) and
   is reached only via `loadAnimationEngine` (it's in `engine.ts`'s re-export,
   `engine.ts:1169`). Yet it ALSO imports `lerp` from the light-side value.js-shadow
   (`group.ts:2` `import { lerp } from "./internal/leaves"`) for a SINGLE call site — the
   `weighted` blend at `group.ts:284` (`existing.value = lerp(...)`, the `:271-273` comment
   block). An inverted-tier import: a value.js-bearing module reaching into the
   value.js-AVOIDANCE leaf for a helper it could take from value.js itself
   (`a-boundary-arch-F F-A4`).

The wave's job: route presets through the heavy `AnimationEngine` surface +
`loadAnimationEngine` + README reconcile; converge the 4× clamp through `leaves.clamp`;
retarget `group.ts`'s one `lerp` to `@mkbabb/value.js` — each isomorphic/byte-identical,
closed by a re-runnable gate that BITES.

---

## § Goal

**What lands** (three isomorphic cohesion folds — `proof:boundary` + `proof:idioms` green):
- **Presets on the heavy surface.** `animations.ts` re-exported through the heavy
  `engine.ts` tail hub (`engine.ts:1169-1179`) + added to the `AnimationEngine` interface
  (`index.ts:130-149`) + merged into `loadAnimationEngine`'s resolved object
  (`index.ts:169-177`), so `const { fadeIn } = await loadAnimationEngine()` resolves. The
  README reconciled to the real surface (the heavy path, or the `animate(el, fadeIn())`
  front-door form which is already wired, `animate.ts`).
- **The 4× clamp converged onto `leaves.clamp`.** Every light-side open-coded clamp routed
  through `leaves.clamp` — `clamp(target, 0, 1)` for the `[0,1]` cases (`smooth.ts:78,132`,
  `timeline.ts:34`, `waapi.ts:225`), `clamp(bounce, -1, 1)` for the spring case
  (`spring.ts:110`); the `timeline.ts:34` `clamp01` local DELETED. (Optionally a `clamp01`
  named export on `leaves.ts` if the `(v) => clamp(v, 0, 1)` shape's 4× recurrence wants a
  name, `a-boundary-arch-F F-A2`.)
- **`group.ts`'s `lerp` retargeted to value.js.** `group.ts:2`'s `import { lerp } from
  "./internal/leaves"` retargeted to `@mkbabb/value.js` (the canonical copy it shadows,
  consistent with `group.ts:1`'s already-heavy posture); `leaves.ts`'s consumer set becomes
  purely light, restoring the leaf's invariant ("only light modules import me").
- **`proof:idioms`** (the clamp-convergence + the inverted-tier grep) + a preset-import
  smoke (`const { fadeIn } = await loadAnimationEngine()` resolves) wired into CI.

**Why:** a documented surface that does not resolve is a maintenance lie (the README's
most-copied import fails for a published consumer, `a-boundary-arch-F F-A3`); four spellings
of `clamp01` is a latent correctness surface (a future edit to the clamp contract — e.g.
NaN handling — must find four sites, not one, `a-boundary-arch-F F-A2`); a heavy module in
the light-shadow's consumer set is a lie the gate doesn't catch (the leaf's consumer set IS
the load-bearing documentation of the boundary, `a-boundary-arch-F F-A4`). Each fold is the
codebase's OWN convergence idiom (the `reduced-motion.ts` collapse, the single `RAFPlayback`
owner) applied to the corner it skipped — isomorphic, byte-identical.

---

## § Scope

### S1 — Route `animations.ts` through the heavy surface + reconcile the README (`a-boundary-arch-F F-A3`) — SHIP-in-F

**WHAT:** add `animations` to the heavy engine surface — re-export from `engine.ts`'s tail
hub (`engine.ts:1169-1179`, beside `AnimationGroup`/`getTimingFunction`), add the preset
names (or a `presets` namespace) to the `AnimationEngine` interface (`index.ts:130-149`),
and ensure `loadAnimationEngine` (`index.ts:169-177`) surfaces them in its resolved object
so `const { fadeIn } = await loadAnimationEngine()` resolves. Reconcile `README.md:288-290`
to the REAL surface: either the heavy path (`const { fadeIn } = await loadAnimationEngine();
const anim = fadeIn({ duration: 500 })`) or the `animate(el, fadeIn())` front-door form
(`animate.ts` is wired). Do NOT put the presets on the LIGHT static barrel (see §Design
decisions 1).

**WHY:** the presets return `CSSKeyframesAnimation` (value.js-bearing), so they cannot sit
on the light static barrel without reddening `proof:boundary` (`a-boundary-arch-F F-A3`
§wrinkle) — their correct home is the heavy surface. The E D-1 fold dispositioned this and
SLIPPED; landing it makes the README's documented `import { fadeIn }` real. Pure export
plumbing, zero hot-path cost, isomorphic (the presets already run; only reachability
changes).

### S2 — Converge the 4× clamp through `leaves.clamp` (`a-boundary-arch-F F-A2`) — SHIP-in-F

**WHAT:** route every light-side open-coded clamp through `leaves.clamp` (already exported
`leaves.ts:23`): `smooth.ts:78` and `:132` → `clamp(target, 0, 1)` / `clamp(this.currentValue,
0, 1)`; `timeline.ts:34` → DELETE the `clamp01` local, replace its callsites with
`clamp(v, 0, 1)`; `waapi.ts:225` → `clamp(t / duration, 0, 1)`; `spring.ts:110` →
`clamp(bounce, -1, 1)` (the `[-1,1]` case). Import `clamp` from `./internal/leaves` in each
module that doesn't already. (Optionally add a `clamp01` named export on `leaves.ts` — the
`(v) => clamp(v, 0, 1)` shape appears 4×, so it plausibly wants a name; the wave's one small
discretionary call.)

**WHY:** this is the exact "one concept, N spellings" the codebase has surgically eliminated
(`reduced-motion.ts` collapsed three `prefersReducedMotion()` copies into one authority;
`playback.ts` is THE single rAF owner, `a-boundary-arch-F F-A2`). `clamp` is the one leaf
that HAS its canonical home (`leaves.ts:23`) but never got the convergence pass. Four
spellings is a latent correctness surface — a clamp-contract edit must find four sites.
Byte-identical (the inlined `Math.max/min` expressions ARE `clamp`'s body), zero hot-path
cost (the JIT inlines the leaf identically).

### S3 — Retarget `group.ts`'s `lerp` to value.js (`a-boundary-arch-F F-A4`) — SHIP-in-F

**WHAT:** change `group.ts:2`'s `import { lerp } from "./internal/leaves"` to import `lerp`
from `@mkbabb/value.js` (consistent with `group.ts:1`'s `ValueUnit` import from value.js —
`group.ts` is heavy, reached only via `loadAnimationEngine`). The single call site
(`group.ts:284`) is unchanged. `leaves.ts`'s consumer set becomes purely light.

**WHY:** `group.ts` is a HEAVY module — it already pulled value.js (`group.ts:1`); the
canonical `lerp` is right there. The `internal/leaves.ts` shadow exists ONLY to keep LIGHT
modules value.js-free (`leaves.ts:1-12`); a heavy module consuming it gains nothing (it's
already heavy) and muddies the tier story — a reader auditing "who depends on the
light-shadow" finds a heavy module, contradicting the leaf's stated purpose
(`a-boundary-arch-F F-A4`). Byte-identical (`leaves.lerp` is "kept byte-for-byte equivalent
to value.js's lerp", `leaves.ts:14-16`); one import line moves. It clarifies the tier graph
— the leaf's consumer set is load-bearing documentation the `proof:boundary` gate only
checks in the LIGHT direction.

> **BOOK in this band (named, NOT this wave) — `a-boundary-arch-F`:**
> - **The boundary is gated but not DOGFOODED** (`a-boundary-arch-F F-A1` / charter `E7`,
>   `NEW-19`) — the demo + tests reach `@src/animation/*` (90 deep imports, 0 through the
>   barrel, 0 `loadAnimationEngine` calls); the boundary is proven by a synthetic bundle,
>   never consumed by a first-party caller. **BOOK** (the demo migration is a demo-wide
>   import refactor deserving a design note); the minimal SHIP — a dist-barrel smoke that
>   imports the built barrel and `await`s `loadAnimationEngine()` once — is the cheap 80%,
>   recorded as a standalone gate add. NOT folded here (F11 is the three isomorphic cohesion
>   folds; the dogfood-the-barrel migration is a separate, larger axis).
> - **`internal/` conflates leaves + platform glue + the error seam** (`a-boundary-arch-F
>   F-A5`) — **RECORD** (a naming observation; the reorg churn-vs-clarity trade is negative
>   at 5 files / ~356L; at most a one-line `CLAUDE.md` wording fix, not a wave).
> - **The value.js parser-free leaf-math sub-path** (`a-boundary-arch-F F-A6`) —
>   **value.js-HANDOFF** (re-confirm + widen handoff Wave F6: a `@mkbabb/value.js/math`
>   tree-shakeable leaf entry would let kf DELETE `internal/leaves.ts` and static-re-export
>   the canonical math — the cleaner terminal form of S2/S3). inv-16: propose, never write.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real test/grep/boundary check,
not an assertion):

1. **Preset reachability — `loadAnimationEngine()` surfaces the presets (S1).** A
   preset-import smoke asserts `const { fadeIn } = await loadAnimationEngine()` resolves and
   `fadeIn({ duration: 500 })` returns a `CSSKeyframesAnimation`. **BITE:** remove the
   `animations` re-export from `engine.ts`/the `AnimationEngine` interface → `fadeIn` is
   `undefined` and the smoke reds. Reds today (the presets are on no barrel — verified State
   1). The README snippet (`README.md:288`) matches the now-resolving surface.

2. **`proof:boundary` HOLDS — presets route through the HEAVY surface (S1).** `proof:boundary`
   (`scripts/proof-boundary.mjs`) stays green: the presets are NOT on the LIGHT static barrel
   (they are value.js-bearing); they ride `loadAnimationEngine`'s heavy chunk. **BITE:** put
   the presets on the LIGHT barrel (a static `export … from "./animations"` in the light
   section of `index.ts`) → `proof:boundary` reds (a value.js edge on a light entry).

3. **`proof:idioms` — the clamp is converged + the tier graph is clean (S2/S3).** A grep
   gate asserts ZERO open-coded `Math.max(0, Math.min(1, ...))` / `Math.min(1, Math.max(-1,
   ...))` in the light surface (`smooth`/`timeline`/`waapi`/`spring`) — every clamp routes
   through `leaves.clamp` — AND that `leaves.ts`'s importer set contains NO heavy module
   (`group.ts` no longer imports `leaves.lerp`). **BITE:** re-inline a `Math.max(0,
   Math.min(1, ...))` in `smooth.ts` → the clamp-convergence grep reds; restore `group.ts`'s
   `leaves.lerp` import → the inverted-tier grep reds.

4. **Byte-identical / no-regression — the folds move zero pixels.** `npm test` stays green;
   the clamp convergence is byte-identical (the inlined expressions ARE `clamp`'s body) and
   `group.ts`'s `lerp` is byte-equivalent (`leaves.ts:14-16`); the presets already run, only
   their reachability changed. **BITE:** any interpolation/smooth/timeline/spring/group test
   regression reds (the folds are not byte-identical if a test moves).

---

## § Folds

Retires (by finding id):
- **`a-boundary-arch-F F-A3`** (`animations.ts` on no barrel — the D-1 preset fold still
  live) — S1 + gate clauses 1/2.
- **`a-boundary-arch-F F-A2`** (`clamp` open-coded 4× while `leaves.clamp` exists) — S2 +
  gate clause 3.
- **`a-boundary-arch-F F-A4`** (`group.ts` borrows `leaves.lerp` for one call — the
  inverted-tier import) — S3 + gate clause 3.

**Routed OUTWARD / RECORDED (not this wave):**
- **`a-boundary-arch-F F-A1`** (the boundary gated but not dogfooded) — **BOOK** (demo
  migration) + a SHIP-able dist-barrel smoke recorded as a standalone gate add.
- **`a-boundary-arch-F F-A5`** (`internal/` conflates leaves + platform glue) — **RECORD**
  (no reorg; the churn-vs-clarity trade is negative at this size).
- **`a-boundary-arch-F F-A6`** (the value.js parser-free leaf-math sub-path) —
  **value.js-HANDOFF** (re-confirm + widen Wave F6 — the terminal form that dissolves
  `internal/leaves.ts` entirely).

---

## § Design decisions

1. **Presets go on the HEAVY surface — NOT the light barrel.** RESOLVED: the presets return
   `CSSKeyframesAnimation`, which is value.js-bearing, so they cannot sit on the light static
   barrel without reddening `proof:boundary` (`a-boundary-arch-F F-A3` §wrinkle — the exact
   reason D-1 was non-trivial). Their correct home is the `AnimationEngine` interface +
   `loadAnimationEngine`'s resolved object, so `const { fadeIn } = await
   loadAnimationEngine()` resolves while the boundary stays intact (gate clause 2). The
   README reconciles to the heavy path or the `animate(el, fadeIn())` front-door form.
   Trade-off: the README's current snippet (`import { fadeIn } from "@mkbabb/keyframes.js"`)
   is the most ergonomic shape but is impossible without breaking the boundary — so the
   honest move is to make the README match the real (heavy) surface, not to break the
   boundary to match the README.

2. **Converge clamp through `leaves.clamp` — the codebase's own idiom, NOT a new spelling.**
   RESOLVED: the convergence routes every clamp through the EXISTING `leaves.clamp`
   (`leaves.ts:23`), the same motion that produced the single-authority `reduced-motion.ts`
   and `playback.ts` (`a-boundary-arch-F F-A2`). It is byte-identical (the inlined
   expressions ARE `clamp`'s body) and zero hot-path cost (the JIT inlines identically). The
   one discretionary call — whether to add a `clamp01` named export — is left to the
   implementer (the `(v) => clamp(v, 0, 1)` shape appears 4×, so it plausibly wants a name;
   either way the convergence onto `leaves` is the fold). Trade-off: none — this is the
   cleanest, lowest-risk architectural tidy in the band (`a-boundary-arch-F F-A2`).

3. **`group.ts` takes `lerp` from value.js — restoring the leaf's invariant.** RESOLVED:
   `group.ts` is already heavy (`group.ts:1` imports `ValueUnit` from value.js); the
   canonical `lerp` is right there. Retargeting the one `leaves.lerp` import to value.js is
   byte-identical (`leaves.ts:14-16` promises byte-equivalence) and makes `leaves.ts`'s
   consumer set purely light — restoring the leaf's stated invariant ("only light modules
   import me", the load-bearing tier documentation). Trade-off: it's a one-line tidy that
   looks cosmetic — but the leaf's consumer set IS the boundary documentation the
   `proof:boundary` gate only checks in the light direction, so a heavy consumer in it is a
   lie no gate catches (`a-boundary-arch-F F-A4`); the retarget closes it.

4. **All three are isomorphic/byte-identical — measure-first does not bind.** RESOLVED:
   these are cohesion folds, not perf claims — the clamp leaf is a trivial `Math.min(Math.max())`
   the JIT inlines identically, the `lerp` is byte-equivalent, the presets already run. So
   no bench gates them; the gate is the byte-identical no-regression lock (clause 4) + the
   reachability/convergence greps (clauses 1–3). The folds prove themselves by what they
   leave unchanged (every pixel) as much as by what they converge (the export surface, the
   four clamp sites, the one inverted import).
