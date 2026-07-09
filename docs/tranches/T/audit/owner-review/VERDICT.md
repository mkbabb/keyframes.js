# THE OWNER LIVE-REVIEW VERDICT — 2026-07-04 (the S impl drive's demo state, audited live at localhost:5180)

> The owner audited the running demo on the `tranche-s-impl` tree (post-⑩, post-S.C4/S2 — every S
> gate green, the roster failing set empty) and **REJECTED the demo state wholesale**. This file is
> the itemized, screenshot-grounded catalogue (shots/NN.png = the preserved evidence; owner words
> quoted). It is the SHARED GROUNDING for every Tranche-T audit lane. The directive that carries
> it: **"This is NOT an implementation phase. Tranche development only"** — the 32-agent audit +
> the developed successor tranche, per the owner's orchestration spec.
>
> THE META-FACT every lane must hold: this state passed 85/85 roster gates, 11×100% critic
> convergence at dev, and every born-RED oracle — and the owner rejected it on sight. The
> gate-blindspot lesson (MEMORY: "green source-shape gates miss appearance/interaction/state")
> recurred AT SCALE despite the S.A4 re-taxonomy. Lane 26/29 own this analysis.

## The itemized catalogue

| # | Shot | Surface | Owner verdict (quoted where sharp) |
|---|---|---|---|
| 1 | 01 | cube | "does not render fully" — ONE die face renders (flat red square + axes), not the cube |
| 2 | 02 | home `@KEYFRAMES · LIVE` typing card | "remove this crap" (the kf-source-egg card) |
| 3 | 03, 18 | the hero | "the original hero animation is totally broken and should uplift each individual char" — the word-granular F.W16 split REJECTED; per-CHAR uplift wanted. Hero sits jammed at top overlapping the dock + the cube gesture legend; "should be lower on the page, more towards the centre — it's OK if it sits a bit on top of the cube." Sub-header fonts wrong ("from the list ☰ below…" italic system-ish) |
| 4 | 04 | both docks | "blurry, broken, janky messes"; "All of the dock animations are ruined" — icon renders as an unreadable blur-blob |
| 5 | 05 | cube `rx 0° ry 0° rz 0°` readout | "Remove this as well" |
| 6 | 06 | the dock cluster | broken tooltip ("Clear all & reload" ghost-duplicated above the dock); "what's this superfluous dividing line when on the home screen? And the play button should be the first element" |
| 7 | 07 | the controls pane | "remove the surrounding pane — it's superfluous" (the outer wrapper around the panel card) |
| 8 | 08 | amiga gesture legend "DRAG: SPIN THE BALL / DOUBLE-TAP: BOING!" | "remove all elements like this" — the S.G3 gesture-legend layer REJECTED wholesale |
| 9 | — | amiga | "a broken mess and does not properly interleave and stack animations" |
| 10 | 09 | the dock `[⊞] │ Controls ⌄ │ Amiga ⌄ │ @mbabb` | context for #12/#13 (single-option elision; the divider; ordering) |
| 11 | 10 | square caption block ("SPRING-CHASED · DRAG THE BOX…/X·Y ∈ [-1,1]/DOUBLE-CLICK TO TUMBLE/PRESS C TO TRACE THE FIELD") | "superfluous nonsense" — remove |
| 12 | — | square | "what even happened to this — totally a mess and unusable"; "Square used to have a proper keyframes, controls, etc section but that was removed?" — **the S.G2 honest-collapse (DFA square=[]) is REJECTED; the full controls/keyframes/timeline panel must return** |
| 13 | 11 | easing curve-physics telemetry (":: double-tap: name this curve / peak velocity / overshoot / anticipation / snaps hard…") | "Remove all of this" |
| 14 | 12 | easing curve canvas + preview ball | "we should just have the easing balls previewed here" |
| 15 | 13 | the Gallery button | "remove this button" — the S.G3 gallery-door REJECTED |
| 16 | — | easing page | "Most of this page looks awful and needs to be re-designed with glass-ui in mind. I don't like this latent red theme." Fonts: "the sub-header hero and dropdowns are mostly wrong" |
| 17 | 14 | spring dock `∿ Spring │ ∿ Spring ⌄` | "when we have a page with ONE option… the dock should not show an extra 'spring'/'easing' item — elide that intelligently if there's only ONE option. Same for animations — not displayed if an animation only has ONE sub-animation" |
| 18 | 15, 16 | spring presets + `Live solver │ Discrete transition` pills (KfPillTabs) | "what the fuck even is this? If we're to have a keyframes option, it should be like the core cube/amiga/square (how it used to be) with sub options for the controls, keyframes, timeline, etc."; "wtf are most of these items? KfPillTabs.vue?? KF? Pills? Why aren't these just glass-ui components?" |
| 19 | — | every page | "The performance on every single page is god awful and needs to be rethought from the ground up" |
| 20 | — | motion-path | "barely works" |
| 21 | 17 | morph | "does not work at all" — renders a BARE GRID, nothing else |
| 22 | — | the cursor light | "strange light that follows the cursor, but only partially — if you're going to implement this, it should be done right" |
| 23 | — | compose | "just straight up remove this crap"; "motion-path, morph, and compose likely need to just be pruned" |
| 24 | — | fonts/sizes sitewide | "Most of the fonts on the site are not right at all"; "Ensure ALL fonts, sizes, etc are consistent and properly leveraging glass-ui components" |
| 25 | — | the panel facility | "Why do we not properly have a keyframes, controls, etc view for the other sub-animations? It's like we forgot about that facility entirely?" |
| 26 | — | demo/ structure | "needs to be entirely re-structured from first-principles… sub-components, composables, skeletons, constants — recursively"; "demo/@/styles — what the fuck is this?"; "wtf is demo/app/chrome?"; "wtf is 90% of the junk in demo/app? Most should be pruned"; "demo/scenes — why aren't these properly composed into sub-components?"; "demo/@ is totally half baked and inconsistent" |
| 27 | — | glass-ui | "Leverage proper, and the latest, glass-ui components for all items when befitting. Delineate our gaps, and glass-ui's gaps — glass-ui is in active development with BG/BH forthcoming" |
| 28 | — | the codebase | the standing refactor litany re-issued verbatim: legacy/deprecated/workaround/fallback sweep (excise or fail-explicit); encapsulation/DI/service boundaries/pipeline orchestration; no god modules (>500L); no nested imports; no test files in src; DRY/KISS; lint+typecheck at every interval; brittle-selector + non-idiomatic-tailwind + fragile-CSS audits; localized design idioms with colocation |

## The directive (operative clauses)

- "DEEPLY audit with 32 agents in parallel our original plan and waves thereof, alongside all changes made herein."
- "Devise a path forward: audit the hitherto made changes and the remaining plan; recapitulate our original prompts, plans, and precepts: NO quick solutions, NO workarounds: idiomatic, gestalt approaches… architectural transpositions in the sake of elegance, simplicity, and performance above all."
- "NO legacy code." · chronic + deferred items folded · ALL prompts recapped.
- "**This is NOT an implementation phase. Tranche development only.**"
- Orchestration: core model (Fable) for orchestration/design/synthesis — "all design must be routed using Fable and the frontend design plugin"; Opus/Sonnet for fanout; batches of three.
