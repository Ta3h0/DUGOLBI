<?php

$uri = rawurldecode((string)parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
if (strpos($uri, "\0") !== false) {
    http_response_code(400);
    exit('400 Bad Request');
}

if ($uri === '/') {
    $uri = '/index.html';
}

$file = realpath(__DIR__ . $uri);
$root = __DIR__ . DIRECTORY_SEPARATOR;

// 실제 파일이 없으면 404
if ($file === false || !is_file($file) || strncmp($file, $root, strlen($root)) !== 0) {
    http_response_code(404);
    echo '404 Not Found';
    exit;
}

// HTML 파일은 PHP로 해석
if (pathinfo($file, PATHINFO_EXTENSION) === 'html') {
    header('Content-Type: text/html; charset=UTF-8');
    include $file;
    exit;
}

// CSS, JS, 이미지 등은 PHP 내장 서버가 그대로 전달
return false;