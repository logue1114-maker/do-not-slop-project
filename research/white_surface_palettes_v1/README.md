# White surfaces · Six purpose-specific combinations

A runnable English explorer with six original role sets and three fixed synthetic interfaces. Open [index.html](index.html) directly, or serve the repository using the main README command. CSS, JavaScript, fixture and palette data are embedded; no installation, login, API key or backend is needed.

- Work: **Ink signal** (charcoal + cool slate) and **Cobalt edge** (deep cobalt + blue-gray)
- Order review: **Forest receipt** (deep forest + gray-green) and **Terracotta order** (burnt clay + warm gray)
- Learning: **Plum margin** (deep plum + violet-gray) and **Petrol chapter** (petrol blue + slate)

Within each purpose, changing the scheme preserves the same specimen DOM, records, hierarchy, open editor, draft, progress and local outcome. All actions are page-local; the fictional order never takes payment or sends an order. Reload resets the examples.

## Reuse the roles, preserve the task

Read [palettes.json](palettes.json), [fixtures.json](fixtures.json), [AI implementation rules](ai-implementation-rules.md) and [review checklist](review-checklist.md). Each palette has 16 roles covering white surfaces, neutral text, grouping and control borders, primary/secondary actions, hover, focus and semantic feedback. A role is not permission to color an entire page or to remove written state labels. Green is an available action color, not a prohibited hue; the earlier CP01 palette decision is case-specific.

[Official examples](sources.html) and unchanged [source data](sources.json) separate observed appearance, published rules and version limits for six official cases. Spotify is a dark-surface contrast case, not a white-page template. These sources contextualize the design decisions; our six palettes are independent authored proposals, not copied brand tokens, official approvals or user-approved final designs. The three earlier proposal families in sources.json are research context, not a mapping to this six-scheme explorer.

## Source history and evidence

The untouched first pass is retained in [first-pass/](first-pass/). [Changes](repair-log.md) distinguish its objective repairs from the sole later integration change: the secondary source link now opens the readable sources.html. [Manifest](manifest.json) records exact retained bytes. [Seven actual captures](screenshots/) and [bounded browser observations](browser-observations.md) are included separately; source tests are not screenshot evidence or a usability result.

Run from the repository root:

    node research/white_surface_palettes_v1/verify-local.mjs

The test executes the actual inline script in a Node VM with minimal DOM/event stubs, validates fixed data and source hashes, checks interrupted/repeated local flows and calculates 102 actual contrast pairs. It writes qa-local.json. Native controls, rendering, keyboard input, assistive technology and human usability require separate review. No full WCAG certification or measured usability improvement is claimed. Reuse license remains undecided.
