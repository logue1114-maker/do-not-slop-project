# Research and example index

Use the [main README](../README.md) to choose a guide and begin a task. This index keeps the detailed source routes, archived runs, screenshots, and checks in one place. Existing research and evidence files are unchanged.

## Guides and source observations

- [Research overview](../research/antislop_research.md), [series architecture](../research/series_architecture.md), [series index](../research/series_index.json), [structured rules](../research/rules_catalog.json), and [measurement checklist](../research/measurement_checklist.json)
- Games: [controls and HUD manual](../research/game_controls_corrections_v2.md), [RPG/card research](../research/games_rpg_card_research.md), [source-coverage boundaries](../research/games_rpg_card_sourcecoverage.md), and [fleet-command research](../research/strategy_controls_oct4/strategy_controls_research.ko.md)
- Web: [layout manual](../research/web_app_corrections_v2.md), [shopping/information/learning observations](../research/web_shopping_information_learning.md), [booking manual](../research/booking_flows_oct4/booking_manual_ko.md), and [booking same-fixture contract](../research/booking_flows_oct4/same_fixture_spec_ko.md)
- Apps: [mobile layout manual](../research/mobile_app_corrections_v1.md) and [browser games, learning, and productivity observations](../research/browser_games_apps.md)
- UI copy: [manual](../research/do_not_slop_copy/manual_ko.md), [nine operational rules](../research/do_not_slop_copy/rules.json), [15 sources](../research/do_not_slop_copy/sources.json), and [interactive examples](../research/do_not_slop_copy/copy_examples.html)
- Authored visual boards: [web](../research/web_app_v2/visuals/), [mobile](../research/mobile_app_v1/boards/), and [booking](../research/booking_flows_oct4/visuals/). SVG originals and PNG renders use synthetic conditions; they are not redistributed product screenshots

The series architecture includes planned case families. Its entries do not mean that each family has a completed runnable gallery. Follow the actual files and package status.

## CP01 shared-reference pair

The [original trial package](../research/instruction_trial_01/README.md) preserves two actual first-pass redesign outputs. Both received the same authored English reconstruction as a styled HTML starter, the same fixture, and the same quality-redesign request. The guided run also received the exact archived v1 instructions and CP01 guide. The archived “ordinary request” label belongs to this shared-reference setting, not a no-reference from-scratch baseline.

| Artifact | Source | Desktop capture | Narrow capture |
| :--- | :--- | :--- | :--- |
| Authored English reference | [HTML](../research/instruction_trial_01/reference/reference-en.html) | [Reference](../research/instruction_trial_01/screenshots/reference-desktop.jpg) | Not included |
| A · Unguided quality redesign | [First-pass HTML](../research/instruction_trial_01/alpha/index.html) | [A desktop](../research/instruction_trial_01/screenshots/alpha-desktop.jpg) | [A narrow](../research/instruction_trial_01/screenshots/alpha-narrow.jpg) |
| B · Project-guided redesign | [First-pass HTML](../research/instruction_trial_01/beta/index.html) | [B desktop](../research/instruction_trial_01/screenshots/beta-desktop.jpg) | [B narrow](../research/instruction_trial_01/screenshots/beta-narrow.jpg) |

- Inputs: [fixture](../research/instruction_trial_01/fixture.json), [common ordinary brief](../research/instruction_trial_01/prompts/A-plain.txt), [guided brief](../research/instruction_trial_01/prompts/B-guided.txt), [archived v1 AI instructions](../research/instruction_trial_01/AGENTS.v1.md), and [v1 task-first guide](../guides/cp01-task-first.md)
- Evidence: [protocol and limits](../research/instruction_trial_01/protocol/PROTOCOL.md), [run record](../research/instruction_trial_01/protocol/run-record.json), [verification checklist](../research/instruction_trial_01/checks/verification-checklist.md), [browser observations](../research/instruction_trial_01/checks/BROWSER_OBSERVATIONS.md), and [blinded artifact review](../research/instruction_trial_01/protocol/REVIEW_FINDINGS.md)

The screen-internal Before/After labels describe authored copy specimens. They do not label the model-run arms. Both runs requested `gpt-6.1-sol` with `xhigh` reasoning and retained one first pass with no implementation repair. The review's 10/12 and 11/12 descriptive subtotals do not establish a winner. B required more scrolling and placed its boundary below the first desktop frame. User approval, measured usability, and general effectiveness remain unestablished; no fixed time budget was enforced.

For new pairs, follow [honest comparisons](HONEST_COMPARISONS.md). The baseline asks for a polished, attractive, complete result with the same functional/data requirements; only the treatment gets the frozen guide/reference/intention. A guide-plus-reference bundle does not isolate a guide effect. A fresh pair is planned, not run.

## CP01 guided iteration with guide v2

The [v2 package](../research/instruction_trial_02/README.md) is one post-review guided iteration. The main README juxtaposes its final capture with the authored English reference; neither screen is an ordinary no-reference baseline.

- [Guide v2](../guides/cp01-task-first-v2.md), [portable task brief](../research/instruction_trial_02/prompts/CP01-guided-iteration.txt), and [unchanged fixture copy](../research/instruction_trial_02/fixture.json)
- [Untouched first-pass source](../research/instruction_trial_02/implementation/first-pass/index.html), [final source](../research/instruction_trial_02/implementation/index.html), and [run/change/verification record](../research/instruction_trial_02/run-record.json)
- [Final desktop capture](../research/instruction_trial_02/screenshots/revision2-desktop.jpg) and [final narrow capture](../research/instruction_trial_02/screenshots/revision2-narrow.jpg)

The sole implementation repair increased summary padding from 10px to 12px. The same copy specimens, document facts, and local actions remain. White/charcoal/blue is the project's case-specific proposal. Native-phone, screen-reader, and 200% zoom/reflow checks remain unrun; user approval and measured usability are unestablished.

## White-page button/color combinations by purpose

The [palette package](../research/white_surface_palettes_v1/README.md) contains six independent authored proposals applied to three fixed synthetic interfaces. Changing a palette preserves each interface's fixture, layout, state, and behavior. These are color-role examples, not an instruction-effect experiment or official brand styles.

| Purpose | First scheme capture | Second scheme capture |
| :--- | :--- | :--- |
| Work | [Ink signal · charcoal/cool slate](../research/white_surface_palettes_v1/screenshots/work-ink.jpg) | [Cobalt edge · cobalt/blue-gray](../research/white_surface_palettes_v1/screenshots/work-cobalt.jpg) |
| Order review | [Forest receipt · forest/gray-green](../research/white_surface_palettes_v1/screenshots/order-forest.jpg) | [Terracotta order · clay/warm gray](../research/white_surface_palettes_v1/screenshots/order-terracotta.jpg) |
| Learning | [Plum margin · plum/violet-gray](../research/white_surface_palettes_v1/screenshots/learning-plum.jpg) | [Petrol chapter · petrol/slate](../research/white_surface_palettes_v1/screenshots/learning-petrol.jpg) |

- [Runnable explorer source](../research/white_surface_palettes_v1/index.html), [six exact role sets](../research/white_surface_palettes_v1/palettes.json), [fixed fixtures](../research/white_surface_palettes_v1/fixtures.json), and [purpose-specific AI rules](../research/white_surface_palettes_v1/ai-implementation-rules.md)
- [Six official-source examples and limits](../research/white_surface_palettes_v1/sources.html), [representative narrow order capture](../research/white_surface_palettes_v1/screenshots/order-narrow.jpg), [bounded browser observations](../research/white_surface_palettes_v1/browser-observations.md), and [first-pass/repair history](../research/white_surface_palettes_v1/repair-log.md)

Desktop captures use 1165 × 747 outer frames; the narrow order capture uses 390 × 844 with 375px document width. Captures show initial states, not every interaction or full page. Full keyboard traversal, screen-reader, native-phone, 200% zoom, and complete console audit remain unrun. User approval and measured usability are unestablished. Green remains an available action color.

## Game UI playground: first component bundle

The [English playground](../research/game_ui_playground_v1/README.md) makes minimap rotation/zoom/markers, inventory comparison/equipment and shop review/cancel/confirmation directly adjustable. Two smaller examples cover cooldown/pause and quest/reward. This is the first bundle for exploring overlooked game details; richer hit response, interaction priority, checkpoint return, save/reconnect and tutorial re-entry remain future work.

- [Runnable entry](../research/game_ui_playground_v1/index.html), [settings JSON](../research/game_ui_playground_v1/config.json), [input/output contract](../research/game_ui_playground_v1/functional-contract.json), and [developer extension points](../research/game_ui_playground_v1/IMPLEMENTATION.md)
- [Desktop captures](../research/game_ui_playground_v1/contact-sheet-desktop.png), [phone viewport captures](../research/game_ui_playground_v1/contact-sheet-mobile.png), [136 browser / 55 source checks and limits](../research/game_ui_playground_v1/BROWSER_REPORT.md), and [public integration checks](../research/game_ui_playground_v1/PUBLIC_INTEGRATION.md)

These are independently authored proposals and synthetic flows, not an actual ordinary/guided A/B experiment, user-approved design or native-phone usability result. [Official game-specific sources](../research/game_ui_playground_v1/sources.json) are link-only; no third-party game screenshot bytes are included.

## Five game interface presets

The [English gallery](../research/game_interface_presets_v1/README.md) contains five distinct functional slices: RPG inventory/equipment, card selection/play/end turn, crate puzzle move/undo/retry, strategy select/preview/confirm/cancel and action movement HUD/pause/cooldown/retry. [Presets](../research/game_interface_presets_v1/presets.json) contain design/flow instructions; [functional requirements and data](../research/game_interface_presets_v1/functional-fixtures.json) exclude specific design direction for possible later matched requests.

[Desktop](../research/game_interface_presets_v1/contact-sheet-desktop.png) and [narrow](../research/game_interface_presets_v1/contact-sheet-narrow.png) contact sheets show retained original captures. [Browser checks and limits](../research/game_interface_presets_v1/BROWSER_REPORT.md) and [first-pass repairs](../research/game_interface_presets_v1/REPAIR_LOG.md) distinguish implementation evidence from unrun phone/controller/screen-reader/usability tests. This is an authored/guided demonstration, not an experiment or approved final design; the [honest protocol](HONEST_COMPARISONS.md) remains unchanged.

## Six authored web-interface presets

The [six-flow gallery](../research/web_interface_presets_v1/README.md) covers shopping, information, course, community, work and booking. [Functional requirements/data](../research/web_interface_presets_v1/functional-requirements.json) and [specific design instructions](../research/web_interface_presets_v1/design-instructions.json) are separate. [First-pass/repair history](../research/web_interface_presets_v1/REPAIRS.md), [original-source/capture provenance](../research/web_interface_presets_v1/public-integration.json), [presets and geometry](../research/web_interface_presets_v1/presets.json), and [bounded browser results](../research/web_interface_presets_v1/BROWSER_REPORT.md) do not establish a comparison-arm result, measured improvement or design approval.

The earlier [learning layout](../research/comparison_assets/learning_layout/README.md) and [booking-change demo](../research/booking_flows_oct4/demo/README.md) remain distinct packages.

## Run and check

From the repository root, serve the files locally:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

| Example | Local URL |
| :--- | :--- |
| English CP01 reference | http://127.0.0.1:8765/research/instruction_trial_01/reference/reference-en.html |
| CP01 unguided shared-reference redesign | http://127.0.0.1:8765/research/instruction_trial_01/alpha/ |
| CP01 initial guided output | http://127.0.0.1:8765/research/instruction_trial_01/beta/ |
| CP01 final guide-v2 iteration | http://127.0.0.1:8765/research/instruction_trial_02/implementation/ |
| White-surface palette explorer | http://127.0.0.1:8765/research/white_surface_palettes_v1/ |
| Six web interface presets | http://127.0.0.1:8765/research/web_interface_presets_v1/ |
| Five game interface presets | http://127.0.0.1:8765/research/game_interface_presets_v1/ |
| Game UI playground: first component bundle | http://127.0.0.1:8765/research/game_ui_playground_v1/ |
| Fleet command | http://127.0.0.1:8765/research/strategy_controls_oct4/demo/ |
| Booking change | http://127.0.0.1:8765/research/booking_flows_oct4/demo/ |
| Learning layout | http://127.0.0.1:8765/research/comparison_assets/learning_layout/same_fixture_learning.html |
| Nine UI-copy examples | http://127.0.0.1:8765/research/do_not_slop_copy/copy_examples.html |

These examples use Python 3 for serving and Node.js/Python 3 for the checks below. The self-contained CP01, palette, learning, and copy HTML can also open directly. Fleet command fetches its adjacent fixture over HTTP. Booking keeps its reviewed fixture one directory above `demo/`; preserve that relationship when copying the source.

All actions are local demonstrations. They do not create actual bookings, accounts, payments, uploads, or subscriptions. Refreshing resets in-memory state. GitHub displays HTML source; use the local server to run it.

### Source checks

Run only the checks for the changed scope. These commands may refresh their scoped result files. Package/source tests are separate from real browser input and usability checks.

```sh
node --test research/strategy_controls_oct4/demo/tests.mjs
node research/booking_flows_oct4/demo/test-model.cjs
node research/booking_flows_oct4/demo/test-app-wiring.cjs
python3 research/comparison_assets/learning_layout/tests/test_source.py
python3 research/do_not_slop_copy/validate.py
python3 plugins/review-visible-design/validation/validate_package.py
python3 research/instruction_trial_01/checks/validate_trial.py
node research/instruction_trial_02/checks/verify-source.mjs
node research/white_surface_palettes_v1/verify-local.mjs
node research/web_interface_presets_v1/verify-source.mjs
node research/web_interface_presets_v1/tests.mjs
node research/web_interface_presets_v1/verify-http.mjs
node research/game_ui_playground_v1/verify-public.mjs
python3 validation/build_inventory.py
python3 validation/validate_release.py
python3 validation/build_inventory.py
```

The release validator writes its own receipt; rebuild the inventory afterward so it records the final receipt bytes. The [verification record](VERIFICATION.md) states what was checked and what remains unrun. Exact-byte fixtures and runtime helpers remain preserved; no fixture hash or evidence requirement was relaxed to obtain a pass.

## Status, rights, and release records

- [Review-visible-design helper draft.3](../plugins/review-visible-design/README.md): uninstalled, with host/model activation and other declared gates unestablished
- [Rights and scope](RIGHTS_AND_SCOPE.md): no selected reuse license; third-party rights remain unknown/link-only
- [Verification and remaining gates](VERIFICATION.md): source checks, bounded browser observations, and unrun accessibility/host/usability work
- [Changelog](CHANGELOG.md), [release provenance](PROVENANCE.json), [preserved input bytes](PRESERVED_INPUTS.sha256.json), and [file inventory](../FILES.sha256.json)
- [AI contributor instructions](../AGENTS.md), including [actual-use acknowledgement and optional-star safeguards](../AGENTS.md#8-acknowledge-actual-use-and-offer-an-optional-star)

External sources remain links and bounded summaries. Historical material does not establish a current product's behavior. Article bodies, raw third-party media/font bytes, original capture archives, and uncleared generated art are excluded from the public source.
