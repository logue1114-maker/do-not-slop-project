# Bounded browser verification

Integrated public-source verification on 2026-10-05 passed **27/27 grouped browser checks**, with 0 failures. The original runtime HTML’s SHA-256 is `18d59cd046ba0a6aa34ab12b4effecf489c033932ad762471cc888f2d6d92848`; it matches the author’s existing completed source exactly. [Machine-readable results](checks/test-results.json) and [geometry](checks/measurements.json) describe the tested stages.

The real headless Chromium browser used native DOM click, selection, keyboard and emulated-touch actions. A test-only reset restored initial state between scenarios; it did not replace the interaction handlers or fabricate outcomes. Coverage includes six default renders at 1165×747 and 390×844 CSS px, primary flows, repeated/interrupted/Back paths, escaped drafts, unsaved-change guards, work record preservation, booking stale recovery, explicit reset, ordinary Tab/radio behavior, mobile outline reopening, 320px/enlarged-text probes, console errors and external requests. No application error or external request was observed in the recorded states.

[Loopback HTTP results](checks/http-results.json) separately passed **21/21 checks**, exercising all six flows, narrow reflow, exact served bytes and document links. This is local HTTP validation, not public hosting or a Site deployment.

There are 33 unedited final full-page PNGs and 12 retained first-pass entry captures. Their CSS viewports are not their full-page image heights. [Capture hashes](screenshot-manifest.json) declare exact bytes. The historical first pass retained 22 passed and 5 failed checks; those failures and subsequent implementation/test corrections are reported in [repair history](REPAIRS.md).

[Source checks](checks/structural-results.json) cover embedded/mirrored data, functional/design isolation and 90 declared role contrast pairs, with disabled-controls thresholds explicitly unasserted. They do not check every rendered pixel or establish full accessibility. Native phones, real screen readers, true browser zoom, participant usability, causal effectiveness and user design approval remain unrun or unestablished.

## Visual spot-check

The retained final images were directly inspected for desktop shopping and information entries, desktop course incorrect feedback, narrow community draft preview, narrow work editing with visible keyboard focus, and narrow booking unavailable-slot recovery. These six screenshots showed readable hierarchy and controls without observed horizontal clipping. Full-page images include content below the CSS viewport. This spot-check does not establish complete usability or accessibility.
