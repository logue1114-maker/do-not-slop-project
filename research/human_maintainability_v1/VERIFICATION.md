# Verification: findings and limits

Executed 2026-10-08 against the new package in a fresh checkout of public main `43a966e44f61d9c42aa4c17603a4982efa200ca5`. No prior production example is rewritten. The retained before files are exact Git blobs; after preserves the domain reducer, focus helper and fixture exactly.

| Run | Actual outcome | What it establishes |
|---|---|---|
| Preserved baseline tests | 30 passed | Existing domain and selected source contracts still work in the untouched baseline copy |
| Combined baseline + new contract suite | 43 passed, 0 failed, Node v24.15.0 | Baseline hashes; per-step rule/projection parity; HTTP/network/JSON error contracts; explicit import/capability ownership; guard rejects prohibited examples |
| First browser pass | 20 of 22 groups passed | Preserved as [first-browser-results.json](checks/first-browser-results.json); two check issues required repair |
| Browser repair pass | 22 of 22 groups passed | [repair-browser-results.json](checks/repair-browser-results.json), with stable observation timing and a precise button selector |
| Review-repair retry with resource errors | 20 of 22 groups passed | [resource-failed-browser-run.json](checks/resource-failed-browser-run.json) retains allocation/resource failures; this was a completed failing retry |
| Final source after review repair | 22 of 22 browser groups passed, Chrome 154.0.8037.98 | [browser-results.json](checks/browser-results.json): actual loopback-served modules, native clicks/keys, full DOM/public state, computed styles/bounds, failures, cleanup and theme patch |
| Scoped publication checks | All checks passed in the final receipt | [publication-results.json](checks/publication-results.json): retained Git hashes, prior source preservation, insertion-only navigation, new local links/JSON and bounded sensitive-pattern scan; includes runtime/test/patch hashes |

[Unit receipt](checks/unit-results.json) · [Commands](MAINTAINER_QUICKSTART.md) · [Checks implementation](tests/contracts.test.mjs) · [Browser harness](tests/browser.mjs) · [Publication tool](tests/publication.mjs).

## Failures and repairs

The first comparison observed the disabled Clear selection button before Chrome completed its next-frame focus/blur update on one page. That made the compared snapshots represent different observation times, not equal settled states. Both implementations retain the same control-disable and focusout code. The comparison now waits for two animation frames on both pages before taking snapshots; the original and repaired outcomes are retained. It does not change application focus policy.

The first theme-color assertion used `[data-frame="wide"]`, which matched the desktop button and the comparison container. Playwright correctly rejected that ambiguous locator. The check now selects `.viewport-controls [data-frame="wide"]`. The repair run and final run passed the theme scenario. After that repair, only extracted-code indentation was improved, preserving literal HTML/SVG whitespace; final browser parity was rerun against that source. No baseline replacement or rule change was needed.

An independent read-only code review then identified that same-document remount after a sent order could retain the old live-status announcement. The original cleanup check disposed only the initial ready state. A strengthened [targeted regression](checks/review-lifecycle-before-fix.json) reproduced the stale `Stop order sent to 1 ship.` message after remount. The application now clears its owned announcement on fresh mount; the strengthened [targeted check passed](checks/review-lifecycle-after-fix.json), followed by the final full browser pass. This repair concerns the new optional host lifecycle API; the ordinary one-shot baseline behavior remains preserved. The reviewer independently ran the 43 unit tests and checked retained baseline hashes; this was an AI code review, not a human maintenance/usability study.

A subsequent full retry paused for an extended period after 17 completed passing groups, then completed naturally with [two resource failures](checks/resource-failed-browser-run.json): array-buffer allocation during the 320px group and insufficient resources when loading the theme comparison. A proposed stop was withheld because the previously inspected process identity no longer matched. The harness now brings each observed page to the foreground before its two-frame wait and bounds that wait; the next full run passed all 22 groups. The exact cause of the resource failures was not isolated, and tab scheduling is not established as their cause. The demo's input/focus policy was not changed by this verifier repair.

## Demonstrated findings

Both code copies produced equal public state/fixture/projections and full main DOM after the tested flows: Shift selection, hover/focus, Move/relay/Confirm, invalid Attack/recovery, repeated Confirm and Stop, empty selection, Cancel, native Enter/Space, scoped shortcuts, modifiers/repeat, pointer coordinates, presets/reset, cloned-hook isolation and frame settings. Repeat Stop is intentionally distinct from duplicate Confirm: each Stop sends a new local record, matching the actual baseline.

At 1440 × 1000, 390 × 844 and 320 × 844 CSS pixels, same-state full-page PNG bytes were identical between before/after. The report records matching SHA-256 values for desktop initial and two narrow Attack states; captures are kept outside the public package. This tests preservation of those rendered states, not exhaustive UI equivalence or design quality. Narrow flows also had no horizontal document overflow.

Injected HTTP failure, network failure and invalid JSON produced the same errors and no mounted scenes/public hook in both versions. The refactored lifecycle test sent an order, retained detached controls, disposed twice, activated detached/global demo buttons without further state changes, then remounted with an empty announcement and observed exactly one new Stop record. It demonstrates the new cleanup contract, which the original one-shot page did not expose.

The isolated [theme patch](change-example/README.md) changed only a visual-token file in a temporary copy. Its pressed-control border changed to the requested value while DOM, geometry, fixture and subsequent Move/Attack order results stayed equal. The dependency guard also rejected rule-to-view and view-to-controller imports, pure-role DOM access, rule calls from controllers, dynamic imports and an unmapped generic manager. This is a bounded source check, not a full language analysis.

## Unrun and hypothetical claims

Physical phones/controllers, screen-reader speech, full accessibility, other browser engines, exhaustive action sequences, independent human editing tasks/time/error measurements, and user visual-design approval remain unrun or unestablished. Malformed fixture-schema recovery is absent in the baseline and remains outside this contract. There is no save-format migration to test because this demo has no persistence.

Clearer ownership, easier discovery and lower review effort are maintainability hypotheses. This case demonstrates one isolated edit and preservation checks; it does not measure human benefit, generalize to all architectures, or infer reduced effort from the number of files. Earlier global release receipts and prior visual studies retain their own dates/scopes; the new publication tool checks only this addition and preservation of prior Git files.
