// SERVED MODEL: claude-opus-5-5 · run through the guard (a browser run, never --light):
//   ~/.claude/guard/guarded --timeout 8 -- node scripts/probe/kf-owner-1112-a.mjs <base> <outDir>
// owner-1112 PR A falsifier: items 10, 8, 9, 1, 2, 4 against one served build.
// usage: node probe-prA.mjs <baseUrl> <outDir>   (exit 1 when any check fails)
// One browser, one context per check, everything closed in finally.
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(process.env.HOME + "/Programming/value.js/package.json");
const { chromium } = require("playwright");
const [base, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const results = [];
const check = (item, name, ok, detail) => {
    results.push({ item, name, ok: !!ok, detail });
    console.log(`${ok ? "PASS" : "FAIL"} [${item}] ${name} ${JSON.stringify(detail)}`);
};
const browser = await chromium.launch({ headless: true });
const withPage = async (route, fn, { width = 1440, height = 900, scheme = "dark" } = {}) => {
    const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: scheme });
    try {
        const page = await ctx.newPage();
        await page.goto(`${base}#/${route}`, { waitUntil: "load" });
        await page.waitForTimeout(2500);
        await fn(page);
    } catch (e) {
        check("-", `${route} threw`, false, String(e).slice(0, 300));
    } finally {
        await ctx.close();
    }
};
const easingTrigger = (page) =>
    page.locator("button[aria-labelledby]").filter({ has: page.locator(".curve-glyph") }).first();

try {
    // ── 10 · no stage title on any scene ──
    for (const route of ["spring", "square", "sequence", "easing"]) {
        await withPage(route, async (page) => {
            const titles = await page.evaluate(() =>
                [...document.querySelectorAll("[data-scene-stage-header] h2, [data-scene-stage-header] .text-display")]
                    .map((e) => e.textContent?.trim())
                    .filter(Boolean),
            );
            check(10, `#/${route} stage has no title`, titles.length === 0, titles);
        });
    }

    // ── 8 · square: x/y in a chip, bigger field ──
    await withPage("square", async (page) => {
        const r = await page.evaluate(() => {
            const plate = document.querySelector(".square-stage")?.getBoundingClientRect();
            const field = document.querySelector(".square-field")?.getBoundingClientRect();
            const readout = document.querySelector(".square-telemetry .stage-readout");
            return {
                plateH: plate?.height,
                fieldW: field?.width,
                inChip: !!readout?.closest(".glass-chip"),
                squareText: [...document.querySelectorAll(".square-stage *")].some(
                    (e) => e.childElementCount === 0 && e.textContent?.trim() === "Square",
                ),
            };
        });
        check(8, "x/y readout sits in a glass Chip", r.inChip, r);
        check(8, "no 'Square' heading", !r.squareText, r);
        check(8, "field is >= 360 px at 1440x900 (master 313)", r.fieldW >= 360, r);
        await page.screenshot({ path: `${out}/square-1440-dark.png` });
    });

    // ── 9 · easing page: thicker lines ──
    await withPage("easing", async (page) => {
        const w = await page.evaluate(() => {
            const off = document.querySelector('.specimen-tile:not([data-state="on"]) .tile-sparkline path');
            const on = document.querySelector('.specimen-tile[data-state="on"] .tile-sparkline path');
            return { off: parseFloat(getComputedStyle(off).strokeWidth), on: on ? parseFloat(getComputedStyle(on).strokeWidth) : null };
        });
        check(9, "curve stroke >= 2 px, selected thicker", w.off >= 2 && (w.on ?? 3) > w.off, w);
        await page.screenshot({ path: `${out}/easing-1440-dark.png` });
    });

    // ── 1a / 1b / 1c · the easing picker ──
    await withPage("square", async (page) => {
        // 1c · press: the pencil shrinks uniformly on press (both axes < rest)
        const pencil = page.getByRole("button", { name: "Edit easing curve" });
        const pb = await pencil.boundingBox();
        await page.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2);
        await page.waitForTimeout(400);
        await page.mouse.down();
        await page.waitForTimeout(260);
        const held = await pencil.evaluate((el) => {
            const b = el.getBoundingClientRect();
            return { w: b.width, h: b.height };
        });
        await page.mouse.move(5, 5); // leave before release: no click, no editor
        await page.mouse.up();
        check("1c", "pencil shrinks on press (w and h below rest)", held.w < pb.width - 0.3 && held.h < pb.height - 0.3, { rest: [pb.width, pb.height], held });
        await page.waitForTimeout(600);

        const trigger = easingTrigger(page);
        const tb = await trigger.boundingBox();
        await page.mouse.move(tb.x + 40, tb.y + tb.height / 2);
        await page.waitForTimeout(400);
        await page.mouse.down();
        await page.waitForTimeout(200);
        const tHeld = await trigger.evaluate((el) => el.getBoundingClientRect().width);
        await page.mouse.up();
        check("1c", "trigger shrinks on press", tHeld < tb.width - 1, { rest: tb.width, held: tHeld });
        await page.waitForTimeout(900);
        const tiles = page.locator('[data-density="menu"] .specimen-tile');
        const n = await tiles.count();
        if (n === 0) throw new Error("menu did not open");
        await page.screenshot({ path: `${out}/menu-1440-dark.png` });

        // 1a · hover draws: the trace grows, the ball rides
        const tile = tiles.nth(1);
        const tbx = await tile.boundingBox();
        await page.mouse.move(tbx.x + tbx.width / 2, tbx.y + tbx.height / 2, { steps: 4 });
        const draw = [];
        for (let i = 0; i < 8; i++) {
            draw.push(
                await tile.evaluate((el) => ({
                    d: getComputedStyle(el).getPropertyValue("--trace-draw").trim(),
                    ball: el.querySelector(".tile-carriage")?.style.transform ?? "",
                })),
            );
            if (i === 2) await page.screenshot({ path: `${out}/hover-strip-0.png`, clip: { x: tbx.x - 8, y: tbx.y - 8, width: tbx.width + 16, height: tbx.height + 16 } });
            await page.waitForTimeout(130);
        }
        await page.screenshot({ path: `${out}/hover-strip-1.png`, clip: { x: tbx.x - 8, y: tbx.y - 8, width: tbx.width + 16, height: tbx.height + 16 } });
        const ds = draw.map((x) => parseFloat(x.d)).filter(Number.isFinite);
        const balls = new Set(draw.map((x) => x.ball));
        check("1a", "hover draws the curve (trace grows 0 -> 1) and the ball rides", ds.length >= 4 && ds[0] < 0.6 && ds.at(-1) > 0.95 && balls.size >= 4, { ds, balls: balls.size });

        // 1b · choosing morphs the trigger's glyph
        const before = await page.locator(".curve-glyph path").first().getAttribute("d");
        const pick = tiles.nth(3);
        await pick.click();
        const frames = [];
        const gb = await page.locator(".curve-glyph").first().boundingBox();
        for (let i = 0; i < 14; i++) {
            frames.push(await page.locator(".curve-glyph path").first().getAttribute("d"));
            if (gb && i % 3 === 0) await page.screenshot({ path: `${out}/morph-strip-${i}.png`, clip: { x: gb.x - 6, y: gb.y - 6, width: 160, height: gb.height + 12 } });
            await page.waitForTimeout(35);
        }
        const distinct = new Set(frames.filter((d) => d !== before)).size;
        check("1b", "the trigger's glyph bends through in-between shapes", distinct >= 4, { distinct });
    });

    // ── 2 · option glyphs lean on hover ──
    await withPage("square", async (page) => {
        const trig = page.getByRole("combobox").first();
        const g = trig.locator("svg").first();
        const rest = await g.evaluate((el) => getComputedStyle(el.firstElementChild).translate);
        await trig.hover();
        await page.waitForTimeout(450);
        const hov = await g.evaluate((el) => getComputedStyle(el.firstElementChild).translate);
        check(2, "direction glyph leans on hover", rest !== hov && hov !== "none", { rest, hov });
        await trig.click();
        await page.waitForTimeout(500);
        const opts = page.getByRole("option");
        const k = await opts.count();
        let leaned = 0;
        for (let i = 0; i < k; i++) {
            await opts.nth(i).hover();
            await page.waitForTimeout(320);
            const t = await opts.nth(i).locator("svg").first().evaluate((el) => getComputedStyle(el.firstElementChild).translate + "|" + getComputedStyle(el.firstElementChild).rotate);
            if (t !== "none|none") leaned++;
        }
        check(2, "every direction option's glyph moves when highlighted", k > 0 && leaned === k, { k, leaned });
        await page.screenshot({ path: `${out}/direction-menu-1440-dark.png` });
    });

    // ── 4 · Matrix is live: choosing it selects the Matrix channel and opens the editor ──
    await withPage("cube", async (page) => {
        const c = await page.evaluate(() => {
            const r = document.querySelector(".glass-dock").getBoundingClientRect();
            return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        });
        await page.mouse.move(c.x, c.y);
        await page.waitForFunction(() => document.querySelector(".glass-dock")?.classList.contains("expanded"), null, { timeout: 4000 }).catch(() => {});
        await page.waitForTimeout(400);
        await page.locator("[data-dock-surface-trigger]").first().click();
        await page.waitForTimeout(600);
        const row = page.locator('[data-dock-surface-item][data-surface="matrix-controls"]');
        const disabled = await row.evaluate((el) => el.hasAttribute("data-disabled"));
        check(4, "Matrix row is not disabled", !disabled, { disabled });
        await page.screenshot({ path: `${out}/surface-menu-cube-1440-dark.png` });
        if (!disabled) {
            await row.click();
            await page.waitForTimeout(900);
            const face = await page.locator("[data-dock-surface-trigger]").first().getAttribute("data-surface");
            check(4, "choosing Matrix opens the Matrix surface", face === "matrix-controls", { face });
            await page.screenshot({ path: `${out}/matrix-open-1440-dark.png` });
        }
    });
} finally {
    await browser.close();
}
fs.writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.ok).length;
console.log(`${results.length - failed}/${results.length} pass`);
process.exit(failed ? 1 : 0);
