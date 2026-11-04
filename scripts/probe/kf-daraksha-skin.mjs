/**
 * The Daraksha cube skin, in a real browser: chosen through the @mbabb menu's
 * radio group (the one writer), its faces read back hue-exact, the unfurl
 * caught mid-flight and released at rest, the Hover channel swaying.
 *
 * Run ONLY through the machine guard, never --light (it launches a browser):
 *   ~/.claude/guard/guarded --timeout 15 -- node scripts/probe/kf-daraksha-skin.mjs \
 *       --base http://localhost:4179/ --out ~/.dev-logs/daraksha-kf/run.json [--shots DIR]
 *
 * One browser per run, a new context per cell, every context and the browser
 * closed in `finally`. Playwright resolves from PLAYWRIGHT_MODULE, else from
 * value.js's node_modules (keyframes.js does not depend on it). The default
 * headless shell; no window capture.
 *
 * Cells: 1440x900 and 390x844, each in light and dark. Per cell: select
 * Daraksha in the menu, read `data-cube-skin`, the six face fills' computed
 * background and ink, every fill's inline style mid-unfurl and at rest, and
 * the `.cube-bob` transform over time (the sway). `--deeplink` also opens a
 * fresh context on the `?state=` share link that seeds the skin.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const arg = (name, dflt) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > 0 ? process.argv[i + 1] : dflt;
};
const BASE = arg("base", "http://localhost:4179/").replace(/\/?$/, "/");
const OUT = arg("out", null);
const SHOTS = arg("shots", null);
const PW = process.env.PLAYWRIGHT_MODULE ?? "/Users/mkbabb/Programming/value.js/node_modules/playwright/index.mjs";
const { chromium } = await import(PW);

const ONLY = arg("only", null);
const CELLS_ALL = [
    { w: 1440, h: 900, scheme: "light" },
    { w: 1440, h: 900, scheme: "dark" },
    { w: 390, h: 844, scheme: "light" },
    { w: 390, h: 844, scheme: "dark" },
];
const CELLS = ONLY ? CELLS_ALL.filter((c) => `${c.w}x${c.h}-${c.scheme}` === ONLY) : CELLS_ALL;

/** The skin's register, face order front..bottom (CubeTarget.css). */
const EXPECT_FACES = ["efflorescence", "haldi", "tulsi", "zari", "gulabi", "sheesham"];

/** The share-link state that seeds the cube bucket's skin (hashSharing.ts). */
export const deepLinkState = () =>
    Buffer.from(
        encodeURIComponent(JSON.stringify({ controls: { cube: { cubeSkin: "daraksha" } }, activeScene: "cube" })),
    ).toString("base64");

function readDie() {
    const bob = document.querySelector(".cube-bob");
    const fills = [...document.querySelectorAll(".cube-side > .face-fill")];
    const sides = [...document.querySelectorAll(".cube-side")];
    return {
        skin: bob?.getAttribute("data-cube-skin") ?? null,
        bobTransform: bob ? getComputedStyle(bob).transform : null,
        bobOrigin: bob ? getComputedStyle(bob).transformOrigin : null,
        faces: fills.map((f) => {
            const cs = getComputedStyle(f);
            return {
                bg: cs.backgroundColor,
                ink: cs.color,
                origin: cs.transformOrigin,
                inlineTransform: f.style.transform,
                inlineOpacity: f.style.opacity,
            };
        }),
        sideInline: sides.map((s) => s.style.transform),
        frontToken: bob ? getComputedStyle(bob).getPropertyValue("--face-1").trim() : null,
    };
}

async function chooseDaraksha(page) {
    // The dock rests collapsed (its labels are not hit-testable then): a
    // pointer over the dock's plate wakes it, as a person's does, and the
    // press lands at the trigger's settled centre (the docket probe's idiom).
    const trig = page.locator('[aria-label="@mbabb menu"]').first();
    const dock = page.locator(".glass-dock").filter({ has: trig }).first();
    const db = await dock.boundingBox();
    await page.mouse.move(db.x + db.width / 2, db.y + db.height / 2);
    await page.waitForTimeout(1200);
    let bb = await trig.boundingBox();
    await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await page.waitForTimeout(1200);
    bb = await trig.boundingBox();
    await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
    const item = page.getByRole("menuitemradio", { name: /Daraksha/ });
    await item.waitFor({ state: "visible", timeout: 5000 });
    const shotMenu = SHOTS ? join(SHOTS, `menu-${page.viewportSize().width}.png`) : null;
    await item.click();
    const checked = await item.getAttribute("aria-checked");
    if (shotMenu) await page.screenshot({ path: shotMenu });
    // Close by the trigger, not Escape: the transport binds Escape to Stop
    // (useControlsKeyboardShortcuts), which would rewind the die mid-proof.
    bb = await trig.boundingBox();
    await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
    return checked;
}

const rows = [];
let browser;
try {
    browser = await chromium.launch();
    for (const cell of CELLS) {
        const ctx = await browser.newContext({
            viewport: { width: cell.w, height: cell.h },
            colorScheme: cell.scheme,
        });
        const errors = [];
        try {
            const page = await ctx.newPage();
            page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
            page.on("pageerror", (e) => errors.push(String(e)));
            await page.goto(`${BASE}#/cube`, { waitUntil: "networkidle" });
            await page.waitForSelector(".cube-side > .face-fill", { timeout: 15000 });
            // The app's own theme follows the stored preference; set the dark
            // class to match the cell (glass-ui's `.dark` root idiom).
            await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), cell.scheme === "dark");
            await page.waitForTimeout(800);
            const before = await page.evaluate(readDie);
            const checked = await chooseDaraksha(page);
            await page.waitForTimeout(120);
            const mid = await page.evaluate(readDie);
            const tag = `${cell.w}x${cell.h}-${cell.scheme}`;
            if (SHOTS) await page.screenshot({ path: join(SHOTS, `unfurl-mid-${tag}.png`) });
            await page.waitForTimeout(2200);
            const rest = await page.evaluate(readDie);
            if (SHOTS) await page.screenshot({ path: join(SHOTS, `daraksha-${tag}.png`) });
            const sway = [];
            for (let i = 0; i < 6; i++) {
                sway.push(await page.evaluate(() => getComputedStyle(document.querySelector(".cube-bob")).transform));
                await page.waitForTimeout(500);
            }
            const restFrontBg = rest.faces[0]?.bg ?? null;
            rows.push({
                cell: tag,
                beforeSkin: before.skin,
                radioChecked: checked,
                skin: rest.skin,
                frontToken: rest.frontToken,
                restFrontBg,
                faces: rest.faces.map((f, i) => ({ name: EXPECT_FACES[i], bg: f.bg, ink: f.ink })),
                midInlineFills: mid.faces.filter((f) => f.inlineTransform !== "").length,
                restInlineFills: rest.faces.filter((f) => f.inlineTransform !== "" || f.inlineOpacity !== "").length,
                sideInlineWrites: rest.sideInline.filter((t) => t !== "").length,
                bobOrigin: rest.bobOrigin,
                swayDistinct: new Set(sway).size,
                swaySamples: sway,
                bobBefore: before.bobTransform,
                errors,
            });
        } finally {
            await ctx.close();
        }
    }

    if (process.argv.includes("--deeplink")) {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        try {
            const page = await ctx.newPage();
            const errors = [];
            page.on("pageerror", (e) => errors.push(String(e)));
            await page.goto(`${BASE}#/cube?state=${deepLinkState()}`, { waitUntil: "networkidle" });
            await page.waitForSelector(".cube-side > .face-fill", { timeout: 15000 });
            await page.waitForTimeout(2500);
            const rest = await page.evaluate(readDie);
            rows.push({ cell: "deeplink-1440", url: page.url(), skin: rest.skin, restFrontBg: rest.faces[0]?.bg, restInlineFills: rest.faces.filter((f) => f.inlineTransform !== "").length, errors });
        } finally {
            await ctx.close();
        }
    }
} finally {
    await browser?.close();
}

const json = JSON.stringify(rows, null, 2);
if (OUT) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, json);
}
console.log(json);
