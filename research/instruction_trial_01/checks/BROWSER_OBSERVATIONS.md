# CP01 trial 01: bounded browser observations

Observed on 2026-10-04 UTC using the actual first-pass synthetic local pages, rendered in a cloud browser. Captures are retained without image editing. This record is distinct from isolated source/JavaScript tests and from participant research.

## Both actual outputs

- Default desktop frame: 1165 × 747; narrow frame: 390 × 844. Scrollbar space may reduce inner content width by 15 pixels
- Both Find a document actions and repeated activation recorded the supported local intention
- Reset cleared the local demo state while keeping protected document facts
- Shared-facts disclosure opened and closed
- Keyboard action activation and visible focus spotchecks passed
- No horizontal overflow observed at either frame
- Browser console review showed extension metadata errors; no application error was observed in the tested states

The default narrow captures show the initial viewport, not a full-page mobile view. Content continues vertically. B's shared-facts disclosure requires desktop vertical scrolling; A's is within the first desktop screen.

## Scope boundaries

This was a rendered/input spotcheck, not a complete keyboard/mobile/accessibility pass. Full Tab order, all Enter/Space combinations, focus-trap audit, native-phone input, screen-reader output, zoom matrix, and comprehensive rendered contrast review remain unrun. No browser network-panel/history audit is claimed. The source is self-contained and isolated handler checks show no external workflow; those facts are not a substitute for an exhaustive browser-network audit.

The [package validator](validate_trial.py) checks source identities, fixture/content, bounded prompt relation, self-containment, screenshot dimensions/hashes, and JavaScript syntax. It does not execute a browser, reproduce the observations above, score either output, or establish human usability.

## Artifact review

[Blinded review findings](../protocol/REVIEW_FINDINGS.md) were frozen before mapping reveal. User approval is pending. No overall winner, measured improvement, or claim that all prior criticism was addressed is recorded.
