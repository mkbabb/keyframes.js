import { launch, openPage, openStage, sleep } from "./lib.mjs";
const b = await launch();
const { page } = await openPage(b, { theme: "dark", hash: "#cube", width: 1440, height: 900 });
await openStage(page);
await sleep(300);

const g = await page.evaluate(() => {
    const stage = document.querySelector(".scene-stage");
    const ring = document.querySelector(".carousel-ring");
    const vp = document.querySelector(".carousel-viewport");
    const cards = [...document.querySelectorAll("[data-stage-card]")];
    const rect = (el) => el.getBoundingClientRect();
    const byId = (id) => cards.find((c) => c.getAttribute("data-stage-card") === id);
    const anyVtName = [...document.querySelectorAll(".scene-stage, .scene-stage *")]
        .some((el) => { const n = getComputedStyle(el).viewTransitionName; return n && n !== "none"; });
    const opac = cards.map((c) => parseFloat(getComputedStyle(c).opacity));
    const front = byId("cube"), back = byId("easing"); // easing is the far card (slot 4 from cube)
    return {
        bodyChild: stage?.parentElement === document.body,
        anyVtName,
        ringTransform: getComputedStyle(ring).transform,
        perspective: getComputedStyle(vp).perspective,
        frontTop: rect(front).top,
        backTop: rect(back).top,
        widths: ["cube","amiga","square","easing"].map((id)=>+rect(byId(id)).width.toFixed(0)),
        minOpacity: Math.min(...opac),
    };
});

// rotateX(-15deg) → matrix3d with cos15≈0.966, sin15≈0.259 in the y/z terms
const m = g.ringTransform.match(/matrix3d\(([^)]+)\)/);
const nums = m ? m[1].split(",").map(Number) : [];
const cos15 = Math.abs(nums[5] - 0.9659) < 0.02;
const negTilt = nums[6] < 0; // back higher → rotateX NEGATIVE
const checks = {
    "overlay is a direct body child": g.bodyChild === true,
    "NO view-transition-name anywhere in stage tree": g.anyVtName === false,
    "ring rotateX(-15deg) (cos15 term + negative tilt)": cos15 && negTilt,
    "perspective 1100px": g.perspective === "1100px",
    "back card higher than front (back.top < front.top)": g.backTop < g.frontTop,
    "width recede monotone front→back": g.widths[0] > g.widths[1] && g.widths[1] > g.widths[3],
    "min card opacity >= 0.4 (never vanishes)": g.minOpacity >= 0.4,
};
console.log("GEOMETRY (at-rest, dark @1440):");
console.log(JSON.stringify(g, null, 1));
for (const [k, v] of Object.entries(checks)) console.log(`  ${v ? "PASS" : "FAIL"}  ${k}`);

// ── D11 during-commit clause: overlay absent from live DOM by update-callback end
await page.evaluate(() => { window.__stageVT = undefined; });
await page.evaluate(() => window.__stageDebug.spinTo(3));
await page.waitForFunction(() => !window.__stageDebug.spinning(), { timeout: 3000 });
await page.$eval(".scene-stage", (e) => e.focus());
await page.keyboard.press("Enter");
await page.waitForFunction(() => window.__stageLastCommit != null, { timeout: 3000 });
await sleep(100);
const dc = await page.evaluate(() => ({
    overlayInDomAtUpdate: window.__stageVT?.overlayInDomAtUpdate,
    stageNow: !!document.querySelector(".scene-stage"),
}));
const dcPass = dc.overlayInDomAtUpdate === false && dc.stageNow === false;
console.log("\nDURING-COMMIT clause (D11 / D2):", JSON.stringify(dc));
console.log(`  ${dcPass ? "PASS" : "FAIL"}  overlay absent from live DOM by the end of the VT update callback`);

const allPass = Object.values(checks).every(Boolean) && dcPass;
console.log(allPass ? "\nGEOMETRY GATE: PASS" : "\nGEOMETRY GATE: FAIL");
await b.close();
process.exit(allPass ? 0 : 1);
