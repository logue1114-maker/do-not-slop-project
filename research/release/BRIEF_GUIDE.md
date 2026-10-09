# Fill the production brief

Use `brief.schema.json` with one complete packet, not separate uncoordinated button requests. The two included examples demonstrate filled shapes and concrete trial values; neither is a working game.

- `packet_version`: 1.0.0
- `readiness`:proposal until design-changing task/flow unknowns, unresolved visual values and coordinate mapping are resolved; implementation_ready denotes record completeness only
- `task`:goal/current exact state ID/next action/context/time pressure/allowed scope/unknowns
- `protected_behavior`:actual legality, inputs, data, outcomes, loss/reset, persistence/network and side effects to retain
- `selected_recipes`:real catalog IDs selected through trigger/input/exception checks, not genre alone
- `screen_flow`:all in-scope states, reading order, scene/task region, local decision, utilities and actual transition event/to/preserves/resets/input owner
- `visual_grammar`:art relation, material/silhouette/type/palette/spacing/motion, actual value/unit/role/rationale records and explicit unresolved values
- `layer_owners`:every actual concurrent layer with unique ID, owner, state membership, bounds/lifetime/priority/input/collision policy
- `control_families`:semantic role, members, target/face/ink/insets/boundary/body/icon/width/safe ink/texture and real supported states
- `platform_adapter`:native units, actual viewports/provenance/device status, inputs/safe area/calibration/focus/host chrome
- `source_evidence`:unique evidence IDs mapped to source IDs, inspection level, bounded observation, transfer condition, exception and rights
- `maintainability`:actual owner responsibilities/forbidden ownership, entry/change map/lifecycle/dependency direction
- `verification`:required whole states/input traces/layer combinations/parity/user review and actual gate status/reviewer/evidence
- `limitations`:unrun or blocked facts the reader must not mistake for a pass

For each selected recipe keep a selection record beside the brief: trigger values, source evidence, known/unknown condition status, checked exceptions, applicable/conditional/not_applicable decision and rejected alternative. `selection-record.template.json` is a planning template; it is not executable evidence or an approved decision.

Run `python validator.py brief YOUR_PACKET.json`. It validates the shipped schema and local recipe/source references. Proposal records may legitimately contain unresolved values. Implementation-ready requires explicit unresolved/unknown lists empty and coordinate mapping verified. Natural-language truth is not authenticated: declaring a value resolved cannot substitute for actual measurement.

## Optional declaration-consistency checks

Older packets remain valid without these optional fields. To make a flow contract machine-checkable, add `input_mode` and `action_events` to each screen state and `trigger_kind` to its transitions. Action names reference that state's exact `user_input` transition events. A `read_only` state has no action events or secondary actions; its separately classified `internal_event` transitions may still advance on authoritative acknowledgement.

A verification gate may declare exact `state_ids` and `event_names`. `covers_complete_flow: true` checks the state set, and an input gate also checks the whole transition-event set. This includes internal events as observed outcomes, not user actions. Gate prose refers to those records instead of maintaining another parallel list.

Spacing can declare `token_refs` for gap/inline/block inset and use `${token_name}` placeholders in its strategy. Values remain in `values_and_units`; the validator's `declared_consistency.resolved_spacing_strategy` expands them into readable numbers with their declared units. Use that resolved strategy in the maker packet. Missing/duplicate token names and duplicated numeric spacing literals are errors in this opt-in form. The example's current trials resolve to an 8 CSS px gap, 12 CSS px inline inset and 8 CSS px block inset.

These checks establish consistency between explicit declarations. Gate event_names checks a set of names, so repeated event names in different states do not prove distinct per-transition coverage. A declared pass remains unverified, including when its evidence list is empty. Optional declarations may be absent from legacy packets. None of these checks authenticates arbitrary prose, inspects pixels, executes an action, proves numerical suitability or verifies submitted gate results.

The CLI always reports structure_only, visual_quality=not_assessed and behavior=not_executed. A submitted gate's pass remains a declaration; actual evidence and human inspection establish the production gate.
