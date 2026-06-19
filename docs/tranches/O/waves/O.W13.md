# O.W13 — Design-paint visual-truth gate (proof:design-paint, born-RED NOW; BC-gated baseline lock)

**Band:** F — glass-ui BC consume
**Phase:** NOW for gate authoring (S1 — the script is kf-internal; no sibling gate); GATED (BC cut) for the baseline lock (S4)
**Sequence:** O.W12 (S1+S2 workaround deletes + re-pin) → **O.W13** (design-paint baseline locked on BC-consumed tree); the gate AUTHORING (S1) fires NOW as a kf-internal obligation — the baseline lock (S4) fires after O.W12 GREENs
**Owning chronic/DM:** none (apparatus wave — closes the appearance/interaction/state gate blind-spot from `feedback_gate_blindspot_appearance_axis.md`)

M-substrate: **M.W-DESIGN-PAINT** (the pixel-readback visual-truth gate, fully developed 2026-06-17). This wave IMPLEMENTS M.W-DESIGN-PAINT's spec. Key delta from M.W-DESIGN-PAINT to O.W13:
- M.W-DESIGN-PAINT was authored with a DM-21 reference for the N Stage unshelf condition (§S5 lines 189, 279). This is a **transposition error** (AUDIT-DIGEST A2): the correct DM number per M-RECONCILIATION §7 is **DM-24**. O.W13 uses DM-24 throughout.
- M.W-DESIGN-PAINT §S5 (the N Stage visual gate integration) becomes a concrete sub-clause here because O.W15 (N Stage unshelf) is now a named O Band F wave — the conditional becomes the authored plan.
- The gate authoring phase (M.W-DESIGN-PAINT §S1) is confirmed born-RED: `proof:design-paint` is absent from `scripts/` at O audit time (AUDIT-DIGEST E22, E23 both confirm absence).
- E22 audit finding: `proof:consume-bundle` is ALREADY PRESENT at `scripts/proof-consume-bundle.mjs` and in `proof:hygiene` — counter to M.W15 §S3's born-RED claim. O.W13 does NOT re-author `proof:consume-bundle`; that is correctly noted as SHIPPED in the O.W14 lighthouse wave.

---

## Context

The gate blind-spot (`feedback_gate_blindspot_appearance_axis.md`) is the authoritative finding: the existing gate suite is thorough on CORRECTNESS and BEHAVIOUR but has a structural gap on **appearance**. Green source-shape gates miss visual failures. The running demo has no pixel-readback oracle.

**The genuine observable (M.W-DESIGN-PAINT §"The genuine observable").** The proxy to avoid: CSS property greps, emitted-CSS round-trip checks, screenshot diffs against unvalidated baselines. The REAL observable is the painted pixels in the live browser: colour at landmark regions, delta-frame transform for running animations, specular `::before` opacity under hover.

**The BC-gate rationale for S4 (M.W-DESIGN-PAINT §"The BC-gate rationale").** The gate script is authored NOW (born-RED, kf-internal). The BASELINE LOCK is BC-gated because the BC consume changes the visual surface (dock redesign, aria corrections, possible glass-card specular cohort changes) — a pre-BC baseline would immediately red on the BC consume due to surface change, not a genuine regression. The correct posture: author gate first (NOW), establish the baseline AFTER the final-state consume (GATED on O.W12 GREEN).

### Audit evidence (confirming M.W-DESIGN-PAINT born-RED state holds at O)

| Ref | Source location | Fact (verified 2026-06-19) |
|-----|-----------------|----------------------------|
| AUDIT-DIGEST E22 | `ls scripts/proof-design-paint.mjs` | NOT FOUND — the gate is absent; exit 1 by construction |
| AUDIT-DIGEST E22 | `package.json` | `proof:design-paint` not in any tier; not in `proof:correctness` or `proof:hygiene` |
| AUDIT-DIGEST E23 | M.W-DESIGN-PAINT.md:86-99 | "scripts/proof-design-paint.mjs does not exist today" — confirmed by O audit |
| AUDIT-DIGEST A2 | M.W-DESIGN-PAINT.md:189,279 | DM-21 transposition error confirmed — should be DM-24 per M-RECONCILIATION §7 |
| AUDIT-DIGEST E22 | `scripts/proof-consume-bundle.mjs` | PRESENT — the M.W15 §S3 born-RED claim is stale; `proof:consume-bundle` is already in `proof:hygiene` |

---

## Scope

### S1 — Author `scripts/proof-design-paint.mjs` gate-first (born-RED on today's tree)

**Breach.** No `scripts/proof-design-paint.mjs` exists. The visual-truth claim is entirely unvalidated. The born-RED state is the gate's absence — a gate that has never been written cannot be GREEN.

**Cure (gate-first — the script only; no scene changes).** Author `scripts/proof-design-paint.mjs`:
- Uses the existing `demo-driver.mjs` substrate (`withPage` + `serveDist`) to open `dist/gh-pages` in headless Playwright.
- Iterates the 8-scene sweep via `navToScene(page, sceneName)`.
- Applies per-scene paint checks (S2 check matrix).
- Exits 1 if any check fails; prints a scene-by-scene report naming the failing signal and the measured value.
- **Born-RED on today's tree by construction:** the script does not exist, so `node scripts/proof-design-paint.mjs` exits 1 (file not found). After authoring, the first run on the pre-BC demo may reveal additional born-RED findings (existing visual defects). Each such finding is a genuine defect that must be cured or delegated with a named wave home before S4 baseline lock.

**Falsifiable check.** `ls scripts/proof-design-paint.mjs` → present after authoring. `node scripts/proof-design-paint.mjs` → exit 1 on today's tree (either file-not-found or a failing paint check on the current demo).

---

### S2 — The per-scene pixel-readback oracle (the check matrix)

The check matrix is adopted from M.W-DESIGN-PAINT §S2 verbatim — the 8-scene sweep + the reduced-motion global check. Each check uses a SEMANTIC observable (colour gamut, delta-frame transform, opacity threshold) not a pixel-diff:

| Scene | Region | Signal | Red condition |
|---|---|---|---|
| home | animated title | `transform` matrix differs between rAF frames | zero delta (animation frozen) |
| cube | 3D cube face | `transform` matrix CHANGES per frame during active animation | zero delta |
| amiga | Boing ball | sampled pixel at ball centre is NOT blank white or transparent-black | `rgb(255,255,255)` or `rgba(0,0,0,0)` |
| square | pulsing square | bounding rect area > 0 AND `opacity` > 0.1 | zero area or zero opacity |
| easing | easing curve canvas | `width × height > 0` AND sampled pixel non-blank | blank canvas |
| spring | spring slider | thumb element `left` (or `transform`) changes per synthetic input | no change after synthetic input |
| sequence | stagger row | ≥3 child elements have distinct `opacity` values mid-sequence | all children same opacity |
| motion-path | path traveller | `transform` matrix changes per frame | zero delta |

**The PRM global check (the reduced-motion row).** Under `prefers-reduced-motion: reduce` (Playwright `emulateMediaFeatures`):
- No scene shows a running rAF loop: the designated animated element's `transform` matrix must NOT change between two rAF frames.
- **Critical precision (M.W-DESIGN-PAINT §S2):** kf animations are driven by `RAFPlayback` (rAF-based, `playback.ts`), NOT the Web Animations API. `getAnimations()` is ALWAYS empty for kf animations and MUST NOT be used as the witness (it is a proxy that passes on a running rAF loop). The real check: `getComputedStyle().transform` at frame N and frame N+1; under PRM + `respectReducedMotion`, the animation snaps to its final frame and the rAF loop stops — zero delta. Non-zero delta is the born-RED signal.
- The glass specular `::before` pseudo has `opacity: 0` under PRM (the specular does not animate under the glass-ui bracket).

---

### S3 — The glass specular check

**Breach.** The glass specular on glass cards is a key design-language element. No existing gate asserts it activates on hover. A dropped specular (from a `position: fixed` stacking-context collapse, `will-change: transform` isolation leak, or BC glass-ui change) is invisible to all current gates.

**Cure.** For each scene that renders a front glass card (cube, spring, sequence): `page.hover(selector)` and read `getComputedStyle(el, '::before').opacity`. Must be `> 0` in hover state (the glass-ui specular mechanism: `--mouse-x/--mouse-y` set on pointer-move, `::before` opacity transitions to 1).

**The REAL observable.** `getComputedStyle(el, '::before').opacity` is the runtime truth — NOT a source grep for `opacity: 0` (that is the initial state, not the hover state).

---

### S4 — BC-gated baseline lock (GATED on O.W12 GREEN)

After the BC consume (O.W12 GREEN, glass-ui BC cut installed):
1. `npm run gh-pages` → `dist/gh-pages`.
2. `node scripts/proof-design-paint.mjs` → all checks pass → exit 0.
3. The passing run is the **design-truth baseline** for the O-era demo — recorded in `docs/tranches/O/FINAL.md §visual-truth` with the CI run hash and per-scene check values.

**Rationale (not a deferral).** The gate script is authored NOW (S1). The baseline lock is GATED on the BC consume because the BC surface change would immediately invalidate a pre-BC baseline. The born-RED state is established by S1; S4 is the GREEN transition.

---

### S5 — N Stage visual gate integration (conditional on O.W15 DM-24 unshelf)

If the N Stage scene-switcher is unshelfed (DM-24 HANDOFF fires — O.W15 GREEN), `proof:design-paint` gains a Stage-specific row:

- **Stage open**: `.stage-void` scrim painted — sampled pixel in the centre of the stage background is in the dark gamut (`hsl(0 0% ≤ 8%)`).
- **Front card lit**: `--stage-light` computed value > 0.8 on the front card's ancestor (the spotlight cone illuminates it).
- **Ring item visible**: ≥5 ring items have `opacity > 0` and non-zero `transform` matrix.

This S5 clause is **conditional** on O.W15. If the Stage is shelved at O.WZ, S5 is deferred to the N unshelf wave (which owns the visual gate row).

---

## Born-RED gate

**Gate name:** `proof:design-paint` (NEW — `scripts/proof-design-paint.mjs`; does NOT exist today)
**Tier:** correctness (browser gate — opens headless browser over built dist; `GATE TIER: correctness` per `proof:gate-is-runtime` discipline)

**The REAL observable (inv-M-observable-truth — NOT a proxy):**

| Clause | Failure mode today (the REAL observable) | Why this is NOT a proxy |
|---|---|---|
| S2 animation live | animated element has zero-delta `transform` between frames | NOT a CSS property grep — the property exists in source even on a frozen animation; the gate reads ACTUAL computed values in the REAL browser |
| S3 glass specular | specular `::before` has `opacity: 0` after hover (the specular never activates) | NOT a source grep for `--mouse-x` — the variable can be set while the specular effect fails due to stacking-context or `will-change` isolation |
| S2 colour sample | landmark pixel is blank white or transparent-black (dropped backdrop-filter or z-index burial) | NOT an emitted-CSS check — the property can be emitted correctly and produce no visual effect |
| PRM check | animated element `transform` matrix changes between two rAF frames under `prefers-reduced-motion: reduce` | NOT `getAnimations()` — kf uses `RAFPlayback`, not WAAPI; `getAnimations()` is always empty for kf animations and is a proxy that never bites |

**Born-RED today (by construction).** `scripts/proof-design-paint.mjs` does not exist. `node scripts/proof-design-paint.mjs` → exit 1 (file not found). This is the genuine born-RED state: the visual-truth oracle is absent.

**Green condition (in order):**
1. Gate script authored (S1) — `ls scripts/proof-design-paint.mjs` succeeds.
2. First run on the pre-BC demo — each failing check is a genuine visual defect to be cured.
3. BC consume complete (O.W12 GREEN) — baseline lock run (S4) → exit 0.
4. Gate added to `proof:correctness` membership. `proof:ci-coverage` resolves the gate in its reachability set.

---

## Dependencies

- **O.W12 (BC re-pin + workaround deletes) — for S4 baseline lock only.** The GATE AUTHORING (S1, S2, S3) is kf-internal and fires NOW (no sibling gate). The BASELINE LOCK (S4) is GATED on O.W12 GREEN.
- **`dist/gh-pages` build** — the gate serves the built dist, not Vite-transformed source. `npm run gh-pages` must precede the gate run.
- **`demo-driver.mjs` + `withPage` + `navToScene`** — the existing runtime-gate substrate; no new browser infrastructure is required.
- **No vitest-browser dependency** — uses the existing headless Playwright `demo-driver.mjs` setup. If M.W3 (vitest-browser migration) lands before O.W13 impl, the gate migrates to `*.browser.test.ts` form; the observables are identical.
- **O.W15 (N Stage unshelf)** — S5 is conditional on O.W15. If shelved, S5 is deferred with a named terminal home in the N unshelf wave.
- **Independent of Band A/B/C/D waves** — the visual-truth gate observes RENDERED output, orthogonal to compile/ingest/correctness repairs and the gate-apparatus transposition.

---

## dev→impl boundary

S1 (gate authoring) opens at O Band F authoring authorization — the gate script is kf-internal and has no sibling dependency. S4 (baseline lock) opens when O.W12 is GREEN (BC consume complete). S5 fires conditionally with O.W15. The impl sequence: author S1 early in Band F pre-flight → run on pre-BC demo to surface any existing visual defects → execute O.W12 → immediately run S4 baseline lock on the BC-consumed tree.
