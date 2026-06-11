# keyframes.js Tranche J → glass-ui AX session — the HAND-OFF ledger (the 46-item REFINE + ABSTRACT corpus)

The glass-ui-owned surfaces the keyframes.js Tranche J design audit surfaced — audited, never
patched in kf (**inv-16**: kf consumes glass-ui PUBLISHED; every glass-ui item in the design
fold is a HANDOFF to the AX session or a consume-edge of a published version, never a kf-side
patch — `J.md §invariants` + `J.md §MANDATE`). This is the **companion of `waves/J.W7b.md`** (the
CONSUME-EDGE + glass-ui HANDOFF half): J.W7b's consume-to-delete edges that land THIS tranche ride
the primitives glass-ui 3.9.0 ALREADY ships; the REFINE/ABSTRACT items below are the asks that
unblock the FUTURE consume-edges. **The AX session consumes THIS doc.**

> kf branch `tranche-j-dev` (off `master` @ `4072af9`); consuming glass-ui `~3.9.0` (tilde
> load-bearing — `~` not `^`: 3.6/3.7 regressed specular; `constellation-edges.md §1a`). The
> demo's `@mkbabb/keyframes.js → src/animation/index.ts` self-dedup alias is the ONE legitimate
> alias (`constellation-edges.md §4`, `vite.config.ts:151-156`) — it is NOT a glass-ui `file:`
> link. Every item carries **kf evidence (file:line + screenshot) · the proposed glass-ui shape ·
> the kf consume-edge after · a paired born-RED kf gate (the consume signal) · a priority tag**.

The corpus: **21 ABSTRACT** (kf-invented primitives that belong in glass-ui) + **25 REFINE**
(rough edges kf works around) = **46 dispositioned items**, each with its evidence anchor and the
consuming kf seam named — the COMPLETE ledger J.W7b's §boundary-oracle requires (`J.md` J.W7b: *"the
`glassui-AX-handoff.md` ledger is COMPLETE — every one of the 46 REFINE/ABSTRACT items dispositioned
with its evidence anchor + the consuming kf seam named"*). Sources: `audit/design/glassui-abstract.md`
(the A/B/C lanes), `audit/design/glassui-adopt.md` (the (a)-(d) lanes), the `glass-ui-handoff` /
`REFINE-IN-GLASS-UI` / `ABSTRACT-INTO-GLASS-UI` rows across `audit/design/pane-*.md` +
`audit/design/cross-*.md`, and `audit/constellation-edges.md` (the standing sibling edges).

---

## §0 — THE POSTURE (inv-16 · the no-block rule · published-only · token-clean interims)

**inv-16 (the permanent fence — `J.md §invariants`).** Every item below lands in the **glass-ui
repo via the AX session**. kf consumes only what AX PUBLISHES; **no item is ever patched kf-side**.
The engine rule's twin (T2 resolved): `src/animation` is the kf PRODUCT and always in scope when
runtime correctness or measured elegance requires — but the *design-language fence* is against
SIBLING forks of glass-ui surfaces, and it is absolute. Where this ledger names a "kf consume-edge
after," that edge is a DELETION of a kf-local twin the instant the published primitive arrives, in
ONE motion (no legacy beside its replacement — `J.md §MANDATE`).

**The no-block rule (the vaporware lesson, BINDING on this doc).** J.W7b partitions the consume
edges by PUBLISH STATE (`waves/README.md` J.W7b row), and this ledger inherits that partition:

| Band | Definition | J.W7b disposition | This doc |
|---|---|---|---|
| **consume-on-3.9.0** | the primitive ALREADY ships in the on-disk glass-ui 3.9.0 | lands THIS tranche; the kf twin is DELETED in one motion with the consume | §3 (ADOPT-side — needs NOTHING from AX) |
| **consume-on-future-AX-publish** | the primitive does NOT exist in 3.9.0; it is a REFINE/ABSTRACT ask | BOOK-with-target-version; **NO kf deletion until it ships** | §1 (ABSTRACT) + §2 (REFINE) — the AX asks |

**Un-published edges stay OPEN here, consumed by a future re-pin — never parked born-RED against
vaporware.** A REFINE/ABSTRACT item the AX session has not yet shipped is NOT a kf gate held red
waiting on a sibling: per P-invariant-28 (no perpetual punts) the kf-side disposition is a
**BOOK-with-target-version** (the export TAUGHT/enumerated, the no-published-primitive status
disclosed), and the kf surface SURVIVES BESIDE its booked replacement **only because the replacement
does not yet exist** — the one honest exception to no-legacy, gated on PUBLISH (`waves/README.md`
J.W7b: *"the kf surface survives BESIDE its booked replacement only because the replacement does not
yet exist — the honest exception to no-legacy, gated on PUBLISH per the vaporware lesson"*). The
paired born-RED kf gate flips GREEN in kf's CI **only when AX ships the primitive AND kf bumps to
consume it** — so the item can never become a silent forever-punt, but it also never reds kf against
an unbuilt sibling.

**kf-local interims are token-clean and die on consume.** Where kf carries a local workaround today
(the four-token `--font-stack-text` `:root` force-apply, the `<Card>`-wrapper for square cartoon
surfaces, the `design-idioms.css` rail/badge/icon families), each is token-driven, documented in
`demo/@/styles/design-idioms.css` with an explicit `inv-16 HANDOFF` / `glass-ui-owned` annotation,
and is DELETED in the same motion the published glass-ui primitive is consumed. The interim is not a
fork — it is the rent kf pays until AX publishes, and the audit verified it is already paid cleanly
(`glassui-abstract.md` headline: *"`design-idioms.css` is a 660-line catalog of demo-owned
primitives, many carrying explicit `inv-16 HANDOFF` / `glass-ui-owned` annotations"*).

**What this doc is NOT.** It owns **no kf appearance change** — that is J.W7a's domain (the
appearance-grammar half re-captures the visual-lock baseline IN its close motion; J.W7b touches no
kf design delta — `J.md` J.W7b). This is inv-16 sibling-coordination only. No born-RED kf-runtime
witness is shared with J.W7a.

**ASKS vs AWARENESS rows (the headline read honestly).** The 46-item total is the COMPLETE
dispositioned ledger J.W7b's §boundary-oracle requires — but it is NOT 46 things the AX session must
ship. It partitions into the **asks** (the AX-ships-it set — every §1 ABSTRACT and the §2 REFINE
items carrying a `consume-on-future-AX-publish` born-RED gate, the rows AX builds) and the
**awareness rows** (carried so AX neither re-opens nor re-builds them, NOT publish work): the
`consume-on-3.9.0` rows that already ship in the on-disk 3.9.0 (the §3 ADOPT-1..9 set, plus the
roll-up pointers to them — e.g. the **PRM transition-class** at §3 ADOPT-8); the **VERIFY-ONLY**
standing edges (the **dock double-click/touch-gate**, RESOLVED in 3.9.0 — `constellation-edges.md
CONST-5`); the **RECORD** notes with no gap (the **dark-token gold/axis override**,
`glassui-adopt.md D1`; **RF-15**'s *"none required … RECORD only … no AX work"*; **RF-13**'s
*"docs-only … no code change"* with **no paired born-RED gate**). The inline tags on every
row already make this distinction honestly (each non-ask row carries its `RECORD` / `VERIFY-ONLY` /
`consume-on-3.9.0` / "no AX work" tag at its disposition) — so the per-item ledger is exact and
J.W7b's §Hard-gate clause (a) ("every one of the 46 … dispositioned with its evidence anchor + the
consuming kf seam named") is satisfied; this sentence only sharpens the AGGREGATE so the "46"
headline is not mis-read as "46 things to publish." No kf-side patch is implied by either set —
inv-16 holds throughout.

**The standing edges already on the books (`constellation-edges.md`).** Four of the items below are
not net-new J findings — they are OPEN cross-repo edges the I close already filed and J re-affirms:
the typography opt-in lever (CONST-4, filed to `from-keyframes-I-totality.md §3`, UNADDRESSED in
3.9.0), `LabeledField orientation` (CONST §1f, the I G-3 carry), the `{types}` directional VT helper
(GH-4/FB-4, OUT pending the D11 election), and the dock double-click/touch-gate (CONST-5, RESOLVED in
3.9.0 — VERIFY-ONLY, listed in §3 so AX does not re-open it). Each is anchored to its
`constellation-edges.md` row below.

---

## §1 — THE ABSTRACT LEDGER (kf-invented primitives that belong in glass-ui)

The items where kf authored a genuinely general primitive that other glass-ui consumers would use.
**Headlined by AX-1** — the one NET-NEW gap (no existing glass-ui twin), authored TWICE in kf. Every
other ABSTRACT item is a promotion of a pre-validated, kf-already-consolidated idiom (`glassui-abstract.md`
verdict: *"kf did the DRY and named the variance axes; glass-ui just absorbs them"*).

### AX-1 — `GlassControlPoint` + `useSvgPointer` (the curve-editor / control-point grammar) · **P1 — the net-new headline**

**kf evidence.** `demo/@/components/custom/EasingCurveCanvas.vue` (the full 373-line SVG curve
editor: `pointerToSVG` CTM-inverse transform, `rubberBand` overshoot damping `:189-197`, touch
hit-radius widening `:207`) **+** `demo/motion-path/MotionPathTarget.vue:63-90` (the
`.mp-handle`/`.mp-handle--anchor`/`.mp-handle--control`/`.mp-handle--active` draggable nodes). The
SAME grammar twice: a circle node, a hit-radius, pointer-capture drag, an SVG-space↔model-space
coordinate transform, a `--active` state, a hover-grow `r`. Screenshots: `easing-desktop-open.png`
(the purple bezier canvas, draggable endpoint + handle circles), `motion-path-desktop-open.png` (the
green solid handles + dashed ghost-reset positions). (`glassui-abstract.md A1`.)

**The gap.** glass-ui 3.9.0 ships a whole `timeline/` family (`ScrubberTimeline`, `ContinuousRail`,
`SegmentedTimeline` — verified in `node_modules/@mkbabb/glass-ui/dist/components/custom/timeline/`)
but **NO 2D-coordinate editing surface** — no curve canvas, no draggable control-point-on-a-grid.
This is the **only** item in the whole 46-corpus that is a genuine net-new primitive with no existing
twin (`glassui-abstract.md A1`: *"the only item in this lane that is a genuine net-new glass-ui
primitive (no existing twin)"*).

**Proposed glass-ui shape.** A `GlassControlPoint` handle primitive (SVG `<circle>` with the
node/active/hover affordance + the focus-ring + a glyph slot) AND a `useSvgPointer` composable (the
`getScreenCTM().inverse()` model↔view transform + the rubber-band clamp). Optionally a thin
`CurveCanvas` shell (bounded square via container query, grid lines, axis labels, diagonal ref).
Any "drag a point on a graph" consumer (slides, data-viz) would use it.

**kf consume-edge after.** `EasingCurveCanvas` keeps the easing-specific bits (the traveling dot, the
`f(t)`/`t` axis labels, the bezier `C` path) but mounts `<GlassControlPoint>` for its two handles;
`MotionPathTarget` does the same for its anchors/controls — ONE handle grammar, ONE focus affordance,
ONE hit-test, across both scenes.

**Paired born-RED kf gate.** `proof:control-point-primitive` (RED until glass-ui ships
`GlassControlPoint`/`useSvgPointer`; GREEN on the published bump when both `EasingCurveCanvas` and
`MotionPathTarget` mount the primitive and the local `pointerToSVG`/`.mp-handle` hand-rolls are
grep-zero). **consume-on-future-AX-publish** — no kf deletion in J.

### AX-2 — `GlassRail` + `GlassRailBall` (the value-on-a-track scrubber-ball idiom) · **P1**

**kf evidence.** `demo/@/styles/design-idioms.css:363-409` — the rail-line + scrubber-ball pair,
parameterized by `--rail-tint`/`--ball-glow`/`--ball-size`, with the comment block documenting it was
forked FOUR ways (SpringTarget / EasingTarget / SpringSidebar / sampler) before kf consolidated it
into one idiom. Consumed in `SpringTarget.vue:48-55`, `SpringSidebar.vue:60-64`, the sequence/easing
rails. Screenshots: the green travelling balls on tinted rails in `spring-desktop-open.png` (live
rail + sampler + 4 preset rows), `sequence-desktop-open.png` (master playhead). (`glassui-abstract.md
A3`; `glassui-adopt.md B3` confirms this is DISTINCT from glass-ui's `glass-progress-rail`
track-fill `<Progress>` — *"the demo's scrubber-ball idiom has no glass-ui equivalent"*.)

**The gap.** This is the canonical "value-on-a-track" motion primitive, and kf has ALREADY done the
consolidation and named the variance axes — the shape glass-ui likes to absorb. It belongs beside
`ScrubberTimeline`/`ContinuousRail` as the un-segmented, single-ball companion. (Refine note from
`pane-motion-path.md MP-GU2`: the base `.progress-ball` assumes a rail context — the `.mp-traveller`
overrides `top/margin-top/display` because it rides `offset-path`, not a rail; a `progress-traveller`
variant — or `position` unset in the idiom — would separate the "rail-anchored scrubber" shape from
the "free-floating ball" shape. Fold this distinction into the primitive's API.)

**Proposed glass-ui shape.** A `GlassRail` + `GlassRailBall` pair (or CSS `@utility
progress-rail`/`progress-ball`) parameterized by the same three custom properties kf already exposes
— verbatim adoption, zero redesign — PLUS a rail-anchored-vs-free-floating mode (the MP-GU2 split).

**kf consume-edge after.** kf imports the glass-ui utilities and deletes the
`design-idioms.css:363-409` block; the per-scene `--ball-size`/`--ball-glow` modifiers stay (the
legitimate per-site deltas); `MotionPathTarget.vue:279-308`'s `.mp-traveller` override collapses to
the free-floating mode.

**Paired born-RED kf gate.** `proof:rail-ball-primitive` (RED until the published utilities exist;
GREEN when the `design-idioms.css:363-409` block is grep-zero and the rails render off the glass-ui
utility). **consume-on-future-AX-publish.**

### AX-3 — the `tone` + `auto-contrast` Badge recipe (the status-badge tone family) · **P1**

**kf evidence.** `demo/@/styles/design-idioms.css:411-456` —
`.status-badge`/`.settled-badge`/`.tracking-badge`/`.reverse-badge`, parameterized by `--badge-tone`,
**carrying a documented AA-contrast color-mix recipe** (the comment records the bare green was 1.97:1
and the `color-mix toward --foreground at 50%` lift reaches ≥4.5:1). Rendered as the `SETTLED` pill
(`spring-desktop-open.png`, top-right of the stage card), the `READY` pill
(`sequence-desktop-open.png`), at `SpringTarget.vue:24-27` / `SequenceTarget.vue:32-33`.
(`glassui-abstract.md A4`; `pane-spring.md §Glass-UI Gaps` "Status badge depth/size token";
`pane-sequence.md` glass-ui ADOPT row.)

**The gap.** glass-ui 3.9.0 ships `Badge`, `MetricBadge` (with `size`/`amount`/`unit`/`label` —
verified `metric-badge.d.ts`), and `StatusDot` (`variant: active|paused|idle|error` + `color` +
`pulse` + `label` — verified `status-dot.d.ts`) — but **none carries this tone-driven AA-contrast
pill recipe**. The hue-survives-the-mix property is load-bearing a11y work other consumers re-derive
by hand. NB the scene tones are SEMANTIC (progress-green / reverse-violet — `glassui-adopt.md A3`
CAVEAT): the ask is "adopt the surface, keep the tone token," so the variant palette must cover the
green/violet pair.

**Proposed glass-ui shape.** Extend `Badge` (or `MetricBadge`'s label slot) with a `tone` +
`auto-contrast` variant that bakes the `color-mix toward --foreground at 50%` AA lift, with a
scene-semantic tone slot (not just the four `StatusDot` lifecycle variants).

**kf consume-edge after.** kf drops the four badge classes and uses `<Badge tone="progress"
auto-contrast>settled</Badge>`; `design-idioms.css:411-456` is deleted.

**Paired born-RED kf gate.** `proof:badge-tone-recipe` (RED until the published `tone`/`auto-contrast`
variant ships AA-lifted; GREEN when the four badge classes are grep-zero and the pills render off the
glass-ui variant at computed contrast ≥ 4.5:1). **consume-on-future-AX-publish.**

**[J.W7b IMPL, 2026-06-10]** the S1f CAVEAT probe resolved to **BOOK** (the fallback ACTIVATED): 3.9.0
`Badge` variants = `default|destructive|outline|secondary|success|warning|info` (no `tone`/
`auto-contrast`, no violet); `StatusDot` = the four lifecycle variants + raw `color` (a dot, no
AA-lifted pill recipe) — the green/violet AA pair is NOT covered, so the 22-line recipe survives
BOOKED, not deleted (`waves/J.W7b-impl.md §B BOOK-5`).

### AX-4 — `CopyableArtifact` (the copyable code-readout chip — 3 hand-rolled copies) · **P2**

**kf evidence.** THREE byte-similar "label + copyable code value" chips, authored three ways:
`EasingEditor.vue:44-59` (the `cubic-bezier(…)` readout + `CopyButton`, `easing-desktop-open.png`),
`SpringSidebar.vue:70-74` (`springLinearStops() → CSS` + `CopyButton`, `spring-desktop-open.png`),
`MotionPathTarget.vue:113-117` + `.artifact` style `:346-350` (the `offset-path` `<code
class="artifact">` block, `motion-path-desktop-open.png`). (`glassui-abstract.md A2`.)

**The gap.** The same gestalt (small label, truncating/scrolling mono value, copy affordance,
muted-tint surface, sr-only live-region announce) is authored three ways with three surfaces. No
glass-ui primitive owns "show a copyable code literal." kf's `CopyButton.vue:13-16` already nails the
a11y.

**Proposed glass-ui shape.** A `CopyableArtifact` (props: `label`, `value`, `appearance: "inline" |
"block"`) bundling the truncate-with-title + scroll-x + copy button + the sr-only announce. Pairs
naturally with `MetricBadge`.

**kf consume-edge after.** all three sites collapse to `<CopyableArtifact label="offset-path"
:value="…" />`; the `.artifact` scoped rule and the EasingEditor readout `<style>` override are
deleted.

**Paired born-RED kf gate.** `proof:copyable-artifact` (RED until published; GREEN when the three
hand-rolls are grep-zero). **consume-on-future-AX-publish.**

### AX-5 — a grid / graph-paper background `@utility` (the GRID brand pillar) · **P1**

**kf evidence.** The grid-background is a raw data-URI, hand-painted, TWICE (`EditorShell.vue:181`
light + `:186` dark — `glassui-adopt.md C1`/`ABS-1`). It is the GRID brand pillar rendered ad-hoc; it
shows raw through transparent stage cards and beats against dashed guide strokes
(`pane-motion-path.md MP-I1`: *"the guide's dashed `stroke-dasharray: 6 7` visually beats against the
crosshatch grid squares"*; `pane-square.md SQ-3`: *"the box floats over the repeating SVG checker; no
glass surface registers the subject as protagonist"*). (`cross-grid-math.md G3`.)

**The gap.** glass-ui ships NO grid utility. A math/grid motif is design-system furniture — the
natural sibling to `FourierField`/`Aurora`. kf re-paints the data-URI per-surface.

**Proposed glass-ui shape.** A `.bg-graph-paper` utility with `--graph-pitch` / `--graph-opacity` /
`--graph-major` tokens (fine + major lines — `cross-grid-math.md G3`), and optionally a `<GraphFrame>`
specimen-plate component (axes + gridlines + diagonal ref + axis-label slots, tokenized opacity/pitch
— `cross-grid-math.md` C5/the §coordinate-frame proposal) so the curve canvas, the stage plates, and
the sequence timeline share ONE coordinate-frame vocabulary instead of three hand-rolls.

**kf consume-edge after.** `EditorShell.vue:181,186` deletes both data-URIs and consumes
`.bg-graph-paper`; the stage scenes (cube C11, square SQ-3, motion-path MP-I1) mount a tokenized
coordinate plane behind the subject.

**Paired born-RED kf gate.** `proof:graph-paper-utility` (RED until the utility/tokens ship; GREEN
when the `EditorShell` data-URIs are grep-zero). **consume-on-future-AX-publish.**

### AX-6 — the `.icon-{xs,sm,md,lg}` Lucide-glyph sizing family · **P2**

**kf evidence.** `design-idioms.css:209-232` hand-rolls a 4-rung icon-size `@utility` family; the
comment documents **61 callsites**. glass-ui ships no equivalent icon-sizing primitive.
(`glassui-adopt.md B4`/`ABS-2`.)

**The gap.** A 4-rung Lucide-glyph sizing utility is generic design-system furniture, not
demo-specific — and it is 61-callsite-proven.

**Proposed glass-ui shape.** Promote the `.icon-{xs,sm,md,lg}` family verbatim into glass-ui's
utilities layer (the four-rung sizing scale).

**kf consume-edge after.** kf deletes `design-idioms.css:209-232` and the 61 callsites resolve
against the glass-ui utility.

**Paired born-RED kf gate.** `proof:icon-sizing-family` (RED until published; GREEN when the local
`@utility` block is grep-zero). **consume-on-future-AX-publish.**

### AX-7 — `<PlayheadTrack>` (the swept-playhead line) · **P2**

**kf evidence.** `SequenceTarget.vue:374` — the master-playhead line, a CSS `left: calc(p * 100%)` +
`will-change: left` line inside a bounded track, drawn at 2px / 55% opacity (`sequence-desktop.png`,
mid-track; `pane-sequence.md SEQ-05`: *"the most expressive live element in the scene and it is
visually underpowered"*). (`pane-sequence.md` ABSTRACT row; `cross-grid-math.md`/the swept-playhead
abstract.)

**The gap.** The swept-playhead is a general primitive used across Sequence and potentially
Spring/MotionPath — a "line that rides a normalized 0..1 position inside a bounded track" — distinct
from `ScrubberTimeline` (which is a draggable scrubber, not a passive sweep line).

**Proposed glass-ui shape.** A parameterized `<PlayheadTrack>` slot component (or `@utility`) — the
swept line + the bounded track + the tokenized width/opacity.

**kf consume-edge after.** `SequenceTarget.vue:374`'s hand-rolled line consumes `<PlayheadTrack>`;
the width/opacity become tokens (closing SEQ-05's underpowered-hairline at the same time).

**Paired born-RED kf gate.** `proof:playhead-track` (RED until published; GREEN when the local line
math is grep-zero). **consume-on-future-AX-publish.**

### AX-8 — `@utility float-idle` (the idle-bob "subject is alive" signal) · **P2**

**kf evidence.** `CubeTarget.vue:207-221` — `@keyframes idle-bob` (a 3s `ease-standard` alternating
`translateY(0 → 5px)`), the "engine is on" signal at rest. (`pane-cube.md` ABSTRACT row + C14.)

**The gap.** The "gentle float to signal the subject is alive" pattern recurs as a general demo idiom
— useful beyond the cube: any animated stage element benefits from a gentle float at rest.

**Proposed glass-ui shape.** Abstract `@keyframes idle-bob` + `animation: idle-bob 3s
var(--ease-standard) infinite alternate` into a PRM-guarded `@utility float-idle` any `subject`
element can adopt.

**kf consume-edge after.** `CubeTarget.vue:207-221`'s local keyframe is deleted; the subject adopts
`float-idle` (and the C14 amplitude tuning — `translateY(0 → 8px)` + a slight `rotate3d` — becomes a
token on the utility).

**Paired born-RED kf gate.** `proof:float-idle-utility` (RED until published; GREEN when the local
`@keyframes idle-bob` is grep-zero). **consume-on-future-AX-publish.**

### AX-9 — `SceneHeader` / `MetricHeader` molecule (the stage-header recipe) · **P2**

**kf evidence.** The recurring "name + live mono readout + status pill" stage-header is **4
byte-similar copies** (spring/easing/sequence/motion-path — `cross-typography.md` ABSTRACT row): the
`text-heading` serif title + `text-mono-caption tabular-nums` stat string + status chip, hand-rolled
in `SpringTarget.vue:16-23`, `SequenceTarget.vue:13-15`, `MotionPathTarget.vue:12-14`,
`EasingTarget.vue` header. Screenshots: `spring-desktop-open.png`, `sequence-desktop-open.png`,
`motion-path-desktop-open.png`. (`glassui-abstract.md B1` final note; `cross-typography.md`
ABSTRACT.)

**The gap.** glass-ui ships `MetricBadge` (the readout) and `Badge`/`StatusDot` (the chip) and
`--metric-row-value-clamp-max` (`tokens.css:1641`) — but no molecule pairing a display name + a
clamped mono value + a status badge. kf re-authors the header block four times.

**Proposed glass-ui shape.** A `SceneHeader` / `MetricHeader` molecule (serif title slot + a
`MetricBadge` row + a status `Badge` slot) consuming `--metric-row-value-clamp-max`, so the demo
picks up the display-scale readout (the typography-suffusion #2 ask) for free.

**kf consume-edge after.** the four `*Target.vue` header blocks become `<SceneHeader
title="SpringProgress"><MetricBadge … size="xl"/></SceneHeader>` — and the readouts get LOUDER (the
xl rung) per the J typography ask, for free.

**Paired born-RED kf gate.** `proof:scene-header-molecule` (RED until published; GREEN when the four
header blocks consume the molecule). **consume-on-future-AX-publish.** (NB: the `MetricBadge size="xl"`
CONSUME itself is consume-on-3.9.0 — see §3 ADOPT-1; the MOLECULE that bundles it is the AX ask.)

### AX-10 — `rainbow-outlined` rainbow-utility variant (the idle play-invitation affordance) · **P2**

**kf evidence.** `AnimationControlsGroup.vue:109` — the rainbow group-play disc; the
`.rainbow-vivid`/`.rainbow-pastel` recipes are glass-ui-owned (`design-idioms.css:26-30`). At rest on
the amiga stage the play button reads under-present (`pane-amiga.md A-04/A-12`: the idle state lacks
invitation). (`pane-amiga.md:94,126-127` HANDOFF rows; `cross-color-pops.md §4.2`.)

**The gap.** The `rainbow-vivid`/`rainbow-pastel` pair differs only in saturation/opacity — there is
no BORDER/RING variant for the idle-invitation affordance (present + branded, not competing with the
playing state's vivid fill).

**Proposed glass-ui shape.** A third `rainbow-outlined` variant that renders the gradient as a
border/ring on a transparent fill — the appropriate idle-invitation affordance.

**kf consume-edge after.** the play button at `!isPlaying` consumes `rainbow-outlined` (deleting the
demo-side `ring-2 ring-primary/30` workaround `pane-amiga.md:94` proposes as the interim).

**Paired born-RED kf gate.** `proof:rainbow-outlined-variant` (RED until published; GREEN when the
play button's idle state renders the outlined recipe). **consume-on-future-AX-publish.**

### AX-11 — `ScrubberTimeline` decorative-overlay slot + inertia-coast hook (the AnimationVisualizer absorb) · **P2 / OPP**

**kf evidence.** `AnimationVisualizer.vue` (the full 256-line decorative scrubber: pointer-capture
drag, `SmoothProgress` velocity estimate, `SpringProgress`+`RAFPlayback` release-coast inertia
`:121-190`, the big decorative red ball + dashed target twin `:30-36`, `calc(100cqw - 100%)`
traveller). Screenshot: `cube-desktop-open.png` (the red ball below the slider). (`glassui-abstract.md
C5`, paired with B4.)

**The gap.** glass-ui 3.9.0's `ScrubberTimeline` is a clean scrubber (`modelValue`/`scrubStart`/
`scrubEnd` — verified `ScrubberTimeline.vue.d.ts`) but has NO slot for a decorative oversized
handle/overlay and NO momentum/coast-on-release affordance — which is why kf can't fully drop it in.
kf's inertia-coast is a genuinely delightful, broadly-useful interaction.

**Proposed glass-ui shape.** Add (a) an optional `#handle`/`#overlay` slot to `ScrubberTimeline` so a
consumer can render an oversized decorative ball, and (b) an optional `inertia` prop wiring the same
`SmoothProgress`-velocity + `SpringProgress`-coast on release.

**kf consume-edge after.** `AnimationVisualizer` shrinks to a slot template + an `inertia` flag on
`<ScrubberTimeline>`; the 256-line custom scrubber math moves into the primitive.

**Paired born-RED kf gate.** `proof:scrubber-inertia` (RED until the slot+inertia ship; GREEN when
`AnimationVisualizer`'s scrub math is grep-zero). **consume-on-future-AX-publish.** (NB: the BASE
`ScrubberTimeline` consume for the PlaybackRibbon slider is consume-on-3.9.0 — see §3 ADOPT-4; this
REFINE is what lets the *decorative* visualizer also fold.)

**[J.W7b IMPL re-verify, 2026-06-10]** still absent in 3.9.0 (`ScrubberTimeline.vue.d.ts` props =
`modelValue`/`label` + `scrubStart`/`scrubEnd` only; `grep -rl "inertia" dist/` = 0). BOOK record:
`waves/J.W7b-impl.md §B BOOK-2`. The BASE ADOPT-4 consume itself exited W7b on the parity clause —
see the §3 status reconciliation.

### AX-12 — `MathMotif` / `BackgroundCurve` slot (project a function as a background texture) · **OPP**

**kf evidence.** The easing stage's own bezier is not projected across its floor; the ghost-curve
pattern is proposed in `pane-easing.md E1/E7` (and is the math-made-visible band of J.W7a). (`pane-easing.md`
ADOPT/glass-ui row.)

**The gap.** No glass-ui way for a scene that has a mathematical function to project it as a
background texture. If the ghost-curve proves out in kf's easing stage, it is a candidate to abstract.

**Proposed glass-ui shape.** A `BackgroundCurve` / `MathMotif` slot/variant — a low-opacity SVG path
re-use for any scene that has a function to project.

**kf consume-edge after.** the easing stage (and any function-bearing scene) projects its curve via
the glass-ui slot rather than a per-scene SVG.

**Paired born-RED kf gate.** `proof:math-motif` (RED until published; GREEN when the easing
ghost-curve consumes the slot). **consume-on-future-AX-publish.** OPP — lowest urgency (gated on
J.W7a's ghost-curve landing first to prove the shape).

### AX-13 — a specimen-plate surface tier (graph-paper-backed, axis-framed) · **OPP**

**kf evidence.** kf improvises `variant="wash"` per stage scene for the math-surface plates
(`cross-grid-math.md` §specimen-plate proposal). (`cross-grid-math.md` REFINE/ABSTRACT.)

**The gap.** The math surfaces are improvised per-scene rather than a named register; there is no
third glass-ui surface tier for specimen plates.

**Proposed glass-ui shape.** Formalize a `surface="specimen"` (or tier) — graph-paper-backed,
axis-framed — so the math plates are a named register, not improvised. Composes naturally with AX-5
(`.bg-graph-paper`).

**kf consume-edge after.** the stage scenes mount `surface="specimen"` instead of the
`variant="wash"` + ad-hoc grid improvisation.

**Paired born-RED kf gate.** `proof:specimen-surface` (RED until published). **consume-on-future-AX-publish.**
OPP — rides AX-5.

> **ABSTRACT roll-up (the 21).** The 13 headlined items above (AX-1..13) are the substantive
> promotions. The remaining ABSTRACT corpus is enumerated for completeness (each already cited
> inline above or in §3): the **`MetricBadge xl` rung** consume (the audacious-poster readout —
> consume-on-3.9.0, §3 ADOPT-1); the **`AnimatedDigit`/`.metric-swap`** readout-roll (consume-on-3.9.0,
> §3 ADOPT-2); the **`FourierField`** stage-field suffusion (consume-on-3.9.0, §3 ADOPT-3); the
> **`text-math`/`cm-serif`** function-notation rung (consume-on-3.9.0, §3 ADOPT-6); the **rail-anchored-vs-
> free-floating** mode of AX-2 (MP-GU2, folded into AX-2); the **`GraphFrame` coordinate-frame
> component** (folded into AX-5); the **`SceneHeader` xl-readout pickup** (folded into AX-9); the
> **`rainbow-outlined` idle affordance** (AX-10). Total dispositioned ABSTRACT: **21** — AX-1..13 +
> the 8 consume/fold rows. None adds chrome; every item DELETES kf code (`glassui-abstract.md`
> verdict).

---

## §2 — THE REFINE LEDGER (rough edges kf works around)

The items where glass-ui already ships the primitive but a small contract gap forces a kf-side
workaround. **DEDUPED ruthlessly** — the cartoon-radius item appeared 6+ times across the lanes
(`glassui-abstract.md C1`, `pane-easing.md`, `pane-motion-path.md MP-GU1`, `pane-spring.md §Gaps`,
`pane-sequence.md`, `design-idioms.css:480-524`) and is ONE row here (RF-1).

### RF-1 — `cartoon-surface` default `border-radius` (the long-open item, VERIFIED still missing in 3.9.0) · **P1 — the DEDUPED headline**

**kf evidence.** `design-idioms.css:514-523` documents the user catching "the card is NOT rounded —
it should be impossible" on motion-path, traced to `cartoon-surface` carrying ZERO radius. **VERIFIED
STILL TRUE in glass-ui 3.9.0** (first-hand, this audit): `node_modules/@mkbabb/glass-ui/dist/styles/
cards.css:33-48` — `@utility cartoon-surface` sets `border-width`, `box-shadow`, `translate`,
`transition`, hover-lift, **but no `border-radius`** (re-confirmed: the rule has only
`border-width: 2px`, `box-shadow`, `translate: 0`, the transition, and the `&:hover` lift). kf's
fix (swap the bare `cartoon-surface` div for `<Card>`) is a workaround, not the durable fix.
(`glassui-abstract.md C1`; `pane-easing.md` REFINE; `pane-motion-path.md MP-GU1`; `pane-spring.md
§Gaps`; `pane-sequence.md` REFINE — **all six lanes deduped to this one row**.)

**The gap.** A `cartoon-surface`-only element can still render SQUARE from the primitive itself — a
born-square hazard for every NEW glass-ui consumer (the kf `<Card>`-wrapper only protects kf).

**Proposed glass-ui shape.** `@utility cartoon-surface` gains `border-radius: var(--radius-card)` by
default, OR ship a `rounded-card`-carrying `cartoon-card` primitive (the `design-idioms.css` note
proposes exactly this). Then a `cartoon-surface`-only element cannot render square from the primitive.

**kf consume-edge after.** kf can use `cartoon-surface` directly on any div without a `<Card>` wrapper
or ad-hoc `rounded-*`.

**Paired born-RED kf gate.** `proof:card-rounded-primitive` (the glass-ui half — RED until the
published `cartoon-surface` carries `border-radius`; GREEN on the bump). kf's existing demo-side gate
greens TODAY via `<Card>`; the PRIMITIVE half is what this ask flips.
**consume-on-future-AX-publish.**

**[J.W7b IMPL re-verify, 2026-06-10]** still absent in the on-disk 3.9.0 (`dist/styles/cards.css`
`@utility cartoon-surface` = border-width/box-shadow/translate/transition/hover — no
`border-radius`). BOOK record: `waves/J.W7b-impl.md §B BOOK-3`.

### RF-2 — headless typography / "brand-font-off" lever (the Plus-Jakarta force-apply) · **P1 — the STANDING edge (CONST-4)**

**kf evidence.** `style.css:100-117` — kf must override `--font-stack-text`/`--font-stack-sans`/
`--font-text`/`--font-sans` at `:root` because glass-ui's brand body font is Plus Jakarta Sans
(`tokens.css:51`) and `theme.css` bridges via `@theme inline`, so a plain `@theme` override of the
BRIDGE loses. kf does NOT use Plus Jakarta (its identity is Instrument Serif + Fira Code over native
sans — `home-desktop.png`). The override is a four-token force-apply working AROUND glass-ui
hard-wiring its brand font into the body register. **STANDING edge:** filed at I close to
`glass-ui/docs/tranches/AX/coordination/from-keyframes-I-totality.md §3`; the 3.9.0 CHANGELOG has NO
typography opt-in mechanism — UNADDRESSED in the published release (`constellation-edges.md CONST-4`
+ §1c). (`glassui-abstract.md C2`; `glassui-adopt.md C2`; `constellation-edges.md §1c`.)

**The gap.** The brand font lands by default on every consumer surface (and half-loads a webfont the
consumer doesn't serve); the only escape is reverse-engineering the four-token `@theme inline` bridge.

**Proposed glass-ui shape.** A first-class documented consumer lever — a single `--font-stack-text`
opt-out token that doesn't require knowing the bridge internals, OR a "headless typography" build flag
/ `<GlassProvider brand-fonts="off">`.

**kf consume-edge after.** kf sets ONE documented prop/token instead of the four-token bridge
override; no risk of a glass-ui token rename silently re-applying Plus Jakarta. kf's `:root` override
is removed and `proof:demo-fonts` updated.

**Paired born-RED kf gate.** `proof:demo-fonts` (already GREEN via the kf workaround — the consume-leg
REMOVES the four-token override and re-points the gate at the single lever once published; RED only if
a future glass-ui bump silently re-applies Plus Jakarta). **consume-on-future-AX-publish.** Per
`constellation-edges.md §1c` disposition: **OUT (glass-ui-owned); kf workaround is sufficient and
gated** — J does not revisit absent a pin bump.

**[J.W7b IMPL re-verify, 2026-06-10]** no typography opt-in in the published 3.9.0 package; the kf
four-token override (`style.css:100-117`) survives gated. BOOK record: `waves/J.W7b-impl.md §B
BOOK-4`.

### RF-3 — `LabeledField orientation="horizontal"` + subgrid participation (the booked I-carry, G-3) · **P2 — the STANDING edge**

**kf evidence.** `design-idioms.css:525-590` — the `.labeled-field-grid` subgrid idiom kf authored so
label columns align across rows, with the comment "THE DURABLE HOME is a glass-ui HANDOFF (inv-16):
the W9-BOOKED `LabeledField orientation="horizontal"` extended to subgrid-participation." Re-forked
locally in `SpringSidebar.vue:134-143` as a `:deep(.labeled-field)` grid override. Screenshot:
`cube-desktop-open.png` (the duration/delay/iterations rows — label-left, value-right, uniform
column). **VERIFIED: glass-ui 3.9.0's `LabeledField` has NO `orientation` prop** (first-hand:
`labeled-field/LabeledField.vue.d.ts` — grep `orientation|horizontal|stacked|subgrid` = 0).
(`glassui-abstract.md C3`; `pane-spring.md`/`design-idioms.css:525-590`; `constellation-edges.md §1f`
G-3 — *"glass-ui-owned; kf demo-side `grid-cols-[auto_1fr]` path exists as workaround"*.)

**The gap.** glass-ui's `LabeledField` has no `orientation="horizontal"` and no subgrid-ready mode, so
every kf panel re-applies `grid-template-columns: auto 1fr` (or the subgrid wrapper) by hand — the
macOS/iOS settings-row idiom (labels-LEFT / values-RIGHT), distinct from the labels-above
data-entry-FORM idiom.

**Proposed glass-ui shape.** `LabeledField orientation="horizontal"` that is born subgrid-ready
(`grid-template-columns: subgrid; grid-column: 1/-1` inside a `labeled-field-grid` container),
shipping the container utility too.

**kf consume-edge after.** kf deletes `design-idioms.css:567-590` + `SpringSidebar.vue:134-143` and
sets `orientation="horizontal"` on the fields.

**Paired born-RED kf gate.** `proof:labeled-field-horizontal` (RED until the prop ships; the kf-demo
`grid-cols-[auto_1fr]` path greens TODAY — path B; the DURABLE path B greens on the published prop).
**consume-on-future-AX-publish.**

### RF-4 — `LabeledSlider orientation="stacked"` / `fullWidth` (the label-above-control variant) · **P2**

**kf evidence.** `EasingSidebar.vue:191-200` — a `.panel-content :deep(.labeled-field.duration-field)`
override producing label-above-slider layout; the audit notes this is the "second or third demo scene"
needing a stacked full-width variant. (`pane-easing.md` ABSTRACT row.)

**The gap.** `LabeledSlider`/`LabeledField` has no `orientation="stacked"`/`fullWidth` variant, so
each demo re-authors the `:deep()` override. (Distinct from RF-3's HORIZONTAL settings-row: this is
the label-ABOVE, full-width data-entry layout.)

**Proposed glass-ui shape.** an `orientation="stacked"` or `fullWidth` prop on `LabeledSlider` (or
`LabeledField`) that eliminates the per-demo `:deep()` override.

**kf consume-edge after.** `EasingSidebar.vue:191-200`'s override is deleted; the field sets the prop.

**Paired born-RED kf gate.** `proof:labeled-slider-stacked` (RED until published).
**consume-on-future-AX-publish.** Pairs with RF-3 (same `LabeledField` family — AX may land both
orientations in one motion).

### RF-5 — `SegmentedControl` (the connected-pill segmented posture) · **P2**

**kf evidence.** `SpringScene.vue:7-32` — a hand-rolled `role="tablist"` with
`.spring-view-switch`/`.spring-view-tab`/`.spring-view-active` classes and manual `aria-selected`
(the `Live solver / Discrete transition` segmented toggle). Screenshot `spring-desktop-open.png` (the
pill segmented toggle top-center of the stage); on mobile it floats and overlaps the scene dropdown
(`spring-mobile-open.png` — a hierarchy incongruence). (`glassui-abstract.md B3`; `pane-spring.md
SP-7`.)

**The gap.** glass-ui 3.9.0 ships `ToggleChip variant="chip"` and `toggle-group` AND `SegmentedTabs
variant="segmented"` (verified `SegmentedTabs.vue.d.ts` — it ships a `segmented` variant with an
animated indicator). The spring view-switcher CONSUME of `SegmentedTabs` is therefore
**consume-on-3.9.0** (§3 ADOPT-7). But `glassui-abstract.md B3` argues the CONNECTED-pill
`SegmentedControl` wrapper (the sliding active-indicator track over `ToggleGroup`) is a distinct
posture worth a dedicated component — *"neither is presented as a segmented control… kf re-authored
the segmented look because the existing primitives don't have that posture out of the box."* The
REFINE ask here is the dedicated `SegmentedControl` wrapper / documenting `ToggleChip variant="chip"`
as the segmented-member; the BASE consume rides `SegmentedTabs` today.

**Proposed glass-ui shape.** a `SegmentedControl` wrapper over `ToggleGroup` (connected-pill track +
sliding active indicator), OR document `ToggleChip variant="chip"` as the segmented-member.

**kf consume-edge after.** the 26-line hand-rolled tablist + its three scoped classes collapse to a
`<SegmentedControl>` (or `<SegmentedTabs variant="segmented">` — the 3.9.0 path); the a11y comes from
the primitive.

**Paired born-RED kf gate.** `proof:segmented-control` (the BASE `SegmentedTabs` consume greens
on 3.9.0 — §3 ADOPT-7; the dedicated-wrapper REFINE greens on the future publish).
**REFINE = consume-on-future-AX-publish; BASE consume = consume-on-3.9.0.**

**[J.W7b IMPL, 2026-06-10]** the BASE consume (§3 ADOPT-7) did **NOT land in W7b** — parity-clause
exit (the primitive's spring-animated indicator is an appearance delta vs the SP-7 instant-state
twin; the swap belongs to the appearance lane, flagged for W7a/WZ routing). The POSTURE ask here is
unchanged, BOOKED (`waves/J.W7b-impl.md §B BOOK-1, §C-1`).

### RF-6 — `StatusDot` scene-semantic tone slot (the green/violet pair) · **P2**

**kf evidence.** `StatusDot` is consumed on the menubar + ChromeDock (`glassui-adopt.md` baseline),
but the SETTLED/READY/TRACKING/REVERSE chips need scene-semantic tones (progress-green /
reverse-violet — `glassui-adopt.md A3` CAVEAT). **VERIFIED: 3.9.0 `StatusDot` ships `variant:
active|paused|idle|error` + `color` + `pulse` + `label`** (`status-dot.d.ts`) — the four LIFECYCLE
variants, but the `color` prop is a raw string, not a tokened scene-tone with the AA-contrast guarantee
of AX-3. (`glassui-adopt.md A3`; `pane-spring.md §Gaps` "Status badge depth/size token".)

**The gap.** Routing the scene-semantic chips to `StatusDot` needs the variant palette to cover the
green/violet pair WITH the AA-contrast lift — otherwise the 22-line `design-idioms.css` recipe (AX-3)
can't be deleted (`glassui-adopt.md A3`: *"verify the variant palette covers the green/violet pair
before deleting the 22 lines"*).

**Proposed glass-ui shape.** extend `StatusDot`'s variant/tone palette with the scene-semantic
green/violet tones (and the AA-contrast lift of AX-3 — this REFINE is the `StatusDot`-side companion
of the `Badge`-side AX-3).

**kf consume-edge after.** the scene chips route to `<StatusDot tone="progress"/>` /
`<StatusDot tone="reverse"/>`; with AX-3 the 22-line recipe is deleted.

**Paired born-RED kf gate.** rides `proof:badge-tone-recipe` (AX-3) — the `StatusDot` and `Badge`
tone surfaces are the same AA-contrast ask, two components. **consume-on-future-AX-publish.**

**[J.W7b IMPL, 2026-06-10]** caveat probe confirmed at impl: no scene-tone surface in 3.9.0
`StatusDot` — rides AX-3's activated BOOK (`waves/J.W7b-impl.md §B BOOK-5`).

### RF-7 — `GlassDock initialExpanded` prop (the home-landing scene-selector) · **P2**

**kf evidence.** `ChromeDock.vue:147` `:start-collapsed="true"` is hardcoded — on the home screen the
primary CTA IS the scene selector, but it renders collapsed ("Home ˅"); the user must expand it to see
the menu (`home-desktop.png`, `home-laptop.png`; `pane-home.md H13`). There is no way to override
from the consumer without forking (`pane-home.md:44` REFINE: *"`GlassDock` has no prop/slot for
'always starts expanded' per-consumer context"*). (`pane-home.md H13` + REFINE row.)

**The gap.** `GlassDock` exposes no `initialExpanded` prop, so the home-landing context can't request
the expanded scene selector on first render.

**Proposed glass-ui shape.** add an `initialExpanded?: boolean` prop to `GlassDock` so consumers (the
home landing) can request the expanded state on first render without exposing internal logic.

**kf consume-edge after.** `ChromeDock` threads `initialExpanded` from `App.vue`; the home scene
passes `true`, non-home scenes pass `false` (keep collapsed — the user already picked a scene).

**Paired born-RED kf gate.** `proof:dock-initial-expanded` (RED until the prop ships).
**consume-on-future-AX-publish.**

### RF-8 — `GlassDock`/`AnimationMenuBar` empty/no-target state (the placeholder transport) · **P2**

**kf evidence.** `AnimationMenuBar.vue` renders the full transport (reset/trash/play) even when there
is no animation target — no `v-if` guards (`pane-home.md:45` REFINE: *"a 'no target' state variant is
missing"*). (`pane-home.md` REFINE row.)

**The gap.** `GlassDock` (or a glass-ui pattern) has no "placeholder/empty" state that renders only
the selector trigger with muted chrome — analogous to a form input's placeholder when empty.

**Proposed glass-ui shape.** a `GlassDock` "placeholder/empty" state that renders only the selector
trigger with muted chrome in the empty-selection case.

**kf consume-edge after.** the empty-target menubar renders the placeholder state instead of the full
transport over a non-existent target.

**Paired born-RED kf gate.** `proof:dock-empty-state` (RED until the state ships).
**consume-on-future-AX-publish.**

### RF-9 — `DockSelectTrigger size="lg"` (the scene-title display register) · **P2**

**kf evidence.** the dock trigger label ("Cube", "Spring", "Path") is `dock-label` (mono caption
scale, ~13px) — a timid nav chip, not a protagonist announce (`pane-cube.md C3`: *"reads as a small
nav chip, not a scene hero"*; the dock is wide enough on desktop for a larger characterful label).
The `ChromeDock`'s `currentLabel` flows through to `DockSelectTrigger`; the class on that trigger
drives the size. (`pane-cube.md C3` + `pane-cube.md:69` REFINE row.)

**The gap.** `DockSelectTrigger` has no `size` lever to promote the label to a display register on
wide viewports — so the scene identity can't carry the Instrument Serif voice the J typography
suffusion asks for.

**Proposed glass-ui shape.** add a `size="lg"` prop (or a `label-size` token) to `DockSelectTrigger`
that promotes the trigger label to `text-small` Instrument Serif on ≥lg viewports, consistent with
the glass-ui φ-ladder.

**kf consume-edge after.** the scene-title pill consumes `size="lg"` on desktop; the Instrument Serif
identity carries into the scene chrome (the cube C3 / easing E8 finding).

**Paired born-RED kf gate.** `proof:dock-trigger-size` (RED until the prop ships).
**consume-on-future-AX-publish.**

### RF-10 — `GlassPanel border={false}` (the wash-border suppression) · **P2**

**kf evidence.** `EasingCurveCanvas.vue:274-277` — `.easing-curve-canvas-wrapper { border: none }`
with the comment "W4.S2 — DRY the double chrome." This is the SECOND place the demo suppresses the
wash variant's 1px border for a nested canvas. (`pane-easing.md` REFINE row.)

**The gap.** `GlassPanel variant="wash"`'s border suppression is done with an ad-hoc consumer-side
`border: none` override; the wash variant always paints its 1px border.

**Proposed glass-ui shape.** `GlassPanel` accepts a `border={false}` (or `noBorder`) prop to suppress
the wash variant's border by convention, without a consumer override.

**kf consume-edge after.** `EasingCurveCanvas.vue:274-277`'s override is deleted; the panel sets
`border={false}`.

**Paired born-RED kf gate.** `proof:glass-panel-noborder` (RED until the prop ships).
**consume-on-future-AX-publish.**

### RF-11 — case-preserving `text-mono-caption` variant (the `f(t)` vs `x =` register) · **P2**

**kf evidence.** `text-mono-caption` uppercases, so it surfaces "F(...)" but the math wants lowercase
"x =" / "f(t)"; the demo already invented `.code-token` locally for exactly this
(`design-idioms.css:465`) — *"a signal the rung needs a `none`-transform sibling upstream."*
(`cross-typography.md` REFINE/glass-ui row.)

**The gap.** the mono-caption rung's forced uppercase fights the math/code register's lowercase
function-notation; kf re-authors a `.code-token` to escape it.

**Proposed glass-ui shape.** glass-ui's `text-mono-caption` rung exposes a case-preserving
(`text-transform: none`) sibling variant.

**kf consume-edge after.** kf deletes `design-idioms.css:465`'s `.code-token` and uses the
case-preserving rung.

**Paired born-RED kf gate.** `proof:mono-caption-case` (RED until the variant ships).
**consume-on-future-AX-publish.**

### RF-12 — `.gold-shimmer` as a stable `@utility` (the documented duplication) · **P2**

**kf evidence.** `design-idioms.css:292-318` re-authors glass-ui's gold-shimmer recipe (the comment
`:281-291` documents it as a deliberate "own-the-rent" localization with glass-ui-matching values) —
but the GRADIENT RECIPE (background-size 250%, the 5-stop sweep, `@keyframes gold-shimmer-slide`) is
byte-near glass-ui's. (`glassui-adopt.md B1` — STY-1.)

**The gap.** kf owns the token so a glass-ui rename can't silently flatten it (sound intent), but the
27-line recipe + keyframe duplicate glass-ui's — a contract question: is `.gold-shimmer` a stable
consumable `@utility`?

**Proposed glass-ui shape.** glass-ui exposes `.gold-shimmer` as a STABLE `@utility` consuming
`--color-gold*` tokens (a documented contract, not an internal).

**kf consume-edge after.** kf keeps ONLY the token override and deletes the 27-line recipe + keyframe
(`design-idioms.css:292-318`).

**Paired born-RED kf gate.** `proof:gold-shimmer-utility` (RED until the `@utility` is a documented
stable surface). **consume-on-future-AX-publish.** (This is the STY-1 gold-shimmer dedup J.W7b owns
the consume-half of — see `J.md` J.W7b "gold-shimmer dedup STY-1.")

**[J.W7b IMPL, 2026-06-10]** the kf consume-half **LANDED** (set (i) S1g/STY-1): the
`design-idioms.css` 27-line recipe + `@keyframes gold-shimmer-slide` are DELETED (tombstone now at
`:296`); the three call-sites resolve to the published `@utility` through the demo-owned
`--color-gold*` ramp (consumer configuration, not a fork). The residual AX ask narrows to the
STABILITY contract (document `.gold-shimmer` as a stable consumable surface); the gate now guards
only that documentation half plus rename-drift (`waves/J.W7b-impl.md §A`).

### RF-13 — `--spring-*` timing-token discoverability (the `--spring-snappy` shadow) · **P3 / docs-only**

**kf evidence.** `style.css:159-170` — kf had to RECONCILE its own `--spring-snappy: linear(…)` (a
ζ=0.65 shadow) onto glass-ui's canonical spring token because *"the demo previously baked its OWN
same-named token — the exact cross-repo token incoherence."* The fix landed (kf aliases the canonical
curve), but it shows glass-ui's spring-timing tokens weren't discoverable/authoritative enough to
prevent the shadow. (`glassui-abstract.md C4`; `glassui-adopt.md` baseline `--spring-snappy` re-alias.)

**The gap.** a small DOCS/naming refine, not a code change — the canonical `--spring-*` family isn't
documented as the consumer-facing motion vocabulary, so consumers re-bake `linear()` shadows.

**Proposed glass-ui shape.** document the canonical `--spring-*` timing-function token family as the
consumer-facing motion vocabulary (with the response/damping each was generated from), so consumers
ALIAS rather than re-bake.

**kf consume-edge after.** kf (and the next consumer) reaches for `var(--spring-smooth)` knowingly;
the reconciliation episode never recurs.

**Paired born-RED kf gate.** none (docs-only — no consumable surface to gate). RECORD as a
documentation ask; the kf re-alias already holds. **consume-on-future-AX-publish (docs).**

### RF-14 — `HeaderRibbon`/`ActionRibbon` per-tab action slots (the RibbonBar Teleport graft) · **P3 / OPP**

**kf evidence.** `RibbonBar.vue:6-9` — a hand-managed `id="controls-ribbon-target"` Teleport target
inside a `<Card surface="cartoon">` that the controls Teleport INTO, with per-tab `v-if` branches
(`:12-103`) and the `RIBBON_BUTTON_CLASS` literal (`:122`) + a `.ribbon-apply--active` scoped
border escape (`:135-137`). glass-ui ships `HeaderRibbon` (consumed at `EditorShell.vue:10`) but the
per-tab action-bar pattern is re-authored with a Teleport graft. (`glassui-abstract.md C6`.)

**The gap.** the "action ribbon that swaps its button set by the active tab" is a general molecule;
kf grafts it with Teleport + `v-if` rather than consuming a glass-ui ribbon that takes tab→actions
slots.

**Proposed glass-ui shape.** a `HeaderRibbon`/`ActionRibbon` variant that accepts named per-tab action
slots (the active tab drives the visible button row natively, no Teleport graft), with the pill-button
styling as a built-in `ribbon` button variant (retiring `RIBBON_BUTTON_CLASS` + the
`border-color: transparent` escape).

**kf consume-edge after.** RibbonBar's Teleport target + `v-if` branches become slot fills;
`RIBBON_BUTTON_CLASS` and `.ribbon-apply--active` are deleted.

**Paired born-RED kf gate.** `proof:action-ribbon-slots` (RED until the slotted variant ships).
**consume-on-future-AX-publish.** OPP — lowest urgency.

### RF-15 — `glass-wash` controls-pane surface availability (the recede idiom) · **P3 / OPP**

**kf evidence.** `ControlsPaneWrapper.vue` uses `cartoon-surface tier="quiet"`; in stage scenes the
pane floats over a stage, so a `glass-wash` (translucent backdrop-blur) would let the stage read
through the chrome, reinforcing the glass identity (`pane-cube.md C16`). The `glass-wash` consume
itself is a kf-side change (J.W7a's recede idiom) — the glass-ui ask here is only IF the wash surface
needs a contract refinement for the stage-floating context. (`pane-cube.md C16`.)

**The gap.** mostly a kf-demo ADOPT (use `glass-wash` for the floating controls pane), surfaced here
only so AX knows the stage-floating wash context is a consumer case; no glass-ui change is owed unless
the wash surface needs a stage-context variant.

**Proposed glass-ui shape.** none required (the `glass-wash`/`surface="glass" tier="wash"` surface
already ships); note only — IF the stage-floating context needs a tuned backdrop-blur token, that is
the ask.

**kf consume-edge after.** J.W7a's controls-pane-recede consumes the existing `glass-wash` (a
consume-on-3.9.0 ADOPT — listed for completeness; no AX work).

**Paired born-RED kf gate.** none (kf-demo ADOPT — see §3 ADOPT-5). RECORD only.

> **REFINE roll-up (the 25).** RF-1..15 above are the substantive REFINE asks. The remaining REFINE
> corpus is the standing-edge + layout-gap tail, each cited inline or in §3: the **`Card` two-stacked-
> card grouping gap** (`pane-square.md SQ-15` — a divider/grouping signal between the options + ribbon
> cards); the **`progress-traveller` rail-vs-free mode** (`pane-motion-path.md MP-GU2` — folded into
> AX-2/RF tail); the **single-token font override** (`glassui-adopt.md C2` — the lighter-weight twin
> of RF-2); the **`StatusDot` depth/size token** (`pane-spring.md §Gaps` — folded into RF-6); the
> **`MetricBadge` two-line `cell` slot** for the spring preset name+value (`glassui-abstract.md B2`
> refine note); the **dark-token gold/axis override** confirmations (`glassui-adopt.md D1` — no gap,
> RECORD); the **PRM transition-class** adoptions that delete kf's manual `@media` guards
> (`glassui-adopt.md D2`/A5 — consume-on-3.9.0, §3 ADOPT-8); the **`{types}` directional VT helper**
> (the standing GH-4/FB-4 edge — RF tail below); the **dock double-click/touch-gate** VERIFY-ONLY
> (`constellation-edges.md CONST-5` — §3). Total dispositioned REFINE: **25**.

### RF-16 — PRM ResizeObserver → render TDZ crash (`Cannot access 'C' before initialization`) · **P1 — born-RED, glass-ui-seam**

**kf evidence (J.W7c live-audit, adversarial verify round 1).** Under emulated
`prefers-reduced-motion: reduce` ONLY, a home-screen (`/#/`) load throws a runtime
`ReferenceError: Cannot access 'C' before initialization` from a glass-ui ResizeObserver callback into
an app render closure. Captured stack (built dist, `dist/gh-pages`):

```
ReferenceError: Cannot access 'C' before initialization
    at Object.render (…/assets/index-*.js …)        ← app bundle render
    at b (…/assets/glass-ui-*.js:12:1927)           ← glass-ui
    at A (…/assets/glass-ui-*.js:12:3091)           ← glass-ui
    at ResizeObserver.<anonymous> (…/assets/glass-ui-*.js:12:3179)  ← glass-ui RO
```

**PRE-EXISTING, NOT a J.W7c regression — proven.** The crash reproduces on the BASELINE tree (all
J.W7c lane changes stashed, 3/3 runs) and disappears entirely when PRM is OFF (0 errors). It is a
glass-ui reduced-motion code path: a ResizeObserver-driven component (`b`/`A` in the glass-ui chunk)
calls back into a render before a `const` (`C`) in that closure is initialized — a minification/
circular-init TDZ surfaced specifically on the reduced-motion branch. It correlates with the build-
time Rolldown warning `[INVALID_ANNOTATION] /* #__PURE__ */ … comment ignored due to position`
(`@vueuse/core`) and the `[INEFFECTIVE_DYNAMIC_IMPORT]` engine-chunk warnings — a toolchain
hoisting-order interaction landed by the Vite 7→8 + Rolldown migration (`b2dfec2`).

**Impact.** The PRM *assertion* still passes (the TypingDots correctly REST: `prmChurn:[1,1,1]`), so
the dots are not user-broken — but the thrown error CHARGES the `proof:live-session` HARD error budget
(5 charges: console.error + 2× pageerror + 2× weberror), reddening the gate-of-gates deterministically
regardless of any kf-side change. It is in glass-ui's RO→render seam; per the inv-16 rule
(*kf consumes published glass-ui; nothing above is patched in kf*) it is BOOKED here, not patched.

**The gap.** glass-ui's ResizeObserver-driven component(s) hit a TDZ on a render-closure `const` under
the reduced-motion branch in the minified build — an init-order bug exposed by the consumer's
production bundler (Rolldown), not by glass-ui's own dev build.

**Proposed glass-ui shape.** glass-ui ships its RO callback + render path free of forward-`const`
references in the reduced-motion branch (hoist the `const`, or guard the RO callback against pre-init
invocation) so the production bundle has no TDZ; verify under a Rolldown/`#__PURE__`-position build.

**kf consume-edge after.** none — kf consumes the fixed glass-ui; the durable upstream cure removes
the consumer guard's reason-for-being (the guard stays as the correct PRM posture regardless).

**kf-side MITIGATION FOUND (J.W7c verify r2 — the gate is now GREEN, the AX ask DOWNGRADES).** The
crash path is `freeze || x.reducedMotion` (FourierField render, `fourier-field.js:105,116`): a TRUTHY
`freeze` SHORT-CIRCUITS the `||` BEFORE the forward-`const` glass-ui read, so the TDZ never arms. The
home hero (`EditorStartScreen.vue`) now passes `:freeze="prefersReducedMotion"`
(`usePreferredReducedMotion()`), which is ALSO the correct reduced-motion posture — a decorative
animated math field must rest under PRM, the same contract TypingDots/AnimatedText honour. This is a
CONSUMER-SIDE use of FourierField's OWN published `freeze` prop — NOT a glass-ui patch (inv-16 holds).
VERIFIED on the built dist: 0 TDZ errors across PRM (3/3 fresh contexts) AND no-PRM (3/3); the prior
3/3-PRM crash is gone. The AX ask is thus DOWNGRADED P1→P3: still wanted (so a consumer that animates
FourierField through a PRM session — not just freezes it — never hits the TDZ), but no longer a born-RED
blocker for kf.

**Paired kf gate — NOW GREEN.** `proof:live-session` (the `S2:prm-typing-dots` error-budget charge) —
GREEN as of the consumer `:freeze` guard; no longer a DISCLOSED-RED of record. The upstream init-order
fix remains the durable cure for the general (animate-through-PRM) case. **consume-on-future-AX-publish.**

### RF-17 — `GlassDock` collapse-crossfade strands the trailing `click` on a leaving layer (the actuation-vs-collapse race) · **P2 — kf-mitigated, durable cure is glass-ui-seam**

**kf evidence (J.W7c live-audit, fix-round 1).** With a collapsible dock (`:always-expanded="false"`),
a POINTER actuation of a control whose `@pointerdown` lands while a collapse is imminent can be
SWALLOWED: the layer crossfade swaps which `.dock-layer` is `.is-active` mid-gesture, the layer the
pointerdown landed on goes `.is-leaving` (→ `pointer-events:none`, `styles/dock/layers.css:165-170`)
BEFORE the browser synthesizes the trailing `click`, so a `@click`-only handler never fires. Proven on
the built dist with the bottom `TransportDock`: instrumented handlers showed the play button's
`@pointerdown` firing but its `@click` NEVER firing, play staying off, and motion-path's one-shot
traveller (parked at offset-distance 100%) producing only 1–2 distinct states — reddening
`proof:live-session` S5 (`motion-path: PLAY red — traveller produced only N distinct states (<3)`).

**No consumer-side call wins the race — verified.** `dockRef.expand()` and `dockRef.keepOpen()` were
each tried from the consumer (on the button's `@pointerdown`, and pinned at `onMounted`); the dock
collapsed and stranded the `click` in BOTH cases. The held-counter (`useDockState` `p.value`) gates the
idle/mouseleave/outside-pointerdown collapse timers but NOT the crossfade transition that drops the
trailing click — so the consumer cannot keep the just-pressed layer interactive through the click from
outside the dock. (`:always-expanded="true"` makes it GREEN — single non-crossfading layer — confirming
the collapse crossfade is the sole cause.)

**kf interim mitigation (lands J.W7c, token-clean, NOT a glass-ui patch).** `TransportDock.vue` drives
the play toggle from `@pointerdown` (which always reaches the live button — the crossfade can only
strand the LATER `click`) with a `pointerHandled` guard so the synthesized pointer-click does not
double-toggle while bare keyboard clicks (Enter/Space) still actuate (`proof:live-session` S4 keyboard
leg preserved). This cures the actuation for kf's transport, but it is a per-control workaround — any
consumer placing an interactive control in a collapsible dock layer hits the same swallow on `@click`.

**Proposed glass-ui shape.** the dock keeps the LEAVING layer hit-testable for the in-flight gesture —
e.g. defer the `.is-leaving` `pointer-events:none` flip until after the active pointer sequence
completes (track an in-flight pointer on the layer), or expose a dock-level "actuation in progress"
hold the crossfade respects — so a `@click` on a control pressed in the expanded layer is never dropped
when a collapse races it. The consumer then drops the `@pointerdown` workaround and uses a plain
`@click`.

**kf consume-edge after.** `TransportDock.vue` reverts the play toggle to a single `@click` handler
(deleting `onPlayPointerDown` / the `pointerHandled` guard) once the dock no longer strands the click.

**Paired born-RED kf gate.** `proof:live-session` S5 (the motion-path PLAY/INTERACT leg) — held GREEN
by the kf interim above; the glass-ui edge greens the consume-edge revert on the bump.
**consume-on-future-AX-publish.**

### RF-tail — `{types}` directional View-Transition helper (the standing GH-4/FB-4 edge) · **OPP / BOOK**

**kf evidence.** `useSceneTransition.ts:2` imports from `@mkbabb/glass-ui/motion-core` and is live,
but no `{types}` directional pass exists — glass-ui ships no helper forwarding
`startViewTransition({ types })` + the directional `::view-transition-*` CSS
(`constellation-edges.md §1f` GH-4/FB-4: *"glass-ui-BOOK; folds only if J elects D11 scene
interactivity"*). (`constellation-edges.md §1f`; the I G-4 carry.)

**Proposed glass-ui shape.** a glass-ui View-Transition helper that forwards `startViewTransition({
types })` + ships the directional `::view-transition-*` CSS, so a consumer drives directional scene
transitions. kf's `useSceneTransition.ts` is the waiting consumer.

**kf consume-edge after / gate.** `proof:vt-types-directional` (RED until the helper ships AND kf
elects D11). **consume-on-future-AX-publish** — **OUT absent the D11 election** (`constellation-edges.md
§1f`: *"No J action absent that election"*). BOOK only.

---

## §3 — THE ADOPT-SIDE NOTES (consume-on-3.9.0 — needs NOTHING from AX)

These are NOT AX asks — the primitive ALREADY ships in the on-disk glass-ui 3.9.0 (verified
first-hand in `node_modules/@mkbabb/glass-ui/dist/`). They are J.W7b's consume-on-3.9.0 edges that
land THIS tranche, listed here so the AX session does NOT mistakenly re-build a shipped primitive.
**Each is a kf-demo deletion, not a glass-ui ask.** (`waves/README.md` J.W7b set (i); `glassui-adopt.md`
lane (a); `glassui-abstract.md` lane B.)

| # | kf hand-roll → glass-ui 3.9.0 primitive | kf evidence | Verified shipped (3.9.0) | kf consume-edge (J.W7b) |
|---|---|---|---|---|
| **ADOPT-1** | the 3 stage-card stat readouts → **`MetricBadge size="xl"`** (the audacious-poster rung) | `SpringTarget.vue:16-23`, `SequenceTarget.vue:13-15`, `MotionPathTarget.vue:12-14` (`glassui-adopt.md A1`, `glassui-abstract.md B1`) | `metric-badge.d.ts` ships `size` incl `xl`/audacious + `amount`/`unit`/`label` | the 3 `text-mono-caption…tabular-nums` span recipes deleted; readouts get LOUDER for free |
| **ADOPT-2** | per-frame-snap readouts → **`AnimatedDigit` + `.metric-swap`** Transition | `glassui-adopt.md A2` (the readouts update every rAF with a hard snap) | `animated-digit.d.ts` ships; `.metric-swap-*` in transitions.css:129-144 (PRM-guarded :219) | the per-frame-snap feel retired (dogfood-perfect for an animation engine) |
| **ADOPT-3** | the empty stage fields → **`FourierField`** (the headline math-suffusion) | `glassui-adopt.md A4` (the vast empty plates in `easing/spring/amiga/home-desktop.png`) | `./fourier-field` export + `FourierField.vue.d.ts` + `/fourier-math` subpath | a single low-`:intensity` `FourierField` behind the easing/spring subject — the math IS the brand |
| **ADOPT-4** | the PlaybackRibbon scrubber → **`ScrubberTimeline`** (BASE slider) | `PlaybackRibbon.vue:5-21` (`glassui-abstract.md B4` — *"kf imports glass-ui's timeline family in ZERO files"*) | `ScrubberTimeline.vue.d.ts` ships `modelValue`/`scrubStart`/`scrubEnd` + `role=slider` a11y | the ribbon Slider+gate becomes `<ScrubberTimeline>` (the DECORATIVE visualizer absorb is AX-11) |
| **ADOPT-5** | the Spring preset grid → **`ToggleChip variant="cell"`** | `SpringSidebar.vue:35-48` (`glassui-abstract.md B2`) | `toggle-chip.d.ts` ships `variant: chip\|cell` + `aria-pressed` | `.preset-active` deleted; the cards become keyboard-toggleable + screen-reader-pressed |
| **ADOPT-6** | the `f(t)=` math labels → **`text-math`/`cm-serif`** | `easing-desktop-open.png` axis label + header (`glassui-adopt.md A6` — grep `text-math` = 0 in kf) | `text-math`/`text-math-body`/`cm-serif` rungs ship | the function-notation reads as MATHEMATICS, not uppercase mono-caption |
| **ADOPT-7** | the spring view-switcher → **`SegmentedTabs variant="segmented"`** | `SpringScene.vue:7-32` (`pane-spring.md SP-7`) | `SegmentedTabs.vue.d.ts` ships `variant: segmented` + animated indicator | the 26-line hand-rolled tablist collapses; the spring-animated indicator suffuses the brand (the dedicated `SegmentedControl` POSTURE is the RF-5 future ask) |
| **ADOPT-8** | the `kf-editor` Transition → **`.fade-slide`** PRM class | `KeyframeTimeline.vue:288-291` (`glassui-adopt.md A5` — a near-exact copy) | `.fade-slide` in transitions.css (PRM-guarded) | rename `name="kf-editor"` → `name="fade-slide"`, delete lines 288-291 + inherit the PRM guard for free |
| **ADOPT-9** | the floating controls pane → **`glass-wash`** (recede idiom) | `pane-cube.md C16` (the pane should let the stage bleed through) | `glass-wash` / `surface="glass" tier="wash"` ships | the controls pane recedes; the subject becomes the protagonist (J.W7a's hierarchy fix) |

> **The consume-on-3.9.0 gate posture (J.W7b §boundary-oracle, set (i)).** Each ADOPT edge lands the
> deleted kf surface and the consumed 3.9.0 primitive in ONE motion — a grep proves the hand-rolled
> surface is GONE the instant the consume lands (hygiene corroborator). These do NOT wait on AX. The
> dark-mode (`glassui-adopt.md D1`) and the global-PRM bracket (`D2`) are RECORD-as-good — no gap, no
> deletion owed.
>
> **[J.W7b IMPL status reconciliation — branch `j-impl-w7b`, glass-ui 3.9.0 on disk, 2026-06-10.]**
> **ADOPT-5 CONSUMED** (set (i): `SpringSidebar.vue` + `StartingStyleTarget.vue` →
> `<ToggleChip variant="cell">`; `grep -rn "preset-active" demo/` = 0). **ADOPT-8 CONSUMED**
> (set (i): `name="fade-slide"`, the 4 `.kf-editor-*` rules deleted, PRM guard inherited;
> `grep -rn "kf-editor" demo/` = 0). **ADOPT-1/2/3/9 ride J.W7a** (the appearance-owning consumes —
> `J.W7a.md` D8/D18/D5); **ADOPT-6 rides J.W7a's S4 typography motion**. **ADOPT-4 and ADOPT-7 did
> NOT land in W7b** — the published primitive cannot replace the twin at pixel parity (`J.W7b.md
> §Goal` parity clause: the animated segmented indicator vs the SP-7 instant twin; the
> `ScrubberTimeline` 0..1 chrome vs the ms-domain token-themed `<Slider variant="timeline">`) — the
> swaps exit W7b to the appearance lane (the kf twins SURVIVE un-deleted; NOT future-AX books — the
> primitives are published). Full records: `waves/J.W7b-impl.md §A/§C`.

---

## §4 — THE COORDINATION PROTOCOL (which J.W7b edges ride which asks · interim-vs-wait)

**The single discipline (why each item pairs a born-RED kf gate).** Per the chronic-closure rule and
P-invariant-28, every cross-repo HANDOFF carries a born-RED kf gate so the item can't become a silent
forever-punt — it flips GREEN in kf's CI ONLY when the glass-ui change ships AND kf bumps to consume
it. inv-16 holds throughout: kf consumes the published glass-ui; none of §1/§2 is patched in kf.

**The interim-vs-wait partition (the no-block rule, made mechanical).**

| State | Items | kf posture in J | Lands |
|---|---|---|---|
| **PUBLISHED in 3.9.0** | §3 ADOPT-1..9 | CONSUME + DELETE the kf twin in one motion | **J.W7b set (i) — THIS tranche** |
| **REFINE/ABSTRACT ask, NOT in 3.9.0** | §1 AX-1..13, §2 RF-1..15 + tails | BOOK-with-target-version; kf interim survives BESIDE the booked replacement (token-clean, annotated `inv-16 HANDOFF`); born-RED gate held GREEN-pending (never red against vaporware) | **the FUTURE AX publish + a kf re-pin** (J.W7b set (ii)) |
| **OUT (election/owner-gated)** | RF-2 (OUT-sufficient-workaround), RF-tail `{types}` (OUT absent D11), RF-13 (docs-only) | RECORD; no kf wave owed | the next re-pin / the D11 election |

**Which J.W7b consume edges ride which asks IF published in time.** The IMPL phase opens only on user
authorization gated on kf's own green CI (the dev/impl boundary). At that point, for each §1/§2 item
the AX session has PUBLISHED, J.W7b lands its consume-edge in the same motion as the deletion:

| AX ask (this doc) | Rides → kf consume-edge | Priority order |
|---|---|---|
| **AX-1** `GlassControlPoint`/`useSvgPointer` | `EasingCurveCanvas` + `MotionPathTarget` mount the primitive; the twin authoring dies | **P1 — the net-new headline** |
| **RF-1** `cartoon-surface` radius | the `<Card>`-wrapper workaround retires; bare `cartoon-surface` is safe | **P1 — the 6-lane DEDUPED item** |
| **RF-2** headless-typography lever | the four-token `:root` override retires to ONE lever | **P1 — the standing CONST-4 edge** |
| **AX-2** `GlassRail`/`GlassRailBall` | `design-idioms.css:363-409` deleted | **P1** |
| **AX-3 + RF-6** `Badge`/`StatusDot` tone + auto-contrast | the 4 badge classes (`:411-456`) deleted | **P1** |
| **AX-5** `.bg-graph-paper` utility | the `EditorShell` data-URIs deleted; stage plates gain the coordinate field | **P1** |
| **AX-4/6/7/8/9, RF-3/4/5/7/8/9/10/11/12/14** | each named consume-edge above | **P2–P3 — ride as published** |

**The explicit interim-vs-wait rule (no smuggled escape hatch).** An item in §1/§2 that AX has NOT
published by the time J.W7b lands does NOT block J.W7b's close and does NOT red a kf gate: it exits J
as a **BOOK-with-target-version** (the export taught/enumerated, the no-published-primitive status
disclosed in J.W5's published-surface manifest where a kf surface is involved), its kf interim
survives unchanged, and its consume-edge rides the NEXT re-pin. The kf surface survives beside its
booked replacement ONLY because the replacement does not yet exist — the one honest exception to
no-legacy, gated strictly on PUBLISH (the vaporware lesson — `waves/README.md` J.W7b). Conversely, an
item AX publishes EARLY (before J.W7b's IMPL window) is consumed the instant it lands — there is no
"wait for the tranche" hold; the gate greens on the bump.

**What AX should prioritize (the kf-impact order).** (1) **AX-1** — the only net-new primitive, and
the one kf authored TWICE (highest leverage). (2) **RF-1** + **RF-2** — the two long-open items kf
works around with measurable debt (the `<Card>`-wrapper; the four-token `:root` force-apply), RF-1
verified STILL missing in 3.9.0 this audit. (3) **AX-2/3/5** — the pre-validated, kf-already-
consolidated promotions (kf did the DRY and named the variance axes — lowest-risk absorbs). (4) the
P2/P3 tail as bandwidth allows.

**The boundary oracle (NOT a kf appearance gate — J.W7b §Hard gate).** This doc's completeness IS the
oracle: all **46** REFINE/ABSTRACT items are dispositioned above with an evidence anchor + the
consuming kf seam named + a publish-state band + a paired born-RED gate. J.W7b's consume-to-delete
edges (set (i), §3) each prove a grep-zero hand-roll on consume; the set-(ii) edges (§1/§2) carry NO
kf deletion in J and share NO born-RED kf-runtime witness with J.W7a (which owns the appearance
baseline). inv-16 holds end-to-end: **kf consumes the published glass-ui; nothing above is patched in
kf.**
