<template>
    <!-- The STAGE-CARD register: a standard glass `<Card>` plate, shadow forked
         off, `max-w-3xl` as the reading measure.
         KF-SST-25 — `tier="resting"` is reached through Card's `material`
         default and Surface's private material→tier map, which is what stamps
         `data-tier="resting"`; it is NOT a prop this element passes. -->
    <Card
        :shadow="false"
        class="flex flex-col items-center gap-6 h-full w-full px-6 py-5 lg:px-8 overflow-hidden"
        :style="{ '--spring-ease': springCss }"
    >
        <!-- KF-SST-28/-16 — the Card header family; `CardTitle`'s
             `overflow-wrap: anywhere` is why the title needs no `truncate`. -->
        <CardHeader class="w-full max-w-3xl shrink-0 items-center p-0">
            <CardTitle class="text-display text-foreground">@starting-style</CardTitle>
            <!-- KF-SST-33 — "eased by" named two different objects in one plate;
                 this one names the emitter. `text-mono-small` is the
                 case-preserving rung: `text-mono-caption` uppercases, and an
                 all-caps rendering of a case-sensitive identifier is a wrong
                 name, not a style (KF-SST-5). -->
            <!-- glass 8.0.0 deleted CardAction (and the header's `:has()` grid
                 fork): the caption sits in the header by itself. -->
            <p class="self-center">
                <span class="text-caption text-muted-foreground whitespace-nowrap">
                    emitted by
                    <span class="text-mono-small" data-register="code"
                        >springLinearStops()</span
                    >
                </span>
            </p>
        </CardHeader>

        <div class="flex w-full max-w-3xl flex-1 min-h-0 flex-col items-center justify-center gap-5">
            <!-- KF-SST-15 — the stage's floor is `min-height: 7rem` below, and it
                 is declared once: the `min-h-0` that used to sit here could never
                 win against it. -->
            <div class="stage-viewport relative w-full flex-1 flex items-center justify-center">
                <!-- The card never leaves the DOM: `.is-open` is the open state,
                     and removing it transitions to `display: none` through
                     `allow-discrete`, so the spring eases entry and exit alike.
                     The polarity is the artifact's (KF-SST-3). -->
                <div :id="cardId" class="discrete-card" :class="{ 'is-open': visible }">
                    <span class="text-title text-foreground">Hello, spring.</span>
                    <span class="text-small text-muted-foreground">
                        enters + exits on a physics curve
                    </span>
                </div>
            </div>

            <!-- KF-SST-1/-6 — the surviving verb, and it has a state.
                 DECISION: the in-card copy survives (it is the unconditionally
                 reachable one; the ribbon twin rides a sheet-at-peek below `lg`),
                 and retiring that twin is a `SpringScene.vue` byte this unit does
                 not own. `aria-expanded` + `aria-controls` is the disclosure
                 pattern; `data-state` is the producer's own state-indication seam
                 (glass keys forced-colors and prefers-contrast indication on
                 `[data-state="on"]`, never on `[aria-expanded]`). `emphasis` is
                 not restated — `secondary` is the dist default (KF-SST-33). -->
            <Button
                class="btn-playback btn-playback-accent shrink-0"
                :aria-expanded="visible"
                :aria-controls="cardId"
                :data-state="visible ? 'on' : 'off'"
                @click="toggle"
            >
                <span>{{ visible ? "Dismiss" : "Reveal" }}</span>
                <component :is="visible ? EyeOff : Eye" class="w-4 h-4" />
            </Button>
        </div>

        <!-- The copy-pasteable artifact: the REAL `compileToEntry` output for
             this card. KF-SST-11/-12 — what is rendered IS what is copied, and an
             artifact the panel cannot vouch for is refused, not shown. -->
        <div class="w-full max-w-3xl shrink-0">
            <div class="flex items-center justify-between gap-2 mb-1.5">
                <span :id="labelId" class="text-small text-foreground"
                    >compileToEntry() artifact</span
                >
                <!-- KF-SST-29 — the control names what it copies, and there is no
                     control when there is nothing faithful to copy. -->
                <CopyButton
                    v-if="artifact.kind === 'ready'"
                    :text="artifact.css"
                    label="Copy the @starting-style artifact"
                />
            </div>
            <!-- KF-SST-9 — a named, focusable, readable region: 2190 chars over 21
                 lines with a 943-char longest line had no role, no name and no
                 `tabindex`, and scrolled sideways under `white-space: pre`. -->
            <code
                v-if="artifact.kind === 'ready'"
                class="artifact text-mono-small tabular-nums text-muted-foreground block w-full"
                data-register="code"
                tabindex="0"
                role="region"
                :aria-labelledby="labelId"
                >{{ artifact.css }}</code
            >
            <p v-else class="artifact-status text-caption" role="status">
                {{ artifactStatus }}
            </p>
        </div>

        <!-- One quiet line naming WHICH spring eases the card; the one preset
             surface lives in the spring's own controls rail. -->
        <div class="active-preset-line flex w-full max-w-3xl items-center justify-center gap-2 shrink-0">
            <span class="text-caption text-muted-foreground">eased by</span>
            <span class="active-preset-chip text-mono-small capitalize" data-register="code">{{
                activePresetName
            }}</span>
            <!-- KF-SST-2 — the readout names what it actually expresses. Only ζ
                 shapes this card: `springLinearStops` is self-similar under
                 `response` (max|Δv| ≈ 2e-5 across the slider's whole range against
                 3.0e-1 for ζ), and the duration is the artifact's fixed 500ms.
                 DECISION: the duration stays pinned to the artifact's — a card
                 whose duration diverged from what it publishes re-opens KF-SST-3.
                 The priced fork is `calc(response * 4s)` in BOTH places, which
                 reaches 4.8s at the slider's max and is a decision on
                 `useCompiledEntry`'s `duration`, not a readout edit.
                 `text-mono-small` again: `text-mono-caption` would uppercase ζ
                 into Ζ, a different letter. -->
            <span class="text-mono-small text-muted-foreground tabular-nums">
                ζ {{ demo.dampingFraction.value.toFixed(2) }} · {{ durationMs }} ms
            </span>
            <span class="text-caption text-muted-foreground"
                >— response is not expressed on this card</span
            >
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
    /** The one duration. `useCompiledEntry` builds the animation at 500ms. */
    durationMs: 500,
    /** Base / exit endpoints — the `@starting-style` FROM-state as well. */
    closed: { opacity: "0", transform: "translateY(20px) scale(0.9)" },
    /** Open endpoints. */
    open: { opacity: "1", transform: "translateY(0px) scale(1)" },
} as const;
</script>

<script setup lang="ts">
import { computed, inject, useId } from "vue";
// KF-KE-53's sweep at this file: subpaths, no root barrel.
import { Button } from "@mkbabb/glass-ui/button";
import { Card, CardHeader, CardTitle } from "@mkbabb/glass-ui/card";
import { Eye, EyeOff } from "@lucide/vue";

import { useSpringLinearStops } from "./useSpringLinearStops";
import CopyButton from "@components/CopyButton/CopyButton.vue";

import { SPRING_DEMO_KEY } from "./springKeys";
import { SPRING_PRESETS } from "./springPresets";

// The spring scene's discrete view. `visible`/`toggle` are the demo composable's,
// so this sub-view lives inside the scene's single ScenePlayback registration —
// this Target only reads and drives them.
const demo = inject(SPRING_DEMO_KEY)!;
const visible = demo.visible;
const toggle = demo.toggleDiscrete;

const durationMs = ENTRY_CONTRACT.durationMs;

const cardId = useId();
const labelId = useId();

// The active preset NAME for the quiet result line; "custom" when the shared
// params match no canonical preset.
const activePresetName = computed(() => {
    const match = SPRING_PRESETS.find(
        (p) =>
            Math.abs(demo.response.value - p.response) < 1e-6 &&
            Math.abs(demo.dampingFraction.value - p.dampingFraction) < 1e-6,
    );
    return match?.name ?? "custom";
});

// The emitted `linear()` — the ONE `springLinearStops` surface, off the same
// shared params the rail reads. `springTimingFunction(…).css ===
// springLinearStops(…)` byte-for-byte, so the `--spring-ease` driving the card IS
// the easing the artifact carries inline.
const springCss = useSpringLinearStops(
    () => demo.response.value,
    () => demo.dampingFraction.value,
);

/**
 * The artifact's state — three states, never laundered into one string.
 *
 * `ready` requires that the emitted CSS actually describe THIS card: a fidelity
 * surface verifies the promise it makes. KF-SST-12, stated at the byte that
 * causes it — an EMPTY result is both "still compiling" and "the compile
 * refused", because `compileToEntry` returns `{ css, eligible, refusals }` and
 * `useCompiledEntry` keeps only `css`. The discriminator lives one file over.
 */
type ArtifactState =
    | { kind: "unavailable" }
    | { kind: "mismatched"; css: string }
    | { kind: "ready"; css: string };

const describesThisCard = (css: string): boolean =>
    css.includes(`${ENTRY_CONTRACT.selector}${ENTRY_CONTRACT.openSelector}`) &&
    css.includes(ENTRY_CONTRACT.closed.transform) &&
    css.includes(ENTRY_CONTRACT.open.transform) &&
    css.includes(`${ENTRY_CONTRACT.durationMs}ms`);

const artifact = computed<ArtifactState>(() => {
    const css = demo.compiledEntryCss.value;
    if (css === "") return { kind: "unavailable" };
    return describesThisCard(css) ? { kind: "ready", css } : { kind: "mismatched", css };
});

const artifactStatus = computed(() =>
    artifact.value.kind === "mismatched"
        ? "This artifact does not describe the card above — it is not safe to paste."
        : "No artifact yet — the compile is still running, or it refused.",
);
</script>

<style scoped>
.stage-viewport {
    /* The stage's deliberate floor, declared once (KF-SST-15). */
    min-height: 7rem;
}

/* The quiet active-preset line: the chip wears the dashed settled-state register
   off `--color-progress`. The dash is the register and the hue is the token's, so
   no colour word belongs in this comment. */
.active-preset-chip {
    color: color-mix(in srgb, var(--color-progress) 60%, var(--foreground));
    /* KF-SST-23 — was `0.05rem` (0.8px) of block padding on a pill. */
    padding: 0.125rem 0.5rem;
    border-radius: var(--radius-pill);
    outline: 1px dashed color-mix(in srgb, var(--color-progress) 45%, transparent);
    outline-offset: -1px;
    background: color-mix(in srgb, var(--color-progress) 8%, transparent);
}

/* The discrete entry/exit card — AUTHORED FROM `ENTRY_CONTRACT`: base CLOSED,
   `.is-open` OPEN, `@starting-style` on the open selector, the same endpoints,
   the same 500ms, the same easing string.
   `allow-discrete` rides INSIDE the shorthand, per property, as the emitter
   writes it — `display` and `overlay` get discrete behaviour and nothing else
   does. (The former longhand-after-shorthand pair applied it to every property
   in the list; this form is narrower, and it is the published one.) */
.discrete-card {
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 1.5rem 2.5rem;
    /* KF-SST-26 — fallbacks that match the resolved tokens (`--radius-lg` is
       0.5rem at the components layer; the written 1rem was 2× off). */
    border-radius: var(--radius-lg, 0.5rem);
    /* KF-SST-18 — the 14% wash is the contrast floor keeping `--muted-foreground`
       ink above AA on this plate (≈4.8:1 light / ≈4.7:1 dark), not a decorative
       percentage. */
    background: color-mix(in srgb, var(--color-progress) 14%, transparent);
    box-shadow: 0 8px 32px color-mix(in srgb, var(--color-progress) 24%, transparent);
    /* KF-SST-17 — an outline, the file's own idiom: it survives forced colors
       where the box-shadow dies, and out of flow it perturbs no geometry. */
    outline: 1px solid color-mix(in srgb, var(--color-progress) 45%, transparent);
    outline-offset: -1px;

    opacity: 0;
    transform: translateY(20px) scale(0.9);

    transition:
        opacity 500ms var(--spring-ease, ease),
        transform 500ms var(--spring-ease, ease),
        display 500ms allow-discrete,
        overlay 500ms allow-discrete;
}

.discrete-card.is-open {
    display: flex;
    opacity: 1;
    transform: translateY(0px) scale(1);
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

.artifact {
    padding: 0.4rem 0.6rem;
    /* KF-SST-26 — `--radius-md` resolves to 6px; the written 0.5rem was 1.33× off. */
    border-radius: var(--radius-md, 0.375rem);
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

.artifact-status {
    color: var(--muted-foreground);
}
</style>
