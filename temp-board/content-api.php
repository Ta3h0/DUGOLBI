<?php
ini_set('display_errors', '0');
require_once __DIR__ . '/auth.php';
dugolbiAdminRequireLogin(true);
require_once dirname(__DIR__) . '/includes/content-store.php';
header('Content-Type: application/json; charset=UTF-8'); header('Cache-Control: no-store, private');
function dgContentResponse(array $data, int $status = 200): void { http_response_code($status); if (session_status() === PHP_SESSION_ACTIVE) session_write_close(); echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE); exit; }
function dgContentFail(string $code, string $message, int $status): void { dgContentResponse(['ok' => false, 'code' => $code, 'message' => $message], $status); }
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if (!in_array($method, ['GET', 'POST'], true)) { header('Allow: GET, POST'); dgContentFail('METHOD_NOT_ALLOWED', '허용되지 않는 요청입니다.', 405); }
try {
    $inventory = dgContentInventory();
    if ($method === 'GET') { $state = dgContentRead(); $sections = $state['sections']; $sections['results'] = dgContentResultItems($state, $inventory); dgContentResponse(['ok' => true, 'revision' => dgContentRevision($state, $inventory), 'csrfToken' => dugolbiAdminToken(), 'sections' => $sections, 'logs' => $state['logs'], 'updatedAt' => $state['updatedAt'] ?? null]); }
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 12582912) dgContentFail('TOO_LARGE', '선택한 이미지와 내용의 전체 용량이 너무 큽니다. 나누어 저장해주세요.', 413);
    $raw = file_get_contents('php://input'); $input = json_decode($raw, true);
    if (!is_array($input) || !is_string($input['section'] ?? null)) dgContentFail('INVALID_FIELDS', '저장 요청 형식을 확인해주세요.', 400);
    if (!dugolbiAdminValidToken($input['csrf_token'] ?? null)) dgContentFail('TOKEN_EXPIRED', '로그인 화면 또는 관리자 화면을 다시 열어주세요.', 403);
    $uploads = []; $section = $input['section']; $items = dgContentValidate($section, $input['items'] ?? null, $uploads);
    $title = dgContentText($input['title'] ?? '', 1000); $action = dgContentText($input['action'] ?? '수정', 50);
    $directory = dirname(dgContentPath());
    if (is_link($directory) || (is_dir($directory) && realpath($directory) !== realpath(__DIR__) . DIRECTORY_SEPARATOR . 'content-private')) throw new RuntimeException('Unsafe storage path.');
    if (!is_dir($directory) && !mkdir($directory, 0755)) throw new RuntimeException('Storage directory unavailable.');
    if (is_link($directory . '/lock.php')) throw new RuntimeException('Unsafe storage lock.');
    $lock = fopen($directory . '/lock.php', 'c+');
    if (!$lock || !flock($lock, LOCK_EX)) throw new RuntimeException('Storage lock failed.');
    if (filesize($directory . '/lock.php') === 0) fwrite($lock, "<?php http_response_code(404); exit;\n");
    $state = dgContentRead(); $inventory = dgContentInventory();
    if (!is_string($input['revision'] ?? null) || !hash_equals(dgContentRevision($state, $inventory), $input['revision'])) dgContentFail('CONTENT_CHANGED', '다른 화면 또는 홈페이지 원본에서 내용이 변경되었습니다. 입력한 내용을 보관한 뒤 새로고침해주세요.', 409);
    // Images are immutable, identified by content hash; canceled edits publish nothing.
    if ($uploads) {
        $root = dirname(__DIR__) . '/images/content';
        if (is_link($root)) throw new RuntimeException('Unsafe upload path.');
        if (!is_dir($root) && !mkdir($root, 0755)) throw new RuntimeException('Upload directory unavailable.');
        foreach ($uploads as $path => $image) {
            $target = dirname(__DIR__) . '/' . $path;
            if (is_link($target)) throw new RuntimeException('Unsafe upload file.');
            if (is_file($target)) { if (hash_file('sha256', $target) !== hash('sha256', $image['bytes'])) throw new RuntimeException('Upload hash mismatch.'); }
            else { $handle = fopen($target, 'x'); if (!$handle) throw new RuntimeException('Image upload failed.'); $written = fwrite($handle, $image['bytes']); fclose($handle); if ($written !== strlen($image['bytes'])) throw new RuntimeException('Incomplete image upload.'); }
        }
    }
    if ($section === 'results') { $keys = array_flip(array_column($items, '_key')); $state['resultsExcluded'] = array_values(array_unique(array_merge($state['resultsExcluded'] ?? [], array_column(array_filter($inventory, static function ($item) use ($keys) { return !isset($keys[$item['_key']]); }), '_key')))); }
    $state['sections'][$section] = $items; $state['updatedAt'] = gmdate('c');
    $state['logs'] = array_slice(array_merge([['action' => $action, 'title' => $title, 'at' => $state['updatedAt']]], $state['logs']), 0, 30);
    $encoded = json_encode($state, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    if (is_file(dgContentPath())) dgContentWriteFile($directory . '/previous.php', file_get_contents(dgContentPath()));
    dgContentWriteFile(dgContentPath(), DG_CONTENT_GUARD . base64_encode($encoded));
    flock($lock, LOCK_UN); fclose($lock);
    dgContentResponse(['ok' => true, 'revision' => dgContentRevision($state, $inventory), 'section' => $section, 'items' => $items, 'logs' => $state['logs'], 'updatedAt' => $state['updatedAt']]);
} catch (InvalidArgumentException $error) { dgContentFail('INVALID_FIELDS', $error->getMessage(), 422); }
catch (Throwable $error) { error_log('[DUGOLBI content-api] ' . get_class($error) . ' at ' . basename($error->getFile()) . ':' . $error->getLine()); dgContentFail('STORAGE_FAILED', '서버 저장 상태를 확인하지 못했습니다. 재시도 전에 새로고침해 결과를 확인하고, 서버 폴더의 쓰기 권한을 확인해주세요.', 503); }
