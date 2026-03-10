import { computed, ref, watch } from "vue";
import { scenes, sceneMap, HOME_SCENE_ID, homeScene, type SceneDescriptor } from "./scenes";
import { getActiveScene } from "@components/custom/animation-controls/animationStores";

const STORAGE_KEY = "keyframes-js-active-scene";

function loadSceneId(): string {
    // Prefer hash-restored scene (from shared URL)
    const hashScene = getActiveScene();
    if (hashScene && sceneMap.has(hashScene)) return hashScene;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && sceneMap.has(stored)) return stored;
    } catch {
        // localStorage unavailable (Safari private browsing)
    }
    return HOME_SCENE_ID;
}

export function useSceneManager() {
    const currentSceneId = ref(loadSceneId());

    const isHome = computed(() => currentSceneId.value === HOME_SCENE_ID);

    const currentScene = computed<SceneDescriptor>(
        () => sceneMap.get(currentSceneId.value) ?? homeScene,
    );

    watch(currentSceneId, (id) => {
        try {
            localStorage.setItem(STORAGE_KEY, id);
        } catch {
            // ignore
        }
    });

    function switchScene(id: string) {
        if (sceneMap.has(id)) {
            currentSceneId.value = id;
        }
    }

    return {
        currentSceneId,
        currentScene,
        isHome,
        scenes,
        switchScene,
    };
}
