# H.W9 — IMPL lane note · GATES (the dock-menu + idle-fade gate authoring)

**Lane:** the gate-authoring lane for the 3 NEW W9 gates whose subjects are the dock-menu
(F4/F5) + the idle-fade (F9) — paired with Lane C (the App.vue F4/F5 impl) and Lane B (the F9
impl). This lane authors ONLY the gates (plus their package.json + ci.yml wiring); the source
changes they pin LANDED in the sibling impl lanes.

**Wave contract:** `docs/tranches/H/waves/H.W9.md` §Hard gate — `proof:pp-logo-svg` (F4, static),
`proof:darkmode-row-toggle` (F5, browser), `proof:idle-fade` (F9, browser). Each BITES + cites a
`file:line`/live anchor, each born-RED on the pre-W9 tree, GREEN on the W9 fix.

**Status:** LANDED. All 3 gates authored + proven (GREEN-on-landed, RED-on-defect) + wired into
`package.json` (`proof:*` + `proof:all`) + `ci.yml`. `proof:ci-coverage` GREEN (68 gates, no
orphan). Library `tsc --noEmit` (`npm run check`) EXIT 0. NOT git-committed (per wave instruction).

---

## (1) `proof:pp-logo-svg` — F4 (static; `scripts/proof-pp-logo-svg.mjs`)

**Subject:** the ppmycota `<DropdownMenuItem>` in `demo/app/App.vue` (the F4 lane DROPPED the emoji
`<p>` line — formerly `App.vue:58`, `🙂↔️🌱🍄` — and leads with the existing
`.ppmycota-logo-sm` SVG mark).

**Three falsifiable static clauses, SCOPED to the ppmycota item:**
1. SVG MARK PRESENT — the item mounts a `.ppmycota-logo-sm` element.
2. ZERO EMOJI — the item's markup carries ZERO emoji codepoints, both as HTML numeric entities in
   the emoji ranges (plane `1F000–1FAFF`, ZWJ `200D`, VS16 `FE0F`, dingbats/symbols `2600–27BF`,
   misc-symbols-&-arrows `2B00–2BFF`, the arrows block `2190–21FF` where ↔ = `2194`) AND as raw
   codepoints. The deleted F4 cluster `&#x1F642;&#x200D;&#x2194;&#xFE0F; &#x1F331; &#x1F344;&#x200D;&#x1F7EB;`
   would trip every one of those ranges.
3. ASSET RESOLVES — `.ppmycota-logo-sm`'s `background-image` (`demo/@/styles/brand.css:33`,
   `url("@assets/ppmycota-logo-3.svg")`) points at a file that EXISTS on disk
   (`@assets` → repo-root `assets/`, per `vite.config.ts:161` / `tsconfig.json:22`;
   `assets/ppmycota-logo-3.svg`, 10KB present). Resolve-or-red — mirrors `proof:idioms` clause-1
   (not a bare grep).

**SCOPE decision (the false-RED trap I designed around):** the gate isolates the ppmycota
`<DropdownMenuItem>` block (anchored on its `@click="togglePpMode"`, the F4-preserved affordance) —
NOT the whole menu. The @mbabb row legitimately carries `&#x1F389;` (🎉) in its GitHub link
(`App.vue:78`), and the EditorStartScreen hint carries the M. cubert face (`App.vue:95`); a
menu-wide emoji grep would false-RED on those. The clause bites ONLY the ppmycota row.

**BITE proven:** GREEN on landed → re-introducing the emoji `<p>` into the ppmycota item reds clause
2 (`8 emoji codepoint(s): [U+1F642, U+200D, U+2194, U+FE0F, U+1F331, U+1F344, U+200D, U+1F7EB]`) →
restored GREEN. HTML comments are stripped first so the F4 rationale prose cannot satisfy/trip it.

**Disposition:** STATIC — no browser (the contract: "no browser needed; mirrors `proof:idioms`
clause-1"). Wired in the demo-smoke job's static-gate cluster beside `proof:specular-handoff` /
`proof:no-dup-utility` (grep + asset-resolve; NO `KF_REQUIRE_BROWSER`).

## (2) `proof:darkmode-row-toggle` — F5 (browser; `scripts/proof-darkmode-row-toggle.mjs`)

**Subject:** the dark-mode `<DropdownMenuItem>` in `App.vue` — F5 added a row-level
`@click="toggleDark()"` (`App.vue:43`) + made the icon `<DarkModeToggle passive>` (`App.vue:44-45`)
a pure indicator (`@click="!passive && toggleDark()"` short-circuits), so the row fires toggleDark
EXACTLY ONCE per click.

**Two clauses:**
1. SOURCE-SHAPE (static, always runs): the dark-mode item's open tag carries `@click="toggleDark…"`
   AND the inner `<DarkModeToggle>` is `passive`. Isolated by anchoring on `<DarkModeToggle>` (the
   only one in the menu) and walking to its enclosing `<DropdownMenuItem>`. Comments stripped.
2. ROW-LABEL-TOGGLE (browser): reuses the `proof:dock-popover-opens` plumbing (expand the collapsed
   dock by hover, click the `[aria-label="@mbabb menu"]` trigger), then locates the
   `<span>Dark mode</span>` label by EXACT text and ASSERTS the click target is NOT inside a
   `<button>` (it must be the LABEL gutter, not the icon). Then clicks the label twice and asserts a
   symmetric flip: `before → !before → before` (click 1 flips `<html>.dark`, click 2 flips back) —
   exactly one toggle per click. The dark class lives on `<html>` (glass-ui `useGlobalDark` →
   `@vueuse/core useDark`, `documentElement.classList 'dark'` — verified in the installed bundle).
   The row is `@select.prevent` (keeps the menu open) so the second click finds the label live; a
   defensive re-open guards the case where it closed.

**BITE proven (the load-bearing born-RED):** reverted F5 in source (drop the row `@click`, drop
`passive`), rebuilt the dist, ran with `KF_REQUIRE_BROWSER=1` → the static clause reds AND the
browser clause reds `light→light→light` (the label is inert — the exact born-RED defect). Restored
+ rebuilt → GREEN `light→dark→light`. The double-toggle path is also caught: with the row `@click`
present but the icon NOT `passive`, the two handlers cancel (net no-change → the symmetric round-trip
fails) — the gate's `flipsBack` clause names this case explicitly.

**Disposition:** wired in the demo-smoke job right after `proof:single-toggle` (the @mbabb
dock-menu browser cluster — shares the menu-open driver), `KF_REQUIRE_BROWSER: "1"`. Settle-gated on
the H.W1 FSM (the trigger is dock chrome — present on every route).

## (3) `proof:idle-fade` — F9 (browser; `scripts/proof-idle-fade.mjs`)

**Subject:** the OPEN controls pane wrapper. F9 restored the rest-dim via
`@vueuse/core useIdle(10_000)` in `usePaneHover.ts` (`isPaneIdle = idle && !isPaneHovered`),
applied as `.controls-pane--idle` on the wrapper (`ControlsPaneWrapper.vue:12`); the desktop CSS
(`ControlsPaneWrapper.vue` scoped `@media (min-width:1024px)` +
`design-idioms.css --controls-idle-opacity: 0.35`) fades the wrapper to the token, with a
`:hover`/`:focus-within` lift + a PRM snap-guard.

**One browser clause with a NON-VACUITY anchor (BROWSER-ONLY — a time-driven rendered fact):**
- NON-VACUITY: with the pane just settled (active), the wrapper opacity is `1` AND the
  `--controls-idle-opacity` token is `< 1` (≈0.35) — so the dim is a REAL delta, not an always-dim
  pane. (Measured: token 0.35, resting opacity 1.000.)
- IDLE-DROP: pin `#/cube` desktop (in-page hash, NOT `page.goto` — survives storage + the H.W1
  trap), open the pane (the `proof:single-column-pack` `settleOnCube` + `openPane` plumbing), then
  fire NO events for >10s (a REAL `page.waitForTimeout(11_500)` — `useIdle` resets on
  mousemove/keydown/wheel/etc, so any synthetic event would defeat the test). Assert the wrapper
  carries `.controls-pane--idle` AND opacity dropped to ≈`--controls-idle-opacity` (±0.05).
  (Measured: `.controls-pane--idle` present, opacity 0.350.)
- HOVER-LIFT: `page.mouse.move` into the pane → opacity returns to `1` (activity resets `useIdle` →
  class drops AND the `:hover` override lifts it — both paths restore full opacity). (Measured 1.000.)

**BITE proven:** reverted F9 in source (dropped the `isPaneIdle ? 'controls-pane--idle' : ''` wire
at `ControlsPaneWrapper.vue:12` — the exact dead-class born-RED), rebuilt the dist, ran with
`KF_REQUIRE_BROWSER=1` → the class stays absent and opacity rests at `1.000` after >10s idle (the
born-RED "opacity rests at 1 forever"). Restored + rebuilt → GREEN.

**Disposition:** wired in the demo-smoke job right after `proof:darkmode-row-toggle`,
`KF_REQUIRE_BROWSER: "1"`. The idle rule is desktop-only (`min-width:1024px`); the gate measures at
1440×900. Cost: ~15s per run (the genuine 11.5s idle wait is intrinsic — a synthetic clock cannot
substitute since `useIdle` listens for real activity).

---

## Wiring (package.json + ci.yml)

- **package.json:** 3 script declarations added after `proof:bezier-no-scroll`. Woven into
  `proof:all`: the two browser gates after `proof:single-toggle` (the dock-menu cluster);
  `proof:pp-logo-svg` after `proof:bezier-no-scroll` (the static demo cluster). Each appears once.
- **ci.yml:** `proof:darkmode-row-toggle` + `proof:idle-fade` after `proof:single-toggle`
  (demo-smoke job, `KF_REQUIRE_BROWSER: "1"`); `proof:pp-logo-svg` after `proof:specular-handoff`
  (the demo static-gate cluster, no browser). Each with a documenting comment naming the born-RED.
- **`proof:ci-coverage` GREEN:** all 68 `proof:*` gates invoked in CI (clause 0); the RETIRED
  `proof:cartoon-specular-coexist` / `proof:specular-calm` are absent from package.json AND ci.yml
  (sibling-lane retire — confirmed coherent: 0 `npm run` invocations of either; the
  H.W8 RETIRED-exclusion + proof:ci-coverage's EXCLUDED set stay coherent — no orphan reference).

## Precepts honored

- **MEASURE-FIRST:** before authoring, I read the live App.vue (F4/F5 landed), ControlsPaneWrapper +
  usePaneHover + design-idioms (F9 landed), the installed glass-ui `useGlobalDark`/`DarkModeToggle`
  shapes, and confirmed `assets/ppmycota-logo-3.svg` on disk. Every assertion is an EXACT live
  measurement / static fact (token 0.35, opacity 1↔0.35, the `light→dark→light` round-trip, the 8
  emoji codepoints).
- **Each BITES:** every gate proven RED on its exact born-RED defect (re-added emoji / reverted row
  `@click`+passive / dropped idle class) and GREEN on the landed fix. No vacuous pass — the
  idle-fade carries an explicit non-vacuity anchor (resting opacity = 1), the darkmode browser
  clause asserts the click is NOT the icon, the pp-logo gate is scoped to the ppmycota row so the
  @mbabb 🎉 cannot false-RED.
- **DRY / existing harness idioms:** the two browser gates reuse the canonical serveDist +
  Playwright + `KF_REQUIRE_BROWSER` skip-or-fail plumbing verbatim from
  `proof:dock-popover-opens` (menu driver) and `proof:single-column-pack` (`settleOnCube`/
  `openPane`); the static gate mirrors `proof:dock-popover-opens`'s App.vue comment-strip + block
  isolation + `proof:idioms` resolve-or-red.
- **NO source change:** this lane authored only `.mjs` gate scripts + the package.json/ci.yml
  wiring. Zero TS touched → library tsc stays EXIT 0. The bite-tests reverted-then-restored source
  + dist with no net delta (verified the F4/F5/F9 landed anchors intact post-restore).

## Files

- `/Users/mkbabb/Programming/keyframes.js/scripts/proof-pp-logo-svg.mjs` (NEW)
- `/Users/mkbabb/Programming/keyframes.js/scripts/proof-darkmode-row-toggle.mjs` (NEW)
- `/Users/mkbabb/Programming/keyframes.js/scripts/proof-idle-fade.mjs` (NEW)
- `/Users/mkbabb/Programming/keyframes.js/package.json` (3 scripts + `proof:all` weave)
- `/Users/mkbabb/Programming/keyframes.js/.github/workflows/ci.yml` (3 steps + comments)

## Coordination

- Lane C (App.vue F4/F5) + Lane B (F9) own the SUBJECTS; this lane owns the GATES — file-disjoint
  (no source overlap; only the shared package.json/ci.yml, where the sibling lanes had already
  added their own W9 gates — I appended mine without touching theirs).
- The RETIRE/INVERT of the specular gates is the register lane's (Lane A) gate-set edit; I only
  CONFIRMED coherence via `proof:ci-coverage` (the retired pair is absent everywhere; the inverted
  `proof:no-orphan-specular` + the new `proof:glass-and-cartoon`/`proof:bezier-no-scroll`/
  `proof:cartoon-shadow-unclipped` are present and wired by their lanes).
