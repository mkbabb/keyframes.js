# Tranche T — the owner-verdict artifacts (K's TASTE-VERDICT, revived as a blocking per-wave gate)

> **The born-OWNER gate class enabler (T.M1 · `proof:owner-verdict-recorded`).**
> K's TASTE-VERDICT protocol (`docs/tranches/K/TASTE-VERDICT.md`) existed and was
> **silently skipped for all of S** (`docs/tranches/S/*VERDICT*` → no matches). The
> S impl closed all-green with **zero recorded owner verdict**, and the owner
> rejected it on sight. This directory revives the protocol as a **blocking**
> per-wave artifact: an appearance/taste wave listed in `APPEARANCE-WAVES.json`
> may not CLOSE (per `PROGRESS.md`) without a committed, FILLED verdict artifact
> here — `proof:owner-verdict-recorded` REDs otherwise.
>
> **Non-authoritative corroborators.** `proof:taste-packet` proves only that the
> *generator* works ("produces no committed artifact" — its own header). It is
> explicitly re-declared **NON-authoritative for the verdict**. The verdict is the
> committed owner token in the artifact below, nothing else.

## The artifact form (per closed appearance wave: `docs/tranches/T/verdicts/<wave-id>.md`)

Each closed appearance wave carries a file named for its wave id (e.g. `T.E6.md`)
with these required sections. The gate reads the **Verdict** block; it is FILLED
iff it carries a committed owner token (an owner name + a verbatim quote) and a
`Disposition:` of `APPROVED` or `REJECTED` — a placeholder (`___`, `PENDING`,
`TBD`, empty) REDs the gate.

```md
# <wave-id> — TASTE-VERDICT

## Packet
- the before/after review packet (shots / live-review pass) presented to the owner
- the deltas the wave claims

## Verdict
**Owner (<name>), <YYYY-MM-DD>: "<verbatim owner quote>"**

Disposition: APPROVED            # or REJECTED (with the cure wave named)
Reference: <OD row / prototype branch / shot ids that anchor the token>
```

`Disposition: REJECTED` is a legitimate FILLED verdict — it records that the owner
observed the surface and rejected it, and names the cure. A wave may not close
GREEN on a REJECTED verdict, but the artifact is FILLED (the process fact — a
verdict was recorded — is what T.M1 proves; the disposition is what T.M3's golden
and the wave's own born-RED oracle judge).
