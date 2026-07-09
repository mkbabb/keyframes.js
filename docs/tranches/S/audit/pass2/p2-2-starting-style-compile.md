# p2-2-starting-style-compile — the S.F3 @starting-style / allow-discrete hand-compile probe

**Probe:** Pass-2 P2-2 (C-22; sf-D4) · Tranche S DEVELOPMENT · 2026-07-02
**Verdict: adjusts-spec** — the entry emitter is REAL (a hand-compiled artifact drove a
`display: none → block` entry AND a display-held exit natively in Chromium 149; the FAILURE
branch is dead for the two-endpoint class), and `compile/entry.ts` is CONFIRMED as the home —
but with four adjustments: the emitter projects from the DECLARED ENDPOINTS (a `format.ts`-
substrate sibling), NOT from the `compileToCSS` artifact (the charter's "use compileToCSS
output as the base" post-transform reading is REFUTED by a pre-existing mixed-track densify
bug); TWO pre-existing compile-surface bugs discovered live become named pre-req waves; the
`perceptual-oklab` refusal INVERTS on the transition surface (native oklab, no densify); and
`@starting-style` fires the entry on born-open elements (a documented platform semantic).

---

## 1. The question + the spec's assumption

**SPEC-v2.md §6.2 P2-2** (`docs/tranches/S/audit/pass1/SPEC-v2.md:1313-1320`): *"Q9-shape:
hand-compile ONE kf entrance effect to `@starting-style` + `transition-behavior:
allow-discrete` CSS; drive a `display:none → block` entry natively in live Chromium … validate
the `compile/entry.ts` sibling home over `format.ts`; draft the entry-refusal taxonomy.
SUCCESS: the native entry runs the compiled values; refusals drafted → F3's emitter wave is
authored. FAILURE: the transition grammar cannot express the compiled shape → F3 stays
DEVELOP-only permanently."*

**S.F3's assumption** (`SPEC-v2.md:890-898`): the emitter is a *"transition-grammar output
distinct from the `@keyframes` substrate; home RULED = new `compile/entry.ts` sibling over
`format.ts`, refusals on its own `CompiledCSS.refusals` channel"* — gate (born-SPECIFIED,
post-probe): emitted CSS drives a `display:none` entry natively in a live Chromium; refusals
enumerated. Deps: B3, P2-2.

The house pattern followed: p09-vt-emitter (`docs/tranches/S/audit/pass1/prototypes/
p09-vt-emitter.md`) — role-spec input, per-surface emission, the four-refusals extension,
probe-script-as-gate-oracle.

## 2. What I actually did

All prototype artifacts are throwaway, in the scratchpad
(`…/scratchpad/p2-2/{sketch.mjs, entry-emitted.css, entry-live.html, live.mjs, live-run.log}`).
**Zero repo edits** — this report is the only file written to the main tree
(`git status --porcelain` on the tree before writing it: clean; branch `tranche-s-dev`).

1. **Read the actual compile surface**: `src/animation/compile/backward.ts` (the CC-3 refusal
   channel :82-142, `compileChild` :186-342, `compileToCSS` :379-428), `format.ts`
   (`serializeEasing` :43, `declaredKeyframeBody`/`declaredKeyframeBodyFor` :86/:223,
   `keyframesBlock` :240, `CSSKeyframesToStrings` :133, `animationShorthand` :373),
   `backward-color.ts` (whole — `densifyKey`/`densifyColorBlock`), plus SPEC-v2 §3 S.F3 + §6.2
   and the p09 report.

2. **Node sketch against `dist/keyframes.js`** (`node …/p2-2/sketch.mjs` → **exit 0**; repo
   build current). Built a representative entry/exit pair — a toast: entry 350ms spring
   `springTimingFunction({response:0.4, dampingFraction:0.7})` over
   `{opacity, transform: translateY/scale, background-color: oklab(…)}`; exit 250ms
   `easeOutCubic`, asymmetric on purpose. Ran the EXISTING `compileToCSS([enter, exit])` as
   the base (`eligible: true`, 0 refusals), then attempted BOTH projections:
   - **Attempt A — post-transform over the artifact (p09's VT shape): REFUTED.** The compiled
     `@keyframes a0` came out **color-only** — 16 densified `oklab()` stops with `opacity` and
     `transform` **absent** (the mixed-track densify bug, F5 below), and a 16-stop block has no
     two-endpoint reading. The `a1` shorthand carried easing **`ease-out-cubic`** — not a CSS
     `<easing-function>` (F6).
   - **Attempt B — declared-endpoint projection (the `format.ts` substrate): WORKS.** First/last
     stop bodies via `CSSKeyframesToStrings` (=== `declaredKeyframeBodyFor` per stop, the ONE
     declared-template authority), easing via `Easing.css` verbatim (spring `linear()`) + a
     CSS-twin table for registry names (`easeOutCubic → cubic-bezier(0.33, 1, 0.68, 1)`).
     Emitted the three-block artifact (`entry-emitted.css`): base (closed) rule = exit's last
     frame + `display: none` + the EXIT transition list; `.open` rule = enter's last frame +
     `display: block` + the ENTRY list (each list = per-prop `duration easing` +
     `display <dur> allow-discrete` + `overlay <dur> allow-discrete`); `@starting-style
     { .toast.open { enter's FIRST frame } }`. (Transitions read the AFTER-change style's
     `transition-*`, so the closed rule's list governs the exit and `.open`'s the entry — the
     asymmetric-timing expressibility.)

3. **Live Chromium probe** (`node …/p2-2/live.mjs` → **exit 0**, Chrome **149.0.7827.201**
   headless via glass-ui's playwright-core, per the charter's createRequire recipe; full
   structured JSON in `live-run.log`). Seven scenarios, all structural/scrub-based
   (`getAnimations()` + `pause()` + `currentTime =` — zero frame-race assertions, the CI
   device-independence posture):
   - **S1 entry RUNS**: `.open` added on the `display:none` toast → THREE `CSSTransition`s
     (`opacity`, `transform`, `background-color`), duration 350, easing the emitted
     `linear(0 0%, 0.30836 4%, 0.72933 …)` verbatim. Scrub `currentTime = 0` → computed
     `opacity 0 / scale(0.96) / oklab(0.45 -0.03 -0.2)` — **the `@starting-style` values ARE
     the before-change style**. Scrub 21ms (6% raw) → `opacity 0.518845` — EXACTLY the
     `linear()` stop-lerp `(0.30836+0.72933)/2` (curve fidelity to 6 decimals). Scrub 175ms →
     settled ≈ 1 (the spring plateau). `finish()` → final `opacity 1, display block`;
     `transitionstart`/`transitionend` fired per property.
   - **S2 control — WITHOUT `@starting-style`**: same artifact minus the block → `.open` add
     produces **zero transitions**, computed opacity snaps to 1. `@starting-style` is
     load-bearing, not decorative.
   - **S3 exit HOLDS through `display:none`**: born-open toast (entry settled first — see F7),
     `.open` removed → FOUR transitions (the 3 props at 250ms exit easing + **`display` 250ms**).
     Scrub 125ms → **computed `display: "block"` (HELD)** while `opacity 0.127798` /
     bg mid-`oklab(…)` lerp; `finish()` → **`display: "none"`**. The allow-discrete hold is
     real and ends exactly at transition end.
   - **S4 control — WITHOUT `allow-discrete`** (display/overlay stripped from the lists):
     `.open` removed → **zero transitions**, computed `display: "none"` immediately (the
     element vanishes; the other transitions die with it). allow-discrete is load-bearing.
   - **S5 easing validity**: `transition: opacity 250ms ease-out-cubic` → computed
     `transition-duration: 0s` (the WHOLE declaration dropped); the bezier twin parses
     (0.25s). `animation: 250ms ease-out-cubic 1 normal forwards a1` (the artifact
     `compileToCSS` emits today) → computed `animation-name: none` — **the browser drops the
     compiled rule entirely** (F6).
   - **S6 color space**: a `background-color` transition between `oklab()` literals scrubbed
     to 50% → computed **`oklab(0.55 0.06 -0.075)`** — byte-equal to the static channel-midpoint
     probe element. Legacy-hex endpoints → `rgb(128, 0, 128)` (sRGB). **CSS Color 4's
     non-legacy default interpolation IS oklab: emitting endpoints as `oklab()` literals gives
     kf's default color space natively — no densify, no ΔE proof, no intermediate stops** (F4).
   - **S7 popover/overlay (top layer)**: the same pattern on `[popover]` via `:popover-open` —
     `showPopover()` entry ran from the `@starting-style` state (scrub-0 opacity 0);
     `hidePopover()` exit → FOUR transitions **including `overlay`**; scrub 150ms → computed
     `display: "block"` AND **`overlay: "auto"`** (held in the top layer); finish →
     `display none / overlay none`. The `overlay` transition materializes ONLY for top-layer
     elements (S1/S3 showed no overlay transition — the emitted entry is inert-but-harmless
     elsewhere), so emitting it unconditionally is correct.

## 3. Findings (file:line evidence)

**F1 — The emitter is a DECLARED-ENDPOINT projection, not an artifact post-transform.** The
substrate it consumes is exactly `format.ts`: `declaredKeyframeBodyFor` (:223) for the first
and last stop bodies, `serializeEasing` (:43) + a CSS-twin table for the per-state easing, and
the `CompileRefusal` channel shape from `backward.ts:89-142`. It does NOT consume
`keyframesBlock`/`animationShorthand`/the `compileToCSS` walker — and it CANNOT be a string
transform over `compileToCSS` output (attempt A): the densified mixed-track artifact is
color-only and 16-stop (F5), and the shorthand easing can be browser-invalid (F6). This
CONFIRMS `compile/entry.ts` as a `compileToCSS` SIBLING over the shared `format.ts` substrate
(the S.F3 ruling) while ADJUSTING the P2-2 charter's "compileToCSS output as the base" reading.

**F2 — The three-rule shape is the whole grammar, and per-state timing is expressible.**
Base(closed) rule = exit endpoint + `display:none` + exit transition list; open rule = enter
endpoint + `display:block` + enter list; `@starting-style` on the open selector = enter's
first frame. CSS transitions read the after-change style's `transition-*`, so asymmetric
entry/exit durations+easings ride the two lists (proven live: 350ms spring entry / 250ms
bezier exit, S1+S3). `display <dur> allow-discrete` + `overlay <dur> allow-discrete` ride BOTH
lists; they are EXIT-load-bearing (S3/S4/S7 — on entry, `none → block` flips at start and
creates no transition, S1).

**F3 — `linear()` springs ride transitions verbatim.** The emitted spring
`linear()` (`springTimingFunction`, the same `Easing.css` twin `compileToCSS` uses) drove all
three entry transitions; `effect.getTiming().easing` round-tripped the string, and the
scrubbed value matched the stop-lerp to 6 decimals (S1 at 21ms → 0.518845). The kf curve
IS the native curve.

**F4 — The `perceptual-oklab` refusal INVERTS on this surface.** `@keyframes` interpolates a
color stop pair in sRGB (hence CC-2's densify + ΔE-ε refusal). Transitions interpolate
non-legacy `<color>` pairs in **Oklab by default** (CSS Color 4; proven byte-exact in S6). kf's
oklab lerp IS a per-channel oklab lerp — so the entry emitter canonicalizes color endpoints to
`oklab()` literals and gets kf's default space natively: no densify, no stop budget, no ΔE
proof. The refusal narrows to the NON-default spaces: `colorSpace: "oklch"` or a non-default
`hueMethod` (transitions expose no interpolation-space control) → `entry-color-space` REFUSE.

**F5 — Pre-existing bug (observe-only, discovered live): the mixed-track densify DROPS every
non-color property.** `compileChild` swaps the WHOLE block for the densified one —
`backward.ts:289-293`: `const block = staticBlock ?? (densify && "block" in densify ?
densify.block : keyframesBlock(animation, name))` — and `densifyColorBlock`
(`backward-color.ts:255-330`) builds its block from ONLY the color declarations (`byPct`
accumulates `${cssProp}: ${css};` for color keys alone). A track mixing `opacity + transform +
background-color` therefore compiles (`eligible: true`, zero refusals) to a `@keyframes` that
animates ONLY the color — the sketch's `a0` had 16 stops with `opacity`/`transform` ABSENT.
This contradicts `format.ts:212-222`'s own design comment (the `bodyByStop` override exists
precisely so "every other key still rides the verbatim declared projection" — `keyframesBlock`
:240-266 supports it; `compileChild` doesn't use it). Replay-inequality on the SHIPPED
`@keyframes` surface, independent of F3.

**F6 — Pre-existing bug (observe-only, proven live): `serializeEasing` emits browser-invalid
easing names → DEAD compiled artifacts.** `format.ts:43-58` returns
`camelCaseToHyphen(registryName)` for any value.js registry easing — `easeOutCubic` →
`"ease-out-cubic"`, which is NOT a CSS `<easing-function>`. S5: the browser drops the whole
declaration — `animation: 250ms ease-out-cubic …` computes to `animation-name: none`; on a
transition it kills the ENTIRE `transition` list (including the allow-discrete entries — a
broken exit would eat the element instantly). Only the accidental subset
{`linear`, `ease`, `easeIn`, `easeOut`, `easeInOut`, `stepStart`, `stepEnd`} hyphenates to
valid CSS. kf's own parser re-reads `ease-out-cubic` happily (its registry name) — which is
why the round-trip gates never saw it: the artifact round-trips through KF but not through the
BROWSER. The moat-law fix (registry name → its bezier/`linear()` CSS twin, or throw) belongs
BEFORE or INSIDE the F3 wave — the entry emitter cannot ship on today's `serializeEasing`.

**F7 — `@starting-style` fires the entry on BORN-open elements.** An element matching the open
selector at first render takes its before-change style FROM `@starting-style` — so it
animates in on page load (S3's preamble observed `background-color/opacity/transform`
transitions running on the born-open toast before anything touched it). Platform semantics,
not a bug — but a REAL consumer-facing behavior (an SSR'd open dialog animates on load) the
emitter's docs + the demo must state; the escape hatch is not matching the open selector at
initial render (or a documented `.kf-no-initial` guard). Also recorded: entry `display`
(`none → block`) produces NO CSSTransition (flips at start, S1) — gate assertions must not
expect one.

**F8 — Refusal taxonomy (drafted — the probe's success criterion).** Extends
`CompileRefusalReason` (`backward.ts:82-86`) on the entry emitter's OWN refusals channel
(`CompiledEntryCSS.refusals` — the S.F3 ruling; the v1 dangling pointer stays dead).
*Inherited, still apply:* `custom-renderer` (transform closures; the easing channel now via
the F6 twin table — no CSS twin → refuse), `weighted-blend` (a weighted/static-weight cohort
child), `computed-unit-drift` (empty declared value; `var()`/`calc()`/`vh` endpoints otherwise
ride VERBATIM — transitions resolve them natively, same as `@keyframes`).
*Entry-specific, NEW:*
- **`entry-multi-keyframe`** — >2 declared template stops. A transition is a two-endpoint
  grammar; intermediate stops have NO twin (collapsing them would silently drop authored
  motion). The probe's `wiggle` (0/50/100%) compiles fine to `@keyframes` — the entry emitter
  must refuse it.
- **`entry-iteration`** — `iterationCount !== 1` or `direction` alternate/alternate-reverse
  (transitions run once, forward; `Infinity` doubly so). Plain `reverse` is absorbable by an
  endpoint swap — an emitter branch, not a refusal. `fillMode` is ABSORBED entirely (the base
  and open rules ARE the two rest states).
- **`entry-composition`** — a child whose composition is `add`/`accumulate`. `compileToCSS`
  emits `animation-composition` (`format.ts:397-403`); the transition grammar has NO
  `transition-composition` — always replace. Refuse, never silently flatten.
- **`entry-scroll-grammar`** — `scrollOptions` present (`backward.ts:337,354-365`):
  a state-change-driven transition has no `animation-timeline`/`animation-range` twin (same
  shape as p09's `vt-scroll-grammar`).
- **`entry-color-space`** — `colorSpace: "oklch"` or non-default `hueMethod` on a changing
  color track (F4): transitions interpolate non-legacy colors in Oklab with no space control.
  The kf DEFAULT (oklab) ships natively via `oklab()` endpoint canonicalization.
- **`entry-easing-twin`** — an easing with no faithful CSS twin (subsumes F6 for this
  surface; a `linear()` densify of the kf curve is the universal remedy the emitter may apply
  before refusing — `springTimingFunction` already proves the mechanism).

## 4. VERDICT: **adjusts-spec**

**SUCCESS branch taken:** the native entry ran the compiled values (S1: the `@starting-style`
state was the observed t=0 style; the spring `linear()` drove the transitions verbatim), the
exit held through `display:none` and flipped at transition end (S3/S7 with `overlay` in the
top layer), both controls isolated the load-bearing constructs (S2/S4), and the refusal
taxonomy is drafted (F8). F3's emitter wave is authorable. The FAILURE branch ("the transition
grammar cannot express the compiled shape") is dead for the two-endpoint class and lives on
ONLY as the `entry-multi-keyframe`/`entry-iteration`/`entry-composition` refusal rows — which
is the honest-refusal design working as intended.

**The exact adjustments to S.F3's authored wave:**

1. **Substrate ruling (adjusts the charter's base assumption).** `compile/entry.ts` CONFIRMED
   as the home — but as a `format.ts`-substrate SIBLING (declared endpoints via
   `declaredKeyframeBodyFor`, easing via the twin-fixed `serializeEasing`), NOT a projection
   over `compileToCSS` output. Unlike p09's VT emitter (a selector re-target of the SAME
   blocks), the entry emitter shares the substrate, not the artifact.
2. **Two pre-req fix waves enter the S.F/S.B ledger (new — discovered by this probe):**
   the F6 `serializeEasing` CSS-twin fix (the entry emitter is unshippable without it, and the
   EXISTING `@keyframes` artifact is browser-dead for most registry easings today) and the F5
   mixed-track densify body-drop fix (`compileChild` must thread `bodyByStop` per
   `format.ts`'s own design instead of whole-block swap). Both are `@keyframes`-surface
   correctness bugs independent of F3; each needs a born-RED gate (F6: a browser-parse
   assertion on the emitted easing — kf-parser round-trip provably cannot catch it; F5: a
   mixed `opacity+color` compile artifact must contain both properties).
3. **The refusal taxonomy is F8's list** (3 inherited + 6 entry-specific), with
   `perceptual-oklab` explicitly INVERTED to `entry-color-space` (native-oklab is a marketing
   FEATURE of this surface: kf's perceptual default with zero emitted stops).
4. **Doc/gate semantics:** born-open elements animate in (F7 — document + demo-state); entry
   `display` produces no CSSTransition (gate assertions target the exit hold); `overlay`
   emits unconditionally (top-layer-only materialization proven harmless elsewhere).

### API shape (the wave's contract)

```ts
// HEAVY — compile/entry.ts (loadAnimationEngine + ./engine mirror), compileToCSS's sibling
export type EntryRefusalReason =
    | CompileRefusalReason // custom-renderer | weighted-blend | computed-unit-drift (perceptual-oklab unused here)
    | "entry-multi-keyframe" | "entry-iteration" | "entry-composition"
    | "entry-scroll-grammar" | "entry-color-space" | "entry-easing-twin";
export interface EntryRoleSpec<V extends Vars> {
    enter?: KeyframesAnimation<V>;          // 2-stop; first frame → @starting-style
    exit?: KeyframesAnimation<V>;           // 2-stop; last frame → the closed rule (default: enter reversed)
}
export interface EntryCompileOptions {
    openSelector?: string;                   // ".open" (default) | "[data-open]" | ":popover-open" | "[open]"
    display?: string;                        // the open display value (default "block")
    overlay?: boolean;                       // default true — top-layer-only materialization, inert elsewhere
    printWidth?: number;
}
export interface CompiledEntryCSS {
    css: string;                             // base rule + open rule + @starting-style block per name
    eligible: boolean;
    refusals: Array<CompileRefusal & { reason: EntryRefusalReason }>;
}
export function compileToEntry<V extends Vars>(
    spec: Record<string, EntryRoleSpec<V>>,  // keyed by element selector
    opts?: EntryCompileOptions,
): Promise<CompiledEntryCSS>;
```

### Wave decomposition (for S.F sizing)

- **EN-a (XS, pre-req — F6).** `serializeEasing` CSS-twin table: registry name → its
  `cubic-bezier()`/`linear()` twin (the Penner set has closed-form beziers; the universal
  fallback is a `linear()` densify of the callable), throw preserved for twinless closures.
  Fixes the SHIPPED `@keyframes` surface too. Born-RED gate clause: browser-actuated parse of
  an emitted `easeOutCubic` artifact (computed `animation-name !== none`). ~3 files
  (`format.ts`, test, gate).
- **EN-b (S, pre-req — F5).** Thread the densify through `keyframesBlock`'s `bodyByStop`
  (merge color stops WITH the declared non-color declarations) instead of the whole-block swap
  at `backward.ts:289-293`. Born-RED gate: mixed `opacity+color` artifact contains both
  properties. ~3-4 files (`backward.ts`/`backward-color.ts`, test, gate row).
- **EN-c (M — the anchor).** `compile/entry.ts` (~250-300L): role-spec walk → per-role
  endpoint projection (first/last `declaredKeyframeBodyFor`), the two transition lists +
  `display`/`overlay` allow-discrete entries, the `@starting-style` block, the open-selector
  strategy, `oklab()` color canonicalization (F4), the F8 refusals. Surface wiring:
  `load-engine.ts`, `engine/public.ts`, `docs/published-surface.md` manifest row, README.
  **Born-RED gate `proof:entry-roundtrip`** (browser-actuating, library-correctness tier):
  this probe's `live.mjs` IS the oracle skeleton — S1 (entry transitions exist with the
  emitted duration/`linear()`; scrub-0 equals the `@starting-style` endpoint), S2/S4 control
  clauses, S3 (mid-exit `display` held `block`; post-finish `none`), S7 (top-layer `overlay`
  hold). Structural assertions only — scrub-based, zero frame/ms races (the Linux-runner
  lesson). ~12 files.
- **EN-d (S).** Demo (dialog/popover entry-exit pane riding the compiled artifact — the
  natural S.F6 narrative twin) + README claims → `proof:readme-runs`. ~2-3 files.

## 5. Real-wave cost

**EN-a ~3 files · EN-b ~3-4 files · EN-c ~12 files (the anchor; mirrors p09's measured VT-c
shape: 1 new module + 2 test files + 1 proof script + 5-6 wiring/doc edits) · EN-d ~2-3
files.** Total ≈ 20-22 files across four small-to-medium waves; risk low-medium — the two
genuinely new behaviors (endpoint projection, refusal detection) were both exercised by this
probe against the UNMODIFIED dist, and the browser accepted the hand-compiled artifact
verbatim. Main risks: (a) the EN-a/EN-b fixes perturb `proof:compile-replay`/
`proof:compile-deterministic` fixtures (they change existing emit — the gates must be
co-edited per T7); (b) `transition-behavior` support skew (Chromium 117+/Safari 26 partial/FF
behind flag) — same honest-narrative posture as S.F6's resolver marketing, and the artifact
degrades to snap-entry (no animation, correct end state) where unsupported — degrade-honest by
construction.

**Probe artifacts (throwaway):** `…/scratchpad/p2-2/sketch.mjs` (exit 0),
`entry-emitted.css`, `entry-live.html`, `live.mjs` (exit 0, Chrome 149.0.7827.201),
`live-run.log` (the seven scenarios' structured JSON, verbatim).
