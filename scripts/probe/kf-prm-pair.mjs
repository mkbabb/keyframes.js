// SERVED MODEL: claude-opus-5-5
/**
 * value.js X realization K-D11 (G-KFW9-7) — THE TWO-DIRECTION PRM PAIR, LIVE.
 *
 * Run ONLY through the machine guard, never --light (it launches a browser):
 *   ~/.claude/guard/guarded --timeout 20 -- node scripts/probe/kf-prm-pair.mjs \
 *       --base https://keyframes.babb.dev/ --out ~/.dev-logs/x-realize/kf/kd11/prm-r1.json
 *       [--scenes home,cube,amiga] [--dir BUILD --base http://kf.build/]
 *
 * One browser, one context per scene, closed in `finally`. Each scene loads
 * with motion allowed, then flips the media feature live, with no reload:
 * no-preference → reduce (ENGAGE) → no-preference (RELEASE) → reduce (ENGAGE
 * again). In each phase, after a 700 ms settle, it samples for 1.2 s:
 *   - `moving`: elements under the stage whose computed transform changed
 *     between two rAF-spaced reads (the identity motion: bob, roll, spin);
 *   - `running`: document.getAnimations() in the running state;
 *   - `pixels`: two captures of the stage cell 500 ms apart differ (the
 *     witness for motion no property read sees, e.g. a canvas).
 * GREEN when the subject moves at no-preference and is still at reduce, in
 * every phase: motion stops at engage and resumes at release.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const arg = (n, d) => {
    const i = process.argv.indexOf(`--${n}`);
    return i > 0 ? process.argv[i + 1] : d;
};
const BASE = arg("base", "https://keyframes.babb.dev/").replace(/\/?$/, "/");
const OUT = arg("out", null);
const DIR = arg("dir", null);
const SCENES = arg("scenes", "home,cube,amiga").split(",");
const PW = process.env.PLAYWRIGHT_MODULE ?? "/Users/mkbabb/Programming/value.js/node_modules/playwright/index.mjs";
const { chromium } = await import(PW);

const fails = [];
const out = [];

const sample = (page) =>
    page.evaluate(async () => {
        const host = document.querySelector(".stage-glide") ?? document.body;
        const els = [host, ...host.querySelectorAll("*")].filter((e) => e.getBoundingClientRect().width > 0);
        // The identity motion rides `transform` and the individual transform
        // properties (translate / rotate / scale), so all four are read.
        const read = () =>
            els.map((e) => {
                const cs = getComputedStyle(e);
                return `${cs.transform}|${cs.translate}|${cs.rotate}|${cs.scale}`;
            });
        const name = (e) => `${e.tagName.toLowerCase()}.${String(e.className?.baseVal ?? e.className).split(" ").slice(0, 2).join(".")}`;
        const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
        let moved = new Set();
        let prev = read();
        const t0 = performance.now();
        let ticks = 0;
        while (performance.now() - t0 < 1200) {
            for (let k = 0; k < 6; k++) await frame();
            ticks++;
            const cur = read();
            cur.forEach((v, i) => v !== prev[i] && moved.add(i));
            prev = cur;
        }
        const anims = document.getAnimations().filter((a) => a.playState === "running");
        return {
            moving: moved.size,
            movers: [...moved].slice(0, 6).map((i) => name(els[i])),
            running: anims.length,
            animNames: [...new Set(anims.map((a) => a.animationName ?? a.id ?? a.constructor.name))].slice(0, 8),
            ticks,
        };
    });

const browser = await chromium.launch();
try {
    for (const scene of SCENES) {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
        try {
            if (DIR)
                await ctx.route(`${BASE}**`, (route) => {
                    const rel = new URL(route.request().url()).pathname.replace(/^\/+/, "") || "index.html";
                    const file = join(DIR, rel);
                    return existsSync(file) ? route.fulfill({ path: file }) : route.fulfill({ path: join(DIR, "index.html") });
                });
            const page = await ctx.newPage();
            const errs = [];
            page.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
            await page.goto(`${BASE}#/${scene === "home" ? "" : scene}`, { waitUntil: "load", timeout: 30000 });
            await page.waitForSelector(".stage-cell", { timeout: 15000 }).catch(() => {});
            await page.waitForTimeout(2500);
            const phases = [];
            // The pixel witness: two captures of the stage 500 ms apart differ
            // while anything draws motion (a canvas sphere included) and are
            // byte-equal when the stage is still.
            const clip = await page.evaluate(() => {
                const b = (document.querySelector(".stage-cell") ?? document.body).getBoundingClientRect();
                return { x: Math.max(0, b.x), y: Math.max(0, b.y), width: Math.min(innerWidth, b.width), height: Math.min(innerHeight, b.height) };
            });
            const pixelsMove = async () => {
                const a = await page.screenshot({ clip });
                await page.waitForTimeout(500);
                const b = await page.screenshot({ clip });
                return !a.equals(b);
            };
            for (const [name, rm] of [["start", "no-preference"], ["engage", "reduce"], ["release", "no-preference"], ["engage2", "reduce"]]) {
                await page.emulateMedia({ reducedMotion: rm });
                await page.waitForTimeout(700);
                phases.push({ name, rm, ...(await sample(page)), pixels: await pixelsMove() });
            }
            out.push({ scene, phases, errs });
            for (const p of phases) {
                const moves = p.moving > 0 || p.pixels;
                if (p.rm === "reduce" && moves) fails.push(`${scene} ${p.name}: motion under reduce (${p.moving} mover(s) ${p.movers.join(" ")}; pixels ${p.pixels}; running ${p.running} ${p.animNames.join(",")})`);
                if (p.rm === "no-preference" && !moves) fails.push(`${scene} ${p.name}: the stage is still at no-preference (running ${p.running})`);
            }
            if (errs.length) fails.push(`${scene}: pageerror ${errs[0]}`);
            await page.close();
        } finally {
            await ctx.close();
        }
    }
} finally {
    await browser.close();
}
const json = JSON.stringify({ base: BASE, dir: DIR, at: new Date().toISOString(), fails, out }, null, 1);
if (OUT) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, json);
}
console.log(fails.length ? `RED ${fails.length}\n${fails.join("\n")}` : `GREEN (${out.length} scenes × 4 phases)`);
process.exitCode = fails.length ? 1 : 0;
