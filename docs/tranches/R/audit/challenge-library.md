# Tranche R — Adversarial Challenge: LIBRARY (`src/animation/` decomposition gestalt)

**Lane:** `challenge-library` (adversarial verification)
**Date:** 2026-06-24
**Branch:** `tranche-r-dev`
**Targets challenged:** `gestalt-library.md` + `lib-engine.md` + `lib-boundary.md` + `lib-group.md` + `retro-plan-waves.md` + `retro-api-in.md`
**Method:** every material claim re-checked against the ACTUAL tree (`wc -l`, `grep`, `node scripts/proof-*.mjs`, reads of `proof-boundary.mjs` / `proof-engine.mjs` / `proof-decomposition.mjs`), not the doc prose. Default posture: skepticism.

---

## TL;DR verdict distribution

| Claim cluster | Verdict |
|---|---|
| engine.ts is a god-module (1420L, 2 classes) | **sound** |
| Q's playback extraction is a privacy-inversion workaround (`this as unknown as PlaybackHost`) | **sound** |
| Q "decomposition close / FULLY GREEN" was false (resolve-values reds NOW) | **sound** |
| The 7-zone directory tree is KISS-not-over-engineering | **mostly sound, one contrived edge** |
| Spring `types.ts` extraction breaks a real circular ring | **sound** |
| group `forcePause`/`forcePlay` are test-scaffold leaks | **sound** |
| `loadEngine`/`loadCompiler`/`loadIngest` have zero usage → excise | **sound** |
| Dropping `Animation` name was correct; keep `KeyframesAnimation` | **sound** |
| **"proof:boundary survives the move UNCHANGED" / "path change only"** | **OVERREACH (the load-bearing error)** |
| **gestalt omits `proof:engine` + `DYNAMIC_ACCESSORS` gate edits** | **insufficient-evidence / overreach** |
| `internal/` is "the proven barrel pattern, followed exactly" | **overreach (internal/ has NO barrel)** |
| load-engine boundary is "effusive dynamism" (the BOUNDARY, not the surface) | **overreach (boundary is load-bearing; only the 4-accessor surface is effusive)** |
| `animation.ts ~550→<500 after lifts` sizing | **insufficient-evidence (estimate, not proven)** |
| `presets/classic.ts` may need a 2nd taxonomy split | **contrived (data-volume, not a logic carve)** |

---

## 1. The load-bearing error: "proof:boundary survives unchanged" is FALSE

This is the single most important challenge. The gestalt's entire claim-to-safety rests on §5 and §8:

> §5: "`load-engine.ts` changes `import("./engine")` → `import("./engine/index")`. **Vite chunks by entry specifier**, so the heavy engine chunk is unchanged — same module, new path. The `proof:boundary` … assertion … survives because the boundary is still a single `import("./engine/index")`."
>
> §8 table row 3: "`load-engine.ts` keeps `import("./engine/index")` as the single heavy boundary; Vite chunks by specifier → unchanged chunk graph."

**The gate does NOT key on the import specifier. It keys on a hardcoded REGEX over module file paths.**

`scripts/proof-boundary.mjs:84`:
```js
const isHeavyEngine = (id) => /[\\/]animation[\\/]engine\.ts$/.test(id);
```

This regex matches `…/animation/engine.ts` and ONLY that. It will NOT match `…/animation/engine/index.ts` (the path the gestalt proposes), nor `…/animation/engine/animation.ts` (where the actual `KeyframesAnimation` class lands). `isHeavyEngine` is used in THREE places:

- **Assertion (1) PER-ENTRY NEGATIVE COVERAGE** — `proof-boundary.mjs:444`: `const engineStatic = entry.moduleIds.filter(isHeavyEngine);` then `:459` reds if `engineStatic.length > 0`. After the move, this filter returns `[]` for EVERY entry regardless of whether a light entry regressed to statically import the engine. **The gate goes silently blind** — exactly the no-fallback/fail-explicit precept inverted.
- **Assertion (3) DYNAMIC-CHUNK PRESENCE** — `proof-boundary.mjs:484-490`: `dynamicEngine = output.filter(o => …o.moduleIds.some(isHeavyEngine))`. The accessor passes only if `dynamicEngine.length >= 1` (presence). After the move the heavy class lives in `engine/animation.ts`, so `some(isHeavyEngine)` is false for every chunk → `dynamicEngine.length === 0` → **assertion (3) HARD REDS**. The boundary gate FAILS the day the directory lands.

So the move does NOT "survive unchanged." It **(a) hard-reds assertion 3** and **(b) silently disables assertion 1** unless the regex is widened to `/[\\/]animation[\\/]engine[\\/]/` (or the heavy-class file is named explicitly). The gestalt never mentions editing `proof-boundary.mjs`. This is the precept-relevant finding: a decomposition that the planning doc claims is "zero-gate-change" actually breaks a born-RED safety gate.

**Correction:** The R plan MUST include `proof-boundary.mjs:84` (`isHeavyEngine`) widening as a first-class, gated step, with a deliberate re-RED test (add a static engine edge to a light file, confirm the widened regex still bites). Until that is in the plan, "survives unchanged" is a recorded falsehood of the same species the retro-plan-waves lane convicts Q of (a green claim over a tree the gate would red).

### 1b. `proof:engine` is also hardcoded to `engine.ts` — and the gestalt never names it

`scripts/proof-engine.mjs` hardcodes the path TWICE:
- `:33` tick-canon loop: `for (const f of ["src/animation/engine.ts", "src/animation/group.ts"])`
- `:79` `const engine = read("src/animation/engine.ts").split("\n");` then `:87` `findIndex(/^export class KeyframesAnimation</)` to measure the class against `ANIMATION_CLASS_CEILING = 1100` (`:66`).

After moving `KeyframesAnimation` to `engine/animation.ts`, `read("src/animation/engine.ts")` either throws (file gone) or measures the wrong file. The gate breaks. The gestalt's §8 "import-edge consequences" table enumerates the `proof:boundary` assertions but **never mentions `proof:engine` exists**, despite it being the OTHER gate that pins the engine. An audit synthesis that proposes carving engine.ts while omitting the gate that reads engine.ts by literal path is incomplete.

**Correction:** Add `proof:engine` path-retarget (`engine.ts` → `engine/animation.ts`) to the plan, alongside the `proof:boundary` regex widen.

---

## 2. `internal/` is cited as "the proven barrel pattern" — but it has NO barrel

The gestalt leans on `internal/` as the precedent four times:

> §0: "The `internal/` directory already proves the project knows how to build real directory sub-modules."
> §3a: "**The `internal/` precedent is followed exactly** — it is the proven pattern; the new directories are the same shape (a barrel + cohesive members)."
> §11: "every directory is a barrel + cohesive members, the exact `internal/` shape."

**Measured reality:** `src/animation/internal/` contains `binarySearch.ts`, `errors.ts`, `leaves.ts`, `reduced-motion.ts`, `scheduler.ts` — and **NO `index.ts`**. Every consumer imports by direct file path: `from "./internal/errors"`, `from "./internal/leaves"`, `from "./internal/reduced-motion"`, `from "./internal/scheduler"`, `from "./internal/binarySearch"` (verified across engine.ts:27-28, drag.ts:2, numeric.ts:2-4, format.ts:23, group.ts:2, index.ts:44-45,111, etc.). There is no barrel; nothing re-exports the directory as one surface.

So the gestalt's own cited precedent **contradicts** its core design rule (every new dir gets an `index.ts` barrel). The barrel-per-directory mandate is NOT "the internal/ shape followed exactly" — it is a NEW convention the gestalt is introducing. That is not automatically wrong, but it is mis-justified: the doc claims continuity with a precedent that does the opposite.

**Verdict: overreach.** The precedent argument is invalid as stated.
**Correction:** Either (a) drop the "follows internal/ exactly" justification and argue the barrels on their own merits (they DO have merit for the LIGHT/HEAVY re-export seam — the barrel is where `export {…} from "./physics/spring"` lands), OR (b) acknowledge the new barrel-per-dir rule is a deliberate departure and apply it to `internal/` too (give internal/ a barrel) for genuine consistency. As written, the doc wants barrels everywhere while citing a barrel-less precedent — a contradiction.

---

## 3. "load-engine boundary is effusive dynamism" — conflation of BOUNDARY vs SURFACE

The brief asks whether the load-engine boundary is "truly effusive dynamism or load-bearing for the value.js LIGHT/HEAVY split." The docs are not unanimous and the framing matters:

- `retro-api-in.md` F3 headline: "The LIGHT/HEAVY dynamic boundary is the real 'in', and **it IS effusive dynamicism**."
- `lib-boundary.md` §2: "Is the LIGHT/HEAVY split architecture justified? **Yes, unambiguously.** … This is not over-engineering; it is the core product proposition."

These read as contradictory; the gestalt sides (correctly) with lib-boundary. **The boundary itself is load-bearing**, and the evidence is concrete:
- value.js is **externalized** in the published library build (`vite.config.ts:316-320`: `external: [… /^@mkbabb\/value\.js(\/|$)/]`).
- The barrel exports physics steppers (`SpringProgress`, `SmoothProgress`, `NumericAnimation`) with **zero** static value.js edge, enforced by `proof:boundary` assertion (1).
- The 21 static `from "./engine"` importers are ALL heavy-zone files; the engine carries the direct `@mkbabb/value.js` import (`engine.ts:26`).

So `retro-api-in` F3's "the boundary IS effusive dynamicism" is **overreach** — it overclaims. What is actually effusive is the **four-accessor surface** (`loadEngine`/`loadCompiler`/`loadIngest` + the full one), and THAT claim is sound:
- `loadEngine`/`loadCompiler`/`loadIngest` have **zero real call sites** (verified: the only `loadEngine` hit is a DI param in `useHeroSourceEgg.ts:36` typed `typeof loadAnimationEngine`, not the granular export). 47 `loadAnimationEngine` references in the demo; 0 for the granular trio.

The gestalt §6 gets this right (it excises the 3 accessors, keeps the boundary). The correction is to the RETRO doc's framing, which the gestalt should not inherit verbatim: say "the four-accessor SURFACE is effusive; the boundary is load-bearing," not "the boundary is effusive dynamism."

**A coupled excision the gestalt under-specifies:** `proof-boundary.mjs:237` hardcodes `DYNAMIC_ACCESSORS = ["loadAnimationEngine","warmEngine","loadEngine","loadCompiler","loadIngest"]` and the gate **bundles each BY NAME and reds if the export is absent** (`:476-477`: "gating an absent accessor fails rolldown"). Excising `loadEngine`/`loadCompiler`/`loadIngest` (gestalt §6 step 1) therefore REQUIRES removing them from `DYNAMIC_ACCESSORS` in the SAME change, or the gate hard-reds. The gestalt §6 lists the load-engine.ts edits but omits this gate edit. **Correction:** add `proof-boundary.mjs:237` to §6's excision checklist.

---

## 4. The directory tree: mostly earned, with named over-engineering

### 4a. EARNED sub-directories (verified)

- **`spring/` with `types.ts`** — the gestalt claims the directory "BREAKS the spring.ts↔duration↔reseat circular ring." This is a REAL cycle: `spring.ts:15` imports from `./spring-duration`, and `spring-duration.ts:17` imports `DEFAULT_SPRING_RESPONSE` + `SpringProgressOptions` back from `./spring`. Likewise `spring-reseat.ts:16-17` imports `SpringProgress`/`SpringProgressOptions` from `./spring`. A `types.ts` holding the shared options/constants genuinely cuts the ring. **Verdict: sound — this directory is earned, not cosmetic.**
- **`engine/` carve** — engine.ts is 1058L (KeyframesAnimation) + 227L (CSSKeyframesAnimation, a distinct CSS-parsing subclass with CSS-only fields) + 16L re-export tail. Two exported classes in one file is not cohesion. Lifting CSSKeyframesAnimation alone drops the file to ~1193L; the Phase-2 resolver (`engine.ts:1061-1168`, ~107L) and playback delegates are further genuine seams. **Verdict: the god-module framing is FAIR; the carve is real.**
- **`group/` split** — `group-soa.ts` is the verified contrast model: `groupSoABlendLayer(buffer, plan, …)` takes explicit args, no `this as unknown` cast (group-soa.ts:116, confirmed). The DI ask is grounded in an existing in-repo good example, not invented.

### 4b. CONTRIVED edge: `presets/classic.ts` second split

§7 + §11 propose: if `presets/classic.ts` (~700L, "54% raw CSS string DATA") still reds the 500-gate, split into `classic-enter.ts`/`classic-exit.ts`/`classic-attention.ts` by taxonomy.

This is a **data-volume split, not a cohesion carve** — and the gestalt half-admits it ("a data-partition, not a logic carve … the one place the 500-line gate may need a documented data-volume note rather than a forced split"). Splitting a flat list of 34 preset factory constants three ways by taxonomy group, purely to satisfy a line gate on string-literal data, is the contrivance the precepts forbid (logical grouping "WITHOUT contrivance"). The honest move is the documented data-volume override the gestalt itself floats — NOT a forced 3-way split. **Verdict: contrived as a default; the override-with-rationale is the right call and should be the primary, not the fallback.**

### 4c. Minor §8 framing error (not material to the tree)

§8 asserts "all 21 [static-`from-"./engine"`] importers are themselves HEAVY-zone files moving INTO directories, so most become same-directory or `../engine/index` relative imports." **False for at least 3:** `index.ts` (the LIGHT barrel, stays at root), `load-engine.ts` (stays at root, §6), and `animate.ts` (stays at root pending the product call, §11). These re-point cross-boundary, not "same-directory." The re-point is still mechanical; the framing just overstates. **Verdict: overreach, immaterial.**

---

## 5. Sizing claims: estimate, not proof

The gestalt §7 sizing table is presented as if load-bearing ("every file under 500"), but several rows are estimates with thin margins the doc does not prove:

- `engine/animation.ts` **~550→<500 after lifts** — the `→<500` depends on the playback-delegate + element-resolve lifts netting ~50L beyond the named CSS (227L) and Phase-2 (107L) extractions. Plausible (1058 − 227 − 107 = 724, still over; the remaining 224L must come from playback delegates + options-setter relocation), but NOT demonstrated. The doc's own `~550→<500` notation concedes the margin is unproven.
- `engine/playback.ts` **~510→<500** — adding `PlaybackState`'s absorbed fields to the existing 484L engine-playback.ts and landing under 500 is asserted, not measured.

**Verdict: insufficient-evidence.** These are reasonable targets but the plan should treat "<500" as a post-carve VERIFICATION step (re-run `proof:decomposition` after each carve, as §12 step 4 does say), not a pre-proven fact. The risk is the same overclaim pattern retro-plan-waves convicts Q of: asserting a line target the carve might miss.

---

## 6. Where the gestalt is correct and the brief's steelman fails

The brief invites challenge on "is engine.ts 1420L cohesive?" and "is dropping Animation actually wrong?" Both steelmen FAIL:

- **engine.ts cohesive?** No. Two exported classes (`KeyframesAnimation` + `CSSKeyframesAnimation`), 62 method-like declarations, value.js imported directly (`:26`), and the `PlaybackHost` `this as unknown as` cast (`:918`) proving the playback concern is already trying (and failing) to be separate. Not cohesion — a god-module with a faked seam.
- **Dropping `Animation` wrong?** No. `lib-boundary` §3.6 + `retro-api-in` F4 both verify the drop was correct: `Animation` collided with `globalThis.Animation` (WAAPI), emitting `Animation_2` suffixes in the API-Extractor `.d.ts`. Re-adding it would be the global-shadowing legacy alias the precepts forbid. `KeyframesAnimation` is correct. **The real "in" problem is orthogonal** (the README Quick Start instantiates a non-importable class; `animate()` has 0 adoption) — and those (retro-api-in F1/F2) are sound, verified separately (0 `animate(` demo call sites confirmed; `CSSKeyframesAnimation` is type-only on the barrel at index.ts:219).

So the decomposition THESIS is sound. The challenge lands on the gestalt's **safety claims** (the gate "survives unchanged"), its **precedent justification** (internal/ has no barrel), and a few **sizing/contrivance edges** — not on the core "decompose the flat tree" proposal, which is well-earned.

---

## 7. Retro cross-checks (verified, support the gestalt's premises)

- **Q "FULLY GREEN" was false** (retro-plan-waves F1): `node scripts/proof-decomposition.mjs` REDS RIGHT NOW — `✗ [ceiling] src/animation/resolve-values.ts: 797L exceeds the 600L library ceiling`. Confirmed. The gestalt's keystone precondition (§12: DELETE `LIBRARY_CEILING_OVERRIDE` so reds = backlog) is the correct response.
- **engine.ts grew, cap raised not removed** (retro-plan-waves F2): `wc -l` = 1420L; `proof-decomposition.mjs:130-132` cap = 1450 (was 1400). Confirmed. The `proof:engine-seam-split` gate the Q spec mandated does not exist (`ls scripts/proof-engine-seam-split.mjs` → absent). Confirmed.
- **forcePause/forcePlay test-scaffold leak** (lib-group §5): `group.ts:793,798` define them; `test/group.test.ts:204-221` is the ONLY caller; zero src/demo usage. Confirmed — excision is sound. (Caveat: the gestalt §4c compresses `onStart`/`onEnd` to "no-op stubs"; lib-group §6 is more precise — `onStart` sets `this.started=true`, only `onEnd` is a pure no-op. The gestalt's compression is directionally right but slightly inaccurate; inline-and-delete is the correct disposition either way.)

---

## 8. Required additions to the R plan (the gate-edit gap)

The gestalt's "zero-public-API-change / survives unchanged" framing UNDERCOUNTS the gate edits the carve forces. A faithful R plan must ALSO edit (each a gated step with a re-RED test):

1. `proof-boundary.mjs:84` — widen `isHeavyEngine` regex `engine\.ts$` → `engine[\\/]` (else assertion 3 hard-reds, assertion 1 goes blind). **[the load-bearing omission]**
2. `proof-boundary.mjs:237` — remove `loadEngine`/`loadCompiler`/`loadIngest` from `DYNAMIC_ACCESSORS` IN THE SAME CHANGE as their excision (else absent-accessor red).
3. `proof-engine.mjs:33,79` — retarget `src/animation/engine.ts` → `src/animation/engine/animation.ts`.
4. `proof-decomposition.mjs` — DELETE the `LIBRARY_CEILING_OVERRIDE` map (gestalt §12 keystone) so the carve's progress is measured by reds, not prose.
5. `index.ts:219` — the `export type {…} from "./engine"` TYPE re-export re-points to `./engine/index` (the barrel) alongside the 20 value-import re-points.

None of (1)-(3) appear in the gestalt's §5/§6/§8 edit lists. They are the difference between "the directory move is mechanical" (true for the FILES) and "the move is zero-gate-change" (FALSE — three gates are hardcoded to the old paths).

---

## 9. Cited evidence (file:line)

- `src/animation/engine.ts` — 1420L; classes 115-1173 + 1175-1402; re-export tail 1410-1420; `this as unknown as PlaybackHost<V>` :918; value.js import :26; nextId :103
- `src/animation/engine-playback.ts` — `PlaybackHost` interface :50-100 (re-publishes private run-state); reverse casts :287,:378
- `src/animation/internal/` — NO index.ts (barrel-less precedent); 5 flat files imported by direct path
- `src/animation/spring.ts:15` ↔ `spring-duration.ts:17` ↔ `spring-reseat.ts:16-17` — the real circular ring
- `src/animation/group.ts:793,798` (forcePause/forcePlay) ↔ `test/group.test.ts:204-221` (only caller); onStart/onEnd :255-262
- `src/animation/group-soa.ts:116` — `groupSoABlendLayer(buffer, plan, …)` explicit-args model (no host cast)
- `src/animation/{motion-path:37,draw-svg:38,morph-svg:46}.ts` — static `import { CSSKeyframesAnimation } from "./engine"` (already HEAVY)
- `src/animation/index.ts:219` (CSSKeyframesAnimation type-only), :237-241 (granular accessor re-exports), barrel `export {…} from` form
- `src/animation/load-engine.ts:316-322,339,354,376,427,433-473` — memo vars + 4 accessors + inline imports
- `scripts/proof-boundary.mjs:84` (`isHeavyEngine` regex), :237 (`DYNAMIC_ACCESSORS`), :444,:459 (assertion 1), :478-490 (assertion 3)
- `scripts/proof-engine.mjs:33,66,79,87` — hardcoded `engine.ts` path + `ANIMATION_CLASS_CEILING=1100`
- `scripts/proof-decomposition.mjs:130-132` (engine cap 1450), :307 (resolve-values cap 600) — gate REDS now on resolve-values 797L (verified run)
- `package.json` exports — only `"."`, no subpaths (the retro-api-in F3 subpath alternative is real but not yet enabled)
- `vite.config.ts:316-320` — value.js externalized in the library build
- demo usage: 0 `animate(` call sites; 47 `loadAnimationEngine`; 0 granular-accessor calls
