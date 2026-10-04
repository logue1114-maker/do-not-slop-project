# Changes after the untouched first pass

The first completed index.html, fixtures.json and palettes.json remain untouched in first-pass/.

## Objective implementation repairs

1. Hide the closed-state Create task action while its editor is open, leaving the inline submit as the sole available filled primary
2. Hide Confirm demo order while editing delivery; Save delivery owns the immediate primary action
3. Give Edit delivery the outlined secondary treatment
4. Keep the actionStatus live region outside re-rendered sample content
5. Add the official-example disclosure link and unchanged verified source data

The palette roles and fixtures remain identical to first pass.

## Source-page integration

The integrated index differs from the repaired pre-integration source only by href="sources.json" changing to href="sources.html". It now opens the readable source notes; the same JSON remains available from that page. No specimen, palette or interaction changed in this integration.

The public package omits the redundant HTML-producing builder and its working-stage reports. The exact runnable source, unchanged first pass, reproducible verification script and public source metadata are retained.
