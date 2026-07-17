# Marks — the Glass install-truth packet (received 2026-07-17)

**Source**: `glass-ui/docs/tranches/BI/coordination/glass-outbound-2026-07-17-constellation-install-truth.md`
(glass commit `b43b9f91`), addressed to the whole constellation; owner also
relayed verbally. Every row below is marked with its keyframes-side owner —
no silent pass-through.

| Row | Content | KF disposition |
|---|---|---|
| IT-1 | **Peer wedge CONFIRMED**: glass@6 peers `kf ^5.2.0`/`value ^3.1.0`; kf@6 pins value 4.0.0 exact; the published-latest trio ERESOLVEs; the cure is Glass 7.0.0 (peers `kf ^6`/`value ^4`); the wedge window is P127's expected intermediate state, exit = their tag. | RECORDED; confirms W2's external gating posture. Our §4 mark is explicit: **"FYI only, no action owed either direction… Do not re-pin or loosen to accommodate glass@6"** — encoded as a W2 fence note: keyframes never loosens the value pin or re-pins for glass@6. Also independently validates the IN-ATLAS-2 exact-pin ruling (the packet verifies the pin from the registry). |
| IT-2 | `--legacy-peer-deps` named FORBIDDEN (masking fallback). | Already covered by W2's lock rules (no forced resolution); now cited explicitly in the W2 record. |
| IT-3 | **The authoritative Q060 delta table**: 11 removed / 3 added, 82→74 keys; survivors incl. `labeled-field`, `command`, `expandable-container`; removals incl. `motion-curves` (→ value.js/easing), `controls` (→ `dark-mode-toggle`), metric-* → `./metric`. | SUPERSEDES the predicted removal set in W2's CC-05 watchlist — the watchlist's export-map arm now checks against THIS table (and re-verifies against the published tarball at the tag, per the packet's own export-map-diff-is-authoritative rule). KF exposure check (done at formation): all 19 kf-consumed subpaths survive; `dark-mode-toggle` is an ADDED key we already consume; kf imports none of the 11 removals. |
| IT-4 | Changelog defect is **5.0.0-only** (20 keys dropped vs "./api only" claim); 6.0.0 honest; two true orphans `./styles/critical`/`./styles/deferred`; retro-rows staged pre-tag. | RECORDED, no kf action (kf never consumed the dropped 5.0.0 keys — our 5.x edge was exact 5.0.0 with a one-core proof). Informs W2's rule: migrate off the export-map diff, never CHANGELOG prose. |
| IT-5 | **Relay ask**: send the removal-list + changelog-scope corrections to the speedtest session. | DONE 2026-07-17 + **ACKED same day**: relay delivered to `speedtest/docs/tranches/AX/coordination/keyframes-relay-2026-07-17-glass-install-truth.md`; speedtest appended their RECEIVED disposition in place (corrections already folded at source, #560 re-booked, W0 retargeted to the 7.0.0 co-land trio) and returned `SPEEDTEST-INBOUND-2026-07-17-install-truth-relay-ack.md` here. Row CLOSED both directions. |
| IT-6 | Q051 Row-16 metric ruling (pill deleted, badge composes `Metric` in `./badge`) + `InstrumentChassis` no longer root-exported. | WATCHLIST rows for W2 (kf demo does not consume either today — verified against the 19-subpath import census; recorded so the consume wave re-checks). |

**Terminalization**: rows IT-1..IT-6 are terminal at formation (RECORDED/DONE/
fence-encoded); W2 executes the watchlist arms; W12 verifies the relay was
marked by speedtest at their next boundary.
