import type { CssList, CssValue } from "@mkbabb/value.js/value";
import type { HueInterpolationMethod, SpaceId } from "@mkbabb/value.js/color";
import type { Vars } from "../../constants";
import type { InterpSlot } from "../frame/interp-slot";

export type ParsedVarMap = Record<string, CssValue>;

export type ValueTemplate =
    | Readonly<{ kind: "slot"; index: number }>
    | Readonly<{ kind: "call"; name: string; args: readonly ValueTemplate[] }>
    | Readonly<{
          kind: "list";
          separator: CssList["separator"];
          items: readonly ValueTemplate[];
      }>;

export interface CompiledValue {
    readonly template: ValueTemplate;
    readonly slots: InterpSlot[];
}

export type CompiledVarMap = Record<string, CompiledValue>;
export type AuthoredValue = number | string;
export type FlatAuthoredValues = Record<string, AuthoredValue | undefined>;

export interface AuthoredSink<V extends Vars = Vars> {
    readonly root: V;
    readonly flat: FlatAuthoredValues;
    readonly writers: readonly ValueWriter[];
}

export interface NestedAuthoredSink<V extends Vars = Vars> {
    readonly root: V;
    readonly flat: FlatAuthoredValues;
    readonly writers: readonly Readonly<{
        key: string;
        parent: Record<string, unknown>;
        leaf: string;
    }>[];
}

export interface ValueWriter {
    readonly key: string;
    readonly parent: Record<string, unknown>;
    readonly leaf: string;
    readonly value: CompiledValue;
    readonly numeric: boolean;
}

export interface CompileValueOptions {
    readonly colorSpace: SpaceId;
    readonly hueMethod?: HueInterpolationMethod;
    readonly target?: HTMLElement;
    readonly property: string;
}
