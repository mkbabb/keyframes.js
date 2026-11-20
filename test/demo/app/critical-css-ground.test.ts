/**
 * LAST-TEN KF-31 — the first paint is the app's own ground. The critical
 * sheet's `--background` in each theme is glass's `--neutral-0` arm (the warm
 * paper in light, the warm black in dark), so a slow load waits on the ground
 * the app will stand on and the mount does not re-tint it in one frame. Read
 * against glass's shipped tokens, so a change of glass's ground is caught here.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { criticalCSSPlugin } from "../../../scripts/build/vite/critical-css";

type Handler = (html: string, ctx: { bundle?: Record<string, unknown> }) => string;

const critical = (): string => {
    const hook = criticalCSSPlugin().transformIndexHtml as { handler: Handler };
    const html = '<head><link rel="stylesheet" crossorigin href="/assets/index-abc.css"></head>';
    const bundle = { "assets/index-abc.css": { type: "asset", fileName: "assets/index-abc.css", source: "" } };
    return hook.handler(html, { bundle }).match(/<style data-critical>([\s\S]*?)<\/style>/)?.[1] ?? "";
};

const TOKENS = path.resolve(import.meta.dirname, "../../../node_modules/@mkbabb/glass-ui/dist/styles/tokens");
const neutral0 = (file: string): string | undefined =>
    /--neutral-0:\s*([^;]+);/.exec(readFileSync(path.join(TOKENS, file), "utf8"))?.[1]?.trim();

/** A block's `--background` (the first block opened by `selector`). */
const backgroundIn = (css: string, selector: string): string | undefined => {
    const at = css.indexOf(`${selector} {`);
    return at < 0 ? undefined : /--background:\s*([^;]+);/.exec(css.slice(at, css.indexOf("}", at)))?.[1]?.trim();
};

describe("the first paint's ground (KF-31)", () => {
    it("is glass's light ground in light and its dark ground in dark", () => {
        const css = critical();
        expect(backgroundIn(css, ":root")).toBe(neutral0("color-radius.css"));
        expect(backgroundIn(css, ".dark")).toBe(neutral0("dark-arm.css"));
    });

    it("lets the app arrive by a fade, inside a layer", () => {
        expect(critical()).toMatch(/@layer base \{\s*#app\[data-arriving\] \{ animation: kf-app-arrive [^}]+\}\s*@keyframes kf-app-arrive \{ from \{ opacity: 0\.01; \} \}\s*\}/);
    });
});
