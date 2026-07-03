<script setup lang="ts">
/**
 * StageCard — ONE diorama (design §4/§7 L4/§8 · round-2 D4/D5/D6). Glass shell +
 * contact-shadow ellipse + the LIT/UNLIT tier switch: a live ScenePreviewHost
 * when in the lit band, else the POSTER FACE (D3.6/D6.1: tone-tinted shell +
 * glyph + serif name + mono breadcrumb — the entered-poster treatment promoted to
 * the unlit tier). The FRONT card catches the key light (D4.4), presses toward
 * the viewer on committing (D5.3), and its footlight blooms (D5.2). The flanks
 * step into the penumbra — desaturate + dim on the preview-host content (D4.5).
 */
import { computed } from "vue";
import ScenePreviewHost from "./ScenePreviewHost.vue";
import type { CarouselCardDerived } from "./composables/useCarouselOrbit";
import type { SceneStageEntry } from "./sceneStageRegistry";

const props = defineProps<{
    entry: SceneStageEntry;
    index: number;
    total: number;
    derived: CarouselCardDerived;
    front: boolean;
    /**
     * MOUNT authority (hysteresis band) — keeps the ScenePreviewHost ALIVE for
     * anti-churn even after a card leaves the visual band. NOT the paint gate.
     */
    lit: boolean;
    /**
     * B3 · PAINT authority (DECOUPLED from mount) — true only in the tight visual
     * band (front + immediate flank in the clear). A `lit && !showPreview`
     * hysteresis-residual card stays mounted but wears its POSTER face, so no
     * bright miniature UI reads in the payoff penumbra.
     */
    showPreview: boolean;
    /**
     * B1/B2 · the OCCLUSION face-fade ∈ [0,1] — 1 in the clear, 0 fully occluded
     * (behind a nearer shell). Drives the opacity of the WHOLE face (preview +
     * poster + nameplate + breadcrumb) so no occluded text bleeds through the
     * flank glass (desktop) or the front card (mobile).
     */
    occlusion: number;
    /** D4.5 penumbra ramp k∈[0,1] — 0 at front, 1 by 1.5·step into shadow. */
    penumbra: number;
    /** D5: the armed/front card pressed toward the viewer during committing. */
    pressed: boolean;
    /** D3.3: front AND orbit settled — gates the amiga GL-context create. */
    settled: boolean;
    reducedMotion: boolean;
    /** Fan-in reveal gate (design §6.7 / STAGE-SPEC S5). */
    revealed: boolean;
    revealDelayMs: number;
}>();

const style = computed(() => {
    // D5.3: the press — an additive translateZ toward the viewer, committing-only.
    const press = props.pressed ? " translateZ(40px)" : "";
    return {
        transform: `${props.derived.transform} scale(${props.derived.scale})${press}`,
        // fold the fan-in reveal INTO the falloff opacity so there is one authority
        opacity: props.revealed ? props.derived.opacity : 0,
        filter: `brightness(${props.derived.brightness})${props.derived.blur ? ` blur(${props.derived.blur}px)` : ""}`,
        zIndex: String(props.derived.zIndex),
        // D9.3.3: promote only the painting (visual-band) cards.
        willChange: props.showPreview ? "transform, opacity, filter" : "auto",
        transition:
            `opacity 340ms ease ${props.revealed ? props.revealDelayMs : 0}ms,` +
            ` transform 260ms cubic-bezier(0.25, 1, 0.5, 1)`,
    } as Record<string, string>;
});

// D4.5: the penumbra content filter — the flank preview desaturates + dims as it
// leaves the beam; front = saturate(1) brightness(1) exactly.
const penumbraFilter = computed(() => {
    const k = props.penumbra;
    const sat = 1 - 0.35 * k; // 1 → 0.65
    const bri = 1 - 0.28 * k; // 1 → 0.72
    return `saturate(${sat.toFixed(3)}) brightness(${bri.toFixed(3)})`;
});

// D5.2: the footlight blooms on committing — alpha ×1.5, scale 1.15.
const shadowStyle = computed(() => {
    const bloom = props.pressed ? 1.5 : 1;
    const alpha = Math.min(0.9, 0.35 * props.derived.scale * bloom).toFixed(3);
    const tint = props.front
        ? `color-mix(in srgb, var(--tone) 24%, rgb(0 0 0 / ${alpha}))`
        : `rgb(0 0 0 / ${alpha})`;
    const spread = props.pressed ? 1.15 : 1;
    return {
        background: `radial-gradient(50% 100% at 50% 0%, ${tint}, transparent 72%)`,
        transform: `translateZ(-1px) scaleX(${spread})`,
    };
});

</script>

<template>
    <div
        class="stage-card"
        :class="{ 'is-lit': lit, 'is-unlit': !lit, 'is-pressed': pressed }"
        role="option"
        :data-stage-card="entry.id"
        :data-index="index"
        :data-front="String(front)"
        :data-lit="String(lit)"
        :aria-selected="front"
        :aria-label="`${entry.label}, ${index + 1} of ${total}`"
        :tabindex="front ? 0 : -1"
        :style="{ ...style, '--tone': entry.tone }"
    >
        <div
            class="stage-card__shell"
            :class="{ 'is-front': front, 'is-flank': showPreview && !front, 'is-rear': !showPreview }"
        >
            <!-- B3: the live preview STAYS MOUNTED across the hysteresis band
                 (v-if=lit, anti-churn) but only PAINTS in the visual band
                 (v-show=showPreview). The whole face fades by occlusion so it
                 never bleeds through a nearer shell (B1/B2). -->
            <div
                v-if="lit"
                v-show="showPreview"
                class="stage-card__preview"
                :style="{ filter: penumbraFilter, opacity: occlusion }"
            >
                <ScenePreviewHost
                    :entry="entry"
                    :front="front"
                    :lit="lit"
                    :settled="settled"
                    :reduced-motion="reducedMotion"
                />
            </div>
            <!-- POSTER FACE (glyph + serif name + mono breadcrumb): the rear cards
                 AND the hysteresis-residual mounted card (B3) wear it. Fades by
                 occlusion so an occluded glyph/name never reads through (B1/B2). -->
            <div
                v-if="!showPreview"
                class="stage-card__poster"
                :style="{ opacity: occlusion }"
                aria-hidden="true"
            >
                <span class="poster-glyph">{{ entry.glyph }}</span>
            </div>

            <!-- D4.4: the front card catches the key light (content-layer wash) -->
            <div v-if="front" class="stage-card__keywash" aria-hidden="true"></div>

            <!-- the nameplate — fades with OCCLUSION (B1/B2): full in the clear,
                 0 the moment a nearer shell overlaps this card, so no name /
                 breadcrumb reads through flank glass or the front card. -->
            <div class="stage-card__plate" :style="{ opacity: occlusion }">
                <span class="plate-name">{{ entry.label }}</span>
                <span v-if="!showPreview" class="plate-crumb">scene · {{ entry.id }}</span>
            </div>

            <!-- front-card specular sheen (CONTROL-on-plate) -->
            <div v-if="front" class="stage-card__specular" aria-hidden="true"></div>
        </div>
        <!-- L4 contact-shadow ellipse (the DK-64 diorama grounding) -->
        <div class="stage-card__shadow" aria-hidden="true" :style="shadowStyle"></div>
    </div>
</template>

<style scoped>
.stage-card {
    position: absolute;
    top: 50%;
    left: 50%;
    width: clamp(200px, 24vw, 300px);
    aspect-ratio: 3 / 2;
    margin-left: calc(clamp(200px, 24vw, 300px) / -2);
    margin-top: calc((clamp(200px, 24vw, 300px) * (2 / 3)) / -2);
    transform-style: preserve-3d;
}
/* D7.2: the front card is a button — pointer + a subtle hover press. */
.stage-card[data-front="true"] {
    cursor: pointer;
}
.stage-card[data-front="true"]:hover:not(.is-pressed) .stage-card__shell {
    transform: scale(1.02);
}
.stage-card__shell {
    position: absolute;
    inset: 0;
    border-radius: 16px;
    overflow: hidden;
    background: color-mix(in srgb, var(--card, #fff) 82%, transparent);
    border: 1px solid color-mix(in srgb, var(--border, #d8d8d8) 80%, transparent);
    box-shadow:
        0 8px 24px rgb(0 0 0 / 0.18),
        inset 0 1px 0 rgb(255 255 255 / 0.35);
    transition: transform 160ms cubic-bezier(0.25, 1, 0.5, 1);
}
/* D9.3.2: backdrop-filter ONLY on the lit tier. Front keeps glass-resting (6px);
   flanks get the anti-double-exposure step-up (14px, D6.2); rear is static glass. */
.stage-card__shell.is-front {
    backdrop-filter: blur(6px) saturate(1.05);
    border-color: color-mix(in srgb, var(--tone) 50%, transparent);
    box-shadow:
        0 14px 40px color-mix(in srgb, var(--tone) 22%, rgb(0 0 0 / 0.28)),
        inset 0 1px 0 rgb(255 255 255 / 0.5);
}
.stage-card__shell.is-flank {
    backdrop-filter: blur(14px) saturate(1.05);
}
.stage-card__shell.is-rear {
    /* static-gradient glass — no backdrop read (D9.3.2). */
    background: color-mix(in srgb, var(--card, #1a1a22) 70%, hsl(265 26% 9%));
}
.stage-card__preview {
    position: absolute;
    inset: 0;
}
/* D4.4: the key-light wash — the lit stage floor catches the beam. */
.stage-card__keywash {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: linear-gradient(
        178deg,
        color-mix(in srgb, var(--stage-key, #f2e6c8) calc(var(--stage-light, 1) * 22%), transparent),
        transparent 60%
    );
    mix-blend-mode: screen;
}
/* D6.1: the UNLIT poster face — tone-tinted shell + glyph, NO brightness crush. */
.stage-card__poster {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background:
        radial-gradient(120% 120% at 50% 28%, color-mix(in srgb, var(--tone) 20%, transparent), transparent 68%),
        hsl(265 26% 11%);
}
.poster-glyph {
    font-size: clamp(2.5rem, 7vw, 4rem);
    /* D6.1: opacity .5 + saturate(.4), and NO brightness crush on the glyph. */
    opacity: 0.5;
    filter: saturate(0.4);
    color: var(--tone);
}
.stage-card__plate {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 6px 12px;
    background: linear-gradient(to top, rgb(0 0 0 / 0.5), transparent);
    pointer-events: none;
}
.plate-name {
    font-family: var(--font-display, "Instrument Serif", serif);
    /* D6.1: min 12px, remixed toward foreground for ≥4.5:1 in both themes. */
    font-size: clamp(0.85rem, 2.2vw, 1.25rem);
    color: hsl(45 40% 96%);
    text-shadow: 0 1px 4px rgb(0 0 0 / 0.75);
    letter-spacing: 0.01em;
}
.plate-crumb {
    font-family: var(--font-mono, "Fira Code", monospace);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    color: hsl(45 18% 78%);
    text-shadow: 0 1px 3px rgb(0 0 0 / 0.8);
}
.stage-card__specular {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
        135deg,
        rgb(255 255 255 / 0.22) 0%,
        transparent 30%,
        transparent 70%,
        rgb(255 255 255 / 0.08) 100%
    );
    mix-blend-mode: screen;
}
.stage-card__shadow {
    position: absolute;
    left: 7.5%;
    right: 7.5%;
    bottom: -18px;
    height: 30px;
    filter: blur(5px);
    transition: transform 260ms cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
