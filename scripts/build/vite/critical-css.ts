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

                const criticalCSS = `
:root {
    color-scheme: light;
    --background: hsl(0 0% 100%);
    --foreground: hsl(222.2 84% 4.9%);
    --card: hsl(0 0% 100%);
    --border: hsl(214.3 31.8% 91.4%);
    --muted-foreground: hsl(215.4 16.3% 46.9%);
    --shadow-color: hsl(0 0% 0%);
    --radius-pill: 9999px;
    --radius-card: 1rem;
    --glass-bg-medium: color-mix(in srgb, var(--card) 65%, transparent);
    --glass-border-subtle: color-mix(in srgb, var(--foreground) 8%, transparent);
    --glass-blur-subtle: blur(4px) saturate(1.05);
    --glass-highlight: inset 0 0.5px 0 0 hsl(0 0% 100% / 0.25);
}
.dark {
    color-scheme: dark;
    --background: hsl(224 71% 4%);
    --foreground: hsl(210 40% 98%);
    --card: hsl(224 50% 10%);
    --border: hsl(216 34% 17%);
    --muted-foreground: hsl(215 20.2% 65.1%);
    --glass-highlight: inset 0 0.5px 0 0 hsl(0 0% 100% / 0.08);
}
*, *::before, *::after { box-sizing: border-box; border-color: var(--border); }
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
