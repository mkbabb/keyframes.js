# hd-live-controls — DEEP harden lane (Tranche H)

**Charge:** LIVE re-verify D1/D3/D4 at `/cube` + `/easing`. Measure the controls-sidebar
columns (the two-col grid-template-columns), the easing-canvas size (the 680px), the
timeline ribbon width vs the sidebar width. Confirm the born-RED measurements in H.W3/H.W4.

**Method:** Playwright MCP against the live demo at `http://localhost:5173/` (kf 4.1.0 + Tranche G,
pre-H). The demo uses **hash routing** (`/#/cube`, `/#/easing`) — my charge listed path routes
(`/cube`, `/easing`); the live app rewrites them to hash routes. Viewport 1440×900.

**Verdict:** D1/D3/D4 born-RED measurements in H.W3/H.W4 are **CONFIRMED LIVE, exact.** The
authoring is substantively sound. BUT the live re-verification surfaced **one BLOCKER-grade gate
defect** (`proof:single-column-pack` as worded measures the wrong DOM level and passes vacuously
today — born-GREEN, not born-RED) and **one HIGH measurement-instability finding** (the D12 route
storm is far more aggressive live than H.W3/H.W4 model — it destroys execution contexts mid-measure
and resets the viewport on every navigation; the proposed settle-gate as worded will not hold).

---

## LIVE MEASUREMENTS (the evidence)

### D1 — controls sidebar two-column grid (`/#/cube`, pane open, 1440×900)

`AnimationControlsControls.vue:4` `CardContent` grid measured live:

| metric | live value | H.W3 cite | match |
|---|---|---|---|
| `grid-template-columns` (resolved) | `212px 466px` | `auto 1fr` → `{212,466}` widths | ✓ exact |
| grid container width | 722px | (≈724 card) | ✓ |
| leaf `.labeled-field` left-edge set | `{45, 243}` (relative; on-screen rows) | `{76,300}` (size 2) | ✓ size-2 two-col |
| leaf `.labeled-field` width set | `{186, 90}` … `{212,466}`-class split | `{212,466}` (Δ=254) | ✓ two lopsided cols |
| column gap | 12px (`gap-x-3`) | — | ✓ |

Source confirmed exact: `AnimationControlsControls.vue:4` = `relative grid grid-cols-[auto_1fr]
gap-x-3 gap-y-1 px-4 py-3`; `:6` = `panel-stack col-span-2 grid grid-cols-[subgrid]`; `:9` =
`panel-content grid grid-cols-[subgrid] … gap-y-2` (note the `gap-y-1` vs `gap-y-2` doubled-rhythm
F5 finding is real). The **mixed-paradigm rows** (H.W3:17) are visually confirmed in
`hd-cube-1440-settled.png`: `fill mode | easing` renders with the dropdown left and the easing
edit-pencil floating mid-row right — the two contradictory row shapes are on-screen.

Screenshot: `hd-cube-1440-settled.png` (pane OPEN — shows duration|delay, iterations|direction,
fill-mode|easing as two-per-row; the cube renders centered behind the overlay → `proof:stage-not-clipped`
baseline holds at 1440 with pane open).

### D3 — easing canvas unbounded square (`/#/easing`, 1440×900)

`EasingCurveCanvas.vue` SVG `.easing-curve-canvas` measured live at its settled wide state:

| metric | live value | H.W4 cite | match |
|---|---|---|---|
| canvas (SVG) bounding box | **680 × 680** | 680×680 | ✓ exact |
| `block-size` (computed) | **680px** | 680px | ✓ exact |
| `aspect-ratio` | `1 / 1` | 1/1 | ✓ |
| `min-height` | 140px | 140px | ✓ exact |
| `max-block-size` | `none` | (no ceiling) | ✓ |
| `container-type` (canvas + every ancestor) | **`normal`** | normal (no CQ context) | ✓ exact |
| EasingSidebar `glass-card` (editor A root) | **724 × 883** | 724×883 | ✓ exact |
| canvas ÷ panel height | 680/883 = **0.77** | 77% | ✓ exact |

Screenshot: `hd-easing-1440-canvas680.png` — the bezier square overflows the viewport bottom; the
card has **no header** (editor A: "ease" appears only as the value input at the very bottom),
confirming the RC-4 / parity-header gap. `proof:easing-canvas-bounded` BITES on every clause:
`blockSize 680 > 280`, `containerType normal ≠ inline-size`, panel ratio `0.77 > 0.55`. **D3 fully
confirmed; H.W4 §state and the gate born-RED numbers are exact.**

### D4 — three competing width regimes (`/#/cube`, 1440×900, desktop)

Measured on the settled cube grid (`.controls-layout`), all widths resolved at desktop:

| element | live width | H.W3 / `proof:timeline-rail-width` cite | match |
|---|---|---|---|
| grid track-1 (`grid-template-columns`) | **`1353.59px 0px 0px`** | `1353.59px 0px 0px` (1fr 1fr → 0) | ✓ exact |
| `#timeline-expanded-target` (the genuine full-width el) | **1353.59px** | full-width = expanded timeline (F2) | ✓ |
| `#controls-ribbon-target` | **1271.59px ≈ 1272** | 1272 (ribbon, bound by nothing) | ✓ exact |
| `AnimationControls` root (`lg:max-w-screen-md`) | `max-width: 768px`, **768px** | 768 (divergent cap) | ✓ exact |
| `--controls-pane-width` token | **400px** | 400 (nominal only) | ✓ exact |
| `.controls-content` | `min-width: 400px` (floor) / actual **1353.59px** | floor never caps the stretch | ✓ exact |
| `--rail-width` token | **(unset)** | (rename not done — pre-H) | ✓ |

The **four-number disagreement (1353.59 / 1272 / 768 / 400)** that `proof:timeline-rail-width`
asserts is born-RED is **confirmed live.** The ribbon-over-stretch is visible in
`hd-cube-1440-settled.png` (the Play/Reverse ribbon spans ~1272px while the sidebar card above ends
at ~720px). `--breakpoint-md` resolves to 48rem = 768px (the cap value). Source confirmed:
`AnimationControls.vue:4` carries `lg:max-w-screen-md`; `ControlsPaneWrapper.vue:206`
`min-width: var(--controls-pane-width)`; `design-idioms.css:106` `--controls-pane-width: 400px`.

---

## FINDINGS

### F1 — BLOCKER · `proof:single-column-pack` as worded does NOT bite (born-GREEN today)
**Loc:** H.W3 §Hard gate, `proof:single-column-pack` (`H.W3.md:39`).
**Defect (live evidence):** The gate asserts `new Set(rows.map(r => r.getBoundingClientRect().x)).size
=== 1` over "ALL top-level field rows." Taken literally, "top-level rows" = the **direct children
of the `grid-cols-[auto_1fr]` CardContent**. But the CardContent has exactly **ONE** direct child:
the `panel-stack col-span-2` wrapper (`AnimationControlsControls.vue:6`, computed
`grid-column: span 2 / span 2`). Live measurement of `CardContent.children`:
`directChildLeftEdgeSetSize === 1`, `widthSpread === 0` — i.e. the gate **passes today, born-GREEN**,
the exact opposite of the intended born-RED. The two columns live at the **leaf** level:
`.labeled-field` rows nested through the `panel-stack → panel-row → panel-content` subgrid chain
(`leafLeftEdgeSetSize >= 2`, the `{212,466}`-class width split). A gate that reds today MUST select
the leaf field/control rows reached through the subgrid, not `CardContent.children`.
**Fix (doc edit):** In `H.W3.md:39`, replace "ALL top-level field rows" with an explicit leaf
selector and define the row set unambiguously, e.g.: *"assert over the LEAF field rows
(`.controls-content .labeled-field`, plus the hand-split easing-row container and the
`LayerConfigPanel` z-index row — NOT `CardContent.children`, whose single `panel-stack col-span-2`
child trivially yields set-size 1 and passes vacuously today). Live born-RED: leaf left-edge set =
`{≈76, ≈300}` (size 2), width set `{≈212, ≈466}` (Δ≈254)."* Add a one-line note that the
`panel-stack`/subgrid wrapper is transparent to the row set.

### F2 — HIGH · the D12 settle-gate as worded will not hold live (the route storm is worse than modeled)
**Loc:** H.W3 §Hard gate intro (`H.W3.md:37`, the settle-gate clause) + §Design decisions
("DEPENDS on H.W1", `:57`); same instrument inherited by H.W4 gates.
**Defect (live evidence):** H.W3/H.W4 model the storm as "every `page.goto` bounced through a
restored scene" — a transient at navigation. Live it is materially worse:
- **The viewport itself resets to 390px on every `browser_navigate`** (then the storm runs in
  mobile state) — only a subsequent explicit resize restores 1440. The layout therefore measures
  in a `controls-pane--mobile` configuration unless the harness re-asserts width AFTER navigation.
- **The `controls-pane--mobile` class is sticky / lags the live width**: at a verified `vw===1440`
  with `matchMedia('(min-width:1024px)').matches === true`, the wrapper still carried
  `controls-pane--mobile controls-pane--closed`, parking the open-pane content off-screen
  (negative x). The mobile/desktop JS ref does not re-evaluate to match the CSS breakpoint.
- **The storm destroys the execution context mid-measurement**: a `getComputedStyle` settle loop
  was aborted by an in-flight navigation to `#/amiga` ("Execution context was destroyed, most
  likely because of a navigation"). The terminal attractor was non-deterministic across runs
  (`#/cube`, `#/easing`, `#/square`, `#/amiga`, and bare `#/` home all observed as settle states).
- The storm has live **engine side-effects**: it cycles through scenes whose stored easing is a
  custom `TimingFunction`, throwing `AnimationOptionError: … custom TimingFunction has no CSS
  animation-timing-function representation` (`src/animation/format.ts:24`, via
  `KeyframesStringControls.vue:46`) — 2 console errors accrued during the storm.

The proposed settle-gate — *"wait until `getComputedStyle('.controls-layout').gridTemplateColumns.
split(' ')[0]` resolves to the `--rail-width` value"* — is necessary but **insufficient**: it does
not address (a) the post-navigate viewport reset, (b) the sticky `--mobile` ref that survives a
correct CSS breakpoint, or (c) context-destroying mid-flight navigations. A width-equality gate
will flake or abort exactly as my measurement runs did.
**Fix (doc edit):** Strengthen the settle-gate clause in `H.W3.md:37` to require, in order:
(1) re-assert the test viewport AFTER navigation (not before); (2) gate on the **JS desktop state**
not just the CSS grid — assert `.controls-pane-wrapper` does NOT carry `controls-pane--mobile` AND
`controls-pane--open` is present (the FSM resting in desktop-open), in addition to the grid-track
resolution; (3) require N consecutive stable rAF/poll ticks of BOTH the hash AND the wrapper class
before asserting, and wrap the assert to retry on context-destroyed. Add an explicit cross-ref:
**this is a HARD dependency on H.W1 actually KILLING the storm** — if H.W1's FSM merely "rests"
but the autonomous re-restore still fires on navigation, H.W3's width gates remain unmeasurable.
Recommend H.W3 name the H.W1 acceptance criterion it needs: *"zero autonomous route changes within
2s of a settled `page.goto`"* — and make H.W3's gates BLOCK on that H.W1 gate being green.

### F3 — MED · the "1353.59px" full-width element is the timeline target, not the ribbon — ensure the gate measures the right node
**Loc:** `proof:timeline-rail-width` (`H.W3.md:40`).
**Observation (sound, but tighten):** The gate asserts `width(#timeline-expanded-target) ===
width(.controls-content) === width(AnimationControls root) === --rail-width`. Live, these are
**1353.59 / 1353.59 / 768** respectively today (the expanded-timeline target ALSO measures
1353.59px = the full 3-col span, NOT 1272 and NOT 768). So today the four asserted quantities are
`{1353.59, 1353.59, 768, 400}` — three distinct values, the gate reds correctly. This is CONSISTENT
with the design decision (D4-as-worded "ribbon full-width" is already satisfied; the genuine
full-width el is `#timeline-expanded-target`). No defect — but the gate text cites "`1272 vs 768 vs
400`" as the born-RED triple while the expanded-timeline target actually measures **1353.59**, not
1272 (1272 is the *ribbon* target `#controls-ribbon-target`, a different node). 
**Fix (doc edit):** In `H.W3.md:40`, correct the born-RED witness numbers to the nodes actually
named: `#timeline-expanded-target` = **1353.59px** (not 1272), `AnimationControls root` = **768px**,
`--rail-width` (currently `--controls-pane-width`) = **400px**; note 1272 is the separate
`#controls-ribbon-target` width (the ribbon, already sidebar-adjacent via teleport). Keeps the gate
honest about which node yields which number.

### F4 — LOW · S3 `box-sizing` assumption is VERIFIED SOUND (record, not a defect)
**Loc:** H.W3 S3 (`H.W3.md:32`), the parenthetical "keep `box-sizing: border-box` so the
shadow-clearance padding stays inside the budget."
**Verification (live):** `.controls-content` computed `box-sizing: border-box` (Tailwind Preflight
universal reset — a freshly-created `<div>` also computes border-box). `ControlsPaneWrapper.vue:203-210`
sets `padding-right: 12px; padding-bottom: 12px` for shadow clearance but does NOT set `box-sizing`
locally — it inherits the global border-box. So S3's `min-width → width: var(--rail-width)` swap
will hold the box at exactly `--rail-width` (the 12px padding stays inside the budget), and
`proof:timeline-rail-width`'s ±2px clause is achievable. **No edit needed** — recording that S3 is
feasible as written and the parenthetical is correct.

### F5 — LOW · charge/wave route-syntax mismatch (path vs hash)
**Loc:** cross-cutting (my charge + any wave/gate that writes `page.goto('…/cube')`).
**Observation:** The live demo is **hash-routed** (`http://localhost:5173/#/cube`,
`/#/easing`). Path-style `'/cube'` is rewritten to `/#/cube` by the app but a Playwright gate that
asserts on `page.url() === '…/cube'` (no hash) would mismatch. Gate authors should write
`/#/cube` / `/#/easing` literally.
**Fix (doc edit):** Where H.W3/H.W4 gate snippets `navigate('#/cube')`, ensure the hash form is
used (they mostly already do — confirm none drops the `#`).

---

## ALREADY-SOTA / sound (no manufactured findings)
- The born-RED numbers (680×680, 724×883, `containerType:normal`, 140px min, 1353.59/1272/768/400,
  `{212,466}` columns) are **exact** — H.W3/H.W4 §state did not exaggerate.
- The overlay architecture (pane is `position:relative z-controls` over a centered stage) is real
  and the cube is NOT clipped at 1440 with the pane open (`proof:stage-not-clipped` baseline holds).
- S3 (one-token width authority) is feasible (F4); the `--controls-pane-width` → `--rail-width`
  rename targets a single real definition at `design-idioms.css:106`.
- `proof:easing-canvas-bounded` and `proof:demo-shell-grid` (the grep clause for live tokens
  `grid-cols-[auto_1fr]`, `col-span-2`, `grid-cols-[subgrid]`, `--controls-pane-width`) all bite —
  every cited token is live in source.

## Artifacts
- `/Users/mkbabb/Programming/keyframes.js/hd-cube-1440-settled.png` (D1+D4, pane open)
- `/Users/mkbabb/Programming/keyframes.js/hd-easing-1440-canvas680.png` (D3, 680px square)
