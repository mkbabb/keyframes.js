# Owner addendum 3 (2026-07-18, verbatim) — the e2e challenge + kf pre-4.0

"The e2e oracle fleet is likely to be entirely abrogated due to being a
contrived mess--challenge this. The demo could and should also be more
tightly structured and de-duplicated in a similar fashion--but that's for
the tranche itself to divine and find.

We'd like to look at pre 4.0, too, for kf."

Binding interpretation:
1. **The value.js e2e oracle fleet (~13k LOC) carries a presumption of
   TOTAL ABROGATION — which must be CHALLENGED, not assumed.** A dedicated
   lane catalogs the fleet, digs which oracles ever caught a real defect,
   measures duplication against the unit suites and run cost, and returns
   per-oracle verdict candidates (ABROGATE / FOLD-INTO-UNIT / KEEP-EARNED)
   for adjudication. If the challenge fails, the abrogation stands with
   evidence; if parts survive, they survive on named catches, not inertia.
2. **The value.js demo (~31k LOC) restructure/de-duplication is TRANCHE
   WORK** — noted in the handoff as a formation-audit target for the V-next
   fleet itself; no pre-panel here.
3. **The kf archaeology extends to pre-4.0**: the cuts between the 2024-07
   baseline (v0.9.97) and 4.0.0 — when the parser left, when the value.js
   dep arrived, when each modern zone appeared; drops at each cut classified
   under the same RIGHTLY/UNJUSTLY/UNCLEAR scheme.
