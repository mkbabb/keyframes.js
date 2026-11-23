import type { Plugin } from "vite";

/**
 * FORTY-SIXTH E1 (J11) — the page learns where each scene's chunk is, without
 * loading it. Each dynamic-entry chunk (a route-lazy scene, Home's backdrop) is
 * listed by its name with the files it needs: the chunk, its static imports
 * (transitively) and their stylesheets, less what the entry has already loaded. The list is written into the page as a
 * JSON script (`#kf-scene-chunks`), read by the idle warm (`warmScenesAtIdle`),
 * which FETCHES them (`<link rel="modulepreload">`, `<link rel="preload"
 * as="style">`) and never evaluates them: an import evaluates its module, and an
 * idle callback has no deadline over a module's evaluation, so the warm used to
 * hitch the hero's spin (62 to 92 ms frames at 4x).
 *
 * `skip` names chunks the page never warms at idle (the heavy vendors).
 */
export function sceneChunkMapPlugin(skip: readonly string[] = []): Plugin {
    return {
        name: "kf-scene-chunk-map",
        enforce: "post",
        transformIndexHtml: {
            order: "post",
            handler(html, ctx) {
                const bundle = ctx.bundle;
                if (!bundle) return html;
                type Chunk = { type: "chunk"; fileName: string; name: string; isEntry: boolean; isDynamicEntry: boolean; imports: string[]; viteMetadata?: { importedCss: Set<string> } };
                const chunks = new Map<string, Chunk>();
                for (const item of Object.values(bundle)) if (item.type === "chunk") chunks.set(item.fileName, item as unknown as Chunk);
                // The entry's own graph is on the page already: never listed.
                const loaded = new Set<string>();
                const mark = (c: Chunk) => {
                    if (loaded.has(c.fileName)) return;
                    loaded.add(c.fileName);
                    for (const css of c.viteMetadata?.importedCss ?? []) loaded.add(css);
                    for (const dep of c.imports) {
                        const d = chunks.get(dep);
                        if (d) mark(d);
                    }
                };
                for (const c of chunks.values()) if (c.isEntry) mark(c);
                const map: Record<string, string[]> = {};
                for (const chunk of chunks.values()) {
                    if (!chunk.isDynamicEntry) continue;
                    const files = new Set<string>();
                    const walk = (c: Chunk) => {
                        if (files.has(c.fileName) || loaded.has(c.fileName) || skip.some((s) => c.fileName.includes(s))) return;
                        files.add(c.fileName);
                        for (const css of c.viteMetadata?.importedCss ?? []) if (!loaded.has(css)) files.add(css);
                        for (const dep of c.imports) {
                            const d = chunks.get(dep);
                            if (d) walk(d);
                        }
                    };
                    walk(chunk);
                    map[chunk.name] = [...files];
                }
                const json = JSON.stringify(map).replace(/</g, "\\u003c");
                return html.replace("</head>", `<script type="application/json" id="kf-scene-chunks">${json}</script>\n</head>`);
            },
        },
    };
}
