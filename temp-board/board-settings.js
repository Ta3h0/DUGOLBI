(() => {
    'use strict';
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    let dispose = () => {};
    window.dugolbiBoardSettings = {
        dispose() { dispose(); dispose = () => {}; },
        async open(board, onSaved) {
            this.dispose();
            let active = true, dirty = false, busy = false, meta;
            const controller = new AbortController();
            const dialog = document.createElement('dialog');
            dialog.className = 'admin-editor admin-board-settings';
            dialog.setAttribute('aria-labelledby', 'admin-board-settings-title');
            dialog.innerHTML = `<form><div class="admin-editor-head"><div><h2 id="admin-board-settings-title">게시판 설정</h2><p>${escape(board.name)} · ${escape(board.id)}</p></div><button type="button" class="admin-icon-button" data-settings-close aria-label="설정 닫기">×</button></div><div class="admin-editor-body"><p role="status">설정을 불러오는 중입니다.</p></div><p class="admin-form-error" role="alert" hidden></p><div class="admin-editor-foot"><span>운영 게시판에 저장</span><div><button type="button" class="admin-button" data-settings-close>취소</button><button type="submit" class="admin-button admin-primary" disabled>저장하기</button></div></div></form>`;
            const form = dialog.querySelector('form'), body = dialog.querySelector('.admin-editor-body'), error = dialog.querySelector('[role="alert"]'), save = dialog.querySelector('[type="submit"]');
            const unload = event => { if (busy || dirty) { event.preventDefault(); event.returnValue = ''; } };
            window.addEventListener('beforeunload', unload);
            dispose = () => { active = false; controller.abort(); window.removeEventListener('beforeunload', unload); dialog.close(); dialog.remove(); };
            const close = () => { if (!busy && (!dirty || window.confirm('저장하지 않은 설정을 취소하고 닫을까요?'))) this.dispose(); };
            dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
            dialog.addEventListener('click', event => { if (event.target.closest('[data-settings-close]')) close(); });
            form.addEventListener('input', () => { dirty = true; if (!save.dataset.locked) error.hidden = true; });
            document.body.append(dialog); dialog.showModal();
            const timeout = setTimeout(() => controller.abort(), 20000);
            try {
                const response = await fetch('board-settings.php?' + new URLSearchParams({ board: board.id }), { credentials: 'same-origin', cache: 'no-store', signal: controller.signal });
                if (response.status === 401) { location.assign('login.php'); return; }
                meta = await response.json();
                if (!active) return;
                if (!response.ok || !meta.ok) throw new Error(meta.message || '설정을 불러오지 못했습니다.');
                if (meta.board?.id !== board.id || !meta.board.settings || typeof meta.csrfToken !== 'string' || typeof meta.saveToken !== 'string') throw new Error('설정 응답을 확인해주세요.');
                const item = meta.board.settings;
                const number = (name, label, min, max, hint = '') => `<div class="admin-field"><label for="board-${name}">${label}</label><input id="board-${name}" type="number" name="${name}" value="${escape(item[name])}" min="${min}" max="${max}" step="1" required>${hint ? `<small class="admin-field-hint">${hint}</small>` : ''}</div>`;
                const level = (name, label) => `<div class="admin-field"><label for="board-${name}">${label}</label><select id="board-${name}" name="${name}">${Array.from({ length: 11 }, (_, i) => `<option value="${i}" ${i === Number(item[name]) ? 'selected' : ''}>${i <= 1 ? i + ' · 비회원 포함' : i === 2 ? '2 · 일반 회원 이상' : i === 10 ? '10 · 최고관리자' : i + ' · 회원 레벨 이상'}</option>`).join('')}</select></div>`;
                body.innerHTML = `<div class="admin-form-grid">
                    <div class="admin-field"><label for="board-name">게시판 이름 <span class="admin-required">필수</span></label><input id="board-name" name="name" value="${escape(item.name)}" required></div>
                    <div class="admin-field"><label for="board-mobileName">모바일 게시판 이름</label><input id="board-mobileName" name="mobileName" value="${escape(item.mobileName)}"><small class="admin-field-hint">비워두면 게시판 이름을 사용합니다.</small></div>
                    <div class="admin-field is-wide"><label class="admin-check"><input type="checkbox" name="categoryEnabled" ${item.categoryEnabled ? 'checked' : ''}>카테고리 사용</label><label for="board-categoryList">카테고리 목록</label><input id="board-categoryList" name="categoryList" value="${escape(item.categoryList)}"><small class="admin-field-hint">| 기호로 구분합니다. 예: 교육 안내|행사 안내 · 기존 글의 분류는 바뀌지 않습니다.</small></div>
                    ${level('listLevel', '목록 보기 권한')}${level('readLevel', '게시글 읽기 권한')}${level('writeLevel', '게시글 작성 권한')}
                    <div class="admin-field"><label>권한 적용 안내</label><p class="admin-field-hint">운영 게시판 방문자의 접근 권한에 적용됩니다. 현재 관리자 계정은 최고관리자 권한으로 관리합니다.</p></div>
                    ${number('uploadCount', '첨부파일 최대 개수', 0, 100, '게시글당 최대 개수입니다. 0이면 새 첨부를 받지 않습니다. 기존 첨부파일은 유지됩니다.')}
                    <div class="admin-field"><label for="board-uploadBytes">파일당 최대 용량 (MB)</label><input id="board-uploadBytes" type="number" name="uploadBytes" value="${Number(item.uploadBytes) / 1048576}" min="0" max="${2147483647 / 1048576}" step="any" required><small class="admin-field-hint">서버의 업로드 허용 용량도 함께 적용됩니다. 0이면 일반 회원의 파일 첨부를 제한합니다.</small></div>
                    ${number('pageRows', 'PC 페이지당 게시글 수', 1, 1000)}${number('mobilePageRows', '모바일 페이지당 게시글 수', 1, 1000)}
                </div>`;
                save.disabled = false;
                body.querySelector('#board-name').focus();
            } catch (failure) {
                if (active) { body.textContent = '설정을 불러오지 못했습니다. 닫은 뒤 다시 열어주세요.'; error.textContent = failure.name === 'AbortError' ? '응답 시간이 길어 조회를 중단했습니다.' : failure instanceof SyntaxError ? '서버 응답을 확인할 수 없습니다.' : failure.message; error.hidden = false; }
            } finally { clearTimeout(timeout); }
            form.addEventListener('submit', async event => {
                event.preventDefault();
                if (!meta || busy || save.disabled || !form.reportValidity()) return;
                const data = new FormData(form);
                data.set('uploadBytes', String(Math.round(Number(form.elements.uploadBytes.value) * 1048576)));
                data.set('categoryEnabled', form.elements.categoryEnabled.checked ? '1' : '0');
                data.set('board', board.id); data.set('csrf_token', meta.csrfToken); data.set('operation_token', meta.saveToken);
                busy = true; error.hidden = true; save.textContent = '저장 중…';
                const controls = [...form.querySelectorAll('input, select, button')]; controls.forEach(control => { control.disabled = true; });
                try {
                    // Do not abort or automatically retry a submitted mutation.
                    const response = await fetch('board-settings.php', { method: 'POST', body: data, credentials: 'same-origin', cache: 'no-store' });
                    if (response.status === 401) { location.assign('login.php'); return; }
                    const result = await response.json();
                    if (!response.ok || !result.ok) throw Object.assign(new Error(result.message || '설정 저장에 실패했습니다.'), { code: result.code });
                    if (result.board?.id !== board.id || !result.board.settings) throw new SyntaxError('Unexpected save response');
                    if (!active) return;
                    dirty = false; busy = false; this.dispose(); onSaved(result);
                } catch (failure) {
                    if (!active) return;
                    error.textContent = failure instanceof SyntaxError || failure instanceof TypeError ? '저장 결과를 확인하지 못했습니다. 닫은 뒤 설정을 다시 열어 확인해주세요.' : failure.message;
                    error.hidden = false;
                    if (failure.code !== 'INVALID_FIELDS') save.dataset.locked = 'true';
                } finally {
                    busy = false;
                    if (active) { controls.forEach(control => { control.disabled = false; }); save.disabled = !!save.dataset.locked; save.textContent = '저장하기'; }
                }
            });
        },
    };
})();
