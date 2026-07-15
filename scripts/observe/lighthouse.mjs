#!/usr/bin/env node
/**
 * lighthouse-gate — the A11y=100 + SEO≥90 CI gate W5 demanded but never built
 * (C.W1 S6; a11y-responsive 11 + plan-fidelity 1/4).
 *
 * W5's §Hard gate demanded "lighthouse A11y = 100 … and SEO ≥ 90," but FINAL.md
 * shipped only `<main>`/alt assertions self-certified against the START SCREEN
 * (panel-closed) — no scoring gate exists in CI, and the real product state (a
 * controls panel open) scored 75–79 (B's `after-prod/_summary.json`). This gate
 * scores the product AS USED: for every scene it drives the OPEN-panel editing
 * state (via the shared `openControlsPanel` driver — the same one S2's
 * controls-open occlusion axis uses) and runs Lighthouse a11y + SEO.
 *
 * ── HONEST-BY-CONSTRUCTION (inv ε — must NOT red CI between W1 and W2) ─────────
 * The full A11y=100 cannot bind today: the demo-owned a11y LEAF closes
 * (`image-alt`, `color-contrast`) are W2's job, and the glass-ui-blocked audits
 * (`button-name`/`label`/`aria-input-field-name`, all from glass-ui's
 * `LabeledField` no-label-association root cause) route OUTWARD (ASK-3, inv-16) —
 * neither is closed at W1 close. Rather than silently exempt them, the gate
 * carries TWO EXPLICIT, REVIEWABLE allowance buckets, each with a NAMED removal
 * trigger (see ALLOWANCES below). The gate is HARD on:
 *   • any a11y audit that fails OUTSIDE the two buckets, AND
 *   • any REGRESSION of an audit not already failing at W1 baseline, AND
 *   • SEO < 90 on any scene × viewport.
 * Full A11y = 100 binds the moment `bucket-w2` empties at W2 close (and the
 * remaining bucket-glassui empties on glass-ui ASK-3 adoption). The buckets are
 * a manifest IN THIS SCRIPT — not a silent pass — so a reviewer sees exactly
 * what is held and why, and the gate tightens by DELETION as the closes land.
 *
 * Resolves lighthouse from KF_LIGHTHOUSE_DIR (default: repo root, where CI
 * installs it via `npm i --no-save lighthouse`); chromium launch/teardown ride
 * the lib lifecycle (withBrowser({ launch: --remote-debugging-port }) so
 * lighthouse can attach, J.W3 S1 — chromium-absent under KF_REQUIRE_BROWSER
 * FAILS at the lib seam). Serves the BUILT `dist/gh-pages/`. Exit 1 on any
 * gate violation.
 *
 * Usage:
 *   node scripts/observe/lighthouse.mjs
 *   KF_PLAYWRIGHT_DIR=/path   (resolve playwright/chromium from there; CI installs it)
 *   KF_LIGHTHOUSE_DIR=/path   (resolve lighthouse from there; default = repo root)
 *   KF_REQUIRE_BROWSER=1      (CI: hard-fail if browser/lighthouse unresolvable, not skip)
 *   KF_LH_INJECT_SEO_FAIL=1   (self-test: strip the meta description to PROVE SEO<90 bites)
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import {
    SCENES,
    serveDist,
    openControlsPanel,
    withBrowser,
} from "../lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DIST = path.join(REPO, "dist/gh-pages");

// ── The two allowance buckets (the explicit, reviewable manifest) ────────────
//
// Each entry is a Lighthouse a11y audit id the gate TOLERATES failing today,
// paired with the exact close that removes it. A failing a11y audit NOT in
// either bucket reddens the gate. The gate tightens by deleting entries here as
// the named closes land — never by widening a silent skip.
const ALLOWANCES = {
    // bucket-glassui → REMOVED on glass-ui ASK-3 adoption (the `LabeledField`
    // label-association fix: mint `useId()`, render `<label :for>`, thread
    // `aria-labelledby` to ARIA-widget controls). inv-16: glass-ui-owned, NEVER
    // patched in the demo. These three are ONE root cause (a11y-responsive 3).
    "bucket-glassui": {
        trigger:
            "glass-ui ASK-3 adoption (LabeledField label-association) — " +
            "docs/tranches/B/asks/glass-ui-adoption-asks.md",
        audits: ["button-name", "label", "aria-input-field-name"],
    },
    // bucket-w2 → EMPTIED at the C.W2 a11y close: both demo-owned leaves are
    // closed, so they are now REQUIRED to pass (this gate reddens if either
    // regresses):
    //   • color-contrast — the spring scene's `.settled-badge` green-on-tint was
    //     1.97:1; C.W2 pushes the badge text toward --foreground (theme-aware)
    //     so it reads ≥4.5:1 in light + dark (verified via axe color-contrast).
    //   • image-alt — never fired (no demo <img> lacks alt); the precautionary
    //     entry is removed so a future missing alt bites HERE, not silently.
    // NB: `landmark-one-main` is deliberately NOT bucketed — S1 closed it (the
    // real `<main>`), so it MUST pass; if S1 regresses, this gate reddens.
    //
    // ── T.G10 (lane 32 T-PERF-D) — the T-era a11y misses are MEASURED CURED ──────
    // Lane 32 @ 929ef0e found 3 UNBUCKETED a11y failures firing this gate, their
    // verdict discarded by ci.yml's continue-on-error: `home/desktop` +
    // `cube/desktop` `color-contrast`, and `sequence/mobile` `target-size`. On the
    // CURRENT tree ALL THREE are MEASURED GREEN (re-run this gate: home/desktop
    // a11y=100, cube/desktop holds only the glass-ui bucket, sequence/mobile+desktop
    // a11y=100). The `color-contrast` pair was cured by T.D's red-kill (VERDICT #16
    // "I don't like this latent red theme" → the ONE oklch violet accent authority);
    // the `target-size` miss by the T.C/T.F dock/chrome recut. So there is NOTHING
    // to bucket: a `bucket-t-pending` for audits that now PASS would be the
    // PRECAUTIONARY-ENTRY anti-pattern this file explicitly rejects (see bucket-w2's
    // image-alt removal) — it would MASK a future regression of a currently-passing
    // audit. The gate's biting logic is sound and UNCHANGED: a future unbucketed
    // a11y regression exits 1 here.
    //
    // The remaining T.G10 half — un-SILENCING that exit so it BLOCKS rather than
    // riding demo-device-observe's job-level `continue-on-error` — shares T.G9's
    // infra dependency: this gate lives in the observe job because lighthouse is
    // install-or-observe (binary absent in CI). Making its bite blocking needs a
    // calibrated runner / a blocking job with lighthouse installed (the SAME
    // provisioning as proof:lighthouse-mobile's KF_REQUIRE_LH hard path). Removing
    // only the STEP-level continue-on-error would be harmful (it would abort the
    // sibling observe steps at a failure) AND ineffective (the JOB-level
    // continue-on-error still swallows). So the CI-blocking flip is a named HANDOFF
    // → the T.G9/T.Z calibrated-runner provisioning; the DEFECT half is discharged
    // (cured + measured green). The `continue-on-error` neuter PATTERN (charter
    // conflict #5) across the LoAF `|| true` (T.G8 — path now fixed, the grep emits
    // a real PASS/legible-error), the lighthouse-mobile OBSERVE posture (T.G9 —
    // legitimately device-dependent), and this a11y step is audited together HERE
    // and dispositioned per sibling: cured / infra-deferred / legitimate-observe.
};

// Flattened set of every allowed audit id, for O(1) membership.
const ALLOWED = new Set(
    Object.values(ALLOWANCES).flatMap((b) => b.audits),
);

const SEO_FLOOR = 90;

const VIEWPORTS = [
    { name: "mobile", width: 375, height: 667 },
    { name: "desktop", width: 1440, height: 900 },
];

function resolveLighthouse() {
    const root = process.env.KF_LIGHTHOUSE_DIR ?? REPO;
    const requireFrom = createRequire(path.join(root, "package.json"));
    // lighthouse is ESM; resolve its on-disk path then dynamic-import it.
    try {
        return requireFrom.resolve("lighthouse");
    } catch {
        return null;
    }
}

// Lighthouse's a11y category lists EVERY a11y audit; we want the ones that
// actually FAILED. We count ONLY `scoreDisplayMode === "binary"` audits that
// scored < 1 — the genuine pass/fail axe checks. The `manual` and
// `notApplicable` modes (and any `informative` group) are NOT pass/fail and are
// excluded, so a manual-review item never reddens the gate. Using the display
// mode (not `weight > 0`) means a binary regression on a weight-0 audit still
// bites — the gate's "any regression of an already-passing audit" clause.
// Returns { failing:Set<id>, score }.
function a11yResult(lhr) {
    const cat = lhr.categories.accessibility;
    const score = Math.round((cat.score ?? 0) * 100);
    const failing = new Set();
    for (const ref of cat.auditRefs) {
        const a = lhr.audits[ref.id];
        if (
            a &&
            a.scoreDisplayMode === "binary" &&
            a.score !== null &&
            a.score < 1
        ) {
            failing.add(ref.id);
        }
    }
    return { failing, score };
}

function seoScore(lhr) {
    return Math.round((lhr.categories.seo.score ?? 0) * 100);
}

async function main() {
    const lighthousePath = resolveLighthouse();

    if (!lighthousePath) {
        console.error(
            "lighthouse-gate — SKIP: unresolvable: lighthouse (KF_LIGHTHOUSE_DIR / `npm i --no-save lighthouse`).",
        );
        // Skipping is acceptable locally; in CI the browser + lighthouse are
        // install steps, so KF_REQUIRE_BROWSER=1 turns the skip into a failure.
        process.exit(process.env.KF_REQUIRE_BROWSER ? 2 : 0);
    }

    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        console.error(
            "lighthouse-gate — FAIL: dist/gh-pages not built (run `npm run gh-pages`).",
        );
        process.exit(2);
    }

    const lighthouse = (await import(lighthousePath)).default;

    // Launch chromium with a fixed debug port so lighthouse attaches to the
    // SAME browser the open-panel driver seeded. localStorage seeded by
    // openControlsPanel survives lighthouse's navigation because we run
    // lighthouse with `disableStorageReset: true`. (withBrowser, not withPage:
    // lighthouse needs the debug-port launch arg + its own per-scene contexts.)
    const DEBUG_PORT = 9222 + Math.floor(Math.random() * 1000);

    const failures = [];
    const heldNote = [];
    console.log(
        "lighthouse-gate — A11y=100 (demo-owned) + SEO≥90 on the OPEN-panel editing state\n",
    );

    const result = await withBrowser(
        async (browser) => {
    const { url, close: closeServer } = await serveDist(DIST);

    // A self-test hook (KF_LH_INJECT_SEO_FAIL): the gate PROVES it bites SEO<90
    // by serving a meta-description-stripped index.html. Read once, restore in
    // the finally so the built artefact is untouched on disk.
    const indexPath = path.join(DIST, "index.html");
    const originalIndex = fs.readFileSync(indexPath, "utf8");
    if (process.env.KF_LH_INJECT_SEO_FAIL) {
        const stripped = originalIndex
            .replace(/<meta\s+name="description"[\s\S]*?\/>/i, "")
            .replace(/<meta\s+name="robots"[^>]*\/>/i, "");
        fs.writeFileSync(indexPath, stripped);
        console.log(
            "lighthouse-gate — SELF-TEST: meta description+robots stripped (expect SEO<90 to bite)",
        );
    }

    try {
        for (const scene of SCENES) {
            for (const vp of VIEWPORTS) {
                const tag = `${scene.key}/${vp.name}`.padEnd(16);
                const sceneUrl = `${url}/#/${scene.route}`;

                // 1) Drive the scene into its OPEN-panel editing state. We use a
                //    fresh page on the same browser context, goto the route,
                //    then seed + reload via the shared driver. The seeded
                //    localStorage persists for lighthouse's own navigation.
                const ctx = await browser.newContext({
                    viewport: { width: vp.width, height: vp.height },
                });
                const page = await ctx.newPage();
                await page.goto(sceneUrl, { waitUntil: "load" });
                await page.waitForTimeout(1500);
                await openControlsPanel(page); // no-op for home (no panel)

                // 2) Run lighthouse against the same URL on the same port.
                //    disableStorageReset keeps the seeded open-panel state;
                //    onlyCategories trims the run to a11y+seo (fast, focused).
                const runnerResult = await lighthouse(
                    sceneUrl,
                    {
                        port: DEBUG_PORT,
                        output: "json",
                        logLevel: "error",
                        onlyCategories: ["accessibility", "seo"],
                        disableStorageReset: true,
                        screenEmulation: {
                            mobile: vp.name === "mobile",
                            width: vp.width,
                            height: vp.height,
                            deviceScaleFactor: vp.name === "mobile" ? 2 : 1,
                            disabled: false,
                        },
                        formFactor: vp.name === "mobile" ? "mobile" : "desktop",
                    },
                    undefined,
                );

                await page.close();
                await ctx.close();

                const lhr = runnerResult.lhr;
                const { failing, score: a11y } = a11yResult(lhr);
                const seo = seoScore(lhr);

                // 3) Partition the failing a11y audits into HELD (in a bucket)
                //    vs BITING (outside every bucket → a real failure).
                const biting = [...failing].filter((id) => !ALLOWED.has(id));
                const held = [...failing].filter((id) => ALLOWED.has(id));

                for (const id of biting) {
                    failures.push(
                        `${tag.trim()}: a11y audit '${id}' fails and is NOT in any allowance bucket`,
                    );
                }
                if (seo < SEO_FLOOR) {
                    failures.push(
                        `${tag.trim()}: SEO ${seo} < ${SEO_FLOOR} floor`,
                    );
                }

                const status = biting.length === 0 && seo >= SEO_FLOOR ? "✓" : "✗";
                const heldStr = held.length
                    ? ` [held: ${held.join(", ")}]`
                    : "";
                const line = `  ${status} ${tag} a11y=${a11y} seo=${seo}${heldStr}`;
                if (status === "✓") console.log(line);
                else console.error(line);
                for (const id of biting)
                    console.error(`      ✗ BITING a11y '${id}' (unbucketed)`);
                if (held.length) heldNote.push(`${tag.trim()}: ${held.join(", ")}`);
            }
        }
    } finally {
        await closeServer();
        if (process.env.KF_LH_INJECT_SEO_FAIL)
            fs.writeFileSync(indexPath, originalIndex);
    }
        },
        { launch: { args: [`--remote-debugging-port=${DEBUG_PORT}`] }, label: "the open-panel a11y/SEO scoring matrix" },
    );
    if (result.skipped) {
        console.error(`lighthouse-gate — SKIP: unresolvable: ${result.reason}.`);
        process.exit(process.env.KF_REQUIRE_BROWSER ? 2 : 0);
    }

    // ── The allowance ledger (printed every run, so the held audits + their
    //    removal triggers are visible in the CI log — not a silent pass). ─────
    console.log("\nlighthouse-gate — allowance buckets (held audits + removal trigger):");
    for (const [name, b] of Object.entries(ALLOWANCES)) {
        console.log(`  ${name}: { ${b.audits.join(", ")} }`);
        console.log(`    → removed on: ${b.trigger}`);
    }
    if (heldNote.length) {
        console.log("\nheld this run (each MUST map to a bucket above):");
        for (const n of heldNote) console.log(`  • ${n}`);
    }

    if (failures.length > 0) {
        console.error(
            `\nlighthouse-gate — FAIL (${failures.length}): A11y/SEO gate violated.`,
        );
        for (const f of failures) console.error(`  ✗ ${f}`);
        process.exit(1);
    }
    console.log(
        "\nlighthouse-gate — PASS: every scene × viewport meets A11y (demo-owned) + SEO≥90 " +
            "on the OPEN-panel editing state (the bucketed audits remain a tracked, " +
            "named allowance — see triggers above).",
    );
}

main().catch((err) => {
    console.error("lighthouse-gate — ERROR:", err);
    process.exit(3);
});
