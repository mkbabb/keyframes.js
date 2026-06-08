# impl-w10-proof-scene-icons — Gate lane: proof:scene-icons REVISE (G1)

**Wave:** H.W10 · **Lane:** proof:scene-icons REVISE · **Branch:** `tranche-h-impl`
**Contract:** `docs/tranches/H/waves/H.W10.md` §S1 + §Hard gate (the `proof:scene-icons`
REVISE row) + the lead's binding G1 direction.
**Scope (file-disjoint from the asset lane + the normalize lane):**
`scripts/proof-scene-icons.mjs` (the REVISE) + `.github/workflows/ci.yml` (the wiring).
**Status:** DONE · `node --check` clean · `npx tsc --noEmit` exit 0 · full gate (static +
KF_REQUIRE_BROWSER=1) exit 0 on the H.W10 assets · all four contract clauses BITE.
**DO NOT git commit (per the directive).**

---

## What the REVISE had to flip (per §Hard gate)

The W5 gate ENFORCED the monochrome family — the very thing the user rejected. The REVISE
inverts it onto the four contract clauses:

1. **RE-INSTANTIATION FAITHFULNESS** — the 4 originals (cube/amiga/square/easing) byte-match
   (or, for a 1:1 raster→SVG embed, pixel-match) their `084feb9` source. A hand-authored
   monochrome-derived stroke approximation FAILS.
2. **MONOCHROME INVERSION (non-vacuous)** — every descriptor icon is COLORFUL; a
   `stroke="currentColor"`-ONLY icon now FAILS; the 3 NEW (spring/sequence/motion-path)
   resolve ≥1 colored stroke/fill (a `var(--rainbow*/accent*/color*)` token or a baked hue).
3. **COVERAGE** — all non-home descriptors carry an icon (KEPT from W5, unchanged).
4. **NO-RASTER RELAXED** — `assets/icons/` permits the enumerated re-instantiated original
   rasters (`{cube,amiga,square}-icon-sm.png`) + the favicon, else SVG.

KEPT: the `<img>`-vs-inline-`<svg>` structural bite (the D8 theme-blind defense) + the
favicon 404 guard (BLK-7) + the FSM settle-gate plumbing.

## NB — the REVISE was largely in place at lane start; what THIS lane added/fixed

The executable assertions were already inverted by an earlier pass in the session (the SHAPE
invert at `:226-269`, the re-instantiation faithfulness block at `:296-389`, the carries-own-
color theming replace at the browser half). This lane VERIFIED them against the live assets +
`084feb9` (all four originals confirmed faithful) and closed the remaining gaps:

- **no-raster RELAX (clause 4) — was NOT honored.** The allow-list permitted ONLY the favicon;
  the contract's §Hard gate + clause (4) mandate the gate PERMIT the enumerated re-instantiated
  original rasters `{cube,amiga,square}-icon-sm.png` BY NAME (the contract-sanctioned keep-as-PNG
  1:1 route — `H.W10.md §S1 / §WHAT`: *"MAY stay as their original PNG files (the most literal
  re-instantiation)"*). FIXED: added `REINSTATED_ORIGINAL_PNGS` to the allow-list. The impl chose
  the embed (no raw PNG on disk) so the allow-list stays unexercised on HEAD — but the gate now
  matches the spec, and the killed dock/screenshot PNG lineage stays forbidden. Verified BOTH
  directions: a kept `cube-icon-sm.png` → green; a stray `amiga-icon-lg.png` (the screenshot
  lineage) → red.
- **the NEW-glyph browser probe — added.** The browser half probed cube (raster, exempt) +
  easing (baked-hue vector) but NOT one of the 3 NEW token-driven glyphs. Added a `spring` probe
  (a `var(--color-progress)` glyph): KEEPS the `<img>`-vs-inline structural bite for the NEW
  family AND proves the TOKEN-resolution path in the browser (a stale/absent token would fall
  back to currentColor and RED). Verified: spring stroke resolves to `rgb(33,196,93)` (light) /
  `rgb(83,198,125)` (dark), both ≠ host currentColor.
- **stale W5 doc/CI prose — corrected.** The file header (`:1-79`), the banner `console.log`,
  the no-raster section comment, and BOTH ci.yml step lines (the comment block `:476-491` + the
  `name:` `:492`) still described the W5 monochrome-currentColor family. Rewritten to the H.W10
  REVISE (expressive color + re-instantiation 1:1 + relaxed no-raster + carries-own-color).

## BITE verification (the §Mandate "no vacuity" bar — each proven)

| Clause | Break injected | Gate result |
|--------|----------------|-------------|
| (2) MONOCHROME INVERSION | flip `easing.svg` → `stroke="currentColor"` only | RED (shape + re-instantiation), exit 1 |
| (1) RE-INSTANTIATION (easing) | keep colorful but redraw the curve geometry | RED (not byte-identical to 084feb9), exit 1 |
| (2) NEW-icon color (static) | make `spring.svg` currentColor-only | RED (shape), exit 1 |
| (1) RE-INSTANTIATION (raster) | re-encode `cube.svg`'s embedded pixels | RED (pixels ≠ 084feb9 source), exit 1 |
| (4) NO-RASTER (forbidden) | drop a stray `amiga-icon-lg.png` | RED (non-allow-listed .png), exit 1 |
| (4) NO-RASTER (permitted) | drop the enumerated `cube-icon-sm.png` | GREEN (allow-listed by name), exit 0 |
| (2) NEW-icon color (browser) | spring currentColor-only, rebuilt, KF_REQUIRE_BROWSER=1 | RED (shape + browser spring carries-own-color), exit 1 |

Each restored → GREEN, exit 0. The favicon (currentColor + prefers-color-scheme) is correctly
EXCLUDED from the SHAPE family by basename (the allow-listed standalone-document exception).

## Faithfulness ledger (re-verified this lane against 084feb9)

- `084feb9` REACHABLE (`git cat-file -t` → commit).
- `easing.svg` — BYTE-identical to `084feb9:assets/icons/easing-icon-sm.svg` (`cmp` empty); the
  original `hsl(248,88%,71%)` violet stroke + the two opacity-0.4 violet endpoint dots, NOT the
  W5 currentColor flip.
- `cube/amiga/square.svg` — the decoded base64 `<image>` is byte-equal to
  `084feb9:assets/icons/{…}-icon-sm.png` (1147B / 2671B / 1561B), pixel-identical 1:1 embeds.
- The 3 NEW (spring/sequence/motion-path) — colorful: spring `var(--color-progress)` +
  `var(--rainbow-green)`; sequence the violet→blue→cyan→green rainbow stagger; motion-path
  `var(--rainbow-cyan)` (the DRY `motionPathGeometry` PATH_D). All with a `currentColor` fallback
  (robust, never blank) — the `var(--*-)` reference satisfies the TOKEN clause.

## Wiring

- `package.json:97` — `"proof:scene-icons": "node scripts/proof-scene-icons.mjs"` (unchanged) +
  in the `proof:all` chain `:112` (unchanged).
- `.github/workflows/ci.yml:476-495` — the comment block + the `name:` updated to the H.W10 G1
  description; `KF_REQUIRE_BROWSER: "1"` RETAINED (the browser theming clause cannot pass
  vacuously; settle-gated on the H.W1 FSM resting via the shared serveDist+navByHash plumbing).

## Reconcile / precepts

- **DRY / KISS** — the REVISE re-uses the EXISTING harness idioms (serveDist + Playwright +
  navByHash + the KF_REQUIRE_BROWSER skipOrFail), no new harness. The spring probe re-uses the
  shared `probeSceneIcon`.
- **NO legacy beside replacement** — the W5 monochrome-enforcement clauses are REWRITTEN in
  place (the baked-color rejection → a colored-or-tokened requirement; the host-color equality →
  carries-own-color); no dead W5 clause left behind.
- **MEASURE-FIRST** — every faithfulness assertion compares the LIVE asset to the `084feb9`
  git blob (byte/pixel), not a hand-typed expectation; every color assertion reads the COMPUTED
  paint from a mounted icon, not the source string.
- **inv-16** — gate-only lane; no engine source, no glass-ui patch, no dist commit.
- **Settle-gate** — the browser half rests on the FSM `activeScene` before probing (the H.W1
  machine-backed nav fixed point), shared with proof-scene-machine-irrefragable.

## Caveat for downstream (H.W8 golden capture)

The dist/gh-pages was rebuilt (`npm run gh-pages`, `✓ built`) to carry the current H.W10 icons
so the browser half tests the real rendered family. The favicon hashes to
`./assets/favicon-lzj0QcBq.svg` in the built artifact (served HTTP 200, no live 404).
