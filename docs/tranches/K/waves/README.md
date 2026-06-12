# Tranche K — the wave map · the cross-wave README

This is the cross-wave index for Tranche K (the PRODUCT-TRUTH + DESIGN-TOTALITY tranche). It
RENDERS the DAG, gives a one-paragraph charter per wave, lists the gate roster K ADDS, fixes the
BINDING file-ownership boundary for the implementation phase (the W2 voice-tokens / W3 grid-tier
EXACT seam — the two waves are file-adjacent and run in parallel, so the boundary is a hard
contract, not a guideline), and summarizes the TASTE-packet protocol (the third K-born invariant).

**This README is a MAP, not a spec.** It asserts nothing the binding docs do not. Authority order:
the charter `../K.md` (the cluster→wave ledger, the DAG, the three K-born invariants) GOVERNS; the
per-wave specs `K.W0.md … K.WZ.md` carry each wave's falsifiable §Hard gate, P6 postures, named
no-workaround prohibitions, BINDING cross-wave boundaries, and discharged fold rows; `../PATH-FORWARD.md`
is the executive summary; `../audit/*.md` (33 docs) is the evidence. Every claim here is rooted in
those — this doc duplicates none of their assertions, it only INDEXES them. Phase: **DEVELOPMENT on
`tranche-k-dev` @ `4f1fc4c`** — these wave specs are AUTHORED now, RUN later only on explicit user
authorization (the D→J dev/impl boundary; `K.md §Phase`). No source/demo/gate/test/CI edited in DEV.

---

## §1 — The DAG (rendered)

The longest serial path is **W0 → W1 → (W2 ∥ W3) → W4 → WZ**, with W5's legs riding their owning
waves and W6 parallel throughout (`K.md §WAVE MAP`, `PATH-FORWARD.md §5`):

```
                 ┌──────────────────── proof:cold-entry + the de-vacuoused B1 ───────────────────┐
                 │            (W0's own hard gate — CONSUMED by every later wave's verification)  │
                 │                                                                                ▼
   K.W0 ───────> K.W1 ─────────┬─────> K.W2 ──┐                                          (every wave
 the cold      the consume     │   the font   │                                           re-uses the
 front door    edge (re-pin    │   voice root │                                           engine-write
 plays         3.11.2→3.13.0)  │              ├──> K.W4 ──────────────────────> K.WZ      oracle to
   │  P0 LEADS  must precede    └─────> K.W3 ──┘  the pane     ▲                  CLOSE     assert its
   │            the design        the grid/    verdicts,       │                            own subject)
   │            waves             anchoring    round 2         │  the TASTE review-packet
   │                              transposition                │  VERDICT (user-domain,
   │                                                           │  BEFORE the version cut)
   │     ┌──── K.W5 legs ride their OWNING waves ────────────────────────────────────────────────┐
   │     │  proof:cold-entry lands WITH W0 · proof:subject-animates(real scenes) + single-option   │
   │     │  gate land as their surfaces land · the TASTE-packet generator rides W3's capture lib;  │
   │     │  the packets GENERATE at W4's close · release.yml F-1 timeout-minutes rides W1           │
   │     └──────────────────────────────────────────────────────────────────────────────────────┘
   │
   └──── K.W6 (the P-invariant-28 terminations + measurements) — PARALLEL throughout ─────────────►
```

**Edge rationale (BINDING — `K.md §WAVE MAP`):**

- **W0 LEADS.** It is the P0 (the cold-entry truth) AND it authors the two consumed oracles —
  `proof:cold-entry` and the de-vacuoused B1 (engine-write disambiguation). Until those land, no
  later wave can honestly verify that its own surface ANIMATES (it would re-inherit the B1 vacuity
  that greened on the `.idle-hover` bob with the engine off — `live-session-gap-analysis.md §0`).
- **W1 runs IMMEDIATELY AFTER W0 lands locally, and PRECEDES the design waves.** The glass-ui
  re-pin (`~3.11.2 → 3.13.0`) must precede W2/W3/W4 so the design waves build ON 3.13.0, not
  against it (the 3.13.0 dock taxonomy + re-cut sliders are the surface the panes consume —
  `live-glassui-currency.md`).
- **W2 ∥ W3.** File-adjacent in `demo/@/styles` but SEPARABLE: W2 owns the voice tokens, W3 owns
  the grid/anchoring tier. The spec boundary is BINDING (§4 below). They run in parallel.
- **W4 follows W2 + W3.** The pane redesigns CONSUME the new voice (W2) + the new grid (W3).
- **W5's legs partition.** The cold-entry oracle is W0's own hard gate (lands WITH W0); the
  remaining gate-truth legs land as the surfaces they certify land; the TASTE packets generate at
  W4's close. W5 is not a serial bottleneck — it is a roster of legs distributed across the DAG.
- **W6 is parallel.** Ledger terminations + measurements run throughout; they gate nothing on the
  critical path.
- **WZ closes** — and the design band closes ONLY on the user's review-packet verdict (the TASTE
  boundary), a named user-domain step scheduled BEFORE the version cut.

---

## §2 — Per-wave charters (one paragraph each)

Each links its spec and names its decisive move, its source lanes, and its headline gate. The full
falsifiable §Hard gate with born-RED witness, P6 postures, no-workaround prohibitions, cross-wave
boundaries, and fold rows lives IN each spec (the J.W0 precedent structure — `../audit/wave-J.W0.md`).

### K.W0 — the cold-entry truth (P0 · LEADS) → [`K.W0.md`](./K.W0.md)
The product's PRIMARY first-run gesture is broken: the hero rainbow-play navigates `#/` → `#/cube`
and resumes via `scenePlaybackAdapters.ts:76-79` — a `resume()` NO-OP on a never-started group, so
the FSM enters `playing` while every subject stands frozen (the cube only "moves" via the
`.idle-hover` CSS bob at rest). W0 kills the P0 at the ADAPTER seam (resume-made-total:
autoplay-intent + a freshly-bound group ⇒ `group.play()`), **NOT** a demo-side `play()` sprinkle;
de-vacuouses the B1 liveness oracle by engine-write disambiguation (read the engine's own write
channel — the `--ball-p`/aria pair load-bearing, an aria-gated OrbitalDrag-wrapper transform
corroborator, `.idle-hover` excluded — NOT a bare single-element count); fixes the hero→scene handoff; sets the
U-K1 dock default detent; cures the U-K4 amiga float+flash; and clears per-scene cold-mount
defects. **Headline gate:** `proof:cold-entry` (born-RED on the live P0 TODAY — the lead oracle the
whole later battery consumes). **Source lanes:** `live-cold-play-path.md`, `live-session-gap-analysis.md`,
`demo-scenes-k.md`, `live-amiga-breakage.md`.

### K.W1 — the consume edge → [`K.W1.md`](./K.W1.md)
glass-ui is two minors behind: the pin is `~3.11.2` (tilde — blocks 3.12/3.13) vs published
**3.13.0** (the re-cut sliders + the dock taxonomy the design waves want). W1 widens the pin to
`~3.13.0`, re-examines the W7b parity-clause exits (4 of 7 edges) against the 3.13.0 surface,
verifies the landed handoff-ledger rows, and dispositions the press-scale/RF-16/RF-17 hazards;
it also folds the release.yml `timeout-minutes` (F-1, `ci-cd-k.md §F-1`). The bump is SAFE on the
current consume surface (grep confirms kf consumes none of the removed primitives). **Headline
gate:** the re-pin witness — `proof:all` green on `~3.13.0`, the `proof:deps-current` floor advanced
`3.11.2 → 3.13.0`, each hand-rolled twin DELETED in the same motion it consumes the published
primitive (net-deletion). **Source lanes:** `live-glassui-currency.md`, `glassui-handoff-k.md`,
`ci-cd-k.md §F-1`.

### K.W2 — the typographic root (∥ W3) → [`K.W2.md`](./K.W2.md)
There is NO single font-voice authority: `--font-serif` AND `--font-display` are TWO redundant
tokens for the one Instrument-Serif display face, consumed at different sites with no rule for which
is "the display voice", and the dock falls through `.dock-label → var(--font-text)` to native sans
(U-K6/K8/K10). W2 collapses the display voice to ONE token authority (`--font-serif: var(--font-display)`)
and binds the dock band to it at the ROOT (one `@layer .dock-label` rule), **NOT** per-component font
classes; it decides the transport/tab register against that one token (Play=serif vs Reverse=sans
today), closes the `.font-display` utility trap, and repairs the false `style.css:41-44` comment.
**Headline gate:** the POSITIVE font-voice assert — `.dock-label`/chrome RESOLVES the display voice
(not merely the Jakarta negative), one token authority. **Source lanes:** `styling-typography-k.md`,
`live-typography-truth.md`.

### K.W3 — the layout transposition (∥ W2) → [`K.W3.md`](./K.W3.md)
The macro `.controls-layout` grid is sound, but the anchoring/offset tier is not: the docks anchor
on `slack × bias` so at 5120×2880 the top dock floats ~700px down and the whole UI maroons as a tiny
island in dead space, and the rail is a fixed `400px` invariant across a 4× viewport-area span (U-K7).
W3 transposes the layout to a derived grid system — NO hardcoded dock offsets (anchor tokens
derived/capped, not retuned magic numbers), a `clamp()`/`minmax()` rail, and pathological-screen
CLUSTERING (width AND height ceilings past which docks + controls cluster to the content, clamp()/
container-query driven), refining desktop AND mobile — at the GRID/anchoring system, **NOT** retuned
offsets. **Headline gate:** the cluster + no-hardcoded-offset assert (pathological widths/heights
3440×1440, 5120×2880, 390px CLUSTER into a bounded container; no hardcoded dock offset survives the
census). **Source lanes:** `layout-grid-k.md`, `live-session-gap-analysis.md §2`.

### K.W4 — the pane verdicts, round 2 → [`K.W4.md`](./K.W4.md)
The panes the user indicted carry rooted defects on the current glass-ui. W4 re-cuts them
consuming the new voice (W2) + grid (W3): U-K11 a PROPER spring keyframes-editor variant (the cube
grammar) with the STEPPING slider cured at its ROOT (the few-Hz readout mirror must not drive the
slider) and the final-state register = the main-controls red with the dashed outline (U-K17);
U-K12 tabs → pills or dock-dropdown items; U-K13/K18 the noisy readout panes re-cut for hierarchy
with LESS information; U-K16 single-option selects NEVER render (the count IS the gate) + the vizs
gain REAL options; U-K17 the left-clipped pane un-clipped + draggable; U-K20 the FourierField
REMOVED from the hero + the grid lines less opaque. **Headline gate:** the single-option +
continuous-slider + red-dashed asserts. **Source lanes:** `live-dock-tabs-selects.md`,
`design-synthesis-k.md`, `live-fourier-grid.md`.

### K.W5 — the gate-truth wave (legs partition across the DAG) → [`K.W5.md`](./K.W5.md)
The axis-coverage map (`live-session-gap-analysis.md §2`) executed as a roster of legs riding their
owning waves: `proof:cold-entry` (W0's own hard gate); B1 de-vacuoused by engine-write
disambiguation; `proof:subject-animates` extended from the synthetic `<div>` over `dist/keyframes.js`
to the REAL scenes' matrix3d/`--ball-p` transform path; the single-option-select gate made total
(`>0 → >1`); the TASTE-boundary review-packet protocol INSTRUMENTED (the packet generator rides the
W3-lib capture harness); release.yml F-1 `timeout-minutes`; the demo-smoke wall-clock hazard
dispositioned (the live 35m ceiling re-measured against the post-J.W4 roster — `ci-cd-k.md §F-2`).
**Headline gate:** the axis-coverage map executed — each leg born-RED on the
defect it certifies. **Source lanes:** `live-session-gap-analysis.md`, `gate-estate-k.md`, `ci-cd-k.md`.

### K.W6 — the P-invariant-28 terminations (parallel) → [`K.W6.md`](./K.W6.md)
The DL-K 32-row deferred/chronic ledger's exit-only rows discharged: the ≥4-tranche riders exit
probe-or-KILL (never a bare BOOK); the mobile-lighthouse floor re-asserted on a calibrated quiet
host; the W2-noted pre-existing drag-seam gaps (TimelineTrack/useSheetGesture/useSphereSpin)
dispositioned; the dev-mode parity chronicle (the stale-vite-cache class) dispositioned. **Headline
gate:** the termination artifacts — each rider exits via a born-RED gate, a measurement, a published
consume-edge, or a reasoned KILL. **Source lane:** `deferred-ledger-k.md`.

### K.WZ — the close → [`K.WZ.md`](./K.WZ.md)
FINAL.md held to inv ε; the prompt-recap extended through the close (`prompt-recap-k.md`); the
chronic-closure substrate transition J→K; **the TASTE review packets presented + the user verdict
recorded** (the named user-domain step BEFORE the version cut — the design band closes ONLY here);
the version cut (≥patch for the P0; the design band may justify minor — version owner Mike Babb,
confirm-first); publish + the close-merge auto-deploy round-trip RE-observed (the J.W0 oracle
re-witnessed); `L-SEED.md` committed (the frontier re-seeded UNCHANGED). **Headline gate:** the close
round-trip RE-observed + the TASTE verdict recorded. **Source lanes:** `prompt-recap-k.md`,
`precepts-k.md`, `packaging-k.md`.

---

## §3 — The gate roster K ADDS (the K oracle family)

K closes the two unnamed J-blind axes (the COLD axis, the engine-write disambiguation) and proxies
the named taste decisions as binary correctness asserts. Each new/changed gate carries a born-RED
witness plan IN its owning wave spec. Source: `gate-estate-k.md §9`, `live-session-gap-analysis.md
§2`, `PATH-FORWARD.md §6`. (The J estate is 119 `proof:*` scripts / 15 correctness-tier /
100 hygiene-tier at the J close — `gate-estate-k.md §1`; K ADDS to it, it does not re-author it.)

| Gate | Status | Owning wave | The assert | Born-RED witness (today's tree) |
|---|---|---|---|---|
| **`proof:cold-entry`** | NEW | K.W0 | Fresh context (`localStorage.clear()`), NO seed, `goto #/`, click the hero rainbow play as the FIRST gesture; assert the LOAD-BEARING engine-attributable pair — dock play aria flips Play→Pause AND `--ball-p`/slider advances from 0 — PLUS the aria-GATED corroborator: the **engine-write subject** (the OrbitalDrag wrapper for cube/amiga) traverses ≥3 distinct transforms WHILE aria="Pause", `.idle-hover` excluded. (Element-isolation excludes the idle bob; the aria-gate + `--ball-p` carry correctness — a bare single-element count is unfit BOTH ways: `.cube`=0/1 distinct even WARM, `.graph`=13 engine-OFF on the broken cold path — `K.W0.md §Provenance` reconciles `live-session-gap-analysis.md §2` with `gate-estate-k.md §3/§4`.) | `k-verify-gate-blindspot.mjs` greens B1=101 while the play button reads "Play animation" — the gate exists to red on exactly that. **No-workaround:** NOT a longer settle, NOT a raised distinct-count, NOT a bare single-element count. |
| **B1 (`proof:live-session` leg)** | DE-VACUOUSED | K.W0 / K.W5 | Drop `.idle-hover` from the distinct-count sample; GATE the OrbitalDrag-wrapper count on a `play-aria-flips Play→Pause` precondition (the wrapper carries engine-OFF orbital churn — 13 distinct on the broken cold path — so the aria-gate, not a bare element swap, is the disambiguation); make the `--ball-p`/slider advance the load-bearing read | B1 greens at REST on the `.idle-hover` bob with the engine off (`live-session-gap-analysis.md §1`). |
| **`proof:subject-animates`** | EXTENDED | K.W5 | Extend ARM C from the synthetic `<div> left:0→200px` over `dist/keyframes.js` to the REAL scenes' `matrix3d`/`--ball-p` transform path (assert `.graph` matrix advances while aria = "Pause") | The synthetic gate never exercises the demo's matrix/CSS-var path (`live-session-gap-analysis.md §F4`, `gate-estate-k.md §4`). |
| **`proof:demo-fonts` clause (d)** | NEW CLAUSE | K.W2 | The POSITIVE: `getComputedStyle(".dock-label").fontFamily.includes("Instrument Serif")` — not only the Plus-Jakarta negative | The dock renders native sans today and passes the negative-only gate (`gate-estate-k.md §6`). |
| **the single-option-select gate** | NEW | K.W4 / K.W5 | No single-option `<Select>` renders ANYWHERE (the count IS the gate, `>0 → >1` made total across all scenes) | The ChromeDock controls-tab `<Select>` renders a 1-item dropdown on the single-surface scenes (easing/spring) — the sole sweep violation (`live-dock-tabs-selects.md §2.1/§3 S1`, `ChromeDock.vue:199-221`), U-K16. |
| **the continuous-slider assert** | NEW | K.W4 | The spring slider value is CONTINUOUS, not stepped by the few-Hz readout mirror | The few-Hz readout mirror steps the slider (`design-synthesis-k.md §3`, U-K11). |
| **the red-dashed motion assert** | NEW | K.W4 | The "settled" motion register is the red-dashed everywhere (ONE motion-color authority) | The green-progress palette still drives sliders/rings (`design-synthesis-k.md §1.3`, U-K17). |
| **the cluster + no-hardcoded-offset assert** | NEW | K.W3 | Pathological widths/heights (3440×1440, 5120×2880, 390px) CLUSTER into a bounded container; no hardcoded dock offset survives the census | At 5120×2880 the docks float ~700/1130px in and nothing clusters (`layout-grid-k.md §2`). |
| **`proof:deps-current`** | FLOOR ADVANCED | K.W1 | The installed glass-ui floor advances `3.11.2 → 3.13.0` (the tilde widened) | `3.11.2 < 3.13.0`; the floor greens vacuously on the stale pin (`gate-estate-k.md §7`). |
| **`proof:visual-lock`** | RE-BASELINED | K.W4 / K.W5 | Re-capture the golden baseline AFTER the layout/pane refinement lands — never before | The W7c baseline IS the disliked state; "green" means "unchanged from W7c", not "good" (`gate-estate-k.md §5`). |
| **the TASTE review-packet generator** | NEW (instrument) | K.W5 (rides W3 lib) | Per-pane before/after screenshots, desktop+mobile, the named deltas — the artifact the WZ user-verdict step consumes | n/a — instrumentation, not a binary oracle (the taste band is HUMAN, `gate-estate-k.md §8`). |

**The honest band assignment (`gate-estate-k.md §8`):** gates carry CORRECTNESS (binary product
properties: the engine writes, the font resolves, the slider advances, no single-option select
renders). They do NOT carry the design VERDICT — that is the TASTE boundary (§5). A gate can proxy
a taste DECISION as a binary assert (e.g. "the dock carries ONE display voice") only AFTER a human
makes the decision; the decision itself is never the gate's.

---

## §4 — The BINDING file-ownership boundary (W2 voice tokens vs W3 grid tier — EXACT)

W2 and W3 are file-ADJACENT (both live in `demo/@/styles`) and run in PARALLEL, so the ownership
boundary is a HARD CONTRACT, not a guideline. The charter declares them SEPARABLE: **"W2 owns the
voice tokens, W3 owns the grid/anchoring tier; the spec boundary is BINDING"** (`K.md §WAVE MAP`,
`PATH-FORWARD.md §5`). The table below is the disjoint-loci contract each spec restates in its
§Hand-off; if the IMPL finds a line ambiguous, it is W2's iff it is a FONT-FAMILY/voice decision and
W3's iff it is a TRACK/ANCHOR/OFFSET/cluster decision.

| Concern | OWNER | Locus (file:line) | Root |
|---|---|---|---|
| The display voice token collapse (`--font-serif: var(--font-display)`) | **K.W2** | `demo/@/styles/style.css:40` vs `:53` | `styling-typography-k.md §3` |
| The dock-band display-voice binding (`@layer .dock-label { font-family: var(--font-display) }`) | **K.W2** | `demo/@/styles/style.css` (one `@layer` rule); root: glass-ui `typography.css:283` | `styling-typography-k.md §2` |
| The transport/tab voice register (Play=serif vs Reverse=sans decision, the serif-tabs call) | **K.W2** | `playback-button.css:22`, `tab-trigger.css:28` | `styling-typography-k.md §3` |
| The `.font-display` utility trap (`--font-stack-display: var(--font-display)`) | **K.W2** | `demo/@/styles/style.css` `:root` reclaim (one line) | `styling-typography-k.md §5` |
| The false `style.css:41-44` font comment repair | **K.W2** | `demo/@/styles/style.css:41-44` | `styling-typography-k.md §4` |
| The fixed `400px` rail → `clamp()`/`minmax()` track | **K.W3** | `design-idioms.css:116` (`--rail-width`); track at `AnimationControlsGroup.vue:441` | `layout-grid-k.md §1 C1` |
| The dock-anchor offset chain (cap `slack × bias`; derived, not retuned) | **K.W3** | `style.css:139-141, 224, 241` (the slack→offset→anchor chain) | `layout-grid-k.md §1, §2` |
| The work-area ceilings + cluster-past-a-max rule | **K.W3** | `style.css:121-122` (ceilings) + `AnimationControlsGroup.vue:309-314` | `layout-grid-k.md §4` |
| The macro grid `@media → @container` transposition | **K.W3** | `AnimationControlsGroup.vue:348, 432` | `layout-grid-k.md §3` |
| The hero `lg:mt-24` magic margin → work-area chain | **K.W3** | `EditorStartScreen.vue:11` | `layout-grid-k.md §1 C5` |
| The `--target-viewport-w/h: 30vw/30vh` → `cqi`/`cqb` | **K.W3** | `design-idioms.css` (`--target-viewport-w/h`) | `layout-grid-k.md §1 C6` |
| The grid-line opacity tune (U-K20 — a VISUAL value, not a voice or anchor) | **K.W4** | `design-idioms.css:182-183` (`--graph-opacity`, `--graph-major-opacity`) | `styling-typography-k.md §7` (caveat: re-check the substrate-legibility gate clause-g) |

**The seam edge cases (BINDING — restated from the source lanes):**

- `demo/@/styles/style.css` is touched by BOTH W2 (the font `@theme` + `:root` voice tokens, lines
  ~40-117) and W3 (the work-area ceilings + dock-anchor chain, lines ~121-241). They edit DISJOINT
  line ranges of the same file — the IMPL phase must land them as separable commits and each spec's
  §Hard gate must red only on ITS half.
- `--dock-margin` is a **glass-ui token** (`tokens.css:1304`), NOT demo-owned. Any change to the
  dock GAP itself is a glass-ui-repo edge (a born-RED handoff per MEMORY `feedback_glass_ui_root_changes`),
  NOT a demo patch — out of both W2 and W3 (`layout-grid-k.md §1 C4`, `glassui-handoff-k.md`).
- The grid-line opacity (U-K20) is a VISUAL tune, owned by **K.W4** (the pane/visual-refine wave),
  not W2 or W3 — it touches `design-idioms.css` but is neither a voice token nor an anchor.
- The FourierField removal (U-K20's other half) is **K.W4** via `live-fourier-grid.md`, not W3.

---

## §5 — The TASTE-packet protocol (summary)

The third K-born invariant (`K.md §invariant set` — "the TASTE boundary"; the J taste-tension
resolved). **Gates carry CORRECTNESS; they do NOT carry the design VERDICT.** The J.W7c verify
rounds asked agents for a "designer-eye" verdict and got PASS; the user's same-day verdict on the
same panes was "still sucks" / "awful" (`live-spring-sequence-mp-verdict.md`, `wave-J.W7bc.md`).
Gate-green and agent-taste do NOT bound design-good; the boundary needs a NAME and a protocol, not
a stronger adjective in a prompt (`gate-estate-k.md §8` — "no gate can carry taste; the band is
honestly human").

**The protocol, in five clauses:**

1. **The packet.** For EVERY appearance wave, the close motion PRODUCES a review packet:
   per-pane **before/after** screenshots, **desktop + mobile**, and the **named deltas** (which
   design decision each before/after pair exercises).
2. **The generator.** The packet generator is INSTRUMENTED in K.W5 and RIDES the W3-lib capture
   harness (the same `scripts/lib/demo-driver.mjs withPage` substrate the audit lanes used). The
   packets GENERATE at W4's close (when the redesigns have landed).
3. **The verdict is the USER's.** The wave's design band closes ONLY on the user's verdict on that
   packet — a named USER-DOMAIN step. An agent's "designer-eye PASS" is **corroboration, never the
   verdict** (the exact J.W7c failure mode the boundary names).
4. **Scheduled BEFORE the close.** The user-verdict step is scheduled BEFORE the tranche close —
   specifically before the version cut in K.WZ (`K.md §WZ` row) — never after. The design band
   cannot be claimed green by the close until the packet is signed.
5. **Version owner.** Mike Babb (`mike@babb.dev`), confirm-first; the TASTE review packets ARE the
   user's named verdict step (`K.md §chronic+deferred fold`).

**The TASTE anchors the user actually loves** (the packet's deltas amplify these, not replace them
— `design-synthesis-k.md §0`): the rainbow play CTA, the icon-family pops, the serif display
voice, the math graph-paper substrate, and the **red-dashed final-state** motion register (U-K17 —
the main-controls red the user prefers over the disliked green). The packet shows each pane moving
TOWARD those anchors.

---

## §6 — Wave file index

| File | Wave | Class | One-line |
|---|---|---|---|
| [`K.W0.md`](./K.W0.md) | K.W0 | P0 · LEADS | The cold front door plays (the adapter resume made total) + the de-vacuoused B1 |
| [`K.W1.md`](./K.W1.md) | K.W1 | consume edge | glass-ui `~3.11.2 → 3.13.0` (precedes the design waves) + release.yml F-1 |
| [`K.W2.md`](./K.W2.md) | K.W2 (∥ W3) | typographic root | ONE display-voice token authority; the dock joins it at the ROOT |
| [`K.W3.md`](./K.W3.md) | K.W3 (∥ W2) | layout transposition | Derived dock anchoring + pathological-screen clustering (no hardcoded offsets) |
| [`K.W4.md`](./K.W4.md) | K.W4 | pane verdicts r2 | Spring editor + continuous slider + red-dashed + single-option totality + FourierField removal |
| [`K.W5.md`](./K.W5.md) | K.W5 (legs) | gate-truth | `proof:cold-entry`, B1 de-vacuoused, subject-animates on real scenes, the TASTE generator |
| [`K.W6.md`](./K.W6.md) | K.W6 (∥) | terminations | DL-K exit-only rows discharged (probe-or-KILL, no bare BOOK) |
| [`K.WZ.md`](./K.WZ.md) | K.WZ | CLOSE | TASTE verdict recorded + version cut + round-trip RE-observed + `L-SEED.md` committed |

---

*Cross-references: the binding charter `../K.md`; the executive summary `../PATH-FORWARD.md`; the
board + the K open-deferrals ledger `../PROGRESS.md`; the frontier `../L-SEED.md`; the 33-doc
evidence corpus `../audit/*.md`. The spec-structure precedent is `../audit/wave-J.W0.md`
(§Provenance / §State-verified / §Goal / §Scope / §Hard gate / §No-workaround / §Folds / §Hand-off /
§Design-decisions). This README is a MAP; where it and a binding doc disagree, the binding doc wins.*
