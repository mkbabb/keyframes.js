# U.G — THE DESIGN CODEX

> **Status: DEVELOPMENT. Implementation NOT authorized.** Docs-only wave specs.
> **DESIGN LANE** — authored under the frontend-design skill per the edict's
> orchestration spec (charter §5: "Fable: … ALL design (with frontend-design)").
>
> **Charter sentence (U.md §2).** DESIGN.md promoted from 28-line stub to THE
> authoritative design-language spec (spec-first, gates-derive); the
> component-module skeleton + API grammar ratified (props/emits/slots/context —
> ONE grammar each), RECONCILED with the glass-ui post-BH audit
> (`audit/glassui-idioms-post-bh.md`); the 3D scenes (cube/amiga) get the idiomatic
> instrument register — OD-U9 RULED, designed ONE direction (owner-reviewed mocks), no
> both-ways fork; the golden authority completed (sequence-{light,dark} born-OWNER;
> idle-state pinned in the capture protocol); the Vue idiom rulings R1–R7 ratified as
> standing law.
>
> **Provenance lanes:** 24 (design-restructure-system — the four-grammar props
> census, the emit/name drift, the §9 house component-module skeleton + §9.2
> placement rule + §9.3 API grammar + §10 gate posture, the timeline recut §9.4),
> 25 (design-demo-coherence — F1 the codex, F2 the two scene genres, F3 the golden
> gaps, F4 the affordance grammar, F5 token homes, F6 design-prose legacy, F7 the
> material register), 26 (design-colocation-idiom-vue — the ruling set R1–R7 with
> rationale + gate shapes; the DEFERRED-map, chunk-graph, and vestigial-path
> findings whose LAW this band ratifies and whose EXECUTION U.A/U.B/U.D own).
>
> **Ring-fences that bind this band (charter §4).** (3) **The owner-golden
> mechanism SURVIVES the apparatus dissolution** — this band is its authority-side
> completion: U.A4 retires the 77 line-anchored appearance gates INTO owner-golden,
> and U.A's own risk register rules A4 **HARD-GATED on U.G** (U.A.md:493–495 — "if
> U.G slips, the 77-gate retirement has no re-arm target"). (4) DEVELOPMENT ONLY —
> every "design" here is a spec + candidate renders through the review loop; no
> source edits. **The anti-sprawl covenant (U.md §6):** U.G authors **ZERO** new
> standalone gates — every enforcement shape it ratifies lands as a clause on a
> surviving gate (U.B12) or inside a wave another band already charters (U.D's
> `proof:publish` reachability clause — OD-U11 dropped the standalone
> `proof:chunk-graph`). **The T lesson (MEMORY, S.E scene-stage):** critic
> consensus ≠ owner verdict — the owner review sits INSIDE the design loop; OD-U9
> is RULED (instrument the 3D scenes), so U.G designs the ONE ruled direction to
> owner-review completeness (mocks reviewed against renders, never self-blessed).

---

## The load-bearing conclusion (why this band exists)

The demo's design system is disciplined at the token level and lawless one level
up — verified on the live tree (`tranche-u-dev`, 5.2.0):

1. **The design language has no home** (lane 25 F1, verified). `demo/DESIGN.md`
   is a **27-line pre-S stub** (measured) that never names the violet accent
   authority defining the product's identity (`--accent-kf` oklch family +
   light-dark arm-swap, style.css:122–137, verified in-tree), still frames
   migration as "Minimal — already well-aligned," and lists two utility families.
   The ACTUAL language — red-destructive-only (style.css:115–119, verified),
   the rainbow signal family, the two-register card rule, the specimen grammar,
   the φ dock geometry, the z-contract, the mono-as-data census — lives in CSS
   comments, `font-roles.json`, and gate scripts. Under NO-LEGACY this is the one
   legacy artifact on the design axis: a stale spec beside a living system. And it
   is about to become load-bearing: U.A4 retires the appearance-gate genre into
   owner-golden — after which the SPEC is the only place the design rationale can
   live. Spec-first, gates-derive, or the retirement orphans the rationale.

2. **The component API is grammatically incoherent** (lane 24 §§3–8, spot-verified).
   Four prop-declaration grammars; two emit-declaration styles × three event-name
   grammars; hand-rolled `update:modelValue` emits beside `defineModel` users
   (KfPillTabs.vue:67 verified — while 6 files use `defineModel`); **zero
   `defineSlots` in the entire demo** (grep, verified 0); a "skeleton tier" of
   exactly one component in a forbidden kind-bin; the largest SFC
   (SpringTarget.vue, 471L verified) holding a ~200L inline style block
   (`<style scoped>` at :272, verified) while smaller siblings split. Lane 24 §9
   defines the ONE skeleton + placement rule + API grammar; it needs RATIFICATION
   so U.B's moves cut to it (U.B's own intro: "U.G ratifies §9/§10 as the codex
   this wave enforces").

3. **The product splits into two unreconciled scene genres, codified as a gate
   exception** (lane 25 F2, verified). Four instrument scenes carry the full
   specimen grammar; cube/amiga carry none — and the asymmetry is *enforced* as an
   exception, not designed as a rule: `proof-appearance-suffusion.mjs` clause (b)
   asserts "the amiga stage carries NO display title (the binding headerless
   exception)" (verified at :31–34 in the header spec). The same gate's clause (a)
   still specifies "motion-path traveller → --rainbow-cyan" (verified) for a scene
   PRUNED at T.E1/T.E3. A design decision expressible only as a gate exception
   dies here — **OD-U9 RULED it (2026-07-10): "ratify those 3d scenes getting
   idiomatic instrumentation."** The asymmetry is resolved ONE way — cube + amiga GET
   the idiomatic instrument register; U.G designs that single direction to
   owner-review completeness, no both-ways fork.

4. **The blessed appearance authority is incomplete and state-inconsistent**
   (lane 25 F3, verified). `goldens/golden/` holds exactly **12** files — no
   `sequence-*` (ls, verified): the one shipping scene with no oracle. The capture
   protocol pins PRM + colorScheme + 1440×900 (goldens/README.md:13–14, verified)
   but says NOTHING about the controls-pane idle fade
   (`--controls-idle-opacity: 0.35`, layout.css:41 verified; `IDLE_MS` in
   `transport/composables/usePaneHover.ts`) — so the reference set pins two
   different chrome states across scenes. U.A4's genre retirement makes
   owner-golden THE appearance oracle; an incomplete, ambiguous authority cannot
   carry that weight.

5. **The healthiest idioms are folklore** (lane 26 §1.5/§3, verified). The
   scoped-vs-utility settlement (`@apply` only in the idiom sheet, zero
   `@reference`), the barrel discipline, the test mirror, the async-seam
   placement — all enacted, none stated. Lane 26's R1–R7 are the ruling set;
   the DEFERRED tolerance map they must kill is live (proof-colocation.mjs:69–96,
   verified — three entries incl. one already-cured dead row, all citing T waves
   that never landed). Law ratified here; execution owned by U.A/U.B/U.D/U.H.

---

## Wave index

| id | title | size | gate / oracle (no new standalone gates — U.A is deleting genres) | lanes |
|---|---|---|---|---|
| **U.G1** | **THE CODEX: DESIGN.md 27L stub → the authoritative design-language spec** (voices, color authorities incl. the NEW material register, card registers, specimen grammar, idiom catalog, φ geometry, z-contract, token-home partition, prose-purge map) · KEYSTONE | L | the codex file replaces the stub (docs deliverable, owner-observable) + a one-shot cross-ref witness: every surviving design-gate clause cites a codex § anchor | 25 F1/F5/F6/F7 |
| **U.G2** | The component-module skeleton + API grammar RATIFIED (lane 24 §9.1–9.3 + §10 as a codex chapter; the split-threshold reconciled to ONE number) | M | the codex chapter is the authority U.B12's gate-clause extensions DERIVE from (clauses on existing gates — net gate count flat); vitest/AST one-pass shapes only | 24 §9/§10; 26 R3 |
| **U.G3** | The 3D-scene instrument register designed ONE direction (OD-U9 RULED — cube + amiga GET idiomatic instrumentation; owner-reviewed mocks, no both-ways fork) + the ONE stage-legend affordance grammar | M | OD-U9 recorded RULED in OWNER-DECISIONS.md; the register lands as codex ch. 8; candidate renders through the goldens candidate flow (NEVER self-blessed) | 25 F2/F4 |
| **U.G4** | The golden authority COMPLETION: sequence-{light,dark} born-OWNER + the idle-state pin in the capture protocol + re-bless the deviating frames | M | `proof:owner-golden` (SURVIVES — fence 3) green on BLESSED.json 12→14 with ONE pinned pane state; **U.A4's re-arm target** (A4 HARD-GATED here) | 25 F3 |
| **U.G5** | The Vue idiom rulings R1–R7 ratified as STANDING LAW (demo/CLAUDE.md law section + codex chapter; each ruling = rationale + named gate shape + owning wave) | M | the law section exists; every ruling names the surviving gate/clause and the U.A/U.B/U.D/U.H wave that lands it; OD-U7 ruling recorded for R5 | 26 §3 R1–R7 |

**Sequencing (band-internal DAG; charter §3 "codex early — B's moves cite it;
scene-genre + goldens mid").**

```
U.G1 (codex)  ── DAY 1 ──┬── U.G2 (skeleton+grammar chapter) ── BEFORE U.B's first move
                          ├── U.G5 (R1–R7 law chapter)        ── BEFORE U.B/U.A gate re-arms
                          └── U.G3 (3D-scene instrument register — ONE direction, OD-U9 RULED)
                                        │
                              U.G4 (goldens: sequence pair + idle pin + re-bless)
                                        │      ── AFTER the OD-U9 register mocks (ONE blessing pass)
                              U.A4 (the 77-gate retirement) ── HARD-GATED on U.G4
```

Keystones: **G1/G2/G5 land day 1** — U.B's transposition waves cite the codex and
cut to the skeleton; a move executed before its law is a move executed twice.
**G4 after G3** — the OD-U9 instrument register changes cube/amiga's appearance, so
their goldens re-bless ONCE with the register in place, never twice. **U.A4 waits on
G4** — the
appearance-genre retirement has no re-arm target until the golden authority is
complete and unambiguous (U.A's own risk register, U.A.md:493–495).

---

## The waves

### U.G1 — THE CODEX: DESIGN.md promoted to the authoritative design-language spec · **KEYSTONE**

- **Substance (lane 25 F1).** Rewrite `demo/DESIGN.md` (27 lines, verified — a
  pre-S stub extending glass-ui's DESIGN.md, naming Instrument Serif/Fira Code/
  axis colors/`--accent-red`/two utility families, closing "Minimal — already
  well-aligned") into THE spec. The codex STATES what today is only enacted;
  gates and comments CITE it. Chapters:
  1. **The voices** — display: Instrument Serif at its honest 400
     (style.css:42–68 + the `@layer demo-typography` rung override), the
     sanctioned display sites (the four Target headers, square's "drag me," the
     hero family — per font-roles.json roles); body: the Jakarta register incl.
     the documented mobile dock-label rung step (style.css:286–294); mono-as-data
     (`font-roles.json` `_monoContract` — tabular-nums readouts, never chrome).
  2. **The color authorities** — THE VIOLET ACCENT AUTHORITY (`--accent-kf`
     oklch family, light-dark arm-swap "iris-periwinkle in light, orchid in
     dark," style.css:122–137, verified) and its consumption law
     (`--color-progress` = the ONE motion color); red-is-destructive-ONLY
     (style.css:115–119, verified); the rainbow signal family + the
     never-a-new-literal mixing law (design-idioms.css:9–28; the sequence rows'
     `color-mix` bridge stop as the exemplar); gold-sparkle; the six crayons
     (pinned hues); **and the NEW MATERIAL REGISTER (lane 25 F7)** — a
     `--specular`/`--shade` token pair (foreground/background-mixed or literal,
     stated by ruling in the chapter) consumed by the cube face sheen/shade
     gradients (CubeTarget.css:115–133, today the system's only surviving raw
     rgba literals) and the sequence playhead cap (SequencePlayhead.vue:62–63) —
     "crayons are pinned; lighting is material" becomes stated law and the last
     raw-literal class gains a vocabulary.
  3. **The two-register card rule** — control panels `Card surface="cartoon"
     tier="quiet"`; stage plates glass `tier="resting"` `:shadow="false"` (lane
     25 §1 verified the rule holds everywhere; today it is stated only in
     per-file comments like SpringTarget.vue:2–9 — the codex states it once).
  4. **The specimen-card grammar** — serif title rung + mono `tabular-nums`
     live readout + `.status-badge` tri-state + hint line: the instrument
     identity, stated nowhere today, enacted on all four instrument scenes.
  5. **Substrate + geometry + depth** — the graph-paper stage-field idiom, the
     φ-derived dock geometry (layout.css:56–136), the z-order contract
     (style.css:18–40 + the `--z-behind` reconciliation).
  6. **The idiom catalog** — rail/ball/badge/field family
     (design-idioms.css:128–239), `tab-trigger-*`, `btn-playback*`, each with
     its file home and its glass-ui-upstream disposition (the stub's two
     migration rows survive as codex rows).
  7. **The token-home partition BY CONCERN (lane 25 F5).** The rule: signal/
     appearance tokens live in `design-idioms.css`; length/ratio/viewport
     geometry in `layout.css`. The codex charters the four strays' moves —
     `--graph-opacity`/`--graph-major-opacity`/`--controls-idle-opacity`
     (appearance, marooned in layout.css:34–41, verified :41) OUT of layout;
     `--rail-width`/`--panel-max-h`/`--mask-fade` (geometry, parked in
     design-idioms.css:40–52 because "proof:idioms anchors these" — the gate
     anchor dictating the home) OUT of the idiom sheet — and corrects the two
     stale home-pointers (usePaneHover.ts:22–24, EditorShell.vue:229–231). The
     move + any surviving gate re-anchor EXECUTE in U.B's styles pass (edge);
     the codex states the rule the move follows. Cascade-order-neutral (both
     sheets import before `@custom-variant`, style.css:14–15).
  8. **The scene-genre rule** — a placeholder filled by U.G3's OD-U9 ruling
     (the chapter exists day 1 so the fork has a landing site; the ruling
     arrives in-tranche — an owner decision inside the loop, NOT a deferral;
     it dies at U.Z if unruled).
  9. **The component-module skeleton + API grammar** — U.G2's chapter.
  10. **The Vue idiom law (R1–R7)** — U.G5's chapter (cross-ref;
      demo/CLAUDE.md carries the law's enforcement-facing copy).
- **Substance — the design-prose purge MAP (lane 25 F6).** The codex chapter
  ends with the re-point map: the five "red motion-authority" comments
  (SquareInstrument.vue:6, :144; SquareScene.css:70, :79, :100 — values correct,
  prose legacy), font-roles.json's "all 7 scenes" census note (six ship), and
  `proof-appearance-suffusion.mjs`'s motion-path clause (verified live at
  clause (a) — a pruned scene still specified) → each re-pointed at the codex
  section that now owns the rationale (**comments cite, the codex states**).
  EXECUTION rides U.B's file-touching moves + U.E's doc-currency sweep — this
  wave authors the map so no purge pass hunts.
- **Spec-first, gates-derive (the architectural transposition).** Today the
  gates pin facts whose rationale is unrecoverable without archaeology; the
  codex inverts it. Post-U.A4, most appearance gates are RETIRED into
  owner-golden — the codex is then what the owner-golden review reads AGAINST
  (the retired gates' clause tables — suffusion's hue oracle, the crayon pins,
  the font census rationale — transfer INTO codex sections as stated law,
  verified by taste + the goldens, not by greps). The surviving structural
  design gates (`proof:styling-idioms`, `proof:colocation`'s design clauses)
  anchor their clauses to codex § anchors the way font-roles.json already
  half-does.
- **Size.** L. **Deliverable = the codex** (docs; owner-observable). **DAY 1.**
- **Oracle.** The codex file replaces the stub, complete against the ten
  chapters; a ONE-SHOT cross-ref witness at U.Z: every design-gate clause that
  survives U.A's roster adjudication cites a codex § anchor (a grep-once
  verification, not a standing gate — net gate count unchanged).
- **Edges.** → **U.B** (every B move-wave cites the codex; charter §3 "codex
  early"), → **U.A4** (the retirement's rationale home — the genre dissolves
  INTO owner-golden + codex), ↔ **U.E** (the prose-purge map's execution is
  U.E's doc-currency slice), ← **U.G2/G3/G5** (fill chapters 8–10), ↔ **U.F6**
  (the glass-ui upstream rows in ch. 6 join the consolidated letter's catalog
  asks — one letter, not two).

### U.G2 — The component-module skeleton + API grammar RATIFIED

- **Substance (lane 24 §9.1/9.2/9.3, ratified verbatim as codex chapter 9).**
  - **The shape (§9.1).** `<component-name>/` kebab-case dir = one module:
    entry `<ComponentName>.vue` (PascalCase, drawn from the ratified lexicon);
    `<ComponentName>.css` scoped sibling wired `<style scoped src>` once the
    style block crosses the threshold (below); `<ComponentName>.skeleton.vue`
    MANDATORY iff the module is lazily delivered (async barrel, Suspense child,
    or `loadingComponent` seam), wired by the module's OWN barrel
    (`defineAsyncComponent({ loader, loadingComponent, delay: 150 })`), a11y
    per the SceneSkeleton contract (role=status, aria-busy, PRM static plate —
    SceneSkeleton.vue:28–99, the house skeleton spec); private children with
    satellites recurse as modules; satellite-less children stay flat;
    single-owner `use<Concern>.ts` sits FLAT beside its owner — no
    `composables/` bin inside a component module; `types.ts` carries DECLARED
    contracts (context interfaces explicit — the
    `ReturnType<typeof useSpringDemo>` implicit-API pattern, springKeys.ts:4,
    is banned); `constants.ts`; `index.ts` RE-EXPORT ONLY, zero definitions.
  - **The placement rule (§9.2).** A member lives at the LOWEST directory
    containing all its consumers: one consumer → beside it; shared within a
    module → the module root; shared across siblings → promoted exactly ONE
    level to the nearest-common-ancestor's tier (the only place kind-bins may
    exist, ≥2-consumer members only); shared across areas → the shared tier.
  - **The API grammar (§9.3) — ONE grammar each.** *Props:* reactive
    destructure with inline defaults; getter-fns into composables
    (KfPillTabs.vue:74–79, verified, is the reference — consonant with the
    memory-ratified J·T5 narrowing); `withDefaults` and runtime-object
    `defineProps` are legacy (NO-LEGACY covers grammar). *Models:* every
    `update:*` channel is a `defineModel`; manual `update:*` emits are banned
    (KfPillTabs.vue:67 + TimelineTrack.vue:129 are the named cures — KfPillTabs
    verified emitting `"update:modelValue": [value: string]` by hand while six
    demo files already use `defineModel`). *Emits:* named-tuple declaration
    exclusively; ONE event-name grammar — verb-first camelCase commands
    (`switchScene`, `moveKeyframe`) + past-participle facts (`scrubbed`); the
    noun+`Update` family (`sliderUpdate`, `keyframesUpdate`,
    `layerConfigUpdate`) renames RIDE U.B's import-touching moves (the rename
    is free at that moment, never cheaper later). *Slots:* `defineSlots` on
    every slotted component (demo count today: ZERO, verified — while the
    exotic render-fn projection IS typed, sceneExposedApi.ts:32–35). *Expose:*
    `defineExpose` only against a NAMED interface (the SceneExposedApi
    precedent). *Context:* one delivery grammar per scene — the entry
    `provide()`s under the `<scene>Keys.ts` key; family members `inject()`;
    props reserved for leaf-scoped scalars (the SpringTrace shape). *Lexicon:*
    ONE component vocabulary drawn from the already-won state-layer terms
    (facility / transport / channel / instrument / scene / target / facet);
    the drifted names (`AnimationControlsControls` — a stutter) rename during
    their modules' moves.
  - **The split-threshold RECONCILIATION (lane 24 §6 vs lane 26 R3).** Lane 24
    proposed ~40L; lane 26 R3 rules the mechanical trigger: **style block
    >100L OR SFC >300L → sibling sheet; every demo `.css` ≤300L**. The codex
    states R3's numbers as THE rule (gate-mechanical, measured — SpringTarget's
    verified 471L/200L-block is the first cure) and records lane 24's 40L as
    superseded — ONE number, no contradiction for U.B12's gate extension to
    enforce. Mode-C cross-component skins (`tab-trigger.css`,
    `playback-button.css` — global-cascade vocabulary parked in module dirs)
    NEVER live in a module: design-system tier (`@/styles/design-idioms.css`)
    or the glass-ui upstream ch. 6 names.
  - **The glass-ui post-BH reconciliation (audit §1, OD-U2).** Lane 24 §9 and the
    glass-ui audit (`audit/glassui-idioms-post-bh.md`) CONVERGE — the codex records the
    reconciliation so the shape is HOMOGENEOUS across the constellation, not derived
    twice:
    - **RATIFIED verbatim from glass-ui:** every component a **kebab-case dir** with
      **PascalCase SFCs**, an **`index.ts` barrel** (re-export only), **`constants.ts`**
      (typed constants/enums/pure helpers with **types-through-the-barrel** — SFCs can't
      re-export a type, so unions live in `constants.ts`/the composable and re-export
      from `index.ts`), and a per-component **`composables/useXxx.ts`** for any bound
      hook (glass-ui `easing/composables/`, `drawer/composables/`, `dock/composables/`).
    - **The `composables/` refinement.** This REFINES lane 24 §9.1's flat-single-hook
      preference: a complex component gets a `composables/` dir (the glass-ui idiom); a
      leaf with a single trivial hook may still keep it flat (glass-ui `button/` is
      flat). >~500L renderers carve OUT of the SFC into `composables/` (glass-ui's
      `useFourierField`/`useAurora`/`useMetaballRenderer` precedent), enforced as the
      SFC-line clause.
    - **The CSS convergence, stated HONESTLY (audit §4 vs kf's T-era split).** glass-ui
      is CENTRAL-styles today (a `src/styles/` `@import` cascade; component recipes as
      central `.css` under `@layer components`), with 5.0.0 moving **9** component sheets
      (border-progress, completion-seal, configurator, instrument-chassis, hover-popover,
      drawer, segmented-tabs, select, icon-chip) TOWARD colocation via a GATHER +
      `@import`-rewrite (B2.6); kf's T-era split is ALREADY sibling-css (`<Name>.css`
      beside the SFC). The codex RULES the convergence point BOTH repos are moving to:
      **tokens + cross-component idioms stay CENTRAL** (`@/styles/design-idioms.css` /
      the token partials — glass-ui's `styles/tokens`, `styles/glass`),
      **component-specific recipes COLOCATE** (the sibling `<Name>.css`). Not "glass-ui
      central vs kf colocated" — ONE rule, both repos converging.
- **Gate posture (lane 24 §10 — anti-sprawl-honest).** The chapter is the
  authority U.B12's clause extensions DERIVE from: `proof:colocation` gains
  (a) the inverse-colocate clause (single-owner member inside a shared tier →
  RED), (b) barrel-purity (definitions in index.ts → RED), (c) the skeleton
  clause (lazy barrel without `loadingComponent` → RED);
  `proof:style-file-ceiling` sweeps ALL `demo/**/*.css` + the SFC style-block
  clause; ONE AST grammar clause (no `withDefaults`, no object-literal
  `defineProps`, no manual `update:*`). All clauses on EXISTING gates — net
  gate count flat; U.G authors none of them, U.B12 lands them citing this
  chapter.
- **Size.** M. **DAY 1** (with G1 — U.B's first move cuts to this shape;
  lane 24 §9.4's timeline recut is U.B's reference implementation).
- **Oracle.** The codex chapter exists and is complete against §9.1–9.3 + the
  reconciled threshold; U.B's wave specs cite it (already true — U.B.md:25,
  :553 name U.G as the codex authority); the §10 clauses land in U.B12 with
  this chapter as their cited law.
- **Edges.** → **U.B1..B12** (the enforcement + move waves; B12 is the
  standing-clause wave), → **U.G5** (R-series consonance — R3's numbers are
  THIS chapter's threshold; one statement, two citations), → **U.G1** (chapter
  9 of the codex).

### U.G3 — The 3D-scene instrument register (OD-U9 RULED) + the ONE stage-legend affordance grammar

- **Substance (lane 25 F2 — OD-U9 RULED, designed ONE direction).** The product's
  core identity — *the instrument reads the engine live* — went silent on the
  two most spectacular scenes (amiga's 3-channel additive pose + decay() glide
  exposed today only to a window probe, AmigaScene.vue:184–198; cube floating
  bare on the page grid, the only plate-less scene). The asymmetry survived as
  a gate exception (suffusion clause (b), verified). **OD-U9 RULED (2026-07-10):
  "ratify those 3d scenes getting idiomatic instrumentation"** — so this wave
  designs the ONE ruled direction, NO both-ways fork (the S.E lesson still holds
  — owner review sits INSIDE the loop, but the direction is decided):
  - **THE INSTRUMENT REGISTER (the telemetry whisper).** The square's
    corner-instrument composition (SquareInstrument.vue:168–201, verified:
    absolute top-left serif title + accent readout + settled/tracking badge,
    `pointer-events: none`, `z-index: var(--z-content)` — asymmetric chrome around
    the centred subject) is promoted to a shared idiom — a `.stage-whisper`
    register in design-idioms.css (position anchors, title rung, mono readout rung,
    optional tri-state badge, PRM behavior, pointer transparency) — and applied over
    the full-bleed canvases: **amiga** whispers spin ω + pose y with the verb line
    "drag the ball — release to coast" (the decay() dogfood finally discoverable on
    touch, where `cursor: grab` does not exist); **cube** whispers the active channel
    + a live matrix cell or Euler triple with "drag to orbit." The canvas stays
    full-bleed; the whisper floats — the instrument voice carried into the immersive
    genre WITHOUT a plate. The suffusion "headerless exception" (clause (b)) is
    RETIRED with its genre at U.A4; cube/amiga now speak like the four instrument
    scenes.
  - **The ONE stage-legend affordance grammar (lane 25 F4).** Today four spellings:
    spring's explicit caption, square's progressive-disclosure corner legend, amiga's
    cursor-only, cube's home-only hint. ONE `.stage-legend` idiom (position register,
    caption rung, progressive-disclosure timing, PRM/touch behavior) gives EVERY
    manipulable scene its verb line — the four-grammar mix dies and the 3D scenes
    gain the touch-discoverable affordance the cursor-only hint denied them.
- **The review-loop protocol (the S.E lesson — owner review INSIDE the loop).** The
  register is delivered as a spec + candidate renders captured through the goldens
  **candidates** flow (`goldens/candidates/`, NEVER self-blessed — the born-OWNER
  discipline); the owner reviews the MOCKS against renders, not prose, and refines the
  ONE ruled direction (not a fork pick). The register lands as codex ch. 8; the
  implementation rides U.B8's scene convergence wave as a rider (the whisper components
  are new module-shaped members cut to G2's skeleton).
- **Size.** M. **MID-BAND** (after G1 opens ch. 8; before G4's blessing pass).
- **Oracle.** OD-U9 recorded RULED; codex ch. 8 states the instrument-register rule;
  the candidate renders exist under `candidates/` with PENDING-OWNER status;
  owner-golden re-blessing for cube/amiga flows through G4 (ONE pass, with the register
  in place).
- **Edges.** ↔ **OD-U9** (RULED — instrument the 3D scenes), → **U.G4** (blessing AFTER
  the register mocks), ↔ **U.B8** (the implementation rider), → **U.G1** (ch. 8), ↔
  **U.A4** (the suffusion clause re-cut is subsumed by the genre retirement).

### U.G4 — The golden authority COMPLETION: sequence pair + the idle-state pin + re-bless

- **Substance (lane 25 F3, all three defects verified).**
  1. **Complete the matrix**: add `sequence-{light,dark}` through the
     born-OWNER blessing flow (capture candidates from the landed tree via
     `proof-owner-golden.mjs --capture-candidates`, owner blesses,
     BLESSED.json 12→14 with `blessedCommit`). Sequence — a shipping scene
     carrying substantial T-era design (storyboard containment, rainbow row
     map, phosphor playhead) — is today the ONE scene whose appearance can
     drift with no oracle (goldens/golden/ verified: 12 files, no sequence).
  2. **Pin the pane state in the capture protocol**: the controls rail
     rest-dims to `--controls-idle-opacity: 0.35` after ~10s inactivity
     (layout.css:41 verified; `IDLE_MS` in transport's usePaneHover), and the
     blessed set mixes LIT and rest-dimmed frames across scenes — the
     reference set pins two chrome states, so cross-scene comparison is
     unsound and an idle-fade regression reads "matches the golden" somewhere.
     Amend goldens/README.md's capture protocol with the PANE-STATE PIN —
     idle clock frozen at the canonical **LIT** state (the state the owner
     reviews in) — one clause beside the existing PRM+colorScheme freeze
     (README:13–14 verified); the capture path gains the freeze (a script
     amendment to the SURVIVING owner-golden mechanism, not a new gate).
  3. **Re-capture + re-bless the deviating frames** through the same
     born-OWNER flow, so the 14-frame set means ONE thing.
- **Sequencing.** AFTER U.G3's OD-U9 RULED instrument register: cube/amiga
  change appearance (they gain the whisper), so their frames bless ONCE with the
  protocol amendment — never a bless-then-re-bless double pass. The sequence pair and
  the protocol clause can draft day-1; the blessing EVENT is single and late.
- **Why this wave is load-bearing beyond design.** U.A4 retires the 77
  line-anchored appearance gates INTO `proof:owner-golden` + one behavioral
  smoke — and U.A's risk register rules that retirement HARD-GATED on this
  wave (U.A.md:493–495). An appearance authority with a missing scene and an
  ambiguous chrome state cannot absorb 77 gates' verification duty; after this
  wave it can.
- **Size.** M. **Oracle.** `proof:owner-golden` (SURVIVES — ring-fence 3)
  green over BLESSED.json's 14 entries, every frame captured under the
  amended protocol (PRM + colorScheme + viewport + PANE=LIT), owner-blessed
  with live Hamming 0 (the T.M3 precedent); the protocol clause present in
  goldens/README.md. Net gate count: ZERO new (an authority completion on the
  surviving mechanism).
- **Edges.** → **U.A4** (HARD gate — the retirement's re-arm target),
  → **U.E2** (HARD gate — the `FROZEN_SET` 36 discharge target),
  → **U.G3** (the RULED register sequences the blessing), ↔ **U.B** (the transposition
  preserves appearance — "transposes, never redesigns," U.md §6; the goldens
  are its verification), ↔ **U.Z** (the close's certifying sweep runs on the
  completed authority).

### U.G5 — The Vue idiom rulings R1–R7 ratified as STANDING LAW

- **Substance (lane 26 §3 — the ruling set, ratified with rationale + gate
  shape + owning wave; the law lands in `demo/CLAUDE.md` as ONE section
  replacing folklore, with codex ch. 10 as the design-side statement).**
  - **R1 — Module = directory; barrel = contract; one door.** Explicit-named
    `index.ts` per module; cross-module imports via the barrel; intra-module
    deep-relative; `export *` forbidden (already library law,
    proof:no-flat-siblings clause 4 — now demo law). Library half: cross-zone
    via the sibling's barrel, self-barrel imports banned (cycle by
    construction), `internal/` stays direct-path (C-5 unchanged). *Gate
    shape:* dependency-cruiser rule pair (`no-cross-module-deep`,
    `no-self-barrel`, `no-star-export`) on the EXISTING depcruise run. *Owning
    wave:* U.B9 (barrel adoption) / U.C (library half).
  - **R2 — Laziness lives at the consumer's seam, never in a re-export.**
    Sanctioned async boundaries: scene/router entries, pane-reveal seams,
    heavy-vendor bearers. A barrel never wraps `defineAsyncComponent`. *Gate
    shape:* the **`proof:publish` reachability clause** — **U.D-owned** (born-RED on
    the verified 906KB vendor-highlight leak; OD-U11 DROPPED the standalone
    `proof:chunk-graph` into this clause, so net NEW standalone gates in U = ZERO).
    G5 states the LAW; U.D lands the witness.
  - **R3 — The mechanical SFC/CSS split** (>100L style block OR >300L SFC →
    sibling sheet; every demo `.css` ≤300L) — ONE statement with G2's
    threshold (single source; G2 ch. 9 cites R3). *Gate shape:*
    `proof:style-file-ceiling` extended (U.B12).
  - **R4 — Utilities in templates; scoped CSS is token-plain.** `@apply` only
    under `@/styles/`; `@reference` banned (per-SFC theme-graph import cost);
    scoped blocks consume `var(--…)` + plain CSS. Codifies the tree's
    verified-healthy settlement (11 `@apply`, all in design-idioms.css; zero
    `@reference`). *Gate shape:* one grep clause on `proof:styling-idioms`
    (U.B12).
  - **R5 — Tests MIRROR; they do not colocate** (OD-U7 — an edict carve-out,
    NEEDS the owner ruling). Rationale recorded IN the law so the ruling is
    informed: a test is a CONSUMER of a module's surface, not a private
    satellite; colocation would tax every structural gate with exclusions,
    fork the vitest environment story, and push test-only edges into the HMR
    module graph, for zero published benefit (`files: ["dist"]`). The cure
    owed is symmetry: `test/demo/` regroups to mirror the areas, with the
    import-resolves-into-area integrity clause. *Gate shape:* mirror clause
    folded into `proof:zone-cohesion` (U.H/U.B own execution).
  - **R6 — Shared-tier membership is kind-appropriate, ≥2-consumer, and
    TOLERANCE-FREE.** The `DEFERRED` map (proof-colocation.mjs:69–96, verified
    live: `gestureSelectSuppression`, `kfEngine`, one already-cured dead row —
    all citing never-landed T waves) is the fossilized "honest defer" device
    inside the edict's own keystone gate; it DIES — exceptions change the RULE
    or move the file. *Owning wave:* U.B1 executes the two re-homes + deletes
    the machinery.
  - **R7 — No vestigial path segments.** A directory layer must state a
    contract; `custom/` (the shadcn-era opposition layer, its opponent deleted
    at S.C3b), single-child `components/`, and semantically-empty sibling
    pairs (`transport/{components,controls}`) all fail. *Gate shape:* a
    `no-single-child-dir` clause on `proof:colocation`; *owning wave:* U.B1's
    keystone collapse.
- **The division of authority (why ratification is its own wave).** Lanes 24
  and 26 each derived law from evidence; U.A/U.B/U.D/U.H each execute slices
  of it. Without ONE ratified statement, the same rule would exist in four
  wave specs with drift risk (the exact multi-hand-list defect U charters
  against elsewhere). After G5: the law lives ONCE (demo/CLAUDE.md + codex
  ch. 10); every executing wave and every gate clause CITES it; every future
  wave inherits rules, not archaeology (lane 26 imperative 8).
- **Size.** M. **DAY 1** (with G1/G2 — U.B/U.A's gate re-arms cite the law).
- **Oracle.** The demo/CLAUDE.md law section exists, complete against R1–R7,
  each ruling carrying rationale + named gate shape + owning wave; the OD-U7
  ruling is recorded (R5 executes only on the owner's blessing of the
  carve-out); zero gates authored by this wave.
- **Edges.** → **OD-U7** (R5's carve-out ruling), ↔ **U.B12** (the standing
  clauses), ↔ **U.D** (the `proof:publish` reachability clause = R2's witness, OD-U11), ↔ **U.H** (the mirror =
  R5's execution), ↔ **U.A10** (the anti-sprawl covenant — R-series
  enforcement is clause-shaped by construction), → **U.G1/G2** (consonance:
  ONE threshold, ONE lexicon, ONE law).

---

## Risks + the re-arm map

The stale-era re-arm class is **EXPECTED** (charter §5). U.G authors **ZERO**
new standalone gates; its enforcement shapes land as clauses on surviving gates
(U.B12) or inside U.D's `proof:publish` reachability clause (OD-U11 — no standalone
`proof:chunk-graph`). Net gate delta from this band: **0 authored, several
retired-into** (the appearance genre dissolves into the codex + owner-golden authority
this band completes).

| Wave | Invalidates / at risk | Disposition |
|---|---|---|
| **G1** | The 27L DESIGN.md stub (the last design-axis legacy artifact); the retired appearance-gate genre's clause-table rationale (suffusion hue oracles, crayon pins, font census) which would otherwise be orphaned by U.A4; `proof:idioms`' geometry-token anchors (the F5 stray moves) and the two stale home-pointer comments | SUPERSEDE the stub with the codex; the retired genres' rationale TRANSFERS into codex sections (spec-first — owner-golden verifies against a stated law); the token moves + any surviving anchor re-arm ride U.B's styles pass IN ONE MOTION (charter §3: structural gates re-anchor WITH the move); the prose-purge map executes via U.B/U.E — if `proof:idioms` is retired at U.A4 before the move, the re-anchor is moot (delete wins) |
| **G2** | Lane 24's ~40L split threshold (superseded by R3's 100L/300L — the reconciliation is EXPLICIT, recorded in the chapter); the four legacy grammars (`withDefaults`, runtime-object props, call-signature emits, manual `update:*`); the `ReturnType`-derived context APIs; `@/components/skeletons/` (the one-orphan tier) | ONE number stated once (G2 ch. 9 = R3; a contradiction here would make U.B12 enforce two rules — the named risk, cured by single-sourcing); the grammar conversions + renames RIDE U.B's import-touching moves (never a second pass); the skeleton tier completes as U.B10 (T.F8's deferred half) citing this chapter |
| **G3** | The blessed cube/amiga goldens (appearance changes — they gain the whisper) + the suffusion headerless-exception clause; the four-spelling affordance mix | OD-U9 RULED (instrument the 3D scenes) sequences G4 (ONE blessing pass with the register in place — bless-then-re-bless is the named waste); the suffusion clause is retired with its genre at U.A4 (the rule's home is codex ch. 8, its verification owner-golden); the RULED register is designed to owner-review completeness, so the mocks refine ONE direction, never a fork |
| **G4** | BLESSED.json's current hashes for the state-deviating frames (re-bless is the POINT); the capture protocol's silence on pane state; **U.A4's entire 77-gate retirement AND U.E2's `FROZEN_SET` 36 discharge** (both hard-gated here — the schedule risk of the band: owner-blessing latency stalls the apparatus dissolution) | Re-bless through the born-OWNER flow with `blessedCommit` updated; the protocol clause lands beside the PRM freeze (same mechanism, one more frozen axis); MITIGATE the latency: candidates + protocol draft day-1, ONE late blessing event, A4's genre deletions staged so only the final retirement waits on the blessing |
| **G5** | The folklore state of R1–R7 (four wave-spec restatements risk drift); the DEFERRED tolerance map (dies — R6); `PIN`-style exceptions generally (exceptions now change the RULE); if OD-U7 rules AGAINST the mirror: R5's clause dies and every structural gate needs test-exclusion carve-outs (the fallback cost is recorded IN the ruling request so the decision is informed) | The law lives ONCE, cited everywhere; the map deletion executes in U.B1 with the two re-homes (no tolerance survives); an adverse OD-U7 ruling re-charters R5's slice to U.H as a colocation design (bounded blast radius — the other six rulings stand independent) |

**The zero-deferral posture.** OD-U9 is now RULED (instrument the 3D scenes — no
longer an in-loop fork); this band carries ONE remaining in-loop owner decision
(OD-U7, the test-mirror carve-out) and one hard downstream gate (U.A4 on G4). Neither
is a deferral device: OD-U9's register is designed to owner-review completeness (ONE
direction, mocks reviewed against renders), OD-U7 is delivered ruling-ready with its
fallback cost recorded, and U.Z's exit criterion holds them — an unruled decision at
close fails the tranche, by design.
