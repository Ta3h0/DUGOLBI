<?php
require_once __DIR__ . '/auth.php';
dugolbiAdminRequireLogin(true);
// This inventory is public on results.html; no private board data is exposed.
require_once dirname(__DIR__) . '/includes/results-data.php';
header('Content-Type: application/javascript; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
$items = [];
foreach (dugolbiResultsInventory() as $label => $category) {
    foreach ($category['images'] as $image) {
        $filename = rawurldecode(basename($image['src']));
        $items[] = [
            '_key' => 'result-' . $category['folder'] . '-' . $filename,
            'category' => $label,
            'caption' => $category['caption'] . ' · ' . $filename,
            'src' => $image['src'],
            'width' => $image['width'],
            'height' => $image['height'],
            '_status' => 'visible',
        ];
    }
}
echo 'window.tempBoardResults = ' . json_encode($items, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) . ';';
