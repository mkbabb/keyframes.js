# pass2-research — the open spec questions (for SPEC-B2)

> **Lane:** `spec-questions` · **Pass 2, step 1 (research)** of the owner 5-step
> convergence loop (OD-U18). READ-ONLY except this report. Binding on me: PASS-1's
> eight agglomerator rulings + SPEC-B1. Precept binding on every line here: plain
> language, every term of art glossed at first use (agglomerator ruling 6, OWNER-ASKS
> row 3 — the anti-recondite ruling).
>
> Four questions to resolve with evidence, each ending in a SPEC-B2-ready rule:
> **(a)** ruling 8 — do per-component composable dependency/return types export-and-consume
> or stay local? **(b)** ruling 2's general form — the fold-time importer-count adjudication
> protocol as a spec rule. **(c)** ruling 3's dead-gate-retire rule as a spec clause with its
> two immediate applications named. **(d)** the unglossed-shorthand sweep of SPEC-B1.
>
> Terms used below, glossed once here so the body reads clean:
> **composable** = a Vue function (named `useX`) that packages a slice of reactive
> state + behaviour for a component to call. **Deps type** = the interface describing the
> object of dependencies a composable is *handed* (`useFoo(deps: UseFooDeps)`).
> **Return type** = the interface describing what a composable *hands back*
> (`useFoo(...): UseFooReturn`). **Reflexive export** = a symbol marked `export` but
> referenced only inside its own defining file — an export with no reader; kf's
> `proof:no-dead-export` gate exists to catch exactly this. **Barrel** = an `index.ts`
> whose only job is to re-export its neighbours behind one import path.

---

## (a) Ruling 8 — the composable Deps/Return export-vs-local question

### The question, concretely

P5 re-anchored 8 dead-export allowlist rows (transport composables) to new paths — correct
for its scope, but it postponed the *pattern* decision. The ratified U.B component shape
(glass-ui post-BH: a per-component `composables/` directory behind a re-export-only barrel)
will be applied to every demo component. Each composable that is split out (`useFoo`) carries
a `UseFooDeps` and a `UseFooReturn` interface. Two mutually-exclusive rules could govern them:

- **EXPORT-AND-CONSUME** — mark both `export`, and make the parent component (or the
  `composables/index.ts` barrel) import them, so the `proof:no-dead-export` gate sees a
  reader and the 8 rows (17 across the whole deferred backlog) go green *as consumed*.
- **STAY LOCAL** — drop the `export` keyword; the interface stays a private, file-local
  signature type. The rows go green *by deletion of the export* (die-by-fixing).

The choice matters permanently: if it is not ruled once, every future recut re-adds rows,
and the gate's backlog never empties (its stated exit is "DEFERRED is empty, the array is
deleted").

### Evidence 1 — kf's demo today: the types are 100% reflexive

I scanned every `demo/**` composable that exports a `*Deps|*Return|*Options|*Params|*Emit|
*Handlers` interface and searched for any consumer of that identifier in any *other* file
across `demo` + `src` + `test` + `scripts` (the gate's own four consumer roots). Result:

> **Zero** of the demo's composable dependency/return/options types are consumed outside
> their own defining file. Every one is reflexive.

The deferred backlog carries **17** such reflexive composable-interface rows (P5's 8 are a
subset). Not one has a real downstream reader. This is decisive: "export-and-consume" cannot
be satisfied by an *existing* consumer — it would require *manufacturing* one (the parent
importing a type it does not otherwise need).

### Evidence 2 — the glass-ui precedent is MIXED, and the split is the answer

glass-ui has 105 composable files; 56 export a Deps/Return/Options type. Tracing consumption:

- **The module-public composable exports ARE consumed at a real seam.** `useConcentric`'s
  `ConcentricHandle` + `UseConcentricOptions` are re-exported through the component barrel
  (`concentric/index.ts`) *and* lifted into the published API surface (`src/api/types-extra.ts`,
  the `/concentric` subpath) — because an external consumer wrapping `<Concentric>` needs the
  `Handle` type to annotate its own `ref`. This is genuine export-and-consume: a second module
  (the public API) reads the type.
- **The internal sub-composable exports are dead-or-barrel-only.** `useDockItemDrag`'s
  `UseDockItemDragParams`/`Return` have **no** consumer anywhere — dead exports.
  `useDockHold`'s `UseDockHoldOptions`/`Return` are re-exported by the local
  `composables/index.ts` barrel but read by nothing downstream.

So glass-ui does **not** ratify a blanket "export everything." It exports-and-consumes for the
component's *public* composable (the one whose Handle a consumer holds), and it merely
*tolerates* dead internal-helper exports — because **glass-ui has no `proof:no-dead-export`
gate.** kf is strictly stricter here: it has the gate *and* the GRAND COLOCATION EDICT, which
names "a reflexive `Use…Return`/`Use…Options` interface exported out of a composable but
consumed only inside its own file" as the precise defect to remove. kf must not import
glass-ui's laxity; it must apply its own ethos to glass-ui's *good* half.

### Evidence 3 — the Vue ecosystem norm distinguishes library from app

The reason libraries like VueUse export `UseMouseReturn`-style types is that an *external*
consumer annotates against them (`const m: UseMouseReturn = useMouse()`). That is the
published-library case — the glass-ui `api/types-extra.ts` case. An **app-internal**
composable has exactly one call site (its parent), and Vue 3.5's idiom is to let TypeScript
*infer* the parameter and return types at that call site: the parent writes
`const { a, b } = useFoo({ x, y })` and never names `UseFooDeps` or `UseFooReturn`. Exporting
them there manufactures nothing but the reflexive dead export the gate exists to kill. The
demo is an app, not a published library — its composables are the app-internal case.

### The recommendation (one rule, stated generally)

> **G-EXPORT (the type-export threshold = the composable-file threshold).** A composable's
> parameter (`Deps`) and return type are exported **only when a second module genuinely reads
> them** — a ≥2nd call site, a composing composable that threads the type, or a published-library
> API surface (glass-ui's `api/types-extra.ts` precedent). Below that bar the interface is
> declared **without `export`** (file-local), because TypeScript infers it at the sole call
> site and an `export` there is precisely the reflexive dead export `proof:no-dead-export` and
> the GRAND COLOCATION EDICT forbid. This is the same ≥2-consumer test G7 already applies to
> the composable *file* itself, now applied to its *types*: a single-consumer composable earns
> neither a shared file nor an exported signature.

**Verdict on ruling 8: STAY LOCAL** (drop the export) for the demo's single-consumer
composables. The 17 reflexive rows (P5's 8 included) die by **deleting the `export` keyword**,
not by re-anchoring and not by laundering through a barrel — the honest die-by-fixing the gate's
own exit condition demands.

**Corollary — the barrel is not an escape hatch.** kf's gate counts a re-export as a
"consumer" (its deliberate conservatism). So a `composables/index.ts` that blanket-re-exports
every Deps/Return type (glass-ui's dock barrel does this) would flip the gate green *without a
real downstream reader* — laundering. SPEC-B2 must forbid this: the per-component composables
barrel re-exports the composable **functions** (the SFC imports those) and re-exports a type
**only when a downstream module imports that type through it**. A pure re-export barrel stays
honest (G4: a barrel carries only what is actually consumed).

**This also settles the ratified U.B pattern going forward:** the post-BH `composables/` shape
lands with file-local (unexported) Deps/Return types by default; a type graduates to
`export` + barrel re-export at the same moment its composable graduates to a shared seat
(≥2 consumers). No recut re-adds rows.

---

## (b) Ruling 2's general form — the fold-time importer-count adjudication protocol

### What ruling 2 established

The §3 INLINE verdict on `cube/square/amigaKeys` overstated certainty: each is a
registry-id contract (a bare identifier string shared by the scene machine + both stores +
the SFC — a 3-consumer contract), so inlining would *duplicate* the contract, not remove
indirection. Ruling 2 amended: **KEEP unless the fold-time importer count proves single
consumer** — the same adjudicate-at-fold-time protocol P2's charter already mandates for
`flattenVars` and `contenteditable`. The general form:

### The spec rule

> **G11 (fold-time adjudication).** An INLINE verdict on a **shared-contract module** — a
> module whose exported symbol is referenced *by name* across module boundaries (a registry
> id, an `InjectionKey`, a type contract, a shared constant) — is **provisional** until the
> fold commit measures the **live** importer count on the tree as it then stands. The decision
> rule is fixed in advance and applied at that measurement:
> - **exactly 1 real importer** → INLINE executes (it is pure indirection; fold into the sole
>   owner and delete).
> - **≥2 real importers** → the module **KEEPS**; the fold-map records the count and the KEEP
>   as an explicit counter-example. The verdict is never forced against the count.
>
> Importer count is measured at fold time — never carried from a stale census — because prior
> waves in the same drive add and remove consumers. A "real importer" excludes the module's own
> file, comment/string mentions, and a bare barrel re-export that has no downstream reader.

**Why this is not the forbidden "watch" (reconciles §7 amend 4).** A converged table admits no
deferred "watch" (a postponed *ruling*). G11 does not defer the ruling — the ruling *is* the
two-branch decision rule, fixed now. It defers only the **measurement** to the one moment it is
cheap, exact, and consequential (the commit that touches the file). The verdict resolves in that
commit, with the count as evidence. Fold-time adjudication is the *protocol*, not a deferral —
and it *legitimizes* the surviving KEEP-conditionals (they mirror the retired dependency-cruiser
watch pattern but with a decision rule and evidence, not a standing exemption).

**Immediate applications** (SPEC-B2 names them in the table so no pass re-litigates):
`flattenVars`, `contenteditable`, and the three `cube/square/amigaKeys` — each an INLINE
verdict conditioned on a single importer at fold time, KEEP otherwise.

---

## (c) Ruling 3 — the dead-gate-retire rule, as a spec clause

### The rule

> **G12 (dead-gate-retire).** When a fold, carve, inline, or delete **moots a gate clause** —
> the condition the clause checks can no longer occur — that clause **retires in the same commit
> as the change that mooted it**. A check must be able to go RED when its guarded condition
> clears, or it dies with the concern it served. This is the §6 suppression ethos ("self-verifying
> or die with its concern") extended from suppression *files* to gate *clauses*: a clause guarding
> a structure that no longer exists is itself dead code, and dead guards red-or-die like any other.

### The two immediate applications (verified against source)

Both are mooted by P2's deletion of `src/animation/constants/index.ts` (the migrated-off
back-compat barrel — the library's one genuine small-module kill, §2):

1. **`proof:boundary` assertion 6** — "NO LIGHT-ZONE BARE-`constants`-BARREL IMPORT"
   (`proof-boundary.mjs:660`, doc'd `:68`). It guards against a LIGHT (value.js-free) module
   importing the bare `constants` barrel, which re-exports the value.js-bearing
   `constants/defaults`. Once `constants/index.ts` is deleted there **is no bare barrel to
   import** — the specifier `../constants` no longer resolves to an `index.ts`, so the clause
   guards a structure that cannot exist. **Retire assertion 6 in the delete commit.** (Its live
   concern — a LIGHT module reaching value.js via defaults — is already held by the FILE-level
   `constants/types.ts`-purity clause the same gate carries at `:232`, which survives.)

2. **`proof:zone-cohesion` ring-fence** — the `allowedBarrelDirs = new Set([...ZONE_DIRS,
   "constants"])` set (`proof-zone-cohesion.mjs:289`) and its success line "the 11-zone
   partition + constants/ barrels are intact" (`:306`). After the delete, `constants/` still
   holds `types.ts` + `defaults.ts` but **no barrel** — so `"constants"` must drop from
   `allowedBarrelDirs` and the "constants/ barrels are intact" assertion becomes false-or-moot.
   **Amend the ring-fence in the same commit**: remove `"constants"` from the allowed-barrel set,
   drop the "constants/ barrels" phrasing from the success line.

Both retirements land in the P2 fold commit — never a follow-up — per G12.

---

## (d) The unglossed-shorthand sweep of SPEC-B1

Agglomerator ruling 6 names four terms explicitly (a18, refusal-probes, de-accrete, SoA fold)
and mandates the sweep continue to "any others." Below: the term, its SPEC-B1 first-use line,
and the exact gloss to insert at first use (each verified against the codebase, not paraphrased
from the corpus).

### The four named terms

| term | first use | gloss to insert at first use |
|---|---|---|
| **a18** | `SPEC-B1:201` | *a18 — an audit-lane invariant (audit lane "a", finding 18): the compile zone's real seam is FORWARD (template→frames) vs BACKWARD (frames→CSS), enforced as a **zero cross-import edge** between the two legs. `proof:compile-backward-leg` reds if a backward-leg file leaks into the forward pipeline. The rename re-anchors it FORWARD↔`emit/`.* |
| **refusal-probes** | `SPEC-B1:200` | *refusal-probes — the shared predicate helpers in the backward/emit compiler that detect a kf animation the target CSS format **cannot round-trip faithfully** (a `weighted` blend, a computed unit, a color interpolation) and **REFUSE the lowering with a named reason** rather than silently approximating it. Today each of `entry.ts`/`view-transition.ts`/`backward.ts` carries its own copy of these checks.* |
| **de-accrete** | `SPEC-B1:200` | *de-accrete — remove code that has **accreted** (accumulated as duplicated copies over successive edits); here, extract the three files' copied refusal checks into one shared `refusal-probes.ts` so the duplication dies.* |
| **SoA fold** | corpus (CLAUDE.md:122; SPEC-B1 refers via the group tables) | *SoA (Structure-of-Arrays) fold — the AnimationGroup compositor's **zero-allocation blend loop** that composites all layers by iterating parallel per-field arrays (each field its own contiguous array) instead of an array of per-layer objects, so the hot path allocates nothing per frame.* |

### The others found in the sweep (same anti-recondite defect)

| term | first use | gloss to insert |
|---|---|---|
| **FSM** | `SPEC-B1:171` | *FSM (finite-state machine) — the play/pause/finish state logic copied across `animation.ts`, `play-lifecycle.ts`, and `group/lifecycle.ts`, which U.C1 dissolves into one Transport core.* |
| **ODE** | `SPEC-B1:161` | *ODE (ordinary differential equation) — the spring physics integration step; the byte-copied copy in `spring/vector.ts` dies into U.C4's one modal kernel.* |
| **Hidden Components** | `SPEC-B1:88` | *Hidden Components (Mark Thiessen's Vue heuristic) — extract a child component only when it owns an **exclusive cluster of props/state**, never by line volume; a single-use region sharing the parent's state stays inline.* |
| **post-BH** | `SPEC-B1:251` | *post-BH — the per-component directory shape glass-ui adopted after its "BH" tranche: a kebab-case dir, a PascalCase SFC, a re-export-only `index.ts`, a `constants.ts`, and a per-component `composables/`.* |
| **born-RED** | `SPEC-B1:323` | *born-RED — a new gate clause authored to **FAIL on today's tree first**, proving it actually detects the defect, and only going green once the fix lands (never a clause that is green the day it is written).* |
| **ratchet** | `SPEC-B1:382` | *ratchet — a **monotone-shrinkage** backlog: the list may only get smaller — a new violation not on the list reds, and a stale entry (no longer a violation) also reds — so the debt can only be paid down, never grown.* |
| **die-by-fixing** | `SPEC-B1:380` | *die-by-fixing — remove a suppression by **actually fixing what it suppressed** (so the check goes green honestly and the strictness rises), never by deleting the check.* |
| **G3a–G3d** | `SPEC-B1:160,181,197,219,226` | (no gloss needed — sub-clauses defined inline in G3; keep. Flag only that each first sub-reference should read "G3c (deliberate carve-out)" etc. so a reader need not scroll back.) |

Recommendation for SPEC-B2: insert the glosses above at each first use, OR — if the "Plain
language throughout" banner (`SPEC-B1:10`) is to stand honestly — the banner is only true once
these insertions land. Do not keep the banner over unglossed shorthand (that is the exact
self-contradiction ruling 6 flags).

---

## Work orders

1. **SPEC-B2 §1 — add rule G-EXPORT (composable type-export threshold).** State it verbatim from
   (a): a composable's Deps/Return type is exported **only** with a genuine second reader (≥2nd
   call site, a composing composable, or a published-library API surface); below that it is
   declared without `export`. Cite the evidence: zero of the demo's composable types are
   consumed externally today; the glass-ui precedent exports-and-consumes only for the
   component's *public* composable (concentric→`api/types-extra.ts`) and merely tolerates dead
   internal-helper exports because it lacks kf's gate.

2. **SPEC-B2 §3 + §6 — rule ruling 8 as STAY LOCAL.** The 17 reflexive composable-interface
   rows in `proof:no-dead-export`'s DEFERRED backlog (P5's 8 included) die by **deleting the
   `export` keyword**, not by re-anchoring, not by barrel laundering. Add the corollary: the
   per-component `composables/index.ts` barrel re-exports composable **functions**, and a type
   **only** when a downstream module imports that type through it — a bare "re-export everything"
   barrel is forbidden (it would flip the gate green with no real reader).

3. **SPEC-B2 §1 — add rule G11 (fold-time adjudication).** Verbatim from (b): INLINE on a
   shared-contract module is provisional; measure live importer count at the fold commit; 1→INLINE,
   ≥2→KEEP-with-recorded-counter-example; never from a stale census. Name the immediate
   applications in the table: `flattenVars`, `contenteditable`, `cube/square/amigaKeys`. Add the
   one-sentence reconciliation with §7 amend 4 (this is protocol, not a deferred "watch").

4. **SPEC-B2 §1 — add rule G12 (dead-gate-retire).** Verbatim from (c): a clause mooted by a
   fold/carve/inline/delete retires in the same commit; red-or-die extended from suppression files
   to gate clauses. Name the two immediate applications with their source lines:
   `proof-boundary.mjs:660` assertion 6 (retire — the bare `constants` barrel it guards ceases to
   exist) and `proof-zone-cohesion.mjs:289,306` (amend — drop `"constants"` from `allowedBarrelDirs`
   and the "constants/ barrels are intact" phrasing). Both land in P2's `constants/index.ts` delete
   commit.

5. **SPEC-B2 — insert every gloss from (d) at first use** (a18, refusal-probes, de-accrete, SoA
   fold, FSM, ODE, Hidden Components, post-BH, born-RED, ratchet, die-by-fixing) using the exact
   text in the tables above; make each first G3-subclause reference name its sub-clause. Either
   the glosses land or the "Plain language throughout" banner comes down — not both.

6. **SPEC-B2 — record that the `proof:no-dead-export` backlog now has a defined exit.** With
   G-EXPORT + STAY-LOCAL ruled, the 17 reflexive rows are all "drop the export"; SPEC-B2 states
   the backlog empties as U.B recuts each composable, and the DEFERRED array + gate delete when
   empty (the gate's own stated exit). This closes the "else every recut re-adds rows" hazard
   ruling 8 opened.
