# Repair ledger

The first completed implementation is retained byte-for-byte in `first-pass/` before browser checks or objective repairs. Its files and SHA-256 hashes are recorded in `first-pass-manifest.json`.

The first browser run had 74 passes and one failed committed-line check. Its report, measured geometry and images are preserved in `first-pass/`. Later render inspection also found viewport fit problems that the first harness's bottom-only visibility check had missed.

| Observed issue | Objective repair | Preserved behavior | Post-repair evidence |
| --- | --- | --- | --- |
| Selecting Rover B changed the old Surveyor A order's line origin | Resolve committed line origin from the committed order's unit; pending origin remains selected unit | Units, order target/count and cancel semantics | `Strategy last-order line stays with committed unit` passes |
| Large desktop boards scrolled the top HUD outside the captured viewport | Compact desktop card height and puzzle board; rectangular strategy map cells; action controls beside a smaller arena | Fixtures, board dimensions in cells, inputs and gameplay rules | Ten canonical screenshots from scroll zero; final geometry has all main controls and Reset inside view |
| Disabled action could leave focus without a usable control | Fall back to the prototype's focusable entry if no enabled recovery button exists | Native Enter/Space; no global shortcut binding | Visible-focus and action repeat/pause checks pass |
| Narrow actor marker inherited rectangular cell proportions | Preserve circular player/square sentry with aspect ratio | Positions, collision cells and pulse radius | Action narrow screenshot |
| “Space · Pulse” failed to explain native Space on focused buttons | Make arena focusable; label “Space in arena · Pulse”; preserve Space on native controls | Scoped keyboard handler and button behavior | Native Enter/Space spot checks and action arena input |
| Compact desktop strategy cells changed the map aspect while SVG preserved its original aspect | Stretch the vector coordinate mapping with `preserveAspectRatio="none"` | Unit/target coordinates and preview/commit rules | Actual endpoint-to-hitbox error below 2 CSS px at desktop and narrow widths |

Harness repair: measure top as well as bottom visibility, include Reset and capture from scroll zero. First images remain untouched. Additional narrow state captures were recorded through real input, not forced state. Final browser run: 77 passes, 0 failures. No aesthetic preference repair or measured usability improvement is claimed.

User clarification added a separate `functional-fixtures.json` and references from final presets. This is a handoff separation of function/data from design guidance, not a fabricated baseline or change to the game fixtures. The first completed files remain byte-identical.
