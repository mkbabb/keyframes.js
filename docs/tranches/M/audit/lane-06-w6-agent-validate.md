# Lane 06 — W6 Agent-validate audit (Tranche M seed)

**Lane:** 06 · **Wave audited:** L.W6 (commit `5bef882`) · **Auditor:** M-seed agent ·
**Date:** 2026-06-17 · **Branch:** `tranche-l-dev` (tip `529fcfd`) · **Method:** ground-truth
file reads + live gate re-runs; no claim trusted from prior audit docs without independent
verification.

---

## §1 — TASK SCOPE

Re-audit L.W6 (the agent-authoring surface, `validate`/`explain` projection). Four questions:

1. Is the join read-only? Is `generate()` properly killed?
2. What is the actual `!important` / clause-(c) reconciliation — was the L.W6 spec's
   "honor" premise correct at authoring time, and how was it corrected?
3. Is the agent-authoring surface complete (llms.txt loop) or does M owe more (a
   streaming/MCP surface)?
4. Are there precept violations in L-as-built?

---

## §2 — GROUND-TRUTH VERIFICATION

### 2.1 — `validate.ts` exists and is a read-only join

**Verified:** `src/animation/validate.ts` (47 lines of doc + 196 lines of code) exists.

The implementation:
- `buildAnimation(css)` at `validate.ts:121` constructs a throwaway
  `CSSKeyframesAnimation` via `new CSSKeyframesAnimation<any>().fromString(css)` — no DOM
  attachment, no rAF, no side-effects.
- The five-field `ValidateResult` at `validate.ts:76-111` is a pure envelope over three
  already-CI-gated channels:
  - `animation.diagnostics` (`adapter.ts:100` — the `Diagnostic[]` channel)
  - `compileToCSS([animation], opts.compile)` (`compile.ts`)
  - `isWAAPIEligible(animation)` (`waapi.ts:111`)
- No new diagnostic codes are invented. No engine paths are added. The join adds exactly
  one value: altitude (a consumer today must call all three separately; `validate` does the
  join + the parse-safety gate before compiling).

**No new engine code** is the correct description. `validate.ts` is 100% a read.

### 2.2 — `generate()` KILL status

**Verified.** `generate()` (from-intent verb) does NOT appear anywhere in the source tree.
The KILL is recorded in:
- `docs/tranches/L/L.md:116` — "generate() is KILLed" in the L.W6 charter row
- `docs/tranches/L/audit/completion-lanes-32-36.txt:28` — "[high/KILL] A generate-from-intent
  verb is OUT OF SCOPE"
- `docs/tranches/L/audit/deferred-ledger-L.md:155` — DLL-45 KILL permanent record
- `docs/tranches/L/audit/prompt-recap-L.md:294` — GEN-1 KILL confirmed non-re-litigable

The rationale is KISS/inv-16/moat-gestalt: the LLM generates, kf validates+compiles.
Adding a generation surface would require an LLM API key channel, model selection, retry
logic — all off the animation axis and a boundary violation (inv-16: kf writes only its
own engine). The KILL is correctly anti-chartered and non-re-litigable for Tranche M.

### 2.3 — The `!important` / clause-(c) reconciliation

This is the most significant factual error the L.W6 spec shipped and was corrected.

**What the L.W6 spec originally claimed (before implementation):** L.W6.md lines 81-86,
154-156, 257-268 use language like "L.W1 HONORS the flag", "honors the flag — after L.W1
`validate` reports the input `parseable:true` + `eligible:true` and emits the `!important`
faithfully on the backward pass (no drop, no drop-diagnostic)." The spec was written
assuming kf would emit `opacity: 0 !important` faithfully.

**The spec-correct reality (verified at ground truth):**

CSS Animations §3 states that a property with `!important` inside a keyframe is **invalid
and the entire declaration is ignored**. `value.js`'s `liftKeyframeMetadata`
(`/Users/mkbabb/Programming/value.js/src/parsing/stylesheet.ts:314-319`) DROPS the
declaration at the AST level with the comment: "CSS Animations spec §3: !important is
invalid in a keyframe declaration and the entire declaration is ignored." This is
spec-correct browser-mirroring behaviour. kf's `adapter.ts:113-122` (`declsToVarMap`)
simply reads `decl.name`/`decl.value` — but the `!important` declaration is NEVER in
`rule.declarations` by the time `declsToVarMap` sees it, because value.js dropped it in
`liftKeyframeMetadata` before handing the `KeyframeRule` to kf.

**What the implementation actually asserts** (`test/agent-validate.test.ts`):
- `parseable === true` (the REST of the block parses; the dropped `!important` is not a
  parse failure)
- `eligible === true` (the `@property` block round-trips faithfully — that part is L.W1 S2
  and IS honored)
- NO `IMPORTANT_DROPPED` or `PROPERTY_NOT_SERIALIZED` diagnostic row (the spec-correct
  drop is silent at the AST level; surfacing the diagnostic as a named `DiagnosticCode` is
  a **value.js-O dispatch**, ask #12 in `KF-TO-VALUEJS-O-ASKS.md`)

**The correction was made BEFORE the gate was authored.** The gate script
`scripts/proof-agent-validate.mjs:clause(c)` and the test
`test/agent-validate.test.ts` both assert the spec-faithful verdict, NOT that `!important`
is honored/emitted. The FINAL.md §S1 records this correction under "inv ε honesty —
the S1 `!important` correction (NOT an overclaim)."

**Impact on M:** The missing diagnostic affordance (surfacing the drop, not the
drop itself) is the clean consumer-visible gap. It requires value.js-O ask #12 to surface a
`ParseDiagnostic`-channel row for `!important` dropped at the AST. Until that lands,
`validate(css)` over a block with keyframe `!important` returns empty `diagnostics` — the
user sees `parseable:true, eligible:true` with no explanation of why the `opacity: 0
!important` from their input is absent from the compiled output. This is spec-correct
but not maximally honest. **This is a named Band-B handoff, not a kf defect.**

### 2.4 — Gate re-run (observed green)

```
npm run proof:agent-validate
```

Observed output (re-run 2026-06-17):

```
  ✓ [verb-exists] src/animation/validate.ts locks 3 verb-exists anchor(s)
  ✓ [verb-exists] validate/explain are HEAVY (ride loadAnimationEngine's dynamic import('./validate')); only their erased TYPES are on the LIGHT barrel (proof:boundary stays green)
  ✓ [loop-heading] llms.txt carries the `## Agent authoring loop` LOOP teaching
  ✓ [loop-not-stale] llms.txt's LOOP section is byte-identical to a fresh generation
  ✓ [behaviour-locks] test/agent-validate.test.ts locks 4 behaviour-locks anchor(s)

proof:agent-validate — PASS: …
 Test Files  1 passed (1)  Tests  5 passed (5)
```

All 5 clauses GREEN. The gate + vitest (jsdom, 754ms) confirm the implementation.

### 2.5 — Boundary verification

`proof:boundary` GREEN (re-run 2026-06-17). `validate`/`explain` ride the dynamic surface:
- `load-engine.ts:445` — `import("./validate")` in the `loadAnimationEngine` `Promise.all`
- `load-engine.ts:493-494` — `validate: validateMod.validate, explain: validateMod.explain`
  wired onto the returned object
- `src/animation/index.ts:202` — `export type { ValidateOptions, ValidateResult } from
  "./validate"` (erased `import type`; zero static value.js edge on the LIGHT barrel)
- `proof:agent-surface` confirms `validate`/`explain` are in the published manifest (74
  exports; set-equal check GREEN)

The `docs/published-surface.md:165-185` carries the canonical manifest entries.

### 2.6 — llms.txt LOOP section

`llms.txt:98-125` carries the `## Agent authoring loop` section (verified via grep). It is
byte-identical to a fresh `buildLlmsTxt()` generation (clause (e) GREEN). The loop code
block teaches the validate→fix→compile LOOP as structured, idiomatic TypeScript (not a
narrative), references `result.diagnostics`/`result.refusals`/`result.waapi.reason` by
field, and links `proof:agent-validate`. The section is generated from
`scripts/lib/agent-surface.mjs:224-265` IFF `validate` and `explain` are in the
published manifest — so it cannot drift (the conditionality is the anti-drift lock).

### 2.7 — Is there a streaming/MCP surface gap M should address?

**Answer: NO for MCP tool-call surface; YES for a diagnostic completeness ask to
value.js-O.**

The L.W6 spec and the entire L audit (audit-32-skeleton.txt, completion-lanes-32-36.txt
Lane 35, KF-TO-VALUEJS-O-ASKS.md, KF-TO-PARSE-THAT-ASKS.md) contain zero mentions of:
- An MCP tool-definition surface (`tool_call` / function-calling schema)
- A JSON Schema output for `ValidateResult`
- A streaming/chunked parse surface (DLL-31 covers incremental parse as a separate
  BOOK-with-tripwire, verdict NO — full reparse is sub-ms inside the threshold)
- An OpenAPI descriptor or `llm.txt`-v2 structured schema

The `llms.txt` format kf ships is the Anthropic/Simon Willison convention (plain-text
curated index + full roster), which is the current agent-indexing standard. A formal JSON
Schema for `ValidateResult` or a MCP `tool/keyframes_validate` descriptor would be an
OVER-ENGINEERED addition for M: the typed TypeScript interface is already the schema (the
LLM consuming the `llms.txt` gets the type definitions via `dist/keyframes.d.ts` or the
`llms-full.txt` full roster), and an MCP server hosting kf is a user-domain deployment
concern (kf is a library, not a server).

**The one genuine gap:** `validate(css)` over keyframe `!important` input returns empty
`diagnostics` — the user receives no explanation that the declaration was dropped by the
spec. This will be resolved by value.js-O ask #12 (`KF-TO-VALUEJS-O-ASKS.md:12` — the
`invalid-keyframe-decl DIAGNOSTIC`). Until that lands, an agent calling `validate()` and
seeing `parseable:true, eligible:true, diagnostics:[]` on a block with keyframe
`!important` has no typed signal to surface to the user. This is **DLL-31-adjacent** but
not the same item — it is the spec-faithful silent-drop that value.js performs at the AST
level, not a parse failure.

**M's obligation on this:** M should carry the value.js-O ask #12 as a Band-B consume
edge, with `validate.ts` as the downstream consumer that will fold the diagnostic row
into `result.diagnostics` once the ask lands. No kf workaround should be attempted (the
FORBIDDEN re-parse-the-body-as-a-style-rule workaround was attempted and REVERTED during
L implementation per FINAL.md §S1 and KF-TO-VALUEJS-O-ASKS.md #12). The diagnostic gap
is a named HANDOFF, not a kf defect.

---

## §3 — PRECEPT AUDIT

### 3.1 — NO quick solutions / workarounds

`validate.ts` has no workaround. It reads the three channels directly. No regex hacks,
no string scraping, no Symbol sidechannels, no re-parse tricks. The implementation is
the correct gestalt solution.

**Exception noted:** the `!important` diagnostic gap is the one place where the absence
of a workaround is CORRECT — the FORBIDDEN workaround (re-parse the body as a style rule
to recover the dropped `!important`) was tried and reverted. The correct path is the
value.js-O ask. Zero precept violations in `validate.ts` itself.

### 3.2 — KISS

`validate.ts:139-175` (the `validate` function body) is 36 lines of pure join logic.
`explain.ts:211-242` (the `explain` function body) is 31 lines of deterministic
string-building. Both are as simple as they can be given the task. KISS holds.

### 3.3 — inv-16 (kf writes only its own engine)

`generate()` is killed. `validate.ts` makes NO external API calls, adds no new IO, no
LLM calls, no fetch. inv-16 holds.

### 3.4 — NO legacy code

The W6 implementation adds two new files (`validate.ts`, `test/agent-validate.test.ts`)
and extends `load-engine.ts` with the dynamic import wiring. No legacy code is carried.

### 3.5 — Acyclic constellation spine

`validate.ts` imports from `./engine`, `./compile`, `./waapi`, `@mkbabb/value.js`. All
PUBLISHED dependencies, no `file:` vendoring, no branch-pinning. `proof:boundary` GREEN.
Spine holds.

### 3.6 — Overfitting guard (no public surface without a current consumer)

The spec's Lane 35 overfitting tripwire was: "L.W-AGENT-AUTHOR must NOT add a public
surface without a current consumer." The current consumers at ship:
1. `test/agent-validate.test.ts` — the runtime behaviour proof (5 tests, all GREEN)
2. `llms.txt:98-125` `## Agent authoring loop` — references `validate` + `explain`
   explicitly in the code block and inline

The demo does NOT call `validate()` or `explain()` (confirmed by grep over all `.vue`
and `.ts` files). This means the overfitting guard is satisfied by the gate + the
llms.txt loop, but the demo is NOT yet a consumer. For M, extending the demo's
`KeyframesStringControls.vue` (which already dogfoods `compileToCSS` at
`KeyframesStringControls.vue:50,256-291` per L.W6.md) to call `validate()` and surface
its result in the ineligibility panel would STRENGTHEN the consumer count. This is a
non-critical M-wave candidate (demo dogfood extension), not a ship blocker.

---

## §4 — M-WAVE CANDIDATES FROM W6

### M-W-AGENT-DEMO — demo dogfood of `validate`/`explain`

`KeyframesStringControls.vue` already calls `compileToCSS` for the ineligibility panel.
Extending it to call `validate(css)` and surface `result.diagnostics` inline (the
COMPOSITION_FALLBACK / UNKNOWN_TIMING_FN rows that today are swallowed silently) would:
1. Prove `validate()` has a real UI consumer beyond the gate
2. Surface the diagnostic channel to users (the first visible payoff of the honesty work
   L.W1/W2 delivered)
3. Close the overfitting guard fully (gate + llms.txt LOOP + live UI consumer)

**Classification:** LIGHT effort, high product visibility. Rides L.W8's demo dogfood
surface. Candidate for M Band-A alongside any design-DX wave.

### M-W-AGENT-DIAGNOSTIC-VALUE.JS — the value.js-O ask #12 consume

Once value.js-O ships ask #12 (`KF-TO-VALUEJS-O-ASKS.md:12` — `invalid-keyframe-decl
DIAGNOSTIC`), the adapter's `resolveKeyframes` path can fold the new
`ParseDiagnostic` row into `ResolvedKeyframes.diagnostics`, and `validate()`/`explain()`
will then project the `!important`-dropped diagnostic without any kf logic change. The
kf-side change is a single-line `adapt-diagnostic` fold in `adapter.ts` + a new test
fixture in `test/agent-validate.test.ts` asserting the new code appears. This is a
consume-edge, not a new feature.

**Classification:** Band-B gated consume (tripwire: value.js-O publishes ask #12).
`proof:workaround-deletion` has no arm for this (there is no workaround to delete —
the current behaviour is already correct/spec-faithful). M should add a new
`proof:agent-diagnostic-complete` clause that REDs until the consume lands.

### M-W-MCP-VALIDATE — MCP tool-definition surface (CANDIDATE — BOOK-with-tripwire)

A `keyframes_validate` MCP tool exposing `validate(css)` as a model-context-protocol
function would let an IDE (Cursor, VS Code with Copilot, Claude Desktop) call validate
directly during authoring. The shape is trivial (`{ name: "keyframes_validate", parameters:
{ css: { type: "string" } }, returns: ValidateResult }`) and `ValidateResult` is already
a flat, JSON-serializable type.

**However:** kf is a library, not a server. An MCP server wrapper is a USER-DOMAIN
deployment (the user's toolchain instantiates the server, not kf). M shipping a kf-bundled
MCP adapter would require Node.js process semantics, network/stdio transport, the MCP SDK
dependency — all off the animation axis (inv-16 violation risk). The correct shape is a
`keyframes-mcp` satellite package (like `keyframes-vue`), not an expansion of the main
library.

**Verdict:** BOOK-with-tripwire. Tripwire: the user (Mike Babb) confirms MCP toolchain
integration is a real use-case AND authorizes a satellite package. Until then, the llms.txt
LOOP is the correct, zero-overhead agent surface. GEN-1's reasoning applies here by
analogy: adding a server-mode surface without a measured use-case would be the same
off-axis over-engineering.

---

## §5 — DEFERRED FOLDS FOR M

| Item | Source | Status | M action |
|------|--------|--------|----------|
| value.js-O ask #12 (invalid-keyframe-decl DIAGNOSTIC) | `KF-TO-VALUEJS-O-ASKS.md:12` | HANDOFF — tripwire: value.js-O publish | M adds `proof:agent-diagnostic-complete` (born-RED until ask #12 consume) |
| Demo dogfood of `validate()` | `KeyframesStringControls.vue:50` | Gap — not a blocker | M-W-AGENT-DEMO candidate |
| MCP/streaming surface | DLL-31 (streaming parse BOOK), this lane | BOOK | Only open on user authorization of satellite package |
| GEN-1 (generate-from-intent) | `L.md:116`, `deferred-ledger-L.md DLL-45` | KILL — permanent | M must NOT re-litigate; the anti-charter entry stays |

---

## §6 — CROSS-REPO ASKS

| Sibling | Ask | Status | kf-side gate |
|---------|-----|--------|-------------|
| value.js-O | ask #12: `invalid-keyframe-decl DIAGNOSTIC` — surface the spec-§3 drop as a named `ParseDiagnostic` row | PENDING (value.js 0.13.0 does NOT surface it; `liftKeyframeMetadata:314-319` silently drops the declaration) | `proof:agent-diagnostic-complete` born-RED (M) |
| glass-ui BB | no W6-specific ask | — | — |
| parse-that | no W6-specific ask | — | — |

---

## §7 — PERF

`validate.ts` executes one `CSSKeyframesAnimation.fromString`, one `compileToCSS`, one
`isWAAPIEligible`. All three are synchronous computation over already-parsed AST; no DOM,
no network. The async interface is solely because `compileToCSS` runs a Prettier pass on
the compiled CSS (compile.ts async). The overhead is negligible compared to a typical
LLM round-trip. No performance gate is warranted for `validate`/`explain` themselves.

The `test/agent-validate.test.ts` 5-test suite runs in 51ms (transform + import ~253ms,
tests ~51ms, jsdom env ~467ms) — within normal vitest/jsdom envelope.

---

## §8 — VERDICT

L.W6 is **COMPLETE and CORRECT** as-built. The gate is GREEN (`proof:agent-validate`
re-run 2026-06-17). The `!important` correction is the only factual delta between the
spec-as-written and the implementation — the spec described "honoring" the flag; the
implementation correctly projects the spec-faithful DROP (the browser behaviour, CSS
Animations §3), and the test asserts the correct result. This correction was made before
the gate was authored (commit `5bef882`) and is recorded in FINAL.md §S1 as inv ε honesty.

`generate()` is properly killed (DLL-45, non-re-litigable). The agent-authoring surface
consists of `validate(css)` + `explain(css)` + the `llms.txt` LOOP section — complete for
the current use-case (LLM agent pre-validation, not MCP server deployment). The one
genuine gap for M is the value.js-O ask #12 consume (diagnostic surfacing of spec-invalid
keyframe declarations). The MCP surface is a BOOK-with-tripwire (user-domain satellite
package on authorization, not a library expansion).

No precept violations found in L-as-built for this wave.
