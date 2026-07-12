// U.A6 — tier membership is data, while package.json remains the leaf command
// registry. Aggregators consume these names instead of repeating the roster in
// every orchestrator and workflow. Keep the observed migration tier out of the
// blocking `--all` run until its owner waves either promote or retire its leaves.
export const BLOCKING_TIERS = [
    "proof:library-correctness",
    "proof:demo-correctness",
    "proof:hygiene",
];

export const OBSERVED_TIERS = ["proof:observed"];

export const ALL_TIERS = [...BLOCKING_TIERS];
