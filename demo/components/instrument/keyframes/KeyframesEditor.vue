<template>
    <div class="contents">
        <!-- The per-stop card list. When `framed` (the default, standalone
             authoring surface) it carries its OWN `Card surface="cartoon"`. When
             the editor is mounted INSIDE another Card (e.g. SpringSidebar's quiet
             parent Card — K.W1′), `:framed="false"` DROPS the inner Card so the
             list flows into the parent surface directly (no card-in-card; the
             glass-ui 4.0.0 single-surface contract). The CardContent's padding +
             grid are preserved on the bare wrapper so the layout is identical. -->
        <Card v-if="framed" surface="cartoon" tier="quiet" class="p-0 m-0">
            <CardContent class="p-2 m-0 mt-0 grid gap-4 relative">
                <KeyframeCardList
                    ref="cardList"
                    :frame-strings="templateFrameStrings"
                    :frames="animation.templateFrames"
                    @update-start="onUpdateStart"
                    @update-c-s-s="onUpdateCSS"
                    @remove="({ event, index }) => removeKeyframe(event, index)"
                    @keydown="onKeyDown"
                />
            </CardContent>
        </Card>
        <div v-else class="p-2 m-0 mt-0 grid gap-4 relative">
            <KeyframeCardList
                ref="cardList"
                :frame-strings="templateFrameStrings"
                :frames="animation.templateFrames"
                @update-start="onUpdateStart"
                @update-c-s-s="onUpdateCSS"
                @remove="({ event, index }) => removeKeyframe(event, index)"
                @keydown="onKeyDown"
            />
        </div>

        <div class="grid gap-4 sticky bottom-0 bg-background rounded-panel p-4 pt-4 m-4">
            <Slider
                :model-value="
                    animation.templateFrames.map((frame) => frame.start.value)
                "
                @update:model-value="
                    (starts) => {
                        animation.templateFrames.forEach((frame, i) => {
                            frame.start.value = starts![i];
                        });
                        updateAllStringsAndAnimation();
                    }
                "
                :min="-10"
                :max="110"
                :step="1"
            >
            </Slider>

            <!-- The keyframe-action toolbar (S.C3b · C-19). This was a shadcn reka
                 `Menubar`, but it never held a single `MenubarContent` — it is a
                 4-affordance authoring TOOLBAR (add · copy · apply, plus a
                 decorative wand), not a set of menus. The a24-F6 relocate-in-place
                 migration keeps every action visible and working (a `dropdown-menu`
                 remap would bury them behind a trigger and unmount the persistent
                 brush ref in a portal) while shedding the last shadcn island;
                 `useToolbarKeyboard` restores the roving-tabindex keyboard reka
                 gave it (Arrow/Home/End over the real button descendants). -->
            <div
                ref="toolbarEl"
                role="toolbar"
                aria-label="Keyframe actions"
                aria-orientation="horizontal"
                class="mt-4 flex h-10 w-full items-center justify-evenly gap-2 overflow-x-scroll rounded-xl border bg-background p-1"
                @keydown="onToolbarKeydown"
            >
                <!-- Decorative lead flourish — was a focusable no-op trigger; now
                     a pure indicator (aria-hidden), excluded from the roving set. -->
                <WandSparkles aria-hidden="true" class="shrink-0 opacity-70" />

                <KeyframesAddDialog
                    v-model:open="kfControls.dialogOpen"
                    v-model:text="addKeyframesString"
                    :format="updateAddKeyframesString"
                    @submit="addKeyframesStringToAnimation"
                />

                <CopyButton
                    class="w-6 h-6 scale-on-hover"
                    :text="cssKeyframesString"
                />

                <button
                    type="button"
                    aria-label="Apply CSS keyframes to the target"
                    :aria-pressed="cssApplied"
                    class="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent p-0 outline-none scale-on-hover focus-visible:ring-2 focus-visible:ring-accent"
                    @click="applyCSSStyles"
                >
                    <Paintbrush ref="brush" class="pointer-events-none" />
                </button>
            </div>

            <div
                ref="progressBarKeyframesEl"
                class="progress-bar sticky bottom mt-2"
            ></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { kfEngine } from "@utils/kfEngine";

import { Card, CardContent, Slider } from "@mkbabb/glass-ui";

import { onMounted, useTemplateRef, watch } from "vue";
import { useKeyframeBrushApply } from "./composables/useKeyframeBrushApply";
import { useCodeHighlight } from "./composables/useHighlightCSS";
import { useKeyframesEditor } from "./composables/useKeyframesEditor";

import CopyButton from "@components/CopyButton.vue";
import KeyframeCardList from "./components/KeyframeCardList.vue";
import KeyframesAddDialog from "./components/KeyframesAddDialog.vue";

import { Paintbrush, WandSparkles } from "@lucide/vue";
import { useToolbarKeyboard } from "./composables/useToolbarKeyboard";

import { parseCSSValueUnit } from "@mkbabb/value.js";
import { insertTabAtCursor } from "./utils/contenteditable";

// HEAVY surface from the warmed engine (kfEngine(), L.W8 S1 dogfood inversion) —
// synchronous, since the warm resolves before the app mounts. `presets` is the
// barrel's preset namespace (the old `* as animations` deep import).
const { CSSKeyframesAnimation, AnimationGroup, presets } = kfEngine();

const { animation, framed = true } = defineProps<{
    animation: KeyframesAnimation<any>;
    /** Whether the per-stop card list carries its OWN framing `Card`. Default
     *  `true` (the standalone authoring surface). Pass `false` when the editor is
     *  mounted inside another Card (e.g. SpringSidebar's parent Card) so the inner
     *  Card is DROPPED — no card-in-card (glass-ui 4.0.0 single-surface). */
    framed?: boolean;
}>();

const emit = defineEmits<{
    (
        e: "sliderUpdate",
        val: { t: number; animationId: number },
    ): void;
    (
        e: "keyframesUpdate",
        val: { animation: KeyframesAnimation<any> },
    ): void;
}>();

const {
    cssKeyframesString,
    addKeyframesString,
    templateFrameStrings,
    keyframesStyleId,
    kfControls,
    updateAllStrings,
    updateAllStringsAndAnimation,
    updateAnimationFromKeyframeString,
    updateAddKeyframesString,
    addKeyframesStringToAnimation,
    removeKeyframeData,
} = useKeyframesEditor(() => animation, emit);

// Mirror the live add-keyframes draft into stored controls so an un-submitted
// draft persists (the original inline input handler set both).
watch(addKeyframesString, (v) => {
    kfControls.addKeyframes = v;
});

const cardList = useTemplateRef<InstanceType<typeof KeyframeCardList>>("cardList");

// Scoped highlight driver — owns the editor's OWN <pre> code blocks (the card
// list's), never the whole document (D.W3.S1).
const { highlightAll } = useCodeHighlight(
    () => cardList.value?.getPreElements() ?? [],
);

const onUpdateStart = ({ val, index }: { val: string; index: number }) => {
    animation.templateFrames[index].start = parseCSSValueUnit(val);
    updateAllStringsAndAnimation();
};

const onUpdateCSS = ({ value, index }: { value: string; index: number }) => {
    updateAnimationFromKeyframeString(value, index);
    animateProgressBar(progressBarKeyframesEl.value!);
};

function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Ï") {
        e.preventDefault();
        return;
    }

    if (e.key === "Tab") {
        e.preventDefault();
        insertTabAtCursor(e.target as HTMLElement);
    }

    highlightAll();
}

const removeKeyframe = async (_e: Event, frameIx: number) => {
    if (animation.templateFrames.length <= 1) {
        return;
    }

    const cards = cardList.value?.cardRefs ?? [];
    const el1 = cards[frameIx];
    const el2 =
        frameIx < cards.length - 1 ? cards[frameIx + 1] : cards[frameIx - 1];

    // S.B4 — `AnimationGroup.of(...)` replaces the excised
    // `KeyframesAnimation.group(...)` convenience (genuine ownership; a06 F1/F2).
    await AnimationGroup.of(
        presets.warpLeft().setTargets(el1),
        presets.jumpUp().setTargets(el2),
    ).play();

    removeKeyframeData(frameIx);
};

const progressBarKeyframesEl = useTemplateRef<HTMLElement>("progressBarKeyframesEl");

const animateProgressBar = (el: HTMLElement) => {
    new CSSKeyframesAnimation({ duration: 1000 }, el)
        .fromVars([{ width: "0%" }, { width: "100%" }])
        .play();
};

const { applyCSSStyles, cssApplied } = useKeyframeBrushApply({
    animation,
    styleId: keyframesStyleId,
    getCSSString: () => cssKeyframesString.value,
    templateRef: "brush",
});

// The action toolbar's roving-tabindex keyboard (S.C3b · C-19 — the reka Menubar
// replacement). `refresh` re-seats the single tab stop once the item buttons
// (dialog trigger, copy, apply) have mounted.
const toolbarEl = useTemplateRef<HTMLElement>("toolbarEl");
const { onKeydown: onToolbarKeydown, refresh: refreshToolbar } =
    useToolbarKeyboard(() => toolbarEl.value);

// Re-highlight the card list whenever the serialized keyframes change.
watch(cssKeyframesString, () => {
    highlightAll();
});

onMounted(() => {
    updateAllStrings();
    // Seat the toolbar's single tab stop now that the item buttons have mounted.
    refreshToolbar();
});
</script>
