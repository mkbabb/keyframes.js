/// <reference types="vite/client" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// The inline-SVG reference seam (H.W5.S1, vite-svg-loader `?component` query):
// `import CubeIcon from "…cube.svg?component"` resolves to an inline-`<svg>` SFC
// whose `stroke="currentColor"` inherits the host theme color. This is the ONLY
// reference mechanism that themes — an `<img :src>` paints SVG as a replaced
// element that cannot read the host `currentColor`. The dock binds it through
// `<component :is="scene.icon" …>`, so the descriptor's `icon?: Component` is
// satisfied by this default export.
declare module "*.svg?component" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
