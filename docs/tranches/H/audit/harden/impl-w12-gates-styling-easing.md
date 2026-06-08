# impl-w12-gates-styling-easing — GATE-AUTHORING lane: `proof:styling-idioms` (I12) + `proof:easing-sidebar-minimal` (J)

**Lane:** H.W12 GATE-AUTHORING — two of the nine NEW W12 gates:
- `proof:styling-idioms` (I12 / S5) — the OWNED-IDIOMS contract-MEMBERSHIP extension (the FORK-I12 reduction-branch regression guard); EXTENDS the W4 `proof:icon-idiom` resolve-or-red plumbing.
- `proof:easing-sidebar-minimal` (J / S7) — the MINIMAL controls-like easing sidebar lock (round-4 `j-easing-minimalism.md`); browser + static; settle-gated on the W1 FSM.

**Status:** LANDED, tsc-clean (`npm run check` PASS — `.mjs` scripts + `package.json` + `ci.yml` only, no TS source touched). No engine touched (`src/animation` FENCED, inv ζ). No git commit (per directive). Both gates GREEN on the landed W12 tree; both BITE on their born-RED (verified live, §3). Wired into `package.json` (scripts + `proof:all`) + `.github/workflows/ci.yml` (the demo-gate job, after the `gh-pages` build). The gates I extend/compose with hold (no regression): `proof:icon-idiom`, `proof:idioms`, `proof:easing-sidebar-normalized`, `proof:bezier-grown` — all PASS.

**Files (all absolute):**
- NEW `/Users/mkbabb/Programming/keyframes.js/scripts/proof-styling-idioms.mjs` (static grep; resolve-or-red over the full referenced-idiom set).
- NEW `/Users/mkbabb/Programming/keyframes.js/scripts/proof-easing-sidebar-minimal.mjs` (static + browser; serveDist + Playwright + FSM settle, mirrors `proof-easing-sidebar-normalized.mjs`).
- M `/Users/mkbabb/Programming/keyframes.js/package.json` — `proof:styling-idioms` (beside `proof:icon-idiom`), `proof:easing-sidebar-minimal` (beside `proof:easing-sidebar-normalized`); both added to `proof:all`.
- M `/Users/mkbabb/Programming/keyframes.js/.github/workflows/ci.yml` — both wired in the demo-gate job; `proof:easing-sidebar-minimal` carries `KF_REQUIRE_BROWSER: "1"` (the browser half cannot pass vacuously).

This lane is GATE-AUTHORING: the I12 idiom-membership cleanup and the J easing-strip IMPLEMENTATION already LANDED (the seam/scenes/styling-decomp/easing-eggs lanes). My job is to AUTHOR the two `proof:*` that LOCK that landed state and BITE on its born-RED, per `H.W12.md §Hard gate` + the §Mandate bar (no vacuity).

---

## 1. `proof:styling-idioms` (I12 / S5) — the FORK-I12 reduction-branch guard

### 1.1 — What it asserts (the contract-membership extension)

`proof:icon-idiom` (W4) polices ONLY the four `icon-(xs|sm|md|lg)`. The demo references
many OTHER idiom-shaped classes — and any one resolving to NOTHING is the SAME
silent-flatten failure the icon-* no-op was (`icon-md` painting 24px because no rule
existed). I12 EXTENDS the resolve-or-red plumbing from the four `icon-*` to the FULL
referenced-idiom set: every idiom-shaped class the demo references must resolve to a
definition in the OWNED contract corpus =

```
{ demo-local design-idioms.css ∪ style.css ∪ brand.css ∪ colocated demo/**/*.css partials }
∪ { glass-ui dist/styles/*.css }      (inv-16 — consumed, not re-authored)
∪ { tw-animate-css dist/*.css }       (the animation idiom family)
∪ { the referencing SFC's own scoped <style> }   (scene-private idioms)
```

Two clauses, each BITES:
- **(a) MEMBERSHIP / RESOLVE-OR-RED** — every idiom-shaped class referenced in demo `.vue`
  markup (excluding vendored `ui/` + `dist/`) resolves to a definition in some corpus.
- **(b) ICON-* COVERAGE (non-vacuity bridge)** — the four W4 `icon-*` ARE in the referenced
  set AND resolve through design-idioms.css, so the "full set" genuinely subsumes the four
  it extends from (the gate can never green by silently dropping its own coverage anchor).

### 1.2 — The FORK-I12 MEASURE-FIRST verdict: REDUCTION branch (born-GREEN guard)

The binding lane note `impl-w12-styling-decomp.md §1` MEASURED the full referenced-idiom set
against every definition home and found **ZERO referenced-but-undefined demo-authored
idiom-shaped class beyond the resolved `icon-*`**. The named suspects
(`depth-text` / `text-mono-caption`) are first-class glass-ui definitions (glass-ui-grace
rents that RESOLVE — KEEP per inv-16, the `.scale-on-hover` precedent). So clause (a) does
NOT bite born-RED today — it REDUCES to a **born-GREEN REGRESSION GUARD** that bites a FUTURE
un-owned idiom (a new `class="something-fancy"` with no home in any corpus). This reduction
is recorded HONESTLY (the gate's own output says so), NOT papered as a non-biting born-RED —
exactly the FORK-I12 disposition the §Mandate bar requires.

The gate re-derives the verdict LIVE (the references ARE the contract — no hand-maintained
"what to define" list), so it stays true as the demo evolves. Live measure on the landed tree:
**108 distinct referenced idiom-shaped classes; all resolve; 5 single-file inline-styled
semantic anchors excused; icon-* coverage subsumed.**

### 1.3 — The discriminators (the precise, falsifiable structural rules)

The two hard problems the hand-audit (§1 of the styling-decomp note) solved by eye, encoded
structurally so the gate bites a regression without false-positiving today:

1. **Idiom-shaped vs Tailwind utility.** A class is idiom-shaped iff hyphenated AND its first
   hyphen-segment is NOT a known Tailwind utility prefix (a broad set: `p`/`m`/`w`/`h`/`flex`/
   `grid`/`text`/`bg`/`border`/`rounded`/`transition`/… ) AND it is not a Tailwind state/
   responsive/arbitrary form (`:` variant, `[…]` arbitrary, `/` opacity, `!`/`-` prefix). The
   Tailwind engine owns utility resolution; the OWNED-IDIOMS contract owns recipe resolution.

2. **CSS-var false positives (the §1 trap).** Tailwind ARBITRARY-VALUE brackets are STRIPPED
   before tokenizing, so `max-h-[var(--panel-max-h)]` → `panel-max-h`, `w-[calc(100cqw_-_100%)]`
   → `cqw_-_100`, `stroke-[var(--ppmycota-primary,…)]` → `ppmycota-primary` are NEVER mistaken
   for class references (they are utility ARGUMENTS — the §1 "CSS-custom-property false
   positives"). Without this, the gate false-flagged 17+ token names.

3. **Comments are DEAD-REFS.** JS/CSS `/* */` + `//` AND `<!-- … -->` HTML/template comments are
   blanked, so a comment NARRATING a deleted idiom (EditorStartScreen's `<!-- the old
   <AnimatedText class="dot-fade …"> … DELETED -->`) is not a live reference (the §1 DEAD-REF case).

4. **Semantic markup anchor vs unresolved recipe.** A hyphenated non-Tailwind class with NO
   definition anywhere is EXCUSED as a NOT-IDIOM semantic anchor (`seq-row flex items-center`,
   `matrix-grid relative grid …`, `panel-stack relative`, `rainbow-wrapper opacity-100`) iff
   **BOTH**: (i) its element ALSO carries inline Tailwind utilities (styling co-located — the
   class name is a JS/readability label, not a recipe), AND (ii) it is referenced in EXACTLY
   ONE file (scene-private). A class referenced across ≥2 files is a SHARED recipe that MUST
   resolve — it can never be excused as an anchor. MEASURED: the 4 genuine anchors are each
   one-file; every shared owned recipe (`status-badge` ×2 scenes, `code-token` ×4) is multi-file
   — so removing a shared recipe's def reds here, not just in `proof:idioms`.

5. **Corpus precision (the `arbitraryBase` carve-out).** The loose "exact-base-prefix" fallback
   (`@utility foo` powering `foo-N` arbitrary variants) is enabled ONLY for tw-animate-css
   (where `@utility fade-in` legitimately powers `fade-in-0`). It is DISABLED for the demo-local
   + glass-ui corpora, so a bare `.icon { … }` base in `style.css` does NOT falsely "resolve" the
   distinct `.icon-md` recipe — a removed `icon-md` def still reds (clause b).

---

## 2. `proof:easing-sidebar-minimal` (J / S7) — the minimal controls-like sidebar lock

### 2.1 — What it asserts (the J1–J6 strip)

Per `j-easing-minimalism.md` + `H.W12.md §S7`. Born-RED on the post-W11 `EasingSidebar.vue`
(the `<LabeledInput label="value">` value input + the `<h2>` title + the short duration track).
Ten clauses — 4 STATIC (source-grep, the deletions are source facts, playwright-independent) +
6 BROWSER (rendered facts, settle-gated on the W1 FSM):

- **STATIC** (the J1/J2/J5/J4 deletions): **S1** no `<LabeledInput label="value">` CSS-value text
  input (the dropdown is sole); **S2** no `label="value"`; **S3** no `<h2>` scene title; **S4** no
  `css-value-input` / `value-field` dead anchors (they DIE with J1 — no legacy beside replacement).
- **BROWSER** (the J3/J6/J4 facts, on the live FULL-RAIL sidebar): **B1** the strip is RENDERED
  (0 `<h2>` + 0 CSS-value text `<input>` + 0 "value"-labelled `.labeled-field` — a CSS-suppressed
  born-RED would still render); **B2** the `<EasingSelect>` dropdown IS present (the SOLE selector
  — non-vacuity, the strip kept it); **B3** the `duration` track is FULL-WIDTH (rendered width ≈
  CardContent inner ±8px); **B4** ONE container (exactly 1 glass-ui Card-root); **B5** the
  `<EasingCurveCanvas>` block-size GREW above the W11 in-sidebar baseline; **B6** the grown canvas
  STILL FITS (pane `scrollHeight ≤ clientHeight + 1` AND `overflow-y ≠ scroll`).

### 2.2 — The W11 in-sidebar canvas baseline (the B5 grow threshold)

W11 did NOT override the EasingCurveCanvas's own default `block-size: clamp(160px, 38cqi, 280px)`
in the sidebar, so the rail rendered at the **160px FLOOR** (`impl-w12-easing-eggs.md §1`). J6's
`:deep(.easing-curve-canvas) { block-size: clamp(260px, 64cqi, 360px); max-block-size: min(56vh,
420px) }` raises the floor to 260px. The gate's `GROW_MIN = 200` cleanly separates J's landed
260px from the W11 160px baseline (so a SUPPRESSED-but-measured 160 fails). Live measure on the
landed J tree: **canvas block-size 260px** (grew from 160px), duration track **296px ≈ CardContent
inner 296px**, 1 Card-root, pane fits (scrollHeight 616 ≤ clientHeight 616, overflow-y `auto`).

### 2.3 — Settle plumbing (FSM-gated)

Mirrors `proof-easing-sidebar-normalized.mjs`: `#/easing` pinned via an IN-PAGE hash assignment
(NOT `page.goto` — goto clears storage + the W1 reconcile trap), the machine polled to rest on
`activeScene === 'easing'`, the viewport re-asserted after navigation, the controls pane forced
open with the easing tab selected so the FULL-RAIL sidebar mounts, and the gate waits until the
sidebar + hero canvas PAINT before measuring. `KF_REQUIRE_BROWSER=1` turns a playwright-absent
skip into a hard CI fail (verified — §3).

### 2.4 — W8 reconcile handoff (recorded by the easing-eggs lane; not re-litigated here)

`impl-w12-easing-eggs.md §6` records that `proof:easing-canvas-bounded` (W4) FAILS two clauses
that J DELIBERATELY supersedes (the `0.55` anti-dominance ratio cap — J6 grows the canvas to
DOMINATE; the `h2 header-required` clause — J5 DELETES the `<h2>`). That gate-reconcile is H.W8's
home (the gate-regime wave OWNS gate authoring). `proof:easing-sidebar-minimal` is the NEW gate
that LOCKS the post-J state; it does NOT touch `proof:easing-canvas-bounded`. Both my gates are
non-vacuous and born-RED→green on their own clauses; the W4-vs-J reconcile is the separate W8
ledger item the easing-eggs lane already flagged.

---

## 3. Falsifiability (the §Mandate bar — each gate BITES, no vacuity)

Each gate was driven RED on its born-RED, then restored GREEN. Verified live:

### `proof:styling-idioms`
- **BITE — planted standalone undefined idiom.** Inserted `<div class="frobnicate-glow">` (no
  inline companion, no definition) → clause (a) reds (`frobnicate-glow ×1`), exit 1. Removed → green.
- **BITE — removed W4 `icon-md` def.** Renamed `@utility icon-md` → `icon-md-STUBBED` → clause (b)
  reds (`referenced icon-* icon-md do NOT resolve`), exit 1. Restored → green. (This caught a
  corpus-precision bug: the loose exact-base-prefix fallback let a bare `.icon` resolve `icon-md`;
  fixed via the `arbitraryBase` carve-out — §1.3 #5.)
- **BITE — removed shared recipe.** Stubbed `.status-badge` (×2 scenes) → reds; stubbed
  `.code-token` (×4) → reds. Both are multi-file so neither is excused as a one-file anchor —
  proving the single-file anchor exclusion cannot mask a real shared-recipe regression.

### `proof:easing-sidebar-minimal`
- **STATIC BITE.** Reverted `EasingSidebar.vue` to the W11 HEAD form (the `<h2>` + `label="value"`
  + `css-value-input`) → S1/S2/S3/S4 all red, exit 1. Restored → all green.
- **BROWSER BITE.** Built `dist/gh-pages` FROM the W11-reverted source and re-ran: **B1 reds**
  (`<h2>:1`, "value" row:1), **B3 reds** (track 215px < inner 296px — the short 2-track row),
  **B5 reds** (canvas 160px = the un-grown W11 default — proving GROW_MIN=200 separates 260 from
  160). B2/B4/B6 correctly stayed green (W11 had the dropdown, one card, fit). Restored the J
  source, rebuilt the J dist, re-ran → all 10 clauses green.
- **KF_REQUIRE_BROWSER hard-fail.** With `KF_PLAYWRIGHT_DIR` pointed at a nonexistent dir under
  `KF_REQUIRE_BROWSER=1` → the browser half hard-fails (exit 1), not a silent vacuous pass. With
  real playwright under `KF_REQUIRE_BROWSER=1` (CI mode) → exit 0.

No gate is satisfied by a `display:none`/`!important` suppression: B1 measures RENDERED elements,
B5 measures the resolved block-size (a suppressed-but-measured 160 fails), and the styling gate's
membership probe resolves against REAL rule definitions, never the absence of a paint.

---

## 4. Wiring + gate status at lane close

- `package.json` — `proof:styling-idioms` + `proof:easing-sidebar-minimal` added (scripts +
  `proof:all` chain, placed beside the gates they extend/compose with). JSON valid; `npm run
  proof:styling-idioms` / `proof:easing-sidebar-minimal` resolve.
- `.github/workflows/ci.yml` — both wired in the demo-gate job (after the `gh-pages` build at
  ci.yml:184, so the browser half has dist). `proof:easing-sidebar-minimal` carries
  `KF_REQUIRE_BROWSER: "1"`. YAML parses clean.
- `npm run check` (tsc --noEmit) — **PASS** (scripts + config only; no TS source touched).
- `proof:styling-idioms` — **PASS** (FORK-I12 reduction guard; 108 idioms resolve; icon-* subsumed).
- `proof:easing-sidebar-minimal` — **PASS** (10/10 clauses; static + browser, FSM-settled).
- No-regression on extended/composed gates — **all PASS**: `proof:icon-idiom`, `proof:idioms`,
  `proof:easing-sidebar-normalized`, `proof:bezier-grown`.

The W1 FSM (the settle plumbing rests correctly on `easing`) + the W10 normalization + the W11
card/DFA all hold (no regression). The two gates LOCK the I12 idiom-membership state + the J
easing-strip; they are ready for the H.W8 golden `proof:visual-lock` capture (which lands AFTER
H.W12 per the §sequencing).
