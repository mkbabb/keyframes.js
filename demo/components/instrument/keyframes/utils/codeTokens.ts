/**
 * THE APP'S CODE INK — one table, two readers (UIA-KF-097, X.KF.W13X.r4panes).
 *
 * The keyframes editor (`CSSCodeEditor.vue`, Monaco's Monarch css grammar)
 * inks its buffer from the app's tokens in three rungs (X-DS r4 pass 5,
 * KF-C24-02): the STRUCTURE (selectors, at-rules, property names) in the
 * foreground; the VALUES and the punctuation stepped down to the muted ink;
 * ONE hue for meaning, the numbers and their units, in the identity violet.
 * Static code the app prints outside the editor (the spring scene's
 * `compileToEntry()` artifact) wears the SAME three rungs, read from this
 * table, so a property name, a value and a number look alike in both places.
 * No highlighter dependency: the editor's grammar is Monaco's (loaded only
 * with the editor), and the printed artifacts are short emitter output whose
 * lexical shape is the four classes below.
 */
export const CODE_INK = {
    structure: "var(--foreground)",
    value: "var(--muted-foreground)",
    number: "var(--color-progress)",
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

/**
 * Splits CSS into inked tokens, the Monarch css grammar's classes folded onto
 * {@link CODE_INK}'s rungs: `tag` / `keyword` / `attribute.name` → structure;
 * `attribute.value`, `string`, `comment` and every `delimiter` → value;
 * `attribute.value.number` / `.unit` → number. An identifier is a property
 * name (structure) outside a declaration value and a value inside one — a
 * declaration value runs from a `:` inside a block to its `;` or `}`. The
 * tokens' texts concatenate to the input exactly.
 */
export function tokenizeCSS(css: string): CodeToken[] {
    const out: CodeToken[] = [];
    let depth = 0;
    let inValue = false;
    for (const m of css.matchAll(LEXEME)) {
        const [text, ws, comment, str, num, at, ident] = m;
        let ink: CodeInk | null;
        if (ws !== undefined) ink = null;
        else if (comment !== undefined || str !== undefined) ink = "value";
        else if (num !== undefined) ink = "number";
        else if (at !== undefined) ink = "structure";
        else if (ident !== undefined) ink = inValue ? "value" : "structure";
        else {
            ink = "value";
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
