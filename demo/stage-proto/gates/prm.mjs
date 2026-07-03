import { launch, openPage, sleep, SHOTS } from "./lib.mjs";
const b = await launch();

// PRM emulated via playwright reducedMotion:'reduce' (→ the media query the
// composables' usePreferredReducedMotion / respectReducedMotion read).
const { page, errors } = await openPage(b, {
    theme: "dark",
    reducedMotion: "reduce",
    hash: "#cube",
});

// open — under PRM the zoom-out + fan-in SNAP (0ms); the look survives, motion doesn't
const tOpen = Date.now();
await page.click('[data-testid="scene-pill"]');
await page.waitForFunction(
    () => document.querySelector(".scene-stage")?.getAttribute("data-stage-phase") === "carousel",
    { timeout: 3000 },
);
const openMs = Date.now() - tOpen;
await sleep(150);
await page.screenshot({ path: `${SHOTS}/prm-carousel.png` });

// arm a commit — under PRM the 280ms dwell is 0; fire is immediate
await page.evaluate(() => { window.__stageArmedLog = []; window.__stageLastCommit = undefined; });
await page.$eval(".scene-stage", (e) => e.focus());
const tArm = Date.now();
await page.keyboard.press("Enter");
await page.waitForFunction(() => window.__stageLastCommit != null, { timeout: 2000 });
const commitMs = Date.now() - tArm;
await sleep(600);
await page.screenshot({ path: `${SHOTS}/prm-entered.png` });
const obs = await page.evaluate(() => ({
    committed: window.__stageLastCommit?.id,
    armedLog: window.__stageArmedLog,
    scene: document.querySelector(".scene-host")?.getAttribute("data-scene"),
}));

console.log("PRM open→carousel ms (snap, expect small):", openMs);
console.log("PRM arm→commit ms (dwell=0, expect small):", commitMs);
console.log("committed:", obs.committed, "scene:", obs.scene);
console.log("armedLog causes:", obs.armedLog.map((e) => e.cause));
console.log("errors:", errors);
// under PRM the commit fires without the 280ms payoff dwell
const pass = commitMs < 200 && obs.committed === "cube" && obs.scene === "cube" && errors.length === 0;
console.log(pass ? "\nPRM SNAP: PASS" : "\nPRM SNAP: FAIL");
await b.close();
process.exit(pass ? 0 : 1);
