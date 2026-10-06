# Developer specification

## Screen contract

For a designer/developer exploring overlooked gameplay rules. Entry: one local HTML page. Outcome: manipulate a state, see feedback/consequences and repeat or recover. Focused task grammar: compact tab navigation, dominant fictional scene, nearby controls, brief status record, disclosed source notes. No card-wall explanation, external game assets, account services or persistence. Named semantic tokens are in `style.css`; system fonts only. Per-tab state lasts until reset/reload. Reload intentionally restores the fixture.

All constants in `parameters.json` are project proposals. Its embedded copy is checked by `verify-local.mjs`. Browser diagnostics are read-only snapshots; tests drive native input rather than injecting game state.

## Jump input

One shared simulation clock, event at 600 ms, run ends at 1600 ms, 0.5× playback. Both lanes share scenario, input timestamp, hold/release record and pre-input analytic trajectory. Only tolerance rules differ. These are illustrative trajectories, not a full physics engine. Events derive from recorded timestamps, so an animation-frame skip does not reorder landing and input.

| Input/state | Transition | Output/failure/recovery |
| --- | --- | --- |
| After ledge; input at/before event | Both grounded jumps | Same accepted time |
| After ledge; 0 < offset ≤ 100 ms; grace enabled | Assisted jump, strict fails | Distinct trajectory and textual result |
| After ledge; later than 100 ms | Both fail | Outside-window record; replay/reset |
| Before landing; −120 ≤ offset < 0; held at landing; buffer enabled | Assisted stores input, consumes once at landing | Strict discards early input |
| Early release, disabled buffer or expired buffer | No buffered jump | Explicit reason, fresh replay |
| At/after landing | Both jump while grounded | Same timestamp |
| Live run + press/hold | One shared actual timestamp, release recorded | No input creates no jump; repeated press cannot double jump |
| Cancel/Escape/tab change/hidden page/window blur | Stop clock, retain record | Replay starts fresh; reset restores default |

Jump buffer uses a hold requirement to match the cited description. Ledge grace applies after ledge departure; early grounded jumps do not require it. Settings cancel active playback and clear old input. Native keyboard Enter/Space or pointer down/up/cancel on Jump support hold/release. Input offsets are selected in simulation milliseconds; live runs measure time in the same slowed simulation.

## Interaction intent

Original normalized 0–100 scene; three objects share the same positions/distances in both modes. Eligible = not completed, visible, distance ≤4 m, reticle radius ≤5 (exact) or ≤32 (nearby). Nearby priority descending score = .7 × (1 − aim distance / 32) + .3 × (1 − world distance / 4), with stable ID tie-break. This entire algorithm is proposed.

Aim changes re-rank and select the top eligible candidate. Explicit Next cycles and keeps the chosen candidate until ineligible. Movement/occlusion changes revalidate; no stale target is committed. Interact checks eligibility again and marks one object completed; repeated attempts cannot duplicate the result. Cancel clears selection until aim/cycle changes. No-candidate interaction returns a failure explaining aim/range/occlusion recovery. Moving nearer/farther clamps the fixture to a bounded range. Completed objects remain in the scene with labels; reset restores them.

Pointer drag/tap aims; object buttons provide exact aim by keyboard/touch. Four arrow buttons and stage arrows support spatial input. Stage N/E cycle/commit, tabs retain scene and aim across modes.

## Independent feedback

HP starts 100. A hit removes 20, uses damage direction and lasts 1600 ms as a lightning + spike + text cue. Last-hit text persists. Hit cooldown is 800 ms. HP 0 disables hits until Restore. Exposure adds 35, clamps at 100: Hidden 0, Suspicious 1–99, Spotted 100. Eye + marker + meter + direction is separate from damage. Hide clears exposure; HP/damage remain. Clear/Escape cancels transient effects and warnings while retaining HP. Restore sets 100 HP and clears cues; effect preferences are retained.

Shake 0–100 maps to a maximum 8 px world translation; flash 0–100 maps to one 260 ms overlay pulse capped at .25 opacity, never a repeated flashing loop. HUD stays fixed while world shakes. Both default to 0. Reduced motion cancels running effects and suppresses subsequent effects, while text/shapes still work. This demo does not implement the original game's full accessibility menu, audio, haptics, controller or stealth/always mode options.

## Recovery ledger

Wallet 125; one recoverable pile or none; cumulative Lost 0. Death atomically transfers any prior pile to Lost, creates a new pile only if the wallet >0, clears wallet, disables movement and shows checkpoint choice. Last rest point is always available. Nearby checkpoint is selectable only while availability is true. Cancel hides choice but does not revive, destroy the pile or heal; reopen restores choice. Confirm validates checkpoint availability, revives at Home 14 or Relay 38, retains drop and clears the once-per-life pickup flag.

Advance/Go back moves 20 route units, bounded 7–93. Recover requires alive, existing pile and distance ≤8; then adds it to wallet and removes it atomically. Repeated recovery returns Nothing to recover. Find adds 25 once per life. Re-death before collection loses the previous pile even if new wallet is zero; after collection carried shards become a new recoverable pile. Reset restores all fixture values. Selection, return and movement never grant shards. Each transition records its actual local consequence.

## Required verification

Native button/key/touch-emulation actions, timing-window boundaries, held/released input, no input, settings/cancellation, selection guards, independent cues, zero effects/reduced motion, all recovery/loss paths, repeated activation, focus after return/cancel/reset, small/landscape/desktop reflow and source disclosure. Record browser version, viewport/DPR, source hashes, actual results and raw captures. Source/structural checks are separate from rendered/input checks. Physical touch, controllers, assistive technology, full browser zoom, original games and user-study effectiveness remain explicitly unrun unless separately tested.
