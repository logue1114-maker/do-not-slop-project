# Maintainer quickstart

## Start and verify

From the repository root:

```sh
python -m http.server 8765 --bind 127.0.0.1
# Open /research/human_maintainability_v1/before/ and /after/ in your browser.
node research/human_maintainability_v1/tests/run.mjs
node research/human_maintainability_v1/tests/browser.mjs
```

The first test command needs only Node's built-in modules. Browser tests reuse an existing `playwright-core` installation and Chrome/Chromium; supply `PLAYWRIGHT_CORE_PATH` (module name or absolute module directory) and `CHROME_PATH` if necessary. No new runtime dependency is required. Without those existing tools, report browser checks unrun; do not treat source tests as their substitute. Optional `QA_CAPTURE_DIR` saves local same-state captures outside the public source tree. The harness starts and closes its own loopback HTTP server and isolated browser context. Unit and browser receipts go to `checks/`.

For a targeted browser regression, set `QA_CASE` to an exact check name from the report and `QA_REPORT_NAME` to a simple lowercase/hyphen filename stem. Clear `QA_CASE` for the full suite. Run `node research/human_maintainability_v1/tests/publication.mjs` for scoped Git-preservation, link/JSON and bounded public-safe checks. It requires the Git checkout; the old global release receipt has a separate historical scope.

This package's `.gitattributes` disables checkout line-ending conversion so retained specimens and source hashes stay byte-exact on Windows too. It does not change Git settings or older packages. The repository file inventory describes committed Git blobs; a checkout with different line endings outside this package can have different local byte hashes.

The historical `validation/build_inventory.py` hashes working-tree bytes, so its output alone cannot certify committed bytes after checkout conversion. For a release inventory, stage the intended files, obtain the tree with `git write-tree`, read each `tree:path` through `git cat-file --batch`, and hash/count those raw blob bytes; exclude `FILES.sha256.json` itself and verify every record against that same tree before committing. Do not regenerate committed-byte metadata from a converted archive or checkout.

## Module and dependency map

Static imports point downward in this map. Runtime callbacks carry actions upward without giving input code ownership of the reducer.

```text
index.html -> tokens.css + style.css
           -> app.mjs (browser entry)
                -> platform.mjs -> state.mjs.deepFreeze
                -> application.mjs (one instance / one shared state)
                     -> state.mjs (rules + projections)
                     -> focus.mjs (existing recovery policy)
                     -> view.mjs -> state.mjs projections + assets.mjs
                     -> controllers.mjs (listeners -> dispatch callback)

event -> controller -> dispatch -> transition -> render -> focus/announcement
```

`state.mjs`, `focus.mjs`, `assets.mjs` have no imports or browser capability access. The view imports domain projections but cannot mutate rules or bind input. Controllers receive the fixture and dispatcher; they cannot import the view, reducer or loader. `tests/dependencies.mjs` checks these explicit directions and unsupported import forms. It is a bounded source guard for this small plain ESM package, not a general JavaScript parser or sandbox.

## To change X, edit Y

| Request | Owning file(s) in `after/` | Why / focused checks |
|---|---|---|
| Change the selection accent/theme | `tokens.css` | Named visual roles; isolated theme patch verifies color changes while orders/DOM/geometry stay equal |
| Change button dimensions or HUD layout | `style.css` | Inspect actual selectors and variant/media overrides; browser computed bounds and narrow flows protect targeting and visibility |
| Change ship vector silhouette/world artwork | `assets.mjs` | Authored geometry; preserve fixture IDs and world coordinate contract; check both scenes |
| Change displayed markup or state formatting | `view.mjs` | Template and rendering owner; preserve semantic controls, focus nodes and shared facts; DOM/keyboard parity |
| Change whether Attack/Move is legal | `state.mjs` | Reducer validation; new rule requires a behavior-change test, not a claim of refactoring parity |
| Change key mapping or pointer translation | `controllers.mjs` | Event-to-action translation; native key/pointer, modifiers/repeat and scoped-input checks |
| Change command lifetime/state ownership | `application.mjs` | Shared instance dispatcher and teardown; repeated actions and dispose/remount checks |
| Change focus recovery after Confirm/Cancel | `focus.mjs`, possibly `application.mjs` call site | Recovery policy vs DOM application; test disabled focused controls and originating frame |
| Change fixture facts/configuration | `fixture.json` | Trusted authored units/world/presets; changing facts changes behavior and needs explicit approval of that contract |
| Change external fixture loading | `platform.mjs`, `app.mjs` only if startup policy changes | HTTP/JSON/network boundary; loading failures occur before mount |
| Add saving or change a save format | No current owner exists | This demo has no persistence; propose schema/version/migration and storage boundary as new scope, do not add an empty layer now |

## Contracts and data shapes

The full fixture is [fixture.json](after/fixture.json). Coordinates are world units in a 960 × 680 authored map, independent of CSS size. Units carry `{id, name, role, team, x, y, hull, movement, firing, shape}`; team is `friendly` or `hostile`. Waypoints carry `{id, name, x, y}`. Initial selection contains friendly IDs. This is a trusted bundled fixture, not a validated untrusted schema. The existing art/proportions also assume these dimensions; changing world scale requires reviewing both art and pointer conversion.

| Contract | Shape / behavior |
|---|---|
| `transition(state, action, fixture)` | Synchronous pure reducer. Returns state; unknown actions/commands are no-ops. Inputs are read, not mutated. `TARGET` requires a target shape; malformed payloads outside this contract are not silently repaired |
| Selection/input actions | `{type:'ACTIVATE_UNIT' or 'SELECT', id, additive?}`, `{type:'HOVER', id:null or ID}`, `{type:'FOCUS', key:null or string}` |
| Command actions | `{type:'CHOOSE_COMMAND', command:'move' or 'attack'}`, `{type:'TARGET', target:{kind:'point',x,y} or {kind:'unit' or 'waypoint',id}}`; `COMMIT`, `STOP`, `CANCEL`, `CLEAR`, `RESET`; `{type:'PRESET',name}` |
| Shared state | `{fixtureId, selectedIds, hoverId, focusKey, command, target, preview, committedOrders, error, notice, nextOrder}`. Invalid targets set `error`, mark target invalid and clear preview; prior committed orders survive |
| Preview/order | Preview `{kind,unitIds,target,x,y}`. Commit adds monotonically increasing `id` and clears the preview. Stop order `{kind:'stop',unitIds,target:null,id}` has no coordinates. Repeated Stop deliberately creates distinct records; repeated Confirm after success cannot send again |
| Projections | `viewModel` returns selection/target/order facts and `canConfirm`/`canCancel`; `latestOrdersByUnit` returns a Map where the latest order wins, including Stop suppressing a prior drawn line |
| Public browser hook | `window.fleetDemo.getState()`, `.getFixture()`, `.getViewModels()` return structured clones, preserving the existing names/shapes and preventing external mutation of live state |
| `loadFixture(fetchFixture)` | Calls `fetchFixture('./fixture.json')` once, rejects unsuccessful HTTP with the original message, propagates network/JSON errors, recursively freezes success. No retry, service or fallback |
| `createView(document, fixture)` | Creates both authored scenes; returns `{comparison,scenes,render,dispose}`. Render may update DOM text/classes/styles, not domain state. It retains focused interactive nodes |
| `bindControls({...})` | Registers scene/global demo listeners, dispatches action objects, returns idempotent unbind. It keeps callback identity for `removeEventListener` |
| `mountFleet(document, fixture)` | Returns `{api,dispose}`; owns one in-memory state and both scenes. Dispose unbinds before removal and can be called again safely. Remount after dispose starts a fresh instance; simultaneous mounts into the same document are unsupported |

## Errors, lifecycle and boundaries

`app.mjs` awaits the fixture, mounts once, then installs the original public hook. Loading failure leaves the scenes and hook absent, as before; this case does not add a user-facing loading/error screen. Missing required DOM or malformed fixture/schema can throw; recovery would be a separate behavior change. Domain errors remain inline and in the existing live status, without transmitting anything. Browser native Enter/Space behavior remains native; M/A/S/Escape are scoped to a focused scene and ignore repeat/modifiers.

The refactored entry exports `dispose()` for hosts/tests that remove the page. It removes owned listeners/scenes and removes its own hook only if still installed. A fresh mount clears the owned live-status announcement so it cannot describe an order from the disposed instance. Normal browser navigation releases the page; no new unload hook, interval or persistence is introduced. A host must dispose before remounting. Rendering/focus recovery may trigger focus events; the retained policy is applied after rendering and stays in the originating frame with `preventScroll`.

State exists only in memory. Orders are local records/drawn lines, not simulated movement, damage, network messages or saved files. Domain decisions, presentation configuration and platform loading have distinct owners. [Acceptance checklist](ACCEPTANCE_CHECKLIST.md) makes those boundaries reviewable.
