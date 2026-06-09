#!/usr/bin/env node
/**
 * b10-fsm-switch — drive the REAL scene-switch FSM via the "Scene" combobox so
 * the suspend/resume DFA path executes (B2: this._gen at suspend →
 * scenePlaybackAdapters → captureActive → switchScene). The plain hash-nav used
 * by the first census bypasses the dock-driven switchScene dispatch.
 *
 * Battery per origin scene: play it, then OPEN the Scene combobox and SELECT
 * each other scene in turn (and a couple round-trips), capturing console +
 * pageerror by transition.
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
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".map": "application/json" };
const CTRL_KEY = "animation-groups-control-options-store";

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return void res.writeHead(404).end();
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}
function resolveChromium() {
    const r = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    try { return r("playwright-core").chromium; } catch { return r("@playwright/test").chromium; }
}

const sink = [];
let phase = "init";
function wire(page) {
    page.on("console", (m) => {
        const t = m.type();
        if (t !== "error" && t !== "warning") return;
        sink.push({ phase, kind: t, text: m.text() });
    });
    page.on("pageerror", (e) => sink.push({ phase, kind: "pageerror", text: String(e?.message ?? e), stack: e?.stack ? String(e.stack) : null }));
}

// The dock morphs: the EXPANDED `.dock-layer--full` (holding the Scene/Controls
// comboboxes) is opacity:0/visibility:hidden until the dock is HOVERED. Expand it
// first so the combobox becomes interactable.
async function expandDock(page) {
    const dock = page.locator(".glass-dock").first();
    if ((await dock.count()) === 0) return "no .glass-dock";
    await dock.hover({ timeout: 2000, force: true }).catch(() => {});
    // wait for the morph to settle (full layer opacity→1)
    await page
        .waitForFunction(() => {
            const f = document.querySelector(".dock-layer--full");
            return f && getComputedStyle(f).visibility !== "hidden" && +getComputedStyle(f).opacity > 0.5;
        }, { timeout: 2500 })
        .catch(() => {});
    return "dock hovered";
}

// Select a scene via the "Scene" reka-ui combobox: expand dock, click trigger,
// then click the option by visible label text.
async function selectScene(page, label) {
    await expandDock(page);
    const trigger = page.locator('button[aria-label="Scene"]').first();
    if ((await trigger.count()) === 0) return `NO Scene combobox`;
    await trigger.click({ timeout: 3000, force: true }).catch((e) => sink.push({ phase, kind: "pageerror", text: `Scene trigger click: ${e.message}` }));
    await page.waitForTimeout(350);
    // reka-ui select options render in a portal as [role=option]
    const opt = page.locator(`[role="option"]:has-text("${label}")`).first();
    if ((await opt.count()) === 0) {
        await page.keyboard.press("Escape").catch(() => {});
        return `NO option "${label}"`;
    }
    await opt.click({ timeout: 3000 }).catch((e) => sink.push({ phase, kind: "pageerror", text: `option "${label}" click: ${e.message}` }));
    await page.waitForTimeout(1200);
    return `selected "${label}"`;
}

async function clickPlay(page) {
    const sels = ['button[aria-label*="Play animation"]', 'button[aria-label="Play"]', 'button:has-text("Play")'];
    for (const s of sels) {
        const b = page.locator(s).first();
        if ((await b.count()) > 0) {
            await b.click({ timeout: 2500, force: true }).catch((e) => sink.push({ phase, kind: "pageerror", text: `play click: ${e.message}` }));
            return `play ${s}`;
        }
    }
    return "no play button";
}

const server = serveDist();
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await resolveChromium().launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
wire(page);

const trace = [];
// Per the B2 spec: scene PLAYING → switch → first suspends+saves, next resumes
// iff it was playing. The user's exact repro is easing→amiga showing BLANK
// controls. Drive a tour that includes that and round-trips.
const TOUR = [
    { start: "cube", label: "Cube" },
    { to: "Easing", play: true },
    { to: "Amiga" },     // the user's easing→amiga blank-controls repro
    { to: "Square" },
    { to: "Spring", play: true },
    { to: "Sequence" },
    { to: "Cube" },
    { to: "Motion-path" }, // label may be "Path"
];

phase = "load:cube";
await page.goto(`${base}/#/cube`, { waitUntil: "load" });
await page.waitForTimeout(1500);
phase = "play:cube";
trace.push(await clickPlay(page));
await page.waitForTimeout(700);

for (const step of TOUR.slice(1)) {
    phase = `switch→${step.to}`;
    // try the label, plus "Path" alias for motion-path
    let r = await selectScene(page, step.to);
    if (r.startsWith("NO option") && step.to === "Motion-path") r = await selectScene(page, "Path");
    trace.push(`${phase}: ${r}`);
    // capture controls-panel emptiness signal (B2 blank controls)
    const ctrlState = await page.evaluate(() => {
        const panel = document.querySelector('[class*="controls"], aside, .stage-cell');
        const playBtns = [...document.querySelectorAll('button')].filter((b) => /play/i.test(b.getAttribute("aria-label") || b.textContent || ""));
        return { hasPlay: playBtns.length, bodyText: (document.querySelector("main, #app")?.textContent || "").trim().slice(0, 60) };
    });
    trace.push(`  ctrl-after-${step.to}: playBtns=${ctrlState.hasPlay}`);
    if (step.play) {
        phase = `play:${step.to}`;
        trace.push(await clickPlay(page));
        await page.waitForTimeout(700);
    }
    await page.screenshot({ path: path.join(SHOTS, `b10-fsm-${step.to.toLowerCase()}.png`) }).catch(() => {});
}

console.log("===FSM_TRACE===");
console.log(JSON.stringify(trace, null, 2));
console.log("===FSM_CONSOLE===");
console.log(JSON.stringify(sink, null, 2));
await browser.close();
server.close();
