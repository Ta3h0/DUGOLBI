<?php
// Included by boards-api.php after session authentication and DB connection.
if (!defined('DUGOLBI_ADMIN_BOOTSTRAP') || !isset($db, $tables, $requestedBoard, $requestedQuery, $requestedPage)) {
    http_response_code(403);
    exit;
}
if (!isset($tables['write_prefix']) || !is_string($tables['write_prefix']) || !preg_match('/\A[A-Za-z0-9_]+\z/', $tables['write_prefix'])) {
    $db->close();
    dugolbiBoardFailure('DB_CONFIG_INVALID', '그누보드 게시글 테이블 설정을 확인해주세요.');
}
// Look up the registered board first. Request values never form a table name unchecked.
$statement = $db->prepare("SELECT bo_table, bo_subject, bo_notice FROM `{$tables['board_table']}` WHERE bo_table = ? LIMIT 1");
$statement->bind_param('s', $requestedBoard);
$statement->execute();
$statement->bind_result($boardId, $boardName, $noticeIds);
$exists = $statement->fetch();
$statement->close();
if (!$exists || !preg_match('/\A[A-Za-z0-9_]{1,20}\z/', $boardId)) {
    $db->close();
    dugolbiBoardFailure('BOARD_NOT_FOUND', '등록된 게시판을 찾을 수 없습니다.', 404);
}
$writeTable = $tables['write_prefix'] . $boardId;
$query = trim($requestedQuery);
$where = 'wr_is_comment = 0';
$pattern = '%' . str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $query) . '%';
if ($query !== '') $where .= " AND wr_subject LIKE ? ESCAPE '!'";
$statement = $db->prepare("SELECT COUNT(*) FROM `$writeTable` WHERE $where");
if ($query !== '') $statement->bind_param('s', $pattern);
$statement->execute();
$statement->bind_result($total);
$statement->fetch();
$statement->close();
$total = (int)$total;
$pageSize = 20;
$pageCount = (int)ceil($total / $pageSize);
$pageNumber = min((int)$requestedPage, max(1, $pageCount));
$offset = ($pageNumber - 1) * $pageSize;
$noticeIds = (string)$noticeIds;
$statement = $db->prepare("SELECT wr_id, wr_subject, wr_name, wr_datetime, wr_hit, wr_comment, wr_option, wr_reply, ca_name
    FROM `$writeTable` WHERE $where
    ORDER BY (FIND_IN_SET(wr_id, ?) > 0) DESC, wr_num, wr_reply, wr_id DESC LIMIT ? OFFSET ?");
if ($query !== '') $statement->bind_param('ssii', $pattern, $noticeIds, $pageSize, $offset);
else $statement->bind_param('sii', $noticeIds, $pageSize, $offset);
$statement->execute();
$statement->bind_result($id, $subject, $author, $createdAt, $hits, $comments, $options, $reply, $category);
$noticeSet = array_map('intval', array_filter(explode(',', $noticeIds), 'strlen'));
$posts = [];
while ($statement->fetch()) {
    $posts[] = [
        'id' => (int)$id,
        'title' => (string)$subject,
        'author' => (string)$author,
        'createdAt' => (string)$createdAt,
        'hits' => max(0, (int)$hits),
        'comments' => max(0, (int)$comments),
        'secret' => strpos((string)$options, 'secret') !== false,
        'notice' => in_array((int)$id, $noticeSet, true),
        'reply' => (string)$reply !== '',
        'category' => (string)$category,
    ];
}
$statement->close();
$db->close();
echo json_encode([
    'ok' => true, 'mode' => 'read-only',
    'board' => ['id' => (string)$boardId, 'name' => (string)$boardName],
    'posts' => $posts, 'total' => $total, 'page' => $pageNumber,
    'pageSize' => $pageSize, 'pageCount' => $pageCount, 'query' => $query,
], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
