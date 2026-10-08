# Browser evidence and limits

Implementation verification before publication passed 25 menu fixture scenarios and 14 separate native title checks. Enter/Settings/About, modal ownership and return focus, actual pointer down/drag-off/release, desktop/portrait/landscape insets 0/24/44, long labels, the authored 200% text model and browser-emulated touch were exercised. [Implementation regression](evidence/implementation-regression.json) records the original run; fresh public-copy results are recorded separately.

The relocated public source passed [25 fixture scenarios](evidence/publication-regression.json) and [15 native title/scope groups](evidence/publication-title.json), with no app errors in those runs. Its published desktop/portrait after PNGs are byte-identical to fresh public-copy captures. The extra native group verifies centered-title and play-world screenshot/state equality; it does not score aesthetics. All tests used Windows Chromium 149.0.7827.55 at DPR 1.

Reproduce with `npm install --no-save playwright-core`, supply `CHROME_PATH` if required, then run `node research/north_marsh_title_arrival_v3/browser-checks.mjs` and `node research/north_marsh_title_arrival_v3/browser-title-checks.mjs`. Run `node research/north_marsh_title_arrival_v3/verify-package.mjs` for source/provenance checks. Generated raw test directories are ignored; curated public captures and evidence remain explicit.

Centered-title and play-world screenshots and state were equal before/after in the bounded local scope check. This is a scope-preservation observation, not a usability or aesthetics score.

The 200% model passed bounded action/fit checks **but has an unresolved visual defect**: identity overlaps busy scene detail. Native OS text scaling and true browser zoom remain unrun. Physical phone/touch/safe-area/controller, real software keyboard, screen-reader speech, Firefox/WebKit, human usability, source-game transitions and finished AAA craft remain unestablished.

Source links are research, not implementation verification. Two AAA game screens were inspected; Forza and the restricted board were blocked. No external screenshot is included.
