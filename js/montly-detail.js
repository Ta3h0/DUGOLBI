document.addEventListener("DOMContentLoaded", function () {
    const phoneLink = document.getElementById("montly-phone");
    const status = document.getElementById("montly-phone-status");
    const copyField = document.getElementById("montly-phone-copy");
    if (!phoneLink || !status || !copyField) return;
    const phone = copyField.value;
    if (!phone) return;
    // Device detection keeps a narrow desktop window in copy mode.
    function isMobileDevice() {
        return Boolean(navigator.userAgentData && navigator.userAgentData.mobile) ||
            /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    }
    phoneLink.addEventListener("click", async function (event) {
        if (isMobileDevice()) return; // Preserve the native tel: link on mobile.
        event.preventDefault();
        let copied = false;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(phone);
                copied = true;
            }
        } catch (error) {
            // Fall back for insecure hosting or blocked clipboard permissions.
        }
        if (!copied) {
            copyField.hidden = false;
            copyField.focus();
            copyField.select();
            try { copied = document.execCommand("copy"); } catch (error) { copied = false; }
        }
        copyField.hidden = copied;
        status.textContent = copied ? "전화번호가 복사되었습니다. " + phone : "자동 복사가 제한되어 있습니다. 아래 전화번호를 직접 복사해 주세요.";
        if (copied) phoneLink.focus();
    });
});
