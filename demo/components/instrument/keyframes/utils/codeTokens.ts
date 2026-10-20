/**
 * THE APP'S CODE INK — one table, two readers (UIA-KF-097, X.KF.W13X.r4panes).
 *
 * The keyframes editor (`CSSCodeEditor.vue`, Monaco's Monarch css grammar)
 * inks its buffer from the app's tokens; static code the app prints outside
 * the editor (the spring scene's `compileToEntry()` artifact) wears the SAME
 * inks, read from this table, so a property name, a value and a number look
 * alike in both places. No highlighter dependency: the editor's grammar is
 * Monaco's (loaded only with the editor), and the printed artifacts are short
 * emitter output whose lexical shape is the classes below.
 *
 * OD19-K7 (owner 2026-10-19: "better syntax colour coding") — SIX rungs, not
 * three (KF-C24-02 folded the selectors, the at-rules, the property names and
 * the value keywords onto two neutrals, so they read alike). Every rung is an
 * app token or a `color-mix()` bridge of two (DESIGN §2: colour is named by
 * role; red stays destructive-only), on two axes: the NEUTRAL ladder carries
 * the grammar (structure → value → punctuation, stepping down) and the
 * identity VIOLET carries the meaning (the property a value lands on, the
 * numbers, and the keyframe stop the whole buffer is about). Mixing toward
 * `--foreground` keeps each rung's contrast in both theme arms.
 */
export const CODE_INK = {
    /** At-rules (`@keyframes`), selectors and the keyframes' name. */
    structure: "var(--foreground)",
    /** Property names: the violet stepped toward the foreground. */
    property: "color-mix(in oklab, var(--accent-kf) 50%, var(--foreground))",
    /** Value keywords, functions and strings: the neutral midway rung. */
    value: "color-mix(in oklab, var(--foreground) 55%, var(--muted-foreground))",
    /** Numbers with their units (and hex literals): the identity violet. */
    number: "var(--color-progress)",
    /** Keyframe stops (`0%`, `from`, `to`): the violet's strong step. */
    stop: "var(--accent-kf-strong)",
    /** Punctuation and comments: the muted ink. */
    punct: "var(--muted-foreground)",
} as const;

export type CodeInk = keyof typeof CODE_INK;

export interface CodeToken {
    text: string;
    /** `null` for whitespace, which carries no ink. */
    ink: CodeInk | null;
}

// One alternation, tried in order at each position: whitespace · comment ·
// string · number (with its unit or `%`) · at-keyword · identifier (with the
// leading `.`/`#`/`-` a selector or custom property carries) · any one other
// character (punctuation).
const LEXEME =
    /(\s+)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?(?:%|[a-zA-Z]+)?)|(@[\w-]+)|([.#]?-?-?[a-zA-Z_][\w-]*)|([\s\S])/g;

// A property name is followed by `:` and its value runs to `;` or `}` before
// any `{` — the Monarch grammar's own test (`selectorbody`), so `a:hover {` is
// a selector and `opacity: 0;` a declaration.
const DECLARATION_AHEAD = /^\s*:[^{;}]*[;}]/;

/**
 * Splits CSS into inked tokens, the Monarch css grammar's classes folded onto
 * {@link CODE_INK}'s rungs (the editor's theme rules name the same folding):
 * `keyword` / `tag` → structure; `attribute.name` → property;
 * `attribute.value` and `string` → value; `attribute.value.number` / `.unit`
 * / `.hex` → number; `keyframe.stop` → stop; `delimiter` and `comment` →
 * punct. Outside a declaration value, a number or a `from`/`to` inside a block
 * is a keyframe stop and an identifier is a property name when a declaration
 * follows it, else a selector. The tokens' texts concatenate to the input
 * exactly.
 */
export function tokenizeCSS(css: string): CodeToken[] {
    const out: CodeToken[] = [];
    let depth = 0;
    let inValue = false;
    for (const m of css.matchAll(LEXEME)) {
        const [text, ws, comment, str, num, at, ident] = m;
        let ink: CodeInk | null;
        if (ws !== undefined) ink = null;
        else if (comment !== undefined) ink = "punct";
        else if (str !== undefined) ink = "value";
        else if (num !== undefined) ink = inValue || depth === 0 ? "number" : "stop";
        else if (at !== undefined) ink = "structure";
        else if (ident !== undefined) {
            if (inValue) ink = "value";
            else if (depth > 0 && DECLARATION_AHEAD.test(css.slice(m.index + text.length)))
                ink = "property";
            else if (depth > 0 && (text === "from" || text === "to")) ink = "stop";
            else ink = "structure";
        } else {
            ink = "punct";
            if (text === "{") depth += 1;
            else if (text === "}") {
                depth = Math.max(0, depth - 1);
                inValue = false;
            } else if (text === ":" && depth > 0) inValue = true;
            else if (text === ";") inValue = false;
        }
        const last = out[out.length - 1];
        if (last && last.ink === ink) last.text += text;
        else out.push({ text, ink });
    }
    return out;
}
