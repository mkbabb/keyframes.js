#!/usr/bin/env node
/**
 * proof:no-orphan-specular — H.W2 S1+S3 (CS-1/F1, the radial-bloom death lock).
 *
 * THE DEFECT (D2/D14, the "strange circular/radial blur on hover everywhere").
 * glass-ui's `<Card surface="glass">` (the DEFAULT) bolts on `glass-specular-track`
 * (`CardFooter:37`), an iOS catch-light `::before` radial that is MEANT to ride the
 * cursor — but the Card never wires the pointer seam (`--mouse-x`/`--mouse-y`), so
 * it falls to its `var(--mouse-x, 50%)` centred floor and merely BRIGHTENS on hover
 * (a static, dead-centred warm-white bloom — a half-implemented effect). Every
 * panel inherited it via the default surface. The orphan-specular INVARIANT today:
 * `anyPointerWrite:false` on every track (CP-MED-2 — the count moves with route +
 * dock + mounted panels, ~5–13; the invariant is the stable anchor, NOT a count).
 *
 * THE FIX (the §2.2 gestalt move). Flip every kf-owned panel/sidebar `<Card>` to
 * `surface="cartoon"` — the surface map then STOPS EMITTING `glass-specular-track`
 * at SOURCE (no `!important`, no `display:none`); the radial dies because the class
 * is no longer applied. The ONE deliberately-glassy panel (the cubic-bézier editor,
 * the demo's sole direct-manipulation surface) keeps the catch-light AND gains
 * cartoon depth via the S2-COMPOSITE `.cartoon-specular` recipe + `useSpecularPointer`
 * (the pointer seam wired, the intensity calmed). So the catch-light becomes the
 * TRAVELLING light it was designed to be — never the broken centred bloom.
 *
 * This gate polices the kf-OWNED surfaces (inv-16 — the remaining glass-ui
 * `<Button glass>` + dock-icon tracks are S5 HANDOFF territory, RECORDED here,
 * NOT failed; they ride proof:specular-handoff born-RED).
 *
 * Three falsifiable halves, each BITING on the exact regression:
 *
 *   1. SOURCE-INVARIANT (STATIC — always runs). Over every demo `*.vue`: EVERY
 *      `<Card …>` opening tag resolves `surface="cartoon"` OR is the enumerated
 *      composite exception (it co-carries `cartoon-specular` + `glass-specular-track`
 *      AND its file imports/uses `useSpecularPointer` — the `--mouse-x` writer is
 *      present in source). NO `<Card>` carries the manual `.glass-card` plate
 *      (CS-3). The enumerated exception set is EXACTLY {TimingFunctionPanel bezier}
 *      — any OTHER Card that carries `glass-specular-track` without the composable,
 *      or any Card that defaults to glass / retains glass without a pointer writer,
 *      reds. BITE: a new `<Card>` (no surface= → defaults glass → emits the orphan
 *      track) reds; a Card retaining glass with no useSpecularPointer reds; a
 *      manual `.glass-card` on a Card reds.
 *
 *   2. NO-ORPHAN-CARD COMPUTED (BROWSER — gated). Sweep the panel-bearing routes
 *      (cube/easing/spring); collect every `.glass-specular-track` element. The
 *      INVARIANT: ZERO of them is a kf-owned `<Card>` (`[data-surface]`) UNLESS it
 *      is the enumerated composite (carries `.cartoon-specular`). The remaining
 *      tracks (all `<BUTTON>` / dock icons — glass-ui-owned) are RECORDED with
 *      their `anyPointerWrite:false` status as the S5 HANDOFF residue, NOT failed.
 *      BITE: revert a panel to `surface="glass"` → it re-emits an orphan
 *      `glass-specular-track` on a `[data-surface=glass]` Card → reds.
 *
 *   3. HOVER ::before — NO CENTRED RADIAL (BROWSER — gated, the WV-W2-LOW-3
 *      storm-robust COMPUTED check as PRIMARY). Hover a cartoon panel Card; its
 *      `::before` must NOT paint the specular warm-white catch-light radial — the
 *      radial is GONE on the cartoon surface (the surface map stopped emitting the
 *      track), so a hovered panel shows the cartoon offset-stamp depth, no centred
 *      bloom. NON-VACUITY: ≥1 cartoon Card is actually hovered. BITE: a panel that
 *      still emits the specular `::before` (the `rgba(255,255,255,0.55)` warm-white
 *      radial core) on hover → reds (the centred-bloom defect survives).
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

console.log("proof:no-orphan-specular — H.W2 S1+S3 (the radial-bloom death lock)");

// The enumerated S2-COMPOSITE exception: the ONE deliberately-glassy panel that
// keeps the catch-light (the cubic-bézier editor, the demo's direct-manipulation
// surface) — it co-carries `cartoon-specular glass-specular-track` AND wires the
// pointer seam via useSpecularPointer. Identified by the recipe class.
const COMPOSITE_CLASS = "cartoon-specular";

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
    let compositeCount = 0;

    for (const abs of files) {
        const raw = read(abs);
        const src = blankComments(raw);
        const tags = cardOpenTags(src);
        const usesPointer = /useSpecularPointer\s*\(/.test(src);
        for (const tag of tags) {
            cardTotal += 1;
            const flat = tag.replace(/\s+/g, " ").slice(0, 110);
            const hasGlassCard = /\bglass-card\b/.test(tag);
            const hasSpecularTrack = /\bglass-specular-track\b/.test(tag);
            const hasComposite = new RegExp(`\\b${COMPOSITE_CLASS}\\b`).test(tag);
            const surfaceM = tag.match(/surface\s*=\s*"([^"]+)"/);
            const surface = surfaceM ? surfaceM[1] : "(default→glass)";

            // CS-3: no manual .glass-card plate on any Card.
            if (hasGlassCard) {
                offenders.push(`${rel(abs)} — <Card> carries the manual .glass-card plate (CS-3 — the surface owns the plate): \`${flat}\``);
                continue;
            }

            if (hasComposite) {
                // The enumerated composite exception: must be surface="cartoon",
                // carry the specular track, AND its file must wire the pointer seam.
                compositeCount += 1;
                if (surface !== "cartoon")
                    offenders.push(`${rel(abs)} — the .cartoon-specular composite Card must be surface="cartoon" (got ${surface}): \`${flat}\``);
                if (!hasSpecularTrack)
                    offenders.push(`${rel(abs)} — the .cartoon-specular composite Card must co-carry glass-specular-track: \`${flat}\``);
                if (!usesPointer)
                    offenders.push(`${rel(abs)} — the .cartoon-specular composite Card's file does NOT wire useSpecularPointer (the --mouse-x writer is absent — an unwired composite is the broken centred bloom): \`${flat}\``);
                continue;
            }

            // Any NON-composite Card that carries glass-specular-track is an orphan
            // (the surface map should have stopped emitting it).
            if (hasSpecularTrack) {
                offenders.push(`${rel(abs)} — a non-composite <Card> carries glass-specular-track (orphan radial — flip to surface="cartoon" or make it the enumerated composite): \`${flat}\``);
                continue;
            }

            // Every other Card MUST be surface="cartoon" (the gestalt move). A
            // default-glass Card (no surface=) re-inherits the orphan track; a
            // retained surface="glass" without the composite/pointer wire is the
            // broken bloom. The footprint invariant: cartoon, or the named exception.
            if (surface === "cartoon") {
                cartoonCount += 1;
            } else {
                offenders.push(`${rel(abs)} — <Card> resolves surface=${surface}, NOT cartoon and NOT the enumerated composite (every kf-owned Card is cartoon or the named exception): \`${flat}\``);
            }
        }
    }

    if (offenders.length === 0) {
        ok(
            `source-invariant: all ${cardTotal} kf-owned <Card>s resolve surface="cartoon" ` +
                `(${cartoonCount}) or the enumerated .cartoon-specular composite (${compositeCount}, ` +
                `pointer-wired); ZERO carry the manual .glass-card plate (CS-3) or an orphan ` +
                `glass-specular-track (${files.length} demo *.vue, comment-blanked)`,
        );
    } else {
        fail(
            `source-invariant — ${offenders.length} kf-owned <Card> orphan/violation(s) ` +
                `(every Card must be surface="cartoon" or the pointer-wired composite; no manual ` +
                `.glass-card):\n      ` +
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
        let compositeCardTracks = 0;
        let anyPointerWriteOnButtons = false;
        let hoveredPanels = 0;
        let bloomViolations = [];

        for (const scene of SCENES) {
            const { ctx, page } = await openSceneFresh(browser, base, scene, VW);
            try {
                // (2) the orphan-card invariant — every .glass-specular-track that is
                // a kf-owned <Card> ([data-surface]) must be the enumerated composite.
                const probe = await page.evaluate((compositeClass) => {
                    const tracks = [...document.querySelectorAll(".glass-specular-track")];
                    return tracks.map((t) => ({
                        tag: t.tagName,
                        isCard: t.hasAttribute("data-surface"),
                        surface: t.getAttribute("data-surface") || "(none)",
                        isComposite: t.classList.contains(compositeClass),
                        // anyPointerWrite — the stable invariant anchor (CP-MED-2):
                        // an unwired track has no --mouse-x inline write.
                        hasMouseWrite: t.style.getPropertyValue("--mouse-x").trim() !== "",
                    }));
                }, COMPOSITE_CLASS);

                for (const t of probe) {
                    if (t.isCard) {
                        if (t.isComposite) {
                            // The enumerated composite — allowed (pointer-wired by
                            // useSpecularPointer; the source-invariant clause proved
                            // the writer is present). RECORDED, not an orphan.
                            compositeCardTracks += 1;
                        } else {
                            orphanCards.push(`${scene}: a [data-surface=${t.surface}] <Card> carries glass-specular-track WITHOUT the composite recipe (orphan radial)`);
                        }
                    } else {
                        buttonTracks += 1;
                        if (t.hasMouseWrite) anyPointerWriteOnButtons = true;
                    }
                }

                // (3) the hover ::before — NO CENTRED RADIAL on the panel/sidebar
                // cartoon Cards (the composite is excluded — it legitimately keeps a
                // calmed, tracked catch-light).
                const handles = await page.$$(`[data-surface="cartoon"]:not(.${COMPOSITE_CLASS})`);
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
                `no-orphan-card: ZERO kf-owned <Card>s carry an unwired glass-specular-track ` +
                    `across ${SCENES.join("/")} first-load mounts (${compositeCardTracks} enumerated ` +
                    `composite track(s), pointer-wired). The orphan radial is dead on every panel/sidebar Card.`,
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
                `no-orphan-card — ${orphanCards.length} kf-owned <Card>(s) carry an unwired ` +
                    `glass-specular-track (the orphan centred-bloom radial survives — flip to ` +
                    `surface="cartoon" or the enumerated composite):\n      ` +
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
                    `NONE paints the specular warm-white catch-light radial (the centred-bloom defect is ` +
                    `dead; the radial died at SOURCE on the cartoon surface, no display:none/!important)`,
            );
        } else {
            fail(
                `hover ::before — ${bloomViolations.length} hovered cartoon panel(s) STILL paint the ` +
                    `specular centred-bloom radial on hover (the D2/D14 defect survives — the surface ` +
                    `map is still emitting the track):\n      ` +
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
            `the unwired glass-specular-track (the centred-bloom radial), retains glass without the ` +
            `pointer seam, or carries the manual .glass-card plate — the H.W2 S1 gestalt move is ` +
            `incomplete (the radial must die at SOURCE via the surface map, not a CSS suppression).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:no-orphan-specular — PASS: every kf-owned <Card> resolves surface=cartoon (or the " +
        "pointer-wired .cartoon-specular composite); ZERO carry the manual .glass-card or an orphan " +
        "specular track; no hovered panel blooms a centred radial (H.W2 S1+S3). The glass-ui " +
        "<Button>/dock residue is RECORDED S5 HANDOFF (inv-16).",
);
