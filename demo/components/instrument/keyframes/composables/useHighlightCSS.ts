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

    /** Replace an element's markup with a pre-built highlighted string. */
    const setHighlightingString = (el: HTMLElement | null, s: string) => {
        if (el) {
            el.setAttribute("highlighted", "");
            el.innerHTML = s;
        }
    };

    /** Highlight one element's text content (idempotent via the marker attr). */
    const highlight = (el: HTMLElement | null | undefined) => {
        if (!el || el.getAttribute("highlighted")) {
            return;
        }
        void bootHighlighter().then(({ hljs }) => {
            if (el.getAttribute("highlighted")) return;
            const h = hljs.highlight(el.innerText, { language: "css" });
            el.innerHTML = h.value;
            el.setAttribute("highlighted", "true");
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
