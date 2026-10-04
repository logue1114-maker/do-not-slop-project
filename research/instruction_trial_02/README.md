# CP01 guided iteration with guide v2

An additional English-first guided iteration developed after reviewing the first actual pair. This is one revised artifact, not a fresh ordinary/guided comparison or independent proof of instruction effectiveness. The earlier pair, v1 guide, authored English reference, fixture and original outputs remain available unchanged.

## Screens and runnable source

- [Final desktop capture](screenshots/revision2-desktop.jpg) and [final narrow capture](screenshots/revision2-narrow.jpg): actual unedited captures of final source, not a proposed mockup
- [Final self-contained implementation](implementation/index.html) and [untouched first pass](implementation/first-pass/index.html)
- [Reusable guide v2](../../guides/cp01-task-first-v2.md), [portable public task brief](prompts/CP01-guided-iteration.txt), [exact fixture copy](fixture.json) and [run/change/verification record](run-record.json)
- [Original actual pair](../instruction_trial_01/README.md) and [faithful English reference](../instruction_trial_01/reference/reference-en.html)

Open either HTML file directly, or serve the repository using the root README command and open `/research/instruction_trial_02/implementation/`. Buttons only record a local finder intention; reset clears that log and closes Shared facts. No account or document service is connected.

## Instructions mapped to the observed screen

- V2 specifies white surfaces, charcoal text and equal blue actions: both final desktop action fills are `rgb(31, 95, 191)`, with the same treatment. These tokens are the project's proposed direction, not exact colors dictated by the user or a universal hue rule
- V2 removes added directive slogans and extra chrome: the page uses `Recent documents`, the small CP01 attribution and one concrete explanation. The deliberately poor Before copy remains protected evidence
- V2 keeps the local-demo boundary visible above the comparison and removes manufactured card height: both initial captures show the boundary; both desktop actions fit; the shorter After card reflects its empty authored body. The narrow screen scrolls vertically
- The two original documents, dates, ordering, source copy and common local action effect remain intact. The final narrow capture shows only the initial frame, not the entire vertically scrolling comparison; requested full-page and action/disclosure captures are not included

## Versions and checks

The first pass is preserved exactly. The sole implementation repair changed summary padding from `10px 0` to `var(--space-3) 0` (12px), aligning it with the specified spacing scale. No specimen, record, palette or action changed. A test harness's overly broad height regex was corrected separately; it had falsely matched permitted line-height and button min-height.

Run `node research/instruction_trial_02/checks/verify-source.mjs` from the repository root. It checks declared input/output/capture hashes, exact repair scope, protected source, self-containment, actual inline-script behavior in a minimal DOM/event VM, and used color contrasts. It writes [source results](checks/source-results.json); it does not run a real browser.

The [run record](run-record.json) separates first-pass browser checks from the focused final recheck. First-pass checks covered actions, repeat/reset/disclosure, native Enter/Space and forward Tab order; final checks covered 12px summary padding, no horizontal overflow, reverse keyboard order, default button color and final captures. This is not a fictitious complete rerun. Desktop frames are 1165 × 747; narrow frames are 390 × 844 with reported 375px document width after scrollbar reservation.

Native-phone, screen-reader, 200% zoom/reflow and human-usability testing remain unrun. Requested model/effort were `gpt-6.1-sol` / `xhigh`; exact backend revision and sampling are unknown. No fixed time budget was enforced. User approval, measured usability, causal instruction effects and general effectiveness are not established. Reuse license remains pending; public captures show project-owned synthetic UIs, with no supplied historical image or private media included.
