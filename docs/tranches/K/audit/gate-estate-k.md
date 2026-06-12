# Gate-Estate Audit — Tranche K

**Lane:** gate-estate-k (DOCS ONLY — no source/test/gate/CI edits).
**Repo:** `/Users/mkbabb/Programming/keyframes.js`, branch `tranche-j-dev` == `master` @ `4f1fc4c`.
**State:** Tranche J closed 2026-06-11, 4.2.0 published. `proof:all` certified GREEN on the close tree.
**Date:** 2026-06-11.
**Method:** Static read of all proof scripts (`scripts/proof-*.mjs`), vitest files (`test/*.test.ts`,
`bench/*.bench.ts`), `package.json` scripts, `scripts/lib/gate-shape.mjs`,
`docs/tranches/J/gate-taxonomy.md`, `docs/tranches/K/audit/live-*` companion analyses. All
claims cite file:line, command + observed output, or companion doc (inv ε).

---

## §1 — Count and LoC at J-close

| Layer | Count | Total LoC |
|---|---|---|
| `scripts/proof-*.mjs` (proof scripts) | 99 | 37 152 |
| `test/*.test.ts` (vitest tests) | 79 | 12 692 |
| `bench/*.bench.ts` (bench files) | 8 | 1 413 |
| `package.json` `proof:*` scripts | 119 | — |
| `proof:correctness` leaf gates | 15 | — |
| `proof:hygiene` leaf gates | 100 | — |
| `proof:browser` (standalone, in neither tier) | 1 | — |
| Total vitest test cases (`npx vitest list | wc -l`) | 754 | — |

The proof layer (37 152 lines) is 3× the size of the vitest layer (12 692 lines). The gate
infrastructure has accumulated faster than the library tests that underlie it. Of the 119 named
`proof:*` scripts, 115 appear in `proof:all` (= `proof:correctness ∪ proof:hygiene`);
`proof:browser` is the one un-aggregated outlier.

---

## §2 — The two-tier taxonomy: correctness vs hygiene

The taxonomy (`docs/tranches/J/gate-taxonomy.md`; `proof-gate-is-runtime.mjs` header) divides:

**CORRECTNESS tier** (15 gates in `proof:correctness`): every member must be an actuating
browser-over-dist runtime gate. Enforced structurally by `proof:gate-is-runtime` (HYGIENE),
which reads the scripts and asserts browser harness + actuation primitives. The tier is:

```
proof:engine-no-throw-on-play   proof:subject-animates
proof:fsm-suspend-resume-live   proof:easing-editor-live
proof:amiga-subject-is-pivot    proof:drag-gesture
proof:control-surface-single-writer  proof:sheet-reopen-scroll
proof:perf-frame-budget          proof:icon-paint-live
proof:specular-absent-at-rest    proof:demo-fonts
proof:live-session               proof:live-session-mobile
proof:appearance-suffusion
```

**HYGIENE tier** (100 gates in `proof:hygiene`): static source-shape, load-rest DOM, snapshot,
self-captured-baseline, and structural/meta gates. This is the overwhelming majority — the deep
static + structural lattice the project accumulated over tranches A–J.

The taxonomy is honest on its own terms: the two-tier split is explicit, the meta-gate
(`proof:gate-is-runtime`) enforces it mechanically, and the taxonomy doc (`gate-taxonomy.md`)
names the device-dependence postures. However, as §3–§5 document, the taxonomy contains three
structural gaps the K findings expose.

---

## §3 — Finding 1: the cold-path is an unexercised axis (P0 and P1 gate blindspot)

### The observed defect (from companion analysis `live-cold-play-path.md`)

From the hero start screen (`#/`), clicking the rainbow play CTA on a COLD (no seed) context:
- The machine navigates to `#/cube` (FSM fires `NAVIGATE`).
- The machine's `PLAY` effect calls `adapter.resume()` on the cube group adapter (`useSceneMachine.ts:182-184`).
- `resume()` (`scenePlaybackAdapters.ts:76-79`) is a no-op on an unstarted group: `if (group.started && group.paused) group.resume()` — the unstarted group never starts.
- The `onMounted` autoplay guard (`AnimationControlsGroup.vue:219-223`) reads `animationGroup` at mount time, when the prop is still the EMPTY placeholder `new AnimationGroup()` (length 0). It skips.
- **Result:** slider stuck at `"0"` for the full 2s sample window (`probe-cold-precise.mjs`); `.rainbow-vivid` never appears; the engine never starts. A SECOND click fixes it (now the real group is bound). The machine believes `playing:true, started:true`; the engine does not.

Probe evidence (`k-isolate.mjs`, `probe-cold-precise.mjs`, `cold-cube-2s.png`):
```
/        : vivid:false  dSlider:1   sliders:["0"]   ← COLD home→cube: broken
/square  : vivid:true   dSlider:14  sliders:[…]     ← COLD direct entry: works
```

This is a P0 product defect — the primary first-run CTA on the landing page does not produce
the advertised animation.

### The gate that should have caught it (but greened anyway)

`proof:live-session` B1 leg (`proof-live-session.mjs:380-411`):

**Weakness 1 — pre-seeded warm state.** The B1 leg calls `seedControlsOpen(page)` before
`goto #/` (`proof-live-session.mjs:387-388`). `seedControlsOpen` writes
`{isControlsPanelOpen: true}` into localStorage (`proof-live-session.mjs:225-228`) — state
the genuine cold user never has. The cold path is never exercised by any correctness gate.

Verification: `grep -E "seedControlsOpen|goto.*#/" scripts/proof-live-session.mjs` — every
call to `seedControlsOpen` precedes every `goto(base + "/#/")`. Zero legs land on the hero
without a seed.

**Weakness 2 — the idle-bob false positive.** B1 samples `.cube`, `.graph`, and `.idle-hover`
for `distinct transform >= 3` (`proof-live-session.mjs:393-410`). But `.idle-hover` runs
`animation: idle-bob 3s ... infinite alternate` **at rest** (`demo/cube/CubeTarget.vue:207-208`);
the class `.idle-hover.playing { animation: none }` stops it ONLY WHEN the engine IS playing
(`CubeTarget.vue:210-211`).

Measured at REST with NO play (`k-verify-gate-blindspot.mjs`):
```
IDLE-HOVER distinct transforms at REST (no play): 40
B1-formula distinct (.cube/.graph/.idle-hover): 41   ← gate needs >=3
dock play aria: "Play animation"                     ← engine never started
B1 verdict: PASS (GREEN)
```

The idle CSS animation alone satisfies the B1 oracle. The gate measures the WRONG element-set
for "the engine is animating." This gap was documented in the `proof:subject-animates` docstring
(`proof-subject-animates.mjs:8-13`) for the synthetic lib probe — but the demo-level B1 oracle
still uses the same unguarded sample.

**Why the cold-path gap persisted through J:** the gate-is-runtime meta-gate (`proof:gate-is-runtime`)
enforces that correctness gates USE the browser harness and ACTUATE the product. It does NOT
enforce what the actuation target is, or whether the cold path is covered. The meta-gate is
structurally sound as a HARNESS SHAPE checker; it cannot see COVERAGE GAPS in the actuation
path. This is the designer-eye gap in the gate meta-layer: the oracle precept says "the oracle
must be the product property a human would check" — but it cannot verify which HUMAN PATHS are
checked.

---

## §4 — Finding 2: the lib-adoption coverage is SYNTHETIC (P1 oracle narrowing)

`proof:subject-animates` (the J.W6 P0 subject-write gate) proves the BUILT `dist/keyframes.js`
writes to a synthetic `<div>` via `getComputedStyle(el).left` (`proof-subject-animates.mjs:69-152`).
This is genuine correctness for the library surface. However it guards the lib's `left: 0px → 200px`
keyframe path, NOT the demo's actual transform/matrix/CSS-var interpolation path.

The demo uses `transform: matrix3d(…)` + `--ball-p` CSS custom properties, driven through
`AnimationGroup` + `CSSKeyframesAnimation`. The `proof:subject-animates` ARM C (the AnimationGroup
path) uses `left` interpolation on a synthetic subject — not the cube's matrix path or the
spring ball's `--ball-p` path.

Companion analysis `live-session-gap-analysis.md §1`:
```
CHOREO cube:  .cube distinct transforms over 2s = 1
              (slider advances, but cube face orientation static)
```
The companion lane flagged this as "needs impl-lane runtime trace — suspected-real." The CHOREO
cold-entered cube (direct hash-nav + seed + click) produces identical cube transform across frames
while the playback slider advances. This suggests the engine may be writing `matrix3d` transforms
to the OrbitalDrag wrapper (`.graph`) rather than `.cube` itself — but `.cube` is what the human
sees. The lib gate greens; the visual outcome is ambiguous. A K gate needs to assert
`.graph` (the orbital container that carries `apply-transform-to-container`) advances its
matrix WHILE `aria-label "Pause animation"` is present.

---

## §5 — Finding 3: the visual-lock baseline IS the disliked state (P1 drift inversion)

`proof:visual-lock` is HYGIENE-tier, observe-only in CI, and explicitly labeled
"appearance-drift TRIPWIRE, NON-AUTHORITATIVE for appearance correctness" (`proof-visual-lock.mjs:18-20`).
Its baseline was RE-CAPTURED at J.W7a (the appearance-grammar close motion, commit `8c7910b`)
and again at J.W7c (47 golden PNGs re-captured, `377eb3e`).

**The inversion:** user findings U-K7, U-K13, U-K17, U-K19 describe layout/pane states the user
actively dislikes ("look awful", "clipped on the left", "green disliked"). These states are
exactly what the J.W7c visual-lock baseline captured as GREEN. The gate is doing its job — it
detects DRIFT from the committed baseline — but the committed baseline encodes a state the designer
rejects. "Green on visual-lock" means "unchanged from J.W7c close" not "looks good." The companion
analysis (`live-session-gap-analysis.md §coverage map`) records this as class **(c) post-certification
drift** for U-K7/U-K13/U-K17.

**Can any gate carry taste?** The honest answer from this audit: **no gate can carry taste; the
band is honestly human.** The three-tier taxonomy (hard/observe-only/runner-calibrated) is a
device-dependence taxonomy, not a correctness-vs-quality taxonomy. A "correctness-tier" gate
asserts a BINARY product property (the engine writes, the font resolves, the slider advances).
Taste is not binary — it is relational, contextual, and requires a viewer with aesthetic
intent. The appearance-suffusion gate (`proof:appearance-suffusion`) can assert "`.ball-tone`
resolves a specific rgb()" but cannot assert "this color scheme looks cohesive." The visual-lock
gate can assert "pixel drift < N" but cannot assert "the current pixels are good." The font
gate can assert "Plus Jakarta absent" but not "the type hierarchy reads well."

**The structural answer:** the gate battery covers the correctness band of the quality space
(properties with a binary oracle: present/absent, ≥3 distinct, resolves/does-not-resolve). The
taste band — layout refinement, hierarchy, visual tension, motion quality — is the exclusive
domain of the human close (user findings U-K7/U-K11/U-K12/U-K13/U-K17/U-K18/U-K19). The gate
cannot be given taste; it can only be given more COVERAGE of binary correctness properties that
proxy taste (e.g., "dock carries ONE font voice, not two" — a binary correctness assertion that
encodes a taste decision, once the decision is made by a human).

---

## §6 — Finding 4: the `proof:demo-fonts` oracle is a negative (P2 scope gap)

`proof:demo-fonts` asserts (a) NO "Plus Jakarta" on body/dock/chrome surfaces, (b) Instrument
Serif present on display elements, (c) no font `error` state. The companion analysis
(`live-typography-truth.md §2-3`) found:

- `.dock-label` (6 sites: top-dock scene-select trigger, top-dock controls tab, transport
  animation labels, "Timeline") resolve NATIVE SANS, not Instrument Serif.
  `glass-ui/typography.css:283`: `dock-label { font-family: var(--font-text) }`.
- `proof:demo-fonts` asserts `body/dock/chrome` have no Plus Jakarta — passes, because the
  demo reclaims Plus Jakarta away. But it never asserts `.dock-label` carries the DISPLAY voice.
  A dock rendering native sans instead of Instrument Serif passes the gate.
- The assertion `demo/@/styles/style.css:41-44` ("text-title, text-heading, dock-label and
  text-subheading all resolve `--font-display`") is FALSE — census confirms they bind
  `var(--font-text)` = native sans. The comment has masked U-K6/U-K8 since J.

The fix (one demo-side `@layer` rule; proved correct via runtime injection in
`docs/tranches/K/audit/root-fix-probe.mjs`) is a P1 implementation finding. The GATE gap is that
`proof:demo-fonts` only asserts the NEGATIVE (no Plus Jakarta), never the POSITIVE (dock resolves
display voice). A future K gate clause should assert
`getComputedStyle(dock-label).fontFamily.includes("Instrument Serif")`.

---

## §7 — Finding 5: glass-ui pin staleness is P2 gate drift

Current pin: `"@mkbabb/glass-ui": "~3.11.2"` (`package.json:182`, `optionalDependencies`).
Installed: `3.11.2` (`node_modules/@mkbabb/glass-ui/package.json`).
Registry latest: `3.13.0` (`npm view @mkbabb/glass-ui version` → `3.13.0`).

`proof:deps-current` asserts a FLOOR of `>= 3.11.2` (the correctness minimum for specular
absence + slider rendering). It passes because `3.11.2 >= 3.11.2`. The gate was authored at
J.W7b and advanced the floor from `3.9.0` to `3.11.2`; it has no CEILING or STALENESS clause.
The companion analysis (`live-glassui-currency.md §1`) diffed both tarballs:

| Bump | Risk |
|---|---|
| 3.11.2 → 3.12.0 | Internal/hygiene delta; GlassDock API unchanged; safe |
| 3.12.0 → 3.13.0 | Breaking: dock taxonomy rewrite (no `variant` prop), `InstrumentRail` removed, `instrument-rail.css` dropped from `styles/index.css`, `HandMark`/`DeckProgress`/`GlassDialogNative` removed. **kf does not consume any of these** (grep confirms `variant="rail"` → 0 hits, `InstrumentRail` → 0 hits). The 3.13.0 bump adds: DockRail, GooBlob, Constellation, motion-curves export, click-integrity composable, autoLuminance default-ON. |

**The upgrade is safe on the current consume surface.** `proof:deps-current` should be extended
with a CURRENT clause (warn/fail when the installed version lags registry by ≥ 1 minor). The
tilde pin (`~3.11.2`) will never auto-pick 3.12.x or 3.13.x; the K dependency lane must widen
it to `~3.13.0` after the safety verification.

---

## §8 — The designer-eye gap: can a gate carry taste?

This is the structural question the K findings force. The three-tier posture taxonomy
(`gate-taxonomy.md`) names `hard`, `observe-only`, and `runner-calibrated` — all three are
axes of **device-dependence**, not of **aesthetic authority**. The taxonomy is honest about
what it covers; it never claimed to cover taste.

The correctness-tier oracle precept says: "the oracle must be the product property a human
would check, exercised through the same surface the human uses." It is silent on WHICH human
properties to check. The gate battery can grow to cover every binary correctness property the
designer has decided on — but the DECISION to care about a property remains human. A gate
cannot autonomously discover that "the grid lines are too opaque" or "the spring slider steps
instead of flowing" or "two panes look awful together." It can only verify these properties
once a human has encoded them as falsifiable binary oracles.

**The honest band assignment:**

| Band | Who owns it | Gate mechanism |
|---|---|---|
| Library correctness (engine writes, interpolation, timing) | Gate (correctness-tier, synthetic + demo-level) | `proof:subject-animates`, `proof:engine-no-throw-on-play`, ARM A/B/C |
| Demo correctness (cold path starts, slider advances, font resolves, color matches) | Gate (correctness-tier, actuating) | NEEDS K gate additions (§9) |
| Appearance non-regression (pixel drift from baseline) | Gate (hygiene-tier, observe-only) | `proof:visual-lock` — catches drift, not taste |
| Taste (layout quality, visual tension, type hierarchy, motion feel) | **Human exclusively** | No gate can carry this |

The K gate additions can close the demo-correctness gap. The taste gap is permanently human;
the gate battery's job is to free the human's attention for taste by automating correctness.

---

## §9 — Summary of K gate additions implied by the estate audit

| Finding | What a new K gate must assert | Born-RED condition |
|---|---|---|
| §3 cold-path gap | Fresh context, NO seed, `goto #/`, click hero rainbow play ONCE; assert `dock play aria` flips `Play → Pause` AND slider advances from 0 AND playback reaches vivid | Current broken state (P0-1 in `live-cold-play-path.md`) |
| §3 idle-bob oracle | B1 MUST NOT count `.idle-hover`/`.cube` static-face elements; must read the OrbitalDrag wrapper (`.graph` matrix3d) AND assert `aria-label` flip | Current B1 greens at REST |
| §4 lib adoption | Cube group play: the CHOREO path must assert ≥3 distinct `.graph` matrix3d values (not `.idle-hover`) while `aria` = "Pause" | A non-animating group satisfying B1 today |
| §6 font positive | `proof:demo-fonts` clause (d): `getComputedStyle(".dock-label").fontFamily.includes("Instrument Serif")` must pass AFTER the root-fix lands | Current dock renders native sans |
| §7 glass-ui currency | `proof:deps-current` widen: installed `glass-ui` MUST be `>= 3.13.0` after the K pin bump | Current `3.11.2 < 3.13.0` (greens on the old floor) |

---

## §FOLD

| Finding | Severity | The seam (file:line) | Suggested wave-class |
|---|---|---|---|
| Cold hero-play CTA: machine `PLAY` routes `resume()` on unstarted group; slider stuck 0, engine never starts; P0 product defect unexercised by any gate | **P0** | `useSceneMachine.ts:182-184` + `scenePlaybackAdapters.ts:76-79` + `useSceneMachineApp.ts:128-130` (markSceneReady PLAY dispatch) + `AnimationControlsGroup.vue:219-223` (onMounted guard) | cold-play-engine fix + new cold-entry correctness gate |
| `proof:live-session` B1 oracle: pre-seeds warm state (`seedControlsOpen:225-228`) + counts idle CSS bob (`.idle-hover` 40+ transforms at REST, `CubeTarget.vue:207-211`) — greens over the broken cold path | **P1** | `proof-live-session.mjs:380-411` (B1 leg); `CubeTarget.vue:207-211` (idle-bob fires at rest) | gate fix: isolate `.graph` matrix3d; assert `aria` flip; add COLD born-RED leg |
| `proof:demo-fonts` oracle is a negative (no Plus Jakarta) — never asserts dock carries display voice (Instrument Serif); `.dock-label` SANS confirmed live; stale comment at `style.css:41-44` masks it | **P1** | `demo/@/styles/style.css:41-44` (false comment); `glass-ui/typography.css:283` `dock-label{font-family:var(--font-text)}`; `proof-demo-fonts.mjs:38-60` | typography-root fix (one `@layer` rule) + gate clause (d) |
| `proof:visual-lock` baseline re-captured over the disliked W7c state — gate is GREEN over layout/pane states the designer rejects; drift the user dislikes IS the committed baseline | **P1** | `proof-visual-lock.mjs:18-20` (non-authoritative by design); `scripts/baselines/visual-lock/` (47 PNGs, committed W7c close) | K visual-lock re-baseline AFTER layout-refinement wave lands |
| Lib `proof:subject-animates` ARM C uses `left: 0→200px` on a synthetic `<div>` — never exercises the demo's `matrix3d`/CSS-var transform path; choreo `.cube` produces 1 distinct transform while slider advances | **P1** | `proof-subject-animates.mjs:69-152` (synthetic left probe); `demo/cube/CubeTarget.vue:14,24` (engine writes matrix to OrbitalDrag wrapper `.graph`, not `.cube` face) | extend subject-animates ARM C with matrix3d oracle over `.graph` |
| glass-ui pin `~3.11.2` (installed 3.11.2) vs registry 3.13.0; `proof:deps-current` floor `>= 3.11.2` passes vacuously; no staleness clause | **P2** | `package.json:182` (tilde pin); `scripts/proof-deps-current.mjs:60-65` (FLOORS constant, no ceiling) | dependency-upgrade wave: widen to `~3.13.0`; advance floor in `proof:deps-current` |
| taste/layout-quality band (U-K7/U-K11/U-K12/U-K13/U-K17/U-K18/U-K19) is permanently beyond any gate's oracle — visual-lock can detect DRIFT from a baseline but cannot assert the baseline is good; the designer-eye gap is honest, not a gate failure | **P2** (design band, not a gate bug) | `proof-visual-lock.mjs:18-20` (explicit non-authoritative label); `gate-taxonomy.md` (device-dependence postures, no taste axis) | human-only close: layout-refinement wave; K gate additions proxy taste via binary correctness properties AFTER design decisions are made |
