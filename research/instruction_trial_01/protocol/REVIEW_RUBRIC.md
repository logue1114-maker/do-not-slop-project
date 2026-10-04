# CP01 one-pair pilot: preregistered evaluation

Status: fixed before the two runs; the independent blinded artifact review has been frozen before mapping reveal. The score anchors below are unchanged. This rubric judges the actual outputs, not the historical screenshot or its English reconstruction as a trial arm.

## Question and units

For this one CP01 fixture, what observable differences appear between one ordinary-request implementation and one implementation made with the same request plus the project's AI-facing instructions?

Unit: one first-pass implementation per arm, with the same single objective bug-fix allowance. Model: GPT-6.1 Sol for both. Use the same reasoning effort, service tier, tools, dependency policy, viewport, checks, and run-time budget. No model-seed or deterministic replay guarantee is assumed. A model/version difference invalidates the pair as the planned same-model comparison.

## Hard gates: report individually before scores

- **Protected content:** exact specimen titles/body texts remain; the same two names/modification values/order appear in both panels; Before/After meaning is retained
- **Action/state:** both Find a document actions have the same demo-only effect; repeated use, reset, and shared-facts disclosure work without changing document facts
- **Boundary:** no invented external service, account, transaction, side effect, or claimed measured usability improvement; local educational-demo nature is clear
- **Executable artifact:** self-contained page renders at both viewports and has no blocking script error
- **Run integrity:** same model/settings/common input/prompt core/checks; B's additional project instructions recorded; no hidden reroll, cross-arm exposure, or selective subjective repair

A failed gate is never erased by an attractive screenshot. State the exact failure and whether it was present in first-pass or fixed under the shared allowance. Do not calculate an overall winning score for a gate-failing arm.

## Scored review: 0–2 for each dimension (maximum 12)

Score the actual rendered output and behavior against these anchors. Do not score rule-following or resemblance to a preferred mockup. A different hue, radius, font, or layout may earn the same score if it serves the task.

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| Task and comparison hierarchy | Main task/comparison is obscured or misleading | Comparison is identifiable but competes with secondary chrome | Case, paired specimens, and action can be identified in a clear reading order |
| Supporting copy precision | Filler, confusing attribution, or claims not tied to visible evidence | Accurate but repetitive, report-like, or longer than its job needs | Concise explanation tied to the visible copy change, with necessary boundaries preserved |
| Visual roles and consistency | Color, framing, or emphasis creates confusion or privileges one specimen | Coherent overall but some decorative or competing emphasis | Color, type, and boundaries consistently distinguish task, metadata, action, and secondary evidence |
| Typography and spacing | Clipped, unreadable, or crowded/separated in a way that breaks grouping | Legible, with uneven hierarchy or grouping | Readable hierarchy and deliberate proximity/spacing at both specified widths |
| Interaction and keyboard clarity | Actions/reset/disclosure are misleading or inaccessible | Core controls work but focus/order/status clarity has a defect | Visible focus, sensible order, accurate status, repeat/reset/disclosure behavior checked |
| Responsive comparison | Content/action lost or horizontal overflow blocks reading | Readable at both widths with awkward comparison/controls | Clear labels, preserved relationships, and readable controls/data at both widths |

For each score, give one concrete observation with a screenshot region or behavior reference. If a check is unrun, mark it unrun and do not assign a fully verified 2 to the affected dimension. Keep the rater's visual preference separate from the anchored score.

## Review procedure and outputs

1. Preserve first-pass and final allowed-repair artifacts for both arms
2. Rename the actual outputs X and Y for the first scoring pass; randomize their presentation order using a recorded coin flip or equivalent. Do not show prompts/instructions during scoring. If the reviewer already knows the arm mapping, disclose that blinding is not achieved
3. Use identical viewports and test scripts. Review both default screens plus relevant action/reset/disclosure evidence
4. Record hard gates, six dimension scores, concrete observations, unresolved defects, and any repair deltas before revealing the arm mapping
5. Reveal which was ordinary-request and guided. Describe actual changes and limits. Do not change scores to suit the desired story
6. The supplied user can express a preference separately; an informal preference is not a measured usability result

## Interpretation boundary and stopping condition

This is a descriptive 1-pair pilot. No human timing, task-success, workload, preference sample, statistical test, or effect size is collected. It cannot separate the entire contribution of instructions from stochastic variation, run order, or reviewer expectation, and cannot prove a universal causal effect. Say "in this pair" and identify the actual visible/functional differences. A later replication would require additional preregistered pairs, not relabeling the historical reconstruction as another run.

Stop when both authorized implementations, equal verification/repair records, and this evaluation are saved, or when a specific model/tool/authorization blocker prevents a comparable pair. Do not select a replacement run based on its aesthetic score. A missing arm is pending/blocked, not an implied improvement.
