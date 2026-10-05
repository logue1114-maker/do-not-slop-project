# Preserved first pass and objective repairs

`first-pass/` retains the first completed HTML, data/presets, implementation guide, source notes and builder. No before/after effectiveness claim is made. `first-pass/` contains the first real browser run: 22 of 27 checks passed; the five recorded failures are retained.

1. **Booking time parsing:** action identifiers used `:` separators, so `14:00` became `14`. Join all remaining time parts, preserving exact fixture time. This restores the prescribed stale-slot conflict and explicit alternative review. The initial mobile file named `booking-conflict` actually showed confirmation because of this defect; its failed test record, rather than the filename, governs interpretation.
2. **Draft ownership:** a saved community reply was shared across threads. Store drafts by stable thread ID and load only that thread’s text. Other threads and fixture reply counts remain unchanged.
3. **Mobile selected label:** the small Selected suffix was 12px. Raise it to 14px to match the control-label proposal.
4. **Booking Back after confirmation:** revisiting review showed an enabled confirm control even though its handler ignored repeat confirmation. Show the retained local confirmation and disable the already-completed action. Changing a selection/input makes a new explicit local review possible.
5. **Capacity validation:** native numeric constraints intercepted form submission before the promised fixture recovery copy ran. The booking form uses `novalidate` and its own bounded validation, associated error and preserved inputs. Native input types and min/max hints remain.

The tests also needed two corrections, separately from the implementation: Back from draft to preview preserves the same unsaved draft and must not manufacture a loss warning; the guard is expected only when leaving that editing scope. Native radio groups put one selected/initial item in the Tab sequence and use arrows for choices; the check now follows that behavior instead of requiring every radio in Tab order.

Functional requirements/data were separated from design guidance as an input-scope clarification. This did not create a second experimental arm. Rendered dimensions were added only after actual capture.

Public integration preserves the runtime HTML byte-for-byte. Development harnesses were made portable, and original report machine-location fields were omitted. Fresh public-tree checks are recorded separately from the historical first-pass results.
