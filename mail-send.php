<?php
declare(strict_types=1);

header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-store');
date_default_timezone_set('Asia/Seoul');

function alertAndBack(string $message): void
{
    $message = json_encode(
        $message,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    echo "<script>
        alert({$message});
        history.back();
    </script>";

    exit;
}

function alertAndRedirect(string $message, string $path): void
{
    $message = json_encode(
        $message,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    $path = json_encode(
        $path,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    echo "<script>
        alert({$message});
        location.href = {$path};
    </script>";

    exit;
}

function posted(string $name): string
{
    $value = $_POST[$name] ?? '';
    return is_string($value) ? trim($value) : '';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    alertAndRedirect(
        '신청폼에서 접수해 주세요.',
        '/index.html'
    );
}

if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 8192) {
    alertAndBack('입력 내용이 너무 깁니다.');
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

if (is_array($routeRaw)) {
    foreach ($routeRaw as $value) {
        if (is_string($value)) {
            $value = trim($value);

            if ($value !== '') {
                $route[] = $value;
            }
        }
    }
}

$shopStatuses = [
    '운영중',
    '계획중'
];

$educations = [
    '두골비',
    '두골체',
    '신결비'
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

if (mb_strlen($message, 'UTF-8') > 2000) {
    alertAndBack('문의 내용은 2,000자 이내로 입력해 주세요.');
}

if ($consent !== 'Y') {
    alertAndBack('개인정보 수집에 동의해 주세요.');
}

$routeText = $route
    ? implode(', ', $route)
    : '선택 안 함';


$to = $name === 'testAdmin'
    ? 'ta3h0_@naver.com'
    : 'contact@liumspace.com';


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
        '현재 메일 접수 설정을 확인 중입니다. 잠시 후 다시 시도해 주세요.'
    );
}


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
        '상담 신청 메일 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.'
    );

}


alertAndRedirect(
    '상담 신청이 완료되었습니다.',
    '/index.html'
);