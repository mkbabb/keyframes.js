import { useEventListener } from "@vueuse/core";

/**
 * Swallow Monaco's own `CancellationError` (name/message `"Canceled"`).
 *
 * Monaco throws it when the keyframes-pane editor is disposed mid-async — a fast
 * scene switch cancels an in-flight model/worker request. It is BENIGN (Monaco's
 * cancellation signal), but Monaco lets it reach the global unhandled-rejection
 * handler, where it surfaces as console noise AND intermittently trips the
 * zero-pageerror budget of the `*-live` proof gates on a loaded CI runner (a
 * render-timing flake). This is the standard Monaco-in-SPA guard, scoped to ONLY
 * that exact, distinctive signature — every real error class
 * (AnimationOptionError, the `_gen` crash, the parse `"...."` fingerprint) is
 * left to surface untouched.
 *
 * Mounted from the App root (app-lifetime), it rides `@vueuse/core`
 * `useEventListener` like every other demo listener (the inv-ζ / E.W2 discipline
 * — no hand-rolled `addEventListener`, scope-managed cleanup).
 */
const isMonacoCanceled = (r: unknown): boolean =>
    !!r &&
    typeof r === "object" &&
    ((r as { name?: unknown }).name === "Canceled" ||
        (r as { message?: unknown }).message === "Canceled");

export function useMonacoCancellationGuard(): void {
    useEventListener(window, "unhandledrejection", (e: PromiseRejectionEvent) => {
        if (isMonacoCanceled(e.reason)) e.preventDefault();
    });
    useEventListener(window, "error", (e: ErrorEvent) => {
        if (isMonacoCanceled(e.error)) e.preventDefault();
    });
}
