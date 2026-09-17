/**
 * aurora-opacity-ceiling — KF-HA-4's missing oracle (X.KF.W4 `.d`).
 *
 * OD-2 AMENDED the hero aurora with an owner verbatim — "I like the aurora,
 * but more subtle" — and the P-HERO prototype's `opacityCeiling` 0.15 became
 * the CEILING, not the target. HeroAurora encodes the blessed bound as
 * `HERO_AURORA_OPACITY_CEILING` and hands it to glass-ui's Aurora primitive.
 * The citation that claimed to assert it (`proof:cursor-light-subtle`) named
 * no executable: the bound shipped with NO gate behind it, and raising it past
 * the amendment red nothing.
 *
 * Two clauses:
 *
 *   (1) THE BOUND — the blessed literal is STRICTLY below the P-HERO 0.15
 *       ceiling. The 0.15 is the OWNER's number, external to the component;
 *       the literal is the component's own export. BITE: raise the ceiling to
 *       0.15 or past it and this reds.
 *   (2) THE BINDING — the MOUNTED component hands exactly that value to
 *       Aurora's `opacity-ceiling` prop. BITE: leave the constant alone and
 *       hard-code a different number in the template (or drop the binding) and
 *       this reds. A literal asserted without its binding is a number nobody
 *       renders.
 *
 * The bound is read from the component's own `export const` — a `<script setup>`
 * compile-local is unreachable to every instrument in the repo, so a gate over
 * one could only be a source-text pin, the shape G-L7 rule (e) forbids. The
 * binding is read off a real mount, never off source text.
 *
 * glass-ui's Aurora is a WebGL primitive and its dist self-imports
 * `@mkbabb/keyframes.js` (unresolvable from inside `node_modules/@mkbabb/`), so
 * the VENDOR is stubbed at its own module seam — it is not the subject. What is
 * measured is entirely ours: the value HeroAurora binds.
 */
import { describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h } from "vue";

/** What the real component handed the vendor primitive. */
const received: { opacityCeiling?: unknown; renderMode?: unknown } = {};

vi.mock("@mkbabb/glass-ui/aurora", () => ({
    Aurora: defineComponent({
        name: "AuroraStub",
        props: {
            config: { type: Object, default: () => ({}) },
            opacityCeiling: { type: Number, default: undefined },
            runtimeOptions: { type: Object, default: () => ({}) },
            renderMode: { type: String, default: undefined },
        },
        setup(props) {
            return () => {
                received.opacityCeiling = props.opacityCeiling;
                received.renderMode = props.renderMode;
                return h("div", { class: "aurora-stub" });
            };
        },
    }),
    PAPER_WASH_GROUND: {},
    resolveAtoms: (atoms: unknown) => atoms,
}));

const { default: HeroAurora, HERO_AURORA_OPACITY_CEILING } =
    await import("@components/instrument/shell/HeroAurora.vue");

/** The P-HERO prototype's ceiling — the OWNER's number, external to the code. */
const P_HERO_CEILING = 0.15;

describe("HeroAurora — the OD-2 subtlety bound", () => {
    it("(1) the blessed ceiling is STRICTLY below the P-HERO 0.15 ceiling", () => {
        expect(typeof HERO_AURORA_OPACITY_CEILING).toBe("number");
        expect(HERO_AURORA_OPACITY_CEILING).toBeGreaterThan(0);
        expect(HERO_AURORA_OPACITY_CEILING).toBeLessThan(P_HERO_CEILING);
    });

    it("(2) the MOUNTED component binds that exact value to Aurora's opacity ceiling", () => {
        const host = document.createElement("div");
        document.body.appendChild(host);
        const app = createApp(HeroAurora);
        app.mount(host);
        try {
            expect(host.querySelector(".aurora-stub")).not.toBeNull();
            expect(received.opacityCeiling).toBe(HERO_AURORA_OPACITY_CEILING);
            expect(received.opacityCeiling as number).toBeLessThan(
                P_HERO_CEILING,
            );
        } finally {
            app.unmount();
            host.remove();
        }
    });
});
