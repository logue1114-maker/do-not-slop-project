# Browser verification

**Latest: 25 / 25 native-browser scenarios pass, zero captured console/page/request errors.** `checks/review-candidate-2/summary.json` finished at `2026-10-07T00:51:43.422Z` in Chromium `148.0.7778.96`, Node `v24.15.0`, Windows. Runtime and harness bytes were frozen before launch in that run's `source/` and `source-hashes.json`.

58 unedited original screen captures retain file hashes, CSS viewport, PNG dimensions, profile, layout, state, DPR and zoom. Three additional labeled contact sheets include every source image whole, resized to fit. The current verdict and screenshots are in `review-candidate-2`; earlier passing versions do not override the retained later failure in `final-3`.

| Coverage | Observed result | Evidence |
|---|---|---|
| Entry → connection → readiness → hub → play → inventory → return | Completed normally for all four profiles, A and B | `results.json`, `interaction-trace.json`, profile frame captures |
| Form validation, pending duplication, failure/retry, cancellation and stale completion | Values retained; one pending attempt; cancelled completion cannot launch | First two cases; loading/failure/lobby captures |
| Inventory equipment/consumption | Equip state idempotent; water applies once and disables; item/category retained | `inventory-equip-once-use-once-close-focus` |
| Overlay input/focus | World inert; no survey click-through; Tab bounded to modal; Close restores bag opener | Modal/focus cases; paused/active indicator assertion |
| Disconnect | Fail, retry, cancel, retry success retain survey, equipment and selected item | Disconnect case + failure screen |
| Return | Cancel restores exit opener; confirm disconnects and preserves tab-session progress | Return case and actual return frames |
| Controller layout | Linear menu arrows, spatial grid/HUD arrows; selection, X equip/use, categories, Back work without Tab/pointer for those outcomes | Two controller key-mapping cases; `controller-use-focus.png` |
| Portrait | Separate detail page, Back to same item, scroll restoration, empty-state focus and rotation retain selection | Portrait cases, detail/empty/rotated screens |
| Mobile input | Browser `hasTouch` context and native tap completes primary flow, equips boots and moves actor | `browser-emulated-touch-full-flow`; physical touch unrun |
| A / B comparison and export | Same fixture/state; alternate inert; measurements present; JSON explicitly marks proposals | Comparison/export case; `export-contract.json` |
| Insets, scale and labels | Tested 24 px normal and 44 px deep scenarios; 150% authored text scale and long names; tested HUD/control zones have no overlaps | Eight profile cases and deep-inset cases |
| Reduced motion / semantics | Loading animation disabled; Enter/Space work; polite status remains CSS-accessible in Play view | Reduced-motion case; actual screen-reader speech unrun |
| Package | Eight bounded structural checks pass; preexisting repository bytes preserved except the two authorized navigation files | `checks/local-validation.json`; [publication checks](PUBLIC_INTEGRATION.md) |

Viewport coverage: desktop `1165×747` and `1440×1000`, controller `1440×900`, portrait `390×844` and `390×640`, landscape `844×390`, small-width portrait inventory `320×740`. DPR 1; browser zoom 100%. 125%/150% settings are this fixture's authored text-size control, not native browser zoom or OS scaling. The 150% + 44 px landscape HUD regression was fixed and rechecked at `844×390`; arbitrary smaller-height combinations are not certified.

Local visual inspection used actual original screens and contact sheets for menu hierarchy, split-versus-sequential inventory, inset guides, focus, HUD exclusion and the enlarged-text repair. This is implementer inspection of a synthetic fixture, not external review, taste consensus, a human usability study or native-game testing.

| Development run | Verdict | Interpretation |
|---|---:|---|
| `initial` | 4 pass / 18 fail | First test mistakenly activated Cancel; several failures cascaded. Real narrow targets, hidden-focus handling and favicon issue identified. End-snapshot limitation disclosed in `checks/initial/RECORD_SCOPE.md` |
| `repair-1` | 23 / 24 pass | Remaining annotation-read check raced the render frame |
| `final` | 24 / 24 pass | Core flow and orientation coverage passed before controller/action completion refinements |
| `final-2` | 25 / 25 pass | Added full controller outcome and fair secondary-note visibility |
| `final-3` | 24 / 25 pass | Actual regression after paused/live HUD indicator: large-text/deep-inset vitals overlapped Hub |
| `review-candidate` | 25 / 25 pass | Hub moved below expanded vitals; paused label and status semantics repaired |
| `review-candidate-2` | 25 / 25 pass | Current runtime; input-neutral layout labels and verified Minecraft pause-reference teaching card included |

The browser harness uses an already installed Playwright Core and browser executable. It drives normal buttons, keyboard events and actual viewports; its read-only snapshot cannot force success. `Inspect` shortcuts are labeled proposed-state inspection and are not used to claim completion of the primary flow.

Rerun with existing installations (no package installer is included):

```powershell
$env:PLAYWRIGHT_CORE_PATH='<absolute path to installed playwright-core>'
$env:CHROME_PATH='<absolute path to an existing Chrome/Chromium executable>'
$env:QA_RUN_ID='<new lowercase run name>'
node research/menu_placement_v1/browser-checks.mjs
node research/menu_placement_v1/build-contact-sheets.mjs
node research/menu_placement_v1/verify-local.mjs
```

Use a new run name to retain prior evidence. Source/harness files and every failed screenshot remain separate. `verify-local.mjs` checks bounded token contrast pairs; it does not certify all changing backgrounds, all focus contrast, complete accessibility or browser rendering.

Physical phones, real safe areas/software keyboards, physical controllers, screen readers, Firefox/WebKit, native 200% zoom, human participants, external visual review and user design approval are unrun. The browser runs occurred during the local-review phase: their archived `claims` flags describe that time. Public Git publication was subsequently authorized; Site edits and plugin installation remain unperformed. Publication preparation changes documentation and scoped verification only; the four source files frozen for the current browser run remain byte-identical.
