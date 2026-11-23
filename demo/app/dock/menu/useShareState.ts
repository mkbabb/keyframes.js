import { ref, watch, type Ref } from "vue";
import { toast } from "@mkbabb/glass-ui/toast";
import { writeClipboard } from "@mkbabb/glass-ui/dom";
import { flushUrlState } from "@app/scene/urlState";

/**
 * The share surface's state: the link it copies and its open model, which a
 * completed copy closes.
 *
 * The link is the address itself (owner, FORTY-SIXTH E: the address is the
 * page). Every view a visitor can set is in it, key by key (urlState.ts), so
 * there is nothing else to encode: the former `?state=` blob and its Load
 * field retired with the browser-stored options they dumped. A link someone
 * sent opens in the address bar.
 *
 * @param open the surface's open model. X.KF.W13X.esc2 · ESC-dock-1: the share
 *             popover's host owns it (`SharePopover`'s `v-model:open`, opened by
 *             the @mbabb menu's Share row); a caller with no host gets its own.
 */
export function useShareState(open: Ref<boolean> = ref(false)) {
    const sharePopoverOpen = open;

    // X.KF.W13X.r4dock · UIA-KF-321 — the link a refused clipboard write could
    // not copy. The surface shows it in a read-only field, selected, so the user
    // copies it from the surface itself; it is spent when the surface closes.
    const copyFallbackUrl = ref<string | null>(null);
    watch(sharePopoverOpen, (isOpen) => {
        if (!isOpen) copyFallbackUrl.value = null;
    });

    // X.KF.W13X.overlays · UIA-KF-070 — the action reports whether it
    // COMPLETED, so the host can dismiss the whole menu stack on completion
    // instead of leaving a modal menu open over the scene.
    // `stay`: the copy was asked for by opening the surface (the menu's Share
    // row), so the surface stays and says it was done; no toast says it twice.
    const shareState = async ({ stay = false }: { stay?: boolean } = {}): Promise<boolean> => {
        // A value still resting (a drag let go a moment ago) is written first,
        // so the link is the view on screen.
        flushUrlState();
        const url = window.location.href;

        // A2-KE-L1-19 — glass's writeClipboard names a refused write instead of
        // throwing; the refusal branch is this flow's own fallback.
        const { ok } = await writeClipboard(url);
        if (!ok) {
            // X.KF.W13X.r4dock · UIA-KF-321 — a refused write leaves the action
            // undone, so the surface stays open and offers the link itself,
            // pre-filled and selected.
            copyFallbackUrl.value = url;
            return false;
        }
        if (stay) return true;
        sharePopoverOpen.value = false;
        toast({ title: "Link copied", tone: "success" });
        return true;
    };

    return { sharePopoverOpen, copyFallbackUrl, shareState };
}
