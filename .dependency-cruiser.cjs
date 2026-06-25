/**
 * dependency-cruiser — the SLIM source-graph lint tier (Q.WA1).
 *
 * This is the kf source-graph boundary FLOOR: the static pre-flight of three
 * architectural invariants that `tsc --noEmit` greens silently and that today
 * are caught only at the BUNDLE stage (`proof:boundary`) — late — or not at all.
 * It is the BUILD-IN that terminates the 3-tranche O-Band-A lint carry
 * (M.W2 → O.W1 → P.W1, named in three charters, built in none).
 *
 * THE SLIM CONSTRAINT (the measure-first KILL-DOWN, AUDIT-31 B2-pw1). The kf
 * source-graph lint tier is dependency-cruiser ONLY — eslint is NOT installed.
 * `tsc --strict` owns correctness; `prettier-organize-imports` owns import
 * ordering; dependency-cruiser owns the source-GRAPH rules (one tool per
 * concern, the gestalt seam). eslint's `import/no-cycle` is a graph-walk
 * dep-cruiser does natively (`circular: true`); eslint's `no-restricted-imports`
 * IS dep-cruiser's `pathNot`. Adding eslint would be a second toolchain, a
 * second config, a second CI step, for rules these two already own.
 *
 * AGREES WITH, NEVER DUPLICATES, `proof:boundary` (S3). The bundle-graph oracle
 * (`proof:boundary`) is the runtime authority: it re-runs tree-shaking over the
 * real module graph and proves zero static value.js/engine edge per LIGHT entry.
 * This lint floor is the SAME invariant one tier earlier — a STATIC source-edge
 * pre-flight that bites at EDIT time, before the bundle stage. It does not
 * re-implement the bundle oracle; it catches the same breach sooner.
 *
 * THREE forbidden rules over `src/`:
 *   1. no-cycle                  — no circular dependency anywhere in src/animation/.
 *   2. leaf-no-engine-no-valuejs — internal/ leaves may not reach the engine or value.js.
 *   3. light-barrel-no-engine    — the LIGHT named-export modules may not STATICALLY
 *                                  reach the engine or value.js (allowlist polarity).
 */

// ── The LIGHT named-export module allowlist (rule 3's `from` set) ──────────────
// MIRRORS `proof:boundary`'s self-enforcing entry derivation: these are exactly
// the source modules the barrel re-exports VALUES from via
// `export { … } from "./<module>"` (the set proof-boundary parses + bundles +
// proves value.js-free). It is authored as an ALLOWLIST, NOT a
// "everything-minus-a-HEAVY-blocklist": the tree carries ~45 src/animation/*.ts
// modules (most HEAVY — `compile`, `morph-svg`, `scroll-scene`, `resolve-values`,
// `ingest`, `validate`, the `engine-*` family, …), so a blocklist would FALSE-RED
// the instant a new HEAVY module is added. The allowlist tracks the SAME barrel
// re-export set as proof:boundary (the single point of truth); a new LIGHT export
// added to the barrel is picked up by both gates, and proof:boundary (the bundle
// oracle) is the backstop.
//
// `load-engine.ts` is DELIBERATELY ABSENT: it is a barrel re-export source, but
// it is the DYNAMIC half of the boundary — it owns the `await import("./engine")`
// edge. Its job IS to reach the engine (dynamically). Rule 3 is additionally
// scoped to STATIC edges only (dynamic-import exempt), so a legitimate dynamic
// boundary edge can never false-RED.
// R.W1: the LIGHT named-export modules moved into their zone directories. The
// allowlist tracks the SAME barrel re-export set as proof:boundary — now by zone
// path (`physics/`, `orchestration/`). `easing.ts` stays at the root.
const LIGHT_BARREL_MODULES = [
    "physics/numeric",
    "physics/smooth",
    "physics/spring/progress",
    "physics/spring/duration",
    "physics/spring/reseat",
    "physics/spring/linear-stops",
    "physics/spring/timing-function",
    "physics/spring/types",
    "physics/spring/index",
    "physics/morph",
    "physics/playback",
    "physics/oscillator",
    "physics/decay",
    "orchestration/timeline/index",
    "orchestration/timeline/native",
    "orchestration/stagger",
    "orchestration/flip",
    "orchestration/drag/draggable",
    "orchestration/drag/drag-2d",
    "orchestration/drag/index",
    "orchestration/sequence/sequence",
    "orchestration/sequence/events",
    "orchestration/sequence/index",
    "easing",
];

// A path regex matching exactly the LIGHT barrel modules at the src/animation/
// root (NOT internal/ — the leaves have their own rule 2). Anchored on the
// basename so `morph.ts` matches but `morph-svg.ts` does not.
const LIGHT_FROM = `^src/animation/(?:${LIGHT_BARREL_MODULES.map((m) =>
    m.replace(/[-]/g, "\\$&"),
).join("|")})\\.ts$`;

// The two forbidden TARGETS the boundary guards: the heavy engine module and
// the value.js package (any specifier — bare, named, subpath). R.W1: the engine
// moved into the `engine/` directory, so the path matches any module under it
// (`engine/animation.ts`, `engine/index.ts`, …); `svg/morph-svg`/`scroll/scene`/
// etc. are NOT the engine.
const ENGINE_PATH = "^src/animation/engine/";
const VALUEJS_PATH = "@mkbabb/value\\.js";

// The W97 verified-clean `@mkbabb/value.js/math` subpath — value.js's OWN
// grammar-free math leaf (`clamp`/`scale`/`lerp`/`lerpArray`). `proof:boundary`
// bundles its graph and proves ZERO grammar/parse-that/engine module
// (`math-subpath-clean`), so the LIGHT leaves re-export from it (the owner-directed
// no-byte-duplicate externalize). The boundary rules below EXCLUDE this exact
// verified-clean subpath via `pathNot` (mirroring proof:boundary's W97 allow-list)
// — a NEW value.js subpath (not `/math`) is NOT excluded and still reds.
const VALUEJS_MATH_SUBPATH = "@mkbabb/value\\.js/math";

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
    forbidden: [
        // ── Rule 1: no-cycle ──────────────────────────────────────────────
        // No circular dependency anywhere in the source graph. A cycle passes
        // `tsc --noEmit` silently; dep-cruiser's native graph-walk catches it
        // at edit time. (Replaces eslint `import/no-cycle` — the KILL-DOWN.)
        {
            name: "no-cycle",
            severity: "error",
            comment:
                "A circular import passes `tsc --noEmit` silently and can break " +
                "module init order at runtime. Break the cycle (extract the shared " +
                "leaf, or invert the edge). `type-only` edges are exempt — an " +
                "`import type` is erased at build and carries no runtime init " +
                "hazard. The src/animation/ engine cluster's pre-existing " +
                "co-recursive runtime cycles (the module+extracted-submodule " +
                "pattern: engine↔easing↔frame-compiler↔group↔waapi, " +
                "spring↔spring-duration↔spring-reseat, group↔group-layer-springs, " +
                "drag↔drag-2d) are recorded in the known-violations BASELINE " +
                "(.dependency-cruiser-known-violations.json) so this rule greens on " +
                "today's tree and bites only a NEW cycle — the ratchet that lets the " +
                "floor land without refactoring the engine (Q.WA1 ships zero engine " +
                "code). A new module-pair cycle reds immediately.",
            from: { path: "^src/" },
            to: {
                circular: true,
                // The head edge must be a RUNTIME edge (an `import type` head
                // carries no init hazard).
                dependencyTypesNot: ["type-only"],
                // …AND every edge AROUND the ring must be runtime too: a cycle
                // that closes through even ONE `import type` edge is erased at
                // build (the type edge vanishes), so it carries NO runtime
                // module-init hazard — exactly the exemption this rule's comment
                // promises. `viaOnly.dependencyTypesNot` matches a cycle only
                // when ALL its via-edges are non-type-only, so the rule reports
                // exactly the GENUINE runtime cycles (R.W2c — the prior config
                // gated only the head edge, so a runtime head reaching back
                // through a type-only edge false-RED'd as a "cycle" that does
                // not exist at runtime).
                viaOnly: {
                    dependencyTypesNot: ["type-only"],
                },
            },
        },

        // ── Rule 2: leaf-no-engine-no-valuejs ─────────────────────────────
        // The value.js-free-leaf law. Modules under src/animation/internal/
        // (leaves.ts, errors.ts, reduced-motion.ts, scheduler.ts,
        // binarySearch.ts) are the value.js-free leaves the LIGHT engines read
        // their clamp/lerp/rAF helpers from; they MUST NOT reach the heavy
        // engine NOR @mkbabb/value.js — a leaf doing so would pull value.js onto
        // the light path through the back door (the leaves.ts byte-duplicates of
        // value.js's helpers exist precisely to avoid that edge).
        {
            name: "leaf-no-engine-no-valuejs",
            severity: "error",
            comment:
                "An internal/ leaf must stay value.js-free: it may not import " +
                "../engine nor @mkbabb/value.js. The leaves carry byte-equivalent " +
                "copies of value.js's clamp/lerp/scale + rAF shims precisely so the " +
                "LIGHT engines reading them carry ZERO static value.js edge. Read " +
                "the leaf helper, not the engine or value.js.",
            from: { path: "^src/animation/internal/" },
            to: {
                path: [ENGINE_PATH, VALUEJS_PATH],
                // The W97 verified-clean `@mkbabb/value.js/math` subpath is the
                // sanctioned leaf edge (proof:boundary proves its graph grammar-free);
                // a longer/other value.js subpath still reds.
                pathNot: VALUEJS_MATH_SUBPATH,
                // Only RUNTIME edges breach the boundary. `import type` / the
                // `typeof import()` type position are erased under
                // verbatimModuleSyntax (zero runtime edge — exactly what
                // proof:boundary strips before its scan); a dynamic
                // `import("./engine")` is the SANCTIONED boundary edge, not a
                // static breach.
                dependencyTypesNot: [
                    "type-only",
                    "type-import",
                    "dynamic-import",
                ],
            },
        },

        // ── Rule 3: light-barrel-no-engine ────────────────────────────────
        // The STATIC pre-flight of `proof:boundary`'s LIGHT/HEAVY invariant. The
        // LIGHT named-export modules (the allowlist above) may not STATICALLY
        // reach the heavy engine NOR @mkbabb/value.js. This is the SAME invariant
        // proof:boundary bundle-verifies, one tier earlier (edit-time, not
        // build-time). Scoped to STATIC edges (`dynamic-import` exempt) so the
        // dynamic boundary's own `import("./engine")` (which lives in load-engine,
        // not in this allowlist) can never false-RED. This is
        // `no-restricted-imports` expressed as a `pathNot` boundary (the
        // KILL-DOWN: dep-cruiser, not eslint).
        {
            name: "light-barrel-no-engine",
            severity: "error",
            comment:
                "A LIGHT barrel-exported module reintroduced a STATIC edge to the " +
                "heavy engine.ts or @mkbabb/value.js — the value.js static/dynamic " +
                "boundary is broken. The LIGHT engines reach the engine (and " +
                "value.js) ONLY through the dynamic `import(\"./engine\")` in " +
                "load-engine.ts. Move the offending import behind the dynamic " +
                "boundary, or read the value.js-free leaf. (proof:boundary " +
                "bundle-verifies this same invariant — this lint floor catches it " +
                "at edit time, before the bundle stage.)",
            from: { path: LIGHT_FROM },
            to: {
                path: [ENGINE_PATH, VALUEJS_PATH],
                // The W97 verified-clean `@mkbabb/value.js/math` subpath is the
                // sanctioned light edge (proof:boundary externalizes it as a clean
                // math leaf); a longer/other value.js subpath still reds.
                pathNot: VALUEJS_MATH_SUBPATH,
                // The boundary is a RUNTIME-edge invariant (proof:boundary strips
                // `import type` before its scan). Exempt the erased type edges
                // (`type-only`/`type-import`, incl. `typeof import("./engine")`)
                // AND the sanctioned dynamic boundary edge (`import("./engine")`
                // in easing.ts/load-engine.ts). A STATIC value import of the
                // engine or value.js from a LIGHT module is the genuine breach.
                dependencyTypesNot: [
                    "type-only",
                    "type-import",
                    "dynamic-import",
                ],
            },
        },
    ],

    options: {
        // The kf source-graph: TS modules under src/animation/. Do NOT descend
        // into node_modules for the cruise (value.js is reached as a specifier,
        // matched by path — we don't need to walk its internals).
        doNotFollow: {
            path: "node_modules",
        },
        // Resolve TS the way the bundler does (the repo is moduleResolution:
        // bundler, target ES2022). The tsconfig drives extension + path resolution.
        tsConfig: {
            fileName: "tsconfig.json",
        },
        tsPreCompilationDeps: true,
        enhancedResolveOptions: {
            extensions: [".ts", ".tsx", ".js", ".mjs", ".cjs", ".json"],
        },
    },
};
