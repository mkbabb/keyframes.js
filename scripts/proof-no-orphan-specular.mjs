#!/usr/bin/env node
/**
 * proof:no-orphan-specular — H.W2 S1+S3, INVERTED at H.W9 F3+F6 (exception set → ∅).
 *
 * THE DEFECT, ORIGINALLY (D2/D14, the "strange circular/radial blur on hover
 * everywhere"). glass-ui's `<Card surface="glass">` (the DEFAULT) bolts on
 * `glass-specular-track` (`CardFooter:37`), an iOS catch-light `::before` radial
 * that is MEANT to ride the cursor — but the Card never wires the pointer seam
 * (`--mouse-x`/`--mouse-y`), so it falls to its `var(--mouse-x, 50%)` centred floor
 * and merely BRIGHTENS on hover (a static, dead-centred warm-white bloom). Every
 * panel inherited it via the default surface. H.W2's gestalt move flipped every
 * kf-owned panel/sidebar `<Card>` to `surface="cartoon"` (the surface map then
 * STOPS EMITTING `glass-specular-track` at SOURCE) and kept ONE deliberately-glassy
 * exception — the cubic-bézier composite (`.cartoon-specular glass-specular-track` +
 * `useSpecularPointer`).
 *
 * THE INVERSION (H.W9 F3+F6 — the user-feedback fold). The user read the lone
 * composite's tracked catch-light as too-dramatic (F3) AND inconsistent — present on
 * ONE card only (F6) — and the lead adopted REMOVE: the tracked-specular subsystem
 * is DELETED entirely (the `.cartoon-specular` recipe, the manual
 * `glass-specular-track` class on the bezier Card, the `useSpecularPointer` wire +
 * composable file). The calm register is now glass + cartoon, broad, with NO tracked
 * catch-light: every panel is `surface="cartoon" tier="quiet"`. So the W2 ENUMERATED
 * EXCEPTION SET `{TimingFunctionPanel bezier}` COLLAPSES TO ∅:
 *
 *     NEW INVARIANT — ZERO `.glass-specular-track` (and ZERO `.cartoon-specular`)
 *     on ANY kf-owned `<Card>`. No exception. No tracked catch-light on any panel.
 *
 * This is STRONGER than the W2 form (which still tolerated the bezier composite): it
 * now reds on the bezier composite that existed TODAY (born-RED on the pre-H.W9
 * tree), greens on its removal, AND still bites a re-introduced `surface="glass"`
 * (the orphan default) or any re-added `glass-specular-track`/`cartoon-specular` on a
 * Card. It is the chronic-closure-discipline SYSTEM-property gate that REPLACES the
 * retired ones (`proof:cartoon-specular-coexist` + `proof:specular-calm`, whose
 * subject — the composite — no longer exists): "NO panel paints a tracked
 * catch-light." The D2 cartoon-shadow chronic STAYS CLOSED via this stronger
 * property (the H.W8 meta-gate's D2 load-bearing set is `proof:cartoon-is-panel-depth`
 * + this inverted `proof:no-orphan-specular` + `proof:glass-and-cartoon` + the paired
 * `proof:specular-handoff`).
 *
 * This gate polices the kf-OWNED surfaces (inv-16 — the remaining glass-ui
 * `<Button glass>` + dock-icon tracks are S5 HANDOFF territory, RECORDED here,
 * NOT failed; they ride proof:specular-handoff born-RED).
 *
 * Three falsifiable halves, each BITING on the exact regression:
 *
 *   1. SOURCE-INVARIANT (STATIC — always runs). Over every demo `*.vue`: EVERY
 *      `<Card …>` opening tag resolves `surface="cartoon"`, carries NO
 *      `glass-specular-track` AND NO `cartoon-specular` AND NO manual `.glass-card`
 *      plate (CS-3). The exception set is ∅ — there is no enumerated composite. NO
 *      `<Card>` is permitted a tracked catch-light. BITE: a new `<Card>` (no
 *      surface= → defaults glass → emits the orphan track) reds; a Card retaining
 *      glass reds; a Card carrying `glass-specular-track`/`cartoon-specular` (the
 *      re-introduced composite) reds; a manual `.glass-card` on a Card reds.
 *
 *   2. NO-ORPHAN-CARD COMPUTED (BROWSER — gated). Sweep the panel-bearing routes
 *      (cube/easing/spring); collect every `.glass-specular-track` element. The
 *      INVARIANT: ZERO of them is a kf-owned `<Card>` (`[data-surface]`) — no
 *      exception. The remaining tracks (all `<BUTTON>` / dock icons — glass-ui-owned)
 *      are RECORDED with their `anyPointerWrite:false` status as the S5 HANDOFF
 *      residue, NOT failed. BITE: revert a panel to `surface="glass"` → it re-emits
 *      an orphan `glass-specular-track` on a `[data-surface=glass]` Card → reds;
 *      re-add the bezier composite → its Card carries the track → reds.
 *
 *   3. HOVER ::before — NO CATCH-LIGHT RADIAL ON ANY CARD (BROWSER — gated, the
 *      WV-W2-LOW-3 storm-robust COMPUTED check as PRIMARY). Hover EVERY cartoon panel
 *      Card (no composite exclusion — the composite is gone); its `::before` must NOT
 *      paint the specular warm-white catch-light radial. A hovered panel shows the
 *      cartoon offset-stamp depth, no centred (or tracked) bloom. NON-VACUITY: ≥1
 *      cartoon Card is actually hovered. BITE: a panel that still emits the specular
 *      `::before` (the `rgba(255,255,255,0.55)` warm-white radial core) on hover →
 *      reds (a tracked or centred catch-light survives).
 *
 * Mirrors scripts/proof-demo-shell-grid.mjs / proof-stage-not-clipped.mjs (the
 * serveDist + Playwright + FSM-settle plumbing). Scene switches are driven IN-PAGE
 * (NOT page.goto). Under KF_REQUIRE_BROWSER a playwright-absent skip becomes a hard
 * fail so a SHIP is never green-reported un-exercised. Re-runnable:
 * `node scripts/proof-no-orphan-specular.mjs`. Serves the BUILT dist/gh-pages/.
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
const note = (label) => console.log(`  · ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const read = (p) => fs.readFileSync(p, "utf8");
const rel = (p) => path.relative(REPO, p).split(path.sep).join("/");

console.log(
    "proof:no-orphan-specular — H.W2 S1+S3 INVERTED at H.W9 F3+F6 " +
        "(the tracked-specular death lock · exception set → ∅)",
);

// H.W9 F3+F6: the W2 enumerated composite exception is DELETED. The recipe class
// `.cartoon-specular` and the `glass-specular-track` class must appear on ZERO
// kf-owned <Card> — there is no permitted composite. (Named here only so a re-added
// recipe is caught by the source-invariant clause.)
const TRACKED_SPECULAR_CLASSES = ["glass-specular-track", "cartoon-specular"];

// ── 1. SOURCE-INVARIANT (static, always runs) ─────────────────────────────────
{
    // Collect every demo *.vue, comment-blanked so a doc-comment naming a deleted
    // class does not false-positive (mirrors proof-demo-shell-grid blankComments).
    const blankComments = (s) =>
        s
            .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
            .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length))
            .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));

    const collectVue = (root) => {
        const out = [];
        const walk = (dir) => {
            for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
                const abs = path.join(dir, e.name);
                if (e.isDirectory()) {
                    if (e.name === "node_modules" || e.name === "dist") continue;
                    walk(abs);
                } else if (e.name.endsWith(".vue")) {
                    out.push(abs);
                }
            }
        };
        if (fs.existsSync(root)) walk(root);
        return out;
    };

    // Match every `<Card …>` opening tag (NOT CardContent/Header/Footer/Title/
    // Description). Allows attributes spanning newlines.
    const cardOpenTags = (src) => [...src.matchAll(/<Card(?![A-Za-z])[\s\S]*?>/g)].map((m) => m[0]);

    const files = collectVue(DEMO);
    const offenders = [];
    let cardTotal = 0;
    let cartoonCount = 0;

    for (const abs of files) {
        const raw = read(abs);
        const src = blankComments(raw);
        const tags = cardOpenTags(src);
        for (const tag of tags) {
            cardTotal += 1;
            const flat = tag.replace(/\s+/g, " ").slice(0, 110);
            const hasGlassCard = /\bglass-card\b/.test(tag);
            const trackedClass = TRACKED_SPECULAR_CLASSES.find((c) =>
                new RegExp(`\\b${c}\\b`).test(tag),
            );
            const surfaceM = tag.match(/surface\s*=\s*"([^"]+)"/);
            const surface = surfaceM ? surfaceM[1] : "(default→glass)";

            // CS-3: no manual .glass-card plate on any Card.
            if (hasGlassCard) {
                offenders.push(`${rel(abs)} — <Card> carries the manual .glass-card plate (CS-3 — the surface owns the plate): \`${flat}\``);
                continue;
            }

            // H.W9 F3+F6 — the exception set is ∅: NO Card may carry a tracked
            // catch-light class. The W2 composite (cartoon-specular + glass-specular-
            // track on the bezier Card) is REMOVED — a re-introduction reds here.
            if (trackedClass) {
                offenders.push(`${rel(abs)} — <Card> carries \`${trackedClass}\` (the tracked-specular subsystem is REMOVED at H.W9 F3+F6 — exception set → ∅; no Card may paint a tracked catch-light): \`${flat}\``);
                continue;
            }

            // Every Card MUST be surface="cartoon" (the gestalt move). A default-glass
            // Card (no surface=) re-inherits the orphan track; a retained surface="glass"
            // re-emits it. The footprint invariant: cartoon, with no specular, full stop.
            if (surface === "cartoon") {
                cartoonCount += 1;
            } else {
                offenders.push(`${rel(abs)} — <Card> resolves surface=${surface}, NOT cartoon (every kf-owned Card is surface="cartoon"; the exception set is ∅): \`${flat}\``);
            }
        }
    }

    if (offenders.length === 0) {
        ok(
            `source-invariant: all ${cartoonCount}/${cardTotal} kf-owned <Card>s resolve ` +
                `surface="cartoon" with NO tracked-specular class (glass-specular-track / ` +
                `cartoon-specular) and NO manual .glass-card plate (CS-3). The exception set is ∅ ` +
                `— no panel carries a tracked catch-light (H.W9 F3+F6). (${files.length} demo *.vue, ` +
                `comment-blanked)`,
        );
    } else {
        fail(
            `source-invariant — ${offenders.length} kf-owned <Card> orphan/violation(s) ` +
                `(every Card must be surface="cartoon" with NO glass-specular-track / cartoon-specular ` +
                `/ .glass-card — the exception set is ∅):\n      ` +
                offenders.join("\n      "),
        );
    }
}

// ── browser halves (gated) ────────────────────────────────────────────────────
const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the no-orphan-specular computed assertions cannot pass vacuously",
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
const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";

function serveDist() {
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
    return server;
}

/** Open a scene in a FRESH context at its canonical FIRST-LOAD mount.
 *
 * The orphan-specular footprint is route- AND state-dependent (CP-MED-2): the
 * sub-Cards that emit the orphan track (e.g. the EasingSidebar value-bar) mount
 * in a specific first-load state that a cube→scene in-page hash TRANSITION does
 * NOT reliably reproduce. A fresh context + a direct `goto #/<scene>` mounts each
 * scene in the exact state where the defect manifests live. `goto` clearing
 * storage is FINE here — this clause tests FIRST-LOAD surface emission, NOT the
 * H.W1 FSM reconcile trap; the pane-open flag is re-seeded via `addInitScript`
 * BEFORE the load so the controls Cards are mounted + measurable. */
async function openSceneFresh(browser, base, scene, viewportWidth) {
    const ctx = await browser.newContext({ viewport: { width: viewportWidth, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((ck) => {
        try {
            localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true }));
        } catch {
            /* ignore */
        }
    }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page
        .waitForFunction(
            ([mk, s]) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s;
                } catch {
                    return false;
                }
            },
            [MACHINE_KEY, scene],
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.setViewportSize({ width: viewportWidth, height: 900 });
    await page.waitForTimeout(900); // route rested + the scene's sub-Cards mounted
    return { ctx, page };
}

// The warm-white specular catch-light radial signature. glass-ui's `::before`
// paints `radial-gradient(circle …, rgba(255,255,255,0.55) 0%, …)` — the 0.55
// white core is the unmistakable catch-light. A cartoon surface (the radial gone)
// has NO such `::before` background. (Chrome serializes the computed gradient
// WITHOUT an explicit `at 50% 50%` even when --mouse-x is set, so the centred-vs-
// tracked distinction is NOT in the serialized `background-image` — the
// storm-robust signal is the PRESENCE of the warm-white radial itself, per
// WV-W2-LOW-3 "COMPUTED ::before check as PRIMARY".)
const SPECULAR_RADIAL = /radial-gradient\([^)]*rgba\(255,\s*255,\s*255,\s*0\.55\)/;

async function browserHalves() {
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

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;

    const VW = 1440;
    const SCENES = ["cube", "easing", "spring"];
    const browser = await chromium.launch();
    try {
        // ── 2. NO-ORPHAN-CARD COMPUTED + 3. HOVER ::before (one fresh ctx/scene) ──
        let orphanCards = [];
        let buttonTracks = 0;
        let anyPointerWriteOnButtons = false;
        let hoveredPanels = 0;
        let bloomViolations = [];

        for (const scene of SCENES) {
            const { ctx, page } = await openSceneFresh(browser, base, scene, VW);
            try {
                // (2) the orphan-card invariant — NO .glass-specular-track that is a
                // kf-owned <Card> ([data-surface]) is permitted. Exception set ∅.
                const probe = await page.evaluate(() => {
                    const tracks = [...document.querySelectorAll(".glass-specular-track")];
                    return tracks.map((t) => ({
                        tag: t.tagName,
                        isCard: t.hasAttribute("data-surface"),
                        surface: t.getAttribute("data-surface") || "(none)",
                        // anyPointerWrite — the stable invariant anchor (CP-MED-2):
                        // an unwired track has no --mouse-x inline write.
                        hasMouseWrite: t.style.getPropertyValue("--mouse-x").trim() !== "",
                    }));
                });

                for (const t of probe) {
                    if (t.isCard) {
                        orphanCards.push(`${scene}: a [data-surface=${t.surface}] <Card> carries glass-specular-track (the tracked-specular subsystem is REMOVED — exception set → ∅)`);
                    } else {
                        buttonTracks += 1;
                        if (t.hasMouseWrite) anyPointerWriteOnButtons = true;
                    }
                }

                // (3) the hover ::before — NO CATCH-LIGHT RADIAL on ANY panel/sidebar
                // cartoon Card (no composite exclusion — the composite is gone).
                const handles = await page.$$(`[data-surface="cartoon"]`);
                for (let i = 0; i < handles.length; i++) {
                    try {
                        await handles[i].hover({ timeout: 1500, force: true });
                        await page.waitForTimeout(200);
                        const beforeBg = await handles[i].evaluate(
                            (el) => getComputedStyle(el, "::before").backgroundImage,
                        );
                        hoveredPanels += 1;
                        if (SPECULAR_RADIAL.test(beforeBg)) {
                            bloomViolations.push(`${scene}#${i}: hovered cartoon panel still paints the specular ::before warm-white radial (${beforeBg.slice(0, 70)}…)`);
                        }
                    } catch {
                        /* un-hoverable Card — not counted toward the witness floor */
                    }
                    await handles[i].dispose?.();
                    await page.mouse.move(2, 2);
                    await page.waitForTimeout(60);
                }
            } finally {
                await ctx.close();
            }
        }

        if (orphanCards.length === 0) {
            ok(
                `no-orphan-card: ZERO kf-owned <Card>s carry a glass-specular-track across ` +
                    `${SCENES.join("/")} first-load mounts — the exception set is ∅ (H.W9 F3+F6; the W2 ` +
                    `composite is removed). The tracked-specular radial is dead on EVERY panel/sidebar Card.`,
            );
            // RECORD the glass-ui-owned residue (S5 HANDOFF, inv-16 — NOT failed).
            note(
                `S5 HANDOFF residue (inv-16, RECORDED not failed): ${buttonTracks} <Button>/dock ` +
                    `glass-specular-track(s) remain across the routes — glass-ui-owned surfaces ` +
                    `(the Card-default seam + dock-icon tune ride proof:specular-handoff born-RED). ` +
                    `anyPointerWrite on those = ${anyPointerWriteOnButtons} (the unwired residue is ` +
                    `glass-ui's to wire-or-omit, NOT kf's — re-authoring them would violate inv-16).`,
            );
        } else {
            fail(
                `no-orphan-card — ${orphanCards.length} kf-owned <Card>(s) carry a ` +
                    `glass-specular-track (the tracked-specular subsystem must be removed on EVERY ` +
                    `panel — flip to surface="cartoon" with no specular class):\n      ` +
                    orphanCards.slice(0, 8).join("\n      "),
            );
        }

        if (hoveredPanels === 0) {
            // NON-VACUITY: a no-bloom assertion that never hovered anything is a
            // vacuous pass — fail under browser-required.
            skipOrFail("the hover ::before check hovered ZERO cartoon panels (non-vacuity floor unmet)");
        } else if (bloomViolations.length === 0) {
            ok(
                `hover ::before: ${hoveredPanels} cartoon panel(s) hovered across ${SCENES.join("/")} — ` +
                    `NONE paints the specular warm-white catch-light radial (the tracked catch-light is ` +
                    `dead on every Card; the radial died at SOURCE on the cartoon surface, no ` +
                    `display:none/!important)`,
            );
        } else {
            fail(
                `hover ::before — ${bloomViolations.length} hovered cartoon panel(s) STILL paint the ` +
                    `specular catch-light radial on hover (the tracked-specular subsystem survives — ` +
                    `it must be REMOVED, exception set → ∅):\n      ` +
                    bloomViolations.slice(0, 6).join("\n      "),
            );
        }
    } finally {
        await browser.close();
        server.close();
    }
}

await browserHalves();

if (failures.length > 0) {
    console.error(
        `\nproof:no-orphan-specular — FAIL (${failures.length}): a kf-owned <Card> still carries ` +
            `a glass-specular-track / cartoon-specular tracked catch-light (or retains glass, or carries ` +
            `the manual .glass-card plate) — the H.W9 F3+F6 removal is incomplete (the tracked specular ` +
            `must die at SOURCE on EVERY panel, exception set → ∅; no CSS suppression).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:no-orphan-specular — PASS: every kf-owned <Card> resolves surface=cartoon with NO " +
        "glass-specular-track / cartoon-specular and NO manual .glass-card; ZERO panels carry a tracked " +
        "catch-light (exception set → ∅, H.W9 F3+F6 — STRONGER than the W2 form); no hovered panel " +
        "blooms a radial. The glass-ui <Button>/dock residue is RECORDED S5 HANDOFF (inv-16). The D2 " +
        "cartoon chronic stays closed via this stronger system property.",
);
