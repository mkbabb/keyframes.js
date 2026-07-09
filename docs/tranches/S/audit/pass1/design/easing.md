# Easing Scene — Design Audit (Tranche S, pass 1)

> Page: `#/easing` — the bezier/easing editor scene. Screenshots:
> `docs/tranches/S/audit/pass1/design/screenshots/easing-{mobile,laptop,desktop}.png`.
> Source: `demo/scenes/easing/` + the shared `demo/@/components/custom/{EasingCurveCanvas,EasingEditor,EasingSelect,DemoControlPoint}.vue`.
> Prior treatment: `docs/frontend-design/demo/easing.md` (the "oscilloscope, not a settings panel" doc — **largely implemented**; this audit grades the shipped state).

---

## 1. Product truth

The easing page is keyframes.js's **shape-of-time instrument**: the one place a user directly authors a timing function and watches the engine answer in real time. The sidebar hosts the canonical curve editor (`EasingCurveCanvas.vue` inside `EasingEditor.vue` — a glowing violet trace on a two-tier graticule, two spring-damped drag handles over the library's own `drag2D`, a grouped named-easing dropdown, a writable `cubic-bezier(…)`/`steps(…)` literal, and a sampled curve-physics telemetry strip). The stage projects the *same* live curve at hero scale with its own grabbable handles (`EasingHeroStage.vue` — "a hero drag and a sidebar drag are the SAME edit," `EasingHeroStage.vue:69-79`) while a 56px ball rides a rail with `x = fn(progress)·maxX` — the curve in motion. Every moving part dogfoods the library: the sweep is a `NumericAnimation` (`useEasingDemo.ts:151-153`), the drag physics is `drag2D`/`SpringProgress` (`DemoControlPoint.vue:190-205`), the drag-smear decay is `SmoothProgress` (`useEasingTraceSmear.ts:20`), and the trace self-draws on enter via `fromDrawSVG` (`EasingHeroStage.vue:247-251`). The page that teaches timing functions is itself driven by them.

## 2. Usability, affordance discoverability, interactability

### Findable unaided
- **The dropdown** (`EasingSelect.vue`) is an obvious control: per-item SVG curve glyphs + family grouping + descriptions — an excellent browseable catalogue.
- **The bezier handles** now read adjustable at rest: violet accent ring + glow + `cursor: grab` (`EasingCurveCanvas.vue:464-478`), and the hero-stage handles are visibly the same species. The dashed control-arms tell you which arm you're bending.
- **The writable value field** (`EasingSidebar.vue:103-122`) round-trips typed literals with a `:user-invalid` guard — precision authoring is discoverable because the field looks like a field.
- **The duration slider, view-mode select, playback ribbon** (scrub + play/reverse) are all standard glass-ui chrome.
- **The physics telemetry** (peak velocity / overshoot / anticipation + the one-line character read, `EasingSidebar.vue:140-169`) self-explains a curve's behavior — genuinely great pedagogy.

### Hidden without a tell
- **"The Gallery"** — the 6-curve auto-tour is *still* bound only to an undocumented double-click on the canvas (`EasingSidebar.vue:38`), the exact gap the prior treatment flagged (its §Implementation plan item 4, "a real labeled affordance," was not built). No visible door, no keyboard path, no reliable touch path.
- **"Name that curve"** — the RMS-nearest-named-easing reveal is dblclick-on-the-`<dl>` (`EasingSidebar.vue:144`); the `aria-label` hints it for screen readers but nothing visible invites it.
- **The hero handles are editable** is discoverable-by-glow but not by label; a first-time user may not realize the stage curve and the sidebar curve are one model.
- **Shift = fine keyboard nudge** on handles (`DemoControlPoint.vue:225-249`) is undocumented anywhere in the UI.

### Feedback loops
Strong: a handle drag re-shapes the trace, smears the beam (`--trace-smear`), re-times the ball, updates `f(t)=` (damped `AnimatedDigit`), updates the literal + physics — five coherent, immediate answers. The diff-ghost of the departed named curve (`EasingCurveCanvas.vue:82-87`) is a subtle, excellent touch. Weak: copy success has no visible acknowledgment on the readout (the prior doc's violet flash was never built), and the Gallery tour has no running signature — if you trigger it accidentally the page appears haunted for ~3s.

### Touch targets
The rendered handle is `r=0.04` in unit space → ~24px diameter in the ~300px sidebar canvas — **below the 44px floor**; hero handles at `r=0.022` over a wide-but-short box are similarly thin vertically. The keyboard path compensates on desktop only. The CopyButton is `icon-md` (~28px).

### Empty/loading states
None needed — the scene autoPlays (`EasingScene.vue:115`) and the engine is warm before mount; the self-draw boot doubles as the load state. No dead air observed.

## 3. Mobile (375px shot)

1. **The editor sheet fully occludes the stage.** At phone width the sidebar mounts as a bottom sheet covering effectively the whole viewport — the hero ball, the curve name, and the `f(t)=` readout are all invisible. Dragging a handle on mobile therefore gives **zero visible motion feedback** — the page's entire thesis (edit the curve, watch the engine answer) is severed on the device class where the demo will most often be first-seen.
2. **The copyable literal truncates**: `cubic-bezier(0.25, 0.10, 0…` (`EasingEditor.vue:49` `truncate`). The single most copy-worthy artifact is unreadable exactly where copy-to-mobile-clipboard matters.
3. **The duration control is clipped by the dock band** — the "duration" label renders at the sheet's cut edge and the slider sits under/behind the floating "Easing Preview" dock pill.
4. **Handle touch targets ~24px** (see above) — precise bezier editing on a 300px canvas with fingers is fiddly; there is no fat invisible hit region.
5. **Both easter eggs are dblclick-gated** — double-tap-to-dblclick synthesis is inconsistent across mobile browsers (and dblclick zoom suppression interferes), so touch users likely never find the Gallery or the curve-identifier.

## 4. Aesthetic critique (against glass-ui)

**This page is memorable, not generic** — the prior "oscilloscope" treatment landed. The violet trace with its emitted-light bloom (`EasingCurveCanvas.vue:404-413`), the two-tier graticule + center crosshair (`:375-389`), the `EASE · f(t)` masthead (`:321-338`), the scanline whisper + radial phosphor tint + inner vignette (`:284-319`) make the canvas read as an instrument screen, unique among cubic-bezier editors. Typography is the demo's best two-voice pairing: Instrument Serif poster ("ease") + damped tabular Fira Code voltmeter (`EasingTarget.vue:36-46`). Color discipline is real: one signal hue (`--ppmycota-primary` → `--trace`), the ball on the sanctioned `--rainbow-violet` seam (`EasingTarget.vue:380`), magenta readout accent — dominant + sharp, not evenly-distributed timidity. Motion quality is high and *dogfooded* (spring-damped handles, SmoothProgress smear decay, DrawSVG boot).

Remaining aesthetic debts:

- **The hero's control chrome outranks its signal.** On the stage the projected trace tops out at `stop-opacity: 0.24` (`EasingHeroStage.vue:300-307`) while the dashed handle-arms render as heavy full-width chunky dashes (unit-space `stroke-width: 0.025` under the non-uniform hero scale, `DemoControlPoint.vue:319-327`) — in the desktop/laptop shots the dashes are the loudest element on the stage and the curve is nearly invisible. The instrument's knob-wiring is louder than its beam — inverted hierarchy.
- **The prior doc's comparison-race dramatization is unbuilt**: the multi-track view is still monotone rows with no shared "now" playhead and no per-track rainbow stop (`EasingTarget.vue:103-136`) — the one sanctioned place the crayon palette was to earn a legible job.
- **The laptop (1280×800) fold clips the playback card**: the second sidebar card (Pause/Reverse + scrubber) is guillotined mid-button in both laptop and desktop shots — reads as broken rather than scrollable.
- Dogfooding is visible to a code-reader but not to a viewer; nothing on-page *says* the smear/boot/handles are the engine's own primitives (a missed brag, though arguably tasteful restraint).

**Grade context**: distinctive, coherent, deeply crafted on desktop; mobile severs the core loop and two headline refinements from its own design doc are unshipped.

## 5. Ranked tasteful refinements (wave-shaped)

1. **Mobile: keep the engine visible while editing** — *what*: at phone width, cap the editor sheet height (~60vh) or float a slim live strip (mini rail + ball + `f(t)=`) pinned above the sheet; *where*: the sheet host layout + `EasingSidebar.vue` (the canvas clamp `:394-397` already container-adapts); *why*: restores the edit→motion feedback loop, the page's entire thesis, on 375px.
2. **Un-truncate the literal on narrow containers** — *what*: let `.easing-readout-value` wrap to two lines (or step down one mono rung) below ~360px container width instead of `truncate`; *where*: `EasingEditor.vue:47-49,105-107`; *why*: the most copy-worthy artifact must be legible where it's copied.
3. **Rebalance the hero: signal above chrome** — *what*: raise the trace core to ~0.35 stop-opacity and thin/dim the hero handle-arms (smaller dash, ~0.3 opacity at rest, full strength only while grabbed); *where*: `EasingHeroStage.vue:300-307` + `:deep(.handle-line)` override beside `:351-364`; *why*: the beam should outrank its wiring — currently inverted.
4. **Give the Gallery a door** — *what*: a small labeled icon-button ("tour" / sparkle) beside `EasingSelect` invoking `demo.gallery`, plus a subtle running signature (trace pulse per step); keep the dblclick as the power-user path; *where*: `EasingSidebar.vue:38` region; *why*: the page's most delightful moment is currently a secret with no touch or keyboard path.
5. **Fat-finger the handles** — *what*: add an invisible hit circle (`r≈0.09` sidebar, taller ellipse on hero) behind each rendered handle; *where*: `DemoControlPoint.vue:26-40`; *why*: brings the effective target to ~44px without changing the drawn instrument.
6. **Fix the laptop fold clip** — *what*: ensure the sidebar column scrolls visibly (or the playback card compresses) at 800px-height viewports instead of guillotining Pause/Reverse; *where*: the sidebar pane budget (`EasingSidebar.vue:375-397` measure-first comments document the 579px assumption); *why*: a cut-off button reads as a bug in every screenshot.
7. **Build the comparison "race"** — *what*: the prior doc's shared vertical now-line + per-track `--rainbow-*` stop (red→violet down the stack, full strength on the animating row); *where*: `EasingTarget.vue:103-136,405-434`; *why*: converts the monotone table into the spectrum-of-curves screenshot moment, the crayon palette's one sanctioned job.
8. **Close the copy loop** — *what*: on CopyButton success, a one-shot violet highlight sweep across the readout (the prior doc's unbuilt micro-interaction); *where*: `EasingEditor.vue:45-60`; *why*: confirmation delight at the page's primary export action.

## 6. One on-aesthetic easter egg — "the null curve"

When the authored bezier lands exactly (±ε) on identity — handles dragged to `(0,0,1,1)`, or `linear` typed into the value field — **the instrument acknowledges the null signal**: the dashed `f(t)=t` diagonal reference (`EasingCurveCanvas.vue:368-373`) and the live trace fuse — the diagonal brightens to full `--trace` for one quiet graticule pulse — and the masthead swaps to `EASE · f(t) = t` for a beat while the physics chip auto-reveals `≈ linear, 100% match` (reusing the existing `curve-physics-egg` chip, `EasingSidebar.vue:481-487`). Cheap (one `computed` watching `bezierControlPoints` + a CSS state class), naturally discoverable (everyone flattens the curve while playing), PRM-safe (the pulse is a single opacity keyframe, snapped under reduced motion), and perfectly in the page's voice: an oscilloscope registering a flatline — the one curve that is no curve at all.

## 7. Accessibility notes (from source)

- **Keyboard**: handles are `tabindex="0"` with arrow-nudge + Shift-fine (`DemoControlPoint.vue:33-39,225-249`) — genuinely good. But `role="slider"` is a 1-D role on a 2-D control: `aria-valuenow` reports only `x` while `y` (the value most edits change) is unannounced; `aria-valuemin/max="0/1"` don't cover the y band (−0.6…1.6). Add `aria-valuetext="x 0.25, y 0.10"` (+ `aria-roledescription="curve control point"`), or split per-axis semantics.
- **Focus**: `:focus-visible` suppresses the outline in favor of an r-bump + drop-shadow (`DemoControlPoint.vue:313-317`) — visible but low-contrast on the wash plate; consider a solid 2px ring in `--trace`.
- **Reduced motion**: consistently handled for the smear (`EasingHeroStage.vue:173-175,203,366-372`), the editor blur (`EasingCurveCanvas.vue:440-447`), and the boot self-draw (`EasingHeroStage.vue:242-245`). However the scene **auto-plays a continuous sweep** (`EasingScene.vue:115`) with no PRM gate evident in the loop (`useEasingDemo.ts:202-225`) — under `prefers-reduced-motion` the page should arguably start paused (scrub still works). Verify against the app-shell's global PRM posture.
- **ARIA/labels**: view-mode select has `aria-label="View mode"` (`EasingTarget.vue:65`); the writable field has a real `<label>` + `aria-label` (`EasingSidebar.vue:104-116`); the physics `<dl>` hints its dblclick via `aria-label` (`:142`). The Gallery dblclick has **no** keyboard/SR path at all (refinement 4 fixes this with a real button).
- **Contrast**: axis labels and the masthead at ~0.5 opacity muted-foreground are decorative-tier (aria-hidden masthead — fine); the muted comparison balls at 20% tint are sub-threshold but paired with text labels. The `:user-invalid` field state uses `--destructive` border + 8% fill — visible in both themes.
- **Touch**: see §3 — handle targets below 44px; dblclick-only affordances exclude touch.

---

**Verdict: A−.** A genuinely distinctive, engine-dogfooding instrument — the strongest single-scene aesthetic in the demo — held back from A by a severed mobile feedback loop, sub-floor touch targets, and its own design doc's two unshipped headline items (the Gallery door, the comparison race).
