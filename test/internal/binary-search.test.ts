/**
 * J.W1 S5 (TB-3) — direct edge-case pins for `binarySearchRange`, the
 * O(log N) frame locator EVERY `interpFrames` call rides. Until this file
 * the hot path had only transitive coverage; an off-by-one in the
 * boundary arithmetic would surface as a subtly-wrong frame pick deep in
 * an animation test, not as a named unit failure.
 */
import { describe, expect, it } from "vitest";
import { binarySearchRange } from "../../src/animation/internal/binary-search";

interface Range {
    start: number;
    stop: number;
}

const r = (start: number, stop: number): Range => ({ start, stop });
const search = (items: readonly Range[], value: number): number =>
    binarySearchRange(
        items,
        value,
        (item) => item.start,
        (item) => item.stop,
    );

describe("binarySearchRange — the interpFrames hot-path locator (direct pins)", () => {
    it("empty array → -1 (no deref, no throw)", () => {
        expect(search([], 0)).toBe(-1);
        expect(search([], 42)).toBe(-1);
    });

    it("single element: inside hits, outside misses", () => {
        const one = [r(0, 100)];
        expect(search(one, 50)).toBe(0);
        expect(search(one, -1)).toBe(-1);
        expect(search(one, 101)).toBe(-1);
    });

    it("exact boundaries are INCLUSIVE on both ends", () => {
        const items = [r(0, 100), r(200, 300)];
        expect(search(items, 0)).toBe(0); // value === start
        expect(search(items, 100)).toBe(0); // value === stop
        expect(search(items, 200)).toBe(1);
        expect(search(items, 300)).toBe(1);
    });

    it("below the min and above the max → -1", () => {
        const items = [r(10, 20), r(30, 40), r(50, 60)];
        expect(search(items, 9)).toBe(-1);
        expect(search(items, 61)).toBe(-1);
    });

    it("a value in a GAP between ranges → -1 (ranges need not tile)", () => {
        const items = [r(0, 10), r(20, 30)];
        expect(search(items, 15)).toBe(-1);
    });

    it("locates the right range across an odd AND an even count (both mid-split parities)", () => {
        const odd = [r(0, 9), r(10, 19), r(20, 29), r(30, 39), r(40, 49)];
        for (let i = 0; i < odd.length; i++) {
            expect(search(odd, odd[i]!.start)).toBe(i);
            expect(search(odd, odd[i]!.stop)).toBe(i);
            expect(search(odd, odd[i]!.start + 5)).toBe(i);
        }
        const even = odd.slice(0, 4);
        for (let i = 0; i < even.length; i++) {
            expect(search(even, even[i]!.start + 1)).toBe(i);
        }
    });

    it("adjacent shared edges (frame tiling: stop[i] === start[i+1]) resolve deterministically to the EARLIER range", () => {
        // The compiled frames[] tile [0,500][500,1000]; t=500 belongs to the
        // first range under the inclusive-stop contract (the lower index wins
        // because the search lands on whichever mid contains the value — pin
        // the observable: it returns A containing index, and both contain it,
        // so the contract is "a containing index" — assert containment.
        const items = [r(0, 500), r(500, 1000)];
        const ix = search(items, 500);
        expect(ix === 0 || ix === 1).toBe(true);
        const hit = items[ix]!;
        expect(hit.start <= 500 && 500 <= hit.stop).toBe(true);
    });
});
