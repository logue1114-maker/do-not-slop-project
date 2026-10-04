# Honest website and game comparisons

## Question and artifact labels

Compare an ordinary user's request for a polished, attractive, complete website or game with the same request plus a specific guide, design reference, and stated intention. The baseline still asks for good design; it is not asked to make a poor, unfinished, or deliberately generic result. It receives no detailed palette, layout, menu choices, project guide, target screenshot, or other treatment-only design direction. The model makes its own design decisions.

Keep these labels distinct:

- **Authored/guided demo:** a designed example, preset, reconstruction, or revision made to illustrate a direction; not an experimental arm
- **Actual ordinary-quality output:** a retained run with the common quality request and functional fixture, without the treatment's design direction
- **Actual design-treatment output:** a retained run with that identical core plus the frozen treatment
- **Shared-reference redesign:** both arms start from the same visual reconstruction or styled starter; not ordinary from-scratch generation

A guide-plus-reference bundle tests that bundle. It does not isolate the guide's effect. A guide-only claim needs a separate design with the other inputs held constant. A single pair describes its outputs, not general superiority or measured usability.

## Freeze before either run

1. Choose the website/game task and intended audience before seeing outputs. Fix the same records, content, assets, required actions, states, rules, device targets, and technical constraints. Keep this common fixture free of treatment-only visual direction. If an asset conveys the target design, disclose it as a design reference rather than calling it neutral data
2. Save the exact common prompt, treatment addition, fixture, guide/version, references, checks, rubric, and run policy with SHA-256 hashes and a freeze timestamp. Record the task-selection reason and intended comparison. No changes after inspecting the first arm
3. Use fresh isolated workspaces and contexts with the same requested model/effort, environment, tools, neutral technical scaffold, dependency policy, allowed checks, output format, capture states/viewports, and repair budget. Keep project guides and design-bearing root instructions out of the baseline workspace/context; record any unavoidable shared system instructions. Neither arm sees the other's work
4. Preregister one first pass and at most one bounded repair per arm for verified functional, protected-content, accessibility, or rendering defects. Save first-pass bytes before checks and preserve every repair/diff. No subjective polishing, hidden manual fixes, or replacement rerolls. Freeze the same wall-clock/token limit if enforceable; otherwise say duration was not controlled. Record actual durations and budget deviations
5. Freeze arm run order (randomize it where possible), anonymized review labels/order, evaluation dimensions, and the planned sample count. More pairs must be planned or clearly labeled exploratory; they cannot replace an inconvenient original result

## Shared ordinary-user prompt core

Resolve the bracketed fields from the frozen task/fixture before either run. Both arms receive this exact core. Website and game variants are separate tasks, chosen before generation; no user design-choice questionnaire is needed.

> Make a polished, attractive, complete [website/game] for [audience and purpose]. Use the supplied functional requirements and data exactly. Make the required actions and states work, and make the result readable and usable at the specified desktop and phone sizes. Choose the visual design yourself. Follow the shared technical constraints, output format, checks, and version-preservation policy in the attached run brief.

The attached common brief specifies functionality, data, safety boundaries, technical scope, and the equal check/repair policy. It must not sneak in the treatment's palette, layout, menu design, guide rules, reference image, or intended final appearance. A website/game must meet its frozen scope to count as complete; extra fabricated features do not compensate for missing requirements.

### Treatment-only addition

> Also apply [exact guide path/version] and use [exact design reference files] to realize this specific design intention: [frozen intention]. Keep the common functional/data requirements and run policy unchanged. Report any conflict or unsupported instruction rather than silently changing protected requirements.

List precisely what the addition supplies. If the treatment has a guide and reference, report a **guide-and-reference treatment**. If it has only a guide, report **guide-only**. Reference fidelity and intention alignment are treatment-specific checks, not grounds to penalize a baseline that was never given that reference or intention.

## Preserve outputs and compare honestly

- Save exact prompts, supplied inputs, run metadata, first passes, all later versions, diffs, logs, failed/unrun checks, and unedited captures. Keep every planned pair, including ties, failed runs, and a treatment that looks or works worse. A blocked arm stays blocked with its reason; disclose any new run as another run
- Check common function/data integrity separately from visual quality. Report missing actions, changed records, and broken game rules even if the result looks good. Use common style dimensions such as hierarchy, readability, coherence, responsiveness, and task fit; report guide compliance and reference fidelity separately
- Capture both arms in the same fixture states at the same viewports and scale. Use the same full-page/default-frame policy and interaction coverage. Disclose scrolling and capture limits. Do not crop, edit, select states, or emphasize one arm to manufacture a winner
- Review under neutral labels before revealing mapping where feasible; record reviewer identity/type, presentation order, what they actually inspected, and whether blinding held. Source text or guide-specific appearance may reveal an arm. Preserve observations before reveal and report tradeoffs. AI artifact review is not a human participant study
- Record requested and accepted model/settings separately from unavailable exact backend revision, seed, sampling, service tier, system/runtime parity, or time control. Hashes reproduce supplied bytes, not guaranteed identical stochastic outputs. Do not invent unknown settings, timings, task-success rates, preference scores, or effect sizes
- Keep source observation, project proposal, case-specific user preference, and universal claim separate. A user's dislike of one result or requested aesthetic is not a rule that the same color, layout, or style is always wrong
- User design approval stays pending until the user actually approves the design. Creating a local comparison does not authorize publication, Site changes, uploading private references, licensing decisions, or account actions. Follow the task's approval and rights boundaries separately

## Existing evidence and the next pair

The [original CP01 pair](../research/instruction_trial_01/README.md) gave **both arms the same English screenshot reconstruction as a styled HTML starter**, plus the same fixture and quality-redesign request. Its archived labels “ordinary request” and “project-guided request” refer to that shared-reference redesign context. It is not a no-reference ordinary from-scratch comparison. Original prompts, runtime/output bytes, scores, and recorded limits remain unchanged.

The [guide-v2 CP01 artifact](../research/instruction_trial_02/README.md) is a post-review guided iteration, not a matched new pair. The [six white-surface examples](../research/white_surface_palettes_v1/README.md) are authored palette proposals applied to fixed interfaces. Other website presets or game demos are likewise authored/guided demonstrations unless accompanied by a distinct actual paired-run record; making a demo does not create an experiment result.

**Planned, not run:** a fresh website/game comparison using the ordinary-quality core above versus the identical core plus a frozen specific design treatment. The concrete task/fixture, treatment bundle, settings/budgets, capture plan, and rubric must be selected and frozen before execution. This documentation update contains no new experimental arms, scores, or winner.
