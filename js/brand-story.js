document.addEventListener('DOMContentLoaded', function () {

    const slides = Array.from(
        document.querySelectorAll('.brand-points-stage .brand-point')
    );

    const prevButton = document.querySelector('.brand-point-prev');
    const nextButton = document.querySelector('.brand-point-next');
    const paginationCurrent = document.querySelector(
        '.brand-point-pagination strong'
    );

    if (
        !slides.length ||
        !prevButton ||
        !nextButton ||
        !paginationCurrent
    ) {
        return;
    }

    let currentIndex = 0;
    let isAnimating = false;

    const animationDuration = 750;


    function clearState(slide) {
        slide.classList.remove(
            'is-active',
            'is-next',
            'is-hidden-left',
            'is-hidden-right'
        );
    }


    function updateSlides() {

        const length = slides.length;

        slides.forEach(function (slide, index) {

            clearState(slide);

            const distance =
                (index - currentIndex + length) % length;


            /* 현재 */
            if (distance === 0) {

                slide.classList.add('is-active');

            }

            /* 바로 다음 */
            else if (distance === 1) {

                slide.classList.add('is-next');

            }

            /* 다음 다음 */
            else if (distance === 2) {

                slide.classList.add('is-hidden-right');

            }

            /* 이전 */
            else {

                slide.classList.add('is-hidden-left');

            }

        });


        paginationCurrent.textContent =
            String(currentIndex + 1).padStart(2, '0');
    }


    function lockAnimation() {

        isAnimating = true;

        window.setTimeout(function () {
            isAnimating = false;
        }, animationDuration);

    }


    function moveNext() {

        if (isAnimating) {
            return;
        }

        lockAnimation();

        currentIndex =
            (currentIndex + 1) % slides.length;

        updateSlides();
    }


    function movePrev() {

        if (isAnimating) {
            return;
        }

        lockAnimation();

        currentIndex =
            (currentIndex - 1 + slides.length) % slides.length;

        updateSlides();
    }


    nextButton.addEventListener('click', moveNext);
    prevButton.addEventListener('click', movePrev);


    updateSlides();

});