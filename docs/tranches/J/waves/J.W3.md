# J.W3 — THE ESTATE INDUSTRIALIZED (Band 4 · GATE/CI · net-deletion · the lib the estate already half-owns)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-J (the net-deletion
  wave; T1 resolved-here, not inherited). The catastrophe I.W7 closed was the gate-ORACLE
  blindspot; the catastrophe THIS wave closes is the one I.W7 *left*: the "collapse the lattice"
  thesis was NOT executed — the gate count GREW 103→109, the proxy corpus survives relabeled, and
  **43 gates re-declare `serveDist` byte-identically while the lib that already exports it sits at
  7 importers** (`audit/gate-census.md` GC-1, `audit/precepts.md` §2-F2). The cure is not a new
  gate — it is the lib lifecycle the estate has half-built (`withPage`/`withBrowser` + the shared
  `serveDist`/MIME/chromium/`navToScene` exports), the migration of ~50 browser gates onto it
  under a **bite-preservation sampling rule** (a migration may not lobotomize a gate), and the
  binding **net-deletion rule** (`J.md` §invariant set, T1 resolved): *gate WORK may not grow the
  ESTATE — estate LoC + the dup counts + the scripts it deletes leave strictly lower, with
  consolidation as the mechanism.* (T1's "gate COUNT … equal-or-lower" binds the estate, not the
  `proof:`-prefix count-proxy a deletion could game: in THIS wave that prefix count rises +2 net by
  design — S3d registers three previously-uncounted raw-node CI gates net of the `repin-safe` KILL,
  a count-NEUTRAL relabel onto the registry — so the load-bearing measurement is the ESTATE, carved
  out in §Hard leg-3; NEW correctness gates other waves add are a separate accounted line.)
- **Scope (gates + CI + `scripts/lib/`; NO source/engine/demo):** the lib lifecycle + shared
  exports (S1); the ONE `IN_CI` helper + per-gate declared on-device posture + the third-tier
  taxonomy doc (S2, P6 made mechanical); `proof:all == CI` two-way (S3); the meta-gate derives its
  roster from `proof:correctness` membership (S4, T4); the `proof:demo-fonts` tier decision (S5);
  the KILLs + floor advances + stale-refs purge (S6); the two surviving-proxy re-labelings (S7,
  T3). **DAG-deps:** FOLLOWS **J.W0** — consumes its `navToScene(page, sceneId, expected)`
  primitive (the lib's per-expected-state nav export; `J.md` J.W0 row) and its green-Linux CI (the
  first observed end-to-end demo-smoke run is the platform on which the migration's
  bite-preservation re-witnesses run). Parallel-safe vs J.W1/J.W2/J.W6 (file-disjoint: this wave
  touches `scripts/`, `package.json`, `ci.yml` only). Its harness output is CONSUMED by **J.W4**
  (the axes battery builds on the industrialized harness).

## §Provenance (the folded findings + the precept-tension resolution)

- **`audit/gate-census.md` GC-1** — THE prime J transposition. `43×serveDist` (byte-identical),
  `51×MIME`, `54 of 57` browser gates resolve chromium INLINE; the lib (`scripts/lib/demo-driver.mjs`)
  already exports `serveDist`/`resolveChromium`/`openControlsPanel`/`subjectRect` (`:261,293,335,419`)
  but only **7** files import it. **The lib has DIVERGED:** the canonical `serveDist(distDir)` takes a
  param; the 43 inline copies do not — so the copies are stale relative to the lib (a NO-legacy
  violation *against the lib itself*). The lib lacks a `withPage()`/`withBrowser()` lifecycle export
  (open server, resolve chromium, newContext, run fn, finally close) — *re-handrolled everywhere*.
  Consolidation estimate: ~45 LoC × ~50 gates ≈ **2 kLoC removable** (`gate-census.md` §2a).
- **`audit/precepts.md` §2-F2 (P1/FOLD) + §3-T1 + PRE-1** — the un-executed collapse. `proof:live-session`
  was ADDED (965 lines, `git show --stat 1a708cf`) *on top of*, not as a replacement of, the ~34
  proxy browser gates. **Gate count GREW:** `proof:` keys `107236d`(I.W0)=103 → `1a708cf`(I.W7)=109
  → HEAD=109. The proxy gates the I FINAL indicted survive in hygiene (`proof:scene-machine-irrefragable`
  still round-trips localStorage ×21; `proof:visual-lock` self-baseline). **T1 RESOLVED in `J.md`:**
  the net-deletion rule — gate work may not grow the estate; the I "collapse" claim is reckoned
  honestly (I ADDED the session gate and relabeled the lattice; **J completes the collapse it
  claimed**). This wave is where the ESTATE (LoC, the dup counts, the script count) goes strictly DOWN
  — the load-bearing net-deletion cells; the `proof:`-prefix KEY count rises +2 net by design as S3d
  registers three previously-uncounted raw-node CI gates net of the `repin-safe` KILL (§Hard leg-3
  carve-out), which is a count-NEUTRAL relabel on the honest `raw-node ∪ proof:*` denominator, not a
  growth of the estate T1 binds.
- **`audit/wave-I.W7.md` W7-1/W7-2/W7-3/W7-5** — the four estate-residue findings I.W7 left:
  - **W7-1 (P0→here):** the keystone B2 deterministic dev-server leg SILENTLY note-skips under
    `KF_REQUIRE_BROWSER=1` if vite fails to come up (`proof-live-session.mjs:864-868` — `note()` +
    `return`, no `fail`/`skipOrFail`). A vacuous-pass hole in the exact clause that exists to close
    the H.W1 false-close. *(The B2 leg-content + the dev-server determinism are I.W1/J.W0-owned; what
    J.W3 owns is the regime rule that **a note-skip under `KF_REQUIRE_BROWSER=1` is a FAIL**, applied
    uniformly via the lib's lifecycle so no gate can vacuous-skip again.)*
  - **W7-2 (P1):** the named-benign exclusion is applied GLOBALLY (`isNamedBenign(text)` at the TOP
    of `chargeBudget`, `proof-live-session.mjs:142`, before any leg discrimination) not leg-scoped
    per S2a; `/source ?map/i` is broad enough to swallow a real dist error — an attenuated
    re-introduction of the `demo-console-clean` narrowed-regex sin. The `chargeBudget(kind,type,text,leg="")`
    signature ALREADY carries `leg` — the fix is to gate the benign check on `leg`, and the budget
    allowlist's promotion to the lib (S2) is the seam.
  - **W7-3 (P1):** `proof:demo-fonts` is load-rest (zero actuation primitives, `grep` → 0) seated in
    the correctness tier yet EXEMPTED from the meta-gate roster (S5 tier decision).
  - **W7-5 (P2):** `proof-browser.mjs` CANDIDATE_GATES still lists 3 retired gate names
    (`:32,44,55` — `demo-console-clean`, `no-orphan-specular`, `scene-icons`), silently filtered;
    legacy residue (S6 stale-refs purge).
- **`audit/ci-cd.md` CICD-3/4/5/6** — the CI-seam estate findings:
  - **CICD-3 (P1):** the `IN_CI = !!(process.env.CI || process.env.GITHUB_ACTIONS)` literal is
    triplicated verbatim (`proof-perf-frame-budget.mjs:61`, `proof-scene-transition-perf.mjs:79`,
    `proof-visual-lock.mjs:220`); no shared helper, no manifest of which gates are observe-only and
    why, no enforcement that a NEW device-dependent gate adopts the posture (S2). Three legitimate
    postures emerge that the taxonomy does not name: **observe-only**, **runner-calibrated** (the
    LoAF bench sizes the stress to the runner, threshold absolute), **hard** (`ci-cd.md` §5).
  - **CICD-4 (P1):** `proof:ci-coverage` is blind to raw `node scripts/*.mjs` gates — `demo-smoke.mjs`,
    `occlusion-gate.mjs`, `lighthouse-gate.mjs` (the inv-γ/inv-δ HEADLINE demo invariants) are
    invoked as `run: node scripts/X.mjs` not as `proof:*` keys, so `proof:ci-coverage` enumerates
    `proof:*` and never sees them (`ci-cd.md` §6.1).
  - **CICD-5 (P1):** the version-literal clause scans `ci.yml` ONLY and is caret-only — `deploy-pages.yml`
    `^3.4.0` unscanned; `ci.yml:199` glass-ui `~3.5.1` tilde-form (stale by 4 minors) evades the
    `\^\d` regex → clause 1 passes VACUOUSLY (`ci-cd.md` §6.2).
  - **CICD-6 (P2):** stale docs IN the pipeline — `ci.yml:204` "Gated by proof:dock-morph-settled"
    (RETIRED), `ci.yml:199` glass-ui `~3.5.1` (actual `~3.9.0`), `deploy-pages.yml:58` `^3.4.0`. The
    NO-stale-docs precept applies to the workflow files (`ci-cd.md` §6.3).
- **`audit/build-packaging-release.md` BP-4/5/6** — the floor + aggregator findings:
  - **BP-4 (P1):** 3 CI-wired gates absent from `proof:all` — `proof:dock-zorder` (`ci.yml:826`),
    `proof:scene-control-dfa` (`:322`), `proof:scene-transition-perf` (`:338`) in NO aggregator. A
    dev running `proof:all` gets a WEAKER verdict than CI (also `gate-census.md` GC-2). They are
    HYGIENE-tier (FSM correctness is owned by the correctness-tier gates; these lock shape + perf
    budget) — fold into `proof:hygiene`. *(scene-control-dfa's product-fix + per-trigger gate-fix
    is J.W0-owned; J.W3 owns only its taxonomy membership.)*
  - **BP-5 (P1):** `proof:deps-current` value.js floor `0.11.1` does NOT protect the B1 regression
    — a dev who pins value.js `0.11.1` (valid in the old range) passes the floor and re-introduces
    the `Parse error at offset 0: "......"` crash. Floor must track the correctness minimum: `0.11.2`
    (`proof-deps-current.mjs:59`).
  - **BP-6 (P1):** glass-ui floor `3.5.1` does NOT protect the B7 regression — a resolver downgrading
    to 3.7.x (valid in the old `~3.5.1` range) passes the floor and re-introduces the specular bloom.
    Floor must be `3.9.0` (`proof-deps-current.mjs:64`).
- **`audit/wave-I.WZ-postclose.md` §B/§C the IN_CI inventory + §D the unnamed third tier** —
  finding (c1): three different strategies for the same "device-dependent in CI" problem with a
  triplicated `IN_CI` literal (`WZ-postclose.md:124-132`); finding (c2): `proof:lighthouse-mobile`
  is the prior-art for the pattern but is fully CI-EXCLUDED (not observe-only) — J must decide ONE
  policy, not a mix decided ad-hoc (`WZ-postclose.md:149-153`). §E finding (d): the deploy-block
  gates orphaned from `proof:all` (the same finding as BP-4/GC-2). The "unnamed third tier" is the
  **correctness-tier-but-CI-observe-only** band (`proof:perf-frame-budget` self-downgrades in CI) —
  the taxonomy has no name for a gate that is correctness-class on-device and observational in CI
  (`WZ-postclose.md §C`, `wave-I.W7.md §10`). **This wave names it (S2).**

## §The state, verified (file:line / command + observed output, inv ε)

Every number below is a re-runnable command, observed on HEAD (`tranche-j-dev`, clean save
`docs/`):

| Fact | Command | Observed |
|---|---|---|
| `proof:` keys | `node -e "…Object.keys(p.scripts).filter(s=>s.startsWith('proof:')).length"` | **109** |
| correctness tier | `…match(/proof:[a-z-]+/g)` on `proof:correctness` | **10** |
| hygiene tier | same on `proof:hygiene` | **90** |
| proof scripts on disk | `ls scripts/proof-*.mjs \| wc -l` | **93** |
| estate LoC | `wc -l scripts/proof-*.mjs \| tail -1` | **35,227 total** |
| `serveDist` inline | `grep -rnE 'function serveDist\(\)' scripts/*.mjs \| wc -l` | **43** (gate-census GC-1; HEAD grep also matches a 44th `serveDist(distDir)` lib decl — the 43 are the byte-identical no-param copies) |
| `MIME` inline | `grep -rln 'const MIME' scripts/*.mjs \| wc -l` | **51** |
| lib importers | `grep -rln 'lib/demo-driver' scripts/*.mjs \| wc -l` | **7** |
| `navByHash` copies | `grep -rln 'navByHash' scripts/*.mjs \| wc -l` | **5** |
| lib lifecycle | `grep -nE 'withPage\|withBrowser' scripts/lib/demo-driver.mjs` | **ABSENT** |
| `navToScene` | `grep -rn 'navToScene' scripts/` | **ABSENT** (J.W0 authors it) |
| `IN_CI` literal | `grep -rn 'process.env.CI' scripts/proof-*.mjs` | **3 files** (`perf-frame-budget:61`, `scene-transition-perf:79`, `visual-lock:220`) |
| meta-gate roster | `grep -nA12 WAVE_HARD_GATES scripts/proof-gate-is-runtime.mjs` | **9 hardcoded** (`:84-94`), correctness has **10** — `proof:demo-fonts` omitted |
| demo-fonts actuation | `grep -cE "page\.click\|dispatchEvent\|page\.mouse\|keyboard\|PointerEvent\|hover" scripts/proof-demo-fonts.mjs` | **0** |
| repin-safe target | `proof-repin-safe.mjs:3` | `value.js ^0.10.0→^0.11.0` + `parse-that ^0.8.2→^0.9.0` (HISTORY; tree is `^0.11.2`/`^0.9.0`) |
| deps floors | `proof-deps-current.mjs:59-64` | value.js `0.11.1`, glass-ui `3.5.1` (both STALE) |
| proof-browser stale | `grep -nE 'demo-console-clean\|no-orphan-specular\|scene-icons' scripts/proof-browser.mjs` | `:32,44,55` |
| W7-1 dev-leg skip | `sed -n '864,868p' scripts/proof-live-session.mjs` | `note(…) … return` (no `fail`) |
| W7-2 global benign | `sed -n '141,142p' scripts/proof-live-session.mjs` | `chargeBudget(kind,type,text,leg="")` → `if(isNamedBenign(text)) return null` (leg ignored) |
| ci.yml stale comments | `grep -nE 'dock-morph-settled\|~3\.5\.1' .github/workflows/ci.yml` | `:204` (dead gate), `:199` (glass-ui `~3.5.1`) |
| deploy-pages stale | `deploy-pages.yml:58` | glass-ui `^3.4.0` (pre-H; actual `~3.9.0`) |

**The BEFORE numbers (the net-deletion ledger's left column — binding):**

> **109 proof keys · 93 proof scripts · 35,227 estate LoC · 43×serveDist · 51×MIME · 54×inline-chromium · lib at 7 importers.**

The wave's binding rule is that the AFTER column is **strictly lower** in every cell that
consolidation can touch (keys, scripts, LoC, the three dup counts, with importers strictly UP).

## §Goal

Make the estate's regime the lib it already half-owns, under net-deletion. Concretely: (1) land
the `withPage`/`withBrowser` lifecycle + the shared `serveDist`/`resolveChromium`/MIME/`navToScene`/
NAMED_BENIGN exports in `scripts/lib/`, and MIGRATE ~50 browser gates onto them so each gate shrinks
to its ACTUAL oracle (≈2 kLoC deleted), **with a bite-preservation sampling rule so the migration
cannot lobotomize a gate**; (2) replace the triplicated `IN_CI` literal with ONE helper carrying a
per-gate DECLARED on-device posture, and NAME the third taxonomy state (a correctness gate whose CI
run is observational) in a taxonomy doc — P6 made mechanical, no per-script `IN_CI` re-implementation;
(3) make `proof:all == the CI roster` provable BOTH ways (every CI-hard-gated step is in a named
aggregator; every aggregator member is CI-invoked); (4) derive the meta-gate roster FROM
`proof:correctness` membership so a new correctness gate can never escape the precept-enforcer
(T4); (5) tier-decide `proof:demo-fonts` by the actuation leg (the honest cheap fix); (6) KILL the
stale-by-construction gates, advance the deps floors to the correctness minimums, and purge every
stale ref (retired-gate names, phantom `no-route-storm` docstrings, the `ci.yml`/`deploy-pages.yml`
version comments) — repin-safe; (7) re-label the two surviving proxies honestly (T3). The
end-state is `J.md`'s T1 resolution made real: **the ESTATE goes strictly DOWN — the estate LoC, the
dup counts, the script count (the cells consolidation touches) — and "the simplest possible oracle"
the census demanded is finally the inventory, not just the authority.** (The `proof:`-prefix KEY count
rises +2 net by design — S3d brings three previously-uncounted raw-node CI gates into the registry net
of the `repin-safe` KILL — carved out in §Hard leg-3; T1 binds the estate, not a count-proxy a deletion
could game, and the load-bearing measurement is the LoC/dup/script consolidation.)

The gate-ORACLE / boundary-ORACLE posture of THIS wave is explicit (gate-ORACLE precept, `J.md`
§invariants): J.W3 is an **estate / boundary wave**, so its §Hard gate's correctness oracle is the
**named boundary oracle** — the **bite-preservation oracle** (a sampled migrated gate, RE-WITNESSED
born-RED on its recorded defect, still BITES through the lib) + the **strictly-down LoC/count
measurement** + the **two-way `proof:all == CI` equivalence**. The migration's actuating product is
the **gate corpus itself running through the lib** (the gates ARE the regime's running product). Every
source-shape clause (the LoC delta, the dup-count delta, the stale-ref greps, the floor literals) is a
**HYGIENE corroborator** and is LABELED as such — it may never substitute for a red bite-preservation
clause: if a sampled migrated gate fails to re-bite born-RED, the wave reds, regardless of the LoC
delta.

## §Scope

### S1 — the lib lifecycle + the shared exports + the migration protocol (GC-1, F2, PRE-1; net-deletion)

**Locus:** `scripts/lib/demo-driver.mjs` (the existing lib, extended) + ~50 browser gate scripts
(migrated) + `scripts/proof-live-session.mjs` (NAMED_BENIGN promoted out). **NO source/demo edit.**

**S1a — the lifecycle exports.** The lib gains:

```
export async function withBrowser(fn)           // resolveChromium → launch → try fn(browser) finally close
export async function withPage(opts, fn)         // withBrowser → serveDist(opts.distDir) on port 0 →
                                                 //   newContext(opts.context) → newPage → try fn(page,{url,server})
                                                 //   finally close context + server
export async function navToScene(page, sceneId, expected)   // CONSUMED from J.W0 — re-exported here as the
                                                 //   single nav primitive (per-EXPECTED-state wait predicate,
                                                 //   ceiling-timeout, load-independent; J.md J.W0 row)
```

`withPage` is the single open-server → resolve-chromium → newContext → run → finally-close lifecycle
the census found re-handrolled in ~50 gates (`gate-census.md` §2a). `serveDist(distDir)`,
`resolveChromium()`, `openControlsPanel(page)`, `subjectRect(page,sel)` ALREADY exist in the lib —
they are KEPT; the 43 inline `serveDist` copies + 51 `MIME` copies + 54 inline chromium-resolves are
DELETED at migration. `navToScene` is the J.W0 primitive: the 5 copy-pasted `navByHash` helpers
(`grep` → 5) are DELETED, every nav routes through `navToScene`. **WHY:** one harness authority. The
lib's `serveDist(distDir)` already DIVERGED from the 43 no-param copies (GC-1) — the copies are
legacy against the lib; per the NO-legacy-beside-its-replacement precept (`J.md` §spine) they die in
the SAME motion the lifecycle lands.

**S1b — NAMED_BENIGN promoted to the lib (GC-7, W7-2).** The structured error-budget allowlist
(`NAMED_BENIGN` array + `isNamedBenign`, `proof-live-session.mjs:121-131`) is the single-source budget
definition (`gate-census.md` GC-7: only file with `NAMED_BENIGN`) but lives PRIVATE inside the
gate-of-gates. Move it to `scripts/lib/` (e.g. `scripts/lib/console-budget.mjs` or the demo-driver
barrel) as `NAMED_BENIGN` + `chargeBudget(kind,type,text,leg)` so any future console-budget gate
consumes the SINGLE authority, not a re-derived copy. **This carries the W7-2 leg-scoping fix:** the
exported `chargeBudget` gates `isNamedBenign` on `leg` — the dep-optimizer/source-map exclusions
apply ONLY when `leg === DEV_SERVER` (the `:5174` leg where the noise appears); on every dist leg the
exclusion is INERT by construction, not by assumption. `/source ?map/i` is tightened to the specific
dep-optimizer fingerprint. The Monaco content-visibility exclusion stays (already correctly scoped by
`monaco` in the regex). **WHY:** W7-2's "inert on dist because dist never emits it" is an *assumption*
the global application does not enforce; leg-scoping makes it a *guarantee*. This is the inversion of
the `demo-console-clean` narrowed-regex sin, finished.

**S1c — the migration protocol (mechanical, per-gate, with the bite-preservation sampling rule).**
The migration is MECHANICAL and per-gate — one gate at a time, each commit a single gate's
inline-boilerplate → lib-call swap, NO oracle change. For each migrated gate:

1. delete the inline `serveDist`/`MIME`/chromium-resolve/lifecycle; route through `withPage` +
   `serveDist(distDir)` + `navToScene`;
2. the gate's ASSERTIONS (its actual oracle) are UNTOUCHED — the diff is boilerplate-only;
3. `node --check scripts/proof-X.mjs` clean;
4. the gate re-runs GREEN on the post-migration tree (no behavior change).

**The bite-preservation sampling rule (the §Hard gate's correctness leg — binding):** a migration may
NOT lobotomize a gate. The SAMPLE that must be re-witnessed born-RED on its recorded defect, through
the migrated lib path:

- **EVERY correctness-tier gate that gets migrated** (the full actuating set — engine-no-throw-on-play,
  fsm-suspend-resume-live, easing-editor-live, amiga-subject-is-pivot, drag-gesture, icon-paint-live,
  specular-absent-at-rest, live-session) is re-witnessed born-RED on its recorded breakage (B1/B2/B4/
  B6/B3/B9/B7 + the live-session battery) through the lib — the migration may not change which defect
  the gate catches;
- **PLUS a NAMED RANDOM SAMPLE of the hygiene-tier migrated gates** — the IMPL draws a reproducible
  random sample (seeded `n = max(8, ⌈0.20 × migrated-hygiene-count⌉)`, the seed RECORDED in the wave
  note so the sample is auditable) and re-witnesses each on a recorded or freshly-planted defect: the
  gate must still RED through the lib. The sample list + each gate's born-RED witness is recorded in
  the wave note.

**No-workaround prohibition (S1):** the migration may NOT weaken a gate's oracle to make it pass
through the lib (no widened regex, no dropped assertion, no `force` added to dodge a hit-test). If a
gate cannot route through the lib without an oracle change, that is a J.W0/J.W1/J.W2 product or
primitive defect — it is HANDED back to the owning wave, never papered at the migration. The
boilerplate-only constraint is the falsifiable witness: the per-gate diff must be reviewable as
"deleted N lines of harness, added 1 lib call, assertions byte-identical."

**What dies in the same motion:** the 43 `serveDist` copies, the 51 `MIME` copies, the 54 inline
chromium-resolves, the 5 `navByHash` copies, the private `NAMED_BENIGN` in live-session.

### S2 — the ONE `IN_CI` helper + the declared on-device posture + the third-tier taxonomy (CICD-3, WZ §B/§C/§D; P6 mechanical)

**Locus:** `scripts/lib/` (new `ci-env.mjs` or the demo-driver barrel) + `proof-perf-frame-budget.mjs`,
`proof-scene-transition-perf.mjs`, `proof-visual-lock.mjs` (re-routed) + a NEW taxonomy doc
(`docs/tranches/J/gate-taxonomy.md` or the equivalent named manifest) + `package.json` hygiene clause.

**S2a — the single helper.** The triplicated `IN_CI = !!(process.env.CI || process.env.GITHUB_ACTIONS)`
literal (`perf-frame-budget:61`, `scene-transition-perf:79`, `visual-lock:220`) is replaced by ONE
export:

```
export const IN_CI = !!(process.env.CI || process.env.GITHUB_ACTIONS);
export function observeOnlyInCI(label, reason) { … }   // records the measurement, exits 0 in CI, hard local
```

All three device-DEPENDENT gates route through it. **WHY (P6, `J.md` §invariants):** "the posture is
DECLARED per-gate through ONE shared helper (no per-script `IN_CI` re-implementation)." Three literals
= three drift points; one helper = one authority + the enforcement seam.

**S2b — the per-gate declared on-device posture + the third state NAMED.** The taxonomy doc names the
three legitimate device-dependence postures the census surfaced (`ci-cd.md` §5, `WZ-postclose.md §C`):

| Posture | Meaning | Gates today | Mechanism |
|---|---|---|---|
| **hard** | device-INDEPENDENT — red on any failure, CI and local | the ~50 DOM/geometry/CSS gates + the 8 actuating correctness gates | bite normally |
| **observe-only** | device-DEPENDENT measurement (throttled frame ms, cross-OS pixel) — recorded, never red in CI; hard on-device | `perf-frame-budget`, `scene-transition-perf`, `visual-lock` | `observeOnlyInCI(label,reason)` |
| **runner-calibrated** | absolute threshold KEPT, stress SIZE sized to the runner | the LoAF bench (`KF_LOAF_COUNT=48`, `ci.yml:1080-1095`) | calibrate size, threshold unchanged |

**The third state explicitly NAMED (P6, the unnamed-tier from `WZ-postclose.md §C`):** an **on-device**
annotation on a CORRECTNESS gate means its CI run is OBSERVATIONAL — "proof:correctness GREEN in CI"
must NEVER be over-read as the felt timing/exact-pixel budget holding in CI; the felt budget hard-gates
ON-DEVICE only. `proof:perf-frame-budget` is the canonical instance (correctness-class on-device,
observe-only in CI, `wave-I.W7.md §10`, `WZ-postclose.md §C`). The taxonomy doc states this in prose so
no future close over-reads a green CI correctness run as the felt budget. **The policy decision the
census demanded (`WZ-postclose.md` c2):** device-dependent gates are **observe-only** (the helper), NOT
CI-excluded — `proof:lighthouse-mobile`'s full-exclusion is the legacy ad-hoc; J normalizes onto
observe-only. (`proof:lighthouse-mobile`'s tier entry is J.W4-owned per `J.md` J.W4 row — J.W3 only
provides the helper + the posture it adopts.)

**S2c — the hygiene clause that enforces the posture (P6 mechanical).** A hygiene-tier clause asserts:
every script that reads `process.env.CI`/`GITHUB_ACTIONS` imports the lib `IN_CI`/`observeOnlyInCI`
(no re-implemented literal), AND every observe-only gate is listed in the taxonomy doc's posture table
with a `reason`. **WHY:** "P6 made mechanical" — the convention becomes a charter invariant a gate
polices, so a NEW device-dependent gate cannot ship a re-implemented `IN_CI` or a flaky-hard posture
unnoticed. (This is labeled HYGIENE — it reads source shape; it is a corroborator, not the correctness
leg.)

**No-workaround prohibition (S2):** the helper is NOT an escape hatch — a device-INDEPENDENT gate may
NEVER route through `observeOnlyInCI` to paper a flake (the `scene-control-dfa` lesson, `J.md` §spine:
"NOT an `IN_CI` escape on a correctness gate"). The taxonomy doc states: a device-INDEPENDENT gate that
flakes is a determinism bug in the gate or a real product bug — fixed (J.W0), never silenced.

### S3 — `proof:all == CI` proven BOTH ways (GC-2, BP-4, F4, F5, WZ §E; the two-way coverage clause)

**Locus:** `package.json` (`proof:hygiene` gains the 3 orphans) + `scripts/proof-ci-coverage.mjs` (the
converse clause + the raw-node-script + version-literal blind spots).

**S3a — wire the 3 CI-only gates into a named tier.** `proof:dock-zorder` (`ci.yml:826`),
`proof:scene-control-dfa` (`:322`), `proof:scene-transition-perf` (`:338`) run in CI but are in NO
aggregator (GC-2, BP-4, `precepts.md` F5, `WZ-postclose.md §E`) — a dev running `proof:all` gets a
WEAKER verdict than CI. They are HYGIENE-tier (FSM correctness is owned by the correctness-tier gates;
these lock control-set shape + transition-perf budget) → add to `proof:hygiene`. **Exception:**
`proof:scene-transition-perf` is observe-only/device-dependent (S2) — it enters the hygiene tier with
its observe-only posture declared. After this, the 3 CI-only orphans are 0.

**S3b — the two-way coverage clause.** `proof:ci-coverage` today enforces only `proof:* ⟹ CI-invoked`
(forward); it does NOT enforce `CI-hard-gated ⟹ in-an-aggregator` (converse) — which is exactly why
the 3 orphans + the `demo-smoke` raw-node gates were invisible (`gate-census.md` §1,
`WZ-postclose.md §E`). Add the **converse clause**: every gate hard-gated in `ci.yml`'s `gates` +
`demo-smoke` jobs is reachable from `proof:correctness ∪ proof:hygiene` (= `proof:all`), with the
named EXCLUDED set (the documented local-meta/observe exceptions) as the only permitted gap. After
this, `proof:all == the CI roster` is a machine fact, both directions.

**S3c — the 3 true orphans tiered (the EXCLUDED-set audit).** The `EXCLUDED` set in
`proof-ci-coverage.mjs:100-114` holds 3 true orphans:
- `proof:browser` — local dev meta-target that re-invokes CI-wired gates (`proof-browser.mjs:1-18`).
  **KEEP excluded** (legit; documented). *(S6 prunes its stale CANDIDATE_GATES.)*
- `proof:lighthouse-mobile` — RECORDED browser-gated/runner-calibrated. **Tier decision deferred to
  J.W4** (`J.md` J.W4 row: "enters a tier under its P6 posture"); J.W3 records it as the one orphan
  J.W4 owns, and removes it from EXCLUDED only when J.W4 tiers it.
- `proof:repin-safe` — **KILLED in S6** (stale-by-construction); its EXCLUDED entry is removed in the
  same motion (the exclusion was masking a dead gate, `gate-census.md` GC-5).

**S3d — the raw-node-script + version-literal blind spots (CICD-4, CICD-5).** Two `proof:ci-coverage`
blind spots closed:
- **CICD-4:** `demo-smoke.mjs`, `occlusion-gate.mjs`, `lighthouse-gate.mjs` are invoked `run: node
  scripts/X.mjs` (`ci.yml:216,218,471`), not as `proof:*` keys — the inv-γ/inv-δ HEADLINE invariants
  are coverage-blind. **Resolution:** wrap them as `proof:demo-smoke`/`proof:occlusion`/`proof:lighthouse-a11y`
  package keys (so the converse clause S3b and the forward clause both see them) — the KISS, single-form
  resolution (one invocation shape: `npm run proof:*`). *(Counting honesty, both denominators: this
  RELABELS 3 EXISTING raw-node CI steps into 3 `proof:*` keys — it adds NO new script and NO new CI gate
  to the corpus. On the honest `raw-node ∪ proof:*` CI-invocation denominator it is **count-NEUTRAL**
  (the three steps were already gating CI, now under a `proof:` key). On the `proof:`-PREFIX metric alone
  it is **+3** — the three keys are absent from `package.json` today (verified: `proof:demo-smoke`/
  `proof:occlusion`/`proof:lighthouse-a11y` all ABSENT, invoked as raw `node scripts/X.mjs` at
  `ci.yml:216,218,471`). That +3 is exactly why the §Hard leg-3 ledger CARVES the `proof:`-prefix count
  out of the strictly-down rule: the prefix count rises by design as previously-uncounted CI gates enter
  the registry; net-deletion is load-bearing on the ESTATE, not on this count-proxy.)*
- **CICD-5:** the version-literal clause (`proof-ci-coverage.mjs:155`) scans `ci.yml` ONLY and is
  caret-only (`\^\d`) — `deploy-pages.yml` `^3.4.0` unscanned; `ci.yml:199` glass-ui `~3.5.1`
  tilde-form evades, clause passes VACUOUSLY. **Resolution:** widen to scan ALL THREE workflows
  (`ci.yml`, `deploy-pages.yml`, `release.yml`) and BOTH `^`/`~` literals; the stale comments S6
  removes red the de-vacuoused clause until they are gone (born-RED tie-in).

### S4 — the meta-gate derives its roster from membership (GC-3, T4)

**Locus:** `scripts/proof-gate-is-runtime.mjs:84-94`.

`WAVE_HARD_GATES` is a HARDCODED literal of 9 (`:84-94`); the actual `proof:correctness` tier has 10 —
`proof:demo-fonts` is omitted (GC-3, W7-3). A correctness gate can be added without the meta-gate
noticing — undermining the meta-gate's own "mechanically prior, not authorially prior" thesis
(`gate-census.md` §3). **Resolution (T4, `J.md` §invariants):** derive the audited roster FROM
`proof:correctness` membership (parse `package.json`'s `proof:correctness` chain), not from a hardcoded
list. After this:
- the meta-gate audits ALL correctness gates (10, not 9);
- `proof:demo-fonts` (load-rest, no actuation, `grep` → 0) REDS the meta-gate — which FORCES the S5
  tier decision (the meta-gate now bites the very gate it used to exempt);
- a NEW correctness gate can never escape the precept-enforcer again (T4: "a new correctness gate can
  never escape the precept again").

**No-workaround prohibition (S4):** the fix is to derive the roster, NOT to add `demo-fonts` back to a
hand-edited exemption — the whole point is that the roster is no longer hand-authored. The meta-gate
remains HYGIENE-tier by the taxonomy (it reads gate SOURCE SHAPE, `gate-census.md` §3; `wave-I.W7.md`
W7-4) — recorded so the wave does not exempt its own enforcer from its own taxonomy.

### S5 — the `proof:demo-fonts` tier decision (GC-4, W7-3; present both options, recommend the actuation leg)

**Locus:** `proof-demo-fonts.mjs` + `package.json` (`proof:correctness` membership).

`proof:demo-fonts` is a LOAD-REST oracle (`goto`+`waitForTimeout`+read computed font, NO actuation —
`grep` → 0) seated in the CORRECTNESS tier (GC-4, W7-3). The oracle-precept demands correctness gates
ACTUATE (PLAY+SWITCH+DRAG, budget 0). Two options, both presented (`gate-census.md` GC-4,
`wave-I.W7.md §5`):

| Option | The move | Cost | Honesty |
|---|---|---|---|
| **A — actuate (recommended)** | Add a scene-SWITCH actuation leg: `goto #/cube` → read computed `font-family` → `navToScene(page,'spring',…)` (SWITCH) → re-read → assert the resolved face SURVIVES the switch (the font is the same loaded family after a route change). It now actuates (SWITCH) and stays in correctness. | one `navToScene` + one re-read | the cheap honest fix — the gate joins the actuating set, the meta-gate (S4) greens on it |
| **B — demote to hygiene** | Move `proof:demo-fonts` to `proof:hygiene`; the FONT correctness is owned by `proof:live-session`'s body-font leg (`proof-live-session.mjs:763-776`, the actuating clause). | a one-line aggregator move | honest but loses the standalone font-survives-switch assertion |

**Recommendation: Option A (the actuation leg).** **The decision rule (named):** *a gate stays in the
correctness tier IFF it actuates the running product per the oracle-precept; a load-rest property whose
correctness is ALSO covered by an actuating gate may be demoted, but if the cheap actuation leg exists
(it does — `navToScene` is the J.W0 primitive this wave already consumes), ADD it rather than demote,
so the standalone assertion survives AND the tier stays honest.* Option A actuates via the SAME
`navToScene` primitive the migration (S1) already lands — zero new harness — so it is the strictly
cheaper honest fix. After A, the correctness tier is exactly the 10-member actuating set, the meta-gate
(S4) audits all 10 and greens on demo-fonts, and W7-3's "non-actuating gate in the correctness tier"
is closed without losing coverage.

### S6 — the KILLs + the floor advances + the stale-refs purge (GC-5/6, BP-5/6/7/8, CICD-6, W7-1, W7-5, W7-2, GH-3; repin-safe; net-deletion)

**Locus:** `package.json` + `scripts/proof-repin-safe.mjs` (KILL) + `scripts/proof-deps-current.mjs`
(floors) + `ci.yml`/`deploy-pages.yml` (comments) + `proof-live-session.mjs` (W7-1) +
`proof-browser.mjs` (W7-5) + ~8 docstrings (phantom refs).

**S6a — KILL `proof:repin-safe` (GC-5; net-deletion).** A one-shot G.W1 pre-stage gate targeting
value.js `^0.10.0→^0.11.0` / parse-that `^0.8.2→^0.9.0` (`proof-repin-safe.mjs:3`); the tree is
`^0.11.2`/`^0.9.0` — the re-pin it gated is HISTORY. Stale-by-construction (`J.md` §spine: "`proof:repin-safe`
(stale-by-construction) is KILLED, not kept"). DELETE the script + the `package.json` key + its
EXCLUDED entry in `proof-ci-coverage.mjs` (S3c) in ONE motion. This is a NET-DELETION (one script, one
key gone). **No-workaround:** it is KILLED, not demoted or RECORDED-as-template — P-invariant-28, no
perpetual punt.

**S6b — the deps floors advance (BP-5, BP-6; repin-safe).** `proof-deps-current.mjs:59-64`:
- value.js `0.11.1` → **`0.11.2`** — the floor that protects the B1/B5 empty-input regression (BP-5:
  a dev pinning `0.11.1` passes the stale floor and re-introduces the `Parse error at offset 0: "......"`
  crash);
- glass-ui `3.5.1` → **`3.9.0`** — the floor that protects the B7 specular regression (BP-6: a resolver
  downgrading to 3.7.x passes the stale floor and re-introduces the bloom).
Both advances are to the CORRECTNESS minimums the I bugfixes require — the floor tracks the contract,
not the history. **Repin-safe:** the floors match the tree pins (`^0.11.2`, `~3.9.0`), so the advance
is consistent with the live lockfile, not a new constraint.

**S6c — the stale-refs purge (GC-6, CICD-6, W7-5, BP-7/8, GH-3; NO-legacy in the pipeline).**
- **`ci.yml` retired-gate comments:** `:204` "Gated by proof:dock-morph-settled" (RETIRED) + the
  retirement-narration comments `:230-234,293,345,485,543,576,913` that NAME the 5 deleted H proxy
  gates as if live — the gate FILES are correctly gone (GC-9) but the prose lies. PURGE the dead-gate
  names; keep only the present-tense "RETIRED (I.W7 S5)" disposition where it documents an absence (not
  a live gating).
- **`ci.yml`/`deploy-pages.yml` version comments:** `ci.yml:199` glass-ui `~3.5.1` (actual `~3.9.0`),
  `deploy-pages.yml:58` `^3.4.0` (pre-H) — refresh to `~3.9.0`. The S3d-widened version clause REDS on
  these until refreshed (born-RED tie-in).
- **`proof-browser.mjs` CANDIDATE_GATES (W7-5):** `:32,44,55` list 3 retired names (`demo-console-clean`,
  `no-orphan-specular`, `scene-icons`), silently filtered by `g in pkgScripts` (`:70`). DELETE them
  (dead code; NO-legacy).
- **the phantom `no-route-storm` docstrings:** the gate was NEVER authored (`rc-gate-blindspot §2.1`),
  counted toward H's green tally; it survives as docstring cross-refs in ~8 scripts + console-log labels
  in `proof-scene-machine-irrefragable.mjs:551,557` (`wave-I.W7.md §2`). PURGE the references (narrative
  only, not gate refs — but stale docs are legacy).

**S6d — the W7-1 vacuous-skip rule (P0→here as a regime rule).** Under `KF_REQUIRE_BROWSER=1` a
`note()`-skip is a FAIL: the lib's `withPage`/`withBrowser` (S1) carry the rule that a harness-start
failure (vite/chromium did not come up) under `KF_REQUIRE_BROWSER=1` calls `fail`/`skipOrFail`, NEVER
`note()`+`return` (`proof-live-session.mjs:864-868`). The honest born-RED witness must not be
droppable. **This is the regime half of W7-1** — the B2-leg content/determinism is J.W0/J.W1-owned;
J.W3 owns the LIB-LEVEL rule that no migrated gate can vacuous-skip under `KF_REQUIRE_BROWSER=1`,
applied uniformly through the lifecycle. **No-workaround (`J.md` §spine):** this is the exact "a
playwright-absent skip becomes a hard fail" rigor I.W7 installed — J.W3 makes it un-bypassable at the
lib seam, not a per-script choice.

### S7 — the two surviving proxies re-labeled honestly (T3, F2, precepts §3-T3)

**Locus:** the script headers + `ci.yml` (the in-line tier annotation, mirroring `ci.yml:287` for
visual-lock).

T3 (`J.md` §invariants, `precepts.md` §3-T3): hygiene gates are legitimate STRICTLY as corroboration;
the two named survivors are re-scoped honestly:
- **`proof:scene-machine-irrefragable`** — re-labeled a **reducer-algebra unit oracle**: its
  localStorage round-trip (×21, `precepts.md` F2) polices the PURE REDUCER's serialization, which IS
  its competence (B2 correctness is `proof:fsm-suspend-resume-live`, the actuating gate). The header
  states: NON-AUTHORITATIVE for FSM runtime correctness; it is a reducer-serialization hygiene check.
- **`proof:visual-lock`** — re-labeled an **appearance-drift tripwire** whose self-baseline is
  acknowledged in its own header (already partially annotated `ci.yml:287` "correctness authority
  STRIPPED"; make it uniform). The pixel-truth oracle lives in `proof:live-session`'s DOM asserts; the
  baseline is RE-CAPTURED at J.W7a (the appearance-grammar half's close motion — J.W7b changes
  no kf appearance and re-captures nothing, `J.md` J.W7a row / §invariants T3).

**WHY (T3):** the precept forbids these COUNTING toward correctness (honored — neither is cited by any
chronic, both are hygiene); it does not forbid them EXISTING and LOOKING authoritative (`precepts.md`
§3-T3). A future lazy close could point at a green `proof:scene-machine-irrefragable` as evidence the
FSM "works" — re-committing H's sin. The in-script re-label closes that. **This is a re-labeling, NOT a
deletion** — the gates police DISTINCT, real source/reducer invariants (`gate-census.md` §2b: "the
surviving hygiene gates police distinct source/config invariants; keep stands"); deleting them loses
real value (the T1 net-deletion is achieved by the dup-consolidation S1, not by gutting useful hygiene
gates).

## §Hard gate (the net-deletion oracle — falsifiable · re-runnable · MUST bite · BOUNDARY-ORACLE)

This is an ESTATE wave; per the gate-ORACLE precept's **boundary-ORACLE extension** (`J.md`
§invariants), the correctness oracle is the named boundary oracle — here, the **bite-preservation
oracle + the equivalence clause + the strictly-down counts**. The actuating product is the gate corpus
running through the lib.

**The §Hard gate has three load-bearing legs (all must bite):**

1. **BITE-PRESERVATION (the correctness leg).** A SAMPLED set of migrated gates is RE-WITNESSED
   born-RED on its recorded defect, THROUGH the migrated lib path — the migration may not lobotomize a
   gate. The sample (S1c): **every migrated correctness-tier gate** (re-bites B1/B2/B4/B6/B3/B9/B7 +
   the live-session battery through `withPage`/`navToScene`) **PLUS the seeded random hygiene sample**
   (seed RECORDED). **born-RED witness plan:** for each sampled gate, git-stash the I/J fix (or plant
   the recorded defect), run the MIGRATED gate, observe it RED with the same named-clause failure it
   caught pre-migration; restore, observe GREEN. A sampled gate that fails to re-bite REDS the wave —
   the migration introduced a lobotomy. **This is the leg the wave's green hangs on**; the LoC delta
   and the dup-count delta are HYGIENE corroborators (labeled) and may never substitute for it.

   **The per-gate ORACLE-INVARIANCE clause (MACHINE — covers EVERY migrated gate, not just the sample).**
   The seeded sample re-witnesses a SUBSET born-RED; a lobotomized gate OUTSIDE the 20% hygiene sample
   would pass that sample AND make leg-3's LoC go down MORE (a double-green on a real defect). To close
   that gap, the §Hard gate carries a per-gate diff assertion that runs on **every** migrated gate: the
   gate's ORACLE-SET — its assertion AST / `assert`+`fail`+`expect` calls and their oracle-substring
   literals (the named-clause strings, the selectors, the thresholds, the budget constants) — is
   **byte-identical pre/post migration**; the ONLY permitted line-delta is the harness band (the deleted
   inline `serveDist`/`MIME`/chromium-resolve/lifecycle and the added `import {...} from './lib/...'` +
   the `withPage(...)` call). The IMPL extracts the oracle-set from each gate at its pre-migration commit
   and at HEAD and asserts set-equality; a gate whose oracle-set is NOT byte-identical (an assertion
   dropped, a threshold loosened, a selector widened) REDS the wave — even if it is outside the random
   sample and even if it still passes. **This makes leg-3's strictly-down LoC un-gameable by deletion:**
   LoC may fall ONLY by the harness band, never by an oracle drop, so "LoC went down" can no longer be
   achieved by silently dropping an assertion outside the sample. The boilerplate-only constraint of S1c
   (`§S1c`, the no-workaround prohibition) is thus not merely a process constraint — it is a GATED
   machine assertion, the real guard the seeded sample corroborates rather than the sole defense. *(This
   is the structural twin of the bite-witness: the sample proves a gate STILL BITES; the oracle-invariance
   clause proves NO gate's bite was removed. Together they make "no oracle was lost" a machine fact across
   the full migrated set, not a sampled inference.)*

2. **THE EQUIVALENCE CLAUSE (`proof:all == CI`, two-way).** `proof:ci-coverage` (S3) asserts BOTH
   directions: every `proof:*` aggregator member is CI-invoked (forward, extant) AND every CI-hard-gated
   step is reachable from `proof:all` (converse, NEW), modulo the named EXCLUDED set. **BITE:** reds
   TODAY — the 3 CI-only orphans (`dock-zorder`, `scene-control-dfa`, `scene-transition-perf`) + the 3
   raw-node steps (`demo-smoke`/`occlusion`/`lighthouse-gate`) are not reachable from `proof:all`
   (`gate-census.md` GC-2, `WZ-postclose.md §E`); greens only when S3a wires the orphans + S3d wraps the
   raw-node steps. The version-literal clause (S3d) reds on the stale `~3.5.1`/`^3.4.0` comments until
   S6c removes them.

3. **THE STRICTLY-DOWN COUNTS (the net-deletion measurement, recorded).** The wave note records the
   before/after ledger. The net-deletion rule (`J.md` §invariants T1) is load-bearing on the
   **ESTATE-CONSOLIDATION cells** — the cells S1's dup-collapse + S6a's KILL actually shrink (LoC, the
   three dup counts, the scripts S6 deletes). The proof-KEY count is **NOT** one of those cells and is
   carved out explicitly: it does not go strictly down by the `proof:`-prefix metric, BY DESIGN, because
   S3d brings three previously-UNCOUNTED CI gates into the registry. The honest arithmetic, both
   denominators stated:

   | Metric | BEFORE (verified, §The state) | AFTER (binding direction) | Load-bearing? |
   |---|---|---|---|
   | `proof:`-prefix keys | 109 | **+2 net by design** (−1 `repin-safe` KILL S6a; **+3** S3d wrap of demo-smoke/occlusion/lighthouse-a11y — three raw-node CI gates entering the registry) | NO — see carve-out below |
   | CI gate invocations (raw-node ∪ `proof:*`) | 112 (109 keys + 3 raw-node steps `ci.yml:216,218,471`) | **111** (−1 `repin-safe`; the 3 raw-node steps RELABEL into `proof:*`, count-neutral) — strictly down | corroborator |
   | proof scripts on disk | 93 | **< 93** (−`repin-safe.mjs`; S3d wraps EXISTING `demo-smoke.mjs`/`occlusion-gate.mjs`/`lighthouse-gate.mjs` — relabel, no new script) — strictly down | **YES** |
   | estate LoC | 35,227 | **strictly < 35,227** (≈ −2 kLoC from S1 consolidation) | **YES — the prime measurement** |
   | `serveDist` inline | 43 | **0** (all migrated to lib) | **YES** |
   | `MIME` inline | 51 | **0** | **YES** |
   | inline chromium | 54 | **0** | **YES** |
   | lib importers | 7 | **strictly > 7** (≈50) | **YES** |

   **The proof-KEY carve-out (the net-deletion rule's honest denominator).** The §The-state BEFORE
   number is the `proof:`-prefix count (109, verified). S3d's wrap of demo-smoke/occlusion/lighthouse-a11y
   is +3 to THAT metric (they are absent from `package.json` today, invoked as raw `node scripts/X.mjs`
   at `ci.yml:216,218,471`); S6a's KILL is −1; the prefix count rises **+2 net, by design**, as
   previously-uncounted CI gates enter the gate registry. This does NOT violate T1: T1 binds the
   ESTATE — LoC + dup-counts + scripts-it-deletes — which all go strictly down; the +2 is a count-NEUTRAL
   RELABEL on the honest `raw-node ∪ proof:*` denominator (112 → 111), where the only true delta is the
   `repin-safe` deletion. A wave run that leaves any **load-bearing** consolidation cell (LoC, the three
   dup counts, the scripts S6 deletes, importers) equal-or-higher VIOLATES T1 — the wave reds. The
   proof-KEY cell is recorded for honesty, not gated for strictly-down. *(Cross-wave: J.W5 adds
   `proof:published-surface` — a GENUINE new correctness gate + `scripts/proof-published-surface.mjs` —
   and J.W6 authors `proof:event-ordering`; both raise the GLOBAL post-J key/script count above this
   wave's BEFORE. Those are NEW correctness gates, a separate accounted line OWNED by their waves, NOT a
   J.W3 estate-consolidation regression — T1 binds gate-WORK against growing the estate, it does not
   forbid a new correctness oracle. J.W3's net-deletion ledger is the per-wave estate-consolidation
   invariant; it does not, and may not be read to, account for other waves' new gates.)* The measurement
   is RECORDED in the wave note (the bench/probe artifact discipline), not asserted.

**Plus the meta-bite (S4):** `proof:gate-is-runtime`, with its roster DERIVED from `proof:correctness`
(no hardcoded list), audits all 10 correctness gates; **BITE:** reds TODAY on `demo-fonts` (load-rest,
no actuation) once the roster is derived; greens only when S5's actuation leg lands (demo-fonts
actuates) — the meta-gate now bites the gate it used to exempt (GC-3).

**The §spine bar — the net-deletion wave MUST bite three ways.** The wave's green hangs on the
**bite-preservation** leg (a sampled migrated gate still REDS born-RED through the lib AND its
oracle-set is byte-identical pre/post — the migration preserved every oracle, machine-checked per
leg-1's per-gate diff clause), corroborated by the **two-way equivalence** (`proof:all == CI` both
directions) and the **strictly-down ESTATE counts** (35,227→<35,227 LoC, 43/51/54→0 dups, 93→<93
scripts, 7→~50 importers). The proof-KEY count is **NOT** a strictly-down cell — it rises +2 net by
design (−1 `repin-safe`, +3 S3d wrap of previously-uncounted raw-node CI gates), carved out above; the
load-bearing net-deletion measurement is the ESTATE (LoC + dups + scripts-it-deletes), which is exactly
what S1's consolidation shrinks. The LoC/dup-count deltas, the script-count delta, and the stale-ref
greps are HYGIENE corroborators — labeled — and may never substitute for a red bite-preservation clause.
The day this gate is green, the I "collapse the lattice" thesis is finally true at the inventory, not
just the authority: the estate is the lib it already half-owned, the ESTATE LoC + dup-count are strictly
down, the registry is HONEST (every CI gate counted, none hiding as a raw-node step), and **no gate lost
its bite in the shrinking** (`J.md` T1, `precepts.md` §3-T1).

## §Folds (every J.md-assigned fold, with its evidence citation)

| Fold | Origin (audit §) | Where in this spec |
|---|---|---|
| Harness consolidation: `withPage`/`withBrowser` + shared `serveDist`/MIME/chromium/`navToScene`; migrate ~50 gates; the lib at 7 importers; the lib divergence | `gate-census.md` GC-1; `precepts.md` F2; PRE-1 | S1 |
| The un-executed collapse (count GREW 103→109; the relabeled lattice) | `precepts.md` §2-F2/§3-T1; PRE-1; `gate-census.md` §3 | S1 + §Hard (strictly-down counts) |
| NAMED_BENIGN promoted to the lib (single-source budget) | `gate-census.md` GC-7 | S1b |
| W7-2 the named-benign exclusion leg-scoped (`/source ?map/i` tightened) | `wave-I.W7.md` W7-2 | S1b |
| W7-1 the B2 dev-server leg FAILS (not note-skips) under `KF_REQUIRE_BROWSER` | `wave-I.W7.md` W7-1 | S6d |
| The ONE `IN_CI` helper + per-gate declared on-device posture | `ci-cd.md` CICD-3; `WZ-postclose.md §B/§D` | S2a/S2b |
| The third tier NAMED (correctness-tier-but-CI-observe-only) | `WZ-postclose.md §C`; `wave-I.W7.md §10`; `ci-cd.md` §5 | S2b |
| The three postures named (observe-only / runner-calibrated / hard) | `ci-cd.md` §5 | S2b |
| The device-dependent policy decision (observe-only, not CI-excluded) | `WZ-postclose.md` c2 | S2b |
| `proof:all == CI` (two-way coverage clause; the 3 orphans tiered) | `gate-census.md` GC-2; BP-4; `precepts.md` F4/F5; `WZ-postclose.md §E` | S3 |
| The 3 true orphans tiered (browser KEEP / lighthouse-mobile→J.W4 / repin-safe KILL) | `gate-census.md` §1 (EXCLUDED set) | S3c |
| ci-coverage raw-node-script blind spot (demo-smoke/occlusion/lighthouse-gate) | `ci-cd.md` CICD-4 | S3d |
| ci-coverage version-literal clause vacuous (caret-only, ci.yml-only) | `ci-cd.md` CICD-5 | S3d |
| The meta-gate derives its roster from `proof:correctness` membership (T4) | `gate-census.md` GC-3; `wave-I.W7.md` W7-3 | S4 |
| `proof:demo-fonts` tier-decided (actuation leg OR demote; recommend actuate) | `gate-census.md` GC-4; `wave-I.W7.md` W7-3 | S5 |
| KILL `proof:repin-safe` (stale-by-construction) | `gate-census.md` GC-5 | S6a |
| `proof:deps-current` floors advance (value.js 0.11.2 / glass-ui 3.9.0) | `build-packaging-release.md` BP-5/BP-6 | S6b |
| Strip 5 dead-gate names from ci.yml comments | `gate-census.md` GC-6; `ci-cd.md` CICD-6 | S6c |
| W7-5 `proof-browser.mjs` CANDIDATE_GATES stale names | `wave-I.W7.md` W7-5 | S6c |
| The phantom `no-route-storm` docstring refs | `wave-I.W7.md §2`; `rc-gate-blindspot §2.1` (via precepts) | S6c |
| Stale glass-ui version comments (`ci.yml:199` `~3.5.1`; `deploy-pages.yml:58` `^3.4.0`) | `build-packaging-release.md` BP-7/BP-8; `ci-cd.md` CICD-6 | S6c |
| T3 the two surviving proxies re-labeled honestly | `precepts.md` §3-T3; `J.md` T3 | S7 |

## §Design decisions (trade-offs RESOLVED)

- **Net-deletion is the binding rule, not an aspiration — RESOLVED (T1), on the ESTATE cells.** I claimed
  "collapse the lattice" and GREW the count 103→109 (`precepts.md` §2-F2). J does not re-claim the
  collapse — it EXECUTES it on the load-bearing ESTATE cells (LoC + the dup counts + the scripts it
  deletes), with the before/after ledger recorded and the §Hard gate reding on any of THOSE cells that
  does not go strictly down. The `proof:`-prefix KEY count is deliberately CARVED OUT (§Hard leg-3): it
  rises +2 net by design because S3d brings three previously-uncounted raw-node CI gates into the
  registry net of the `repin-safe` KILL — a count-NEUTRAL relabel on the honest `raw-node ∪ proof:*`
  denominator, not estate growth. Binding net-deletion on a count-proxy a deletion could game would
  reward a lobotomy; binding it on the ESTATE (and policing the count for honesty, not direction) is the
  correct denominator. The mechanism is the lib (S1), not gutting useful hygiene gates (S7).
- **Bite-preservation sampling PLUS per-gate oracle-invariance, not blanket re-verification — RESOLVED.**
  Re-witnessing all ~50 migrated gates born-RED is expensive; re-witnessing none is the lobotomy risk.
  The sample is DEFINED (every correctness gate + a seeded-random named hygiene sample, seed recorded) so
  a SUBSET is proved to STILL BITE without a full re-run. But a sample alone leaves a gap: a lobotomy
  OUTSIDE the sample passes the sample AND greens leg-3's LoC. So the boilerplate-only constraint is
  PROMOTED from a process corroborator to a GATED MACHINE clause (§Hard leg-1, the per-gate
  oracle-invariance check): every migrated gate's oracle-set (assertion AST + oracle-substring literals)
  is byte-identical pre/post, only the harness band may change — proving NO gate's bite was removed,
  across the FULL migrated set. The sample proves a gate still bites; the oracle-invariance clause proves
  none was silently dropped; together "no oracle was lost" is a machine fact, not a sampled inference,
  and leg-3's strictly-down LoC becomes un-gameable by deletion.
- **Keep the surviving proxies, re-label them — RESOLVED (T3).** The census says the hygiene gates
  police distinct invariants and "keep stands" (`gate-census.md` §2b); the precept forbids them COUNTING,
  not EXISTING (`precepts.md` §3-T3). The honest move is the in-script NON-AUTHORITATIVE re-label
  (S7), not deletion — net-deletion comes from the dup-consolidation, not from gutting hygiene.
- **demo-fonts actuates rather than demotes — RESOLVED.** The cheap honest fix exists (the `navToScene`
  primitive this wave already lands); ADDING the actuation leg keeps the standalone font-survives-switch
  assertion AND makes the tier honest, strictly better than demoting to hygiene (S5). The decision rule
  is named so a future gate's tiering is not ad-hoc.
- **The third tier is NAMED, P6 made mechanical — RESOLVED.** The unnamed correctness-tier-but-CI-observe-only
  band (`WZ-postclose.md §C`) is the exact gap that let `perf-frame-budget`'s posture be ad-hoc; naming
  it + the single helper + the hygiene clause that enforces it (S2c) makes P6 a charter invariant a gate
  polices, not a per-script convention.
- **No-workaround at every seam — RESOLVED (`J.md` §spine).** The migration may not weaken an oracle to
  pass through the lib; the `IN_CI` helper may not paper a device-INDEPENDENT flake; the meta-gate roster
  is derived not hand-exempted; the W7-1 note-skip becomes a hard fail at the lib seam; repin-safe is
  KILLED not RECORDED. Each is named in its S-item as a prohibition.
