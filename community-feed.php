<?php
declare(strict_types=1);

// Reuse the installed board's connection; this endpoint has no DB credentials.
ini_set('display_errors', '0');
define('DUGOLBI_FEED_BUFFER_LEVEL', ob_get_level());
ob_start();

function dugolbiFeedRespond(array $items, int $status = 200): void
{
    while (ob_get_level() > DUGOLBI_FEED_BUFFER_LEVEL) {
        ob_end_clean();
    }
    header_remove('Location');
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    define('DUGOLBI_FEED_RESPONDED', true);
    echo json_encode($items, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

// Also suppress output if the board bootstrap exits or encounters a fatal error.
register_shutdown_function(function (): void {
    if (!defined('DUGOLBI_FEED_RESPONDED')) {
        dugolbiFeedRespond([], 503);
    }
});

function dugolbiFeedImageUrl(string $source): ?string
{
    $source = trim(html_entity_decode($source, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    if ($source === '' || preg_match('/[\x00-\x20\x7F\\\\]/', $source)) {
        return null;
    }
    if (strpos($source, '//') === 0) {
        $source = (parse_url(G5_URL, PHP_URL_SCHEME) ?: 'https') . ':' . $source;
    }
    if (preg_match('~^https?://~i', $source)) {
        $parts = parse_url($source);
        return !empty($parts['host']) && !isset($parts['user']) && !isset($parts['pass']) ? $source : null;
    }
    if (preg_match('~^[a-z][a-z0-9+.-]*:~i', $source)) {
        return null;
    }
    $path = explode('?', explode('#', $source, 2)[0], 2)[0];
    $root = realpath($_SERVER['DOCUMENT_ROOT'] ?? '');
    $file = strpos($path, '/') === 0
        ? ($root ? realpath($root . rawurldecode($path)) : false)
        : realpath(G5_PATH . '/' . rawurldecode($path));
    if (!$root || !$file || strpos($file, $root . DIRECTORY_SEPARATOR) !== 0 || !is_file($file) || !@getimagesize($file)) {
        return null;
    }
    return strpos($source, '/') === 0 ? $source : rtrim(G5_URL, '/') . '/' . $source;
}

function dugolbiFeedImage(string $boardId, int $postId, string $content): ?string
{
    global $g5;
    $result = sql_query("SELECT bf_file FROM `{$g5['board_file_table']}`
        WHERE bo_table = '{$boardId}' AND wr_id = {$postId}
        AND bf_type IN (1, 2, 3, 6, 18, 19) ORDER BY bf_no ASC", false);
    if ($result) {
        while ($file = sql_fetch_array($result)) {
            $name = (string)$file['bf_file'];
            if ($name === '' || basename($name) !== $name || strpos($name, '\\') !== false) {
                continue;
            }
            $path = G5_DATA_PATH . '/file/' . $boardId . '/' . $name;
            if (is_file($path) && @getimagesize($path)) {
                return G5_DATA_URL . '/file/' . $boardId . '/' . rawurlencode($name);
            }
        }
    }
    if ($content !== '' && class_exists('DOMDocument')) {
        $document = new DOMDocument();
        @$document->loadHTML('<meta charset="UTF-8">' . $content, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING);
        foreach ($document->getElementsByTagName('img') as $image) {
            $url = dugolbiFeedImageUrl($image->getAttribute('src'));
            if ($url !== null) {
                return $url;
            }
        }
    }
    return null;
}

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
        header('Allow: GET');
        dugolbiFeedRespond([], 405);
    }
    $boardBootstrap = __DIR__ . '/board/common.php';
    if (!is_file($boardBootstrap)) {
        dugolbiFeedRespond([], 503);
    }
    // The feed accepts no board/query parameters, including bootstrap variables.
    $_GET = $_POST = $_REQUEST = [];
    $previousDirectory = getcwd();
    chdir(__DIR__ . '/board');
    require_once $boardBootstrap;
    chdir($previousDirectory ?: __DIR__);
    ini_set('display_errors', '0');
    if (!defined('_GNUBOARD_') || !function_exists('sql_query') || empty($g5['write_prefix'])) {
        throw new RuntimeException('Board unavailable');
    }

    $posts = [];
    foreach (['notice', 'news'] as $boardId) {
        // Only public posts are eligible, even when the visitor is an administrator.
        $settings = sql_fetch("SELECT b.bo_read_level, b.bo_list_level, b.bo_use_cert, g.gr_use_access
            FROM `{$g5['board_table']}` b LEFT JOIN `{$g5['group_table']}` g ON g.gr_id = b.gr_id
            WHERE b.bo_table = '{$boardId}'", false);
        if (!$settings || (int)$settings['bo_read_level'] > 1 || (int)$settings['bo_list_level'] > 1
            || !empty($settings['gr_use_access']) || (!empty($settings['bo_use_cert']) && !empty($config['cf_cert_use']))) {
            continue;
        }
        $table = $g5['write_prefix'] . $boardId;
        $result = sql_query("SELECT wr_id, wr_subject, wr_datetime, wr_content FROM `{$table}`
            WHERE wr_is_comment = 0 AND wr_option NOT LIKE '%secret%'
            ORDER BY wr_datetime DESC, wr_id DESC LIMIT 5", false);
        if (!$result) {
            throw new RuntimeException('Board query unavailable');
        }
        while ($post = sql_fetch_array($result)) {
            $post['board'] = $boardId;
            $posts[] = $post;
        }
    }
    usort($posts, function (array $first, array $second): int {
        return strcmp($second['wr_datetime'], $first['wr_datetime'])
            ?: strcmp($first['board'], $second['board'])
            ?: ((int)$second['wr_id'] <=> (int)$first['wr_id']);
    });
    $items = [];
    foreach (array_slice($posts, 0, 5) as $post) {
        $id = (int)$post['wr_id'];
        $boardId = $post['board'];
        $items[] = [
            'board' => $boardId,
            'id' => $id,
            'title' => html_entity_decode((string)$post['wr_subject'], ENT_QUOTES | ENT_HTML5, 'UTF-8'),
            'date' => str_replace('-', '.', substr((string)$post['wr_datetime'], 0, 10)),
            'image' => dugolbiFeedImage($boardId, $id, (string)$post['wr_content']),
            'url' => $boardId . '.html?wr_id=' . $id,
        ];
    }
    dugolbiFeedRespond($items);
} catch (Throwable $error) {
    dugolbiFeedRespond([], 503);
}
