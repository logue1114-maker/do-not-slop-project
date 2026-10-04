# BKF4 회의실 예약 변경: 동일-fixture 구현 규격

범위: 완전히 가상인 회의실 예약 UI. 로컬 메모리만 사용한다. 실제 예약·결제·메일·캘린더·개인 계정·외부 API와 연결하지 않는다. fixture.json의 금액과 취소 조건은 설명용 가상값이며 원본 서비스 정책이 아니다.

## 동일 상태 계약

양쪽 레이아웃은 BKF4-F01의 같은 객체를 읽는다. fixture 데이터와 선택·기존 예약·기입값·금액·조건은 전후 동일하다. 비교 스크린샷은 selection/review/conflict를 각각 같은 상태로 캡처한다. 전후의 상태 JSON을 정규화해 같은 SHA-256인지 검사한다. 모델을 고치며 정보 자체를 지우지 않는다.

- 메이플 회의실, 정원 6명, 60분 / 회의명 팀 회의, 인원 4명
- 기존: 2026-10-14 10:00–11:00 / 변경안: 2026-10-15 14:00–15:00 / 한국 시간 (UTC+9)
- 24,000원 + 서비스 수수료 2,000원 = 총 26,000원, 세금 포함
- 10월 14일 14:00까지 취소 수수료 0원, 이후 13,000원
- 모든 화면에 작게 ‘가상 데모 · 실제 예약/결제 없음’을 명시

## BKF4-01 selection

Before: 환영 히어로·안내 카드·회의명·인원 같은 확정된 입력을 다시 펼치고 날짜/가용 시간을 아래로 미룬다. 날짜를 눌러야만 빈 날짜라는 사실을 알게 된다. 이는 원본 제품 before 복제가 아니라 의도적으로 만든 결함이다.
After: 제목 ‘예약 시간 변경’ 아래 회의실·정원·60분, 작은 기존 예약 요약을 둔다. 날짜 선택과 실제 가용 시간 버튼을 첫 결정 영역에 둔다. 가용 여부/선택/불가를 글자로 구분하고 색만 쓰지 않는다. 시간이 없는 10/16에는 ‘예약 가능한 시간이 없습니다’와 ‘10/19 보기’를 보여준다. 화면에 UTC+9를 계속 표시한다. 회의명·인원은 보존한 요약으로 두며 ‘변경’으로 입력 화면에 돌아간다.

## BKF4-02 review

Before: ‘거의 완료되었습니다’ 같은 감성 카피와 단계 설명이 상단을 차지한다. 새 시간만 크게 보여주고 기존 시간·총액·취소 조건은 화면 아래의 잡다한 카드에 흩어 둔다. 정보는 같은 DOM에 있으며 삭제하지 않는다.
After: 제목 ‘변경 내용 확인’ 아래 ‘기존’과 ‘변경 후’를 직접 비교한다. 기존에는 취소선을 보조로 쓰되 label은 유지한다. 회의실·기간·시간대·회의명·인원, 비용 내역·총액, 정확한 취소 경계 시점과 이후 수수료를 동일 영역에서 확인한다. primary ‘26,000원 · 변경 확정(데모)’는 금액/조건 뒤에 위치한다. secondary는 ‘시간 다시 선택’, 종료는 ‘변경 취소’로 구별한다. 날짜 변경을 실제로 확정하기 전에는 existing_booking을 바꾸지 않는다.

## BKF4-03 conflict

고정 fixture의 14:00 선택 뒤 ‘가용성 변경 시뮬레이션’을 누르면 확인 시 14:00이 unavailable인 상황을 만든다. After는 ‘14:00은 방금 예약되어 선택할 수 없습니다’와 다음 행동 ‘15:00 선택’을 표시한다. selectedSlot은 invalid 상태로 남겨 무엇이 실패했는지 알리며 확정은 차단한다. 날짜·회의실·회의명·인원·조건은 유지한다. 대체 시간을 사용자 행동 없이 자동 확정하지 않는다. 새 시간 선택 뒤 다시 review한다.

## 상태 전이/불변식

selection → review → confirming → success_local_demo. confirming에서 availability_revision을 재검사한다. stale이면 conflict; 유효하면 existing_booking의 id DEMO-R17을 유지하며 새 시간으로 단일 교체한다. pending 동안 확정 버튼을 disable하고 두 번 누른 이벤트는 무시한다. success는 ‘가상 변경 완료’와 새 시간 및 id를 표시한다. ‘변경 취소’는 original을 유지한다. 모든 입력 오류는 상단 요약+해당 필드 메시지, 해당 필드 focus로 연결한다. 오류 후 나머지 값은 보존한다. 14:00 invalidation·pending은 명시적 테스트 컨트롤로 재현한다. browser Back은 선택/입력을 지우지 않는다. reload 복구는 계약에 포함하지 않는다(메모리 전용).

## 제안 레이아웃 수치 (원본 CSS 실측 아님)

Desktop 1280×900: content max-width 1040px, gap 24px, main 2/3 + summary 1/3. 390×844: 단일 열, 양옆 20px, page gap 24px, time buttons min-height 44px, body 16px, heading 28px, radius 10px. 모든 수치는 이 데모의 제안 토큰이다. 날짜·가격·조건·confirm CTA는 DOM 읽기 순서도 시각 순서와 같게 한다. 작은 화면에서 sticky CTA가 조건을 덮으면 사용하지 않는다. confirm 컨테이너 안에 비용/조건을 함께 넣어 결과 행동만 떠다니지 않게 한다.

## 통과 조건

1. 전후 fixture/state hash가 같은 selection/review/conflict screenshots
2. 비가용 시간 선택 불가, 빈 날짜 안내·다음 가용 날짜로 이동
3. 시간대 표기, 기존/새 시간 동시 노출, 총액과 모든 수수료 일치
4. input editing/review/back/error 후 회의명·인원 보존
5. stale slot은 단일 성공 기록을 만들지 않고 메시지+확정 차단
6. duplicate submit은 DEMO-R17 한 건만 교체
7. 취소는 original JSON 그대로, 새 요청 자동 확정 없음
8. keyboard로 날짜·시간·변경·확정 조작, focus 표시, 390px에서 가로 overflow 없음
9. network request·localStorage·cookie·메일·실결제·외부 기록 없음
10. code/static/runtime/visual/manual keyboard test를 별도 기록. 실행 안 한 것은 미실행으로 기재
