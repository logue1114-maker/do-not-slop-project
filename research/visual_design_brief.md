# Six product screens: visual and Korean copy brief

## Decisions to implement first

1. **Make the product screen the page.** The default view should be almost entirely the selected product example. Keep only a slim, neutral example switcher outside it. Put research, measurements and review fields behind a separate control. Do not place a permanent inspector beside the artwork.
2. **Give each screen its own composition, typography and material.** Six differently coloured versions of `.toolbar + .pad + .item` will reproduce the problem. The six silhouettes must be recognizable with all text blurred.
3. **Start in a populated, specific state.** Open an equipped character, a battle in progress, a partly solved puzzle, one desirable product, a real-length article, and a lesson already selected. Empty search/list pages hide the design work.
4. **Use images as content.** Character/item art, combat art, object photography, editorial photography and a classroom visual are necessary. The puzzle is the deliberate exception: its game pieces are the visual content. No emoji substitutes for fantasy assets or product photos.
5. **Remove evaluator language from the product UI.** The user should see “장착”, “턴 종료”, “장바구니 담기”, “다음 수업”. The separate wrapper can disclose that these are original fictional products. The product should never say “검수 흐름”, “구현 범위”, “CSS px”, “자체 작성 예시 문서”, or “이 브라우저에만 저장됩니다”.

All dimensions below are proposed starting values for an approximately 1440 × 900 CSS-pixel product canvas, not measured rules from the reference products. Adapt rather than uniformly shrink at smaller widths. Five primary Korean strings are specified for each screen; additional numerals, item names and short metadata are subordinate content, not a second explanatory layer.

---

## 1. RPG inventory — a character surrounded by possessions

**Product / exact frame:** An original dark-fantasy RPG, inventory open for level-24 ranger 로웬. A newly found 서리 장검 is selected; the equipped weapon remains visible for comparison.

### Composition and geometry

- An edge-to-edge, very dark desaturated forest background. No white browser-panel surround inside the product.
- Three unequal vertical zones: inventory roughly 34%, character roughly 39%, item detail roughly 27%. A thin top bar and a narrow bottom command strip.
- Left: compact category tabs over a **6 × 5 grid**, 58–66px square slots, 6px gutters. Most slots contain recognizable painted possessions; leave a few empty. Inventory is genuinely dense.
- Centre: full-height painted ranger, about 480px tall, with equipment slots around the silhouette. Two or three stats sit beneath the character, not in giant dashboard tiles.
- Right: the selected sword illustration above the name, rarity and aligned stat rows. Current/candidate values align on the same baseline. The equip action sits at the bottom of this panel.
- Item slots have mostly square geometry, 1px subdued borders. Selected outline is old gold; rarity can add a small diamond plus a word. No glowing border on every item.

### Type and colour

- Small serif display title, 28–30px; compact Korean sans UI, 12–14px; item name 23px; tabular stat figures 16px. Readable type takes priority over ornamental runes.
- Background `#151916`; panels `#202720`; text `#E8E1CA`; secondary `#ADB5A7`; selected brass `#BDA564`; positive change `#98C5A0` with explicit `+15`.
- Faint worn-metal/cloth texture is permitted. Avoid blurred black glass, purple gradients and CSS-generated decorative sparkles.

### Five primary visible strings

1. `소지품`
2. `장비  ·  소모품  ·  재료`
3. `서리 장검`
4. `장착 중인 무기와 비교`
5. `장착`

Subordinate content: `로웬 · Lv. 24`, `44 / 60`, `희귀 · 한손검`, `공격력 87  (+15)`, `치명타 확률 +4.0%`, `내구도 92 / 100`, `12,480 G`. Current sword: `강철 장검`, attack `72`. Two-line flavour text at most: `칼날 안쪽에 서리가 남아 있다.`

**One visible interaction:** Selecting another grid slot changes its outline and the right-hand art/stats without hiding the character. Equipping updates the character weapon slot and the “장착 중” marker. Do not open a generic white modal for the central experience.

**Asset direction:** A grounded, painterly ranger in weathered moss-coloured cloth; distinct sword/helm/boot/flask/material icons; transparent or clean-cut character silhouette. Do not embed Korean text in generated art.

---

## 2. Card battle — a theatrical combat stage and a hand of cards

**Product / exact frame:** An original illustrated deck-building game. Turn 3 in 달그림자 숲; the player has 3 energy and faces a thorn-antler creature whose next attack is visible.

### Composition and geometry

- Wide side-on battlefield occupies the upper 60%. Small player figure at left, large enemy at right, open middle space for effects. This is a scene, not a felt-green dashboard.
- A compact player HP strip near the player; enemy HP and a sword/`8` intent symbol physically near the enemy. Keep essential numbers out of the painted background.
- Five large portrait cards form a shallow fan across the lower centre. Start at 155 × 220px, with 15–20px overlap and only small rotations. One selected card rises 20px; its text stays upright and readable.
- A circular energy token sits lower left; a large oval “턴 종료” sits lower right. Draw/discard stacks are small peripheral objects with counts.
- Upper corners hold location and turn. Avoid a full-width table header listing every state.

### Type and colour

- Expressive, heavy card names at 18px; clear sans rules at 14–15px; costs 26px; turn labels 13px. Card titles may use a compact serif, while rule text does not.
- Twilight background `#302341`; warm card stock `#F5E6C7`; ink `#342234`; attack coral `#D16A48`; magical accent pale mint `#A9D2BB`.
- Chunky, screen-printed shapes and warm paper textures, deliberately different from the RPG’s realistic metal/cloth.

### Five primary visible strings

1. `달그림자 숲`
2. `3턴 · 내 차례`
3. `다음 공격 8`
4. `에너지 3 / 3`
5. `턴 종료`

Hand content, fully specified:
- `불씨` — cost `1`, `피해를 6 줍니다.`
- `불씨` — cost `1`, `피해를 6 줍니다.`
- `연막` — cost `1`, `방어도를 5 얻습니다.`
- `흔들리는 등불` — cost `2`, `피해를 12 줍니다.`
- `숨 고르기` — cost `0`, `카드를 1장 뽑습니다.`

Player `22 / 32`; enemy `36 / 48`; draw pile `8`; discard pile `2`. Do not add a status paragraph saying every card is “선택 가능”. Readiness is expressed by cost, contrast and a modest edge treatment.

**One visible interaction:** Selecting an attack card raises it and outlines the enemy; selecting the enemy plays it and updates the HP/energy. Escape cancels a selection. The feedback is a short `−6` near the target and the changed numbers, not a notice box pushing the hand downward.

**Asset direction:** Layered, illustrated moonlit woodland and a readable thorn-antler enemy silhouette; five small card illustrations in the same printmaking style. Composition must preserve the bottom card zone. No text in the art.

---

## 3. Browser puzzle — one cheerful, quiet board

**Product / exact frame:** 포켓 가든, a small matching puzzle. Three of eight pairs are already found. Two different pieces are face up, showing the next action immediately.

### Composition and geometry

- A flat, very pale mint full page, with no navigation rail. A small playful wordmark above a central **4 × 4 board**.
- The board is approximately 440px square. 94px tiles, 14px gaps, no outer card container. Use solid rounded rectangles with an offset 3px shadow that looks pressable.
- Board, a single compact score row and the restart button form a narrow vertical composition, roughly 490px wide. Leave generous lateral and lower empty space.
- A little plant silhouette at one corner is sufficient. No giant marketing hero, achievements sidebar, feature cards or paragraph of instructions.
- Found pairs remain in place in a calm lower-contrast state; open pieces show simple bold shapes. Closed tiles have a tiny seed emblem rather than question marks.

### Type and colour

- Friendly rounded Korean title, 34px; short interface labels 14px; counter digits 24px. Use a sans fallback if the rounded font is unavailable rather than mixing random fonts.
- Background `#EAF5EB`; deep text `#214C43`; closed pieces `#AAD3AE`; open face `#FFFEF5`; one apricot accent `#EAB06B`.
- Illustrations use simple, consistent silhouettes: leaf, lemon, mushroom, watering can, flower, pear, butterfly, sprout. Each pair is identifiable by shape, not colour alone.

### Five primary visible strings

1. `포켓 가든`
2. `같은 그림 두 개를 찾아요`
3. `찾은 짝 3 / 8`
4. `시도 7`
5. `다시 하기`

An optional small speaker toggle can use an accessible label `소리 끄기`; it must not introduce another visible settings panel.

**One visible interaction:** Turn over two tiles; a match stays face up and the counter changes. Keep the board geometry completely fixed. Completion can replace the compact score line with `여덟 쌍을 모두 찾았어요` and a single replay button.

**Asset direction:** Eight clean vector-like botanical objects and a seed mark. SVG/CSS is appropriate here; raster background art is unnecessary.

---

## 4. Shopping — a ceramics product, photographed at human scale

**Product / exact frame:** 소일, a small ceramics shop. Product detail for an oatmeal-glazed round mug; one colour and one unit selected.

### Composition and geometry

- Warm white page. Wordmark upper left, a sparse horizontal category menu, search/cart controls upper right. Thin dividing rule, no thick coloured header.
- Large gallery at left, about 61% of the available width. Main crop approximately 700 × 620px, showing the whole mug and handle on a warm surface. A vertical strip of three 64px thumbnails can sit at the extreme left.
- The right column is approximately 360px wide. Small category line, product name, price, a short physical description, colour swatches, quantity, one full-width dark action. Space these groups, rather than putting each in a separate card.
- Keep photos rectangular and mostly borderless. Controls have restrained 0–3px corner radii. Option swatches are circles; the selected one gets a small ring plus its text label.
- Below the fold: dimensions and care. Only the top edge of this next section should appear in the first frame.

### Type and colour

- Refined sans title 32px/42px, weight 500; price 23px; option/body text 14–15px. Wordmark can be serif, 30px. The page’s quietness comes from spacing and photographs, not low-contrast text.
- Page `#FAF8F2`; text `#292D29`; line `#DDD9CE`; photographed oatmeal `#DCCCB4`; action `#39463B`; restrained rust accent `#A56645`.
- No fake review count, discount timer, best-seller badge or stock urgency.

### Five primary visible strings

1. `소일`
2. `둥근 머그, 오트밀`
3. `32,000원`
4. `색상 · 오트밀`
5. `장바구니 담기`

Subordinate content: `컵·잔`, `340ml`, `손에 편하게 감기는 둥근 손잡이.`, quantity `−  1  +`, `배송비 3,000원 · 60,000원 이상 무료`. Swatch options `오트밀 / 안개 / 올리브` must change the image or clear selection state.

**One visible interaction:** Change a swatch or quantity; add to cart; show a restrained right-side cart drawer with the correct selected item and subtotal. Keep original selection when it closes. The example wrapper can disclose no real order, rather than adding “결제 없음” to the shop’s primary button.

**Asset direction:** Believable pottery with subtle glaze variation and a tactile handle, soft side daylight, one clean three-quarter hero photo plus top and hand-held detail crops. No rendered text, fake engraved branding or hands with malformed fingers.

---

## 5. Information / editorial — a magazine opening spread

**Product / exact frame:** 골목, an original neighbourhood culture publication. The article is “책장이 된 신발장”, about a fictional old bathhouse converted to a bookshop. This is readable editorial content, not another UI-design article.

### Composition and geometry

- Warm paper canvas with a strong black masthead. A ruled publication header, a small date/issue line, and understated sections rather than a dashboard toolbar.
- First spread is deliberately asymmetric: a 38% text column left and a 57% documentary-style photograph right, separated by ample space. Image starts slightly above the headline baseline.
- The headline takes two short lines at roughly 54px. Category/author/date are small and quiet. A precise 2–3-line introduction follows, with a thin reading-progress rule only if it has a real function.
- Below the opening spread, body reading width is about 650px at 18px/31px. A small article contents list can appear in the outer margin after scrolling, not as a permanent full-height coloured rail.
- Use hard edges and thin black rules. No rounded cards, colour-coded callouts, gradient panels or “feature benefits” grid.

### Type and colour

- Korean serif headline and article body; sans navigation, date and captions. Headline 50–56px/1.2; lead 20px/1.65; body 18px/1.75; caption 12px.
- Paper `#F5F1E8`; ink `#24231E`; secondary `#706E63`; a tiny editorial red `#AA493C`. A naturally cool-green photograph creates the visual counterweight.
- Distinct paragraph rhythm, intentional line breaks and readable punctuation matter more than decorative quotation marks.

### Five primary visible strings

1. `골목`
2. `공간  /  사람  /  산책`
3. `책장이 된 신발장`
4. `문을 닫은 목욕탕에, 작은 책방이 들어섰다`
5. `저장`

Byline: `글 김서윤 · 사진 이도현` (fictional contributors for this original example). Intro: `책방의 첫 번째 서가는 예전 신발장이었다. 열쇠 구멍을 남겨 둔 나무 문마다 이제는 책 한 권씩 꽂혀 있다.`

First body passage: `입구에서 신발을 벗을 필요는 없다. 낮은 턱을 넘으면 왼쪽 벽을 따라 오래된 나무장이 이어진다. 주인은 문짝을 떼지 않고, 칸마다 들어갈 만큼의 책만 골랐다. 두꺼운 책은 눕혀 놓고 얇은 책은 표지가 보이게 세웠다.`

Caption: `신발장 문에 남은 번호표. 책을 꺼내면 뒤쪽의 낡은 페인트가 보인다.` Do not imply these fictional people or places were researched. The outer example disclosure is the right place to identify original fictional content.

**One visible interaction:** Save toggles `저장됨`; article contents jumps to a real section while preserving reading position. Text-size control, if present, lives in a small `가` control rather than a settings sidebar.

**Asset direction:** Documentary photograph of a modest Korean-style former bathhouse entrance converted to a tiny bookshop; worn small tiles, preserved timber shoe lockers, afternoon natural light, real books. No legible artificial signage or staged luxury café aesthetic.

---

## 6. Course classroom — the lesson takes priority

**Product / exact frame:** 모두의 사진 수업. The learner is in lesson 3 of 6, “창가에서 빛 읽기”; the first two lessons are complete. A large instructional image/video area shows a simple fruit still life lit from a window.

### Composition and geometry

- Cool off-white classroom; a slim blue-black top bar, not a landing-page hero. Back-to-course at upper left, course title next, small learner/profile control at the end.
- Main learning area left, roughly 72%; curriculum rail right, roughly 28%. A true 16:9 media area is the dominant rectangle; target 900 × 506px when the canvas allows.
- Under the media: lesson title, then compact tabs `수업 노트 / 자막 / 질문`. The first visible content is one concrete teaching point, not three generic cards.
- Right rail: “목차”, compact completion summary `2 / 6 완료`, six numbered rows with durations. Completed rows have checkmarks; current row has a blue left rule and `수강 중`; future rows remain accessible if the course permits.
- Soft but restrained 8px rounding on the media container; curriculum rows stay nearly square. A single 48px next-lesson button is anchored below the rail.

### Type and colour

- Clean, slightly rounded Korean sans; 26px lesson title, 16px explanatory text, 14px curriculum rows, tabular timestamps 12px. Do not use the editorial serif or the shop’s loose luxury spacing.
- Page `#F2F5FA`; media surround `#19283D`; text `#1C2A40`; accent `#456FCD`; selected row `#E2EBFD`; completion `#477D63` plus a checkmark.
- Medium density: more structure than the shop, substantially less than the RPG. The media area carries the strongest contrast.

### Five primary visible strings

1. `모두의 사진 수업`
2. `03. 창가에서 빛 읽기`
3. `수업 노트  ·  자막  ·  질문`
4. `목차 · 2 / 6 완료`
5. `다음 수업`

Curriculum: `01. 카메라와 친해지기 · 6:24`, `02. 초점 맞추기 · 9:10`, `03. 창가에서 빛 읽기 · 12:18`, `04. 같은 장면, 다른 노출 · 10:05`, `05. 구도 바꿔 보기 · 8:46`, `06. 첫 사진 고르기 · 7:32`.

Teaching note: `창을 옆에 두면 과일의 둥근 면에 그림자가 생깁니다. 얇은 흰 커튼을 치고, 그림자의 경계가 어떻게 바뀌는지 살펴보세요.`

**One visible interaction:** Curriculum selection changes the title and lesson material without falsely marking it complete. The note/transcript tabs expose different actual content. If playable video is unavailable, use a working local narrated/slideshow lesson or clearly designed still-image lesson; do not paint a nonfunctional play button and fabricated running timestamp onto a photograph.

**Asset direction:** Credible instructional still: two pears and neutral cloth beside a north-facing window, visible soft directional light, one instructor annotation about light direction. Render the annotation as real UI, not image text. This should look like a lesson, not a course sales cover.

---

## Actual implementation critique

This critique is based on the inspected `dist/index.html`, `dist/style.css`, `dist/app.js` and `dist/data.js`, plus the existing research. It is source-level evidence, not a claim to have freshly measured the rendered page.

### The outer shell overwhelms the examples

- `index.html` simultaneously shows a 72px product header, the left series rail, page title/description, a view tab row, a numbered task flow, an example disclaimer, the example itself, and a permanent review inspector.
- Above the 1200px breakpoint, `.workspace` reserves **208px + 302px** for sidebars before the main padding. At 1280px, the product surface gets only about **718px** of width; at 1440px, about **878px**. This makes six already-small examples read as widgets within an administrative page.
- Below 1200px, the inspector moves below and the surface becomes wider despite the browser getting narrower. The actual product screen should have a consistent, generous viewing area rather than losing 302px at the desktop breakpoint.
- The default `.flow` turns every genre into a procedure diagram before the viewer has seen the product. The stepper belongs in analysis, not above an inventory or battlefield.

### The visual distinction is mostly surface colour

- Global Arial/Noto Sans, 44px white buttons, 6px corners, `.toolbar`, `.pad`, `.subnav`, `.item`, `.notice`, `.stats` and blue primary actions are shared across the demos.
- RPG currently has four text-only rows, two oversized stats, no character silhouette, no item images and a white comparison modal. The only game-specific surface is a navy toolbar.
- Card battle has one bordered enemy text box and three plain rectangles. No combat scene, card art, avatars, spatial targeting or hand silhouette. “모든 조작은 클릭·키보드로 가능” is explanatory documentation inside the game.
- Browser puzzle is a generic 4 × 2 letter grid with question marks. It functions, but it has no visual identity beyond the shared dark-blue button style.
- Shopping’s invented font samples (“가나다 Aa”) keep it visually text-heavy. Every item is framed as a sample and every shopping step is explained. A tactile object and product photograph create the missing visual proof.
- Information and learning both teach UI design in the UI-design research site. Their content restates the same abstractions instead of demonstrating a credible reading or learning product.

### The copy weakens the product illusion

Examples found directly in the current files:

- `전투 밖 · 장착은 되돌릴 수 있음`
- `이 흐름은 무기 장착 예시입니다. 망토 장착은 구현 범위에 포함되지 않습니다.`
- `실제 판매 상품이 아닌 UI 검수 데이터입니다.`
- `검수 흐름의 마지막 화면입니다. 주문·결제·개인정보 전송은 일어나지 않습니다.`
- `예시를 읽은 뒤 오른쪽 검수 항목에서 위치와 이동 방식이 분명한지 확인할 수 있습니다.`
- `완료 조건: 확인 문제를 맞히면 이 단원이 완료됩니다. 다른 단원은 자유롭게 살펴볼 수 있습니다.`

These sentences describe implementation intent and evaluator tasks. Replace them with actual item properties, prices, article prose, teaching material and short action feedback. Keep honesty about the example’s fictional/local-only nature in one outside description rather than repeating it inside every product.

The research does not need to be deleted. Its careful distinction between observation, inference and unverified behaviour is valuable in a separate reference view. It is poor default screen content for someone asking to see finished visual design examples.

---

## Carry forward from the existing research

Use these findings as behaviour constraints, not as aesthetic templates:

- **RPG:** FFXIV comparison keeps current/candidate values aligned. Apply to the persistent detail panel, not an unrelated white confirmation window. Source: `games_rpg_card_research.md`, R1, [official comparison guide](https://na.finalfantasyxiv.com/uiguide/equipment/equipment-compare/equipment_compare.html).
- **Card:** The Hearthstone/SNAP research separates combat board, hand and selection/commit states. Retain clear energy/intent/target state; do not translate it into paragraphs. Source: `games_rpg_card_research.md`, C1–C2, [official SNAP overview](https://marvelsnap.com/game-overview/).
- **Puzzle:** 2048’s fixed board geometry and Lichess’s visible current task support one dominant board with compact progress. The proposed mint style is an original choice. Source: `browser_games_apps.md`, sections 1–2, [2048 Classic](https://classic.play2048.co/), [Lichess learn](https://lichess.org/learn).
- **Shopping:** IKEA/Apple keep product imagery and current choices together. Apply to one image-rich detail screen; the original tiny catalogue lacks this spatial distinction. Source: `web_shopping_information_learning.md`, sections 2–3, [IKEA observed product](https://www.ikea.com/us/en/p/micke-desk-white-80213074/).
- **Editorial:** Wikipedia/MDN show the value of reading location and article navigation. Keep those tools quiet around actual prose; do not inherit both sidebars for a short magazine article. Source: `web_shopping_information_learning.md`, sections 4–5, [Wikimedia contents explanation](https://www.mediawiki.org/wiki/Reading/Web/Desktop_Improvements/Features/Table_of_contents/en).
- **Classroom:** Khan’s media area retains 16:9 and grows when the curriculum closes. Apply to real lesson content and distinguish viewed/current/completed. Source: `web_shopping_information_learning.md`, section 6, [observed lesson](https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:foundation-algebra/x2f8bb11595b61c86:intro-variables/v/what-is-a-variable).

No new external observations or new performance claims are made in this brief.

## Finish check

- At first glance: one character, one battle, one puzzle, one physical product, one article, one classroom. No need to read a heading to tell them apart.
- Each screen has one obvious visual centre. Do not put identical white cards around all content.
- Visible Korean is product copy; research/evaluator language remains outside the product canvas.
- Artwork contains no baked-in text. Real type stays crisp, accessible and responsive.
- Every visible control performs its obvious action, or is removed from the product view. No fake player, fake checkout or decorative filters.
- Check all six at one wide viewport and one narrow viewport with their actual populated content, not just isolated components.
