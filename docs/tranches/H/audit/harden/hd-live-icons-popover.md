# Tranche H DEEP harden — lane `hd-live-icons-popover`

**Charge:** LIVE re-verify D8 (scene-nav icons — which modes lack them) + D9 (the
`@mbabb` popover — does it open? confirm the double-wrapped-trigger `handlerCount:2`
root cause). Screenshot. Confirm H.W5 + the popover anchor. Red-team feasibility:
is each fix CORRECT/FEASIBLE? does each gate BITE? does any wave assume a non-existent
API? is D9 attributed to the right OWNER?

**Demo:** `http://localhost:5173/` (kf 4.1.0 + Tranche G, pre-H). **Deps verified in
node_modules:** glass-ui **3.4.0**, reka-ui 2.9.9. **Method:** Playwright MCP live
instrumentation + `node_modules` API reads + source `grep`.

---

## TL;DR — VERDICT

**The defects are real and the root causes are exactly as the audit lanes state.** I
re-confirmed D8 (4-of-9 scenes resolve an icon; 5 wear the Home glyph) and D9
(`handlerCount:2` double-toggle; single toggle opens; engine healthy) LIVE. The W5 icon
fix is CORRECT and FEASIBLE — every glass-ui API it leans on EXISTS in 3.4.0 (verified).

**But the harden surfaced two SUBSTANTIVE wave-authoring defects the consistency pass
could not catch — both about D9 (the popover), and both about OWNERSHIP/GATING, not
mechanism:**

- **H1 (HIGH):** The D9 demo-side fix that the CHARTER promises (`H.md` S5 of H.W1 —
  "drop the outer popover wrapper + bind `v-model:open` → dock `keepOpen/release`") is
  **ABSENT from the H.W1 wave file.** The wave-file S5 is entirely SUSPEND/home↔cube/
  deep-link; the popover is mentioned **0 times** in `H.W1.md`. The fix is orphaned: the
  charter assigns it, no implementation wave scopes it.
- **H2 (HIGH):** The only D9 gate anywhere — `proof:dock-live` (H.W8:46) — **mis-attributes
  D9 to a glass-ui version bump** ("greens ONLY when the consumed glass-ui (AW tranche)
  version fixes it — do NOT patch in kf"). But D9 is DEMO-OWNED (App.vue double-wrap),
  fixed in kf with glass-ui UNCHANGED. This bundles a demo defect (D9) with a genuine
  glass-ui handoff (D5 dock lag) into ONE born-RED gate, reproducing the exact M3
  column-migration false-close the meta-gate (H.W8 S3) exists to prevent.

D8/W5 itself is sound (one NIT). The substantive damage is in the D9 wave wiring.

---

## PART A — D8 (scene-nav icons): LIVE re-verified, W5 SOUND

### A1 — the icon coverage gap, confirmed structurally + live

Source (`ChromeDock.vue:25-30`, read this lane) maps EXACTLY 4 ids:
```ts
const sceneIcons: Record<string, string> = { cube, amiga, square, easing };
```
The 9 scene ids in `scenes.ts` (read this lane): `home, cube, amiga, square, easing,
spring, sequence, motion-path, starting-style`. So:

- **resolve an `<img>` icon (4):** cube · amiga · square · easing
- **fall through to `<Home>` (5):** home (legit), **spring · sequence · motion-path ·
  starting-style** (the four D8 names) — they ALIAS the Home house glyph.

**LIVE (Playwright, this lane):**
- On `/#/easing` the dock pill renders the easing icon via `<img src="data:image/svg+xml,…"
  alt="easing scene">` — confirming the `<img :src>` reference (theme-blind by
  construction).
- Navigating `/#/spring` (and `/#/sequence`) is overridden by the D12 route storm to
  `/#/` (home) before the spring pill can settle; the resting dock shows
  `class="lucide lucide-house … icon-sm"` + text "Home" — the `<Home>` glyph live. The
  storm itself (`next()` deprecation flood, autonomous route walk) is corroborated:
  console has the `next()` deprecation warning, URL self-cycled `/#/cube → /#/easing?
  anim=Easing+Preview → /#/` unattended. (D12 = H.W1's charge; flagged for the FSM
  dependency W5 already declares.)

**Verdict:** D8 is real and WIDER than its four-mode statement (home is also glyph-only,
by design). `a-scene-icons` §0 + W5 §State (`H.W5.md:17`) already say exactly this. ✅

### A2 — the `<img>` theme-blindness (the load-bearing W5 G4 clause), confirmed

`easing-icon-sm.svg` (read this lane) bakes `stroke="hsl(248, 88%, 71%)"` +
`fill="hsl(248, 88%, 71%)"` on its circles — the brand primary, hard-coded. It is
referenced via `<img :src>` (`ChromeDock.vue:171,194,210`), which paints the SVG as a
replaced element that cannot read host `currentColor`. So even the VECTOR icon is
theme-blind today. W5's adjudication ("theming is a property of the REFERENCE mechanism,
not the file format" — `H.W5.md §Design-decisions`) and the `proof:scene-icons` G4
theming clause are therefore **correctly founded and bite a real defect**. ✅

### A3 — W5 fix FEASIBILITY (the inline-SVG seam): CORRECT, one NIT

W5 S1 wires the inline-SVG reference via `vite-svg-loader` `?component`. This is a real,
idiomatic devDep (one devDep + one query suffix). The `<component :is="scene.icon">`
render + `SceneDescriptor.icon?: Component` is sound Vue 3. The PNG KILL + descriptor
move is mechanically straightforward; the line anchors W5 cites (`ChromeDock.vue:25-30,
171-172,180,194,210-211`; `scenes.ts:7-14,54-123`) all MATCH current source (verified
this lane). No non-existent API. The orphan `-lg` PNGs (60.6 KB) confirmed on disk
(`amiga-icon-lg.png` 31261B, `cube-icon-lg.png` 9432B, `square-icon-lg.png` 18935B).

- **NIT (LOW) — `H.W5.md:3,30` is missing an "S6" between S4 and S5 in the §Scope
  prose ORDER, and S6 is authored AFTER S5 in the file.** The §Scope §Hard-gate list runs
  S1·S2·S3·S4·**S6**·S5 (S6 appears before S5 in the §Hard-gate block at `H.W5.md:46`,
  and S5 last at `:37`). Not a defect of substance (every S is present and scoped), but
  the out-of-order S5/S6 reads as a drafting slip. **Edit:** reorder so S5 precedes S6,
  or renumber, so the scene-perf budget (S6) doesn't sit between the interactivity floor
  (S4) and the square KILL (S5). Cosmetic.

**Verdict on D8/W5:** the wave is CORRECT, FEASIBLE, well-gated. The `proof:scene-icons`
coverage clause (every non-home descriptor has an icon) genuinely makes an icon-less
scene unshippable — it BITES. No BLOCKER, no HIGH. The substantive harden findings are
all on D9 below.

---

## PART B — D9 (the `@mbabb` popover): root cause LIVE re-confirmed

### B1 — `handlerCount:2` double-toggle, re-confirmed live (the audit was right)

Source (`App.vue:18-21`, read this lane) — the double-wrap is present verbatim:
```vue
<DropdownMenuTrigger as-child>
    <DockDropdownTrigger aria-label="@mbabb menu" …>@mbabb</DockDropdownTrigger>
</DropdownMenuTrigger>
```
`DropdownMenuTrigger` imported from `@mkbabb/glass-ui` (`App.vue:152`); `DockDropdownTrigger`
from `@mkbabb/glass-ui/dock` (`App.vue:154`).

**glass-ui 3.4.0 API verified in node_modules (the root-cause hinge):**
- `dist/components/custom/dock/DockDropdownTrigger.vue.d.ts` — props are
  `DropdownMenuTriggerProps & { type; class }` (it takes the FULL reka trigger props).
- `dist/dock.js` — `import { DropdownMenuTrigger as W } from "reka-ui"`; `DockDropdownTrigger`
  setup renders `g(L(W), C(L(r), { class: …("dock-dropdown-trigger", …) }), …)` — i.e. it
  **renders the reka `DropdownMenuTrigger` directly**, forwarding the trigger props. So
  `DockDropdownTrigger` IS a complete reka trigger. The audit's central claim holds. ✅

**LIVE instrumentation (Playwright, this lane), on the live `@mbabb` button:**
- button present, `aria-haspopup=menu`, `aria-expanded=false`, `data-state=closed`,
  `id=reka-dropdown-menu-trigger-v-2`, visible rect `71.9×27.6` — correctly reka-wired.
- `btn.__vnode.props.onClick` is an **array of length 2** → **`handlerCount: 2`**
  (re-confirmed live — the exact smoking gun the audit reports at
  `a-mbabb-popover.md:58`).
- Invoking BOTH handlers from rest (what Vue does for one DOM click) → `data-state`
  stays `"closed"`, no `[role=menu]` → **menu does NOT open** (the two toggles cancel).
- **Counter-proof the engine is healthy:** walked the component chain to the reka
  `DropdownMenuRootContext`, called `onOpenToggle()` ONCE → `open: true`,
  `data-state: "open"`, `[role=menu]` rendered with all four items:
  *"Share … Dark mode … ppmycota … @mbabb …"*. (Screenshot below.)

So: real click (2 handlers) → closed; single toggle → opens. **D9 is exclusively the
doubled toggle.** Demo-owned. glass-ui 3.4.0 needs no fix.

### B2 — Screenshot (forced-open menu)

`/Users/mkbabb/Programming/keyframes.js/hd-mbabb-popover-forced-open.png` — the menu
open after a SINGLE forced toggle, rendering Share / Dark mode / ppmycota / @mbabb
correctly. Note: the dock had recollapsed to the "Home" pill behind the floating menu —
corroborates the **secondary keep-open gap** (`a-mbabb-popover.md §Secondary`): the menu
is NOT marked `data-glass-dock-portal`, the dock collapse TIMER fires under the open
menu. The fix needs the `keepOpen/release` hold (W5/charter both name it).

### B3 — the demo D9 fix is FEASIBLE on glass-ui 3.4.0 (no version bump)

Every API the demo-side fix needs EXISTS in installed glass-ui 3.4.0 (verified this lane):
- **`DockDropdownTrigger` used directly inside `<DropdownMenu>` (un-double-wrap)** — the
  precedent EXISTS: `ChromeDock.vue:144,170` use `DockSelectTrigger` directly inside
  `<Select>` (never wrapped in `<SelectTrigger>`). Single reka trigger → 1 toggle/click →
  opens (live-proven by the single-toggle counter-proof).
- **`useOptionalDockContext()` for the keepOpen hold** — exported from
  `@mkbabb/glass-ui/dock` (`dist/dock.js`: `a as useOptionalDockContext`) AND typed via
  `dock.d.ts → export * from "./components/custom/dock"` → `dockContext.d.ts:40`
  `export declare const useOptionalDockContext: () => DockContext | null` with
  `keepOpen: () => void` / `release: () => void` on the context. (Note: a literal grep of
  `dock.d.ts` for the name misses it — it's a wildcard re-export — but it IS typed.)
- **The `#items` slot is inside the dock context** — `ChromeDock.vue:205`
  `<slot name="items" />` renders inside `<GlassDock>` (`:116-217`), and `GlassDock`
  calls `provideDockContext` (`dist/dock.js`). So App.vue's `@mbabb` `<DropdownMenu>` can
  call `useOptionalDockContext()` and reach `keepOpen/release` — no prop drilling.
- **ChromeDock's existing keepOpen mutex** (`ChromeDock.vue:82-101`: `openPopup` ref +
  `watch(isAnyOpen → dockRef.keepOpen()/release())`) is the DRY precedent the fix mirrors.

**Verdict:** the D9 demo fix is correct, feasible, and assumes NO non-existent API. The
problem is NOT the fix — it is that **no wave implements or gates it**, and the one D9
gate mis-owns it (H1, H2 below). ✅ on mechanism, ✗ on wiring.

---

## FINDINGS

### H1 (HIGH) — the D9 demo fix the CHARTER promises is ABSENT from the H.W1 wave file

**Location:** `H.md:181` + `H.md:326` (§Scope S5) + `H.md:329` (§Design-decisions 3)
vs. `H.W1.md` (the wave file) — popover mentions: **0**.

**Defect (evidence):**
- The charter routes D9 to H.W1 and scopes it explicitly:
  - `H.md:181`: "**D9** · … | **H.W1** (popover; FSM-coupled) | the @mbabb popover
    re-open | SHIP-in-H (drop the double-wrapped trigger; `keepOpen`/`release`)".
  - `H.md:326` §Scope **S5**: "drop the outer popover wrapper (use `DockDropdownTrigger`
    directly, mirroring `DockSelectTrigger`) + bind `v-model:open` → dock `keepOpen`/
    `release`; drop the deprecated `next()` guard (WHY: the double-toggle cancellation D9)."
  - `H.md:329` §Design-decisions (3): "the popover root is the double-wrapped trigger
    (ADJUDICATED primary…)".
- **But the H.W1 WAVE FILE's S5** (`H.W1.md:44`) is: "genuine SUSPEND (no orphan rAF) +
  home↔cube split + deep-link wins" — it contains the `next()` guard half (shared with
  the charter S5) but says **NOTHING** about the popover / un-double-wrap / `v-model:open`
  / keepOpen. `grep -ci "popover|@mbabb|double-wrap|DropdownMenuTrigger|DockDropdownTrigger|
  keepOpen|v-model:open" H.W1.md` = **0** (run this lane).
- H.W1's §Hard-gate (`H.W1.md:52-60`) has gates for the FSM/route-storm/suspend/
  deprecated-guard but **NO `proof:popover-opens` and NO `proof:single-toggle`** — the
  two falsifiable D9 instruments the audit lane authored (`a-mbabb-popover.md:151-159`).

So the D9 demo fix is specified in the charter, dropped from the implementation wave, and
ungated anywhere. The "(popover; FSM-coupled)" framing was used to fold D9 into H.W1, but
the wave-file authoring only carried the FSM half, not the popover half. This is the
phantom-owner / re-defer anti-pattern (`a-deferred-chronic.md` DC-6) recurring inside H
itself: a wave "owns" a fix in the charter that its own spec doesn't ship.

**Concrete doc edit:** Add to `H.W1.md` an explicit popover sub-clause (restore the
charter's S5 popover half — either extend S5 or add an S8). It must state: (a) delete the
`<DropdownMenuTrigger as-child>` wrapper at `App.vue:18-21`, using `<DockDropdownTrigger>`
directly inside `<DropdownMenu>` (mirroring `DockSelectTrigger` at `ChromeDock.vue:144,
170`); (b) remove the now-unused `DropdownMenuTrigger` from the glass-ui import at
`App.vue:152`; (c) add `mbabbOpen` + `v-model:open` and
`watch(mbabbOpen, o => o ? ctx.keepOpen() : ctx.release())` via
`useOptionalDockContext()` (verified exported/typed). AND add the two born-RED gates to
H.W1 §Hard-gate, sourced verbatim from `a-mbabb-popover.md:151-159`:
- **`proof:popover-opens`** — expand dock → trusted-click `button[aria-label="@mbabb
  menu"]` → within 200ms `[role=menu]` exists AND trigger `data-state="open"` AND lists
  Share/Dark mode/ppmycota/@mbabb. (Reds today; greens on the un-double-wrap.)
- **`proof:single-toggle`** — the button's merged `onClick` resolves to EXACTLY ONE reka
  toggle handler (equivalently: one trusted click → exactly 1 `onOpenToggle` call).
  (Reds today — live `handlerCount:2`, re-confirmed this lane.)

### H2 (HIGH) — `proof:dock-live` (H.W8) mis-attributes D9 to a glass-ui version bump; conflates demo-owned D9 with glass-ui-owned D5

**Location:** `H.W8.md:46` (`proof:dock-live`); `a-deferred-chronic.md:115-116` (CH-4 /
DC-5 row); `_SYNTHESIS-gap-scorecard.md:173` (§4 handoff table).

**Defect (evidence):**
- `proof:dock-live` (H.W8:46): "The `@mbabb` DockDropdownTrigger popover OPENS on click;
  dock expand/collapse settles ≤1 frame of its spring. **BITE:** reds TODAY (D5 lag + D9
  popover-not-opening …); greens ONLY when the consumed glass-ui (AW tranche) version
  fixes it — the kf-side WATCH on the HANDOFF; **do NOT patch in kf**." It bundles **D5
  (dock lag) AND D9 (popover)** into ONE born-RED HANDOFF gate gated on a glass-ui bump.
- **D9 is NOT a glass-ui defect.** Authoritatively adjudicated:
  - gap-scorecard §1.1 (`:67`, AUTHORITATIVE): D9 = **SHIP-in-H — drop the outer wrapper …
    + bind `v-model:open` → dock keepOpen/release** (demo edit, kf-owned).
  - The §4 cross-repo HANDOFF table (`gap-scorecard:173`) lists ONLY **Dock LAG (D5-b)**
    as the glass-ui handoff (the `--spring-dock` `0.10932…` retune in unpublished
    `53c1b07`). **D9 is absent from the handoff table** — because it isn't a handoff.
  - This lane verified: glass-ui 3.4.0 `DockDropdownTrigger` is CORRECT (it IS the reka
    trigger, mirroring `DockSelectTrigger`); the double-toggle is the DEMO's double-wrap.
    glass-ui has nothing to fix for D9. (The audit lane's only glass-ui ask is a
    **RECORD-only** doc-note/dev-warning — `a-mbabb-popover.md:181-188` — NOT a fix D9
    waits on.)
  - D5 (dock lag) genuinely IS glass-ui-owned: `--spring-dock` is a glass-ui token
    (`node_modules/@mkbabb/glass-ui/dist/styles/tokens.css:163`, the `0.10932…` overshoot),
    retune in unpublished `53c1b07`.
- **Consequence (why this BITES the regime, not just the prose):** after H.W1 lands the
  demo un-double-wrap, the `@mbabb` popover OPENS on glass-ui **3.4.0** (no version
  change). `proof:dock-live` then either (a) goes GREEN on its "popover OPENS" clause
  while its own prose says it greens "ONLY when the consumed glass-ui version fixes it" —
  a false HANDOFF-attributed close (the exact **M3 column-migration false-close** the
  meta-gate H.W8 S3 was built to catch), OR (b) read literally, stays RED forever waiting
  on a glass-ui D9 fix that will never ship (D9 is already fixed in kf). Either way the
  gate is mis-specified, and it lives INSIDE the meta-gate's own exemplar set (CH-4),
  undermining the chronic-closure discipline it is meant to demonstrate.

**Concrete doc edit:** **Split CH-4 / `proof:dock-live` into its two distinct owners.**
1. **D9 (popover) → kf-owned, born-RED, gated in H.W1 (H1 above).** Move the "popover
   OPENS on click" assertion OUT of `proof:dock-live` and into H.W1's new
   `proof:popover-opens` (a SHIP-in-H kf gate that greens when H.W1 lands the demo fix —
   NOT a glass-ui handoff). Update `a-deferred-chronic.md` DC-5/CH-4 row and the H.W8 S3
   meta-gate table: CH-4's D9 component closes via a **SYSTEM-property/SHIP gate
   (`proof:popover-opens`)**, not a HANDOFF.
2. **D5 (dock lag) → glass-ui-HANDOFF, born-RED, stays in H.W8.** Keep `proof:dock-live`
   for the DOCK-SPRING half ONLY: "dock expand/collapse settles ≤1 frame / ≤6% overshoot
   ≤200ms" — green only when glass-ui ships `53c1b07` (≥3.4.1). This matches the §4 table
   `proof:dock-morph-settled` row (`gap-scorecard:172`) — fold the two so there is ONE
   dock-spring HANDOFF gate, not a D5+D9 bundle. Edit H.W8:46's BITE line to drop "D9
   popover-not-opening" and "fixes D5/D9" → "fixes D5".
3. In `a-deferred-chronic.md:166` (DC-5) and the H.W8 chronic→gate table, change CH-4's
   "H closure" from the bundled `proof:dock-live (popover + spring)` to the PAIR:
   `proof:popover-opens` (kf SHIP, H.W1) + `proof:dock-morph-settled`/`dock-live-spring`
   (glass-ui HANDOFF born-RED, H.W8).

### M1 (MED) — `proof:dock-live` claims D9 ships in the *consumed glass-ui*, but D9 is the demo's wrapper — the HANDOFF "do NOT patch in kf" instruction is wrong for D9

**Location:** `H.W8.md:46,70`; `a-deferred-chronic.md:166`.

**Defect:** H.W8:70 §Design-decisions: "`proof:dock-live` is born-RED and green ONLY when
the consumed glass-ui (AW tranche) version fixes **D5/D9** … do NOT patch in kf." For D9
this instruction is actively harmful: D9 MUST be patched in kf (the App.vue un-double-wrap)
— it cannot be fixed by glass-ui because glass-ui 3.4.0 is already correct. The "dock
memory rule" (all dock changes in glass-ui) is correct for the dock CHROME (lag, spring),
but the `@mbabb` popover wrapper is **demo markup in App.vue**, not dock chrome — the
memory rule does not apply to it. Leaving "do NOT patch in kf" attached to D9 risks the
implementer declining the correct demo fix.

**Concrete doc edit:** subsumed by H2's split — once D9 is removed from `proof:dock-live`
and homed in H.W1 `proof:popover-opens` (a kf SHIP gate), strike "D9" from H.W8:46,70's
"do NOT patch in kf" scope; the instruction then correctly applies only to D5 (the dock
spring), which IS glass-ui-owned.

### L1 (LOW) — H.W5 §Scope lists S5 after S6 (out-of-order numbering)

**Location:** `H.W5.md:37` (S5 last in §Scope) vs `:46` (S6 in §Hard-gate before S5).
Cosmetic drafting slip; reorder S5 before S6 or renumber. No substance impact. (Detail in
PART A3.)

---

## What is SOUND (no finding manufactured)

- **D8 / H.W5 icon mechanism:** correct, feasible, well-gated. `vite-svg-loader
  ?component`, `SceneDescriptor.icon?: Component`, `<component :is>`, the PNG KILL, the
  `proof:scene-icons` coverage + theming + no-raster clauses — all bite real defects
  re-confirmed live (4-of-9 icons, baked-hue SVG, `<img>` theme-blindness). The theming
  clause (G4) is correctly load-bearing (an `<img>` SVG fails it by construction — the
  vector-alone-is-insufficient adjudication is RIGHT).
- **D9 ROOT CAUSE:** the double-wrapped trigger / `handlerCount:2` / two-toggles-cancel is
  EXACTLY right and re-confirmed live. The single-toggle counter-proof + the engine-healthy
  finding hold. glass-ui 3.4.0 `DockDropdownTrigger`-is-the-reka-trigger is verified in
  node_modules.
- **The D9 DEMO FIX itself:** correct + feasible on glass-ui 3.4.0 (un-double-wrap +
  `useOptionalDockContext` keepOpen) — every API exists and is typed; the `DockSelectTrigger`
  precedent + the ChromeDock keepOpen mutex are real. The fix is sound; only its
  wave-wiring (H1) and gate-ownership (H2/M1) are defective.
- **D5 (dock lag):** genuinely glass-ui-owned (`--spring-dock` token retune) — the HANDOFF
  framing is correct FOR D5. The error is bundling D9 into it.

---

## Evidence index (this lane)

**Live (Playwright MCP, :5173):**
- `@mbabb` button live: `handlerCount:2`, `aria-haspopup=menu`, `data-state=closed`,
  `id=reka-dropdown-menu-trigger-v-2`; double-handler invoke → stays closed; single
  `onOpenToggle()` → `open:true / data-state:open / [role=menu]` with all 4 items.
- `/#/easing` dock pill = `<img alt="easing scene" src="data:image/svg+xml,…">`;
  `/#/spring` overridden to `/#/`, dock shows `lucide-house` + "Home" (the `<Home>`
  fallback live); console `next()` deprecation warnings; autonomous route cycling (D12).
- Screenshot: `/Users/mkbabb/Programming/keyframes.js/hd-mbabb-popover-forced-open.png`
  (forced-open menu; dock recollapsed behind it = keep-open gap).

**node_modules (glass-ui 3.4.0):**
- `dist/components/custom/dock/DockDropdownTrigger.vue.d.ts` — props `DropdownMenuTriggerProps & {…}`.
- `dist/dock.js` — `DropdownMenuTrigger as W` from reka; `DockDropdownTrigger` renders `g(L(W),…)`; trailing export `a as useOptionalDockContext`.
- `dist/components/custom/dock/composables/dockContext.d.ts:40` — `useOptionalDockContext: () => DockContext | null` (+ `keepOpen/release`).
- `dist/components/custom/dock/composables/useDockState.d.ts:44-46,63` — keepOpen/release (timer-collapse suppression only).
- `dist/styles/tokens.css:163` — `--spring-dock: linear(0, 0.10932 …)` (D5 owner, glass-ui).

**Source (this lane):**
- `demo/app/App.vue:18-21` (double-wrap), `:152` (import `DropdownMenuTrigger`), `:154` (import `DockDropdownTrigger`).
- `demo/@/components/custom/dock/ChromeDock.vue:25-30` (`sceneIcons` 4 keys), `:171,194,210` (`<img :src>`), `:172,180,211` (`<Home>`), `:144,170` (`DockSelectTrigger` precedent), `:82-101` (keepOpen mutex), `:116,205,217` (GlassDock + `#items` slot).
- `demo/app/scenes.ts` (9 ids; `SceneDescriptor` has no `icon`); `assets/icons/*` (3 `-sm` PNG + 3 orphan `-lg` PNG 60.6KB + easing SVG baked hue).

**Docs:**
- `H.md:181,326,329` (charter routes D9→H.W1 S5 popover) vs `H.W1.md:44,52-60` (wave S5 = SUSPEND, 0 popover mentions, no `proof:popover-opens`).
- `H.W8.md:46,70` (`proof:dock-live` bundles D5+D9, glass-ui-gated).
- `_SYNTHESIS-gap-scorecard.md:67` (D9 = SHIP-in-H demo), `:173` (§4 handoff = D5 only, no D9).
- `a-deferred-chronic.md:115-116,166` (CH-4/DC-5 bundle); `a-mbabb-popover.md:151-159,181-188` (the two D9 gates + the glass-ui RECORD-only ask).
