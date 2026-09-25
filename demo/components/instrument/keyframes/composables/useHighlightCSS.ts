import { onMounted, onUnmounted } from "vue";

// X.KF.W13X.keyframes (KFE-ORPHAN · A2-KE-L1-1) — this module is the applied
// sheet's registry and nothing else. The highlight.js driver that shared the
// file (`useCodeHighlight`, `syncHostSource`, the theme boot and its
// idempotence record) served only the per-stop card editor and its add dialog,
// which no product file mounted after `e69f7731`; they left with that subtree.

/**
 * KF-KE-6 / KF-KE-66 (X.KF.W12.c) — ONE applied sheet per animation identity,
 * owned by a REFCOUNT, never by whichever instance happens to unmount first.
 *
 * The apply identity is deliberately shared: every closure over one animation
 * names the same `styleId` (the `KeyframesStringControls.vue` the channel
 * controls force-mount under `v-show`, and any later re-mount of it over the
 * same animation). The previous owner model
 * was per-instance: every mount appended its own empty `<style>` whether Apply
 * was ever pressed (or adopted a sibling's by `#id` lookup), and every unmount
 * REMOVED the node unconditionally — so the first closure to leave stripped the
 * sheet from two live survivors, and the sheet's lifetime was a function of
 * mount ordering. This registry keys the node by id, counts its holders across
 * instances, creates the node LAZILY on the first write (no empty sheet per
 * mount), and lets the LAST holder out remove it. Adoption is the registry
 * itself — no `querySelector('#' + id)`, which an id the store derives from a
 * free-text animation name can make unparseable.
 */
interface SheetHolding {
    /** The head `<style>`; `null` until something is written into it. */
    node: HTMLStyleElement | null;
    /** Live `useHighlightCSS()` instances over this id. */
    holders: number;
}

const sheets = new Map<string, SheetHolding>();

const sheetFor = (styleId: string): SheetHolding => {
    let holding = sheets.get(styleId);
    if (holding === undefined) {
        holding = { node: null, holders: 0 };
        sheets.set(styleId, holding);
    }
    return holding;
};

export function useHighlightCSS(styleId: string) {
    const holding = sheetFor(styleId);

    const setContent = (css: string) => {
        if (holding.node === null) {
            const el = document.createElement("style");
            el.id = styleId;
            document.head.appendChild(el);
            holding.node = el;
        }
        holding.node.textContent = css;
    };

    const clear = () => {
        if (holding.node !== null) {
            holding.node.textContent = "";
        }
    };

    /** Whether THIS instance is the only live holder — the one whose unmount
     *  takes the sheet with it. Read in `beforeUnmount`, before the release. */
    const isSoleHolder = () => holding.holders === 1;

    onMounted(() => {
        holding.holders += 1;
    });

    onUnmounted(() => {
        holding.holders = Math.max(0, holding.holders - 1);
        if (holding.holders === 0) {
            holding.node?.remove();
            holding.node = null;
            sheets.delete(styleId);
        }
    });

    return { setContent, clear, isSoleHolder };
}
