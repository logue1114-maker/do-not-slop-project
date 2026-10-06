# First implementation and objective repairs

The original first completed HTML/CSS/JS/data files are retained in `first-pass/`. This is an authored iteration, not an experimental arm. No original repository evidence was changed.

1. Static review found that supply/material selection would try to read a nonexistent equipped slot while constructing a comparison. Comparison rows are now created only for equipment. Visible-focus restoration skips hidden compact Back controls at desktop width.
2. The first browser run could inspect the page but Chrome initially failed its screenshot protocol. A CLI attempt also lost its CDP connection. Those failures are preserved. A later approved Chrome run captured screens and then stopped at an ambiguous test selector matching both catalog and common-supply tonic buttons. The runner now targets the catalog ID explicitly; this was a harness defect.
3. Another initial compositor capture failed. The runner disables GPU acceleration and waits250ms for a settled frame before screenshots. This is a capture-tool adjustment, not a change to the UI. The earlier failure records remain in `first-pass/`.
4. The first full pass had117 successful checks. Local visual inspection found that the surrounding editor required scrolling to reach landscape game controls. `Play view` was added to use the actual browser viewport while keeping state and a visible Exit action. Filter/catalog IDs preserve keyboard focus across render updates. Arrow-only/quantity/close buttons gained explicit accessible names.
5. Beacon stock was changed from six to two so a natural affordable purchase can reach a sold-out state; no debug state injection is required. The first data source remains preserved. Its description now identifies a bag supply rather than implying an unimplemented map-placement action.
6. Play-view visual inspection found a minimap caption behind the forward button in shallow landscape. The redundant caption is hidden in that view; the map remains an accessible opener. Geometry checks now include caption/control intersections. A native-dialog Tab probe also initially expected every stop to be a DOM element in the dialog; Chrome's browser-boundary stop reports BODY. The refined check records tag/ID and verifies no background page control receives focus. This is a bounded native-key check, not a full focus-trap audit.

Final source and browser results are recorded separately. No repair establishes human usability, an external review, user approval or a controlled A/B outcome.

## Public integration adaptations

Public report copies redact private machine paths; raw local records were retained outside the repository. The first-pass HTML only relocates navigation links. Development scripts use environment-configured browser paths. The136/55 results remain the pre-publication local run, while fresh public checks are separate. The first HTTP smoke check passed18 checks but reported one automatic favicon404; the optional loopback server now returns204 for that browser request. Runtime HTML/application/CSS/fixture and original PNG bytes remain unchanged.
