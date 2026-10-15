/**
 * The glass toast's DOM contract.
 *
 * glass-ui's `Toast` stamps `data-slot="toast"` on every toast root (its own
 * slot marker, rendered by the Toaster the App mounts once — UIA-KF-001). There
 * is NO public predicate for "is this element inside a toast", so guarding a
 * dialog's `@interact-outside` against an in-toast click reads that marker.
 * Centralized here so the coupling is explicit, single-sourced, and greppable:
 * if glass renames the marker, ONLY this module changes.
 *
 * Contract:
 *   - attribute: `data-slot="toast"`
 *   - producer: `@mkbabb/glass-ui/toast` (see package.json)
 *
 * If glass ships a public "is inside toast" predicate, adopt it here.
 */
const TOAST_ROOT_SELECTOR = '[data-slot="toast"]';

/**
 * Returns `true` if `el` is inside a glass toast.
 *
 * Used to keep a dialog from closing when the user clicks a toast that
 * overlaps it (the `@interact-outside` guard).
 */
export function isInsideToaster(el: EventTarget | null): boolean {
    return (el as Element | null)?.closest(TOAST_ROOT_SELECTOR) != null;
}
