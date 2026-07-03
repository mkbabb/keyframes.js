import { createRequire } from "module";
import { openPage, openStage, sleep, SHOTS } from "./lib.mjs";
const req = createRequire("/Users/mkbabb/Programming/glass-ui/package.json");
const { chromium } = req("playwright-core");
const b = await chromium.launch({
    headless: true,
    args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"],
});

async function ctx(name, opts) {
    const { page, errors } = await openPage(b, opts);
    await openStage(page);
    await sleep(250); // let fan-in settle + previews tick
    await page.screenshot({ path: `${SHOTS}/${name}-browse.png` });

    // committing payoff: spin to spring(4), arm via Enter, capture at ~210ms into
    // the 280ms dwell (flare + press + footlight bloom), BEFORE the fire/VT.
    await page.evaluate(() => window.__stageDebug.spinTo(4));
    await page.waitForFunction(() => !window.__stageDebug.spinning(), { timeout: 3000 });
    await page.$eval(".scene-stage", (e) => e.focus());
    await page.keyboard.press("Enter");
    await sleep(150); // safely inside the 280ms dwell (flare near peak, pre-fire)
    await page.screenshot({ path: `${SHOTS}/${name}-committing.png` });

    // entered: wait for the commit + VT to finish, then shoot the grown scene.
    await page.waitForFunction(() => window.__stageLastCommit != null, { timeout: 3000 });
    await sleep(650);
    await page.screenshot({ path: `${SHOTS}/${name}-entered.png` });
    console.log(`${name}: committed=`, await page.evaluate(() => window.__stageLastCommit?.id), "errors=", errors.length);
    await page.close();
}

await ctx("dark", { theme: "dark", width: 1440, height: 900 });
await ctx("light", { theme: "light", width: 1440, height: 900 });
await ctx("mobile", { theme: "dark", width: 390, height: 844 });

// the HINT on first open (exit bar f) — hintDismissed:false
{
    const { page } = await openPage(b, { theme: "dark", hintDismissed: false });
    await openStage(page);
    await sleep(250);
    await page.screenshot({ path: `${SHOTS}/dark-hint-firstopen.png` });
    const hintPresent = await page.evaluate(() => !!document.querySelector(".stage-hint"));
    // spin once → hint must dismiss
    await page.$eval(".scene-stage", (e) => e.focus());
    await page.keyboard.press("ArrowRight");
    await sleep(400);
    const hintAfter = await page.evaluate(() => !!document.querySelector(".stage-hint"));
    await page.screenshot({ path: `${SHOTS}/dark-hint-afterspin.png` });
    console.log("hint firstopen present:", hintPresent, "→ after spin:", hintAfter);
    await page.close();
}

// grid-ghost evidence over the REAL .grid-background: a light-theme browse shot
// (the paper is most at risk of vanishing in light) + a dark one already above.
{
    const { page } = await openPage(b, { theme: "light" });
    await openStage(page);
    await sleep(250);
    // crop-less full shot; the report pairs it against the dark grid shot
    await page.screenshot({ path: `${SHOTS}/light-grid-ghost.png` });
    // confirm the real grid-background is actually painted underneath
    const gridProof = await page.evaluate(() => {
        const el = document.querySelector(".grid-background");
        const bg = el ? getComputedStyle(el).backgroundImage : "";
        return { hasGridEl: !!el, gradientLayers: (bg.match(/linear-gradient/g) || []).length };
    });
    console.log("real grid-background:", JSON.stringify(gridProof));
    await page.close();
}

await b.close();
console.log("shots done");
