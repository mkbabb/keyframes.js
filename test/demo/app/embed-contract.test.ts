/**
 * The cube slice's contract (`demo/app/embed/bridge.ts`, `params.ts`): the
 * host allow-list, exact-origin posts, the host message gate, and the route.
 */
import { describe, expect, it, vi } from "vitest";
import {
    EMBED_NS,
    EMBED_VERSION,
    createEmbedBridge,
    isAllowedHost,
    readHostMessage,
    resolveHostOrigin,
} from "../../../demo/app/embed/bridge";
import { parseSliceRoute } from "../../../demo/app/embed/params";

interface FakeWin {
    win: Window;
    parent: { postMessage: ReturnType<typeof vi.fn> };
    dispatch: (event: Partial<MessageEvent>) => void;
}

function framed(opts: { hostname: string; ancestor?: string; referrer?: string }): FakeWin {
    const parent = { postMessage: vi.fn() };
    let listener: ((e: MessageEvent) => void) | undefined;
    const win = {
        parent,
        location: {
            hostname: opts.hostname,
            ancestorOrigins: opts.ancestor ? [opts.ancestor] : undefined,
        },
        document: { referrer: opts.referrer ?? "" },
        addEventListener: (_: string, fn: (e: MessageEvent) => void) => (listener = fn),
        removeEventListener: () => (listener = undefined),
        requestAnimationFrame: (cb: FrameRequestCallback) => (cb(0), 1),
        cancelAnimationFrame: () => {},
    } as unknown as Window;
    return { win, parent, dispatch: (e) => listener?.(e as MessageEvent) };
}

describe("host allow-list", () => {
    it("admits daraksha.babb.dev from a deployed slice, and nothing else", () => {
        expect(isAllowedHost("https://daraksha.babb.dev", "keyframes.babb.dev")).toBe(true);
        expect(isAllowedHost("https://evil.example", "keyframes.babb.dev")).toBe(false);
        expect(isAllowedHost("http://daraksha.babb.dev", "keyframes.babb.dev")).toBe(false);
        expect(isAllowedHost("http://localhost:5173", "keyframes.babb.dev")).toBe(false);
    });
    it("admits a loopback host only when the slice itself is served from loopback", () => {
        expect(isAllowedHost("http://localhost:5173", "localhost")).toBe(true);
        expect(isAllowedHost("http://127.0.0.1:4173", "127.0.0.1")).toBe(true);
        expect(isAllowedHost("http://localhost.evil.example", "localhost")).toBe(false);
    });
    it("resolves the host from ancestorOrigins, else the referrer, and refuses an unlisted one", () => {
        expect(resolveHostOrigin(framed({ hostname: "keyframes.babb.dev", ancestor: "https://daraksha.babb.dev" }).win)).toBe(
            "https://daraksha.babb.dev",
        );
        expect(
            resolveHostOrigin(framed({ hostname: "keyframes.babb.dev", referrer: "https://daraksha.babb.dev/colour" }).win),
        ).toBe("https://daraksha.babb.dev");
        expect(resolveHostOrigin(framed({ hostname: "keyframes.babb.dev", ancestor: "https://evil.example" }).win)).toBeNull();
    });
});

describe("bridge", () => {
    it("posts every message to the host's exact origin, tagged ns and v", () => {
        const f = framed({ hostname: "keyframes.babb.dev", ancestor: "https://daraksha.babb.dev" });
        const bridge = createEmbedBridge(f.win);
        bridge.post({ type: "size", height: 320 });
        expect(f.parent.postMessage).toHaveBeenCalledWith(
            { ns: EMBED_NS, v: EMBED_VERSION, type: "size", height: 320 },
            "https://daraksha.babb.dev",
        );
    });
    it("posts nothing when not framed by an allowed host", () => {
        const f = framed({ hostname: "keyframes.babb.dev", ancestor: "https://evil.example" });
        createEmbedBridge(f.win).post({ type: "theme", scheme: "dark" });
        expect(f.parent.postMessage).not.toHaveBeenCalled();
    });
    it("takes set-theme only from the host origin and the parent window", () => {
        const f = framed({ hostname: "keyframes.babb.dev", ancestor: "https://daraksha.babb.dev" });
        const bridge = createEmbedBridge(f.win);
        const seen: string[] = [];
        bridge.onSetTheme((s) => seen.push(s));
        const data = { ns: EMBED_NS, v: EMBED_VERSION, type: "set-theme", scheme: "dark" };
        f.dispatch({ origin: "https://evil.example", source: f.parent as unknown as Window, data });
        f.dispatch({ origin: "https://daraksha.babb.dev", source: {} as Window, data });
        f.dispatch({ origin: "https://daraksha.babb.dev", source: f.parent as unknown as Window, data: { ...data, v: 2 } });
        f.dispatch({ origin: "https://daraksha.babb.dev", source: f.parent as unknown as Window, data });
        expect(seen).toEqual(["dark"]);
    });
    it("reads only contract messages", () => {
        expect(readHostMessage({ ns: EMBED_NS, v: EMBED_VERSION, type: "set-theme", scheme: "light" })).toEqual({
            type: "set-theme",
            scheme: "light",
        });
        expect(readHostMessage({ ns: EMBED_NS, v: EMBED_VERSION, type: "set-theme", scheme: "sepia" })).toBeNull();
        expect(readHostMessage("set-theme")).toBeNull();
        expect(readHostMessage({ ns: EMBED_NS, v: EMBED_VERSION, type: "set-playing", playing: true })).toEqual({
            type: "set-playing",
            playing: true,
        });
        expect(readHostMessage({ ns: EMBED_NS, v: EMBED_VERSION, type: "set-playing", playing: "yes" })).toBeNull();
    });
    it("takes set-playing only from the host origin and the parent window, and posts the transport", () => {
        const f = framed({ hostname: "keyframes.babb.dev", ancestor: "https://daraksha.babb.dev" });
        const bridge = createEmbedBridge(f.win);
        const seen: boolean[] = [];
        bridge.onSetPlaying((p) => seen.push(p));
        const data = { ns: EMBED_NS, v: EMBED_VERSION, type: "set-playing", playing: true };
        f.dispatch({ origin: "https://evil.example", source: f.parent as unknown as Window, data });
        f.dispatch({ origin: "https://daraksha.babb.dev", source: f.parent as unknown as Window, data });
        expect(seen).toEqual([true]);
        bridge.post({ type: "transport", playing: false });
        expect(f.parent.postMessage).toHaveBeenCalledWith(
            { ns: EMBED_NS, v: EMBED_VERSION, type: "transport", playing: false },
            "https://daraksha.babb.dev",
        );
    });
});

describe("route", () => {
    it("reads the cube, its skin and the scheme", () => {
        expect(parseSliceRoute("#/cube?skin=daraksha&scheme=dark")).toEqual({
            slice: "cube",
            skin: "daraksha",
            scheme: "dark",
        });
    });
    it("falls back to the crayon die and the platform scheme", () => {
        expect(parseSliceRoute("#/cube?skin=velvet&scheme=sepia")).toEqual({
            slice: "cube",
            skin: "crayon",
            scheme: null,
        });
        expect(parseSliceRoute("#/square").slice).toBeNull();
    });
});
