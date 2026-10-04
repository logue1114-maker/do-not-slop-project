# Bounded browser observations

Observed 2026-10-04 against the integrated index SHA-256 `2cad8fe59323adfac7158c8d52c69f62d7c6a5c9c8495e07dccb80f780f903b6` in a cloud browser. These are actual interface observations, separate from the source/Node VM checks.

## Captures and rendering

- Six desktop captures show all six role sets at 1165 × 747 outer frames, with the initial fixed data before actions
- The representative order-review capture is 390 × 844, with 375px document width because the browser reserves a 15px vertical scrollbar
- All seven capture pixels were inspected. Files are retained byte-for-byte without image editing. The pointer is on a selected purpose or scheme control in some captures; product primary actions are not hovered
- Narrow work, order-review and learning views each had scrollWidth equal to clientWidth at 375px; no horizontal overflow was observed. Only order review has a retained narrow screenshot
- These are viewport captures, not full-page images. Content below the viewport requires vertical scrolling, including narrow order totals and some learning content

## Observed interactions

- Work: checkbox selection survived scheme switching; empty-title error appeared; a valid task was created locally; Hide completed worked
- Learning: Bookmark and Continue opened lesson 2 at 33%; switching schemes retained lesson 2; reset restored initial progress
- Order review: an in-progress delivery selection survived a palette change; saving local pickup produced $43.20 compared with $47.52 standard delivery; local confirmation worked, then reset restored $47.52
- On the narrow order view, Enter activated local confirmation
- No application defect requiring a runtime repair was found in these tested states

## Unrun gates

Full keyboard traversal, screen reader, native phone, 200% zoom/reflow and a complete browser-console audit were not run. This is not exhaustive interaction, accessibility or usability testing. No user design approval, general palette superiority, measured task-success result or general instruction effect is established.
