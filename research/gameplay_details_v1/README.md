# Gameplay details v1

Four short, original interactive studies of details that game-interface summaries often miss: forgiving input, interaction intent, different threat signals and recovery after failure. One large stage, four tabs, short controls and a three-entry state record. English UI, original CSS/SVG graphics, no external assets or runtime dependencies.

This is an **authored educational demo**, not ordinary-AI versus instructed-AI outputs, a controlled experiment, a reconstruction of the games, measured usability evidence or a universal best-practice claim. User design approval is pending. Published source claims and our proposals are separate in each source disclosure and [sources.json](sources.json).

## Open locally

Open `index.html` directly in a modern browser; it needs no requests. For a loopback HTTP session:

```powershell
node research/gameplay_details_v1/serve.mjs
```

Visit `http://127.0.0.1:4175`. The optional server serves only this directory; the brand link opens the package README. No Site deployment, plugin installation or payment is needed.

## Try the details

1. **Jump timing:** replay `+60 ms` after the ledge: strict lane fails, 100 ms grace accepts it. Choose Before landing with `−60 ms`: held input buffers in the assisted lane. Turn assistance off, release before landing or move input beyond the window. Live run accepts one actual press/hold timestamp for both lanes. Space works while the stage or Jump button is focused.
2. **Target selection:** keep the same scene and reticle when switching Exact aim / Nearby candidates. Aim with a pointer/touch, object button or arrow controls; `N` cycles candidates, `E` interacts while the stage is focused. Check occlusion and range guards, completion exclusion and explicit cancel/reselect.
3. **Threat feedback:** `Take hit` and `Expose` change different states. Damage direction and observer direction are separate. Use shape + text at zero shake/flash. Exposure progresses to Spotted; Hide clears it without healing. Five hits down the actor; Restore health recovers the workshop. Escape clears cues while retaining HP. Reduced motion suppresses both effects.
4. **Death & return:** die carrying 125, select Home or available Relay, confirm, advance to the drop and recover. Cancel a return and reopen it. Alternatively die again before recovering: old drop moves to Lost. Find 25 once per life to see a new drop replace the lost old one. D/E/arrows work on the focused stage. Reset restores the fixture.

Native buttons, labeled inputs, arrow-key tabs, visible focus and polite status announcements are included. Touch has a tap/button alternative for every essential action. The game shortcuts operate on the focused stage; Escape cancels the active demo operation. Tab changes cancel live timing and transient effects while retaining demo state.

## Package

- [index.html](index.html), [app.js](app.js), [style.css](style.css): local runnable original.
- [parameters.json](parameters.json): proposed constants, identical to the embedded runtime parameter object.
- [DEVELOPER_SPEC.md](DEVELOPER_SPEC.md): inputs, transitions, outputs and invariants.
- [sources.json](sources.json): directly checked official documentation and boundaries.
- [BROWSER_REPORT.md](BROWSER_REPORT.md), `checks/`, `captures/`: actual bounded verification, failures/repairs and unrun gates.
- `verify-local.mjs`, `browser-checks.mjs`: portable structural and native-browser harnesses. Browser harness needs an existing Playwright Core and Chrome; no installer is bundled.

Created from main `bdd696ffcde02808759fc009ac2dfa26e3834b5c` on 6 Oct 2026. Public integration against main `22bb7bb972c95bd4e42a71266bbf1942b360e44e` adds navigation, rights/provenance records and file hashes while retaining the existing game playground and all earlier runtime/evidence files.

The repository instructions and draft visible-design review evidence boundaries were used. Its fixed-target action recipe does not cover these timing/selection/recovery experiments; no unsupported domain recipe was imposed.
