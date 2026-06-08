// proof:typing-dots isolation harness — mounts the REAL TypingDots.vue SFC
// (the same component EditorStartScreen renders for the hero "...") with NO
// router, NO scene FSM, NO design-language cascade. This is the WV-W6-HIGH-1
// route-free mount: the home route cannot mount the dots pre-render (the D12
// storm unmounts home in <1 rAF), so the gate drives the component directly.
//
// The component is imported through the SAME `@components` alias + `@src`
// engine alias the demo uses (the gate's vite build re-declares them), so the
// gate exercises the production code path — the per-dot CSSKeyframesAnimation
// loop, the stagger() delay distribution, the steppedEase cadence — exactly as
// it runs in the hero.
import { createApp, h } from "vue";
import TypingDots from "@components/custom/TypingDots.vue";

createApp({ render: () => h(TypingDots) }).mount("#app");
