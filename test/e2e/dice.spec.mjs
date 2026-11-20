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
 * them). Tolerance 30 a channel: only ground, not a face's anti-aliased edge.
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
        if (x > 0) stack.push(i - 1);
        if (x < w - 1) stack.push(i + 1);
        if (i >= w) stack.push(i - w);
        if (i < w * (h - 1)) stack.push(i + w);
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
                        if (n > 0) await test.info().attach(`${skin}-${scheme}-${label}.png`, { body: shot, contentType: "image/png" });
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
