# Lane a17-zone-engine — structural-quality deep dive of `src/animation/engine/`

**Scope.** The `engine/` zone as shipped by Tranche R (`a15cd48..18e8617`,
implemented `4b0cc17`/`d3c6976`): 12 `.ts` siblings, 2758L. Judged for
structural quality — concern map, ideal sub-layout, `engine/css/` hypothesis,
misplaced `waapi.ts`-era logic, and the `CSSKeyframesAnimation` vs
`KeyframesAnimation` split. The DI-quality of the carve (PlaybackHost excision,
PlaybackState partial extraction) is covered by lane **a03-w2-engine-carve** and
is not re-litigated here; I build on it and cite it.

---

## Executive summary

**Verdict: the R carve is REAL and honest — every file is a named concern under
the 500L hard ceiling — but the zone is now 12 FLAT siblings, and two of them
(`animation.ts` 499L, `playback.ts` 498L) sit ONE-to-TWO lines under the ceiling.
That is the load-bearing residue Tranche S inherits: S's animation SOTA work
touches exactly `playback.ts`/`interpolate.ts`/`animation.ts`, so the FIRST
commit that adds a line to either reds `proof:decomposition`. The sub-zoning the
owner suspects (`engine/css/`, `engine/options/`) is not cosmetic tidiness — it
is the headroom S needs before it can touch the hot path at all.**

The `engine/css/` hypothesis is **confirmed**: `css-animation.ts` +
`css-metadata.ts` (446L) are a clean, self-contained CSS cluster with zero
external deep-importers. The `KeyframesAnimation` / `CSSKeyframesAnimation` split
is genuinely clean by concern.

No `waapi.ts`-era logic is misplaced in `engine/`: WAAPI is now its own 5-file
zone (`waapi/`), and `engine/`'s only edge is a single import in `playback.ts`.

Three doc/gate hazards surfaced that S must fold: (1) `src/animation/CLAUDE.md`
still describes the PRE-R flat layout and the pre-5.0.0 class name `Animation<V>`
— the authoritative module map lies about the shipped structure; (2) the project
`CLAUDE.md` zone tree omits the `waapi/` zone entirely; (3) `proof-engine.mjs`
scans `engine/` NON-recursively, so any sub-zoning silently defeats its
PlaybackHost cast/export scan unless co-edited.

Migration cost of the ideal layout is **LOW** — the zone barrel already
firewalls every external consumer (tests deep-import zero engine internals; only
`group/` and two gates hardcode internal paths).

---

## Concern map — every file in `engine/` (12 files, 2758L)

| File | L | Concern | value.js edge | Notable coupling |
|------|---|---------|---------------|------------------|
| `index.ts` | 29 | Zone barrel (zone-pure: re-exports only `engine/`) | via re-exports | → `../compile`, `../adapter`, `../constants` |
| `public.ts` | 143 | **Subpath composition SINK** — mirrors `load-engine.ts`'s whole `AnimationEngine` across ALL zones | heavy (intended) | → group/svg/scroll/ingest/compile/validate/presets |
| `animation.ts` | **499** | Base `KeyframesAnimation` — thin delegating shell over 6 sibling modules | **type-only** (`ValueUnit`); heavy transitively via `FrameCompiler` | composes `PlaybackState`, delegates to playback/interpolate/setters/compile-bridge/element-resolve |
| `css-animation.ts` | 277 | `CSSKeyframesAnimation` subclass — `fromString`/`fromVars`/`fromKeyframes`/`bindTimeline` | heavy (`ValueUnit`, `isObject`) | → `css-metadata`, `../adapter`, `../compile`, `../easing`, `../orchestration/timeline` |
| `css-metadata.ts` | 169 | CSS metadata recovery (`@property` registry, scroll-grammar, animation-shorthand base) | heavy (types + `extractTimelineOptions`) | pure over `stylesheet`/`registry`/`diagnostics` — narrow seam |
| `playback.ts` | **498** | Standalone-play machine + `PlaybackState` struct + transport verbs | `sleep` only | → `../waapi` (the ONE engine→waapi edge), `../internal/reduced-motion` |
| `interpolate.ts` | 307 | Interpolation HOT PATH (`interpFrames`/`processFrame`/`clearBuffer`) + SoA fold | `clamp`/`lerpArray`/`lerpValue`/`scale` | → `composition`, `../internal/binarySearch`, `../compile/frame-compiler` |
| `composition.ts` | 221 | `animation-composition` honoring (add/accumulate/replace) | `ValueUnit` only | takes explicit `CompositionRuntime` — textbook narrow seam (no `this`) |
| `options.ts` | 193 | Pure option NORMALIZERS (fail-explicit) | `parseCSSTime` only | ZERO animation coupling — unit-testable in isolation |
| `option-setters.ts` | 159 | Option APPLY surface (normalize + live-options side effects) | none direct | → `options`, `playback` (`shouldReverse`) |
| `compile-bridge.ts` | 101 | `parse`/`adoptCompiled` bridge to `FrameCompiler` + stable-key/composition cache re-derive | none direct | → `composition`, `../compile` (transitively) |
| `element-resolve.ts` | 162 | Emerging-CSS Phase-2 element-AWARE resolution (`setTargets`) | `ValueArray` | → `../resolve` (its full dep-set) — **header admits it coheres with `resolve/`, not engine** |

**Cohesion clusters** (the natural sub-zones):
- **CSS** — `css-animation.ts` + `css-metadata.ts` (446L)
- **Options** — `options.ts` + `option-setters.ts` (352L)
- **Interpolation** — `interpolate.ts` + `composition.ts` (528L)
- **Playback** — `playback.ts` alone (498L; internally = machine + `PlaybackState` + reduced-motion snap + WAAPI lifecycle wrappers)
- **Bridges** — `compile-bridge.ts` (→compile), `element-resolve.ts` (→resolve)
- **Barrels** — `index.ts`, `public.ts`
- **Shell** — `animation.ts`

---

## Findings (severity-ranked)

### F1 — `animation.ts` (499L) and `playback.ts` (498L) are at the hard ceiling; S is blocked at its first hot-path commit — **HIGH**

`scripts/proof-decomposition.mjs:130` sets `LIBRARY_CEILING = { ".ts": 500 }` as
the R.W0 KEYSTONE hard cap (the self-raising override map was deleted; only the
`presets/classic.ts` data-volume exception survives, `:139`). Measured today:

```
499 src/animation/engine/animation.ts
498 src/animation/engine/playback.ts
```

`node scripts/proof-decomposition.mjs` → PASS, but with **1L and 2L of
headroom**. Tranche S's charter is "SOTA uplift for animation (kf)" — the hot
path is `playback.ts`/`interpolate.ts`/`animation.ts`. Any net-positive edit to
`playback.ts` or `animation.ts` reds the gate on the spot. This converts the
sub-zoning from "nice tidiness" into a **prerequisite**: S cannot touch the play
machine without first splitting it. This is the single most consequential piece
of residue in the zone.

**Proposal.** Split `playback.ts` into `engine/playback/{machine.ts, state.ts,
reduced-motion.ts}` (transport verbs / `PlaybackState` / the two reduced-motion
snaps) and trim `animation.ts` (much of its 499L is JSDoc + 15 one-line
delegators; a `css/` + `options/` sub-zone extraction also lets its import block
shrink). Do this in S.W-early, BEFORE any hot-path SOTA wave.

### F2 — `engine/css/` hypothesis CONFIRMED — `css-animation.ts` + `css-metadata.ts` are a clean, cheap-to-extract cluster — **MEDIUM**

`css-metadata.ts` is INTERNAL (not a barrel export; `css-metadata.ts:9`) and its
ONLY importer is `css-animation.ts` (`css-animation.ts:24-28`). Together they are
the entire CSS-parsing surface of the engine — `fromString`, `@property`
registration, scroll-grammar recovery, animation-shorthand base recovery. Nothing
outside `engine/` deep-imports either. This is the textbook case for a sub-zone:

```
engine/css/
├── index.ts          # re-exports CSSKeyframesAnimation
├── css-animation.ts  # the subclass
└── metadata.ts       # css-metadata.ts (renamed — the `css-` prefix is redundant under css/)
```

Migration cost: move 2 files, add 1 barrel, update `engine/index.ts:20`
(`from "./css-animation"` → `from "./css/css-animation"` or `"./css"`), and
co-edit `proof-engine.mjs` (see F6). Zero external churn.

### F3 — `src/animation/CLAUDE.md` describes the PRE-R flat layout and the dead class name `Animation<V>` — **HIGH** (NO-legacy ethos)

The sub-CLAUDE.md — the authoritative library module map — still documents the
pre-partition world:

- `src/animation/CLAUDE.md:42` — ``├── engine.ts # HEAVY: defines Animation + CSSKeyframesAnimation``
- `:44` `group.ts`, `:45` `waapi.ts` as flat single files (all three are now zone directories)
- `:78` ``### `Animation<V extends Vars>` (`engine.ts`)`` — the class was renamed `KeyframesAnimation` in 5.0.0 (`animation.ts:48-52`); the legacy `Animation` alias was DROPPED (Q.WE1)
- `:91` ``CSSKeyframesAnimation<V> extends `Animation<V>` (`engine.ts`)``

The entire "## Files" tree and "## Classes" section describe a structure that no
longer exists. For a tranche whose mission is "NO legacy/deprecated code
anywhere," a module map that lies about the shipped layout AND uses a deleted
class name is exactly the kind of drift S must terminate. (Sibling lane
a13-w7-readme-llms covers README/llms.txt; this sub-CLAUDE appears unowned.)

### F4 — `proof-engine.mjs` scans `engine/` NON-recursively — sub-zoning silently defeats the PlaybackHost gate — **MEDIUM**

`scripts/proof-engine.mjs:124`:

```js
const files = readdirSync(join(root, engineDir)).filter((f) => f.endsWith(".ts"));
```

This is a flat `readdirSync` — it does NOT recurse. The clause header (`:120`)
claims "Both scan EVERY `.ts` under the directory, so a leak in any carved
sub-module bites" — but the moment F1/F2 move files into `engine/css/` or
`engine/playback/`, those files fall OUT of the scan, and a re-introduced
`as unknown as PlaybackHost` cast in `engine/playback/machine.ts` would pass
silently. The gate's own promise becomes false under sub-zoning.

**Proposal.** Any S wave that sub-zones `engine/` MUST co-edit this loop to a
recursive walk (the gate already has `collectSources`-style helpers elsewhere in
`scripts/`). Also `proof-engine.mjs:43,84` hardcode
`src/animation/engine/animation.ts` — a co-edit if the base shell moves.

### F5 — `element-resolve.ts` is self-documented as belonging to `resolve/`, not `engine/` — **MEDIUM**

`element-resolve.ts:12-16` states outright:

> "This logic coheres with `resolve-values.ts` (its full resolution-engine
> dependency set), **not with the interpolation or playback concerns of the
> animation class** — so it lives here as a free function over the animation's
> PUBLIC compiler/targets/parse surface."

It imports `DROP`, `hasPhase2Node`, `makeResolveContext`, `resolveValues`,
`ResolveEnv` from `../resolve` (`:19-25`) and touches the animation only through
its public `compiler`/`targets`/`parse()` surface. Its placement in `engine/` is
justified solely by "it's called from `setTargets`." This is a genuine
cohesion-vs-call-site tension the R carve left unresolved. It is the emerging-CSS
Phase-2 pass and belongs conceptually beside Phase-1 in `resolve/` (e.g.
`resolve/element-aware.ts`), with `animation.ts` calling it as a delegate exactly
as it does now. S should decide this deliberately rather than inherit the
convenience placement.

### F6 — project `CLAUDE.md` zone tree omits the `waapi/` zone — **MEDIUM**

The project `CLAUDE.md` "## Project Tree" enumerates the HEAVY zones as
"`engine/`, `group/`, `compile/`, `resolve/`, `ingest/`, `scroll/`) + `presets/`
+ `svg/`" — **`waapi/` is absent**, yet it is a real 5-file zone
(`waapi/{eligibility,emission,options,delegation,densify}.ts` + barrel;
`waapi/index.ts` header). The only `waapi` mention in `CLAUDE.md` is the
`waapi.ts` filename in the Architecture Notes (`:104`), which is also stale (it's
a directory). S's structural doc-truthing must add `waapi/` to the zone roster.

### F7 — `public.ts` is a cross-zone build SINK misfiled inside `engine/` — **LOW-MEDIUM**

`public.ts` re-exports EVERY heavy zone — group, svg, scroll, ingest, compile,
validate, presets (`public.ts:52-143`) — to mirror `load-engine.ts`'s
`AnimationEngine` for the `@mkbabb/keyframes.js/engine` subpath. Its own header
(`:16-24`) explains it CANNOT live in `engine/index.ts` (would re-close the
engine↔group cycle) and is a build-entry sink nothing in `src/animation/**`
imports. That reasoning is sound, but the file is not an "engine" concern — it is
the subpath composition ROOT, a sibling of `load-engine.ts`. Placing it in
`engine/` makes the zone barrel and the subpath barrel look like peers when one
is zone-pure and the other is cross-zone. S should consider hoisting it to
`src/animation/engine-public.ts` (beside `load-engine.ts`, both being the
static/dynamic boundary's two halves) so `engine/` stays a pure zone dir.

### F8 — `css-animation.ts` header overstates the base as "value.js-agnostic" — **LOW**

`css-animation.ts:6-7` and `animation.ts` docs frame the base
`KeyframesAnimation` as "value.js-/scroll-agnostic." SCROLL-agnostic is accurate.
value.js-agnostic is not: the base's own direct value.js import is type-only
(`animation.ts:10`, erased), but it statically imports `FrameCompiler` and
`transformTargetsStyle` from `../compile` (`:27,30`), both value.js-bearing — so
the base rides the heavy chunk. The split is by CONCERN (CSS parsing vs core),
not by weight, and that is fine and honest; the header should say so rather than
imply a weight boundary that doesn't exist.

### F9 — `CSSKeyframesAnimation.transform()` appears to be a vestigial public method — **LOW**

`css-animation.ts:274-276` defines `transform(vars)` = `transformTargetsStyle(vars,
this.targets)` — byte-identical to the base's `_defaultTransform` (`animation.ts:150`).
A repo-wide grep for a `.transform(` call resolving to this method finds none
(the hits are `AnimationGroup.transform`, `Draggable.transform`, and
frame-level `frame.transform` — all different). It looks like a leftover public
seam superseded by `_defaultTransform`/`resolveTransform`. S's NO-legacy sweep
should confirm it has no external consumer and delete it, or document why it
stays.

### F10 — `group/` deep-imports `../engine/animation`, coupling to the internal file path — **LOW**

`group/group.ts:7`, `group/entries.ts:19`, `group/index.ts:12`,
`group/layer-api.ts:20` all import `KeyframesAnimation` from `../engine/animation`
(concrete + type), bypassing the `engine/index.ts` barrel. This couples `group/`
to engine's internal file layout: F1/F2's moves (splitting/renaming
`animation.ts`) break these four sites. Importing from `../engine` (the barrel,
one-directional and cycle-free since `engine/index.ts` never imports group) would
decouple them. Minor, but folds naturally into the F1 migration.

### F11 — `proof-decomposition.mjs` header cites a 550L ceiling; the constant is 500L — **LOW (doc)**

`scripts/proof-decomposition.mjs:22` says "(350L `.vue`, 550L `.ts`)"; the
enforced constant `:130` is `".ts": 500`. Trivial header drift, but it is exactly
the kind of gate-doc inaccuracy that misleads an S author about how much headroom
`animation.ts`/`playback.ts` actually have (they have 1-2L against 500, not 51-52L
against 550).

---

## The ideal `engine/` layout + migration cost

Current: 12 flat siblings — the same "flat sibling junk-drawer" shape R.md
decried at the `engine.ts`-monolith level, now reproduced one directory down. The
concern clusters ARE discoverable by naming, so this is not a crisis — but the
ceiling pressure (F1) forces at least a partial split, and if we split at all,
split by the real seams:

```
engine/
├── index.ts              # zone barrel (unchanged surface)
├── animation.ts          # base KeyframesAnimation shell (trimmed; imports sub-barrels)
├── css/
│   ├── index.ts          # → CSSKeyframesAnimation
│   ├── css-animation.ts
│   └── metadata.ts       # (was css-metadata.ts)
├── options/
│   ├── index.ts
│   ├── normalize.ts      # (was options.ts)
│   └── apply.ts          # (was option-setters.ts)
├── playback/
│   ├── index.ts
│   ├── machine.ts        # transport verbs + advanceTo/onStart/onEnd/playFrame
│   ├── state.ts          # PlaybackState + the WAAPI-lifecycle wrappers
│   └── reduced-motion.ts # playReducedMotion + snapToReducedMotion
├── interpolate/
│   ├── index.ts
│   ├── interpolate.ts    # hot path
│   └── composition.ts    # animation-composition honoring
├── compile-bridge.ts     # stays flat (small, singular →compile bridge)
└── element-resolve.ts    # MOVE to resolve/ (F5) — or stays as engine's resolve-bridge
```

**Migration cost: LOW.** The firewall is already built:
- **Tests: zero blast radius** — `grep -rln "engine/" test/` = 0; tests reach the
  engine only through the barrel / `loadAnimationEngine()`.
- **External importers: two hardcoded sites** — `group/*` (F10, 4 lines) and
  `proof-engine.mjs` (F4/F6, `:43/:84/:124`). Both are co-edits, not rewrites.
- **`proof:decomposition` sweeps `src/animation/**` RECURSIVELY** (its
  `collectSources` walks subdirs), so new sub-zone files are auto-swept — no gate
  co-edit needed THERE. Only `proof-engine.mjs`'s flat `readdirSync` needs the
  recursive fix (F4).
- **Build**: `vite.config.ts`'s `engine/index` named entry + `public.ts` sink are
  path-stable if `index.ts`/`public.ts` stay put.

The honest disposition: `css/` and `playback/` are BOTH warranted (css/ for
cohesion, playback/ for the ceiling). `options/` and `interpolate/` are optional
polish — do them only if the barrel churn is already being paid. Do NOT
manufacture a sub-zone for `compile-bridge.ts` (a singular 101L bridge).

---

## `waapi.ts`-era logic — where it landed (no misplacement)

R.W1/R.W2 lifted the flat `waapi.ts` into its own `waapi/` zone
(`waapi/index.ts` header): `eligibility.ts` (the `isWAAPIEligible` predicate +
layout-unit guard), `emission.ts` (`toWAAPIKeyframes` + densify), `options.ts`
(`toWAAPIOptions`), `delegation.ts` (`playWAAPI` + native-scroll bridge),
`densify.ts`. **No eligibility/emission/options logic leaked into `engine/`.** The
engine's ONLY WAAPI edge is `playback.ts:42` — `import { isWAAPIEligible,
playWAAPI } from "../waapi"`. The WAAPI *lifecycle* wrappers that DO live in
`engine/playback.ts` (`playViaWAAPI`, `cancelWAAPI`, the WAAPI arm inside
`play()`) are correctly placed: they are play-machine orchestration (arm the
shadow loop, cancel compositor handles on stop/reduced-motion), not WAAPI
eligibility/emission. This split is clean and is a genuine R success. The only
residue is documentary — `CLAUDE.md` still calls it `waapi.ts` (F6).

## `CSSKeyframesAnimation` vs `KeyframesAnimation` split — clean

The subclass boundary is honest and by-concern:
- Base `KeyframesAnimation` (`animation.ts`): frame pipeline (`addFrame`/`parse`),
  the play-machine delegators, `interpFrames`/`at`, `setTargets`, `group()`,
  option setters. Scroll-/CSS-agnostic.
- `CSSKeyframesAnimation` (`css-animation.ts`): `fromString`/`fromVars`/
  `fromKeyframes`, `bindTimeline` + `_boundTimeline` (scroll named-selectors),
  `propertyRegistry`, `scrollOptions`, `resolveTransform`. Every added field/method
  is genuinely CSS- or scroll-specific.

The only nits are F8 (the "value.js-agnostic base" overstatement) and F9 (the
possibly-dead `transform()` override). Structurally the two-class layer is a
correct, non-cosmetic seam — sub-zoning it into `engine/css/` (F2) sharpens it
without disturbing the class hierarchy.

---

## Tranche-S implications (wave-shaped)

1. **S.W-early — `engine/` sub-zone BEFORE any hot-path SOTA wave (unblocks F1).**
   Split `playback.ts` → `engine/playback/{machine,state,reduced-motion}.ts` and
   extract `engine/css/` (F2) + optionally `engine/options/`, `engine/interpolate/`.
   Co-edit the three hardcoded importers: `group/*` (→ barrel, F10),
   `proof-engine.mjs:43/84` (path) and `:124` (**make the PlaybackHost scan
   recursive**, F4). This is a PREREQUISITE for S's animation SOTA work, not
   optional tidiness — `animation.ts`/`playback.ts` have 1-2L of ceiling headroom.

2. **S.W — decide `element-resolve.ts`'s home (F5).** Either move it to
   `resolve/element-aware.ts` (honoring its own header's cohesion claim, with
   `animation.ts` calling it as a delegate) or record explicitly why the call-site
   placement wins. Do not inherit the ambiguity.

3. **S.W-docs — truth the module maps (F3, F6, F11).** Rewrite
   `src/animation/CLAUDE.md`'s "## Files"/"## Classes" for the R zone layout and
   the `KeyframesAnimation` name; add `waapi/` to the project `CLAUDE.md` zone
   roster; fix the 550→500 header in `proof-decomposition.mjs`. Fold into S's
   NO-legacy doc sweep.

4. **S.W-hygiene — resolve the vestigial surface (F9).** Confirm
   `CSSKeyframesAnimation.transform()` has no consumer and delete it, or document
   its contract. Reconsider hoisting `public.ts` → `src/animation/engine-public.ts`
   beside `load-engine.ts` so `engine/` is a pure zone dir (F7).

5. **Method-level note for the owner.** The R carve's structural honesty is
   verifiable and verified (green gates, real seams — see a03). The failure mode S
   should prune is the OPPOSITE of Q's "cosmetic decomposition": here the
   decomposition is real but the gate that guards it (`proof-engine.mjs`) is
   path-fragile and will go BLIND under the very sub-zoning S needs. The lesson:
   when a gate hardcodes a flat directory scan, the next structural wave must treat
   the gate as a co-edit dependency, not a fixed oracle.

---

**Evidence anchors:** `src/animation/engine/*.ts` (all 12 files read in full);
`scripts/proof-decomposition.mjs:130,139`; `scripts/proof-engine.mjs:43,84,124`;
`src/animation/CLAUDE.md:42,44,45,78,91`; `CLAUDE.md` project-tree zone list;
`src/animation/waapi/index.ts`; `src/animation/engine/playback.ts:42`;
`src/animation/group/{group,entries,index,layer-api}.ts` engine deep-imports;
`node scripts/proof-decomposition.mjs` → PASS (1-2L headroom).
