# Tranche A — Architecture & Gestalt Audit (for B.W2)

Read-only audit of the 3.0.0 engine for the user's "NO workarounds, NO legacy,
idiomatic gestalt, architectural transpositions" mandate. Grounds B.W2.

## Verdict

A's three `internal/` consolidations (`reduced-motion.ts`, `easing-resolvable.ts`,
`scheduler.ts`) delete real duplication, but the unification is half-finished:
reduced-motion is "one detector, SEVEN hand-written snap bodies," the managed-rAF
lifecycle is copy-pasted three ways (`RAFPlayback` / `SmoothProgress._startLoop` /
`SpringProgress._startLoop`), and the `AnimationGroup` reset/fill/completion tangle
forced `_playReducedMotion` to be a deliberate fork of `reset()`. Layered on: ~16
in-code TODOs (1 CRITICAL/4 HIGH) marking a pervasive "silently default/no-op on
bad input" posture, and two Symbol-on-a-closure side channels (`cssEasing`,
`DEFAULT_RENDERER`) that smuggle metadata the type system can't see.

## Findings

### B1 (BLOCKER) — the AnimationGroup reset/fill/completion tangle
`group.ts:421` (draw resets on completion), `:537-556` `reset()` + TODO(HIGH) `:540`,
`:459-489` `_playReducedMotion` forked to dodge reset's repaint. Three behaviors
entangled around a missing concept — *where the playhead rests after play*:
`reset()` repaints every child to frame 0 (a *visual* op, "to prevent cube cutoff");
`draw()` calls reset on normal completion (so a fadeIn group ends invisible);
`_playReducedMotion` can't reuse reset so it inlines a near-copy. Child
`Animation.reset()` (`engine.ts:841`) is pure state — the group's diverges.
**Transposition:** an explicit **rest-position contract** — `restPosition:
'initial'|'final'|'hold'` derived once from `fillMode` (forwards→final,
backwards/none→initial); `settle()` is pure state teardown (never paints);
completion paints the rest frame per the fill contract. Reduced-motion becomes
"rest=final, paint, settle" — the same path as `fillMode:forwards` completion, not
a fork. Deletes the TODO, deletes `_playReducedMotion`'s special-casing, fixes the
normal-completion-resets-to-initial quirk. THREE findings, ONE gestalt fix.

### H1 (HIGH) — reduced-motion: one detector, seven snap implementations
`playback.ts:68-71`, `engine.ts:762-772`, `group.ts:459-489`, `smooth.ts:87-92`+`:178-183`,
`spring.ts:170-180`+`:365-371`. Only *detection* was unified; the *response* (snap
to terminal, fire completion once, no loop) is hand-written seven times and drifts
(the group one already had a bug). **Transposition:** one `withReducedMotion(detector,
snap, run)` gate every surface calls (`if (respect && detector()) return snap(); return run()`)
+ a `snapSettled(target, emit)` helper. Five copies → five one-line snap closures.

### H2 (HIGH) — managed-rAF lifecycle triplicated
`playback.ts:36-112` (RAFPlayback), `smooth.ts:200-223` (`_startLoop`/`_stopLoop` +
`_rafId`/`_lastFrameT`/`_onFrame`), `spring.ts:385-409` (byte-sibling). RAFPlayback
was meant to be THE shared loop but smooth/spring don't use it. **Transposition:**
generalize RAFPlayback to a driver over a `Tickable` interface (`tickDt(dt): void;
settled: boolean; sample(): T`); smooth/spring/numeric become pure steppers that
delegate loop ownership. Deletes both `_startLoop` copies + per-class rAF state.

### H3 (HIGH) — pervasive "silently default/no-op on invalid input"
`engine.ts:396` (unknown timing→easeInOutCubic), `:412` TODO(CRITICAL) malformed
iterationCount silently no-ops, `:416-417`, `:429-430` invalid duration keeps prev,
+ MED/LOW siblings `:450/:456/:474/:480/:493`, `constants.ts:148`. The codebase
already learned this (layer API throws: "silent no-ops were hiding consumer bugs",
`group.ts:590`) but the option setters didn't. **Transposition:** one
`parseOption(raw, validator, name)` seam + a `strict` policy on `AnimationOptions`;
malformed input throws a typed `AnimationOptionError`; defaulting only for genuine
`undefined`. Retires the whole 9-setter TODO cluster as ONE decision.

### M1 (MED) — getCSSEasing Symbol-on-a-closure side channel
`css-easing.ts:15-30`, `springTimingFunction.ts:106-117`, `waapi.ts:174-176`. Casts
`fn as unknown as Record<symbol,string>`; one producer; the "tag survives wrapping"
invariant is implicit (any wrapping easing transform silently drops it). Parallels
`DEFAULT_RENDERER` (`renderer.ts:18`). **Transposition:** `interface Easing { fn:
TimingFunction; css?: string }` (or branded EasingSpec); WAAPI reads `.css` through
the type system. Same fix retires `DEFAULT_RENDERER` (renderer as a value/class).

### M2 (MED) — WAAPI per-segment linear() multi-stop unguarded
`waapi.ts:169-176` NOTE + `isWAAPIEligible` doesn't check stop count for tagged
easings. A spring across 3+ stops silently renders wrong on the compositor.
**Transposition:** bake the spring into densely-sampled keyframe STOPS (the 64-pt
sampler exists) + emit `easing:"linear"` — then per-segment linear IS the true curve,
no eligibility carve-out; OR reject `frames.length>2` for tagged easings.

### M3 (MED) — EasingResolvable dev-warn depends on esbuild build-config
`easing-resolvable.ts:104-126`. "Dev-only" is coupled to `esbuild.drop:["console"]`,
not to the code — a consumer bundling without that drop ships the warn. Deeper: the
eager-resolve-with-identity-fallback papers over an *async resolver on a sync API*.
**Transposition:** (a) gate on `import.meta.env.DEV` (a code condition bundlers DCE),
not the console-drop side effect; (b) better — close the window: light engines accept
only callable `TimingFunction`s; a separate async factory `await resolveEasing(name)`
returns a callable. No pending state, no identity fallback, no warn, no
`EasingResolvable` class. The seam moves from "every `.at()` checks pending" to "resolve
the name once, up front." (Ties to M1's typed `Easing`.)

### M4 (MED) — `handleId: number | any` + silent event skip
`engine.ts:89` + `group.ts:72` `| any` poisons the rAF-handle type (RAFPlayback got it
right: `ReturnType<typeof requestAnimationFrame> | null`, `playback.ts:41`).
`dispatchAnimationEvent` silent-skips off-DOM (`engine.ts:130-141`, TODO MED).
**Transposition:** propagate the correct handle type; one `canDispatchEvents()`
capability check shared with the reduced-motion SSR gate.

### LOW/INFO
- **L1** `AnimationGroup` hand-rolls its own rAF draw loop (4th copy) — folds into H2.
- **L2** `CSSKeyframesAnimation.from*` triple-dup `this.unflatten=...; transform ??= ...`
  (`engine.ts:886/905/936`, each a MED TODO) → one `resolveTransform()`.
- **L3** `scheduler.ts:21-39` re-feature-detects every call; cache the strategy.
- **L4** `isNumericCarrier` duck-typing (`group.ts:17-26`) → `instanceof ValueUnit` / typed blend strategy.
- **L5** `AnimationGroup.play()` has no `_playingPromise` reentrancy guard (Animation does, `engine.ts:781`) — double play() leaks an rAF loop.

## Top 3 transpositions for B.W2

1. **Rest-position / fill contract** (B1) — dissolves reset/fill/completion; deletes the cube-cutoff TODO + the `_playReducedMotion` fork + the completion-resets-to-initial quirk. Reduced-motion *is* fillMode=forwards completion.
2. **One managed-rAF driver + one reduced-motion gate** (H1+H2+L1) — `Tickable` driver owns every loop; `withReducedMotion` wraps every play; seven snap bodies → five one-liners.
3. **Typed easing value + explicit option validation** (M1+M3+H3) — `interface Easing {fn, css?}` replaces both Symbol side channels; `await resolveEasing(name)` replaces the sync-API-async-resolver lie; one `strict` `parseOption` throws on malformed input, retiring the CRITICAL/HIGH setter TODO cluster.
