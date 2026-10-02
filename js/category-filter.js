/* Existing page interactions; loaded only by pages that use them. */
(function () {
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


    function initPage() {
        initCategoryFilter("network");
        initCategoryFilter("results");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPage);
    } else {
        initPage();
    }
})();
