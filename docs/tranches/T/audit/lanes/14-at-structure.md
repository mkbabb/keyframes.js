# Lane 14 — `demo/@` structure audit (VERDICT #26: "totally half baked and inconsistent")

**Scope.** Every file under `demo/@/` (107 files: 37 `.vue` / 61 `.ts` / 7 `.css` / 2
Monaco-theme `.json`; 15,370 combined LOC). Evidence gathered by: full-tree
census, `node scripts/proof-shared-has-n-consumers.mjs --dump` (the live C-23
gate), direct grep of import edges, and reading `node_modules/@mkbabb/glass-ui`
source to separate a genuine gap (keep the fork) from a naming complaint (fix
the fork). This lane is written standalone per the harness contract; the
synthesis pass reconciles it against lane 13's `app/`/`scenes/` tree.

**The headline instrument fact, stated up front:** `proof:shared-has-n-consumers`
is **100% GREEN today** — every `@/` module clears its C-23 consumer-count bar.
The owner's "half baked and inconsistent" verdict is **not contradicted by
that gate** — the gate only proves a module is *used* by ≥2 areas; it says
nothing about whether the module is *named*, *homed*, or *shaped* coherently.
This is the same gate-blindspot lesson (MEMORY: "green source-shape gates miss
appearance/interaction/state") recurring on the **structure** axis instead of
the **appearance** axis: every finding below is a green-gate / owner-red
divergence.

## Census

| Area | Files | LOC | Consuming areas (C-23) | Cohesion |
|---|---|---|---|---|
| `state/` | 8 (+1 barrel) | 1,512 | 12 (app + 7 scenes + 4 `@/` peers) | **GOOD** — flat, one barrel, pure-core/reactive-effect split (`sceneMachine.ts`/`controlSurfaceDFA.ts` pure; `useSceneMachine.ts` the effect layer). Model for the rest of the tree. |
| `components/custom/animation-transport/` | 34 across 4 nested dirs | ~4,900 | 8 | Mixed — see F1/F2/F3 below |
| `components/custom/keyframes-editor/` | 16 across 3 dirs | ~1,750 | 3 | No barrel (F4) |
| `components/custom/keyframe-timeline/` | 13 across 3 dirs | ~1,300 | 1 external + animation-transport peer (legal per C-23 dir-sub-zone rule) | No barrel (F4) |
| `components/custom/easing-editor/` | 4 flat | ~1,080 | 2 | No barrel (F4); deep-imported by 3 outside sites |
| `components/custom/editor-shell/` | 7 vue + 2 flat composables + barrel | ~1,270 | 1 (app) — allowlisted, C-23 tension recorded in-gate | Composables NOT sub-foldered, unlike its 3 siblings (F4) |
| `components/custom/{CopyButton,GestureLegend,KfPillTabs+useKfPillTabs}` | 4 flat | ~330 | 4 / 4 / 2+3 | `components/` has exactly **one** child dir (`custom/`) — vestigial (F1); `GestureLegend` is VERDICT #8's kill target (flag only, owned by lane 07); `KfPillTabs` naming is VERDICT #18's specific complaint (F5) |
| `composables/` | 3 | ~330 | 4 / 5 / 4 | `gestureSelectSuppression.ts` is not a Vue composable — misfiled (F6) |
| `utils/` | 4 | ~250 | 3 / 2 / 13 / 2 | `kfEngine.ts` is boot infrastructure wearing a "util" label (F7) |
| `styles/` | 3 | 1,551 | exempt (CSS, untraced) | Named verbatim in the VERDICT (F8) |

## Findings

### F1 — `components/custom/` is a vestigial nesting tier (the shadcn ghost)

**Defect.** `demo/@/components/` has exactly one subdirectory: `custom/`.
Confirmed on disk:

```
$ ls demo/@/components/
custom/
```

**Root cause.** `custom/` existed to distinguish hand-authored components from
the shadcn `ui/` island (`ui/menubar/`). That island was migrated off and
deleted at S.C3b (demo/CLAUDE.md: *"components/ui/ is GONE — the last shadcn
island... was migrated off + deleted"*). The distinguishing sibling is dead;
the qualifier it distinguished FROM no longer exists, so `custom/` now
qualifies nothing. Every path in the shared library — `@components/custom/…`
— carries a dead segment, and worse, several deeply-nested files then contain
the literal word "components" **three times** in one path
(`@/components/custom/animation-transport/components/DemoGlobalChrome.vue`),
which is exactly the kind of self-referential noise a first-principles
"recursively" re-structure (VERDICT #26) is asking to be rid of.

**T recommendation.** Collapse `components/custom/*` → `components/*` (delete
one directory level, `git mv`, repoint the ~40 `@components/custom/…` import
sites to `@components/…`). Mechanical, zero behavior change,
`proof:shared-has-n-consumers` module IDs simply drop the `custom/` segment
(the script's `sharedModuleId()` already treats `components/<dir>` as the
unit — the `custom` special-case at line 174 is deleted in the same commit).

### F2 — Two `<style src>` CSS-splits exist ONLY because of the 500L gate, not a real seam (self-admitted)

**Defect.** `AnimationControlsGroup.vue`(285L) + `AnimationControlsGroup.css`(223L)
= **508L combined**. `ControlsPaneWrapper.vue`(199L) + `ControlsPaneWrapper.css`(302L)
= **501L combined**. Both trip `proof:demo-no-oversize`'s 500L ceiling the
instant the style block is folded back into the SFC — and the split's own
header comments say so, verbatim:

> `AnimationControlsGroup.css:1-5`: *"Carved from the SFC at the S.A0-regression
> cure: **the 500L demo ceiling is a tripwire**, and the style tier is this
> component's natural concern seam."*

**Root cause.** `scripts/proof-demo-no-oversize.mjs` only scans `SOURCE_EXT =
new Set([".ts", ".vue"])` — a sibling `.css` file is **invisible to the gate**.
Extracting a `<style>` block to `import "./X.css"` (or `<style scoped
src="./X.css">`) reduces the *measured* file below 500L while leaving the real
combined complexity **unchanged** (508L and 501L respectively — both still
over the ceiling by the gate's own stated bar, just laundered across an
uncounted extension). This is a mechanical instance of exactly what the
litany forbids: *"NO quick solutions, NO workarounds… no legacy code"* — the
gate was dodged, not satisfied. A third instance of the identical pattern:
`DemoGlobalChrome.vue`'s own header comment reads *"extracted from the
AnimationControlsGroup layout root as a colocated sub-component (**the J.W7a
fix-round proof:demo-no-oversize seam**)"* — three separate carves, same
motivating gate, same shape: move mass to a place the gate doesn't look,
rather than genuinely decompose. `PlaybackRibbon.vue`(198L)+`playback-button.css`(90L)
and `AnimationControls.vue`(452L)+`tab-trigger.css`(80L) are a **different
kind** of `<style src>` use (shared skins consumed structurally as a named
idiom — not a size dodge) and are not part of this finding.

**T recommendation.** Extend `proof:demo-no-oversize`'s `SOURCE_EXT` to include
`.css`, OR — better, since the litany prefers a real cure over a wider net —
sum a `.vue` + its same-basename sibling `.css` as one unit before the 500L
compare. Then genuinely decompose the two over-ceiling components by markup
concern (`AnimationControlsGroup.vue` already has `ControlsPaneWrapper` +
`SheetGrabHandle` siblings; the desktop-grid vs. mobile-sheet halves are the
natural cut) rather than re-parking the same lines behind a different file
extension. `DemoGlobalChrome.vue` is relocated per F3, which removes its
share of the pressure without a re-split.

### F3 — `DemoGlobalChrome.vue` is document-global chrome misfiled three directories into a feature peer

**Defect.** `DemoGlobalChrome.vue` mounts exactly two things: a hidden SVG
`<defs>` paint-server registry (`#rainbow-gradient`, resolved by `url()`
references anywhere in the document) and a `<Teleport to="html"><Toaster/>`.
Its own header comment: *"The demo's DOCUMENT-LEVEL singletons… **Neither is a
layout concern**: both resolve against the DOCUMENT… not the controls grid."*
Yet it lives at
`demo/@/components/custom/animation-transport/components/DemoGlobalChrome.vue`
— nested inside the playback-controls feature peer, mounted from exactly one
call site (`AnimationControlsGroup.vue:105`), for a reason that has nothing to
do with animation transport (see F2: it was carved out of that file to
relieve its line count).

**Root cause.** `demo/CLAUDE.md`'s own taxonomy already names the correct
home: *"`app/` is… the shell"* and `app/chrome/` already holds
"app-private glass-ui dock" — i.e., exactly the class of document-level,
mounted-once, shell-scoped singleton `DemoGlobalChrome` is. It ended up in
`@/` purely because it was extracted from a `@/` file, not because it is
genuinely a shared library concern (it has 1 consumer, always will — a toast
root and an SVG defs registry are singletons by definition, not something a
second area could ever "reuse").

**T recommendation.** Move `DemoGlobalChrome.vue` to `demo/app/chrome/` (or
mount its two children directly in `App.vue`, which is arguably the more
honest shape for a true singleton — no wrapper component at all). Falsifiable:
`proof:app-is-shell` (cited in the S.D2 allowlist for `editor-shell` as the
gate that constrains what may live under `app/`) should accept a
document-singleton file in `chrome/`; `proof:shared-has-n-consumers` loses one
more single-external-consumer directory entry once the file leaves `@/`.

### F4 — the barrel-export convention is applied to 2 of 5 sibling feature peers, ad hoc

**Defect.** `components/*` hosts 5 structurally-identical multi-file feature
peers (`animation-transport`, `easing-editor`, `editor-shell`,
`keyframe-timeline`, `keyframes-editor`). Only 2 export an `index.ts` barrel
(`animation-transport`, `editor-shell`); the other 3 do not, so external
consumers reach past the directory into named files directly:

```
demo/scenes/easing/EasingSidebar.vue:139:   import EasingEditor from "@components/custom/easing-editor/EasingEditor.vue";
demo/scenes/easing/EasingHeroStage.vue:130:  import DemoControlPoint from "@components/custom/easing-editor/DemoControlPoint.vue";
demo/scenes/spring/SpringSidebar.vue:163:   import KeyframesEditor from "@components/custom/keyframes-editor/KeyframesEditor.vue";
```

Separately, `editor-shell/` keeps its 2 composables (`useHeroSourceEgg.ts`,
`useShareState.ts`) **flat** beside its `.vue` files, while its 3 siblings
that have composables (`animation-transport`, `keyframe-timeline`,
`keyframes-editor`) all sub-folder them into `composables/`. Same kind of
module, two different homes depending on which peer you're standing in.

**T recommendation.** One rule for all 5 peers: every multi-file
`components/<feature>/` gets an `index.ts` barrel (named exports only — no
default-export ambiguity) and, if it owns ≥1 composable, a `composables/`
subfolder. Apply to `easing-editor`, `keyframe-timeline`, `keyframes-editor`
(add barrels) and `editor-shell` (fold its 2 flat composables into
`composables/`). Falsifiable: a small `proof:at-peer-shape` gate — for every
`components/<dir>` with ≥2 files, assert an `index.ts` exists and every
`use*.ts` sibling lives under a `composables/` child, not flat.

### F5 — `KfPillTabs.vue` is a genuine glass-ui gap wearing a confusing name (VERDICT #18)

**Defect.** VERDICT #18 quotes the owner: *"wtf are most of these items?
KfPillTabs.vue?? KF? Pills? Why aren't these just glass-ui components?"*

**Root cause, verified against the installed 4.0.1 source (not assumed).**
`node_modules/@mkbabb/glass-ui/dist/tabs.js:305-306`:

```js
role: I.value ? "tablist" : "group",
"aria-orientation": L.value ? "vertical" : "horizontal",
```

`aria-orientation` is bound **unconditionally**, regardless of `role`. When
`I.value` is false the container renders `role="group"` (a non-composite
container) while still carrying `aria-orientation` — the exact WCAG breach
`KfPillTabs.vue`'s own header comment describes (*"glass-ui 4.0.1's
SegmentedTabs emits the orientation attribute UNCONDITIONALLY on its
`role=group` pill variant"*) is **still present today**, verified live, not
from a stale comment. So the fork is **legitimate** — deleting it and
consuming `SegmentedTabs` directly would reintroduce a real a11y defect. The
owner's complaint is the *naming*, not the *existence*: "Kf" is the only
component-name prefix of its kind anywhere in the 37-file `.vue` corpus (every
other shared component reads as a plain noun — `CopyButton`, `EasingSelect`,
`EditorShell`), so it reads as a stray internal abbreviation leaking into the
public surface.

**T recommendation.** Keep the component (documented a11y necessity), rename
it off the "Kf" abbreviation (e.g. `PillTabStrip.vue` / `usePillTabRoving.ts`
— a plain descriptive noun matching every sibling), and open the glass-ui
upstream ask explicitly per VERDICT #27 ("delineate glass-ui's gaps"): file
the `aria-orientation` conditional-on-`role` fix against `SegmentedTabs`, with
this fork's fate ("retire once upstream ships it") recorded as the
falsifiable exit condition, not left as an undocumented permanent fork.

### F6 — `composables/gestureSelectSuppression.ts` is not a Vue composable

**Defect.** `demo/@/composables/` holds 3 files. Two (`useDoubleTap.ts`,
`useDragScrub.ts`) use Vue's Composition API (`ref`/`reactive`/lifecycle
hooks — confirmed: 2 and 4 reactive-primitive call sites respectively).
The third, `gestureSelectSuppression.ts`, is a plain module-scope counter
with two exported functions (`acquireSelectSuppression`/
`releaseSelectSuppression`) that toggle a `document.body` class — zero Vue
imports, zero reactive state, no `use*` name. It is, in shape, byte-for-byte
the same kind of module as `demo/@/utils/toastGuard.ts` (a plain
predicate/imperative pair guarding a DOM contract) — which correctly lives in
`utils/`, not `composables/`.

**T recommendation.** Move `gestureSelectSuppression.ts` → `utils/`. Zero
consumers change shape (still a named function import); `composables/`
becomes a true "Vue composable" tier — 2 files, both genuinely reactive — and
the naming convention (`use*` = composable) holds without exception.

### F7 — `kfEngine.ts` is the tree's widest-fanout module, filed as a "util"

**Defect.** The `--dump` census: `utils/kfEngine.ts: 13 consuming areas` — the
single widest fan-out of any module in `demo/@/`, wider even than `state/`'s
12. It is not a generic helper: it is the demo's synchronous accessor over the
package's `loadAnimationEngine()` dynamic boundary (`warmKfEngine`/
`kfEngine`/`kfEngineReady`), the ONE seam every scene's playback path resolves
through. Its own header comment calls it *"the demo's HEAVY-ENGINE ACCESSOR"*
and frames it as boot-time dogfood infrastructure, not a DOM/text utility —
it sits in `utils/` beside `clipboard.ts` (2-consumer clipboard-write
wrapper) and `iosTextEntry.ts` (2-consumer iOS keyboard quirk shim) only by
drawer-of-last-resort convention.

**T recommendation.** Promote `kfEngine.ts` out of `utils/` to sit beside
`state/` as its own top-level `@/` peer (it is, structurally, the
demo's runtime-infrastructure sibling to the reactive-state peer — both are
"the global thing every scene reaches through," not "a small DOM helper").
Given it is one 59L file, folding it as `state/kfEngine.ts` (re-exported from
`state/index.ts`) is the lower-churn option if a bare new top-level dir is
judged too small to earn its own seat — either resolves the mismatch; leaving
it in `utils/` does not.

### F8 — `styles/` conflates five orthogonal concerns and retains ~130 lines of tombstone comments for code that no longer exists

**Defect.** VERDICT #26 names this file directly: *"demo/@/styles — what the
fuck is this?"* `style.css` (636L) contains, in one file: (1) Tailwind/glass-ui
import wiring + font-face declarations, (2) ~250 lines of dock-band
anchor/z-index/work-area clamp-and-calc **layout physics** (the
`--dock-{top,bottom}-anchor`, `--work-area-*`, `--dock-*-reserve` token chain
and its `@supports (anchor-name: …)` progressive-enhancement twin), (3) the
`@layer base` reset, (4) three unrelated `@layer utilities` classes
(`.container-inline-size`, `.icon`, `.is-disabled`), (5) one `@layer
demo-typography` override. `design-idioms.css` (887L) additionally retains
**four dead blocks** that document code no longer in the tree — pure
tombstone comments, not code:

```
design-idioms.css:425  "── .scale-on-hover — DELETED (H.W2.S4, no-legacy) ──"
design-idioms.css:446  "── the tracked-specular subsystem is REMOVED (H.W9.F3+F6) ──"
design-idioms.css:472  "── .gold-shimmer — DELETED (J.W7b S1g / STY-1, no-legacy) ──"
design-idioms.css:698  "── .dock-inset — DELETED (H.W10.S5/G8) ──"
```

**Root cause.** Two distinct problems compound into "what the fuck is this":
(a) a genuine cohesion defect — layout-band physics is not "design idiom"
vocabulary (color/spacing/motion tokens) and does not belong in the same file
as `--rainbow-*`/`--color-gold`; the file's own comments concede the *durable*
home is elsewhere (*"The durable glass-ui `GlassDock` reserved-band QUERY is
the W7b handoff edge; this is the kf-side relocation"* — i.e. this whole
subsystem is a temporary re-derivation of a primitive glass-ui has not
shipped yet, exactly the VERDICT #27 "delineate glass-ui's gaps" case); and
(b) a no-legacy violation on the **comment** layer — a block whose entire
content is "here is the CSS rule that used to exist, and here is why it does
not anymore" has zero runtime value and is precisely the kind of
already-excised-but-narrated cruft the litany's legacy sweep targets. Git
history is the correct home for "why was this deleted," not the stylesheet
that ships to production.

**T recommendation.** Two independent, small, low-risk cuts: (1) delete the
4 tombstone blocks from `design-idioms.css` (~130 lines, zero behavior
change — the code they describe is already gone); (2) extract the dock-band
anchor/z-index/work-area token chain out of `style.css` into its own
`styles/layout-bands.css`, and open the glass-ui-gap ticket for the
already-named `GlassDock` reserved-band query so this file is explicitly a
placeholder pending an upstream primitive, not permanent demo-owned physics.
`style.css` then holds only true global wiring (imports, fonts, reset,
generic utilities) — the shape VERDICT #26 expects a file with this name to
have.

## Target `@` structure

```
demo/@/
├── state/                      # UNCHANGED — the model peer (F1 leaves it alone)
│   └── kfEngine.ts              # + relocated (F7): the boot-time engine accessor joins its infra sibling
├── components/                  # collapsed from components/custom/ (F1) — one fewer dead nesting level
│   ├── animation-transport/      # index.ts barrel (already has one) — DemoGlobalChrome REMOVED (F3 → app/chrome/)
│   │   ├── components/ · composables/ · controls/(+composables/)
│   │   └── (the two 500L-tripwire CSS-splits genuinely re-decomposed, F2 — not re-parked)
│   ├── easing-editor/            # + index.ts barrel (F4)
│   ├── editor-shell/             # composables/ subfolder added (F4) — useHeroSourceEgg.ts, useShareState.ts move in
│   ├── keyframe-timeline/        # + index.ts barrel (F4)
│   ├── keyframes-editor/         # + index.ts barrel (F4)
│   ├── CopyButton.vue            # unchanged — genuinely 4-area shared
│   ├── GestureLegend.vue         # EXIT if VERDICT #8 prune lands (lane 07 call, not this lane's)
│   └── PillTabStrip.vue + usePillTabRoving.ts   # renamed from KfPillTabs (F5); glass-ui ask filed
├── composables/                  # true Vue composables only (F6)
│   ├── useDoubleTap.ts
│   └── useDragScrub.ts
├── styles/
│   ├── style.css                 # true global wiring only (F8) — imports/fonts/reset/generic utilities
│   ├── layout-bands.css          # + new: the extracted dock-band/z-index/work-area token chain, marked as a glass-ui-gap placeholder
│   ├── design-idioms.css         # − ~130L of tombstone comments (F8)
│   └── brand.css                 # unchanged
└── utils/                        # generic DOM/text helpers only (F7 removes kfEngine, F6 adds gestureSelectSuppression)
    ├── clipboard.ts
    ├── iosTextEntry.ts
    ├── gestureSelectSuppression.ts   # + relocated from composables/ (F6)
    └── toastGuard.ts
```

**Reconciliation note.** This tree is written standalone against `demo/@/`
only; it does not touch `demo/app/` or `demo/scenes/<name>/` beyond the single
cross-boundary move in F3 (one file, `@/` → `app/chrome/`). The synthesis pass
should reconcile that one edge against lane 13's `app/` tree (confirm
`app/chrome/` is the landing zone lane 13 also names for document-level
singletons) — everything else in this tree is `@/`-internal and has no
dependency on lane 13's findings.

## T recommendations

1. **Collapse `components/custom/` → `components/`** (F1) — scope: `git mv` one
   directory level + repoint ~40 import sites + the gate's `sharedModuleId()`
   drops the `custom` special-case. Gate shape: `proof:shared-has-n-consumers`
   passes unchanged (module IDs shift, counts don't) + `npm run check` clean.
   Size: **S**.

2. **Close the `.css`-extension gate-dodge** (F2) — scope: extend
   `proof:demo-no-oversize` to count a `.vue` + same-basename sibling `.css`
   as one unit; then genuinely re-decompose `AnimationControlsGroup.vue`
   (508L combined) and `ControlsPaneWrapper.vue`(501L combined) by markup
   concern. Gate shape: the widened `proof:demo-no-oversize` REDs on the two
   files pre-fix, GREENs post-decomposition with no CSS file exceeding the
   ceiling either. Size: **M**.

3. **Relocate `DemoGlobalChrome.vue` to `demo/app/chrome/`** (F3) — scope: one
   file move + one import repoint in `App.vue` or `AnimationControlsGroup.vue`
   (whichever mounts it post-move). Gate shape: `proof:app-is-shell` accepts
   it in `chrome/`; `proof:shared-has-n-consumers` loses one single-consumer
   directory entry (net simplification, not a new red). Size: **S**.

4. **Uniform peer shape: barrel + `composables/` subfolder for every
   multi-file `components/<feature>/`** (F4) — scope: add `index.ts` to
   `easing-editor`, `keyframe-timeline`, `keyframes-editor`; fold
   `editor-shell`'s 2 flat composables into `editor-shell/composables/`.
   Gate shape: new `proof:at-peer-shape` — for every `components/<dir>` with
   ≥2 files, assert `index.ts` exists and no `use*.ts` sits flat beside a
   sibling `composables/` directory. Size: **S**.

5. **Rename `KfPillTabs.vue`/`useKfPillTabs.ts`; file the upstream glass-ui
   `aria-orientation`-on-`role=group` fix** (F5) — scope: rename to a
   plain-noun pair (e.g. `PillTabStrip.vue`/`usePillTabRoving.ts`), record the
   glass-ui gap with the retire-when-upstream-ships condition. Gate shape:
   no new component-name matches `/^Kf[A-Z]/` in `demo/@/components/` (a
   one-line grep-shaped gate); the glass-ui ask is tracked in the VERDICT
   #27 gap ledger, not a kf-repo gate. Size: **S**.

6. **Move `gestureSelectSuppression.ts` → `utils/`** (F6) — scope: one file
   move, no consumer-shape change. Gate shape: every file remaining in
   `composables/` contains ≥1 Vue reactive-primitive import (a one-line AST
   grep gate: `ref(`/`reactive(`/`onMounted`/`watch(` present). Size: **S**.

7. **Promote `kfEngine.ts` out of `utils/` to `state/`** (F7) — scope: one
   file move + barrel re-export from `state/index.ts`. Gate shape: the
   `--dump` census's widest-fanout module (currently `utils/kfEngine.ts`, 13
   areas) no longer appears under the `utils/` prefix. Size: **S**.

8. **Split `styles/` by concern; delete tombstone comments; flag the
   dock-band chain as a glass-ui-gap placeholder** (F8) — scope: extract
   ~250L of dock/z-index/work-area token math from `style.css` into
   `styles/layout-bands.css`; delete the 4 dead "— DELETED/REMOVED" comment
   blocks from `design-idioms.css` (~130L, zero behavior change). Gate
   shape: a new `proof:no-tombstone-comments` — grep `demo/@/styles/**` for
   the literal markers `— DELETED` / `— REMOVED` in a comment with no
   adjacent live rule; REDs today (4 hits), GREENs after the sweep. Size:
   **S**.
