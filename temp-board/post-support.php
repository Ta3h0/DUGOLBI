<?php
if (!defined('DUGOLBI_ADMIN_BOOTSTRAP') || !isset($dgCorePath, $board, $member, $dgFiles)) { http_response_code(403); exit; }
function dgPostVersion(array $post, array $files): string
{
    global $board;
    $fields = array_intersect_key($post, array_flip(array_merge(['wr_subject', 'wr_content', 'wr_option', 'ca_name', 'wr_link1', 'wr_link2', 'wr_last', 'wr_name', 'wr_email', 'wr_homepage'], array_map(static function ($i) { return 'wr_' . $i; }, range(1, 10)))));
    foreach ($files as &$file) unset($file['bf_download']);
    unset($file);
    $notice = !empty($post['wr_id']) && in_array((string)$post['wr_id'], explode(',', $board['bo_notice']), true);
    return hash('sha256', json_encode([$fields, $files, $notice], JSON_INVALID_UTF8_SUBSTITUTE));
}
function dgPostTicket(string $action): string
{
    global $dgBoard, $dgId, $dgVersion;
    $token = bin2hex(random_bytes(32));
    $_SESSION['dugolbi_board_operations'][$token] = ['board' => $dgBoard, 'id' => $dgId, 'action' => $action, 'version' => $dgVersion, 'expires' => time() + 1200, 'state' => 'ready'];
    return $token;
}
function dgPostIniBytes(string $value): int
{
    $unit = strtolower(substr(trim($value), -1));
    $number = (float)$value;
    return (int)($number * ($unit === 'g' ? 1073741824 : ($unit === 'm' ? 1048576 : ($unit === 'k' ? 1024 : 1))));
}
function dgPostLimits(): array
{
    global $board, $dgFiles;
    $limits = [(int)$board['bo_upload_size'], dgPostIniBytes(ini_get('upload_max_filesize')), dgPostIniBytes(ini_get('post_max_size'))];
    $limits = array_filter($limits, static function ($size) { return $size > 0; });
    $slots = max(0, (int)$board['bo_upload_count'], $dgFiles ? max(array_keys($dgFiles)) + 1 : 0);
    if ($slots > 100) dgPostFail('ATTACHMENT_LIMIT', '첨부파일이 너무 많습니다. 기존 게시판에서 먼저 확인해주세요.');
    return ['bytes' => $limits ? min($limits) : 2097152, 'slots' => $slots, 'count' => max(0, (int)$board['bo_upload_count']), 'postBytes' => dgPostIniBytes(ini_get('post_max_size'))];
}
function dgPostCheckFilePermissions(): void
{
    global $board;
    $root = G5_DATA_PATH . '/file';
    $directory = is_dir($root . '/' . $board['bo_table']) ? $root . '/' . $board['bo_table'] : $root;
    if (!is_dir($root) || !is_writable($directory)) dgPostFail('UPLOAD_NOT_WRITABLE', '그누보드 첨부파일 폴더의 쓰기 권한을 확인해주세요.', 503);
}
function dgPostEditorResponse(): void
{
    global $write, $board, $dgFiles, $dgId;
    $operations = $_SESSION['dugolbi_board_operations'] ?? [];
    $_SESSION['dugolbi_board_operations'] = array_slice(array_filter($operations, static function ($item) { return $item['expires'] >= time(); }), -40, null, true);
    $options = explode(',', $write['wr_option'] ?? '');
    $files = [];
    foreach ($dgFiles as $slot => $file) {
        $name = (string)$file['bf_file'];
        $extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        $safe = basename(str_replace('\\', '/', $name)) === $name && !preg_match('/\.(?:php\d*|phtml|phar|cgi|pl|asp|aspx|jsp|html?|svg|js)(?:\.|$)/i', $name);
        $image = $safe && in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'], true);
        $files[] = ['slot' => $slot, 'name' => (string)$file['bf_source'], 'size' => (int)$file['bf_filesize'], 'description' => (string)$file['bf_content'],
            'preview' => $image ? G5_DATA_URL . '/file/' . rawurlencode($board['bo_table']) . '/' . rawurlencode($name) : ''];
    }
    dgPostResponse(['ok' => true, 'csrfToken' => dugolbiAdminToken(), 'saveToken' => dgPostTicket('save'), 'deleteToken' => $dgId ? dgPostTicket('delete') : '',
        'board' => ['id' => $board['bo_table'], 'name' => $board['bo_subject'], 'categories' => $board['bo_use_category'] ? array_values(array_filter(array_map('trim', explode('|', $board['bo_category_list'])), 'strlen')) : []],
        'post' => ['id' => $dgId, 'title' => $write['wr_subject'] ?? '', 'content' => $write['wr_content'] ?? '', 'category' => $write['ca_name'] ?? '',
            'format' => in_array('html2', $options, true) ? 'html2' : (in_array('html1', $options, true) ? 'html1' : ''),
            'secret' => $dgId ? in_array('secret', $options, true) : (int)$board['bo_use_secret'] === 2,
            'notice' => $dgId && in_array((string)$dgId, explode(',', $board['bo_notice']), true), 'link1' => $write['wr_link1'] ?? '', 'link2' => $write['wr_link2'] ?? ''],
        'files' => $files, 'upload' => dgPostLimits()]);
}
function dgPostPrepareSave(): void
{
    global $dgInput, $board, $write, $dgFiles, $dgId;
    foreach (['title', 'content', 'category', 'format', 'link1', 'link2'] as $key) {
        if (isset($dgInput[$key]) && !is_string($dgInput[$key])) dgPostFail('INVALID_REQUEST', '입력 형식을 확인해주세요.', 400);
    }
    $title = trim($dgInput['title'] ?? ''); $content = trim($dgInput['content'] ?? '');
    // Multipart textarea submission normalizes LF to CRLF. Preserve the stored
    // source when only the title/options were edited, including embedded video HTML.
    $normalizeLines = static function ($text) { return str_replace(["\r\n", "\r"], "\n", $text); };
    if ($dgId && $normalizeLines($content) === $normalizeLines(trim($write['wr_content']))) $content = trim($write['wr_content']);
    if ($title === '' || $content === '') dgPostFail('REQUIRED_FIELDS', '제목과 본문을 입력해주세요.');
    if (strlen($title) > 255 || strlen($content) > 65536) dgPostFail('CONTENT_TOO_LARGE', '제목은 255바이트, 본문은 64KB 이내로 작성해주세요.');
    $format = $dgInput['format'] ?? '';
    if (!in_array($format, ['', 'html1', 'html2'], true)) dgPostFail('INVALID_REQUEST', '본문 형식을 확인해주세요.', 400);
    $category = trim($dgInput['category'] ?? '');
    if ($board['bo_use_category'] && !in_array($category, array_map('trim', explode('|', $board['bo_category_list'] . '|공지')), true)) dgPostFail('CATEGORY_REQUIRED', '게시판 분류를 선택해주세요.');
    foreach (['link1', 'link2'] as $key) {
        $value = trim($dgInput[$key] ?? '');
        if ($value !== '' && (strlen($value) > 1000 || !filter_var($value, FILTER_VALIDATE_URL) || !in_array(strtolower(parse_url($value, PHP_URL_SCHEME) ?? ''), ['http', 'https'], true))) dgPostFail('INVALID_LINK', '관련 링크는 http 또는 https 주소를 입력해주세요.');
    }
    $limits = dgPostLimits();
    $delete = $dgInput['delete_files'] ?? [];
    $descriptions = $dgInput['file_descriptions'] ?? [];
    if (!is_array($delete) || !is_array($descriptions)) dgPostFail('INVALID_REQUEST', '첨부파일 입력을 확인해주세요.', 400);
    foreach ($delete as $slot) if (!is_string($slot) || !ctype_digit($slot) || !isset($dgFiles[(int)$slot])) dgPostFail('INVALID_REQUEST', '삭제할 첨부파일을 확인해주세요.', 400);
    foreach ($descriptions as $slot => $description) if (!ctype_digit((string)$slot) || (int)$slot >= $limits['slots'] || !is_string($description) || strlen($description) > 1000) dgPostFail('INVALID_REQUEST', '첨부파일 설명을 확인해주세요.', 400);
    $uploaded = $_FILES['bf_file'] ?? ['name' => [], 'tmp_name' => [], 'error' => [], 'size' => [], 'type' => []];
    foreach (['name', 'tmp_name', 'error', 'size', 'type'] as $key) if (!isset($uploaded[$key]) || !is_array($uploaded[$key])) dgPostFail('INVALID_UPLOAD', '업로드 요청 형식을 확인해주세요.');
    $normalized = ['name' => [], 'tmp_name' => [], 'error' => [], 'size' => [], 'type' => []];
    $totalBytes = 0; $remaining = count($dgFiles) - count(array_unique($delete));
    foreach ($uploaded['name'] as $slot => $name) {
        if (!ctype_digit((string)$slot) || (int)$slot >= $limits['slots'] || !is_string($name)) dgPostFail('INVALID_UPLOAD', '첨부파일 수를 확인해주세요.');
    }
    $types = ['jpg' => ['image/jpeg'], 'jpeg' => ['image/jpeg'], 'png' => ['image/png'], 'gif' => ['image/gif'], 'webp' => ['image/webp'], 'pdf' => ['application/pdf'], 'txt' => ['text/plain'],
        'zip' => ['application/zip', 'application/x-zip-compressed'], 'docx' => ['application/zip', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        'xlsx' => ['application/zip', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'], 'pptx' => ['application/zip', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
        'mp4' => ['video/mp4'], 'webm' => ['video/webm']];
    for ($i = 0; $i < $limits['slots']; $i++) {
        $error = $uploaded['error'][$i] ?? UPLOAD_ERR_NO_FILE;
        foreach (array_keys($normalized) as $key) $normalized[$key][$i] = $uploaded[$key][$i] ?? ($key === 'error' ? UPLOAD_ERR_NO_FILE : ($key === 'size' ? 0 : ''));
        if ($error === UPLOAD_ERR_NO_FILE) continue;
        $name = $uploaded['name'][$i]; $tmp = $uploaded['tmp_name'][$i] ?? '';
        if ($error !== UPLOAD_ERR_OK || !is_string($tmp) || !is_uploaded_file($tmp)) dgPostFail('UPLOAD_FAILED', '첨부파일을 정상적으로 받지 못했습니다. 서버 업로드 제한을 확인해주세요.');
        $size = filesize($tmp); $extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if ($size <= 0 || $size > $limits['bytes']) dgPostFail('UPLOAD_TOO_LARGE', '첨부파일 용량이 허용 범위를 벗어났습니다.');
        if (!isset($types[$extension]) || preg_match('/\.(?:php\d*|phtml|phar|cgi|pl|asp|aspx|jsp|html?|svg|js)(?:\.|$)/i', $name) || strpos($name, "\0") !== false) dgPostFail('FILE_TYPE_REJECTED', 'JPG·PNG·GIF·WEBP, PDF·TXT·ZIP·DOCX·XLSX·PPTX, MP4·WEBM 파일만 첨부할 수 있습니다.');
        if (!class_exists('finfo')) dgPostFail('FILEINFO_MISSING', '서버 PHP fileinfo 확장을 확인해주세요.', 503);
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($tmp);
        if (!in_array($mime, $types[$extension], true)) dgPostFail('FILE_TYPE_REJECTED', '확장자와 실제 파일 형식이 일치하지 않습니다.');
        if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'], true) && !@getimagesize($tmp)) dgPostFail('INVALID_IMAGE', '정상적인 이미지 파일을 선택해주세요.');
        $normalized['size'][$i] = $size; $totalBytes += $size;
        if (!isset($dgFiles[$i]) || in_array((string)$i, $delete, true)) $remaining++;
    }
    if ($remaining > max($limits['count'], count($dgFiles))) dgPostFail('ATTACHMENT_LIMIT', '게시판의 첨부파일 개수를 초과했습니다.');
    if ($limits['postBytes'] && $totalBytes + strlen($content) + strlen($title) + 65536 > $limits['postBytes']) dgPostFail('UPLOAD_TOO_LARGE', '본문과 첨부파일의 전체 용량이 서버 제한에 가깝습니다. 파일 용량을 줄여주세요.');
    if ($totalBytes || $delete) dgPostCheckFilePermissions();
    $_FILES = ['bf_file' => $normalized];
    $raw = ['bo_table' => $board['bo_table'], 'wr_id' => (string)$dgId, 'w' => $dgId ? 'u' : '', 'wr_subject' => $title, 'wr_content' => $content,
        'ca_name' => $category, 'html' => $format, 'secret' => !empty($dgInput['secret']) ? 'secret' : '', 'notice' => !empty($dgInput['notice']) ? '1' : '',
        'mail' => strpos($write['wr_option'] ?? '', 'mail') !== false ? 'mail' : '', 'wr_link1' => trim($dgInput['link1'] ?? ''), 'wr_link2' => trim($dgInput['link2'] ?? ''), 'uid' => (string)time() . (string)random_int(10000, 99999), 'wr_password' => ''];
    for ($i = 1; $i <= 10; $i++) $raw['wr_' . $i] = $write['wr_' . $i] ?? '';
    $_POST = array_map(static function ($value) { return call_user_func(G5_ESCAPE_FUNCTION, $value); }, $raw);
    $_POST['bf_file_del'] = [];
    $_POST['bf_content'] = [];
    for ($i = 0; $i < $limits['slots']; $i++) {
        $_POST['bf_file_del'][$i] = in_array((string)$i, $delete, true) ? '1' : '';
        // Native write_update.php escapes bf_content itself. Passing pre-escaped
        // text here would add backslashes to existing attachment descriptions.
        $_POST['bf_content'][$i] = $descriptions[$i] ?? ($dgFiles[$i]['bf_content'] ?? '');
    }
    $_REQUEST = array_merge($_GET, $_POST);
}
function dgPostSuccess(): void
{
    global $dgOperation, $dgAction, $bo_table, $wr_id, $dgWarning;
    $result = ['ok' => true, 'action' => $dgAction, 'board' => $bo_table, 'id' => (int)$wr_id, 'warning' => $dgWarning];
    $_SESSION['dugolbi_board_operations'][$dgOperation]['state'] = 'complete';
    $_SESSION['dugolbi_board_operations'][$dgOperation]['result'] = $result;
    dgPostResponse($result);
}
