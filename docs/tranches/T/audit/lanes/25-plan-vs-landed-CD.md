# Lane 25 — Plan-vs-Landed audit, bands S.C + S.D

> **Surface:** the S plan (`waves/S.C.md` Legacy purge · `waves/S.D.md` Demo gestalt) vs what the
> impl drive actually landed on `tranche-s-impl`. Method (same as lane 24): **T5 — every claim
> verified against the TREE and by running the gate, never trusted from the PROGRESS report.** The
> owner rejected the demo on sight after this exact tree passed 85/85 roster gates. This lane owns the
> **plan-side root** for the band that purged legacy (C) and the band that carved the demo's altitude
> (D) — the surface the owner names "half baked and inconsistent."

## The one-sentence verdict

Band **C** (legacy purge) is the tranche's **honest success** — `animate.ts`, the 8 shadcn devDeps,
`SPRING_SMOOTH`, and the value.js-2.0.1 consume-edge are *really gone / really landed*, none
owner-implicated — with **one exception, S.C3b**, which deleted the shadcn menubar (correct, T6) but
replaced it with a **hand-rolled `useToolbarKeyboard` toolbar rather than the glass-ui `dropdown-menu`
the plan named as its PRIMARY target**, and its census gate certified only "shadcn gone," never
"glass-ui adopted." Band **D** (demo carve) landed its structural partition **exactly as specified,
every D gate green** — and *that structure IS the surface the owner rejected wholesale*, because
**every D gate measures PLACEMENT** (right area / ≥2 consuming areas / mounts-in-SPA) **and not one
measures COMPOSITION QUALITY, keep-vs-prune DISPOSITION, or glass-ui idiom** — so the carve satisfied
"no mis-home" while leaving an **uneven module tree**, a **blessed `Kf`-prefixed hand-roll**, a
**preserved "surrounding pane,"** a **folded-in compose scene the owner wants pruned**, an
**`app/chrome/` dir the owner names by hand**, and an **887L global stylesheet the plan parked in the
ungated discretionary tier.** The D-band divergence is **plan-vs-owner-taste, not board-vs-tree** (the
C/D PROGRESS rows are accurate — both D gates run EXIT=0 as claimed).

---

## Per-wave verdict table

| Wave | Board | Spec demanded | Landed on tree (verified) | Verdict |
|---|---|---|---|---|
| **S.C1** | CLOSED | `animate.ts` DELETE (file+2 tests+gate+doc) + `MIGRATION-5.1.0.md` + C-18 changelog gate + hardened orphan walker | `animate.ts` GONE; no `animate*.test.ts`; `docs/MIGRATION-5.1.0.md` present (3.3K); `proof:changelog` (prev-tag `v5.0.0`); `proof:no-orphan-module` present | **SOUND** — clean T6 excision, not owner-implicated (F8) |
| **S.C2** | CLOSED | no-silent-fallback teeth; `as any` census; fix `useTimingFunctionEditor:196` | landed (board: 2 `as any` FIXED not labelled — stronger than spec; 13 `KEEP:` survivors) | **SOUND** — not owner-implicated (F8) |
| **S.C3a** | CLOSED | 8 shadcn devDeps + `SPRING_SMOOTH`+void del; dead-identifier grep; shadcn census | census empty (`cn(`/`@radix`/`cva` grep = 0 in src+demo); 8 devDeps purged | **SOUND (gated)** — BUT the S6 **ungated discretionary** item (design-idioms.css collapse) never landed → 887L sheet (F7) |
| **S.C3b** | CLOSED | menubar → glass-ui **`dropdown-menu`** (C-19 PRIMARY) OR relocate-in-place (fallback); T8 interaction test | `ui/menubar/` GONE; **FALLBACK taken** — `useToolbarKeyboard.ts` hand-rolled roving toolbar; **NO glass-ui menu component**; `dropdown-menu.js` sits unused in node_modules | **LANDED-via-FALLBACK → OWNER-REJECTED axis** (F2) |
| **S.C4** | CLOSED | dep bumps + value.js-2.0.0 consume-edge | value.js `^2.0.1` fired (git `74ee9d2`); `normalizeParam`/`NormalizedParam`/`VJS_PARAM_BUG_MAX` grep-zero; KF-1 26/26 | **SOUND** — not owner-implicated (F8) |
| **S.D1** | CLOSED | sub-zone `app/` (scene/transition/runtime); evict `cubeTransformStore`; `proof:app-is-shell` | `app/` = App.vue + `chrome/` + `scene/` + `transition/` + `runtime/` + public; `cubeTransformStore.ts`→`scenes/cube/` ✓; gate EXIT=0 | **LANDED → OWNER-REJECTED** — `chrome/` named; "90% junk"; organize-not-prune (F5) |
| **S.D2** | CLOSED | state hoist → `@/state`; carve `animation-controls`; KfPillTabs promotion; ControlsPaneWrapper split; `proof:shared-has-n-consumers` | `@/state/` peer ✓; `animation-controls/` → 5 peers ✓; **carve UNEVEN**; KfPillTabs blessed; wrapper preserved; gate EXIT=0 | **LANDED → OWNER-REJECTED** — uneven carve (F1); KfPillTabs (F3); wrapper (F6) |
| **S.D3** | CLOSED (at S.G2) | FOLD playground → `scenes/compose/`; `proof:compose-scene` | `scenes/compose/` present (12 files); `playground/` GONE; `dev:playground` gone; gate present | **LANDED → OWNER-REVERSED** — plan folded IN what owner wants OUT (F4) |
| **S.D4** | CLOSED | `use<Name>Demo` renames; regen `demo/CLAUDE.md` | 3 stragglers renamed; `demo/CLAUDE.md` regenerated | **SOUND (docs-truth)** — but faithfully documents the structure the owner rejects |

---

## Findings

### F1 — (BAND-DEFINING) Every band-D gate measures PLACEMENT, never COMPOSITION QUALITY; the carve is "no-mis-home"-green yet visibly uneven — the plan-side root of "half baked and inconsistent"

**Defect.** The two D structural gates are pure **placement predicates.** `proof:app-is-shell`
asserts three clauses — (i) no `app/` file imported by exactly one non-app area, (ii) no stale-depth
escape, (iii) shell-ness structural-not-linecount (`S.D.md:108-118`). `proof:shared-has-n-consumers`
asserts "any `@/` module with <2 consuming areas REDs" (`S.D.md:223-233`). **Both run EXIT=0 today**
(verified). Yet the resulting `custom/` tree is **visibly uneven**: `animation-transport/`,
`keyframe-timeline/`, and `keyframes-editor/` each got `components/` + `composables/` sub-dirs, while
`easing-editor/` (4 flat `.vue`) and `editor-shell/` (11 flat files incl. `AnimatedText.vue`,
`useShareState.ts`, `useHeroSourceEgg.ts`) stayed **FLAT** — a drawer, not a composed module.
**Nothing in either gate distinguishes a recursively-composed module from a flat one.** Owner #26:
"demo/@ is totally half baked and inconsistent"; "why aren't these properly composed into
sub-components... recursively."

**Root cause.** S.D's charter was "the demo's **altitude**" (`S.D.md:12`), but *altitude was
operationalized as FILE PLACEMENT* — which area owns a file, how many areas consume it — **never as
COMPOSITION DEPTH** (is a large component decomposed into components/composables/skeletons/constants,
and *uniformly so across peers*). The reference-count / mis-home predicate is **orthogonal** to the
owner's ask; a tree can be 100% "no-mis-home"-green and still be a patchwork of half-composed and
flat modules. This is the exact meta-fact the VERDICT names — a green source-shape gate blind to the
axis the owner judges — reproduced inside the band whose whole job was demo structure.

**T-wave recommendation.** T needs a **uniform module-skeleton contract** enforced by a
composition-depth gate: any `custom/<module>/` (or scene dir) that exceeds a size/file threshold MUST
expose the same canonical sub-structure (`components/` · `composables/` · `constants|keys` ·
`skeletons` where applicable) — so `easing-editor/` and `editor-shell/` cannot stay flat while their
peers are composed. Pair it with the taste checkpoint lane 24 F1 recommends (structural gates alone
recreate this blindspot).

### F2 — S.C3b deleted the shadcn menubar but replaced it with a hand-rolled toolbar, not a glass-ui component; the census gate certified "shadcn gone," never "glass-ui adopted"

**Defect.** `ui/menubar/` (16 files) + `utils.ts(cn)` are GONE (correct T6). But KeyframesEditor's
action bar became **`keyframes-editor/composables/useToolbarKeyboard.ts`** — a hand-rolled
roving-tabindex keyboard core over raw `<button>` descendants (`useToolbarKeyboard.ts:1-28`).
glass-ui **ships `dropdown-menu.js`** (present in `node_modules/@mkbabb/glass-ui/dist/` — the plan's
**C-19 PRIMARY** target, `S.C.md:64-70,347`). The impl took the **a24-F6 relocate-in-place FALLBACK**
with a documented, genuinely-defensible rationale (`useToolbarKeyboard.ts:8-16`: the bar is a
4-affordance *toolbar* with zero `MenubarContent`; a dropdown would bury frequently-used authoring
verbs and break the persistent brush affordance whose ref lives in portalled content). **The problem
is the gate.** C-19's HARD GATE is "the S.C3a shadcn census clause — REDs while `ui/menubar` exists,
GREEN after" (`S.C.md:362-364`) — it greens on **deletion alone**; it **cannot distinguish a glass-ui
adoption from a bespoke re-implementation.** Owner #25: "Why aren't these just glass-ui components?"

**Root cause.** C-19's success criterion was **"shadcn island gone"** (census empty), not **"glass-ui
consumed."** The plan offered the relocate-in-place fallback as "internally closable" to avoid a T12
second external gate — a correct T12 instinct — but that fallback became an **escape hatch that let
the glass-ui-first precept lapse with no gate noticing.** The T8 interaction test then certified the
keyboard behavior *of the hand-roll* — the same altitude error lane 24 F3 found in S.B7 (hardening a
primitive the owner rejects), here in its sibling menubar wave.

**T-wave recommendation.** Add a **glass-ui-consumption gate** for primitive replacement: wherever a
shadcn/hand-rolled UI primitive is deleted, its replacement must either **import from
`@mkbabb/glass-ui`** OR the residual be a **delineated, ledgered glass-ui GAP** with a BG/BH handoff
row — a bespoke re-implementation with no gap-ledger entry REDs. The menubar toolbar is then either
routed onto a glass-ui surface or its gap named explicitly, not silently kept as a hand-roll.

### F3 — S.D2/S4 PROMOTED KfPillTabs to "the standard panel primitive" — canonizing a `Kf`-prefixed hand-roll while glass-ui ships a tabs primitive; a real glass-ui GAP is the excuse but the resolution drifted from glass-ui-first

**Defect.** S.D2/S4 spec (`S.D.md:181-183`): "**KfPillTabs promotion to the standard panel
primitive** within the controls carve lands here (fold row 71)... it is a panel primitive." The
landed artifact is `demo/@/components/custom/KfPillTabs.vue` + `useKfPillTabs.ts`, still `Kf`-prefixed
and hand-rolled, consumed by `SpringSidebar.vue` and `AnimationControls.vue`. Its header
(`KfPillTabs.vue:1-12`) documents the **DM-5 CONTINGENCY KILL**: glass-ui 4.0.1's `SegmentedTabs`
emits `aria-orientation` **unconditionally** on its `role=group` pill variant (a WCAG breach), so the
demo replaced it with a kf-internal `role=tablist` strip. **glass-ui also ships `tabs.js`** (a
*different* export from SegmentedTabs). Owner #18/#25: "KfPillTabs.vue?? KF? Pills? Why aren't these
just glass-ui components?"

**Root cause.** The plan turned a **defensive contingency-kill** (a legitimate work-around of a real
glass-ui aria bug) into a **BLESSED standard** — S.D2/S4 *promotes* the hand-roll to "the standard
panel primitive" rather than **delineating the glass-ui gap and routing it to a BG/BH fix.** The `Kf`
prefix literally advertises the hand-roll as a first-class kf citizen. This is the D2 twin of lane 24
F3 (the S.B7 KfPillTabs hardening): **two S waves invested in the same hand-rolled primitive the owner
rejects** — one hardened it (B7), one canonized it (D2).

**T-wave recommendation.** Delineate the SegmentedTabs `aria-orientation` gap as a **glass-ui BG/BH
handoff** (glass-ui is in active development — this is exactly a "glass-ui gap" per owner #27); adopt
glass-ui `tabs` (or the fixed SegmentedTabs) and **delete `KfPillTabs.vue` + `useKfPillTabs.ts` + the
`Kf`-prefix naming.** Coordinate with lane 24 rec #4 and lane 23 (panel architecture) — one
resolution, not three.

### F4 — S.D3 folded the playground IN as `scenes/compose/`; the owner wants it (and morph/motion-path) OUT — the plan gated the exact disposition the owner reverses

**Defect.** S.D3's entire charter (C-4, `S.D.md:266-267`): "**FOLD** the dead standalone playground in
as the **ninth scene** `scenes/compose/`." It spent a full wave: the six-item touch set
(`S.D.md:288-300`), `proof:compose-scene` ("the scene **mounts in the SPA**; the **standalone entry is
GONE**; the **ignition moment drives a real DrawSVG**," `S.D.md:306-308`), asset-manager relocation,
foundry fixes. The scene landed (12 files under `scenes/compose/`), `playground/` and `dev:playground`
are gone, gate present. **Owner #23: "compose — just straight up remove this crap"; "motion-path,
morph, and compose likely need to just be pruned."**

**Root cause.** The plan validated the fold **only against MOUNT / CODE-SPLIT / 0-console-errors**
(p06) — never against "**does this scene EARN its roster place by the owner's taste?**" The
**keep-vs-prune DISPOSITION question had no gate**; the plan *assumed keep, gated keep, and invested a
whole wave making keep structurally clean.* The result is the sharpest plan-vs-owner conflict in the
tranche: **D3 executed the exact opposite of the owner's disposition.** Every hour of the fold
(register + six-item touch set + `proof:compose-scene` + asset-manager relocation) is now
**negative-value work T must reverse.** The plan-level lesson: *folding a dead app into a live SPA
does not resurrect its value* — it moves dead weight from `playground/` to `scenes/compose/`.

**T-wave recommendation.** Insert a **disposition gate BEFORE the fold-investment**: a scene enters
the SceneId roster only after an owner keep/prune ruling, not because it mechanically mounts. **Prune
compose** (delete `scenes/compose/` + the compose touch-set entries + `proof:compose-scene`), and
carry the owner's paired dispositions for **morph and motion-path** (#20/#21/#23 — F/G scenes, cross-
reference lanes 07/16). Gate: the SceneId roster equals the owner-ratified kept set; `scenes/compose`
absent; no orphaned `proof:compose-scene`.

### F5 — S.D1 partitioned `app/` into subzones (incl. `chrome/`) — organization the owner rejects by name; "sub-zone, don't prune" was the plan's explicit choice

**Defect.** S.D1 charter (`S.D.md:74-76`): "**Sub-zone** `demo/app/` per a23 Layout C: `scene/` ·
`transition/` · `runtime/` (+ shell files at root; `diagnostics/` as needed)." Landed: `app/` =
`App.vue` + `chrome/` + `scene/` + `transition/` + `runtime/` + `public/` + `main.ts`/`index.html`.
`proof:app-is-shell` EXIT=0. **Owner #26: "wtf is demo/app/chrome?"** and "**wtf is 90% of the junk in
demo/app? Most should be pruned.**" Note the drift on `MbabbMenu`: S.D1/S5 said "extract the @mbabb
dropdown → **`dock/MbabbMenu.vue`**" (`S.D.md:88`); it landed at **`app/chrome/MbabbMenu.vue`** +
`ChromeDock.vue` — the planned `dock/` home became the `chrome/` dir the owner names.

**Root cause.** `proof:app-is-shell` asserts "no file is **mis-homed**" and "App.vue line count is a
tripwire **not** a criterion" — a **placement/thinness** predicate. The owner's ask is **REDUCTIVE**
(prune 90%); the plan's action was **ORGANIZATIONAL** (sort junk into named subzones). A "no-mis-home"
gate is **trivially satisfied by MORE directories** — the *opposite* of pruning. The plan chose
organization over reduction *by charter*, and no gate could have flagged the miss because reduction
was never a gate quantity.

**T-wave recommendation.** Add a **demo-footprint budget** (a file/dir count ceiling per area, or a
justified-inventory manifest where every `app/` file must name its shell-role) so "prune 90%" becomes
measurable and born-RED. Dissolve `app/chrome/` — re-home `ChromeDock`/`MbabbMenu` into the dock
system (coordinate with lane 08 dock, lane 15 app-prune). Gate: `app/` carries only shell files whose
role resolves against the manifest; `chrome/` absent.

### F6 — The ControlsPaneWrapper "surrounding pane" (shot 07) was carved as an import-neutral CSS split — the plan explicitly declined to ask whether the wrapper should exist

**Defect.** S.D2's cost model (P2-1 F6, `S.D.md:204-207`): "The 497L/477L `ControlsPaneWrapper` carve,
REFRAMED... a **scoped-CSS/template split, import-neutral by construction** (the public SFC keeps its
name/interface; zero external importer changes), **NOT a logic decomposition.**" Board: "ControlsPane
Wrapper 497→200L sourced-CSS split." The component survives (`animation-transport/components/
ControlsPaneWrapper.vue` + `.css`) and produces the nested **double-pane** of **shot 07** — an outer
pane wrapping an options card *and* a separate playback card. **Owner shot 07: "remove the surrounding
pane — it's superfluous."**

**Root cause.** The plan's **only lens** on ControlsPaneWrapper was the **>500L god-module tripwire**
— "how do we get it under 500L?" — so it chose the cheapest line-reducing move (a CSS/template split)
and **preserved the component wholesale.** It never asked "does this wrapper add value or nesting
cruft?" Worse, the line-count framing actively **steered away from deletion**: a split *reduces lines*
(rewards the gate), a deletion is a larger structural call the gate didn't reward. The exact component
the plan chose to split-and-preserve is the one the owner wants gone.

**T-wave recommendation.** T's demo rebuild **removes the outer ControlsPaneWrapper pane** — flatten
the controls surface to a single glass-ui `Card` (KeyframesEditor already imports `Card`/`CardContent`
from `@mkbabb/glass-ui`, `KeyframesEditor.vue:109`). Gate: the controls surface renders as ONE
glass-ui Card with no nested pane wrapper; `ControlsPaneWrapper.vue` absent. (The god-module tripwire
must not reward split-over-delete — see the T2-corollary abuse lane 24 F5 flags in band B.)

### F7 — S.C3a parked design-idioms.css collapse in the UNGATED discretionary tier; it didn't happen → an 887L global stylesheet the owner calls out by name

**Defect.** S.C3a/S6 "Discretionary best-effort (STATED, UNGATED)" (`S.C.md:287-296`) lists
"**design-idioms.css tombstone collapse**." Landed: `demo/@/styles/` = **design-idioms.css 887L** +
**style.css 636L** + brand.css 38L — **two >500L monolithic global stylesheets.** **Owner #26:
"demo/@/styles — what the fuck is this?"**

**Root cause.** The plan's **"stated but UNGATED" tier is exactly the set that doesn't land** under a
green-gate-driven impl drive — a discretionary item has no born-RED oracle, so it is silently dropped
(the same failure mode lane 24 F1 documents for the deferred FROZEN fold). One of the dropped items —
styles — is **owner-facing**. The plan *knew about* the design-idioms.css problem (it named it) and
chose to leave it ungated; the choice pre-determined the miss.

**T-wave recommendation.** **No owner-facing surface may live in the ungated discretionary tier.**
The styles consolidation becomes a **gated T wave**: colocate design idioms into component-scoped /
`@apply` blocks, shrink the global sheets below the >500L tripwire, delete the tombstoned dead rules.
Gate: `demo/@/styles/*.css` each under the module-size ceiling; no orphaned idiom classes. Coordinate
with lane 17 (styles-idioms), lane 19 (fragile-css).

### F8 — (POSITIVE / ring-fence) Band C's legacy purge is REAL and NOT the reason for rejection — do not re-litigate it

**Finding.** `animate.ts` + its 2 tests + gate + doc mentions are gone (S.C1); `MIGRATION-5.1.0.md`
backfilled; the changelog gate generalized to `proof:changelog` (prev-tag guard `v5.0.0`);
`proof:no-silent-fallback` given teeth with the 2-site `as any` fix (S.C2); the **8 zero-importer
shadcn devDeps** + `SPRING_SMOOTH` + void hack deleted, the `cn(`/`@radix`/`cva` census **empty**
(S.C3a); the value.js-2.0.1 consume-edge **fired in totality** — `normalizeParam` /
`NormalizedParam` / `VJS_PARAM_BUG_MAX` grep-zero, `CustomFunctionParameter` threaded directly, KF-1
26/26 (S.C4, git `74ee9d2`). **None of C1/C2/C3a/C4 appears in the owner's 22-item catalogue** — the
rejection is a demo/taste failure, not a legacy-purge failure. **The ONE C-band owner touch is
S.C3b** (F2 — the menubar hand-roll).

**T-wave recommendation.** **Ring-fence S.C1/S.C2/S.C3a/S.C4 as stable**; spend zero T budget
re-litigating them. T's only C-band touch is S.C3b's menubar → glass-ui adoption (F2). This mirrors
lane 24 F8's ring-fence of band B's library carve — the *library and legacy-purge* work landed
honestly; the *demo carve* (band D) is where the plan's gates certified a rejected surface.

### Note on board accuracy (contrast with lane 24)

Unlike lane 24's bands A/B (three board↔tree drifts, F6 there), the **C/D PROGRESS rows are
accurate**: `proof:app-is-shell` and `proof:shared-has-n-consumers` both run **EXIT=0** as their
CLOSED rows claim; S.C4/S2 fired per git log matching its "OPEN → fired" narrative. **The C/D
divergence is not board-vs-tree — it is plan-vs-owner-taste.** The gates say exactly what the plan
designed them to say; the plan designed them to measure the wrong axis. This is the cleaner, more
damning form of the meta-fact: *the instruments are honest and green, and the thing they measure is
not the thing the owner judges.*

---

## T recommendations

1. **Uniform module-skeleton + composition-depth gate** · scope: any `custom/<module>/` or scene dir
   over a size/file threshold MUST expose the same canonical sub-structure (`components/` ·
   `composables/` · `constants|keys` · `skeletons`); `easing-editor/`/`editor-shell/` cannot stay flat
   while peers are composed · gate shape: a `proof:module-composed` that REDs a large flat module
   whose peers are decomposed (measures *internal composition*, not just placement) · size **M/L**.
   *(F1 — the plan-side root of "half baked and inconsistent".)*

2. **glass-ui-consumption gate on primitive replacement** · scope: where a shadcn/hand-rolled UI
   primitive is deleted, its replacement must import from `@mkbabb/glass-ui` OR be a
   delineated/ledgered glass-ui GAP with a BG/BH handoff row; a bespoke re-implementation with no
   gap-ledger entry REDs · gate shape: for each deleted-primitive site, replacement resolves to a
   glass-ui import or a `GLASSUI-GAP:` ledger entry · size **M**. *(F2 menubar toolbar + F3 KfPillTabs
   — one gate covers both; coordinate lanes 20/23/24.)*

3. **Scene disposition gate before fold-investment; prune compose (+ morph/motion-path)** · scope: a
   scene enters the SceneId roster only after an owner keep/prune ruling, not because it mounts; delete
   `scenes/compose/` + the compose touch-set + `proof:compose-scene` · gate shape: the SceneId roster
   equals the owner-ratified kept set; `scenes/compose` absent; no orphaned compose gate · size **M**.
   *(F4 — the plan folded IN what the owner wants OUT.)*

4. **Demo-footprint budget; dissolve `app/chrome/`** · scope: a file/dir ceiling per area OR a
   justified-inventory manifest where every `app/` file names its shell-role; re-home
   `ChromeDock`/`MbabbMenu` into the dock system, delete `chrome/` · gate shape: `app/` carries only
   manifest-resolved shell files; `chrome/` absent; footprint under the budget · size **M**. *(F5 —
   the plan organized where the owner wanted pruning; coordinate lanes 08/15.)*

5. **Flatten ControlsPaneWrapper to a single glass-ui Card** · scope: remove the outer "surrounding
   pane," render the controls surface as ONE glass-ui `Card` (already imported); delete
   `ControlsPaneWrapper.vue` + `.css` · gate shape: the controls surface is one glass-ui Card, no
   nested pane wrapper · size **S/M**. *(F6 shot 07 — the god-module tripwire must reward
   delete-over-split.)*

6. **No owner-facing surface in the ungated discretionary tier; gate the styles consolidation** ·
   scope: colocate design idioms into component-scoped/`@apply`, shrink `design-idioms.css` (887L) and
   `style.css` (636L) below the module-size ceiling, delete tombstoned dead rules · gate shape: each
   `demo/@/styles/*.css` under the ceiling; no orphaned idiom classes · size **M**. *(F7 — the
   "stated-but-ungated" items are exactly the ones that don't land; coordinate lanes 17/19.)*

7. **Ring-fence band C's legacy purge as stable** · scope: an explicit T non-goal — no re-litigation
   of S.C1 (`animate.ts`), S.C2 (no-silent-fallback), S.C3a (shadcn devDeps/`SPRING_SMOOTH`), or S.C4
   (value.js-2.0.1 consume) · gate shape: (documentation-level) T plan names S.C1/C2/C3a/C4 out of
   scope; F8 evidence cited; only S.C3b (menubar) re-touched via rec #2 · size **S**. *(F8 — prevents
   wasted T re-litigation, mirrors lane 24 F8.)*
