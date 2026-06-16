import {
    defineComponent,
    h,
    markRaw,
    onMounted,
    ref,
    shallowRef,
    watch,
    type PropType,
    type SlotsType,
} from "vue";
import {
    loadAnimationEngine,
    type CSSKeyframesAnimation,
    type InputAnimationOptions,
    type Vars,
} from "@mkbabb/keyframes.js";
import { useKfAnimation } from "./useKfAnimation";

/**
 * <Keyframes :css :options v-slot="{ t, started, reversed }"> — the on-brand
 * declarative primitive (K.W12 ED-2, the HEADLINE of the Vue adapter).
 *
 * Takes a CSS `@keyframes` STRING — kf's unique axis-1, the author's source
 * format — and animates the host element, exposing the scalar progress `t` (and
 * `started`/`reversed`) through the default slot. THIS is the one adapter a
 * Motion/`vueuse-motion` adapter CANNOT write: no other engine parses author
 * CSS `@keyframes` as its source (ecosystem-distribution.md §2.2).
 *
 * It reaches the heavy engine through the PUBLIC `loadAnimationEngine()`
 * boundary (an `await` at mount), never the raw chunk — the adapter consumes the
 * PUBLISHED `@mkbabb/keyframes.js` barrel, the static/dynamic boundary intact.
 *
 * The render is a single wrapper element (default `<div>`, override with `:as`)
 * carrying the host the animation targets; the slot receives the reactive
 * progress via the `useKfAnimation` settle-and-pause kernel.
 */
export const Keyframes = defineComponent({
    name: "Keyframes",
    props: {
        /** A CSS `@keyframes` string (the author's source format). */
        css: { type: String as PropType<string>, required: true },
        /** Animation options forwarded to the engine (duration, easing, …). */
        options: {
            type: Object as PropType<Partial<InputAnimationOptions>>,
            default: () => ({}),
        },
        /** Autoplay on mount / on css change (default true). */
        autoplay: { type: Boolean, default: true },
        /** The wrapper tag the animation targets (default "div"). */
        as: { type: String as PropType<string>, default: "div" },
    },
    slots: Object as SlotsType<{
        default: { t: number; started: boolean; reversed: boolean };
    }>,
    setup(props, { slots }) {
        const host = ref<HTMLElement | null>(null);
        // The engine animation is markRaw — Vue must not proxy the rAF-driven
        // internal state (the un-proxied object the kernel polls).
        const anim = shallowRef<CSSKeyframesAnimation<Vars> | null>(null);

        const state = useKfAnimation(
            () => anim.value ?? ({ effectiveT: 0, started: false, reversed: false } as never),
        );

        async function build() {
            if (!host.value) return;
            const { CSSKeyframesAnimation } = await loadAnimationEngine();
            const a = markRaw(
                new CSSKeyframesAnimation(props.options, host.value).fromString(
                    props.css,
                ),
            );
            anim.value = a;
            state.wake();
            if (props.autoplay) a.play();
        }

        onMounted(build);
        // Rebuild when the authored CSS changes (the source-of-truth swap).
        watch(
            () => props.css,
            () => {
                anim.value?.stop?.();
                anim.value = null;
                void build();
            },
        );

        return () =>
            h(props.as, { ref: host }, [
                slots.default?.({
                    t: state.t.value,
                    started: state.started.value,
                    reversed: state.reversed.value,
                }),
            ]);
    },
});

export default Keyframes;
