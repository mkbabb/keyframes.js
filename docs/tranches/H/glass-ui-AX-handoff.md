# keyframes.js Tranche H → glass-ui AX tranche — the HAND-OFF items

The glass-ui-owned surfaces keyframes.js' Tranche H surfaced (audited, never patched in
kf — inv-16: kf consumes glass-ui PUBLISHED, sibling items are HAND-OFFs). Each item carries
**what glass-ui should do · the glass-ui anchor · the paired born-RED kf gate (the consume
signal — it greens in kf only when glass-ui publishes) · priority**. Source: the H tranche
hand-off charter (`docs/tranches/H/valuejs-parsethat-glassui-handoff.md`) + H.W2 §S5 + H.W9 §5.

> kf branch `tranche-h-impl`, consuming glass-ui `^3.4.0` (moving to `^3.5.1` — see G-0).
> The demo's `@mkbabb/glass-ui → src` dedup self-alias stays (AW-endorsed, `vite.config.ts`).

---

## G-0 — the dock-spring retune — ALREADY DONE (informational; no AX action)

The pre-AW.W2 bouncy `--spring-dock` (the dock LAG chronic, ramp peak +16.3%) was retuned in
glass-ui `53c1b07` and **is published** (`3.5.0`/`3.5.1`/`3.6.0` — `git merge-base
--is-ancestor 53c1b07 v3.5.0` → YES). **No AX work** — kf consumes it via a one-line bump
`^3.4.0 → ^3.5.1` in H.W8, gated born-RED by `proof:dock-morph-settled` (the `--spring-dock`
ramp-peak ≤ +6% token check). Listed only so AX doesn't re-open it.

---

## G-1 — the Card specular SEAM: wire-or-omit + a calmer default  ·  **RESOLVED — kf green on ~3.5.1; 3.8.0 is a cosmetic upgrade**

> **STATUS UPDATE (2026-06-08, kf W8 — RESOLVED).** The AX session already fixed this at glass-ui
> HEAD (`6fac61a`/`eaba94f`, AX.W09 "specular-tune-to-subtle"): the opt-in `specular?: off|subtle|
> full` prop, default **`off`** — exactly the wire-or-omit ask below; their W09 audit names
> keyframes in the §24 confirmation + routes to **W34**. The fix is UNPUBLISHED, but **kf does not
> need it to ship.** Grounded live across the published line: at **3.4.0** the glass Card paints a
> visible dead-centered bloom (bad); at **3.5.0/3.5.1** glass-ui **already killed the visible bloom**
> (the pointer-radial is dead at rest — the stages are visually clean; only the inert
> `.glass-specular-track` *class* remains); 3.6/3.7 re-regress. So **kf pins `~3.5.1`** — the sweet
> spot: **visible bloom dead AND the dock-spring retune present** → `proof:dock-morph-settled`
> **GREEN** (D5 closes for real, a passing SYSTEM gate, NOT a born-RED HANDOFF). The specular issue
> was a **kf-internal gate contradiction**: `proof:no-orphan-specular` (authored at W9, "every Card
> cartoon, exception ∅") vs `proof:stage-glass-card` (W11 I5 REQUIRES the stages glass). Resolved by
> **reconciling no-orphan-specular** — the 5 W11 glass stages are the sanctioned `surface="glass"`
> exception (the inert glass-ui track is glass-ui-owned residue), the gate still bites panel-specular
> + visible blooms + un-sanctioned glass. **No kf override, no `!important`, no fork** (inv-16). The
> **3.8.0 consume-edge is COSMETIC**: bumping + `specular="off"` removes the inert class (a tidy-up,
> not an unblock) — kf's W34 leg. Communicated at the AX coordination root:
> `glass-ui/docs/tranches/AX/coordination/from-keyframes-W8-specular-consume-edge.md`.

**The defect.** glass-ui's `<Card surface="glass">` (via `CardFooter:37`) emits the
`.glass-specular-track::before` mouse-tracked radial **on every glass Card, with no
`--mouse-*` writer** — so a consumer that doesn't wire pointer tracking gets a static,
dead-centered, `screen`-blended white bloom (rest α 0.55 — too hot as a resting default).
Live in the kf demo: ~13 glass hosts, 0 pointer-wired (`glass-specular-track.css`).

**The AX ask (two legs).**
1. **Wire-or-omit** — a glass surface either writes `--specular-x/--specular-y` from pointer
   itself (as `dock.js` already does for the dock), OR does **not** emit `.glass-specular-track`
   until a consumer opts in (e.g. a `specular` prop / a `useSpecularPointer`-style seam). A
   mouse-tracked radial with no mouse writer should never be the default.
2. **A calmer DEFAULT intensity** — rest ≤ 0.25 (not 0.55), radius ≤ 40%.

**glass-ui anchors.** `CardFooter*.js:37` (emits the class on `surface==="glass"`);
`glass-specular-track.css` (the `::before`, the `hsl(40 30% 100% / 0.55)` core + `screen` blend);
`dock.js` (the reference pointer-wire).
**Paired born-RED kf gate.** `proof:specular-handoff` (kf, RED until glass-ui ships the
wire-or-omit + the calmer default; flips GREEN on the published bump). NB: kf's H.W9 now
*removes* the tracked specular demo-side entirely — but the upstream **default** is still the
defect for every other glass-ui consumer; the ask stands.

---

## G-2 — the dock-icon specular tune  ·  **MED** (same family as G-1)

**The defect.** `dock-icon-button` hard-codes `.glass-specular-track` (`dock.js:568`). The dock
*does* wire `--mouse-*`, so this is a **tuning/intensity** ask, not a wire-up — the same
over-hot centered bloom on the dock icons. Ties to the dock polish AW already owns.
**Paired kf gate.** Rides `proof:specular-handoff` / the dock-spring `proof:dock-morph-settled`.

---

## G-3 — `LabeledField orientation="horizontal"` (label-LEFT / value-RIGHT)  ·  **HIGH** (NEW, the settings-row idiom)

**The ask.** Add an `orientation` (or `inline`) prop to `<LabeledField>` that lays the row out
**label-left / value-right** instead of label-above-value:
```css
.labeled-field[orientation="horizontal"] {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: …;
}
.labeled-field[orientation="horizontal"] .error { grid-column: 1 / -1; }
```
Every `Labeled*` consumer (and EditorHeader) then inherits the compact settings-row layout by
ONE prop, instead of each re-authoring a `grid-cols-[auto_1fr]` wrapper. This is the **durable
home** for keyframes.js' controls-row layout (the user's "labels on the LEFT, values on the
RIGHT" — the macOS/iOS settings-row idiom, distinct from the labels-above data-entry-FORM idiom).

**glass-ui anchor.** `.labeled-field` display is glass-ui-owned (`utilities.css:62`, block flow today).
**Paired born-RED kf gate.** the amended `proof:single-column-pack` label-left clause (kf greens
on a demo-side `grid-cols-[auto_1fr]` wrapper TODAY — path B — and **durably** on the
`orientation` prop once published). Same class of gap as the W3-booked **label-action slot**
(a small related ask: `<LabeledField>` exposes only `default`+`error` slots today — a label-row
action slot would let the easing "edit pencil" sit in the label row idiomatically).

---

## G-4 — the `{types}` directional View-Transition helper  ·  **MED** (AW VT work)

**The ask.** A glass-ui View-Transition helper that forwards `startViewTransition({ types })`
+ ships the directional `::view-transition-*` CSS, so a consumer can drive *directional* scene
transitions. keyframes.js' `useSceneTransition.ts` is the waiting consumer (it will pass
`{types}` once the helper publishes).
**Paired born-RED kf gate.** a demo-smoke VT-types assertion (RED until the demo consumer passes
`{types}` against a glass-ui that forwards it).

---

## G-5 — `<DrawerContent spring>` prop  ·  **LOW / BOOK** (kf ships its own)

**Status.** glass-ui's vaul-backed `DrawerContent` uses a 500ms `cubic-bezier(.32,.72,0,1)`
(`drawer.css:30`). A `spring` prop (a spring-physics drawer curve) was the original ask — but
keyframes.js' H.W7 mobile drawer **deliberately ships its own** `SpringProgress`-driven sheet
(dogfooding the engine — that's the kf demo's whole point), so this is a **BOOK**, not a blocker.
Useful for glass-ui's own Drawer consumers; not on kf's critical path.

---

## G-6 — (OPTIONAL) a `surface="cartoon" tier="quiet"` preset/alias  ·  **LOW / OPTIONAL**

kf's H.W9 sets `surface="cartoon" tier="quiet"` on ~14 panel Cards (glass + cartoon depth, the
calm register). If that prop-pair reads as repetitive across consumers, glass-ui *could* expose a
single named "glass+cartoon panel" preset/alias. **Not required** — the explicit prop-pair is
born-GREEN today; BOOK only if a named register is wanted. Paired kf gate: `proof:glass-and-cartoon`.

---

### Priority for the AX tranche
1. **G-1** Card specular wire-or-omit + calmer default (HIGH — the design-language root).
2. **G-3** `LabeledField orientation` (HIGH — the durable controls-row home; + the label-action slot).
3. **G-2** dock-icon specular tune · **G-4** `{types}` VT helper (MED).
4. **G-5** Drawer `spring` · **G-6** cartoon+quiet preset (LOW/optional).

**The discipline (why each pairs a kf gate).** Per the chronic-closure rule, every cross-repo
HAND-OFF carries a **born-RED kf gate** so the item can't become a silent forever-punt — it
flips GREEN in keyframes.js' CI only when the glass-ui change ships + kf bumps to consume it.
inv-16 holds throughout: kf consumes the published glass-ui; none of the above is patched in kf.
