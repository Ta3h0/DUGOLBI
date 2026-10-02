/* Existing page interactions; loaded only by pages that use them. */
(function () {
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


    function initPage() {
        initCurriculum("startup");
        initCurriculum("growth");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPage);
    } else {
        initPage();
    }
})();
