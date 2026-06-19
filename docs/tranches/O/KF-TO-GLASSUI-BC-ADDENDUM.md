# keyframes.js → glass-ui BC — the dispatch ADDENDUM (CORRECTION + ASK)

> Authored 2026-06-19 at the keyframes Tranche **O** open, as an addendum to
> `docs/tranches/M/KF-TO-GLASSUI-BC.md`. It carries ONE correction to that
> dispatch's ASK-1 (aria-orientation), surfaced by the Tranche-O 32-lane
> re-audit (`docs/tranches/O/audit/AUDIT-DIGEST.md` A2/A4). glass-ui is the
> DOWNSTREAM consumer on the constellation spine (parse-that → value.js →
> keyframes.js → glass-ui); this is a coordination record for glass-ui's **BC**
> tranche. No glass-ui source is written from keyframes.js (the consume-edge
> discipline: publish-then-re-pin, never cross-write — inv-16).

## Why this addendum exists (the misidentification)

The M dispatch's **ASK-1** (and BC's `KF-INBOUND.md` **ASK#2**, marked
**"CONFIRMED — emitting a real axis-derived value"**) treated the
aria-orientation issue as **closed**. The re-audit found that **"CONFIRMED" is
factually misleading**: the fix was MISIDENTIFIED, and the kf S1 workaround-deletion
premise is therefore **unmet**. glass-ui BC HEAD (`c93d0b88`) still emits a
**prohibited** ARIA attribute on the pill (`role=group`) variant. The kf S1
suppress lines remain **correct and necessary** — they must NOT be deleted on the
BC cut until the corrected guard genuinely lands.

This addendum SUPERSEDES `KF-TO-GLASSUI-BC.md` ASK-1 with the corrected ask below.

## CORRECT (the ARIA-spec ground truth — what the fix actually is)

The defect is **not** "the emitted orientation value is wrong/missing." The value
is correctly axis-derived. The defect is that **`aria-orientation` is emitted on a
role that PROHIBITS it.**

Per **WAI-ARIA 1.2 §6.3 "Inherited and Prohibited Properties,"** `aria-orientation`
is a **supported state on a closed set of roles only**:

- **Used in Roles (direct):** `scrollbar`, `select`, `separator`, `slider`, `tablist`, `toolbar`
- **Inherits into Roles:** `listbox`, `menu`, `menubar`, `radiogroup`, `tree`, `treegrid`

It is **NOT** a supported property of `role=group`
(`group` inherits from `section`/`structure`; `aria-orientation` is not in its
property set). An `aria-orientation` on `role=group` is an **invalid attribute** —
AT may ignore it, and an ARIA conformance checker FLAGS it. Emitting "a real
axis-derived value" does not cure this: a real value on a prohibited role is still
a violation.

`SegmentedTabs.vue` renders TWO roles off the one `variant` axis, and emits
`aria-orientation` on **both** — unconditionally:

```vue
<!-- glass-ui/src/components/custom/tabs/SegmentedTabs.vue:405-406 -->
:role="isUnderline ? 'tablist' : 'group'"
:aria-orientation="isVertical ? 'vertical' : 'horizontal'"
```

| variant | role rendered | `aria-orientation` | ARIA 1.2 §6.3 |
|---------|---------------|--------------------|---------------|
| `underline` | `tablist` | emitted | **PERMITTED** ✓ — tablist is in the allow-list |
| `pill` (**DEFAULT**, `SegmentedTabs.vue:114,121`) | `group` | emitted | **PROHIBITED** ✗ — group is not in the allow-list |

Line 406 is **not** conditioned on `isUnderline` — so the **default** `pill` strip
carries the prohibited attribute on **every render**.

## ASK (the corrected cross-repo ask)

| # | ASK | Why | kf-side follow-up when BC ships |
|---|-----|-----|----------------------------------|
| **ASK-1′ (CORRECTION)** | **role-conditional `aria-orientation` guard** — emit `aria-orientation` ONLY on the `tablist` role; OMIT it on `role=group`. The minimal edit: `:aria-orientation="isUnderline ? (isVertical ? 'vertical' : 'horizontal') : undefined"` (`SegmentedTabs.vue:406`). Vue omits an attr bound to `undefined`, so the pill (`group`) strip renders NO `aria-orientation` while the underline (`tablist`) strip keeps it. | The current unconditional emit puts a **prohibited** ARIA attribute on the default `pill` variant (`role=group`), violating WAI-ARIA 1.2 §6.3. kf's `demo/spring/SpringSidebar.vue:43` + `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72` carry `:aria-orientation="undefined"` suppress band-aids ONLY because of this. | kf deletes BOTH suppress lines (`proof:workaround-deletion` S1 flips GREEN). The kf gate is content-aware: it MOUNTS the published `SegmentedTabs variant="pill"` and asserts `role=group` carries NO `aria-orientation` — so a version bump WITHOUT the SFC fix will NOT green it. |
| **ASK-1′-GATE (ask)** | **a born-RED glass-ui gate clause** asserting the rendered `pill` strip (`role=group`) does NOT carry `aria-orientation` — a computed-attr check on the mounted `SegmentedTabs` with `variant="pill"` returning `null`/`undefined`. | No gate in glass-ui or kf currently asserts this constraint (`proof:tabs-ios` T4 checks `aria-pressed`/`aria-selected`/roving-tabindex but NOT the orientation-absence). Without a glass-ui-side gate, a future refactor can re-introduce the prohibited emit. | kf's `proof:glassui-aria-ask` (O.W11) is the consumer-side mirror; a glass-ui-side gate makes the contract bilateral. |

### The wave-home note (where the fix must land in BC)

`BC.W-TABS-IOS` (Band 3) **byte-fences `SegmentedTabs.vue` as unchanged** —
"T4 — the engine + the ARIA contract are byte-untouched … `SegmentedTabs.vue` is
likewise byte-untouched (this is a CSS-only material wave)" (`BC.W-TABS-IOS.md:69`).
A CSS-only wave cannot carry this SFC edit. The guard therefore needs a
**net-new SFC wave** — e.g. `BC.W-ARIA-ORIENTATION-GUARD`, or a fold into a
non-byte-fenced successor of `BC.W-TABS-IOS`. **The fix is NOT a CSS change.**

### The kf consume condition (stronger than a version number)

kf gates the S1 deletion on the **SFC fix landing in a published version**, NOT
merely on the BC cut version number. The tripwire is **observable**: the published
glass-ui `SegmentedTabs` mounted with `variant="pill"` renders `role=group` with
`aria-orientation === null`. BC shipping (e.g.) 4.1.0 WITHOUT this SFC fix does NOT
discharge the ask — kf's content-aware gate (`proof:glassui-aria-ask`) stays RED.

## The pin/version state at this addendum

| Package | Published | kf pins |
|---------|-----------|---------|
| `@mkbabb/parse-that` | **0.11.0** | `^0.11.0` |
| `@mkbabb/value.js` | **1.0.2** | `^1.0.2` |
| `@mkbabb/glass-ui` | 4.0.1 (BB close); BC HEAD `c93d0b88` IN EXECUTION (CUT pending, ≥4.1.0, USER-DOMAIN) | `~4.0.0` (resolves 4.0.1; → `~<BC-cut>.x` at F.W12) |

## Status of the M dispatch's other ASKs (unchanged by this addendum)

The M `KF-TO-GLASSUI-BC.md` ASK-2 (RF-17 dock pointer cure), ASK-3 (dock
redesign / scene-select for the N Stage DM-24 unshelf), and ASK-4 (re-pin
value.js `^1.0.0` + subpaths) are **unchanged** and tracked in the kf Tranche-O
F band (the BC-gated consume). Note the audit corrections folded at O.W2 (NOT
this addendum): the `useDockClickIntegrity` (ASK-2 / S2) cure already ships in
4.0.1 — the kf gate's stale `4.1.0` sentinel is retargeted to a content-present
check on the installed dist (`AUDIT-DIGEST.md` A2/A3); and the N Stage unshelf
trigger (ASK-3 / DM-24) is renamed off the contradicted BB wave-name
`W-DOCK-MORPH-FAMILY` to "glass-ui BC cut published (BC Band-2 DONE), scene-select
is **kf-owned** atop the stable dock morph" (`AUDIT-DIGEST.md` A2/A3). This
addendum carries ONLY the aria-orientation correction.

## Deferred (BC-gated kf-O waves — NOT closed until glass-ui BC ships the guard)

- **O.W12 (F band)** — the S1 (+ S2) workaround deletions; fires on the BC cut
  that ships the `aria-orientation` guard (the SFC fix, not the version alone).
  Also carries the separate kf-internal `role=tabpanel`-ownership fix
  (`AnimationControls.vue:90,121,141` — a tabpanel must be owned by a tablist,
  a kf-OWNED defect, NOT part of this glass-ui ask).
- **O.W13 (M.W-DESIGN-PAINT)** — the born-RED pixel-readback visual-truth gate
  over the BC-consumed demo.
- **O.W14 (M.W15)** — demo-perf (lighthouse posture flip) on the BC-consumed demo.
- **O.WZ** — the 5.0.0 close, gated on the BC-consumed demo's design/perf green.

These are the constellation's remaining downstream coordination; they do not
block the published libraries (parse-that 0.11.0, value.js 1.0.2) or the live
deploy. The aria-orientation guard is the ONE item this addendum re-opens versus
the M dispatch's "CONFIRMED."
