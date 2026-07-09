# a22-legacy-demo — LEGACY hunt over `demo/` (Tranche R deep audit)

## Executive summary

The R.W5 Band A dead-code excision (commit `9c1d9bd`) genuinely happened and
genuinely holds: `SceneSwitcherCarousel.vue`, `useScrollSnapScene.ts`,
`Animated.vue`, and `ResponsiveSelect.vue` are gone from disk, `App.vue` no
longer mounts a carousel host, and a fresh sweep confirms zero residual
imports/consumers. The color-picker deprecation cited in user memory is also
fully discharged — pre-dates R (`08542a1`/`ac8e9c5`) and no trace of it
remains in `demo/` or `docs/tranches/R/`. Scene fusion (R.W5 Band C) is
structurally clean: no leftover `demo/<name>/` split directories, no
`demo/app/scenes/*.vue` split entries, zero `../../` relative climbs under
`demo/scenes/`, and every scene's `*Keys.ts` export is a live single-source
consumed by `scenes.ts` and its own `provide`/`inject` pair.

What R's "no-legacy" sweep **missed** is smaller and softer than a dead
component: (1) six comment sites across `style.css`, `design-idioms.css`,
`AnimationControlsGroup.vue`, `EditorStartScreen.vue`, and `SpringScene.vue`
still narrate the TOP dock band as "**the scene-switcher**" — the exact name
of the component R.W5 deleted — when the actual occupant is `ChromeDock`;
(2) two pre-tranche (2024) orphaned assets (`assets/ppmycota-logo.svg`,
`assets/graph-background-light.svg`) sit unreferenced in the asset root R.W5
never swept because its scope was demo-*component* dead code, not
demo-*asset* dead code; (3) `demo/playground/` — the mission brief's own
"identity unclear" flag — is corroborated by evidence: it was touched only
incidentally during the entire R range (one commit, a vueuse-residual fix),
carries no CLAUDE.md/README, and its sole `demo/@/components/custom/
asset-manager/*` dependency (6 files) has **zero** consumers in `demo/app` or
`demo/scenes` — it is playground-private shared-tree infrastructure that R's
`demo/CLAUDE.md` "Project Tree" prose does not disambiguate from the
`demo/app` SPA's assets. No CSS custom-property was found genuinely dead
(the `-stable` suffixed tokens and `--font-*`/`--color-*` Tailwind `@theme`
tokens that first looked orphaned are all live — internal chains or
Tailwind-utility-consumed, not `var()`-searchable). No glass-ui
`@deprecated` API surface exists in the pinned 4.0.1 install to be misused.

## Findings

### 1. Six comment sites narrate "the scene-switcher" for the surviving `ChromeDock`, reusing the deleted component's name · LOW

`demo/@/styles/style.css:272,281,447`, `demo/@/styles/design-idioms.css:253`,
`demo/@/components/custom/animation-controls/AnimationControlsGroup.vue:399,405`,
`demo/@/components/custom/editor-shell/EditorStartScreen.vue:6`, and
`demo/scenes/spring/SpringScene.vue:4` all describe the fixed top-center dock
band as "the scene-switcher pill" / "the scene-switcher — by construction."
R.W5 Band A deleted the literal `SceneSwitcherCarousel.vue` component
(`9c1d9bd`); the surviving top-band occupant is `ChromeDock.vue`
(`demo/@/components/custom/dock/ChromeDock.vue`), which most *other* comments
in the same files correctly name (`style.css:273,625,629`;
`AnimationControlsGroup.vue:325,400`). A reader grepping for
"scene-switcher" post-R lands only in these six stale-terminology comments
with no component to find — the exact confusion
`docs/tranches/R/audit/demo-scene-switcher.md:91` already flagged pre-emptively
("the remaining content… should have its comment… updated") but R.W5's
executed diff (`9c1d9bd`) never touched `style.css`/`design-idioms.css`/
`AnimationControlsGroup.vue`/`EditorStartScreen.vue`/`SpringScene.vue` — only
`scene-transition.css`'s S2 block was excised. This is not a functional bug
(ChromeDock genuinely switches scenes) but is exactly the "stale era-comment"
class the lane brief asks to hunt: a comment vocabulary that survives the
code it named.

### 2. Two pre-2024 orphaned assets in the root `assets/` sit unreferenced through every tranche including R · LOW

`assets/ppmycota-logo.svg` (0 references anywhere in `demo/`, last touched
`2024-07-01` per `git log`) and `assets/graph-background-light.svg` (0
references, last touched `2024-06-28`) predate the lettered-tranche system
entirely. `assets/ppmycota-logo-2.svg` and `-3.svg` (siblings, same
directory) ARE referenced and presumably supersede the unsuffixed original.
R's demo dead-code sweep (R.W5 Band A) scoped itself to components/
composables, not the shared asset root, so these two files were never in
scope to catch — but Tranche S's "NO legacy/deprecated code anywhere"
mandate makes them now in-scope. Verified via `grep -rl` across
`demo/**/*.{vue,ts,html,css}` for the bare filenames.

### 3. `demo/playground` is un-owned residue with a genuinely unclear relationship to `demo/app` — corroborates the mission brief, not a new claim · MEDIUM

`git log --oneline a15cd48..18e8617 -- demo/playground` returns exactly one
hit (`0a33f5a`, an R.W6 vueuse-residual/brittleness fix, not a playground
design decision). `demo/playground/` has no `CLAUDE.md` and no `README.md`
(confirmed: `find demo/playground -maxdepth 1 -name "*.md"` → empty), while
every other demo sub-tree (`demo/CLAUDE.md`, implicitly `demo/app` via the
same file) is documented. Its only differentiated dependency,
`demo/@/components/custom/asset-manager/*` (`AssetLayerPanel.vue`,
`AssetViewport.vue`, `AssetLayer.vue`, `AssetPropertiesPanel.vue`,
`assetTypes.ts`, `useAssetManager.ts` — 6 files), is imported **exclusively**
by `demo/playground/App.vue:84`; the only other touchpoint is
`demo/@/components/custom/animation-controls/stores/index.ts:74` calling
`_resetAssetManagerStore()` for cross-store-reset plumbing, not a real
consumer. `demo/playground/dist/` (9.1 MB) is a stale local Vite build,
correctly `.gitignore`'d (`dist/` at `.gitignore:10`) and untracked — not a
repo hygiene defect, just confirms the build has been run locally and never
cleaned. R never asked "why does this app exist beside `demo/app`, and is
`demo/@` shared-tree code that only playground consumes actually
playground-private" — it is exactly the question Tranche S's mission brief
already poses ("demo/playground identity unclear"). This audit corroborates
that the ambiguity is real and quantifiable, not speculative.

### 4. CSS custom-property sweep: no genuinely dead tokens found (negative finding, recorded to save S re-deriving it) · INFO

A full `--token:` declaration harvest from `demo/@/styles/style.css` (54
tokens) cross-checked against `var(--token` usage across `demo/**/*.{vue,ts,css}`
initially flagged 14 "unused" tokens. Manual inspection of each showed: (a)
`--color-accent-red*`/`--font-sans`/`--font-stack-*`/`--font-display-weight`
are Tailwind v4 `@theme` bridge tokens consumed via utility classes
(`bg-accent-red`, the `font-sans` stack), not `var()` call sites — false
positives of the grep method, not dead code; (b) `--dock-top-anchor-stable`,
`--work-area-max-height-stable`, `--work-area-vertical-slack-stable` are
internal computation-chain tokens consumed by each other within the same
`:root` block (`style.css:539-557`) — legitimately intermediate, not dead;
(c) `--spring-snappy` was **already** excised with a self-documenting comment
(`style.css:327-333`, "R.W6 C.5 — EXCISED") — the grep hit was the comment
prose, not a live declaration. No action needed; recorded so Tranche S does
not re-spend a lane re-deriving the same negative result.

## Positives worth banking (so S does not "fix" what is already right)

- R.W5 Band A's dead-code excision (`9c1d9bd`) is real, complete, and
  verified independently: zero residual imports of `SceneSwitcherCarousel`,
  `useScrollSnapScene`, `Animated.vue`, `ResponsiveSelect.vue` anywhere in
  `demo/`.
- Scene fusion (R.W5 Band C) left **zero** `../../` relative climbs under
  `demo/scenes/` (`proof:scene-colocated` assertion 2's contract, verified
  by direct grep) and **zero** leftover pre-fusion `demo/<name>/` top-level
  directories.
- Every scene's `*Keys.ts` super-key / demo-injection-key export is a live
  single source consumed by exactly `scenes.ts` + its own scene's
  `provide`/`inject` pair — no dead scene keys.
- The color-picker deprecation (user-memory-flagged) is fully discharged and
  pre-dates R; nothing to do here.
- No `@deprecated` glass-ui API exists in the pinned `~4.0.0` (installed
  `4.0.1`) surface to be caught misusing — the stale `~3.5.1`/specular-3.8.0
  handoff in project memory is itself now stale (superseded by the K-era
  `e293ce2` "adopt glass-ui 4.0.0" migration); current demo `specular` usage
  is all Three.js material props (`amiga/utils.ts:70`) or CSS-token prose,
  unrelated to the old glass-stage sheen handoff.
- No orphaned root-level assets under `demo/app/public` or referenced-icon
  set (`assets/icons/*.svg`) — every icon file is imported by `scenes.ts`.
- `demo/app/App.vue` sits at 488L, just under the demo's informal ≤500L
  decomposition convention; no demo/app file exceeds it.

## Tranche-S implications

- **Terminology pass, not a code change**: rename "scene-switcher" →
  "ChromeDock" (or "the top dock") in the 6 comment sites in Finding 1. Fold
  into whichever wave does the `demo/@` → `demo/shared` rename R.W5 C.6
  explicitly skipped (S is a natural place to revisit that skip, since it
  touches the same file set).
- **Delete-or-justify the two orphaned pre-2024 assets** (Finding 2) in the
  same wave/pass that does the general demo asset sweep — one-line diff,
  zero risk (verified zero referrers).
- **Resolve `demo/playground`'s identity before any further investment in
  it** (Finding 3): either (a) give it a `CLAUDE.md` stating its purpose
  distinct from `demo/app`, formally moving `asset-manager/*` out of the
  shared `demo/@` tree into `demo/playground/` proper (since it has exactly
  one consumer), or (b) fold its capability into `demo/app` and delete it —
  do not leave it as an undocumented, barely-touched third demo surface
  going into S. This is the highest-value finding in this lane because it is
  a decision Tranche S's mission brief already flagged as owed; this audit
  supplies the evidence (one incidental commit across all of R, zero docs,
  single-consumer shared code) needed to make that decision non-speculative.
- No wave-blocking legacy debt found in `demo/`: the CSS-token, glass-ui, and
  color-picker angles the lane brief asked to hunt are clean. S should NOT
  spend a dedicated wave re-sweeping these; a single small band folded into
  the existing demo-cleanup wave (alongside a10's `cubeTransformStore.ts` /
  `useTypedTrigger.ts` colocation findings) is sufficient to close Findings
  1-2, and a scoped decision-wave is warranted for Finding 3 (playground
  identity) since it is architectural, not mechanical.
