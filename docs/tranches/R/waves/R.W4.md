# R.W4 — The honest API "in" + boundary slim

**Band:** C — lib hygiene  
**Phase:** IMPL (opens on authorization, after R.W1/R.W2 settle the directory structure)  
**DAG position:** parallel with R.W3; depends on R.W1 (the `engine/` directory must exist before the subpath is meaningful), preceded by R.W2 (the `AnimationEngine` interface trimming pairs with the god-class carve).

---

## 1. Scope

The "in" to keyframes.js is broken at the first touch and over-engineered at the second (`audit/retro-api-in.md` HEADLINE). The README Quick Start — the literal first code a user copies — instantiates `new CSSKeyframesAnimation(...)` with no import line, against a symbol that 5.0.0 made impossible to statically import (`audit/retro-api-in.md` F1; `index.ts:219` confirms `CSSKeyframesAnimation` is `export type` only, erased at build). The designed one-call front door `animate()` has zero adoption (0 demo sites vs 32 `new CSSKeyframesAnimation`, `audit/retro-api-in.md` F2; `challenge-retro.md` anchor-fact table). The boundary itself is load-bearing and correct, but its surface is over-engineered: four public accessors (`loadEngine`/`loadCompiler`/`loadIngest`/`loadAnimationEngine`) exist where only one is ever called, the `AnimationEngine` interface is 122 lines of hand-mirrored tranche archaeology, and the curated agent index (`scripts/lib/agent-surface.mjs:76,158`) still advertises `Animation` and `ScrollTimeline` — the two aliases dropped in 5.0.0 — causing `proof:agent-surface` to exit 1 today.

This wave answers the owner's question structurally: add a `./engine` package subpath so `CSSKeyframesAnimation` is statically importable, collapse the four load-accessors to one, delete the three dead interfaces whose only purpose was to type those accessors, fix the README Quick Start fence so `proof:readme-runs` enforces it, decide `animate()` explicitly, and purge the two phantom export references from the curated index so `proof:agent-surface` goes green.

---

## 2. Concrete work

### 2.1 — Add the `./engine` package subpath export (`package.json`)

**Evidence:** `package.json` exports contains only `"."` (verified: the entire exports field is one key). `audit/retro-api-in.md` F3 proposal: `import { CSSKeyframesAnimation } from "@mkbabb/keyframes.js/engine"` as the static, synchronous, tree-shakeable "in" that keeps value.js off `.` by module graph, not by a hand-rolled `await import()` + memoization. `audit/challenge-retro.md` §4 confirms this is subpath-only, NOT a re-added `Animation` alias.

**Before** (`package.json:21–27`):
```json
"exports": {
    ".": {
        "types": "./dist/keyframes.d.ts",
        "import": "./dist/keyframes.js",
        "default": "./dist/keyframes.js"
    }
}
```

**After:**
```json
"exports": {
    ".": {
        "types": "./dist/keyframes.d.ts",
        "import": "./dist/keyframes.js",
        "default": "./dist/keyframes.js"
    },
    "./engine": {
        "types": "./dist/engine/index.d.ts",
        "import": "./dist/engine/index.js",
        "default": "./dist/engine/index.js"
    }
}
```

The `./engine` subpath points at `src/animation/engine/index.ts` — the barrel that the R.W1/R.W2 carve produces. This is what `proof:in-is-importable` (the R.W4 born-RED gate, §3 below) asserts against. Note: this subpath exists only after R.W1 creates `engine/index.ts`; R.W4 IMPL is blocked on that.

The value.js LIGHT/HEAVY boundary is preserved by module graph: `"."` stays value.js-free (no static engine edge); `"./engine"` carries the value.js edge explicitly — a consumer who imports from `./engine` opts into the heavy tier by the specifier, not by an awaited promise. `proof:boundary` continues to hold.

### 2.2 — Excise the three dead granular accessors from `load-engine.ts`

**Evidence:** `audit/lib-boundary.md` §3.1 — `loadEngine`: 0 real call sites (one DI param typed `typeof loadAnimationEngine`, not the granular export); `loadCompiler`: 0 usages; `loadIngest`: 0 usages. Confirmed at `audit/challenge-library.md` §3 (verification): "0 granular-accessor calls" in the demo, "47 `loadAnimationEngine` references." `audit/lib-boundary.md` §3.1 also notes the three add ~150 lines (interfaces + functions + memoization vars) with no payback.

**EXCISE** from `src/animation/load-engine.ts`:
- `export const loadEngine` (`load-engine.ts:339–353`) — EXCISE
- `export const loadCompiler` (`load-engine.ts:354–375`) — EXCISE
- `export const loadIngest` (`load-engine.ts:376–401`) — EXCISE
- `export interface EngineCore` (`load-engine.ts:251–269`) — EXCISE (sole purpose: type the excised `loadEngine`)
- `export interface CompilerSurface` (`load-engine.ts:277–279`) — EXCISE (sole purpose: type the excised `loadCompiler`)
- `export interface IngestSurface` (`load-engine.ts:290–305`) — EXCISE (sole purpose: type the excised `loadIngest`)
- `let _compileMod` (`load-engine.ts:317`) — EXCISE (dead after `loadCompiler` excision, per `audit/lib-boundary.md` §3.5)
- `let _ingestMod` (`load-engine.ts:318`) — EXCISE
- `let _scrollMod` (`load-engine.ts:319`) — EXCISE
- Inline `_compileMod ??= import("./compile")` inside `loadAnimationEngine`'s `Promise.all` (`load-engine.ts:457`), replacing the module-var reference with a bare `import("./compile")` — the `_enginePromise ??=` outer guard makes this safe (`audit/lib-boundary.md` §3.5)
- Apply the same inlining for `_ingestMod` and `_scrollMod` inside `loadAnimationEngine`'s `Promise.all`

**Net result:** `load-engine.ts` projects from 559 lines to ~310 lines (`audit/lib-boundary.md` §3.7), holding exactly two public exports: `loadAnimationEngine` and `warmEngine`.

**Paired gate edit (REQUIRED in the same commit):** `scripts/proof-boundary.mjs:237` `DYNAMIC_ACCESSORS` currently names `"loadEngine"`, `"loadCompiler"`, `"loadIngest"` alongside `"loadAnimationEngine"` and `"warmEngine"`. The gate bundles each by name and reds if the export is absent (`audit/challenge-library.md` §3). Excising the three accessors without removing them from `DYNAMIC_ACCESSORS` hard-reds the gate. Remove `"loadEngine"`, `"loadCompiler"`, `"loadIngest"` from the array in the same commit as the load-engine.ts excisions.

**Also remove from `src/animation/index.ts:237–243`:** the `export { loadEngine, loadCompiler, loadIngest }` re-export line, and the `export type { EngineCore, CompilerSurface, IngestSurface }` re-export (`index.ts:249–254`).

### 2.3 — Delete the `AnimationEngine` interface and its drift-gate WHERE the subpath replaces it

**Evidence:** `audit/lib-boundary.md` §3.2 — the `AnimationEngine` interface at `load-engine.ts:118–240` is 122 lines (21.8% of the file), 41 members each with a per-member tranche-provenance JSDoc paragraph (30+ `// K.W8 FLAGGED ADDITIVE` paragraphs). The comment at `:113–116` explains the interface exists because API Extractor cannot resolve `typeof import()`. The drift-gate is `proof:published-surface` clause (d), which diffs `Object.keys(engine)` against the interface at runtime.

**Decision point:** The `AnimationEngine` interface is retained BUT stripped, not deleted wholesale, because:
1. API Extractor constraint is genuine (`audit/lib-boundary.md` §3.2 — "this constraint is genuine").
2. `proof:published-surface` clause (d) provides the drift-detection that makes the hand-maintained interface safe.
3. The `./engine` subpath gives a static import home for the class; it does NOT eliminate the need for the `AnimationEngine` shape used in DI patterns and typed destructures of `await loadAnimationEngine()`.

**EDIT** `load-engine.ts:118–240`: strip each member's JSDoc paragraph to ONE line (the current first sentence). The 30+ `// K.W8 FLAGGED ADDITIVE`/`// L.W6 FLAGGED ADDITIVE` archaeology paragraphs belong in `CHANGELOG.md`, not in the `.d.ts` output. Strip reduces the interface from 122 lines to approximately 55 lines (`audit/lib-boundary.md` §3.2 projection).

**Retained:** the `AnimationEngine` interface itself, `proof:published-surface` clause (d), and `warmEngine` (the 1-line fire-and-forget idle warmer — its JSDoc is trimmed per `audit/lib-boundary.md` §3.3 from 30 lines to 5 lines).

### 2.4 — Fix the README Quick Start + tag the fence `ts run`

**Evidence:** `audit/retro-api-in.md` F1 — README Quick Start at `:9–35` has no import line; the fence is `\`\`\`ts` (README.md:11, confirmed bare at PROGRESS.md anchor-fact table). `audit/challenge-retro.md` anchor-fact: "README Quick Start fence: \`\`\`ts not \`\`\`ts run; zero import/require/from in lines 1–40." The `proof:readme-runs` gate skips non-`run` fences, so the Quick Start has never been CI-enforced.

**Two coupled edits:**

1. **Rewrite the Quick Start** to import from the subpath (choice A from `audit/retro-api-in.md` F1 — the structurally honest path that makes the code actually work against the published package):

```ts run
import { CSSKeyframesAnimation } from "@mkbabb/keyframes.js/engine";

const anim = new CSSKeyframesAnimation({
    duration: 2000,
    iterationCount: Infinity,
    direction: "alternate",
    fillMode: "forwards",
});

anim.fromString(`
    @keyframes mijn-keyframes {
        from { transform: translateX(-100%); background-color: #C462D8; }
        to   { transform: translateX(50%);  background-color: #E85252; }
    }
`);
anim.setTargets(document.getElementById("myElement"));
anim.play();
```

2. **Tag the fence `ts run`** so `proof:readme-runs` (and thus `proof:in-is-importable`) picks it up and enforces that the import resolves against the built dist. This is the gate-enforcement half of the fix; without the `run` tag the CI never catches a broken Quick Start again.

**Also fix** README.md lines 232, 541, 546: replace stale `Animation` backtick references with `KeyframesAnimation` (`audit/lib-boundary.md` §3.4).

### 2.5 — `animate()`: EXCISE as dead surface — **OWNER-RATIFIED 2026-06-24**

> **Owner ruling:** *"Remove animate() in favor of our more idiomatic solutions."* The fork is
> CLOSED — EXCISE. The "more idiomatic solutions" are the `@mkbabb/keyframes.js/engine` subpath
> (§2.1) + direct `new CSSKeyframesAnimation(...)` — the pattern the demo already uses at all 32
> sites. The promote-and-dogfood alternative is DECLINED.

**Evidence:** `audit/retro-api-in.md` F2 — zero adoption (0 `animate(` call sites in demo; 32 `new CSSKeyframesAnimation`). `audit/challenge-retro.md` §3 calibration: the correct charge is "dead-by-disuse (0/32)," not "effusive dynamicism" (a typed-union front door is genre-idiomatic). `R.md` §2: "`animate()` is charged as 'dead-by-disuse (0/32),' NOT 'effusive dynamicism'; the subpath is subpath-only, NEVER re-add `Animation`."

**Decision: EXCISE `animate()` as dead surface.** The reasoning:

- The subpath (`@mkbabb/keyframes.js/engine`) gives `CSSKeyframesAnimation` a static synchronous home — the genre-idiomatic "construct directly" path that the 32 demo sites actually use. With the subpath in place the architecture CAN support a static `animate()`, but there is no obligation to keep a function with 0 call sites.
- Promoting `animate()` to a static front door would require either: (a) moving it to the subpath barrel (coupling `animate.ts`'s full 213-line dispatch to the subpath entry), or (b) re-exporting it from the `.` barrel statically (pulling `engine.ts` onto the light surface — the boundary violation). Neither is cheap; neither is evidenced as needed.
- DRY/KISS both bite a never-used "front door" that exists to imitate genre baselines the architecture cannot actually join (single static import from `.`).
- The 6-way runtime shape-sniff in `animate.ts:105–200` (`isMotionPathInput`, `isKeyframeMap`, `instanceof Map`, etc.) remains available through `loadAnimationEngine` for any consumer who wants it; EXCISE removes it from the public static surface, not from the universe.

**EXCISE from `src/animation/animate.ts`:** The file stays (it is a HEAVY chunk loaded by `loadAnimationEngine`), but `animate` is removed from `AnimationEngine` interface (`load-engine.ts` member `animate`) and from `docs/published-surface.md`. If there is any demo call site at IMPL time (currently 0), convert to direct `new CSSKeyframesAnimation(...)` before excision.

**The promote-and-dogfood alternative was DECLINED by the owner (2026-06-24).** It is recorded here only for provenance: it would have added `animate` to the `./engine` subpath barrel + dogfooded it in ≥1 scene. The owner directed EXCISE in favor of the direct-construction idiom. No fork remains at IMPL start.

### 2.6 — Remove phantom exports from the curated agent index

**Evidence:** `proof:agent-surface` exits 1 NOW with: `(a.2) the curated index links export(s) NOT in the published surface: \`Animation\`, \`ScrollTimeline\``. Confirmed by running the gate post-generation (observed in this session). The source is `scripts/lib/agent-surface.mjs:76` (the `CSSKeyframesAnimation` CURATED entry lists `exports: ["CSSKeyframesAnimation", "Animation", "loadAnimationEngine"]`) and `:158` (the `Timeline` entry lists `"ScrollTimeline"` in its exports array). Both aliases were dropped in 5.0.0 (`Q.WE1`); the curated index was never updated.

**EDIT `scripts/lib/agent-surface.mjs`:**
- Line 76: remove `"Animation"` from the exports array → `["CSSKeyframesAnimation", "loadAnimationEngine"]`
- Line 158: remove `"ScrollTimeline"` from the exports array → `["Timeline", "ManualTimeline", "createNativeTimeline"]`

**Then regenerate:** `node scripts/gen-agent-surface.mjs` — this re-emits `llms.txt` + `llms-full.txt` from the corrected CURATED definition. `proof:agent-surface` then passes its (a.2) check. This is the "5.0.0 no-legacy drop complete" signal the PROGRESS.md surfaced-reds table lists as the R.W4 discharge target.

---

## 3. The born-RED gate: `proof:in-is-importable`

**Name:** `proof:in-is-importable`

**What it asserts (three clauses, all must pass):**

1. **(subpath resolves)** `import { CSSKeyframesAnimation } from "@mkbabb/keyframes.js/engine"` resolves against the BUILT `dist/` — i.e., the `./engine` subpath entry exists in `package.json` exports AND the dist file it points at is present. Assert: `typeof CSSKeyframesAnimation === "function"`. Fail loud if the dist is absent (prereq: run build first; the gate documents this).

2. **(Quick Start is a real `ts run` fence)** The README Quick Start code block is tagged `\`\`\`ts run\`` (not bare `\`\`\`ts\``), AND it contains an import from `@mkbabb/keyframes.js` (either `.` or `/engine`). The gate reads `README.md`, finds the first fenced block after `## Quick Start`, and asserts both conditions. Fail: `"Quick Start fence is not tagged ts run — proof:readme-runs cannot enforce it"` or `"Quick Start has no import line — it cannot compile"`.

3. **(agent-surface GREEN)** Spawn `node scripts/proof-agent-surface.mjs` and assert exit 0. This folds the `Animation`/`ScrollTimeline` phantom-export check into the `in-is-importable` gate as a co-assertion.

**Location:** `scripts/proof-proof-in-is-importable.mjs` (new file); added to `package.json` `scripts` as `"proof:in-is-importable": "node scripts/proof-in-is-importable.mjs"` and to `proof:hygiene-chain`.

**NON-VACUOUS plant test (RED-state proof the gate bites):**

Before the `./engine` subpath is added to `package.json`, the import `import { CSSKeyframesAnimation } from "@mkbabb/keyframes.js/engine"` throws `ERR_PACKAGE_PATH_NOT_EXPORTED`. The gate's clause (1) catches this and exits 1 with: `"(1) @mkbabb/keyframes.js/engine subpath does not resolve — the ./engine export is absent from package.json. The Quick Start 'new CSSKeyframesAnimation' cannot be statically imported."` This is the born-RED state that the R.W4 IMPL discharges.

For clause (2): revert the `ts run` tag to bare `\`\`\`ts\`` — the gate exits 1: `"(2) README Quick Start fence is not tagged 'ts run' — proof:readme-runs cannot enforce the import."` The gate bites without the directory carve being present; it can be run independently as a doc-hygiene check.

For clause (3): re-add `"Animation"` to `agent-surface.mjs:76` — `proof:agent-surface` exits 1 → the co-assertion propagates to `proof:in-is-importable` exit 1.

---

## 4. Challenge-tempered cautions (from R.md §2)

- **KEEP the `Animation`-name drop.** `R.md` §2 and `audit/challenge-retro.md` §4 both confirm the drop was correct (global-shadowing, `Animation_2` in `.d.ts`). The subpath gives `CSSKeyframesAnimation` a static home — it is NOT a re-added `Animation` alias. The `./engine` subpath re-exports `CSSKeyframesAnimation` and `KeyframesAnimation` (their current correct names), never the dropped alias.

- **The LIGHT/HEAVY boundary STAYS.** `audit/challenge-library.md` §3 is explicit: "the boundary itself is load-bearing; only the four-accessor surface is effusive." The `.` barrel retains zero static engine edge. `proof:boundary` continues to gate this. The subpath is a CONSUMER-OPT-IN addition to the boundary, not a dissolution of it.

- **The three gate co-edits are REQUIRED in the same commit as their corresponding excisions.** `R.md` §2: "the 3 gate co-edits … are first-class R.W1 steps, each with a re-RED test." The same principle applies here for R.W4's gate co-edit: `proof-boundary.mjs:237` `DYNAMIC_ACCESSORS` must drop `loadEngine`/`loadCompiler`/`loadIngest` in the same commit as their excision from `load-engine.ts` and `index.ts`. Absent this, the gate hard-reds on the missing exports.

- **`animate()` fate is DECIDED — EXCISE (owner-ratified 2026-06-24).** No fork remains; the IMPL agent excises `animate` from the public surface (the `AnimationEngine` interface member + `docs/published-surface.md`) and converts any demo call site (currently 0) to direct `new CSSKeyframesAnimation(...)`. The gate (`proof:in-is-importable`) is neutral on `animate()`; a separate assertion that `animate` is ABSENT from the published surface may be added to lock the removal.

- **`proof:published-surface` clause (d) stays.** Excising the three dead accessors + stripping the `AnimationEngine` interface JSDoc does NOT remove the drift-detection gate. The hand-maintained interface is a genuine API Extractor constraint (`audit/lib-boundary.md` §3.2: "the API Extractor constraint is genuine"). The gate that diffs `Object.keys(engine)` against the interface is the correct response to that constraint.

---

## 5. Verification + DEV/IMPL boundary

**Verification:** Every claim in this spec is grounded in live-tree evidence confirmed in this session: `proof:agent-surface` exits 1 with `Animation`/`ScrollTimeline` phantom exports (run 2026-06-24); `package.json` exports has only `"."` (verified); `index.ts:219` has `CSSKeyframesAnimation` under `export type` only (read); README Quick Start fence is bare `\`\`\`ts\`` at line 11 (read); `load-engine.ts:339,354,376` define the three dead accessors (read); `DYNAMIC_ACCESSORS` at `proof-boundary.mjs:237` names the three accessors (grep-confirmed). The audit's adoption count (0 `animate(` sites, 32 `new CSSKeyframesAnimation`, 47 `loadAnimationEngine`) matches the challenge-retro anchor-fact table.

**DEV/IMPL boundary:** This spec is the DEV deliverable. IMPL opens on owner authorization. DAG order: R.W1 must land first (the `engine/` directory must exist before `./engine` dist files are present); R.W2 is recommended but not strictly blocking (the `AnimationEngine` interface trimming is a co-edit that pairs naturally with R.W2's engine god-class carve). R.W3 is parallel. R.W4 IMPL steps: (1) confirm `engine/` barrel exists post-R.W1; (2) add subpath to `package.json` + build; (3) excise granular accessors + paired `DYNAMIC_ACCESSORS` co-edit + re-RED test; (4) strip `AnimationEngine` JSDoc; (5) decide `animate()` fate with owner; (6) fix README Quick Start + tag fence; (7) scrub `agent-surface.mjs:76,158`; (8) regenerate `llms.txt`/`llms-full.txt`; (9) run `proof:in-is-importable` green; (10) run `proof:agent-surface` green; (11) run `proof:boundary` green (DYNAMIC_ACCESSORS co-edit validated).
