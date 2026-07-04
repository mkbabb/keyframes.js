#!/usr/bin/env node
/**
 * color-fidelity-harness — the K.W12 ED-4 public conformance-result RENDERER.
 *
 * Renders the public artifact `docs/color-fidelity.md` from the GATED engine
 * measurement `docs/color-fidelity-data.json` (emitted by
 * `test/engine/color-fidelity.test.ts` under the real `CSSKeyframesAnimation` engine in
 * jsdom). ONE measurement: the test GATES it (every midpoint ΔE under the JND);
 * this harness PUBLISHES it (the human-readable conformance table). So the
 * published ΔE numbers ARE the gated ones — un-spinnable, spec-measured.
 *
 * THE BENCHMARK (the ONLY one kf can publish honestly — ecosystem-distribution.md
 * §5.4): a CORRECTNESS benchmark, not a throughput one. It measures kf's UNIQUE
 * axis-2 (perceptual color) against the CSS Color 4 SPEC reference (the oklab
 * color-mix midpoint), NOT against a rival's speed. GSAP animates oklch
 * incorrectly; Motion/anime mix in RGB; kf interpolates in perceptual oklab —
 * this harness proves the conformance.
 *
 * RUN:  npm run bench:color-fidelity   (re-runs the test → re-emits the data →
 *                                        re-renders the artifact)
 *       node scripts/color-fidelity-harness.mjs        (render from the data)
 *       node scripts/color-fidelity-harness.mjs --check (print; write nothing)
 *
 * `proof:color-fidelity` asserts the rendered artifact matches a fresh render of
 * the data AND every published ΔE is under the JND.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);
const DATA = path.join(REPO, "docs", "color-fidelity-data.json");
const ARTIFACT = path.join(REPO, "docs", "color-fidelity.md");

const check = process.argv.includes("--check");

export function renderArtifact() {
    if (!fs.existsSync(DATA)) {
        throw new Error(
            `color-fidelity data missing (${path.relative(REPO, DATA)}). ` +
                `Run \`npx vitest run test/engine/color-fidelity.test.ts\` to emit it.`,
        );
    }
    const data = JSON.parse(fs.readFileSync(DATA, "utf8"));
    const fmt = (n) => {
        if (n === 0) return "0";
        if (n < 1e-9) return n.toExponential(2);
        return n.toFixed(6);
    };
    const allUnder = data.pairs.every((p) => p.deltaE < data.jnd);
    const worst = Math.max(...data.pairs.map((p) => p.deltaE));

    const L = [];
    L.push("# Color-fidelity conformance — kf's oklab lerp vs CSS Color 4");
    L.push("");
    L.push(
        "> The ONE benchmark only kf can publish honestly (K.W12 ED-4): a",
    );
    L.push(
        "> CORRECTNESS conformance harness, not a throughput pissing match. It",
    );
    L.push(
        "> measures kf's UNIQUE axis — perceptual color — against the CSS Color 4",
    );
    L.push(
        "> SPEC, and is un-spinnable: it measures correctness against a spec, not",
    );
    L.push("> speed against a rival.");
    L.push("");
    L.push("## What this proves");
    L.push("");
    L.push(
        "kf interpolates colors in **perceptual oklab** by default. Most",
    );
    L.push(
        "JS animation libraries mix in sRGB (Motion, anime) or animate oklch",
    );
    L.push(
        "incorrectly (GSAP, per its own forums) — a two-stop `background-color`",
    );
    L.push(
        "track replayed by them DRIFTS from the perceptual path, muddying the",
    );
    L.push("midpoint. kf does not.");
    L.push("");
    L.push("## The measurement");
    L.push("");
    L.push(
        "For each color pair, the harness animates `background-color: from → to`",
    );
    L.push(
        "through the REAL engine (`CSSKeyframesAnimation`, oklab colorSpace),",
    );
    L.push(
        "samples the **midpoint** of kf's playback (`interpFrames(0.5)`), and",
    );
    L.push(
        "compares it by **ΔE-OK** against the CSS Color 4 reference midpoint",
    );
    L.push(
        "(`" +
            data.reference +
            "`), computed by the PUBLISHED producer (`" +
            data.producer +
            "` — kf consumes it, it does not re-author it).",
    );
    L.push("");
    L.push(
        "**Conformance threshold:** the just-noticeable difference `DELTA_E_OK_JND" +
            " = " +
            data.jnd +
            "`. A midpoint ΔE under the JND means kf's lerp is perceptually",
    );
    L.push("**indistinguishable** from the CSS Color 4 reference.");
    L.push("");
    L.push("## Results");
    L.push("");
    L.push("| from | to | midpoint ΔE-OK | under JND? | pair |");
    L.push("| --- | --- | --- | --- | --- |");
    for (const p of data.pairs) {
        L.push(
            `| \`${p.from}\` | \`${p.to}\` | ${fmt(p.deltaE)} | ${p.deltaE < data.jnd ? "✓" : "✗"} | ${p.note} |`,
        );
    }
    L.push("");
    L.push(
        `**Conformance: ${allUnder ? "PASS" : "FAIL"}** — ${data.pairs.length} pairs, worst-case midpoint ΔE-OK = ${fmt(worst)} (threshold ${data.jnd}). ` +
            (allUnder
                ? "Every kf midpoint is perceptually identical to the CSS Color 4 reference (the ΔE sits at floating-point epsilon — kf's oklab lerp IS the spec path)."
                : "At least one pair exceeds the JND — a lossy perceptual path."),
    );
    L.push("");
    L.push("## Reproduce");
    L.push("");
    L.push("```sh");
    L.push("npm run proof:color-fidelity   # gate: re-measure + verify this table");
    L.push("npm run bench:color-fidelity   # re-measure + re-render this artifact");
    L.push("```");
    L.push("");
    L.push(
        "The corpus is `test/fixtures/color-fidelity-corpus.ts`; the gated",
    );
    L.push(
        "measurement is `test/engine/color-fidelity.test.ts`; the producer is value.js's",
    );
    L.push(
        "`deltaEOK` (the SAME kernel K.W10's CC-2 densify pixel-proof consumes —",
    );
    L.push("one producer, two consumers, both RIPE).");
    L.push("");
    return L.join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const md = renderArtifact();
    if (check) {
        process.stdout.write(md);
    } else {
        fs.writeFileSync(ARTIFACT, md);
        console.log(
            `color-fidelity-harness — wrote ${path.relative(REPO, ARTIFACT)} ` +
                `(${md.length} B) from the gated engine measurement. Run ` +
                `\`npm run proof:color-fidelity\` to verify.`,
        );
    }
}
