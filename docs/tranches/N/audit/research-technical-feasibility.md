# Technical Substrate, Feasibility, Engine Dogfood

> Research lane brief — DK64 carousel scene-switcher (Tranche N), 2026-06-17.

## Summary

The barrel selector scene switcher is feasible. The hard problem of seven living previews without performance death is solved by bespoke lightweight idle loop mini previews gated by content visibility, never real scenes. Motion dogfoods the light engine: the ring rides one SpringProgress over a single ring angle scalar, the spin uses a SpringProgress jump free re seat, and reveals use stagger. Integration augments the dock scene Select as a Teleport overlay and commits through the existing runSceneSwitch and startViewTransition. The central blocker is the absent KeepAlive, so the selected state rides the existing sceneMachine snapshot. Accessibility and reduced motion are largely solved already.

## Findings

### Single switch funnel; augment not replace

ChromeDock emits switch-scene to App.vue runSceneSwitch (App.vue lines twelve and 376) which wraps the synchronous mutate in startViewTransition (useSceneTransition.ts). The dock scene Select is in ChromeDock.vue and fires warmScene on pointerenter. The picker should invoke on that trigger and commit via runSceneSwitch so the View Transition, focus routing, and machine reconcile all come free.

### NO KeepAlive is the central state preservation constraint

App.vue mounts the scene host as a bare keyed Suspense with no KeepAlive and no wrapping Transition; the code comments and useSceneSwap.ts record that wrapping a keyed Suspense over a defineAsyncComponent never triggered the chunk fetch, so amiga, square, easing, and spring shipped blank viewports. Preserve selected state via the sceneMachine PlaybackSnapshot plus the ScenePlayback snapshot and restore on a fresh mount, never KeepAlive.

### Scenes are HEAVY; ring rides LIGHT primitives

AmigaScene imports full three.js plus OrbitControls plus a WebGL render loop; CubeScene composes the matrix editor, orbital drag, and three AnimationGroups; seven concurrent live targets including a WebGL context (browser cap roughly eight to sixteen) is performance death. Use one SpringProgress or NumericAnimation over a ring angle scalar with each barrel transform by trigonometry, NOT fromMotionPath, which is HEAVY (it statically imports the engine, lives behind loadAnimationEngine, and models one element over one DOM offset path). The spin sets the spring target with a jump free closed form re seat; reveals use stagger; all own RAFPlayback, honoring the no hand rolled rAF invariant.

### content visibility gating; CSS three D stage; per scene previews; a11y

Off ring preview loops pause via content-visibility auto plus the contentvisibilityautostatechange event (Baseline since September 2025; supports-not fallback to IntersectionObserver with a rootMargin), pairing with the existing contain paint on the host. The downlight stage is a CSS perspective container with a rotateX floor near fifteen degrees plus a conic or radial gradient spotlight on the existing rainbow, face, and subject teal tokens; mounted as a Teleport to body with its own view transition name distinct from the scene host name; warmScene prefetches on hover and predictively warms the center adjacent barrel. Per scene previews: cube a CSS three D cube, amiga a two D Boing ball NOT three.js, square the real box scaled, easing a bezier tracing dot, spring a settling ball, sequence staggered dots, and motion path a CSS offset path traveller sampled from the editable points. The carousel is a roving tabindex listbox (Arrow, Home, End, Enter to commit, inert behind, Escape to dismiss); focus on transition finished already exists; reduced motion snaps the orbit, collapses stagger, kills the View Transition, and degrades the hover brighten.

## Recommendations

- **[Living preview strategy (the hard problem)]** HYBRID: bespoke lightweight idle loops for all seven scenes (each dogfooding NumericAnimation, SpringProgress, or stagger), gated by content visibility plus the contentvisibilityautostatechange event so only the three to five visible barrels run a loop; a real scene instance only as a single on hover closer look for the centered barrel if a bespoke loop is insufficiently faithful.
  - _Rationale:_ Real seven up is infeasible (WebGL context cap, seven rAF loops, three.js, Monaco, and orbital weight); bespoke loops are about seven small components; content visibility caps the active loop count; the no hand rolled rAF invariant is met because each preview rides a light primitive RAFPlayback loop.
- **[Carousel motion primitive]** One SpringProgress or NumericAnimation over a ring angle scalar with barrel transforms by trigonometry; the spin sets the spring target for a velocity continuous re seat; reveals stagger from the center. Keep the entire picker on the LIGHT barrel; do not import fromMotionPath or loadAnimationEngine.
  - _Rationale:_ A single scalar spring for N barrels is order one loops and value.js free; fromMotionPath is HEAVY, needs a DOM offset path, and models one element per path; the SpringProgress closed form re seat makes interruption jump free for free.
- **[Overlay, commit, and state]** Mount the stage as a Teleport to body at the modal z layer with its own view transition name; open and close by wrapping the toggle in the glass startViewTransition; commit selection by calling the existing runSceneSwitch, never forking a second nav path; preserve via the sceneMachine snapshot and ScenePlayback restore, never KeepAlive.
  - _Rationale:_ Reuses the proven funnel (machine reconcile, focus routing, and the no View Transition spring fallback all intact), avoids router entanglement, and makes the liquid glass enter a compositor transition; KeepAlive is a known async loader blocker.
- **[Prototype and dev to implementation boundary]** Build a standalone prototype with placeholders demonstrating the downlight stage CSS, a seven barrel ring orbiting on one SpringProgress, click to spin with a velocity continuous re seat, a stagger reveal, the hover brighten, content visibility gating, and full keyboard and reduced motion accessibility; implementation then wires the seven bespoke preview loops, warmScene prefetch, the Teleport overlay into App.vue, and the runSceneSwitch commit.
  - _Rationale:_ The motion, stage, accessibility, and performance gating are scene agnostic and provable on placeholders, de risking the audacious visual without touching the fragile async loader and machine wiring; only preview fidelity and App integration genuinely need the real scenes.

## Risks

- ⚠ **Re-introducing a wrapper around the keyed Suspense (KeepAlive or Transition) to keep previews alive would re-break the async scene loader, the blank viewport regression.**
  - _Mitigation:_ Hard rule: the scene host stays a bare keyed Suspense; all state preservation goes through the sceneMachine snapshot; the picker overlay is a sibling Teleport, never a wrapper of the scene host.
- ⚠ **Pulling fromMotionPath or loadAnimationEngine into the picker imports the heavy engine chunk and value.js into a light interaction layer; a WebGL amiga preview would burn a scarce WebGL context even while idle.**
  - _Mitigation:_ Constrain the picker to light barrel exports only (SpringProgress, NumericAnimation, stagger, SmoothProgress); the motion path preview uses plain CSS offset path; the amiga preview MUST be a two D CSS Boing ball, never a three.js instance.
- ⚠ **content visibility is recent Baseline so older Safari will not gate off ring loops; multiple colliding view transition names silently skip the transition.**
  - _Mitigation:_ Add a supports-not fallback to IntersectionObserver and cap concurrent loops to the center adjacent barrels; assign the clicked barrel its shared name only transiently and clean it up on transition finished, keeping the overlay name distinct.
- ⚠ **Invoking the picker from inside the dock slot can hit the dropdown open and close plus layer collapse races the dock has historically had.**
  - _Mitigation:_ Invoke from the dock scene Select trigger (the reka pointerdown path that works) but mount the stage as a Teleport in App.vue, surfacing the open state to ChromeDock so the dock stays expanded while the picker is open.

## Open questions

- Should the picker replace the dock scene Select entirely or augment it? The Select is the keyboard accessible baseline; replacing it risks regressing accessibility.
- How faithful must each idle preview be, a literal mini render of the subject or an evocative abstraction, and does the new idle animation state requirement apply to the real scenes (authoring an idle state in all seven components) or only to the carousel preview?
- What is the performance budget (frame rate floor or interaction latency) on the slow Linux CI runner given the device dependence greening history, and should the centered barrel closer look be the bespoke loop scaled up or a one time on demand mount of the real scene target?
