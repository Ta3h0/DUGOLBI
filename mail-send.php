<?php
declare(strict_types=1);

header('Cache-Control: no-store');
date_default_timezone_set('Asia/Seoul');

$wantsJson = stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;
header('Content-Type: ' . ($wantsJson ? 'application/json' : 'text/html') . '; charset=UTF-8');

function respond(string $message, int $status, bool $success = false, string $path = ''): void
{
    global $wantsJson;
    http_response_code($status);
    $flags = JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT;
    if ($wantsJson) {
        echo json_encode(['success' => $success, 'message' => $message, 'redirect' => $path], $flags);
    } else {
        $encodedMessage = json_encode($message, $flags);
        $destination = $path !== ''
            ? 'location.href = ' . json_encode($path, $flags) . ';'
            : 'if (history.length > 1) history.back(); else location.href = "index.html#inquiry";';
        echo "<!DOCTYPE html><html lang=\"ko\"><meta charset=\"UTF-8\"><title>상담 신청</title>";
        echo '<p>' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p>';
        echo '<a href="index.html#inquiry">상담 신청으로 돌아가기</a>';
        echo "<script>alert({$encodedMessage}); {$destination}</script></html>";
    }
    exit;
}

function alertAndBack(string $message, int $status = 422): void
{
    respond($message, $status);
}

function alertAndRedirect(string $message, string $path): void
{
    respond($message, 200, true, $path);
}

function posted(string $name): string
{
    $value = $_POST[$name] ?? '';
    return is_string($value) ? trim($value) : '';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond('신청폼에서 접수해 주세요.', 405, false, 'index.html#inquiry');
}

if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 65536) {
    alertAndBack('입력 내용이 너무 깁니다.', 413);
}

require_once __DIR__ . '/inquiry-session.php';
if (!startInquirySession()) {
    alertAndBack('접수 세션을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.', 503);
}
$token = posted('inquiry_token');
if (!isset($_SESSION['inquiry_token']) || $token === '' || !hash_equals($_SESSION['inquiry_token'], $token)) {
    alertAndBack('신청 화면이 만료되었습니다. 페이지를 새로고침한 뒤 다시 신청해 주세요.', 403);
}

foreach (['user_name', 'user_region', 'user_phone', 'shop_status', 'education', 'message', 'privacy_agree', 'inquiry_token'] as $field) {
    if (isset($_POST[$field]) && !is_string($_POST[$field])) {
        alertAndBack('입력 형식을 다시 확인해 주세요.', 400);
    }
}

$name = posted('user_name');
$region = posted('user_region');

$phone = preg_replace(
    '/[\s()\-]/',
    '',
    posted('user_phone')
) ?? '';

$shopStatus = posted('shop_status');
$education = posted('education');
$message = posted('message');
$consent = posted('privacy_agree');

$routeRaw = $_POST['route'] ?? [];

$route = [];

if (!is_array($routeRaw) || count($routeRaw) > 4) {
    alertAndBack('알게 된 경로를 다시 확인해 주세요.', 400);
}

foreach ($routeRaw as $value) {
    if (!is_string($value)) {
        alertAndBack('알게 된 경로를 다시 확인해 주세요.', 400);
    }
    $value = trim($value);
    if ($value !== '') {
        $route[] = $value;
    }
}

$shopStatuses = [
    '미운영',
    '운영중',
    '계획중',
];

$educations = [
    '두골비',
    '두골체',
    '신결비',
    '스킬 업그레이드반',
    '창업반 교육',
    '어린이·청소년 성장관리',
    '이달의 교육'
];

$allowedRoutes = [
    '인스타그램',
    '블로그',
    '지인소개',
    '기타'
];

if (!preg_match('/\A[^\p{C}\r\n]{1,50}\z/u', $name)) {
    alertAndBack('이름을 정확히 입력해 주세요.');
}

if (!preg_match('/\A[^\p{C}\r\n]{1,100}\z/u', $region)) {
    alertAndBack('지역을 정확히 입력해 주세요.');
}

if (!preg_match('/\A(?:0\d{8,10}|\+82\d{8,10})\z/', $phone)) {
    alertAndBack('연락 가능한 전화번호를 정확히 입력해 주세요.');
}

if (!in_array($shopStatus, $shopStatuses, true)) {
    alertAndBack('샵 운영 여부를 선택해 주세요.');
}

if (!in_array($education, $educations, true)) {
    alertAndBack('관심 교육과정을 선택해 주세요.');
}

foreach ($route as $value) {
    if (!in_array($value, $allowedRoutes, true)) {
        alertAndBack('알게 된 경로를 다시 확인해 주세요.');
    }
}

if (!preg_match('//u', $message) || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $message)) {
    alertAndBack('문의 내용의 입력 문자를 다시 확인해 주세요.');
}
$messageLength = function_exists('mb_strlen')
    ? mb_strlen($message, 'UTF-8')
    : preg_match_all('/./us', $message);
if ($messageLength > 2000) {
    alertAndBack('문의 내용은 2,000자 이내로 입력해 주세요.');
}

if ($consent !== 'Y') {
    alertAndBack('개인정보 수집에 동의해 주세요.');
}

$routeText = $route
    ? implode(', ', array_unique($route))
    : '선택 안 함';


$to = $name === 'testAdmin'
    ? 'ta3h0_@naver.com'
    : 'mjk5407@naver.com';


$fromEmail = getenv('RESERVATION_FROM_EMAIL') ?: '';

if ($fromEmail === '') {

    $host = strtolower(
        (string)($_SERVER['SERVER_NAME'] ?? '')
    );

    $host = preg_replace(
        '/^www\./',
        '',
        $host
    ) ?? '';

    if (
        preg_match(
            '/\A[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}\z/',
            $host
        )
    ) {
        $fromEmail = 'no-reply@' . $host;
    }
}

if (
    !filter_var($fromEmail, FILTER_VALIDATE_EMAIL)
    || preg_match('/[\r\n]/', $fromEmail)
) {
    alertAndBack(
        '현재 메일 접수 설정을 확인 중입니다. 잠시 후 다시 시도해 주세요.',
        503
    );
}


// The session lock serializes simultaneous requests from the same browser.
$now = time();
$lastAttempt = (int)($_SESSION['inquiry_last_attempt'] ?? 0);
if ($lastAttempt > $now - 10) {
    header('Retry-After: ' . (string)max(1, 10 - ($now - $lastAttempt)));
    alertAndBack('신청을 처리 중이거나 방금 전송했습니다. 10초 후 다시 시도해 주세요.', 429);
}
$_SESSION['inquiry_last_attempt'] = $now;

$subject =
    '=?UTF-8?B?' .
    base64_encode('[두골비·체] 교육 상담 신청') .
    '?=';

$fromName =
    '=?UTF-8?B?' .
    base64_encode('두골비·체 홈페이지') .
    '?=';


$body = implode("\r\n", [

    '두골비·체 교육 상담 신청서',

    str_repeat('=', 40),

    '이름: ' . $name,

    '지역: ' . $region,

    '연락처: ' . $phone,

    '샵 운영 여부: ' . $shopStatus,

    '관심 교육과정: ' . $education,

    '두골비를 알게 된 경로: ' . $routeText,

    '',

    '문의 내용:',

    $message !== ''
        ? $message
        : '작성 내용 없음',

    '',

    '개인정보 수집 동의: 동의',

    '접수 일시: '
        . date('Y-m-d H:i:s')
        . ' (한국시간)'

]);


$headers = implode("\r\n", [

    'MIME-Version: 1.0',

    'Content-Type: text/plain; charset=UTF-8',

    'Content-Transfer-Encoding: base64',

    "From: {$fromName} <{$fromEmail}>"

]);


try {

    $sent =
        function_exists('mail')
        &&
        @mail(
            $to,
            $subject,
            chunk_split(base64_encode($body)),
            $headers
        );

} catch (Throwable $exception) {

    $sent = false;

}


if (!$sent) {

    alertAndBack(
        '상담 신청 메일 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
        503
    );

}


alertAndRedirect(
    '상담 신청이 완료되었습니다.',
    'index.html'
);
