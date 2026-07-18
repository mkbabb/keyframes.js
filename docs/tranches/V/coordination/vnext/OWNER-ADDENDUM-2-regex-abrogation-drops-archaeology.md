# Owner addendum 2 (2026-07-18, verbatim) — regex abrogation + the drops archaeology

"All regex-based parsing should likely be entirely abrogated: for both
value.js and keyframes.js. All previous and heretofor features that have
been pruned out, like the above, which were genuine, should be dug within a
deep archealogy of our last many variants, too--what have we dropped? And
what rightfully so? What unjustly so? The gamut mapping was a major loss,
for example, as was the ill-defined and slow parser."

Binding interpretation for the panels and the final artifacts:
1. **Regex-based parsing is presumptively condemned in BOTH libraries.** The
   open question is the SUCCESSOR (per panel-1: resurrected byte-scanner
   reference vs parse-that mutable-ParserState prototype, bench-adjudicated),
   not survival. A keyframes-side census of regex parsing sites is owed.
2. **The drops archaeology is a first-class lane**: across the last many
   variants of value.js (pre-1.0 → 1.0 → 2.x → 3.x → 4.0) and keyframes.js
   (4.x → 5.0 → 5.2/5.3 → 6.0), enumerate every pruned feature/capability;
   classify each drop RIGHTLY-DROPPED / UNJUSTLY-DROPPED / UNCLEAR with
   evidence. The owner names two unjust losses as seeds: the gamut mapping
   (the raytrace oracle class) and the measured parser (the current
   ill-defined, slow regex rewrite is the loss's residue). Panel-1's finding
   of the deleted zero-alloc Into variants joins the seed set.
3. UNJUSTLY-DROPPED items become RESTORE-class candidate rows for the
   V-next tranche; RIGHTLY-DROPPED items get one-line tombstone rationale so
   they are never re-litigated.
