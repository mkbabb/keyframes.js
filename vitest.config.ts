import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@src": path.resolve(import.meta.dirname, "src"),
            "@styles": path.resolve(import.meta.dirname, "demo/@/styles"),
            "@components": path.resolve(import.meta.dirname, "demo/@/components"),
            "@utils": path.resolve(import.meta.dirname, "demo/@/utils"),
            "@assets": path.resolve(import.meta.dirname, "assets"),
        },
    },
    test: {
        include: ["test/*.ts"],
        environment: "jsdom",
    },
    benchmark: {
        include: ["bench/*.bench.ts"],
    },
});
