# Tranche H DEEP harden — lane `hd-handoff-soundness`

**Charge.** Cross-repo HANDOFF soundness: is each glass-ui / value.js / parse-that / deploy
HANDOFF (a) correctly NOT-kf-authored (inv-16), (b) paired with a born-RED kf gate, (c)
accurately anchored (does glass-ui `53c1b07` actually carry the dock retune; is it actually
unpublished?). Is the "formerly-working dock" characterization accurate? Is the dock-lag truly
glass-ui-owned or is there a demo-side contributor H must also fix? Are the value.js next-slice
items real + do they ride the next re-pin?

**Method.** Read the handoff charter (`valuejs-parsethat-glassui-handoff.md`) + `a-historical-dock`
+ `a-perf-dock-lag` + `a-glass-ui-consumption`; cross-verified EVERY load-bearing anchor against
the sibling repos (`glass-ui`, `value.js`, `parse-that`), the kf `node_modules`, the kf source,
and the LIVE demo (`:5173`, Playwright). The verdict below is grounded in commit hashes, installed
package versions, and live computed-style reads — not the audits' restatements.

**Verdict.** The handoff's STRUCTURE is sound — inv-16 is honored (zero sibling-authored kf
edits), the pairing discipline is correctly applied, and the value.js/parse-that/deploy rows are
accurately anchored and genuinely OPEN. BUT the load-bearing GH-1 dock row rests on a **factually
STALE premise that the live repo refutes**: `53c1b07` is NOT unpublished — it has shipped in
glass-ui 3.5.0, 3.5.1, and the 3.6.0 cut. The whole "glass-ui releases `53c1b07`, THEN kf bumps"
sequencing is wrong; the kf consume-leg is unblocked RIGHT NOW. That is a BLOCKER for the row as
written. A second HIGH defect: the GH-5 reka-ui gate is infeasible as authored (14 legitimate
shadcn-vue reka imports + the named SelectIcon reach is already killed).

---

## FINDINGS

### F1 (BLOCKER) — GH-1: `53c1b07` is NOT unpublished — it shipped in glass-ui 3.5.0 / 3.5.1 / 3.6.0; the sequencing is stale

**Doc location.** `valuejs-parsethat-glassui-handoff.md` GH-1 (§1, lines 124-125, 137, 152-153,
569); echoed in `H.md:182,415,417,490`; sourced from `a-historical-dock §2/§4` and the
gap-scorecard.

**The claim.** The charter states the AW.W2 retune "landed **AFTER the 3.4.0 cut**… **It is not
in the published package kf installs**" (:124-125), and the disposition is "glass-ui-HANDOFF —
release `53c1b07` (≥ `3.4.1` / `3.5.0`), THEN kf bumps `@mkbabb/glass-ui`" (:137). The sequencing
DAG (:569) reads `release 53c1b07 (≥3.4.1) ─→ kf bumps glass-ui ─→ proof:dock-morph-settled`.

**The defect — the live repo refutes "unpublished."** Verified in `/Users/mkbabb/Programming/glass-ui`
(re-checked this pass):
- `53c1b07` "feat(dock): retune --spring-dock to the iOS-control settled band (AW.W2 part 1)"
  dated `2026-06-07 13:48:33` — it DOES carry the retune (token regen `0.10932 → 0.10282`, the
  +18.5% → +4.6% register; `useLayerTransition.ts` `DOCK_SPRING` change). The (c) "does it carry
  the retune" check PASSES.
- BUT `git merge-base --is-ancestor 53c1b07 638746b` → **YES**: `53c1b07` is an ancestor of
  `638746b` = **`chore(release): glass-ui 3.5.0`** (dated `2026-06-07 14:45`, ~1h after the retune).
  It is also an ancestor of `2b8cbe0` (3.5.1) and `fb6941a` (the 3.6.0 cut). glass-ui repo HEAD is
  now `3793573`, `package.json` version **`3.6.0`**.
- So the retune is **PUBLISHED in 3.5.0+**. The charter's central premise ("unpublished," "not in
  the published package") is FALSE as of this repo state. The audits were written against an
  earlier glass-ui HEAD (`a-historical-dock` header pins glass-ui @ `53c1b07`, before the 3.5.0 cut)
  and the charter inherited the stale snapshot without re-checking the release graph.

**What IS still true (the part to preserve).** kf STILL INSTALLS the bouncy register. Verified:
`node_modules/@mkbabb/glass-ui/package.json` → `3.4.0`; `package.json` pin `@mkbabb/glass-ui:
"^3.4.0"`; installed `tokens.css` `--spring-dock: linear(0, 0.10932 …` (OLD register, grep count
1 for `0.10932`, 0 for `0.10282`). LIVE at `:5173`: `getComputedStyle(:root)['--spring-dock']`
→ `linear(0, 0.10932 2.041%, …` = OLD(+18.5%); `.glass-dock` is content-sized 117×55,
`contain:none` (the 3.3.0 sliver IS healed). So `proof:dock-morph-settled` being **born-RED on the
installed token is correct** — the user-felt bounce is real today.

**Why it's a BLOCKER (not just a date nit).** The disposition is mis-sequenced. The charter waits
on a glass-ui *release event* that has ALREADY HAPPENED. As written, H.W8/S4 would sit waiting for
glass-ui to "release `53c1b07`" — a no-op — while the actual unblocked work (bump
`@mkbabb/glass-ui ^3.4.0 → ^3.5.0` or `^3.6.0`, re-assert `proof:dock-morph-settled` GREEN) is
NOT scheduled as the live consume-leg. The chronic-closure terminal is real but its gating
predecessor is mis-stated, so the wave cannot be implemented against the named sequence.

**Concrete doc edit.**
- GH-1 (:124-125): replace "landed AFTER the 3.4.0 cut… It is not in the published package kf
  installs" with: "landed AFTER the 3.4.0 cut, but **HAS SINCE shipped — `53c1b07` is an ancestor
  of glass-ui `3.5.0` (`638746b`), `3.5.1`, and the `3.6.0` cut (verified `git merge-base
  --is-ancestor`). kf installs `3.4.0` (pin `^3.4.0`), which PREDATES the retune — the installed
  `--spring-dock` is still the +18.5% register (live-verified `:5173`).** The fix is published; the
  kf consume-leg is UNBLOCKED NOW."
- GH-1 disposition (:137): replace "release `53c1b07` (≥`3.4.1`/`3.5.0`), THEN kf bumps" with
  "**kf bumps `@mkbabb/glass-ui` `^3.4.0 → ^3.5.0` (or `^3.6.0`); the retune is already published.
  The bump is the consume-leg — no glass-ui release is owed.**"
- DAG (:569): `kf bumps @mkbabb/glass-ui ^3.4.0→^3.5.0 (retune already in 3.5.0+) ─→
  proof:dock-morph-settled` (drop the "release 53c1b07" predecessor).
- Sequencing (:152-153, :597, :609-612) and `H.md:182,417,490`: strike "release `53c1b07` then
  kf bumps"; the row is now a pure kf-side bump-and-reassert, still glass-ui-HANDOFF in PROVENANCE
  (kf does not author the spring) but no longer release-blocked.

**NB — blast-radius the corrected bump must surface (MEASURE-FIRST, not silent).** The 3.4.0→3.5.0+
jump is NOT spring-only: `fb6941a` (3.6.0 cut) shows `W3 dock layering polish` touching
`GlassDock.vue` (+56L), `useLayerTransition.ts` (+75L), `dock.css` (+186L), plus a `DockLayer`
re-home and `big-dock` `shape`/`layout` props. The charter currently frames GH-1 as a clean
token-only consume. H must verify the bump doesn't regress `ChromeDock.vue`'s slot contract (the
`#collapsed`/default-slot pair, `a-historical-dock §5`) — add a one-line note to GH-1: "the bump
crosses 3.5.0's dock-layering polish; re-run `proof:dock-dropdown-opens` + the slot-shape check
post-bump (not just `proof:dock-morph-settled`)."

---

### F2 (HIGH) — GH-5: the `grep ZERO from "reka-ui"` gate is infeasible; the named SelectIcon reach is already killed

**Doc location.** `valuejs-parsethat-glassui-handoff.md` GH-5 (§1, lines 268-280); DAG :574.

**The claim.** "the one direct `reka-ui` `SelectIcon` reach… the demo historically reached PAST
glass-ui to reka-ui for one chevron-slot primitive" (:268-270); gate = "a `grep` clause in
`proof:boundary`/`proof:decomposition` asserting ZERO direct `from "reka-ui"` in `demo/`" (:278).

**The defect — two parts.**
1. **The gate cannot be GREEN.** The demo has **14 direct `from 'reka-ui'` imports**, ALL in the
   shadcn-vue `demo/@/components/ui/menubar/` scaffold (Menubar, MenubarContent, MenubarItem,
   MenubarSub, MenubarTrigger, …, verified by grep). This is the idiomatic shadcn-vue pattern:
   the menubar primitives ARE thin reka-ui re-wraps, and glass-ui does NOT own a Menubar family
   (it owns Select/Dock/Dialog/Drawer/forms — verified in `a-glass-ui-consumption`). A
   `grep ZERO from "reka-ui"` gate would be born-RED-and-STAY-RED against 14 legitimate files; it
   cannot bite "a new raw-reka reach" without drowning in the scaffold baseline. The gate as
   authored is unimplementable.
2. **The named reach is ALREADY gone.** `SelectIcon` appears in the demo ONLY as a comment at
   `AnimationMenuBar.vue:36`: "directly, not via reka's SelectIcon slot" — i.e. the demo already
   uses the icon slot directly and does NOT reach for reka's `SelectIcon`. The "demo-local KILL"
   the charter offers as the disposition has effectively already happened. There is no live
   `import { SelectIcon }` from reka-ui anywhere in `demo/`.

**Why HIGH not LOW.** GH-5 is LOW-urgency by content, but it ships a GATE the charter binds into
`proof:boundary`/`proof:decomposition` (H.W5/H.W8). A gate that can never be GREEN is worse than
no gate — it either reds the wave permanently or gets `|| true`-ed into uselessness, which is
exactly the gate-rot the H meta-gate is meant to prevent. Inv-16 honesty also requires not
claiming a "reach" that no longer exists.

**Concrete doc edit.**
- GH-5 (:268-270): replace the "one direct SelectIcon reach" framing with: "the demo's only
  documented past `reka-ui` `SelectIcon` reach is **already retired** (`AnimationMenuBar.vue:36`
  comment confirms the icon slot is used directly, not via `SelectIcon`). The 14 live
  `from 'reka-ui'` imports are the **idiomatic shadcn-vue `ui/menubar/` scaffold** — reka is the
  documented basis for that family; glass-ui does not own a Menubar. This is NOT a defect."
- GH-5 gate (:278, DAG :574): replace "ZERO `from "reka-ui"` in `demo/`" with a SCOPED clause:
  "`proof:boundary` asserts no NEW raw-reka reach **outside `demo/@/components/ui/` (the shadcn
  scaffold) AND outside glass-ui-owned families** — i.e. zero direct reka import where glass-ui
  already exposes the surface (Select/Dock/Dialog/Drawer)." Or, more honestly: **downgrade GH-5 to
  RECORD/§ALREADY-RESOLVED** — the reach is gone, the menubar scaffold is legitimate, no kf action
  is owed.

---

### F3 (MED) — the `engine.ts:516,576` "single-dispatch seam" anchor is stale (the seam is real, the line cite is wrong)

**Doc location.** `valuejs-parsethat-glassui-handoff.md` :56, :465, :601, :640 (cited repeatedly
as "the H live anchors `engine.ts:516,576`"); the load-bearing justification for "every value.js
row is zero-kf-edit."

**The defect.** The cited lines do not contain the seam. Verified: `src/animation/engine.ts:514-518`
is option-setter code (`setRespectReducedMotion`), `:574-578` is `setDirection/setFillMode/
setColorSpace`. The actual `lerpValue` call-site is `engine.ts:779` (`lerpValue(eased, iv)`);
`lerpValue` is imported at `:18`. The `iv._lerp` form the charter names does not appear in
`engine.ts` at all (the dispatch is inside `lerpValue` in value.js / `utils.ts`, not an inline
`iv._lerp` in engine).

**Why MED not NIT.** The SEAM IS REAL (the value.js zero-kf-edit guarantee holds — verified: all
VJ rows are genuinely OPEN, below), so the substantive claim survives. But the charter cites
`516,576` as a re-verified live anchor "(2026-06-07)" in its inv-ε compliance section (:640),
which is the section that certifies every claim is file:line-checked. A wrong anchor there
undermines the inv-ε guarantee and would mislead an implementer trying to find the seam.

**Concrete doc edit.** Replace every `engine.ts:516,576` with `engine.ts:18,779` (the `lerpValue`
import + the `lerpValue(eased, iv)` call-site), and drop the `iv._lerp` form (or relocate that
phrasing to value.js where the per-ValueUnit `_lerp` dispatch actually lives). Re-state as: "the
single call-site `lerpValue(eased, iv)` (`engine.ts:779`) that dispatches into value.js — the
structural reason every value.js row is zero-kf-edit."

---

### F4 (LOW) — the `proof:dock-morph-settled` measurement caveat is sound, but should name BOTH arms explicitly

**Doc location.** `valuejs-parsethat-glassui-handoff.md` GH-1 (:142-149, :158-160, the §H-dock-4
caveat); `a-historical-dock §2`.

**Adjudication of the cross-audit tension (NOT a defect — a reconciliation worth recording).**
`a-historical-dock` calls the morph "`SpringProgress`-driven"; `a-perf-dock-lag` M2 MEASURED
"CSS-transition-driven, 0 inline writes" and concluded "the JS spring is NOT stalling." These are
NOT contradictory and the charter's framing is CORRECT: verified in installed
`dock.css` — `--dock-motion-resize: var(--duration-normal) var(--dock-resize-spring)` (:26),
`--dock-resize-spring` resolves to `var(--spring-dock)`, and `.dock-layers { transition: width
var(--dock-motion-resize) }` (:466). So the CSS `width` transition's *timing function IS the
spring `linear()` ramp* — the token retune fixes the CSS-transition arm AND the FLIP arm because
they share the synced token (`proof:spring-tokens-synced`). The charter's "the token retune is the
fix" is sound; `a-perf-dock-lag`'s "not a JS spring stall" is about main-thread cost, not a
contradiction.

**The small gap.** The caveat says sample "the VT pseudo-elements OR the `SpringProgress` clock —
NOT live `getBoundingClientRect`." Verified correct for BOTH arms: glass-ui
`useLayerTransition.ts` native path = `startViewTransition` with "ZERO getBoundingClientRect"
(snapshots), FLIP path = "drive size off ONE SpringProgress clock in PIXEL space" (:386-399). So
live element geometry under-reads in both. The caveat is RIGHT — but it should say WHY for each
arm so an implementer picks the correct instrument per the forked path (the demo forks at
construction: `"startViewTransition" in document`).

**Concrete doc edit.** Append to the §H-dock-4 caveat (:158-160): "Per glass-ui
`useLayerTransition.ts`: the **native VT arm** runs on `startViewTransition` snapshots (sample the
`::view-transition-*` pseudo-elements); the **FLIP arm** drives a `SpringProgress` clock in pixel
space (subscribe to the clock). The demo forks at construction on `'startViewTransition' in
document` — `proof:dock-morph-settled` must branch the same way."

---

### F5 (LOW) — the demo-side dock contributors (`collapse-delay:2500`, backdrop re-blur) are correctly homed but under-gated relative to `a-perf-dock-lag`'s findings

**Doc location.** `valuejs-parsethat-glassui-handoff.md` GH-1 (:159-160, parenthetical: the
`collapse-delay` 2500→~1000 tune is "a kf-demo SHIP, H.W2-adjacent, MEASURE-FIRST — NOT this
charter"); `H.md:182,417,420`; `a-perf-dock-lag` F1/F2/F4.

**Is the dock-lag truly glass-ui-owned, or is there a demo-side contributor H must also fix? —
YES, there are demo-side contributors, and the charter acknowledges them but routes them OUT of
its scope without confirming they are gated elsewhere.** Verified:
- `ChromeDock.vue:116` — `:collapse-delay="2500"` `:start-collapsed="true"` `:fit-content="true"`
  are ALL demo-authored props. The 2500ms auto-collapse + the start-collapsed veil
  (`pointer-events:none` on `dock-layer--full`, `a-perf-dock-lag` M7) sit in front of every dock
  action — a demo-side contributor to the "broken/laggy/won't open" perception that is NOT the
  glass-ui spring.
- `a-perf-dock-lag` F1 (the dominant smoothness defect): ~1M px² of `backdrop-filter` glass cards
  stacked over the continuously-animating scene host (`App.vue:119-137`) — a DEMO-COMPOSITION
  defect, explicitly "demo-fixable now," with a proposed `proof:demo-backdrop-budget` gate.

**The gap.** The charter correctly says these are demo-side (inv-16 holds — they are NOT glass-ui
HANDOFFs), and `H.md:182` does tag "SHIP-in-H (`collapse-delay`, MEASURE-FIRST)." But the
`collapse-delay` tune appears in `H.md` ONLY (grep of `docs/tranches/H/waves/` for
`collapse-delay`/`2500` = ZERO hits) — no WAVE actually homes it with a gate, and the
`a-perf-dock-lag` F1 backdrop-budget gate (`proof:demo-backdrop-budget`) is not carried into any H
wave at all. The risk: D5's demo-side half repeats the M3 column-migration — "routed to a SHIP"
on paper, never gated, silently dropped. This is exactly the failure mode H exists to close.

**Concrete doc edit.** This is not a charter (cross-repo handoff) defect per se — the routing is
correct — but the charter should add a one-line cross-reference so the demo-side half is not
orphaned: in GH-1's §H-dock-4 parenthetical (:159-160), after "NOT this charter," add: "→ the
demo-side D5 contributors (`collapse-delay` 2500→~1000 at `ChromeDock.vue:116`; the
`a-perf-dock-lag` F1 ~1M px² backdrop-over-moving-scene stack) MUST be homed in a kf-demo wave
with `proof:dock-actions-reachable` + `proof:demo-backdrop-budget` — verify H.W2/H.W7 carry them
(currently `H.md`-only, no wave anchor)." (A note for the wave-soundness lanes; flagged here
because the cross-repo charter is where the glass-ui/demo split is adjudicated.)

---

### F6 (NIT) — the "formerly-working dock" characterization is ACCURATE; record the confirmation

**Doc location.** `a-historical-dock` TL;DR/§1/§6; charter GH-1 §ALREADY-SOTA (:284-291).

**Confirmation (no defect).** The charter's claim that the dock is "NOT broken many versions ago
and lost — its LOCAL animation engine was deliberately replaced by glass-ui's SUPERIOR spring/VT
engine" is well-supported. The git archaeology in `a-historical-dock §1` (commits `3b8b468` →
`e82633e` local high-water → `940150e` pivot → `1b9b05f` D.W5/G.W12 rename+barrel-delete) is a
coherent, evidence-backed arc. The installed glass-ui dock IS the superior engine: verified
`useLayerTransition.ts` (397L, native VT + FLIP off one `SpringProgress`, velocity-continuity on
retarget) is real in the glass-ui repo, and the installed `dock.js` ships `startViewTransition` +
`SpringProgress`. The "two regressions are pure consume-leg gaps" thesis (unretuned spring +
unwired @mbabb popover) is correct and the D9 popover root-cause (`App.vue` missing `keepOpen` +
`data-glass-dock-portal`) is precisely traced. inv-16 honored: dock fixes are HANDOFF (spring) +
SHIP-in-kf (the kf-side App.vue wiring, correctly NOT a glass-ui patch). No edit needed — recorded
per inv-ε honesty (do not manufacture a finding where the authoring is sound).

---

## value.js / parse-that / deploy — verified accurate (the part the charter got RIGHT)

Unlike the dock, these rows are accurately anchored and genuinely OPEN — the sibling repos have
NOT moved past the charter's premise (the staleness is dock-specific):

- **value.js next-slice (VJ-1..VJ-9) — all real + OPEN, ride the next re-pin (ZERO kf edit).**
  Verified installed value.js `0.11.1`; value.js repo HEAD also `0.11.1` (`b4defb0`, no unpublished
  next-slice landed). VJ-1: `parseLinearStops`/`parseLinear` ABSENT from value.js dist (kf shim
  present `utils.ts:106`/`:192` — confirmed). VJ-2: `getPointAtLength`/`samplePath` ABSENT. VJ-6:
  `unflattenObjectToString` is the allocating-only form (no out-buffer overload in `index.d.ts`).
  VJ-4 MCI-5 born-RED witness CONFIRMED LIVE: `test/interpolate-anything.test.ts:256-262` is an
  `it.fails(...)` that flips RED on land — the model paired gate, accurately described. The
  zero-kf-edit guarantee rests on the lerpValue seam (real, though mis-anchored — see F3). All
  dispositions sound; inv-16 honored (value.js authors, kf consumes on re-pin).

- **parse-that PT-1 — accurately anchored, disposition sound.** Verified parse-that source/installed
  both `0.9.0` (repo HEAD `6fb9de2` = the 0.9.0 publish; not moved past). `packrat.ts:16-26` DOES
  document the limitation verbatim ("the MEMO is keyed on the parser id only, not (id, offset)…
  BOOKED as a dedicated packrat-soundness tranche"); `:61` is `MEMO.get(p.id)`, `:82` is
  `MEMO.set(p.id, …)` — id-only key CONFIRMED. The disposition (parse-that-INTERNAL, zero
  production consumers, NOT a re-pin predecessor, `proof:packrat-position` FIRST then re-key, NO kf
  gate) is correct and a textbook chronic handoff (no kf gate owed because zero consumers — the one
  legitimate exception to the pairing rule, correctly carved out).

- **deploy DEP-1..DEP-3 — correctly scoped as deploy-owned, kf-authors-target.** `deploy-pages.yml`
  confirms `keyframes` → `keyframes-8uq.pages.dev` (CF Pages, not gh-pages) — the authoritative
  CNAME target the charter says kf authors and deploy writes (DEP-1 P0). Disposition sound; no kf
  write; aligns with the MEMORY `project_deploy_cloudflare_pages` note.

---

## INV-16 / pairing-discipline compliance (the charter's spine) — HOLDS

- **inv-16 (consume PUBLISHED; AUDIT+SUGGEST+HANDOFF, never kf-author).** Honored throughout. No
  row authors a sibling fix inside kf. The dock spring is explicitly NOT forked (`NO kf-side
  patching of the spring`); the @mbabb popover fix is correctly SHIP-in-kf (it IS kf's wiring bug,
  not a glass-ui patch). The memory rule "all glass-ui/dock changes in glass-ui repo" is respected.
- **The pairing rule (a HANDOFF is a terminal only when paired with a born-RED kf gate).** Applied
  to every row: GH-1 `proof:dock-morph-settled`, GH-2 `proof:no-orphan-specular`, GH-3
  `proof:drawer-spring`, GH-4 demo-smoke VT-types, VJ-1 grep=0, VJ-4 `it.fails`, VJ-5 malformed
  test, VJ-6 zero-alloc fold. The two un-paired rows are correctly carved out: PT-1 (zero
  production consumers → no kf gate, by design) and VJ-7 LRU (no kf policy by design). These are
  legitimate exceptions, not pairing-discipline violations. The discipline itself is sound.

The pairing structure is the charter's strongest feature and survives the adversarial pass intact.
The single load-bearing failure is F1: the dock row's FACTUAL premise (53c1b07 unpublished) is
refuted by the live glass-ui release graph, which mis-sequences the one chronic the whole charter
is built around.
