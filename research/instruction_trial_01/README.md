# CP01 English instruction trial 01

One ordinary-request output and one project-guided output, preserved from fresh runs of the same requested model and common input. This package is English-first and runs locally without dependencies.

## Screens and sources

- [Faithful English reference](reference/reference-en.html) and [desktop capture](screenshots/reference-desktop.jpg): authored reconstruction of an earlier screen, used as the shared starter, not a model-run arm
- [A · Ordinary-request first pass](alpha/index.html), [desktop capture](screenshots/alpha-desktop.jpg) and [narrow capture](screenshots/alpha-narrow.jpg)
- [B · Project-guided first pass](beta/index.html), [desktop capture](screenshots/beta-desktop.jpg) and [narrow capture](screenshots/beta-narrow.jpg)
- [Fixed fixture](fixture.json), [ordinary brief](prompts/A-plain.txt), [guided brief](prompts/B-guided.txt), [exact v1 AI instructions](AGENTS.v1.md), [bounded guide](../../guides/cp01-task-first.md), and [shared checklist](checks/verification-checklist.md)

For a reproduction, copy the unchanged archived `AGENTS.v1.md` into the trial workspace as `AGENTS.md`; the original guided brief and expected instruction hash stay unchanged. The repository root instructions now route new CP01 work to v2.

Open the three HTML files directly, or serve the repository with `python3 -m http.server 8765 --bind 127.0.0.1`. All actions are local demonstrations. There is no account, document backend, payment, or external navigation.

## What this compares

The outer A/B comparison asks what these two implementations produced. Inside each implementation, Before/After compares two authored copy specimens. The specimen labels are not a claim that B beats A. The reference is not substituted for A.

Both runs requested `gpt-6.1-sol` and `xhigh` reasoning with no inherited conversation. The common starter, fixture, checklist, and public prompt core were identical. B additionally received the project instructions and bounded guide. Requested/accepted invocation values are known; exact backend revision, sampling settings, service tier, and deterministic seed are unavailable. Shared runtime rules and stochastic variation limit interpretation. The task scope and repair allowance were identical, but no fixed time budget was enforced and duration was not controlled.

Both files are original first-pass bytes. No implementation repair was used. The public task briefs preserve the bounded design request; runtime operational handoff text is excluded and is not represented as the complete runtime conversation.

## Checks and interpretation

[Protocol](protocol/PROTOCOL.md), [input/output hashes and run facts](protocol/run-record.json), [review rubric](protocol/REVIEW_RUBRIC.md), [browser observations](checks/BROWSER_OBSERVATIONS.md), and [runnable package checks](checks/validate_trial.py) keep the evidence boundaries explicit.

The captured desktop frames are 1165 × 747; narrow frames are 390 × 844. A scrollbar may reduce content width by 15 pixels. Both actions, repeat activation, reset, disclosure, keyboard-activation/focus spotchecks, and absence of horizontal overflow were observed. Native-phone, screen-reader, and full Tab-order testing remain unrun. B's disclosure requires desktop vertical scrolling; A's is within the first screen.

Both implementations retain green actions and neutral backgrounds. No finding establishes that the prior design criticism is fully solved. A blinded artifact review was frozen before revealing X = A and Y = B. Its descriptive subtotals were A 10/12 and B 11/12; these are not a validated ranking. [Review findings](protocol/REVIEW_FINDINGS.md) describe the same-action emphasis and scrolling tradeoffs. User approval remains pending. This single descriptive pair establishes neither measured usability gains nor general causal effectiveness. No participant study, timing, task-success rate, or effect size was collected.

## Rights

These JPGs are captures of the project's synthetic local UIs, not third-party product screenshots. The supplied historical raw image and its private provenance record are omitted. Public inclusion of these five synthetic captures was authorized. Reuse license remains pending; the review plugin remains a draft and is not installed. See [repository rights and scope](../../docs/RIGHTS_AND_SCOPE.md).
