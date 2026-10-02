/* Shared interactions moved from the existing DUGOLBI HTML pages. */
(function () {

    function initHeader() {
        const body =
            document.body;

        if (!body) {
            return;
        }

        const header =
            document.getElementById("header");

        const hero =
            document.querySelector(
                ".hero-section, .introduce-hero, .advanced-hero, .brand-story-hero, " +
                ".growth-hero, .montly-hero, .network-hero, .news-hero, .notice-hero, " +
                ".promotion-detail-hero, .promotion-preview-hero, .qna-hero, " +
                ".results-hero, .review-hero, .signature-hero, .startup-hero"
            );

        const menuToggle =
            document.querySelector(
                ".header-menu-toggle"
            );

        const responsiveMenu =
            document.querySelector(
                ".responsive-menu"
            );

        const navItems =
            document.querySelectorAll(
                ".responsive-nav-item"
            );

        const navButtons =
            document.querySelectorAll(
                ".responsive-nav-button"
            );

        const submenuLinks =
            document.querySelectorAll(
                ".responsive-submenu-link"
            );

        /* ==================================================
           PAGE HEADER SCROLL
        ================================================== */

        function headerScroll() {

            if (
                !header ||
                !hero
            ) {
                return;
            }

            const headerHeight =
                header.offsetHeight;

            const heroHeight =
                hero.offsetHeight;

            const triggerPoint =
                heroHeight - headerHeight;

            if (
                window.scrollY >= triggerPoint
            ) {

                header.classList.add(
                    "is-scrolled"
                );

            } else {

                header.classList.remove(
                    "is-scrolled"
                );

            }

        }

        headerScroll();

        window.addEventListener(
            "scroll",
            headerScroll,
            {
                passive: true
            }
        );

        window.addEventListener(
            "resize",
            headerScroll
        );

        // Match the CSS media conditions, including fractional viewport widths.
        const tabletMedia = window.matchMedia("(max-width: 1439px)");
        const compactTabletMedia = window.matchMedia("(max-width: 1024px)");
        const mobileMedia = window.matchMedia("(max-width: 768px)");

        function getResponsiveMode() {
            if (!tabletMedia.matches) return "desktop";
            return mobileMedia.matches ? "mobile" : "tablet";
        }

        function setNavState(item, isOpen) {
            item.classList.toggle("active", isOpen);
            const button = item.querySelector(".responsive-nav-button");
            const submenu = item.querySelector(".responsive-submenu");
            if (button) button.setAttribute("aria-expanded", String(isOpen));
            if (submenu) {
                submenu.inert = !isOpen;
                submenu.setAttribute("aria-hidden", String(!isOpen));
            }
        }

        function closeAllResponsiveNav() {
            navItems.forEach(function (item) { setNavState(item, false); });
        }

        function openFirstResponsiveNav() {
            closeAllResponsiveNav();
            if (navItems.length) setNavState(navItems[0], true);
        }

        function closeResponsiveMenu(restoreFocus = true) {
            const wasOpen = responsiveMenu && responsiveMenu.classList.contains("is-open");
            if (menuToggle) {
                menuToggle.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "메뉴 열기");
            }
            if (responsiveMenu) {
                responsiveMenu.classList.remove("is-open");
                responsiveMenu.inert = true;
                responsiveMenu.setAttribute("aria-hidden", "true");
                responsiveMenu.scrollTop = 0;
            }
            if (header) header.classList.remove("menu-open");
            body.classList.remove("menu-open");
            if (getResponsiveMode() === "mobile") closeAllResponsiveNav();
            if (wasOpen && restoreFocus) {
                const target = getResponsiveMode() === "desktop"
                    ? header.querySelector(".header-logo") : menuToggle;
                if (target) target.focus({ preventScroll: true });
            }
        }

        function resetResponsiveNav() {
            if (getResponsiveMode() === "tablet") openFirstResponsiveNav();
            else closeAllResponsiveNav();
        }

        if (responsiveMenu) {
            responsiveMenu.inert = true;
            responsiveMenu.setAttribute("aria-hidden", "true");
        }
        resetResponsiveNav();

        if (menuToggle && responsiveMenu && header) {
            menuToggle.addEventListener("click", function () {
                if (responsiveMenu.classList.contains("is-open")) {
                    closeResponsiveMenu();
                    return;
                }
                const mode = getResponsiveMode();
                if (mode === "desktop") return;
                if (mode === "mobile") closeAllResponsiveNav();
                else if (!responsiveMenu.querySelector(".responsive-nav-item.active")) openFirstResponsiveNav();

                menuToggle.classList.add("is-open");
                menuToggle.setAttribute("aria-expanded", "true");
                menuToggle.setAttribute("aria-label", "메뉴 닫기");
                responsiveMenu.inert = false;
                responsiveMenu.setAttribute("aria-hidden", "false");
                responsiveMenu.classList.add("is-open");
                header.classList.add("menu-open");
                body.classList.add("menu-open");
            });
        }

        navButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                const item = button.closest(".responsive-nav-item");
                const mode = getResponsiveMode();
                if (!item || mode === "desktop") return;
                const wasOpen = item.classList.contains("active");
                closeAllResponsiveNav();
                if (mode === "tablet" || !wasOpen) setNavState(item, true);
            });
        });

        submenuLinks.forEach(function (link) {
            link.addEventListener("click", function () { closeResponsiveMenu(); });
        });

        document.addEventListener("keydown", function (event) {
            if (!responsiveMenu || !responsiveMenu.classList.contains("is-open")) return;
            if (event.key === "Escape") {
                event.preventDefault();
                closeResponsiveMenu();
                return;
            }
            if (event.key !== "Tab") return;
            // Keep keyboard navigation inside the open menu and its header controls.
            const controls = Array.from(header.querySelectorAll("a[href], button:not([disabled])"))
                .filter(function (element) {
                    return !element.closest("[inert]") && element.getClientRects().length > 0
                        && getComputedStyle(element).visibility !== "hidden";
                });
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                if (last) last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                if (first) first.focus();
            }
        });

        function responsiveHeaderResize() {
            closeResponsiveMenu();
            resetResponsiveNav();
        }
        // Only reset at a layout boundary; resizing within a mode keeps user selection.
        [tabletMedia, compactTabletMedia, mobileMedia].forEach(function (media) {
            media.addEventListener("change", responsiveHeaderResize);
        });
    }

    function initCommon() {
        if (!document.body) {
            return;
        }

        initHeader();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCommon);
    } else {
        initCommon();
    }
})();
