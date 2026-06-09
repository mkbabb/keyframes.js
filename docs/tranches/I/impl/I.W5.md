# I.W5 — IMPL record (icon single-source + build-hygiene + shell chrome)

**Status:** LANDED · gate `proof:icon-paint-live` GREEN (live, against the BUILT
`dist/gh-pages/`) · `tsc` 0 · branch `tranche-i-dev`.

## What landed (file:line)

- **S1 — ONE canonical build root.** `vite.config.ts` — the default/dev demo branch (the
  former `root: "./demo/app/"` with NO `outDir` — the landmine) now declares
  `DEMO_DEFAULT_OUTDIR = ./dist/demo-app/` + `emptyOutDir`. No Vite invocation can spawn
  `demo/app/dist/` again; the orphan is unreachable BY CONSTRUCTION. gh-pages (`./dist/gh-pages/`),
  the library `dist/`, and the playground targets are untouched (verified via `resolveConfig`
  across all four modes). The Mar-25 `demo/app/dist/` orphan was deleted (one-time hygiene; the
  gitignore line was already satisfied — not re-litigated).
- **S2 — the dev server 404s asset-extension misses honestly.** `vite.config.ts` —
  `assetExtension404Plugin()` (`apply: "serve"`, registered in `configureServer` ahead of Vite
  8's `htmlFallbackMiddleware`) declines to rewrite a `*.svg`/`*.png`/`*.map` MISS to index.html,
  so an orphaned asset 404s honestly (was 200-HTML, which hid the B9-a orphan). Verified live.
- **S4 — the demo title.** `demo/app/index.html` — `<title>keyframes.js</title>` (single-sourced;
  no build-time rewrite). The gh-pages build ships it verbatim.
- **S5 — DC-8 RESTORE + gate.** Verified first-hand: the live `startViewTransition` consumer
  EXISTS (`useSceneTransition.ts:32`, `App.vue` `.scene-host` `view-transition-name:
  scene-subject`); the `::view-transition-*` CSS is glass-ui-owned (consumed-published). The
  comment-blanked grep finds ZERO orphan demo-side scene-swap CSS → DC-8 = RESTORE (KILL target ∅),
  gated by the runtime VT-fires clause. No fourth defer.
- **S6 — source-map noise (B9-c):** ACCEPTED + documented (a comment at the gh-pages
  `sourcemap: false`); no suppression machinery. The built `dist/` is clean.

## The gate (proof:icon-paint-live) — live GREEN

Born-RED on the stale/defect tree; GREEN on fix:
- **(a)** every `SceneDescriptor.icon` (7/7 scenes, parsed from `scenes.ts`) + the favicon PAINTS
  a non-zero inline `<svg>` (the dock first-loads collapsed — the gate hovers `.glass-dock` to
  expand before probing). NOT SPA-HTML, NOT a broken `<img>`, NOT a zero-box node. ✓
- **(b)** across 7 scene navigations + the open Select + the editor mount, the server-side
  asset-404 set is EMPTY and `sourcemapNon200 === 0` on the built product. ✓
- **(c)** `document.title === "keyframes.js"`. ✓
- **(d) HYGIENE** single-build-root config invariant (one canonical outDir; no landmine). ✓
- **(e) RUNTIME DC-8** a real dock-Select scene switch FIRES the live View Transition
  (`startViewTransition` invoked, `.scene-host` participates) + zero orphan demo-side VT CSS. ✓

The runtime paint axis the source-shape `proof:scene-icons` structurally lacked is now asserted.
**`proof:scene-icons` retirement is folded into I.W7's census cleanup** (the gate-regime overhaul
owns the lattice retirements). MED severity — the built `dist/` was always clean; B9 was a
dev-environment integrity failure + the structural no-runtime-paint-gate gap, now closed.
