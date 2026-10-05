document.addEventListener("DOMContentLoaded", function () {
    const items = typeof promotionList !== "undefined" && Array.isArray(promotionList)
        ? promotionList.filter(function (item) { return item && typeof item === "object" && !Array.isArray(item); })
        : [];
    const grid = document.querySelector(".promotion-grid");
    const article = document.querySelector(".promotion-article");

    if (!grid && !article) return;

    const { escapeHtml, lines, initLoadMore } = window.DugolbiContent;

    function period(item) {
        return `${String(item.startDate ?? "").replaceAll("-", ".")} ~ ${String(item.endDate ?? "").replaceAll("-", ".")}`;
    }

    if (grid) {
        initLoadMore(grid, document.querySelector(".promotion-more"), items, function (item) {
            const image = item.image || {};
            const url = `promotion-detail.html?id=${encodeURIComponent(item.id)}`;
            return `<article class="promotion-card"><a href="${escapeHtml(url)}" class="promotion-poster" aria-label="${escapeHtml(item.title)} 상세보기">${image.src ? `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" width="${escapeHtml(image.width)}" height="${escapeHtml(image.height)}" loading="lazy">` : ""}</a>
                <div class="promotion-card-content"><p class="promotion-category">${escapeHtml(item.category)}</p><h3><a href="${escapeHtml(url)}">${escapeHtml(item.title)}</a></h3><p class="promotion-excerpt">${lines(item.description)}</p><dl><dt>기간</dt><dd>${escapeHtml(period(item))}</dd></dl></div>
            </article>`;
        }, '등록된 프로모션이 없습니다.');
    }

    if (!article) return;

    // Missing ids retain the first item; stale ids must not display another event.
    const id = new URLSearchParams(window.location.search).get("id");
    const item = id === null ? items[0] : items.find(function (promotion) { return String(promotion.id) === id; });
    const date = article.querySelector(".section-eyebrow");
    const title = article.querySelector("#promotion-title");
    const poster = article.querySelector(".promotion-detail-poster");
    const content = article.querySelector(".promotion-article-content");

    if (!item) {
        if (title) title.textContent = items.length ? '해당 프로모션을 찾을 수 없습니다.' : '등록된 프로모션이 없습니다.';
        if (date) date.textContent = '';
        if (poster) poster.remove();
        if (content) content.replaceChildren();
        return;
    }

    if (date) date.textContent = period(item);
    if (title) title.textContent = item.detailTitle || item.title;
    if (poster) {
        const image = item.detailImage || item.image || {};
        if (image.src) poster.setAttribute("src", image.src);
        else poster.remove();
        poster.setAttribute("alt", image.alt || "");
        poster.setAttribute("width", image.width || "");
        poster.setAttribute("height", image.height || "");
    }
    if (content) {
        const paragraphs = Array.isArray(item.paragraphs) ? item.paragraphs : [];
        const phone = String(item.phone ?? "");
        const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
        content.innerHTML = `<h3>${escapeHtml(item.detailTitle || item.title)}</h3>${paragraphs.map(function (paragraph) { return `<p>${lines(paragraph)}</p>`; }).join("")}${phone ? `<p><a href="${escapeHtml(phoneHref)}">☎ ${escapeHtml(phone)}</a></p>` : ""}`;
    }
});
