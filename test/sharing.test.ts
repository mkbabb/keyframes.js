import { describe, expect, it } from "vitest";
import {
    encodeStateToHash,
    decodeStateFromHash,
    getAllState,
} from "../demo/@/components/custom/animation-controls/animationStores";

describe("encodeStateToHash / decodeStateFromHash", () => {
    it("round-trip: encode then decode returns original state", () => {
        const state = {
            options: {
                Cube: {
                    Rotations: {
                        animationOptions: {
                            duration: 5000,
                            iterationCount: 999,
                            fillMode: "forwards",
                            direction: "alternate",
                            timingFunction: "ease-in-out",
                        },
                    },
                },
            },
            controls: {
                selectedAnimation: "Rotations",
                selectedControl: "controls",
            },
        };

        const hash = encodeStateToHash(state);
        const decoded = decodeStateFromHash(hash);

        // JSON.stringify converts Infinity to null, so we use a finite value here
        expect(decoded).toEqual(state);
    });

    it("idempotency: encoding same state twice produces same hash", () => {
        const state = {
            options: { duration: 1000, direction: "normal" },
            controls: { selected: "test" },
        };

        const hash1 = encodeStateToHash(state);
        const hash2 = encodeStateToHash(state);

        expect(hash1).toBe(hash2);
    });

    it("idempotency: encode → decode → encode produces same hash", () => {
        const state = {
            nested: { a: 1, b: [1, 2, 3], c: { d: "hello" } },
        };

        const hash1 = encodeStateToHash(state);
        const decoded = decodeStateFromHash(hash1)!;
        const hash2 = encodeStateToHash(decoded);

        expect(hash1).toBe(hash2);
    });

    it("handles empty object", () => {
        const state = {};
        const hash = encodeStateToHash(state);
        const decoded = decodeStateFromHash(hash);
        expect(decoded).toEqual(state);
    });

    it("handles nested objects with special characters", () => {
        const state = {
            name: "test-animation",
            css: "transform: translateX(100px) rotate(45deg);",
            emoji: "🎉",
            specialChars: "foo=bar&baz=qux#hash",
        };

        const hash = encodeStateToHash(state);
        const decoded = decodeStateFromHash(hash);
        expect(decoded).toEqual(state);
    });

    it("handles numeric values including Infinity", () => {
        const state = {
            duration: 5000,
            count: Infinity,
            delay: 0,
            fraction: 0.5,
            negative: -100,
        };

        const hash = encodeStateToHash(state);
        const decoded = decodeStateFromHash(hash);

        // JSON.stringify converts Infinity to null
        expect((decoded as any).count).toBe(null);
        expect((decoded as any).duration).toBe(5000);
        expect((decoded as any).delay).toBe(0);
    });

    it("handles arrays", () => {
        const state = {
            controlPoints: [0.2, 0.65, 0.6, 1],
            frames: [{ opacity: 0 }, { opacity: 1 }],
        };

        const hash = encodeStateToHash(state);
        const decoded = decodeStateFromHash(hash);
        expect(decoded).toEqual(state);
    });

    it("handles large state objects", () => {
        const state: Record<string, any> = {};
        for (let i = 0; i < 100; i++) {
            state[`animation_${i}`] = {
                duration: i * 100,
                direction: i % 2 === 0 ? "normal" : "alternate",
                keyframes: { from: { opacity: 0 }, to: { opacity: 1 } },
            };
        }

        const hash = encodeStateToHash(state);
        const decoded = decodeStateFromHash(hash);
        expect(decoded).toEqual(state);
    });
});

describe("decodeStateFromHash error handling", () => {
    it("returns null for empty string", () => {
        expect(decodeStateFromHash("")).toBe(null);
    });

    it("returns null for invalid base64", () => {
        expect(decodeStateFromHash("!!!not-base64!!!")).toBe(null);
    });

    it("returns null for valid base64 but invalid JSON", () => {
        const hash = btoa("this is not json");
        expect(decodeStateFromHash(hash)).toBe(null);
    });

    it("returns null for corrupted data", () => {
        const hash = encodeStateToHash({ test: true });
        // Corrupt the hash
        const corrupted = hash.slice(0, -5) + "XXXXX";
        expect(decodeStateFromHash(corrupted)).toBe(null);
    });
});

describe("getAllState", () => {
    it("does not include _storeTimestamp in output", () => {
        const state = getAllState() as any;

        // Verify _storeTimestamp is stripped from both stores
        expect(state.options._storeTimestamp).toBeUndefined();
        expect(state.controls._storeTimestamp).toBeUndefined();
    });

    it("idempotency: calling getAllState twice returns structurally equal state", () => {
        const state1 = getAllState();
        const state2 = getAllState();

        expect(state1).toEqual(state2);
    });

    it("idempotency: encoding getAllState twice produces same hash", () => {
        const hash1 = encodeStateToHash(getAllState());
        const hash2 = encodeStateToHash(getAllState());

        expect(hash1).toBe(hash2);
    });
});

describe("URL hash extraction", () => {
    it("extracts hash from full URL", () => {
        const state = { test: true };
        const hash = encodeStateToHash(state);
        const fullUrl = `https://example.com/page#${hash}`;

        // Simulate what loadFromInput does
        const hashIndex = fullUrl.indexOf("#");
        const extractedHash = fullUrl.slice(hashIndex + 1);

        expect(decodeStateFromHash(extractedHash)).toEqual(state);
    });

    it("handles URL with no hash", () => {
        const url = "https://example.com/page";
        const hashIndex = url.indexOf("#");

        // No hash means hashIndex === -1
        expect(hashIndex).toBe(-1);
    });

    it("handles bare hash (no URL prefix)", () => {
        const state = { duration: 1000 };
        const hash = encodeStateToHash(state);

        expect(decodeStateFromHash(hash)).toEqual(state);
    });
});
