# A.W1 — Boundary ergonomics + CI repair (design slice)

The design the §Completion-criterion requires: name the `EasingResolvable` contract shape and why a class, fix the silent-linear window, spec the `build:lib` split against the live `vite.config.ts` (and the deeper two-headed CI break it surfaced), name the `proof:boundary` mechanism, and carry the WAAPI `linear()` widening to a land-or-refute verdict. The CI repair rides this wave because it is engine-code-free—a script + workflow + manifest edit—and it is the unblock for everything downstream.

Five decisions, each WHAT + WHY, each cited to landed source.

---

## 1. `EasingResolvable` — the contract shape

### The seam

The light engines (`NumericAnimation`, `ElementMorph`, the `Timeline` family) accept easing as EITHER a callable `TimingFunction` (`(t) => number`, value.js-free, used directly) OR a string easing *name* from value.js's registry (`"easeOutCubic"`, ...). A name can only be resolved through the heavy engine—value.js owns the registry—so resolution rides the dynamic `import("../engine")` boundary: the one value.js edge, taken once, lazily, only when a named easing is actually used.

Before A this dance was hand-rolled three times: a `_pendingEasingName` + `_easingReady` + `resolveEasingName` triple in `numeric.ts`, a near-identical copy in `timeline.ts`, and `morph.ts` riding `numeric`'s. Three copies, no shared contract, nothing surfacing that a name needs awaiting.

### Shape: a small class in `internal/`, not a mixin or a free function

`EasingResolvable` is a **class** (`src/animation/internal/easing-resolvable.ts`). The alternatives were weighed and rejected:

- **Free function** can't hold the four pieces of *state* that the seam needs co-located: the current `.fn`, the pending name, the memoized `_ready` promise, and the one-time `_warned` latch. A function returning a closure-over-state is just a class with worse ergonomics and no `.fn`/`.pending` getters.
- **Mixin / base class** would couple the three consumers' class hierarchies to the resolver and force `morph`'s composition-over-`numeric` to become inheritance. The resolver is *held*, not *extended*—`numeric` and `timeline` each own an `EasingResolvable` field; `morph` inherits the behavior transitively because it composes `NumericAnimation`. Composition keeps the resolver a leaf the boundary gate can reason about.

So: a class, instantiated per animation, owning the seam's whole state.

### Why a class earns its keep — four jobs in one place

The constructor takes `(easing, onResolved?)` and dispatches on type (`easing-resolvable.ts:48-68`):

1. **Identity fallback.** A shared `const identity: TimingFunction = (t) => t` (`:4`) is the value.js-free curve used before a name lands, so a pending read is wrong-but-bounded, never a crash.
2. **Callable path is synchronous and import-free.** `typeof easing === "function"` → `this._fn = easing`, `.ready()` is a no-op, nothing is imported (`:54-56`). This is the value.js-free guarantee made structural: a callable never reaches the dynamic import.
3. **Eager-resolve on a name.** `typeof easing === "string"` → set identity fallback, stash the name, and `void this.ready()` *in the constructor* (`:57-64`). Resolution is kicked off at construction, fire-and-forget, so the named curve lands by the first `.play()` / next frame. This is the primary silent-linear fix (§2).
4. **Memoized `.ready()`.** `ready()` (`:86-102`) guards on `_pendingName === null` (no-op for callable/omitted) and on an existing `_ready` promise, so the `await import("../engine")` + `getTimingFunction` lookup runs at most once even under concurrent `.play()`/`.ready()`. On resolution it sets `_fn`, fires `_onResolved?.(resolved)`, and nulls the pending name.

The `onResolved` callback is the one place the two consumption styles diverge, and the class absorbs the difference:

- **`NumericAnimation` caches by value.** Its `NumericSegment`s capture `this._easing.fn` at build time (`numeric.ts:140`), so a resolved name must *rebuild* the segments. It passes `onResolved = () => { this.segments = this.buildSegments(); }` (`numeric.ts:96-98`). The callback fires on the resolution microtask, by which point `this.segments` already exists.
- **`Timeline` reads `.fn` live.** `applyPipeline` calls `this._easing.fn(raw)` every tick (`timeline.ts:86`), so a resolved name takes effect with no callback at all—it constructs `new EasingResolvable(options?.easing)` with no second argument (`timeline.ts:46`). Applying `.fn` unconditionally is also a no-op for the omitted-easing case (identity), which deleted `timeline`'s former `if (this.easingFn)` guard.

That single callback seam is exactly why a class beats a free function: it lets one resolver serve both a cache-by-value consumer and a read-live consumer without either knowing about the other.

### Proven value.js-free across the 3 call sites

The module imports value.js **nowhere statically**—only `import type { TimingFunction, TimingFunctionNames } from "../constants"` (erased under `verbatimModuleSyntax`) and the dynamic `import("../engine")` inside `ready()` (`:93`). The three consumers' diffs are a **net deletion**: `numeric.ts` drops its `_pendingEasingName`/`_easingReady`/inline `resolveEasingName` and its local `linear` const; `timeline.ts` drops its `easingFn`/`_easingReady`/`resolveEasingName`. `morph.ts` is unchanged at the resolver layer—it inherits via `numeric`. The overfitting audit clears trivially: 3 consumers, and it's de-duplication, so it would clear at 2.

`proof:boundary` (§4) is what *keeps* it free: it bundles a spring-only entry from source and would turn red if `EasingResolvable`—or anything the light engines pull—reintroduced a static value.js edge.

---

## 2. The silent-linear remediation — eager-resolve primary, dev-warn the residual

### The footgun

A stateless consumer who passes `"easeOutCubic"` and never `await .ready()`, then calls `.at()` / `tick()` synchronously, interpolates with the **identity fallback**, not the named curve—silently. vue-tsc passes; the runtime quietly differs. This is the binding-verification class the boundary opened.

### Chosen: two layers, not one

**Primary — eager-resolve-on-construct.** The constructor fires `void this.ready()` the moment a name is seen (`easing-resolvable.ts:64`). The dynamic import is always async, so resolution lands on a later microtask—but that is almost always *before* the first `.play()` or the next animation frame. The wrong-until-ready window collapses from "until someone remembers to await" down to **a same-tick synchronous `.at()` issued in the construction tick itself**.

**Residual — a one-time dev-only `console.warn`.** `warnIfPending(context)` (`:116-126`) fires once per instance when `.fn` is read while a name is still pending. The consumers wire it at their synchronous read sites: `numeric.ts:168` (`"NumericAnimation.at()"`), `timeline.ts:80` (`"Timeline.tick()"`). It makes the residual same-tick window **detectable**: the warning names the easing, says it's running identity, and tells the caller to `await .ready()`.

### The trade-off, recorded

- **Eager-resolve buys** a near-zero default window with no API change—the common path (construct, then play, or construct, then sample on a later frame) is correct with no `.ready()` ceremony. It costs **one extra microtask of engine-import work per named-easing instance** even if the consumer ends up driving by callable—but that import was always going to happen on `.play()`, so eager only moves the *trigger* earlier, never the cost itself. Critically, it does **not** add a static value.js edge: the `import("../engine")` stays dynamic; only its *trigger* moved into the constructor (verified by `proof:boundary` staying green).
- **Dev-warn buys** detectability for the irreducible residual (a synchronous `.at()` in the construction tick) without throwing. The choice to warn-not-throw is principled: a pending easing is a **browser-timing degradation hint**, not a library-internal contract violation. The precepts split these—contract violations throw; browser-API/timing degradations stay befitting-silent-with-rationale. It costs nothing in production because the production esbuild config drops `console` (`vite.config.ts:187-189`, `esbuild.drop: ["console", "debugger"]`), so `warnIfPending`'s body is dead-code-eliminated from `dist`. Genuinely dev-only.

The rejected alternative—**throw on a pending synchronous read**—would have made `"easeOutCubic"` a footgun in the opposite direction: any consumer that legitimately samples once before the microtask resolves would crash, even though the identity fallback is a perfectly bounded answer. Eager-resolve makes the window rare; dev-warn makes the rare case loud; neither breaks a valid call.

---

## 3. `build:lib` — the split, spec'd against the live `vite.config.ts`

### The split

`vite.config.ts` already routes the library build correctly. `mode.mode === "production"` (`:171`) builds `lib.entry = src/animation/index.ts` (`:178`), `formats: ["es"]`, and—decisively—externalizes value.js, parse-that, vue, and prettier via `rolldownOptions.external` (`:184`). glass-ui is **never** in that list because `src/` never imports glass-ui; only `demo/` does. The gh-pages demo build is a *separate* mode (`:219`) that even routes to a separate `outDir: dist/gh-pages/` (`:238`)—the outDir split already existed.

So the library/demo separation is real in the *config*. What was missing was the **script** split. A.W1 adds it (`package.json:32-38`):

```
"build:lib": "vite build --mode production"   // the library-only build
"build":     "npm run build:lib"              // build now means build:lib
"prepare":   "npm run build:lib"              // prepack runs the library build only
```

CI's build step becomes `build:lib` (`ci.yml`, `release.yml`); the demo/gh-pages build is a separate dev-machine arm the release path never touches.

### The deeper fix the design surfaced — the CI break is two-headed

Spec'ing the split against the live config surfaced that the CI break is **not** one bug. It is two, and `build:lib` alone fixes neither cleanly. The release was published locally because a clean runner fails at *two* distinct steps.

**Head 1 — `npm ci` cannot resolve `file:../glass-ui`.** keyframes carried `"@mkbabb/glass-ui": "file:../glass-ui"` in `devDependencies` for the demo. On a clean runner the sibling `../glass-ui` checkout is absent, so `npm ci` itself fails before any build. The fix is to move glass-ui `devDependencies → optionalDependencies` (`package.json:64-66`): `npm ci` *skips* an unresolvable optional dependency on a clean runner instead of erroring. This is **inv β** made manifest—the publishable artefact resolves zero glass-ui; the `file:` seam is demo-dev-only and never on the release path.

The move forced a **lockfile regen** with glass-ui absent. The regenerated `package-lock.json` now records `@popperjs/core` at the root—it was formerly masked by the glass-ui subtree's symlink, a hidden transitive that only the sibling-present graph exposed. The regen is the honest clean-runner graph, verified empirically: clean-runner `npm ci` succeeds.

**Head 2 — `tsc` (whole-project `check`) trips on a demo-only glass-ui type gap.** Even with `npm ci` fixed, the whole-project `check` (`tsc --noEmit`, `src/` + `demo/`) type-checks the demo, which imports `@mkbabb/glass-ui/dock`—a type that doesn't exist on a clean runner where glass-ui is absent. So the type-check leg is *also* clean-runner-red, independent of the build. The fix is `tsconfig.lib.json` (`extends: ./tsconfig.json`, `include: ["src/"]`) + a `check:lib` script (`tsc --noEmit -p tsconfig.lib.json`) that type-checks **only the publishable surface**. CI's check step becomes `check:lib`; the whole-project `check` stays for local demo development.

So the repair is three coordinated edits, not one: `optionalDependencies` (fixes `npm ci`), the lockfile regen (records the glass-ui-absent graph), and `check:lib`/`tsconfig.lib.json` (fixes `tsc`). `build:lib` was always going to work—it externalizes value.js and never imported glass-ui—but the *gate around it* needed both other heads fixed for a clean runner to reach it green.

### Workflow consequences

- `ci.yml` + `release.yml`: steps are now `check:lib → build:lib → test → proof:boundary`.
- `release.yml` adds `permissions: id-token: write` and `npm publish --provenance --access public`—the OIDC token signs an SLSA build-provenance attestation; NPM_TOKEN still authenticates the publish.
- `node.js.yml` is **retired** (`git rm`). Its test job duplicated `ci.yml`; its gh-pages deploy job is structurally red on a clean runner (the demo build needs the unpublished glass-ui sibling). The demo gh-pages deploy is now a dev-machine action, not a CI job.

**Hard gate (met):** a clean-runner `npm ci && npm run check:lib && npm run build:lib && npm test && npm run proof:boundary` is green with `../glass-ui` absent—verified against a full repo copy to `/tmp`. The real CI-break artefact is filed as GitHub issue #1 (replacing the audit's phantom "#177").

---

## 4. `proof:boundary` — the mechanism

`scripts/proof-boundary.mjs` realizes **inv α**: the boundary is *gated*, not asserted. The CHANGELOG sentence "a spring-only bundle contains no value.js code" is replaced by a CI step that proves it by construction.

The mechanism (`proof-boundary.mjs:45-119`):

1. **Write a spring-only entry from SOURCE.** A temp entry `import { SpringProgress } from "src/animation/index.ts"; export default SpringProgress;` (`:46-49`)—the real package barrel, the real module graph, not the pre-built dist.
2. **Bundle with rolldown, value.js + parse-that NON-external.** `external: ["vue", "prettier"]` only (`:53-61`). value.js and parse-that are deliberately *not* externalized, so if any light module reintroduces a static edge, their *source* bundles into the entry chunk where the gate can see it. Tree-shaking is re-run on the real graph.
3. **Count the entry chunk's static module set.** `entry.moduleIds` (`:74`) filtered by `isValueJs` (any module under value.js, `:36-38`) and `isHeavyEngine` (`animation/engine.ts`, `:41`). Assert **0 value.js modules** and **0 static `engine.ts` edge**—the heavy engine may reach the bundle only as a *dynamic* import chunk, never a static input.
4. **Exit 1 on any failure** (`:105-114`), naming the offending module path. Wired into `ci.yml` + `release.yml` as `npm run proof:boundary`.

**The gate bites (verified).** The negative test—inject `import { lerp } from "@mkbabb/value.js"` into the light `spring.ts`—turned the gate RED: it detected `node_modules/@mkbabb/value.js/dist/value.js` as a static edge of the spring-only entry. Reverted → PASS. A gate that cannot fail is not a gate; this one fails on exactly the regression it guards.

---

## 5. WAAPI `linear()` widening — VERDICT: LAND

The investigation: can a spring curve survive the WAAPI delegation path, or is the heavy engine's `useWAAPI` forced to bare `linear` for any non-trivial easing?

### The obstacle

A `TimingFunction` is an opaque `(t) => number` closure. WAAPI exposes exactly **one** easing per animation via `KeyframeEffectOptions.easing`, and it wants a *CSS string*—`linear`, `cubic-bezier(...)`, or a `linear()` stops list. There is no way to recover a CSS string from an arbitrary closure. So historically `toWAAPIOptions` emitted bare `"linear"` and let the keyframe stops carry whatever intent JS interpolation had baked in—which, for a spring, flattens the overshoot/settle on the compositor.

### Why it lands

Two facts make a tag survivable end-to-end:

1. **`springTimingFunction` already has a faithful CSS representation of its own curve.** It samples the *same* analytic solver `springLinearStops` drives (`springTimingFunction.ts:71-90`)—one solver, one `(response, dampingFraction)` surface. So the closure and a `linear()` stops string describe **one** curve. The fix tags the returned closure with `tagCSSEasing(easing, springLinearStops(stopOpts))` (`:107-113`).

2. **The tag survives onto `frames[].timingFunction`.** `getTimingFunction` returns a non-string `timingFunction` **unchanged**—`if (typeof timingFunction !== "string") return timingFunction;` (`utils.ts:116-118`). It does not re-wrap or clone the closure, so the symbol-tag rides straight through frame compilation onto `frames[].timingFunction`. This is the load-bearing fact of the verdict: a closure that arrives tagged *stays* tagged on the compiled frame.

The tag itself is a value.js-free `internal/css-easing.ts`: a `Symbol.for("keyframes.cssEasing")` written by `tagCSSEasing` and read by `getCSSEasing` (`:14-27`). Keeping it in `internal/` lets the LIGHT producer (`springTimingFunction`) and the HEAVY consumer (`waapi.ts`) share the tag with no module coupling.

`waapi.ts` reads it (`waapi.ts:168-170`): eligibility already guarantees a uniform timing function across frames, so `getCSSEasing(animation.frames[0]?.timingFunction ?? animation.options.timingFunction) ?? "linear"` is sufficient—emit the spring's `linear()` string when present, else bare `linear`. An `Animation` eased by `springTimingFunction` now runs its true overshoot/settle on the compositor thread via WAAPI instead of flattening to linear.

### Why LAND, not refute

It widens **real** eligibility for a **real** consumer: a spring-eased `Animation` with WAAPI on. It's Baseline-Newly correct (feature-detect; the rAF spring is the current-path default when WAAPI is ineligible). It has ≥2 consumers on the seam (`springTimingFunction` produces the tag, `waapi.ts` consumes it). It is not a speculative surface. Per §Resolved-design-decision-6 (land-or-refute), it ships.

---

## Disposition

All five design questions resolve to landed reality: `EasingResolvable` is a `internal/` class proven value.js-free across numeric/timeline/morph; the silent-linear window is closed by eager-resolve and made detectable by a dev-only warn; `build:lib` splits the library from the demo and the design surfaced the two-headed CI break (`optionalDependencies` + lockfile regen + `check:lib`); `proof:boundary` is a rolldown build-and-count of a spring-only source entry that bites; WAAPI `linear()` widening lands because the tag survives `getTimingFunction` onto the compiled frame. The dev/impl boundary closes here; the `build:lib` repair rode this wave as the hinge.
