# KF → glass-ui BB — the cross-repo coordination (the outbound asks + the inbound dispositions)

**Authored 2026-06-16 (K.W1′ — the 4.0.0 adoption).** The mirror of the inbound
`audit/glassui-handoff-k.md` (what glass-ui owes kf) and the sibling
`KF-TO-VALUEJS-GRAMMAR-ASKS.md` (what kf dispatched to value.js). This doc is kf's
RESPONSE to the glass-ui BB tranche's `BB-AMENDMENT-crossrepo.md §A3` (the
`kf/vjs augment` band) + kf's own asks ON BB, recorded by name (the constellation
acyclic-spine discipline: by name, never silently). The foreign-tree fence HOLDS —
this is a CONSUME-CONTRACT + by-name-ask record, NOT an edit to glass-ui's tree.

---

## §0 — kf adopts glass-ui 4.0.0 NOW (the dock cure + the constellation cadence)

**kf was the last constellation arm on 3.13.0; K.W1′ re-pins to `~4.0.0`** (joining
slides + value.js, both already on 4.0.0 per the BB amendment). The forcing
function: the user drove the live K demo (2026-06-16) and found the **dock broken
on 3.13.0** — the collapsed pill clipping its scene name (the height-lock × width-floor
oval), and a hover-to-expand FLASH (the dock instantly expands, then progresses the
rest of the morph). Both are **named, root-caused defects of 3.13.0 that 4.0.0 (BA)
already fixed** (BA changelog: *"the collapse flicker killed"*; *"the collapsed pill a
perfect circle (the oval root-caused); the morph layout-isolated so expand/collapse
never reflows"*). inv-16 forbids patching the dock in the kf demo, so **adopting 4.0.0
is the cure** — there is no 3.13.x backport (BA superseded AZ).

- **kf cadence (matches the constellation):** `~3.13.0 → ~4.0.0` NOW (K.W1′);
  **re-pin `4.1.0` at the BB close** (the W-DOCK-MORPH-FAMILY polish + any kf-consumed
  BB primitive). This is the same `4.0.0 now → 4.1.0 at BB cut` cadence the BB amendment
  records for slides (N.W-ADOPT) and value.js (W-CROSSREPO-ASKS).
- **The 4.0.0 breaking-surface migration (kf consume seam, no glass-ui patch):** W-TABS
  (`Tabs`/`TabsList`/`TabsTrigger`/`TabsContent` off the root barrel → `SegmentedTabs
  variant="underline"`; `segmented`→`pill`), MetricBadge `amount`→`value`, the surface
  axis (`GlassPanel`/`Dialog`), menu-glass (`bg-accent` base→opt-out), scroll-fade→
  `FadingScroll`, `/underline`→`/handmark`. `ExpandableContainer`/removed-export exposure
  = 0. (kf was NOT a named 4.0.0 consumer in the BA cut — no kf-adopt-book exists; kf
  derived the migration from `MIGRATION.md` "BA → 4.0.0" + the concrete build breaks.)

---

## §1 — BB's by-name asks ON kf (the inbound, dispositioned)

From `glass-ui/docs/tranches/BB/BB-AMENDMENT-crossrepo.md §A3` (W-CROSSREPO-ASKS):

| BB ask | kf disposition | Status |
|---|---|---|
| **`springTimingFunction`** — W-DECK's `--spring-deck` consumes it (the deck-spring) | **SATISFIED.** kf ships `springTimingFunction` as a **LIGHT static named export** (`src/animation/index.ts:42`; `src/animation/springTimingFunction.ts`) — a value.js-free leaf, importable without pulling the heavy engine. Signature: `springTimingFunction({ response, dampingFraction, … }) → typed Easing { fn, css }` (the `css` is a `linear()` stops string ready for a CSS custom property — exactly what `--spring-deck` wants). The CONTRACT is stable (it is a published kf surface, gated by `proof:published-surface`). | ✅ CONFIRMED — BB's W-DECK may consume the published `springTimingFunction`; no kf change needed. |
| **KF-OSCILLATOR** — a shared-oscillator phase (the speedtest idle-breath is a local clock-owner; a by-name ask for the kf shared register) | **ACCEPTED, NEW PRIMITIVE.** kf has NO oscillator today (it ships `SmoothProgress`/`SpringProgress`/`RAFPlayback`/`Timeline` — progress trackers + a phase driver, but no periodic phase clock). The boundary law (§3) places a shared oscillator in kf's register (playback/phase = kf). kf will add a **LIGHT `Oscillator`/phase-clock primitive** (a periodic phase ∈ [0,1) with a frequency + an optional waveform — the idle-breath shape), exported value.js-free beside the other progress trackers. **Timed to the speedtest consume / BB's W-EASING-PRIMITIVE co-schedule** — NOT K's dock-cure scope; kf books it for a near-term wave (a small primitive, ~SmoothProgress-sized). | 🟡 BOOKED — kf delivers a LIGHT `Oscillator` when speedtest/BB consumes it; not blocking the 4.1.0 cut. |
| **W-EASING-PRIMITIVE boundary law** — curve MATH = value.js · playback/spring = kf · the editor COMPONENT = glass-ui | **AFFIRMED.** kf owns the spring/playback math (`springTimingFunction`, `springLinearStops`, `SpringProgress`, the `RAFPlayback` driver); value.js owns the curve math (the easing registry, `parseLinearStops`/`parseSteps` — kf consumes these at 0.12.0); glass-ui owns the editor component. kf does not encroach on the curve-math or the editor-component halves. | ✅ AFFIRMED. |

---

## §2 — kf's asks ON BB (the outbound)

| kf ask | Rationale | BB wave |
|---|---|---|
| **The dock-morph-family polish at 4.1.0** | 4.0.0 cures the user-reported 3.13.0 dock defects (collapse-flicker, oval-clip). BB's **W-DOCK-MORPH-FAMILY** is the FURTHER repair kf wants at re-pin: (a) the morph animates a COMPOSITOR TRANSFORM not `inline-size` (no per-frame relayout — the residual the user may still feel on a slow frame); (b) the reveal seats at the SETTLED geometry (no blank-icon partial interim); (c) the PRM SYNCHRONOUS SEAT (kf's demo respects `prefers-reduced-motion`; the 3.13.0/4.0.0 PRM blank-sliver P0 must not reach kf's PRM users); (d) `DockLayerGroup` self-reserves its peak block-size (retire kf's consumer `--dock-host-reserve` guess if any). | W-DOCK-MORPH-FAMILY → 4.1.0 |
| **The peer-spine admits kf 4.x** (no peer-cycle on the re-pin) | kf is at `4.2.0`; glass-ui 3.13.0 declared `keyframes.js: ^4.0.0` in peers (satisfied). Confirm 4.0.0/4.1.0 keep the `^4.0.0` peer so the kf re-pin carries no peer warning. | W-PEER-SPINE |
| **No NEW dock ASK beyond W-DOCK-MORPH-FAMILY** | The user's two symptoms are BA-fixed; kf needs no net-new dock work from BB — only to CONSUME the 4.0.0 fix now and the 4.1.0 morph-family polish at the BB cut. | (consume only) |

---

## §3 — The value.js leg (already dispatched — cross-ref)

kf dispatched the scroll + perceptual-ramp grammar to value.js → **0.13.0**
(`KF-TO-VALUEJS-GRAMMAR-ASKS.md`; ratified into value.js N.W11.D / N.W11′). This aligns
with the BB amendment's note that **value.js ships the VJ grammar at 0.13.0** and the
**OKLCH/shorter-hue spectrum helper** in its color core (which glass-ui's
W-BORDER-PROGRESS consumes). kf's Band II (K.W9 scroll-as-CSS, K.W10 compile CC-2)
born-RED-gate on that 0.13.0 publish. value.js's W-PEER-SPINE admits glass-ui
`^0.12.0 || ^0.13.0`; the cadence holds.

---

## §4 — The constellation cadence (the single picture)

```
glass-ui BA 4.0.0 (published)  ──dock fix (collapse-flicker, oval-pill)──►  kf K.W1′ (adopt NOW)
glass-ui BB 4.1.0 (the cut)    ──W-DOCK-MORPH-FAMILY + deck/border primitives──►  kf re-pin 4.1.0 (at BB close)
kf K  ──springTimingFunction (LIGHT)──►  glass-ui W-DECK (--spring-deck)        [SATISFIED]
kf K  ──Oscillator (LIGHT, booked)───►  speedtest idle-breath / BB W-EASING     [BOOKED]
kf K  ──VJ scroll+ramp grammar───────►  value.js 0.13.0 (N.W11.D/N.W11′)        [DISPATCHED]
value.js 0.13.0 ──OKLCH helper───────►  glass-ui W-BORDER-PROGRESS
```

Everyone consumes the PUBLISHED predecessor; no cycle. kf is now ON the cadence
(4.0.0 today, 4.1.0 at the BB close). The version cut + the npm re-pin to 4.1.0 stay
USER-DOMAIN (confirm-first) per the constellation's publish discipline.
