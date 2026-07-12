#!/usr/bin/env node
/**
 * proof:board-live — T.M9 (lane 24 rec 6 / lane 26 rec 8 / lane 27 rec 4).
 *
 * Two coupled instruments over the tranche's OWN audit record — the cure for the S
 * board drift (a board that marks committed work PENDING, cites "born-RED by design"
 * while the gate exits 0, and describes a tree state no git state matches):
 *
 *  (a) BOARD↔TREE — a PROGRESS.md row citing a GREEN gate exit that REDs at HEAD
 *      REDs the board. Each row that cites `proof:X exits 0` / `proof:X green` is
 *      reconciled against a LIVE re-run (same shape as the retired doc gate).
 *      Today the T board cites no gate exits → vacuously green; a planted
 *      "proof:X green" row whose gate reds REDs the board. (Set KF_BOARD_LIVE_NORERUN=1
 *      to parse-only — the re-run is skipped in a no-exec context; the citation shape
 *      is still validated.)
 *  (b) SESSION-LOG FRESHNESS — the session log's last-mentioned commit hash (that is
 *      an ANCESTOR of HEAD on this branch) must be within N commits of HEAD. The S
 *      session log stopped ~40% early (20 commits, incl. S.C4/S2 and ⑩, landed after
 *      the last entry). T's board is born WITH this discipline.
 *
 * Overrides (plant-test): KF_PROGRESS_MD, KF_BOARD_LIVE_N, KF_BOARD_LIVE_NORERUN.
 */
import { readFileSync } from "node:fs";
import { execSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROGRESS =
    process.env.KF_PROGRESS_MD || join(root, "docs/tranches/T/PROGRESS.md");
const N = Number(process.env.KF_BOARD_LIVE_N || "25");

const failures = [];
const passes = [];
const board = readFileSync(PROGRESS, "utf8");

// ── (a) board↔tree: reconcile cited GREEN gate exits against a live re-run ─────
{
    // A citation of a gate's GREEN exit: `proof:X` within ~40 chars of exits 0 /
    // green / GREEN / passes on the SAME line. We only reconcile explicit exit
    // claims — a board row naming a gate as a wave's oracle is not an exit claim.
    const cited = new Set();
    for (const line of board.split("\n")) {
        const m = line.match(
            /`?(proof:[a-z0-9-]+)`?[^\n]{0,40}?\b(?:exits?\s*0|green|GREEN|passes)\b/g,
        );
        if (!m) continue;
        for (const frag of m) {
            const g = frag.match(/proof:[a-z0-9-]+/)[0];
            if (g !== "proof:board-live") cited.add(g);
        }
    }
    if (cited.size === 0) {
        passes.push(
            "board↔tree — the T board cites NO green gate-exit claim (vacuously reconciled); " +
                "the moment a row claims `proof:X exits 0`, this clause re-runs proof:X and REDs " +
                "the board if it reds (the S drift cure).",
        );
    } else if (process.env.KF_BOARD_LIVE_NORERUN === "1") {
        passes.push(
            `board↔tree — ${cited.size} cited gate-exit claim(s) [${[...cited].join(", ")}] ` +
                "validated in PARSE-ONLY mode (KF_BOARD_LIVE_NORERUN=1); the live re-run is skipped.",
        );
    } else {
        for (const g of cited) {
            const r = spawnSync("npm", ["run", "--silent", g], {
                cwd: root,
                stdio: "ignore",
                timeout: 120000,
            });
            if (r.status !== 0) {
                failures.push(
                    `board↔tree — the board cites ${g} as GREEN/exits-0, but a live re-run at HEAD ` +
                        `RED (exit ${r.status}). A board row citing a state a re-run contradicts is a ` +
                        "defect (the S.A1 'born-RED by design' while chronic-closure exits 0 drift).",
                );
            } else {
                passes.push(`board↔tree — cited ${g} reconciles GREEN against a live re-run at HEAD.`);
            }
        }
    }
}

// ── (b) session-log freshness ─────────────────────────────────────────────────
{
    const hashes = [...board.matchAll(/\b([0-9a-f]{7,40})\b/g)]
        .map((m) => m[1])
        // filter out obvious non-hashes (all-digits like years/counts are still
        // possible git prefixes, but git rev-parse below is the real filter)
        .filter((h) => /[a-f]/.test(h));
    let head = "";
    try {
        head = execSync("git rev-parse HEAD", { cwd: root }).toString().trim();
    } catch (e) {
        failures.push(`session-log — cannot resolve HEAD (${e.message}); not a git tree?`);
    }
    if (head) {
        const distances = [];
        for (const h of new Set(hashes)) {
            try {
                execSync(`git rev-parse --verify --quiet ${h}^{commit}`, {
                    cwd: root,
                    stdio: "ignore",
                });
            } catch {
                continue; // not a commit
            }
            const anc = spawnSync(
                "git",
                ["merge-base", "--is-ancestor", h, "HEAD"],
                { cwd: root },
            );
            if (anc.status !== 0) continue; // not an ancestor of HEAD
            const d = Number(
                execSync(`git rev-list --count ${h}..HEAD`, { cwd: root })
                    .toString()
                    .trim(),
            );
            distances.push({ h, d });
        }
        if (distances.length === 0) {
            failures.push(
                "session-log — the board's session log mentions NO commit hash that is an ancestor " +
                    "of HEAD on this branch. The log has drifted off the branch entirely (the S ~40%-" +
                    "early stop). Append an entry citing a recent commit.",
            );
        } else {
            const nearest = distances.reduce((a, b) => (a.d <= b.d ? a : b));
            if (nearest.d > N) {
                failures.push(
                    `session-log — the last-mentioned ancestor commit (${nearest.h.slice(0, 7)}) is ` +
                        `${nearest.d} commits behind HEAD — beyond the freshness floor of ${N}. The S ` +
                        "session log stopped ~40% early; T's board must be appended at the event, not " +
                        "reconstructed at close. Add a session-log entry citing HEAD.",
                );
            } else {
                passes.push(
                    `session-log — the last-mentioned ancestor commit (${nearest.h.slice(0, 7)}) is ` +
                        `${nearest.d} commit(s) behind HEAD (within the freshness floor of ${N}).`,
                );
            }
        }
    }
}

// ── report ────────────────────────────────────────────────────────────────────
console.log("proof:board-live — T.M9 (board↔tree reconciliation + session-log freshness)\n");
for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(`\nproof:board-live — FAIL (${failures.length}):`);
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "\nproof:board-live — PASS: no board row cites a gate state a live re-run contradicts, and the " +
        "session log's last-mentioned commit is within the freshness floor of HEAD (the S board drift is cured).",
);
