# Versions and repairs

All work is additive under `research/interaction_corrections_v1`, based on main `24e2fd2fcd8a0163b3560239b071a48d1188d7c8`, checked out 7 October 2026. No existing tracked source was changed. These are authored fault/correction examples, not experimental arms.

1. Initial source: six task layouts, shared fixed fixture, local state transitions, exact instructions. `checks/initial/source/` freezes the original runtime/harness. The first browser run was interrupted after its setup fault was identified: hash-only navigation did not reload the previous lab/mode. Its failure captures remain; no complete passing verdict exists for this run.
2. Harness repair: fresh page query for every scenario. `checks/repair-1/` retains source and a complete run: 69 passed / 2 failed. Runtime failure: native Chrome dialog traversal transiently left the intended modal controls. Harness issue: reduced-motion assertion raced the asynchronous media-query event.
3. Runtime/input refinement: explicit modal Tab wrap; polled held-A context gate and release rearm; no rearm suppression for a close when A was not held. Notification refinement: separate cue expiry at 6s from actual invitation deadline at 12s, with a disabled expired action retained in history. Instructions cite Godot's independent global Input state and XAG input alternatives. Harness waits for actual media-query change and adds deadline checks.
4. Later run/result and visual refinements are recorded in `BROWSER_REPORT.md` and `VISUAL_REVIEW.md`. Retained run directories are historical evidence; the report identifies the final authority. Runtime/source hashes and capture hashes are preserved per run.

The latest task clarifications were incorporated before final verification. Long English labels remain an explicit translation-length proxy. Native software keyboards, physical sensory feedback, screen-reader output, engine runtime and true zoom remain unrun. These implementation runs performed no publication/commit/push and selected no new license; later Git publication is recorded separately below.

5. Shop disclosure repair: visual inspection of repair-2 showed that the grid display rule overrode native hidden. Added an explicit hidden display rule and a real disclosure visibility regression. `final` passed 73 scenarios.
6. Final refinement: editor labels/help/range scale with the text stress; completed/disabled equip and claim actions restore focus to a retained selection/disclosure. `final-2` passes 73 scenarios and is the latest authority. Earlier source and captures remain intact.

7. Authorized public integration: added the package and minimal six-screen README/research-index navigation against unchanged main `24e2fd2`. Runtime/final source and capture bytes were retained exactly. Public status/rights/integration records replace the earlier local coordination notes. Publication checks and Git history record delivery; no Site/plugin change or new license.
