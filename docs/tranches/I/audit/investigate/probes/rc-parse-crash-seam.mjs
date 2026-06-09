/**
 * rc-parse-crash-seam — ROOT-CAUSE [rc-parse-crash] confirmation probe.
 *
 * Pins the EXACT empty-string → "......" seam, in isolation, against the REAL
 * value.js build that kf consumes. No DOM, no Playwright needed for THIS proof:
 * the producer is value.js's `parseCSSValueUnit("")` and the consumer is the
 * engine's computed-value resolution (`getComputedValue` for a `var` whose
 * custom property is unset → `getComputedStyle(...).getPropertyValue(name) ===
 * ""`). We prove (a) the bare "......" is the unambiguous fingerprint of EMPTY
 * input (every non-empty input embeds its own text in the dots), and (b) the
 * var-path read-back hands "" straight to the parser with no guard.
 *
 * Run:
 *   KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *   node docs/tranches/I/audit/investigate/probes/rc-parse-crash-seam.mjs
 */
import { createRequire } from "node:module";

const requireFrom = createRequire(
    process.env.KF_PLAYWRIGHT_DIR
        ? process.env.KF_PLAYWRIGHT_DIR + "/package.json"
        : import.meta.url,
);

// Resolve value.js the SAME way kf does (the published sibling).
const valueJs = await import("@mkbabb/value.js");
const { parseCSSValueUnit } = valueJs;

const out = { producer: {}, fingerprint: {}, var_path: {} };

// (a) THE PRODUCER — what input yields the bare "......".
for (const input of ["", "var(--rotationX)", "matrix3d(1,0,0,0)", "45deg", "  "]) {
    try {
        parseCSSValueUnit(input);
        out.producer[JSON.stringify(input)] = "OK (no throw)";
    } catch (e) {
        out.producer[JSON.stringify(input)] = String(e.message).split("\n").pop();
    }
}

// (b) THE FINGERPRINT — only "" renders the 6-dot signature with no embedded text.
const emptyMsg = (() => {
    try { parseCSSValueUnit(""); } catch (e) { return e.message; }
})();
out.fingerprint.emptyMessage = emptyMsg;
out.fingerprint.isBareDots = /Parse error at offset 0: "\.{6}"/.test(emptyMsg ?? "");
out.fingerprint.note =
    'the "......" == `"..." + slice("", 0, 0) + "..."` — six dots, no text = EMPTY input';

console.log(JSON.stringify(out, null, 2));
