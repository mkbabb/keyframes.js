import { computed, ref, watch, type Ref } from "vue";

/**
 * UIA-KF-066 (X.KF.W13X.r4shell) — THE START SCREEN IS UP WHILE HOME IS OPEN
 * AND THE SUBJECT HAS NOT BEEN ENGAGED. Its copy names three ways in: pick from
 * the list, press Play, drag M. cubert. The first two leave home (the Play hop
 * to the cube); the third stays on it, so "is home" alone kept the poster
 * printed over the cube for as long as `#/` was open, however long the user
 * had been turning it. The first press on the stage engages the subject
 * (`engage`, bound on the scene host) and the start screen dismisses; leaving
 * home re-arms it, so the next arrival is a landing again.
 */
export function useStartScreen(isHome: Readonly<Ref<boolean>>) {
    const engaged = ref(false);

    watch(isHome, (home) => {
        if (!home) engaged.value = false;
    });

    const showStartScreen = computed(() => isHome.value && !engaged.value);

    function engage() {
        if (isHome.value) engaged.value = true;
    }

    return { showStartScreen, engage };
}
