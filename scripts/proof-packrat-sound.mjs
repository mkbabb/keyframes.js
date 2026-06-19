// proof:packrat-sound — keyframes.js M.W10 (the consumed-packrat soundness gate).
//
// THE REAL OBSERVABLE: keyframes.js consumes @mkbabb/parse-that. Its opt-in
// packrat MEMO was unsound — keyed on parser id only, it MIS-RESTORED a cached
// result for parser P at one offset onto P at a DIFFERENT offset (silently
// corrupting any backtracking parse that re-uses a memoised parser). parse-that
// A.W2 (FIX per campaign D4 — NOT the KILL the M.W10 fork once proposed) replaced
// the id-only memo with the full Warth-Douglass-Millstein (id, offset)-keyed
// seed-grow.
//
// This gate INVOKES the installed parse-that's memoize() over the real fixtures
// and asserts the SOUND result. Born-RED on parse-that <= 0.10.0 (id-only memo);
// GREEN on 0.11.0 (the WDM fix). It runs the REAL consumed package, not a proxy.
import { memoize, regex, string, eof, resetPackrat, ParserState, Parser } from "@mkbabb/parse-that";

let failed = false;
const check = (id, ok, detail) => {
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${id}  ${detail}`);
    if (!ok) failed = true;
};

// C1 (the soundness oracle) — P = memoize([a-z]+). alt1 caches P's "hello" ending
// at offset 6, then eof() fails → backtrack to offset 0; alt2 applies P at offset
// 0 where [a-z]+ cannot match the uppercase 'X'. SOUND = ERROR (P re-runs at 0 and
// fails); the UNSOUND id-only memo wrongly restored the offset-6 "hello" at 0.
try {
    resetPackrat();
    const P = memoize(regex(/[a-z]+/));
    const p = string("X").next(P).skip(eof()).or(P);
    const st = new ParserState("Xhello!");
    p.parser(st);
    check("C1-no-cross-offset-mis-restore", st.isError === true,
        `P cached at offset 6 does NOT mis-restore at offset 0 (sound: isError=${st.isError})`);
} catch (e) {
    check("C1-no-cross-offset-mis-restore", false, `THREW: ${e.message}`);
}

// C2 — a genuine left-recursive grammar still resolves (the WDM seed-grow kept LR
// working while fixing soundness — the load-bearing concern the A.W2 fix had to
// preserve; a naive id→(id,offset) key swap breaks exactly this).
try {
    resetPackrat();
    const digits = regex(/[0-9]+/);
    const expr = memoize(Parser.lazy(() => expr.or(digits)));
    const r = expr.parse("12356");
    check("C2-left-recursion-intact", r === "12356",
        `direct left-recursion still resolves under the (id,offset) memo → "${r}"`);
} catch (e) {
    check("C2-left-recursion-intact", false, `THREW: ${e.message}`);
}

console.log(
    `\nproof:packrat-sound ${failed ? "FAIL" : "GREEN"} — the consumed parse-that packrat is (id,offset)-sound + LR-intact (A.W2 WDM fix).`,
);
process.exit(failed ? 1 : 0);
