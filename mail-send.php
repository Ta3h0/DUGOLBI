<?php
declare(strict_types=1);

header('Content-Type: text/html; charset=UTF-8');

function alertAndBack(string $message): void
{
    $safe = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    echo "<script>alert('{$safe}');history.back();</script>";
    exit;
}

function alertAndRedirect(string $message, string $path): void
{
    $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    $safePath = htmlspecialchars($path, ENT_QUOTES, 'UTF-8');
    echo "<script>alert('{$safeMessage}');location.href='{$safePath}';</script>";
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    alertAndRedirect('잘못된 접근입니다.', './index.html');
}

$name = trim((string)($_POST['user_name'] ?? ''));
$region = trim((string)($_POST['user_region'] ?? ''));
$phoneRaw = trim((string)($_POST['user_phone'] ?? ''));
$shopStatus = trim((string)($_POST['shop_status'] ?? ''));
$education = trim((string)($_POST['education'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$privacyAgree = trim((string)($_POST['privacy_agree'] ?? ''));

$routeRaw = $_POST['route'] ?? [];

if (is_array($routeRaw)) {
    $route = array_values(
        array_filter(
            array_map(
                static fn($value): string => trim((string)$value),
                $routeRaw
            )
        )
    );
} else {
    $route = [];
}

$phone = preg_replace('/\D+/', '', $phoneRaw) ?? '';

if ($name === '') {
    alertAndBack('이름을 입력해주세요.');
}

if ($region === '') {
    alertAndBack('지역을 입력해주세요.');
}

if ($phone === '') {
    alertAndBack('연락처를 입력해주세요.');
}

if ($shopStatus === '') {
    alertAndBack('샵 운영 여부를 선택해주세요.');
}

if ($education === '') {
    alertAndBack('관심 교육과정을 선택해주세요.');
}

if ($privacyAgree !== 'Y') {
    alertAndBack('개인정보 수집에 동의해주세요.');
}

$routeText = $route !== []
    ? implode(', ', $route)
    : '선택 안 함';

$to = 'contact@liumspace.com';

$subject = '[두골비 홈페이지] 교육 상담 신청이 접수되었습니다.';
$encodedSubject = mb_encode_mimeheader($subject, 'UTF-8');

$host = (string)($_SERVER['HTTP_HOST'] ?? 'example.com');
$host = preg_replace('/:\d+$/', '', $host) ?? 'example.com';
$host = preg_replace('/^www\./i', '', $host) ?? 'example.com';
$host = strtolower($host);

if (!preg_match('/^[a-z0-9.-]+\.[a-z]{2,}$/', $host)) {
    $host = 'example.com';
}

$fromName = mb_encode_mimeheader('두골비 홈페이지', 'UTF-8');
$fromEmail = 'no-reply@' . $host;

$bodyLines = [
    '두골비 교육 상담 신청서',
    str_repeat('=', 32),
    '이름: ' . $name,
    '지역: ' . $region,
    '연락처: ' . $phone,
    '샵 운영 여부: ' . $shopStatus,
    '관심 교육과정: ' . $education,
    '두골비를 알게 된 경로: ' . $routeText,
    '',
    '문의 내용:',
    $message !== '' ? $message : '작성 내용 없음',
    '',
    '개인정보 수집 동의: 동의',
    '접수 일시: ' . date('Y-m-d H:i:s'),
    '접수 IP: ' . (string)($_SERVER['REMOTE_ADDR'] ?? '-'),
];

$body = implode("\r\n", $bodyLines);

$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    "From: {$fromName} <{$fromEmail}>",
    "Return-Path: {$fromEmail}",
]);

$sent = mail(
    $to,
    $encodedSubject,
    $body,
    $headers
);

if ($sent) {
    alertAndRedirect(
        '상담 신청이 완료되었습니다.',
        './index.html'
    );
}

alertAndBack(
    '메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.'
);