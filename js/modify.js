const educationData = [
    {
        "id": 1,
        "title": "어깨 통증을 이해하는\n 데콜테 실전 테크닉",
        "category": "10월 이달의 교육",
        "image": {
            "src": "images/promotion/decollete-popup-v1.png",
            "alt": "어깨 통증을 이해하는 데콜테 실전 테크닉 교육 안내",
            "previewAlt": "어깨 통증을 이해하는 데콜테 실전 테크닉 교육 안내 포스터",
            "width": 1254,
            "height": 1254
        },
        "posterLabel": "데콜테 실전 테크닉 상세 보기",
        "badge": "얼리버드",
        "startDate": "2026-10-24",
        "endDate": "2026-10-30",
        "temporary": true,
        "durationHours": 3,
        "originalPrice": 1000000,
        "discountPercent": 35,
        "description": "목부터 쇄골, 어깨, 팔까지 이어지는 연결을 이해하고,\n 고객의 상태에 맞는 접근과 실전 테크닉을 배웁니다.",
        "introTitle": "“어깨가 불편하다고,\n 어깨만 관리하고 계신가요?”",
        "introParagraphs": [
            "목을 풀어도 다시 불편하고,\n 어깨를 관리해도 팔이 계속 불편하다는 고객.",
            "그렇다면 우리가 보고 있는 곳이\n ‘불편한 곳’에만 머물러 있는 것은 아닐까요?",
            "목 → 쇄골 → 어깨 → 팔은\n 각각 떨어져 있는 구조가 아닙니다.",
            "이번 교육에서는 단순히 데콜테 동작을 배우는 것이 아니라\n 고객의 상태에 따라 무엇을 살펴보고 어디에 접근할 것인지 판단하는 과정을 함께 배웁니다."
        ],
        "introEmphasis": "목 → 쇄골 → 어깨 → 팔",
        "curriculum": [
            {
                "title": "연결을 이해하다",
                "subtitle": "어깨와 연결된 목·상지의 막성 구조",
                "question": "“팔이 불편한데 왜 허리까지 살펴볼까요?”",
                "description": "한 부위의 움직임은 주변 구조와 독립되어 있지 않습니다.\n 목과 흉곽, 어깨, 팔 그리고 몸통으로 이어지는 연결을 이해하면서 보이는 곳과 원인이 항상 같지는 않은 이유를 살펴봅니다."
            },
            {
                "title": "움직임을 이해하다",
                "subtitle": "목·쇄골·어깨·상지 근육의 해부학적 기능",
                "question": "“팔이 저리거나 불편한데 왜 목 주변을 살펴볼까요?”",
                "description": "어떤 근육이 팔을 움직이고, 어떤 구조가 견갑과 쇄골의 위치에 영향을 주는지 이해해야 고객의 상태를 더 입체적으로 볼 수 있습니다."
            },
            {
                "title": "원인을 찾아 적용하다",
                "subtitle": "어깨 불편 유형별 분석과 실전 테크닉",
                "question": "“그래서 어디를, 어떻게 관리해야 할까요?”",
                "description": "관찰 → 움직임 확인 → 연결 부위 파악 → 테크닉 선택까지.\n 현장에서 바로 활용할 수 있도록 원인에 따른 접근 방법을 직접 실습합니다."
            }
        ],
        get phone() { return business_info.phone; },
        get naverBookingUrl() { return business_info.locations.busan.naverUrl; }
    }
];

const promotionList = [
    {
        "id": 1,
        "title": "오픈 기념 이벤트",
        "detailTitle": "두골비체 오픈 기념 이벤트",
        "category": "PROMOTION",
        "image": {
            "src": "images/promotion-preview/opening-event.png",
            "alt": "두골비체 오브제랩 오픈행사",
            "width": 928,
            "height": 928
        },
        "detailImage": {
            "src": "images/promotion-detail/opening-event.png",
            "alt": "두골비체 오브제랩 오픈행사. 신규등록한 회원님께 1:1 강습권을 드립니다. QR코드를 인식하여 상담을 예약해보세요.",
            "width": 1904,
            "height": 1904
        },
        "startDate": "2026-10-01",
        "endDate": "2026-11-13",
        "description": "어깨 통증을 이해하는 데콜테 실전 테크닉\n어깨가 불편하다고, 어깨만 관리하고 계신가요?",
        "paragraphs": [
            "두골비체 오브제랩에서 오픈을 기념하여\n스페셜 오픈 행사를 진행합니다.",
            "신규등록한 회원님께 1:1 강습권을 드립니다.",
            "QR코드 인식 및 전화 문의를 통해\n상담을 예약해보세요."
        ],
        get phone() { return business_info.phone; }
    },
    {
        "id": 2,
        "title": "오픈 기념 이벤트",
        "detailTitle": "두골비체 오픈 기념 이벤트",
        "category": "PROMOTION",
        "image": {
            "src": "images/promotion-preview/opening-event.png",
            "alt": "두골비체 오브제랩 오픈행사",
            "width": 928,
            "height": 928
        },
        "detailImage": {
            "src": "images/promotion-detail/opening-event.png",
            "alt": "두골비체 오브제랩 오픈행사. 신규등록한 회원님께 1:1 강습권을 드립니다. QR코드를 인식하여 상담을 예약해보세요.",
            "width": 1904,
            "height": 1904
        },
        "startDate": "2026-10-01",
        "endDate": "2026-11-13",
        "description": "어깨 통증을 이해하는 데콜테 실전 테크닉\n어깨가 불편하다고, 어깨만 관리하고 계신가요?",
        "paragraphs": [
            "두골비체 오브제랩에서 오픈을 기념하여\n스페셜 오픈 행사를 진행합니다.",
            "신규등록한 회원님께 1:1 강습권을 드립니다.",
            "QR코드 인식 및 전화 문의를 통해\n상담을 예약해보세요."
        ],
        get phone() { return business_info.phone; }
    },
    {
        "id": 3,
        "title": "오픈 기념 이벤트",
        "detailTitle": "두골비체 오픈 기념 이벤트",
        "category": "PROMOTION",
        "image": {
            "src": "images/promotion-preview/opening-event.png",
            "alt": "두골비체 오브제랩 오픈행사",
            "width": 928,
            "height": 928
        },
        "detailImage": {
            "src": "images/promotion-detail/opening-event.png",
            "alt": "두골비체 오브제랩 오픈행사. 신규등록한 회원님께 1:1 강습권을 드립니다. QR코드를 인식하여 상담을 예약해보세요.",
            "width": 1904,
            "height": 1904
        },
        "startDate": "2026-10-01",
        "endDate": "2026-11-13",
        "description": "어깨 통증을 이해하는 데콜테 실전 테크닉\n어깨가 불편하다고, 어깨만 관리하고 계신가요?",
        "paragraphs": [
            "두골비체 오브제랩에서 오픈을 기념하여\n스페셜 오픈 행사를 진행합니다.",
            "신규등록한 회원님께 1:1 강습권을 드립니다.",
            "QR코드 인식 및 전화 문의를 통해\n상담을 예약해보세요."
        ],
        get phone() { return business_info.phone; }
    },
    {
        "id": 4,
        "title": "오픈 기념 이벤트",
        "detailTitle": "두골비체 오픈 기념 이벤트",
        "category": "PROMOTION",
        "image": {
            "src": "images/promotion-preview/opening-event.png",
            "alt": "두골비체 오브제랩 오픈행사",
            "width": 928,
            "height": 928
        },
        "detailImage": {
            "src": "images/promotion-detail/opening-event.png",
            "alt": "두골비체 오브제랩 오픈행사. 신규등록한 회원님께 1:1 강습권을 드립니다. QR코드를 인식하여 상담을 예약해보세요.",
            "width": 1904,
            "height": 1904
        },
        "startDate": "2026-10-01",
        "endDate": "2026-11-13",
        "description": "어깨 통증을 이해하는 데콜테 실전 테크닉\n어깨가 불편하다고, 어깨만 관리하고 계신가요?",
        "paragraphs": [
            "두골비체 오브제랩에서 오픈을 기념하여\n스페셜 오픈 행사를 진행합니다.",
            "신규등록한 회원님께 1:1 강습권을 드립니다.",
            "QR코드 인식 및 전화 문의를 통해\n상담을 예약해보세요."
        ],
        get phone() { return business_info.phone; }
    },
    {
        "id": 5,
        "title": "오픈 기념 이벤트",
        "detailTitle": "두골비체 오픈 기념 이벤트",
        "category": "PROMOTION",
        "image": {
            "src": "images/promotion-preview/opening-event.png",
            "alt": "두골비체 오브제랩 오픈행사",
            "width": 928,
            "height": 928
        },
        "detailImage": {
            "src": "images/promotion-detail/opening-event.png",
            "alt": "두골비체 오브제랩 오픈행사. 신규등록한 회원님께 1:1 강습권을 드립니다. QR코드를 인식하여 상담을 예약해보세요.",
            "width": 1904,
            "height": 1904
        },
        "startDate": "2026-10-01",
        "endDate": "2026-11-13",
        "description": "어깨 통증을 이해하는 데콜테 실전 테크닉\n어깨가 불편하다고, 어깨만 관리하고 계신가요?",
        "paragraphs": [
            "두골비체 오브제랩에서 오픈을 기념하여\n스페셜 오픈 행사를 진행합니다.",
            "신규등록한 회원님께 1:1 강습권을 드립니다.",
            "QR코드 인식 및 전화 문의를 통해\n상담을 예약해보세요."
        ],
        get phone() { return business_info.phone; }
    }
];

const scheduleData = [
    {
        "id": "dugolbi-10",
        get naverBookingUrl() { return business_info.locations.busan.naverUrl; },
        "color": "schedule-color-1",
        "title": "두골비 과정 10기 교육일정",
        "start": "2026-10-11",
        "end": "2026-10-28"
    },
    {
        "id": "sample-signature",
        get naverBookingUrl() { return business_info.locations.busan.naverUrl; },
        "color": "schedule-color-2",
        "title": "시그니처 교육과정",
        "start": "2026-10-03",
        "end": "2026-10-05",
        "temporary": true
    },
    {
        "id": "sample-decollete",
        get naverBookingUrl() { return business_info.locations.busan.naverUrl; },
        "color": "schedule-color-3",
        "title": "데콜테 실전 테크닉",
        "start": "2026-10-08",
        "end": "2026-10-09",
        "temporary": true
    },
    {
        "id": "sample-startup",
        get naverBookingUrl() { return business_info.locations.busan.naverUrl; },
        "color": "schedule-color-4",
        "title": "창업반 실전 교육",
        "start": "2026-10-19",
        "end": "2026-10-23",
        "temporary": true
    },
    {
        "id": "sample-growth",
        get naverBookingUrl() { return business_info.locations.busan.naverUrl; },
        "color": "schedule-color-5",
        "title": "어린이 성장 매니지먼트",
        "start": "2026-10-29",
        "end": "2026-11-03",
        "temporary": true
    }
];


// 수료지점: ID 없이 업체명 가나다순으로 정렬하고 페이지당 8개씩 표시합니다.
// 지점 추가/수정은 name(업체명), certification(인증 구분), region(상세 지역), phone(연락처) 항목을 편집하세요.
// 인증 구분: 공식 강사 / 교육 마스터점 / 교육 인증점 / 교육 수료점
// img: 지점별 이미지 경로를 입력하세요. 빈 문자열("")이면 인증 구분에 맞는 기본 이미지를 사용합니다.
// graduateName: 수료자명. 팝업의 인증명과 설명은 certification에 따라 표시합니다.
const networkData = [
    {
        "name": "두골비오브제랩본점",
        "graduateName": "김미진",
        "certification": "공식 강사",
        "img": "",
        "region": "부산진구",
        "phone": "010-3450-1667"
    },
    {
        "name": "새온에스테틱",
        "graduateName": "권진이",
        "certification": "공식 강사",
        "img": "",
        "region": "부산 명지",
        "phone": "010-6577-6782"
    },
    {
        "name": "매직필라테스",
        "graduateName": "맹정숙",
        "certification": "공식 강사",
        "img": "",
        "region": "서울 노원·강남",
        "phone": "010-7108-5291"
    },
    {
        "name": "제이윤 에스테틱",
        "graduateName": "최자윤",
        "certification": "교육 마스터점",
        "img": "",
        "region": "서울 강서구 방화",
        "phone": "010-4381-0625"
    },
    {
        "name": "케어유에스테틱",
        "graduateName": "정미자",
        "certification": "교육 마스터점",
        "img": "",
        "region": "서울 목동",
        "phone": "010-8940-5857"
    },
    {
        "name": "로인웰니스",
        "graduateName": "윤성아",
        "certification": "교육 마스터점",
        "img": "",
        "region": "서울 청담",
        "phone": "010-5520-6165"
    },
    {
        "name": "자웅에스떼",
        "graduateName": "김자웅",
        "certification": "교육 마스터점",
        "img": "",
        "region": "서울 강서",
        "phone": "010-5419-5395"
    },
    {
        "name": "다결뷰티",
        "graduateName": "오다결",
        "certification": "교육 마스터점",
        "img": "",
        "region": "서울 마포",
        "phone": "010-9328-3093"
    },
    {
        "name": "김기숙힐링숍",
        "graduateName": "김기숙",
        "certification": "교육 마스터점",
        "img": "",
        "region": "서울 중구 을지로",
        "phone": "010-8617-4459"
    },
    {
        "name": "보아스에스테틱",
        "graduateName": "오원숙",
        "certification": "교육 마스터점",
        "img": "",
        "region": "서울 신사동",
        "phone": "010-2305-8490"
    },
    {
        "name": "두윤에스테틱",
        "graduateName": "박윤정",
        "certification": "교육 마스터점",
        "img": "",
        "region": "서울 동작구 흑석동",
        "phone": "010-5136-6388"
    },
    {
        "name": "에바다에스테틱얼굴축소연구소",
        "graduateName": "김연례",
        "certification": "교육 마스터점",
        "img": "",
        "region": "경기 양주",
        "phone": "010-2497-0992"
    },
    {
        "name": "동안비결뷰티얼굴축소연구소",
        "graduateName": "김미선",
        "certification": "교육 마스터점",
        "img": "",
        "region": "경기 평택",
        "phone": "010-7797-9113"
    },
    {
        "name": "배선영에스테틱",
        "graduateName": "배선영",
        "certification": "교육 마스터점",
        "img": "",
        "region": "경기 파주",
        "phone": "010-3630-4071"
    },
    {
        "name": "스킨앤바디Joa",
        "graduateName": "조유신",
        "certification": "교육 마스터점",
        "img": "",
        "region": "경기 용인",
        "phone": "010-7152-4617"
    },
    {
        "name": "플로라스킨케어",
        "graduateName": "김기라",
        "certification": "교육 마스터점",
        "img": "",
        "region": "경기 안양·인덕원",
        "phone": "010-5314-3343"
    },
    {
        "name": "바른결by김현숙",
        "graduateName": "김현숙",
        "certification": "교육 마스터점",
        "img": "",
        "region": "경기 부천 신중동역",
        "phone": "010-3154-8846"
    },
    {
        "name": "바른몸케어",
        "graduateName": "허유경",
        "certification": "교육 마스터점",
        "img": "",
        "region": "경기 고양시 일산 백석동",
        "phone": "010-6216-5843"
    },
    {
        "name": "라움리포벨",
        "graduateName": "최미선",
        "certification": "교육 마스터점",
        "img": "",
        "region": "대전 서구",
        "phone": "010-2777-5761"
    },
    {
        "name": "지연스킨앤바디",
        "graduateName": "나지연",
        "certification": "교육 마스터점",
        "img": "",
        "region": "경북 포항",
        "phone": "010-4537-8342"
    },
    {
        "name": "비체 스킨&바디랩",
        "graduateName": "유민정",
        "certification": "교육 마스터점",
        "img": "",
        "region": "부산 서구",
        "phone": "010-4568-4162"
    },
    {
        "name": "오오이게 밸런스테라피",
        "graduateName": "오시라",
        "certification": "교육 마스터점",
        "img": "",
        "region": "부산 수영구",
        "phone": "010-7406-0902"
    },
    {
        "name": "로온",
        "graduateName": "유정연",
        "certification": "교육 마스터점",
        "img": "",
        "region": "부산 서면",
        "phone": "010-9346-1250"
    },
    {
        "name": "두골비오브제랩서면점",
        "graduateName": "조아랑",
        "certification": "교육 마스터점",
        "img": "",
        "region": "부산 서면",
        "phone": "010-9175-7709"
    },
    {
        "name": "더바른예뻐지는공간",
        "graduateName": "최나윤",
        "certification": "교육 마스터점",
        "img": "",
        "region": "부산 가야동",
        "phone": "010-9335-0085"
    },
    {
        "name": "리셋뷰티(舊 몸이좋아지는 PTT)",
        "graduateName": "김서은",
        "certification": "교육 마스터점",
        "img": "",
        "region": "부산 동래",
        "phone": "010-9507-7005"
    },
    {
        "name": "미주핏",
        "graduateName": "박나비",
        "certification": "교육 마스터점",
        "img": "",
        "region": "부산 강서구 명지신도시",
        "phone": "010-2394-6834"
    },
    {
        "name": "율스바디앤스킨",
        "graduateName": "이정희",
        "certification": "교육 마스터점",
        "img": "",
        "region": "부산 금정구",
        "phone": "010-5555-7656"
    },
    {
        "name": "편백더힐링에스테틱",
        "graduateName": "김용자",
        "certification": "교육 마스터점",
        "img": "",
        "region": "부산 수영구",
        "phone": "010-9628-9094"
    },
    {
        "name": "도도하게내추럴하게",
        "graduateName": "김지연",
        "certification": "교육 마스터점",
        "img": "",
        "region": "부산 연제구 연산동",
        "phone": "010-6831-3811"
    },
    {
        "name": "아르떼뷰티",
        "graduateName": "서주연",
        "certification": "교육 마스터점",
        "img": "",
        "region": "부산 하단",
        "phone": "010-9235-4071"
    },
    {
        "name": "바룸앤블룸",
        "graduateName": "엄태현",
        "certification": "교육 마스터점",
        "img": "",
        "region": "창원 진해구",
        "phone": "010-9363-7620"
    },
    {
        "name": "콤마피부관리",
        "graduateName": "김연경",
        "certification": "교육 마스터점",
        "img": "",
        "region": "창원 용호동",
        "phone": "010-4858-0117"
    },
    {
        "name": "더예쁘다스킨케어",
        "graduateName": "문미주",
        "certification": "교육 마스터점",
        "img": "",
        "region": "김해 내외동",
        "phone": "010-3502-1013"
    },
    {
        "name": "채움에스테틱",
        "graduateName": "금이슬",
        "certification": "교육 마스터점",
        "img": "",
        "region": "창원 성산구",
        "phone": "010-4861-7625"
    },
    {
        "name": "여며들다116",
        "graduateName": "정지혜",
        "certification": "교육 마스터점",
        "img": "",
        "region": "경남 양산",
        "phone": "010-5108-9262"
    },
    {
        "name": "수에스테틱",
        "graduateName": "구지수",
        "certification": "교육 마스터점",
        "img": "",
        "region": "경남 김해",
        "phone": "010-9434-5706"
    },
    {
        "name": "라라에스테틱",
        "graduateName": "강영주",
        "certification": "교육 마스터점",
        "img": "",
        "region": "경남 양산시 남부동",
        "phone": "010-6787-0239"
    },
    {
        "name": "미소바른체형관리샵",
        "graduateName": "하경아",
        "certification": "교육 마스터점",
        "img": "",
        "region": "창원 진해 용원",
        "phone": "010-5361-6255"
    },
    {
        "name": "반듯한에스테틱",
        "graduateName": "엄주은",
        "certification": "교육 마스터점",
        "img": "",
        "region": "창원 용원동",
        "phone": "010-3337-2663"
    },
    {
        "name": "청아피부체형관리실",
        "graduateName": "염영숙",
        "certification": "교육 마스터점",
        "img": "",
        "region": "대구 감삼동",
        "phone": "010-5066-2333"
    },
    {
        "name": "큐사랑남목점가온에스테틱",
        "graduateName": "강경숙",
        "certification": "교육 마스터점",
        "img": "",
        "region": "울산 동구 남목",
        "phone": "010-4454-3552"
    },
    {
        "name": "은에스테틱",
        "graduateName": "김나은",
        "certification": "교육 마스터점",
        "img": "",
        "region": "울산 남구 옥동",
        "phone": "010-2847-4032"
    },
    {
        "name": "리디안에스테틱",
        "graduateName": "김혜진",
        "certification": "교육 마스터점",
        "img": "",
        "region": "전북 전주 효자동",
        "phone": "010-4668-1603"
    },
    {
        "name": "치유하는 몸, 마음 센터",
        "graduateName": "유시연",
        "certification": "교육 마스터점",
        "img": "",
        "region": "광주",
        "phone": "010-5098-5505"
    },
    {
        "name": "산후맘출장테라피",
        "graduateName": "염은경",
        "certification": "교육 인증점",
        "img": "",
        "region": "서울 강서구 등촌",
        "phone": "010-2207-7845"
    },
    {
        "name": "에스테틱연 목동점",
        "graduateName": "김정애",
        "certification": "교육 인증점",
        "img": "",
        "region": "서울 양천구",
        "phone": "010-2057-2715"
    },
    {
        "name": "올리즈에스테틱",
        "graduateName": "박지혜",
        "certification": "교육 인증점",
        "img": "",
        "region": "서울 중구",
        "phone": "010-2567-5527"
    },
    {
        "name": "디아에스테틱",
        "graduateName": "김혜선",
        "certification": "교육 인증점",
        "img": "",
        "region": "경기 부천",
        "phone": "0507-1411-5054"
    },
    {
        "name": "산후맘소통테라피",
        "graduateName": "염은경",
        "certification": "교육 인증점",
        "img": "",
        "region": "경기 파주 운정",
        "phone": "010-2207-7845"
    },
    {
        "name": "KJH스킨&아로마테라피",
        "graduateName": "김정희",
        "certification": "교육 인증점",
        "img": "",
        "region": "부산 사하구",
        "phone": "010-9311-9685"
    },
    {
        "name": "우연우의바디리셋",
        "graduateName": "우연우",
        "certification": "교육 인증점",
        "img": "",
        "region": "대구 수성구",
        "phone": "010-9551-0987"
    },
    {
        "name": "이뻐지는시간",
        "graduateName": "탁영지",
        "certification": "교육 인증점",
        "img": "",
        "region": "경남 통영",
        "phone": "010-8924-6123"
    },
    {
        "name": "보결샵",
        "graduateName": "차보결",
        "certification": "교육 인증점",
        "img": "",
        "region": "울산 북구",
        "phone": "010-8232-8950"
    },
    {
        "name": "채움스킨바디",
        "graduateName": "이수희",
        "certification": "교육 인증점",
        "img": "",
        "region": "울산 북구 달천동",
        "phone": "010-8860-5589"
    },
    {
        "name": "도깨비언니에스테틱",
        "graduateName": "김혜미",
        "certification": "교육 인증점",
        "img": "",
        "region": "울산 남구",
        "phone": "010-2386-7273"
    },
    {
        "name": "리애나뷰티",
        "graduateName": "신정아",
        "certification": "교육 인증점",
        "img": "",
        "region": "서울 도봉·강북",
        "phone": "010-9801-5660"
    },
    {
        "name": "더숨에스테틱",
        "graduateName": "한태희",
        "certification": "교육 인증점",
        "img": "",
        "region": "서울 중랑구 상봉동",
        "phone": "010-2221-3494"
    },
    {
        "name": "바른몸길",
        "graduateName": "진무광",
        "certification": "교육 인증점",
        "img": "",
        "region": "서울 신촌",
        "phone": "010-4456-5925"
    },
    {
        "name": "김채영에스테틱",
        "graduateName": "김채영",
        "certification": "교육 인증점",
        "img": "",
        "region": "경기 양주",
        "phone": "010-5043-4933"
    },
    {
        "name": "에스테틱유아",
        "graduateName": "이유아",
        "certification": "교육 인증점",
        "img": "",
        "region": "경남 김해시 삼계동",
        "phone": "010-6347-3398"
    },
    {
        "name": "뷰티온에스테틱",
        "graduateName": "고현주",
        "certification": "교육 인증점",
        "img": "",
        "region": "강원 원주",
        "phone": "010-9293-0090"
    },
    {
        "name": "이너리플",
        "graduateName": "김태인",
        "certification": "교육 인증점",
        "img": "",
        "region": "광주",
        "phone": "010-9098-4699"
    },
    {
        "name": "두골비,체&통증케어",
        "graduateName": "함지은",
        "certification": "교육 인증점",
        "img": "",
        "region": "강원 원주시 단구동",
        "phone": "010-9282-0750"
    },
    {
        "name": "에스테틱라뽀르청담",
        "graduateName": "김애정",
        "certification": "교육 수료점",
        "img": "",
        "region": "서울 강남 삼성",
        "phone": "010-8322-6116"
    },
    {
        "name": "황원장스킨앤바디",
        "graduateName": "황미숙",
        "certification": "교육 수료점",
        "img": "",
        "region": "서울 강서구 우장산역",
        "phone": "010-2273-8104"
    },
    {
        "name": "LK테라피",
        "graduateName": "이해랑",
        "certification": "교육 수료점",
        "img": "",
        "region": "서울 마포",
        "phone": "010-4191-0253"
    },
    {
        "name": "라임스킨케어",
        "graduateName": "최유성",
        "certification": "교육 수료점",
        "img": "",
        "region": "서울 상봉",
        "phone": "010-2474-8355"
    },
    {
        "name": "오르멜라뷰티에스테틱",
        "graduateName": "김예진",
        "certification": "교육 수료점",
        "img": "",
        "region": "서울 강남구 봉은사로4길 24",
        "phone": "010-4473-0992"
    },
    {
        "name": "어현숙에스테틱",
        "graduateName": "어현숙",
        "certification": "교육 수료점",
        "img": "",
        "region": "서울 영등포구 당산동",
        "phone": "010-9113-2939"
    },
    {
        "name": "아우룸스킨앤바디",
        "graduateName": "장성미",
        "certification": "교육 수료점",
        "img": "",
        "region": "경기 광명",
        "phone": "010-9852-0610"
    },
    {
        "name": "무유에스테틱",
        "graduateName": "김가영",
        "certification": "교육 수료점",
        "img": "",
        "region": "경남 김해 내동",
        "phone": "010-2310-1117"
    },
    {
        "name": "포유 에스테틱",
        "graduateName": "유미영",
        "certification": "교육 수료점",
        "img": "",
        "region": "충남 아산",
        "phone": "010-4488-7932"
    },
    {
        "name": "청주피부관리왁싱 미라인",
        "graduateName": "김미라",
        "certification": "교육 수료점",
        "img": "",
        "region": "충북 청주",
        "phone": "010-4654-5857"
    }
];


// 공통 사업정보: 아래 값만 수정하면 푸터, 교육장, INFORMATION, 전화 예약에 반영됩니다.
// 수료지점별 연락처는 위 networkData에서 별도로 관리합니다.
// email은 화면에 공개하는 이메일입니다. 상담폼 수신자 분기는 서버 mail-send.php에서 관리합니다.
const business_info = {
    name: "두골비체 트레이닝 센터",
    representative: "이희경",
    registrationNumber: "254-27-02072",
    email: "mjk5407-@naver.com",
    phone: "010-3450-1662",
    locations: {
        busan: {
            name: "부산 교육 본점",
            address: "부산 부산진구 서면로10, 207호",
            hours: ["두골비 10:00 ~ 14:00", "두골체 15:30 ~ 19:00"],
            naverUrl: "https://naver.me/FgHhGggM",
            kakaoUrl: "https://place.map.kakao.com/1689881626"
        },
        seoul: {
            name: "서울 청담 교육장",
            address: "서울 강남구 삼성로 723, 3층",
            hours: ["두골비 10:00 ~ 14:00", "두골체 15:30 ~ 19:00"],
            naverUrl: "https://naver.me/GWW50n7K",
            kakaoUrl: "https://place.map.kakao.com/76091347"
        }
    }
};
