<?php
require_once __DIR__ . '/auth.php';
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    http_response_code(405);
    exit('로그아웃 버튼을 이용해주세요.');
}
if (!dugolbiAdminValidToken($_POST['csrf_token'] ?? null)) {
    http_response_code(403);
    exit('요청이 만료되었습니다. 관리자 화면을 새로고침한 뒤 다시 시도해주세요.');
}
$_SESSION = [];
$params = session_get_cookie_params();
setcookie(session_name(), '', [
    'expires' => time() - 3600,
    'path' => $params['path'],
    'secure' => $params['secure'],
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_destroy();
header('Location: login.php', true, 303);
exit;
