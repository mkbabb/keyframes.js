# Tranche H — DEEP AUDIT · lane `a-scene-icons`

**Charge (D8):** the scene-icon system. How did Home/Cube/Amiga/Square/Easing get
icons? Document the icon-design + screenshot pipeline so the surviving new modes
(Spring / Sequence / Path / Discrete) can get proper, isomorphic icons. Pair with
`a-modes-pertinence`.

**Binding mandate:** idiomatic gestalt only; NO workarounds; a replaced surface
replaced in one motion; MEASURE-FIRST; every claim carries a `file:line` or live
anchor.

---

## 0. TL;DR

The scene-icon system is a hand-wired `Record<string,string>` of **imported image
URLs** in `ChromeDock.vue:25-30`. It maps exactly four ids (`cube`, `amiga`, `square`,
`easing`); every other scene (`home`, `spring`, `sequence`, `motion-path`,
`starting-style`) silently falls through to the Lucide `<Home>` glyph
(`ChromeDock.vue:172,180,211`). So **five of nine scenes wear the house icon** — the
defect the user observed is wider than D8 states (D8 names four; `home` itself is also
glyph-only, by design).

The "screenshot pipeline" the user remembers is **NOT a checked-in instrument**. The
three PNG pairs were captured ad-hoc by Playwright in a single commit
(`74abd2b`, 2026-03-15) and committed as binaries; the script that made them was never
landed. The `easing` icon is a different lineage entirely — a **hand-authored SVG**
(`f1d4fe6`) drawn in the brand accent. So there are TWO icon idioms today
(photo-real PNG screenshot vs. hand-drawn line SVG) and they are not reconciled.

The `-lg.png` 256×256 variants (3 of them, ~60 KB) are **orphaned** — imported nowhere,
shipped nowhere. Dead weight.

**Recommendation (SHIP-in-H):** replace the screenshot-PNG idiom wholesale with **one
hand-authored SVG line-icon family** in the `easing-icon-sm.svg` mould — a `sceneIcons`
registry that lives ON the scene descriptor (`scenes.ts`), not inside the dock. The
photo-real cube/amiga/square thumbnails are charming but they are (a) a second,
unscalable idiom, (b) light/dark-blind raster, and (c) un-reproducible (no checked-in
generator). One vector family, one accent, themable, `currentColor`-driven, is the
gestalt move. Gate it with a `proof:scene-icons` instrument that asserts **every
non-home registered scene resolves an icon**.

---

## 1. The icon registry — where & how (the mechanism)

### 1.1 The registry lives inside the dock, keyed by string

`demo/@/components/custom/dock/ChromeDock.vue:20-30`:

```ts
import cubeIcon from "@assets/icons/cube-icon-sm.png";
import amigaIcon from "@assets/icons/amiga-icon-sm.png";
import squareIcon from "@assets/icons/square-icon-sm.png";
import easingIcon from "@assets/icons/easing-icon-sm.svg";

const sceneIcons: Record<string, string> = {
    cube: cubeIcon,
    amiga: amigaIcon,
    square: squareIcon,
    easing: easingIcon,
};
```

`@assets` → repo-root `assets/` (`vite.config.ts:160`; `tsconfig.json:22`). The on-disk
inventory (`ls assets/icons/`):

| file | type | dims | bytes | used? |
| --- | --- | --- | --- | --- |
| `cube-icon-sm.png` | PNG raster | 32×32 | 1147 | yes (dock) |
| `cube-icon-lg.png` | PNG raster | 256×256 | 9432 | **NO — orphan** |
| `amiga-icon-sm.png` | PNG raster | 32×32 | 2671 | yes (dock) |
| `amiga-icon-lg.png` | PNG raster | 256×256 | 31261 | **NO — orphan** |
| `square-icon-sm.png` | PNG raster | 32×32 | 1561 | yes (dock) |
| `square-icon-lg.png` | PNG raster | 256×256 | 18935 | **NO — orphan** |
| `easing-icon-sm.svg` | SVG vector | 32×32 | 373 | yes (dock) |

(types/dims via `file assets/icons/*`.) The `-lg` trio is imported by **no** live source
(`grep -rn "lg.png\|icon-lg" demo src --include=*.vue --include=*.ts | grep import`
→ zero hits; the only `icon-lg` matches are the unrelated `class="icon-lg"` glyph-size
utility). ~60 KB of dead binaries.

### 1.2 The render sites — three, all in the dock, all with the same fallback

`ChromeDock.vue` renders `sceneIcons[id]` in three places, each falling back to `<Home>`:
- trigger (`:171-172`),
- dropdown items (`:194` — note: NO `<Home>` fallback here, so an unknown scene shows
  NOTHING beside its label in the menu),
- collapsed pill (`:210-211`).

The `<Home>` glyph is also the legitimate icon for the `home` scene itself
(`:180` inside the explicit Home `SelectItem`). So `<Home>` is doing double duty as both
"the home scene" AND "I have no icon" — an **overloaded sentinel** that makes
spring/sequence/path/discrete visually indistinguishable from Home in the switcher.

**Live confirmation:** `/#/spring` renders the dock pill as a house glyph + "Spring"
(spring-scene screenshot, this lane). The four new scenes have no icon, exactly as D8
reports — and they alias the Home glyph.

---

## 2. The "screenshot pipeline" — what it actually was

The user remembers screenshotted SVG thumbnails. The truth, from
`git log --diff-filter=A -- 'assets/icons/*'`:

**`74abd2b` (2026-03-15) — "feat(demo): add scene icons, update favicon, scene selector
with icons":**
> - Capture Playwright screenshots of cube (3-face angle, vivid colors), amiga
>   (checkerboard ball, isolated), square (rotated heyyyy)
> - All icons 256×256 (lg) + 32×32 (sm) with transparent backgrounds
> - Update favicon to cube-icon-sm.png

So the cube/amiga/square thumbnails are **literal Playwright screenshots of the running
scenes** at a characteristic pose, exported at two sizes with alpha. Confirmed by eye
(read the `-lg` PNGs this lane): cube = neon magenta/yellow/red 3-face cube; amiga =
red/grey checkerboard sphere; square = rotated periwinkle card reading "heyyyy".

**The pipeline is NOT in the repo.** That commit added only `Bin` blobs + an
`index.html` favicon edit (`git show 74abd2b --stat`). There is no checked-in icon
generator. The closest checked-in capture harness, `scripts/capture.mjs`, is a
**different instrument** — the before/after audit-screenshot matrix (its header,
`capture.mjs:2-45`); it screenshots whole viewports for review, NOT cropped, alpha,
two-size scene thumbnails. It cannot regenerate the icons.

This is a **NO-legacy / reproducibility hole** against the mandate: a generated artifact
with no committed generator can never be re-run identically (the exact lesson
`capture.mjs:6-10` cites for the audit harness — "the harness lived in /tmp so 're-runs
identically' was unsatisfiable"). The scene icons are in that same unsatisfiable state.

**`f1d4fe6` — "feat(demo): add interactive easing function demo scene"** added
`easing-icon-sm.svg` as a **hand-drawn vector** — a single ease curve path + two endpoint
dots, stroked in `hsl(248, 88%, 71%)` (`easing-icon-sm.svg:2-4`). That hue is the brand
primary, `--ppmycota-primary: hsl(248 88% 71%)` (`demo/@/styles/style.css:174`). This is
the **better idiom** and the model to standardize on.

---

## 3. Findings

### F1 — TWO unreconciled icon idioms (raster screenshot vs. vector line-art) · SHIP-in-H

**Anchor:** `ChromeDock.vue:20-23` (3 PNG + 1 SVG); `easing-icon-sm.svg` vs.
`cube-icon-lg.png` (read this lane).

The PNG screenshots and the SVG curve cannot coexist as a "family" — they share no
palette, no stroke, no light/dark behaviour. Raster PNGs are theme-blind (the periwinkle
card and neon cube read identically in dark mode, where a `currentColor` line icon would
invert). The mandate says styling is ISOMORPHIC unless a named, befitting delta; this is
an UN-named, un-befitting split.

**Gestalt fix:** standardize on ONE hand-authored SVG line family in the easing mould —
each scene gets a 32×32 `viewBox="0 0 32 32"`, `fill="none"`, stroke in `currentColor`
(so it inherits `text-muted-foreground` / accent + themes for free), `stroke-width: 2-3`,
`stroke-linecap: round`. Retire the three PNGs (and the three `-lg` orphans) in one
motion. The cube/amiga/square poses become **vector glyphs** of the same concepts
(an isometric cube outline, a checker-sphere, a tilted card), not photographs.

**Falsifiable instrument:** `proof:scene-icons` asserts each icon file is `.svg`, has
`fill="none"` + at least one `stroke="currentColor"`, and `viewBox="0 0 32 32"`. A grep
gate: zero `.png` in the icon registry.

---

### F2 — registry is mis-located (lives in the dock, not on the descriptor) · SHIP-in-H

**Anchor:** `ChromeDock.vue:25-30` (registry) vs. `demo/app/scenes.ts:7-14`
(`SceneDescriptor` — has `id,label,superKey,component,showStartScreen,gridBackground`,
**no `icon`**).

The icon-to-scene binding is data, and it belongs with the scene's other data — the
descriptor — not buried in a presentation component keyed by magic strings. Today adding
a scene means editing `scenes.ts` AND remembering to wire `ChromeDock.vue` (which the
four new scenes' authors did NOT — the root cause of D8). DRY + single-source-of-truth:
the dock should iterate `scene.icon`, never hold a parallel map.

**Gestalt fix:** add `icon?: Component` (a vector `*.vue`/SVG component, NOT a URL
string) to `SceneDescriptor`; populate it at declaration in `scenes.ts:54-123`; the dock
renders `<component :is="scene.icon">` with a single `<Home>` fallback ONLY for the
explicit home descriptor. Deletes `sceneIcons` and all four imports from the dock.

**Falsifiable instrument:** `proof:scene-icons` iterates `allScenes` and asserts every
non-`home` descriptor has a defined `icon`. A new scene without an icon FAILS the gate —
structurally impossible to ship an icon-less mode again. (This is the gate that prevents
the D8 regression class permanently.)

---

### F3 — the orphaned `-lg` 256×256 PNGs · KILL

**Anchor:** `assets/icons/{cube,amiga,square}-icon-lg.png` (60.6 KB total); imported by
nothing (`grep import ... lg.png` → 0 hits, this lane).

Dead binaries committed "for a future larger use" that never arrived. Under NO-legacy
they are deleted in the same motion as F1's PNG retirement. If H ever needs a large
scene render (a start-screen hero thumbnail, say), it should be a vector at any size, not
a re-imported raster.

**Falsifiable instrument:** a repo-hygiene grep — no `assets/icons/*.png` exists after H;
`proof:scene-icons` fails if any `.png` reappears under `assets/icons/`.

---

### F4 — `<Home>` is an overloaded sentinel (the home scene AND "no icon") · SHIP-in-H

**Anchor:** `ChromeDock.vue:172,180,211` — `<Home v-else>` is both the home `SelectItem`
icon (`:180`) and the "unknown scene" fallback (`:172,:211`). Item-list site `:194` has
NO fallback at all, so an unknown scene shows a bare label.

Spring/Sequence/Path/Discrete therefore render as the Home glyph — actively misleading
(they read as "go home"), and inconsistent (pill shows a house, dropdown row shows
nothing). Once F2 lands (every non-home scene has an icon), the fallback should be
**unreachable** and can be removed; `home` keeps `<Home>` as its real, declared icon.

**Falsifiable instrument:** covered by F2's "every non-home scene resolves an icon" gate
— if it holds, the fallback branch is dead and can be deleted without behaviour change.

---

### F5 — the icon set is keyed by raw id strings, not the scene list · RECORD

**Anchor:** `ChromeDock.vue:25` `Record<string,string>` vs.
`scenes.ts:126` `sceneMap = new Map(...)`.

Symptomatic of F2; the string-keyed record can silently drift from the real scene ids
(rename `square`→`card` in `scenes.ts` and the icon vanishes with no type error —
`Record<string,string>` accepts any key). Folding the icon onto the descriptor (F2) makes
this a compile-time relationship. Recorded as the type-safety rationale for F2; no
separate fix.

---

### F6 — the four new scenes lack icons because they were added WITHOUT touching the dock map · ROOT-CAUSE for D8

**Anchor:** `scenes.ts:79-122` adds spring/sequence/motion-path/starting-style with full
descriptors; `ChromeDock.vue:25-30` was never updated to add their icons.

This is the literal mechanism of D8: the registry and the scene list are two places, and
the second was forgotten. F2 (single source) is the structural cure; F1 (vector family)
gives the survivors icons in the right idiom. **The icons for the survivors should only be
designed AFTER `a-modes-pertinence` rules on which modes survive hardening** — designing
an icon for a mode that gets KILLed is wasted motion (see §4).

---

## 4. Pairing with `a-modes-pertinence` — which survivors get icons

D8 says: "AUDIT THEIR PERTINENCE; if they survive hardening they need proper designed,
screenshotted SVG icons like the others." So icon design is **downstream of the
pertinence verdict**. This lane supplies the pipeline + the icon-concept proposals; the
modes lane supplies the survivor set. Two live observations bear on pertinence directly:

- **Direct-route reachability is broken for the new scenes.** Navigating to `/#/sequence`
  in the live demo redirected to `/#/?anim=Rotations` and rendered the cube/home start
  screen (this lane, Playwright). The route IS registered (`router.ts:23`), so this is a
  switch/state defect (D12 territory) — but it also means a `sequence` scene a user
  cannot deep-link to is a weak candidate for a permanent dock icon. Flag to
  `a-modes-pertinence` + the D12 state-machine lane.
- The four scenes share the SAME shell shape (`SpringScene.vue:1-3` etc. — a centered
  `<XTarget />`), i.e. they are sidebar+target variations, not distinct interaction
  surfaces (relevant to D11 "make survivors more interactive").

**Proposed icon concepts (vector, easing-SVG idiom) — design ONLY the survivors:**

| scene | concept (one 32×32 `currentColor` line glyph) | visual anchor |
| --- | --- | --- |
| `spring` | a coil/helix or a damped-sine wave settling to a baseline | spring-scene rails + `springLinearStops` decay curve (live) |
| `sequence` | three offset bars on a baseline (a stagger waterfall) | the stagger storyboard (`scenes.ts:86-89`) |
| `motion-path` | a dashed bézier path with a dot traveling it | `offset-path` traveller (`scenes.ts:99-109`) |
| `starting-style`/Discrete | two discrete states + a dotted transition arrow | `@starting-style` entry/exit (`scenes.ts:112-121`) |

Each mirrors `easing-icon-sm.svg` exactly: `viewBox="0 0 32 32"`, `fill="none"`,
`stroke="currentColor"` (NOT a baked hue — the easing icon hard-codes
`hsl(248,88%,71%)`, which is a small theme-blindness wart to fix while we're here),
`stroke-width: 3`, `stroke-linecap: round`, optional endpoint dots at `opacity: 0.4`.

---

## 5. The reproducible pipeline H should land (so this never re-rots)

The mandate wants the pipeline DOCUMENTED so survivors get proper icons. Two viable
idioms; recommend **A**.

**A — hand-authored vector family (RECOMMENDED, SHIP-in-H).**
- One `*.svg` (or inline-SVG `*.vue`) per scene under `assets/icons/`, all in the
  easing mould (§4). No build step, no Playwright, no binaries in git, themable via
  `currentColor`, infinitely scalable (kills the need for `-lg` raster).
- Wired onto `SceneDescriptor.icon` (F2). The dock just renders it.
- Gated by `proof:scene-icons` (F2's structural gate + F1's vector-shape assert).
- **Why over screenshots:** reproducible (the file IS the source), one idiom, theme-aware,
  ~0.4 KB each vs. 1-2 KB raster, and matches the existing easing icon so the family is
  coherent from day one.

**B — a CHECKED-IN screenshot generator (only if photo-real thumbnails are a named,
befitting delta H decides to keep).**
- A `scripts/gen-scene-icons.mjs` reusing `scripts/lib/demo-driver.mjs`'s `SCENES`
  manifest + `subjectRect` (`capture.mjs:51-55`) to: serve `dist/gh-pages`, navigate each
  scene at a fixed pose, screenshot the subject rect clipped + alpha, emit `-sm`/`-lg`
  PNGs deterministically.
- BLOCKER measured this lane: `demo-driver.mjs:40-59` `SCENES` only knows
  home/cube/amiga/square/easing/spring — **sequence/motion-path/starting-style are absent
  from the manifest**, so the existing harness cannot even reach three of the four
  survivors. B requires first extending that manifest (a `subjectSelector` per new scene)
  AND a deterministic per-scene pose seed (the cube angle, the amiga checker phase) so two
  runs produce byte-identical icons — non-trivial determinism work.
- Recommend B only if `a-modes-pertinence` + design decide photo-real thumbnails are
  worth a second idiom. Default to A.

---

## 6. Dispositions

| # | finding | disposition | gate |
| --- | --- | --- | --- |
| F1 | two unreconciled idioms (PNG vs SVG) | **SHIP-in-H** | `proof:scene-icons` (all `.svg`, `fill=none`, `currentColor`) |
| F2 | registry mis-located (dock, not descriptor) | **SHIP-in-H** | `proof:scene-icons` (every non-home descriptor has `icon`) |
| F3 | orphaned `-lg` PNGs (~60 KB dead) | **KILL** | repo-hygiene grep: no `assets/icons/*.png` |
| F4 | `<Home>` overloaded as scene + no-icon sentinel | **SHIP-in-H** | covered by F2 (fallback becomes dead) |
| F5 | string-keyed `Record` can drift from scene ids | **RECORD** | rationale for F2 (compile-time binding) |
| F6 | new scenes added without dock wiring (D8 root cause) | **SHIP-in-H** (cure via F2) | F2 gate makes icon-less scene unshippable |
| pipeline | reproducible icon source | **SHIP-in-H (idiom A)** | the icon file IS the checked-in source |
| modes | survivor set + reachability (`/#/sequence`→home) | **hand to `a-modes-pertinence` + D12** | deep-link route resolves to the named scene |

**Cross-repo:** none. The icon registry, assets, and dock-render wiring are all kept in
kf (`ChromeDock.vue` is a kf demo component, not glass-ui). The dock CHROME (lag, popover)
is the glass-ui-HANDOFF lane (D5) — out of scope here; this lane only touches what the
dock renders INTO its slots (scene icons), which is kf-owned.

**ALREADY-SOTA, honestly:** `easing-icon-sm.svg` is the exemplar — a tiny, themable
(modulo the hard-coded hue, F1/F4-adjacent), brand-accurate vector. The whole family
should converge on it. The `scenes.ts` lazy-loader/`warmScene` architecture
(`scenes.ts:25-42`) is clean and is the right place to hang `icon` (F2).

---

## 7. Live + source anchors used

- `demo/@/components/custom/dock/ChromeDock.vue:20-30,171-172,180,194,210-211`
- `demo/app/scenes.ts:7-14,54-123,126`
- `demo/app/router.ts:23` (+ live `/#/sequence` → `/#/?anim=Rotations` redirect, this lane)
- `assets/icons/*` (inventory via `file`; cube/amiga/square `-lg` read by eye; easing SVG)
- `assets/icons/easing-icon-sm.svg:2-4`; `demo/@/styles/style.css:174` (brand hue)
- `vite.config.ts:160`, `tsconfig.json:22` (`@assets` → repo `assets/`)
- `scripts/capture.mjs:2-45,51-55`; `scripts/lib/demo-driver.mjs:40-59` (manifest gap)
- git: `74abd2b` (PNG screenshots, ad-hoc), `f1d4fe6` (easing SVG)
- Playwright (live, this lane): spring-scene + sequence-route screenshots
