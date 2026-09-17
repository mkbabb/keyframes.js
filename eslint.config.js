// ESLint flat config — the SFC-template lint tier (X.KF.W4, G-KFW4-3).
//
// SCOPE, and why it is this narrow. `.dependency-cruiser.cjs` owns the source
// GRAPH, `tsc`/`vue-tsc` own type correctness, `prettier` owns formatting. The
// one class none of the three can see is the SFC TEMPLATE: a keyless `v-for`,
// `v-if` and `v-for` on one element, a mutated prop, a `<template v-for>`
// without a key — defects that type-check clean, bundle clean and ship broken.
// `eslint-plugin-vue`'s ESSENTIAL tier is exactly that class and nothing more.
//
// ESSENTIALS ONLY, deliberately. `strongly-recommended` and `recommended` are
// style/ordering tiers; enabling them here would manufacture a wall of
// pre-existing findings — a wave of its own, not a gate. One tool per concern,
// mirroring `.dependency-cruiser.cjs`'s own SLIM constraint.
import tsParser from "@typescript-eslint/parser";
import pluginVue from "eslint-plugin-vue";

export default [
    {
        ignores: ["dist/", "node_modules/"],
    },

    // The template rules. `flat/essential` supplies vue-eslint-parser for the
    // SFC itself; the block below hands the <script lang="ts"> body to
    // TypeScript's own parser. Measured, not assumed: without it every TS SFC
    // is a fatal `Parsing error`, so the gate would report 55 parse failures
    // and ZERO template findings — a lint tier blind to its own subject.
    ...pluginVue.configs["flat/essential"],
    {
        files: ["**/*.vue"],
        languageOptions: {
            parserOptions: {
                parser: tsParser,
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
    },

    // Plain `.ts` modules carry NO rule here — `tsc`/`vue-tsc` own them. The
    // parser is declared solely so `eslint demo --ext .ts,.vue` reads them
    // instead of fataling on TS syntax. A parser is not a ruleset.
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",
        },
    },
];
