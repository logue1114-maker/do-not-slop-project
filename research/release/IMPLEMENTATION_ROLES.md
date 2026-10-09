# Maintainable implementation roles

Apply these roles only where the target really has independent reasons to change. They describe ownership, not a mandatory class hierarchy or file-count target. The validator is the only shipped executable here; game source owners below are implementation guidance until traced and tested in a target.

## Before editing

Trace one real entry/action: startup -> platform event -> semantic command -> legality/cost/transition -> authoritative state -> rendered output. List public contracts and protected behavior. Produce an edit map:

- To change control silhouette, edit the token/component owner because it owns visual geometry
- To change local arrangement, edit the presentation/layout owner because it projects task state into regions
- To change legality, cost, cooldown, score or reset scope, edit the domain owner only within approved behavior scope
- To change key/controller/touch mapping, edit the input adapter because it translates physical events
- To change save/rejoin lifetime, edit the actual persistence owner only when it exists and is in scope

Do not infer actual filenames from these examples; locate the real owners.

## Domain / game rules

Own legal actions, costs, eligibility, transitions and actual outcomes. Inputs and outputs have explicit shapes and mutation policies. No view/DOM/style imports, implicit browser storage reads or appearance-based readiness. World targeting/collision coordinates are domain values, not visual button dimensions.

Test zero/exact/insufficient/stale resources, repeated commands, lock conditions, true result qualifiers, Retry/Back loss scope and supported failures. Server acknowledgement remains authoritative where the real product uses it.

## Presentation and presentation state

Own screen map, selected inspection context, list/scroll restoration, scene/HUD composition, view projection and state-dependent content. Persistent selected/equipped state is not keyboard focus. Reading order and local commitment remain explicit.

A view reads authoritative domain state and dispatches semantic intent through the input boundary. It must not silently decide legality, modify scores or send external orders. Avoid duplicating domain state in multiple controls.

## Visual tokens / assets / components

Own material/type/palette/geometry values, art stretch zones, safe ink masks, control families and supported visual states. Keep loaded fonts/provenance and asset lifecycle visible in the contract. Labels/state/focus remain independent of background art.

Geometry tests can confirm calculated bounds or state data, but actual rendering must confirm glyph mass, rim/body/light/texture scale, distortion and hierarchy. Do not treat class names or token presence as visual evidence.

## Input / platform adapters

Own translation of native pointer/key/controller/touch to semantic commands, focus graph, safe-area/host geometry, engine projection and platform semantic widgets. Preserve release-away, repeat/cancel, duplicate activation and supported modality.

Keep logical, image, device and world units distinct. Actual controller/touch and hardware verification are separate from a desktop screenshot. Native disabled and focusable unavailable controls have different activation/readability contracts; select the target's actual behavior.

## State lifetime / persistence / network

Own initialization, current-session lifetime, snapshots and actual durable save/version/migration where present. External loading, clocks, services and acknowledgement have explicit owners and failure behavior. Do not add persistence or a network manager solely to fill this list.

Document disposal of subscriptions/listeners/timers and asynchronous response ownership after state changes. Verify cleanup after a meaningful transition, not only a fresh screen.

## Dependency and test discipline

- Prefer the target's existing good boundary and dependencies; no ornamental wrapper around each function
- Configuration belongs to the role it changes; unexplained constants become named local values or justified tokens
- Comments explain invariants, side effects and tradeoffs; misleading/redundant narration is removed
- Characterize protected behavior through the real entry before refactoring
- Separate structural refactoring from intentional behavior change
- Add a bounded dependency guard only if direction is contractual, and demonstrate that it rejects one forbidden edge
- Recheck repeated/failure/recovery/lifecycle behavior after relevant source edits
- Preserve baseline evidence and user changes; do not manufacture a poor baseline or overwrite a reviewed output

## Handback

Request and owner; entry point and touched roles; protected contracts and deliberate behavior changes; dependencies/side effects/init/disposal; scoped diff/runnable entry; commands with actual results and unrun limits; remaining reviewer evidence. This makes maintenance inspectable without claiming measured human productivity from file counts.
