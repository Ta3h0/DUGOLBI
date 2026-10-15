<?php
ini_set('display_errors', '0');
require_once __DIR__ . '/includes/content-store.php';
header('Content-Type: application/javascript; charset=UTF-8'); header('X-Content-Type-Options: nosniff'); header('Cache-Control: no-store');
echo file_get_contents(__DIR__ . '/js/modify.js');
try {
    $state = dgContentRead(); $public = [];
    foreach (['education', 'schedule', 'promotion', 'network'] as $section) if (array_key_exists($section, $state['sections'])) $public[$section] = array_values(array_map(static function ($item) { unset($item['_key'], $item['_status']); return $item; }, array_filter($state['sections'][$section], static function ($item) { return ($item['_status'] ?? 'visible') !== 'draft'; })));
    if (isset($state['sections']['business'])) $public['business'] = $state['sections']['business'];
    $json = json_encode($public, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    echo "\n;(() => { const saved = $json; const sections = { education: educationData, schedule: scheduleData, promotion: promotionList, network: networkData }; for (const key of Object.keys(sections)) if (Array.isArray(saved[key])) sections[key].splice(0, sections[key].length, ...saved[key]); if (saved.business) Object.assign(business_info, saved.business); for (const item of educationData) Object.defineProperty(item, 'phone', { enumerable: true, configurable: true, get: () => business_info.phone }); for (const item of educationData) if (item._bookingFromBusiness) { Object.defineProperty(item, 'naverBookingUrl', { enumerable: true, configurable: true, get: () => business_info.locations.busan.naverUrl }); delete item._bookingFromBusiness; } })();\n";
} catch (Throwable $error) { error_log('[DUGOLBI public content] Storage unavailable; using modify.js defaults.'); }
