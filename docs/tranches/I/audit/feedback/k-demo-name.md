# K — the demo name / document title (live feedback, 2026-06-08)

User: "the demo name should just be 'keyframes.js'."

The browser tab title currently reads (screenshot evidence):
> keyframes.js — CSS keyframe animations for anything in JavaScript

It should be just:
> keyframes.js

**Locus:** `demo/app/index.html:7` —
`<title>keyframes.js — CSS keyframe animations for anything in JavaScript</title>`
→ `<title>keyframes.js</title>`.

**Note (latent discrepancy worth auditing under B9 / the icon+asset/single-source
lane):** the SOURCE `demo/app/index.html` carries the long title, but a built
`demo/app/dist/index.html` carries the short `keyframes.js` — a source-vs-build
drift in the same family as the easing-icon-sm.svg dev/build split. The gh-pages
build is the authority; reconcile so the source IS the shipped title (no build-time
title rewrite masking the source). `demo/playground/index.html` keeps its own
"Playground — keyframes.js" title (out of scope — that is the playground app).

Trivial wave item; fold into the Tranche I scene/shell-chrome wave. A real gate:
the rendered `document.title` on the deployed demo equals exactly "keyframes.js".
