# Lane 26 — Plan-vs-Landed audit, bands S.F + S.G + S.H + THE DIVERGENCE ANALYSIS

> **Surface:** the S plan (`waves/S.F.md` SOTA library uplift · `waves/S.G.md` demo design-refinement
> fleet · `waves/S.H.md` parse-that dispatch) vs what the impl drive landed on `tranche-s-impl`.
> **Method: T5 — every claim verified against the TREE and by reading the gate scripts, never
> trusted from the PROGRESS report.** This lane owns **the headline question**: how did 100% dev
> convergence + all-green born-RED gates produce a demo the owner rejects on sight? It traces 6+
> verdict items back through F/G/H waves and delivers **the divergence mechanism taxonomy** — where
> each bar diverged (spec / critic-rubric / gate-oracle / investment-altitude) — so Tranche T's
> process can encode the cure (the S.E-shelf owner-in-the-loop lesson, generalized).

## The one-sentence verdict

Band **H** (parse-that dispatch) and most of band **F** (the SOTA *library* primitives) are **SOUND
and NOT implicated** — they land below the owner's line of sight; but band **G is the epicentre of the
rejection, and it is the epicentre BY DESIGN**: G2 and G3 shipped, as CLOSED born-RED deliverables,
the *exact* surfaces the owner strikes wholesale (the square honest-COLLAPSE, the gesture legends, the
easing telemetry, the cube readout, the gallery door) — because the plan **crystallised each design
disposition into a hard oracle where green *is* the owner-rejected state**, and the one place F touches
the owner (the hero) was actively driven per-CHAR→word by S.F2's a11y-first gate. The instruments did
not *miss* the owner's bar; **the born-RED design gates manufactured the divergence at 100%
convergence.**

---

## THE DIVERGENCE MECHANISM TAXONOMY (the headline deliverable)

The gate-blindspot lesson ("green source-shape gates miss appearance/interaction/state") is the *shallow*
reading and it is **wrong for F/G/H**. These gates were NOT source-shape — `proof:gesture-manifest`,
`proof:stage-visible`, `proof:split-a11y`, the G2 rect⊂stage oracle all **browser-actuate the running
demo** (T1/T8). They saw the pixels. They were falsifiable both ways. They went green. **And green was
the defect.** The divergence has four distinct loci; naming which locus each verdict item lives in is
what lets T target the cure instead of adding another oracle.

**L1 — SPEC-LOCUS.** The wave-spec *itself* authored the owner-rejected disposition. The "cure" the
critics converged on WAS the defect. (square honest-collapse · gesture legends · easing telemetry ·
cube readout anchor.)

**L2 — CRITIC-RUBRIC-LOCUS.** The 11×100% convergence measured falsifiability and internal
consistency, never owner-taste — and SG-6 *explicitly deleted the one taste rubric* and replaced it
with objective geometry oracles (`S.G.md:254` "the rubric gate v1 proposed is REPLACED by these
concrete oracles"). The convergence was perfect on the wrong axis; the taste axis was engineered out
of the loop by construction.

**L3 — GATE-ORACLE-LOCUS.** The born-RED oracle asserts a property that is *orthogonal to* or
*inverted from* owner-good, so its GREEN certifies the rejected state. `proof:gesture-manifest`:
"an entry WITHOUT a tell is a **hard RED** — surfacing the affordance is **mandatory**"
(`scripts/proof-gesture-manifest.mjs:10-13`) → green **forces** the legend the owner says "remove all
elements like this." `proof:split-a11y` (accessible-name-equality) is satisfied *only* by word-split →
green is **anti-per-char**.

**L4 — INVESTMENT-ALTITUDE-LOCUS.** Whole bands were spent below the owner's sightline (F's four SOTA
library primitives; H's parse-that packrat micro-perf), while **C-10 banned the one metric that would
have caught the owner's #19** (absolute perceived perf) as "device-dependent," and G refined scenes
(morph, compose) the owner wants pruned.

### The six traces (verdict item → wave → gate → divergence locus)

| # | Owner verdict | Wave (landed, verified) | The gate that went GREEN | Locus | Why green = rejected |
|---|---|---|---|---|---|
| **#12** | square "totally a mess… the full controls/keyframes/timeline panel must **return**" | **S.G2 S2** — `SquareInstrument.vue:36-43` COLLAPSED the panel to a mono caption | G2 per-item oracle: "Play obeys duration/easing **OR the lying panel is collapsed**" (`S.G.md:227-228`) | **L1** | The spec offered *fix-OR-remove*; the impl took *remove*; the oracle **certified the removal**. Owner wanted the third option (fix + keep) the spec never listed. |
| **#8/#11** | amiga legend / square caption → "**remove all elements like this**" | **S.G3 S1** — `GestureLegend.vue` wired into 11 sites (square:14, cube:7, easing tells) | `proof:gesture-manifest`: "an entry **without a tell is a hard RED**" (`proof-gesture-manifest.mjs:12`) | **L1+L3** | The gate *mandates* the on-stage tell. Green is impossible without the legend the owner strikes. The affordance-systemic diagnosis (fold row 67) was a **critic/probe consensus the owner never shared**. |
| **#3** | hero "totally broken… should uplift each individual **char**" | **S.F2** posture — `AnimatedText.vue:4-7` shreds per-CHAR **into** word "so the text run is NOT shredded" | `proof:split-a11y` computed-accessible-name-equality (`S.F.md:254-256`) | **L1+L3** | a11y-first → word-split preserves the accessible name → **per-char is the thing the gate rules out**. The comment cites the a11y rationale verbatim. Owner wants exactly per-char. |
| **#13/#14** | easing "**Remove all of this**… just have the easing balls previewed" | **S.G2 S6** — `EasingCurvePhysics.vue:36-56` telemetry ANCHORED into `--stage-reserve` | G2 named oracle + `proof:stage-visible` clause (c) live-rect-in-band | **L1** | p10 F7 found "the ball rests below the strip" → the fix **added telemetry into the visible band** (SG-7), compounding the clutter the owner wants gone. |
| **#5** | cube "rx 0° ry 0° rz 0° — **Remove this**" | **S.G2 S4** — "cube rest-attitude + **readout anchor**" (`S.G.md:234`) | G2 per-scene refinement (no dedicated oracle) | **L1** | The spec's word was "anchor" (make prominent); the owner's word is "remove." Pure spec-disposition inversion. |
| **#19** | "**performance on every single page is god awful**" | **S.F5a/b/c** perf floors + `proof:scene-perf-budget` | zero-alloc mixed-leaf + budgeted **device-independent ratios** (C-10, `S.F.md:68-73`) | **L3+L4** | `scene-perf-budget` measures **pixel-identity + fillRect-count + dpr≤2** (`proof-scene-perf-budget.mjs:11-24`), never smoothness; C-10 **forbade** absolute fps as a closure plan-wide → the owner's perceived-jank bar has *no possible oracle*. |
| **#22/#21** | motion-path "barely works" / morph "does not work at all — bare grid" | **S.G2 S1/S7** — scalePathD+RO; morph shape-ring picker | rect⊂stage at 375px (`S.G.md:222-224`); `proof:morph-scene` actuate-then-sample | **L3** | Geometric containment ≠ "reads as working." The harness *drives the scene into its working state before sampling* (lane-24 F2); the owner *looked on cold load*. Green certifies "can be actuated," never "looks complete." |

### The generalised cure (why the S.E shelf lesson must move UPSTREAM of the gate)

The S.E shelf recorded "critic consensus ≠ owner verdict; put the owner review **inside** the design
loop." F/G/H prove **where** in the loop: **at gate-authoring time, not at wave-close time.** The
mechanism is:

> **A born-RED gate is the crystallisation point of a disposition.** For a *library* wave this is
> sound — correctness is owner-INVARIANT, so born-RED→green converges on truth. For a *design* wave it
> is a **taste-manufacturing machine**: authoring `proof:gesture-manifest` (tell-or-RED) *fixes* the
> disposition "every affordance must have an on-stage legend" into a hard oracle; the entire Opus/Sonnet
> fan-out then drives to green with 100% convergence — i.e. **drives to the owner-rejected state, at
> scale, provably.** The more rigorous the gate, the more certainly the fleet lands the wrong thing.

So T cannot fix this with *another* oracle (lane 24 F1 concurs). The design-wave close contract must
carry an **owner-taste sign-off on the rendered surface that is a PRECONDITION of authoring the
born-RED gate** — because once the gate exists, going green is mandatory and the divergence is already
baked. Library-wave gates (F's primitives, H's dispatch) keep the born-RED→green discipline unchanged;
they are owner-invariant and this lane clears them.

---

## Per-wave verdict table (verified against the tree, not the board)

| Wave | Board | Landed on tree (verified) | Verdict |
|---|---|---|---|
| **S.F1 VT** | CLOSED | `compile/view-transition.ts` (16.9K) + `orchestration/view-transition/` ✓; VT-d dogfoods the scene transition | **SOUND** (library); the VT-d demo dogfood is below the owner line — not in the catalogue |
| **S.F2 SplitText** | CLOSED | `orchestration/split-text/` (4 files) ✓; gate = a11y-name-equality ONLY | **SOUND primitive, OWNER-OPPOSED posture** — a11y-first drove the hero per-CHAR→word (verdict #3); F1 below |
| **S.F3 EN-c/EN-d** | CLOSED | `compile/entry.ts` (18.8K) ✓; EN-d = the spring @starting-style card | **SOUND** (library); real correctness win, owner-invariant |
| **S.F4 trigger** | CLOSED | `scroll/trigger.ts` (317L) ✓ | **SOUND** (library) |
| **S.F5a/b/c perf** | CLOSED | boxedKeys hoist; colorTail budgeted ratios; resolve bench; Typed-OM KILL | **SOUND at the library seam, BLIND to the owner's #19** — perf floored as device-independent ratios; no whole-page smoothness oracle exists (C-10) (F2) |
| **S.F6 narrative** | **PENDING-IMPL** | not landed | **UNMET** — F band not complete in totality; below owner line |
| **S.G1 stage-visible** | CLOSED | three-writer cure + `--stage-strip`/`--stage-reserve`; `proof:stage-visible` 72% | **LANDED, still owner-rejected** — 72%-at-rest green, owner still finds every scene cluttered (F3) |
| **S.G2 per-scene** | CLOSED | square-collapse ✓ · cube readout-anchor ✓ · easing telemetry ✓ · morph picker ✓ · compose chrome ✓ | **LANDED → OWNER-REJECTED WHOLESALE** — 5 of its items are struck by name (F4, the L1 core) |
| **S.G3 affordance** | **PENDING-IMPL** | `GestureLegend.vue` + 11 tell/legend sites **git-committed on tranche-s-impl** ✓; `proof:gesture-manifest` script present | **LANDED-YET-BOARD-DENIES + OWNER-REJECTED** — the owner struck a surface the board says was never built (F5, F6) |
| **S.G4 eggs** | DE-SCOPED | — | correctly de-scoped |
| **S.H1/H2/H4** | **PENDING-IMPL** | parse-that packrat/span/chain — sibling repo, not written in dev | **NOT IMPLICATED** — zero owner-catalogue overlap; ring-fence like band B (F7) |
| **S.H3** | DE-SCOPED | — | correctly de-scoped |

---

## Findings

### F1 — (BAND-DEFINING) The hero was driven per-CHAR → WORD by S.F2's a11y-first gate — the owner wants it reversed

**Defect.** Owner #3 (shots 03, 18): "the original hero animation is totally broken and should **uplift
each individual char**." The hero component `demo/@/components/custom/editor-shell/AnimatedText.vue`
carries, in its own header comment, the exact opposite intent, and names the reason:
`AnimatedText.vue:4-7` — *"screen reader reads 'Select an animation', not the 'S…e…l…e…c…t' per-glyph
stream the per-character split produced. WORD-granular (not per-character), so the text run is NOT
shredded."* The per-character uplift the owner wants was **deliberately removed** to satisfy an a11y
concern.

**Root cause (L1+L3).** S.F2's entire gate is `proof:split-a11y` — browser-actuated
computed-accessible-name-equality (`S.F.md:254-256`; PROGRESS row 61: *"role=img consolidation, the
load-bearing detail the spec under-specified"*). a11y-first **structurally prefers word-split**: a
per-char split shatters the accessible name into a glyph stream, which reds the only gate S.F2 owns.
So the library's blessed posture (a11y-first) and the demo's hero rewrite both point AWAY from the
owner's aesthetic. There is no gate — and under the a11y-first framing there *could* be no gate — that
prefers the per-char visual the owner wants. The SplitText primitive supports `by:"grapheme"`
(`S.F.md:248`); it was never wired to the hero because the a11y gate made word the safe default.

**T-wave recommendation.** Re-wire the hero to per-char (or grapheme) uplift as owner #3 demands, and
resolve a11y the RIGHT way: `aria-label` on the container + `aria-hidden` on the per-char fragments
(the SplitText primitive already does exactly this consolidation — `role=img`, PROGRESS row 61) so the
accessible name is preserved AND the visual is per-char. The a11y posture and the per-char aesthetic
are only in tension because the hero used word-split to dodge the consolidation the primitive already
ships. Gate: the hero renders ≥1 animated span per grapheme AND `proof:split-a11y` stays green.

### F2 — S.F5's perf floors are device-independent by mandate (C-10) — so the owner's "god awful performance" has NO possible oracle

**Defect.** Owner #19: "The performance on **every single page** is god awful and needs to be rethought
from the ground up." The tree carries eight perf gates (`grep 'proof:.*perf|budget|frame|loaf'`
package.json → `perf-frame-budget`, `scene-perf-budget`, `scene-transition-perf`, `portable-perf`,
`nan-frame`, `processframe-soa`, `lighthouse-mobile`, `lighthouse-a11y`). Every one was green. Reading
`scripts/proof-scene-perf-budget.mjs:11-24`, the clauses are: (a) the amiga checkerboard is
**pixel-identical to a committed baseline**, (b) a **fillRect call-count**, (c) **device-pixel-ratio
≤ 2**. None measures frame rate, INP, or perceived smoothness.

**Root cause (L3+L4).** C-10 is a **plan-wide ban**: *"No raw absolute fps threshold may be a CI
closure anywhere in the plan"* (`S.F.md:68-73`); S.F5a converts colorTail to "budgeted
device-independent ratios," and the p12 demo-smoke taxonomy converts "absolute-threshold → relative
budget" (PROGRESS:161). This is **correct for a portable LIBRARY perf claim** (a ratio reds honestly on
any runner) and **exactly wrong for the demo**: a scene can be uniformly, absolutely janky and pass
every relative/self-referential budget. The owner measures absolute perceived performance; the plan
deliberately excised absolute perception as the closure. The one axis the owner complained about is the
one axis the plan forbade a gate from asserting.

**T-wave recommendation.** T needs a **demo-scoped** perceived-perf oracle that is allowed to be
absolute (the C-10 ban is a LIBRARY tenet — the demo is not a portable library and should not inherit
it). Options: a Chrome-trace INP/long-task budget per scene via `performance_start_trace` (the
chrome-devtools-mcp path), or a scripted rAF frame-interval p95 under a fixed emulated CPU throttle.
Gate: each scene holds ≤ N ms p95 frame interval and ≤ M ms INP under 4× CPU throttle on cold nav.
Sequence AFTER the T demo rebuild (the current scenes are being pruned).

### F3 — S.G1 shipped the probe-proven 72%-stage-visible cure — and the owner still finds every scene cluttered

**Defect.** S.G1 landed the p10 cure verbatim (`proof:stage-visible` FAIL(15)→PASS(26), 72.0% stage at
rest == p10; PROGRESS:69). The gate asserts, at 375×667 across 9 scenes, `--sheet-t==0` ∧
`sheet.top/viewportH ≥ 0.65` ∧ the subject's live rect intersects the band (`S.G.md:157-163`). It is a
genuinely strong runtime oracle. **Yet the owner's rejection is not about occlusion at all** — it is
about *what is on the stage* (legends, telemetry, captions) and *how it looks* (fonts, theme, glass-ui
idiom). G1 correctly maximised the visible fraction of a surface the owner wants mostly deleted.

**Root cause (L2/L4).** The "mobile-sheet occlusion systemic" diagnosis (fold row 66, 10/10 design
lanes, probe-PROVEN) was a **real** finding — but it is a *layout* finding, and the owner's bar is a
*content + idiom* bar. The design fleet found the pathology all ten lanes agreed on; the owner's
pathology was never in the design-lane rubric. G1's success is orthogonal to the rejection, not
implicated in it — but it illustrates the L2 mechanism: 100% design-lane consensus on the axis the
owner does not weight.

**T-wave recommendation.** Keep the `stage-visible` mechanism (it is sound and layout-invariant); do
NOT re-litigate G1's layout math. Re-point it at the T-rebuilt scenes once their content is
owner-approved. This is a **positive/ring-fence** note for the layout substrate, paired with the
content rebuild owning the actual cure.

### F4 — (THE L1 CORE) S.G2 shipped, as CLOSED per-item oracles, five surfaces the owner strikes by name

**Defect.** S.G2 (PROGRESS:70, CLOSED, *"5 named oracles red→green"*) landed exactly these, each
git-verified on the tree, each in the owner's 22-item catalogue:

| S.G2 item | Landed at | Owner verdict |
|---|---|---|
| S2 square honest-**collapse** | `SquareInstrument.vue:36-43` ("the lying panel… is COLLAPSED away") | #12 "the full controls/keyframes/timeline panel must **return**" |
| S6 easing telemetry-anchor | `EasingCurvePhysics.vue:36-56` (peak velocity / overshoot / anticipation) | #13 "**Remove all of this**" |
| S4 cube readout anchor | cube `rx 0° ry 0° rz 0°` (shot 05) | #5 "**Remove this**" |
| S1 motion-path scalePathD | rect⊂stage green | #22 "barely works" |
| S7 morph shape-ring picker | on a scene rendering a bare grid (shot 17) | #21 "does not work at all" |

The square item is the sharpest inversion: **the spec's oracle offered "Play obeys duration/easing OR
the lying panel is collapsed" (`S.G.md:227-228`)** — a *fix-or-remove* disjunction — and the impl took
the cheap *remove* branch, which the oracle then **certified as correct**. The owner wanted the branch
the spec never wrote: *fix the panel AND keep it* ("Square used to have a proper keyframes, controls,
etc section but that was removed?").

**Root cause (L1).** SG-6 replaced the design-rubric gate with "per-item born-RED oracles"
(`S.G.md:254`, "the rubric gate v1 proposed is REPLACED"). This is the critic fleet **deliberately
deleting the taste axis** and substituting objective geometry — the fix that made the wave falsifiable
is the fix that removed the owner from the loop. Every one of the five oracles is a clean
DOM/behaviour assertion that green-certifies a disposition the owner rejects.

**T-wave recommendation.** T must NOT re-author G2 as five more objective oracles. The square panel is
the concrete anchor: **restore the full controls/keyframes/timeline panel and make Play honest** (owner
#12/#25) — the exact opposite of the collapse. For the disjunctive-spec trap generally, T's design-wave
template must forbid a "fix-OR-remove" oracle from closing on the remove branch without an owner
sign-off that removal is the intended disposition. Gate the square: Play visibly drives the box through
a user-edited keyframe track (not the collapsed caption).

### F5 — (THE L3 CORE) `proof:gesture-manifest` makes the owner-rejected legend MANDATORY — green is impossible without it

**Defect.** Owner #8 (shot 08, amiga "DRAG: SPIN THE BALL / DOUBLE-TAP: BOING!") and #11 (shot 10,
square caption): "**remove all elements like this**." These are `GestureLegend.vue`
(`demo/@/components/custom/`, git-tracked), wired into square (`SquareScene.vue:14-16`), cube
(`CubeTarget.vue:7-8`), and 9 more `data-gesture-tell` sites (11 total on the tree). The gate that
governs them, `scripts/proof-gesture-manifest.mjs:10-13`, asserts: *"the entry carries a non-empty
`tell` … an entry WITHOUT a tell is a **hard RED** (the tell requirement bites — surfacing the
affordance is **mandatory**)."*

**Root cause (L1+L3).** This is the purest L3 case in the tranche: **the gate's green state literally
requires the artifact the owner deletes.** The "hidden-affordance systemic" diagnosis (fold row 67,
`S.G.md:314-322`) — cube's gesture grammar invisible, spring's derby dblclick-only, etc. — was a
critic/probe consensus (10/10 lanes) that discoverability > minimalism. The owner's aesthetic is the
inverse: clean, glass-ui, no drafting-stamp overlays. SG-8 then *hardened* the consensus into a
tell-or-RED oracle, making the rejected surface non-optional. G3 also invested in touch-parity for a
"visible gallery-door button" (`S.G.md:330`) — owner #15: "remove this button."

**T-wave recommendation.** Delete the `GestureLegend` layer and the gesture-manifest gate; the
affordance-discovery problem is real but the drafting-stamp legend is the wrong solution. Re-solve it
with glass-ui-idiomatic, dismissible affordance hints (or on-hover/first-run coach-marks that are OFF
by default) — census `node_modules/@mkbabb/glass-ui` for an existing primitive first. Gate: no
persistent on-stage legend renders at rest; any affordance hint is dismissible and PRM-snapped.

### F6 — S.G3 is marked PENDING-IMPL on the board, yet its owner-rejected surface is git-committed on the reviewed branch

**Defect.** PROGRESS:71 marks **S.G3 = PENDING-IMPL**. But `git ls-files` confirms
`GestureLegend.vue`, its consumption in `SquareScene.vue`/`CubeTarget.vue`, and
`scripts/proof-gesture-manifest.mjs` are all **committed on `tranche-s-impl`** — the branch the owner
reviewed (shots 08/10/03 render the legends). The demo the owner rejected therefore contained a surface
the tranche's own board says was **never implemented**.

**Root cause.** This is the lane-24-F6 board-drift, one level worse: not just a CLOSED-vs-tree
understatement, but an owner rejecting work the board denies exists. Likely a design-lane prototype /
intermediate merge leaked `GestureLegend` onto the tree ahead of S.G3's formal close, or the board
simply froze. Either way the reviewed tree is a **hybrid** — CLOSED waves + leaked pending-wave surface
+ still-unimplemented waves (F6-narrative, H1/H2/H4) — which makes "this state passed 85/85" a claim
about a tree that does not cleanly correspond to any board state.

**T-wave recommendation.** T's plan-recap must treat the S board as **untrusted** and re-derive each
F/G/H wave's true state from `git ls-files` + a live gate run (as this lane did). Same
`proof:board-live` recommendation as lane 24: a board row's status must reconcile against the tree, or
it REDs.

### F7 — (POSITIVE) Band H and the F library primitives are sound and NOT the reason for rejection — ring-fence them

**Finding.** Band H (parse-that packrat arming, the span cut, the chain() falsy-seed fix) is a
sibling-repo dispatch that lands entirely below the owner's sightline — **zero overlap with the 22-item
catalogue**, exactly like band B. All of H is PENDING-IMPL (publish-coupled/dev-authored); none of it
touches the demo. Likewise F1 (View Transitions), F3 (entry/exit compile), F4 (animation-trigger), and
the F5 zero-alloc/bench work are real library wins verified on the tree (`compile/view-transition.ts`,
`compile/entry.ts`, `scroll/trigger.ts`, the boxedKeys hoist) and appear nowhere in the owner's review.
The rejection is a **demo/taste failure concentrated in band G**, not a library-uplift failure.

**The one caution (L4).** H illustrates the investment-altitude divergence without being *wrong*: the
tranche spent a full band on parse-that micro-perf (14–18% on short CSS values, PROGRESS:73) and four
SOTA library primitives, while the demo the owner actually sees janks (F2) and shows surfaces he
strikes (F4/F5). The library work is good; the *allocation* of effort relative to the owner-visible
surface is the meta-lesson T must weight.

**T-wave recommendation.** Ring-fence band H and the F library primitives as **stable, out-of-scope for
T** — spend zero T budget re-litigating them. The single F↔owner touch (the hero, F1) is a demo
consumption question, not a library one. T's budget goes to the demo rebuild that consumes this
library.

### F8 — The VT-d / EN-d demo dogfoods are the honest bright spot — but compose (the D3 fold G2 refined) is on the owner's prune list

**Defect / nuance.** F's demo twins (VT-d dogfoods the scene transition, PROGRESS:60; EN-d surfaces the
REAL `compileToEntry` artifact in the spring @starting-style card, PROGRESS:63) are the *correct* shape
of demo work — a scene consuming a real library artifact, gated by `readme-runs`. They are not in the
owner's catalogue. **But** S.G2 S10 ("compose chrome-red") refined the compose scene that S.D3 folded
in — and owner #23 rules "just straight up remove this crap; motion-path, morph, and compose likely
need to just be pruned." G2 spent a refinement item on a scene the owner wants deleted (parallel to
lane-24 F3's KfPillTabs-hardening).

**Root cause (L4).** The plan grew scenes (compose via D3, refined via G2 S10) and library-dogfood
surfaces faster than it validated them against the owner. The compose scene passed
`proof:compose-scene` (mount + ignition-drives-DrawSVG, PROGRESS:57) — a presence/behaviour oracle
green over a scene the owner prunes on sight.

**T-wave recommendation.** Prune morph/motion-path/compose per owner #23 (concur with lane 24 F2/rec 3);
preserve the VT-d/EN-d dogfood *pattern* (real-artifact-in-a-scene) as the model for how T's rebuilt
scenes should consume the library. Gate: pruned scenes removed from the router + `SCENE_DIRS` + the
gate roster in one commit (T6 excision, no orphaned `proof:compose-scene`).

---

## T recommendations

1. **Owner-taste sign-off as a PRECONDITION of authoring a design-wave born-RED gate (not a
   close-time add-on)** · scope: the T design-wave template requires a captured-render owner/Fable
   review of the *intended surface* BEFORE the wave's born-RED oracle is written — because the gate
   crystallises the disposition and green then becomes mandatory · gate shape: a design wave whose
   born-RED gate exists without a paired pre-authoring taste artifact REDs the tranche-template gate ·
   size **M**. *(Owns the L1/L2/L3 mechanism; generalises the S.E shelf lesson upstream.)*

2. **Re-wire the hero to per-char uplift + preserve a11y via fragment consolidation** · scope: rebuild
   `AnimatedText.vue` to per-grapheme spans with `aria-label` container + `aria-hidden` fragments (the
   SplitText primitive's own `role=img` consolidation) · gate shape: ≥1 animated span per grapheme in
   the hero AND `proof:split-a11y` computed-name-equality green · size **S**. *(F1 — verdict #3.)*

3. **Demo-scoped absolute perceived-perf oracle (exempt from the C-10 library ban)** · scope: a
   per-scene Chrome-trace INP/long-task + rAF-p95 budget under fixed CPU throttle on cold nav; C-10
   stays a library tenet, the demo does not inherit it · gate shape: each scene ≤ N ms p95 frame
   interval ∧ ≤ M ms INP under 4× throttle, else RED · size **M**. *(F2 — verdict #19; the owner's one
   perf axis currently has no possible oracle.)*

4. **Delete the GestureLegend layer + `proof:gesture-manifest`; re-solve affordance discovery
   glass-ui-idiomatically** · scope: excise `GestureLegend.vue` + 11 `data-gesture-tell` sites + the
   manifest gate; replace with dismissible, OFF-by-default, PRM-snapped affordance hints from a censused
   glass-ui primitive · gate shape: no persistent on-stage legend at rest; repo grep for
   `GestureLegend`/`data-gesture-tell` empty · size **M**. *(F5/F6 — verdicts #8/#11/#15.)*

5. **Restore the square (and every scene's) full controls/keyframes/timeline panel; make Play honest —
   reverse the G2 collapse** · scope: undo `SquareInstrument.vue`'s honest-collapse; the panel edits a
   real keyframe track that Play visibly drives · gate shape: Play drives the box through a user-edited
   keyframe track (not a static caption); the panel facility exists per scene (owner #25) · size **L**.
   *(F4 — verdict #12; the L1 core, and the disjunctive-spec-trap fix.)*

6. **Strip the G2 telemetry/readout/caption furniture; scenes carry only their subject + glass-ui
   controls** · scope: remove `EasingCurvePhysics.vue`, the cube `rx/ry/rz` readout, the square/amiga
   captions; easing shows "just the easing balls previewed" (owner #14) · gate shape: no free-standing
   telemetry/caption block renders at rest on any retained scene · size **M**. *(F4 — verdicts
   #5/#13/#14.)*

7. **Prune morph/motion-path/compose; preserve the VT-d/EN-d real-artifact-dogfood pattern as the
   model** · scope: remove the three scenes (router + `SCENE_DIRS` + gate roster, one commit, no
   orphaned `proof:compose-scene`); keep the "scene consumes a real library artifact" shape for T's
   rebuilt scenes · gate shape: pruned scenes absent from every registry; retained scenes each consume
   a named engine primitive · size **M**. *(F8 — verdicts #20/#21/#23.)*

8. **Ring-fence band H + the F library primitives as T non-goals; re-derive F/G/H state from git, not
   the board** · scope: an explicit T non-goal — no re-touch of parse-that dispatch, VT/entry/trigger
   emitters, or the F5 perf substrate; re-derive each F/G/H wave's true state from `git ls-files` + a
   live gate run (the board marks G3/F6/H1/H2/H4 PENDING while G3's surface is committed) · gate shape:
   (doc-level) T plan names H + F-library out-of-scope; a `proof:board-live` reds a board row that
   mis-states the tree · size **S**. *(F7/F6 — prevents wasted T re-litigation + the hybrid-tree
   confusion.)*
