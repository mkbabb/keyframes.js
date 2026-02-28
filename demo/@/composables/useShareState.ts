import { ref } from "vue";
import type { Ref } from "vue";
import {
    encodeStateToHash,
    decodeStateFromHash,
    getAllState,
    restoreStateFromHash,
} from "@components/custom/animation-controls/animationStores";
import { toast } from "vue-sonner";

export function useShareState() {
    const sharePopoverOpen = ref(false);
    const loadHashInput = ref("");
    const stateVersion = ref(0);

    const shareState = async () => {
        const state = getAllState();
        const hash = encodeStateToHash(state);
        const url = `${window.location.origin}${window.location.pathname}#${hash}`;

        try {
            await navigator.clipboard.writeText(url);
            sharePopoverOpen.value = false;
            toast.success("Link copied to clipboard!", {
                duration: 3000,
                description:
                    "Share this URL to restore the current animation state.",
            });
        } catch {
            window.location.hash = hash;
            sharePopoverOpen.value = false;
            toast.info("URL updated — copy from address bar", {
                duration: 5000,
            });
        }
    };

    const loadFromInput = () => {
        let hash = loadHashInput.value.trim();
        if (!hash) return;

        // Extract hash from URL if a full URL was pasted
        const hashIndex = hash.indexOf("#");
        if (hashIndex !== -1) {
            hash = hash.slice(hashIndex + 1);
        }

        const state = decodeStateFromHash(hash);
        if (!state) {
            toast.error("Invalid shared state", { duration: 3000 });
            return;
        }

        // Apply state without page reload
        window.location.hash = hash;
        restoreStateFromHash();
        sharePopoverOpen.value = false;
        stateVersion.value++;

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
