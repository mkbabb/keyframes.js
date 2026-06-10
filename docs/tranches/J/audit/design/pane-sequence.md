# Pane Audit — Sequence Scene

**Lane:** pane-sequence  
**Screenshots:** sequence-{mobile,laptop,desktop}.png + -open variants  
**Source root:** `demo/sequence/SequenceTarget.vue`, `demo/app/scenes/SequenceScene.vue`

---

## Composition Reading (before findings)

The Sequence scene is a storyboard of 5 draggable-rail rows + a swept master-playhead line, all housed in a single glass `<Card>` with a self-contained transport strip at the bottom. The design language present: glass surface (the card), green `--color-progress` balls + playhead, Instrument Serif at `text-heading` for the scene title, and a mono-caption rung for the row timestamps. What is absent or under-expressed: the scene icon never appears on-canvas; the vast empty right-hand track is pure white/grey void with no mathematical motif; the card title ("Sequence") is barely distinguishable in weight from the inline caption; the animation balls are extremely small (1.4rem, washed mint green) against the card field; the transport strip is low-contrast chrome; the left rail is a lone thin green line in a large white canvas.

---

## Findings Table

| ID | Sev | Title | Screenshot / Region | File |
|----|-----|-------|---------------------|------|
| SEQ-01 | P1 | "Sequence" heading at `text-heading` is the same visual weight as the mono caption beside it — no clear H1 protagonist moment | sequence-laptop.png, card header row | `demo/sequence/SequenceTarget.vue:15` |
| SEQ-02 | P1 | The track area is ~70% empty white void at every breakpoint; the animation targets (balls) are visually tiny (1.4rem, washed-mint) against that void — the protagonist of this scene (the staggered motion) is visually recessive | sequence-desktop.png, track region | `demo/sequence/SequenceTarget.vue:44,87` |
| SEQ-03 | P1 | The master scrubber section at the bottom is styled identically to the status readout row above it — no visual hierarchy separating the PRIMARY interactive control (scrubber) from the secondary readout | sequence-laptop.png / sequence-laptop-open.png, bottom section | `demo/sequence/SequenceTarget.vue:93–115` |
| SEQ-04 | P2 | Row timestamp labels (`@0MS`, `@260MS`…) use `text-mono-caption text-muted-foreground` — they are barely readable, especially on mobile; the `@` prefix and `MS` suffix are present noise with zero contrast differentiation | sequence-mobile.png, label column | `demo/sequence/SequenceTarget.vue:62–64` |
| SEQ-05 | P2 | The swept master-playhead line is 2px wide and drawn at 55% opacity (`color-mix(in srgb, var(--color-progress) 55%, transparent)`) — it reads as a faint hairline rather than the canonical sweep instrument; this is the most expressive live element in the scene and it is visually underpowered | sequence-desktop.png, mid-track | `demo/sequence/SequenceTarget.vue:374` |
| SEQ-06 | P2 | The transport grid (`grid-cols-4`) compresses four buttons equally at all breakpoints — at mobile width (375px) the four cells (Play / Reverse / 1× / Reset) are cramped; Play and Reverse share the playback-button skin but the domain extras (Gauge, RotateCcw) use a different `btn-interactive` class with mismatched pill radius vs the playback buttons | sequence-mobile-open.png, transport strip | `demo/sequence/SequenceTarget.vue:133–172` |
| SEQ-07 | P2 | The card header carries `STAGGER × 5 · PROGRESS 0%` in `text-mono-caption text-muted-foreground` — the math vocabulary ("stagger × N") is buried in the smallest-weight chrome rung at 55% opacity; no display-voice moment for the engine's core concept | sequence-laptop.png, header caption | `demo/sequence/SequenceTarget.vue:15–17` |
| SEQ-08 | P2 | At laptop/desktop the scene card is horizontally centered in the stage but the left rail panel (when open) does not exist for this scene (Sequence exposes no control-surface tabs — `CONTROL_SURFACES.sequence = []`). The stage card therefore floats center with the dock left-rail column fully absent — the entire left half of the viewport is the empty checkerboard background. The scene lacks a left-rail fill or an explicit centering announcement | sequence-laptop.png, left half | `demo/app/scenes/SequenceScene.vue` |
| SEQ-09 | P2 | The `progress-rail` in each row track uses the default 8% tint (`--rail-tint: 8%`) — the rails read as near-invisible hairlines; the track region feels empty rather than showing a clear "travel path" for each ball | sequence-desktop.png, row tracks | `demo/@/styles/design-idioms.css:396` (default) |
| SEQ-10 | OPP | The storyboard area is a large, mostly-empty canvas with five rows each occupying only the leftmost fraction of the available width. The mathematical concept this visualizes (a time-staggered cascade, a staircase of start-offsets) is perfectly suited for a subtle time-axis grid: light vertical tick marks at equal ms intervals across the full track width would dogfood the engine's vocabulary (STAGGER_EACH = 260ms, STAGGER_MAX = 1600ms → ~6 ticks) — a mathematical motif that costs nothing and makes the empty space meaningful | sequence-desktop.png, track region | `demo/sequence/SequenceTarget.vue:44–89` |
| SEQ-11 | OPP | The Sequence icon (a staircase of four vertical bars in violet/blue/cyan/green, `assets/icons/sequence.svg`) never appears within the scene itself — only in the dock nav. An echo of the icon SVG (perhaps ghost-rendered at large scale as a background motif in the card's top-right corner, at ~10% opacity) would bring the expressive color vocabulary of the icons *into* the stage field, connecting dock identity to the live canvas | sequence-laptop.png, card top-right empty area | `demo/sequence/SequenceTarget.vue`, `assets/icons/sequence.svg` |
| SEQ-12 | OPP | The `scrub-ball` (master playhead) is 1.25rem — smaller than the row balls (1.4rem). The master playhead ball should be the DOMINANT ball: it is the ONE element the user interacts with directly to drive the whole storyboard. Enlarging it to at least the default `--ball-size: 36px` (the idiom default) and applying the full glow would signal its primacy in the interaction hierarchy | sequence-laptop.png / sequence-laptop-open.png, master scrubber | `demo/sequence/SequenceTarget.vue:431–435` |
| SEQ-13 | OPP | The five row balls animate in spring-eased sweeps — this is the product demonstrating itself (inv ζ). The current mint-green balls at 1.4rem are visually quiet. Giving each row ball a distinct `--color-progress`-family tint (or even cycling through the `--rainbow-*` family, violet → blue → cyan → green → orange from row 1 to 5, mirroring the staircase icon) would make the stagger visually expressive — you *see* each distinct traveler — while remaining within the established design vocabulary | sequence-desktop.png, row balls | `demo/sequence/SequenceTarget.vue:87`, `demo/@/styles/design-idioms.css:388` |
| SEQ-14 | OPP | The header text "Sequence" uses `text-heading` (a mid-weight serif rung). The scene title is the only candidate for an audacious display moment in this otherwise data-dense card. Setting the title to `text-title` or `text-display` (Instrument Serif's larger rungs) with a bolder weight treatment — and potentially a very subtle gradient echo of the icon's staircase colors — would give the scene its identity mark without decorating chrome | sequence-laptop.png, card header | `demo/sequence/SequenceTarget.vue:15` |
| SEQ-15 | OPP | "master playhead" label (`text-small text-foreground`) uses the UI sans body rung with no mono treatment — yet it names an engine-specific concept. Styling it in `text-mono-caption font-semibold` + the `--color-progress` accent (matching the scrubber ball's color) would create a visual link between the label and its live ball while surfacing the engine vocabulary in Fira Code (the math/code register) | sequence-laptop.png, scrubber label | `demo/sequence/SequenceTarget.vue:95` |

---

## Panel-Open State (open screenshots)

The sequence scene declares `storedControls.isControlsPanelOpen = false` on every mount (SequenceScene.vue:31) and has `CONTROL_SURFACES.sequence = []`, so there are **no control tabs** to open. The `-open` screenshots show the **transport strip revealed** at the bottom of the card (the Play/Reverse/1×/Reset row), which is ALWAYS present inside the card rather than in a separate panel — it is not a controls-panel overlay.

Observations from the `-open` screenshots:
1. At laptop-open the "Play" button has a visually distinct accent treatment (`btn-playback btn-playback-accent`) compared to the outline treatment of the other three buttons, but the contrast is subtle — the accent is a mild color tint on `--color-progress` rather than a filled button. The transport's primary action should be more visually dominant.
2. The grid layout compresses all four buttons to equal width at all breakpoints. Play deserves more visual real estate (wider column, or at least a `col-span-2` on mobile) as the primary verb.
3. The Clapperboard "reel" button in the top-right of the header is a delightful Easter egg affordance (`EE-SEQ-1`) but its 7×7 size and outline treatment makes it nearly invisible against the green READY badge beside it — the two are competing at the same visual weight.

---

## glass-ui Items

| Kind | Item | Proposal |
|------|------|----------|
| REFINE-IN-GLASS-UI | `@utility cartoon-surface` (cards.css:33–48) lacks `border-radius` | Add `border-radius: var(--radius-card)` to `cartoon-surface` so that a bare `cartoon-surface` div is never rendered square by construction — the kf `proof:card-rounded-primitive` gate will green |
| ABSTRACT-INTO-GLASS-UI | The swept-playhead line pattern (a CSS `left: calc(p * 100%)` + `will-change: left` line inside a bounded track) is a general `<PlayheadTrack>` primitive used across Sequence + potentially Spring + MotionPath | Abstract into a parameterized glass-ui `PlayheadTrack` slot component or @utility |
| ADOPT | The `status-badge` / `settled-badge` / `tracking-badge` / `reverse-badge` family is now owned in `design-idioms.css` — a clear candidate for glass-ui's UI token/utility set where status badges are a common pattern in animated UIs | Propose to glass-ui: `@utility settled-badge`, `tracking-badge`, `reverse-badge` consuming a `--badge-tone` param |
