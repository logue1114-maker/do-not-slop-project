# Whole-screen production process

## Contract

This package supplies a production method: **task/source -> complete screen flow -> visual grammar -> layer and decision allocation -> control anatomy -> maintained state implementation -> actual evidence**. It is designed to extend across genres and engines. Extensibility is not exhaustive empirical validation.

Existing pinned rules retain their original authority, conditions, exceptions, draft status and supported routes. New DNS operations are draft extensions that make construction work explicit. Authored hypothetical application scenarios illustrate the method's inputs; no scenario is a source-game inspection or global palette prescription. Read [the exact AI packet](AI_INSTRUCTIONS.md) for executable operations and [the catalog](recipe-catalog.json) for selection inputs, processes, outputs, tests and exceptions.

## 1. Select by the perceptual task

Genre supports context; task determines the organizing plane.

- Continuous move/aim/read-world: protect threat/path/aim/next landing; place persistent status and local commands against the real camera envelope
- Board/puzzle: keep full relevant board, manipulated object, consequence and recovery connected; a nonrectangular field is valid
- Turn/card/tactical decision: group current actor, legal choices, cost and commitment; inspecting is distinct from acting
- Management/economy/progression: align genuine comparable values/conditions/actions, using rows/table/graph/detail only where comparison warrants them
- Exploration/collection/RPG: alternate scene-led play and concentrated object/comparison tasks; art family follows actual world identity
- Social/party/lobby/survival: expose session identity, true prerequisites/readiness and next commitment; preserve live hazards when unpaused
- Web/app/media/service: prioritize content and service decisions with native semantics; no scene pane or game relief is automatically required

These branches can coexist within one product. A real-time strategy screen might combine scene reading, comparison and live event awareness. Resolve ownership and priority together. [Machine-readable branches and applications](application-patterns.json)

## 2. Produce a complete flow before isolated polish

Draw actual entry -> real setup/readiness -> first controllable frame -> first consequence -> interruption/result -> supported return. Specify the first thing to see, next thing to understand and supported action. Mark what art/title leaves, what scene/HUD persists, when focus/input transfers and what data resets.

Do not infer modes, pause, touch support, bindings, persistence or loss semantics from a genre or screenshot. A game that starts directly in play gets a first-action contract without an invented menu. Necessary choices are preserved.

Result composition promotes the actual outcome, relevant metric and next supported action. Practice/test/record eligibility remains attached to the metric. Retry/Continue/Back describe actual source transitions; selection/equipment/cooldown is not successful execution.

Output: `SCREEN_PLAN`, `FLOW_STORYBOARD`, qualified result/return contract, unknowns.

## 3. Choose visual grammar, then resolve values

Write an art/task statement from actual scene/material/light/type/texture. A bounded variant sheet holds task/content/state/background/scale constant while testing the unresolved axis. An established coherent target may need only an adaptation sheet.

Resolve silhouette/corner/cap/outline, material/opacity, quiet ink regions, type/license/fallback, palette roles, spacing/grouping, texture scale/light direction and motion. Assign decoration to specific carriers such as a title, category crest, panel edges or divider. Dense repeated targets need not repeat every motif.

Role families share a grammar without identical anatomy: a large commitment, quiet tab, flat menu row, selected segment and read-only HUD can differ coherently. Paper, comic ink, diegetic metal, plain dark surfaces or transparent scene text are conditional options. Neither “all tactile” nor “all flat” is a universal criterion.

Every required value is numerical/native-unit or an explicit measurement task. “Cleaner hierarchy” and “polished buttons” remain unresolved until they name geometry, type, rank or state relations. If the request requires structural face/body/inner-layout change, a color/font/background-only output is incomplete.

Output: `ART_TASK_CONTRACT`, resolved `VISUAL_TOKENS`, same-data variants and rejected alternatives.

## 4. Declare all simultaneous layers

Register scene/board, host chrome, HUD, projected world prompt, menu, inventory/shop, countdown, chat, tutorial, notification and dialog only where they genuinely exist. Record visual/ink/hit bounds, coordinates, owner, priority, lifetime, input and restoration.

Use a shared reservation contract. Reserved space, reflow, collapse, queueing or replacement can be appropriate. Increasing z-index is not sufficient when it merely hides another required task. Preserve live hazards/objectives when the world continues; do not assume opening a panel pauses multiplayer action. Chat/social information may be the main task.

Measure camera/world obstructions independently from interface collision. Maintain a background/occlusion envelope across actual scenes, not one empty corner. Test bright sky, pale objects, dark walls and busy textures that real play reaches.

For transparency, define permitted underlays and quiet reading zones. A light wallet can be valid beside a dark menu family; the test is its actual scene/ink relation. Local backing, opacity, placement or type adjustment can preserve intent without making every surface opaque.

Output: `LAYER_MATRIX`, occupancy/protected-region map, `HUD_ENVELOPE`, underlay fixtures, allowed combinations and input/dismiss policy.

## 5. Construct button and panel anatomy explicitly

For every member, classify command, navigation, toggle, exclusive selection, tab, value edit, read-only status or spatial target. Separate actual hit region, visible silhouette, usable face and rendered ink. A decorative shadow is not a target.

Budget shell width from loaded label/glyph/state ink, present slots, real gaps, safe horizontal insets and chosen rim. Budget height from actual line-height/wrapping, vertical breathing room, rim and optional body. No absent icon/cost slot consumes space. Circles fit labels/timers within their usable face chord; length is not merely diameter. Compare genuine choices with shared widths where useful, while unrelated utilities retain content-based or justified widths.

Resolve label baseline/optical centering, font fallback, case/weight/line-height/numerals and actual outline/counter detail. Icons earn space through recognition/identity; nominal boxes do not guarantee equal perceived mass. Use family-level optical adjustments, avoiding per-word hacks or shrinking every label to save a silhouette.

Illustrated surfaces have separate art bounds, safe ink masks and list/footer/header bounds. Content must not invade decorative rims merely because the outer bitmap contains it. Clip/scroll/grow within the designated readable face.

Preserve original corners/caps/bolts and texture scale via native sliced/Box/Border art or separate cap-and-center pieces. Stretch quiet centers, tile repetition when scale matters, and keep live text/state/focus independent of art. Plain native/code geometry needs no slicing.

Output: `COMPONENT_CONTRACTS`, `PANEL_ANATOMY`, type/glyph specimens, asset stretch map and provenance.

## 6. Separate meaning across real states

- Hover is transient; focus is independent; press is momentary
- Selected/on/current persists; pending is unfinished; unavailable is a real predicate; result is authoritative outcome
- Focus must survive selected/pressed presentation; a green face or check does not prove completion/readiness
- Reasons require supported reading routes, not hover alone; disabled semantics and activation guards follow the real platform
- Press feedback keeps shell/hit/siblings stationary where specified; verify release-away, repeat/cancel and duplicate activation
- Motion names moving/fixed parts, geometry, purpose, timings as trials, cancellation, repeated input and reduced-motion static meaning
- Asset arrival preserves reserved geometry/readable fallback; essential art failure uses actual supported recovery
- Locale refresh updates visible values and deferred/revealed controls from the same semantic state

A source still verifies only its visible state. It cannot establish animation, target bounds, actual handlers, controller support or continuous play.

Output: state/motion/asset/locale contracts and actual required trace/specimen fixtures.

## 7. Keep the implementation easy to maintain

Trace real entry -> input -> legality/state -> presentation. Name owners before editing: “To change X, edit Y because Y owns Z.” Preserve actual boundaries that are already good.

Separate real reasons to change: game/domain rules, presentation, visual tokens/assets, input/controllers and actual persistence/platform integration. Domain rules do not import views or read DOM/global storage; views do not decide legality or send orders. Controllers dispatch; the rule owner decides success. Visual dimensions cannot silently alter world targeting.

Document required inputs, output shape, mutation policy, errors/side effects and initialization/disposal. Save schema/migration exists only if persistence does. Use explicit dependencies, intentional names and comments for invariants/tradeoffs. Do not invent speculative managers or file-count architecture.

Characterize behavior through the real entry; refactor incrementally. Check failure, recovery, repeat, disposal after meaningful state changes and dependency direction where promised. Keep behavior change and refactoring separately scoped. [Detailed roles](IMPLEMENTATION_ROLES.md)

## 8. Verify actual craft and behavior separately

Inspect whole scenes first, native control/state crops second. Gate composition, material/shape/type/texture construction, responsive/locale/state/motion and actual flow/input independently. Verify protected behavior/data/source parity separately.

The before -> intent -> actually rendered ledger names required silhouette/length, face/rim/body or permitted flatness, typography/glyph, internal layout, local rank, supported state and scene relation. Freeze the target before polish; stop adding ornament when required relations are met. Record optional taste separately; user approval remains its own gate.

Match fixture/data, exact source/revision, viewport, DPR, zoom, logical/capture units, locale/text scale, loaded font, background/camera and milestone. Unknown calibration means inconclusive comparison. Source/hash/schema success is neither a visual pass nor evidence that the user likes the design.

Use pass/fail/not_run/blocked/inconclusive literally. Every actual claim has attributed locatable evidence. If an axis is missing, repair and recheck. No supplied target implementation means no functioning redesign, After screenshot or behavior pass.

## Reusing and extending the catalog

Select recipes through their actual trigger/input/exception records. Use `recipe-details.json` to recover all original construction detail and mapping. Add a draft operation only when existing rules leave a concrete production gap; record observation versus inference, trigger, output, exception and test. Do not duplicate a slogan or promote a sample palette into a rule.

Private source-case identities, build metadata and inspection records are omitted from this public copy. The retained conditional guidance and authored scenarios do not establish target implementation acceptance. Four verified web construction sources support bounded methods; unavailable video frames/transcripts supply no new method evidence. [Evidence and rights](RIGHTS_AND_EVIDENCE.md), [future honest comparison protocol](COMPARISON_PROTOCOL.md)
