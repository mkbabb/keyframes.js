# Frontier lane — ECOSYSTEM + DISTRIBUTION beyond J.W5 (what makes a library SOTA-as-a-PRODUCT)

**Lane:** ecosystem-distribution (FRONTIER-RESEARCH, tranche-development; seeds a future K
tranche). **Question:** beyond J.W5's publish/README/`proof:published-surface` work, what
would push keyframes.js BEYOND the 2026 state of the art *as a shipped product* — genuinely
novel, on-brand, only-kf-could-do-it-this-way. **Method:** internal evidence from the source
surface + the J audit corpus (`sota-landscape.md`, `J.md §WAVE MAP`, `waves/J.W5.md`) crossed
against the WebSearch-verified June-2026 ecosystem landscape (llms.txt adoption, JSR, the
js-framework-benchmark model, Motion's framework-adapter posture, TypeDoc/API-Extractor).
Every internal claim cites `file:line` or a lane doc; every external claim carries a source
link (§9).

**The lane's discipline (self-skeptical).** "GSAP/Motion has it" is NOT a reason. Most of
this lane is CHORES wearing a frontier hat — and the honest result is that the SINGLE
genuinely frontier idea here is the AGENT-CONSUMABLE published surface (the llms.txt /
proof-as-public-artifact axis), because it is the one ecosystem move that ONLY kf's three
unique axes + its proof culture make *credible*. The framework-adapter extraction is a
qualified K-CANDIDATE with a hard honesty caveat; the public benchmark is a BOOK; JSR is a
J-FOLD-or-KILL; TypeDoc is a J-FOLD chore. The verdicts below are quality-over-advocacy.

---

## §0 What J.W5 ALREADY owns (the floor this lane builds ON — do NOT re-propose)

Read first, so nothing below double-counts (`waves/J.W5.md §Scope`):

- **The honest minor publish** (S5): one `tranche-j` changeset naming the E→I 16-export
  orchestration tier export-by-export; the version cut + `npm publish --provenance` stay
  USER-DOMAIN at J.WZ. *npm provenance is therefore ALREADY in scope* — the release pipeline
  is `check:lib → build:lib → test → proof:boundary → npm publish --provenance`
  (`J.W5.md:376`). **This lane does NOT re-litigate provenance.**
- **README §Beyond CSS completion** (S2): all ~13 primitives taught, every fenced ` ```ts `
  snippet EXECUTED against the built `dist/` via the `proof:published-surface` clause (c)
  runner — "the docs oracle is runnable truth, not prose" (`J.W5.md:257`).
- **`proof:published-surface`** (S1): the three-way oracle — tarball == `files` declaration
  (no `_redirects` leak), every public export ∈ (README-taught ∪ `docs/published-surface.md`
  manifest), AnimationEngine interface ≡ runtime surface (`J.W5.md:191-237`).
- **The doc-rot rewrite** (S3): the three CLAUDE.md files rewritten to the tree.
- **`docs/published-surface.md`** (S1b): the authoritative export roster (tier LIGHT/HEAVY +
  README anchor) — a machine-checked, complete public-API manifest already exists post-J.

**The consequence for THIS lane:** J.W5 delivers a *correct, complete, gated, human-readable*
published surface. The frontier question is everything a SOTA *product* has that a correct
*package* does not: framework adapters, a public reproducible benchmark, an auto-generated
API reference, multi-registry presence, and — the one genuinely novel axis — an
**agent-consumable** surface. The skeptical filter sorts these into frontier vs chore.

---

## §1 Internal ground truth (verified first-hand)

### 1.1 The library is framework-agnostic — but `package.json` lies about it

`grep -rn "from 'vue'" src/` → the ONLY Vue reference in `src/` is `src/env.d.ts:4,17` (a
dev-only `*.vue` SFC module-type shim; NOT a runtime import). The shipped library imports
zero framework code. **Yet `package.json:166-168` declares `"peerDependencies": { "vue":
"^3.5.0" }`** — a framework-agnostic interpolation library forces every `npm i
@mkbabb/keyframes.js` consumer (a vanilla-TS user, a React user, a Svelte user) to satisfy a
Vue peer the library never touches. This is a latent distribution-boundary defect that
**J.W5 does NOT name** — its BP folds are `_redirects` (BP-1), the empty `author` (BP-10),
the dead robots Sitemap (BP-9); the spurious Vue peer is in NONE of them (`J.W5.md:342-351`).
It is exactly the publish-boundary-lies-about-the-surface shape J.W5 exists to kill, one fold
short. (See §3 — this is a clean J.W5 FOLD, not a K candidate.)

### 1.2 The demo does NOT consume the published surface (the dogfood-inversion gap)

`grep -rn "@mkbabb/keyframes" demo/` → ZERO hits. Every demo import is a deep `@src/animation/*`
path: `@src/animation/engine`, `@src/animation/group`, `@src/animation/playback`,
`@src/animation/spring`, `@src/animation/decay`, `@src/animation/animations` (verified across
`demo/app/useRafScene.ts:3`, `demo/spring/useSpringDemo.ts:3`, `demo/sequence/useSequenceDemo.ts`,
etc.). The Vite self-alias (`vite.config.ts:153-156`) points `@mkbabb/keyframes.js` at
`src/animation/index.ts` so that *glass-ui's* bare `import … from "@mkbabb/keyframes.js"`
resolves — but the DEMO itself never writes that import; it writes `@src`.

**The asymmetry:** `proof:dogfood` (inv ζ, `scripts/proof-dogfood.mjs:1-50`) ALREADY proves
"the shop-window runs on its own engine" — the demo carries no hand-rolled rAF a light
surface replaces; it consumes `RAFPlayback`/`SmoothProgress`/`SpringProgress`/`NumericAnimation`/
`decay`. So the demo dogfoods the engine's *behavior* through the source tree, but it does
NOT dogfood the *published package boundary*. The demo imports `@src/animation/engine` (a deep
path that is NOT a public export — the public surface is `loadAnimationEngine()`, not the
`engine.ts` chunk). **The demo could not even be written against the published barrel today**
without changing how it reaches the heavy tier. This is the honest dogfood-inversion finding
(§4).

### 1.3 The "Vue composables" are demo-app machinery, not library adapters

The prompt asks whether the demo's "battle-tested Vue composables" should extract into
`@mkbabb/keyframes-vue`. The honest extraction-boundary read, from the source:

| Composable | What it wires | Library-adapter? |
|---|---|---|
| `useRafScene` (`demo/app/useRafScene.ts`) | owns `RAFPlayback`, the demo's `ScenePlayback` contract, `useSceneVisibilityPause`, `createRafAdapter` | **NO** — coupled to `@components/.../stores` `ScenePlayback`/scene-machine |
| `useAnimationSync` (`.../controls/composables/useAnimationSync.ts`) | rAF-polls a `markRaw` `Animation` into reactive `currentT`/`isPlaying`/`isStarted` | **PARTIAL** — generic pattern, demo-shaped settle heuristics |
| `useAnimationGroupPlayback` (`.../composables/`) | scrub-pause-resume state machine over `AnimationGroup` | **PARTIAL** — generic verb, demo-shaped scrub policy |
| `useDragScrub` (`demo/@/composables/useDragScrub.ts`) | pointer-capture → `project(e)→ratio` → `onScrub`; owns global select-suppression token | **NO** — this is a generic DRAG-gesture seam, but it duplicates the library's own `drag`/`Draggable` orchestration primitive; it is a demo UI seam, not a kf-engine adapter |
| `useSheetSpring`, `useScrollFade`, `useZoomPan`, `useKeyframesEditor`, … | sheet physics, Monaco, timeline | **NO** — demo UI, zero library coupling worth shipping |

**The decisive finding:** there is NO clean set of "library-adapter composables" sitting in
the demo waiting to be lifted. The composables that touch the engine
(`useRafScene`/`useAnimationSync`/`useAnimationGroupPlayback`) are wired to the demo's OWN
`ScenePlayback` contract + `sceneMachine` + `scenePlaybackAdapters` (`stores/`), which are
demo-app concepts (scene suspend/restore across a router), NOT general animation-library
concepts. Extracting them verbatim would ship the demo's scene-orchestration model as a
"Vue adapter" — a leaky, over-fit surface. The genuinely-generic kernel
(`Animation`→reactive-ref polling; the `markRaw` + rAF-sync dance) is ~30 lines and is the
ONLY honest extraction. This reshapes the K-CANDIDATE entirely (§2).

---

## §2 The framework-adapter question — `@mkbabb/keyframes-vue` (and React)

### 2.1 The 2026 ecosystem bar

Motion ships `motion/react` AND `motion/vue` as first-party adapters; Vue's ecosystem ALSO
has `vueuse/motion` (a separate composables package) [Motion for Vue; vueuse/motion]. The bar
the field sets is NOT "thin composable that polls an Animation into a ref" — it is a
**declarative component API** (`<motion :animate=… whileHover=… whileInView=… />`) that feels
native to the framework [Motion for Vue magazine]. A thin `useAnimation(getAnim)` poller is
table-stakes plumbing; the SOTA adapter is a component.

### 2.2 The honest extraction boundary (skeptical)

From §1.3: the demo does NOT contain a battle-tested *library* adapter. It contains a
battle-tested *demo-app* (scene machine + control surface). The "extract the composables"
framing the prompt floats is, on inspection, **false** — the composables are not separable
from the demo's `ScenePlayback`/`sceneMachine` substrate without a rewrite. What CAN be
extracted honestly:

1. **The generic kernel** — `useKfAnimation(getAnimation)` → `{ t, playing, started,
   reversed }` reactive refs via the EXACT `useAnimationSync` settle-and-pause idiom
   (`useAnimationSync.ts:29-100`, including the deadlock-safe "gate on inputs not outputs"
   discipline — a genuinely hard-won correctness property worth shipping). ~40 lines.
2. **A declarative `<Keyframes>` component** that takes a CSS `@keyframes` string (kf's
   UNIQUE axis — round-trippable CSS source of truth) and animates the host element:
   `<Keyframes :css="…" :options="…" v-slot="{ t }">`. THIS is the only on-brand adapter —
   it is the one a Motion/`vueuse-motion` adapter CANNOT write, because no other engine
   parses author CSS `@keyframes` as its source. A `@mkbabb/keyframes-vue` whose headline
   primitive is "declarative CSS-`@keyframes`-driven Vue component" extends kf's axis (1)
   into a framework, rather than me-too-ing Motion's tween-prop component.

### 2.3 The dogfood-inversion (the on-brand justification)

The adapter package earns its keep ONLY if the demo then CONSUMES it: `demo/` imports
`@mkbabb/keyframes-vue`'s `<Keyframes>` / `useKfAnimation` instead of hand-wiring
`useAnimationSync`. THIS closes the §1.2 gap — the storefront runs on the PUBLISHED adapter,
not the source tree. inv ζ (`proof:dogfood`) extends from "demo uses the engine" to "demo
uses the published adapter package" — the boundary-ORACLE precept (`J.md §invariant set`) at
the *adapter* boundary. That is the on-brand test passing: only a CSS-source-of-truth engine
ships a `<Keyframes css="@keyframes …">` component, and only a proof-culture library gates
its own demo on consuming it.

### 2.4 React

React is NOT a current dependency (`grep -c react package.json` → 0; the apparent hits are
`reactive`/`interaction`). A React adapter is pure NET-NEW with no battle-tested code to
extract and no dogfood demo to invert against (the demo is Vue). The honest read: **React is
BOOK, not K** — author the Vue adapter first (where the dogfood loop exists), and let the
React adapter follow ONLY if the Vue one proves the `@mkbabb/keyframes-<fw>` pattern. Shipping
a React adapter with no React demo would be the exact un-dogfooded speculative surface the
proof culture rejects (`proof:dogfood` exists precisely to forbid 1-consumer speculative
surfaces).

### 2.5 Verdict

**K-CANDIDATE (Vue, narrowed) / BOOK (React).** Not a headline — it does not extend a unique
AXIS so much as carry axis (1) into a framework — but it is the largest legitimate ecosystem
move, IF and ONLY IF (a) the headline primitive is the declarative CSS-`@keyframes` component
(on-brand), NOT a tween-prop me-too, and (b) the demo dogfoods the published adapter
(inversion). The "extract the demo composables" framing is REJECTED as researched-false
(§1.3); the real K wave is "author a thin, on-brand `keyframes-vue`, then invert the demo onto
it." **Hard caveat:** a second published package doubles the release/version/CI surface — it
must ride the SAME `proof:published-surface` discipline (its own tarball==declaration, its own
runnable snippets) or it re-opens the exact publish-boundary lie J.W5 closes.

---

## §3 The spurious Vue peer-dependency — a J.W5 FOLD (not a frontier item)

§1.1 found it: `package.json:166-168` declares `vue: ^3.5.0` as a peer of a Vue-free library.
This is NOT frontier — it is a publish-boundary correctness defect of exactly the class J.W5
owns, and it should die in J.W5's BP-band motion (`J.W5.md §S4`, alongside BP-9/BP-10), NOT
wait for a K tranche.

**The disposition (idiomatic, not a workaround):** the Vue peer almost certainly leaked in to
satisfy the demo build or the glass-ui self-alias dance — but the LIBRARY tarball does not
import Vue, so the peer belongs in `devDependencies` (already present: `vue: ^3.5.35`,
`package.json` devDeps) and must be DELETED from `peerDependencies`. IF a future
`@mkbabb/keyframes-vue` adapter ships (§2), THAT package declares the Vue peer — the core
library never should. `proof:published-surface` clause (a) (tarball==declaration) should gain
a sibling assertion: **every declared `peerDependency` is actually imported by `src/`** (a
trivial grep oracle), so a Vue-free library can never again advertise a Vue peer. This is the
gate-ORACLE precept at the dependency-declaration boundary, and it is a ~10-line clause.

**Verdict: J-FOLD (J.W5).** Fold into J.W5's S4 BP-hygiene band + a `proof:published-surface`
peer-dep clause. It is in-scope, tiny, and on the publish boundary J already owns.

---

## §4 The dogfood inversion — demo CONSUMES the published package

§1.2 found the asymmetry: `proof:dogfood` proves the demo runs on the engine's *behavior*
(via `@src`), but the demo never imports `@mkbabb/keyframes.js` (the published barrel); it
imports deep `@src/animation/*` paths that are NOT public exports. So the storefront is
dogfooded at the SOURCE boundary, not the PACKAGE boundary.

**The frontier move:** make the demo import the PUBLISHED public surface
(`@mkbabb/keyframes.js`'s static light exports + `loadAnimationEngine()` for the heavy tier),
NOT the deep `@src/animation/engine` chunk. Then the demo *is* the integration test of the
published surface: if a public export is missing, mis-typed, or wrongly tier-split, the demo
fails to build. This is `proof:published-surface` (the static three-way oracle) made
DYNAMIC — the running storefront exercises the exact surface a `npm i` consumer reaches.

**The honest tension (why this is K, not J):** today the demo reaches the heavy engine via
`@src/animation/engine` (the raw chunk), because reaching it via the public `loadAnimationEngine()`
boundary is genuinely more awkward for a hot demo (an `await` at mount). Flipping the demo
onto the public boundary is a real architectural change to how every scene mounts its engine —
NOT a J.W5 doc-rewrite. It is also the natural co-requisite of §2's adapter: if `<Keyframes>`
ships and the demo consumes it, the demo reaches the engine THROUGH the adapter THROUGH the
public surface, and the inversion completes for free.

**The measure-first gate this would need:** `proof:demo-on-published-surface` — a build/grep
oracle asserting the demo's kf imports are the published barrel ONLY (zero `@src/animation/*`
deep imports outside the `env.d.ts`/test seams), AND a runtime leg that the demo still mounts
every scene's engine. Born-RED today (every demo file imports `@src`).

**Verdict: K-CANDIDATE (rides §2's adapter wave).** The dogfood inversion is the on-brand
*completion* of the boundary-ORACLE precept — "what `npm i` installs is what the demo runs" —
but it is coupled to §2 (the adapter is the natural seam) and is a real architectural change,
so it is a K wave, not a J fold. It is the single most boundary-ORACLE-faithful idea in this
lane after the agent-surface (§6).

---

## §5 The public benchmark — kf vs GSAP/Motion/anime (the proof culture made public)

### 5.1 The model

The prompt names the js-framework-benchmark model: an explicit, reproducible, public harness
(Chrome Driver, throttled CPU à la Lighthouse-mobile, keyed/non-keyed implementations, a
weighted geometric mean, results uploaded per Chrome version)
[krausest/js-framework-benchmark]. The animation-library field has NO equivalent — the
"benchmarks" are vendor micro-claims ("Motion 2.5× faster than GSAP from unknown values",
`sota-landscape.md §2`) and blog parallax-demo comparisons [ICS Media; Motion gsap-vs-motion],
NOT a neutral reproducible harness. There is a genuine gap in the field.

### 5.2 What kf already has

kf has a REAL internal bench substrate (`bench/`: `interpolation.bench.ts`, `parser.bench.ts`,
`playwright.bench.ts` (the LoAF >50ms gate), `compile.bench.ts`, `spring-tick.bench.ts`,
`sync-step.bench.ts`, `computed-real-dom.bench.ts`, `interp-buffer.bench.ts`) and recorded
numbers (`interpFrames` ≈ 996k ops/s; the LoAF gate holds a 200-cell group with zero >50ms
tasks — `sota-landscape.md §5`). The proof culture is the asset: kf MEASURES where competitors
CLAIM.

### 5.3 Why this is a BOOK, not a K wave (skeptical)

The honest objections are decisive:

1. **Cross-library benchmarks are a credibility minefield.** Every vendor's micro-bench is
   adversarially framed; a kf-authored "kf vs GSAP" harness will be read as kf-favorable no
   matter how neutral, because the AUTHOR is the contestant. The js-framework-benchmark is
   credible because krausest is NOT a framework author. kf cannot occupy that neutral seat.
2. **It does not extend a unique AXIS.** A benchmark measures perf; perf is PARITY-with-named-
   reserves (`sota-landscape.md §5`), not a kf differentiator. kf's frontier is
   parsing/color/composition, none of which a throughput benchmark surfaces.
3. **The on-brand test fails.** "Only a CSS-source-of-truth engine could benchmark THIS way"
   is not true — a benchmark harness is engine-agnostic by construction.
4. **The maintenance tax is permanent** (per Chrome version, per competitor release), against
   a one-developer project with npm frozen since 4.1.0.

### 5.4 The narrow on-brand sliver (if anything)

There IS one benchmark only kf could publish honestly: a **correctness** benchmark, not a
throughput one — "does the library interpolate oklch color correctly?" GSAP animates oklch
incorrectly per its own forums (`sota-landscape.md §2`, §7 GSAP oklch thread); Motion/anime
mix in RGB. A public, reproducible *fidelity* harness ("animate `#C462D8 → #E85252`, sample
the midpoint, compare ΔE against the CSS Color 4 reference") would showcase kf's UNIQUE axis
(2) — perceptual color — and is un-spinnable (it measures correctness against a spec, not
speed against a rival). THIS sliver passes the on-brand test where the throughput benchmark
fails it.

**Verdict: BOOK (throughput) / K-CANDIDATE-sliver (a public *color-fidelity* conformance
harness).** The throughput benchmark is a chore-with-a-credibility-trap; record it and move
on. The color-fidelity harness is the only benchmark that extends a unique axis and survives
the on-brand + un-spinnable tests — book it as a candidate K sub-wave, NOT a headline.

---

## §6 The agent-consumable surface — `llms.txt` + proof-as-public-artifact (THE frontier idea)

### 6.1 The 2026 reality

llms.txt (Jeremy Howard / Answer.AI, 2024) is a community convention, ~10% adoption across
300k domains, NO W3C/IETF backing, and — critically — **OpenAI/Google/Anthropic have NOT
committed to reading it for search** [State of llms.txt 2026; SE Ranking via the guides]. So
as an SEO play it is near-worthless. BUT the verified 2026 finding is the inversion: *"the
same file that does almost nothing for ChatGPT search is doing real work in the agentic web …
IDE agents like Cursor, Windsurf, Claude Code, GitHub Copilot, Cline, and Aider look for
/llms.txt and /llms-full.txt when pointed at a documentation site … agents identify which
dependency owns a feature, fetch that library's llms.txt, then pull only relevant linked
pages before writing code"* [State of llms.txt 2026]. llms.txt is the first widely-adopted
**Business-to-Agent (B2A)** standard.

### 6.2 Why this is the ONE genuinely-frontier, only-kf move

The on-brand test: *"only a CSS-source-of-truth, proof-gated engine could do an agent surface
THIS way."* It passes, uniquely, on THREE counts:

1. **kf's docs are already STRUCTURED for agent consumption.** kf's distinguishing artifact
   is not prose — it is the proof corpus: ~120 `proof:*` gates, each with a docstring stating
   the property it asserts and the bite condition (`package.json` scripts; e.g.
   `proof-dogfood.mjs:1-50` is a self-describing capability claim). A `llms.txt` that links an
   agent to the **machine-verified capability manifest** (the J.W5 `docs/published-surface.md`
   roster + the `proof:correctness` gate inventory + the executable README snippets) gives an
   agent something NO competitor can: not "the library claims springs" but "the library PROVES
   springs, here is the gate, here is the runnable snippet that the CI executes." An agent
   wiring kf into a project can fetch a surface where every capability is BACKED by a citable,
   runnable proof. That is kf's proof culture made *agent-legible*.
2. **The round-trippable CSS axis is uniquely agent-friendly.** An agent's most common
   animation task is "take this CSS `@keyframes` and animate this object." kf's axis (1) means
   the agent's input format IS the library's source format — an `llms-full.txt` can hand the
   agent the parse-→-animate-→-serialize round-trip as the canonical recipe, which is
   literally the thing only kf does (`sota-landscape.md §4` verdict 1). Every other library
   requires the agent to TRANSLATE CSS into a bespoke tween syntax; kf does not.
3. **It is anti-bloat by construction.** llms.txt is a curated INDEX (a markdown file of
   links + one-line summaries), the opposite of feature-chasing. It ships kf's EXISTING
   correct surface to a new consumer (agents) at near-zero code cost. KISS-aligned.

### 6.3 The concrete artifact (K shape)

- **`/llms.txt`** — the curated index: the 13 primitives (from `docs/published-surface.md`),
  each with a one-line intent + a link to its README anchor + its `proof:*` gate name.
- **`/llms-full.txt`** — the round-trip recipe inline + the full export roster with runnable
  snippets (the SAME snippets `proof:published-surface` clause (c) already executes — so the
  agent surface is, by construction, the GATE-VERIFIED surface; it cannot drift, because the
  snippets are the ones CI runs).
- **The boundary-ORACLE extension:** `proof:agent-surface` — assert `/llms.txt`'s linked
  exports == `docs/published-surface.md` roster (the agent index can never drift from the
  published surface) AND every `proof:*` gate it cites exists in the `proof:all` roster. This
  is the gate-ORACLE precept at the AGENT boundary: what an agent reads about kf is what kf
  proves. Only a proof-gated library can make this assertion.

### 6.4 The kill-list check

This brushes nothing on the ARCH kill list (no native-timeline-replace, no Worker/Houdini, no
WASM, no Typed-OM, no per-property easing, no bit-packing, no monomorphization). It is a docs
artifact + one gate. Clean.

### 6.5 Verdict

**K-HEADLINE-CANDIDATE.** This is the lane's one genuinely-frontier idea: an agent-consumable
surface where every claim is backed by a runnable, CI-verified proof, anchored on kf's unique
CSS-round-trip axis, gated so the agent index can never lie. It is on-brand (proof culture +
axis 1), anti-bloat (a curated index, not a feature), and only-kf-could-do-it-this-way (no
competitor has a proof corpus to expose). It could anchor a K tranche themed "the
PROOF-AS-PRODUCT distribution" — the published surface, the adapter, the dogfood inversion,
and the agent index all being facets of *the proof culture made externally consumable*.

---

## §7 JSR and TypeDoc — the chores (honest dispositions)

### 7.1 JSR (the JavaScript Registry)

JSR (Deno, March 2024) has ~40k packages by early 2026, native TypeScript-source publishing
(no build step), auto-generated API docs + `.d.ts`, and baked-in provenance via Sigstore;
Hono publishes to both npm and JSR [JSR vs npm 2026; Deno JSR blog]. The TS-native angle fits
kf (a strict-TS library). BUT:

- **npm provenance is ALREADY owned by J.W5/WZ** (`--provenance` in `release.yml`,
  `J.W5.md:376`) — JSR's provenance is not NET-NEW value for kf.
- **JSR's headline feature (publish TS source, auto-transpile) is ANTI-pattern for kf** — kf
  ships a deliberate static/dynamic boundary (16 KB light + 36 KB heavy chunk via
  `loadAnimationEngine()`, `sota-landscape.md §1`) that its OWN build produces. JSR's
  transpile-on-publish would not honor that hand-tuned split; kf would publish its `dist/`
  anyway, losing JSR's main benefit.
- **It is dual-registry maintenance** for a one-dev project, against modest JSR adoption
  outside Deno/Hono.

**Verdict: J-FOLD-or-KILL.** The only honest JSR value is "TS-native consumers find kf on
JSR." If that matters, it is a ~1-line `jsr.json` + a publish step folded into J.WZ's publish
motion (a chore, J-FOLD). If the static/dynamic boundary makes JSR publishing lossy (likely),
**KILL** it with that reason. Recommended: KILL, citing the boundary-loss + the
provenance-already-owned + the dual-maintenance tax. A researched KILL is the result.

### 7.2 TypeDoc / API-reference generation

`@microsoft/api-extractor` is ALREADY a devDependency (`package.json:179`) — kf rolls up the
`dist/keyframes.d.ts` and `ci.yml` verifies 15/15 symbols (`J.W5.md:52-55`). TypeDoc is the
2026 standard for HTML API reference from TS+JSDoc [TypeDoc; PkgPulse TypeDoc guide]. The
frontier framing the prompt floats — "typedoc gated by `proof:published-surface`, interactive
playground links (the demo IS the playground)" — has ONE on-brand sliver: the demo's deep-link
hash state ALREADY exists (`demo/@/components/.../stores/hashSharing.ts`:
`encodeStateToHash`/`decodeStateFromHash`; `useShareState.ts`). So an API-reference page COULD
deep-link each primitive's example into the live demo (`?css=…` round-trip), which no
competitor's API docs do (their docs can't deep-link into a CSS-driven playground because they
have no CSS-source-of-truth). That sliver is mildly on-brand.

BUT: a generated API reference is a CHORE (TypeDoc + a CI step), and J.W5 ALREADY makes the
README the runnable, gated doc of record. An HTML API reference is additive polish, not
frontier. The deep-link-to-playground sliver is the only interesting part and it is small.

**Verdict: J-FOLD (the TypeDoc generation, gated by `proof:published-surface` — a CI chore) /
BOOK (the deep-link-API-reference-into-the-playground sliver — record as a nice-to-have that
rides §6/§4's surface work).** Not frontier; do not headline.

---

## §8 The synthesis — sort by the on-brand + frontier filter

| # | Proposal | Extends axis / closes gap | Frontier? | Verdict |
|---|---|---|---|---|
| §6 | **Agent-consumable surface** (`llms.txt` + proof-as-public-artifact + `proof:agent-surface`) | axis (1) CSS-round-trip + the proof culture, made agent-legible | **YES — only kf has a proof corpus to expose** | **K-HEADLINE-CANDIDATE** |
| §2 | **`@mkbabb/keyframes-vue`** (declarative `<Keyframes css>` component + `useKfAnimation` kernel) | carries axis (1) into a framework; the demo composables are NOT cleanly extractable (researched-false) | partial (carries an axis, doesn't create one) | **K-CANDIDATE (Vue) / BOOK (React)** |
| §4 | **Dogfood inversion** (demo consumes the PUBLISHED barrel, not `@src`) | boundary-ORACLE precept at the package boundary; rides §2 | on-brand completion, not novel | **K-CANDIDATE (rides §2)** |
| §5 | **Public color-FIDELITY conformance harness** (not throughput) | axis (2) perceptual oklab, un-spinnable | narrow sliver | **K-CANDIDATE-sliver** |
| §5 | Public THROUGHPUT benchmark (kf vs GSAP/Motion) | none (perf is parity); credibility trap | no | **BOOK** |
| §3 | **Spurious Vue peer-dep removed** + `proof:published-surface` peer-dep clause | publish-boundary correctness | no (it's a defect) | **J-FOLD (J.W5)** |
| §7 | TypeDoc API reference gated by `proof:published-surface` | docs polish | no | **J-FOLD (chore)** |
| §7 | Deep-link API-reference-into-the-playground | axis (1) (CSS deep-link) | small sliver | **BOOK** |
| §7 | JSR publish | provenance already owned; boundary-loss | no | **KILL** (or trivial J-FOLD) |

**The K-tranche shape this lane seeds:** a "PROOF-AS-PRODUCT distribution" tranche whose
headline is the agent-consumable surface (§6), whose body is the on-brand Vue adapter (§2) +
the dogfood inversion (§4) + the color-fidelity harness (§5-sliver), each a facet of the same
thesis — *kf's proof culture and its three unique axes, made externally consumable by humans,
frameworks, and agents alike.* The chores (§3 peer-dep, §7 TypeDoc) fold into J; JSR and the
throughput benchmark are killed/booked. The honest lane verdict: ONE headline, a real but
qualified adapter wave, and a pile of chores correctly sorted OUT of the frontier.

---

## §9 External sources

[State of llms.txt 2026 (Presenc AI)](https://presenc.ai/research/state-of-llms-txt-2026) ·
[llms.txt 2026 honest guide (Codersera)](https://codersera.com/blog/llms-txt-complete-guide-2026/) ·
[JSR vs npm 2026 (PkgPulse)](https://www.pkgpulse.com/guides/jsr-vs-npm-javascript-package-registries-2026) ·
[Introducing JSR (Deno)](https://deno.com/blog/jsr_open_beta) ·
[Beyond npm: JSR (InfoWorld)](https://www.infoworld.com/article/4124615/beyond-npm-what-you-need-to-know-about-jsr.html) ·
[krausest/js-framework-benchmark](https://github.com/krausest/js-framework-benchmark) ·
[js-framework-benchmark official results](https://krausest.github.io/js-framework-benchmark/) ·
[Comparing JS animation libraries (ICS Media)](https://ics.media/en/entry/14973/) ·
[GSAP vs Motion (motion.dev)](https://motion.dev/docs/gsap-vs-motion) ·
[Introducing Motion for Vue](https://motion.dev/magazine/introducing-motion-for-vue) ·
[vueuse/motion](https://github.com/vueuse/motion) ·
[TypeDoc](https://typedoc.org/) ·
[TypeDoc vs JSDoc vs API Extractor 2026 (PkgPulse)](https://www.pkgpulse.com/guides/typedoc-vs-jsdoc-vs-api-extractor-2026)

## §10 Internal anchors

`waves/J.W5.md` (the publish/docs boundary J owns) · `J.md §WAVE MAP` (J.W5/WZ scope) ·
`audit/sota-landscape.md §1,§2,§4,§5` (the unique axes, the field, the perf reserves) ·
`package.json:166-168` (the spurious Vue peer) · `package.json:179` (api-extractor present) ·
`src/env.d.ts:4,17` (the only Vue reference in src) · `scripts/proof-dogfood.mjs:1-50` (inv ζ,
the dogfood discipline) · `demo/app/useRafScene.ts:3-7` + `demo/.../useAnimationSync.ts:29-100`
+ `demo/@/composables/useDragScrub.ts` (the demo composables — coupled to the demo's
`ScenePlayback`/`sceneMachine`, NOT cleanly extractable) · `vite.config.ts:151-161` (the
self-alias — why the demo writes `@src`, not `@mkbabb/keyframes.js`) ·
`demo/.../stores/hashSharing.ts` + `useShareState.ts` (the deep-link state that already exists).
