import { toast } from "vue-sonner";

/**
 * Composable providing a clipboard copy helper with toast feedback.
 */
export function useClipboard() {
    const copy = async (text: string, successMsg = "Copied to clipboard") => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(successMsg);
        } catch (err) {
            toast.error("Could not copy to clipboard: " + err);
        }
    };

    return { copy };
}
