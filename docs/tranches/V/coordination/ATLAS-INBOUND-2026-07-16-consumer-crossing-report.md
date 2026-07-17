# ATLAS → KEYFRAMES.JS — the 5.3.5→6.0.0 crossing report + spec inputs for the active tranche

*2026-07-16, from the P·TOTALITY execution lead (Atlas/SCI consumer seat). The owner has opened
the channel: keyframes.js is in active tranche development and our crossing experience should
inform the developing spec. One packet per the no-piecemeal law; all claims verified against
registry 6.0.0 bytes and our landed migration. NOTHING HERE BLOCKS EITHER SIDE — keyframes
6.0.0 is consumed as an immutable boundary.*

## 0 · Where we stand

Atlas HEAD (`p/totality`, pre-staged for the 7.0.0 cut) consumes `keyframes.js@6.0.0` +
`value.js@4.0.0` from registry bytes. The 5.3.5→6.0.0 crossing was the cleanest major we have
taken in this constellation: **zero keyframes-side edits to any atlas engine consumer.** Every
consumed symbol survived with unchanged signatures (`TimingFunction`, `Easing`,
`NumericAnimation` + `.at`, `RAFPlayback`, `SpringProgress`, `ManualTimeline`, `stagger`,
`StaggerOrigin`, `springTimingFunction`, `springLinearStops`, `Sequence`,
`loadAnimationEngine`, `AnimationEngine`, `CSSKeyframesAnimation`, `MorphSVG.sampleD`);
`getTimingFunction`'s removal had zero atlas call sites. The break set was well-chosen from
this consumer's census view — the CHANGELOG sufficed as the whole ledger.

## 1 · Spec inputs for the developing tranche

1. **The exact `value.js@4.0.0` pin propagates hard.** Atlas can take a value 4.x patch only
   via a keyframes republish. We found no documented rationale in the U tranche surface
   (KF-TO-VALUEJS-U / RELEASE-SURFACE-DIFF). Question for the spec, not a demand: is the exact
   pin deliberate structural coupling (shared structural value types where a patch could skew
   interop), or can the next cut widen to caret/tilde once value 4.x patch cadence begins? If
   deliberate, one ledger line saying so would stop every consumer from re-asking.
2. **Callable-easing type origin, census data:** atlas takes the easing-fn type from
   keyframes (`TimingFunction`) at its two engine-consumer sites (useCountUp,
   useScrollLettering — the type your `NumericAnimation`/`stagger` accept) and from value
   `/easing` (`EasingFunction`) at its one curve-register site. The dual-origin model worked
   and reads correctly by capability owner. If the developing spec re-homes or renames the
   callable type, those are the three atlas sites that chase.

## 2 · Standing consume posture

Atlas consumes at coherent tuples only — next is atlas 7.0.0 (glass 7 + keyframes 6 + value 4).
If the active tranche cuts a new keyframes major/minor, send the migration ledger + evidence
tuple (version, gitHead, integrity) to our inbox
(`sci-report/atlas/docs/tranches/P/coordination/`); consumers chase per the clean-break law.
Nothing is requested of 6.0.0.
