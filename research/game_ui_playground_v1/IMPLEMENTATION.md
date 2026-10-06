# Implementation and reuse

The screen contract is an English, low-prose workbench: a dominant playable scene plus live settings. Core tasks are navigation, gear comparison and a safe local transaction. Supporting examples are one small encounter and one quest. The lab uses quiet paper, restrained field colors and original vector silhouettes. The inspector controls the stage rather than replacing it with a gallery screenshot.

## Files and state ownership

- `data.js` is the runtime default/fixture source. `materialize-data.mjs` writes matching `config.json` and `fixture.json` for reuse; `verify-source.mjs` checks parity.
- `app.js` separates `states.minimap`, `states.inventory`, `states.shop`, `states.hud` and `states.dialogue`. The `renders` registry maps each station to its rendering function. Each station has separate settings, initialization and input branches. No station can spend another station's resources.
- `styles.css` contains semantic tokens, workbench breakpoints, container-based game layouts and Play view. CSS container queries use the actual game width, including the internal portrait frame.
- `gamePlayground.snapshot()` returns a clone for inspection. It exposes no state setter or test-only winning path.
- `serve.mjs` is an optional loopback static server. It serves only this repository root, checks path containment, and has no write route.

The state is deliberately memory-only. A game engine port should replace only the local action resolver with a real authority while preserving selection/intent/commit boundaries. Do not connect the shop confirmation to a payment endpoint without a separate product and authorization contract.

## Core rules

Minimap projection uses the same world coordinates as the scene and area map. North-up has zero map rotation; heading-up counter-rotates terrain and marker positions while keeping the player forward. Follow framing centers the player. Full frame centers the authored area, ignores saved zoom/orientation and leaves those values available when Follow resumes. A circular rim uses radial clamping; a square rim clamps by the largest coordinate. An arrow means direction only. Visibility is a category gate followed by the objective's map scope. No map-controller priority or marker-priority setting is invented.

Inventory selection stores only an item ID. Equipment stores weapon and armor IDs. Compare reads the relevant equipped slot and selected item's power/guard; it shows signed differences. Equip validates slot, rank and identity before committing. Supplies/materials have detail but no invented Use action. Filtering clears selection, never the loadout. Compact detail Back restores the selected item; Close restores the camp opener. Existing selected/committed state survives switching and viewport changes.

Shop quantity is an integer bounded by remaining stock and nine. Review creates a `{id, quantity, total}` pending record without spending coins. Confirm validates it again, debits coins, decrements stock, adds owned quantity, increments the transaction count, clears intent and shows a receipt. Clearing intent makes a duplicate activation inert. Cancel/Escape clears only intent. Common-supply shortcuts follow the same review flow. Two beacons can naturally reach the sold-out state with the starting balance. Route recommendations are fixed authored flags, not a live recommendation engine.

HUD cooldown is decremented by elapsed time in the active, unpaused station; it never advances while another station is selected. Updating the timer changes its meter/text in place, preserving focus. Damage/heal clamp health and consume a tonic once. A completed encounter blocks further resolution. Dialogue acceptance changes progress state; collecting stops at three; reward is committed once, only after return.

## Adding a detail module

1. Write the detail's own fixture, input/output contract, scene and evidence limits. Keep source observation separate from the proposed behavior.
2. Add a new key to config, `labels`, initializer, `renders`, settings and action routing; add one navigation button. Give it state ownership separate from the existing examples.
3. Render the consequence immediately. Use an actual interrupted/success/error/recovery path, not a named panel with decorative controls.
4. Extend the native-input runner and screenshot targets only for the new module and any shared layout it changes. Re-check repeated commitment and Back/focus recovery.

Candidate modules remain **not implemented**: damage direction/camera response, ambiguous interaction priority, pickups/reward presentation, death checkpoint return, save or connection recovery and tutorial re-entry. The existing HUD hit/retry is only a simple training fixture; it does not implement those richer details.

## Verification commands

```powershell
node research/game_ui_playground_v1/verify-source.mjs
$env:PLAYWRIGHT_CORE_PATH = 'path/to/playwright-core'
$env:CHROME_PATH = 'path/to/chrome.exe'
node research/game_ui_playground_v1/verify-browser.mjs
node research/game_ui_playground_v1/build-contact-sheets.mjs
```

Browser tooling is development-only. The runner uses installed Chrome/Playwright Core, not a runtime dependency. `PLAYGROUND_URL` optionally selects the loopback URL; default QA uses the standalone real entry file. Screenshots use the full page at the declared viewport, preserving edges and scroll-required content. Contact sheets scale copies for overview; unedited originals remain authoritative.
