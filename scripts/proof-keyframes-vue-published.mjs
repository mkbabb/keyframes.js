#!/usr/bin/env node
/**
 * proof:keyframes-vue-published — L.W8 S2 (the sibling-adapter publish tripwire;
 * audit W56 / Lane 36 `[high/CROSS-REPO-ASK] keyframes-vue is UNPUBLISHED`).
 *
 * THE GAP. `packages/keyframes-vue/` is a complete Vue 3 adapter
 * (`<Keyframes :css>` + `useKfAnimation`) at version 0.1.0, yet `npm show
 * @mkbabb/keyframes-vue` returns nothing — the package is not on the registry,
 * and no CI surface catches the absence. Its `peerDependencies` floor on
 * `@mkbabb/keyframes.js` is ALSO stale (`>=4.2.0`) — the `<Keyframes>` component
 * consumes the K.W7–W11 `loadAnimationEngine()` surface at mount, which ships
 * 4.3.0+; the floor must advance to `>=4.3.0` before the adapter lands on npm.
 *
 * THIS GATE IS BORN-RED-BY-DESIGN (the SAME tripwire pattern as
 * `proof:peer-satisfied`, L.W4 S8). The actual `npm publish` of
 * `@mkbabb/keyframes-vue` is USER-DOMAIN — this wave implements everything UP TO
 * publish (peer-floor bump, build, the release.yml job) but does NOT publish, so
 * clause (b) STAYS RED until the user runs the publish. It rides the report-all
 * CI demo-smoke job (continue-on-error), NEVER the blocking proof:hygiene chain
 * (an absent-on-npm RED there would abort the && chain — exactly the
 * proof:peer-satisfied disposition). DO NOT force clause (b) green by stubbing
 * the registry read: a green here before the user publishes would hide the very
 * absence the gate exists to surface.
 *
 * THREE clauses (each BITES):
 *
 *   (a) built-artifact — `packages/keyframes-vue/dist/keyframes-vue.js` EXISTS
 *       (the built bundle the publish ships). BITE: the package has not been
 *       built (`cd packages/keyframes-vue && npm run build`) — there is no
 *       artifact to publish. A device-INDEPENDENT FACT: a file stat.
 *
 *   (b) published-on-registry — `npm show @mkbabb/keyframes-vue version` returns
 *       EXACTLY `0.1.0`. BITE: the package is absent from npm (E404, the state
 *       today) OR the published version drifted from the manifest's 0.1.0. The
 *       gate captures npm's OWN exit status + the trimmed stdout — a `head`-piped
 *       0 cannot mask the E404. A genuine network failure (ENOTFOUND / offline)
 *       is reported as the registry being unreachable; it still REDs (the gate
 *       cannot CONFIRM the publish), and clause (c) below REDs deterministically
 *       offline so the born-RED verdict never depends on the network.
 *
 *   (c) peer-floor — `packages/keyframes-vue/package.json`
 *       peerDependencies["@mkbabb/keyframes.js"] is `>=4.3.0` (the K.W7–W11
 *       surface floor). BITE: the floor is stale (`>=4.2.0`, today) or regresses
 *       below 4.3.0. A pure manifest read — device-INDEPENDENT, offline-safe.
 *
 * The PUBLISH-FLOOR the gate asserts (4.3.0) is single-sourced HERE; if a future
 * wave advances the surface floor, bump `PEER_FLOOR` and the message follows.
 *
 * Re-runnable: `node scripts/proof-keyframes-vue-published.mjs`. STATIC for (a)
 * and (c) (pure fs reads); (b) shells `npm show` (the one network edge).
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const PKG_DIR = join(REPO, "packages", "keyframes-vue");
const PKG_JSON = join(PKG_DIR, "package.json");
const DIST_ENTRY = join(PKG_DIR, "dist", "keyframes-vue.js");

/** The K.W7–W11 surface floor the adapter's `<Keyframes>` mount consumes. */
const PEER_FLOOR = "4.3.0";
const EXPECTED_VERSION = "0.1.0";
const PKG_NAME = "@mkbabb/keyframes-vue";

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:keyframes-vue-published — L.W8 S2 (the sibling-adapter publish tripwire; BORN-RED until the USER publishes @mkbabb/keyframes-vue)",
);

// ── (a) built-artifact — the publish bundle exists on disk ───────────────────
if (existsSync(DIST_ENTRY)) {
    ok(`(a) the built artifact exists: packages/keyframes-vue/dist/keyframes-vue.js`);
} else {
    fail(
        "(a) packages/keyframes-vue/dist/keyframes-vue.js is ABSENT — the adapter " +
            "has not been built; there is no bundle to publish " +
            "(`cd packages/keyframes-vue && npm run build`).",
    );
}

// ── (b) published-on-registry — npm show returns EXACTLY 0.1.0 ───────────────
{
    let registryVersion = "";
    let registryError = "";
    try {
        // Capture npm's OWN exit (execFileSync throws on non-zero) + the trimmed
        // stdout. `--no-workspaces` keeps the lookup at the named package, never
        // the monorepo root; stderr is piped so an E404 surfaces in the catch.
        registryVersion = execFileSync(
            "npm",
            ["show", `${PKG_NAME}@${EXPECTED_VERSION}`, "version", "--no-workspaces"],
            { cwd: REPO, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
        )
            .toString()
            .trim();
    } catch (err) {
        // npm exits non-zero on E404 (package absent — today) AND on network
        // failure (ENOTFOUND). Record the reason; either way clause (b) REDs.
        registryError =
            (err && (err.stderr?.toString() || err.message)) || "unknown npm error";
    }

    if (registryVersion === EXPECTED_VERSION) {
        ok(`(b) ${PKG_NAME}@${EXPECTED_VERSION} is published on the registry (npm show → ${registryVersion})`);
    } else if (registryError) {
        const isAbsent = /E404|404|not found|could not be found/i.test(registryError);
        const isOffline = /ENOTFOUND|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|network/i.test(
            registryError,
        );
        fail(
            `(b) \`npm show ${PKG_NAME}@${EXPECTED_VERSION} version\` did NOT return ${EXPECTED_VERSION} — ` +
                (isAbsent
                    ? `the package is ABSENT from the registry (E404). The publish is USER-DOMAIN; this clause STAYS RED until the user runs \`npm publish --access public\` in packages/keyframes-vue/.`
                    : isOffline
                      ? `the registry is UNREACHABLE (offline). The gate cannot CONFIRM the publish — RED (clause (c) reds offline-deterministically so the born-RED verdict never hinges on the network).`
                      : `npm reported: ${registryError.split("\n")[0]}`),
        );
    } else {
        // npm exited 0 but the version did not match 0.1.0 — a version drift.
        fail(
            `(b) \`npm show ${PKG_NAME}@${EXPECTED_VERSION} version\` returned "${registryVersion}" ` +
                `(expected ${EXPECTED_VERSION}) — the published version drifted from the package.json manifest.`,
        );
    }
}

// ── (c) peer-floor — the @mkbabb/keyframes.js floor is >=4.3.0 ───────────────
{
    if (!existsSync(PKG_JSON)) {
        fail(
            `(c) ${PKG_JSON} is MISSING — the keyframes-vue manifest is gone (the gate lost its subject).`,
        );
    } else {
        const pkg = JSON.parse(readFileSync(PKG_JSON, "utf8"));
        const declared = pkg.peerDependencies?.["@mkbabb/keyframes.js"];
        if (!declared) {
            fail(
                `(c) packages/keyframes-vue/package.json declares NO peer on @mkbabb/keyframes.js — ` +
                    "the adapter must declare its host engine as a peer.",
            );
        } else {
            // The floor is a `>=X.Y.Z` range; extract the version and compare it
            // against PEER_FLOOR (>=4.3.0). A `>=4.2.0` floor (today) is stale.
            const m = /^>=\s*(\d+)\.(\d+)\.(\d+)/.exec(declared.trim());
            if (!m) {
                fail(
                    `(c) the peer range "${declared}" is not the expected \`>=X.Y.Z\` shape — ` +
                        "the floor cannot be verified; declare a `>=4.3.0` floor.",
                );
            } else {
                const floor = [Number(m[1]), Number(m[2]), Number(m[3])];
                const want = PEER_FLOOR.split(".").map(Number);
                const cmp = (a, b) => {
                    for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i];
                    return 0;
                };
                if (cmp(floor, want) >= 0) {
                    ok(`(c) the peer floor "@mkbabb/keyframes.js": "${declared}" meets the >=${PEER_FLOOR} surface floor`);
                } else {
                    fail(
                        `(c) the peer floor "@mkbabb/keyframes.js": "${declared}" is STALE — ` +
                            `it must advance to >=${PEER_FLOOR} (the K.W7–W11 \`loadAnimationEngine()\` ` +
                            "surface the <Keyframes> component consumes at mount).",
                    );
                }
            }
        }
    }
}

// ── Verdict ──────────────────────────────────────────────────────────────────
if (failures.length > 0) {
    console.error(
        `\nproof:keyframes-vue-published — FAIL (${failures.length}): the sibling adapter ` +
            `${PKG_NAME} is not published-and-current. This gate is BORN-RED-BY-DESIGN ` +
            "(the proof:peer-satisfied tripwire pattern, L.W4 S8): the actual `npm publish` is " +
            "USER-DOMAIN, so clause (b) STAYS RED until the user publishes. It rides the report-all " +
            "CI demo-smoke job (continue-on-error), NEVER the blocking proof:hygiene chain.",
    );
    process.exit(1);
}
console.log(
    `\nproof:keyframes-vue-published — PASS: ${PKG_NAME}@${EXPECTED_VERSION} is built, ` +
        `published on the registry, and declares the >=${PEER_FLOOR} surface floor. The sibling ` +
        "adapter publish loop is closed.",
);
