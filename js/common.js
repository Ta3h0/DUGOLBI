/* Optional external links stay visible until their real destination is supplied. */
window.DugolbiLinks = {
    setOptionalLink: function (link, value) {
        if (!link) return;
        let url;
        try { url = new URL(String(value || '')); } catch (_) { }
        const enabled = Boolean(url && /^https?:$/.test(url.protocol));
        if (enabled) link.setAttribute('href', url.href);
        else link.removeAttribute('href');
        if (enabled) {
            link.removeAttribute('aria-disabled');
            link.removeAttribute('title');
        } else {
            link.setAttribute('aria-disabled', 'true');
            link.setAttribute('title', '연결 주소 준비 중');
        }
    }
};

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
                ".results-hero, .review-hero, .schedule-hero, .signature-hero, .startup-hero"
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

        const headerInquiry = header && header.querySelector(".header-cta");
        if (headerInquiry) {
            headerInquiry.addEventListener("click", function () { closeResponsiveMenu(false); });
        }

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

    function initStatementMarquees() {
        if (document.body.classList.contains("home")) {
            return;
        }

        document.querySelectorAll(".section-carousel").forEach(function (section) {
            const item = section.querySelector(":scope > .carousel-item");
            if (!item || item.textContent.trim() !== "STRUCTURE DETERMINES FUNCTION") {
                return;
            }

            // Reuse the main page's two equal groups for a seamless CSS loop.
            const wrapper = document.createElement("div");
            wrapper.className = "carousel-wrapper";
            const group = document.createElement("div");
            group.className = "carousel-group";
            group.appendChild(item);
            wrapper.appendChild(group);

            const duplicate = group.cloneNode(true);
            duplicate.setAttribute("aria-hidden", "true");
            wrapper.appendChild(duplicate);

            section.classList.add("statement-marquee");
            section.appendChild(wrapper);
        });
    }

    function initInformationMap() {
        const host = document.querySelector(".information-map");
        if (!host) return;
        let attempts = 0;

        function renderMap() {
            if (!window.daum?.roughmap?.Lander) {
                if (++attempts < 100) window.setTimeout(renderMap, 150);
                return;
            }
            const lander = new daum.roughmap.Lander({
                timestamp: "1790929303745",
                key: "2kbq4uve66p",
                mapWidth: String(host.clientWidth),
                mapHeight: String(host.clientHeight)
            });
            lander.render();
            attempts = 0;

            function fitMap() {
                const map = lander.jsMap;
                if (!map?.getCenter) {
                    if (++attempts < 100) window.setTimeout(fitMap, 150);
                    return;
                }
                const center = map.getCenter();
                map.relayout();
                map.setCenter(center);
                host.parentElement.classList.add("is-map-ready");
                const fallback = host.parentElement.querySelector("img");
                if (fallback) fallback.setAttribute("aria-hidden", "true");
                if ("ResizeObserver" in window) {
                    new ResizeObserver(function () {
                        map.relayout();
                        map.setCenter(center);
                    }).observe(host);
                }
            }
            fitMap();
        }
        renderMap();
    }

    function initExternalLinks() {
        function updateLink(link) {
            if (link.getAttribute('href') === '#') {
                if (link.getAttribute('aria-disabled') !== 'true') window.DugolbiLinks.setOptionalLink(link, '');
                return;
            }
            let url;
            try {
                url = new URL(link.getAttribute("href"), window.location.href);
            } catch (_) {
                return;
            }
            if (!/^https?:$/.test(url.protocol) || url.origin === window.location.origin) return;
            link.target = "_blank";
            link.relList.add("noopener", "noreferrer");
        }

        function updateLinks(root) {
            if (root.matches && root.matches("a[href]")) updateLink(root);
            root.querySelectorAll("a[href]").forEach(updateLink);
        }

        updateLinks(document.body);
        // Cover content renderers, load-more cards and booking URLs set after page load.
        new MutationObserver(function (records) {
            records.forEach(function (record) {
                if (record.type === "attributes") {
                    if (record.target.matches("a[href]")) updateLink(record.target);
                    return;
                }
                record.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) updateLinks(node);
                });
            });
        }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
    }

    function initLegalDialogs() {

        const triggers =
            document.querySelectorAll(
                "[data-legal-dialog]"
            );


        if (!triggers.length) {
            return;
        }


        function openDialog(dialog) {

            if (
                !dialog ||
                typeof dialog.showModal !== "function"
            ) {
                return;
            }


            if (!dialog.open) {
                dialog.showModal();
            }


            document.body.classList.add(
                "legal-modal-open"
            );


            const body =
                dialog.querySelector(
                    ".legal-dialog-body"
                );


            if (body) {
                body.scrollTop = 0;
            }

        }


        function closeDialog(dialog) {

            if (
                dialog &&
                dialog.open
            ) {
                dialog.close();
            }

        }


        triggers.forEach(function (trigger) {

            trigger.addEventListener(
                "click",
                function () {

                    const id =
                        trigger.dataset.legalDialog;

                    const dialog =
                        document.getElementById(id);


                    openDialog(dialog);

                }
            );

        });


        document
            .querySelectorAll(".legal-dialog")
            .forEach(function (dialog) {

                const closeButtons =
                    dialog.querySelectorAll(
                        ".legal-dialog-close, .legal-dialog-confirm"
                    );


                closeButtons.forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            function () {
                                closeDialog(dialog);
                            }
                        );

                    }
                );


                dialog.addEventListener(
                    "click",
                    function (event) {

                        if (event.target === dialog) {
                            closeDialog(dialog);
                        }

                    }
                );


                dialog.addEventListener(
                    "close",
                    function () {

                        document.body.classList.remove(
                            "legal-modal-open"
                        );

                    }
                );

            });

    }

    function initCommon() {
        if (!document.body) {
            return;
        }

        document.querySelectorAll('a[href="#"]').forEach(function (link) {
            window.DugolbiLinks.setOptionalLink(link, '');
        });

        document.addEventListener('click', function (event) {
            const link = event.target.closest('a[aria-disabled="true"]');
            if (link) event.preventDefault();
        });

        initHeader();
        initExternalLinks();
        initStatementMarquees();
        initInformationMap();
        initLegalDialogs();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCommon);
    } else {
        initCommon();
    }
})();
