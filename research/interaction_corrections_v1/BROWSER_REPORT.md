# Browser report

**Latest completed browser authority: `checks/final-2/results.json` — 73 grouped scenarios passed, 0 failed, 0 recorded page/console/request errors; 92 unedited captures.**

This is functional/rendered verification of deliberately authored examples. It is not an ordinary-versus-guided AI trial, participant usability test, sensory verification, or design approval.

[Raw results and source hashes](checks/final-2/results.json) · [Input record](checks/final-2/actions.json) · [Geometry](checks/final-2/geometry.json) · [Capture hashes and per-capture state](checks/final-2/captures.json) · [Structural/package checks](checks/package-results.json).

## Executed scope

The installed Chrome/Chromium version, platform and run timestamp are in the raw record. Tests use DPR 1, headless rendering, actual browser mouse/keyboard actions, native form input and a separate Chromium mobile/touch-emulation context. Test setup loads a fresh URL; runtime state is read through a read-only snapshot function. No test mutates the application's state object to manufacture a successful path.

All six corrected labs were rendered and exercised at 1165×747, 768×900, 390×844, 844×390 and 320×720 CSS px. Corrected geometry checks found no page horizontal overflow, no control extending horizontally outside its specimen and no button below the proposed 44 px height. Tall phone/landscape tasks use ordinary document/internal scrolling. Problem adaptation deliberately clips its fixed-width editor; it is labelled as a fault, not counted as a corrected fit.

| Lab | Executed behavior |
| --- | --- |
| Input | Attack/purchase dismiss leakage reproduced; typing ap reproduces hotkeys while preserving typed text; repeated-key problem reproduced; corrected focused shortcut/modifier/repeat rules; native modal input blocking, forward/reverse Tab wrap, Escape and opener return; held-A polling through problem modal and corrected gate/release/rearm |
| Priority | Nine-event burst, repeat delivery, grouped exact 20-shard claim, duplicate claim suppression, hazard acknowledgment, chat history, presentation expiry at 6s versus actual invitation deadline at 12s; expired invitation disabled while its record remains |
| Decisions | Problem negative ore and owned/locked purchase reproduced; current/after/delta arithmetic; comparison recomputed after equip; missing-stock disabled craft, gather, single craft; equipped/owned/rank-locked/available shop states, Cancel/return, unique local purchase and repeat safety |
| Adaptation | Problem rebuild loses route/focus/range; corrected native field, value, route and selected text retained on actual viewport resize, keyboard-occlusion model, long English labels, CSS 200% text and canceled review |
| Recovery | Problem draft loss; delayed search, empty query explanation, populated selection, repeated Enter, Cancel plus ignored late reply, failed save/retry, editing during save, acknowledged older revision leaving newer edits dirty, slower canceled response arriving after newer acknowledgment, disconnect and failed/canceled/successful reconnect retaining query/selection/draft |
| Feedback | Problem pointer-down commitment and premature success reproduced; corrected pressed state and release-away abort; native radio/Enter/Space, pending duplicate guard, acknowledged outcome and browser timestamps; failure/retry, Escape cancel plus late response ignored, explicit/system reduced motion; optional audio/vibration API attempt or unavailable handling |

Lab switching while a save is pending invalidates the response. Navigation also supports arrow/Home/End keyboard input. Local source HTTP bytes and reused-contract destinations were checked. Physical inputs are separate from browser touch emulation.

## Retained failure history

- `initial`: interrupted setup-error run. Hash-only navigation retained previous state, so later tests targeted the wrong specimen. Failure captures/source remain. No complete verdict or fabricated pass count is assigned.
- `repair-1`: 69 passed / 2 failed. Native modal traversal allowed transient focus outside intended controls; explicit wrapping repaired it. The system-motion assertion raced the media-change event; the harness now waits for the observed event.
- `repair-2`: 72 passed / 0 failed after input rearm and action-deadline refinements. Visual inspection subsequently found the shop hidden-state CSS override; that result remains historical.
- `final`: 73 passed / 0 failed after the hidden-state repair and visibility test.
- `final-2`: 73 passed / 0 failed with enlarged editor labels and focus fallback after an action becomes disabled. Runtime/source hashes match the deliverable. Subsequent documentation/package verification is separate from this browser execution.

Package verification passes 7 grouped gates, including 10 declared text-role contrast pairs. Its first call failed a link check because its own report file had not yet been emitted; [that bootstrap failure](checks/package-first-pass.json) remains separate from [the passing result](checks/package-results.json).

## Unrun limits

Physical phone/touch/safe-area/controller testing; native software keyboard; native IME and speech input; screen-reader output; true browser zoom; actual non-English localization; game-engine and source-game runtime; backend/durable-save or real-network behavior; physical hearing/haptics; broad performance/latency/participant testing; complete WCAG/XAG conformance; user design acceptance.

The keyboard model occludes a bounded area in CSS. Long English labels approximate translation length. CSS 200% text is not true browser zoom. Audio scheduling or a vibration API return is not evidence of hearing or physical sensation. Exact timings in the fixture are proposals; measured event timestamps are browser observations of that local simulation.

No commit/push or publication occurred during these browser runs. The subsequent authorized Git source publication is separate and described in [PUBLIC_INTEGRATION.md](PUBLIC_INTEGRATION.md). No Site change, plugin install, external asset redistribution, real purchase or authentication occurred. Proposed/unrun research edge cases have not been folded into these executed-test counts.
