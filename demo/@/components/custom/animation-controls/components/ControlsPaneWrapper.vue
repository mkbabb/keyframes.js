<template>
    <div
        v-show="storedControls.selectedAnimation && !hideControls"
        @transitionend="onPanelTransitionEnd"
        :class="[
            'controls-pane-wrapper col-start-1 row-start-1 lg:row-start-1 min-w-0 relative z-controls',
            'controls-pane--mobile',
            storedControls.isControlsPanelOpen
                ? 'controls-pane--open'
                : 'controls-pane--closed',
            isPaneHovered ? 'controls-pane--hovered' : '',
        ]"
    >
        <div
            :ref="(el: any) => setPaneEl(el)"
            @mouseenter="onPaneMouseEnter"
            @mouseleave="onPaneMouseLeave"
            :class="[
                'controls-pane group/controls min-w-0',
                isPanelTransitionDone && storedControls.isControlsPanelOpen
                    ? 'overflow-y-auto'
                    : 'overflow-hidden',
                scrollFadeClass,
            ]"
        >
            <div class="controls-content h-full flex flex-col">
                <template
                    v-for="[name, groupObject] in Object.entries(
                        animationGroup.animations,
                    )"
                >
                    <div v-show="storedControls.selectedAnimation == name">
                        <AnimationControls
                            :ref="(el: any) => { if (el) animControlRefs[name] = el }"
                            @slider-update="(v) => emit('sliderUpdate', v)"
                            @keyframes-update="(v) => emit('keyframesUpdate', v)"
                            @toggle-play="emit('togglePlay')"
                            @layer-config-update="
                                (v) => emit('layerConfigUpdate', name, v)
                            "
                            @scrub-start="emit('scrubStart')"
                            @scrub-end="emit('scrubEnd')"
                            :animation="groupObject.animation"
                            :is-grouped="true"
                            :is-playing="isPlaying"
                            :layer-config="groupObject.layer"
                            :active="storedControls.selectedAnimation == name"
                        >
                            <template #tabs-trigger>
                                <slot
                                    name="tabs-trigger"
                                    :selected-animation="
                                        storedControls.selectedAnimation
                                    "
                                    :is-playing="isPlaying"
                                ></slot>
                            </template>

                            <template #tabs-content>
                                <slot
                                    name="tabs-content"
                                    :selected-animation="
                                        storedControls.selectedAnimation
                                    "
                                    :is-playing="isPlaying"
                                ></slot>
                            </template>
                        </AnimationControls>
                    </div>
                </template>

                <!-- Persistent controls ribbon -->
                <RibbonBar
                    v-if="storedControls.selectedAnimation"
                    :stored-controls="storedControls"
                    :active-keyframes-ref="activeKeyframesRef"
                    :active-timeline-ref="activeTimelineRef"
                >
                    <template #ribbon-content="{ selectedControl }">
                        <slot
                            name="ribbon-content"
                            :selected-control="selectedControl"
                        ></slot>
                    </template>
                </RibbonBar>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AnimationGroup } from "@src/animation/group";
import type { AnimationLayerConfig } from "@src/animation/constants";
import type { Animation } from "@src/animation/engine";
import type { StoredAnimationGroupControlOptions } from "../stores";
import AnimationControls from "../controls/AnimationControls.vue";
import RibbonBar from "./RibbonBar.vue";

defineProps<{
    animationGroup: AnimationGroup<any>;
    storedControls: StoredAnimationGroupControlOptions;
    hideControls?: boolean;
    isPlaying: boolean;
    animControlRefs: Record<string, any>;
    activeKeyframesRef: any;
    activeTimelineRef: any;
    // Layout reactivity (from useControlsLayout) — passed in so the shell
    // stays a thin layout host and the parent owns the composable lifecycle.
    isPanelTransitionDone: boolean;
    isPaneHovered: boolean;
    scrollFadeClass: string;
    onPanelTransitionEnd: (e: TransitionEvent) => void;
    onPaneMouseEnter: () => void;
    onPaneMouseLeave: () => void;
    // Forwards the inner scrollable pane element up to the parent's
    // useScrollFade (the composable owner). The wrapper renders the element;
    // the parent measures it.
    setPaneEl: (el: HTMLElement | null) => void;
}>();

const emit = defineEmits<{
    (e: "sliderUpdate", val: { t: number; animation: Animation<any> }): void;
    (e: "keyframesUpdate", val: { animation: Animation<any> }): void;
    (e: "togglePlay"): void;
    (
        e: "layerConfigUpdate",
        name: string,
        val: Partial<AnimationLayerConfig>,
    ): void;
    (e: "scrubStart"): void;
    (e: "scrubEnd"): void;
}>();
</script>

<style scoped>
/* ── Mobile: grid-template-rows drives height, opacity fades ── */
.controls-pane-wrapper {
    display: grid;
    /* Half dock-margin above dock + dock height + half dock-margin gap */
    margin-top: calc(var(--dock-margin) + var(--dock-icon-height));
    /* Fill viewport minus top dock area and bottom menubar */
    max-height: calc(
        100dvh - var(--dock-margin) - var(--dock-icon-height) -
            var(--dock-menubar-reserve)
    );
}
.controls-pane-wrapper.controls-pane--open {
    grid-template-rows: 1fr;
    transition: grid-template-rows var(--duration-panel) var(--ease-out);
}
.controls-pane-wrapper.controls-pane--closed {
    grid-template-rows: 0fr;
    pointer-events: none;
    transition: grid-template-rows var(--duration-panel) var(--ease-standard);
}
.controls-pane {
    min-height: 0;
    transition: opacity var(--duration-panel) var(--ease-standard);
}
.controls-pane--open .controls-pane {
    opacity: 1;
}
.controls-pane--closed .controls-pane {
    opacity: 0;
}

/* ── Desktop: springy pane-left slide ── */
@media (min-width: 1024px) {
    .controls-pane-wrapper {
        max-height: none;
        max-width: none;
        margin-top: 0;
        padding-inline: 0;
        display: block;
        overflow: visible;
    }
    .controls-pane-wrapper.controls-pane--open {
        visibility: visible;
        pointer-events: auto;
        transition: visibility 0s 0s;
    }
    .controls-pane-wrapper.controls-pane--closed {
        visibility: hidden;
        pointer-events: none;
        transition: visibility 0s var(--duration-slow);
    }
    /* Spring in from left, ease out to left */
    .controls-pane--open .controls-pane {
        opacity: 1;
        transform: translateX(0);
        transition:
            opacity var(--duration-normal) var(--ease-out),
            transform var(--duration-slow) var(--spring-snappy);
    }
    .controls-pane--closed .controls-pane {
        opacity: 0;
        transform: translateX(-110%) rotate(-2deg);
        transition:
            opacity var(--duration-fast) var(--ease-in),
            transform var(--duration-normal) var(--ease-out);
    }

    .controls-content {
        /* Couples to the grid's left track (AnimationControlsGroup) via the
           --controls-pane-width token — change the track, the pane tracks it. */
        min-width: var(--controls-pane-width);
        /* Extra padding to prevent card box-shadow clipping */
        padding-right: 12px;
        padding-bottom: 12px;
    }
}

/* ── Mobile vertical scroll fade ── */
@media (max-width: 1023px) {
    /* Fill available width with side margins on mobile */
    .controls-pane-wrapper {
        max-width: min(440px, 100dvw);
        margin-inline: auto;
        padding-inline: 0.75rem;
    }

    /* The scroll-fade mask degrades to un-faded (fully visible) content on a
       browser without mask-image support — graceful, not broken (D.W3.S3). The
       fade magnitude reads the single-sourced --mask-fade token (G.W10.S5 — the
       former local --mask-fade-width shadow is collapsed).
       scroll-fade-both aliases scroll-fade-y (composable uses -both suffix). */
    @supports (-webkit-mask-image: linear-gradient(#000, #000)) or
        (mask-image: linear-gradient(#000, #000)) {
        .scroll-fade-both {
            mask-image: linear-gradient(
                to bottom,
                transparent,
                black var(--mask-fade),
                black calc(100% - var(--mask-fade)),
                transparent
            );
            -webkit-mask-image: linear-gradient(
                to bottom,
                transparent,
                black var(--mask-fade),
                black calc(100% - var(--mask-fade)),
                transparent
            );
        }
    }
}
</style>
