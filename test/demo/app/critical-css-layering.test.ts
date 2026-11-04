/**
 * value.js X §0hm D-29 — the first-paint sheet must not outrank the app's
 * layered styles once the main stylesheet has loaded.
 *
 * The plugin's inline `<style data-critical>` stays in <head> for the page's
 * whole life. An UNLAYERED rule there beats every rule inside a cascade layer
 * of the main sheet, whatever its specificity: its universal
 * `border-color: var(--border)` repainted every `@layer components` border
 * colour on the served build (glass's section card edge and a quiet Button's
 * transparent edge), which the dev server — no plugin — never showed.
 */
import { describe, expect, it } from "vitest";

import { criticalCSSPlugin } from "../../../scripts/build/vite/critical-css";

type Handler = (html: string, ctx: { bundle?: Record<string, unknown> }) => string;

const render = (): string => {
    const hook = criticalCSSPlugin().transformIndexHtml as { handler: Handler };
    const html = '<head><link rel="stylesheet" crossorigin href="/assets/index-abc.css"></head>';
    const bundle = {
        "assets/index-abc.css": { type: "asset", fileName: "assets/index-abc.css", source: "" },
    };
    const out = hook.handler(html, { bundle });
    const css = out.match(/<style data-critical>([\s\S]*?)<\/style>/)?.[1];
    if (css === undefined) throw new Error("no critical style emitted");
    return css;
};

/** The sheet with every `@layer name { … }` block removed: what is unlayered. */
const unlayered = (css: string): string => {
    let out = "";
    let i = 0;
    while (i < css.length) {
        const m = /@layer\s+[\w-]+\s*\{/y;
        m.lastIndex = i;
        if (m.exec(css)) {
            let depth = 1;
            let j = m.lastIndex;
            for (; j < css.length && depth; j++) {
                if (css[j] === "{") depth++;
                else if (css[j] === "}") depth--;
            }
            i = j;
            continue;
        }
        out += css[i++];
    }
    return out;
};

describe("critical CSS layering (D-29)", () => {
    it("declares the main sheet's layer order before any layered rule", () => {
        const css = render();
        const first = css.trim().split("\n")[0];
        expect(first).toBe("@layer properties, theme, base, components, utilities;");
    });

    it("keeps no element-level reset unlayered (only token and page-root rules)", () => {
        const rest = unlayered(render());
        const selectors = [...rest.matchAll(/([^{};]+)\{/g)].map((m) => (m[1] ?? "").trim());
        expect(selectors.filter((s) => !s.startsWith("@"))).toEqual([":root", ".dark", "html, body"]);
        expect(rest).not.toMatch(/border-color/);
    });

    it("still resets box-sizing and border colour, inside the base layer", () => {
        const css = render();
        expect(css).toMatch(
            /@layer base\s*\{\s*\*, \*::before, \*::after \{ box-sizing: border-box; border-color: var\(--border\); \}\s*\}/,
        );
    });
});
