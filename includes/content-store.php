<?php
// Shared JSON storage. The guarded PHP payload is read as text, never included.
const DG_CONTENT_GUARD = "<?php http_response_code(404); exit;\n//";
function dgContentPath(): string { return dirname(__DIR__) . '/temp-board/content-private/state.php'; }
function dgContentRead(): array {
    $path = dgContentPath();
    if (is_link($path) || is_link(dirname($path))) throw new RuntimeException('Unsafe content storage.');
    if (!is_file($path)) return ['version' => 1, 'sections' => [], 'logs' => [], 'resultsExcluded' => []];
    $raw = @file_get_contents($path);
    if ($raw === false || strpos($raw, DG_CONTENT_GUARD) !== 0) throw new RuntimeException('Content storage is unreadable.');
    $decoded = base64_decode(substr($raw, strlen(DG_CONTENT_GUARD)), true);
    $state = $decoded === false ? null : json_decode($decoded, true);
    if (!is_array($state) || ($state['version'] ?? null) !== 1 || !is_array($state['sections'] ?? null) || !is_array($state['logs'] ?? null)) throw new RuntimeException('Content storage is invalid.');
    return $state;
}
function dgContentInventory(): array {
    require_once __DIR__ . '/results-data.php';
    $items = [];
    foreach (dugolbiResultsInventory() as $label => $category) foreach ($category['images'] as $image) {
        $file = rawurldecode(basename($image['src']));
        $items[] = ['_key' => 'result-' . $category['folder'] . '-' . $file, '_status' => 'visible', 'category' => $label, 'caption' => $category['caption'] . ' · ' . $file] + $image;
    }
    return $items;
}
function dgContentResultItems(array $state, ?array $inventory = null): array {
    $inventory = $inventory ?? dgContentInventory();
    if (!isset($state['sections']['results'])) return $inventory;
    $items = array_values(array_filter($state['sections']['results'], static function ($item) {
        if (strpos($item['src'], 'images/results/') !== 0) return true;
        return is_file(dirname(__DIR__) . '/' . rawurldecode((string)parse_url($item['src'], PHP_URL_PATH)));
    })); $known = [];
    foreach ($items as $item) $known[$item['_key']] = true;
    $excluded = array_flip($state['resultsExcluded'] ?? []);
    foreach ($inventory as $item) if (!isset($known[$item['_key']]) && !isset($excluded[$item['_key']])) $items[] = $item;
    return $items;
}
function dgContentRevision(array $state, array $inventory): string {
    return hash('sha256', json_encode($state, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . hash_file('sha256', dirname(__DIR__) . '/js/modify.js') . json_encode($inventory));
}
function dgContentText($value, int $max = 50000): string {
    if (!is_string($value) || strlen($value) > $max || strpos($value, "\0") !== false || !preg_match('//u', $value)) throw new InvalidArgumentException('입력 형식 또는 글자 수를 확인해주세요.');
    return $value;
}
function dgContentList($value, int $max = 2000): array {
    if (!is_array($value) || count($value) > $max || ($value && array_keys($value) !== range(0, count($value) - 1))) throw new InvalidArgumentException('목록 형식과 항목 수를 확인해주세요.');
    return $value;
}
function dgContentImage(string $src, array &$uploads): string {
    if (strpos($src, 'data:') === 0) {
        if (!preg_match('~\Adata:image/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/=\r\n]+)\z~', $src, $m)) throw new InvalidArgumentException('지원하지 않는 이미지 형식입니다.');
        $bytes = base64_decode($m[2], true);
        if ($bytes === false || strlen($bytes) > 2097152) throw new InvalidArgumentException('이미지는 파일당 2MB 이하여야 합니다.');
        $size = @getimagesizefromstring($bytes);
        if (!$size || ($size['mime'] ?? '') !== 'image/' . $m[1] || $size[0] * $size[1] > 40000000) throw new InvalidArgumentException('올바른 JPG, PNG, WEBP, GIF 이미지인지 확인해주세요.');
        $ext = $m[1] === 'jpeg' ? 'jpg' : $m[1];
        $path = 'images/content/' . hash('sha256', $bytes) . '.' . $ext;
        $uploads[$path] = ['bytes' => $bytes, 'width' => $size[0], 'height' => $size[1]];
        return $path;
    }
    if ($src === '') return '';
    if (preg_match('~\Ahttps?://~i', $src)) {
        $url = parse_url($src);
        if (!$url || empty($url['host']) || isset($url['user']) || isset($url['pass']) || preg_match('/[\x00-\x20]/', $src)) throw new InvalidArgumentException('이미지 주소를 확인해주세요.');
        return $src;
    }
    $path = rawurldecode((string)parse_url($src, PHP_URL_PATH));
    if (!preg_match('~\A/?images/~', $path) || strpos($path, "\\") !== false || in_array('..', explode('/', $path), true) || strpos($path, "\0") !== false) throw new InvalidArgumentException('이미지는 images/ 경로나 http(s) 주소를 사용해주세요.');
    return $src;
}
function dgContentValue($value, string $type, array &$uploads) {
    if ($type === 'text') return dgContentText($value);
    if ($type === 'url' || $type === 'image') {
        $v = dgContentText($value, $type === 'image' ? 3000000 : 4000);
        if ($type === 'image') return dgContentImage($v, $uploads);
        if ($v !== '' && (!preg_match('~\Ahttps?://~i', $v) || !filter_var($v, FILTER_VALIDATE_URL) || isset(parse_url($v)['user']) || isset(parse_url($v)['pass']))) throw new InvalidArgumentException('http(s) 주소를 확인해주세요.');
        return $v;
    }
    if ($type === 'number' || $type === 'id') {
        if ($type === 'id' && is_string($value) && trim($value) !== '') return dgContentText($value, 200);
        if ((!is_int($value) && !is_float($value)) || !is_finite((float)$value) || $value < 0 || $value > 100000000000) throw new InvalidArgumentException('숫자 값을 확인해주세요.');
        return $value;
    }
    if ($type === 'bool') { if (!is_bool($value) && $value !== 0 && $value !== 1) throw new InvalidArgumentException('표시 옵션을 확인해주세요.'); return (bool)$value; }
    if ($type === 'strings' || $type === 'weekdays' || $type === 'times') {
        $list = dgContentList($value, 100);
        foreach ($list as &$part) {
            if ($type === 'weekdays') { if (!is_int($part) || $part < 0 || $part > 6) throw new InvalidArgumentException('반복 요일을 확인해주세요.'); }
            else { $part = dgContentText($part); if ($type === 'times' && !preg_match('/\A([01][0-9]|2[0-3]):[0-5][0-9]\z/', $part)) throw new InvalidArgumentException('수업 시간은 HH:MM 형식으로 입력해주세요.'); }
        } unset($part);
        return $list;
    }
    if ($type === 'imageObject') {
        $out = dgContentObject($value, ['src' => 'image', 'alt' => 'text', 'previewAlt' => 'text', 'width' => 'number', 'height' => 'number'], $uploads);
        if (isset($uploads[$out['src'] ?? ''])) { $out['width'] = $uploads[$out['src']]['width']; $out['height'] = $uploads[$out['src']]['height']; }
        return $out;
    }
    if ($type === 'curriculum') { $list = dgContentList($value, 100); return array_map(static function ($part) use (&$uploads) { $out = dgContentObject($part, ['title' => 'text', 'subtitle' => 'text', 'question' => 'text', 'description' => 'text'], $uploads); if (!trim($out['title'] ?? '')) throw new InvalidArgumentException('커리큘럼 제목을 입력해주세요.'); return $out; }, $list); }
    throw new InvalidArgumentException('지원하지 않는 데이터입니다.');
}
function dgContentObject($value, array $schema, array &$uploads): array {
    if (!is_array($value)) throw new InvalidArgumentException('항목 형식을 확인해주세요.');
    $out = [];
    foreach ($schema as $key => $type) if (array_key_exists($key, $value)) $out[$key] = dgContentValue($value[$key], $type, $uploads);
    return $out;
}
function dgContentDate(string $value): bool {
    if (!preg_match('/\A(\d{4})-(\d{2})-(\d{2})\z/', $value, $m)) return false;
    return checkdate((int)$m[2], (int)$m[3], (int)$m[1]);
}
function dgContentValidate(string $section, $value, array &$uploads) {
    if ($section === 'business') {
        $out = dgContentObject($value, ['name' => 'text', 'representative' => 'text', 'registrationNumber' => 'text', 'email' => 'text', 'phone' => 'text'], $uploads);
        foreach (['name', 'representative', 'registrationNumber', 'email', 'phone'] as $key) if (!trim($out[$key] ?? '')) throw new InvalidArgumentException('사업정보 필수 항목을 입력해주세요.');
        if (!filter_var($out['email'], FILTER_VALIDATE_EMAIL)) throw new InvalidArgumentException('이메일 주소를 확인해주세요.');
        foreach (['busan', 'seoul'] as $key) {
            $location = dgContentObject($value['locations'][$key] ?? null, ['name' => 'text', 'address' => 'text', 'hours' => 'strings', 'naverUrl' => 'url', 'kakaoUrl' => 'url'], $uploads);
            if (!trim($location['name'] ?? '') || !trim($location['address'] ?? '') || !isset($location['hours'])) throw new InvalidArgumentException('교육장 이름·주소·운영시간을 확인해주세요.');
            $out['locations'][$key] = $location;
        }
        return $out;
    }
    $common = ['_key' => 'text', '_status' => 'text'];
    $schemas = [
        'education' => ['id' => 'id', 'title' => 'text', 'category' => 'text', 'image' => 'imageObject', 'posterLabel' => 'text', 'badge' => 'text', 'startDate' => 'text', 'endDate' => 'text', 'temporary' => 'bool', 'durationHours' => 'number', 'originalPrice' => 'number', 'discountPercent' => 'number', 'description' => 'text', 'introTitle' => 'text', 'introParagraphs' => 'strings', 'introEmphasis' => 'text', 'curriculum' => 'curriculum', 'naverBookingUrl' => 'url', '_bookingFromBusiness' => 'bool'],
        'promotion' => ['id' => 'id', 'title' => 'text', 'detailTitle' => 'text', 'startDate' => 'text', 'endDate' => 'text', 'category' => 'text', 'image' => 'imageObject', 'detailImage' => 'imageObject', 'description' => 'text', 'paragraphs' => 'strings'],
        'schedule' => ['id' => 'id', 'title' => 'text', 'location' => 'text', 'start' => 'text', 'end' => 'text', 'weekdays' => 'weekdays', 'times' => 'times', 'color' => 'text', 'temporary' => 'bool', 'naverBookingUrl' => 'url'],
        'network' => ['name' => 'text', 'graduateName' => 'text', 'region' => 'text', 'phone' => 'text', 'certification' => 'text', 'regionPriority' => 'bool', 'img' => 'image'],
        'results' => ['category' => 'text', 'caption' => 'text', 'src' => 'image', 'width' => 'number', 'height' => 'number'],
    ];
    if (!isset($schemas[$section])) throw new InvalidArgumentException('수정할 콘텐츠 구분을 확인해주세요.');
    $list = dgContentList($value); $seen = []; $ids = [];
    foreach ($list as &$item) {
        $item = dgContentObject($item, $common + $schemas[$section], $uploads);
        $key = $item['_key'] ?? '';
        if (!trim($key) || strlen($key) > 500 || isset($seen[$key])) throw new InvalidArgumentException('항목 식별자가 없거나 중복되었습니다. 새로고침해주세요.');
        $seen[$key] = true; $item['_status'] = $item['_status'] ?? 'visible';
        if (!in_array($item['_status'], ['visible', 'draft'], true)) throw new InvalidArgumentException('노출 옵션을 확인해주세요.');
        foreach (($section === 'network' ? ['name', 'graduateName', 'phone', 'region'] : ($section === 'results' ? ['caption', 'src', 'category'] : ['title', 'id'])) as $required) if (!isset($item[$required]) || trim((string)$item[$required]) === '') throw new InvalidArgumentException('필수 항목을 입력해주세요.');
        if (isset($item['id'])) { if (isset($ids[(string)$item['id']])) throw new InvalidArgumentException('항목 ID가 중복되었습니다.'); $ids[(string)$item['id']] = true; }
        if ($section === 'schedule') {
            if (!in_array($item['location'] ?? '', ['busan', 'seoul'], true) || !preg_match('/\Aschedule-color-[1-5]\z/', $item['color'] ?? '')) throw new InvalidArgumentException('교육장과 색상을 선택해주세요.');
            if (empty($item['weekdays']) && (empty($item['start']) || empty($item['end']))) throw new InvalidArgumentException('기간 또는 반복 요일을 입력해주세요.');
            $dates = ['start', 'end'];
        } else $dates = in_array($section, ['education', 'promotion'], true) ? ['startDate', 'endDate'] : [];
        foreach ($dates as $date) if (!empty($item[$date]) && !dgContentDate($item[$date])) throw new InvalidArgumentException('날짜를 확인해주세요.');
        if ($dates && !empty($item[$dates[0]]) && !empty($item[$dates[1]]) && $item[$dates[0]] > $item[$dates[1]]) throw new InvalidArgumentException('종료일은 시작일 이후여야 합니다.');
        if (in_array($section, ['education', 'promotion'], true) && (empty($item['startDate']) || empty($item['endDate']))) throw new InvalidArgumentException('시작일과 종료일을 입력해주세요.');
        if ($section === 'education' && (($item['durationHours'] ?? 0) <= 0 || ($item['discountPercent'] ?? 0) > 100)) throw new InvalidArgumentException('교육시간과 할인율을 확인해주세요.');
        if ($section === 'network' && !in_array($item['certification'] ?? '', ['공식 강사', '교육 마스터점', '교육 인증점', '교육 수료점'], true)) throw new InvalidArgumentException('인증 구분을 확인해주세요.');
        if ($section === 'results') {
            if (!in_array($item['category'], ['두골비', '두골체', '신결비', '어린이/청소년 성장관리'], true)) throw new InvalidArgumentException('교육과정을 선택해주세요.');
            if (isset($uploads[$item['src']])) { $item['width'] = $uploads[$item['src']]['width']; $item['height'] = $uploads[$item['src']]['height']; }
        }
    } unset($item);
    return $list;
}
function dgContentWriteFile(string $path, string $raw): void {
    $temp = dirname($path) . '/write-' . bin2hex(random_bytes(12)) . '.php';
    if (file_put_contents($temp, $raw, LOCK_EX) === false) throw new RuntimeException('Storage write failed.');
    if (!rename($temp, $path)) { @unlink($temp); throw new RuntimeException('Storage replace failed.'); }
}
