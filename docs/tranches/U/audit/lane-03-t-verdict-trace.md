# Lane 03 — T-verdict-trace: re-verifying the 28 LANDED claims against master

> Fleet: Tranche U dev (32 lanes). Charter: re-verify EVERY T "LANDED" claim
> (`docs/tranches/T/FINAL.md §1` — the 28-row verdict→cure map;
> `audit/owner-review/VERDICT.md` — the owner's itemized catalogue) against the
> LIVE master tree with concrete file:line evidence. Separate real-but-invisible
> from overstated from regressed. T is merged to master (`8ed0e63`, tag `v5.2.0`);
> this lane read the shipped tree, not the board.

## Verdict-by-verdict result (28 items)

Legend: **REAL** = cure present + gate asserts it · **REAL-INVISIBLE** = cure
present but buried under un-executed structural moves the owner would look for ·
**OVERSTATED** = marked LANDED but the headline deliverable did not execute /
the gate does not enforce it · **EXTERNAL** = honestly blocked upstream.

| # | Owner verdict | FINAL says | This lane's finding | Evidence |
|---|---|---|---|---|
| 1 | cube "does not render fully" | LANDED | **REAL** — 0 `spin-energy` refs in `src/`+`demo/` | grep clean |
| 2 | typing card "remove this crap" | LANDED | **REAL** — `useHeroSourceEgg.ts` gone; only a tombstone comment survives | `EditorStartScreen.vue:51` (comment only) |
| 3 | hero per-CHAR uplift | LANDED | **REAL** — `AnimatedText.vue`/`HeroAurora.vue` present; `proof:hero-two-focal` exists | `demo/@/components/custom/instrument/shell/` |
| 4 | docks "blurry/janky" | LANDED+EXTERNAL | **REAL(kf)+EXTERNAL** — dock recut landed; blur de-blur rides glass-ui GU-1/2 | `proof:transport-play-first-render` exists |
| 5 | cube readout "remove" | LANDED | **REAL** — asserted by `proof:stage-inventory` | gate exists |
| 6 | dock cluster/play-first | LANDED | **REAL** — `proof:transport-play-first-render` | gate exists |
| 7 | "remove surrounding pane" | LANDED | **REAL** — 0 `useContractAnimGroup` refs; `SceneFacility` live | grep clean; `proof:scene-facility` |
| 8 | gesture legends "remove" | LANDED | **REAL** — `GestureLegend.vue` gone; `stage-inventory` | find clean |
| 9 | amiga "broken mess" | LANDED | **REAL** — `AmigaScene.vue` on SceneFacility | present |
| 10 | dock single-option/order | LANDED | **REAL** — `proof:no-single-option-select` | gate exists |
| 11 | square caption "nonsense" | LANDED | **REAL** — `stage-inventory` | gate exists |
| 12 | square "restore controls/keyframes" | LANDED | **REAL** — `SquareScene.vue:312` real nested-keyframes facility | present |
| 13 | curve-physics telemetry "remove" | LANDED | **REAL** — retired | gate retired |
| 14 | easing "just the balls" | LANDED | **REAL** — specimen gallery + `EasingPicker` live | `EasingSidebar.vue:3-27` |
| 15 | Gallery button "remove" | LANDED | **REAL** — retired | gate retired |
| 16 | easing "re-design; kill latent red" | LANDED | **REAL** — `EasingPicker` sole editor | present |
| 17 | spring single-option elision | LANDED | **REAL** — `proof:dfa-derived` | gate exists |
| 18 | "why not glass-ui" (KfPillTabs) | LANDED(colocate)+EXTERNAL | **OVERSTATED-lite** — `KfPillTabs.vue` + the "Kf/Pills" vanity name the owner derided still in tree; real cure deferred to glass-ui pill | `KfPillTabs.vue` present |
| 19 | "performance god awful — ground up" | LANDED(kf)+EXTERNAL | **OVERSTATED** — `proof:perf-counters` marked BLOCKING but `process.exit(0)` when headless-unmeasurable → toothless on the (about-to-be-trimmed) CI | `proof-perf-counters.mjs:186-187` |
| 20 | motion-path "barely works" | LANDED | **REAL** — demo scene pruned; library factory survives | no `scenes/*motion*` |
| 21 | morph "does not work" | LANDED | **REAL** — demo scene pruned; library MorphSVG survives | no `scenes/*morph*` |
| 22 | cursor light "right or removed" | LANDED | **REAL** — `proof:cursor-light-subtle` | gate exists |
| 23 | compose "remove this crap" | LANDED | **REAL** — no `scenes/compose` | find clean |
| 24 | fonts/sizes sitewide | LANDED | **REAL** — font-tuple gate + Jakarta/Instrument | present |
| 25 | "forgot the panel facility" | LANDED | **REAL** — SceneFacility every scene | grep |
| 26 | demo/ "re-structure from first-principles" (GRAND COLOCATION) | **LANDED (proof:colocation KEYSTONE ⑩)** | **OVERSTATED — the two ROOT structure waves never executed** (see F-1/F-2) | below |
| 27 | glass-ui "leverage latest; delineate gaps" | LANDED | **REAL** — Drawer adopted (no bespoke sheet residue); gaps letter | find clean |
| 28 | codebase refactor litany | LANDED | **REAL-with-caveat** — file-size ceilings held (all `.vue`<500, `.css`<300, `src`<500); but CI roster NOT trimmed (see F-3) | `wc -l` |

**Bottom line: 24 of 28 are REAL. The failure is concentrated in the single item
the owner cared about most — #26, the GRAND COLOCATION EDICT — plus its
CI/perf shadows (#19, #28-CI).** The good, invisible work (SceneFacility, the
instrument/ fold, the scene prunes, the file-size discipline) is genuinely
in-tree. What the owner "did not see" is real: the two moves that would make the
tree *look* restructured at a glance — `demo/@/ → demo/shared/` and dissolving
`components/custom/` — were skipped, and the keystone gate was shaped to go green
without them.

---

## Findings (severity-ranked)

### F-1 (CRITICAL) — #26 GRAND COLOCATION marked LANDED, but T.F1 + T.F2 (the two ROOT structure waves the whole band "rides") never executed

`T.md`/`waves/T.F.md:66-67,98-99` define the band's dependency root:

- **T.F1** — `demo/@/ → demo/shared/` ("the root rename; every move below rides
  its alias repoint", born-RED, lane 13 rec 1).
- **T.F2** — dissolve `components/custom/` (born-RED, lane 13 rec 2 / 14 rec 1).

Neither ran. On the live tree:

- `demo/@/` still exists (`ls demo/@` → composables/utils/state/styles/components);
  `demo/shared/` does not exist anywhere except as a *plan* string in T docs.
- `demo/@/components/custom/` still exists and is where ALL the good instrument/
  work lives (`instrument/{transport,shell,keyframes,timeline}`).
- `demo/@/styles/` — the exact path the owner named ("demo/@/styles — what the
  fuck is this?") — persists verbatim (`brand.css`, `design-idioms.css`,
  `layout.css`, `style.css`, `font-roles.json`).
- Scripts still hard-reference the `demo/@` literal (`proof-hero-two-focal.mjs`,
  `proof-decomposition.mjs`, `proof-no-dead-export.mjs`, …) — F1's own charter
  ("grep `scripts/` for every literal `demo/@/` path and repoint") is un-run.
- `PROGRESS.md:354` records the honest state at the time: *"Styles-split +
  proof:colocation deferred (premature before F1/F2 structure waves)"* — and no
  later board line ever marks F1/F2 landed.

So `FINAL.md:51` ("#26 … LANDED · `proof:colocation` KEYSTONE ⑩") overstates: the
band's two load-bearing moves are the ones that didn't happen, while the leaf
folds (instrument/, skeletons/, app/chrome→app/dock) did. That leaf work is
buried one directory deeper than the edict specifies (`instrument/` should sit at
the shared-tier root, not under `@/components/custom/`), which is precisely why
the owner's glance at `demo/` reads "unchanged."

**PROPOSAL (gestalt):** U must not "finish F1/F2 as a move." The idiomatic cure is
to make the shared-tier NAME a single source of truth and let the gate DERIVE the
tree from it: pick one canonical shared root (`demo/shared/`), colocate
`instrument/` and `skeletons/` at that root (no `components/custom/` bucket at
all — the shadcn-vendor wrapper is legacy), and repoint aliases once
(`@` → `demo/shared`). The rename is mechanical; the design act is deleting the
`custom/` concept, not relocating it.

### F-2 (CRITICAL) — `proof:colocation`, the KEYSTONE oracle, is GREEN on an uncured tree — the exact S-era pathology T was born to kill, recurring inside T

`proof-colocation.mjs` is deliberately shaped to pass without the structural
moves:

- **Tolerant root** (`:52-56`): `SHARED = ["demo/@","demo/shared"].find(exists)`
  — "so the gate survives the move." It therefore never REQUIRES the move; `@`
  passes forever.
- **DEFERRED map** (`:75-82`): holds live, uncured violations
  (`composables/gestureSelectSuppression.ts`, `utils/kfEngine.ts`) and is
  "TOLERANT: satisfied whether present-and-deferred OR already-cured." Both files
  are still physically present (verified `ls`), yet the gate exits 0:

  ```
  proof:colocation — PASS: demo/@/ shared tiers are kind-appropriate … (residuals deferred).
  EXIT: 0
  ```

This is the S root-cause #1 verbatim (`T.md:17-23`: "green source-shape gates
… passed on a tree the owner rejected on sight") reproduced by the very gate T.M
installed to prevent it. A KEYSTONE that green-lights `demo/@`, an intact
`components/custom/`, and two deferred violations is an instrument-bar gate
wearing an owner-bar label.

**PROPOSAL (gestalt):** Invert the gate from tolerant to REQUIRING. It must assert
the canonical shared name EXISTS and `demo/@`/`components/custom` DO NOT; the
DEFERRED map must be emptied by executing the moves, and any residual entry must
born-RED, not pass. A structural keystone that cannot fail on the rejected
structure is not a keystone — it is the blindspot with a certificate.

### F-3 (MAJOR) — CI/roster NOT trimmed: 227 `proof:*` keys against a declared `ROSTER_CEILING = 120`; the owner's #1 U reading is a live T carry

`gate-bands.mjs:595` sets `ROSTER_CEILING = 120`; `:665-671` declares
`proof:roster-ceiling` a born-RED backlog ("today 228"). Live count is **227**
`proof:*` keys — essentially the S-era 236, net-unchanged. T.M's headline
promise (`T.md:43`: "the FROZEN→discharge fold + roster re-shrink 203 → the
promised ~120") did not land; the ceiling is a self-declared RED that "converges
later." The U owner's opening edict ("that runner is entirely superfluous — our
CI needs to be trimmed substantially, most of it's likely tautological") lands on
exactly this unpaid bill.

**PROPOSAL (gestalt):** U owns a CI-reduction band that treats the 120 ceiling as
a HARD gate, not a converging aspiration: retire feature-coupled and tautological
gates by construction (one gate per owner-verdict axis, not per micro-tell),
collapse the FROZEN discharges, and delete the Linux-runner tier the owner ruled
superfluous. The roster is a design artifact — shrink it by removing the reasons
gates multiplied (per-tell oracles), not by masking the count.

### F-4 (MAJOR) — #19 "performance from the ground up" is marked BLOCKING but the perf oracle cannot fail headless — and the CI trim removes the browser tier it depends on

`proof-perf-counters.mjs:186-187`: when counters are unmeasurable (no browser),
it `process.exit(0)` ("unmeasurable, not passing"). `FINAL.md:44` calls it
"`proof:perf-counters` BLOCKING (⑧)." A gate that exits 0 headless is not
blocking on the runner. The real perf enforcement rides browser-only gates
(`proof:scene-rests`, `lighthouse-mobile`) — the very harness the owner's CI-trim
edict targets. So the perf edict's teeth are about to be pulled by an orthogonal
U directive unless reconciled.

**PROPOSAL (gestalt):** Give perf a headless-failable substrate — the
`portable-perf` ratio-gate (already scoped in `T.G`) computed from deterministic
frame-cost accounting, not wall-clock CDP counters. Perf that only exists behind
a browser harness the CI is dropping is perf that isn't enforced. Move the
ground-truth into a ratio invariant that runs in `vitest`.

### F-5 (MAJOR) — the good structural work is REAL-but-INVISIBLE because it is nested one level under the un-dissolved `components/custom/`

The SceneFacility inversion, the instrument/ four-peer fold, the skeletons tier,
and the KfPillTabs colocation all genuinely landed — but under
`demo/@/components/custom/instrument/…`. The edict (`waves/T.F.md:98-99`) put the
shared tier at `demo/shared/` with `custom/` deleted; the delivered tree keeps
both wrappers. The owner opens `demo/`, sees `@/` and `@/components/custom/`
(the two vendored-legacy names), and correctly reads "not restructured" even
though the internals were re-cut.

**PROPOSAL (gestalt):** This is F-1's corollary and shares its cure — the
invisible work becomes visible the moment the two wrapper concepts (`@`, `custom`)
are deleted rather than tolerated. U should treat "the owner can read the tree at
the first `ls`" as the acceptance oracle, replacing import-count locality checks.

### F-6 (MINOR) — the `Kf`-vanity surface the owner named (KfPillTabs) survives in-tree behind an external-blocked defer

`demo/@/components/custom/instrument/transport/KfPillTabs.vue` +
`composables/useKfPillTabs.ts` still carry the "Kf/Pills" naming the owner
explicitly derided (#18: "wtf are most of these items? KfPillTabs.vue?? KF?
Pills?"). `FINAL.md:43` scores it LANDED(colocate)+EXTERNAL — i.e. the offending
component was moved, not resolved; the real cure ("just be glass-ui components")
is parked on a glass-ui pill publish. The vanity name is still what the owner
sees.

**PROPOSAL (gestalt):** Don't let an external-blocked upstream justify carrying a
name the owner rejected. Either the glass-ui pill lands in U's consume-edge, or
the local component is de-vanitized now (a plain `SegmentedControl` over
glass-ui primitives) — the "Kf" prefix is legacy branding, and NO-legacy-code is
a standing U edict.

---

## What U must charter

1. **Execute the two skipped root structure waves as DELETIONS, not moves** —
   collapse `demo/@/` → `demo/shared/` and delete the `components/custom/`
   wrapper concept (lift `instrument/`, `skeletons/` to the shared-tier root);
   repoint every `demo/@` literal in `scripts/` in the same motion.
2. **Re-forge `proof:colocation` from tolerant to REQUIRING** — assert the
   canonical shared name exists and `demo/@`/`components/custom` do NOT; empty
   the DEFERRED map by landing its moves; born-RED on any residual. A keystone
   that cannot fail on the rejected tree is retired.
3. **Own a CI-reduction band with the 120 ceiling as a HARD gate** — retire
   tautological/feature-coupled/per-tell gates by construction; drop the
   owner-ruled-superfluous Linux runner tier; make `proof:roster-ceiling` GREEN
   by shrinkage, not by masking.
4. **Give the perf edict a headless-failable oracle** — a `portable-perf` ratio
   invariant computed in `vitest`, so "ground-up performance" survives the CI
   trim that removes the browser harness the current counters depend on.
5. **Re-home `demo/@/styles/`** — scoped stylesheets colocate to their component;
   only global token/idiom vocabulary remains in a shared `styles/` tier (the
   owner named this path verbatim).
6. **Retire the `Kf`-vanity surfaces now** (KfPillTabs et al.) — de-vanitize
   in-tree over glass-ui primitives rather than carrying the rejected name behind
   an external-blocked defer; NO-legacy-code is binding.
7. **Adopt "the owner can read the tree at first `ls`" as the structural
   acceptance oracle** — replace import-count locality gates, which passed on the
   tree the owner rejected on sight, twice.
