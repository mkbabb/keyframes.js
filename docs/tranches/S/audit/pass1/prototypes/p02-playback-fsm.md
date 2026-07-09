# Prototype p02 — PlaybackState FSM completion

**Probe:** S.B2 / a03 F1 — "PlaybackState owns plumbing, not the FSM." Trial-fold the play
run-state (`paused/done/started/reversed/iteration/t/startTime/pausedTime`) off the
`KeyframesAnimation` class body into `PlaybackState` as the single owner. Check: tests green,
no per-frame allocation added, the state machine becomes honestly single-writer. **Is the fold
clean, or does it fight the composition/sibling seam?**

**Verdict: `adjusts-spec`.** The mechanical fold type-checks and (via accessor delegates) keeps
every test green with zero per-frame allocation — but "honestly single-*writer*" is
**unachievable** without a breaking public-surface migration. The FSM fields are de-facto mutable
public API, read **and written** by four non-engine zones (`group/`, `orchestration/sequence/`,
`ingest/`, `waapi/`), 107 test sites, and the demo's contract-animation pattern
(`contractAnim.t = …`). The fold does **not** fight `composition/` (that seam is clean); it fights
the **group compositor + the demo write-surface**. a03's framing of this as an engine-internal
carve ("class body retains only `{…}`") understates the blast radius.

---

## 1. The question + the spec's assumption

SPEC-v1 §3 **S.B2** and §2.1 fact 11 inherit a03 F1's proposal verbatim:

> Fold the FSM into `PlaybackState`: `playback.ts` mutates `state.paused`/`state.t`/…; and
> `animation.ts`'s class body retains only `{ options, _compiler, playback, _playback, targets,
> name, id }` + the sample/config delegates … Gate the result: a `proof:engine` clause asserting
> **the transition fields are read/written only through `_playback`** (plant a class-body mutation
> → RED). — a03 F1 / §Tranche-S implications #1

Two embedded assumptions:

- **(A1)** The FSM is *engine-internal run-state* — folding it makes `animation.ts` **shrink** to
  a thin facade.
- **(A2)** "Single writer" is reachable: after the fold, the transition fields are written *only*
  through `_playback`, so a born-RED gate that bans class-field mutation is honest.

Both are false at the seam. The fields are a **public, externally-written** surface.

## 2. What I actually did

Worktree `wf_f9faf42c-6b8-2`, `ln -s …/node_modules node_modules` first. Two variants built:

| Step | Command | Result |
|---|---|---|
| Field inventory | `grep -rEn` of the 8 fields across `src/animation` | FSM touched from **6 files outside `engine/`** (group×4, sequence×2, ingest, waapi) — §3 |
| **Hard fold** — move 8 fields into `PlaybackState`, delete from class, perl-rewrite all `anim.`/`animation.` accessors → `._playback.` | `perl -i -pe` over 11 files | 11 files rewritten |
| Typecheck (hard fold) | `npx tsc --noEmit -p tsconfig.lib.json` | **exit 0** |
| Tests (hard fold, tests unmodified) | `npx vitest run test/animation.test.ts test/group.test.ts test/sequence-transport.test.ts` | **7 failed / 72 passed** — every failure `expected undefined` (the class field is gone; tests read `a.paused`, `anim.t`, …) |
| **Delegate fold** — add 8 getter/setter pairs on the class routing to `_playback` (preserve the `anim.<field>` read/write surface) | `Edit` animation.ts | — |
| Typecheck (delegate) | `npx tsc --noEmit -p tsconfig.lib.json` | **exit 0** |
| Tests (delegate, tests unmodified) | `npx vitest run` over animation/group/sequence/waapi/adopt/composition | **103 passed** |
| Full suite | `npx vitest run` | **912 passed / 2 expected-fail / 1 skipped**; 8 files fail to *import* `@mkbabb/keyframes.js` — **pre-existing worktree env** (confirmed identical on `git stash` baseline; the demo self-alias/`dist` is absent in the worktree, unrelated to the fold) |
| Hot-path gates | `npx vitest run test/standalone-zero-alloc.test.ts test/zero-alloc.test.ts test/interp-fastprops.test.ts test/playback-bind.test.ts` | **22 passed** — no per-frame alloc added |
| Engine gate | `node scripts/proof-engine.mjs` | **PASS**; class body now **455L** (was 442L) |

`git diff --stat` (delegate variant — the shippable one):

```
 src/animation/engine/animation.ts                 |  41 ++++++---   (8 field decls → 8 getter/setter pairs)
 src/animation/engine/playback.ts                  | 106 +++++------   (PlaybackState +8 fields; hot path anim.X → anim._playback.X)
 src/animation/engine/interpolate.ts               |  10 +-
 src/animation/engine/option-setters.ts            |   2 +-
 src/animation/group/{group,entries,compositor,scheduler}.ts | 30 +/-  (child-FSM accessors)
 src/animation/ingest/adopt.ts                     |   6 +-
 src/animation/orchestration/sequence/{sequence,transport}.ts | 8 +/-
 src/animation/waapi/delegation.ts                 |   6 +-
 12 files changed, 116 insertions(+), 93 deletions(-)
```

## 3. Findings (file:line evidence)

### F1 — The FSM is written from **4 zones outside `engine/`**, not just the `playback.ts` sibling
The 8 fields are mutated/read externally at:
- `group/group.ts:231-233` write `anim.t`, read `anim.startTime`, write `anim.pausedTime`; `:372-373` r/w `anim.pausedTime`; `:419` read `anim.started`
- `group/entries.ts:110-112` write `anim.started`, `anim.t`; `:126` write `entry.animation.paused`; `:93` read `.done`
- `group/compositor.ts:77` read `.done`; `:84` read `.t`
- `group/scheduler.ts:29` read `.paused`, `.pausedTime`
- `ingest/adopt.ts:336,345` write `animation.started`, `animation.startTime`
- `orchestration/sequence/sequence.ts:354-355` write `.startTime`, `.started`; `transport.ts:277-278` write `.started`, `.startTime`
- `waapi/delegation.ts:39,41,48` read `.done`, `.paused`

This is the load-bearing fact: a03 counts "30 `anim.<fsm> =` sites in `playback.ts`" and proposes a
`playback.ts`-local fold, but the same fields are the **cross-zone coordination surface** the
group compositor, the sequence transport, and the CSSOM adopt path all poke directly.

### F2 — The fold does **NOT** fight `composition/`; it fights `group/` + the demo write-surface
`engine/composition.ts` never touches a class field — it reads iteration through the explicit
`CompositionRuntime` interface (`composition.ts:130` `runtime.iteration`), fed once at
`interpolate.ts:301` (`iteration: anim.iteration`). That is the *one clean seam* a03 praised, and
the fold passes through it with a single-line change. The genuine friction is:
- **`group/`** — `AnimationGroup` reaches into each child's FSM by field access (F1). Worse, the
  group declares its **own** parallel FSM as *flat class fields* — `group.ts:61-63`
  `paused/started/done = false`. Folding only the child's FSM into a struct while the group keeps
  flat fields is an **asymmetry across the two engine FSMs**.
- **the demo** — `demo/scenes/{easing,spring}/*` and `demo/@/…/scenePlaybackAdapters.ts` **write**
  the FSM directly: `contractAnim.t = p * duration` (`useSpringDemo.ts:227,275,354,395`,
  `useEasingDemo.ts:394`), `contractAnim.reversed = …` (`SpringScene.vue:92`), `anim.startTime =
  now - animSnap.t` (`scenePlaybackAdapters.ts:117`). The "contract animation" time-twin pattern is
  built on *writing* `anim.t`.

### F3 — "single *writer*" is unachievable non-breakingly; the honest gate is "single *storage*"
Two ways to satisfy a03's gate, each with a cost:
- **Hard fold** (fields leave the class): satisfies the literal gate, but is a **breaking public API
  change** — `KeyframesAnimation` is the HEAVY public class reached via `loadAnimationEngine()`, and
  `anim.t`/`anim.paused`/… are read *and written* by consumers. Measured cost: **7 immediate test
  failures in 3 files**, **107 FSM read/write sites across 14 test files**, ~20 demo sites. The class
  shrinks (good), but every external site must migrate to `anim._playback.t`.
- **Delegate fold** (8 getter/setter pairs preserve the surface): non-breaking, all tests green
  unmodified — but the write surface stays wide (`anim.paused = true` is legal everywhere, routed
  through the setter), so it is **single *storage* (`_playback`), multi-*writer***. And the class
  **grows** (442→455L, `proof:engine`), directly contradicting a03/A1's "class shrinks to
  config+compiler+sample delegates."

So A2 is false: you cannot get "written only through `_playback`" and "surface unchanged" at once.

### F4 — Zero-alloc is preserved; property-access shape gains one hop (not an allocation)
The hot path (`playback.ts advanceBody/renderFrame`) was perl-rewritten to `anim._playback.t` /
`anim._playback.pausedTime` / `anim._playback._interpOut` — plain writes on the pre-existing
`_playback` struct, **no new object per frame**. `proof:standalone-zero-alloc` + `interp-fastprops`
+ `playback-bind` = **22 passed**. The only cost is `anim.t` (1 load) → `anim._playback.t` (2 loads)
per access — monomorphic, V8-inlined, negligible; this is exactly a03 F2's `InterpContext`
observation, and it is a *shape* cost, not an *allocation* cost. `managed` is correctly **excluded**
from the fold (it is an ownership flag set by group/sequence, not run-state) — a03's list already
omits it.

## 4. VERDICT: `adjusts-spec`

The fold is **structurally clean inside the engine** (composition.ts untouched; hot path
byte-equivalent; zero-alloc held) but **fights the wider seam** the spec did not scope: the FSM is a
mutable public surface co-owned by `group/`, `sequence/`, `ingest/`, `waapi/`, the test suite, and
the demo's contract-animation writes.

**Adjustment to S.B2 (spell it out):**

1. **Reframe the gate goal from "single writer" to "single STORAGE owner."** `PlaybackState` becomes
   the sole *backing store*; the class exposes 8 **accessor delegates** (get/set → `_playback`). The
   born-RED clause should assert **"no FSM field is DECLARED on the class body (only accessors),"**
   not "no FSM field is written outside `_playback`" — the latter is un-gateable while `anim.paused =`
   remains public. This is honest and non-breaking.
2. **Drop A1's "class shrinks" claim for the non-breaking path.** With delegates the class *grows*
   ~13L (442→455). S.B5 wants max file ≤~460L with headroom — the delegate accessors eat most of
   `engine/animation.ts`'s headroom, so **sequence S.B2 before S.B5** or the accessor block forces
   an earlier carve. Note it explicitly.
3. **If the owner wants literal single-writer (fields off the class entirely),** it must be booked as
   a **breaking-surface** wave: bundle the 107-site test migration + the demo contract-anim rewrite
   (`contractAnim.t = …` → a public setter or an explicit `seek(t)` verb) + a MIGRATION doc — which
   collides with S.Z3's "additive-minor by default." Recommended instead: **add a real `seek(ms)` /
   time-twin method** so the demo stops writing `.t` raw, *then* the hard fold becomes tractable in a
   later tranche. Not S-scoped as pure-internal.
4. **`composition/` is NOT the risk** — record that the CompositionRuntime interface already
   insulates it; the fold's one composition-side edit is `interpolate.ts:301`.

## 5. Implementation-cost estimate for the real wave

**Recommended (delegate / single-storage) fold:**
- **Files touched:** 12 library files (the diff above). Substantive change is `animation.ts`
  (8 accessor pairs) + `playback.ts` (PlaybackState +8 fields, hot-path repoint). The other 10 are
  1–6-line accessor repoints — most fall out of B2/B4 anyway.
- **Tests/demo:** **untouched** (green unmodified — verified).
- **Gates affected:** `proof:engine` stays green (455≤500) but loses ~13L headroom → interacts with
  S.B5's ≤460 headroom clause (sequence B2→B5). New FSM-ownership clause to author (declared-only
  check). `proof:standalone-zero-alloc` / `interp-fastprops` / `boundary` unaffected (verified).
- **Risk: LOW.** Mechanical, type-checked, byte-preserved hot path, no surface break.

**If literal single-writer (hard fold) is mandated:**
- **Files touched:** 12 lib + **14 test files / 107 sites** + ~8 demo files / ~20 sites ≈ **34 files**.
- **Gates:** same + a semver/MIGRATION gate (breaking removal of public fields).
- **Risk: MEDIUM-HIGH.** Breaking public API; the fields are *written* by consumers, so a missed
  external write site is a silent runtime break (not caught by tsc if the consumer is untyped);
  collides with the additive-minor default. Do only behind a `seek()`-style surface first.
