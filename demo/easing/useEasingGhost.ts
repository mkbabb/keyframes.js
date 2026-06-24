import { ref } from "vue";

/**
 * Q.WC2 S2 — the comparison-DIFF ghost, colocated as its own concern seam (split
 * out of useEasingDemo to hold the host composable under the demo line ceiling,
 * the same pattern as useEasingTraceSmear / useEasingGallery).
 *
 * When an edit departs FROM a named easing INTO custom, the editor renders a
 * low-opacity reference path carrying the ORIGINAL named curve's `d` behind the
 * live trace — so `f(t)=` reads as a delta ("how far you pulled from ease-out"),
 * not an opaque absolute curve. The ghost lives ONLY for a named→custom edit: a
 * from-scratch custom curve (or a bare named curve, which the dropdown names) has
 * no baseline to diff against, so the ghost is `undefined`.
 *
 * The host calls `capture(name, path)` at the name→custom transition (BEFORE the
 * flip, so `path` is the named curve's) and `clear()` on any fresh selection. The
 * capture is idempotent within an edit (the baseline is the named curve the edit
 * STARTED from — an already-custom edit does not re-capture).
 */
export function useEasingGhost() {
    /** The ORIGINAL named curve's `svgPath` (the reference drawn behind the live
     *  trace), or `undefined` when there is no named→custom baseline. */
    const ghostPathD = ref<string | undefined>(undefined);
    /** The original curve's name (for a label / debugging). */
    const ghostName = ref<string | undefined>(undefined);

    /** Capture the named baseline IFF we are leaving a named curve for custom and
     *  no baseline is already held (idempotent within one edit). `currentName` is
     *  the curve BEFORE the flip; `path` is its `svgPath`. */
    const capture = (currentName: string, path: string): void => {
        if (currentName !== "cubic-bezier" && ghostPathD.value === undefined) {
            ghostPathD.value = path;
            ghostName.value = currentName;
        }
    };

    /** Clear the baseline (a fresh selection — the diff is tied to the edit). */
    const clear = (): void => {
        ghostPathD.value = undefined;
        ghostName.value = undefined;
    };

    return { ghostPathD, ghostName, capture, clear };
}
