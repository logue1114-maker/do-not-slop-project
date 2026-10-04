# Verification and limits

Verification date: 2026-10-04 UTC. These results apply to the included public source bytes. `FILES.sha256.json` identifies the final payload; preserved runtime/reference/fixture/test inputs are anchored separately in `PRESERVED_INPUTS.sha256.json`.

## Offline checks

Run the README commands from the repository root. Fresh machine-readable results are stored beside their tests or under validation/.

- Fleet command: 30 Node reducer/model/source-contract tests
- Booking model/static checks: new public runner, 58 checks covering immutable input preservation, validation boundaries, stale recovery, duplicate confirmation and cancel/reset races
- Booking app wiring: 7 checks in the included actual app/model event harness; source/DOM-shaped tests, not browser input
- Learning: 245 new public source/DOM checks, including the preserved 29-check JavaScript state harness, across 18 rendered-source snapshots
- UI copy: 70 static checks and 65 JavaScript fake-DOM unit checks; nine fixed examples, seven stateless selectors and CP07/CP08 variants
- Plugin draft.3: new public validator, all 151 preserved request/comparison/report/hash/invalid-JSON fixtures, six relocated helper CLI samples, exact inventory/rights/draft/hash checks
- Release tree: JSON, authored-board allowlist, preserved input bytes, local Markdown/HTML links, prohibited payloads and bounded secret/path/contact scan

The rebuilt booking/learning/plugin tests are a new public-source scope. They are not republished historical receipts or a claim that omitted test/report sources are bundled. Tests never change fixture bytes or expected hashes. The UI-copy reporter was revised only to record actual run time/hashes and keep its unexecuted browser gates as not_run.

Python 3.12.14 and Node v24.19.0 were used for the initial public-tree checks. No model/API calls, package installation or external network was required.

## Bounded browser observations

Separately observed checks are narrower than a general accessibility or usability claim:

- Fleet command: at 1180×757, the retained-order + three-selection + invalid-Fang state left 12px above the A footer. Native Enter on A Confirm recovered focus to Kestrel in A and allowed M immediately afterward. Staged app/style/state/focus/fixture bytes matched the observed source revision
- Booking change: key desktop browser flows passed after the render-subscription repair. This does not establish real Korean IME, native-mobile, zoom or screen-reader behavior
- UI copy: exact HTML SHA-256 `0c8ef58d152991898b627831f8accecaffaa9d8ca4956b56011cdc5c7cf291c3` was checked at viewport 1180×757 CSS px, DPR 1 and document client width 1165. All nine examples were readable, seven stateless selectors were hidden, four CP07 and three CP08 variants agreed across panels, corresponding actions had matching local outcomes, and native Tab/Return Save plus visible focus outline were checked. This does not establish a full keyboard or screen-reader audit

Private working captures and historical receipts are not part of this source release. Each browser observation stays bounded to its tested state and environment.

## Unestablished gates

- Learning comparison actual browser rendering and native input
- Full mobile/320–390px, 200% zoom, real Korean IME and screen-reader matrices
- Comprehensive keyboard, focus, contrast and accessibility review for every demo
- Source-product current behavior beyond each cited source's historical scope
- Plugin model activation/output, full remote manifest schema, host loading, adoption, installation and user review
- Participant studies, preferences, task-success metrics or any measured usability gain

The plugin remains draft.3, not adopted or installed. Its declared gates stay not_run because package contract checks do not execute them. A reuse license remains pending and third-party rights remain unknown/link-only.
