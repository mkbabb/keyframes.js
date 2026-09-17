/// <reference types="vite/client" />

// The `*.vue` ambient shim is NARROWED, not deleted (X.KF.W4 G-KFW4-1). `check`'s
// first leg is now `vue-tsc`, which parses every SFC and resolves it to its REAL
// type — this block is shadowed there. It survives for the ONE program that cannot
// parse an SFC: `check`'s second leg, `tsc --noEmit -p tsconfig.test.json`, whose
// include list carries this file so a `demo/scenes/**` barrel that re-exports an
// SFC (e.g. `cube/orbital-drag` → `OrbitalDrag.vue`) stays resolvable. The old
// third argument `any` made every property of every re-exported SFC unchecked in
// that program; `unknown` states what plain `tsc` can honestly know instead.
declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<
        Record<string, unknown>,
        Record<string, unknown>,
        unknown
    >;
    export default component;
}

declare module "*.svg?component" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
