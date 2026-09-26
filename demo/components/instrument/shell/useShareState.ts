import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
    encodeStateToHash,
    getAllState,
    restoreStateFromParam,
} from "@state";
import { toast } from "@mkbabb/glass-ui/toast";
import { writeClipboard } from "@mkbabb/glass-ui/dom";

export function useShareState(onSceneRestore?: (sceneId: string) => void) {
    const router = useRouter();
    const route = useRoute();
    const sharePopoverOpen = ref(false);
    const loadHashInput = ref("");
    // X.KF.W13X.overlays · UIA-KF-142 — a refused load names its reason AT the
    // field (the Input's invalid skin + an inline message the field describes
    // itself by), not only in a toast below the fold. Any edit to the field, or
    // the popover closing, clears the verdict: it describes the text that was
    // refused, not the text now in the field.
    const loadError = ref<string | null>(null);
    watch(
        [loadHashInput, sharePopoverOpen],
        () => {
            loadError.value = null;
        },
        { flush: "sync" },
    );

    // X.KF.W13X.overlays · UIA-KF-070 — each action reports whether it
    // COMPLETED, so the host can dismiss the whole menu stack on completion
    // instead of leaving a modal menu open over the scene.
    const shareState = async (): Promise<boolean> => {
        const activeScene = route.name as string;
        const state = getAllState(activeScene);
        const encoded = encodeStateToHash(state);

        // Build the full share URL via router.resolve for correct hash-mode URLs
        const resolved = router.resolve({
            name: route.name as string,
            query: { ...route.query, state: encoded },
        });
        const url = `${window.location.origin}${resolved.href}`;

        // A2-KE-L1-19 — glass's writeClipboard names a refused write instead of
        // throwing; the refusal branch is this flow's own fallback.
        const { ok } = await writeClipboard(url);
        sharePopoverOpen.value = false;
        if (ok) {
            toast({ title: "Link copied to clipboard!", tone: "success" });
        } else {
            // Fallback: set the state param in the URL directly
            router.replace({ query: { ...route.query, state: encoded } });
            toast({
                title: "URL updated — copy from address bar",
                tone: "info",
                duration: 5000,
            });
        }
        return true;
    };

    const loadFromInput = (): boolean => {
        let input = loadHashInput.value.trim();
        if (!input) return false;

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
            toast({ title: "No shared state found in URL", tone: "destructive", duration: 3000 });
            loadError.value = "No shared state found in this link.";
            return false;
        }

        // UIA-KF-003 — decode, validate and apply are ONE call, and its verdict
        // is the only one the UI reports: a payload that decodes but is no state
        // object (`MTIz` → 123) is refused by `restoreStateFromParam`, and the
        // field stays open on the error instead of toasting success.
        const result = restoreStateFromParam(stateParam);
        if (!result.restored) {
            toast({ title: "Invalid shared state", tone: "destructive", duration: 3000 });
            loadError.value = "This link's shared state could not be read.";
            return false;
        }
        sharePopoverOpen.value = false;
        // X.KF.W13X.overlays · UIA-KF-249 — the pasted link is spent once it
        // loads; reopening Share must not show it again.
        loadHashInput.value = "";

        // Switch to the shared scene if present
        if (result.activeScene && onSceneRestore) {
            onSceneRestore(result.activeScene);
        }

        toast({
            title: "State restored!",
            tone: "success",
            duration: 3000,
            description: "Animation state loaded from shared URL.",
        });
        return true;
    };

    return {
        sharePopoverOpen,
        loadHashInput,
        loadError,
        shareState,
        loadFromInput,
    };
}
