# Start here: use the project rules

[Project overview](../README.md) · [Report map](RESEARCH_OVERVIEW.md) · [Full research index](RESEARCH_INDEX.md)

## 1. Make the repository available

For local examples, use Git and Python 3:

```sh
git clone https://github.com/logue1114-maker/do-not-slop-project.git
cd do-not-slop-project
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/research/title_entry_prompt_trial_r2/ for the actual TIDELINE pair, or http://127.0.0.1:8765/research/white_surface_palettes_v1/ for the authored palette explorer. [More local example URLs](RESEARCH_INDEX.md#run-and-check)

GitHub displays HTML source rather than running it. Keep each package's adjacent data/assets together. Demo actions are local; they do not create real bookings, accounts, payments, uploads or subscriptions.

<a id="choose-a-rule-pack"></a>

## 2. Choose a rule pack

Read [AGENTS.md](../AGENTS.md) first. Pick the smallest pack that matches the person's task, platform and required states. Broader routing is in the [series index](../research/series_index.json) and [structured rules catalog](../research/rules_catalog.json). A listed rule or proposed state is not automatically implemented or verified in every example.

| Task | Start here | Example or source |
| :--- | :--- | :--- |
| Button construction and correction | [General role/family/anatomy guide](../research/universal_button_system/README.md) | [Runnable source candidate](../research/universal_button_system/specimens/index.html) · [Rendered gate and tests](../research/universal_button_system/BROWSER_REPORT.md) |
| Human-maintainable code | [Reusable AI instructions and review checklist](../research/human_maintainability_v1/README.md) | [Behavior-preserving Fleet refactoring and isolated theme change](../research/human_maintainability_v1/MAINTAINER_QUICKSTART.md) |
| Input, state and recovery corrections | [Six English visual labs and exact AI instructions](../research/interaction_corrections_v1/README.md) | [Runnable source](../research/interaction_corrections_v1/index.html) · [Desktop / phone captures and tests](../research/interaction_corrections_v1/BROWSER_REPORT.md) |
| Explore game UI details | [Live settings and reusable contracts](../research/game_ui_playground_v1/README.md) | [First component playground](../research/game_ui_playground_v1/index.html) · [Desktop / phone captures](../research/game_ui_playground_v1/BROWSER_REPORT.md) |
| Menu and inventory placement | [English visual manual and AI instructions](../research/menu_placement_v1/README.md) | [Interactive flow and layout annotations](../research/menu_placement_v1/index.html) · [Actual desktop / mobile captures](../research/menu_placement_v1/captures/README.md) |
| Game controls and HUD | [Controls manual](../research/game_controls_corrections_v2.md) · [Fleet commands](../research/strategy_controls_oct4/strategy_controls_research.ko.md) | [Five game presets](../research/game_interface_presets_v1/README.md) · [Fleet-command demo](../research/strategy_controls_oct4/demo/README.md) |
| Gameplay timing, intent and recovery | [Sources and proposal boundaries](../research/gameplay_details_v1/sources.json) | [Four interactive studies](../research/gameplay_details_v1/README.md) · [Captures](../research/gameplay_details_v1/captures/README.md) |
| Multiplayer motion presentation | [Party Race implementation case and limits](../research/party_race_sync_20261007/README.md) | [Display-only module](../research/party_race_sync_20261007/motion-presentation.js) · [10 portable tests](../research/party_race_sync_20261007/motion-presentation.test.mjs) |
| Web layout and task flow | [Web manual](../research/web_app_corrections_v2.md) · [Booking flow](../research/booking_flows_oct4/booking_manual_ko.md) | [Six web presets](../research/web_interface_presets_v1/README.md) · [Booking-change demo](../research/booking_flows_oct4/demo/README.md) · [Learning demo](../research/comparison_assets/learning_layout/README.md) |
| Mobile app layout | [Mobile manual](../research/mobile_app_corrections_v1.md) | [Three authored boards](../research/mobile_app_v1/boards/) |
| UI copy | [Copy manual](../research/do_not_slop_copy/manual_ko.md) · [CP01 guide v2](../guides/cp01-task-first-v2.md) | [Nine interactive examples](../research/do_not_slop_copy/copy_examples.html) |
| White-surface color roles | [Purpose-specific rules](../research/white_surface_palettes_v1/ai-implementation-rules.md) | [Six-scheme explorer](../research/white_surface_palettes_v1/README.md) |


These packages contain authored proposals unless their case explicitly identifies actual model outputs. Most research manuals are in Korean; several implementation packages and AI instructions are in English. Inspect the [rights and scope](RIGHTS_AND_SCOPE.md) before copying or redistributing source/assets; no general reuse license has been selected.

For a title-screen task, the [source-first craft guide](../guides/source-first-ui-craft.md), [North Marsh scoped instructions](../research/north_marsh_title_arrival_v3/AI_INSTRUCTIONS.md) and [R2's retained treatment](../research/title_entry_prompt_trial_r2/guidance.txt) are concrete inputs. R2 also used private historical references unavailable in the public bundle; the guide alone does not reproduce that exact treatment.

## 3. Apply through your coding AI

Supply the real audience, immediate task, data, actions, supported states and platform. Include the current implementation or a faithful fixture when revising an interface. Use this prompt with the repository present:

```text
Read AGENTS.md and docs/START_HERE.md.
My interface: [game/web/app], for [audience].
Main task: [task]. Required data, actions and states: [attach or list them].
Choose the smallest relevant rule pack and name the rules you will apply.
Build or revise a polished, attractive, complete interface.
Preserve the supplied facts and behavior; flag conflicts or missing inputs.
Provide actual desktop/phone renders and action, keyboard and recovery checks.
Keep before/after outputs and report blocked or unrun checks.
```

Your coding AI and its browser/editor tools perform the implementation and capture. The repository's draft helper below checks supplied review records.

## 4. Inspect evidence and review

- Compare matched before/after states at the same viewport with the same protected data and actions
- Inspect full-context renders, relevant components and supported states. A color-only change is incomplete when the task requests structural changes
- Exercise supported actions, repeated activation, cancellation, failure/recovery and keyboard behavior
- Keep unsuccessful first passes and later repairs separate. Record the source revision, environment and checks actually performed
- Make a focused revision based on observed problems; preserve unsupported or untested work as such

A source test or a screenshot alone does not establish a complete interaction, accessibility or usability pass. For a new ordinary-versus-guided experiment, freeze inputs and follow [honest comparisons](HONEST_COMPARISONS.md) before either run.

## Optional review-record helper

The [visible-design review helper](../plugins/review-visible-design/README.md) is published source at `0.1.0-draft.3`, with a standard-library Python CLI. It routes normalized requests, compares supplied metadata, hashes JSON and checks report fields. It does not capture screens, edit an interface, or judge pixels.

From the repository root, run the packaged **synthetic samples**:

```sh
cd plugins/review-visible-design
python3 skills/review-visible-design/scripts/review_contract.py route --input tests/sample_request.json
python3 skills/review-visible-design/scripts/review_contract.py compare --input tests/sample_comparison.json
python3 skills/review-visible-design/scripts/review_contract.py hash-json --input tests/hash_fixture.json
python3 skills/review-visible-design/scripts/review_contract.py check-report --input tests/sample_report.json
```

Use the [skill and evidence contract](../plugins/review-visible-design/skills/review-visible-design/SKILL.md) when preparing your own records. A passing sample proves the declared record checks, not that real UI observations occurred. Host installation, model activation and rendered effectiveness are unestablished in [DRAFT_STATUS.json](../plugins/review-visible-design/DRAFT_STATUS.json).

For changed packages, use their scoped checks in the [research index](RESEARCH_INDEX.md#source-checks). [Verification records](VERIFICATION.md) distinguish source tests from browser, accessibility and user-review evidence.

