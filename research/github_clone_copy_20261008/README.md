# GitHub clone helper: remove stale instructions, name the payload

This is a source-backed copy proposal, not an audited live GitHub UI, an implementation result or evidence that GitHub used AI. The [official cloning documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) contains an illustration of unknown capture date with the observed helper sentence:

> Use Git or checkout with SVN using the web URL.

GitHub's [official retirement notice](https://github.blog/changelog/2024-01-07-subversion-has-been-sunset/) is dated 8 January 2024 and confirms removal of Subversion support on GitHub.com. The illustration alone cannot establish what the current live UI says. No screenshot is redistributed here.

## Proposed copy and state contract

Remove the obsolete helper and its reserved vertical space. Keep the chosen protocol and actual URL/command visible, with an action that names that payload:

| Selected payload | Proposed label | Acknowledged result |
| --- | --- | --- |
| HTTPS repository URL | Copy HTTPS URL | HTTPS URL copied |
| SSH repository URL | Copy SSH URL | SSH URL copied |
| CLI command | Copy command | Command copied |

Capture the payload and protocol when the copy is requested. Show success only after the clipboard operation acknowledges success; on failure, retain the payload and provide an honest retry. If the person switches protocol while a request is pending, a late acknowledgement must name the payload actually copied, or be suppressed with a clear current state. It must never imply that the newly selected payload was copied.

Keep launch routes, such as opening an application, and archive-download routes distinct from copying a clone value. Preserve keyboard focus and the real accessible name. A visible label is this project's preference for immediate clarity; an icon-only screenshot does not prove the original control lacked an accessible name.

[Primer tooltip guidance](https://primer.style/product/components/tooltip/guidelines/) distinguishes labels/descriptions and recommends considering persistent information instead of hidden context. [Apple menu guidance](https://developer.apple.com/design/human-interface-guidelines/menus) supports clear action labels and grouping related commands. These sources do not prove the proposed clipboard behavior has been implemented or tested.

## Evidence limits

Published material is original explanatory text and source links only. Clipboard success/failure, permission prompts, out-of-order replies, protocol switching, keyboard/screen-reader behavior and human usability are **unrun**. The proposed labels are not official GitHub wording. No measured improvement, AI-authorship inference or screenshot rights grant is claimed.
