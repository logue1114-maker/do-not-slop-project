# World controls: do not drop intent during polling

This is a bounded production correction, not an ordinary/guided-model experiment
or a measured usability result. The owner authorized research Git publication
of the project-owned Before/After captures and applied guidance record.

## Observed issue and implemented boundaries

The old client used one boolean for state polling, animation, user commands and
chat. A click made while polling returned without sending a command. A normal
baseline run lost three start clicks even though the state API returned 200.
Setup/lobby scrolling also carried into play. The small-board status text used
10px/8px; quick replies were an intentional horizontally scrolling list, not a
document-overflow failure.

The client now reserves one command lane, waits for an in-flight state response
and its presentation, then builds a fresh expectedVersion/actionId payload.
Duplicate activations do not enqueue. Server acknowledgement, legal actions,
costs, rules, authentication and idempotency are unchanged. Busy controls use
native disabled/aria-busy. Reset sessions cannot be resurrected by an old poll.
Failed chat retains the typed draft; successful acknowledgement clears only the
unchanged draft. New game/lobby entry starts at the top, not every state refresh.

The World art/board/palette remains its own design. Warm gold primary controls,
cream secondary controls, inset body depth, stable pressed geometry and visible
focus replace selected floating faces. Native Kkalkkeum ink, wrapped status copy
and wrapped 44px quick replies improve the bounded reading/action surface; no
new board rule, art pack or universal all-button size rule was introduced.

## Actual guidance

Do Not Slop Site deployment47/material5457b898: common instructions and universal
button construction were read to EOF earlier at the same version. World guidance
DNS-04/DNS-01/DNS-07 was read to EOF; implementation705fd142 and ownership50b4fe1d
were read in full. Applied: real intent/commit/acknowledgement ownership, reserved
layout regions and native state/focus, not copied demo data or source artwork.
External source pixels reported by the guide were not inspected or redistributed.

## Matched captures and separate public evidence

The 18 PNGs cover title, two-human lobby and initial play at1280×720,844×390 and
390×844, DPR1. Before and After use the SAME actual room/session/version via normal
reload, not injected progress or fake responses. Invitation-code regions are
masked by the capture API for privacy; no other image editing is used. Full
viewport boundaries remain. Font/layout changes intentionally affect how much
vertical content is initially visible. The source and PNG hashes are in the
manifest; the two peers use project-owned anonymous names, not student accounts.

These are matched local client projections backed by the real API. The final
HTML adds the existing same-origin collector, without changing rendered content.
Separate final-candidate and public native runs use normal create/code join/
start/roll/two messages. Public delivery SHA/current/rollback are checked, not
inferred from the captures. Four focused source-function concurrency unit tests
are supporting evidence, not substitute browser or server proof.

Earlier start failures, chat429, room-creation429 and wrapper rejection remain
recorded. The guards were not disabled. No server restart, DB reset, zone purge
or other-game update was used. Physical devices, complete modes/campaign,
authenticated records, school load, full accessibility, external visual approval,
human usability and guide effectiveness are not claimed. No new reuse license,
font binary, complete game source/art, third-party game media, private Site asset,
real room code, token or internal machine path is included.

## Narrow reusable finding

A background read must not silently consume a foreground intent. Serialize the
actual read/presentation and command, validate against fresh authoritative state,
show busy only during work and keep duplicate/stale/failure behaviour explicit.
Do not queue obsolete turns or weaken the server version/permission contract.
