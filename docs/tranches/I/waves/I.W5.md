# I.W5 — THE ICON SINGLE-SOURCE + SHELL CHROME (Band 3 · one build root · one runtime paint gate · the honest title)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-I (MED; B9 is a
  dev-environment integrity failure, NOT a defect in the live source or the built
  `dist/gh-pages/` — but the STRUCTURAL gap [no single source of asset truth across dev /
  build / gate] is real and the K title-drift is the same family. Low risk, high hygiene.) ·
  **Scope (build config + dev server + shell chrome; NO engine):** `vite.config.ts` (collapse
  the default-outDir landmine to ONE canonical `outDir`) + the dev SPA-fallback (404 asset-
  extension misses honestly) + `demo/app/index.html` (the `<title>`) + the icon-paint gate
  (replace source-shape `proof:scene-icons`) + the DC-8 dead-CSS DECIDE. · **DAG-deps:** after
  **I.W0** (so the runtime icon-paint gate, which clicks through scenes + opens the editor, runs
  on a clean console). Independent of I.W1–I.W4. Folds K (the demo name) + DC-8 (the twice-
  deferred scene-swap dead-CSS, no fourth defer).

## §Provenance (the folded root cause + investigation)

- `rootcause-rc-icons-build.md` — the VERDICT: B9 is NOT a defect in the current live source or
  the built product (both resolve ZERO icon 404s and ZERO source-map non-200s across all 7
  scenes). B9 is a dev-environment integrity failure with THREE distinct, co-occurring causes,
  all rooted in a single structural gap: there is no single source of icon/asset truth that the
  dev server, the build, and the gates all share — and no runtime gate that an icon actually
  paints.
  - **B9-a (`ENOENT: assets/icons/easing-icon-sm.svg`):** a STALE local `demo/app/dist/` build
    artifact (mtime Mar 25) + a stale Vite/browser module graph still importing the H.W5-era name
    that H.W10 renamed. The dev SPA-fallback masks it as HTTP-200 HTML, so it never surfaces as a
    browser 404 — only the Vite process logs the FS `ENOENT`. Rename archaeology:
    `easing-icon-sm.svg` ADDED `db90cbb` (H.W5) → DELETED/RENAMED → `easing.svg` `8df1e6a`
    (H.W10). ZERO live source references `*-icon-sm`.
  - **B9-b (dev "resolves" the old name but build "uses" `easing.svg`):** the default-outDir
    LANDMINE — `vite.config.ts:274` sets `root: "./demo/app/"` with NO `outDir` for the default
    build, so a bare `vite build` writes to `demo/app/dist/` (the Mar-25 orphan), while gh-pages
    is EXPLICITLY redirected to `dist/gh-pages/` (`vite.config.ts:286`). Two build roots, one
    stale, nothing cleans it.
  - **B9-c ("source-map errors ×47"):** dev-only DevTools noise from Vite's dep-optimizer serving
    Monaco per-language chunks + `html2canvas` whose `sourceMappingURL` maps it does not co-emit
    (`html2canvas.js.map` literally absent in `node_modules/.vite/deps`). ZERO in the build
    (`sourcemap: false`, `vite.config.ts:289`).
- `rootcause-rc-icons-build.md §2` — the icon ARCHITECTURE is SOUND, preserve it: inline-`<svg>`
  SFC via `vite-svg-loader` `?component` (`vite.config.ts:190`); icon-as-data single-source
  (`demo/app/scenes.ts:15-21` hangs each glyph on `SceneDescriptor.icon`; the dock renders
  `<component :is="scene.icon">` at `ChromeDock.vue:225` — no parallel string-keyed icon map to
  drift). The seam's ONLY structural flaw: it is build-time / load-time only — a rename that
  orphans a path cannot be caught by it, and NOTHING asserts a glyph actually paints at runtime.
- `audit/feedback/k-demo-name.md` — K (the demo name): the tab title should be just
  `keyframes.js`. Source `demo/app/index.html:7` carries the long title
  (`keyframes.js — CSS keyframe animations for anything in JavaScript`); a built
  `demo/app/dist/index.html` carries the SHORT `keyframes.js` — a source-vs-build drift in the
  SAME family as the easing-icon-sm.svg dev/build split. The gh-pages build is the authority;
  reconcile so the source IS the shipped title (no build-time title rewrite masking the source).
  `demo/playground/index.html` keeps its own title (out of scope).
- `recap-deferred §7` — DC-8 (scene-swap VT dead-CSS): twice-deferred A→B→C, KFI-DECIDE (no
  fourth defer) — `grep` dead scene-swap CSS = 0 after the decision (KILL or RESTORE via
  `startViewTransition`).

## §The state, verified (file:line / live anchors)

- **The build-root landmine (the seam):** `vite.config.ts:274` (`root: "./demo/app/"`, no
  outDir) vs `:286` (gh-pages outDir `dist/gh-pages/`) vs `:289` (`sourcemap: false`). A default
  `vite build` re-spawns `demo/app/dist/`.
- **The orphan on disk (delete; ALREADY VCS-ignored):** `demo/app/dist/index.html`,
  `demo/app/dist/assets/index-DMdgtHAo.js` (mtime Mar 25). `dist/` in `.gitignore` matches at any
  depth — `git check-ignore demo/app/dist` = IGNORED — so the B9-finding's "add to .gitignore"
  recommendation is ALREADY satisfied and must NOT be re-litigated. The real fix is the outDir
  collapse, not a gitignore line.
- **The SPA-fallback masking:** the dev server returns `index.html` (HTTP 200, `text/html`) for
  ANY unknown path — `easing-icon-sm.svg` AND `totally-bogus.svg` both 200 (probe §3). So a stale
  importer of a deleted glyph produces HTML where SVG was expected (a silent mis-paint) — never a
  network 404 the gate could see. The truth lives only in the Vite process's `ENOENT` log.
- **The probe evidence:** `probes/b9-probe-output.json` (dist: `server404Paths:[]`, sourcemaps
  0/scene); `probes/b9-dev-output.json` (fresh dev: net404 0, sourcemapNon200 0). Icons paint in
  BOTH dev and build (`shots/b9-dev-cube.png`). Favicon resolves both ways
  (`demo/app/index.html:17` dev / hashed `./assets/favicon-*.svg` build).
- **The title drift:** `demo/app/index.html:7` (source = long) vs built
  `dist/gh-pages/index.html` (the authority).

## §Goal

ONE canonical demo build output (a second is IMPOSSIBLE by construction, not merely cleaned), a
dev server that 404s asset-extension misses HONESTLY (so an orphaned asset is OBSERVABLE), ONE
runtime gate that asserts every `SceneDescriptor.icon` PAINTS as an inline `<svg>` with a
non-zero box while clicking through every scene + the editor (with the server-404 set empty), and
the rendered `document.title === "keyframes.js"` on the deployed demo. The single root is "no
shared source of asset truth across dev / build / gate" — three moves collapse the three symptoms
into one invariant. No legacy, no workaround.

## §Scope

- **S1 — ONE build root: eliminate the default-outDir landmine (closes B9-b at the seam).**
  Locus: `vite.config.ts:274` vs `:286`. Make the demo build have EXACTLY ONE output path,
  declared in one place, and make a second output IMPOSSIBLE, not merely cleaned: give the
  DEFAULT demo build the SAME single canonical `outDir` (under the gitignored root `dist/`) so no
  Vite invocation can ever write to `demo/app/dist/` again — the orphan becomes UNREACHABLE BY
  CONSTRUCTION. Delete the existing Mar-25 `demo/app/dist/` orphan as one-time hygiene (it is
  already VCS-ignored — no gitignore change needed; correct the B9-finding's stale "add to
  .gitignore" note). **WHY:** `root` with no explicit `outDir` is the STRUCTURAL cause of the
  orphan; the fix is outDir collapse, not a periodic `rm`.

- **S2 — the dev server must NOT mask missing assets as 200-HTML (closes B9-a's invisibility).**
  Locus: the dev SPA history-fallback. Asset paths and route paths are different NAMESPACES — the
  SPA fallback must apply to ROUTES, never to file-extension'd asset requests. A request for a
  `*.svg` (or any asset-extension) that MISSES must 404 HONESTLY so it surfaces in the network tab
  and the runtime gate, instead of silently returning HTML. **WHY:** the SPA fallback returning
  `index.html` for `*.svg` is what let the orphan hide; making orphaned-asset failures OBSERVABLE
  is the precondition for any gate to catch them.

- **S3 — ONE runtime icon-paint gate replaces source-shape `proof:scene-icons` (closes the
  blindspot for good — the headline).** Locus: a new runtime gate; retire `proof:scene-icons`.
  Playwright opens EACH scene, and for EVERY `SceneDescriptor.icon` (plus the favicon) asserts the
  glyph is a PAINTING inline `<svg>` with a non-zero bounding box — not an SPA-HTML fallback, not
  a broken `<img>`, not a zero-box node. While clicking through scenes AND opening the CSS editor,
  asserts the SERVER-SIDE 404 set is empty (`server404Paths:[]`). **WHY:** this ONE gate subsumes
  the old one — it proves the descriptor names an icon AND that the icon paints AND that no asset
  404s during interaction (the three things the source-shape H gate could not see). A future
  rename that orphans a path then REDs at runtime, where it lives, instead of passing a load-time
  shape check.

- **S4 — the demo title is single-sourced from `index.html`, no build rewrite (closes K).** Locus:
  `demo/app/index.html:7`. Set `<title>keyframes.js</title>` so the SOURCE IS the shipped title —
  no build-time title rewrite masking the source. The gh-pages build is the authority; reconcile
  so they match. `demo/playground/index.html` keeps its own title (out of scope). **WHY:** the
  source-vs-build title drift is the same family as B9; the source must be the authority.

- **S5 — DC-8: the scene-swap dead-CSS DECISION (criterion-bound; no fourth defer).** Locus: the
  scene-swap VT CSS in `demo/app/App.vue` + `demo/app/useSceneTransition.ts` + `useSceneSwap.ts`.
  **THE DECISION RULE (explicit, machine-checkable — NOT a criterion-less "DECIDE"):**
  - **DEFAULT = KILL.** Any demo-side scene-swap VT CSS rule whose `grep` finds NO live
    `startViewTransition` consumer that references it is DEAD — delete it in one motion (`grep`
    for that dead rule = 0 after). The default is KILL; this is the case when the VT path was
    booked-forward but never wired.
  - **EXCEPTION = RESTORE + gate it.** A scene-swap VT CSS rule IS retained iff a LIVE
    `startViewTransition` consumer references it — in which case it is NOT dead, it is RESTORED
    (kept) and a runtime gate must assert the VT path actually drives a scene swap.
  - **THE LIVE VERDICT (verified first-hand — the exception fires, so DC-8 = RESTORE + gate):**
    `startViewTransition` IS a live consumer. `demo/app/useSceneTransition.ts:2` imports it from
    `@mkbabb/glass-ui/motion-core`; `:31` `runSceneSwitch` wraps the key mutation in it; `App.vue:291`
    calls `useSceneTransition(switchScene, sceneHostEl)`; `App.vue:310-311` `.scene-host {
    view-transition-name: scene-subject }` is a LIVE VT-named element. The `::view-transition-*`
    animation CSS lives in glass-ui's `view-transition.css` (consumed-published, NOT demo-owned —
    `App.vue:307-308`), so there is NO demo-side dead VT CSS to KILL. **Therefore DC-8 resolves to
    RESTORE + gate** (the live VT path is gated by S5's §Hard gate clause (e)), and the KILL target
    reduces to: `grep` for any ORPHAN demo-side scene-swap CSS rule with no live consumer = 0.
  - **The fourth-defer is forbidden by the P-invariant.** The rule is mechanical (KILL-unless-live-
    consumer), so the gate clause (e) BITES — it cannot be a soft re-defer.
  - Ties to FB-4 / GH-4 only IF I elects directional VT (`{types}`); the live cross-fade path
    above is the non-directional consumer that already exists and is RESTORED. **WHY:** twice-
    deferred A→B→C, run out of forward-references; the decision is now criterion-bound and gated,
    not re-punted. (`recap-deferred §7`.)

- **S6 — source-map noise (B9-c): deliberate disposition, NOT a "fix."** ACCEPT + document; de-
  scope it from "broken product." The x47 is dev-only DevTools diagnostics from pre-bundled vendor
  maps (Monaco languages + `html2canvas`); the build is `sourcemap: false` and clean. Do NOT add
  machinery to silence benign noise (suppressing it at the Vite dep-optimize layer risks masking
  REAL future map errors — KISS). The S3 gate already asserts `sourcemapNon200 === 0` on the BUILT
  product, which is where it matters. **WHY:** suppression machinery for benign dev noise is anti-
  KISS; the gate guards the product, where the disposition belongs.

## §Hard gate (the proof:* that BITES — born-RED on a defect tree, GREEN-on-fix · RUNTIME/INTERACTION)

**`proof:icon-paint-live`** + **`proof:demo-title`** + **`proof:single-build-root`** — Playwright
over the BUILT `dist/gh-pages/` (the `proof-no-orphan-specular.mjs` harness) + a build-config
check:

- **clause (a) — every scene glyph PAINTS.** Open EACH scene; for every `SceneDescriptor.icon`
  (+ favicon) assert a painting inline `<svg>` with a non-zero bounding box (not SPA-HTML, not a
  broken `<img>`, not a zero-box node). **BITE:** reds on a defect tree where a glyph is orphaned/
  broken (the orphaned-rename class — the gate is born-RED against a tree with a renamed-away icon
  import); greens when every descriptor glyph paints. **This is the runtime paint assertion the
  source-shape `proof:scene-icons` could not make.**
- **clause (b) — zero asset-404 during interaction.** While clicking through every scene AND
  opening the CSS editor, assert the server-side 404 set is empty AND `sourcemapNon200 === 0` on
  the built product. **BITE:** reds on a tree with an orphaned asset path (or a real map non-200);
  greens on the clean build. **Requires S2** (the dev server must 404 honestly) for the dev-side
  variant to be meaningful — on the built dist it is already clean, which is the authority.
- **clause (c) — `document.title === "keyframes.js"`.** Assert the rendered title on the deployed
  demo equals EXACTLY `keyframes.js`. **BITE:** reds TODAY on the source (`demo/app/index.html:7`
  carries the long title); greens on S4.
- **clause (d) — single build root (HYGIENE tier, build-config).** Assert the demo build config
  declares exactly ONE canonical `outDir` and a bare `vite build` cannot write to
  `demo/app/dist/`. **BITE:** reds TODAY (the default-outDir landmine); greens on S1. *(Labeled
  HYGIENE — a config invariant; the runtime correctness oracle is clauses (a)/(b)/(c)/(e).)*
- **clause (e) — DC-8: the scene-swap VT path is DECIDED (RUNTIME, per S5's rule).** The S5
  decision rule (KILL-unless-live-consumer) resolved to RESTORE + gate because
  `startViewTransition` IS a live consumer (`useSceneTransition.ts:31`, `App.vue:291/310-311`).
  This clause asserts the LIVE outcome at runtime: drive a real dock-Select scene switch over the
  BUILT `dist/gh-pages/` and assert a View Transition actually fires (`document.startViewTransition`
  is invoked / a `::view-transition` pseudo enters the active state during the swap, with the
  `view-transition-name: scene-subject` host participating) AND `grep` for any ORPHAN demo-side
  scene-swap CSS rule with NO live consumer = 0. **BITE:** reds on a tree where the VT path is
  dead-wired (a scene-swap CSS rule with no live consumer present — the KILL target non-zero) OR
  the live consumer no longer drives a transition on switch; greens when the live VT path drives
  the swap and zero orphan rules remain. *(RUNTIME tier — the interaction oracle for DC-8; the
  `grep`-orphan check is the HYGIENE corroborator, not the substitute.)* **This is the mechanical
  bite that forbids the fourth defer: an undecided DC-8 reds here.**

**The §spine bar — MUST bite.** Clauses (a)/(b) CLICK through every scene + open the editor and
assert every glyph PAINTS a non-zero `<svg>` with an empty 404 set during interaction — the
runtime paint assertion the source-shape `proof:scene-icons` structurally could not make (it
confirmed the descriptor NAMES an icon, never that it paints; the SPA-fallback hid the orphan as
200-HTML — `rc-icons-build §3`). Clause (c) asserts the exact rendered title. Clause (e) drives a
real scene switch and asserts the live VT path fires + zero orphan scene-swap CSS (DC-8 DECIDED at
runtime). RED on a tree with an orphaned/renamed icon, the long title, or a dead-wired VT rule;
GREEN when the build is single-rooted, the dev 404s honestly, the gate paints every glyph, the
title is single-sourced, and the live VT path drives the swap. This gate is a CLAUSE of the I.W7
`proof:live-session` battery (the per-scene icon-paint leg).

- **The TWO-TIER TAXONOMY, applied to THIS wave's gates (H-4 — the wave's GREEN is RUNTIME-gated).**
  The **RUNTIME / load-bearing correctness oracle** is clauses **(a) icon-paint**, **(b) zero
  asset-404 during interaction**, **(c) document.title**, and **(e) live VT scene-swap** — the
  wave is GREEN iff ALL FOUR pass through the running product. Clause **(d) single-build-root** is
  the **HYGIENE / corroborating** tier (a build-config invariant): it strictly corroborates S1 and
  **may NOT substitute for a red runtime clause** — if any of (a)/(b)/(c)/(e) is RED, the wave is
  RED no matter what (d) reports, and a GREEN (d) over a RED runtime clause is a non-close. The
  `grep`-orphan half of clause (e) is likewise HYGIENE-tier under the (e) runtime assertion. This
  is the §S5 two-tier taxonomy applied to the NEW gates (the overhaul holding itself to its own
  taxonomy — H-4), not just the retired `proof:scene-icons`. The headline correctness axis is
  **the icon PAINTS** (runtime), with the outDir/config check strictly hygiene-corroborating.

## §Folds

- **B9-a** (the `ENOENT` orphan) — S2 (honest 404) makes it observable + S1 (delete the orphan,
  unreachable build root). **B9-b** (dev-vs-build drift) — S1 (one build root). **B9-c** (source-
  map ×47) — S6 (accept + document, gate the built product only). The runtime paint gate (S3) is
  the headline that subsumes the source-shape `proof:scene-icons`.
- **K** (the demo name) — S4 (single-source the title from `index.html`). Same source-vs-build
  family as B9.
- **DC-8** (scene-swap dead-CSS) — S5 (DECISION RULE: default KILL [grep=0] UNLESS a live
  `startViewTransition` consumer exists → RESTORE + gate). The live verdict (verified first-hand):
  the consumer EXISTS (`useSceneTransition.ts:31`, `App.vue:291/310-311`), so DC-8 = RESTORE +
  gate via §Hard gate clause (e) (runtime VT-fires + zero orphan rules). No demo-side dead VT CSS
  to KILL (the `::view-transition-*` CSS is glass-ui-owned, `App.vue:307-308`). The P-invariant
  forbids a fourth defer; the rule is mechanical, so clause (e) BITES — no criterion-less re-punt.
- **The icon architecture is SOUND — RECORD, do NOT re-architect.** inline-`<svg>` via
  `?component`, icon-as-data on `SceneDescriptor.icon`, `<component :is="scene.icon">` — preserve
  it. Its ONLY flaw is build-time/load-time-only; S3 adds the runtime paint axis it lacked.

## §Design decisions (trade-offs RESOLVED)

- **Collapse the outDir, don't `rm` the orphan periodically — RESOLVED.** The root with no
  explicit `outDir` is the architectural cause; the fix makes a second build root IMPOSSIBLE by
  construction (one canonical `outDir`), not a recurring cleanup. The one-time orphan delete is
  hygiene; the structural fix is the collapse. (The gitignore line is ALREADY satisfied — do not
  re-litigate it.)
- **404 asset misses honestly, don't suppress the dev noise — RESOLVED.** The SPA-fallback
  masking is what hid the orphan; honest 404s for asset-extensions make orphaned assets
  OBSERVABLE (the precondition for any gate). The source-map x47 is the OPPOSITE call: it is
  benign dev-only diagnostics; suppressing it risks masking real future map errors, so ACCEPT +
  document and gate only the built product. Two different dispositions for two different noises,
  each KISS.
- **One runtime paint gate over the source-shape `proof:scene-icons` — RESOLVED.** The source-
  shape gate confirmed the descriptor names an icon; it was blind to the orphaned-rename class
  (the SPA-fallback hid the 404). The runtime gate asserts the glyph PAINTS + the 404 set is empty
  during interaction — one gate that subsumes the old one and adds the axis it lacked. This is the
  B9-shaped instance of the tranche-wide gate-regime overhaul.
- **MED, not HIGH — RESOLVED.** The built `dist/gh-pages/` is CLEAN (0 icon 404s, 0 source-map
  non-200s across 7 scenes); the deployed product does NOT have B9. B9 is a dev-environment
  integrity failure (the stale orphan + the SPA-fallback masking + the dev-only map noise). Low
  risk, high hygiene — but the STRUCTURAL gap (no shared asset truth, no runtime paint gate) is
  real and worth closing, and it carries K + DC-8 in the same family.
