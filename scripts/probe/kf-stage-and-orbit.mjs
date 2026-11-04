// SERVED MODEL: claude-opus-5-5
/**
 * KF-M1 + KF-M2 browser gates (value.js COHESION §0hm): the visible-stage box
 * V on phones, and the orbit under real input.
 *
 * Run ONLY through the machine guard, never --light (it launches a browser):
 *   ~/.claude/guard/guarded --timeout 20 -- node scripts/probe/kf-stage-and-orbit.mjs \
 *       --base http://localhost:5173/ --out ~/.dev-logs/x-0hm/kfbuild/run.json [--mode layout|orbit|all] [--shots DIR]
 *
 * One browser per run, a new context per cell, every context and the browser
 * closed in `finally`. Playwright resolves from PLAYWRIGHT_MODULE, else from
 * value.js's node_modules (keyframes.js does not depend on it).
 *
 * Layout cells (M1.1/M1.2/M1.4): for every phone cell the subject centre is
 * read against V — the viewport minus the top dock band, minus the transport
 * band and the sheet (bottom at portrait, the side sheet at short landscape),
 * minus the page gutter — computed from the PAGE's rendered rects and tokens,
 * never from the stage cell's own padding (the thing under test). At OPEN the
 * centre is read against the region above the opened sheet. Desktop cells
 * record the subject rect for the G0 invariance diff.
 *
 * Orbit cells (G2.1/G2.3/G2.6): CDP touch and mouse on the cube, under reduced
 * motion (no idle bob, no coast), reading the OrbitalDrag container's computed
 * matrix and the front face's projected centre.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const arg = (name, dflt) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > 0 ? process.argv[i + 1] : dflt;
};
const BASE = arg("base", "http://localhost:5173/");
const OUT = arg("out", null);
const MODE = arg("mode", "all");
const SHOTS = arg("shots", null);
const SCHEMES = (arg("schemes", "dark")).split(",");
const PW = process.env.PLAYWRIGHT_MODULE ?? "/Users/mkbabb/Programming/value.js/node_modules/playwright/index.mjs";
const { chromium } = await import(PW);

const PHONES = [
    { w: 390, h: 844 },
    { w: 430, h: 932 },
    { w: 844, h: 390 },
];
const DESKTOPS = [
    { w: 1440, h: 900, dpr: 1 },
    { w: 1800, h: 1000, dpr: 2 },
];
const SCENES = ["home", "cube", "amiga", "square", "easing", "spring", "sequence"];
const SUBJECT = {
    home: ".graph",
    cube: ".graph",
    amiga: ".stage-cell canvas",
    square: '.stage-cell [data-slot="card"]',
    easing: '.stage-cell [data-slot="card"]',
    spring: '.stage-cell [data-slot="card"]',
    sequence: '.stage-cell [data-slot="card"]',
};

const url = (scene) => `${BASE.replace(/\/?$/, "/")}#/${scene === "home" ? "" : scene}`;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

/** Everything a layout cell reads, in one evaluate. */
function readLayout(subjectSel) {
    const rr = (r) => r && { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height };
    const visible = (e) => {
        const b = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        return b.width > 0 && b.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
    };
    const largest = (sel) => {
        let best = null;
        let area = 0;
        for (const e of document.querySelectorAll(sel)) {
            if (!visible(e)) continue;
            const b = e.getBoundingClientRect();
            if (b.width * b.height > area) {
                area = b.width * b.height;
                best = e;
            }
        }
        return best;
    };
    // Tokens resolved through a probe element (the page's own definitions).
    const probe = document.createElement("div");
    probe.style.cssText =
        "position:fixed;visibility:hidden;inset:0;padding-top:var(--dock-top-band-reserve-stable);padding-bottom:var(--transport-band);padding-left:var(--page-gutter,0px)";
    document.body.append(probe);
    const pcs = getComputedStyle(probe);
    const topBand = parseFloat(pcs.paddingTop) || 0;
    const transportBand = parseFloat(pcs.paddingBottom) || 0;
    const gutter = parseFloat(pcs.paddingLeft) || 0;
    probe.remove();

    const sheetEl = largest('[data-slot="sheet-content"]');
    const sheet = sheetEl ? sheetEl.getBoundingClientRect() : null;
    const side = sheet ? (sheet.top <= innerHeight * 0.25 && sheet.left > innerWidth * 0.3 ? "right" : "bottom") : null;
    const docks = [...document.querySelectorAll(".glass-dock")].filter(visible).map((e) => e.getBoundingClientRect());

    const V = {
        l: gutter,
        t: topBand,
        r: innerWidth - gutter - (side === "right" ? innerWidth - sheet.left : 0),
        // The transport band, plus the resting sheet's own size (the sheet
        // sits on the band's inset; the band's dock gap stays clear above it).
        b: innerHeight - transportBand - (side === "bottom" ? sheet.height : 0),
    };
    const subj = document.querySelector(subjectSel) ?? null;
    const s = subj ? subj.getBoundingClientRect() : null;
    // The cube's painted extent is its faces (the 3D faces overhang .graph).
    const faces = [...document.querySelectorAll(".cube-side")].filter(visible).map((e) => e.getBoundingClientRect());
    const paint = faces.length
        ? faces.reduce(
              (u, b) => ({ l: Math.min(u.l, b.left), t: Math.min(u.t, b.top), r: Math.max(u.r, b.right), b: Math.max(u.b, b.bottom) }),
              { l: Infinity, t: Infinity, r: -Infinity, b: -Infinity },
          )
        : s && { l: s.left, t: s.top, r: s.right, b: s.bottom };
    const inter = (a, b) =>
        a && b ? Math.max(0, Math.min(a.r, b.right) - Math.max(a.l, b.left)) * Math.max(0, Math.min(a.b, b.bottom) - Math.max(a.t, b.top)) : 0;
    const gap = (a, b) =>
        a && b
            ? Math.max(b.left - a.r, a.l - b.right, b.top - a.b, a.t - b.bottom)
            : null;
    const cell = document.querySelector(".stage-cell");
    // Sheet rows (D-28): every row-level child of the first surface.
    const rows = sheetEl
        ? [...sheetEl.querySelectorAll('[data-slot="configurator-layer-trigger"], .param-row, [data-slot="labeled-field"]')]
              .filter(visible)
              .map((e) => rr(e.getBoundingClientRect()))
        : [];
    const title = sheetEl?.querySelector('[data-slot="configurator-layer-trigger"]');
    const titleText = title ? [...title.querySelectorAll("*")].find((e) => e.scrollWidth > e.clientWidth + 1) : null;
    return {
        iw: innerWidth,
        ih: innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        V,
        Vc: { x: (V.l + V.r) / 2, y: (V.t + V.b) / 2 },
        subject: rr(s),
        subjectC: s && { x: s.left + s.width / 2, y: s.top + s.height / 2 },
        paint,
        sheet: rr(sheet),
        side,
        sheetOverlap: inter(paint, sheet),
        sheetGap: gap(paint, sheet),
        dockOverlap: docks.reduce((a, d) => a + inter(paint, d), 0),
        dockGap: docks.length ? Math.min(...docks.map((d) => gap(paint, d))) : null,
        cell: rr(cell?.getBoundingClientRect()),
        cellPad: cell && getComputedStyle(cell).padding,
        sheetVars: cell && {
            block: getComputedStyle(cell).getPropertyValue("--stage-sheet-reserve-block").trim(),
            inline: getComputedStyle(cell).getPropertyValue("--stage-sheet-reserve-inline").trim(),
            lift: getComputedStyle(cell).getPropertyValue("--stage-sheet-lift").trim(),
            fit: getComputedStyle(cell).getPropertyValue("--stage-sheet-fit").trim(),
        },
        rows,
        titleTruncated: titleText ? { text: titleText.textContent.trim().slice(0, 40), cls: String(titleText.className).slice(0, 60) } : null,
    };
}

async function settle(page) {
    // Not networkidle: the served page keeps a beacon open, so it never idles.
    await page.waitForLoadState("load", { timeout: 30000 }).catch(() => {});
    await page.waitForSelector(".stage-cell", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2500);
}

async function layoutCells(browser, out) {
    for (const scheme of SCHEMES) {
        for (const vp of PHONES) {
            for (const scene of SCENES) {
                const ctx = await browser.newContext({
                    viewport: { width: vp.w, height: vp.h },
                    deviceScaleFactor: 1,
                    isMobile: true,
                    hasTouch: true,
                    colorScheme: scheme,
                });
                const page = await ctx.newPage();
                const errors = [];
                page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
                try {
                    await page.goto(url(scene), { timeout: 45000, waitUntil: "domcontentloaded" });
                    await settle(page);
                    if (scene === "cube") await page.keyboard.press("Escape");
                    await page.waitForTimeout(400);
                    const peek = await page.evaluate(readLayout, SUBJECT[scene]);
                    const tag = `${vp.w}x${vp.h}-${scheme}-${scene}`;
                    if (SHOTS) await page.screenshot({ path: join(SHOTS, `${tag}-peek.png`) });
                    let open = null;
                    if (peek.sheet && peek.side === "bottom") {
                        const trigger = page.locator('[data-slot="sheet-content"] [data-slot="configurator-layer-trigger"]').first();
                        if (await trigger.count()) {
                            await trigger.click({ timeout: 3000 }).catch(() => {});
                            await page.waitForTimeout(1200);
                            open = await page.evaluate(readLayout, SUBJECT[scene]);
                            if (open.sheet) {
                                // The region above the OPENED sheet, keeping the
                                // same dock gap V keeps above the resting one.
                                const gapAbove = peek.sheet ? peek.sheet.t - peek.V.b : 0;
                                open.above = { t: open.V.t, b: open.sheet.t - gapAbove };
                                open.aboveC = (open.above.t + open.above.b) / 2;
                            }
                            if (SHOTS) await page.screenshot({ path: join(SHOTS, `${tag}-open.png`) });
                        }
                    }
                    out.push({ cell: tag, scene, vp: `${vp.w}x${vp.h}`, scheme, errors, peek, open });
                } catch (e) {
                    out.push({ cell: `${vp.w}x${vp.h}-${scheme}-${scene}`, err: String(e).slice(0, 200), errors });
                } finally {
                    await ctx.close();
                }
            }
        }
    }
    for (const vp of DESKTOPS) {
        for (const scene of ["home", "cube", "square", "easing"]) {
            const ctx = await browser.newContext({
                viewport: { width: vp.w, height: vp.h },
                deviceScaleFactor: vp.dpr,
                colorScheme: "light",
            });
            const page = await ctx.newPage();
            try {
                await page.goto(url(scene), { timeout: 45000, waitUntil: "domcontentloaded" });
                await settle(page);
                if (scene === "cube") await page.keyboard.press("Escape");
                await page.waitForTimeout(400);
                const d = await page.evaluate(readLayout, SUBJECT[scene]);
                out.push({ cell: `${vp.w}x${vp.h}@${vp.dpr}-${scene}`, scene, desktop: true, subject: d.subject, sheetVars: d.sheetVars, scrollWidth: d.scrollWidth, iw: d.iw });
            } catch (e) {
                out.push({ cell: `${vp.w}x${vp.h}-${scene}`, err: String(e).slice(0, 200) });
            } finally {
                await ctx.close();
            }
        }
    }
}

/** The OrbitalDrag container's computed matrix, and the projected centres. */
function readOrbit() {
    const c = document.querySelector(".graph > div");
    const m = new DOMMatrix(getComputedStyle(c).transform);
    const f = document.querySelector(".cube-side.front")?.getBoundingClientRect();
    const g = document.querySelector(".graph").getBoundingClientRect();
    // The die's own plane moves with the orbit's translate (.graph does not).
    const k = document.querySelector(".cube").getBoundingClientRect();
    return {
        m: [m.m11, m.m12, m.m13, m.m21, m.m22, m.m23, m.m31, m.m32, m.m33, m.m41, m.m42, m.m43],
        front: f && { x: f.left + f.width / 2, y: f.top + f.height / 2 },
        centre: { x: g.left + g.width / 2, y: g.top + g.height / 2 },
        die: { x: k.left + k.width / 2, y: k.top + k.height / 2 },
        transform: c.style.transform,
    };
}

async function orbitCells(browser, out) {
    for (const vp of [{ w: 390, h: 844, touch: true }, { w: 1440, h: 900, touch: false }]) {
        const ctx = await browser.newContext({
            viewport: { width: vp.w, height: vp.h },
            deviceScaleFactor: 1,
            isMobile: vp.touch,
            hasTouch: vp.touch,
            reducedMotion: "reduce",
            colorScheme: "dark",
        });
        const page = await ctx.newPage();
        const cell = { cell: `orbit-${vp.w}x${vp.h}` };
        try {
            await page.goto(url("cube"), { timeout: 45000, waitUntil: "domcontentloaded" });
            await settle(page);
            await page.keyboard.press("Escape");
            await page.waitForTimeout(600);
            const cdp = await ctx.newCDPSession(page);
            const r0 = await page.evaluate(readOrbit);
            const { x: cx, y: cy } = r0.centre;
            const frame = () => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
            const mouseDrag = async (path) => {
                await page.mouse.move(path[0][0], path[0][1]);
                await page.mouse.down();
                for (const [x, y] of path.slice(1)) await page.mouse.move(x, y, { steps: 1 });
                await page.waitForTimeout(120); // a hold: no fling
                await page.mouse.up();
                await frame();
            };
            const touch = async (type, pts) =>
                cdp.send("Input.dispatchTouchEvent", {
                    type,
                    touchPoints: pts.map(([x, y], i) => ({ x, y, id: i + 1, radiusX: 1, radiusY: 1, force: 1 })),
                });
            const twoFinger = async (a0, b0, a1, b1, steps = 20) => {
                await touch("touchStart", [a0, b0]);
                for (let i = 1; i <= steps; i++) {
                    const f = i / steps;
                    const lerp = (p, q) => [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f];
                    await touch("touchMove", [lerp(a0, a1), lerp(b0, b1)]);
                }
                await page.waitForTimeout(100);
                await touch("touchEnd", []);
                await frame();
            };

            // G2.1 — a closed 4×120 px square drag returns the matrix (1e-4).
            const sq = [[cx, cy]];
            for (const [dx, dy] of [[120, 0], [120, 120], [0, 120], [0, 0]]) {
                for (let i = 1; i <= 12; i++) {
                    const p = sq[sq.length - 1];
                    sq.push([p[0] + (cx + dx - p[0]) / (13 - i), p[1] + (cy + dy - p[1]) / (13 - i)]);
                }
            }
            await mouseDrag(sq);
            const r1 = await page.evaluate(readOrbit);
            cell.closedSquareMaxDm = Math.max(...r0.m.slice(0, 9).map((v, i) => Math.abs(v - r1.m[i])));

            // G2.6 — a 40 px drag from the centre moves the front face 40 ± 6.
            const before = await page.evaluate(readOrbit);
            await mouseDrag([[cx, cy], [cx + 20, cy], [cx + 40, cy]]);
            const after = await page.evaluate(readOrbit);
            cell.faceTrack40 = after.front && before.front ? Math.hypot(after.front.x - before.front.x, after.front.y - before.front.y) : null;
            cell.faceTrackDir = after.front && before.front ? after.front.x - before.front.x : null;

            if (vp.touch) {
                const readScale = async () => {
                    const r = await page.evaluate(readOrbit);
                    const [a, b, c] = r.m;
                    return { s: Math.hypot(a, b, c), r };
                };
                // G2.3 (a) — spread 80 → 160 about a fixed centroid.
                const s0 = await readScale();
                await twoFinger([cx - 40, cy], [cx + 40, cy], [cx - 80, cy], [cx + 80, cy]);
                const s1 = await readScale();
                cell.pinchRatio = s1.s / s0.s;
                cell.pinchCentreShift = Math.hypot(s1.r.die.x - s0.r.die.x, s1.r.die.y - s0.r.die.y);
                // back to 1×
                await twoFinger([cx - 80, cy], [cx + 80, cy], [cx - 40, cy], [cx + 40, cy]);
                // G2.3 (c) — a two-finger 100 px drag pans 100 ± 1.
                const p0 = await page.evaluate(readOrbit);
                await twoFinger([cx - 30, cy - 100], [cx + 30, cy - 100], [cx - 30, cy], [cx + 30, cy]);
                const p1 = await page.evaluate(readOrbit);
                cell.pan100 = p1.die.y - p0.die.y;
                // G2.3 (b) — a 90° twist rolls 90° ± 0.5.
                const t0 = await page.evaluate(readOrbit);
                const ring = (a) => [
                    [cx - 60 * Math.cos(a), cy - 60 * Math.sin(a)],
                    [cx + 60 * Math.cos(a), cy + 60 * Math.sin(a)],
                ];
                await touch("touchStart", ring(0));
                for (let i = 1; i <= 30; i++) await touch("touchMove", ring((Math.PI / 2) * (i / 30)));
                await page.waitForTimeout(100);
                await touch("touchEnd", []);
                await frame();
                const t1 = await page.evaluate(readOrbit);
                cell.twistTransforms = [t0.transform, t1.transform];
                // The angle between the two attitudes: tr(R1·R0ᵀ) = Σ R1ᵢⱼR0ᵢⱼ.
                const nrm = (m) => Math.hypot(m[0], m[1], m[2]);
                const dotR = t0.m.slice(0, 9).reduce((a, v, i) => a + v * t1.m[i], 0) / (nrm(t0.m) * nrm(t1.m));
                cell.twistDeg = (Math.acos(Math.max(-1, Math.min(1, (dotR - 1) / 2))) * 180) / Math.PI;
                const sc = await readScale();
                cell.twistScale = sc.s;
            }
            cell.transform = (await page.evaluate(readOrbit)).transform;
        } catch (e) {
            cell.err = String(e).slice(0, 300);
        } finally {
            await ctx.close();
        }
        out.push(cell);
    }
}

const out = [];
const browser = await chromium.launch();
try {
    if (MODE === "layout" || MODE === "all") await layoutCells(browser, out);
    if (MODE === "orbit" || MODE === "all") await orbitCells(browser, out);
} finally {
    await browser.close();
}
const json = JSON.stringify({ base: BASE, at: new Date().toISOString(), out }, null, 1);
if (OUT) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, json);
}
// The gate summary.
const fails = [];
for (const c of out) {
    if (c.err) fails.push(`${c.cell}: ${c.err}`);
    if (c.peek && c.peek.subjectC) {
        const dx = c.peek.subjectC.x - c.peek.Vc.x;
        const dy = c.peek.subjectC.y - c.peek.Vc.y;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) fails.push(`M1.1 ${c.cell} PEEK centre off V by (${dx.toFixed(1)}, ${dy.toFixed(1)})`);
        if (c.peek.sheet && c.peek.sheetGap !== null && c.peek.sheetGap < 0) fails.push(`M1.2 ${c.cell} subject under the sheet by ${(-c.peek.sheetGap).toFixed(1)}`);
        if (c.peek.sheetOverlap > 0) fails.push(`M1.2 ${c.cell} subject∩sheet ${c.peek.sheetOverlap.toFixed(0)} px²`);
        if (c.peek.dockOverlap > 0) fails.push(`M1.2 ${c.cell} subject∩dock ${c.peek.dockOverlap.toFixed(0)} px²`);
        if (c.peek.scrollWidth > c.peek.iw) fails.push(`M1.2 ${c.cell} scrollWidth ${c.peek.scrollWidth} > ${c.peek.iw}`);
    }
    if (c.open && c.open.subjectC && c.open.aboveC) {
        const dy = c.open.subjectC.y - c.open.aboveC;
        if (Math.abs(dy) > 4) fails.push(`M1.1 ${c.cell} OPEN centre off the region above the sheet by ${dy.toFixed(1)}`);
        if (c.open.sheetOverlap > 0) fails.push(`M1.2 ${c.cell} OPEN subject∩sheet ${c.open.sheetOverlap.toFixed(0)} px²`);
    }
    if (c.closedSquareMaxDm !== undefined && !(c.closedSquareMaxDm < 1e-4)) fails.push(`G2.1 ${c.cell} closed square Δm ${c.closedSquareMaxDm}`);
    if (c.faceTrack40 !== undefined && !(Math.abs(c.faceTrack40 - 40) <= 6)) fails.push(`G2.6 ${c.cell} front face moved ${c.faceTrack40}`);
    if (c.pinchRatio !== undefined && !(Math.abs(c.pinchRatio - 2) <= 0.01)) fails.push(`G2.3a ${c.cell} pinch ratio ${c.pinchRatio}`);
    if (c.pan100 !== undefined && !(Math.abs(c.pan100 - 100) <= 1)) fails.push(`G2.3c ${c.cell} pan ${c.pan100}`);
    if (c.twistDeg !== undefined && !(Math.abs(c.twistDeg - 90) <= 0.5)) fails.push(`G2.3b ${c.cell} twist ${c.twistDeg}°`);
    if (c.twistScale !== undefined && !(Math.abs(c.twistScale - 1) <= 0.005)) fails.push(`G2.3b ${c.cell} twist scale ${c.twistScale}`);
}
console.log(JSON.stringify({ cells: out.length, fails }, null, 1));
