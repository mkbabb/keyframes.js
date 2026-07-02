# Lane a19 — structural-quality deep dive of `group/` · `resolve/` · `ingest/` · `scroll/`

**Scope.** The four HEAVY zones as shipped by Tranche R (`a15cd48..18e8617`; the
zone partition is R.W1, the god-class group carve + the resolveNode DI split are
R.W2/R.W2b, the ring-break is R.W2c). Judged for structural quality: file/size
map, internal cohesion, sub-zone candidates, cross-zone leakage, dead code, and
the honesty of the R carves. The DI-quality of the *group* carve
(PlaybackHost-style free-function extraction) is lane a04; the cycle-ring is lane
a06 — I build on both and cite, not re-litigate.

Zone census (13 non-barrel `.ts` files, 3,825L incl. barrels):

| Zone | Files (L) | Barrel | Largest |
|------|-----------|--------|---------|
| `group/` | group 496 · soa 254 · compositor 241 · entries 127 · layer-api 91 · springs 92 · scheduler 52 | index 33 | **group.ts 496/500** |
| `resolve/` | index 289 · resolve-function 265 · resolve-if 199 · env 134 | *index IS the core* | index.ts 289 |
| `ingest/` | cssom 466 · adopt 348 | index 20 | cssom.ts 466 |
| `scroll/` | scene 432 · grammar 137 · range 116 | index 33 | scene.ts 432 |

---

## Executive summary

**Verdict: these four zones are the STRONGEST evidence in the R set that the
partition + carve was real, not cosmetic.** Unlike `compile/` (lane a18: a
re-export-only easing bridge that shipped ceremony) and `engine/` (lane a17: a
499/500 landing forced by a line gate), the group 3-way `layer-springs` split
(→ `entries`/`scheduler`/`springs`) and the resolve `resolveNode`-injection carve
land on genuine dependency seams. The `resolve/` mutual-recursion break
(`resolveNode` passed as a parameter into `resolve-if`/`resolve-function`) is a
textbook DI seam — no back-edge, no cycle, and the carve shape is **right**. The
`scroll/` value/time division (`grammar.ts` = value.js round-trip, `scene.ts` =
JS driver, `range.ts` = the [0,1] mapping) is a clean concern split.

But the zones carry the SAME load-bearing residue Tranche S inherits everywhere
in the R set, plus four zone-local smells:

1. **`group.ts` is 496/500L — 4 lines under the hard ceiling** (F1). This is the
   exact `engine/animation.ts` 499/500 hazard a17 flagged, in the compositor. S's
   animation-SOTA charter touches group compositing; the FIRST added line reds
   `proof:decomposition`. Headroom, not tidiness.
2. **A genuine cross-zone deep-import leak: `compile/backward.ts` reaches into
   `scroll/grammar` past the barrel** (F2) — the only barrel-piercing edge among
   the four zones' external consumers.
3. **A half-retired re-export relay in `scroll`** (F3): the barrel pulls
   `resolveRange` through `scene.ts` (a two-hop relay) while pulling `grammar`
   directly — the asymmetric residue of an incomplete R.W1 relay retirement, the
   exact "no re-export-only bridge" anti-pattern a18 named.
4. **`resolve/index.ts` is BOTH the barrel AND a 289L working module** (F5) —
   uniquely among the four zones, breaking the thin-barrel convention every
   sibling zone honors.

Three doc-hazards fold into the S docs sweep: every renamed file still names its
OLD filename in its header (F6, tranche-wide), the `group/index.ts` barrel map
describes a `layer-springs.ts` that no longer exists (F7), and three `resolve/`
barrel re-exports are dead surface (F4).

Migration cost is **LOW**: the external consumer surface of all four zones is the
zone barrel plus exactly two deep edges (the group→engine cycle-break, F8; the
compile→scroll leak, F2), so re-sub-zoning is contained.

---

## Findings

### F1 — `group.ts` at 496/500L: the compositor's near-ceiling residue *(Medium)*

`src/animation/group/group.ts` is **496 lines**; the enforced ceiling is
`LIBRARY_CEILING = { ".ts": 500 }` (`scripts/proof-decomposition.mjs:130`), and
`group.ts` carries NO `LIBRARY_CEILING_OVERRIDE` entry (only `presets/classic.ts`
does, `:139-155`). R.W2 planned `group.ts ~750L` post-carve and verified it under
the hard 500 (`R.W2.md:352,417`); the shipped 496 is honest but leaves **4 lines**
of headroom.

What remains inline is cohesive — the managed-child lifecycle + transport verbs
(`play`/`pause`/`resume`/`settle`/`reset`/`stop`/`toggle`, `group.ts:311-439`),
the field/state block (`:52-114`), and the thin per-frame delegates to
`./compositor`/`./scheduler`/`./springs`. That inline code is correctly NOT
carved (the gate-anchored spring-blend STATEMENTS and the lifecycle contract must
stay on the class seam per `soa.ts:24-31`). But the SOTA charter for S ("SOTA
uplift for animation") touches exactly the compositor path, and the near-ceiling
landing means the first added line reds the gate.

**Proposal.** Pre-emptively carve `group/lifecycle.ts` (or `transport.ts`): the
`pause`/`resume`/`settle`/`reset`/`stop`/`toggle`/`_playReducedMotion` bodies as
free functions over the concrete group (the same DI pattern `compositor.ts`
already uses), leaving `group.ts` as the class shell + field state + thin
delegates. This is the identical remedy a17 proposed for `engine/` — book them as
ONE decomposition wave so the pattern is applied uniformly, not per-zone-panic.
Net: ~80-100L off `group.ts`, real headroom before any hot-path touch.

### F2 — cross-zone deep-import leak: `compile/backward.ts` → `scroll/grammar` *(Low-Medium)*

`src/animation/compile/backward.ts:70-71` imports `serializeScrollOptions` +
`CSSTimelineOptions` from `"../scroll/grammar"` — the internal file, NOT the zone
barrel `"../scroll"`. The barrel re-exports both symbols
(`scroll/index.ts:24,30`), so the deep import is gratuitous: it couples `compile/`
to `scroll/`'s internal file layout. If S sub-zones `scroll/grammar` (a plausible
move under a scroll-SOTA wave), `backward.ts` breaks. This is the ONLY
barrel-piercing edge into any of the four zones from outside (verified by grep:
all other external consumers hit the barrel).

**Proposal.** Retarget `backward.ts:70-71` → `"../scroll"`. Book a
`proof:no-cross-zone-deep-import` gate clause (grep-based, like the existing zone
gates): a `compile/**` module importing `../scroll/<file>` instead of `../scroll`
is a red. This closes the class, not just the instance.

### F3 — half-retired re-export relay in `scroll` *(Low)*

The scroll barrel comment claims "the former scene.ts→grammar hub re-export relay
is retired here" (`scroll/index.ts:6`) — and grammar IS now imported directly by
the barrel (`:20-33`). But `resolveRange`/`ResolvedRange` are STILL relayed
through `scene.ts`: the barrel pulls them from `"./scene"` (`index.ts:9,16`), and
`scene.ts:62-63` re-exports them from `"./range"`. That is a two-hop relay
(`range` → `scene` → barrel) whose only purpose is path preservation — the exact
"re-export-only bridge module" anti-pattern lane a18 flagged in `compile/`. The
retirement was done for `grammar` and left half-done for `range`.

**Proposal.** Barrel imports `resolveRange`/`ResolvedRange` directly from
`"./range"`; delete `scene.ts:62-63`. Symmetric with how `grammar` is already
handled. Fold the "no re-export-only bridge" gate clause a18 proposes to cover
this too.

### F4 — dead barrel re-exports in `resolve/` *(Low)*

`resolve/index.ts` re-exports `splitCondition` (`:56`), `isStyleConditionIf`
(`:58`), and `resolveFunctionCall` (`:54`) at the zone barrel. Grep across
`src`/`test`/`scripts` shows **zero** runtime importers of these through the
barrel: `splitCondition` has no external consumer at all; `isStyleConditionIf`
and `resolveFunctionCall` appear ONLY as source-grep *strings* in proof scripts
(`proof-emerging-css-resolve-p2.mjs:94`, `proof-emerging-css-resolve-fn.mjs:109`),
which assert the identifier exists in-module — they do not import it. The only
real external consumer of the resolve barrel is `engine/element-resolve.ts:25`,
which pulls the resolution machinery (`makeResolveContext`/`resolveValues`/
`hasPhase2Node`/…) — all live. The three re-export lines are surface bloat.

**Proposal.** Drop the three from the barrel's re-export block (keep the
module-level `export` in `resolve-if.ts`/`resolve-function.ts` that the gates
grep for). Net: −3 dead public symbols.

### F5 — `resolve/` breaks the thin-barrel convention *(Low)*

`resolve/index.ts` is simultaneously the zone barrel AND a 289L working module
(the core `resolveNode`/`resolveValues`/`hasResolvableValue`/`hasPhase2Node`
recursion + the `spring()`→`Easing` helpers). Every sibling zone has a THIN
`index.ts` barrel + named concern files: `group/index.ts` (33L), `ingest/index.ts`
(20L), `scroll/index.ts` (33L). `resolve/` uniquely made its core file THE barrel
(git: `resolve-values.ts → resolve/index.ts`, R.W1). Consequence: `../resolve`
cannot be a pure re-export firewall — importing the barrel drags the whole
recursion module, and lane a17's "zone-pure barrel" property (which `engine/`,
`group/`, `ingest/`, `scroll/` all satisfy) is the one property `resolve/` lacks.

Two orthogonal concerns are also co-housed in that barrel: the CSS `spring()` →
`Easing` helpers (`springCssToOptions`/`resolveSpringTiming`, `:96-132`) are an
easing/timing-function concern, not a keyframe-value lowering — they sit here only
because `resolveNode` leaves `spring()` intact for the timing seam.

**Proposal.** Normalize `resolve/` to the zone convention: a thin `index.ts`
barrel + `resolve/core.ts` (the recursion) + `resolve/spring-css.ts` (the two
`spring()` helpers). This is the "the carve that landed on a seam vs the carve
that clipped a line" distinction — resolve/ carved the mutual recursion correctly
(F9) but never finished the barrel/core separation the other three zones got.

### F6 — stale filename self-references in file headers (R.W1 rename residue) *(Low)*

Every renamed file in these zones still names its OLD filename in its doc-comment
header, and references sibling files by their pre-rename names:

- `scroll/scene.ts:1` — "scroll-scene.ts"; `:19` references "`./scroll-grammar`".
- `scroll/grammar.ts:1` — "scroll-grammar.ts"; "Split out of `scroll-scene.ts`".
- `ingest/cssom.ts:1` — "ingest-cssom.ts"; "Split out of `ingest.ts`"; "the
  sibling `ingest.ts`".
- `ingest/adopt.ts:1` — "ingest.ts"; references "`./ingest-cssom`".

The R.W1 rename moved the file (git confirms `ingest.ts→ingest/adopt.ts`,
`scroll-scene.ts→scroll/scene.ts`, etc.) but not its self-description. This is a
**tranche-wide** pattern — grep also hits `adapter.ts`, `index.ts`,
`engine/element-resolve.ts`, `orchestration/sequence/*` — so it is a method gap,
not a one-off: the R waves renamed files without a header-refresh pass.

**Proposal.** A header-refresh sweep (fold into the S docs wave with a17's
`src/animation/CLAUDE.md` regen). Consider a cheap gate: the first `@file`/header
line's named filename must equal the basename. Prevents the next rename from
re-orphaning headers.

### F7 — `group/index.ts` barrel map lies about the zone contents *(Low)*

`group/index.ts:4-6` describes the zone as `group.ts` "over `soa.ts` … and
`layer-springs.ts` (the spring-weight helpers)". But `layer-springs.ts` was 3-way
split in R.W2 (→ `entries.ts`/`scheduler.ts`/`springs.ts`) and **no longer
exists** (`ls src/animation/group/` confirms: compositor, entries, group, index,
layer-api, scheduler, soa, springs). The barrel's own module map names a file
that was deleted in the same tranche. Fold into F6's sweep.

### F8 — the group→engine cycle-break is minimal and correct (info / do-not-touch)

`group/` deep-imports `../engine/animation` in four files, but only ONE is a
runtime edge: `group.ts:7` (`import { KeyframesAnimation }` — needed for the
`instanceof` guard at `:124`). The other three (`entries.ts:19`, `layer-api.ts:20`,
`index.ts:12`) are `import type`, erased under `verbatimModuleSyntax`. This is the
R.W2c ring-break: `group→engine` is inverted by `registerGroupFactory` DI
(`index.ts:27-33`), and the residual group→engine edge is a single deep VALUE
import that deliberately bypasses the engine barrel — importing the value through
`../engine` would re-create the very cycle the ring-break dissolved. The shape is
right; record it so no S sub-agent "cleans it up" into a cycle. (One consequence
for S: if `engine/` sub-zones per a17, `engine/animation.ts` must stay the home of
`KeyframesAnimation` or `group.ts:7`'s path breaks — cross-lane constraint with
a17.)

### F9 — the `resolveNode`-injection carve is textbook (info / positive)

`resolve/` decomposed a mutually-recursive rewriter across three files without a
cycle by INJECTING the core dispatcher as a parameter: `resolveIf` and
`resolveFunctionCall` take `resolveNode: ResolveNode` (`resolve-function.ts:37-41`,
`resolve-if.ts:15`, called through at `resolve/index.ts:157,173,179,184`). No file
imports another's recursion entry as a static edge; the mutual recursion is closed
at the call site. The owner's question — "is the resolveNode carve shape right?" —
answers YES. The only refinement is F5 (barrel-vs-core), which is orthogonal to
the recursion seam. Do not re-open the injection design.

### F10 — duplicated lazy-transform resolution (info / minor)

The I.W0 S3 "resolve the composite transform from the first parsed child" logic
appears twice: `group.ts:134-139` (constructor, first child) and
`compositor.ts:147-155` (per-frame fallback). They serve different lifecycle
points (construct-time vs first-real-frame), so it is not strictly dead, but the
`transform === NOOP_TRANSFORM` scan is stated in two places. If a `group/lifecycle`
carve happens (F1), consolidate into one `resolveCompositeTransform(group)` helper.

### F11 — `env.ts` diagnostics structural-type workaround (info)

`ResolveContext.diagnostics` is typed as an inline structural shape
`Array<{ code; property?; message }>` (`env.ts:65`) rather than importing
`adapter.ts`'s `Diagnostic`, to avoid a circular dep (documented at `:60-64`). It
is assignment-compatible with `Diagnostic[]`. Not a defect, but a coupling smell:
if S relocates the `Diagnostic` type to a leaf (`internal/`), the duck can become
the real type and the comment retires. Book as a value.js/adapter-adjacent note,
not a wave.

---

## Cohesion & sub-zone verdicts (per the owner's prompts)

- **`group/` — carve is HONEST, not cosmetic.** The 3-way `layer-springs` split
  is by genuine concern: `entries.ts` (name↔ref lookup + key-union + multi-target
  render — no `this`), `scheduler.ts` (INP-yield batching), `springs.ts` (the
  PHYS-C spring lifecycle). `compositor.ts` (single-target composite + boxed
  blend arm) and `soa.ts` (the Float64 fold) are a clean fast-path/plan split.
  This is the counter-example to a18's `compile/` ceremony carve — record it as
  the model. Only residue: F1 (near-ceiling) + F7 (stale barrel doc).
- **`resolve/` — carve seam RIGHT (F9), barrel convention WRONG (F5).** Sub-zone
  candidate: thin barrel + `core.ts` + `spring-css.ts`. Do NOT re-touch the
  injection design.
- **`ingest/` — clean two-file split, no sub-zone needed.** `cssom.ts` (466L, the
  stylesheet walk + reconstruction) and `adopt.ts` (348L, the temporal takeover)
  are cohesive; `cssom.ts` has headroom to 500 but is one responsibility (the
  CSSOM walk). Only residue: F6 (stale headers). No further split.
- **`scroll/` — value/time split is RIGHT; do not split scene further YET.**
  `grammar.ts` (value.js round-trip) / `scene.ts` (JS driver) / `range.ts` (the
  mapping, already carved off in R.W2b) is the correct division. `scene.ts` (432L)
  holds three public concerns (the `ScrollScene` class ~167L, `dispatchScrollBackend`,
  `pinCSS`) with headroom; a `scene.ts`/`dispatch.ts`/`pin.ts` split is a
  DEFER-until-scroll-SOTA move, not a now-need. Residue: F2 (leak) + F3 (relay) +
  F6 (stale headers).

**Cross-zone leakage summary.** Only ONE barrel-piercing external edge exists
across all four zones (F2, `compile→scroll/grammar`); the group→engine deep import
(F8) is the deliberate cycle-break; `element-resolve→../resolve` uses the barrel.
The barrel firewall holds everywhere except F2. **Dead code:** F4 (three dead
`resolve` barrel re-exports); no dead private methods found in any of the 13
files.

---

## Tranche-S implications (wave-shaped)

1. **S decomposition wave — "carve the near-ceiling shells UNIFORMLY" (F1 + a17
   F).** `group.ts` (496/500) and `engine/animation.ts`/`playback.ts` (499/498)
   are the same hazard in three files. ONE wave: carve `group/lifecycle.ts` (the
   transport verbs as free functions over the group) alongside a17's engine
   carves, driven by the concern map, not the line count. Verify against
   `proof:decomposition` + replay-equality. Do this BEFORE any hot-path SOTA touch
   or the first SOTA commit reds the gate.

2. **S structural wave — "close the barrel-firewall holes" (F2 + F3 + F4).**
   Retarget `compile/backward.ts` → `../scroll`; delete the `scene.ts→range`
   relay (barrel imports `range` directly); drop the three dead `resolve` barrel
   re-exports. Born-RED two gate clauses: `no-cross-zone-deep-import` (a
   `compile/**`/`engine/**` module importing `../<zone>/<file>` instead of
   `../<zone>` reds) and the a18 "no re-export-only bridge module" clause (catches
   F3 and the a18 `compile` case in one gate). *Net: the barrel firewall becomes
   enforced, not aspirational.*

3. **S structural wave — "normalize `resolve/` to the zone convention" (F5).**
   Thin `resolve/index.ts` barrel + `resolve/core.ts` (recursion) +
   `resolve/spring-css.ts` (the `spring()`→`Easing` helpers). Pairs with wave 2's
   gate (the barrel becomes a pure re-export surface, matching the other three
   zones). Leave the `resolveNode` injection seam untouched (F9).

4. **S docs sweep — "header-refresh + barrel-map truth" (F6 + F7 + F11).** Fold
   into a17's `src/animation/CLAUDE.md` regen: refresh every renamed file's header
   filename (tranche-wide, not just these zones), fix `group/index.ts`'s
   phantom-`layer-springs.ts` map, note the `env.ts` diagnostics duck. Cheap gate:
   header-basename-must-match. Prevents the next rename re-orphaning headers — the
   R method's blind spot made citable.

5. **Method note for the S plan (not a wave).** Record that `group/` and
   `resolve/`'s recursion are the R set's *honest carves* (concern-seam-driven),
   in contrast to a18's `compile/` easing ceremony (line-gate-driven). S's
   decomposition charter should point sub-agents at these two as the model and at
   the `compile` easing bridge as the anti-model — the difference is whether a
   free-function extraction has ZERO `this` and lands on a dependency edge
   (`entries`/`scheduler`/`springs`/`compositor` do; a re-export bridge does not).

6. **Cross-lane constraint (F8 → a17).** If S sub-zones `engine/` per a17,
   `KeyframesAnimation` must remain in `engine/animation.ts` or `group.ts:7`'s
   cycle-break deep-import breaks. Book this as an explicit a17↔a19 dependency in
   the S plan so the engine carve and the group carve are sequenced, not raced.
