<?php
require_once __DIR__ . '/auth.php';
dugolbiAdminRequireLogin();
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title>두골비 홈페이지 관리 · 임시 대시보드</title>
    <link rel="icon" href="../images/logo-black.svg" type="image/svg+xml">
    <link rel="stylesheet" href="../css/reset.css">
    <link rel="stylesheet" href="../css/common.css">
    <script src="../js/modify.js" defer></script>
    <script src="seed.php" defer></script>
    <script src="boards.js?v=<?= filemtime(__DIR__ . '/boards.js') ?>" defer></script>
    <script src="posts.js?v=<?= filemtime(__DIR__ . '/posts.js') ?>" defer></script>
    <script src="admin.js" defer></script>
</head>
<body class="temp-admin">
    <a href="#admin-content" class="admin-skip">본문으로 이동</a>
    <aside class="admin-sidebar" id="admin-sidebar" aria-label="관리 메뉴">
        <a class="admin-brand" href="#overview"><img src="../images/common/footer-logo.svg" alt="DUGOLBI·CHE"><span>홈페이지 관리</span></a>
        <nav id="admin-nav" aria-label="주 메뉴"></nav>
        <div class="admin-sidebar-bottom">
            <a href="../index.html" target="_blank" rel="noopener noreferrer" class="admin-site-link">홈페이지 보기 <span aria-hidden="true">↗</span></a>
            <div class="admin-profile"><span class="admin-avatar" aria-hidden="true">D</span><div><strong>관리자 <?= htmlspecialchars($dugolbiAdminConfig['username'], ENT_QUOTES, 'UTF-8') ?></strong><small>임시 미리보기</small></div></div>
        </div>
    </aside>
    <div class="admin-shell">
        <header class="admin-topbar">
            <button class="admin-icon-button admin-menu-toggle" id="admin-menu-toggle" aria-controls="admin-sidebar" aria-expanded="false" aria-label="관리 메뉴 열기"></button>
            <div class="admin-breadcrumb">홈페이지 관리 <span aria-hidden="true">/</span> <strong id="admin-breadcrumb">대시보드</strong></div>
            <div class="admin-topbar-right"><span id="admin-today"></span><form action="logout.php" method="post"><input type="hidden" name="csrf_token" value="<?= htmlspecialchars(dugolbiAdminToken(), ENT_QUOTES, 'UTF-8') ?>"><button class="admin-button admin-logout-button" type="submit">로그아웃</button></form></div>
        </header>
        <main id="admin-content" class="admin-content" tabindex="-1">
            <div class="admin-demo-notice"><span class="admin-notice-dot" aria-hidden="true"></span><p><strong>게시판은 서버 조회 전용입니다.</strong> 교육·일정 등 나머지 변경 내용은 이 브라우저에만 저장되며 운영 홈페이지에는 반영되지 않습니다.</p></div>
            <div id="admin-source-status" class="admin-source-status" hidden></div>
            <div id="admin-view"></div>
        </main>
        <footer class="admin-footer">DUGOLBI·CHE <span>홈페이지 관리 · 임시 버전</span></footer>
    </div>
    <div class="admin-menu-backdrop" id="admin-menu-backdrop" hidden></div>
    <dialog id="admin-editor" class="admin-editor" aria-labelledby="admin-editor-title">
        <form id="admin-edit-form">
            <div class="admin-editor-head"><div><h2 id="admin-editor-title">내용 수정</h2><p>저장한 내용은 임시 관리자에서 확인할 수 있습니다.</p></div><button type="button" class="admin-icon-button" data-close-editor aria-label="편집 닫기"></button></div>
            <div class="admin-editor-body" id="admin-editor-fields"></div>
            <p class="admin-form-error" id="admin-form-error" role="alert" hidden></p>
            <div class="admin-editor-foot"><span>브라우저 임시 저장</span><div><button type="button" class="admin-button" data-close-editor>취소</button><button type="submit" class="admin-button admin-primary">저장하기</button></div></div>
        </form>
    </dialog>
    <dialog id="admin-confirm" class="admin-confirm" aria-labelledby="admin-confirm-title"><form method="dialog"><h2 id="admin-confirm-title">항목을 삭제할까요?</h2><p id="admin-confirm-message"></p><div class="admin-confirm-actions"><button class="admin-button" value="cancel">취소</button><button class="admin-button admin-danger" value="confirm">삭제하기</button></div></form></dialog>
    <div id="admin-toast" class="admin-toast" role="status" aria-live="polite" hidden></div>
    <noscript><p class="admin-noscript">관리 화면을 사용하려면 브라우저의 JavaScript를 켜주세요.</p></noscript>
</body>
</html>
