# 고정 대상 능력·행동 조작 · G04

범위: 현재 장면에서 능력/행동 버튼을 고르고 기존 실행 경로로 고정 대상 또는 자신에게 적용하는 action bar와 일시정지/복귀 조작. 정규 purpose는 game.action_controls다. 손패/덱/카드 대상 선택, 장비 비교, 퍼즐 보드, 전투 경제·전체 HUD/카메라 재설계는 이 분기가 아니다. 직사각형 버튼이나 카드형 배치만으로 card-execution을 선택하지 않는다. 제품이 즉시 실행이면 즉시 실행을 보존하고, 선택 후 실행이면 그 계약을 보존한다.

## 먼저 보호할 조작 계약

- 능력 선택, 탐색 focus, 물리적 pressed, 실행 완료를 구별한다. 선택만으로 비용/피해가 발생하는지, 별도 commit인지 소스/실제 입력으로 확인하고 unknown을 임의로 채우지 않는다
- 고정 적 대상과 자기 치유의 적용 대상을 보존한다. 대상 선택 단계·턴 종료·선택 취소 버튼을 새로 만들지 않는다. Escape가 pause이면 취소로 바꾸지 않는다. 반복 키/버튼의 중복 실행 여부는 실제 입력 시험 전까지 미검증이다
- 능력 ID/order/shortcut, 이름·효과·비용·보유량, 현재/최대 자원, 사용 불가 이유, 대상 이름/체력, 행동 수, 결과, 선택/정지 상태를 보존한다. 시각적 단순화로 비용/부족 이유를 tooltip에 숨기지 않는다

## 화면에 증상이 있을 때만 내리는 교정 명령

1. 조형 가족 (AS:V01, GCTRL2:R01/R02): 장면과 ability/execute/pause에서 외곽, rim/face/extrusion, 재료, 광원 방향, icon fill/stroke, label baseline, 역할별 accent를 기록한다. 설명할 수 없는 혼용이 실제로 보이면 해당 token만 기존 가족에 맞춘다. 모든 버튼을 동일하게 꾸미지 말고 반복 능력/commit/system 역할 차이를 공통 grammar 안에서 둔다. 금속·유리·종이·그라데이션·장식은 장르 근거가 있으면 유지한다
2. 위치/크기 (AS:V02, GCTRL2:R03/R05): ability 묶음과 선택 상세/실행을 인접한 결정 영역으로 유지하고 pause는 기존 system 위치에서 찾을 수 있게 둔다. 자원/적 체력 같은 읽기전용 정보를 클릭 가능한 bevel로 오인시키는 증상이 있으면 프레임 역할을 조정한다. 실제 scene occlusion과 usable label face, hitbox를 각각 측정한다. 좁은 프레임에서 겹침이 확인될 때만 같은 정보를 reflow하고 삭제 뒤 남는 고정 공간도 정리한다. 보편 높이·점유율 수치를 만들지 않는다
3. 상태 (AS:V03, GCTRL2:R04): idle은 조용한 기준, focus는 현재 탐색 위치, selected는 실행 대기, pressed는 입력 피드백, unavailable은 이유가 남는 사용 불가 상태로 명세한다. focus와 selected가 동시에 존재할 수 있게 한다. 기존 아트에 맞는 outline/marker/명암과 상태 문구를 쓰고 색만으로 의미를 합치지 않는다. pressed는 face 내부만 움직이며 바깥 hitbox·형제 위치·라벨 기준선은 안정시킨다. completed는 실제 결과/자원 상태로 남기고 selected glow를 성공 증거로 쓰지 않는다
4. 아이콘/글자 (AS:V04): 실제 렌더 크기에서 icon 획/면적/모서리와 rim, 글자 무게/기준선/내부 여유를 검사한다. 벡터 해상도와 작은 크기 판독성을 구분한다. 긴 이름/효과/비용/보유량/이유가 겹친다면 해당 .ability 텍스트를 정상 흐름의 별도 행으로 재배치하고 필요한 높이를 수용한다. 실제 겹침이 없으면 구조 변경을 적용하지 않는다. 선언된 breakpoint와 키/행동 handler는 시각-only 수정에서 고정한다

구체 command 예시 (proposal, 실측 아님): ‘[data-control="frost"]의 이름·효과·비용·state-label을 서로 침범하지 않는 grid 행으로 놓고 공유 ability rim/label inset을 유지한다. “서리 화살”, “피해 13”, “마나 2”, 선택/마나 부족 표시를 모두 남긴다. 기존 select→execute 처리와 열 수는 보존한다. 같은 선택 milestone의 전체/확대 캡처 및 긴 문자열 시험으로 확인한다.’ 원인을 모르는 화면에 이 예시를 무조건 적용하지 않는다.

## 프로젝트 자체 fixture에 적용할 경계

game_controls_same_fixture.html은 이 purpose의 예시다. 파일은 패키지 필수 의존성이 아니며 외부 fixture/HTML/배경을 복사하거나 수정하지 않는다. 사용자가 제공한 위치를 읽었을 때만 사실을 주장한다.

- 기준 데이터: 달그림자 숲 / 가시 수호자, HP 12/20, mana 3/3, enemy HP 26/26, potions 2, actions 0, selectedId null, paused false, outcome “행동 대기”. 강철 베기 damage 8/mana 1, 서리 화살 damage 13/mana 2, 치유 물약 heal 8/potion 1, 천둥 낙하 damage 20/mana 6. 단축키 1–4는 선택, “선택 실행”은 별도 실행, Escape는 pause toggle이다. 적 대상은 고정, 치유 대상은 자신이다. 이것은 해당 fixture의 정적 계약이며 일반 게임 표준이 아니다
- 두 skin은 같은 fixture/markup/동작을 선언하지만 둘 다 조형 규칙을 가진다. weak/corrected 이름·주석으로 A가 나쁘거나 B가 개선됐다고 판정하지 않는다. 열 수·높이·아이콘·재료가 함께 바뀌므로 전체 비교와 재료-only 실험의 결론을 구분한다. 재료 효과를 분리하려면 별도 허가된 specimen에서 geometry/labels/icons/handlers를 고정하고 surface tokens만 바꾼다
- 소스-only는 proposal_only다. 비용과 handler를 소스로 확인해도 장면 통합·겹침·대비·실제 focus/input은 관찰한 것이 아니다. 선언 프레임 560×600/360×660 CSS px는 실제 viewport 실측이 아니며 camera/background pixel 동등성도 정적 데이터로 통과시키지 않는다
- 원래 raw fixture SHA-256 6a9c9a6b741600cba85867e92ee9183d3b196829e8f703859661660905ac7b61와 compact/sorted UTF-8 JSON SHA-256 27342f17a44e2c1eeee2420f8b3543aa0a18e09d9110cf2dc652d2eeb044ae70를 각각 보존한다. 서로 다른 hash 대상/방식이라 이 둘의 차이는 콘텐츠/게임 상태 변경 증거가 아니다. 비교 invariant payload의 hash는 다시 별도다. 정확한 정책은 evidence-contract.json의 hash_policies에 있다

## 필요한 실제 증거와 회귀

- 동일 fixture/initial state/scenario/state milestone, 실제 stage viewport/DPR/zoom/locale/input/camera/asset hashes로 whole-screen과 ability/execute/pause 확대를 캡처한다. default/selected/focus/pressed/unavailable/paused/after-execute를 분리한다
- 선택만 했을 때 자원/피해 불변, steel 실행에서 mana 1/damage 8가 1회 적용, frost에서 mana 2/damage 13가 1회 적용, potion에서 stock 1/HP +8 상한 유지, thunder는 기본 mana 3에서 미실행, pause 동안 미실행/복귀 후 상태 유지가 이 fixture의 예상 계약이다. 반복 키·native click·focus 복구를 별도 입력 trace로 시험한다. 순수 dispatch 검사는 structural이고 browser/input 통과가 아니다
- 긴 실제 번역·200% text setting·작은 지원 프레임·밝거나 복잡한 배경·focus/selected 동시 상태·reduced motion에서 글자/아이콘/이유/결과가 남는지 실제 검사한다. controller는 선언/실행 근거가 있을 때만 다룬다
- 미실행은 not_run, 접근 문제는 blocked. 전체/부분 rendered evidence와 input 결과, 사용자 시각 검토가 없으면 개선/행동 성공/사용자 승인이라고 보고하지 않는다

## 선행 연구의 좁은 근거

AS:V01–V04는 자체 교정 제안이며 효능 실험이 아니다. GCTRL2:S01의 2018 WIP sheet는 공유 widget/state 가족, S02는 객체 곁 조작과 표준 위치의 긴장, S03은 Factorio 1.1 확인/취소 의미 분리를 다룬다. S03의 E/Esc를 이 fixture에 옮기지 않는다. GCTRL2:S04/S05는 SF shape library와 서사에 따른 terminal 재료, S06은 Battlefield의 공통 building blocks, S07은 만화와 종이/잉크 정체성, S08은 강한 gradient/extrusion 가족, S09는 장식/데이터/결정 버튼 위계의 역사적 배경이다. 특정 재료가 보편적으로 우수하다는 증거가 아니다. 이 요약은 기존 조사 기록을 활용하며 이번 실행의 새 브라우저 관찰/현행 제품 검증이 아니다. AS:S23은 입력/정보 대안 배경이다. 필요한 ID만 sources.json에서 찾아 확인한다.
