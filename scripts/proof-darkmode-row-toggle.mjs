#!/usr/bin/env node
/**
 * proof:darkmode-row-toggle — H.W9 F5 (the whole dark-mode row is the toggle target).
 *
 * The defect (F5): the @mbabb dock menu's dark-mode <DropdownMenuItem> carried only
 * `@select.prevent` (keep-open) and NO row `@click`; only the inner <DarkModeToggle>
 * icon-button flipped the theme. The `<span>Dark mode</span>` label + the row padding
 * gutter were INERT (clicking the text did nothing). The fix adds a row-level
 * `@click="toggleDark()"` (mirroring the ppmycota row precedent below it) AND makes the
 * icon `<DarkModeToggle passive>` a pure INDICATOR (`@click="!passive && toggleDark()"`
 * short-circuits), so the row fires toggleDark EXACTLY ONCE per click — no
 * double-toggle from the icon.
 *
 * Two falsifiable clauses, each BITING on the exact defect:
 *
 *   1. SOURCE-SHAPE (STATIC — always runs). The dark-mode <DropdownMenuItem> carries
 *      a row-level `@click="toggleDark` AND the inner <DarkModeToggle> is `passive`.
 *      BITE: drop the row @click (the F5 defect — only the icon flips) → reds; OR drop
 *      the `passive` prop (the icon re-arms → the row + icon double-toggle) → reds.
 *
 *   2. ROW-LABEL-TOGGLE (BROWSER — runs when playwright resolves + dist is built).
 *      Open the @mbabb dock menu (the proof:dock-popover-opens plumbing), then click
 *      the dark-mode row at its LABEL gutter (the `<span>Dark mode</span>` text, NOT
 *      the icon button) and assert `<html>` `.dark` FLIPS; click the label again →
 *      flips BACK (a symmetric round-trip: dark → light → dark or light → dark →
 *      light), proving exactly ONE toggle per click (no double-toggle). BITE: born-RED
 *      today (clicking the label is a no-op — the theme never changes:
 *      same→same→same); a double-toggle (no `passive`) would also red (the icon's
 *      handler + the row handler cancel → net no-change). Greens only on the
 *      row-level wire + passive icon.
 *
 * Mirrors scripts/proof-dock-popover-opens.mjs (the serveDist + Playwright + dock
 * menu-open plumbing). Settle-gated on the H.W1 FSM resting (the @mbabb trigger is
 * dock CHROME — present on every route, no scene nav needed; cross-ref
 * proof:dock-popover-opens for the menu-open driver). Under KF_REQUIRE_BROWSER a
 * playwright-absent skip becomes a hard fail so the row-toggle is never green-reported
 * un-exercised. Re-runnable: `node scripts/proof-darkmode-row-toggle.mjs`. The browser
 * half serves the BUILT dist/gh-pages/ (run `npm run gh-pages` first).
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

console.log("proof:darkmode-row-toggle — H.W9 F5 (the whole dark-mode row flips the theme)");

// ── 1. SOURCE-SHAPE (static, always runs) ────────────────────────────────────
{
    // Strip HTML comments first — the F5 rationale comment names `passive` + the
    // row @click; the structural clause must read real markup, not the prose.
    const app = read(path.join(DEMO, "app/App.vue")).replace(/<!--[\s\S]*?-->/g, "");

    // Isolate the dark-mode <DropdownMenuItem> block. It is the item that mounts
    // <DarkModeToggle (the stable anchor — the only DarkModeToggle in the menu).
    const dmtAnchor = app.indexOf("<DarkModeToggle");
    let block = "";
    if (dmtAnchor !== -1) {
        const itemOpen = app.lastIndexOf("<DropdownMenuItem", dmtAnchor);
        const itemClose = app.indexOf("</DropdownMenuItem>", dmtAnchor);
        if (itemOpen !== -1 && itemClose !== -1) {
            block = app.slice(itemOpen, itemClose + "</DropdownMenuItem>".length);
        }
    }

    if (!block) {
        fail("could not isolate the dark-mode <DropdownMenuItem> block in App.vue (no <DarkModeToggle> found)");
    } else {
        // (a) the row carries a row-level @click that calls toggleDark. The open
        //     tag is everything up to the first '>' of <DropdownMenuItem ...>.
        const itemOpenTag = block.slice(0, block.indexOf(">") + 1);
        const hasRowClick = /@click\s*=\s*"[^"]*toggleDark/.test(itemOpenTag);
        if (hasRowClick) {
            ok('the dark-mode <DropdownMenuItem> carries a row-level @click="toggleDark()" (the whole row is the target)');
        } else {
            fail(
                'the dark-mode <DropdownMenuItem> has NO row-level @click="toggleDark…" — F5 makes the ' +
                    "whole row the toggle target (the label/gutter click was inert; only the icon flipped)",
            );
        }

        // (b) the inner <DarkModeToggle> is `passive` (a pure indicator — no
        //     double-toggle). Match the passive prop on the DarkModeToggle tag.
        const dmtTag = block.slice(block.indexOf("<DarkModeToggle"));
        const dmtTagOpen = dmtTag.slice(0, dmtTag.indexOf(">") + 1);
        const hasPassive = /\bpassive\b/.test(dmtTagOpen);
        if (hasPassive) {
            ok("<DarkModeToggle passive> — the icon is a pure indicator (its inner toggleDark short-circuits; no double-toggle)");
        } else {
            fail(
                "<DarkModeToggle> is NOT `passive` — without it the icon re-arms its own toggleDark, so the " +
                    "row @click + the icon handler double-toggle (net no-change); add the passive prop (F5)",
            );
        }
    }
}

// ── 2. ROW-LABEL-TOGGLE (browser, gated) ─────────────────────────────────────
const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the row-label-toggle round-trip cannot pass vacuously",
        );
    } else {
        console.log(`  ○ browser half skipped — ${reason}`);
    }
};

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
    const base = `http://127.0.0.1:${server.address().port}`;

    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });

        // The dark-class lives on <html> (glass-ui useGlobalDark → @vueuse useDark,
        // documentElement.classList 'dark'). Helper reads the live class.
        const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));

        // Open the @mbabb dock menu (the proof:dock-popover-opens plumbing): expand
        // the collapsed dock by hovering, then click the @mbabb trigger.
        const TRIGGER = '[aria-label="@mbabb menu"]';
        let expanded = false;
        for (let i = 0; i < 30 && !expanded; i++) {
            try {
                const dock = page.locator(".z-dock, [class*='z-dock']").first();
                if (await dock.count()) await dock.hover({ force: true }).catch(() => {});
                await page.mouse.move(640, 870);
                await page.waitForTimeout(150);
                expanded = await page.locator(TRIGGER).first().isVisible().catch(() => false);
            } catch {
                /* re-poll */
            }
            if (!expanded) await page.waitForTimeout(150);
        }

        if (!expanded) {
            fail(
                "darkmode-row-toggle — the @mbabb trigger never became visible after expanding the dock " +
                    "(cannot open the menu to reach the dark-mode row)",
            );
            await page.close();
            return;
        }

        // Open the menu. (S8 keeps the dock expanded while the menu is open.)
        await page.locator(TRIGGER).first().click();
        await page.waitForTimeout(250);

        // Find the dark-mode row's LABEL (the `<span>Dark mode</span>` text), NOT the
        // icon button. role="menuitem" content portals; the label span is the gutter
        // target the F5 row @click must own. Locate by exact text within the menu.
        const labelLoc = page.getByText("Dark mode", { exact: true }).first();
        const labelVisible = await labelLoc.isVisible().catch(() => false);
        if (!labelVisible) {
            const dbg = await page.evaluate(() => ({
                menu: !!document.querySelector('[role="menu"]'),
                items: [...document.querySelectorAll('[role="menuitem"]')].map((n) => n.textContent.trim()).slice(0, 6),
            }));
            fail(
                `darkmode-row-toggle — the "Dark mode" label is not visible in the open menu ` +
                    `(menu:${dbg.menu}, items:[${dbg.items.join(" | ")}]) — the dark-mode row did not render`,
            );
            await page.close();
            return;
        }

        // Confirm the click target is the LABEL gutter, not the icon: the located
        // element is a <span> (the text node), and the DarkModeToggle button is a
        // SIBLING inside the same row (so we are NOT clicking the icon).
        const targetIsLabel = await labelLoc.evaluate((el) => {
            const tag = el.tagName.toLowerCase();
            // The icon button (DarkModeToggle) is a <button>; the label is a <span>.
            const insideButton = !!el.closest("button");
            return { tag, insideButton };
        });
        if (targetIsLabel.insideButton) {
            fail(
                `darkmode-row-toggle — the "Dark mode" text resolves INSIDE a <button> ` +
                    `(${targetIsLabel.tag}); the gate must click the LABEL gutter, not the icon button`,
            );
            await page.close();
            return;
        }
        ok(`the click target is the row LABEL gutter (a <${targetIsLabel.tag}>, not the icon <button>)`);

        // ── the round-trip: click the LABEL twice, expect a symmetric flip ──────
        const before = await isDark();
        await labelLoc.click(); // click 1 — at the label gutter
        await page.waitForTimeout(250);
        const after1 = await isDark();

        // The menu closes on a row click; if it did, re-open + re-locate before
        // the second click (the row click is `@select.prevent`, so the item SHOULD
        // keep the menu open — but re-open defensively if it closed).
        let label2 = labelLoc;
        if (!(await label2.isVisible().catch(() => false))) {
            await page.locator(TRIGGER).first().click();
            await page.waitForTimeout(250);
            label2 = page.getByText("Dark mode", { exact: true }).first();
        }
        await label2.click(); // click 2
        await page.waitForTimeout(250);
        const after2 = await isDark();

        // Clause: click 1 FLIPS (after1 !== before) AND click 2 flips BACK
        // (after2 === before) — exactly one toggle per click, symmetric round-trip.
        const flipsOnce = after1 !== before;
        const flipsBack = after2 === before;
        const seq = `${before ? "dark" : "light"}→${after1 ? "dark" : "light"}→${after2 ? "dark" : "light"}`;
        if (flipsOnce && flipsBack) {
            ok(
                `row-label-toggle — clicking the label flips <html>.dark, clicking again flips back ` +
                    `(${seq}); exactly ONE toggle per click — no double-toggle`,
            );
        } else if (!flipsOnce) {
            fail(
                `row-label-toggle — clicking the "Dark mode" LABEL did NOT flip <html>.dark ` +
                    `(${seq}). Born-RED today: the label/gutter is inert (no row @click — only the icon ` +
                    "flips). Greens on the F5 row-level @click=\"toggleDark()\".",
            );
        } else {
            fail(
                `row-label-toggle — the label click flipped but did NOT round-trip symmetrically ` +
                    `(${seq}); a double-toggle (missing passive icon) cancels the net change. ` +
                    "Make <DarkModeToggle passive> so the row fires exactly once (F5).",
            );
        }
        await page.close();
    } finally {
        await browser.close();
        server.close();
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:darkmode-row-toggle — FAIL (${failures.length}): the dark-mode row's label gutter ` +
            "does not toggle the theme once per click (the row @click is missing, or the icon double-toggles — F5).",
    );
    process.exit(1);
}
console.log(
    "\nproof:darkmode-row-toggle — PASS: clicking the dark-mode row label flips <html>.dark once per click " +
        "(row-level @click + passive indicator icon — F5).",
);
