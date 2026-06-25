#!/usr/bin/env node
/**
 * proof:published-surface — the PUBLISH boundary oracle (J.W5 §Hard gate).
 *
 * The boundary-ORACLE precept carried to the DISTRIBUTION boundary: I proved
 * "green means a human USING it sees it work"; this gate proves "the thing a
 * human INSTALLS is the thing the source declares and the README teaches"
 * (`scope-adversary.md §0`, `J.md §invariant set`). It actuates the SHIPPED
 * artifact — the packed tarball + the built `dist/` a consumer imports — not
 * a source-shape proxy.
 *
 * THREE clauses, all CORRECTNESS-tier (J.W5 S1a / S1b / S1c):
 *
 *   clause (a) — tarball == `files` declaration. `npm pack --dry-run --json`
 *     must emit EXACTLY the library `dist/` build output (`package.json
 *     "files": ["dist"]`) plus npm's forced metadata (package.json / README /
 *     LICENSE). NO `_redirects`, NO `public/`-origin asset, NO demo-build
 *     leakage (`dist/gh-pages/`, `dist/demo-app/`); `dist/keyframes.d.ts`
 *     present + non-stub (guards the 12-byte `export {}` roll-up failure —
 *     see vite.config.ts's dts notes). Born-RED on the pre-J.W5 tree: the
 *     untracked CF-Pages relic `public/_redirects` rode every lib build into
 *     `dist/` (Vite lib mode copies the default `publicDir` into `outDir`)
 *     and so into every `npm pack` (BP-1, `build-packaging-release.md §1`).
 *
 *   clause (b) — every public VALUE export of `src/animation/index.ts` (the
 *     LIGHT static re-exports + `loadAnimationEngine` + the HEAVY
 *     `AnimationEngine` keys) is reachable to a `npm i` user through EITHER:
 *       (i)  a dedicated README heading naming it (normalized token match,
 *            any `##`/`###`/`####` in README.md), OR
 *       (ii) an identifier reference inside a code fence or inline-code span
 *            WITHIN the §Beyond CSS / §Animation sections (the teaching
 *            sections — a stray mention in §Project Structure prose does NOT
 *            count as teaching), OR
 *       (iii) a row in the documented-surface manifest
 *            `docs/published-surface.md` — the authoritative roster: a
 *            markdown table whose first cell is the backticked export name,
 *            second its tier (LIGHT/HEAVY), third either its README anchor
 *            or a one-line "manifest-only: <reason>" note.
 *     An export in NEITHER set REDs. A manifest row naming a NON-existent
 *     export also REDs (the manifest cannot go stale against the source).
 *     Type-only exports are excluded by construction (`import type`/`export
 *     type` are erased at build — no runtime surface).
 *     Born-RED on the pre-J.W5 tree: the E→I orchestration tier
 *     (`SpringProgress`, `springLinearStops`, `springTimingFunction`,
 *     `RAFPlayback`, `stagger`, `flip`/`flipShared`, `drag`/`Draggable`,
 *     `decay`/`decayRest`, `Sequence`, + the HEAVY `animate`/`MotionPath`/
 *     `DrawSVG` front doors) is taught NOWHERE and no manifest exists
 *     (`scope-adversary.md §1` row 5, SCOPE-5). Greens when J.W5 S2 teaches
 *     the roster and/or the manifest enumerates the documented tail.
 *
 *   clause (d) — the AnimationEngine interface ≡ the runtime surface
 *     (ENG-6). The hand-maintained `AnimationEngine` interface (spelled
 *     explicitly because API Extractor cannot resolve `typeof import()`) has
 *     no compiler check tying it to what `loadAnimationEngine()` actually
 *     returns: a new `export const` in `engine.ts` is returned at RUNTIME by
 *     the `Object.assign` but silently absent from the TYPE. This clause
 *     imports the BUILT `dist/keyframes.js` under Node, awaits
 *     `loadAnimationEngine()`, and diffs `Object.keys(engine)` against the
 *     interface keys extracted from the d.ts roll-up. Any asymmetry REDs.
 *
 * TWO further clauses live here (landed with their owning scopes):
 *
 *   clause (e) — the doc-rot structural-claim tripwire (S3, HYGIENE
 *     corroborator — may NOT substitute for a red runtime clause): the
 *     headline structural claims of root CLAUDE.md resolve against the tree
 *     (no phantom `src/parsing/`/`src/units/` subtree, no phantom demo dirs,
 *     every file the §Project Tree names exists, the frozen test/bench
 *     file counts match `ls … | wc -l`).
 *
 *   clause (f) — peer-dep honesty (S7/ED-5 · CORRECTNESS): every
 *     `peerDependencies` entry is a REAL runtime peer of the shipped dist —
 *     a bare specifier the built `dist/*.js` graph actually imports
 *     (statically or dynamically), not merely the demo or the dev `*.vue`
 *     shim. Born-RED on the pre-J.W5 tree: `vue ^3.5.0` was declared while
 *     the dist imports zero Vue — every `npm i` consumer's resolver was
 *     forced to reckon with a framework the library never touches
 *     (`ecosystem-distribution.md` ED-5). Greens on S7's deletion of the
 *     block (the honest declaration is its ABSENCE — no `optionalPeer`/
 *     `peerDependenciesMeta` paper).
 *
 * The remaining sibling clause of the J.W5 §Hard gate:
 *   clause (c) — README snippets EXECUTE against the built dist + the
 *     minimum-count floor (S2, the executable-docs oracle) — lives in
 *     `scripts/proof-readme-runs.mjs` (`npm run proof:readme-runs`), a
 *     sibling wired into the correctness tier; the wave is GREEN only when
 *     BOTH scripts pass.
 *
 * PRECONDITION: the library is built (`npm run build:lib`) — the gate
 * measures the built artifact, same sequencing as CI/release (build → gate).
 * `npm pack` runs `--ignore-scripts` so the oracle reads the dist AS BUILT
 * rather than triggering a recursive `prepare` rebuild mid-measurement.
 *
 * RUN: npm run proof:published-surface
 * CI wiring: owned by J.W3's `proof:ci-coverage` roster motion (recorded
 * there so this correctness gate cannot escape `proof:all`/CI).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist");
const BARREL = path.join(REPO, "src/animation/index.ts");
const README = path.join(REPO, "README.md");
const MANIFEST = path.join(REPO, "docs/published-surface.md");
const DTS = path.join(DIST, "keyframes.d.ts");

const failures = [];

// ─────────────────────────────────────────────────────────────────────────────
// Precondition — the built artifact exists. The gate measures dist AS BUILT;
// an unbuilt tree is an environment error (exit 3), not a surface verdict.
// ─────────────────────────────────────────────────────────────────────────────
if (!fs.existsSync(path.join(DIST, "keyframes.js"))) {
    console.error(
        "proof:published-surface — ERROR: dist/keyframes.js missing. " +
            "Run `npm run build:lib` first (the gate measures the built artifact).",
    );
    process.exit(3);
}

// ═════════════════════════════════════════════════════════════════════════════
// clause (a) — tarball == `files` declaration (S1a · BP-1)
// ═════════════════════════════════════════════════════════════════════════════

/** npm's forced-include metadata — always packed regardless of `files`. */
const isForcedMetadata = (p) =>
    p === "package.json" || /^README(\.[^/]*)?$/i.test(p) || /^LICEN[CS]E(\.[^/]*)?$/i.test(p);

/**
 * The LIBRARY build's legitimate dist shape: the `.` entry + its d.ts roll-up,
 * the `./engine` subpath entry (`dist/engine/index.{js,d.ts}` — R.W4 §2.1, the
 * statically-importable HEAVY "in"; a STABLE-PATH named entry, not a hash chunk),
 * and the hash-named lazy chunks of the `loadAnimationEngine()` dynamic boundary
 * (`engine-*`, `animate-*`, `motion-path-*`, `draw-svg-*`, `animations-*`,
 * `springTimingFunction-*`, `timeline-*`, …) — legitimate splits, NOT leakage
 * (`build-packaging-release.md §1`). Anything else under dist/ (`_redirects`,
 * demo build trees, source maps, stray assets) is a publish leak.
 */
const isLibraryArtifact = (p) =>
    /^dist\/(?:keyframes\.js|keyframes\.d\.ts|engine\/index\.(?:js|d\.ts)|[A-Za-z0-9_.]+-[A-Za-z0-9_-]+\.js)$/.test(p);

/** Junk basenames npm itself always excludes — ignore on the fs side too. */
const isPacklistJunk = (name) =>
    [".DS_Store", ".gitignore", ".npmrc", "npm-debug.log"].includes(name);

function clauseA() {
    console.log("\nclause (a) — tarball == `files` declaration (S1a · BP-1)");

    const raw = execFileSync(
        "npm",
        ["pack", "--dry-run", "--json", "--ignore-scripts"],
        { cwd: REPO, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    const packed = JSON.parse(raw)[0].files.map((f) => ({
        path: f.path.replaceAll("\\", "/"),
        size: f.size,
    }));
    const packedPaths = new Set(packed.map((f) => f.path));

    // The on-disk dist/ file set (what
    // `files: ["dist", "!dist/gh-pages", "!dist/_*"]` declares). The DEMO build
    // outputs (dist/gh-pages — the J.W5 `!` negation — and the retired
    // dist/demo-app shape) AND the transient `_`-prefixed proof-harness builds
    // (dist/_proof-typing-dots — the isolated TypingDots Vite harness the
    // proof:typing-dots gate emits beside the library dist; gitignored via the
    // `_*` rule, the `!dist/_*` negation un-packs it) are deliberately UN-packed,
    // so the must-pack walk applies the SAME negation: on a built tree those
    // files are expected ABSENT from the tarball. The a.2 leak clause below
    // stays the other half: if one ever DOES pack, it reds there. (J.W4 fix:
    // the pre-fix walk carried no negation, so a demo-built tree false-redded
    // 50+ "did NOT pack" findings; J.WZ extends it to the `_*` harness dirs.)
    const UNPACKED_DEMO_DIR = /^dist\/(?:gh-pages|demo-app|_[^/]*)\//;
    const distFiles = fs
        .readdirSync(DIST, { recursive: true, withFileTypes: true })
        .filter((d) => d.isFile() && !isPacklistJunk(d.name))
        .map((d) =>
            path
                .join("dist", path.relative(DIST, path.join(d.parentPath, d.name)))
                .replaceAll("\\", "/"),
        )
        .filter((p) => !UNPACKED_DEMO_DIR.test(p));

    const distInTarball = packed.filter((f) => f.path.startsWith("dist/"));
    console.log(
        `  packed files: ${packed.length} (dist: ${distInTarball.length}, metadata: ${packed.length - distInTarball.length})`,
    );

    // (a.1) Two-way set equality: tarball dist/* ≡ on-disk dist/*.
    for (const p of distFiles) {
        if (!packedPaths.has(p)) {
            failures.push(
                `(a) on-disk ${p} did NOT pack — the tarball is not the declared dist/ (an ignore rule is eating a build artifact).`,
            );
        }
    }
    for (const f of distInTarball) {
        if (!distFiles.includes(f.path)) {
            failures.push(
                `(a) packed ${f.path} does not exist on disk — the pack measured a phantom.`,
            );
        }
    }

    // (a.2) Every packed file is a library artifact or forced metadata —
    // `_redirects` / any public/-origin or demo-build leak REDs here.
    for (const f of packed) {
        if (f.path.startsWith("dist/")) {
            if (/^dist\/(?:gh-pages|demo-app)\//.test(f.path)) {
                failures.push(
                    `(a) DEMO BUILD LEAK: ${f.path} — a demo build output is riding the library tarball.`,
                );
            } else if (!isLibraryArtifact(f.path)) {
                const note = /(^|\/)_redirects$/.test(f.path)
                    ? " (BP-1: the CF-Pages routing relic — Vite lib mode copied `publicDir` into `outDir`; fix is `publicDir: false` in the production block)"
                    : "";
                failures.push(
                    `(a) NON-LIBRARY ASSET in tarball: ${f.path} (${f.size} B)${note}`,
                );
            }
        } else if (!isForcedMetadata(f.path)) {
            failures.push(
                `(a) unexpected non-dist file in tarball: ${f.path} — \`files\` declares only ["dist"].`,
            );
        }
    }

    // (a.3) public/-origin complement: nothing that exists under public/
    // (the CF-Pages staging dir, gitignored via `_*`) may appear under dist/.
    const PUBLIC = path.join(REPO, "public");
    if (fs.existsSync(PUBLIC)) {
        for (const name of fs.readdirSync(PUBLIC)) {
            if (packedPaths.has(`dist/${name}`)) {
                failures.push(
                    `(a) public/-origin asset in tarball: dist/${name} (source: public/${name}).`,
                );
            }
        }
    }

    // (a.4) The d.ts roll-up is present, packed, and not the 12-byte
    // `export {}` stub (the silent API-Extractor failure mode).
    if (!packedPaths.has("dist/keyframes.d.ts")) {
        failures.push("(a) dist/keyframes.d.ts is NOT in the tarball — the types do not ship.");
    } else {
        const dtsSize = fs.statSync(DTS).size;
        const dtsSrc = fs.readFileSync(DTS, "utf8");
        console.log(`  dist/keyframes.d.ts: ${dtsSize} B`);
        if (dtsSize < 200 || !dtsSrc.includes("AnimationEngine")) {
            failures.push(
                `(a) dist/keyframes.d.ts is a stub (${dtsSize} B / AnimationEngine ${dtsSrc.includes("AnimationEngine") ? "present" : "ABSENT"}) — the roll-up collapsed (see vite.config.ts dts notes).`,
            );
        }
    }
    if (!packedPaths.has("dist/keyframes.js")) {
        failures.push("(a) dist/keyframes.js is NOT in the tarball — the entry does not ship.");
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// clause (b) — every public export ∈ (README-taught ∪ manifest) (S1b)
// ═════════════════════════════════════════════════════════════════════════════

const stripComments = (src) =>
    src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\n)[ \t]*\/\/[^\n]*/g, "$1");

/**
 * The LIGHT public surface: the barrel's `export { … } from` runtime names
 * (the EXPORTED name — RHS of `as`), plus direct runtime declarations
 * (`export const loadAnimationEngine`). `export type` carries no runtime
 * surface and is skipped.
 */
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

/**
 * The HEAVY public surface: the `AnimationEngine` interface keys, extracted
 * from the d.ts ROLL-UP (the shipped type surface — members are normalized
 * one-per-line there; the source interface is what generated it). A broken
 * parse fails the sanity floor below — it cannot silently pass.
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

/** Normalized heading tokens for every ##/###/#### heading in the README. */
function readmeHeadingTokens(readme) {
    const tokens = new Set();
    for (const m of readme.matchAll(/^#{2,4}\s+(.+)$/gm)) {
        for (const t of m[1].replace(/`/g, "").split(/[^\w$]+/)) {
            if (t) tokens.add(t.toLowerCase());
        }
    }
    return tokens;
}

/**
 * The TEACHING sections' code surface: code fences + inline-code spans inside
 * the §Beyond CSS and §Animation `##` sections only. A mention elsewhere
 * (§Project Structure tree art, §Baseline prose) is not teaching.
 */
function teachingSectionCode(readme) {
    const chunks = [];
    const sections = readme.split(/^(?=## )/m);
    for (const sec of sections) {
        const title = (sec.match(/^## (.+)$/m)?.[1] ?? "")
            .replace(/`/g, "")
            .trim()
            .toLowerCase();
        if (title !== "beyond css" && title !== "animation") continue;
        for (const m of sec.matchAll(/```[\s\S]*?```/g)) chunks.push(m[0]);
        for (const m of sec.matchAll(/`[^`\n]+`/g)) chunks.push(m[0]);
    }
    return chunks.join("\n");
}

/**
 * The documented-surface manifest (docs/published-surface.md): a markdown
 * table; each row's FIRST cell is the backticked export name. Returns the
 * named set (empty when the manifest does not exist yet).
 */
function parseManifest() {
    if (!fs.existsSync(MANIFEST)) return [];
    const names = [];
    for (const line of fs.readFileSync(MANIFEST, "utf8").split("\n")) {
        const m = line.match(/^\|\s*`([A-Za-z_$][\w$]*)`\s*\|/);
        if (m) names.push(m[1]);
    }
    return [...new Set(names)];
}

function clauseB(lightExports, engineKeys) {
    console.log("\nclause (b) — every public export taught or manifested (S1b)");

    // Sanity floors — a silently-empty parse must FAIL the gate, not pass it.
    for (const core of ["NumericAnimation", "SpringProgress", "Timeline", "RAFPlayback", "Sequence", "loadAnimationEngine"]) {
        if (!lightExports.includes(core)) {
            failures.push(
                `(b) barrel parse missing core light export "${core}" — the export derivation is broken (fail-loud, not false-green).`,
            );
        }
    }
    for (const core of ["KeyframesAnimation", "CSSKeyframesAnimation", "AnimationGroup", "presets"]) {
        if (!engineKeys.includes(core)) {
            failures.push(
                `(b) AnimationEngine d.ts parse missing core key "${core}" — the interface-key derivation is broken (fail-loud, not false-green).`,
            );
        }
    }

    const tier = new Map();
    for (const n of lightExports) tier.set(n, "LIGHT");
    for (const n of engineKeys) if (!tier.has(n)) tier.set(n, "HEAVY");
    const publicSet = [...tier.keys()];

    const readme = fs.readFileSync(README, "utf8");
    const headings = readmeHeadingTokens(readme);
    const teachingCode = teachingSectionCode(readme);
    const manifest = parseManifest();
    const manifestSet = new Set(manifest);

    // The manifest may not name a phantom — a stale roster REDs.
    for (const name of manifest) {
        if (!tier.has(name)) {
            failures.push(
                `(b) manifest row \`${name}\` (docs/published-surface.md) names a NON-existent public export — the roster went stale against the source.`,
            );
        }
    }

    console.log(
        `  public value exports: ${publicSet.length} (LIGHT ${lightExports.length} + HEAVY ${engineKeys.filter((k) => !lightExports.includes(k)).length}) · manifest rows: ${manifest.length}${fs.existsSync(MANIFEST) ? "" : " (no docs/published-surface.md yet)"}`,
    );

    const untaught = [];
    for (const name of publicSet.sort()) {
        const byHeading = headings.has(name.toLowerCase());
        const bySnippet = new RegExp(`\\b${name}\\b`).test(teachingCode);
        const byManifest = manifestSet.has(name);
        const how = byHeading
            ? "heading"
            : bySnippet
              ? "snippet"
              : byManifest
                ? "manifest"
                : "NEITHER";
        console.log(
            `  ${(how === "NEITHER" ? "✗" : "·")} ${name.padEnd(24)} ${tier.get(name).padEnd(5)} ${how}`,
        );
        if (how === "NEITHER") untaught.push(name);
    }
    if (untaught.length > 0) {
        failures.push(
            `(b) ${untaught.length} public export(s) are NEITHER README-taught NOR manifested — an API a \`npm i\` user reaches that the docs cannot teach:\n      ` +
                untaught.map((n) => `\`${n}\` (${tier.get(n)})`).join(", "),
        );
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// clause (d) — AnimationEngine interface ≡ runtime surface (S1c · ENG-6)
// ═════════════════════════════════════════════════════════════════════════════

async function clauseD(engineKeys) {
    console.log("\nclause (d) — AnimationEngine interface ≡ runtime surface (S1c · ENG-6)");
    const mod = await import(pathToFileURL(path.join(DIST, "keyframes.js")).href);
    if (typeof mod.loadAnimationEngine !== "function") {
        failures.push("(d) the built dist exports no `loadAnimationEngine` — the dynamic boundary is gone.");
        return;
    }
    const engine = await mod.loadAnimationEngine();
    const runtimeKeys = Object.keys(engine);
    const iface = new Set(engineKeys);
    const runtime = new Set(runtimeKeys);
    console.log(`  interface keys: ${iface.size} · runtime keys: ${runtime.size}`);
    const missingFromInterface = runtimeKeys.filter((k) => !iface.has(k));
    const missingFromRuntime = engineKeys.filter((k) => !runtime.has(k));
    if (missingFromInterface.length > 0) {
        failures.push(
            `(d) returned at RUNTIME by loadAnimationEngine() but ABSENT from the AnimationEngine interface (the silent-type-drift ENG-6 names): ${missingFromInterface.map((k) => `\`${k}\``).join(", ")}`,
        );
    }
    if (missingFromRuntime.length > 0) {
        failures.push(
            `(d) declared on the AnimationEngine interface but NOT returned at runtime (a phantom the types promise): ${missingFromRuntime.map((k) => `\`${k}\``).join(", ")}`,
        );
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// clause (e) — the doc-rot structural-claim tripwire (S3 · HYGIENE corroborator)
// ═════════════════════════════════════════════════════════════════════════════

function clauseE() {
    console.log("\nclause (e) — root CLAUDE.md structural claims vs the tree (S3 · HYGIENE)");
    const doc = fs.readFileSync(path.join(REPO, "CLAUDE.md"), "utf8");

    // (e.1) The phantom subtree may not be re-asserted (LS-1) — neither in the
    // doc nor on disk.
    for (const phantom of ["src/parsing", "src/units", "src/easing.ts", "src/math.ts"]) {
        if (doc.includes(phantom)) {
            failures.push(
                `(e) root CLAUDE.md re-asserts the phantom path \`${phantom}\` — the doc-rot the S3 rewrite killed is back.`,
            );
        }
        if (fs.existsSync(path.join(REPO, phantom))) {
            failures.push(
                `(e) \`${phantom}\` EXISTS on disk — the tree grew a subtree the rewritten doc says is gone; rewrite the doc to the tree.`,
            );
        }
    }

    // (e.2) The phantom demo dirs stay dead (LS-3); every doc-named demo dir exists.
    for (const phantom of ["simple", "balls", "boxes", "bench"]) {
        if (fs.existsSync(path.join(REPO, "demo", phantom))) {
            failures.push(`(e) phantom demo dir \`demo/${phantom}/\` reappeared on disk.`);
        }
        if (new RegExp(`(?:demo/|├── |│ {3}|└── )${phantom}/`).test(doc)) {
            failures.push(
                `(e) root CLAUDE.md names the phantom demo dir \`${phantom}/\` (LS-3 re-rot).`,
            );
        }
    }
    for (const real of ["@", "app", "amiga", "cube", "easing", "motion-path", "playground", "sequence", "spring", "square"]) {
        if (!fs.existsSync(path.join(REPO, "demo", real))) {
            failures.push(
                `(e) demo dir \`demo/${real}/\` named by root CLAUDE.md does not exist.`,
            );
        }
    }

    // (e.3) Every src/animation file the §Project Tree names exists (LS-5 shape).
    const treeFence = doc.match(/## Project Tree\s*```([\s\S]*?)```/)?.[1] ?? "";
    // Lookbehind excludes glob artifacts (`test/*.test.ts` must not read as a
    // claim that a file literally named `test.ts` exists under src/).
    const namedFiles = [...treeFence.matchAll(/(?<![\w.*-])([\w][\w-]*(?:\.d)?\.ts)\b/g)].map(
        (m) => m[1],
    );
    let checked = 0;
    for (const f of new Set(namedFiles)) {
        const candidates = [
            path.join(REPO, "src/animation", f),
            path.join(REPO, "src", f),
        ];
        if (!candidates.some((p) => fs.existsSync(p))) {
            failures.push(
                `(e) root CLAUDE.md §Project Tree names \`${f}\` — not found under src/ (a phantom file claim).`,
            );
        }
        checked++;
    }

    // (e.4) Frozen integers match `ls … | wc -l` (TB-4): the parenthetical
    // "(<N> files / <M> tests at the J.W5 rewrite" + "(<K> at the J.W5 rewrite".
    const testFiles = fs.readdirSync(path.join(REPO, "test")).filter((f) => f.endsWith(".test.ts")).length;
    const benchFiles = fs.readdirSync(path.join(REPO, "bench")).filter((f) => f.endsWith(".bench.ts")).length;
    const testClaim = doc.match(/\((\d+)\s+files\s*\/\s*\d+\s+tests/);
    if (testClaim && Number(testClaim[1]) !== testFiles) {
        failures.push(
            `(e) root CLAUDE.md freezes the test-file count at ${testClaim[1]} but \`ls test/*.test.ts | wc -l\` → ${testFiles} — the count re-rotted; re-derive it.`,
        );
    }
    const benchClaim = doc.match(/\((\d+)\s+at the J\.W5 rewrite\)/);
    if (benchClaim && Number(benchClaim[1]) !== benchFiles) {
        failures.push(
            `(e) root CLAUDE.md freezes the bench count at ${benchClaim[1]} but \`ls bench/*.bench.ts | wc -l\` → ${benchFiles} — the count re-rotted; re-derive it.`,
        );
    }
    console.log(
        `  tree-named src files checked: ${checked} · test files: ${testFiles} · bench files: ${benchFiles}`,
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// clause (f) — peer-dep honesty: declared peers ⊆ dist import graph (S7 · ED-5)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Bare (non-relative) specifiers the BUILT dist actually imports — static
 * `from "x"` / `import "x"` and dynamic `import("x")` across every emitted
 * chunk. Scoped packages keep their two segments; deep imports collapse to
 * the package name (`pkg/sub` → `pkg`).
 */
function distImportGraph() {
    const specifiers = new Set();
    for (const file of fs.readdirSync(DIST)) {
        if (!file.endsWith(".js")) continue;
        const src = fs.readFileSync(path.join(DIST, file), "utf8");
        for (const m of src.matchAll(
            /(?:from\s*|import\s*\(\s*|import\s+)["']([^"'\n]+)["']/g,
        )) {
            const spec = m[1];
            if (spec.startsWith(".") || spec.startsWith("/")) continue;
            const parts = spec.split("/");
            specifiers.add(spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]);
        }
    }
    return specifiers;
}

function clauseF() {
    console.log("\nclause (f) — peer-dep honesty: declared peers ⊆ dist imports (S7 · ED-5)");
    const pkg = JSON.parse(fs.readFileSync(path.join(REPO, "package.json"), "utf8"));
    const declared = Object.keys(pkg.peerDependencies ?? {});
    const imported = distImportGraph();

    // Sanity floor — the built dist MUST import value.js (the HEAVY chunks'
    // externalized dependency); an empty graph means the parse broke, and a
    // broken parse must fail loud, not vacuously green an empty peer set.
    if (!imported.has("@mkbabb/value.js")) {
        failures.push(
            "(f) dist import-graph parse found no `@mkbabb/value.js` edge — the specifier derivation is broken (fail-loud, not false-green).",
        );
    }

    console.log(
        `  declared peers: ${declared.length === 0 ? "(none)" : declared.join(", ")} · dist imports: ${[...imported].sort().join(", ")}`,
    );
    for (const peer of declared) {
        if (!imported.has(peer)) {
            failures.push(
                `(f) declared peerDependency \`${peer}\` is NOT imported by the shipped dist — a framework every \`npm i\` consumer's resolver must reckon with that the runtime never touches (ED-5: the dependency-graph analogue of a README teaching an API the dist cannot run). The honest declaration is its absence.`,
            );
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// clause (g) — the EP-3 uncovered-export DISPOSITION (J.W4 S7)
//
// `engine-periphery.md` EP-3: flip/flipShared, drag/Draggable, DrawSVG/
// fromDrawSVG ship load-bearing + tested with NO demo scene — zero live-session
// runtime coverage. The J.W4 binding decision: PATH B — each is a recorded BOOK
// in this manifest (docs/published-surface.md §EP-3) with its no-live-scene
// status DISCLOSED and its unit coverage CITED (P-invariant-28: the terminal
// disposition, not a punt). This clause machine-checks the BOOK both ways:
//   (i)  every EP-3 export has a disposition row in the §EP-3 table;
//   (ii) every row's cited `test/*.test.ts` file EXISTS on disk (a citation of
//        deleted coverage is a stale BOOK — reds);
//   (iii) a PATH B row's disposition cell carries the explicit
//        "no live-session scene" disclosure (the honesty marker).
// If a future wave gives an export a demo scene (PATH A), its row flips to
// `PATH A` naming the scene — and the scene auto-joins the live-session sweep
// via the scenes.ts roster (demo-driver's stale-key guard).
// ─────────────────────────────────────────────────────────────────────────────

const EP3_EXPORTS = ["flip", "flipShared", "drag", "Draggable", "DrawSVG", "fromDrawSVG"];

function clauseG() {
    console.log("\nclause (g) — the EP-3 uncovered-export disposition (J.W4 S7)");
    if (!fs.existsSync(MANIFEST)) {
        failures.push("(g) docs/published-surface.md is MISSING — the EP-3 disposition BOOK has no home.");
        return;
    }
    const text = fs.readFileSync(MANIFEST, "utf8");
    const sectionIdx = text.search(/^##\s+EP-3\b/m);
    if (sectionIdx < 0) {
        failures.push(
            "(g) the §EP-3 live-coverage disposition section is MISSING from docs/published-surface.md — " +
                "the uncovered exports (flip/drag/draw-svg) ride undispositioned (EP-3).",
        );
        return;
    }
    const section = text.slice(sectionIdx);
    const rows = new Map();
    for (const line of section.split("\n")) {
        const m = line.match(/^\|\s*`([A-Za-z_$][\w$]*)`\s*\|\s*([^|]*)\|\s*([^|]*)\|/);
        if (m) rows.set(m[1], { disposition: m[2].trim(), coverage: m[3].trim() });
    }
    let okCount = 0;
    for (const name of EP3_EXPORTS) {
        const row = rows.get(name);
        if (!row) {
            failures.push(
                `(g) EP-3 export \`${name}\` has NO disposition row in the §EP-3 table — ` +
                    "every uncovered export needs a PATH A scene or a PATH B BOOK (no silent ride).",
            );
            continue;
        }
        const isPathA = /PATH A/i.test(row.disposition);
        const isPathB = /PATH B/i.test(row.disposition);
        if (!isPathA && !isPathB) {
            failures.push(`(g) EP-3 row \`${name}\` names neither PATH A nor PATH B — the disposition is ambiguous.`);
            continue;
        }
        if (isPathB) {
            if (!/no live-session scene/i.test(row.disposition)) {
                failures.push(
                    `(g) EP-3 PATH B row \`${name}\` lacks the explicit "no live-session scene" disclosure — ` +
                        "the BOOK must disclose the uncovered status, not imply coverage.",
                );
            }
            const cited = [...row.coverage.matchAll(/`(test\/[\w.-]+\.test\.ts)`/g)].map((m) => m[1]);
            if (cited.length === 0) {
                failures.push(`(g) EP-3 PATH B row \`${name}\` cites NO \`test/*.test.ts\` unit coverage — an undisclosed-coverage BOOK.`);
                continue;
            }
            const missing = cited.filter((f) => !fs.existsSync(path.join(REPO, f)));
            if (missing.length > 0) {
                failures.push(
                    `(g) EP-3 PATH B row \`${name}\` cites coverage that does not exist on disk: ${missing.join(", ")} — a stale BOOK.`,
                );
                continue;
            }
        }
        okCount += 1;
    }
    if (okCount === EP3_EXPORTS.length) {
        console.log(
            `  ✓ all ${EP3_EXPORTS.length} EP-3 exports dispositioned (${EP3_EXPORTS.join(", ")}) — ` +
                "each a PATH B BOOK with existing cited unit coverage and the no-live-scene disclosure " +
                "(or a PATH A scene). No export rides un-dispositioned.",
        );
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// clause (i) — drag2D is a CERTIFIED supported LIGHT export (Q.WA2 · S3)
//
// drag2D + Drag2DHandle are exported (index.ts:88,93) + gate-tested
// (proof:drag-gesture S4) but were NOT named in the *declared/published-surface*
// contract as SUPPORTED LIGHT exports — a refactor routing drag-2d.ts through a
// HEAVY module, or dropping the export, would leave only proof:boundary (which has
// no notion that drag2D is a *committed* primitive the DemoControlPoint chain
// depends on). This clause NAMES them as committed surface, so a *surface*
// regression (drag2D dropped from the published LIGHT set) REDs here, while a
// *boundary* regression (drag2D routed through value.js) REDs the existing
// proof:boundary backstop. proof:boundary owns the bundle-level value.js-edge
// proof — this clause does not re-implement it; it locks the published-surface
// certification (the half genuinely missing pre-Q.WA2: `grep drag2D
// scripts/proof-published-surface.mjs` → 0). The drag2D value export is asserted
// against the parsed LIGHT barrel surface; Drag2DHandle (a TYPE — erased at build,
// excluded from clause (b)'s runtime publicSet by construction) is asserted
// against the shipped d.ts roll-up so the committed TYPE surface is locked too.
// ═════════════════════════════════════════════════════════════════════════════

function clauseDrag2DCertified(lightExports) {
    console.log("\nclause (i) — drag2D is a CERTIFIED supported LIGHT export (Q.WA2 · S3)");

    // (i.1) drag2D ∈ the parsed LIGHT runtime export set (a committed LIGHT value).
    if (lightExports.includes("drag2D")) {
        console.log(
            "  ✓ `drag2D` is in the LIGHT barrel runtime export set — a COMMITTED LIGHT public primitive (the DemoControlPoint substrate), not an incidental re-export.",
        );
    } else {
        failures.push(
            "(i) `drag2D` is NOT in the LIGHT barrel runtime export set — the committed 2-D drag primitive " +
                "the DemoControlPoint chain (DM-2) builds against was dropped from the published LIGHT surface (Q.WA2 S3).",
        );
    }

    // (i.2) Drag2DHandle ∈ the shipped d.ts type surface (the committed TYPE half).
    const dts = fs.readFileSync(DTS, "utf8");
    if (/\bDrag2DHandle\b/.test(dts)) {
        console.log(
            "  ✓ `Drag2DHandle` is in the shipped d.ts roll-up — the committed handle TYPE drag2D returns is locked on the published type surface.",
        );
    } else {
        failures.push(
            "(i) `Drag2DHandle` is ABSENT from the shipped dist/keyframes.d.ts roll-up — the committed handle " +
                "TYPE `drag2D` returns is not on the published type surface (Q.WA2 S3).",
        );
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// clause (h) — proof:pkg3-clean: no `_2`-suffixed collision aliases in the d.ts
// (L.W8 S4 · PKG-3 · audit W126)
//
// API Extractor renames a source class that collides with a `globalThis.*` name
// (the WAAPI `Animation`, the Houdini `ScrollTimeline`) to `<Name>_2` and then
// re-exports it `export { <Name>_2 as <Name> }`. The alias is invisible at the
// barrel (the consumer sees `Animation`), but it LEAKS into every intermediate
// type in IDE hover text — `addFrame(…): Animation_2<K>` instead of
// `Animation<K>` (packaging-k.md:118-127). The cure (S4) renames the SOURCE
// classes (`Animation` → `KeyframesAnimation`, `ScrollTimeline` →
// `KeyframesScrollTimeline`) so no collision rename fires.
//
// This clause greps the EMITTED `dist/keyframes.d.ts` for the `/_2\s+as\s+/`
// re-export pattern and asserts ZERO. RED today (`Animation_2 as Animation`,
// `flip_2 as flip`, `ScrollTimeline_2 as ScrollTimeline`, … all present).
// GREEN when the rename lands. It ALSO catches a future API-Extractor upgrade
// re-introducing a `_2` alias — it reads the artifact, not a source proxy.
// ═════════════════════════════════════════════════════════════════════════════

function clausePkg3Clean() {
    console.log(
        "\nclause (h) — proof:pkg3-clean: no `_2` collision aliases in dist/keyframes.d.ts (S4 · PKG-3)",
    );
    const dts = fs.readFileSync(DTS, "utf8");
    // The collision-rename re-export shape: `<Name>_2 as <Name>` (in an `export
    // { … }` list or a re-export clause). Capture each offending alias + its
    // 1-based line for a named, actionable finding.
    const ALIAS_RE = /\b([A-Za-z_$][\w$]*_2)\s+as\s+([A-Za-z_$][\w$]*)/g;
    const lines = dts.split("\n");
    const hits = [];
    for (let i = 0; i < lines.length; i++) {
        for (const m of lines[i].matchAll(ALIAS_RE)) {
            hits.push({ line: i + 1, alias: m[1], as: m[2] });
        }
    }
    if (hits.length === 0) {
        console.log(
            "  ✓ zero `_2 as` collision aliases — the d.ts surface names every type canonically (no globalThis.* rename leak into IDE hover text).",
        );
    } else {
        failures.push(
            `(h) ${hits.length} \`_2\`-suffixed collision alias(es) in dist/keyframes.d.ts (PKG-3 — ` +
                "API Extractor renamed a source class colliding with a `globalThis.*` name; the alias " +
                "leaks into every intermediate type in IDE hover. Rename the source class " +
                "(`Animation` → `KeyframesAnimation`, `ScrollTimeline` → `KeyframesScrollTimeline`) so no " +
                "collision rename fires):\n      " +
                hits
                    .map((h) => `\`${h.alias} as ${h.as}\` (dist/keyframes.d.ts:${h.line})`)
                    .join(", "),
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────

async function main() {
    console.log(
        "proof:published-surface — the PUBLISH boundary oracle (tarball == exports == docs)",
    );

    clauseA();
    const lightExports = parseLightExports();
    const engineKeys = parseEngineInterfaceKeys();
    clauseB(lightExports, engineKeys);
    await clauseD(engineKeys);
    clauseE();
    clauseF();
    clauseG();
    clauseDrag2DCertified(lightExports);
    clausePkg3Clean();

    if (failures.length > 0) {
        console.error(
            `\nproof:published-surface — FAIL (${failures.length} finding(s); the published surface lies):`,
        );
        for (const f of failures) console.error("  ✗ " + f);
        console.error(
            "\n  The thing a human `npm i`s must be the thing the source declares and the\n" +
                "  README teaches. Fix at the seam: publicDir/files for (a); teach the export\n" +
                "  in README §Beyond CSS or enumerate it in docs/published-surface.md for (b);\n" +
                "  reconcile the AnimationEngine interface with engine.ts's exports for (d);\n" +
                "  rewrite the doc to the tree for (e); delete the dishonest peer for (f).",
        );
        process.exit(1);
    }

    console.log(
        "\nproof:published-surface — PASS: the packed tarball is exactly the declared\n" +
            "library dist, every public export is taught or manifested, the\n" +
            "AnimationEngine interface matches the runtime surface, the root CLAUDE.md\n" +
            "structural claims resolve against the tree, and every declared peer is a\n" +
            "real runtime peer of the shipped dist.",
    );
}

main().catch((err) => {
    console.error("proof:published-surface — ERROR:", err);
    process.exit(3);
});
