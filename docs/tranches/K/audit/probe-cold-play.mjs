// K audit — the COLD play path probe (live, built dist).
// From the HERO start screen, click the bottom-dock rainbow play with NO prior
// selection; sample the cube subject transform vs the transport slider over time.
import { withPage } from "../../../../scripts/lib/demo-driver.mjs";

const SHOTS = new URL("./screenshots-k/", import.meta.url).pathname;

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

await withPage({ context: { viewport: { width: 1440, height: 900 } }, label: "cold-play" }, async (page, { url }) => {
    const log = [];
    page.on("console", (m) => { if (m.type() === "error") log.push("CONSOLE.ERR " + m.text()); });
    page.on("pageerror", (e) => log.push("PAGEERROR " + e.message));

    // FRESH context: clear storage so we land on the genuine cold home.
    await page.goto(url + "#/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => { localStorage.clear(); });
    await page.goto(url + "#/", { waitUntil: "networkidle" });
    await sleep(800);

    // probe state on the HERO/home screen
    const home = await page.evaluate(() => {
        const startScreen = document.querySelector(".hero-display");
        const cube = document.querySelector(".cube");
        const dock = document.querySelector('[class*="dock"]');
        // the bottom transport rainbow play
        const rainbow = [...document.querySelectorAll("button")].filter((b) =>
            b.className.includes("rainbow")
        );
        return {
            hasStartScreen: !!startScreen,
            startText: startScreen?.textContent?.slice(0, 80) ?? null,
            hasCube: !!cube,
            cubeTransform: cube ? getComputedStyle(cube).transform : null,
            hash: location.hash,
            rainbowCount: rainbow.length,
            rainbowRects: rainbow.map((b) => { const r = b.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), vivid: b.className.includes("vivid") }; }),
        };
    });
    log.push("HOME: " + JSON.stringify(home));
    await page.screenshot({ path: SHOTS + "cold-00-home.png" });

    // Sample the cube transform + slider BEFORE click
    const sampleState = () => page.evaluate(() => {
        const cube = document.querySelector(".cube");
        const slider = document.querySelector('input[type="range"], [role="slider"]');
        const sliderVal = slider ? (slider.getAttribute("aria-valuenow") ?? slider.value ?? null) : null;
        // sequence/cube progress ball or playhead
        return {
            hash: location.hash,
            cubeTransform: cube ? getComputedStyle(cube).transform : null,
            sliderVal,
            isPlaying: !!document.querySelector(".rainbow-vivid"),
        };
    });

    log.push("PRE-CLICK: " + JSON.stringify(await sampleState()));

    // Find + click the FIRST rainbow play (the bottom dock). Use the larger one (w-10 expanded) if present.
    const clickedInfo = await page.evaluate(() => {
        const rainbow = [...document.querySelectorAll("button")].filter((b) => b.className.includes("rainbow"));
        // prefer the visible/largest
        let target = null, best = -1;
        for (const b of rainbow) {
            const r = b.getBoundingClientRect();
            const vis = r.width > 0 && r.height > 0 && r.y < window.innerHeight;
            if (vis && r.width > best) { best = r.width; target = b; }
        }
        if (!target) return { ok: false };
        const r = target.getBoundingClientRect();
        return { ok: true, x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width };
    });
    log.push("CLICK TARGET: " + JSON.stringify(clickedInfo));
    if (clickedInfo.ok) {
        // real pointer sequence (pointerdown actuation matters per W7c)
        await page.mouse.move(clickedInfo.x, clickedInfo.y);
        await page.mouse.down();
        await sleep(40);
        await page.mouse.up();
    }

    // Sample over the transition window
    const series = [];
    for (let i = 0; i < 16; i++) {
        await sleep(120);
        series.push({ t: (i + 1) * 120, ...(await sampleState()) });
    }
    log.push("POST-CLICK SERIES:");
    for (const s of series) log.push("  " + JSON.stringify(s));

    // distinct cube transforms during the window (frozen subject test)
    const distinctCube = new Set(series.map((s) => s.cubeTransform)).size;
    const distinctSlider = new Set(series.map((s) => s.sliderVal)).size;
    log.push(`DISTINCT cubeTransform=${distinctCube} slider=${distinctSlider} finalHash=${series[series.length-1].hash}`);

    await page.screenshot({ path: SHOTS + "cold-01-after-play.png" });

    console.log(log.join("\n"));
    return { distinctCube, distinctSlider };
});
