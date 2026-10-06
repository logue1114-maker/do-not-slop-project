# Bounded browser verification

Final original runtime on **6 Oct 2026**: **46 grouped checks passed, 0 failed**, with **308 recorded native input actions**, **0 app/console/request errors**, and **36 unedited final PNG captures**. Separate source/package verification: **5 checks passed**. These are authored-fixture checks, not original-game testing, a participant study, a full accessibility audit or design approval.

## Evidence

- [Final browser report](checks/final/browser-report.json): exact results, state snapshots, runtime hashes, browser and limits.
- [Native interaction trace](checks/final/interaction-trace.json): mouse/key actions plus the actual Chromium touchscreen-emulation taps.
- [Capture manifest](checks/final/capture-manifest.json): paths, raw-byte SHA-256, actual image dimensions, CSS viewports, DPR and full-page/frame policy.
- [Source checks](checks/structural-results.json): embedded parameter equivalence, syntax, source boundaries and local artifact checks. They are not input/rendering proof.
- [Visual review and repairs](VISUAL_REVIEW.md): first-observation issues, protected behavior and final screen inspection.

Google Chrome **154.0.8037.98**, Windows, headless, DPR 1, browser zoom 100%, loopback HTTP, existing Playwright Core. Native mouse/keyboard events; a separate 390×844 context uses Chromium mobile/touch emulation. Read-only snapshots inspect the demo; no test writes game state or bypasses transitions.

## Coverage

| Scope | Actually checked |
| --- | --- |
| Shared jump experiment | Same input/clock in both lanes; tolerance on/off; 100/110 ms ledge boundary; −120/−130 ms buffer boundary; event-frame equality; held and early-released input; live stage Space and button Enter/Space; no input; repeat/reset; Escape/settings/tab interruption |
| Intent selection | Same scene/reticle across modes; exact miss; ranking/cycling; user selection retention; occlusion; out-of-range failure then proximity recovery; completed-object exclusion; repeated interaction; cancel/reselect; stage arrows/N/E |
| Feedback | Independent HP and exposure; distinct visible damage/awareness symbols and text; separate directions; hidden/suspicious/spotted; zero cosmetic effects; intensity changes; hit cooldown/down/restore; Hide and Escape without healing; reduced-motion suppression; actual legend text/background contrast 8.11:1 |
| Recovery | Drop/return/cancel/reopen; conditional nearby checkpoint and Home fallback; focus after death/cancel/return/reset; too-far recovery failure; movement then recovery; repeated recovery; re-death after recovery; precollection re-death with/without new wallet; old-drop loss and replacement; once-per-life pickup |
| Browser frame/input | Four tabs, native arrow/Home/End navigation, source disclosure Enter/Space; all four studies through actual touch-emulation taps; exact parameter HTTP bytes and declared source destinations |
| Layout | All four studies at 1165×747, 768×900, 390×844, 844×390 and 320×720 CSS px; no horizontal page/control overflow in these states. All jump primary buttons finish at y=744.59 in the 747 px desktop frame. Falling runners remain clipped inside their own lanes |

Portrait and landscape views intentionally scroll vertically. A 390×844 initial jump frame shows the stage and settings; playback actions are farther down the page. In a 844×390 landscape frame, the stage continues below the fold. This is not an all-controls-fit-phone claim. Full-page PNGs preserve the entire scroll surface; `-frame.png` companions preserve the actual viewport. All four studies have desktop/narrow/landscape full-page and viewport captures. Six additional desktop states cover buffer/grace, occlusion, simultaneous threats and recovery/loss.

## First observation and repair boundary

The first-browser run passed 43 grouped input/layout checks, but direct screen inspection found that a falling strict runner was drawn in the lower assisted lane. Narrow checkpoint labels also overlapped, and desktop jump actions required scrolling. The preserved [pre-browser source](checks/pre-browser/) and [first-browser results](checks/first-browser/browser-report.json)/captures remain separate. This shows why passing structural/interaction checks does not establish clean visuals.

The final revision clips each runner to its own lane, names the active tolerance on/off, shortens map labels to Home/Relay, clarifies that a downed actor must return first, keeps the interaction heading/range brief, and reduces desktop spacing. A later contrast spotcheck found the feedback legend over the light floor at 3.83:1; a solid backing raises the actual rendered pair to 8.11:1. Intermediate reports/style and eight feedback captures are retained in `checks/pre-contrast/` and `captures/pre-contrast/`.

All input timings, fixtures, consequences, priorities and game transitions remain intact. The final 46-check run repeats the matrix and adds containment/action-position, button hold/release and rendered-legend contrast checks. This is an authored implementation repair, not an experimental-arm repair or causal result.

## Unrun or unestablished

- Physical phone/touch hold/cancel, safe areas and device-specific scrolling.
- Controller, audio/haptics, screen-reader output and complete keyboard/trap/activation matrix.
- True browser 200% zoom, exhaustive text scaling/contrast and accessibility conformance.
- Original game runtime/current-version/edition guarantees, latency and performance under load.
- Human usability, preferences, learning improvement, user design approval and instruction effectiveness.
- Deployment, plugin installation and payment. Source publication is documented separately from these browser checks.

No remaining execution blocker was observed. Visual/user approval stays **pending**. Repository publication does not imply deployment or design approval.
