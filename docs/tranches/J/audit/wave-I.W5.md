# J Audit — Tranche I Wave W5 (bea5f27)
## Lane: wave-I.W5 | Date: 2026-06-09

> Scope: icon single-source + one build root + honest 404 + title + DC-8 (B9/K)
> Commit: `bea5f27`; WZ amendment: `11c4c25` (trusted-click actuation fix)

---

## Delivery verdict

**Core delivery: COMPLETE for S1–S6 (the authoritative wave spec `waves/I.W5.md`).** The
spec defined six scope items; all six landed in `bea5f27` or have their correctness assertions
correctly delegated. The gate `proof:icon-paint-live` (692 lines, `11c4c25`-amended) is wired
into `proof:correctness` and CI runs it under `KF_REQUIRE_BROWSER=1`.

One **scope-tracking mismatch** between `PROGRESS.md`/`I.md` and the authoritative wave spec:
`PROGRESS.md:71` and `I.md:338` list "M1 `sheet.bottom ≤ menubar.top` from MEASURED menubar
height" as W5 scope; `waves/I.W5.md` has NO M1 item (the wave spec was never updated to include
it). W5 commit touches only 5 files; no mobile layout code changed. M1's functional equivalent
(CSS `--dock-band-reserve` + pointer-event check in `proof:dock-zorder`) pre-dates W5 or landed
in W6. The `FINAL.md` correctly re-labels M1 as "folds into felt-interaction gates." The delta
is a tracking inconsistency, not a product defect.

---

## Scope coverage (S1–S6)

| Item | Spec | Delivered | Evidence |
|------|------|-----------|----------|
| **S1** ONE build root | `vite.config.ts` default outDir landmine closed | `DEMO_DEFAULT_OUTDIR = ./dist/demo-app/`; default dev branch declares `build.outDir: DEMO_DEFAULT_OUTDIR, emptyOutDir: true` | `vite.config.ts:219,507–508` |
| **S2** honest 404 | `assetExtension404Plugin()` declines to rewrite `*.svg`/`*.png`/`*.map` misses to index.html | `kf-asset-extension-404` plugin registered in dev plugins array | `vite.config.ts:247–278,522` |
| **S3** runtime paint gate | `proof:icon-paint-live` replaces source-shape `proof:scene-icons` | 692-line gate; 5 clauses (a)/(b)/(c)/(d)/(e); wired to `proof:correctness`; `proof:scene-icons` deleted in W7 (`1a708cf`) | `scripts/proof-icon-paint-live.mjs`; `package.json:83,147` |
| **S4** title single-source | `demo/app/index.html` `<title>keyframes.js</title>` | Exactly `<title>keyframes.js</title>` in source; no build-time rewrite | `demo/app/index.html:14` |
| **S5** DC-8 RESTORE+gate | Live `startViewTransition` consumer → RESTORE; zero orphan demo-side VT CSS | `useSceneTransition.ts:32` calls `startViewTransition`; `App.vue:311` `.scene-host { view-transition-name: scene-subject }`; `::view-transition-*` CSS is glass-ui-owned; grep finds 0 orphan demo-side VT rules | `demo/app/useSceneTransition.ts:2,32`; `demo/app/App.vue:311` |
| **S6** source-map noise accepted+documented | Accept dev-only noise; assert only built product | Comment at `vite.config.ts:360–372`; `sourcemap: false` on gh-pages build | `vite.config.ts:360–372` |
| **M1** mobile sheet anchor | Listed in `PROGRESS.md` / `I.md` as W5 scope; **NOT in `waves/I.W5.md`** | No mobile layout changes in W5 commit; CSS `--dock-band-reserve` pre-dates or lands in W6; `proof:dock-zorder` checks pointer-event non-steal | Tracking mismatch, not product gap — see finding W5-3 |

---

## Gate oracle audit (proof:icon-paint-live)

**Gate-ORACLE precept assessment:** clauses (a)/(b)/(c)/(e) pass the precept — they drive
the running product through human surfaces (dock hover → expand → click Scene Select), assert
product-facing properties (painted `<svg>` bounding box, zero 404s, `document.title`, VT
fires), and are wired to CI under `KF_REQUIRE_BROWSER=1`.

| Clause | Tier | Oracle | Actuates | Verdict |
|--------|------|--------|----------|---------|
| (a) icon-paint | RUNTIME correctness | `svg.getBoundingClientRect()` non-zero + `display !== none` per scene | hover dock → expand → probe `[aria-label="Scene"]`; open Select; probe all `[role="option"]` | SOUND |
| (b) zero-asset-404 | RUNTIME correctness | `server404Paths` set empty + `sourcemapNon200 === 0` | 7 scene loads + Select open + CSS editor mount | SOUND |
| (c) document.title | RUNTIME correctness | `page.title() === "keyframes.js"` on built dist | page load | SOUND |
| (d) single-build-root | HYGIENE | regex on `vite.config.ts` source | source-shape (config text) | CORRECTLY LABELED HYGIENE |
| (e-grep) DC-8 zero-orphan | HYGIENE | `::view-transition*{` regex on demo source (comment-blanked) | source-shape | CORRECTLY LABELED HYGIENE |
| (e-runtime) DC-8 VT fires | RUNTIME correctness | `window.__kfVT.calls > 0` after dock-Select switch | `page.getByRole("option").click()` (trusted, post-`11c4c25`) | SOUND; see note below |

**WZ amendment (`11c4c25`) is substantive and correct.** Original `bea5f27` used an in-page
`opt.click()` (synthetic, ignored by reka-ui's pointer-event listeners); `11c4c25` replaces it
with `page.getByRole("option").click()` (trusted Playwright click). The defect was the gate's
actuation, not the product. The amendment correctly diagnoses and fixes this at the right seam.

**One oracle gap (P2):** clause (e) VT runtime half uses `note()` (not `fail()`) when
`document.startViewTransition` is absent from the test Chromium (`scripts/proof-icon-paint-live.mjs:623–624`). If CI's Playwright Chromium ever lacks VT API support, clause (e) passes vacuously — the product's live VT path is real (`useSceneTransition.ts:32`), but the runtime assertion evaporates. Modern Playwright Chromium (>=105) includes VT; this is low-probability but worth recording for J.

---

## Workaround / quick-solution residue audit

### S2 Accept-header mutator (P2)

`assetExtension404Plugin` intercepts asset-extension misses by mutating
`req.headers.accept = "application/octet-stream"` to defeat Vite's `htmlFallbackMiddleware`,
which only rewrites requests whose `Accept` contains `text/html` or `*/*`
(`vite.config.ts:257–266`). This is **not a direct 404 response** — it relies on Vite 8's
internal `htmlFallbackMiddleware` accepting the mutated header. If Vite changes its
`Accept`-checking logic, the plugin silently regresses (orphaned assets are once again masked
as 200-HTML) with no gate alarm on the dev-server side. A more idiomatic implementation would
directly emit `res.writeHead(404).end()` after checking whether the file path misses on the
served root + publicDir. The current approach is documented and works with Vite `^8.0.16`
(pinned), but the coupling is fragile at Vite upgrade boundaries. Gate clause (b) only asserts
the BUILT dist (not the dev server), so S2's dev-server behavior has no runtime gate.

Disposition: **P2 / J candidate.** Replace the Accept mutation with a direct `res.writeHead(404).end()` check when the resolved file path misses. Not a current regression (Vite is pinned `^8.0.16`); becomes a risk on a Vite 9 bump.

### Magic timeouts in gate (BOOK)

`proof:icon-paint-live` uses `page.waitForTimeout()` at lines 338 (900ms), 398 (250ms), 476
(500ms), 560 (400ms), 600 (700ms). This is the same settle-sleep pattern used across all I
gates (pattern verified in `proof-live-session.mjs`). These are animation-settle delays for
an animated product where deterministic `waitForFunction` conditions are not always available.
Not a quick-solution floor in the I.W5 sense — they are consistent with the project's
Playwright testing approach. BOOK only.

### Silent catch in trusted-click fallback (P2)

`scripts/proof-icon-paint-live.mjs:585–591`: the `try { await page.getByRole("option").click() } catch { /* fall through */ }` block swallows any Playwright error from the trusted click without recording a warning. If the trusted click fails for a reason OTHER than the option not being found (e.g., a timing regression), the gate silently falls back to keyboard commit and records `vtDriveNote` but not the error. This is a minor oracle-opacity issue.

---

## Legacy / dead-code audit

- **`demo/app/dist/` orphan:** deleted as one-time hygiene; confirmed absent (`ls /Users/mkbabb/Programming/keyframes.js/demo/app/dist` → NOT FOUND). ✓
- **`proof:scene-icons` script:** deleted in `1a708cf` (I.W7); removed from `package.json` in same commit. ✓
- **`proof:scene-icons` stale reference in `demo/app/scenes.ts:46`:** comment reads "proof:scene-icons coverage" — a stale reference to the retired gate. The comment's meaning is still correct (structural: every non-home scene must define `icon`), but the gate name is retired. Minor BOOK.

---

## M1 scope tracking mismatch (P2 / FOLD)

`PROGRESS.md:71` and `I.md:338` both assign "M1 `sheet.bottom ≤ menubar.top` from MEASURED
menubar height" to W5. The authoritative wave spec `waves/I.W5.md` never includes M1 as a
scope item (S1–S6 only). W5 commit `bea5f27` touches exactly 5 files — none are mobile layout
code. The mobile menubar exclusion is implemented via CSS `--dock-band-reserve` (computed from
dock primitives, not a runtime `getBoundingClientRect()` measurement), consumed in the `@media
(max-width: 1023px)` block at `demo/@/styles/style.css:235`. The gate `proof:dock-zorder`
asserts the open sheet does NOT steal the bottom menubar's pointer events (functional M1
analog, not geometric `sheet.bottom ≤ menubar.top`).

FINAL.md disposition: "M1/M2/M3 fold into the felt-interaction gates" — a deliberate scope
reduction from geometric to functional. The functional check (pointer-event non-steal) is a
valid substitute if the CSS band is correct. No product regression detectable.

**J implication:** if M1 re-surfaces as a layout complaint (the 12px geometric occlusion in
B13), J should verify whether `proof:dock-zorder` clause 3's pointer-event check covers it
adequately or whether a geometric `sheetBottom <= menubarTop` assertion should be added.

---

## C-6 gate placement mismatch (BOOK)

`PROGRESS.md:71` says "a HYGIENE-tier `engine.ts ≤ 1400 OR named-measured split` ceiling
clause (C-6)" is a W5 gate item. In the delivered tree, C-6 is enforced in
`proof:engine-no-throw-on-play` (clause `[hygiene g]`, `scripts/proof-engine-no-throw-on-play.mjs:48–57`), not in `proof:icon-paint-live`. This is functionally equivalent (`proof:engine-no-throw-on-play` is in `proof:correctness`); the gate assignment drifted from
PROGRESS.md to the wave spec to the impl. `engine.ts` is currently 1375 lines (≤ 1400 ceiling). BOOK only.

---

## Gestalt / seam assessment

**The W5 seam is correct.** The `default-outDir landmine` (the structural root) is fixed at
the Vite config level, not cleaned up periodically. The SPA-fallback masking is fixed at the
middleware layer rather than the gitignore layer. The gate (S3) subsumes the retired source-
shape oracle and adds the missing runtime paint axis. The title (S4) is single-sourced in
the HTML without a build-time rewrite. DC-8 (S5) gets a mechanical decision (KILL-unless-
live-consumer, verified live) rather than a fourth defer.

**One gestalt concern (P2):** The `assetExtension404Plugin`'s Accept-mutation seam is the
narrowest valid fix but couples to Vite internals. The truly gestalt repair would be a Vite
plugin that resolves the file path against `root + publicDir` and emits a direct 404 — but
that requires access to Vite's resolver at serve time and is more complex than the current
approach. This is a J-appropriate simplification, not an urgency.

**The WZ trusted-click amendment** exemplifies the gate-ORACLE precept applied to itself: a
gate must actuate the product via the human's surface. The original in-page synthetic `click()`
was a gate-side workaround; the amendment is the correct fix (Playwright trusted click).

---

## Findings summary

| ID | Severity | Title | Evidence | Disposition |
|----|----------|-------|----------|-------------|
| W5-1 | P2 | S2 plugin couples to Vite 8 Accept-checking internals | `vite.config.ts:257–268`; no dev-server gate for S2 behavior | FOLD |
| W5-2 | P2 | Clause (e) VT runtime half passes vacuously when VT API absent | `scripts/proof-icon-paint-live.mjs:622–624`; uses `note()` not `fail()` | FOLD |
| W5-3 | P2 | M1 scope in PROGRESS.md/I.md vs waves/I.W5.md mismatch; geometric `sheet.bottom ≤ menubar.top` never gated | `PROGRESS.md:71`, `I.md:338` vs `waves/I.W5.md`; `scripts/proof-dock-zorder.mjs` checks pointer-event only | FOLD |
| W5-4 | P2 | Silent catch in trusted-click fallback — gate-side error opacity | `scripts/proof-icon-paint-live.mjs:585–591` | FOLD |
| W5-5 | BOOK | C-6 gate placement: assigned to W5 in PROGRESS.md; delivered in `proof:engine-no-throw-on-play` (W0 gate) | `PROGRESS.md:71`; `scripts/proof-engine-no-throw-on-play.mjs:48` | RECORD |
| W5-6 | BOOK | Stale `proof:scene-icons` gate name in `demo/app/scenes.ts:46` comment | `demo/app/scenes.ts:46` | RECORD |
| W5-7 | BOOK | Magic timeouts in gate (900/700/500/400/250ms settle-sleeps) | `scripts/proof-icon-paint-live.mjs:338,398,476,560,600` — consistent with project pattern | RECORD |
