# Game interface presets

Open `index.html` directly in a modern browser. No build, network, service, font download or install is required. The one HTML file embeds its CSS, JavaScript and synthetic fixtures. `presets.json` is a parallel handoff contract, not a runtime dependency.

Choose a genre with the desktop buttons or narrow-screen select. Session state survives switches. Reload creates a new session; the visibly named Reset utility clears only that genre. RPG Return commits no further change; card Escape clears selection; strategy Cancel drops the pending target; puzzle Undo restores a committed move; action Pause freezes movement and cooldown. These operations intentionally have different meanings.

The five layouts are separate: an equipment ledger beside an outpost, a paper hand on a duel table, a crate puzzle board, a map with command inspector, and a movement arena with HUD. Native controls use distinct hover, focus, pressed and selected treatments. Disablement is backed by state, reasons and recovery controls. Reset is the only destructive operation and affects synthetic session data only.

Each preset specifies exact fixtures, entry/primary/back flow, blocked/recovery states, hierarchy, world reasoning, semantic tokens, example dimensions, AI instructions and verification gates. Numbers are design proposals at 1165×747 and 390×844 CSS pixels, not universal game standards or compliance claims. `render-geometry.json` records measured bounds separately. Cooldown is a local gameplay choice of 3000ms, not a universal timing recommendation.

For integration, copy the package into a new research asset directory. Keep the synthetic boundary visible. Reuse a genre's behavior with its fixture and role tokens; do not replace all five screens with a common dashboard. Do not import CP01's case-specific green prohibition or white-surface palettes into these contexts. The gallery has no Site project, publication action, payments, account, live game connection or telemetry.

`first-pass/` retains the first completed implementation before objective repairs. `REPAIR_LOG.md`, `qa-report.json`, `BROWSER_REPORT.md` and screenshot hashes distinguish implementation changes, browser checks and unrun tests. The bounded test runner uses Node and an already installed Playwright browser driver, configured through `PLAYWRIGHT_CORE_PATH`; that driver is only a development dependency. The gallery itself has none.

Browser shortcuts are scoped to focus inside the prototype. Native Tab does not wrap. Action Space from arena focus triggers Pulse; Space on a native button activates that button. The gallery does not implement controller navigation. Semantic labels are provided, but screen-reader behavior requires a separate test.

Known scope: puzzle has one naturally solvable room; card has one deterministic opponent; strategy records commands without simulating arrival; action uses static sentries and cell movement. These are reusable interface/flow slices, not complete or balanced games. Browser emulation does not establish native-phone behavior, controller support, human usability or commercial visual readiness.
