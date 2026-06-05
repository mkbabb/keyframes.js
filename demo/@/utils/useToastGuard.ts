/**
 * vue-sonner private DOM contract.
 *
 * vue-sonner renders its toast viewport as an element carrying the
 * `data-sonner-toaster` attribute. There is NO public predicate for
 * "is this element inside a toast", so guarding a dialog's
 * `@interact-outside` against an in-toast click requires reaching into
 * this private attribute. Centralized here so the coupling is explicit,
 * single-sourced, and greppable: if vue-sonner renames the attribute,
 * ONLY this module changes.
 *
 * Contract:
 *   - attribute: `data-sonner-toaster`
 *   - dependency: vue-sonner ^2.0.9 (see package.json)
 *
 * If vue-sonner ships a public "is inside toast" predicate, adopt it here.
 */
const TOAST_ROOT_SELECTOR = "[data-sonner-toaster]";

/**
 * Returns `true` if `el` is inside a vue-sonner toast viewport.
 *
 * Used to keep a dialog from closing when the user clicks a toast that
 * overlaps it (the `@interact-outside` guard).
 */
export function isInsideToaster(el: EventTarget | null): boolean {
    return (el as Element | null)?.closest(TOAST_ROOT_SELECTOR) != null;
}
