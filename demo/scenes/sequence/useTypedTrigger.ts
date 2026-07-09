import { useEventListener } from "@vueuse/core";

/**
 * A HIDDEN typed-sequence trigger (R.W5 B.4 — extracts the reelBuffer
 * ring-buffer egg from SequenceTarget). Listens on `window` keydown for the
 * given `code` typed in order; when the rolling buffer matches, fires `onMatch`
 * and resets. Skips editable targets (inputs / textareas / selects /
 * contenteditable) so it never steals a keystroke from a focused field.
 *
 * Scoped via `useEventListener` — the listener auto-detaches on the caller's
 * effect-scope dispose (no manual teardown, no module-level mutable leak).
 */
export function useTypedTrigger(code: string, onMatch: () => void): void {
    let buffer = "";
    useEventListener(window, "keydown", (e: KeyboardEvent) => {
        const t = e.target as HTMLElement | null;
        if (
            t &&
            (t.isContentEditable ||
                /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
        ) {
            return;
        }
        if (e.key.length !== 1) return;
        buffer = (buffer + e.key.toLowerCase()).slice(-code.length);
        if (buffer === code) {
            buffer = "";
            onMatch();
        }
    });
}
