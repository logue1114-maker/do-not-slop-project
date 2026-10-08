# Button construction and correction guide

Version 1 · 2026-10-08 UTC · Do Not Slop Project

Build the right control for its role, then make its actual rendered anatomy and behavior agree with that role. This guide covers website actions, application commands, selections, navigation, menu rows and game controls. It is a decision and verification system, not a universal visual skin.

A deliberate flat, text-only button can be the correct finished component. A tactile game action can also be correct. Neither a bevel, icon, pill, shadow nor a minimum number of decorative layers is compulsory. When a brief explicitly names structural changes, a color/background/font-only revision does not satisfy those changes.

## Scope and evidence

The local specimens are original authored fixtures and local, network-disabled simulations. Their before controls are ordinary-quality authored baselines with the same content and handlers as their corresponding after controls. They are not actual ordinary-request model outputs or a controlled instruction-effect experiment. The golf fixture is isolated from production and illustrates a bounded proposal informed by an observed entry-control audit. It does not reproduce production handlers, prove production parity or establish compatibility with the unavailable course rendering.

This guide extends the construction detail in [game controls corrections v2](../game_controls_corrections_v2.md). That earlier research distinguishes creator explanations, observed public stills and authored proposals. It does not establish current shipping behavior from asset sheets. The golf audit's important lesson is an enforcement gate: a requested component change must survive the CSS cascade and appear in the actual component crop. Existing focus feedback must be preserved when it already works.

Use [AI instructions](AI_INSTRUCTIONS.md) for a bounded implementation prompt, [role contracts](role-contracts.json) for machine-readable review inputs and [maintainer quickstart](MAINTAINER_QUICKSTART.md) for the code/evidence route. Source-image interpretation belongs in the [source and rights guide](SOURCES_AND_RIGHTS.md) and [reference link index](reference-guidance/README.md); outside image pixels are not reusable assets by default. The [browser report](BROWSER_REPORT.md) records what was actually exercised in this package. This document does not mark those checks passed.

## 1 Inventory the component before choosing its appearance

Record the task, person, current state, next action, consequence, input modes and surrounding visual language. Inspect the rendered target at a stated viewport, DPR, zoom and text setting. Reading the CSS alone is insufficient.

For every target, capture:

- Exact visible label, accessible name, action destination and data or conditions needed to choose it
- Semantic element, handler boundary, activation timing, disabled/pending logic and focus destination after activation
- Outer target bounds, visible silhouette bounds, face bounds and actual label/icon bounds
- Computed font family, size, weight and line height, plus the font that actually loads
- Family, role, placement and relative emphasis beside neighboring controls and noninteractive information
- Existing state behavior, including a working focus indicator; missing evidence is not evidence of missing behavior

Nested faces and SVGs can break an implementation that assumes `event.target` is the root button or replaces the button's entire `textContent`. Inspect the real handler contract before adding children. Use the root boundary deliberately, commonly `event.currentTarget` or an explicitly resolved ancestor. Update a dedicated label span instead of destroying internal structure. Keep real IDs, form submission semantics and shortcuts unless their change is authorized.

Write the change brief before the implementation. Name the axes that must change and those that must stay fixed. A request to improve hierarchy may need only placement and rank changes. A request to give a particular game button a separate face/body needs those actual anatomy changes. Do not require every axis to change merely to create a dramatic comparison.

## 2 Classify meaning before visual rank

First ask what activation does:

1. **Executes a command:** use an action button; then assign primary, secondary or tertiary rank within its task group
2. **Navigates to a URL or route:** use a link and a navigation treatment; primary-looking navigation is still navigation
3. **Changes an on/off setting:** use a checkbox, switch or toggle-button contract appropriate to the setting
4. **Chooses one value from a set:** use a radio/selection contract; a segmented appearance does not make it a group of independent commands
5. **Reveals one of several local content panels:** use a tabs contract when the interaction is genuinely tabs
6. **Opens or acts within a menu:** distinguish the menu trigger from its rows; implement a true menu's input model if using menu roles
7. **Only displays information:** do not give it button semantics or command-like relief

Then assign rank, hazard and context separately. `Primary` describes importance within a current task group. `Destructive` describes consequence. `Icon action` describes presentation. `Game HUD` describes context. A destructive secondary command or a quiet icon toggle is perfectly possible.

### Role decisions

| Role | Use when | Construction decision | Meaning to preserve |
| --- | --- | --- | --- |
| Primary action | The supported next commitment in this task group | Strongest appropriate surface, placement or scale; clear verb | It executes an action, not a selected state or success claim |
| Secondary action | A meaningful alternative, back, cancel or supporting command | Quieter member of the same family; enough boundary to remain discoverable | Cancel is not inherently destructive |
| Tertiary action | Low-frequency help, inspect or lightweight utility | Flat/text treatment can suffice; preserve target area and focus | Low emphasis does not mean low contrast or hidden-on-hover |
| Icon action | Space is constrained and the glyph is recognizable in context | Consistent icon grammar and optical weight; named target | Accessible name and any needed visible explanation survive |
| Destructive action | Data or another consequential state will be removed | Hazard treatment plus precise consequence; rank chosen separately | Do not add or remove a confirmation/recovery step as decoration |
| Toggle | Activation reversibly changes one on/off value | Persistent on/off marker; stable toggle identity | Hover and momentary press do not imply on |
| Segmented selection | One of a small set of values is chosen | Shared group shell or aligned options; exactly one checked value when required | Choice, group label and exclusivity remain explicit |
| Tab | One local panel replaces another | Active marker connected to the panel; independent focus marker | Moving focus need not commit a manually activated tab |
| Navigation | Activation changes location | Link grammar and persistent current-location marker where relevant | Current destination differs from hover/focus |
| Menu trigger or row | Related commands/options are opened or presented compactly | Quiet rows with aligned label, optional glyph and trailing state/shortcut | A chevron means submenu/navigation only when that is true |
| Game HUD action | A command must coexist with live gameplay | Match the game's art and input language; distinguish command from meter/status | Cost, cooldown, binding and availability mean what the game actually supports |

Usually one action should dominate a single local decision. Several independent cards or workflows can each have a primary action; do not impose one primary on the whole application. Repeated strong actions need consistent containment and a clear reason. Do not promote Refresh, Close or every menu row to the same weight as the main commitment.

For web semantics, native buttons support action activation; toggle buttons expose a persistent pressed value and retain their toggle label. Tabs and radio groups have different selection and keyboard contracts. Follow the relevant [W3C button](https://www.w3.org/WAI/ARIA/apg/patterns/button/), [tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) and [radio group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) patterns when implementing those widgets. A visual resemblance alone is not permission to assign a role.

## 3 Choose a coherent family for the context

Choose a small grammar that explains how surfaces, edges, type and states work together. A family is a set of relationships, not the requirement to render every role identically.

| Family | Suitable starting context | Anatomy | Required restraint |
| --- | --- | --- | --- |
| Flat | Dense tools, low-priority utilities, tabs, navigation, menu rows | Plain label/glyph area; optional quiet backing or state rail | Give it adequate target geometry, legible text and an independent focus indicator |
| Outline | Secondary commands, compact forms, neutral tool actions | Stable perimeter and plain face; no implied body required | Boundary must survive the real background; do not add a shadow simply to fill a layer |
| Filled | Clear web actions, prominent app commitments | Opaque plain face with strong label contrast; simple silhouette | Preserve rank; fill alone does not explain pending, selected or destructive meaning |
| Soft raised | Calm application command surfaces | Subtle rim/highlight/contact shadow, little or no visible extrusion | Avoid a floating-card shadow on every utility and data row |
| Tactile | Playful/physical controls, game actions, material-led interfaces | Fixed shell, distinct face and shallow body; consistent light direction | Apply strong relief to roles that need it; text region stays quiet and hitbox stays fixed |
| Game native | A particular game's art, equipment or genre language | A role-specific grammar such as paper/ink, industrial caps, painted sign or terminal rails | This is a context adaptation, not a universal sci-fi polygon or copied branded asset |

One website can coherently use filled primary, outline secondary and flat tertiary controls. One application can use a soft-raised main command, flat rows/tabs and radio-backed segments. One game can use a tactile main action and low-relief HUD/menu commands. Reuse the family grammar, then modulate it by role. Do not make a segmented option look like a separate purchase CTA or a read-only resource count look like an executable button.

Match material to real product context. Industrial bevels can fit a dense factory tool; comic ink outlines can fit illustrated paper; a calm cinematic selector can keep the scene dominant. Preserve an established glass/CRT device rather than replacing it with holographic neon merely because the setting is science fiction. Strong gradients, bright color, ornate frames and rounded corners are not defects by themselves. Their appropriateness depends on task, art, readability and consistency.

## 4 Construct the anatomy from the inside out

### 4.1 Keep four bounds distinct

1. **Target:** the actual pointer/touch and focusable boundary
2. **Silhouette:** the visible outer artwork, including any side/body projection
3. **Face:** the readable top surface, after border/rim/body allowances
4. **Ink:** actual glyph and label extents, including ascenders, descenders and optical overhang

An SVG box is not its visible glyph bounds. A CSS height is not usable face height. A decorative shadow is not a hit target. Keep target and sibling layout stationary during press; move or inset the inner face if the selected family uses depression. Do not clip the actual target into a difficult polygon merely because the art has clipped corners.

### 4.2 Derive length and height from content and role

For a label-only control, start with label width plus two side insets. For a label/glyph/direction control, budget the actual leading glyph, gaps, label and trailing slot separately. Reserve only slots that exist. A text-only secondary does not need invisible icon columns unless alignment across its group is deliberate.

Illustrative budget: 24 px leading slot + 12 px gap + measured label width + 12 px gap + 20 px trailing slot + 18 px inset on each side. These are authored trial values for a spacious game action, not measurements of an outside screenshot or minima for all controls.

Height must include line height, upper/lower breathing room, rim allowance and any body projection. If a tactile control is 60 px tall and allocates 4 px to its lower body, the label must fit inside the remaining face; adding a 60 px face and a body outside it is a different geometry. Record which interpretation is implemented.

Use minimum height with content-driven growth where labels can wrap. Try the longest supported translation, a short label, numerals and the real loading label. Do not solve failure by shrinking every label, compressing letter spacing or hiding the consequential noun. For a compact toolbar that cannot wrap, define a real fallback such as overflow into a labeled menu. Do not silently truncate a destructive consequence.

Full width can establish the next step in a narrow form or a dominant game entry action. It is not a remedy for an otherwise empty page. Equal widths are useful for comparable choices; unrelated utilities need not share them. Text-only controls still have intentional padding and a measurable target.

Visible artwork can be smaller than the target, particularly for compact icon controls. Test adjacent target overlap and actual hit behavior. For web pointer input, [WCAG 2.2 target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) describes a 24 × 24 CSS px minimum with specified exceptions; it is not a universal ideal size. The larger trial values in this guide are design starting points, not a substitute for applying the criterion correctly or testing physical use.

### 4.3 Choose silhouette and corner behavior

Pick a silhouette that fits placement and material: small-corner rectangle, capsule, aligned square utility, restrained chamfer, paper outline or another justified grammar. Define whether a radius is fixed, proportional or capped. A short icon control and a wide text control can share corner logic without sharing the same numerical radius.

If the family uses clipped ends, directional caps or ornament, define the safe label inset and scalable center. Avoid stretching corner artwork, swallowing the label with arrow tips or drawing a new random polygon for each button. Directional shapes must not accidentally imply navigation where activation commits an action. In right-to-left layouts, mirror directional content according to meaning, not by blindly flipping every icon.

### 4.4 Separate surface, rim, body and shadow only when needed

- **Surface:** provides label contrast and material identity; keep reflections/texture out of the main ink area
- **Rim:** establishes the face boundary; distinguish a structural keyline from the focus ring
- **Body:** explains physical thickness; keep light direction and thickness consistent within the family
- **Shadow:** explains contact/elevation; a shadow cannot repair a weak label or confused hierarchy

Flat and outline controls can intentionally have no body. Filled controls can use one plain face. Soft-raised controls need only a quiet edge/elevation relationship. A tactile control may need a separate fixed shell and movable face. Build the smallest anatomy that carries the intended role and requested change.

If relief is used, press should make physical sense: the face approaches the body, the lower projection diminishes and the contact shadow tightens. A highlight from one direction and a body shadow from the opposite direction looks accidental. Do not scale the entire hitbox or shift surrounding rows to simulate press. Reduced motion can remove interpolation while preserving the static depressed edge or inset cue.

On busy imagery, measure contrast against the actual backgrounds reached by the control. A translucent surface or blur is not proof of readable contrast. Use an opaque/local backing when needed. For ordinary-sized active web labels, check the applicable 4.5:1 text-contrast threshold; large text and inactive controls have specific exceptions. The guide still asks for readable unavailable labels and reasons as a design decision. See [W3C text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). If borders, icons or state marks are necessary to identify a control or state, check their contrast too; [W3C non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) explains the relevant distinction. A decorative highlight need not become the only identifying edge.

### 4.5 Make typography an explicit part of the component

Specify font family, size, weight, line height, label alignment and wrapping policy together. Inspect actual glyph rendering after the font loads. A computed `600` does not prove that an unprovided semibold font looks good. Test fallbacks rather than assuming every locale supports the display font.

The golf audit observed `font: inherit` replacing an earlier weight with inherited typography. A `font` shorthand sets its constituent properties together; ordinary shorthand values default omitted components, while `inherit` inherits the whole set. Inspect the final computed style and loaded face, then scope the intended label properties explicitly. See [MDN's font shorthand reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font). Do not respond by adding unrelated type overrides to every button in the application.

Optical vertical alignment matters. Centering a line box can leave a label looking high or low when caps, Korean glyphs, descenders and an icon have different visual centers. Prefer one stable layout and small family-level optical corrections after rendering. Do not add a different arbitrary transform to each word. Cost values and timers can use tabular numerals where comparison benefits, but ordinary labels need not.

Avoid forcing condensed italic Latin typography onto unsupported Korean text. Inspect mixed-script names, punctuation, numerals and the longest real Korean label. Tight tracking, tiny uppercase metadata and decorative display fonts should not obscure the action or conditions.

### 4.6 Match icon weight optically

An icon's canvas size and stroke width do not determine its perceived weight alone. A dense gear, open arrow and narrow plus can look very different at the same 20 px box. Check the visible silhouette, internal counters, stroke, end caps, corner language and apparent mass beside the actual label.

Trial procedure: render the family at its smallest supported size, compare a simple arrow, close glyph and denser utility glyph in context, then adjust internal drawing bounds or stroke within one grammar. A 20 px line-icon family might start near a 1.75–2 px stroke, while a thick paper/ink family might need a different construction. These are authored trials, not universal optical-weight rules. Do not repair a thin web icon in a thick game frame by making only that icon enormous.

Icons are optional. Add one if it improves recognition, grouping, spatial direction or product identity at the real size. Remove a decorative glyph if it does not earn its slot. A trailing chevron, external-link mark, submenu arrow, check and cooldown ring have different meanings. Never scatter all of them around a control as a generic quality signal.

An icon-only action needs a meaningful accessible name. Show a visible label or contextual explanation when the glyph is unfamiliar or consequential. A tooltip can supplement a known utility but cannot carry essential instructions for touch users. Decorative SVGs should not add redundant names to a labeled button.

### 4.7 Finish the internal grid and surrounding hierarchy

Align a leading glyph, flexible label, optional cost/status block and trailing direction/indicator with explicit slots. Choose left alignment for a long structured command when it aids scanning; centered label-only controls remain valid. Keep the same optical label baseline across comparable controls even when their outer heights differ by role.

Put cost, condition, preview result and consequence where the person decides. Do not make the button impressive by exporting its required information into tiny low-contrast text. Keep status counts quieter than commands; put Back/Cancel where the current workflow supports them. Screen position, density and grouping often establish more useful hierarchy than increasing every surface's saturation.

## 5 Give states distinct meanings

Define only states supported by the role and fixture. An action does not need `selected`; a navigation link does not become `pending` because it is styled like a button. A simulator may expose authored pending/unavailable states, but label those as simulation, not observed production behavior.

| State | What it means | Rendered contract | Behavior contract |
| --- | --- | --- | --- |
| Rest | Available, with no transient input | Base role/family anatomy and readable label | Supported action can occur |
| Hover | Pointer is over an eligible control | Bounded face/edge/backing change; no label or layout loss | Does not execute, select or expose essential instructions only on hover |
| Focus | Keyboard/controller input is directed here | Persistent independent ring/marker, including over selected/pressed surfaces | Focus follows the actual input graph and remains visible |
| Pressed | Activation is being physically held | Momentary depression/inset/contrast cue fitting the family | It is not completed action or persistent selection |
| Selected/on/current | A choice or location persists | Static check, rail, active panel connection or text, distinct from focus | Correct checked/pressed/selected/current semantics match the model |
| Pending | An operation has started and is not finished | Accurate progress label/indicator with stable geometry | Duplicate commitment is suppressed; settle, cancel or recover according to actual workflow |
| Disabled/unavailable | The action cannot run for a real reason | Label remains readable; reason is near the action or linked description | No activation; do not misrepresent unavailable as merely busy |
| Completed/error | A real result occurred | Persistent useful status where required, separate from selected glow | Report the actual result and recovery; focus destination follows workflow |

### State composition and precedence

Gate input from the actual model first: unavailable and pending guards must block inappropriate duplicate commands before any visual state class. Preserve persistent selection as its own channel. Layer hover/press feedback without replacing that marker. Draw keyboard focus above the family feedback so it remains independently identifiable. Restore the base/selected appearance on release, cancellation, pointer exit and focus change as appropriate.

Examples: a focused selected segment needs both a checked mark and focus ring. A focused available destructive action needs a hazard cue and a focus ring. A pending command can retain focus if the chosen implementation intentionally keeps it focusable. A native disabled button cannot be treated as a keyboard-focus specimen because it normally leaves the Tab sequence.

For native web controls, choose `disabled` deliberately; it suppresses interaction and normal keyboard focus. `aria-disabled` expresses unavailability but does not itself stop events, so a focusable unavailable design also requires a real activation guard. Put an essential unavailable reason outside a control that users cannot focus. See [MDN's disabled attribute reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled). Do not apply `cursor: progress` to every unavailable condition.

### Input and motion details

- Preserve native action-button keyboard activation. Do not add independent `keydown` and `click` handlers that make Enter/Space commit twice
- Keep pointer-down feedback distinct from actual click/commit. Releasing away or cancelling input must not commit accidentally
- For a real hold action, preserve its threshold, early-release cancellation and progress meaning; do not add hold-to-confirm to every game action
- Do not move focus on a cosmetic hover. After a panel/dialog closes, return focus to the appropriate opener or next workflow location
- For a stable `aria-pressed` toggle, preserve its label across values; a changing action label is a different command model
- Radio-backed segments expose one value choice; tabs expose panels. Preserve their supported arrow-key/activation policy rather than using one handler for both
- Use `aria-current` for current navigation when appropriate; do not use `aria-selected` on ordinary route links
- A navigation list is not automatically an ARIA menu. Menu roles bring a different keyboard/focus contract
- Honor reduced motion by removing animated transitions or travel while retaining a static state difference and visible focus
- Forced-colors/high-contrast presentation needs a visible non-shadow focus/state channel; record the actual mode tested

## 6 Use concrete recipes as trials

These recipes are authored starting values in CSS px, not source-image measurements, production runtime values or universal requirements. After implementation, record the actual units and rendered values. An engine canvas, device pixels, source artwork pixels and CSS pixels are not interchangeable.

### Web form with one clear next step

**Intent:** Submit a local draft; preserve a supporting Cancel and quiet Help. **Family:** filled primary, outline secondary, flat tertiary. Try a 44 px minimum action height, 16 px label at 600 with 22 px line height, 16 px side inset, 8 px corners and a 10 px group gap. A text-only primary is sufficient. Keep the primary one plain surface; no lower body or icon is required.

Hover can slightly define the primary boundary or face contrast; press can add an inset/tone cue without movement. Keep focus independent. Allow the label to grow the target if text enlargement or translation needs more room. Pending is included only if a real or explicitly local-simulated submission occurs. Secondary Cancel stays available if the modeled workflow supports cancellation.

### Application command with dense surrounding controls

**Intent:** Apply a workspace change while preserving review and navigation. **Family:** soft-raised command, flat menu rows/tabs and native radio-backed segments. Try a 42 px command height, 15–16 px/600 label, 20–22 px line height, 14 px side inset, 6 px corner, 1 px rim and a quiet 1–2 px contact shadow. Start tabs and rows with no extrusion.

The main command may be gently raised; a tab is identified by its active rail/panel relationship; a selected segment uses its checked value. Try 20 px utility icons, then correct optical mass at actual size. Menu rows can start near 40 px high with 12 px side inset and consistent shortcut/check columns. Dense desktop values do not establish safe physical touch targets; enlarge or provide a supported compact/touch alternative based on actual testing.

### Game action and low-relief HUD

**Intent:** Execute a main local game action while retaining quiet HUD/menu utilities. **Family:** a material-led tactile main action plus lower-relief controls. Try a fixed 56–64 px shell, 3–4 px lower body allowance, 18–20 px/600–700 label, 24 px line height, 16–20 px side inset and 10–12 px internal gaps. Use an original glyph only if it earns its place. Try 2–3 px inner-face depression; record stationary outer bounds.

Pick material from the actual game's art. A painted sign uses restrained edge/light/shadow relations; paper/ink uses consistent outline and short hard contact relief; an industrial terminal may use shared caps and dark backing. They are separate contextual recipes, not a kit to mix into every button. HUD health/resource meters remain information. A binding glyph supports the real input, not a fake button promising unsupported controller operation.

### Icon utility beside labeled commands

**Intent:** A recognizable compact action such as opening an existing settings panel. Try a 40–44 px target with a 20–24 px glyph, then adjust the visible art independently. Align it optically with label ink, not blindly with the label's line box. Keep name and focus visible to the relevant input. Do not give a small utility the same tactile extrusion as the main game action unless the surrounding art genuinely needs it.

### Destructive operation

**Intent:** Clearly remove a specified local item. Reuse the appropriate family and apply hazard meaning separately. Try an outline or restrained filled hazard treatment according to the existing workflow's rank. Use the consequential verb/object, keep recovery or confirmation behavior intact and make pending duplicate guards real. No icon, hold duration, red Cancel or modal is mandatory merely because the word “destructive” appears.

### Golf proposal is a bounded exception

The isolated golf example intentionally calls for non-color changes: a fixed smaller-corner sign shell, separate face/lower edge, original optional golf-sign glyph, revised inner layout and quieter cream Join. Candidate values from the audit are 6 px shell corner, 64 px primary total minimum height, 4 px lower edge, 24 px leading glyph, 20 px arrow, 12 px gaps, 18 px side inset and a 20 px/600 label with 24 px line height. Join starts at 52 px minimum height and is allowed to remain text-only.

Those values are authored proposals for that component. They do not require every game primary to use a flag, arrow, 64 px height or extrusion. The exact `방 만들기` room-creation meaning must not become “start a round.” The local specimen is not a room server, handler audit or course integration test.

## 7 Require a before to intent to rendered ledger

For each target revision, record one row per relevant anatomy/state axis. State the before observation, intended change or deliberate preservation, and actual rendered result. A row is complete only when its result points to the exact revision, component/state and evidence. A CSS declaration is implementation evidence; it is not the actual rendered result.

Minimum axes:

- Target and silhouette: length, height, radius/caps, fixed outer bounds
- Surface/rim/body: or an explicit intentional flat/no-body decision
- Typography: loaded family, size/weight/line height, baseline and wrapping
- Glyph system: optionality, visible bounds, weight, semantic/decorative status
- Internal layout: slots, insets, gaps, text room and alignment
- Role hierarchy: primary/secondary/tertiary and relation to data/navigation
- Supported state feedback and corresponding behavior

Example of a structural requirement, with rendered cells deliberately unresolved until verified:

| Axis | Before | Intent | Actually rendered and evidence |
| --- | --- | --- | --- |
| Surface/body | One plain face in the inspected target | Add a separate sign face and lower body for this requested game revision | `not_run`; needs same-size rest crop and face/body measurements |
| Internal layout | Centered text node | Add label slot and optional original glyph without changing the label meaning | `not_run`; needs actual label/glyph bounds and longest-label crop |
| Secondary rank | Secondary competes with main action | Keep secondary readable and deliberately quieter | `not_run`; needs paired contextual crop |
| Focus | Existing visible keyboard outline | Preserve independent focus on the fixed shell | `not_run`; needs actual keyboard focus, not a forced CSS class |
| Hover | Actual hover does not change the face/edge | Make the scoped face/edge feedback perceptible | `not_run`; needs pointer-triggered hover plus runtime properties |

Example of a valid flat decision: “Preserve one plain filled face and text-only label; change action grouping and the supporting outline control; no body/icon requested or needed.” A rendered flat result can pass that brief. The same result fails a different brief that expressly requires a separate face/body and inner-grid change.

Preserve fixture/data, real labels, behavior, capture milestone, viewport, DPR, zoom, locale and art/camera/background when evaluating the stated change. Record any authorized copy, layout or behavior change separately. Do not redesign the surrounding page and count that as changing an untouched button. Do not downgrade the before control to make the after look better.

## 8 Verify the actual component and its task

### Visual inspection

At minimum, inspect full-screen context plus native component crops at the documented desktop and narrow views. Add any supported high-density, text-enlargement, long-label or busy-scene case that changes the design decision. Show comparable captures at the same state and scale. Crops must include relevant boundaries/focus and enough context to assess rank.

Confirm label contrast and real font, unclipped ink, safe rim/body space, optical icon weight, visible state channels, target/face separation and stable sibling alignment. Compare computed runtime values with authored declarations, including selector specificity, source order, shorthands and unavailable-state guards. A forced state class is useful for a sheet, but not proof of real input behavior.

### Interaction inspection

Execute each supported action with relevant pointer and keyboard paths. Include repeated activation, release-away, input cancellation, Back/Cancel/Close, pending settle/recovery and reset. Check that persistent selection does not masquerade as focus and no decorative child bypasses the action handler. Native radio/tabs need their own keyboard checks. Controller focus graphs and physical touch require their own actual devices/input evidence; a desktop viewport resize does not prove them.

Keep this package's network-disabled local fixture separate from production. Simulated Save, Delete or game actions may mutate local fixture state only. Do not create production rooms, send real requests, spend resources or call external services to acquire screenshots.

### Evidence statuses

Use `passed`, `failed`, `blocked`, `not_run` or `not_applicable`, and name why. Separate source review, automated structural checks, browser input/rendering, physical-device testing, assistive-technology testing, human review and production integration. An implementation can pass local input checks while production parity remains unverified. An authored guide or screenshot cannot establish measured task-speed improvement, causal superiority or user approval.

### Acceptance gate

Accept a revision only when protected meaning/behavior is preserved, named change axes are visible in matching rendered evidence, supported states work, and limitations are recorded. If the brief requested structural work and only color, page background or font changed, mark those structural rows failed or incomplete. Fix the component and repeat the affected rendered/input checks. Do not repair the report by relabeling a missing implementation as a stylistic choice.

## 9 Maintain the contract without making every control generic

Share role/state behavior and core token meanings; scope visual grammar to a family/context. Keep the isolated golf proposal separate from shared website/application styles. A global selector that makes every `button` a tactile game object defeats the decision system.

When changing a token or shared component, inspect representative primary, secondary, flat utility, icon, destructive, selected option, tab/navigation and menu/HUD controls affected by it. Recheck long labels, relevant narrow views, focus and press bounds. When changing a state handler, test every role that imports it. Expand testing according to the actual dependency, not a decorative checklist.

Promote a correction into a reusable rule only after naming the concrete failure and useful exception. Preserve prior evidence and record the new revision. The reusable rule from the golf finding is “verify named anatomy changes in the rendered target and actual state,” not “all flat buttons need a bevel.”
