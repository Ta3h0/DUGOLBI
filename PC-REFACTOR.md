# PC 코드 구조 정리 결과

## 1. 변경 파일

### 생성

- `css/index.css`
- `js/category-filter.js`
- `js/content.js`
- `js/curriculum.js`
- `js/index.js`

- `PC-REFACTOR.md`: 변경 내역과 반응형 작업 전 확인 사항.

### 수정

- `css/advanced.css`
- `css/brand-story.css`
- `css/common.css`
- `css/growth.css`
- `css/introduce-educators.css`
- `css/introduce.css`
- `css/montly.css`
- `css/network.css`
- `css/news.css`
- `css/notice.css`
- `css/promotion-detail.css`
- `css/promotion-preview.css`
- `css/qna.css`
- `css/results.css`
- `css/review.css`
- `css/signature.css`
- `css/startup.css`
- `growth.html`
- `index.html`
- `js/common.js`
- `js/montly.js`
- `js/promotion.js`
- `montly-detail.html`
- `montly.html`
- `network.html`
- `promotion-detail.html`
- `promotion-preview.html`
- `results.html`
- `startup.html`

`reset.css`, `header.html`, `footer.html`, `router.php`, 기존 콘텐츠 데이터 `js/modify.js`, 원본 `/ai`와 production 이미지는 변경하지 않았다. 강사소개 CSS의 이전 작업 보정값도 유지했다.

## 2. common.css로 이동한 항목

- 서브페이지 기본 색상과 배경, 상단 728px 영역의 동일한 크기·타이포그래피·구분선.
- 서브페이지 헤더의 투명 배경·로고·메뉴·CTA 상태.
- 교육과정 소개의 동일한 2열 배치, 포인트 카드, 창업/성장 커리큘럼의 동일한 스타일.
- INFORMATION 및 지도 링크/상담 버튼의 동일한 스타일.
- 목록 필터, 빈 결과, 페이지 번호와 공통 문구 영역.
- 커뮤니티 탭, 페이지 버튼, 정적 게시판 테이블.

기존 선택자와 명시도를 보존했다. 동일한 컴포넌트에서 선언값까지 같은 규칙을 81개 그룹으로 묶고 반복 규칙 370개를 통합했다. `.container`, 제목, 기본 버튼과 reset은 기존 정의를 유지했다. 공통 스타일은 컴포넌트별 주석으로 구분했다.

## 3. 페이지 CSS에 유지한 항목

- 상단 배경 이미지, 브랜드 스토리의 별도 상단 구성과 높이, 프로모션 상세 상단 예외.
- 페이지별 section 여백, 카드 수·그리드 폭·이미지 크기, 표의 세부 디자인.
- 대표/강사 프로필, 브랜드 슬라이더와 sticky 연혁, 일정 달력, 교육 상세와 페이지별 색상·굵기 차이.
- 메인 전체 스타일과 메인 헤더 상태는 `css/index.css`에 분리.

sub-top HTML과 콘텐츠는 각 HTML에 유지했다. HTML 클래스는 변경하지 않았다. 메인의 section-bg 인라인 여백 한 개만 페이지 CSS로 옮겼다.

## 4. JS 구분

| 파일 | 역할 / 사용 페이지 |
| --- | --- |
| `js/common.js` | 모든 페이지의 기존 헤더·메가 메뉴·공통 메뉴 상태 |
| `js/index.js` | 메인 스크롤 문구와 Swiper 초기화 |
| `js/category-filter.js` | network/results의 동일한 필터 기능 |
| `js/curriculum.js` | startup/growth의 동일한 패널 열기·닫기 |
| `js/content.js` | montly/promotion 렌더링의 동일한 HTML 이스케이프·줄바꿈 처리 |
| `js/brand-story.js` | 기존 브랜드 슬라이더, 유지 |
| `js/montly.js`, `js/montly-detail.js` | 기존 교육 콘텐츠 렌더링 및 전화번호 처리, 유지 |
| `js/promotion.js` | 기존 프로모션 목록·상세 렌더링, 유지 |
| `js/schedule.js` | 기존 달력과 일정 선택, 유지 |
| `js/modify.js` | 기존 정적 콘텐츠 데이터, 유지 |

기존 초기화 순서와 DOMContentLoaded 방식을 유지했다. 헤더·메인·필터·커리큘럼 함수 본문은 변경 전 코드와 동일하다. 새 기능이나 그누보드/문의 백엔드, 게시판 임시 기능을 추가하지 않았다.

## 5. 제거한 중복 및 미사용 코드

- 페이지마다 반복되던 공통 CSS 선언과 렌더링 도우미 함수.
- 브랜드 슬라이더의 후속 규칙에 완전히 덮어써지는 중복 copy 상태 규칙 3개.
- HTML과 JS에서 생성하지 않는 프로모션 상세 hero-message/line/desc 및 h1 img 선택자.
- 미사용 signature-information 선택자와 통합 과정의 중복 선택자.

사용 여부가 불확실한 파일·에셋과 `www.zip`은 삭제하지 않았다.

## 6. 반응형 전 확인 사항

- 1440px container 안에 1240px 표와 여러 고정폭 2열 그리드가 있다. 이후 중간 화면 폭부터 열 전환·최소 폭 정책이 필요하다.
- PC 전용 hero/강사 영역 높이, 12rem 문구, 긴 약력 텍스트 줄바꿈의 축소 정책이 필요하다.
- 브랜드 슬라이더의 절대 위치와 연혁 sticky, 메인 스크롤 영역의 300vh 동작은 별도로 검토해야 한다.
- 공통 `section`의 기본 margin과 각 페이지의 0 margin 예외는 후속 반응형에서 함께 확인해야 한다.
- 기존 media query 30개는 유지했다. 공통 파일·메인 파일·교육 상세 파일에 기존 breakpoint가 분산되어 있으므로 반응형 시작 전에 적용 범위를 정해야 한다. 이번 작업에서 규칙이나 모바일 레이아웃을 추가하지 않았다.
- Pretendard와 Swiper의 외부 CDN 의존은 유지했다. 네트워크 단절 시 로딩은 별도 확인이 필요하다.
- 일부 링크의 `#`, 정적 교육/프로모션/달력 데이터와 문의 form은 기존 퍼블리싱 상태다. 그누보드 연결은 후속 작업에서 다룬다.

## 검증

- PHP 라우터로 전체 19개 페이지 확인. header/footer 각각 한 개 출력.
- 1920×1080에서 18개 서브페이지의 변경 전후 DOM과 주요 computed style(38개 속성 및 before/after) 일치.
- 메인 규칙 원문 이동, 화면 확인 및 기존 두 Swiper 초기화 확인. 자동 생성 id·슬라이드 전환 시점은 비교에서 분리.
- network/results 필터, startup/growth 패널, 브랜드 슬라이더와 스크롤 헤더 동작 확인.
- 전체 HTML/PHP·JS 문법, 로컬 script/style 경로, diff 공백 검사 통과.
- 정적 초기 상태와 대표 인터랙션을 검증했다. 모든 애니메이션 시점·외부 링크·전화번호 복사 권한 조합까지 검증한 것은 아니다.
