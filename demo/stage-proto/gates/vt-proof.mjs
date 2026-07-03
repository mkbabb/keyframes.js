import { launch, openPage, openStage, sleep, SHOTS } from "./lib.mjs";

const b = await launch();
const { page, errors } = await openPage(b, { theme: "dark", hash: "#cube" });
await openStage(page);

// assert NO view-transition-name anywhere in the stage tree (guardrail 3)
const vtNames = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll(".scene-stage, .scene-stage *").forEach((el) => {
        const n = getComputedStyle(el).viewTransitionName;
        if (n && n !== "none") out.push(el.className + ":" + n);
    });
    return out;
});

// spin to a different scene, then commit it, capturing a frame burst across the
// payoff → VT growth (also the P5 commit-payoff motion evidence).
await page.evaluate(() => window.__stageDebug.spinTo(4)); // spring
await page.waitForFunction(() => !window.__stageDebug.spinning(), { timeout: 3000 });
await page.evaluate(() => { window.__stageVT = undefined; });

// arm the commit (Enter → settled front spring). NO screenshots during the VT —
// CDP screenshotting pauses the compositor and aborts the VT (a capture artifact,
// not a product defect); the payoff burst is captured in a separate run.
await page.$eval(".scene-stage", (e) => e.focus());
await page.keyboard.press("Enter");

await page.waitForFunction(() => window.__stageLastCommit != null, { timeout: 3000 });
await sleep(120);
const vt = await page.evaluate(() => ({
    overlayInDomAtUpdate: window.__stageVT?.overlayInDomAtUpdate,
    lastCommit: window.__stageLastCommit,
    stagePresentNow: !!document.querySelector(".scene-stage"),
    scene: document.querySelector(".scene-host")?.getAttribute("data-scene"),
}));

console.log("VT-name in stage tree (must be []):", JSON.stringify(vtNames));
console.log("__stageVT.overlayInDomAtUpdate (must be false):", vt.overlayInDomAtUpdate);
console.log("committed:", JSON.stringify(vt.lastCommit), "scene:", vt.scene);
console.log("stage present after commit (must be false):", vt.stagePresentNow);
console.log("console errors:", errors);

const pass =
    vtNames.length === 0 &&
    vt.overlayInDomAtUpdate === false &&
    vt.stagePresentNow === false &&
    vt.scene === "spring" &&
    errors.length === 0;
console.log(pass ? "\nVT-FRAME EXIT: PASS" : "\nVT-FRAME EXIT: FAIL");
await b.close();
process.exit(pass ? 0 : 1);
