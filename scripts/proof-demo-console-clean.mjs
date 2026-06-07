#!/usr/bin/env node
/**
 * proof:demo-console-clean — H.W0 (kill the live console crashes).
 *
 * H.W0 owns H-A1 (the `serializeEasing` throw). The gate is precise: it bites on
 * the EXACT H-A1 signature, NOT a blanket "0 console errors" (the H-A2 route-storm
 * noise is H.W1's domain — `proof:no-route-storm` greens the broad home→scene
 * console once the FSM lands; the H-A2 typed-selector belt is locked by
 * `test/w0-crashes.test.ts`).
 *
 *   1. SOURCE-SHAPE (STATIC — always runs). The two demo seams no longer pass a
 *      bare custom `TimingFunction` closure into a CSS-serialized animation, and
 *      the bottom-bar readout has a try/catch floor:
 *        • the easing `contractAnim` passes the CSS-string twin (not the bare
 *          `currentEasingFn.value` closure);
 *        • `useAmigaAnimations.ts` passes no `timingFunction: CSSCubicBezier(`;
 *        • `KeyframesStringControls.vue` wraps `CSSKeyframesToString` in try/catch
 *          (the placeholder floor — never a silent `linear`).
 *      BITE: revert any seam to the bare closure / drop the try/catch → reds.
 *
 *   2. NO H-A1 THROW (BROWSER — runs when playwright resolves + dist is built).
 *      Rest on `/#/amiga` and `/#/easing` (the routes whose mounted Keyframes-
 *      string editor serializes a cubic-bezier-closure animation) and assert ZERO
 *      console errors matching the H-A1 `serializeEasing` signature ("no CSS
 *      animation-timing-function representation"). BITE: revert the string twin →
 *      `serializeEasing` throws on mount → the signature reappears → reds.
 *
 * Mirrors scripts/proof-demo-usability.mjs (the serveDist + Playwright plumbing).
 * Re-runnable: `node scripts/proof-demo-console-clean.mjs`. The browser half
 * serves the BUILT dist/gh-pages/ (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const read = (p) => fs.readFileSync(p, "utf8");

console.log("proof:demo-console-clean — H.W0 (kill the H-A1 serializeEasing crash)");

// ── 1. SOURCE-SHAPE (static, always runs) ────────────────────────────────────
{
    const easing = read(path.join(DEMO, "easing/useEasingDemo.ts"));
    // The contractAnim block: it must not feed the bare `currentEasingFn.value`
    // closure as its `timingFunction` (the bare closure has no CSS twin → throw).
    const contractBlock = easing.slice(easing.indexOf("const contractAnim"));
    if (/timingFunction:\s*currentEasingFn\.value/.test(contractBlock)) {
        fail(
            "easing contractAnim passes the bare `currentEasingFn.value` closure — " +
                "serializeEasing throws on it (H-A1); pass the CSS-string twin (`cssValue.value`)",
        );
    } else {
        ok("easing contractAnim does not feed a bare easing closure to the CSS readout");
    }

    const amiga = read(path.join(DEMO, "amiga/useAmigaAnimations.ts"));
    if (/timingFunction:\s*CSSCubicBezier\(/.test(amiga)) {
        fail(
            "useAmigaAnimations.ts passes `timingFunction: CSSCubicBezier(...)` (a bare " +
                "closure with no CSS twin → serializeEasing throws, H-A1); pass the " +
                '`"cubic-bezier(...)"` string twin',
        );
    } else {
        ok("useAmigaAnimations.ts passes no bare CSSCubicBezier closure as a timingFunction");
    }

    const readout = read(
        path.join(
            DEMO,
            "@/components/custom/animation-controls/keyframes/KeyframesStringControls.vue",
        ),
    );
    // The readout call must be inside a try/catch whose catch assigns the custom
    // placeholder (NOT a silent `linear` STRING assignment — the word "linear" may
    // appear in an explanatory comment, so forbid the ASSIGNMENT, not the token).
    const callIdx = readout.indexOf("CSSKeyframesToString(");
    const tryIdx = readout.lastIndexOf("try {", callIdx);
    const catchAfter = readout.indexOf("catch", callIdx);
    const catchBlock = catchAfter !== -1 ? readout.slice(catchAfter, catchAfter + 600) : "";
    const assignsCustom = /cssKeyframesString\.value\s*=\s*[`"'][^`"']*custom/.test(catchBlock);
    const silentLinear = /cssKeyframesString\.value\s*=\s*[`"']\s*linear/.test(catchBlock);
    const hasFloor =
        tryIdx !== -1 && catchAfter !== -1 && callIdx > tryIdx && assignsCustom && !silentLinear;
    if (hasFloor) {
        ok("KeyframesStringControls readout has the try/catch floor (custom placeholder, no silent linear)");
    } else {
        fail(
            "KeyframesStringControls readout must wrap CSSKeyframesToString in try/catch and " +
                "render a `/* timing-function: custom */` placeholder — never a silent `linear`",
        );
    }
}

// ── 2. NO H-A1 THROW (browser, gated) ────────────────────────────────────────
const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(`browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — the H-A1 throw cannot pass vacuously`);
    } else {
        console.log(`  ○ browser half skipped — ${reason}`);
    }
};

// The exact H-A1 throw message fragment (from AnimationOptionError on a bare
// custom timingFunction): "no CSS animation-timing-function representation".
const HA1_SIGNATURE = /no CSS animation-timing-function representation|has no CSS animation-timing-function/i;

async function browserHalf() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        skipOrFail("dist/gh-pages not built (run `npm run gh-pages` first)");
        return;
    }
    let chromium;
    try {
        const requireFrom = createRequire(
            path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
        );
        ({ chromium } = requireFrom("playwright-core"));
    } catch {
        try {
            const requireFrom = createRequire(
                path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
            );
            ({ chromium } = requireFrom("@playwright/test"));
        } catch {
            skipOrFail("playwright not resolvable (set KF_PLAYWRIGHT_DIR or install @playwright/test)");
            return;
        }
    }

    const MIME = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".ttf": "font/ttf",
        ".woff2": "font/woff2",
        ".svg": "image/svg+xml",
    };
    const server = http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
    await new Promise((r) => server.listen(0, r));
    const port = server.address().port;
    const base = `http://127.0.0.1:${port}`;

    const browser = await chromium.launch();
    try {
        for (const route of ["/#/amiga", "/#/easing"]) {
            const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
            const ha1Errors = [];
            page.on("console", (msg) => {
                if (msg.type() === "error" && HA1_SIGNATURE.test(msg.text())) {
                    ha1Errors.push(msg.text());
                }
            });
            page.on("pageerror", (err) => {
                if (HA1_SIGNATURE.test(String(err?.message ?? err))) {
                    ha1Errors.push(String(err.message));
                }
            });
            await page.goto(`${base}${route}`, { waitUntil: "load" });
            // Let the scene + its (lazy) Keyframes-string readout mount + serialize.
            await page.waitForTimeout(2500);
            if (ha1Errors.length === 0) {
                ok(`no H-A1 serializeEasing throw resting on ${route}`);
            } else {
                fail(
                    `H-A1 serializeEasing throw on ${route} — ${ha1Errors.length} occurrence(s): ` +
                        ha1Errors[0].slice(0, 120),
                );
            }
            await page.close();
        }
    } finally {
        await browser.close();
        server.close();
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:demo-console-clean — FAIL (${failures.length}): the H-A1 serializeEasing ` +
            `crash is live (or the readout floor regressed).`,
    );
    process.exit(1);
}
console.log("\nproof:demo-console-clean — PASS: the H-A1 serializeEasing crash is dead (H.W0).");
