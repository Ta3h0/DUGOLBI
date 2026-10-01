document.addEventListener("DOMContentLoaded", function () {
    const list = document.getElementById("schedule-list");
    const days = document.getElementById("schedule-days");
    const status = document.getElementById("schedule-selection");
    const monthLabel = document.getElementById("schedule-month");
    const countLabel = document.getElementById("schedule-count");
    const emptyMessage = document.getElementById("schedule-empty");
    if (!list || !days) return;

    const parseDate = value => {
        if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
        const [y, m, d] = value.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
    };
    // Dates in modify.js are inclusive local calendar dates.
    const source = typeof scheduleData !== "undefined" && Array.isArray(scheduleData) ? scheduleData : [];
    const courses = source.filter(course => {
        return course && parseDate(course.start) && parseDate(course.end) && course.start <= course.end;
    }).map((course, index) => ({
        ...course,
        id: course.id ? String(course.id) : `schedule-${index + 1}`,
        color: /^schedule-color-[1-5]$/.test(course.color) ? course.color : `schedule-color-${index % 5 + 1}`
    }));
    const dateKey = date => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
    const displayDate = value => value.replaceAll("-", ".");
    let month = courses.length ? parseDate(courses[0].start) : new Date();
    month.setDate(1);
    let pinned = null;
    let hovered = null;
    let focused = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => document.body.classList.toggle("reduce-motion", reducedMotion.matches);
    updateMotion();
    reducedMotion.addEventListener("change", updateMotion);

    function highlight() {
        const id = hovered || focused || pinned;
        const course = courses.find(item => item.id === id);
        list.querySelectorAll("button").forEach(button => {
            button.classList.toggle("is-active", button.dataset.id === id);
            button.setAttribute("aria-pressed", String(button.dataset.id === pinned));
        });
        days.querySelectorAll("td").forEach(cell => {
            const active = Boolean(course && cell.dataset.date >= course.start && cell.dataset.date <= course.end);
            courses.forEach(item => cell.classList.remove(item.color));
            if (active) cell.classList.add(course.color);
            cell.classList.toggle("is-highlighted", active);
            cell.classList.toggle("range-start", active && (cell.dataset.date === course.start || cell.cellIndex === 0));
            cell.classList.toggle("range-end", active && (cell.dataset.date === course.end || cell.cellIndex === 6));
        });
        if (status) status.textContent = course ? `${displayDate(course.start)} ~ ${displayDate(course.end)}` : "목록에 마우스를 올려 교육 기간을 확인해 보세요.";
    }

    function render() {
        const start = dateKey(month);
        const end = dateKey(new Date(month.getFullYear(), month.getMonth() + 1, 0));
        const visible = courses.filter(course => course.start <= end && course.end >= start);
        pinned = hovered = focused = null;
        if (monthLabel) monthLabel.textContent = `${month.getFullYear()}. ${String(month.getMonth() + 1).padStart(2, "0")}`;
        if (countLabel) countLabel.textContent = `${visible.length}개 과정`;
        if (emptyMessage) emptyMessage.hidden = visible.length > 0;
        list.replaceChildren();
        visible.forEach(course => {
            const li = document.createElement("li");
            const button = document.createElement("button");
            button.type = "button";
            button.className = `schedule-course ${course.color}`;
            button.dataset.id = course.id;
            button.setAttribute("aria-pressed", "false");
            const title = document.createElement("span");
            title.className = "schedule-course-title";
            title.textContent = course.title;
            if (course.temporary) {
                const example = document.createElement("span");
                example.className = "schedule-course-example";
                example.textContent = "예시";
                title.append(example);
            }
            const period = document.createElement("span");
            period.className = "schedule-course-date";
            period.textContent = `${displayDate(course.start)} ~ ${displayDate(course.end)}`;
            button.append(title, period);
            button.addEventListener("mouseenter", () => { hovered = course.id; highlight(); });
            button.addEventListener("mouseleave", () => { hovered = null; highlight(); });
            button.addEventListener("focus", () => { focused = course.id; highlight(); });
            button.addEventListener("blur", () => { focused = null; highlight(); });
            button.addEventListener("click", () => { pinned = pinned === course.id ? null : course.id; highlight(); });
            li.append(button);
            list.append(li);
        });
        days.replaceChildren();
        const cursor = new Date(month.getFullYear(), month.getMonth(), 1 - month.getDay());
        const count = Math.ceil((month.getDay() + parseDate(end).getDate()) / 7) * 7;
        const today = dateKey(new Date());
        let row;
        for (let i = 0; i < count; i++) {
            if (i % 7 === 0) { row = document.createElement("tr"); days.append(row); }
            const cell = document.createElement("td");
            const key = dateKey(cursor);
            cell.dataset.date = key;
            cell.classList.toggle("is-outside", cursor.getMonth() !== month.getMonth());
            const time = document.createElement("time");
            time.className = "schedule-day";
            time.dateTime = key;
            time.textContent = cursor.getDate();
            const scheduled = courses.filter(course => key >= course.start && key <= course.end);
            time.setAttribute("aria-label", `${cursor.getFullYear()}년 ${cursor.getMonth() + 1}월 ${cursor.getDate()}일${scheduled.length ? ", " + scheduled.map(course => course.title).join(", ") : ""}`);
            if (key === today) time.setAttribute("aria-current", "date");
            cell.append(time);
            if (scheduled.length) {
                const dots = document.createElement("span");
                dots.className = "schedule-event-dots";
                scheduled.forEach(course => {
                    const dot = document.createElement("span");
                    dot.className = `schedule-event-dot ${course.color}`;
                    dot.title = course.title;
                    dot.setAttribute("aria-hidden", "true");
                    dots.append(dot);
                });
                cell.append(dots);
            }
            row.append(cell);
            cursor.setDate(cursor.getDate() + 1);
        }
        highlight();
    }
    const picker = document.getElementById("schedule-picker");
    const pickerToggle = document.getElementById("schedule-picker-toggle");
    const monthOptions = document.getElementById("schedule-picker-months");
    const yearLabel = document.getElementById("schedule-year");
    const hasPicker = Boolean(picker && pickerToggle && monthOptions && yearLabel);
    let pickerYear = month.getFullYear();
    function closePicker(restoreFocus = false) {
        if (!hasPicker) return;
        picker.hidden = true;
        pickerToggle.setAttribute("aria-expanded", "false");
        if (restoreFocus) pickerToggle.focus();
    }
    function renderPicker() {
        if (!hasPicker) return;
        yearLabel.textContent = `${pickerYear}년`;
        monthOptions.replaceChildren();
        for (let index = 0; index < 12; index++) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = `${index + 1}월`;
            button.setAttribute("aria-label", `${pickerYear}년 ${index + 1}월`);
            button.setAttribute("aria-pressed", String(pickerYear === month.getFullYear() && index === month.getMonth()));
            button.addEventListener("click", () => {
                month = new Date(pickerYear, index, 1);
                render();
                closePicker(true);
            });
            monthOptions.append(button);
        }
    }
    if (hasPicker) pickerToggle.addEventListener("click", () => {
        if (!picker.hidden) { closePicker(); return; }
        pickerYear = month.getFullYear();
        renderPicker();
        picker.hidden = false;
        pickerToggle.setAttribute("aria-expanded", "true");
    });
    document.getElementById("schedule-year-prev")?.addEventListener("click", () => { pickerYear--; renderPicker(); });
    document.getElementById("schedule-year-next")?.addEventListener("click", () => { pickerYear++; renderPicker(); });
    document.addEventListener("click", event => {
        if (!event.target.closest(".schedule-date-select")) closePicker();
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && hasPicker && !picker.hidden) { closePicker(true); event.preventDefault(); }
    });
    document.addEventListener("focusin", event => {
        if (!event.target.closest(".schedule-date-select")) closePicker();
    });
    document.getElementById("schedule-prev")?.addEventListener("click", () => { month.setMonth(month.getMonth() - 1); render(); });
    document.getElementById("schedule-next")?.addEventListener("click", () => { month.setMonth(month.getMonth() + 1); render(); });
    render();
});
