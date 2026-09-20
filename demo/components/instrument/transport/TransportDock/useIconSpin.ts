import { onScopeDispose, type Ref } from "vue";
import { kfEngine } from "@kf-engine";

/**
 * X.KF.W13.b · TD-1 + TD-4 + TD-17 (+ PRM) — the Reset glyph's twist.
 *
 * TD-1: the former `resolveElement` tested the HTML-element class twice against
 * a functional-lucide template ref, which is the `SVGSVGElement` itself — both
 * branches were dead and the transport's only keyframes.js consumption never
 * ran. The engine's target contract is `HTMLElement` (`setTargets`), so
 * the cure honours it instead of casting past it: the SFC lands the ref on an
 * HTMLElement host wrapping the glyph and PASSES it in (TD-17 — the composable
 * no longer binds a template ref by a hard-coded string with an unhonourable
 * generic; the SFC that owns the template owns the typed ref).
 *
 * TD-4: the animation was built at setup — `kfEngine()` plus a full
 * `fromString` parse on every transport mount, for a spin that may never be
 * pressed — and never torn down. It is now built on the FIRST spin, memoised for
 * the scope's life, and `stop()`ped on scope dispose so a mid-spin unmount halts
 * the draw loop (the same accounting KF.W12 gave the parse-error shake).
 *
 * PRM: `respectReducedMotion` is stated explicitly (the engine's honest default
 * since KF-KC-27) — under an active reduce query `play()` snaps to the final,
 * identity pose and runs no rAF loop.
 */
type Twist = InstanceType<ReturnType<typeof kfEngine>["CSSKeyframesAnimation"]>;

const TWIST_KEYFRAMES = /*css*/ `@keyframes twist {
    0% { transform: perspective(200px) rotateY(0deg) scale(1); }
    40% { transform: perspective(200px) rotateY(-180deg) scale(0.85); }
    100% { transform: perspective(200px) rotateY(-360deg) scale(1); }
}`;

const buildTwist = (): Twist => {
    const { CSSKeyframesAnimation } = kfEngine();
    return new CSSKeyframesAnimation({
        duration: 400,
        timingFunction: "easeOutCubic",
        respectReducedMotion: true,
    }).fromString(TWIST_KEYFRAMES);
};

export function useIconSpin(iconHost: Readonly<Ref<HTMLElement | null>>) {
    let twist: Twist | null = null;

    const resetIconSpin = () => {
        const host = iconHost.value;
        if (!host) return;
        twist ??= buildTwist();
        twist.setTargets(host);
        twist.reset();
        void twist.play();
    };

    onScopeDispose(() => {
        twist?.stop();
        twist = null;
    });

    return { resetIconSpin };
}
