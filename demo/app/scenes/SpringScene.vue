<template>
    <div class="flex h-full w-full items-center justify-center">
        <SpringTarget />
    </div>
</template>

<script setup lang="ts">
import { computed, h, provide, ref } from "vue";
import { TabsContent, TabsTrigger, Button } from "@mkbabb/glass-ui";
import { Pause, Play, RotateCcw, Shuffle } from "@lucide/vue";

import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";

import SpringTarget from "../../spring/SpringTarget.vue";
import SpringSidebar from "../../spring/SpringSidebar.vue";
import { useSpringDemo } from "../../spring/useSpringDemo";
import { SPRING_DEMO_KEY } from "../../spring/springKeys";

const SUPER_KEY = "Spring";

const demo = useSpringDemo();
provide(SPRING_DEMO_KEY, demo);

// Always default to the Spring tab when entering this scene
const storedControls = getStoredAnimationGroupControlOptions(SUPER_KEY);
storedControls.selectedControl = "spring";
storedControls.isControlsPanelOpen = true;

// `demo.isPlaying` is a read-only projection of the machine status (the shadow
// `isPlaying` ref is DELETED, H.W1). The bottom-bar play button routes through
// the App's onPlayStateChange → the machine; the ribbon reads this.
const isPlaying = demo.isPlaying;
const isStarted = ref(true);

const extraControlTabs = computed(() => [
    { value: "spring", label: "Spring", icon: "Activity" },
]);

const tabsTrigger = (_slotProps: { selectedAnimation: string }) =>
    h(
        TabsTrigger,
        {
            value: "spring",
            class: "tab-trigger-base tab-trigger-underline",
        },
        { default: () => "Spring" },
    );

const tabsContent = () =>
    h(
        TabsContent,
        { value: "spring", class: "h-full" },
        { default: () => h(SpringSidebar, { demo }) },
    );

const ribbonContent = (slotProps: { selectedControl: string }) =>
    slotProps.selectedControl === "spring"
        ? h("div", { class: "grid grid-cols-3 gap-2 w-full" }, [
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
                      onClick: () => demo.toggleTarget(),
                  },
                  {
                      default: () => [
                          h("span", null, "Re-seat"),
                          h(Shuffle, { class: "w-4 h-4" }),
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
    // The spring preview auto-plays on first visit (the former isPlaying =
    // ref(true)). The App reads this on SCENE_READY to dispatch PLAY for a fresh
    // scene, so the machine reaches `playing` and the raw-rAF loop (gated on the
    // machine) actually sweeps.
    autoPlays: true,
    // The raw-rAF ScenePlayback adapter — the App registers it with the machine
    // on SCENE_READY so the spring's sweep phase/isPlaying round-trip through the
    // CONTRACT (the spring↔cube cross-pair the group gate misses).
    scenePlayback: demo.scenePlayback,
    tabsTrigger,
    tabsContent,
    ribbonContent,
    extraControlTabs,
});
</script>
