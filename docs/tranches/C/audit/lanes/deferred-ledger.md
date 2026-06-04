I now have comprehensive, evidence-backed findings across every lane item. The `EasingSidebar.vue:76` Slider has a `<label>` element but it's not associated (no `for`/`id` or `aria-label`), and `instrument-serif` confirms the dual-serif residue. Compiling the final report.

# Tranche A+B Deferral Audit — Enumeration of Every Deferred / Chronically-Deferred Item

**Summary:** The deferral ledger is mostly honest, but three "closed" claims are FALSE against the shipped artefacts — the LoAF observer has zero second consumer (the bench is a placeholder stub), the W5 a11y `<main>` landmark is `display:contents` so Lighthouse still fails `landmark-one-main` on every page (and amiga/square/easing/spring score 75-79 with button-name/label/aria-input-field-name all failing), and the entire φ-ladder/dual-serif/cartoon-shadow design half of W5's own scope was silently re-deferred despite W5.md claiming "B.W5 IS the demo-polish home." Several A→B bookings (dev.sh/deploy.sh, scene-swap transition) are now twice-deferred perpetual punts with dead CSS or phantom triggers.

---

## 1. **[HIGH] LoAF observer claims a second consumer it does not have — the chronic was NOT closed, only re-narrated**

**Evidence:** `demo/app/loaf-observer.ts` writes records to `window.__kfLoaf` "so the Playwright >50ms-trace gate and the bench can read it" (loaf-observer.ts:9). But `grep __kfLoaf|observeLongAnimationFrames` across `src/ scripts/ bench/ test/` returns **only `demo/app/main.ts:31`** (the producer). `bench/playwright.bench.ts` is a `describe("...stub")` whose only assertion is `expect(true).toBe(true)` — it never reads `__kfLoaf`, never launches Chromium, never asserts a >50ms threshold. FINAL.md §Overfitting (line 106) claims: *"LoAF observer | the prod-perf measure + the demo bench (co-landed, each the other's consumer — the chronic closed) | ≥2."* This is false: the demo bench is a placeholder, and the "prod-perf measure" is a one-shot manual Lighthouse run with no `__kfLoaf` ingestion.

**Source:** A grand-audit §2.4 SHIPPED-to-A.W4 ("paired with the yield + the A.W4 bench gate" as consumer) → A FINAL named-forward (unshipped, "no wired consumer") → B claims co-landed-and-closed.
**Owner:** keyframes (bench). **Trigger:** A.md/grand-audit said the Playwright >50ms trace gate is the consumer; it was never written.
**Disposition: BOOK (C).** The observer is real and dev-only-DCE'd (correct), but per the overfitting precept it currently has 1 consumer (a `console.debug` line), not 2. **GESTALT fix:** either (a) finish the one consumer that justifies it — convert `bench/playwright.bench.ts` from a stub into a real CDP-driven gate that navigates the prod build, runs a large `AnimationGroup`, and asserts `window.__kfLoaf` shows the group loop breaking >50ms tasks (closing both the LoAF chronic AND the >50ms-trace chronic with one artefact), or (b) if no bench is wanted in C, demote the observer to a documented dev-debug aid and stop asserting "the chronic closed" in the close record.

---

## 2. **[HIGH] The Playwright >50ms-trace gate — chronic across A AND B, still a stub**

**Evidence:** `bench/playwright.bench.ts` is entirely commentary ("Full implementation would: 1. Launch Chromium … 6. Assert FPS thresholds") with `expect(true).toBe(true)`. A.md A.W4 specified this gate; A FINAL §5 named it forward ("the browser-bench trace was not run … unit-verified instead … named-forward to a browser bench run"). B's W3.md §Folds claims it *"Replaces the chronic Playwright `>50ms`/occlusion stub with a real backed gate"* — but that replacement was the **occlusion** gate (`scripts/occlusion-gate.mjs`), NOT the perf/LoAF trace gate. The >50ms-task-breaking behavior of `scheduler.yield()` remains unit-verified only (`test/engine-modern-web.test.ts`), never browser-traced.

**Source:** A.md A.W4 → A named-forward → B's W3.md conflates it with occlusion.
**Owner:** keyframes (bench). **Trigger:** a browser-bench run (same as #1; these two are one artefact).
**Disposition: BOOK (C), fold WITH #1.** **GESTALT fix:** the LoAF observer and the >50ms trace gate are the producer/consumer pair that closes both chronics simultaneously — land them together in one C wave or KILL both with rationale (no consumer pull → demote LoAF to debug aid). Do not let a third tranche inherit "named-forward to a browser bench run."

---

## 3. **[HIGH] a11y `landmark-one-main` fails on EVERY page — the `<main>` wrapper is `display:contents`, so Lighthouse doesn't count it**

**Evidence:** `EditorShell.vue:36` — `<main class="contents" aria-label="Animation editor">`. `class="contents"` = `display:contents`, which removes the element's box; axe/Lighthouse landmark detection requires a rendered landmark region, so it is NOT counted. The W7-close AFTER-prod Lighthouse (`audit/lighthouse/after-prod/_summary.json`, fetchTime 2026-06-04T17:06Z — AFTER the W5 commit at 13:14) shows `landmark-one-main` in `a11yFails` for **all 12 page×form captures**. Yet B.W5 commit (87064ce) asserts *"one `<main>` landmark in EditorShell (class=contents, zero layout impact) closes landmark-one-main on every page"* and FINAL.md §Gate table marks W5 MET with "`<main>`=1." The claim is contradicted by B's own committed evidence.

**Source:** B.W5 S4. **Owner:** keyframes demo. **Trigger:** already triggered (gate was declared MET on false evidence).
**Disposition: SHIP (C, fix immediately).** **GESTALT fix:** drop `class="contents"` from the `<main>` and let it be the actual work-area region wrapper (`display:block`/`grid` consistent with the shell grid), OR move the `<main>` to wrap the real scene-host region in `App.vue` so it generates a box. Then re-run the Lighthouse gate as a *gate* (it currently runs as a manual capture, not a CI assertion — see #4).

---

## 4. **[HIGH] Dock controls + sliders a11y (button-name / label / aria-input-field-name) fails on amiga/square/easing/spring — never closed, marked MET**

**Evidence:** `audit/lighthouse/after-prod/_summary.json` — amiga/square/easing/spring score **75-79** a11y with `button-name`, `label`, `aria-input-field-name`, `image-alt` all failing (square additionally fails `color-contrast`). Source confirms: `EasingSidebar.vue:74-82` has a bare `<label class="instrument-serif…">duration</label>` with no `for`/`id` association to its `<Slider>` (vs `SpringSidebar.vue:18,35` which DO set `aria-label="response"`/`"dampingFraction"`). The bottom-dock `DockIconButton`s use `title=` (AnimationMenuBar.vue:75,84,113) which Lighthouse does not accept as an accessible name → `button-name` fails. W5.md §Hard gate demanded *"lighthouse A11y = 100"*; FINAL.md marks W5 MET. The dock-control/slider a11y was never in W5's executed scope (commit 87064ce touched only TopDock alt + `<main>` + SEO).

**Source:** B.W5 (scoped but unexecuted) / lighthouse AFTER evidence. **Owner:** keyframes demo. **Trigger:** the A11y=100 gate that was declared met.
**Disposition: SHIP (C).** **GESTALT fix:** the icon-only dock buttons and the bare-`<label>` sliders need accessible names systematically, not per-button. Add `aria-label` to `DockIconButton` (or make `title`→`aria-label` the component's default), associate every sidebar `<label>` to its control via `for`/`id` or `aria-label` (EasingSidebar already has the labels — they're just unassociated). This also fixes the WAI footgun where `instrument-serif` labels float free of their inputs.

---

## 5. **[HIGH] φ-ladder migration + dual-serif + CSSCodeEditor cartoon-shadow — W5.md PROMISED to close them as "the demo-polish home," then FINAL re-deferred them**

**Evidence:** W5.md §Folds: *"Retires the demo-polish BOOKs A's grand-audit deferred to a PHANTOM owner (hero φ-ladder, dual-serif, scene-swap VT) — B.W5 IS the demo-polish home that BOOK pointed at but never created."* W5.md §Hard gate: *"zero raw display rungs on the hero; one display serif resolved in the token system (no `.instrument-serif` alias residue); the cartoon-shadow ad-hoc CSS migrated."* **None of this landed:**
- `EditorStartScreen.vue:6` hero still `class="instrument-serif … text-6xl lg:text-8xl"` (raw rungs + alias)
- `style.css:7` still `--font-serif: "Instrument Serif"` — NO `--font-display` formalization
- `.instrument-serif` alias still in **24 files**; φ utilities adopted = **only `text-admin-label`** (zero `text-display-*`/`text-heading`/`text-body`/`text-prose`)
- raw rungs still present: `text-8xl`, `text-6xl`, `text-5xl`×2, `text-3xl`×2, `text-2xl`×4, `text-xl`×7
- `CSSCodeEditor.vue:6` still `border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] dark:shadow-gray-700` — the literal cartoon shadow, NOT `.cartoon-surface`/`--shadow-cartoon-md`

The B.W5 commit body (87064ce) admits this honestly ("the broad φ-ladder typography migration + the dual-serif formalization + the CSSCodeEditor cartoon-shadow token are the residual … deferred to a demo-polish follow-up"). So W5.md's own §Folds/§Hard gate are internally contradicted by the wave's commit — **the wave declared a home for these BOOKs and then deferred them past itself.**

**Source:** A grand-audit §3 → A FINAL §5 BOOK-to-PHANTOM-demo-polish → B.W5 claimed-to-be-the-home → re-deferred. **Owner:** FINAL.md says "keyframes demo," trigger "next demo-touching wave" — but C IS that wave; this cannot punt a third time.
**Disposition: SHIP (C).** This is the textbook P-invariant-28 **TEMPORARY** item that has now been deferred across two tranches with a phantom "next demo-touching wave" owner. **GESTALT fix:** make Instrument Serif the canonical `--font-display` token (one decision in `style.css`), delete the `.instrument-serif` alias in favor of the glass-ui semantic utilities, re-rung the hero (`text-display-hero`/`text-display-mega`) and the heading cluster, and replace the CSSCodeEditor literal with `.cartoon-surface`. This is pure adoption of already-shipped glass-ui tokens — net-deletion, not net-new.

---

## 6. **[HIGH] The scene-swap transition was LOST in W3, leaving 18 lines of DEAD CSS — booked-forward in A, never reinstated, never recorded as a loss**

**Evidence:** `App.vue:407-424` defines `.scene-enter-active` / `.scene-leave-active` / `.scene-enter-from` / `.scene-leave-to` — but there is **no `<Transition name="scene">`** anywhere (`grep 'name="scene"'` → 0 hits). The `<Suspense>` at App.vue:118 is deliberately NOT wrapped in a `<Transition>` (App.vue:106-117 explains it broke async scene loading). So the CSS is orphaned: Vue only emits `scene-enter-active` etc. classes when a `<Transition name="scene">` wraps the toggled element. A FINAL §5 BOOKED "scene-swap VT → BOOK to a demo-polish home (glass-ui-owned rungs/VT, pure adoption)"; W5.md §Folds claimed to retire that BOOK; B never reinstated any transition and left the dead CSS. W3.md is entirely silent on the transition LOSS (it only documents removing `<Transition>` for the async-load reason).

**Source:** A grand-audit §3 (scene-swap bespoke cross-fade `App.vue:113,406-423`, BOOK→glass-ui `startViewTransition`) → A FINAL BOOK → B.W3 removed the `<Transition>` → B.W5 claimed-retired-but-didn't.
**Owner:** keyframes demo. **Trigger:** demo-polish (same phantom as #5).
**Disposition: SHIP (C) — at minimum KILL the dead CSS; ideally reinstate via VT.** **GESTALT fix:** the keyed `<Suspense>` cannot take a Vue `<Transition>` without breaking the async loader, so the idiomatic transposition is the **native View Transitions API** (`document.startViewTransition`) driven from the router/scene-key watcher — exactly the glass-ui `startViewTransition` adoption A booked. That gives a scene cross-fade with zero coupling to the Suspense boundary. If C declines the VT, **delete App.vue:407-424** — dead CSS contradicts the no-legacy mandate.

---

## 7. **[MEDIUM] `scripts/dev.sh` / `deploy.sh` library-shape adoption — twice-booked (A.W0 → B.W6), never landed, conditional trigger that never fired**

**Evidence:** A constellation-adoption §1 BOOKED a `scripts/dev.sh` DRAFT + library-shaped `deploy.sh`. B.md:86 re-BOOKED it to **B.W6**. W6.md:307-311 then punted with: *"If B lands a `scripts/deploy.sh`, its `do_build` routes through `build:lib` … recorded here only so the gate wave does not silently inherit the deploy obligation."* `find . -name dev.sh -o -name deploy.sh` → **neither exists**; the only deploy path is `package.json:40` `"gh-pages": "vite build --mode gh-pages"` (a dev-machine action). This is a TEMPORARY item deferred across two full tranches with a self-cancelling "if B lands it" trigger.

**Source:** A constellation-adoption §1 → B.md:86 (B.W6) → W6.md conditional punt.
**Owner:** nominally keyframes infra, but no firm wave. **PHANTOM trigger** — "if B lands it" is not a trigger.
**Disposition: BOOK (C) with a real decision, or KILL.** **GESTALT fix:** decide explicitly — either land the library-shaped `scripts/dev.sh`/`deploy.sh` in C (the constellation-standard shape, `do_build`→`build:lib`), or KILL it with rationale ("the demo gh-pages deploy is a dev-machine `npm run gh-pages`; no shared dev.sh substrate is pulled by any consumer"). Do not carry a conditional "if" into a third tranche.

---

## 8. **[MEDIUM] Outward glass-ui asks (ASK-1 dock double-click, ASK-2 VAL-9 spring-token regen) — correctly owned outward but with PASSIVE triggers and no cross-repo forcing function**

**Evidence:** `asks/glass-ui-adoption-asks.md` — ASK-1 (dock double-click, `useTouchGate`/`GlassDock`) trigger = *"glass-ui's next dock/motion wave"*; ASK-2 (VAL-9 `--spring-*` regen from `springLinearStops`) trigger = *"glass-ui's next spring-token edit."* The keyframes-side enablers are LANDED (ASK-1 needs nothing; ASK-2's `springLinearStops` is a stable value.js-free public export, proof:boundary-verified). These are genuinely glass-ui-owned per inv-16 (memory: all glass-ui/dock changes go in glass-ui). But both triggers are *passive waits on glass-ui to act on its own*, with no issue filed in glass-ui, no tracking link — so they are owned-outward-but-unforced.

**Source:** A grand-audit §4.2 (VAL-9) + project memory (dock double-click) → A FINAL BOOK → B.W5 asks file.
**Owner:** glass-ui (correct). **Trigger:** passive (glass-ui's next dock/spring edit).
**Disposition: BOOK (C) — verify the ask is actually filed cross-repo, not just authored in keyframes' own docs.** **GESTALT fix:** C should confirm a real glass-ui-side issue/PR exists for ASK-1 and ASK-2 (the asks file says "the fix lands in glass-ui on its own clean checkout" but is itself committed only in keyframes). Without a cross-repo artefact these are phantom-adjacent — owned outward in prose but invisible to glass-ui's backlog. Not keyframes-blocking, but record the cross-repo link or they perpetually wait.

---

## 9. **[LOW] ScrollTimeline-native — KILL is CORRECT and well-reasoned; record as permanent**

**Evidence:** `timeline.ts:174-189` — `ScrollTimeline extends Timeline` with `getScrollY = options?.getScrollY ?? (() => window.scrollY)` and `sample()` computing `getScrollY() / maxScroll`. This is a **caller-polled sampling pipeline** (`sample()→clamp→easing→…→progress`), structurally incompatible with the native `ScrollTimeline` which drives an animation off-thread. FINAL.md:122-127 KILLs it with sound rationale: the native API doesn't fit the contract, no consumer asks for off-thread scroll binding, re-open only if one appears.

**Source:** A grand-audit §3 (`timeline.ts:196` BOOK) → B FINAL KILL.
**Owner:** keyframes (none needed). **Trigger:** re-open only if a progress-linked consumer needs native `animation-timeline`.
**Disposition: KILL → RECORD permanent (P-invariant-28 PERMANENT).** No fix needed. C should carry this as a **permanent-KILL**, not re-litigate it. The disposition is correct.

---

## 10. **[LOW] Worker / OffscreenCanvas / Atomics engine path — PERMANENT-ARCHIVE, correctly disposed**

**Evidence:** `grep Worker|OffscreenCanvas|Atomics src/animation/` → only hit is `scheduler.ts:34` `channel.port2.postMessage(undefined)` (the `MessageChannel` yield fallback — NOT a Worker). No Worker/OffscreenCanvas substrate exists or is referenced. FINAL.md:128 marks it PERMANENT-ARCHIVE (no consumer), unchanged from A.

**Source:** A.md §Folded-ledger → A FINAL named-forward/KILL → B FINAL PERMANENT-ARCHIVE.
**Owner:** none (no consumer). **Trigger:** none.
**Disposition: KILL → RECORD permanent (P-invariant-28 PERMANENT).** Correct. C carries as permanent-archive; do not re-surface as a deferral.

---

## 11. **[LOW] EasingTarget unscoped global `.glass-card` override — real CSS-leak footgun, never caught by either tranche**

**Evidence:** `EasingTarget.vue:267` — `<style>` (NOT `<style scoped>`) defines `.glass-card { --track-ball-size-active: 36px; --track-ball-size-muted: 24px; }`. Because the block is unscoped, these custom properties leak onto **every `.glass-card` in the document** (and there are ~10 `.glass-card` consumers — AnimationControlsGroup, AnimationControlsControls, KeyframesEditor, KeyframeTimeline, AssetViewport, SpringTarget, the sidebars). The override is cheap/inert today (only EasingTarget reads `--track-ball-size-*` via getComputedStyle), but it's an unscoped global mutation of a glass-ui primitive's token surface — a latent collision. Not in any A/B audit ledger.

**Source:** not previously enumerated (new finding in-lane). **Owner:** keyframes demo. **Trigger:** any glass-ui `.glass-card` token that collides with `--track-ball-size-*`.
**Disposition: SHIP (C) — trivial.** **GESTALT fix:** scope it. Either `<style scoped>` on EasingTarget, or move the two track-ball tokens to the component's own root class (e.g. the `.track-row`/`.track-container` already-local selectors) rather than overriding the shared `.glass-card`. The values are read via `getComputedStyle(container.closest(".glass-card"))` at EasingTarget.vue:142 — point that at a local class instead so CSS stays the single source of truth without globally mutating glass-ui's primitive.

---

## Cross-cutting notes for the C architect

- **The honest deferrals (P-invariant-28 TEMPORARY, properly owned):** #5 (φ-ladder/serif/cartoon — SHIP in C, cannot punt a 3rd time), #6 (scene-swap VT/dead CSS — SHIP or KILL the CSS), #7 (dev.sh — decide/KILL), #8 (verify cross-repo asks filed).
- **The PERMANENT items (correctly disposed, RECORD only):** #9 ScrollTimeline-native, #10 Worker/OffscreenCanvas.
- **The FALSE-CLOSED items (the dangerous ones — close records assert MET against contradicting evidence):** #1 LoAF "chronic closed," #3 `landmark-one-main` "closed," #4 A11y=100 gate, #5 "B.W5 IS the demo-polish home." These four are where the FINAL/wave prose drifted from the shipped artefact — C should treat the gate tables as *asserted, not verified* for W5's design+a11y half and re-gate them.
- **PHANTOM owners flagged:** #5/#6 "next demo-touching wave" (C is that wave — no further forward exists), #7 "if B lands a deploy.sh" (self-cancelling), #8 asks authored in keyframes but no glass-ui-side artefact confirmed.
- **No NEW perpetual punts should be created.** Every TEMPORARY item above has exhausted its forward-references; C is the terminal home or each must be explicitly KILLed with rationale.

Relevant files: `/Users/mkbabb/Programming/keyframes.js/demo/app/loaf-observer.ts`, `/Users/mkbabb/Programming/keyframes.js/bench/playwright.bench.ts`, `/Users/mkbabb/Programming/keyframes.js/demo/@/components/custom/editor-shell/EditorShell.vue` (line 36), `/Users/mkbabb/Programming/keyframes.js/demo/@/components/custom/editor-shell/EditorStartScreen.vue` (line 6), `/Users/mkbabb/Programming/keyframes.js/demo/@/components/custom/animation-controls/keyframes/CSSCodeEditor.vue` (line 6), `/Users/mkbabb/Programming/keyframes.js/demo/app/App.vue` (lines 407-424), `/Users/mkbabb/Programming/keyframes.js/demo/easing/EasingTarget.vue` (line 267), `/Users/mkbabb/Programming/keyframes.js/demo/easing/EasingSidebar.vue` (line 76), `/Users/mkbabb/Programming/keyframes.js/docs/tranches/B/audit/lighthouse/after-prod/_summary.json`, `/Users/mkbabb/Programming/keyframes.js/docs/tranches/B/asks/glass-ui-adoption-asks.md`, `/Users/mkbabb/Programming/keyframes.js/src/animation/timeline.ts` (lines 174-189).