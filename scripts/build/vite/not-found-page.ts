import type { Plugin } from "vite";

/**
 * Emit `404.html` (the shell) beside `index.html`. With a 404.html, Cloudflare
 * Pages answers a path the build does not hold with 404 and no long cache, not
 * with the shell as 200: a missing `/assets/*` file is never cached for a year
 * as HTML under the immutable `/assets/*` rule. The routes are hash routes, so
 * an unknown page still gets the shell and lands in the app.
 */
export function notFoundPagePlugin(): Plugin {
    return {
        name: "kf-not-found-page",
        apply: "build",
        enforce: "post",
        generateBundle: {
            order: "post",
            handler(_options, bundle) {
                const index = bundle["index.html"];
                if (!index || index.type !== "asset") {
                    this.error(
                        "[kf-not-found-page] the build emitted no index.html",
                    );
                }
                this.emitFile({
                    type: "asset",
                    fileName: "404.html",
                    source: index.source,
                });
            },
        },
    };
}
