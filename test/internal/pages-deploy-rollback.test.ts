// SERVED MODEL: claude-opus-5-5
/**
 * pages-deploy rollback-target capture (COHESION §0hg.4 residual c).
 *
 * `scripts/pages-deploy.sh` step 2 records the live PRODUCTION deployment id
 * before the deploy swaps the alias. wrangler 4.x's `pages deployment list
 * --json` prints the same title-cased rows as its table (`Id`, `Environment`,
 * `Branch`, …; wrangler-dist `pagesDeploymentListCommand`), newest first and
 * previews included. The step runs against a stub `npx` that answers with that
 * exact shape (a newer Preview row ahead of the live Production one) and the
 * build is short-circuited, so only steps 1-2 execute.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const REPO = path.resolve(import.meta.dirname, "../..");
const bin = fs.mkdtempSync(path.join(os.tmpdir(), "kf-pages-deploy-"));

const row = (Id: string, Environment: string) => ({
    Id,
    Environment,
    Branch: Environment === "Production" ? "master" : "preview",
    Source: "1fd86e0",
    Deployment: `https://${Id}.keyframes-8uq.pages.dev`,
    Status: "1 hour ago",
    Build: `https://dash.cloudflare.com/acct/pages/view/keyframes/${Id}`,
});
const PRODUCTION = [row("prod-live", "Production")];
const ALL = [row("preview-newer", "Preview"), ...PRODUCTION];

fs.writeFileSync(
    path.join(bin, "npx"),
    `#!/usr/bin/env bash
case "$*" in
  *"pages project list"*) echo "│ keyframes │ keyframes-8uq.pages.dev │" ;;
  *"pages deployment list"*"--environment production"*) cat <<'JSON'
${JSON.stringify(PRODUCTION, null, 2)}
JSON
  ;;
  *"pages deployment list"*) cat <<'JSON'
${JSON.stringify(ALL, null, 2)}
JSON
  ;;
  *) echo "stub npx: unexpected $*" >&2; exit 1 ;;
esac
`,
    { mode: 0o755 },
);

afterAll(() => fs.rmSync(bin, { recursive: true, force: true }));

describe("pages-deploy — the rollback target is the live production deployment", () => {
    it("captures the Production row's Id from wrangler's JSON shape", () => {
        const run = spawnSync("bash", [path.join(REPO, "scripts/pages-deploy.sh")], {
            encoding: "utf8",
            env: {
                ...process.env,
                PATH: `${bin}:${process.env.PATH}`,
                CLOUDFLARE_API_TOKEN: "stub",
                CLOUDFLARE_ACCOUNT_ID: "stub",
                PAGES_PROJECT: "keyframes",
                // Stop after step 2: the build step's eval exits the script.
                BUILD_CMD: "exit 0",
            },
        });
        const out = run.stdout + run.stderr;
        expect(out).not.toContain("Could not capture rollback target");
        expect(out).toContain("Rollback target: prod-live");
        expect(run.status).toBe(0);
    });
});
