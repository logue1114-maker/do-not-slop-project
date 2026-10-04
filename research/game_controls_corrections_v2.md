# 게임 버튼·메뉴·HUD 시각 교정 추가 조사 v2

조사일 2026-10-04 UTC · 범위: 실제 제작자가 공개한 여섯 게임 사례와 자체 교정 명세

## 이번 조사에서 달라진 것

기존 V01–V04의 “버튼을 한 가족으로 만든다”를 재진술하지 않고, 여섯 서로 다른 가족을 형태·표면·서체·배치·상태·크기의 변경 계약으로 풀었다. 동일 fixture의 전후 명세와 검사 항목을 함께 제공한다. **연구와 명세는 완료했지만 실제 구현·실행 캡처·사용자 검수는 아직 하지 않았다.** 이 보고서가 전체 프로젝트 완료나 공개/설치 준비를 뜻하지 않는다.

- Factorio: bevel과 방향성 끝을 공유하며 확인·back·취소·일반 명령을 구분
- Dead Space: 장비의 서사와 기술 연대에서 재료를 고르고, command/상태/meter를 다른 grammar로 구분
- Battlefield V: 장면·인물이 주인공인 선택 화면과 compact command legend를 분리
- Tintin Match: cream paper와 ink outline에서 rounded controls를 도출
- Hard Head Squad: vivid gradient와 thick extrusion을 제거하지 않고 일관된 규칙으로 정돈
- Victoria 3: ornate identity를 제목과 외곽에 집중하고 dense data와 결정 버튼을 정렬

## 근거의 경계

제작자 설명(C), 이미지 직접 관찰(O), 자체 교정안(P)을 아래에서 구분한다. O는 공개 concept sheet/portfolio still의 실제 렌더를 본 기록이다. 게임을 직접 플레이하거나 현재 shipping build를 검수한 기록이 아니다. 모든 전후의 before는 우리가 만든 실패 시안이고 after도 자체 시안이다. 외부 screenshot을 자체 before로 쓰지 않는다. 숫자는 별도 표시가 없으면 CSS px의 **시험용 시작값 P**이며 제품 실측값·권장 표준이 아니다.

원문은 공식 개발자 글 또는 실제 참여자의 portfolio로 확인했다. Portfolio의 역할은 원저자 자술이며 전체 권리자/기여자를 확정한 자료는 아니다. 업로드 URL의 timestamp를 발행일로 추측하지 않는다. Link만 기록하며 타사 이미지 bytes·font·logo를 공개 패키지에 넣지 않았다.

## 중복과 연결

기존 anti-slop·UX catalog와 RPG/card evidence를 URL 단위로 대조했고 이번 creator source에 exact URL 중복은 없다. 일반 원칙은 AS:V01–V04를 심화하며 별도 보편 규칙 수로 부풀리지 않는다. 모든 새 ID는 GCTRL2 namespace를 사용한다. 기존 AS 및 UX 링크는 이름 공간을 명시했다.

## GCTRL2:C:FACTORIO · 산업형 버튼: 확인·되돌림·취소를 형태와 상태까지 한 가족으로

**맞는 맥락** 정보 밀도가 높은 factory/strategy 화면. 단단한 neutral control family가 도구의 안정감을 주되 작은 data slots와 큰 confirm을 구분한다.

### 제작자 설명 C

- 2018 제작자는 전체 widget sheet를 공유해 대비·폰트·해상도 및 문자권을 함께 검토했다. Sheet의 수치는 HR artwork 주석이다.
- Research-tree 문맥 조작을 객체 곁에 두려는 설계와, 버튼을 한눈에 알아보게 할 위치/형태 관습 사이의 긴장이 제작자 글에 직접 기록돼 있다.
- 2020 변경 설명은 E를 확인, Esc를 취소로 분리하고 green confirm과 키 입력에 같은 의미를 부여한다. 그 mapping은 Factorio의 맥락이며 다른 게임의 필수 키가 아니다.

[GCTRL2:S01: Friday Facts #243 — New GUI tileset](https://www.factorio.com/blog/post/fff-243) · [GCTRL2:S02: Friday Facts #238 — The GUI update (Part II)](https://www.factorio.com/blog/post/fff-238) · [GCTRL2:S03: Friday Facts #362 — Continue button and confirm](https://www.factorio.com/blog/post/fff-362)

### 공개 시각 사례 O

- [GCTRL2:IMG01 · Factorio GUI tileset / annotated button families](https://cdn.factorio.com/assets/img/blog/fff-243-generic-tileset-demo.png): 일반 사각 버튼, 오른쪽 끝이 향하는 확인 버튼, 왼쪽 끝이 향하는 back 버튼, red cancel family. Idle/Disabled/Hover/Press 열과 HR 36px 글자·press 때 2px 아래 주석이 보인다.

- 서로 다른 역할에 색뿐 아니라 끝 모양이 다르다. 일반 button의 bevel과 hover/press 차이도 한 sheet에서 비교할 수 있다.

### 실패 시안 P

가상 공장게임: 기술 목록, 수치 조절, 예약, 닫기가 모두 52px pill이고 각각 다른 glow를 갖는다. 예약은 작은 icon이라 클릭인지 상태표시인지 모호하고, 화면상 확인과 취소의 의미가 드러나지 않는다. 실제 Enter 확인 / Esc 취소 binding과 행동 의미는 두 시안에서 동일하게 둔다.

### 구체적 교정 지시 P

**외곽과 공통 부품** 일반 text control은 작은 모서리의 rectangle, 진행 확인은 right-facing end, back은 left-facing end로 설계한다. outline·bevel cap·label inset을 공통 component에서 생성한다. 별 모양·원형 close·캡슐 start를 임의로 섞지 않는다.

**재료와 광원** 공통 dark panel, upper-left 1px light bevel, lower-right 2px dark bevel의 자체 시안부터 시작한다. texture는 label 안쪽에 깔지 않고 rim에 낮은 밀도로 둔다. Hover에만 accent rim을 사용하고 base에 영구 glow를 주지 않는다.

**글자와 아이콘** 1280×720 CSS 시안에서 고딕 label 16px/600, line-height 22px, horizontal text inset 16px를 출발점으로 삼는다. Icon은 20px silhouette family, label baseline에 맞춘다. Source의 36px HR font를 CSS 36px 권장값으로 옮기지 않는다.

**위치와 위계** 기술 설명·자원 비용·예약 control을 같은 selected-detail panel에 붙이고, 변경 확정 footer는 항상 같은 영역에 둔다. Back은 왼쪽, confirm은 오른쪽이라는 이 예시의 규칙을 다른 대화창에도 유지한다. 주행동 하나만 green, 나머지는 neutral로 둔다.

**크기와 입력** Desktop에서 44px control height와 8px gap은 시험용 시작값이다. 좁은 창에서는 tech list/detail을 순차 화면으로 바꾸되 비용·confirm·back을 모두 보존한다. 컨트롤러는 widget 배치와 별도로 focus graph를 검수한다.

**상태 계약**

- idle: neutral face와 raised bevel. confirm은 green family지만 hover만큼 밝지 않다.
- hover: rim accent만 변화; layout와 label 기준선 유지.
- focus: persistent 2px inner outline와 keyboard/controller glyph; hover와 별도 토큰.
- pressed: face 안쪽이 recessed, 내부 label만 1px 내려간다. hitbox와 외곽 bounding box는 고정.
- disabled: bevel relief 약화, label 보존, 바로 옆에 사용 불가 이유. 색만 바꿔 available과 구별하지 않는다.
- selected: 예약 완료는 check + 예약됨 label. Focus와 다른 의미.
- confirm_cancel: 이 자체 예시는 Enter 확인 / Esc 취소를 별도 binding으로 정의. 사용자가 고른 bindings가 표시/동작과 맞아야 한다.

### 동일 콘텐츠 전후 명세 P

Pair GCTRL2:PAIR:FACTORIO · fixture GCTRL2:F:FACTORIO · 상태 specified_not_implemented

Fixture SHA-256: a2ff07fb5b9a0627d16ebc918cd035f38c320800b4ed07afedd1eb606da7b4b5

환경: 1280×720 CSS px, DPR 1, zoom 100%, ko-KR, mouse_keyboard

핵심 과제: 선택 기술을 연구 대기열에 넣고 변경을 확정한다

**고정 데이터**

```json
{
  "fixture_id": "GCTRL2:F:FACTORIO",
  "viewport_css": [
    1280,
    720
  ],
  "dpr": 1,
  "zoom_percent": 100,
  "locale": "ko-KR",
  "input_mode": "mouse_keyboard",
  "task": "선택 기술을 연구 대기열에 넣고 변경을 확정한다",
  "selected_technology": "자동 분류",
  "requirements": {
    "과학 팩": 40
  },
  "inventory": {
    "과학 팩": 65
  },
  "queue": [
    "전력 저장"
  ],
  "actions": [
    "대기열에 추가",
    "변경 적용",
    "취소"
  ],
  "initial_state": "detail_open_available",
  "capture_states": [
    "idle",
    "focus_add",
    "pressed_add",
    "queued",
    "cancelled"
  ],
  "art_fixture": {
    "ids": [
      "generic_factory_background_v1",
      "technology_icon_sorter_v1"
    ],
    "description": "자체 제작 industrial factory background와 generic sorter icon; 타사 자산 미사용",
    "asset_sha256": null,
    "status": "required_to_create_or_resolve_before_implementation; not_available_yet"
  }
}
```

**Before P**

- layout: detail panel x=360,y=112,w=560,h=448. 세 action은 panel 외부 서로 다른 모서리에 배치
- controls: 모두 52px pill, permanent glow; 대기열 추가만 작은 무명 icon
- data_policy: 위 fixture 그대로 표시, 신규 정보/누락 없음

**After P**

- layout: 같은 panel bounds. 비용 다음 줄에 추가 action 176×44; footer y=504,h=56; cancel left, apply right
- controls: 공통 44px 가족, add neutral/queued state, apply right-facing green, cancel restrained neutral text label; 파괴적 삭제와 단순 취소를 혼동해 red를 강제하지 않음
- data_policy: 같은 기술·비용·자원·queue·actions 유지

두 버전은 fixture·background/camera asset·locale·initial state·task goal·viewport/DPR/zoom·input·capture milestone이 같아야 한다. 상태 화면의 숫자가 다르면 같은 milestone인지 먼저 확인한다. 조작 계약이 바뀌면 시각 교정 효과와 섞지 말고 별도 change ledger에 기록한다.


**동등성 미검증 항목과 변경표**

- Art fixture IDs는 위에 정의했으나 실제 파일·hash는 아직 없다. 구현 revision과 capture도 없다. 데이터 고정과 동등 전후 검증 통과를 구별한다.
- 허용: 외곽·재료·글자·간격·배치·상태 표현. 불허: 과제 목표·숫자·비용·선택 항목·hold duration·실행 의미를 몰래 바꾸기.

### 구현 후 검사할 항목

- GCTRL2:T:FACTORIO:01 [not_run]: 같은 fixture/hash와 available/queued milestone에서 before/after 캡처를 재생할 수 있다
- GCTRL2:T:FACTORIO:02 [not_run]: 비용 40, 보유 65와 예약 결과가 두 버전에서 모두 읽힌다
- GCTRL2:T:FACTORIO:03 [not_run]: Hover/press가 sibling 위치·hitbox를 바꾸지 않는다
- GCTRL2:T:FACTORIO:04 [not_run]: 초점을 옮긴 상태와 이미 예약된 상태가 정적으로 다르게 보인다
- GCTRL2:T:FACTORIO:05 [not_run]: Enter 확인과 Esc 취소의 실제 결과가 화면 label/binding과 일치한다
- GCTRL2:T:FACTORIO:06 [not_run]: 긴 한글 label에서 arrow tip·bevel이 text inset을 침범하지 않는다

### 적용하지 않을 때와 권리

- 화살표 끝과 green confirm을 모든 게임의 법칙으로 만들지 않는다
- Source의 red cancel은 특정 style sheet의 선택이다. 자체 예시의 취소가 비파괴적이면 red warning semantics를 굳이 복사하지 않는다
- 문맥 button이 선택 객체를 가리키는 이점은 유지하되 recognizable button surface를 함께 제공한다
- 원본 이미지는 위 link로만 참조한다. 공개 재배포 허락은 확인되지 않았다. 자체 시안은 generic labels/data/art를 사용하고 상표·캐릭터·원본 shape artwork·font를 복사하지 않는다.
- 실제 usability 향상·시간 감소·오류 감소를 측정하지 않았으므로 그런 효과 수치를 제시하지 않는다.

기존 연결: AS:V01, AS:V02, AS:V03, AS:V04, AS:AS18, AS:AS22, UX:R-COM-05, UX:R-CTRL-01

## GCTRL2:C:DEADSPACE · SF 단말기: 장식 도형이 아니라 명령·상태를 구분하는 조형

**맞는 맥락** 장비/단말기로 세계를 전달하는 SF horror 또는 survival. 불투명 base 없이 가느다란 cyan만 늘어놓는 화면의 교정에 적합하다.

### 제작자 설명 C

- 원저자는 Dead Space 2에서 더 큰 UI art team을 위해 공통 shape library를 만들었다고 설명한다. 여기서 보는 자료는 early concepts다.
- Dead Space 3의 옛 단말기에서는 서사의 기술 연대를 표현하려고 hologram 대신 glass-based retro-futuristic terminals를 구상했다. SF라는 이유만으로 모든 장치에 같은 neon을 붙인 사례가 아니다.

[GCTRL2:S04: Dead Space 2 UI Concepts / Shape Library](https://dinoignacio.com/portfolio/dead-space-2-shape-library/) · [GCTRL2:S05: Dead Space 3 UI Concepts](https://dinoignacio.com/portfolio/dead-space-3-ui-concepts/)

### 공개 시각 사례 O

- [GCTRL2:IMG02 · Dead Space 2 shape-library concept sheet](https://dinoignacio.com/wp-content/uploads/2013/05/ds2_shape_library.jpg): cyan과 회색의 잘린 모서리 패널, 반복되는 cap/rail, 원형 controller glyph가 들어간 PRESS AND HOLD prompt, segment형 bar가 함께 놓인다. 각 도형을 제품의 실제 hover/disabled 상태로 확인한 것은 아니다.
- [GCTRL2:IMG03 · Dead Space 2 lock hologram concepts](https://dinoignacio.com/wp-content/uploads/2013/05/ds2_holograms.jpg): LOCKED / UNLOCKED / OPEN? 텍스트와 서로 다른 원형 segment 구조가 함께 보인다. 색 변화만 있는 표본이 아니다.

- Sheet는 cut corner와 rail/cap, glyph가 포함된 hold prompt를 반복한다. Lock concepts는 문구와 원형 구조를 함께 바꾼다. 그 요소를 shipping hover/disabled system으로 확정하지 않는다.

### 실패 시안 P

가상 기지 hatch panel: outline hexagons 12개, 같은 cyan glow, 가독성이 낮은 좁은 숫자. 산소 상태와 실제 열기 명령이 같은 원형 장식이고 hover해야만 이름이 보인다.

### 구체적 교정 지시 P

**외곽과 공통 부품** 명령은 공통 6px chamfer rectangle, 읽기전용 meter는 segment rail, 경보는 별도 inset band로 역할을 분리한다. 매 버튼마다 서로 다른 hex/radar shape를 생성하지 않는다. Chamfer 방향·corner count를 전체 panel family에서 유지한다.

**재료와 광원** 전체는 장비 display라는 하나의 재료다. 라벨 아래에는 어두운 local backing을 확보하고 cyan emissive는 selected rail·progress에 제한한다. Busy scene 위 blur만으로 contrast를 얻었다고 가정하지 않는다. 기존 장치가 유리/CRT라면 그 재료를 유지하고 hologram으로 재해석하지 않는다.

**글자와 아이콘** 본문·명령은 18px 고딕, timer/숫자만 20px tabular style를 시험한다. 과한 tracking과 가짜 barcode label을 제거한다. Key glyph와 명령 verb를 한 행에 묶는다. 작은 써체로 모든 수치를 압축하지 않는다.

**위치와 위계** Hatch object 왼쪽에 고정 폭 command panel을 붙이고 산소·seal status·hold instruction·cancel 순으로 읽게 한다. 상시 HUD의 health/oxygen과 interaction panel은 서로 다른 layer로 관리한다. 선택을 하지 않은 decorative glyph에는 button hitbox를 주지 않는다.

**크기와 입력** 1920×1080 CSS에서 local panel 360×256, action 304×48, 12px internal gap를 자체 시작값으로 둔다. 화면 가장자리/원근 변환 때문에 text가 작아지면 diegetic surface와 동일 정보의 screen-space 대안을 검토한다. 이는 immersive UI를 모든 게임에 강제하는 처방이 아니다.

**상태 계약**

- idle: label과 key glyph가 항상 보이고 외곽 rail은 조용하다.
- focus: 명령 rail에 2px 선과 inward marker; label 밝기만으로 끝내지 않음.
- pressed_hold: hold progress가 채워지고 남은 진행이 보인다; early release는 취소되고 행동이 아직 발생하지 않는다.
- disabled: LOCKED/전력 부족 text + lock glyph + 끊긴 rail; label opacity만 낮추지 않는다.
- selected: inspection 대상은 bracket로 표시하지만 실행 완료 glyph와 구분.
- completed: 열림 text와 다른 segment shape, hatch 상태 변화. 완료 효과가 끝난 뒤에도 상태가 남는다.

### 동일 콘텐츠 전후 명세 P

Pair GCTRL2:PAIR:DEADSPACE · fixture GCTRL2:F:DEADSPACE · 상태 specified_not_implemented

Fixture SHA-256: 40995ad0431d9c426ca9766b9a4700aeec18965f8ac4a96727e54e5592fd5b6f

환경: 1920×1080 CSS px, DPR 1, zoom 100%, ko-KR, keyboard

핵심 과제: 전원이 들어온 에어록을 1초 누르기로 연다

**고정 데이터**

```json
{
  "fixture_id": "GCTRL2:F:DEADSPACE",
  "viewport_css": [
    1920,
    1080
  ],
  "dpr": 1,
  "zoom_percent": 100,
  "locale": "ko-KR",
  "input_mode": "keyboard",
  "task": "전원이 들어온 에어록을 1초 누르기로 연다",
  "hatch": "에어록 07",
  "oxygen_seconds": 42,
  "power": "정상",
  "seal": "닫힘",
  "hold_seconds": 1.0,
  "actions": [
    "길게 눌러 열기",
    "취소"
  ],
  "initial_state": "hatch_closed_powered",
  "capture_states": [
    "idle",
    "focus_open",
    "hold_50_percent",
    "released_cancelled",
    "opened",
    "unpowered_disabled"
  ],
  "art_fixture": {
    "ids": [
      "generic_airlock_corridor_v1",
      "generic_hatch_07_v1"
    ],
    "description": "자체 제작 SF corridor/hatch. Dark/bright variants마다 before/after는 동일한 art와 camera",
    "asset_sha256": null,
    "status": "required_to_create_or_resolve_before_implementation; not_available_yet"
  }
}
```

**Before P**

- layout: 같은 hatch camera; 360×256 overlay. oxygen/read-only/open/cancel이 같은 빛나는 circle
- controls: 가느다란 cyan type, action name hover-only, generic hexagon decoration
- data_policy: same oxygen/power/seal/hold duration

**After P**

- layout: 같은 overlay bounds와 camera; top status rail, central command, lower cancel
- controls: chamfer command 304×48, separate meter, persistent label/key glyph; 1초 hold contract unchanged
- data_policy: 같은 정보를 같은 milestone에서 보여줌; 새 mechanic을 추가하지 않음

두 버전은 fixture·background/camera asset·locale·initial state·task goal·viewport/DPR/zoom·input·capture milestone이 같아야 한다. 상태 화면의 숫자가 다르면 같은 milestone인지 먼저 확인한다. 조작 계약이 바뀌면 시각 교정 효과와 섞지 말고 별도 change ledger에 기록한다.


**동등성 미검증 항목과 변경표**

- Art fixture IDs는 위에 정의했으나 실제 파일·hash는 아직 없다. 구현 revision과 capture도 없다. 데이터 고정과 동등 전후 검증 통과를 구별한다.
- 허용: 외곽·재료·글자·간격·배치·상태 표현. 불허: 과제 목표·숫자·비용·선택 항목·hold duration·실행 의미를 몰래 바꾸기.

### 구현 후 검사할 항목

- GCTRL2:T:DEADSPACE:01 [not_run]: dark corridor와 밝은 전광판 background 두 버전에서 명령/oxygen이 모두 읽힌다
- GCTRL2:T:DEADSPACE:02 [not_run]: 누르는 중 50%와 실제 열린 완료 상태를 구별할 수 있다
- GCTRL2:T:DEADSPACE:03 [not_run]: 누르기 중 release/cancel이 열기를 실행하지 않는다
- GCTRL2:T:DEADSPACE:04 [not_run]: power 없는 상태에서 disabled 이유가 hover 없이 보인다
- GCTRL2:T:DEADSPACE:05 [not_run]: controller/keyboard glyph가 실제 binding으로 바뀌어도 label and shape family가 유지된다
- GCTRL2:T:DEADSPACE:06 [not_run]: Reduced motion에서 hold progress와 완료 상태가 사라지지 않는다

### 적용하지 않을 때와 권리

- Cyan·chamfer·world-space projection 자체를 좋은 SF의 요건으로 쓰지 않는다
- 원본 hold prompt를 보고 hold duration이나 실제 engine mapping을 추정하지 않는다
- diegetic UI가 text 판독을 해치면 화면 고정 방식과 비교한다
- 원본 이미지는 위 link로만 참조한다. 공개 재배포 허락은 확인되지 않았다. 자체 시안은 generic labels/data/art를 사용하고 상표·캐릭터·원본 shape artwork·font를 복사하지 않는다.
- 실제 usability 향상·시간 감소·오류 감소를 측정하지 않았으므로 그런 효과 수치를 제시하지 않는다.

기존 연결: AS:V01, AS:V03, AS:V04, AS:AS18, AS:AS19, AS:AS22, UX:R-COM-05, UX:R-MOTION-01

## GCTRL2:C:BATTLEFIELD · 장면 선택 메뉴: 이미지 타일과 조용한 명령 레전드를 분리

**맞는 맥락** cinematic shooter campaign/character selection. 장면·인물의 비중은 크게, 조작부는 소수의 공통 module로 만드는 경우.

### 제작자 설명 C

- 원저자는 Battlefield V에서 소수의 building blocks와 assigned behaviours로 버튼을 구성해 공통 요소 수정으로 가족 전체를 조절했다고 설명한다. 협업 결과임도 명시한다.

[GCTRL2:S06: Portfolio — Battlefield V UI](https://carlosvk.info/portfolio/)

### 공개 시각 사례 O

- [GCTRL2:IMG04 · Battlefield V War Stories menu](https://carlosvk.info/wp-content/uploads/2018/12/bfv_FrontEnd_03.jpg): 세로 장면 타일, 선택 타일의 흰 label 면, 나머지 장면 위의 간결한 type, locked tile의 lock glyph, 좌하단 controller Select/Back legend가 보인다.
- [GCTRL2:IMG05 · Battlefield V Medic equipment menu](https://carlosvk.info/wp-content/uploads/2018/12/bfv_FrontEnd_06.jpg): 왼쪽 장비/역할 column과 하단 command legend, 오른쪽 큰 character preview. 선택 항목은 light fill로 구분되고 보조 명령은 간결한 dark rows다.

- War Stories는 선택된 image tile의 light label surface와 locked glyph를 보여 준다. Medic menu는 compact left controls와 large character preview를 분리한다. Still만으로 hover motion·focus graph는 확인할 수 없다.

### 실패 시안 P

가상 shooter menu: chapter image 위마다 Play/Details/Settings 세 개의 56px bright pill. 선택되지 않은 타일까지 모두 white border와 glow를 갖고 3D preview는 작은 카드에 갇힌다.

### 구체적 교정 지시 P

**외곽과 공통 부품** Image tile는 공통 rectangle·일정한 crop ratio·동일 label band를 쓰고 small system actions는 동일한 간결한 row component로 만든다. Label band와 key glyph를 tile/button content slot으로 두어 너비가 달라도 corner·baseline·state logic은 공유한다.

**재료와 광원** 주인공/장면 art를 주표면으로 둔다. 선택 대상만 high-contrast light band를 얻고 나머지는 가독성 backing을 둔 낮은 대비 label 면을 사용한다. Frame 없이 label을 art 위에 바로 올릴 경우 실제 모든 crop에서 읽혀야 한다. 항상 빛나는 gold rim으로 선택을 표현하지 않는다.

**글자와 아이콘** 1280×720 CSS 시안: chapter title 20px/600, 장소·연도 14px/400, command legend 14px/600를 시험한다. 한글 title에 영문 all-caps tracking을 그대로 붙이지 않는다. Controller glyph는 20px로 동일 optical weight; locked는 glyph + text를 함께 둔다.

**위치와 위계** 네 chapter를 같은 row에서 비교하고 bottom command legend를 한 곳에 둔다. 선택 change와 시작 confirm을 분리한 기존 계약을 유지한다. Image tiles의 focus가 이동해도 설정·이전·시작 control이 화면 사방에 복제되지 않는다.

**크기와 입력** 1280×720에서 tile 240×376, gap 16, left margin 136는 자체 layout sample이다. Four tiles가 들어가지 않으면 가로 scrolling과 focus reveal 또는 세로 list로 전환한다. 전체 UI를 축소하거나 labels를 자르지 않는다.

**상태 계약**

- idle: 고정 image crop + readable title band. Hover가 없어도 chapter identity를 읽음.
- hover: 타일 내부만 밝아짐; row width, crop, label baseline unchanged.
- focus: 얇은 outline/inward marker와 command legend 업데이트.
- selected: 선택 tile만 light label band + 선택됨 marker. focus-only가 selection을 commit하지 않음.
- pressed: 시작 명령만 short internal change; tile이 주변 tile 위로 확대되지 않음.
- disabled_locked: lock glyph + 해금 조건. select-to-inspect와 play-disabled가 다르면 target rules를 분리해 표시.

### 동일 콘텐츠 전후 명세 P

Pair GCTRL2:PAIR:BATTLEFIELD · fixture GCTRL2:F:BATTLEFIELD · 상태 specified_not_implemented

Fixture SHA-256: c73a645d5a6043e08772ea28541fbc1aa38b9b915180b34e8cea548c6a951927

환경: 1280×720 CSS px, DPR 1, zoom 100%, ko-KR, controller

핵심 과제: 챕터를 살펴보고 선택한 챕터를 시작한다

**고정 데이터**

```json
{
  "fixture_id": "GCTRL2:F:BATTLEFIELD",
  "viewport_css": [
    1280,
    720
  ],
  "dpr": 1,
  "zoom_percent": 100,
  "locale": "ko-KR",
  "input_mode": "controller",
  "task": "챕터를 살펴보고 선택한 챕터를 시작한다",
  "chapters": [
    {
      "name": "바람의 전초",
      "place": "북부 해안",
      "year": 1943,
      "locked": false
    },
    {
      "name": "겨울의 길",
      "place": "산악 고개",
      "year": 1944,
      "locked": false
    },
    {
      "name": "마지막 교신",
      "place": "중앙 도시",
      "year": 1944,
      "locked": false
    },
    {
      "name": "새벽 항구",
      "place": "남쪽 항구",
      "year": 1945,
      "locked": true,
      "requirement": "겨울의 길 완료"
    }
  ],
  "selected_index": 1,
  "actions": [
    "시작",
    "상세 보기",
    "이전",
    "설정"
  ],
  "initial_state": "chapter_selection",
  "capture_states": [
    "idle_selected_1",
    "focus_2_selected_1",
    "locked_inspect",
    "start_confirmed"
  ],
  "art_fixture": {
    "ids": [
      "generic_chapter_coast_v1",
      "generic_chapter_pass_v1",
      "generic_chapter_city_v1",
      "generic_chapter_harbor_v1"
    ],
    "description": "네 장면의 자체 art. 두 디자인에 같은 file, crop rectangle와 image order 사용",
    "asset_sha256": null,
    "status": "required_to_create_or_resolve_before_implementation; not_available_yet"
  }
}
```

**Before P**

- layout: 네 chapter 동일 fixture; 각각 title와 3 bright pill. image/preview 면적은 filler panels와 경쟁
- controls: 모든 tile 동일 glow/white border; selected와 focus 구별 없음
- data_policy: four chapters, places, years, lock condition preserved

**After P**

- layout: row x=136,y=152; four 240×376 tiles with 16 gap. command legend y=640; same image asset/crop and same dataset in both capture variants
- controls: single Start/Details/Back/Settings command group. Selected band와 focus marker distinct
- data_policy: same chapter/image files, 4 actions and unlock condition retained

두 버전은 fixture·background/camera asset·locale·initial state·task goal·viewport/DPR/zoom·input·capture milestone이 같아야 한다. 상태 화면의 숫자가 다르면 같은 milestone인지 먼저 확인한다. 조작 계약이 바뀌면 시각 교정 효과와 섞지 말고 별도 change ledger에 기록한다.


**동등성 미검증 항목과 변경표**

- Art fixture IDs는 위에 정의했으나 실제 파일·hash는 아직 없다. 구현 revision과 capture도 없다. 데이터 고정과 동등 전후 검증 통과를 구별한다.
- 허용: 외곽·재료·글자·간격·배치·상태 표현. 불허: 과제 목표·숫자·비용·선택 항목·hold duration·실행 의미를 몰래 바꾸기.

### 구현 후 검사할 항목

- GCTRL2:T:BATTLEFIELD:01 [not_run]: 초점을 chapter 2로 옮겨도 selected index 1이 확정 실행 전까지 유지된다
- GCTRL2:T:BATTLEFIELD:02 [not_run]: locked chapter의 해금 조건과 inspect 가능 여부가 명시된다
- GCTRL2:T:BATTLEFIELD:03 [not_run]: Tile image/color가 바뀌어도 title text는 판독된다
- GCTRL2:T:BATTLEFIELD:04 [not_run]: 같은 chapter/image content로 before와 after를 캡처하고 crop revision을 고정한다
- GCTRL2:T:BATTLEFIELD:05 [not_run]: 모든 action이 keyboard/controller로 접근 가능하고 좌우 graph가 화면 순서와 맞는다
- GCTRL2:T:BATTLEFIELD:06 [not_run]: 짧은/긴 한글 chapter title에서 row 높이와 command legend가 충돌하지 않는다

### 적용하지 않을 때와 권리

- 선택 상태의 white fill를 모든 장르의 공통 정답으로 만들지 않는다
- 스토리 tile가 적은 selector에 적합하다. 수백 item inventory에는 다른 밀도와 검색 구조가 필요하다
- 이미지가 정체성이 아닌 text-heavy task를 cinematic tiles로 바꾸지 않는다
- 원본 이미지는 위 link로만 참조한다. 공개 재배포 허락은 확인되지 않았다. 자체 시안은 generic labels/data/art를 사용하고 상표·캐릭터·원본 shape artwork·font를 복사하지 않는다.
- 실제 usability 향상·시간 감소·오류 감소를 측정하지 않았으므로 그런 효과 수치를 제시하지 않는다.

기존 연결: AS:V01, AS:V02, AS:V03, AS:V08, AS:AS18, AS:AS27, UX:R-CTRL-01, UX:R-LOCALE-01

## GCTRL2:C:TINTIN · 만화 퍼즐: 종이·잉크의 가족성과 판독 가능한 작은 조작

**맞는 맥락** bright illustrated puzzle / comic adventure. Cream panels와 rounded controls도 만화 장면의 stroke/material에 연결하면 타당하다.

### 제작자 설명 C

- 원저자는 Hergé 만화의 정체성을 casual mobile puzzle로 옮기려 했다고 밝히며 UI montage와 panels/buttons sheet를 공개한다. Screens는 Magdalena Chojnowska와 함께한 작업으로 표시한다.

[GCTRL2:S07: Tintin Match Game Art & UI](https://tobitobot.artstation.com/projects/d8zDQe)

### 공개 시각 사례 O

- [GCTRL2:IMG06 · Tintin Match panel and button asset sheet](https://cdna.artstation.com/p/assets/images/images/042/289/406/large/paul-filippow-ui-gameart-ui.jpg?1634093018): cream paper, 일정한 어두운 외곽선, 접히거나 찢긴 paper variants, 제한된 pastel panels, raised/flat-looking button variants, X/back glyph. 나란한 자산이 idle/press 순서인지 원문에서 명명하지 않는다.
- [GCTRL2:IMG07 · Tintin Match level / shop / settings screens](https://cdna.artstation.com/p/assets/images/images/042/275/740/large/paul-filippow-ui-gameart.jpg?1634057890): 레벨 입장 종이 패널 아래 녹색 PLAY, 닫기 X의 작은 cream control, language list의 selected green row, 같은 paper/ink outline family가 확인된다.

- cream paper와 dark ink outline, raised/flat-looking controls가 한 sheet에 있고 level popup의 green PLAY, 작은 cream X와 language list의 selected green row가 그 가족 안에 있다. Unlabelled variant를 실제 pressed state라고 단정하지 않는다.

### 실패 시안 P

가상 만화 puzzle: hand-drawn map 위 유리 modal, neon blue Play, 3D chrome gear, 연필 느낌의 Back. 각 button 따로는 예쁘지만 outline/광원/재료가 다르고 level 정보보다 설명 paragraph가 크다.

### 구체적 교정 지시 P

**외곽과 공통 부품** Panel은 6px radius rectangle, 종이 접힌 모서리는 header의 한 곳에만 둔다. Text button은 10px radius와 같은 2px ink outline, close/back은 같은 family의 square control로 만든다. 매 container마다 random torn edges를 넣지 않는다.

**재료와 광원** Cream paper face + 짧고 단단한 lower shadow를 사용한다. Label 영역에 grain을 넣어 작은 글자를 흐리지 않는다. Green은 이 시안에서 playable/selected role에 한정하고 모든 작은 settings까지 다른 candy colors로 칠하지 않는다. Illustration의 ink 색·stroke를 UI outline에 맞춘다.

**글자와 아이콘** 390×844 CSS 시안에서 level title 22px/700, goals/body 16px/500, Play 18px/700를 시험한다. Thick frame 안에 thin generic web icons를 넣지 않고 같은 stroke·optical mass의 24px glyph를 새로 그린다. X/back은 label 또는 accessible name을 가진다.

**위치와 위계** level number→goals→move limit→boosters→Play 순서로 쌓는다. 핵심 Play 아래에 중복 조작 안내를 붙이지 않는다. Close는 header trailing position, Play는 bottom central anchor. Read-only stars/energy는 button보다 덜 돌출된 surface로 둔다.

**크기와 입력** 390×844에서 320px popup width, Play 240×52, close 28px visible/44×44 target, target 간 8px gap을 시안으로 쓴다. 긴 goals에는 panel 높이를 늘리거나 body만 scroll하고 footer Play를 유지한다. Artwork 전체를 줄여 target까지 작아지게 만들지 않는다.

**상태 계약**

- idle: paper/ink rim와 restrained lower shadow.
- focus: inner dark outline + 작은 inward indicator; green fill 자체와 별도.
- pressed: lower shadow가 3px에서 1px로 줄고 내부 face만 2px 내려감. outer target bounds 유지.
- selected_booster: check glyph + selected rim; 비용 수치는 그대로 보임.
- disabled_play: locked glyph와 부족한 생명 이유, Play label 유지; 회색 작은 text만 남기지 않음.
- close: Play와 같은 family이나 밝은 cream small control; danger semantics를 임의로 추가하지 않음.

### 동일 콘텐츠 전후 명세 P

Pair GCTRL2:PAIR:TINTIN · fixture GCTRL2:F:TINTIN · 상태 specified_not_implemented

Fixture SHA-256: 4a5ae11b138fc46cf8772c2d0019eac44b23a2e1fc5e09a81ce8d827ec882f82

환경: 390×844 CSS px, DPR 1, zoom 100%, ko-KR, touch

핵심 과제: 레벨 목표와 이동 제한을 확인하고 플레이를 시작한다

**고정 데이터**

```json
{
  "fixture_id": "GCTRL2:F:TINTIN",
  "viewport_css": [
    390,
    844
  ],
  "dpr": 1,
  "zoom_percent": 100,
  "locale": "ko-KR",
  "input_mode": "touch",
  "task": "레벨 목표와 이동 제한을 확인하고 플레이를 시작한다",
  "level": 24,
  "goals": [
    {
      "item": "편지",
      "count": 12
    },
    {
      "item": "나침반",
      "count": 8
    }
  ],
  "move_limit": 22,
  "lives": 3,
  "boosters": [
    {
      "name": "망원경",
      "available": 1,
      "selected": false
    },
    {
      "name": "지도",
      "available": 0,
      "selected": false
    }
  ],
  "actions": [
    "플레이",
    "닫기",
    "부스터 선택"
  ],
  "initial_state": "level_popup_ready",
  "capture_states": [
    "ready",
    "booster_selected",
    "pressed_play",
    "no_lives_disabled",
    "closed"
  ],
  "art_fixture": {
    "ids": [
      "generic_comic_map_v1",
      "generic_letter_icon_v1",
      "generic_compass_icon_v1"
    ],
    "description": "자체 만화 map/icons. Tintin 캐릭터·logo·source geometry를 복제하지 않음",
    "asset_sha256": null,
    "status": "required_to_create_or_resolve_before_implementation; not_available_yet"
  }
}
```

**Before P**

- layout: same 320px popup bounds; title/goals/moves/boosters/actions; decorative paragraph repeats action
- controls: glass panel, neon Play, metallic settings, paper back; same required data
- data_policy: 동일 level/goals/move limit/lives/boosters

**After P**

- layout: same panel bounds initially; clear vertical hierarchy, redundant paragraph removed with deletion ledger; all decision facts preserved
- controls: paper/ink family, 240×52 Play; consistent close and booster slots
- data_policy: same exact values and task. Explanatory copy deletion is listed; no fact removed

두 버전은 fixture·background/camera asset·locale·initial state·task goal·viewport/DPR/zoom·input·capture milestone이 같아야 한다. 상태 화면의 숫자가 다르면 같은 milestone인지 먼저 확인한다. 조작 계약이 바뀌면 시각 교정 효과와 섞지 말고 별도 change ledger에 기록한다.


**동등성 미검증 항목과 변경표**

- Art fixture IDs는 위에 정의했으나 실제 파일·hash는 아직 없다. 구현 revision과 capture도 없다. 데이터 고정과 동등 전후 검증 통과를 구별한다.
- 허용: 외곽·재료·글자·간격·배치·상태 표현. 불허: 과제 목표·숫자·비용·선택 항목·hold duration·실행 의미를 몰래 바꾸기.
- 삭제 문장: “아래 플레이 버튼을 눌러 이 레벨의 퍼즐 플레이를 시작할 수 있습니다.” 실행 의미는 같은 플레이 label로 보존하며 목표·이동·생명·조건은 삭제하지 않는다.

### 구현 후 검사할 항목

- GCTRL2:T:TINTIN:01 [not_run]: 두 버전 모두 level 24, 목표 12/8, 이동 22, 생명 3, booster availability가 보인다
- GCTRL2:T:TINTIN:02 [not_run]: Touch pressed에서 target이 움직여 pointer release를 놓치지 않는다
- GCTRL2:T:TINTIN:03 [not_run]: No-lives 상태의 이유가 hover 없이 보이며 close는 계속 작동한다
- GCTRL2:T:TINTIN:04 [not_run]: booster selected와 disabled booster가 다른 static signal을 가진다
- GCTRL2:T:TINTIN:05 [not_run]: 긴 한글 목표·large text setting에서 Play가 화면 밖으로 밀려나지 않는다
- GCTRL2:T:TINTIN:06 [not_run]: 같은 map/art/fixture로 캡처하고 새 캐릭터·색깔까지 바꿔 개선으로 주장하지 않는다

### 적용하지 않을 때와 권리

- 둥근 버튼을 금지하는 교정이 아니다. 만화의 outline/material과 맞는지 판단한다
- 원본 paper geometry와 branded assets는 복제하지 않고 자체 generic art로 만든다
- text-heavy factory screen에 넓은 paper card와 큰 Play를 그대로 적용하지 않는다
- 원본 이미지는 위 link로만 참조한다. 공개 재배포 허락은 확인되지 않았다. 자체 시안은 generic labels/data/art를 사용하고 상표·캐릭터·원본 shape artwork·font를 복사하지 않는다.
- 실제 usability 향상·시간 감소·오류 감소를 측정하지 않았으므로 그런 효과 수치를 제시하지 않는다.

기존 연결: AS:V01, AS:V03, AS:V04, AS:V07, AS:AS18, UX:R-COM-02, UX:R-COM-05, UX:R-PUZZLE-01

## GCTRL2:C:HARDHEAD · 카툰 전략: 두꺼운 돌출면·채도를 유지하면서 비용과 역할을 정돈

**맞는 맥락** exaggerated cartoon base-building / hero strategy. Physical-toy-like surfaces가 캐릭터/model과 맞을 때 bevel·gradient를 없애는 대신 규칙화한다.

### 제작자 설명 C

- 원저자는 UX/UI flow, layout, visuals와 Unity implementation을 담당했고 나중에 art direction도 맡았다고 설명한다. Button sheet와 여러 menu/popup을 직접 제공한다.

[GCTRL2:S08: Hard Head Squad UI/UX](https://cenildon.artstation.com/projects/lR89oO)

### 공개 시각 사례 O

- [GCTRL2:IMG08 · Hard Head Squad button asset sheet](https://cdna.artstation.com/p/assets/images/images/052/775/068/large/cenildon-muradi-13.jpg?1660651034): clipped-corner polygons와 가로 버튼, 두꺼운 pale rim, 아래로 돌출된 purple/colored side face, vivid face gradients가 반복된다. 자산 색의 실제 기능 mapping과 상태 이름은 sheet만으로 확정할 수 없다.
- [GCTRL2:IMG09 · Hard Head Squad building-information popup](https://cdnb.artstation.com/p/assets/images/images/052/775/123/large/cenildon-muradi-3.jpg?1660651149): 좌측 건물 model, 우측 requirements와 checkmarks, 아래 두 action controls. 하단 button 형상이 sheet family와 맞는다. 이 screenshot의 cost presentation을 좋은 거래 안내로 평가하지 않는다.

- Button sheet는 clipped-corner polygon, bright face gradient, thick light rim과 lower side face를 반복한다. Building popup은 left model/right requirements/bottom actions로 나눈다. 색의 기능 mapping·실제 state system은 sheet에서 확정하지 않는다.

### 실패 시안 P

가상 cartoon base builder: 금속 chain frame, soft pill, white outline icon, glossy gem button을 섞고 비용 줄은 버튼 아래 작은 회색 글자다. Model보다 8개 color CTA가 커서 어떤 upgrade를 고르는지 흐리다.

### 구체적 교정 지시 P

**외곽과 공통 부품** 이 시안은 가로 action에는 8px clipped corner, square utility에는 같은 clipped grammar를 쓴다. 별도 floating polygon을 매 control에 생성하지 않는다. outer rim·face·lower extrusion을 세 layers로 분리하고 shared caps + stretch center로 늘린다.

**재료와 광원** upper-left highlight와 4px lower extrusion이라는 한 light direction을 유지한다. Face gradients는 남기되 최대 밝기 변화·rim contrast를 전체 family에서 같이 조절한다. 비용/필수 요구사항이 반사광에 묻히면 local flat label area를 둔다. 과한 glow는 선택 상태에 필요한 경우만 쓴다.

**글자와 아이콘** 1280×720 CSS에서 heading 24px/700, requirement 18px/600, action 18px/700를 시험한다. English condensed italic을 한글에 억지로 적용하지 않는다. Cost 숫자는 tabular, currency icon 22px silhouette와 동일 baseline. Gem/coin의 모양을 장식으로 모호하게 바꾸지 않는다.

**위치와 위계** left model은 결과 확인, right requirements는 의사결정, footer actions는 실행 역할로 둔다. Upgrade의 비용·소요 시간은 button label block 바로 옆 또는 안에 충분한 크기로 둔다. Cosmetic secondary action과 즉시 완료를 같은 primary weight로 만들지 않는다. Paid shortcut을 만들 필요 없는 fixture를 사용한다.

**크기와 입력** 1280×720 popup 920×440, primary 232×56, secondary 176×48, action gap 16, inside inset 24를 trial로 둔다. Rim과 extrusion을 높이에 포함해 text room을 계산한다. Touch에서는 작은 polygon utility의 visible art와 hitbox를 따로 정해 인접 click 영역 중첩을 검사한다.

**상태 계약**

- idle: 4px lower extrusion, base gradient, readable cost block.
- focus: pale inset rim + inward marker; 영구 full glow는 없음.
- pressed: lower extrusion이 1px로 줄고 face/label 3px 아래; outer target stays fixed.
- disabled: extrusion 감소, lock marker + 요구 조건 missing row. 비용·label은 계속 읽힘.
- selected: variant 선택은 check/swatch marker와 outline, 실행 시작과 구분.
- in_progress: upgrade countdown와 진행 label; 다시 누르기가 중복 지출로 이어지지 않는다.

### 동일 콘텐츠 전후 명세 P

Pair GCTRL2:PAIR:HARDHEAD · fixture GCTRL2:F:HARDHEAD · 상태 specified_not_implemented

Fixture SHA-256: 1a134e20e1d9528deb2954fec850178ea1928ca228f7a5ef13422564b2163bd4

환경: 1280×720 CSS px, DPR 1, zoom 100%, ko-KR, touch

핵심 과제: 요구 조건과 자원 비용을 확인한 뒤 건물을 업그레이드한다

**고정 데이터**

```json
{
  "fixture_id": "GCTRL2:F:HARDHEAD",
  "viewport_css": [
    1280,
    720
  ],
  "dpr": 1,
  "zoom_percent": 100,
  "locale": "ko-KR",
  "input_mode": "touch",
  "task": "요구 조건과 자원 비용을 확인한 뒤 건물을 업그레이드한다",
  "building": "관측소",
  "current_level": 2,
  "next_level": 3,
  "requirements": {
    "본부 레벨": 3,
    "식량": 2400,
    "보급품": 1800
  },
  "available": {
    "본부 레벨": 3,
    "식량": 4000,
    "보급품": 2300
  },
  "duration_seconds": 90,
  "actions": [
    "업그레이드",
    "외관 보기",
    "닫기"
  ],
  "initial_state": "all_requirements_met",
  "capture_states": [
    "idle",
    "focus_upgrade",
    "pressed_upgrade",
    "in_progress_45_seconds",
    "food_missing_disabled"
  ],
  "art_fixture": {
    "ids": [
      "generic_observatory_model_v1"
    ],
    "description": "자체 cartoon observatory render. 두 시안에서 lighting/camera/model revision 동일",
    "asset_sha256": null,
    "status": "required_to_create_or_resolve_before_implementation; not_available_yet"
  }
}
```

**Before P**

- layout: same popup/data/model; eight decorative CTA-like controls compete, actual Upgrade and View skin included
- controls: mixed pill/chrome/gem family; requirement labels tiny
- data_policy: same upgrade values, duration, no premium purchase

**After P**

- layout: popup x=180,y=140,w=920,h=440; left model region 344, right data region 488; footer contains only functional actions
- controls: clipped shared family; 232×56 Upgrade with adjacent food/supply cost + 90초; secondary 176×48
- data_policy: same fixture, remove only nonfunctional decorative control frames; no payment or new shortcut

두 버전은 fixture·background/camera asset·locale·initial state·task goal·viewport/DPR/zoom·input·capture milestone이 같아야 한다. 상태 화면의 숫자가 다르면 같은 milestone인지 먼저 확인한다. 조작 계약이 바뀌면 시각 교정 효과와 섞지 말고 별도 change ledger에 기록한다.


**동등성 미검증 항목과 변경표**

- Art fixture IDs는 위에 정의했으나 실제 파일·hash는 아직 없다. 구현 revision과 capture도 없다. 데이터 고정과 동등 전후 검증 통과를 구별한다.
- 허용: 외곽·재료·글자·간격·배치·상태 표현. 불허: 과제 목표·숫자·비용·선택 항목·hold duration·실행 의미를 몰래 바꾸기.

### 구현 후 검사할 항목

- GCTRL2:T:HARDHEAD:01 [not_run]: 식량 2400/4000, 보급품 1800/2300, 본부 레벨 3과 90초가 주행동 주변에서 읽힌다
- GCTRL2:T:HARDHEAD:02 [not_run]: 베벨/돌출면이 56px 안의 text area와 긴 label을 침범하지 않는다
- GCTRL2:T:HARDHEAD:03 [not_run]: Pressed visual과 hitbox가 다른 방향으로 움직이지 않는다
- GCTRL2:T:HARDHEAD:04 [not_run]: 부족한 자원 상태에서 해당 requirement row와 disabled action을 함께 파악할 수 있다
- GCTRL2:T:HARDHEAD:05 [not_run]: 실행 후 자원은 한번만 감소하고 in-progress 상태는 중복 Upgrade 입력을 막는다
- GCTRL2:T:HARDHEAD:06 [not_run]: Color만 제거해도 focus/disabled/in-progress를 각 glyph·label로 구별한다

### 적용하지 않을 때와 권리

- 강한 gradient·bevel·채도가 이 자체로 slop의 증거는 아니다
- Rovio sheet의 색을 purple=premium 같은 의미로 단정하지 않는다
- 실제 screenshot의 gem 구매 또는 비용 presentation을 좋은 거래 UX라고 권고하지 않는다
- 게임경제·가격·과금 모델을 바꾸는 작업은 이 시각 교정 범위 밖이다
- 원본 이미지는 위 link로만 참조한다. 공개 재배포 허락은 확인되지 않았다. 자체 시안은 generic labels/data/art를 사용하고 상표·캐릭터·원본 shape artwork·font를 복사하지 않는다.
- 실제 usability 향상·시간 감소·오류 감소를 측정하지 않았으므로 그런 효과 수치를 제시하지 않는다.

기존 연결: AS:V01, AS:V02, AS:V03, AS:V04, AS:V08, AS:AS18, AS:AS19, UX:R-COM-05, UX:R-LOCALE-01

## GCTRL2:C:VICTORIA · 역사 전략: 장식은 제목·외곽에, 반복 정보와 결정은 정렬로

**맞는 맥락** historical grand strategy / text-rich simulation. Ornate identity를 살리면서 dense information와 action rank를 분리하는 경우.

### 제작자 설명 C

- 공식 art director diary는 map/illustration과 어울리는 palette, 지나치게 무겁지 않은 ornate interface, 중요한 결정과 button의 order of importance를 설명한다. 제공된 Politics image에는 WIP 표기가 있다.

[GCTRL2:S09: Dev Diary #49 — Graphic Overview](https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-49-graphic-overview)

### 공개 시각 사례 O

- [GCTRL2:IMG10 · Victoria 3 WIP Politics panel from official diary](https://images.ctfassets.net/u73tyf0fa8v1/4rEzc9W9FN52tZhGaBD5oC/173a0ed1a2e1d07b5888e7ddc0b17fb8/2.jpg?w=1080&q=75&fm=webp): burgundy title band, 얇은 gold outline, restrained scrollwork, dense party rows, 낮은 좌측 Reform Government button. WIP 표기가 보인다.

- Burgundy title strip와 gold outline/scrollwork가 identity를 담당하고 반복 party rows는 비교적 얇은 경계로 정돈된다. Reform Government action은 화면 아래의 별도 영역이다. 이 historical still의 작은 글자를 현재 제품의 적정 크기라고 판단하지 않는다.

### 실패 시안 P

가상 역사 strategy: 모든 faction 카드에 금 장식·crest·caption·bright CTA를 붙여 비교 숫자가 제각각 위치에 있다. 주행동 정부 개편은 일반 tab처럼 작고, 정보 row는 button처럼 돌출되어 클릭 범위가 불분명하다.

### 구체적 교정 지시 P

**외곽과 공통 부품** 큰 frame의 corner flourish 한 종류, title band 한 종류, compact data row 한 종류로 나눈다. Tab은 얕은 lip와 active marker, confirm은 unmistakable framed rectangle. 모든 faction row에 elaborate plaque를 쓰지 않는다.

**재료와 광원** muted burgundy/aged gold를 header와 selected tabs에 제한하고 data surface는 dark slate로 안정시킨다. Ornament line은 value columns나 hitbox 안으로 들어오지 않는다. Low-contrast antiqued text를 분위기라는 이유로 허용하지 않는다.

**글자와 아이콘** 1600×900 CSS 시안: display heading만 26px의 승인된 serif, body/data 18px/400 gothic, key values 18px/600 tabular. 한글 지원 없는 ornamental face를 본문에 강제하지 않는다. Faction glyph 28px와 numerical columns는 같은 baseline에 맞춘다.

**위치와 위계** 현재 government와 candidate factions는 고정된 column order로 비교한다. Reform action은 읽기전용 legitimacy value와 분리한 persistent footer에 두고 바뀔 결과는 가까이 둔다. Inline inspect affordance와 reform execute button을 같은 raised surface로 처리하지 않는다.

**크기와 입력** 1600×900에서 panel 1360×720, four tab row 44px, data row minimum 64px, footer action 240×48은 trial. 작은 화면은 faction 비교 column을 보존하는 narrow mode/scroll view를 별도 설계하며 text를 일괄 축소하지 않는다.

**상태 계약**

- idle: data rows calm, action distinct bordered face.
- focus: inner high-contrast line + marker. border flourish 자체가 focus signal은 아님.
- active_tab: underline/active lip + label weight; hover/focus와 별도.
- selected_faction: check + selected row rail; reform result commit과 구분.
- disabled_reform: unmet condition text near command; close/back still available.
- pressed: small internal tone/inset change; table column alignment stays fixed.

### 동일 콘텐츠 전후 명세 P

Pair GCTRL2:PAIR:VICTORIA · fixture GCTRL2:F:VICTORIA · 상태 specified_not_implemented

Fixture SHA-256: 09271bf4f25ad3854e40fd3e83331640ebbaa625037b30f582404e2dc5c4f952

환경: 1600×900 CSS px, DPR 1, zoom 100%, ko-KR, mouse_keyboard

핵심 과제: 세 집단의 수치와 정부 개편 결과를 비교한 뒤 개편을 확정한다

**고정 데이터**

```json
{
  "fixture_id": "GCTRL2:F:VICTORIA",
  "viewport_css": [
    1600,
    900
  ],
  "dpr": 1,
  "zoom_percent": 100,
  "locale": "ko-KR",
  "input_mode": "mouse_keyboard",
  "task": "세 집단의 수치와 정부 개편 결과를 비교한 뒤 개편을 확정한다",
  "government": "입헌군주제",
  "legitimacy_current": 42,
  "legitimacy_preview": 58,
  "factions": [
    {
      "name": "상공인",
      "support_percent": 18.4,
      "approval": 2,
      "selected": true
    },
    {
      "name": "농업인",
      "support_percent": 24.8,
      "approval": -1,
      "selected": false
    },
    {
      "name": "노동자",
      "support_percent": 12.2,
      "approval": 4,
      "selected": true
    }
  ],
  "actions": [
    "정부 개편",
    "취소",
    "집단 상세"
  ],
  "initial_state": "reform_preview",
  "capture_states": [
    "preview",
    "focus_reform",
    "pressed_reform",
    "reform_completed",
    "condition_unmet"
  ],
  "art_fixture": {
    "ids": [
      "generic_faction_glyphs_v1",
      "generic_muted_map_v1"
    ],
    "description": "자체 faction glyphs/map. 실제 정치 집단/상표 portrait 미사용",
    "asset_sha256": null,
    "status": "required_to_create_or_resolve_before_implementation; not_available_yet"
  }
}
```

**Before P**

- layout: same factions/values; each plaque random layout and oversized crest; Reform hidden among tabs
- controls: every row looks raised/clickable; main action no separate footer
- data_policy: same percentages/approval/preview result

**After P**

- layout: panel x=120,y=90,w=1360,h=720; header 68; tabs 44; stable faction columns; footer y=738,h=72
- controls: thin data rails, one ornate title frame, 240×48 Reform with adjacent legitimacy 42→58
- data_policy: same exact values/selected factions/task; no political choice made for user

두 버전은 fixture·background/camera asset·locale·initial state·task goal·viewport/DPR/zoom·input·capture milestone이 같아야 한다. 상태 화면의 숫자가 다르면 같은 milestone인지 먼저 확인한다. 조작 계약이 바뀌면 시각 교정 효과와 섞지 말고 별도 change ledger에 기록한다.


**동등성 미검증 항목과 변경표**

- Art fixture IDs는 위에 정의했으나 실제 파일·hash는 아직 없다. 구현 revision과 capture도 없다. 데이터 고정과 동등 전후 검증 통과를 구별한다.
- 허용: 외곽·재료·글자·간격·배치·상태 표현. 불허: 과제 목표·숫자·비용·선택 항목·hold duration·실행 의미를 몰래 바꾸기.

### 구현 후 검사할 항목

- GCTRL2:T:VICTORIA:01 [not_run]: 세 faction의 이름/support/approval이 두 버전 동일 column에서 비교된다
- GCTRL2:T:VICTORIA:02 [not_run]: Legitimacy 42→58가 button 바로 근처에서 읽히고 current/preview 의미가 구별된다
- GCTRL2:T:VICTORIA:03 [not_run]: 행 inspect와 government reform execute의 clickable surface가 구별된다
- GCTRL2:T:VICTORIA:04 [not_run]: 긴 한글 faction name, missing portrait, numerical width changes에 column order가 유지된다
- GCTRL2:T:VICTORIA:05 [not_run]: 200% text setting에서 confirm/cancel와 result preview를 동시에 접근할 수 있다
- GCTRL2:T:VICTORIA:06 [not_run]: Ornament를 숨겨도 active tab/focus/selected markers가 남는다

### 적용하지 않을 때와 권리

- 역사 UI는 무조건 parchment/serif여야 한다는 규칙이 아니다
- 출처의 2022 WIP screenshot을 현재 Victoria 3의 평가로 쓰지 않는다
- dense 전략 정보의 압축은 가능하지만 핵심 숫자의 판독을 포기할 근거는 아니다
- 원본 이미지는 위 link로만 참조한다. 공개 재배포 허락은 확인되지 않았다. 자체 시안은 generic labels/data/art를 사용하고 상표·캐릭터·원본 shape artwork·font를 복사하지 않는다.
- 실제 usability 향상·시간 감소·오류 감소를 측정하지 않았으므로 그런 효과 수치를 제시하지 않는다.

기존 연결: AS:V01, AS:V02, AS:V04, AS:V08, AS:V09, AS:AS18, AS:AS22, UX:R-COM-05, UX:R-LOCALE-01

## 바로 적용할 공통 교정 계약

### GCTRL2:R01 · 기본 button template 대신 역할별 surface grammar를 정한다

명령·읽기전용 수치·선택 가능한 대상·navigation의 외곽 및 relief를 같은 sheet에서 비교한다. 장식과 hitbox를 구분한다.

### GCTRL2:R02 · 재료·광원·외곽선을 state family와 함께 지정한다

idle만 완성하지 않는다. Rim/face/extrusion/label의 토큰과 상태 변화 범위를 먼저 정의하고 버튼마다 새 texture를 만들지 않는다.

### GCTRL2:R03 · 버튼 전체 크기와 label room을 별도로 기록한다

outer height에서 rim/extrusion/padding을 뺀 usable face를 실제 longest label로 확인한다. Visible art와 target bounds도 별도로 기록한다.

### GCTRL2:R04 · focus·selected·pressed·committed는 다른 뜻이다

같은 accent를 재사용해도 static marker와 text로 state meaning을 구분한다. hover-only label과 영구 glow를 필수 신호로 삼지 않는다.

### GCTRL2:R05 · 진행·자원 비용·조건을 action과 시각적으로 묶는다

멋을 위해 cost/reason를 작게 바깥에 내보내지 않는다. 실행전과 진행중·완료후의 동일 milestone captures를 고정한다.

### GCTRL2:R06 · 금지어가 아니라 장르와 task로 시각 방향을 선택한다

rounded paper puzzle, chunky colorful strategy, restrained cinematic selector, industrial tool, holographic terminal, ornate historical panel 중 현재 product art/task에 맞는 grammar를 고른다. 재료 이름이나 색을 universal rule로 복사하지 않는다.

## 제출 전에 만들 비교판

1. Before/after의 fixture SHA-256를 같은 값으로 저장한다. 화면에 필요한 data·images·labels·camera·locale·initial state를 함께 고정한다.
2. idle·hover 가능한 입력·focus·pressed·selected·disabled·progress·completed의 contact sheet를 만든다. 빠진 상태는 이유를 기록한다.
3. 상태별 outer bounds, target bounds, text-face bounds, actual computed/engine text size, baseline, icon size와 gap을 기록한다. Source artwork의 pixel 수와 CSS/engine units를 섞지 않는다.
4. 실제 크기·최소 지원 화면·긴 한글·텍스트 확대·어두움/밝음/복잡한 background로 판독한다. 판독 검사는 축소 인상평가로 대체하지 않는다.
5. Button family와 gameplay/model/illustration을 같은 장면에 놓고 shape·outline·material·light·type가 서로 설명되는지 판단한다.
6. 각 pair의 핵심 task와 cancel/back·failure·progress·completion을 실행한다. Before도 동일 task를 재현할 수 있어야 한다.
7. 통과는 해당 revision의 화면·상태·input 증거에 연결한다. 컴파일 성공이나 이 문서 작성만으로 RG06–RG08을 pass로 하지 않는다.

## 권리와 provenance ledger

모든 타사 image의 원본 주소, 원저자 attribution, observed 날짜, source version 범위, 재배포 미확인 상태는 JSON의 sources/visuals에 남겼다. 공개 자료라는 사실을 재사용 라이선스로 취급하지 않는다. 공개-ready bundle에는 원본 image bytes 대신 link와 자체 요약만 포함하는 결정이다. 향후 허락이나 적합한 별도 라이선스가 확인되면 해당 파일별로 ledger를 갱신한다. 자체 원고·코드·generic assets의 라이선스는 여기서 임의로 정하지 않았다.

접근 한계: Victoria 3 Dev Diary #30 forum 경로는 텍스트 수집에서 client challenge를 반환했다. 해당 원문 내용을 직접 읽었다고 주장하지 않고 접근 가능한 공식 #49와 렌더된 공식 image를 사용했다. Destiny GDC PDF는 web fetch의 용량 제한으로 열리지 않았고 최종 사례에 포함하지 않았다. 이 실패는 원문에서 얻지 못한 내용을 추정할 근거가 아니다.

## 자료 연결과 완료 경계

- game_controls_corrections_v2.json: source·image·case·fixture·pair·rule·test를 namespace ID로 연결한 구조화 자료
- 기존 AS:V01–V04: 각 case가 새로운 구체화와 source evidence를 제공하지만 기존 원칙을 삭제하거나 강제로 대체하지 않음
- RG02/03: source/proposal 구분 및 link-only rights decision을 추가
- RG06/07/08: 구현용 전후 contract와 36개 case-specific + 8개 공통 검사 명세를 추가. 전부 not_run
- RG11: 사용자 review/설치/게시 승인으로 승격하지 않음

이번 pass의 완료 조건인 여섯 original-creator cases, 실제 본 시각 사례, 구체적 correction instructions, 동일-content specifications, provenance/rights notes와 valid JSON은 작성했다. 다음 실제 결과는 승인된 좁은 example을 같은 fixture로 구현하고 render/input regression 및 사용자 시각 검수를 마친 뒤에야 확인할 수 있다.
