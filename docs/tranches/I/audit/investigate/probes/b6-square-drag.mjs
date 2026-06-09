#!/usr/bin/env node
/**
 * b6-square-drag — Tranche I investigation probe (INVESTIGATION ONLY, no source fix).
 *
 * Reproduces B6: /square drag selects the controls/dock TEXT (no user-select:none
 * applied during the gesture) AND the drag "does not persist" (box springs home on
 * release).
 *
 * Harness pattern mirrors scripts/proof-no-orphan-specular.mjs: serveDist on port 0,
 * chromium via createRequire(KF_PLAYWRIGHT_DIR).require("playwright-core"),
 * openSceneFresh navigating `${base}/#/square`. We then drive a REAL pointer drag
 * with the mouse (down on the box → move across the dock/controls → up away from home),
 * and observe:
 *   (a) window.getSelection() text length while dragging over the chrome,
 *   (b) the box transform right after release vs ~700ms later (persistence),
 *   (c) page console + pageerror.
 * Screenshot → docs/tranches/I/audit/investigate/shots/b6-square-drag.png
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

const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";
const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".map": "application/json",
};

function serveDist() {
    const server = http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
    return server;
}

async function openSceneFresh(browser, base, scene, vw) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: 900 } });
    const page = await ctx.newPage();
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
    await page.waitForTimeout(900);
    return { ctx, page };
}

(async () => {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        console.error("dist/gh-pages not built");
        process.exit(2);
    }
    const requireFrom = createRequire(
        path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
    );
    const { chromium } = requireFrom("playwright-core");

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;

    const consoleMsgs = [];
    const pageErrors = [];
    const browser = await chromium.launch();
    const { ctx, page } = await openSceneFresh(browser, base, "square", 1440);
    page.on("console", (m) => consoleMsgs.push(`[${m.type()}] ${m.text()}`));
    page.on("pageerror", (e) => pageErrors.push(String(e.stack || e)));

    // Locate the drag box and a chunk of dock/controls text to drag across.
    const box = page.locator(".demo-box");
    await box.waitFor({ state: "visible", timeout: 5000 });
    const bb = await box.boundingBox();

    // ── (1) user-select audit: what does the chrome (dock/controls/body) declare? ──
    const selectCSS = await page.evaluate(() => {
        const pick = (sel) => {
            const el = document.querySelector(sel);
            if (!el) return { sel, present: false };
            const cs = getComputedStyle(el);
            return {
                sel,
                present: true,
                userSelect: cs.userSelect || cs.webkitUserSelect,
            };
        };
        return {
            body: { userSelect: getComputedStyle(document.body).userSelect },
            squareStage: pick(".square-stage"),
            demoBox: pick(".demo-box"),
            dock: pick("[class*='dock'], .glass-dock, [data-dock]"),
            // any text node bearing element in the bottom chrome
            controls: pick("[class*='control'], [class*='Control']"),
        };
    });

    // Center of the box (its current painted center; box may be at home).
    const cx = bb.x + bb.width / 2;
    const cy = bb.y + bb.height / 2;

    // Find a concrete TEXT-bearing element in the bottom chrome (dock label /
    // scene name) so the drag path provably crosses selectable text.
    const textTarget = await page.evaluate(() => {
        const inBottom = (r) => r.top > window.innerHeight * 0.55 && r.width > 0 && r.height > 0;
        const els = [...document.querySelectorAll("button, span, a, label, [class*='label']")];
        for (const el of els) {
            const txt = (el.textContent || "").trim();
            if (txt.length < 2) continue;
            const r = el.getBoundingClientRect();
            if (inBottom(r)) return { x: r.left + r.width / 2, y: r.top + r.height / 2, txt: txt.slice(0, 40) };
        }
        return null;
    });

    // ── (2) DRIVE A REAL DRAG: down on box, move slowly OVER the chrome text node.
    const targetX = textTarget ? textTarget.x : cx + 140;
    const targetY = textTarget ? textTarget.y : 860;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    const steps = 30;
    let maxSel = "";
    for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        await page.mouse.move(cx + (targetX - cx) * t, cy + (targetY - cy) * t, { steps: 1 });
        // wiggle horizontally over the text to provoke a selection sweep
        await page.mouse.move(cx + (targetX - cx) * t + 30, cy + (targetY - cy) * t, { steps: 1 });
        const sel = await page.evaluate(() => (window.getSelection()?.toString() ?? ""));
        if (sel.length > maxSel.length) maxSel = sel;
    }
    // Hold the drag at the bottom and re-sample the selection (the slow drag over text).
    await page.waitForTimeout(120);
    const selWhileDragging = await page.evaluate(() => window.getSelection()?.toString() ?? "");
    if (selWhileDragging.length > maxSel.length) maxSel = selWhileDragging;

    // Screenshot the highlight state mid-drag (before release).
    await page.screenshot({ path: path.join(SHOTS, "b6-square-drag.png") });

    // Box transform at the END of the drag (still held).
    const xfHeld = await page.evaluate(
        () => document.querySelector(".demo-box")?.style.transform ?? "(none)",
    );

    // ── (3) RELEASE far from home, then sample persistence over time ──
    await page.mouse.up();
    const xfImmediate = await page.evaluate(
        () => document.querySelector(".demo-box")?.style.transform ?? "(none)",
    );
    await page.waitForTimeout(700); // let any spring settle
    const xfSettled = await page.evaluate(
        () => document.querySelector(".demo-box")?.style.transform ?? "(none)",
    );

    const result = {
        textTarget,
        selectCSS,
        maxSelectionTextDuringDrag: JSON.stringify(maxSel).slice(0, 400),
        maxSelectionLength: maxSel.length,
        selectionWhileDraggingTail: JSON.stringify(selWhileDragging).slice(0, 200),
        transform_heldAtDragEnd: xfHeld,
        transform_immediateOnRelease: xfImmediate,
        transform_after700ms: xfSettled,
        consoleMsgs,
        pageErrors,
    };
    console.log("=== B6 SQUARE-DRAG PROBE RESULT ===");
    console.log(JSON.stringify(result, null, 2));

    await ctx.close();
    await browser.close();
    server.close();
})().catch((e) => {
    console.error("PROBE FAILED:", e);
    process.exit(1);
});
