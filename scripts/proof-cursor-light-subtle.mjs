#!/usr/bin/env node
/**
 * proof:cursor-light-subtle — T.D13 (OD-2 **RULED: AURORA-ON-HERO, AMENDED
 * SAME-DAY: MORE SUBTLE**). **OWNER authority (T.M6)**: the disposition (option
 * A, relocate to the home hero on glass-ui's public Aurora) AND the subtlety
 * bound both come from committed owner tokens — "Aurora on hero" + "I like the
 * aurora, but more subtle" (verbatim, OWNER-DECISIONS.md OD-2). The P-HERO
 * prototype's opacityCeiling 0.15 is the CEILING, not the target; the blessed
 * production bound is 0.1 (HERO_AURORA_OPACITY_CEILING in HeroAurora.vue) and
 * THIS oracle encodes it — raising the ceiling past the amendment REDs.
 *
 * CLAUSES:
 *   (a) THE PUBLIC DOOR (static) — HeroAurora.vue exists in editor-shell/ and
 *       imports `Aurora` from `@mkbabb/glass-ui/aurora` (the public primitive;
 *       never a hand-rolled `--mouse-x` wash — the H.W9 second-occurrence
 *       lesson; the standing recurrence guard is proof:no-hand-rolled-cursor-
 *       tracker, T.D14).
 *   (b) THE SUBTLETY BOUND (static) — the component binds
 *       `:opacity-ceiling="HERO_AURORA_OPACITY_CEILING"` and the constant is a
 *       literal < 0.15 (the OD-2 ceiling, strict) AND ≤ 0.1 (the blessed
 *       production bound). A raw literal binding above the bound also REDs.
 *   (c) DEFAULT-ON (static) — App.vue mounts <HeroAurora /> in the EditorShell
 *       #backdrop slot gated on `isHome`, with NO `?light=1` review-lever
 *       residue (the owner blessed the light fork AS the default).
 *   (d) ZERO LAYOUT READS (static) — HeroAurora's pointer handler performs no
 *       DOM geometry read (`getBoundingClientRect` grep-zero in the SFC): the
 *       lane-12 T-CL-3 class (read-after-write per pointermove, 1097–1671
 *       µs/call measured) is impossible by construction.
 *   (e) HOME-ONLY MOUNT (browser) — `.hero-aurora` renders on home and is
 *       ABSENT on a scene route (the layer tears down with the hero).
 *
 * Harness: scripts/lib/demo-driver.mjs withPage; serves the BUILT
 * dist/gh-pages. Re-runnable: `node scripts/proof-cursor-light-subtle.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const HERO_AURORA = path.join(
    REPO,
    "demo/components/instrument/shell/HeroAurora.vue",
);
const APP = path.join(REPO, "demo/app/App.vue");

/** The OD-2-amended blessed bound (must match HeroAurora.vue's constant). */
const BLESSED_CEILING = 0.1;
/** The P-HERO prototype ceiling — the amendment's hard upper wall. */
const PROTOTYPE_WALL = 0.15;

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};

console.log(
    "proof:cursor-light-subtle — T.D13 (OD-2 Aurora-on-hero, MORE SUBTLE; OWNER authority — " +
        `the encoded bound is ${BLESSED_CEILING}, strictly under the P-HERO ${PROTOTYPE_WALL} ceiling)`,
);

// ── (a)+(b)+(d) static over HeroAurora.vue ───────────────────────────────────
if (!fs.existsSync(HERO_AURORA)) {
    fail("(a) HeroAurora.vue is missing — the OD-2 disposition (Aurora-on-hero) is not landed");
} else {
    const src = fs.readFileSync(HERO_AURORA, "utf8");
    const noComments = src
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(^|[^:])\/\/[^\n]*/g, "$1");

    if (/import\s*\{[^}]*\bAurora\b[^}]*\}\s*from\s*["']@mkbabb\/glass-ui\/aurora["']/.test(src)) {
        ok("(a) HeroAurora imports the PUBLIC glass-ui Aurora primitive (@mkbabb/glass-ui/aurora)");
    } else {
        fail(
            "(a) HeroAurora does not import Aurora from @mkbabb/glass-ui/aurora — the cursor light " +
                "must ride the public primitive, never a hand-rolled wash (H.W9 / lane 12)",
        );
    }

    const constM = noComments.match(
        /HERO_AURORA_OPACITY_CEILING\s*=\s*(0?\.\d+|\d+(\.\d+)?)/,
    );
    const boundToConst = /:opacity-ceiling="HERO_AURORA_OPACITY_CEILING"/.test(src);
    const rawBinding = src.match(/:opacity-ceiling="(0?\.\d+|\d+(\.\d+)?)"/);
    let ceiling = null;
    if (constM && boundToConst) ceiling = parseFloat(constM[1]);
    else if (rawBinding) ceiling = parseFloat(rawBinding[1]);
    if (ceiling == null) {
        fail(
            "(b) no parseable opacity-ceiling binding in HeroAurora.vue — the OD-2 subtlety bound " +
                "must be encoded (HERO_AURORA_OPACITY_CEILING bound via :opacity-ceiling)",
        );
    } else if (ceiling < PROTOTYPE_WALL && ceiling <= BLESSED_CEILING) {
        ok(
            `(b) the aurora opacity ceiling is ${ceiling} — strictly below the P-HERO ${PROTOTYPE_WALL} ` +
                `wall AND within the blessed ${BLESSED_CEILING} bound ("more subtle", owner verbatim)`,
        );
    } else {
        fail(
            `(b) the aurora opacity ceiling ${ceiling} violates the OD-2 amendment — it must be ` +
                `< ${PROTOTYPE_WALL} (the prototype is the CEILING, not the target) and ≤ the blessed ` +
                `${BLESSED_CEILING}. Lowering is a design call; RAISING needs a new owner token.`,
        );
    }

    if (!/getBoundingClientRect/.test(noComments)) {
        ok("(d) zero DOM geometry reads in HeroAurora — the T-CL-3 read-after-write class is impossible by construction");
    } else {
        fail(
            "(d) HeroAurora calls getBoundingClientRect — the pointer path must use viewport metrics " +
                "only (clientX/innerWidth); a per-pointermove layout read is the measured 1097–1671 µs/call defect",
        );
    }
}

// ── (c) static over App.vue — default-on, no ?light residue ─────────────────
{
    const app = fs.readFileSync(APP, "utf8");
    const mounts =
        /<template\s+v-if="isHome"\s+#backdrop>[\s\S]*?<HeroAurora\s*\/>/.test(app);
    // Strip comments — prose NARRATING the deleted review lever ("the ?light=1
    // toggle is gone") must not red the residue check; only LIVE code counts.
    const appLive = app
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
    const lightResidue = /light=1|heroLightEnabled/.test(appLive);
    if (mounts && !lightResidue) {
        ok(
            "(c) App.vue mounts <HeroAurora /> in the #backdrop slot gated on isHome, by DEFAULT — " +
                "no ?light=1 review-lever residue (the blessed fork IS the default)",
        );
    } else if (!mounts) {
        fail("(c) App.vue does not mount <HeroAurora /> in the isHome-gated #backdrop slot");
    } else {
        fail(
            "(c) the ?light=1 review-lever residue survives in App.vue — the owner blessed the light " +
                "fork AS the default; the toggle dies with the prototype",
        );
    }
}

// ── (e) browser — home-only mount ────────────────────────────────────────────
const result = await withPage(
    {
        distDir: DIST,
        context: { viewport: { width: 1440, height: 900 } },
        label: "aurora home-only mount",
    },
    async (page, { url: base }) => {
        await page.goto(`${base}/#/`, { waitUntil: "load" });
        await page.waitForTimeout(1200);
        const onHome = await page.evaluate(() => {
            const el = document.querySelector(".hero-aurora");
            if (!el) return { present: false };
            const r = el.getBoundingClientRect();
            return { present: true, w: Math.round(r.width), h: Math.round(r.height) };
        });
        await navToScene(page, "cube", "Controls", { timeout: 10000 }).catch(() => {});
        await page.waitForTimeout(600);
        const onScene = await page.evaluate(
            () => !!document.querySelector(".hero-aurora"),
        );
        return { onHome, onScene };
    },
);
if (result.skipped) {
    console.log(`  ○ browser half skipped — ${result.reason}`);
} else {
    const { onHome, onScene } = result.value;
    if (onHome.present && onHome.w > 100 && onHome.h > 100) {
        ok(`(e) .hero-aurora renders full-viewport on home (${onHome.w}×${onHome.h})`);
    } else {
        fail(`(e) .hero-aurora absent/degenerate on home (${JSON.stringify(onHome)})`);
    }
    if (!onScene) {
        ok("(e) .hero-aurora is ABSENT on a scene route — the layer tears down with the hero");
    } else {
        fail("(e) .hero-aurora survives navigation to a scene — the mount must be home-only");
    }
}

if (failures.length > 0) {
    console.error(
        `\nproof:cursor-light-subtle — FAIL (${failures.length}): the Aurora-on-hero disposition is ` +
            "off the OD-2 contract (public door / subtlety bound / default-on / zero layout reads / home-only).",
    );
    process.exit(1);
}
console.log(
    "\nproof:cursor-light-subtle — PASS: the cursor light rides glass-ui's public Aurora on the home " +
        `hero, by default, at the amended ≤${BLESSED_CEILING} ceiling (strictly under the P-HERO 0.15), ` +
        "with zero layout reads and a home-only mount (T.D13 / OD-2).",
);
