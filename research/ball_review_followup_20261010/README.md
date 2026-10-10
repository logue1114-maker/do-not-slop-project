# Ball presentation follow-up · 2026-10-10

## Source actually read

Sites MCP version49, material `a4f12ec75587e14d18b1b9d76295d3c8bde391461f8ff14ae13999c784472bdf`; deployment `73fc4b6d944cbe7587f8a38a6c4425ee57ade37d982870c2ca1af1108a3dad9e`.

- `research/ball-visual-review-20261009/AI_INSTRUCTIONS.md`, SHA `abf3a8787fb474781257b70d59f887f2b6b8f72b3d801ddcd6b6fde123e961c4`; its README and release CHANGELOG.
- Complete puzzle/entry/play/result game-guidance response, including common instructions and conditional DNS03/DNS01/DNS06 proposals. They are proposals, not global approved contracts.
- `research/game-details/original/research/game_ui_playground_v1/IMPLEMENTATION.md`, SHA `705fd142efea018ec217b766f742a9836556ddc67d5d1431e645dc632ac49efb`: preserve real ownership and runtime semantics rather than substituting demo state.
- Companion Git `8f853cf89e0045c2dceb1381000bee9c1b6a0da0`: current AGENTS, README, docs/CHANGELOG, universal-button AI_INSTRUCTIONS and GUIDE. Git and Sites versions are distinct.
- Original MCP phone result, landscape result and desktop play images were actually viewed. Their hashes: `3166aef17e19ea89a3e58dbf4e0dd9c8935455f0e2c74bf97bf59b0dadc0976f`, `ed563ab6c17aa5411cbf5dffb7e40dfc7ce41b068c9f080f03c79aaeb7d23b22`, `7ad7c6733dde2b386c7e8bea8aab9c1db1c599cbb79133a7a4407e9b52908118`. Those private source images are NOT republished here.

## Applied decisions

1. P01 outcome/return: normal-flow result with title/score first, no nested scrolling, no stopped board/Drop/status duplicate competing with Retry. Observe the real hidden-state transition for focus and scroll; do not set game state.
2. P02 composition: bound the desktop play module to the board height/width budget, retaining the short landscape side rail. Board backing remains720×880 with unchanged pointer mapping.
3. P03 roles: quieter outlined sound/report/rank utilities and secondary Save; prominent Retry and active play command. Preserve fixed press target geometry, keyboard focus, disabled command state and existing labels.

Only `gomgom-ball/index.html` cache tags and `presentation.css`/`presentation.js` changed. Engine/RNG/scoring/record/API/Worker/resources/DB and other games did not change. No new art, wording, reset or service restart.

## Comparison classification

Three actual naturally ended games, one unchanged instance per before/after pair. Normal Play catalogue entry, Start and repeated Drop reach the real loss condition. No state injection, fake score, seed, clock or forced finish. New CSS and presentation observer are added after capturing the baseline result. Same score, summary, canvas bitmap/backing, viewport, DPR1, reduced-motion and scrollY0 are asserted per pair.

This is a same-instance presentation comparison, NOT a replay of an entire old client, historical deployment screenshot or causal efficacy study. Identical `.record-list` visibility-only masking in both arms protects third-party leaderboard names while preserving box geometry. No game/result/control region is masked. Originals and first unmasked attempt stay in local evidence.

At scrollY0 the short landscape comparison is deliberately page-top and may require normal page scroll to reach Retry. Separate post-deployment native-flow evidence tests automatic result focus/scroll and reachable Retry. Do not infer every control is visible at page-top in every state.

| Viewport | Before | After |
| --- | --- | --- |
|390×700|[Before](before-result-390x700.png)|[After](after-result-390x700.png)|
|844×390|[Before](before-result-844x390.png)|[After](after-result-844x390.png)|
|1280×900|[Before](before-result-1280x900.png)|[After](after-result-1280x900.png)|

All six published frames were directly inspected. `manifest.json` records exact image hashes/bytes/dimensions and matched-state receipts.

## Actual public verification

`observations.json` contains four fresh native public journeys, 390×700/390×844/844×390/1280×900: catalogue entry → Start → pointer/keyboard Drop → natural loss → nickname field → Retry → score0/focus canvas → keyboard Drop. No static resource overrides in this public pass. Local candidate pass used only three scoped static overrides and is separate evidence.

Live advertisements were blocked and those exclusions recorded; no network-wide PASS claim. No score/report submission or authenticated storage proof. Headless desktop Chromium viewport emulation is not physical mobile, school-load testing, subjective acceptance, all-game completion or external reviewer approval. Provider version and rollback are in the manifest; release is static only.
