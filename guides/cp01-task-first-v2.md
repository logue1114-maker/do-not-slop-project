# CP01 English comparison guide v2

Build the same recent-documents copy comparison with less framing and a proposed case-specific white/charcoal/blue direction responding to the reported palette problem. The user rejected the prior tone and colors but did not prescribe these exact tokens. This guide is a case-specific revision informed by the first pair's actual screens. It is not a universal color rule or evidence of improved usability.

## Preserve the comparison

The fixture is `cp01-en-v1`. Both specimens are in the ready state for a returning user. Keep their source copy visible and intact, including the deliberately poor Before copy:

- Before attribution: `Before · Authored example`
- Before title: `Welcome back!`
- Before body, preserving the line break: `Explore amazing possibilities and begin a productive journey today.\nChoose a document below.`
- After attribution: `After · Authored correction`
- After title: `Recent documents`
- After body: empty; do not add replacement prose
- Both lists, in order: `Weekly meeting notes` / `Yesterday`, then `Launch checklist` / `October 2`
- Both action labels: `Find a document`
- Reset label: `Reset demo state`

Both actions append the same local finder intention to one action log. No real navigation, saving, publishing, or transmission occurs. Reset clears the log and closes the facts disclosure; it preserves the original documents and ready/returning state. Keep a reachable native disclosure with the shared state, returning flag, and both document records.

## Use this supporting copy

1. Page title: `Recent documents`
2. Small attribution: `CP01 · Copy comparison`
3. Visible boundary, immediately below the attribution: `Local educational demo. Buttons record an intention; no navigation, saving, publishing, or transmission.`
4. The two attributed specimens
5. One plain sentence below the pair: `The correction replaces the welcome and selection instruction with “Recent documents”; the documents, dates, and action stay the same.`
6. Secondary `Reset demo state` button and native `Shared facts` disclosure

Inside the disclosure, show `State: ready`, `Returning user: true`, and the two original name/date records as readable text. Include this necessary qualification once: `Both specimens are authored examples. No account or document service is connected, and this is not a measured user test.`

After an action, show a compact live status such as `Finder intention recorded · 1 action`, incrementing the count accurately. After reset, announce `Demo state reset`. Do not reserve a large blank status band before an action or hide the boundary inside the disclosure.

Do not introduce another headline, motivational or directive slogan, repeated preservation statement, evaluation vocabulary, or narration of an obvious control. In particular, remove `Start with the work` and `Put the document first` from the framing. This restriction does not apply to the protected Before specimen. There is only one case, so omit the one-option selector. Do not add a project masthead, numbered specimen tags, decorative status dots, icons, sidebars, navigation, or simulated product features.

## Use one compact visual system

Use a system sans-serif stack throughout. These are the implementation tokens for this sample, not a list of preferred styles for other screens:

| Role | Token |
| --- | --- |
| Canvas and specimen surfaces | `#FFFFFF` |
| Main text | `#202124` |
| Metadata and attribution | `#5F6368` |
| List separators and specimen borders | `#DADCE0` |
| Secondary control border | `#8A9099` |
| Both primary actions | `#1F5FBF`, white label |
| Primary hover | `#194F9E`, white label |
| Secondary hover | `#F5F6F7` |
| Keyboard focus | 3px `#1F5FBF` outline, 3px offset |
| Spacing scale | 4, 8, 12, 16, 24, 32px |
| Specimen and button radius | 6px |

Use no green/teal control, tinted wash, warm-neutral canvas, decorative colored top rule, or shadow for this revision. Blue identifies the real demo buttons and focus; it does not grade either specimen. Both specimens use identical text roles, row treatment, padding, border, button color, button size, and focus behavior. Do not dim Before or accent After.

- Main width: `min(1040px, calc(100% - 64px))`, centered; 32px top/bottom margins
- At 700px and below: main width `calc(100% - 32px)`; 24px top and 32px bottom margins
- Header: title 28px/34px, weight 650; attribution 14px/20px; 8px between them; boundary 16px/24px with 12px above it; 24px before the pair
- Pair: two equal columns with 24px gap; one column at 700px and below; Before precedes After in DOM and visual order
- Attribution labels: 14px/20px; 8px before their specimen
- Specimen: 1px neutral border; 24px padding, reduced to 16px on narrow screens; top-aligned, independently content-sized, with no fixed/minimum height or stretch
- Specimen title: 24px/30px, weight 650; source body: 16px/24px, 12px below its title, retaining its line break
- Documents: 16px after the preceding content; rows with 12px vertical padding and neutral separators; names 16px/24px, weight 600; dates 14px/20px
- At desktop widths, dates align right on the name row with 16px gap; at 700px and below, each date sits 4px below its own name. Use the same format on both sides. Do not prepend repeated `Modified:` labels
- Action: 16px after the list; 16px/20px, weight 600; 12px vertical/16px horizontal padding; minimum 44px height; width determined by label and padding, never stretched to fill the card
- Rationale: 16px/24px plain paragraph, 24px after the pair; no callout box or separate rationale heading
- Utilities: 16px after the rationale; secondary reset and native disclosure, 16px gap; wrap naturally on narrow screens. Disclosure content uses 16px/24px body text and no horizontal-scroll code block

Let the After specimen be shorter when it contains less copy. Equal treatment means the same rules, not empty space inserted to equalize heights. Do not use auto margins to pin either action to an arbitrary card bottom. The page may scroll on a phone; preserve readable type instead of squeezing both cards into one viewport.

## Verify the revision

Fail the revision if any protected copy or record changes, one specimen receives privileged styling, a fake control appears, the palette or slogans above remain, or the local boundary is absent from the initial view. Also fail it for a blank card region manufactured by fixed height, stretch, or bottom-pinned actions.

Render at 1165 × 747 and 390 × 844 CSS pixels. Inspect the real default screen: clear source text, readable names/dates, visible initial boundary, no clipping or horizontal overflow, and no decorative chrome competing with the comparison. At desktop, both actions should fit in the initial viewport. At narrow width, inspect the entire vertical comparison and utilities rather than claiming simultaneous visibility.

Exercise both actions, repeat an action, open/close the disclosure, and reset. Verify exact log counts, unchanged facts, and disclosure closure. Traverse all controls with Tab and Shift+Tab; activate buttons with Enter and Space, and the native summary with keyboard. Check focus, contrast in every used pairing, 200% zoom/reflow, and console errors. Record which checks actually ran; a screenshot, structural lint, or keyboard spot check does not establish screen-reader behavior or human usability.

## Tradeoffs and exceptions

The shorter page frame leaves the attributed specimens to explain the change. Smaller metadata remains secondary but may not drop below 14px. Natural card heights remove wasted space but sacrifice bottom alignment. Narrow dates cost vertical space to keep each date close to its document. Moving secondary qualifications into a disclosure is acceptable only because the demo side-effect boundary remains visible above the comparison.

A later product may need a selector, a sidebar, a welcome, a green action, or an intentional state color. Decide from that product's task and evidence. This proposed case-specific art direction and these CP01 failures do not prohibit those choices elsewhere.
