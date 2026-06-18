# Tranche N — PROGRESS (the board + the N open-deferrals chronic ledger)

**Branch:** `tranche-j-dev` (N's development phase rides the current tip; kf `4.2.0` in
tree; glass-ui `~4.0.0` consumed published — the ladder, refract, specular, and
motion-core `startViewTransition` are sufficient for N, no glass-ui upgrade required).
**Type:** TRANCHE N — **DEVELOPMENT PHASE.** This board records the wave plan + the N
open-deferrals ledger. §1 carries each wave's status (DEVELOPED with born-RED gate named;
impl opens on explicit authorization — exactly the L.W0 dev→impl boundary); the
§"Open deferrals" ledger is the N chronic-closure parse substrate at N.WZ.
**Dev-phase date:** 2026-06-17 — the 3-lane research triumvirate completed
(`audit/research-visual-motion.md`, `audit/research-technical-feasibility.md`,
`audit/research-glass-vt-modernweb.md`); the core-model synthesis authored
(`audit/design-synthesis.md`); the charter (`N.md`) and this board written; all nine
waves DEVELOPED; born-RED gates named and inv-M-observable-truth applied throughout.
**Version in tree:** `4.2.0` (the J close cut). N's version cut is USER-DOMAIN.

This board is the spine of the N development phase: §0 (why N exists — the Stage
scene-switcher premise, the DK64 reference distilled), §1 (the wave board with each wave
DEVELOPED + its headline born-RED gate + its REAL observable), §2 (the deferred-fold
note), and §"Open deferrals" (the N chronic substrate — empty at N.W0, populated at N.WZ
with any born items).

Companion documents:

- **`N.md`** — THE binding charter (provenance; the premise; the seven locked decisions;
  the invariant set; the motion choreography; the component architecture; the bands + full
  wave map TABLE; the constellation/inv-16 note; the precept reckoning ⚠N1–⚠N8).
- **`audit/design-synthesis.md`** — the locked design direction (the authority for all
  seven decisions, the component tree, the wave skeleton, the top risks). READ THIS FIRST
  before authoring any wave spec.
- **`audit/research-visual-motion.md`**, **`audit/research-technical-feasibility.md`**,
  **`audit/research-glass-vt-modernweb.md`** — the three research briefs that fed the
  synthesis. The synthesis supersedes them on any conflict.

---

## §0 — THE HEADLINE (why Tranche N exists)

Tranche M answers the gate-apparatus consolidation, the round-trip correctness frontier,
the constellation consume, the performance honest-measurement, and the chronic terminal
belt. While M is being chartered, the owner initiates N: a **theatrical DK64-style
downlight Stage scene-switcher** for the demo — the library's finest continuous-motion
showcase. The DK64 barrel selector (dark void, trapezoidal downlight cone, hot-white
floor pool, ONE protagonist lit full-scale, shadowed neighbours) is the reference
distilled into our idiom: liquid glass, Instrument Serif, no pixel-art, no DK gradient,
reads in both themes. N is a **Band A→B→WZ single arc**: shell + ring + arrows (Band A),
previews + live-scene idles + commit handoff + a11y (Band B), then production close.

The design is locked in `audit/design-synthesis.md`. The seven decisions are
non-negotiable. The research briefs confirm feasibility. N.W0 is now.

---

## §1 — THE WAVE BOARD (DEVELOPED statuses + headline gates + the REAL observable)

**Gate-first / born-RED discipline (inv-M-observable-truth, load-bearing for N as it is
for M).** Every wave authors its gate over the REAL breach FIRST, witnessed born-RED on
today's tree. A gate that tests a proxy is not a gate. The born-RED gate SOURCE is
written in the impl phase, never here.

Status legend: **DEVELOPED** = the wave plan is authored this dev phase, born-RED gate
named; impl opens on explicit authorization.

> **GATE-NAME BINDING (adversarial-audit reconciliation, 2026-06-17).** The binding
> `package.json` gate KEYS are the wave-file names: `proof:n-stage-shell` (N.W1),
> `proof:n-carousel-ring` + `proof:n-stage-boundary` (N.W2 — the latter NEW, walks the
> bundled *demo* import graph; the library-only `proof:boundary` does NOT cover `demo/`),
> `proof:n-arrows` (N.W3), `proof:stage-previews-live` + `proof:stage-preview-boundary`
> (N.W4), `proof:stage-scene-idles` (N.W5), `proof:stage-hover-brighten` +
> `proof:stage-commit-path` (N.W6), `proof:stage-a11y` + `proof:stage-prm` +
> `proof:stage-perf-budget` (N.W7), `proof:stage-supersedes-dropdown` (N.WZ). The §1
> "Headline born-RED gate(s)" column below names the CLAUSE-level observables inside those
> gates (`proof:no-keepalive`, `proof:ring-spin`, `proof:arrow-hittarget`, …) for clarity;
> they are clauses, not separate keys — EXCEPT the two cross-cutting invariant gates
> `proof:no-keepalive` and `proof:no-raw-raf`, which are promised standalone in N.md
> (⚠N2/⚠N7) and MUST be authored as their own `package.json` keys with a RUNTIME observable
> (a KeepAlive vnode present in the live tree / a `requestAnimationFrame` call reached
> outside `RAFPlayback` at runtime) — a source-shape scan alone is the proxy the discipline
> forbids. Their owning wave is N.W1 (no-keepalive, alongside the shell) and N.W2
> (no-raw-raf, alongside the first engine loop); both re-run in N.W5/N.W6's trees.

| Wave | Band | Title | Status | Headline born-RED gate(s) | The REAL observable (inv-M-observable-truth) | DAG |
|---|---|---|---|---|---|---|
| **N.W0** | — | Design synthesis + research fold + prototype spec (DEV, now) | **DEVELOPED** (now) | **`proof:audit-artifacts-N`** (NEW) — the on-disk artifact set (charter + board + 3 briefs + synthesis) witness | the actual artifacts on disk, re-runnable; born-RED if any artifact is absent or the dev→impl boundary is breached (inv-16 — no src/demo written at W0) | **LEADS** — the charter + board are the impl-phase substrate |
| **N.W1** | A | The Stage shell — Teleport/Popover overlay + downlight (CSS cone+pool, `@property --stage-light`, 15° plane) + the liquid-glass entry/exit VT | **DEVELOPED** | **`proof:no-keepalive`** (NEW) — born-RED if KeepAlive appears in the stage or scene-host subtree (the B.W3 footgun — the REAL consequence, not a class-toggle); **`proof:stage-opens`** (NEW) — born-RED if clicking the dock Select does NOT produce a top-layer overlay with a computed cone element | clicking the dock Select opens a top-layer stage rendering the CSS cone+pool; the stage closes; the keyed Suspense host is BARE — `proof:no-keepalive` reds immediately if KeepAlive is inserted anywhere | **KEYSTONE of Band A** — shell must exist before ring + arrows |
| **N.W2** | A | The carousel ring engine (LIGHT-barrel dogfood) — 7-item turntable, `SpringProgress` ring-angle + trig falloff, shortest-delta interruptible spin-to-front, `stagger` reveal | **DEVELOPED** | **`proof:boundary`** (EXISTING, EXTENDED) — born-RED with a planted `import { loadAnimationEngine }` in any stage module (the REAL import-graph observable: the HEAVY chunk appears in the stage module graph — not a grep on the source, but the bundled output graph); **`proof:ring-spin`** (NEW) — born-RED if a flank click does NOT settle the ring-angle to the target ±ε | the boundary gate bites the REAL import-graph (a bundler-output scan, not a source-grep); the ring-spin gate reads the SpringProgress instance's `.value` after settlement, not a rendered-pixel proxy | ∥ N.W3 (after N.W1) |
| **N.W3** | A | The two glassy intent-arrows — `.glass-refract` chevrons, idle shimmer+drift, hover swell, press recoil + `decay()` lunge, ≥44px, keyboard | **DEVELOPED** | **`proof:arrow-hittarget`** (NEW) — born-RED if the post-transform `getBoundingClientRect` area of either arrow < 44×44px; **`proof:arrow-ring-throw`** (NEW) — born-RED if an arrow press does NOT advance the ring-angle spring target (the REAL ring-advance observable, read from the SpringProgress target, not a CSS class) | tap-target area measured from the post-transform rect (the 15° tilt changes the screen rect — naive plane measurement is the proxy to avoid); ring-advance is the SpringProgress target advance confirmed before visual settlement | ∥ N.W2 (N.W3 deps N.W2 for ring-throw) |
| **N.W4** | B | The living previews — 7 bespoke idle loops (each a LIGHT dogfood), content-visibility-gated loop pause, distant static poster | **DEVELOPED** | **`proof:preview-loop-pause`** (NEW) — born-RED if a distant (rear) ring card's preview RAF continues to tick while `contentvisibilityautostatechange` reports `event.skipped = true` (the REAL observable: the loop tick-counter does NOT advance after the skipped event fires — a proxy such as "loop is paused" boolean is insufficient) | the `contentvisibilityautostatechange` event.skipped is read directly from the card's visibility state; the tick-counter on the distant preview's `RAFPlayback` instance is the oracle (not a rendered-pixel check, not a boolean flag) | after N.W2 (needs ring for visibility-gating) |
| **N.W5** | B | The per-scene NEW interactive idle states in the LIVE scenes | **DEVELOPED** | **`proof:scene-idle-states`** (NEW) — born-RED if any live scene does NOT have an idle loop that runs after mount and differs from the cold-mounted default (the REAL observable: the idle animation loop's `RAFPlayback` instance is RUNNING on the mounted scene, its `.isPlaying` is `true`, and at least one animated property differs from the t=0 value after 500ms of real time) | `RAFPlayback.isPlaying` on the idle loop after mount (not a DOM-snapshot proxy, not a CSS class check); the "differs from t=0" clause prevents a static idle that self-reports as "running" from passing | ∥ N.W6 ∥ N.W7 (after N.W4) |
| **N.W6** | B | Hover-brighten + focus-shift + the commit handoff — `--stage-light` lifts on hover; commit routes through `runSceneSwitch`, state preserved | **DEVELOPED** | **`proof:stage-light-hover`** (NEW) — born-RED if hovering a ring item does NOT produce a measurable `--stage-light` lift (the REAL observable: `getComputedStyle(stageEl).getPropertyValue('--stage-light')` reads a value > the resting 1.0 within 300ms of hover — not a class-toggle proxy); **`proof:commit-routes-through-runsceneswitch`** (NEW) — born-RED if the commit path does NOT call the existing `runSceneSwitch` function (a spy on the entry point, not a URL-change check) | `getComputedStyle` on the `--stage-light` property is the CSS-custom-property observable (a class check or DOM attribute check is the proxy to avoid); `runSceneSwitch` spy is the call-graph observable (a URL change could happen from a fork — the proxy to avoid) | after N.W4 |
| **N.W7** | B | a11y + reduced-motion + the no-VT fallback + the perf budget | **DEVELOPED** | **`proof:prm-ring-snap`** (NEW) — born-RED if the ring spring ticks (the SpringProgress `.velocity` is non-zero after a spin command) under `prefers-reduced-motion: reduce` (the REAL observable: the spring is snapped, not smoothed — NOT a "PRM class applied" proxy); **`proof:keyboard-carousel`** (NEW) — born-RED if ArrowLeft/Right do NOT advance the ring or Enter does NOT commit (the a11y interaction observable over a real browser keyboard event, not a simulated attribute check); frame budget gate uses RELATIVE not absolute thresholds (the CI device-dependence lesson) | PRM ring-snap is confirmed via the SpringProgress instance's velocity (snapped → 0), not a CSS `animation-duration: 0s` check; keyboard events dispatched into the real DOM, not attribute mutations | after N.W6 |
| **N.WZ** | — | Close — production integration, FINAL, deferred ledger, version cut, deploy round-trip | **DEVELOPED** | **`proof:stage-supersedes-dropdown`** (NEW) — born-RED if the dock Select does NOT open the Stage (the primary surface reverts to the old dropdown); **`proof:all`** GREEN; **the deploy round-trip OBSERVED** (CI → deploy → live serves `index-<hash>.js` exact — the live-byte equality, not the gate exit code) | the dock Select trigger invokes `useSceneStage.open()` (not `reka-ui Select` emit) — the REAL observable is the stage overlay mounting on trigger click; the deploy round-trip is the live bytes the site serves, recorded with the exact build hash in N/FINAL.md | **CLOSES** — all Band A+B green, stage supersedes dropdown, `proof:all` GREEN, deploy observed |

---

## §2 — THE DEFERRED-FOLD NOTE

N is a NEW tranche with no inherited L/M chronic rows. The deferred items N must NOT
re-introduce (the recorded footguns the wave discipline enforces):

- **KeepAlive** → `proof:no-keepalive` reds on the first attempt; Decision 2 is absolute.
- **PLATE-on-PLATE glass nesting** → `@supports`-gated `.glass-refract` on arrows + front
  plate ONLY; cards use plain ladder rungs.
- **hand-rolled rAF** → `proof:no-raw-raf` reds on any `requestAnimationFrame(` outside
  `RAFPlayback` in the stage tree.
- **heavy-engine import** → `proof:boundary` extended to scan the stage module graph.

Any N-born deferred item at N.WZ enters `N/PROGRESS.md §"Open deferrals"` as the
`proof:chronic-closure` N-substrate per P-invariant-28. N.WZ re-points the
`CHRONIC_LEDGER` constant from the M substrate to the N substrate in ONE atomic motion
(the K.WZ→L→M→N precedent; the re-point is NOT vacuous — the grammar must bite on the
new substrate, proven with planted-probe reds before cleanup).

---

## Open deferrals

**THE N chronic-closure parse substrate (for `proof:chronic-closure`) — EMPTY AT N.W0.**
This section is populated by N.WZ with any items born during the N implementation that
are not closed before the wave close. The P-invariant-28 terminal-belt rule applies: any
item that is ≥4-tranche old at close must EXIT (build-in or KILL), no further carry.

The SUBSTRATE-TRANSITION NOTE (binding): through N's development phase the authoritative
parse target for `proof:chronic-closure` remains the M substrate (once M authors it; until
then the L substrate at `scripts/proof-chronic-closure.mjs:114 CHRONIC_LEDGER`). N.WZ's
single atomic re-point motion updates `CHRONIC_LEDGER` to `docs/tranches/N/PROGRESS.md`.

> CHRONICITY COLUMN SHAPE (binding grammar contract): every row's Chronicity cell leads
> with an explicit INTEGER tranche-span count, the tranche-letter provenance following in
> parentheses (e.g. `1 (N→O)`). The gate reads the leading integer ONLY. The ≥4-tranche
> EXIT-ONLY mandate (P-invariant-28) is enforced mechanically off that integer.

> DISPOSITION VOCABULARY: FOLD · HANDOFF · RE-AFFIRM · VERIFY-ONLY · BOOK · RECORD ·
> KILL · USER-DOMAIN · OUT.

| Item | Born | Chronicity | Disposition | Owning wave | Gate / evidence |
|---|---|---|---|---|---|
| _(none at N.W0 — this ledger is populated at N.WZ)_ | — | — | — | — | — |
