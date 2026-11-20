/**
 * The cube slice's contract (`demo/app/embed/bridge.ts`, `params.ts`): the
 * host allow-list, exact-origin posts, the host message gate, and the route.
 */
import { describe, expect, it, vi } from "vitest";
import {
    EMBED_HOSTS,
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
        expect(readHostMessage({ ns: EMBED_NS, v: EMBED_VERSION, type: "reset" })).toEqual({ type: "reset" });
        expect(readHostMessage({ ns: EMBED_NS, v: 2, type: "reset" })).toBeNull();
        expect(readHostMessage({ ns: EMBED_NS, v: EMBED_VERSION, type: "set-dice", count: 2 })).toEqual({ type: "set-dice", count: 2 });
        expect(readHostMessage({ ns: EMBED_NS, v: EMBED_VERSION, type: "set-dice", count: 3 })).toBeNull();
        expect(readHostMessage({ ns: EMBED_NS, v: EMBED_VERSION, type: "throw" })).toEqual({ type: "throw" });
    });
    it("takes set-dice and throw only from the host origin and the parent window, and posts what the dice rolled", () => {
        const host = EMBED_HOSTS[0]!;
        const f = framed({ hostname: "keyframes.babb.dev", ancestor: host });
        const bridge = createEmbedBridge(f.win);
        const counts: number[] = [];
        let throws = 0;
        bridge.onSetDice((n) => counts.push(n));
        bridge.onThrow(() => throws++);
        const dice = { ns: EMBED_NS, v: EMBED_VERSION, type: "set-dice", count: 2 };
        const toss = { ns: EMBED_NS, v: EMBED_VERSION, type: "throw" };
        f.dispatch({ origin: "https://evil.example", source: f.parent as unknown as Window, data: dice });
        f.dispatch({ origin: host, source: {} as Window, data: toss });
        f.dispatch({ origin: host, source: f.parent as unknown as Window, data: dice });
        f.dispatch({ origin: host, source: f.parent as unknown as Window, data: toss });
        expect(counts).toEqual([2]);
        expect(throws).toBe(1);
        bridge.post({ type: "rolled", values: [3, 5] });
        expect(f.parent.postMessage).toHaveBeenCalledWith({ ns: EMBED_NS, v: EMBED_VERSION, type: "rolled", values: [3, 5] }, host);
        bridge.dispose();
        f.dispatch({ origin: host, source: f.parent as unknown as Window, data: toss });
        expect(throws).toBe(1);
    });
    it("takes reset only from the host origin and the parent window", () => {
        const f = framed({ hostname: "keyframes.babb.dev", ancestor: "https://daraksha.babb.dev" });
        const bridge = createEmbedBridge(f.win);
        let resets = 0;
        bridge.onReset(() => resets++);
        const data = { ns: EMBED_NS, v: EMBED_VERSION, type: "reset" };
        f.dispatch({ origin: "https://evil.example", source: f.parent as unknown as Window, data });
        f.dispatch({ origin: "https://daraksha.babb.dev", source: {} as Window, data });
        f.dispatch({ origin: "https://daraksha.babb.dev", source: f.parent as unknown as Window, data });
        expect(resets).toBe(1);
        bridge.dispose();
        f.dispatch({ origin: "https://daraksha.babb.dev", source: f.parent as unknown as Window, data });
        expect(resets).toBe(1);
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
            transport: "own",
            stage: "square",
            faces: "numerals",
            dice: 1,
        });
    });
    it("reads transport=host: the host draws the cube's transport", () => {
        expect(parseSliceRoute("#/cube?skin=daraksha&scheme=dark&transport=host").transport).toBe("host");
        expect(parseSliceRoute("#/cube?transport=elsewhere").transport).toBe("own");
    });
    it("reads stage=fill: the stage takes the frame's box", () => {
        expect(parseSliceRoute("#/cube?stage=fill").stage).toBe("fill");
        expect(parseSliceRoute("#/cube?stage=wide").stage).toBe("square");
    });
    it("reads faces=pips: the cube is marked as a die", () => {
        expect(parseSliceRoute("#/cube?faces=pips").faces).toBe("pips");
        expect(parseSliceRoute("#/cube?faces=dots").faces).toBe("numerals");
    });
    it("reads dice=2: the pair in place of the one die", () => {
        expect(parseSliceRoute("#/cube?dice=2").dice).toBe(2);
        expect(parseSliceRoute("#/cube?dice=3").dice).toBe(1);
    });
    it("falls back to the crayon die and the platform scheme", () => {
        expect(parseSliceRoute("#/cube?skin=velvet&scheme=sepia")).toEqual({
            slice: "cube",
            skin: "crayon",
            scheme: null,
            transport: "own",
            stage: "square",
            faces: "numerals",
            dice: 1,
        });
        expect(parseSliceRoute("#/square").slice).toBeNull();
    });
});
