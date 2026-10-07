# Reusable AI instructions: menu and inventory placement

Use the runnable [visual manual](index.html) and [proposal contract](placement-contract.json) together. Copy this brief and replace the bracketed inputs. A famous game's screenshot is evidence for that documented screen, not a universal template.

```text
Read this guide and placement-contract.json. Build [game/task] for [audience]
using [platform, orientation, input methods, UI scale, content volume].
Retain my actual routes, player data, states, actions and pause/network contract.
Ask only for missing facts that change behavior; label provisional choices.

1. Define the flow before coordinates:
   title -> connection/context -> lobby/readiness -> main hub -> play
   -> inventory -> collection/detail -> close -> same play/hub state.
   Omit steps that my game does not need. Do not invent authentication,
   matchmaking, saves, purchases, or remote success from a local demonstration.

2. Make one progression action dominant per screen. Keep choices that determine
   its effect beside or above it. Separate the navigation tab that opens a lobby
   from the action that starts a session. Keep destructive exits separated from
   common progression; show consequences and initially focus Cancel.

3. Compare two plausible placements using identical content and state.
   Explain the actual tradeoff (scene visibility, name width, focus travel,
   collection density), without a contrived broken baseline or a winner claim.
   Freeze the fixture and capture both at the same viewport, DPR, text scale,
   selected item and camera. Authored alternatives are not AI experiments.

4. Anchor to the available safe rectangle, not just the screen edge:
   xLeft = safeLeft + margin; xRight = W - safeRight - margin - targetWidth.
   yBottom = H - safeBottom - margin - targetHeight.
   Include real platform insets, display cutouts, browser/system bars, and
   virtual-keyboard resize/occlusion. Simulated 0/24/44 px insets are proposals.
   If keyboard avoidance is untested, report it. Do not call CSS emulation a
   physical safe-area or thumb-reach test.

5. Choose placement per input, not by shrinking desktop pixels:
   Desktop: pointer targets, Tab order, grid arrows and visible focus; primary
   action may use a left rail while preserving world context.
   Controller: legible focus, stable initial target, linear arrows for action
   lists and spatial arrows for item grids; clamp row edges; separate category
   change from item selection. Confirm/Back glyphs must match actual bindings.
   Provide a reachable item action without requiring a pointer or Tab. This
   fixture uses A/Enter to inspect and X to equip/use; shoulder keys retain
   a valid selected item. These bindings are proposals, not source-game rules.
   Test reconnect, held buttons, analog dead zones and repeat cadence on hardware.
   Portrait touch: use a real collection -> detail transition when two panes
   become too narrow. Back restores selection and scroll; Close restores opener.
   Landscape touch: reserve movement and frequent-action thumb zones; keep the
   menu opener out of those zones and below/in a separate region from minimap.
   Avoid hover-only essential actions. Offer explicit tap alternatives.

6. Inventory has its own navigation and input contract:
   Record openOrigin, selectedItemId, category, listScroll and detail state.
   Open focuses a meaningful item (or Close if empty). A selected item is
   inspectable before Equip/Use. Disabled, locked, consumed and equipped states
   need a visible reason. Keep Close and categories in a stable rail.
   Back detail -> original item/list position; Close -> exact opener.
   If the opener was removed, choose the nearest valid retained action and
   document the fallback. Rotation must retain selection and adapt detail panes.
   Block unintended world click-through, controller actions and shortcuts while
   the overlay owns input. Trap Tab only within an actual modal dialog.

7. Declare paused/live explicitly. Inventory pausing in this local demo is our
   proposal. For an online world, say 'world continues' and preserve any required
   danger cues; do not promise a pause. Keep inventory and gameplay input maps
   separate. Closing an overlay must not resume a pending destructive action.

8. Recovery is part of placement:
   Idle -> pending -> success or error. Keep the primary action in position,
   prevent duplicate pending requests, retain form values, and expose Cancel.
   Invalidate cancelled completion tokens; stale success must not change screens.
   On disconnect retain progress/selection; expose retry + an explicit exit.
   Do not silently resume the disconnected world. Retry is repeat-safe.
   Real online reconnection must reconcile authoritative inventory and must
   not replay queued use/equip; this local fixture has no authoritative server.
   Release held confirm/back/world controls before rearming a new context.
   Equip is idempotent; consumption checks its one-use guard; survey completion
   guards its final state. Match real product semantics for actions that repeat.

9. Produce live x/y/w/h measurements, target and spacing values, safe-rectangle
   guides, focus/Back annotations and the alternate screenshot. Identify units
   and rendered frame size. Attribute any real-game measurement to the exact
   asset, version/date, viewport, method and uncertainty. Otherwise call it a
   proposed dimension, never a measured source-game token.

10. Verify the actual entry flow using native browser input. Capture desktop,
    controller layout, portrait, landscape, error/retry, empty, focus, selected
    and return states. Check HUD collisions, minimum targets, horizontal clipping,
    short-height scroll, long names, enlarged text, reduced motion, cancel/retry,
    focus restoration and repeated activation. Keep failures and repair captures.
    Mark physical devices, controller, software keyboard, screen reader, browser
    engines, native zoom, external review and human participants unrun when so.
    Save source/license records, exact revision hashes, state and test records.
    Do not commit, publish, or claim owner approval without explicit authorization.
```

Proposal starting points, **not source-game or platform requirements**:

| Role | Desktop | Controller | Portrait touch | Landscape touch |
|---|---:|---:|---:|---:|
| Target minimum (CSS px) | 44 | 60 | 48 | 48 |
| Main action gap (CSS px) | 10 | 12 | 12 | 8 |
| Bag columns A / B | 3 / 4 | 3 / 3 | 3 / 2 | 3 / 4 |
| Back depth | Layer → parent | Layer → parent | Detail → list → opener | Layer → opener |

Exceptions: a dense management game may need a persistent dock; a cinematic title may favor a central stack; one-handed use may need a configurable left/right rail; a live competitive game may need essential HUD cues through inventory. Verify these with the real task. No color, rail position, orientation, or inventory density is universally best.
