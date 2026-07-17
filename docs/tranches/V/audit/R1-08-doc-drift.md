# R1-08 — DOC + CANON DRIFT

Lane: R1-08 (doc/canon drift). Date: 2026-07-16. Prefix: DR-.

## Verdict

The prose surface is mostly sound and, notably, the seed hypotheses are largely
**false**: "weighted blending / BlendMode" is NOT a removed feature the README
still describes — the weight-scalar / `weight-blend` mechanism is alive in
`src/animation/` (`WeightStepper`, `AnimationLayerConfig.weight`, the
`weight-blend` refusal), and README/published-surface correctly describe it.
What WAS removed is the `"weighted"` *op value* and the `BlendMode` type
(MIGRATION-6.0.0 documents this), and no live doc still claims those.

But the GENERATED agent surface is stale and drifted: `llms.txt` /
`llms-full.txt` do not match `scripts/gen-agent-surface.mjs`'s current output
and `llms-full.txt` still advertises the 6.0.0-removed `getTimingFunction`
export — with NO gate enforcing regeneration despite the generator's
"cannot drift" claim (DR-1, P1). Three smaller drifts: a wrong Card API in
demo/DESIGN.md (DR-2), a wrong refusal-reason string in the README table (DR-3),
and an incomplete CHANGELOG 6.0.0 breaking section (DR-4).

---

## DR-1 — Generated agent surface (llms.txt / llms-full.txt) is stale; advertises removed `getTimingFunction`; "cannot drift" is unenforced

Severity: **P1**. Family: generated-artifact-drift.

`scripts/gen-agent-surface.mjs` header (lines 5–20) claims the artifacts are
"GENERATED, NOT hand-maintained, so the index cannot drift from the published
roster" and are "Verified by `proof:agent-surface`". Both claims fail:

**(a) The committed artifacts do not match the current generator.** Running the
generator's own `--check` and diffing against the committed files:

```
$ node scripts/gen-agent-surface.mjs --check > /tmp/gen-out.txt
$ diff llms-full.txt <freshly-generated>   →  47 changed lines
$ diff llms.txt      <freshly-generated>   →  37 changed lines
```

The committed files reference `proof:*` gate names (e.g. `proof:roundtrip-fidelity`);
the current generator emits `check: test/…` file references (e.g.
`test/compile/roundtrip-fidelity.test.ts`). The artifacts were never regenerated
after the generator/roster changed.

**(b) The committed artifact advertises a removed 6.0.0 export.**
`llms-full.txt:157` lists `getTimingFunction` in the HEAVY engine surface roster.
That export was removed in 6.0.0:
- `docs/MIGRATION-6.0.0.md:8` — "`getTimingFunction` is removed from `@mkbabb/keyframes.js/engine` and from the object returned by `loadAnimationEngine()`."
- `CHANGELOG.md:15` — "The engine no longer exports `getTimingFunction`".
- `grep -rn getTimingFunction src/` → **zero hits** (gone from source).
- Fresh generator output → **does not contain `getTimingFunction`** (the roster source `scripts/lib/agent-surface.mjs` already dropped it).

So the committed artifact is stale precisely on the flagship 6.0.0 removal: an
agent reading `llms-full.txt` would believe `getTimingFunction` is a live export.

**(c) The "cannot drift" invariant is vacuous.** No `proof:agent-surface` npm
script exists (`grep "agent-surface" package.json` → only `gen:agent-surface`,
the writer), and no gate/CI step runs `gen-agent-surface.mjs --check` to diff
committed-vs-generated (`grep -rn "gen-agent-surface\|llms" scripts/gates/ .github/`
→ nothing). Nothing prevents the artifacts from drifting; they have.

Disposition: **build** — a wave that (1) regenerates `llms.txt`/`llms-full.txt`
from the current roster, and (2) wires `node scripts/gen-agent-surface.mjs --check`
+ a committed-vs-generated diff into a real `proof:agent-surface` gate in CI, so
the "generated, cannot drift" claim becomes true instead of aspirational.

---

## DR-2 — demo/DESIGN.md `Card surface="cartoon"` describes an API shape the component never exposes

Severity: **P2**. Family: stale-component-api.

`demo/DESIGN.md:67`:
```
* **Controls:** `Card surface="cartoon" tier="quiet"`; …
```

The glass-ui `Card` component has NO `"cartoon"` surface value. `cartoon` is a
separate **boolean** prop; `surface` is an independent prop defaulting to
`"glass"`:
- `glass-ui/src/components/card/Card.vue:18` — `cartoon?: boolean;`
- `Card.vue:30` — `surface: "glass"` (default)
- `Card.vue:36` — `cartoon: false` (default)
- `Card.vue:87` — `cartoon && 'cartoon-surface'`

Every actual demo consumer uses the boolean form, never `surface="cartoon"`:
- `demo/scenes/easing/EasingSidebar.vue:14` — `<Card cartoon tier="quiet" …>`
- `demo/scenes/cube/matrix-editor/MatrixEditor.vue:2` — `<Card cartoon tier="quiet">`
- `demo/scenes/spring/SpringPhysicsFacet.vue:21` — `<Card cartoon tier="quiet" …>`

The DESIGN.md canonical example would produce a `glass`-surfaced card with an
inert unknown attribute — the opposite of the documented "tactile control plane".

Disposition: **fold** into a DESIGN.md refresh — correct line 67 to
`Card cartoon tier="quiet"` (boolean prop), matching the live component and demo
usage.

---

## DR-3 — README refusal-reason table uses `weighted-blend`; the actual `CompileRefusalReason` value is `weight-blend`

Severity: **P2**. Family: stale-api-string.

`README.md:428` presents the refusal reason as a literal code value:
```
| `weighted-blend`      | no `animation-composition` twin exists          | JS `AnimationGroup` |
```

The real union member is `weight-blend` (no trailing `-ed`):
- `src/animation/compile/emit/refusal-probes.ts:5` — `| "weight-blend"`
- `src/animation/compile/emit/refusal-probes.ts:24` — `reason: "weight-blend"`
- `src/animation/compile/emit/backward.ts:236` — `reason: "weight-blend"`
- `src/animation/compile/emit/entry.ts:81,306` — `"weight-blend"`

`grep "weighted-blend" src/` → zero hits. A consumer branching on
`refusal.reason === "weighted-blend"` (copied from the README) would never match.
The sibling reasons in the same table (`custom-renderer`, `perceptual-oklab`,
`computed-unit-drift`, README:429–431) are all correct — only this row drifts.

Disposition: **fold** — one-character README fix: `weighted-blend` → `weight-blend`.

---

## DR-4 — CHANGELOG 6.0.0 breaking section omits two documented breaking removals (`printWidth`, `BlendMode`/`"weighted"` op)

Severity: **P2**. Family: changelog-incompleteness.

`docs/MIGRATION-6.0.0.md` documents two breaking removals that the CHANGELOG
6.0.0 "Major Changes (BREAKING)" section (`CHANGELOG.md:9–20`) does not mention:

1. **`printWidth` removed** from `CompileOptions`, `ViewTransitionCompileOptions`,
   `EntryCompileOptions` — `MIGRATION-6.0.0.md:55–57`. Not in CHANGELOG
   (`grep -n printWidth CHANGELOG.md` → no 6.0.0-section hit).
2. **`BlendMode`, `AnimationLayerConfig.blendMode`, and the `"weighted"`
   operation removed** — `MIGRATION-6.0.0.md:24`. The CHANGELOG 6.0.0 section
   never names these; its only `weighted`/`blendMode` reference is line 232, an
   unrelated 5.x-era patch note.

The migration guide is the authority; the CHANGELOG breaking list should be a
superset of its breaking changes. Both are public-facing API removals a consumer
tracking only the CHANGELOG would miss.

Disposition: **fold** — add two bullets to CHANGELOG 6.0.0 Major Changes:
the `printWidth` removal and the `BlendMode`/`blendMode`/`"weighted"`-op removal,
cross-referencing MIGRATION-6.0.0.

---

## Negatives (checked and found sound)

- **Seed "removed weighted blending/BlendMode still described" is FALSE.** The
  weight-scalar mechanism is live: `AnimationLayerConfig.weight` (types.ts:234),
  `WeightStepper` (types.ts:221), `weightSpring` (types.ts:247), the
  `weight-blend` refusal (refusal-probes.ts). README:322/433/764 and
  published-surface.md:151's "weighted blending" prose correctly describe a
  shipped feature, not a removed one. Only the `"weighted"` *op value* and
  `BlendMode` *type* were removed, and no live doc claims them (see DR-4).
- **README code-sample imports resolve against the 6.0.0 surface.** `CSSKeyframesAnimation`
  from `/engine` (README:12 → public.ts `export * from "./engine"`),
  `loadAnimationEngine` from root (README:130,307 → index.ts), light-barrel
  `NumericAnimation`/`SpringProgress` (README:473 → index.ts). All present.
- **README:141 engine-surface roster is current** — lists `getAnimationId`,
  `resolveKeyframes`, `MotionPath`/`fromMotionPath`, `presets`, `DIRECTIONS`,
  `FILL_MODES`, `defaultOptions`, `defaultLayerConfig`; all in public.ts;
  correctly does NOT list `getTimingFunction`.
- **MIGRATION-6.0.0 value.js citations are valid.** value.js 4.0.0 installed;
  subpaths `./color ./value ./css ./easing ./math ./transform ./quantize` exist;
  `parseKeyframeSelector` in `dist/subpaths/css.d.ts`; `SpaceId` in
  `dist/subpaths/color.d.ts`.
- **No stale `parse-that` / value.js root-import prose.** `grep` for
  `parse-that` and `from "@mkbabb/value.js"` (root) across README/DESIGN/
  published-surface/llms → CHANGELOG history only (correctly noting parse-that
  stays removed); no doc instructs a root value.js import.
- **No residual Value 3 / `ValueUnit` / `InterpolatedVar` prose** in README /
  published-surface / llms / DESIGN — only in MIGRATION-6.0.0, correctly framed
  as removed.
- **CHANGELOG documents the `getTimingFunction` removal** correctly at line 15
  (the drift is only in the generated llms artifacts — DR-1).
- **package.json has no `@mkbabb/glass-ui` edge**, consistent with CHANGELOG
  6.0.0's "The producer tag has no Glass dependency" (node_modules carries
  glass-ui 7.0.0 as the later demo-consumer edge; not a doc drift).

## Coverage gaps

- Did not line-by-line reconcile all 47 (llms-full) + 37 (llms.txt) drifted
  lines — verified the `getTimingFunction` removal and the proof→check format
  change; the remaining delta is the same regeneration debt.
- Did not build `dist/` to diff the emitted `.d.ts` public surface against
  README:141's claimed `AnimationEngine` roster (surface-lane R1-02 territory);
  verified against source `public.ts` only.
- Did not exercise README prose runtime claims (e.g. `bumpLayoutEpoch()` at
  README:268, a value.js consumer call) end-to-end.
- Glass version prose (Glass 6 at CHANGELOG:34 vs Glass 7 at CHANGELOG:28 vs
  installed 7.0.0) left to the manifest/consume lane; read as intended version
  progression, not asserted as drift.
