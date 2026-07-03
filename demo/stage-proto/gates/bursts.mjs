import { createRequire } from "module";
import { openPage, openStage, sleep, SHOTS } from "./lib.mjs";
const req = createRequire("/Users/mkbabb/Programming/glass-ui/package.json");
const { chromium } = req("playwright-core");
const b = await chromium.launch({
    headless: true,
    args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"],
});

// ── FAN-IN burst: pill-click → zoom-out → stagger(from:center) fan-in → carousel
{
    const { page } = await openPage(b, { theme: "dark", hash: "#cube", width: 1440, height: 900 });
    await page.click('[data-testid="scene-pill"]');
    for (let i = 0; i < 10; i++) {
        await page.screenshot({ path: `${SHOTS}/fanin-burst-${String(i).padStart(2, "0")}.png` });
        await sleep(85);
    }
    console.log("fan-in burst: 10 frames @~85ms");
    await page.close();
}

// ── COMMIT PAYOFF burst: arm → the 280ms dwell (flare + press + footlight bloom)
// → (VT fires after; not screenshotted). Pre-VT frames only, so no VT abort.
{
    const { page } = await openPage(b, { theme: "dark", hash: "#cube", width: 1440, height: 900 });
    await openStage(page);
    await page.evaluate(() => window.__stageDebug.spinTo(4)); // spring
    await page.waitForFunction(() => !window.__stageDebug.spinning(), { timeout: 3000 });
    await sleep(120);
    // frame 0: the settled browse state (pre-arm) for the before/after read
    await page.screenshot({ path: `${SHOTS}/payoff-burst-00.png` });
    await page.$eval(".scene-stage", (e) => e.focus());
    await page.keyboard.press("Enter"); // arm → committing dwell (280ms)
    for (let i = 1; i <= 4; i++) {
        await sleep(55);
        await page.screenshot({ path: `${SHOTS}/payoff-burst-${String(i).padStart(2, "0")}.png` });
    }
    // let it commit + VT settle, then the entered frame
    await page.waitForFunction(() => window.__stageLastCommit != null, { timeout: 3000 });
    await sleep(650);
    await page.screenshot({ path: `${SHOTS}/payoff-burst-05-entered.png` });
    console.log("payoff burst: 00=browse, 01-04=flare/press dwell, 05=entered");
    await page.close();
}

await b.close();
console.log("bursts done");
