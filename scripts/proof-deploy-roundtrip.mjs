#!/usr/bin/env node
/**
 * proof:deploy-roundtrip — Q.WA3 S3 (the deploy round-trip oracle, ROUNDTRIP-ORACLE).
 *
 * THE REAL OBSERVABLE (inv-observable-truth, NOT a proxy): `scripts/pages-deploy.sh`
 * promised "post-deploy validation" in its header (line 20) but performed NONE — no
 * HTTP-200 probe, no served-bundle-hash assertion after `wrangler pages deploy`. The
 * 2026-06-23 deploy shipped a "verified deploy" that verified NOTHING. This gate is
 * that promise made mechanical.
 *
 * ── THE TWO LEGS, by their device-dependence ─────────────────────────────────
 *
 * HARD (device-INDEPENDENT — the gate's verdict): the deploy script CONTAINS a real
 *   post-deploy validation block AFTER `wrangler pages deploy` — an HTTP-200 probe of
 *   the production origin AND a served-vs-built index-*.js hash assertion, with the
 *   captured rollback target surfaced on mismatch. This is a STRUCTURAL parse of the
 *   shell script (no network) — it BITES the genuine "verifies nothing" defect: born-
 *   RED on the pre-Q script (rollback capture only — confirmed by the absence of any
 *   curl/HTTP-200/served-hash logic in the post-deploy region), GREEN once the block
 *   exists. The clauses anchor on the OPERATIONAL shape (curl probe + hash compare +
 *   exit-on-mismatch), not a comment, so a header mention without the logic still reds.
 *
 * OBSERVE-ONLY (network-dependent — REPORTED, never blocking): when KF_DEPLOY_LIVE=1
 *   the gate fetches the production origin and reports whether the LIVE bundle hash
 *   matches the locally-built one. CF edge propagation lags after a deploy, so this
 *   leg is informational by CONSTRUCTION — it NEVER changes the exit code. It does NOT
 *   declare a ci-env posture: there is no live fetch in a normal CI run to record a
 *   posture for, so it carries no taxonomy-manifest row — it is a pure opt-in operator
 *   probe (the spec's "observe-only CI leg"), gated behind the explicit env flag.
 *
 * RUN: node scripts/proof-deploy-roundtrip.mjs            # the HARD static verdict
 *      KF_DEPLOY_LIVE=1 node scripts/proof-deploy-roundtrip.mjs   # + the live probe
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT = "scripts/pages-deploy.sh";
const scriptPath = join(root, SCRIPT);

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:deploy-roundtrip — Q.WA3 S3 (the deploy round-trip oracle · post-deploy validation block)",
);

// ── Clause: the deploy script exists ──────────────────────────────────────────
if (!existsSync(scriptPath)) {
    fail("script-exists", `the deploy recipe ${SCRIPT} is ABSENT — no deploy to validate.`);
    report();
}
const src = readFileSync(scriptPath, "utf8");

// ── Isolate the POST-DEPLOY region (everything AFTER the deploy COMMAND) ───────
// The validation must live AFTER the deploy command — a probe before the deploy
// validates the OLD bundle. We anchor on the actual deploy INVOCATION (an `npx
// wrangler pages deploy` run line at the start of a line, modulo indentation) — NOT
// a header comment that merely names `wrangler pages deploy` in prose (the line-9
// false-anchor that would swallow the pre-deploy rollback capture into the
// "post-deploy" slice and false-pass the rollback/exit clauses). We take the LAST
// such command line (the real deploy is the final invocation).
const deployCmdRe = /^[ \t]*npx +wrangler pages deploy\b/gm;
let lastDeployIdx = -1;
for (const m of src.matchAll(deployCmdRe)) lastDeployIdx = m.index;
if (lastDeployIdx === -1) {
    fail(
        "deploy-step",
        `${SCRIPT} has NO \`npx wrangler pages deploy\` command line — the round-trip ` +
            `cannot be ordered against a missing deploy (a header mention is not a command).`,
    );
    report();
}
// Skip past the deploy command's own multi-line invocation to its post-deploy tail.
const postDeploy = src.slice(lastDeployIdx);

// ── Clause: an HTTP-200 probe of the production origin ────────────────────────
// The OPERATIONAL signature: a curl that reads the HTTP status of the origin and
// compares it to 200. A bare `curl` without the 200 check is not a probe.
const hasCurl = /\bcurl\b/.test(postDeploy);
const has200 = /\b200\b/.test(postDeploy) && /http_code|HTTP/i.test(postDeploy);
if (!hasCurl || !has200) {
    fail(
        "http-200-probe",
        `the post-deploy region of ${SCRIPT} has NO HTTP-200 probe (curl=${hasCurl}, ` +
            `200-check=${has200}). After \`wrangler pages deploy\` the script must poll ` +
            `the production origin and assert HTTP 200 — else a dead origin ships unnoticed.`,
    );
} else {
    ok("http-200-probe", `${SCRIPT} polls the production origin for HTTP 200 after deploy`);
}

// ── Clause: a served-vs-built index-*.js hash assertion ───────────────────────
// The round-trip the impl drive verified by hand: the BUILT assets/index-<hash>.js
// basename (the content hash) must equal the bundle the origin SERVES. The signature
// is: read the built index-*.js name AND the served one AND compare them.
const buildsBuiltHash = /index-\*\.js|index-\[A-Za-z0-9|built_hash|built_index/.test(
    postDeploy,
);
const readsServedHash = /served_hash|served=|grep -oE 'assets\/index/.test(postDeploy) ||
    /assets\/index-/.test(postDeploy);
const comparesHash =
    /built_hash.*served_hash|served_hash.*built_hash|"\$served_hash" = "\$built_hash"|\$built_hash" = "\$served_hash/.test(
        postDeploy,
    );
if (!buildsBuiltHash || !readsServedHash || !comparesHash) {
    fail(
        "served-hash-assertion",
        `the post-deploy region of ${SCRIPT} does NOT assert the served bundle hash ` +
            `matches the built one (built=${buildsBuiltHash}, served=${readsServedHash}, ` +
            `compare=${comparesHash}). A "verified deploy" must compare the served ` +
            `assets/index-<hash>.js to the locally-built one — the round-trip.`,
    );
} else {
    ok(
        "served-hash-assertion",
        `${SCRIPT} asserts the served assets/index-<hash>.js equals the built bundle (the round-trip)`,
    );
}

// ── Clause: the rollback target is surfaced on mismatch ───────────────────────
// The script captures a rollback id BEFORE the deploy (lines 65-78); the validation
// block must SURFACE it when the round-trip fails, so the operator has the one-command
// undo. The signature: the failure path names `rollback` + the captured ROLLBACK_ID.
const surfacesRollback =
    /rollback/.test(postDeploy) && /ROLLBACK_ID/.test(postDeploy);
if (!surfacesRollback) {
    fail(
        "rollback-on-mismatch",
        `the post-deploy region does NOT surface the captured rollback target on a ` +
            `validation failure (rollback+ROLLBACK_ID=${surfacesRollback}). A failed ` +
            `round-trip must hand the operator the \`wrangler pages deployment rollback\` undo.`,
    );
} else {
    ok("rollback-on-mismatch", `${SCRIPT} surfaces the captured rollback target on a round-trip failure`);
}

// ── Clause: the block FAILS the deploy on mismatch (exit non-zero) ────────────
// A validation block that logs a mismatch but exits 0 is theatre. The post-deploy
// region must `exit 1` on the non-200 / hash-mismatch path.
const exitsOnFail = /exit 1/.test(postDeploy);
if (!exitsOnFail) {
    fail(
        "exit-on-mismatch",
        `the post-deploy validation does NOT \`exit 1\` on a non-200 / hash-mismatch — ` +
            `a deploy that fails validation must FAIL, not log-and-pass.`,
    );
} else {
    ok("exit-on-mismatch", `${SCRIPT} exits non-zero on a failed round-trip (the deploy fails, not log-and-pass)`);
}

// ── OBSERVE-ONLY leg: the LIVE origin probe (opt-in, never blocking) ──────────
// Reported only — CF edge propagation latency makes the live fetch inherently
// network-flaky, so it is informational by construction: it never touches the exit
// code. The HARD verdict above is the gate's truth.
if (process.env.KF_DEPLOY_LIVE === "1") {
    const PROD_ORIGIN = process.env.PROD_ORIGIN ?? "https://keyframes.babb.dev";
    console.log(`  · [observe-only] probing the live origin ${PROD_ORIGIN} ...`);
    try {
        const res = await fetch(`${PROD_ORIGIN}/`, { redirect: "follow" });
        const html = await res.text();
        const m = html.match(/assets\/index-[A-Za-z0-9_-]+\.js/);
        const builtDir = join(root, "dist", "gh-pages", "assets");
        let builtHash = null;
        if (existsSync(builtDir)) {
            const { readdirSync } = await import("node:fs");
            const built = readdirSync(builtDir).find((f) => /^index-.*\.js$/.test(f));
            builtHash = built ?? null;
        }
        const servedHash = m ? m[0].replace("assets/", "") : null;
        if (res.status === 200 && servedHash && builtHash && servedHash === builtHash) {
            console.log(
                `  · [observe-only] LIVE MATCH: ${PROD_ORIGIN} serves ${servedHash} (HTTP 200) == built ${builtHash}.`,
            );
        } else {
            console.log(
                `  · [observe-only] LIVE: HTTP ${res.status}, served=${servedHash ?? "<none>"}, ` +
                    `built=${builtHash ?? "<dist not built>"} — reported, NOT blocking (CF edge propagation).`,
            );
        }
    } catch (e) {
        console.log(
            `  · [observe-only] LIVE probe could not reach ${PROD_ORIGIN} (${(e?.message ?? e)}) — ` +
                `reported, NOT blocking.`,
        );
    }
}

report();

function report() {
    console.log("");
    if (failures.length > 0) {
        console.error(
            "proof:deploy-roundtrip — FAIL:\n" +
                failures.join("\n") +
                `\n\n  ${SCRIPT} must mechanize the deploy round-trip: after \`wrangler pages\n` +
                "  deploy\`, probe the production origin for HTTP 200 AND assert the served\n" +
                "  assets/index-<hash>.js equals the locally-built bundle, surfacing the\n" +
                "  captured rollback target + `exit 1` on mismatch. The live-origin match is\n" +
                "  observe-only (KF_DEPLOY_LIVE=1); the validation BLOCK existing is the verdict.",
        );
        process.exit(1);
    }
    console.log(
        `proof:deploy-roundtrip — PASS: ${SCRIPT} validates the round-trip after deploy\n` +
            "(HTTP-200 probe + served-vs-built index-*.js hash assertion + rollback-on-mismatch\n" +
            "+ exit-on-mismatch). The live-origin match is the observe-only KF_DEPLOY_LIVE=1 leg.",
    );
    process.exit(0);
}
