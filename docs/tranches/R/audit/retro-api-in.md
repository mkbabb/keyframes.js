# Tranche R — Lane `retro-api-in`

**Scope:** the public API "in" from the PRODUCT / ergonomics angle. What does a
user `import`, what do they `instantiate`, and is the front door honest, simple,
and discoverable? Triggered by the owner's question: *"Why did we remove
Animation, too — what's our in to the library?"*

**Files read (verbatim):**
- `src/animation/index.ts` (the barrel — the entry)
- `src/animation/load-engine.ts` (the dynamic-import machinery, 559 lines)
- `src/animation/animate.ts` (the single-call front door, 213 lines)
- `src/animation/engine.ts` head + class decls (1420 lines)
- `README.md` (Quick Start + §Animation + §dynamic engine + §animate)
- `docs/MIGRATION-5.0.0.md` (the `Animation` drop rationale)
- `docs/published-surface.md` (the machine-checked in-surface roster)
- `demo/@/utils/kfEngine.ts` + 36 demo consumer sites

---

## HEADLINE

The "in" is **broken at the first touch and over-engineered at the second.** The
README Quick Start — the literal first code a user copies — instantiates a class
(`CSSKeyframesAnimation`) that **5.0.0 made impossible to statically import**.
The real front door is a verbose `await loadAnimationEngine()` ceremony, and the
*designed* one-call front door (`animate()`) has **zero adoption** — not one call
site across the entire demo, and it is not even on the LIGHT static surface.
Dropping `Animation` (the name) was defensible; what actually harmed the "in"
is that **no value-level class is reachable without the dynamic-import dance.**

---

## FINDING 1 — [CRITICAL] The README Quick Start is a dead "in": it instantiates a class you cannot import

`README.md` lines 9–35 — the **Quick Start**, the first code on the page:

```ts
const anim = new CSSKeyframesAnimation({
    duration: 2000,
    iterationCount: Infinity,
    ...
});
anim.fromString(`@keyframes ... { ... }`);
anim.setTargets(document.getElementById("myElement"));
anim.play();
```

There is **no `import` line**, and crucially `CSSKeyframesAnimation` is **not a
static value export** of the barrel. In `src/animation/index.ts` it appears ONLY
inside the `export type { ... }` block (line 219):

```ts
export type {
    KeyframesAnimation,
    CSSKeyframesAnimation,   // ← line 219: TYPE-ONLY, erased at build
    AnimationGroup,
} from "./engine";
```

The runtime constructor is reachable **only** through
`await loadAnimationEngine()` (load-engine.ts:124–126, 427). So the literal
Quick Start, pasted as-is against published 5.0.0, throws
`CSSKeyframesAnimation is not defined` — there is no statically importable
symbol by that name.

Compounding it: the Quick Start fence is ` ```ts ` (README.md:11), **not**
` ```ts run ` (compare the §dynamic-engine block at README.md:234 which IS
`run`). The README `run`-fence machine-check (`proof:*` over fenced examples)
**skips** the Quick Start, so the gate has never caught that the headline
example is non-compiling against its own published surface.

**This is the owner's question made concrete.** The "in" a new user reaches for
— `new CSSKeyframesAnimation(...)` — does not exist as an import. The honest
answer is one of two excisions:

- **(A) Re-expose a value-level static class so the Quick Start is true.** Make
  `CSSKeyframesAnimation` (and/or a renamed `Animation`) a real static named
  export. This re-couples value.js onto the light barrel for that consumer —
  which the entire boundary architecture exists to prevent — so it is only
  honest if paired with package **subpath exports** (`@mkbabb/keyframes.js/engine`
  for the heavy class, `.` staying light). `package.json` currently exports ONLY
  `"."` (no subpaths), so today there is no honest static home for the class.
- **(B) Rewrite the Quick Start to the REAL entry** and tag it ` ```ts run ` so
  the gate enforces it:
  ```ts run
  import { loadAnimationEngine } from "@mkbabb/keyframes.js";
  const { CSSKeyframesAnimation } = await loadAnimationEngine();
  const anim = new CSSKeyframesAnimation({ duration: 2000, ... });
  ```

Either way the **current state is a fall-through**: the doc teaches a non-working
"in" and the gate silently passes it. Per the no-fallback precept, the Quick
Start must either be made to work or be excised.

---

## FINDING 2 — [HIGH] `animate()` is the designed front door with ZERO adoption — dead-by-disuse

`animate.ts` declares itself (lines 1–9) "the single-call declarative front
door… the DX baseline of the genre: `motion.animate(...)`, `gsap.to(...)`,
anime.js v4 `animate(...)`." It is the discoverability story for the whole
library.

Measured adoption: **0 call sites.** A `grep` for bare `animate(` across all of
`demo/**` (excluding `requestAnimationFrame`) returns **0**. The demo instead
uses `new CSSKeyframesAnimation(...)` **32 times** and reaches the engine via
`loadAnimationEngine`/`kfEngine` across **36 files**. The library's own flagship
multi-scene demo never once uses its own advertised front door.

Worse for discoverability: `animate` is **not on the LIGHT static surface** at
all. In `docs/published-surface.md` it is a HEAVY key — only reachable as
`const { animate } = await loadAnimationEngine()` (README.md:259). So the
"single-call front door" is actually a **two-step** front door: `await` the
engine, *then* call. The genre baselines it imitates (`motion`, `gsap`) are
single static imports. keyframes' `animate()` cannot be — by construction it
constructs `CSSKeyframesAnimation` (animate.ts:31, 185), which is value.js-bearing.

**The dispatch itself is also effusive** (animate.ts:105–200): a 6-way runtime
shape-sniff (`isMotionPathInput` reads `typeof input.path === "string"`;
`isKeyframeMap` checks `instanceof Map` then `typeof === object`; `instanceof
AnimationGroup`, `instanceof Sequence`, `Array.isArray`, `typeof === string`).
This is exactly the "NO effusive dynamicism" the precept names — a function that
branches on the *shape* of an untyped union at runtime, with a string-keyed
sentinel (`path`) to disambiguate a MotionPath spec from a keyframe map. It
works, but it is a structural guess pyramid, not a typed dispatch.

**Proposal:** Decide `animate()`'s fate explicitly — do not let it linger as
designed-but-dead.
- If it is THE intended front door: it must be **discoverable and cheap**. Give
  it a real static home (subpath, or accept the value.js edge for this one
  symbol) and **lead the README with it**, not with `new CSSKeyframesAnimation`.
  Dogfood it in ≥1 demo scene so "zero adoption" stops being the truth.
- If the four-step lifecycle is the real "in" (which the 32 demo `new
  CSSKeyframesAnimation` sites prove it is): **excise `animate()`** as
  speculative surface that imitates a genre the architecture cannot actually
  join (single static import). Keeping a never-used "front door" is dead API
  surface — the DRY/KISS precept's target.

---

## FINDING 3 — [HIGH] The LIGHT/HEAVY dynamic boundary is the real "in", and it IS effusive dynamicism

`load-engine.ts` is 559 lines whose entire job is to wrap `import("./engine")`
(and 11 sibling chunk imports) so that value.js stays off the light barrel. The
public reach to ANY heavy class is:

```ts
const { CSSKeyframesAnimation } = await loadAnimationEngine();
```

This is the load-bearing ergonomic tax of the whole product. Symptoms that it
has metastasized past "one honest dynamic import":

1. **Four parallel public accessors** — `loadAnimationEngine()` (full),
   `loadEngine()` (core), `loadCompiler()`, `loadIngest()` (load-engine.ts:339,
   354, 376, 427) — plus `warmEngine()`. A consumer must now *choose* which door
   to await based on which chunks they want. That is a chunk-graph decision
   leaking into the API surface. The user precept "NO effusive dynamicism" and
   "KISS" both bite here: the simplest honest entry is ONE accessor, not four
   memoized variants each with its own `Promise.all` + `Object.assign` assembly
   (load-engine.ts:354–401).

2. **The `AnimationEngine` interface is hand-maintained** (load-engine.ts:118–240)
   and must stay in "lockstep with `./engine`'s runtime exports" (its own
   docstring, lines 110–117) — a `proof:published-surface` clause (d) exists
   purely to diff it against `Object.keys(engine)`. A hand-mirrored interface
   that needs a gate to detect drift is a brittleness liability and a
   maintenance tax born entirely of the dynamic boundary.

3. **The demo could not live with the async ceremony** and built
   `demo/@/utils/kfEngine.ts` — a `warmKfEngine()` / synchronous `kfEngine()`
   shim (lines 38–56) that pre-awaits the engine at boot and throws if read
   early. The library's own reference consumer found the front door so awkward
   that it built a synchronous adapter on top. That is the clearest possible
   product signal that the async "in" does not match how animation libraries
   are actually used (you construct an animation inline, in a click handler,
   synchronously).

**This boundary is genuinely valuable** (a Node/light-only consumer must not
pull the CSS parser + value.js). The finding is NOT "delete the boundary." It is:
the boundary's *surface* is over-engineered. The simplest honest entry:

- **Collapse to ONE public accessor** (`loadAnimationEngine()`) and make
  `loadEngine`/`loadCompiler`/`loadIngest` internal or DROP them — they exist to
  shave chunks, but the demo (36 sites) uses only the full one. Granular
  chunk-splitting is a bundler concern, not an API-surface concern.
- **Prefer package subpath exports over the runtime accessor for the heavy
  class.** `import { CSSKeyframesAnimation } from "@mkbabb/keyframes.js/engine"`
  is a static, synchronous, tree-shakeable "in" that keeps value.js off the `.`
  entry by *module graph*, not by a hand-rolled `await import()` + memoization +
  hand-mirrored interface. This deletes most of load-engine.ts (the memoization,
  the four accessors, the `AnimationEngine`/`EngineCore`/`CompilerSurface`/
  `IngestSurface` mirror interfaces, the drift gate) and gives the demo back its
  synchronous `new CSSKeyframesAnimation()` without the `kfEngine.ts` shim.
  `package.json` `exports` currently has only `"."` — adding `./engine` etc. is
  the structural fix.

---

## FINDING 4 — [MEDIUM] Dropping the `Animation` NAME was right; the rationale doc is sound — but the "in" lost its center

`docs/MIGRATION-5.0.0.md` documents the drop of three `@deprecated` aliases
(`Animation`, `ScrollTimeline`, `ScrollTimelineOptions`) because they collided
with ambient DOM/Houdini globals (`globalThis.Animation`,
`globalThis.ScrollTimeline`) and leaked `Animation_2`/`ScrollTimeline_2` into IDE
hover text. That reasoning is **correct and the drop is the right no-legacy call**
— re-introducing `Animation` as a global-shadowing alias would be the legacy/
fallback the R precepts forbid.

But the owner's instinct is also right: the "in" lost its **named center.** Pre-
rename, the conceptual root was one word — `Animation`. Now the root is
`KeyframesAnimation`, which is (a) only a TYPE on the barrel, (b) reached at
runtime via a four-key destructure off an awaited promise, and (c) rarely the
class users actually touch (they use `CSSKeyframesAnimation`). So the question
"what's our in?" has no one-word answer anymore — it's "await loadAnimationEngine
then destructure the class you want."

**Proposal:** Do NOT re-expose `Animation`. Instead give the library a single,
named, importable **front-door verb or class** that IS the answer to "what's the
in" — and make it static. Candidates, in order of how well they fit the
architecture:
- `animate()` promoted to a static-importable front door (Finding 2) — the
  genre-idiomatic "in".
- `CSSKeyframesAnimation` via `@mkbabb/keyframes.js/engine` subpath (Finding 3) —
  the class-idiomatic "in".
The center should be ONE of these, taught FIRST in the README, dogfooded in the
demo. The current state — three competing half-doors (`loadAnimationEngine`,
`animate`, bare `new CSSKeyframesAnimation`) none of which is both static and
used — is the ergonomic confusion the owner sensed.

---

## FINDING 5 — [MEDIUM] The light barrel is an 18-export firehose — the "in" has no focal point

`src/animation/index.ts` exports **18 static values** + a large erased type
surface (`NumericAnimation`, `SmoothProgress`, `SpringProgress`, `reseatToSpring`,
`probeVelocity`, `reducedMotionScale`, `springLinearStops`, `springTimingFunction`,
`ElementMorph`, the four `Timeline`s, `RAFPlayback`, `Oscillator`/`waveformValue`,
`stagger`, `flip`/`flipShared`, `drag`/`Draggable`/`drag2D`, `decay`/`decayRest`,
`Sequence`, `resolveEasing`/`toEasing`, two error classes, plus the five
load-engine accessors). A consumer opening the barrel sees ~30 named symbols
with no hierarchy — physics primitives, orchestration helpers, easing utilities,
and the engine-loader all flat at the same level.

For the PRODUCT "in," this means there is **no obvious first symbol.** A great
library "in" surfaces 1–3 names you reach for 90% of the time and tucks the rest.
Here everything is peer-level on a single flat barrel, mirroring the flat `src/`
file tree the R brief already flags. The breadth is not wrong (these are real
primitives), but the **lack of a curated focal "in"** is.

**Proposal (planning, for R):** consider a tiered re-export so the "in" has a
shape — e.g. the engine front door + `animate` at top, the physics primitives
(`SpringProgress`/`SmoothProgress`/`NumericAnimation`) as a clearly-grouped
second tier, the orchestration helpers (`stagger`/`flip`/`drag`/`decay`/
`Sequence`) third. This pairs with the broader R decomposition of `src/animation/`
into real sub-module directories (`physics/`, `orchestration/`, `engine/`); the
barrel can then re-export *from* those directories, giving the "in" a legible map
instead of 30 flat names.

---

## CROSS-LANE FOLD ITEMS (for R to resolve as a system)

These surfaced while reading the "in" but belong to sibling lanes / the R
decomposition spine:

- **`engine.ts` is still 1420 lines** (`wc -l`) — the Q "decomposition close"
  did not land for the engine. The heavy class the entire dynamic boundary
  exists to gate is one god-module. The boundary's complexity (Finding 3) is in
  service of a module that itself violates the <500-line precept. Fold:
  decompose `engine.ts` into a real `engine/` directory FIRST, then the subpath
  export (`@mkbabb/keyframes.js/engine`) becomes the natural "in" replacement for
  `loadAnimationEngine()`.
- **`load-engine.ts` at 559 lines is itself >500** — the machinery built to keep
  the boundary honest is a god-module too. Most of it (Finding 3) evaporates if
  the boundary moves to package subpath exports.
- **The flat `src/animation/` tree** (56 files, only `internal/` is a sub-dir) —
  the R brief's primary target. The "in" cannot get a legible tiered shape
  (Finding 5) until the files group into `physics/`/`orchestration/`/`engine/`
  directories the barrel re-exports from.

---

## SUMMARY OF PROPOSED R API-IN POSTURE

1. **Pick ONE center and make it static.** Either promote `animate()` to a
   statically importable front door, or expose `CSSKeyframesAnimation` via a
   `@mkbabb/keyframes.js/engine` package subpath. Teach THAT first.
2. **Fix or excise the Quick Start** — it currently teaches a non-importable
   class under a non-`run` fence. Make it work and gate it.
3. **Collapse the four load-* accessors to one** (or zero, if subpaths replace
   them); delete the hand-mirrored `AnimationEngine` interface + its drift gate.
4. **Keep the `Animation`-name drop** — it was the right no-legacy call; do not
   re-add a global-shadowing alias.
5. **Decide `animate()` definitively** — promote-and-dogfood, or excise as dead
   speculative surface. Zero adoption + not-on-light-surface = it cannot stay
   as-is.
6. Fold into the R decomposition: `engine.ts` (1420) and `load-engine.ts` (559)
   into real sub-module directories; the subpath "in" depends on `engine/`
   existing.
