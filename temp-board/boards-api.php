<?php
// Step 1: authenticated board metadata lookup only. No writes or uploads.
require_once __DIR__ . '/auth.php';
dugolbiAdminRequireLogin(true);
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, private, max-age=0');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    header('Allow: GET');
    http_response_code(405);
    echo json_encode(['ok' => false, 'code' => 'METHOD_NOT_ALLOWED', 'message' => '조회 요청만 사용할 수 있습니다.'], JSON_UNESCAPED_UNICODE);
    exit;
}
session_write_close();

function dugolbiBoardFailure(string $code, string $message, int $status = 503): void
{
    http_response_code($status);
    echo json_encode(['ok' => false, 'code' => $code, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

$boardPath = dirname(__DIR__) . '/board';
if (!is_file($boardPath . '/common.php')) {
    dugolbiBoardFailure('BOARD_NOT_INSTALLED', '이 서버에 그누보드 설치 파일이 없습니다. 운영 서버에 연결 파일을 올린 뒤 확인해주세요.');
}
$dbConfigPath = $boardPath . '/data/dbconfig.php';
if (!is_readable($dbConfigPath)) {
    dugolbiBoardFailure('DB_CONFIG_MISSING', '그누보드 DB 설정 파일을 읽을 수 없습니다. 서버의 파일 위치와 읽기 권한을 확인해주세요.');
}
if (!extension_loaded('mysqli')) {
    dugolbiBoardFailure('DB_DRIVER_MISSING', '서버의 PHP mysqli 확장을 사용할 수 없습니다. 호스팅 PHP 설정을 확인해주세요.');
}

// Full common.php also runs visitor logging, housekeeping and session setup.
// Reuse its existing dbconfig.php only to keep this endpoint free of those effects.
if (!defined('_GNUBOARD_')) define('_GNUBOARD_', true);
$bufferLevel = ob_get_level();
ob_start();
set_error_handler(static function ($severity, $message, $file, $line) {
    throw new ErrorException('DB configuration could not be loaded.', 0, $severity, $file, $line);
});
try {
    $tables = (static function ($file) {
        $g5 = [];
        require $file;
        return $g5;
    })($dbConfigPath);
} catch (Throwable $error) {
    while (ob_get_level() > $bufferLevel) ob_end_clean();
    restore_error_handler();
    dugolbiBoardFailure('DB_CONFIG_INVALID', '그누보드 DB 설정을 불러오지 못했습니다. 서버 설정을 확인해주세요.');
}
while (ob_get_level() > $bufferLevel) ob_end_clean();
restore_error_handler();
foreach (['G5_MYSQL_HOST', 'G5_MYSQL_USER', 'G5_MYSQL_PASSWORD', 'G5_MYSQL_DB'] as $setting) {
    if (!defined($setting) || !is_string(constant($setting))) {
        dugolbiBoardFailure('DB_CONFIG_INVALID', '그누보드 DB 설정의 필수 항목이 없습니다.');
    }
}
foreach (['board_table', 'group_table'] as $key) {
    if (!isset($tables[$key]) || !is_string($tables[$key]) || !preg_match('/\A[A-Za-z0-9_]+\z/', $tables[$key])) {
        dugolbiBoardFailure('DB_CONFIG_INVALID', '그누보드 게시판 테이블 설정을 확인해주세요.');
    }
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$db = null;
try {
    $db = mysqli_init();
    $db->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5);
    if (defined('MYSQLI_OPT_READ_TIMEOUT')) $db->options(MYSQLI_OPT_READ_TIMEOUT, 10);
    $db->real_connect(G5_MYSQL_HOST, G5_MYSQL_USER, G5_MYSQL_PASSWORD, G5_MYSQL_DB);
    $db->set_charset(defined('G5_DB_CHARSET') ? G5_DB_CHARSET : 'utf8mb4');
} catch (Throwable $error) {
    // Do not send connection credentials, DB names, paths or SQL errors to clients.
    dugolbiBoardFailure('DB_CONNECTION_FAILED', 'DB에 연결하지 못했습니다. 기존 그누보드 접속 상태와 서버 DB 설정을 확인해주세요.');
}
try {
    $result = $db->query("SELECT b.bo_table, b.bo_subject, b.gr_id,
        COALESCE(g.gr_subject, '') AS group_name,
        b.bo_count_write, b.bo_count_comment,
        b.bo_list_level, b.bo_read_level, b.bo_write_level,
        b.bo_use_category, b.bo_category_list
        FROM `{$tables['board_table']}` b
        LEFT JOIN `{$tables['group_table']}` g ON g.gr_id = b.gr_id
        ORDER BY group_name, b.bo_subject, b.bo_table");
    $boards = [];
    while ($row = $result->fetch_assoc()) {
        $boards[] = [
            'id' => (string)$row['bo_table'],
            'name' => (string)$row['bo_subject'],
            'groupId' => (string)$row['gr_id'],
            'groupName' => (string)$row['group_name'],
            'postCount' => max(0, (int)$row['bo_count_write']),
            'commentCount' => max(0, (int)$row['bo_count_comment']),
            'listLevel' => (int)$row['bo_list_level'],
            'readLevel' => (int)$row['bo_read_level'],
            'writeLevel' => (int)$row['bo_write_level'],
            'categories' => $row['bo_use_category'] ? array_values(array_filter(explode('|', (string)$row['bo_category_list']), 'strlen')) : [],
            'url' => '/board/bbs/board.php?bo_table=' . rawurlencode((string)$row['bo_table']),
        ];
    }
    $result->free();
    $db->close();
    echo json_encode(['ok' => true, 'mode' => 'read-only', 'boards' => $boards, 'checkedAt' => gmdate('c')], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
} catch (Throwable $error) {
    if ($db) $db->close();
    dugolbiBoardFailure('DB_QUERY_FAILED', 'DB에는 연결했지만 게시판 목록을 읽지 못했습니다. 그누보드 테이블 설정을 확인해주세요.');
}
