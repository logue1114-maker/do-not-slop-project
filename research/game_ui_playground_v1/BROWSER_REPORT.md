# Bounded browser and visual report

Recorded local run: 2026-10-06T14:54:37.152Z, Headless installed Chrome 154.0.8037.98. These136 browser and55 source checks were completed before public integration. Real standalone entry [index.html](index.html) was opened in installed Chrome; no state-setter, fake DOM or alternate capture screen was used. No public runtime was deployed. Fresh public-source checks are reported separately in [PUBLIC_INTEGRATION.md](PUBLIC_INTEGRATION.md).

## Results

- Browser/input/geometry: **136 passed, 0 failed**. [Machine report](qa-report.json), [actual input → snapshot records](input-output-log.json), [control geometry](render-geometry.json).
- Source/contracts: **55 passed, 0 failed**. [Source report](source-checks.json). This checks JSON/runtime parity, input domains, syntax, local links, key token contrast and preservation; it is distinct from browser QA.
- 19 full-page runtime captures, with original PNG dimensions, byte counts and SHA-256 in [screenshot manifest](screenshot-manifest.json). [Desktop contact sheet](contact-sheet-desktop.png) and [mobile contact sheet](contact-sheet-mobile.png) only scale/layer labeled originals; [sheet manifest](contact-sheets-manifest.json) maps their source hashes.
- Local visual inspection separately examined desktop minimap/inventory, portrait minimap/detail, landscape confirmations/pause and Play view. It found and corrected caption/control overlap. Native-browser geometry then included that caption and passed the same states. No external screenshot reviewer was run.

## Coverage and boundaries

Actual browser viewports:1440×1000,1165×747,844×390,390×844 and320×568 CSS pixels. Internal390px portrait and bounded844px landscape frames were checked separately. The editor view permits vertical scrolling. Portrait inventory uses a sequential collection/detail flow. Play view removes the editor; landscape movement/combat primary controls fit the844×390 viewport, and portrait Equip/Back/Close remain reachable. Internal frame choices are not device emulation.

Minimap checks include north/heading rotation, zoom, square/circle, offscreen hide/show, enemy visibility, marker scale, map-specific objectives, full-frame disabling and stationary terrain, movement, area-map goal selection and Escape/focus return. Inventory checks include sort/filter/grid/list, signed gear comparison, rank blocking, supply/material detail, equip idempotence and retained loadout. Shop checks include insufficient balance, quantity limits, review-without-debit, Cancel/Escape, duplicate confirm, receipt, owned count, common-supply route and natural stock depletion.

Supporting checks cover actual hit/heal/cooldown, pause/inactive freeze, natural win/loss/retry, dialogue reward inspection, early quest return, sample cap and one-time claim. Native Enter/Space, scoped movement, visible focus, reduced motion, JSON download and emulated touch select/equip were checked. Native dialog Tab stops did not focus background controls; one Chrome browser-boundary stop reports BODY. This is a bounded keyboard observation, not an exhaustive trap or screen-reader audit.

Two duplicate-event probes dispatch twice on the actual rendered Confirm/Claim button; other flows use native clicks, keys and settings input. The public snapshot function only clones state. Export contains settings, not economy/progress. Reload resets fixtures. No console/page errors or failed requests occurred in the final covered run.

## Screens

| Capture | Browser viewport | Full-page pixels |
| --- | --- | --- |
| [01-minimap-desktop](screenshots/01-minimap-desktop.png) | 1440×1000 | 1440×1177 |
| [02-inventory-compare-desktop](screenshots/02-inventory-compare-desktop.png) | 1440×1000 | 1440×1215 |
| [03-shop-confirm-desktop](screenshots/03-shop-confirm-desktop.png) | 1440×1000 | 1440×1146 |
| [shop-purchase-complete-desktop](screenshots/shop-purchase-complete-desktop.png) | 1440×1000 | 1440×1146 |
| [04-hud-low-health-desktop](screenshots/04-hud-low-health-desktop.png) | 1440×1000 | 1440×1146 |
| [05-dialogue-reward-desktop](screenshots/05-dialogue-reward-desktop.png) | 1440×1000 | 1440×1146 |
| [minimap-844x390](screenshots/minimap-844x390.png) | 844×390 | 844×1178 |
| [shop-844x390](screenshots/shop-844x390.png) | 844×390 | 844×1223 |
| [hud-844x390](screenshots/hud-844x390.png) | 844×390 | 844×1065 |
| [minimap-390x844](screenshots/minimap-390x844.png) | 390×844 | 390×1718 |
| [inventory-390x844](screenshots/inventory-390x844.png) | 390×844 | 390×1689 |
| [shop-390x844](screenshots/shop-390x844.png) | 390×844 | 390×1608 |
| [dialogue-390x844](screenshots/dialogue-390x844.png) | 390×844 | 390×1543 |
| [inventory-320x568](screenshots/inventory-320x568.png) | 320×568 | 320×1731 |
| [play-view-minimap-844x390](screenshots/play-view-minimap-844x390.png) | 844×390 | 844×392 |
| [play-view-hud-844x390](screenshots/play-view-hud-844x390.png) | 844×390 | 844×392 |
| [play-view-shop-844x390](screenshots/play-view-shop-844x390.png) | 844×390 | 844×392 |
| [play-view-inventory-390x844](screenshots/play-view-inventory-390x844.png) | 390×844 | 390×846 |
| [06-internal-portrait](screenshots/06-internal-portrait.png) | 1440×1000 | 1440×1342 |

## Not run

- native phone hardware/safe-area
- controller
- screen reader
- human usability study
- external screenshot reviewer
- true browser200% zoom
- network/save reconnect
- actual model A/B experiment
- user design approval
- commit/push/Site deployment

The broader overlooked-game-detail goal remains open. These are the first three core components plus two small supporting slices; richer damage direction/response, interaction priority, pickup presentation, checkpoint return, save/reconnect and tutorial re-entry are not implemented. No ordinary/guided A/B trial, participant study, measured usability improvement, commercial-readiness claim or design approval was produced. Official sources are game-specific/historical observations; [source notes](sources.json) preserve the Halo detail-fetch limitation. Earlier tool/harness failures and repaired versions are retained in [repair log](REPAIR_LOG.md), first-pass/ and check-history/.

Public source/capture publication was authorized after this local run. Public report copies redact machine paths; original local records remain outside the public tree. Existing game/web implementation and evidence bytes are unchanged. Navigation, provenance, release validation and file inventories are updated separately for Git integration. Site deployment, external review and user design approval are not performed.
