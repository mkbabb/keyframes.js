// SERVED MODEL: claude-opus-5[1m]
/**
 * test/demo/instrument/highlight-css-roundtrip.test.ts — X.KF.W5 arm 0 (`.a`),
 * the ROUND-TRIP half of **G-XSS**.
 *
 * Subject: `useCodeHighlight`'s `setHighlightingString` sink. It received
 * prettier's PLAIN-TEXT output and wrote it through `innerHTML`
 * (`useHighlightCSS.ts:111`, `el.innerHTML = s`), which is
 *
 *   - a DOM-XSS sink reachable from a crafted `?state=` share URL ⟨KAD-1,
 *     BLOCKER — the five-hop chain `router.ts:50` → `hashSharing.ts:29-44` →
 *     `controlOptionsStore.ts:59-64` → `useKeyframesState.ts:24` →
 *     `KeyframesEditor.vue:75-80`; the CSP leg is verified CLOSED at the bank⟩,
 *     and
 *   - a silent CORRUPTOR of ordinary CSS with no attacker present ⟨KAD-2,
 *     MAJOR⟩: the HTML parser entity-decodes every `&`-sequence and swallows
 *     `<name…>` as a tag, the corrupted DOM is re-read by `highlight()` through
 *     `innerText` and folded back into the model by `onInput`, and `onSubmit`
 *     emits the corruption.
 *
 * The gate: a fixture containing `&` and `<name>` must round-trip
 * **byte-identical** through reformat → highlight → onInput → onSubmit. The
 * component path is driven exactly as `KeyframesAddDialog.vue` wires it —
 * `reformat()` calls `setHighlightingString(el, formatted)` then `highlightAll()`;
 * `onInput` emits `(e.target as HTMLElement).innerText`; `onSubmit` emits that
 * model text.
 *
 * BITE (measured against the un-cured composable before commit 1 landed):
 * restore `el.innerHTML = s` in `setHighlightingString` → the `&`/`<name>`
 * fixture returns with `<name>`/`<other>` swallowed as elements → the
 * byte-identity, the no-child and the no-`<img>` assertions all red. Restore the
 * boolean `highlighted` marker → the empty-first-open case reds, because every
 * later pass short-circuits on a marker that records only THAT a highlight ran.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, type App } from "vue";
import { useCodeHighlight } from "@components/instrument/keyframes/composables/useHighlightCSS";

/**
 * jsdom implements no `innerText` (measured: `"innerText" in HTMLElement.prototype`
 * → false at jsdom 29). It is the READER the component uses — never this gate's
 * subject, which is the WRITER — so the spec installs a `<pre>`-faithful shim for
 * its own duration: the editable surface is a `white-space: pre` block, where
 * `innerText` and `textContent` agree byte for byte. The shim is removed after the
 * file so no sibling spec inherits it.
 */
let shimInstalled = false;

beforeAll(() => {
    if (!("innerText" in HTMLElement.prototype)) {
        Object.defineProperty(HTMLElement.prototype, "innerText", {
            configurable: true,
            get(this: HTMLElement) {
                return this.textContent ?? "";
            },
            set(this: HTMLElement, value: string) {
                this.textContent = value;
            },
        });
        shimInstalled = true;
    }
});

afterAll(() => {
    if (shimInstalled) {
        Reflect.deleteProperty(HTMLElement.prototype, "innerText");
        shimInstalled = false;
    }
});

/** The editable `<pre>` surface plus a live `useCodeHighlight` bound to it. */
function mountEditor() {
    const surface = document.createElement("pre");
    surface.setAttribute("contenteditable", "true");
    document.body.appendChild(surface);

    let api!: ReturnType<typeof useCodeHighlight>;
    const host = document.createElement("div");
    document.body.appendChild(host);

    const app: App = createApp(
        defineComponent({
            setup() {
                api = useCodeHighlight(() => [surface]);
                return () => h("div");
            },
        }),
    );
    app.mount(host);

    return {
        surface,
        api,
        teardown: () => {
            app.unmount();
            host.remove();
            surface.remove();
        },
    };
}

/**
 * The composable's write is queued on the highlight.js boot promise. Awaiting the
 * same module graph the boot awaits, then crossing one macrotask boundary, drains
 * every callback queued on it — no timer faking, no sleep-and-hope.
 */
async function settleHighlight() {
    await Promise.all([
        import("highlight.js/lib/core"),
        import("highlight.js/lib/languages/css"),
    ]);
    await new Promise((resolve) => setTimeout(resolve, 0));
}

/** Wait for a highlight pass to have colourised the surface. */
async function awaitColourised(surface: HTMLElement) {
    await vi.waitFor(() => {
        expect(surface.querySelector("span")).not.toBeNull();
    });
}

/** `KeyframesAddDialog.vue` — `reformat()`: format, re-sink, re-highlight. */
async function reformat(
    api: ReturnType<typeof useCodeHighlight>,
    surface: HTMLElement,
    text: string,
    format: (raw: string) => Promise<string>,
) {
    const formatted = await format(text);
    api.setHighlightingString(surface, formatted);
    api.highlightAll();
    await awaitColourised(surface);
}

/** `KeyframesAddDialog.vue` — `onInput` then `onSubmit`: the model's own reader. */
const onInputThenSubmit = (surface: HTMLElement) => surface.innerText;

/**
 * A formatter that is already canonical: it returns its input unchanged, so any
 * delta the round trip shows belongs to the SINK and to nothing else. (The live
 * `format` is `prettier.format(css, { parser: "scss" })`, whose output is plain
 * text — which is precisely the premise KAD-2 turns on.)
 */
const identityFormat = (raw: string) => Promise.resolve(raw);

const AMPERSAND_AND_TAG = [
    "@keyframes fade {",
    '    0% { content: "a & b"; }',
    '    100% { content: "<name> & <other>"; }',
    "}",
].join("\n");

describe("useCodeHighlight — the share-URL sink round-trips byte-identical", () => {
    it("KAD-2: an `&`/`<name>` fixture survives reformat → highlight → onInput → onSubmit", async () => {
        const { surface, api, teardown } = mountEditor();
        try {
            await reformat(api, surface, AMPERSAND_AND_TAG, identityFormat);
            expect(onInputThenSubmit(surface)).toBe(AMPERSAND_AND_TAG);
        } finally {
            teardown();
        }
    });

    it("KAD-2: the reformat write itself lands as TEXT, not as parsed markup", () => {
        const { surface, api, teardown } = mountEditor();
        try {
            api.setHighlightingString(surface, AMPERSAND_AND_TAG);
            expect(surface.textContent).toBe(AMPERSAND_AND_TAG);
            // `<name>`/`<other>` are text, so the parser minted no elements.
            expect(surface.children.length).toBe(0);
        } finally {
            teardown();
        }
    });

    it("KAD-1: a crafted `?state=` payload is inert — no element, no handler", async () => {
        const { surface, api, teardown } = mountEditor();
        const payload =
            '@keyframes x { 0% { --a: <img src=x onerror="__kfXSS=1">; } }';
        try {
            api.setHighlightingString(surface, payload);
            expect(surface.querySelector("img")).toBeNull();
            expect(surface.querySelector("script")).toBeNull();
            expect(surface.textContent).toBe(payload);

            // …and it stays inert through the highlight pass the dialog runs next.
            api.highlightAll();
            await awaitColourised(surface);
            expect(surface.querySelector("img")).toBeNull();
            expect(onInputThenSubmit(surface)).toBe(payload);
        } finally {
            teardown();
        }
    });

    it("KAD-3/KAD-14(a): an empty first open does not make the session inert", async () => {
        const { surface, api, teardown } = mountEditor();
        try {
            // The dialog opens on `addKeyframes: ""` (controlOptionsStore.ts:42),
            // cleared again after every success (useKeyframeOps.ts:185).
            api.setHighlightingString(surface, "");
            api.highlightAll();
            await settleHighlight();

            // The user then TYPES into the contenteditable surface — no reformat,
            // so nothing resets a marker on the way in.
            surface.textContent = AMPERSAND_AND_TAG;
            api.highlightAll();
            await awaitColourised(surface);
            expect(onInputThenSubmit(surface)).toBe(AMPERSAND_AND_TAG);
        } finally {
            teardown();
        }
    });
});
