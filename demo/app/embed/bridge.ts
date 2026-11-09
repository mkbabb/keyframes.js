/**
 * The embed contract, `babb-embed` v1: one slice of this app, framed by a host
 * on an allow-listed origin (daraksha.babb.dev). value.js's picker and gradient
 * slices speak the same contract from their own copy of this module.
 *
 * Every message carries `ns` and `v`. Every post names the host's exact origin,
 * never a wildcard, and every message received is checked against the same
 * allow-list and against the parent window as its source.
 *
 *   slice → host   ready {slice, scheme, width, height} · size {height} (≤ 1 per
 *                  frame) · theme {scheme} (the acknowledgement) · color {css} ·
 *                  transport {playing} (the cube's Play / Pause, on each change)
 *   host → slice   set-theme {scheme} · set-playing {playing} (a host that
 *                  mirrors the cube's transport in its own chrome; optional)
 */

export const EMBED_NS = "babb-embed";
export const EMBED_VERSION = 1;

export type Scheme = "light" | "dark";

/** The hosts allowed to frame a slice in production. */
export const EMBED_HOSTS: readonly string[] = ["https://daraksha.babb.dev"];

const LOOPBACK_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/;
const LOOPBACK_HOST = /^(localhost|127\.0\.0\.1)$/;

/**
 * Whether `origin` may host a slice served from `sliceHostname`. A slice served
 * from loopback (the dev server, a local preview) also accepts a loopback host;
 * a deployed slice accepts the listed hosts only.
 */
export function isAllowedHost(origin: string, sliceHostname: string): boolean {
    if (EMBED_HOSTS.includes(origin)) return true;
    return LOOPBACK_HOST.test(sliceHostname) && LOOPBACK_ORIGIN.test(origin);
}

/** The framing host's origin, or null when the page is not framed by an allowed host. */
export function resolveHostOrigin(win: Window): string | null {
    if (win.parent === win) return null;
    const ancestor = win.location.ancestorOrigins?.[0];
    let origin = ancestor ?? null;
    if (!origin && win.document.referrer) {
        try {
            origin = new URL(win.document.referrer).origin;
        } catch {
            origin = null;
        }
    }
    return origin && isAllowedHost(origin, win.location.hostname) ? origin : null;
}

export type SliceMessage =
    | { type: "ready"; slice: string; scheme: Scheme; width: number; height: number }
    | { type: "size"; height: number }
    | { type: "theme"; scheme: Scheme }
    | { type: "color"; css: string }
    | { type: "transport"; playing: boolean };

export type HostMessage =
    | { type: "set-theme"; scheme: Scheme }
    | { type: "set-playing"; playing: boolean };

/** Parse a host message; anything outside the contract is null. */
export function readHostMessage(data: unknown): HostMessage | null {
    if (typeof data !== "object" || data === null) return null;
    const m = data as Record<string, unknown>;
    if (m.ns !== EMBED_NS || m.v !== EMBED_VERSION) return null;
    if (m.type === "set-theme" && (m.scheme === "light" || m.scheme === "dark")) {
        return { type: "set-theme", scheme: m.scheme };
    }
    if (m.type === "set-playing" && typeof m.playing === "boolean") {
        return { type: "set-playing", playing: m.playing };
    }
    return null;
}

export interface EmbedBridge {
    /** The host's origin, or null when the slice is not framed by an allowed host. */
    readonly hostOrigin: string | null;
    post(message: SliceMessage): void;
    /** Report `el`'s block size, at most once per frame, while it changes. */
    observeSize(el: Element): void;
    onSetTheme(handler: (scheme: Scheme) => void): void;
    onSetPlaying(handler: (playing: boolean) => void): void;
    dispose(): void;
}

export function createEmbedBridge(win: Window = window): EmbedBridge {
    const hostOrigin = resolveHostOrigin(win);
    const themeHandlers = new Set<(scheme: Scheme) => void>();
    const playingHandlers = new Set<(playing: boolean) => void>();
    let observer: ResizeObserver | undefined;
    let frame = 0;
    let lastHeight = -1;

    const post = (message: SliceMessage) => {
        if (hostOrigin === null) return;
        win.parent.postMessage({ ns: EMBED_NS, v: EMBED_VERSION, ...message }, hostOrigin);
    };

    const onMessage = (event: MessageEvent) => {
        if (hostOrigin === null || event.origin !== hostOrigin || event.source !== win.parent) return;
        const message = readHostMessage(event.data);
        if (message?.type === "set-theme") for (const handler of themeHandlers) handler(message.scheme);
        if (message?.type === "set-playing") for (const handler of playingHandlers) handler(message.playing);
    };
    win.addEventListener("message", onMessage);

    return {
        hostOrigin,
        post,
        observeSize(el) {
            if (hostOrigin === null || typeof ResizeObserver === "undefined") return;
            observer?.disconnect();
            observer = new ResizeObserver(() => {
                if (frame) return;
                frame = win.requestAnimationFrame(() => {
                    frame = 0;
                    const height = Math.ceil(el.getBoundingClientRect().height);
                    if (height === lastHeight) return;
                    lastHeight = height;
                    post({ type: "size", height });
                });
            });
            observer.observe(el);
        },
        onSetTheme(handler) {
            themeHandlers.add(handler);
        },
        onSetPlaying(handler) {
            playingHandlers.add(handler);
        },
        dispose() {
            win.removeEventListener("message", onMessage);
            observer?.disconnect();
            if (frame) win.cancelAnimationFrame(frame);
            themeHandlers.clear();
            playingHandlers.clear();
        },
    };
}
