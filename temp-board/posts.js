(() => {
    'use strict';
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    let destroy = () => {};
    const REFRESH_KEY = 'dugolbi-admin-post-delete-refresh';
    window.dugolbiBoardPosts = {
        takeRefreshContext() {
            try {
                const value = sessionStorage.getItem(REFRESH_KEY);
                sessionStorage.removeItem(REFRESH_KEY);
                const context = value ? JSON.parse(value) : null;
                return context && typeof context.board === 'string' && /^[A-Za-z0-9_]{1,20}$/.test(context.board)
                    && Number.isInteger(context.page) && context.page > 0 && context.page < 1000000000
                    && typeof context.query === 'string' && context.query.length <= 100
                    && typeof context.notice === 'string' && context.notice.length <= 5000 ? context : null;
            } catch { return null; }
        },
        unmount() { destroy(); destroy = () => {}; window.dugolbiPostEditor?.dispose(); },
        mount(root, board, back, resume = null) {
            this.unmount();
            const lifecycle = new AbortController();
            let active = true, request = null, revision = 0, page = resume?.page || 1, query = resume?.query || '', visiblePosts = [], mutationBusy = false, listLoading = false;
            const selected = new Set();
            destroy = () => { active = false; lifecycle.abort(); request?.abort(); };
            const boardUrl = '/board/bbs/board.php?bo_table=' + encodeURIComponent(board.id);
            root.innerHTML = `<div class="admin-page-heading"><div><h1>${escape(board.name || board.id)} 게시글</h1><p>운영 게시판의 게시글을 관리하세요.</p></div><div class="admin-heading-actions"><button type="button" class="admin-button" data-post-back>게시판 목록</button><button type="button" class="admin-button" data-post-refresh>다시 불러오기</button><button type="button" class="admin-button admin-primary" data-post-new>게시글 작성</button></div></div>
                <p class="admin-board-note">저장·삭제하면 운영 게시판에 반영됩니다. ‘원본 보기’는 그누보드 게시판을 새 창으로 엽니다.</p><p class="admin-board-note" data-post-operation-status role="status" hidden></p>
                <section class="admin-panel admin-list-panel"><div data-post-status role="status" aria-live="polite" aria-atomic="true"></div>
                <div class="admin-list-toolbar"><div class="admin-list-summary">게시글 <strong data-post-count>—</strong>개</div><form class="admin-list-controls" data-post-search-form role="search"><label class="admin-search"><input name="q" type="search" maxlength="100" placeholder="제목 검색" aria-label="게시글 제목 검색"></label><button class="admin-button" type="submit">검색</button></form></div>
                <div class="admin-post-bulk-actions"><label class="admin-check"><input type="checkbox" data-post-select-all disabled><span>현재 페이지 전체 선택</span></label><span data-post-selected-count role="status" aria-live="polite" aria-atomic="true">선택 0개</span><button type="button" class="admin-button admin-danger" data-post-bulk-delete disabled>선택 삭제</button></div>
                <div data-post-list></div><div class="admin-pagination" data-post-pagination aria-label="게시글 목록 페이지"></div></section>`;
            const find = selector => root.querySelector(selector);
            find('[name="q"]').value = query;
            if (resume?.notice) { find('[data-post-operation-status]').textContent = resume.notice; find('[data-post-operation-status]').hidden = false; }
            const updateSelection = () => {
                const ids = visiblePosts.map(item => item.id);
                const all = find('[data-post-select-all]');
                all.checked = ids.length > 0 && ids.every(id => selected.has(id));
                all.indeterminate = selected.size > 0 && !all.checked;
                all.disabled = !ids.length || listLoading || mutationBusy;
                find('[data-post-selected-count]').textContent = `선택 ${selected.size}개`;
                find('[data-post-bulk-delete]').disabled = !selected.size || listLoading || mutationBusy;
                root.querySelectorAll('[data-post-select]').forEach(input => { input.checked = selected.has(Number(input.dataset.postSelect)); input.disabled = listLoading || mutationBusy; });
                root.querySelectorAll('[data-post-page], [data-post-edit], [data-post-delete]').forEach(control => { control.disabled = mutationBusy || listLoading || control.dataset.atBoundary === 'true'; });
                root.querySelectorAll('[data-post-back], [data-post-new], [data-post-search-form] button, [name="q"]').forEach(control => { control.disabled = mutationBusy; });
                find('[data-post-refresh]').disabled = listLoading || mutationBusy;
            };
            window.addEventListener('beforeunload', event => { if (mutationBusy) { event.preventDefault(); event.returnValue = ''; } }, { signal: lifecycle.signal });
            const load = async () => {
                selected.clear(); listLoading = true; updateSelection();
                const current = ++revision;
                request?.abort();
                request = new AbortController();
                const currentRequest = request;
                const refresh = find('[data-post-refresh]'); refresh.disabled = true;
                find('[data-post-count]').textContent = '—';
                // Keep row height during page requests so pagination does not jump upward.
                find('[data-post-list]').setAttribute('aria-busy', 'true');
                root.querySelectorAll('[data-post-page]').forEach(button => { button.disabled = true; });
                find('[data-post-status]').innerHTML = '<p class="admin-board-note">게시글 목록을 불러오는 중입니다.</p>';
                const timeout = setTimeout(() => currentRequest.abort(), 20000);
                try {
                    const parameters = new URLSearchParams({ action: 'posts', board: board.id, page: String(page), q: query });
                    const response = await fetch('boards-api.php?' + parameters, { credentials: 'same-origin', cache: 'no-store', signal: currentRequest.signal });
                    if (!active || current !== revision) return;
                    if (response.status === 401) { location.assign('login.php'); return; }
                    const result = await response.json();
                    if (!active || current !== revision) return;
                    if (!response.ok || !result.ok) throw Object.assign(new Error(result.message || '게시글을 불러오지 못했습니다.'), { code: result.code });
                    if (!Array.isArray(result.posts) || result.board?.id !== board.id || !Number.isInteger(result.page) || !Number.isInteger(result.total) || !Number.isInteger(result.pageCount)) throw new Error('게시글 응답 형식을 확인해주세요.');
                    page = result.page;
                    visiblePosts = result.posts;
                    find('[data-post-count]').textContent = result.total.toLocaleString('ko-KR');
                    find('[data-post-status]').innerHTML = `<p class="admin-board-note">실제 게시글 목록${query ? ' · 제목 검색 결과' : ''}</p>`;
                    find('[data-post-list]').innerHTML = result.posts.length ? `<div class="admin-table-scroll"><table class="admin-table"><caption class="admin-sr-only">${escape(board.name || board.id)} 게시글 목록</caption><thead><tr>${['제목', '작성자', '작성일', '조회 / 댓글', '확인'].map(label => `<th scope="col">${label}</th>`).join('')}</tr></thead><tbody>${result.posts.map(item => `<tr>
                        <td data-label="제목"><div class="admin-post-title"><label class="admin-post-pick"><input type="checkbox" data-post-select="${item.id}" aria-label="${escape(item.title)} 선택"></label><div><strong>${escape(item.title)}</strong>${item.notice || item.secret || item.reply ? `<small class="admin-cell-sub">${[item.notice && '공지', item.secret && '비밀글', item.reply && '답글'].filter(Boolean).join(' · ')}</small>` : ''}${item.category ? `<small class="admin-cell-sub">${escape(item.category)}</small>` : ''}</div></div></td>
                        <td data-label="작성자">${escape(item.author)}</td><td data-label="작성일">${escape(String(item.createdAt).slice(0, 10).replaceAll('-', '.'))}</td>
                        <td data-label="조회 / 댓글">조회 ${Number(item.hits).toLocaleString('ko-KR')}<small class="admin-cell-sub">댓글 ${Number(item.comments).toLocaleString('ko-KR')}</small></td>
                        <td data-label="확인"><div class="admin-row-actions"><button class="admin-text-button" type="button" data-post-edit="${item.id}" aria-label="${escape(item.title)} 수정">수정</button><button class="admin-delete-button" type="button" data-post-delete="${item.id}" aria-label="${escape(item.title)} 삭제">삭제</button><a class="admin-text-button" href="${boardUrl}&amp;wr_id=${encodeURIComponent(item.id)}" target="_blank" rel="noopener noreferrer">원본 ↗</a></div></td></tr>`).join('')}</tbody></table></div>` : `<div class="admin-empty"><h2>${query ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'}</h2><p>${query ? '검색어를 바꿔 다시 확인해주세요.' : '이 게시판에는 현재 게시글이 없습니다.'}</p></div>`;
                    const count = result.pageCount;
                    const start = Math.max(1, Math.min(page - 2, count - 4));
                    find('[data-post-pagination]').innerHTML = count > 1 ? `<span>${page} / ${count}페이지 · ${result.total}개</span><div><button data-post-page="1" aria-label="첫 페이지" ${page === 1 ? 'disabled' : ''}>«</button><button data-post-page="${page - 1}" aria-label="이전 페이지" ${page === 1 ? 'disabled' : ''}>‹</button>${Array.from({ length: Math.min(5, count) }, (_, i) => start + i).map(i => `<button data-post-page="${i}" ${i === page ? 'class="is-active" aria-current="page"' : ''} aria-label="${i}페이지">${i}</button>`).join('')}<button data-post-page="${page + 1}" aria-label="다음 페이지" ${page === count ? 'disabled' : ''}>›</button><button data-post-page="${count}" aria-label="마지막 페이지" ${page === count ? 'disabled' : ''}>»</button></div>` : result.total ? `<span>${result.total}개 표시</span>` : '';
                    root.querySelectorAll('[data-post-page]').forEach(button => { button.dataset.atBoundary = String(button.disabled); });
                } catch (error) {
                    if (!active || current !== revision) return;
                    const message = error.name === 'AbortError' ? '응답 시간이 길어 조회를 중단했습니다. 다시 불러오기를 눌러주세요.' : error instanceof SyntaxError ? '서버 응답을 확인할 수 없습니다. 업로드한 파일과 서버 오류 로그를 확인해주세요.' : error.message;
                    find('[data-post-list]').innerHTML = '';
                    visiblePosts = [];
                    find('[data-post-pagination]').innerHTML = '';
                    find('[data-post-status]').innerHTML = `<div class="admin-empty"><h2>게시글을 불러오지 못했습니다.</h2><p>${escape(message)}</p>${error.code ? `<p>확인 코드: ${escape(error.code)}</p>` : ''}</div>`;
                } finally { clearTimeout(timeout); if (active && current === revision) { listLoading = false; find('[data-post-list]').removeAttribute('aria-busy'); updateSelection(); } }
            };
            const refreshAfterDelete = notice => {
                if (!active) return;
                mutationBusy = false;
                try {
                    sessionStorage.setItem(REFRESH_KEY, JSON.stringify({ board: board.id, page, query, notice: notice.slice(0, 5000) }));
                    location.reload();
                } catch {
                    // Preserve the current board even if per-tab storage is blocked.
                    find('[data-post-operation-status]').textContent = notice;
                    find('[data-post-operation-status]').hidden = false;
                    load();
                }
            };
            const onSaved = result => {
                if (!active) return;
                if (result.action === 'delete') { refreshAfterDelete('게시글을 삭제했습니다.' + (result.warning ? ' ' + result.warning : '')); return; }
                const notice = find('[data-post-operation-status]');
                notice.textContent = (result.action === 'delete' ? '게시글을 삭제했습니다.' : '게시글을 저장했습니다.') + (result.warning ? ' ' + result.warning : ''); notice.hidden = false;
                if (result.action !== 'delete') { page = 1; query = ''; find('[name="q"]').value = ''; }
                load();
            };
            root.addEventListener('click', event => {
                if (event.target.closest('[data-post-bulk-delete]')) {
                    if (mutationBusy || listLoading || !selected.size) return;
                    const items = visiblePosts.filter(item => selected.has(item.id));
                    mutationBusy = true; updateSelection();
                    window.dugolbiPostEditor.removeMany(board, items, outcome => {
                        const failures = outcome.failed.map(item => `#${item.id}: ${item.message}`).join(' / ');
                        const uncertain = outcome.failed.filter(item => item.uncertain).length;
                        refreshAfterDelete(`삭제 완료 ${outcome.deleted}개 · 실패 ${outcome.failed.length - uncertain}개${uncertain ? ` · 결과 확인 필요 ${uncertain}개` : ''}${outcome.skipped ? ` · 미처리 ${outcome.skipped}개` : ''}${failures ? ' — ' + failures : ''}`);
                    }, (index, total) => {
                        const notice = find('[data-post-operation-status]'); notice.textContent = `선택한 게시글 삭제 중… ${index} / ${total}`; notice.hidden = false;
                    }, () => active).finally(() => { mutationBusy = false; if (active) updateSelection(); });
                    return;
                }
                if (event.target.closest('[data-post-new]')) { if (!mutationBusy) window.dugolbiPostEditor.open(board, 0, onSaved); return; }
                const edit = event.target.closest('[data-post-edit]');
                if (edit) { if (!mutationBusy) window.dugolbiPostEditor.open(board, Number(edit.dataset.postEdit), onSaved); return; }
                const remove = event.target.closest('[data-post-delete]');
                if (remove && !mutationBusy) {
                    const item = visiblePosts.find(post => post.id === Number(remove.dataset.postDelete));
                    if (!item) return;
                    mutationBusy = true; updateSelection();
                    window.dugolbiPostEditor.remove(board, item.id, item.title, onSaved, message => {
                        if (active) { const notice = find('[data-post-operation-status]'); notice.textContent = message; notice.hidden = false; }
                    }, () => active).finally(() => { mutationBusy = false; if (active) updateSelection(); });
                    return;
                }
                if (event.target.closest('[data-post-back]')) { back(); return; }
                if (event.target.closest('[data-post-refresh]')) { load(); return; }
                const button = event.target.closest('[data-post-page]');
                if (button && !button.disabled) { page = Number(button.dataset.postPage); load(); }
            }, { signal: lifecycle.signal });
            root.addEventListener('submit', event => {
                if (!event.target.matches('[data-post-search-form]')) return;
                event.preventDefault(); if (mutationBusy) return; query = find('[name="q"]').value.trim(); page = 1; load();
            }, { signal: lifecycle.signal });
            root.addEventListener('change', event => {
                if (mutationBusy || listLoading) return;
                if (event.target.matches('[data-post-select-all]')) {
                    selected.clear(); if (event.target.checked) visiblePosts.forEach(item => selected.add(item.id)); updateSelection();
                } else if (event.target.matches('[data-post-select]')) {
                    const id = Number(event.target.dataset.postSelect);
                    if (visiblePosts.some(item => item.id === id)) { if (event.target.checked) selected.add(id); else selected.delete(id); updateSelection(); }
                }
            }, { signal: lifecycle.signal });
            load();
        },
    };
})();
