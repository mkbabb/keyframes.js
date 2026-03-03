export { default as DarkModeToggle } from "./DarkModeToggle.vue";

import { createGlobalState, useDark, useToggle } from "@vueuse/core";

/** Single shared dark mode instance — avoids multiple useDark() watchers racing on classList. */
export const useGlobalDark = createGlobalState(() => {
    const isDark = useDark({ disableTransition: false });
    const toggleDark = useToggle(isDark);
    return { isDark, toggleDark };
});
