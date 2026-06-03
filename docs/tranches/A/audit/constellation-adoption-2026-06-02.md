# Constellation-adoption fold — keyframes.js — 2026-06-02

**Tranche**: A (keyframes.js' first tranche; DEVELOPMENT phase — W0 reconciliation
+ W1 design). **Wave context**: A.W0 hygiene. **Status**: catalogue + booked-action
ledger. Additive doc only — **no code, no script, no build config is written by
this doc.** keyframes' tree is clean at author time (HEAD `12f8282`); nothing
in-flight is touched.

This folds the four constellation deliverables value.js authored
(`value.js/docs/dev-deploy-standard.md`,
`value.js/docs/tranches/K/audit/screenshot-catalogue-2026-06-02.md`,
`value.js/docs/tranches/K/design/K.W1-visual-evidence-protocol.md`, and the
shared precept `docs/precepts/instructions/tranche/SPEC.md
§"Before/after + compare-at-close"`) into keyframes' own A tranche, grounded in
keyframes' real state. Every item below is **BOOKED, not executed** — landing any
of them is a per-repo IMPL step outside A's tranche-writing scope, and three of
them already sit on A's own wave schedule (the dev.sh adoption is library-SHAPE
and new; the screenshot/cruft sweep is the `.playwright-mcp`/`.DS_Store` hygiene;
the precepts bump is a gitlink advance).

---

## §0 — keyframes.js state at fold-time (grounded)

| Fact | Value | Source |
|---|---|---|
| Git HEAD | `12f8282` (master, **clean tree**) | `git rev-parse`, `git status` |
| Package | `@mkbabb/keyframes.js` **v2.2.0** | `package.json` |
| SHAPE | **library** (one Vite dev server, no mongo, no backend) | dev-deploy-standard §1 per-SHAPE |
| `engines` | `node >=22`; all workflows pin node 24 (clean — the node-20 issue is glass-ui's) | `package.json`, A PROGRESS |
| `sideEffects` | `false` (tree-shaking posture) | `package.json` |
| value.js dep | `@mkbabb/value.js: ^0.10.0` — **registry-resolved**, not a `file:` seam | `package.json` |
| glass-ui dep | `@mkbabb/glass-ui: file:../glass-ui` (devDep, demo-only) — the CI-break seam A.W1 takes OFF the library path | `package.json`, A.md inv β |
| Boundary (live, KF-B1) | `dist/keyframes.js` 17.1 KB barrel (value.js-free) · `dist/engine-DuAFoqZF.js` 24.7 KB (the value.js-bearing dynamic chunk) · `dist/leaves-Bu89334e.js` 1.0 KB | `ls dist/`, A PROGRESS |
| App shape | **scene-playground SPA** — `demo/app/` (gh-pages root) with Cube/Amiga/Square/Easing/Spring scenes (`demo/app/scenes.ts`, `useSceneRouter.ts`); a second `demo/playground/` entry | `demo/app/`, `vite.config.ts` |
| Precepts submodule | gitlink = checkout = **`63240e6`** (canonical, no drift) | `git ls-tree HEAD docs/precepts`, submodule HEAD |

No value.js-style **blob-position regression** applies here: keyframes ships **no
WebGL2 hero blob** (that is a value.js-demo `<HeroBlob>` artefact). The keyframes
demo is a deterministic scene-playground; its only "moving" visual surface is the
engine's own animated scenes (cube transform, easing/spring curve plots). The
present/positioned canvas assertion (§3) therefore applies to the **scene-canvas
content**, not a blob.

---

## §1 — (a) dev.sh / deploy.sh standard adoption (BOOKED)

keyframes is the **library** SHAPE in the constellation standard
(`value.js/docs/dev-deploy-standard.md §1`): one Vite dev server, no mongo, no
api, no `REQUIRED_ENV`. The standard names keyframes explicitly as **"identical
to glass-ui; gh-pages demo on master push + npm on tag (both CI)"** with a draft
ready and rollout **BOOKED** (§4 of that doc).

### keyframes' `scripts/dev.sh` DRAFT (the library CONFIG block)

The standard's runtime body is invariant; an adopter fills **only** the
`# ── CONFIG ──` block and the four overrides. For keyframes the library shape
collapses to a single Vite server on `:5173` with `--strictPort`, no backend, no
mongo, and the demo's `file:../glass-ui` devDep is **not** a dev prerequisite for
the *library* surface (only the demo build consumes it). The booked CONFIG:

```
PROJECT_NAME="keyframes.js"
SHAPE="library"                  # one Vite dev server; no mongo, no api
REQUIRED_BINS=(node npm)         # no docker — library shape
REQUIRED_ENV=()                  # no secrets on the library dev path
FRONTEND_PORT_DEFAULT=5173       # Vite default; free-port-resolve with fallback
NEEDS_MONGO=0
SIBLING_WATCH_BUILDS=()          # keyframes is a LEAF supplier — it has no on-disk
                                 # @mkbabb/* dep to watch-build (value.js is
                                 # registry-resolved; glass-ui is a demo-only
                                 # devDep, not a runtime dep). Siblings watch-build
                                 # keyframes (speedtest lists it), not vice-versa.
```

Overrides: `start_frontend()` keeps the template default (`npx vite --port
"$FRONTEND_PORT" --strictPort`); `start_backend()` stays the no-op `:`;
`do_build() { npm run build:lib; }` once A.W1 lands the library-only build split
(today `npm run build` runs `vite build --mode production`); `do_test() { npm
test "$@"; }` (vitest). The `gh-pages` / `playground` demo builds stay separate
arms the dev path does not require — mirroring the standard's library note that
the demo seam is dev-only.

> **Divergence from the bare template — none of substance.** keyframes is the
> *cleanest* library adopter: no mongo, no `REQUIRED_ENV`, no sibling
> watch-builds. The one nuance is the **two demo entries** (`demo/app/` for
> gh-pages, `demo/playground/`) — `up` brings up the default `dev` (the app);
> a `-- --mode playground` passthrough selects the playground. This is a single
> `start_frontend` mode flag, not a structural divergence.

### The adoption ask (BOOKED)

Per the standard's §4 rollout table, keyframes' row is **BOOKED (draft ready)**.
Landing `scripts/dev.sh` (+ a library-shaped `scripts/deploy.sh` wrapping the
gh-pages CF/CI recipe, since the keyframes demo deploys to gh-pages and the
library publishes to npm from CI on a `v*.*.*` tag — never from a dev machine) is
a per-repo IMPL commit dispatched by the owning cross-repo step. **A's A.W1
already owns the adjacent `build:lib` split** (A.md §RESOLVED 4, inv β); when the
dev.sh rollout dispatches, `do_build()` points at that split. A does **not** write
the script — this doc records the draft + the ask.

---

## §2 — (b) screenshot INVENTORY + date-stamped ARCHIVAL plan + current-app-state

### Inventory (from the cross-repo catalogue, keyframes row, verified against HEAD)

| Class | Count | Path | Disposition |
|---|---|---|---|
| Loose scratch PNG | **2** | `.playwright-mcp/dock-closeup.png` (Mar 16 2026), `.playwright-mcp/dock-fixed.png` (Mar 16 2026) | ARCHIVE-or-ledger-delete |
| `.playwright-mcp` logs | **51** | `.playwright-mcp/*.log` | gitignore + prune-ledger (scratch) |
| `.DS_Store` | **7** | repo-wide (incl. root) | gitignore + delete (hygiene sweep) |
| Archived doc-assets | 14 | `docs/` / `assets/` (e.g. `assets/cube.png`, `assets/icons/*`) | KEEP (already in `docs/`/`assets/`) |
| dist fixtures | 5 | `dist/` test fixtures | KEEP (build artefacts) |

The 2 loose PNGs are **stale demo-dock captures** (Mar 16 2026, pre-dating A) —
they image a `dock-*` surface from the demo, not engine output, and have no
owning tranche (keyframes had no `docs/tranches/` before A). They are first-time
archivals, not protocol BEFORE/AFTER captures — they land under a **retroactive
archival leaf**, not an `open`/`close` leaf.

### Date-stamped ARCHIVAL plan (BOOKED — archive, not delete)

Per `K.W1-visual-evidence-protocol.md §2` archival convention. **Zero `rm`** — the
catalogue's no-naive-delete rule. Booked target:

```
docs/tranches/A/audit/A.W5-visual-runtime/baseline/2026-06-02-Aarchive/
  dock-closeup.png      # git mv from .playwright-mcp/
  dock-fixed.png        # git mv from .playwright-mcp/
```

The `-Aarchive` leaf marks a retroactive archival run (distinct from a tranche
`open`/`close` capture), matching value.js's own `-Karchive` convention in the
catalogue. The `git mv` set is the booked action — **this doc moves nothing**.
The 51 `.playwright-mcp` logs + 7 `.DS_Store` are a **separate hygiene sweep**
(gitignore + delete — out of visual-protocol scope), booked at the same sweep
(see §4). keyframes' `.gitignore` does not yet exclude `.playwright-mcp/`; adding
it is part of that booked hygiene IMPL.

### Current-app-state record (HEAD `12f8282`)

- **Version**: v2.2.0 (KF-B1 boundary release); CHANGELOG is the release record.
- **App shape**: scene-playground SPA at `demo/app/` (gh-pages root) — Cube,
  Amiga, Square, Easing, Spring scenes via `demo/app/scenes.ts` /
  `useSceneRouter.ts`; a second `demo/playground/` entry for the easing/spring
  authoring surface.
- **Library boundary (live)**: `dist/keyframes.js` 17.1 KB (value.js-free barrel),
  `dist/engine-*.js` 24.7 KB (the value.js-bearing dynamic chunk),
  `dist/leaves-*.js` 1.0 KB — the KF-B1 split confirmed on disk.
- **Known visual state**: **no blob, no blob-position regression** — keyframes
  ships no WebGL2 hero canvas (that is a value.js-demo artefact). The keyframes
  visual surface is the deterministic engine scenes; the only known
  visual-evidence gap is that **no archived close-baseline exists** (keyframes ran
  on changesets, never a paired-π tranche close — A.W4/W5 is the first that
  *could* establish one, see §3).

---

## §3 — (c) before/after visual-evidence protocol adoption + precepts-sync (BOOKED)

### Protocol applicability — library-scoped

keyframes is **library-heavy**; the catalogue's keyframes booking is explicit:
*"apply only to demo / playground surfaces."* The protocol
(`K.W1-visual-evidence-protocol.md`) binds a tranche **only when it ships visual
changes**; a docs/backend-only or non-visual wave skips the lane with a wave-spec
justification (precept SPEC §"π lane"). A's wave map:

| A wave | Ships a visual delta? | π lane disposition |
|---|---|---|
| A.W0 (format reconciliation + hygiene) | no | **skip** (docs/hygiene-only) |
| A.W1 (design + `build:lib` CI repair) | no (script + workflow + design doc) | **skip** (build-config-only) |
| A.W2 (boundary ergonomics — `numeric`/`morph`/`timeline`) | no (engine internals; no demo render delta) | **skip** (engine-internal) |
| A.W3 (`proof:boundary` gate) | no (CI gate + negative test) | **skip** (CI-only) |
| A.W4 (engine modern-web/perf pass) | **possibly** — `prefers-reduced-motion` on the heavy path snaps animations to final frame; `scheduler.yield()` changes group compositor cadence; `linear()`-widened WAAPI (land-or-refute) | **PAIRED-π candidate** — if a demo scene's rendered motion changes under reduced-motion or the WAAPI widening lands a visible curve change |
| A.W5 (close ceremony) | no new delta | inherits W4's π verdict |

**The honest read**: A is an **engine** tranche — its deltas are static-graph
(boundary bytes), behavioural (reduced-motion snap), and perf (long-task break),
not pixel-layout. The π lane is **canonical-when-the-wave-ships-pixels**. A.W4 is
the only wave that *might* ship a demo-observable delta, and even there the
defensible probe is the **animation-timing sample** (≥5 frames spanning the named
duration on the reduced-motion toggle — precept SPEC §"π lane" probe coverage),
not a static layout screenshot. The protocol's **WebGL/canvas
present/positioned assertion** maps onto the keyframes scene-canvas: a reduced-motion
snap must leave the scene's final frame *rendered* (non-empty `readPixels`), not a
blank canvas — exactly the value.js blob assertion's mechanism, re-pointed at the
scene content.

### Booked π adoption

Per the catalogue's keyframes row: **adopt at next visual close**, demo/playground
surfaces only. For A specifically: **if A.W4 lands a demo-observable
reduced-motion or WAAPI delta**, A.W5 runs π **paired** on the affected
scene(s) (capture the scene-canvas at A-open HEAD `12f8282` as BEFORE, re-capture
at close, write `DELTA.md` with the present/positioned scene-canvas assertion).
If A.W4's deltas stay engine-internal (no demo render change — the likely
outcome, since reduced-motion *removes* motion rather than re-laying-out), A.W5
records the π-skip justification in the wave-spec. Either way the booking is on
A's schedule, not invented here.

### Precepts-sync — submodule bump (BOOKED)

The protocol's canonical home is the shared precept submodule
(`docs/precepts/instructions/tranche/SPEC.md §"Before/after + compare-at-close"`).
**Live state, verified this session:**

- keyframes precepts gitlink = checkout = **`63240e6`** (canonical, no drift —
  A.md §0.1 confirmed this; the audit's "drifted to `f27627e`" is already
  resolved).
- value.js precepts at the **same** gitlink `63240e6`, BUT the
  `Before/after + compare-at-close` subsection is an **uncommitted working-tree
  edit** in value.js' precepts submodule (+30 lines in `SPEC.md`, +9 in
  `LESSONS-LEARNED.md` over `63240e6`) — it is **not yet a committed precept**.

So the sync is genuinely **BOOKED, not actionable today**: when the constellation
precepts owner commits the before/after subsection and advances the canonical
pointer past `63240e6`, keyframes bumps its `docs/precepts` gitlink to that new
canonical (a one-line `git submodule update` + commit, IMPL — not written here).
**Today there is nothing to bump**: keyframes is *already* at the current
canonical `63240e6`; advancing it would point at an unpublished SHA. A.W0's
precepts confirmation (gitlink = `63240e6`) stands; the before/after bump is named
forward as a post-commit follow.

---

## §4 — (d) cruft / temp-file cleanup booking

Per the catalogue's keyframes "Other cruft" column, all **BOOKED** (a hygiene
IMPL sweep, archive-not-delete for the captures, gitignore+delete for the logs):

| Cruft | Count | Booked disposition | When |
|---|---|---|---|
| `.playwright-mcp/*.log` | 51 | gitignore `.playwright-mcp/` + prune (scratch) | hygiene sweep (A.W5 ι-adjacent or next visual close) |
| `.DS_Store` | 7 (repo-wide incl. root) | gitignore + delete | hygiene sweep |
| `.playwright-mcp/dock-*.png` | 2 | `git mv` → `A.W5-visual-runtime/baseline/2026-06-02-Aarchive/` (§2; archive-not-delete) | A.W5 ι-sweep |

There is **no cruft-md** to retire in keyframes (the catalogue's `words` row
carries the 24-cruft-md case; keyframes' root `.md` files are all load-bearing:
`README.md`, `CLAUDE.md`, `CHANGELOG.md`, `CONTRIBUTING.md`). The `.wrangler/`
dir is a tooling cache (gitignore-candidate, noted, not booked under this fold —
it is CF Pages tooling, adjacent to the deploy.sh §1 booking). The hygiene sweep
is engine-code-free and may ride A.W5's ι-sweep (the integrity-sweep already walks
the tree at close); it is recorded here as a booked action, **not executed by this
doc.**

---

## §5 — Manifest (this fold, BOOKED actions only)

| # | Booked action | Section | Owner / when |
|---|---|---|---|
| 1 | Land `scripts/dev.sh` (library CONFIG above) + `scripts/deploy.sh` (gh-pages/npm-on-tag) | §1 | cross-repo rollout step; `do_build`→A.W1 `build:lib` |
| 2 | `git mv` 2 dock PNGs → `A.W5-visual-runtime/baseline/2026-06-02-Aarchive/` | §2 | A.W5 ι-sweep (archive-not-delete) |
| 3 | Run paired-π on A.W4 demo scenes **if** it ships a demo-observable delta; else record skip-justification | §3 | A.W5 |
| 4 | Bump `docs/precepts` gitlink past `63240e6` once the before/after subsection is committed upstream | §3 | post-upstream-commit follow (nothing to bump today) |
| 5 | Hygiene sweep: gitignore `.playwright-mcp/` + `.DS_Store`, prune 51 logs + 7 `.DS_Store` | §4 | A.W5 ι-adjacent |

No git commit, no code, no script, no build config is written by this fold. All
five are per-repo IMPL steps; three (2, 3, 5) ride A's existing W5 close ceremony.
