<template>
    <!-- I5 (H.W11.S1) — the STAGE-CARD register (REVERSES W10 G8 full-bleed).
         A standard, NON-cartoon glass `<Card>` (the protagonist plate;
         `tier="resting" surface="glass"`, rounded-card by construction → I4 for
         free). The control PANELS stay cartoon+quiet (W2/W9). Dock-band
         containment is the surviving [stage]-track `.stage-cell` PRIMITIVE.
         `shadow={false}` (FORK I5-shadow). `max-w-3xl` rides the content column
         as an optical reading measure. -->
    <Card
        :shadow="false"
        class="flex flex-col items-center justify-center gap-6 h-full w-full px-6 lg:px-8 overflow-hidden"
        :style="{ '--spring-ease': springCss }"
    >
        <!-- Header readout — KF-SST-28 + KF-SST-16 (W6-I): the Card HEADER
             FAMILY (`CardHeader` / `CardTitle` / `CardAction`) instead of a
             hand-rolled flex row. `CardTitle` ships `overflow-wrap: anywhere`
             + `min-width: 0` (`.card-title`), which is KF-SST-16's cure for
             free: the title no longer wears `truncate` (a 0-min-size that let
             the loudest rung shrink to nothing while the caption's `nowrap`
             made the quietest unshrinkable); the caption rides `CardAction`,
             the header's own second column. The plate's inline-only padding
             (KF-SST-24) is not re-decided here: the header keeps the reading
             measure and `p-0` so the stage layout below is untouched. -->
        <CardHeader class="w-full max-w-3xl shrink-0 items-center p-0">
            <!-- KF-SS-9 (routed from unit `.h` §5.1 — ONE REGISTER DECISION PER
                 ROLE, decided there ONCE and spent here, never decided twice).
                 The spring scene's two faces wore two different type systems in
                 the identical structural slot: `SpringTarget`'s poster title is
                 `text-display` and this one was `text-heading` — a different
                 family, rung and weight, one fluid and one not, for the same
                 role one view switch apart. The role is "scene face title", and
                 the census `.h` ran found every other scene poster title
                 (easing, sequence, square, spring-solver) already on
                 `text-display`; this was the sole outlier, so the decision is
                 the four siblings' and this is the byte that joins them. -->
            <CardTitle class="text-display text-foreground">@starting-style</CardTitle>
            <!-- KF-SS-4 (W6-N, re-homed from KF.W5), site 2 — CHIP THE
                 IDENTIFIER. `text-mono-caption` carries `text-transform:
                 uppercase` at the installed producer bytes, so this caption
                 rendered the library's own exported symbol as
                 `SPRINGLINEARSTOPS()`. A JS identifier is case-sensitive; an
                 all-caps rendering of one is not a style, it is a wrong name.
                 The `_monoContract` clause the demo wrote for exactly this
                 (an explicit identifier CHIP marked `data-register="code"`)
                 applies: the identifier becomes the chip, the sentence around
                 it takes the text voice, and the caps register never touches a
                 name again. `tabular-nums` leaves with the caption — there are
                 no digits on this line. -->
            <CardAction class="self-center">
                <span class="text-caption text-muted-foreground whitespace-nowrap">
                    eased by
                    <span class="text-mono-small" data-register="code"
                        >springLinearStops()</span
                    >
                </span>
            </CardAction>
        </CardHeader>

        <!-- The discrete-transition stage. The card enters from nothing
             (@starting-style) and exits to display:none (allow-discrete),
             eased by the keyframes.js spring linear() in --spring-ease. -->
        <div class="flex w-full max-w-3xl flex-1 min-h-0 flex-col items-center justify-center gap-5">
            <div class="stage-viewport relative w-full flex-1 min-h-0 flex items-center justify-center">
                <!-- The card stays in the DOM; toggling `.is-hidden`
                     transitions display:none via allow-discrete, so the
                     spring eases BOTH the entry (@starting-style) and the
                     exit (transition TO the hidden state) — the declarative
                     discrete-transition primitive, no JS removal timing. -->
                <div class="discrete-card" :class="{ 'is-hidden': !visible }">
                    <span class="text-title text-foreground">Hello, spring.</span>
                    <span class="text-small text-muted-foreground">
                        enters + exits on a physics curve
                    </span>
                </div>
            </div>

            <Button
                emphasis="secondary"
                class="btn-playback btn-playback-accent shrink-0"
                @click="toggle"
            >
                <span>{{ visible ? "Dismiss" : "Reveal" }}</span>
                <component :is="visible ? EyeOff : Eye" class="w-4 h-4" />
            </Button>
        </div>

        <!-- S.F3 EN-d DOGFOOD — the copy-pasteable artifact is the REAL
             `compileToEntry` output for THIS card's entry/exit (its opacity/
             transform endpoints eased by the same spring), not a hand-typed
             timing-function line. A designer pastes it verbatim to reproduce the
             discrete transition: base(closed) + `.is-open` + `@starting-style`,
             with `display`/`overlay` `allow-discrete` and the spring `linear()`. -->
        <!-- KF-SS-4 (W6-N), site 1 — THE HARDEST INSTANCE IN THE TREE, and the
             one this row exists for. The block above declares this artifact
             "copy-pasteable … a designer pastes it verbatim", and the copy
             control beside it copies the RAW string — while the `<code>` below
             wore `text-mono-caption`, whose `text-transform: uppercase`
             (measured in the installed `typography/utilities.css`) rendered the
             whole emitted rule in capitals. CSS class selectors and custom
             idents are CASE-SENSITIVE, so on a surface whose entire charter is
             literal fidelity, READ ≠ COPY: what a designer transcribes by eye
             does not parse, and only the clipboard path happens to work.
             The register is the banked cure and the family's, not a new one:
             FOLDS ≡ banked kf-EasingSidebar KF-ES-8 (the uppercase
             `text-mono-caption` family) as an EXTENSION with new sites — never
             a re-booking. `text-mono-small` is the case-preserving mono rung
             (no `text-transform`, no caps tracking, measured at the same
             producer file), and this is real code content inside a `<code>`,
             so it satisfies the `_monoContract`'s first clause outright.
             The author knew the hazard: `SpringTarget.vue` spells
             `text-transform: none` for the same reason one file over. -->
        <div class="w-full max-w-3xl shrink-0">
            <div class="flex items-center justify-between mb-1.5">
                <span class="text-small text-foreground">compileToEntry() artifact</span>
                <!-- S-7 (W6-I): the copy control is a glass Button that owns
                     its box; the caller's 16px `w-4 h-4` (KF-CB-5's second
                     site) is gone. -->
                <CopyButton :text="compiledEntryCss || copyableCss" />
            </div>
            <code class="artifact text-mono-small tabular-nums text-muted-foreground block w-full max-h-32 overflow-auto whitespace-pre" data-register="code">{{ compiledEntryCss || springCss }}</code>
        </div>

        <!-- K.W4 S5 — the redundant 4-preset ROW is RETIRED (the same four
             presets were shown THREE times: here + the spring rail's own preset
             cells + implicitly the sliders, live-spring-sequence-mp-verdict.md
             §4 — KF-SS-31: the two routes to a spring "sidebar" component
             this block used to carry name a file that exists at no path). The
             ONE preset surface now lives in that rail; this discrete
             stage demotes to a single QUIET result line naming the active preset
             (the same shared params drive it), so the discrete view stays
             legible about WHICH spring it eases without re-mounting the picker. -->
        <div class="active-preset-line flex w-full max-w-3xl items-center justify-center gap-2 shrink-0">
            <span class="text-caption text-muted-foreground">eased by</span>
            <span class="active-preset-chip text-mono-small capitalize" data-register="code">{{ activePresetName }}</span>
            <span class="text-mono-caption text-muted-foreground tabular-nums">
                ({{ demo.response.value.toFixed(2) }} / {{ demo.dampingFraction.value.toFixed(2) }})
            </span>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
// KF-KE-53's sweep at this file: subpaths, no root barrel.
import { Button } from "@mkbabb/glass-ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@mkbabb/glass-ui/card";
import { Eye, EyeOff } from "@lucide/vue";

import { useSpringLinearStops } from "./useSpringLinearStops";
import CopyButton from "@components/CopyButton.vue";

import { SPRING_DEMO_KEY } from "./springKeys";
import { SPRING_PRESETS } from "./springPresets";

// The discrete view of the Spring scene (H.W5.S3 — merged from the former
// standalone Discrete scene). `visible` / `toggle` are owned by the SPRING demo
// composable so the merged sub-view lives within the spring scene's SINGLE
// ScenePlayback registration — this Target only reads + drives them.
const demo = inject(SPRING_DEMO_KEY)!;
const visible = demo.visible;
const toggle = demo.toggleDiscrete;

// K.W4 S5 — the active preset NAME for the quiet result line (the redundant
// 4-cell picker is retired; the ONE preset surface lives in the spring's own
// controls rail — KF-SS-31: the former wording routed to a spring "sidebar"
// component whose file exists at no path in this repository).
// Falls back to "custom" when the shared params don't match a canonical preset.
const activePresetName = computed(() => {
    const match = SPRING_PRESETS.find(
        (p) =>
            Math.abs(demo.response.value - p.response) < 1e-6 &&
            Math.abs(demo.dampingFraction.value - p.dampingFraction) < 1e-6,
    );
    return match?.name ?? "custom";
});

// The emitted CSS linear() — the ONE springLinearStops surface
// (useSpringLinearStops, H.W5.S3), sampled off the SAME shared params the
// live-solver rail reads; here it drives a real @starting-style transition AND
// is offered as the copy-pasteable artifact a designer pastes into a stylesheet.
const springCss = useSpringLinearStops(
    () => demo.response.value,
    () => demo.dampingFraction.value,
);

// The clipboard payload: the full declaration, ready to paste.
const copyableCss = computed(
    () => `transition-timing-function: ${springCss.value};`,
);

// S.F3 EN-d — the REAL `compileToEntry` artifact for this card's entry/exit,
// compiled off the SAME shared spring params (dogfood: the demo runs the
// published emitter and shows its verbatim output, not a hand-typed twin).
// T.B1-β/T.B7 — the compile now lives in useSpringDemo (its `entryAnim` IS the
// facility's Entry channel); this target renders the demo-owned readout.
const compiledEntryCss = demo.compiledEntryCss;
</script>

<style scoped>
.stage-viewport {
    min-height: 7rem;
}

/* ── K.W4 S5 — the quiet active-preset result line (the retired picker's heir) ──
   The discrete view names WHICH spring it eases as a single chip wearing the
   DASHED motion language (the --color-progress token as a dashed outline — the
   settled-state register U-K17 prefers), NOT a redundant 4-cell picker.

   KF-SS-6 (W6-N) — "red-dashed … repointed red by Lane B" was false on the
   colour word and stale on the provenance. `--color-progress` resolves through
   `--accent-kf` to `light-dark(oklch(0.56 0.17 295), oklch(0.74 0.13 305))`:
   hue 295/305, VIOLET, in both themes. The dash is the register; the hue is the
   token's, and the token is the one authority — which is exactly why no colour
   word belongs in a comment about it. Perceptual questions about the violet
   pair stay KF.W9 / SS-13's; the PRESERVATION LOCK on the token-level lane
   pairing is untouched here (this chip reads the progress token directly and
   names no lane). */
.active-preset-chip {
    color: color-mix(in srgb, var(--color-progress) 60%, var(--foreground));
    padding: 0.05rem 0.5rem;
    border-radius: var(--radius-pill);
    outline: 1px dashed color-mix(in srgb, var(--color-progress) 45%, transparent);
    outline-offset: -1px;
    background: color-mix(in srgb, var(--color-progress) 8%, transparent);
}

/* The discrete entry/exit card. The visible state is the base; @starting-style
   is the entry FROM-state; .is-hidden is the exit TO-state (display:none). The
   spring linear() (--spring-ease) eases opacity + translate + scale; display
   rides transition-behavior: allow-discrete so the card stays painted through
   the exit instead of vanishing instantly. */
.discrete-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 1.5rem 2.5rem;
    border-radius: var(--radius-lg, 1rem);
    background: color-mix(in srgb, var(--color-progress) 14%, transparent);
    box-shadow: 0 8px 32px color-mix(in srgb, var(--color-progress) 24%, transparent);

    opacity: 1;
    translate: 0 0;
    scale: 1;

    transition:
        opacity var(--duration-slow, 500ms) var(--spring-ease, ease),
        translate var(--duration-slow, 500ms) var(--spring-ease, ease),
        scale var(--duration-slow, 500ms) var(--spring-ease, ease),
        display var(--duration-slow, 500ms);
    /* MANDATORY for the display discrete transition — a separate declaration so
       a non-supporting engine still honors the opacity/translate/scale list. */
    transition-behavior: allow-discrete;
}

/* Entry FROM-state: the browser transitions out of these on first render. */
@starting-style {
    .discrete-card {
        opacity: 0;
        translate: 0 1.25rem;
        scale: 0.9;
    }
}

/* Exit TO-state: the card eases to here, then display:none takes it (discrete). */
.discrete-card.is-hidden {
    display: none;
    opacity: 0;
    translate: 0 1.25rem;
    scale: 0.9;
}

/* The former scoped active-ring rule is DELETED (J.W7b S1b, no-legacy): the
   active affordance hangs off the consumed primitive's own `data-state="on"`
   seam, same scene-semantic --color-progress ring via the call-site class.
   KF-ET-33 — this used to attribute that seam to a toggle-flavoured chip
   component, a vendor name the installed glass-ui 7.0.0 does not export (its
   `./chip` entry publishes `Chip` and `chipVariants`; that spelling occurs zero
   times in the whole dist).
   Census S-2's class, EXTENDED with the site and never re-booked; the same
   stale name is corrected at `EasingTarget.css` in this commit, which is the
   other half of the two-site figure the row measures. */

.artifact {
    padding: 0.4rem 0.6rem;
    border-radius: var(--radius-md, 0.5rem);
    background: color-mix(in srgb, var(--muted) 50%, transparent);
}

/* MANDATORY PRM degrade: no transition under reduced motion — an instant,
   clean toggle (the discrete display change still applies, just without motion). */
@media (prefers-reduced-motion: reduce) {
    .discrete-card {
        transition: none;
    }
}
</style>
