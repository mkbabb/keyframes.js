# Critique — S.C Legacy purge with teeth (sc-legacy)

**Agent:** adversarial critique · **Band:** S.C (animate.ts cluster · orphan-module gate ·
no-silent-fallback enforcement · dead devDeps · stale narration · dependency posture)
**Inputs read:** SPEC-v1 §1–2 (C-3/C-13 rulings), §3 S.C1–C4, §4 fold rows 23–28/57/61–64, §6 (no
Q maps to S.C), §7 T6/T9; lanes a07, a09, a14, a20, a22, a24, a31; live repo probes.
**Probe evidence:** no prototype tested S.C directly (confirmed — Q1–Q12 map to A/B/D/E/F/H). I ran
my own read-only repo probes to ground the critique; they surface two facts SPEC-v1 has not absorbed.

**Verdict:** the *spine* of S.C is correct and evidence-grounded (animate deletion is owner-settled
and structurally justified; the no-silent-fallback widening is the right transposition, not a
band-aid; the dead-dep census is real). **But two of the band's four born-RED gates are
falsifiability-broken as written, and two rulings rest on stale premises that live probes overturn.**
This is precisely the r2 failure class Tranche S exists to end — a gate that *looks* born-RED but is
not runtime-honest. Six mandatory SPEC-v2 edits below; convergence 38%.

---

## 1. What is sound (bank it, do not re-litigate)

- **S.C1 animate.ts DELETE is correct and settled.** Live-verified: `src/animation/animate.ts` (213L),
  `test/animate.test.ts`, `test/animate-orchestration.test.ts` all present; `proof:animate-orchestration`
  wired into `proof:hygiene-chain` (package.json:236). Zero non-test importers (a09 F1). The excision
  was owner-ratified at R (a09:43, a14 F1); restoring re-litigates a closed ruling. C-3's DELETE is
  right. **The `proof:no-orphan-module` gate is genuinely runtime-honest in intent** (import-graph
  reachability, not source-shape) — this is the r2-F6 structural cure and *would* have caught the R
  residue. (Its impl has a hole — §2.)
- **S.C2 widen-not-rename is the correct transposition.** a07 F3 offered (a) rename the gate honestly
  or (b) widen Clause 1 to a src-wide deny-pattern with a machine-checked `KEEP:` allowlist. SPEC took
  (b) — the ownership-inversion move S's charter demands, reusing the KEEP-table-as-baseline precept
  a07 F1/T-note commends. Good. The §2K row-4 `as any` is live-confirmed (useTimingFunctionEditor.ts:196).
- **S.C3 dead-dep census is real.** All 8 shadcn devDeps live-confirmed present (v-calendar, vaul-vue,
  embla-carousel-vue, @unovis/{ts,vue}, vee-validate, @vee-validate/zod, zod). `ui/menubar/` = 16 files,
  one consumer (KeyframesEditor.vue); `cn` (demo/@/utils/utils.ts) is menubar-private — grep for
  non-menubar consumers returns **empty**, corroborating a24 F6. SPRING_SMOOTH `void`-hack dead (a20 F3).
- **S.C4 devDep posture is proportionate** (dep-cruiser 17→18 re-verify `[]`; fast-check 3→4 single
  consumer; @types/node floor; VJS_PARAM_BUG_MAX lifecycle) — a31 F4/F5.

---

## 2. BLOCKING — gate falsifiability holes (the r2 class this tranche must not repeat)

### 2.1 `proof:no-orphan-module` will RED the entire HEAVY lazy surface unless it resolves dynamic `import()` specifiers (S.C1)

The gate walks reachability "from a barrel, the loader, or the subpath." **The HEAVY surface is reached
ONLY via dynamic string imports inside `load-engine.ts`** — `import("./motion-path")`, `import("./svg/draw-svg")`,
`import("./engine")`, etc. (a09:20-21 confirms `motion-path-*`, `draw-svg-*`, `morph-svg-*`, `engine-*`
are dynamic chunks; p07 §2 lists them). A reachability walker that follows only *static* `import`
statements would classify **every lazy leaf** (motion-path.ts, draw-svg.ts, morph-svg.ts, presets/,
scroll/, ingest/, validate.ts) as an orphan and RED them — a false-positive avalanche, while animate.ts
(the one true orphan) is indistinguishable from them under a naive walk. The spec's word "the loader"
signals the right *intent*, but a born-RED gate authored without the explicit clause is the textbook
"gate-shaped-but-not-runtime" defect. **MANDATORY:** SPEC-v2 must state the walker resolves dynamic
`import()` string specifiers in `load-engine.ts` (and the `./engine/public` composition) as graph edges,
and pin the entry-root set explicitly ({`index.ts`, `load-engine.ts`, `engine/index.ts`, `engine/public.ts`}).

### 2.2 `proof:no-dead-dependency` scans the wrong root set — it will false-RED legitimate tooling deps (S.C3)

a31 impl-note 2 (the SPEC's source) defines the gate as *"greps package.json dependency names against
`demo/`+`src/` import specifiers and reds on an unreachable package."* That model is not runtime-honest:
**most devDeps are never import-specified in src/demo** — vite, @vitejs/plugin-vue, tailwindcss, postcss,
autoprefixer, prettier + its plugins, dependency-cruiser, vitest, api-extractor, @types/*, playwright —
they are referenced by config files, `package.json` scripts, and the proof scripts. A src/demo-only grep
would RED a dozen live tooling deps while its own target list (the 8 shadcn deps) happens to be safe.
Worse, my probe shows **`zod` and `@unovis/*` appear in the tree only inside *comment strings*** (the
`@unovis` hit is a stale comment at `scripts/proof-visual-lock.mjs:172`), so a naive substring grep that
does not distinguish import specifiers from prose can *also* false-GREEN a dead dep. **MANDATORY:** the
gate must (a) restrict matching to real import/require specifiers (not comment/prose substrings), and
(b) scan config + `scripts/` + plugin-reference sites in addition to src/demo, OR operate as an explicit
allowlist/denylist keyed off the 8 named shadcn packages (the honest, bounded form). As written it is
unfalsifiable in both directions.

### 2.3 The `animate(` doc/test grep clause false-REDs legitimate WAAPI prose and historical CHANGELOG (S.C1)

S.C1's gate demands "zero `animate(` doc/test references." a09:157-163 documents the legitimate survivors
that a bare grep hits: README's four `Element.animate()` WAAPI rows, and CHANGELOG's historical 4.x
`animate()` entries (correctly retained). **MANDATORY:** scope the grep to the excised *front-door symbol*
(an `import ... animate`, a call not preceded by `.`/`Element`), and explicitly allowlist CHANGELOG
historical rows + `Element.animate` WAAPI prose — else the gate reds honest text.

### 2.4 `proof:no-silent-fallback`'s new `as any` clause over-reaches its wave scope (S.C2)

S.C2's gate line "zero `as any` in demo composables" is broader than the wave's fix. My probe finds
**6 `as any` occurrences across ≥4 demo composables** (useEasingDemo.ts, useAnimationGroupPlayback.ts,
useTimingFunctionEditor.ts, useKeyframeOps.ts), but the wave only fixes the one §2K survivor
(useTimingFunctionEditor.ts:196). Either the wave silently inherits unpriced scope-creep (fix all 5
others) or the gate over-reaches and reds pre-existing legitimate casts. **MANDATORY:** either scope the
gate to the fixed site (+ a `KEEP:`-labelled allowlist for any surviving legitimate casts, mirroring the
Clause-1 idiom a07 recommends), or the wave must census + price the other 5 casts. As written it is a
scope-mismatch that will RED unexpectedly at impl.

---

## 3. BLOCKING — two rulings rest on stale premises the probes overturn

### 3.1 The menubar→glass-ui migration has no target and risks a *second* externally-gated wave (T12 violation) (S.C3)

SPEC: *"migrate KeyframesEditor's menubar to glass-ui menu, delete ui/menubar/ … born-RED HANDOFF to
glass-ui only if the consumed surface is missing."* **Live probe: glass-ui 4.0.1 exposes `./dropdown-menu`
and `./context-menu` — there is NO menubar surface.** The demo uses a *Menubar* (horizontal menu bar;
different affordance from a dropdown). So under the spec's own conditional, the consumed surface *is*
missing → the HANDOFF path fires → S.C3 acquires an **external glass-ui dependency**. T12 (§7) and C-12
assert *exactly one* externally-gated wave (S.E6). S.C3 would be a silent second one. a24 F6 already
supplies the zero-external-dependency transposition: *"relocate the island into the keyframes-editor
zone and delete the now-empty ui/ tree,"* OR replace with a *present* primitive (dropdown-menu).
**MANDATORY:** SPEC-v2 must (a) name the target — glass-ui `dropdown-menu` (present in 4.0.x, no external
gate) with the menubar→dropdown UX remap acknowledged, OR the a24-F6 relocate-in-place fallback — and
(b) forbid gating menubar removal on a possibly-missing surface, so S.C3 stays internally closable.
This also under-prices C3: a real component migration is folded under "dead code & stale narration."

### 3.2 The stale-comment gate bans a phrase S.E legitimately revives, and the corpus is incomplete (S.C3)

SPEC: the stale-comment clause *"greps zone identifiers that no longer exist."* The a22 evidence is six
comment sites narrating "**the scene-switcher**" for the surviving ChromeDock (a22 F1). But **Band S.E
REVIVES a scene switcher** (DM-24 REVIVED, C-7). A gate that bans the generic phrase "scene-switcher"
would collide with S.E's legitimate resurrection vocabulary — a cross-band incoherence. **MANDATORY:**
the gate must ban *specific dead component identifiers* (`SceneSwitcherCarousel`, `SegmentedTabs`,
`Animated.vue`, `ResponsiveSelect`, `AnimationMenuBar` [a24:41, never existed]), not the concept-phrase.
Separately, the corpus is **incomplete**: my probe found a stale-narration site the spec's list omits —
`scripts/proof-visual-lock.mjs:172` narrates a "home/cube unovis graph (live)" for a dep (@unovis) that
has zero real importers and is being *deleted* in this very wave. The corpus enumeration (a22's 6 sites +
soa.ts + barrels + baselines + taxonomy prose) must add the proof-script comment sites.

---

## 4. Open design question — the generalized changelog gate has no diff mechanism (S.C1)

C-3 / S.C1: *"generalize the changelog gate to fire on ANY removal from `docs/published-surface.md`
between adjacent releases."* The current gate is `proof:changelog-5` (package.json:51), scoped to the
5.0.0 migration. **The generalization is under-specified: `docs/published-surface.md` is a single
*current* file — there is no per-release snapshot to diff "between adjacent releases" against.** The gate
needs a defined source of the prior release's surface (git-tag checkout of the previous published tag?
an archived `published-surface-<version>.md` snapshot committed at each cut?). This is a genuine design
fork, not a mechanical edit. **BLOCKING:** SPEC-v2 must specify the snapshot/diff mechanism (e.g. the
gate checks out `dist-tags.latest`'s published-surface via git tag and diffs, RED on any removed row
without a matching `MIGRATION-<new>.md` entry). Until then the "generalized gate" is a promise, not an
oracle. (The MIGRATION-5.1.0.md backfill itself is fine — `docs/MIGRATION-5.0.0.md` exists as the pattern.)

---

## 5. Cost / DAG honesty

- All four S.C waves declare dep A0 only. Reasonable, **except** the `proof:no-orphan-module` root-set
  assumptions (§2.1) are perturbed by S.B4 (deletes `internal/index.ts` barrel, C-5) and S.B6 (rewrites
  the loader to `import("./engine/public")`, p07). A gate authored at C1 (pre-B) must be re-verified
  after B4/B6 land — a T7 "gate follows code" obligation the DAG does not surface. **Note in SPEC-v2:**
  C1's gate re-runs green on the post-B tree, or the gate is authored root-set-agnostic.
- **C3 is a mis-weighted bundle.** It folds a genuine component migration (menubar, §3.1) + a manifest
  dep sweep + a multi-file narration sweep + asset deletes + doc path remaps into one wave under the
  heading "Dead code, deps, and stale narration." The narration sweep is *largely ungated* — the only
  born-RED oracles are `proof:no-dead-dependency` and the dead-identifier grep; the docs/frontend-design
  path remaps (a30), design-idioms.css tombstone collapse, and soa.ts/group-barrel header fixes have no
  gate. That is acceptable as best-effort hygiene, but SPEC-v2 should say so explicitly (which items are
  gated vs. discretionary) rather than implying the one grep clause covers the corpus.
- No probe measured S.C cost; the estimates (C1 trivial, C2/C4 small, C3 substantial) are my read, not
  measured. C1's "trivial" is honest (3 deletes + 2 package.json line removals, a09 impl-1).

---

## 6. Missing / recorded-future

- **PRUNE from C3 into its own priced sub-item:** the menubar migration (§3.1) — it is a UX decision +
  16-file delete + one-consumer rewrite, not narration cleanup. Give it its own line and gate.
- **Not missing (credit):** the semver-discipline gap a14 F1 flags as HIGH is correctly *not* re-opened
  (owner ratified 5.1.0-minor); C-3's MIGRATION-5.1.0.md backfill + the generalized gate + S.Z3's
  version ruling discharge the *process* gap going forward. Defensible.
- **Not missing (credit):** a09 F2's proposed `proof:claudemd-surface` drift gate is absorbed by S.A5's
  `proof:claude-paths-live` (HEAVY list ⊆ AnimationEngine keys) — correctly homed outside S.C.

---

## 7. Scoring

Start 100.

| # | Deduction | Amount |
|---|-----------|--------|
| 1 | `proof:no-dead-dependency` scans wrong root set — unfalsifiable both directions (§2.2) | −15 |
| 2 | `proof:no-orphan-module` reds the whole lazy surface without a dynamic-`import()` clause (§2.1) | −10 |
| 3 | `animate(` grep clause false-reds Element.animate/CHANGELOG (§2.3) + `as any` gate over-reaches its wave (§2.4) — two gate-scope defects, counted once as a clause-hardening set | −10 |
| 4 | Open design Q: generalized changelog gate has no snapshot/diff mechanism (§4) | −10 |
| 5 | Menubar→glass-ui: no target, missing surface, T12 second-external-gate risk (§3.1) | −10 |
| 6 | Stale-comment gate bans a phrase S.E revives + corpus omits proof-script sites (§3.2) | −7 |

**Convergence: 38%.** The band's intent and spine are sound and evidence-grounded — but for a tranche
whose whole thesis is *honest born-RED gates*, two of four gates are falsifiability-broken as written,
one ruling rests on a glass-ui surface premise the live install contradicts, and the generalized gate is
a promise without a mechanism. All six edits are mechanical/spec-level (no design fatality), so the band
is implementable **after** the blocking edits land.
