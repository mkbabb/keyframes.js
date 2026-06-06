# Tranche F deep-SOTA audit — lane `a-boundary-arch-F`

**Lane mandate.** Audit the keyframes.js **architecture** for F-scope transpositions
toward elegance/simplicity (gestalt): the light/heavy boundary (the barrel +
`loadAnimationEngine` + the E.W10 orchestration tier on the light surface), the
value.js seam, the re-export structure, the module graph, the `internal/` leaves.
Where would an architectural transposition simplify or clarify? **Research/audit
only — ZERO source edits.** inv-16: any value.js change is a hand-off; I write only
this doc. inv ε: every code claim cites `file:line` against the live tree
(`tranche-e-impl`); every SOTA claim is grounded.

**Orientation correction (binding, confirms `a-parsing-post-e`).** The `CLAUDE.md`
project tree is STALE — there is **no** `src/parsing/` and **no** `src/units/`. The
real engine is a *flat* module set under `src/animation/` (29 `.ts` files) with one
private leaf dir `src/animation/internal/`. The `src/units/**` re-export-barrel
question in the brief is **vacuous** — those barrels do not exist; the value.js
re-exports the brief asks about were absorbed into value.js itself (the `src/easing.ts`
/ `src/math.ts` / `src/units/` barrels CLAUDE.md lists are gone). I re-grounded the
brief's "re-export barrels" question against what is actually in-tree: the only
re-export hub is `engine.ts`'s tail block (`engine.ts:1169-1179`) and the package
barrel `index.ts`.

**Disposition legend.** SHIP-in-F · MEASURE-FIRST · BOOK · KILL · RECORD ·
value.js-HANDOFF · ALREADY-SOTA.

---

## TL;DR — the architecture is strong; two real seams, one of them notable

The post-D+E architecture is **genuinely well-factored** and I manufacture no work
where it leads. The D.W4 god-object split (the 1019-line `Animation` → `FrameCompiler`
+ `adapter` + `utils`, `frame-compiler.ts:1-13`) holds; the parse pipeline
(`adapter.ts` → `frame-compiler.ts` → `utils.ts` → `engine.ts`) is a clean
value-in→frames-out→runtime chain; the value.js static/dynamic boundary is
class-leading and the `proof:boundary` gate that defends it is rigorous and
self-enforcing (`scripts/proof-boundary.mjs:1-58`). The `internal/leaves.ts`
value.js-shadow is architecturally *necessary*, not a smell (a bare value.js
specifier survives tree-shaking even for a one-liner — `leaves.ts:6-12`).

Two architectural seams are real and worth F's attention, plus a cluster of small
cohesion nits:

| # | Finding | Disposition |
|---|---------|-------------|
| **F-A1** | **The in-repo consumers (demo + tests) bypass the barrel entirely** — 90 deep `@src/animation/*` imports, **0** `@mkbabb/keyframes`/`loadAnimationEngine`. The boundary is gated by a *synthetic* bundle and never dogfooded by a real consumer. | **BOOK** (the headline) |
| **F-A2** | **`clamp` is implemented FOUR ways across the light surface** — `leaves.ts` exports it, yet `smooth`/`timeline`/`spring`/`waapi` each re-inline `Math.max/min`. The leaf module is the right home but under-adopted. | **SHIP-in-F** (cohesion) |
| **F-A3** | **`animations.ts` (870L of presets) is on NO barrel** — the E `a-kf-api-dx` D-1 break is *still live* post-E. The demo reaches presets only via `@src/animation/animations`; a published consumer cannot import them. | **SHIP-in-F** (the D-1 fold, still open) |
| **F-A4** | **`group.ts` (HEAVY) reaches into `internal/leaves` for one `lerp`** — a heavy module borrowing the light-side value.js-shadow for a single call site, where it already imports `ValueUnit` from value.js directly. A cross-tier import with no purpose. | **SHIP-in-F** (tidy) |
| **F-A5** | **`internal/` mixes two concerns under one "value.js-free leaves" banner** — pure math shadows (`leaves`, `binarySearch`) sit beside DOM/platform gates (`reduced-motion`, `scheduler`) and the error seam (`errors`). The dir's docstring claims "value.js-free leaves"; half of it is platform glue. | **RECORD** (naming, low value) |
| **F-A6** | value.js seam — the `internal/leaves.ts` shadow is the *consequence* of a value.js packaging gap (no parser-free math sub-path). Already filed (handoff VJ-DX-1 / F6); I re-confirm + sharpen. | **value.js-HANDOFF** (re-confirm) |

The boundary itself, the FrameCompiler split, the easing seam, the `Tickable`
protocol, and the heavy re-export hub are **ALREADY-SOTA** (§ALREADY-SOTA) — leave
them.

---

## F-A1 — The in-repo consumers bypass the barrel; the boundary is gated, not dogfooded · BOOK

**The finding.** The whole architectural thesis of this library is the value.js
static/dynamic boundary: a light-only consumer importing `@mkbabb/keyframes.js`
gets the physics engines with **zero** static value.js edge, and reaches the heavy
CSS engine only through `await loadAnimationEngine()` (`index.ts:29-178`,
`src/animation/CLAUDE.md`). It is defended by `proof:boundary`, which bundles every
light barrel export as its own entry and asserts zero static value.js / `engine.ts`
edges (`scripts/proof-boundary.mjs:18-58`).

But **no real consumer in the repo ever exercises that surface.** Grounded:

- The **demo** imports the engine through **90** deep internal paths and the
  published barrel **zero** times:
  - `grep -rh 'from "@src/animation' demo/ | wc -l` → **90**
  - `grep -rh '@mkbabb/keyframes' demo/ | wc -l` → **0**
  - `grep -rh 'loadAnimationEngine' demo/` → **0** (the dynamic boundary is never called)
  - The deep targets, ranked: `@src/animation/engine` (34×), `@src/animation/group`
    (16×), `@src/animation/constants` (15×), `@src/animation/animations` (5×),
    `@src/animation/playback` (4×), `@src/animation/format` (4×), and notably
    `@src/animation/internal/scheduler` (1×) — the demo reaches into the **private
    leaf dir**. (`@src` resolves to `src` via `vite.config.ts:146`.)
- The **tests** do the same: `grep -rh 'from "../src/animation' test/` is dominated
  by `../src/animation/engine` (20×), `../src/animation/easing` (7×),
  `../src/animation/internal/errors` (6×), etc. No test imports the package barrel
  or `loadAnimationEngine`.

So the demo statically imports `@src/animation/engine` — pulling value.js into its
**static** graph — which is exactly the edge the boundary exists to forbid for a
light consumer. The demo is a heavy consumer (it parses `@keyframes`, fair), but it
**never demonstrates the light path**, and it **never calls `loadAnimationEngine()`**,
so the entire dynamic-import ergonomic ships **untested by a real caller**. The gate
proves the boundary holds *in a synthetic rolldown bundle*; nothing proves it holds
*as authored against a real import site*, and nothing proves the `loadAnimationEngine`
ergonomic is usable.

**Why this is architectural, not cosmetic.** A boundary that no first-party consumer
crosses is a boundary that drifts. Three concrete risks the bypass hides:

1. **The `loadAnimationEngine` DX is unexercised.** `a-kf-api-dx` D-2 already flagged
   that the heavy classes are async-only and the headline API now costs an
   `await import()` ceremony. The demo could have been the proving ground for whether
   that ceremony is tolerable — instead it sidesteps it by reaching into `engine.ts`
   directly. The library's own showcase does not use the library's own front door.
2. **`AnimationEngine` interface drift.** The `loadAnimationEngine` return type is a
   *hand-maintained* interface (`index.ts:130-149`) that must stay "in lockstep with
   `./engine`'s runtime exports" (its own docstring, `index.ts:122-129`) — because API
   Extractor can't resolve `typeof import()`. Nothing in-repo *calls* it as a typed
   consumer, so a drift between the interface and the real engine exports surfaces
   only at a downstream publish.
3. **The presets break (F-A3) is invisible** precisely because the demo reaches
   `@src/animation/animations` directly — the un-barrelled preset path *looks* fine
   internally while being unreachable for a published consumer.

**SOTA frame.** The field treats "dogfood your own published entry" as table stakes:
Motion's examples import from `"motion"`, GSAP's from `"gsap"`. A library whose demo
imports its own `src/` internals is importing the *pre-package* shape and cannot catch
export-surface regressions. The repo *has* the dogfood discipline elsewhere — inv-ζ's
`proof:dogfood` makes the engine consume its own `RAFPlayback` rather than hand-rolling
rAF (`scripts/proof-dogfood.mjs:40`) — but it has **never been extended to the package
boundary**. This is the same class of discipline, one tier up.

**The transposition (gestalt).** Make at least one first-party consumer cross the real
boundary. Two coherent shapes, owner's choice:
- **Minimal (SHIP-able):** a `proof:dogfood`-style smoke that imports the built
  `dist` barrel, asserts the light exports resolve with no value.js in the static
  graph, and `await`s `loadAnimationEngine()` once — turning the synthetic
  `proof:boundary` into a *consumed* contract. This is the cheap 80%.
- **Fuller (BOOK):** migrate the demo's light-surface scenes (spring/smooth/timeline
  scenes) to import from `@mkbabb/keyframes.js` (the barrel), keeping only the
  genuinely-heavy editor on a heavy import — so the demo *shows* the light path and
  the `loadAnimationEngine` ergonomic. This is the real dogfood but it's a demo-wide
  import refactor; it deserves a design note before it folds.

**Disposition: BOOK** — the headline architectural finding of this lane. The minimal
dist-barrel smoke is SHIP-able in F as a standalone gate add; the demo migration is a
BOOK (decide scope: which scenes go light, whether the editor stays heavy-static or
moves to `loadAnimationEngine`). It is **isomorphic** (no pixel/behavior change — only
the import site moves) and it closes the one gap in an otherwise-exemplary boundary
story: the boundary is *proven* but not *consumed*.

**Isomorphism.** Pure import-graph reshaping; no runtime behavior. The synthetic gate
stays; this adds a *consuming* witness beside it.

---

## F-A2 — `clamp` is implemented four ways; `leaves.ts` is the right home, under-adopted · SHIP-in-F

**The finding.** `internal/leaves.ts` exists to be the single value.js-free source
of the leaf math (`clamp`/`scale`/`lerp`) so the light engines carry no static
value.js edge (`leaves.ts:1-17`, `:23`). It exports a correct `clamp(value, min, max)`
(`leaves.ts:23-25`). Yet the light surface re-inlines a clamp **three more times**,
each a fresh `Math.max/Math.min` expression:

- `smooth.ts:78` — `target = Math.max(0, Math.min(1, target));`
- `smooth.ts:132` — `this.currentValue = Math.max(0, Math.min(1, this.currentValue));`
- `timeline.ts:34` — `const clamp01 = (v) => Math.max(0, Math.min(1, v));` (a *fourth*
  named local that duplicates `leaves.clamp(v, 0, 1)`)
- `waapi.ts:225` — `offset: Math.max(0, Math.min(1, t / duration))` (heavy side, but
  `waapi.ts` is heavy and already value.js-bearing, so it could use *either* clamp;
  the point is the open-coded form)
- `spring.ts:110` — `Math.min(1, Math.max(-1, bounce))` (a `[-1,1]` clamp — the same
  shape with different bounds)

Meanwhile the modules that *do* import `leaves.clamp` are `numeric.ts:4`,
`stagger.ts:28`, `sequence.ts:59`, and `playback.ts:5`. So the leaf is adopted in
exactly half the light surface and open-coded in the other half.

A parallel, smaller instance: `scale()` is open-coded as a guarded inline at
`engine.ts:625` (`start === stop ? 1 : scale(t, start, stop, 0, 1)` — here it *uses*
value.js `scale` but wraps it in the divide-by-zero guard the leaf `scale` already
throws on, `leaves.ts:35-37`) and again the `scale` semantics appear at
`numeric.ts:166`. The guard-vs-throw inconsistency is a smaller cohesion seam.

**Why it matters (gestalt).** This is the exact class of "one concept, N spellings"
the rest of this codebase has surgically eliminated — `reduced-motion.ts` collapsed
three hand-rolled `prefersReducedMotion()` copies into one authority
(`reduced-motion.ts:1-8`), and `playback.ts` is THE single rAF owner. `clamp` is the
one leaf that *has* its canonical home but never got the same convergence pass. Four
spellings of `clamp01` is a latent correctness surface: a future edit to the clamp
contract (e.g. NaN handling) must find four sites, not one.

**The transposition.** Route every light-side clamp through `leaves.clamp`:
`clamp(target, 0, 1)` for the `[0,1]` cases (`smooth`, `timeline`, `waapi`),
`clamp(bounce, -1, 1)` for the spring case. Delete `timeline.ts`'s `clamp01` local.
This is a *convergence pass*, the codebase's own idiom — the same motion that produced
`reduced-motion.ts`. Optionally add a `clamp01` *named export* on `leaves.ts` if the
`(v) => clamp(v, 0, 1)` shape recurs enough to want a name (it appears 4×, so it
plausibly does).

**Disposition: SHIP-in-F.** Pure cohesion fold, byte-identical output (the inlined
expressions are *already* `clamp`'s body), zero hot-path cost (the leaf is a trivial
`Math.min(Math.max())` the JIT inlines identically). **Isomorphic.** This is the
cleanest, lowest-risk architectural tidy in the lane.

---

## F-A3 — `animations.ts` (870L) is on no barrel; the D-1 preset break is still live · SHIP-in-F

**The finding.** The E `a-kf-api-dx` lane named D-1: "the presets are unreachable
from the package root; the README's most-copied snippet is broken." It was
dispositioned FOLD-E. **It did not land** — post-E, `animations.ts` (870 lines, the
single largest module, ~35 presets) is re-exported by **zero** barrel:

- `grep -n animations src/animation/index.ts` → 0 hits.
- `engine.ts`'s tail re-export hub (`engine.ts:1169-1179`) re-exports `AnimationGroup`,
  `getTimingFunction`, `resolveKeyframes`, `DIRECTIONS`/`FILL_MODES`/`defaultOptions`/
  `defaultLayerConfig` — but **not** `animations`.
- `loadAnimationEngine`'s `AnimationEngine` interface (`index.ts:130-149`) lists
  `animate`, `getAnimationId`, `getTimingFunction`, `resolveKeyframes`, the constants —
  but **not** the presets.
- The only reachable path is the demo's deep import `@src/animation/animations`
  (F-A1), which a published consumer does not have.

So a consumer following the README's `import { fadeIn } from "@mkbabb/keyframes.js"`
hits a resolution failure. The presets are correct, tested, and *exist* — they are
simply not on the export surface. (Note the orchestration tier — `stagger`, `flip`,
`drag`, `decay`, `Sequence` — **did** land on the light barrel in E.W10,
`index.ts:62-75`; the presets are the one E `a-kf-api-dx` fold that slipped.)

**The architectural wrinkle (why it's not a one-liner).** Presets return
`CSSKeyframesAnimation`, which is value.js-bearing — so they **cannot** sit on the
LIGHT static barrel without reddening `proof:boundary` (`a-kf-api-dx` D-1 §wrinkle).
Their correct home is the **heavy** surface: add them to the `AnimationEngine`
interface + `loadAnimationEngine`'s resolved object, so
`const { fadeIn } = await loadAnimationEngine()` resolves. That keeps the boundary
intact while making the documented surface real. The README then either shows the
heavy path or the `animate(el, fadeIn())` front-door form (F-A1's `animate` is wired,
`animate.ts:94`).

**Disposition: SHIP-in-F** — route `animations.ts` through the heavy engine surface
(`engine.ts` re-export + the `AnimationEngine` interface) + reconcile the README. Pure
export plumbing, zero hot-path cost, **isomorphic** (the presets already run; only
their reachability changes). This is the E D-1 fold finally landing.

---

## F-A4 — `group.ts` (heavy) borrows `internal/leaves.lerp` for one call · SHIP-in-F

**The finding.** `group.ts` is a HEAVY module — it imports `ValueUnit` from
`@mkbabb/value.js` directly (`group.ts:1`) and is reached only via
`loadAnimationEngine` (it's in `engine.ts`'s re-export, `engine.ts:1169`). Yet it
*also* imports `lerp` from the light-side value.js-shadow (`group.ts:2`,
`import { lerp } from "./internal/leaves"`) for a **single** call site — the
`weighted` blend lerp at `group.ts:284`.

This is an inverted tier import: a value.js-bearing module reaching into the
value.js-*avoidance* leaf for a helper it could take from value.js itself
(`engine.ts:18` already imports `lerpValue` from value.js; the canonical `lerp` is
right there). The `internal/leaves.ts` shadow exists *only* to keep light modules
value.js-free (`leaves.ts:1-12`) — a heavy module consuming it gains nothing (it's
already pulled value.js) and muddies the tier story: a reader auditing "who depends on
the light-shadow" finds a heavy module in the list, contradicting the leaf's stated
purpose.

**The transposition.** `group.ts` should take `lerp` from `@mkbabb/value.js` (the
canonical copy it shadows), consistent with its already-heavy posture. One import line
moves; `leaves.ts`'s consumer set becomes purely light, restoring the leaf's invariant
("only light modules import me").

**Disposition: SHIP-in-F.** One-line import retarget, byte-identical (`leaves.lerp` is
"kept byte-for-byte equivalent to value.js's lerp", `leaves.ts:14-16`). **Isomorphic.**
Tidy, but it *clarifies the tier graph* — the leaf's consumer set is the load-bearing
documentation of the boundary, and one heavy consumer in it is a lie the gate doesn't
catch (the gate only checks the *light* direction).

---

## F-A5 — `internal/` conflates pure leaves with platform glue · RECORD

**The finding.** `src/animation/internal/` holds five files under one conceptual
banner — `src/animation/CLAUDE.md` calls them "value.js-free leaves (keep the light
bundle clean)". But they split into three distinct concerns:

- **Pure math/algorithm shadows** — `leaves.ts` (clamp/scale/lerp/rAF shim),
  `binarySearch.ts` (segment lookup). These ARE value.js-free leaves; the banner fits.
- **Platform/DOM gates** — `reduced-motion.ts` (a `matchMedia` detector + the
  `withReducedMotion` gate), `scheduler.ts` (a `scheduler.yield` probe). These are not
  "leaves" — they're platform-capability glue with DOM dependencies (`window`,
  `matchMedia`, `scheduler`). They're value.js-free, but so is most of the engine;
  "value.js-free" is not their defining trait.
- **The error/validation seam** — `errors.ts` (the fail-explicit `AnimationOptionError`/
  `UnknownEasingError` + `parseOption`). A cross-cutting contract, not a leaf.

The `leaves.ts` docstring even names its consumers as "the light engines" and frames
itself as the value.js-shadow (`leaves.ts:1-17`) — a *narrower* and truer charter than
the dir's umbrella claim. The umbrella ("value.js-free leaves") is the weakest of the
three concerns' real identities.

**Assessment — honestly low value.** This is a *naming/grouping* observation, not a
correctness or perf issue. `internal/` is private (not exported; the F-A1 demo reach
into `internal/scheduler` is the one leak), small (5 files, ~356L total), and each file
is individually well-documented. A reorg (e.g. `internal/math/`, `internal/platform/`,
`internal/contract/`) would be pure churn against a small, clear set — the kind of
gold-plating the mandate warns against. The *real* signal here is just that the
`CLAUDE.md` one-liner "value.js-free leaves" undersells `reduced-motion`/`scheduler`
as platform gates.

**Disposition: RECORD** — note the conceptual split for the record; do **not** reorg
(the churn-vs-clarity trade is negative at this size). If anything ships, it's a
one-line `CLAUDE.md` wording fix ("value.js-free leaves + platform gates + the error
seam") — not worth a wave. **No source change recommended.**

---

## F-A6 — value.js seam: the `internal/leaves` shadow is a value.js packaging consequence · value.js-HANDOFF (re-confirm)

**The finding (re-confirmation, sharpened).** `internal/leaves.ts` re-homes value.js's
`clamp`/`scale`/`lerp` *purely* because a static `@mkbabb/value.js` import — even of a
one-line pure function — survives tree-shaking as a bare module specifier and drags the
whole package into a light consumer's graph (`leaves.ts:6-12`). The shadow is the
*workaround for a value.js packaging gap*: value.js ships no parser-free, DOM-free math
sub-path that keyframes could statically re-export without the edge.

This is **already filed** — `a-kf-api-dx` VJ-DX-1 and the consolidated handoff's
**Wave F6** ("a parser-free easing sub-path so kf can statically re-export named curve
constructors without re-adding the static DOM/parser edge", `valuejs-sota-handoff.md`
§F6). I re-confirm it and **widen** the ask: the same sub-path that would carry the
easing constructors should carry the **leaf math** (`clamp`/`scale`/`lerp`). If
value.js shipped `@mkbabb/value.js/math` (or a `sideEffects`-clean, DOM-free leaf
entry), keyframes could **delete `internal/leaves.ts` entirely** and statically
re-export the canonical helpers — removing the byte-parity maintenance burden
(`leaves.ts:14-16` promises byte-equivalence that nothing currently *enforces* across
the repo seam) and collapsing F-A2's duplication onto value.js's single source.

**Why this is the elegant endpoint.** Today keyframes maintains a hand-copied shadow
it *promises* stays byte-identical to value.js — an un-gated invariant across two
repos. The SOTA shape is: value.js exposes a tree-shakeable leaf entry; keyframes
re-exports it; the shadow disappears; the parity promise becomes a no-op (it's the
same code). This is strictly better than the shadow + the F-A2 convergence pass —
F-A2 converges keyframes onto *its own* `leaves`, F-A6 would converge `leaves` onto
*value.js*. F-A2 is the SHIP-now keyframes-local win; F-A6 is the value.js-gated
terminal form.

**Disposition: value.js-HANDOFF (re-confirm + widen)** — extend handoff Wave F6 from
"parser-free easing sub-path" to "parser-free easing **+ leaf-math** sub-path"
(`@mkbabb/value.js/math` or equivalent), with the explicit kf-side payoff: delete
`internal/leaves.ts`, static-re-export the canonical math, dissolve the byte-parity
burden. inv-16: a proposal only; I write no value.js source. **Not urgent** — F-A2
ships the keyframes-local convergence regardless; F-A6 is the cleaner endpoint when
value.js publishes the entry.

---

## ALREADY-SOTA — manufacture NO work here

- **The value.js static/dynamic boundary itself** (`index.ts:29-178`, `CLAUDE.md`).
  Light physics with zero static value.js edge; heavy CSS engine behind
  `loadAnimationEngine`'s `await import("./engine")`. No competitor offers this
  tree-shaking granularity (GSAP is a monolith+plugins; Motion's mini bundle is
  coarser). Re-confirmed `a-kf-api-dx` A-7. **LEAVE.** (F-A1 adds a *consumer* for it;
  it does not touch the boundary.)

- **`proof:boundary` — the self-enforcing gate** (`scripts/proof-boundary.mjs:18-58`).
  Parses the entry set *from* the barrel's `export … from` statements (so a new light
  export is proven automatically), bundles each as its own entry on the real source
  graph, asserts zero value.js/`engine.ts` static edges, a dynamic-chunk presence
  check, and a source-grep complement. This is a genuinely SOTA boundary gate — the
  import truth, not a basename allowlist. **LEAVE.** (Its one gap — no *consuming*
  witness — is F-A1, an *addition* beside it, not a flaw in it.)

- **The FrameCompiler god-object split** (`frame-compiler.ts:1-13`). The D.W4
  extraction of the 1019-line `Animation` into `FrameCompiler` (pure value-in→frames-out,
  no run-state) + `adapter.ts` (input→`ResolvedKeyframes`) + `utils.ts` (the per-frame
  helpers) is exactly the right seam: compile is unit-testable without a loop, the
  runtime composes one. The parse pipeline `adapter → frame-compiler → utils → engine`
  is a clean dependency chain with no cycles. **LEAVE.**

- **The easing seam** (`easing.ts:1-89`). `toEasing` (sync, value.js-free normalizer),
  `cssTwinFor` (pure regex twin, light), `resolveEasing` (the single dynamic edge,
  fail-explicit) on the light side; `getTimingFunction` (the value.js registry lookup)
  on the heavy side. The light/heavy split of the easing family is drawn exactly at the
  value.js dependency. Re-confirmed `a-kf-api-dx` A-1/A-6. **LEAVE.**

- **`internal/reduced-motion.ts` + `internal/playback.ts` as single authorities.** One
  PRM gate consulted by every surface (collapsed three hand-rolled copies,
  `reduced-motion.ts:1-8`); one `RAFPlayback` rAF owner (the inv-ζ dogfood). The
  convergence discipline F-A2 asks for *clamp* is the discipline these already embody —
  the codebase knows how to do this; clamp is the one leaf it missed. **LEAVE.**

- **The `engine.ts` tail re-export hub** (`engine.ts:1169-1179`). A small, focused
  heavy-surface re-export (`AnimationGroup`, `getTimingFunction`, `resolveKeyframes`,
  the option constants) — not a god-barrel; it re-exports only what
  `loadAnimationEngine` surfaces. Healthy hub, not a tangle. **LEAVE.** (F-A3 *adds*
  `animations` to it — the one missing member — without changing its character.)

---

## Summary table — every finding, disposition, isomorphism

| # | Finding | `file:line` anchor | Disposition | Iso |
|---|---------|--------------------|-------------|-----|
| F-A1 | Demo + tests bypass the barrel (90 deep / 0 published); boundary gated not dogfooded | `vite.config.ts:146`, demo grep, `scripts/proof-boundary.mjs` | **BOOK** (+ SHIP-able dist smoke) | iso (import site only) |
| F-A2 | `clamp` open-coded 4× while `leaves.clamp` exists | `smooth.ts:78,132`, `timeline.ts:34`, `waapi.ts:225`, `spring.ts:110` vs `leaves.ts:23` | **SHIP-in-F** | iso (byte-identical) |
| F-A3 | `animations.ts` (870L) on no barrel — D-1 still live | `index.ts` (0 hits), `engine.ts:1169-1179`, `index.ts:130-149` | **SHIP-in-F** (heavy surface) | iso (reachability only) |
| F-A4 | `group.ts` (heavy) borrows `leaves.lerp` for 1 call | `group.ts:2,284` vs `group.ts:1` (value.js) | **SHIP-in-F** | iso (byte-identical) |
| F-A5 | `internal/` conflates leaves + platform glue + error seam | `internal/{leaves,binarySearch,reduced-motion,scheduler,errors}.ts` | **RECORD** (no reorg) | n/a (naming) |
| F-A6 | `internal/leaves` shadow = value.js packaging gap | `leaves.ts:6-16`; `valuejs-sota-handoff.md` §F6 | **value.js-HANDOFF** (re-confirm + widen) | iso (when vj ships) |

**The honest headline:** the post-E architecture is exemplary and I manufactured no
work where it leads (the boundary, the FrameCompiler split, the easing seam, the
single-authority leaves, the heavy hub — all ALREADY-SOTA). The one *notable* finding
is **F-A1**: the boundary that defines this library is rigorously *gated* but never
*consumed* by a first-party caller — the demo and tests reach into `@src/animation/*`
internals (90 deep imports, 0 through the barrel, 0 calls to `loadAnimationEngine`).
The rest are clean, isomorphic cohesion folds (F-A2 clamp-convergence, F-A3 the D-1
preset barrel, F-A4 the cross-tier `lerp`) — the codebase's own convergence idiom,
applied to the corners that missed the prior passes.
