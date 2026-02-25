import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@src": path.resolve(import.meta.dirname, "src"),
        },
    },
    test: {
        include: ["test/*.ts"],
        environment: "jsdom",
    },
});
