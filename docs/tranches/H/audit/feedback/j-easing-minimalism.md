# J — easing sidebar minimalism (round-4 feedback, 2026-06-08)

Captured for fold-in to **H.W12** (the easing/sequence/path enrichment + standardization
wave) AFTER H.W11 lands its easing-sidebar normalization (anchoring against the stable
post-W11 state, not the moving W11-in-flight source). The user's screenshot shows the
easing sidebar mid-W11: a "value" label + a text input ("ease") + copy button, the easing
dropdown, a short "duration" slider, and the "ease" scene title above.

The user's exact direction:
> "within easing, we should just have the dropdown--no text input; duration slider should be
> the full length of the card, too; and remove the 'value' label; remove the double container
> therein, and remove the 'ease' title--more like controls--and make the bezier visualizer
> bigger as such."

The J-items (easing sidebar → minimal, controls-like):
- **J1** — REMOVE the easing "value" TEXT INPUT (+ its copy button if it only served the
  input). The DROPDOWN is the sole easing selector; no redundant text field.
- **J2** — REMOVE the "value" LABEL (it labels the text input being removed).
- **J3** — the DURATION slider spans the FULL WIDTH of the card (not the short track).
- **J4** — REMOVE the DOUBLE CONTAINER in the easing sidebar (one container, flat — the
  W11/W10 normalization continues; verify no nested wrapper survives).
- **J5** — REMOVE the "ease" scene TITLE at the top of the easing sidebar — make it read
  like the standard controls (which carry no big per-scene title).
- **J6** — make the bezier visualizer BIGGER, using the vertical space freed by J1/J5
  (composes with H.W11's I7 bezier-grow — J pushes it further now that the text input +
  title are gone).

These are bounded easing-sidebar refinements (no architecture change). They fit H.W12's
"standardization + enrichment" theme and the W11 easing normalization. Fold as an H.W12
scope clause (J) with born-RED→green gates: proof:easing-sidebar-minimal (no text input, no
"value" label, no "ease" title, single container, full-width duration) + the bezier-grow
clause extended (taller still). Reconcile with H.W11's proof:easing-sidebar-normalized +
proof:bezier-grown + proof:label-subgrid (J removes a row the subgrid no longer needs).
