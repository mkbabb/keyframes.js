# Pass 1 · Research · Tranche-Rulings Ledger (the no-relitigate archaeology)

> **Lane role.** Step 1 of the owner 5-step convergence loop (OWNER-ASKS row 6 /
> OD-U18), pass 1. The convergence loop is about to assay EVERY library + demo
> module against BOTH granularity bounds (OD-U16) and re-home documentation
> (OD-U15) and suppression files (OD-U17). This ledger fixes **which structural
> decisions are RATIFIED-TERMINAL (must NOT be relitigated) versus which the U
> rulings — chiefly OD-U16's both-directions granularity edict — now AMEND**, each
> amendment carrying its prior-ruling cite. It is the guard-rail the prototype +
> critique fleets read so a "greenfield brainstorm" cannot accidentally re-open a
> settled partition, and so the genuinely-open granularity questions are worked
> rather than deferred.
>
> Read with: `OWNER-DECISIONS.md` (OD-U1..U18), `U.md` §1/§4, `waves/U.B.md` §0/§3,
> `waves/U.C.md` (wave index + Risks §R1–R8), `audit/lane-16-lib-colocation-map.md`,
> `audit/lane-03-t-verdict-trace.md`.

---

## §1 — The RATIFIED-TERMINAL ledger (DO NOT relitigate)

These structural decisions are settled law. A prototype that re-opens one is
off-charter. Each row cites the ruling that made it terminal AND the U document
that RE-AFFIRMS it (so the terminality is current, not merely historical).

| # | Ratified decision | Prior ruling (cite) | Re-affirmed in U (cite) | Terminality |
|---|---|---|---|---|
| **T-1** | **The `src/animation/` ZONE PARTITION** — the top-level directory partition into cohesive zones (physics · orchestration · engine · group · compile · resolve · ingest · scroll · waapi · presets · svg; `internal/` + `constants/` beside them). | R.W1 landed the first 7-zone cut (`docs/tranches/R/PROGRESS.md:39,84`); matured to the standing **11-zone** partition (`CLAUDE.md` "eleven cohesive zone directories (R.W1)"). The T.F edict-fold ruled **"the zone-partition DECISIONS stand"** (`docs/tranches/T/T.md:49` clause (c); `docs/tranches/T/OWNER-ASKS.md:8`). | Lane 16 headline: *"already ~80% colocated (R.W1's 11-zone partition + S.B's sub-zones did the heavy lifting)"* (`audit/lane-16-lib-colocation-map.md:11-12`). U.C thesis: *"R.W1's 11-zone partition + S.B's sub-zone carves landed cleanly"* (`waves/U.C.md:16`). | **TERMINAL.** U carves WITHIN zones; it never re-draws the zone map. |
| **T-2** | **God-class carves by DI-BY-COMPOSITION, not param-bags** — engine/group carved to ≤500L via `PlaybackState` DI; the `PlaybackHost` cast + interface ELIMINATED (grep-0); free-functions-over-a-concrete-collaborator. | R.W2/R.W2b (`docs/tranches/R/PROGRESS.md:49,54`); the no-god-module precept (`docs/tranches/R/FINAL.md:146-147`). | U.C1 EXTENDS it explicitly: *"the SAME DI-by-composition the R.W2/S.B2 carve already trusts (free functions over a concrete collaborator — no mixin, no `PlaybackHost` cast), extended one level up"* (`waves/U.C.md:145-146`). | **TERMINAL** as the carve IDIOM. U.C1's Transport core is the SAME pattern one tier up, not a redesign of it. |
| **T-3** | **The engine↔group↔waapi NO-CYCLE ring** — broken via the `getGroupFactory` DI seam; `getAnimationId` + spring `solver.ts` moved to neutral `internal/` leaves; zone barrels stop cross-zone re-export; **known-violations 9→0 (empty `[]`)**. | R.W2c (`docs/tranches/R/PROGRESS.md:58`). | Ring-fence 2 (LIGHT/HEAVY) + charter §4; U.C carves are all module-load-safe pure moves preserving the ring (`waves/U.C.md` Risks §R7). | **TERMINAL** as an invariant. (Note the SUPPRESSION FILE that recorded it is itself removed — see A-6.) |
| **T-4** | **The LIGHT/HEAVY boundary** — physics/orchestration/the Transport leaf stay value.js-free; HEAVY (engine/group/compile/resolve/ingest/scroll/waapi/svg/presets) stays behind `loadAnimationEngine()`/`./engine`. No carve crosses the static/dynamic boundary. | R.W1 boundary gate; S.B boundary hardening (`docs/tranches/S/S.md:648`). | Ring-fence 2 — a **HARD constraint** on every U.B/U.C carve (`waves/U.C.md:23-24`; charter §4.2). Every carve wave's oracle includes `proof:boundary`. | **TERMINAL — HARD constraint.** Ring-fenced; not open in U. |
| **T-5** | **The `internal/` leaf tier** — value.js-free, barrel-free (C-5), excluded from `ZONE_DIRS`; the library's global leaf tier. **AFFIRM, do not dissolve.** | C-5 (`CLAUDE.md`); S.B design. | Lane 16 F5 + census: *"every leaf is multi-zone … `internal/` is correctly the global tier. **AFFIRM.**"* (`audit/lane-16-lib-colocation-map.md:72-85,205-214`). U.C1 homes the new Transport core here as the correct global tier (`waves/U.C.md:138-140`). | **TERMINAL.** A naive colocation pass pushing leaves down into zones would be WRONG — stated so the loop cannot mis-charter it. |
| **T-6** | **`constants/types.ts` + `constants/defaults.ts`** as the LIGHT-pure global type tier. | S.B1 constants seam (`docs/tranches/S/PROGRESS.md:40`). | Lane 16 F5 AFFIRM (`audit/lane-16-lib-colocation-map.md:205-214`). | **TERMINAL** for `types.ts`/`defaults.ts`. (The `constants/index.ts` back-compat BARREL is NOT terminal — see A-3.) |
| **T-7** | **`engine/css/` sub-zone + PlaybackState single-STORAGE** (accessor delegates over one backing store; no FSM field DECLARED on the class body). | S.B2 (`docs/tranches/S/PROGRESS.md:41`). | U.C7 MIRRORS the pattern (`physics/spring/css/` mirrors `engine/css/`, `waves/U.C.md:374-381`); U.C2 retires the delegates onto verbs but the single-STORAGE store SURVIVES (`waves/U.C.md:188-193`). | **TERMINAL** as sub-zone shape. (The 16 accessor DELEGATES are retired to verbs by U.C2 — a member-surface change, not a partition change.) |
| **T-8** | **`test/<zone>` MIRROR (tests in their own dir)** — the S.B7 test perimeter, mirroring `src/animation/<zone>/`. | S.B7 (`docs/tranches/S/S.md:648,713`). | **OD-U7 RULED (2026-07-10): "Tests stay in their own dir"** — the mirror is TERMINAL, recorded as the edict's befitting-for-the-language carve-out (`OWNER-DECISIONS.md:16`). U.H ratifies + gate-checks it. | **TERMINAL by owner ruling.** The colocation edict does NOT reach into tests. |
| **T-9** | **The two package "in"s (`.` + `./engine`) + the `./engine` subpath** as the only entries / static-dynamic boundary. | R.W4 subpath (`docs/tranches/R/PROGRESS.md:64`); S.B6 drift gate. | Ring-fence 5 (charter §4.5); lane 32 F2 "root-tier terminal keep" — `index.ts`/`load-engine.ts`/`public.ts`/`easing.ts` stay at the `src/animation/` root, NOT encapsulated into a `boundary/` sub-module (`waves/U.C.md:600-604`). | **TERMINAL.** U.C13 collapses the BOOKKEEPING (five-fold hand-roster → one composition barrel) but preserves the boundary exactly (`waves/U.C.md:605-607`). |
| **T-10** | **The demo recursive-colocation RULE** — components colocate sub-components/composables/skeletons/constants/styles recursively; shared `composables/`-style dirs reserved for truly module/global members; long dirs → encapsulated modules. | T.F21 THE GRAND COLOCATION EDICT (`docs/tranches/T/OWNER-ASKS.md:8`; `docs/tranches/T/T.md:49`). | The RULE stands as the shape authority (lane 24 §9); U.B EXECUTES the moves to it. **But the RULE's terminality is of the PRINCIPLE, not its T-era execution** — see A-1. | **RULE TERMINAL; execution RE-OPENED.** |

---

## §2 — The AMENDED ledger (each amendment named with its prior-ruling cite)

OD-U16 (module granularity, **BOTH directions**) is the governing amendment
instrument for this loop: *"long files break into module dirs … absurdly small
modules should be abrogated for superfluity and instead made inline … a
granularity RULING per module (carve / keep / inline-and-delete), converged to
100%"* (`OWNER-DECISIONS.md:25`). Four adjacent U rulings (OD-U2, U7-boundary,
U15, U17) also amend prior structural decisions. Each below names the PRIOR
ruling it changes.

### A-1 — The T.F GRAND-COLOCATION EXECUTION is falsified & RE-OPENED (demo half)
**Prior ruling:** T verdict #26 marked THE GRAND COLOCATION EDICT **LANDED**
(`docs/tranches/T/FINAL.md:51`), with `demo/@/`→`demo/shared/` (T.F1) and dissolve
`components/custom/` (T.F2) as its two ROOT waves.
**Amendment:** Lane 03 proves #26 is overstated — the two ROOT structure waves
**never executed** (`demo/@/` is still a literal on-disk dir; `components/custom/`
still wraps the whole facility) and the keystone gate `proof:colocation` was
**shaped to pass without them** via a tolerant `SHARED`/`DEFERRED` map
(`proof-colocation.mjs:50,69`; `waves/U.B.md:52-60`). **OD-U2 (2026-07-10) further
REPLACES the `@→shared` RENAME half** with (1) a component-CORE redesign to the
glass-ui post-BH idiom and (2) **`demo/@/` DISSOLUTION** — hoist its five children
to `demo/{components,composables,state,styles,utils}/`, alias spellings unchanged
(`OWNER-DECISIONS.md:11`; `waves/U.B.md:66-71,149-167`). `components/custom/`
dissolution STANDS. **Cite the prior ruling as SUPERSEDED-BY-OD-U2, not as prior
art to re-derive.** The U.R ledger carries #26's overstatement as row 1.

### A-2 — `compile/backward/` RENAMED to `compile/emit/` (the concern-true name)
**Prior ruling:** S.B3 created `compile/backward/` as the compile sub-zone, with the
FORWARD↔BACKWARD **zero-edge invariant** (a18) (`docs/tranches/S/PROGRESS.md:42`;
`docs/tranches/S/S.md:699`).
**Amendment (OD-U16 long-file/concern-density):** U.C8 renames `backward/` →
`emit/` and moves `entry.ts` + `view-transition.ts` INTO it, gathering all three
"→ zero-runtime CSS" emitters under one roof; **the a18 zero-edge invariant
SURVIVES as FORWARD↔`emit/`** — same seam, renamed to its true concern
(`waves/U.C.md:397-427`; `audit/lane-16-lib-colocation-map.md:138-169`). This is a
NAME + membership amendment; the SUB-ZONE CONCEPT (T-7 class) is preserved. Cite
S.B3 as the origin; the invariant is re-anchored, not repealed.

### A-3 — `constants/index.ts` back-compat BARREL dissolves (small-module inline)
**Prior ruling:** S.B1 shipped `constants/` as `types.ts` + `defaults.ts` + a
**back-compat barrel** `index.ts`, off which the 10 LIGHT importers were already
migrated (`docs/tranches/S/PROGRESS.md:40`; S.B1 constants seam).
**Amendment (OD-U16 inline direction + NO-LEGACY):** the barrel is a migrated-off
shim; heavy importers target `./defaults` directly and the barrel DISSOLVES (lane
16 F5, `audit/lane-16-lib-colocation-map.md:213-214`; folded into U.E's back-compat
barrel disposition, `U.md` §2 U.E row). `types.ts`/`defaults.ts` stay TERMINAL
(T-6); only the vestigial re-export barrel goes. This is the FIRST concrete
instance of OD-U16's inline-and-delete direction against a prior structural
artifact.

### A-4 — The OPTIONAL/threshold-gated sub-carves become a MANDATORY per-module ruling
**Prior ruling / disposition:** Lane 16 charters `group/blend/` (F6) and
`resolve/resolvers/` (F7) as **OPTIONAL**, *"charter only if F3's directory-density
N brings them in scope"* (`audit/lane-16-lib-colocation-map.md:216-231,297-298`);
U.C echoes them as an **"OPTIONAL sub-carve gated by the directory-density
disposition (Risks §R3)"** (`waves/U.C.md:256-259` U.C3; `:464-466` U.C9) — an
N-threshold heuristic decides.
**Amendment (OD-U16):** OD-U16 makes the granularity assay **UNIVERSAL and
MANDATORY** — *"the convergence loop assays EVERY library + demo module against both
bounds — a granularity RULING per module (carve / keep / inline-and-delete),
converged to 100%"* (`OWNER-DECISIONS.md:25`). The optional/threshold gating is
SUPERSEDED: `group/blend/`, `resolve/resolvers/`, and every other borderline dir
(`group/` 10-flat, `resolve/` 6-flat, `waves/U.C.md`; lane 16 census table
`:57-71`) each receives an EXPLICIT converged ruling this loop, not a deferred
"charter-only-if". The enforcement still lands as a lint rule / existing-gate
clause, NOT a new standalone gate (Risks §R3, `waves/U.C.md:802-814`; anti-sprawl
covenant OD-U10/U11).

### A-5 — The decomposition CEILING gains a symmetric FLOOR (both-directions)
**Prior ruling:** R.W2b established the one-directional `proof:decomposition`
CEILING (files >500L must carve; R drove it to **0 violations**,
`docs/tranches/R/FINAL.md:189`); `proof:zone-cohesion` measures a per-FILE line
ceiling (400/500) with an 11-entry JUSTIFIED allowlist (a line-count deferral
device, lane 16 F4 `audit/lane-16-lib-colocation-map.md:188-203`). **Every prior
structural bound was a CEILING only — nothing ruled on a floor.**
**Amendment (OD-U16 inline direction — NET-NEW bound):** *"absurdly small modules
should be abrogated for superfluity and instead made inline … The small-module
inlining is as binding as the long-file carving"* (`OWNER-DECISIONS.md:25`). This
is a bound with NO prior ruling — it is genuinely new law, not a re-derivation.
Candidate small-module inline targets the loop must rule on (from lane 16 census +
file sizes): `compile/numeric-plan.ts` (59L), `compile/easing/easing-option.ts`
(56L), `physics/spring/managed-play.ts` (67L), the `constants/index.ts` shim (A-3),
plus any absurdly-small demo composable the U.B recut surfaces. The JUSTIFIED
allowlist (lane 16 F4) is re-audited under BOTH bounds: KEEP genuine
hot-path/data-table declarations (`progress.ts`, `frame-compiler.ts`,
`play-lifecycle.ts`, `classic-data.ts`), RETIRE the emitter/pipeline entries by
STRUCTURE (carve, don't declare), and now additionally FLAG anything so small it
should inline.

### A-6 — Suppression files REMOVED (the ledger substrate itself dissolves)
**Prior ruling:** R.W2c drove `.dependency-cruiser-known-violations.json` to the
empty `[]` baseline and RESTORED it as the load-bearing `--ignore-known` substrate
(`docs/tranches/R/PROGRESS.md:58,118`). It remains on disk (3 bytes = `[]`, verified
`ls`).
**Amendment (OD-U17):** *"Suppression files removed … the violations FIX (or the rule
honestly re-scopes); suppression-by-ledger dies"* — named target
`.dependency-cruiser-known-violations.json` (`OWNER-DECISIONS.md:26`). The FILE is
DELETED this tranche; the depcruise rule enforces honestly (the ring is already at
0, so the file is a vestigial mechanism). The loop's research step also inventories
lint disables, cspell words, api-extractor overrides for the same treatment.

### A-7 — ALL CLAUDE.md files DELETED (the authoritative-inventory doc-ruling reversed)
**Prior ruling:** `src/animation/CLAUDE.md` is designated *"the authoritative
per-file inventory"* (`CLAUDE.md` project-tree note); the demo + root CLAUDE.md
carry the T/S structure prose; gates (`proof:claude-paths-live`,
`proof:claude-structure-sync`) READ them as truth.
**Amendment (OD-U15):** *"ALL CLAUDE.md files deprecated and removed TOTALLY … the
documentation lives inline (docstrings) or briefly/deftly in the README"*
(`OWNER-DECISIONS.md:24`). Three files exist (verified: `./CLAUDE.md`,
`./demo/CLAUDE.md`, `./src/animation/CLAUDE.md`). Their load-bearing content is
inventoried by THIS research step, re-homed inline-or-README, then DELETED with
every gate that reads them (glass-ui's own 5.0.0 plans the identical delete — the
constellation converges). Structural consequence: no doc file is a partition oracle
after U; the tree STATES its own shape (lane 03's *"owner reads the tree at first
`ls`"* acceptance).

---

## §3 — Boundary notes (what is NOT an amendment — avoid false re-opens)

- **U.C1 Transport core / U.C3 group-zone redesign / U.C14 CompositeState** are
  MEMBER-level and CORRECTNESS redesigns WITHIN the ratified zone/boundary map
  (T-1/T-4), NOT partition amendments. The group zone stays a zone; the composite
  becomes an owned value store inside a carved `group/draw.ts` (`waves/U.C.md:220-263`).
  Do not read them as re-opening T-1/T-2/T-3.
- **U.C13 surface collapse** amends the BOOKKEEPING (five hand-rosters → one
  composition barrel + derived type), not the two-in boundary (T-9). It is
  ADDITIVE-only under OD-U8's 5.3.0 bind (`waves/U.C.md:605-621`, Risks §R4).
- **OD-U8 (5.3.0 compatible surface)** is a HARD CONSTRAINT on every C-band surface
  change, not a structural amendment: additive/internal only; no published symbol
  removed or re-shaped (`OWNER-DECISIONS.md:17`; `waves/U.C.md:32-40`).
- **The demo `@` alias SPELLINGS** (`@components/`, `@state/`, …) are UNCHANGED by
  the `demo/@/` dissolution — only the on-disk dir + the 3-plane RHS move (A-1). A
  prototype must not "fix" the alias spellings.

---

## Rules/verdicts for the spec

1. **RATIFIED-TERMINAL (no relitigation; §1 rows T-1..T-9, T-10-principle):** the
   11-zone `src/animation/` partition (R.W1); DI-by-composition carves + the
   `PlaybackHost`-cast elimination (R.W2); the engine↔group↔waapi no-cycle ring
   (R.W2c); the LIGHT/HEAVY boundary (ring-fence 2, HARD); the `internal/` leaf tier
   and `constants/{types,defaults}.ts` global tiers (AFFIRM); `engine/css/` +
   PlaybackState single-STORAGE shape (S.B2); the `test/<zone>` mirror (OD-U7 RULED);
   the two package "in"s + `./engine` subpath + the root-tier entry keep (ring-fence
   5). The prototype/critique fleets MUST treat these as fixed; a design that
   re-draws the zone map, crosses the boundary, dissolves `internal/`, colocates
   tests into components, or encapsulates the entry seam into a `boundary/` dir is
   OFF-CHARTER.

2. **OD-U16 governs the OPEN granularity questions — assay EVERY module, BOTH bounds,
   to 100%.** The long-file carve direction has prior law (R.W2b ceiling, lane 16
   F1/F2 carves — `physics/spring/{solver,css}/`, `compile/{emit,easing}/`); the
   small-module INLINE direction is **NET-NEW law with no prior ruling** (A-5) — the
   spec must produce an explicit `carve | keep | inline-and-delete` ruling per module,
   converged to 100%, not a threshold-gated "optional" (A-4 supersedes lane 16
   F6/F7's optionality + U.C Risks §R3's N-heuristic).

3. **Named amendments the spec inherits (do NOT re-derive from the superseded
   ruling):** T.F #26 is FALSIFIED — the demo colocation EXECUTION re-opens under
   OD-U2 (`@/` DISSOLUTION, not `@→shared`; component-core to the glass-ui post-BH
   idiom) (A-1); `compile/backward/` → `compile/emit/` with a18 re-anchored to
   FORWARD↔`emit/` (A-2); `constants/index.ts` back-compat barrel dissolves (A-3);
   `.dependency-cruiser-known-violations.json` + all suppression ledgers removed
   (OD-U17, A-6); all three CLAUDE.md files deleted, content re-homed inline/README,
   their reader-gates dying in the same motion (OD-U15, A-7).

4. **The both-directions enforcement lands as lint / existing-gate clause, NEVER a new
   standalone gate** (anti-sprawl covenant OD-U10/U11; net NEW standalone gates in U
   = ZERO). The granularity RULING is a spec deliverable; its standing enforcement is
   a clause on `proof:zone-cohesion`/`proof:colocation` or an ESLint rule (U.C Risks
   §R3 disposition), decided by U.A's apparatus design.

5. **Every carve is a PURE, module-load-safe move preserving zone boundary + hot-path
   integrity** (ring-fence 2 + performance edict; U.C Risks §R7); every path-literal
   gate re-anchors basenames in the SAME motion as the move, co-scheduled ONE pass
   with U.A's CI trim (charter §3; U.C Risks §R2). Surface-touching amendments are
   ADDITIVE-only under OD-U8's 5.3.0 bind.
