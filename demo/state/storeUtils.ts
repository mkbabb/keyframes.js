import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

export const getAnimationSuperKey = (
    superKey: KeyframesAnimation<any> | string | undefined,
    animation: KeyframesAnimation<any> | string | undefined = undefined,
): string => {
    if (superKey) {
        if (typeof superKey === "string") return superKey;
        return superKey.superKey ?? "default";
    }

    if (typeof animation === "string") return animation;
    return animation!.superKey ?? "default";
};
