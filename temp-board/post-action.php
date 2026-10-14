<?php
// Delegate mutations to the installed Gnuboard core; never replace its SQL.
require_once __DIR__ . '/auth.php';
dugolbiAdminRequireLogin(true);
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, private, max-age=0');
$dgResponded = false;
$dgBufferLevel = ob_get_level();
ob_start();
$dgStarted = false;
$dgOperation = '';
$dgCookieParams = session_get_cookie_params();
function dgPostResponse(array $data, int $status = 200): void
{
    global $dgResponded, $dgBufferLevel, $dgCookieParams;
    $dgResponded = true;
    while (ob_get_level() > $dgBufferLevel) ob_end_clean();
    header_remove('Location');
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store, private, max-age=0');
    if (session_status() === PHP_SESSION_ACTIVE) {
        // The standalone admin must not inherit public Gnuboard cookie policy.
        header_remove('Set-Cookie');
        setcookie('DUGOLBI_TEMP_ADMIN', session_id(), ['path' => '/temp-board/', 'secure' => $dgCookieParams['secure'], 'httponly' => true, 'samesite' => 'Lax']);
    }
    if (session_status() === PHP_SESSION_ACTIVE) session_write_close();
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}
function dgPostFail(string $code, string $message, int $status = 422): void
{
    dgPostResponse(['ok' => false, 'code' => $code, 'message' => $message], $status);
}
register_shutdown_function(static function () {
    global $dgResponded, $dgStarted;
    if (!$dgResponded) dgPostFail('CORE_FAILED', $dgStarted
        ? '처리 결과를 확인하지 못했습니다. 중복 등록을 피하려면 게시글 목록을 먼저 확인해주세요.'
        : '그누보드 실행 환경을 불러오지 못했습니다. 서버 PHP 오류 로그를 확인해주세요.', 500);
});
ini_set('display_errors', '0');
$dgMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if (!in_array($dgMethod, ['GET', 'POST'], true)) {
    header('Allow: GET, POST');
    dgPostFail('METHOD_NOT_ALLOWED', '허용되지 않는 요청입니다.', 405);
}
$dgInput = $dgMethod === 'POST' ? $_POST : $_GET;
if ($dgMethod === 'POST' && !$dgInput && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) dgPostFail('UPLOAD_TOO_LARGE', '서버에서 업로드 요청을 받지 못했습니다. 전체 파일 용량과 post_max_size 설정을 확인해주세요.', 413);
$dgAction = $dgInput['action'] ?? ($dgMethod === 'GET' ? 'editor' : '');
$dgBoard = $dgInput['board'] ?? '';
$dgIdRaw = $dgInput['id'] ?? '0';
if (!is_string($dgAction) || !in_array($dgAction, $dgMethod === 'GET' ? ['editor'] : ['save', 'delete'], true)
    || !is_string($dgBoard) || !preg_match('/\A[A-Za-z0-9_]{1,20}\z/', $dgBoard)
    || !is_string($dgIdRaw) || !preg_match('/\A[0-9]{1,10}\z/', $dgIdRaw)) {
    dgPostFail('INVALID_REQUEST', '게시판 또는 게시글 값을 확인해주세요.', 400);
}
$dgId = (int)$dgIdRaw;
if ($dgMethod === 'POST') {
    if (!dugolbiAdminValidToken($dgInput['csrf_token'] ?? null)) dgPostFail('TOKEN_EXPIRED', '요청이 만료되었습니다. 편집 화면을 다시 열어주세요.', 403);
    $dgOperation = $dgInput['operation_token'] ?? '';
    if (!is_string($dgOperation) || !isset($_SESSION['dugolbi_board_operations'][$dgOperation])) dgPostFail('TOKEN_EXPIRED', '편집 화면을 다시 열어주세요.', 403);
    $dgTicket = $_SESSION['dugolbi_board_operations'][$dgOperation];
    if ($dgTicket['board'] !== $dgBoard || $dgTicket['id'] !== $dgId || $dgTicket['action'] !== $dgAction || $dgTicket['expires'] < time()) dgPostFail('TOKEN_EXPIRED', '편집 요청이 만료되었습니다. 편집 화면을 다시 열어주세요.', 403);
    if (isset($dgTicket['result'])) dgPostResponse($dgTicket['result']);
    if ($dgTicket['state'] !== 'ready') dgPostFail('ALREADY_SUBMITTED', '이미 요청한 작업입니다. 게시글 목록에서 결과를 먼저 확인해주세요.', 409);
}
$dgCorePath = dirname(__DIR__) . '/board';
if (!is_file($dgCorePath . '/common.php') || !is_file($dgCorePath . '/data/dbconfig.php')) dgPostFail('BOARD_NOT_INSTALLED', '이 서버에 그누보드 설치 또는 DB 설정이 없습니다.', 503);
if (!is_file($dgCorePath . '/bbs/write_update.php') || !is_file($dgCorePath . '/bbs/delete.php')) dgPostFail('CORE_MISSING', '그누보드 게시글 처리 파일을 확인해주세요.', 503);
if (!extension_loaded('mysqli')) dgPostFail('DB_DRIVER_MISSING', 'PHP mysqli 확장을 확인해주세요.', 503);

// Keep the private dashboard session active. Gnuboard cannot switch an active
// session name/cookie path; its public member/autologin cookies are not imported.
$dgSessionId = session_id();
if (!defined('G5_SESSION_NAME')) define('G5_SESSION_NAME', session_name());
if (!defined('G5_IS_CLI')) define('G5_IS_CLI', true); // Avoid visitor logging.
unset($_SESSION['ss_mb_id']);
$_COOKIE = [session_name() => $dgSessionId];
$dgIncomingFiles = $_FILES;
$_FILES = [];
$_GET = ['bo_table' => $dgBoard, 'wr_id' => $dgId];
$_POST = [];
$_REQUEST = $_GET;
try {
    require_once $dgCorePath . '/common.php';
    if (session_status() !== PHP_SESSION_ACTIVE || session_name() !== 'DUGOLBI_TEMP_ADMIN' || session_id() !== $dgSessionId) dgPostFail('SESSION_MISMATCH', '관리자 세션 연결을 확인해주세요.', 503);
    if (!function_exists('add_event') || !function_exists('get_write_token') || !function_exists('get_member')) dgPostFail('CORE_UNSUPPORTED', '그누보드의 권한·요청 토큰 기능을 확인해주세요.', 503);
    // Fixed dashboard account is explicitly the site owner's management entry.
    // Resolve the site's existing super-admin from server config, not user input.
    $member = get_member($config['cf_admin'] ?? '');
    if (empty($member['mb_id']) || (int)$member['mb_level'] < 10 || !empty($member['mb_leave_date']) || !empty($member['mb_intercept_date'])) dgPostFail('ADMIN_MAPPING_FAILED', '그누보드 최고관리자 계정 설정을 확인해주세요.', 403);
    $is_member = true; $is_guest = false; $is_admin = 'super';
    $bo_table = $dgBoard; $wr_id = $dgId;
    $board = sql_fetch("SELECT * FROM {$g5['board_table']} WHERE bo_table = '" . sql_real_escape_string($bo_table) . "'");
    if (empty($board['bo_table'])) dgPostFail('BOARD_NOT_FOUND', '게시판이 존재하지 않습니다.', 404);
    $group = sql_fetch("SELECT * FROM {$g5['group_table']} WHERE gr_id = '" . sql_real_escape_string($board['gr_id']) . "'");
    $write_table = $g5['write_prefix'] . $bo_table;
    $write = $wr_id ? get_write($write_table, $wr_id, true) : [];
    if ($wr_id && (empty($write['wr_id']) || !empty($write['wr_is_comment']))) dgPostFail('POST_NOT_FOUND', '게시글이 존재하지 않습니다.', 404);
    $dgFiles = [];
    if ($wr_id) {
        $dgFileResult = sql_query("SELECT * FROM {$g5['board_file_table']} WHERE bo_table = '" . sql_real_escape_string($bo_table) . "' AND wr_id = $wr_id ORDER BY bf_no");
        while ($dgFileRow = sql_fetch_array($dgFileResult)) $dgFiles[(int)$dgFileRow['bf_no']] = $dgFileRow;
    }
    require __DIR__ . '/post-support.php';
    $dgVersion = dgPostVersion($write, $dgFiles);
    if ($dgMethod === 'GET') dgPostEditorResponse();
    if ($dgId && !hash_equals($dgTicket['version'], $dgVersion)) dgPostFail('POST_CHANGED', '다른 화면에서 게시글이 변경되었습니다. 다시 열어 최신 내용을 확인해주세요.', 409);
    if ($dgAction === 'delete' && !$dgId) dgPostFail('INVALID_REQUEST', '삭제할 게시글을 확인해주세요.', 400);
    if ($dgAction === 'delete' && $dgFiles) dgPostCheckFilePermissions();
    if ($dgAction === 'save') { $_FILES = $dgIncomingFiles; dgPostPrepareSave(); }

    // Consume once before calling the core. A retry cannot create duplicates.
    $_SESSION['dugolbi_board_operations'][$dgOperation]['state'] = 'processing';
    $dgStarted = true;
    $dgSaved = false;
    $dgWarning = '';
    add_event('write_update_after', static function ($coreBoard, $coreId) {
        global $dgSaved, $wr_id, $write_table;
        $verified = $coreId ? get_write($write_table, (int)$coreId, true) : [];
        if (empty($verified['wr_id'])) dgPostFail('CORE_INCOMPLETE', '저장 결과를 확인하지 못했습니다. 게시글 목록을 확인해주세요.', 500);
        $dgSaved = true; $wr_id = (int)$coreId;
    }, 1, 2);
    add_event('bbs_delete', static function () {
        global $dgSaved, $write_table, $wr_id;
        if (get_write($write_table, $wr_id, true)) dgPostFail('CORE_INCOMPLETE', '삭제 결과를 확인하지 못했습니다. 게시글 목록을 확인해주세요.', 500);
        $dgSaved = true;
    }, 1, 0);
    add_event('alert', static function ($message) {
        global $dgSaved, $dgWarning;
        if ($dgSaved) { $dgWarning = trim(strip_tags(str_replace(['<br>', '<br/>', '<br />', '\\n'], "\n", $message))); dgPostSuccess(); }
        dgPostFail('CORE_VALIDATION', trim(strip_tags(str_replace(['<br>', '<br/>', '<br />', '\\n'], "\n", $message))));
    }, 1, 1);
    add_event('goto_url', static function () {
        global $dgSaved;
        if ($dgSaved) dgPostSuccess();
        dgPostFail('CORE_REDIRECT', '게시글 처리 중 다른 화면으로 이동했습니다. 서버 설정을 확인해주세요.', 500);
    }, 1, 1);
    $qstr = ''; $page = 1; $sfl = ''; $stx = ''; $sop = 'and'; $sst = ''; $sod = ''; $spt = ''; $sca = '';
    chdir(G5_BBS_PATH);
    if ($dgAction === 'delete') {
        $token = bin2hex(random_bytes(16));
        set_session('ss_delete_token', $token);
        $w = ''; $wr_password = '';
        require G5_BBS_PATH . '/delete.php';
    } else {
        $w = $dgId ? 'u' : '';
        $_POST['token'] = get_write_token($bo_table);
        set_session('ss_bo_table', $bo_table); set_session('ss_wr_id', $wr_id);
        require G5_BBS_PATH . '/write_update.php';
    }
    dgPostFail('CORE_INCOMPLETE', '처리 결과를 확인하지 못했습니다. 게시글 목록을 확인해주세요.', 500);
} catch (Throwable $error) {
    error_log('[DUGOLBI post-action] ' . get_class($error) . ' code=' . $error->getCode() . ' at ' . basename($error->getFile()) . ':' . $error->getLine());
    dgPostFail('SERVER_ERROR', $dgStarted ? '처리 결과를 확인하지 못했습니다. 재시도 전에 게시글 목록을 확인해주세요.' : '서버 연결 처리 중 오류가 발생했습니다. PHP 오류 로그를 확인해주세요.', 500);
}
