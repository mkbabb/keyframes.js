import type { Plugin } from "vite";

/** Inline first-paint CSS and defer the main generated stylesheet. */
export function criticalCSSPlugin(): Plugin {
    return {
        name: "critical-css-inline",
        enforce: "post",
        transformIndexHtml: {
            order: "post",
            handler(html, ctx) {
                if (!ctx.bundle) return html;

                const cssAsset = Object.values(ctx.bundle).find(
                    (
                        asset,
                    ): asset is Extract<typeof asset, { type: "asset" }> =>
                        asset.type === "asset" &&
                        typeof asset.fileName === "string" &&
                        asset.fileName.endsWith(".css") &&
                        asset.fileName.includes("index"),
                );
                if (!cssAsset || typeof cssAsset.source !== "string")
                    return html;

                // value.js X §0hm D-29 — the inline sheet OUTLIVES first
                // paint: it stays in <head> after the main stylesheet loads,
                // so an UNLAYERED rule here outranks every layered rule
                // there. Its universal `border-color: var(--border)` beat
                // every `@layer components` border colour (glass's section
                // card read `--configurator-divider-section`, a quiet
                // Button's edge read transparent), painting the served
                // build's card-in-card seam and the pill round the `layer`
                // row that the dev server never showed. The reset lives in
                // `@layer base`, as Tailwind's preflight does, under the
                // same layer order the main sheet declares first.
                // LAST-TEN KF-31 — the first paint is the app's own ground:
                // `--background` is glass's `--neutral-0` in each arm (the
                // warm paper, the warm black), so a slow load waits on the
                // ground the app will stand on, and the app does not re-tint
                // it in one frame when it mounts. The app then arrives by a
                // short fade (`data-arriving`, set by main.ts at mount and
                // cleared when the fade ends), never whole in one frame.
                // The fade starts at 0.01, not 0: content first painted under
                // a true zero is not reported as the first contentful paint
                // when nothing repaints after the fade (the cube), so the page
                // reported no FCP or LCP. 0.01 reads as nothing.
                const criticalCSS = `
@layer properties, theme, base, components, utilities;
:root {
    color-scheme: light;
    --background: hsl(40 30% 98%);
    --foreground: hsl(222.2 84% 4.9%);
    --card: hsl(0 0% 100%);
    --border: hsl(214.3 31.8% 91.4%);
    --muted-foreground: hsl(215.4 16.3% 46.9%);
    --shadow-color: hsl(0 0% 0%);
    --radius-pill: 1rem;
    --radius-card: 1rem;
    --glass-bg-medium: color-mix(in srgb, var(--card) 65%, transparent);
    --glass-border-subtle: color-mix(in srgb, var(--foreground) 8%, transparent);
    --glass-blur-subtle: blur(4px) saturate(1.05);
    --glass-highlight: inset 0 0.5px 0 0 hsl(0 0% 100% / 0.25);
}
.dark {
    color-scheme: dark;
    --background: hsl(24 9% 4%);
    --foreground: hsl(210 40% 98%);
    --card: hsl(224 50% 10%);
    --border: hsl(216 34% 17%);
    --muted-foreground: hsl(215 20.2% 65.1%);
    --glass-highlight: inset 0 0.5px 0 0 hsl(0 0% 100% / 0.08);
}
@layer base {
    *, *::before, *::after { box-sizing: border-box; border-color: var(--border); }
}
@layer base {
    #app[data-arriving] { animation: kf-app-arrive var(--duration-normal, 0.3s) var(--ease-out, ease-out) both; }
    @keyframes kf-app-arrive { from { opacity: 0.01; } }
}
html, body {
    background-color: var(--background);
    color: var(--foreground);
    overflow: hidden;
    margin: 0;
    padding: 0;
    min-height: 100dvh;
    width: 100%;
}
`;
                const inlineStyle = `<style data-critical>${criticalCSS}</style>`;
                const mainCSSLink = new RegExp(
                    `<link rel="stylesheet"([^>]*href="[^"]*index-[^"]*\\.css"[^>]*)>`,
                );

                return html.replace(
                    mainCSSLink,
                    (_, attrs) =>
                        `${inlineStyle}\n      <link rel="stylesheet"${attrs} media="print" onload="this.media='all'">\n      <noscript><link rel="stylesheet"${attrs}></noscript>`,
                );
            },
        },
    };
}
