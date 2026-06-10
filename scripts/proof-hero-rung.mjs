#!/usr/bin/env node
/**
 * proof:hero-rung — H.W4 S3 (the LARGER + golden lock) the hero φ-rung.
 *
 * The defect (live, 1440×900, `/`): the hero `<h1>` was on the MIDDLE φ rung
 * `text-display-4` (computed 86.1px), while glass-ui ships the audacious tier
 * `text-display-mega` (φ^(9/2), peak 177px) built precisely for poster heroes.
 * S3 bumps the hero one rung into the audacious tier.
 *
 * The gate pins BOTH a SOURCE-SHAPE check AND a PX FLOOR at a fixed viewport — NOT
 * a `>= --type-display-mega` clamp comparison. `--type-display-mega` =
 * `clamp(5.382rem, 4rem+9vw, 11.089rem)` is viewport-dependent, so comparing two
 * FLUID values flaps at narrow widths; instead assert (a) the resolved class is
 * `text-display-mega` (static, flake-free) AND (b) a computed `font-size >= 140px`
 * at 1440×900 (the mega rung resolves 177.4px there; the middle `text-display-4`
 * resolved 86px — below the floor), PLUS the leaf-tail regex (no `text-\d?xl`, no
 * arbitrary `text-[Npx]` on the hero — the hero carries ONLY the φ rung).
 *
 * Three falsifiable clauses:
 *
 *   1. SOURCE-SHAPE — the hero `<h1>` className contains `text-display-mega` AND
 *      NOT `text-display-4` (BROWSER — the resolved live className; also the
 *      STATIC source carries it). BITE: revert to `text-display-4` → reds.
 *
 *   2. PX FLOOR — computed `font-size >= 140px` at 1440×900 (BROWSER). BITE: the
 *      middle `text-display-4` rung resolves 86px (< 140) → reds; any sub-mega
 *      rung reds.
 *
 *   3. LEAF-TAIL REGEX — the hero `<h1>` className carries NO raw Tailwind rung
 *      (`text-\d?xl` / `text-(xs|sm|base)`) and NO arbitrary `text-[Npx]` literal
 *      (STATIC over the source + BROWSER over the resolved className). BITE: add a
 *      `text-2xl` or `text-[120px]` beside the rung → reds (the hero stays on the
 *      φ ladder, no leaf-tail).
 *
 * Settle-gated on the H.W1 FSM resting (WV-W4-LOW-1 / HD-W4-6): the home hero is
 * the `#start-screen` slot gated on `isHome`; the D12 storm made `/` non-
 * deterministic pre-H.W1. The gate polls the machine to rest on `home` + the hero
 * `<h1>.hero-display` to render before measuring.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1) + the hero-at-`/` poll. The
 * STATIC source clauses always run; the BROWSER half gates on playwright + a
 * built dist, a skip → hard fail under KF_REQUIRE_BROWSER AT THE LIB SEAM.
 * Re-runnable: `node scripts/proof-hero-rung.mjs`. Serves the BUILT dist/gh-pages/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCENE_MACHINE_KEY, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DIST = path.join(REPO, "dist/gh-pages");
const HERO = path.join(DEMO, "@/components/custom/editor-shell/EditorStartScreen.vue");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const read = (p) => fs.readFileSync(p, "utf8");

// Blank /* … */ + // … comments (preserving length) so a doc-comment that NAMES a
// deleted rung (e.g. "`text-display-4` (86px, the middle rung) → …") does not
// false-positive — only LIVE markup counts. (Mirrors proof-idioms.mjs.)
const blankComments = (s) =>
    s
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));

console.log("proof:hero-rung — H.W4 S3 (the hero on the audacious φ rung)");

// The leaf-tail raw rungs the hero must NOT carry (a φ-hero on the ladder uses a
// `text-display-*` token, never a raw Tailwind rung or an arbitrary px literal).
const RAW_RUNG = /\btext-(?:xs|sm|base|lg|\d?xl)\b/;
const ARB_PX = /\btext-\[[^\]]*px[^\]]*\]/;

// ── STATIC source clauses (always run) ───────────────────────────────────────
let heroH1Class = null;
{
    if (!fs.existsSync(HERO)) {
        fail(`source — the hero file is MISSING: ${path.relative(REPO, HERO)}`);
    } else {
        const src = blankComments(read(HERO));
        // The hero <h1> opening tag's class attribute.
        const m = src.match(/<h1\b[^>]*\bclass="([^"]*)"/);
        if (!m) {
            fail("source — could not find the hero <h1 class=\"…\"> opening tag");
        } else {
            heroH1Class = m[1];
            if (/\btext-display-mega\b/.test(heroH1Class)) {
                ok(`source: the hero <h1> carries text-display-mega (class="${heroH1Class}")`);
            } else {
                fail(
                    `source — the hero <h1> does NOT carry text-display-mega ` +
                        `(class="${heroH1Class}"); it is on a sub-mega rung (born-RED: text-display-4)`,
                );
            }
            if (/\btext-display-4\b/.test(heroH1Class)) {
                fail(
                    `source — the hero <h1> still carries the MIDDLE rung text-display-4 ` +
                        `(no legacy beside the replacement — the bump must replace it, not add beside)`,
                );
            } else {
                ok("source: the hero <h1> does NOT carry the middle text-display-4 rung");
            }
            if (RAW_RUNG.test(heroH1Class) || ARB_PX.test(heroH1Class)) {
                fail(
                    `source — the hero <h1> carries a raw leaf-tail rung ` +
                        `(class="${heroH1Class}"); the φ-hero must use only a text-display-* token, ` +
                        `no text-\\d?xl / text-(xs|sm|base) / text-[Npx]`,
                );
            } else {
                ok("source: the hero <h1> carries NO raw leaf-tail rung (text-\\d?xl / text-[Npx])");
            }
        }
    }
}

// ── BROWSER half (the resolved className + the px floor) ──────────────────────
/** Settle on the home route (`/`) — the hero is the `#start-screen` slot gated on
 *  `isHome` (machine activeScene === 'home'). Poll the machine to rest on home +
 *  the hero <h1>.hero-display to render (the D12 storm made `/` non-deterministic
 *  pre-H.W1; WV-W4-LOW-1). Re-assert the viewport AFTER load (Playwright resets). */
async function settleOnHome(page, viewportWidth, viewportHeight) {
    await page
        .waitForFunction(
            (mk) => {
                try {
                    const m = JSON.parse(localStorage.getItem(mk) || "{}");
                    return m.activeScene === "home" && !!document.querySelector("h1.hero-display");
                } catch {
                    return false;
                }
            },
            SCENE_MACHINE_KEY,
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    await page.waitForTimeout(400);
}

async function browserHalf() {
    const VW = 1440;
    const VH = 900;
    const PX_FLOOR = 140; // the mega rung resolves 177.4px @1440; text-display-4 was 86px.
    const result = await withPage(
        {
            distDir: DIST,
            label: "the resolved-className + 140px-floor clauses",
            context: { viewport: { width: VW, height: VH } },
        },
        async (page, { url: base }) => {
        await page.goto(`${base}/`, { waitUntil: "load" });
        await settleOnHome(page, VW, VH);

        const probe = await page.evaluate(() => {
            const h1 = document.querySelector("h1.hero-display") || document.querySelector("h1");
            if (!h1) return { found: false };
            const cs = getComputedStyle(h1);
            return {
                found: true,
                className: h1.className,
                fontSizePx: parseFloat(cs.fontSize),
            };
        });

        if (!probe.found) {
            fail("resolved hero — the hero <h1> did not render at `/` (the FSM may not have rested on home)");
        } else {
            // 1. resolved className carries text-display-mega
            if (/\btext-display-mega\b/.test(probe.className)) {
                ok(`resolved className: the live hero <h1> carries text-display-mega`);
            } else {
                fail(
                    `resolved className — the live hero <h1> does NOT carry text-display-mega ` +
                        `(class="${probe.className}")`,
                );
            }
            // 2. px floor ≥ 140 at 1440×900
            if (probe.fontSizePx >= PX_FLOOR) {
                ok(
                    `px floor: the hero font-size resolves ${probe.fontSizePx.toFixed(1)}px ≥ ${PX_FLOOR}px ` +
                        `at ${VW}×${VH} (the audacious tier — was 86px on the middle text-display-4 rung)`,
                );
            } else {
                fail(
                    `px floor — the hero font-size resolves ${probe.fontSizePx.toFixed(1)}px < ${PX_FLOOR}px ` +
                        `at ${VW}×${VH} (born-RED 86px on text-display-4 — not the mega rung)`,
                );
            }
            // 3. resolved className carries no raw leaf-tail rung
            if (RAW_RUNG.test(probe.className) || ARB_PX.test(probe.className)) {
                fail(
                    `resolved leaf-tail — the live hero <h1> carries a raw rung ` +
                        `(class="${probe.className}"); the φ-hero uses only a text-display-* token`,
                );
            } else {
                ok("resolved leaf-tail: the live hero <h1> carries NO raw leaf-tail rung");
            }
        }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:hero-rung — FAIL (${failures.length}): the hero is not on the audacious ` +
            `text-display-mega φ rung (≥140px @1440), or it carries a raw leaf-tail rung (H.W4 S3).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:hero-rung — PASS: the hero <h1> is on the audacious text-display-mega φ rung " +
        "(≥140px @1440×900), no leaf-tail rung (H.W4 S3).",
);
