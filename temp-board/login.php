<?php
require_once __DIR__ . '/auth.php';
if (dugolbiAdminLoggedIn()) {
    header('Location: index.php', true, 303);
    exit;
}
$error = '';
$username = '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if (!in_array($method, ['GET', 'POST'], true)) {
    header('Allow: GET, POST');
    http_response_code(405);
    exit;
}
if ($method === 'POST') {
    $username = is_string($_POST['username'] ?? null) ? trim($_POST['username']) : '';
    $password = is_string($_POST['password'] ?? null) ? $_POST['password'] : '';
    $now = time();
    if (!dugolbiAdminValidToken($_POST['csrf_token'] ?? null)) {
        http_response_code(403);
        $error = '로그인 요청이 만료되었습니다. 다시 시도해주세요.';
    } elseif ((int)($_SESSION['dugolbi_blocked_until'] ?? 0) > $now) {
        http_response_code(429);
        $error = '로그인 시도가 많습니다. 1분 뒤 다시 시도해주세요.';
    } else {
        if ((int)($_SESSION['dugolbi_blocked_until'] ?? 0) <= $now && !empty($_SESSION['dugolbi_blocked_until'])) {
            unset($_SESSION['dugolbi_attempts'], $_SESSION['dugolbi_blocked_until']);
        }
        $validPassword = strlen($password) <= 256 && password_verify($password, $dugolbiAdminConfig['password_hash']);
        if (strlen($username) <= 64 && hash_equals($dugolbiAdminConfig['username'], $username) && $validPassword) {
            session_regenerate_id(true);
            $_SESSION['dugolbi_auth'] = [
                'username' => $dugolbiAdminConfig['username'],
                'created' => $now,
                'last_seen' => $now,
                'version' => dugolbiAdminCredentialVersion(),
            ];
            $_SESSION['dugolbi_csrf'] = bin2hex(random_bytes(32));
            unset($_SESSION['dugolbi_attempts'], $_SESSION['dugolbi_blocked_until']);
            header('Location: index.php', true, 303);
            exit;
        }
        $_SESSION['dugolbi_attempts'] = (int)($_SESSION['dugolbi_attempts'] ?? 0) + 1;
        if ($_SESSION['dugolbi_attempts'] >= 5) $_SESSION['dugolbi_blocked_until'] = $now + 60;
        http_response_code(401);
        $error = '아이디 또는 비밀번호를 확인해주세요.';
    }
}
$token = dugolbiAdminToken();
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title>관리자 로그인 | 두골비·체</title>
    <link rel="icon" href="../images/logo-black.svg" type="image/svg+xml">
    <link rel="stylesheet" href="../css/reset.css">
    <link rel="stylesheet" href="../css/common.css">
</head>
<body class="temp-admin admin-login">
    <main class="admin-login-card" aria-labelledby="admin-login-title">
        <img class="admin-login-logo" src="../images/common/footer-logo.svg" alt="DUGOLBI·CHE">
        <h1 id="admin-login-title">관리자 로그인</h1>
        <p class="admin-login-description">관리자 계정으로 로그인해 주세요.</p>
        <?php if ($error !== ''): ?>
        <p class="admin-login-error" id="admin-login-error" role="alert"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p>
        <?php endif; ?>
        <form action="login.php" method="post" class="admin-login-form">
            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>">
            <div class="admin-field">
                <label for="admin-username">아이디</label>
                <input id="admin-username" name="username" autocomplete="username" maxlength="64" value="<?= htmlspecialchars($username, ENT_QUOTES, 'UTF-8') ?>" required autofocus>
            </div>
            <div class="admin-field">
                <label for="admin-password">비밀번호</label>
                <input id="admin-password" name="password" type="password" autocomplete="current-password" maxlength="256" required>
            </div>
            <button type="submit" class="admin-button admin-primary">로그인</button>
        </form>
        <a class="admin-login-back" href="../index.html">홈페이지로 돌아가기 ↗</a>
    </main>
</body>
</html>
