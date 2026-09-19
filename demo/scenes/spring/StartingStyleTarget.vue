<template>
    <!-- The STAGE-CARD register (I5): a standard, non-cartoon glass `<Card>` —
         the protagonist plate — with `shadow={false}` as a deliberate fork.
         `max-w-3xl` rides the content column as an optical reading measure.
         KF-SST-25 — `tier="resting"` is NOT passed here and is not claimed to
         be: Card's `material` default ("elevated") reaches Surface's private
         material→tier map, which is what stamps `data-tier="resting"`, and that
         stamp is the only thing style.css's `[data-tier="resting"]` tint hangs
         off. The chain is cited once, correctly, instead of asserted as props
         this element does not pass.
         KF-SST-24 — the plate carried inline padding only, and a
         `justify-center` that distributed nothing (the stage child is
         `flex-1`). It has block padding now and the inert utility is gone. -->
    <Card
        :shadow="false"
        class="flex flex-col items-center gap-6 h-full w-full px-6 py-5 lg:px-8 overflow-hidden"
        :style="{ '--spring-ease': springCss }"
    >
        <!-- KF-SST-28/-16 — the Card HEADER FAMILY (`CardHeader`/`CardTitle`/
             `CardAction`) instead of a hand-rolled flex row: `CardTitle` ships
             `overflow-wrap: anywhere` + `min-width: 0`, which retires the
             title's `truncate` (a 0-min-size that let the loudest rung shrink
             to nothing while the caption's `nowrap` made the quietest
             unshrinkable). -->
        <CardHeader class="w-full max-w-3xl shrink-0 items-center p-0">
            <CardTitle class="text-display text-foreground">@starting-style</CardTitle>
            <!-- KF-SST-33 — "eased by" used to appear twice in one plate for
                 two different objects (the emitter here, the preset below).
                 This one names what it actually is: the emitter. `text-mono-small`
                 is the case-preserving mono rung — `text-mono-caption` carries
                 `text-transform: uppercase`, and an all-caps rendering of a
                 case-sensitive JS identifier is not a style, it is a wrong
                 name. -->
            <CardAction class="self-center">
                <span class="text-caption text-muted-foreground whitespace-nowrap">
                    emitted by
                    <span class="text-mono-small" data-register="code"
                        >springLinearStops()</span
                    >
                </span>
            </CardAction>
        </CardHeader>

        <div class="flex w-full max-w-3xl flex-1 min-h-0 flex-col items-center justify-center gap-5">
            <!-- KF-SST-15 — the dead `min-h-0` is gone: the scoped, unlayered
                 `min-height: 7rem` below beats the layered utility, so the two
                 contradicted each other and the utility always lost. The floor
                 is deliberate and is declared in one place. -->
            <div class="stage-viewport relative w-full flex-1 flex items-center justify-center">
                <!-- The card never leaves the DOM. `.is-open` is the open
                     state; removing it transitions TO `display: none` through
                     `allow-discrete`, so the spring eases the entry
                     (@starting-style) and the exit alike — declarative, no JS
                     removal timing. The polarity is the ARTIFACT's (base
                     closed, `.is-open` opens), which is the whole of KF-SST-3. -->
                <div
                    :id="cardId"
                    class="discrete-card"
                    :class="{ 'is-open': visible }"
                >
                    <span class="text-title text-foreground">Hello, spring.</span>
                    <span class="text-small text-muted-foreground">
                        enters + exits on a physics curve
                    </span>
                </div>
            </div>

            <!-- KF-SST-1/-6 — THE SURVIVING VERB, AND IT HAS A STATE.
                 The verb was rendered twice (here and as a ribbon extra) with
                 neither copy publishing which way the boolean sits. THE
                 DECISION: the in-card copy survives. It is the copy that is
                 unconditionally reachable — the ribbon rides a sheet-at-peek
                 below `lg`, so deleting this one risks stranding the card's
                 only control behind a sheet, while deleting the ribbon extra
                 costs a duplicate; and a control that carries `aria-controls`
                 should sit with the region it controls. Retiring the ribbon
                 twin is a `SpringScene.vue` byte, outside this unit's bounds,
                 and is returned as a declared residual.
                 `aria-expanded` + `aria-controls` is the disclosure pattern
                 (this shows/hides a region — it is not a toggle button, so
                 `aria-pressed` would be the wrong role semantics).
                 `data-state` is the producer's OWN state-indication seam: glass
                 `accessibility.css` gives `[data-state="on"]` the same
                 `forced-colors` Highlight border and `prefers-contrast: more`
                 indication it gives `[aria-pressed="true"]`, and it keys none of
                 it on `[aria-expanded]` — so a disclosure button would forfeit
                 all three affordances. (That gap is a producer row; it rides the
                 relay, never a local re-implementation.)
                 `emphasis` is not restated: `secondary` IS the dist default
                 (KF-SST-33). -->
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
             THIS card, not a hand-typed timing-function line.
             KF-SST-11/-12 — ONE STRING, AND A STATE MODEL THAT CAN SAY NO.
             What is rendered IS what is copied: the panel used to display
             `springCss` while the clipboard carried `copyableCss` — two
             different strings under a label describing neither — and it
             laundered three states (not-yet-compiled, refused, ready) through
             one `||` fallback. The panel now derives its state from the one
             fact it has, and it refuses rather than presenting an artifact it
             cannot vouch for. -->
        <div class="w-full max-w-3xl shrink-0">
            <div class="flex items-center justify-between gap-2 mb-1.5">
                <span :id="labelId" class="text-small text-foreground"
                    >compileToEntry() artifact</span
                >
                <!-- KF-SST-29 — the control names what it copies; the default
                     ("Copy to clipboard") never identified it. There is no copy
                     control when there is nothing faithful to copy. -->
                <CopyButton
                    v-if="artifact.kind === 'ready'"
                    :text="artifact.css"
                    label="Copy the @starting-style artifact"
                />
            </div>
            <!-- KF-SST-9 — the artifact is a NAMED, REACHABLE, READABLE region.
                 It is 2190 chars / 21 lines with a 943-char longest line
                 (measured against the shipped emitter); under `white-space: pre`
                 in a ≤768px measure that is thousands of px of horizontal
                 scroll on the one element whose whole purpose is that a
                 designer reads it — and it had no `tabindex`, no role and no
                 accessible name. -->
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

        <!-- One quiet result line naming WHICH spring eases the card (the
             redundant 4-preset picker is retired; the one preset surface lives
             in the spring's own controls rail). -->
        <div class="active-preset-line flex w-full max-w-3xl items-center justify-center gap-2 shrink-0">
            <span class="text-caption text-muted-foreground">eased by</span>
            <span class="active-preset-chip text-mono-small capitalize" data-register="code">{{
                activePresetName
            }}</span>
            <!-- KF-SST-2 — THE READOUT NAMES WHAT IT ACTUALLY EXPRESSES.
                 It used to print `response / ζ` under "eased by", as if both
                 shaped this card. Only ζ does. `springLinearStops` is
                 self-similar under `response` (it enters only the sampling
                 window: max|Δv| ≈ 2e-5 across the whole 0.2→1.0 slider range,
                 against 3.0e-1 for ζ), and this card's duration is the
                 artifact's fixed 500ms, so `response`'s one real effect — the
                 spring's time scale — is discarded here by construction.
                 THE DECISION, with the fork priced: the duration stays pinned
                 to the artifact's, because a card whose duration diverged from
                 the artifact it publishes would re-open KF-SST-3 the day it
                 landed. The alternative — `transition-duration: calc(response *
                 4s)` in BOTH places — reaches 4.8s at the slider's max, which
                 is a range decision on the producer of the artifact
                 (`useCompiledEntry`'s `duration: 500`), not a readout edit.
                 Mono rung: `text-mono-small`, case-preserving —
                 `text-mono-caption` would uppercase `ζ` into `Ζ`, a different
                 letter. -->
            <span class="text-mono-small text-muted-foreground tabular-nums">
                ζ {{ demo.dampingFraction.value.toFixed(2) }} ·
                {{ durationMs }} ms
            </span>
            <span class="text-caption text-muted-foreground"
                >— response is not expressed on this card</span
            >
        </div>
    </Card>
</template>

<script lang="ts">
/**
 * THE ENTRY CONTRACT — the ONE source of truth for this card's endpoints
 * (KF-SST-3 · KF-SST-4).
 *
 * This panel makes one promise: *"a designer pastes the artifact verbatim to
 * reproduce the discrete transition"*. It was false on five counts — the
 * artifact declared base=CLOSED/`.is-open` while the card ran base=OPEN/
 * `.is-hidden`, it used `transform: translateY() scale()` where the card used
 * independent `translate`/`scale`, and it hard-coded 500ms against a token the
 * card spelled three different ways. The mechanism was that nothing bound the
 * two: no shared constant, token, test or type.
 *
 * This constant is that binding. The card's scoped CSS is authored FROM it, and
 * `test/demo/scenes/starting-style-artifact.test.ts` asserts that the CSS the
 * shipped `compileToEntry` emits satisfies it — so a change on either side of
 * the seam fails a gate instead of drifting silently.
 *
 * DIRECTION, and its price. The CARD moved onto the ARTIFACT's contract, not
 * the reverse: the emitter's input (`ENTER_KEYFRAMES` in `useCompiledEntry.ts`)
 * is what a consumer receives, so it is the published truth. The cost is real
 * and named: the card's independent `translate`/`scale` (one timeline per
 * property, the more modern model) is retired for the artifact's `transform`
 * list. Restoring it means changing `ENTER_KEYFRAMES` to emit `translate`/
 * `scale` — at which point this test fails until this block follows, which is
 * the whole point of writing the endpoints down once.
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
import { Card, CardAction, CardHeader, CardTitle } from "@mkbabb/glass-ui/card";
import { Eye, EyeOff } from "@lucide/vue";

import { useSpringLinearStops } from "./useSpringLinearStops";
import CopyButton from "@components/CopyButton/CopyButton.vue";

import { SPRING_DEMO_KEY } from "./springKeys";
import { SPRING_PRESETS } from "./springPresets";

// The discrete view of the Spring scene. `visible` / `toggle` are owned by the
// SPRING demo composable so the merged sub-view lives within the spring scene's
// SINGLE ScenePlayback registration — this Target only reads + drives them.
const demo = inject(SPRING_DEMO_KEY)!;
const visible = demo.visible;
const toggle = demo.toggleDiscrete;

const durationMs = ENTRY_CONTRACT.durationMs;

const cardId = useId();
const labelId = useId();

// The active preset NAME for the quiet result line. Falls back to "custom" when
// the shared params match no canonical preset.
const activePresetName = computed(() => {
    const match = SPRING_PRESETS.find(
        (p) =>
            Math.abs(demo.response.value - p.response) < 1e-6 &&
            Math.abs(demo.dampingFraction.value - p.dampingFraction) < 1e-6,
    );
    return match?.name ?? "custom";
});

// The emitted CSS `linear()` — the ONE `springLinearStops` surface, sampled off
// the SAME shared params the live-solver rail reads. `springTimingFunction(…).css
// === springLinearStops(…)` byte-for-byte, so the `--spring-ease` driving the
// card below IS the easing the artifact carries inline: the two are identical,
// not merely similar.
const springCss = useSpringLinearStops(
    () => demo.response.value,
    () => demo.dampingFraction.value,
);

/**
 * The artifact's state — three states, never laundered into one string.
 *
 * `ready` is only reached when the emitted CSS actually describes THIS card:
 * the panel's charter is literal fidelity, so it verifies the promise it makes
 * rather than repeating it. A mismatch is presented as a refusal, never as an
 * artifact.
 *
 * KF-SST-12, stated honestly at the byte that causes it: an EMPTY result is
 * both "still compiling" and "the compile refused" — `compileToEntry` returns
 * `{ css: "", eligible, refusals }` and `useCompiledEntry` keeps only `css`, so
 * this surface genuinely cannot distinguish them and says exactly that. The
 * discriminator lives one file over; surfacing it is that file's row.
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
    /* The stage's deliberate floor — the one declaration of it (KF-SST-15). */
    min-height: 7rem;
}

/* ── The quiet active-preset result line ──────────────────────────────────
   The chip wears the DASHED motion language: the `--color-progress` token as a
   dashed outline, the settled-state register. The dash is the register and the
   hue is the token's — which is exactly why no colour word belongs in a comment
   about it. */
.active-preset-chip {
    color: color-mix(in srgb, var(--color-progress) 60%, var(--foreground));
    /* KF-SST-23 — the block padding was `0.05rem` (0.8px) on a `--radius-pill`
       chip: the rounded geometry the token buys was never expressed. */
    padding: 0.125rem 0.5rem;
    border-radius: var(--radius-pill);
    outline: 1px dashed color-mix(in srgb, var(--color-progress) 45%, transparent);
    outline-offset: -1px;
    background: color-mix(in srgb, var(--color-progress) 8%, transparent);
}

/* ── The discrete entry/exit card — AUTHORED FROM `ENTRY_CONTRACT` ─────────
   This block IS the rendering of the artifact the panel publishes: base =
   CLOSED, `.is-open` = OPEN, `@starting-style` on the open selector, the same
   two endpoints, the same 500ms, and the same easing string in `--spring-ease`.

   `allow-discrete` rides INSIDE the shorthand, per property, exactly as the
   emitter writes it — `display` and `overlay` get discrete behaviour and
   nothing else does. (The former `transition-behavior: allow-discrete` longhand
   placed AFTER the shorthand is retired with the polarity it served: it applied
   the behaviour to every property in the list, and this form is both narrower
   and the published one.) */
.discrete-card {
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 1.5rem 2.5rem;
    /* KF-SST-26 — fallbacks that match the resolved tokens (`--radius-lg` is
       0.5rem at the components layer; the written 1rem was 2× off). */
    border-radius: var(--radius-lg, 0.5rem);
    /* KF-SST-18 — the 14% wash is what keeps `--muted-foreground` ink above AA
       on this plate (≈4.8:1 light / ≈4.7:1 dark, both arms concordant); it is a
       contrast floor, not a decorative percentage, and it moves with the ink. */
    background: color-mix(in srgb, var(--color-progress) 14%, transparent);
    box-shadow: 0 8px 32px color-mix(in srgb, var(--color-progress) 24%, transparent);
    /* KF-SST-17 — the card `@starting-style` demonstrates had no boundary at
       all: under forced colors it lost every edge while the motion still ran.
       An OUTLINE is the file's own surviving idiom (the preset chip's) — it
       survives forced colors where a box-shadow does not, and being out of flow
       it perturbs no geometry. */
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

/* KF-SST-13 — THE LOCAL PRM BLOCK IS DELETED, AND THIS IS WHY.
   It declared `transition: none` under `prefers-reduced-motion` and called
   itself MANDATORY; it never applied. glass's `accessibility.css` ships an
   UNLAYERED `*:not([data-allow-motion]) { transition-duration: 0.1s !important;
   transition-property: opacity, color, background-color, border-color,
   box-shadow !important }`, reached through `index.css` → `accessibility.css`
   with no `@layer` in either — `!important` on a universal selector beats a
   component's normal-weight declaration, always. The rendered outcome is
   already right (transform is absent from that allow-list, so it snaps;
   opacity fades in 0.1s; display is instant), and the one lever that would let
   a local rule win is `data-allow-motion`, which opts the element OUT of the
   house kill switch — the opposite of what reduced motion asks for. So: no
   dead declaration, and the dependency named where a reader can see it. */

.artifact {
    padding: 0.4rem 0.6rem;
    /* KF-SST-26 — `--radius-md` resolves to 6px; the written 0.5rem was 1.33× off. */
    border-radius: var(--radius-md, 0.375rem);
    background: color-mix(in srgb, var(--muted) 50%, transparent);
    /* KF-SST-9 — `white-space: pre` made a 943-char line scroll thousands of px
       sideways on the one element meant to be READ. `pre-wrap` +
       `overflow-wrap: anywhere` wraps the long `linear()` bodies without
       changing a single byte, so what is rendered is still exactly what is
       copied; the vertical scroll keeps a real floor instead of `max-h-32`. */
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
