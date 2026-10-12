document.addEventListener("DOMContentLoaded", function () {
    const list = document.getElementById("schedule-list");
    const days = document.getElementById("schedule-days");
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
    const locationSelect = document.getElementById("schedule-location");
    const locationTitle = document.getElementById("schedule-location-title");
    const locations = typeof business_info !== "undefined" ? business_info.locations : {
        busan: { name: "부산 교육 본점" }, seoul: { name: "서울 청담 교육장" }
    };
    let selectedLocation = "busan";
    locationSelect?.querySelectorAll("option").forEach(option => {
        if (locations[option.value]) option.textContent = locations[option.value].name;
    });
    const locationControl = document.querySelector(".schedule-location-control");
    const locationTrigger = document.getElementById("schedule-location-trigger");
    const locationMenu = document.getElementById("schedule-location-menu");
    const locationValue = document.querySelector(".schedule-location-value");
    const locationOptions = Array.from(document.querySelectorAll(".schedule-location-option"));
    const hasLocationMenu = Boolean(locationSelect && locationControl && locationTrigger && locationMenu && locationValue);
    function syncLocationMenu() {
        if (!hasLocationMenu) return;
        locationValue.textContent = locations[selectedLocation].name;
        locationTrigger.setAttribute("aria-label", `교육장 선택: ${locations[selectedLocation].name}`);
        locationOptions.forEach(option => {
            if (locations[option.dataset.value]) option.textContent = locations[option.dataset.value].name;
            option.setAttribute("aria-selected", String(option.dataset.value === selectedLocation));
        });
    }
    function closeLocationMenu(restoreFocus = false) {
        if (!hasLocationMenu) return;
        locationMenu.hidden = true;
        locationControl.classList.remove("is-open");
        locationTrigger.setAttribute("aria-expanded", "false");
        if (restoreFocus) locationTrigger.focus({ preventScroll: true });
    }
    function openLocationMenu() {
        if (!hasLocationMenu) return;
        closePicker();
        locationMenu.hidden = false;
        locationControl.classList.add("is-open");
        locationTrigger.setAttribute("aria-expanded", "true");
        const selected = locationOptions.find(option => option.dataset.value === selectedLocation);
        selected?.focus({ preventScroll: true });
    }
    if (hasLocationMenu) {
        syncLocationMenu();
        locationSelect.hidden = true;
        locationTrigger.hidden = false;
        locationTrigger.addEventListener("click", () => {
            if (locationMenu.hidden) openLocationMenu();
            else closeLocationMenu();
        });
        locationTrigger.addEventListener("keydown", event => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
            event.preventDefault();
            openLocationMenu();
        });
        locationOptions.forEach((option, index) => {
            option.addEventListener("click", () => {
                locationSelect.value = option.dataset.value;
                locationSelect.dispatchEvent(new Event("change", { bubbles: true }));
                closeLocationMenu(true);
            });
            option.addEventListener("keydown", event => {
                let target;
                if (event.key === "ArrowDown") target = (index + 1) % locationOptions.length;
                else if (event.key === "ArrowUp") target = (index - 1 + locationOptions.length) % locationOptions.length;
                else if (event.key === "Home") target = 0;
                else if (event.key === "End") target = locationOptions.length - 1;
                else return;
                event.preventDefault();
                locationOptions[target].focus({ preventScroll: true });
            });
        });
        document.addEventListener("click", event => {
            if (!locationControl.contains(event.target)) closeLocationMenu();
        });
        document.addEventListener("focusin", event => {
            if (!locationControl.contains(event.target)) closeLocationMenu();
        });
        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && !locationMenu.hidden) {
                event.preventDefault();
                closeLocationMenu(true);
            }
        });
    }
    // Inclusive dates remain supported; weekly schedules may omit either date bound.
    const source = typeof scheduleData !== "undefined" && Array.isArray(scheduleData) ? scheduleData : [];
    const allCourses = source.filter(course => {
        if (!course || !locations[course.location || "busan"]) return false;
        if ((course.start && !parseDate(course.start)) || (course.end && !parseDate(course.end))) return false;
        if (course.start && course.end && course.start > course.end) return false;
        if (course.weekdays !== undefined) {
            return Array.isArray(course.weekdays) && course.weekdays.length > 0
                && course.weekdays.every(day => Number.isInteger(day) && day >= 0 && day <= 6);
        }
        return Boolean(parseDate(course.start) && parseDate(course.end));
    }).map((course, index) => ({
        ...course,
        weekdays: course.weekdays ? [...new Set(course.weekdays)].sort((a, b) => a - b) : null,
        location: course.location || "busan",
        id: course.id ? String(course.id) : `schedule-${index + 1}`,
        color: /^schedule-color-[1-5]$/.test(course.color) ? course.color : `schedule-color-${index % 5 + 1}`
    }));
    let courses = allCourses.filter(course => course.location === selectedLocation);
    const dateKey = date => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
    const displayDate = value => value.replaceAll("-", ".");
    const weekdayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const matchesDate = (course, key) => Boolean(course
        && (!course.start || key >= course.start)
        && (!course.end || key <= course.end)
        && (!course.weekdays || course.weekdays.includes(parseDate(key).getDay())));
    const adjacentDate = (key, offset) => {
        const date = parseDate(key);
        date.setDate(date.getDate() + offset);
        return dateKey(date);
    };
    function scheduleLabel(course) {
        const bounds = course.start && course.end ? `${displayDate(course.start)} ~ ${displayDate(course.end)}`
            : course.start ? `${displayDate(course.start)}부터` : course.end ? `${displayDate(course.end)}까지` : "";
        const repeat = course.weekdays ? `매주 ${course.weekdays.map(day => weekdayNames[day]).join(", ")}` : "";
        const times = Array.isArray(course.times) ? course.times.join(" / ") : "";
        return [repeat, bounds, times].filter(Boolean).join(" · ");
    }
    let month = courses.length && !courses[0].weekdays ? parseDate(courses[0].start) : new Date();
    month.setDate(1);
    let pinned = null;
    let hovered = null;
    let focused = null;
    let previewed = null;
    const mobile = window.matchMedia("(max-width: 768px)");
    const panel = document.getElementById("schedule-calendar-panel");
    const sheetTitle = document.getElementById("schedule-sheet-title");
    const sheetMonth = document.getElementById("schedule-sheet-month");
    const sheetClose = document.querySelector(".schedule-sheet-close");
    const backdrop = document.querySelector(".schedule-calendar-backdrop");
    const bookingLinks = document.querySelectorAll(".schedule-booking-naver");
    const guide = document.querySelector(".schedule-guide");
    const background = [
        document.querySelector(".header"), document.querySelector("footer"),
        document.querySelector(".schedule-title-box"), document.querySelector(".schedule-toolbar"),
        document.querySelector(".schedule-list-panel")
    ].filter(Boolean);
    const backgroundState = new Map();
    let sheetTrigger = null;
    let sheetOpen = false;
    function updateBooking(course) {
        bookingLinks.forEach(link => {
            window.DugolbiLinks.setOptionalLink(
                link,
                (course && course.naverBookingUrl)
                    || (typeof scheduleBookingUrls !== "undefined" ? scheduleBookingUrls[selectedLocation] : locations[selectedLocation].naverUrl)
            );
        });
    }
    updateBooking(null);

    function closeSheet(restoreFocus = true) {
        if (!sheetOpen) return;
        sheetOpen = false;
        document.body.classList.remove("schedule-calendar-open");
        backgroundState.forEach((value, element) => { element.inert = value; });
        backgroundState.clear();
        if (restoreFocus && sheetTrigger?.isConnected) sheetTrigger.focus({ preventScroll: true });
        if (panel) {
            panel.inert = mobile.matches;
            if (mobile.matches) panel.setAttribute("aria-hidden", "true");
        }
    }
    function syncSheetMode() {
        closeSheet();
        if (panel) {
            panel.inert = mobile.matches;
            if (mobile.matches) {
                panel.setAttribute("role", "dialog");
                panel.setAttribute("aria-modal", "true");
                panel.setAttribute("aria-labelledby", "schedule-sheet-title");
                panel.setAttribute("aria-hidden", "true");
            } else {
                ["role", "aria-modal", "aria-labelledby", "aria-hidden"].forEach(name => panel.removeAttribute(name));
            }
        }
        list.querySelectorAll("button").forEach(button => {
            if (mobile.matches) {
                button.setAttribute("aria-haspopup", "dialog");
                button.setAttribute("aria-controls", "schedule-calendar-panel");
            } else {
                button.removeAttribute("aria-haspopup");
                button.removeAttribute("aria-controls");
            }
        });
        if (guide) guide.textContent = mobile.matches
            ? "교육 일정을 터치하면 달력에서 교육 날짜를 확인할 수 있습니다."
            : "교육 일정을 선택하면 달력에서 교육 날짜를 확인할 수 있습니다.";
        hovered = focused = previewed = null;
        highlight();
    }
    function openSheet(course, button) {
        closeLocationMenu();
        if (!panel || !mobile.matches) return;
        closePicker();
        sheetTrigger = button;
        sheetTitle.textContent = course.title;
        sheetMonth.textContent = `${locations[selectedLocation].name} · ${monthLabel.textContent}`;
        background.forEach(element => { backgroundState.set(element, element.inert); element.inert = true; });
        panel.inert = false;
        panel.setAttribute("aria-hidden", "false");
        sheetOpen = true;
        document.body.classList.add("schedule-calendar-open");
        panel.scrollTop = 0;
        sheetClose.focus({ preventScroll: true });
    }
    sheetClose?.addEventListener("click", () => closeSheet());
    backdrop?.addEventListener("click", () => closeSheet());
    mobile.addEventListener("change", syncSheetMode);
    document.addEventListener("keydown", event => {
        if (!sheetOpen) return;
        if (event.key === "Escape") { event.preventDefault(); closeSheet(); return; }
        if (event.key !== "Tab") return;
        const controls = Array.from(panel.querySelectorAll("button, a[href]")).filter(element => element.getClientRects().length && element.getAttribute("aria-disabled") !== "true");
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => document.body.classList.toggle("reduce-motion", reducedMotion.matches);
    updateMotion();
    reducedMotion.addEventListener("change", updateMotion);

    function highlight() {
        const selectedCourse = courses.find(item => item.id === pinned);
        const previewId = mobile.matches ? null : (hovered || focused || (!pinned ? previewed : null));
        const previewCourse = previewId !== pinned ? courses.find(item => item.id === previewId) : null;
        const course = selectedCourse || previewCourse;
        // Reservation actions always belong to the clicked selection, even during preview.
        updateBooking(course);
        list.querySelectorAll("button").forEach(button => {
            const selected = button.dataset.id === pinned;
            button.classList.toggle("is-active", selected);
            button.classList.toggle("is-preview", Boolean(previewCourse && button.dataset.id === previewCourse.id));
            button.setAttribute("aria-pressed", String(selected));
        });
        days.querySelectorAll("td").forEach(cell => {
            const selected = matchesDate(selectedCourse, cell.dataset.date);
            const preview = matchesDate(previewCourse, cell.dataset.date);
            // Keep the outgoing fill's color and rounded ends while its opacity fades.
            // Inactive fills stay transparent; the next selection updates their geometry.
            if (selected) {
                courses.forEach(item => cell.classList.remove(item.color));
                cell.classList.add(selectedCourse.color);
                cell.classList.toggle("range-start", cell.cellIndex === 0 || !matchesDate(selectedCourse, adjacentDate(cell.dataset.date, -1)));
                cell.classList.toggle("range-end", cell.cellIndex === 6 || !matchesDate(selectedCourse, adjacentDate(cell.dataset.date, 1)));
            }
            cell.classList.toggle("is-highlighted", selected);
            cell.classList.toggle("is-preview", preview);
        });
    }

    function render() {
        const end = dateKey(new Date(month.getFullYear(), month.getMonth() + 1, 0));
        const monthDates = Array.from({ length: parseDate(end).getDate() }, (_, index) => dateKey(new Date(month.getFullYear(), month.getMonth(), index + 1)));
        const visible = courses.filter(course => monthDates.some(key => matchesDate(course, key)));
        pinned = hovered = focused = previewed = null;
        if (monthLabel) monthLabel.textContent = `${month.getFullYear()}. ${String(month.getMonth() + 1).padStart(2, "0")}`;
        const locationName = locations[selectedLocation].name;
        if (locationTitle) locationTitle.textContent = `${locationName} 교육일정`;
        if (countLabel) countLabel.textContent = `${visible.length}개 과정`;
        if (emptyMessage) {
            emptyMessage.hidden = visible.length > 0;
            emptyMessage.textContent = `${locationName}의 이번 달 등록된 교육 일정이 없습니다. 다른 달 또는 교육장을 확인해 주세요.`;
        }
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
            period.textContent = scheduleLabel(course);
            button.append(title, period);
            button.addEventListener("mouseenter", () => { if (mobile.matches) return; hovered = previewed = course.id; highlight(); });
            button.addEventListener("mouseleave", () => { hovered = null; highlight(); });
            button.addEventListener("focus", () => { if (mobile.matches) return; hovered = null; focused = previewed = course.id; highlight(); });
            button.addEventListener("blur", () => { focused = null; highlight(); });
            if (mobile.matches) {
                button.setAttribute("aria-haspopup", "dialog");
                button.setAttribute("aria-controls", "schedule-calendar-panel");
            }
            button.addEventListener("click", () => {
                pinned = course.id;
                hovered = focused = previewed = null;
                highlight();
                if (mobile.matches) openSheet(course, button);
            });
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
            const scheduled = courses.filter(course => matchesDate(course, key));
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
        closeLocationMenu();
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
    locationSelect?.addEventListener("change", () => {
        if (!locations[locationSelect.value]) return;
        closeSheet(false);
        closePicker();
        selectedLocation = locationSelect.value;
        syncLocationMenu();
        closeLocationMenu();
        courses = allCourses.filter(course => course.location === selectedLocation);
        // Keep the chosen month when switching classrooms.
        render();
    });
    render();
    syncSheetMode();
});
