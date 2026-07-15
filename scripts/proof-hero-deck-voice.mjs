#!/usr/bin/env node
/**
 * proof:hero-deck-voice — T.D11 (OD-4 **APPROVED**; the P-HERO serif-italic
 * deck ramp). **OWNER authority (T.M6)**: the deck VOICE was the contested
 * design fork (serif-italic per lane 01 vs Jakarta-body per lane 09 — charter
 * conflict note 2) that OD-4's live review RESOLVED to the poster's own voice;
 * this oracle's green window IS that ruling (OWNER-DECISIONS.md OD-4; verdict
 * artifact docs/tranches/T/verdicts/T.D11.md).
 *
 * THE CONTRACT (T.D11): the home deck lines join the poster's voice — every
 * `.start-screen-prose` node resolves Instrument Serif TRUE italic 400; NO
 * computed weight above 400 anywhere on the start screen (the "bold-italic
 * system sans under a 177px serif" register is dead). The RUNG deviation from
 * P-HERO (hint heading→title) is named in the packet: the landed T.D2 serif
 * floor (≥28px desktop) makes the heading rung serif-illegal, so ink strength
 * (muted) carries the deck→hint step — this oracle asserts VOICE + weight +
 * style; the SIZE floor is proof:font-census clause (b)'s.
 *
 * CLAUSES:
 *   (a) DECK TUPLE (browser, home 1440×900) — every `.start-screen-prose`
 *       leaf: fontFamily heads "Instrument Serif", fontStyle italic, computed
 *       weight 400.
 *   (b) NO WEIGHT > 400 (browser) — zero elements inside `.hero-band` resolve
 *       a computed font-weight above 400 (the honest-ink totality on the
 *       start screen; VERDICT #24).
 *   (c) NO UTILITY STACKING (static) — EditorStartScreen.vue no longer stacks
 *       the `italic` utility on `text-heading`/`text-subheading` semantic
 *       classes (the T.D11 lockstep: whatever voice won, the manual
 *       weight/style stacking dies).
 *
 * Harness: scripts/lib/demo-driver.mjs withPage; serves the BUILT
 * dist/gh-pages. Re-runnable: `node scripts/proof-hero-deck-voice.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const START_SCREEN = path.join(
    REPO,
    "demo/components/instrument/shell/EditorStartScreen.vue",
);

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};

console.log(
    "proof:hero-deck-voice — T.D11 (OD-4 APPROVED · the serif-italic deck ramp; OWNER authority)",
);

// ── (c) static — no `italic` utility stacked on semantic text-* classes ──────
{
    const src = fs
        .readFileSync(START_SCREEN, "utf8")
        .replace(/<!--[\s\S]*?-->/g, "");
    const stacked = [...src.matchAll(/class="[^"]*"/g)]
        .map((m) => m[0])
        .filter(
            (c) =>
                /\bitalic\b/.test(c) &&
                /\btext-(heading|subheading|title)\b/.test(c),
        );
    if (stacked.length === 0) {
        ok(
            "(c) EditorStartScreen stacks no `italic` utility on text-heading/text-subheading — " +
                "the deck style lives in its own voiced rule (the T.D11 lockstep)",
        );
    } else {
        fail(
            `(c) manual italic stacking on a semantic utility survives: ${stacked.join(" | ")} ` +
                "(whichever deck voice wins, weight/style stacking on text-* dies — T.D11 lockstep)",
        );
    }
}

// ── (a)+(b) browser — the deck tuple + the ≤400 totality ────────────────────
const result = await withPage(
    {
        distDir: DIST,
        context: { viewport: { width: 1440, height: 900 } },
        label: "hero deck voice",
    },
    async (page, { url: base }) => {
        await page.goto(`${base}/#/`, { waitUntil: "load" });
        await page.waitForTimeout(1200);
        return page.evaluate(async () => {
            await document.fonts.ready;
            const prose = [...document.querySelectorAll(".start-screen-prose")];
            const deck = prose.map((el) => {
                const cs = getComputedStyle(el);
                return {
                    cls: el.className,
                    txt: (el.textContent || "").trim().slice(0, 32),
                    ff: cs.fontFamily,
                    style: cs.fontStyle,
                    fw: cs.fontWeight,
                };
            });
            const heavies = [];
            const band = document.querySelector(".hero-band");
            if (band) {
                for (const el of [band, ...band.querySelectorAll("*")]) {
                    const w = parseInt(getComputedStyle(el).fontWeight, 10);
                    if (w > 400) {
                        heavies.push({
                            tag: el.tagName.toLowerCase(),
                            cls: String(el.className).slice(0, 48),
                            fw: w,
                        });
                    }
                }
            }
            return { deck, heavies, bandFound: !!band };
        });
    },
);

if (result.skipped) {
    console.log(`  ○ browser half skipped — ${result.reason}`);
} else {
    const { deck, heavies, bandFound } = result.value;
    if (deck.length === 0) {
        fail("(a) zero .start-screen-prose nodes rendered on home — the deck is missing");
    } else {
        const off = deck.filter(
            (d) =>
                !/^"?Instrument Serif/i.test(d.ff) ||
                d.style !== "italic" ||
                parseInt(d.fw, 10) !== 400,
        );
        if (off.length === 0) {
            ok(
                `(a) all ${deck.length} deck line(s) resolve Instrument Serif TRUE italic 400 — ` +
                    "the poster's own voice (the bold-italic system-sans register is dead)",
            );
        } else {
            fail(
                `(a) deck line(s) off the serif-italic-400 tuple: ${JSON.stringify(off)} ` +
                    "(OD-4 ruled the deck into the poster's voice)",
            );
        }
    }
    if (!bandFound) {
        fail("(b) the .hero-band host did not render — cannot assert the ≤400 totality");
    } else if (heavies.length === 0) {
        ok("(b) zero computed font-weight > 400 anywhere on the start screen (honest ink, total)");
    } else {
        fail(`(b) start-screen element(s) above weight 400: ${JSON.stringify(heavies.slice(0, 8))}`);
    }
}

if (failures.length > 0) {
    console.error(
        `\nproof:hero-deck-voice — FAIL (${failures.length}): the home deck is off the OD-4 ` +
            "serif-italic ramp (voice / style / weight / utility-stacking).",
    );
    process.exit(1);
}
console.log(
    "\nproof:hero-deck-voice — PASS: the home deck speaks the poster's own voice — Instrument Serif " +
        "true italic 400, no weight above 400 on the start screen, no utility stacking (T.D11 / OD-4).",
);
