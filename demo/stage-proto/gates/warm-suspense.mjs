import { createRequire } from "module";
import { openPage, sleep } from "./lib.mjs";
const req = createRequire("/Users/mkbabb/Programming/glass-ui/package.json");
const { chromium } = req("playwright-core");

// ─────────────────────────────────────────────────────────────────────────────
// Tech-2 — warmScene REAL vs a slow (~300ms) lazy chunk behind <Suspense>.
// Proves: (1) the VT update callback AWAITS the Suspense onResolve before it
// returns, so the entered frame NEVER shows the fallback/spinner; (2) the warm
// gate is load-bearing — a COLD commit genuinely surfaces the fallback mid-load
// (which the awaited VT frame hides), a WARMED commit never mounts it at all.
// ─────────────────────────────────────────────────────────────────────────────
const SHOTS =
    "/Users/mkbabb/Programming/keyframes.js/docs/tranches/S/audit/pass3/proto-shots-v3";

const b = await chromium.launch({ headless: true });
const results = [];
function rec(clause, pass, detail) {
    results.push({ clause, pass });
    console.log(`[${pass ? "PASS" : "FAIL"}] ${clause}:`, JSON.stringify(detail));
}

async function resetHarness(page) {
    await page.evaluate(() => (window.__slowHarness = undefined));
}
async function waitReturn(page) {
    await page.waitForFunction(
        () => window.__slowHarness && window.__slowHarness.slowReadyAtReturn === true,
        { timeout: 4000 },
    );
    return page.evaluate(() => window.__slowHarness);
}
async function enteredState(page) {
    return page.evaluate(() => ({
        ready: !!document.querySelector("[data-slow-ready]"),
        fallback: !!document.querySelector("[data-slow-fallback]"),
        vtSupported: typeof document.startViewTransition === "function",
    }));
}

// ── (1) WARMED + VT — the real fire() path: warm THEN VT. No fallback EVER. ──
{
    const { page, errors } = await openPage(b, { theme: "dark", hash: "#cube" });
    await resetHarness(page);
    // kick the warmed VT commit; while it runs, watch for ANY fallback in the DOM.
    let fallbackSeen = false;
    const watcher = (async () => {
        for (let i = 0; i < 40; i++) {
            fallbackSeen =
                fallbackSeen ||
                (await page.evaluate(
                    () => !!document.querySelector("[data-slow-fallback]"),
                ));
            await sleep(15);
        }
    })();
    await page.evaluate(() => window.__slowHarnessCommit({ warm: true, vt: true }));
    const w = await waitReturn(page);
    await watcher;
    await sleep(700); // let the VT settle
    const entered = await enteredState(page);
    await page.screenshot({ path: `${SHOTS}/warm-suspense-entered.png` });
    const pass =
        w.warmed === true &&
        w.fallbackAtReturn === false &&
        w.slowReadyAtReturn === true &&
        w.resolvedBeforeReturn === true &&
        w.updateMs < 120 && // warmed → the callback does NOT block on the chunk
        fallbackSeen === false &&
        entered.ready === true &&
        entered.fallback === false &&
        errors.length === 0;
    rec("1 warmed-VT (no fallback ever)", pass, {
        witness: w,
        fallbackSeenDuringWarm: fallbackSeen,
        entered,
        errors: errors.length,
    });
    await page.close();
}

// ── (2) COLD + VT — the onResolve await is what hides the (genuinely present)
// fallback: the chunk DOES mount its spinner mid-load, yet the entered frame is
// clean because doUpdate blocks on the Suspense onResolve. ──
{
    const { page, errors } = await openPage(b, { theme: "dark", hash: "#cube" });
    await resetHarness(page);
    await page.evaluate(() => window.__slowHarnessCommit({ warm: false, vt: true }));
    const w = await waitReturn(page);
    await sleep(700);
    const entered = await enteredState(page);
    // The VT-compatible non-vacuity proof: the update callback BLOCKED for ≈ the
    // slow-chunk latency (the transient fallback DOM under an active VT is not
    // CDP-observable — same limit round-2 recorded for overlayInDomAtUpdate; the
    // no-VT clause 3 captures the actual spinner pixel). A blocked update callback
    // that returns with slowReady && !fallback IS the onResolve-await guarantee.
    const pass =
        w.warmed === false &&
        w.usedVT === true &&
        w.updateMs >= 250 && // the callback WAITED on the slow chunk (~300ms)
        w.fallbackAtReturn === false && // and returned only once resolved
        w.slowReadyAtReturn === true &&
        w.resolvedBeforeReturn === true &&
        entered.ready === true &&
        entered.fallback === false && // the entered frame is CLEAN
        errors.length === 0;
    rec("2 cold-VT (update callback blocks on onResolve)", pass, {
        witness: w,
        updateBlockedMs: Math.round(w.updateMs),
        entered,
        errors: errors.length,
    });
    await page.close();
}

// ── (3) COLD + NO-VT — capture the SPINNER pixel the warm+VT path keeps out
// (a no-VT commit so CDP screenshotting cannot abort a VT). This is the frame
// the awaited-onResolve VT provably never surfaces. ──
{
    const { page } = await openPage(b, { theme: "dark", hash: "#cube" });
    await resetHarness(page);
    await page.evaluate(() => window.__slowHarnessCommit({ warm: false, vt: false }));
    // mid-load: the fallback spinner is on screen (no VT to hide it here).
    await page
        .waitForFunction(() => !!document.querySelector("[data-slow-fallback]"), {
            timeout: 1000,
        })
        .catch(() => {});
    await sleep(60);
    const midFallback = await page.evaluate(
        () => !!document.querySelector("[data-slow-fallback]"),
    );
    await page.screenshot({ path: `${SHOTS}/warm-suspense-cold-fallback.png` });
    // then it resolves to the ready scene
    await waitReturn(page);
    await sleep(150);
    await page.screenshot({ path: `${SHOTS}/warm-suspense-cold-ready.png` });
    rec("3 cold-noVT (fallback pixel captured)", midFallback === true, {
        midFallback,
        note: "the spinner the warm+VT path keeps out of the entered frame",
    });
    await page.close();
}

await b.close();
console.log("\n===== WARM-SUSPENSE SUMMARY =====");
for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.clause}`);
const all = results.every((r) => r.pass);
console.log(all ? "\nALL WARM-SUSPENSE CLAUSES GREEN" : "\nSOME CLAUSES RED");
process.exit(all ? 0 : 1);
