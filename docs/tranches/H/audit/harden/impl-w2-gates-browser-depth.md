# impl-w2-gates-browser-depth — H.W2 the cartoon-depth + orphan-specular gate lane

LANE = `proof:cartoon-is-panel-depth` (S1 / CS-2, the cartoon-depth restoration)
+ `proof:no-orphan-specular` (S1+S3 / CS-1+F1, the radial-bloom death lock). Both
BROWSER-gated, both wired (package.json declaration + `proof:all` + ci.yml), both
verified to BITE per H.W2.md §Hard gate. NO git commit — edits left in tree.
tsc-clean (`npx tsc --noEmit` → 0). `proof:ci-coverage` → PASS (all 53 proof:*
gates, incl. these two, invoked in CI).

These are the two §spine-bar gates that lock the GESTALT MOVE: the panel depth
register is the cartoon offset-stamp (NOT glass+specular), and the orphan
centred-bloom radial is DEAD on every kf-owned surface because the surface map
STOPPED EMITTING the class (NOT a `display:none`/`!important` suppression).

---

## §1 — the two NEW gates

| gate | file | mode | clauses |
|---|---|---|---|
| `proof:cartoon-is-panel-depth` | `scripts/proof-cartoon-is-panel-depth.mjs` | static + browser | source-shape (5 named) · token-resolution non-vacuity · ≥5 rest === `--shadow-cartoon-md` · ≥1 hover-grow === `--shadow-cartoon-lg` |
| `proof:no-orphan-specular` | `scripts/proof-no-orphan-specular.mjs` | static + browser | source-invariant (every Card cartoon-or-composite, 0 `.glass-card`) · fresh-ctx no-orphan-card sweep · hover `::before` no-centred-radial |

Both mirror `scripts/proof-demo-shell-grid.mjs` / `proof-stage-not-clipped.mjs`:
a STATIC half that always runs + a BROWSER half gated on playwright resolution;
under `KF_REQUIRE_BROWSER=1` a playwright-absent skip becomes a HARD FAIL (a SHIP
is never green-reported un-exercised). The browser half serves the BUILT
`dist/gh-pages/` (run `npm run gh-pages` first).

---

## §2 — proof:cartoon-is-panel-depth (S1 / CS-2)

**Clause 1 — SOURCE-SHAPE (static, always runs).** The 5 contract-named panel
Card sites (the `proof:cartoon-is-panel-depth` SET, incl. the never-enumerated
5th `AssetViewport.vue:12` per WV-W2-HIGH-1) each carry `surface="cartoon"` AND
dropped the manual `.glass-card` plate + `transition-shadow duration-normal` (the
G2 hover anti-pattern, deleted in the SAME edit). Flake-free anchor of the named
sites. **BITE proven:** reverted `RibbonBar.vue` → `<Card class="… glass-card
transition-shadow …">` → reds `source-shape — RibbonBar.vue: does NOT carry
surface="cartoon"`. Reverted `AssetViewport.vue` (the 5th) → reds.

**Clause 2 — COMPUTED-DEPTH (browser).** Sweeps cube/easing/spring (the panel +
sidebar footprint is route-dependent — CP-MED-2). The cartoon-shadow TOKENS are
resolved via a THROWAWAY probe element (`box-shadow: var(--shadow-cartoon-md)`),
so the SAME engine resolves `color-mix`/`light-dark()` — a glass-ui RENAME of the
cartoon family changes BOTH the token AND the Card box-shadow, and the equality
survives the rename while a wrong-token Card reds. Three sub-asserts:
- **non-vacuity (a):** `--shadow-cartoon-md` resolves to a REAL box-shadow DISTINCT
  from `--shadow-cartoon-lg` (a degenerate md===lg token would make the hover-grow
  pass trivially).
- **≥5 floor + non-vacuity (b):** ≥5 cartoon Cards resolve RESTING `box-shadow ===
  computed(var(--shadow-cartoon-md))` across the swept routes (measured 7 of 7).
- **hover-grow:** ≥1 cartoon Card GROWS to `box-shadow === var(--shadow-cartoon-lg)`
  on a REAL Playwright `.hover({force:true})` (measured 5). `force:true` bypasses
  actionability (some panels nest/overlap) but the `:hover` pseudo still engages;
  a 700ms settle lets the `--spring-bouncy` hover-lift transition COMPLETE before
  the read (a 120ms read lands mid-spring — measured + corrected).

**measured GREEN today:** all 4 clauses ✓ (5 named cartoon · md≠lg · 7 rest-match ·
5 hover-grow). **born-RED proven** on the un-flipped 5th `AssetViewport` Card.

---

## §3 — proof:no-orphan-specular (S1+S3 / CS-1+F1)

**Clause 1 — SOURCE-INVARIANT (static, always runs).** Over every demo `*.vue`
(73 files, comment-blanked incl. `<!-- -->`): EVERY `<Card …>` opening tag
resolves `surface="cartoon"` OR is the enumerated `.cartoon-specular` composite
(which MUST co-carry `glass-specular-track` AND its file MUST import/use
`useSpecularPointer` — the `--mouse-x` writer is PRESENT in source). NO `<Card>`
carries the manual `.glass-card` plate (CS-3). The enumerated exception set is
EXACTLY {`TimingFunctionPanel` bezier} — identified by the `.cartoon-specular`
recipe class. **BITE proven:** reverted `EasingSidebar.vue:14` to default-glass →
reds; reverted `AssetViewport.vue` to `glass-card` → reds CS-3.

**Clause 2 — NO-ORPHAN-CARD COMPUTED (browser, FRESH CONTEXT per scene).** THE
KEY HARDENING: the orphan footprint is route- AND state-dependent (CP-MED-2 /
WV-W2-HIGH-1) — the sub-Cards that emit the orphan track (e.g. the EasingSidebar
value-bar) mount in a FIRST-LOAD state that a cube→scene in-page hash TRANSITION
does NOT reliably reproduce (measured: the in-page sweep saw `cardTracks=0` on
easing, a FRESH-context `goto #/easing` saw the orphan `[data-surface=glass]`
Card). So each scene opens in a FRESH `browser.newContext()` at its canonical
first-load mount, with the pane-open flag re-seeded via `addInitScript` BEFORE
load (`goto` clearing storage is FINE here — this tests FIRST-LOAD surface
emission, NOT the H.W1 FSM reconcile trap). The INVARIANT: ZERO `.glass-specular-
track` element is a kf-owned `<Card>` (`[data-surface]`) unless it is the
enumerated composite. The stable anchor is `anyPointerWrite:false` on the
remaining tracks (CP-MED-2: the COUNT moves, the invariant does not). **BITE
proven:** built dist with `EasingSidebar:14` reverted to glass → reds
`no-orphan-card — 1 kf-owned <Card> carries an unwired glass-specular-track`.

**Clause 3 — HOVER ::before NO-CENTRED-RADIAL (browser, the WV-W2-LOW-3
storm-robust COMPUTED check as PRIMARY).** Hover the panel/sidebar cartoon Cards
(the composite excluded — it legitimately keeps a calmed, tracked catch-light);
each hovered Card's `::before` must NOT paint the specular warm-white catch-light
radial. NON-VACUITY: ≥1 cartoon Card actually hovered (measured 8).

> **MEASURE-FIRST regex correction (a live finding the contract did not anticipate).**
> The contract WV-W2-LOW-3 prescribes "the centred floor renders a BARE `circle`
> (no `at`), tracked renders `circle at <≠50%>` — the gate's regex distinguishes
> them." That is the SOURCE form. In the BUILT/COMPUTED form, Chrome serializes
> the `::before` `background-image` to `radial-gradient(circle, rgba(...) …)` and
> DROPS the `at <x> <y>` position EVEN when `--mouse-x` is written (the default
> `50% 50%` position is omitted from the serialized form; a synthetic
> `--mouse-x:30%` write did NOT change `backgroundImage` — verified live). The
> `--specular-x`/`--specular-y` (registered `@property inherits:false`) live on
> the PSEUDO and do not reflect a synthetic host write through `getComputedStyle`.
> So the centred-vs-tracked distinction is NOT reliably in the serialized
> `background-image`. The STORM-ROBUST signal — and the correct primary check for
> a CARTOON panel — is the PRESENCE of the warm-white catch-light radial itself:
> `/radial-gradient\([^)]*rgba\(255,\s*255,\s*255,\s*0\.55\)/`. The defect IS the
> presence of that `::before` radial on a panel; the fix (the cartoon surface, the
> radial gone) is its ABSENCE. This is the WV-W2-LOW-3 "COMPUTED ::before check as
> PRIMARY" read honestly to the built reality. The centred-vs-tracked AT-position
> regex is owned by `proof:cartoon-specular-coexist` (sibling lane), which drives
> a DETERMINISTIC probe with a synthesized pointermove on the composite.

**measured GREEN today:** all 3 clauses ✓ (14 Cards cartoon-or-composite · 0
orphan-card across 3 fresh-ctx mounts · 8 panels hovered, 0 bloom). The S5
HANDOFF residue is RECORDED not failed: 15 `<Button>`/dock `glass-specular-track`,
`anyPointerWrite:false` — glass-ui-owned (inv-16), they ride `proof:specular-
handoff` born-RED (sibling lane). **born-RED proven** on a default-glass / manual
`.glass-card` Card.

---

## §4 — composability with the sibling W2 lanes (shared files)

- `package.json` — added TWO script declarations after the existing W2 cluster
  (`proof:specular-calm`) + chained both into `proof:all` (after `proof:specular-
  calm`, before `proof:dock-popover-opens`). No collision with the sibling lanes'
  `proof:no-dup-utility`/`proof:specular-handoff`/`proof:cartoon-specular-coexist`/
  `proof:specular-calm` declarations (lines 89–92, untouched).
- `ci.yml` — added two browser-gated steps (`KF_REQUIRE_BROWSER: "1"`) in the
  demo-smoke job after the sibling `proof:specular-calm` step (line 315), before
  `proof:idioms`. They ride AFTER the `npm run gh-pages` build (line 184) so the
  browser half measures the BUILT demo.
- `proof:ci-coverage` → PASS (clause 0: all 53 proof:* invoked in ci.yml).

## §5 — gate↔contract crosswalk

- `proof:cartoon-is-panel-depth` ⇒ H.W2.md §Hard-gate bullet 1 (≥5 panel Cards
  resolve `--shadow-cartoon-md` rest → `--shadow-cartoon-lg` hover; rename caught).
- `proof:no-orphan-specular` ⇒ H.W2.md §Hard-gate bullet 2 (every kf-owned `<Card>`
  resolves `surface=cartoon` OR an enumerated composite/glass exception with a
  `--mouse-x` writer; the `anyPointerWrite:false` INVARIANT not a fixed count;
  the storm-robust hover `::before` check; the radial dies at SOURCE, not via
  `display:none`/`!important`).
- WV-W2-HIGH-1 (the 5th Card + the re-scoped footprint) — both gates include
  `AssetViewport`; `no-orphan-specular` scopes to EVERY kf-owned Card, not 4.
- WV-W2-LOW-3 (storm-robust COMPUTED primary) — honored + corrected to the
  built-CSS reality (see §3 box).
- inv-16 — the `<Button>`/dock residue is RECORDED, NOT patched in kf.

## §6 — DO-NOT-TOUCH honored

- `design-idioms.css:263-269` `.progress-dot` playing-ring (CS-4/A10) — NOT
  referenced by either gate (a wrong-target edit avoided).
- the specular `::before` BUILD (G3, GPU-cheap + SOTA) — consumed as-is; NO perf
  claim made. `proof:no-orphan-specular` asserts the radial is GONE on the cartoon
  surface (a PERCEPTUAL fix), it does not claim a paint win (WV-W2-MED-3 / G2 is
  the sibling-lane's REDUCES-not-eliminates honesty).
