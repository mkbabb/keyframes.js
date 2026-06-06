# F.W15 — The a11y SHIPs + shortcut discovery (the unlabeled CSS pane · the playground img alt · a visible shortcuts trigger)

**Phase:** IMPL · **Class:** PATCH+demo (the demo — three additive a11y/discoverability fixes;
the library is UNTOUCHED; pixel-isomorphic for the unfocused state, plus a deliberate focus-ring +
AT-name addition) · **Scope:** `demo/@/components/custom/animation-controls/keyframes/KeyframeCard
.vue:35-41` (the `contenteditable` CSS pane) + `demo/@/components/custom/asset-manager/AssetViewport
.vue:58-63` (the asset `<img>`) + `demo/@/components/custom/editor-shell/EditorShell.vue:116-117`
(the `?`-only shortcuts discovery) — Band 5, the demo-design finishing pass · **DAG: F.W15 is
INDEPENDENT of the engine bands** (`F.md §The DAG` — Band 5 shares no surface with Bands 0–3) ·
**Gated on:** keyframes' own green CI (inv-27).

**Title.** *Two FOLD-E a11y items E never landed and one discoverability paradox: the primary
CSS-editing surface is an unlabeled `contenteditable` with no focus ring, the playground asset
image has no alt, and the demo's rich 19-shortcut registry is discoverable ONLY via a shortcut.
Three additive SHIPs; the full `Mod+K` palette is BOOKED.*

The post-E demo is **~90% SOTA** on the structural/usability axis (`a-demo-post-e` headline). But
the deep assay found two FOLD-E a11y items E flagged and never closed — the `contenteditable` CSS
pane labeling (E-UX-13) and the playground half of the `<img>`-alt (E-UX-8) — plus the
discoverability paradox that the 19-shortcut registry is itself gated behind a shortcut
(`a-demo-post-e §2/§3/§4`). These are not a rewrite of W11's a11y sweep; they are the surfaces W11
reached only partway (it elevated `app/scenes` but the playground lagged; it labeled the timeline
and CopyButton but not the keyframe-card `<pre>`). Each is a small, honest correction.

**The Mandate spine (binding — `F.md §Mandate`).** NO quick solution / NO workaround: the
`contenteditable` pane gets the FULL a11y triple (`role="textbox"` + `aria-multiline` +
`aria-label`) AND the `.focus-ring` idiom — not just one; the `<img>` gets a MEANINGFUL name
(`:alt="asset.name"`), not a placeholder. NO legacy: the focus-ring uses the W11 keystone idiom
(`design-idioms.css:141-144` `.focus-ring:focus-visible`), not a new one-off ring; the shortcuts
trigger uses the existing reka `Dialog` `shortcutsOpen` state, not a parallel modal. Idiomatic +
forward: the visible trigger is a plain `@click="shortcutsOpen = true"` (the pragmatic landing for a
reka `Dialog`) with the **Invoker `command="show-modal"`** path NOTED as the forward feature-detected
idiom (BOOKed, not forced — `r-modern-web-2026 F-MW-1`). Measure-first does NOT bind (a11y
correctness, not a hot path); the gate is `proof:demo-elevate`'s a11y clauses. Isomorphic: the AT name
+ img alt are pixel-isomorphic; the focus ring is a deliberate keyboard-visibility addition (a named
befitting delta). inv δ: no dock occlusion (the trigger sits in the header/dock, respecting
`--dock-band-reserve`). inv ε: every claim cites `file:line` against live `tranche-e-impl`.

**Provenance.** `a-demo-post-e §2` (the `contenteditable` CSS pane unlabeled + no focus ring —
E-UX-13 booked, never landed, SHIP-in-F), `§3` (the playground asset `<img>` no alt — E-UX-8
half-open, SHIP-in-F; the transform-handle keyboard/role — BOOK), `§4` (the shortcut system has no
visible discovery affordance — SHIP-in-F a visible trigger + BOOK the `Mod+K` palette);
`r-modern-web-2026 F-MW-1` (the Invoker `command="show-modal"` forward idiom).

---

## § State, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`:

1. **The `contenteditable` CSS pane is STILL unlabeled + has no focus ring (E-UX-13, never landed).**
   `a-demo-post-e §2` (verified): the `<pre contenteditable="true">` at `KeyframeCard.vue:35-41`
   carries `ref`, `@input`, `@keydown`, and `class` only — NO `role`, `aria-multiline`, or
   `aria-label`. A screen reader announces this PRIMARY CSS-editing surface as generic editable text
   with no accessible name. The class includes `outline-none border-none` (`:38`) and the pane does
   NOT consume the `.focus-ring` idiom — so the keyboard-focused state is INVISIBLE. The W11
   a11y-uniformity pass reached the timeline + CopyButton but not this `<pre>` (`E/FINAL.md`/`DELTA.md`
   never mention `contenteditable`/`aria-multiline`/the keyframe-card pane).

2. **The playground asset `<img>` has NO `alt` (E-UX-8 half-open).** `a-demo-post-e §3` (verified):
   W11 added `alt` to the timeline hover preview (`TimelineHoverPreview.vue:8`, present) but the
   user-content asset image at `AssetViewport.vue:58-63` has NONE —
   ```
   59  <img
   60      :src="asset.imageSrc"
   61      class="w-full h-full object-cover"
   62      draggable="false"
   63  />
   ```
   (no `alt=` anywhere in the block). User content should carry a meaningful name (`:alt="asset.name"`).
   E-UX-8 was thus only HALF-closed (`a-demo-post-e §3` inv-ε asymmetry: `TimelineHoverPreview.vue:8`
   has alt; `AssetViewport.vue:58-63` does not).

3. **The 19-shortcut registry is discoverable ONLY via the `?` shortcut — the discoverability
   paradox.** `a-demo-post-e §4` (verified): the shortcuts are registered
   (`AnimationControlsGroup.vue:262-285` — 17 + `EditorShell.vue` 2 = 19, the singleton glass-ui
   `registerShortcut`) and surfaced through a real reka `Dialog` `KeyboardShortcutsModal`. But the
   ONLY way to open that modal is the `?` keyboard shortcut: `EditorShell.vue:116`
   `const shortcutsOpen = ref(false)`, `:117` `registerShortcut("?", () => { shortcutsOpen.value =
   !shortcutsOpen.value; }, ...)` — there is NO visible button that sets `shortcutsOpen`. A first-time
   visitor has no way to learn that 19 shortcuts OR the help modal exist: the discovery of the shortcut
   system is itself gated behind a shortcut. (Adjacent to E-UX-1: the dead `CommandPalette` E correctly
   deleted + "booked a real palette as a follow-up" that was never built — `grep Mod+K|commandPalette`
   = 0.)

4. **The transform handles are pointer-only `<div>`s below the 24px floor (BOOK, not this wave).**
   `a-demo-post-e §3` (verified): `AssetViewport.vue:74-90` — the 8 resize handles (`w-2.5 h-2.5` =
   10px, `:77`) + the rotation handle (`w-3.5 h-3.5` = 14px, `:89`) are bare `<div>`s with
   `@pointerdown` only — no `role`, `tabindex`, or keyboard, far below WCAG 2.2's 24×24 floor. This is
   the secondary editing surface → BOOK (the `<img>` alt is the SHIP; the keyboard path is the book,
   `a-demo-post-e §3` disposition).

The wave's job: label the CSS pane (the full a11y triple + the `.focus-ring` idiom), name the asset
img (`:alt="asset.name"`), and add a visible shortcuts-discovery trigger — closed by
`proof:demo-elevate`'s a11y clauses that BITE; the handle keyboard path + the `Mod+K` palette BOOKED.

---

## § Goal

**What lands** (three additive a11y/discoverability SHIPs — `proof:demo-elevate`'s a11y clauses green):

- **The `contenteditable` CSS pane labeled + focus-visible** — `role="textbox"` + `aria-multiline=
  "true"` + `:aria-label="`CSS for keyframe ${index}`"` on the `<pre>` (`KeyframeCard.vue:35-41`), and
  the `.focus-ring` idiom (`design-idioms.css:141-144`) applied so its keyboard-focus state is visible
  (the `outline-none border-none` is no longer a bare unfocusable surface). The `insertTabAtCursor`
  editing logic is unchanged — this is semantics + focus-visibility only.
- **The playground asset `<img>` named** — `:alt="asset.name"` (or the asset label) on
  `AssetViewport.vue:58-63`, completing E-UX-8.
- **A visible shortcuts-discovery trigger** — a small keyboard-icon / `⌘?` button (in the editor
  header slot or the dock) wired to `shortcutsOpen = true` (the existing reka `Dialog` state,
  `EditorShell.vue:116`), so the help modal — and the 19-shortcut surface behind it — is discoverable
  without already knowing a shortcut. The Invoker `command="show-modal"` path is NOTED as the forward
  feature-detected idiom (BOOKed).
- **`proof:demo-elevate`'s a11y clauses** wired into CI: the labeled textbox, the asset alt, the
  visible trigger present.

**Recorded-BOOK** (named, dispositioned, NOT this wave):
- **The transform-handle keyboard/role + ≥24px `::before` hit pad** (`D6`/`a-demo-post-e §3b`) — the
  richer, lower-urgency a11y of the secondary playground editing surface (mirroring the
  timeline-diamond `::before` pad recipe W11 proved at `TimelineTrack.vue:228-238`). **BOOK**.
- **The full `Mod+K` command palette** (`a-demo-post-e §4`/E-UX-1's booked follow-up) — `Mod+K` over
  the existing `useRegisteredShortcuts()` registry (which `KeyboardShortcutsModal` already reads).
  **BOOK** (high-value but more than a button; the Invoker showcase scene is F.W13's BOOK).
- **Start-screen first-gesture copy/cue pass** (`NEW-29`/`a-demo-post-e §5`) — **BOOK** (a UX-copy +
  cue pass pointing at the primary affordance, pairs with this wave's visible trigger).
- **Icon-button touch-target generalization** (`NEW-30`/`a-demo-post-e §6`) — **BOOK** (the `h-6 w-6`
  buttons toward ≥44px via transparent `::before` padding; the primary diamonds are already fixed).

**Why:** these are two real a11y CORRECTNESS gaps (an unlabeled primary editing surface; unnamed user
content) and one usability paradox (a discoverable-only-if-you-know-the-shortcut shortcut system) —
the surfaces W11 reached only partway (`a-demo-post-e §2/§3/§4`). Each is additive and idiomatic (the
W11 `.focus-ring` keystone, the existing `IconTooltip`/alt pattern, the existing reka `Dialog`), so
the SHIP is cheap and the record is honest about what E left half-open.

---

## § Scope

Three additive SHIPs land (S1/S2/S3); four items are BOOK. Every claim is `file:line`-grounded.

### S1 — Label the `contenteditable` CSS pane + apply `.focus-ring` (`a-demo-post-e §2`) — SHIP-in-F

**WHAT:** add `role="textbox"` + `aria-multiline="true"` + `:aria-label="`CSS for keyframe
${index}`"` to the `<pre contenteditable="true">` at `KeyframeCard.vue:35-41`, and apply the
`.focus-ring` class (the W11 keystone idiom, `design-idioms.css:141-144`
`.focus-ring:focus-visible { box-shadow: var(--focus-ring-shadow) }`) so the keyboard-focused state
of the editing surface is visible (today `outline-none border-none` leaves it invisible). The
`insertTabAtCursor` editing logic is sound and unchanged.

**WHY:** this is the PRIMARY CSS-editing surface, announced by a screen reader as generic editable
text with no name, and its keyboard-focus state is invisible (State 1) — the FOLD-E E-UX-13 item E
booked and never landed. The fix is semantics + the existing focus-ring idiom; pixel-isomorphic for
the unfocused state, with the focus ring a deliberate keyboard-visibility addition.

### S2 — Name the playground asset `<img>` (`a-demo-post-e §3`) — SHIP-in-F

**WHAT:** add `:alt="asset.name"` (or the asset label) to the user-content asset `<img>` at
`AssetViewport.vue:58-63`. Trivial; completes E-UX-8 (W11 landed the timeline-preview half,
`TimelineHoverPreview.vue:8`, but not this).

**WHY:** user content should carry a meaningful accessible name; an unnamed `<img>` is announced as
nothing to AT (State 2). The W11 sweep landed alt on the timeline preview but not the playground
asset — the half-open E-UX-8. Pixel-isomorphic (an `alt` attribute is AT-only).

### S3 — A visible shortcuts-discovery trigger (`a-demo-post-e §4`) — SHIP-in-F

**WHAT:** add a visible affordance — a small keyboard-icon / `⌘?` button in the editor header slot
(`EditorHeader` left/right) or the dock — wired to `shortcutsOpen = true` (the existing reka `Dialog`
state, `EditorShell.vue:116`; the `?` shortcut at `:117` continues to work). Use a plain
`@click="shortcutsOpen = true"` (the pragmatic landing for the existing reka `Dialog`); NOTE the
Invoker `command="show-modal"` path as the forward feature-detected idiom (`r-modern-web-2026
F-MW-1` — BOOKed, not forced). The trigger must respect `--dock-band-reserve` (inv δ — no dock
occlusion).

**WHY:** the 19-shortcut registry is discoverable ONLY via the `?` shortcut — a first-time visitor
cannot learn the shortcuts OR the help modal exist (the discoverability paradox, State 3). A visible
trigger breaks the paradox with one control; the modal + registry already exist. The Invoker note
records the forward idiom without forcing a Baseline-conditional rewrite onto a working reka `Dialog`.

> **BOOK in this band (named, NOT this wave) — `a-demo-post-e`:**
> - **The transform-handle keyboard/role + ≥24px `::before` hit pad** (`§3b`/`D6`) — the secondary
>   playground editing surface (`AssetViewport.vue:74-90`); **BOOK** (mirror the W11 diamond
>   `::before` recipe, `TimelineTrack.vue:228-238`).
> - **The full `Mod+K` command palette** (`§4`/E-UX-1) — `Mod+K` over `useRegisteredShortcuts()`;
>   **BOOK** (more than a button; the Invoker showcase scene is F.W13's BOOK).
> - **Start-screen first-gesture copy/cue pass** (`§5`/`NEW-29`) — **BOOK** (point the copy at the
>   primary affordance, pairs with S3's visible trigger).
> - **Icon-button touch-target generalization** (`§6`/`NEW-30`) — **BOOK** (the `h-6 w-6` buttons
>   toward ≥44px; the primary diamonds are already fixed).

---

## § Hard gate (`proof:demo-elevate` a11y clauses — falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real a11y/presence test, not an assertion):

1. **The CSS pane is a labeled textbox with a visible focus ring (S1).** A test/snapshot asserts the
   `<pre>` at `KeyframeCard.vue:35-41` carries `role="textbox"` + `aria-multiline="true"` + a
   non-empty `aria-label` ("CSS for keyframe N") AND consumes `.focus-ring`. **BITE:** strip the
   `role`/`aria-label` → the labeled-textbox assertion reds (reds today — verified State 1); remove
   `.focus-ring` → the focus-visibility assertion reds.

2. **The asset `<img>` has a meaningful alt (S2).** A test asserts `AssetViewport.vue:58-63`'s `<img>`
   has a non-empty `:alt` bound to the asset name. **BITE:** remove the `:alt` → the named-image
   assertion reds (reds today — verified State 2).

3. **A visible trigger opens the shortcuts modal (S3).** A test asserts a visible control (not the `?`
   shortcut) sets `shortcutsOpen = true` / opens the `KeyboardShortcutsModal`. **BITE:** remove the
   visible trigger → the discovery-affordance assertion reds (reds today — `shortcutsOpen` is toggled
   only by `?`, verified State 3); the `?` shortcut continues to work (the trigger is additive).

4. **No dock occlusion (inv δ).** `proof:demo-elevate`'s occlusion clause stays green — the visible
   trigger respects `--dock-band-reserve`; no dock-over-content overlap. **BITE:** place the trigger
   where it overlaps the dock band → the inv-δ occlusion clause reds.

5. **No regression / isomorphic-additive.** `npm test` stays green; the AT name + img alt are
   pixel-isomorphic; the focus ring is a deliberate keyboard-visibility addition (a named befitting
   delta); the trigger is additive. **BITE:** any keyframe-card/asset-viewport/editor-shell render or
   behaviour test regression reds.

---

## § Folds

Retires (by finding id):
- **`a-demo-post-e §2`** (E-UX-13 — the `contenteditable` CSS pane unlabeled + no focus ring) — S1 +
  gate clause 1.
- **`a-demo-post-e §3a`** (E-UX-8 half-open — the playground asset `<img>` no alt) — S2 + gate clause 2.
- **`a-demo-post-e §4`** (the shortcut system has no visible discovery affordance) — S3 + gate clause 3.

**Recorded-BOOK (named, NOT this wave):**
- **`a-demo-post-e §3b`** (the transform-handle keyboard/role + ≥24px hit pad — the secondary surface).
- **`a-demo-post-e §4`** (the full `Mod+K` palette — E-UX-1's booked follow-up).
- **`a-demo-post-e §5`** (`NEW-29` start-screen first-gesture copy/cue).
- **`a-demo-post-e §6`** (`NEW-30` icon-button touch-target generalization).

**No value.js hand-off (these are demo-DOM/demo-composable a11y concerns; the engine + value.js are
untouched — `a-demo-post-e` value.js-handoffs: NONE).**

---

## § Design decisions

1. **The full a11y triple + the W11 focus-ring keystone — not a partial fix.** RESOLVED (no
   workaround): the `contenteditable` pane gets `role="textbox"` + `aria-multiline` + `aria-label`
   (the complete E-UX-13 prescription) AND the `.focus-ring` idiom — because labeling without a visible
   focus ring leaves the keyboard-focused state invisible (the `outline-none border-none` problem), and
   a focus ring without a name leaves it unannounced. The fix uses the W11 keystone idiom
   (`design-idioms.css:141-144`), not a new one-off ring (no-legacy). Trade-off: the focus ring is a
   visible delta on the unfocused-isomorphic pane — but a visible keyboard-focus state is the correct,
   befitting a11y improvement, not a regression.

2. **A meaningful name, not a placeholder.** RESOLVED: the asset `<img>` gets `:alt="asset.name"` (the
   user-content name), not a generic `alt="image"` — user content should carry its real label
   (`a-demo-post-e §3`). Trade-off: none — it is the half-open E-UX-8's correct completion, pixel-iso.

3. **A plain `@click` trigger now; the Invoker `command="show-modal"` is the forward BOOK.** RESOLVED
   (`r-modern-web-2026 F-MW-1`): the demo already uses a reka `Dialog` for the shortcuts modal, so the
   pragmatic visible trigger is a plain `@click="shortcutsOpen = true"` — the idiomatic landing for the
   existing component. The Invoker `command="show-modal"` path (Baseline 2025-12-12) is the forward
   feature-detected idiom, NOTED + BOOKed (not forced — a Baseline-conditional rewrite of a working
   reka `Dialog` would be gold-plating). Trade-off: the trigger is imperative `@click` for now — but
   that matches the existing modal's binding, and the Invoker upgrade is recorded for when a
   declarative-controls wave wants it.

4. **A visible trigger SHIPs; the `Mod+K` palette is BOOKED.** RESOLVED (`a-demo-post-e §4`): the
   minimal high-value half is a single visible control that breaks the discoverability paradox — the
   modal + registry already exist, so it is one button. The full `Mod+K` command palette (over the
   existing `useRegisteredShortcuts()` registry) is high-value but MORE than a button (a searchable
   command surface) → BOOK. Trade-off: the palette is the richer affordance — but the visible trigger
   is the 80% at ~1% the cost, and the palette is correctly sequenced as its own scope.

5. **inv δ holds — the trigger does not occlude the dock.** RESOLVED: the visible trigger sits in the
   editor header slot or the dock band, respecting `--dock-band-reserve` (the inv-δ "zero
   dock-over-content overlap" hard gate, `F.md §invariant set`). Trade-off: none — the placement is
   constrained by the standing occlusion gate, which clause 4 enforces.
