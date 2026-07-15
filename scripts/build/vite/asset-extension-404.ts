import type { Plugin } from "vite";

const ASSET_EXTENSION_RE =
    /\.(svg|png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|eot|mp4|webm|json|map|wasm)(\?.*)?$/i;

/** Prevent Vite's SPA fallback from masking missing asset URLs as HTML 200s. */
export function assetExtension404Plugin(): Plugin {
    return {
        name: "kf-asset-extension-404",
        apply: "serve",
        configureServer(server) {
            // Register before Vite's htmlFallbackMiddleware. Existing assets are
            // still served by URL; only an extension-bearing miss falls to 404.
            server.middlewares.use((req, _res, next) => {
                const pathname = (req.url ?? "").split("?")[0];
                if (ASSET_EXTENSION_RE.test(pathname)) {
                    (
                        req as { headers: Record<string, string> }
                    ).headers.accept = "application/octet-stream";
                }
                next();
            });
        },
    };
}
