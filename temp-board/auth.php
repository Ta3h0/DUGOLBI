<?php
// Standalone PHP session authentication; no Gnuboard bootstrap or DB connection.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    exit;
}
define('DUGOLBI_ADMIN_BOOTSTRAP', true);
$dugolbiAdminConfig = require __DIR__ . '/auth-config.php';
header('Cache-Control: no-store, private, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
session_name('DUGOLBI_TEMP_ADMIN');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/temp-board/',
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['SERVER_PORT'] ?? '') == 443,
    'httponly' => true,
    'samesite' => 'Lax',
]);
if (!session_start()) {
    http_response_code(503);
    exit('로그인 상태를 저장하지 못했습니다. 잠시 후 다시 시도해주세요.');
}

function dugolbiAdminToken(): string
{
    if (empty($_SESSION['dugolbi_csrf'])) $_SESSION['dugolbi_csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['dugolbi_csrf'];
}

function dugolbiAdminValidToken($token): bool
{
    return is_string($token) && isset($_SESSION['dugolbi_csrf']) && hash_equals($_SESSION['dugolbi_csrf'], $token);
}

function dugolbiAdminCredentialVersion(): string
{
    global $dugolbiAdminConfig;
    return hash('sha256', $dugolbiAdminConfig['username'] . '|' . $dugolbiAdminConfig['password_hash']);
}

function dugolbiAdminLoggedIn(): bool
{
    global $dugolbiAdminConfig;
    $auth = $_SESSION['dugolbi_auth'] ?? null;
    $now = time();
    if (!is_array($auth)
        || !isset($auth['username'], $auth['created'], $auth['last_seen'], $auth['version'])
        || !hash_equals($dugolbiAdminConfig['username'], (string)$auth['username'])
        || !hash_equals(dugolbiAdminCredentialVersion(), (string)$auth['version'])
        || $now - (int)$auth['last_seen'] >= $dugolbiAdminConfig['idle_timeout']
        || $now - (int)$auth['created'] >= $dugolbiAdminConfig['absolute_timeout']) {
        unset($_SESSION['dugolbi_auth']);
        return false;
    }
    $_SESSION['dugolbi_auth']['last_seen'] = $now;
    return true;
}

function dugolbiAdminRequireLogin(bool $json = false): void
{
    if (dugolbiAdminLoggedIn()) return;
    if ($json) {
        http_response_code(401);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['error' => '로그인이 필요합니다.'], JSON_UNESCAPED_UNICODE);
    } else {
        header('Location: login.php', true, 303);
    }
    exit;
}
