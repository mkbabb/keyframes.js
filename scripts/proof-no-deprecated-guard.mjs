#!/usr/bin/env node
/**
 * proof:no-deprecated-guard — H.W1 S5 (the deprecated `next()` nav-guard is gone).
 *
 * vue-router 5 deprecated the `next(value)` navigation-guard signature: a guard
 * RETURNS its value (a redirect-location object, or `true`/`undefined`) instead
 * of calling the `next` callback. The pre-W1 `router.ts` used `next(value)` in its
 * `beforeEach`, flooding the console with `next() is deprecated` warnings (14×
 * live, vue-router 5.1.0 — CP-LOW-3). H.W1 S5 drops the callback to a returned
 * value; this gate locks that conversion so a regression to the callback form reds.
 *
 *   CLAUSE — `next(` is absent (as a CALL) from `router.ts`.
 *     The grep is comment-aware: `router.ts` legitimately NAMES the retired
 *     `next(value)` / `next() is deprecated` pattern in its docstring (so a future
 *     reader knows WHY the guard returns its value). A naive `/next\(/` grep would
 *     red on that prose — a false positive. So the clause comment-BLANKS the file
 *     (block + line comments → spaces, newlines preserved) THEN matches the
 *     `next(` call token. Only a real `next(` CALL reds.
 *
 *   BITE: reds TODAY on the pre-W1 tree — `router.beforeEach((to, from, next) =>
 *     { … next({ name }) … next() })` calls the deprecated callback, 14× live.
 *     GREEN on S5 — the guard `return`s a redirect location / `true`. Re-introduce
 *     any `next(` CALL in `router.ts` → reds.
 *
 * Static grep gate (no browser, no build). Mirrors the comment-blanking idiom in
 * scripts/proof-decomposition.mjs (clause 4/5). Re-runnable:
 *   `node scripts/proof-no-deprecated-guard.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROUTER = path.join(REPO, "demo/app/router.ts");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log("proof:no-deprecated-guard — H.W1 S5 (the deprecated next() guard is gone)");

/**
 * Comment-blanker: strip block (`/* … *​/`) + line (`// …`) comments to spaces,
 * preserving newlines so the matched line number stays truthful and a docstring
 * NAMING the retired `next(value)` pattern can never red the gate — only real
 * code does. (Lexical, not a full parser — sufficient for a `.ts` source.)
 */
const blankComments = (s) => {
    let out = "";
    let i = 0;
    const n = s.length;
    while (i < n) {
        if (s[i] === "/" && s[i + 1] === "*") {
            const end = s.indexOf("*/", i + 2);
            const stop = end === -1 ? n : end + 2;
            for (let j = i; j < stop; j++) out += s[j] === "\n" ? "\n" : " ";
            i = stop;
            continue;
        }
        if (s[i] === "/" && s[i + 1] === "/") {
            while (i < n && s[i] !== "\n") {
                out += " ";
                i++;
            }
            continue;
        }
        out += s[i];
        i++;
    }
    return out;
};

if (!fs.existsSync(ROUTER)) {
    console.error(
        `proof:no-deprecated-guard — ERROR: router not found at ` +
            path.relative(REPO, ROUTER),
    );
    process.exit(3);
}

const src = blankComments(fs.readFileSync(ROUTER, "utf8"));
// `next(` as a CALL token. `\bnext\s*\(` matches the callback invocation
// `next(...)` AND the third-guard-param call site; it does NOT match a property
// `foo.next` or a method `.next(` (the leading `\b` after a `.` still matches, so
// guard against a member access explicitly — vue-router's deprecated callback is a
// BARE `next(`, never `x.next(`).
const CALL = /(^|[^.\w$])next\s*\(/g;
const matches = [...src.matchAll(CALL)];

if (matches.length === 0) {
    ok("router.ts calls `next(` 0 times (the guard returns its value, S5)");
} else {
    // Report the offending line numbers for a precise diagnostic.
    const lineOf = (idx) => src.slice(0, idx).split("\n").length;
    const lines = matches.map((m) => lineOf(m.index + m[1].length));
    fail(
        `router.ts calls the deprecated \`next(\` ${matches.length} time(s) at ` +
            `line(s) ${lines.join(", ")} — vue-router 5 deprecated the callback ` +
            `signature (14× \`next() is deprecated\` live, CP-LOW-3). A guard must ` +
            `RETURN its value (a redirect location, or \`true\`/\`undefined\`), not ` +
            `call \`next()\` (H.W1 S5).`,
    );
}

if (failures.length > 0) {
    console.error(
        `\nproof:no-deprecated-guard — FAIL (${failures.length}): the deprecated ` +
            `next() navigation guard is live in router.ts.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:no-deprecated-guard — PASS: router.ts has no deprecated next() guard (H.W1 S5).",
);
