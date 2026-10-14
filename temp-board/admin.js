(() => {
    'use strict';
    const KEY = 'dugolbi-temp-board-v2';
    const LEGACY_KEY = 'dugolbi-temp-board-v1';
    const clone = value => JSON.parse(JSON.stringify(value));
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const icons = {
        overview: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
        education: '<path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M6 9v6c3 3 9 3 12 0V9M21 7v8"/>',
        schedule: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18M8 15h2M14 15h2"/>',
        promotion: '<path d="M20 13 11 22 2 13V3h10l8 8a1.5 1.5 0 0 1 0 2Z"/><circle cx="7" cy="8" r="1"/>',
        results: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/>',
        network: '<path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/>',
        boards: '<path d="M4 3h16v18H4zM8 7h8M8 12h8M8 17h5"/>',
        business: '<path d="M4 21V7l8-4 8 4v14M2 21h20M8 9h1M15 9h1M8 13h1M15 13h1M10 21v-4h4v4"/>',
        plus: '<path d="M12 5v14M5 12h14"/>', search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
        arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>',
        menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
        edit: '<path d="m15 4 5 5M3 21l4-1L21 6l-5-5L2 15l-1 5 2 1Z"/>',
    };
    const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.arrow}</svg>`;
    const definitions = {
        education: { name: '이달의 교육', singular: '교육', description: '교육 안내와 기간, 수강료를 한곳에서 관리하세요.', link: 'montly.html' },
        schedule: { name: '교육일정', singular: '일정', description: '부산·서울의 교육 기간과 반복 요일, 수업 시간을 관리하세요.', link: 'schedule.html' },
        promotion: { name: '프로모션', singular: '프로모션', description: '진행하는 혜택과 이벤트 내용을 관리하세요.', link: 'promotion-preview.html' },
        results: { name: '임상 결과', singular: '임상 이미지', description: '과정별 임상 이미지를 확인하고 등록하세요.', link: 'results.html' },
        network: { name: '수료지점', singular: '수료지점', description: '수료지점의 인증 구분과 연락처를 관리하세요.', link: 'network.html' },
        boards: { name: '게시판', singular: '게시글', description: '공지사항, 질문답변, 후기, 언론보도를 같은 화면에서 관리하세요.', link: 'notice.html' },
        business: { name: '사업정보', description: '푸터와 교육장 안내에 사용하는 공통 정보를 관리하세요.', link: 'location.html' },
    };
    const boardNames = { notice: '공지사항', qa: 'Q&A', review: '수강생 후기', news: '언론보도' };
    const certifications = ['공식 강사', '교육 마스터점', '교육 인증점', '교육 수료점'];
    const courses = ['두골비', '두골체', '신결비', '어린이/청소년 성장관리'];
    const seed = () => ({ version: 2,
        education: clone(educationData).map((item, i) => ({ ...item, _key: `education-${i}`, _status: 'visible' })),
        schedule: clone(scheduleData).map((item, i) => ({ ...item, _key: `schedule-${i}`, _status: 'visible' })),
        promotion: clone(promotionList).map((item, i) => ({ ...item, _key: `promotion-${i}`, _status: 'visible' })),
        network: clone(networkData).map((item, i) => ({ ...item, _key: `network-${i}`, _status: 'visible' })),
        results: clone(window.tempBoardResults || []), business: clone(business_info),
        boards: [
            { _key: 'sample-notice', title: '교육 안내 공지 예시', board: 'notice', content: '공지사항 작성 화면을 확인하기 위한 샘플입니다. 실제 게시판의 게시글은 변경하지 않습니다.', date: '2026-10-07', _status: 'draft', sample: true },
            { _key: 'sample-qa', title: '교육과정 상담 문의 예시', board: 'qa', content: 'Q&A 관리 화면을 확인하기 위한 샘플입니다.', date: '2026-10-07', _status: 'draft', sample: true },
        ], logs: [], updatedAt: null,
    });
    const currentSource = seed();
    // Remember which public source a preview was based on; never import old v1 blindly.
    const sourceText = JSON.stringify(currentSource);
    let sourceHash = 2166136261;
    for (const char of sourceText) sourceHash = Math.imul(sourceHash ^ char.charCodeAt(0), 16777619) >>> 0;
    currentSource.sourceSignature = sourceHash.toString(16);
    let data = clone(currentSource);
    let storageProblem = '', legacyData = null, sourceChanged = false;
    try {
        legacyData = JSON.parse(localStorage.getItem(LEGACY_KEY) || 'null');
        const stored = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (stored && stored.version === 2 && Object.keys(definitions).every(key => key === 'business' ? stored.business?.locations : Array.isArray(stored[key])) && Array.isArray(stored.logs)) {
            data = stored;
            sourceChanged = stored.sourceSignature !== currentSource.sourceSignature;
        }
    } catch { storageProblem = '임시 데이터를 읽지 못해 현재 홈페이지 데이터로 시작했습니다.'; }
    let route = 'overview', query = '', filter = '', page = 1, editContext = null, toastTimer;
    const view = document.getElementById('admin-view');
    const editor = document.getElementById('admin-editor');
    const confirmDialog = document.getElementById('admin-confirm');
    const form = document.getElementById('admin-edit-form');
    const date = value => value ? String(value).replaceAll('-', '.') : '일정 미정';
    const money = value => `${Number(value || 0).toLocaleString('ko-KR')}원`;
    const todayISO = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
    const imageUrl = value => {
        const src = String(value || '').trim();
        if (/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=\r\n]+$/.test(src)) return src;
        if (/^https?:\/\//i.test(src)) { try { const url = new URL(src); return url.username || url.password ? '' : url.href; } catch { return ''; } }
        if (/^(?:images\/|\/images\/)/.test(src) && !src.split('/').includes('..')) return src.startsWith('/') ? src : `../${src}`;
        return '';
    };
    const networkBase = (typeof networkImageBaseUrl === 'string' ? networkImageBaseUrl : 'https://okay2.speedgabia.com/_dugolbi/cert/').replace(/\/?$/, '/');
    const branchImage = item => {
        const src = String(item.img || '').trim();
        const prefix = 'images/network/plaques/';
        return src.startsWith(prefix) ? networkBase + src.slice(prefix.length) : src || networkBase + 'replace.jpg';
    };
    const itemImage = (type, item) => type === 'network' ? branchImage(item) : type === 'results' ? item.src : item.image?.src;
    const thumbnail = (src, className = '') => imageUrl(src) ? `<img class="${className}" src="${escape(imageUrl(src))}" alt="" loading="lazy">` : `<span class="admin-image-empty ${className}" aria-label="등록된 이미지 없음">${icon('results')}</span>`;
    const status = item => `<span class="admin-status ${item._status === 'draft' ? 'is-draft' : ''}">${item._status === 'draft' ? '숨김' : '노출'}</span>`;
    const titleOf = item => (item.title || item.name || item.caption || '임상 이미지').replaceAll('\n', ' ');
    function toast(text) {
        const element = document.getElementById('admin-toast');
        element.textContent = text; element.hidden = false;
        clearTimeout(toastTimer); toastTimer = setTimeout(() => { element.hidden = true; }, 3500);
    }
    function save(next, action, title) {
        next.updatedAt = new Date().toISOString();
        next.logs = [{ action, title, at: next.updatedAt }, ...next.logs].slice(0, 30);
        try { localStorage.setItem(KEY, JSON.stringify(next)); }
        catch { throw new Error('브라우저 저장 공간이 부족하거나 저장이 차단되어 있습니다. 이미지 크기를 줄이거나, 변경 내용을 내보낸 뒤 임시 데이터를 초기화해주세요.'); }
        data = next;
    }
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const isWeekly = item => Array.isArray(item.weekdays) && item.weekdays.length > 0;
    const locationName = item => data.business.locations[item.location || 'busan']?.name || '교육장 미지정';
    const bookingUrl = location => typeof scheduleBookingUrls !== 'undefined' ? scheduleBookingUrls[location] || '' : data.business.locations[location]?.naverUrl || '';
    function parseISO(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
        const parsed = new Date(value + 'T00:00:00Z');
        return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value ? parsed : null;
    }
    function nextOccurrence(item, from = todayISO()) {
        if (item._status === 'draft') return null;
        const start = item.start || from;
        if ((item.start && !parseISO(item.start)) || (item.end && !parseISO(item.end)) || (item.start && item.end && item.start > item.end)) return null;
        let candidate = parseISO(start > from ? start : from);
        if (!candidate || (item.end && candidate.toISOString().slice(0, 10) > item.end)) return null;
        if (!isWeekly(item)) return item.start && item.end ? candidate.toISOString().slice(0, 10) : null;
        for (let offset = 0; offset < 7; offset++) {
            const key = candidate.toISOString().slice(0, 10);
            if (item.end && key > item.end) return null;
            if (item.weekdays.includes(candidate.getUTCDay())) return key;
            candidate.setUTCDate(candidate.getUTCDate() + 1);
        }
        return null;
    }
    function schedulePeriod(item) {
        const repeat = isWeekly(item) ? '매주 ' + item.weekdays.map(day => weekdays[day]).join(' · ') : '';
        const bounds = item.start && item.end ? `${date(item.start)} ~ ${date(item.end)}` : item.start ? `${date(item.start)}부터` : item.end ? `${date(item.end)}까지` : '';
        const times = Array.isArray(item.times) ? item.times.join(' / ') : '';
        return [repeat, bounds, times].filter(Boolean).join(' · ') || '일정 미정';
    }
    function exportData(value, filename) {
        const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob), link = document.createElement('a');
        link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    function renderSourceStatus() {
        const element = document.getElementById('admin-source-status');
        element.hidden = !legacyData && !sourceChanged;
        element.innerHTML = `${sourceChanged ? '<p>홈페이지 원본이 갱신되었습니다. 현재 화면은 이 브라우저에 저장한 편집본입니다. 변경 내용을 내보낸 뒤 최신 원본으로 초기화할 수 있습니다.</p><button class="admin-button" data-export>현재 편집본 내보내기</button><button class="admin-button" data-reset>최신 원본으로 초기화</button>' : ''}${legacyData ? '<p>이전 시안의 저장 내용은 자동 적용하지 않았습니다. 필요하면 별도 파일로 보관하세요.</p><button class="admin-button" data-export-legacy>이전 저장 내용 내보내기</button>' : ''}`;
    }
    const actions = (type, item) => `<div class="admin-row-actions"><button class="admin-text-button" data-edit="${escape(item._key)}" aria-label="${escape(titleOf(item))} 수정">수정</button><button class="admin-delete-button" data-delete="${escape(item._key)}" aria-label="${escape(titleOf(item))} 삭제">삭제</button></div>`;
    function header(title, description, buttons = '') {
        return `<div class="admin-page-heading"><div><h1>${title}</h1><p>${description}</p></div><div class="admin-heading-actions">${buttons}</div></div>`;
    }
    function renderNavigation() {
        document.getElementById('admin-nav').innerHTML = `<a href="#overview" class="admin-nav-link ${route === 'overview' ? 'is-active' : ''}" ${route === 'overview' ? 'aria-current="page"' : ''}>${icon('overview')}<span>대시보드</span></a><p class="admin-nav-caption">콘텐츠 관리</p>${Object.entries(definitions).map(([key, config]) => `<a href="#${key}" class="admin-nav-link ${route === key ? 'is-active' : ''}" ${route === key ? 'aria-current="page"' : ''}>${icon(key)}<span>${config.name}</span>${key === 'network' ? `<span class="admin-nav-count">${data.network.length}</span>` : ''}</a>`).join('')}`;
        document.getElementById('admin-breadcrumb').textContent = definitions[route]?.name || '대시보드';
        document.title = `${definitions[route]?.name || '대시보드'} · 두골비 홈페이지 관리`;
    }
    function overview() {
        const education = data.education.find(item => item._status !== 'draft');
        const upcoming = data.schedule.map(item => ({ item, nextDate: nextOccurrence(item) })).filter(row => row.nextDate).sort((a, b) => a.nextDate.localeCompare(b.nextDate) || (a.item.times?.[0] || '').localeCompare(b.item.times?.[0] || '')).slice(0, 4);
        const stats = [['education', '교육'], ['schedule', '일정'], ['promotion', '프로모션'], ['results', '임상 이미지'], ['network', '수료지점']];
        return `${header('홈페이지 관리', '교육 안내부터 지점 정보까지, 필요한 작업을 여기에서 시작하세요.', `<button class="admin-button" data-export>${icon('download')}변경 내용 내보내기</button>`)}
            <div class="admin-overview-counts">${stats.map(([key, label]) => `<a href="#${key}"><span>${label}</span><strong>${data[key].length}<small>개</small></strong></a>`).join('')}</div>
            <div class="admin-overview-grid">
                <section class="admin-panel admin-feature"><div class="admin-panel-heading"><h2>이달의 교육</h2><a href="#education">전체 관리 ${icon('arrow')}</a></div>${education ? `<div class="admin-feature-content">${thumbnail(education.image?.src, 'admin-feature-image')}<div><div class="admin-inline-chips">${status(education)}${education.badge ? `<span class="admin-chip">${escape(education.badge)}</span>` : ''}</div><h3>${escape(titleOf(education))}</h3><p>${date(education.startDate)} – ${date(education.endDate)}<br>총 ${escape(education.durationHours)}시간</p><div class="admin-feature-price">${education.discountPercent ? `<span>${escape(education.discountPercent)}% 할인</span>` : ''}<strong>${money(Math.round(education.originalPrice * (1 - (education.discountPercent || 0) / 100)))}</strong></div><button class="admin-button" data-open-type="education" data-key="${escape(education._key)}">교육 수정 ${icon('edit')}</button></div></div>` : `<div class="admin-empty"><p>등록된 교육이 없습니다.</p><button class="admin-button admin-primary" data-new-type="education">교육 등록</button></div>`}</section>
                <section class="admin-panel admin-quick"><div class="admin-panel-heading"><h2>자주 하는 작업</h2></div>${[['education', '교육 등록', '교육 소개 · 기간 · 수강료'], ['schedule', '일정 추가', '교육장 · 반복 요일 · 예약 안내'], ['boards', '게시글 작성', '공지사항 · Q&A · 후기 · 언론보도'], ['network', '수료지점 등록', '인증 구분 · 지점 정보']].map(([key, title, detail]) => `<button class="admin-quick-row" data-new-type="${key}"><span class="admin-quick-icon">${icon(key)}</span><span><strong>${title}</strong><small>${detail}</small></span>${icon('arrow')}</button>`).join('')}</section>
                <section class="admin-panel"><div class="admin-panel-heading"><h2>예정된 교육일정</h2><a href="#schedule">일정 관리 ${icon('arrow')}</a></div><div class="admin-upcoming">${upcoming.length ? upcoming.map(({ item, nextDate }) => `<button class="admin-upcoming-row" data-open-type="schedule" data-key="${escape(item._key)}"><span class="admin-date-block"><small>${escape(nextDate.slice(5, 7))}월</small><strong>${escape(nextDate.slice(8))}</strong></span><span><strong>${escape(item.title)}</strong><small>${escape(locationName(item))}<br>${escape(schedulePeriod(item))}</small></span>${icon('arrow')}</button>`).join('') : '<div class="admin-empty"><p>예정된 교육일정이 없습니다.</p></div>'}</div></section>
                <section class="admin-panel"><div class="admin-panel-heading"><h2>최근 변경 내용</h2><span class="admin-muted">이 브라우저 기준</span></div>${data.logs.length ? `<ol class="admin-log-list">${data.logs.slice(0, 5).map(log => `<li><span class="admin-log-dot" aria-hidden="true"></span><div><strong>${escape(log.title)}</strong><p>${escape(log.action)} · ${escape(new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul' }).format(new Date(log.at)))}</p></div></li>`).join('')}</ol>` : `<div class="admin-history-empty">${icon('edit')}<strong>아직 변경한 내용이 없습니다.</strong><p>등록하거나 수정한 내용이 여기에 표시됩니다.</p></div>`}</section>
            </div><div class="admin-bottom-note"><p>내용을 수정한 뒤 ‘변경 내용 내보내기’로 보관할 수 있습니다.</p><button class="admin-text-button" data-reset>임시 데이터 초기화</button></div>`;
    }
    function optionsFor(type) {
        if (type === 'schedule') return Object.entries(data.business.locations).map(([key, item]) => [key, item.name]);
        if (type === 'boards') return Object.entries(boardNames);
        if (type === 'network') return certifications.map(value => [value, value]);
        if (type === 'results') return courses.map(value => [value, value]);
        return [['visible', '노출'], ['draft', '숨김']];
    }
    function filteredItems() {
        const items = [...data[route]];
        if (route === 'network') items.sort((a, b) => (Number(b.regionPriority) || 0) - (Number(a.regionPriority) || 0) || a.name.localeCompare(b.name, 'ko'));
        return items.filter(item => {
            const text = `${titleOf(item)} ${item.region || ''} ${item.graduateName || ''} ${item.phone || ''} ${route === 'schedule' ? locationName(item) + ' ' + schedulePeriod(item) : ''}`.toLocaleLowerCase();
            const category = route === 'schedule' ? item.location || 'busan' : route === 'boards' ? item.board : route === 'network' ? item.certification : route === 'results' ? item.category : item._status;
            return text.includes(query.toLocaleLowerCase()) && (!filter || category === filter);
        });
    }
    function listToolbar() {
        const options = optionsFor(route);
        return `<div class="admin-list-toolbar"><div class="admin-list-summary">전체 <strong>${data[route].length}</strong>개 <span id="admin-filter-count"></span></div><div class="admin-list-controls"><label class="admin-search">${icon('search')}<input id="admin-search-input" type="search" placeholder="${route === 'network' ? '지점명, 지역, 수료자 검색' : '제목 검색'}" aria-label="${definitions[route].name} 검색" value="${escape(query)}"></label><select id="admin-filter" aria-label="${definitions[route].name} 필터"><option value="">${route === 'schedule' ? '모든 교육장' : route === 'boards' ? '모든 게시판' : route === 'network' ? '모든 인증 구분' : route === 'results' ? '모든 과정' : '모든 상태'}</option>${options.map(([key, label]) => `<option value="${escape(key)}" ${filter === key ? 'selected' : ''}>${escape(label)}</option>`).join('')}</select></div></div>`;
    }
    function listPage() {
        const config = definitions[route];
        const extra = route === 'boards' ? '<p class="admin-board-note">샘플 게시글입니다. 작성·수정은 임시 저장되며 실제 그누보드에는 등록되지 않습니다.</p>' : '';
        return `${header(config.name, config.description, `<a class="admin-button" href="../${config.link}" target="_blank" rel="noopener noreferrer">홈페이지에서 보기 ↗</a><button class="admin-button admin-primary" data-new>${icon('plus')}${config.singular} 등록</button>`)}${extra}<section class="admin-panel admin-list-panel">${listToolbar()}<div id="admin-list-body"></div><div id="admin-pagination" class="admin-pagination" aria-label="목록 페이지"></div></section>`;
    }
    function renderListBody() {
        const items = filteredItems();
        const size = route === 'results' ? 12 : 8;
        const totalPages = Math.ceil(items.length / size);
        page = Math.min(Math.max(1, page), Math.max(1, totalPages));
        const visible = items.slice((page - 1) * size, page * size);
        document.getElementById('admin-filter-count').textContent = query || filter ? `· 검색 결과 ${items.length}개` : '';
        const body = document.getElementById('admin-list-body');
        if (!visible.length) body.innerHTML = `<div class="admin-empty">${icon(route)}<h2>${query || filter ? '조건에 맞는 항목이 없습니다.' : '등록된 항목이 없습니다.'}</h2><p>${query || filter ? '검색어나 필터를 변경해보세요.' : '오른쪽 위 등록 버튼으로 내용을 추가해보세요.'}</p>${query || filter ? '<button class="admin-button" data-clear-filter>검색 초기화</button>' : ''}</div>`;
        else if (route === 'results') body.innerHTML = `<div class="admin-results-grid">${visible.map(item => `<article class="admin-result-card">${thumbnail(item.src, 'admin-result-image')}<div class="admin-result-meta"><span class="admin-chip">${escape(item.category)}</span>${status(item)}</div><h3>${escape(item.caption)}</h3>${actions(route, item)}</article>`).join('')}</div>`;
        else {
            const headings = route === 'network' ? ['지점명 / 수료자', '인증 구분', '지역', '연락처', '관리'] : route === 'schedule' ? ['교육장 / 교육일정', '요일 · 기간 · 시간', '예약 링크', '상태', '관리'] : route === 'boards' ? ['제목', '게시판', '작성일', '상태', '관리'] : ['교육명' .replace('교육', route === 'promotion' ? '프로모션' : '교육'), '기간', route === 'education' ? '수강료' : '분류', '상태', '관리'];
            const rows = visible.map(item => {
                let columns;
                if (route === 'network') columns = [`<div class="admin-table-content">${thumbnail(branchImage(item), 'admin-table-thumb')}<div><strong>${escape(item.name)}</strong><small>${escape(item.graduateName)}${item.regionPriority ? ' · 상단 고정' : ''}</small></div></div>`, `<span class="admin-chip ${item.certification === '공식 강사' ? 'is-filled' : ''}">${escape(item.certification)}</span>`, escape(item.region), `<a href="tel:${escape(item.phone.replace(/[^+\d]/g, ''))}">${escape(item.phone)}</a>`];
                else if (route === 'schedule') columns = [`<strong>${escape(item.title)}</strong><small class="admin-cell-sub">${escape(locationName(item))}</small>${item.temporary ? '<small class="admin-cell-sub">임시 일정</small>' : ''}`, escape(schedulePeriod(item)), `<span class="admin-chip">${item.naverBookingUrl ? '네이버 예약' : '미등록'}</span>`, status(item)];
                else if (route === 'boards') columns = [`<strong>${escape(item.title)}</strong>${item.sample ? '<small class="admin-cell-sub">샘플 게시글</small>' : ''}`, boardNames[item.board], date(item.date), status(item)];
                else columns = [`<div class="admin-table-content">${thumbnail(item.image?.src, 'admin-table-thumb')}<div><strong>${escape(titleOf(item))}</strong><small>${escape(item.category || '')}</small></div></div>`, `${date(item.startDate)}<br><span class="admin-muted">– ${date(item.endDate)}</span>`, route === 'education' ? `<strong>${money(Math.round(item.originalPrice * (1 - (item.discountPercent || 0) / 100)))}</strong><small class="admin-cell-sub">${item.discountPercent ? `${escape(item.discountPercent)}% 할인 · ` : ''}총 ${escape(item.durationHours)}시간</small>` : escape(item.category || '프로모션'), status(item)];
                return `<tr>${[...columns, actions(route, item)].map((column, i) => `<td data-label="${headings[i]}">${column}</td>`).join('')}</tr>`;
            }).join('');
            body.innerHTML = `<div class="admin-table-scroll"><table class="admin-table"><caption class="admin-sr-only">${definitions[route].name} 관리 목록</caption><thead><tr>${headings.map(heading => `<th scope="col">${heading}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
        }
        const pagination = document.getElementById('admin-pagination');
        if (totalPages <= 1) { pagination.innerHTML = items.length ? `<span>${items.length}개 표시</span>` : ''; return; }
        const start = Math.max(1, Math.min(page - 2, totalPages - 4));
        pagination.innerHTML = `<span>${(page - 1) * size + 1}–${Math.min(page * size, items.length)} / ${items.length}개</span><div><button data-page="1" aria-label="첫 페이지" ${page === 1 ? 'disabled' : ''}>«</button><button data-page="${page - 1}" aria-label="이전 페이지" ${page === 1 ? 'disabled' : ''}>‹</button>${Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i).map(i => `<button data-page="${i}" ${page === i ? 'class="is-active" aria-current="page"' : ''} aria-label="${i}페이지">${i}</button>`).join('')}<button data-page="${page + 1}" aria-label="다음 페이지" ${page === totalPages ? 'disabled' : ''}>›</button><button data-page="${totalPages}" aria-label="마지막 페이지" ${page === totalPages ? 'disabled' : ''}>»</button></div>`;
    }
    function businessPage() {
        const info = data.business;
        return `${header('사업정보', definitions.business.description, '<button class="admin-button admin-primary" data-edit-business>사업정보 수정</button>')}<div class="admin-business-layout"><section class="admin-panel"><div class="admin-panel-heading"><h2>기본 사업정보</h2></div><dl class="admin-business-info">${[['상호명', info.name], ['대표자', info.representative], ['사업자등록번호', info.registrationNumber], ['이메일', info.email], ['대표 연락처', info.phone]].map(([label, value]) => `<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl></section><section class="admin-panel"><div class="admin-panel-heading"><h2>교육장 안내</h2></div>${Object.values(info.locations).map(location => `<div class="admin-location"><h3>${escape(location.name)}</h3><p>${escape(location.address)}</p><small>${location.hours.map(escape).join('<br>')}</small><div><span class="admin-chip">네이버 지도 ${location.naverUrl ? '등록됨' : '미등록'}</span><span class="admin-chip">카카오 지도 ${location.kakaoUrl ? '등록됨' : '미등록'}</span></div></div>`).join('')}</section></div><div class="admin-bottom-note"><p>수료지점별 연락처는 ‘수료지점’ 메뉴에서 별도로 관리합니다.</p></div>`;
    }
    function render() {
        renderNavigation();
        renderSourceStatus();
        view.innerHTML = route === 'overview' ? overview() : route === 'business' ? businessPage() : listPage();
        if (route !== 'overview' && route !== 'business') renderListBody();
    }
    function fieldsFor(type) {
        const common = [{ key: '_status', label: '홈페이지 표시', type: 'select', options: [['visible', '노출'], ['draft', '숨김']] }];
        if (type === 'education') return [{ key: 'title', label: '교육명', required: true, wide: true }, { key: 'category', label: '교육 분류', placeholder: '10월 이달의 교육' }, { key: 'badge', label: '이미지 칩', placeholder: '얼리버드' }, { key: 'startDate', label: '교육 시작일', type: 'date', required: true }, { key: 'endDate', label: '교육 종료일', type: 'date', required: true }, { key: 'durationHours', label: '교육시간 (시간)', type: 'number', min: 0.5, step: 0.5, required: true }, { key: 'originalPrice', label: '정상 수강료 (원)', type: 'number', min: 0, step: 1, required: true }, { key: 'discountPercent', label: '할인율 (%)', type: 'number', min: 0, max: 100 }, ...common, { key: 'image.src', label: '교육 이미지', type: 'image', wide: true }, { key: 'description', label: '교육 소개', type: 'textarea', wide: true }, { key: 'introTitle', label: '상세 소개 제목', wide: true }, { key: 'introParagraphs', label: '상세 소개 내용', type: 'textarea', array: true, wide: true, hint: '문단은 빈 줄로 구분합니다.' }, { key: 'introEmphasis', label: '상세 강조 문구', wide: true }, { key: 'posterLabel', label: '이미지 링크 설명', wide: true }, { key: 'image.alt', label: '이미지 설명', wide: true }, { key: 'image.previewAlt', label: '목록 이미지 설명', wide: true }, { key: 'naverBookingUrl', label: '예약 주소', type: 'url', wide: true }, { key: 'temporary', label: '임시 일정', type: 'checkbox' }, { key: 'curriculum', label: '커리큘럼', type: 'curriculum', wide: true }];
        if (type === 'schedule') return [
            { key: 'title', label: '일정명', required: true, wide: true },
            { key: 'location', label: '교육장', type: 'select', options: Object.entries(data.business.locations).map(([key, location]) => [key, location.name]), required: true },
            { key: '_scheduleMode', label: '일정 방식', type: 'select', options: [['weekly', '요일 반복'], ['period', '기간 지정']] },
            { key: 'weekdays', label: '반복 요일', type: 'weekdays', wide: true, hint: '수업이 있는 요일을 모두 선택합니다.' },
            { key: 'start', label: '시작일', type: 'date', hint: '요일 반복은 비워두면 시작일 제한 없이 표시합니다.' },
            { key: 'end', label: '종료일', type: 'date', hint: '요일 반복은 비워두면 종료일 제한 없이 표시합니다.' },
            { key: 'times', label: '수업 시작 시간', type: 'textarea', array: true, lineArray: true, wide: true, hint: '10:00, 15:30과 같이 24시간 형식으로 한 줄에 하나씩 입력합니다.' },
            { key: 'color', label: '달력 색상', type: 'select', options: [['schedule-color-1', '파랑'], ['schedule-color-2', '청록'], ['schedule-color-3', '보라'], ['schedule-color-4', '주황'], ['schedule-color-5', '분홍']] }, ...common,
            { key: 'temporary', label: '임시 일정', type: 'checkbox', optionLabel: '임시 일정으로 표시' },
            { key: 'naverBookingUrl', label: '네이버 예약 주소', type: 'url', wide: true, hint: '교육장 변경 시 기본 예약 주소도 바뀝니다. 직접 입력한 주소는 유지합니다.' }
        ];
        if (type === 'promotion') return [{ key: 'title', label: '프로모션명', required: true, wide: true }, { key: 'detailTitle', label: '상세 제목', wide: true }, { key: 'startDate', label: '시작일', type: 'date', required: true }, { key: 'endDate', label: '종료일', type: 'date', required: true }, { key: 'category', label: '분류' }, ...common, { key: 'image.src', label: '목록 이미지', type: 'image', wide: true }, { key: 'detailImage.src', label: '상세 이미지', type: 'image', wide: true }, { key: 'description', label: '목록 소개', type: 'textarea', wide: true }, { key: 'paragraphs', label: '상세 내용', type: 'textarea', array: true, wide: true, hint: '문단은 빈 줄로 구분합니다.' }, { key: 'image.alt', label: '목록 이미지 설명', wide: true }, { key: 'detailImage.alt', label: '상세 이미지 설명', wide: true }];
        if (type === 'network') return [{ key: 'name', label: '지점명', required: true, wide: true }, { key: 'graduateName', label: '수료자명', required: true }, { key: 'certification', label: '인증 구분', type: 'select', options: certifications.map(value => [value, value]) }, { key: 'region', label: '지역', required: true }, { key: 'phone', label: '연락처', type: 'tel', required: true }, { key: 'img', label: '지점 이미지', type: 'image', wide: true, hint: '비워두면 현판 호스팅의 공통 replace.jpg 이미지를 표시합니다.' }, { key: 'regionPriority', label: '목록 우선 표시', type: 'checkbox', optionLabel: '전국 및 해당 지역에서 상단 고정' }];
        if (type === 'results') return [{ key: 'category', label: '교육과정', type: 'select', options: courses.map(value => [value, value]) }, ...common, { key: 'caption', label: '관리용 이미지명', required: true, wide: true }, { key: 'src', label: '임상 이미지', type: 'image', wide: true, required: true }];
        if (type === 'boards') return [{ key: 'board', label: '게시판', type: 'select', options: Object.entries(boardNames) }, ...common, { key: 'title', label: '제목', required: true, wide: true }, { key: 'content', label: '본문', type: 'textarea', required: true, wide: true, hint: '임시 버전은 일반 텍스트 입력입니다. 운영 연동 시 기존 에디터와 연결합니다.' }, { key: 'date', label: '작성일', type: 'date', required: true }];
        if (type === 'business') return [{ key: 'name', label: '상호명', required: true, wide: true }, { key: 'representative', label: '대표자', required: true }, { key: 'registrationNumber', label: '사업자등록번호', required: true }, { key: 'email', label: '공개 이메일', type: 'email', required: true }, { key: 'phone', label: '대표 연락처', type: 'tel', required: true }, ...['busan', 'seoul'].flatMap((key, i) => [{ key: `locations.${key}.name`, label: `${i ? '서울' : '부산'} 교육장명`, required: true, wide: true }, { key: `locations.${key}.address`, label: '교육장 주소', required: true, wide: true }, { key: `locations.${key}.hours`, label: '운영시간', type: 'textarea', array: true, lineArray: true, wide: true, hint: '시간 안내를 한 줄씩 입력합니다.' }, { key: `locations.${key}.naverUrl`, label: '네이버 지도 주소', type: 'url' }, { key: `locations.${key}.kakaoUrl`, label: '카카오 지도 주소', type: 'url' }])];
        return [];
    }
    const readPath = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);
    function writePath(object, path, value) {
        const keys = path.split('.'); let target = object;
        keys.slice(0, -1).forEach(key => { if (!target[key] || typeof target[key] !== 'object') target[key] = {}; target = target[key]; });
        target[keys.at(-1)] = value;
    }
    function newItem(type) {
        // Temporary record identifiers also work when this prototype is served over HTTP.
        const base = { _key: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`, _status: 'draft' };
        if (type === 'education') return { ...base, id: Math.max(0, ...data.education.map(item => Number(item.id) || 0)) + 1, durationHours: 3, originalPrice: 0, discountPercent: 0, image: {}, introParagraphs: [], curriculum: [] };
        if (type === 'promotion') return { ...base, id: Math.max(0, ...data.promotion.map(item => Number(item.id) || 0)) + 1, category: 'PROMOTION', image: {}, detailImage: {}, paragraphs: [] };
        if (type === 'schedule') return { ...base, id: base._key, location: 'busan', weekdays: [0], times: ['10:00', '15:30'], color: 'schedule-color-1', naverBookingUrl: bookingUrl('busan') };
        if (type === 'network') return { ...base, certification: '교육 수료점', regionPriority: 0, img: '' };
        if (type === 'results') return { ...base, category: '두골비', src: '' };
        if (type === 'boards') return { ...base, board: 'notice', date: todayISO(), sample: true };
        return base;
    }
    function curriculumMarkup(items) {
        return `<div class="admin-curriculum-rows">${items.map((item, index) => `<div class="admin-curriculum-item" data-curriculum-row><div class="admin-curriculum-heading"><strong>항목 ${index + 1}</strong><button type="button" class="admin-text-button" data-remove-curriculum="${index}">항목 삭제</button></div><div class="admin-form-grid">${[['title', '제목'], ['subtitle', '부제목'], ['question', '질문'], ['description', '설명']].map(([key, label]) => `<div class="admin-field ${key === 'description' ? 'is-wide' : ''}"><label for="curriculum-${index}-${key}">${label}</label>${key === 'description' ? `<textarea id="curriculum-${index}-${key}" name="curriculum.${index}.${key}" data-part="${key}" rows="4">${escape(item[key] || '')}</textarea>` : `<input id="curriculum-${index}-${key}" name="curriculum.${index}.${key}" data-part="${key}" value="${escape(item[key] || '')}">`}</div>`).join('')}</div></div>`).join('')}</div><button type="button" class="admin-button" data-add-curriculum>커리큘럼 추가</button>`;
    }
    function readCurriculum() {
        return [...form.querySelectorAll('[data-curriculum-row]')].map(row => Object.fromEntries([...row.querySelectorAll('[data-part]')].map(input => [input.dataset.part, input.value.trim()])));
    }
    function syncScheduleMode() {
        if (editContext?.type !== 'schedule') return;
        const weekly = form.elements.namedItem('_scheduleMode').value === 'weekly';
        form.querySelector('[data-field="weekdays"]').hidden = !weekly;
        ['start', 'end'].forEach(key => {
            form.elements.namedItem(key).required = !weekly;
            const field = form.querySelector(`[data-field="${key}"]`);
            const label = field.querySelector('label');
            label.querySelector('.admin-required')?.remove();
            if (!weekly) { const badge = document.createElement('span'); badge.className = 'admin-required'; badge.textContent = '필수'; label.append(badge); }
            field.querySelector('.admin-field-hint').textContent = weekly ? `${key === 'start' ? '시작일' : '종료일'}을 비워두면 해당 날짜 제한 없이 반복합니다.` : '기간 지정은 시작일과 종료일을 모두 입력합니다.';
        });
    }
    function openEditor(type, key) {
        const current = type === 'business' ? data.business : data[type].find(item => item._key === key);
        editContext = { type, key, item: clone(current || newItem(type)), fields: fieldsFor(type), dirty: false, pendingUploads: 0 };
        if (type === 'schedule') { editContext.item.location ||= 'busan'; editContext.item._scheduleMode = isWeekly(editContext.item) ? 'weekly' : 'period'; editContext.bookingLocation = editContext.item.location; }
        form.querySelector('[type="submit"]').disabled = false;
        document.getElementById('admin-editor-title').textContent = type === 'business' ? '사업정보 수정' : `${definitions[type].singular} ${current ? '수정' : '등록'}`;
        document.getElementById('admin-form-error').hidden = true;
        document.getElementById('admin-editor-fields').innerHTML = `<div class="admin-form-grid">${editContext.fields.map(field => {
            const id = `field-${field.key.replaceAll('.', '-')}`;
            let value = readPath(editContext.item, field.key) ?? '';
            if (field.array) value = Array.isArray(value) ? value.join(field.lineArray ? '\n' : '\n\n') : '';
            const attributes = `id="${id}" name="${field.key}" ${field.required ? 'required' : ''}`;
            let input;
            if (field.type === 'textarea') input = `<textarea ${attributes} rows="${field.key === 'content' ? 10 : 4}">${escape(value)}</textarea>`;
            else if (field.type === 'select') input = `<select ${attributes}>${field.options.map(([key, label]) => `<option value="${escape(key)}" ${value === key ? 'selected' : ''}>${escape(label)}</option>`).join('')}</select>`;
            else if (field.type === 'checkbox') input = `<label class="admin-check"><input type="checkbox" ${attributes} ${value ? 'checked' : ''}>${field.optionLabel || '임시 일정으로 표시'}</label>`;
            else if (field.type === 'weekdays') input = `<div class="admin-weekdays" role="group" aria-labelledby="${id}-label">${weekdays.map((label, day) => `<label class="admin-check"><input type="checkbox" name="weekdays" value="${day}" ${Array.isArray(value) && value.includes(day) ? 'checked' : ''}>${label}</label>`).join('')}</div>`;
            else if (field.type === 'curriculum') input = `<div data-curriculum>${curriculumMarkup(Array.isArray(value) ? value : [])}</div>`;
            else if (field.type === 'image') input = `<div class="admin-image-field"><div class="admin-upload-preview" data-preview-for="${field.key}">${thumbnail(value || (type === 'network' ? branchImage(editContext.item) : ''))}</div><div><input type="text" ${attributes} value="${escape(value.startsWith('data:') ? '' : value)}" ${value.startsWith('data:') ? 'data-uploaded="true" placeholder="선택한 이미지가 임시 저장되어 있습니다"' : 'placeholder="images/경로 또는 https://이미지주소"'}><label class="admin-button admin-upload-label">${icon('results')}이미지 선택<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" data-upload="${field.key}"></label><small>JPG, PNG, WEBP, GIF · 최대 2MB</small></div></div>`;
            else input = `<input type="${field.type || 'text'}" ${attributes} value="${escape(value)}" ${field.min !== undefined ? `min="${field.min}"` : ''} ${field.max !== undefined ? `max="${field.max}"` : ''} ${field.type === 'number' ? `step="${field.step || 1}"` : ''} ${field.placeholder ? `placeholder="${escape(field.placeholder)}"` : ''}>`;
            return `<div class="admin-field ${field.wide ? 'is-wide' : ''}" data-field="${field.key}"><label id="${id}-label" ${['weekdays', 'curriculum'].includes(field.type) ? '' : `for="${id}"`}>${field.label}${field.required ? '<span class="admin-required">필수</span>' : ''}</label>${input}${field.hint ? `<small class="admin-field-hint">${field.hint}</small>` : ''}</div>`;
        }).join('')}</div>`;
        // Uploaded data URLs are kept in the draft while a normal path field stays readable.
        editContext.fields.filter(field => field.type === 'image').forEach(field => {
            const input = form.elements.namedItem(field.key);
            if (input.dataset.uploaded) { input.required = false; input.dataset.imageValue = readPath(editContext.item, field.key); }
        });
        syncScheduleMode();
        editor.showModal();
    }
    async function confirmAction(title, message, buttonLabel = '삭제하기') {
        document.getElementById('admin-confirm-title').textContent = title;
        document.getElementById('admin-confirm-message').textContent = message;
        confirmDialog.querySelector('[value="confirm"]').textContent = buttonLabel;
        confirmDialog.returnValue = 'cancel';
        return new Promise(resolve => { confirmDialog.addEventListener('close', () => resolve(confirmDialog.returnValue === 'confirm'), { once: true }); confirmDialog.showModal(); });
    }
    function showFormError(message) { const element = document.getElementById('admin-form-error'); element.textContent = message; element.hidden = false; }
    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!editContext || editContext.pendingUploads) return;
        const item = clone(editContext.item);
        try {
            for (const field of editContext.fields) {
                if (field.type === 'weekdays') { item.weekdays = new FormData(form).getAll('weekdays').map(Number); continue; }
                if (field.type === 'curriculum') {
                    item.curriculum = readCurriculum();
                    if (item.curriculum.some(part => !part.title)) throw new Error('커리큘럼 각 항목의 제목을 입력해주세요.');
                    continue;
                }
                const input = form.elements.namedItem(field.key);
                let value = field.type === 'checkbox' ? input.checked : field.type === 'number' ? Number(input.value) : input.value.trim();
                if (field.type === 'image') { value = input.dataset.imageValue || value; if (value && !imageUrl(value)) throw new Error(`${field.label}: images/ 경로나 http(s) 이미지 주소를 입력해주세요.`); }
                if (field.required && !value && value !== 0) throw new Error(`${field.label}을(를) 입력해주세요.`);
                if (field.type === 'url' && value && !/^https?:\/\//i.test(value)) throw new Error(`${field.label}: http:// 또는 https:// 주소를 입력해주세요.`);
                if (field.array) {
                    const original = readPath(editContext.item, field.key);
                    value = Array.isArray(original) && input.value === original.join(field.lineArray ? '\n' : '\n\n') ? clone(original) : value.split(field.lineArray ? /\n/ : /\n\s*\n/).map(part => part.trim()).filter(Boolean);
                }
                writePath(item, field.key, value);
            }
            if (editContext.type === 'schedule') {
                if (!data.business.locations[item.location]) throw new Error('교육장을 선택해주세요.');
                if (item._scheduleMode === 'weekly') {
                    if (!item.weekdays.length || item.weekdays.some(day => !Number.isInteger(day) || day < 0 || day > 6)) throw new Error('반복 요일을 하나 이상 선택해주세요.');
                    item.weekdays = [...new Set(item.weekdays)].sort((a, b) => a - b);
                } else {
                    if (!item.start || !item.end) throw new Error('기간 지정은 시작일과 종료일을 모두 입력해주세요.');
                    delete item.weekdays;
                }
                ['start', 'end'].forEach(key => { if (!item[key]) delete item[key]; else if (!parseISO(item[key])) throw new Error('올바른 날짜를 입력해주세요.'); });
                if (item.times.some(time => !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))) throw new Error('수업 시간은 10:00처럼 24시간 형식으로 입력해주세요.');
                item.times = [...new Set(item.times)];
                delete item._scheduleMode;
            }
            if (editContext.type === 'network') item.regionPriority = Number(Boolean(item.regionPriority));
            const start = item.startDate || item.start, end = item.endDate || item.end;
            if (start && end && end < start) throw new Error('종료일은 시작일과 같거나 이후여야 합니다.');
            const next = clone(data); const { type, key } = editContext;
            if (type === 'business') next.business = item;
            else { const index = next[type].findIndex(row => row._key === key); if (index >= 0) next[type][index] = item; else next[type].unshift(item); }
            save(next, key || type === 'business' ? '수정' : '등록', type === 'business' ? '사업정보' : titleOf(item));
            editor.close(); render(); toast('이 브라우저에 임시 저장했습니다.');
        } catch (error) { showFormError(error.message); }
    });
    form.addEventListener('input', event => {
        if (editContext) editContext.dirty = true;
        const field = editContext?.fields.find(field => field.key === event.target.name && field.type === 'image');
        if (field) {
            delete event.target.dataset.imageValue;
            const preview = [...form.querySelectorAll('[data-preview-for]')].find(element => element.dataset.previewFor === field.key);
            preview.innerHTML = thumbnail(event.target.value || (editContext.type === 'network' ? branchImage({ ...editContext.item, img: '' }) : ''));
        }
    });
    form.addEventListener('change', async event => {
        if (event.target.name === '_scheduleMode') syncScheduleMode();
        if (editContext?.type === 'schedule' && event.target.name === 'location') {
            const input = form.elements.namedItem('naverBookingUrl');
            if (!input.value || input.value === bookingUrl(editContext.bookingLocation)) input.value = bookingUrl(event.target.value);
            editContext.bookingLocation = event.target.value;
        }
        const key = event.target.dataset.upload;
        if (!key || !event.target.files[0]) return;
        const file = event.target.files[0], context = editContext;
        if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || file.size > 2 * 1024 * 1024) { showFormError('2MB 이하의 JPG, PNG, WEBP, GIF 이미지를 선택해주세요.'); return; }
        context.pendingUploads += 1;
        event.target.disabled = true;
        form.querySelector('[type="submit"]').disabled = true;
        try {
            const bitmap = await createImageBitmap(file); const dimensions = { width: bitmap.width, height: bitmap.height }; bitmap.close();
            const value = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
            if (editContext !== context || !editor.open) return;
            if (key.endsWith('.src')) { const path = key.slice(0, -4); writePath(context.item, path, { ...(readPath(context.item, path) || {}), ...dimensions }); }
            else if (context.type === 'results') Object.assign(context.item, dimensions);
            const input = form.elements.namedItem(key); input.value = ''; input.dataset.imageValue = value; input.required = false; input.placeholder = `${file.name} · 임시 이미지 선택됨`;
            const preview = [...form.querySelectorAll('[data-preview-for]')].find(element => element.dataset.previewFor === key);
            preview.innerHTML = thumbnail(value); context.dirty = true; document.getElementById('admin-form-error').hidden = true;
        } catch { if (editContext === context) showFormError('이미지를 읽지 못했습니다. 다른 이미지 파일을 선택해주세요.'); }
        finally {
            context.pendingUploads -= 1;
            event.target.disabled = false;
            if (editContext === context) form.querySelector('[type="submit"]').disabled = context.pendingUploads > 0;
        }
    });
    form.addEventListener('click', event => {
        const button = event.target.closest('[data-add-curriculum], [data-remove-curriculum]');
        if (!button || !editContext) return;
        const items = readCurriculum();
        if (button.hasAttribute('data-add-curriculum')) items.push({ title: '', subtitle: '', question: '', description: '' });
        else items.splice(Number(button.dataset.removeCurriculum), 1);
        form.querySelector('[data-curriculum]').innerHTML = curriculumMarkup(items);
        editContext.dirty = true;
    });
    async function closeEditor() {
        if (!editContext?.dirty || await confirmAction('수정 중인 내용을 닫을까요?', '저장하지 않은 수정 내용은 사라집니다.', '저장하지 않고 닫기')) editor.close();
    }
    editor.addEventListener('cancel', event => { event.preventDefault(); closeEditor(); });
    editor.addEventListener('close', () => { editContext = null; });
    function closeMenu() { document.body.classList.remove('admin-menu-open'); document.getElementById('admin-menu-toggle').setAttribute('aria-expanded', 'false'); document.getElementById('admin-menu-backdrop').hidden = true; }
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', async event => {
        const target = event.target.closest('button,a,[data-close-editor]');
        if (!target) return;
        if (target.hasAttribute('data-close-editor')) { closeEditor(); return; }
        if (target.id === 'admin-menu-toggle') { const open = !document.body.classList.contains('admin-menu-open'); document.body.classList.toggle('admin-menu-open', open); target.setAttribute('aria-expanded', String(open)); document.getElementById('admin-menu-backdrop').hidden = !open; return; }
        if (target.dataset.newType) { openEditor(target.dataset.newType); return; }
        if (target.dataset.openType) { openEditor(target.dataset.openType, target.dataset.key); return; }
        if (target.hasAttribute('data-new')) { openEditor(route); return; }
        if (target.hasAttribute('data-edit-business')) { openEditor('business'); return; }
        if (target.dataset.edit) { openEditor(route, target.dataset.edit); return; }
        if (target.dataset.page) { page = Number(target.dataset.page); renderListBody(); return; }
        if (target.hasAttribute('data-clear-filter')) { query = ''; filter = ''; page = 1; render(); return; }
        if (target.dataset.delete) {
            const type = route, item = data[type].find(row => row._key === target.dataset.delete);
            if (!item || !await confirmAction('항목을 삭제할까요?', `‘${titleOf(item)}’을(를) 임시 목록에서 삭제합니다. 운영 홈페이지에는 영향이 없습니다.`)) return;
            try { const next = clone(data); next[type] = next[type].filter(row => row._key !== item._key); save(next, '삭제', titleOf(item)); render(); toast('임시 목록에서 삭제했습니다.'); } catch (error) { toast(error.message); }
        }
        if (target.hasAttribute('data-export')) {
            exportData(data, `dugolbi-temp-${todayISO()}.json`); toast('임시 변경 내용을 JSON 파일로 내보냈습니다.');
        }
        if (target.hasAttribute('data-export-legacy') && legacyData) { exportData(legacyData, `dugolbi-previous-${todayISO()}.json`); return; }
        if (target.hasAttribute('data-reset') && await confirmAction('임시 데이터를 초기화할까요?', '이 브라우저에 저장한 수정 내용이 사라집니다. 필요하면 먼저 변경 내용을 내보내주세요.', '초기화하기')) {
            try { localStorage.removeItem(KEY); data = clone(currentSource); sourceChanged = false; render(); toast('현재 홈페이지 데이터를 기준으로 초기화했습니다.'); } catch { toast('브라우저 저장 공간에 접근할 수 없어 초기화하지 못했습니다.'); }
        }
    });
    view.addEventListener('input', event => { if (event.target.id === 'admin-search-input') { query = event.target.value; page = 1; renderListBody(); } });
    view.addEventListener('change', event => { if (event.target.id === 'admin-filter') { filter = event.target.value; page = 1; renderListBody(); } });
    view.addEventListener('error', event => { if (event.target.tagName === 'IMG') { event.target.replaceWith(Object.assign(document.createElement('span'), { className: 'admin-image-empty', textContent: '이미지 없음' })); } }, true);
    document.getElementById('admin-menu-backdrop').addEventListener('click', closeMenu);
    document.getElementById('admin-menu-toggle').innerHTML = icon('menu');
    document.querySelector('[data-close-editor]').innerHTML = icon('close');
    document.getElementById('admin-today').textContent = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short', timeZone: 'Asia/Seoul' }).format(new Date());
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    function changeRoute() { const requested = location.hash.slice(1); route = definitions[requested] ? requested : 'overview'; query = ''; filter = ''; page = 1; closeMenu(); render(); window.scrollTo(0, 0); }
    window.addEventListener('hashchange', changeRoute); changeRoute();
    if (storageProblem) toast(storageProblem);
})();
