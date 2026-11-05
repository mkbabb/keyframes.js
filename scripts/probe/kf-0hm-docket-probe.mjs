// SERVED MODEL: claude-opus-5-5
/**
 * value.js X §0hm.1 docket rows D-18 · D-28 · D-29, read on the served page.
 *
 * Run ONLY through the machine guard, never --light (it launches a browser):
 *   ~/.claude/guard/guarded --timeout 20 -- node scripts/probe/kf-0hm-docket-probe.mjs \
 *       --base http://localhost:5173/ --out ~/.dev-logs/x-0hm-cures/keyframes/run.json \
 *       [--rows d18,d28,d29] [--reps 5] [--shots DIR] [--dir BUILD --base http://kf.build/]
 *
 * One browser per run, a new context per cell, every context and the browser
 * closed in `finally`. Playwright resolves from PLAYWRIGHT_MODULE, else from
 * value.js's node_modules (keyframes.js does not depend on it).
 *
 * D-29 (desktop cube controls card, 1440x900): ONE surface — no bordered
 *   section edge is painted inside the pane frame (the frame is the one card;
 *   the ribbon's hairline is the one divider); no pill edge is painted round
 *   the `layer` row with its label flush on it; the transport discs are the
 *   control row's height, not 48 px.
 * D-28 (phone PEEK, portrait): no control row (layer header, labelled field,
 *   param row) straddles the resting sheet's visible foot.
 * D-28c (value.js X realization K-D1, phone PEEK): no row paints across the
 *   port's real CLIP EDGE (the tightest `overflow != visible` box's bottom) —
 *   every row ends at or above it or starts at or below it. `d28` tests the
 *   row FOOT the reserve aims at; this tests the edge the paint is cut at, so
 *   a sliver of the next row inside the fade ramp reads RED here.
 * D-18 (the @mbabb menu reveal at 1800x1000@2x): the rAF interval p95 over the
 *   reveal, and the layers Chromium re-paints during it (CDP LayerTree).
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const arg = (name, dflt) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > 0 ? process.argv[i + 1] : dflt;
};
const BASE = arg("base", "http://localhost:5173/").replace(/\/?$/, "/");
const OUT = arg("out", null);
const ROWS = arg("rows", "d18,d28,d29").split(",");
const REPS = Number(arg("reps", "5"));
const SHOTS = arg("shots", null);
// --dir: serve a built demo (`vite build --mode gh-pages --outDir DIR`) at
// --base from disk through the context's router, with no server to leave behind.
const DIR = arg("dir", null);
const PW = process.env.PLAYWRIGHT_MODULE ?? "/Users/mkbabb/Programming/value.js/node_modules/playwright/index.mjs";
const { chromium } = await import(PW);

const url = (scene) => `${BASE}#/${scene === "home" ? "" : scene}`;
const fails = [];
const out = {};
const errors = [];

async function open(browser, { w, h, dpr = 1, scene, motion = "reduce", scheme = "dark" }) {
    const ctx = await browser.newContext({
        viewport: { width: w, height: h },
        deviceScaleFactor: dpr,
        colorScheme: scheme,
        reducedMotion: motion,
    });
    if (DIR)
        await ctx.route(`${BASE}**`, (route) => {
            const rel = new URL(route.request().url()).pathname.replace(/^\/+/, "") || "index.html";
            const file = join(DIR, rel);
            return existsSync(file) ? route.fulfill({ path: file }) : route.fulfill({ path: join(DIR, "index.html") });
        });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push(`${scene}@${w}: ${String(e).slice(0, 160)}`));
    // Not networkidle: the served page keeps a beacon open, so it never idles.
    await page.goto(url(scene), { waitUntil: "load", timeout: 30000 });
    await page.waitForSelector(".stage-cell", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2500);
    return { ctx, page };
}

async function d29(browser) {
    const { ctx, page } = await open(browser, { w: 1440, h: 900, scene: "cube" });
    try {
        if (SHOTS) await page.screenshot({ path: join(SHOTS, "d29-cube-1440.png") });
        const r = await page.evaluate(() => {
            const frame = document.querySelector(".pane-frame");
            if (!frame) return null;
            const alpha = (c) => {
                const m = c.match(/[\d.]+/g);
                if (!m) return 0;
                if (c.startsWith("rgba") || c.includes("/")) return Number(m[m.length - 1]);
                return 1;
            };
            // Every bordered section edge painted inside the frame.
            const edges = [...frame.querySelectorAll(".configurator-layer")]
                .filter((e) => e.getBoundingClientRect().height > 0)
                .map((e) => {
                    const cs = getComputedStyle(e);
                    return {
                        w: parseFloat(cs.borderBottomWidth),
                        a: alpha(cs.borderBottomColor),
                        color: cs.borderBottomColor,
                        y: Math.round(e.getBoundingClientRect().bottom),
                    };
                });
            const btn = [...frame.querySelectorAll("button")].find((b) =>
                /^layer/.test(b.textContent.trim()),
            );
            let inset = null;
            if (btn) {
                const bcs = getComputedStyle(btn);
                const bb = btn.getBoundingClientRect();
                const label = btn.querySelector("span").getBoundingClientRect();
                const glyph = btn.querySelector("svg").getBoundingClientRect();
                inset = {
                    start: +(label.left - bb.left).toFixed(1),
                    end: +(bb.right - glyph.right).toFixed(1),
                    edge: parseFloat(bcs.borderTopWidth) > 0 && alpha(bcs.borderTopColor) > 0.01 ? bcs.borderTopColor : null,
                };
            }
            const disc = frame.querySelector(".btn-playback")?.getBoundingClientRect();
            const field = frame.querySelector('[data-slot="labeled-field"] input, [data-slot="select-trigger"]');
            return {
                edges,
                inset,
                disc: disc && Math.round(disc.height),
                row: field && Math.round(field.getBoundingClientRect().height),
            };
        });
        out.d29 = r;
        if (!r) return void fails.push("D-29: no .pane-frame");
        const painted = r.edges.filter((e) => e.w > 0 && e.a > 0.01);
        if (painted.length) fails.push(`D-29 seam: ${painted.length} bordered section edge(s) painted inside the frame (${painted.map((e) => `y=${e.y} ${e.color}`).join(", ")})`);
        // The row's label sits in the label column by design (no pill drawn);
        // a PAINTED pill edge with the label flush on it is the defect.
        if (!r.inset) fails.push("D-29 flush: no layer row");
        else if (r.inset.edge && Math.abs(r.inset.start - r.inset.end) > 2)
            fails.push(`D-29 flush: layer row pill painted (${r.inset.edge}), label inset ${r.inset.start} vs chevron ${r.inset.end}`);
        if (r.disc == null || r.row == null || r.disc > r.row) fails.push(`D-29 thumb: transport disc ${r.disc} px > control row ${r.row} px`);
    } finally {
        await ctx.close();
    }
}

async function d28(browser) {
    out.d28 = [];
    for (const vp of [{ w: 390, h: 844 }, { w: 430, h: 932 }]) {
        for (const scene of ["cube", "amiga", "square", "easing", "spring", "sequence"]) {
            const { ctx, page } = await open(browser, { ...vp, scene });
            try {
                const r = await page.evaluate(() => {
                    const sheet = document.querySelector(".controls-drawer-content");
                    if (!sheet) return null;
                    const box = sheet.getBoundingClientRect();
                    // The visible foot: the tightest clip between a row and the
                    // viewport — the sheet's own box, and every clipping
                    // ancestor's padding box (content paints into a
                    // scroller's padding, so that is where it is cut).
                    const first = sheet.querySelector('[data-slot="configurator-layer-trigger"]');
                    let foot = Math.min(box.bottom, innerHeight);
                    let clip = "sheet";
                    for (let e = first?.parentElement; e && e !== sheet.parentElement; e = e.parentElement) {
                        const cs = getComputedStyle(e);
                        if (cs.overflowY === "visible") continue;
                        const edge = e.getBoundingClientRect().bottom - parseFloat(cs.borderBottomWidth);
                        if (edge < foot) {
                            // A row inside the port's live end ramp is drawn
                            // feathered, not whole.
                            foot = edge - (parseFloat(cs.getPropertyValue("--fade-end")) || 0);
                            clip = `${e.tagName.toLowerCase()}.${String(e.className).split(" ")[0]}[${e.dataset.slot ?? ""}]`;
                        }
                    }
                    const rows = [
                        ...sheet.querySelectorAll(
                            '[data-slot="configurator-layer-trigger"], [data-slot="labeled-field"], .param-row',
                        ),
                    ]
                        .map((e) => e.getBoundingClientRect())
                        .filter((b) => b.height > 0);
                    const cut = rows.filter((b) => b.top < foot - 1 && b.bottom > foot + 1);
                    return {
                        sheetH: Math.round(box.height),
                        foot: Math.round(foot),
                        clip,
                        cut: cut.map((b) => [Math.round(b.top), Math.round(b.bottom)]),
                    };
                });
                if (SHOTS && (scene === "cube" || scene === "spring"))
                    await page.screenshot({ path: join(SHOTS, `d28-${scene}-${vp.w}x${vp.h}.png`), clip: { x: 0, y: vp.h - 340, width: vp.w, height: 340 } });
                out.d28.push({ vp: `${vp.w}x${vp.h}`, scene, ...r });
                if (!r) fails.push(`D-28 ${scene}@${vp.w}: no sheet`);
                else if (r.cut.length) fails.push(`D-28 ${scene}@${vp.w}: PEEK foot y=${r.foot} slices ${JSON.stringify(r.cut)}`);
            } finally {
                await ctx.close();
            }
        }
    }
}

async function d28c(browser) {
    out.d28c = [];
    for (const vp of [{ w: 390, h: 844 }, { w: 430, h: 932 }]) {
        for (const scheme of ["light", "dark"]) {
            for (const scene of ["cube", "amiga", "square", "spring"]) {
                const { ctx, page } = await open(browser, { ...vp, scene, scheme });
                try {
                    const r = await page.evaluate(() => {
                        const sheet = document.querySelector(".controls-drawer-content");
                        if (!sheet) return null;
                        const sel = '[data-slot="configurator-layer-trigger"], [data-slot="labeled-field"], .param-row';
                        const rows = [...sheet.querySelectorAll(sel)].filter((e) => e.getBoundingClientRect().height > 0);
                        if (!rows.length) return { rows: 0 };
                        // The real clip edge: the tightest clipping box above the
                        // rows, inside the sheet (and the sheet / viewport).
                        let edge = Math.min(sheet.getBoundingClientRect().bottom, innerHeight);
                        let clip = "sheet";
                        for (let e = rows[0].parentElement; e && e !== sheet.parentElement; e = e.parentElement) {
                            const cs = getComputedStyle(e);
                            if (cs.overflowY === "visible") continue;
                            const b = e.getBoundingClientRect().bottom - parseFloat(cs.borderBottomWidth);
                            if (b < edge) {
                                edge = b;
                                clip = `${e.tagName.toLowerCase()}.${String(e.className).split(" ")[0]}`;
                            }
                        }
                        const boxes = rows.map((e) => e.getBoundingClientRect());
                        const straddle = boxes.filter((b) => b.top < edge - 0.5 && b.bottom > edge + 0.5);
                        const port = sheet.querySelector(".fading-scroll");
                        return {
                            rung: sheet.getAttribute("data-rung") ?? sheet.closest("[data-rung]")?.getAttribute("data-rung") ?? null,
                            sheetH: Math.round(sheet.getBoundingClientRect().height),
                            edge: +edge.toFixed(1),
                            clip,
                            ramp: port ? getComputedStyle(port).getPropertyValue("--fade-scroll-width").trim() : null,
                            lastWhole: Math.round(Math.max(...boxes.filter((b) => b.bottom <= edge + 0.5).map((b) => b.bottom))),
                            straddle: straddle.map((b) => [Math.round(b.top), Math.round(b.bottom)]),
                        };
                    });
                    if (SHOTS && ((scene === "cube" && vp.w === 390 && scheme === "dark") || (scene === "spring" && vp.w === 430 && scheme === "light")))
                        await page.screenshot({ path: join(SHOTS, `d28c-${scene}-${vp.w}x${vp.h}-${scheme}.png`), clip: { x: 0, y: vp.h - 340, width: vp.w, height: 340 } });
                    out.d28c.push({ vp: `${vp.w}x${vp.h}`, scheme, scene, ...r });
                    if (!r) fails.push(`D-28c ${scene}@${vp.w} ${scheme}: no sheet`);
                    else if (r.straddle?.length) fails.push(`D-28c ${scene}@${vp.w} ${scheme}: clip edge y=${r.edge} (${r.clip}) cuts ${JSON.stringify(r.straddle)}`);
                } finally {
                    await ctx.close();
                }
            }
        }
    }
}

async function d18(browser) {
    out.d18 = [];
    for (let rep = 0; rep < REPS; rep++) {
        // Motion ON: the reveal is the thing measured.
        const { ctx, page } = await open(browser, { w: 1800, h: 1000, dpr: 2, scene: "home", motion: "no-preference" });
        try {
            const cdp = await ctx.newCDPSession(page);
            const paints = {};
            let layers = [];
            cdp.on("LayerTree.layerPainted", (e) => (paints[e.layerId] = (paints[e.layerId] ?? 0) + 1));
            cdp.on("LayerTree.layerTreeDidChange", (e) => e.layers && (layers = e.layers));
            // The dock rests collapsed (its labels are not hit-testable then):
            // a pointer over the dock's plate wakes it, as a person's does.
            const trig = page.locator('[aria-label="@mbabb menu"]').first();
            const dock = page.locator(".glass-dock").filter({ has: trig }).first();
            const db = await dock.boundingBox();
            await page.mouse.move(db.x + db.width / 2, db.y + db.height / 2);
            await page.waitForTimeout(1200);
            const bb = await trig.boundingBox();
            await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
            await page.waitForTimeout(1200);
            await cdp.send("DOM.getDocument", { depth: -1 });
            await cdp.send("LayerTree.enable");
            await page.waitForTimeout(400);
            for (const k of Object.keys(paints)) delete paints[k];
            await page.evaluate(() => {
                const S = (window.__d18 = { t: [], on: true });
                const f = (t) => {
                    if (!S.on) return;
                    S.t.push(t);
                    requestAnimationFrame(f);
                };
                requestAnimationFrame(f);
            });
            // A pointer press at the trigger's settled centre (the dock's own
            // hover expansion keeps the element "unstable" for Playwright's
            // actionability wait).
            const at = await trig.boundingBox();
            await page.mouse.click(at.x + at.width / 2, at.y + at.height / 2);
            await page.waitForTimeout(700);
            const opened = await page.locator('[role="menu"]').filter({ visible: true }).count();
            const raf = await page.evaluate(() => {
                window.__d18.on = false;
                const r = window.__d18.t;
                const d = r.slice(1).map((x, i) => x - r[i]).sort((a, b) => a - b);
                const q = (p) => +d[Math.min(d.length - 1, Math.floor(d.length * p))].toFixed(1);
                return { n: d.length, p50: q(0.5), p95: q(0.95), max: q(1) };
            });
            const top = Object.entries(paints).sort((a, b) => b[1] - a[1]).slice(0, 6);
            const painted = [];
            for (const [id, n] of top) {
                const L = layers.find((l) => l.layerId === id);
                let who = L ? `(anon ${Math.round(L.width)}x${Math.round(L.height)})` : "?";
                if (L?.backendNodeId) {
                    try {
                        const { nodeIds } = await cdp.send("DOM.pushNodesByBackendIdsToFrontend", { backendNodeIds: [L.backendNodeId] });
                        const { outerHTML } = await cdp.send("DOM.getOuterHTML", { nodeId: nodeIds[0] });
                        who = outerHTML.slice(0, 100);
                    } catch {}
                }
                painted.push({ n, size: L ? `${Math.round(L.width)}x${Math.round(L.height)}` : "", who });
            }
            await cdp.send("LayerTree.disable").catch(() => {});
            out.d18.push({ rep, opened, raf, layers: layers.length, painted });
            if (!opened) fails.push(`D-18 rep ${rep}: the menu did not open`);
        } finally {
            await ctx.close();
        }
    }
    const p95s = out.d18.map((r) => r.raf.p95).sort((a, b) => a - b);
    out.d18median = p95s[p95s.length >> 1];
    // The bar: one frame at 60 Hz (value's own cell reads p95 10 ms).
    if (!(out.d18median <= 17.5)) fails.push(`D-18: menu reveal rAF p95 median ${out.d18median} ms > 17.5 ms`);
}

const browser = await chromium.launch();
try {
    if (SHOTS) mkdirSync(SHOTS, { recursive: true });
    for (const [row, run] of [["d29", d29], ["d28", d28], ["d28c", d28c], ["d18", d18]]) {
        if (!ROWS.includes(row)) continue;
        try {
            await run(browser);
        } catch (e) {
            fails.push(`${row}: probe error ${String(e).split("\n")[0].slice(0, 160)}`);
        }
    }
} finally {
    await browser.close();
}
if (errors.length) fails.push(`pageerror ×${errors.length}: ${errors[0]}`);
const json = JSON.stringify({ base: BASE, at: new Date().toISOString(), rows: ROWS, fails, errors, out }, null, 1);
if (OUT) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, json);
}
console.log(fails.length ? `RED ${fails.length}\n${fails.join("\n")}` : "GREEN");
process.exitCode = fails.length ? 1 : 0;
