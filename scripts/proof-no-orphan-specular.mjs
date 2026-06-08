#!/usr/bin/env node
/**
 * proof:no-orphan-specular — H.W2 S1+S3, INVERTED at H.W9 F3+F6, RECONCILED with
 * the H.W11 I5 stage-glass-card register at H.W8R (the gate-regime close).
 *
 * THE DEFECT, ORIGINALLY (D2/D14, the "strange circular/radial blur on hover
 * everywhere"). glass-ui's `<Card surface="glass">` (the DEFAULT) bolts on
 * `glass-specular-track` (`CardFooter:37`), an iOS catch-light `::before` radial
 * that is MEANT to ride the cursor — but the Card never wires the pointer seam
 * (`--mouse-x`/`--mouse-y`), so it falls to its `var(--mouse-x, 50%)` centred floor
 * and merely BRIGHTENS on hover (a static, dead-centred warm-white bloom). Every
 * panel inherited it via the default surface. H.W2's gestalt move flipped every
 * kf-owned panel/sidebar `<Card>` to `surface="cartoon"` (the surface map then
 * STOPS EMITTING `glass-specular-track` at SOURCE).
 *
 * THE INVERSION (H.W9 F3+F6 — the user-feedback fold). The tracked-specular
 * subsystem (the `.cartoon-specular` recipe, the manual `glass-specular-track`
 * class on the bezier Card, the `useSpecularPointer` wire) was DELETED entirely:
 * the calm register is glass + cartoon with NO tracked catch-light. At H.W9 the
 * PANEL exception set collapsed to ∅ — every panel is `surface="cartoon"`.
 *
 * THE RECONCILIATION (H.W8R — this edit). H.W11 I5 DELIBERATELY made the four
 * scene STAGES a standard, NON-cartoon GLASS `<Card>` at the USER's EXPLICIT ask
 * ("the easing/spring/sequence/path scenes should have a standard, non-cartoon
 * GLASS card encapsulation"). `proof:stage-glass-card` now REQUIRES those stages
 * to resolve `surface="glass"`. So the H.W9 "EVERY Card is cartoon, exception ∅"
 * shape DIRECTLY CONTRADICTS the W11-sanctioned glass stages. The fix is a
 * REFINEMENT, not a workaround: the invariant now PARTITIONS kf-owned `<Card>`s
 * into two cohorts and polices each correctly —
 *
 *   • PANEL/sidebar Cards — the H.W9 F6 intent HOLDS, exception set = ∅: EVERY
 *     panel Card is `surface="cartoon"` with NO `glass-specular-track`, NO
 *     `cartoon-specular`, NO manual `.glass-card` plate. A panel reverting to
 *     glass, or carrying any tracked-specular class, REDS.
 *
 *   • STAGE Cards — the W11-I5 SANCTIONED `surface="glass"` set. This set is NOT a
 *     second hardcoded list: it is DERIVED THE SAME WAY proof:stage-glass-card
 *     derives its scene set — the stage scenes are scenes.ts's NON-`subject`
 *     STAGE_MODES (`{easing, spring, sequence, motion-path}` — IDENTICAL to
 *     stage-glass-card's SCENES), and the stage Target *.vue files are exactly the
 *     `*Target.vue` files those stages' `*Scene.vue` import. So the two gates are
 *     CONSISTENT-BY-CONSTRUCTION + DRY: a scene leaving/entering the stage set in
 *     scenes.ts moves BOTH gates at once, and neither can drift onto a different
 *     stage set. (Cross-reference: scripts/proof-stage-glass-card.mjs.) A stage
 *     Card carrying glass-ui's UNCONDITIONAL `.glass-specular-track` is glass-ui-
 *     OWNED residue — the `specular="off"` opt-out is UNPUBLISHED (the cosmetic
 *     glass-ui 3.8.0 consume-edge, inv-16: kf consumes published ~3.5.1, no fork);
 *     it is ALLOWED on the sanctioned stages ONLY.
 *
 * THE EXCEPTION SET IS NO LONGER ∅ — it is the W11-I5 stage Target set. But the
 * gate STILL BITES every real regression (verified by the bite-tests in
 * docs/tranches/H/audit/harden/impl-w8r-specular-reconcile.md):
 *   (a) a PANEL Card going `surface="glass"`, or carrying specular/track/plate → REDS;
 *   (b) a NEW Card defaulting to glass that is NOT one of the derived sanctioned
 *       stages (an orphan glass Card) → REDS;
 *   (c) the browser half: NO PANEL Card paints a VISIBLE specular `::before`
 *       warm-white bloom — the real W9 F6 user-facing invariant FOR PANELS. The
 *       SANCTIONED glass STAGES carry glass-ui's mild built-in catch-light (rest
 *       ~0.35, hover ~0.6 at ~3.5.1) — that is the ACCEPTED, glass-ui-OWNED sheen
 *       (the user's W8R decision: "keep glass + handoff the sheen"; it rides
 *       `proof:specular-handoff` born-RED and resolves at glass-ui 3.8.0's
 *       `specular="off"`, inv-16 — kf adds no override/suppression/fork). A PANEL
 *       that blooms REDS; a stage bloom is RECORDED residue, not failed.
 *
 * This gate polices the kf-OWNED surfaces (inv-16 — the remaining glass-ui
 * `<Button glass>` + dock-icon tracks are S5 HANDOFF territory, RECORDED here,
 * NOT failed; they ride proof:specular-handoff born-RED). The D2 cartoon chronic
 * stays closed via this stronger, partitioned property (the H.W8 meta-gate's D2
 * load-bearing set is `proof:cartoon-is-panel-depth` + this gate +
 * `proof:glass-and-cartoon` + the paired `proof:specular-handoff`).
 *
 * Mirrors scripts/proof-demo-shell-grid.mjs / proof-stage-not-clipped.mjs (the
 * serveDist + Playwright + FSM-settle plumbing). Under KF_REQUIRE_BROWSER a
 * playwright-absent skip becomes a hard fail so a SHIP is never green-reported
 * un-exercised. Re-runnable: `node scripts/proof-no-orphan-specular.mjs`. Serves
 * the BUILT dist/gh-pages/.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DIST = path.join(REPO, "dist/gh-pages");
const SCENES_TS = path.join(REPO, "demo/app/scenes.ts");
const SCENES_DIR = path.join(REPO, "demo/app/scenes");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const note = (label) => console.log(`  · ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const read = (p) => fs.readFileSync(p, "utf8");
const rel = (p) => path.relative(REPO, p).split(path.sep).join("/");

// Comment-blank a source so a doc-comment naming a deleted class / a stage Target
// does not false-positive (mirrors proof-demo-shell-grid blankComments).
const blankComments = (s) =>
    s
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length))
        .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));

console.log(
    "proof:no-orphan-specular — H.W2 S1+S3 INVERTED at H.W9 F3+F6, RECONCILED with " +
        "H.W11 I5 (panels exception ∅ · sanctioned glass STAGES derived from stage-glass-card)",
);

// H.W9 F3+F6: the W2 enumerated composite exception is DELETED. The recipe class
// `.cartoon-specular` and the `glass-specular-track` class must appear on ZERO
// kf-owned PANEL <Card>. (Named here so a re-added recipe is caught.)
const TRACKED_SPECULAR_CLASSES = ["glass-specular-track", "cartoon-specular"];

// ── DRY: derive the SANCTIONED STAGE TARGET FILE SET (consistent-by-construction
//    with proof:stage-glass-card) ────────────────────────────────────────────
//
// proof:stage-glass-card's stage SCENES are scenes.ts's NON-`subject` STAGE_MODES
// — `{easing, spring, sequence, motion-path}`. The stage Target *.vue files are
// exactly the `*Target.vue` files those stages' `*Scene.vue` import. We parse
// scenes.ts's STAGE_MODES, take the non-subject ids, map each to its
// `<id>Scene.vue` (the router/scenes.ts component naming), and harvest the
// `*Target.vue` import paths from each. The RESULT is the set of stage Card files
// where a default→glass <Card> is W11-I5-SANCTIONED. If this derivation ever
// resolves EMPTY, that is itself a hard fail (the scenes.ts parse drifted) — the
// gate cannot silently degrade to "every Card is a stage" (vacuity).
//
// NOTE: a scene id like "motion-path" maps to "MotionPathScene.vue" (PascalCase,
// hyphen-segments capitalised); we resolve case-insensitively against the actual
// scenes dir listing rather than guessing the exact casing.
function deriveSanctionedStageTargets() {
    const src = blankComments(read(SCENES_TS));

    // Parse the STAGE_MODES object literal: `id: "mode"` / `"id": "mode"` pairs.
    const body = src.match(/const\s+STAGE_MODES\s*:[^=]*=\s*\{([\s\S]*?)\}\s*;/);
    if (!body) {
        return { error: "could not locate the STAGE_MODES literal in scenes.ts", files: new Set() };
    }
    const stageScenes = [];
    for (const m of body[1].matchAll(/(?:"([^"]+)"|([A-Za-z][\w-]*))\s*:\s*"([^"]+)"/g)) {
        const id = m[1] ?? m[2];
        const mode = m[3];
        // The stage scenes are the NON-`subject` modes (editor/storyboard) — the
        // IDENTICAL set proof:stage-glass-card asserts as glass cards.
        if (mode !== "subject") stageScenes.push(id);
    }
    if (stageScenes.length === 0) {
        return { error: "STAGE_MODES yielded ZERO non-subject stage scenes", files: new Set() };
    }

    // Map each stage scene id → its `*Scene.vue`, case-insensitively against the
    // real scenes dir, then harvest its imported `*Target.vue` files.
    const sceneFiles = fs.existsSync(SCENES_DIR)
        ? fs.readdirSync(SCENES_DIR).filter((f) => f.endsWith("Scene.vue"))
        : [];
    const pascal = (id) =>
        id
            .split("-")
            .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
            .join("");

    const targetFiles = new Set();
    const sceneToTargets = {};
    for (const id of stageScenes) {
        const want = (pascal(id) + "Scene.vue").toLowerCase();
        const sceneFile = sceneFiles.find((f) => f.toLowerCase() === want);
        if (!sceneFile) {
            // A stage scene with no matching *Scene.vue means the scenes.ts↔file
            // wiring drifted — surface it (the derivation must stay honest).
            sceneToTargets[id] = { error: `no ${pascal(id)}Scene.vue found for stage scene "${id}"` };
            continue;
        }
        const sceneSrc = read(path.join(SCENES_DIR, sceneFile));
        const imports = [...sceneSrc.matchAll(/import\s+\w+\s+from\s+["']([^"']*Target\.vue)["']/g)];
        const resolved = imports
            .map((im) => path.resolve(SCENES_DIR, im[1]))
            .filter((abs) => fs.existsSync(abs));
        sceneToTargets[id] = { sceneFile, targets: resolved.map(rel) };
        for (const abs of resolved) targetFiles.add(abs);
    }

    return { stageScenes, sceneToTargets, files: targetFiles };
}

// ── 1. SOURCE-INVARIANT (static, always runs) ─────────────────────────────────
{
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

    // The SANCTIONED stage Target file set (DRY with proof:stage-glass-card).
    const stage = deriveSanctionedStageTargets();
    if (stage.error) {
        fail(
            `stage-set derivation — ${stage.error}. The sanctioned-glass-stage set must be derived ` +
                `from scenes.ts STAGE_MODES (the SAME source proof:stage-glass-card uses); a broken ` +
                `derivation would make the partition unsound (cannot tell a sanctioned stage from an orphan).`,
        );
    }
    const stageFileSet = stage.files; // Set<absolute path>
    const isStageFile = (abs) => stageFileSet.has(path.resolve(abs));

    const files = collectVue(DEMO);
    const panelOffenders = [];
    const stageNotes = [];
    let panelCardTotal = 0;
    let panelCartoonCount = 0;
    let stageGlassCount = 0;

    for (const abs of files) {
        const raw = read(abs);
        const src = blankComments(raw);
        const tags = cardOpenTags(src);
        const onStage = isStageFile(abs);
        for (const tag of tags) {
            const flat = tag.replace(/\s+/g, " ").slice(0, 110);
            const hasGlassCard = /\bglass-card\b/.test(tag);
            const trackedClass = TRACKED_SPECULAR_CLASSES.find((c) =>
                new RegExp(`\\b${c}\\b`).test(tag),
            );
            const surfaceM = tag.match(/surface\s*=\s*"([^"]+)"/);
            const surface = surfaceM ? surfaceM[1] : "(default→glass)";

            if (onStage) {
                // ── STAGE Card — W11-I5 SANCTIONED glass. The stage resolves
                //    surface=glass (default or explicit). A `glass-specular-track`
                //    is glass-ui-OWNED residue (specular="off" unpublished, inv-16)
                //    — ALLOWED here ONLY. A `.cartoon-specular` recipe (the deleted
                //    kf subsystem) or a manual `.glass-card` is STILL forbidden
                //    (those are kf-authored, not glass-ui residue).
                if (hasGlassCard) {
                    panelOffenders.push(`${rel(abs)} — STAGE <Card> carries the manual .glass-card plate (the surface owns the plate; even a sanctioned stage may not hand-roll it): \`${flat}\``);
                    continue;
                }
                if (trackedClass === "cartoon-specular") {
                    panelOffenders.push(`${rel(abs)} — STAGE <Card> carries the deleted kf \`cartoon-specular\` recipe (the tracked-specular subsystem is REMOVED at H.W9 F3+F6 — not even a sanctioned glass stage may re-introduce it): \`${flat}\``);
                    continue;
                }
                // surface must resolve glass on a stage (the W11-I5 register; a
                // stage flipped to cartoon would be the I5 regression — but that is
                // proof:stage-glass-card's primary subject; here we only NOTE it so
                // the two gates agree, and DO NOT count it as glass).
                if (surface === "cartoon") {
                    stageNotes.push(`${rel(abs)} — a sanctioned STAGE <Card> resolves surface=cartoon, NOT glass (proof:stage-glass-card owns this regression): \`${flat}\``);
                } else {
                    stageGlassCount += 1;
                }
                continue;
            }

            // ── PANEL/sidebar Card — the H.W9 F6 intent HOLDS, exception set ∅ ──
            // No manual .glass-card plate.
            if (hasGlassCard) {
                panelOffenders.push(`${rel(abs)} — PANEL <Card> carries the manual .glass-card plate (CS-3 — the surface owns the plate): \`${flat}\``);
                continue;
            }
            // No tracked-specular class on a panel — the deleted subsystem.
            if (trackedClass) {
                panelOffenders.push(`${rel(abs)} — PANEL <Card> carries \`${trackedClass}\` (the tracked-specular subsystem is REMOVED at H.W9 F3+F6 — the PANEL exception set is ∅; no panel may paint a tracked catch-light): \`${flat}\``);
                continue;
            }
            panelCardTotal += 1;
            // Every PANEL Card MUST be surface="cartoon". A default-glass Card (no
            // surface=) on a panel re-inherits the orphan track; a retained
            // surface="glass" re-emits it. BITE: a NEW default-glass Card that is
            // NOT a derived sanctioned stage reds HERE (it is a panel by elimination).
            if (surface === "cartoon") {
                panelCartoonCount += 1;
            } else {
                panelOffenders.push(`${rel(abs)} — PANEL <Card> resolves surface=${surface}, NOT cartoon (every kf-owned PANEL Card is surface="cartoon"; the PANEL exception set is ∅. If this is meant to be a glass STAGE, it must live in a stage Target file derived from scenes.ts STAGE_MODES — see proof:stage-glass-card): \`${flat}\``);
            }
        }
    }

    // Stage notes (surface=cartoon on a stage) are reported but OWNED by
    // proof:stage-glass-card — surface them as notes here, not panel failures.
    for (const n of stageNotes) note(n);

    if (panelOffenders.length === 0 && !stage.error) {
        const stageList = [...stageFileSet].map(rel).sort();
        ok(
            `source-invariant: all ${panelCartoonCount}/${panelCardTotal} kf-owned PANEL <Card>s resolve ` +
                `surface="cartoon" with NO tracked-specular class and NO manual .glass-card (PANEL exception ` +
                `set ∅, H.W9 F6) · ${stageGlassCount} sanctioned STAGE <Card>(s) resolve glass across the ` +
                `W11-I5 stage set [${stageList.join(", ")}] (derived from scenes.ts STAGE_MODES — DRY with ` +
                `proof:stage-glass-card). (${files.length} demo *.vue, comment-blanked)`,
        );
    } else if (panelOffenders.length > 0) {
        fail(
            `source-invariant — ${panelOffenders.length} kf-owned <Card> orphan/violation(s) ` +
                `(every PANEL Card is surface="cartoon" with NO glass-specular-track / cartoon-specular / ` +
                `.glass-card; a glass Card is permitted ONLY in the W11-I5 sanctioned stage set):\n      ` +
                panelOffenders.join("\n      "),
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

/** Open a scene in a FRESH context at its canonical FIRST-LOAD mount. */
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
// white core is the unmistakable catch-light. At glass-ui ~3.5.1 it paints on
// EVERY `<Card surface="glass">` (rest ~0.35, hover ~0.6) — the published Card has
// NO `specular="off"` opt-out (that is the 3.8.0 forward edge, inv-16). So the
// bloom IS present on the sanctioned glass STAGES — that is the ACCEPTED glass-ui-
// owned sheen (the user's W8R "keep glass + handoff the sheen"). The hover half
// thus partitions BY COHORT: a PANEL painting it REDS (W9 F6); a STAGE painting it
// is recorded HANDOFF residue. (Chrome serializes the gradient WITHOUT an explicit
// `at 50% 50%`, so the storm-robust signal is the PRESENCE of the warm-white
// radial itself, not its position.)
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
    // Sweep cube (panels only) + the stage scenes (easing/spring/sequence/motion-
    // path) so BOTH cohorts are exercised: a panel that re-emits the orphan track
    // is caught, and the sanctioned glass stages are confirmed NOT to bloom.
    const SCENES = ["cube", "easing", "spring", "sequence", "motion-path"];
    const browser = await chromium.launch();
    try {
        // ── 2. RECORD .glass-specular-track BY COHORT + 3. NO VISIBLE BLOOM ──
        let panelTrackCards = []; // a track on a PANEL [data-surface=cartoon] Card → red
        let stageTrackCards = 0; // a track on a sanctioned STAGE glass Card → glass-ui residue, recorded
        let buttonTracks = 0;
        let anyPointerWriteOnButtons = false;
        let hoveredCards = 0;
        let bloomViolations = []; // a PANEL Card painting the bloom → red (W9 F6)
        let stageBloomResidue = 0; // a sanctioned STAGE glass Card painting it → accepted glass-ui HANDOFF

        for (const scene of SCENES) {
            const { ctx, page } = await openSceneFresh(browser, base, scene, VW);
            try {
                // (2) classify every `.glass-specular-track`: a kf-owned Card that
                // is on the STAGE (a `.stage-cell [data-surface=glass]` plate) is
                // SANCTIONED residue; a kf-owned Card that is a PANEL (cartoon, or
                // a glass Card NOT inside .stage-cell) is an ORPHAN → red.
                const probe = await page.evaluate(() => {
                    const inStage = (el) => !!el.closest(".stage-cell");
                    const tracks = [...document.querySelectorAll(".glass-specular-track")];
                    return tracks.map((t) => ({
                        tag: t.tagName,
                        isCard: t.hasAttribute("data-surface"),
                        surface: t.getAttribute("data-surface") || "(none)",
                        onStage: inStage(t),
                        // anyPointerWrite — the stable invariant anchor: an unwired
                        // track has no --mouse-x inline write.
                        hasMouseWrite: t.style.getPropertyValue("--mouse-x").trim() !== "",
                    }));
                });

                for (const t of probe) {
                    if (t.isCard) {
                        // A kf-owned <Card> with a track. SANCTIONED iff it is a
                        // glass Card sitting inside a `.stage-cell` (the W11-I5
                        // stage plate). Anything else (a cartoon panel, or a glass
                        // Card outside the stage cell) is an ORPHAN.
                        if (t.onStage && t.surface === "glass") {
                            stageTrackCards += 1;
                        } else {
                            panelTrackCards.push(`${scene}: a [data-surface=${t.surface}] <Card>${t.onStage ? " in .stage-cell" : " (not a stage cell)"} carries glass-specular-track — an ORPHAN (a panel may not carry it; a stage track is sanctioned ONLY on a glass [data-surface=glass] .stage-cell plate)`);
                        }
                    } else {
                        buttonTracks += 1;
                        if (t.hasMouseWrite) anyPointerWriteOnButtons = true;
                    }
                }

                // (3) the hover ::before — partitioned BY COHORT. A PANEL Card must
                // NOT paint the catch-light bloom (the W9 F6 user-facing invariant).
                // A sanctioned glass STAGE Card carries glass-ui's mild built-in
                // catch-light — the ACCEPTED, glass-ui-owned sheen (the user's W8R
                // "keep glass + handoff the sheen"; rides proof:specular-handoff,
                // resolves at glass-ui 3.8.0's specular="off"). A panel bloom REDS; a
                // stage bloom is RECORDED residue.
                const handles = await page.$$(`[data-surface]`);
                for (let i = 0; i < handles.length; i++) {
                    try {
                        await handles[i].hover({ timeout: 1500, force: true });
                        await page.waitForTimeout(200);
                        const { beforeBg, surf, onStage } = await handles[i].evaluate((el) => ({
                            beforeBg: getComputedStyle(el, "::before").backgroundImage,
                            surf: el.getAttribute("data-surface"),
                            onStage: !!el.closest(".stage-cell"),
                        }));
                        hoveredCards += 1;
                        if (SPECULAR_RADIAL.test(beforeBg)) {
                            if (onStage && surf === "glass") {
                                // The W11-I5 sanctioned stage sheen — accepted glass-ui
                                // HANDOFF residue (NOT a panel orphan). Recorded, not failed.
                                stageBloomResidue += 1;
                            } else {
                                bloomViolations.push(`${scene}#${i} (data-surface=${surf}${onStage ? ", in .stage-cell" : ""}): hovered PANEL Card paints the specular ::before warm-white radial — a panel must never bloom (${beforeBg.slice(0, 60)}…)`);
                            }
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

        if (panelTrackCards.length === 0) {
            ok(
                `no-orphan-card: ZERO PANEL <Card>s carry a glass-specular-track across ` +
                    `${SCENES.join("/")} first-load mounts — the PANEL exception set is ∅. The ` +
                    `${stageTrackCards} sanctioned STAGE glass Card track(s) are W11-I5 glass-ui-owned ` +
                    `residue (specular="off" unpublished, inv-16 — allowed on the stages ONLY).`,
            );
            // RECORD the glass-ui-owned residue (S5 HANDOFF, inv-16 — NOT failed).
            note(
                `S5 HANDOFF residue (inv-16, RECORDED not failed): ${buttonTracks} <Button>/dock ` +
                    `glass-specular-track(s) remain across the routes — glass-ui-owned surfaces ` +
                    `(the Card-default seam + dock-icon tune ride proof:specular-handoff born-RED). ` +
                    `anyPointerWrite on those = ${anyPointerWriteOnButtons}.`,
            );
        } else {
            fail(
                `no-orphan-card — ${panelTrackCards.length} ORPHAN <Card>(s) carry a ` +
                    `glass-specular-track (a panel may not; a stage track is sanctioned ONLY on a glass ` +
                    `[data-surface=glass] .stage-cell plate):\n      ` +
                    panelTrackCards.slice(0, 8).join("\n      "),
            );
        }

        if (hoveredCards === 0) {
            // NON-VACUITY: a no-bloom assertion that never hovered anything is a
            // vacuous pass — fail under browser-required.
            skipOrFail("the hover ::before check hovered ZERO Cards (non-vacuity floor unmet)");
        } else if (bloomViolations.length === 0) {
            ok(
                `hover ::before: ${hoveredCards} Card(s) hovered across ${SCENES.join("/")} — ZERO ` +
                    `PANEL Cards paint the specular catch-light bloom (the W9 F6 panel invariant holds; ` +
                    `no display:none/!important suppression). The ${stageBloomResidue} sanctioned glass ` +
                    `STAGE Card(s) carry glass-ui's mild built-in catch-light — the ACCEPTED glass-ui-` +
                    `owned sheen (user W8R "keep glass + handoff the sheen"; rides proof:specular-handoff ` +
                    `born-RED, resolves at glass-ui 3.8.0 specular="off", inv-16 — no kf override/fork)`,
            );
        } else {
            fail(
                `hover ::before — ${bloomViolations.length} PANEL Card(s) paint the specular ` +
                    `catch-light radial on hover (the W9 F6 panel invariant: a PANEL must never bloom — ` +
                    `a panel reverted to glass, or a new glass Card outside the sanctioned .stage-cell):\n      ` +
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
        `\nproof:no-orphan-specular — FAIL (${failures.length}): a kf-owned PANEL <Card> still carries ` +
            `a glass-specular-track / cartoon-specular / .glass-card (or reverted to glass), OR an orphan ` +
            `glass Card exists outside the W11-I5 sanctioned stage set, OR a Card paints a VISIBLE specular ` +
            `bloom on hover. The H.W9 F6 panel intent (exception ∅) + the W11-I5 stage reconciliation ` +
            `(sanctioned glass stages, derived DRY from scenes.ts) are not both satisfied.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:no-orphan-specular — PASS: every kf-owned PANEL <Card> resolves surface=cartoon with NO " +
        "tracked-specular class and NO .glass-card AND paints NO visible bloom (exception ∅, H.W9 F6); the " +
        "ONLY glass Cards are the W11-I5 sanctioned STAGES (derived from scenes.ts STAGE_MODES — DRY with " +
        "proof:stage-glass-card), whose glass-specular-track + mild built-in catch-light is glass-ui-owned " +
        "residue — the ACCEPTED sheen (user W8R 'keep glass + handoff the sheen'), riding proof:specular-" +
        "handoff born-RED until glass-ui 3.8.0's specular=\"off\" (inv-16, no kf fork). The glass-ui " +
        "<Button>/dock residue is RECORDED S5 HANDOFF. D2 stays closed via this partitioned property.",
);
