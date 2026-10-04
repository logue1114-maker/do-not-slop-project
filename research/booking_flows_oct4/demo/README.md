# BKF4 · 같은 예약, 두 가지 화면 구조

회의실 예약 변경의 **가상 Before / After 비교**다. 같은 BKF4-F01 fixture와 같은 상태 모델을 사용하며, 차이는 배치·정보 위계·중복 안내의 묶음과 여백이다. 실제 서비스의 전후 화면을 재현한 것이 아니며 사용성 개선 효과를 측정한 결과도 아니다.

## 실행

추가 설치 없이 이 폴더에서 실행한다.

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:8765/`를 연다. 파일을 직접 열어도 화면·상태 전이는 동작하지만, SHA-256 표시와 browser history 검증은 localhost에서 하는 편이 명확하다.

- `?view=after&screen=selection` / `?view=before&screen=selection`
- `?view=after&screen=review` / `?view=before&screen=review`
- `?view=after&screen=conflict` / `?view=before&screen=conflict`
- `?view=compare&screen=review`: 두 화면이 하나의 상태를 나란히 읽는다
- `&capture=1`: 비교 도구와 하단 실험 설명을 숨기는 캡처 모드. 가상 데모 표시는 유지한다

`screen`은 **초기 fixture 상태를 재현하는 실험 도구**다. 초기 상태를 바꾸면 이전 편집은 리셋된다. 화면 구조 토글은 리셋하지 않는다. 실제 흐름에서는 입력·날짜·선택 시간과 기존 예약이 보존된다. 새로고침 복구는 범위 밖이다.

## 가상 데이터 / 외부 영향 없음

메이플 회의실 · 정원 6명 · 60분 / 회의명 팀 회의 · 인원 4명 / 한국 시간 UTC+9

- 기존 예약 DEMO-R17: 2026-10-14 10:00–11:00
- 초기 변경안: 2026-10-15 14:00–15:00
- 가상 금액: 대여료 24,000원 + 서비스 수수료 2,000원 = 총 26,000원, 세금 포함
- 가상 취소 조건: 10월 14일 14:00까지 0원, 이후 13,000원

모든 금액·정책·결과는 설명용이다. 서버/API 호출, 실제 예약·결제·메일·계정 변경, 쿠키·localStorage·sessionStorage 사용이 없다. HTML/CSS/JS 파일을 제공하기 위한 localhost 요청만 발생한다. CSP의 `connect-src 'none'`과 `form-action 'none'`도 적용했다.

## 흐름과 검증

선택 → 변경 확인 → 처리 중 → 가상 변경 완료

- 10/16: 빈 결과와 10/19 보기. 날짜를 바꿔도 회의명·인원은 보존한다
- 불가한 16:00: 선택 불가. 선택 상태·가용·불가를 글자로 표시한다
- 회의 정보 변경: 입력값을 보존하고 오류 요약에서 해당 필드로 이동한다
- 시간 다시 선택 / browser Back: 독립 입력과 draft를 유지한다
- 테스트 도구 → 14:00 가용성 변경 시뮬레이션 → 변경 확정: 14:00을 invalid로 유지하고 충돌을 표시한다. 자동 대체 없음
- 충돌 → 15:00 선택 → 다시 확인 → 변경 확정: 명시적 사용자 선택 후 성공한다
- 처리 중: 확정 버튼을 비활성화하며 모델에서도 중복 확정을 무시한다
- 성공: DEMO-R17 한 건의 날짜·시간을 한 번 교체한다. 새 예약 ID를 만들지 않는다
- 변경 취소: 처리 중이라도 기존 예약 JSON을 유지하고 지연된 완료를 무효화한다

화면 도구의 `상태 SHA-256 확인`은 canonical JSON의 fixture/state/contract hash를 보여준다. Before/After 토글 전후 같은 hash여야 한다. 원본 JSON 파일의 바이트 hash와 canonical JSON hash는 서로 다른 지표다.

개발자 확인 API는 `window.bookingDemo.getState()`, `getFixture()`, `getHashes()`, `getContract('before'|'after')`, `setView(...)`, `reset(...)`다. 모두 로컬 전용이다.

```sh
node --check app.js
node --check model.js
node test-model.cjs
node test-app-wiring.cjs
```

공개 소스용으로 새로 작성한 `test-model.cjs`는 모델/정적 검사 58개를 실행하며 `model-test-results.json`과 요약을 기록합니다. 포함된 `test-app-wiring.cjs`는 7개 연결 회귀 검사를 실행합니다. 이 결과는 현재 공개 바이트에 대한 새 기록이며, 코드 검사와 실제 브라우저·렌더·키보드 검수는 구분합니다.

`test-app-wiring.cjs`는 실제 `app.js`와 `model.js`를 함께 실행하는 DOM 형태의 이벤트 하네스다. 빈 날짜·복귀·오류 정정·입력 초점·한국어 composition·pending/conflict 전이를 검사한다. 실행하면 로컬 코드 결과 파일을 만들며, 브라우저 엔진·실제 키보드·시각 검수는 포함하지 않는다.

브라우저 QA 권장: 1280×900와 390×844에서 세 preset의 Before/After 캡처, 가로 넘침/조건 가림 여부, Tab+Enter로 날짜·시간·정보 변경·확정, 오류 초점과 입력 보존, browser Back, 빈 날짜 이동, stale/pending/취소/빠른 중복 클릭을 확인한다. 모바일 CTA는 sticky가 아니며 비용·조건보다 앞서 떠다니지 않는다.

## 공개 근거와 자체 제안의 구분

공개 근거는 상위 폴더의 `booking_manual_ko.md`와 `booking_flows.cases.json`에 자세히 분리되어 있다. 이 demo는 원본 화면 이미지·로고·문장 복사를 포함하지 않는다.

- **문서화된 결정 / 관찰**: [Mufan Lu의 MoeGo 설계 사례](https://www.mufanlu.com/home/moego_online_booking)는 서비스 적합성에 필요한 최소 입력과 가용성 표시를 설명한다. 공개 availability 이미지 관찰은 원본 제품의 Before/After 비교는 아니다
- **문서화된 수정**: [Cal.com v6.6](https://cal.com/blog/calcom-v6-6)의 기존 날짜·시간 취소선은 변경 **메일** 수정이다. 웹 review의 old/new 그룹 배치와 오류 focus는 이 demo의 제안이다. [v2.7](https://cal.com/blog/v-2-7)은 현지화·빈 가용일 시간대·optional notes 노출의 보조 근거다
- **역사적 제품 공지**: [Airbnb 2022 총액 표시 발표](https://news.airbnb.com/airbnb-is-introducing-total-price-display-and-updating-guest-checkout)는 수수료 총액/내역 공개의 역사적 근거다. 2026 현행 정책이나 이 demo의 세금·취소 조건을 뒷받침하지 않는다
- **자체 제안**: 화면의 모든 px/token, 구조·문구·상태 모델, 가상 가격·취소 조건, 입력 보존, 충돌 처리, 중복 확정 방지. 원본 CSS를 실측하거나 효과를 실험한 값이 아니다

Before는 고유 정보를 지우거나 입력 보존을 의도적으로 망가뜨리지 않는다. 불필요한 안내·열린 입력·여백·흩어진 조건으로 비교할 구조 문제만 만든다. After는 중복 안내와 그 공간을 제거하고 비용·경계·실제 결과 행동을 함께 둔다.

## 파일

- `index.html`, `styles.css`, `app.js`: 두 presentation과 native controls
- `fixture.js`: 준비된 `../fixture.json`의 정확한 JSON 값 복사. 원본은 변경하지 않음
- `model.js`: Before/After가 공유하는 유일한 상태 전이/검증 모델
- `test-model.cjs`: 공개 소스용 모델/정적 회귀 검사와 새 결과 기록
- `test-app-wiring.cjs`: 실제 app/store 연결과 이벤트→render 회귀 검사 (브라우저 엔진 미사용)

동작은 로컬 가상 예약만 바꿉니다. 원본 제품 화면·실예약·계정·결제는 포함하지 않습니다.
