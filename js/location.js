const locationData = business_info.locations;

document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".location-tab");

    const title = document.querySelector(".location-title");
    const address = document.getElementById("location-address");
    const hours = document.getElementById("location-hours");
    const phone = document.getElementById("location-phone");

    const naver = document.getElementById("location-naver");
    const kakao = document.getElementById("location-kakao");

    const maps = document.querySelectorAll(".location-map");

    function changeLocation(key) {
        const data = locationData[key];

        title.textContent = data.name + " 오시는 길";
        address.textContent = data.address;

        hours.innerHTML = data.hours.join("<br>");
        phone.textContent = business_info.phone;

        window.DugolbiLinks.setOptionalLink(
            naver,
            data.naverUrl
        );

        window.DugolbiLinks.setOptionalLink(
            kakao,
            data.kakaoUrl
        );

        tabs.forEach(function (tab) {
            tab.classList.toggle(
                "is-active",
                tab.dataset.location === key
            );
        });

        maps.forEach(function (map) {
            map.classList.toggle(
                "is-active",
                map.id === "location-map-" + key
            );
        });
    }

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            changeLocation(tab.dataset.location);
        });
    });
    function renderLocationMaps() {
        if (
            !window.daum ||
            !window.daum.roughmap ||
            !window.daum.roughmap.Lander
        ) {
            return;
        }

        new daum.roughmap.Lander({
            timestamp: "1791258098959",
            key: "2sehwjfj78r",
            mapWidth: "640",
            mapHeight: "440"
        }).render();

        new daum.roughmap.Lander({
            timestamp: "1791258123716",
            key: "2sej69o8zpp",
            mapWidth: "640",
            mapHeight: "440"
        }).render();
    }

    renderLocationMaps();
    changeLocation("busan");
});