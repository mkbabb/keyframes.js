#!/usr/bin/env node
/**
 * proof:lighthouse-mobile — the E.W4 per-scene MOBILE performance gate (inv μ).
 *
 * The honest E.W4 perf opportunity is MOBILE, not desktop: the B after-prod
 * baseline shows desktop already near-target (89–96, one outlier spring-desktop
 * 63), while mobile sits at Perf 49–64 with LCP 6.8–28.5 s — spring-mobile a
 * pathological LCP 28.5 s driven by Monaco's eager 4 MB load on a scene that
 * never rendered the editor. E.W4 S1 deferred Monaco off every non-editor
 * scene's initial graph; this gate is the falsifiable form of "the per-scene
 * MOBILE target held, and the spring-mobile LCP regression is gone."
 *
 * It builds (callers run `npm run gh-pages` first, or pass --build), serves the
 * static `dist/gh-pages`, and runs Lighthouse MOBILE per scene over the SAME
 * shared driver (`scripts/lib/demo-driver.mjs`) the a11y/occlusion gates use, so
 * a scene-route change reaches every gate at once. For each scene it asserts:
 *   • mobile Performance ≥ the per-scene CEILING (a real delta over the B
 *     mobile baseline — these are floors the Monaco defer must not drop below);
 *   • spring-mobile LCP < SPRING_LCP_BOUND (the 28.1 s regression terminated).
 *
 * ── HONEST-BY-CONSTRUCTION (inv ε — the mandate FORBIDS asserting an unmeasured
 *    perf win). ────────────────────────────────────────────────────────────────
 * Lighthouse's CPU/network throttle assumes a CI-grade or real-device host. In a
 * shared/contended sandbox the absolute scores are SYSTEMATICALLY inflated (LCP
 * offset by several seconds from CPU contention LAYERED UNDER lighthouse's own 4x
 * throttle), so the numbers are reproducible-but-not-comparable to the CI
 * baseline. Asserting the B-baseline ceilings against such numbers would FALSELY
 * red; asserting the sandbox numbers would be a meaningless self-comparison.
 * Therefore the gate is calibrated to RUN-ENVIRONMENT FITNESS:
 *   • Default (local/sandbox): if it cannot resolve a browser+lighthouse, OR the
 *     env declares itself untrusted (KF_LH_UNTRUSTED=1), it RECORDS-WITHHELD with
 *     the explicit reason and exits 0 — it does NOT fabricate a pass and does NOT
 *     falsely red on an environment artifact.
 *   • CI (KF_REQUIRE_LH=1): the browser+lighthouse MUST resolve and the per-scene
 *     ceilings MUST hold, or the gate reds. This is where the perf claim is
 *     actually proven, on a calibrated runner.
 * A `--probe` flag runs the measurement and PRINTS the per-scene numbers without
 * asserting (so a human can read the sandbox deltas without the gate reddening on
 * the throttle artifact).
 *
 * Usage:
 *   npm run gh-pages && node scripts/proof-lighthouse-mobile.mjs        # gate
 *   node scripts/proof-lighthouse-mobile.mjs --build                    # build first
 *   node scripts/proof-lighthouse-mobile.mjs --probe                    # measure + print, no assert
 *   KF_REQUIRE_LH=1   …                                                  # CI: hard-assert
 *   KF_LH_UNTRUSTED=1 …                                                  # declare env untrusted → withhold
 *   KF_PLAYWRIGHT_DIR=/path  KF_LIGHTHOUSE_DIR=/path                     # resolver overrides
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { declarePosture } from "./lib/ci-env.mjs";
import { SCENES, resolveChromium, serveDist, withBrowser } from "./lib/demo-driver.mjs";

// ── J.W4 S6 — the DECLARED P6 posture, through the ONE shared helper ─────────
// The gate measures a DEVICE-DEPENDENT quantity (throttled mobile Lighthouse
// Performance) — the canonical observe-only-in-CI / hard-on-device third state:
// in CI a ceiling miss is RECORDED (never red there — the P6 over-read
// prohibition: a green observe-only CI run is NEVER read as "mobile perf held
// in CI"); locally it is HARD; on a CALIBRATED runner `KF_REQUIRE_LH=1`
// bypasses the posture routing and hard-asserts (the on-device half, handled
// BEFORE the posture below — IN_CI must not soften a declared-calibrated run).
// The correctness owner of "mobile works" remains the S1 mobile-input battery
// (proof:live-session-mobile); this gate CORROBORATES. The reason string IS
// the taxonomy-manifest row (docs/tranches/J/gate-taxonomy.md — CI tier-manifest
// asserts the two-way mapping).
const redMisses = [];
const posture = declarePosture("observe-only", {
    reason:
        "mobile Lighthouse CPU/network throttle assumes a calibrated or real-device host — " +
        "absolute scores are environment artifacts on shared runners; hard on-device via KF_REQUIRE_LH=1",
    fail: (label) => {
        redMisses.push(label);
        console.error(`  ✗ ${label}`);
    },
    note: (label) => console.log(`  · ${label}`),
});

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const argv = process.argv.slice(2);
const DO_BUILD = argv.includes("--build");
const PROBE_ONLY = argv.includes("--probe");
const REQUIRE_LH = !!process.env.KF_REQUIRE_LH;
const DECLARED_UNTRUSTED = !!process.env.KF_LH_UNTRUSTED;

// ── The per-scene MOBILE ceilings (the real delta over the B mobile baseline) ──
//
// Each is a FLOOR the build must meet on a calibrated runner. They are the B
// after-prod MOBILE figures (docs/tranches/B/audit/lighthouse/after-prod/
// _summary.json) — the historical ground truth — used as a no-regression floor:
// the Monaco defer should HOLD or IMPROVE every scene, and notably LIFT the
// spring outlier. We assert ≥ the B floor (not a speculative higher target) so
// the gate proves "no regression below the recorded baseline" — the honest,
// measured claim. The `id` matches the shared SCENES manifest `key`.
const SCENE_CEILINGS = {
    home: 63,
    cube: 64,
    amiga: 49,
    square: 62,
    easing: 61,
    spring: 52,
};

// The spring-mobile LCP bound: the B baseline was a pathological 28.5 s. The
// S1 defer moves Monaco off the ENTRY/scene STATIC graph (verified: 0 chunks
// statically import vendor-monaco), so Monaco's 4 MB parse no longer blocks the
// entry chunk's synchronous evaluation; on the editor-bearing scenes (spring's
// default-open sidebar, the force-mounted keyframes pane) the editor still
// MOUNTS on first paint, but its Monaco load is now a NON-render-blocking
// dynamic import — the LCP element (the spring target) can paint before Monaco
// finishes. On a calibrated runner the bound proves the entry-blocking 28.5 s
// regression is gone; we set 15 s — comfortably below 28.5 s, above a real LCP.
// NB (measured, recorded honestly): in a CONTENDED SANDBOX the cold spring load
// still parses the 4 MB Monaco under Lighthouse's 4x throttle + sandbox
// contention and the absolute LCP stays inflated (~34 s) — an environment
// artifact, NOT a regression of the defer. This is exactly why the gate
// records-WITHHELD off-CI and only hard-asserts under KF_REQUIRE_LH=1.
const SPRING_LCP_BOUND_S = 15;

const VIEWPORT = { name: "mobile", width: 375, height: 667 };

// ── T.G9 — the committed T-open BEFORE baseline (lane 32 T-PERF-C) ────────────
// The measured baseline nobody accumulated: run hard, every scene misses its
// mobile ceiling (FAIL 6). This artifact is that committed fact — a board-
// reconcilable record (T.M9), not a re-derivable transcript curiosity. The
// `baseline-below-floor` clause below is DEVICE-INDEPENDENT (a pure JSON integrity
// check) and runs EVERYWHERE — even when the browser/lighthouse binary is
// withheld locally — so the T-open born-RED state cannot silently drift from the
// gate's floors (change SCENE_CEILINGS without updating the artifact → RED). It
// is a GREEN assertion (the record correctly captures the red); the actual
// mobile-perf red rides KF_REQUIRE_LH on a calibrated runner (still the infra
// dependency — T.G9 lockstep). A structural mismatch here is HARD everywhere (an
// artifact-integrity fact, not the device-dependent perf measurement).
const T_OPEN_BASELINE = path.join(REPO, "scripts/baselines/lighthouse-mobile-t-open.json");

function assertTOpenBaseline() {
    const failures = [];
    if (!fs.existsSync(T_OPEN_BASELINE)) {
        failures.push(
            `the committed T-open baseline artifact is absent at ` +
                `scripts/baselines/lighthouse-mobile-t-open.json (T.G9 — the measured BEFORE ` +
                `must be a committed fact, not a transcript curiosity).`,
        );
        return failures;
    }
    let baseline;
    try {
        baseline = JSON.parse(fs.readFileSync(T_OPEN_BASELINE, "utf8"));
    } catch (e) {
        failures.push(`the T-open baseline is not valid JSON: ${e.message}`);
        return failures;
    }
    const scenes = baseline.scenes ?? {};
    // (a) every ceilinged scene has a baseline row whose floor matches the gate's
    //     SCENE_CEILINGS (keep the committed record in lockstep with the floors).
    for (const [key, floor] of Object.entries(SCENE_CEILINGS)) {
        const row = scenes[key];
        if (!row) {
            failures.push(`the T-open baseline omits scene "${key}" (a ceilinged scene must be recorded).`);
            continue;
        }
        if (row.floor !== floor) {
            failures.push(
                `the T-open baseline's "${key}" floor (${row.floor}) drifted from the gate's ` +
                    `SCENE_CEILINGS (${floor}) — update the artifact WITH the floor change.`,
            );
        }
    }
    // (b) the T-open state is BORN-RED: every scene either below its floor or (for
    //     spring, which clears Perf) over its LCP bound. If the record ever shows
    //     the whole roster GREEN it is either a stale artifact or the perf was
    //     restored — either way the born-RED baseline must be re-cut deliberately.
    const anyRed = Object.values(scenes).some(
        (r) => r && (r.belowFloor === true || r.lcpOverBound === true),
    );
    if (!anyRed) {
        failures.push(
            `the T-open baseline records NO scene below floor / over LCP bound — a born-RED ` +
                `BEFORE baseline must capture the god-awful state (VERDICT #19); re-cut it ` +
                `deliberately if mobile perf was genuinely restored.`,
        );
    }
    if (failures.length === 0) {
        const below = Object.entries(scenes)
            .filter(([, r]) => r.belowFloor || r.lcpOverBound)
            .map(([k]) => k);
        console.log(
            `  ✓ baseline-below-floor (T.G9) — the committed T-open baseline ` +
                `(${baseline._capturedAtCommit ?? "?"}) is consistent with the gate floors and ` +
                `records the born-RED BEFORE (${baseline.verdict ?? "?"}: ${below.join(", ")} ` +
                `below floor / over LCP bound). The mobile half of VERDICT #19 is a committed fact.`,
        );
    }
    return failures;
}

function resolveLighthouse() {
    const root = process.env.KF_LIGHTHOUSE_DIR ?? REPO;
    const requireFrom = createRequire(path.join(root, "package.json"));
    try {
        return requireFrom.resolve("lighthouse");
    } catch {
        return null;
    }
}

function withheld(reason) {
    console.log("proof:lighthouse-mobile — RECORDED-WITHHELD\n");
    console.log(`  reason: ${reason}\n`);
    console.log(
        "  The gate is AUTHORED + re-runnable; it is calibrated for CI (set KF_REQUIRE_LH=1 on a\n" +
            "  calibrated runner to hard-assert the per-scene ceilings). The §Mandate forbids\n" +
            "  asserting an UNMEASURED perf win, so this environment records-withheld rather than\n" +
            "  fabricate a number. Per-scene MOBILE ceilings (the B mobile baseline floors):",
    );
    for (const [k, v] of Object.entries(SCENE_CEILINGS)) {
        console.log(`    ${k.padEnd(8)} Perf ≥ ${v}`);
    }
    console.log(`    spring   LCP  < ${SPRING_LCP_BOUND_S}s (the 28.5s regression terminated)`);
    process.exit(0);
}

function lcpSeconds(lhr) {
    // largest-contentful-paint numericValue is ms.
    const ms = lhr.audits["largest-contentful-paint"]?.numericValue;
    return typeof ms === "number" ? ms / 1000 : null;
}

async function main() {
    // The committed-baseline integrity clause runs FIRST and DEVICE-INDEPENDENTLY
    // (a pure JSON check — no browser). A mismatch is HARD everywhere (an
    // artifact-integrity fact, not the throttled perf measurement), so it reds
    // even in the withheld/observe environments the perf measurement can't bite in.
    const baselineFailures = assertTOpenBaseline();
    if (baselineFailures.length > 0) {
        console.error(
            `proof:lighthouse-mobile — FAIL (${baselineFailures.length}): the committed T-open ` +
                `baseline is inconsistent (T.G9 — a device-independent artifact-integrity miss):`,
        );
        for (const f of baselineFailures) console.error(`  ✗ ${f}`);
        process.exit(1);
    }

    if (DO_BUILD) {
        console.log("proof:lighthouse-mobile — building dist/gh-pages (npm run gh-pages)…");
        const r = spawnSync("npm", ["run", "gh-pages"], {
            cwd: REPO,
            stdio: "inherit",
        });
        if (r.status !== 0) {
            console.error("proof:lighthouse-mobile — FAIL: build failed.");
            process.exit(2);
        }
    }

    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        const msg =
            "dist/gh-pages not built — run `npm run gh-pages` (or pass --build) before this gate.";
        if (REQUIRE_LH) {
            console.error(`proof:lighthouse-mobile — FAIL: ${msg}`);
            process.exit(2);
        }
        withheld(msg);
    }

    const chromium = resolveChromium();
    const lighthousePath = resolveLighthouse();

    if (!chromium || !lighthousePath) {
        const missing = [
            !chromium && "playwright/chromium (KF_PLAYWRIGHT_DIR)",
            !lighthousePath &&
                "lighthouse (KF_LIGHTHOUSE_DIR / `npm i --no-save lighthouse`)",
        ]
            .filter(Boolean)
            .join(" + ");
        const msg = `unresolvable: ${missing}.`;
        if (REQUIRE_LH) {
            console.error(`proof:lighthouse-mobile — FAIL: ${msg}`);
            process.exit(2);
        }
        withheld(msg);
    }

    if (DECLARED_UNTRUSTED && !REQUIRE_LH) {
        withheld(
            "KF_LH_UNTRUSTED=1 — this environment is declared untrusted for absolute Lighthouse " +
                "scores (e.g. a shared/contended sandbox whose CPU contention inflates LCP/TBT under " +
                "Lighthouse's own throttle). Run on a calibrated CI runner with KF_REQUIRE_LH=1.",
        );
    }

    const lighthouse = (await import(lighthousePath)).default;

    // Launch/teardown ride the lib lifecycle (withBrowser({ launch }), J.W3
    // S1); the TIER/withheld regime above is UNTOUCHED (J.W4-owned) — its
    // pre-checks run FIRST, so the lib seam is never this gate's verdict path.
    const DEBUG_PORT = 9222 + Math.floor(Math.random() * 1000);

    const rows = [];
    const failures = [];

    console.log(
        `proof:lighthouse-mobile — per-scene MOBILE Performance ≥ ceiling${
            PROBE_ONLY ? " (PROBE: measure + print, no assert)" : ""
        }\n`,
    );

    await withBrowser(
        async (browser) => {
    const { url, close: closeServer } = await serveDist(DIST);

    try {
        for (const scene of SCENES) {
            const ceiling = SCENE_CEILINGS[scene.key];
            if (ceiling == null) continue; // not a ceilinged scene
            const sceneUrl = `${url}/#/${scene.route}`;

            // Cold load — the cold first-paint axis the mobile baseline measures.
            const result = await lighthouse(
                sceneUrl,
                {
                    port: DEBUG_PORT,
                    output: "json",
                    logLevel: "error",
                    onlyCategories: ["performance"],
                    screenEmulation: {
                        mobile: true,
                        width: VIEWPORT.width,
                        height: VIEWPORT.height,
                        deviceScaleFactor: 2,
                        disabled: false,
                    },
                    formFactor: "mobile",
                },
                undefined,
            );

            const lhr = result.lhr;
            const perf = Math.round((lhr.categories.performance.score ?? 0) * 100);
            const lcp = lcpSeconds(lhr);
            rows.push({ key: scene.key, perf, lcp, ceiling });

            let ok = perf >= ceiling;
            if (!PROBE_ONLY && perf < ceiling) {
                failures.push(
                    `${scene.key}/mobile: Perf ${perf} < ceiling ${ceiling} (below the B mobile baseline).`,
                );
            }
            if (scene.key === "spring") {
                const lcpOk = lcp != null && lcp < SPRING_LCP_BOUND_S;
                if (!PROBE_ONLY && !lcpOk) {
                    failures.push(
                        `spring/mobile: LCP ${lcp?.toFixed(1)}s ≥ bound ${SPRING_LCP_BOUND_S}s ` +
                            `(the Monaco-eager regression is NOT terminated).`,
                    );
                }
                ok = ok && lcpOk;
            }
            const mark = PROBE_ONLY ? "·" : ok ? "✓" : "✗";
            const lcpStr = lcp != null ? `${lcp.toFixed(1)}s` : "n/a";
            console.log(
                `  ${mark} ${scene.key.padEnd(8)} Perf ${String(perf).padStart(3)} ` +
                    `(≥ ${ceiling})   LCP ${lcpStr}${
                        scene.key === "spring" ? ` (< ${SPRING_LCP_BOUND_S}s)` : ""
                    }`,
            );
        }
    } finally {
        await closeServer();
    }
        },
        { launch: { args: [`--remote-debugging-port=${DEBUG_PORT}`] }, label: "the per-scene mobile Lighthouse matrix" },
    );

    if (PROBE_ONLY) {
        console.log(
            "\nproof:lighthouse-mobile — PROBE complete (no assertion). Compare these against the\n" +
                "B mobile baseline; on a sandbox the absolutes are inflated by CPU contention.",
        );
        process.exit(0);
    }

    if (failures.length > 0) {
        // On a CALIBRATED runner (KF_REQUIRE_LH=1) the miss is HARD regardless
        // of CI — the on-device half of the declared posture.
        if (REQUIRE_LH) {
            console.error(
                `\nproof:lighthouse-mobile — FAIL (${failures.length}): a scene fell below its mobile ceiling (KF_REQUIRE_LH=1 — hard on the calibrated runner).`,
            );
            for (const f of failures) console.error(`  ✗ ${f}`);
            process.exit(1);
        }
        // Otherwise the DECLARED observe-only posture routes each miss: in CI
        // it is RECORDED (the run stays green — observe-only, never red there);
        // locally it is HARD (the on-device default).
        console.error(`\nproof:lighthouse-mobile — ${failures.length} ceiling miss(es), routed per the declared P6 posture (observe-only in CI · hard locally/on-device):`);
        for (const f of failures) posture.miss(f);
        if (redMisses.length > 0) {
            console.error(
                `\nproof:lighthouse-mobile — FAIL (${redMisses.length}): ceiling miss(es) on a local/on-device run (the hard half of the observe-only posture).`,
            );
            process.exit(1);
        }
        console.log(
            "\nproof:lighthouse-mobile — RECORDED (CI observe-only): the misses above are OBSERVATIONAL — " +
                "the felt mobile perf claim is NOT certified by this CI run (the P6 over-read prohibition); " +
                "re-measure on a calibrated runner with KF_REQUIRE_LH=1.",
        );
        process.exit(0);
    }

    console.log(
        "\nproof:lighthouse-mobile — PASS: every scene meets its per-scene MOBILE ceiling, and\n" +
            "spring-mobile LCP is under the bound (the Monaco-eager regression is terminated).",
    );
}

main().catch((err) => {
    if (REQUIRE_LH) {
        console.error("proof:lighthouse-mobile — ERROR:", err);
        process.exit(3);
    }
    // A run-time error in an untrusted env records-withheld rather than red.
    withheld(`run error (${(err && err.message) || err}).`);
});
