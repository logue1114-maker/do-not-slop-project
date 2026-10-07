# Interaction corrections v1

Six **original authored demonstrators**, with deliberately faulty and corrected implementations of the same local task. They are not actual unguided/guided AI experimental outputs, measured usability results, or an approved final design.

Open [the interactive English manual](index.html). Each lab has a working failure, a corrected path, an exact input/procedure/output contract, a short explanation, and a reusable instruction. Switching implementation or lab resets its fixture. Actions stay local; no account, real purchase, authentication, or backend exists.

| Lab | Task layout | Concrete correction |
| --- | --- | --- |
| [Input conflicts](index.html#input) | Encounter arena + radio note | Dismiss/typing side-effect counters; modal ownership; held input polling gated and rearmed |
| [Information priority](index.html#overload) | Route scene + dispatch rail | Hazard/quest priority, grouped rewards, chat history, cue expiry versus action deadline |
| [Equipment & crafting](index.html#decisions) | Selection bench + stat/material ledger | Current → after values, signed deltas, exact missing stock, equipped/owned/locked/available shop actions |
| [Screen changes](index.html#adaptation) | Route form + dispatch editor | Stable field and route IDs, retained value/caret, resize, text enlargement and keyboard-occlusion model |
| [Waiting & failure](index.html#recovery) | Search shelf + editable notebook | Loading/empty/error/offline, request IDs, acknowledged revisions, cancellation and out-of-order replies |
| [Interaction feedback](index.html#feedback) | Beacon control + event timeline | Reversible press, native selection, pending/result timing, reduced motion, optional sensory API attempts |

Actual captures of these authored screens are in [captures/](captures/README.md). [The browser report](BROWSER_REPORT.md) distinguishes executed tests from unrun native/sensory checks.

## Run

From the repository root:

```sh
node research/interaction_corrections_v1/serve.mjs
```

Visit `http://127.0.0.1:4177/research/interaction_corrections_v1/`. The local server serves the repository's public files so links to earlier examples work; it blocks dot directories. The runtime needs no dependencies or external assets. Direct `index.html` also works; clipboard availability is browser-dependent.

For the optional browser harness, use an **existing** Playwright Core and Chromium/Chrome. No dependency installation is part of this deliverable:

```sh
PLAYWRIGHT_CORE_PATH=/path/to/existing/playwright-core CHROME_PATH=/path/to/chrome QA_RUN_ID=your-run node research/interaction_corrections_v1/browser-checks.mjs
node research/interaction_corrections_v1/verify-local.mjs
```

On PowerShell, set those environment variables with `$env:NAME='value'` before running Node. Fresh run IDs preserve earlier evidence; do not overwrite a retained run. Tests reset through page loads and UI controls, then use browser inputs. `interactionSnapshot()` is read-only observation, never test state injection.

## Reuse and scope

Use [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md) with [contract.json](contract.json) and the actual product fixture. All six instruction strings are also available to copy in the runtime; their bytes come from `data.js`.

The [menu placement](../menu_placement_v1/README.md) package already owns inventory placement, modal blocking, reconnect and layout probes. [Gameplay details](../gameplay_details_v1/README.md) already owns jump/target/threat/recovery details. This addition links those contracts and deepens uncovered states. It does not replace their screens or duplicate their placement alternatives. Existing game, app and research source remains unchanged; the main README and research index add navigation to this package.

Our fixture constants, timing, dimensions and proposed policies are authored choices. [Official source observations](sources.json) support bounded control/accessibility/API facts. They do not establish the source games' current behavior, this lab's usability, or complete accessibility compliance. External screenshots are **linked only**, never redistributed. Original CSS/SVG terrain, weapon geometry and project-browser captures are the only image material included. No third-party fonts are bundled.

No new reuse license is selected; repository visibility does not grant a blanket license. [Source and rights record](sources.json), [version and repairs](CHANGELOG.md), [visual inspection](VISUAL_REVIEW.md), [package status](HANDOFF.md) and [public integration scope](PUBLIC_INTEGRATION.md) accompany the source. Source publication is authorized; its delivered commit is identifiable in Git history. User design acceptance remains pending. No plugin installation or Site change is part of this work.
