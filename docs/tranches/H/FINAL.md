# Tranche H — FINAL

The authoritative close for keyframes.js' eighth tranche. The charter is `H.md`; the
status board is `PROGRESS.md`; the audit evidence is under `audit/` (35 phase-1 lanes +
6 `_SYNTHESIS-` docs + the `feedback/` + `harden/` rounds). This document reconciles the
13-wave ledger to a terminated state: every wave SHIPPED with a biting gate, every chronic
CLOSED via a SYSTEM-property gate (or a born-RED HANDOFF paired with one), every deferral
dispositioned, the gate regime counted and green. Per the chronic-closure discipline
(`audit/_SYNTHESIS-gap-scorecard.md §0/§6`, binding): **a chronic exits ONLY with (a) a
passing SYSTEM-property gate, or (b) a HANDOFF tag PAIRED with a born-RED kf gate.** This
is the LAST tranche these four chronics can be re-papered.

H's single duty, inherited from G's honest close: finish the **demo-quality /
design-language-restoration / mobile / scene-state** band that G's source-and-contract gate
regime was structurally blind to. The engine, boundary, parse, and color kernels were
ALREADY-SOTA and H did NOT touch them (`audit/_SYNTHESIS-gap-scorecard.md §5`, inv ζ) —
save the ONE W0 crash-fix (a typed-error BUGFIX, below). The library public API
(`src/animation/index.ts`) is UNCHANGED vs master; H is the **demo tranche**, deploys to
Cloudflare Pages (`keyframes.babb.dev`, user-domain), and the npm bump is a **PATCH**
(`4.1.0 → 4.1.1`) carrying only the W0 typed-error fix.

---

## 1. The 13-wave summary (what each wave shipped + its biting gate)

The DAG that ran: `H.W0 → H.W1 → {H.W2 ∥ H.W3} → {H.W4 ∥ H.W5 ∥ H.W6} → H.W7 → H.W9 →
H.W10 → H.W11 → H.W12 → H.W8`. The three corrective feedback rounds (W9 F1–F9, W10 G1–G8,
W11+W12 I1–I12 + J1–J6) each landed BEFORE H.W8's golden baseline locked the pixels — the
chronic-closure discipline catching re-papers before the baseline fixed them.

| Wave | Shipped | Biting gate (born-RED → GREEN) | Commit |
|---|---|---|---|
| **W0** | KILL THE LIVE CRASHES. The two console crash families that poisoned every other measurement die: H-A1 the `serializeEasing` throw on a bare `cubic-bezier`/`steps` closure with no `.css` twin (`format.ts:30-44`), and H-A2 the `"......"` lerp parse-error on route-storm-restored blank state (`frame-compiler.ts:155-167`). Both become typed `AnimationOptionError`s — the **only** library-touching change in H, a shipped-product correctness BUGFIX. | `proof:demo-console-clean` (0 console errors on a `cubic-bezier`-closure route + home→scene) + `proof:interpolate-anything` (the actual `"......"` reproduction) | `25a6434` |
| **W1** | THE SCENE + PLAYBACK STATE MACHINE — the keystone. One `useSceneMachine()` (`createGlobalState` + pure reducer) collapses 5 scene authorities + 3 playback authorities + the `isStableFire` heuristic into two orthogonal axes (scene ∈ 9, playback-status ∈ 5). Ends the autonomous route storm; makes suspend→restore a byte-identical identity. Folds D9 (the @mbabb popover un-double-wrap). | `proof:scene-machine-irrefragable` (the scenes²×{playing,paused} round-trip identity) + `proof:no-route-storm` + `proof:scene-isolation` + `proof:deep-link-wins` + `proof:scene-raf-leak` + `proof:dock-popover-opens` + `proof:single-toggle` | `256f6fe` |
| **W2** | RESTORE THE DESIGN LANGUAGE — cartoon depth as the panel hover/depth idiom. Panels flip to `surface="cartoon"`; the orphan mouse-tracked specular radial dies at source; the manual `.glass-card` plate is deleted in the same motion (no-legacy). | `proof:cartoon-is-panel-depth` + `proof:no-orphan-specular` (`anyPointerWrite:false` invariant) | `1ec7773` |
| **W3** | THE RAIL·STAGE·RAIL LAYOUT. One named `[rail] var(--rail-width) [stage] 1fr` grid; `--rail-width` single-sources sidebar + timeline + mobile sheet. All field rows share one left-edge. | `proof:single-column-pack` + `proof:timeline-rail-width` + `proof:demo-shell-grid` | `ece4743` |
| **W4** | EASING EDITOR + HERO φ-TYPOGRAPHY + ICON IDIOM. Easing canvas bounded + square (`clamp(160px,38cqi,280px)`); hero promoted `text-display-4` (86px) → `text-display-mega`; the 61 silent no-op `icon-*` classes resolve to one owned `@utility icon-*`. | `proof:easing-canvas-bounded` + `proof:hero-rung` + `proof:phi-leaf-zero` + `proof:icon-idiom` | `084feb9` |
| **W5** | SCENE ICONS + MODE PERTINENCE + CUBE/AMIGA PERF. One inline-`<svg>` `currentColor` icon family via `<component :is>`; orphan PNGs killed; Discrete→Spring sub-view MERGE (4 nav → 3); amiga off-canvas tessellation capped (~500k → ≤256 `fillRect`); every surviving mode gets ≥1 pointer affordance (the dead `<div>heyyyy` square dies). | `proof:scene-icons` + `proof:scene-parity` + `proof:scene-perf-budget` (+ `proof:amiga-*`, `proof:scene-host-contained`, `proof:offscreen-cv`) | `db90cbb` (+ `28e8851` svg-loader) |
| **W6** | TYPING-DOTS + CHROME DOGFOOD (inv ζ). The `.typing-dots` 3-span staggered primitive dogfoods `steppedEase`/`NumericAnimation`; decoupled from the `lift-down` shorthand collision. | `proof:typing-dots` + `proof:dogfood-hero` | `084feb9` |
| **W7** | MOBILE OVERLAY + SPRINGY DRAWER (D10/D13). The `rail·stage·rail` grid re-parameterized: stage full-bleed `[stage]` background, controls a bottom-SHEET that OVERLAYS (not displaces); the sheet motion is a `SpringProgress` subscription (no CSS `grid-template-rows` ease), settle <350ms, single-frame PRM snap — the engine dogfooded as the drawer. | `proof:mobile-single-page` + `proof:drawer-spring` + `proof:dock-zorder` | `d287f7e` |
| **W9** | DESIGN-LANGUAGE REFINEMENT ROUND 2 (F1–F9, corrective). The headline register collapse: keep `surface="cartoon"`, add `tier="quiet"`, REMOVE the tracked specular entirely (`proof:no-orphan-specular` inverts to exception=∅ — STRONGER). The `.pp` emoji → static SVG logo; dark-mode row-toggle wired; the bottom-left cartoon lobe un-clipped; the dead `.controls-pane--hovered` idle-fade revived. | INVERTED `proof:no-orphan-specular` + NEW `proof:glass-and-cartoon` / `proof:bezier-no-scroll` / `proof:pp-logo-svg` / `proof:darkmode-row-toggle` / `proof:cartoon-shadow-unclipped` / `proof:idle-fade` + AMENDED `proof:single-column-pack`; RETIRED `proof:cartoon-specular-coexist` / `proof:specular-calm` | `f064cc1` |
| **W10** | SCENE NORMALIZATION + EXPRESSIVE ICONS + STAGE LAYOUT-PRIMITIVE (G1–G8, corrective). The icon family REVERSES monochrome→**colorful** (the `--rainbow-*` palette); the easing/spring scenes REUSE the standard `PlaybackRibbon` + `Labeled*` sidebar (no forked second sidebar/ribbon); the easing stage = ONE engine-driven ball (G4 reverses the duplicate curve); the `.stage-cell` dock-safe containment primitive lands. | REVISED `proof:scene-icons` (expressive) + NEW `proof:scene-card-rounded` / `proof:scene-uses-standard-ribbon` / `proof:easing-stage-is-ball` / `proof:easing-sidebar-normalized` + AMENDED `proof:stage-within-docks` | `8df1e6a` |
| **W11** | STAGE GLASS-CARD + CONTROL-SURFACE DFA + LAYOUT REFINEMENTS (I1/I2/I4/I5/I6/I7, corrective). I5 REVERSES W10's full-bleed: the four stage scenes converge to ONE standard glass `<Card>` (the `.stage-cell` PRIMITIVE survives). The W1 FSM gains a 3rd orthogonal axis (`controlSurfaces` DFA — the reka-fallback hacks die). Uniform label subgrid; bezier panel de-nested + grown, "editing:" subtitle dropped. | NEW `proof:stage-glass-card` / `proof:card-rounded-primitive` / `proof:label-subgrid` / `proof:scene-control-dfa` / `proof:scene-transition-perf` / `proof:bezier-single-card` / `proof:bezier-grown` | `1df9731` |
| **W12** | STANDARDIZATION · DECOMPOSITION · ENCAPSULATION · BRITTLENESS AUDIT · SEQUENCE+PATH ENRICHMENT + EGGS (I3/I8/I9/I10/I11/I12 + J1–J6, corrective). The single `useDragScrub` extraction (3–4 hand-rolled drag copies → one); the motion-path gesture engine → `useMotionPathDemo`; every demo file ≤500L (engine FENCED); named `SAMPLE_STEP` + documented square-viewBox invariant + zero class-string DOM walks; localized OWNED-IDIOMS contract; draggable storyboard rows + editable motion-path control points + `offset-path` copy artifact + tangent readout + swept playhead; one easter egg per scene; J easing-sidebar minimalism. | NEW `proof:dragscrub-single` / `proof:composable-encapsulation` / `proof:demo-no-oversize` / `proof:no-brittle-selector` / `proof:styling-idioms` / `proof:sequence-rows-draggable` / `proof:motion-path-editable` / `proof:motion-path-copy` / `proof:easter-egg` / `proof:easing-sidebar-minimal` | `1988dcb` (+ `6abafcd` J fold) |
| **W8** | THE GATE-REGIME UPGRADE — the durability keystone (the LAST re-paper). Three structural additions: I-1 the SCENES manifest re-sourced from `scenes.ts` (the 6-of-9 drift dies); I-2 the `pixelmatch`+`pngjs` named-region pixel baseline (`proof:visual-lock`); I-3 the chronic-closure meta-gate that parses this ledger so a bare HANDOFF tag with no born-RED gate reds. Locks the W9 calm register / W10 colorful-icon / W11 glass-card-stage+control-DFA / W12 enriched-sequence-path golden render. | `proof:manifest-sourced` + `proof:visual-lock` + `proof:chronic-closure` (the meta-gate) | `1f506b2` |

---

## 2. The four-chronic ledger — FINAL state

The meta-lesson H internalized: four user-visible chronics "exited" the A→G ledger NOT by
being solved but by being re-classified (M1 issue-level close masquerading as system close;
M2 scope-narrowing; M3 column-migration to HANDOFF). The P-invariant policed the COLUMN,
not the PRODUCT. H's repair binds each to a SYSTEM-property gate, and the **chronic-closure
meta-gate** (`proof:chronic-closure`) parses this ledger so none can re-paper. The canonical
parseable substrate is the `## Open deferrals` four-row chronic table below (the same shape
the meta-gate parses in `PROGRESS.md`).

## Open deferrals

Zero perpetual punts. The four chronics that "exited" the A→G ledger by re-classification are
re-opened and each lands against the binding discipline — **a chronic exits ONLY with (a) a
passing SYSTEM-property gate, or (b) a HANDOFF tag PAIRED with a born-RED kf gate.** A bare
HANDOFF reds the ledger. (The cross-repo HANDOFFs, the kf-internal closures, and the ARCH-kills
are fully enumerated in §3 below; this table is the chronic-closure substrate.)

| Chronic | Prior false-close mode | H closure (the SYSTEM-property gate or paired born-RED HANDOFF) | Final state |
|---|---|---|---|
| **D2 cartoon-shadow / D14 specular** | M1 — issue-level close as system close | `proof:no-orphan-specular` (inverted to exception=∅: ZERO `.glass-specular-track` on ANY kf-owned `<Card>`, asserting the `anyPointerWrite:false` invariant) **partitioned** for the W11 I5 sanctioned glass STAGES (the inert glass-ui-owned track is residue, not a kf defect) + `proof:cartoon-is-panel-depth` (panel depth is the cartoon stamp) + `proof:glass-and-cartoon` (the `tier="quiet"` glass returns). The W9 register-collapse retired `proof:cartoon-specular-coexist`/`proof:specular-calm` (subject deleted). | **CLOSED** via SYSTEM gates. The glass-ui Card-specular sheen on the sanctioned stages is a born-RED HANDOFF (`proof:specular-handoff` → glass-ui 3.8.0 `specular="off"`; §3). |
| **D7 φ-hero typography** | M1 — C.W2 closed the editor site; the hero never reached a hero rung; raw body rungs lingered | `proof:phi-leaf-zero` (BOTH halves: the hero resolves the `text-display-mega` CLASS AND a px floor ≥140px at 1440×900, AND 0 raw `text-*` rungs across the demo — residual 2 (L1+L2) under the `ui/` shadcn exclusion, NOT 37) + `proof:hero-rung` (the rung half) | **CLOSED** via SYSTEM gates. `proof:hero-rung` alone was insufficient for M1 (it left raw rungs un-policed); `proof:phi-leaf-zero` polices the leaves. |
| **D10 mobile architecture** | M2 — scope-narrowing ("stack fits", not overlay) | `proof:mobile-single-page` (at 390×844 the scene host ≈ viewport, controls OVERLAY) + `proof:drawer-spring` (the `SpringProgress` subscription, spring-shaped trace, settle <350ms, single-frame PRM snap) | **CLOSED** via SYSTEM gates. |
| **D5 dock LAG** (+ **D9 @mbabb popover**) | D5: M3 — column-migration to HANDOFF with NO paired gate; D9: dropped from the chronic table | **D5 — `proof:dock-morph-settled` GREEN** (the `--spring-dock` ramp peak +4.5% ≤ +6%, down from the 3.4.0 +16.3% born-RED witness). kf pins `@mkbabb/glass-ui ~3.5.1` (consumes the published `53c1b07` retune; `~`-capped below 3.6/3.7 which re-regress the specular). The gate reads `node_modules` (inv-16 — kf CANNOT fork the token to green it; only the consumed bump does). **D9 — `proof:dock-popover-opens` + `proof:single-toggle`** (kf SHIP — the App.vue un-double-wrap). | **D5 CLOSED** via a passing SYSTEM gate (NOT a column-migration). **D9 CLOSED** via kf-patched SYSTEM gates. |

**The meta-gate.** `proof:chronic-closure` parses `PROGRESS.md §"Open deferrals"` (the canonical
parseable substrate, present today) — and ADDITIONALLY this `FINAL.md` behind an `fs.existsSync`
guard — and reds if any chronic row carries a bare HANDOFF with no born-RED gate, or a
LOAD-BEARING gate that does not resolve in `package.json`. It is **GREEN**. This is the structural
mechanism that makes H the last tranche these four chronics can be re-papered: a future re-paper
must red a SYSTEM-property gate, not merely migrate a column.

---

## 3. The deferred ledger — fully terminated

Zero un-dispositioned punts. Every open item resolves to exactly one of: CLOSED (passing
SYSTEM gate) / born-RED HANDOFF (named, paired with a kf gate) / ARCH-kill. No item is
named-forward to a ninth tranche.

### Cross-repo HANDOFFs (born-RED, inv-16 — kf consumes published, never forks/patches a sibling)

| HANDOFF | Disposition | Paired born-RED kf gate | Resolves at |
|---|---|---|---|
| **glass-ui Card-specular SHEEN** on the W11 I5 sanctioned glass stages | born-RED HANDOFF. The user's W8R decision: "keep glass + handoff the sheen." The visible bloom is ALREADY DEAD at the consumed ~3.5.1 (glass-ui 3.5.0 killed it); the residual inert `.glass-specular-track` class is glass-ui-owned residue, a COSMETIC opt-out — NOT a blocker. The AX session already fixed it at glass-ui HEAD (`6fac61a`/`eaba94f`, AX.W09 `specular="off"` default) — UNPUBLISHED. | `proof:specular-handoff` | glass-ui **3.8.0** `specular="off"`; kf bumps then = the **W34 consumer-adoption leg** (cosmetic). Coordination filed at `glass-ui/docs/tranches/AX/coordination/from-keyframes-W8-specular-consume-edge.md` + kf-side `docs/tranches/H/glass-ui-AX-handoff.md`. |
| **glass-ui `LabeledField orientation`** (the durable controls-row home) | born-RED HANDOFF. kf greens TODAY via a demo-side `grid-cols-[auto_1fr]` wrapper (path B); durably on the published `orientation` prop. | the AMENDED `proof:single-column-pack` label-left clause | glass-ui AX (G-3, HIGH). |
| **glass-ui `{types}` VT helper · Drawer `spring` · cartoon+quiet preset** | BOOK / LOW. The VT helper waits on `useSceneTransition.ts` (G-4, MED); the Drawer `spring` is a BOOK — kf deliberately ships its own `SpringProgress` drawer (inv ζ, G-5); the cartoon+quiet preset is OPTIONAL (the explicit prop-pair is born-GREEN, G-6). | `proof:glass-and-cartoon` (cartoon+quiet) / demo-smoke VT (types) | glass-ui AX (MED/LOW). |
| **value.js / parse-that slices** (CHRONIC-by-design, standing) | born-RED HANDOFF. The value.js next-slice (E1/E2 linear parser, VJ-F1 path sampler, F2 color sentinels, MCI-5 identity pad, VJ-F2 error sink, VJ-F4 buffer overload, F3 LRU) + the parse-that `(id,offset)` packrat re-key (PT-4) ride the next re-pin, ZERO kf edit. | the `it.fails` MCI-5 witness (the consume signal) / `proof:packrat-position` (parse-that) | the next consume re-pin. |
| **The deploy leg** (P0) | born-RED HANDOFF, USER-DOMAIN. `keyframes.babb.dev` is Cloudflare Pages (NOT GitHub Pages); the `dns-cf-sync.sh` CNAME (G-HANDOFF-3). The LEAD merges + the user confirms the deploy. | the constellation spine + `deploy-pages.yml` | the close + user confirm. |

### kf-internal closures + ARCH-kills

- **D5-b dock LAG (consume-leg)** — CLOSED + GREEN (no longer pending): `proof:dock-morph-settled` GREEN on the consumed ~3.5.1. Reconciling the demo to 3.6/3.7 is a follow-on glass-ui-reconciliation HANDOFF, not this close.
- **D12 the scene-state corruption** — DEAD: the W1 FSM is the structural kill; `proof:scene-machine-irrefragable` + `proof:no-route-storm` police it.
- **DC-8 (scene-swap dead CSS)** → H.W5, `grep=0` gate. **FB-6 (`Mod+K` palette)** → owner-decision BOOK at this close (not a latent punt).
- **The W9/W10/W11/W12 landed-decision SUPERSEDES** are NOT chronics (no false-close history) — they are corrective supersedes the user observed on the running demo, each cited in the owning wave's §supersede-map, caught BEFORE H.W8's golden baseline locked them. Each is terminated by the corrective wave's gate set (above).

---

## 4. The gate regime — final count + green state

The `proof:*` suite is the durable substrate. **102 `proof:*` npm scripts** — **100 leaf
gates + 2 aggregators** (`proof:all`, `proof:browser`), all CI-invoked via `ci.yml`:

- **`proof:all`** chains **91 distinct gates** inline + `vitest run` (the full unit/contract suite).
- **`proof:browser`** runs the **35 browser gates** (the appearance + interaction axis — H.W8 WV-W8-HIGH-3) against `dist/gh-pages`, including `proof:visual-lock` (the `pixelmatch` named-region pixel baseline).

The green state at close:

| Check | State |
|---|---|
| `tsc --noEmit` | **0 errors** (verified clean, exit 0) |
| `proof:all` | GREEN (91 inline gates + vitest) |
| `proof:browser` | **35/35** browser gates GREEN |
| `proof:chronic-closure` (the meta-gate) | **GREEN** — every chronic row carries a resolving SYSTEM gate or a born-RED paired HANDOFF |
| `proof:visual-lock` | GREEN against the golden baseline |

The regime upgrade is the durability keystone: the appearance axis (`proof:visual-lock`),
the interaction axis (the 35 browser gates), the re-sourced manifest (`proof:manifest-sourced` —
the 6-of-9 drift dies), and the chronic-closure meta-gate together close the blind spots
that let G's source-and-contract regime miss the demo-quality band. This is what makes H the
LAST re-paper.

---

## 5. The dev/impl boundary honored + the engine FENCED (inv ζ)

H was authored in a docs-only DEVELOPMENT phase (`tranche-h-dev`: 35 phase-1 lanes + 6
synthesis docs + the wave specs, ZERO source/test/CI/demo edits) and implemented only on
explicit user authorization against green CI — the D/E/F/G dev/impl boundary, held.

The engine, boundary, parse, and color kernels stayed **FENCED** (inv ζ, `§5` ALREADY-SOTA):
the `lerpValue → iv._lerp` single-dispatch seam, the quaternion-native `rotate3d`, the
`.finished`/DrawSVG/`adoptCompiled` API, the φ-ladder MECHANISM + Capsize fallback, the
design-idioms token consolidations, the scene-subject dogfood, the deferred-ledger spine —
H did NOT re-touch them (re-touching exemplary work is the inverse failure).

The **sole** library-touching change is the W0 crash-fix: the two typed `AnimationOptionError`s
replacing cryptic value.js crashes (H-A1 `serializeEasing`, `format.ts:30-44`; H-A2 the
blank-keyframe-selector guard, `frame-compiler.ts:155-167`). These correct WRONG behaviour
(a throw on a `cubic-bezier`-closure route + a parse-error abort on route-storm-restored
state) — a shipped-product-correctness **BUGFIX**, hence a PATCH. `env.d.ts` is demo-only.
The chrome DOGFOODS the engine (inv ζ): the typing-dots primitive (`steppedEase`/
`NumericAnimation`) and the mobile drawer (`SpringProgress`) became dogfooded engine consumers.

**SEMVER.** The library public API (`src/animation/index.ts`) is UNCHANGED vs master. The
npm changeset is a **PATCH** (`4.1.0 → 4.1.1`), version owner **Mike Babb**. The DEMO (the
bulk of H — unpublished, `files:["dist"]`) deploys to Cloudflare Pages separately, NOT an
npm bump.

---

## 6. Cross-repo coordination (the AX consume-edge)

The glass-ui AX tranche is the sibling owner of the surfaces H surfaced (audited, never
patched in kf — inv-16). The consume-edge is reconciled:

- **The W8R "keep glass + handoff the sheen" decision** rides `proof:specular-handoff` born-RED, resolving at glass-ui **3.8.0** `specular="off"` (kf's W34 leg, cosmetic). The kf-internal gate contradiction (`proof:no-orphan-specular` exception=∅ vs `proof:stage-glass-card` REQUIRING the stages glass) was resolved by **reconciling `no-orphan-specular`** — the 5 W11 glass stages are the sanctioned `surface="glass"` exception (the inert glass-ui track is residue); the gate still bites panel-specular + visible blooms + un-sanctioned glass. No kf override, no `!important`, no fork.
- **Coordination filed** at `glass-ui/docs/tranches/AX/coordination/from-keyframes-W8-specular-consume-edge.md` + the kf-side handoff charter `docs/tranches/H/glass-ui-AX-handoff.md` (G-1 … G-6, each its own glass-ui anchor + paired born-RED kf gate + priority).
- **The dock retune** (`53c1b07`, glass-ui 3.5.0/3.5.1/3.6.0) is CONSUMED at `~3.5.1` — informational for AX (G-0, no action; listed so AX doesn't re-open it).

The discipline holds throughout: every cross-repo HANDOFF carries a born-RED kf gate so it
cannot become a silent forever-punt — it flips GREEN in kf's CI only when the sibling change
ships + kf bumps to consume it. inv-16: kf consumes the published sibling; none of it is
patched in kf.

---

## Close

13 implementation waves landed + committed (19 commits ahead of master, `25a6434 … 1f506b2`).
The four chronics are CLOSED via SYSTEM gates with the chronic-closure meta-gate preventing
re-paper. The deferred ledger is fully terminated — zero un-dispositioned punts. The gate
regime is 102 `proof:*` scripts (100 leaves + 2 aggregators), all CI-invoked: `tsc` 0,
`proof:all` green, `proof:browser` 35/35, `proof:chronic-closure` green. The engine stayed
FENCED save the W0 typed-error BUGFIX; the library is a PATCH (`4.1.0 → 4.1.1`, owner Mike
Babb); the demo deploys to Cloudflare Pages (user-domain).

The merge to master, the npm publish, and the CF Pages deploy are the LEAD's + the user's
(deploy is user-domain, confirm-first) — NOT this workflow.
