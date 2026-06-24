#!/usr/bin/env node
/**
 * proof:readme-runs — clause (c) of the J.W5 §Hard gate (`proof:published-surface`
 * sibling, CORRECTNESS tier): the README snippets EXECUTE against the built dist.
 *
 * The DOCS oracle made runnable (J.W5 S2): a README that teaches an API the
 * dist cannot run is the publish-boundary twin of a source-shape gate — prose
 * plausibility is not truth. This runner:
 *
 *   1. EXTRACTS every fenced snippet tagged runnable (info string `ts run`)
 *      from the README's two TEACHING sections — §Beyond CSS and §Animation —
 *      and EXECUTES each one, verbatim, against the BUILT `dist/keyframes.js`
 *      under Node + a minimal jsdom shim (one child process per snippet, so a
 *      lingering rAF loop in one snippet cannot poison the next).
 *   2. Asserts NO throw, and asserts every stated `// =>` result MATCHES the
 *      computed value (numeric compare with 1e-6 tolerance; deep for
 *      arrays/objects). The parent additionally verifies the child ran
 *      EXACTLY as many `// =>` assertions as the snippet states — a snippet
 *      whose assertions silently didn't execute REDs.
 *   3. THE MINIMUM-COUNT FLOOR (un-gameable by under-tagging — the
 *      absent-element/note()-not-fail false-green the I lesson forbids):
 *      derived from the TAUGHT ROSTER, not a frozen integer. Every §Beyond
 *      CSS / §Animation subsection whose heading names a public value export
 *      (the S1b set: the light barrel's runtime exports + the AnimationEngine
 *      keys from the d.ts roll-up) MUST contain ≥1 runnable-tagged fence; the
 *      total runnable count must meet that roster floor; and each HEAVY front
 *      door taught (`animate`, `MotionPath`/`fromMotionPath`,
 *      `DrawSVG`/`fromDrawSVG`) must be exercised by ≥1 runnable snippet.
 *      The degenerate case — IMPL tags ZERO snippets runnable — REDs: the
 *      floor is the roster size, the set is empty.
 *
 * BITE: reds on a snippet importing a non-existent export (TypeError at run),
 * a wrong `// =>` (assert fail), a taught primitive with no runnable snippet
 * (floor), or an untaught-but-claimed identifier (the snippet throws).
 * Witnessed born-RED on the pre-S2 tree: §SmoothProgress taught
 * `smooth.tick()` — a method that does not exist on the shipped class
 * (`tickDt` only) — and §NumericAnimation/§Timeline referenced the free
 * identifier `easeOutCubic`, importable from nowhere on the package surface.
 * Both ran only because nothing ran them.
 *
 * The fixture contract (the "minimal jsdom/globalThis shim" the spec names):
 * snippets may reference consumer-owned DOM/render fixtures — `element`,
 * `box`, `card`, `a`, `b`, `sourceEl`, `targetEl`, `heading` (an aria-label
 * container with aria-hidden word spans), `pathEl` (SVG path; jsdom lacks
 * getTotalLength, so the fixture stubs it), and a canvas-ish `ctx`/`w`/`h`/
 * `drawDial`. Everything else must come from the package surface — the
 * prelude destructures ONLY the light barrel's real exports (parsed from
 * src/animation/index.ts), so a phantom identifier is a ReferenceError, not
 * a silently-provided crutch.
 *
 * PRECONDITION: the library is built (`npm run build:lib`) — exit 3 otherwise.
 * RUN: npm run proof:readme-runs
 * CI wiring: rides the J.W3 `proof:ci-coverage` roster motion with its parent
 * gate (`proof:published-surface`).
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";
import ts from "typescript";

const execFileAsync = promisify(execFile);

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const README = path.join(REPO, "README.md");
const BARREL = path.join(REPO, "src/animation/index.ts");
const DIST_ENTRY = path.join(REPO, "dist/keyframes.js");
const DTS = path.join(REPO, "dist/keyframes.d.ts");
// Inside the repo so bare specifiers (jsdom) resolve from node_modules.
const TMP = path.join(REPO, "node_modules/.cache/kf-readme-runs");

const SNIPPET_TIMEOUT_MS = 30_000;
const CONCURRENCY = 5;

const failures = [];

// ─────────────────────────────────────────────────────────────────────────────
// Precondition — the gate measures the BUILT artifact.
// ─────────────────────────────────────────────────────────────────────────────
if (!fs.existsSync(DIST_ENTRY) || !fs.existsSync(DTS)) {
    console.error(
        "proof:readme-runs — ERROR: dist/keyframes.js / keyframes.d.ts missing. " +
            "Run `npm run build:lib` first (the snippets execute against the built dist).",
    );
    process.exit(3);
}

// ─────────────────────────────────────────────────────────────────────────────
// The public value-export sets (mirrors proof-published-surface clause (b) —
// kept derivation-identical so the two clauses can never disagree on "taught").
// ─────────────────────────────────────────────────────────────────────────────
const stripComments = (src) =>
    src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\n)[ \t]*\/\/[^\n]*/g, "$1");

function parseLightExports() {
    const src = stripComments(fs.readFileSync(BARREL, "utf8"));
    const names = [];
    for (const m of src.matchAll(
        /(?:^|\n)\s*export\s*\{([\s\S]*?)\}\s*from\s*["'][^"']+["']/g,
    )) {
        for (const raw of m[1].split(",").map((s) => s.trim())) {
            if (!raw || /^type\s/.test(raw)) continue;
            const parts = raw.split(/\s+as\s+/).map((s) => s.trim());
            names.push(parts[parts.length - 1]);
        }
    }
    for (const m of src.matchAll(
        /(?:^|\n)\s*export\s+(?:default\s+)?(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/g,
    )) {
        names.push(m[1]);
    }
    return [...new Set(names)];
}

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

const lightExports = parseLightExports();
const engineKeys = parseEngineInterfaceKeys();
// Fail-loud derivation floors — an empty parse may not green the gate.
for (const core of ["NumericAnimation", "SpringProgress", "RAFPlayback", "Sequence", "loadAnimationEngine"]) {
    if (!lightExports.includes(core)) {
        failures.push(
            `derivation: barrel parse missing core light export "${core}" — fail-loud, not false-green.`,
        );
    }
}
for (const core of ["KeyframesAnimation", "animate", "MotionPath", "DrawSVG"]) {
    if (!engineKeys.includes(core)) {
        failures.push(
            `derivation: AnimationEngine d.ts parse missing core key "${core}" — fail-loud, not false-green.`,
        );
    }
}
const publicValueExports = new Set(
    [...lightExports, ...engineKeys].map((n) => n.toLowerCase()),
);

// ─────────────────────────────────────────────────────────────────────────────
// README extraction — the two teaching sections, their subsections, and the
// runnable-tagged fences (info string `ts run`).
// ─────────────────────────────────────────────────────────────────────────────
const readme = fs.readFileSync(README, "utf8");
const TEACHING_SECTIONS = new Set(["beyond css", "animation"]);

function extractTeaching() {
    const subsections = [];
    for (const sec of readme.split(/^(?=## )/m)) {
        const secTitle = (sec.match(/^## (.+)$/m)?.[1] ?? "")
            .replace(/`/g, "")
            .trim()
            .toLowerCase();
        if (!TEACHING_SECTIONS.has(secTitle)) continue;
        // Subsections: split the section body on ###/#### headings; the
        // pre-heading intro is not a subsection (no primitive heading).
        const parts = sec.split(/^(?=#{3,4} )/m);
        for (const part of parts.slice(1)) {
            const headingLine = part.match(/^#{3,4} (.+)$/m)?.[1] ?? "";
            const tokens = headingLine
                .replace(/`/g, "")
                .split(/[^\w$]+/)
                .filter(Boolean)
                .map((t) => t.toLowerCase());
            const fences = [];
            for (const f of part.matchAll(/^```([^\n]*)\n([\s\S]*?)^```/gm)) {
                fences.push({ info: f[1].trim(), code: f[2] });
            }
            subsections.push({
                section: secTitle,
                heading: headingLine.trim(),
                tokens,
                fences,
            });
        }
    }
    return subsections;
}

const isRunnable = (info) => /^ts\s+run\b/.test(info);
const subsections = extractTeaching();

// Sanity: the teaching sections exist and parsed.
if (subsections.length === 0) {
    failures.push(
        "extraction: no §Beyond CSS / §Animation subsections parsed from README.md — the teaching surface is gone (fail-loud).",
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// THE MINIMUM-COUNT FLOOR — derived from the taught roster (spec: clause (c)).
// ─────────────────────────────────────────────────────────────────────────────
const taught = subsections.filter((s) =>
    s.tokens.some((t) => publicValueExports.has(t)),
);
const runnableSnippets = [];
for (const sub of subsections) {
    for (const fence of sub.fences) {
        if (isRunnable(fence.info)) {
            runnableSnippets.push({
                id: `${sub.section} › ${sub.heading} #${runnableSnippets.length + 1}`,
                heading: sub.heading,
                code: fence.code,
            });
        }
    }
}

console.log(
    `proof:readme-runs — clause (c): the README snippets EXECUTE against dist/`,
);
console.log(
    `  teaching subsections: ${subsections.length} · taught (heading names a public export): ${taught.length} · runnable-tagged fences: ${runnableSnippets.length}`,
);

// (c.1) Degenerate + roster floor: the runnable set must cover the roster.
if (runnableSnippets.length === 0) {
    failures.push(
        `floor: ZERO runnable-tagged snippets — the floor is the taught roster (${taught.length}); an un-run README is prose, not proof.`,
    );
}
if (runnableSnippets.length < taught.length) {
    failures.push(
        `floor: ${runnableSnippets.length} runnable snippet(s) < ${taught.length} taught subsections — the runnable set must cover the roster.`,
    );
}

// (c.2) Per-subsection: every taught primitive carries ≥1 runnable snippet.
for (const sub of taught) {
    const n = sub.fences.filter((f) => isRunnable(f.info)).length;
    const mark = n > 0 ? "·" : "✗";
    console.log(`  ${mark} ${sub.heading.padEnd(52)} runnable: ${n}`);
    if (n === 0) {
        failures.push(
            `floor: taught subsection "${sub.heading}" has NO runnable snippet — a taught-but-unrunnable API is the lie this clause catches.`,
        );
    }
}

// (c.3) HEAVY front doors: ≥1 runnable snippet exercising each taught door.
const FRONT_DOORS = [
    ["animate"],
    ["MotionPath", "fromMotionPath"],
    ["DrawSVG", "fromDrawSVG"],
];
for (const door of FRONT_DOORS) {
    const isTaught = subsections.some((s) =>
        s.tokens.some((t) => door.some((d) => d.toLowerCase() === t)),
    );
    if (!isTaught) {
        failures.push(
            `floor: HEAVY front door ${door[0]} is not taught by any §Beyond CSS / §Animation subsection heading.`,
        );
        continue;
    }
    const exercised = runnableSnippets.some((s) =>
        door.some((d) => new RegExp(`\\b${d}\\b`).test(s.code)),
    );
    if (!exercised) {
        failures.push(
            `floor: HEAVY front door ${door.join("/")} is taught but exercised by NO runnable snippet.`,
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Snippet → executable module. `// =>` lines become assertions; TS transpiles
// via the project's own typescript; imports of the package specifier rewrite
// to the built dist.
// ─────────────────────────────────────────────────────────────────────────────
const DIST_URL = pathToFileURL(DIST_ENTRY).href;
const PKG_SPECIFIER = /["']@mkbabb\/keyframes\.js["']/g;

function instrumentAsserts(code, id) {
    let expected = 0;
    const lines = code.split("\n").map((line, i) => {
        const m = line.match(/^(\s*)(.+?);\s*\/\/\s*=>\s*(.+?)\s*$/);
        if (!m || m[2].trimStart().startsWith("//")) return line;
        expected++;
        const label = JSON.stringify(`${id} line ${i + 1}`);
        return `${m[1]}__assert((${m[2]}), (${m[3]}), ${label});`;
    });
    return { code: lines.join("\n"), expected };
}

function buildModule(snippet) {
    const { code: asserted, expected } = instrumentAsserts(
        snippet.code,
        snippet.id,
    );
    const transpiled = ts.transpileModule(asserted, {
        compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
        },
    }).outputText;

    // Hoist the snippet's own import lines (single-line by convention) and
    // rewrite the package specifier to the built dist.
    const importLines = [];
    const bodyLines = [];
    for (const line of transpiled.split("\n")) {
        (/^\s*import\b/.test(line) ? importLines : bodyLines).push(
            line.replace(PKG_SPECIFIER, JSON.stringify(DIST_URL)),
        );
    }
    // Names the snippet imports itself must not be re-declared by the prelude.
    const snippetImported = new Set();
    for (const line of importLines) {
        const m = line.match(/import\s*\{([^}]*)\}/);
        if (m) {
            for (const raw of m[1].split(",")) {
                const name = raw.split(/\s+as\s+/).pop()?.trim();
                if (name) snippetImported.add(name);
            }
        }
    }
    const preludeNames = lightExports.filter((n) => !snippetImported.has(n));

    return `// generated by proof-readme-runs — ${snippet.id}
import { JSDOM } from "jsdom";
${importLines.join("\n")}

// ── the minimal jsdom/globalThis shim ────────────────────────────────────
const __dom = new JSDOM(
    \`<!doctype html><html><body>
        <h1 id="h" aria-label="Spring forward"><span aria-hidden="true">Spring</span> <span aria-hidden="true">forward</span></h1>
    </body></html>\`,
    { pretendToBeVisual: true, url: "https://keyframes.babb.dev/" },
);
const __w = __dom.window;
globalThis.window = __w;
for (const k of ["document", "HTMLElement", "SVGElement", "Element", "Node", "Event", "CustomEvent", "DOMRect"]) {
    if (__w[k] !== undefined) globalThis[k] = __w[k];
}
globalThis.getComputedStyle = __w.getComputedStyle.bind(__w);
globalThis.requestAnimationFrame = __w.requestAnimationFrame.bind(__w);
globalThis.cancelAnimationFrame = __w.cancelAnimationFrame.bind(__w);
// jsdom 29 ships no matchMedia — stub the reduced-motion probe (matches: false).
const __mql = (q) => ({ matches: false, media: q, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
    dispatchEvent: () => false });
__w.matchMedia = __mql;
globalThis.matchMedia = __mql;

// ── the package surface (the REAL light barrel — nothing else provided) ──
const __kf = await import(${JSON.stringify(DIST_URL)});
const { ${preludeNames.join(", ")} } = __kf;

// ── consumer-owned fixtures ──────────────────────────────────────────────
const __el = (tag = "div") => {
    const e = document.createElement(tag);
    document.body.appendChild(e);
    return e;
};
const element = __el(), box = __el(), card = __el();
const a = __el(), b = __el();
const sourceEl = __el(), targetEl = __el();
const heading = document.getElementById("h");
const pathEl = (() => {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.getTotalLength = () => 200; // jsdom has no SVG geometry — fixture-owned stub
    document.body.appendChild(p);
    return p;
})();
const ctx = { clearRect() {}, beginPath() {}, arc() {}, stroke() {} };
const w = 300, h = 150;
const drawDial = () => {};

// ── the \`// =>\` assertion oracle ──────────────────────────────────────
let __assertsRun = 0;
const __numEq = (x, y) => Math.abs(x - y) <= 1e-6 + 1e-6 * Math.abs(y);
const __deepEq = (x, y) => {
    if (typeof y === "number" && typeof x === "number") return __numEq(x, y);
    if (Array.isArray(y)) {
        return Array.isArray(x) && x.length === y.length && y.every((v, i) => __deepEq(x[i], v));
    }
    if (y !== null && typeof y === "object") {
        if (x === null || typeof x !== "object") return false;
        const xk = Object.keys(x).sort();
        const yk = Object.keys(y).sort();
        return xk.length === yk.length && yk.every((k, i) => xk[i] === k && __deepEq(x[k], y[k]));
    }
    return Object.is(x, y);
};
const __assert = (actual, expected, label) => {
    if (!__deepEq(actual, expected)) {
        console.error(
            \`ASSERT FAIL [\${label}]: stated // => \${JSON.stringify(expected)} but the dist computed \${JSON.stringify(actual)}\`,
        );
        process.exit(2);
    }
    __assertsRun++;
};

// ── the snippet, verbatim ────────────────────────────────────────────────
${bodyLines.join("\n")}

console.log("__ASSERTS_RUN", __assertsRun);
// Settle window: let fire-and-forget springs/timers run (and any rejection
// surface as a nonzero exit), then release jsdom's live handles.
setTimeout(() => process.exit(0), 2000);
`.replace(/\n{3,}/g, "\n\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Execute — one child process per snippet, bounded concurrency.
// ─────────────────────────────────────────────────────────────────────────────
async function runSnippet(snippet, index) {
    const { code: instrumented } = instrumentAsserts(snippet.code, snippet.id);
    const expected = (instrumented.match(/__assert\(/g) ?? []).length;
    const file = path.join(TMP, `snippet-${index}.mjs`);
    fs.writeFileSync(file, buildModule(snippet));
    try {
        const { stdout } = await execFileAsync(process.execPath, [file], {
            cwd: REPO,
            timeout: SNIPPET_TIMEOUT_MS,
            encoding: "utf8",
        });
        const ran = Number(stdout.match(/__ASSERTS_RUN (\d+)/)?.[1] ?? NaN);
        if (ran !== expected) {
            return `snippet [${snippet.id}]: ${expected} \`// =>\` assertion(s) stated but ${Number.isNaN(ran) ? "none reported" : ran} executed — an assertion that does not run proves nothing.`;
        }
        console.log(
            `  ✓ ${snippet.id} (asserts: ${ran}/${expected})`,
        );
        return null;
    } catch (err) {
        const detail = [err.stderr, err.stdout]
            .filter(Boolean)
            .join("\n")
            .split("\n")
            .filter((l) => l.trim())
            .slice(0, 6)
            .join("\n      ");
        return `snippet [${snippet.id}] FAILED to execute against dist (${err.killed ? `timeout ${SNIPPET_TIMEOUT_MS}ms` : `exit ${err.code}`}):\n      ${detail}`;
    }
}

async function main() {
    fs.rmSync(TMP, { recursive: true, force: true });
    fs.mkdirSync(TMP, { recursive: true });

    console.log(`\n  executing ${runnableSnippets.length} runnable snippet(s) against ${path.relative(REPO, DIST_ENTRY)} …`);
    const results = [];
    let cursor = 0;
    await Promise.all(
        Array.from({ length: Math.min(CONCURRENCY, runnableSnippets.length) }, async () => {
            while (cursor < runnableSnippets.length) {
                const i = cursor++;
                results[i] = await runSnippet(runnableSnippets[i], i);
            }
        }),
    );
    for (const r of results) if (r) failures.push(r);

    // The wave-level honesty floor: at least one `// =>` ran somewhere — a
    // README whose examples assert nothing has no computed-result oracle.
    const totalAsserts = runnableSnippets.reduce(
        (n, s) => n + (instrumentAsserts(s.code, s.id).expected ?? 0),
        0,
    );
    if (totalAsserts === 0) {
        failures.push(
            "floor: ZERO `// =>` assertions across all runnable snippets — the computed-result oracle is empty.",
        );
    }

    fs.rmSync(TMP, { recursive: true, force: true });

    if (failures.length > 0) {
        console.error(
            `\nproof:readme-runs — FAIL (${failures.length} finding(s); the docs oracle is not runnable truth):`,
        );
        for (const f of failures) console.error("  ✗ " + f);
        process.exit(1);
    }
    console.log(
        `\nproof:readme-runs — PASS: ${runnableSnippets.length} snippet(s) executed against the built dist, ` +
            `${totalAsserts} stated result(s) verified, the runnable set covers the taught roster (${taught.length}).`,
    );
}

main().catch((err) => {
    console.error("proof:readme-runs — ERROR:", err);
    process.exit(3);
});
