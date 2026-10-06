document.addEventListener("DOMContentLoaded", function () {
    const items = typeof educationData !== "undefined" && Array.isArray(educationData)
        ? educationData.filter(function (item) { return item && typeof item === "object" && !Array.isArray(item); })
        : [];
    const grid = document.querySelector(".montly-grid");
    const overview = document.querySelector(".montly-detail-overview");
    const detailBody = document.querySelector(".montly-detail-body");

    if (!grid && !(overview && detailBody)) return;

    const { escapeHtml, lines, initLoadMore } = window.DugolbiContent;

    function displayDate(value) {
        return String(value ?? "").replaceAll("-", ".");
    }

    function number(value) {
        return Number(value).toLocaleString("en-US");
    }

    function priceText(value) {
        return value % 10000 === 0 ? `${value / 10000}만원` : `${number(value)}원`;
    }

    function priceMarkup(item) {
        const original = Number(item.originalPrice) || 0;
        const discount = Number(item.discountPercent) || 0;
        const discounted = Math.round(original * (100 - discount) / 100);
        const label = `정가 ${priceText(original)}, ${item.badge} ${discount}퍼센트 할인 적용 시 ${priceText(discounted)}`;
        return `<div class="montly-price" aria-label="${escapeHtml(label)}">
            <del class="montly-original-price">${number(original)}원</del>
            <div class="montly-price-values"><span class="montly-discount">${discount}%</span><strong>${number(discounted)}<span>원</span></strong></div>
        </div>`;
    }

    function periodMarkup(item, detail) {
        const separator = detail ? " ~ " : "~";
        const note = item.temporary ? '<span class="montly-date-note">임시 일정</span>' : "";
        return `<time datetime="${escapeHtml(item.startDate)}">${escapeHtml(displayDate(item.startDate))}</time>${separator}<time datetime="${escapeHtml(item.endDate)}">${escapeHtml(displayDate(item.endDate))}</time>${note}`;
    }

    function posterMarkup(item, preview) {
        const image = item.image || {};
        if (!image.src) return "";
        const alt = preview ? image.previewAlt : image.alt;
        const badge = item.badge ? `<span class="montly-earlybird-chip">${escapeHtml(item.badge)}</span>` : "";
        return `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(alt)}" width="${escapeHtml(image.width)}" height="${escapeHtml(image.height)}">${badge}`;
    }

    if (grid) {
        initLoadMore(grid, document.querySelector(".montly-more"), items, function (item, index) {
            const url = `montly-detail.html?id=${encodeURIComponent(item.id)}`;
            const titleId = index === 0 ? "preview-title" : `preview-title-${index + 1}`;
            return `<article class="montly-preview" aria-labelledby="${titleId}">
                <a class="montly-poster" href="${escapeHtml(url)}" aria-label="${escapeHtml(item.posterLabel)}">${posterMarkup(item, true)}</a>
                <div class="montly-preview-content">
                    <h3 id="${titleId}"><a href="${escapeHtml(url)}">${escapeHtml(String(item.title ?? "").replace(/\n/g, ""))}</a></h3>
                    <dl class="montly-facts">
                        <div><dt>교육기간</dt><dd>${periodMarkup(item, false)}</dd></div>
                        <div><dt>교육시간</dt><dd>총 ${escapeHtml(item.durationHours)}시간</dd></div>
                    </dl>
                    ${priceMarkup(item)}
                </div>
            </article>`;
        }, '등록된 교육이 없습니다.');
    }

    if (!(overview && detailBody)) return;

    // A direct visit keeps the first course; unknown ids must not show another course.
    const id = new URLSearchParams(window.location.search).get("id");
    const item = id === null ? items[0] : items.find(function (course) { return String(course.id) === id; });
    if (!item) {
        const message = document.createElement('h2');
        message.id = 'course-title';
        message.textContent = items.length ? '해당 교육을 찾을 수 없습니다.' : '등록된 교육이 없습니다.';
        overview.replaceChildren(message);
        detailBody.replaceChildren();
        return;
    }
    const pageTitle = String(item.title ?? "").split("\n").pop().trim();
    document.title = `${pageTitle || "이달의 교육"} | 두골비·체 트레이닝 센터`;
    const phone = String(item.phone ?? "");
    const phoneNumber = phone.replace(/[^\d+]/g, "");
    const phoneHref = phoneNumber ? `tel:${phoneNumber}` : "#";

    overview.innerHTML = `<div class="montly-poster">${posterMarkup(item, false)}</div>
        <div class="montly-detail-info">
            <p class="section-eyebrow">${escapeHtml(item.category)}</p>
            <h2 id="course-title">${lines(item.title)}</h2>
            <p class="montly-detail-lead">${lines(item.description)}</p>
            <dl class="montly-detail-facts">
                <div><dt>교육기간</dt><dd>${periodMarkup(item, true)}</dd></div>
                <div><dt>교육시간</dt><dd>총 ${escapeHtml(item.durationHours)}시간</dd></div>
                <div><dt>상담문의</dt><dd>${escapeHtml(phone)}</dd></div>
            </dl>
            ${priceMarkup(item)}
        </div>`;

    const paragraphs = Array.isArray(item.introParagraphs) ? item.introParagraphs : [];
    const curriculum = Array.isArray(item.curriculum)
        ? item.curriculum.filter(function (part) { return part && typeof part === "object"; })
        : [];
    detailBody.innerHTML = `<section class="montly-detail-intro" aria-labelledby="intro-title">
            <h2 id="intro-title">${lines(item.introTitle)}</h2>
            <div class="montly-detail-prose">${paragraphs.map(function (paragraph) {
                let content = lines(paragraph);
                if (item.introEmphasis) {
                    const emphasis = escapeHtml(item.introEmphasis);
                    content = content.replace(emphasis, `<strong>${emphasis}</strong>`);
                }
                return `<p>${content}</p>`;
            }).join("")}</div>
        </section>
        <section class="montly-detail-curriculum" aria-labelledby="curriculum-title">
            <h2 id="curriculum-title">교육 커리큘럼</h2>
            ${curriculum.map(function (part, index) {
                return `<article class="montly-detail-part">
                    <div><span>PART ${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(part.title)}</h3></div>
                    <div><h4>${escapeHtml(part.subtitle)}</h4><p class="montly-part-question">${lines(part.question)}</p><p>${lines(part.description)}</p></div>
                </article>`;
            }).join("")}
        </section>
        <section class="montly-detail-contact" aria-labelledby="contact-title">
            <h2 id="contact-title">상담문의</h2>
            <p class="montly-contact-number">${escapeHtml(phone)}</p>
            <div class="montly-booking-actions">
                <a class="cta-button montly-booking-naver" href="${escapeHtml(item.naverBookingUrl || "#")}"><img src="images/network/naver-map.png" alt="" width="33" height="33">네이버 예약</a>
                <a class="cta-button montly-booking-phone" href="${escapeHtml(phoneHref)}" id="montly-phone"><img src="images/network/phone.png" alt="" width="24" height="24">전화 예약</a>
            </div>
            <p class="montly-phone-status" id="montly-phone-status" role="status" aria-live="polite"></p>
            <input class="montly-phone-copy" id="montly-phone-copy" type="text" value="${escapeHtml(phone)}" readonly tabindex="-1" aria-label="복사할 전화번호" hidden>
        </section>`;
    window.DugolbiLinks.setOptionalLink(detailBody.querySelector(".montly-booking-naver"), item.naverBookingUrl);
    if (!phoneNumber) {
        window.DugolbiLinks.setOptionalLink(document.getElementById("montly-phone"), "");
    }
});
