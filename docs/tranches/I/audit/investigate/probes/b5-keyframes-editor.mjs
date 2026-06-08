#!/usr/bin/env node
/**
 * Tranche I — INVESTIGATION PROBE [b5-keyframes-editor].
 *
 * B5 — the CSS keyframes editor shows the placeholder
 *   `/* timing-function: custom — no CSS twin (see console) *​/`
 * instead of the real serialized @keyframes CSS. The placeholder is the
 * H.W0 S2 "honest readout floor" in KeyframesStringControls.vue:109 — it is
 * emitted when `CSSKeyframesToString(animation, …)` THROWS. So B5 = the
 * serializer is throwing on the live cube animation. Related to B1 (the
 * "......" empty-parse crash on the same serialization path).
 *
 * Harness modelled on scripts/proof-no-orphan-specular.mjs:
 *   serveDist (port 0) + chromium via createRequire(KF_PLAYWRIGHT_DIR).
 *
 * Drives:
 *   1. open /#/cube fresh, select an animation (start screen → pick), open the
 *      controls panel, click the "Keyframes" tab.
 *   2. read back the Monaco editor text — does it show the placeholder?
 *   3. capture page.on("console") + page.on("pageerror") VERBATIM.
 *   4. screenshot to ../shots/b5-keyframes-editor.png
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const SHOTS = path.resolve(HERE, "../shots");
fs.mkdirSync(SHOTS, { recursive: true });

const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf",
    ".map": "application/json",
};
const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
}

const CONSOLE = [];
const PAGEERRORS = [];

function wire(page) {
    page.on("console", (msg) => {
        CONSOLE.push({ type: msg.type(), text: msg.text() });
    });
    page.on("pageerror", (err) => {
        PAGEERRORS.push({ message: err.message, stack: err.stack });
    });
}

async function openSceneFresh(browser, base, scene) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    wire(page);
    await page.addInitScript((ck) => {
        try {
            localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true }));
        } catch {}
    }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page
        .waitForFunction(
            ([mk, s]) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s;
                } catch {
                    return false;
                }
            },
            [MACHINE_KEY, scene],
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.waitForTimeout(1000);
    return { ctx, page };
}

function requirePlaywright() {
    const requireFrom = createRequire(
        path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
    );
    try {
        return requireFrom("playwright-core");
    } catch {
        return requireFrom("@playwright/test");
    }
}

async function main() {
    const { chromium } = requirePlaywright();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const findings = {};

    try {
        const { page } = await openSceneFresh(browser, base, "cube");

        // 1. dismiss the start screen by SELECTING an animation. The start screen
        //    overlay carries the animation picker; we click the first selectable
        //    animation option we can find. Try a few idioms.
        const startState = await page.evaluate(() => {
            const txt = (el) => (el?.textContent || "").trim().slice(0, 60);
            const buttons = [...document.querySelectorAll("button")].map((b) => ({
                t: txt(b),
                cls: b.className.slice(0, 80),
            }));
            return {
                hasStartScreen: !!document.querySelector(
                    "[class*=start],[class*=Start],[class*=overlay]",
                ),
                buttonCount: buttons.length,
                buttons: buttons.slice(0, 40),
            };
        });
        findings.startState = startState;

        // Try to click an animation-select / play to mount controls. The cube
        // start screen lists presets; clicking one selects + mounts controls.
        // Strategy: click any button whose text looks like an animation name,
        // else the menubar selector. We probe the DOM and click programmatically.
        await page.evaluate(() => {
            // open any animation selector dropdown if present
            const sel = document.querySelector(
                "[class*=menubar] button, [aria-haspopup], [role=combobox]",
            );
            sel?.click?.();
        });
        await page.waitForTimeout(400);

        // Click the first menu item / select item that appears.
        const picked = await page.evaluate(() => {
            const items = [
                ...document.querySelectorAll(
                    "[role=menuitem],[role=option],[data-radix-collection-item]",
                ),
            ];
            if (items.length) {
                items[0].click();
                return items[0].textContent?.trim().slice(0, 60) || "(clicked first item)";
            }
            return null;
        });
        findings.pickedAnimation = picked;
        await page.waitForTimeout(800);

        // 2. find + click the Keyframes tab trigger.
        const keyframesTab = await page.evaluate(() => {
            const trigs = [...document.querySelectorAll("[role=tab],button")];
            const kf = trigs.find((t) =>
                /keyframe/i.test((t.textContent || "").trim()),
            );
            if (kf) {
                kf.click();
                return { found: true, text: kf.textContent?.trim().slice(0, 40) };
            }
            return {
                found: false,
                tabTexts: trigs
                    .filter((t) => t.getAttribute("role") === "tab")
                    .map((t) => (t.textContent || "").trim().slice(0, 30)),
            };
        });
        findings.keyframesTab = keyframesTab;
        await page.waitForTimeout(1500); // Monaco spin-up + serialization

        // 3. read back the Monaco editor content + look for the placeholder.
        const editorContent = await page.evaluate(() => {
            const view = [...document.querySelectorAll(".monaco-editor .view-lines")];
            const texts = view.map((v) => v.textContent || "");
            // The whole keyframes pane innerText (placeholder lives in the model).
            const pane = document.querySelector(".monaco-pane");
            return {
                monacoBlocks: texts.length,
                monacoText: texts.join("\n").slice(0, 1200),
                paneInnerText: (pane?.textContent || "").slice(0, 800),
            };
        });
        findings.editorContent = editorContent;

        // 4. directly invoke the serializer in-page to capture the THROW verbatim.
        //    We reach the live Animation by exercising the same call the component
        //    makes: find the keyframes control component's exposed getCSSString is
        //    not reachable; instead, harvest the placeholder presence.
        findings.placeholderPresent =
            (editorContent.monacoText + editorContent.paneInnerText).includes(
                "no CSS twin",
            );

        await page.screenshot({
            path: path.join(SHOTS, "b5-keyframes-editor.png"),
            fullPage: false,
        });

        // also screenshot the keyframes pane region if found
        await page
            .locator(".monaco-pane")
            .first()
            .screenshot({ path: path.join(SHOTS, "b5-keyframes-pane.png") })
            .catch(() => {});
    } finally {
        await browser.close();
        server.close();
    }

    findings.console = CONSOLE;
    findings.pageerrors = PAGEERRORS;
    console.log(JSON.stringify(findings, null, 2));
}

main().catch((e) => {
    console.error("PROBE FAILED:", e);
    process.exit(1);
});
