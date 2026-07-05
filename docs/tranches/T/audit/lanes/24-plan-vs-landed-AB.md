# Lane 24 — Plan-vs-Landed audit, bands S.A + S.B

> **Surface:** the S plan (`waves/S.A.md` Truth & Gates · `waves/S.B.md` Library sub-zoning) vs
> what the impl drive actually landed on `tranche-s-impl`. Method: **T5 — every claim verified
> against the TREE and by running the gate, never trusted from the PROGRESS report.** The owner
> rejected the demo on sight after this exact tree passed 85/85 roster gates. This lane owns the
> **plan-side root** of that meta-fact for the two bands that reformed the instruments (A) and
> carved the library (B).

## The one-sentence verdict

Band **B** (library carve) is largely **SOUND and not implicated** in the rejection — the sub-zoning,
the two P2-2 correctness fixes, and the ownership inversion all landed as real cohesion; band **A**'s
gate-taxonomy reform, by contrast, **inverted its own headline** (the promised 190→~120 gate diet
landed as **190→203 today**, the 51 FROZEN appearance gates still undischarged) and defined
"correctness" as **geometry with zero taste gates** — so the instrument set grew larger and more
structural while remaining blind to the exact axis (aesthetics/idiom) on which the owner rejected.

---

## Per-wave verdict table

| Wave | Board status | Spec demanded | Landed on tree (verified) | Verdict |
|---|---|---|---|---|
| **S.A0** | CLOSED | fix-by-cause CI-green sweep; 6 named fixes + backlog | morph-ghost--from ✓ (`MorphTarget.vue:256`); PIN-LEDGER re-authored ✓ (now advanced past spec to value.js `^2.0.1`); cold-entry + DM-14 gates present in demo-correctness | **LANDED** but see F2 (the morph fix greened a gate over a scene the owner calls a "bare grid") + F4 (cold-entry chronic, 4th recurrence) |
| **S.A1** | "DONE — born-RED to S.Z2" | re-shaped `chronic-closure` + substance clause | Gate runs **EXIT=0 today**; still EXCLUDED in ci-coverage as "born-RED by design" | **DRIFT** — board says born-RED; tree says green (F6) |
| **S.A2** | CLOSED | demo-correctness/observe split; four disposition buckets | 24-member `demo-correctness` tier; harness net-deletion | **LANDED but blind** — the "blocking correctness" tier contains `proof:morph-scene` (green) while morph renders a bare grid; no taste gate exists (F1/F2) |
| **S.A3** | **PENDING-IMPL** | auto-deploy revived on green demo-correctness | not fired (rides backlog waves that are PENDING-IMPL) | **UNMET** — 1 of band-A's 3 charter pillars never landed (F7) |
| **S.A4** | CLOSED | gate diet **190→~138→~120**; 51-gate FROZEN discharge | **203 proof: gates today**; `FROZEN_SET`=51 with `DISCHARGE`=1 key | **INVERTED** — the diet grew the roster; FROZEN never folded (F1) |
| **S.A5** | "DONE — born-RED to S.B8" | `claude-paths-live` gate + hot-fix | Gate runs **EXIT=0**; CLAUDE.md regenerated (incl. `densify.ts`/`easing-serialize.ts`) | **DRIFT** — landed further than the board records (F6) |
| **S.B1** | CLOSED | `constants/{types,defaults}` + barrel; 10 LIGHT repoints | `constants/types.ts` (12.4K) + `defaults.ts` + `index.ts` ✓ | **SOUND** |
| **S.B2** | CLOSED | `engine/css/`; PlaybackState single-STORAGE; carves | `engine/css/{css-animation,metadata,index}` ✓; `element-resolve.ts` → `resolve/` ✓; `playback.ts`→`playback-state.ts` rename ✓ | **SOUND** |
| **S.B3** | CLOSED | `compile/backward/` (4 files); EN-a + EN-b | **6 files** — format.ts further carved into `densify.ts`+`easing-serialize.ts` (positive over-delivery) | **SOUND** (EN-a/EN-b oracles green; F8 positive) |
| **EN-a** | CLOSED | serializeEasing CSS-twin | `NATIVE_CSS_EASING` + `linear()` densify in `easing-serialize.ts` ✓ | **SOUND** — real library-correctness win, not owner-implicated |
| **EN-b** | CLOSED | mixed-track densify body-drop fix | percentage-keyed merge in `backward-color.ts` ✓ | **SOUND** |
| **S.B4** | CLOSED | `AnimationGroup.of()`; kill `getGroupFactory` | service locator excised; `.of()` present ✓ | **SOUND** |
| **S.B5** | CLOSED | 4 cohesion carves; **max ≤~460L**; empty override Map | animation.ts **483L**, spring/progress.ts **492L** (over tripwire); `new Map()` empty-declared, not deleted | **LANDED w/ lossy resolution** (F5) |
| **S.B6** | CLOSED | 11 `=any`→`=Vars`; TYPE-diff drift gate | landed; loader collapse NOT shipped (ruling-2 default) | **SOUND** |
| **S.B7** | CLOSED | test regroup; **KfPillTabs.test.ts + interaction fixes** | KfPillTabs hardened — the owner wants it **deleted** (F3) | **LANDED → OWNER-REJECTED** (F3) |
| **S.B8** | **PENDING-IMPL** | full `src/animation/CLAUDE.md` regen | CLAUDE.md **already regenerated + gate green** | **DRIFT** — landed but board says pending (F6) |

---

## Findings

### F1 — (BAND-DEFINING) S.A4's gate diet INVERTED: 190→203, FROZEN 51 undischarged, and not one gate asserts taste

**Defect.** S.A4's headline was "**190 → ~138 immediate → ~120 once the FROZEN fold discharges**"
(`S.A.md:434`). The board claims it landed "keys 192→188." The **actual tree today carries 203
`proof:` gates** (`grep -oE '"proof:[a-z0-9-]+":' package.json | sort -u | wc -l` = 203). The
`FROZEN_SET` in `scripts/gate-bands.mjs` is still **51 keys with exactly 1 `DISCHARGE` entry** — the
fold to ~120 was "declared + mechanism-built" and **deferred**, never executed. The tier split landed
as `library-correctness` 38 · `demo-correctness` 24 · `hygiene-chain` 122 = 184 chained members.
**Not one of the 184 asserts an aesthetic/idiom/taste property** — sampling the `demo-correctness`
tier: `morph-scene`, `cold-entry`, `subject-animates`, `fsm-suspend-resume-live`, `spring-heatmap`,
`font-census`, `appearance-suffusion`, `easing-curve-editor` — every one is geometry / behavior /
presence.

**Root cause.** The re-taxonomy optimized the wrong quantity. S.A's charter was "make the repo's own
instruments tell the truth again" (`S.A.md:16`) — but "truth" was operationalized as *structural
correctness*, and each altitude band (D/F/G) then AUTHORED yet more structural born-RED oracles
(`vt-roundtrip`, `entry-roundtrip`, `stage-visible`, the per-scene G2 oracles…), swamping the diet.
The net effect is the opposite of consolidation: **more oracles, all structural, and the owner's bar
(glass-ui idiom, font consistency, "looks awful") has no oracle at all.** This is the plan-side proof
of the VERDICT's meta-fact ("recurred AT SCALE despite the S.A4 re-taxonomy").

**T-wave recommendation.** T must add a **taste/owner-in-the-loop gate to the wave-close contract**
itself, not another born-RED structural oracle — a captured-screenshot review checkpoint per scene
(the S.E lesson "put the owner review inside the design loop," MEMORY) — AND genuinely execute the
FROZEN→successor fold so the roster shrinks. The gate philosophy, not the gate count, is the defect.

### F2 — S.A0's morph-ghost fix greened a gate over a scene the owner calls a "bare grid"; even the *behavioral* gate is blind

**Defect.** S.A0/S1 added the `.morph-ghost--from` CSS rule (`MorphTarget.vue:256`,
`stroke-dasharray: 6 4; opacity: 0.55`) — greening `proof:styling-idioms`. The demo-correctness tier
also carries `proof:morph-scene`, which asserts a genuinely strong property: "the subject's RENDERED
path `d` at mid-t differs from BOTH endpoint shapes — a live morph, not a static path"
(`scripts/proof-morph-scene.mjs:22-24,283-293`). That gate is **green**. **Owner shot 17 shows the
morph scene as nothing but a dark grid** (verdict #21: "does not work at all — renders a BARE GRID").

**Root cause.** The gate harness *drives the scene into its working state* — it waits for the `<path>`
to mount (`waitForFunction`) then clicks Play — before sampling. The owner just **looked at the scene
on load**. So even a behavioral gate certifies "**can be actuated into morphing**," never "**morphs /
looks complete on cold load**." A one-line CSS idiom fix (`styling-idioms`) sits on top of a scene
whose subject + both ghost paths never paint in the default view. This is the gate-blindspot recurring
*below* the structural layer — the harness's own actuation masks the cold-load defect.

**T-wave recommendation.** Owner #23 already rules the disposition ("motion-path, morph, and compose
likely need to just be pruned"). T should **prune morph/motion-path/compose** OR, if kept, replace the
actuate-then-sample harness pattern with a **cold-load-visible contract** (assert the subject renders
distinctly within N ms of navigation with NO synthetic play/mount-wait) — the harness must observe
what the owner observes.

### F3 — S.B7 spent a whole wave HARDENING KfPillTabs — the component the owner wants deleted

**Defect.** S.B7's gate is `KfPillTabs.test.ts` green (`S.B.md:713-724`): the wave authored the
interaction-axis test + arrow-moves-focus / keyup-actuation / press-origin fixes + the TransportDock
auto-repeat — billed as "**the T8 gate-blindspot cure**" (`S.B.md:741`). The hardened artifact is
`demo/@/components/custom/KfPillTabs.vue` (+ `useKfPillTabs.ts` + `test/demo/KfPillTabs.test.ts`).
**Owner #18 (shot 15/16): "wtf are most of these items? KfPillTabs.vue?? KF? Pills? Why aren't these
just glass-ui components?"** — and rules that a keyframes option "should be like the core cube/amiga/
square… with sub options for controls, keyframes, timeline."

**Root cause.** The gate-blindspot cure protected the wrong altitude. T8 asked "does this hand-rolled
primitive survive keyboard traversal?" — a real question — but the prior question ("**should this be
hand-rolled at all, or a glass-ui component?**") had no gate, so the wave invested in keyboard-hardening
a primitive the owner rejects wholesale. The entire S.B7 KfPillTabs deliverable (component + composable
+ test + the press-origin re-arm) is now **orphaned effort**.

**T-wave recommendation.** Replace `KfPillTabs` with a glass-ui tabs/segmented primitive (census
node_modules/@mkbabb/glass-ui first); delete `KfPillTabs.vue` + `useKfPillTabs.ts` + `KfPillTabs.test.ts`
+ the `Kf`-prefix naming (also `demo/@/utils/kfEngine.ts`). The T8 interaction-axis principle survives
as a glass-ui consumption test, not a hand-rolled-primitive test.

### F4 — The cold-entry / press-origin / arming-audit chronic: now a 4th recurrence, touched by both S.A0 and S.B7

**Defect.** Two A+B waves touched this seam — S.A0/S6 (cold-entry resume-totality + DM-14 spring
pause) and S.B7 (the press-origin guard forcing "the pressPlayToggle honest-press re-arm at merge").
The git log shows the arming-audit class has now recurred a **4th time** (`8d3a47c`: "the arming-audit
class 4th recurrence — cold-entry's square leg re-grounded…"), with the head commit noting it as "the
3rd recurrence." Every wave that touches the demo transport↔scene-machine↔engine cold-start coupling
re-breaks it.

**Root cause.** Located in the S.A0 spec itself (`S.A.md:160`): the raw-rAF scenes bind their transport
to a **synthetically pre-started contract group** (`useContractAnimGroup.ts` — `started = true`,
driving no motion), so emitted `playing` is derived from `toggle()/playing()` on a never-run group and
decouples the dock toggle from scene-machine intent. S.A0 patched one leg surgically; each later wave
that changes a scene's DFA (e.g. G2's square collapse) re-exposes it. It is a **structural fragility
papered over per-wave**, exactly the "arming-audit lesson, Nth recurrence" the head commit names.

**T-wave recommendation.** T should excise the contract-group synthetic-`started` hack and give raw-rAF
scenes a **single source of playback intent** (the scene-machine status, not a placeholder group) — the
"preferred, surgical" cure the S.A0 spec already pinned but which was applied per-leg instead of once.
Gate: a cross-scene transport-intent test where dock-toggle ⇔ machine-state for ALL raw-rAF scenes.

### F5 — Honest-but-lossy: S.B5's ≤460L "tripwire the carves must clear" was NOT cleared; the Map was emptied, not deleted

**Defect.** S.B5's gate (`S.B.md:583-589`) demanded "**Max file ≤ ~460L — a headroom clause: a
tripwire the carves must clear**." On the tree: `engine/animation.ts` = **483L**,
`physics/spring/progress.ts` = **492L** — both over the tripwire. The spec's own T2 corollary ("no
numeric line count is the GREEN criterion") is the escape hatch that let the carve stop ~490L and
record the overage as "the honest solver floor" rather than carve further. Separately, S.B5/S3 demanded
"DELETE… **the Map itself — the data structure is gone**"; the tree carries
`const LIBRARY_CEILING_OVERRIDE = new Map();` (empty, guarded by a `size > 0` RED) — emptied, not gone.

**Root cause.** A gate that names a target AND simultaneously disclaims it as "not the oracle" cannot
enforce the target. The cohesion-first intent is right, but two files landed where R left them
(~490L), so the S.B5 "R.W0 keystone completed / cohesion-first" narrative is partially aspirational.
Not owner-facing — a library-hygiene note.

**T-wave recommendation.** Low priority. If T re-touches these zones, carve `progress.ts` (the spring
solver) and `animation.ts` at their real seams; otherwise record the ~490L floors explicitly as
permanent exceptions rather than as "tripwires the carves must clear" (align the gate prose to reality).

### F6 — The truth-band's own PROGRESS board is not the truth (three drifts)

**Defect (ironic, given band A's charter).** Three board↔tree divergences, all verified by running the
gate:
1. **S.B8** board = **PENDING-IMPL**, but `proof:claude-paths-live` runs **EXIT=0** and CLAUDE.md is
   already regenerated (lists `densify.ts`/`easing-serialize.ts`, line 139/160) — the regen landed;
   the board understates it.
2. **S.A1** board = "DONE — born-RED by design to S.Z2" + EXCLUDED in ci-coverage, but
   `proof:chronic-closure` runs **EXIT=0** today.
3. **S.A0/S2** spec + board cite PIN-LEDGER at value.js `1.2.0`/parse-that `0.13.0`; the tree has
   advanced to value.js `^2.0.1` / parse-that `^1.0.0` (S.C4/S2 fired 2026-07-04) — the A0-cited
   pin is superseded, so the A0 narrative reads stale.

**Root cause.** The PROGRESS board is hand-maintained across a long fan-out; several rows were frozen
at their authoring moment and not re-synced when a later wave advanced the tree. Harmless to the
library, but it means an auditor trusting the board (rather than T5-ing the tree) inherits a false map
— the precise failure mode band A existed to prevent, reappearing one level up in the tranche's own
records.

**T-wave recommendation.** T's plan-recap should treat the S PROGRESS board as **untrusted**;
re-derive each wave's true state from `git` + a live gate run (as this lane did). If T authors a board,
gate it the way `claude-paths-live` gates CLAUDE.md — a `proof:progress-board-live` that reconciles
each CLOSED row's cited exit against a re-run.

### F7 — Band A's deploy pillar (S.A3) never landed — inherited by T

**Defect.** S.A0's causal model rests on three pillars: green CI, the **auto-deploy round-trip**, and
doc-authority (`S.A.md:22-23`). S.A3 (the auto-deploy revival) is **PENDING-IMPL** — it rides the
keystone backlog, and the backlog owners (S.G3 etc.) are themselves PENDING-IMPL. So at the audited
SHA the "deploy-of-record revived" pillar is **unmet**; the demo the owner reviewed was never on an
auto-deployed path.

**Root cause.** The DAG made deploy depend on demo-correctness being green-modulo-a-backlog that the
owner then rejected — so the deploy was always going to be gated behind waves T now reopens.

**T-wave recommendation.** T should NOT wire auto-deploy against the current demo-correctness tier
(it certifies a rejected surface). Sequence deploy-revival AFTER the T demo rebuild, gated on the new
taste-inclusive close contract (F1).

### F8 — (POSITIVE) Band B's library work is sound and NOT the reason for rejection — do not re-litigate it

**Finding.** The EN-a browser-dead-easing fix (`easing-serialize.ts` `NATIVE_CSS_EASING` + `linear()`
densify), the EN-b mixed-track drop fix (percentage-keyed merge in `backward-color.ts`), the
`constants/` split, `engine/css/`, `compile/backward/` (over-delivered 4→6 files at real cohesion
seams), `element-resolve.ts`→`resolve/`, the `AnimationGroup.of()` ownership inversion, and the
TYPE-diff drift gate all landed as specified and verified. **None appears in the owner's 22-item
catalogue** — the rejection is a demo/taste failure (bands D/E/F/G surfaces), not a library-carve
failure.

**T-wave recommendation.** T should ring-fence band B's landed library structure as **stable** and
spend zero T budget re-carving it; the demo rebuild consumes this library, it does not re-open it.
(The one library-adjacent T touch is F3: the demo's `Kf`-prefixed hand-rolled primitives, which are a
demo/`@` concern, not a `src/animation` concern.)

---

## T recommendations

1. **Taste-inclusive wave-close contract (not another structural oracle)** · scope: add an
   owner/captured-screenshot review checkpoint to the tranche-close template (`proof:tranche-template`
   successor), one per scene, so a wave cannot CLOSE on structural-green alone · gate shape: a
   `close-requires-taste-sign-off` clause that REDs a wave marked CLOSED without a paired review
   artifact · size **M**. *(Roots the VERDICT meta-fact; owns the F1 defect.)*

2. **Execute the FROZEN→successor fold and re-shrink the roster** · scope: actually discharge the 51
   `FROZEN_SET` keys into successor system gates (or ledgered KILLs) so the roster drops toward the
   ~120 S.A4 promised, instead of the 203 it grew to · gate shape: `proof:ci-coverage` REDs while
   `FROZEN_SET.size − DISCHARGE.size > 0`; total `proof:` count ≤ a declared ceiling · size **M**.

3. **Cold-load-visible harness contract for retained scenes** · scope: replace the
   actuate-then-sample pattern (mount-wait + synthetic Play) with an assertion that the subject paints
   distinctly within N ms of navigation, no synthetic actuation — OR prune morph/motion-path/compose
   per owner #23 · gate shape: a scene renders its subject on cold load with zero injected play events,
   else RED · size **M** (prune) / **L** (contract). *(F2.)*

4. **Delete KfPillTabs; adopt glass-ui tabs** · scope: excise `KfPillTabs.vue` + `useKfPillTabs.ts` +
   `KfPillTabs.test.ts` + the `Kf`-prefix naming; mount a glass-ui segmented/tabs primitive; census
   glass-ui exports first · gate shape: repo grep for `KfPillTabs`/`Kf`-prefixed demo components empty;
   panel-tab interaction covered by a glass-ui-consumption test · size **M**. *(F3.)*

5. **Excise the contract-group synthetic-`started` transport hack (kill the arming-audit chronic)** ·
   scope: give raw-rAF scenes one source of playback intent (scene-machine status), removing the
   `useContractAnimGroup` never-run-group `toggle()/playing()` derivation · gate shape: a cross-scene
   transport-intent test where dock-toggle ⇔ machine-state for ALL raw-rAF scenes; the arming-audit
   does not recur · size **M**. *(F4 — a 4-recurrence chronic; cure once, structurally.)*

6. **Treat the S PROGRESS board as untrusted; gate the T board** · scope: re-derive S wave state from
   git + live gate runs; if T keeps a board, add a `proof:board-live` reconciling each CLOSED row's
   cited exit against a re-run · gate shape: a board row citing a green gate that reds at HEAD REDs ·
   size **S**. *(F6.)*

7. **Ring-fence band B's library carve as stable** · scope: an explicit T non-goal — no re-carving of
   `src/animation` sub-zones, EN-a/EN-b, the ownership inversion, or the drift gate; T budget goes to
   the demo · gate shape: (documentation-level) T plan names band B out-of-scope; F8 evidence cited ·
   size **S**. *(F8 — prevents wasted T re-litigation.)*
