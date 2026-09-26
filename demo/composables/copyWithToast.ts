import { writeClipboard, type CopyResult } from "@mkbabb/glass-ui/dom";
import { toast } from "@mkbabb/glass-ui/toast";

/**
 * copyWithToast — the demo's one clipboard verb (X.KF.W13X.lib, A2-KE-L1-19).
 *
 * The write is glass's `writeClipboard`, which never throws: it returns a named
 * result (`{ ok }` / `{ ok, reason }`). The former `utils/clipboard.ts`
 * `copyText` awaited the raw Clipboard API write bare, so a refused write
 * (an insecure origin, a denied permission, a missing API) rejected unhandled
 * out of every fire-and-forget caller and the user saw nothing. Both branches
 * now speak: the success toast when the caller names one, a destructive toast
 * naming the channel on failure. The result is returned so a caller with its
 * own feedback (CopyButton's check) confirms only a real copy.
 */
export async function copyWithToast(
    text: string,
    successMessage?: string,
): Promise<CopyResult> {
    const result = await writeClipboard(text);
    if (result.ok) {
        if (successMessage) toast({ title: successMessage, tone: "success" });
    } else {
        toast({
            title: "Couldn't copy to the clipboard",
            tone: "destructive",
            description:
                result.reason === "no-api"
                    ? "This browser exposes no clipboard to the page."
                    : "The browser refused the clipboard write.",
        });
    }
    return result;
}
