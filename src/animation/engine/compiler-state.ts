import type { FrameCompiler } from "../compile/frame-compiler";
import type { Vars } from "../constants";

const compilers = new WeakMap<object, FrameCompiler<any>>();

/** Internal compiler ownership, deliberately absent from public class shape. */
export const compilerFor = <V extends Vars>(owner: object): FrameCompiler<V> => {
    const compiler = compilers.get(owner);
    if (compiler === undefined) {
        throw new TypeError("Animation compiler state is not initialized.");
    }
    return compiler as FrameCompiler<V>;
};

/** Install or atomically transfer an animation's compiler identity. */
export const setCompilerFor = <V extends Vars>(
    owner: object,
    compiler: FrameCompiler<V>,
): void => {
    compilers.set(owner, compiler);
};
