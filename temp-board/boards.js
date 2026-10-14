(() => {
    'use strict';
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    let destroy = () => {};
    window.dugolbiBoards = {
        unmount() { destroy(); destroy = () => {}; window.dugolbiBoardPosts?.unmount(); window.dugolbiBoardSettings?.dispose(); },
        mount(root) {
            this.unmount();
            const controller = new AbortController();
            const requestController = new AbortController();
            let active = true, loading = false, boards = [], query = '', group = '', page = 1;
            destroy = () => { active = false; controller.abort(); requestController.abort(); };
            root.innerHTML = `<div class="admin-page-heading"><div><h1>게시판 관리</h1><p>운영 그누보드에 등록된 게시판을 확인하세요.</p></div><div class="admin-heading-actions"><button type="button" class="admin-button" data-board-refresh>다시 불러오기</button></div></div>
                <p class="admin-board-note">게시글과 게시판 설정을 관리할 수 있습니다. 저장한 변경 내용은 운영 게시판에 반영됩니다.</p><p class="admin-board-note" data-board-operation-status role="status" hidden></p>
                <section class="admin-panel admin-list-panel"><div data-board-status role="status" aria-live="polite" aria-atomic="true"></div>
                <div class="admin-list-toolbar" data-board-toolbar hidden><div class="admin-list-summary">게시판 <strong data-board-count>0</strong>개</div><div class="admin-list-controls"><label class="admin-search"><input type="search" data-board-search placeholder="게시판 이름, ID 검색" aria-label="게시판 검색"></label><select data-board-group aria-label="게시판 그룹 필터"><option value="">모든 그룹</option></select></div></div>
                <div data-board-list></div><div class="admin-pagination" data-board-pagination aria-label="게시판 목록 페이지"></div></section>`;
            const find = selector => root.querySelector(selector);
            const display = () => {
                const items = boards.filter(item => `${item.name} ${item.id}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()) && (!group || item.groupId === group));
                const pages = Math.ceil(items.length / 8);
                page = Math.max(1, Math.min(page, pages || 1));
                const visible = items.slice((page - 1) * 8, page * 8);
                find('[data-board-count]').textContent = String(boards.length);
                find('[data-board-list]').innerHTML = visible.length ? `<div class="admin-table-scroll"><table class="admin-table"><caption class="admin-sr-only">그누보드 게시판 목록</caption><thead><tr>${['게시판명 / ID', '그룹', '게시글 / 댓글', '권한 레벨', '확인'].map(label => `<th scope="col">${label}</th>`).join('')}</tr></thead><tbody>${visible.map(item => `<tr>
                    <td data-label="게시판명 / ID"><strong>${escape(item.name || item.id)}</strong><small class="admin-cell-sub">${escape(item.id)}${item.categories.length ? ' · ' + escape(item.categories.join(' / ')) : ''}</small></td>
                    <td data-label="그룹">${escape(item.groupName || '그룹 미지정')}</td>
                    <td data-label="게시글 / 댓글">게시글 ${Number(item.postCount).toLocaleString('ko-KR')}개<small class="admin-cell-sub">댓글 ${Number(item.commentCount).toLocaleString('ko-KR')}개</small></td>
                    <td data-label="권한 레벨">목록 ${Number(item.listLevel)} · 읽기 ${Number(item.readLevel)} · 쓰기 ${Number(item.writeLevel)}</td>
                    <td data-label="확인"><div class="admin-board-actions"><button class="admin-button" type="button" data-board-posts="${escape(item.id)}">게시글 목록</button><button class="admin-button" type="button" data-board-settings="${escape(item.id)}">설정</button></div></td></tr>`).join('')}</tbody></table></div>` : `<div class="admin-empty"><h2>${query || group ? '조건에 맞는 게시판이 없습니다.' : '등록된 게시판이 없습니다.'}</h2><p>${query || group ? '검색어나 그룹을 변경해주세요.' : 'DB 연결은 정상이며 게시판 목록이 비어 있습니다.'}</p></div>`;
                const start = Math.max(1, Math.min(page - 2, pages - 4));
                find('[data-board-pagination]').innerHTML = pages > 1 ? `<span>검색 결과 ${items.length}개</span><div><button data-board-page="${page - 1}" aria-label="이전 페이지" ${page === 1 ? 'disabled' : ''}>‹</button>${Array.from({ length: Math.min(5, pages) }, (_, i) => start + i).map(i => `<button data-board-page="${i}" ${i === page ? 'class="is-active" aria-current="page"' : ''} aria-label="${i}페이지">${i}</button>`).join('')}<button data-board-page="${page + 1}" aria-label="다음 페이지" ${page === pages ? 'disabled' : ''}>›</button></div>` : items.length ? `<span>${items.length}개 표시</span>` : '';
            };
            const load = async (preservePage = false) => {
                if (loading) return;
                loading = true;
                const button = find('[data-board-refresh]'); button.disabled = true;
                find('[data-board-toolbar]').hidden = true;
                find('[data-board-list]').innerHTML = '';
                find('[data-board-pagination]').innerHTML = '';
                find('[data-board-status]').innerHTML = '<div class="admin-empty"><p>게시판 목록을 불러오는 중입니다.</p></div>';
                const timeout = setTimeout(() => requestController.abort(), 20000);
                try {
                    const response = await fetch('boards-api.php', { credentials: 'same-origin', cache: 'no-store', signal: requestController.signal });
                    if (!active) return;
                    if (response.status === 401) { location.assign('login.php'); return; }
                    const result = await response.json();
                    if (!active) return;
                    if (!response.ok || !result.ok) throw Object.assign(new Error(result.message || '게시판 목록을 불러오지 못했습니다.'), { code: result.code });
                    if (!Array.isArray(result.boards)) throw new Error('게시판 응답 형식을 확인해주세요.');
                    boards = result.boards; if (!preservePage) page = 1;
                    const groups = [...new Map(boards.filter(item => item.groupId).map(item => [item.groupId, item.groupName || item.groupId])).entries()];
                    if (!groups.some(([id]) => id === group)) group = '';
                    find('[data-board-group]').innerHTML = '<option value="">모든 그룹</option>' + groups.map(([id, name]) => `<option value="${escape(id)}" ${group === id ? 'selected' : ''}>${escape(name)}</option>`).join('');
                    find('[data-board-status]').innerHTML = '<p class="admin-board-note">DB 연결 정상 · 실제 게시판 목록</p>';
                    find('[data-board-toolbar]').hidden = false;
                    const resume = window.dugolbiBoardPosts.takeRefreshContext();
                    const resumeBoard = resume && boards.find(item => item.id === resume.board);
                    if (resumeBoard) { this.unmount(); window.dugolbiBoardPosts.mount(root, resumeBoard, () => this.mount(root), resume); return; }
                    display();
                } catch (error) {
                    if (!active) return;
                    const message = error.name === 'AbortError' ? '응답 시간이 길어 조회를 중단했습니다. 다시 불러오기를 눌러주세요.' : error instanceof SyntaxError ? '서버 응답을 확인할 수 없습니다. 업로드된 PHP 파일과 서버 오류 로그를 확인해주세요.' : error.message;
                    find('[data-board-status]').innerHTML = `<div class="admin-empty"><h2>게시판을 불러오지 못했습니다.</h2><p>${escape(message)}</p>${error.code ? `<p>확인 코드: ${escape(error.code)}</p>` : ''}</div>`;
                } finally { clearTimeout(timeout); loading = false; if (active) button.disabled = false; }
            };
            root.addEventListener('click', event => {
                const settings = event.target.closest('[data-board-settings]');
                if (settings) {
                    const selected = boards.find(item => item.id === settings.dataset.boardSettings);
                    if (selected) window.dugolbiBoardSettings.open(selected, result => {
                        if (!active) return;
                        find('[data-board-operation-status]').textContent = result.message;
                        find('[data-board-operation-status]').hidden = false;
                        load(true);
                    });
                    return;
                }
                const posts = event.target.closest('[data-board-posts]');
                if (posts) {
                    const selected = boards.find(item => item.id === posts.dataset.boardPosts);
                    if (selected) { this.unmount(); window.dugolbiBoardPosts.mount(root, selected, () => this.mount(root)); }
                    return;
                }
                if (event.target.closest('[data-board-refresh]')) {
                    // A timed-out request's signal cannot be reused; remount for a fresh request.
                    this.mount(root); return;
                }
                const button = event.target.closest('[data-board-page]');
                if (button && !button.disabled) { page = Number(button.dataset.boardPage); display(); }
            }, { signal: controller.signal });
            root.addEventListener('input', event => { if (event.target.matches('[data-board-search]')) { query = event.target.value; page = 1; display(); } }, { signal: controller.signal });
            root.addEventListener('change', event => { if (event.target.matches('[data-board-group]')) { group = event.target.value; page = 1; display(); } }, { signal: controller.signal });
            load();
        },
    };
})();
