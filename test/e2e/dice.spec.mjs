/**
 * The dice, end to end, over the built embed slice.
 *
 * "die": `faces=pips` marks the cube as a die: 21 pips, and its faces close
 * over a core, so no ground shows through the die where its rounded faces
 * meet, at rest or anywhere in a turn, in either theme.
 *
 * Local: serves dist/gh-pages (build it first: npm run gh-pages).
 * KF_GESTURE_BASE=https://keyframes.babb.dev runs it against a deploy.
 */
import { test, expect, chromium } from "@playwright/test";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import { serveDist } from "../../scripts/lib/demo-driver.mjs";
import { HOST_SLICE, sleep } from "./cube-hand.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DIST = path.join(REPO, "dist", "gh-pages");
const REMOTE = process.env.KF_GESTURE_BASE?.replace(/\/$/, "");
const GPU = ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"];

let server = null;
let base = REMOTE ?? "";
let browser = null;

test.beforeAll(async () => {
    if (!REMOTE) {
        if (!fs.existsSync(path.join(DIST, "embed", "index.html"))) {
            throw new Error("dist/gh-pages/embed is absent: run `npm run gh-pages` first");
        }
        server = await serveDist(DIST);
        base = server.url;
    }
    browser = await chromium.launch({ args: GPU });
});

test.afterAll(async () => {
    await browser?.close();
    await server?.close();
});

/** The slice at `query` (the host's skin and scheme by default). */
const sliceUrl = (query) => `${base}/embed/${REMOTE ? "" : "index.html"}#/cube?${query}`;
const hostSlice = (extra, scheme = "light") => sliceUrl(`${HOST_SLICE.replace("scheme=light", `scheme=${scheme}`)}&${extra}`);

/** A ground no face is painted in, for the test only. */
const GROUND = [0, 255, 0];
const GROUND_CSS = `
    html, body, .embed-slice, [data-orbit-stage] { background: rgb(${GROUND.join(",")}) !important; }
    .embed-cube-ground { display: none !important; }
`;

/** The die settled: its faces mounted, any entrance finished, its core shown. */
const dieReady = (page) =>
    page.waitForFunction(
        () => {
            const cube = document.querySelector(".cube");
            if (!cube || !/rotate3d/.test(document.querySelector(".graph > div")?.style.transform ?? "")) return false;
            const fills = [...cube.querySelectorAll(".cube-side > .face-fill")];
            const core = cube.querySelector(".die-core");
            return fills.length === 6 && fills.every((f) => !f.style.transform && !f.style.opacity) && (!core || getComputedStyle(core).display !== "none");
        },
        null,
        { timeout: 20_000 },
    );

/**
 * Ground pixels inside the die: on the pure ground, the ground pixels no path
 * of ground pixels joins to the shot's edge (the die's silhouette encloses
 * them). A path may step diagonally: a face seen edge-on draws as a dotted
 * hairline, which closes nothing. Tolerance 30 a channel: only ground, not a
 * face's anti-aliased edge.
 */
const enclosedGround = (png) => {
    const { width: w, height: h, data } = PNG.sync.read(png);
    const ground = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
        const d = Math.max(Math.abs(data[4 * i] - GROUND[0]), Math.abs(data[4 * i + 1] - GROUND[1]), Math.abs(data[4 * i + 2] - GROUND[2]));
        ground[i] = d <= 30 ? 1 : 0;
    }
    const seen = new Uint8Array(w * h);
    const stack = [];
    for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
    for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
    while (stack.length) {
        const i = stack.pop();
        if (seen[i] || !ground[i]) continue;
        seen[i] = 1;
        const x = i % w;
        const y = (i - x) / w;
        for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) {
                if ((dx || dy) && x + dx >= 0 && x + dx < w && y + dy >= 0 && y + dy < h) stack.push(i + dy * w + dx);
            }
    }
    let n = 0;
    let at = null;
    for (let i = 0; i < w * h; i++)
        if (ground[i] && !seen[i]) {
            n++;
            at ??= { x: i % w, y: Math.floor(i / w) };
        }
    return { n, at };
};

test.describe("die", () => {
    test.setTimeout(120_000);

    test("faces=pips renders the die's 21 pips; numerals stay the default", async () => {
        const ctx = await browser.newContext({ viewport: { width: 520, height: 620 } });
        try {
            const page = await ctx.newPage();
            await page.goto(hostSlice("faces=pips&transport=host"));
            await dieReady(page);
            expect(await page.locator(".cube .die-pip").count()).toBe(21);
            expect(await page.locator(".cube .face-numeral").count()).toBe(0);
            await page.goto(hostSlice("transport=host"));
            await page.reload();
            await dieReady(page);
            expect(await page.locator(".cube .die-pip").count()).toBe(0);
            expect(await page.locator(".cube .face-numeral").count()).toBe(6);
        } finally {
            await ctx.close();
        }
    });

    for (const skin of ["host", "crayon"])
        for (const scheme of ["light", "dark"]) {
            test(`${skin} skin, ${scheme}: no ground shows inside the die, at rest and at 12 attitudes of a turn`, async () => {
                const ctx = await browser.newContext({ viewport: { width: 520, height: 620 }, colorScheme: scheme });
                try {
                    const page = await ctx.newPage();
                    const url = skin === "host" ? hostSlice("faces=pips&transport=host", scheme) : sliceUrl(`scheme=${scheme}&faces=pips&transport=host`);
                    await page.goto(url);
                    await page.addStyleTag({ content: GROUND_CSS });
                    await dieReady(page);
                    await sleep(300);
                    const stage = await page.locator("[data-orbit-stage]").boundingBox();
                    const clip = { x: Math.round(stage.x), y: Math.round(stage.y), width: Math.round(stage.width), height: Math.round(stage.height) };
                    const shoot = async (label) => {
                        const shot = await page.screenshot({ clip });
                        const { n, at } = enclosedGround(shot);
                        if (n > 0) fs.writeFileSync(test.info().outputPath(`${skin}-${scheme}-${label}.png`), shot);
                        return { label, n, at };
                    };
                    const results = [await shoot("rest")];
                    // A turn: a held drag in 12 steps (six across, six down),
                    // each shot once the die has settled under the hand.
                    const c = { x: clip.x + clip.width / 2, y: clip.y + clip.height / 2 };
                    const step = clip.width * 0.09;
                    await page.mouse.move(c.x - 3 * step, c.y - 3 * step);
                    await page.mouse.down();
                    let p = { x: c.x - 3 * step, y: c.y - 3 * step };
                    for (let k = 1; k <= 12; k++) {
                        const to = k <= 6 ? { x: p.x + step, y: p.y } : { x: p.x, y: p.y + step };
                        await page.mouse.move(to.x, to.y, { steps: 6 });
                        p = to;
                        await sleep(350);
                        results.push(await shoot(`turn-${k}`));
                    }
                    await sleep(200);
                    await page.mouse.up();
                    test.info().annotations.push({ type: "die", description: results.map((r) => `${r.label}:${r.n}`).join(" ") });
                    expect(results.filter((r) => r.n > 0)).toEqual([]);
                } finally {
                    await ctx.close();
                }
            });
        }
});

// ── The pair ─────────────────────────────────────────────────────────────
// Two dice on a table (dice=2): a tap throws both and they come to rest with
// their values said; a carried die stays under the hand and is thrown at
// its speed; reduced motion relabels the dice where they lie; and no frame
// of a throw is over its budget.

/** In the slice: every frame's time and both dice's table poses (matrix3d:
 *  the centre in table px), whether both dice's bodies are shown, and the
 *  hand (every pointer sample the page is given, by its own time). */
const installPairRecorder = (page) =>
    page.evaluate(() => {
        const R = { on: false, f: [], hand: [] };
        window.__pair = R;
        const onPointer = (e) => {
            if (!R.on) return;
            const evs = e.type === "pointermove" && typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [];
            for (const m of evs.length ? evs : [e]) R.hand.push({ t: m.timeStamp, x: m.clientX, y: m.clientY, type: e.type });
        };
        addEventListener("pointermove", onPointer, true);
        addEventListener("pointerup", onPointer, true);
        const loop = (t) => {
            if (!R.on) return;
            const dice = [...document.querySelectorAll(".dice-stage .die")];
            R.f.push({
                t,
                tf: dice.map((d) => d.style.transform),
                bodies: dice.every((d) => getComputedStyle(d).visibility === "visible" && [...d.querySelectorAll(".die-face")].every((f) => getComputedStyle(f).opacity === "1")),
                // Read only when asked (a style read per face would weigh on the frames gate).
                pips: R.fades ? [...document.querySelectorAll(".dice-stage .die-pips")].map((p) => Number(getComputedStyle(p).opacity)) : [],
                fills: R.fades ? [...document.querySelectorAll(".dice-stage .die-fill")].map((p) => getComputedStyle(p).backgroundColor) : [],
            });
            requestAnimationFrame(loop);
        };
        R.start = ({ fades = false } = {}) => {
            R.fades = fades;
            R.f = [];
            R.hand = [];
            R.on = true;
            requestAnimationFrame(loop);
        };
        R.stop = () => {
            R.on = false;
            return R.f.map(({ t, tf, bodies, pips, fills }) => ({ t, tf, bodies, pips, fills }));
        };
    });

/** The centre (table px) of a matrix3d. */
const centreOf = (tf) => {
    const m = /matrix3d\(([^)]+)\)/.exec(tf ?? "");
    if (!m) return null;
    const v = m[1].split(",").map(Number);
    return [v[12], v[13], v[14]];
};

/** In the page: a table point to the viewport (the camera's own projection). */
const projector = (page) =>
    page.evaluate(() => {
        const stage = document.querySelector(".dice-stage").getBoundingClientRect();
        const P = parseFloat(getComputedStyle(document.querySelector(".dice-camera")).perspective);
        return { cx: stage.left + stage.width / 2, cy: stage.top + stage.height / 2, P, w: stage.width, h: stage.height };
    });
const TILT = (38 * Math.PI) / 180;
const toScreen = (pr, p) => {
    const Y = p[1] * Math.cos(TILT) - p[2] * Math.sin(TILT);
    const Z = p[1] * Math.sin(TILT) + p[2] * Math.cos(TILT);
    const k = pr.P / (pr.P - Z);
    return { x: pr.cx + p[0] * k, y: pr.cy + Y * k };
};
/** Its inverse at a height `z` above the table: a viewport point to the table. */
const toTable = (pr, sx, sy, z) => {
    const u = sy - pr.cy;
    const c = Math.cos(TILT);
    const sn = Math.sin(TILT);
    const y = (u * pr.P - u * z * c + z * pr.P * sn) / (pr.P * c + u * sn);
    const k = pr.P / (pr.P - (y * sn + z * c));
    return [(sx - pr.cx) / k, y, z];
};

/** The pair at rest on its table (the entrance done). */
const pairReady = async (page) => {
    await page.waitForFunction(() => document.querySelectorAll(".dice-stage .die").length === 2 && /matrix3d/.test(document.querySelector(".dice-stage .die").style.transform), null, { timeout: 20_000 });
    await sleep(1800);
    await installPairRecorder(page);
};

/** A point on the table clear of both dice (for a tap). */
const clearOfDice = async (page) => {
    const pr = await projector(page);
    const cs = await page.evaluate(() => [...document.querySelectorAll(".dice-stage .die")].map((d) => d.style.transform));
    const dice = cs.map(centreOf).map((p) => toScreen(pr, p));
    let best = null;
    for (const fx of [-0.3, 0, 0.3])
        for (const fy of [-0.25, 0.25, 0.4]) {
            const q = { x: pr.cx + fx * pr.w, y: pr.cy + fy * pr.h };
            const d = Math.min(...dice.map((c) => Math.hypot(c.x - q.x, c.y - q.y)));
            if (!best || d > best.d) best = { ...q, d };
        }
    return best;
};

const stillAtEnd = (frames, n = 10) => {
    const tail = frames.slice(-n);
    return tail.every((f) => f.tf.join() === tail[0].tf.join());
};

test.describe("pair", () => {
    test.setTimeout(120_000);
    const desk = { viewport: { width: 900, height: 900 } };

    test("a tap throws both dice; both come to rest and the slice says their values", async () => {
        const ctx = await browser.newContext(desk);
        try {
            const page = await ctx.newPage();
            await page.goto(hostSlice("dice=2&faces=pips&transport=host"));
            await pairReady(page);
            const tap = await clearOfDice(page);
            await page.evaluate(() => window.__pair.start());
            const before = (await page.evaluate(() => window.__pair.f.at(-1)?.tf)) ?? [];
            await page.mouse.click(tap.x, tap.y);
            await sleep(3200);
            const frames = await page.evaluate(() => window.__pair.stop());
            // Both dice left where they lay, and both are still at the end.
            const moved = [0, 1].map((i) => frames.some((f) => f.tf[i] !== frames[0].tf[i]));
            expect(moved).toEqual([true, true]);
            expect(stillAtEnd(frames)).toBe(true);
            expect(before.length === 0 || frames.at(-1).tf.join() !== before.join()).toBe(true);
            const said = await page.locator(".dice-stage [aria-live]").textContent();
            expect(said).toMatch(/^[1-6] and [1-6]$/);
        } finally {
            await ctx.close();
        }
    });

    test("a carried die stays under the hand (within 12 px), and a moving release throws it at the hand's speed (0.8-1.25)", async () => {
        const ctx = await browser.newContext(desk);
        try {
            const page = await ctx.newPage();
            await page.goto(hostSlice("dice=2&faces=pips&transport=host"));
            await pairReady(page);
            const pr = await projector(page);
            const tf = await page.evaluate(() => document.querySelector(".dice-stage .die").style.transform);
            const at = toScreen(pr, centreOf(tf));
            await page.mouse.move(at.x, at.y);
            await page.mouse.down();
            // Lift, then a steady carry of 108 px up the table at about
            // 200 px/s. The pair lies side by side, so the carry and the throw
            // stay clear of the other die (the carry height clears the table,
            // not a die); and up, because a die lifted under the pointer meets
            // the higher plane nearer the viewer, close to the near wall.
            await sleep(400);
            await page.evaluate(() => window.__pair.start());
            let y = at.y;
            for (let k = 0; k < 18; k++) {
                y -= 6;
                await page.mouse.move(at.x, y);
                await sleep(16);
            }
            await page.mouse.up();
            await sleep(500);
            const frames = await page.evaluate(() => window.__pair.stop());
            // The hand as the page was given it, by its own clock.
            const given = await page.evaluate(() => window.__pair.hand);
            const up = given.find((h) => h.type === "pointerup").t;
            const moves = given.filter((h) => h.type === "pointermove" && h.t <= up);
            // The carry's steady half: the die's centre, projected, against
            // the hand's newest position at that frame.
            const steady = frames.filter((f) => f.t > moves[Math.floor(moves.length / 2)].t && f.t < up);
            const gaps = steady.map((f) => {
                const c = toScreen(pr, centreOf(f.tf[0]));
                const h = [...moves].reverse().find((m) => m.t <= f.t) ?? moves[0];
                return Math.hypot(c.x - h.x, c.y - h.y);
            });
            test.info().annotations.push({ type: "carry", description: `max gap ${Math.max(...gaps).toFixed(1)} px over ${gaps.length} frames` });
            expect(gaps.length).toBeGreaterThan(10);
            expect(Math.max(...gaps)).toBeLessThanOrEqual(12);
            // The carry: the die's speed on the table just after the release
            // against the hand's over its last 90 ms (its last two samples at
            // least), at the height it carried.
            const z = centreOf(steady.at(-1).tf[0])[2];
            const recent = moves.filter((m) => m.t >= moves.at(-1).t - 90);
            const last = recent.length >= 2 ? recent : moves.slice(-2);
            const [a, b] = [last[0], last.at(-1)].map((m) => toTable(pr, m.x, m.y, z));
            const handSpeed = Math.hypot(b[0] - a[0], b[1] - a[1]) / ((last.at(-1).t - last[0].t) / 1000);
            const post = frames.filter((f) => f.t > up + 20 && f.t < up + 100);
            const p0 = centreOf(post[0].tf[0]);
            const p1 = centreOf(post.at(-1).tf[0]);
            const thrown = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / ((post.at(-1).t - post[0].t) / 1000);
            const ratio = thrown / handSpeed;
            test.info().annotations.push({ type: "release", description: `carry ${ratio.toFixed(2)} (hand ${handSpeed.toFixed(0)}, thrown ${thrown.toFixed(0)} table px/s)` });
            expect(ratio).toBeGreaterThanOrEqual(0.8);
            expect(ratio).toBeLessThanOrEqual(1.25);
        } finally {
            await ctx.close();
        }
    });

    test("reduced motion: a throw relabels the dice where they lie; no die transform changes, every frame shows both bodies, and the pips and colours fade (never a cut)", async () => {
        const ctx = await browser.newContext({ ...desk, reducedMotion: "reduce" });
        try {
            const page = await ctx.newPage();
            await page.goto(hostSlice("dice=2&faces=pips&transport=host"));
            await pairReady(page);
            const tap = await clearOfDice(page);
            const pipsBefore = await page.evaluate(() => [...document.querySelectorAll(".dice-stage .die")].map((d) => d.querySelectorAll(".die-pip").length));
            await page.evaluate(() => window.__pair.start({ fades: true }));
            await page.mouse.click(tap.x, tap.y);
            await sleep(900);
            const frames = await page.evaluate(() => window.__pair.stop());
            expect(frames.length).toBeGreaterThan(20);
            expect(new Set(frames.map((f) => f.tf.join())).size).toBe(1);
            expect(frames.every((f) => f.bodies)).toBe(true);
            // The pips fade out and back over several frames each; a face
            // whose colour changes passes through colours between.
            const pipsBetween = frames.filter((f) => f.pips.some((o) => o > 0.05 && o < 0.95)).length;
            const [first, last] = [frames[0], frames.at(-1)];
            const changed = first.fills.map((c, i) => c !== last.fills[i]);
            const colourBetween = frames.filter((f) => f.fills.some((c, i) => changed[i] && c !== first.fills[i] && c !== last.fills[i])).length;
            console.log(`reduced throw: ${pipsBetween} frames with the pips between, ${changed.filter(Boolean).length} faces recoloured, ${colourBetween} frames between colours`);
            expect(pipsBetween).toBeGreaterThanOrEqual(8);
            if (changed.some(Boolean)) expect(colourBetween).toBeGreaterThanOrEqual(6);
            const said = await page.locator(".dice-stage [aria-live]").textContent();
            expect(said).toMatch(/^[1-6] and [1-6]$/);
            // Still a true die each: 21 pips.
            expect(pipsBefore).toEqual([21, 21]);
            expect(await page.evaluate(() => [...document.querySelectorAll(".dice-stage .die")].map((d) => d.querySelectorAll(".die-pip").length))).toEqual([21, 21]);
        } finally {
            await ctx.close();
        }
    });

    for (const [cellName, opts, budget] of [
        ["desk", desk, 17],
        ["390 at 4× CPU", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, 34],
    ])
        test(`frames (${cellName}): no frame of a throw over ${budget} ms`, async () => {
            const ctx = await browser.newContext(opts);
            try {
                const page = await ctx.newPage();
                await page.goto(hostSlice("dice=2&faces=pips&transport=host&stage=fill"));
                await pairReady(page);
                const cdp = await ctx.newCDPSession(page);
                if (budget > 17) await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
                await page.evaluate(() => window.__pair.start());
                await page.keyboard.press("Space");
                await sleep(2600);
                const frames = await page.evaluate(() => window.__pair.stop());
                const iv = frames.slice(1).map((f, i) => f.t - frames[i].t);
                test.info().annotations.push({ type: "frames", description: `${iv.length} frames, longest ${Math.max(...iv).toFixed(1)} ms` });
                expect(iv.length).toBeGreaterThan(60);
                expect(Math.max(...iv)).toBeLessThanOrEqual(budget);
            } finally {
                await ctx.close();
            }
        });
});

// ── The embed: a host frames the slice and speaks babb-embed v1 ─────────
// The host is a loopback page of the test's own, served over the network (a
// page answered by a route has no address, so Chrome counts it as public and
// blocks its loopback frame): it frames the slice, records what the slice
// posts and posts set-dice and throw to it. The slice accepts a loopback host
// when it is served from loopback.
const framedHost = async (page, query) => {
    const slice = new URL(sliceUrl(query));
    const html = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}iframe{border:0;width:600px;height:600px}</style>
<iframe id="f" src="${slice.href}"></iframe>
<script>
  window.got = [];
  addEventListener("message", (e) => { if (e.data && e.data.ns === "babb-embed") got.push(e.data); });
  window.send = (m) => document.getElementById("f").contentWindow.postMessage({ ns: "babb-embed", v: 1, ...m }, "${slice.origin}");
</script>`;
    const host = http.createServer((_, res) => res.writeHead(200, { "content-type": "text/html" }).end(html));
    await new Promise((r) => host.listen(0, "127.0.0.1", r));
    const close = () => new Promise((r) => host.close(r));
    try {
        await page.goto(`http://localhost:${host.address().port}/`);
        await page.waitForFunction(() => window.got.some((m) => m.type === "ready"), null, { timeout: 20_000 });
    } catch (e) {
        await close();
        throw e;
    }
    const frame = page.frames().find((f) => f.url().startsWith(slice.origin + slice.pathname));
    return { frame, close };
};

test.describe("embed", () => {
    test.setTimeout(120_000);
    test.skip(!!REMOTE, "the framed host is a loopback page");

    test("ready lists the dice; set-dice swaps one die and the pair with no reload; throw rolls and the slice posts the values it says", async () => {
        const ctx = await browser.newContext({ viewport: { width: 700, height: 700 } });
        let closeHost = async () => {};
        try {
            const page = await ctx.newPage();
            const { frame, close } = await framedHost(page, `${HOST_SLICE}&faces=pips&transport=host`);
            closeHost = close;
            const ready = await page.evaluate(() => window.got.find((m) => m.type === "ready"));
            expect(ready.features).toEqual(["pips", "dice"]);
            const origin = await frame.evaluate(() => performance.timeOrigin);
            // 1 → 2: the pair takes the stage; the one die is gone from it.
            await page.evaluate(() => window.send({ type: "set-dice", count: 2 }));
            await frame.waitForFunction(() => document.querySelectorAll(".dice-stage .die").length === 2, null, { timeout: 10_000 });
            await frame.waitForFunction(() => getComputedStyle(document.querySelector(".cube-stage")).display === "none", null, { timeout: 5_000 });
            await sleep(1500);
            // The host's throw: both come to rest, and rolled matches what is said.
            await page.evaluate(() => (window.got = []));
            await page.evaluate(() => window.send({ type: "throw" }));
            await page.waitForFunction(() => window.got.some((m) => m.type === "rolled"), null, { timeout: 8_000 });
            const rolled = await page.evaluate(() => window.got.filter((m) => m.type === "rolled"));
            expect(rolled).toHaveLength(1);
            expect(rolled[0].values).toHaveLength(2);
            for (const v of rolled[0].values) expect(v >= 1 && v <= 6).toBe(true);
            const said = await frame.locator(".dice-stage [aria-live]").textContent();
            expect(said).toBe(`${rolled[0].values[0]} and ${rolled[0].values[1]}`);
            // 2 → 1: the die returns to its orbit, the pair leaves.
            await page.evaluate(() => window.send({ type: "set-dice", count: 1 }));
            await frame.waitForFunction(() => document.querySelectorAll(".dice-stage").length === 0, null, { timeout: 10_000 });
            expect(await frame.evaluate(() => getComputedStyle(document.querySelector(".cube-stage")).display)).not.toBe("none");
            expect(await frame.locator(".cube .die-pip").count()).toBe(21);
            // No reload throughout.
            expect(await frame.evaluate(() => performance.timeOrigin)).toBe(origin);
        } finally {
            await ctx.close();
            await closeHost();
        }
    });

    test("under reduced motion the swap is one cross-fade: every frame shows a body, none is cut, and no reload", async () => {
        const ctx = await browser.newContext({ viewport: { width: 700, height: 700 }, reducedMotion: "reduce" });
        let closeHost = async () => {};
        try {
            const page = await ctx.newPage();
            const { frame, close } = await framedHost(page, `${HOST_SLICE}&faces=pips&transport=host`);
            closeHost = close;
            const origin = await frame.evaluate(() => performance.timeOrigin);
            // Each frame: the shown opacity of the one die's stage and of the pair's.
            await frame.evaluate(() => {
                const R = (window.__op = []);
                const shown = (el) => (!el || getComputedStyle(el).display === "none" ? 0 : Number(getComputedStyle(el).opacity));
                const loop = () => {
                    R.push([shown(document.querySelector(".cube-stage")), shown(document.querySelector(".dice-stage"))]);
                    if (R.length < 3000) requestAnimationFrame(loop);
                };
                requestAnimationFrame(loop);
            });
            const swap = async (count, done) => {
                const from = await frame.evaluate(() => window.__op.length);
                await page.evaluate((count) => window.send({ type: "set-dice", count }), count);
                await frame.waitForFunction(done, null, { timeout: 10_000 });
                await sleep(400);
                return frame.evaluate((from) => window.__op.slice(from), from);
            };
            const fades = (op) => ({
                blank: op.filter(([a, b]) => a + b < 0.9).length,
                between: op.filter(([a, b]) => [a, b].some((o) => o > 0.05 && o < 0.95)).length,
            });
            const to2 = fades(await swap(2, () => document.querySelectorAll(".dice-stage .die").length === 2 && getComputedStyle(document.querySelector(".cube-stage")).display === "none"));
            const to1 = fades(await swap(1, () => document.querySelectorAll(".dice-stage").length === 0));
            console.log(`reduced swap: 1 to 2 ${JSON.stringify(to2)}, 2 to 1 ${JSON.stringify(to1)}`);
            for (const f of [to2, to1]) {
                expect(f.blank).toBe(0);
                // A fade, not a cut: the 200 ms cross-fade spans several frames.
                expect(f.between).toBeGreaterThanOrEqual(6);
            }
            expect(await frame.evaluate(() => performance.timeOrigin)).toBe(origin);
        } finally {
            await ctx.close();
            await closeHost();
        }
    });
});

test.describe("scene", () => {
    test.setTimeout(60_000);
    test("the Cube scene takes faces=pips and dice=2 by URL", async () => {
        const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
        try {
            const page = await ctx.newPage();
            const at = (hash) => (REMOTE ? `${base}/#${hash}` : `${base}/index.html#${hash}`);
            await page.goto(at("/cube?faces=pips&play=0"));
            await page.waitForFunction(() => document.querySelectorAll(".cube .die-pip").length === 21, null, { timeout: 20_000 });
            await page.goto(at("/cube?faces=pips&dice=2&play=0"));
            await page.reload();
            await page.waitForFunction(() => document.querySelectorAll(".dice-stage .die").length === 2, null, { timeout: 20_000 });
        } finally {
            await ctx.close();
        }
    });
});
