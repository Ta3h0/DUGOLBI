(() => {
    'use strict';
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    let destroy = () => {};
    window.dugolbiBoardPosts = {
        unmount() { destroy(); destroy = () => {}; },
        mount(root, board, back) {
            this.unmount();
            const lifecycle = new AbortController();
            let active = true, request = null, revision = 0, page = 1, query = '';
            destroy = () => { active = false; lifecycle.abort(); request?.abort(); };
            const boardUrl = '/board/bbs/board.php?bo_table=' + encodeURIComponent(board.id);
            root.innerHTML = `<div class="admin-page-heading"><div><h1>${escape(board.name || board.id)} 게시글</h1><p>운영 게시판의 게시글 목록을 확인하세요.</p></div><div class="admin-heading-actions"><button type="button" class="admin-button" data-post-back>게시판 목록</button><button type="button" class="admin-button" data-post-refresh>다시 불러오기</button></div></div>
                <p class="admin-board-note">현재는 조회 전용입니다. ‘원본 보기’는 그누보드 게시판을 새 창으로 열며 비밀글 확인에는 기존 그누보드 권한이 필요합니다.</p>
                <section class="admin-panel admin-list-panel"><div data-post-status role="status" aria-live="polite" aria-atomic="true"></div>
                <div class="admin-list-toolbar"><div class="admin-list-summary">게시글 <strong data-post-count>—</strong>개</div><form class="admin-list-controls" data-post-search-form role="search"><label class="admin-search"><input name="q" type="search" maxlength="100" placeholder="제목 검색" aria-label="게시글 제목 검색"></label><button class="admin-button" type="submit">검색</button></form></div>
                <div data-post-list></div><div class="admin-pagination" data-post-pagination aria-label="게시글 목록 페이지"></div></section>`;
            const find = selector => root.querySelector(selector);
            const load = async () => {
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
                    find('[data-post-count]').textContent = result.total.toLocaleString('ko-KR');
                    find('[data-post-status]').innerHTML = `<p class="admin-board-note">실제 게시글 목록 · 조회 전용${query ? ' · 제목 검색 결과' : ''}</p>`;
                    find('[data-post-list]').innerHTML = result.posts.length ? `<div class="admin-table-scroll"><table class="admin-table"><caption class="admin-sr-only">${escape(board.name || board.id)} 게시글 목록</caption><thead><tr>${['제목', '작성자', '작성일', '조회 / 댓글', '확인'].map(label => `<th scope="col">${label}</th>`).join('')}</tr></thead><tbody>${result.posts.map(item => `<tr>
                        <td data-label="제목"><strong>${escape(item.title)}</strong>${item.notice || item.secret || item.reply ? `<small class="admin-cell-sub">${[item.notice && '공지', item.secret && '비밀글', item.reply && '답글'].filter(Boolean).join(' · ')}</small>` : ''}${item.category ? `<small class="admin-cell-sub">${escape(item.category)}</small>` : ''}</td>
                        <td data-label="작성자">${escape(item.author)}</td><td data-label="작성일">${escape(String(item.createdAt).slice(0, 10).replaceAll('-', '.'))}</td>
                        <td data-label="조회 / 댓글">조회 ${Number(item.hits).toLocaleString('ko-KR')}<small class="admin-cell-sub">댓글 ${Number(item.comments).toLocaleString('ko-KR')}</small></td>
                        <td data-label="확인"><a class="admin-button" href="${boardUrl}&amp;wr_id=${encodeURIComponent(item.id)}" target="_blank" rel="noopener noreferrer">원본 보기 ↗</a></td></tr>`).join('')}</tbody></table></div>` : `<div class="admin-empty"><h2>${query ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'}</h2><p>${query ? '검색어를 바꿔 다시 확인해주세요.' : '이 게시판에는 현재 게시글이 없습니다.'}</p></div>`;
                    const count = result.pageCount;
                    const start = Math.max(1, Math.min(page - 2, count - 4));
                    find('[data-post-pagination]').innerHTML = count > 1 ? `<span>${page} / ${count}페이지 · ${result.total}개</span><div><button data-post-page="1" aria-label="첫 페이지" ${page === 1 ? 'disabled' : ''}>«</button><button data-post-page="${page - 1}" aria-label="이전 페이지" ${page === 1 ? 'disabled' : ''}>‹</button>${Array.from({ length: Math.min(5, count) }, (_, i) => start + i).map(i => `<button data-post-page="${i}" ${i === page ? 'class="is-active" aria-current="page"' : ''} aria-label="${i}페이지">${i}</button>`).join('')}<button data-post-page="${page + 1}" aria-label="다음 페이지" ${page === count ? 'disabled' : ''}>›</button><button data-post-page="${count}" aria-label="마지막 페이지" ${page === count ? 'disabled' : ''}>»</button></div>` : result.total ? `<span>${result.total}개 표시</span>` : '';
                } catch (error) {
                    if (!active || current !== revision) return;
                    const message = error.name === 'AbortError' ? '응답 시간이 길어 조회를 중단했습니다. 다시 불러오기를 눌러주세요.' : error instanceof SyntaxError ? '서버 응답을 확인할 수 없습니다. 업로드한 파일과 서버 오류 로그를 확인해주세요.' : error.message;
                    find('[data-post-list]').innerHTML = '';
                    find('[data-post-pagination]').innerHTML = '';
                    find('[data-post-status]').innerHTML = `<div class="admin-empty"><h2>게시글을 불러오지 못했습니다.</h2><p>${escape(message)}</p>${error.code ? `<p>확인 코드: ${escape(error.code)}</p>` : ''}</div>`;
                } finally { clearTimeout(timeout); if (active && current === revision) { refresh.disabled = false; find('[data-post-list]').removeAttribute('aria-busy'); } }
            };
            root.addEventListener('click', event => {
                if (event.target.closest('[data-post-back]')) { back(); return; }
                if (event.target.closest('[data-post-refresh]')) { load(); return; }
                const button = event.target.closest('[data-post-page]');
                if (button && !button.disabled) { page = Number(button.dataset.postPage); load(); }
            }, { signal: lifecycle.signal });
            root.addEventListener('submit', event => {
                if (!event.target.matches('[data-post-search-form]')) return;
                event.preventDefault(); query = find('[name="q"]').value.trim(); page = 1; load();
            }, { signal: lifecycle.signal });
            load();
        },
    };
})();
