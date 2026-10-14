# Responsive Progress

> 현재 구조 안내 (2026-10-06): 아래 내용은 당시 작업 기록입니다. 현재 사이트는 21개 페이지이며, 스타일은 `css/reset.css`와 `css/common.css`를 사용합니다. 예전 페이지별 CSS는 삭제되었고 `signature.html`은 `signature01.html`로 변경되었습니다. 두골체/신결비는 `signature02.html`/`signature03.html`입니다. 최신 운영 확인 사항과 수정 결과는 [DELIVERY_CHECK.md](DELIVERY_CHECK.md)를 먼저 확인하세요.


기준: 최신 커밋 ed7405e / 2026-10-02. 기존 PC와 데이터·PHP include·JS 구조 보존.
검수 폭: 1920 / 1440 / 1024 / 768 / 480 / 375px.
체크 의미: 해당 section의 PC 보존, Tablet/Mobile 배치·overflow·비율·터치/interaction·콘솔 검수 완료.

## Current / Next
- Current: 전체 21개 페이지 반응형 적용. 최신 검증·운영 보류 사항은 DELIVERY_CHECK.md 참고 (아래 19개 페이지 기록은 이전 검수 이력).
- Next: 없음. 실제 기기·운영 환경 확인 항목은 아래 기록 참고.
- 진행 규칙: section별 저장 → 브라우저 확인 → 즉시 체크. 미완료는 체크하지 않음.

## 공통 컴포넌트
- [x] Header: logo / CTA / desktop mega / tablet menu / mobile accordion / ESC / breakpoint / scroll
- [x] Footer: logo / information / links / SNS / wrapping / stacking
- [x] Container / typography / buttons / statement
- [x] Subpage Hero
- [x] INFORMATION: 연락처·주소·시간 / map / links
- [x] Community navigation / board / pagination

## index.html
- [x] section hero-section (DOM 1)
- [x] section02 (DOM 2)
- [x] section03 (DOM 3)
- [x] section-carousel (DOM 4)
- [x] section04 growth (DOM 5)
- [x] section05 experts (DOM 6)
- [x] section06 (DOM 7)
- [x] section07 (DOM 8)
- [x] section08 (DOM 9)
- [x] section-carousel (DOM 10)
- [x] section09 (DOM 11)
- [x] section10 (DOM 12)
- [x] inquiry (DOM 13)
- [x] section-bg (DOM 14)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## brand-story.html
- [x] brand-story-hero (DOM 1)
- [x] brand-principles (DOM 2)
- [x] brand-values (DOM 3)
- [x] brand-belief (DOM 4)
- [x] brand-results (DOM 5)
- [x] brand-special (DOM 6)
- [x] section-carousel brand-statement (DOM 7)
- [x] brand-history (DOM 8)
- [x] brand-inquiry (DOM 9)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## introduce.html
- [x] introduce-hero (DOM 1)
- [x] introduce-profile (DOM 2)
- [x] section-carousel introduce-statement (DOM 3)
- [x] introduce-information (DOM 4)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## introduce-educators.html
- [x] introduce-hero (DOM 1)
- [x] educators-section (DOM 2)
- [x] Educators heading
- [x] educator-row-1 / KIM MI JIN
- [x] educator-row-2 / KWON JIN I
- [x] educator-row-3 / MAENG JEONG SUK
- [x] introduce-information (DOM 3)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## network.html
- [x] network-hero (DOM 1)
- [x] network-section (DOM 2)
- [x] network-information (DOM 3)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## results.html
- [x] results-hero (DOM 1)
- [x] results-section (DOM 2)
- [x] results-information (DOM 3)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## signature01.html
- [x] signature-hero (DOM 1)
- [x] signature-course (DOM 2)
- [x] section-carousel signature-statement (DOM 3)
- [x] signature-difference (DOM 4)
- [x] signature-curriculum (DOM 5)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## advanced.html
- [x] advanced-hero (DOM 1)
- [x] advanced-course (DOM 2)
- [x] advanced-points (DOM 3)
- [x] advanced-curriculum (DOM 4)
- [x] section-carousel advanced-statement (DOM 5)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## startup.html
- [x] startup-hero (DOM 1)
- [x] startup-course (DOM 2)
- [x] startup-points (DOM 3)
- [x] startup-curriculum (DOM 4)
- [x] section-carousel startup-statement (DOM 5)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## growth.html
- [x] growth-hero (DOM 1)
- [x] growth-course (DOM 2)
- [x] growth-points (DOM 3)
- [x] growth-curriculum (DOM 4)
- [x] section-carousel growth-statement (DOM 5)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## montly.html
- [x] montly-hero (DOM 1)
- [x] montly-education (DOM 2)
- [x] section-carousel montly-statement (DOM 3)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## montly-detail.html
- [x] montly-hero (DOM 1)
- [x] montly-detail-section (DOM 2)
- [x] section-carousel montly-statement (DOM 3)
- [x] Dynamic overview: poster / facts / price
- [x] Dynamic intro / curriculum / contact: js/montly.js
- [x] montly-detail-intro
- [x] montly-detail-curriculum
- [x] montly-detail-contact
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## promotion-preview.html
- [x] promotion-preview-hero (DOM 1)
- [x] promotion-list (DOM 2)
- [x] section-carousel page-statement (DOM 3)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## promotion-detail.html
- [x] promotion-detail-hero (DOM 1)
- [x] promotion-article (DOM 2)
- [x] section-carousel page-statement (DOM 3)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## schedule.html
- [x] schedule-section (DOM 1)
- [x] Toolbar / year-month picker
- [x] Schedule list / highlight / calendar sticky
- [x] Mobile: list only / touch opens calendar bottom sheet / selected period / close / ESC
- [x] Mobile calendar actions: 상담신청 # / 네이버 예약 기존 링크 재사용
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## notice.html
- [x] notice-hero (DOM 1)
- [x] notice-board (DOM 2)
- [x] section-carousel page-statement (DOM 3)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## qna.html
- [x] qna-hero (DOM 1)
- [x] qna-board (DOM 2)
- [x] section-carousel page-statement (DOM 3)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## review.html
- [x] review-hero (DOM 1)
- [x] review-board (DOM 2)
- [x] section-carousel page-statement (DOM 3)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## news.html
- [x] news-hero (DOM 1)
- [x] news-board (DOM 2)
- [x] section-carousel page-statement (DOM 3)
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## 검수 기록
- Desktop 비교용 최신 HTML/CSS/JS 스냅샷은 작업용 임시 폴더에 보관.
- 기존 responsive: common/header/footer/hero, brand-story, boards, montly-detail 및 index 일부.
- 미구현 또는 고정폭: 대표/강사/INFORMATION, 교육 소개·카드·표, 일정, 목록형 프로모션/이달의교육.
- 실제 모바일/태블릿 Figma 없음: 기존 구성의 column 축소·stack·여백/글자 크기 조정으로 대응.
- Commit/push/reset/clean 하지 않음.


## 최종 전수 검수 — 2026-10-02
- 완료: 실제 페이지 19개 / 체크리스트 119개 완료 / 미완료 0개.
- 요청한 1920 / 1440 / 1024 / 768 / 480 / 375px와 경계 1439 / 1025 / 769px까지 전체 19개 페이지 재검수.
- 화면 높이 900px 기준. 일정 팝업은 375×600 및 375×1200도 확인.
- 1920 / 1440px에서 작업 전 section top / height / width 비교: 19개 페이지 모두 2px 이상 차이 없음.
- 의도하지 않은 문서 가로 넘침, 노출된 heading/본문 넘침, 이미지 누락, console error: 발견 없음.
- 공통 메뉴: 전체 19개 페이지 375px에서 열기 / ESC 닫기 확인. 6개 폭의 메뉴·accordion·breakpoint·scroll 상태 검수 포함.
- Footer / 공통 정보 / 링크 / SNS 줄바꿈 확인.
- HTML/CSS/JS의 로컬 파일·asset 경로 330개 조합 확인: 누락 0, production /ai 참조 0.
- header.html / footer.html / index.html / reset.css / common.js / modify.js / montly.js / brand-story.js 원본 유지.
- JavaScript 문법 검사 및 git diff --check 통과. Commit/push 하지 않음.
- Impeccable detector는 parser 의존성 부재로 제한된 regex 검수만 실행됨. 기존 common.css의 width transition 경고 1개는 현재 메뉴 동작을 보존하기 위해 유지. 브라우저 검수와 별도로 기록.

## 페이지별 반응형 적용 / 재사용 기록
| 페이지 | 적용 및 검수 내용 |
| --- | --- |
| index | 기존 Hero/Swiper/scroll fill/marquee 유지. 대표·교육 카드·소식·FAQ·연결 카드·상담 form 재배치. 모바일 입력 16px, 버튼·체크 터치 크기 확인. |
| brand-story | 기존 custom carousel/preview/active text/image transition/history sticky 유지. 기존 작은 화면 배치 재사용. 원형 장식의 문서 가로 넘침만 section clip으로 해결. |
| introduce | 대표 사진·프로필 grid를 모바일 1열, 이력 줄바꿈 및 INFORMATION stack. |
| introduce-educators | 3개 강사 row 각각 사진·이력 재배치. 1440px에서 기존 고정 grid overflow 수정. |
| network | 카드 3→2→1열, 지역 filter/빈 결과/pagination, INFORMATION 검수. |
| results | 카드 3→2→1열, 과정 filter/복원/pagination, INFORMATION 검수. |
| signature | 소개 stack, 차별점 3→2→1열, 커리큘럼 표를 모바일 수직 구성으로 변경. |
| advanced | 소개 stack, 특징 2→1열, 커리큘럼 사진/교육시간/내용 수직 구성. |
| startup | 소개·특징·커리큘럼 재배치. 기존 accordion 클릭/Enter 확인. 1440px 기존 고정폭 overflow 수정. |
| growth | 소개·특징·8개 커리큘럼 항목 재배치. 기존 accordion 각각 펼침/접힘 확인. |
| montly | 목록 3→2→1열. chip/기간/시간/우측 가격/상세 링크 유지. modify.js 데이터 그대로 사용. |
| montly-detail | 기존 반응형 overview/본문/커리큘럼/문의 재사용 및 각각 검수. PC 전화번호 복사 확인. |
| promotion-preview | 목록 3→2→1열. 포스터 비율·내용·기간·상세 링크 유지. 현재 5개 노출 및 disabled 더보기 유지. |
| promotion-detail | 포스터 유동 너비, 본문 계층·여백 조절. 목록 복귀 링크 확인. |
| schedule | Tablet까지 목록/달력 2열 및 sticky. 768px 이하 목록만 노출하고 같은 달력 DOM을 bottom sheet로 사용. 아래 상세 기록 참고. |
| notice | 기존 hero/nav/board responsive 재사용. 현재 빈 게시판, 내부 scroll region, 하단 확인. |
| qna | 기존 hero/nav/board responsive 재사용. 현재 빈 게시판, 내부 scroll region, 하단 확인. |
| review | 기존 hero/nav/board responsive 재사용. 현재 빈 게시판, 내부 scroll region, 하단 확인. |
| news | 기존 hero/nav/board responsive 재사용. 현재 빈 게시판, 내부 scroll region, 하단 확인. |

## Schedule mobile 추가 요청 결과
- 월 / 연도 선택 UI 그대로 사용. 6개 폭에서 선택창이 화면 안에 들어옴.
- 768px 이하: 목록만 노출, 과정 터치 시 하단 달력 팝업, 선택 과정명 / 월 / 전체 기간 / 기존 색상 표시.
- 5개 과정 각각 기간 및 색상 확인. 두골비 10기 2026.10.11~2026.10.28의 18일 강조 확인.
- 10월 말~11월 초 과정과 11월 목록/달력 확인, 다른 연도의 빈 달 확인.
- 닫기 / 배경 클릭 / ESC / focus trap / 목록 focus 복귀 / 배경 비활성 / 화면 폭 전환 시 해제 확인.
- 짧은 화면에서 팝업 내부만 스크롤하여 두 버튼 접근 가능.
- 상담신청 href="#". 네이버 예약은 educationData[0].naverBookingUrl 재사용(현재 다른 예약 버튼과 동일하게 "#").
- 달력 slide-up transition 260ms. 기존 prefers-reduced-motion 설정 시 transition 비활성 유지.
- PC 날짜 강조 transition / course colors / month-year picker / 달력 sticky 및 section 끝에서 sticky 종료 유지.

## 작은 화면에서 단순화한 부분
- 기존 brand-story 작은 화면용 원형 preview 숨김 및 history 이미지 static 규칙 재사용.
- 메인 하단 background-attachment는 Tablet/Mobile에서 scroll로 전환.
- 교육 커리큘럼 표는 모바일에서 동일 정보를 수직 배치. 게시판 표와 community nav는 필요 시 내부 가로 스크롤을 유지하며 문서 가로 넘침은 없음.
- 일정 hover는 PC에서 유지. 모바일은 터치로 동일 기간을 팝업에서 확인.
- 기존 Swiper / custom carousel / accordion / scroll fill / marquee / filter / pagination 구조 및 PC timing 유지.
- index FAQ는 원본 자체가 정적인 펼침 상태이며 별도 accordion handler가 없음. 원본과 동일하게 유지했으며 임의 내용·기능을 추가하지 않음.

## 실제 운영 / 실제 기기에서 확인할 항목
- iOS Safari / Android의 실제 터치, 주소창·키보드 변화, font rendering, 일정 팝업의 safe area.
- 모바일 전화 예약의 실제 통화 앱 연결. PC 복사는 브라우저에서 확인.
- 실제 PHP 서버의 include 실행 및 상담 form의 서버 처리. 검수 서버는 원본 PHP include fragment를 화면에 조합하는 용도로만 사용.
- 게시판 실제 게시글 / pagination 데이터가 추가된 후 긴 제목·작성자·날짜 및 내부 표 스크롤 확인.
- 네이버 예약 URL은 현재 제공된 원본이 "#"이므로 실제 예약 이동은 URL 제공 후 확인 필요.
- OS에서 모션 줄이기 설정을 끈 실제 기기의 carousel / 달력 팝업 모션 확인.


## 이번 작업 파일
- 신규: RESPONSIVE_PROGRESS.md
- 수정 CSS: css/common.css, css/index.css, css/brand-story.css, css/introduce.css, css/introduce-educators.css, css/network.css, css/results.css, css/signature.css, css/advanced.css, css/startup.css, css/growth.css, css/montly.css, css/promotion-preview.css, css/promotion-detail.css, css/schedule.css
- 수정 HTML / JS: schedule.html, js/schedule.js (모바일 달력 팝업에 필요한 최소 마크업·동작)
- 신규 dependency / 복사 asset / 데이터 수정 / commit / push: 없음.


## 최근 2시간 요청 점검 및 지도 링크 후속 작업 — 2026-10-02

- 점검 범위: 점검 요청 접수 시각 기준 15:29:38~17:29:38 (Asia/Seoul), 해당 기간 요청 21건.
- 대화에서 중단된 기록 3건: 임상 결과 페이지네이션 / 수료지점 페이지네이션 / 전문가 클래스 모바일 POINT 슬라이드.
- 위 3건은 후속 작업에서 완료되었으며, 이번 점검에서 실제 파일 및 브라우저 동작을 다시 확인함.
- 현재 미완료 요청: 없음. 먼저 요청했던 설명 숨김은 이후 설명 복원 요청으로 대체됨.

### 요청별 현재 상태
- [x] 메인 Our Experts 제목과 대표자 사진 간격 확대.
- [x] 메인 교육 카드 6개 제목·설명 교체.
- [x] 메인 교육 카드 chip 6개 과정 기간·분류 교체.
- [x] 1440px 미만 설명 숨김 요청: 이후 복원 요청으로 대체.
- [x] 모바일 교육 카드 chip 14px.
- [x] 교육 카드 설명 복원 및 작은 화면 강제 줄바꿈 해제.
- [x] 모바일 Media & News: 날짜 / 제목·오른쪽 화살표 배치.
- [x] Others 3개 문구 및 일정·수료지점·이달의 교육 연결.
- [x] FAQ 질문·답변 5개 교체, 초기 닫힘·슬라이드 펼침·화살표 회전 유지.
- [x] 모바일 Our Experts 문구만 원장님에게로 변경, 글자 크기 유지.
- [x] 모바일 브랜드 가치 짝수 카드 왼쪽 모서리·오른쪽 정렬.
- [x] 모바일 브랜드 신념 문구 3줄 및 위·아래 캐러셀 반대 방향 이동.
- [x] 브랜드 특별함 카드 PC 40% 플립 / 모바일 30% 좌우 교차 진입.
- [x] 모바일 브랜드 상담 CTA 제목 2rem, 제목·설명 keep-all, 두 버튼 같은 너비.
- [x] 모바일 임상 결과 제목 요청한 2줄.
- [x] 임상 결과 6개씩 페이지 분할, 실제 페이지 수·10개 번호 묶음 이동.
- [x] 모바일 지역·과정 pill 필터 14px / min-height 0 / padding 4px 18px.
- [x] 모바일 수료지점 카드 간격 80px.
- [x] 수료지점 6개씩 페이지 분할, 실제 페이지 수·10개 번호 묶음 이동.
- [x] advanced / startup / growth 모바일 POINT 카드 유한 좌우 스크롤·스냅.
- [x] 이달의 교육·프로모션 초기 6개 / 더보기 6개 추가 / 남은 항목 유무에 따른 활성·비활성.

### 검수 근거와 후속 변경
- 이번 재확인: 375px에서 메인 문구·chip·설명·FAQ 펼침/접힘·소식 배치·Others 링크, 브랜드 가치·신념 줄바꿈·양방향 캐러셀의 실제 이동·카드 진입·상담 CTA 검수.
- 수료지점 실제 7개: 1페이지 6개 / 2페이지 1개. 임상 결과 실제 9개: 6개 / 3개. 필터 버튼 값과 문서 가로 넘침 확인.
- 전문가 3페이지 모바일 POINT 카드 4개만 존재, 마지막 카드 scrollLeft가 최대값 928px에서 종료됨. 앞선 검수에서 추가 스크롤 시 반복 없음·첫 카드 복귀 및 PC 4열·Tablet 2열도 확인함.
- 더보기 실제 운영 데이터: 이달의 교육 1개 / 프로모션 5개로 현재 비활성. 직전 완료 작업에서 두 페이지 모두 13개 임시 데이터로 6→12→13 검수, 0개·6개 경계 및 키보드 검수 완료. 테스트 파일은 삭제됨.
- 페이지네이션 30개→5페이지 / 300개→50페이지 및 10페이지 묶음·필터 후 재계산은 앞선 완료 작업의 브라우저 검수 기록 확인. 이번 점검에서는 실제 데이터 페이지 전환 재확인.
- 새 요청: INFORMATION이 존재하는 introduce / introduce-educators / network / results의 네이버·카카오 지도 링크 총 8개에 target="_blank", rel="noopener noreferrer" 적용. 기존 URL 유지. 4페이지 모두 브라우저에서 설정 확인.
- 재확인한 페이지에서 console error / 의도하지 않은 문서 가로 넘침 발견 없음. JavaScript 문법 및 git diff --check 통과.
- 이번 후속 변경 파일: introduce.html / introduce-educators.html / network.html / results.html / RESPONSIVE_PROGRESS.md.
- 이번 점검에서 추가 구현 누락이 발견되지 않아 정상 작동하는 코드의 재작성은 하지 않음. modify.js 데이터 / reset.css / commit / push 변경 없음.
- Current: 최근 요청 점검 및 INFORMATION 지도 새창 적용 완료.
- Next: 없음. 기존 실제 기기·운영 환경 확인 항목은 위 기록 참고.


## INFORMATION 카카오맵 교체 — 2026-10-02
- [x] introduce / introduce-educators / network / results: 동일한 제공 roughmap timestamp 1790929303745, key 2kbq4uve66p 적용.
- [x] 실행 코드는 js/common.js에 작성. 각 대상 페이지에 공식 loader 1개만 삽입, inline 실행 스크립트 없음.
- [x] 확대·축소·초기화, 로드뷰·길찾기·지도 크게보기, 장소 설명 UI 숨김. 지도 내부 Kakao 출처와 축척은 유지.
- [x] 기존 지도 프레임 유지: 큰 화면 672px / Tablet 380px / Mobile 300px. ResizeObserver와 SDK relayout/setCenter로 화면 크기 변경 후 영역 채움 및 중심 유지.
- [x] 4페이지 각각 1920 / 1440 / 1024 / 768 / 375px 검수: 지도 tile 생성, 프레임과 canvas 크기 일치, loader 1개, 도구 비노출, 문서 가로 넘침 없음.
- [x] 같은 페이지에서 375→1920px 크기 변경 후 지도 자동 맞춤, 실제 tile 이미지 로딩, 출처 표시 확인. Console error 없음. node --check js/common.js 및 git diff --check 통과.
- 제공 코드의 지도 위치는 부산 두골비 오브제랩 본점. 기존 INFORMATION의 부산/서울 주소 문구는 수정하지 않음. 지도 aria-label은 제공 지도 위치에 맞춤.
- 지도 로딩 중/실패 시 기존 이미지 유지, 지도 준비 시 이미지 시각·접근성 노출 해제.
- 수정: introduce.html / introduce-educators.html / network.html / results.html / css/common.css / js/common.js / RESPONSIVE_PROGRESS.md.
- 신규 파일·asset·dependency 및 commit/push 없음.


## 시그니처 과정 분리 및 교육 카드 연결 — 2026-10-02
- [x] signature.html → signature01.html 이름 변경. 기존 두골비 템플릿 / 공통 CSS / JS / Header / Footer 유지.
- [x] signature02.html: 두골체 소개 원고 및 7개 PART, 총 20주 커리큘럼 반영. 표 스타일을 재사용한 2열 구성.
- [x] signature03.html: 신결비 제목 및 메인 카드 이미지 반영. 소개 본문 / 차별점 / 표는 두골비 템플릿 임시 내용 (신결비 확정 원고 미제공).
- [x] index 교육 카드: 두골비 / 두골체 / 신결비 / 심화 / 창업 / 성장의 개별 페이지 링크 연결.
- [x] 공통 Header: PC / 모바일 두골체·신결비 메뉴 및 기존 signature 링크 변경.
- [x] 세 페이지 전체 브라우저 / 이미지 / 표 / 링크 / 가로 overflow / console 확인: 1920 / 1440 / 1024 / 768 / 480 / 375px. 이미지 누락, 가로 넘침, console error 없음.
- Current: 시그니처 과정 분리 / 카드·Header 연결 / 브라우저 검수 완료.
- Next: 신결비 확정 원고 수령 시 임시 본문 및 커리큘럼 교체 (현재 요청의 템플릿 제작은 완료).

- [x] 소개 이미지 3개: 메인의 각 교육 카드 images/main/section06-item-bg01~03.jpg 재사용. 원본 비율 유지.
- [x] 공통 CSS의 signature-course-copy에 word-break: keep-all 추가 (PC 한국어 단어 중간 줄바꿈 방지). JS 변경 없음.
- [x] production HTML / JS / PHP에 signature.html 참조 없음. 로컬 HTML 링크 대상 누락 없음.

## signature02.html
- [x] signature-hero (DOM 1) — 기존 signature 템플릿 및 반응형 재사용, 6개 검수 폭 확인
- [x] signature-course (DOM 2) — 기존 signature 템플릿 및 반응형 재사용, 6개 검수 폭 확인
- [x] section-carousel signature-statement (DOM 3) — 기존 signature 템플릿 및 반응형 재사용, 6개 검수 폭 확인
- [x] signature-difference (DOM 4) — 기존 signature 템플릿 및 반응형 재사용, 6개 검수 폭 확인
- [x] signature-curriculum (DOM 5) — 기존 signature 템플릿 및 반응형 재사용, 6개 검수 폭 확인
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인

## signature03.html
- [x] signature-hero (DOM 1) — 기존 signature 템플릿 및 반응형 재사용, 6개 검수 폭 확인
- [x] signature-course (DOM 2) — 기존 signature 템플릿 및 반응형 재사용, 6개 검수 폭 확인
- [x] section-carousel signature-statement (DOM 3) — 기존 signature 템플릿 및 반응형 재사용, 6개 검수 폭 확인
- [x] signature-difference (DOM 4) — 기존 signature 템플릿 및 반응형 재사용, 6개 검수 폭 확인
- [x] signature-curriculum (DOM 5) — 기존 signature 템플릿 및 반응형 재사용, 6개 검수 폭 확인
- [x] 페이지 전체 연결·간격·Header/Footer·console 최종 확인


## 상담신청 섹션 링크 통일 — 2026-10-02
- [x] 메인 상담신청 section에 id="inquiry" 추가.
- [x] Header / 메인 Hero / Brand Story / Schedule 모바일 팝업 / INFORMATION 4개 페이지: 상담신청·상담문의 진입 버튼 8개를 index.html#inquiry로 연결.
- [x] 전화번호 / 전화예약 / 네이버 예약 / 상담 form submit 기능 유지.
- [x] 공통 Header CTA 클릭 시 모바일 메뉴 닫음. 동일 페이지 내 이동 시 메뉴가 남지 않도록 처리.
- [x] 상담 section scroll-margin-top: PC·Tablet Header 100px / Mobile Header 73px 반영.
- [x] 모든 상담 anchor 정적 검사 통과. PC Header, Mobile Header(메뉴 열린 상태), Hero, Schedule 팝업 실제 클릭 이동 확인. Console error 없음.
- Current: 상담신청 진입 링크 통일 및 PC·모바일 확인 완료.
- Next: 신결비 확정 원고 수령 시 임시 본문 / 표 교체.


## 시그니처 좌측 이미지 패널 통일 — 2026-10-02
- [x] signature01 / signature02 / signature03 좌측 이미지: advanced 기준 700×500 (7:5) 비율 적용. object-fit: cover로 원본 왜곡 없이 크롭.
- [x] advanced course-panel.png에 포함된 약 30px 라운드와 동일한 상대 radius 적용: 4.285714% / 6%.
- [x] 기존 공통 course-panel 너비·Grid·breakpoint 그대로 재사용. 이미지와 라운드가 화면 폭에 맞춰 함께 축소.
- [x] advanced와 3개 signature 모두 1920 / 1440 / 1024 / 768 / 480 / 375px에서 좌측 이미지 실측 크기 동일. 누락 이미지 / 가로 넘침 / console error 없음. PC 3개 이미지 및 Mobile 크롭·라운드 시각 확인.
- 수정 파일: css/common.css / RESPONSIVE_PROGRESS.md. HTML / JS / 원본 asset 변경 없음.
- Current: 시그니처 좌측 이미지 패널 통일 완료.
- Next: 신결비 확정 원고 수령 시 임시 본문 / 표 교체.


## 외부 링크 새 창 규칙 통일 — 2026-10-02
- [x] js/common.js: 다른 origin의 HTTP(S) 링크를 target="_blank" / rel="noopener noreferrer"로 처리.
- [x] 초기 링크 / 동적 추가 / href 변경을 반영. 기존 rel 값 유지. 운영 데이터(modify.js) 변경 없음.
- [x] production HTML의 외부 링크 9개는 기존 _blank 유지. 모든 실제 페이지에서 common.js 로드 확인.
- [x] 브라우저 QA: 일반 외부 URL / protocol-relative / 동적 추가 / 예약 href 변경은 _blank. 내부 HTML / 같은 origin URL / anchor / 전화 / 이메일 링크는 기존 동작 유지. Console error 없음.
- [x] 실제 monthly detail 푸터 외부 블로그 링크 및 전화·상담·# 예약 링크 구분 확인. 임시 QA 파일 제거 완료.
- Current: 외부 링크 새 창 공통 처리 완료.
- Next: 신결비 확정 원고 수령 시 임시 본문 / 표 교체.


## 교육일정 높이 및 교육장 선택 — 2026-10-12
- [x] 기존 schedule HTML/CSS/JS 및 business_info를 확인하고 목록/달력 2열, 과정 색상, 선택·회색 호버, 모바일 바텀시트를 유지.
- [x] PC·Tablet 달력: 화면 높이와 월별 4/5/6주에 따라 날짜 칸 60~100px로 조정. Tablet은 기존 최대 76px 유지. 주 수에 따른 panel min-height 적용.
- [x] Header 아래 sticky 위치 120px 확보. 아주 낮은 창은 최소 크기를 유지하고 sticky를 해제하여 일반 페이지 스크롤로 전체 접근.
- [x] 기존 월 toolbar 안에 부산 교육 본점 / 서울 청담 교육장 선택 추가. 이름은 business_info.locations에서 사용.
- [x] scheduleData에 location: busan/seoul 필드 추가. 선택 교육장에 해당하는 목록·날짜 마커·기간 강조만 표시. 월은 유지하고 기존 선택/미리보기는 초기화.
- [x] 교육장별 공통 네이버 예약 링크 연결. 과정별 naverBookingUrl이 있으면 우선 사용. 모바일 바텀시트에 선택 교육장 표시.
- [x] 기존 5개 일정은 부산 예약 링크 기준 busan으로 명시. 날짜·문구·예시 표시 유지. 서울 실제 일정은 임의 생성하지 않음.
- [x] Edge 브라우저 검수: 1920×1080, 1440×900, 1366×768, 1366×720, 1280×640, 1024×768, 1024×640에서 4/5/6주 달력 확인. 1366×500 일반 스크롤 확인.
- [x] Mobile 768/480/375×812 및 375×400: 가로 넘침 없음, 바텀시트 열기/닫기 및 예약 버튼 접근 확인.
- [x] 서울 테스트 데이터는 브라우저 요청에서만 임시 주입하여 목록/마커/기간/예약 링크 분리 검증. 실제 modify.js에는 저장하지 않음.
- [x] JS/PHP 구문 검사 통과. 새 JS 실행 오류 없음. 기존 footer.html의 images/common/icon-naver-inquiry.svg 누락 404는 HEAD에도 존재함을 확인했고 이번 범위에서는 변경하지 않음.
- 수정 파일: schedule.html, css/common.css, js/schedule.js, js/modify.js, RESPONSIVE_PROGRESS.md.
- 적용 범위: 로컬 작업 프로젝트. 운영 서버 업로드 및 Git commit/push는 수행하지 않음.
- Current: 교육장 선택과 달력 높이 조정 구현·검수 완료.
- Next: 사용자가 부산/서울 확정 교육일정을 전달하면 scheduleData에 교육장별 등록. 현재 예시 일정도 확정 내용으로 교체.


## 교육일정 4개 반 및 요일 반복 — 2026-10-12
- [x] 사용자 확인에 따라 기존 기간/예시 5개 데이터를 부산 일요반·월요반, 서울 수요반·목요반 4개로 교체. 관리/첫 방문/멤버십/상담/세미나 상품은 홈페이지 일정에 추가하지 않음.
- [x] modify.js: weekdays 배열(일=0~토=6), times 배열, 반별 네이버 예약 상품 URL 관리. 날짜를 생략한 요일 일정은 매주 반복.
- [x] 기존 start/end 연속 기간 지원 유지. weekdays와 start/end를 함께 지정하면 해당 기간의 지정 요일만 포함. 한쪽 날짜만 지정하는 것도 지원.
- [x] 하나의 날짜 판정으로 월별 목록·날짜 마커·선택 색상·회색 호버·접근성 날짜 설명을 통일. 단일 요일은 해당 날짜마다 독립된 둥근 표시, 연속 날짜/요일은 인접 범위 연결 유지.
- [x] 목록에 매주 요일 및 10:00 / 15:30 표시. 새 날짜 판정에 맞춰 기간 확인 문구를 날짜 확인으로 변경.
- [x] 네이버 예약 버튼은 각 반의 정확한 예약 상품으로 새 창 연결. 반 선택 전에는 교육센터 예약 목록으로 연결하여 관리 예약 페이지 진입 방지.
- [x] Edge 1920 / 1440 / 1366 / 1024 / 768 / 480 / 375px에서 교육장별 2개 표시, 지정 요일만 강조, 월 이동, 예약 URL, PC 선택 유지·호버, 모바일 팝업·닫기, 가로 넘침 확인.
- [x] 브라우저 기능 검증 36건 통과. 4/5/6주 달력과 2028년 2월 확인. 임시 데이터로 기존 연속 기간, 기간 제한 요일, 복수 요일 연결, 잘못된 날짜·요일 제외, 일치 날짜 없는 월의 빈 상태 확인. 테스트 데이터는 실제 파일에 저장하지 않음.
- [x] JS 구문·Git diff 공백 검사 통과, 새 JS 실행 오류 없음. PC/Mobile 화면 시각 확인. 기존 푸터 아이콘 404는 앞 기록과 동일.
- 수정 파일(이번 추가 작업): js/modify.js, js/schedule.js, schedule.html, RESPONSIVE_PROGRESS.md. 직전 작업의 css/common.css 높이 조정 유지.
- 적용 범위: 로컬 프로젝트. 운영 업로드 및 Git commit/push 미수행.
- Current: 4개 교육반의 요일 반복 및 예약 상품 연결 완료.
- Next: 휴강/운영기간이 확정되면 데이터에 반영. 현재 요일 표시는 매주 수업 규칙이며 네이버 잔여석·마감·예약 가능 기간의 실시간 연동은 아님.


## 교육장 커스텀 셀렉트 — 2026-10-12
- [x] 기존 타원형 교육장 버튼 유지. 펼쳐지는 옵션은 index 상담폼 커스텀 셀렉트의 모서리·그림자·여백·호버·선택 색상으로 통일. 모바일 옵션 스타일도 상담폼 기준 적용.
- [x] 교육장명은 business_info에서 표시. 기존 select/change 처리와 연결해 선택 월 유지, 교육장별 일정 및 예약 링크 전환 유지.
- [x] 방향키/Home/End 이동, Enter 선택, Escape 닫기·포커스 복원, Tab/외부 클릭 닫기 지원. 교육장 목록과 월 선택 메뉴는 동시에 열리지 않음.
- [x] JavaScript 비활성화 시 기존 기본 select 표시 유지.
- [x] Edge 1440 / 1024 / 768 / 375px에서 선택·닫기·키보드·모바일 달력 팝업 및 예약 링크 검증. 타원형 border-radius 24px 유지, 가로 넘침·JS 실행 오류 없음. PC/Mobile 화면 확인 및 JS/PHP 구문·Git diff 공백 검사 통과.
- 수정 파일: schedule.html, css/common.css, js/schedule.js, RESPONSIVE_PROGRESS.md.
- 적용 범위: 로컬 프로젝트. 운영 업로드 및 Git commit/push 미수행.
- Current: 교육장 커스텀 셀렉트 구현·검수 완료.


## 교육일정 선택 영역 전환 보정 — 2026-10-12
- [x] 선택 해제 직후 일정 색상과 range-start/end를 제거하여 사각형으로 바뀌던 문제 수정. 투명도가 사라질 때까지 이전 색상·둥근 끝·좌우 간격 유지.
- [x] 다음 선택이 겹치는 날짜의 색상·모서리·좌우 간격도 transition으로 전환. 회색 호버는 날짜 칸 전체를 채우며 선택 영역 아래에 유지.
- [x] 모션 줄이기 설정은 달력 배경 가상 요소에도 적용.
- [x] Edge 1366 / 1024 / 375px에서 전환 중간(70ms)의 색상·둥근 모서리·좌우 간격 유지 및 opacity 감소, 전환 완료 후 opacity 0 검증. 빠른 연속 선택, 회색 호버 레이어·전체 채움, 모바일 팝업, 모션 줄이기 확인. 새 JS 오류·가로 넘침 없음.
- 수정 파일: css/common.css, js/schedule.js, RESPONSIVE_PROGRESS.md.
- 적용 범위: 로컬 프로젝트. 운영 업로드 및 Git commit/push 미수행.
- Current: 선택 영역의 사각형 전환 현상 수정·검수 완료.


## 교육일정 배경색 전환 추가 보정 — 2026-10-12
- [x] 모션 줄이기 적용 시 달력 배경(before/after)은 transition:none, 글씨와 목록만 280ms 전환되어 배경이 즉시 바뀌는 현상 재현.
- [x] 해당 설정에서도 선택 배경색 및 선택/회색 호버 opacity는 280ms 전환 유지. 크기·모서리 이동 애니메이션은 생략하여 불필요한 움직임 줄임.
- [x] Edge 1366 / 1024 / 375px × 모션 줄이기 켜짐/꺼짐 6조건 검증. 70ms 시점의 중간 opacity와 색상 보간을 실제 계산 스타일로 확인. 둥근 모양 유지, 회색 호버 전체 채움 및 아래 레이어 유지, 새 JS 오류·가로 넘침 없음.
- [x] 색상 간 전환은 같은 날짜에 겹치는 요일 일정을 브라우저에서만 임시 주입해 검증. 실제 일정 데이터 변경 없음.
- 수정 파일: css/common.css, RESPONSIVE_PROGRESS.md.
- 적용 범위: 로컬 프로젝트. 운영 업로드 및 Git commit/push 미수행.
- Current: 모션 설정별 배경색 전환 검수 완료.


## 교육장별 네이버 예약 링크 변경 — 2026-10-12
- [x] 서울: https://map.naver.com/p/entry/place/2036901044?placePath=%2Fhome
- [x] 부산: https://naver.me/52aVPgcc
- [x] modify.js의 scheduleBookingUrls에서 교육장별 링크 공통 관리. 각 반 링크와 선택 전 기본 링크 모두 반영. INFORMATION 지도 링크는 변경하지 않음.
- [x] Edge 1366 / 375px에서 교육장 전환 전후·각 반 선택·다른 반 호버·모바일 바텀시트의 예약 링크 32건 검증. 모두 지정 주소 및 새 창 연결. 새 JS 실행 오류 없음. JS 구문·Git diff 공백 검사 통과.
- 수정 파일: js/modify.js, js/schedule.js, RESPONSIVE_PROGRESS.md.
- 적용 범위: 로컬 프로젝트. 운영 업로드 및 Git commit/push 미수행.
- Current: 교육장별 지정 예약 링크 적용·검수 완료.


## 메인 Media & News 데스크톱 호버 — 2026-10-12
- [x] 1025px 이상 + 마우스 hover/fine pointer 환경에서 우측 게시글 호버/키보드 포커스 시 좌측 이미지·제목·상세 링크 동기화.
- [x] 우측 행은 메인 파란 배경·제목 및 날짜 흰색으로 260ms 전환. 기존 SVG 이미지도 흰색으로 전환하며 -45도 회전하여 우측 위를 향하도록 적용.
- [x] 태블릿/모바일/터치 환경은 기존 레이아웃과 상세 이동 유지. 데스크톱에서 태블릿 크기로 줄이면 좌측 첫 게시글로 복원.
- [x] 썸네일과 대체 이미지가 모두 실패해도 이미지 요소를 제거하지 않아 다음 정상 게시글 미리보기가 복구되도록 보정. 기존 대체 이미지 정책 유지.
- [x] Edge 1920 / 1366 / 1025 / 1024 / 375px 검증. 제목·이미지·alt·상세 링크 일치, 파란 배경·흰 글씨·화살표 회전, 키보드 포커스, 상세 클릭 이동, 화면 크기 변경, 넓은 터치 기기, 이미지 오류 복구, API 실패 시 섹션 숨김 확인. 새 JS 오류·가로 넘침 없음. PC/Mobile 화면 및 JS 구문·Git diff 공백 검사 통과.
- 검증 데이터는 브라우저 응답에만 주입했으며 실제 게시글/DB/운영 서버는 변경하지 않음.
- 수정 파일: css/common.css, js/index.js, RESPONSIVE_PROGRESS.md.
- 적용 범위: 로컬 프로젝트. 운영 업로드 및 Git commit/push 미수행.
- Current: Media & News 데스크톱 호버 구현·검수 완료.


## Media & News 호버 모서리 — 2026-10-12
- [x] PC/노트북 행 호버·키보드 포커스 시 파란 배경과 함께 모서리를 24px로 260ms 동안 부드럽게 전환. 호버 해제 시 원복. 기존 적용 범위 유지.
- 수정 파일: css/common.css, RESPONSIVE_PROGRESS.md.


## Media & News 사각형 복구 — 2026-10-12
- [x] 사용자 요청으로 직전에 추가한 24px 모서리 및 border-radius transition만 제거. 기존 사각형 파란 배경·흰 글씨·화살표 회전·좌측 미리보기 전환 유지.
- 수정 파일: css/common.css, RESPONSIVE_PROGRESS.md.


## Media & News 제목 높이 고정 — 2026-10-12
- [x] 데스크톱 미리보기 제목 영역을 현재 글꼴/줄높이 기준 두 줄(2lh)로 고정. 최대 두 줄 표시로 긴 제목에서도 높이 유지. 글씨 크기는 변경하지 않음.
- [x] Edge 1920 / 1366 / 1025px에서 한 줄/긴 제목 호버 전환 전후 좌측 패널·이미지·제목 및 우측 리스트의 문서 좌표와 높이가 동일함을 확인. 상세 링크 전환·가로 넘침 검사 통과.
- 수정 파일: css/common.css, RESPONSIVE_PROGRESS.md. 로컬 프로젝트에 반영.


## 배포 후 교육일정 더미 데이터 복원 문제 — 2026-10-13
- [x] 원인 확인: 10/12 17:02 a02811e에는 부산 일·월/서울 수·목 4개 반과 교육장별 예약 링크가 있었으나, 17:50 2655cc9(프로모션 더미데이터 삭제 후 실제 데이터 입력)에서 scheduleData가 예전 기간형 더미 5개로 함께 교체됨. location 누락으로 모두 부산에 분류되고 서울은 0개가 됨.
- [x] 운영 http://dugolbi.com/js/modify.js를 캐시 우회 요청하여 같은 더미 데이터를 확인. 어제 18:17 커밋 f9d0fa3 내용과 줄바꿈 정규화 후 일치함. 원격 업로드 누락만의 문제가 아니라 로컬 파일에도 더미가 존재하는 상태였음.
- [x] a02811e의 scheduleBookingUrls 및 scheduleData 부분만 복구. 프로모션 원고/이미지·수료지점·사업정보 등 나머지 modify.js 내용은 변경 전과 동일함을 검사.
- [x] 추가 배포 문제: 18:18 실행은 로컬 modify.js 29131 bytes / 원격 29102 bytes인데 같은 분의 수정 시간으로 업로드 생략, 종료코드 0. deploy.txt의 synchronize 비교에 -criteria=either를 추가해 시간과 크기를 함께 비교하도록 보완. 같은 시간·같은 크기의 내용 변경까지 검출하는 내용 비교 기능은 아님.
- [x] Edge 1920 / 1366 / 1024 / 375px에서 부산/서울 각 2개, 요일별 날짜 강조, 10:00 / 15:30, 선택 전후 예약 링크 및 새 창 연결, 모바일 바텀시트 확인. 새 JS 오류·가로 넘침 없음. JS 구문·Git diff 공백 검사 통과.
- 수정 파일: js/modify.js, deploy.txt, RESPONSIVE_PROGRESS.md.
- 적용 범위: 로컬 복구 완료. 이번 작업에서는 운영 재배포 및 Git commit/push 미수행. deploy.bat 재실행 필요.
- Current: 로컬 일정 복구·검수 완료. 운영 서버는 재배포 대기.


## 10월 이달의 교육 기간 확정 — 2026-10-14
- [x] educationData의 기간을 2026-10-01~2026-10-31로 변경하고 temporary:false로 임시 일정 표시 제거.
- [x] 이달의 교육 목록 및 상세 화면에서 2026.10.01~2026.10.31 표시, 임시 일정 문구 없음 확인. JS 구문·Git diff 공백 검사 통과.
- 수정 파일: js/modify.js, RESPONSIVE_PROGRESS.md. 로컬 반영 완료. 운영 업로드 및 Git commit/push 미수행.
- 대시보드 구현은 사용자 요청에 따라 오늘 10:47(한국 시간) 이 대화에서 한 번 재개하도록 예약.
