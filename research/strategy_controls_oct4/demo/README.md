# Fleet command HUD: original controlled comparison

A bounded, library-free fleet-command slice. The map and buttons appear first. This is an authored synthetic A/B, not a recreation of Homeworld or Civilization and not a claim of measured usability improvement.

## Run

From this directory:

    python3 -m http.server 8765

Open `http://localhost:8765/`. Use HTTP rather than `file://`, because the app loads the single `fixture.json` file. No build, install, API key, paid service or external asset is needed. Tests:

    node --test tests.mjs

## Controlled contract

- One recursively frozen fixture: `synthetic-fleet-01`, 960×680 coordinate space, four ships, one waypoint, group A1
- One shared reducer state drives both frames: unit selection, hover, semantic focus key, selected command, target validity, preview, committed orders, errors, status and reset
- Both variants are created by the same world/control template and read the same view model
- A: authored larger right-hand rail and similar visual selected/hover rings
- B: authored compact contextual bottom HUD, distinct selected/hover/focus cues, and a persistent armed-command label
- Identical unit locations, names, hull values, movement/firing fields, available controls, targets, outcomes and order records
- Desktop maps have the same 680px authored height. “Narrow frame” uses a 430px-max panel, 380px map, and controls below the map. This is an authored responsive frame, not native-phone evidence
- Static SVG lines and textual movement/firing fields coexist. New commands record orders and draw their lines; no ship arrival, damage, combat, camera, economy or timing simulation exists

## Interaction and states

Click a friendly ship to select; Shift+click adds/removes. Enter/Space activate the focused native button. With focus inside a frame, M arms Move, A arms Attack, S records Stop, and Escape cancels an armed command without clearing selection. There is no global keyboard listener or custom Enter submission. Tab is native.

Move requires a selected friendly ship and open space or the relay waypoint. Attack requires selected friendly ships and a hostile ship. Choose the target, inspect dashed preview lines, then Confirm order. An invalid target clears preview, shows an error and cannot commit. Stop records immediately for the current selection. Cancel preserves earlier orders. Current fixture status fields remain static after commands.

Normal, Selection, Order preview, Invalid target and Empty buttons load deterministic shared presets. Reset restores the entire initial state, including hover/focus keys, order count and error state. Clicking either frame updates both.

## Evidence boundaries

Source observations are in the research deliverable one directory above. Useful original sources:

1. [Homeworld 3 official War Games demo feedback, 2024-03-27](https://www.homeworlduniverse.com/war-games-feedback/): input conflicts, accidental Spacebar production, concurrent movement/attack lines and HUD scaling/default footprint
2. [Josh Squires, Homeworld: Vast Reaches gameplay UI](https://www.joshsquiresdesign.com/homeworld-vast-reaches-gameplay-ui): separate selected/unselected × hovered/not-hovered documentation in a VR context
3. [Firaxis, Developing Settlements](https://civilization.2k.com/civ-vii/game-guide/gameplay/developing-settlements/): contextual settlement placement information while retaining map context; contextual hierarchy inspiration only, not fleet-control validation

Source-product screenshots show different scenes and must not be treated as this demo’s controlled A/B. All map vectors, units, HUD dimensions, layout and state copy here are original authored proposals. Existing games’ control conventions and colors are not universal recommendations.

## Verification

`node --test tests.mjs`: 30 passing tests, including immutable fixture, selection/hover/focus separation, empty selection safety, move/attack validity, preview vs commit, invalid recovery, no invalid commit, Stop, Cancel, Reset, retained simultaneous status fields, latest-order rendering logic and shared model parity. These are reducer/model and source-contract checks, not actual browser or usability results.

A browser QA pass found three-selection overflow and relay-label occlusion at 1180×757. The source CSS now regroups hull/name rows, trims baseline spacing, and provides the compact selection area more width with a 5px bottom inset. All selection facts and controls remain present. A later browser QA pass confirmed normal/preview three-selection layouts and focus recovery, then found 4.39px of baseline rail overflow when an invalid target and a retained last-order line coexist. A now uses a fixed 8px top inset and 10px padding to reserve clearance for that worst-known content state. A focused browser recheck at 1180×757 confirmed the retained-order + three-selection + invalid-Fang state with 12px of clearance above the A footer, and native Enter on A Confirm recovered actual focus to Kestrel in A so M worked immediately afterward. This is bounded evidence for that observed viewport and state. A second QA issue showed disabled Confirm/Cancel buttons dropping native focus to the body. The UI now recovers focus to the first selected ship in the same variant only when the focused Confirm/Cancel control becomes disabled; enabled controls, selection, hover, native Enter/Space and scoped shortcuts remain unchanged. A later browser check passed same-variant Kestrel recovery for B Cancel + Enter and A Confirm + Space; this is bounded evidence, not universal focus retention.

The focused observations above do not complete every browser gate. Broader preset and viewport coverage, full Tab order, HUD/world hit-test coverage, narrow-frame overflow and target visibility still need their own evidence. Native-mobile, zoom and screen-reader behavior remain untested. The read-only `window.fleetDemo` hook exposes cloned state/fixture and both model snapshots for verification. No metrics, participant tests, success rates or usability gains have been established.

## Files

`index.html`: entry; `style.css`: authored A/B presentation; `app.mjs`: common UI wiring; `state.mjs`: presentation-independent state machine; `focus.mjs`: scoped focus-recovery policy; `fixture.json`: sole world/content fixture; `tests.mjs`: built-in Node tests
