# H.W9 — IMPL lane note · LANE C (the dock menu)

**Scope:** F4 + F5 — `demo/app/App.vue` ONLY (file-disjoint from every other W9 lane).
**Wave contract:** `docs/tranches/H/waves/H.W9.md` §Scope S5 (F4+F5), §supersede-map, §Hard gate `proof:pp-logo-svg` / `proof:darkmode-row-toggle`.
**tsc:** `npx tsc --noEmit` → exit 0 (clean) after both edits.
**git:** NOT committed (per wave instruction).

---

## F4 — ppmycota menu: drop the emoji `<p>`, lead with the SVG mark

**Root-cause (verified, R1):** the pp logo SVG ALREADY renders. `App.vue:50`
`<div class="ppmycota-logo-sm w-7 h-7 …">` → `.ppmycota-logo-sm` (`@styles/brand.css`,
imported at `App.vue:151`) → `url("@assets/ppmycota-logo-3.svg")`. The defect was the
emoji `<p>` line garnishing the brand mark.

**Change:** DELETED the emoji `<p>` line (was `App.vue:58`,
`&#x1F642;&#x200D;&#x2194;&#xFE0F; &#x1F331; &#x1F344;&#x200D;&#x1F7EB;`). The leading
`.ppmycota-logo-sm` SVG div + the typed "ppmycota" wordmark + the ppmycota.com link all
remain. No new markup, no asset hunt (the SVG was already wired + rendering).

**Preserved:** the whole-row `@click="togglePpMode"` on the `DropdownMenuItem` (the
`togglePpMode` fn is untouched) — F4 is markup-only deletion.

**Scope decision (per S5 "consider whether the typed word is redundant"):** KEPT the
typed "ppmycota" `<span>` — the SVG asset is a brand glyph/icon mark (tinted via
`--ppmycota-primary`), not a full wordmark, so the text label still carries the name.
Removing it would leave only an icon + a bare URL line, less legible. Minimal-delta:
remove only the clutter the user named (the emoji line).

**Gate it greens — `proof:pp-logo-svg` (NEW, static):** the item now contains ZERO emoji
codepoints in its text (the `🙂↔️🌱🍄` entity range → 0); `.ppmycota-logo-sm` still
resolves to a real `assets/ppmycota-logo-*.svg` background-image (unchanged). Red today
(emoji `<p>` present at `:58`) → green on the removal.

---

## F5 — dark-mode row: row-level toggle + passive indicator icon

**Root-cause (verified, R1):** `App.vue:38-44` — the dark-mode `DropdownMenuItem` carried
`@select.prevent` (keeps the menu open) and NO row `@click`; only `<DarkModeToggle>` (a
glass-ui `<button>` owning `toggleDark` internally) flipped the theme. The
`<span>Dark mode</span>` label + the row padding gutter were inert. Contrast the ppmycota
row (`:49`), which carries a row-level `@click`.

**Change (3 parts, all demo-local, idiomatic glass-ui consumption):**
1. Added `@click="toggleDark()"` to the dark-mode `DropdownMenuItem` (+ `cursor-pointer`),
   mirroring the ppmycota row precedent directly below it.
2. Added the `passive` prop to `<DarkModeToggle passive …>`. glass-ui's
   `DarkModeToggle.vue` template is `@click="!passive && toggleDark()"`
   (`DarkModeToggle.vue.d.ts` confirms `passive?: boolean`), so `passive` short-circuits
   the inner button → it becomes a pure state INDICATOR. The row fires `toggleDark` exactly
   ONCE per click — no double-toggle.
3. Imported `useGlobalDark` from `@mkbabb/glass-ui/dark` (the SAME singleton the CSS editor
   already consumes — `CSSCodeEditor.vue:38`) and destructured `{ toggleDark }` in the
   script. `useGlobalDark` is a one-shot singleton (`useGlobalDark.d.ts`), so this second
   consumer shares the existing `<html>.dark` state — no new state, no glass-ui change.

**Why `passive` and not removing the icon's handler some other way:** the named delta is
exactly the glass-ui `passive` prop existing for this case (S5 / §supersede-map F5). The
icon stays visible as the on/off indicator; the row owns the affordance. No glass-ui patch
(inv-16) — pure idiomatic consumption of a PUBLISHED prop.

**Gate it greens — `proof:darkmode-row-toggle` (NEW):** clicking the row's label/padding
gutter (NOT the icon) flips `<html>.dark`; clicking again flips back, exactly once per
click. Red today (label click is a no-op) → green on the row `@click` + passive icon.

---

## Precepts honored

- **NO workaround / NO legacy beside replacement:** F4 DELETES the emoji line outright; F5
  consumes glass-ui's existing `passive` prop rather than re-wrapping or shadowing the
  toggle. No dead markup left.
- **DRY:** F5 reuses the singleton `useGlobalDark` already imported by the CSS editor — no
  second dark-mode source of truth.
- **KISS:** F4 = one-line deletion; F5 = one prop + one `@click` + one import. The brand
  mark is the identity; the row is the affordance.
- **isomorphic:** both are demo-local markup/wire changes; no engine, no glass-ui patch,
  no dist build (inv-16). No NAMED deltas needed beyond the glass-ui `passive` prop, which
  is a published API.

## Files touched
- `/Users/mkbabb/Programming/keyframes.js/demo/app/App.vue` (template: dark-mode item + ppmycota item; script: import + `useGlobalDark` destructure)

## Handoffs / coordination
- None for this lane. F4/F5 are explicitly "NOT a HANDOFF — kept demo-local" per H.W9.md
  §glass-ui HANDOFFs. The `passive` prop is consumed from the installed glass-ui (no bump
  required — `passive?: boolean` present in the installed `DarkModeToggle.vue.d.ts`).
