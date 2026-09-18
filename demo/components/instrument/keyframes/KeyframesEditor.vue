<template>
    <div class="contents">
        <!-- The per-stop card list. When `framed` (the default, standalone
             authoring surface) it carries its OWN cartoon `Card`. When
             the editor is mounted INSIDE another Card (e.g. SpringSidebar's quiet
             parent Card — K.W1′), `:framed="false"` DROPS the inner Card so the
             list flows into the parent surface directly (no card-in-card; the
             glass-ui 4.0.0 single-surface contract). The CardContent's padding +
             grid are preserved on the bare wrapper so the layout is identical. -->
        <Card v-if="framed" cartoon tier="quiet" class="p-0 m-0">
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

        <!-- KF-KE-32 — THE TOKEN DECISION (this wave's rider on the
             KAD-18 / KF-KE-24 / KF-KE-32 family). `bg-background` is the PAGE
             ground, and both this sticky footer and the toolbar below paint it
             INSIDE the `--card` surface the component just dropped a Card to
             honour — a near-black rectangle on warm brown in the dark arm, at a
             tonal step small enough to read as a rendering fault rather than a
             layer. The decision: a plate reads the surface it is ON, so these
             two read `--card`. The family's THIRD site is the runtime-injected
             hljs theme, whose hard `#ffffff`/`#0d1117` plate is unlayered and
             therefore outranks every demo surface utility on the highlighted
             well; that site's MECHANISM — layer the injected sheet, or
             re-tokenize the theme — is the editor pipeline's (EDITOR/KFED-UNIT)
             and is deliberately not pre-empted here. Only the token decision is
             this wave's. -->
        <div class="grid gap-4 sticky bottom-0 bg-card rounded-panel p-4 pt-4 m-4">
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
            <!-- KF-KE-31 (W6-I, S-7 pattern): the toolbar's two bespoke
                 `<button>`s are the producer's `Button` (`size="sm"
                 emphasis="quiet" icon-only` — the exemplar register), each
                 under a `Tooltip` so an icon-only toolbar finally names its
                 actions for pointer users (`title=`/`Tooltip` grep was 0), and
                 the `justify-evenly w-full` anti-cluster gives way to a left
                 cluster with one gap. The wand keeps its decorative role but
                 takes an INK rung (`text-muted-foreground`) instead of the
                 alpha (`opacity-70`) that read as a disabled control (the
                 demo's own KC-12 law: a register, never an alpha).
                 `useToolbarKeyboard` still roves over the real `<button>`
                 descendants — every glass Button renders one.
                 KF-KE-36 (EVALUATED, the param type read): glass's
                 `useTabRovingFocus` takes `stripOptions` + `stripValue` +
                 `select` — a SELECTION machine for a tablist/segmented strip,
                 tab-coupled by its contract (`UseTabRovingFocusParams`), and
                 `useSelectionGroup` composes it over a selected value. This
                 bar has no selection: three heterogeneous actions and no
                 value to anchor the tabstop on. Per the bank's own clause the
                 row drops to INFO; the local composable stays, the decline is
                 written here. -->
            <div
                ref="toolbarEl"
                role="toolbar"
                aria-label="Keyframe actions"
                aria-orientation="horizontal"
                class="mt-4 flex h-10 w-full items-center gap-2 overflow-x-scroll rounded-xl border bg-card p-1"
                @keydown="onToolbarKeydown"
            >
                <!-- Decorative lead flourish — was a focusable no-op trigger; now
                     a pure indicator (aria-hidden), excluded from the roving set. -->
                <WandSparkles aria-hidden="true" class="shrink-0 text-muted-foreground" />

                <KeyframesAddDialog
                    v-model:open="kfControls.dialogOpen"
                    v-model:text="addKeyframesString"
                    :format="updateAddKeyframesString"
                    @submit="addKeyframesStringToAnimation"
                />

                <!-- S-7 (W6-I): the copy control sizes ITSELF now (a glass
                     Button, `size="sm" icon-only`); the caller-imposed
                     `w-6 h-6` box and the second `scale-on-hover` (the
                     primitive owns its hover/press motion) are gone. -->
                <CopyButton :text="cssKeyframesString" />

                <Tooltip>
                    <TooltipTrigger as-child>
                        <Button
                            size="sm"
                            emphasis="quiet"
                            icon-only
                            aria-label="Apply CSS keyframes to the target"
                            :aria-pressed="cssApplied"
                            @click="applyCSSStyles"
                        >
                            <Paintbrush ref="brush" class="icon-md pointer-events-none" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{{
                        cssApplied ? "Applied to the target" : "Apply to the target"
                    }}</TooltipContent>
                </Tooltip>
            </div>

            <!-- KF-KE-21 (S-10, EVALUATED — glass `Progress` DECLINED in
                 writing; the twin at KeyframesAddDialog carries the full
                 reasoning): the bar measures nothing, so its progress
                 semantics are deleted (`aria-hidden` decorative chrome) and
                 the brush-sweep animation is kept. KAD-15's form at this twin
                 too: rest at zero, `scaleX()` from the inline start. -->
            <div
                ref="progressBarKeyframesEl"
                class="progress-bar sticky bottom mt-2 origin-left rtl:origin-right scale-x-0"
                aria-hidden="true"
            ></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";

// KF-KE-53 (W6-I, the import-granularity sweep): every glass symbol on its
// own subpath — no root-barrel + subpath mix in one closure.
import { Button } from "@mkbabb/glass-ui/button";
import { Card, CardContent } from "@mkbabb/glass-ui/card";
import { Slider } from "@mkbabb/glass-ui/slider";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@mkbabb/glass-ui/tooltip";

import { onMounted, useTemplateRef, watch } from "vue";
import { useKeyframeBrushApply } from "./composables/useKeyframeBrushApply";
import { useCodeHighlight } from "./composables/useHighlightCSS";
import { useKeyframesEditor } from "./composables/useKeyframesEditor";

import CopyButton from "@components/CopyButton.vue";
import KeyframeCardList from "./components/KeyframeCardList.vue";
import KeyframesAddDialog from "./components/KeyframesAddDialog.vue";

import { Paintbrush, WandSparkles } from "@lucide/vue";
import { useToolbarKeyboard } from "./composables/useToolbarKeyboard";

import { parseCssScalar } from "@mkbabb/value.js/css";
import { toast } from "vue-sonner";
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

const startDiagnosticId = (index: number) => `keyframe-start-${index}`;

const onUpdateStart = ({ val, index }: { val: string; index: number }) => {
    const frame = animation.templateFrames[index];
    if (frame === undefined) return;

    const parsed = parseCssScalar(val);
    if (!parsed.ok) {
        const issue = parsed.diagnostics[0];
        toast.error("Invalid keyframe offset", {
            id: startDiagnosticId(index),
            description: `${issue.code} at ${issue.start}-${issue.end}: expected ${issue.expected.join(" or ")}.`,
        });
        return;
    }

    const scalar = parsed.value.payload;
    if (scalar.type !== "number" || scalar.unit !== "%") {
        toast.error("Invalid keyframe offset", {
            id: startDiagnosticId(index),
            description: "Expected a percentage scalar such as 50%.",
        });
        return;
    }

    toast.dismiss(startDiagnosticId(index));
    frame.start = {
        kind: "percent",
        value: scalar.value / 100,
    };
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

// KAD-15 at this twin: `scaleX()` from rest (0) to full, `fillMode: "none"` so
// the bar returns to its rest class when the sweep ends (D-20), and the PRM
// flag lands with the rest state (KF-KE-8's sequencing nuance).
const animateProgressBar = (el: HTMLElement) => {
    new CSSKeyframesAnimation(
        { duration: 1000, fillMode: "none", respectReducedMotion: true },
        el,
    )
        .fromVars([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }])
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
