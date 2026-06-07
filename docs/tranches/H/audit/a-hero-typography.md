# Tranche H Deep Audit — Lane `a-hero-typography`

**Charge (D7):** the hero ("Select an animation") must be LARGER + use the GOLDEN
(φ-ladder) typography. Audit the φ/golden type system end-to-end (glass-ui phi-ladder
`text-display-*`/`text-title`, `style.css`, `brand.css`, `AnimatedText.vue`,
`EditorStartScreen.vue`). Is the hero using it? Propose the sizing + the φ-scale
application. Audit φ-usage across ALL demo text (the chronic φ-ladder leaf-tail history).

**Method:** read the type substrate (glass-ui `typography.css`, `tokens.css`, demo
`style.css`/`brand.css`/`design-idioms.css`); drove the live demo at
`http://localhost:5174/#/` with Playwright at 1440×900 and 390×844; probed resolved
computed values for every φ rung and for the hero `<h1>`.

**Binding mandate posture:** every finding cites a `file:line` or a live observation.
Where the φ-ladder is exemplary I mark it ALREADY-SOTA rather than invent work.

---

## Live ground truth (1440×900, route `/`)

The hero `<h1>` (EditorStartScreen.vue:5-21):

| Probe | Value |
|---|---|
| classes | `text-display-4 grid p-0 lg:flex` |
| computed `font-size` | **86.112px** (`--type-display-4` = `clamp(3.33rem, 2.5rem + 4vw, 5.382rem)`) |
| `line-height` | 94.72px (`--type-leading-display` = 1.1) |
| `font-family` | `"Instrument Serif", "Instrument Serif Fallback", Georgia` |
| `font-weight` | 400 · `letter-spacing` −2.15px · `text-wrap` balance |
| host rect | x24 y96 w1392 h189 (top-left, `mt-28`, `h-0`, `w-screen`, `pointer-events-none`) |

Mobile (390×844): hero = **55.6px** (display-4 floor 3.33rem + 4vw), no horizontal overflow.

**All φ rungs resolve correctly and the audacious-tier utilities are compiled/available**
(probed live @1440):

| rung | token | px @1440 | peak (clamp ceiling) | utility compiled? |
|---|---|---|---|---|
| `--type-title` | φ^(3/2) | 32.9 | 32.9 | yes |
| `--type-display-4` ← **hero today** | φ^(7/2) | **86.1** | 86.1 | yes |
| `--type-display-5` | φ^4 | 109.7 | 110 | yes |
| `--type-display-mega` | φ^(9/2) | **177.4** | 177 | `.text-display-mega` ✔ |
| `--type-display-hero` | φ^5 | 244.8 | 287 | `.text-display-hero` ✔ |
| `--type-display-audacious` | φ^(11/2) | 310.4 | 352 | `.text-display-audacious` ✔ |
| `.text-hero` | (pegs audacious) | 310.4 | 352 | ✔ but `white-space: nowrap` |

Sources: glass-ui `typography.css:111-123` (tokens), `:152-265` (`@utility` rungs),
`tokens.css:59` (`--type-leading-display: 1.1`).

---

## Is the hero on the φ-ladder? — YES, but on the WRONG (middle) rung

The hero IS golden-rung'd today — `text-display-4` is a genuine φ rung (φ^(7/2)), NOT a
raw `text-Nxl`. This is the C.W2 close of the original A grand-audit finding (the hero was
`text-6xl/8xl/5xl/2xl`, A constellation-grand-audit:83; re-rung in C.W2, C.md:227). So the
*leaf-tail is closed* — the hero is not OFF the ladder.

**The D7 defect is altitude, not adoption.** The hero sits on display-4 (the middle of the
6-rung display tier), while glass-ui ships a dedicated **audacious display tier**
(`--type-display-mega` / `-hero` / `-audacious`, typography.css:116-123) introduced
*precisely* for "poster-type consumers… when the consumer wants the number [headline] to
win" (typography.css comment :116-120). The kf hero — the single largest, LCP, identity
headline of the demo — is the textbook poster-hero consumer and is NOT reaching into that
tier. At 86px on a 1440px canvas with the cube as the dominant subject, the hero reads
MEDIUM; the user's "must be LARGER" is exactly the next-rung-up the audacious tier exists
to serve.

### Recommendation — bump one rung into the audacious tier: `text-display-mega`

**`text-display-4` → `text-display-mega`** (EditorStartScreen.vue:6).

- φ^(9/2), `clamp(5.382rem, 4rem + 9vw, 11.089rem)` → **177px @1440 / ~94px mobile** — a
  decisive +φ^½ jump (86→177px @desktop) that makes the hero WIN the frame while staying a
  pure φ-ladder rung (no magic number).
- It keeps `text-wrap: balance` (typography.css:209) — so "Select an / animation" balances
  across two lines in the left column instead of one 1392px-wide run. **MEASURE-FIRST:**
  confirm the 2-line balanced wrap parks above the cube and clears the header band before
  committing the exact rung; if mega crowds, fall to `text-display-5` (110px) as the
  conservative rung.
- It inherits `--font-display-weight` (400, Instrument Serif), `--type-tracking-tight`,
  `--type-leading-display` (1.1), `font-optical-sizing: auto` — i.e. ZERO new declarations;
  the change is a one-class swap routing through the existing golden substrate (DRY, no
  net-new CSS — the mandate's gestalt-adoption posture).

**Do NOT use `.text-hero`.** Despite the name it is `white-space: nowrap`
(typography.css:186-187) for single-token numeric poster heroes (fast.com `0`); a 3-word
English hero would overflow the viewport. The right utility is `.text-display-mega` (or
`.text-display-hero`), which carry `text-wrap: balance`. This is the load-bearing
distinction for this lane.

**Leading for poster scale (named delta, optional):** at 177px the `1.1` display leading
opens a wide gap before the subtitle. glass-ui's own `.text-hero` uses `line-height: 0.84`
for poster type (typography.css:175). A scoped, NAMED delta — `line-height: 0.92` on the
hero `<h1>` only (a demo-local rule, NOT a glass-ui override of the shared `.text-*`
family, mirroring the existing `.start-screen-prose` scoped delta at
EditorStartScreen.vue:67) — tightens the two-line block without touching the shared rung.
MEASURE-FIRST against the screenshot.

**Disposition: SHIP-in-H.** One-class swap (display-4 → display-mega) + optional scoped
leading delta. Falsifiable instrument below.

---

## Hero composition findings (live)

### F1 — The decorative `...` ellipsis breaks the hero's optical block (related to D6)
EditorStartScreen.vue:15-20 renders a SECOND `<AnimatedText :text="ellipsis='...'">` in
its own `<div>`. With `lg:flex` on the `<h1>` it is meant to sit inline after "animation";
live it wraps to a **second line below the headline** (screenshot `hero-home-1440.png` — the
"..." floats on its own row above the subtitle), and the dot-fade host is mid-fade
(`opacity 0.68`, animationName `dotFade-…`). Visually the hero block is "Select an
animation" + an orphaned "..." line, which fragments the poster.

- **Root cause:** the two-`<div>` + `grid`/`lg:flex` host can't keep the ellipsis inline
  once the headline balances to two lines (the headline's second line + the ellipsis div
  compete). At the LARGER mega rung this worsens.
- **Gestalt fix:** fold the ellipsis into the SAME run as the title so it animates as the
  trailing glyphs of one headline, not a separate flex child — e.g. append the ellipsis as
  a trailing word of the single AnimatedText run (or a single inline `<span>` after it),
  dropping the second `<div>`. The hero becomes ONE balanced display run. This also
  collapses the `grid p-0 lg:flex` host to a plain block (KISS).
- **Disposition: SHIP-in-H, COORDINATE with lane handling D6** (typing-dots). The dot-fade
  *mechanism* is D6's; the *hero layout coupling* is this lane's. Tag the shared seam.

### F2 — `depth-text` IS the cartoon-shadow text idiom (cross-ref D2/D14) — ALREADY-SOTA
The hero passes `depth-text` (EditorStartScreen.vue:10,17), which resolves to glass-ui's
5-layer stacked-offset text-shadow (utilities.css:231-246) — i.e. the cartoon-shadow depth
treatment the D2/D14 lanes want restored as the global hover/depth idiom. The hero already
dogfoods it correctly. **No work for this lane** beyond noting the hero is the reference
consumer; the D2/D14 cartoon-shadow restoration should mirror this exact idiom, not invent
a new one. **Disposition: RECORD (already-SOTA), cross-link D2/D14.**

### F3 — Hero positioning is a fixed `mt-28`/`h-0`/`w-screen` overlay, not optically centred
EditorStartScreen.vue:3 parks the hero top-left with a hard `mt-28` (112px) and `h-0`. It
works at the current 86px but at the mega rung the taller 2-line block + the optical-balance
work-area tokens (`--work-area-top-offset`, style.css:108) are NOT consulted — the hero
ignores the demo's own optical-centre system that everything else honors.
- **Gestalt fix:** anchor the hero block to the same `--work-area-top-offset` rhythm (or a
  φ-derived top inset) rather than a raw `mt-28`, so the LARGER hero stays optically placed
  across viewports and mobile (ties into D10 mobile + the page-as-background composition).
- **Disposition: MEASURE-FIRST** (verify mega placement at 1440 / 390 / 768 before
  re-anchoring); **BOOK to the D10 mobile lane** for the affixed-dock single-page layout.

---

## φ-ladder usage across ALL demo text (the chronic leaf-tail re-audit)

I grepped all demo `*.vue`/`*.css` (excluding `/dist/` build artifacts + Monaco) for raw
`text-{xs..9xl}`, `text-[…]`, and literal `font-size:`. **The ladder is overwhelmingly
clean** — C.W2's "267 raw rungs retired, sweep=0" (C/PROGRESS.md:45) has held through G.
Residual raw sizes (the new leaf-tail to sweep in H):

| # | site | raw value | verdict |
|---|---|---|---|
| L1 | `demo/@/components/custom/animation-controls/AnimationMenuBar.vue:102` | `text-xl` (play/pause glyph) | **SHIP-in-H** — re-rung to a φ class (or `.icon`-sized). It's a control glyph, but it's a raw Tailwind rung in source — the exact pattern the sweep forbids. |
| L2 | `demo/motion-path/MotionPathTarget.vue:119` | `font-size: 1.25rem` | **SHIP-in-H** — route to `--type-prose` (1.125rem) or `--type-subheading` (1.272rem ≈ 1.25rem, the √φ rung it's eyeballing). Note: D8 questions whether the motion-path scene survives hardening at all — gate behind that. |
| L3 | `demo/@/components/ui/menubar/MenubarLabel.vue:10` | `text-sm` | **RECORD / KILL-candidate** — shadcn-vue vendored primitive; if unused (menubar is legacy), delete with the component. Not a hand-authored demo rung. |
| L4 | `demo/@/components/custom/EasingCurveCanvas.vue:343` | `font-size: 0.055px` | **NOT A DEFECT** — SVG user-space unit inside a normalized `viewBox`, not a screen rung. Leave. |
| L5 | `demo/app/scenes/SquareScene.vue:54` | `font-size: var(--type-body)` | **ALREADY-SOTA** — it's a φ token, listed only to show the grep is exhaustive. |

The display/heading/prose registers across the surviving scenes are correctly rung:
`text-heading` (EasingTarget:8, MotionPathTarget:6, SequenceTarget:7, SpringTarget:7,
StartingStyleTarget:11), `text-title` (StartingStyleTarget:25, EditorStartScreen:22),
`text-subheading` (App.vue:133, dialogs), `text-display-2` (CubeTarget:75). **Disposition
for the ladder as a whole: ALREADY-SOTA; the only open leaf-tail is L1+L2 (SHIP-in-H).**

---

## `--font-display` / Instrument Serif substrate — ALREADY-SOTA

`style.css:39-87` maps `--font-display` → Instrument Serif with a Capsize metric-matched
`"Instrument Serif Fallback"` (`size-adjust 105.93%`, ascent/descent overrides) so the LCP
hero lands in its FINAL box from first paint (zero inter-swap CLS, E.W11.S5). Bumping the
hero to display-mega does NOT disturb this — the fallback geometry scales with the rung. No
work; record as exemplary, and **verify CLS still ≈0 at the mega rung** (the larger box
makes any residual shift more visible — proof gate below).

---

## Falsifiable instruments for H to gate

1. **`proof:hero-rung`** — assert the hero `<h1>` computed `font-size` ≥ `--type-display-mega`
   resolved at the test viewport (e.g. ≥170px @1440), and that its class is a φ
   `text-display-*` rung (regex: no `text-\d?xl`). Locks D7's "LARGER + golden".
2. **`proof:phi-sweep`** — grep gate over `demo/**/*.{vue,css}` (excl. `/dist/`, ui/ vendored,
   `.svg` viewBox contexts) for `text-(xs|sm|base|lg|xl|\dxl)` and bare `font-size:\s*\d`;
   expected hits = 0 after L1/L2 swept. Re-arms the C.W2 sweep so the leaf-tail can't regrow.
3. **`proof:hero-balance`** — visual lock: the hero renders as a BALANCED ≤2-line run with
   the `...` ellipsis on the SAME optical block (no orphaned ellipsis row); screenshot diff
   at 1440 + 390.
4. **`proof:hero-cls`** — Lighthouse/`web-vitals` CLS contribution of the `<h1>` LCP node
   ≈ 0 after the mega bump (the Capsize fallback still neutralizes the swap).

---

## Disposition summary

| ID | Finding | Anchor | Disposition |
|---|---|---|---|
| D7-main | Hero on middle rung (display-4, 86px); bump to `text-display-mega` (177px), keep `balance`; opt. scoped `line-height:0.92` | EditorStartScreen.vue:6; typography.css:201-210,116-120 | **SHIP-in-H** |
| D7-not.hero | Do NOT use `.text-hero` (nowrap, single-token poster) | typography.css:171-188 | RECORD (guard) |
| F1 | `...` ellipsis fragments the hero block; fold into one run | EditorStartScreen.vue:15-20; live `hero-home-1440.png` | **SHIP-in-H** · coord D6 |
| F2 | `depth-text` = cartoon-shadow text idiom, hero already dogfoods | EditorStartScreen.vue:10,17; utilities.css:231-246 | RECORD · cross-ref D2/D14 |
| F3 | Hero uses raw `mt-28` not the optical-balance tokens | EditorStartScreen.vue:3; style.css:108 | MEASURE-FIRST · BOOK→D10 |
| L1 | `text-xl` raw rung | AnimationMenuBar.vue:102 | **SHIP-in-H** |
| L2 | `font-size: 1.25rem` raw | MotionPathTarget.vue:119 | **SHIP-in-H** (gate behind D8 survival) |
| L3 | `text-sm` in vendored MenubarLabel | ui/menubar/MenubarLabel.vue:10 | RECORD / KILL-candidate |
| L4 | `0.055px` SVG viewBox unit | EasingCurveCanvas.vue:343 | NOT-A-DEFECT |
| sub | `--font-display` Capsize fallback substrate | style.css:39-87 | ALREADY-SOTA |
| sub | φ-ladder adoption across surviving scenes | grep, multiple | ALREADY-SOTA |

**No glass-ui handoff required for this lane** — every rung the hero needs (display-mega/
hero/audacious, `.text-display-*`) already ships in `@mkbabb/glass-ui` typography.css and
is compiled/available (probed live). D7 is pure consumer-side adoption inside kf.
