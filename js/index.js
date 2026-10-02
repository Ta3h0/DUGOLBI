/* Existing page interactions; loaded only by pages that use them. */
(function () {
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


    function initPage() {
        initHomeScrollText();
        initHomeSwipers();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPage);
    } else {
        initPage();
    }
})();
