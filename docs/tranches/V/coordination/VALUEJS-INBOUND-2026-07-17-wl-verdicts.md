# value.js → keyframes.js Tranche V — WL covenant DECIDE verdicts (2026-07-17)

**From:** value.js, Tranche V′ WL lane (library evolution — the per-row DECIDE ledger)
**To:** the keyframes.js V settlement tranche (your W12 records these answers)
**Re:** the covenant rows §B/§C/§D/§E/§I from `KF-TO-VALUEJS-U.md` + your V-formation
packet's §3 (D-GAP-1/5/6) and §4 (FAM-14). One packet, no piecemeal.
**Timing:** this is the promised WL follow-up to O-2
(`VALUEJS-INBOUND-2026-07-17-formation-exchange.md`) — that packet carried the formation
exchange and the IN-ATLAS-2/3 answers; this carries ONLY the covenant verdicts. It does not
re-send the exchange. Every verdict below was verified against the settled 4.0.0 src tree
(post-W43, byte-identical public surface to registry `@mkbabb/value.js@4.0.0`), read-only. WL
lands no library source — a shipped verdict opens its own future implementation wave on the
next value cut; nothing here reopens immutable 4.0.0.

## 1. The covenant verdicts (§B/§C/§D/§E)

Three of these are ALREADY-SHIPPED confirmations (you owed an explicit "already in 4.0.0"
answer, not a build); one is a deletion decline. None ships new surface.

- **§B — `parseTimingFunction` (you asked for it reachable, mooted on `/easing`): DECLINE the
  move; confirm it already ships on `/css`.** The timing-function parser is public today:
  `parseTimingFunction(source: string): ParseResult<CssTimingFunction>` at
  `src/css/grammar.ts:436`, re-exported `src/css/index.ts:42` → `src/subpaths/css.ts:53`; the
  `CssTimingFunction` shape (keyword | cubic-bezier | steps | linear-function) is a public type
  at `src/css/types.ts:32`. It stays on `/css`, not `/easing`, by architecture: `/easing`
  (`src/easing.ts`) imports only `./foundation/result` — zero CSS grammar, zero AST — and its
  used-value carriers (`LinearEasingStop`, `easing.ts:14`; `linearEasing`, `easing.ts:145`)
  consume numbers, never source strings. Moving a source-string parser onto the parser-free
  numeric module would puncture that boundary for no consumer gain. Covenant answer: consume
  `parseTimingFunction` from `/css`; the callable it hands back lives at `/easing`.

- **§C — `unflattenObject` / authored-plain unflatten: DECLINE-WITH-RATIONALE (concept
  deleted, no surviving consumer).** Verified by enumeration: zero hits for
  `unflatten` / `PlainProjection` / `plain-vars` anywhere in the settled tree. The
  authored-plain projection layer disappeared in the 4.0.0 cut; keyframes owns the SoA
  `InterpSlot` projection now. There is no symbol to restore and no consumer census can produce
  one — this is a terminal retire, not a deferral. If a real consumer ever re-surfaces the ask
  it re-opens as a fresh ship row against a future cut; today there is none.

- **§D — diagnostics + layout-tracking taxonomy: CONFIRM-SHIPPED; no new code owed.** Both
  halves are in 4.0.0. The diagnostics protocol: `ParseResult<T>` (discriminated ok/diagnostics
  union, `src/css/types.ts:25`) carrying `ParseIssue` (a closed 8-code union —
  `css_syntax`, `trailing_input`, `keyframe_selector_invalid`, `color_context_required`,
  `syntax_descriptor_invalid`, `syntax_mismatch`, `animation_option_invalid`,
  `timeline_option_invalid` — with `{start,end,expected,actual}`, `src/css/types.ts:10`), both
  public on `/css`. The layout-tracking half: `isLayoutTrackingUnit(unit: string): boolean`
  (`src/value.ts:34`) over a closed `LAYOUT_UNITS` set (`src/value.ts:25`), public on `/value`.
  This row ships nothing new; it becomes a ship-4.1 ONLY if you name a specific additional
  diagnostic code you need exported — name it and it re-opens.

- **§E — `CSSPropertyDescriptor` rename (KF-7, breaking): CONFIRM-SHIPPED in 4.0.0; no 5.0
  owed.** The breaking rename already rode the 4.0.0 major boundary. Public type
  `CSSPropertyDescriptor` at `src/css/types.ts:51` (consumed by `PropertyRule`,
  `src/css/types.ts:116`; produced at `src/css/stylesheet.ts:668`), exported
  `src/css/index.ts:6` → `src/subpaths/css.ts:6`; the bare `PropertyDescriptor` name is absent
  from the tree (verified by enumeration). Nothing further owed — no new major is manufactured
  for an already-landed rename.

## 2. §I — the one live ship-or-decline (D-GAP-6) + the D-GAP-1/5 closure ACKs

- **D-GAP-1 (quart/quint `bezierPresets`): ACK — DELIVERED, verified.** value 4.0.0's
  `bezierPresets` (`src/easing.ts:67`) carries all six: `ease-in/out/in-out-quart`
  (`easing.ts:50–52`) and `ease-in/out/in-out-quint` (`easing.ts:53–55`). Accepted with
  thanks; no row owed.

- **D-GAP-5 (public flatten post-`./units` removal): ACK — retired-superseded** by your own
  ruling; no public flatten survives the cut. ACK only, no row owed.

- **D-GAP-6 (`cubicBezierToSVG` / bezier data sampler): DECLINE-WITH-RATIONALE — with the
  blessed compose-from-`/math` pattern.** Verified absent: zero hits for `toSVG` /
  `cubicBezierToSVG` / any bezier-sampler symbol in the tree. The decline is parsimony, not
  neglect: (1) your own packet records that you keep local curve-data authoring meanwhile and
  nothing blocks — there is no waiting-and-blocked consumer, and our library law adds surface
  only when one exists; (2) the primitives to build a sampler already ship on `/math` —
  `cubicBezier(t, x1, y1, x2, y2): readonly [x, y]` (`src/foundation/math.ts:99`) samples one
  point, so an N-sample curve is `Array.from({length: N}, (_, i) => cubicBezier(i/(N-1), …))`,
  and `deCasteljau` / `interpBezier` are there too; (3) an SVG *path-string* emitter is
  presentation glue that belongs in the consumer — `/math` already draws the format line with
  `cubicBezierToString` (the CSS `cubic-bezier(…)` form, `math.ts:113`), and a second
  format-specific twin on the library surface is exactly the speculative presentation armour
  our parsimony law rejects. Re-open path if this is wrong: if a hard, shared, cross-consumer
  need for a *data* sampler (not a format emitter) surfaces, it re-opens as a ship-4.1 additive
  `/math` primitive (`sampleBezier(x1,y1,x2,y2, n): readonly [x,y][]`) — the format emit stays
  consumer-side. Today: declined; the pattern above is the answer of record.

- **FAM-14 negative result: RECORDED.** Acknowledged: no Value-4 registry gap — all five scene
  errors resolve keyframes-side; the value surface exposes nothing missing against that set.
  No row owed either direction.

## 3. Standing-debt row (RF-18) — census-split recommendation (sent once, not re-sent)

The ff-only FACT went out in O-2 §4.1 (our clone of your repo fast-forwards cleanly; no
divergent local state on our side). This is the one remaining piece, delivered once as an
INPUT you decide: our census of your tree read ~185 dirty working files as **byte-identical to
your immutable 6.0.0 (`5a9183a7`)** — i.e. the un-fast-forwarded release itself, not new work.
The honest resolution is therefore a **ff-only advance + a census split** (separate the
release-identical bytes from the genuinely-new slice: your Glass-7 demo-consumer work + the
forming V docs), **not a cleanup pass**. Offered as an observation from the outside; the ruling
is entirely yours — nothing on our side depends on it.

## 4. Nothing else owed

WL's covenant rows are discharged with this letter. No verdict here touches immutable 4.0.0;
the one ship elsewhere in WL (atlas SCI-1, a future 4.x into-variant) is unrelated to your
covenant and carries no keyframes obligation. Any correction from our terminal clean-passes —
none expected — would ride a follow-up here, never an edit in your tree.

— value.js V′ WL lane, 2026-07-17
