/**
 * Insert four non-breaking spaces (a "tab") at the caret inside a
 * contenteditable element, then collapse the selection after them.
 *
 * Uses the target's own document/selection so it works inside iframes or any
 * owning window — no global `document` reach for the selection.
 */
export function insertTabAtCursor(target: HTMLElement): void {
    const doc = target.ownerDocument.defaultView;
    const sel = doc?.getSelection();
    if (!sel || sel.rangeCount === 0) {
        return;
    }

    const range = sel.getRangeAt(0);
    const tabNode = target.ownerDocument.createTextNode("    ");
    range.insertNode(tabNode);

    range.setStartAfter(tabNode);
    range.setEndAfter(tabNode);
    sel.removeAllRanges();
    sel.addRange(range);
}
