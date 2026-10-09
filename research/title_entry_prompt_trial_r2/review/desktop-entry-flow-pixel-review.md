# TIDELINE desktop entry-flow pixel review

## Scope

After the initial title-screen review, inspected only these additional rendered captures: `A-desktop-setup.jpg`, `B-desktop-setup.jpg`, `B-desktop-survey.jpg`, and `B-settings-preserved.jpg`. No code or producer guidance was read. The setup screens are a matched A/B pair. The survey and settings observations concern B only, because no corresponding A capture was provided for this pass.

The parent separately reports successful actual B interactions, including Story start/resume and setting persistence. Those reports are not treated as facts established by these screenshots. The parent also clarified that the shared brief expressly requested volume as local UI state with no unsolicited audio; absent sound is therefore not a defect. This document assesses the visible interface, not a general functional pass.

## Matched setup pair

### Coherence from title screen into setup

A carries over its small agency identity, peripheral metadata, warmer accents, translucent panels, and scene treatment. The large game title gives way to “Beyond the breakwater,” an expedition-setup kicker, and narrative setup copy. It is stylistically coherent, but the sudden replacement of the marquee game name with a narrative page title makes the page identity less systematic.

B keeps TIDELINE and the signal tagline above a straightforward “New expedition” heading. The persistent name/tagline, shared left edge, cool selected states, translucent surfaces, and typography make the transition more recognizably part of one UI system. The wide title-to-content gap of the main menu remains, so this consistency does not resolve the original spacing tradeoff.

### Decision layout and scene integration

- A places Story and Standard in side-by-side cards extending farther across the left half of the scene. Their outlines, option icons, labels, descriptions, and radio indicators make the two alternatives explicit.
- B stacks the two choices in narrower rows. This is easier to scan vertically and leaves more of the sunset and sea unobstructed. It also carries the main menu's stacked rhythm into setup.
- A's selected Standard has a warm outline, stronger bottom edge, and selected radio. B's Standard has a cool-tinted surface and checked square. Both make the selected value visible.
- B's square checkboxes are a semantic weakness if the difficulty is mutually exclusive. A's circular radio indicators convey that relationship more appropriately. A tick box usually implies an independent on/off choice, even if the implementation behaves correctly.
- A's opaque warm Start expedition button has stronger separation from both difficulty cards and Back. B's Start expedition uses the same cool translucent vocabulary as the option rows. Its size, label, and left marker distinguish it, but its hierarchy is less emphatic.
- B repeats the diagonal up-right arrow on Start expedition. The external-link-like ambiguity is therefore a system-level treatment, not an isolated main-menu icon. A's horizontal forward arrow continues to be a more natural progression cue.
- B puts Back below Start, while A puts it beside Start. B's arrangement is easier to read as primary action followed by a secondary exit, although A's filled Start button already makes its precedence clear.

### Copy and unnecessary text

A's setup contains an expedition kicker, “Beyond the breakwater,” two introductory sentences, a difficulty heading, two two-line descriptions, a small session-progress disclosure, and the inherited peripheral microcopy. Some of this adds atmosphere, but the player mostly needs to choose a difficulty and start. “The intended expedition” does not explain Standard concretely; “a little more edge” is atmospheric rather than a precise difficulty description.

B's “New expedition” heading, one introductory line, and short descriptions are quicker to absorb. “An unhurried journey along the coast” and “Discovery with a little more challenge” stay appropriately within the world but still do not explain concrete mechanical differences. The shorter text is a clarity improvement, not evidence that the difficulty design is more complete.

A explicitly says, in very small type before Start, that progress lasts for the page session. B's setup has no equivalent visible disclosure. B later presents a similar page-limited-progress line on the survey screen. If progress really is transient, A discloses the limitation at the more useful decision point, despite inadequate type size. B's main-menu phrase “No saved expedition” can imply a more durable save system than its later page-progress qualifier suggests.

## B survey screen, observed on its own

- The UI becomes appropriately lighter: a top-left Coastal survey title, objective block below it, small difficulty at upper-right, and return-to-menu control at bottom-left. The broad scene remains visible.
- The objective asks to scan the station signal. A reticle is positioned around the small distant dish, with a Scan signal control directly below. This is meaningful image-to-action integration rather than merely another left-side panel.
- The target is fairly small in the full scene. Its thin reticle sits over a busy bright horizon/building area; the dark action surface is clearer than the reticle itself.
- Scan signal again has an up-right arrow. Its repetition reinforces the visual language, but it retains the action-semantics ambiguity.
- “Find what the coast has been trying to say” is a short, relevant atmospheric line. It supports the objective without overwhelming it.
- The page-local-progress disclosure at bottom-left is tiny and low contrast. It is useful information presented with roughly the same low visibility as decorative microcopy.
- This image does not establish whether scanning changes the scene, progresses an objective, or produces a substantial gameplay state. Those belong to interaction evidence.

## B settings screen, observed on its own

- Settings uses the same persistent title/tagline, heading placement, left column, option rows, cool accents, and Back pattern as setup. The system is visually consistent.
- The screenshot visibly displays Master volume at 71% and Reduce motion checked. A single image cannot establish that either value survived navigation or reload.
- The master-volume slider has a large, bright rectangular focus outline. The outline sits very close to the small helper text below and visually crowds it. It looks more like a generic focused form control than the softer rest of this interface.
- The helper says “Interface setting only. No audio is playing.” The lack of audio is within the shared brief and is not a defect. The visible concern is that this explanatory line is tiny and crowded by the focus outline; if the disclosure is useful, it needs a cleaner presentation.
- Reduce motion has an appropriate checkbox, unlike the apparently exclusive difficulty choice. “Keep screen transitions still” explains the preference succinctly.
- The arrow-key/Enter/Esc strip remains relevant in principle but small. The available pixels do not show whether arrow keys control the slider or whether the hint accurately accounts for that interaction.

## Updated comparative judgment

B's strongest supported improvement is a simpler, more consistent, more readable interface across title and setup. The stacked setup also improves the amount of unobstructed scenery. A retains stronger progression-button hierarchy, more appropriate selection affordances, and earlier disclosure of transient progress.

The full entry flow therefore strengthens the evidence for B's UI-system coherence, while also exposing issues that a title-screen-only comparison would miss: checkbox semantics, repeated diagonal arrows, weak pre-start progress disclosure, and slider-focus/helper-text crowding. This remains a tradeoff rather than a clear comprehensive visual-quality win. Phone layouts and matched additional flow states are still pending.
