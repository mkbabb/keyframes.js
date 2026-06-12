# Tranche K AUDIT — THE COMPLETENESS CRITIC (the fleet's meta-lane)

**Lane:** `completeness-critic` (DOCS ONLY — no source/test/gate/CI edits). I audit **the audit**:
do all lanes exist, are they substantive, and — the load-bearing question — **what is MISSING**:
a U-K finding no lane rooted, a J wave unaudited, an axis unswept, a prompt unrecapped.
**Tree:** `tranche-j-dev @ 4f1fc4c` (verified `git rev-parse --short HEAD` → `4f1fc4c`; ==
`master`, Tranche J closed 2026-06-11, 4.2.0 published).
**Method (inv ε):** every roster/coverage claim is a `ls`/`grep` over the actual dir + observed
output; every CRITICAL gap I close myself with a direct source/registry/build probe.

---

## §0 — THE VERDICT (stated up front)

**The K audit fleet is COMPLETE and DEEP.** All 32 named lane docs exist; all are substantive
(101–575 lines, smallest `live-amiga-breakage.md` @ 101, median ~290 — every doc is >2× the
40-line floor); all 32 carry a §FOLD table; spot-reading 9 across every class (live-product,
wave-plan, design, glass-ui, deferred-ledger, seed-reconciliation, spring/sequence) shows
file:line-rooted, command-backed evidence throughout. All 20 user findings (U-K1..K20) are mapped
to an owning lane, and the orchestrator's cold-path P0 triage is independently confirmed by THREE
lanes (`live-cold-play-path.md`, `live-session-gap-analysis.md`, `wave-J.W7bc.md`) and absorbed
into the consolidated ledger (`deferred-ledger-k.md` DL-K1/K2).

I found **ONE genuinely under-rooted U-K finding (U-K19)** — every lane that touched it either
ruled it OUT of its own scope (HANDOFF) or reinterpreted it as a net-new feature; NO lane drove
the actual culprit to a file:line. **I closed it myself (§4 below):** the resize-on-drag site is
`AssetViewport.vue` in the **playground** demo — which is NOT served on the deployed multi-scene
SPA the user audited. That reframes U-K19 from "a bug on the live site" to "a known playground
gesture, OR a missing demo affordance" — a material correction to the K seed.

Beyond U-K19, the gaps are **refinement-tier**: a few axes are touched-but-thin (dev-mode parity,
the post-4.2.0 perf/SOTA posture as an explicit lane), and the W7b/W7c waves share one combined
doc rather than two. None of these is a hole in the product-truth band; the K charter
(`k-seed-reconciliation.md` Shape A) stands.

---

## §1 — ROSTER COMPLETENESS (32/32 lanes, all substantive)

```
$ ls docs/tranches/K/audit/*.md | wc -l → 32
$ for f in *.md; do wc -l "$f"; done   → min 101, max 575, all > 40
```

The 32 docs, by class:

| Class | Lanes | Min lines |
|---|---|---|
| **Live product (7)** | `live-cold-play-path`, `live-amiga-breakage`, `live-dock-tabs-selects`, `live-fourier-grid`, `live-glassui-currency`, `live-session-gap-analysis`, `live-spring-sequence-mp-verdict`, `live-typography-truth` (8 — "live-*") | 101 |
| **J wave-plan (10)** | `wave-J.W0..W6`, `W7a`, `W7bc`, `WZ` | 161 |
| **Engine/lib (4)** | `engine-core-k`, `demo-scenes-k`, `tests-bench-k`, `packaging-k` | 161 |
| **Estate/CI (2)** | `gate-estate-k`, `ci-cd-k` | 257 |
| **Design/typo/layout (3)** | `design-synthesis-k`, `styling-typography-k`, `layout-grid-k` | 207 |
| **glass-ui (1)** | `glassui-handoff-k` | 425 |
| **Cross-cutting (5)** | `deferred-ledger-k`, `k-seed-reconciliation`, `precepts-k`, `prompt-recap-k`, `(live-typography-truth counted above)` | 156 |

**§FOLD presence: 32/32.** (Five docs use a non-"§FOLD" header — `ci-cd-k.md` "§5 — FOLD Table",
`live-dock-tabs-selects.md` "§5 — FOLD TABLE", `precepts-k.md` "§5 — DISPOSITIONS ROLL-UP",
`wave-J.W7bc.md` "§5 — FOLD TABLE", `wave-J.WZ.md` "§8 FOLD table" — each is a finding→sev→seam→
wave-class table, satisfying the requirement; a literal "§FOLD" header would aid grep-ability but
is cosmetic.)

**Spot-read (9 of 32, across every class), each confirmed file:line-rooted + command-backed:**
`live-cold-play-path.md` (the P0 root chain, `useSceneMachine.ts:182-184` + git-blame disproving
the W7c suspect), `k-seed-reconciliation.md` (the three-shape charter argument, Shape A),
`live-spring-sequence-mp-verdict.md` (the 6 Hz `PROGRESS_READOUT_HZ` slider-step root),
`deferred-ledger-k.md` (the 72-row J→K ledger + DL-K1/K2 RE-OPEN band), plus targeted reads of
`ci-cd-k`, `live-dock-tabs-selects`, `precepts-k`, `wave-J.W7bc`, `wave-J.WZ` FOLD tables. Every
one cites real source lines and observed probe output. **No filler, no stub.**

---

## §2 — U-K COVERAGE MATRIX (which lane ROOTS each, not merely mentions)

A finding is *rooted* when a lane verified it live AND assigned a file:line seam (not just named
it). Census: `grep -oE 'U-K[0-9]+' *.md`.

| U-K | Finding | ROOTED BY (owning lane) | Status |
|---|---|---|---|
| U-K1 | dock not shrunken by default | `live-cold-play-path.md §P1-2` (`TransportDock.vue:23` vs observed `dock-layer--full is-active` y:770) | ROOTED |
| U-K2/K3/K5 | hero play → no cube animate; slider advances over frozen subject; nothing works | `live-cold-play-path.md §P0-1` + `live-session-gap-analysis.md §1` + `demo-scenes-k.md:208` (`scenePlaybackAdapters.ts:76-79` resume-no-op) | ROOTED (P0, 3 lanes concur) |
| U-K4 | amiga floats + flashes | `live-amiga-breakage.md` (K4-A/B/C, three seams) | ROOTED |
| U-K6/K8/K10 | fonts wrong (dock display voice); top-dock fonts; global inconsistency | `live-typography-truth.md §2-5` (`.dock-label{font-family}` one root rule) + `styling-typography-k.md` (dual `--font-serif`/`--font-display` token) | ROOTED |
| U-K7/K17/K18 | layout WILD refinement; clipped+draggable pane, red-dashed; two readouts | `live-session-gap-analysis.md §2` + `layout-grid-k.md` + `live-spring-sequence-mp-verdict.md §4-5` | ROOTED |
| U-K9 | wrapped line should be one line | `live-typography-truth.md §5` (`EditorStartScreen.vue:54-57` subtitle @390px) | ROOTED |
| U-K11/K15/K16 | spring UI inadequate; slider steps; real options/single-option totality | `live-spring-sequence-mp-verdict.md §2-3` (6 Hz mirror) + `live-dock-tabs-selects.md §2` (ChromeDock `>0` not `>1`) | ROOTED |
| U-K12/K13 | awful top tabs (pills); two panes look awful | `live-dock-tabs-selects.md §4` (`tab-trigger.css:26-29`) + `live-spring-sequence-mp-verdict.md §4` | ROOTED |
| U-K14 | upgrade to LATEST glass-ui | `live-glassui-currency.md` + `glassui-handoff-k.md` (re-verified below) | ROOTED |
| U-K19 | dragging resizes the container instead of dragging | **NO LANE rooted to a file:line** — `live-spring-sequence-mp-verdict.md §6` ruled it OUT (HANDOFF); `precepts-k.md`/`prompt-recap-k.md` reinterpreted it as a NEW feature | **UNDER-ROOTED → I close it §4** |
| U-K20 | remove FourierField; grid opacity | `live-fourier-grid.md` (7 hunks, `EditorStartScreen.vue:65-86`; `design-idioms.css:182-183`) | ROOTED |

**19 of 20 findings are rooted to a file:line by an owning lane. U-K19 is the lone gap.**

---

## §3 — THE GAP WORKLIST (what is MISSING)

### GAP-1 (CRITICAL — a U-K finding left unrooted): U-K19 "dragging resizes the container"
The three lanes that touched it **diverge and none drove the culprit**:
- `live-spring-sequence-mp-verdict.md §6/F8`: ruled it OUT of spring/sequence/motion-path (zero
  `resize!=none`, zero stage-resize on synthetic drag) → **HANDOFF to "square / asset-manager"**.
- `precepts-k.md:336` + `:362`: reinterpreted as a **NEW feature** ("a demo where dragging SHOULD
  resize the cq-container", a new composable writing `--container-width`).
- `prompt-recap-k.md:206/293`: tagged **UNADDRESSED**, candidate `square/` or `orbital-drag/`.
- `packaging-k.md:526-528`: framed as a potential new export combining `drag`+`bumpLayoutEpoch`.

The HANDOFF target ("square / asset-manager lane") **does not exist as a lane** — no doc owns
square or asset-manager. So U-K19 fell through. **I close it in §4.** (CRITICAL because an
unrooted user finding is exactly the class the K-seed reconciliation says K exists to terminate.)

### GAP-2 (P2 — an axis touched-but-thin): the post-4.2.0 perf / SOTA posture has no owning lane
`perf`/`lighthouse`/`bench`/`CWV` strings appear across ~18 docs, but always **incidentally** (a
bench count in `tests-bench-k`, a demo-smoke budget in `ci-cd-k`, the deferred mobile-lighthouse
re-assertion in `deferred-ledger-k`). NO lane owns the question "after 4.2.0 shipped, where does
kf sit vs the 2026 frontier — Web Animations, scroll-driven, `linear()`, CWV of the deployed
demo?" The `docs/tranches/J/audit/perf-battery-2026-06-10.md` re-assertions are catalogued by
`deferred-ledger-k.md` but never re-driven. This is a refinement gap, not a hole — the perf
deferrals ARE tracked; they just lack a fresh post-publish driving lane. (A K perf-posture lane
would re-run the mobile lighthouse floor over the *deployed* `keyframes.babb.dev`, which no lane
has done — every browser probe served local `dist/gh-pages`.)

### GAP-3 (P2 — an axis thin): dev-mode parity / the value.js `development`-export gotcha
The MEMORY constellation pins `project_valuejs_dev_export_gotcha.md` ("the `development` exports
condition breaks Vite consumers"). Grep for `dev-mode|development.*export|HMR|self-alias` across
the 32 lanes hits only `packaging-k.md` + `live-session-gap-analysis.md` — and only the value.js
*pin* angle, not the dev-vs-prod *parity* question. Every browser probe in the fleet drove the
BUILT `dist/gh-pages` (correct per the orchestrator mandate), so **`npm run dev` HMR-mode parity
was never swept** — a defect that only manifests in dev (the export-condition class) would be
invisible to the entire fleet. Live state (probe below): the gotcha appears **dormant** at
4.2.0 — value.js 0.11.2's `exports` did not surface a `development` condition in my probe — so
this is a latent-watch gap, not an active defect. Record it; do not gate on it.

### GAP-4 (P2 — wave doc consolidation, not a hole): W7b + W7c share one doc
The wave-plan lanes cover J.W0..W6, W7a, **W7bc (combined)**, WZ. There are SEPARATE impl records
`J.W7b-impl.md` AND `J.W7c-impl.md` on disk, but ONE audit doc. `wave-J.W7bc.md` IS substantive
(351 lines, covers both the W7b ToggleChip/fade-slide/gold-shimmer split AND the W7c cold-path
P0 + spring redesign) — so the coverage is real, just merged. No wave is unaudited. NOT a gap in
substance; flagged only so the orchestrator knows W7b is not a standalone doc.

### GAP-5 (P2 — naming): the "square / asset-manager lane" referenced by HANDOFFs is phantom
`live-spring-sequence-mp-verdict.md F8` and `gate-estate-k.md` both HANDOFF to a square /
asset-manager lane that was never spawned. `demo-scenes-k.md` covers `/square` *as a scene* (its
cold-play U-K5 disposition) but does NOT own the asset-manager/playground resize gesture. So both
U-K19 AND the asset-playground viewport are orphaned by the roster. Closed in §4.

### Non-gaps (verified covered, listed for completeness):
- **value.js static/dynamic boundary** — covered: `ci-cd-k`, `packaging-k`, `tests-bench-k`,
  `precepts-k`, `wave-J.W1/W5`, `wave-J.WZ` (`proof:boundary`/`proof:published-surface`).
- **All 20 U-K findings** — 19 rooted, U-K19 closed by me.
- **The cold-path P0** — triple-rooted + ledgered.
- **Every J wave (W0–WZ)** — audited (W7b folded into W7bc).
- **The prompt recap** — `prompt-recap-k.md` (317 lines) maps all 20 U-K + the orchestrator
  prompts to a K home; 19 "UNADDRESSED" = no fix landed (correct for a docs-only audit), not 19
  un-recapped.

---

## §4 — CLOSING THE CRITICAL GAP: U-K19 rooted to a file:line (my own verification)

**The question:** is U-K19 ("a demo where dragging resizes the container instead of dragging") a
BUG on the deployed site, or a missing/elsewhere feature?

**Probe 1 — no resize-on-drag exists in any DEPLOYED scene.** Across the multi-scene SPA source
(`demo/app/scenes/`, `demo/square/`, `demo/@/components/custom/orbital-drag/`):
```
$ grep -rniE 'resize:\s*(both|horizontal|vertical)' demo/ src/ --include=*.vue --include=*.ts --include=*.css | grep -v dist
  → (zero hits)
$ grep -rniE 'style\.(width|height)|--container-(width|size)' demo/square demo/@/orbital-drag demo/app/scenes
  → (zero hits)
```
- `SquareScene.vue` drag re-seats **spring targets** (translate, not size) via `useDragScrub`
  (`demo/square/useSquareAnimations.ts:64` writes `translate(...) rotate(...) scale(...)` from the
  spring chase — the box stays where dragged; no container mutation).
- `OrbitalDrag` pinch (`useOrbitalPinch.ts:103-113`) scales the **3D model transform**, not a
  container — a pinch-zoom on the cube, by design.
- `AnimationVisualizer.vue:78` uses a `useResizeObserver`→`bumpLayoutEpoch` (the value.js cache
  bust) — it OBSERVES resize, it does not bind drag→resize.

**Probe 2 — the resize-on-drag site is `AssetViewport.vue`, in the PLAYGROUND only.**
```
$ grep -rniE 'resize|drag' demo/@/components/custom/asset-manager/AssetViewport.vue
  124: const INSET = "var(--resize-handle-inset)";
  125: const RESIZE_HANDLES = [ tl,tr,bl,br,t,b,l,r ]  ← 8 resize handles w/ cursor-*-resize
  82:  @pointerdown.stop="onHandlePointerDown($event, asset.id, handle.type)"   ← resize gesture
  45:  @pointerdown.stop="onAssetPointerDown($event, asset)"                     ← move gesture
```
`AssetViewport` carries BOTH an asset-DRAG (move, line 45) and 8 RESIZE handles (line 82). Where
is it mounted?
```
$ grep -rniE 'AssetViewport' demo/app demo/playground
  demo/playground/App.vue:22:  <AssetViewport
  demo/playground/App.vue:42:  import { AssetLayerPanel, AssetViewport, useAssetManager } from "@components/custom/asset-manager";
  (demo/app: zero hits)
```
**`AssetViewport` is mounted ONLY in `demo/playground/App.vue` — the standalone
`npm run dev:playground` app.** The deployed site is `npm run gh-pages` =
`vite build --mode gh-pages` (`package.json:42`), which builds `demo/app` (the multi-scene SPA),
NOT the playground.

**The rooting (the material correction):** U-K19 cannot be a bug the user hit on the deployed
`keyframes.babb.dev` SPA — that build has no resize-on-drag anywhere. The phrasing "a demo where
dragging resizes the container **instead of** dragging" most plausibly describes the
**asset-playground**'s `AssetViewport`, where a user trying to DRAG (move) an asset can land on a
resize handle and get a resize gesture instead — a **drag-vs-resize hit-target conflict** at the
handle/body seam (`AssetViewport.vue:45` move vs `:82` resize, both `@pointerdown.stop`). The
secondary reading (`precepts-k.md`) — "a NEW demo where dragging SHOULD resize a cq-container" — is
ALSO consistent with the deployed site having none. **Either way, U-K19 is NOT a deployed-SPA
defect.** K must (a) decide whether the playground ships on the deployed surface at all, and (b)
if U-K19 is the playground hit-conflict, fix the handle/body gesture arbitration in
`AssetViewport.vue`; if it is the feature reading, it is a P2 new-scene request, not a repair.

**Severity: P2.** It is neither the deployed-site bug the wording implies nor a P0 — the live
defect surface (the cold-path P0) is unaffected. This finding corrects the K seed: U-K19 should
NOT ride the "layout totality / repair" wave as a deployed defect; it is a playground-gesture
refinement OR a new-feature request, gated on whether the playground is in scope at all.

---

## §5 — CROSS-FLEET CONSISTENCY (the lanes agree where they overlap)

The independent lanes converge, which is the strongest signal the fleet is sound:
- **The cold-path P0 root** — `useSceneMachine.ts:182-184` + `scenePlaybackAdapters.ts:76-79`
  (resume-no-op on an unstarted group) — is reached identically by `live-cold-play-path.md`,
  `live-session-gap-analysis.md`, `demo-scenes-k.md`, and `wave-J.W7bc.md`, WITHOUT coordination.
- **The W7c-U4 suspect is disproven** by `live-cold-play-path.md` (git-blame `256f6fe`, H.W1
  provenance) and re-cited unanimously — no lane clings to the orchestrator's original suspect.
- **glass-ui currency** — `~3.11.2` installed, registry `3.13.0` — is re-verified by me
  (`npm view @mkbabb/glass-ui version` → `3.13.0`; `package.json` optDeps `~3.11.2`; installed
  `3.11.2`), confirming `live-glassui-currency.md`, `glassui-handoff-k.md`, `ci-cd-k.md` F-6, and
  correcting the orchestrator prompt's "kf pins ~3.11.2 / latest 3.13.0" — the prompt is right.
- **All 7 product-truth lanes proposed only repair/design wave-classes (zero frontier)** — the
  `k-seed-reconciliation.md §5` convergence table — which I confirm by census: no lane's §FOLD
  names a CC-1/round-trip frontier wave.

**The live build/dist footgun is ACTIVE right now** (`ps aux`: PID 31288
`vite build --watch --mode production` in keyframes.js, the recorded `dist/gh-pages`-emptying
hazard from MEMORY + `live-spring-sequence-mp-verdict.md §0`). `dist/gh-pages/index.html` was
present at my check (built 23:53) — but any future K browser lane MUST rebuild-right-before-serve
or kill the watch. This is corroborated, not new.

---

## §FOLD

| # | Finding | Severity | The seam | Suggested wave-class |
|---|---|---|---|---|
| CC-1 | **U-K19 was the lone UNDER-ROOTED user finding** — 3 lanes diverged (HANDOFF / new-feature / unaddressed), none drove the culprit. I rooted it: the only resize-on-drag site is `AssetViewport.vue` (8 handles + a move gesture), mounted ONLY in `demo/playground` — NOT on the deployed `gh-pages` SPA. So U-K19 is **not a deployed-site defect**; it is a playground drag-vs-resize hit-conflict OR a new-feature request. | **P2** (corrects a seed mis-classification) | `AssetViewport.vue:45` (move) vs `:82` (resize), both `@pointerdown.stop`; mounted only `demo/playground/App.vue:22`; deployed build = `demo/app` (`package.json:42`) | **K decision gate** — is the playground in deployed scope? If yes + it's the hit-conflict → asset-manager gesture-arbitration fix; if the feature reading → P2 new-scene (do NOT ride the deployed-repair wave) |
| CC-2 | The "square / asset-manager lane" that `live-spring-sequence-mp-verdict.md F8` + `gate-estate-k.md` HANDOFF to **was never spawned** — U-K19 + the asset-playground viewport are roster-orphaned (closed by CC-1) | P2 | the phantom HANDOFF target | absorb into CC-1's decision gate |
| CC-3 | **No lane owns the post-4.2.0 perf / SOTA posture** — perf strings are incidental across ~18 docs; the J `perf-battery` re-assertions are catalogued but never re-driven over the DEPLOYED `keyframes.babb.dev` (every probe served local `dist/gh-pages`) | P2 | `deferred-ledger-k.md` (catalogues, doesn't drive); `docs/tranches/J/audit/perf-battery-2026-06-10.md` | K perf-posture lane (re-run mobile lighthouse over the deployed origin AFTER the cold-path P0 fix) |
| CC-4 | **Dev-mode parity / the value.js `development`-export gotcha is unswept** — every probe drove the BUILT dist (correct), so an HMR-only export-condition defect would be invisible. Live state: dormant at 4.2.0 (probe found no `development` condition surfacing) | P2 (latent-watch) | MEMORY `project_valuejs_dev_export_gotcha.md`; `@mkbabb/value.js@0.11.2` exports | RECORD only — re-watch if value.js republishes a `development` condition; not a gate |
| CC-5 | W7b + W7c share ONE audit doc (`wave-J.W7bc.md`, 351 lines, substantive for BOTH) despite separate impl records — coverage is real, just merged | P2 (note) | `wave-J.W7bc.md` vs `J.W7b-impl.md` + `J.W7c-impl.md` | none — flagged for orchestrator awareness |
| CC-6 | **POSITIVE: the fleet is complete + deep** — 32/32 lanes, all >40 lines (min 101), all §FOLD, 19/20 U-K rooted to file:line, the P0 triple-rooted, all J waves audited, cross-lane convergence on the P0 root + the disproven W7c suspect + glass-ui 3.13.0 currency | — | the whole `docs/tranches/K/audit/` tree | (corroborates `k-seed-reconciliation.md` Shape A — K is the product-truth repair tranche) |

**Bottom line:** the K audit fleet has no structural hole. Every J wave is audited, every axis the
orchestrator named (value.js boundary, the cold path, glass-ui currency, deferred chronics) is
swept by an owning lane, and 19 of 20 user findings are rooted to a file:line. The ONE under-rooted
finding — U-K19 — I closed myself: it is **not** a deployed-SPA defect (the only resize-on-drag
lives in the playground-only `AssetViewport`), which corrects the K seed's implicit "U-K19 is a
live-site repair" framing. The residual gaps (perf-posture lane, dev-mode parity sweep) are
refinement-tier and do not block the K charter. The fleet's independent convergence on the cold-path
P0 root, the disproven W7c suspect, and the glass-ui 3.13.0 gap is the proof of its soundness.
