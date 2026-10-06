# Game UI playground — first component bundle

Open [index.html](index.html) directly. The English interface puts working examples before prose. Adjust a setting to see its result in the same scene. All artwork, records and simulated transactions are original; no payment, account or runtime service is connected.

This is the **first bundle** for a broader exploration of overlooked game details. Minimap, inventory and shop are the core slices. Combat cooldown/pause and dialogue/reward add two small examples. These five panels do not complete the broader discovery/research task. Hit direction, interaction priority, death return, save/reconnect recovery and tutorial re-entry remain future modules requiring their own evidence and behavior contracts.

The two minimap presets and live configuration comparisons are **authored design proposals**, using identical scene records. They are not ordinary-versus-guided experiments, approved designs, usability findings or replicas of the referenced games.

| Slice | Actual flow |
| --- | --- |
| Minimap | Move / turn → change orientation, zoom, shape or markers → open area map → choose goal → return |
| Inventory | Camp → bag → grid/list, sort/filter → select → compare → equip → back/close → updated camp |
| Shop | Catalog / common supply → detail → quantity and balance → review → cancel or confirm → receipt → updated stock and bag count |
| Combat HUD | Strike → cooldown → pause/resume → hit/heal → win/loss → retry |
| Dialogue & quest | Ask reward → accept → collect three → return early or complete → claim once |

`Play view` removes the surrounding editor and uses the browser viewport for the game. Exit restores the same state. The View selector instead changes the preview's internal frame; it does not resize the browser. Portrait inventory uses collection → detail → Back; landscape exploration/combat puts controls directly in the game area. Long catalogs and small-height screens can scroll.

Local server, from the repository root:

```powershell
node research/game_ui_playground_v1/serve.mjs
```

Then open <http://127.0.0.1:8765/research/game_ui_playground_v1/>. Direct `file://` use is also supported. State is session-only; switching stations retains it, Reset clears just that example, reload resets all examples. JSON export contains settings and framing, not coins or player progress.

Developer handoff: [config](config.json), [fixture](fixture.json), [input/output and acceptance contract](functional-contract.json), [implementation and extension points](IMPLEMENTATION.md). Evidence: [browser report](BROWSER_REPORT.md), [machine checks](qa-report.json), [screenshots and hashes](screenshot-manifest.json), [repair history](REPAIR_LOG.md), [source provenance](sources.json).

Existing game/web implementations and evidence are unchanged. The base is latest main rechecked for integration, `bdd696ffcde02808759fc009ac2dfa26e3834b5c`. Public source/capture publication was authorized after local verification; [integration checks](PUBLIC_INTEGRATION.md) are separate from the136/55 pre-publication checks. Site deployment, external review and user design approval are not performed.
