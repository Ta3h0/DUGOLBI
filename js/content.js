/* Shared formatting for existing static content renderers. */
(function () {
    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
        });
    }

    function lines(value) {
        return escapeHtml(value).replace(/\n/g, "<br>");
    }


    function initLoadMore(grid, button, items, renderCard) {
        let visibleCount = 0;
        const batchSize = 6;

        function appendBatch() {
            const nextCount = Math.min(visibleCount + batchSize, items.length);
            grid.insertAdjacentHTML("beforeend", items.slice(visibleCount, nextCount).map(function (item, index) {
                return renderCard(item, visibleCount + index);
            }).join(""));
            visibleCount = nextCount;
            if (button) {
                button.disabled = visibleCount >= items.length;
                button.setAttribute("aria-label", button.disabled ? "더보기: 추가 항목 없음" : "더보기: 다음 " + Math.min(batchSize, items.length - visibleCount) + "개 표시");
            }
        }

        grid.replaceChildren();
        if (button) button.addEventListener("click", appendBatch);
        appendBatch();
    }

    window.DugolbiContent = { escapeHtml: escapeHtml, lines: lines, initLoadMore: initLoadMore };
})();
