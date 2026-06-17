# L.W6 — Agent-authoring surface

- **Band:** A · **Class:** SHIP-in-L · **Dep:** L.W1 + L.W2 (the refusal surface must be TOTAL before the verb projects it) · value.js 0.13.0 (already pinned `^0.13.0`)
- **Gate (new):** `proof:agent-validate` — born-RED on today's tree because neither the `validate` export nor the gate script exists; GREEN when all four S-clauses pass. Secondary: `proof:agent-surface` extended to admit `validate` + `explain` in the llms.txt export roster — RED today because the verb is absent from every generated index.

---

## Context

### Why the verb is the moat's FORWARD direction

The kf moat is bi-directional CSS: INGEST → ANIMATE → COMPILE. The backward
half (`compileToCSS`, K.W10) closes the loop from JS back to CSS. The forward
half is not a NEW direction — it is the VALIDATION layer over the compile
surface: "will this `@keyframes` block ship faithfully?" is the first question
an LLM agent asks before it decides whether to suggest kf at all.

Every PART of the answer already exists and is gate-proven:

| Component | Location | What it knows |
|-----------|----------|---------------|
| `DiagnosticCode` enum | `adapter.ts:25-31` | parse/honoring failures: `EMPTY_PARSE`, `UNKNOWN_TIMING_FN`, `COMPOSITION_FALLBACK`, `PARSE_ERROR`, `CORS_SKIP`, `WAAPI_INELIGIBLE` |
| `Diagnostic[]` channel | `adapter.ts:45-92` (`ResolvedKeyframes.diagnostics`) | every silent fallback the resolve path used to swallow, now a citable row |
| `CompileRefusalReason` | `compile.ts:74-78` | four named axes: `weighted-blend`, `custom-renderer`, `perceptual-oklab`, `computed-unit-drift` |
| `CompileRefusal[]` | `compile.ts:80-87` (member of `CompiledCSS`) | per-child refusal name + reason + message |
| `WAAPIEligibility` | `waapi.ts:71-73` | `{ eligible: true }` or `{ eligible: false; reason: string }` |
| `isWAAPIEligible` | `waapi.ts:109-...` | the single source of truth for compositor-thread delegation |

No new ENGINE code is required. The verb is a **read-only projection** over
three existing typed channels onto one agent-shaped result type. The distinction
between this and the existing channels is altitude: a consumer today must call
`resolveKeyframes` (adapter), then `compileToCSS` (compiler), then
`isWAAPIEligible` (waapi) independently and join the results manually. The agent
verb does the join, validates that the inputs are parse-safe before compiling,
and returns a single flat envelope the LLM can branch on without scraping
message strings.

### Audit evidence

Lane 35 (completion-lanes-32-36.txt):
- `[high/L-WAVE-CANDIDATE]` "The agent-authoring VERB is genuinely net-new — not
  captured by W127 or anywhere in the L wave map"
- `[high/L-WAVE-CANDIDATE]` "Every PART of validate(css) already exists — the verb
  is a pure read-only projection over three existing typed channels"
- `[high/KILL]` "A generate-from-intent verb is OUT OF SCOPE — proposing it would
  be the one real precept tension (KISS / inv-16)"
- `[med/L-WAVE-CANDIDATE]` "llms.txt must teach the LOOP, not just list the verb"
- `[med/L-WAVE-CANDIDATE]` "The verb should validate the FULL round-trip surface
  L.W1/L.W2 close, not just today's subset — sequencing dep"
- overfitting tripwire: "L.W-AGENT-AUTHOR must NOT add a public surface without
  a current consumer"

Lane 32:
- `[high/L-WAVE-CANDIDATE]` "GAP (the untapped moat-multiplier): no agent/LLM
  AUTHORING verb — kf indexes capabilities for agents but offers no VALIDATE verb
  the agent can call"

Lane 33 (gate blind-spot):
- `proof:agent-surface` (existing, `scripts/proof-agent-surface.mjs`) asserts
  that `llms.txt` does not drift from the published-surface manifest. It does NOT
  assert that the validate/explain verb exists or that the llms.txt LOOP teaching
  is present — those are absent today.

### The KILL — `generate()` is off-axis (GEN-1, L charter §KILL)

`generate(intent: string): string` — LLM generates `@keyframes` text from a
natural-language prompt — is OUT OF SCOPE. The LLM is the generator; kf is the
validator and compiler. Adding a generation surface would require an LLM call
inside the library, which violates inv-16 (kf writes only its own engine), the
KISS precept (the library would need an API-key channel, a model selection
surface, retry logic — all off the animation axis), and the overfitting rule
(a public API with no current consumer other than "agents might want it"). Lane
35 explicitly records GEN-1 as a standing KILL: "add to L's anti-charter, none —
a documentation/anti-charter decision, non-re-litigable."

### The substrate the deps deliver

L.W6 gates on L.W1 + L.W2 precisely because the verb must project an HONEST
surface. Today, before L.W1, the projection would LIE in the OTHER direction:

- `!important` is silently dropped (`adapter.ts` `declsToVarMap` reads only
  `decl.name`/`decl.value`, discards `Declaration.important`), so a validate call
  over `opacity:0 !important` would falsely report `eligible:true` over a lossy
  artifact (the emitted CSS lost the flag). L.W1 S1 HONORS the flag (emits it
  faithfully); validate then honestly reports the input parseable + eligible.
- `@property` blocks are never backward-serialized (`engine.ts:1225`), so a
  validate call on CSS with `@property` would pass `parseable: true` while the
  compiled artifact silently drops the registration — eligibility would be
  overclaimed. L.W1 S2 wires `serializeStylesheetItem` so the block round-trips;
  validate then honestly reports it eligible.
- The multi-color silent-densify (`compile-color.ts:188-190`) ships
  `eligible: true` with a ΔE=0.82 drift — the refusal surface is incomplete
  (⚠28, W113). L.W2's CC-3.5 closes this so validate can honestly project the
  REMAINING refusal (clause (d)).

After L.W1 + L.W2 these holes are closed; the projection is honest — it reports
the honored surface as eligible and the genuinely-unsupported surface (multi-color
densify, weighted-blend) as refused. L.W6 is a sequencing obligation, not a
feature-creep hedge. The verb adds NO new drop-diagnostic — it READS the channels
L.W1/L.W2 already make honest.

---

## Scope

### S1 — `validate(css)` read-only projection

**Deliverable.** A new HEAVY export `validate(css: string, opts?: ValidateOptions): ValidateResult` in `src/animation/validate.ts`, re-exported via `loadAnimationEngine()`. It:

1. Calls `parseCSSStylesheet(css)` (value.js — `adapter.ts`'s existing import path) and collects the `OnParseError` diagnostics into the `Diagnostic[]` channel.
2. Calls `resolveKeyframes(css, opts?.target)` (adapter) and collects its `diagnostics[]`.
3. Calls `compileToCSS({ children: [animation] }, opts?.compile)` (compile) and reads `{ eligible, refusals }`.
4. Calls `isWAAPIEligible(animation)` (waapi) and reads the result.
5. Returns a **flat, agent-shaped envelope** — no scraping, no free text branching:

```ts
export interface ValidateResult {
    /** True iff value.js parsed the CSS without errors. */
    parseable: boolean;
    /**
     * True iff compileToCSS produced an artifact for every child — the
     * compile surface's own `eligible` flag. False when any child refused.
     */
    eligible: boolean;
    /** CC-3 refusals — one per child that could not compile. Empty on success. */
    refusals: CompileRefusal[];
    /**
     * All parse/honoring diagnostics from resolveKeyframes — every SILENT
     * fallback the adapter used to swallow, now a citable row. Empty on
     * a clean parse.
     */
    diagnostics: Diagnostic[];
    /**
     * The WAAPI eligibility verdict — { eligible: true } or
     * { eligible: false; reason: string }. Separate from compile-eligible:
     * a block can be compile-eligible (CSS faithful) yet WAAPI-ineligible
     * (color interpolation, computed units) and vice versa.
     */
    waapi: WAAPIEligibility;
}
```

The type lives in `validate.ts`. Every constituent type (`CompileRefusal`,
`Diagnostic`, `WAAPIEligibility`) is already exported or re-exported from the
barrel — no new type is invented. The ONLY new value is the join logic.

**Boundary.** `validate.ts` is HEAVY (it imports `adapter.ts`, `compile.ts`,
and `waapi.ts`, all of which carry static `@mkbabb/value.js` edges). It is
reached ONLY via `loadAnimationEngine()`; `proof:boundary` stays green.
`ValidateResult`, `ValidateOptions`, and `validate` itself are re-exported as
`import type` on the static barrel (erased; no static value.js edge).

**Falsifiable.** The gate (S4 below) runs `validate` over a fixture that
contains `opacity: 0 !important` (the ⚠31 input). L.W1 HONORS the flag — after
L.W1 `validate` reports the input `parseable:true` + `eligible:true` and emits
the `!important` faithfully on the backward pass (no drop, no drop-diagnostic).
The gate asserts the POSITIVE post-cure verdict — RED on today's tree because
the `validate` export does not exist (clause (a)), GREEN once `validate` ships
and the L.W1 honor cure has landed so the verdict is honest.

### S2 — `explain(css)` human-readable projection

**Deliverable.** A companion HEAVY export `explain(css: string, opts?: ValidateOptions): string` in `validate.ts` that calls `validate(css, opts)` and formats the result as a concise, structured, human-and-LLM-readable string — the same shape the demo's ineligibility panel (CC-4) produces but as a first-class library API. Format (not a free-text generator — fully deterministic from the typed result):

```
@keyframes <name>:
  parseable: yes
  compile-eligible: no
    – weighted-blend: "foo" cannot compile: weighted blend has no CSS twin
  waapi-eligible: no
    – color interpolation (oklab — the browser would sRGB-lerp)
  diagnostics:
    – COMPOSITION_FALLBACK: opacity is not a numeric composite leaf
```

`explain` is the surface the llms.txt LOOP teaching links. An LLM agent can
call `explain(css)` and present the result verbatim to the user or parse it for
a fix suggestion. The string is deterministic (field order fixed; no locale-
sensitive formatting) so a doctest in the gate can assert it byte-for-byte.

**Overfitting guard.** `explain` has a current consumer: the llms.txt LOOP
teaching (S3) links it explicitly, and the `proof:agent-validate` gate (S4)
calls it. The "no public surface without a current consumer" rule (audit Lane
35 overfitting tripwire) is satisfied at ship.

### S3 — llms.txt LOOP teaching

**Deliverable.** `gen-agent-surface.mjs` (the generator `proof:agent-surface`
asserts against) gains a new `## Agent authoring loop` section in the generated
`llms.txt` / `llms-full.txt`. The section teaches the validate→fix→compile
LOOP — not a narrative, a structured code block the LLM can follow:

```
## Agent authoring loop

kf validates + compiles; the LLM generates and fixes. Pattern:

  const { validate, loadAnimationEngine } = await loadAnimationEngine();
  const result = await validate(css);
  if (!result.parseable) { /* fix parse errors from result.diagnostics */ }
  if (!result.eligible)  { /* inspect result.refusals; offer JS playback */ }
  if (!result.waapi.eligible) { /* note result.waapi.reason; animation runs on rAF */ }
  // if result.eligible: offer compileToCSS output

  // explain(css) returns the same verdict as human-readable text:
  console.log(await explain(css));
```

The section is generated (not hand-maintained), so it cannot drift from the
actual exports. `proof:agent-surface` clause (a.2) (the set-equality check on
the llms-full export roster) already fires if the verb is added to the surface
but not regenerated. The new clause (a.5, S4 below) fires if the LOOP section
is missing.

**Gate coupling.** `gen-agent-surface.mjs` generates the LOOP block IFF
`validate` and `explain` are present in the published-surface manifest. Before
S1+S2 land, the manifest has no `validate` row → the generator emits no LOOP
section → `proof:agent-validate` clause (b) asserts the section exists → RED.
After S1+S2 the manifest gains the rows, the generator emits the section, and
the gate greens.

### S4 — `proof:agent-validate` (the born-RED gate)

**Deliverable.** A new gate script `scripts/proof-agent-validate.mjs` + a new
`"proof:agent-validate"` entry in `package.json` `scripts` + inclusion in
`proof:all`.

**Clauses:**

**(a) The verb exists on the dynamic surface.**
`loadAnimationEngine()` returns an object whose `validate` and `explain` fields
are functions. RED on today's tree because neither exists.

**(b) The LOOP section exists in llms.txt.**
`llms.txt` contains a `## Agent authoring loop` heading. RED on today's tree
because `gen-agent-surface.mjs` does not emit one (no validate row in the
manifest). Fix: run `node scripts/gen-agent-surface.mjs` after S1+S2.

**(c) `validate` projects the L.W1 POST-CURE state honestly (depends on L.W1
GREEN).**
The gate runs `validate` over a hard-coded fixture string exercising the L.W1
honored surface — `!important`, per-stop `animation-composition`, and an
`@property` block:

```css
@keyframes honored-set {
  from { opacity: 0 !important; animation-composition: add; }
  to   { opacity: 1 !important; }
}
@property --col {
  syntax: '<color>';
  inherits: false;
  initial-value: oklch(50% 0.2 200);
}
```

**Reconciliation with L.W1 (no drop-diagnostic).** L.W1 HONORS `!important` and
`@property` — it parses them as eligible and EMITS them faithfully on the
backward pass (`adapter.ts` `declsToVarMap` reads `Declaration.important`;
`engine.ts:1225` wires `serializeStylesheetItem` for the `@property` block).
There is therefore NO `IMPORTANT_DROPPED` / `PROPERTY_NOT_SERIALIZED` drop
diagnostic to project — those would describe a drop L.W1 REMOVES. `validate`
projects the POSITIVE post-cure verdict instead:

- `result.parseable === true` — value.js parsed the block; `!important` and the
  `@property` registration are recognized, not refused.
- `result.eligible === true` — the honored surface compiles faithfully (the
  `!important` declaration and the `@property` block round-trip; no
  `CompileRefusal` is raised for either).
- `result.diagnostics` carries NO drop-row for `!important` or `@property` (the
  honor cure means the silent-fallback channel is empty for these inputs).

**RED-today witness.** The RED on today's tree is the ABSENCE of the `validate`
export, NOT a drop-diagnostic: `loadAnimationEngine().validate === undefined`
(clause (a)). The clause-(c) gate is authored to depend on L.W1 (+ L.W2) being
GREEN — it asserts the post-cure verdict, and turns GREEN only once `validate`
ships (S1) AND the L.W1 honor cures have landed so the projection is honest. The
honored surface is the gate's POSITIVE oracle; the REMAINING refusals (multi-color
densify, weighted-blend) are the projection's negative arm (clause (d)).

**(d) `validate` projects the L.W2 multi-color refusal honestly.**
Fixture: a two-stop color track that the pre-L.W2 `compile-color.ts:188-190`
would silently densify-and-ship.

```css
@keyframes color-drift {
  from { background-color: oklch(30% 0.3 120); color: red; }
  to   { background-color: oklch(70% 0.1 260); color: blue; }
}
```

Assert: `result.eligible === false` and `result.refusals[0].reason ===
"perceptual-oklab"`. **RED on today's tree** — `compile-color.ts:190` returns
`null` (the multi-color BOOK fallback), the outer loop falls through to the
verbatim sRGB emit with `eligible: true`. GREEN after L.W2 CC-3.5 closes the
silent-densify hole.

**(e) `proof:agent-surface` clause (a.5) — the LOOP section is not stale.**
After S3 lands, `proof:agent-surface` gains a new (a.5) clause: the on-disk
`llms.txt`'s `## Agent authoring loop` section matches a fresh generation from
`gen-agent-surface.mjs`. The mechanism is the same byte-identity check clauses
(a.4) uses. **RED on today's tree** because the section does not exist.

**Witness summary (today → GREEN path):**

| Clause | RED-today witness | GREEN-cure |
|--------|-------------------|------------|
| (a) | `loadAnimationEngine().validate === undefined` | S1 exports `validate` |
| (b) | `llms.txt` has no `## Agent authoring loop` | S3 adds LOOP; `gen-agent-surface.mjs` emits it |
| (c) `!important`/`@property` honored | `validate` absent (`loadAnimationEngine().validate === undefined`); no verb to project the post-cure verdict | S1 exports `validate` + L.W1 S1/S2 honor cures land → `parseable:true`, `eligible:true`, no drop-row |
| (d) multi-color refusal | `compile-color.ts:190` silent null → eligible:true | L.W2 CC-3.5 closes the hole |
| (e) LOOP section stale | section absent | S3 + regenerate |

---

## Deps

- **L.W1 (replay-equality FLOOR):** the `!important` honor (`adapter.ts`
  `declsToVarMap` reads `Declaration.important`; `format.ts` emits ` !important`)
  and the `@property` backward-serialize (`engine.ts:1225` wires
  `serializeStylesheetItem`) must LAND before clause (c) can GREEN. L.W1 HONORS
  these inputs (no drop, no drop-diagnostic) — clause (c) projects the POSITIVE
  post-cure verdict (`parseable:true`, `eligible:true`, empty drop-channel), not a
  drop code. The RED-today witness is the absence of the `validate` export, not a
  missing diagnostic member.

- **L.W2 (compiler completeness):** CC-3.5 (close the multi-color silent-densify at
  `compile-color.ts:188-190`) must close before clause (d) can GREEN.

- **value.js 0.13.0** — already pinned (`^0.13.0`). `parseCSSStylesheet` (adapter
  import path), `Declaration.important` (`stylesheet.d.ts:5`), `PropertyDescriptor` /
  `serializeStylesheetItem` (serialize.d.ts), and `sampleColorRamp`/`deltaEOK`
  (compile-color) are all in the published 0.13.0 cut. No new sibling publish gate.

- **No glass-ui dep.** `validate`/`explain` are purely engine-internal (HEAVY,
  no DOM, no demo component). The demo already dogfoods the compile surface via
  `KeyframesStringControls.vue:50,256-291`; it can call `validate` without a
  new UI component.

---

## Bite — what each gate clause catches as regression

| Clause | Regression caught |
|--------|-------------------|
| (a) verb exists | `validate`/`explain` accidentally tree-shaken or removed from the `loadAnimationEngine()` return; boundary violation that drops them from the dynamic chunk |
| (b) LOOP in llms.txt | `gen-agent-surface.mjs` edited to drop the LOOP section; or a manifest change removes `validate` without regenerating the index |
| (c) `!important`/`@property` honored | A refactor of `adapter.ts` `declsToVarMap` (drops `Declaration.important`) or the `@property` backward-serialize path (`engine.ts:1225` drops the `serializeStylesheetItem` call) — `validate` would flip `eligible` false or re-introduce a drop-row, and the post-cure projection reds |
| (d) multi-color refusal | A change to `compile-color.ts:188-190` that reverts the CC-3.5 fix and reintroduces the silent null fallback — `eligible` would flip back to `true`, the gate reds |
| (e) LOOP stale | `llms.txt` hand-edited away from the generator's output — the (a.5) byte-identity check fires |
