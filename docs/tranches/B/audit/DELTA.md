# Tranche B — before/after DELTA (the every-page paired-capture edict)

The before/after-every-page edict B authored into precepts (`8ccf9f4`),
run on B itself. BEFORE: 18 captures at W0 (`screenshots/before/`, on the
dev server — the prod build was blank). AFTER: 18 captures at W7
(`screenshots/after/`, against the **W4-repaired PROD build** — the surface
that actually ships). The pairing is honest precisely because AFTER is the
shipped artefact; the asymmetry is named here so a reader does not read it
as dev-vs-dev.

`_capture-report.json` (after): **zero console errors on every page ×
viewport** — the demo-smoke runtime assertion at close.

## Pages meant to change (intended delta, owning wave)

| Page | Intended change | Wave | Evidence |
|---|---|---|---|
| **home** | splash gone → instant critical-CSS paint; hero no longer over the parked cube | W4, W3 | `after/home-*.png`: themed first paint, hero + cube both in-bounds |
| **cube** | full cube fits + centered at 1280/1440 (was ~half-clipped off the right edge); axis guides no longer read as clipped strays through the headline | W3 | `after/cube-{laptop,desktop}.png`: cube dead-center (graph cx 1397→720); occlusion gate green |
| **amiga** | the 3D sphere renders centered at idle (was a BLANK viewport) | W3 | `after/amiga-*.png`: the red-checkered sphere in its room |
| **square** | the aquamarine box renders centered at idle (was BLANK) | W3 | `after/square-*.png`: the `.square-box` |
| **easing** | the f(t) easing-curve plot renders at idle (was BLANK) | W3 | `after/easing-*.png`: the bezier curve + draggable control points |
| **spring** | the spring rail + ball render at idle (was BLANK) | W3 | `after/spring-*.png`: the rail |
| **all six, mobile** | TopDock pill clears the safe-area (was sheared at y=0) | W3 | `after/*-mobile.png`: dock pill fully rounded |
| **all six** | `<main>` landmark + alt + meta/robots (a11y/SEO) — non-visual | W5 | lighthouse: landmark-one-main, image-alt, meta-description, robots-txt closed |

The four blank scenes are the headline: BEFORE they rendered only the two
docks (9-10 visible elements); AFTER 34-47 — the subject paints. Root cause:
a `<KeepAlive>` + `<Transition mode=out-in>` around a keyed `<Suspense>`
whose child is a `defineAsyncComponent` never triggered the async loader
(the scene chunk was never even requested). Empirically isolated, fixed by
dropping both wrappers.

## Pages/regions NOT meant to change (pixel-stable modulo non-determinism)

The editor-shell chrome (header ribbon, share/dark-mode), the CSS code
editor, the bottom transport menubar STRUCTURE, the dock dropdown contents.
The DELTA asserts these are stable modulo the edict's allowed
non-determinism (in-flight animation frame, caret, cursor, the live 3D
cube's idle pose). No unintended regression observed: the occlusion gate is
green on every page × viewport (zero overflow, every subject present +
centered), and the AFTER console-error log is empty everywhere.

## Occlusion cross-check (inv δ, populated scenes)

BEFORE's amiga/square/easing/spring read "clean" in the W0 occlusion report
ONLY because they were EMPTY (nothing to overflow — a false-green). AFTER
the occlusion gate runs against POPULATED scenes and is green: zero
horizontal overflow, every subject present + in-bounds + roughly centered
(15-85% of vw), on all 6 pages × {375, 1280, 1440}. The cube's BEFORE
right-edge clip is resolved (the gate's centering check bites on it:
re-introducing the clip turns cube/laptop+desktop red at "97% of vw").
