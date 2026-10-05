<?php
// Shared only by the inquiry form and its existing mail endpoint.
function startInquirySession(): bool
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return true;
    }

    return @session_start([
        'use_strict_mode' => true,
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax',
        'cookie_secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
}
