export const meta = {
  name: 'tranche-e-dev',
  description: 'Author the keyframes.js Tranche E development docs (perf · modern-web · frontend refinement round 2) — DOCS ONLY, no implementation',
  phases: [
    { title: 'Evidence', detail: 'lighthouse every scene · modern-web-guidance install+digest · consolidated ledger+recap' },
    { title: 'Author', detail: 'E.md · PROGRESS · waves E.W0-W6 · 6-lane audit findings (file-disjoint)' },
    { title: 'Harden', detail: 'adversarial review + fix — completeness · falsifiable gates · no-legacy · isomorphism · modern-web soundness' },
  ],
}

const REPO = '/Users/mkbabb/Programming/keyframes.js'
const E = `${REPO}/docs/tranches/E`
const PLAN = '/Users/mkbabb/.claude/plans/ticklish-wibbling-kay.md'

const COMMON = `keyframes.js Tranche E is a DEVELOPMENT phase — you author DOCS ONLY (no engine/demo/library source; this is the dev/impl boundary D.W0 used). Repo: ${REPO}.
AUTHORITATIVE SOURCES (read first):
- The approved E plan (top section): ${PLAN} — the synthesized 6-lane assay findings + the E.W0-W6 wave structure + the clean-ledger + recap. This is your spec.
- The Tranche D docs as the STRUCTURAL TEMPLATE: ${REPO}/docs/tranches/D/ (D.md charter, PROGRESS.md, waves/D.W*.md, audit/*-findings.md) — mirror their voice, rigor, and the "every gate is a falsifiable re-runnable instrument" discipline (inv ε).
PRECEPTS (thread through): NO legacy/deprecated codepaths; NO quick solutions/workarounds; idiomatic + gestalt; architectural transpositions for elegance/simplicity/performance; isomorphic styling (pixels unchanged unless HIGHLY befitting + named); KISS; inv-16 (E writes only keyframes.js). E barely touches the published library (the engine is exemplary post-D); E is demo-side perf + modern-web + frontend refinement. The deferred ledger is CLEAN (D terminated all keyframes-owned deferrals — zero KFE); E's content is NET-NEW findings, NOT folded debt — state this honestly.
Every finding must be file:line-grounded + verifiable (grep/wc/lighthouse), never asserted.`

const WRITE_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['files', 'summary'],
  properties: {
    files: { type: 'array', items: { type: 'string' }, description: 'absolute paths written' },
    summary: { type: 'string' },
    notes: { type: 'string', description: 'anything the harden phase or sibling lanes must know' },
  },
}

// ── Phase 1 — Evidence (parallel; some need execution deferred out of plan mode) ──
phase('Evidence')
const evidence = await parallel([
  () => agent(`${COMMON}

EVIDENCE LANE — LIGHTHOUSE BASELINE. Build the demo and run lighthouse on EVERY scene to capture the real post-D performance baseline + opportunities (the input to E.W4's optimization strategy).
- Ensure the demo is built: \`cd ${REPO} && npm run gh-pages\` (output dist/gh-pages). Playwright + chromium are already installed locally.
- Run \`cd ${REPO} && node scripts/lighthouse-gate.mjs\` to drive lighthouse over the 5 scenes (cube/square/easing/spring/amiga) × viewports in their open-panel editing state; capture the scores it reports. If it gates only a11y/SEO, ALSO run a raw lighthouse perf pass on at least the cube + easing scenes (you may use the lighthouse npm bin: \`npx lighthouse <url> --only-categories=performance --output=json --quiet --chrome-flags="--headless"\` against a served dist/gh-pages on a local port) to get Performance scores + the top opportunities (LCP, TBT/Long-Tasks, render-blocking, unused JS/CSS, font-display).
- WRITE ${E}/audit/lighthouse-findings.md: a table of scene × viewport × {Performance, Accessibility, Best-Practices, SEO} scores, the top recurring opportunities, and a comparison to the Tranche B baseline (Perf 89–96, reports under docs/tranches/B/audit/lighthouse/ if present). Each row cites the measurement. Conclude with the prioritized optimization levers for E.W4.
inv-16: write only under ${E}/. If lighthouse cannot run, record exactly why + fall back to the B baseline reports, and say so.`, { label: 'evidence:lighthouse', phase: 'Evidence', agentType: 'general-purpose', schema: WRITE_SCHEMA }),

  () => agent(`${COMMON}

EVIDENCE LANE — MODERN-WEB-GUIDANCE. The user mandated: compare keyframes.js core primitives + the last tranche-set items against https://developer.chrome.com/docs/modern-web-guidance, and \`npx modern-web-guidance@latest install\`.
- Run \`cd ${REPO} && npx --yes modern-web-guidance@latest install\` and report what it installs (it is a Claude-Code skill/plugin bundling web-platform best-practice guidance). Then DIGEST the guidance it provides (read the installed skill files / its docs / the GitHub repo it points at) into a concrete checklist of modern web-platform recommendations across: Performance (Long-Task/INP, LCP, link-preload-on-hover, bf-cache), CSS (Anchor Positioning, container queries, color-mix, :has, view-transitions), HTML/JS (native <dialog>, Popover API, scheduler.yield/postTask), Security (CSP), Accessibility.
- COMPARE against keyframes.js: (1) the CORE primitives (src/animation: engine, WAAPI delegation, scheduler.yield, ScrollTimeline, reduced-motion) — note where already aligned (the audit found the engine EXEMPLARY) vs any gap; (2) the DEMO — does it hand-roll modals/popovers that reka-ui already routes to native <dialog>/Popover (verify), use container queries (it does — cqw), miss link-preload-on-hover / content-visibility / view-transitions for scene-swaps; (3) the last-tranche (A→D) items vs the guidance.
- WRITE ${E}/audit/modern-web-findings.md: the checklist · per-item keyframes status (ALIGNED / GAP→E.W4 / N-A-with-reason) · file:line evidence. Distinguish ENGINE (mostly aligned, leave) from DEMO (the E.W4 opportunities).
inv-16: write only under ${E}/. If the npx install is interactive/unavailable, record that + digest the guidance via the public docs/repo instead.`, { label: 'evidence:modern-web', phase: 'Evidence', agentType: 'general-purpose', schema: WRITE_SCHEMA }),

  () => agent(`${COMMON}

EVIDENCE LANE — CONSOLIDATED DEFERRED-LEDGER + PROMPT-RECAP. Author the two recap artifacts the E tranche needs, grounded in the prior tranche docs.
- Read every docs/tranches/{A,B,C,D}/audit/{deferred-ledger,prompt-recap}.md + FINAL.md + PROGRESS.md that exist (\`find ${REPO}/docs/tranches -name "deferred-ledger.md" -o -name "prompt-recap.md" -o -name "FINAL.md"\`).
- WRITE ${E}/audit/deferred-ledger.md: the CONSOLIDATED ledger A→D with each item's terminal status. The headline (verified by the assay): D terminated EVERY keyframes-owned deferral — ZERO KFE for E. The only open items are OUT (glass-ui: ASK-3 LabeledField a11y, ASK-2 VAL-9 --spring codegen, AU.W8 role-base) — E keeps the enablers stable + the named allowances; and ARCH (ScrollTimeline-native, Worker/OffscreenCanvas, dev.sh — recorded KILL, do not re-litigate); and D-PENDING-ON-E1 (W5 dock+occlusion + W6 close, gated on glass-ui 3.3.0 — D's close, NOT E). State P-invariant-28 is satisfied: E folds no chronic debt because none remains.
- WRITE ${E}/audit/prompt-recap.md: the CONSOLIDATED table of EVERY user request/precept A→B→C→D→constellation→this E ask · origin · status (ADDRESSED / PARTIAL / PENDING / E-SCOPE). Verify the recurring precepts (no-legacy, no-workaround, idiomatic+gestalt, isomorphic, KISS, inv-16) are honored. Confirm: no drops. E-SCOPE rows = the net-new E findings (encapsulation r2, vueuse-listener gestalt, styling r2, perf+modern-web).
inv-16: write only under ${E}/.`, { label: 'evidence:recap-ledger', phase: 'Evidence', agentType: 'general-purpose', schema: WRITE_SCHEMA }),
])
log(`Evidence: ${evidence.filter(Boolean).length}/3 lanes done`)

// ── Phase 2 — Author (parallel, file-disjoint) ───────────────────────────────
phase('Author')
const authored = await parallel([
  () => agent(`${COMMON}

AUTHOR LANE — THE CHARTER. Write ${E}/E.md, modeled on ${REPO}/docs/tranches/D/D.md (same sections + voice): the thesis (D made the demo correct+localized & the engine gestalt; E makes it fast+modern+maximally-idiomatic and completes the vueuse/listener gestalt D.W3 began), §Goal criterion, §Completion criterion, §Inherited invariants (α–ι carried forward), §E-specific invariants (continue the Greek series from ι — propose 2-3 named, each with a falsifiable proof:* gate, e.g. inv κ = no demo listener/observer hand-rolled where vueuse is the thing [proof:no-hand-rolled-listeners]; inv λ = every referenced design idiom incl utilities resolves demo-local [extends inv η to .gold-shimmer]; inv μ = a modern-web perf budget the demo holds [proof:perf-budget / proof:modern-web]), §Resolved design decisions, §Wave table (E.W0-W6), §The DAG, §Constellation-cognizance (E independent of D.W5/W6 which close on glass-ui 3.3.0), §Release (minor/patch — demo+perf, non-breaking lib housekeeping), §Audit evidence (the audit/ lane files), §Style discipline.
inv-16: write only ${E}/E.md.`, { label: 'author:charter', phase: 'Author', agentType: 'general-purpose', schema: WRITE_SCHEMA }),

  () => agent(`${COMMON}

AUTHOR LANE — PROGRESS + the bookend waves. Model on ${REPO}/docs/tranches/D/{PROGRESS.md,waves/D.W0.md,waves/D.W6.md}.
- ${E}/PROGRESS.md: the status board — phase (DEVELOPMENT, E.W0 run now), the wave-status table with a falsifiable hard-gate column per wave, the W0 audit-evidence list (the audit/ files), verified-facts-at-E-open (the post-D component sizes: App.vue 452L, useOrbitalPointer 376L, EasingCurveCanvas 351L; the ~10 manual listener sites; .gold-shimmer rent; lib green 336 tests), the cross-repo perimeter (D.W5/W6 pending-on-E1; OUT items), open deferrals (zero KFE).
- ${E}/waves/E.W0.md: the dev/audit-fold wave — its hard gate is "the 6-lane audit on disk + re-runnable; the deferred-ledger clean (zero KFE); the prompt-recap full A→E; every E.W1-W6 spec carries a falsifiable gate".
- ${E}/waves/E.W6.md: the close — FINAL.md, prompt-recap confirmed, AFTER capture + DELTA via scripts/capture.mjs, the E changeset (minor/patch — demo+perf, non-breaking), version owner named; hard gate = the full proof suite green + zero un-dispositioned deferrals + DELTA shows no unintended regression.
inv-16: write only ${E}/PROGRESS.md + ${E}/waves/E.W0.md + ${E}/waves/E.W6.md.`, { label: 'author:progress-bookends', phase: 'Author', agentType: 'general-purpose', schema: WRITE_SCHEMA }),

  () => agent(`${COMMON}

AUTHOR LANE — the demo IMPL waves E.W1, E.W2, E.W3. Model each on the D wave specs (D.W1/W3/W2): §state-verified, §goal, §scope (S1..Sn with WHAT/WHY/file:line), §hard gate (falsifiable proof:* instrument), §folds, §design decisions.
- ${E}/waves/E.W1.md — Frontend encapsulation round 2: App.vue (452L) → extract usePlaybackSnapshot (saveCurrentPlaybackState+restoreGroupPlaybackState) + useSceneSwap (the scene-swap spring) composables; useOrbitalPointer.ts (376L) thinned — move the transform-application logic (updateTranslation/updateScale/handleAxisSpecificInput) to OrbitalDrag.vue, keep the composable pure input→event translation. EasingCurveCanvas (351L) stays (cohesive — document why). Gate: proof:decomposition extended (ceilings) + render smoke + zero behaviour change.
- ${E}/waves/E.W2.md — The vueuse listener/observer gestalt (the demo-internal inv-ζ analogue completed): the ~10 manual addEventListener/new ResizeObserver sites (SpringTarget, PlaybackRibbon[once:true crutch], useDragCapture, useOrbitalPointer, AssetViewport, AssetLayerPanel → useEventListener; EasingTarget, AmigaScene, CSSCodeEditor → useResizeObserver) + the 2 querySelector couplings (AnimationControls [data-state=active] button, KeyframeCardList querySelectorAll("pre")) → owned/child refs. Gate: proof:brittleness EXTENDED — zero manual addEventListener / new ResizeObserver in demo reactive code outside a documented allowlist (the few legitimate ones, e.g. the engine-loop allowlist); leak-fix + net-deletion; bite-proven.
- ${E}/waves/E.W3.md — Styling localization round 2 (isomorphic): define .gold-shimmer locally in design-idioms.css (close the inv-η rent — it's used ×2, defined only in glass-ui); tokenize the recurring arbitrary values (--dropdown-min-width for min-w-[12rem]×3, --target-viewport-w for w-[30vw], --visualizer-track-gutter for the magic 3rem, an --easing-dropdown-max-h); reconcile --panel-max-h:60vh to dvh (or document why vh); dedup the .progress-bar { @apply h-2 rounded-md }. Pixels unchanged. Gate: proof:idioms EXTENDED (.gold-shimmer demo-local + bite-proven; the named arbitrary values tokenized; no new rent).
inv-16: write only ${E}/waves/E.W1.md + E.W2.md + E.W3.md.`, { label: 'author:waves-demo', phase: 'Author', agentType: 'general-purpose', schema: WRITE_SCHEMA }),

  () => agent(`${COMMON}

AUTHOR LANE — the perf + engine IMPL waves E.W4, E.W5. Consume the Evidence lanes' files (${E}/audit/lighthouse-findings.md + modern-web-findings.md) once written.
- ${E}/waves/E.W4.md — Performance + modern-web alignment: the optimization strategy from the lighthouse baseline (Long-Task/INP relief on the heavy editing UI, LCP/font-loading [font-display, preload the display face], render-blocking elimination, preconnect/preload, content-visibility:auto for off-screen scenes, modern image formats if any raster assets); the modern-web alignment (verify reka-ui dialogs/popovers ride native <dialog>/Popover API — adopt if hand-rolled; link-preload-on-hover for the lazy scene chunks; view-transitions for scene-swap where it removes hand-rolled JS; CSS anchor-positioning for popovers where it removes JS positioning). Gate: a per-scene lighthouse Performance TARGET (e.g. ≥95 desktop / ≥90 mobile, calibrated to the baseline) + a NEW proof:modern-web checklist instrument that asserts the adopted modern-web items (file/grep checks) — falsifiable, bite-proven. Note npx modern-web-guidance install is an E.W4 setup step.
- ${E}/waves/E.W5.md — Engine housekeeping (BOOK-only, minimal — the engine is exemplary): document the managed-animation pause contract (a comment/CLAUDE.md note, not code); tryParseCache (utils.ts) eviction ONLY if a measure-first bench shows it matters (else recorded-withheld, the D-3 discipline). Gate: tests green, no regression; the BOOK items recorded with file:line.
inv-16: write only ${E}/waves/E.W4.md + E.W5.md.`, { label: 'author:waves-perf-engine', phase: 'Author', agentType: 'general-purpose', schema: WRITE_SCHEMA }),

  () => agent(`${COMMON}

AUTHOR LANE — audit findings: encapsulation + engine. Write the two lane files file:line-grounded (model on docs/tranches/D/audit/frontend-findings.md + engine-transposition.md).
- ${E}/audit/encapsulation-findings.md: the frontend encapsulation/composable/state assay — App.vue 452L (3 concerns: routing + playback-snapshot + scene-swap-spring), useOrbitalPointer 376L (input-plumbing + transform-business-logic conflation), EasingCurveCanvas 351L (cohesive → LEAVE, document), the composable-consistency findings (useX naming clean, colocation correct, stores/composables split idiomatic, markRaw/provide-inject correct), the directory-grouping verdict (well-organized, no over-fragmentation). Each: file:line · finding · E-disposition (FOLD-E.W1 / LEAVE / BOOK).
- ${E}/audit/engine-findings.md: the core-primitives assay — verdict EXEMPLARY post-D (no hot-path allocs [interpFrames Object.assign on pre-flattened native, group _grouped zero-alloc buffer], WAAPI maximally delegated [the reference-guard fix unblocked CSSKeyframesAnimation], scheduler.yield live-probed+cached, reduced-motion unified, ScrollTimeline correctly JS-driven not native, will-change/content-visibility = consumer-responsibility, D-3 correctly withheld). BOOK items: tryParseCache (utils.ts:~145) unbounded-growth (not hot, eviction = measure-first); managed-animation pause contract (engine.ts pause/resume/toggle — document). Each file:line + E-disposition (LEAVE / BOOK).
inv-16: write only ${E}/audit/encapsulation-findings.md + engine-findings.md.`, { label: 'author:findings-encap-engine', phase: 'Author', agentType: 'general-purpose', schema: WRITE_SCHEMA }),

  () => agent(`${COMMON}

AUTHOR LANE — audit findings: brittleness + styling. Write the two lane files file:line-grounded (model on docs/tranches/D/audit/brittleness-findings.md + styling-findings.md).
- ${E}/audit/brittleness-findings.md: the listener/observer + selector assay. THE BIG E THEME — ~10 manual addEventListener / new ResizeObserver sites NOT on vueuse (enumerate each: SpringTarget.vue:~96-108, PlaybackRibbon.vue:~116/129/159 [the {once:true} crutch + dual cleanup], useDragCapture.ts:~36-45, useOrbitalPointer.ts:~314-355, AssetViewport.vue:~207-212, AssetLayerPanel.vue:~167-172, EasingTarget.vue:~217-236 [ResizeObserver], AmigaScene.vue:~84 [ResizeObserver], CSSCodeEditor.vue:~156-164 [deferred ResizeObserver]) → useEventListener/useResizeObserver. The 2 querySelector couplings: AnimationControls.vue:~190 button[data-state=active], KeyframeCardList.vue:~51 querySelectorAll("pre"). The BOOK-acceptable (getComputedStyle reads in EasingTarget/snapshotCapture; useKeyframesParsing flush:post+nextTick; useAnimationSync settle-detect — already hardened D.W3). Each: file:line · why brittle · E-disposition (FOLD-E.W2 / BOOK / LEAVE-hardened).
- ${E}/audit/styling-findings.md: the styling round-2 assay. .gold-shimmer ungated RENT (×2 sites: EasingSelect.vue, AnimationControlsControls.vue — defined only in glass-ui; the inv-η class extends to UTILITIES not just tokens) → define-locally. The recurring arbitrary values to tokenize (min-w-[12rem]×3, w-[30vw] CubeTarget, the w-[calc(100%-3rem)] magic gutter AnimationVisualizer, EasingSelect max-h-[min(24rem,60dvh)], the lingering max-h-[60vh] in KeyboardShortcutsModal vs --panel-max-h). The --panel-max-h:60vh vs work-area dvh INCONSISTENCY. The .progress-bar @apply duplicated in KeyframesEditor + KeyframesAddDialog. Confirm CLEAN: style.css/design-idioms/brand no leaked component rules, NO deprecated CSS, calc chains cycle-free+documented, z-scale clean (D did it). Isomorphism: every E.W3 change pixels-unchanged unless named. Each: file:line · finding · E-disposition (FOLD-E.W3 / LEAVE-clean).
inv-16: write only ${E}/audit/brittleness-findings.md + styling-findings.md.`, { label: 'author:findings-brittle-style', phase: 'Author', agentType: 'general-purpose', schema: WRITE_SCHEMA }),
])
log(`Author: ${authored.filter(Boolean).length}/6 lanes done`)

// ── Phase 3 — Harden (adversarial review → fix) ──────────────────────────────
phase('Harden')
const review = await agent(`${COMMON}

HARDEN — adversarially REVIEW the entire authored E tranche under ${E}/ (E.md, PROGRESS.md, waves/E.W0-W6.md, audit/*.md). Like WF-B hardened D. Read every file. Check, with file:line:
1. COMPLETENESS: every E.W0-W6 wave has §scope + a FALSIFIABLE hard gate (a re-runnable proof:* instrument with a stated BITE, not a narration). Flag any narration-gate.
2. NO-LEGACY / NO-WORKAROUND: no proposed change introduces an alias/shim/deprecated path; net-deletion where claimed.
3. ISOMORPHISM: every styling/refactor change is pixels-unchanged unless a befitting delta is NAMED.
4. CONSISTENCY with live source: spot-check the cited file:line claims (component sizes, the listener sites, .gold-shimmer rent, the arbitrary values) against the actual repo — flag any drifted/wrong cite.
5. MODERN-WEB SOUNDNESS: the E.W4 modern-web items are real + applicable (e.g. don't claim "adopt <dialog>" if reka-ui already provides it — verify); the lighthouse targets are calibrated to the baseline.
6. CLEAN-LEDGER + RECAP: the deferred-ledger's zero-KFE claim is correct (D really terminated all); the prompt-recap has no drops; W5/W6 correctly marked D-pending-on-E1 (not E).
7. THE E-SPECIFIC INVARIANTS (inv κ/λ/μ or whatever the charter named) each carry a real falsifiable gate.
Return a STRUCTURED list of every defect/inconsistency with the exact file + the fix needed.`, { label: 'harden:review', phase: 'Harden', agentType: 'general-purpose', schema: {
  type: 'object', additionalProperties: false, required: ['defects', 'verdict'],
  properties: {
    defects: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['file', 'issue', 'fix'], properties: { file: { type: 'string' }, issue: { type: 'string' }, fix: { type: 'string' } } } },
    verdict: { type: 'string', description: 'overall soundness assessment' },
  },
} })
log(`Harden review: ${(review?.defects || []).length} defects found`)

const fixed = await agent(`${COMMON}

HARDEN — FIX phase. The adversarial review found these defects in the E tranche docs under ${E}/:
${JSON.stringify(review?.defects || [], null, 1)}
Apply EVERY fix directly to the named files (edit the docs under ${E}/ only — docs, not code). Reconcile every cite to live source, make every gate falsifiable, fix any no-legacy/isomorphism/modern-web/ledger issue. Then verify the tranche is internally consistent (the wave gates match the audit findings, the charter's E-invariants match the wave gates). Report what you fixed.
inv-16: write only under ${E}/.`, { label: 'harden:fix', phase: 'Harden', agentType: 'general-purpose', schema: WRITE_SCHEMA })

return { evidence, authored, review, fixed }
