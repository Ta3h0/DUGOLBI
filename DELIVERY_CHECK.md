# 업체 전달 전 확인 기록 — 2026-10-06

## 현재 구조
- 총 21개 production 페이지. HTML 안의 PHP include로 공통 header/footer를 불러옵니다.
- CSS는 `css/reset.css`, `css/common.css`. 페이지 전용 스타일과 media query는 common.css의 기존 페이지 구역을 유지합니다.
- `js/common.js`: header, 외부/미연결 링크, 공통 문구, 지도. `js/index.js`: 메인/FAQ/상담폼.
- `js/modify.js`: 교육/프로모션/일정 데이터. `content.js`: 렌더링 공통 도우미/더보기.
- `category-filter.js`, `curriculum.js`, `brand-story.js`, `montly.js`, `montly-detail.js`, `promotion.js`, `schedule.js`: 기존 기능 역할 유지.
- `inquiry-session.php`: 상담 신청 화면/메일 endpoint의 세션 설정 공통 파일.
- `router.php`는 로컬 PHP 내장 서버용입니다. 실제 서버 설정 파일이 아닙니다.

## 실제 수정
1. 일정 예약 연결: 첫 번째 educationData 주소의 공통 사용을 제거하고 선택한 scheduleData 항목의 `naverBookingUrl`을 사용합니다. 모든 기존 일정에 빈 필드를 추가했습니다. 유효한 HTTP(S) 실제 URL을 넣으면 자동 연결됩니다.
2. 값 없는 예약/SNS/정책 링크: 화면에 유지하되 aria-disabled와 준비 중 안내를 제공하고 클릭으로 페이지가 위로 이동하거나 빈 새 탭이 열리지 않도록 했습니다. 실제 URL은 추측하지 않았습니다.
3. 일정 팝업: 배경막 선택자가 body의 열림 상태를 찾지 못하던 오류를 수정했습니다. Escape/배경 클릭/스크롤/포커스 복귀/화면 크기 변경 동작 검증.
4. 상담폼: 입력 길이/전화번호/동의 검증, 전송 중 버튼 잠금, 실패 시 입력 보존, JSON 응답/오류 상태, JS 미사용 시 기존 HTML 응답 유지. 성공 alert/메인 이동 유지.
5. 서버 검증: CSRF 세션 토큰, 같은 브라우저 세션의 10초 재전송 제한, 배열/제어문자/과대 요청 검증, UTF-8 검증 및 mbstring 없는 환경의 글자 수 검증 대체 처리. 수신 주소/testAdmin 분기는 그대로 유지했습니다.
6. 한글 2,000자 문의가 URL 인코딩 등으로 기존 8KB 요청 제한을 넘을 수 있어 요청 한도를 64KB로 조정했습니다. 문의 2,000자 제한 자체는 유지합니다.
7. 교육/프로모션: 빈 데이터 안내, 6개 단위 더보기 유지, 존재하지 않는 상세 id가 다른 첫 항목을 보여주던 오류 수정. 없는 이미지 주소/전화번호로 잘못된 요소를 만들지 않도록 처리.
8. 로고 404: 기존 로고를 영문 파일명 `images/introduce/dugolbi-che.svg`로 복사하고 8개 페이지 참조를 갱신. 기존 원본은 유지. 기존 브랜드 로고를 favicon으로 지정해 기본 favicon 404도 해소.
9. 경로: 공통 include를 `__DIR__` 기준으로 변경해 서버 document root가 달라도 페이지와 같은 폴더의 header/footer를 사용합니다. 폼 action/응답 이동 경로도 같은 폴더 기준으로 정리했습니다. 로컬 router는 인코딩 경로를 해석하고 프로젝트 외부 경로 접근을 거부합니다.
10. AGENTS.md에 현재 CSS 통합/include 규칙 반영. 이전 정리 문서에 역사 기록임을 명시하고 최신 문서 연결. 기존 기록은 보존했습니다.

## 받아야 할 값 / 원고
- [필요 정보] `js/modify.js` educationData의 실제 네이버 예약 URL.
- [필요 정보] `js/modify.js` scheduleData 각 일정의 실제 네이버 예약 URL(과정마다 다르면 각각 입력).
- [필요 정보] `footer.html` 카카오톡/인스타그램 실제 URL.
- [필요 원고] `footer.html` 개인정보처리방침/이용약관의 원문 및 연결 방식/주소. 상담폼 동의 문구의 최종 확인.
- [필요 원고] `brand-story.html` POINT 2~4 제목/본문/이미지. 저장소 참고 이미지에는 POINT 1만 확인되며 나머지 확정 원고는 없습니다.
- [필요 원고] `signature03.html` 신결비 소개/POINT/커리큘럼. 메인 FAQ에는 과정 차이의 짧은 설명만 있으며 상세 원고는 없습니다. 현재 두골비 복제 원고를 임의로 재작성하지 않았습니다.
- [필요 정보] 교육 1건의 실제 일정/시간/가격/할인/교육 내용. 현재 temporary 플래그와 임시 일정 표시 유지.
- [필요 정보] 일정 5건 중 예시 4건의 실제 일정/과정. 실제 데이터와 예시를 임의 삭제하거나 변경하지 않았습니다.
- [필요 정보] 프로모션 5건의 확정 제목/설명/기간/이미지. 현재 동일 오픈 이벤트가 반복되며 설명에는 데콜테 교육 문구가 섞여 있습니다.
- [확인 필요] `mail-send.php` 일반 수신자 `contact@liumspace.com` 유지 여부, `testAdmin` 입력 시 별도 수신자 분기 유지 여부.
- [확인 필요] 배포 환경의 발신 주소 `RESERVATION_FROM_EMAIL`, mail()/SMTP 정책 및 실제 수신 확인.

## 보류 사항 / 결정 조건
- 그누보드: 저장소에 기존 그누보드/DB/서버 연동 구조가 없습니다. 설치 위치, 게시판 식별자, 권한/작성 운영 방식을 결정해야 목록·상세·검색·작성·권한·페이지네이션을 연결할 수 있습니다. 새 DB나 임시 게시글은 추가하지 않았습니다. 실제 행/제목 테스트는 그누보드 연동 후 수행합니다.
- 미완성 콘텐츠/외부 링크/정책 문서: 확정 원고와 실제 값이 들어와야 완료됩니다. 사실/법적 내용을 임의 작성하지 않았습니다.
- 실제 호스팅: 서버 종류/설정이 없어 .htaccess/nginx 설정은 추가하지 않았습니다. 서버에서 .html PHP 실행과 메일 설정을 확인해야 합니다.
- 실제 iOS/Android 기기: 이번 검증은 Chrome의 화면 너비 및 브라우저 자동화입니다. 실기기의 키보드/전화 연결/터치/안전 영역은 아침에 확인해야 합니다.

## 배포 확인
- 모든 .html에서 PHP가 실행되어야 합니다. HTML 파일을 정적 호스팅에 올리면 include와 상담 세션 토큰이 실행되지 않습니다.
- index.html은 세션 토큰을 생성합니다. PHP 세션 저장 경로가 쓰기 가능해야 하며 페이지 전체를 정적/CDN 캐시로 공유하지 않아야 합니다.
- 이번 로컬 검증 PHP 버전은 8.4.4입니다. session cookie SameSite 옵션에는 PHP 7.3 이상이 필요합니다. 서버의 PHP 버전/세션/메일 지원을 확인하세요.
- mbstring이 있으면 사용하며 없어도 UTF-8 글자 수 검증이 가능합니다.
- 발신 주소 미설정 상태의 localhost에서는 실제 메일 설정 안내가 나오는 것이 정상입니다. 실제 서버에서 발신 도메인과 mail() 전달/최종 수신을 별도로 확인해야 합니다.
- 재전송 제한은 세션 단위의 기본 보호입니다. 대규모 봇/서버 전체 전송 제한은 운영 정책 결정 후 대응합니다.
- 외부 Pretendard/Swiper/Kakao 지도는 네트워크가 필요합니다. 지도 로딩 실패 시 기존 대체 이미지가 유지됩니다.
- 새 파일 `inquiry-session.php`와 `images/introduce/dugolbi-che.svg`를 배포에 포함하세요. ai/개발 도구/검증용 임시 파일은 production에 올리지 마세요.

## 검증 결과
- 작업 전/수정 후/최종: 각각 21페이지 × 8너비 = 168조합. 최종은 기본 애니메이션 켜고 실행.
- Desktop: 1920/1440/1280. Tablet: 1024/768. Mobile: 430/390/360.
- 최종 모든 조합에서 header/footer 각 1개, 중복 ID 없음, 이미지 실패 없음, console/page 오류 없음, 문서 가로 넘침 없음.
- 수정 전후 1920/1440에서 주요 section/header/footer 위치·크기 비교: 1px 초과 차이 없음.
- header 메뉴는 1439/1025/1024/769/768/390/360 경계에서 상태/닫기/포커스/resize 확인.
- FAQ, 브랜드 슬라이더/카드, 창업/성장 커리큘럼, 임상/네트워크 필터·페이지네이션 통과.
- 일정: PC/모바일 과정별 URL, 짧은 화면 팝업 스크롤, 배경 클릭, Escape, 포커스 복귀, resize 초기화, 날짜 검증/빈 데이터/월 선택 통과.
- 교육/프로모션: 0/1/13개 데이터, 6개 단위 더보기, 잘못된 상세 id, 긴 제목 통과. 검증 데이터는 브라우저 요청 대체에만 사용했으며 최종 파일에 남기지 않았습니다.
- 커뮤니티: 4개 페이지의 기존 빈 표/5열/colspan/스크롤 wrapper 유지 확인. 게시판 파일에 임시 데이터 없음. 실제 게시글 검증은 보류.
- 상담: JSON 실패 시 입력 유지, pending 동안 중복 제출 차단, 동의 누락 서버 거부 확인.
- PHP 메일 endpoint: 성공/실패/잘못된 입력/CSRF/중복 제출 등 23사례 통과. mail 함수를 대체한 격리 검증으로 실제 이메일을 보내지 않았습니다. mbstring 없는 검증도 통과.
- HTML/PHP 출력, JS 11개/PHP 3개/HTML 문법, 로컬 경로/앵커/대소문자 검사 통과. document root가 다른 환경에서도 header/footer 출력 확인.
- production의 /ai/로컬 절대 경로/localhost/삭제된 signature.html/디버그 로그 참조 없음.
- 실제 예약/SNS/정책 URL은 미연결 상태로 남아 있습니다. 실제 호스팅/실메일/실기기 검증은 위 항목에 따라 필요합니다.
- commit/push 하지 않았습니다. 작업 시작 시 Git 변경은 없었습니다.

## 아침 10~20분 체크
1. 변경분과 새 파일이 모두 배포되는지 확인. 실제 배포 URL에서 PC 메인/소개 화면의 header/footer/로고 확인 (3분).
2. 실제 휴대폰에서 메뉴 열기/닫기, 교육일정 클릭→달력 스크롤→닫기, 상담 입력/키보드 확인 (4분).
3. 수신 주소/testAdmin 여부 확인 후 실제 서버에서 상담 1건 전송하고 수신함까지 확인 (3~5분).
4. 브랜드 POINT 2~4/신결비 복제 원고/예시 일정/반복 프로모션을 업체 검토 항목으로 표시하고 확정 원고 요청 (3분).
5. 예약·SNS·정책 URL과 그누보드 연결 범위를 업체에 요청. 커뮤니티는 현재 정적 빈 게시판임을 안내 (2분).

## 변경 파일 전체
- `AGENTS.md`
- `CSS_MERGE_PROGRESS.md`
- `DELIVERY_CHECK.md`
- `PC-REFACTOR.md`
- `RESPONSIVE_PROGRESS.md`
- `advanced.html`
- `brand-story.html`
- `css/common.css`
- `growth.html`
- `images/introduce/dugolbi-che.svg`
- `index.html`
- `inquiry-session.php`
- `introduce-educators.html`
- `introduce.html`
- `js/common.js`
- `js/content.js`
- `js/index.js`
- `js/modify.js`
- `js/montly.js`
- `js/promotion.js`
- `js/schedule.js`
- `mail-send.php`
- `montly-detail.html`
- `montly.html`
- `network.html`
- `news.html`
- `notice.html`
- `promotion-detail.html`
- `promotion-preview.html`
- `qna.html`
- `results.html`
- `review.html`
- `router.php`
- `schedule.html`
- `signature01.html`
- `signature02.html`
- `signature03.html`
- `startup.html`
