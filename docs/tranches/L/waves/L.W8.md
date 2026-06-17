# L.W8 — SOTA usability + publish/dogfood completion

- **Band:** A · **Class:** SHIP-in-L · **Dep:** `@mkbabb/keyframes.js@4.3.0` published
  (confirmed `npm:latest`); no new sibling publish gate required for Band A
- **Gate (born-RED):** `proof:demo-on-published-surface` with `KFVUE_INVERSION_LANDED=1`
  (zero-deep-import assertion, currently STAGED / non-biting) + NEW
  `proof:keyframes-vue-published` + NEW `proof:animate-orchestration` — all three RED on
  today's tree; GREEN only when all five S-clauses cure

---

## Context

Four independent findings converge on a single completion wave. They share one
substrate: **kf 4.3.0 is already published** (the Band A release that gates all of
them), yet none of the four publication/dogfood arcs have closed. The audit's
Lane 34 one-liner (`[med/ALREADY-DONE] Demo dogfood is SOURCE-level, not
PUBLISHED-BARREL-level`) and Lane 36 `[med/L-WAVE-CANDIDATE]`s (`keyframes-vue
is UNPUBLISHED…`, `release.yml publish job runs a thinner gate roster than
ci.yml`) are the completion band. Lane 32's W127 (`L.W-FRONT-DOOR — extend
animate()`) and W129 (`keyframes-react BOOK`) close the API-surface arc.

### Finding 1 — ED-3 dogfood inversion: 63 deep-import files (114 import sites), zero barrel imports (W125)

`proof:demo-on-published-surface` (`scripts/proof-demo-on-published-surface.mjs`)
confirms in its staged-posture clause (b·staged) that **63 demo files import
`@src/animation/*`** (114 import sites across those files) — the deep-source
path — and **zero** import `@mkbabb/keyframes`. The gate's `deepFiles` census
is the FILE count (`grep -rl @src/animation demo/` = 63); the 114 is the
import-SITE count (`grep -rn` = 114 lines). The vite self-alias (`vite.config.ts` `@mkbabb/keyframes.js →
src/animation/index.ts`) is present (clause (a) GREEN), but the inversion has never
been executed. K.W12 STAGED the work; L.W8 closes it.

The env gate that flips clause (b) to the full zero-deep-import assertion is
`KFVUE_INVERSION_LANDED=1` (`proof-demo-on-published-surface.mjs:65`). Today
that env is unset — the gate reports census counts but does NOT assert zero. The
cure is: flip every `@src/animation/*` import in the demo to the barrel specifier
(`@mkbabb/keyframes.js` for the LIGHT exports and `await loadAnimationEngine()`
for the HEAVY ones), then run with `KFVUE_INVERSION_LANDED=1` to bite the zero
assertion. With that flag set on today's tree, clause (b) REDS immediately because
`deepFiles > 0`.

**Audit evidence:** audit W125 (`HIGH-severity`); Lane 34 `[med/ALREADY-DONE]`; Lane
33 `★ ED-3 dogfood inversion NOT landed — demo still imports deep @src paths; zero
@mkbabb/keyframes barrel imports in demo`.

### Finding 2 — keyframes-vue 0.1.0: staged, NOT published (W56)

`packages/keyframes-vue/package.json` declares version `0.1.0` and a
`peerDependencies` floor of `@mkbabb/keyframes.js >=4.2.0`. The package source is
complete (`packages/keyframes-vue/src/Keyframes.ts`,
`packages/keyframes-vue/src/useKfAnimation.ts`, `packages/keyframes-vue/src/index.ts`).
`npm show @mkbabb/keyframes-vue` returns no result — the package is not on the
registry. No `proof:keyframes-vue-published` gate exists. No release.yml step
covers the sibling package.

The peer floor `>=4.2.0` is stale — 4.3.0 is the minimum that ships the K.W7–W11
surface the `Keyframes` component exercises at mount (`loadAnimationEngine()` for
scroll-scene + compile). The floor must advance to `>=4.3.0` before publish.

The dogfood loop (the demo consuming `@mkbabb/keyframes-vue` rather than the raw
composable wired by hand) cannot close until the package is on npm. The React BOOK
(W129) is tripwire-gated on this publish: `K.W12.md:86` records "BOOK (React) —
no battle-tested code to extract and no dogfood demo to dogfood-invert against."
The Vue adapter publish is the pattern-proof tripwire the BOOK requires.

**Audit evidence:** audit W56, W125, W129; Lane 36 `[med/L-WAVE-CANDIDATE]
keyframes-vue is UNPUBLISHED with zero publish automation`; `CROSS-REPO-ASK` entry
`keyframes-vue scaffolded 0.1.0 but UNPUBLISHED`; Lane 34 finding.

### Finding 3 — animate() does not dispatch the orchestration tier (W127)

`src/animation/animate.ts` (`185 LOC`) dispatches four `CSSKeyframesAnimation`
shapes: CSS string (`fromString`), keyframe map (`fromKeyframes`), vars array
(`fromVars`), and MotionPath spec (`fromMotionPath`). The orchestration tier
— `Sequence`, `stagger`, `flip`, `drag`, `decay` — is wholly LIGHT and wholly
**unreachable via `animate()`**. A consumer that wants a staggered multi-element
sequence has no single-call entry point: they must construct `new Sequence(…)` or
call `stagger()` manually. Lane 32 records this as `[med/L-WAVE-CANDIDATE] GAP
(orchestration observability)`.

The W127 ask: extend `animate()` to accept an `AnimationGroup` | `Sequence` |
`AnimationGroup[]` shape in its `input` argument and route it to the group/sequence
play path. The discriminating field for `Sequence` is the `Sequence` class instance
check; the group route is `AnimationGroup`. Both are HEAVY (they need engine at
runtime for `.play()`); they belong behind `loadAnimationEngine()` — no new static
edge, same boundary. The cure is a fifth dispatch branch, not a new front-door.

The `proof:animate-orchestration` gate (new, born-RED): assert that
`animate(target, seq, opts)` where `seq` is a `Sequence` instance calls
`seq.play()` on the sequence (not `new CSSKeyframesAnimation`) and that
`animate(target, group, opts)` calls `group.play()`. RED today because
`animate.ts:169` falls through to a plain `throw new Error("animate():
unrecognized input — …")` on any input that is not one of the four recognized
shapes (the `Sequence` / `AnimationGroup` isinstance check does not exist; note
the throw is a bare `Error`, NOT the typed `AnimationOptionError`).

**Audit evidence:** audit W127; Lane 32 `L.W-FRONT-DOOR+`; `animate.ts:169`
(the bare-`Error` unrecognized-input branch).

### Finding 4 — PKG-3: d.ts collision aliases confuse IDE hover text (W126)

`dist/keyframes.d.ts` exports three API-Extractor-generated collision aliases:
`Animation_2 as Animation` (line 512), `ScrollTimeline_2 as ScrollTimeline` (line
2694), and `flip_2 as flip` (line 962). These aliases surface in IDE hover text
on every intermediate type — `addFrame(…): Animation_2<K>` instead of
`Animation<K>`. `packaging-k.md:118-127` records the root: API Extractor renames
the source class to resolve collisions with `globalThis.Animation` (WAAPI) and
`globalThis.ScrollTimeline` (Houdini). The cure is to rename the source
class in `src/animation/engine.ts` from `Animation` to `KeyframesAnimation` (and
`ScrollTimeline` in `src/animation/timeline.ts`), exporting them under both the
new canonical name and the backward-compat alias `Animation`/`ScrollTimeline` for
the transition cycle. This is a breaking rename in the HEAVY type surface
only (the value is exported only from `loadAnimationEngine()`) — no light-tier
consumer is broken. Pairs naturally with a MAJOR (5.0.0) version cut.

The gate: `proof:published-surface`'s clause (b) (manifest rows match exports,
`scripts/proof-published-surface.mjs`) must confirm no `_2`-suffixed export
appears in the documented surface manifest (`docs/published-surface.md`). Today
clause (b) passes because `published-surface.md` docs the `as Animation` alias
— it cannot see the `_2` leakage into intermediate types. The born-RED trigger
for this S-clause is the NEW `proof:pkg3-clean` sub-clause: grep
`dist/keyframes.d.ts` for `_2` export aliases and assert count = 0. RED today
(`Animation_2`, `ScrollTimeline_2`, `flip_2` all present).

**Audit evidence:** audit W126; `packaging-k.md:118-127` (PKG-3 finding);
`dist/keyframes.d.ts:512` (`Animation_2 as Animation`), `dist/keyframes.d.ts:2694`
(`ScrollTimeline_2 as ScrollTimeline`), `dist/keyframes.d.ts:962` (`flip_2 as
flip`).

### Finding 5 — keyframes-react: BOOK gated on Vue prove-first (W129)

`@mkbabb/keyframes-react` has no source, no package scaffold, no
`packages/keyframes-react/` directory. The BOOK tripwire is explicit: "BOOK —
after the Vue adapter proves the shape" (`K.W12.md:86`; `audit-32-skeleton.txt`
W129 dep: `keyframes-vue published + demo-dogfooded first`). L.W8's S2
(keyframes-vue 0.1.0 publish) fires the tripwire. The L.W8 obligation for the
BOOK is: (a) record the tripwire as FIRED once S2 closes, (b) author a
`docs/tranches/L/waves/L.W8-react-book.md` disposition noting the surface shape
the Vue adapter proved (the `<Keyframes :css>` + `useKfAnimation` kernel) and
the React equivalents (`<Keyframes css={…} />` + `useKfAnimation` hook), and (c)
confirm no `packages/keyframes-react/` scaffold exists yet (the BOOK is
documentation, not source). The BOOK is **not a deliverable in L.W8** — it is the
disposition of the tripwire the S2 publish fires.

**Audit evidence:** audit W129; `K.W12.md:86`.

### K substrate the wave rides

The wave is **zero-green-field**: every S-clause wires existing machinery.

- **S1 (ED-3 flip):** the self-alias in `vite.config.ts` is already present;
  `proof-demo-on-published-surface.mjs` already has the `KFVUE_INVERSION_LANDED`
  gate path (line 134-140). The work is 114 import-site rewrites + setting the env.
- **S2 (keyframes-vue publish):** source is complete; `packages/keyframes-vue/`
  has `vite.config.ts`, `tsconfig.json`, and all three `.ts` source files. The
  work is the peer-floor bump + `npm publish` + release.yml extension.
- **S3 (animate orchestration dispatch):** all five dispatch targets
  (`CSSKeyframesAnimation`, `AnimationGroup`, `Sequence`, `MotionPath`, `DrawSVG`)
  are already behind `loadAnimationEngine()`. The work is one new branch in
  `animate.ts:135-170` + a new `proof:animate-orchestration` vitest file.
- **S4 (PKG-3 collision cleanup):** API Extractor config is in `package.json`
  (`@microsoft/api-extractor`); the rename is a source-class rename in
  `engine.ts` + `timeline.ts` + backward-compat export alias.
- **S5 (keyframes-react BOOK):** documentation only; no source code written.

---

## Scope

Each S-clause is a concrete falsifiable deliverable. The composite gate is:
`KFVUE_INVERSION_LANDED=1 proof:demo-on-published-surface` GREEN +
`proof:keyframes-vue-published` GREEN + `proof:animate-orchestration` GREEN +
`proof:pkg3-clean` (sub-clause of `proof:published-surface`) GREEN + the
react-book disposition doc on disk.

### S1 — ED-3 dogfood inversion: flip the demo `@src/animation/*` imports (63 files / 114 import sites) to the barrel (W125)

**Deliverable.** Rewrite every demo file that imports `@src/animation/*` to use:
- `@mkbabb/keyframes.js` for LIGHT named exports (`NumericAnimation`,
  `SpringProgress`, `stagger`, `flip`, `Sequence`, `ScrollTimeline`,
  `ManualTimeline`, `RAFPlayback`, etc.)
- `await loadAnimationEngine()` for HEAVY engine values (`CSSKeyframesAnimation`,
  `Animation`, `AnimationGroup`, `getAnimationId`, `getTimingFunction`, `animate`,
  `presets`, compile exports)

After the flip, run `KFVUE_INVERSION_LANDED=1 npm run
proof:demo-on-published-surface` and assert zero `@src/animation/*` deep imports
(clause (b) full assertion, `proof-demo-on-published-surface.mjs:134-140`). The
gate must be GREEN before S1 is considered closed.

**Constraints.**
- The vite self-alias (`vite.config.ts` resolve alias `@mkbabb/keyframes.js →
  src/animation/index.ts`) is NOT removed — it is the dev-resolution substrate
  that makes the barrel specifier work in Vite HMR. The flip changes the DEMO's
  import SPECIFIER, not the alias.
- Any demo file that was reaching engine internals NOT exported by the barrel
  (`src/animation/engine.ts` raw chunk imports) must route through
  `loadAnimationEngine()`. If a demo file uses a non-exported internal, the cure
  is either (a) expose the internal via `loadAnimationEngine()`'s return type
  (if it should be public) or (b) refactor the demo to not need it (if it was a
  demo-internal coupling).
- `proof:dogfood` (inv ζ's behavioral oracle) must stay GREEN throughout — the
  flip is a specifier change only; behavior is unchanged.

### S2 — publish `@mkbabb/keyframes-vue@0.1.0` under the release discipline (W56)

**Deliverable.**

1. **Peer floor bump.** Advance `packages/keyframes-vue/package.json`
   `peerDependencies["@mkbabb/keyframes.js"]` from `>=4.2.0` to `>=4.3.0` (the
   K.W7–W11 surface floor — the `loadAnimationEngine()` chunks the `<Keyframes>`
   component consumes at mount).

2. **Build + type-check.** `cd packages/keyframes-vue && npm run build && npm run
   check` must pass green.

3. **`proof:keyframes-vue-published` (new gate, born-RED).** A new gate script
   (`scripts/proof-keyframes-vue-published.mjs`) that:
   - (a) asserts `packages/keyframes-vue/dist/keyframes-vue.js` exists (the
     built artifact; RED if build has not run).
   - (b) runs `npm show @mkbabb/keyframes-vue version` and asserts the response is
     `0.1.0`; RED if the package is absent from the registry (as it is today).
   - (c) asserts `packages/keyframes-vue/package.json` peer floor is `>=4.3.0`;
     RED if stale.
   The gate is added to `proof:all` (`package.json` script) so it rides every CI run.

4. **release.yml extension.** Add a `publish-keyframes-vue` job (or a step in the
   existing `publish` job) to the `release.yml` workflow that runs `npm run build`
   + `npm publish --access public` in `packages/keyframes-vue/` under the same
   OIDC provenance as the core library publish. The job must be sequenced AFTER the
   core library publish succeeds (the peer dep `>=4.3.0` must be resolvable before
   the adapter lands on npm).

5. **`proof:peer-satisfied` — REFERENCE (owned by L.W4 S8 / re-stated by L.W9
   S3; NOT re-authored here).** L.W4 S8 authors the gate script
   (`scripts/proof-peer-satisfied.mjs` + the `package.json` entry + `proof:all`
   inclusion); L.W9 S3 dispatches the glass-ui BB F-2 peer fix that GREENs it.
   L.W8 only NOTES the dependency: the keyframes-vue publish (S2 steps 1-4) can
   proceed independently of `proof:peer-satisfied` — the peer gate does NOT block
   the adapter publish. It is the live F-2 ELSPROBLEMS (`glass-ui@4.0.0` declares
   `peerDependencies["@mkbabb/value.js"]: "^0.10.0||^0.11.0"`, rejecting the
   installed value.js 0.13.0 — audit ⚠8; Lane 36 `[high/CROSS-REPO-ASK]`) that
   keeps the full `proof:all` from GREENing until the constellation is clean, an
   **intentional Band-B born-RED** owned by L.W4/L.W9, not a new L.W8 gate.

**Constraints.**
- `@mkbabb/keyframes-vue` consumes the PUBLISHED `@mkbabb/keyframes.js` barrel
  (`packages/keyframes-vue/src/Keyframes.ts:14` imports from
  `@mkbabb/keyframes.js`) — inv-16: no `file:` link in the package's dep
  declaration (`devDependencies["@mkbabb/keyframes.js"]: ">=4.3.0"`). The
  `proof:deps-current` PROTOCOL clause (2) bites on `file:` in any `@mkbabb/*`
  resolve.

### S3 — extend `animate()` to dispatch the orchestration tier (W127)

**Deliverable.** Add a fifth dispatch branch to `src/animation/animate.ts`:

```ts
// Discriminant: AnimationGroup | Sequence instance — dispatch to group/sequence play.
// Both are HEAVY (need the engine at call-time); they ride loadAnimationEngine()
// already. No new static edge — the runtime isinstance check fires after the
// dynamic import has resolved (animate.ts is itself HEAVY, statically importing engine.ts).
if (input instanceof AnimationGroup || input instanceof Sequence) {
    input.setTargets?.(target);  // if the target is meaningful to the input
    if (options?.autoPlay ?? true) void input.play();
    return input;
}
```

The exact API surface is: `animate(target, group: AnimationGroup, opts?)` returns
the `AnimationGroup`; `animate(target, seq: Sequence, opts?)` returns the
`Sequence`. The `AnimateInput` union type gains `AnimationGroup<V> | Sequence<V>`.
The `autoPlay` option gates the `.play()` call (same semantics as the existing
shapes).

**Gate: `proof:animate-orchestration` (new, born-RED).** A new vitest file
(`test/animate-orchestration.test.ts`) that:
- (a) asserts `animate(el, group)` calls `group.play()` and returns the group
  (not a `CSSKeyframesAnimation`).
- (b) asserts `animate(el, seq)` calls `seq.play()` and returns the sequence.
- (c) asserts that passing an unknown object (not one of the six recognized shapes)
  still throws the bare `Error` with the `animate(): unrecognized input` message
  (the error branch at `animate.ts:169` is preserved for genuinely unrecognized
  inputs; the gate matches the ACTUAL thrown class — a plain `Error`, not
  `AnimationOptionError`).
RED today because `animate.ts:169` reaches the bare-`Error` branch for any
`AnimationGroup` / `Sequence` input.

**Constraints.**
- `animate.ts` is already HEAVY (it statically imports `./engine`). The
  `AnimationGroup` and `Sequence` imports are from `./group` and `./sequence`
  respectively — both already on the HEAVY chunk via `engine.ts`'s re-exports.
  No new chunk boundary is created.
- `AnimateInput<V>` union extension adds `AnimationGroup<V> | Sequence<V>` — a
  backward-compat widening (existing callers passing the four original shapes are
  unaffected).

### S4 — retire PKG-3 d.ts collision aliases (W126)

**Deliverable.** Eliminate the `Animation_2`, `ScrollTimeline_2`, and `flip_2`
internal aliases from `dist/keyframes.d.ts` by renaming the source classes to
avoid collisions with `globalThis.*` names:

- `src/animation/engine.ts`: rename `class Animation<V>` → `class
  KeyframesAnimation<V>`. Export as both `KeyframesAnimation` (new canonical) and
  `Animation` (backward-compat alias, declared `@deprecated` with a migration note)
  from the heavy surface (`loadAnimationEngine()` return type).
- `src/animation/timeline.ts`: rename `class ScrollTimeline` →
  `class KeyframesScrollTimeline`. Same dual-export pattern.
- `src/animation/animations.ts` / wherever `flip_2` originates: the `flip` preset
  (in the `AnimationPresets` namespace) already has a distinct namespace; API
  Extractor's rename comes from the `flip` light-export occupying the same name at
  the barrel. Disambiguate by prefixing the preset: `presets.flip` (already
  namespaced under `presets`) is not a top-level export — this alias may resolve
  automatically once `AnimationGroup` rename clears the collision chain.

**Gate: `proof:pkg3-clean` sub-clause in `proof:published-surface`.** Add a
clause to `scripts/proof-published-surface.mjs` that greps `dist/keyframes.d.ts`
for the pattern `/_2\s+as\s+/` and asserts zero matches. RED today (three
matches). GREEN when the rename lands.

**Constraints.**
- The rename is a **breaking change** in the HEAVY type surface (`Animation` →
  `KeyframesAnimation` in the `AnimationEngine` return type). This pairs with a
  MAJOR `5.0.0` cut as recommended in `K/FINAL.md:105` and `packaging-k.md:532`.
  L.W8 specs the rename; the version-cut decision is USER-DOMAIN (L.WZ proposes
  criteria).
- `CSSKeyframesAnimation<V>` extends `Animation<V>` — the rename of `Animation`
  to `KeyframesAnimation` changes the base-class name in the HEAVY type surface
  only; `CSSKeyframesAnimation` retains its name.
- `proof:published-surface`'s existing clauses (tarball census, export roster,
  manifest parity) must stay GREEN throughout.

### S5 — keyframes-react BOOK: record the tripwire as FIRED (W129)

**Deliverable.** After S2 closes (keyframes-vue published + demo dogfooded):

1. Add a file `docs/tranches/L/waves/L.W8-react-book.md` (the BOOK disposition)
   that records:
   - The tripwire as FIRED (S2 publish date, npm dist-tag confirmed).
   - The surface shape the Vue adapter proved: `<Keyframes css={str}> /
     useKfAnimation` — the two-primitive kernel.
   - The React equivalents: `<Keyframes css={str} />` (JSX) + `useKfAnimation`
     hook (identical semantics; React's `useEffect` + `useRef` replace
     Vue's `onMounted` + `ref`).
   - The prerequisite: a `packages/keyframes-react/` scaffold with a single
     `<Keyframes>` component and `useKfAnimation` hook, built over
     `loadAnimationEngine()`, with `peerDependencies: { react: ">=18", "@mkbabb/keyframes.js": ">=5.0.0" }`.
   - The gate-first discipline: `proof:keyframes-react-published` is the
     born-RED gate authored BEFORE the scaffold. The scaffold is NOT authored
     in L.W8 — the BOOK records the criteria, not the source.
2. No source code in `packages/keyframes-react/` is written in L.W8. The BOOK is
   a documentation artifact only.

---

## Born-RED gate

Three gates are born-RED on today's tree. All three must GREEN before L.W8 closes.

### Gate 1 — `proof:demo-on-published-surface` with `KFVUE_INVERSION_LANDED=1`

**Gate name:** `proof:demo-on-published-surface`

**Witness input that REDs today:**
```sh
KFVUE_INVERSION_LANDED=1 npm run proof:demo-on-published-surface
```
`proof-demo-on-published-surface.mjs:134-137` reads:
```js
const INVERSION_LANDED = process.env.KFVUE_INVERSION_LANDED === "1";
// …
if (INVERSION_LANDED && deepFiles > 0) {
    failures.push(`(b) KFVUE_INVERSION_LANDED=1 but ${deepFiles} demo file(s) still import @src/…`)
}
```
Today `deepFiles = 63` (the gate's FILE census — `grep -rl "@src/animation"
demo/ | wc -l = 63` demo files import `@src/animation/*`; those 63 files carry
114 import SITES, `grep -rn "@src/animation" demo/ | wc -l = 114`). The born-RED
witness is `deepFiles=63 > 0`. With the flag set, clause (b) fails immediately.

**Greens on the cure:** S1 rewrites all 114 import sites (across the 63 files) to
the `@mkbabb/keyframes.js` barrel / `loadAnimationEngine()`. After the flip,
`deepFiles = 0` and clause (b) passes.

**Regression it catches:** any future commit that introduces a `@src/animation/*`
deep import in the demo (regressing the dogfood inversion) REDs clause (b) with
`KFVUE_INVERSION_LANDED=1` in CI.

### Gate 2 — `proof:keyframes-vue-published` (NEW, born-RED)

**Gate name:** `proof:keyframes-vue-published` (new script:
`scripts/proof-keyframes-vue-published.mjs`)

**Witness input that REDs today:**
- Clause (b): `npm show @mkbabb/keyframes-vue version` returns empty / error
  (package not on registry). The gate exits non-zero on any npm CLI failure or
  empty version string.
- Clause (c): `packages/keyframes-vue/package.json` peer floor is `>=4.2.0`, not
  `>=4.3.0` — asserted stale.

**Greens on the cure:** S2 bumps the peer floor to `>=4.3.0` and publishes to npm.
After publish, `npm show @mkbabb/keyframes-vue version` returns `0.1.0` and clause
(c) passes.

**Regression it catches:** a keyframes-vue unpublish / version rollback REDs
clause (b). A peer-floor regression (bumped back to `<4.3.0`) REDs clause (c).

### Gate 3 — `proof:animate-orchestration` (NEW, born-RED)

**Gate name:** `proof:animate-orchestration` (new vitest test file:
`test/animate-orchestration.test.ts`)

**Witness input that REDs today:**
```ts
// test/animate-orchestration.test.ts
import { describe, it, expect, vi } from "vitest";
const { animate, AnimationGroup, Sequence } = await loadAnimationEngine();
const el = document.createElement("div");
const group = new AnimationGroup(/* … */);
it("animate(el, group) dispatches to group.play()", async () => {
    const spy = vi.spyOn(group, "play");
    animate(el, group);
    expect(spy).toHaveBeenCalled();
});
```
Today `animate(el, group)` falls through to the bare `throw new Error("animate():
unrecognized input — …")` at `animate.ts:169` because the `AnimationGroup`
isinstance branch does not exist.

**Greens on the cure:** S3 adds the dispatch branch. After the patch, `animate(el,
group)` returns `group` and `group.play()` is called.

**Regression it catches:** a refactor that removes the orchestration-dispatch
branch from `animate.ts` or narrows `AnimateInput` back to the original four
shapes REDs clauses (a)/(b).

---

## Deps

| S-clause | Dep |
|----------|-----|
| S1 (ED-3 flip) | 4.3.0 published (confirmed) · `KFVUE_INVERSION_LANDED=1` flag in the gate seam (present, `proof-demo-on-published-surface.mjs:65`) |
| S2 (keyframes-vue publish) | 4.3.0 published · release.yml publish job (exists, `release.yml`) |
| S2 sub: `proof:peer-satisfied` (gate OWNED by L.W4 S8; dispatch by L.W9 S3 — referenced, not authored here) | glass-ui BB fix (Band B — the gate stays RED until glass-ui publishes a fixed peer range; documented born-RED, not a blocker for S2 itself) |
| S3 (animate dispatch) | none — kf-internal; `animate.ts` is already HEAVY |
| S4 (PKG-3 rename) | API Extractor `^7.58.7` (installed); coordinate with version-cut (L.WZ) |
| S5 (react BOOK) | S2 closed (tripwire: keyframes-vue published + dogfooded) |

**DAG within L.W8:** S1 → S2 peer floor bump (the demo dogfood loop requires
keyframes-vue on npm to close the full inversion); S2 → S5 (react-BOOK tripwire).
S3 and S4 are independent of S1/S2 and of each other.

---

## Bite

Each gate catches a concrete regression class:

| Gate | Regression class caught |
|------|------------------------|
| `proof:demo-on-published-surface` (S1) | Any future `@src/animation/*` deep import re-introduced in the demo — the dogfood inversion regresses silently without this gate biting |
| `proof:keyframes-vue-published` (S2) | An unpublish, version rollback, or stale-peer-floor regression on the sibling package — today's gap (the package is not on npm) goes un-gated without this |
| `proof:animate-orchestration` (S3) | A refactor that removes the orchestration-dispatch branch from `animate.ts` — today the branch does not exist; without the gate a future "cleanup" could remove it invisibly |
| `proof:pkg3-clean` sub-clause (S4) | A future API-Extractor upgrade that re-introduces `_2`-suffixed aliases — greps the emitted `dist/keyframes.d.ts` directly |
| `proof:peer-satisfied` (referenced — gate owned by L.W4 S8 / dispatch by L.W9 S3) | The live ELSPROBLEMS blast radius (glass-ui `^0.10.0||^0.11.0` peer rejects value.js 0.13.0) — before L.W4 authors the gate no CI surface catches this; consumers hit the warning invisibly |
