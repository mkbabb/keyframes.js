// SERVED MODEL: claude-opus-5-5
/**
 * value.js X realization K-D2 — THE STAGE PLATE SHOWS ITS INSTRUMENT WHOLE.
 *
 * Run ONLY through the machine guard, never --light (it launches a browser):
 *   ~/.claude/guard/guarded --timeout 30 -- node scripts/probe/kf-stage-fit.mjs \
 *       --base https://keyframes.babb.dev/ --out ~/.dev-logs/x-realize/kf/kd2/run.json \
 *       [--scenes spring,square,sequence,easing,amiga,cube] [--vps 390x844,844x390]
 *       [--themes light,dark] [--shots DIR] [--dir BUILD --base http://kf.build/]
 *
 * One browser per run, a new context per cell, every context and the browser
 * closed in `finally`. Playwright resolves from PLAYWRIGHT_MODULE, else from
 * value.js's node_modules (keyframes.js does not depend on it).
 *
 * Per plated scene (spring, square, sequence, easing), at rest under reduced
 * motion:
 *   (a) the plate does not scroll: scrollHeight <= clientHeight + 1 (a
 *       declared `.fading-scroll` catalogue is a scroll port by design and is
 *       exempt, as is everything inside one);
 *   (b) no visible descendant that paints (text, a graphic, its own
 *       background or border) extends past the plate's box;
 *   (c) the stage header's box does not intersect the instrument body's box
 *       (every other child of the header's parent row);
 *   (d) no text is clipped: no text-bearing element with overflow clipping or
 *       `text-overflow: ellipsis` has scrollWidth > clientWidth + 1.
 * cube and amiga carry no plate; their subject rect is recorded so a plate
 * change is seen not to move them.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const arg = (name, dflt) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > 0 ? process.argv[i + 1] : dflt;
};
const BASE = arg("base", "https://keyframes.babb.dev/").replace(/\/?$/, "/");
const OUT = arg("out", null);
const SHOTS = arg("shots", null);
const DIR = arg("dir", null);
const SCENES = arg("scenes", "spring,square,sequence,easing,amiga,cube").split(",");
const VPS = arg("vps", "390x844,430x932,844x390,1024x768,1440x900,1800x1000")
    .split(",")
    .map((s) => s.split("x").map(Number));
const THEMES = arg("themes", "light,dark").split(",");
const PW = process.env.PLAYWRIGHT_MODULE ?? "/Users/mkbabb/Programming/value.js/node_modules/playwright/index.mjs";
const { chromium } = await import(PW);

const PLATE = ".spring-target, .seq-target, .square-stage, .easing-target";
const fails = [];
const cells = [];
const errors = [];

async function cell(browser, scene, w, h, theme) {
    const ctx = await browser.newContext({
        viewport: { width: w, height: h },
        colorScheme: theme,
        reducedMotion: "reduce",
    });
    try {
        if (DIR)
            await ctx.route(`${BASE}**`, (route) => {
                const rel = new URL(route.request().url()).pathname.replace(/^\/+/, "") || "index.html";
                const file = join(DIR, rel);
                return existsSync(file) ? route.fulfill({ path: file }) : route.fulfill({ path: join(DIR, "index.html") });
            });
        const page = await ctx.newPage();
        page.on("pageerror", (e) => errors.push(`${scene}@${w}x${h} ${theme}: ${String(e).slice(0, 160)}`));
        await page.goto(`${BASE}#/${scene}`, { waitUntil: "load", timeout: 30000 });
        await page.waitForSelector(".stage-cell", { timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(2500);
        const r = await page.evaluate((PLATE) => {
            const R = (b) => ({ t: +b.top.toFixed(1), b: +b.bottom.toFixed(1), l: +b.left.toFixed(1), r: +b.right.toFixed(1) });
            const plate = document.querySelector(`.stage-glide :is(${PLATE})`);
            const subject = document.querySelector(".stage-glide")?.getBoundingClientRect();
            if (!plate) return { plate: null, subject: subject && R(subject) };
            const pb = plate.getBoundingClientRect();
            const inPort = (e) => {
                for (let p = e.parentElement; p && p !== plate; p = p.parentElement)
                    if (p.matches(".fading-scroll")) return true;
                return false;
            };
            const visible = (e) => {
                const cs = getComputedStyle(e);
                if (cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0") return false;
                if (e.closest(".sr-only")) return false;
                // A visually-hidden twin (1 px box, clipped) is not drawn.
                if (cs.clip !== "auto" && cs.clip !== "") return false;
                if (/inset\(50%|inset\(100%/.test(cs.clipPath)) return false;
                const b = e.getBoundingClientRect();
                return b.width > 1.5 && b.height > 1.5;
            };
            // A box that PAINTS: text, a replaced/graphic element, or its own
            // background / border. An empty positioning wrapper (a carriage)
            // paints nothing; what it carries is measured itself.
            const clear = (c) => c === "transparent" || /rgba\([^)]*,\s*0\)$/.test(c) || /\/\s*0\)$/.test(c);
            const paints = (e) => {
                if (/^(svg|img|canvas|video|input|textarea|select|button)$/i.test(e.tagName)) return true;
                if (e instanceof SVGElement) return false; // measured as its <svg>
                if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return true;
                const cs = getComputedStyle(e);
                if (!clear(cs.backgroundColor) || cs.backgroundImage !== "none") return true;
                return ["Top", "Right", "Bottom", "Left"].some(
                    (s) => parseFloat(cs[`border${s}Width`]) > 0 && !clear(cs[`border${s}Color`]),
                );
            };
            const exempt = plate.matches(".fading-scroll");
            const scroll = { sh: plate.scrollHeight, ch: plate.clientHeight };
            const outside = [];
            for (const e of plate.querySelectorAll("*")) {
                if (!visible(e) || inPort(e) || !paints(e)) continue;
                const b = e.getBoundingClientRect();
                const over = Math.max(pb.top - b.top, b.bottom - pb.bottom, pb.left - b.left, b.right - pb.right);
                if (over > 1)
                    outside.push({ el: `${e.tagName.toLowerCase()}.${String(e.className?.baseVal ?? e.className).split(" ").slice(0, 2).join(".")}`, over: +over.toFixed(1), ...R(b) });
            }
            const header = plate.querySelector("[data-scene-stage-header]");
            const collide = [];
            if (header) {
                const hb = header.getBoundingClientRect();
                // The header's row siblings are the instrument body.
                for (const s of header.parentElement.children) {
                    if (s === header || !visible(s)) continue;
                    const b = s.getBoundingClientRect();
                    const ix = Math.min(hb.right, b.right) - Math.max(hb.left, b.left);
                    const iy = Math.min(hb.bottom, b.bottom) - Math.max(hb.top, b.top);
                    if (ix > 1 && iy > 1) collide.push({ el: `${s.tagName.toLowerCase()}.${String(s.className).split(" ")[0]}`, iy: +iy.toFixed(1) });
                }
            }
            const clipped = [];
            for (const e of plate.querySelectorAll("*")) {
                if (!visible(e) || inPort(e)) continue;
                const text = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
                if (!text) continue;
                const cs = getComputedStyle(e);
                const clips = cs.textOverflow === "ellipsis" || cs.overflowX !== "visible";
                if (clips && e.scrollWidth > e.clientWidth + 1)
                    clipped.push({ text: e.textContent.trim().slice(0, 40), sw: e.scrollWidth, cw: e.clientWidth });
            }
            return {
                plate: plate.className.split(" ")[0],
                box: R(pb),
                exempt,
                scroll,
                outside: outside.sort((a, b) => b.over - a.over).slice(0, 8),
                collide,
                clipped,
                header: header && R(header.getBoundingClientRect()),
                subject: subject && R(subject),
            };
        }, PLATE);
        const id = `${scene}@${w}x${h} ${theme}`;
        cells.push({ scene, vp: `${w}x${h}`, theme, ...r });
        if (r.plate) {
            if (!r.exempt && r.scroll.sh > r.scroll.ch + 1) fails.push(`${id} (a) plate scrolls ${r.scroll.sh} in ${r.scroll.ch}`);
            if (r.outside.length) fails.push(`${id} (b) ${r.outside.length} box(es) past the plate, worst ${r.outside[0].el} by ${r.outside[0].over} px`);
            if (r.collide.length) fails.push(`${id} (c) header meets ${r.collide.map((c) => `${c.el} (${c.iy} px)`).join(", ")}`);
            if (r.clipped.length) fails.push(`${id} (d) clipped text ${r.clipped.map((c) => `"${c.text}" ${c.sw}/${c.cw}`).join(", ")}`);
        }
        if (SHOTS) await page.screenshot({ path: join(SHOTS, `${scene}-${w}x${h}-${theme}.png`) });
        await page.close();
    } finally {
        await ctx.close();
    }
}

const browser = await chromium.launch();
try {
    if (SHOTS) mkdirSync(SHOTS, { recursive: true });
    for (const [w, h] of VPS)
        for (const theme of THEMES)
            for (const scene of SCENES) {
                try {
                    await cell(browser, scene, w, h, theme);
                } catch (e) {
                    fails.push(`${scene}@${w}x${h} ${theme}: probe error ${String(e).split("\n")[0].slice(0, 160)}`);
                }
            }
} finally {
    await browser.close();
}
if (errors.length) fails.push(`pageerror ×${errors.length}: ${errors[0]}`);
const json = JSON.stringify({ base: BASE, dir: DIR, at: new Date().toISOString(), fails, errors, cells }, null, 1);
if (OUT) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, json);
}
console.log(fails.length ? `RED ${fails.length}\n${fails.join("\n")}` : `GREEN (${cells.length} cells)`);
process.exitCode = fails.length ? 1 : 0;
