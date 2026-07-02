# Lane a08-w4-engine-subpath — R.W4 `./engine` subpath deep audit

**Scope.** The `@mkbabb/keyframes.js/engine` static subpath added by R.W4 / R.W4b:
`src/animation/engine/public.ts` (the "39-key mirror"), the `package.json`
`exports["./engine"]` entry, the two gates that touch it
(`proof:in-is-importable`, `proof:published-surface`), and the vite
`engineDtsRollupPlugin` that produces its `.d.ts`. Central question from the
charter: **is the static mirror drift-proof — does a gate FAIL if
`loadAnimationEngine()` and `./engine` diverge?**

---

## Executive summary

R.W4 shipped a genuinely useful, correct-*today* feature: a stable static
`import { CSSKeyframesAnimation } from "@mkbabb/keyframes.js/engine"` that
answers the owner's "what's our IN?" question and fixes the 5.0.0 README
Quick-Start hole (a snippet that instantiated a type-only-erased symbol). The
build wiring is sound: two named vite entries share ONE engine chunk (no
duplication — `dist/engine/index.js` is 1.8 KB of thin re-exports), and I
verified the runtime surfaces match exactly today: **`loadAnimationEngine()` =
39 keys, `./engine` = 39 keys, symmetric-difference empty.**

But the headline charter question resolves **NO — the static mirror is NOT
drift-proof.** The equality that R.W4b's FINAL.md asserts as fact ("39 keys ≡
`loadAnimationEngine()`", `FINAL.md:19-20`) is enforced by **no gate**. The
R.W4 spec designated `proof:published-surface` clause (d) as the drift oracle
(`R.W4.md:79-83`), but that clause diffs `loadAnimationEngine()`'s runtime keys
against the hand-written `AnimationEngine` **interface** — it never imports
`dist/engine/index.js` at all. `public.ts` was a *later* pivot (R.W4b) the spec
did not anticipate: the spec assumed the subpath would point at the zone-pure
`engine/index.ts`; when that returned `AnimationGroup: undefined`
(`PROGRESS.md:64`), R.W4b introduced `public.ts` as a **third, un-gated,
hand-maintained parallel definition** of the heavy surface. The only runtime
assertion on the subpath is `proof:in-is-importable` clause (1), which spot-
checks a **single** key (`typeof CSSKeyframesAnimation === "function"`,
`proof-in-is-importable.mjs:92`). Drop the other 38 re-exports from `public.ts`
and every gate stays green.

Severity is HIGH not because it's broken now (it isn't) but because the
mechanism is three hand-kept lists with the drift-gate wired to the wrong two
of them — exactly the failure class R.W4's own spec set out to close, re-opened
by R.W4b's pivot and never re-closed.

The dual surface itself (lazy `loadAnimationEngine()` + eager `./engine`) is
architecturally coherent and worth keeping — they serve different consumers and
the subpath does not breach the light/heavy boundary (it's heavy-only, opt-in).
The right S move is not to remove either surface but to **unify their source of
truth**: make `loadAnimationEngine()` dynamically import `./engine/public`
instead of hand-assembling 13 modules via `Object.assign`, collapsing the
runtime mirror into the subpath barrel and letting clause (d) transitively gate
both.

---

## Findings

### F1 — HIGH · The static mirror has no drift gate; clause (d) protects the wrong pair

**Evidence.**
- `public.ts` is a hand-authored re-export barrel (`src/animation/engine/public.ts:52-143`) whose docstring *claims* "its runtime keys ⊇ `loadAnimationEngine()`'s (minus `animate`)" and "it MATCHES `load-engine.ts`'s `AnimationEngine` interface key for key" (`public.ts:12-13,26-28`) — but nothing verifies the claim.
- The designated drift gate, `proof:published-surface` clause (d), imports the **`.` barrel** and calls `loadAnimationEngine()` (`proof-published-surface.mjs:435,440`), then diffs `Object.keys(engine)` against the `AnimationEngine` **interface** keys parsed from the d.ts (`:445-456`). It **never imports `dist/engine/index.js`**. So it gates `AnimationEngine` interface ↔ `loadAnimationEngine()` runtime — not the subpath.
- The only subpath runtime assertion is `proof:in-is-importable` clause (1): a **single** key, `typeof mod.CSSKeyframesAnimation !== "function"` (`proof-in-is-importable.mjs:92-99`).
- No test imports the subpath's full surface: `grep -rln "keyframes.js/engine\|dist/engine" test/` → none.
- I ran the diff the missing gate would run (scratchpad `diff-surface.mjs`, read-only over built `dist/`): `loadAnimationEngine()` 39 keys, `./engine` 39 keys, both set-differences empty. **Correct today, unenforced.**
- The R.W4 spec explicitly reasoned clause (d) "provides the drift-detection that makes the hand-maintained interface safe" (`R.W4.md:81-83`) — but that reasoning predates R.W4b's `public.ts` and applies only to the interface, which is a *different artifact* (`load-engine.ts:118-203`) fed to `loadAnimationEngine()`, not to `dist/engine/index.js`.

**Failure scenario.** A Tranche-S wave adds a new heavy export (say
`compileToWAAPI`) to `loadAnimationEngine()` + the `AnimationEngine` interface.
Clause (d) forces those two to stay paired (it reds if they diverge), so the
author updates both — but forgets `public.ts`. Result: `import {
compileToWAAPI } from "@mkbabb/keyframes.js/engine"` resolves to `undefined`
for every static-subpath consumer while the lazy consumer sees it. **No gate
reds.** Symmetrically, a stale `public.ts` key that outlives its removed impl
would ship a broken re-export with no red.

**Proposal.** Add a clause (a `proof:in-is-importable` clause (4), or a new
`proof:engine-subpath-mirror` gate) that imports **both** built artifacts and
asserts `Object.keys` set-equality: `dist/engine/index.js` ≡
`loadAnimationEngine()`. This is the exact 12-line check I ran as evidence;
promote it to a gate. (F3 offers a structural alternative that deletes the need
for it.)

---

### F2 — MEDIUM · The subpath `.d.ts` is existence-checked only, never content-checked; the dts plugin soft-fails green

**Evidence.**
- `proof:in-is-importable` clause (1) checks the subpath's types with `fs.existsSync(typesTarget)` only (`proof-in-is-importable.mjs:75-85`) — no size floor, no symbol check. Contrast `proof:published-surface` clause (a), which content-checks the **barrel** d.ts against the 12-byte `export {}` stub failure mode (`proof-published-surface.mjs:250-254`) — but that guard is scoped to `dist/keyframes.d.ts`, never `dist/engine/index.d.ts`.
- `engineDtsRollupPlugin` (`vite.config.ts:38-163`) has two soft-fail paths — `this.warn(...); return;` when declarations don't emit (`:86-90`) and when API Extractor produces no roll-up (`:149-153`) — that **leave the previous `dist/engine/index.d.ts` in place and keep the build GREEN**. It only overwrites on success (`copyFileSync`, `:159`).

**Failure scenario.** An S refactor breaks the engine-subgraph tsc emit or the
API-Extractor followability (recall R.W4b already hit "Unable to follow symbol"
on `ScrollAxis`, patched by pinning `lib` at `:110-124` — a fragile seam).
The plugin warns and returns; the build is green; an incremental build over an
existing `dist/` ships a **stale** `dist/engine/index.d.ts` that no longer
matches the JS. Static-subpath TS consumers get wrong/rotted types with no red.

**Proposal.** Extend the subpath-mirror gate (F1) or clause (a) to content-
check `dist/engine/index.d.ts`: assert it declares the core heavy types
(`AnimationGroup`, `MorphSVG`, `ScrollScene`, `CSSKeyframesAnimation` — I
confirmed 173 such declarations exist today) and is not a stub. Separately,
harden the plugin's warn-return paths to **fail the build** rather than ship a
stale artifact (or delete the target before emit so a failure yields an
absent file that clause (1)'s `existsSync` at least reds on a clean tree).

---

### F3 — MEDIUM (architecture) · Triple parallel definition of the heavy surface; unify the source of truth in S

**Evidence.** The heavy surface is now spelled out THREE times, by hand:
1. The `AnimationEngine` interface — 39 members, each with per-member tranche-provenance JSDoc (`load-engine.ts:118-203`).
2. The `loadAnimationEngine()` runtime composition — a 13-module `Promise.all` + a hand-written `Object.assign` mapping every key (`load-engine.ts:243-338`).
3. The `public.ts` re-export barrel — the subpath source (`public.ts:52-143`).

Clause (d) gates (1) ↔ (2). Nothing gates (3) (F1). A 4th roster —
`scripts/lib/agent-surface.mjs` — also enumerates the surface but is *derived*
from the `docs/published-surface.md` manifest table (`agent-surface.mjs:44`),
so it is not fully independent.

**Proposal (the real S fix).** Collapse (2) into (3). `public.ts` already uses
`export * as presets from "../presets"` and re-exports every heavy symbol, so a
dynamic `import("./engine/public")` yields a module namespace with **exactly**
the 39 keys `loadAnimationEngine()` hand-assembles. Rewrite:

```ts
export const loadAnimationEngine = (): Promise<AnimationEngine> =>
    (_enginePromise ??= import("./engine/public"));
```

This deletes the 13-import `Promise.all` + `Object.assign` block
(`load-engine.ts:243-338`), makes `public.ts` the ONE runtime composition, and
means clause (d) — which diffs `loadAnimationEngine()` against the interface —
now transitively gates the subpath too (because the subpath *is* what
`loadAnimationEngine()` returns). Three hand-lists → one barrel + one gated
interface. Needs verification that `proof:boundary` stays green (a single
`import("./engine/public")` is still a dynamic edge, so the light barrel keeps
zero static value.js edge) and that rolldown's chunking of `public.ts`'s static
graph does not regress the lazy-load waterfall vs the current 13 parallel
`import()`s — measure before committing.

---

### F4 — LOW · The dual "in" is taught in two places with two idioms

**Evidence.** R.W4 rewrote the README Quick Start to teach the **static
subpath** import (the gate `proof-in-is-importable.mjs:138` accepts `.` *or*
`/engine`), while `src/animation/CLAUDE.md` and root `CLAUDE.md` teach the
**lazy** `const { CSSKeyframesAnimation } = await loadAnimationEngine()` idiom.
Both are legitimate, but a newcomer meets two different "ins" depending on
which doc they open.

**Proposal.** Not a bug — a coherence nit. S should state the choice once: the
eager `./engine` subpath is the default teaching "in" for a consumer who *knows*
they want the heavy engine; `loadAnimationEngine()` is for lazy/boundary-
sensitive consumers. One sentence in each doc cross-linking the other.

---

### F5 — LOW · `src/animation/CLAUDE.md` is stale against the R.W1 zone partition (out-of-lane, flagged)

**Evidence.** `src/animation/CLAUDE.md` still documents the pre-R.W1 **flat**
file layout (`engine.ts`, `group.ts`, `waapi.ts`, `motion-path.ts`, … as
top-level files) — the R.W1 wave moved these into zone directories
(`engine/`, `group/`, `svg/`, `physics/`, …). This is doc-rot adjacent to the
subpath (the subpath's whole rationale is the zone partition) but not the
subpath itself.

**Proposal.** S doc-refresh pass should rewrite `src/animation/CLAUDE.md` to the
7-zone tree. (Cross-check with other pass-1 lanes auditing R.W1/R.W2 so it's
fixed once.)

---

## Tranche-S implications

Concrete, wave-shaped:

- **S wave "engine-subpath-mirror gate" (closes F1 + F2).** Promote the
  read-only diff I ran as evidence into a real gate: import both built
  artifacts, assert `Object.keys(dist/engine/index.js)` ≡
  `Object.keys(loadAnimationEngine())`, AND content-check
  `dist/engine/index.d.ts` (non-stub, declares the core heavy types). Wire into
  `proof:hygiene-chain`. This is ~20 lines and closes the headline drift hole
  regardless of whether F3 lands. **Born-RED test:** delete one re-export line
  from `public.ts`, confirm red; restore, confirm green.

- **S wave "unify the heavy-surface source of truth" (structural, closes F3 and
  supersedes half of F1).** Rewrite `loadAnimationEngine()` to
  `import("./engine/public")`; delete the `Promise.all`/`Object.assign` mirror.
  Verify `proof:boundary` + the lazy-chunk waterfall are unaffected. This is the
  altitude-correct fix — it removes a hand-list rather than gating it — and
  aligns with the S charter's "NO legacy/redundant code" thrust. Sequence it
  *after* the F1 gate lands so the gate proves the refactor preserved equality.

- **S wave "dts-plugin honesty" (folds F2's plugin half).** Change
  `engineDtsRollupPlugin`'s `this.warn(...); return;` soft-fails
  (`vite.config.ts:86-90,149-153`) into hard build failures (or delete the
  target pre-emit). A type roll-up that silently doesn't regenerate is the same
  class of bug as the 12-byte-stub failure the barrel already guards — the
  subpath deserves the same guard.

- **S doc pass (folds F4 + F5).** Rewrite `src/animation/CLAUDE.md` to the
  R.W1 zone tree and state the two-"in" policy once. Coordinate with the R.W1/R.W2
  audit lanes to avoid double edits.

- **Method note for the tranche process.** R.W4 is a case where the SPEC's
  drift-proofing reasoning (`R.W4.md:79-83`) was sound for the surface the spec
  imagined (`engine/index.ts`) but was **not re-validated after the R.W4b
  pivot** to `public.ts` introduced a new un-gated artifact. The wave closed
  GREEN and FINAL.md asserted the equality as fact (`FINAL.md:19-20`) without a
  gate behind it. S should adopt a rule: **when an IMPL pivots the artifact a
  spec's gate was designed to protect, the gate must be re-pointed or a new one
  born in the same wave** — an assertion in a FINAL.md is not a gate.
