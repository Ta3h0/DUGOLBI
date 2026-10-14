<?php
// Shared read-only clinical image inventory for the public page and admin preview.
function dugolbiResultsCategories(): array
{
    $categories = [
        '두골비' => ['folder' => 'dugolbi', 'caption' => '두골비'],
        '두골체' => ['folder' => 'dugolche', 'caption' => '두골체'],
        '신결비' => ['folder' => 'shingyeolbi', 'caption' => '신결비'],
        '어린이/청소년 성장관리' => ['folder' => 'growth', 'caption' => '어린이 성장'],
    ];
    foreach ($categories as $label => $category) {
        $directory = dirname(__DIR__) . '/images/results/' . $category['folder'];
        $files = is_dir($directory) ? scandir($directory) : [];
        $files = $files === false ? [] : $files;
        natsort($files);
        $images = [];
        foreach ($files as $file) {
            $path = $directory . '/' . $file;
            if (!is_file($path) || !in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)) continue;
            $size = @getimagesize($path);
            if ($size === false) continue;
            $images[] = [
                'src' => 'images/results/' . $category['folder'] . '/' . rawurlencode($file),
                'width' => $size[0],
                'height' => $size[1],
            ];
        }
        $categories[$label]['images'] = $images;
    }
    return $categories;
}
