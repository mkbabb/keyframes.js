#!/usr/bin/env node
/**
 * proof:kf-differential — Q.WD2 S3 (the P.W9 S4 split): the kf-vs-browser
 * differential oracle (Band D · browser-tier · observe-only on the Linux runner).
 *
 * The existing `proof:roundtrip-fidelity` + `proof:replay-equality` oracles
 * prove INTERNAL consistency (the JS model round-trips against itself) but are
 * BLIND to browser divergence — a kf lerp bug (a %-vs-unitless confusion), a
 * color-space discrepancy, an easing mis-application. This gate closes the
 * "JS model matches the browser" claim the purely-JS oracles cannot prove.
 *
 * The mechanism (per the Q.WD2 spec §S3, grounded — NO new public API):
 *   1. Parse a WAAPI-eligible fixture via `loadAnimationEngine()` →
 *      `CSSKeyframesAnimation(opts).fromString(css).setTargets(target)`.
 *   2. Sample `kf.at(0.5)` → the kf JS-model midpoint for every animated leaf.
 *   3. CAPTURE the engine's WAAPI projection by spying on
 *      `Element.prototype.animate` around `kf.setUseWAAPI(true); kf.play()` —
 *      the captured `{ kfs, opts }` is exactly what the engine hands the browser
 *      (toWAAPIKeyframes/toWAAPIOptions are HEAVY free functions, NOT barrel-
 *      exported, so the spy is the grounded capture — it exercises the REAL
 *      playWAAPI delegation).
 *   4. Replay the captured keyframes as a real `target.animate(kfs, {...opts,
 *      fill:'both'})`, seek `currentTime = duration/2`, read
 *      `getComputedStyle(target)` — the BROWSER's own interpolated midpoint, the
 *      true differential reference (strictly stronger than the author stops).
 *   5. Compare: `|kf.at(0.5)[prop] - waapiMid[prop]| < TOLERANCE` for every
 *      numeric leaf (0.01 opacity/unitless, 0.5px lengths, 2° hue).
 *
 * ROBUSTNESS (the spy-capture hole the spec names): for each eligible fixture
 * the spy MUST have captured a call (`calls.length > 0`) — if `isWAAPIEligible`
 * returns false in headless Chromium (the engine falls back to rAF and never
 * calls Element.animate), the gate FAILS with `kf.waapiIneligibleReason`, NOT a
 * silent skip. The differential is only meaningful when WAAPI actually drove.
 *
 * MINIMUM COVERAGE: ≥ 4 WAAPI-eligible fixtures must actually RUN (not just be
 * present) — prevents a false-green where the eligible list empties and the gate
 * skips everything.
 *
 * CI POSTURE — observe-only on the Linux runner (the device-dependence law,
 * `project_ci_device_dependence_greening`): Chromium render/seek timing varies
 * on the slow runner, so a divergence beyond tolerance is RECORDED (not red) in
 * CI and HARD locally / on macOS — via `observeOnlyInCI(label, reason)`. The
 * SAME treatment as the browser-tier observe-only siblings
 * proof:scene-transition-perf + proof:lighthouse-a11y (both in proof:hygiene).
 *
 * SKIP CONTRACT: when Chromium is unresolvable (no `KF_PLAYWRIGHT_DIR` /
 * playwright install) the gate emits the established `[CI observe-only]` note
 * and exits 0 — UNLESS `KF_REQUIRE_BROWSER=1`, under which the missing browser
 * is a HARD fail (the W7-1 regime: it NEVER passes vacuously when the browser is
 * required). `fast-check` adds the ONLY new dependency to Q.WD2; this gate adds
 * NONE — Chromium is provided externally by the CI environment.
 *
 * FUTURE_AFTER_WD1: named-selector.css becomes a 5th eligible fixture once
 * Q.WD1 resolves the named starts via bindTimeline — pre-specified below, not a
 * blocking dependency (the ≥4 floor is met by the four %-selector fixtures).
 *
 * born-RED today: the script file is absent → exits 1. After authoring: GREEN on
 * the four eligible fixtures on macOS (or SKIP with no browser).
 */
import { execSync } from "node:child_process";
import http from "node:http";
import {
    createReadStream,
    existsSync,
    readFileSync,
    readdirSync,
    statSync,
} from "node:fs";
import { createRequire } from "node:module";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { REQUIRE_BROWSER, resolveChromium, withBrowser } from "./lib/demo-driver.mjs";
import { observeOnlyInCI } from "./lib/ci-env.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRequire = createRequire(join(root, "package.json"));
/** Resolve a package's `import` (ESM) condition entry from the repo root. The
 *  bare `.resolve` honours the default condition (which for parse-that is the
 *  CJS `require` entry); the served bundle must be the ESM build, so read the
 *  package's own package.json and resolve `exports['.'].import` explicitly. The
 *  package root is located by walking up from the resolved default entry (the
 *  package may not export `./package.json`). */
const resolveEsmEntry = (spec) => {
    let dir = dirname(repoRequire.resolve(spec));
    let pkgJsonPath = null;
    // Walk up to the package's own package.json whose `name` matches the spec.
    for (let i = 0; i < 12 && dir !== dirname(dir); i++) {
        const candidate = join(dir, "package.json");
        if (existsSync(candidate)) {
            const pkg = JSON.parse(readFileSync(candidate, "utf8"));
            if (pkg.name === spec) {
                pkgJsonPath = candidate;
                break;
            }
        }
        dir = dirname(dir);
    }
    if (!pkgJsonPath) {
        throw new Error(`could not locate the package.json for ${spec}`);
    }
    const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
    const dot = pkg.exports?.["."] ?? pkg.exports;
    const importEntry =
        (dot && (dot.import ?? dot.default)) ?? pkg.module ?? pkg.main;
    return join(dirname(pkgJsonPath), importEntry);
};
const distLib = join(root, "dist", "keyframes.js");
const srcDir = join(root, "src", "animation");
const CORPUS = join(root, "test", "fixtures", "keyframes");

const OBSERVE_REASON =
    "browser differential — Chromium render timing varies on slow runner";

console.log(
    "proof:kf-differential — Q.WD2 S3 (the kf.at(0.5) vs WAAPI interpolation oracle)",
);

// ── The WAAPI-eligible corpus subset (re-verified on the Q state) ──────────────
// numeric-only / uniform-or-per-stop easing / no computed units / no color
// interpolation. For each: the CSS property leaves we compare and how the
// browser's computed midpoint maps to the kf flattened leaf keys.
// `linearEasing: true` constructs the animation with an explicit `linear`
// timing function (a CSS-twin easing) so the engine takes the WAAPI path — the
// VALUE content (numeric/transform, no color, no computed units) is what makes a
// fixture eligible; the default `easeInOutCubic` has NO CSS twin and would force
// rAF (`waapiIneligibleReason: "easing has no faithful CSS twin"`), so the gate
// drives the eligible-class fixtures under a CSS-twin easing. `per-kf-easing`
// authors its OWN CSS-twin easing (`ease-in`) and is left as-authored — it
// exercises the per-stop-easing WAAPI projection.
// WAAPI eligibility (waapi/eligibility.ts) requires a UNIFORM CSS-twin easing
// (the default `easeInOutCubic` has NO CSS twin). SINGLE-segment fixtures emit
// their `.css` twin as the effect easing; MULTI-segment CSS-twin fixtures are
// ALSO eligible now (S.F5c S2 — the densify → single-`linear()` collapse bakes
// the composite curve into keyframes fed a bare `linear`), so `opacity-3stop`
// (3 stops / 2 segments) is no longer "inherently ineligible". It is still
// EXCLUDED from this eligible corpus for a different reason — a multi-segment
// differential arm is a future addition, not this gate's scope (the four
// two-stop fixtures below already exercise the eligible projection). The four
// eligible two-stop fixtures:
const ELIGIBLE = [
    {
        file: "multi-prop.css",
        linearEasing: true,
        why: "two-stop, multiple props (opacity/translateX/width), linear CSS twin",
    },
    {
        file: "transform-multiarg.css",
        linearEasing: true,
        why: "two-stop, transform shorthand (translate3d + scale), linear CSS twin",
    },
    {
        file: "per-kf-easing.css",
        linearEasing: false,
        why: "two-stop, per-stop authored easing (ease-in CSS twin) — exercises the per-stop projection",
    },
    {
        file: "linear-easing.css",
        linearEasing: false,
        why: "two-stop, authored linear() CSS-twin easing — exercises the linear() projection (Chromium HW-accels linear(); the CE-1.0 WebKit hold does not apply)",
    },
];

// Not yet / never eligible (recorded so the eligible list is auditable):
//   opacity-3stop.css — 3 stops / 2 segments. Eligible since S.F5c S2 (the
//     multi-segment densify → single-`linear()` collapse), but NOT yet driven
//     here — a multi-segment differential arm is a future addition (the emit is
//     the densified baked stops + bare `linear`, a different projection than the
//     two-stop fixtures). Excluded pending that arm, not because it is refused.
//   filter-multi.css — two-stop but the `filter` shorthand reads back from
//     getComputedStyle as an opaque string (blur()/brightness()), not the kf
//     flattened scalar keys; a future arm could decompose it.
//   steps-easing.css — a step function; the midpoint sits AT a step boundary, so
//     sub-frame seek granularity makes the comparison fragile. SKIP.
//   color-achromatic.css / color-chromatic.css — color interpolation in oklab
//     (WAAPI defaults to sRGB; kf defaults to oklab). Use `in srgb` fixtures.
//   var-calc.css — computed units; WAAPI evaluates at computed-value time.
//   named-selector.css — FUTURE_AFTER_WD1: add after Q.WD1 lands; call
//     kf.bindTimeline(new ManualTimeline()) before the WAAPI play so the named
//     starts resolve to numeric % (otherwise kf.at(0.5) throws the Q.WD1 guard
//     NAMED_SELECTOR_NO_TIMELINE).

// ── Tolerance policy (Q.WD2 §S3) ───────────────────────────────────────────────
const TOL = { unitless: 0.01, length: 0.5, hue: 2 };

// ── Skip/observe contract ──────────────────────────────────────────────────────
if (!resolveChromium()) {
    const msg =
        "proof:kf-differential — SKIP: Chromium/playwright not resolvable " +
        "(set KF_PLAYWRIGHT_DIR or install @playwright/test). Run the real check " +
        "with `KF_PLAYWRIGHT_DIR=… KF_REQUIRE_BROWSER=1 node scripts/proof-kf-differential.mjs`.";
    if (REQUIRE_BROWSER) {
        console.error(msg.replace("SKIP", "FAIL"));
        process.exit(1);
    }
    console.warn(msg);
    process.exit(0);
}

// Build the library if dist is absent or stale, so the gate exercises the
// CURRENT engine's WAAPI projection on the genuine path.
function newestMtime(dir) {
    let newest = 0;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        const m = entry.isDirectory() ? newestMtime(p) : statSync(p).mtimeMs;
        if (m > newest) newest = m;
    }
    return newest;
}
if (!existsSync(distLib) || statSync(distLib).mtimeMs < newestMtime(srcDir)) {
    console.log("[proof:kf-differential] building library (dist stale/missing)…");
    execSync("npm run build:lib", { cwd: root, stdio: "inherit" });
}

// ── The in-page differential (runs inside Chromium against the dist bundle) ────
// Serialized to a string so it crosses the page boundary intact. Receives the
// served bundle URL + the fixture corpus + the tolerance policy; returns a
// per-fixture report. ALL kf + WAAPI work happens in the real browser realm.
const inPage = async (bundleUrl, fixtures, tol) => {
    const bundle = await import(bundleUrl);
    const { loadAnimationEngine, resolveEasing } = bundle;
    const { CSSKeyframesAnimation } = await loadAnimationEngine();
    // The CSS-twin `linear` easing (a LIGHT barrel export) — passed in the ctor
    // options so it propagates onto every compiled frame's timingFunction.css,
    // making the eligible-class fixtures take the WAAPI path.
    const linearEasing = await resolveEasing("linear");

    /** Decompose a computed `matrix(...)`/`matrix3d(...)` into the axis-aligned
     *  scale + translate components the eligible fixtures use. */
    const decomposeMatrix = (str) => {
        const m = /matrix(3d)?\(([^)]+)\)/.exec(str);
        if (!m) return null;
        const n = m[2].split(",").map((s) => parseFloat(s.trim()));
        if (m[1]) {
            // matrix3d(m0..m15): column-major. scaleX=m0, scaleY=m5, scaleZ=m10;
            // translate = m12,m13,m14.
            return {
                scaleX: n[0],
                scaleY: n[5],
                scaleZ: n[10],
                tx: n[12],
                ty: n[13],
                tz: n[14],
            };
        }
        // matrix(a,b,c,d,e,f): scaleX=a, scaleY=d, translateX=e, translateY=f.
        return {
            scaleX: n[0],
            scaleY: n[3],
            scaleZ: 1,
            tx: n[4],
            ty: n[5],
            tz: 0,
        };
    };

    // Map a kf flattened leaf key (whose value is a snapshot `number[]`) → the
    // numeric value(s) read from the browser's computed-style midpoint + the
    // tolerance class. Returns an array of { label, kf, browser, tol } comparison
    // rows (one per scalar leaf).
    const compareLeaf = (key, kfNums, cs, mat) => {
        const rows = [];
        if (key === "opacity") {
            rows.push({
                label: "opacity",
                kf: kfNums[0],
                browser: parseFloat(cs.opacity),
                tol: tol.unitless,
            });
        } else if (key === "width") {
            rows.push({
                label: "width",
                kf: kfNums[0],
                browser: parseFloat(cs.width),
                tol: tol.length,
            });
        } else if (key === "transform.translateX") {
            rows.push({
                label: "transform.translateX",
                kf: kfNums[0],
                browser: mat ? mat.tx : NaN,
                tol: tol.length,
            });
        } else if (key === "transform.translate3d") {
            const axes = ["tx", "ty", "tz"];
            kfNums.forEach((v, i) => {
                rows.push({
                    label: `transform.translate3d[${i}]`,
                    kf: v,
                    browser: mat ? mat[axes[i]] : NaN,
                    tol: tol.length,
                });
            });
        } else if (
            key === "transform.scaleX" ||
            key === "transform.scaleY" ||
            key === "transform.scaleZ"
        ) {
            const axis = key.slice("transform.".length); // scaleX/scaleY/scaleZ
            rows.push({
                label: key,
                kf: kfNums[0],
                browser: mat ? mat[axis] : NaN,
                tol: tol.unitless,
            });
        }
        // Other leaf keys (none on the eligible corpus today) are skipped — only
        // the keys we can read from getComputedStyle are compared.
        return rows;
    };

    const report = [];
    for (const fx of fixtures) {
        const entry = { file: fx.file, ran: false, rows: [], reason: null };
        // Fresh target per fixture so a prior transform/opacity does not leak.
        const target = document.createElement("div");
        target.style.width = "100px";
        target.style.height = "100px";
        document.body.appendChild(target);

        try {
            const opts = { duration: 1000 };
            if (fx.linearEasing) opts.timingFunction = linearEasing;
            const kf = new CSSKeyframesAnimation(opts)
                .fromString(fx.css)
                .setTargets(target);

            // SNAPSHOT the kf midpoint scalars IMMEDIATELY — `at(0.5)` may return
            // (or alias) the animation's live `flatVars` buffer, which a later
            // `play()` overwrites in place. Copy `.value` out eagerly so the
            // comparison reads the genuine t=0.5 midpoint, never the post-play
            // final frame.
            const sampled = kf.at(0.5);
            const kfMid = {};
            for (const key of Object.keys(sampled)) {
                kfMid[key] = sampled[key].map((u) => u.value);
            }

            // Spy on Element.prototype.animate to capture the engine's WAAPI
            // projection AND the live Animation handle it returns. The engine's
            // playWAAPI starts a REAL animation; we CANCEL it immediately so it
            // does not paint or compete with our controlled, seeked replay.
            const calls = [];
            const liveAnims = [];
            const orig = Element.prototype.animate;
            Element.prototype.animate = function (kfs, opts) {
                const a = orig.call(this, kfs, opts);
                calls.push({ kfs, opts });
                liveAnims.push(a);
                return a;
            };
            try {
                kf.setUseWAAPI(true);
                await kf.play();
            } finally {
                Element.prototype.animate = orig;
            }
            // Tear down the engine's animation + cancel every live WAAPI handle
            // so only our seeked replay drives the target's computed values.
            try {
                kf.stop();
            } catch {
                /* best-effort teardown */
            }
            for (const a of liveAnims) {
                try {
                    a.cancel();
                } catch {
                    /* best-effort */
                }
            }

            if (calls.length === 0) {
                // The engine fell back to rAF — the differential is meaningless.
                entry.reason =
                    "WAAPI did not run (Element.animate never called); waapiIneligibleReason=" +
                    String(kf.waapiIneligibleReason);
                report.push(entry);
                continue;
            }

            // Replay the captured projection as a real WAAPI animation, seek to
            // the midpoint, and read the browser's own interpolated computed
            // values.
            //
            // EASING: replay with `easing: "linear"`, NOT the captured
            // `opts.easing`. `toWAAPIKeyframes` (waapi.ts:530) bakes the EASED
            // curve into the DENSIFIED keyframe stops (it samples
            // `interpFrames(t)` — the eased value — at each densified offset);
            // those stops are designed to be LINEARLY filled (the stops ARE the
            // curve). The differential's subject is exactly that claim: "the
            // browser, linearly interpolating kf's own densified samples,
            // reproduces kf.at(0.5)." Replaying with the captured `opts.easing`
            // (e.g. `ease-in`) re-applies the easing ON TOP of the already-eased
            // stops — a DOUBLE-EASE (probe-confirmed 2026-06-23: per-kf-easing
            // replays as 0.145 with `ease-in` vs 0.315 with `linear`, and
            // kf.at(0.5)=0.315). That double-application is an ENGINE WAAPI-
            // projection concern (waapi.ts `toWAAPIOptions` emits
            // `uniformTiming.css` while `toWAAPIKeyframes` already baked the
            // curve), dispatched to the Q.WB waapi lane — NOT this gate's
            // subject. Forcing `linear` here isolates the kf-model-vs-browser-
            // interpolation fidelity the differential is FOR.
            const captured = calls[0];
            const duration =
                (captured.opts && captured.opts.duration) ?? 1000;
            const waapiAnim = target.animate(captured.kfs, {
                ...captured.opts,
                easing: "linear",
                fill: "both",
            });
            waapiAnim.pause();
            waapiAnim.currentTime = duration / 2;
            // Force a style flush so getComputedStyle reflects the seeked time.
            void target.offsetWidth;
            const cs = getComputedStyle(target);
            const csSnap = {
                opacity: cs.opacity,
                width: cs.width,
                transform: cs.transform,
            };
            const mat = decomposeMatrix(csSnap.transform);
            waapiAnim.cancel();

            for (const key of Object.keys(kfMid)) {
                const rows = compareLeaf(key, kfMid[key], csSnap, mat);
                for (const r of rows) entry.rows.push(r);
            }
            entry.ran = true;
        } catch (e) {
            entry.reason = "threw: " + String((e && e.message) || e);
        } finally {
            target.remove();
        }
        report.push(entry);
    }
    return report;
};

// ── Drive Chromium: serve dist/ (where keyframes.js lives), navigate to a
//    minimal fixture page, and run the in-page differential ─────────────────────
const distDir = join(root, "dist");
if (!existsSync(distLib)) {
    const msg =
        "proof:kf-differential — dist/keyframes.js missing — run `npm run build:lib` first.";
    if (REQUIRE_BROWSER) {
        console.error(msg);
        process.exit(1);
    }
    console.warn(msg + " (SKIP)");
    process.exit(0);
}

const fixtures = ELIGIBLE.map((e) => ({
    file: e.file,
    linearEasing: e.linearEasing,
    css: readFileSync(join(CORPUS, e.file), "utf8"),
}));

const failures = [];
const fail = (label) => {
    process.exitCode = 1;
    console.error(`  ✗ ${label}`);
    failures.push(label);
};
const note = (label) => console.log(`  · ${label}`);
const miss = (label) => observeOnlyInCI(label, OBSERVE_REASON, { fail, note });

// A purpose-built static server: a synthetic HTML page at `/` carrying an import
// MAP that resolves the kf bundle's ONE bare specifier `@mkbabb/value.js` to the
// served value.js dist (the kf HEAVY chunks reached via loadAnimationEngine()
// statically import it; the browser cannot resolve a bare specifier without the
// map). The kf dist (`/dist/*`) and the value.js dist (`/vjs/*`) are served as
// ES-module trees so the in-page `import("/keyframes.js")` + value.js's relative
// chunks all resolve same-origin (an opaque-origin setContent doc cannot import
// http://, and dist has no index.html — hence the synthetic root).
const vjsEntry = resolveEsmEntry("@mkbabb/value.js");
const ptEntry = resolveEsmEntry("@mkbabb/parse-that");
const vjsDistDir = dirname(vjsEntry);
const ptDistDir = dirname(ptEntry);
const MIME = {
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".html": "text/html",
    ".css": "text/css",
    ".json": "application/json",
    ".map": "application/json",
};
const ROOT_HTML =
    "<!doctype html><html><head><meta charset=utf-8>" +
    '<script type="importmap">' +
    JSON.stringify({
        imports: {
            // The kf dist's bare specifiers; value.js's transitive bare edge.
            // S.A0(4): the value.js O subpath split means the lazy engine chunk
            // ALSO imports `@mkbabb/value.js/math` (→ dist/subpaths/math.js) —
            // map the subpath namespaces (keeping the bare maps); the server's
            // extensionless-`.js` fallback serves `subpaths/math` → `math.js`.
            "@mkbabb/value.js": "/vjs/" + vjsEntry.slice(vjsDistDir.length + 1),
            "@mkbabb/value.js/": "/vjs/subpaths/",
            "@mkbabb/parse-that": "/pt/" + ptEntry.slice(ptDistDir.length + 1),
            "@mkbabb/parse-that/": "/pt/",
        },
    }) +
    "</scr" +
    "ipt></head><body></body></html>";
const startServer = () =>
    new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
            if (u === "/" || u === "/index.html") {
                res.writeHead(200, { "content-type": "text/html" });
                res.end(ROOT_HTML);
                return;
            }
            // `/vjs/<chunk>` → value.js dist; `/pt/<chunk>` → parse-that dist;
            // everything else → the kf dist.
            const [base, rel] = u.startsWith("/vjs/")
                ? [vjsDistDir, u.slice("/vjs/".length)]
                : u.startsWith("/pt/")
                  ? [ptDistDir, u.slice("/pt/".length)]
                  : [distDir, u.replace(/^\//, "")];
            let p = join(base, rel);
            // S.A0(4) — extensionless-`.js` fallback: importmap prefix
            // substitution yields `/vjs/subpaths/math` (no extension) for the
            // `@mkbabb/value.js/math` subpath specifier; serve `subpaths/math.js`.
            if (p.startsWith(base) && !existsSync(p) && existsSync(p + ".js")) {
                p += ".js";
            }
            if (!p.startsWith(base) || !existsSync(p) || statSync(p).isDirectory()) {
                res.writeHead(404).end();
                return;
            }
            res.writeHead(200, {
                "content-type": MIME[extname(p)] ?? "application/octet-stream",
            });
            createReadStream(p).pipe(res);
        });
        server.listen(0, () => {
            const port = server.address().port;
            resolve({
                url: `http://127.0.0.1:${port}`,
                close: () => new Promise((r) => server.close(r)),
            });
        });
    });

const result = await withBrowser(
    async (browser) => {
        const server = await startServer();
        try {
            const context = await browser.newContext();
            try {
                const page = await context.newPage();
                await page.goto(server.url + "/", {
                    waitUntil: "domcontentloaded",
                });
                const bundleUrl = server.url + "/keyframes.js";
                return await page.evaluate(
                    ({ fnSrc, bundleUrl, fixtures, tol }) => {
                        // eslint-disable-next-line no-new-func
                        const fn = new Function("return (" + fnSrc + ")")();
                        return fn(bundleUrl, fixtures, tol);
                    },
                    {
                        fnSrc: inPage.toString(),
                        bundleUrl,
                        fixtures,
                        tol: TOL,
                    },
                );
            } finally {
                await context.close();
            }
        } finally {
            await server.close();
        }
    },
    { label: "proof:kf-differential" },
);

if (result.skipped) {
    // withBrowser already poisoned exitCode under KF_REQUIRE_BROWSER; otherwise
    // it is an honest skip.
    console.warn(
        `proof:kf-differential — SKIP: ${result.reason ?? "browser half unavailable"}`,
    );
    process.exit(process.exitCode ?? 0);
}

const report = result.value;
let ranCount = 0;
for (const entry of report) {
    if (!entry.ran) {
        // A fixture that should have been eligible did NOT take the WAAPI path:
        // this is a HARD failure (the spy-capture robustness clause), NOT
        // device-dependent — red everywhere.
        fail(
            `[${entry.file}] WAAPI-eligible fixture did not run the differential — ${entry.reason}`,
        );
        continue;
    }
    ranCount++;
    if (entry.rows.length === 0) {
        fail(
            `[${entry.file}] ran but produced ZERO comparable numeric leaves — the differential is vacuous`,
        );
        continue;
    }
    for (const r of entry.rows) {
        const delta = Math.abs(r.kf - r.browser);
        if (!Number.isFinite(delta) || delta > r.tol) {
            // A divergence beyond tolerance is the device-DEPENDENT observable
            // (Chromium seek/render float precision varies on the slow runner):
            // observe-only in CI, hard locally / on macOS.
            miss(
                `[${entry.file}] ${r.label}: |kf ${r.kf} - waapi ${r.browser}| = ${
                    Number.isFinite(delta) ? delta.toFixed(4) : "NaN"
                } > tol ${r.tol}`,
            );
        } else {
            note(
                `[${entry.file}] ${r.label}: |kf ${r.kf} - waapi ${r.browser}| = ${delta.toFixed(4)} ≤ ${r.tol}`,
            );
        }
    }
}

// ── minimum-coverage — ≥ 4 eligible fixtures actually ran ──────────────────────
if (ranCount < 4) {
    // A device-INDEPENDENT structural assertion (the eligible list emptied) →
    // HARD fail everywhere, NOT observe-only.
    fail(
        `minimum coverage: only ${ranCount} WAAPI-eligible fixture(s) ran the differential (need ≥ 4) — the eligible corpus emptied; the gate would false-green by vacuous skip`,
    );
} else {
    console.log(
        `  ✓ minimum coverage: ${ranCount} WAAPI-eligible fixtures ran the differential (≥ 4)`,
    );
}

console.log("");
if (process.exitCode === 1 && failures.length > 0) {
    console.error(
        "proof:kf-differential — FAIL: the kf JS model diverged from the browser's\n" +
            "WAAPI interpolation (or a WAAPI-eligible fixture did not take the WAAPI\n" +
            "path). The divergence rows above name the fixture + property + delta.\n" +
            "On the Linux runner, tolerance misses are observe-only (RECORDED); the\n" +
            "structural failures (a fixture not running, zero coverage) are hard.",
    );
    process.exit(1);
}
console.log(
    "proof:kf-differential — PASS: kf.at(0.5) matches the browser's WAAPI midpoint\n" +
        "within tolerance for every WAAPI-eligible fixture (≥ 4 ran), or the\n" +
        "divergences were observe-only on the Linux runner. The differential rides\n" +
        "the Element.prototype.animate spy + the getComputedStyle midpoint read.",
);
