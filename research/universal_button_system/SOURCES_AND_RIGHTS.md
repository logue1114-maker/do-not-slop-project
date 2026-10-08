# Button system sources and rights

Compiled 2026-10-08 UTC. This package provides contextual craft references for an original control system. The reusable part is the decision process and interaction contract; there is no universal button silhouette, palette, typeface or measurement.

[Machine-readable ledger](sources.json) · [Reference link index](reference-guidance/README.md)

## Evidence and claims

The six visual families below consolidate retained public-safe observations dated 2026-10-08. The consolidation did not reinspect game screenshots, private boards or image crops. Each publisher link identifies the original context, not a new live observation. Static images establish visible pixels and pictured states; they do not establish hover, press movement, hitboxes, animation, haptics or successful navigation.

Keep these claim types separate:

- **Observation:** what the retained research actually saw, with source, platform and unknown-build limits
- **Interpretation:** a contextual reading, such as tactile or calm; no measured emotional response is implied
- **Proposal:** an original transfer to a specific product and task, requiring its own validation
- **Requirement or reference:** WCAG is a standard; APG is informative authoring guidance; MDN documents implementation
- **Executed check:** a recorded procedure and actual result for a stated revision and environment
- **Unrun or blocked check:** a gap, never a pass; a source summary or successful build is not an interaction test

## Contextual visual families

### Zelda adventure instruments

The retained Nintendo Switch references show broad dark menu rows with quiet end ornament and a warm selected rim, near-square material cells with a turquoise ring, and blue/cyan map instruments. Pale solid glyphs and a clear label center matter as much as the edge treatment. These are separate screen families with separate accent roles.

For an original adventure menu, author a restrained edge vocabulary and leave the label field clear. Keep menus, item pickers and map instruments distinct. The [Nintendo guide](https://www.nintendo.com/jp/zelda/totk/guide/en/index.html) and [July 5 2023 tips](https://www.nintendo.com/en-gb/News/2023/July/More-tips-for-your-The-Legend-of-Zelda-Tears-of-the-Kingdom-adventures--2411783.html) do not establish current build behavior or the Switch 2 Edition. Source-raster bounds are not engine or CSS dimensions.

### Animal Crossing soft crafting and navigation

Cream rounded panels, broad filled icons, a striped turquoise craft capsule, pale rims and dotted quantity guides form a coordinated soft family. The NookPhone app grid has another job: navigating app families. The supplemental shipping frame uses different emphasis colors; turquoise is not a universal selected state.

For original friendly crafting, draw new surfaces and glyphs, align quantities and distinguish execution from app navigation. See the [Nintendo product page](https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/Animal-Crossing-New-Horizons-1438623.html?pp=1) and [July 21 2021 NookPhone article](https://www.nintendo.com/au/news-and-articles/start-deserted-island-life-right-with-these-animal-crossing-new-horizons-tips/). Legacy DIY capture date/build is unknown. An illustrated cursor does not establish hover, and no selected app tile was clearly evidenced.

### GTA dense settings

The retained 2015 PC settings frame uses square shallow rows, dark translucent planes, pale selection with dark text, and a narrow mint tab mark. Alignment carries the hierarchy: labels left, values right, hairline separators and common slider ends.

For an original dense settings task, use a sharp grid and local luminance contrast with text and targets suitable for the actual device. The [Rockstar PC controls article](https://www.rockstargames.com/newswire/article/51974aa3a724o2/rockstar-game-tips-tailoring-your-settings-and-controls-in) is dated May 1 2015. It does not establish the 2026 Enhanced interface, HUD, phone or weapon wheel. Tiny raster text is not a recommended product size.

### Hearthstone phone tabletop

The historical phone frame places a convex yellow turn plaque in a nested gray socket. Sculpted card perimeters, arched/oval illustration windows, parchment and separate cost/attack/health badges make a physical tabletop grammar. Large outlined numerals and locally distinct color roles support the combat task.

For an original card fixture, draw new layered frames and badges, reserve heavier depth for turn commitment and retain explicit submission after selection/inspection. The [Blizzard smartphone launch reference](https://hearthstone.blizzard.com/en-us/news/18648148) is dated April 14 2015. A clipped fan proves overlap, not usable overlapping targets or drag behavior. No collection, deck editor, expanded-card or current-client validation is claimed.

### Genshin scene-preserving phone HUD

The retained iPhone artwork has unequal lower-right action silhouettes around a dominant sword, smoky translucent circular/faceted grounds and broad white glyphs. Peripheral map/navigation groups leave the center mostly open. Scene color and UI semantic color are separate layers.

For original combat controls, author a coherent glyph family with one dominant action and test contrast across actual scenes. Equipment comparison needs its own reading layout. The [developer App Store listing](https://apps.apple.com/us/app/genshin-impact/id1517783697) does not date the artwork or identify its matching app build. No movement joystick, cooldown behavior or mobile inventory screen was established; artwork envelopes are not physical thumb dimensions, CSS targets or 44pt/48dp specifications.

### Duolingo learning review

The retained answer controls have rounded faces, thin borders and a short flat lower rim. Pale-blue selection differs from explicit green success and red error. Submitted answers remain visible while feedback grows above a stable next-action zone. Tablet artwork uses wider margins; extra width is not evidence for more tiles or landscape behavior.

For original learning controls, separate selection from judgment and keep the next useful action stable. In pen-first work, retain a flat writing canvas and preserve ink when feedback appears. Optional characters belong away from the response area. Sources: [iPhone/iPad store artwork](https://apps.apple.com/us/app/duolingo-language-lessons/id570060128), [core tabs](https://blog.duolingo.com/core-tabs-redesign/), [answer feedback](https://blog.duolingo.com/explain-my-answer-now-free/), [historical shape rationale](https://blog.duolingo.com/shape-language-duolingos-art-style/) and [historical character rationale](https://blog.duolingo.com/building-character/).

Store image date/build is unknown. Previously recorded core-tabs and feedback publication dates could not be reverified from the retained extraction, so the ledger does not promote them to verified dates. No account or real exercise was used; keyboard, screen-reader, haptic, recognition and palm-rejection behavior remain unverified. Historical animation intent and promotional captions are not current runtime specifications.

## Behavior sources and bounded application

Primary W3C and MDN text was checked on 2026-10-08. These sources supply semantics and behavior; they do not prescribe the visual families above.

- **Action:** use a native button, an accessible name and an explicit non-submit type where appropriate. Buttons activate with Enter and Space. See [APG Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) and [MDN button](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button)
- **Navigation:** use an anchor with a real destination; Enter activates it. A visual button shape does not turn navigation into an action. See [APG Link](https://www.w3.org/WAI/ARIA/apg/patterns/link/) and [MDN anchor](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a)
- **Toggle:** a stable-name toggle exposes aria-pressed. Selection, button-down appearance and committed success have different meanings. See [APG Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- **Tabs:** use tablist/tab/tabpanel relationships and aria-selected, with one tab stop and orientation-appropriate arrow navigation. Manual activation uses Enter/Space; automatic activation is appropriate only when panels appear without noticeable latency. See [APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- **Keyboard and focus:** [WCAG 2.1.1](https://www.w3.org/TR/WCAG22/#keyboard) is Level A with a path-dependent-function exception; [2.1.2](https://www.w3.org/TR/WCAG22/#no-keyboard-trap) addresses escape. [2.4.7](https://www.w3.org/TR/WCAG22/#focus-visible) requires visible keyboard focus; [2.4.11](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum) prevents complete author-created obscuring at AA. [MDN focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible) documents styling through browser heuristics
- **Target:** [WCAG 2.5.8](https://www.w3.org/TR/WCAG22/#target-size-minimum) is 24 by 24 CSS pixels at AA, with spacing, equivalent-control, inline, user-agent and essential exceptions. [2.5.5](https://www.w3.org/TR/WCAG22/#target-size-enhanced) is 44 by 44 at AAA with its own exceptions. Record target bounds separately from decorative art; neither value is a universal art size
- **Motion:** [WCAG 2.3.3](https://www.w3.org/TR/WCAG22/#animation-from-interactions) is AAA and allows disabling interaction-triggered motion unless essential. [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) documents preference detection. The authored system should retain state feedback while reducing nonessential motion

The verified [latest WCAG text](https://www.w3.org/TR/WCAG22/) identifies the [December 12 2024 Recommendation](https://www.w3.org/TR/2024/REC-WCAG22-20241212/). Direct retrieval of that dated URL returned HTTP 503, so the requirements above were checked against the latest-version text. This selected-criterion index is not a complete WCAG audit or a conformance claim. Source-document verification and implementation testing require separate records.

## Rights and assets

This package includes original text, public source links and authored demonstration guidance. The system's original code and drawn shapes/glyphs/art are authored examples, not extracted game UI. Source image URLs in the ledger are reference links only; they are not embedded images, bundled bytes or permission to download and redistribute them.

No private screenshots, boards, crops, publisher characters, logos, extracted glyphs or third-party font files are included. Use new generic art and suitable fonts with independently verified terms. Trademarks identify research context and do not imply endorsement. Public availability does not establish reuse permission; attribution alone does not clear image or font rights.

No general reuse license has been selected in this repository snapshot. This package does not choose or change one. Original authorship is a provenance statement, not a license grant. Linked source terms apply to those sources and do not license this repository. A future asset import needs its own rights record, including owner, exact file, license/permission, attribution and allowed use.

## Gomgom audit limits

The supplied [Gomgom Golf public lobby audit](https://play.gomgomapps.com/gomgom-golf/) is a separate read-only live inspection dated 2026-10-08 UTC. Its [style.css](https://play.gomgomapps.com/gomgom-golf/style.css) and [entry stylesheet](https://play.gomgomapps.com/gomgom-golf/entry.css?v=20261008-entry1) support the observed entry-control record: Create has a flat 426 by 56 CSS-pixel box, 10-pixel radius and 20-pixel/400-weight text, without internal face/rim structure. Hover matched but no visible/computed change was recorded; the audit attributed that to a later ID rule overriding the lower selector. A 3-pixel ochre focus outline with 3-pixel offset was recorded as working. These values describe that lobby revision, not a universal recommendation.

The authored fixture reproduces observed entry DOM/CSS using a system-font fallback. It is not a complete source snapshot or a handler-parity verification. WebGL was disabled, so the audit does not support a verdict on the course experience. A denied .mjs request was not fetched through an alternate route. No create, join or production deployment was performed. An inaccessible resource or blocked runtime is a bounded observation, not evidence that unseen controls or course behavior are defective.

## Verification reporting

A valid JSON ledger and link/claim review establish documentation structure only. For implementation, record revision, viewport, input, state, procedure and actual result. Measure the rendered target and label field; exercise action, navigation, toggle and tab contracts; inspect keyboard focus and reduced-motion feedback. Keep unrun physical-device, assistive-technology and live-service checks explicit. No measured usability improvement, error reduction, physical reach result or general causal effect is claimed by these references.
