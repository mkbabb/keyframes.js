# hd-dag — DEEP adversarial harden: the H DAG + sequencing soundness

**Lane:** hd-dag · **Charge:** is the H.W0→H.W8 dependency chain SOUND? does each named
prerequisite actually BITE? is there hidden inter-wave coupling (shared files → write-race
at impl)? · **Method:** read the charter DAG (`H.md §"The DAG" :424-477`, `PROGRESS.md
:71-102`) + every wave's **formal `Scope` + `DAG-deps` lines** (the wave specs, NOT just
H.md's summary) + the live source tree to resolve each cited `file:line` to a real edit
target and cross-tabulate the file partition. Every finding cites a `file:line` or a
wave:S# anchor (inv ε).

## VERDICT

**The dependency SPINE is sound** — `H.W0 (crashes) → H.W1 (FSM) → {visual} → H.W8
(gates)` is a true prerequisite chain, and the two named prerequisites genuinely bite (the
crashes poison every console-clean measurement; the FSM is the substrate the layout /
mode / mobile waves read scene-state from). **But the charter's headline parallelism claim
is FALSE as written:** `H.md:467-470` and the DAG diagram (`:442-449`) assert
"H.W2/H.W3/H.W4/H.W5/H.W6 share no source surface and run concurrently." The per-wave
`Scope` lines contradict this — **five shared-file collisions** exist, three of them
**same-file / adjacent-or-overlapping-line write-races** between waves the DAG places in the
SAME parallel band. The DAG is correct about the *logical* dependency order; it is wrong
about the *file partition*, and at implementation time (parallel agents/branches) the
overlaps are merge-conflict and clobber risk. Findings below give the concrete file
partition + an impl ordering that removes the races.

Severity tally: **2 HIGH** (same-line write-races the DAG denies) · **3 MED** (shared-file
overlaps that are sequenced but undocumented as such) · **2 LOW** (path/line drift that
mildly weakens a feasibility claim) · **1 NIT**.

---

## The file-partition matrix (the evidence)

Every path resolved to the live tree; every wave's edit-vs-read intent read from its
formal `Scope`/`S#` lines.

| File (live path) | W0 | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 | Collision class |
|---|---|---|---|---|---|---|---|---|---|---|
| `engine.ts` (`processFrame` ~:769-778) | **EDIT** | | | | | | read-only (relies on W0 guard) | | | none (W6 does not edit) |
| `animation/format.ts:30` (`serializeEasing`) | **EDIT** | | | | | | | | | none |
| `cube/cubeAnimations.ts` | **EDIT** | | | | | | | | | none |
| `…/keyframes/KeyframesStringControls.vue:46` | **EDIT** | | | | | | | | | none |
| `…/AnimationControlsGroup.vue` | | **EDIT** `<script>` :148,155 | | **EDIT** `<template>` :5,54-72 | | | | **EDIT** `<template>` :5,54-66 | | **HIGH — 3-wave SFC** |
| `…/controls/AnimationControlsControls.vue` | | | **EDIT** :3 (Card) | **EDIT** :4,6,9,88,97,124,293 | | | | | | **MED — W2∥W3 same file** |
| `…/editor-shell/ControlsPaneWrapper.vue` | | | | **EDIT** :206 | | | | **EDIT** :142-155,215-219 | | MED — sequenced (W7 after W3) |
| `…/editor-shell/EditorStartScreen.vue` | read :49 | | | | **EDIT** :3,6,10,**15-21** | | **EDIT** **:16-19** | | read | **HIGH — W4∥W6 OVERLAP lines 15-21 / 16-19** |
| `…/controls/TimingFunctionPanel.vue` | | | read | **EDIT** :17-19,37-45 | **EDIT** :17-19,37-45 | read | | | | **MED — W3∥W4 same lines :17-19** |
| `@/styles/design-idioms.css` | | | **EDIT** del :169-188 | **EDIT** :99,106-111 | **EDIT** +icon @utility | **EDIT** +scene-host | | | | MED — 4-wave, disjoint regions |
| `demo/app/scenes.ts` | | | | | | **EDIT** :7-14,54-123 | | | read (manifest) | sequenced (W8 last) |
| `demo/app/router.ts` | | **EDIT** :49 | | | | **EDIT** (Discrete del) | | | | sequenced (W5 after W1) |
| `…/dock/ChromeDock.vue` | | read | | | | **EDIT** :20-30,171-211 | | read | | none (only W5 edits) |
| `scripts/lib/demo-driver.mjs:40-59` | | | | | | read (not touched) | | | **EDIT** (re-source) | none |
| `demo/@/components/custom/AnimatedText.vue` | | | | | | | **EDIT** :62-107 | | read | none (only W6 edits) |

---

## FINDINGS

### [HIGH] F1 — `AnimationControlsGroup.vue` is a THREE-wave write-race; the DAG names only the W3→W7 edge

- **Location:** `H.md:467-470` (the "share no source surface" claim) + `H.W1.md:19`,
  `H.W3.md:3` (Scope `:5,54-57,63-72`), `H.W7.md:3` (Scope `:5,54-57,66`).
- **Defect:** `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue` is
  edited by **three** waves:
  - **W1** must rewrite the `<script>` consumer at `:148,155` — `storedControls =
    getStoredAnimationGroupControlOptions(superKey)` resolves ONCE at setup off a lagging
    `superKey` (`H.W1.md:19`, the live cross-scene control-corruption root). When the FSM
    becomes the active-scene authority (W1 S1/S3), this read MUST change to project from
    `machine.activeScene` — that is an edit to the SFC's `<script setup>`.
  - **W3** rewrites the `<template>` grid at `:5` (`lg:grid-cols-[var(--controls-pane-width)
    _1fr_1fr]` → the named `[rail] var(--rail-width) [stage] 1fr`) and the stage/teleport
    rows `:54-72`.
  - **W7** re-parameterizes the SAME `:5` grid line and `:54-66` rows for the mobile
    overlay.
- **Why it bites:** the DAG diagram (`H.md:442-449`) and prose (`:471-472`) name ONLY the
  `H.W3 → H.W7` edge ("re-parameterizes the SAME grid"). It is **silent that W1 also edits
  this file.** W1 is the keystone landing before all visual waves, so its `<script>` edit
  and W3's `<template>` edit do not race *if W1 lands first* — but the DAG does not state
  the constraint, and an impl planner reading "W2/W3/W4/W5/W6 run concurrently after W1"
  would not know W3's `AnimationControlsGroup.vue` template edit sits on a file W1 just
  rewrote. The genuine hazard is **W3∥W7 on line `:5`**: the DAG sequences them, which is
  correct, but the SAME line being the single most-contended line in the tranche means W7
  cannot be authored against the pre-W3 grid — it must be authored against the LANDED W3
  named grid or it re-forks (which `H.W7.md:3` itself warns against).
- **Concrete doc edit:** in `H.md` §"The DAG" (after `:472`), add a **file-ownership
  note**: "`AnimationControlsGroup.vue` is touched by THREE waves — W1 owns its `<script>`
  scene-state read (`:148,155`), W3 owns its `<template>` grid (`:5,54-72`), W7
  re-parameterizes the W3 grid (`:5,54-66`). The required order is **W1 `<script>` →
  W3 `<template>` → W7 `<template>`**; W3 and W7 must not be authored in parallel against
  this line." Add the same line-ownership split to `H.W3.md` and `H.W7.md` DAG-deps.

### [HIGH] F2 — W4 and W6 OVERLAP the same `EditorStartScreen.vue` ellipsis block (lines 15-21 vs 16-19) — same band, same lines

- **Location:** `H.W4.md:3` (Scope `EditorStartScreen.vue:3,6,10,15-21`) + `H.W6.md:3`
  (Scope `EditorStartScreen.vue:16-19`); both in **Band 3** (`PROGRESS.md:88-91`,
  `H.md` DAG `:442-449` parallel row).
- **Defect:** the live file
  (`demo/@/components/custom/editor-shell/EditorStartScreen.vue:15-20`) is:
  ```
  15:            <div>
  16:                <AnimatedText
  17:                    class="dot-fade depth-text"
  18:                    :text="ellipsis"
  19:                ></AnimatedText>
  20:            </div>
  ```
  **W4** claims `:15-21` ("the orphaned `...` ... fold the orphaned `...` into one balanced
  run", `H.md:365 S3`) — i.e. it rewrites this block as part of the hero rung. **W6** claims
  `:16-19` (`class="dot-fade depth-text" :text="ellipsis"` → swap to the new `<TypingDots>`
  primitive, `H.W6.md:3`). These are **the same lines** — both waves rewrite the
  `<AnimatedText class="dot-fade">` ellipsis element, in the same parallel band, with no
  sequencing edge in the DAG diagram.
- **Why it bites:** `H.md:469-470` explicitly lists W4 and W6 among the five that "share no
  source surface and run concurrently." They DO share a surface — the exact ellipsis block.
  H.W4's DAG-deps line (`H.W4.md:3`) half-acknowledges it ("the orphaned-`...` fold
  COORDINATES with H.W6 ... this wave owns the hero LAYOUT coupling, H.W6 owns the dot-fade
  MECHANISM") — but a "layout vs mechanism on the same five lines" split is not a clean
  partition; both must edit the literal `<AnimatedText … :text="ellipsis">` node. Parallel
  authoring → guaranteed conflict; the "coordination" is hand-waved, not a DAG edge.
- **Concrete doc edit:** make the dependency explicit. Add to `H.md` §"The DAG" and to both
  wave DAG-deps: "**W6 → W4 on `EditorStartScreen.vue:15-21`**: W6 lands the `<TypingDots>`
  swap FIRST (it deletes the `<AnimatedText class="dot-fade" :text="ellipsis">` node and the
  `dot-fade` class); W4 then sizes the surviving hero `<h1>` and the title `<AnimatedText>`
  against the W6-landed markup. They are NOT parallel." Remove W4 and W6 from the
  "share no source surface" list at `H.md:469`.

### [MED] F3 — W2∥W3 both edit `AnimationControlsControls.vue` (adjacent lines 3 vs 4,6,9); DAG asserts independence

- **Location:** `H.W2.md:3` (Scope: `AnimationControlsControls.vue:3` Card surface flip +
  delete `glass-card`) + `H.W3.md:3` (Scope `:4,6,9,88,97,124,293` grid + `col-span-2`).
  `H.W2.md:3` DAG-deps: "independent of H.W3's layout grid ... they compose cleanly."
- **Defect:** live `AnimationControlsControls.vue:3-9`:
  ```
  3:        <Card class="w-full overflow-visible transition-shadow duration-normal glass-card">
  4:            <CardContent class="relative grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 px-4 py-3">
  6:                <div class="panel-stack col-span-2 grid grid-cols-[subgrid]">
  9:                    <div class="panel-content grid grid-cols-[subgrid] ...">
  ```
  W2 rewrites line 3; W3 rewrites lines 4,6,9 (and the grep-gate at `H.md:353` forbids
  surviving `col-span-2`/`grid-cols-[subgrid]`). Lines 3 and 4 are **adjacent**; the edits
  are logically disjoint (surface vs grid tracks) and git can usually auto-merge, but they
  are NOT "independent files" — they are one SFC, same `<template>`, adjacent lines.
- **Why it matters:** the claim "they compose cleanly" is true at the *intent* level but
  the DAG markets it as zero-shared-surface, which is what an impl planner partitions on.
  Two agents on the same `<Card>...<CardContent>` block adjacent lines is a real
  rebase-conflict source, not a clean partition.
- **Concrete doc edit:** in `H.W2.md` and `H.W3.md` DAG-deps, replace "independent /
  compose cleanly" with: "W2 owns `AnimationControlsControls.vue:3` (the `<Card>` surface
  attr + the `glass-card`/`transition-shadow` deletion); W3 owns `:4,6,9,88,97,124,293`
  (the `CardContent` grid + subgrid + `col-span-2`). Logically disjoint but the SAME SFC —
  land one then rebase the other; do NOT author both branches off the same base
  simultaneously." Strike `AnimationControlsControls.vue` from the "share no source surface"
  set at `H.md:469`.

### [MED] F4 — W3∥W4 both edit `TimingFunctionPanel.vue:17-19` (the SAME header lines)

- **Location:** `H.W3.md:3` does not list TimingFunctionPanel in Scope, BUT `H.W3.md` body
  references it; **`H.W4.md:3` Scope = `TimingFunctionPanel.vue:17-19,37-45`** (the
  `text-heading` header → `text-title`, the double-chrome collapse). W2's Scope also names
  `TimingFunctionPanel.vue` (read). The contention is W4's `:17-19` header edit vs the
  layout work — and critically W4 and W3 are the SAME band (Band 3 / Band 2 boundary).
- **Defect:** `H.md:365 H.W4 S2` rewrites `TimingFunctionPanel` header `text-heading`→
  `text-title` and "collapses the double-chrome" at `:17-19,37-45`. The easing panel header
  chrome is structurally coupled to the easing-sidebar layout the H.W3 rail-width container
  governs (`H.W4.md:3` itself says "the easing canvas sizes off the H.W3 rail-width
  container"). So W4's header/canvas edits READ W3's landed container — a real dependency
  the DAG diagram omits (it draws W3 and W4 as independent parallel boxes).
- **Why it matters:** `H.W4.md:3` states "**BEST SEQUENCED AFTER H.W3**" in prose — so the
  authoring KNOWS the dependency — but the canonical DAG diagram (`H.md:442-449`) and the
  critical-path line (`H.md:465`, `PROGRESS.md:100`) draw W4 ∥ W3 with no edge. The diagram
  and the prose disagree; the diagram is the artifact an impl planner reads.
- **Concrete doc edit:** add a **dashed soft edge `H.W3 ⇢ H.W4`** to the DAG diagram
  (`H.md:442-449`) with the note "(soft: H.W4 sizes the easing canvas + panel header off the
  H.W3 rail container; best sequenced after, not a hard blocker)". Reconcile `H.md:465`
  critical path to show W4 settling after W3.

### [MED] F5 — `design-idioms.css` is a four-wave file (W2 del / W3 token-rename / W4 +icon / W5 +scene-host); regions disjoint but the DAG calls all four "share no source surface"

- **Location:** `H.W2.md:3` (del `.scale-on-hover` `:169-188`), `H.W3.md:3` (`--controls-
  pane-width`→`--rail-width` `:99,106-111`), `H.W4.md:3` (NEW `icon-*` `@utility`),
  `H.W5.md:3` (`scene-host { contain: paint }`). Verified live: `:106-111` is the
  `--controls-pane-width` token (W3), `:169-188` is `.scale-on-hover` (W2).
- **Defect:** four of the five "parallel" Band-2/3 waves all edit `design-idioms.css`. The
  regions are disjoint (delete-block / token-rename / two appends), so this is the
  LOWEST-risk of the shared-file findings — append+delete partition cleanly and git
  auto-merges non-adjacent hunks. But it directly falsifies the literal "share no source
  surface" claim (`H.md:469`).
- **Why it matters:** `design-idioms.css` is the demo's single design-token landlord
  (ALREADY-SOTA per `H.md:514-517`); four parallel waves each appending/renaming risks
  duplicate `@utility` blocks or a token rename (W3) that W5's new `scene-host` rule or
  W4's icon rule references before the rename lands. Specifically: if W3 renames
  `--controls-pane-width`→`--rail-width` and any other wave's new rule references the old
  name, the cascade breaks silently (CSS custom-property typo = no error).
- **Concrete doc edit:** add to `H.md` §"The DAG" a **shared-file note for
  `design-idioms.css`**: "edited by W2 (delete `:169-188`), W3 (rename token `:99,106-111`),
  W4 (append `icon-*` `@utility`), W5 (append `scene-host`). Disjoint regions; land W3's
  token rename FIRST so W4/W5 appends never reference the dead `--controls-pane-width`. Each
  wave appends only to the end or edits its named region — no shared hunk." Strike
  `design-idioms.css` from the "share no source surface" set.

### [LOW] F6 — W0 cites a non-existent path `src/parsing/format.ts:24`; the real site is `src/animation/format.ts:30` — mildly weakens the W0 feasibility/console-clean claim

- **Location:** `H.W0.md:3` Scope = "`src/parsing/format.ts:24`" / `H.md:309,311` =
  "`format.ts:24`". `CLAUDE.md`'s tree even labels `src/parsing/format.ts` as the
  serializer. Live: **`src/parsing/format.ts` does not exist**; `serializeEasing` is at
  `src/animation/format.ts:30` (verified `grep serializeEasing src/`).
- **Defect:** the W0 edit-target path is wrong (and the line `:24` is off — it's `:30`).
  This is the LEAD wave of the whole tranche; an impl agent following the Scope verbatim
  edits a missing file. It does not break the DAG ordering (W0 still leads), but it dents
  the "every claim is a re-runnable `file:line`" inv-ε posture for the prerequisite wave.
- **Concrete doc edit:** fix `H.W0.md:3` and `H.md:309,311,605` to
  `src/animation/format.ts:30` (`serializeEasing`). Note this also corrects `CLAUDE.md`'s
  Project Tree mis-label (`src/parsing/format.ts` → `src/animation/format.ts`) but that is
  a `CLAUDE.md` edit outside the H docs and should be flagged, not made here.

### [LOW] F7 — the `engine.ts:516,576` guard site cited by W0+W6 has drifted to `~:769-778`; W0 reconciles it, W6 does not

- **Location:** `H.W0.md:8` (the H-A2 stack: `processFrame engine.ts:576` ← `interpFrames
  :516`, with the parenthetical "`processFrame` `:778`") + `H.W6.md:20,33` (cites
  `:516,576` with no reconciliation). Live: `interpFrames` is at `engine.ts:657`,
  `processFrame` at `:769`, the `processFrame` call at `:707`.
- **Defect:** the audit-era line numbers (`:516,576`) no longer point at the interp
  dispatch. **W0 already corrects this** (it cites the real `:778` `lerpValue(eased, iv)`
  callsite as the edit target) — so W0 is feasible. **W6 repeats the stale `:516,576`**
  three times without the reconciliation, weakening its (admittedly read-only) reliance
  citation.
- **Why it's LOW not HIGH:** W6 does not EDIT `engine.ts` (confirmed — its Scope is
  `AnimatedText.vue` + `EditorStartScreen.vue` + new `TypingDots.vue` + new script). The
  guard is W0's deliverable; W6 only names it as a dependency. So the line drift cannot
  cause a wrong edit — it is a citation-hygiene defect, not a feasibility blocker.
- **Concrete doc edit:** in `H.W6.md:20,33`, append "(audit-era `:516,576`; the live
  `processFrame`→`lerpValue` site is `engine.ts:~769-778` — W0's deliverable)".

### [NIT] F8 — `proof:scene-parity` (authored in W8) hard-asserts W5's Discrete-merge outcome; the cross-wave gate-ownership is correct but undocumented as a W5→W8 content coupling

- **Location:** `H.W5.md:44` authors `proof:scene-parity` ("exactly 3 surviving new-mode
  entries (Spring | Sequence | Path); `router.ts` has no `starting-style` route AND
  `scenes.ts` has no `starting-style` descriptor"); `H.W8.md:3` ALSO lists
  `proof:scene-parity` as a W8 runner.
- **Defect:** `proof:scene-parity` appears in BOTH W5's and W8's gate sets. This is
  actually CORRECT under the H discipline (W5 ships the fix, W8 owns the gate that locks
  it — `H.W8.md:3` "this wave authors GATES, the sibling waves author the fixes"). But the
  two specs do not cross-reference, so it reads as a duplicated/forked gate. No DAG-order
  problem (W8 is last), but it should be deduped in authorship.
- **Concrete doc edit:** in `H.W5.md:44`, tag `proof:scene-parity` as "(the runner is
  authored in H.W8 S1/I-1; H.W5 ships the fix it locks)". In `H.W8.md`, note it consumes
  the W5 fix.

---

## The proposed IMPL ordering + file partition (the deliverable)

The logical DAG is sound; only the file partition needs to be made explicit. Concrete
collision-free ordering:

```
H.W0  (engine.ts, animation/format.ts, cubeAnimations.ts, KeyframesStringControls.vue)
        — disjoint from everything; LEADS.
  │
H.W1  (NEW useSceneMachine.ts; deletes useSceneRouter/useSceneUrl/useSceneGroupSync/
        usePlaybackSnapshot/scenePlayback.ts; App.vue :18-21,198-211,224-304;
        router.ts :49; AnimationControlsGroup.vue <script> :148,155)
        — the FSM. Its AnimationControlsGroup.vue edit is the <script>; lands BEFORE W3/W7
          touch that file's <template>.
  │
  ├─ STRICTLY SEQUENCED on AnimationControlsGroup.vue:5  → W3 then W7
  │
  ├─ H.W2  (AnimationControlsControls.vue:3 only; RibbonBar/KeyframesEditor/
  │         KeyframeTimeline.vue:3; NEW useSpecularPointer.ts; design-idioms.css del :169-188)
  ├─ H.W3  (AnimationControlsGroup.vue <template> :5,54-72; AnimationControlsControls.vue
  │         :4,6,9,88,97,124,293; ControlsPaneWrapper.vue:206; AnimationControls.vue:4;
  │         LayerConfigPanel.vue:14-22; design-idioms.css token :99,106-111)
  │         ⚠ rebase W2 onto W3 (or vice-versa) on AnimationControlsControls.vue — adjacent lines 3 vs 4.
  ├─ H.W5  (ChromeDock.vue; scenes.ts; router.ts Discrete del; amiga/utils.ts; vite.config.ts;
  │         design-idioms.css append scene-host)  — router.ts after W1's :49 edit.
  ├─ H.W6  (AnimatedText.vue; NEW TypingDots.vue; EditorStartScreen.vue:16-19 — DELETE the
  │         dot-fade AnimatedText node)
  │         ⚠ MUST precede W4 on EditorStartScreen.vue.
  └─ H.W4  (EditorStartScreen.vue hero :3,6,10,15-21 — AFTER W6 deleted the ellipsis node;
            EasingCurveCanvas.vue; EasingSidebar.vue; TimingFunctionPanel.vue:17-19;
            design-idioms.css append icon-*)  — soft-sequenced after W3 (rail container).
  │
H.W7  (AnimationControlsGroup.vue <template> :5,54-66 — AFTER W3; ControlsPaneWrapper.vue
        :142-155,215-219 — AFTER W3's :206; NEW useSheetSpring.ts)
  │
H.W8  (demo-driver.mjs re-source from scenes.ts; NEW proof-visual-lock.mjs; extends
        proof-idioms.mjs + occlusion-gate.mjs; visual baseline captured AFTER all fixes)
        — depends on ALL W0-W7. Gates only; no demo/engine source.
```

**The two HARD partition rules the DAG must add:**
1. **`EditorStartScreen.vue`: W6 → W4** (W6 deletes the ellipsis `<AnimatedText>`; W4 sizes
   the surviving hero). They are NOT parallel (fixes F2).
2. **`AnimationControlsGroup.vue`: W1 `<script>` → W3 `<template>` → W7 `<template>`**; W3
   and W7 never authored in parallel against line `:5` (fixes F1).

**The soft rules:** W2/W3 rebase-sequence on `AnimationControlsControls.vue` (F3); W4 soft-
sequences after W3 on the easing container (F4); W3's `design-idioms.css` token rename lands
before W4/W5 appends (F5).

## Soundness of the prerequisite chain (the affirmative answer to the charge)

- **W0 → W1 is a TRUE prerequisite** — `proof:demo-console-clean` clause (b) (home→scene =
  0 errors) is shared by W0 and W1 (`H.W1.md:3` DAG-deps confirms: "the `proof:demo-console-
  clean` (b) home→scene clause is shared and needs BOTH"). The FSM round-trip cannot be
  measured on a console throwing the `"......"` lerp on every hop. Sound.
- **The visual waves DO touch scene-state** (answering the charge's question directly): W3
  settle-gates on the FSM resting (`H.W3.md:3`), W5's pertinence/interactivity reads are
  poisoned by the route storm (`H.W5.md:3` — "every scene-deeplink lane observed
  `/#/sequence`→`/#/?anim=Rotations`"), and W1 edits the very `AnimationControlsGroup.vue`
  consumer the visual waves restyle. So W2/W3/W4/W5 are **NOT** FSM-orthogonal in the strong
  sense the diagram implies — W3 and W5 have a HARD W1 dep (correctly drawn), and W3's
  `<script>`-vs-`<template>` split on `AnimationControlsGroup.vue` is the one place the
  layout work literally sits on W1's edit. W2/W4/W6 are genuinely FSM-independent in
  *content* (surface/typography/dots) — they depend on W1 only via "a stable scene to
  screenshot," a measurement precondition, not a code dep. This is sound and correctly
  characterized in prose; only the diagram over-flattens it.
- **W7 → W3 is genuine** — W7 re-parameterizes the W3 named grid (`--rail-width`,
  `[rail]/[stage]`); authoring W7 before W3 would re-fork the layout, the exact anti-pattern
  `H.W7.md:3` forbids. Sound and correctly drawn.
- **W8 last is correct** — `proof:visual-lock` baselines the LANDED render (`H.W8.md:3`:
  "the visual-lock baseline is captured AFTER the fix waves land"); the manifest re-source
  (I-1) and the born-RED HANDOFF gates red TODAY independent of the fixes (correctly the
  one part of W8 that does not wait). Sound.

## What is NOT a finding (honest negatives)

- **W0/W6 on `engine.ts`:** NOT a collision — W6 does not edit `engine.ts` (only relies on
  W0's guard; confirmed against W6's Scope). The DAG's "W6 rides H.W0's H-A2 guard" edge is
  correct.
- **W1 `useSceneSwap.ts`:** NOT a collision with W7 — W1 PRESERVES it untouched
  (`H.W1.md:28,71`); W7's `useSheetSpring` only *mirrors* its shape (`H.W7.md:31`), a
  read/copy, not an edit. Correctly drawn.
- **`demo-driver.mjs`:** W5 explicitly does NOT touch it (`H.W5.md:24` — it is W8's
  `proof:manifest-sourced` concern); only W8 edits it. No race.
- **The amiga `tesselateSphere` "~500k off-canvas fillRect" claim (W5-S6):** the bug is
  real and directionally correct (the loop iterates `boardSize×boardSize` = 1024² but
  multiplies coords by 64 → mostly off-canvas overlapping tiles), but it is W5-only and not
  a DAG concern — flagging for the engine/scene-review lane, not here.
- **The critical-path skeleton itself** (`H.W0 → H.W1 → {visual} → H.W8`) is sound; no wave
  over-reaches into an ALREADY-SOTA kernel via a DAG dependency, and no wave depends on a
  wave that ships a non-existent API for the *sequencing* to hold.
