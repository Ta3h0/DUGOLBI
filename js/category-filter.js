/* Existing page interactions; loaded only by pages that use them. */
(function () {
    function initListingPagination(pageClass) {
        if (!document.body.classList.contains(pageClass)) {
            return;
        }

        const section = document.querySelector("." + pageClass + "-section");
        if (!section) return;
        const filters = Array.from(section.querySelectorAll("[data-filter]"));
        const items = Array.from(section.querySelectorAll("." + pageClass + "-card"));
        const empty = section.querySelector("." + pageClass + "-empty");
        const pagination = section.querySelector("." + pageClass + "-pagination");
        const title = section.querySelector(".section-title");
        if (!pagination) return;

        const pageSize = 6;
        const groupSize = 10;
        const selectedFilter = filters.find(function (button) {
            return button.getAttribute("aria-pressed") === "true";
        });
        let selected = selectedFilter ? selectedFilter.dataset.filter : "전체";
        let currentPage = 1;
        let pageCount = 0;

        function makeButton(label, targetPage, accessibleLabel, disabled) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = label;
            button.dataset.page = String(targetPage);
            button.setAttribute("aria-label", accessibleLabel);
            button.disabled = Boolean(disabled);
            return button;
        }

        function render() {
            const matching = items.filter(function (item) {
                return selected === "전체" || selected === "전국" || item.dataset.category === selected;
            });
            pageCount = Math.ceil(matching.length / pageSize);
            currentPage = Math.min(Math.max(currentPage, 1), Math.max(pageCount, 1));
            const start = (currentPage - 1) * pageSize;
            const visible = new Set(matching.slice(start, start + pageSize));
            items.forEach(function (item) { item.hidden = !visible.has(item); });
            if (empty) empty.hidden = matching.length > 0;
            pagination.hidden = pageCount === 0;
            pagination.replaceChildren();
            if (!pageCount) return;

            const groupStart = Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
            const groupEnd = Math.min(groupStart + groupSize - 1, pageCount);
            const hasGroups = pageCount > groupSize;
            if (hasGroups) {
                pagination.append(
                    makeButton("«", 1, "첫 페이지", currentPage === 1),
                    makeButton("‹", Math.max(1, groupStart - groupSize), "이전 10페이지", groupStart === 1)
                );
            }

            const numbers = document.createElement("div");
            numbers.className = pageClass + "-page-numbers";
            for (let page = groupStart; page <= groupEnd; page++) {
                const button = makeButton(String(page), page, page + "페이지", false);
                if (page === currentPage) button.setAttribute("aria-current", "page");
                numbers.append(button);
            }
            pagination.append(numbers);

            if (hasGroups) {
                pagination.append(
                    makeButton("›", groupEnd + 1, "다음 10페이지", groupEnd === pageCount),
                    makeButton("»", pageCount, "마지막 페이지", currentPage === pageCount)
                );
            }
        }

        filters.forEach(function (button) {
            button.addEventListener("click", function () {
                selected = button.dataset.filter;
                currentPage = 1;
                filters.forEach(function (filter) {
                    filter.setAttribute("aria-pressed", String(filter === button));
                });
                render();
            });
        });

        pagination.addEventListener("click", function (event) {
            const button = event.target.closest("button[data-page]");
            if (!button || button.disabled) return;
            const nextPage = Number(button.dataset.page);
            if (nextPage < 1 || nextPage > pageCount || nextPage === currentPage) return;
            currentPage = nextPage;
            render();
            if (title) {
                title.focus({ preventScroll: true });
                title.scrollIntoView({ block: "start", behavior: "auto" });
            }
        });

        render();
    }


    function initPage() {
        initListingPagination("network");
        initListingPagination("results");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPage);
    } else {
        initPage();
    }
})();
