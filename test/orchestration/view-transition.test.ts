/**
 * test/orchestration/view-transition.test.ts — the jsdom half of S.F1 VT-a: the
 * LIGHT `viewTransition` dispatch's FALLBACK + IMMEDIATE paths (p09). jsdom ships
 * no `document.startViewTransition`, so this is exactly the off-platform surface
 * — the fallback selection, the queryable `backend`, the never-rejecting handle,
 * and the ONE `withReducedMotion` PRM snap. The native-VT path + the settled-rect
 * visual-equivalence letter are the separate `proof:vt-roundtrip` browser oracle.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { viewTransition } from "../../src/animation/orchestration/view-transition";

function mount(): HTMLElement {
    const el = document.createElement("div");
    document.body.appendChild(el);
    return el;
}

beforeEach(() => {
    document.body.innerHTML = "";
});
afterEach(() => {
    vi.restoreAllMocks();
    // Restore matchMedia if a test stubbed a reduce query.
    delete (window as unknown as { matchMedia?: unknown }).matchMedia;
});

describe("S.F1 VT-a — viewTransition LIGHT dispatch (jsdom fallback + immediate)", () => {
    it("no startViewTransition + no shared pairs → backend 'immediate', mutate runs, handle settles", async () => {
        expect((document as { startViewTransition?: unknown }).startViewTransition).toBeUndefined();
        let mutated = false;
        const vt = viewTransition(() => {
            mutated = true;
        });
        expect(vt.backend).toBe("immediate"); // set SYNCHRONOUSLY at dispatch
        await vt.finished;
        expect(mutated).toBe(true);
    });

    it("fallback: 'flip' with shared pairs → backend 'flip', mutate runs before the morph", async () => {
        const from = mount();
        const to = mount();
        // Give the two elements distinct rects so flipShared has a delta to play.
        from.getBoundingClientRect = () =>
            ({ x: 0, y: 0, width: 40, height: 40, top: 0, left: 0, right: 40, bottom: 40, toJSON() {} }) as DOMRect;
        to.getBoundingClientRect = () =>
            ({ x: 200, y: 100, width: 40, height: 40, top: 100, left: 200, right: 240, bottom: 140, toJSON() {} }) as DOMRect;

        let mutated = false;
        const vt = viewTransition(
            () => {
                mutated = true;
            },
            { shared: [[from, to]], duration: 0 },
        );
        expect(vt.backend).toBe("flip");
        await vt.updateCallbackDone;
        expect(mutated).toBe(true);
        await vt.finished; // never rejects
    });

    it("fallback: 'none' → backend 'immediate' even when shared pairs are given", async () => {
        const from = mount();
        const to = mount();
        const vt = viewTransition(() => {}, {
            shared: [[from, to]],
            fallback: "none",
        });
        expect(vt.backend).toBe("immediate");
        await vt.finished;
    });

    it("fallback: a custom async runner takes over entirely (backend 'flip')", async () => {
        let ran = false;
        const vt = viewTransition(() => {}, {
            fallback: async (mutate) => {
                await mutate();
                ran = true;
            },
        });
        expect(vt.backend).toBe("flip");
        await vt.finished;
        expect(ran).toBe(true);
    });

    it("PRM: an active reduce query SNAPS through withReducedMotion → backend 'immediate'", async () => {
        // Stub the shared reduced-motion detector's matchMedia to report reduce.
        (window as unknown as { matchMedia: (q: string) => MediaQueryList }).matchMedia = (
            q: string,
        ) =>
            ({
                matches: /reduce/.test(q),
                media: q,
                onchange: null,
                addEventListener() {},
                removeEventListener() {},
                addListener() {},
                removeListener() {},
                dispatchEvent: () => false,
            }) as unknown as MediaQueryList;

        const from = mount();
        const to = mount();
        let mutated = false;
        const vt = viewTransition(
            () => {
                mutated = true;
            },
            { shared: [[from, to]], respectReducedMotion: true },
        );
        // Even with shared pairs, PRM snaps to an immediate mutate (no flip).
        expect(vt.backend).toBe("immediate");
        await vt.finished;
        expect(mutated).toBe(true);
    });

    it("native path: a stubbed startViewTransition drives backend 'view-transition' and maps the promises", async () => {
        let skipped = false;
        const nativeVT = {
            ready: Promise.resolve(),
            finished: Promise.resolve(),
            updateCallbackDone: Promise.resolve(),
            skipTransition: () => {
                skipped = true;
            },
        };
        const start = vi.fn((arg: unknown) => {
            // Exercise the typed-`update` object overload path.
            const update =
                typeof arg === "function"
                    ? (arg as () => void)
                    : (arg as { update: () => void }).update;
            update();
            return nativeVT;
        });
        (document as unknown as { startViewTransition: unknown }).startViewTransition = start;
        try {
            let mutated = false;
            const vt = viewTransition(
                () => {
                    mutated = true;
                },
                { types: ["forward"] },
            );
            expect(vt.backend).toBe("view-transition");
            expect(start).toHaveBeenCalledOnce();
            // The typed overload received { update, types }.
            expect(start.mock.calls[0]![0]).toMatchObject({ types: ["forward"] });
            await vt.ready;
            await vt.finished;
            expect(mutated).toBe(true);
            vt.skip();
            expect(skipped).toBe(true);
        } finally {
            delete (document as unknown as { startViewTransition?: unknown }).startViewTransition;
        }
    });

    it("native path: an object-overload throw degrades to the callback form (types dropped, not thrown)", async () => {
        const nativeVT = {
            ready: Promise.resolve(),
            finished: Promise.resolve(),
            updateCallbackDone: Promise.resolve(),
        };
        const start = vi.fn((arg: unknown) => {
            if (typeof arg !== "function") throw new TypeError("callback-only engine");
            (arg as () => void)();
            return nativeVT;
        });
        (document as unknown as { startViewTransition: unknown }).startViewTransition = start;
        try {
            const vt = viewTransition(() => {}, { types: ["backward"] });
            expect(vt.backend).toBe("view-transition");
            // Called twice: the object form threw, the callback form succeeded.
            expect(start).toHaveBeenCalledTimes(2);
            expect(typeof start.mock.calls[1]![0]).toBe("function");
            await vt.finished;
        } finally {
            delete (document as unknown as { startViewTransition?: unknown }).startViewTransition;
        }
    });
});
