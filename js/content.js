/* Shared formatting for existing static content renderers. */
(function () {
    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
        });
    }

    function lines(value) {
        return escapeHtml(value).replace(/\n/g, "<br>");
    }


    window.DugolbiContent = { escapeHtml: escapeHtml, lines: lines };
})();
