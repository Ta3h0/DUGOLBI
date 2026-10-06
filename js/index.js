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
            let measuredLines = [];
            let renderedLineCount = 0;
            let resizeFrame = 0;

            function measureLines() {
                renderedLineCount = 0;
                measuredLines = Array.from(lines).map(function (line) {
                    const box = line.getBoundingClientRect();
                    const range = document.createRange();
                    range.selectNodeContents(line);

                    // Inline emphasis and responsive breaks can produce several
                    // rectangles for one visible row. Merge by vertical position.
                    const rows = [];
                    Array.from(range.getClientRects()).forEach(function (rect) {
                        if (rect.width <= 0 || rect.height <= 0) return;
                        const center = rect.top + rect.height / 2;
                        let row = rows.find(function (item) {
                            return Math.abs(item.center - center) < 2;
                        });
                        if (!row) {
                            row = { center: center, left: rect.left, right: rect.right };
                            rows.push(row);
                        } else {
                            row.left = Math.min(row.left, rect.left);
                            row.right = Math.max(row.right, rect.right);
                        }
                    });
                    rows.sort(function (a, b) { return a.center - b.center; });

                    const lineHeight = parseFloat(getComputedStyle(line).lineHeight);
                    const firstRow = renderedLineCount;
                    renderedLineCount += rows.length;

                    return {
                        element: line,
                        firstRow: firstRow,
                        width: box.width,
                        rows: rows.map(function (row, index) {
                            return {
                                left: row.left - box.left,
                                right: row.right - box.left,
                                top: Math.max(0, index * lineHeight),
                                bottom: Math.min(box.height, (index + 1) * lineHeight)
                            };
                        })
                    };
                });
            }


            function updateTargetProgress() {

                const rect =
                    section02.getBoundingClientRect();

                const scrollable =
                    Math.max(1, section02.offsetHeight - section02.querySelector(".inner").offsetHeight);

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

                const progress = currentProgress * renderedLineCount;
                measuredLines.forEach(function (line) {
                    const localProgress = progress - line.firstRow;

                    if (localProgress <= 0 || !line.rows.length) {
                        line.element.style.clipPath = "inset(0 100% 0 0)";
                        return;
                    }
                    if (localProgress >= line.rows.length) {
                        line.element.style.clipPath = "inset(0)";
                        return;
                    }

                    const rowIndex = Math.floor(localProgress);
                    const row = line.rows[rowIndex];
                    const fraction = localProgress - rowIndex;
                    const edge = row.left + (row.right - row.left) * fraction;

                    // Completed rows stay fully colored; only the current row
                    // reveals horizontally. Lower rows remain entirely gray.
                    line.element.style.clipPath =
                        `polygon(0 0, ${line.width}px 0, ${line.width}px ${row.top}px, ` +
                        `${edge}px ${row.top}px, ${edge}px ${row.bottom}px, 0 ${row.bottom}px)`;
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

            function refreshLines() {
                measureLines();
                updateTargetProgress();
            }

            function scheduleRefresh() {
                cancelAnimationFrame(resizeFrame);
                resizeFrame = requestAnimationFrame(refreshLines);
            }

            window.addEventListener("resize", scheduleRefresh);
            if (window.visualViewport) {
                window.visualViewport.addEventListener("resize", scheduleRefresh);
            }
            if (document.fonts) {
                document.fonts.ready.then(refreshLines);
            }

            refreshLines();
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


    function initHomeFaq() {
        if (!document.body.classList.contains("home")) {
            return;
        }

        const items = Array.from(document.querySelectorAll(".section09 .faq-list .item"));

        function setExpanded(item, expanded) {
            const button = item.querySelector(".quest");
            const answer = item.querySelector(".answe");
            item.classList.toggle("active", expanded);
            button.setAttribute("aria-expanded", String(expanded));
            answer.setAttribute("aria-hidden", String(!expanded));
            answer.inert = !expanded;
        }

        items.forEach(function (item) {
            const button = item.querySelector(".quest");
            const answer = item.querySelector(".answe");

            setExpanded(item, false);

            item.addEventListener("click", function (event) {
                // 답변 영역 클릭은 열고 닫기에 사용하지 않음
                if (answer.contains(event.target)) {
                    return;
                }

                const shouldOpen = button.getAttribute("aria-expanded") !== "true";

                items.forEach(function (other) {
                    setExpanded(other, other === item && shouldOpen);
                });
            });
        });
    }

    function initInquiryForm() {
        const form = document.querySelector('.inquiry-form');
        if (!form || !window.fetch) return;
        const button = form.querySelector('button[type="submit"]');
        const label = button.querySelector('span');
        const status = document.getElementById('inquiry-status');
        const originalLabel = label.textContent;
        let pending = false;

        function setPending(value) {
            pending = value;
            button.disabled = value;
            form.setAttribute('aria-busy', String(value));
            label.textContent = value ? '전송 중…' : originalLabel;
        }
        ['user_name', 'user_region', 'user_phone'].forEach(function (name) {
            form.elements[name].addEventListener('input', function () { this.setCustomValidity(''); });
        });
        window.addEventListener('pageshow', function () { setPending(false); });
        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            if (pending) return;
            const name = form.elements.user_name;
            const region = form.elements.user_region;
            const phone = form.elements.user_phone;
            name.value = name.value.trim();
            region.value = region.value.trim();
            name.setCustomValidity(name.value ? '' : '이름을 입력해 주세요.');
            region.setCustomValidity(region.value ? '' : '지역을 입력해 주세요.');
            const normalizedPhone = phone.value.replace(/[\s()\-]/g, '');
            phone.setCustomValidity(/^(?:0\d{8,10}|\+82\d{8,10})$/.test(normalizedPhone)
                ? '' : '연락 가능한 전화번호를 정확히 입력해 주세요.');
            if (!form.reportValidity()) return;
            const data = new FormData(form);
            data.set('user_phone', normalizedPhone);
            setPending(true);
            status.hidden = false;
            status.textContent = '상담 신청을 전송하고 있습니다.';
            try {
                const response = await fetch(form.action, {
                    method: 'POST', body: data, credentials: 'same-origin',
                    headers: { 'Accept': 'application/json' }
                });
                const result = await response.json();
                if (!response.ok || result.success !== true) {
                    throw new Error(result.message || '접수하지 못했습니다. 잠시 후 다시 시도해 주세요.');
                }
                status.textContent = result.message;
                window.alert(result.message);
                window.location.assign('index.html');
            } catch (error) {
                status.textContent = error instanceof SyntaxError || error instanceof TypeError
                    ? '서버에 연결하거나 응답을 확인하지 못했습니다. 입력 내용은 유지됩니다. 잠시 후 다시 시도해 주세요.'
                    : error.message;
                status.focus({ preventScroll: true });
            } finally {
                setPending(false);
            }
        });
    }

    function initPage() {
        initHomeScrollText();
        initHomeSwipers();
        initHomeFaq();
        initInquiryForm();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPage);
    } else {
        initPage();
    }
})();
