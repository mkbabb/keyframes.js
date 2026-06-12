# K-audit — Styling / Typography SYSTEM (the font-voice authority)

Lane: the styling/typography SYSTEM (`demo/@/styles/{style,design-idioms,brand}.css`
+ the φ-ladder + the glass-ui token bridge). The question the orchestrator
posed: **is there ONE font-voice authority?** Where do the three voices (display
serif / mono data / sans body) each come from, and **why can a dock render sans
(U-K6)?** Plus token hygiene, dead styles, and the grid-line opacity token
(U-K20).

DOCS ONLY — no source/test/gate/CI edited. Every claim cites file:line, a
command + observed output (against the **built dist**, `dist/gh-pages`, built Jun
11 23:39), or a screenshot. Re-runnable harness:
`docs/tranches/K/audit/k-typo-system-probe.mjs`
(`KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui KF_REQUIRE_BROWSER=1 node …`).

This lane is the SYSTEM/authority view; the prior `live-typography-truth.md`
lane owns the per-site live census (the dock split, the Play/Reverse mismatch,
the U-K9 wrap). I VERIFY and EXTEND it: I root the split at the **token-authority
layer** (two display tokens, not one) and add the live-dist proof of the
`.font-display` trap, the grid-opacity token home, and the token-hygiene sweep.

---

## §0 The answer up front

**There is NOT one font-voice authority. There are THREE voices but FOUR family
tokens — and the display voice has TWO redundant authorities.**

| Voice | Intended face | Token(s) the demo actually consumes | Authority? |
|---|---|---|---|
| **Display** | Instrument Serif | `--font-serif` AND `--font-display` (both = Instrument Serif) | **SPLIT — two tokens, one face** |
| **Mono / data** | Fira Code | `--font-mono` | ✅ single |
| **Sans / body** | native UI sans | `--font-text` / `--font-sans` / `--font-stack-text` (the demo reclaim) | ✅ single (reclaim wins) |

The `--font-serif` ≡ `--font-display` redundancy is the root of *why nobody can
say which token is "the display voice"* — and it is the seam the dock split and
the Play/Reverse mismatch both descend from. The total-suffusion root-fix
(below) is to **collapse the display voice to ONE token** and **bind the dock
band to it**.

Live proof (`k-typo-system-probe.mjs`, 1440×900, built dist):
```
--font-display : "Instrument Serif", "Instrument Serif Fallback", Georgia, serif
--font-serif   : "Instrument Serif", "Instrument Serif Fallback", Georgia, serif
font-serif === font-display ?  true
```

---

## §1 Where the three voices come from (the token chain, verified)

**Demo `@theme` (style.css:39-65)** declares the demo's identity faces — these
emit to `:root` AFTER glass-ui's `@theme inline`, so they win (last-wins,
confirmed in dist):
- `style.css:40` — `--font-serif: "Instrument Serif", … Georgia, serif`
- `style.css:53` — `--font-display: "Instrument Serif", … Georgia, serif`  ← **same value as `--font-serif`**
- `style.css:54` — `--font-mono: "Fira Code", monospace`
- `style.css:60-61` — `--font-sans: ui-sans-serif, system-ui, …`

**Demo `:root` reclaim (style.css:113-117)** overrides the glass-ui body register
off "Plus Jakarta Sans" to native sans:
```
--font-stack-text: ui-sans-serif, system-ui, …   (style.css:113)
--font-text:  var(--font-stack-text)              (style.css:116)
--font-sans:  var(--font-stack-text)              (style.css:117)
```
Verified the reclaim wins (dist `index-BFS8FWWM.css`):
```
$ grep -oE "--font-stack-text:[^;]*;" dist/gh-pages/assets/index-BFS8FWWM.css
--font-stack-text:"Plus Jakarta Sans", …;                ← glass-ui (loses)
--font-stack-text:ui-sans-serif, system-ui, …;            ← demo reclaim (wins, later)
```
Probe (`k-typo-system-probe.mjs`): `--font-text` resolves to the native sans. ✅

**glass-ui's φ-ladder (`@mkbabb/glass-ui/dist/styles/typography.css`, v3.11.2)**
binds font-family PER RUNG — this is where the voice is ASSIGNED to a class:
- `text-display`/`-2…-5`/`-mega`/`-hero`/`-audacious` (lines 142-238) → `var(--font-display)` → **DISPLAY** ✅
- `text-title` (251), `text-heading` (260), `text-subheading` (268), **`dock-label` (283)**, `text-body`/`-prose`/`-small`/`-caption` → `var(--font-text)` → **SANS**
- `text-admin-label`/`text-mono-*`/`fira-code` → `var(--font-mono)` → **MONO**

So the φ-ladder **bifurcates the family at `text-display`**: only the eight
`text-display-*` rungs get the serif; every "title/heading/subheading/dock-label"
rung falls to the body sans. This is glass-ui's contract, not a demo bug — but it
is the mechanism that makes the dock render sans (§2).

---

## §2 [P1] U-K6 / U-K8 — why a dock can render sans (the root mechanism)

**Root:** glass-ui `typography.css:283` — `@utility dock-label { font-family:
var(--font-text); … }`. `--font-text` is the demo's reclaimed native **sans**.
There is NO demo override of `.dock-label`'s family and NO glass-ui dock
font-family knob (grep of `node_modules/@mkbabb/glass-ui/dist/styles/dock*`
exposes only `--dock-label-size`, not a family token). So **every `.dock-label`
falls through to native sans.**

The demo overrides exactly ONE dock site to the display voice —
`ChromeDock.vue:299-305` `.dock-scene-title { font-family: var(--font-display) }`
(the COLLAPSED scene pill). Every OTHER dock site carries `.dock-label`
(`ChromeDock.vue:206,232` top-dock triggers; the bottom TransportDock animation
labels) and renders **sans**. Hence the SPLIT the user named:

Live screenshot `screenshots-k/k-typo-hero-desktop.png` + the prior lane's
`screenshots-k/cube-dock-closed.png`: the collapsed pill ("Home"/"Cube") is
serif, the transport labels ("Rotations") are sans — two voices in one band.

**The seam is the dual-token redundancy, not six call sites.** Because the dock
band SHOULD be the display voice (U-K6) and `.dock-scene-title` already proves
the pattern, the root-fix is ONE demo-side `@layer` rule binding the dock band to
the (single) display token — the prior lane proved it live
(`root-fix-probe.mjs`: `.dock-label{font-family:var(--font-display)}` flips all
six sites; controls-pane mono + body prose untouched). I CONFIRM that mechanism
and add: **fold the `--font-serif`/`--font-display` collapse (§4) into the same
edit so the dock binds the ONE display authority, not one of two aliases.**

---

## §3 [P1] The display voice has TWO redundant token authorities (the SYSTEM defect)

This is the system-level finding the per-site lane did not name. Two
demo-`@theme` tokens carry the IDENTICAL Instrument-Serif value and are consumed
at DIFFERENT sites with no rule for which is "the display voice":

| Token | Defined | Consumed at | Voice |
|---|---|---|---|
| `--font-display` | `style.css:53` | φ-ladder `text-display-*` (glass-ui), `ChromeDock.vue:300` `.dock-scene-title`, `AssetViewport.vue:52` default | DISPLAY |
| `--font-serif` | `style.css:40` | `playback-button.css:22` `.btn-playback`, `tab-trigger.css:28` `.tab-trigger-base` | DISPLAY |

```
$ grep -rn "var(--font-serif" demo/ --include="*.vue" --include="*.css" | grep -v dist
playback-button.css:22:    font-family: var(--font-serif);
tab-trigger.css:28:    font-family: var(--font-serif);
```

Consequences that surface as live defects:
- **The transport buttons split (U-K10).** `.btn-playback` (Play/Pause) wears
  `--font-serif`; the sibling "Reverse" in the SAME `grid-cols-2` row wears
  `text-body` (sans). Two faces, one row (prior lane §3, screenshot
  `cube-dock-closed.png`). Because the play button reaches the display voice
  through `--font-serif` (a DIFFERENT token than the dock's `--font-display`), a
  future "make the dock display" edit that touches only `--font-display` would
  leave the transport buttons on the OTHER alias — the split would persist
  silently. **One display token would make this impossible.**
- **The tabs are serif (U-K12).** `.tab-trigger-base` (the top tabs the user
  calls "awful") is `--font-serif` at `--type-prose` (1.125rem). Whether tabs
  *should* be display is a design call (U-K12 favors pills/dock-dropdown), but
  the FACT that they reach serif via `--font-serif` while the dock reaches it via
  `--font-display` is the same dual-authority incoherence.

**Why glass-ui's own `--font-serif` does not save us:** glass-ui `theme.css:167`
defines `--font-serif: var(--font-stack-text)` (= Plus Jakarta) — so if the demo
ever DROPPED its `style.css:40` reclaim, `.btn-playback`/`.tab-trigger-base`
would silently fall to the brand sans, not the display serif. The demo carries
`--font-serif` ONLY to shadow glass-ui's; it is pure redundancy with
`--font-display`.

**Root-fix:** pick ONE display token (recommend `--font-display`, the φ-ladder's
own name) and alias the other to it — `--font-serif: var(--font-display)` — OR
repoint the two `--font-serif` call sites to `--font-display` and delete the
`style.css:40` reclaim. Either way the display voice becomes **single-sourced**,
and the dock-binding rule (§2) + the transport/tab decision (§4) all consume that
ONE token. This is the "ONE font-voice authority" the lane was asked to find:
today it does not exist; the fix is one token-collapse.

---

## §4 [P2] U-K6 stale-comment liability — the @theme block lies about the build

`style.css:41-44` (inside the `--font-serif` `@theme` comment) asserts:
> "Display voice for the glass-ui phi-ladder: text-display, **text-title,
> text-heading, text-subheading and dock-label all resolve var(--font-display)**
> (which would otherwise fall to glass-ui's default **Fraunces**…)."

This is **false on three counts**, verified against typography.css v3.11.2:
1. `text-title`/`text-heading`/`text-subheading`/`dock-label` bind `var(--font-text)`
   (lines 251/260/268/283), **NOT** `var(--font-display)`. Only `text-display-*`
   binds display.
2. glass-ui's display default is "Plus Jakarta Sans" (`tokens.css:51-52`,
   `--font-stack-display: var(--font-stack-text)`), **not Fraunces**.
3. The census (prior lane §1) proves `text-heading` renders SANS in the live
   build.

The comment encodes a belief the build does not honor; it has actively MASKED
U-K6/U-K8 (a reader trusting it would think the dock is already display).
**Delete/repair it beside the §3 token-collapse** so the comment matches the
build.

---

## §5 [P2] U-K6 latent trap — `.font-display` utility resolves to SANS (proven live)

glass-ui ships a `.font-display` UTILITY that does NOT read `--font-display`:
```
$ grep -roE "\.font-display\{[^}]*\}" node_modules/@mkbabb/glass-ui/dist/styles/*.css
components.css:.font-display{font-family:var(--font-stack-display)}
```
And `--font-stack-display` is **not** overridden by the demo, so it resolves to
the native sans. Live proof (`k-typo-system-probe.mjs`):
```
font-stack-display (the .font-display utility target):
  ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, …
```
So a bare `class="font-display"` would render **sans**, the exact opposite of its
name — a trap that has already bitten the demo's mental model (the §4 comment).
The demo does NOT currently use bare `.font-display`
(`grep '"…\bfont-display\b'` over `demo/` → no hits beyond `text-display`/
`--font-display`), so it is **latent**. Close it for free in the §3 collapse by
adding `--font-stack-display: var(--font-display)` to the `:root` reclaim (one
line) — then the utility, the φ-ladder, and the dock all agree.

---

## §6 Token hygiene — CLEAN (no dead demo-owned tokens)

Swept every demo-owned token in `style.css` + `design-idioms.css` for `var()`
consumers (excluding self-definitions). **All resolve to ≥1 real consumer** — no
dead tokens:

| Token | consumers | Token | consumers |
|---|---|---|---|
| `--rail-width` | 6 | `--rainbow-cyan` | 5 |
| `--mask-fade` | 10 | `--dropdown-min-width` | 3 |
| `--panel-max-h` | 3 | `--dock-panel-width` | 3 |
| `--spring-snappy` | 2 | `--color-slider-track` | 2 (PlaybackRibbon.vue:157-158) |
| `--subject-teal` | 2 | `--start-hero-band` | 2 |
| `--scale-hover` | 2 | `--axis-w` | 1 (MatrixEditor.vue:156) |
| `--header-items-max-w` | 1 (EditorHeader.vue:92) | `--controls-idle-opacity` | 1 |
| `--caret-offset` | 1 | `--resize-handle-inset` | 1 |

The `*-stable` mobile chain (`--dock-band-reserve-stable` →
`--work-area-max-height-stable` → `--work-area-vertical-slack-stable` →
`--dock-top-anchor-stable` → `--dock-top-band-reserve-stable`) terminates at a
real consumer (`AnimationControlsGroup.vue:400`
`padding-block: var(--dock-top-band-reserve-stable)`) — the intermediates are
live, not orphans.

**Dead-style sweep:** `design-idioms.css` documents FOUR deletions in-comment
(`.scale-on-hover` H.W2.S4, `.gold-shimmer` J.W7b, `.dock-inset` H.W10.S5, the
specular subsystem H.W9) — verified each is a *documented deletion note*, not a
live duplicate (no orphan rule beside its replacement). The no-legacy discipline
holds. The ONE raw font-family declaration in the demo
(`style.css:88` `@font-face "Instrument Serif Fallback"`) is the deliberate
metric-matched CLS fallback, not a stray. The font-SIZE ladder is also clean:
the only off-`--type-*` `font-size:` in source is `EasingCurveCanvas.vue:380`
`0.055px` (SVG viewBox units, legitimate) and `style.css:407` `.icon --size`
(a sizing token). No raw UI font-size literals.

---

## §7 [P2] U-K20 — the grid-line opacity token (single-sourced, ready to tune)

The hero/page substrate is the two-tier engineering graph paper drawn by
`EditorShell.vue:202-224` `.grid-background`, reading FOUR demo-owned tokens from
`design-idioms.css:180-184`:
```
--graph-pitch: 1rem;            /* fine line pitch */
--graph-major: 5rem;            /* major line pitch */
--graph-opacity: 5%;            /* fine line strength */
--graph-major-opacity: 12%;     /* major line strength */
```
Live-resolved (`k-typo-system-probe.mjs`): `--graph-opacity: 5%`,
`--graph-major-opacity: 12%`. The lines `color-mix` over `--foreground`
(`EditorShell.vue:203-212`), so dark mode retints for free.

The user's "grid lines slightly less opaque" (U-K20) is a **single-token tune**:
lower `--graph-opacity` (5%→~3-4%) and/or `--graph-major-opacity` (12%→~8-9%) at
`design-idioms.css:182-183`. ONE decision, ONE home, no per-site patch.

**Caveat for the implementing wave:** the in-comment history
(`design-idioms.css:182-183` + `EditorShell.vue:196-200`) records that
`--graph-major-opacity: 12%` was *deliberately raised above* a former 0.10α
"near-invisible" floor to satisfy a substrate-legibility gate
(`§Hard-gate clause-g`). Lowering it re-approaches that floor — the wave must
re-check that gate, not just the user's eye. (The FourierField REMOVAL half of
U-K20 — `EditorStartScreen.vue:78-96` — is the hero/scene lane's seam, not this
typography lane; recorded for the fold.)

---

## §8 What is ALREADY correct (do not "fix")

- **The body reclaim works** — `--font-text`/`--font-sans`/`--font-stack-text`
  resolve native sans in the dist; "Plus Jakarta Sans" never lands (§1, live
  probe). The mono voice (`--font-mono` = Fira Code) is single and coherent.
- **The hero is coherent** (`k-typo-hero-desktop.png` + probe census): the
  display title "Select an animation…" is Instrument Serif; the prose subtitles
  (`text-heading`/`text-subheading`) are sans (correct body voice); the
  scene-card numbers (`text-display-2`) are display. No voice defect in the hero.
- **The φ-SIZE ladder is single-sourced** from glass-ui's `--type-*` (8×
  `--type-body`, 6× `--type-small`/`-caption`, etc.) — no raw UI font-size
  literals in the demo. Size hygiene is clean; the defect is the FAMILY token
  redundancy, not size.
- **Token hygiene + dead-style discipline** hold (§6).

---

## §9 The root-fix seam for TOTAL suffusion (the lane's ask)

The user asked for the "root-fix seam for total suffusion." It is a **single
edit cluster in the demo's two style files**, no per-site patching:

1. **Collapse the display voice to ONE token** (§3): `--font-serif:
   var(--font-display)` in `style.css` (or repoint the 2 `--font-serif` sites to
   `--font-display` + delete the reclaim). → one display authority.
2. **Bind the dock band to it** (§2): one `@layer` rule
   `.dock-label { font-family: var(--font-display) }` in `style.css` (proven live
   by the prior lane's `root-fix-probe.mjs`). → all 6 dock sites display, zero
   call-site churn.
3. **Decide the transport/tab register** (§3/U-K10/U-K12) against that ONE token
   so Play/Reverse and the tabs MATCH (today Play=serif, Reverse=sans).
4. **Close the `.font-display` trap** (§5): `--font-stack-display:
   var(--font-display)` in the `:root` reclaim. → utility, ladder, dock all agree.
5. **Delete/repair the false `style.css:41-44` comment** (§4) in the same edit.

All five land in `style.css` (+ the existing `--font-display` in `@theme`). After
them, there is exactly ONE display token, ONE mono token, ONE body token — the
"ONE font-voice authority" — and the dock is suffused by construction.

---

## §FOLD

| Finding | Sev | The seam | Suggested wave-class |
|---|---|---|---|
| **No single display-voice authority — `--font-serif` ≡ `--font-display` (both Instrument Serif) consumed at different sites; no rule which is "the display voice."** `font-serif === font-display → true` (live). This is the SYSTEM root the dock split + Play/Reverse mismatch + serif tabs all descend from. | **P1** | `style.css:40` (`--font-serif`) vs `:53` (`--font-display`); 2 serif sites (`playback-button.css:22`, `tab-trigger.css:28`) vs the φ-ladder + `ChromeDock.vue:300`. Collapse to ONE token: `--font-serif: var(--font-display)`. | **Typography-root** — one token-collapse in `style.css`, then everything binds the single authority |
| U-K6/U-K8 — dock renders SANS: `.dock-label` (6 sites) binds `var(--font-text)`; demo overrides only `.dock-scene-title`. The dock band wants the display voice. | **P1** | glass-ui `typography.css:283` `dock-label{font-family:var(--font-text)}`; no demo override. One `@layer` rule `.dock-label{font-family:var(--font-display)}` (proven live, prior lane `root-fix-probe.mjs`). Fold into the §3 collapse so it binds the SINGLE display token. | **Typography-root** — one demo-side rule, one place |
| U-K10 — Play (`--font-serif` via `.btn-playback`) vs Reverse (`text-body` sans) in the same `grid-cols-2` row; the split persists across a `--font-display`-only edit because Play reaches display via the OTHER alias. | **P1** | `playback-button.css:22` `var(--font-serif)` vs `PlaybackRibbon.vue:42` `text-body`. Decide ONE transport voice against the single display token. | **Typography-root** — fold into the dock-voice pass |
| `style.css:41-44` comment FALSELY claims text-title/heading/subheading/dock-label resolve `--font-display` + names "Fraunces" (glass-ui default is Plus Jakarta). Masked U-K6/U-K8. | **P2** | `demo/@/styles/style.css:41-44` — delete/repair beside the §3 edit so the comment matches the build (verified vs typography.css v3.11.2). | **Typography-root** — same edit |
| `.font-display` utility resolves `--font-stack-display` (native SANS), opposite its name — latent trap (proven live; demo uses no bare `.font-display` yet). | **P2** | glass-ui `components.css` `.font-display{font-family:var(--font-stack-display)}`; demo never overrides `--font-stack-display`. Add `--font-stack-display: var(--font-display)` to the `:root` reclaim (one line). | **Typography-root** — one token line |
| U-K20 — grid-line opacity tune. `--graph-opacity: 5%` / `--graph-major-opacity: 12%` are single-sourced + live-tunable; lowering re-approaches the former 0.10α legibility floor (gated). | **P2** | `design-idioms.css:182-183`; re-check `§Hard-gate clause-g` substrate-legibility gate on the change. (FourierField removal is the hero-lane seam, not this lane.) | **Visual-refine** — one/two token values, re-verify the legibility gate |
| Token hygiene + dead-style discipline — CLEAN. No dead demo-owned tokens; the 4 documented deletions are notes not live duplicates; size ladder single-sourced. | **(none)** | — | — (recorded as a no-op confirmation) |
