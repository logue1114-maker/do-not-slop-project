# Exact reusable AI instructions

Use the [interactive visual examples](index.html) and [fixture/contract](contract.json) with your actual product data. These instructions were authored for the demonstrated failures, not derived from a causal experiment. Exceptions and native verification limits are part of each instruction.

## 1. Input conflicts

[Working example](index.html#input) · [Existing coverage](../menu_placement_v1/AI_INSTRUCTIONS.md)

```text
Build [surface] from my actual input map and actions. Assign each pointer/key gesture to one active input owner. While a modal is open, make the underlying world inert, contain Tab, provide Escape/Cancel, and restore its opener. Consume dismissal before any underlying action; clearing an overlay must never replay the dismiss gesture into attack, purchase, or held input. Character shortcuts must be disabled, remappable, or active only on the focused component. Ignore editable targets, composition, modifiers and repeat unless explicitly required. Provide equivalent visible buttons. Test close over every destructive target, typing shortcut letters, Tab boundaries, repeated keys and focus restoration. Report native controller/IME/speech checks separately; do not infer them from synthetic events. In Godot, let GUI consume events and route gameplay through _unhandled_input where appropriate. Input.is_action_pressed reflects global state even after accept_event/set_input_as_handled, so gate polled gameplay with the active context as well. Clear queued actions and require held controls to release before rearming after dismissal; a timed cooldown alone is insufficient. The browser lab’s optional 200 ms polled-input model proves this separate gate using held A, modal open/close and fresh press; it does not verify a game-engine implementation.
```

Input: Dismiss target: attack or demo purchase. Type “ap” in the radio note.

1. Choose Problem. Open the notice and dismiss it; inspect the counters. Repeat with the purchase target.
2. Reset, then type ap in the radio note. The problem hotkeys act while you type.
3. Choose Corrected and repeat. Open the notice, press Tab / Shift+Tab, then Escape. Focus returns to Open notice.
4. Enable Polled-input model, focus the arena and hold A. Open/close the notice while A remains held. Corrected stops polling and requires release plus a fresh press; Problem continues through the notice.

Expected output: Problem: dismiss increments an action; typing ap increments both. Corrected: both counters stay zero until an explicit world action.

## 2. Information priority

[Working example](index.html#overload) · [Existing coverage](../gameplay_details_v1/README.md)

```text
Use my notification records and classify urgency, actionability and persistence before layout. Keep immediate danger and the next objective readable without opening a drawer. Group repeated rewards by meaning with exact amounts and an idempotent claim. Keep chat and ambient updates secondary and optionally inspectable. Specify expiry per class: actionable rewards and active objectives cannot disappear silently; move expired chat to accessible history. Never let notices cover the primary task controls. Use one appropriate status summary rather than assertive announcements for every low-priority event. Test a dense burst, expiry, repeat delivery, duplicate claim, dismissal and keyboard focus during an update. Do not invent urgency or change the supplied quest/reward facts. Separate presentation expiry from the actual action deadline. In this fixture chat cues expire at 6 seconds but the crew invitation stays actionable in history until 12 seconds, then remains as an expired record with its action disabled. Retaining history must never imply an expired action is still valid.
```

Input: Nine simultaneous notices: one hazard, one quest, three rewards, three chat messages, one ambient cue. Advance the fixture clock by six seconds.

1. Choose Problem and Deliver burst. The notices share one stack over the route. Advance 6 seconds: every notice disappears.
2. Choose Corrected and Deliver burst. Keep the hazard and route visible; open Rewards or Chat separately.
3. Advance 6 seconds. Ambient/chat cues expire from the main view; history retains chat and unclaimed rewards remain. Claim twice and acknowledge the hazard.
4. Open Chat history at 6s: the invitation is still available. Advance to 12s: its retained record now says expired and cannot be accepted.

Expected output: Corrected: one hazard, one quest, a 20-shard reward group, chat history; claim grants exactly 20 once. Expiry never removes an unclaimed reward or active quest.

## 3. Equipment & crafting

[Working example](index.html#decisions) · [Existing coverage](../menu_placement_v1/README.md)

```text
Build [equipment/crafting/shop] with my actual inventory, equipped item, stat formulas, recipe quantities, currency and availability rules. Show current -> resulting stats and signed deltas against the current equipment; do not imply every positive number is better (weight/cost may be worse). Recompute after equip without losing selection. Before crafting, show owned / required and exact missing quantities, with a reachable acquisition explanation. Validate again on commit; never deduct into negative stock or duplicate a unique craft. Derive shop actions from available, owned, equipped and unavailable states with explicit reasons. Review any currency commitment with item, quantity and exact cost; Cancel must preserve data and return focus. Repeated confirmation must be idempotent. Test arithmetic, stale equipment, missing stock, repeat craft, locked/owned items and cancel/confirm. Use only a local purchase simulation until a real transaction contract is supplied. Treat ownership, equipped status and eligibility as separate dimensions. State which direction is favorable per stat. Compare incompatible bonus types as labelled effects rather than fabricating a numeric delta.
```

Input: Reed sword 10/8/4; owned Iron blade 16/6/6; recipe needs 3 ore + 2 fiber, owned 2 + 2; 30 demo coins.

1. Inspect Iron blade in Problem, then craft with insufficient ore. The fault permits negative materials. The shop also accepts owned or locked items.
2. Choose Corrected. Inspect Iron blade: compare attack, guard and weight to equipped Reed sword. Equip, then inspect again.
3. Inspect Field dagger, gather one ore, craft once, and inspect the new comparison. Open Shop; review Copper charm, cancel, review again and confirm.

Expected output: Corrected: Iron changes +6 attack / −2 guard / +2 weight. Craft is blocked until one ore is gathered, then consumes 3 ore + 2 fiber once. Shop distinguishes equipped, owned, rank-locked and available; one charm costs 20.

## 4. Screen changes

[Working example](index.html#adaptation) · [Existing coverage](../menu_placement_v1/AI_INSTRUCTIONS.md)

```text
Adapt [screen] to actual viewport, orientation, visual viewport/keyboard and platform safe-area contracts. Preserve stable field nodes, route/item selection, entered value, selectionStart/End, scroll and focus across layout changes; do not rebuild or reset the task on resize. Reflow content and actions at 320 CSS px and enlarged text; wrap long real translations instead of clipping or shrinking them. Keep focused editing and its completion/cancel actions inside the available viewport or a reachable scroll area. Capture/restore editing range after a canceled review only when the same field still exists; otherwise define a logical fallback. Test live typing plus rotation, long labels, 200% text, keyboard occlusion, review/cancel and Back. Distinguish a reduced-height/English-length model from a physical software keyboard, true browser zoom and actual localized-language checks.
```

Input: East ridge selected; a dispatch note with a selected text range. Resize portrait / landscape, model keyboard occlusion, expand labels and enlarge text.

1. Choose Problem, select East ridge and type a note. Model keyboard or text/label changes: the rebuilt field loses focus and selection; narrow layout clips its controls.
2. Choose Corrected, select East ridge and type a note. Select text, then enable the keyboard model, long English label stress and 200% text.
3. Resize the actual browser. Route, note and native field remain. Review dispatch, cancel, and continue editing at the same range.

Expected output: Corrected preserves route, value, focus and selection through layout changes and canceled review. Keyboard model is a labelled occlusion fixture, not a real software keyboard test.

## 5. Waiting & failure

[Working example](index.html#recovery) · [Existing coverage](../menu_placement_v1/README.md)

```text
Define idle -> pending -> success / empty / failure / canceled / offline for [task] using my service contract. Separate draft value and revision from submitted snapshot and acknowledged revision. Keep search text, selection, entered draft and recovery context on failure/disconnect. Prevent duplicate pending requests, expose Cancel where supported, invalidate canceled/stale completions and allow retry without retyping. An empty result must name the query and a useful next action. Saving an old snapshot must not clear newer edits or announce them saved. Keep error text and status programmatically available without stealing focus; state exactly what is locally retained and what is durably saved. Test delayed response, duplicate press, cancel plus late completion, zero results, failure/retry, edit during save and interrupted reconnect. Never claim server persistence from a local fixture. Expose requestId, submitted revision and acknowledged revision. Test a slow canceled revision N arriving after successful revision N+1: the late response cannot replace the newer draft or acknowledged version. Repeated retry must not create duplicate acknowledgments.
```

Input: Search “relay” or “zzz”; a survey note; injected next-response failure; a disconnected local simulation.

1. Choose Problem, type a survey note and fail the next save or disconnect. Observe lost work; an empty search gives no explanation.
2. Choose Corrected. Search zzz, then relay. Cancel a pending search and retry; double activation stays one request.
3. Type a note, fail Save, retry, edit during Save, then disconnect/reconnect with failure and cancellation. Search text, selected result and note remain.

Expected output: Corrected: explicit loading / empty / failure / offline states; cancel ignores late results; failed save keeps draft; saving an earlier snapshot leaves newer edits dirty. Reconnect preserves entered work.

## 6. Interaction feedback

[Working example](index.html#feedback) · [Existing coverage](../gameplay_details_v1/README.md)

```text
For [action], specify distinct pressed, selected, pending, success and failure states. Show immediate reversible press feedback; commit on completed activation/release so dragging away or pointer cancellation can abort. Keep selection identifiable by shape/text plus programmatic state, not color alone. Prevent duplicate pending activation. Announce success only after the real acknowledgment and failure with a specific reason and retry. Cancel or leaving the task must invalidate late results and transient feedback. Treat timing constants as product proposals until measured; record actual event timestamps separately. Respect prefers-reduced-motion and an explicit override, preserving essential text/shape feedback. Make audio/haptics opt-in, handle unsupported or rejected APIs, and provide equivalent visible feedback without them. Test hold/release-away, keyboard Enter/Space/repeat, selection, delayed success, failure/retry, cancel, motion-off and API-unavailable paths. Browser API success is not verified hearing, vibration, physical touch or screen-reader output. If a hold-to-confirm mechanic is added, provide a safe ordinary-activation alternative; do not require prolonged holding for every user.
```

Input: A selected beacon channel; one 700 ms simulated calibration; fail-next; motion, opt-in audio and haptic controls.

1. Choose Problem. Press Calibrate: it commits on pointer-down, so moving away cannot cancel; the premature “Completed” claim precedes the response.
2. Choose Corrected. Choose a channel, hold the button, move away and release: no request. Activate normally or with Enter/Space; wait for success.
3. Fail the next calibration, retry, cancel while pending, and repeat with reduced motion. Optional sound/haptic probes report API attempts, not hearing or physical sensation.

Expected output: Corrected: pressed is immediate; selected is persistent; pending blocks duplicates; success/failure follows the result. Cancel suppresses late feedback. Text and shape remain with motion/audio/haptics off.
