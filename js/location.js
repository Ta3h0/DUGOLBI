const locationData = {
    busan: {
        title: "부산 교육 본점 오시는 길",
        address: "부산 부산진구 서면로10, 207호",

        hours: [
            "두골비 10:00 ~ 14:00",
            "두골체 15:30 ~ 19:00"
        ],

        phone: "031-717-5207",

        naverUrl: "https://naver.me/FgHhGggM",
        kakaoUrl: "https://place.map.kakao.com/1689881626"
    },

    seoul: {
        title: "서울 청담 교육장 오시는 길",
        address: "서울 강남구 삼성로 723, 3층",

        hours: [
            "두골비 10:00 ~ 14:00",
            "두골체 15:30 ~ 19:00"
        ],

        phone: "02-123-4567",

        naverUrl: "https://naver.me/FgHhGggM",
        kakaoUrl: "https://place.map.kakao.com/1689881626"
    },

};

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

        title.textContent = data.title;
        address.textContent = data.address;

        hours.innerHTML = data.hours.join("<br>");
        phone.textContent = data.phone;

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

    changeLocation("busan");
});