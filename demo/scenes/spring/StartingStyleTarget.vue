<template>
    <!-- The STAGE-CARD register: a standard glass `<Card>` plate, shadow forked
         off. X-DS pass 10 (KF-C10-01) — the title and the artifact row span the
         plate from its ONE inset, as the other four stages' do: their
         `max-w-3xl` cap, centred, set them 2 px in from the inset on a 814 px
         plate (and further on a wider one). The stage is centred, so its cap
         draws nothing and stays; the caption joins the artifact row's start
         column (KF-C11-07).
         KF-SST-25 — `tier="resting"` is reached through Card's `material`
         default and Surface's private material→tier map, which is what stamps
         `data-tier="resting"`; it is NOT a prop this element passes. -->
    <Card :shadow="false" class="h-full w-full overflow-hidden p-0" :style="cardVars">
        <!-- X.KF.W13X.springd (UIA-KF-037 · A2-KE-X-8) — the plate's BODY
             scrolls; nothing in it shrinks below its content. The old column was
             `overflow-hidden` with a `flex-1` stage whose floor (7rem) sat under
             the card's own height, so on a phone the centred card spilled UP over
             the header and DOWN under the toggle, and the artifact and caption
             were clipped under the sheet's peek. `safe center` keeps a column
             taller than the plate from being centred off its top edge. -->
        <div class="entry-body flex h-full w-full flex-col items-center gap-5 overflow-y-auto">
            <!-- KF-SST-28/-16 — the Card header family; `CardTitle`'s
                 `overflow-wrap: anywhere` is why the title needs no `truncate`.
                 UIA-KF-097 — the header carries the title alone: the emitter is
                 named once, on the artifact trigger below. -->
            <!-- X.KF.W13X.sections (A2-KE-L1-8) — the ONE SceneStageHeader (its
                 title is the same glass CardTitle; the header keeps the Card
                 header's one-column grid). -->
            <SceneStageHeader
                title="@starting-style"
                class="grid w-full shrink-0 items-center"
                id-class="min-w-0"
            />

            <!-- UIA-KF-097 — the demonstrand is the hero: the stage takes the
                 free height, and the verb under it is intrinsic-width.
                 X-DS pass 11 (KF-C11-07) — the card and its verb are ONE centred
                 group at one fixed gap (`--space-body`): the viewport no longer
                 grows into the free height, so the leftover space falls around
                 the group, not between the card and the verb that dismisses it
                 (it floated ~135 px below the card). -->
            <div class="entry-stage flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-(--space-body)">
                <!-- The card never leaves the DOM: `.is-open` is the open state,
                     and removing it transitions to `display: none` through
                     `allow-discrete`, so the spring eases entry and exit alike.
                     The polarity is the artifact's (KF-SST-3).
                     UIA-KF-208 · KFA-158 — the card and its SLOT share one grid
                     cell. The slot is the card's footprint, always in flow, so
                     the stage is never shorter than the card (it was 112 px
                     against a 114-170 px card) and the dismissed state names
                     where the card will enter instead of leaving a hole. -->
                <div class="stage-viewport">
                    <div class="entry-slot" :data-empty="visible ? undefined : ''" aria-hidden="true">
                        <span v-if="!visible" class="text-caption text-muted-foreground">
                            dismissed
                        </span>
                    </div>
                    <div :id="cardId" class="discrete-card" :class="{ 'is-open': visible }">
                        <span class="text-title text-foreground">Hello, spring.</span>
                        <span class="text-small text-muted-foreground">
                            enters + exits on a physics curve
                        </span>
                    </div>
                </div>

                <!-- KF-SST-1/-6 — the surviving verb, and it has a state.
                     `aria-expanded` + `aria-controls` is the disclosure pattern;
                     `data-state` is the producer's own state-indication seam
                     (glass keys forced-colors and prefers-contrast indication on
                     `[data-state="on"]`, never on `[aria-expanded]`).
                     UIA-KF-097 — a plain glass Button at its intrinsic width: the
                     transport's `.btn-playback` skin (`width: 100%`, the full
                     accent) made a 748 px stadium the loudest mark on the page. -->
                <Button
                    class="shrink-0"
                    :aria-expanded="visible"
                    :aria-controls="cardId"
                    :data-state="visible ? 'on' : 'off'"
                    @click="toggle"
                >
                    <!-- OA-61 — named by its word alone: the eye / eye-off pair is
                         the ball preview's one toggle (PreviewToggle). -->
                    <span>{{ visible ? "Dismiss" : "Reveal" }}</span>
                </Button>
            </div>
            <!-- The copy-pasteable artifact: the REAL `compileToEntry` output for
                 this card. KF-SST-11/-12 — what is rendered IS what is copied,
                 and an artifact the panel cannot vouch for is refused, not shown.
                 UIA-KF-097 — secondary: folded behind a disclosure (it was an
                 always-open 256 px block of numeric stops), with Copy beside the
                 trigger so the artifact is copyable folded or open. -->
            <div class="w-full shrink-0">
                <Collapsible v-if="artifact.kind === 'ready'" v-model:open="artifactOpen">
                    <!-- X-DS pass 10 (KF-C10-04) — the copy control TRAILS the
                         trigger it copies (EasingTarget's literal + CopyButton
                         pair); `justify-between` threw it ~530 px to the plate's
                         far edge. KF-C10-03 — the trigger's chevron lands on the
                         stage column's text edge (`button-text-flush`). -->
                    <div class="flex items-center justify-start gap-2">
                        <CollapsibleTrigger as-child>
                            <Button emphasis="quiet" size="sm" class="artifact-trigger button-text-flush">
                                <ChevronRight class="artifact-chevron size-4" aria-hidden="true" />
                                <span :id="labelId" class="whitespace-nowrap">compileToEntry() CSS</span>
                            </Button>
                        </CollapsibleTrigger>
                        <!-- KF-SST-29 — the control names what it copies, and there
                             is no control when there is nothing faithful to copy. -->
                        <CopyButton :text="artifact.css" label="Copy the @starting-style artifact" />
                    </div>
                    <CollapsibleContent>
                        <!-- KF-SST-9 — a named, focusable, readable region. -->
                        <code
                            class="artifact text-mono-small tabular-nums text-muted-foreground mt-2 block w-full"
                            data-register="code"
                            tabindex="0"
                            role="region"
                            :aria-labelledby="labelId"
                            >{{ artifact.css }}</code
                        >
                    </CollapsibleContent>
                </Collapsible>
                <!-- UIA-KF-207 — three states, three surfaces: compiling is a
                     skeleton, a refusal is a warning that names the emitter's own
                     reasons, and a mismatch is a destructive alert. -->
                <Skeleton
                    v-else-if="artifact.kind === 'compiling'"
                    class="artifact-skeleton w-full"
                    role="status"
                    aria-label="Compiling the @starting-style artifact"
                />
                <Alert v-else-if="artifact.kind === 'refused'" tone="warning" announce="polite">
                    <AlertTitle>compileToEntry() refused this card</AlertTitle>
                    <AlertDescription>
                        <ul class="list-disc pl-4">
                            <li v-for="r in artifact.refusals" :key="r.reason">{{ r.message }}</li>
                        </ul>
                    </AlertDescription>
                </Alert>
                <Alert v-else tone="destructive" announce="polite">
                    <AlertTitle>This artifact does not describe the card above</AlertTitle>
                    <AlertDescription>It is not safe to paste, so it is not shown.</AlertDescription>
                </Alert>
            </div>

            <!-- UIA-KF-097 — ONE caption carries the meta: the spring that eases
                 the card and what that spring's time is (the emitter is named
                 once, on the artifact's own trigger above). The old
                 three lines named two different emitters for one block and ended
                 on a disclaimer ("response is not expressed on this card"), which
                 the settle-derived duration retires (UIA-KF-096).
                 `text-mono-small` is the case-preserving rung: `text-mono-caption`
                 would uppercase ζ into Ζ, a different letter (KF-SST-5). -->
            <!-- X-DS pass 11 (KF-C11-07) — one footer, one alignment: the
                 caption sits on the artifact row's start column (it was centred
                 under a start-aligned row). -->
            <p class="entry-caption flex w-full shrink-0 flex-wrap items-center justify-start gap-x-2 gap-y-1">
                <span class="text-caption text-muted-foreground">eased by</span>
                <!-- X-DS pass 12 (KF-C12-02) — the preset NAME carries the
                     weight, inline in the caption run (the C11-02 rule). The
                     static glass Chip it replaced (UIA-KF-209) painted the
                     neutral capsule (glass 10.1.0 reads `tone` only in the
                     selectable 'on' state), so a fact read as a second action
                     beside Dismiss. Glass rider under O-87: a static Chip
                     should honour `tone`. -->
                <span class="entry-preset text-caption font-medium text-foreground capitalize">{{
                    activePresetName
                }}</span>
                <span class="text-mono-small text-muted-foreground tabular-nums whitespace-nowrap">
                    ζ {{ demo.dampingFraction.value.toFixed(2) }} · in {{ timing.enter.durationMs }} ms · out
                    {{ timing.exit.durationMs }} ms
                </span>
            </p>
        </div>
    </Card>
</template>

<script lang="ts">
/**
 * THE ENTRY CONTRACT — the one source of truth for this card's endpoints
 * (KF-SST-3 · KF-SST-4).
 *
 * The panel promises that a designer pastes the artifact verbatim to reproduce
 * the card. That was false on five counts because nothing bound the two halves:
 * no shared constant, token, test or type. This constant is that binding — the
 * card's CSS is authored from it, and `test/demo/scenes/starting-style-artifact.test.ts`
 * asserts that what the shipped `compileToEntry` emits satisfies it.
 *
 * The CARD moved onto the ARTIFACT's contract, not the reverse: what a consumer
 * receives is the published truth. The price: the card's independent
 * `translate`/`scale` is retired for the artifact's `transform` list. Restoring
 * it means emitting `translate`/`scale` from `ENTER_KEYFRAMES` — at which point
 * the test fails until this block follows, which is the point of writing the
 * endpoints down once.
 */
export const ENTRY_CONTRACT = {
    /** The card's selector, as the emitter is asked to compile it. */
    selector: ".discrete-card",
    /** The open-state selector the emitter is given (`openSelector`). */
    openSelector: ".is-open",
    /** The open-state `display` the emitter is given. */
    display: "flex",
    /* X.KF.W13X.springd (UIA-KF-096) — no duration literal: the timing is the
       spring's own settle span per direction, `entryTiming()` in
       `useCompiledEntry.ts`, and the card and the artifact are both written
       from the one `CompiledEntry.timing` the compile publishes. */
    /** Base / exit endpoints — the `@starting-style` FROM-state as well. */
    closed: { opacity: "0", transform: "translateY(20px) scale(0.9)" },
    /** Open endpoints. */
    open: { opacity: "1", transform: "translateY(0px) scale(1)" },
} as const;
</script>

<script setup lang="ts">
import { computed, inject, ref, useId } from "vue";
import { ChevronRight } from "@lucide/vue";
// KF-KE-53's sweep at this file: subpaths where glass publishes one; Alert and
// Skeleton ship on the root entry only (glass 10.1.0 `exports` has no subpath
// for either).
import { Alert, AlertDescription, AlertTitle, Skeleton } from "@mkbabb/glass-ui";
import { Button } from "@mkbabb/glass-ui/button";
import { Card } from "@mkbabb/glass-ui/card";
import SceneStageHeader from "../SceneStageHeader.vue";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@mkbabb/glass-ui/collapsible";
import type { EntryRefusal } from "@mkbabb/keyframes.js";

import CopyButton from "@components/CopyButton/CopyButton.vue";

import { SPRING_DEMO_KEY } from "./springKeys";
import { SPRING_PRESETS } from "./springPresets";

// The spring scene's discrete view. `visible`/`toggle` are the demo composable's,
// so this sub-view lives inside the scene's single ScenePlayback registration —
// this Target only reads and drives them.
const demo = inject(SPRING_DEMO_KEY)!;
const visible = demo.visible;
const toggle = demo.toggleDiscrete;

const cardId = useId();
const labelId = useId();

/** UIA-KF-097 — the artifact is secondary: folded until asked for. */
const artifactOpen = ref(false);

// The active preset NAME for the caption; "custom" when the shared params match
// no canonical preset.
const activePresetName = computed(() => {
    const match = SPRING_PRESETS.find(
        (p) =>
            Math.abs(demo.response.value - p.response) < 1e-6 &&
            Math.abs(demo.dampingFraction.value - p.dampingFraction) < 1e-6,
    );
    return match?.name ?? "custom";
});

/**
 * X.KF.W13X.springd (UIA-KF-096 · KFA-45 · KFA-215) — the card animates on the
 * timing its artifact was compiled from: ONE `CompiledEntry.timing`, published by
 * `useCompiledEntry` in the same write as the compile result, so a slider drag
 * never shows the card at one spring and the artifact at another. Each
 * direction gets its own duration and curve — the entry is the live spring,
 * the exit that spring critically damped (it never overshoots past closed).
 * `easing.css` is `springLinearStops()` over the settle span, byte-for-byte what
 * the artifact carries inline.
 */
const timing = computed(() => demo.compiledEntry.value.timing);
const cardVars = computed(() => ({
    "--entry-duration": `${timing.value.enter.durationMs}ms`,
    "--entry-ease": timing.value.enter.easing.css,
    "--exit-duration": `${timing.value.exit.durationMs}ms`,
    "--exit-ease": timing.value.exit.easing.css,
}));

/**
 * The artifact's state — four states, never laundered into one string
 * (UIA-KF-207: `compileToEntry` returns `{ css, eligible, refusals }`, and a
 * refusal is its own state with the emitter's own reasons).
 *
 * `ready` requires that the emitted CSS actually describe THIS card: a fidelity
 * surface verifies the promise it makes.
 */
type ArtifactState =
    | { kind: "compiling" }
    | { kind: "refused"; refusals: EntryRefusal[] }
    | { kind: "mismatched"; css: string }
    | { kind: "ready"; css: string };

const describesThisCard = (css: string): boolean =>
    css.includes(`${ENTRY_CONTRACT.selector}${ENTRY_CONTRACT.openSelector}`) &&
    css.includes(ENTRY_CONTRACT.closed.transform) &&
    css.includes(ENTRY_CONTRACT.open.transform) &&
    css.includes(`${timing.value.enter.durationMs}ms`) &&
    css.includes(`${timing.value.exit.durationMs}ms`);

const artifact = computed<ArtifactState>(() => {
    const result = demo.compiledEntry.value.result;
    if (result === null) return { kind: "compiling" };
    if (!result.eligible || result.css === "") {
        return { kind: "refused", refusals: result.refusals };
    }
    return describesThisCard(result.css)
        ? { kind: "ready", css: result.css }
        : { kind: "mismatched", css: result.css };
});
</script>

<style scoped>
/* X.KF.W13X.springd — `safe center`: a body taller than the plate starts at its
   top edge instead of being centred off it (UIA-KF-037). */
.entry-body {
    justify-content: safe center;
    /* X-DS pass 10 (KF-C10-01) — the fifth stage reads the ONE stage-plate
       inset (layout.css, KF-C9-04); its own px-6 py-5 lg:px-8 set the title
       one gutter further in than Easing, Spring, Sequence and Square. */
    padding-inline: var(--stage-plate-pad-inline);
    padding-block: var(--stage-plate-pad-block);
}

/* The stage: the card and its slot share ONE grid cell (KFA-158 · UIA-KF-208).
   The block padding is the card's from-state travel (`translateY(20px)`), so the
   entering card never crowds the verb below it. */
.stage-viewport {
    display: grid;
    place-items: center;
    width: 100%;
    flex: none;
    padding-block: 1.25rem;
    --entry-card-inline: min(100%, 22rem);
    --entry-card-block: 8rem;
}

.stage-viewport > * {
    grid-area: 1 / 1;
}

/* The card's footprint, always in flow. Empty while the card is shown (the card
   paints over it); dismissed, it is the dashed settled-state register this scene
   already uses for "rest", naming where the card will enter. */
.entry-slot {
    display: grid;
    place-items: center;
    inline-size: var(--entry-card-inline);
    min-block-size: var(--entry-card-block);
    border-radius: var(--radius-card);
}

.entry-slot[data-empty] {
    outline: 1px dashed color-mix(in srgb, var(--color-progress) 45%, transparent);
    outline-offset: -1px;
}

/* The discrete entry/exit card — AUTHORED FROM `ENTRY_CONTRACT`: base CLOSED,
   `.is-open` OPEN, `@starting-style` on the open selector, the same endpoints.
   `allow-discrete` rides INSIDE the shorthand, per property, as the emitter
   writes it — `display` and `overlay` get discrete behaviour and nothing else
   does.
   X.KF.W13X.springd (UIA-KF-096 · KFA-45 · KFA-215) — the durations and curves
   are the compiled timing's, per direction, as the artifact publishes them: the
   base rule's list is the EXIT (it applies when `.is-open` leaves), the open
   rule's list is the ENTRY. */
.discrete-card {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    inline-size: var(--entry-card-inline);
    min-block-size: var(--entry-card-block);
    padding: 1.25rem 1.5rem;
    text-align: center;
    /* UIA-KF-209 — a card-role plate sits on the card radius role. */
    border-radius: var(--radius-card);
    /* KF-SST-18 — the 14% wash is the contrast floor keeping `--muted-foreground`
       ink above AA on this plate (≈4.8:1 light / ≈4.7:1 dark), not a decorative
       percentage. */
    background: color-mix(in srgb, var(--color-progress) 14%, transparent);
    /* KF-SST-17 — an outline, the file's own idiom: it survives forced colors
       and out of flow it perturbs no geometry. X-DS pass 1 (KF-P1-09): it is
       the plate's ONE edge; the 32px tinted halo is deleted. */
    outline: 1px solid color-mix(in srgb, var(--color-progress) 45%, transparent);
    outline-offset: -1px;

    opacity: 0;
    transform: translateY(20px) scale(0.9);

    transition:
        opacity var(--exit-duration) var(--exit-ease),
        transform var(--exit-duration) var(--exit-ease),
        display var(--exit-duration) allow-discrete,
        overlay var(--exit-duration) allow-discrete;
}

.discrete-card.is-open {
    display: flex;
    opacity: 1;
    transform: translateY(0px) scale(1);
    transition:
        opacity var(--entry-duration) var(--entry-ease),
        transform var(--entry-duration) var(--entry-ease),
        display var(--entry-duration) allow-discrete,
        overlay var(--entry-duration) allow-discrete;
}

/* Entry FROM-state: the browser transitions out of these on first render. */
@starting-style {
    .discrete-card.is-open {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
    }
}

/* KF-SST-13 — the local PRM block is DELETED, and this is why: glass's unlayered
   `*:not([data-allow-motion]) { … !important }` beats any normal-weight local
   rule, the rendered outcome is already right (transform is absent from its
   allow-list, so it snaps), and the one lever that would let a local rule win —
   `data-allow-motion` — opts the element OUT of the house kill switch. PRM here
   is the producer's, deliberately. */

.artifact-chevron {
    transition: transform var(--duration-fast, 150ms) ease;
}

/* X-DS pass 12 (KF-C12-04) — the copy pair is spaced INK TO INK, as the
   easing literal's pair is (KF-C11-06). `button-text-flush` cancels the
   trigger's start padding; its trailing padding and 1px edge stayed inside the
   row's gap, so Copy's glyph sat ~31 px after the label's last letter (the
   literal's sits at 15). The same expression, mirrored on the end side. */
.artifact-trigger {
    margin-inline-end: calc(-1 * (var(--button-size) / 2 - var(--space-residue)) - 1px);
}

.artifact-trigger[data-state="open"] .artifact-chevron {
    transform: rotate(90deg);
}

.artifact {
    padding: 0.5rem 0.75rem;
    /* UIA-KF-209 — a multi-line holder sits on the field radius role (it was
       `--radius-md`, 6px). */
    border-radius: var(--radius-field);
    background: color-mix(in srgb, var(--muted) 50%, transparent);
    /* KF-SST-9 — wrapping the long `linear()` bodies changes no byte, so what is
       rendered is still exactly what is copied. */
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    max-height: 16rem;
    overflow-y: auto;
}

/* A focusable region must show its focus. */
.artifact:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
}

.artifact-skeleton {
    block-size: 2.25rem;
    border-radius: var(--radius-field);
}
</style>
