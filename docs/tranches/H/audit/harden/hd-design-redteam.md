# Tranche H DEEP harden — lane `hd-design-redteam`

**Charge:** DEEP red-team of the design-language restoration (D2/D14, H.W2). Attack the
`surface="cartoon"` thesis. Is cartoon-shadow the RIGHT idiom for glassy panels (the user
said the glass is GOOD), or does cartoon depth fight glassmorphism? What EXACTLY should the
refined specular hover be (refined, not deleted)? Verify cartoon-surface + the specular
catch-light can COEXIST on the same panel. Propose the precise hover treatment.

**Method:** read H.md §H.W2, `_SYNTHESIS-design-language`, `a-cartoon-shadow`,
`a-glow-artifact`, `a-design-language §0-1`; verified every load-bearing API claim against
the INSTALLED `@mkbabb/glass-ui@3.4.0` source (`node_modules/.../dist/`); drove the live
demo (`:5173`, `#/easing`) via Playwright — computed-style probes on `::before`, an
EMPIRICAL coexistence test (injected element carrying both classes + a pointer write).

**Verdict:** The `surface="cartoon"` thesis is **CORRECT, FEASIBLE, and well-grounded** —
the API exists exactly as the audit claims (`CardSurface = "glass" | "cartoon"`, the
surface map gates the specular on `surface==="glass"`, cartoon composes on the resolved
glass tier so the glass blur/bg is PRESERVED). H.W2's headline move is sound and I do not
contest it. **BUT there is ONE substantive architecture defect (HIGH) that the consistency
pass could not catch: H.W2 frames cartoon and the specular catch-light as MUTUALLY
EXCLUSIVE per surface, but the user's D14 ask ("glass is GOOD" + cartoon depth + a refined
specular hover) wants BOTH on the SAME panels — and the prop-only path the spec mandates
makes that impossible.** Plus 3 MED and 2 LOW/NIT. Findings below.

---

## What I VERIFIED true (the thesis stands on solid API)

Every load-bearing claim in H.W2 / `_SYNTHESIS-design-language` re-confirmed against
glass-ui 3.4.0 source + live:

1. **`surface="cartoon"` EXISTS and is typed.** `dist/components/ui/card/Card.vue.d.ts:22`
   — `export type CardSurface = "glass" | "cartoon";`. JSDoc `:18-20`: cartoon is "the
   Memphis-sticker decoration **layered on top of the resolved tier** … Composes onto ANY
   tier." NOT a wave-on-a-non-existent-API. PASS.
2. **The surface map gates exactly as claimed.** `dist/CardFooter-C390imy7.js` (verified the
   minified region directly): the Card class list is
   `` `glass-${t.tier}` `` (ALWAYS) `+ t.surface==="glass" && "glass-specular-track" +
   t.surface==="cartoon" && "cartoon-surface" + t.shadow && t.surface==="glass" &&
   "shadow-card"`. So `surface="cartoon"` (a) DROPS `glass-specular-track` at source (radial
   gone, no `!important`), (b) DROPS `shadow-card`, (c) ADDS `cartoon-surface`, (d) KEEPS
   `glass-${tier}` → **the glass blur/background SURVIVES under cartoon.** PASS — the "net
   deletion, no workaround" claim is real.
3. **Glass is NOT killed by the swap.** LIVE empirical: an element with
   `glass-resting cartoon-surface` resolves `backdrop-filter: blur(12px) saturate(1.05)`
   (the glass) AND `box-shadow: …-4px 3px 1px…` + `border-width: 2px` (the cartoon). The
   user's "glass is GOOD" is HONORED by `surface="cartoon"` — it is glass-WITH-cartoon-depth,
   not a glass removal. The audit framing ("paper-AND-glass") is correct.
4. **`cartoon-surface` owns its own hover transition** (`cards.css:40-47`): `translate`
   on `--spring-bouncy`, `box-shadow` on `--ease-apple`; `:hover` →
   `translate: var(--lift-sm) var(--lift-sm)` (live `-1px`) + `--shadow-cartoon-lg`. So the
   "delete `transition-shadow duration-normal` + the manual `.glass-card` plate" claim is
   correct (the utility owns it). PASS.
5. **The radial is unwired + centered, live.** `#/easing`: tracks present,
   `anyPointerWrite:false`, `--specular-x:50%` (centered floor), `screen` blend, 0.35 rest
   → 0.6 hover. Confirms D2. PASS.
6. **Tokens all resolve:** `--shadow-cartoon-{sm,md,lg}`, `--lift-sm:-1px`,
   `--spring-bouncy` (live), `--type-display-mega: clamp(5.382rem,4rem+9vw,11.089rem)`
   (the H.W4 hero target — real). PASS.

The thesis is NOT over-reach into already-SOTA and NOT API-fictional. Credit where due:
this is a well-researched wave. The findings below are the *gaps the research left*, not a
refutation.

---

## FINDING HD-1 (HIGH) — H.W2 forbids the user's actual ask: cartoon depth AND a refined specular on the SAME panel

**Location:** `H.md` §H.W2 S1+S3, `_SYNTHESIS-design-language §0/§2 (W1/W2)`,
`a-cartoon-shadow §4.3`, `a-glow-artifact §"disposition rules"`.

**The defect.** Every H.W2 lane resolves D2/D14 as an EITHER/OR partition of surfaces:
panels → `surface="cartoon"` (S1, radial dies); a *different, deliberately-retained* set of
`surface="glass"` surfaces → wire the specular (S3, `useSpecularPointer`). The gate encodes
this as an exclusive-or: `proof:no-orphan-specular` = "ZERO `.glass-specular-track` on
panels OR (if retained as glass) a `--mouse-x` writer." There is no third state.

But re-read D14 as the charge quotes it: **"the glass is GOOD … a refined specular hover,
not deleted … reconcile WITH the cartoon-shadow depth."** The user is not asking to choose
cartoon for panel A and specular for panel B. The user wants the panels they like — the
glassy ones — to have cartoon depth AND a refined (tracked, calmer) specular catch-light
TOGETHER. The two-layer hover identity `a-glow-artifact §"RECONCILING"` itself proposes
("DEPTH = cartoon offset-stamp" + "SPECULAR = a tracking catch-light") is a SINGLE-surface
composite — yet H.W2's mechanism (`surface=` prop) cannot deliver it, because the prop emits
`cartoon-surface` XOR `glass-specular-track`, never both.

**Evidence the composite is what's wanted AND that it works.** I ran the empirical
coexistence test live (injected `<div class="glass-resting cartoon-surface
glass-specular-track">` with `--mouse-x:70% --mouse-y:30%`):

```
boxShadow:       color(srgb …) -4px 3px 1px 0px, …   ← cartoon offset stamp
borderWidth:     2px                                 ← cartoon bezel
backdropFilter:  blur(12px) saturate(1.05)           ← glass PRESERVED
beforeOpacity:   0.35   beforeBlend: screen          ← specular layer
beforeSpecularX: 70%                                 ← pointer write FLOWS THROUGH
beforeBg:        radial-gradient(circle at 70% 30%, …)  ← it TRACKS
beforeZ:         1                                   ← light layer above plate, below content
```

**All three layers coexist and compose cleanly** (cartoon = outer box-shadow + border;
glass = backdrop-filter; specular = a `::before` LIGHT layer the CSS comment explicitly
calls "a LIGHT layer, not a second plate," `glass-specular-track.css:26-30`). There is NO
conflict — the specular is `z-index:1` on the `::before`, the cartoon shadow is on the host
box, the glass blur is the host backdrop. The user's exact ask is *technically trivial* and
*reads beautifully* — a Memphis sticker that lifts on hover AND catches the light under the
cursor. H.W2 simply does not author it, because it treats the surface prop as the only
mechanism and the prop can't express the composite.

**Why this is HIGH, not a nit.** This is the chronic-closure trap the whole tranche is
built to avoid (M2 scope-narrowing). D2/D14 is a CHRONIC. If H.W2 ships "panels are cartoon,
specular is opt-in elsewhere," it has *narrowed* the user's "glass + cartoon + refined
specular together" into a terminable sub-problem ("cartoon panels, no specular") and called
it closed — exactly the re-classification H.W8's meta-gate is supposed to forbid. The
`proof:cartoon-is-panel-depth` gate would go GREEN while the user's actual request ("the
glass IS good, refine the hover ON it") is unmet. A green gate over an unmet ask is the
signature failure the tranche exists to kill.

**The CONCRETE doc edit.** Rewrite H.W2 to author THREE surface dispositions, not two, and
make the *composite* the headline for the kept-glass panels:

- **S1 (revised) — chrome/dead panels → `surface="cartoon"`.** Pure structural panels with
  no catch-light intent (the controls sidebar shell, the ribbon plate): `surface="cartoon"`,
  radial dies at source, manual `.glass-card` deleted. (Unchanged from current S1, but
  scoped to the panels that genuinely want NO specular.)
- **S2 — the COMPOSITE surface (NEW, the D14 headline).** For the glassy panels the user
  *likes* (the stage-adjacent / interactive surfaces), author a demo idiom
  `.cartoon-specular` (or apply `cartoon-surface glass-specular-track` together) + the
  `useSpecularPointer` wire. This is the cartoon-depth-AND-tracked-catch-light the user
  actually asked for. NOTE: because the `<Card surface>` prop cannot emit both, this is the
  ONE place where a demo-owned class composition is *correct* (it is not re-authoring a
  glass-ui token — both classes are glass-ui's; the demo only *co-applies* them, which the
  Card prop API structurally cannot). This is the named delta.
- **S3 (revised) — the pointer wire** `useSpecularPointer` is the shared dependency of S2
  (not a separate "retained glass" branch). PRM-aware (the `glass-specular-track.css:117`
  static-pin already handles reduced-motion; the wire just must not throw under it).
- **Gate revision — `proof:cartoon-specular-coexist` (NEW, born-RED):** ≥1 panel resolves
  BOTH `box-shadow: var(--shadow-cartoon-md)` AND a `::before` whose
  `background-image` computes `circle at <x≠50%>` after a synthesized `pointermove` (RED
  today: 0 panels carry cartoon, 0 are pointer-wired). This is the gate that bites the
  scope-narrowing: you cannot close D14 with cartoon-only panels.

**Severity rationale:** the wave is *implementable as written* (so not BLOCKER) but ships
the WRONG design — it answers a question the user did not ask (cartoon-only) and gates it
green. HIGH: must fix before H.W2 can claim D2/D14 closed.

---

## FINDING HD-2 (MED) — the glass-ui-HANDOFF (calmer specular default) is the load-bearing half of "refined," yet H ships NO kf-side default-calming and the born-RED gate doesn't assert it

**Location:** `H.md` §4 handoff #2, §H.W2 design-decision (2), `_SYNTHESIS-design-language
§3 (DL-10)`, `a-glow-artifact F4`.

**The defect.** The user's word is *REFINED*. The audit correctly identifies that the
specular default is too hot (0.55 white core, `screen` blend, 0.35→0.6, 55% radius) and
hands the calming to glass-ui (DL-10 / handoff #2: "rest ≤0.25, radius ≤40%"). Fine as a
HANDOFF. **But the chronic-closure discipline requires a HANDOFF be PAIRED with a born-RED
kf gate (§6 spine), and H.W2 pairs NONE.** The H.W2 gate (`proof:no-orphan-specular`) only
asserts *presence/absence + a pointer writer* — it never asserts the specular is actually
*calmer* on the surfaces that KEEP it (S2/S3). So a kept-glass panel can be pointer-wired
AND still bloom at the hot 0.55-core/0.6-hover/`screen` default, and the gate goes GREEN.
"Refined" is then entirely outsourced with no kf-side proof — the exact M3
column-migration-without-a-paired-gate the tranche forbids for D5.

Worse: the demo CAN refine intensity itself WITHOUT patching glass-ui. `--specular-intensity`
is a registered custom property the consumer can set on the host
(`glass-specular-track.css:53` is just a floor on the `::before`; the demo can write
`--specular-intensity` on the host inline or via the same `useSpecularPointer` composable,
and it inherits to the pseudo). So the kf-side calming is feasible TODAY (it is not blocked
on the handoff), making the bare HANDOFF tag under-reach.

**The CONCRETE doc edit.** (a) Add to H.W2 S2/S3: the `useSpecularPointer` composable also
sets a calmer rest intensity on opted-in hosts — `--specular-intensity: 0.22` rest (the
existing dark floor value, `glass-specular-track.css:93`), lifting to ≤0.4 hover — a
demo-owned tuning of a glass-ui-registered property, no glass-ui patch. (b) Add the paired
born-RED gate `proof:specular-calm`: any retained `.glass-specular-track::before` resolves
hover `opacity ≤ 0.4` AND a non-`screen`-only-blowout (assert rest `opacity ≤ 0.25`). RED
today (0.35 rest / 0.6 hover). (c) Keep the glass-ui HANDOFF for the *upstream default* but
mark the kf-side calming as the SHIP that pairs it — so "refined" is proven in kf, not
outsourced.

---

## FINDING HD-3 (MED) — "≥4 panel Cards" / "13 hosts" / the deleted `.glass-card` count is route- and state-dependent; the gate's fixed numbers will mis-fire

**Location:** `H.md` §H.W2 gate ("≥4 panel Cards … RED: 13 orphan tracks today"),
PROGRESS.md W0-evidence ("13 hosts"), `a-cartoon-shadow §2.2` ("9 `<Card>`-bearing
components"), `a-glow-artifact` ("7 live elements").

**The defect.** The audit's own numbers already disagree across lanes: `a-glow-artifact`
measured **7** specular elements on `/easing`, `a-cartoon-shadow` measured **13**,
`_SYNTHESIS-design-language` says "live 13 hosts," and the H.W2 gate says "RED: 13 orphan
tracks today." I measured **5** on `#/easing` live just now (`specularTrackCount:5`,
`cardCount:2`, `cardsWithManualGlassCard:1`). The count is not a constant — it depends on
the route, whether the dock is expanded (dock icon buttons each carry the track), and how
many scene panels are mounted. The gate text "ZERO `.glass-specular-track` on panels OR …
(RED: 13 today)" and "≥4 panel Cards resolve cartoon" hard-code a snapshot that won't
reproduce, so the born-RED claim is not reliably re-runnable and the GREEN target ("≥4") is
arbitrary.

This matters for an *adversarial* gate: a gate whose RED baseline is a number that drifts
with route/dock state is not falsifiable in the inv-ε sense — a reviewer can't confirm "RED
today" because today shows 5, not 13.

**The CONCRETE doc edit.** Re-phrase the gate to be a SOURCE/PROP invariant, not a live
count: (a) `proof:no-orphan-specular` = "every `<Card>` in `demo/` source whose surface is
NOT a deliberate S2 composite resolves to `surface='cartoon'` (grep the templates), and no
`<Card>` with the manual `.glass-card` utility survives (`grep '<Card' | grep glass-card` =
0)." (b) `proof:cartoon-is-panel-depth` = "EVERY `<Card>` panel in `demo/` source declares
`surface='cartoon'` or the S2 composite — count = (the panel-Card count in source), not a
magic ≥4." (c) The live "13/7/5" numbers move to an illustrative footnote, not the gate
threshold. The gate should bite on SOURCE SHAPE (which is deterministic) + a per-surface
computed-style assertion (which is route-stable per surface), not a global live count.

---

## FINDING HD-4 (MED) — the scene-target `<div class="glass-card">` stages are NOT Cards; H.W2's mechanism (a surface prop) cannot reach them, and the spec leaves them "per-site / audit"

**Location:** `_SYNTHESIS-design-language §2 W1` ("Audit the scene-target `<div
class='glass-card …'>` sites … these are bare `<div>`s … a SEPARATE depth decision"),
`a-cartoon-shadow §4.2` ("Audit `MatrixEditor`/`TimingFunctionPanel` per-Card").

**The defect.** The synthesis correctly notes the scene targets (`EasingTarget`,
`SpringTarget`, `MotionPathTarget`, etc.) are bare `<div class="glass-card">`, NOT `<Card>`
— so they carry NO specular track (no surface API) and the `surface="cartoon"` move cannot
touch them. The synthesis then defers them to "a separate per-site depth decision." This is
an unresolved fork inside the headline wave: the demo will end up with `<Card
surface="cartoon">` panels (cartoon depth) sitting beside `<div class="glass-card">` stages
(the old static `--shadow-card` plate, glass.css:175) — TWO depth idioms coexisting, which
is precisely the "no legacy beside its replacement" violation the spine forbids, just
migrated to the div stages. A green `proof:cartoon-is-panel-depth` (which only checks
`<Card>`s) would mask it.

**The CONCRETE doc edit.** H.W2 must RESOLVE (not "audit per-site") the `glass-card` div
stages: either (a) they ALSO adopt the cartoon register — replace `glass-card` with
`glass-resting cartoon-surface` (the div equivalent of the Card swap; both are glass-ui
utilities, net-isomorphic), so depth is ONE idiom demo-wide; or (b) a NAMED delta says the
stages are deliberately the quiet static plate (a framing choice for the animated subject)
— but then it must be stated as a delta, not left to "audit." Add to the grep gate:
`grep -rn 'glass-card' demo/` resolves only to *intentionally-static* stage divs enumerated
in the spec, zero on `<Card>`s. Without this, the cartoon swap leaves a second depth idiom
standing.

---

## FINDING HD-5 (LOW) — the `cartoon-surface` `:hover:not(:disabled)` predicate is silently dropped from the gate; a panel `<Card>` is not `:disabled`-capable, but the hover-lift assumption should be verified for portaled/overlay content

**Location:** `cards.css:44` (`&:hover:not(:disabled)`), `H.md` §H.W2 gate ("grows to
`--shadow-cartoon-lg` on `:hover`").

**The defect (minor).** The cartoon hover-lift is gated `:hover:not(:disabled)`. The H.W2
gate asserts "resolves `--shadow-cartoon-md` at rest, `--shadow-cartoon-lg` on hover" — fine
for a panel div. But `cartoon-surface` mints a stacking context via `translate:0`
(`cards.css:36-39`, "a card surface that often hosts portaled content") — the panels DO host
portaled content (the @mbabb dropdown, selects). The hover-lift `translate` could shift a
panel that has an open portaled popover anchored to it. Not a blocker, but the visual-lock
gate should hover a panel WITH an open child popover to confirm the lift doesn't drag the
anchored portal. The synthesis never tests this.

**The CONCRETE doc edit.** Add to the H.W2 visual-lock clause: "hover a panel Card while a
child popover/select is open; assert the popover stays anchored (the `translate` lift does
not displace portaled content)." One sentence; closes a real interaction blind spot the
H.W8 interaction-axis would otherwise have to find later.

---

## FINDING HD-6 (NIT) — `_SYNTHESIS-design-language §0` claims "6 of 7 lanes" carry the gestalt move but the DL-3 specular-wire is BOOK-conditional; the "refined specular" deliverable risks being descoped silently

**Location:** `_SYNTHESIS-design-language §1 (DL-3)` ("SHIP-in-H (only on kept-specular
surfaces; else BOOK)"), §2 W2 ("If H descopes scene-interactivity, BOOK the composable").

**The defect (cosmetic but spine-relevant).** DL-3 (the `useSpecularPointer` wire — the
"refined specular" the user explicitly asked for) is conditionally BOOK-able: "if H descopes
interactivity, BOOK." Combined with HD-1 (cartoon-only panels), the failure mode is: H ships
cartoon panels, descopes interactivity, BOOKs `useSpecularPointer` → the "refined specular
hover" the user named is *entirely deferred* and D14 closes with zero specular refinement.
That is the chronic re-paper. The BOOK escape hatch on the user's literal ask should not
exist.

**The CONCRETE doc edit.** Remove the "else BOOK" on DL-3: the `useSpecularPointer` +
calmer-intensity wire (HD-2) is the kf-side proof that "refined specular" shipped; it is NOT
contingent on scene-interactivity (it is the D14 deliverable in its own right). Make DL-3
unconditional SHIP-in-H, paired with `proof:specular-calm` (HD-2) so D14 cannot close
without a refined specular actually present somewhere in the demo.

---

## The precise hover treatment I propose (the charge's direct ask)

The user wants: glass (GOOD, keep) + cartoon depth + a REFINED specular hover, all
reconciled. The composite is feasible TODAY (HD-1 empirical proof). Precise spec, all
glass-ui-owned tokens, zero glass-ui patch:

**A panel surface = three composed layers (verified to coexist live):**

| Layer | Mechanism | Rest | Hover | Source |
|---|---|---|---|---|
| **Glass** (keep) | `glass-${tier}` (auto under any surface) | `backdrop-filter: var(--glass-blur-resting)` | unchanged | glass.css:76-79 |
| **Depth** (restore) | `.cartoon-surface` | `box-shadow: --shadow-cartoon-md`, `border:2px`, `translate:0` | `--shadow-cartoon-lg` + `translate: var(--lift-sm) var(--lift-sm)` on `--spring-bouncy` | cards.css:33-47 |
| **Specular** (REFINE, don't delete) | `.glass-specular-track` + `useSpecularPointer` wire + `--specular-intensity` calmed | tracked `circle at <pointer>`, intensity **0.22** (not 0.35) | intensity **≤0.4** (not 0.6), 150ms typed-prop position settle | glass-specular-track.css:31-89 |

**The hover read:** the card *rises* (cartoon translate/shadow lift, compositor-cheap
`translate` + a paint `box-shadow`), the glass blur is constant, and a *quiet, tracked*
catch-light follows the cursor at a calmer intensity — never a centered screen-blend bloom.
The radial NO LONGER carries the hover alone (HD-1's root complaint in `a-design-language
§1`: "the radial carries the whole hover read alone"); the cartoon lift IS the hover, the
specular is a whisper that tracks. That is "refined, not deleted."

**Without the radial blur:** the "blur" the user disliked was the *centered, hot,
screen-blended, untracked* bloom (radius 55%, mask feather to 75%). Refining = (a) wire the
pointer so it TRACKS instead of pinning center; (b) drop rest intensity 0.35→0.22 and hover
0.6→≤0.4 so it whispers; (c) the glass-ui HANDOFF tightens the *default* radius 55%→≤40% and
core 0.55→0.25 upstream. The demo can do (a)+(b) today (consumer-writable
`--specular-intensity` + `--mouse-x/y`); (c) is the paired-and-gated HANDOFF.

**The KEY architectural correction the spec needs:** because `<Card surface>` emits cartoon
XOR specular, the composite REQUIRES co-applying `cartoon-surface` + `glass-specular-track`
as classes (or a demo `.cartoon-specular` recipe), NOT the surface prop alone. This is the
one place a demo class-composition is correct and inv-16-clean (both classes are glass-ui's;
the demo only co-applies what the Card prop API cannot express). H.W2 currently has no S for
this and its gate forbids it — that is HD-1.

---

## Soundness summary (the adversarial bottom line)

- **`surface="cartoon"` thesis:** CORRECT. API exists, surface map verified, glass preserved
  under cartoon, net-deletion real, no workaround. Not over-reach, not API-fictional.
- **"Does cartoon fight glass?"** NO — cartoon composes ON the glass tier (blur/bg kept);
  it is glass-WITH-depth. The user's "glass is good" is honored.
- **"Can cartoon + specular coexist on one panel?"** YES — empirically proven live (all
  three layers compose). But NOT via the `surface` prop (XOR); requires co-applied classes.
- **The real defect:** H.W2 partitions cartoon vs specular across DIFFERENT surfaces (HD-1),
  so it answers "cartoon-only panels" — NOT the user's "glass + cartoon + refined specular
  TOGETHER." That + the under-paired "refined" gate (HD-2) + the div-stage fork (HD-4) are
  the substantive fixes. The wave is implementable but ships the wrong design and gates it
  green — the chronic-re-paper the tranche exists to kill.

**Fix priority:** HD-1 (HIGH, the composite surface + coexist gate) → HD-2 (MED, kf-side
specular calming + paired gate) → HD-4 (MED, resolve the `glass-card` div stages) → HD-3
(MED, de-magic the gate counts) → HD-5/HD-6 (LOW/NIT).
