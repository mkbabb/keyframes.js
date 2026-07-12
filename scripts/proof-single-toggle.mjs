#!/usr/bin/env node
/**
 * proof:single-toggle — H.W1 S8 / BLK-8 (the @mbabb trigger carries ONE toggle).
 *
 * The companion to proof:dock-popover-opens. The double-wrap defect stacked TWO
 * reka triggers on the @mbabb menu (the outer `<DropdownMenuTrigger as-child>` + the
 * inner `<DockDropdownTrigger>`, itself a reka trigger). The wave names this
 * `handlerCount:2` — two toggles bound to one menu. S8 leaves exactly ONE.
 *
 * THE OBSERVABLE BITE (measured, not assumed). reka's `as-child` SLOT-MERGES the
 * outer trigger onto the inner button, so the double-wrap renders ONE DOM node with
 * ONE click listener (verified: CDP `getEventListeners` reports `click:1` on BOTH
 * the broken and the fixed build, and only ONE `[aria-label="@mbabb menu"]` node
 * exists either way). A DOM-node / listener COUNT therefore cannot discriminate the
 * defect — both builds report 1. What the two stacked toggles actually do is
 * DESYNC the latch: the doubled binding swallows the open so the trigger never
 * latches (measured round-trip on the broken build: `false→false→false→false`; on
 * the fixed build: `false→true→false→true`). So the browser clause asserts the
 * FUNCTIONAL signature of a single, clean toggle — a SYMMETRIC open/close round-trip
 * across successive clicks — which is exactly what a doubled toggle cannot produce.
 *
 * Two falsifiable clauses, each BITING on the exact defect:
 *
 *   1. SOURCE-SHAPE (STATIC — always runs, the deterministic structural bite). In
 *      `App.vue`'s @mbabb <DropdownMenu> block there is EXACTLY ONE trigger element —
 *      a single `<DockDropdownTrigger>` — and ZERO `<DropdownMenuTrigger>` wrappers.
 *      BITE: add back the outer `<DropdownMenuTrigger>` (trigger count → 2) → reds.
 *      This is the canonical `handlerCount:2` source-shape signature.
 *
 *   2. CLEAN-TOGGLE-LATCH (BROWSER — runs when playwright resolves + dist is built).
 *      Expand the dock, find the @mbabb trigger, then CLICK it three times asserting
 *      a symmetric latch: `false → true → false → true` (one toggle, in sole
 *      control). BITE: the double-wrap's stacked toggles desync the latch — the
 *      trigger never reaches `true` (`false→false→false→false`, measured); a
 *      single-toggle build round-trips cleanly. Greens only when exactly one toggle
 *      governs the menu.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1). The @mbabb trigger is dock CHROME
 * (no scene nav needed). Under KF_REQUIRE_BROWSER a playwright-absent skip becomes
 * a hard fail AT THE LIB SEAM. Re-runnable: `node scripts/proof-single-toggle.mjs`.
 * The browser half serves the BUILT dist/gh-pages/ (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "./lib/demo-driver.mjs";

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

console.log("proof:single-toggle — H.W1 S8/BLK-8 (the @mbabb trigger carries exactly one toggle)");

// ── 1. SOURCE-SHAPE (static, always runs) ────────────────────────────────────
{
    // Strip HTML comments first — the S8 fix is DOCUMENTED in a comment naming the
    // dropped `<DropdownMenuTrigger` wrapper; the tag-count must not see the prose.
    // The @mbabb menu markup lives in app/dock/MbabbMenu.vue since
    // S.D1 (extracted out of App.vue — a23 F2).
    const menu = read(path.join(DEMO, "app/dock/MbabbMenu.vue")).replace(/<!--[\s\S]*?-->/g, "");

    // Isolate the @mbabb <DropdownMenu> block (open tag → its </DropdownMenu>).
    const menuOpen = menu.indexOf("<DropdownMenu");
    const menuClose = menu.indexOf("</DropdownMenu>", menuOpen);
    const block = menuOpen !== -1 && menuClose !== -1 ? menu.slice(menuOpen, menuClose) : "";

    const dockTriggers = (block.match(/<DockDropdownTrigger\b/g) ?? []).length;
    const outerTriggers = (block.match(/<DropdownMenuTrigger\b/g) ?? []).length;
    const totalTriggers = dockTriggers + outerTriggers;

    if (totalTriggers === 1 && dockTriggers === 1) {
        ok("MbabbMenu.vue @mbabb block has exactly ONE trigger (a single <DockDropdownTrigger>, no outer wrap)");
    } else {
        fail(
            `MbabbMenu.vue @mbabb block must hold exactly ONE trigger — found ${totalTriggers} ` +
                `(${dockTriggers}× DockDropdownTrigger + ${outerTriggers}× DropdownMenuTrigger). ` +
                "The outer DropdownMenuTrigger wrap stacks a second toggle (handlerCount:2, BLK-8).",
        );
    }
}

// ── 2. CLEAN-TOGGLE-LATCH (browser, gated) ───────────────────────────────────
async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the clean-toggle-latch round-trip",
            context: { viewport: { width: 1280, height: 900 } },
        },
        async (page, { url }) => {
        await page.goto(`${url}/#/cube`, { waitUntil: "load" });

        const TRIGGER = '[aria-label="@mbabb menu"]';
        let expanded = false;
        for (let i = 0; i < 30 && !expanded; i++) {
            try {
                // Hover the .glass-dock that OWNS the @mbabb trigger (the top dock) and
                // DWELL — holding the pointer on the dock (no leave) lets the glass-ui
                // 4.0.0 60ms hover-intent commit the expand. Moving the pointer away
                // (the old mouse.move(640,870)) re-arms the dock-flicker cancel before
                // the dwell commits, so the trigger never surfaces. This mirrors the
                // proof:dock-popover-opens actuation; the toggle assertion is unchanged.
                const ownerDock = page
                    .locator(".glass-dock")
                    .filter({ has: page.locator(TRIGGER) })
                    .first();
                const dock = (await ownerDock.count())
                    ? ownerDock
                    : page.locator(".glass-dock").first();
                if (await dock.count()) await dock.hover({ force: true }).catch(() => {});
                await page.waitForTimeout(250);
                expanded = await page
                    .locator(TRIGGER)
                    .first()
                    .isVisible()
                    .catch(() => false);
            } catch {
                /* re-poll */
            }
            if (!expanded) await page.waitForTimeout(150);
        }

        if (!expanded) {
            fail(
                "single-toggle — the @mbabb trigger never became visible after expanding the dock " +
                    "(cannot exercise its toggle latch)",
            );
        } else {
            const trigger = page.locator(TRIGGER).first();
            const expandedNow = async () => (await trigger.getAttribute("aria-expanded")) === "true";

            // A single, in-sole-control toggle latches symmetrically: rest closed,
            // click → open, click → closed, click → open. The double-wrap's stacked
            // toggles swallow the open (measured: false→false→false), so the latch
            // never reaches `true` on any click.
            const latch = [];
            latch.push(await expandedNow()); // rest
            for (let i = 0; i < 3; i++) {
                await trigger.click();
                await page.waitForTimeout(250);
                latch.push(await expandedNow());
            }

            // The clean single-toggle signature: [false, true, false, true].
            const clean =
                latch[0] === false &&
                latch[1] === true &&
                latch[2] === false &&
                latch[3] === true;
            const seq = latch.map((b) => (b ? "open" : "closed")).join("→");
            if (clean) {
                ok(`clean toggle latch — successive clicks round-trip symmetrically (${seq})`);
            } else {
                fail(
                    `clean toggle latch — successive clicks did NOT round-trip symmetrically ` +
                        `(${seq}; expected closed→open→closed→open). A doubled toggle (the outer ` +
                        "<DropdownMenuTrigger> wrap) swallows the open so the latch never sets " +
                        "(handlerCount:2, BLK-8); drop the outer wrapper.",
                );
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
        `\nproof:single-toggle — FAIL (${failures.length}): the @mbabb trigger carries more ` +
            `than one toggle handler (the double-wrap stacks two — D9/BLK-8).`,
    );
    process.exit(1);
}
console.log("\nproof:single-toggle — PASS: the @mbabb trigger carries exactly one toggle (S8).");
