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
 *
 * K-D3 (value.js X realization, KF-M-O1 host half): `--engine webkit` runs the
 * orbit cells in Playwright's WebKit (one browser per run; launch the run with
 * `guarded --exclusive webkit`). WebKit has no CDP, so `--input synthetic` (the
 * default under webkit) drives the two fingers as script-dispatched Pointer
 * Events (pointerType "touch", the same paths), and the Chromium leg can be run
 * with the same input as the comparator. Two single-source legs ride the touch
 * cell: (b) `gesturestart`/`gesturechange` dispatched while two fingers are
 * down write nothing to the orbit; (c) `touchmove` alone writes nothing.
 *
 * kf-cube (value.js X §0hz): `--mode assay` reads gestures → outcomes for the
 * cube's scroll and orbit — the grab map over V, the seam at R ± 2, wheel and
 * swipe beside the die, notch span and stacking, ctrl-wheel coalescing, CDP
 * pinch 2× / 0.5× with its Δy trace, pan ×3 against V, a timestamped CDP
 * flick at 60/120 Hz, double-tap on/off the die, touch at 390, drag and
 * scroll-port frame times (die playing vs at rest), and the embed: bare at
 * rest plus a loopback host page (vertical swipe and plain wheel scroll the
 * host; a horizontal drag turns the die). Extended here, not forked.
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
const ENGINE = arg("engine", "chromium");
const INPUT = arg("input", ENGINE === "chromium" ? "cdp" : "synthetic");
const PW = process.env.PLAYWRIGHT_MODULE ?? "/Users/mkbabb/Programming/value.js/node_modules/playwright/index.mjs";
const engines = await import(PW);
const chromium = engines[ENGINE];
if (!chromium) throw new Error(`unknown --engine ${ENGINE}`);

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
        // The orbit's pan on screen: translate3d(G⁻¹·t) carried back by G
        // (G = rotate3d(-1, 1, 0, 30deg), graphAttitude.ts).
        screenT: (() => {
            const m = /translate3d\(([-\d.e]+)px, ([-\d.e]+)px, ([-\d.e]+)px\)/.exec(c.style.transform);
            if (!m) return null;
            const v = [+m[1], +m[2], +m[3]];
            const k2 = [-Math.SQRT1_2, Math.SQRT1_2, 0];
            const a = Math.PI / 6, co = Math.cos(a), si = Math.sin(a);
            const d = k2[0] * v[0] + k2[1] * v[1] + k2[2] * v[2];
            const cr = [k2[1] * v[2] - k2[2] * v[1], k2[2] * v[0] - k2[0] * v[2], k2[0] * v[1] - k2[1] * v[0]];
            return [0, 1, 2].map((i) => v[i] * co + cr[i] * si + k2[i] * d * (1 - co));
        })(),
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
            const cdp = INPUT === "cdp" ? await ctx.newCDPSession(page) : null;
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
            // The synthetic path: one PointerEvent per finger per step, pointerdown
            // on the element under the finger (the orbit container), move/up on
            // the document (where the gesture's own listeners are).
            let down = [];
            const synth = (type, pts) =>
                page.evaluate(
                    ({ type, pts, down }) => {
                        const fire = (name, x, y, id, target) =>
                            target.dispatchEvent(
                                new PointerEvent(name, {
                                    bubbles: true, cancelable: true, composed: true, pointerId: 100 + id,
                                    pointerType: "touch", isPrimary: id === 0, clientX: x, clientY: y,
                                    buttons: name === "pointerup" ? 0 : 1, button: name === "pointermove" ? -1 : 0,
                                    width: 2, height: 2, pressure: name === "pointerup" ? 0 : 0.5,
                                }),
                            );
                        if (type === "touchStart") pts.forEach(([x, y], i) => fire("pointerdown", x, y, i, document.elementFromPoint(x, y) ?? document.body));
                        else if (type === "touchMove") pts.forEach(([x, y], i) => fire("pointermove", x, y, i, document));
                        else down.forEach(([x, y], i) => fire("pointerup", x, y, i, document));
                    },
                    { type, pts, down },
                );
            const touch = async (type, pts) => {
                if (!cdp) {
                    await synth(type, pts);
                    down = type === "touchEnd" ? [] : pts;
                    return;
                }
                return cdp.send("Input.dispatchTouchEvent", {
                    type,
                    touchPoints: pts.map(([x, y], i) => ({ x, y, id: i + 1, radiusX: 1, radiusY: 1, force: 1 })),
                });
            };
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
            // The arcball's own rate: with R = 2h a drag of d px turns the die by
            // 2·asin(d/2h) ≈ d/h, so the surface under the finger (depth h at a
            // frontal face) moves d. The face-centre reading above is that
            // motion × the face's own cos β at the pose it rests in (the
            // matrix channel's authored pose tilts every face off the view
            // axis), so the RATE is the pose-independent gate.
            const nrm = (m) => Math.hypot(m[0], m[1], m[2]);
            const dotR = before.m.slice(0, 9).reduce((a, v, i) => a + v * after.m[i], 0) / (nrm(before.m) * nrm(after.m));
            const theta = Math.acos(Math.max(-1, Math.min(1, (dotR - 1) / 2)));
            const half = await page.evaluate(() => document.querySelector(".cube").offsetWidth / 2);
            cell.faceTrackRate = (theta * half) / 40; // 1 = the surface moves 1:1

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
                // Both fingers land ON the die (a press beside it is the stage's, not the orbit's).
                await twoFinger([cx - 30, cy - 50], [cx + 30, cy - 50], [cx - 30, cy + 50], [cx + 30, cy + 50]);
                const p1 = await page.evaluate(readOrbit);
                cell.pan100 = p1.screenT[1] - p0.screenT[1];
                cell.panScreenZ = p1.screenT[2];
                // G2.3 (b) — a 90° twist rolls 90° ± 0.5.
                const t0 = await page.evaluate(readOrbit);
                // About the die where the pan left it.
                const ox = t0.die.x;
                const oy = t0.die.y;
                const ring = (a) => [
                    [ox - 50 * Math.cos(a), oy - 50 * Math.sin(a)],
                    [ox + 50 * Math.cos(a), oy + 50 * Math.sin(a)],
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

                // K-D3 (b) — ONE SOURCE: Safari's gesture* while two fingers are
                // down must write nothing (the Pointer Events similarity owns it).
                const g0 = (await page.evaluate(readOrbit)).transform;
                const gx = (await page.evaluate(readOrbit)).die;
                await touch("touchStart", [[gx.x - 40, gx.y], [gx.x + 40, gx.y]]);
                await page.evaluate(() => {
                    const el = document.querySelector(".graph") ?? document.body;
                    const G = (name, scale, rotation) => {
                        const e = new Event(name, { bubbles: true, cancelable: true });
                        Object.assign(e, { scale, rotation });
                        return e;
                    };
                    el.dispatchEvent(G("gesturestart", 1, 0));
                    for (let i = 1; i <= 10; i++) window.dispatchEvent(G("gesturechange", 1 + i * 0.2, i * 9));
                    window.dispatchEvent(G("gestureend", 3, 90));
                });
                await frame();
                cell.gestureWhileDownWrites = (await page.evaluate(readOrbit)).transform !== g0;
                await touch("touchEnd", []);
                await frame();
                // K-D3 (c) — touchmove alone (no pointer stream) writes nothing.
                const h0 = (await page.evaluate(readOrbit)).transform;
                await page.evaluate(({ x, y }) => {
                    const el = document.elementFromPoint(x, y) ?? document.body;
                    const T = (name, dx) => {
                        let e;
                        try {
                            const t = new Touch({ identifier: 7, target: el, clientX: x + dx, clientY: y });
                            e = new TouchEvent(name, { bubbles: true, cancelable: true, touches: name === "touchend" ? [] : [t], changedTouches: [t] });
                        } catch {
                            e = new Event(name, { bubbles: true, cancelable: true });
                        }
                        el.dispatchEvent(e);
                    };
                    T("touchstart", 0);
                    for (let i = 1; i <= 10; i++) T("touchmove", i * 10);
                    T("touchend", 100);
                }, gx);
                await frame();
                cell.touchmoveAloneWrites = (await page.evaluate(readOrbit)).transform !== h0;
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

// ── --mode assay (kf-cube, value.js X §0hz; owner 2026-11-05: "keyframes cube
// scrolling and orbital dragging needs debugging and assay") ─────────────────
// Gestures → measured outcomes on the cube page and the embed slice. Readings
// only; the gate lines below the summary name each unit's bar.
const G_AXIS = [-Math.SQRT1_2, Math.SQRT1_2, 0];
const G_Q = (() => { const h = Math.PI / 12; return [G_AXIS[0] * Math.sin(h), G_AXIS[1] * Math.sin(h), 0, Math.cos(h)]; })();
const qMul = (a, b) => [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] + a[1] * b[3] + a[2] * b[0] - a[0] * b[2],
    a[3] * b[2] + a[2] * b[3] + a[0] * b[1] - a[1] * b[0],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
];
const qInv = (q) => [-q[0], -q[1], -q[2], q[3]];
const qOf = (tf) => {
    const m = /rotate3d\(([-\d.e]+), ([-\d.e]+), ([-\d.e]+), ([-\d.e]+)deg\)/.exec(tf ?? "");
    if (!m) return [0, 0, 0, 1];
    const n = Math.hypot(+m[1], +m[2], +m[3]) || 1;
    const h = (+m[4] * Math.PI) / 360;
    return [(+m[1] / n) * Math.sin(h), (+m[2] / n) * Math.sin(h), (+m[3] / n) * Math.sin(h), Math.cos(h)];
};
const sOf = (tf) => +(/scale3d\(([-\d.e]+),/.exec(tf ?? "")?.[1] ?? 1);
/** The screen-frame rotation from tf0 to tf1: { deg, rollDeg } (G·d·G⁻¹). */
const turn = (tf0, tf1) => {
    const d = qMul(qOf(tf1), qInv(qOf(tf0)));
    const s = qMul(qMul(G_Q, d), qInv(G_Q));
    const w = Math.abs(s[3]) > 1 ? 1 : s[3];
    const sg = w < 0 ? -1 : 1;
    const v = Math.hypot(s[0], s[1], s[2]);
    const ang = 2 * Math.atan2(v, Math.abs(w));
    return { deg: (ang * 180) / Math.PI, rollDeg: v > 0 ? (sg * (s[2] / v) * ang * 180) / Math.PI : 0 };
};
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };

/** One page read: the orbit container's transform, the die and V. */
function readAssay() {
    const c = document.querySelector(".graph > div");
    const k = document.querySelector(".cube")?.getBoundingClientRect();
    const cell = document.querySelector(".stage-cell");
    let V = null;
    if (cell) {
        const r = cell.getBoundingClientRect();
        const cs = getComputedStyle(cell);
        V = { l: r.left + parseFloat(cs.paddingLeft), t: r.top + parseFloat(cs.paddingTop), r: r.right - parseFloat(cs.paddingRight), b: r.bottom - parseFloat(cs.paddingBottom) };
    }
    const g = document.querySelector(".graph")?.getBoundingClientRect();
    return {
        tf: c?.style.transform ?? "",
        die: k && { x: k.left + k.width / 2, y: k.top + k.height / 2, w: k.width },
        rest: g && { x: g.left + g.width / 2, y: g.top + g.height / 2 },
        side: document.querySelector(".cube")?.offsetWidth ?? 0,
        V,
        scrollY: document.scrollingElement?.scrollTop ?? 0,
        rolling: !!document.querySelector(".idle-hover--rolling"),
        numerals: document.querySelectorAll(".face-numeral").length,
        axisLines: document.querySelectorAll(".axis-line").length,
    };
}

/** rAF-sampled transform trace for `ms`: per-frame screen deg steps. */
const traceFrames = (page, ms) =>
    page.evaluate((ms) => new Promise((done) => {
        const c = document.querySelector(".graph > div");
        const out = [];
        let last = c.style.transform;
        const t0 = performance.now();
        const f = (t) => {
            out.push({ t: t - t0, tf: c.style.transform });
            if (t - t0 < ms) requestAnimationFrame(f); else done({ start: last, out });
        };
        requestAnimationFrame(f);
    }), ms);

async function assayCells(browser, out) {
    const isCr = ENGINE === "chromium";
    const open = async (vp, { touch = false, prm = true, path = "cube" } = {}) => {
        const ctx = await browser.newContext({
            viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1,
            isMobile: touch && isCr, hasTouch: touch, reducedMotion: prm ? "reduce" : "no-preference", colorScheme: "dark",
        });
        const page = await ctx.newPage();
        await page.goto(path.startsWith("http") ? path : url(path), { timeout: 45000, waitUntil: "domcontentloaded" });
        await settle(page);
        if (path === "cube") await page.keyboard.press("Escape");
        await page.waitForTimeout(600);
        return { ctx, page, cdp: isCr ? await ctx.newCDPSession(page) : null };
    };
    const frame = (page, n = 2) => page.evaluate((n) => new Promise((r) => { let i = 0; const f = () => (++i >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
    const read = (page) => page.evaluate(readAssay);
    const held = async (page, path, shift = false) => {
        if (shift) await page.keyboard.down("Shift");
        await page.mouse.move(path[0][0], path[0][1]);
        await page.mouse.down();
        for (const [x, y] of path.slice(1)) await page.mouse.move(x, y, { steps: 1 });
        await page.waitForTimeout(120);
        await page.mouse.up();
        if (shift) await page.keyboard.up("Shift");
        await frame(page);
    };
    const run = async (name, vp, opts, fn) => {
        let o;
        try {
            o = await open(vp, opts);
            out.push({ cell: `assay-${name}`, ...(await fn(o)) });
        } catch (e) {
            out.push({ cell: `assay-${name}`, err: String(e).slice(0, 300) });
        } finally {
            await o?.ctx.close();
        }
    };
    const D = { w: 1440, h: 900 };
    const P = { w: 390, h: 844 };

    // U3 — the grab map: a 9×9 grid over V, a 12 px held drag at each point;
    // a point counts when the die turned.
    for (const [vp, touch] of [[D, false], [P, true]]) {
        await run(`grab-${vp.w}`, vp, { touch: false }, async ({ page }) => {
            const r = await read(page);
            let hit = 0;
            for (let i = 1; i <= 9; i++) for (let j = 1; j <= 9; j++) {
                const x = r.V.l + ((r.V.r - r.V.l) * i) / 10;
                const y = r.V.t + ((r.V.b - r.V.t) * j) / 10;
                const a = (await read(page)).tf;
                await held(page, [[x, y], [x + 6, y], [x + 12, y]]);
                if (turn(a, (await read(page)).tf).deg > 0.5) hit++;
            }
            return { grabHit: hit, of: 81, touchEmu: touch };
        });
    }

    // U3 — the seam (1440): a 4 px move at R − 2 and R + 2, tangential and radial.
    await run("seam-1440", D, {}, async ({ page }) => {
        const r = await read(page);
        const R = r.side; // R = 2h = the die's side at s = 1 (inside the V cap at 1440)
        const res = {};
        for (const [k, dr, dir] of [["inT", -2, "t"], ["outT", 2, "t"], ["inR", -2, "r"], ["outR", 2, "r"]]) {
            const x = r.die.x + R + dr;
            const y = r.die.y;
            const a = (await read(page)).tf;
            const to = dir === "t" ? [x, y + 4] : [x + 4, y];
            await held(page, [[x, y], [(x + to[0]) / 2, (y + to[1]) / 2], to]);
            res[k] = turn(a, (await read(page)).tf).deg;
        }
        return { R, seamTangential: res.outT / res.inT, seamRadial: res.inR > 0 ? res.outR / res.inR : null, ...res };
    });

    // U3 — wheel and swipe beside the die; a centre grab for the gain.
    await run("offdie-1440", D, {}, async ({ page }) => {
        const r = await read(page);
        const ox = r.V.l + 30, oy = (r.V.t + r.V.b) / 2;
        const a = (await read(page)).tf;
        await held(page, [[r.die.x, r.die.y], [r.die.x, r.die.y + 10], [r.die.x, r.die.y + 20]]);
        const b = (await read(page)).tf;
        await held(page, [[ox, oy], [ox, oy + 10], [ox, oy + 20]]);
        const c = (await read(page)).tf;
        await page.mouse.move(ox, oy);
        await page.mouse.wheel(0, 20);
        await frame(page, 3);
        const d = (await read(page)).tf;
        return { centreDeg: turn(a, b).deg, offDieDeg: turn(b, c).deg, offDieGain: turn(b, c).deg / turn(a, b).deg, offDieWheelDeg: turn(c, d).deg };
    });

    // U4 — notch span (motion on): one 100 px notch, then two stacked.
    await run("notch-1440", D, { prm: false }, async ({ page }) => {
        const r = await read(page);
        // The idle bob moves the container too: pause the die's own play first.
        const notch = async (n) => {
            await page.evaluate(({ x, y, n }) => {
                const el = document.elementFromPoint(x, y);
                for (let i = 0; i < n; i++) setTimeout(() => el.dispatchEvent(new WheelEvent("wheel", { deltaY: 100, bubbles: true, cancelable: true, clientX: x, clientY: y })), i * 60);
            }, { x: r.die.x, y: r.die.y, n });
            const tr = await traceFrames(page, 1500);
            const steps = [];
            let prev = tr.start;
            for (const f of tr.out) { steps.push(turn(prev, f.tf).deg); prev = f.tf; }
            return { framesSpanned: steps.filter((s) => s > 1e-6).length, maxStepDeg: Math.max(...steps), totalDeg: turn(tr.start, tr.out.at(-1).tf).deg };
        };
        return { one: await notch(1), two: await notch(2) };
    });

    // U1 — coalesce: k ctrl-wheel events in one task (under the frame cap).
    await run("coalesce-1440", D, {}, async ({ page }) => {
        const res = {};
        for (const [k, d] of [[1, -20], [2, -10], [4, -5]]) {
            res[`k${k}`] = await page.evaluate(async ({ k, d }) => {
                const c = document.querySelector(".graph > div");
                const kb = document.querySelector(".cube").getBoundingClientRect();
                const x = kb.left + kb.width / 2, y = kb.top + kb.height / 2;
                const s = () => +(/scale3d\(([-\d.e]+),/.exec(c.style.transform)?.[1] ?? 1);
                const s0 = s();
                const el = document.elementFromPoint(x, y);
                for (let i = 0; i < k; i++) el.dispatchEvent(new WheelEvent("wheel", { deltaY: d, ctrlKey: true, bubbles: true, cancelable: true, clientX: x, clientY: y }));
                await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame);
                const s1 = s();
                for (let i = 0; i < k; i++) el.dispatchEvent(new WheelEvent("wheel", { deltaY: -d, ctrlKey: true, bubbles: true, cancelable: true, clientX: x, clientY: y }));
                await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame);
                return s1 / s0;
            }, { k, d });
        }
        return { ...res, coalesceSpread: Math.max(res.k2, res.k4, res.k1) / Math.min(res.k2, res.k4, res.k1) - 1 };
    });

    // U2 — CDP trackpad pinch 2× and 0.5×, with the per-event Δy trace.
    if (isCr) await run("pinch-1440", D, {}, async ({ page, cdp }) => {
        const r = await read(page);
        await page.evaluate(() => { window.__wl = []; addEventListener("wheel", (e) => window.__wl.push([+e.deltaY.toFixed(3), e.ctrlKey, Math.round(e.timeStamp)]), { capture: true, passive: true }); });
        const pinch = async (f) => {
            const a = (await read(page)).tf;
            await cdp.send("Input.synthesizePinchGesture", { x: r.die.x, y: r.die.y, scaleFactor: f, gestureSourceType: "mouse" });
            await frame(page, 4);
            return sOf((await read(page)).tf) / sOf(a);
        };
        const up = await pinch(2);
        const trace = await page.evaluate(() => window.__wl.splice(0));
        const down = await pinch(0.5);
        const sumUp = trace.reduce((s, e) => s + e[0], 0);
        return { pinch2: up, pinchHalf: down, events: trace.length, sumDy: sumUp, lnScaleOfSum: -sumUp / 100, maxAbsDy: Math.max(...trace.map((e) => Math.abs(e[0]))), vv: await page.evaluate(() => visualViewport.scale) };
    });

    // U5 — three +250 px shift-drag pans; then a 20 px drag at the panned centre.
    await run("pan-1440", D, {}, async ({ page }) => {
        const pans = [];
        for (let i = 0; i < 3; i++) {
            const r = await read(page);
            await held(page, [[r.die.x, r.die.y], [r.die.x + 125, r.die.y], [r.die.x + 250, r.die.y]], true);
            const q = await read(page);
            pans.push({ dieX: q.die.x, Vr: q.V.r, past: q.die.x - q.V.r });
        }
        const r = await read(page);
        await held(page, [[r.die.x, r.die.y], [r.die.x + 10, r.die.y], [r.die.x + 20, r.die.y]]);
        const t = turn(r.tf, (await read(page)).tf);
        return { pans, maxPast: Math.max(...pans.map((p) => p.past)), dragDeg: t.deg, rollDeg: Math.abs(t.rollDeg) };
    });

    // U7 — the coast: a timestamped CDP flick, 120 px in 100/120/160 ms, at 60 and 120 Hz.
    if (isCr) await run("coast-1440", D, { prm: false }, async ({ page, cdp }) => {
        const res = [];
        for (const hz of [60, 120]) for (const ms of [100, 120, 160]) {
            const r = await read(page);
            const n = Math.round((ms / 1000) * hz);
            const T = Date.now() / 1000;
            const x0 = r.die.x - 60, y = r.die.y;
            const m = (type, x, t, extra = {}) => cdp.send("Input.dispatchMouseEvent", { type, x, y, timestamp: T + t, button: "left", buttons: type === "mouseReleased" ? 0 : 1, clickCount: 1, ...extra });
            await m("mousePressed", x0, 0);
            for (let i = 1; i <= n; i++) await m("mouseMoved", x0 + (120 * i) / n, (ms / 1000) * (i / n));
            const a = (await read(page)).tf;
            await m("mouseReleased", x0 + 120, ms / 1000 + 0.002);
            await page.waitForTimeout(900);
            const b = (await read(page)).tf;
            const g = turn(r.tf, a).deg, c = turn(a, b).deg;
            res.push({ hz, ms, gestureDeg: g, coastDeg: c, ratio: c / g });
        }
        return { coast: res };
    });

    // U3 — double-tap on and off the die.
    // Motion on: under reduced motion the roll snaps and is over before a read.
    await run("dbltap-1440", D, { prm: false }, async ({ page }) => {
        const r = await read(page);
        const tap2 = async (x, y) => { for (let i = 0; i < 2; i++) { await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.up(); } await frame(page, 1); return (await read(page)).rolling; };
        const off = await tap2(r.V.l + 30, (r.V.t + r.V.b) / 2);
        await page.waitForTimeout(1500);
        const on = await tap2(r.die.x, r.die.y);
        return { offDieRolls: off ? 1 : 0, onDieRolls: on ? 1 : 0 };
    });

    // U3/U6 — touch at 390 (CDP): on/off the die, horizontal and vertical.
    if (isCr) await run("touch-390", P, { touch: true }, async ({ page, cdp }) => {
        const swipe = async (x, y, dx, dy) => {
            await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
            for (let i = 1; i <= 10; i++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + (dx * i) / 10, y: y + (dy * i) / 10 }] });
            await page.waitForTimeout(100);
            await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
            await frame(page);
        };
        const r = await read(page);
        const res = {};
        for (const [k, x, y, dx, dy] of [["onH", r.die.x, r.die.y, 60, 0], ["onV", r.die.x, r.die.y, 0, -60], ["offH", r.V.l + 20, r.die.y, 60, 0], ["offV", r.V.l + 20, r.die.y, 0, -60]]) {
            const a = await read(page);
            await swipe(x, y, dx, dy);
            const b = await read(page);
            res[k] = { deg: turn(a.tf, b.tf).deg, scrollDy: b.scrollY - a.scrollY };
        }
        return res;
    });

    // Perf — drag frame time during a 1 s drag.
    await run("dragframe-1440", D, {}, async ({ page }) => {
        const r = await read(page);
        await page.evaluate(() => { window.__dts = []; let p = performance.now(); const f = (t) => { window.__dts.push(t - p); p = t; if (window.__dts.length < 400) requestAnimationFrame(f); }; requestAnimationFrame(f); });
        await page.mouse.move(r.die.x, r.die.y);
        await page.mouse.down();
        for (let i = 0; i < 60; i++) { await page.mouse.move(r.die.x + 120 * Math.sin(i / 6), r.die.y + 80 * Math.cos(i / 9)); await page.waitForTimeout(16); }
        await page.mouse.up();
        const d = (await page.evaluate(() => window.__dts)).slice(2);
        return { dragP50: pct(d, 0.5), dragP95: pct(d, 0.95) };
    });

    // U0 — the controls' scroll ports on the cube page, die playing (motion on)
    // vs at rest (reduced motion): wheel at 1440, CDP touch at 390.
    for (const [vp, touch] of [[D, false], [P, true]]) for (const prm of [false, true]) {
        if (touch && !isCr) continue;
        await run(`scroll-${vp.w}-${prm ? "rest" : "playing"}`, vp, { touch, prm }, async ({ page, cdp }) => {
            // Open the sheet's layer at the phone so its body is a scroll port.
            if (touch) {
                const trig = page.locator('[data-slot="sheet-content"] [data-slot="configurator-layer-trigger"]').first();
                if (await trig.count()) { await trig.click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(1200); }
            }
            const ports = await page.evaluate(() => [...document.querySelectorAll("*")].filter((e) => {
                const cs = getComputedStyle(e);
                return /(auto|scroll)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 4 && e.clientHeight > 40;
            }).map((e) => { const r = e.getBoundingClientRect(); e.dataset.assayPort = "1"; return { x: r.left + r.width / 2, y: r.top + Math.min(r.height / 2, 60), h: e.clientHeight, sh: e.scrollHeight, cls: String(e.className).slice(0, 60) }; }));
            if (!ports.length) return { ports: 0 };
            const p = ports[0];
            await page.evaluate(() => { window.__dts = []; let pr = performance.now(); const f = (t) => { window.__dts.push(t - pr); pr = t; if (window.__dts.length < 240) requestAnimationFrame(f); }; requestAnimationFrame(f); });
            const st0 = await page.evaluate(() => document.querySelector("[data-assay-port]").scrollTop);
            if (touch) {
                for (let k = 0; k < 3; k++) {
                    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: p.x, y: p.y + 30 }] });
                    for (let i = 1; i <= 10; i++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: p.x, y: p.y + 30 - 4 * i }] });
                    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
                }
            } else {
                await page.mouse.move(p.x, p.y);
                for (let i = 0; i < 20; i++) { await page.mouse.wheel(0, 30); await page.waitForTimeout(16); }
            }
            await page.waitForTimeout(500);
            const st1 = await page.evaluate(() => document.querySelector("[data-assay-port]").scrollTop);
            const d = (await page.evaluate(() => window.__dts)).slice(2);
            return { ports: ports.length, port: p, scrolled: st1 - st0, scrollP50: pct(d, 0.5), scrollP95: pct(d, 0.95) };
        });
    }

    // U6 — the embed: bare at rest, and a loopback host page that frames it.
    const embedUrl = `${BASE.replace(/\/?$/, "/")}embed/#/cube`;
    await run("embed-rest", { w: 600, h: 600 }, { path: embedUrl }, async ({ page }) => {
        await page.waitForSelector(".graph > div", { timeout: 15000 });
        const r = await read(page);
        return { numerals: r.numerals, axisLines: r.axisLines };
    });
    const { createServer } = await import("node:http");
    const host = createServer((_, res) => {
        res.writeHead(200, { "content-type": "text/html" });
        res.end(`<!doctype html><meta name=viewport content="width=device-width"><body style="margin:0"><div style="height:300px"></div><iframe id=f src="${embedUrl}" style="display:block;width:100%;aspect-ratio:1;border:0"></iframe><div style="height:3000px"></div></body>`);
    });
    await new Promise((r) => host.listen(0, "127.0.0.1", r));
    const hostUrl = `http://127.0.0.1:${host.address().port}/`;
    try {
        for (const [vp, touch] of [[P, true], [D, false]]) {
            if (touch && !isCr) continue;
            await run(`embedhost-${vp.w}`, vp, { touch, path: hostUrl }, async ({ page, cdp }) => {
                const fr = await (await page.waitForSelector("#f")).contentFrame();
                await fr.waitForSelector(".graph > div", { timeout: 20000 });
                await page.waitForTimeout(800);
                await page.evaluate(() => scrollTo(0, 200));
                await page.waitForTimeout(200);
                const box = await page.evaluate(() => { const r = document.getElementById("f").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
                const sy = () => page.evaluate(() => scrollY);
                const tf = async () => (await fr.evaluate(readAssay)).tf;
                const res = {};
                if (touch) {
                    const swipe = async (dx, dy) => {
                        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x, y: box.y }] });
                        for (let i = 1; i <= 10; i++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + (dx * i) / 10, y: box.y + (dy * i) / 10 }] });
                        await page.waitForTimeout(100);
                        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
                        await page.waitForTimeout(400);
                    };
                    // The control: the same swipe over the host's own content
                    // (the browser's own touch slop is in both).
                    let a = await sy(), q = await tf();
                    const at = box.y;
                    box.y = 700;
                    await swipe(0, -120);
                    const control = (await sy()) - a;
                    box.y = at - control;
                    a = await sy();
                    await swipe(0, -120);
                    res.vertical = { hostDy: (await sy()) - a, dieDeg: turn(q, await tf()).deg, expect: control };
                    a = await sy(); q = await tf();
                    await swipe(-120, 0);
                    res.horizontal = { hostDy: (await sy()) - a, dieDeg: turn(q, await tf()).deg };
                } else {
                    const a = await sy(), q = await tf();
                    await page.mouse.move(box.x, box.y);
                    await page.mouse.wheel(0, 200);
                    await page.waitForTimeout(600);
                    res.wheel = { hostDy: (await sy()) - a, dieDeg: turn(q, await tf()).deg, expect: 200 };
                    const b = await sy(), q2 = await tf();
                    await held(page, [[box.x, box.y], [box.x + 40, box.y], [box.x + 80, box.y]]);
                    res.drag = { hostDy: (await sy()) - b, dieDeg: turn(q2, await tf()).deg };
                }
                return res;
            });
        }
    } finally {
        await new Promise((r) => host.close(r));
    }
}

const out = [];
const browser = await chromium.launch();
try {
    if (MODE === "layout" || MODE === "all") await layoutCells(browser, out);
    if (MODE === "orbit" || MODE === "all") await orbitCells(browser, out);
    if (MODE === "assay") await assayCells(browser, out);
} finally {
    await browser.close();
}
const json = JSON.stringify({ base: BASE, engine: ENGINE, input: INPUT, at: new Date().toISOString(), out }, null, 1);
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
    if (c.faceTrackRate !== undefined && !(Math.abs(c.faceTrackRate - 1) <= 0.15)) fails.push(`G2.6 ${c.cell} surface rate ${c.faceTrackRate} (face centre moved ${c.faceTrack40})`);
    if (c.pinchRatio !== undefined && !(Math.abs(c.pinchRatio - 2) <= 0.01)) fails.push(`G2.3a ${c.cell} pinch ratio ${c.pinchRatio}`);
    if (c.pan100 !== undefined && !(Math.abs(c.pan100 - 100) <= 1)) fails.push(`G2.3c ${c.cell} pan ${c.pan100}`);
    if (c.twistDeg !== undefined && !(Math.abs(c.twistDeg - 90) <= 0.5)) fails.push(`G2.3b ${c.cell} twist ${c.twistDeg}°`);
    if (c.twistScale !== undefined && !(Math.abs(c.twistScale - 1) <= 0.005)) fails.push(`G2.3b ${c.cell} twist scale ${c.twistScale}`);
    if (c.gestureWhileDownWrites) fails.push(`K-D3b ${c.cell} gesture* with fingers down wrote the orbit`);
    if (c.touchmoveAloneWrites) fails.push(`K-D3c ${c.cell} touchmove alone wrote the orbit`);
    // kf-cube assay gates.
    if (c.grabHit !== undefined && c.grabHit !== 81) fails.push(`U3 ${c.cell} grab map ${c.grabHit}/81 inside V`);
    if (c.seamTangential !== undefined && !(Math.abs(c.seamTangential - 1) <= 0.05)) fails.push(`U3 ${c.cell} seam tangential ${c.seamTangential}`);
    if (c.offDieGain !== undefined && !(Math.abs(c.offDieGain - 1) <= 0.05)) fails.push(`U3 ${c.cell} off-die gain ${c.offDieGain}`);
    if (c.offDieRolls !== undefined && (c.offDieRolls !== 0 || c.onDieRolls !== 1)) fails.push(`U3 ${c.cell} double-tap off ${c.offDieRolls} on ${c.onDieRolls}`);
    if (c.one && !(c.one.framesSpanned >= 12 && c.one.maxStepDeg <= 6)) fails.push(`U4 ${c.cell} notch ${c.one.framesSpanned} frames, max ${c.one.maxStepDeg}°`);
    if (c.coalesceSpread !== undefined && !(c.coalesceSpread <= 0.005)) fails.push(`U1 ${c.cell} coalesce spread ${c.coalesceSpread}`);
    if (c.pinch2 !== undefined && !(Math.abs(c.pinch2 - 2) <= 0.03 && Math.abs(c.pinchHalf - 0.5) <= 0.01)) fails.push(`U2 ${c.cell} pinch ${c.pinch2} / ${c.pinchHalf}`);
    if (c.maxPast !== undefined && !(c.maxPast <= 1 && c.rollDeg < 0.5)) fails.push(`U5 ${c.cell} past V ${c.maxPast}, roll ${c.rollDeg}°`);
    if (c.coast) for (const k of c.coast) if (!(k.ratio >= 0.3 && k.ratio <= 0.6)) fails.push(`U7 ${c.cell} ${k.hz} Hz ${k.ms} ms coast ratio ${k.ratio}`);
    if (c.scrollP95 !== undefined && !(c.scrollP95 <= 16.7)) fails.push(`U0 ${c.cell} scroll p95 ${c.scrollP95}`);
    if (c.numerals !== undefined && (c.numerals !== 0 || c.axisLines !== 0)) fails.push(`embed ${c.cell} at rest: ${c.numerals} numerals, ${c.axisLines} axis lines`);
    if (c.vertical && !(Math.abs(c.vertical.hostDy - c.vertical.expect) <= 2 && c.vertical.dieDeg < 0.5)) fails.push(`U6 ${c.cell} vertical swipe host Δ ${c.vertical.hostDy} (control ${c.vertical.expect}), die ${c.vertical.dieDeg}°`);
    if (c.horizontal && !(c.horizontal.dieDeg > 20 && c.horizontal.hostDy === 0)) fails.push(`U6 ${c.cell} horizontal ${c.horizontal.dieDeg}° host Δ ${c.horizontal.hostDy}`);
    if (c.wheel && !(Math.abs(c.wheel.hostDy - c.wheel.expect) <= 2 && c.wheel.dieDeg < 0.5)) fails.push(`U6 ${c.cell} wheel host Δ ${c.wheel.hostDy}, die ${c.wheel.dieDeg}°`);
    if (c.drag && !(c.drag.dieDeg > 5 && c.drag.hostDy === 0)) fails.push(`U6 ${c.cell} drag ${c.drag.dieDeg}°, host Δ ${c.drag.hostDy}`);
}
console.log(JSON.stringify({ cells: out.length, fails }, null, 1));
