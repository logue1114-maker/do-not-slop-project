# AI implementation rules · White-surface combinations

Use these as proposed samples, not user-approved designs or reproductions of official products.

## Shared contract

- Build the actual task, order-review, or reading interface. Do not replace it with a hero, marketing slogan, or swatch gallery
- Keep canvas, surface, and secondary button surface #FFFFFF. Body text is 16px, labels and control text are 14px or larger, and primary and secondary actions are at least 44px tall
- Load exact fixtures and semantic role values from fixtures.json and palettes.json. Treat the role names as an API; do not distribute approximate hex colors through individual components
- Switch palettes by changing role variables only. Preserve every record, price, open editor, draft input, completion flag, selected delivery, current lesson, bookmark, status message, and specimen DOM when switching within a purpose
- Use a filled primary action, an outlined secondary action, and a quiet Reset this example utility. When an editor is open, its submit button becomes the only available filled primary action
- Apply hover only to enabled controls. Outline keyboard focus with a 3px ring and 3px offset. Input and outlined-button boundaries use controlBorder; low-contrast border is for grouping separators only
- Keep success and error text on white. Write the actual outcome, add a checkmark to success, and use an explicit error instruction with aria-invalid and associated error text. Do not make hue the only status signal
- Escape entered task text. All interactions are page-local. Reload resets the samples; no backend, login, real payment, order transmission, analytics, or persistent browser storage

## Role contract and semantic limits

The JSON names are the interface contract:

- canvas and surface: white page and product surfaces; secondary: white secondary-action fill
- text: body/record text; muted: neutral metadata. Neither becomes a brand-colored heading role
- border: quiet noninteractive grouping; controlBorder: visible input/outlined-control boundary
- primary and primaryText: supported next action and its label; hover: enabled primary hover fill
- secondaryText and secondaryHover: quieter action label and enabled hover surface
- focus: keyboard ring; accentSurface: a small selected/current-state support surface
- success and error: feedback text on white, backed by explicit outcome/error wording, checkmarks where relevant and associated input semantics

Do not use hue alone to mean Completed, Current, Saved or invalid. Use the written labels and checked/pressed/invalid state. Do not treat success as a general brand role or error as decoration. An action may use green without meaning a successful outcome; its label identifies the action. These proposals have no blanket green ban. The earlier CP01 white/charcoal/blue choice applies only to that case.

The samples do not define disabled, loading or destructive-action roles. Do not invent those states or assign their colors from an unrelated role; add a bounded fixture and explicit role definition if the task requires them.

## Ink signal · work · work-ink

- Use charcoal only for Create task and the inline Create task submit action; task titles stay in the neutral text role.
- Keep completed rows white. Use a checkmark, the Completed label, and muted text instead of a colored row wash.
- Use cool slate focus and neutral outlined secondary controls. Do not turn project labels, due dates, or every icon into charcoal buttons.

## Cobalt edge · work · work-cobalt

- Reserve deep cobalt for Create task, checked task controls, and the selected palette indicator. Keep the task list on white.
- Use blue-gray secondary text and an outlined Hide completed control; do not give the secondary action the filled cobalt treatment.
- Use the light accent surface only for a small active or focus-associated element. Dates and separators remain neutral, with no blue sidebar or hero block.

## Forest receipt · shop · shop-forest

- Put deep forest on Confirm demo order and Save delivery. Keep item names, price rows, and the total on white surfaces.
- Use gray-green neutral text for delivery detail and quiet separators. Do not spread a green background across the checkout page.
- Use an outlined Edit delivery action. The confirmation message must say Demo order confirmed locally and No payment made, with a checkmark as well as success color.

## Terracotta order · shop · shop-terracotta

- Use dark terracotta for the confirmation and delivery-save actions. Avoid bright orange promotions or large colored order-summary blocks.
- Pair it with warm gray detail text and fine neutral separators; all merchandise and monetary rows remain white.
- Keep the order total in the main text role, not terracotta. Show delivery validation errors in the separate error role with a specific written instruction.

## Plum margin · learn · learn-plum

- Use deep plum for Continue lesson and the progress fill, while the article stays white with neutral body text.
- Give only the current lesson a modest violet-gray accent surface and a Current label. Completed lessons need a checkmark and Completed label.
- Keep Bookmark outlined and visibly pressed when saved. Do not color whole paragraphs, add a purple reading panel, or use plum as error color.

## Petrol chapter · learn · learn-petrol

- Use petrol blue for the next-lesson action and progress fill. Keep the reading surface and course navigation white.
- Use slate for lesson metadata. A small pale-petrol current-lesson highlight may support the written Current label, but must not become a teal page wash.
- Use the outlined Bookmark control with Saved text and aria-pressed state. Preserve neutral article text and separate error and success roles.

## Exact interaction requirements

Work: opening Create task shows a labeled editor; an empty title produces Enter a task title. Creation appends one escaped local row. Checkbox actions update completed counts. Hide/Show completed changes only the visible rows. Cancel and Escape discard the open draft and return focus to Create task.

Order review: keep sample item quantity and price rows visible. Initial standard delivery totals $47.52; pickup totals $43.20, using a clearly fictional 8% tax on subtotal plus delivery. Edit delivery opens a native select. Save validates the method and recomputes totals. Cancel and Escape preserve the saved method. Confirmation is idempotent and says No payment made. Saving a delivery change clears the earlier confirmation.

Learning: Continue lesson completes the current lesson and opens the next. Finish lesson completes the third; Review from start resets reading progress while retaining bookmarks. Bookmark toggles only the current lesson and exposes aria-pressed. Show progress as a value, text, and a modest primary-color fill. Use an ordered lesson list with written Current, Upcoming, and Completed labels.
