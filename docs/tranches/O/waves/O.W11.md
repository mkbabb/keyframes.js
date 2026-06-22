# O.W11 — the glass-ui BC aria-orientation CORRECTION ask (the S1 misidentification cured)

> **AUGMENT (FULL-LOOP-LEDGER `O.W12-WZ-consume` O.W11, 2026-06-22).** The loop CONFIRMED the ARIA defect LIVE on **glass-ui 4.1.0** (the current npm latest, published AFTER O authoring on 2026-06-19): `tabs.js` binds `'aria-orientation': L.value ? 'vertical' : 'horizontal'` UNCONDITIONALLY, regardless of the `role: I.value ? 'tablist' : 'group'` condition — so a mounted `variant="pill"` strip carries a PROHIBITED `aria-orientation="horizontal"` on `role=group` (ARIA 1.2 §6.3). **AUGMENT: the O.W2 content-probe retarget for `proof:workaround-deletion` S1 is NOW a CRITICAL BLOCKER.** Because glass-ui 4.1.0 published between O authoring and the loop run, the S1 arm's `version: '4.1.0'` sentinel fires a **FALSE RED** — it signals "safe to delete" when the SFC fix is ABSENT. **O.W2 MUST be implemented before O.W12** to prevent a premature S1 deletion that would re-break the kf consumers. The gate spec for `proof:glassui-aria-ask` remains correct; born-RED state is confirmed live. Evidence base: `docs/tranches/P/FULL-LOOP-LEDGER.md`.

**Band:** E — sibling dispatch (inv-16: kf asks, never writes the foreign tree).
**Phase:** DISPATCH — a cross-repo ask; the wave authors the outgoing dispatch addendum, not glass-ui source. Its consume half is **GATED** at F.W12 (fires on the BC publish that ships the guard).
**Sequence:** `O.W0 charter ─► E.W11 glass-ui aria ask` (this wave) — authored alongside `E.W10 value.js-P ask`; both are leaf DISPATCH nodes off the charter. The edge it feeds: `E.W11 ──► F.W12 (S1 delete, BC cut) ──► O.WZ close` (`O.md:99-100,125-126`).
**Owning chronic/DM:** the **S1 aria-orientation suppress** (M.W8 Phase-2 / DM-1-adjacent). Not a P-inv-28 ≥4-tranche chronic — it is a **misidentified consume edge** the re-audit corrected: kf's S1 deletion was premised on a glass-ui fix that BC marked "CONFIRMED" but **never actually shipped, and that BC's own byte-fence forbids shipping in its current band** (`O.md:62-67,123-126`; `AUDIT-DIGEST.md` A2/A4).

This wave authors the correction into **`KF-TO-GLASSUI-BC-ADDENDUM.md`** (the outgoing dispatch, mirroring `KF-TO-GLASSUI-BC.md`'s INFORM/ASK format). It **supersedes the M.W8 Phase-2 ASK#2 premise**: M's `KF-TO-GLASSUI-BC.md` ASK-1 (and BC's `KF-INBOUND.md` ASK#2, marked "CONFIRMED") said "glass-ui's segmented/tabs control emits `aria-orientation` correctly so consumers don't need the `:aria-orientation="undefined"` workaround." The re-audit found that **"CONFIRMED" is factually misleading** — the glass-ui fix was misidentified, and the kf S1 deletion premise is therefore **unmet**. O.W11 dispatches the CORRECTED ask.

---

## Context

### The misidentification (what "CONFIRMED" got wrong)

glass-ui BC's `KF-INBOUND.md` ASK#2 declares the aria-orientation fix "CONFIRMED — emitting a real axis-derived value." But the **actual ARIA defect is the opposite of what that confirms**: `aria-orientation` is **DISALLOWED on `role=group` entirely** — per WAI-ARIA 1.2 §6.3 "Inherited and Prohibited Properties" it is a valid state only for:

- **Used in Roles (direct):** `scrollbar`, `select`, `separator`, `slider`, `tablist`, `toolbar`
- **Inherits into Roles:** `listbox`, `menu`, `menubar`, `radiogroup`, `tree`, `treegrid`

Emitting "a real axis-derived value" on `role=group` is **still a spec violation** — the value being "real" does not make the attribute permitted on that role.

The glass-ui `SegmentedTabs.vue` renders TWO roles off one `variant` axis and emits `aria-orientation` on BOTH:

```vue
<!-- glass-ui/src/components/custom/tabs/SegmentedTabs.vue:405-406 -->
:role="isUnderline ? 'tablist' : 'group'"
:aria-orientation="isVertical ? 'vertical' : 'horizontal'"
```

- `variant="underline"` → `role="tablist"` → `aria-orientation` is **PERMITTED** (tablist is in the allow-list). ✓
- `variant="pill"` (the **DEFAULT**, `SegmentedTabs.vue:114,121`) → `role="group"` → `aria-orientation` is **PROHIBITED**. ✗

Line 406 binds `aria-orientation` **unconditionally** — NOT conditioned on `isUnderline` (`SegmentedTabs.vue:141` `isUnderline`, `:152` the only `isUnderline`-gated branch is the JS slider, not the aria emit). So **every pill strip (the default) carries a prohibited ARIA attribute** (`AUDIT-DIGEST.md` A2 BLOCKER, A4 BLOCKER — verified live on BC HEAD `c93d0b88`).

### Why no current BC wave fixes it

The natural home — BC's Band-3 `BC.W-TABS-IOS` — **byte-fences `SegmentedTabs.vue` as unchanged** ("T4 — the engine + the ARIA contract are byte-untouched … `SegmentedTabs.vue` is likewise byte-untouched (this is a CSS-only material wave)", `BC.W-TABS-IOS.md:69`; `AUDIT-DIGEST.md` A4). A CSS-only wave's acceptance criterion forbids the SFC edit the guard requires. So **no BC wave will fix the conditional** unless a net-new SFC wave is authored. The kf S1 suppress lines are therefore **still correct and must NOT be deleted on BC cut** until the guard genuinely lands (`AUDIT-DIGEST.md` A4 — "the kf S1 suppress lines are still correct and must NOT be deleted on BC cut").

### The kf-side consequence (the S1 sites + the unmet premise)

kf carries the suppress at **TWO** sites (the M `KF-TO-GLASSUI-BC.md` claim "kf finds only `:43` live now" is factually wrong — `AUDIT-DIGEST.md` A4):

| kf S1 site | What it is |
|------------|-----------|
| `demo/spring/SpringSidebar.vue:43` | `:aria-orientation="undefined"` on a pill strip |
| `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72` | `:aria-orientation="undefined"` on a pill strip |

These exist to **suppress the prohibited attribute** glass-ui emits — a defensive band-aid. `proof:workaround-deletion` S1 (`proof-workaround-deletion.mjs:204-217`) matches `aria-orientation\s*=\s*["']?\s*undefined` in `demo/` and pairs it with `sibling: { @mkbabb/glass-ui, 4.1.0 }`. Today it is **PENDING** (workaround PRESENT, sibling UNPUBLISHED) — but the M premise that BC's CONFIRMED fix would discharge it is FALSE: even on the BC cut, the pill strip still emits the prohibited attr unless the guard lands.

### The exact ask (the conditional guard)

glass-ui BC must emit `aria-orientation` **only on the `tablist` role**, omitting it for `role=group`:

```vue
<!-- the corrected SegmentedTabs.vue:406 -->
:aria-orientation="isUnderline ? (isVertical ? 'vertical' : 'horizontal') : undefined"
```

Vue omits an attribute whose bound value is `undefined`, so this emits `aria-orientation` on the `tablist` (underline) variant and **nothing** on the `group` (pill) variant — exactly the ARIA 1.2 §6.3 contract. This requires a **net-new BC SFC wave** (e.g. `BC.W-ARIA-ORIENTATION-GUARD`, or folded into a successor of `BC.W-TABS-IOS` that is NOT byte-fenced), with its own born-RED gate clause asserting the rendered pill strip carries NO `aria-orientation` (`AUDIT-DIGEST.md` A4 — "a computed-attr check on the mounted SegmentedTabs with variant=pill must return null/undefined for aria-orientation").

The full ARIA-spec rationale + the grounded glass-ui file:line live in the outgoing dispatch **`KF-TO-GLASSUI-BC-ADDENDUM.md`** (authored by this wave). **inv-16 holds:** O.W11 writes ONLY the kf dispatch addendum + its own gate spec. It writes ZERO glass-ui source; BC formalizes the guard into its own SFC wave.

> **Note (separate kf-side fix, NOT this dispatch).** The audit also flagged a kf-OWNED ARIA-ownership violation: `AnimationControls.vue:90,121,141` use `role="tabpanel"` while the owning strip is `role="group"` (a tabpanel must be owned by a tablist — `AUDIT-DIGEST.md` A4). That is a kf-internal fix (switch the strip to `variant="underline"` for a real `role="tablist"` owner, or use `role="region"` + `aria-label` on the panels), folded into the F-band consume wave (F.W12), NOT this DISPATCH. O.W11 dispatches only the glass-ui-OWNED `aria-orientation`-on-`role=group` defect.

---

## Born-RED gate

**Gate (NEW):** `proof:glassui-aria-ask` — `scripts/proof-glassui-aria-ask.mjs`, authored by this wave; wired into `proof:hygiene` (the dispatch-integrity arm). A DISPATCH wave's gate asserts the ask is COHERENT + the consume edge is still LIVE (the prohibited attr genuinely still emits), NOT that glass-ui shipped the guard.

**The FALSIFIABLE clause — `pill-emits-prohibited-orientation` (the REAL runtime observable).** The gate mounts the INSTALLED glass-ui `SegmentedTabs` with `variant="pill"` in jsdom and reads the rendered `aria-orientation` attribute off the `role=group` container:

1. **`pill-prohibited-present`** (the observable-truth probe): mount `<SegmentedTabs variant="pill" :options="[…]" v-model="…">`, query the `[role="group"]` element, assert `el.getAttribute("aria-orientation")` is **non-null** (the prohibited attr IS emitted). **Today: RED-clause-TRUE** — the pill strip carries `aria-orientation="horizontal"` on `role=group` (the ask is LIVE; the defect is real). When BC ships the guard, this flips to `null` → the ask is DISCHARGED.
2. **`underline-permitted-present`** (the contrast — asserts the ask is SURGICAL, not a blanket strip): mount `variant="underline"`, query `[role="tablist"]`, assert `aria-orientation` **IS** present (the permitted emission must SURVIVE the guard). This pins the ask to "omit on group, KEEP on tablist" — a fix that strips it from both would red this clause.
3. **`kf-suppress-still-present`** (the cross-check — the kf consume edge is genuinely still live): `grep aria-orientation.*undefined demo/` finds BOTH `demo/spring/SpringSidebar.vue:43` AND `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72`. Asserts the dispatch is NOT prematurely closed — the suppress the ask exists to delete is still in the tree.

**How it is born-RED (the plant-a-failure).** The gate's GREEN condition is **"the ask is DISCHARGED"** — i.e. BC shipped the guard (`role=group` carries NO `aria-orientation`, `role=tablist` still does) **AND** kf deleted both S1 suppress lines (the consume landed at F.W12). On today's installed glass-ui (4.0.1, the BC HEAD's published predecessor), the pill strip emits `aria-orientation="horizontal"` on `role=group` (clause 1 RED-TRUE) and both kf suppress lines are present (clause 3 RED-TRUE). So `proof:glassui-aria-ask` exits non-zero — born-RED — and stays RED until BC publishes the guard AND kf consumes. The RED is the GENUINE observable: a real component mount + a real `getAttribute("aria-orientation")` returns a NON-NULL string on a `role=group` element, which ARIA 1.2 §6.3 prohibits. It is NOT a source-grep proxy for "did glass-ui fix it" — it RENDERS the component and reads the computed attribute a screen reader would consume.

| Clause | Witness on today's installed glass-ui | Failure mode TODAY (the REAL observable) | GREEN condition |
|--------|----------------------------------------|-------------------------------------------|-----------------|
| `pill-prohibited-present` | mount `variant="pill"`; `el[role=group].getAttribute("aria-orientation")` | non-null (`"horizontal"`) — a PROHIBITED attr on `role=group` (ARIA 1.2 §6.3) | `null` — the guard omits it on the group |
| `underline-permitted-present` | mount `variant="underline"`; `el[role=tablist].getAttribute("aria-orientation")` | present — PERMITTED on tablist; must survive the guard | still present (the fix is surgical) |
| `kf-suppress-still-present` | `grep -n 'aria-orientation.*undefined' demo/` | `demo/spring/SpringSidebar.vue:43` + `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72` — S1 LIVE | both deleted at F.W12 (the consume) |

**Anti-proxy note (inv-observable-truth).** The forbidden proxy is the EXACT trap M's "CONFIRMED" fell into: asserting glass-ui emits "a real axis-derived value" (a source-shape claim the value is non-empty) and greening — which is TRUE today and yet the attribute is STILL prohibited on `role=group`. `proof:glassui-aria-ask` instead asserts the attribute is **ABSENT on the group role specifically** — the genuine ARIA contract — so a "real value on the wrong role" can never green it; only a role-conditional guard can.

---

## Dependencies

- **glass-ui BC (the dispatched sibling) — the guard is NOT in any BC wave yet.** `BC.W-TABS-IOS` byte-fences the SFC (`BC.W-TABS-IOS.md:69`); a net-new BC SFC wave (`BC.W-ARIA-ORIENTATION-GUARD` or a non-fenced successor) must author it (`AUDIT-DIGEST.md` A4). The NAMED tripwire: the published glass-ui `SegmentedTabs` mounted with `variant="pill"` renders `role=group` with `aria-orientation === null`. **This is stronger than a version-number gate** — `AUDIT-DIGEST.md` A4 warns "gate S1 GREEN on the glass-ui aria-orientation SFC fix landing in a published version — NOT merely on BC cut version number … BC could ship 4.1.0 without the SFC fix."
- **F.W12 (the consume wave) — GATED on this dispatch's discharge.** O.W12 deletes both kf S1 suppress lines (`demo/spring/SpringSidebar.vue:43`, `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72`) once the guard lands, flipping `proof:workaround-deletion` S1 GREEN, and re-points the S1 arm's stale `4.1.0` sibling to the content-aware mount-probe (the version sentinel is necessary but not sufficient). F.W12 also carries the separate kf-internal `role=tabpanel`-ownership fix. O.W11 is the ask half; F.W12 is the consume half — same S1 edge, split by phase.
- **O.W2 (ledger re-point) — the NOW slice this wave seeds — NOW A CRITICAL BLOCKER (FULL-LOOP-LEDGER AUGMENT).** The S1 arm's `4.1.0` → content-aware mount-probe retarget (`proof-workaround-deletion.mjs:216`) is folded at O.W2. **The fact that changed since O authoring:** glass-ui 4.1.0 WAS published (2026-06-22 npm latest), so the `version: '4.1.0'` sentinel now fires a **FALSE RED** — it reports "safe to delete" while the SFC guard is genuinely absent from 4.1.0's `tabs.js` (`grep 'aria-orientation' /tmp/gu41/package/dist/tabs.js` → unconditional `L.value ? 'vertical' : 'horizontal'`). **O.W2 MUST be implemented BEFORE O.W12** so the gate accurately reports PENDING (workaround-present + SFC-fix-absent) rather than green-lighting an unsafe S1 deletion. The retarget replaces the version sentinel with the content-aware probe `/aria-orientation[^]{0,80}(isUnderline|tablist)/` (false on 4.1.0 → S1 correctly PENDING; true only when the BC SFC guard ships).
- **No value.js dep, no parse-that dep.** This is a pure glass-ui-edge dispatch; the value.js asks (VJ-L1/L3) are the SEPARATE O.W10 dispatch.

---

## dev→impl boundary

This wave's DELIVERABLE is the outgoing dispatch `docs/tranches/O/KF-TO-GLASSUI-BC-ADDENDUM.md` (authored in this phase, mirroring `KF-TO-GLASSUI-BC.md`) + the `proof:glassui-aria-ask` gate SPEC (born-RED, falsifiable, content-aware mount-probe). The IMPLEMENTATION — writing `scripts/proof-glassui-aria-ask.mjs`, retargeting the `proof:workaround-deletion` S1 arm, and (at F.W12) deleting the two kf S1 suppress lines + the `role=tabpanel` fix — opens only on the owner's explicit authorization, gate-first, born-RED, observable-truth, no-legacy. **inv-16:** kf authors the ASK + its own gate; glass-ui BC writes the SFC guard. The cross-repo need is a DISPATCH, never a foreign-tree edit.
