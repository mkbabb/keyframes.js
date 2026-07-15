#!/usr/bin/env node
// proof:record-truth — Tranche Q.W0 born-RED gate.
// Bites the REAL observable: the Q tranche opening on a self-contradictory primary impl record,
// a stale in-tree version line, an absent chronic-ledger parse target, a dirty decision-JSON, or a
// src/demo source edit in the record-hygiene (DEV-boundary) wave. Pure-node, AXIS-3 STATIC, sub-second.
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };
const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : null);
const count = (s, re) => (s ? (s.match(re) || []).length : 0);
const git = (cmd) => { try { return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }).trim(); } catch { return ""; } };

const RB  = "docs/tranches/P/IMPL-RUN-BOARD.md";
const PP  = "docs/tranches/P/PROGRESS.md";
const OP  = "docs/tranches/O/PROGRESS.md";
const QMD = "docs/tranches/Q/Q.md";
const QP  = "docs/tranches/Q/PROGRESS.md";
const QW0 = "docs/tranches/Q/waves/Q.W0.md";

// (a) IMPL-RUN-BOARD reconciled to the shipped truth.
// U.N2 — the decision-JSON dirty-check RETIRED: the P/Q-era compare-gate decision
// JSONs (soa-composite/spring-vector/…) were DISSOLVED (their live invariants
// re-homed to tests + the bench budget), so there is no per-run device-dependent
// JSON to keep clean.
const rb = read(RB);
ok(rb !== null, `(a) ${RB} missing (path must be fully qualified from repo root)`);
if (rb) {
  ok(count(rb, /⬜ PENDING/g) === 0, `(a) ${RB} still carries ${count(rb, /⬜ PENDING/g)}× "⬜ PENDING" rows`);
  ok(/DwKmrGBp/.test(rb), `(a) ${RB} does not assert the single live hash index-DwKmrGBp.js`);
  ok(/SUPERSEDED/.test(rb), `(a) ${RB} does not demote the superseded e9_Uza8v hash`);
}

// (b) P/O dev-phase boards re-headered to the shipped truth (tolerant of **…**/backtick markdown)
const pp = read(PP);
ok(pp !== null, `(b) ${PP} missing`);
if (pp) {
  ok(count(pp, /Version in tree.{0,8}4\.3\.0/g) === 0, `(b) ${PP} still claims the stale 4.3.0 in-tree version`);
  ok(/4\.4\.0/.test(pp), `(b) ${PP} has no 4.4.0 mention`);
}
const op = read(OP);
const partially = count(pp, /PARTIALLY IMPLEMENTED/g) + count(op, /PARTIALLY IMPLEMENTED/g);
ok(partially >= 2, `(b) "PARTIALLY IMPLEMENTED" header count ${partially} < 2 across P/O PROGRESS`);

// (c) Q charter + chronic-ledger parse-target substrate present (standing regression guard)
for (const f of [QMD, "docs/tranches/Q/audit/AUDIT-31.md", QW0, QP, "docs/tranches/Q/audit/chronic-ledger-Q.md"]) {
  ok(existsSync(f), `(c) ${f} missing`);
}
const qp = read(QP);
ok(count(qp, /Open deferrals/g) >= 1, `(c) ${QP} has no "Open deferrals" parse target`);
ok(/DM-2/.test(qp), `(c) ${QP} does not name DM-2 (the NINTH carry)`);
ok(/P-invariant-28|P-inv-28/.test(qp), `(c) ${QP} does not name P-invariant-28`);
ok(/no-deferral|NO deferrals/.test(read(QMD)), `(c) ${QMD} does not name the no-deferral mandate`);

// (d) dev→impl boundary — the Q.W0 record-hygiene commit touches NO src/ or demo/ source (inv-16)
const w0sha = git("git log --grep='impl(Q.W0' --format=%H -n1");
if (w0sha) {
  const files = git(`git show --stat --name-only --format= ${w0sha}`).split("\n").filter(Boolean);
  const bad = files.filter((f) => f.startsWith("src/") || f.startsWith("demo/"));
  ok(bad.length === 0, `(d) Q.W0 commit ${w0sha.slice(0, 8)} touched engine/demo source: ${bad.join(", ")}`);
}
// pre-commit: no Q.W0 commit yet → boundary clause carried by the other reds; the gate itself is the keystone.

// (e) the deploy round-trip oracle recorded (device-independent — static grep, never a live fetch)
const qw0 = read(QW0);
ok(/keyframes\.babb\.dev/.test(qw0), `(e) ${QW0} does not record the live deploy origin`);
ok(/index-DwKmrGBp\.js/.test(qw0), `(e) ${QW0} does not record the served bundle hash`);

// (f) the proof:no-deprecated-guard misnomer named + the real alias gate dispatched to its owner
ok(/no-deprecated-guard/.test(qw0), `(f) ${QW0} does not name the no-deprecated-guard misnomer`);
ok(/proof:alias-dropped/.test(qw0), `(f) ${QW0} does not dispatch proof:alias-dropped to its owning wave`);

if (fails.length) {
  console.error("proof:record-truth FAIL:\n" + fails.map((f) => "  ✗ " + f).join("\n"));
  process.exit(1);
}
console.log("proof:record-truth PASS — primary record reconciled to the shipped 4.4.0 truth; dev→impl boundary witnessed.");
