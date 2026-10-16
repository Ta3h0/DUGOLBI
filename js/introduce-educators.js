document.addEventListener("DOMContentLoaded", function () {
    if (typeof educatorData === "undefined" || !Array.isArray(educatorData)) return;

    document.querySelectorAll("[data-educator-career]").forEach(function (panel) {
        const educator = educatorData.find(function (item) {
            return item && item.id === panel.dataset.educatorCareer;
        });
        if (!educator || !Array.isArray(educator.careerColumns)) return;

        const columns = document.createDocumentFragment();
        educator.careerColumns.forEach(function (items) {
            if (!Array.isArray(items)) return;
            const list = document.createElement("ul");
            items.forEach(function (item) {
                const text = typeof item === "string" ? item : item && item.text;
                if (typeof text !== "string" || !text) return;
                const entry = document.createElement("li");
                if (item && item.strong === true) {
                    const emphasis = document.createElement("strong");
                    emphasis.textContent = text;
                    entry.append(emphasis);
                } else {
                    entry.textContent = text;
                }
                list.append(entry);
            });
            columns.append(list);
        });
        panel.replaceChildren(columns);
    });
});
