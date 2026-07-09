#!/usr/bin/env node
/**
 * proof:engine-subpath-mirror — the `./engine` subpath drift gate, REDEFINED to
 * the TYPE-diff form (S.B6 S4; p07 / sb-#6 / X2-9; fold row 37; a08 F1+F2).
 *
 * BACKGROUND — why the old shape was a rubber stamp. R.W4b shipped the
 * `@mkbabb/keyframes.js/engine` subpath as a FULL static mirror of the heavy
 * surface (`src/animation/public.ts` → `dist/engine/index.js`), but NOTHING
 * gated it — FINAL.md asserted the equality as fact with no gate behind it
 * (a08 F1). The obvious gate — diff `Object.keys(dist/engine/index.js)` against
 * `Object.keys(loadAnimationEngine())` — is VACUOUS: both are hand-composed
 * runtime rosters over the SAME zones, so the "delete a re-export from
 * public.ts" born-RED plant stays GREEN (deleting a `public.ts` line drops the
 * key from BOTH sides symmetrically). A runtime-vs-runtime `Object.keys()` diff
 * cannot see a subpath that silently loses a symbol.
 *
 * THE REDEFINED GATE (p07). The honest oracle diffs the SUBPATH's RUNTIME keys
 * against the `AnimationEngine` d.ts TYPE key list — the authoritative roster
 * spelled once as the interface, gated to `loadAnimationEngine()` by
 * `proof:published-surface` clause (d). So the subpath's runtime surface is
 * gated TRANSITIVELY to the same interface the dynamic loader is:
 *
 *   clause 1 — subpath-not-stub (a08 F2). `dist/engine/index.d.ts` exists, is
 *     NOT a collapsed stub (size floor), and DECLARES the core heavy types
 *     (`KeyframesAnimation`, `CSSKeyframesAnimation`, `AnimationGroup`,
 *     `MorphSVG`, `ScrollScene`, `MotionPath`, `DrawSVG`). The dts-plugin
 *     soft-fails are hardened to build failures (S.B6 S6), but the shipped
 *     ARTIFACT is content-checked here too — a stale/rotted roll-up REDs.
 *
 *   clause 2 — runtime ⊆ interface (THE KEYSTONE; the TYPE-diff). Every runtime
 *     key of `dist/engine/index.js` (the built `public.ts` mirror) MUST appear
 *     in the `AnimationEngine` interface TYPE key list parsed from the built
 *     `dist/keyframes.d.ts`. A runtime export with NO matching interface field
 *     is a subpath symbol the published TYPE surface does not promise — the
 *     exact drift the old form was blind to. The relation is ⊆ (not ≡) BY
 *     DESIGN: a future wave that adds a runtime key AND its interface field in
 *     the SAME change (S.F1/S.F3's `compileToViewTransition`/`compileToEntry`)
 *     stays GREEN; the gate bites ONLY an UNPAIRED runtime addition.
 *
 * BORN-RED WITNESS (S.B6 S4). Add a runtime export to `src/animation/public.ts`
 * WITHOUT the matching `AnimationEngine` interface field, rebuild → clause 2
 * REDs (a runtime key absent from the TYPE list). Remove it → GREEN. The old
 * runtime-vs-runtime form would have stayed GREEN under the same plant.
 *
 * DECOUPLED FROM THE LOADER COLLAPSE (S.B6 S5; §6.3). This gate ships WHETHER OR
 * NOT the owner-optional `loadAnimationEngine → import("./engine/public")`
 * collapse ships — the TYPE-diff is drift-proof either way.
 *
 * PRECONDITION: the library is built (`npm run build:lib`). Exit 3 on an unbuilt
 * tree (an environment error, not a surface verdict) — same sequencing as
 * `proof:published-surface`.
 *
 * CI posture: HARD (development-only through S; wired into the CI roster at
 * S.Z2 per the wave's Verification). Structural, device-independent.
 *
 * RUN: npm run proof:engine-subpath-mirror
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist");
const DTS = path.join(DIST, "keyframes.d.ts");
const ENGINE_JS = path.join(DIST, "engine", "index.js");
const ENGINE_DTS = path.join(DIST, "engine", "index.d.ts");

const failures = [];

// ─────────────────────────────────────────────────────────────────────────────
// Precondition — the built artifacts exist. The gate measures dist AS BUILT.
// ─────────────────────────────────────────────────────────────────────────────
for (const [label, p] of [
    ["dist/keyframes.d.ts", DTS],
    ["dist/engine/index.js", ENGINE_JS],
    ["dist/engine/index.d.ts", ENGINE_DTS],
]) {
    if (!fs.existsSync(p)) {
        console.error(
            `proof:engine-subpath-mirror — ERROR: ${label} missing. ` +
                "Run `npm run build:lib` first (the gate measures the built artifact).",
        );
        process.exit(3);
    }
}

/** `/* *\/` block + `//` line comments → removed (keeps line structure). */
const stripComments = (src) =>
    src
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(^|\n)[ \t]*\/\/[^\n]*/g, "$1");

/**
 * The heavy TYPE roster: the `AnimationEngine` interface keys, parsed from the
 * built `dist/keyframes.d.ts` roll-up (members normalized one-per-line there).
 * A broken parse REDs the sanity floor below — it cannot silently pass.
 */
function parseEngineInterfaceKeys() {
    const src = fs.readFileSync(DTS, "utf8");
    const start = src.match(/^export declare interface AnimationEngine \{$/m);
    if (!start) return [];
    const body = src.slice(start.index + start[0].length);
    const end = body.match(/^\}/m);
    const lines = stripComments(body.slice(0, end ? end.index : 0)).split("\n");
    const keys = [];
    for (const line of lines) {
        const m = line.match(/^\s+(?:readonly\s+)?([A-Za-z_$][\w$]*)\??\s*[:(]/);
        if (m) keys.push(m[1]);
    }
    return [...new Set(keys)];
}

// ═════════════════════════════════════════════════════════════════════════════
// clause 1 — subpath-not-stub (a08 F2 — content-check the shipped roll-up)
// ═════════════════════════════════════════════════════════════════════════════
console.log(
    "\nclause 1 — subpath-not-stub (dist/engine/index.d.ts is a real roll-up)",
);
{
    const dts = fs.readFileSync(ENGINE_DTS, "utf8");
    const bytes = Buffer.byteLength(dts, "utf8");
    // A collapsed roll-up is the ~12-byte `export {}` stub, or a warn+return
    // that left a rotted artifact. Floor well above the stub, well below real.
    if (bytes < 2000) {
        failures.push(
            `(1) dist/engine/index.d.ts is ${bytes} B — a collapsed/stub roll-up ` +
                "(the dts plugin failed; S.B6 S6 makes that a build failure, but " +
                "an incremental build could ship a stale stub — content-checked here).",
        );
    }
    // The core heavy types the subpath's whole rationale is to expose. A drop
    // of any of these is a rotted mirror even if the byte floor passes.
    const CORE = [
        "KeyframesAnimation",
        "CSSKeyframesAnimation",
        "AnimationGroup",
        "MorphSVG",
        "ScrollScene",
        "MotionPath",
        "DrawSVG",
    ];
    for (const name of CORE) {
        const re = new RegExp(
            String.raw`declare (?:abstract class|class|function|const) ${name}[<(:; ]`,
        );
        if (!re.test(dts)) {
            failures.push(
                `(1) dist/engine/index.d.ts does NOT declare the core heavy type ` +
                    `\`${name}\` — the ./engine subpath roll-up is rotted (a08 F2).`,
            );
        }
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// clause 2 — runtime ⊆ interface (THE KEYSTONE — the TYPE-diff form; p07/sb-#6)
// ═════════════════════════════════════════════════════════════════════════════
console.log(
    "\nclause 2 — subpath runtime keys ⊆ AnimationEngine d.ts TYPE keys (p07/sb-#6)",
);
{
    const engineKeys = parseEngineInterfaceKeys();
    // Sanity floor — the parse must find the surface, or the whole diff is a
    // false-green. Any of these missing means the d.ts parse is broken.
    const CORE = ["KeyframesAnimation", "CSSKeyframesAnimation", "presets"];
    const missingCore = CORE.filter((k) => !engineKeys.includes(k));
    if (engineKeys.length < 10 || missingCore.length > 0) {
        failures.push(
            `(2) AnimationEngine d.ts interface parse broke (${engineKeys.length} keys; ` +
                `missing core: ${missingCore.join(", ") || "—"}) — fail-loud, not false-green.`,
        );
    } else {
        const mod = await import(pathToFileURL(ENGINE_JS).href);
        const runtimeKeys = Object.keys(mod);
        const iface = new Set(engineKeys);
        const unpaired = runtimeKeys.filter((k) => !iface.has(k));
        console.log(
            `  subpath runtime keys: ${runtimeKeys.length} · AnimationEngine TYPE keys: ${iface.size}`,
        );
        if (unpaired.length > 0) {
            failures.push(
                "(2) ./engine subpath exports these RUNTIME keys with NO matching " +
                    "`AnimationEngine` interface field (the TYPE surface does not " +
                    "promise them — an UNPAIRED runtime addition; pair it with the " +
                    "interface field, or drop the re-export): " +
                    unpaired.map((k) => `\`${k}\``).join(", "),
            );
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────

if (failures.length > 0) {
    console.error(
        `\nproof:engine-subpath-mirror — FAIL (${failures.length} finding(s)):`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    console.error(
        "\n  The `./engine` subpath is the heavy surface a TS consumer reaches\n" +
            "  statically (`import { CSSKeyframesAnimation } from \"@mkbabb/keyframes.js/engine\"`).\n" +
            "  Its runtime keys must be a subset of the `AnimationEngine` interface the\n" +
            "  published d.ts spells — every subpath symbol must be a promised TYPE.\n" +
            "  Author the interface field beside any new `public.ts` re-export (S.F1/S.F3\n" +
            "  add compileToViewTransition/compileToEntry in exactly this paired shape).",
    );
    process.exit(1);
}

console.log(
    "\nproof:engine-subpath-mirror — PASS: dist/engine/index.d.ts is a real roll-up\n" +
        "declaring the core heavy types, and every ./engine subpath runtime key is a\n" +
        "member of the AnimationEngine d.ts TYPE key list (the TYPE-diff form; drift-\n" +
        "proof whether or not the owner-optional loader collapse ships).",
);
