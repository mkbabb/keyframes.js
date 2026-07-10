# Pass 1 · Research lane — claudemd-inventory (OD-U15)

**Mandate:** OWNER-ASKS.md row 6 + OD-U15 — ALL CLAUDE.md files deprecated and
removed TOTALLY; each load-bearing piece re-homed inline (docstring at the code it
describes) or briefly/deftly into the README; the files DELETE with every gate that
reads them dying in the same motion.

**Scope found.** Exactly THREE tracked CLAUDE.md files (the rest are `.claude/worktrees/*`
copies — untracked worktree checkouts, irrelevant, they vanish when the worktrees are pruned):

- `CLAUDE.md` (root, 119 L)
- `src/animation/CLAUDE.md` (396 L — the per-file/per-class inventory)
- `demo/CLAUDE.md` (127 L)

Plus the standing project-instruction copy injected via the harness (the CLAUDE.md
shown in-context) — same root file.

---

## Part A — the gate-death list (every script that READS a CLAUDE.md)

Grep of `scripts/` + `.github/` for `CLAUDE.md`. Two classes: **load-bearing readers**
(the script's exit code depends on CLAUDE.md content — dies or re-points) vs
**comment-only** (a docstring/comment mentions the file — no read; delete the mention).

### Load-bearing readers (die or re-point with the deletion)

| Gate | What it reads | Verdict on deletion | Invariant already covered elsewhere? |
|---|---|---|---|
| **`proof:claude-paths-live`** (`proof-claude-paths-live.mjs`, 761 L — WHOLLY dedicated) | All 3 files: tree-fence paths (a), inline backtick paths (b), HEAVY/LIGHT export list ⊆ AnimationEngine (c), zone-count self-consistency (d), demo `@` doc-drift (e) | **DELETE the entire script.** It is a doc-truth gate for docs that cease to exist. | YES — (c) is redundant with `proof:engine-subpath-mirror` (runtime keys ⊆ d.ts) + `proof:published-surface` (the real surface). (a)/(b)/(d)/(e) are pure self-consistency of prose that's gone. NO real invariant lost. |
| **`proof:engine`** (`proof-engine.mjs:304–319`, clause `managed-pause-doc`) | `src/animation/CLAUDE.md` for the "Managed-child lifecycle" contract text + `group.ts` for its cross-link comment | **RE-POINT.** The contract's authoritative statement moves INTO `group.ts` (already 90% there at `group.ts:332–337`, currently phrased as a *cross-link* to CLAUDE.md). Gate reads the group-source docstring instead. | Contract survives — it just becomes source-resident. Invert the pointer: source IS the authority, no CLAUDE read. |
| **`proof:published-surface`** (`proof-published-surface.mjs:463–559`, clause (e)) | root `CLAUDE.md`: phantom paths (`src/parsing`, `src/units`, …), phantom demo dirs, every `§Project Tree` `.ts` name exists, frozen test/bench counts | **SPLIT.** The *disk-truth* halves survive as pure filesystem checks (no phantom `src/parsing` on disk; `demo/{@,app,scenes}` exist; no `demo/<scene>/` at top level). The *doc-truth* halves (doc re-asserts phantom / doc freezes a count) DIE with the doc. | Disk-truth is real, keep it (drop the `fs.readFileSync(CLAUDE.md)`); doc-truth is moot once the doc's gone. |
| **`proof:drag2d-light-certified`** (`proof-drag2d-light-certified.mjs:118–147`, clause (a)) | root + `src/animation/` CLAUDE.md LIGHT lists must NAME `drag2D` | **DROP clause (a)'s CLAUDE reads.** | YES — `proof:published-surface` clause (i) (`:710–733`) already certifies `drag2D` ∈ the parsed LIGHT runtime export set. The CLAUDE mention was the redundant half. README §`drag`/`Draggable` names it in prose. |
| **`proof:no-dead-dependency`** (`proof-no-dead-dependency.mjs:264–267`) | NARRATION-SURFACE list literally includes `"CLAUDE.md"`, `"src/animation/CLAUDE.md"`, `"demo/CLAUDE.md"` | **REMOVE those 3 entries** from the list. `README.md` + `DESIGN.md` remain the narration surfaces. | Dep-narration truth now lives only in README/DESIGN — still gated. |

### Comment-only mentions (no read — just scrub the stale reference)

`proof-no-flat-siblings.mjs:13`, `demo-roster.mjs:251`, `proof-board-live.mjs:12`,
`proof-ci-coverage.mjs:204`, `proof-dogfood-hero.mjs:50` — each mentions CLAUDE.md in
a comment/rationale; none reads it. Delete/rewrite the comment; no behavior change.

### README collateral (dies unless README is edited in the same motion)

- `README.md:46–47` — Project-Structure fence comments `(see src/animation/CLAUDE.md)` / `(see demo/CLAUDE.md)`.
- `README.md:54` — **`For the authoritative per-file inventory, see [\`src/animation/CLAUDE.md\`](src/animation/CLAUDE.md).`** This is a `](src/…)` link → **`proof:readme-paths-live` clause (a) will FIRE** (dead link) the moment the file is deleted. README MUST be edited in the same commit.

`ci.yml` matches `CLAUDE.md` only via the `proof:claude-paths-live` npm-script wiring — dies with the script's package.json entry.

**package.json:** delete the `proof:claude-paths-live` script line (`:61`) and its `proof:hygiene-chain` reference (the long chain string).

---

## Part B — per-file claim inventory + re-home map

Legend: **LB** = load-bearing (a gate or another file depends on it) · **DOC** =
useful architecture prose (re-home) · **STALE/REDUNDANT** = duplicated by an
authoritative source (tsconfig/package.json/d.ts) → DELETE outright.

### B.1 — root `CLAUDE.md`

| Claim / section | Class | Re-home target |
|---|---|---|
| Tagline + Build command table | STALE | package.json `scripts` IS the authority; the one-line tagline already in `README.md:3`. DELETE. |
| §Project Tree (the 11-zone ASCII + per-dir gloss) | DOC (partially LB via `published-surface` (e) disk-truth) | The per-zone gloss → each zone's `index.ts` barrel docstring (see B.2 Zone map). A ~6-line top-level tree already in `README.md:43–52` (Project Structure) — keep that, drop its CLAUDE pointers. |
| "eleven cohesive zone directories" sentence | LB (`claude-paths-live` (d)) | Self-consistency only, no external truth. DELETE (gate dies). |
| §Library Entry Point — the two package "in"s + boundary prose | DOC — genuinely valuable | Inline: `index.ts` module docstring (LIGHT surface + boundary) + `load-engine.ts` + `public.ts` docstrings. Brief README: already at `README.md:124` (§The dynamic engine) + `:413` (§Baseline, tree-shaking). Tighten those, delete the CLAUDE copy. |
| LIGHT / HEAVY export bullet lists | LB (`claude-paths-live` (c), `drag2d` (a)) but REDUNDANT | The d.ts + `proof:published-surface`/`proof:engine-subpath-mirror` are the real authority. DELETE the hand-list; README §124 already enumerates the HEAVY set deftly. |
| §Dependencies (value.js role + parse-that struck-row history) | DOC | The value.js role → `README.md` already has it (§Installation / boundary); the parse-that-history aside → drop (historical, no longer true-forward). One line in `src/animation/index.ts` docstring if kept at all. |
| §Conventions (tsconfig flags, aliases, prettier, Node) | STALE/REDUNDANT | `tsconfig.json` + `.prettierrc` + `package.json` `engines` ARE the authority. DELETE. |
| §Architecture Notes (frame pipeline, playback modes, interp dispatch, layer blend, WAAPI eligibility, primitives, timeline, scroll-timeline, manual-timeline) | DOC | Inline docstrings at the named files: `compile/frame-compiler.ts`, `physics/playback.ts`, `engine/interpolate.ts`, `group/compositor.ts`, `waapi/eligibility.ts`, `orchestration/timeline/*`. Most already have partial docstrings. README already covers WAAPI (§405) + primitives (§446+). |

### B.2 — `src/animation/CLAUDE.md` (the heaviest re-home)

| Claim / section | Class | Re-home target |
|---|---|---|
| §The two package "in"s | DOC | `index.ts` + `public.ts` docstrings (same as root B.1). |
| §The value.js static/dynamic boundary (the `proof:boundary` mechanism prose) | DOC | `index.ts` module docstring + a one-liner atop `scripts/proof-boundary.mjs` (the gate self-documents its own mechanism). |
| §Zone map (the full per-file ASCII with per-file glosses) | DOC — the "authoritative per-file inventory" README points at | **Each zone's `index.ts` barrel gets a module docstring listing its files' roles.** This is the idiomatic home (co-located with the code, cannot drift silently). ~11 barrels: `physics/`, `orchestration/`, `engine/`, `group/`, `compile/`, `resolve/`, `ingest/`, `scroll/`, `waapi/`, `presets/`, `svg/` + `internal/` (no barrel — a header comment in `internal/leaves.ts` or a short `internal/` note). |
| §Classes + primitives (KeyframesAnimation, CSSKeyframesAnimation, AnimationGroup, NumericAnimation, SmoothProgress/SpringProgress, Oscillator, ElementMorph, Timeline family, RAFPlayback, orchestration tier, SVG factories, round-trip compile surface) | DOC | Per-class docstring at each class file (`engine/animation.ts`, `engine/css/css-animation.ts`, `group/group.ts`, `physics/*`, `orchestration/*`, `svg/*`, `compile/backward/*`). Most classes ALREADY carry docstrings; fold the missing detail in. README §Animation / §Beyond CSS already the consumer-facing cut. |
| **§AnimationGroup → "Managed-child lifecycle (the one contract, stated once)"** | **LB (`proof:engine` managed-pause-doc)** | **`group.ts:332–337`** — the cross-link comment there already restates it; promote it to the authoritative full statement (loop-owned; last-rAF-clock `pausedTime`; `resume` un-pauses directly never `child.resume()`; `settle` releases). Re-point `proof-engine.mjs` to grep the group source. |
| §Boundary ergonomics — `resolveEasing` | DOC | `easing.ts` module docstring (largely there already). |
| §Playback modes (4 modes) | DOC | `physics/playback.ts` docstring + README §Web Animations API (§405). |
| §WAAPI eligibility | DOC | `waapi/eligibility.ts` + `waapi/densify.ts` docstrings. README §405 for the consumer cut. |
| **§Computed-unit container contract (`bumpLayoutEpoch`) + RECORDED non-action** | DOC — important consumer contract | Inline: `constants/defaults.ts` or a `computed-unit` note at `engine/interpolate.ts` (the resolution seam). Brief README: §Units (`README.md:256`) gains the `bumpLayoutEpoch` contract paragraph — it IS a public consumer obligation. |
| §Key types (`constants/types.ts`) | DOC/REDUNDANT | `constants/types.ts` is self-documenting TS; add a short module docstring. Defaults values → `constants/defaults.ts` docstring. |
| §Dependencies (value.js reach) | REDUNDANT | package.json + the boundary docstring. DELETE. |
| `drag2D` orchestration-tier note | LB (`drag2d` (a)) → drop | `orchestration/drag/drag-2d.ts` docstring + README §`drag`/`Draggable` (§655). Gate (a) re-points to `published-surface` (i). |

### B.3 — `demo/CLAUDE.md`

| Claim / section | Class | Re-home target |
|---|---|---|
| §Structure (the full demo ASCII tree) | DOC | Colocation IS the doc (OD-U16 dissolves it further). A ~10-line orientation tree → `demo/DESIGN.md` (extends glass-ui's; the demo's design/structure home) OR a short `demo/README.md`. Per-file inventory dissolves into inline barrels. |
| §Animation Controls (`instrument/` facility breakdown) | DOC | `demo/@/components/custom/instrument/index.ts` barrel docstring (the lazy barrel already the seam). NOTE: OD-U2 dissolves `@/` and `components/custom/` — this text is being **actively restructured**, so re-home MINIMALLY, let the new structure self-document. |
| **§The `demo/@` → `shared` rename ruling (S.D4, "terminal, not deferred")** | STALE — **REVERSED by OD-U2** | OD-U2 RULES to DISSOLVE `demo/@/` entirely (shadcn vestige). This whole section is now WRONG-FORWARD. DELETE (do not re-home). |
| §Scenes (the 6-scene feature table) | DOC | `app/scene/scenes.ts` docstring (the scene registry) — co-located with the loaders. |
| §Key Dependencies | REDUNDANT | `demo/package.json` (or root, per demo packaging). DELETE. |
| §Conventions (Tailwind, aliases, shortcuts, lazy panes, stores, markRaw, pointer-events, Euler) | DOC (partly) | The genuinely-load-bearing idioms (markRaw→rAF-sync bridge; Euler `Rx·Ry·Rz`; select-suppression token) → docstrings at their owning composables (`useAnimationSync`, `quaternionEuler.ts`, `gestureSelectSuppression.ts`). The rest (Tailwind/aliases) → REDUNDANT with config. |

---

## Part C — README target shape + current state

**Current README** (`README.md`, 829 L): already a strong, comprehensive library
README — hero + tagline + demo link, Quick Start (runnable, `./engine` subpath),
Installation, Project Structure, a full API reference (Animation, options, timing
funcs, `CSSKeyframesAnimation`, `AnimationGroup`, Presets, the round-trip
ingest/scroll/compile, WAAPI, tree-shaking, every LIGHT primitive), Ecosystem,
Build, Contributing, License, Sources. It is NOT a stub — it is close to the target.

**A great library README carries** (and the current one's state):
- Hero + one-sentence what/why + live demo link — ✅ present.
- Install + minimal runnable Quick Start — ✅ present (runnable, gated by `proof:readme-runs`).
- The mental model / architecture boundary (the LIGHT/HEAVY, the `.` vs `./engine` "in") — ✅ present but SPLIT across §124 + §413; absorb the CLAUDE boundary prose here deftly.
- API reference by capability — ✅ thorough.
- The public consumer *contracts* that currently live ONLY in CLAUDE.md — **GAP to fill**: the `bumpLayoutEpoch` computed-unit contract (→ §Units) and a one-line managed-child-group note (→ §AnimationGroup).
- Contributing / local CI repro / license / provenance — ✅ present.

**README edits required by the deletion** (same commit, else gates red):
1. Drop the dead link `README.md:54` (`](src/animation/CLAUDE.md)`) — else `proof:readme-paths-live` (a) fires.
2. Rewrite `:46–47` fence comments (drop `see …/CLAUDE.md`).
3. Absorb: `bumpLayoutEpoch` contract → §Units; tighten §124/§413 with the boundary prose; keep the HEAVY enumeration deft.

**Net:** README grows by ≈2 small paragraphs, not a rewrite. The BULK of CLAUDE.md
content is per-file/per-class inventory → **inline docstrings at barrels + class
files** (OD-U15's "lives inline" clause), NOT the README.

---

## Part D — suppression-file note (OD-U17 adjacency)

Out of this lane's charter but observed while grepping: `proof:claude-paths-live`
carries a `--plant-test` born-RED self-check (healthy — it proves each clause bites).
When the script is deleted, that self-check dies with it (no separate ledger). No
CLAUDE.md-adjacent suppression file exists; the `.dependency-cruiser-known-violations.json`
of OD-U17 is a separate lane.

---

## Rules/verdicts for the spec

1. **DELETE all three tracked CLAUDE.md files** (root, `src/animation/`, `demo/`).
   The `.claude/worktrees/*` copies are untracked checkouts — ignore (they prune with the worktrees).
2. **Delete `scripts/proof-claude-paths-live.mjs` in whole** + its package.json script
   line + its `proof:hygiene-chain` reference. Its only non-redundant invariant
   (export list ⊆ AnimationEngine) is ALREADY held by `proof:engine-subpath-mirror`
   + `proof:published-surface` — **zero invariant loss** (satisfies OD-U1's fold-map clause).
3. **`proof:engine` managed-pause-doc → re-point to `group.ts`.** Promote the
   `group.ts:332–337` cross-link comment to the authoritative full statement of the
   managed-child lifecycle contract; the gate greps group source, not CLAUDE.md.
   This is the ONE genuinely load-bearing prose block that must survive verbatim-ish.
4. **`proof:published-surface` clause (e) → keep the disk-truth checks, drop the
   `fs.readFileSync(CLAUDE.md)` + all doc-assertion checks.** No-phantom-on-disk +
   demo-dirs-exist + no-top-level-scene-dir survive as pure fs checks; the frozen
   test/bench-count and doc-re-asserts-phantom checks die with the doc.
5. **`proof:drag2d-light-certified` clause (a) → delete the two CLAUDE reads.**
   `proof:published-surface` (i) already certifies `drag2D` ∈ LIGHT. README §`drag` names it.
6. **`proof:no-dead-dependency` → remove the 3 CLAUDE.md entries** from NARRATION_SURFACES; README + DESIGN remain.
7. **Scrub comment-only mentions** in `proof-no-flat-siblings`, `demo-roster`,
   `proof-board-live`, `proof-ci-coverage`, `proof-dogfood-hero` (no reads, cosmetic).
8. **README, same commit:** drop the dead `](src/animation/CLAUDE.md)` link
   (`:54`) + the `:46–47` CLAUDE pointers (else `proof:readme-paths-live` reds);
   absorb `bumpLayoutEpoch` (§Units) + a managed-child note (§AnimationGroup);
   tighten §124/§413 with the boundary prose. ≈2 paragraphs, not a rewrite.
9. **Inline is the primary home, not the README.** Per-zone barrel docstrings
   (11 barrels) carry the zone map; per-class docstrings carry the class inventory;
   consumer *contracts* (`bumpLayoutEpoch`, managed-child) go to BOTH the owning
   file docstring AND a deft README line. The README is already ~90% of target — it
   grows slightly, it is not the dumping ground for the 396-line inventory.
10. **The `demo/@`→`shared` ruling section is REVERSED by OD-U2 — DELETE, do not
    re-home.** And re-home the `instrument/` breakdown MINIMALLY: OD-U2 is actively
    restructuring that tree; let the new colocation self-document (OD-U16).
