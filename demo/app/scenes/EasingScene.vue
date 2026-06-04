<template>
    <div class="flex h-full w-full items-center justify-center">
        <EasingTarget />
    </div>
</template>

<script setup lang="ts">
import { computed, h, provide, ref } from "vue";
import { TabsContent, TabsTrigger, Button } from "@mkbabb/glass-ui";
import { Pause, Play, RotateCcw } from "@lucide/vue";

import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";

import EasingTarget from "../../easing/EasingTarget.vue";
import EasingSidebar from "../../easing/EasingSidebar.vue";
import { useEasingDemo } from "../../easing/useEasingDemo";
import { EASING_DEMO_KEY } from "../../easing/easingKeys";

const SUPER_KEY = "Easing";

const demo = useEasingDemo();
provide(EASING_DEMO_KEY, demo);

// Always default to the Easing tab when entering this scene
const storedControls = getStoredAnimationGroupControlOptions(SUPER_KEY);
storedControls.selectedControl = "easing";
storedControls.isControlsPanelOpen = true;

// Expose demo.isPlaying directly so the bottom bar's play button writes to it.
// The composable keeps the dummy AnimationGroup's paused flag in sync.
const isPlaying = demo.isPlaying;
const isStarted = ref(true);

const extraControlTabs = computed(() => [
    { value: "easing", label: "Easing", icon: "Activity" },
]);

const tabsTrigger = (_slotProps: { selectedAnimation: string }) =>
    h(
        TabsTrigger,
        {
            value: "easing",
            class: "tab-trigger-base tab-trigger-underline",
        },
        { default: () => "Easing" },
    );

const tabsContent = () =>
    h(
        TabsContent,
        { value: "easing", class: "h-full" },
        { default: () => h(EasingSidebar, { demo }) },
    );

const ribbonContent = (slotProps: { selectedControl: string }) =>
    slotProps.selectedControl === "easing"
        ? h("div", { class: "grid grid-cols-2 gap-2 w-full" }, [
              h(
                  Button,
                  {
                      variant: "outline",
                      class: "btn-playback btn-playback-accent",
                      onClick: () => demo.togglePlay(),
                  },
                  {
                      default: () => [
                          h("span", null, demo.isPlaying.value ? "Pause" : "Play"),
                          demo.isPlaying.value
                              ? h(Pause, { class: "w-4 h-4" })
                              : h(Play, { class: "w-4 h-4 pl-px" }),
                      ],
                  },
              ),
              h(
                  Button,
                  {
                      variant: "outline",
                      class: "h-8 w-full rounded-full gap-2 text-body btn-interactive",
                      onClick: () => demo.reset(),
                  },
                  {
                      default: () => [
                          h("span", null, "Reset"),
                          h(RotateCcw, { class: "w-4 h-4" }),
                      ],
                  },
              ),
          ])
        : null;

defineExpose({
    animationGroup: computed(() => demo.animationGroup),
    superKey: SUPER_KEY,
    isPlaying,
    isStarted,
    tabsTrigger,
    tabsContent,
    ribbonContent,
    extraControlTabs,
});
</script>
