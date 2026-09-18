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

export function useHighlightCSS(styleId: string) {
    const keyframesStyle = ref<HTMLStyleElement | null>(null);

    const ensureStyleElement = () => {
        const existing = document.head.querySelector(`#${styleId}`);
        if (existing) {
            keyframesStyle.value = existing as HTMLStyleElement;
        } else {
            const el = document.createElement("style");
            el.id = styleId;
            document.head.appendChild(el);
            keyframesStyle.value = el;
        }
    };

    const setContent = (css: string) => {
        if (keyframesStyle.value) {
            keyframesStyle.value.textContent = css;
        }
    };

    const clear = () => {
        if (keyframesStyle.value) {
            keyframesStyle.value.textContent = "";
        }
    };

    onMounted(() => {
        ensureStyleElement();
    });

    onUnmounted(() => {
        keyframesStyle.value?.remove();
        keyframesStyle.value = null;
    });

    return { keyframesStyle, setContent, clear };
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

    const setCodeTheme = async () => {
        if (!themeStyle.value) {
            return;
        }
        const { githubDark, githubLight } = await bootHighlighter();
        if (themeStyle.value) {
            themeStyle.value.textContent = isDark.value ? githubDark : githubLight;
        }
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

    /** Highlight one element's text content (idempotent in that text). */
    const highlight = (el: HTMLElement | null | undefined) => {
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
     * Highlight the caller's OWNED elements (the editor's own <pre> refs), plus
     * any explicit one-off element. Scoped — no document-wide sweep.
     */
    const highlightAll = (el?: HTMLElement) => {
        ensureThemeStyle();
        highlight(el);
        for (const owned of getOwnedElements()) {
            highlight(owned);
        }
    };

    watch(isDark, setCodeTheme);

    onUnmounted(() => {
        themeStyle.value?.remove();
        themeStyle.value = null;
    });

    return { setHighlightingString, highlight, highlightAll };
}
