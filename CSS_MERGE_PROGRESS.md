# CSS Merge Progress

> 현재 구조 안내 (2026-10-06): 아래 내용은 당시 작업 기록입니다. 현재 사이트는 21개 페이지이며, 스타일은 `css/reset.css`와 `css/common.css`를 사용합니다. 예전 페이지별 CSS는 삭제되었고 `signature.html`은 `signature01.html`로 변경되었습니다. 두골체/신결비는 `signature02.html`/`signature03.html`입니다. 최신 운영 확인 사항과 수정 결과는 [DELIVERY_CHECK.md](DELIVERY_CHECK.md)를 먼저 확인하세요.


기준: 2026-10-02 현재 파일. CSS 통합은 완료되어 있으며 다시 수행하지 않음.
기존 페이지별 CSS 19개는 전체 페이지 검수 통과 후 삭제 완료.
이전 CSS 통합 검수 기록이 불완전하므로 아래 페이지는 이번 세션에서 확실하게 검증한 뒤 체크.

## Current / Next
- Current: CSS 통합 회귀 검수 및 페이지별 CSS 삭제 완료
- Next: 미완료 작업 없음. 운영 게시글·실기기·폼 실제 전송은 운영 확인 대상.
- 절차: 페이지 브라우저 확인 → 필요한 common.css 수정 → 즉시 체크 → 다음 페이지.

## 페이지 회귀 검수
- [x] index.html
- [x] brand-story.html
- [x] schedule.html
- [x] montly-detail.html
- [x] signature.html
- [x] advanced.html
- [x] startup.html
- [x] growth.html
- [x] introduce.html
- [x] introduce-educators.html
- [x] network.html
- [x] results.html
- [x] montly.html
- [x] promotion-preview.html
- [x] promotion-detail.html
- [x] notice.html
- [x] qna.html
- [x] review.html
- [x] news.html

## 삭제 / 최종 검수
- [x] 삭제 대상 목록과 HTML 참조 없음 확인
- [x] 19개 페이지 모두 통과 후 기존 페이지별 CSS 삭제
- [x] 삭제 후 stylesheet / asset 경로 검사
- [x] 삭제 후 전체 페이지 최종 smoke test

## 삭제 완료 파일 (19개)
- css/index.css
- css/brand-story.css
- css/introduce.css
- css/introduce-educators.css
- css/network.css
- css/results.css
- css/signature.css
- css/advanced.css
- css/startup.css
- css/growth.css
- css/montly.css
- css/montly-detail.css
- css/promotion-preview.css
- css/promotion-detail.css
- css/schedule.css
- css/notice.css
- css/qna.css
- css/review.css
- css/news.css

## 유지 파일
- css/reset.css: 내용 수정하지 않음.
- css/common.css: 통합 완료 상태를 그대로 기준으로 검수. 발견한 통합 회귀만 수정.

## 검수 기록
- 필수 폭 1440 / 1024 / 768 / 375px. 필요 시 1920 / 480 / 1439 / 1025 / 769px 추가.
- www.zip의 staged 삭제 / untracked 상태는 사용자 변경이며 그대로 둠.
- JS / 운영 데이터 / PHP / mail-send.php 변경하지 않음. Commit / push 하지 않음.
- 통합 전 CSS / HTML 스냅샷: C:/Users/Public/Documents/ESTsoft/CreatorTemp/dugolbi-css-merge-20261002/source-before.json
- index.html: 1920/1440/1439/1025/1024/769/768/480/375px 화면, 공통 메뉴·ESC·Swiper·폼 배치 통과. 4개 필수 폭 overflow/이미지/콘솔/CSS 로드 정상. 통합 전 section 위치·크기 유지. 폼 전송하지 않음.
- brand-story.html: 9개 폭 화면·통합 전 section 크기/위치 통과. custom carousel 다음/이전·counter·active 이미지 정상, Desktop history sticky와 Mobile static 유지. 양방향 carousel 기존 reduced-motion 환경에서 정지(기존 규칙). CSS/이미지/콘솔/overflow 정상.
- schedule.html: 9개 폭 배치·CSS 로드·이미지·콘솔·overflow·기존 geometry 통과. PC sticky top150px/18일 기간 강조, Mobile dialog·ESC·focus trap·예약 링크, 연도/월 선택·빈 일정 확인. 데이터와 링크 그대로 유지.
- montly-detail.html: 10개 body-root 선택자에 중복 descendant가 생긴 통합 회귀 수정(common.css만 수정, specificity 유지). 9개 폭 재검수 모두 통과. 가격 좌측 정렬·이미지/정보 stack·예약 아이콘·전화번호 클립보드 복사 확인. geometry/콘솔/overflow/CSS 로드 정상.
- signature.html: 1440/1024/768/375px 통합 전 section geometry 유지. 커리큘럼 모바일 세로 표·다열 카드 재배치·공통 header/footer·CTA 확인. CSS/이미지/콘솔/overflow 정상. 통합 회귀 없음.
- advanced.html: 4개 필수 폭 geometry/CSS/콘솔/이미지/overflow 통과. 이미지 비율·모바일 표 세로 재배치·공통 UI 확인. 통합 회귀 없음.
- startup.html: 4개 필수 폭 geometry/CSS/이미지/콘솔/overflow 통과. 커리큘럼 터치·Enter 열기/닫기·한 항목만 펼침 확인, 원래 첫 항목 상태 복구. 통합 회귀 없음.
- growth.html: 4개 필수 폭 geometry/CSS/이미지/콘솔/overflow 통과. 8주 커리큘럼 터치·Enter·단일 항목 펼침 확인. 원래 2주차 펼침 유지. 통합 회귀 없음.
- introduce.html: 4개 필수 폭 통과. 대표 소개·INFORMATION stack·지도 full width·네이버/카카오/전화 href 확인. 통합 전 section geometry/CSS/이미지/콘솔/overflow 정상. 통합 회귀 없음.
- introduce-educators.html: 4개 필수 폭 geometry/CSS/이미지/콘솔/overflow 통과. 강사진 원형 이미지 비율·프로필 column 재배치·공통 INFORMATION 확인. 통합 회귀 없음.
- network.html: 4개 필수 폭 geometry/CSS/이미지/콘솔/overflow 통과. 서울 필터 7개·부산 빈 결과·전국 복구, 필터 wrapping·목록/페이지 버튼 disabled 상태·INFORMATION 확인. 통합 회귀 없음.
- results.html: 4개 필수 폭 geometry/CSS/이미지/콘솔/overflow 통과. 두골체 1개 결과·전체 복구, 전후 비교 이미지 비율·목록/페이지 버튼 상태·INFORMATION 유지. 통합 회귀 없음.
- montly.html: 4개 필수 폭 통과. 교육 목록 가격 우측 정렬·상세 가격 좌측 정렬 구분, 기간/시간 세로 배치·얼리버드 chip·modify.js 콘텐츠 및 상세 id 링크 유지. geometry/CSS/이미지/콘솔/overflow 정상.
- promotion-preview.html: 4개 필수 폭 geometry/CSS/이미지/콘솔/overflow 통과. 5개 운영 프로모션·id 상세 링크·disabled 더보기 정상. 모바일 카드 1열·포스터 비율·커뮤니티 내부 스크롤 유지(문서 가로 overflow 없음). 통합 회귀 없음.
- promotion-detail.html: 4개 필수 폭 geometry/CSS/이미지/콘솔/overflow 통과. 운영 데이터 제목/기간/본문·포스터 비율·뒤로가기 링크 정상. 통합 회귀 없음.
- notice.html: 4개 필수 폭 geometry/CSS/이미지/콘솔/overflow 통과. 현재 빈 게시판 5개 column/Total/empty 상태, 커뮤니티 active와 내부 스크롤, footer 정상. 실제 게시글/페이지 처리 기능은 현재 없음(운영 연결 후 확인). 통합 회귀 없음.
- qna.html: 4개 필수 폭 geometry/CSS/이미지/콘솔/overflow 통과. 현재 빈 Q&A 표·column·active nav·footer 정상. 실데이터 기능 운영 연결 후 확인 필요. 통합 회귀 없음.
- review.html: 4개 필수 폭 geometry/CSS/이미지/콘솔/overflow 통과. 현재 빈 후기 표·column·active nav·footer 정상. 실데이터 기능 운영 연결 후 확인 필요. 통합 회귀 없음.
- news.html: 4개 필수 폭 geometry/CSS/이미지/콘솔/overflow 통과. 현재 빈 언론보도 표·column·active nav·footer 정상. 실데이터 기능 운영 연결 후 확인 필요. 통합 회귀 없음.

- 삭제 안전 확인: 모든 삭제 대상의 절대 경로가 프로젝트 css 디렉터리 내부임을 확인. reset.css/common.css 제외.

- 삭제 후 정적 경로 감사: HTML/CSS/JS의 로컬 stylesheet·script·image·background·내부 페이지 경로 190개 파일 확인, 누락 없음. CSS 디렉터리는 common.css/reset.css 2개만 유지.

## 최종 결과
- 19/19 페이지 회귀 검수 완료, 삭제 전 HTML stylesheet 참조 감사 완료, 19개 페이지별 CSS 삭제 완료.
- 삭제 후 19/19 페이지 × 1440/1024/768/375px (76 화면) 최종 smoke test 통과.
- 추가 경계 검수: index/brand-story/schedule/montly-detail에서 1920/1439/1025/769/480px. 전체 검수 높이 900px.
- 최종 공통 메뉴 열기·아코디언·ESC 닫기, brand-story PC custom carousel 다음/이전·preview·history sticky, montly-detail PC 전화번호 복사, schedule Mobile bottom sheet/18일 강조 재확인.
- 삭제 후 로컬 경로 190개 검사, 누락 없음. 모든 실제 HTML은 reset.css/common.css 2개만 로드. 콘솔 오류·stylesheet 로드 실패·깨진 이미지·문서 horizontal overflow 없음.
- common.css 변경: montly-detail body 클래스 대상 선택자 10개를 :where(body).montly-detail 형태로 복구. 기존 specificity 및 선언 유지. 통합을 재실행하지 않음.
- 수정 범위: common.css 선택자 10개, CSS_MERGE_PROGRESS.md 신규 기록, 페이지별 CSS 19개 삭제. reset.css/HTML/JS/modify.js/PHP/mail-send.php/www.zip 변경하지 않음. Commit/push 없음.
- 참고: community-nav와 게시판의 의도된 내부 가로 스크롤은 유지. 현재 게시판은 빈 상태이고 활성 pagination이 없으며 disabled 버튼은 기존 상태 유지.
- 직접 확인 필요: 실제 iOS/Android의 전화 연결·모바일 터치, OS reduced-motion 해제 상태의 지속 애니메이션, 운영 게시글/페이지 처리 및 mail-send.php 실제 전송. 폼 실전송/외부 예약 전송은 실행하지 않음.
- 증거: C:/Users/Public/Documents/ESTsoft/CreatorTemp/dugolbi-css-merge-20261002/final-smoke.json, final-path-audit.json, regression-checks.json.
- 최종 화면: C:/Users/82104/.codex/visualizations/2026/09/28/01a0e581-190a-7f41-8677-3f9f6c88c9d4/css-merge-schedule-mobile.png.
