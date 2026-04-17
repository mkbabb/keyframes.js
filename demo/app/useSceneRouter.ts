import { computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
    scenes,
    sceneMap,
    HOME_SCENE_ID,
    homeScene,
    type SceneDescriptor,
} from "./scenes";

const STORAGE_KEY = "keyframes-js-active-scene";

export function useSceneRouter() {
    const router = useRouter();
    const route = useRoute();

    // Suppress scene transitions until the initial route resolves
    const ready = ref(false);
    router.isReady().then(() => {
        // On fresh load with bare /#/, redirect to localStorage-saved scene
        if (route.name === "home") {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored && stored !== HOME_SCENE_ID && sceneMap.has(stored)) {
                    router.replace({ name: stored, query: route.query });
                }
            } catch {
                // localStorage unavailable
            }
        }
        ready.value = true;
    });

    const currentSceneId = computed<string>(() => {
        const name = route.name as string | undefined;
        return name && sceneMap.has(name) ? name : HOME_SCENE_ID;
    });

    const isHome = computed(() => currentSceneId.value === HOME_SCENE_ID);

    const currentScene = computed<SceneDescriptor>(
        () => sceneMap.get(currentSceneId.value) ?? homeScene,
    );

    // Persist last-visited scene to localStorage
    watch(currentSceneId, (id) => {
        try {
            localStorage.setItem(STORAGE_KEY, id);
        } catch {
            // ignore
        }
    });

    function switchScene(id: string) {
        if (!sceneMap.has(id)) return;
        // Strip ?state= on scene switch (stale snapshot), preserve other params
        const { state: _, ...rest } = route.query;
        router.push({ name: id, query: rest });
    }

    return {
        currentSceneId,
        currentScene,
        isHome,
        ready,
        scenes,
        switchScene,
    };
}
