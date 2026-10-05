# Six web flow settings

Open `index.html` directly in a current desktop browser. Everything the examples need is embedded: CSS, JavaScript, data and original vector shapes. There are no dependencies, accounts or external requests. `fixtures.json` mirrors the embedded data; `presets.json` is the machine-readable handoff. Changing the mirror alone does not change the runnable page.

This is an authored, guided preset demonstration, not an unguided-versus-guided effectiveness experiment. `functional-requirements.json` isolates shared function/data and a realistic request for a polished, attractive result, without layout, palette, dimensions, screenshots or source guidance. `design-instructions.json` carries the proposed design instructions separately. A future comparison must freeze its inputs first, give both arms the same functional contract and quality goal, and preserve the actual first outputs without selection. No comparison arm was made here.

Choose an example in the gallery header. That navigation is a review tool, separate from each product’s own menu. Each example retains its local state when you switch. Reload clears all examples. **Reset this example** asks before restoring only the selected fixture.

| Purpose | Entry and outcome | Layout / action color |
|---|---|---|
| Shopping | Two products → finish → cart → item review | Object catalog, split detail, receipt / terracotta |
| Information | Search + topic → article → same results | Editorial index, narrow reading measure / dark botanical ink |
| Course | Lesson → practice → feedback → retry or next lesson | Course outline and reading workspace / plum |
| Community | Topic → thread → private draft → preview | Forum rows, channel rail, separate editor / forest |
| Work | Task register → detail → edit → save or cancel | Aligned register and factual form / charcoal |
| Booking | Space + time → review → conflict recovery or local confirmation | Capacity rail, date/time grid, terms-first review / petrol |

## Reuse

Choose a purpose before applying a preset. Copy its fixture contract, routes, state boundaries and roles together. The dimensions are contextual proposals, not universal best sizes or measurements of the reference products. `dimensions.rendered` records this implementation’s actual CSS geometry at the specified viewports; screen captures and the test report have separate evidence limits.

Primary means the next supported action. It does not mean success. Muted text is metadata; grouping borders are distinct from control borders. Focus uses a visible ring. Selected, unavailable, completed, invalid and successful states also use words, symbols or native checked/pressed semantics. Loading is deliberately absent because the fixture operations are synchronous.

Keep consequences next to decisions: item prices/quantities, task IDs/dates, axis units, draft privacy, space capacity/timezone, total and cancellation terms. Remove generic welcome and control-narration copy without deleting those facts. White surfaces and semantic roles carry forward the palette research; six new flows and layouts extend it.

Do not use these examples as real commerce, posting, grading, collaboration or booking code. A production service needs its own data, authorization, persistence, failure fixtures and transaction guarantees. The community guard’s canceled browser-Back attempt restores the current route with `pushState`, which may replace the forward branch. Browser-native reload/close warnings depend on browser support and prior interaction.

## Verify and integrate

`node build-presets.mjs` rebuilds fixture/preset mirrors from the embedded page. `node tests.mjs` runs bounded real-Chromium checks and captures; it uses an existing `playwright-core` installation or `PLAYWRIGHT_CORE_PATH`, and `CHROME_PATH` if needed. No package installation is required by the artifact. The development harness uses environment-configurable paths; no machine location is bundled.

Run the main flows, then their interrupted/repeated/Back paths. Render at 1165×747 and 390×844 CSS px, inspect later stages, and check keyboard focus and touch emulation separately. The first completed source lives in `first-pass/`; objective repairs are listed in `REPAIRS.md`. See `checks/test-results.json`, `checks/measurements.json` and `SOURCES_RIGHTS.md` for what actually ran. Automated browser checks are not participant research, native-phone tests, screen-reader validation or full WCAG certification.

This source package was published to the repository by request. It contains no hosting, deployment, account or transaction operation.
