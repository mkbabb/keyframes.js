import { createRequire } from "module";
import { openPage, openStage, sleep } from "./lib.mjs";
const req = createRequire("/Users/mkbabb/Programming/glass-ui/package.json");
const { chromium } = req("playwright-core");

// Round-3 shots → the v3 dir (B1/B2/B3 re-proof of the verbatim offenders).
const SHOTS =
    "/Users/mkbabb/Programming/keyframes.js/docs/tranches/S/audit/pass3/proto-shots-v3";

const b = await chromium.launch({
    headless: true,
    args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"],
});

// Read the per-card FACE state — the occlusion witness. A card is "face-visible"
// when its nameplate opacity is non-trivial; an occluded card's whole face
// (plate + poster/preview) must be ~0 so nothing bleeds through the nearer shell.
async function faces(page) {
    return page.$$eval(".stage-card", (cards) =>
        cards
            .map((c) => {
                const plate = c.querySelector(".stage-card__plate");
                const poster = c.querySelector(".stage-card__poster");
                const preview = c.querySelector(".stage-card__preview");
                const previewShown =
                    !!preview && getComputedStyle(preview).display !== "none";
                return {
                    id: c.getAttribute("data-stage-card"),
                    front: c.getAttribute("data-front") === "true",
                    plateOpacity: plate
                        ? Number(getComputedStyle(plate).opacity)
                        : null,
                    posterOpacity: poster
                        ? Number(getComputedStyle(poster).opacity)
                        : null,
                    previewShown,
                };
            })
            .filter((f) => f.plateOpacity != null),
    );
}

const results = [];
function assertOcclusion(label, faceList, maxVisible) {
    const visible = faceList.filter((f) => (f.plateOpacity ?? 0) > 0.1);
    const occluded = faceList.filter((f) => (f.plateOpacity ?? 0) <= 0.1);
    // every occluded card must have BOTH plate and any poster ~0 (no bleed), and
    // no more than `maxVisible` face-visible cards (front + immediate flanks).
    const posterClean = occluded.every((f) => (f.posterOpacity ?? 0) <= 0.12);
    const pass = visible.length <= maxVisible && posterClean;
    results.push({ label, pass });
    console.log(
        `[${pass ? "PASS" : "FAIL"}] ${label}: visibleFaces=${visible
            .map((f) => f.id)
            .join(",")} (≤${maxVisible}); occluded=${occluded
            .map((f) => `${f.id}:${(f.plateOpacity ?? 0).toFixed(2)}/${(f.posterOpacity ?? 0).toFixed(2)}`)
            .join(" ")}`,
    );
}

async function ctx(name, opts, maxVisible) {
    const { page, errors } = await openPage(b, opts);
    await openStage(page);
    await sleep(280); // fan-in settle + previews tick

    // BROWSE — the offender family (Square-over-Amiga / Path-over-Morph /
    // flank-through-front on mobile). Assert + shoot.
    assertOcclusion(`${name}-browse`, await faces(page), maxVisible);
    await page.screenshot({ path: `${SHOTS}/${name}-browse.png` });

    // COMMITTING — spin to spring(4), arm, capture at ~150ms into the dwell
    // (flare + press + bloom). The B3 offender (residual Square behind Easing) +
    // the Square-over-Easing bleed both live here.
    await page.evaluate(() => window.__stageDebug.spinTo(4));
    await page.waitForFunction(() => !window.__stageDebug.spinning(), {
        timeout: 3000,
    });
    await page.$eval(".scene-stage", (e) => e.focus());
    await page.keyboard.press("Enter");
    await sleep(150);
    assertOcclusion(`${name}-committing`, await faces(page), maxVisible);
    await page.screenshot({ path: `${SHOTS}/${name}-committing.png` });

    // ENTERED — the grown scene after the VT.
    await page.waitForFunction(() => window.__stageLastCommit != null, {
        timeout: 3000,
    });
    await sleep(650);
    await page.screenshot({ path: `${SHOTS}/${name}-entered.png` });
    console.log(`${name}: errors=${errors.length}`);
    await page.close();
}

await ctx("dark", { theme: "dark", width: 1440, height: 900 }, 3);
await ctx("light", { theme: "light", width: 1440, height: 900 }, 3);
await ctx("mobile", { theme: "dark", width: 390, height: 844 }, 1);

await b.close();
console.log("\n===== SHOTS-V3 OCCLUSION SUMMARY =====");
for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.label}`);
const all = results.every((r) => r.pass);
console.log(all ? "\nALL OCCLUSION CLAUSES GREEN" : "\nSOME OCCLUSION CLAUSES RED");
process.exit(all ? 0 : 1);
