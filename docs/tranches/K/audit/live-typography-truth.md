# K-audit — Live Typography Truth (U-K6 / U-K8 / U-K9 / U-K10)

Lane: the global font truth. Computed-font census over the **BUILT dist**
(`dist/gh-pages`, built Jun 11 23:39) across all 8 scenes + docks + panes,
desktop (1440×900) and mobile (390×844 + touch), via
`scripts/lib/demo-driver.mjs` `withPage`. Every claim cites file:line, a
command + observed output, or a screenshot.

DOCS ONLY — no source/test/gate/CI edited. The runtime `.dock-label` root-fix
in §4 was injected at runtime *only* to PROVE the seam; the dist on disk is
unchanged.

Evidence harness (re-runnable):
- `docs/tranches/K/audit/font-census.mjs` → `font-census-raw.json` (19 scene/state passes)
- `docs/tranches/K/audit/reduce.mjs` (per-land voice dump)
- `docs/tranches/K/audit/wrap-probe.mjs` (≥2-line wrap detector)
- `docs/tranches/K/audit/root-fix-probe.mjs` (the single-rule root-fix proof)
- `docs/tranches/K/audit/screenshots-k/` (home/cube docks, before+after)

Run: `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui KF_REQUIRE_BROWSER=1 node docs/tranches/K/audit/font-census.mjs`

---

## §0 The design intent (3 voices) and the token chain

Per `demo/DESIGN.md` + `demo/@/styles/style.css:40-61`, the demo's identity is:

| Voice | Face | Token | Intent |
|---|---|---|---|
| **Display** | Instrument Serif | `--font-display` / `--font-serif` | hero, scene/pane titles, dock |
| **Mono / data** | Fira Code | `--font-mono` | control field labels, Monaco CSS, metric readouts |
| **Sans / body** | native UI sans | `--font-text` / `--font-sans` / `--font-stack-text` | prose, segmented tabs, preset names, generic buttons |

**The token chain (verified):**
- `demo/@/styles/style.css:53` — `@theme --font-display: "Instrument Serif", …` (the demo's reclaim).
- `demo/@/styles/style.css:113-117` — `:root` reclaims `--font-stack-text`/`--font-text`/`--font-sans` to native sans (off glass-ui's Plus Jakarta brand).
- glass-ui `tokens.css`: `--font-stack-display: var(--font-stack-text)` — **display defaults to the TEXT stack**; `theme.css`: `--font-display: var(--font-stack-display)`.
- glass-ui `typography.css`: the φ-ladder `@utility` rules bind font-family per rung:
  - `text-display`/`-2`/`-3`/`-4`/`-5`/`-mega`/`-hero`/`-audacious` → **`var(--font-display)`** (lines 141-245) ✅ these get Instrument Serif.
  - `text-title` (251), `text-heading` (259), `text-subheading` (267), **`dock-label` (283)**, `text-body`, `text-prose`, `text-small`, `text-caption` → **`var(--font-text)`** = native sans.
  - `text-admin-label`/`text-mono-*`/`fira-code` → `var(--font-mono)`.
  - `.font-display` UTILITY → `var(--font-stack-display)` (components.css), which the demo does **not** override → would resolve native sans, NOT Instrument Serif (a latent trap if anyone uses bare `.font-display`).

---

## §1 The census result (the global truth)

Voice histogram by land (`reduce.mjs` over 19 passes — every visible text leaf):

```
CONTROLS-PANE  DISPLAY 30   MONO 694   SANS 33
DOCK           DISPLAY 31              SANS 21
HERO           DISPLAY 12
SPRING         DISPLAY 3    MONO 24    SANS 6
STAGE          DISPLAY 27   MONO 69    SANS 13
```

The MONO mass in CONTROLS-PANE is the Monaco CSS editor + field labels
(`labeled-field-label text-mono-small`) + metric badges — the **data voice,
coherent**. The SANS sites in CONTROLS-PANE/STAGE are segmented tabs, preset
names ("smooth/snappy/bouncy/gentle"), and descriptive prose — the **body
voice, coherent**. The display sites are titles + hero — **coherent**.

**The DOCK split is the defect:** 31 DISPLAY vs 21 SANS in the SAME band.

---

## §2 [P1] U-K6 / U-K8 — the dock has a SPLIT voice (root: glass-ui `dock-label` binds `--font-text`)

The dock renders TWO voices side-by-side. Unique dock sites (`reduce.mjs`):

| Site | Class | Voice | Verdict |
|---|---|---|---|
| Collapsed scene pill ("Cube", "Easing", "Home") | `.dock-scene-title` | **DISPLAY** (Instrument Serif) | ✅ overridden in `ChromeDock.vue:299-305` |
| Top-dock scene-select trigger | `.dock-label` (`ChromeDock.vue:232`) | **SANS** | ✗ |
| Top-dock controls-tab trigger | `.dock-label` (`ChromeDock.vue:206`) | **SANS** | ✗ |
| Bottom transport animation label ("Rotations", "Transform", "Easing Preview", "Spring Preview", "Sequence Preview", "Path traversal") | `.dock-label` (`TransportDock.vue:94,153`) | **SANS** | ✗ |
| Bottom-dock "Timeline" label | `.dock-label` (`TransportDock.vue:147`) | **SANS** | ✗ |

Observed (`font-census-raw.json`, cube@desktop-closed):
```
DISPLAY(Instrument Serif) 25.888px w600  <span class="dock-scene-title …"> "Cube"
SANS(native)              20.352px w400  <span class="text-ellipsis"> "Rotations"
```
Screenshot `screenshots-k/cube-dock-closed.png`: top pill "Cube" is serif; the
bottom dock "Rotations" is plain sans — the split is visible in one frame.

**Root cause (single seam):** glass-ui `typography.css:283` — `@utility
dock-label { font-family: var(--font-text); … }`. There is **no** demo override
and **no** glass-ui font-family knob for the dock (grep of
`node_modules/@mkbabb/glass-ui/dist/styles/dock*` shows only `--dock-label-size`,
not a family token). So every `.dock-label` falls through to the demo's
reclaimed native sans. The user wants the dock in the display voice; the fix is
**one rule, not 6 call-site patches**.

**Stale-comment liability:** `demo/@/styles/style.css:41-44` asserts
"text-title, text-heading, text-subheading **and dock-label** all resolve
var(--font-display) (which would otherwise fall to glass-ui's default
**Fraunces**…)". This is **false on all counts** — those four classes bind
`var(--font-text)` (typography.css:251/259/267/283), glass-ui's display default
is Plus Jakarta not Fraunces, and the census proves `text-heading` → SANS (§3).
The comment encodes a belief the build does not honor; it has masked U-K6/U-K8.

---

## §3 [P1] U-K10 — adjacent-sibling voice inconsistency (Play=serif, Reverse=sans)

The PlaybackRibbon's 2-column transport row renders its two buttons in
DIFFERENT voices. Observed (`font-census-raw.json`):
```
DISPLAY(Instrument Serif) 14px w500  "Play"     (.btn-playback)
SANS(native)              14px w500  "Reverse"  (text-body btn-interactive)
DISPLAY(Instrument Serif) 14px w500  "Pause"
```
Root: `PlaybackRibbon.vue:24` Play = `.btn-playback` → `playback-button.css:22`
`font-family: var(--font-serif)` (Instrument Serif); `PlaybackRibbon.vue:42`
Reverse = `'text-body btn-interactive'` → body sans. Two transport controls in
one `grid-cols-2` row (line 22), two faces. Visible in
`screenshots-k/cube-dock-closed.png` ("Play" italic-serif vs "Reverse" sans).

This is also the seam to DECIDE the intent: `.btn-playback` carrying
`--font-serif` is itself questionable for a control surface (a serif verb on a
transport button). Either (a) make BOTH display, or (b) make BOTH the
control/body voice — but they must MATCH. Today they do not.

---

## §4 The ROOT fix is ONE seam (proven live)

`root-fix-probe.mjs` injected a single rule at runtime against the unmodified
dist and re-censused the cube dock:
```
BEFORE:  dock-select-trigger → SANS · dock-select-trigger → SANS ·
         dock-scene-title "Cube" → DISPLAY · dock-label "Rotations" → SANS
AFTER  .dock-label{font-family:var(--font-display)}:
         dock-select-trigger → DISPLAY · dock-select-trigger → DISPLAY ·
         dock-scene-title "Cube" → DISPLAY · dock-label "Rotations" → DISPLAY
```
Screenshot `screenshots-k/cube-dock-AFTER-root-fix.png`: bottom "Rotations" now
matches top "Cube" in Instrument Serif — the dock is one voice. ONE demo-side
rule (`@layer` over glass-ui, in `style.css`) flips all 6 sites; the
controls-pane mono labels and body prose are untouched (the rule only matches
`.dock-label`). This is the "fix at the ROOT, one token seam, not per-site
patches" the user asked for. (Same fix should also re-decide §3 so the dock band
+ transport buttons share ONE display voice.) **Also delete/repair the false
`style.css:41-44` comment** as part of the same change.

---

## §5 [P2] U-K9 — the wrapped line that should be one line

The home start-screen subtitle wraps to 2 lines at mobile width. Observed
(`wrap-probe.mjs`, 390×844):
```
{"lines":2,"h":62,"lh":31,"w":342,"cls":"start-screen-prose text-heading w-full italic","ws":"normal","text":"from the list below, then press Play."}
```
Site: `EditorStartScreen.vue:54-57` —
`<h2 class="start-screen-prose text-heading w-full italic">{{ subtitle }} <List class="inline"/> {{ subtitleSuffix }}</h2>`
where `subtitle="Select an animation from the list"` and
`subtitleSuffix="below, then press Play."` (`EditorStartScreen.vue:133`). The
inline `<List>` glyph plus the suffix overflow the 342px line and break after
"then" → "press Play." orphans onto line 2. Visible in
`screenshots-k/home-mobile.png` ("from the list ☰ below, then" / "press Play.").

Note this is `text-heading` (SANS body voice) which is correct for prose; the
defect is the WRAP, not the voice. Fix is layout (a tighter clamp on the
subtitle font-size at phone width, or `text-wrap: balance`/`nowrap` budget on
this `<h2>`), not a font-family change. Owned by the layout/refinement lane
(U-K7), recorded here because the census surfaced it on the typography sweep.

---

## §6 What is ALREADY correct (do not "fix")

- The φ-ladder `text-display-*` rungs DO resolve Instrument Serif — hero
  "Select an animation…", `.text-pane-title` "SpringProgress", `text-display-2`
  scene-card numbers all census DISPLAY. The `@theme --font-display` reclaim
  works for those.
- Control field labels (duration/delay/iterations/direction/fill mode/easing/
  advanced) are MONO (`text-mono-small`) — the deliberate data voice matching
  the Monaco CSS panel. Coherent.
- Metric/readout badges, status badges, Monaco tokens → MONO. Coherent.
- Body prose, segmented tabs, preset names → native SANS. Coherent.

The system is NOT broadly inconsistent — the intent (3 voices) is largely
honored. The failures are localized: the dock band (split serif/sans) and the
transport buttons (Play serif / Reverse sans).

---

## §7 Adjacent fact (not this lane, recorded for the fleet)

glass-ui registry latest is **3.13.0**; the demo pins **`~3.11.2`** (installed
3.11.2) — `package.json` + `npm view @mkbabb/glass-ui version → 3.13.0`. If
U-K14 upgrades glass-ui, re-verify the `dock-label`/`text-heading` font-family
bindings did not change (the typography.css contract this audit rests on is the
3.11.2 copy at `node_modules/@mkbabb/glass-ui/dist/styles/typography.css`).

---

## §FOLD

| Finding | Sev | The seam | Suggested wave-class |
|---|---|---|---|
| U-K6/U-K8 — dock split voice: `.dock-label` (6 sites: 2 top-dock triggers, transport animation labels, "Timeline") render SANS while `.dock-scene-title` renders DISPLAY | **P1** | glass-ui `typography.css:283` `dock-label{font-family:var(--font-text)}`; no demo override. Single root rule `.dock-label{font-family:var(--font-display)}` in `style.css` flips all 6 (proven live, §4) | **Typography-root** — one demo-side `@layer` rule; one place |
| U-K10 — Play (serif via `.btn-playback`) vs Reverse (sans via `text-body`) in the same `grid-cols-2` ribbon row | **P1** | `playback-button.css:22` `var(--font-serif)` vs `PlaybackRibbon.vue:42` `text-body`; decide ONE voice for the transport band, fold with §4 | **Typography-root** — fold into the dock-voice pass |
| style.css:41-44 stale comment falsely claims text-title/heading/subheading/dock-label resolve `--font-display` + names Fraunces (gone) | **P1** | `demo/@/styles/style.css:41-44` — delete/repair beside the §4 fix so the comment matches the build | **Typography-root** — same edit |
| `.font-display` utility resolves `--font-stack-display` (native sans), NOT the reclaimed `--font-display` — latent trap | **P2** | glass-ui `components.css` `.font-display{font-family:var(--font-stack-display)}`; demo never overrides `--font-stack-display`. Add `--font-stack-display: var(--font-display)` to the `:root` reclaim to close it | **Typography-root** — one token line |
| U-K9 — home subtitle "…from the list ☰ below, then press Play." wraps to 2 lines at 390px (`text-heading`, voice is correct; the WRAP is the defect) | **P2** | `EditorStartScreen.vue:54-57` inline `<List>` + suffix overflow; layout (clamp/`text-wrap`), not font-family | **Layout-refine** (U-K7 sibling) |
| glass-ui pin `~3.11.2` vs registry 3.13.0 — re-verify typography bindings on upgrade | **P2** | `package.json`; cross-lane with U-K14 | **Dependency-upgrade** (U-K14) |
