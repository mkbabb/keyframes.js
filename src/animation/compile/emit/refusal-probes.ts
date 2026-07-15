import type { Vars } from "../../constants";
import type { CompileChild } from "./backward-walk";

export type CompileRefusalReason =
    | "weighted-blend"
    | "custom-renderer"
    | "perceptual-oklab"
    | "computed-unit-drift";

export interface CompileRefusal {
    name: string;
    reason: CompileRefusalReason;
    message: string;
}

/** Run the non-emission eligibility probes shared by every backward emitter. */
export function probeChildRefusal<V extends Vars>(
    child: CompileChild<V>,
): CompileRefusal | undefined {
    const { animation, name } = child;
    if (child.weighted) {
        return {
            name,
            reason: "weighted-blend",
            message:
                "weighted layer blend has no animation-composition equivalent " +
                "(CSS composites replace/add/accumulate only); the weighted axis is " +
                "kf's unique blend tier — the JS playback is the only faithful path",
        };
    }
    for (const frame of animation.frames) {
        if (!animation.usesDefaultRenderer(frame.transform)) {
            return {
                name,
                reason: "custom-renderer",
                message:
                    "custom renderer (a transform closure, not the default DOM-style " +
                    "renderer) cannot be expressed as CSS — the JS playback is the only faithful path",
            };
        }
    }
    for (let i = 0; i < animation.templateFrames.length; i++) {
        const declared = animation.parsedVars[i] ?? {};
        for (const [key, arr] of Object.entries(declared)) {
            if (!Array.isArray(arr) || arr.length === 0) {
                return {
                    name,
                    reason: "computed-unit-drift",
                    message:
                        `computed-unit drift on "${key}" — the declared value cannot be ` +
                        "re-emitted as a faithful authored string; the JS playback is the only faithful path",
                };
            }
        }
    }
    return undefined;
}
