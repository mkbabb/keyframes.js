import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
    encodeStateToHash,
    decodeStateFromHash,
    getAllState,
    restoreStateFromParam,
} from "@components/custom/animation-controls/stores";
import { toast } from "vue-sonner";
import { copyToClipboard } from "@mkbabb/glass-ui";

export function useShareState(onSceneRestore?: (sceneId: string) => void) {
    const router = useRouter();
    const route = useRoute();
    const sharePopoverOpen = ref(false);
    const loadHashInput = ref("");
    const stateVersion = ref(0);
    const copy = copyToClipboard;

    const shareState = async () => {
        const activeScene = route.name as string;
        const state = getAllState(activeScene);
        const encoded = encodeStateToHash(state);

        // Build the full share URL via router.resolve for correct hash-mode URLs
        const resolved = router.resolve({
            name: route.name as string,
            query: { ...route.query, state: encoded },
        });
        const url = `${window.location.origin}${resolved.href}`;

        try {
            await copy(url, "Link copied to clipboard!");
            sharePopoverOpen.value = false;
        } catch {
            // Fallback: set the state param in the URL directly
            router.replace({ query: { ...route.query, state: encoded } });
            sharePopoverOpen.value = false;
            toast.info("URL updated — copy from address bar", {
                duration: 5000,
            });
        }
    };

    const loadFromInput = () => {
        let input = loadHashInput.value.trim();
        if (!input) return;

        // Extract state param from URL if a full URL was pasted
        let stateParam: string | null = null;
        try {
            const url = new URL(input);
            // Hash-mode URLs: the hash contains the path and query
            // e.g., http://example.com/#/cube?state=BLOB
            const hash = url.hash.slice(1); // remove leading #
            const qIdx = hash.indexOf("?");
            if (qIdx !== -1) {
                const params = new URLSearchParams(hash.slice(qIdx));
                stateParam = params.get("state");
            }
        } catch {
            // Not a valid URL — treat as raw state param
            stateParam = input;
        }

        if (!stateParam) {
            toast.error("No shared state found in URL", { duration: 3000 });
            return;
        }

        const decoded = decodeStateFromHash(stateParam);
        if (!decoded) {
            toast.error("Invalid shared state", { duration: 3000 });
            return;
        }

        const result = restoreStateFromParam(stateParam);
        sharePopoverOpen.value = false;
        stateVersion.value++;

        // Switch to the shared scene if present
        if (result.activeScene && onSceneRestore) {
            onSceneRestore(result.activeScene);
        }

        toast.success("State restored!", {
            duration: 3000,
            description: "Animation state loaded from shared URL.",
        });
    };

    return {
        sharePopoverOpen,
        loadHashInput,
        shareState,
        loadFromInput,
        stateVersion,
    };
}
