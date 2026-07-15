import type { Plugin } from "vite";

/** Make CSS links for selected lazy chunks non-render-blocking. */
export function deferLazyCSSPlugin(patterns: readonly string[]): Plugin {
    return {
        name: "defer-lazy-css",
        enforce: "post",
        transformIndexHtml(html) {
            for (const pattern of patterns) {
                const re = new RegExp(
                    `<link rel="stylesheet"([^>]*href="[^"]*${pattern}[^"]*"[^>]*)>`,
                    "g",
                );
                html = html.replace(
                    re,
                    (_, attrs) =>
                        `<link rel="stylesheet"${attrs} media="print" onload="this.media='all'">`,
                );
            }
            return html;
        },
    };
}
