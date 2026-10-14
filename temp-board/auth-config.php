<?php
// Fixed temporary account. Keep the password as a one-way hash on the server.
if (!defined('DUGOLBI_ADMIN_BOOTSTRAP')) {
    http_response_code(403);
    exit;
}
return [
    'username' => 'admin',
    'password_hash' => '$2y$12$nxC0ehsLrLhCVhI6sRqd8.MNs7LzdplR0heDzDRFGxM49Onm54Ffi',
    'idle_timeout' => 7200,
    'absolute_timeout' => 28800,
];
