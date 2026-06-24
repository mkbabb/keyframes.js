# Tranche R — Retro: audit ALL Tranche Q changes

**Lane:** `retro-q-changes`
**Scope:** every change Q made (impl-drive `a5ed6bc..a15cd48`, on top of 4.4.0 `c69bbb0`).
**Verdict in one line:** Q shipped real value (SoA compositor, value.js 1.2.0 consume, MorphSVG, the 5.0.0 `@deprecated` drop) BUT its headline "decomposition close" is **superficial line-shuffling justified by a self-referential ceiling allowlist** — engine.ts is still a 1420-line god-module, and Q deepened the flat-hyphenated-sibling anti-pattern instead of building real directory sub-modules. The `internal/` directory already proves the project knows how to do directory sub-modules; the engine/group/spring families were denied that treatment.

---

## 0. The Q changeset surface

`git diff --stat a5ed6bc~1 a15cd48 -- src/`: 24 files, +2276/-786. Files ADDED:

```
src/animation/engine-playback.ts          (484L)
src/animation/group-soa.ts                (254L)
src/animation/waapi-densify.ts            (287L)
src/animation/frame-compiler-numeric.ts   (77L)
```

All four are flat hyphenated siblings in `src/animation/` (no new directory). The flat pattern is NOT Q's invention — `git log --diff-filter=A --follow` shows:
- `engine-composition.ts`, `engine-options.ts`, `group-layer-springs.ts` first appeared at **K** (`5a906a7` "engine.ts/group.ts split under base ceilings").
- `engine-css-metadata.ts`, `spring-duration.ts`, `spring-reseat.ts` first appeared at **L** (`e42a95b`, `d7c7f3d`).
- Q (`b246872`, `aab1a6f`) **extended** it with four more.

So the anti-pattern is a 3-tranche (K→L→Q) accretion, and Q's commit message literally calls these "the fourth `engine-*.ts`" / "the third SoA-style extraction" — it is *aware* it is growing a flat family and treats that as a feature.

---

## 1. CRITICAL — `proof:decomposition` is a self-justifying ceiling allowlist (gate-theater)

**File:** `scripts/proof-decomposition.mjs:119-355`

The gate has a base `LIBRARY_CEILING = { ".vue": 350, ".ts": 550 }` and then a `LIBRARY_CEILING_OVERRIDE` map (line 128) where **every god-module gets a per-file cap set JUST ABOVE its current line count**, with a prose `why` rationale:

| file | actual L | override `cap` | margin |
|---|---|---|---|
| engine.ts | 1420 | **1450** | +30 |
| animations.ts | 886 | 900 | +14 |
| group.ts | 924 | 925 | +1 |
| spring.ts | 685 | 700 | +15 |
| waapi.ts | 579 | 650 | +71 |
| frame-compiler.ts | 616 | 640 | +24 |
| resolve-values.ts | 796 (was 578 at split) | 600 | — see note |
| load-engine.ts | 559 | 580 | +21 |

The gate "EXIT 0 / FULLY GREEN" that Q's `b246872` celebrates is structurally incapable of biting: each cap was authored to sit "just above the measured post-split floor" (the literal phrasing repeated at lines 162, 213, 240, 271, 299, 327, 352). The gate cannot fail on the *named* files because the ceiling tracks the file. This is the textbook self-certifying gate — green by construction, not by improvement.

**Note on resolve-values.ts:** the override `cap:600` (line 307) claims the file is "578L," but the working tree is **796L** (`wc -l`). Either the gate is now RED on this file (and the green claim is stale) or the cap was bumped elsewhere — either way the cap/file relationship the gate advertises is already drifted. R must re-measure: this is a live inconsistency, not just theater.

**engine.ts cap=1450 is the most egregious:** the `why` (lines 133-167) is a ~35-line essay arguing the 1420-line file is an irreducible "cohesive gestalt" and "splitting them further for line-count severs that seam (the legacy-shape the Mandate forbids)." That argument is doing real rhetorical work to *prevent* decomposition — it inverts the decomposition mandate into a justification for NOT decomposing. The class body did drop 1297→1058L by lifting playback out (real), but the FILE is 1420L and the gate's job (flag god-modules) is defeated.

**R proposal:** DELETE the `LIBRARY_CEILING_OVERRIDE` allowlist. Replace with a single hard ceiling (e.g. 550 .ts) and make the gate fail RED on every file currently over it — engine.ts, animations.ts, group.ts, spring.ts, frame-compiler.ts, sequence.ts, resolve-values.ts, scroll-scene.ts, load-engine.ts, waapi.ts. Those reds are the R decomposition backlog. A ceiling that is raised to match the file it measures is not a ceiling.

---

## 2. CRITICAL/HIGH — `engine-playback.ts` is a leaky god-host cast, not a cohesive extraction

**Files:** `src/animation/engine-playback.ts:50-100, 918`; `src/animation/engine.ts:872-1004`

Q's flagship split lifts the play lifecycle into `engine-playback.ts` via a `PlaybackHost` protocol. But:

1. **The protocol exposes ~35 members** (engine-playback.ts:50-100), including private engine internals: `_interpOut`, `_boundFrame`, `_playingPromise`, `resolvePromise`, `_waAnimations`, `playback` (the RAFPlayback handle), plus run-state clocks and the entire sampling/fill seam. The "contract" the doc-comment celebrates ("a play function reaches ONLY these members") is nearly the whole class.

2. **The host is acquired by a type-escape cast** — `engine.ts:917-918`:
   ```ts
   private get _host(): PlaybackHost<V> {
       return this as unknown as PlaybackHost<V>;
   }
   ```
   `this as unknown as PlaybackHost` defeats the protocol entirely: there is no structural decoupling, the class IS the host. The cast is a lie that says "trust me, this matches."

3. **The class methods are pure pass-throughs** (engine.ts:877-1004): `play() { return playback.play(this._host) }`, `pause() { playback.pause(this._host) }`, etc. — 18 one-line delegates. No behavior moved to a boundary; the lines moved to a file, the call sites stayed.

This is the superficial decomposition the R brief predicted: line-count went down, coupling did not. A genuine extraction would pass an *explicit, minimal* driver interface (the way `group-soa.ts` does — see §4), not `this as unknown as`.

**R proposal:** Either (a) KEEP the split but REWORK it — replace the god-`PlaybackHost`/`this as unknown` with an explicit minimal driver surface (the play loop needs the clock fields + `advanceTo` + `interpFrames` + the fill verbs; it does NOT need to see `_interpOut`/`_boundFrame` — those are the engine's private buffer discipline and should be encapsulated behind a `renderTick()` method), OR (b) accept it as cosmetic and fold it back, then do the *real* engine decomposition into an `engine/` directory (§3). Do not let the `this as unknown as PlaybackHost` cast survive R.

---

## 3. HIGH — the flat-hyphenated-sibling families are the decomposition R must actually do

**Files:** all of `src/animation/` (50 `.ts` files, ONE subdir `internal/`).

The tree is flat. Clear families exist that should be directory sub-modules (the `internal/` dir is the proven precedent — it holds `binarySearch.ts`, `errors.ts`, `leaves.ts`, `reduced-motion.ts`, `scheduler.ts` and is imported as `./internal/errors`):

| family | flat siblings today | proposed dir |
|---|---|---|
| engine | engine.ts (1420), engine-composition.ts (221), engine-css-metadata.ts (148), engine-options.ts (193), engine-playback.ts (484) | `engine/` |
| group | group.ts (924), group-layer-springs.ts (236), group-soa.ts (254) | `group/` |
| spring | spring.ts (685), spring-duration.ts (83), spring-reseat.ts (98), springLinearStops.ts (73), springTimingFunction.ts (120) | `spring/` |
| frame-compiler | frame-compiler.ts (616), frame-compiler-numeric.ts (77) | `frame-compiler/` |
| waapi | waapi.ts (579), waapi-densify.ts (287) | `waapi/` |
| compile | compile.ts (535), compile-color.ts (325) | `compile/` |
| ingest | ingest.ts (348), ingest-cssom.ts (466) | `ingest/` |
| sequence | sequence.ts (698), sequence-events.ts (216) | `sequence/` |

All the `-soa`/`-densify`/`-numeric`/`-composition`/`-options`/`-css-metadata`/`-playback`/`-layer-springs` siblings are **pure-internal** (NOT re-exported from `index.ts` — grep confirmed zero barrel hits), so moving them into directories is a zero-public-API-change refactor. The barrel `index.ts` can keep re-exporting `engine/index.ts`.

**Naming inconsistency inside a single family:** the spring family mixes conventions — `spring-duration.ts`/`spring-reseat.ts` (kebab) sit beside `springLinearStops.ts`/`springTimingFunction.ts` (camelCase). `internal/` has the same split (`binarySearch.ts` camel vs `reduced-motion.ts` kebab). R should normalize to one convention per move.

**R proposal:** REWORK — collapse each family into a real directory with an `index.ts` barrel. Then re-run the *real* (un-allowlisted) ceiling gate inside each directory: `engine/engine.ts` at 1420L still reds and must be genuinely carved (the compile-facade vs the subclass vs the element-aware Phase-2 pass are three plausible files). The directory move is mechanical; the engine.ts internal carve is the hard, real work the override has been deferring D→E→F→…→Q.

---

## 4. KEEP — `group-soa.ts` is the model of a GOOD extraction (contrast with §2)

**File:** `src/animation/group-soa.ts:46-95`

This is what a cohesive extraction looks like and should be the template for reworking §2:
- It exports three *whole, self-contained* units: `SoALayerPlan` (a precomputed plan type), `buildSoAPlans` (plan builder), `groupSoABlendLayer` (a pure per-frame fold).
- Functions take **explicit arguments** (the buffer + the plan), not a god-host. `groupSoABlendLayer` receives `(buffer, plan, ...)` — no `this as unknown` cast.
- It has a genuine seam: "NO dependency on the managed-child lifecycle, the scheduler-yield batching, or the spring-weight composite statements" (lines 12-15). The spring lifecycle stays in `group.ts`; only the numeric fold moved.
- The perf is validated (3.7×, maxErr=0, `scripts/soa-composite-decision.json`).

**R proposal:** KEEP as-is (move into `group/` dir, §3). Use this as the reference shape when reworking `engine-playback.ts`.

---

## 5. KEEP — MorphSVG, value.js 1.2.0 consume, the 5.0.0 @deprecated drop

- **`morph-svg.ts`** (Q.WC4, `46b92bc`): genuinely good. Throws typed `AnimationOptionError` on degenerate input (lines 275, 282, 289, 307, 316) — zero-length path, non-integer samples — rather than silently degrading. `orient` is opt-in (adds angle keys only when asked, line 107). The Firefox `<path style="d:...">` is a documented cross-browser CSS authoring fallback (legitimate, not a code workaround). KEEP.
- **value.js `^1.2.0` GATED consume** (`4d6683e`, `26ec99c`): clean registry consume, no `file:` sibling. KEEP.
- **The `@deprecated` `Animation` alias DROP** (`9a24bd1`, Q.WE1, the 5.0.0 breaking surface): this is exactly the R precept — legacy alias EXCISED, not graced. KEEP. (Residual doc-comments still say "the legacy `Animation`" at engine.ts:111 / adapter.ts:184,199 — purely historical prose, harmless, optional cleanup.)
- **keyframes-vue (DM-7, retracted per R brief):** confirmed ZERO residue in this repo — no `packages/`, no workspace, no `keyframes-vue` string in any json. It was published as a separate package and left no cruft here. Nothing for R to revert.

---

## 6. MEDIUM — silent `try/catch` fall-through in `getTimingFunction`

**File:** `src/animation/utils.ts:167-174, 196-201`

```ts
if (STEPS_PREFIX.test(timingFunction)) {
    try { ... return steppedEase(count, jumpTerm); }
    catch { /* fall through to the registry / undefined */ }
}
...
if (LINEAR_PAREN_PREFIX.test(timingFunction)) {
    try { return cssLinear(parseLinearStops(timingFunction)); }
    catch { /* fall through to the registry / undefined */ }
}
```

A string that *matches* `steps(`/`linear(` but is malformed (e.g. `steps(2, bogus)`, `linear()`) is silently swallowed and "degrades to the registry lookup," which then fails to find it and returns `undefined`. The option setter then either throws OR silently defaults. The comment claims "never a silent wrong curve," but a malformed-yet-recognized easing literal does NOT fail explicitly here — it falls through. Per the R precept (NO fall-through; fail EXPLICITLY), a string the author clearly *intended* as `steps(...)`/`linear(...)` but wrote malformed should throw a typed `AnimationOptionError("malformed steps()/linear()")`, not fall through to a name lookup that will miss.

**R proposal:** REWORK — once a string matches the `steps(`/`linear(` prefix, a parse failure is an explicit error (re-throw as `AnimationOptionError` with the original message), NOT a fall-through. The fall-through was correct for the OLD regex-shim era (where a non-match meant "maybe it's a name"); with the prefix-guard it is now a recognized-but-malformed case that should bite.

---

## 7. LOW/MEDIUM — `springCssToOptions` silently defaults-fills INVALID args

**File:** `src/animation/resolve-values.ts:187-205`

```ts
const pos = (i, fallback) => { const v = args[i]; return ... ? v : fallback; };
let mass = pos(0, SPRING_DEFAULTS.mass); ...
if (!(mass > 0)) mass = SPRING_DEFAULTS.mass;       // present-but-invalid → silent default
if (!(stiffness > 0)) stiffness = SPRING_DEFAULTS.stiffness;
if (!(damping >= 0)) damping = SPRING_DEFAULTS.damping;
```

Defaults-fill for *omitted* trailing args is spec-like and fine. But defaults-fill for a *present, physically-invalid* arg (negative mass, zero stiffness) silently substitutes rather than emitting a diagnostic. The engine has a structured diagnostics channel (`adapter.ts`, `validate.ts`) precisely for "silent fallback the resolve path used to swallow, now a citable row" — this site bypasses it.

**R proposal:** REWORK (low priority) — keep the clamp (a NaN curve is worse) but push a `SPRING_ARG_CLAMPED` diagnostic row so the silent substitution is citable, consistent with the K.W7 diagnostics discipline the rest of the engine adopted.

---

## 8. MEDIUM — the `check-failures` gate-roster is a 90-line hand-maintained if-chain (DRY/brittleness)

**File:** `.github/workflows/ci.yml:1701-1792`

The report-all demo-smoke pattern itself is SOUND (not gate-theater): every `proof:*` runs with `continue-on-error: true`, then `check-failures` aggregates outcomes and `exit 1`s if any BLOCKING gate failed; born-RED tripwires (`proof:peer-satisfied` — a genuine glass-ui BB cross-repo handoff, not a pointless never-green gate) are recorded but excluded. Q's `Q.WA3 S1` annotation is honest about this.

BUT the aggregation is ~90 hand-copied lines of `if [ "${{ steps.X.outcome }}" = "failure" ]; then failed="$failed X"; fi` (lines 1710-1782). Adding a gate requires editing it in TWO places (the step + this chain); a forgotten second edit silently drops a gate from the blocking set with no signal. That is exactly the "born-RED gate that never bites" failure mode — by omission rather than design.

**R proposal:** REWORK — derive the roster from a single manifest (e.g. iterate the step ids, or list the blocking gate names once and loop). One source of truth for "which gates block." Out of R's src scope but it is Q-era CI cruft worth folding.

---

## Summary: KEEP / REWORK / REVERT

**KEEP:**
- `group-soa.ts` (the model extraction) — §4
- `morph-svg.ts`, value.js 1.2.0 consume, the @deprecated drop — §5
- the report-all CI *pattern* (born-RED/blocking separation is honest) — §8
- `waapi-densify.ts`, `frame-compiler-numeric.ts` (genuine pure-fold extractions, like group-soa)

**REWORK:**
- `proof:decomposition` override allowlist → real hard ceiling (§1) — **the keystone; everything else follows**
- `engine-playback.ts` god-host cast → explicit minimal driver, or fold-and-recarve (§2)
- the flat-hyphenated families → real directory sub-modules `engine/ group/ spring/ …` (§3)
- `getTimingFunction` silent fall-through → explicit fail (§6)
- `springCssToOptions` silent invalid-arg clamp → diagnostic row (§7)
- the `check-failures` if-chain → manifest-driven (§8)

**REVERT:** nothing wholesale. keyframes-vue already left no residue. The cruft is not *new files to delete* — it is the **ceiling allowlist that lets the god-modules persist** and the **cosmetic engine split that claims a decomposition that didn't happen.** R's job is to make the gate honest, then do the carve the gate has been excusing for ten tranches.
