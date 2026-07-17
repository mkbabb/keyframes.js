/**
 * compile/value/ — the authored-value compile module (V.W5 LT-05).
 *
 * The split of the former flat `value-ast.ts` (≥3 unrelated concerns, 17
 * importers) into: `ast.ts` (the AST/sink types), `compile.ts` (the parser +
 * value compiler + serializer + `transformTargetsStyle`), and `sink.ts` (the
 * four authored-sink builders). This PURE barrel is the module's single surface
 * — all 16 cross-module importers (plus the frozen `./engine` re-export of
 * `transformTargetsStyle` at public.ts) reach it through `../compile/value`,
 * decoupled from the internal file layout. `ValueTemplate`/`ValueWriter`/
 * `CompileValueOptions` are module-internal cross-file types (no external
 * consumer) and are deliberately barrel-excluded.
 */
export type {
    AuthoredSink,
    AuthoredValue,
    CompiledValue,
    CompiledVarMap,
    FlatAuthoredValues,
    NestedAuthoredSink,
    ParsedVarMap,
} from "./ast";
export {
    compileValuePair,
    interpolateCompiledValue,
    parseAndFlattenObject,
    serializeCompiledValue,
    transformTargetsStyle,
} from "./compile";
export {
    buildAuthoredSink,
    buildNestedAuthoredSink,
    refreshAuthoredSink,
    refreshNestedAuthoredSink,
} from "./sink";
