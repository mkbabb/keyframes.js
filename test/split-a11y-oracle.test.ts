/**
 * test/split-a11y-oracle.test.ts — the S.F2 SplitText BORN-RED a11y oracle (the
 * wave's T8 hard gate skeleton). It emits the REAL built `splitText` (the LIGHT
 * barrel, `dist/keyframes.js`) into a real Chromium page and asserts VIA THE
 * BROWSER A11Y TREE — a claim the kf source structurally CANNOT substitute for.
 *
 * WHY BROWSER-HARNESS (load-bearing): the COMPUTED ACCESSIBLE NAME is a browser
 * artifact. jsdom does not run the ARIA name-computation algorithm, so "the
 * container's accessible name == the pre-split string" is INVISIBLE in jsdom —
 * a jsdom slot could only check the raw `aria-label` ATTRIBUTE (source-shape),
 * never that a plain `<div>` (role=generic, name-prohibited) would drop the
 * label. This gate reads the actual a11y tree (`page.accessibility.snapshot`),
 * so a split that shatters the name (fragment text exposed without an
 * author-name-capable role) REDs — proving the gate is a11y-real, not
 * source-shape.
 *
 * The library is injected as a real ES module over a same-origin static server
 * (so the barrel's `./sequence-*.js` LIGHT chunk import resolves) — `splitText`
 * runs in-browser against the live DOM, the shipped LIGHT code as written.
 *
 * Skips (does not fail) when playwright-core is unresolvable or the library is
 * unbuilt, so the default `vitest run` stays green in a browserless env; the
 * CI-blocking browser-harness member is `scripts/proof-split-a11y.mjs` (wired
 * into the demo-correctness roster), which builds the lib + runs under
 * KF_PLAYWRIGHT_DIR.
 */
import http from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Resolve playwright-core's chromium via glass-ui's install (KF_PLAYWRIGHT_DIR). */
function resolveChromium(): any {
    for (const pkg of ["playwright-core", "@playwright/test"]) {
        try {
            const requireFrom = createRequire(
                path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
            );
            return requireFrom(pkg).chromium;
        } catch {
            /* try next */
        }
    }
    return null;
}

const chromium = resolveChromium();

const PRE_SPLIT = "Select an animation";

/**
 * Bundle a value.js-free, self-contained ESM of `{ splitText, stagger }` off the
 * LIGHT source, tree-shaken (the SAME rolldown mechanism `proof:boundary` uses to
 * prove the entry is value.js-free). The shipped `dist/keyframes.js` shares a
 * chunk that carries a bare `@mkbabb/value.js` specifier (unresolvable in a raw
 * browser module load), so the isolated bundle — the real `splitText` source, no
 * value.js edge — is what runs in-browser here.
 */
async function bundleLight(): Promise<string | null> {
    let rolldown: any;
    try {
        ({ rolldown } = await import("rolldown"));
    } catch {
        return null;
    }
    const entry = path.join(REPO, ".split-a11y-entry.mjs");
    const { writeFileSync, rmSync } = await import("node:fs");
    writeFileSync(
        entry,
        `export { splitText } from ${JSON.stringify(
            path.join(REPO, "src/animation/orchestration/split-text"),
        )};\n` +
            `export { stagger } from ${JSON.stringify(
                path.join(REPO, "src/animation/orchestration/stagger"),
            )};\n`,
    );
    try {
        const bundle = await rolldown({
            input: entry,
            treeshake: true,
            logLevel: "silent",
        });
        const { output } = await bundle.generate({ format: "es" });
        await bundle.close();
        return output[0].code as string;
    } finally {
        rmSync(entry, { force: true });
    }
}

let LIGHT_BUNDLE = "";

/** The harness page: imports the isolated LIGHT bundle, exposes it on window. */
const harnessHTML = () => `<!doctype html><html><head><meta charset="utf-8"><style>
    #t { font: 20px/1.5 sans-serif; width: 220px; }
    @keyframes kfUp { from { opacity: 0 } to { opacity: 1 } }
</style></head><body>
    <div id="t">${PRE_SPLIT}</div>
    <script type="module">
        import { splitText, stagger } from "/split-light.js";
        window.kf = { splitText, stagger };
        window.dispatchEvent(new Event("kf-ready"));
    </script>
</body></html>`;

/** A tiny same-origin static server: `/` → the harness, `/split-light.js` → bundle. */
function serve(): Promise<{ url: string; close: () => Promise<void> }> {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const url = new URL(req.url ?? "/", "http://x").pathname;
            if (url === "/split-light.js") {
                res.writeHead(200, {
                    "content-type": "text/javascript; charset=utf-8",
                });
                res.end(LIGHT_BUNDLE);
                return;
            }
            if (url === "/" || url === "/index.html") {
                res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
                res.end(harnessHTML());
                return;
            }
            res.writeHead(404).end();
        });
        server.listen(0, "127.0.0.1", () => {
            const { port } = server.address() as { port: number };
            resolve({
                url: `http://127.0.0.1:${port}`,
                close: () => new Promise((r) => server.close(() => r())),
            });
        });
    });
}

const bundle = await bundleLight();

describe.skipIf(!chromium || !bundle)("S.F2 SplitText — a11y-tree oracle", () => {
    let browser: any;
    let base: string;
    let stop: () => Promise<void>;

    beforeAll(async () => {
        LIGHT_BUNDLE = bundle ?? "";
        browser = await chromium.launch();
        const s = await serve();
        base = s.url;
        stop = s.close;
    }, 30000);
    afterAll(async () => {
        await browser?.close();
        await stop?.();
    });

    it("the split container's COMPUTED accessible name == the pre-split string", async () => {
        const page = await browser.newPage();
        try {
            await page.goto(`${base}/`, { waitUntil: "load" });
            await page.waitForFunction("!!window.kf");

            const info = await page.evaluate((pre: string) => {
                const el = document.getElementById("t")!;
                const original = el.textContent ?? "";
                const s = (window as any).kf.splitText(el, { by: "word" });
                return {
                    pre,
                    original,
                    n: s.fragments.length,
                    ariaLabel: el.getAttribute("aria-label"),
                    role: el.getAttribute("role"),
                    hidden: s.fragments.every(
                        (f: Element) => f.getAttribute("aria-hidden") === "true",
                    ),
                };
            }, PRE_SPLIT);

            // The split actually happened (a multi-word cohort).
            expect(info.original).toBe(PRE_SPLIT);
            expect(info.n).toBeGreaterThan(1);
            expect(info.hidden).toBe(true);

            // ── THE T8 HARD ASSERTION — the browser a11y tree via CDP. ────────
            // (This playwright-core build removed `page.accessibility`; the CDP
            // `Accessibility.getPartialAXTree` read is the equivalent — the
            // Chromium-computed AX node for the container.)
            const client = await page.context().newCDPSession(page);
            await client.send("DOM.enable");
            await client.send("Accessibility.enable");
            const { root } = await client.send("DOM.getDocument", { depth: -1 });
            const { nodeId } = await client.send("DOM.querySelector", {
                nodeId: root.nodeId,
                selector: "#t",
            });
            const { node } = await client.send("DOM.describeNode", { nodeId });
            const { nodes } = await client.send("Accessibility.getPartialAXTree", {
                nodeId,
                fetchRelatives: true,
            });
            const target = nodes.find(
                (n: any) => n.backendDOMNodeId === node.backendNodeId,
            );
            expect(target).toBeTruthy();
            expect(target.ignored).toBe(false);
            // Computed accessible name equals the ORIGINAL pre-split string.
            expect(target.name?.value).toBe(PRE_SPLIT);
            // The name is CONSOLIDATED: the container has NO AX children — every
            // fragment was pruned by aria-hidden, so no per-fragment named leaf
            // survives in the a11y tree (the split did not shatter the name).
            expect(target.childIds?.length ?? 0).toBe(0);
        } finally {
            await page.close();
        }
    }, 30000);

    it("the fragments ANIMATE under the ready stagger (browser scrub)", async () => {
        const page = await browser.newPage();
        try {
            await page.goto(`${base}/`, { waitUntil: "load" });
            await page.waitForFunction("!!window.kf");

            const opacities: number[] = await page.evaluate(() => {
                const el = document.getElementById("t")!;
                const s = (window as any).kf.splitText(el, { by: "word" });
                // Drive a stagger over the cohort via the READY delays.
                s.fragments.forEach((f: HTMLElement, i: number) => {
                    f.style.animation = "kfUp 400ms linear forwards";
                    f.style.animationDelay = `${s.delays[i]}ms`;
                });
                // Scrub every fragment's CSS animation to a fixed mid-time.
                return s.fragments.map((f: HTMLElement) => {
                    const a = (f as any).getAnimations()[0];
                    a.pause();
                    a.currentTime = 300; // ms into each fragment's own timeline
                    return parseFloat(getComputedStyle(f).opacity);
                });
            });

            expect(opacities.length).toBeGreaterThan(1);
            const first = opacities[0]!;
            const last = opacities[opacities.length - 1]!;
            // Motion happened (fragment 0 is partway, not at rest, not finished).
            expect(first).toBeGreaterThan(0.1);
            expect(first).toBeLessThan(1);
            // The STAGGER ordering drives the cohort: the earlier-delayed fragment
            // is further along than the later-delayed one at the same scrub time.
            expect(first).toBeGreaterThan(last + 0.2);
        } finally {
            await page.close();
        }
    }, 30000);
});
