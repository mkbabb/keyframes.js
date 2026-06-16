# Color-fidelity conformance — kf's oklab lerp vs CSS Color 4

> The ONE benchmark only kf can publish honestly (K.W12 ED-4): a
> CORRECTNESS conformance harness, not a throughput pissing match. It
> measures kf's UNIQUE axis — perceptual color — against the CSS Color 4
> SPEC, and is un-spinnable: it measures correctness against a spec, not
> speed against a rival.

## What this proves

kf interpolates colors in **perceptual oklab** by default. Most
JS animation libraries mix in sRGB (Motion, anime) or animate oklch
incorrectly (GSAP, per its own forums) — a two-stop `background-color`
track replayed by them DRIFTS from the perceptual path, muddying the
midpoint. kf does not.

## The measurement

For each color pair, the harness animates `background-color: from → to`
through the REAL engine (`CSSKeyframesAnimation`, oklab colorSpace),
samples the **midpoint** of kf's playback (`interpFrames(0.5)`), and
compares it by **ΔE-OK** against the CSS Color 4 reference midpoint
(`CSS Color 4 — color-mix(in oklab) midpoint`), computed by the PUBLISHED producer (`@mkbabb/value.js deltaEOK + mixColors` — kf consumes it, it does not re-author it).

**Conformance threshold:** the just-noticeable difference `DELTA_E_OK_JND = 0.02`. A midpoint ΔE under the JND means kf's lerp is perceptually
**indistinguishable** from the CSS Color 4 reference.

## Results

| from | to | midpoint ΔE-OK | under JND? | pair |
| --- | --- | --- | --- | --- |
| `#C462D8` | `#E85252` | 1.57e-16 | ✓ | the canonical chromatic pair (orchid → coral; the lane's headline) |
| `#FF0000` | `#0000FF` | 5.55e-17 | ✓ | red → blue (the maximal cross-hue sweep; RGB mixing drifts hardest) |
| `#00FF00` | `#FF00FF` | 1.11e-16 | ✓ | green → magenta (complementary; a perceptual mid no sRGB average hits) |
| `#FFD700` | `#00CED1` | 0 | ✓ | gold → dark-turquoise (warm → cool across the chroma plane) |
| `#1A1A1A` | `#E0E0E0` | 0 | ✓ | near-black → near-white (the achromatic ramp; the easy case) |
| `#2E8B57` | `#FF6347` | 0 | ✓ | sea-green → tomato (mid-chroma diagonal) |
| `#4B0082` | `#FFA500` | 0 | ✓ | indigo → orange (deep cool → bright warm; a long perceptual arc) |
| `#008080` | `#800080` | 5.55e-17 | ✓ | teal → purple (equal-luminance hue rotation) |

**Conformance: PASS** — 8 pairs, worst-case midpoint ΔE-OK = 1.57e-16 (threshold 0.02). Every kf midpoint is perceptually identical to the CSS Color 4 reference (the ΔE sits at floating-point epsilon — kf's oklab lerp IS the spec path).

## Reproduce

```sh
npm run proof:color-fidelity   # gate: re-measure + verify this table
npm run bench:color-fidelity   # re-measure + re-render this artifact
```

The corpus is `test/fixtures/color-fidelity-corpus.ts`; the gated
measurement is `test/color-fidelity.test.ts`; the producer is value.js's
`deltaEOK` (the SAME kernel K.W10's CC-2 densify pixel-proof consumes —
one producer, two consumers, both RIPE).
