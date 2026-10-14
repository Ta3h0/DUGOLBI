<?php
// Board lifecycle: empty board from existing settings, or native board deletion.
require_once __DIR__ . '/auth.php';
dugolbiAdminRequireLogin(true);
$baBuffer = ob_get_level(); $baResponded = false; $baStarted = false;
$baCookies = session_get_cookie_params();
ob_start(); ini_set('display_errors', '0');
function dgBoardActionResponse(array $data, int $status = 200): void
{
    global $baBuffer, $baResponded, $baCookies;
    $baResponded = true;
    while (ob_get_level() > $baBuffer) ob_end_clean();
    header_remove('Location'); header_remove('Set-Cookie');
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store, private, max-age=0'); http_response_code($status);
    if (session_status() === PHP_SESSION_ACTIVE) {
        setcookie('DUGOLBI_TEMP_ADMIN', session_id(), ['path' => '/temp-board/', 'secure' => $baCookies['secure'], 'httponly' => true, 'samesite' => 'Lax']);
        session_write_close();
    }
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE); exit;
}
function dgBoardActionFail(string $code, string $message, int $status = 422): void
{
    dgBoardActionResponse(['ok' => false, 'code' => $code, 'message' => $message], $status);
}
register_shutdown_function(static function () {
    global $baResponded, $baStarted;
    if (!$baResponded) dgBoardActionFail('CORE_FAILED', $baStarted ? '처리 결과를 확인하지 못했습니다. 다시 요청하지 말고 게시판 목록과 서버 상태를 확인해주세요.' : '그누보드 실행 환경을 확인해주세요.', 500);
});
$baMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if (!in_array($baMethod, ['GET', 'POST'], true)) { header('Allow: GET, POST'); dgBoardActionFail('METHOD_NOT_ALLOWED', '허용되지 않는 요청입니다.', 405); }
$baInput = $baMethod === 'GET' ? $_GET : $_POST;
$baAction = $baInput['action'] ?? '';
$baBoard = $baInput['board'] ?? '';
if (!is_string($baAction) || !in_array($baAction, $baMethod === 'GET' ? ['options', 'delete'] : ['create', 'delete'], true)
    || !is_string($baBoard) || ($baAction !== 'options' && !preg_match('/\A[A-Za-z0-9_]{1,20}\z/', $baBoard))) dgBoardActionFail('INVALID_REQUEST', '게시판 또는 요청을 확인해주세요.', 400);
if ($baMethod === 'POST') {
    if (!dugolbiAdminValidToken($baInput['csrf_token'] ?? null)) dgBoardActionFail('TOKEN_EXPIRED', '화면을 다시 열어주세요.', 403);
    $baToken = $baInput['operation_token'] ?? '';
    $baTicket = is_string($baToken) ? ($_SESSION['dugolbi_board_lifecycle'][$baToken] ?? null) : null;
    if (!$baTicket || $baTicket['action'] !== $baAction || ($baTicket['board'] !== '' && $baTicket['board'] !== $baBoard) || $baTicket['expires'] < time()) dgBoardActionFail('TOKEN_EXPIRED', '요청이 만료되었습니다. 화면을 다시 열어주세요.', 403);
    if (isset($baTicket['result'])) dgBoardActionResponse($baTicket['result']);
    if ($baTicket['state'] !== 'ready') dgBoardActionFail('ALREADY_SUBMITTED', '이미 요청한 작업입니다. 목록과 서버 상태를 먼저 확인해주세요.', 409);
}
$baCore = dirname(__DIR__) . '/board';
if (!is_file($baCore . '/common.php') || !is_file($baCore . '/data/dbconfig.php')) dgBoardActionFail('BOARD_NOT_INSTALLED', '이 서버에 그누보드 설치 또는 DB 설정이 없습니다.', 503);
if (!extension_loaded('mysqli')) dgBoardActionFail('DB_DRIVER_MISSING', 'PHP mysqli 확장을 확인해주세요.', 503);
$baSession = session_id();
if (!defined('G5_SESSION_NAME')) define('G5_SESSION_NAME', session_name());
if (!defined('G5_IS_CLI')) define('G5_IS_CLI', true);
unset($_SESSION['ss_mb_id']); $_COOKIE = [session_name() => $baSession];
$_GET = []; $_POST = []; $_FILES = []; $_REQUEST = [];
function dgBoardActionQuery(string $sql)
{
    $result = sql_query($sql, false);
    if ($result === false) dgBoardActionFail('DB_QUERY_FAILED', '게시판 DB 처리에 실패했습니다. 목록과 서버 상태를 확인해주세요.', 500);
    return $result;
}
function dgBoardActionRow(string $id): array
{
    global $g5;
    return sql_fetch_array(dgBoardActionQuery("SELECT * FROM `{$g5['board_table']}` WHERE bo_table = '" . sql_real_escape_string($id) . "'")) ?: [];
}
function dgBoardActionTableExists(string $name): bool
{
    $result = dgBoardActionQuery("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND LOWER(TABLE_NAME) = LOWER('" . sql_real_escape_string($name) . "')");
    return (bool)sql_fetch_array($result);
}
function dgBoardActionTicket(string $action, string $id = '', string $version = ''): string
{
    $_SESSION['dugolbi_board_lifecycle'] = array_slice(array_filter($_SESSION['dugolbi_board_lifecycle'] ?? [], static function ($item) { return $item['expires'] >= time(); }), -39, null, true);
    $token = bin2hex(random_bytes(32));
    $_SESSION['dugolbi_board_lifecycle'][$token] = ['action' => $action, 'board' => $id, 'version' => $version, 'state' => 'ready', 'expires' => time() + 1200];
    return $token;
}
function dgBoardActionDeleteState(array $board): array
{
    global $g5;
    $id = $board['bo_table']; $where = "bo_table = '" . sql_real_escape_string($id) . "'";
    $tableExists = dgBoardActionTableExists($g5['write_prefix'] . $id);
    $counts = $tableExists ? sql_fetch_array(dgBoardActionQuery("SELECT COUNT(*) AS total, COALESCE(SUM(wr_is_comment = 0), 0) AS posts, COALESCE(SUM(wr_is_comment <> 0), 0) AS comments, COALESCE(MAX(wr_id), 0) AS last_id, COALESCE(MAX(wr_last), '') AS last_change FROM `{$g5['write_prefix']}$id`")) : ['total' => 0, 'posts' => 0, 'comments' => 0];
    $files = sql_fetch_array(dgBoardActionQuery("SELECT COUNT(*) AS total FROM `{$g5['board_file_table']}` WHERE $where"));
    return ['posts' => (int)$counts['posts'], 'comments' => (int)$counts['comments'], 'files' => (int)$files['total'],
        'version' => hash('sha256', json_encode([$board, $counts, $files, $tableExists], JSON_INVALID_UTF8_SUBSTITUTE))];
}
function dgBoardActionFileRoot(): string
{
    clearstatcache(true);
    $root = realpath(G5_DATA_PATH . '/file');
    if (!$root || !is_dir($root) || !is_writable($root)) dgBoardActionFail('FILES_NOT_WRITABLE', '그누보드 첨부파일 폴더의 쓰기 권한을 확인해주세요.', 503);
    return $root;
}
function dgBoardActionCheckDeletePath(string $id): string
{
    $root = dgBoardActionFileRoot(); $path = $root . DIRECTORY_SEPARATOR . $id;
    if (is_link($path)) dgBoardActionFail('UNSAFE_FILE_PATH', '첨부파일 폴더가 연결 경로입니다. 서버에서 먼저 확인해주세요.', 409);
    if (!file_exists($path)) return $path;
    $resolved = realpath($path);
    if (!$resolved || dirname($resolved) !== $root || !is_dir($resolved) || !is_writable($resolved)) dgBoardActionFail('UNSAFE_FILE_PATH', '첨부파일 삭제 경로와 권한을 확인해주세요.', 409);
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($resolved, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::SELF_FIRST);
    foreach ($iterator as $entry) {
        $real = $entry->getRealPath();
        if ($entry->isLink() || !$real || strpos($real, $resolved . DIRECTORY_SEPARATOR) !== 0 || ($entry->isDir() && !is_writable($real))) dgBoardActionFail('UNSAFE_FILE_PATH', '첨부 폴더 안의 연결 경로 또는 권한을 서버에서 확인해주세요.', 409);
    }
    return $resolved;
}
function dgBoardActionComplete(array $result): void
{
    global $baToken;
    $_SESSION['dugolbi_board_lifecycle'][$baToken]['result'] = $result;
    dgBoardActionResponse($result);
}
try {
    require_once $baCore . '/common.php';
    if (session_status() !== PHP_SESSION_ACTIVE || session_name() !== 'DUGOLBI_TEMP_ADMIN' || session_id() !== $baSession) dgBoardActionFail('SESSION_MISMATCH', '관리자 세션 연결을 확인해주세요.', 503);
    foreach (['get_member', 'sql_query', 'sql_fetch_array', 'sql_real_escape_string', 'clean_xss_attributes', 'add_event', 'delete_cache_latest', 'run_event'] as $function) if (!function_exists($function)) dgBoardActionFail('CORE_UNSUPPORTED', '그누보드 게시판 관리 기능을 확인해주세요.', 503);
    foreach (['board_table', 'group_table', 'write_prefix', 'board_file_table', 'board_new_table', 'scrap_table', 'board_good_table'] as $key) if (empty($g5[$key]) || !preg_match('/\A[A-Za-z0-9_]+\z/', $g5[$key])) dgBoardActionFail('DB_CONFIG_INVALID', '그누보드 테이블 설정을 확인해주세요.', 503);
    $member = get_member($config['cf_admin'] ?? '');
    if (empty($member['mb_id']) || (int)$member['mb_level'] < 10 || !empty($member['mb_leave_date']) || !empty($member['mb_intercept_date'])) dgBoardActionFail('ADMIN_MAPPING_FAILED', '그누보드 최고관리자 계정 설정을 확인해주세요.', 403);
    $is_member = true; $is_guest = false; $is_admin = 'super';
    add_event('alert', static function ($message) { dgBoardActionFail('CORE_VALIDATION', trim(strip_tags($message))); }, 1, 1);
    add_event('alert_close', static function ($message) { dgBoardActionFail('CORE_VALIDATION', trim(strip_tags($message))); }, 1, 1);
    if ($baMethod === 'GET' && $baAction === 'options') {
        $groups = []; $templates = [['id' => '@basic', 'name' => '기본 게시판', 'groupId' => '']];
        $r = dgBoardActionQuery("SELECT gr_id, gr_subject FROM `{$g5['group_table']}` ORDER BY gr_subject, gr_id");
        while ($row = sql_fetch_array($r)) $groups[] = ['id' => $row['gr_id'], 'name' => $row['gr_subject']];
        $r = dgBoardActionQuery("SELECT bo_table, bo_subject, gr_id FROM `{$g5['board_table']}` ORDER BY bo_subject, bo_table");
        while ($row = sql_fetch_array($r)) $templates[] = ['id' => $row['bo_table'], 'name' => $row['bo_subject'], 'groupId' => $row['gr_id']];
        dgBoardActionResponse(['ok' => true, 'groups' => $groups, 'templates' => $templates, 'csrfToken' => dugolbiAdminToken(), 'saveToken' => dgBoardActionTicket('create')]);
    }
    if ($baAction === 'delete') {
        $board = dgBoardActionRow($baBoard);
        if (!$board) dgBoardActionFail('BOARD_NOT_FOUND', '게시판이 존재하지 않습니다.', 404);
        if ($board['bo_table'] !== $baBoard) dgBoardActionFail('INVALID_REQUEST', '등록된 게시판 ID의 대소문자를 정확하게 입력해주세요.', 400);
        $state = dgBoardActionDeleteState($board);
        $links = ['notice' => '공지사항 페이지', 'qa' => 'Q&A 페이지', 'review' => '리뷰 페이지', 'news' => '언론보도 페이지와 메인 Media & News'];
        if ($baMethod === 'GET') dgBoardActionResponse(['ok' => true, 'board' => ['id' => $baBoard, 'name' => $board['bo_subject'], 'posts' => $state['posts'], 'comments' => $state['comments'], 'files' => $state['files'], 'linkedPage' => $links[$baBoard] ?? ''], 'csrfToken' => dugolbiAdminToken(), 'deleteToken' => dgBoardActionTicket('delete', $baBoard, $state['version'])]);
        if (!is_string($baInput['confirm'] ?? null) || $baInput['confirm'] !== $baBoard) dgBoardActionFail('INVALID_FIELDS', '삭제할 게시판 ID를 정확하게 입력해주세요.');
        if (!hash_equals($baTicket['version'], $state['version'])) dgBoardActionFail('BOARD_CHANGED', '게시판이나 게시글이 변경되었습니다. 삭제 화면을 다시 열어 확인해주세요.', 409);
        $baDirectory = dgBoardActionCheckDeletePath($baBoard);
        if (!defined('G5_ADMIN_PATH') || !is_file(G5_ADMIN_PATH . '/admin.lib.php') || !is_file(G5_ADMIN_PATH . '/board_delete.inc.php') || !function_exists('ss_mb_key')) dgBoardActionFail('CORE_UNSUPPORTED', '그누보드 게시판 삭제 파일을 확인해주세요.', 503);
        // Request-local client proof for the verified private administrator bridge.
        // No public login/client cookie or public member session is established.
        $_COOKIE[md5('mb_client_key')] = base64_encode(bin2hex(random_bytes(16)));
        set_session('ss_mb_key', ss_mb_key($member));
        if (!defined('G5_IS_ADMIN')) define('G5_IS_ADMIN', true);
        require_once G5_ADMIN_PATH . '/admin.lib.php';
        if (!function_exists('rm_rf')) dgBoardActionFail('CORE_UNSUPPORTED', '그누보드 첨부 폴더 삭제 기능을 확인해주세요.', 503);
        $_SESSION['dugolbi_board_lifecycle'][$baToken]['state'] = 'processing'; $baStarted = true;
        if (!defined('_BOARD_DELETE_')) define('_BOARD_DELETE_', true);
        $tmp_bo_table = $baBoard;
        // Installed native core owns config/new/scrap/file/good deletion and DROP.
        require G5_ADMIN_PATH . '/board_delete.inc.php';
        clearstatcache(true);
        if (dgBoardActionRow($baBoard) || dgBoardActionTableExists($g5['write_prefix'] . $baBoard) || file_exists($baDirectory) || is_link($baDirectory)) dgBoardActionFail('DELETE_INCOMPLETE', '삭제가 일부만 처리되었습니다. 재시도하지 말고 목록과 서버 상태를 확인해주세요.', 500);
        foreach (['board_new_table', 'scrap_table', 'board_file_table', 'board_good_table'] as $key) {
            $left = sql_fetch_array(dgBoardActionQuery("SELECT COUNT(*) AS total FROM `{$g5[$key]}` WHERE bo_table = '" . sql_real_escape_string($baBoard) . "'"));
            if ((int)$left['total'] !== 0) dgBoardActionFail('DELETE_INCOMPLETE', '관련 데이터 정리를 확인하지 못했습니다. 서버 상태를 확인해주세요.', 500);
        }
        $result = ['ok' => true, 'board' => ['id' => $baBoard], 'message' => '게시판과 게시글·댓글·첨부파일을 삭제했습니다.'];
        $_SESSION['dugolbi_board_lifecycle'][$baToken]['result'] = $result;
        try { run_event('admin_board_list_update', '선택삭제', [0], [$baBoard], ''); } catch (Throwable $error) { $result['message'] .= ' 확장 처리 상태는 서버 로그를 확인해주세요.'; }
        dgBoardActionComplete($result);
    }
    // Creating an empty board follows native schema-only copy, with all values escaped.
    if (!preg_match('/\A[a-z][a-z0-9_]{0,19}\z/', $baBoard)) dgBoardActionFail('INVALID_FIELDS', '게시판 ID는 소문자로 시작하는 영문 소문자·숫자·_ 조합, 20자 이내로 입력해주세요.');
    $name = $baInput['name'] ?? ''; $templateId = $baInput['template'] ?? ''; $groupId = $baInput['group'] ?? '';
    if (!is_string($name) || !preg_match('//u', $name) || strpos($name, "\0") !== false || !is_string($templateId) || ($templateId !== '@basic' && !preg_match('/\A[A-Za-z0-9_]{1,20}\z/', $templateId)) || !is_string($groupId) || !preg_match('/\A[A-Za-z0-9_]{1,20}\z/', $groupId)) dgBoardActionFail('INVALID_FIELDS', '게시판 이름과 기준 게시판·그룹을 확인해주세요.');
    $name = trim(strip_tags(clean_xss_attributes($name)));
    if (!$name || strlen($name) > 255 || preg_match('/[\r\n]/', $name)) dgBoardActionFail('INVALID_FIELDS', '게시판 이름은 줄바꿈 없이 255바이트 이내로 입력해주세요.');
    if (!function_exists('get_bo_table_banned_word') || !function_exists('get_table_define')) dgBoardActionFail('CORE_UNSUPPORTED', '그누보드 게시판 생성 기능을 확인해주세요.', 503);
    if (in_array(strtolower($baBoard), array_map('strtolower', get_bo_table_banned_word()), true)) dgBoardActionFail('INVALID_FIELDS', '이 게시판 ID는 시스템에서 사용하는 이름입니다. 다른 ID를 입력해주세요.');
    $targetTable = $g5['write_prefix'] . $baBoard;
    if (strlen($targetTable) > 64) dgBoardActionFail('INVALID_FIELDS', '서버 테이블 접두사를 포함한 ID가 너무 깁니다.');
    if (dgBoardActionRow($baBoard) || dgBoardActionTableExists($targetTable)) dgBoardActionFail('BOARD_EXISTS', '이미 사용 중인 게시판 ID입니다. 다른 ID를 입력해주세요.', 409);
    if ($templateId === '@basic') {
        if (!defined('G5_ADMIN_PATH') || !is_readable(G5_ADMIN_PATH . '/sql_write.sql') || !function_exists('get_db_create_replace')) dgBoardActionFail('CORE_UNSUPPORTED', '그누보드 기본 게시판 생성 파일을 확인해주세요.', 503);
        $definition = get_db_create_replace(file_get_contents(G5_ADMIN_PATH . '/sql_write.sql'));
        if (substr_count($definition, '__TABLE_NAME__') !== 1 || !preg_match('/\A\s*CREATE TABLE\s+`?__TABLE_NAME__`?\s*\(/i', $definition)) dgBoardActionFail('CORE_UNSUPPORTED', '기본 게시판 구조를 확인해주세요.', 503);
        $definition = str_replace('__TABLE_NAME__', $targetTable, $definition);
        $board = [];
        $columns = dgBoardActionQuery("SHOW COLUMNS FROM `{$g5['board_table']}`");
        while ($column = sql_fetch_array($columns)) {
            if (stripos($column['Extra'] ?? '', 'auto_increment') !== false || stripos($column['Extra'] ?? '', 'GENERATED') !== false) continue;
            $board[$column['Field']] = $column['Default'] ?? ($column['Null'] === 'YES' ? null : (preg_match('/int|decimal|float|double|bit/i', $column['Type']) ? 0 : ''));
        }
        // Useful defaults from native board_form.php; public writing stays admin-only.
        $defaults = ['bo_device' => 'both', 'bo_skin' => 'basic', 'bo_mobile_skin' => 'basic', 'bo_list_level' => 1, 'bo_read_level' => 1,
            'bo_write_level' => 10, 'bo_reply_level' => 10, 'bo_comment_level' => 10, 'bo_upload_level' => 10, 'bo_html_level' => 10, 'bo_link_level' => 10, 'bo_download_level' => 1,
            'bo_count_delete' => 1, 'bo_count_modify' => 1, 'bo_page_rows' => max(1, (int)($config['cf_page_rows'] ?? 20)), 'bo_mobile_page_rows' => max(1, (int)($config['cf_page_rows'] ?? 20)),
            'bo_subject_len' => 60, 'bo_mobile_subject_len' => 30, 'bo_new' => 24, 'bo_hot' => 100, 'bo_image_width' => 600, 'bo_table_width' => 100,
            'bo_upload_count' => 2, 'bo_upload_size' => 1048576, 'bo_reply_order' => 1, 'bo_use_search' => 1, 'bo_gallery_cols' => 4,
            'bo_gallery_width' => 202, 'bo_gallery_height' => 150, 'bo_mobile_gallery_width' => 125, 'bo_mobile_gallery_height' => 100];
        $board = array_replace($board, array_intersect_key($defaults, $board));
    } else {
        $board = dgBoardActionRow($templateId);
        if (!$board) dgBoardActionFail('INVALID_FIELDS', '설정을 가져올 게시판을 확인해주세요.');
        $templateId = $board['bo_table'];
        if (!dgBoardActionTableExists($g5['write_prefix'] . $templateId)) dgBoardActionFail('INVALID_FIELDS', '설정을 가져올 게시판의 테이블을 확인해주세요.');
        $definition = get_table_define($g5['write_prefix'] . $templateId);
        $definition = preg_replace('/\ACREATE TABLE\s+`?' . preg_quote($g5['write_prefix'] . $templateId, '/') . '`?\s*\(/i', 'CREATE TABLE `' . $targetTable . '` (', $definition, 1, $replaced);
        if ($replaced !== 1) dgBoardActionFail('CORE_UNSUPPORTED', '기준 게시판의 테이블 구조를 확인해주세요.', 503);
    }
    $group = sql_fetch_array(dgBoardActionQuery("SELECT gr_id FROM `{$g5['group_table']}` WHERE gr_id = '" . sql_real_escape_string($groupId) . "'"));
    if (!$group) dgBoardActionFail('INVALID_FIELDS', '등록된 게시판 그룹을 선택해주세요.');
    $root = dgBoardActionFileRoot(); $directory = $root . DIRECTORY_SEPARATOR . $baBoard;
    if (file_exists($directory) || is_link($directory)) dgBoardActionFail('BOARD_EXISTS', '같은 이름의 첨부파일 폴더가 있습니다. 다른 ID를 입력해주세요.', 409);
    $newBoard = $board;
    $newBoard['bo_table'] = $baBoard; $newBoard['bo_subject'] = $name; $newBoard['bo_mobile_subject'] = ''; $newBoard['gr_id'] = $groupId;
    $newBoard['bo_count_write'] = 0; $newBoard['bo_count_comment'] = 0; $newBoard['bo_notice'] = '';
    $values = [];
    foreach ($newBoard as $column => $value) {
        if (!preg_match('/\A[a-zA-Z0-9_]+\z/', $column)) dgBoardActionFail('DB_CONFIG_INVALID', '게시판 설정 열을 확인해주세요.', 503);
        $values[] = "`$column` = " . ($value === null ? 'NULL' : "'" . sql_real_escape_string((string)$value) . "'");
    }
    $_SESSION['dugolbi_board_lifecycle'][$baToken]['board'] = $baBoard;
    $_SESSION['dugolbi_board_lifecycle'][$baToken]['state'] = 'processing'; $baStarted = true;
    if (!sql_query($definition, false)) dgBoardActionFail('CREATE_FAILED', '게시판 테이블을 생성하지 못했습니다. ID 중복과 서버의 CREATE 권한을 확인해주세요.', 500);
    if (!sql_query("INSERT INTO `{$g5['board_table']}` SET " . implode(', ', $values), false)) dgBoardActionFail('CREATE_INCOMPLETE', '테이블만 생성되고 설정 저장은 실패했습니다. 다시 요청하지 말고 서버 상태를 확인해주세요.', 500);
    if (!mkdir($directory, G5_DIR_PERMISSION) || file_put_contents($directory . '/index.php', '') === false) dgBoardActionFail('CREATE_INCOMPLETE', '게시판은 생성되었지만 첨부파일 폴더 설정이 실패했습니다. 서버 권한을 확인해주세요.', 500);
    @chmod($directory . '/index.php', G5_FILE_PERMISSION);
    @chmod($directory, G5_DIR_PERMISSION);
    $created = dgBoardActionRow($baBoard);
    $empty = sql_fetch_array(dgBoardActionQuery("SELECT COUNT(*) AS total FROM `$targetTable`"));
    if (!$created || $created['bo_subject'] !== $name || $created['gr_id'] !== $groupId || (int)$empty['total'] !== 0) dgBoardActionFail('CREATE_INCOMPLETE', '생성 결과를 확인하지 못했습니다. 목록과 서버 상태를 확인해주세요.', 500);
    $result = ['ok' => true, 'board' => ['id' => $baBoard, 'name' => $name, 'url' => '/board/bbs/board.php?bo_table=' . rawurlencode($baBoard)], 'message' => '빈 게시판을 추가했습니다. 홈페이지 메뉴 연결은 별도로 설정해주세요.'];
    $_SESSION['dugolbi_board_lifecycle'][$baToken]['result'] = $result;
    $bo_table = $baBoard; $w = '';
    try { delete_cache_latest($baBoard); run_event('admin_board_form_update', $baBoard, ''); } catch (Throwable $error) { $result['message'] .= ' 캐시 또는 확장 처리 상태는 서버 로그를 확인해주세요.'; }
    dgBoardActionComplete($result);
} catch (Throwable $error) {
    error_log('[DUGOLBI board-action] ' . get_class($error) . ' code=' . $error->getCode() . ' at ' . basename($error->getFile()) . ':' . $error->getLine());
    dgBoardActionFail('SERVER_ERROR', $baStarted ? '처리 결과를 확인하지 못했습니다. 재시도 전에 목록과 서버 상태를 확인해주세요.' : '서버 게시판 연결 처리 중 오류가 발생했습니다. PHP 오류 로그를 확인해주세요.', 500);
}
