(() => {
    'use strict';
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    let dispose = () => {};
    window.dugolbiBoardLifecycle = {
        dispose() { dispose(); dispose = () => {}; },
        create(onSaved) { return this.open('create', null, onSaved); },
        remove(board, onSaved) { return this.open('delete', board, onSaved); },
        async open(action, board, onSaved) {
            this.dispose(); window.dugolbiBoardSettings?.dispose();
            const removing = action === 'delete', controller = new AbortController();
            let active = true, busy = false, dirty = false, meta;
            const dialog = document.createElement('dialog'); dialog.className = 'admin-editor admin-board-settings admin-board-lifecycle';
            dialog.setAttribute('aria-labelledby', 'admin-board-lifecycle-title');
            dialog.innerHTML = `<form><div class="admin-editor-head"><div><h2 id="admin-board-lifecycle-title">게시판 ${removing ? '삭제' : '추가'}</h2><p>${removing ? escape(board.name) + ' · ' + escape(board.id) : '기본 설정을 선택해 빈 게시판을 만듭니다.'}</p></div><button type="button" class="admin-icon-button" data-lifecycle-close aria-label="닫기">×</button></div><div class="admin-editor-body"><p role="status">정보를 불러오는 중입니다.</p></div><p class="admin-form-error" role="alert" hidden></p><div class="admin-editor-foot"><span>운영 게시판에 반영</span><div><button type="button" class="admin-button" data-lifecycle-close>취소</button><button type="submit" class="admin-button ${removing ? 'admin-danger' : 'admin-primary'}" disabled>${removing ? '게시판 삭제' : '게시판 추가'}</button></div></div></form>`;
            const form = dialog.querySelector('form'), body = dialog.querySelector('.admin-editor-body'), error = dialog.querySelector('[role="alert"]'), submit = dialog.querySelector('[type="submit"]');
            const label = removing ? '게시판 삭제' : '게시판 추가';
            const unload = event => { if (busy || dirty) { event.preventDefault(); event.returnValue = ''; } };
            window.addEventListener('beforeunload', unload);
            dispose = () => { active = false; controller.abort(); window.removeEventListener('beforeunload', unload); dialog.close(); dialog.remove(); };
            const close = () => { if (!busy && (removing || !dirty || window.confirm('입력한 내용을 취소하고 닫을까요?'))) this.dispose(); };
            dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
            dialog.addEventListener('click', event => { if (event.target.closest('[data-lifecycle-close]')) close(); });
            form.addEventListener('input', () => {
                dirty = true;
                if (!submit.dataset.locked) { error.hidden = true; if (removing && meta) submit.disabled = form.elements.confirm.value !== board.id; }
            });
            form.addEventListener('change', event => {
                dirty = true;
                if (!removing && event.target.name === 'template') {
                    const selected = meta?.templates.find(item => item.id === event.target.value);
                    if (selected && meta.groups.some(group => group.id === selected.groupId)) form.elements.group.value = selected.groupId;
                }
            });
            document.body.append(dialog); dialog.showModal();
            const timeout = setTimeout(() => controller.abort(), 20000);
            try {
                const response = await fetch('board-action.php?' + new URLSearchParams(removing ? { action: 'delete', board: board.id } : { action: 'options' }), { credentials: 'same-origin', cache: 'no-store', signal: controller.signal });
                if (!active) return;
                if (response.status === 401) { location.assign('login.php'); return; }
                meta = await response.json();
                if (!response.ok || !meta.ok) throw new Error(meta.message || '게시판 정보를 불러오지 못했습니다.');
                if (typeof meta.csrfToken !== 'string' || (removing ? meta.board?.id !== board.id || typeof meta.deleteToken !== 'string' : !Array.isArray(meta.groups) || !Array.isArray(meta.templates) || typeof meta.saveToken !== 'string')) throw new Error('게시판 응답을 확인해주세요.');
                if (removing) {
                    const item = meta.board;
                    body.innerHTML = `<p class="admin-board-note">이 게시판과 모든 게시글·댓글·첨부파일을 영구 삭제합니다. 되돌릴 수 없습니다.</p><div class="admin-form-grid"><div class="admin-field is-wide"><strong>${escape(item.name)}</strong><p class="admin-field-hint">게시글 ${Number(item.posts).toLocaleString('ko-KR')}개 · 댓글 ${Number(item.comments).toLocaleString('ko-KR')}개 · 첨부 ${Number(item.files).toLocaleString('ko-KR')}개</p>${item.linkedPage ? `<p class="admin-field-hint">${escape(item.linkedPage)}에서 사용 중입니다. 삭제하면 해당 페이지의 게시판도 표시되지 않습니다.</p>` : ''}</div><div class="admin-field is-wide"><label for="board-delete-confirm">확인을 위해 게시판 ID ‘${escape(item.id)}’를 입력해주세요.</label><input id="board-delete-confirm" name="confirm" autocomplete="off" spellcheck="false" required></div></div>`;
                    form.elements.confirm.focus();
                } else {
                    body.innerHTML = `<div class="admin-form-grid"><div class="admin-field"><label for="board-create-name">게시판 이름 <span class="admin-required">필수</span></label><input id="board-create-name" name="name" required></div><div class="admin-field"><label for="board-create-id">게시판 ID <span class="admin-required">필수</span></label><input id="board-create-id" name="board" maxlength="20" pattern="[a-z][a-z0-9_]{0,19}" placeholder="예: event" autocomplete="off" spellcheck="false" required><small class="admin-field-hint">소문자로 시작하는 영문 소문자·숫자·_ 조합, 최대 20자.</small></div><div class="admin-field"><label for="board-create-template">기준 설정</label><select id="board-create-template" name="template" required><option value="">선택해주세요</option>${meta.templates.map(item => `<option value="${escape(item.id)}">${escape(item.name)} (${escape(item.id)})</option>`).join('')}</select></div><div class="admin-field"><label for="board-create-group">게시판 그룹</label><select id="board-create-group" name="group" required><option value="">선택해주세요</option>${meta.groups.map(item => `<option value="${escape(item.id)}">${escape(item.name || item.id)}</option>`).join('')}</select></div><div class="admin-field is-wide"><p class="admin-field-hint">기존 게시판을 선택하면 디자인·권한·첨부 제한을 가져옵니다. 게시글·댓글·첨부파일은 복사하지 않습니다. 기본 게시판은 관리자만 글을 작성하며, 추가 후 설정에서 수정할 수 있습니다.</p><p class="admin-field-hint">홈페이지 메뉴에는 자동으로 추가되지 않습니다.</p></div></div>`;
                    if (!meta.groups.length || !meta.templates.length) throw new Error('그누보드에 기준 게시판과 게시판 그룹을 먼저 등록해주세요.');
                    const initial = meta.templates.find(item => item.id === 'notice') || meta.templates[0];
                    form.elements.template.value = initial.id;
                    form.elements.group.value = meta.groups.some(group => group.id === initial.groupId) ? initial.groupId : meta.groups[0].id;
                    submit.disabled = false; form.elements.name.focus();
                }
            } catch (failure) {
                if (active) { error.textContent = failure.name === 'AbortError' ? '응답 시간이 길어 조회를 중단했습니다. 닫은 뒤 다시 열어주세요.' : failure instanceof SyntaxError ? '서버 응답을 확인할 수 없습니다.' : failure.message; error.hidden = false; }
            } finally { clearTimeout(timeout); }
            form.addEventListener('submit', async event => {
                event.preventDefault();
                if (!meta || busy || submit.disabled || !form.reportValidity()) return;
                if (removing && form.elements.confirm.value !== board.id) return;
                const data = new FormData(form); data.set('action', action); data.set('csrf_token', meta.csrfToken); data.set('operation_token', removing ? meta.deleteToken : meta.saveToken);
                if (removing) data.set('board', board.id);
                const requestedId = data.get('board');
                busy = true; error.hidden = true; submit.textContent = removing ? '삭제 중…' : '추가 중…';
                const controls = [...form.querySelectorAll('input, select, button')]; controls.forEach(control => { control.disabled = true; });
                try {
                    const response = await fetch('board-action.php', { method: 'POST', body: data, credentials: 'same-origin', cache: 'no-store' });
                    if (!active) return;
                    if (response.status === 401) { location.assign('login.php'); return; }
                    const result = await response.json();
                    if (!response.ok || !result.ok) throw Object.assign(new Error(result.message || '게시판 처리에 실패했습니다.'), { code: result.code });
                    if (result.board?.id !== requestedId) throw new SyntaxError('Unexpected board result');
                    busy = false; dirty = false; this.dispose(); onSaved(result);
                } catch (failure) {
                    if (!active) return;
                    error.textContent = failure instanceof SyntaxError || failure instanceof TypeError ? '처리 결과를 확인하지 못했습니다. 다시 요청하지 말고 게시판 목록을 먼저 확인해주세요.' : failure.message;
                    error.hidden = false;
                    if (!['INVALID_FIELDS', 'BOARD_EXISTS'].includes(failure.code)) submit.dataset.locked = 'true';
                } finally {
                    busy = false;
                    if (active) { controls.forEach(control => { control.disabled = false; }); submit.disabled = !!submit.dataset.locked || (removing && form.elements.confirm.value !== board.id); submit.textContent = label; }
                }
            });
        },
    };
})();
