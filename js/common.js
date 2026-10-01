/* Shared interactions moved from the existing DUGOLBI HTML pages. */
(function () {

    function initHeader() {
        const body =
            document.body;

        if (!body) {
            return;
        }

        const header =
            document.getElementById("header");

        const hero =
            document.querySelector(
                ".hero-section, .introduce-hero, .advanced-hero, .brand-story-hero, " +
                ".growth-hero, .montly-hero, .network-hero, .news-hero, .notice-hero, " +
                ".promotion-detail-hero, .promotion-preview-hero, .qna-hero, " +
                ".results-hero, .review-hero, .signature-hero, .startup-hero"
            );

        const menuToggle =
            document.querySelector(
                ".header-menu-toggle"
            );

        const responsiveMenu =
            document.querySelector(
                ".responsive-menu"
            );

        const navItems =
            document.querySelectorAll(
                ".responsive-nav-item"
            );

        const navButtons =
            document.querySelectorAll(
                ".responsive-nav-button"
            );

        const submenuLinks =
            document.querySelectorAll(
                ".responsive-submenu-link"
            );

        /* ==================================================
           PAGE HEADER SCROLL
        ================================================== */

        function headerScroll() {

            if (
                !header ||
                !hero
            ) {
                return;
            }

            const headerHeight =
                header.offsetHeight;

            const heroHeight =
                hero.offsetHeight;

            const triggerPoint =
                heroHeight - headerHeight;

            if (
                window.scrollY >= triggerPoint
            ) {

                header.classList.add(
                    "is-scrolled"
                );

            } else {

                header.classList.remove(
                    "is-scrolled"
                );

            }

        }

        headerScroll();

        window.addEventListener(
            "scroll",
            headerScroll,
            {
                passive: true
            }
        );

        window.addEventListener(
            "resize",
            headerScroll
        );

        /* ==================================================
           NAV 전부 닫기
        ================================================== */

        function closeAllResponsiveNav() {

            navItems.forEach(
                function (item) {

                    item.classList.remove(
                        "active"
                    );

                    const button =
                        item.querySelector(
                            ".responsive-nav-button"
                        );

                    if (button) {

                        button.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                }
            );

        }

        /* ==================================================
           TABLET 기본 메뉴
           첫 번째 메뉴 = 소개
        ================================================== */

        function openFirstResponsiveNav() {

            if (!navItems.length) {
                return;
            }

            closeAllResponsiveNav();

            const firstItem =
                navItems[0];

            const firstButton =
                firstItem.querySelector(
                    ".responsive-nav-button"
                );

            firstItem.classList.add(
                "active"
            );

            if (firstButton) {

                firstButton.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        }

        /* ==================================================
           VIEWPORT MODE
        ================================================== */

        function getResponsiveMode() {

            if (
                window.innerWidth >= 1440
            ) {

                return "desktop";

            }

            if (
                window.innerWidth <= 768
            ) {

                return "mobile";

            }

            return "tablet";

        }

        /* ==================================================
           RESPONSIVE MENU CLOSE
        ================================================== */

        function closeResponsiveMenu() {

            if (menuToggle) {

                menuToggle.classList.remove(
                    "is-open"
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "메뉴 열기"
                );

            }

            if (responsiveMenu) {

                responsiveMenu.classList.remove(
                    "is-open"
                );

            }

            if (header) {

                header.classList.remove(
                    "menu-open"
                );

            }

            body.classList.remove(
                "menu-open"
            );

            /*
                모바일에서는 메뉴를 닫는 순간
                아코디언 상태도 전부 초기화
            */

            if (
                getResponsiveMode() === "mobile"
            ) {

                closeAllResponsiveNav();

            }

        }

        /* ==================================================
           INITIAL NAV STATE
        ================================================== */

        let currentResponsiveMode =
            getResponsiveMode();

        if (
            currentResponsiveMode === "tablet"
        ) {

            /*
                태블릿에서는
                우측 메뉴가 비어 있지 않도록
                소개 기본 활성화
            */

            openFirstResponsiveNav();

        } else {

            /*
                모바일 / 데스크톱에서는
                초기 active 없음
            */

            closeAllResponsiveNav();

        }

        /* ==================================================
           HAMBURGER OPEN / CLOSE
        ================================================== */

        if (
            menuToggle &&
            responsiveMenu &&
            header
        ) {

            menuToggle.addEventListener(
                "click",
                function () {

                    const isOpen =
                        !menuToggle.classList.contains(
                            "is-open"
                        );

                    /* ==========================================
                       OPEN 직전 상태 설정
                    ========================================== */

                    if (isOpen) {

                        const mode =
                            getResponsiveMode();

                        /*
                            모바일

                            메뉴를 열 때마다
                            항상 전부 닫힌 상태에서 시작
                        */

                        if (
                            mode === "mobile"
                        ) {

                            closeAllResponsiveNav();

                        }

                        /*
                            태블릿

                            선택된 메뉴가 하나도 없다면
                            소개를 기본으로 활성화
                        */

                        else if (
                            mode === "tablet"
                        ) {

                            const activeItem =
                                document.querySelector(
                                    ".responsive-nav-item.active"
                                );

                            if (!activeItem) {

                                openFirstResponsiveNav();

                            }

                        }

                    }

                    menuToggle.classList.toggle(
                        "is-open",
                        isOpen
                    );

                    responsiveMenu.classList.toggle(
                        "is-open",
                        isOpen
                    );

                    header.classList.toggle(
                        "menu-open",
                        isOpen
                    );

                    body.classList.toggle(
                        "menu-open",
                        isOpen
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        isOpen
                            ? "true"
                            : "false"
                    );

                    menuToggle.setAttribute(
                        "aria-label",
                        isOpen
                            ? "메뉴 닫기"
                            : "메뉴 열기"
                    );

                    /*
                        모바일 메뉴 CLOSE

                        다음에 열 때도
                        무조건 전체 닫힘
                    */

                    if (
                        !isOpen &&
                        getResponsiveMode() === "mobile"
                    ) {

                        closeAllResponsiveNav();

                    }

                }
            );

        }

        /* ==================================================
           RESPONSIVE 1차 메뉴 CLICK
        ================================================== */

        navButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const currentItem =
                            button.closest(
                                ".responsive-nav-item"
                            );

                        if (!currentItem) {
                            return;
                        }

                        const mode =
                            getResponsiveMode();

                        /* ======================================
                           MOBILE
                           ACCORDION
                        ====================================== */

                        if (
                            mode === "mobile"
                        ) {

                            const wasActive =
                                currentItem.classList.contains(
                                    "active"
                                );

                            /*
                                일단 모두 닫음
                            */

                            closeAllResponsiveNav();

                            /*
                                기존에 닫혀 있던 메뉴를
                                누른 경우에만 다시 OPEN

                                열린 메뉴를 다시 누르면
                                그대로 전부 닫힌 상태
                            */

                            if (!wasActive) {

                                currentItem.classList.add(
                                    "active"
                                );

                                button.setAttribute(
                                    "aria-expanded",
                                    "true"
                                );

                            }

                            return;

                        }

                        /* ======================================
                           TABLET
                        ====================================== */

                        if (
                            mode === "tablet"
                        ) {

                            closeAllResponsiveNav();

                            currentItem.classList.add(
                                "active"
                            );

                            button.setAttribute(
                                "aria-expanded",
                                "true"
                            );

                        }

                    }
                );

            }
        );

        /* ==================================================
           2차 메뉴 클릭
        ================================================== */

        submenuLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        closeResponsiveMenu();

                    }
                );

            }
        );

        /* ==================================================
           ESC CLOSE
        ================================================== */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key !== "Escape"
                ) {
                    return;
                }

                closeResponsiveMenu();

            }
        );

        /* ==================================================
           BREAKPOINT CHANGE
        ================================================== */

        function responsiveHeaderResize() {

            const nextMode =
                getResponsiveMode();

            /*
                같은 breakpoint 안에서
                단순 resize 된 경우에는
                사용자가 펼친 메뉴를 건드리지 않음
            */

            if (
                nextMode === currentResponsiveMode
            ) {
                return;
            }

            currentResponsiveMode =
                nextMode;

            /*
                breakpoint 이동 시
                열린 햄버거 메뉴 초기화
            */

            closeResponsiveMenu();

            /*
                MOBILE

                반드시 전부 닫힌 상태
            */

            if (
                nextMode === "mobile"
            ) {

                closeAllResponsiveNav();

                return;

            }

            /*
                TABLET

                소개 기본 활성화
            */

            if (
                nextMode === "tablet"
            ) {

                openFirstResponsiveNav();

                return;

            }

            /*
                DESKTOP

                responsive active 제거
            */

            closeAllResponsiveNav();

        }

        window.addEventListener(
            "resize",
            responsiveHeaderResize
        );
    }

    function initHomeScrollText() {
        if (!document.body.classList.contains("home")) {
            return;
        }

        /* ==================================================
           SECTION 02 SCROLL TEXT
        ================================================== */

        const section02 = document.querySelector('.section02');

        if (section02 && section02.querySelector(".scroll-line__fill")) {

            const lines =
                section02.querySelectorAll('.scroll-line__fill');

            let targetProgress = 0;
            let currentProgress = 0;

            function updateTargetProgress() {

                const rect =
                    section02.getBoundingClientRect();

                const scrollable =
                    section02.offsetHeight - window.innerHeight;

                const passed =
                    -rect.top;

                targetProgress =
                    Math.min(
                        Math.max(
                            passed / scrollable,
                            0
                        ),
                        1
                    );

            }

            function renderSection02() {

                currentProgress +=
                    (targetProgress - currentProgress) * 0.05;

                lines.forEach(function (line, index) {

                    const lineProgress =
                        Math.min(
                            Math.max(
                                currentProgress * lines.length - index,
                                0
                            ),
                            1
                        );

                    line.style.clipPath =
                        `inset(0 ${(1 - lineProgress) * 100}% 0 0)`;

                });

                requestAnimationFrame(
                    renderSection02
                );

            }

            window.addEventListener(
                'scroll',
                updateTargetProgress,
                {
                    passive: true
                }
            );

            updateTargetProgress();
            renderSection02();

        }
    }

    function initHomeSwipers() {
        if (!document.body.classList.contains("home") || typeof Swiper === "undefined") {
            return;
        }

        /* ==================================================
           GROWTH SWIPER OFFSET
        ================================================== */

        function getGrowthOffset() {

            const containerWidth = 1440;

            const pageGap =
                window.innerWidth <= 768
                    ? 20
                    : 40;

            return Math.max(
                pageGap,
                (window.innerWidth - containerWidth) / 2
            );

        }

        /* ==================================================
           HERO SWIPER
        ================================================== */

        const heroSwiperElement =
            document.querySelector('.hero-swiper');

        if (heroSwiperElement) {

            const heroSwiper =
                new Swiper('.hero-swiper', {

                    loop: true,

                    speed: 1200,

                    effect: 'fade',

                    fadeEffect: {
                        crossFade: true
                    },

                    autoplay: {
                        delay: 4500,
                        disableOnInteraction: false
                    },

                    pagination: {
                        el: '.hero-pagination',
                        clickable: true
                    },

                    navigation: {
                        prevEl: '.hero-prev',
                        nextEl: '.hero-next'
                    },

                    allowTouchMove: true

                });

        }

        /* ==================================================
           GROWTH SWIPER
        ================================================== */

        const growthSwiperElement =
            document.querySelector('.growth-swiper');

        let growthSwiper = null;

        if (growthSwiperElement) {

            growthSwiper =
                new Swiper('.growth-swiper', {

                    loop: false,

                    slidesPerView: 'auto',

                    spaceBetween: 24,

                    slidesOffsetBefore:
                        getGrowthOffset(),

                    slidesOffsetAfter:
                        getGrowthOffset(),

                    /* 마우스 드래그 */

                    simulateTouch: true,

                    grabCursor: true,

                    /* 이동 애니메이션 */

                    speed: 650,

                    /* 작은 움직임 무시 */

                    threshold: 5,

                    shortSwipes: true,

                    longSwipes: true,

                    longSwipesRatio: 0.25,

                    longSwipesMs: 250,

                    resistance: true,

                    resistanceRatio: 0.4,

                    pagination: {
                        el: '.growth-pagination',
                        type: 'progressbar'
                    },

                    breakpoints: {

                        0: {
                            spaceBetween: 16
                        },

                        768: {
                            spaceBetween: 20
                        },

                        1200: {
                            spaceBetween: 24
                        }

                    }

                });

        }

        window.addEventListener(
            'resize',
            function () {

                if (!growthSwiper) {
                    return;
                }

                const offset =
                    getGrowthOffset();

                growthSwiper.params.slidesOffsetBefore =
                    offset;

                growthSwiper.params.slidesOffsetAfter =
                    offset;

                growthSwiper.update();

            }
        );
    }

    function initCategoryFilter(pageClass) {
        if (!document.body.classList.contains(pageClass)) {
            return;
        }

        const filters = document.querySelectorAll("[data-filter]");
        const items = document.querySelectorAll("[data-category]");
        const empty = document.querySelector("." + pageClass + "-empty");
        const pagination = document.querySelector("." + pageClass + "-pagination");

        if (!filters.length) {
            return;
        }

        filters.forEach(function (button) {
            button.addEventListener("click", function () {
                const selected = button.dataset.filter;
                let visible = 0;

                filters.forEach(function (filter) {
                    filter.setAttribute("aria-pressed", String(filter === button));
                });

                items.forEach(function (item) {
                    item.hidden = selected !== "전체" && selected !== "전국" && item.dataset.category !== selected;
                    if (!item.hidden) visible++;
                });

                if (empty) empty.hidden = visible > 0;
                if (pagination) pagination.hidden = visible === 0;
            });
        });
    }

    function initCurriculum(pageClass) {
        const itemSelector = "." + pageClass + "-curriculum-item";
        const arrowSelector = "." + pageClass + "-course-arrow";
        const buttons = document.querySelectorAll(itemSelector + " button");

        if (!buttons.length) {
            return;
        }

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                const shouldOpen = button.getAttribute("aria-expanded") !== "true";

                buttons.forEach(function (item) {
                    const isOpen = item === button && shouldOpen;
                    const curriculumItem = item.closest(itemSelector);
                    const panel = document.getElementById(item.getAttribute("aria-controls"));
                    const arrow = item.querySelector(arrowSelector);

                    item.setAttribute("aria-expanded", String(isOpen));
                    if (curriculumItem) curriculumItem.classList.toggle("is-open", isOpen);
                    if (panel) panel.hidden = !isOpen;
                    if (arrow) arrow.textContent = isOpen ? "→" : "↗";
                });
            });
        });
    }

    function initCommon() {
        if (!document.body) {
            return;
        }

        initHomeScrollText();
        initHomeSwipers();
        initHeader();
        initCategoryFilter("network");
        initCategoryFilter("results");
        initCurriculum("startup");
        initCurriculum("growth");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCommon);
    } else {
        initCommon();
    }
})();
