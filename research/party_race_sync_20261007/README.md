# Party Race: separating simulation, network updates and displayed motion

2026-10-07. An implementation case from GomGom Party Race, not a controlled performance experiment. The complaint was clarified as movement that feels like dropped frames. This record explains a missing presentation layer, the local correction, and what remains unresolved.

## What the source comparison found

The game already predicts local input, reconciles server acknowledgements, replays unacknowledged input and coalesces expensive presentation updates. Those features were not rebuilt. Its physics uses a fixed 30 Hz step.

Before this correction, the local avatar displayed the latest predicted position directly. Remote avatars eased toward a single latest target. Neither path retained the two time-adjacent poses needed for display interpolation. This can cause stepped or uneven motion, but the finding does **not** establish the cause of every reported frame drop.

The three [developer references](sources.json) distinguish fixed-step simulation from rendering, and prediction/reconciliation from remote snapshot interpolation. Buffering buys smoother motion at the cost of presentation latency; it does not increase GPU frame rate.

## Local implementation

The authored [display-only module](motion-presentation.js) has two independent helpers:

| Path | Operation | Boundary |
| --- | --- | --- |
| Local avatar | Save previous/current predicted poses; interpolate with accumulator / fixed-step duration | Never feed the displayed pose into collision, input replay or scoring |
| Small authoritative correction | Translate both local endpoints while preserving their separation | Contact changes or larger corrections reset the presentation pose instead |
| Remote avatars | Retain timestamped raw snapshots; interpolate around a delayed, monotonic display clock | Store raw positions before latest-state presentation coalescing discards intermediate updates |
| Missing packets | Hold the newest available authoritative sample | No unbounded extrapolation through walls or hazards |
| Round, map, seed, phase or player discontinuity | Clear affected histories | Old-room and old-round coordinates must not drag a new avatar backward |

Current case-specific proposals are a 50–150 ms adaptive remote delay, up to 32 samples per player, a 12-world-unit discontinuity threshold and a display-clock rate bounded to 0.8–1.2. Delay follows measured packet cadence and arrival jitter. These are **not** universal constants or recommendations for every game. Tune them against the game's speed, send cadence and measured conditions.

The integration also settles endpoints when prediction stops, snaps on reconnect/elimination/qualification, interpolates facing along the shortest angular arc and prevents a grounded local display from dipping below its current predicted floor. The server remains authoritative for physics, contacts, actions, qualification and ranking. No server, room capacity, database or writer policy changed.

### Reuse contract

1. Call local `reset` on spawn/correction boundaries, `push` after actual physics steps, and `sample` only when drawing. Call `settle` when prediction stops stepping.
2. Give remote `receive` the decoded raw states and a monotonic arrival time in milliseconds. Its state shape is `elapsed`, `phase`, `round`, `map.id`, `seed`, and `players` with unique IDs, coordinates and lifecycle flags. Server `elapsed` is in seconds within that phase. The helper assumes ordered messages on one connection; clear it on disconnect before accepting a new stream.
3. Call remote `frame` once per render, then `sample` per visible remote avatar. Keep gameplay decisions on authoritative/predicted simulation state, not sampled output.
4. Use actual game flows to check jump, landing and discontinuities. Passing the portable tests does not validate a different game's integration or network conditions.

## Verification and observed limits

Run the included **10 helper tests** using Node:

```sh
node --test research/party_race_sync_20261007/motion-presentation.test.mjs
```

They cover local pose interpolation and immutability, endpoint translation and settling, history reset, timestamp interpolation, irregular arrivals, packet loss, phase/round/map boundaries, lifecycle/teleport snapping, facing and bounded history. The game's combined local helper/input-delivery/ACK-history/presentation regression run passed **24 tests**; the other 14 game tests are not bundled here.

An early helper run failed one display-clock assertion. Inspection found a clock error that compared the target against the old cursor rather than its next expected position. The correction uses `target - (cursor + dt)`; the test expects position 0.75 after 25 ms between two 100 ms-separated samples, rather than the earlier erroneous 0.6 expectation. The repaired helper passed 10/10, and the combined game run passed 24/24. This is repair history, not a claim that the first pass succeeded.

In an isolated local server, two participants entered through the normal nickname/create/join/start flow. Native key input produced movement and a jump, followed by authoritative landing. Remote interpolation counters advanced from 211 to 300 over a 90-render-frame observation. The histories stayed bounded at 32 samples for each of two players. [Sanitized aggregates](observations.json) preserve scope and values without account or room identifiers.

**Frame performance is still unresolved.** With two game browser tabs open, the reported rolling median frame interval remained about 67 ms and p95 about 94 ms. This is not a matched before/after comparison: the local preview also included a separate indexed-geometry candidate, and no equal-resolution baseline was collected. Neither interpolation nor that geometry candidate has a proven FPS gain. No school-device, school-WAN, 22-player, long-session, complete-course, grab/knockback or moving-platform improvement is established by this run.

At a 390 × 844 emulated viewport, the document width and visible control rectangles fit, and the native jump-button click was accepted. However, the capture surface returned a 390 × 219 image inconsistent with the emulated viewport. Complete mobile visual acceptance is **unverified**. Desktop capture was also shorter than the configured viewport. Limited logs showed no application error in the retained sample and two existing Three.js deprecation warnings; this is not an exhaustive console/network claim.

This publication contains the module, portable tests, cited sources and summarized observations. The full game, private runtime logs and local captures are not redistributed. Source publication was requested; **the game correction has not been deployed to production**. The next useful check is a same-resolution frame-cost comparison and ordinary school play, not another repeat of already completed ACK or load tests.

## Provenance and rights

[File provenance](provenance.json) identifies these authored source files. Third-party references are links with bounded paraphrases, not copied articles or media. No new reuse license is chosen. See [rights and scope](../../docs/RIGHTS_AND_SCOPE.md) and [repository verification](../../docs/VERIFICATION.md).
