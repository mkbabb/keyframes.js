<template>
    <div
        ref="menubarHostEl"
        :class="[
            'menubar-safe-pb px-2 py-1.5 m-0 flex items-center justify-center justify-items-center',
            'fixed left-0 right-0 z-dock',
        ]"
        style="bottom: var(--work-area-bottom-offset, 0px);"
    >
        <!--
            Always-expanded so the play/pause and other transport buttons
            stay at a stable x position. When the dock collapsed to a
            summary pill and expanded on hover, the summary's play button
            and the full layer's play button sat at different x — a user
            who hovered the collapsed button then clicked without moving
            the mouse would land on a sibling button instead.
        -->
        <GlassDock ref="dockRef" :always-expanded="true" :fit-content="true">
            <!-- Expanded state: full controls -->
            <div class="flex items-center gap-3">
                <IconTooltip text="Select animation">
                    <div class="relative flex items-center gap-1.5">
                        <Select
                            class="p-0 m-0 cursor-pointer"
                            :model-value="storedControls.selectedAnimation"
                            @update:model-value="
                                (key) => {
                                    emit('selectAnimation', String(key));
                                }
                            "
                        >
                            <DockSelectTrigger
                                aria-label="Select animation"
                                class="dock-label"
                            >
                                <!-- The empty-state leading glyph — rendered
                                     directly, not via reka's SelectIcon slot
                                     (the one headless reach past the glass-ui
                                     surface; DockSelectTrigger owns the trigger
                                     + its chevron, GG-6). -->
                                <List
                                    v-if="!storedControls.selectedAnimation"
                                />
                                <SelectValue class="text-ellipsis">{{
                                    storedControls.selectedAnimation
                                }}</SelectValue>
                            </DockSelectTrigger>
                            <SelectContent class="min-w-[var(--dropdown-min-width)]">
                                <SelectGroup class="dock-label">
                                    <template
                                        v-for="name in animationNames"
                                    >
                                        <SelectItem class="py-2 px-3" hide-indicator :value="name">
                                            <span class="flex items-center gap-2">
                                                <!-- Playing: live conic-gradient progress ring driven by --dot-p.
                                                     Idle/paused: discrete glass-ui StatusDot state colour. -->
                                                <span
                                                    v-if="isPlaying"
                                                    class="progress-dot w-2.5 h-2.5"
                                                    :style="dotStyle(name)"
                                                ></span>
                                                <StatusDot
                                                    v-else
                                                    size="md"
                                                    :variant="isStarted ? 'paused' : 'idle'"
                                                />
                                                <span :class="storedControls.selectedAnimation === name ? 'font-bold' : ''">{{ name }}</span>
                                            </span>
                                        </SelectItem>
                                    </template>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </IconTooltip>

                <!-- Vertical divider -->
                <div class="dock-separator"></div>

                <IconTooltip text="Reset animation">
                    <DockIconButton title="Reset animation" @click="() => { resetIconSpin(); emit('reset', false); }">
                        <RotateCcw
                            ref="resetIconEl"
                            class="icon-lg"
                        />
                    </DockIconButton>
                </IconTooltip>

                <IconTooltip text="Clear all & reload">
                    <DockIconButton title="Clear all & reload" @click="() => { trashIconShake(); emit('reset', true); }">
                        <Trash
                            ref="trashIconEl"
                            class="icon-lg"
                        />
                    </DockIconButton>
                </IconTooltip>

                <IconTooltip :text="isPlaying ? 'Pause' : 'Play'">
                    <Button
                        variant="ghost"
                        :aria-label="isPlaying ? 'Pause animation' : 'Play animation'"
                        :class="[
                            'scale-on-hover icon-lg text-white rounded-full p-0',
                            'w-10 h-10 shrink-0',
                            isPlaying ? 'rainbow-vivid' : 'rainbow-pastel',
                        ]"
                        @click="emit('togglePlay')"
                    >
                        <Pause v-if="isPlaying" class="icon-lg" />
                        <Play v-else class="icon-lg pl-0.5" />
                    </Button>
                </IconTooltip>

                <!-- Timeline controls merged into menubar when expanded -->
                <template v-if="storedControls.isTimelineExpanded">
                    <div class="dock-separator"></div>

                    <IconTooltip text="Collapse timeline">
                        <DockIconButton title="Collapse timeline" @click="emit('expandTimeline', false)">
                            <Minimize2 class="icon-lg" />
                        </DockIconButton>
                    </IconTooltip>

                    <span class="dock-label whitespace-nowrap">Timeline</span>
                </template>
            </div>

            <!-- Collapsed state: animation name first, play button on right -->
            <template #collapsed>
                <span v-if="storedControls.selectedAnimation" class="dock-label text-foreground whitespace-nowrap font-semibold">
                    {{ storedControls.selectedAnimation }}
                </span>
                <!-- The collapsed-dock play mirror — carries a DISTINCT
                     accessible name from the expanded menubar transport play
                     (X-3): two play controls with the same "Play animation"
                     name are indistinguishable to a screen reader. Disambiguated
                     across BOTH states (Play and Pause) since one ternary drives
                     both. -->
                <Button
                    variant="ghost"
                    :aria-label="
                        isPlaying
                            ? 'Pause animation (collapsed dock)'
                            : 'Play animation (collapsed dock)'
                    "
                    :class="[
                        'scale-on-hover text-white rounded-full p-0',
                        'w-8 h-8 shrink-0',
                        isPlaying ? 'rainbow-vivid' : 'rainbow-pastel',
                    ]"
                    @click.stop="onCollapsedPlayClick()"
                >
                    <Pause v-if="isPlaying" class="icon-md" />
                    <Play v-else class="icon-md pl-px" />
                </Button>
            </template>
        </GlassDock>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from "vue";

import {
    List,
    Minimize2,
    Pause,
    Play,
    Trash,
} from "@lucide/vue";

import {
    DockIconButton,
    DockSelectTrigger,
} from "@mkbabb/glass-ui/dock";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
    Button,
} from "@mkbabb/glass-ui";
import { IconTooltip } from "@mkbabb/glass-ui/icon-tooltip";
import { StatusDot } from "@mkbabb/glass-ui/status-dot";

import { RotateCcw } from "@lucide/vue";

import { CSSKeyframesAnimation } from "@src/animation/engine";
import { GlassDock } from "@mkbabb/glass-ui/dock";

import type { StoredAnimationGroupControlOptions } from "./stores";

const dockRef = useTemplateRef<InstanceType<typeof GlassDock>>("dockRef");

// ── J.W4 S7 (CH-3/M1 — the sheet anchor derives from the MEASURED menubar) ──
// The mobile bottom sheet anchors at `bottom: var(--dock-menubar-reserve)`
// (ControlsPaneWrapper.vue), and the reserve's dock band was DERIVED FROM A
// TOKEN (`--dock-icon-height` + margin ≈ 52px) while the always-expanded
// TransportDock pill actually renders ~80px tall (+ host padding ≈ 90px) — so
// the open sheet's bottom ran 30+px BEHIND the menubar and the menubar pill
// painted OVER the sheet's bottom control row (the M1 occlusion class, live at
// 390×844; the I deferred-ledger CH-3 row's named cure is "derive sheet anchor
// from MEASURED menubar height"). This observer IS that cure: it measures the
// menubar host's REAL border-box height and publishes it as
// `--menubar-measured-h` on :root; style.css folds it into
// `--dock-band-reserve` via max(), so the sheet (and the work-area band math)
// always clears the menubar the user actually sees — token drift can never
// re-open the occlusion. Height is content-driven (never a function of the
// reserve it feeds), so no custom-property cycle forms.
// Gated by proof:live-session-mobile (sheet.bottom ≤ menubar.top on a real
// 390×844 + hasTouch context — the CH-3 re-certification oracle).
const menubarHostEl = useTemplateRef<HTMLElement>("menubarHostEl");
const MENUBAR_MEASURED_PROP = "--menubar-measured-h";
let menubarResizeObserver: ResizeObserver | null = null;

onMounted(() => {
    const host = menubarHostEl.value;
    if (!host || typeof ResizeObserver === "undefined") return;
    const publish = () => {
        const h = Math.ceil(host.getBoundingClientRect().height);
        document.documentElement.style.setProperty(
            MENUBAR_MEASURED_PROP,
            `${h}px`,
        );
    };
    menubarResizeObserver = new ResizeObserver(publish);
    menubarResizeObserver.observe(host);
    publish();
});

onBeforeUnmount(() => {
    menubarResizeObserver?.disconnect();
    menubarResizeObserver = null;
    document.documentElement.style.removeProperty(MENUBAR_MEASURED_PROP);
});

function onCollapsedPlayClick() {
    dockRef.value?.expand();
    emit('togglePlay');
}

const { storedControls, isPlaying, isStarted, animationProgress, animationNames } = defineProps<{
    storedControls: StoredAnimationGroupControlOptions;
    isPlaying: boolean;
    isStarted: boolean;
    animationProgress: Record<string, number>;
    animationNames: string[];
}>();

const emit = defineEmits<{
    (e: "togglePlay"): void;
    (e: "reset", all: boolean): void;
    (e: "selectAnimation", name: string): void;
    (e: "expandTimeline", expanded: boolean): void;
}>();

/** Set a single CSS custom property; the stylesheet computes gradient + shadow. */
const dotStyle = (name: string): Record<string, string> => {
    const p = animationProgress[name] ?? 0;
    return { "--dot-p": String(p) };
};

/** Resolve a template ref to a raw HTMLElement (handles component instances). */
const resolveEl = (ref: any): HTMLElement | null => {
    if (!ref) return null;
    if (ref instanceof HTMLElement) return ref;
    return ref.$el instanceof HTMLElement ? ref.$el : null;
};

const resetIconEl = useTemplateRef<HTMLElement>("resetIconEl");
const trashIconEl = useTemplateRef<HTMLElement>("trashIconEl");

const resetSpinAnim = new CSSKeyframesAnimation({
    duration: 400,
    timingFunction: "easeOutCubic",
}).fromString(/*css*/ `@keyframes twist {
    0% { transform: perspective(200px) rotateY(0deg) scale(1); }
    40% { transform: perspective(200px) rotateY(-180deg) scale(0.85); }
    100% { transform: perspective(200px) rotateY(-360deg) scale(1); }
}`);

const trashShakeAnim = new CSSKeyframesAnimation({
    duration: 400,
    timingFunction: "easeInOutCubic",
}).fromString(/*css*/ `@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-3px) rotate(-5deg); }
    40% { transform: translateX(3px) rotate(5deg); }
    60% { transform: translateX(-2px) rotate(-3deg); }
    80% { transform: translateX(2px) rotate(3deg); }
}`);

const resetIconSpin = () => {
    const el = resolveEl(resetIconEl.value);
    if (el) {
        resetSpinAnim.setTargets(el);
        resetSpinAnim.reset();
        resetSpinAnim.play();
    }
};

const trashIconShake = () => {
    const el = resolveEl(trashIconEl.value);
    if (el) {
        trashShakeAnim.setTargets(el);
        trashShakeAnim.reset();
        trashShakeAnim.play();
    }
};

defineExpose({ resetIconSpin, trashIconShake });
</script>

<style scoped>
/* ── Bottom-menubar safe-area padding (D.W3.S3) ──
   Reserves the iOS home-indicator inset below the dock. Was the arbitrary
   Tailwind value `pb-[max(calc(var(--dock-margin)/2),env(safe-area-inset-bottom))]`
   with NO fallback inside env() — on a browser without env() support the whole
   max() collapsed. Now:
     • the env() carries a 0px fallback (so a browser that parses env() but has
       no inset still resolves the max() to the dock-margin baseline), and
     • an @supports-not path supplies the dock-margin baseline directly for
       browsers that do not understand env(safe-area-inset-bottom) at all.
   Happy path (modern Safari/Chrome with a notch) is byte-identical. */
.menubar-safe-pb {
    padding-bottom: max(
        calc(var(--dock-margin) / 2),
        env(safe-area-inset-bottom, 0px)
    );
}
@supports not (padding: env(safe-area-inset-bottom)) {
    .menubar-safe-pb {
        padding-bottom: calc(var(--dock-margin) / 2);
    }
}

/* The .progress-dot recipe (the active-playing conic-gradient progress ring,
   applied at the SelectItem above) was PROMOTED to the owned idiom layer
   (design-idioms.css, E.W11.S4 — beside its sibling .progress-bar), so the
   progress vocabulary is single-sourced. The call site keeps `class="progress-dot"`. */
</style>
