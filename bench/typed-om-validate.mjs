// typed-om-validate.mjs — S.F5c S1 (SF-7, fold row 43): the Typed-OM write-path
// verdict, MEASURED in a real browser and recorded TERMINALLY.
//
// The audit flagged the Typed-OM (StylePropertyMap.set) write path as a contrived
// DUAL-PATH for a Chromium-mostly win that may be ZERO on single-property writes.
// grep confirms ZERO Typed-OM surface in src/ and no prototype exists, so the
// DEFAULT verdict is KILL-with-recorded-bench-measurement: the permanent dual-path
// (no Firefox) is justified ONLY if Typed-OM beats a PRE-STATED write-throughput
// threshold. This spike is the measurement, NOT an adoption — the API does not
// exist in node, so the verdict needs a REAL browser.
//
// PRE-STATED ADOPT THRESHOLD (the bar the dual-path must clear):
//   multi-property  Typed-OM / string  >= 1.2×  (the wave's claimed-win shape)
//   AND single-property  Typed-OM / string  >= 1.0×  (the audit's possibly-zero case)
// ADOPT fires ONLY above BOTH, and THEN as a SEPARATE authored wave (never folded
// here — the render-path rewrite is unbounded). Below the bar → KILL the dual-path.
//
// It launches a real Chromium (playwright-core via KF_PLAYWRIGHT_DIR — the kf
// browser-gate convention) and measures the write cost:
//   string `style.setProperty` (build string + browser parse)  vs
//   Typed-OM `attributeStyleMap.set` (build CSSStyleValue + no parse),
// for a multi-property transform AND a single property. Honest ratio → verdict.
// Writes the TERMINAL record to scripts/typed-om-decision.json (the *-decision.json
// precedent). Run: `KF_PLAYWRIGHT_DIR=/path/to/glass-ui node bench/typed-om-validate.mjs`.
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const decisionPath = join(root, "scripts", "typed-om-decision.json");

// The PRE-STATED threshold — declared HERE, before the measurement, so the
// verdict is a mechanical comparison against a fixed bar (not a post-hoc read).
const THRESHOLD = {
    multiPropertyTomOverString: 1.2,
    singlePropertyTomOverString: 1.0,
    meaning:
        "ADOPT the permanent Typed-OM dual-path ONLY if multi-property TOM/string >= 1.2x AND single-property TOM/string >= 1.0x (parity); otherwise KILL — the string path is fine.",
};

/** Resolve Chromium via KF_PLAYWRIGHT_DIR (the kf browser-gate convention). */
function resolveChromium() {
    const dir =
        process.env.KF_PLAYWRIGHT_DIR ?? "/Users/mkbabb/Programming/glass-ui";
    const requireFrom = createRequire(join(dir, "package.json"));
    for (const pkg of ["playwright-core", "@playwright/test", "playwright"]) {
        try {
            return requireFrom(pkg).chromium;
        } catch {
            /* try next */
        }
    }
    return null;
}

const page_fn = () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const N = 200000,
        WARM = 5000;
    const supportsTOM =
        "attributeStyleMap" in el && typeof CSS !== "undefined" && !!CSS.px;
    let x = 0;
    const time = (fn) => {
        for (let i = 0; i < WARM; i++) fn(i);
        const t0 = performance.now();
        for (let i = 0; i < N; i++) fn(i);
        return N / ((performance.now() - t0) / 1000);
    };
    // ── multi-property transform (translate/scale/rotate + opacity) ──
    const strMulti = (i) => {
        x = i & 255;
        el.style.setProperty(
            "transform",
            `translate(${x}px, ${x / 2}px) scale(${1 + x / 500}) rotate(${x}deg)`,
        );
        el.style.setProperty("opacity", String(1 - x / 512));
    };
    const tomMulti = (i) => {
        x = i & 255;
        el.attributeStyleMap.set(
            "transform",
            new CSSTransformValue([
                new CSSTranslate(CSS.px(x), CSS.px(x / 2)),
                new CSSScale(CSS.number(1 + x / 500), CSS.number(1 + x / 500)),
                new CSSRotate(CSS.deg(x)),
            ]),
        );
        el.attributeStyleMap.set("opacity", CSS.number(1 - x / 512));
    };
    // ── single property (opacity) — the audit's possibly-zero case ──
    const strSingle = (i) => {
        el.style.setProperty("opacity", String(1 - (i & 255) / 512));
    };
    const tomSingle = (i) => {
        el.attributeStyleMap.set("opacity", CSS.number(1 - (i & 255) / 512));
    };

    const med3 = (mk) => {
        const r = [mk(), mk(), mk()].sort((a, b) => a - b);
        return r[1];
    };
    const out = { supportsTOM };
    if (supportsTOM) {
        const sm = med3(() => time(strMulti)),
            tm = med3(() => time(tomMulti));
        const ss = med3(() => time(strSingle)),
            ts = med3(() => time(tomSingle));
        out.multiProperty = {
            hzString: Math.round(sm),
            hzTypedOM: Math.round(tm),
            tomOverString: +(tm / sm).toFixed(2),
        };
        out.singleProperty = {
            hzString: Math.round(ss),
            hzTypedOM: Math.round(ts),
            tomOverString: +(ts / ss).toFixed(2),
        };
    }
    return out;
};

const chromium = resolveChromium();
if (!chromium) {
    console.error(
        "typed-om-validate — FAIL: playwright-core not resolvable. Set " +
            "KF_PLAYWRIGHT_DIR=/path/to/glass-ui (the kf browser-gate convention).",
    );
    process.exit(1);
}

const browser = await chromium.launch();
try {
    const page = await browser.newPage();
    await page.goto("about:blank");
    const r = await page.evaluate(page_fn);

    // Mechanical verdict against the PRE-STATED threshold. ADOPT is authorized
    // ONLY as a SEPARATE wave even when it fires — never implemented in-line.
    const clearsBar =
        r.supportsTOM &&
        r.multiProperty.tomOverString >= THRESHOLD.multiPropertyTomOverString &&
        r.singleProperty.tomOverString >= THRESHOLD.singlePropertyTomOverString;
    const verdict = !r.supportsTOM
        ? "KILL"
        : clearsBar
          ? "ADOPT-SEPARATE-WAVE"
          : "KILL";
    const verdictReason = !r.supportsTOM
        ? "no Typed-OM in this build"
        : clearsBar
          ? `Typed-OM clears the pre-stated bar (multi ${r.multiProperty.tomOverString}x >= ${THRESHOLD.multiPropertyTomOverString}x AND single ${r.singleProperty.tomOverString}x >= ${THRESHOLD.singlePropertyTomOverString}x) — ADOPT is authorized, but ONLY as a SEPARATE authored wave (the render-path rewrite is unbounded); NOT implemented here.`
          : `Typed-OM does NOT clear the pre-stated bar (multi ${r.multiProperty.tomOverString}x < ${THRESHOLD.multiPropertyTomOverString}x). KILL the permanent dual-path — the string path is fine; there is no Typed-OM surface in src/ and none is added.`;

    const record = {
        $comment:
            "S.F5c S1 (SF-7, fold row 43) — the Typed-OM (StylePropertyMap.set) " +
            "write-path adopt/kill verdict, MEASURED in a real Chromium " +
            "(playwright-core via KF_PLAYWRIGHT_DIR). DEFAULT KILL-with-recorded-bench: " +
            "the permanent dual-path (no Firefox) is justified ONLY if Typed-OM beats " +
            "the PRE-STATED write-throughput threshold below. ADOPT fires ONLY above the " +
            "threshold, and THEN as a SEPARATE authored wave (never folded here — the " +
            "render-path rewrite is unbounded). grep confirms ZERO Typed-OM surface in " +
            "src/ and no prototype exists; this spike is the measurement, not an adoption. " +
            "Bench: bench/typed-om-validate.mjs; re-measure with " +
            "`KF_PLAYWRIGHT_DIR=/path/to/glass-ui node bench/typed-om-validate.mjs`.",
        metric:
            "Typed-OM attributeStyleMap.set vs string style.setProperty write throughput (hz), real Chromium",
        threshold: THRESHOLD,
        browser: "chromium (playwright-core, KF_PLAYWRIGHT_DIR)",
        supportsTOM: r.supportsTOM,
        multiProperty: r.multiProperty ?? null,
        singleProperty: r.singleProperty ?? null,
        verdict,
        verdictReason,
        adoptIsSeparateWave: true,
        recordedAt: new Date().toISOString(),
    };

    writeFileSync(decisionPath, JSON.stringify(record, null, 2) + "\n", "utf8");
    console.log(JSON.stringify(record, null, 2));
    console.log(
        `\ntyped-om-validate — recorded terminal verdict ${verdict} → scripts/typed-om-decision.json`,
    );
} finally {
    await browser.close();
}
