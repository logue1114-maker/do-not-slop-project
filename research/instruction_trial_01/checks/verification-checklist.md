# Shared verification checklist

Use this exact checklist in both runs after the first-pass implementation. Save the first-pass file before any allowed repair.

1. Render at 1165 × 747 and 390 × 844 CSS pixels at 100% zoom. Save screenshots of the default screen and check clipping, horizontal overflow, and readable text
2. Verify the two specimen titles/body texts, Before/After meaning, exactly two identical document records per panel, order, names, modification values, and Find a document labels
3. Activate each Find a document action; verify the same demo-only intention and no real navigation or network side effect. Repeat an activation
4. Reset demo state after action use; verify local action state is cleared and protected document facts remain. Open/close the shared-facts disclosure and reset again
5. Use keyboard only to reach the actions, reset, and disclosure. Check visible focus, Enter/Space activation where appropriate, reading/Tab order, and no trap
6. Check browser console errors and uncaught exceptions. Report checked states; do not invent states absent from the fixture
7. Save a concise report and any exact defect/repair record. Label checks passed, failed, blocked, or unrun; distinguish structural automation from visual review

The same verification tools and one bounded repair opportunity apply to both arms. Verified objective defects may be repaired; subjective redesign or repeated candidate selection is outside the allowance.
