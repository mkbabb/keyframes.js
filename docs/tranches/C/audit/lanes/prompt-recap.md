All verified. 309/309 tests green, precept edict (8ccf9f4) is now pushed to origin/main (the B PROGRESS "push pending" is resolved), the changeset is cut at minor (3.1.0) but the package.json is still 3.0.0 (publish leg pending — user-domain, as designed). The ASK-1 always-expanded mask is still in place (correct — gated on glass-ui fix). I have everything needed. Let me write the report.

# Tranche C re-audit & path-forward — keyframes.js @ master c66e6f3 (post-B)

**Summary:** B landed genuinely and deeply — 309/309 tests green, 0 in-source TODOs, light-barrel value.js-free, the prod build paints, the four blank scenes render, the loading splash is gone, CI gates the demo (inv γ/δ), and the precept before/after edict is now *pushed* to origin/main (8ccf9f4) — so B's "push pending" residue is closed. C is not a repair tranche: every P1+P2 deliverable is ADDRESSED, and the residual is a small, named, correctly-deferred demo-polish set (φ-ladder typography fork, dead scene-swap CSS, one global-scope leak, a few off-token sites) plus a thin engine-elegance opportunity (the demo's hand-rolled rAF loops could dogfood B.W2's own `RAFPlayback`/`Tickable` driver). The single biggest drop-risk is the **typography φ-ladder migration**, deferred through A→B and now C's headline design item. The publish leg (3.1.0) remains correctly user-domain-pending.

---

## PART 1 — Prompt recap (P1, P2, P3) with per-request disposition

### P1 (tranche A) — all ADDRESSED, B-verified, no C obligation
1. **[info] Execute A in full** — ADDRESSED. A's W0–W5 landed (d84faf5); `docs/tranches/A/PROGRESS.md` all-waves-landed. Foundation B built on. No re-litigation.
2. **[info] Publish 3.0.0 first** — ADDRESSED. `package.json:version=3.0.0`, `v3.0.0` tag, SLSA provenance attestation present, `npm view` → 3.0.0.
3. **[info] Exported `RAFPlayback` PRM gate** — ADDRESSED. `src/animation/index.ts` exports `RAFPlayback`; B.W2 generalized it to the shared `Tickable` driver. Cross-repo follow (glass-ui adopts the exported gate) is RECORDED outward.
4. **[info] Changesets + `--provenance`** — ADDRESSED. `release.yml` `npm publish --provenance --access public` + `id-token:write`; the standing publish path.
5. **[info] Gate on green CI** — ADDRESSED. `ci.yml` library gate chain; B *extended* it (demo-smoke + occlusion jobs) per the "perfected CI" directive rather than rebuilding.

### P2 (the big tranche-B request) — every discrete request, disposition + cite
6. **[info] Update all deps to latest** — ADDRESSED (B.W1, 6487c7f). Library deps confirmed already-latest; demo/tooling majors (zod 3→4, vue-sonner 1→2, @iconify 4→5, jsdom 26→29, vite-plugin-dts 4→5, @types/node 24→25) landed behind the regression gate. `audit/dep-upgrade-matrix.txt`.
7. **[info] 6-agent deep audit of plan + changes** — ADDRESSED. `audit/plan-findings.txt` (46 findings, 11 high). All folded into B's waves.
8. **[info] Path forward / gestalt / no-workaround / no-legacy / architectural transpositions** — ADDRESSED (B.md + `audit/architecture-gestalt.md` + B.W2). Net-deletion verified: −3 modules, −16 TODOs, 7 reduced-motion snap bodies → 1 `withReducedMotion` gate, 3 rAF loops → 1 `RAFPlayback`. `grep TODO src/ = 0` (re-verified at C-open).
9. **[info] Fold chronically-deferred + deferred** — ADDRESSED (B.md §fold; FINAL §Deferrals). LoAF observer SHIPPED, Playwright >50ms-trace gate replaced by the real occlusion+π harness, ScrollTimeline-native KILLed-with-rationale, Worker/Offscreen PERMANENT-ARCHIVE, VAL-9 + dock filed outward.
10. **[info] Recap ALL prompts** — ADDRESSED (B.md §Prompt recap, P1+P2). This C report extends it to P3.
11. **[info] NOT an implementation phase (B was dev-only authoring)** — ADDRESSED-then-superseded. B.W0 was authored dev-only; the user subsequently authorized W1–W7 (the impl commits 6487c7f..c66e6f3 are real). PROGRESS records IMPLEMENTATION COMPLETE. The "dev-only" constraint applied to the *authoring* turn and was honored.
12. **[info] Full lighthouse + best-practices of every page + every library facet** — ADDRESSED (B.W4/W7). `audit/lighthouse/after-prod/` holds 14 reports (7 pages × {desktop,mobile}) against the *repaired* prod build (dev-mode 4–24s figures correctly disclaimed non-authoritative). Perf 89–96, A11y closed, BP 100, SEO closed.
13. **[info] Pull precepts + sync + before/after edict** — ADDRESSED + now fully closed. Edict committed at precepts 8ccf9f4; re-verified at C-open: **8ccf9f4 IS on origin/main** (push complete — B's "push pending" residue is resolved). Gitlink in keyframes points at 8ccf9f4.
14. **[info] Remove loading screen + improve loading** — ADDRESSED (B.W4). `index.html` splash removed (criticalCSSPlugin inlines themed background instead); `main.ts` extracted (fixes the rolldown tree-shake blank-build); monaco/three lazy; smoke gate inv γ.
15. **[info] 6 frontend-design agents audit design + glass-ui** — ADDRESSED (B.W0/W5). `audit/design-findings.txt` (43 findings, 4 blocker). Blockers fixed in B.W3/W4/W5; off-token residue deferred (see Part 3).
16. **[info] Create next tranche with perfected CI** — ADDRESSED (this is tranche B; CI in B.W6). Library gate (node 24, glass-ui-free, /tmp clean-runner) + demo-smoke (inv γ paints + inv δ occlusion) jobs in `ci.yml`; actions on v5.
17. **[info] Audit every page desktop+mobile, NO occlusion, dock perfected, fully Playwright** — ADDRESSED (B.W3, inv δ). `scripts/occlusion-gate.mjs` asserts per page × {375,1280,1440}: zero overflow + subject present + in-bounds + centered. 18 before + 18 after captures on disk. Dock mobile safe-area fixed; double-tap routed outward (ASK-1).

### P3 (this re-audit request) — disposition
18. **Re-audit with 6 agents** — ADDRESSED (this report synthesizes 6 lanes: engine-fidelity, typography, layout-rhythm, motion-dogfood, a11y-responsive, component-idiom — cross-checked against `C/audit/grounding.txt` + `C/audit/design-findings.txt`).
19. **Devise the path forward** — ADDRESSED (Part 4).
20. **Recap (all prompts)** — ADDRESSED (this Part 1).
21. **NOT an implementation phase** — HONORED. This is an audit; no source written. Findings returned for the C architect.
22. **Fold deferred** — ADDRESSED (Part 3 carries every B deferral forward with owner+trigger).
23. **6-agent demo design inventory** — ADDRESSED (`C/audit/design-findings.txt` exists with the component-idiom lens complete; Part 3 below completes the synthesis across all 6 lenses).

**No P1/P2/P3 request is DROPPED.** Highest drop-risks surfaced in Part 5.

---

## PART 2 — Engine/CI fidelity findings (verified against live code)

1. **[info] B's net-deletion + boundary claims are REAL, re-verified** — `grep TODO/FIXME src/` (excl. tests) = **0**; no static `@mkbabb/value.js` import in any light barrel (smooth/numeric/morph/timeline/spring/playback); 309/309 tests green in 2.3s; `scripts/{proof-boundary,demo-smoke,occlusion-gate}.mjs` all present; `internal/` collapsed to 5 modules (binarySearch, errors, leaves, reduced-motion, scheduler) — the A-era `easing-resolvable.ts`/`css-easing.ts`/`renderer.ts` are gone (no alias). — **SHIP** (no action; this is C's regression bar) — GESTALT: keep `proof:boundary` green on every C light-module edit; it self-enumerates barrel exports so a new light export is proven automatically.

2. **[low] `proof:boundary` proves *bundled-bytes* absence, not *source-specifier* absence (reachability caveat)** — `scripts/proof-boundary.mjs` greps source for dormant static specifiers AND asserts bundled bytes, but a dead `void _probe` import is tree-shaken and would pass the bytes check. The script header documents this; the source-grep half mitigates it. — **RECORD** (named in B `plan-findings.txt:82`, mitigation landed) — GESTALT: the source-specifier grep already closes the dead-import-armed-regression class; no further action unless a light module legitimately needs a value.js *type-only* import (which `export type` correctly skips).

3. **[low] The demo's hand-rolled rAF loops do not yet ride B.W2's `RAFPlayback`/`Tickable` driver** — 7 demo source files hand-roll `requestAnimationFrame` (`useEasingDemo.ts` ×4, `useSpringDemo.ts` ×2, `useRafLoop.ts` ×3, `AnimationVisualizer.vue` ×2, `useTimeline.ts`, `useTransformState.ts`, `AmigaScene.vue`). NOTE: this corrects `C/audit/grounding.txt:23-28` which claimed "only 1 demo file uses the light engines" — in fact `useSpringDemo.ts` deeply dogfoods `SpringProgress`+`NumericAnimation`+`springTimingFunction` and `useEasingDemo.ts` drives `CSSKeyframesAnimation`+`AnimationGroup` (grounding undercounted by excluding these). The real, narrower opportunity: the *loops* that tick those engines are hand-rolled where the engine ships a `RAFPlayback` driver designed to own exactly this. — **BOOK** (C demo-dogfood wave) — GESTALT: transpose `useRafLoop.ts` and the spring/easing shared-loop onto `RAFPlayback` over a `Tickable`; this makes the demo the ≥2nd consumer the driver's overfitting-precept wants AND showcases the engine driving itself. Do NOT rewrite working loops wholesale — only the ones that are literal re-implementations of `RAFPlayback`.

4. **[info] Publish leg correctly pending** — changeset `tranche-b-3-1-0.md` cut at **minor** (→3.1.0) but `package.json` still 3.0.0; the version-bump→tag→`release.yml` publish is user-domain confirm-first (the same path A established). — **RECORD** (not a defect; intended) — GESTALT for C: name the version owner in C's close so the 3.1.0 publish leg is not orphaned across another tranche.

---

## PART 3 — Demo design inventory (6-lens synthesis, carrying B's named deferrals forward)

5. **[medium] φ-ladder typography fork is the headline residual — demo bypasses glass-ui's type scale wholesale** — `demo/@/styles/style.css` sets `--font-serif: "Instrument Serif"`, `.instrument-serif` alias used 23 files; **glass-ui semantic rung usage (`.text-display*`/`.text-heading*`/`.text-body`) = 0**; raw Tailwind rungs instead: text-xs ×66, text-sm ×30, text-base ×18, text-lg ×10, text-xl ×7, text-2xl ×4, text-3xl ×2, text-5xl ×2, text-6xl ×1, text-8xl ×1. This is 4 HIGH design-audit findings (`B/audit/design-findings.txt:27-50`), explicitly DEFERRED by B (FINAL §Deferrals, owner=keyframes demo, trigger=next demo-touching wave). The Fraunces/Instrument-Serif dual-serif split appears resolved (no Fraunces refs remain). — **RECORD→C headline** (named B deferral, not a regression) — GESTALT fix: decide brand intent explicitly — if Instrument Serif is the deliberate display face, override glass-ui's `--font-display` token rather than aliasing `.instrument-serif` onto raw rungs, then migrate body/label/heading sites to the semantic `.text-*` ladder so the demo rides glass-ui's golden-ratio scale instead of forking it.

6. **[medium] Dead scene-swap CSS orphaned in App.vue — no-legacy violation** — `demo/app/App.vue:407-424` still defines `.scene-enter-active`/`.scene-leave-active`/`.scene-enter-from`/`.scene-leave-to`, but B.W3 removed the wrapping `<Transition>` (it broke async `<Suspense>` scene loading — root-caused in DELTA.md). Verified: these classes are referenced nowhere in demo source. Scenes now HARD-CUT and the swap CSS is dead. — **SHIP** (delete the dead block) — GESTALT fix: either (a) delete the 4 orphaned rules outright (no-legacy), or (b) if a scene transition is wanted, drive it through glass-ui's `startViewTransition` (View Transitions API) which does NOT re-break the async `<Suspense>` loader the wrapping `<Transition>` broke. (b) is the gestalt restoration; (a) is the minimum no-legacy close.

7. **[medium] `.glass-card` override in EasingTarget is global-scope — leaks `--track-ball-size-*` onto every glass-card app-wide** — `demo/easing/EasingTarget.vue:263` opens unscoped `<style>` (not `<style scoped>`); line 267 declares `.glass-card { --track-ball-size-active: 36px; --track-ball-size-muted: 24px; }`. Injects custom props onto every `.glass-card` (8+ call sites). Harmless today (no other surface reads them) but a latent global-namespace collision + anti-idiom (mutating a vendor utility from a component file). — **BOOK** (C demo-polish wave) — GESTALT fix: scope the tokens to the easing track, not the shared primitive — add `scoped` + target a component-local class (`.easing-track-host`), or define the track tokens on the EasingTarget root element directly. The tokens belong to the easing track, not the glass-card primitive.

8. **[low] CSSCodeEditor hand-rolls a cartoon shadow instead of glass-ui's `.cartoon-surface`/`--shadow-cartoon-*`** — `demo/@/components/custom/animation-controls/keyframes/CSSCodeEditor.vue:6` uses `border-2 border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] dark:shadow-gray-700` — the only `border-gray-*`/arbitrary-shadow hand-roll left in demo source. glass-ui ships exactly this recipe as `.cartoon-surface` backed by `--shadow-cartoon-*`. Named in A design-findings, DEFERRED by B (FINAL: "the CSSCodeEditor cartoon-shadow token"). — **RECORD** (named B deferral) — GESTALT fix: replace arbitrary classes with `.cartoon-surface` (or `box-shadow: var(--shadow-cartoon-md)` + `border-color: var(--glass-border-resting)`), dropping the `dark:shadow-gray-700` fork — the token carries its own dark value.

9. **[low] SquareScene halo uses literal `rgba(255,255,255,0.5)` instead of a dark-mode-aware token** — `demo/app/scenes/SquareScene.vue:52`: `box-shadow: 0 0 0 0.5rem rgba(255,255,255,0.5)`. The sibling `.demo-box` utility (`demo/@/styles/utils.css`) already solves this with `color-mix(in srgb, var(--background) 50%, transparent)` (dark-aware); the literal white stays white-on-dark. Named in design-findings, DEFERRED by B. — **RECORD** (named B deferral) — GESTALT fix: replace with the `color-mix` expression or, better, reuse the shared `.demo-box` class so the halo derives from one token source.

10. **[low] One redundant hand-rolled blur double-stacks on glass-ui's Dialog glass tier** — `demo/@/components/custom/KeyboardShortcutsModal.vue:3` sets `<DialogContent class="max-w-md backdrop-blur-sm">`; glass-ui's `DialogContent` already composes `.glass-floating` (own blur/shadow) + a `<ModalOverlay scrim="glass">`. The `backdrop-blur-sm` is the *only* hand-rolled glassmorphism in the entire demo (single grep hit) — it re-blurs a surface glass-ui already glasses. — **SHIP** (delete the class) — GESTALT fix: remove `backdrop-blur-sm`; let `DialogContent`'s default `glass-floating` own the blur; if a tighter blur is the intent, pass it through the component `variant` prop, not an ad-hoc utility.

11. **[info] inv-16 outward routing is correct — no glass-ui defect patched in the demo** — Dock double-tap (ASK-1) + VAL-9 `--spring-*` drift (ASK-2) filed in `B/asks/glass-ui-adoption-asks.md`, not patched. Re-verified: the `:always-expanded="isMobile"` mask is STILL present (`TopDock.vue:117`, `AnimationMenuBar.vue:17`) — correct posture (honestly documented as temporary until glass-ui ships the touch-gate fix). The ASK-2 enabler (stable `springLinearStops()` export, proven value.js-free) is landed. — **SHIP** (no action; confirms discipline) — GESTALT for C: the `always-expanded` mask is the ONLY outstanding demo-side residue; remove it once glass-ui's touch-gate fix lands (gated on ASK-1, never patch in demo per project memory).

12. **[low] a11y residual — DockIconButtons without title/aria-label** — `C/audit/grounding.txt:30-31` reports 11 DockIconButtons lacking title/aria-label (the lighthouse button-name finding); some demo-owned, some glass-ui-owned. — **BOOK** (split: demo-owned labels SHIP in C; glass-ui-owned route outward per inv-16) — GESTALT fix: add `aria-label`/`title` to the demo-owned dock buttons; for glass-ui-owned ones, file an adoption ask rather than patching.

13. **[info] Untracked 13MB of demo build output on disk (`demo/app/dist` 6.9M + `demo/playground/dist` 6.4M)** — These are git-ignored (`.gitignore:10` `dist/`) so they won't be committed, but they exist on disk and contain stale `requestAnimationFrame`/light-engine bundles that polluted naive greps (and the C grounding's miscount). — **RECORD** (not shipped; hygiene only) — GESTALT: a `npm run clean` target or a pre-audit `git clean -dn` keeps future audits from grepping stale dist; no source change needed.

---

## PART 4 — Path forward for tranche C (proposed wave shape, NOT executed)

- **C.W-design (headline):** φ-ladder typography migration + Instrument-Serif `--font-display` formalization (finding 5) — the chronically-deferred A→B item; C is its home.
- **C.W-demo-polish:** delete dead scene-swap CSS or restore via `startViewTransition` (6); scope the EasingTarget `.glass-card` leak (7); CSSCodeEditor `.cartoon-surface` (8); SquareScene `color-mix` halo (9); KeyboardShortcutsModal blur (10); demo-owned dock a11y labels (12).
- **C.W-dogfood (engine-elegance):** transpose the demo's hand-rolled rAF loops onto `RAFPlayback`/`Tickable` (3) — the ≥2nd-consumer overfitting close + a self-driving showcase.
- **Outward (inv-16, not C-closable):** ASK-1 dock touch-gate fix + ASK-2 VAL-9 token codegen land in glass-ui; remove the `always-expanded` mask once ASK-1 lands (11).
- **Close:** name the 3.1.0 (or next) version owner so the publish leg is not orphaned (4); run the before/after π capture per the now-pushed edict.

---

## PART 5 — Highest drop-risks (for the C architect's attention)

1. **Typography φ-ladder migration (finding 5)** — deferred A→B→now-C; it is the single largest design-idiom gap and the most likely to slip a *third* cycle. It has a real owner (keyframes demo) and trigger (next demo-touching wave) — C *is* that wave. If C does not absorb it, the deferral becomes a perpetual punt (P-invariant-28 violation).
2. **Dead scene-swap CSS (finding 6)** — a live no-legacy violation sitting in shipped source right now; cheap to close, easy to overlook because it's inert.
3. **The `always-expanded` mask (finding 11)** — cannot be closed by keyframes alone (gated on glass-ui ASK-1). Risk is that the cross-repo handoff stalls and the mobile dock stays permanently always-expanded; the C architect should confirm ASK-1's status in glass-ui before assuming the mask is removable.
4. **Publish leg (finding 4)** — 3.1.0 changeset is cut but unpublished; user-domain by design, but an unnamed version owner across tranches orphans the release.