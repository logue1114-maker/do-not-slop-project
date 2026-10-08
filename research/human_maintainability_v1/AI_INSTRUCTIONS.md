# Reusable instructions for maintainable changes

Give this file to a coding AI with your task and repository. Replace the bracketed inputs; keep the protected behavior explicit.

```text
Task: [concrete change and why a person needs it].
Entry points/platform: [actual launch paths and runtime].
Protected behavior/data: [inputs, outputs, state, errors, side effects and public APIs].
Allowed change: [scope]. Existing verification: [commands/fixtures].

Read applicable project instructions and the smallest relevant source first.
Trace the real entry point and one action through input, rules, state and output.
Before editing, give a short ownership/dependency map and an edit map:
"To change X, edit Y because Y owns Z." Name unknown contracts explicitly.

Keep behavior-changing work separate from structural refactoring. Retain the
actual baseline and provenance; do not create a bad baseline. Prefer a small
copy or isolated branch when the original is research evidence.

Separate roles only where this code has real independent reasons to change:
- presentation/layout maps state to rendered output;
- visual tokens/assets supply styling or geometry;
- domain/game rules decide validity, costs, transitions and results;
- input/controllers translate platform events into actions;
- state/persistence owns state lifetime, snapshots and durable serialization;
- platform integration owns external loading, clocks, storage or services.
Do not create absent roles, speculative adapters, hundreds of tiny files,
generic managers, or a separate class around every function. Keep cohesive
helpers together. Preserve an existing good boundary instead of wrapping it.

Use explicit data and dependencies. Rules must not import the view/controller
or read DOM/global storage. Views must not decide game legality or send orders.
Controllers may dispatch actions; the rule owner decides whether they succeed.
Put configuration with its owning role. Distinguish visual dimensions from
domain/world units; changing button size must not change targeting coordinates.

Document public contracts: required inputs, output shapes, mutation/clone
policy, errors, side effects, and initialization/disposal ownership. Define
failure behavior already supported; propose contract changes separately.
Document save schema/version/migration only when persistence actually exists.

Choose names that reveal intent. Add comments for invariants, reasons, side
effects and non-obvious tradeoffs. Remove misleading or redundant comments.
Do not judge quality by line count, comment quantity or layer count. Keep a
short entry-point/change map so another person can locate the owning code.

Refactor incrementally. Use focused characterization/parity tests through the
real entry point, plus domain tests for failures, recovery and repeated input.
Check lifecycle cleanup after a meaningful state change, not only an untouched
initial screen, if ownership changes. Add a bounded dependency guard
when direction is part of the contract, and prove it rejects a forbidden edge.

Demonstrate one concrete requested change in an isolated patch, listing exactly
which runtime files and checks change and why. Verify the protected behavior.
Do not claim less work from file counts or imply measured human improvement.

Deliver: scoped diff, runnable entry points, ownership/change map, contracts,
test commands and actual results, preserved baseline/provenance, and remaining
limits. Distinguish tests run, unrun, reviewer judgment and hypotheses. Preserve
unrelated code, user reviews and research evidence. Use existing dependencies.
```

For this worked case, start with [the quickstart](MAINTAINER_QUICKSTART.md) and use [the acceptance checklist](ACCEPTANCE_CHECKLIST.md). The contract is preservation of both rendered Fleet variants and their shared command state; the internal A/B labels describe the older HUD study, not refactoring arms.

A useful production change note can be six lines:

```text
Request / owner:
Entry point and touched roles:
Protected contracts / intentional behavior changes:
Dependencies, side effects, initialization and cleanup:
Checks run with outcomes / checks unrun:
Reviewer concern or evidence needed:
```
