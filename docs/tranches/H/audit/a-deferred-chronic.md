# Tranche H Deep Audit — Lane `a-deferred-chronic`

**Charge.** The CHRONICALLY-deferred items across A→G — the φ-ladder leaf-tail,
cartoon-shadow, the dock, the mobile composition, and the BOOKs carried
tranche-to-tranche. Each → a TERMINAL H disposition: fold into H (**KFH**) / **KILL** /
**OUT** / **CHRONIC-by-design**. **P-invariant (binding): no perpetual punt.** Surface
where the observed defects map to chronics (cartoon-shadow D2/D14, φ-typography D7,
mobile D10/D13, dock D5/D9).

**Spine (binding).** No quick fixes · no legacy beside its replacement · one-motion
replace · idiomatic glass-ui CONSUMPTION (inv-16) · MEASURE-FIRST for perf claims · cite
a `file:line` or live observation for EVERY claim · honest ALREADY-SOTA.

**Method.** This is the META lane over the deferred-ledger family
(`{C,D,E,F,G}/audit/*deferred*`, `{A,B,C}` grand-audits/asks). It does NOT re-derive the
mechanics that the sibling H lanes own (`a-cartoon-shadow`, `a-hero-typography`,
`a-mobile-architecture`, `a-scene-icons`, `a-modes-pertinence`, `a-glassmorphism-perf`).
It supplies the CHRONIC-HISTORY layer those lanes lack: how many tranches each item was
deferred, the exact mechanism by which it kept escaping closure, and the terminal H
disposition that breaks the perpetual-punt cycle. Every row cites a prior ledger row or a
live `file:line` on `tranche-h-dev`.

---

## TL;DR — the meta-finding (the spine of this lane)

> **G's FINAL declares the deferred ledger "CLEAN … no perpetual keyframes-owned punt
> survives"** (`G/FINAL.md:174-181`). **This is true only on a TECHNICALITY.** Every
> user-VISIBLE chronic the H audit just re-surfaced — cartoon-shadow depth (D2),
> φ-typography hero (D7), the mobile composition (D10), the dock (D5/D9) — was made to
> "exit the ledger" not by being SOLVED but by being **re-classified**: either (a) closed
> *at the issue-level* on one site while the *system-level* goal silently lapsed
> (cartoon-shadow, φ-ladder), or (b) re-tagged **glass-ui-HANDOFF / OUT** so it left the
> *keyframes-owned* column while remaining unsolved in the product (mobile occlusion,
> dock lag, dock double-click). **The P-invariant policed the COLUMN, not the PRODUCT.**

The honest correction for H: a chronic is not discharged when its *ledger row* finds a
terminal tag — it is discharged when the **user-observable defect** is gone or genuinely
owned by a live upstream tranche with a kf-side gate that fails until it lands. Four of
the user's D-defects are the *receipts* that four "closed" chronics were closed on paper.
This lane assigns each a terminal that closes the PRODUCT defect, with a falsifiable
visual/source gate so H cannot re-paper it.

**The pattern, named once (so H can gate against it):** the *phantom-owner re-defer* —
a wave declares itself "the home" for a deferred item, then ships the *sliver* and books
the *deep half* to a "next demo-touching wave" that the next tranche reclassifies as
out-of-scope. Tranche C's own audit named this exact anti-pattern
(`C/audit/lanes/deferred-ledger.md:47-59`: "W5.md PROMISED to close them … then FINAL
re-deferred them") and it recurred A→B→C→D→G for the SAME four design chronics.

---

## 1 · The chronic ledger — every carried design/frontend item, A→G, with its terminal

The columns: **tranches deferred** · the **escape mechanism** · the **live state on
`tranche-h-dev`** · the **terminal H disposition**. The four headline chronics map 1:1
onto the user's D-defects.

| # | Chronic | Deferred across | Escape mechanism (how it kept dodging closure) | Live state (`tranche-h-dev`) | H disposition |
|---|---|---|---|---|---|
| **CH-1 cartoon-shadow** (D2/D14) | A → B → C → (one-site) → **regressed by G's 3.x pin** | A named it off-token; B FINAL deferred "the CSSCodeEditor cartoon-shadow token"; **C.W2 closed it on ONE site** (`179019f`, `CSSCodeEditor.vue:6`, live) but never made it the panel register; a later glass-ui surface-default (`<Card surface="glass">` → `glass-specular-track`) silently took every panel with no ledger contradiction | cartoon-surface on EXACTLY 1 site (`grep -rn cartoon demo/ --include=*.vue` = `CSSCodeEditor.vue:6` only); panels carry the un-wired specular radial (sibling `a-cartoon-shadow §2` measured 13 tracks, 0 pointer-writes) | **KFH (SHIP).** Make cartoon the panel depth register via `surface="cartoon"`; the radial dies because the surface map stops emitting the class. Mechanics owned by `a-cartoon-shadow`; THIS lane's add is the **chronic-closure gate** (below) so it is the LAST time. |
| **CH-2 φ-ladder / hero typography** (D7) | A → B → C (display tier) → **leaf-tail BOOKed D.W2 "closed"** → G.W10 "swept" | A grand-audit BOOKed "hero φ-ladder → A demo-polish" (`A/audit/constellation-grand-audit:83`); C.W2 closed the DISPLAY tier (`179019f`); the **leaf-tail (128 body rungs)** BOOKed to D.W2 and marked "0 raw body rungs" (`D/PROGRESS.md:43`); G.W10 claims "leaf-tail F6 swept" (`G.WZ.md:83`) | **37 raw `text-sm/xs/base/…/8xl` occurrences survive** in `demo/{@,app,easing,spring,sequence,motion-path}` (`grep -no … = 37`, live); the hero (`EditorStartScreen.vue:6`) uses `text-display-4` — a MID rung, not a hero/mega rung — which is exactly D7's "must be LARGER, golden φ-ladder" | **KFH (SHIP).** Re-rung the hero to the top φ rung + finish the leaf-tail to a genuine 0. Mechanics owned by `a-hero-typography`; THIS lane supplies the **honest re-scope** (the "closed" claims at D.W2/G.W10 were sliver-closes) + the gate that makes "0 body rungs" *enforced*, not asserted. |
| **CH-3 mobile composition** (D10/D13) | A → B → C → D.W5 "**KFD-TERMINATED-2**" → G.W12 "**glass-ui-HANDOFF**" | The mobile chronic was always scoped DOWN to the *occlusion* sub-problem (dock-over-content), declared "KFD-TERMINATED-2" at D.W5 (`E/audit/deferred-ledger.md:160-168`), then the residual re-tagged glass-ui-HANDOFF at G.W12 (`G/FINAL.md:107-110`). **The user's D10 mobile goal — a single page with affixed top+bottom docks, the page contextually re-shaping by mode, the background BEING the live animation area — was NEVER SCOPED.** It is net-new product intent the ledger never had a row for; only "don't let the dock overlap content" was ever tracked | App.vue has essentially zero mobile composition (`grep isMobile\|@media\|md:\|sm: App.vue` = 1 hit, a dock label breakpoint, live); the affixed-dock contextual-bg architecture does not exist | **KFH (SCOPE + SHIP) — the chronic must be RE-FRAMED, not re-closed.** D10 is a genuine net-new architecture (owned by `a-mobile-architecture`); CH-3's contribution is the verdict that **the occlusion-termination did NOT discharge "perfect mobile"** — it discharged a different, smaller thing. The dock-occlusion *residual* stays glass-ui-HANDOFF (correct), but the COMPOSITION is kf-demo-owned and must get its own wave + gate, not inherit the "terminated" tag. |
| **CH-4 the dock** (D5/D9/D13) | B → C → D.W5 (rename) → G.W12 (rename landed) → **lag/popover STILL open** | The dock has been split into (a) a kf-demo *rename/barrel* chore — landed D.W5/G.W12 (`G/FINAL.md:107`) — and (b) the *behavioural* defects (double-click `f0b0ffb`, lag, occlusion) perpetually routed glass-ui-HANDOFF per the standing memory rule ("all dock changes in glass-ui, never patched in demo", `MEMORY.md`). The rename *closed in the kf column*; the LAG/popover-not-opening (D5/D9) never had a kf-side terminal because the rule forbade a kf fix | DockDropdownTrigger present (`App.vue:20`) but D5/D9 report it no longer opens; dock animations laggy | **glass-ui-HANDOFF (CORRECT) + KFH (a kf-side proof gate).** The behavioural fix is genuinely glass-ui's (the AW tranche is live — `G/FINAL.md` "its AW tranche is beginning"). But the chronic perpetuated because kf had **no instrument that fails while the dock is broken**. CH-4's add: a kf-side `demo-smoke` assertion (popover opens; no >1-frame lag on dock expand) that is BORN-RED and turns green only when the consumed glass-ui version fixes it — converting a silent HANDOFF into a *gated* one. |

---

## 2 · The escape mechanism, dissected (so the gate can target it)

The four chronics escaped by **three distinct moves**, each of which the P-invariant
should have caught but didn't, because the invariant checked tag-presence, not
defect-resolution:

**M1 — issue-level close masquerading as system-level close (CH-1, CH-2).**
C.W2's commit body honestly says it migrated *"the CSSCodeEditor cartoon-shadow"* — one
site — and *"the display tier"* of the φ-ladder. Both are real, exemplary, ONE-MOTION
token adoptions (`179019f`). But the *ledger entry* read "cartoon-shadow — CLOSED" and
"φ-ladder — ADDRESSED," and subsequent tranches treated the SYSTEM as done. The defect
(panels never adopted cartoon; the hero never reached a hero rung; 128→37 body rungs
linger) survived because the row's terminal tag stopped tracking the system the moment
the issue closed. **Gate target:** the close must assert the SYSTEM property
(panel-wide cartoon; 0 body rungs; hero on the top rung), not a single migrated site.

**M2 — scope-narrowing into a terminable sub-problem (CH-3).**
"Perfect mobile" → narrowed to "no dock occlusion" → "KFD-TERMINATED-2." The narrowing
was legitimate *engineering triage* but the LEDGER lost the original intent: the row that
said "mobile" now meant "occlusion," and when occlusion terminated, "mobile" read as
done. The user's D10 is the original intent re-asserting itself. **Gate target:** a
chronic re-scoped to a sub-problem must SPAWN a successor row for the residual intent, not
let the sub-problem's terminal stand in for the whole.

**M3 — column-migration to HANDOFF/OUT (CH-3 residual, CH-4).**
The cleanest escape: re-tag the item glass-ui-HANDOFF / OUT and it leaves the
*keyframes-owned* ledger entirely. This is OFTEN correct (the dock IS glass-ui's; the
memory rule is right). But the P-invariant clause is "no perpetual *keyframes-owned*
punt" — so a HANDOFF item is, by construction, never a P-invariant violation, no matter
how long it stays broken in the product. **Gate target:** every HANDOFF must carry a
**kf-side born-RED gate** that fails until the upstream fix lands and is consumed —
turning "handed off and forgotten" into "handed off and watched."

---

## 3 · The chronic-closure gates (the falsifiable instruments H must add)

The single highest-leverage thing this lane recommends is one new discipline: a
**`proof:chronic-closed`** gate family — the lock that makes the four closures
*irreversible* and stops M1/M2/M3 from re-papering them. Each is a tiny static or
visual assertion; none is a new feature.

| Gate | Asserts (the SYSTEM property, not an issue) | Closes |
|---|---|---|
| `proof:cartoon-is-panel-depth` | the ≥4 panel Cards resolve `box-shadow: var(--shadow-cartoon-md)` at rest AND `grep "<Card" demo/ \| grep glass-specular-track` = 0 on panels | CH-1 / M1 — a future glass-ui default cannot silently re-take the panels without reddening this |
| `proof:phi-leaf-zero` | `grep -rno "text-(xs\|sm\|base\|lg\|xl\|2xl\|4xl\|6xl\|8xl)" demo/{@,app,easing,spring,sequence,motion-path} --include=*.vue` = **0** (raw rungs → semantic `text-*` utilities) AND the hero `<h1>` carries the top φ display rung | CH-2 / M1 — converts the asserted "0 body rungs" into an ENFORCED 0; the 37 survivors red it today |
| `proof:mobile-composition` (browser) | at a mobile viewport: top+bottom docks `position: fixed`; the scene/animation area is the page background layer; mode-switch re-shapes the page; no dock-over-content overlap (the existing `occlusion-gate.mjs` mask-free) | CH-3 / M2 — a NEW row for the original "perfect mobile" intent, distinct from the terminated occlusion sub-row |
| `proof:dock-live` (browser, born-RED) | the `@mbabb` DockDropdownTrigger popover OPENS on click; dock expand/collapse settles within ≤1 frame of its spring (no >N-ms lag) | CH-4 / M3 — the kf-side watch on the glass-ui HANDOFF; green ONLY when the consumed glass-ui version fixes D5/D9 |

> **The meta-gate.** H should adopt a SINGLE binding rule for the chronic ledger going
> forward: **a chronic row may exit only with (a) a passing SYSTEM-property gate, or (b)
> a HANDOFF tag PAIRED with a born-RED kf-side gate.** A bare tag is no longer a terminal.
> This is the P-invariant, repaired: it now polices the PRODUCT, not the column.

---

## 4 · The BOOKs carried tranche-to-tranche — terminal H dispositions

The engine/perf/parse BOOKs (FB-1 composition, FB-2 sync-half, FB-3 SVG-geometry, FB-5
intrinsic-size, the SoA/re-pin band, the parse-that re-key) are owned by the SOURCE H
lanes (`a-engine-*`, `a-parsing-*`, value.js/parse-that HANDOFFs) and are NOT re-litigated
here — they are genuine net-new scope with carried gates, not papered-over design
chronics. This lane dispositions only the carried items in ITS charge (design/demo/cross-
cutting) and records the engine BOOKs' terminal tags for ledger completeness.

| BOOK | Carried since | H disposition | Why |
|---|---|---|---|
| **FB-4 typed/directional scene-VT** | F → G (glass-ui H-1 gated) | **BOOK → glass-ui-HANDOFF (paired gate).** | Platform Baseline-ready (directional VT 2026-01-13); blocker is purely glass-ui's `startViewTransition({types})` helper (`G/FINAL.md:203`). kf consumer wave lands when the helper does. Pair with a born-RED `demo-smoke` VT-types assertion (M3 discipline). Ties to D11 "more interactive modes" (scene transitions). |
| **FB-6 `Mod+K` command palette** | F → G (low urgency) | **BOOK (demo, low) — DECIDE owner in H.** | Invoker Commands Baseline 2025-12-12; the discovery-trigger sliver already covers the core flow. NOT a user D-defect → genuinely low. Decide demo-local vs glass-ui shell primitive; do not re-defer without that decision (P-invariant). |
| **FB-3 / C-5 MorphSVG/DrawSVG** | A(F-6) → … → G (DrawSVG sliver landed G.W13) | **BOOK + value.js-HANDOFF (VJ-F1).** | `fromDrawSVG` landed (`G/FINAL.md` G.W13); the path-GEOMETRY sampler (`getPointAtLength`) is value-domain. The only real persisting competitor-feature gap. Owned by the engine/value.js lanes; recorded here as honestly-open, not a design punt. |
| **FB-5 intrinsic-size `0→auto`** | F → G | **BOOK (guarded-enhancement) — VERIFY Baseline first.** | `interpolate-size`/`calc-size()` NOT cross-engine-Baseline as of 2026-06; the genuine JS fallback is measure-to-px (NO polyfill). Highest user-demand engine BOOK. Engine-lane owned. |
| **the scene-swap VT dead-CSS** | A → B → C (named twice-deferred) | **KILL or RESTORE — DECIDE in H.** | `C/audit/lanes/deferred-ledger.md:124` flagged "dead CSS or phantom triggers" as a twice-deferred punt. Either restore via `startViewTransition` (folds into FB-4) or DELETE the dead CSS. A no-decision third defer is a P-invariant violation. |

---

## 5 · The C-1 value.js charter — the ONE genuinely-perpetual item (CHRONIC-by-design)

For completeness and to draw the bright line: C-1 (the value.js cross-repo charter) is
the only chronic that is **correctly perpetual** — value.js is dirty + active; a slice
ships every tranche; G consumed the landed `0.11.1` slice via the re-pin
(`G/FINAL.md:179`). This is the inv-16 *process working*, not a punt. The distinction
this lane draws: **C-1 is CHRONIC-by-design because the PROCESS ships a slice each
tranche; CH-1..CH-4 are NOT — they are stalled PRODUCT defects that the ledger merely
re-tagged.** The test for "legitimate chronic" vs "papered punt" is: *did the product
move this tranche?* For C-1, yes (the re-pin lit the F wins). For CH-1..CH-4, no — the
hover is still a radial blur, the hero is still a mid rung, mobile is still un-composed,
the popover still doesn't open. **Disposition: CHRONIC-by-design (re-affirm), untouched.**

---

## 6 · Findings ledger (terminal dispositions, P-invariant satisfied at the PRODUCT level)

| # | Finding (anchor) | Disposition | Falsifiable instrument |
|---|---|---|---|
| **DC-1** | The deferred ledger's "CLEAN / no perpetual punt" verdict (`G/FINAL.md:174-181`) policed the keyframes-OWNED column, not the PRODUCT; four user-visible chronics (D2/D7/D10/D5) "exited" by issue-level close (M1) or column-migration to HANDOFF/OUT (M3), unsolved. | **KFH (process SHIP).** | Adopt the meta-gate (§3): a chronic row exits only with a SYSTEM-property gate OR a HANDOFF paired with a born-RED kf gate. |
| **DC-2** | cartoon-shadow (CH-1) "closed C.W2" on ONE site (`CSSCodeEditor.vue:6`, live); panels regressed to the un-wired specular radial. | **KFH (SHIP, mechanics → `a-cartoon-shadow`).** | `proof:cartoon-is-panel-depth` (§3) + hover-screenshot lock: panel hover = offset cartoon stamp, no centred radial. |
| **DC-3** | φ-ladder leaf-tail (CH-2) "swept D.W2 / 0 body rungs" but **37 raw rungs survive** (`grep`, live); hero on `text-display-4` (mid rung), not a hero/mega rung (D7). | **KFH (SHIP, mechanics → `a-hero-typography`).** | `proof:phi-leaf-zero` (§3) — the 37 survivors red it today; the hero must carry the top φ display rung. |
| **DC-4** | mobile (CH-3): "KFD-TERMINATED-2 / glass-ui-HANDOFF" discharged only the OCCLUSION sub-problem (M2); the D10 single-page affixed-dock contextual-bg COMPOSITION was never scoped (`App.vue` has ~0 mobile composition, live). | **KFH (SCOPE + SHIP, mechanics → `a-mobile-architecture`).** Occlusion *residual* stays glass-ui-HANDOFF. | `proof:mobile-composition` (§3) — NEW row for the original intent; do NOT inherit the "terminated" tag. D13 springy/fast drawer dogfoods `SpringProgress`. |
| **DC-5** | dock (CH-4): rename closed in the kf column (D.W5/G.W12) but lag + popover-not-opening (D5/D9) never had a kf-side terminal — the memory rule forbade a kf fix, so HANDOFF was never *gated* (M3). | **glass-ui-HANDOFF (correct) + KFH (born-RED kf gate).** | `proof:dock-live` (§3, born-RED) — popover opens; expand settles ≤1 frame. Green only when the consumed glass-ui (AW tranche, live) fixes it. Do NOT patch in kf. |
| **DC-6** | The *phantom-owner re-defer* anti-pattern (a wave declares "the home," ships the sliver, books the deep half forward) recurred A→B→C→D→G for the SAME four design chronics; C's own audit named it (`C/audit/lanes/deferred-ledger.md:47-59`). | **KFH (process RECORD + gate).** | The meta-gate (DC-1) IS the structural fix; record the anti-pattern by name in the H ledger so a future "the home" claim must ship the SYSTEM gate, not a sliver. |
| **DC-7** | Engine/parse BOOKs (FB-3/5, SoA, re-pin band, parse-that re-key) are genuine net-new scope with carried gates — NOT papered design chronics. | **OUT-of-this-lane (owned by `a-engine-*`/`a-parsing-*`/HANDOFFs).** Recorded for ledger completeness (§4). | n/a — their gates live in the source lanes. |
| **DC-8** | scene-swap VT dead-CSS twice-deferred (A→B→C, `C/audit/lanes/deferred-ledger.md:124`). | **KFH — DECIDE (KILL the dead CSS or RESTORE via VT, fold into FB-4).** No third defer (P-invariant). | `grep` for the dead scene-swap CSS = 0 after the decision (either deleted or replaced by a live `startViewTransition` call). |
| **DC-9** | C-1 value.js charter is correctly perpetual; the product moved this tranche (re-pin lit the F wins). | **CHRONIC-by-design (re-affirm), untouched.** | The "did the product move?" test (§5) — green for C-1; red for CH-1..CH-4 pre-H. |

---

## 7 · Why this honours the spine

- **No quick fix / no workaround:** the fix for each chronic is the SYSTEM property
  (cartoon as the panel register; 0 body rungs; composed mobile; an opening popover), not
  a per-site band-aid. The gates assert the system, so a band-aid cannot satisfy them.
- **No legacy beside replacement / one motion:** each closure is a one-motion adoption
  (cartoon `surface` prop replaces the manual `.glass-card`; the leaf-tail rungs replace
  raw Tailwind rungs) — the replaced surface replaced once. The chronic-closure gate
  forbids leaving the old form beside the new.
- **inv-16 (consume, don't re-author):** cartoon tokens, φ rungs, VT-types are all
  glass-ui-OWNED and shipped in `^3.4.0`; the demo adds zero new CSS for CH-1/CH-2. The
  dock behavioural fix (CH-4) is glass-ui-HANDOFF — kf adds only a *gate*, never a patch.
- **No perpetual punt (the P-invariant, repaired):** the meta-gate (§3) makes a bare tag
  non-terminal. A chronic exits only by a SYSTEM gate or a HANDOFF-with-born-RED-gate.
  Four chronics that "exited" on paper are re-opened at the PRODUCT level and given gates
  that fail until the user-visible defect is gone.
- **MEASURE-FIRST / inv ε:** every chronic-history claim is anchored to a prior ledger
  `file:line` (`179019f`, `D/PROGRESS.md:43`, `E/audit/deferred-ledger.md:160`,
  `G/FINAL.md:174`) or a live `grep`/source read on `tranche-h-dev` (1-site cartoon, 37
  body rungs, ~0 mobile composition). Perf/lag claims (CH-4 "≤1 frame") are MEASURE-FIRST
  — the gate must measure, not assert.

---

## 8 · Already-SOTA (honest credit)

- **The C.W2 closures themselves are exemplary** (`179019f`): the CSSCodeEditor
  cartoon migration and the display-tier φ-ladder adoption are textbook one-motion
  token adoptions, dark-mode delegated to tokens. The chronic is not that C did them
  badly — it is that the LEDGER read a one-site close as a system close. This lane
  generalizes the C model; it does not correct it.
- **The G re-pin spine** (`d308699`/`3d352a3`) genuinely discharged the value.js/parse-
  that consumer chronic — the product moved (the F wins lit). C-1 stays CHRONIC-by-design
  *correctly*. The re-pin is the model for "a chronic that the process actually advances."
- **The dock memory rule** ("all dock changes in glass-ui, never patched in demo") is
  CORRECT and should NOT be relaxed. CH-4's fix is not to break the rule — it is to add a
  kf-side *watch* (a born-RED gate) so a correct HANDOFF cannot become a silent forever-
  punt. The rule and the gate are complementary.
- **The deferred-ledger discipline across A→G is otherwise high-grade** — most
  engine/parse/perf carries have honest terminals with carried gates. The defect is
  isolated to the DESIGN/demo chronics, where "closed" was applied at the issue-level and
  the visual system was never re-verified. The repair is one gate family, not a re-litigation.
