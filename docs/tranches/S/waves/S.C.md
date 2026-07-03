# S.C — Legacy purge (NO legacy anywhere, with teeth)

> **This is a TRANCHE-DEVELOPMENT phase, NOT implementation.** This document is the
> wave-spec for band **S.C** of Tranche S, transcribed with zero load-bearing loss from the
> converged **SPEC-v3** (`docs/tranches/S/audit/pass1/SPEC-v3.md`, 1,833 lines — the standalone
> source of truth). Every gate definition, co-edit set, DAG edge, cost estimate, born-RED clause,
> ruling reference, and fold-row this band carries is reproduced here; an implementer must NOT need
> to read SPEC-v3. Nothing runs until the owner authorizes an impl drive. A wave is CLOSED only
> when its born-RED gate is GREEN **re-run on the merged tree** (T4, inv-16), and S.Z2 re-executes
> that oracle at close. **Branch:** `tranche-s-dev` · **Track:** lib + demo + gates.

---

## 0. Band charter — NO legacy anywhere, with teeth

S.C is the band where S applies **"NO legacy anywhere" with teeth**: the zombie `animate.ts`
cluster, the shadcn islands, the dead devDependencies, and the stale era-narration are **deleted or
enforced by born-RED gates, not rubrics** (SPEC §1). Where R and Q left a "do not touch" verdict or a
toothless informational clause, S.C converts it into a census-shaped, falsifiable gate that REDs on
the live tree today.

**The load-bearing convergence (SPEC §2.1-3) — the zombie `animate.ts` cluster is R's own instance
of the failure mode R condemned in Q.** 213 LOC, **zero importers**, excluded from every published
surface, kept alive by **two self-referential test files** and still documented as "the single-call
front door" in **both** CLAUDE.md files (a09, a13, a14, a20, a29, r2 finding 9). **Five lanes
converge on DELETE.** S.C1 executes that DELETE with the T6 discipline (body + tests + gate + doc
mentions) and hardens the orphan-module walker so the class of defect cannot recur silently.

**The precepts this band operationalizes (SPEC §7).**

- **T6 (no cosmetic excision).** An excision deletes the **body, its tests, its gates, and its doc
  mentions**; the whole-tree symbol grep is a **discharge-checklist step** (r2 F6, a09). The
  hardened **`proof:no-orphan-module`** (dynamic-import-aware, pinned roots — **S.C1**) makes the
  class **structural** (SPEC §7 T6, §8-19 recorded-future). This governs S.C1.
- **T9 (census before fiat).** No "keep verbatim / do not touch" verdict on a shared directory
  without an importer census shipped as evidence (a24 F8). **Totality claims (NO-legacy) are proven
  by census-shaped gates — the S.C3a shadcn census clause — not by naming one island** (SPEC §7 T9).
  This governs S.C3a and S.C3b.
- **T12 (external gates are named, not assumed).** Exactly **ONE** external consume-edge exists in
  the whole plan (S.H4 parse-that 1.0.0 — the former glass-ui edge left the plan at the 2026-07-03
  S.E shelf; the 5.0.0 consume is an owner-domain HANDOFF). **No other wave may acquire an
  external dependency without an owner ruling; S.C3b is explicitly constructed to be internally
  closable** (SPEC §7 T12; §1 "What S is NOT"; line 86). This governs S.C3b — gating menubar removal
  on a missing external surface is **FORBIDDEN**.
- **§2.1-5 — no numeric line count as a GREEN criterion.** No born-RED gate in this band (or the
  plan) may carry a numeric line-count as its GREEN criterion (line counts are observed tripwires,
  not gate oracles).

**Rulings this band executes (SPEC §2.2).**

- **C-3 — `animate.ts` DELETE.** DELETE the file + **both** test files + the
  `proof:animate-orchestration` gate + **every doc mention**. **Owner-ratified at R on 0/32
  call-site evidence.** Semver debt is paid separately: backfill `docs/MIGRATION-5.1.0.md`;
  generalize the changelog gate with the **specified diff mechanism (C-18)**. **S.C1 owns this.**
- **C-18 — the generalized changelog gate's diff mechanism.** `docs/published-surface.md` is a
  **single current file with no per-release history**. **RULING:** the gate **checks out the
  previous published tag's copy** (`git show v<prev>:docs/published-surface.md`), **diffs against
  HEAD**, and **REDs on any removed row lacking a matching `docs/MIGRATION-<new>.md` entry**. The
  previous tag is resolved from **npm `dist-tags.latest`** (falling back to the highest `v*` tag).
  **No archived snapshots needed.** **S.C1 authors this gate.**
- **C-19 — the menubar migration target.** glass-ui 4.0.1 exposes `./dropdown-menu` /
  `./context-menu` — **there is no menubar surface**, so SPEC-v1's "born-RED HANDOFF if the surface
  is missing" would have fired and **silently created a second external gate (T12 violation)**.
  **RULING:** **S.C3b** migrates KeyframesEditor's menubar to glass-ui **dropdown-menu** (present in
  4.0.x; the menubar→dropdown UX remap acknowledged), with the **a24-F6 relocate-in-place fallback**
  if the remap proves unacceptable at impl — **both paths internally closable**; gating menubar
  removal on a missing external surface is **forbidden**. **S.C3b owns this.**
- **C-12 (glass-ui pin, the S.C4 slice — amended at the 2026-07-03 S.E shelf).** Hold **~4.0.x**
  through S development. Interim 4.2.0 catch-up **REJECTED**. **Never caret.** **S.C4 carries the
  pin posture** (hold; the 5.0.0 consume is no longer any S wave — it is an owner-domain HANDOFF,
  fold rows 51/52/55).

**Mode declarations (C-14, one per wave).** **S.C1 REWRITE · S.C2 REWRITE · S.C3a REWRITE · S.C3b
REWRITE · S.C4 REFINE.** Every wave in this band is REWRITE except the deliberate-bump posture wave
S.C4, which REFINEs the dependency floor.

**Intra-band + cross-band DAG (SPEC §3 "The DAG").**

```
S.A0 ──► S.C1, S.C2, S.C3a, S.C3b, S.C4        (all depend on the green-modulo-backlog CI surface)
S.C3b: Deps A0 — independent of D3
```

**Every S.C wave depends only on S.A0** (the CI-red surface must be honest before the legacy purge
lands on top of it) — none of S.C1/S.C2/S.C3a/S.C3b/S.C4 blocks another within the band. **One
construction coupling, not a DAG edge:** S.C3b's HARD GATE **is** the S.C3a shadcn census clause
(C3a authors the census; C3b's green is that census going empty after `ui/menubar` is deleted) — so
C3b is authored against C3a's clause but does not re-author it. **T7 root-set note for S.C1:** the
`proof:no-orphan-module` walker's entry-root set is perturbed by **S.B4** (deletes
`internal/index.ts`) and **S.B6** (may rewrite the loader) — **S.C1's gate re-runs green on the
post-B tree, or is authored root-set-agnostic** (SPEC §3 S.C1 T7 note).

---

## S.C1 — The `animate.ts` zombie cluster + the hardened orphan gate

**Mode: REWRITE.** **Deps: A0.** *(SPEC §3 S.C1; fold rows 23/24; C-3; C-18; sc-§2.1/§2.3; SC-2/SC-3/SC-4.)*

### Charter

Execute the owner-ratified DELETE of the `animate.ts` zombie cluster (SPEC §2.1-3: 213 LOC, zero
importers, kept alive only by two self-referential test files, still documented as "the single-call
front door" in both CLAUDE.md files — five lanes converge on DELETE) with the **T6 no-cosmetic-excision
discipline**, and **harden `proof:no-orphan-module`** so the reachability class of defect becomes
**structural**, not rubric-caught. Pay the semver debt: backfill `docs/MIGRATION-5.1.0.md` and
generalize the changelog gate with **C-18's diff mechanism**.

### Scope items

- **S1 — DELETE the zombie cluster in totality (C-3; T6; fold row 23).** Remove **all** of:
  - `src/animation/animate.ts` (the file);
  - `test/animate.test.ts` **and** `test/animate-orchestration.test.ts` (the two self-referential
    test files keeping it alive);
  - the **`proof:animate-orchestration` gate** (its script + its `package.json` roster entry + its
    coverage-roster membership);
  - **every doc mention** — the "single-call front door" narration in **both** CLAUDE.md files
    (root + `src/animation`) and any other doc reference (the whole-tree symbol grep is the T6
    discharge-checklist step).
- **S2 — Backfill `docs/MIGRATION-5.1.0.md` (fold row 24; C-3 semver-debt clause).** The migration
  doc for the 5.1.0 `animate()` excision is **absent** (the semver gap R.W4 left). Author it so the
  removed public-surface row is covered.
- **S3 — Generalize the changelog gate with C-18's diff mechanism (fold row 24; C-18; SC-4).** The
  gate:
  - **checks out the previous published tag's** `docs/published-surface.md` via
    **`git show v<prev>:docs/published-surface.md`**;
  - **diffs it against HEAD**;
  - **REDs on any removed row lacking a matching `docs/MIGRATION-<new>.md` entry**.
  - The **previous tag is resolved from npm `dist-tags.latest`**, falling back to the highest `v*`
    tag. **No archived snapshots are needed** (the single-current-file `published-surface.md` is
    reconstructed per-release via git, not stored).
- **S4 — Harden `proof:no-orphan-module` (a dynamic-import-aware reachability walker; sc-§2.1/§2.3;
  SC-2).** The walker's graph edges **include dynamic `import()` string specifiers** in
  `load-engine.ts` (and the `engine/public` composition), with the **entry-root set pinned
  explicitly** to `{ index.ts, load-engine.ts, engine/index.ts, engine/public.ts }`. **Without the
  dynamic-import edges the entire HEAVY lazy surface false-REDs while `animate.ts` stays
  indistinguishable** — so the walker must resolve the lazy split's `import()` specifiers as real
  graph edges, else the gate is useless. **T7 root-set note:** the root set is perturbed by
  **S.B4** (deletes `internal/index.ts`) and **S.B6** (may rewrite the loader) — **C1's gate
  re-runs green on the post-B tree, or is authored root-set-agnostic** (SPEC §3 S.C1).
- **S5 — Scope the `animate(` reference clause honestly (sc-§2.3; SC-3).** The `animate(` grep clause
  is scoped to the **excised front-door symbol** — an `import … animate` or a **call not preceded by
  `.` / `Element`** — with an **explicit allowlist** for **`Element.animate()` WAAPI prose** and
  **historical CHANGELOG rows**. (Bare substring matching would false-RED on WAAPI documentation and
  changelog history.)

### The HARD GATE

**Gate names:** **`proof:no-orphan-module`** (hardened) + the **generalized changelog gate** (C-18
diff mechanism) + the **zero front-door `animate(` references** clause (scoped).

**Born-RED witness plan.**
- **`animate.ts` REDs `proof:no-orphan-module` today**: the file is a zero-importer orphan; the
  dynamic-import-aware walker rooted at `{ index.ts, load-engine.ts, engine/index.ts, engine/public.ts }`
  finds `animate.ts` unreachable → RED. After S1 deletes the file, the walker is GREEN and the whole
  HEAVY lazy surface is **NOT** false-RED (because the dynamic `import()` edges keep it reachable).
- **The front-door reference clause REDs** while any `import … animate` / bare-`animate(` call exists
  outside the `Element.animate()` + CHANGELOG allowlist; GREEN after S1's doc/symbol purge.
- **The changelog gate REDs** the moment `animate` is removed from `published-surface.md` **without**
  a `docs/MIGRATION-5.1.0.md` entry (S2 supplies the entry → GREEN).

**Falsifiability (both ways).** **Structural (SPEC §7 T6):** authoring the walker **without** the
dynamic-`import()` edges makes the entire HEAVY lazy surface false-RED **while `animate.ts` stays
indistinguishable** — that shape is the anti-pattern the gate exists to forbid; the pinned root set +
dynamic edges are the discriminator. Removing a published-surface row **with no** MIGRATION entry
REDs the changelog gate; a bare-substring `animate(` clause that fires on `Element.animate()` prose
is a false-RED the scoped allowlist prevents. Re-introducing any zombie orphan (a new file with zero
importers) REDs `proof:no-orphan-module`.

### Cost + DAG

DELETE (1 file + 2 tests + 1 gate + doc mentions) + `MIGRATION-5.1.0.md` backfill + the changelog
gate generalization (git-show/diff mechanism) + the orphan-walker hardening (dynamic-import edges +
pinned roots). **Deps: A0.** **T7:** re-run green on the post-**S.B4**/**S.B6** tree (root-set
perturbation), or author root-set-agnostic.

### Verification

`proof:no-orphan-module` (animate.ts REDs it today; GREEN after delete, HEAVY surface NOT false-RED)
+ **zero front-door `animate(` references outside the allowlist** + the C-18 changelog gate green
against the built surface with `MIGRATION-5.1.0.md` present. Development-only: the gate ships
born-RED (animate.ts is an orphan today); CLOSED only when GREEN re-run on the merged tree (T4);
S.Z2 re-executes.

---

## S.C2 — no-silent-fallback with teeth, scope-honest

**Mode: REWRITE.** **Deps: A0.** *(SPEC §3 S.C2; fold rows 25/26; r2 finding 10; a07 F3; sc-§2.4; SC-3.)*

### Charter

Give `proof:no-silent-fallback` **teeth**: promote its demo clauses **from informational to
enforced** (r2 finding 10), **widen Clause 1** from the 4-file R.W3 set to a **src-wide deny-pattern
scan** with the machine-checked **`KEEP:` allowlist idiom** (a07 F3), and scope the **`as any`
clause honestly** — census, fix the one live survivor, and RED only on **unlabelled** casts.

### Scope items

- **S1 — Promote the demo clauses to enforced (r2 finding 10; fold row 25).** The demo arm of
  `proof:no-silent-fallback` is **toothless (informational)** today; promote it to **enforced**.
- **S2 — Widen Clause 1 to a src-wide deny-pattern scan (a07 F3).** Widen from the **4-file R.W3
  set** to a **src-wide deny-pattern scan** carrying the **machine-checked `KEEP:` allowlist idiom**
  (a labelled legitimate site is allowed; an unlabelled silent-fallback site REDs).
- **S3 — Scope the `as any` clause honestly (sc-§2.4; fold row 26; SC-3).** The wave:
  - **censuses all 6 demo-composable `as any` sites** (≥4 composables);
  - **fixes the §2K row-4 survivor** — `useTimingFunctionEditor.ts:196` — by **widening the return
    type, NOT casting**;
  - every **surviving legitimate cast carries a `KEEP:` label**;
  - the gate **REDs on any UNLABELLED `as any` in demo composables** (NOT on the labelled
    survivors — the census recognizes the legitimate residue).

### The HARD GATE

**Gate name:** the hardened **`proof:no-silent-fallback`** (demo clauses enforced; src-wide
deny-scan; scoped `as any` clause).

**Gate criterion (SPEC §3 S.C2):** the gate **REDs on a planted demo bare-catch**; **zero
unlabelled `as any` in demo composables**.

**Born-RED witness plan.** Today the demo clauses are informational (a bare `catch {}` in a demo
composable does not RED) and `useTimingFunctionEditor.ts:196` carries the §2K row-4 unlabelled
`as any`. After S1/S2 the enforced src-wide deny-scan REDs on a **planted demo bare-catch**; after
S3 the §2K survivor is fixed (return type widened) and every legitimate cast carries `KEEP:`, so the
`as any` clause is GREEN. **Falsifiability:** a planted bare-catch in a demo composable REDs; an
unlabelled `as any` REDs; a labelled (`KEEP:`) legitimate cast does NOT RED (the census scope-honesty
— else the gate would falsely RED the legitimate residue).

### Cost + DAG

Demo-clause promotion + the src-wide deny-pattern scan with `KEEP:` idiom + the 6-site `as any`
census + the one type-widen fix at `useTimingFunctionEditor.ts:196`. **Deps: A0.**

### Verification

`proof:no-silent-fallback` REDs on a planted demo bare-catch; zero unlabelled `as any` in demo
composables; the `useTimingFunctionEditor.ts:196` survivor fixed by type-widening. Development-only;
born-RED (the demo arm is toothless today); re-run at S.Z2.

---

## S.C3a — Dead deps + stale narration (the gated/discretionary split, stated)

**Mode: REWRITE.** **Deps: A0.** *(SPEC §3 S.C3a; fold rows 27/57/63/64; a20 F4; a30; sc-§2.2/§3.2; SC-1/SC-6; x1-#4.)*

### Charter

Purge the dead dependency surface and the stale narration corpus with **census-shaped, bounded
gates** — the **T9** "totality proven by a census, not by naming one island" discipline. Delete the
8 zero-importer shadcn devDeps and the `SPRING_SMOOTH` dead constant; harden `proof:no-dead-dependency`
against false-RED; sweep the stale narration by banning **specific dead identifiers** (NOT the phrase
"scene-switcher" — the identifier-only form stays the falsifiability-correct shape; historical docs
and the S.E shelf record legitimately carry the phrase); and state the **discretionary best-effort** items
explicitly so they are neither gated nor silently dropped.

### Scope items

- **S1 — Delete `SPRING_SMOOTH` + its `void` suppression (a20 F4; fold row 57).** The dead constant
  and the `void` hack that suppressed its unused-warning are removed.
- **S2 — Remove the 8 zero-importer shadcn devDeps (fold row 27).** Remove: **`v-calendar`,
  `vaul-vue`, `embla-carousel-vue`, `@unovis/ts`, `@unovis/vue`, `vee-validate`, `@vee-validate/zod`,
  `zod`.**
- **S3 — `proof:no-dead-dependency`, falsifiability-hardened (sc-§2.2; SC-1).** The gate operates as
  an **explicit allowlist/denylist keyed off the 8 named shadcn packages** (the honest, bounded
  form) — **OR**, if generalized, it MUST:
  - **(a) match only real import/require specifiers (never comment/prose substrings)** — `zod` /
    `@unovis` appear in the tree today **only inside comments** (e.g.
    `scripts/proof-visual-lock.mjs:172`), so a substring matcher false-REDs; **and**
  - **(b) scan config + `scripts/` + plugin-reference sites in addition to src/demo** — else
    vite/tailwind/prettier/etc. dependencies **false-RED** as "unused".
- **S4 — The stale-narration sweep (sc-§3.2; fold row 63; SC-6).** The gate clause bans **specific
  dead component identifiers** — **`SceneSwitcherCarousel`, `SegmentedTabs`, `Animated.vue`,
  `ResponsiveSelect`, `AnimationMenuBar`** — **NOT the phrase "scene-switcher"** (the identifier-only
  form is the falsifiability-correct shape; historical docs and the S.E shelf record — band SHELVED
  by owner ruling 2026-07-03 — legitimately carry the phrase). The corpus
  **adds the proof-script narration sites** (`proof-visual-lock.mjs:172`'s "unovis graph (live)"
  narration).
- **S5 — The shadcn census clause (x1-#4; T9).** A **repo-wide grep for `cn(` /
  `class-variance-authority` / `@radix-*` returns EMPTY post-purge** — **NO-legacy proven by census,
  not menubar-scoped.** (This is the same clause S.C3b's gate consumes as its acceptance signal.)
- **S6 — Discretionary best-effort (STATED, UNGATED).** These are explicitly discretionary
  (best-effort, not gated) so they are recorded, not silently dropped:
  - `docs/frontend-design/demo/*.md` path remaps (**a30** — land **before S.G reads them**, fold
    row 64);
  - `design-idioms.css` tombstone collapse;
  - `soa.ts` / group-barrel / renamed-file headers;
  - dep-cruiser / lint-clean baseline narratives;
  - `taxonomy.json` BORN-RED prose;
  - the `<SegmentedTabs>` narration;
  - the 2 orphaned pre-2024 assets.

### The HARD GATE

**Gate names / clauses:** **`proof:no-dead-dependency`** (born-RED today) + the **dead-identifier
grep clause** + the **shadcn census clause**.

**Born-RED witness plan.** Today all **8 shadcn packages are present** in `package.json` →
`proof:no-dead-dependency` REDs. `SPRING_SMOOTH` + the `void` hack are live; the dead identifiers
(`SceneSwitcherCarousel`, `SegmentedTabs`, `Animated.vue`, `ResponsiveSelect`, `AnimationMenuBar`)
and the `cn(` / `class-variance-authority` / `@radix-*` shadcn footprint are present. After S1/S2/S4
the gate GREENs; the census grep returns empty (S5).

**Falsifiability (both ways).** **The false-RED trap is the falsifier:** a substring-matching
`proof:no-dead-dependency` REDs on `zod` / `@unovis` **comment mentions** (`proof-visual-lock.mjs:172`)
and REDs on config/scripts/plugin dependencies — so the gate MUST match only real import/require
specifiers AND scan config + `scripts/` + plugin sites (the bounded 8-package allowlist form is the
primary, false-RED-immune shape). Banning the **phrase** "scene-switcher" would false-RED on the
historical docs + the S.E shelf record (band SHELVED by owner ruling 2026-07-03) — so the sweep bans
**specific dead identifiers**, never the phrase. Re-adding any
of the 8 packages, `SPRING_SMOOTH`, or a `cn(` / `@radix-*` footprint REDs.

### Cost + DAG

`SPRING_SMOOTH` + `void` delete + 8 devDep removals + the `proof:no-dead-dependency` hardening
(allowlist form OR the two generalized-form conditions) + the dead-identifier grep + the corpus
proof-script sites + the shadcn census clause. The discretionary best-effort items (S6) are stated,
ungated. **Deps: A0.**

### Verification

`proof:no-dead-dependency` born-RED today (the 8 packages present) → GREEN post-purge; the
dead-identifier clause; the shadcn census clause (`cn(`/`class-variance-authority`/`@radix-*` grep
empty). Development-only; born-RED; re-run at S.Z2.

---

## S.C3b — The menubar migration (its own priced sub-item)

**Mode: REWRITE.** **Deps: A0 (independent of D3).** *(SPEC §3 S.C3b; fold row 28; C-19; T8; T12; a24-F6; sc prune; SC-5.)*

### Charter

Migrate KeyframesEditor's menubar off the shadcn island **per C-19 — internally closable, NO second
external gate**. glass-ui 4.0.1 exposes `./dropdown-menu` / `./context-menu` but **no menubar
surface**; SPEC-v1's "born-RED HANDOFF if the surface is missing" would have **fired and silently
created a second external gate (T12 violation)** — so this wave is **explicitly constructed to be
internally closable** (SPEC §7 T12).

### Scope items

- **S1 — Migrate to glass-ui `dropdown-menu` (C-19).** Migrate KeyframesEditor's menubar to glass-ui
  **`dropdown-menu`** (present in **4.0.x** — no external gate; the **menubar→dropdown UX remap is
  acknowledged**).
- **S2 — The a24-F6 relocate-in-place fallback (C-19).** If the dropdown remap **proves unacceptable
  at impl**, the **a24-F6 relocate-in-place** path is the fallback — **both paths are internally
  closable** (neither introduces an external gate).
- **S3 — Delete the island (fold row 28; T6).** Delete **`ui/menubar/` (16 files)** + **`utils.ts`'s
  `cn`** (verified **menubar-private**).
- **S4 — The forbidden shape, stated (T12).** **Gating menubar removal on a missing external surface
  is FORBIDDEN** — no second external gate (the plan's only external consume-edge is S.H4; the
  former glass-ui edge left at the 2026-07-03 S.E shelf; SPEC §7 T12).

### The HARD GATE

**Gate:** the **shadcn census clause (from S.C3a)** — it **REDs while `ui/menubar` exists; GREEN
after**. Plus an **interaction-axis test (T8)**: KeyframesEditor's **menu interactions are covered by
an interaction-axis test**, not only a source-shape gate (T8 — the documented gate-blindspot cure;
live verification via chrome-devtools-mcp).

**Born-RED witness plan.** Today `ui/menubar/` (16 files) + the `cn` shadcn footprint are present →
the S.C3a shadcn census clause (`cn(` / `class-variance-authority` / `@radix-*` grep) **REDs** while
`ui/menubar` exists. After S1/S3 the menubar migrates to `dropdown-menu` (or relocates in place) and
the island is deleted → the census clause GREENs. The T8 interaction-axis test asserts the migrated
menu's keyboard/focus behavior survives the remap.

**Falsifiability.** The census clause REDs while any `ui/menubar` file or `cn`/`@radix-*` footprint
survives. **The T12 falsifier:** any attempt to gate menubar removal on a **missing external
surface** (a "born-RED HANDOFF if the surface is missing") is the forbidden shape — S.C3b is
constructed so **no** external dependency exists (dropdown-menu is present in 4.0.x; the fallback is
in-repo). A source-shape-only removal with no interaction-axis test does not satisfy T8.

### Cost + DAG

The dropdown-menu remap (or a24-F6 relocate-in-place fallback) + `ui/menubar/` 16-file delete +
`utils.ts(cn)` delete + the T8 interaction-axis test. **Deps: A0 (independent of D3.)** **Construction
coupling:** the gate IS the S.C3a shadcn census clause (C3a authors it; C3b's green is that census
going empty) — not a DAG ordering edge, but C3b is authored against C3a's clause.

### Verification

The shadcn census clause REDs while `ui/menubar` exists, GREEN after the migration; KeyframesEditor's
menu interactions covered by a T8 interaction-axis test; **no external gate introduced** (T12).
Development-only; born-RED (the island is present today); re-run at S.Z2.

---

## S.C4 — Dependency posture

**Mode: REFINE.** **Deps: A0.** *(SPEC §3 S.C4; fold rows 61/62; C-12; a31; a21 F4.)*

### Charter

Refine the dependency floor with **deliberate, tested bumps** and settle the value.js-bug guard's
lifecycle. This is the one REFINE wave in the band: it does not excise a surface, it advances the
dependency posture and re-verifies the baselines.

### Scope items

- **S1 — Deliberate tested bumps (fold row 62).**
  - **dependency-cruiser 17→18** (re-verify the `[]` known-violations baseline stays empty);
  - **fast-check 3→4**;
  - **`@types/node` aligned to the engines floor** (Node >=22).
- **S2 — `VJS_PARAM_BUG_MAX` lifecycle (fold row 61; a31, a21 F4).** Checked against the value.js
  changelog and **deleted per its own lifecycle if `extractFunctions` is fixed upstream** (value.js
  ≤1.2.0 bug); **else KEEP with a citation**.
  **INBOUND-LETTER NOTE (2026-07-03, `../VALUEJS-R-COORDINATION-2026-07-03.md`, b7fea38):** the
  upstream fix is REAL — value.js 2.0.0 (their R.W1) lands the KF-1 grammar fix + the
  `type→syntax`/`defaultValue→default` rename, and its §1 deletion map covers the FULL recovery
  apparatus (`normalizeParam`+`NormalizedParam` at `resolve/resolve-function.ts:22-90`, this guard,
  the `coerceArg` ≤1.2.0 arm) + the `^2.0.0` re-pin. This S2 clause is NOT silently satisfied by
  else-KEEP: the letter requests owner ruling 5 (PROGRESS.md "Owner rulings" #5 — re-scope this S2
  into the named 2.0.0 consume-edge, or book the payload explicitly to the successor tranche).
  Sequencing rides owner ruling 6 (single re-pin after value.js's parse-that-1.0.0-carrying 2.0.x
  follow-on vs double). Do not act before `@mkbabb/value.js@2.0.0` is on the registry (`npm view`).
- **S3 — glass-ui pin posture per C-12 (amended at the S.E shelf).** **HOLD** the ~4.0.x pin
  through S development; the 5.0.0 consume is an **owner-domain HANDOFF** (no S wave since the
  2026-07-03 shelf — this band owns only the hold). Interim 4.2.0 catch-up is REJECTED; **never
  caret**.

### The HARD GATE

**Gate criterion (SPEC §3 S.C4):** **`proof:pin-ledger-current` green post-bumps**; the **lint
baseline still `[]`** (dependency-cruiser known-violations remains empty).

**Born-RED witness plan.** `proof:pin-ledger-current` is RED today at the S.A0 layer (PIN-LEDGER
frozen at 4.4.0/1.1.0/0.12.0 vs installed 5.1.0/1.2.0/0.13.0 — S.A0 re-authors the ledger). S.C4's
gate is GREEN only when the **post-bump** ledger (dependency-cruiser 18, fast-check 4, aligned
`@types/node`, the resolved `VJS_PARAM_BUG_MAX` lifecycle, the held glass-ui ~4.0.x pin) matches the
installed set AND the dependency-cruiser baseline is still `[]`. **Falsifiability:** a bump that
leaves the ledger stale REDs `proof:pin-ledger-current`; a dependency-cruiser 18 upgrade that
introduces a new cycle breaks the `[]` baseline and REDs; a caret glass-ui pin (or an interim 4.2.0
catch-up) violates C-12.

### Cost + DAG

Three tested bumps + the `VJS_PARAM_BUG_MAX` changelog check + the glass-ui pin-posture hold. **Deps:
A0** (the PIN-LEDGER re-author S.A0 lands is the surface this wave bumps against).

### Verification

`proof:pin-ledger-current` green post-bumps; dependency-cruiser known-violations baseline still `[]`;
glass-ui held at ~4.0.x (the 5.0.0 consume is an owner-domain HANDOFF since the S.E shelf). Development-only; re-run at S.Z2.

---

## Appendix A — Fold rows this band owns (SPEC §4, verbatim dispositions)

Every §4 chronic/deferral fold row whose S-disposition names an S.C wave, restated so an implementer
need not consult SPEC-v3. **"Terminal" uses C-20's structural definition** (a deterministic re-shaped
gate or an owner-ratified KILL with a re-run witness — never observe-in-CI / WATCH / a re-verify
verb); every disposition is re-derived from a locally-reproduced signature at impl, never inherited
from the table (SPEC §4 header).

| # | Item | Born | Chronicity | S-disposition |
|---|------|------|-----------|---------------|
| 23 | animate.ts zombie + 2 tests + stale docs | R.W4 | new | **WAVE S.C1** (DELETE; hardened orphan walker per sc-§2.1) |
| 24 | MIGRATION-5.1.0.md absent (semver gap) | R.W4 | new | **WAVE S.C1** (backfill + the C-18 diff-mechanism changelog gate) |
| 25 | no-silent-fallback demo arm toothless | R.W3 | new | **WAVE S.C2** |
| 26 | §2K row 4 `as any` (useTimingFunctionEditor:196) | R.W3 | new | **WAVE S.C2** (fix + census the other 5 with KEEP: labels) |
| 27 | 8 zero-importer shadcn devDeps | pre-A | ancient | **WAVE S.C3a** (allowlist-form no-dead-dependency gate) |
| 28 | ui/menubar island + utils.ts(cn) | pre-A | ancient | **WAVE S.C3b** (C-19: glass-ui dropdown-menu, present in 4.0.x, OR relocate-in-place — internally closable; NO external gate) |
| 57 | SPRING_SMOOTH dead constant + void hack | P | 2 | **WAVE S.C3a** |
| 61 | VJS_PARAM_BUG_MAX (value.js ≤1.2.0 bug) | Q | 1 | **WAVE S.C4** (delete per lifecycle if fixed upstream; else KEEP with citation) |
| 62 | dependency-cruiser 17→18, fast-check 3→4, @types/node | old | old | **WAVE S.C4** |
| 63 | Stale comments/narration corpus (dead identifiers ×5, soa.ts, barrels, baselines, taxonomy prose, headers, proof-script sites) | Q–R | mixed | **WAVE S.C3a** (gated: dead-identifier grep — NOT the phrase "scene-switcher", which the S.E shelf record legitimately carries; discretionary items stated) |
| 64 | docs/frontend-design/demo/*.md pre-fusion paths | pre-R | 1 | **WAVE S.C3a** (remap before S.G reads them; discretionary tier, stated) |

---

## Appendix B — Critique disposition rows (SPEC §9 sc-legacy, 6 edits)

The band's traceability to the critique fleet — every sc-legacy blocking edit and its absorption site
(SPEC §9). All ABSORBED; none DISPUTED.

| # | Edit | Absorbed at |
|---|------|-------------|
| SC-1 | proof:no-dead-dependency: specifier-only matching + config/scripts scan, OR the explicit 8-package allowlist form | **ABSORBED** §3 S.C3a (allowlist form primary; the generalized form's two conditions stated) — this doc S.C3a/S3 |
| SC-2 | proof:no-orphan-module: resolve dynamic import() specifiers as graph edges; pin the entry-root set | **ABSORBED** §3 S.C1 (walker clause + pinned roots + the post-B re-run note) — this doc S.C1/S4 |
| SC-3 | Scope the animate( grep to the front-door symbol + allowlist Element.animate/CHANGELOG; scope the as-any clause to the fixed site + KEEP: allowlist | **ABSORBED** §3 S.C1 (scoped grep — this doc S.C1/S5) + §3 S.C2 (census + KEEP: labels; unlabelled-only REDs — this doc S.C2/S3) |
| SC-4 | Specify the generalized changelog gate's snapshot/diff mechanism | **ABSORBED** C-18 (git-show of the previous published tag; RED on removed row without MIGRATION entry), §3 S.C1 — this doc S.C1/S3 |
| SC-5 | Name the menubar target (dropdown-menu, present, no external gate) OR relocate-in-place; forbid gating on a missing surface | **ABSORBED** C-19, §3 S.C3b (its own priced sub-item per the prune) — this doc S.C3b |
| SC-6 | Stale-comment gate bans specific dead identifiers (not "scene-switcher"); corpus += proof-script sites | **ABSORBED** §3 S.C3a; fold row 63 rewritten — this doc S.C3a/S4 |

**Cross-cutting absorption touching S.C (SPEC §9 x1):** **X1-4** — S.C3: add the shadcn-census gate
clause (`cn(` / `class-variance-authority` / `@radix-*` grep empty post-purge) — **ABSORBED** §3
S.C3a (this doc S.C3a/S5, consumed as S.C3b's acceptance gate). **Precept absorptions:** T6 → S.C1
(the hardened dynamic-import-aware `proof:no-orphan-module` makes the orphan class structural, SPEC
§7 T6 / §8-19); T9 → S.C3a/S.C3b (totality proven by the shadcn census, not by naming one island,
SPEC §7 T9); T12 → S.C3b (explicitly constructed to be internally closable — no second external gate,
SPEC §7 T12); T8 → S.C3b (the KeyframesEditor menu interaction-axis test).

---

## Appendix C — DEV→IMPL boundary (binding for every S.C wave)

Every wave above is **DEVELOPMENT ONLY** (SPEC §1 "What S is NOT"). Each ships a falsifiable
**born-RED gate**; nothing runs until the owner authorizes an impl drive (inv-16). A wave is **CLOSED
only when its born-RED gate is GREEN re-run on the merged tree** (T4, r2 F4), exit code recorded in
PROGRESS.md; **S.Z2 re-executes that oracle at close** (a re-run, not a re-read). Parallel drives
re-run every touched gate from a clean independent checkout — "pre-existing" claims are verified by
triage, never accepted (T5, a15); node_modules symlinks are never git-added. **Every S.C wave depends
on S.A0** (the CI surface must be honest before the legacy purge lands). **S.C1's T7 obligation:** the
`proof:no-orphan-module` root set is perturbed by **S.B4** (deletes `internal/index.ts`) and **S.B6**
(may rewrite the loader) — C1's gate must re-run green on the post-B tree, or be authored
root-set-agnostic (SPEC §3 S.C1). **T6 discharge-checklist (S.C1):** an excision deletes the body,
its tests, its gates, and its doc mentions — the whole-tree symbol grep is a mandatory discharge step,
not an afterthought.
