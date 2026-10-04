# White-surface combinations: review checklist

## Decisions held fixed

- One purpose at a time, with two role sets for the same specimen
- Identical layout, fixture, labels, hierarchy and interactions within each purpose
- White canvas and every main product surface; small active-state surfaces support written state labels
- Work is a task list with an inline creation form. Order review keeps merchandise/delivery separate from a compact receipt. Learning pairs course progress and an ordered lesson list with readable article content
- All six role sets are independent proposals. Official examples provide context, not copied palette provenance
- Low-contrast separators only group content. Interactive boundaries use controlBorder

## Source/model checks

Run verify-local.mjs against the exact index identified in manifest.json.

- Embedded fixture/palette data matches the adjacent JSON; six complete role sets and two schemes per purpose
- Palette changes preserve draft inputs, open editors, errors, local status and specimen DOM
- Task validation/create/escaping/cancel/Escape/filter/check/reset
- Delivery totals/validation/change/cancel/Escape/confirm/reconfirm, including the local-only payment boundary
- Reading progress/bookmark/complete/restart; restart retains bookmarks
- Actual delegated input/change/click/submit and reset handlers
- 102 foreground/background calculations: tested labels at least 4.5:1; tested control/focus pairs at least 3:1
- No service calls, external assets, dependencies, backend or persistent storage

## Rendered and native-input review

Record which checks were actually observed, their viewport and source hash; leave the rest unrun.

1. Inspect all six combinations at desktop width: task text, aligned order totals, reading width and a secondary inspector
2. Inspect all purposes and both schemes at narrow width: horizontal overflow, controls, prices and metadata; 16px body and at least 14px control/field labels
3. Open an editor, type a value and switch schemes. Preserve the value, error, completion/progress state and specimen geometry
4. Tab through selectors, scheme buttons, task controls, forms, bookmark, reset and disclosures. Check visible rings, Enter/Space, Escape and sensible focus return
5. Trigger then repair empty-task and delivery errors. Confirm a written instruction, associated input and accurate outcome
6. Change delivery after confirmation; finish/restart a course. Confirmation must never imply a real purchase
7. Inspect hover/selected/checked treatment and the editor's sole available filled primary action. Grouping separators are never the only control boundary
8. Check 200% zoom/reflow, screen-reader labels, progress/status announcements and native controls separately
9. Open the color-role and implementation-rule disclosures and the readable official-source page

## Evidence limits

Node VM checks do not establish rendered geometry, native keyboard focus, assistive-technology behavior, screenshot appearance or usability. Bounded browser observations establish only their recorded states. A contrast calculation is not full accessibility conformance. The source examples and proposals do not establish a universal best palette.
