/* Existing page interactions; loaded only by pages that use them. */
(function () {
    function initNetworkListing() {
        if (!document.body.classList.contains("network")) return;
        const section = document.querySelector(".network-section");
        if (!section) return;
        const grid = section.querySelector(".network-grid");
        if (!grid) return;

        const collator = new Intl.Collator("ko", { numeric: true, sensitivity: "base" });
        const branches = typeof networkData !== "undefined" && Array.isArray(networkData)
            ? networkData.filter(function (branch) {
                return branch && typeof branch === "object" && typeof branch.name === "string";
            }).slice().sort(function (first, second) {
                return collator.compare(first.name.trim(), second.name.trim());
            })
            : [];
        const fragment = document.createDocumentFragment();
        branches.forEach(function (branch) {
            const card = document.createElement("article");
            card.className = "network-card";
            const regionName = String(branch.region || "");
            const filterRegion = /^(창원|김해)/.test(regionName)
                ? "경남"
                : (regionName.match(/^(서울|경기|강원|충북|충남|대전|대구|경북|경남|부산|울산|전북|전남|광주)/) || [regionName])[0];
            card.dataset.category = filterRegion;
            const image = branch.image || {};
            if (image.src) {
                const poster = document.createElement("img");
                poster.src = image.src;
                poster.alt = image.alt || branch.name + " 내부";
                if (Number(image.width) > 0) poster.width = Number(image.width);
                if (Number(image.height) > 0) poster.height = Number(image.height);
                card.append(poster);
            }
            const region = document.createElement("span");
            region.className = "network-region";
            region.textContent = filterRegion;
            const name = document.createElement("h3");
            name.textContent = branch.name;
            const facts = document.createElement("dl");
            [["지역", regionName], ["연락처", branch.phone]].forEach(function (fact) {
                const row = document.createElement("div");
                const label = document.createElement("dt");
                label.textContent = fact[0];
                const value = document.createElement("dd");
                value.textContent = fact[1] || "";
                row.append(label, value);
                facts.append(row);
            });
            card.append(region, name, facts);
            fragment.append(card);
        });
        grid.replaceChildren(fragment);

    }

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
        if (!pagination) return;

        const pageSize = pageClass === "network" ? 8 : 6;
        const mobileMedia = window.matchMedia("(max-width: 768px)");
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
            pagination.hidden = pageCount === 0 || (pageClass === "network" && pageCount === 1);
            pagination.replaceChildren();
            if (!pageCount) return;

            const isMobile = mobileMedia.matches;
            const groupSize = isMobile ? 5 : 10;
            const groupStart = isMobile
                ? Math.max(1, Math.min(currentPage - 2, pageCount - groupSize + 1))
                : Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
            const groupEnd = Math.min(groupStart + groupSize - 1, pageCount);
            const hasGroups = pageCount > groupSize;
            const hasControls = isMobile ? pageCount > 1 : hasGroups;
            if (hasControls) {
                pagination.append(makeButton("«", 1, "첫 페이지", currentPage === 1));
                if (!isMobile) {
                    pagination.append(makeButton("‹", Math.max(1, groupStart - groupSize), "이전 " + groupSize + "페이지", groupStart === 1));
                }
            }

            const numbers = document.createElement("div");
            numbers.className = pageClass + "-page-numbers";
            for (let page = groupStart; page <= groupEnd; page++) {
                const button = makeButton(String(page), page, page + "페이지", false);
                if (page === currentPage) button.setAttribute("aria-current", "page");
                numbers.append(button);
            }
            pagination.append(numbers);

            if (hasControls) {
                if (!isMobile) {
                    pagination.append(makeButton("›", groupEnd + 1, "다음 " + groupSize + "페이지", groupEnd === pageCount));
                }
                pagination.append(makeButton("»", pageCount, "마지막 페이지", currentPage === pageCount));
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
            const paginationTop = pagination.getBoundingClientRect().top;
            currentPage = nextPage;
            render();
            // Keep the pagination in place even when the next page has fewer cards.
            window.scrollBy({
                top: pagination.getBoundingClientRect().top - paginationTop,
                behavior: "instant"
            });
            const activeButton = pagination.querySelector('button[aria-current="page"]');
            if (activeButton) activeButton.focus({ preventScroll: true });
        });

        mobileMedia.addEventListener("change", render);
        render();
    }


    function initPage() {
        initNetworkListing();
        initListingPagination("network");
        initListingPagination("results");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPage);
    } else {
        initPage();
    }
})();
