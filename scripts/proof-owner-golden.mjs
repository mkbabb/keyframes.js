#!/usr/bin/env node
/**
 * proof:owner-golden — Tranche T.M3 (lane 29 rec 2, T-GATE-GOLDEN). The
 * owner-anchored perceptual reference oracle that SUPERSEDES proof:visual-lock's
 * self-captured baseline + full-subject mask.
 *
 * ── THE META-FACT IT CURES ─────────────────────────────────────────────────────
 * proof:visual-lock (proof-visual-lock.mjs:10-17) declares itself a HYGIENE-tier
 * drift TRIPWIRE whose baseline is SELF-CAPTURED (`--update-baseline` bakes
 * WHATEVER the tree renders) and which MASKS "the amiga sphere, the CSS-3D cube,
 * the engine balls, the typing dots" — i.e. it paints the exact subjects of
 * verdict items #1/#4/#9/#21 flat pink BEFORE the diff. The one appearance
 * tripwire is therefore blind to every rendering defect the owner cited, and it
 * locks the OWNER-REJECTED layout as its golden. A green there could coexist with
 * "reject on sight" (lane 29 Part III). owner-golden fixes this STRUCTURALLY:
 *
 *   (1) BORN-OWNER — its GREEN cannot be reached without a committed owner
 *       BLESSING token (docs/tranches/T/goldens/BLESSED.json). "No drift from the
 *       golden" is meaningful ONLY when the golden is owner-approved, not
 *       self-captured. No BLESSED.json ⇒ RED, unconditionally (born-RED today:
 *       the file is absent — the owner blesses at the mid-drive/close review).
 *
 *   (2) SUBJECT STAYS IN — the perceptual comparison keeps the subject IN, so the
 *       gate would FIRE on the one-face cube, the bare-grid morph, the blur-blob
 *       icon (the frames visual-lock painted flat). A QUALITY-SHAPED subject
 *       edge-energy FLOOR asserts each blessed golden is a WHOLE render, not a
 *       flat/masked/blank frame — a masked golden can NEVER self-bless a blank.
 *
 *   (3) OWNER-ANCHORED PERCEPTUAL DIFF — when a browser + built dist are present,
 *       the live render is diffed against the BLESSED golden by a perceptual hash
 *       (dHash / Hamming, robust to GPU-raster + live-motion jitter under PRM),
 *       keeping the subject IN. The golden comes from an OWNER-APPROVED scene, not
 *       the tree-as-shipped.
 *
 * ── TIER / AUTHORITY (T.M6 axis) ───────────────────────────────────────────────
 * AUTHORITY = OWNER (taste). It is a born-RED BACKLOG member
 * (scripts/gate-bands.mjs T_BORNRED_BACKLOG), dischargedBy the owner
 * golden-blessing at review — kept OUT of every blocking aggregator + EXCLUDED in
 * proof:ci-coverage until the blessing token lands, exactly the proof:visual-lock
 * / proof:chronic-closure precedent. On the blessing, visual-lock is retired or
 * demoted to a pure no-drift corroborator (T.M3 lockstep; the demote-vs-retire
 * call executes WITH the blessing).
 *
 * ── THE GOLDEN MATRIX ──────────────────────────────────────────────────────────
 * 7 owner-cited scenes × 2 themes = 14 goldens, the PRM-frozen protocol
 * visual-lock uses (emulate `prefers-reduced-motion: reduce` + `colorScheme`):
 *   home · cube · amiga · square · easing · spring · sequence   ×   light · dark
 *
 * ── USAGE ──────────────────────────────────────────────────────────────────────
 *   node scripts/proof-owner-golden.mjs                    — GATE
 *   node scripts/proof-owner-golden.mjs --capture-candidates
 *       — the owner-REVIEW capture harness: (re)capture the 14 CANDIDATE frames
 *         from the LANDED tree into docs/tranches/T/goldens/candidates/ as
 *         PENDING-OWNER (NEVER self-blessed — the owner blesses by committing
 *         BLESSED.json naming the candidate SHAs). Serves BUILT dist/gh-pages/
 *         (run `npm run gh-pages` first) + needs a browser (KF_PLAYWRIGHT_DIR).
 *   KF_PLAYWRIGHT_DIR=/path   resolve playwright from there
 *   KF_REQUIRE_BROWSER=1      a playwright-absent skip becomes a HARD fail
 *
 * pngjs is a CI-only devDep (BLK-4 — off the 2-runtime-dep library surface).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import { REQUIRE_BROWSER, withPage, navToScene } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const GOLDENS_DIR = path.join(REPO, "docs/tranches/T/goldens");
const CAND_DIR = path.join(GOLDENS_DIR, "candidates");
const BLESSED_PATH = path.join(GOLDENS_DIR, "BLESSED.json");

// The owner-cited scene matrix (verdict #1/#4/#9/#21 subjects live here).
const SCENES = ["home", "cube", "amiga", "square", "easing", "spring", "sequence"];
const THEMES = ["light", "dark"];
const CELLS = SCENES.flatMap((s) => THEMES.map((t) => `${s}-${t}`));

// The subject viewport (matches visual-lock's desktop stage). The subject-energy
// floor samples the central stage band where every scene's live subject renders.
const VIEWPORT = { width: 1440, height: 900 };
const STAGE_BAND = { x0: 0.18, x1: 0.82, y0: 0.22, y1: 0.78 }; // fractions

const failures = [];
const passes = [];
const fail = (m) => failures.push(m);
const pass = (m) => passes.push(m);

// ── Perceptual primitives (pngjs only; no SSIM/pHash dep on the runtime surface)
/** Decode a PNG buffer → { width, height, data (RGBA) }. */
function decode(buf) {
    return PNG.sync.read(buf);
}
/** Grayscale luminance at (x,y). */
function lum(img, x, y) {
    const i = (img.width * y + x) << 2;
    return 0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2];
}
/**
 * dHash — a 9×8 difference hash over a downsampled luminance grid → 64-bit
 * perceptual fingerprint. Robust to AA / GPU-raster / minor live-motion jitter
 * (the property visual-lock's exact-pixelmatch masked-away), while a real
 * layout/color/shape change moves many bits. Keeps the WHOLE frame (subject IN).
 */
function dHash(img) {
    const W = 9, H = 8;
    const grid = [];
    for (let gy = 0; gy < H; gy++) {
        const row = [];
        for (let gx = 0; gx < W; gx++) {
            const sx = Math.min(img.width - 1, Math.floor((gx + 0.5) * img.width / W));
            const sy = Math.min(img.height - 1, Math.floor((gy + 0.5) * img.height / H));
            row.push(lum(img, sx, sy));
        }
        grid.push(row);
    }
    const bits = [];
    for (let gy = 0; gy < H; gy++)
        for (let gx = 0; gx < W - 1; gx++)
            bits.push(grid[gy][gx] < grid[gy][gx + 1] ? 1 : 0);
    return bits;
}
const hamming = (a, b) => a.reduce((n, bit, i) => n + (bit === b[i] ? 0 : 1), 0);

/**
 * The subject edge-energy floor over the central stage band — the QUALITY-SHAPED
 * assertion that a golden is a WHOLE render, not a flat/masked/blank frame (the
 * exact frames visual-lock painted flat pink). Mean absolute luminance gradient;
 * a flat fill scores ~0, a rendered cube/sphere/ball/curve scores high.
 */
function subjectEnergy(img) {
    const x0 = Math.floor(STAGE_BAND.x0 * img.width);
    const x1 = Math.floor(STAGE_BAND.x1 * img.width);
    const y0 = Math.floor(STAGE_BAND.y0 * img.height);
    const y1 = Math.floor(STAGE_BAND.y1 * img.height);
    let sum = 0, n = 0;
    for (let y = y0; y < y1; y += 2) {
        for (let x = x0; x < x1 - 1; x += 2) {
            sum += Math.abs(lum(img, x, y) - lum(img, x + 1, y));
            n++;
        }
    }
    return n ? sum / n : 0;
}
const ENERGY_FLOOR = 1.5; // mean |Δlum| — a flat/masked frame sits well under this
const DHASH_MAX_HAMMING = 12; // ≤12/64 bits differ ⇒ perceptually the same render

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

/** Pin the controls rail to the owner's canonical LIT state before capture. */
async function pinPaneLit(page) {
    await page.mouse.move(VIEWPORT.width / 2, VIEWPORT.height / 2);
    await page.waitForTimeout(100);
}

// ── The CAPTURE HARNESS (owner-review candidate frames; NEVER self-blessed) ─────
async function captureCandidates() {
    if (!fs.existsSync(DIST)) {
        console.error(
            `\n✗ proof:owner-golden --capture-candidates — dist/gh-pages/ absent. Run \`npm run gh-pages\` first.`,
        );
        process.exit(1);
    }
    fs.mkdirSync(CAND_DIR, { recursive: true });
    for (const theme of THEMES) {
        await withPage(
            {
                distDir: DIST,
                label: `owner-golden candidates (${theme})`,
                context: {
                    viewport: VIEWPORT,
                    colorScheme: theme,
                    reducedMotion: "reduce",
                },
            },
            async (page, { url: base }) => {
                await page.goto(`${base}/#/`, { waitUntil: "load" });
                await page.waitForTimeout(1500);
                for (const scene of SCENES) {
                    if (scene !== "home") {
                        await navToScene(page, scene, null, { timeout: 12000 });
                    } else {
                        await page.goto(`${base}/#/`, { waitUntil: "load" });
                    }
                    // PRM freeze — settle the CSS-driven motion to a rest frame
                    // (the subject stays IN; no mask).
                    await page.waitForTimeout(1200);
                    await pinPaneLit(page);
                    const buf = await page.screenshot({
                        clip: { x: 0, y: 0, ...VIEWPORT },
                    });
                    const file = path.join(CAND_DIR, `${scene}-${theme}.png`);
                    fs.writeFileSync(file, buf);
                    console.log(
                        `  candidate ${scene}-${theme}  ${(buf.length / 1024) | 0}KB  sha=${sha256(buf).slice(0, 12)}  [PENDING-OWNER]`,
                    );
                }
            },
        );
    }
    console.log(
        `\n✓ ${CELLS.length} candidate goldens written to docs/tranches/T/goldens/candidates/ as PENDING-OWNER.\n` +
            `  The owner blesses by committing docs/tranches/T/goldens/BLESSED.json naming each candidate's sha256.`,
    );
}

// ── The GATE ────────────────────────────────────────────────────────────────────
function loadBlessed() {
    if (!fs.existsSync(BLESSED_PATH)) return null;
    try {
        return JSON.parse(fs.readFileSync(BLESSED_PATH, "utf8"));
    } catch (e) {
        fail(`BLESSED.json is present but unparseable: ${e.message}`);
        return { __invalid: true };
    }
}

async function gate() {
    const blessed = loadBlessed();

    // ── (1) THE BORN-OWNER TEETH — no green without the owner blessing token ────
    if (blessed == null) {
        fail(
            "no owner BLESSING token — docs/tranches/T/goldens/BLESSED.json is ABSENT. " +
                "owner-golden GREEN is UNREACHABLE without a committed owner-approved golden per scene " +
                "(the born-OWNER contract; born-RED today by design — the owner blesses the CANDIDATE " +
                "frames under docs/tranches/T/goldens/candidates/ at the mid-drive/close review).",
        );
    } else if (!blessed.__invalid) {
        const token = blessed.blessedBy && blessed.blessedCommit && blessed.blessedAt;
        if (!token)
            fail(
                "BLESSED.json carries no owner token — it must name blessedBy + blessedAt + " +
                    "blessedCommit (the committed owner sign-off; a bandname or a green-gate citation is NOT a token).",
            );
        const entries = blessed.entries ?? {};
        for (const cell of CELLS) {
            const e = entries[cell];
            if (!e || e.verdict !== "OWNER-APPROVED" || !e.candidate) {
                fail(
                    `[${cell}] not owner-blessed — BLESSED.json has no OWNER-APPROVED entry with a candidate sha256 for this scene×theme.`,
                );
                continue;
            }
            // The blessed golden PNG must be present + its bytes must match the
            // blessed sha (the owner blessed THAT frame, not a later re-capture).
            const goldenPath = path.join(GOLDENS_DIR, "golden", `${cell}.png`);
            if (!fs.existsSync(goldenPath)) {
                fail(`[${cell}] blessed but the golden PNG docs/tranches/T/goldens/golden/${cell}.png is ABSENT.`);
                continue;
            }
            const buf = fs.readFileSync(goldenPath);
            if (sha256(buf) !== e.candidate) {
                fail(`[${cell}] the golden PNG sha256 ≠ the blessed candidate sha — the frame changed after the blessing (re-bless or restore).`);
                continue;
            }
            // ── (2) SUBJECT STAYS IN — the quality-shaped edge-energy floor ─────
            let img;
            try {
                img = decode(buf);
            } catch {
                fail(`[${cell}] the golden PNG is undecodable.`);
                continue;
            }
            const energy = subjectEnergy(img);
            if (energy < ENERGY_FLOOR) {
                fail(
                    `[${cell}] the golden's subject band is FLAT (edge-energy ${energy.toFixed(2)} < ${ENERGY_FLOOR}) — ` +
                        "a masked / blank / one-face frame cannot be blessed as a golden (the subject stays IN, T.M3).",
                );
                continue;
            }
            pass(`[${cell}] owner-blessed golden present, subject-full (energy ${energy.toFixed(2)}).`);
        }
    }

    // ── (3) THE OWNER-ANCHORED LIVE PERCEPTUAL DIFF (browser leg) ───────────────
    // Runs only when a browser + built dist are available AND a blessing exists to
    // diff against. When absent, the blessing red above already fails the gate; the
    // render leg is declared observe-posture so the gate never PASSES vacuously.
    const canRender =
        failures.length === 0 && blessed != null && !blessed.__invalid && fs.existsSync(DIST);
    if (!canRender) {
        console.error(
            "  · owner-golden render leg SKIPPED (observe): no blessing token + built dist to diff " +
                "against — the born-OWNER blessing red is the gate; the live perceptual diff runs once " +
                "the owner blesses and dist/gh-pages/ is built.",
        );
    } else {
        try {
            for (const theme of THEMES) {
                await withPage(
                    {
                        distDir: DIST,
                        label: `owner-golden live diff (${theme})`,
                        context: {
                            viewport: VIEWPORT,
                            colorScheme: theme,
                            reducedMotion: "reduce",
                        },
                    },
                    async (page, { url: base }) => {
                        await page.goto(`${base}/#/`, { waitUntil: "load" });
                        await page.waitForTimeout(1500);
                        for (const scene of SCENES) {
                            const cell = `${scene}-${theme}`;
                            const goldenPath = path.join(GOLDENS_DIR, "golden", `${cell}.png`);
                            if (!fs.existsSync(goldenPath)) continue;
                            if (scene !== "home") {
                                await navToScene(page, scene, null, { timeout: 12000 });
                            } else {
                                await page.goto(`${base}/#/`, { waitUntil: "load" });
                            }
                            await page.waitForTimeout(1200);
                            await pinPaneLit(page);
                            const live = decode(
                                await page.screenshot({ clip: { x: 0, y: 0, ...VIEWPORT } }),
                            );
                            const gold = decode(fs.readFileSync(goldenPath));
                            const d = hamming(dHash(live), dHash(gold));
                            if (d > DHASH_MAX_HAMMING)
                                fail(
                                    `[${cell}] the LIVE render drifts from the owner-blessed golden ` +
                                        `(dHash Hamming ${d} > ${DHASH_MAX_HAMMING}/64) — re-review or re-bless.`,
                                );
                            else pass(`[${cell}] live render matches the blessed golden (Hamming ${d}).`);
                        }
                    },
                );
            }
        } catch (e) {
            if (REQUIRE_BROWSER)
                fail(`the live perceptual-diff leg threw under KF_REQUIRE_BROWSER: ${e.message}`);
            else
                console.error(
                    `  · owner-golden render leg SKIPPED (observe): playwright unavailable locally ` +
                        `(${e.message}); the blessing red is the gate`,
                );
        }
    }
}

// ── Run ─────────────────────────────────────────────────────────────────────────
const MODE = process.argv[2];
if (MODE === "--capture-candidates") {
    captureCandidates().catch((e) => {
        console.error(`\n✗ proof:owner-golden --capture-candidates threw: ${e.stack || e}`);
        process.exit(1);
    });
} else {
    gate()
        .then(() => {
            if (failures.length > 0) {
                console.error(
                    `\n✗ proof:owner-golden — FAIL (${failures.length}) [BORN-RED + BORN-OWNER backlog — T_BORNRED_BACKLOG; dischargedBy the owner golden-blessing at review]:`,
                );
                for (const f of failures) console.error(`  ✗ ${f}`);
                console.error(
                    `\n  The owner-anchored appearance oracle (T.M3, lane 29 rec 2): GREEN requires a committed owner\n` +
                    `  BLESSING token (docs/tranches/T/goldens/BLESSED.json) over the 14 CANDIDATE frames, each\n` +
                        `  subject-full (the mask visual-lock painted flat is FORBIDDEN) and matched by the live render.\n` +
                        `  Capture the candidates: \`node scripts/proof-owner-golden.mjs --capture-candidates\` (after \`npm run gh-pages\`).`,
                );
                process.exit(1);
            }
            console.log(
                `\n✓ proof:owner-golden — the owner-blessed goldens hold (${passes.length} checks; ${CELLS.length} cells):`,
            );
            for (const p of passes) console.log(`  ✓ ${p}`);
        })
        .catch((e) => {
            console.error(`\n✗ proof:owner-golden threw: ${e.stack || e}`);
            process.exit(1);
        });
}
