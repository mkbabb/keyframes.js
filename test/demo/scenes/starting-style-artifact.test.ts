/**
 * X.KF.W11.g — G-KFW11-6's witness (the spring artifact-truth packet).
 *
 * Born RED against `c8e3c56a` (`No test files found`, double-run). The gate's
 * two clauses are *"the endpoints/polarity/duration/case-fidelity assertions
 * pass and the refusal path is reachable"* plus the `aria-expanded`/
 * `aria-pressed` byte clause; the rows are `kf-StartingStyleTarget.md`'s own.
 *
 * THE INSTRUMENT. The panel's whole charter is that a designer pastes the
 * artifact verbatim to reproduce the card beside it. That promise was false on
 * five counts (KF-SST-3) because nothing bound the two halves: no shared
 * constant, token, TEST or type (KF-SST-4). This file is the test half of that
 * binding, and it is deliberately built the only honest way round — **the
 * expectation is PARSED OUT OF THE SHIPPED EMITTER'S OWN OUTPUT**, never
 * hard-coded here. `useCompiledEntry` is run for real (the same composable the
 * scene mounts, through the same dynamically imported engine chunk), the CSS it
 * publishes is parsed, and the card is required to match it: its exported
 * `ENTRY_CONTRACT`, its scoped `<style>`, and its live markup. A change on
 * either side of the seam fails here instead of drifting silently.
 *
 * WHY THE SFC IS READ AS BYTES. Two of the three surfaces cannot be read any
 * other way: `<style scoped>` is never applied in jsdom, and the SFC's named
 * export is not typable in `check`'s second leg (`tsc -p tsconfig.test.json`
 * resolves `*.vue` through `demo/env.d.ts`'s narrowed shim, which declares a
 * default export only — widening it is another unit's byte). Reading the source
 * is the idiom this suite already owns (`spring-derby-truth.test.ts`), and it
 * pins the constant's literal bytes as well as its value.
 *
 * KF-SST-10 rides here as a WITNESS ONLY, per the wave's OP-5: the
 * facility-honesty cure is KF-ES-2's spec and had not landed at this unit's
 * open, so the Entry channel's targetlessness is pinned by an assertion rather
 * than cured — when the cure lands, this case is what proves it.
 */
import { beforeAll, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { mount } from "@vue/test-utils";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * THE PRODUCER REALM WALL, answered the way this suite already answers it.
 *
 * `@mkbabb/glass-ui`'s dist imports `@mkbabb/keyframes.js` from inside
 * `node_modules`, where vitest's alias does not reach (the package never
 * installs itself), so any spec that loads a glass entry dies at `Cannot find
 * package '@mkbabb/keyframes.js'` before an assertion runs. The durable cure is
 * a runner change — inlining the producer so the alias applies — and
 * `vitest.config.ts` is outside this unit's §Bounds, so it is NOT reached for.
 * The idiom is `CSSPasteDialog.test.ts`'s, verbatim in shape: the producer's
 * primitives become SLOT-RENDERING stubs so the SUBJECT's own template,
 * bindings, classes and attributes all execute for real. Nothing under test is
 * mocked — the card, its state model, its contract and both verbs are the real
 * component; what is not characterized here is glass's own rendering, which is
 * glass-ui's to test.
 */
const stub = vi.hoisted(() => ({
    /** `{ ExportName: "html-tag" }` → a module of slot-rendering stubs. */
    module: async (entries: Record<string, string>) => {
        const { defineComponent, h } = await import("vue");
        return Object.fromEntries(
            Object.entries(entries).map(([name, tag]) => [
                name,
                defineComponent({
                    name,
                    inheritAttrs: false,
                    setup: (_props, { slots, attrs }) =>
                        () =>
                            h(tag, { ...attrs, "data-stub": name }, slots.default?.()),
                }),
            ]),
        );
    },
}));

vi.mock("@mkbabb/glass-ui/button", () => stub.module({ Button: "button" }));
vi.mock("@mkbabb/glass-ui/card", () =>
    stub.module({
        Card: "div",
        CardHeader: "header",
        CardTitle: "h2",
    }),
);
vi.mock("@mkbabb/glass-ui/tooltip", () =>
    stub.module({ Tooltip: "div", TooltipContent: "div", TooltipTrigger: "div" }),
);

import StartingStyleTarget from "../../../demo/scenes/spring/StartingStyleTarget.vue";
import { useCompiledEntry } from "../../../demo/scenes/spring/useCompiledEntry";
import { SPRING_DEMO_KEY } from "../../../demo/scenes/spring/springKeys";
import { warmKfEngine } from "../../../demo/kf-engine";
import { withSetup } from "../../support/withSetup";

const SFC_PATH = "demo/scenes/spring/StartingStyleTarget.vue";
const SFC_SRC = readFileSync(resolve(process.cwd(), SFC_PATH), "utf8");
const SFC_STYLE = SFC_SRC.slice(SFC_SRC.indexOf("<style scoped>"));
const SFC_TEMPLATE = SFC_SRC.slice(0, SFC_SRC.indexOf("</template>"));

// ─── CSS reading helpers (shared by the emitted artifact and the SFC) ─────────

/** The declarations of the first rule whose selector is EXACTLY `selector`. */
function declarations(css: string, selector: string): Record<string, string> {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = new RegExp(`(?:^|\\n)\\s*${escaped}\\s*\\{([^}]*)\\}`).exec(css);
    if (match === null) throw new Error(`no rule for \`${selector}\` in the css read`);
    return parseDeclarations(match[1]!);
}

/** The declarations of the one rule inside `@starting-style`, with its selector. */
function startingStyleRule(css: string): { selector: string; decls: Record<string, string> } {
    const match = /@starting-style\s*\{\s*([^{]+?)\s*\{([^}]*)\}/.exec(css);
    if (match === null) throw new Error("no `@starting-style` rule in the css read");
    return { selector: match[1]!.trim(), decls: parseDeclarations(match[2]!) };
}

function parseDeclarations(body: string): Record<string, string> {
    const out: Record<string, string> = {};
    for (const raw of body.replace(/\/\*[\s\S]*?\*\//g, "").split(";")) {
        const at = raw.indexOf(":");
        if (at === -1) continue;
        out[raw.slice(0, at).trim()] = raw.slice(at + 1).trim();
    }
    return out;
}

// ─── The demo context this Target reads (the five members it injects) ─────────

function stubDemo(compiledCss: string) {
    const visible = ref(true);
    return {
        visible,
        toggleDiscrete: () => {
            visible.value = !visible.value;
        },
        response: ref(0.5),
        dampingFraction: ref(0.825),
        compiledEntryCss: ref(compiledCss),
    };
}

function mountTarget(demo: ReturnType<typeof stubDemo>) {
    return mount(StartingStyleTarget, {
        global: { provide: { [SPRING_DEMO_KEY as symbol]: demo } },
    });
}

/** A non-empty artifact that does NOT describe this card — the refusal input. */
const FOREIGN_ARTIFACT = `.some-other-thing {
  opacity: 0;
  transform: none;
  transition: opacity 250ms linear;
}`;

describe("X.KF.W11.g — the @starting-style artifact tells the truth", () => {
    /** The REAL artifact, from the REAL composable, through the REAL engine. */
    let artifactCss = "";
    let entryTargets = -1;
    let entryName = "";

    beforeAll(async () => {
        await warmKfEngine();
        const [entry, app] = withSetup(() =>
            useCompiledEntry(
                () => 0.5,
                () => 0.825,
            ),
        );
        try {
            // `useCompiledEntry` awaits the engine chunk then the compile; poll
            // the ref it fills rather than guessing an await count.
            for (let i = 0; i < 200 && entry.css.value === ""; i++) {
                await new Promise((r) => setTimeout(r, 5));
            }
            artifactCss = entry.css.value;
            const anim = entry.entryAnim as unknown as {
                targets?: unknown[];
                name?: string;
            };
            entryTargets = anim.targets?.length ?? -1;
            entryName = anim.name ?? "";
        } finally {
            app.unmount();
        }
        expect(artifactCss, "the shipped emitter produced no artifact").not.toBe("");
    }, 20_000);

    // ── (1) ENDPOINTS — the card's declared contract IS the artifact's ────────
    it("the exported contract carries the endpoints the emitter actually publishes", () => {
        const base = declarations(artifactCss, ".discrete-card");
        const open = declarations(artifactCss, ".discrete-card.is-open");

        // Sanity on the publisher itself before it is used as an oracle.
        expect(base.display).toBe("none");
        expect(open.display).toBe("flex");

        // Every endpoint the artifact declares appears verbatim in the SFC's
        // `ENTRY_CONTRACT` literal — nothing here is written by hand.
        expect(SFC_SRC).toContain(`opacity: "${base.opacity}"`);
        expect(SFC_SRC).toContain(`transform: "${base.transform}"`);
        expect(SFC_SRC).toContain(`opacity: "${open.opacity}"`);
        expect(SFC_SRC).toContain(`transform: "${open.transform}"`);
        expect(SFC_SRC).toContain(`display: "${open.display}"`);
        expect(SFC_SRC).toContain(`openSelector: ".is-open"`);
    });

    it("the card's own CSS renders those same endpoints, on both states", () => {
        const artifactBase = declarations(artifactCss, ".discrete-card");
        const artifactOpen = declarations(artifactCss, ".discrete-card.is-open");
        const cardBase = declarations(SFC_STYLE, ".discrete-card");
        const cardOpen = declarations(SFC_STYLE, ".discrete-card.is-open");

        expect(cardBase.opacity).toBe(artifactBase.opacity);
        expect(cardBase.transform).toBe(artifactBase.transform);
        expect(cardBase.display).toBe(artifactBase.display);
        expect(cardOpen.opacity).toBe(artifactOpen.opacity);
        expect(cardOpen.transform).toBe(artifactOpen.transform);
        expect(cardOpen.display).toBe(artifactOpen.display);
    });

    // ── (2) POLARITY — base CLOSED, `.is-open` opens, in CSS and in markup ────
    it("the polarity is the artifact's, in the stylesheet", () => {
        const artifactEntry = startingStyleRule(artifactCss);
        const cardEntry = startingStyleRule(SFC_STYLE);

        expect(cardEntry.selector).toBe(artifactEntry.selector);
        expect(cardEntry.decls.opacity).toBe(artifactEntry.decls.opacity);
        expect(cardEntry.decls.transform).toBe(artifactEntry.decls.transform);

        // The inverted polarity is gone, not merely out-voted: the card used to
        // run base=OPEN with an `.is-hidden` exit state the artifact never named.
        // (Read over the template and the stylesheet — the docblock that RECORDS
        // the retired polarity is allowed to name it.)
        expect(SFC_TEMPLATE).not.toContain("is-hidden");
        expect(SFC_STYLE).not.toContain("is-hidden");
    });

    it("the polarity is live in the markup: `.is-open` tracks the disclosure", async () => {
        const demo = stubDemo(artifactCss);
        const wrapper = mountTarget(demo);
        try {
            const card = wrapper.get(".discrete-card");
            expect(card.classes()).toContain("is-open");

            demo.toggleDiscrete();
            await wrapper.vm.$nextTick();
            expect(wrapper.get(".discrete-card").classes()).not.toContain("is-open");
        } finally {
            wrapper.unmount();
        }
    });

    // ── (3) DURATION — one number, and it is the artifact's ───────────────────
    it("the card transitions for exactly as long as the artifact says", () => {
        const artifactBase = declarations(artifactCss, ".discrete-card");
        const duration = /(\d+)ms/.exec(artifactBase.transition ?? "")?.[1];
        expect(duration, "the artifact declared no duration").toBeDefined();

        const cardBase = declarations(SFC_STYLE, ".discrete-card");
        const cardDurations = new Set(
            [...(cardBase.transition ?? "").matchAll(/(\d+)ms/g)].map((m) => m[1]),
        );
        // One duration, three numbers was the banked defect (KF-SST-26): the
        // card must speak ONE, and it must be the published one.
        expect([...cardDurations]).toEqual([duration]);
        expect(SFC_SRC).toContain(`durationMs: ${duration}`);
    });

    // ── (4) CASE FIDELITY — rendered text IS copied text, in a case-safe rung ─
    it("what the panel renders is byte-identical to what it copies", () => {
        const wrapper = mountTarget(stubDemo(artifactCss));
        try {
            const code = wrapper.get("code.artifact");
            const copy = wrapper.findComponent({ name: "CopyButton" });
            expect(copy.exists()).toBe(true);
            expect(code.element.textContent).toBe(artifactCss);
            expect(copy.props("text")).toBe(artifactCss);
            // The copy control names what it copies (KF-SST-29).
            expect(copy.props("label")).toMatch(/artifact/i);
        } finally {
            wrapper.unmount();
        }
    });

    it("the artifact is displayed in the case-preserving mono rung", () => {
        const wrapper = mountTarget(stubDemo(artifactCss));
        try {
            const code = wrapper.get("code.artifact");
            // `text-mono-caption` ships `text-transform: uppercase`; CSS class
            // selectors and custom idents are case-sensitive, so on this surface
            // an uppercase register makes READ ≠ COPY (KF-SST-5).
            expect(code.classes()).toContain("text-mono-small");
            expect(code.classes()).not.toContain("text-mono-caption");
        } finally {
            wrapper.unmount();
        }
    });

    // ── (5) REACHABLE — the one element meant to be READ can be read ──────────
    it("the artifact is a named, focusable region", () => {
        const wrapper = mountTarget(stubDemo(artifactCss));
        try {
            const code = wrapper.get("code.artifact");
            expect(code.attributes("tabindex")).toBe("0");
            expect(code.attributes("role")).toBe("region");
            const labelledBy = code.attributes("aria-labelledby");
            expect(labelledBy).toBeTruthy();
            expect(wrapper.get(`[id="${labelledBy}"]`).text()).toContain(
                "compileToEntry",
            );
        } finally {
            wrapper.unmount();
        }
    });

    // ── (6) THE REFUSAL PATH — reachable, and it refuses ──────────────────────
    it("an artifact that does not describe this card is REFUSED, not presented", () => {
        const wrapper = mountTarget(stubDemo(FOREIGN_ARTIFACT));
        try {
            expect(wrapper.find("code.artifact").exists()).toBe(false);
            expect(wrapper.findComponent({ name: "CopyButton" }).exists()).toBe(false);
            const status = wrapper.get('[role="status"]');
            expect(status.text()).toMatch(/does not describe the card/i);
            // The foreign text is never shown under the artifact's own label.
            expect(wrapper.text()).not.toContain("some-other-thing");
        } finally {
            wrapper.unmount();
        }
    });

    it("an absent artifact says so instead of copying a different string", () => {
        const wrapper = mountTarget(stubDemo(""));
        try {
            expect(wrapper.find("code.artifact").exists()).toBe(false);
            expect(wrapper.findComponent({ name: "CopyButton" }).exists()).toBe(false);
            expect(wrapper.get('[role="status"]').text()).toMatch(/no artifact yet/i);
            // The banked defect: the panel displayed `springCss` while the
            // clipboard carried `copyableCss` — two strings, one label,
            // describing neither (KF-SST-11).
            expect(SFC_SRC).not.toMatch(/const copyableCss/);
        } finally {
            wrapper.unmount();
        }
    });

    // ── (7) THE VERB HAS A STATE (the G-KFW11-6 byte clause, as behaviour) ────
    it("the surviving verb publishes which way the boolean sits", async () => {
        const demo = stubDemo(artifactCss);
        const wrapper = mountTarget(demo);
        try {
            const button = wrapper.get("button[aria-expanded]");
            expect(button.attributes("aria-expanded")).toBe("true");
            expect(button.attributes("data-state")).toBe("on");

            // The control names the region it controls, and the region is there.
            const controls = button.attributes("aria-controls");
            expect(controls).toBeTruthy();
            expect(wrapper.get(`[id="${controls}"]`).classes()).toContain(
                "discrete-card",
            );

            await button.trigger("click");
            expect(wrapper.get("button[aria-expanded]").attributes("aria-expanded")).toBe(
                "false",
            );
            expect(wrapper.get("button[aria-expanded]").attributes("data-state")).toBe(
                "off",
            );
            expect(demo.visible.value).toBe(false);
        } finally {
            wrapper.unmount();
        }
    });

    // ── (8) KF-SST-10 — WITNESS ONLY (OP-5 unlanded at this unit's open) ──────
    it("WITNESS: the transport's `Entry` channel is still targetless", () => {
        // The facility's own contract says a present channel PAINTS. This one is
        // selectable and scrubbable over `targets: []`, so it is honest as a view
        // switch and false as a channel. The cure is KF-ES-2's spec (the shell's
        // wave); this unit consumes it BY REFERENCE and pins the state instead.
        expect(entryName).toBe("Entry");
        expect(entryTargets).toBe(0);
    });
});
