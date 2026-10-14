<?php
// Edit only the explicitly exposed settings of an existing Gnuboard board.
require_once __DIR__ . '/auth.php';
dugolbiAdminRequireLogin(true);
$bsBuffer = ob_get_level();
$bsResponded = false;
$bsStarted = false;
$bsCookies = session_get_cookie_params();
ob_start();
ini_set('display_errors', '0');
function dgSettingsResponse(array $data, int $status = 200): void
{
    global $bsBuffer, $bsResponded, $bsCookies;
    $bsResponded = true;
    while (ob_get_level() > $bsBuffer) ob_end_clean();
    header_remove('Location');
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store, private, max-age=0');
    http_response_code($status);
    if (session_status() === PHP_SESSION_ACTIVE) {
        header_remove('Set-Cookie');
        setcookie('DUGOLBI_TEMP_ADMIN', session_id(), ['path' => '/temp-board/', 'secure' => $bsCookies['secure'], 'httponly' => true, 'samesite' => 'Lax']);
        session_write_close();
    }
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}
function dgSettingsFail(string $code, string $message, int $status = 422): void
{
    dgSettingsResponse(['ok' => false, 'code' => $code, 'message' => $message], $status);
}
register_shutdown_function(static function () {
    global $bsResponded, $bsStarted;
    if (!$bsResponded) dgSettingsFail('SERVER_ERROR', $bsStarted ? '저장 결과를 확인하지 못했습니다. 설정을 다시 열어 확인해주세요.' : '그누보드 실행 환경을 확인해주세요.', 500);
});
$bsMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if (!in_array($bsMethod, ['GET', 'POST'], true)) {
    header('Allow: GET, POST');
    dgSettingsFail('METHOD_NOT_ALLOWED', '허용되지 않는 요청입니다.', 405);
}
$bsInput = $bsMethod === 'GET' ? $_GET : $_POST;
$bsBoard = $bsInput['board'] ?? '';
if (!is_string($bsBoard) || !preg_match('/\A[A-Za-z0-9_]{1,20}\z/', $bsBoard)) dgSettingsFail('INVALID_REQUEST', '게시판 ID를 확인해주세요.', 400);
if ($bsMethod === 'POST') {
    if (!dugolbiAdminValidToken($bsInput['csrf_token'] ?? null)) dgSettingsFail('TOKEN_EXPIRED', '편집 화면을 다시 열어주세요.', 403);
    $bsToken = $bsInput['operation_token'] ?? '';
    $bsTicket = is_string($bsToken) ? ($_SESSION['dugolbi_settings_operations'][$bsToken] ?? null) : null;
    if (!$bsTicket || $bsTicket['board'] !== $bsBoard || $bsTicket['expires'] < time()) dgSettingsFail('TOKEN_EXPIRED', '편집 요청이 만료되었습니다. 설정을 다시 열어주세요.', 403);
    if (isset($bsTicket['result'])) dgSettingsResponse($bsTicket['result']);
    if ($bsTicket['state'] !== 'ready') dgSettingsFail('ALREADY_SUBMITTED', '이미 요청한 작업입니다. 설정을 다시 열어 결과를 확인해주세요.', 409);
}
$bsCorePath = dirname(__DIR__) . '/board';
if (!is_file($bsCorePath . '/common.php') || !is_file($bsCorePath . '/data/dbconfig.php')) dgSettingsFail('BOARD_NOT_INSTALLED', '이 서버에 그누보드 설치 또는 DB 설정이 없습니다.', 503);
if (!extension_loaded('mysqli')) dgSettingsFail('DB_DRIVER_MISSING', 'PHP mysqli 확장을 확인해주세요.', 503);

// Match the already verified private-session bridge used by post-action.php.
$bsSession = session_id();
if (!defined('G5_SESSION_NAME')) define('G5_SESSION_NAME', session_name());
if (!defined('G5_IS_CLI')) define('G5_IS_CLI', true);
unset($_SESSION['ss_mb_id']);
$_COOKIE = [session_name() => $bsSession];
$_GET = ['bo_table' => $bsBoard];
$_POST = []; $_FILES = []; $_REQUEST = $_GET;

// These are the only columns this endpoint can change. No group/skin/path/counts.
$bsFields = ['name' => 'bo_subject', 'mobileName' => 'bo_mobile_subject', 'categoryList' => 'bo_category_list', 'categoryEnabled' => 'bo_use_category',
    'listLevel' => 'bo_list_level', 'readLevel' => 'bo_read_level', 'writeLevel' => 'bo_write_level',
    'uploadCount' => 'bo_upload_count', 'uploadBytes' => 'bo_upload_size', 'pageRows' => 'bo_page_rows', 'mobilePageRows' => 'bo_mobile_page_rows'];
function dgSettingsValues(array $row): array
{
    global $bsFields;
    $values = [];
    foreach ($bsFields as $name => $column) $values[$name] = in_array($name, ['name', 'mobileName', 'categoryList'], true) ? (string)$row[$column] : (int)$row[$column];
    return $values;
}
function dgSettingsVersion(array $values): string { return hash('sha256', json_encode($values, JSON_INVALID_UTF8_SUBSTITUTE)); }
function dgSettingsInteger(string $key, int $min, int $max, string $label): int
{
    global $bsInput;
    $value = $bsInput[$key] ?? null;
    if (!is_string($value) || !preg_match('/\A(?:0|[1-9][0-9]{0,9})\z/', $value) || (int)$value < $min || (int)$value > $max) dgSettingsFail('INVALID_FIELDS', $label . ' 값을 확인해주세요.');
    return (int)$value;
}
try {
    require_once $bsCorePath . '/common.php';
    if (session_status() !== PHP_SESSION_ACTIVE || session_name() !== 'DUGOLBI_TEMP_ADMIN' || session_id() !== $bsSession) dgSettingsFail('SESSION_MISMATCH', '관리자 세션 연결을 확인해주세요.', 503);
    foreach (['get_member', 'sql_query', 'sql_fetch', 'sql_real_escape_string', 'clean_xss_attributes', 'delete_cache_latest', 'run_event'] as $function) {
        if (!function_exists($function)) dgSettingsFail('CORE_UNSUPPORTED', '그누보드의 설정·권한 기능을 확인해주세요.', 503);
    }
    $member = get_member($config['cf_admin'] ?? '');
    if (empty($member['mb_id']) || (int)$member['mb_level'] < 10 || !empty($member['mb_leave_date']) || !empty($member['mb_intercept_date'])) dgSettingsFail('ADMIN_MAPPING_FAILED', '그누보드 최고관리자 계정 설정을 확인해주세요.', 403);
    $is_member = true; $is_guest = false; $is_admin = 'super'; $bo_table = $bsBoard; $w = 'u';
    $bsTable = $g5['board_table'] ?? '';
    if (!is_string($bsTable) || !preg_match('/\A[A-Za-z0-9_]+\z/', $bsTable)) dgSettingsFail('DB_CONFIG_INVALID', '게시판 테이블 설정을 확인해주세요.', 503);
    $bsWhere = "bo_table = '" . sql_real_escape_string($bsBoard) . "'";
    $board = sql_fetch("SELECT * FROM `$bsTable` WHERE $bsWhere", false);
    if (empty($board['bo_table'])) dgSettingsFail('BOARD_NOT_FOUND', '게시판이 존재하지 않습니다.', 404);
    foreach ($bsFields as $column) if (!array_key_exists($column, $board)) dgSettingsFail('CORE_UNSUPPORTED', '게시판 설정 필드를 확인해주세요.', 503);
    $bsOld = dgSettingsValues($board);
    if ($bsMethod === 'GET') {
        $_SESSION['dugolbi_settings_operations'] = array_slice(array_filter($_SESSION['dugolbi_settings_operations'] ?? [], static function ($ticket) { return $ticket['expires'] >= time(); }), -39, null, true);
        $token = bin2hex(random_bytes(32));
        $_SESSION['dugolbi_settings_operations'][$token] = ['board' => $bsBoard, 'expires' => time() + 1200, 'state' => 'ready', 'version' => dgSettingsVersion($bsOld)];
        dgSettingsResponse(['ok' => true, 'board' => ['id' => $bsBoard, 'settings' => $bsOld], 'csrfToken' => dugolbiAdminToken(), 'saveToken' => $token]);
    }
    if (defined('G5_IS_DEMO') && G5_IS_DEMO) dgSettingsFail('DEMO_DISABLED', '데모 환경에서는 설정을 변경할 수 없습니다.', 403);
    if (!hash_equals($bsTicket['version'], dgSettingsVersion($bsOld))) dgSettingsFail('BOARD_CHANGED', '다른 화면에서 설정이 변경되었습니다. 다시 열어 최신 설정을 확인해주세요.', 409);
    $bsNew = [];
    foreach (['name', 'mobileName', 'categoryList'] as $key) {
        if (!isset($bsInput[$key]) || !is_string($bsInput[$key]) || !preg_match('//u', $bsInput[$key]) || strpos($bsInput[$key], "\0") !== false) dgSettingsFail('INVALID_FIELDS', '이름과 카테고리 입력 형식을 확인해주세요.');
        $text = trim($bsInput[$key]);
        // Preserve untouched existing values; sanitize edits as native admin does.
        if ($text !== $bsOld[$key]) {
            if ($key === 'categoryList') {
                $text = str_replace(['&', '='], ['＆', '〓'], $text);
                $text = preg_replace('/[<>\'"%()\/\^*\\\\]/u', '', $text);
                $text = implode('|', array_values(array_unique(array_filter(array_map('trim', explode('|', $text)), 'strlen'))));
            } else $text = strip_tags(clean_xss_attributes($text));
        }
        if (strlen($text) > ($key === 'categoryList' ? 65535 : 255)) dgSettingsFail('INVALID_FIELDS', '게시판 이름은 255바이트, 카테고리는 64KB 이내로 작성해주세요.');
        $bsNew[$key] = $text;
    }
    if ($bsNew['name'] === '' || preg_match('/[\r\n]/', $bsNew['name'] . $bsNew['mobileName'] . $bsNew['categoryList'])) dgSettingsFail('INVALID_FIELDS', '게시판 이름을 입력하고 이름·카테고리의 줄바꿈을 제거해주세요.');
    $bsNew['categoryEnabled'] = dgSettingsInteger('categoryEnabled', 0, 1, '카테고리 사용');
    if ($bsNew['categoryEnabled'] && !$bsNew['categoryList']) dgSettingsFail('INVALID_FIELDS', '카테고리를 하나 이상 입력해주세요.');
    foreach (['listLevel', 'readLevel', 'writeLevel'] as $key) $bsNew[$key] = dgSettingsInteger($key, 0, 10, '권한');
    $bsNew['uploadCount'] = dgSettingsInteger('uploadCount', 0, 100, '첨부파일 개수');
    $bsNew['uploadBytes'] = dgSettingsInteger('uploadBytes', 0, 2147483647, '첨부파일 용량');
    foreach (['pageRows', 'mobilePageRows'] as $key) $bsNew[$key] = dgSettingsInteger($key, 1, 1000, '페이지당 게시글 수');
    $assign = []; $conditions = [];
    foreach ($bsFields as $key => $column) {
        $assign[] = "`$column` = '" . sql_real_escape_string((string)$bsNew[$key]) . "'";
        // Atomic compare-and-save works with both MyISAM and InnoDB installations.
        $conditions[] = "BINARY `$column` <=> BINARY '" . sql_real_escape_string((string)$board[$column]) . "'";
    }
    $_SESSION['dugolbi_settings_operations'][$bsToken]['state'] = 'processing';
    $bsStarted = true;
    if (!sql_query("UPDATE `$bsTable` SET " . implode(', ', $assign) . " WHERE $bsWhere AND " . implode(' AND ', $conditions), false)) dgSettingsFail('SAVE_FAILED', '저장하지 못했습니다. 설정을 다시 열어 확인해주세요.', 500);
    $bsSaved = sql_fetch("SELECT * FROM `$bsTable` WHERE $bsWhere", false);
    if (!$bsSaved || dgSettingsValues($bsSaved) !== $bsNew) dgSettingsFail('BOARD_CHANGED', '설정이 변경되어 저장 결과가 다릅니다. 다시 열어 최신 설정을 확인해주세요.', 409);
    $board = $bsSaved;
    $result = ['ok' => true, 'board' => ['id' => $bsBoard, 'settings' => $bsNew], 'message' => '게시판 설정을 저장했습니다.'];
    $_SESSION['dugolbi_settings_operations'][$bsToken]['result'] = $result;
    // Follow native board_form_update.php cache and extension notification.
    try { delete_cache_latest($bsBoard); run_event('admin_board_form_update', $bsBoard, 'u'); }
    catch (Throwable $error) { $result['message'] .= ' 캐시 또는 확장 처리 상태는 서버 로그를 확인해주세요.'; $_SESSION['dugolbi_settings_operations'][$bsToken]['result'] = $result; error_log('[DUGOLBI board-settings hook] ' . get_class($error)); }
    dgSettingsResponse($result);
} catch (Throwable $error) {
    error_log('[DUGOLBI board-settings] ' . get_class($error) . ' code=' . $error->getCode() . ' at ' . basename($error->getFile()) . ':' . $error->getLine());
    dgSettingsFail('SERVER_ERROR', $bsStarted ? '저장 결과를 확인하지 못했습니다. 설정을 다시 열어 확인해주세요.' : '서버 연결 처리 중 오류가 발생했습니다. PHP 오류 로그를 확인해주세요.', 500);
}
