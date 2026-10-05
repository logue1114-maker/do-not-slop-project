# Six web interface presets

Open [index.html](index.html) directly or through the repository’s local server. Six distinct English-first synthetic flows work locally: shopping product/cart/review; information search/article/return; course lesson/practice/feedback; community thread/draft/preview; work record/edit/save; booking space/time/review/conflict recovery. No payment, posting, booking, account or external request occurs.

[Presets](presets.json) contain task-specific menus, routes, color/type/control roles, measured example geometry, exact design instructions, exceptions and review gates. [Functional requirements/data](functional-requirements.json) remain separate from [design instructions](design-instructions.json). This is an authored/guided demonstration, not an ordinary-quality/design-treatment experiment or user-approved design. Future matched runs must follow [honest comparisons](../../docs/HONEST_COMPARISONS.md).

| Purpose | Desktop capture | Narrow capture |
| :--- | :--- | :--- |
| Shopping | [Entry](checks/final/shopping-entry-1165x747.png) | [Entry](checks/final/shopping-entry-390x844.png) |
| Information | [Entry](checks/final/information-entry-1165x747.png) | [Entry](checks/final/information-entry-390x844.png) |
| Course | [Entry](checks/final/course-entry-1165x747.png) | [Entry](checks/final/course-entry-390x844.png) |
| Community | [Entry](checks/final/community-entry-1165x747.png) | [Entry](checks/final/community-entry-390x844.png) |
| Work | [Entry](checks/final/work-entry-1165x747.png) | [Entry](checks/final/work-entry-390x844.png) |
| Booking | [Entry](checks/final/booking-entry-1165x747.png) | [Entry](checks/final/booking-entry-390x844.png) |

These are full-page browser captures at the stated CSS viewports; image height includes scrolling. [Browser report](BROWSER_REPORT.md), [repair history](REPAIRS.md), [implementation guide](IMPLEMENTATION.md), [source/rights notes](SOURCES_RIGHTS.md), [public integration](public-integration.json) and [first completed source](first-pass/) retain scope and evidence boundaries.

Switching examples preserves session state. **Reset this example** asks before clearing only that example; reload clears all changes. Control sizes and palette/layout choices are contextual proposals, not universal standards.

The gallery needs no dependency. Browser verification uses an existing Playwright Core and Chromium; set PLAYWRIGHT_CORE_PATH and CHROME_PATH, or use your installed driver/browser. From the repository root:

    node research/web_interface_presets_v1/tests.mjs
    node research/web_interface_presets_v1/measure-extra.mjs
    node research/web_interface_presets_v1/build-presets.mjs
    node research/web_interface_presets_v1/verify-source.mjs
    node research/web_interface_presets_v1/verify-http.mjs

Native phones, screen readers, participant usability, complete accessibility, causal improvement, design approval and reuse licensing remain unestablished. No Site deployment or new comparison arm is included.
