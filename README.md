# Do Not Slop Project

Research, operational rules and runnable synthetic comparisons for clearer interface layout, task flow and UI copy. Most manuals are written in Korean. Examples separate source observations, authored proposals and unknowns, and preserve content/state when comparing presentations.

This first public source release includes three local demos, nine interactive UI-copy examples, original comparison boards and a bounded review-plugin draft. No reuse license has been selected. The plugin is not installed, adopted or officially approved; code checks do not establish measured usability improvement.

## Read and explore

- [Research overview](research/antislop_research.md), [series structure](research/series_architecture.md) and [index](research/series_index.json)
- [Structured rules](research/rules_catalog.json) and [measurement checklist](research/measurement_checklist.json)
- [Web layout manual](research/web_app_corrections_v2.md), [mobile layout manual](research/mobile_app_corrections_v1.md) and [shopping/information/learning observations](research/web_shopping_information_learning.md)
- [Game controls manual](research/game_controls_corrections_v2.md), [RPG/card research](research/games_rpg_card_research.md) and [source-coverage boundaries](research/games_rpg_card_sourcecoverage.md)
- [Fleet-command research](research/strategy_controls_oct4/strategy_controls_research.ko.md), [booking manual](research/booking_flows_oct4/booking_manual_ko.md) and [booking comparison contract](research/booking_flows_oct4/same_fixture_spec_ko.md)
- [UI-copy manual](research/do_not_slop_copy/manual_ko.md), [nine operational rules](research/do_not_slop_copy/rules.json), [15 sources](research/do_not_slop_copy/sources.json) and [interactive examples](research/do_not_slop_copy/copy_examples.html)
- [Review-visible-design plugin draft.3](plugins/review-visible-design/README.md)

Original boards are in [web visuals](research/web_app_v2/visuals/), [mobile boards](research/mobile_app_v1/boards/) and [booking visuals](research/booking_flows_oct4/visuals/). SVG originals and PNG renders are included. They are authored proposals using synthetic conditions, not redistributed product screenshots.

## Run locally

Python 3 and Node.js are enough. No build step, package install, login, API key or network service is needed.

From the repository root:

    python3 -m http.server 8765 --bind 127.0.0.1

Then open:

- Fleet command: http://127.0.0.1:8765/research/strategy_controls_oct4/demo/
- Booking change: http://127.0.0.1:8765/research/booking_flows_oct4/demo/
- Learning layout: http://127.0.0.1:8765/research/comparison_assets/learning_layout/same_fixture_learning.html
- Nine UI-copy examples: http://127.0.0.1:8765/research/do_not_slop_copy/copy_examples.html

The learning and UI-copy HTML files also open directly in a browser. Fleet command loads its adjacent fixture over HTTP. Booking keeps its reviewed fixture one directory above demo/; keep that relationship when copying the source.

All actions are local demonstrations. They do not create actual bookings, accounts, payments, uploads or subscriptions. Refreshing resets in-memory state.

## Check the source

From the repository root:

    node --test research/strategy_controls_oct4/demo/tests.mjs
    node research/booking_flows_oct4/demo/test-model.cjs
    node research/booking_flows_oct4/demo/test-app-wiring.cjs
    python3 research/comparison_assets/learning_layout/tests/test_source.py
    python3 research/do_not_slop_copy/validate.py
    python3 plugins/review-visible-design/validation/validate_package.py
    python3 validation/validate_release.py

The public booking/learning reporters and plugin validator were rebuilt for this source release. Their scope is stated in [verification](docs/VERIFICATION.md). Exact-byte fixtures and runtime helpers were preserved; no fixture hash or evidence requirement was relaxed to obtain a pass.

## Evidence and rights

- [Rights and scope](docs/RIGHTS_AND_SCOPE.md): license pending; third-party rights unknown; external sources remain links and bounded summaries
- [Verification and remaining gates](docs/VERIFICATION.md): executed checks versus browser, input, accessibility, host and usability limits
- [Release provenance](docs/PROVENANCE.json), [preserved input bytes](docs/PRESERVED_INPUTS.sha256.json) and [release file inventory](FILES.sha256.json)

Source coverage is bounded by each manual's cited observations and explicitly listed unknowns. Historical articles and screenshots do not prove a current product's behavior. This release excludes article bodies, raw third-party media/font bytes, original capture archives and uncleared generated art.
