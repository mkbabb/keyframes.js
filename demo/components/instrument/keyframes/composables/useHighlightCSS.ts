import { onMounted, onUnmounted, ref, watch } from "vue";
import { useGlobalDark } from "@mkbabb/glass-ui/dark";

type Highlighter = typeof import("highlight.js/lib/core").default;
let highlighterBoot: Promise<{
    hljs: Highlighter;
    githubDark: string;
    githubLight: string;
}> | undefined;

const bootHighlighter = () =>
    (highlighterBoot ??= Promise.all([
        import("highlight.js/lib/core"),
        import("highlight.js/lib/languages/css"),
        import("highlight.js/styles/github-dark.css?inline"),
        import("highlight.js/styles/github.css?inline"),
    ]).then(([core, css, dark, light]) => {
        const hljs = core.default;
        hljs.registerLanguage("css", css.default);
        return {
            hljs,
            githubDark: dark.default,
            githubLight: light.default,
        };
    }));

/**
 * KF-KE-6 / KF-KE-66 (X.KF.W12.c) — ONE applied sheet per animation identity,
 * owned by a REFCOUNT, never by whichever instance happens to unmount first.
 *
 * The apply identity is deliberately shared: three closures run over one
 * animation at once (`KeyframesEditor.vue`'s two slot copies and the
 * `KeyframesStringControls.vue` the channel controls force-mount under
 * `v-show`), and all of them name the same `styleId`. The previous owner model
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

const THEME_STYLE_ID = "highlightjs-theme";

/**
 * The idempotence record: for every element this driver has highlighted, the
 * EXACT source text the current markup was produced from (X.KF.W5 arm 0,
 * KAD-3 / KAD-14(a)).
 *
 * The `highlighted` attribute it replaces recorded only THAT a pass had run, and
 * two defects followed from that alone. (1) The dialog's first open is always
 * empty (`controlOptionsStore.ts` seeds `addKeyframes: ""`, and every success
 * clears it again), so the first pass highlighted "" and marked the element
 * done — every later `highlightAll()` short-circuited and highlighting was INERT
 * for the whole authoring session. (2) Reformat re-colourised only because
 * `setHighlightingString` happened to write the FALSY empty string, so
 * "normalising" the marker to `"true"` would silently have turned reformat into
 * "inject raw text, never colourise".
 *
 * Keyed to the source, both disappear structurally: a pass is skipped exactly
 * when the element already shows the highlight of the text it currently holds,
 * which is what idempotence meant all along. The record lives beside the DOM in
 * a `WeakMap` — no attribute on a contenteditable surface the user copies out
 * of, and nothing to normalise. (No consumer of the old attribute exists:
 * `git grep -n 'highlighted' -- .` returns only prose.)
 */
const highlightedFrom = new WeakMap<HTMLElement, string>();

/**
 * Paint one host's own text (idempotent in that text).
 *
 * Module-level, not instance-level, because nothing about colourising a host
 * depends on which driver instance asked: the highlighter boot and the
 * idempotence record above are both shared. Only the THEME node is per-instance,
 * and `highlightAll()` is the seam that ensures it.
 */
const paintHost = (el: HTMLElement | null | undefined) => {
    if (!el || highlightedFrom.get(el) === el.innerText) {
        return;
    }
    void bootHighlighter().then(({ hljs }) => {
        // Re-read at write time: the boot is async and the user keeps typing.
        const source = el.innerText;
        if (highlightedFrom.get(el) === source) return;
        const h = hljs.highlight(source, { language: "css" });
        el.innerHTML = h.value;
        highlightedFrom.set(el, source);
    });
};

/**
 * THE WRITE-AUTHORITY CLAUSE OF THE CHILD-REF CONTRACT (X.KF.W12.a · KC-34 /
 * D-17 — the sequencing edict, and the reason it is this unit's FIRST commit).
 *
 * A highlighted host has exactly ONE DOM owner, and it is this driver. Vue must
 * render the host CHILDLESS (`<pre ref="preEl"></pre>`) and reach its contents
 * only through this function; the driver then owns every node inside it.
 *
 * What the edict is about: `paintHost` assigns `innerHTML`, which destroys every
 * child element. While the card's template rendered `<code>{{ formattedCSS }}</code>`
 * into the host, that assignment detached the very element Vue's vnode still
 * pointed at — two owners, one subtree. It stayed invisible only because every
 * projection pass unmounted and rebuilt the whole list (KF-KE-25, `.c`'s row),
 * which threw the divergent tree away before anyone could read it. The moment
 * the cards stay mounted (KC-8/KC-9, this unit's later commit), the SAME defect
 * becomes a visible stale-content bug: Vue patches text into a detached node and
 * the user sees the previous keyframe. Hence the order — this clause lands
 * BEFORE keep-mounted, never after.
 *
 * The write is idempotent in the source: a host that already shows this exact
 * text is left untouched, so a re-render that changes nothing never disturbs a
 * caret sitting in a `contenteditable` host.
 */
export const syncHostSource = (
    el: HTMLElement | null | undefined,
    source: string,
) => {
    if (!el || el.innerText === source) {
        return;
    }
    el.textContent = source;
    // The host now holds raw text; the record says so, and the paint follows in
    // the same act — the text and its colourisation are one write, never two
    // that a caller could order wrongly.
    highlightedFrom.delete(el);
    paintHost(el);
};

/**
 * How many live `useCodeHighlight()` instances hold the shared
 * `#highlightjs-theme` node. It is adopt-or-create, so more than one driver can
 * be looking at the same element: measured at this tree, the two call sites are
 * `KeyframesEditor.vue` and the `KeyframesAddDialog.vue` it renders, and both are
 * live at once whenever an editor mounts. Removing the node on the FIRST unmount
 * strips the theme from every survivor; the last holder out removes it.
 * ⟨X.KF.W5 arm 0, KAD-14(d)⟩
 */
let themeStyleHolders = 0;

/**
 * highlight.js code-highlight driver — consolidates the editor's previously
 * inline `highlight` / `setHighlightingString` block (D.W1.S2).
 *
 * Owns a single shared `#highlightjs-theme` <style> element in `document.head`
 * (the documented dynamic-stylesheet idiom — a head <style>, NOT a global DOM
 * reach), keeps it in sync with the demo's dark mode, and highlights ONLY the
 * elements the caller hands it via `getOwnedElements` — never the whole
 * document (D.W3.S1: the global `document.querySelectorAll("pre")` was the bug).
 */
export function useCodeHighlight(
    getOwnedElements: () => (HTMLElement | null | undefined)[],
) {
    const { isDark } = useGlobalDark();
    const themeStyle = ref<HTMLStyleElement | null>(null);
    /** Whether THIS instance is counted among the shared node's holders. */
    let holdsThemeStyle = false;

    /**
     * KF-KE-24, the PIPELINE half (X.KF.W12.c) — the injected theme is LAYERED.
     *
     * highlight.js's github sheets declare `.hljs { color; background }` with a
     * hard `#ffffff` / `#0d1117` plate. Injected UNLAYERED, that plate outranks
     * every layered rule in the document — Tailwind's `utilities` layer
     * included — so the host's `bg-transparent` never won, the well painted an
     * opaque rectangle inside the warm `--card` surface (a 1.42:1 tonal step in
     * the dark arm), and that opacity is what made the un-occluded action
     * cluster invisible (KF-KE-5's mechanism). Wrapped in `@layer components`
     * — a layer the demo's Tailwind entry already declares BEFORE `utilities`
     * (`@layer theme, base, components, utilities;`) — the token colours still
     * apply (nothing competes for them) while any utility on the host beats the
     * theme's plate by cascade-layer order rather than by luck. The TOKEN
     * decision (re-tokenising the theme onto the demo's own scale) is KF.W6's
     * rider and is not pre-empted.
     */
    const THEME_LAYER = "components";
    const layered = (theme: string) => `@layer ${THEME_LAYER} {\n${theme}\n}`;

    /** Load the theme for the demo's current mode. Rejects if the boot fails. */
    const applyCodeTheme = async () => {
        if (!themeStyle.value) {
            return;
        }
        const { githubDark, githubLight } = await bootHighlighter();
        const css = layered(isDark.value ? githubDark : githubLight);
        // Every `highlightAll()` — so every keydown — ensures the theme. Rewriting
        // the node's text re-parses the whole github stylesheet; write only when
        // the theme actually changed. ⟨X.KF.W5 arm 0, KAD-14(b)⟩
        if (themeStyle.value && themeStyle.value.textContent !== css) {
            themeStyle.value.textContent = css;
        }
    };

    /**
     * The theme boundary. `applyCodeTheme` is awaited by nobody —
     * `ensureThemeStyle` runs it on every `highlightAll()`, i.e. on every keydown,
     * and the dark-mode watch fires it again — so a failed highlight.js boot
     * surfaced only as an unhandled rejection. ⟨X.KF.W5 arm 0, KAD-5⟩
     *
     * The posture is deliberate and non-toast: this demo's toast surface is
     * structurally unreachable (the vue-sonner stylesheet is imported nowhere), so
     * a toast here would be an inert cure. The rejection is handled HERE, once,
     * and every caller goes through this boundary — no bare call is left.
     */
    const setCodeTheme = () => {
        void applyCodeTheme().catch((e) => {
            console.error("Failed to load the highlight.js theme:", e);
        });
    };

    const ensureThemeStyle = () => {
        const existing = document.head.querySelector(`#${THEME_STYLE_ID}`);
        if (existing) {
            themeStyle.value = existing as HTMLStyleElement;
        } else {
            const el = document.createElement("style");
            el.id = THEME_STYLE_ID;
            document.head.appendChild(el);
            themeStyle.value = el;
        }
        if (!holdsThemeStyle) {
            holdsThemeStyle = true;
            themeStyleHolders += 1;
        }
        setCodeTheme();
    };

    /**
     * Replace an element's content with a formatter's output.
     *
     * `s` is PLAIN TEXT — `prettier.format(css, { parser: "scss" })`'s return —
     * so it is written as text. Writing it through the markup setter made this
     * the demo's one DOM-XSS sink, reachable from a crafted `?state=` URL, and
     * corrupted ordinary CSS with no attacker present: the HTML parser
     * entity-decodes every `&`-sequence and swallows `<name…>` as a tag, and the
     * corrupted DOM is read back by `highlight()` and folded into the model by
     * the caller's `onInput`. ⟨X.KF.W5 arm 0, KAD-1 BLOCKER / KAD-2⟩
     */
    const setHighlightingString = (el: HTMLElement | null, s: string) => {
        if (!el) return;
        el.textContent = s;
        // The element now holds raw text, so the next pass must colourise it.
        highlightedFrom.delete(el);
    };

    /**
     * Highlight the caller's OWNED elements (the editor's own <pre> refs), plus
     * any explicit one-off element. Scoped — no document-wide sweep.
     */
    const highlightAll = (el?: HTMLElement) => {
        ensureThemeStyle();
        paintHost(el);
        for (const owned of getOwnedElements()) {
            paintHost(owned);
        }
    };

    watch(isDark, setCodeTheme);

    onUnmounted(() => {
        if (holdsThemeStyle) {
            holdsThemeStyle = false;
            themeStyleHolders = Math.max(0, themeStyleHolders - 1);
        }
        // The node is SHARED (adopt-or-create): the editor and its add-dialog each
        // hold one today. The last holder out removes it. ⟨X.KF.W5 arm 0, KAD-14(d)⟩
        if (themeStyleHolders === 0) {
            themeStyle.value?.remove();
        }
        themeStyle.value = null;
    });

    // `paintHost` is deliberately NOT returned: it is `highlightAll`'s
    // per-element step, and a caller reaching it through this instance would
    // skip the theme ensure. No consumer ever destructured it. The one seam a
    // host's OWN component needs — write the model's text into the host it
    // exposes — is the module-level `syncHostSource` above, which carries the
    // paint with it. ⟨X.KF.W5 arm 0, KAD-14(e); X.KF.W12.a KC-34⟩
    return { setHighlightingString, highlightAll };
}
