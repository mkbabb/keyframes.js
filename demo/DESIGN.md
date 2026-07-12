# Keyframes.js demo design codex

> **The design authority.** This document is the single source of design
> language for the demo. It states the law; CSS, components, proof scripts, and
> owner-golden review derive from it. It is deliberately a specification, not a
> migration checklist. A rule belongs here once, and executing waves cite the
> numbered section rather than restating it.

Status: U.G1/G2/G3/G5 ratified (docs-only). The cube/amiga instrument register
is designed in one direction by OD-U9; implementation and owner blessing remain
the U.B8/U.G4 riders. No glass-ui source is changed by this codex.

## 1. Voices

The demo has three voices, each with a narrow job:

* **Display.** Instrument Serif is the display identity, at its honest shipped
  weight 400. `--font-display` in `demo/styles/style.css` is the sole display
  token; the `demo-typography` rung override prevents glass-ui's display rung
  from synthesising 600. Display is sanctioned for the home hero, target titles,
  the easing curve title, and the square's subject label. Display is not chrome.
* **Body.** Plus Jakarta Sans is the voice for controls, labels, dock text,
  badges, hints, and prose. The mobile dock-label rung is a deliberate size
  step, not a new family.
* **Mono-as-data.** Fira Code is reserved for literals, tabular-number
  readouts, code/keyboard content, and explicitly marked identifiers
  (`data-register="code"`). It is never a general UI voice. The complete
  selector contract and ceiling live in `demo/styles/font-roles.json`;
  `proof:font-census` is its witness.

The fallback face and `font-synthesis: none` are layout stability measures, not
additional voices. A new face or display site requires a codex amendment.

## 2. Color authorities

Color is named by role, never by a new call-site literal.

* **Violet motion authority.** `--accent-kf` (an oklch family with the
  iris-periwinkle light arm and orchid dark arm) is the interactive and motion
  identity. `--color-progress` aliases it and is the one progress, slider,
  readout, and settled-status color. `--accent-kf-strong`, `-subtle`, and
  `-foreground` are its interaction steps.
* **Red is destructive only.** `--accent-red` marks delete, clear, error, and
  destructive feedback. It must not return to progress or ordinary chrome.
* **Rainbow is signal.** `--rainbow-red`, `orange`, `yellow`, `green`, `cyan`,
  `blue`, and `violet` are the pinned signal family. A bridge stop uses
  `color-mix()` (the sequence progress row is the exemplar); inventing another
  hue for a gradient is forbidden. Gold (`--color-gold` and its light/dark
  steps) is reserved for sparkle/highlight.
* **Crayons are pinned.** `--face-1` … `--face-6` are the cube facet signals,
  hue-exact and ordered by face. The amiga red aliases the rainbow red. These
  values are not theme signals to be casually retuned.
* **Material is not a crayon.** Lighting gets a named material register:
  `--specular` is a foreground/highlight mix and `--shade` is a
  background/shadow mix. Cube face sheen/shade gradients and the sequence
  playhead cap consume these roles. A literal is permitted only inside the
  material token definition; a new lighting effect consumes the pair.

Signal tokens belong in `demo/styles/design-idioms.css`; geometry belongs in
`demo/styles/layout.css`. Both sheets are imported after glass-ui's cascade, so
the demo-owned definitions are authoritative.

## 3. Cards and specimen grammar

The demo has two card registers, not a third hybrid:

* **Controls:** `Card surface="cartoon" tier="quiet"`; the surface is the
  tactile control plane and may elevate on keyboard focus.
* **Stage plates:** glass `tier="resting"` with `:shadow="false"`; the plate
  frames an instrument without competing with its subject. A full-bleed 3D
  canvas may omit a plate only under §8's immersive rule.

An instrument specimen reads in this order: a serif identity/title rung, a live
engine value in mono tabular numerals, a `.status-badge` tri-state (`settled`,
`tracking`, `reverse`), then a short body-voice hint. The title identifies the
thing being measured; the readout is current state, never decorative copy; the
badge describes motion state. The shared rail/ball/readout and badge recipes in
`design-idioms.css` are the implementation vocabulary.

## 4. Substrate, geometry, and depth

The stage field is graph paper: fine and major pitches are mixed over the
foreground/border so the theme retints without a second palette. `.stage-field-x`
is the time/position axis; `.stage-field-y` is the value axis. Stage tint is a
low-contrast substrate, never a signal.

The dock geometry is derived, not eyeballed. `--phi: 1.618` is the sole named
constant: top and bottom optical slack use the 0.382/0.618 split, and dock
anchors use the quarter/phi asymmetry. Work-area clamps, safe-area insets, and
the stable mobile reserve feed the dock; a component must not introduce a
viewport literal that bypasses those tokens. Geometry tokens (lengths, ratios,
viewport clamps) live in `layout.css`. Appearance magnitudes such as graph ink
and pane idle opacity live in `design-idioms.css` when that move lands in U.B.

Depth is the semantic glass-ui scale, strictly ascending:

| rung | meaning |
| --- | --- |
| `--z-behind` (-10) | below the content plane (the cube axis line) |
| `--z-content` (10) | subject/target |
| `--z-controls` (20) | in-scene controls |
| `--z-bar` (30) | editor/header chrome |
| `--z-dock` (40) | dock bands |
| `--z-overlay` (50) | scrims |
| `--z-popover` (130) | popovers |
| `--z-modal` (140) | modal dialogs |

Use semantic `z-*` utilities. Raw `z-[n]` values are not a design escape hatch.

## 5. Idiom catalog

The idiom home is `demo/styles/design-idioms.css` (with the two small imported
idiom sheets). It owns the rainbow and gold signals, focus/touch floors,
`progress-bar`, `progress-dot`, `progress-rail`, `progress-ball`,
`readout-accent`, status badges, code tokens, stage fields, and the labeled-field
subgrid. `tab-trigger-base`, `tab-trigger-pill`, and
`tab-trigger-underline` are the tab grammar; `btn-playback` and
`btn-playback-accent` are the transport grammar. These are cross-component
recipes, so they remain central rather than being copied into SFCs.

The migration rows are intentionally honest: upstreaming the tab variants and
evaluating card-based asset/layer lists are glass-ui coordination asks, not
permission to fork a second local vocabulary. The glass-ui post-BH convergence
is **central tokens and cross-component idioms; colocated component-specific
recipes**. A component sheet belongs beside its SFC once §9's threshold is met.

## 6. Token-home partition and prose ownership

Partition by concern, not by whichever proof currently names a file:

* signal, appearance, material, and interaction tokens → `design-idioms.css`;
* lengths, ratios, viewport clamps, dock/work-area geometry → `layout.css`.

The U.B styles pass moves the appearance strays (`--graph-opacity`,
`--graph-major-opacity`, `--controls-idle-opacity`) out of `layout.css` and the
geometry strays (`--rail-width`, `--panel-max-h`, `--mask-fade`) out of
`design-idioms.css`, then re-anchors the surviving proof clause in the same
motion. The cascade order does not change.

Rationale prose is owned here. Comments may point to a section; they do not
mint a competing authority. U.E's currency sweep removes stale “red motion
authority” prose in the square files, corrects the six-scene font census note,
and recuts any suffusion clause that names a pruned motion-path scene. The
material register in §2 replaces the raw-literal rationale in cube/playhead
styles.

## 7. Affordance and interaction grammar

Every manipulable scene has one concise verb line in `.stage-legend`: what to
drag, what motion is produced, and what release/keyboard action does. The legend
uses the body voice, remains pointer-transparent, progressively discloses only
after the scene is understood, and remains discoverable on touch. PRM removes
non-essential motion but does not remove the instruction.

The spring caption and square progressive-disclosure legend are the source
patterns. Cursor-only or home-only hints are not sufficient. The implementation
of the shared legend rides U.B8 and is reviewed with the candidate renders in
§8.

## 8. Immersive scene register (OD-U9)

**Ruled direction: instrument cube and amiga.** OD-U9 (2026-07-10) rejects a
two-way fork: the 3D scenes receive the same idiomatic telemetry language as the
four instrument scenes. Their canvases remain full-bleed; a floating whisper
keeps the immersive subject unobstructed.

The shared `.stage-whisper` register is an asymmetric corner instrument:
absolute title at the top-left, accent live readout, optional tri-state badge,
and a quiet verb line. It is pointer-transparent, uses `--z-content`, and obeys
PRM. Amiga exposes spin ω and pose y with “drag the ball — release to coast.”
Cube exposes the active channel plus a live matrix cell or Euler triple with
“drag to orbit.” Both use the same title/readout/badge/hint order from §3 and
the same `.stage-legend` behavior from §7. No stage plate is required; the
full-bleed canvas is the immersive genre's deliberate surface.

The register is a spec, not a self-blessed screenshot. U.B8 supplies the
module-shaped implementation. Candidate renders belong under
`docs/tranches/T/goldens/candidates/` with `PENDING-OWNER` status; the owner
reviews mocks against renders. U.G4 then performs one blessing pass for the
register-equipped cube/amiga and sequence goldens. Until that pass, no file is
called blessed and no appearance gate is retired.

## 9. Component-module skeleton and API grammar

### 9.1 Shape

Each module is a kebab-case directory. Its entry is the PascalCase SFC; an
`index.ts` barrel is re-export-only. Typed constants/enums and pure helpers live
in `constants.ts`; declared contracts live in `types.ts`; a bound hook lives in
`composables/useXxx.ts` for a complex component (a trivial single hook may sit
beside its owner); a lazy module owns a `.skeleton.vue` and wires it through
`defineAsyncComponent({ loadingComponent, delay: 150 })`. Renderers above ~500L
are carved into composables. There is no component-local `composables/` bin for
an unrelated shared concern.

Placement is lowest common ownership: one consumer beside its owner; shared
within a module at module root; shared across siblings promoted exactly one
level to their nearest common ancestor; shared across areas at the shared tier.
Kind-bins are allowed only for genuinely shared (at least two-consumer) members.
Tests are not satellites: OD-U7 keeps the top-level `test/<area>` mirror.

### 9.2 One API grammar

* **Props:** reactive destructure with inline defaults; getter functions are the
  seam into composables. `withDefaults` and runtime-object `defineProps` are
  legacy forms.
* **Models:** every `update:*` channel is a `defineModel`; hand-written
  `update:*` emits are banned.
* **Emits:** named tuples only. Commands are verb-first camelCase
  (`switchScene`, `moveKeyframe`); facts are past participles (`scrubbed`).
  Noun+`Update` names are renamed at the owning move.
* **Slots:** every slotted component declares `defineSlots`.
* **Expose:** `defineExpose` takes a named interface, never an inferred object.
* **Context:** a scene entry provides under its `<scene>Keys.ts` key; family
  members inject it. Props remain for leaf-scoped scalars.

The lexicon is facility, transport, channel, instrument, scene, target, and
facet. Stuttered names are corrected when their module moves. The split rule is
**one number:** a style block over 100L or an SFC over 300L gets a sibling sheet;
every demo CSS file remains ≤300L. Lane 24's earlier ~40L suggestion is
superseded by this measured R3 rule. Cross-component skins stay in the design
system; component-specific recipes colocate beside the SFC.

U.B12 extends surviving gates (`proof:colocation`, `proof:style-file-ceiling`,
and the existing AST grammar witness) from this chapter. U.G adds no gate.

## 10. Vue idiom law (R1–R7)

These rulings are standing law. Each names its evidence-shaped witness and
owner; the codex is their only home.

| ruling | law and rationale | surviving gate / owner |
| --- | --- | --- |
| **R1** | A module is a directory and its barrel is the one contract. Cross-module imports use the barrel; deep self-barrel and `export *` are forbidden. | Existing dependency-cruiser clauses (`no-cross-module-deep`, `no-self-barrel`, `no-star-export`); U.B9/U.C. |
| **R2** | Laziness belongs at the consumer seam (route/scene, pane reveal, heavy vendor), never in a re-export barrel. | `proof:publish` reachability clause (OD-U11 folded chunk reachability); U.D. |
| **R3** | Mechanical split: style block >100L or SFC >300L → sibling sheet; every demo CSS ≤300L. This is the §9 number. | `proof:style-file-ceiling`; U.B12. |
| **R4** | Utilities belong in templates; scoped CSS is token-plain. `@apply` is design-system-only and `@reference` is banned. | Clause on `proof:styling-idioms`; U.B12. |
| **R5** | Tests mirror the source tree in their own top-level directory. OD-U7 makes this a language carve-out: tests consume a public surface and must not tax runtime colocation or HMR. | Mirror clause on `proof:zone-cohesion`; U.H/U.B. |
| **R6** | Shared-tier membership is kind-appropriate, has at least two consumers, and is tolerance-free. Exceptions change the rule or move the member; the old DEFERRED map dies. | Existing `proof:colocation` clause; U.B1. |
| **R7** | No vestigial path segments. A directory layer must state a contract; single-child bins and semantically empty `custom/`, `components/`, or transport pairs fail. | `proof:colocation` no-single-child clause; U.B1. |

R5's mirror ruling is explicit owner law, not a loophole. R2's witness remains
inside `proof:publish`; U.G does not create a standalone chunk gate. All other
enforcement is clause-shaped on surviving gates, so the net gate count remains
flat.

## Cross-reference witness (one-shot at tranche close)

At U.Z, inspect the surviving design clauses and require a section anchor to
this codex: `proof:styling-idioms` → §§2, 5, 7; `proof:font-census` → §1;
`proof:crayon-preserved` → §2; `proof:appearance-suffusion` / owner-golden →
§§3, 7, 8; `proof:colocation` and `proof:style-file-ceiling` → §§9–10;
`proof:publish` → §10 R2; `proof:zone-cohesion` → §10 R5. This is a close-out
witness, not a new standing gate.

## Routed remainder

* U.B8 implements `.stage-whisper` and `.stage-legend` from §§7–8.
* U.G4 creates and owner-blesses `sequence-{light,dark}` plus the
  register-equipped cube/amiga candidates, pins the controls-pane state in the
  capture protocol, and re-blesses deviating frames. The current codex does not
  claim that blessing.
* U.B styles and U.E currency execute the token-home moves and prose-purge map
  in §§6 and 2. Glass-ui consume-edge work stays held until its independent
  5.0.0 release-ready signal, tag, and npm publication are all present.
