# Lane 29 — The gate-fleet oracle-gap audit

> **Surface.** For each of the 22 VERDICT items: which existing gate *should* have
> caught it and why it didn't — and, sharper, **which gates actively CERTIFIED the
> rejected state green**. Deliver the oracle-gap taxonomy, the T gate doctrine, and
> the S gates T must RETIRE with their features.
>
> **The meta-fact this lane owns (VERDICT header, "Lane 26/29 own this analysis").**
> This demo state passed **85/85** deploy-gating demo-roster gates + the **184**-gate
> node roster + 11×100% critic convergence + every born-RED oracle — and the owner
> rejected it on sight. The gate-blindspot lesson recurred **at scale despite the
> S.A4 re-taxonomy that was built to end it.** The fleet did not merely *miss* the
> defects; for at least **nine** of the 22 items the fleet **enforces the rejected
> state** — its born-RED plant REDs when you do what the owner asked. The
> instruments' bar is not just below the owner's bar; on those nine it points the
> opposite direction.

## Method / evidence base

- Roster enumerated from `package.json` (204 `proof:*` keys) and the two aggregators:
  the **node roster** (`scripts/run-all.mjs` over `proof:library-correctness` ∪
  `proof:demo-correctness` ∪ `proof:hygiene-chain` = **184 distinct proof gates**) and
  the **demo roster** (`scripts/demo-roster.mjs` / `run-demo-roster.mjs`, ~111 refs,
  partitioned `demo-correctness` **BLOCKING (gates deploy)** vs `demo-device-observe`
  **OBSERVE-ONLY** — the "83/85 + 1 observe + 1 named carry" set).
- Each gate's *oracle shape* read from its own source header (the gates document
  their oracle precisely). Citations are `scripts/proof-*.mjs` + the demo source the
  gate pins. Every claim below is a source fact, not a vibe.

---

## Part I — The oracle-gap taxonomy

Five failure classes. Ordered most-damning first. The nine "inverted-oracle" gates
in Class A are the reason 85/85-green produced a wholesale rejection: they are not
blind spots, they are **anti-oracles** — machine-enforced encodings of exactly the
choices the owner reversed.

### Class A — INVERTED ORACLE (the gate enforces the rejected state; the fix REDs it)

The gate's born-RED *plant* is the owner's *ask*. Green here is a certificate that
the rejected feature is present and load-bearing. These must be **retired with their
features**, not "tightened."

| VERDICT | Gate that certified it | The oracle (verbatim intent) | Why it inverts the owner |
|---|---|---|---|
| #12 square panel gone | `proof:square-honest` + `proof:scene-control-dfa` D3 | "(a) COLLAPSED — **NO controls-tab trigger renders** AND no built-in triad tab node is visible … Plant: **restore the triad → (a) REDs** (the lying panel is back)." `controlSurfaceDFA.ts:99` `square: []`. | Owner: "the full controls/keyframes/timeline panel **must return**." The gate's plant is *literally* the owner's fix. Restoring the panel REDs two blocking gates. |
| #8 gesture legends gone | `proof:gesture-manifest` | "a manifest entry **WITHOUT a tell is a hard RED** (the tell requirement bites — surfacing the affordance is mandatory)." Each `tell` = a visible `[data-gesture-tell]` GestureLegend stamp. | Owner: "**remove all elements like this**" (the S.G3 gesture-legend layer, wholesale). The gate *mandates* the on-stage legend it rejects. |
| #15 Gallery button gone | `proof:gesture-manifest` (`easing:gallery`) + `proof:easter-egg` ("the Gallery") | manifest: `tell` = "a **VISIBLE gallery-door BUTTON** (the tell IS the touch target)"; easter-egg: dblclick the curve tours the catalogue. | Owner: "**remove this button**." The gate requires the button to exist and paint. |
| #2 home typing card gone | `proof:design-refinement` S1 + `proof:typing-dots` + `proof:dogfood-hero` | S1: "the live-source quadrant card **TYPES its own @keyframes block** in Fira Code (red caret) → format.ts serializes it back." Born-RED until the card exists. | Owner: "**remove this crap**" (the kf-source-egg card). The gate is born-RED *until* the rejected card ships. |
| #13 easing telemetry gone | `proof:design-refinement` S5 | S5: "drag-bend **SMEARS the trace** proportional to per-frame velocity … a once-on-enter graticule + self-drawing trace." | Owner: "**Remove all of this**" (peak velocity / overshoot / anticipation telemetry). The gate mandates the instrument-egg the owner calls noise. |
| #3 hero per-CHAR, lower | `proof:demo-usability` clause 2 | "splits its title into **per-word inline-block spans** … assert the measured gap between adjacent **title word** boxes > 0." | Owner: "the word-granular F.W16 split **REJECTED; per-CHAR uplift wanted**." The gate certifies (and requires) the per-**word** split. |
| #3 hero overlaps cube OK | `proof:appearance-suffusion` clause (c) | "(c) the 390×844 **hero/subject overlap == 0px** … hero h1 rect ∩ cube subject rect AREA == 0." | Owner: "it's **OK if it sits a bit on top of the cube**" (and should be lower/centred). The gate forbids the overlap the owner permits. |
| #3 hero jammed at top | `proof:hero-rung` | "computed `font-size ≥ 140px` at 1440×900 (the mega rung resolves 177px)." | Owner: hero "jammed at top overlapping the dock." A 177px poster `<h1>` at rung-top is *what the gate demands*; nothing gates vertical placement or per-char motion. |
| #16 easing sidebar redesign | `proof:easing-sidebar-minimal` / `-normalized` / `proof:easing-stage-is-ball` / `-canvas-bounded` | pins the exact current sidebar shape (strip value input, grow duration, "the stage is ONE ball, no second canvas"). | Owner: "**Most of this page looks awful and needs to be re-designed** … I don't like this latent red theme." The gates freeze the awful sidebar as correct. |

The tell: on all nine, `--update-baseline`-style green is **structurally incapable**
of agreeing with the owner. The S.G "honest-collapse" and "gesture-census" waves
built born-RED oracles for *deletions and eggs the owner never wanted* — the gate
authored the taste error and then defended it.

### Class B — EXISTENCE, NOT QUALITY (the node/pixel exists ⇒ green; legibility/fullness/beauty un-asserted)

The oracle asserts *a thing paints / a value mutates*; the owner's complaint is that
what paints is **blurry / partial / broken**. A defect can satisfy "non-zero bbox"
or "≥3 distinct values" while being visually dead.

| VERDICT | Gate that certified it | The oracle | The gap |
|---|---|---|---|
| #4 docks "blur-blob" | `proof:icon-paint-live` (a) | "a **PAINTING inline `<svg>` with a non-zero bounding box**." | A blur-filtered/janky icon still has a non-zero box. Existence ≠ **legibility**. No edge-sharpness / no-filter-over-glyph oracle exists. |
| #1 cube "one face" | `proof:subject-animates` / `proof:orbital-rotate3d` / `proof:live-session` B1 | "≥3 **distinct** interpolated transforms" / "≥3 distinct `.cube/.graph` transforms." | A single die-face that *tilts* satisfies "transform changes." No oracle asserts **all six faces render** / the cube is whole. `subject-animates`' own header warns the transform selectors "move independently of the play write" — the same blind spot re-bit at the *geometry* level. |
| #21 morph "bare grid" | `proof:morph-scene` (`morph-renders`) | "the rendered path `d` (i) CHANGES (≥3 distinct states) AND (ii) at mid-window is DISTINCT from both endpoint shapes." | A `d`-attr mutating on an **invisible / off-viewport / grid-occluded** `<path>` passes. The oracle reads the attribute, never asserts the shape is **visibly rendered in the stage** over the grid. |
| #19 "performance god awful" | `proof:perf-frame-budget`, `proof:scene-perf-budget`, `proof:scene-transition-perf`, `proof:portable-perf` | budgets measured on **cube/easing/amiga** representatives, thresholds bound **post-fix** as the golden; `perf-frame-budget` **rides OBSERVE-ONLY** (demo-roster bucket 2 — "device-dependent → rides OBSERVE"). | Perf is gated on 2–3 scenes/interactions, not "every page," and the one whole-frame gate is **non-blocking**. A sitewide "god awful" cannot red a deploy. |

### Class C — SOURCE-SHAPE / SELF-BASELINE (the oracle is text or a self-captured golden — it locks whatever shipped)

The single broadest structural lever, `proof:visual-lock`, is **self-baselined and
subject-masked** — it certifies "no drift from the captured (rejected) state" and
**masks every live subject out of the diff**.

- `proof:visual-lock` (own header): "a green here means 'the render has **not
  DRIFTED** from the committed baseline' — it can **never** mean 'the appearance is
  CORRECT' (correctness authority **STRIPPED**)." And it **MASKS** "the amiga sphere,
  the CSS-3D cube, the engine balls, the typing dots" — i.e. the exact subjects of
  items #1, #4, #9, #21 are **painted flat pink before the diff**. The one appearance
  tripwire is blind to every rendering defect the owner cited, and locks the rejected
  layout as its golden.
- `proof:styling-idioms` — self-reduced to a "born-GREEN **regression guard**"
  (resolve-or-red over CSS class names). Cannot see items #18/#27 ("why aren't these
  just glass-ui components?") — a class that *resolves* to a local rule is green; the
  owner's ask is that the rule *shouldn't exist* (use glass-ui).
- `proof:glass-and-cartoon` — an **α ≤ 0.55 opacity number**. Item #4 ("blurry broken
  janky") is not an opacity value.
- `proof:demo-fonts` / `proof:font-census` — a font-family **census** (the font
  *resolves*). Items #3/#16/#24 ("fonts wrong," "italic system-ish sub-header,"
  "dropdowns mostly wrong") are about the font being the **right** register — a
  census can't see wrong-but-resolving.

### Class D — NEVER GATED (no oracle exists for the surface)

Superfluity, chrome-correctness, and taste-of-presence are **definitionally
outside** the fleet — no gate can assert "this element should not exist."

| VERDICT | Surface | Why no gate |
|---|---|---|
| #5 | cube `rx/ry/rz` readout "Remove" | No "no-superfluous-telemetry" oracle. |
| #7 | controls surrounding pane "remove the wrapper" | No "no-redundant-wrapper" oracle; `proof:stage-glass-card` *requires* a card. |
| #6 | ghost/duplicated "Clear all & reload" tooltip; the home divider; play-button-first ordering | No tooltip-dedup / dock-element-order / no-divider-on-home oracle. |
| #11 | square caption block "superfluous nonsense" | The caption is *required* by `proof:square-honest` (b) (the `.square-live-caption` mono caption). Inverted **and** superfluous. |
| #22 | the cursor light "strange, partial" | Never gated at all. |
| #23 | compose/morph/motion-path "likely need to just be pruned" | `proof:compose-scene`/`proof:morph-scene`/`proof:motion-path-*` gate that they *work*; **no gate can decide a working feature shouldn't exist** — a product/taste call. |

### Class E — TASTE-BOUNDARY BUILT BUT NOT INVOKED (the meta-gap that dwarfs the rest)

The fleet **contains the exact protocol built to prevent this outcome** — and it was
**silently skipped for the entire S tranche**.

- `proof:taste-packet` (own header): "It does **NOT** verdict the design. The verdict
  on the packet is the **user's** — a named USER-DOMAIN step scheduled **BEFORE** the
  close … the **J.W7c failure mode: agents PASS while the user says 'awful'**." The
  gate proves only that the *generator* works and "produces **no committed
  artifact**." **Nothing in the 204-gate fleet asserts that an owner verdict was ever
  RECORDED.**
- **The smoking gun.** Tranche **K** exercised the boundary: `docs/tranches/K/
  TASTE-VERDICT.md` exists — a dated, recorded owner verdict ("The verdict is the
  user's … scheduled BEFORE the K close"), with the packet presented 2026-06-16.
  Tranche **S has no such file** (`docs/tranches/S/*VERDICT*` → *no matches*;
  `docs/frontend-design/taste-packets/` holds only `l-w11`). **S closed all-green
  without ever generating a packet or recording an owner verdict.** The owner's
  verdict (this `VERDICT.md`) arrived **after** the green close, as a rejection,
  instead of **before** it, as a gate.
- `proof:gate-is-runtime` — the meta-gate that *should* have caught this — enforces
  only that a correctness gate "opens a browser + actuates the product" with "an
  ERROR BUDGET OF ZERO across the human's interaction battery." Its own precept:
  "the product property a human would **CHECK**." There is no "a human would **LIKE**"
  in its universe. The oracle-quality meta-gate is, by construction, taste-blind.

This is the whole answer to "how did 85/85 get rejected on sight": **the fleet's
appearance-and-taste authority was routed to a USER-DOMAIN checkpoint that was never
a blocking born-OWNER gate, so it was dropped, while 184+85 correctness/hygiene gates
went green over a demo no human ever blessed.** MEMORY already recorded this exact
shape twice (S.E scene-stage "critic consensus ≠ owner verdict, put the owner review
inside the design loop"; K's J.W7c "agents PASS while user says awful") — and S built
the packet generator but never wired the verdict into the gate that blocks close.

---

## Part II — The 22-item oracle-gap map (one line each)

| # | Item | Should-have-caught / actually-certified | Class |
|---|---|---|---|
| 1 | cube one face | *certified* by `subject-animates`/`orbital-rotate3d`/`live-session` B1; masked by `visual-lock` | B, C |
| 2 | home typing card | *mandated* by `design-refinement` S1 + `typing-dots` + `dogfood-hero` | A |
| 3 | hero broken/word-split/high | *mandated* by `demo-usability`(2) per-word, `hero-rung` 177px, `appearance-suffusion`(c) zero-overlap | A |
| 4 | docks blurry/blob | `icon-paint-live` (bbox≠legible); `glass-and-cartoon` (α number) | B, C |
| 5 | cube rx/ry/rz readout | never gated | D |
| 6 | ghost tooltip / divider / order | never gated | D |
| 7 | superfluous controls pane | never gated; `stage-glass-card` requires a card | D |
| 8 | amiga gesture legend | *mandated* by `gesture-manifest` (tell = hard-RED-if-absent) | A |
| 9 | amiga no interleave/stack | `amiga-decay-visible`/`subject-animates` assert motion, not correct stacking | B |
| 10 | dock elision context | see #17 | — |
| 11 | square caption noise | *required* by `square-honest`(b) | A, D |
| 12 | square panel removed | *enforced* by `square-honest`+`scene-control-dfa` D3 (`square:[]`) | A |
| 13 | easing telemetry | *mandated* by `design-refinement` S5 | A |
| 14 | easing = just balls | `easing-stage-is-ball` gets the ball-intent but locks the surround | A/partial |
| 15 | Gallery button | *mandated* by `gesture-manifest`(gallery)+`easter-egg` | A |
| 16 | easing page awful / red theme | *frozen* by `easing-sidebar-minimal`/`-normalized`/`easing-canvas-bounded`; taste never verdicted | A, E |
| 17 | single-option dock dup | `no-single-option-select` too narrow (guards `<Select>` count, not the dup **dock label**) | B/partial |
| 18 | KfPillTabs not glass-ui | `styling-idioms` resolve-or-red can't see "should be glass-ui"; no anti-bespoke-component oracle | C |
| 19 | perf god awful everywhere | perf gates measure 2–3 reps post-fix; `perf-frame-budget` **OBSERVE-only** | B |
| 20 | motion-path barely works | `motion-path-editable`/`-copy`/`-scale` assert edit affordances exist, not that it *feels* right | B |
| 21 | morph bare grid | `morph-scene` reads `d`-attr mutation, not visible shape | B |
| 22 | cursor light partial | never gated | D |
| 23 | compose remove | `compose-scene` certifies it *works*; no "should-exist" oracle | D |
| 24 | fonts sitewide | `demo-fonts`/`font-census` census resolves ≠ right register | C |
| 25 | panel facility forgotten | `scene-control-dfa` **certifies** the empty sets that removed the panels | A |
| 26 | demo structure | `demo-no-oversize`/`scene-colocated`/`app-is-shell` gate ≤500L/colocation, not "re-structured from first principles" | C |
| 27 | glass-ui leverage/gaps | `glassui-aria-ask`/`glass-and-cartoon` narrow; no glass-ui-first coverage oracle | C |
| 28 | refactor litany | `idioms`/`brittleness`/`no-brittle-selector`/`workaround-deletion` — source-shape, real but orthogonal to the owner's live rejection | C |

**Score:** 9 items *actively enforced* (Class A), 5 *certified-by-existence* (B), 6
*locked-by-self-baseline* (C), 6 *never gated* (D), and the whole set *un-verdicted*
by the taste boundary (E). **Zero** of the 22 was catchable by any gate that ran.

---

## Part III — The T gate doctrine (what live/appearance/taste oracles must look like)

The S.A4 re-taxonomy fixed the **tier** question (hygiene vs correctness, source vs
runtime — `gate-is-runtime` enforces it well). It never touched the **authority**
question: *who blesses appearance and taste, and is that blessing a blocking gate?*
T's doctrine adds three oracle species the fleet has never had.

1. **BORN-OWNER gates (revive + harden K's TASTE-VERDICT as blocking).** An
   appearance/taste wave cannot close green without a **committed, non-empty owner
   verdict artifact** for that wave. `proof:taste-packet` proves the generator; T adds
   `proof:owner-verdict-recorded` that REDs unless every appearance wave in the
   tranche has a committed packet **with the verdict slot FILLED** (K had it, S didn't).
   The owner review moves **inside** the loop, before close — not after, as a
   rejection. This is the single highest-leverage T gate; everything else is
   downstream of it.

2. **OWNER-GOLDEN reference oracles (not self-baselines).** `visual-lock`'s baseline
   must be captured from an **owner-blessed reference render**, and the subject must
   **not** be fully masked: a *perceptual* oracle (SSIM / perceptual-hash against the
   owner reference frame under PRM) that would fire on the one-face cube, the bare-grid
   morph, the blur-blob icon. "No drift from the golden" is only meaningful when the
   golden is **owner-approved**, not self-captured.

3. **LEGIBILITY / FULLNESS / NEGATIVE-SPACE oracles (quality over existence).**
   - *Icon legibility*: no blur filter over a glyph, edge-energy above a floor — not
     "non-zero bbox."
   - *Subject fullness*: cube renders all faces; morph renders a visible filled shape
     over the grid in-viewport — a rendered-region assertion, not an attribute read.
   - *Negative-space / owner-sanctioned inventory*: the **inverse of the DFA**. Instead
     of "the control set equals the table," assert "the on-stage element set equals the
     **owner-sanctioned manifest**" — extra chrome (readouts, captions, panes, legends,
     gallery buttons, cursor lights) *not* in the manifest REDs. This is the gate that
     would have caught #5/#6/#7/#11/#22 — the entire "never gated" class — and it
     structurally replaces `gesture-manifest`'s inverted tell-mandate.
   - *Whole-roster perf*: every routed scene × its primary interaction under a **named
     low-end device profile**, INP + long-task budget, **blocking** (not OBSERVE) —
     bound from an owner-acceptable target, not post-fix as the golden.

**The doctrine in one line:** T gates must be **owner-anchored** (golden and verdict
come from the owner, not from the tree-as-shipped) and **quality-shaped** (legibility,
fullness, and sanctioned-inventory — not existence and non-drift). A gate whose green
can coexist with "reject on sight" is a hygiene gate mislabelled as a bar.

---

## Part IV — S gates T must RETIRE with their features

These gates **encode owner-rejected choices**. They cannot be "fixed"; they die when
the feature dies, or they invert the owner. Retiring them is a T deliverable, and each
retirement is itself a falsifiable step (the gate key is gone; `proof:ci-coverage`
stays green with it removed from the roster).

- **`proof:square-honest`** — dies with the honest-collapse; **#12** returns the panel.
- **`proof:scene-control-dfa` `square: []` entry** — re-table square into the triad
  scenes (**#12/#25**); the DFA gate survives, the row is rewritten.
- **`proof:gesture-manifest`** (+ `scripts/gesture-manifest.mjs`, the GestureLegend
  layer) — retired wholesale (**#8/#15**); replaced by the owner-sanctioned-inventory
  gate (doctrine §3).
- **`proof:easter-egg`** (the Gallery + all seven eggs) + **`proof:design-refinement`**
  (all nine instrument-eggs, incl. S1 typing card, S5 easing smear) — retired with the
  rejected eggs/telemetry (**#2/#13/#15**). The egg program is the S taste error made
  machine-mandatory; both roster gates go.
- **`proof:easing-sidebar-minimal` / `-normalized` / `easing-stage-is-ball` /
  `easing-canvas-bounded`** — the easing page is being redesigned glass-ui-first
  (**#16**); the *ball-preview intent* survives (**#14**) but these surface-locks die.
- **`proof:hero-rung` / `hero-balance` / `hero-cls`** + **`proof:appearance-suffusion`
  clause (c)** (hero∩cube==0) + **`proof:demo-usability` clause 2** (per-word) —
  re-spec for per-**char** uplift, hero lower/centred, overlap-OK (**#3**).
- **`proof:typing-dots` / `proof:dogfood-hero`** — re-spec with the new hero.
- **`proof:compose-scene`** — retired if compose is pruned (**#23**).
- **`proof:morph-scene` / `proof:motion-path-editable` / `-copy` / `-scale`** — retired
  if morph/motion-path are pruned (**#20/#21/#23**); else re-shaped to a *visible-render*
  oracle (doctrine §3), never an attribute read.
- **`proof:crayon-preserved`** — audit against the redesign (crayon idiom likely dies
  with the "latent red theme," **#16**).

**KEEP but WIDEN:** `proof:no-single-option-select` — the owner (**#17**) still sees the
"∿ Spring │ ∿ Spring" dup because the gate guards the `<Select>` count-guard only, not
the **redundant dock label** (scene-name repeated as the lone control-tab). Widen the
oracle to the dock-label elision, not retire.

**KEEP (orthogonal, still true):** the boundary/surface/library-correctness node roster
(`proof:boundary`, `proof:replay-equality`, `proof:zero-alloc`, the compile/ingest
round-trips) — the engine is not what the owner rejected; that authority stands.

---

## T recommendations

1. **T-GATE-OWNER · Born-owner verdict gate (`proof:owner-verdict-recorded`).**
   *Scope:* a blocking hygiene gate that REDs unless every appearance/taste wave in the
   tranche has a committed taste packet with the verdict slot **FILLED** (revive K's
   `TASTE-VERDICT.md` as the per-tranche artifact; wire it into `proof:ci-coverage` so
   an appearance wave cannot reach close without it). Move the owner review *inside* the
   loop. *Gate shape:* born-RED on the S tree (no S verdict exists); greens only when a
   committed, non-empty owner verdict covers each appearance wave. *Size:* **M**.

2. **T-GATE-GOLDEN · Owner-anchored perceptual reference oracle.** *Scope:* replace
   `visual-lock`'s self-baseline + full-subject mask with an **owner-blessed reference
   render** and a perceptual (SSIM/pHash under PRM) diff that keeps the subject *in* the
   comparison. *Gate shape:* born-RED on the one-face cube / bare-grid morph / blur-blob
   icon against the owner reference; green only at fidelity to the blessed frame.
   *Size:* **L**.

3. **T-GATE-INVENTORY · Owner-sanctioned on-stage element manifest (negative-space
   gate).** *Scope:* per scene, the rendered on-stage element set == an
   owner-sanctioned manifest; superfluous chrome (readouts, captions, wrapper panes,
   legends, gallery buttons, cursor lights) not in the manifest REDs. Structurally
   replaces the inverted `gesture-manifest` tell-mandate. *Gate shape:* born-RED on the
   current tree (the #5/#6/#7/#11/#22 elements are un-manifested); green only after the
   prune. *Size:* **M**.

4. **T-GATE-LEGIBLE · Legibility + fullness oracles over existence.** *Scope:* icon
   no-blur/edge-energy floor (retires the bbox-only `icon-paint-live` (a)); "subject
   renders fully" for cube faces + morph visible shape; both replace ≥3-distinct-value /
   non-zero-bbox proxies. *Gate shape:* born-RED on the blurred dock icon + partial cube;
   green on the whole render. *Size:* **M**.

5. **T-GATE-PERF · Whole-roster, low-end, blocking perf.** *Scope:* every routed scene ×
   its primary interaction under a named low-end profile; INP + long-task budget bound
   from an owner-acceptable target; **blocking** (retire the OBSERVE-only demotion of
   `perf-frame-budget`). *Gate shape:* born-RED on the "god awful" sitewide state; green
   only within budget across all scenes. *Size:* **L**.

6. **T-GATE-RETIRE · Feature-coupled gate retirement pass.** *Scope:* delete the Part-IV
   inverted/feature-dead gates (`square-honest`, `gesture-manifest`, `easter-egg`,
   `design-refinement`, the easing surface-locks, the hero-rung trio,
   `appearance-suffusion`(c), `demo-usability`(2), `crayon-preserved`, and the pruned-
   scene gates) as the features are removed/redesigned; widen `no-single-option-select`
   to the dock-label dup. *Gate shape:* the gate keys are gone AND `proof:ci-coverage`
   stays green with them removed (no dangling CI reference). *Size:* **M**.

7. **T-GATE-META · Taste-authority axis in the meta-gate.** *Scope:* extend
   `proof:gate-is-runtime`'s tier taxonomy with an explicit **authority** axis so every
   appearance-touching gate must declare whether its verdict is instrument (correctness)
   or owner (taste), and no instrument gate may stand as the appearance bar. Encodes the
   MEMORY lesson ("critic consensus ≠ owner verdict") as a machine fact. *Gate shape:*
   born-RED if any appearance-region gate lacks an authority declaration or claims taste
   authority. *Size:* **S**.
