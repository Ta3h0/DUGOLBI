(() => {
    'use strict';
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const accept = '.jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.zip,.docx,.xlsx,.pptx,.mp4,.webm';
    const safeImage = value => { try { const url = new URL(value, location.href); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };
    let dispose = () => {};
    const confirmations = new Set();
    const request = async (board, id) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        try {
            const response = await fetch('post-action.php?' + new URLSearchParams({ board, id: String(id) }), { credentials: 'same-origin', cache: 'no-store', signal: controller.signal });
            if (response.status === 401) { location.assign('login.php'); throw Object.assign(new Error('로그인이 필요합니다.'), { code: 'LOGIN_REQUIRED' }); }
            const result = await response.json();
            if (!response.ok || !result.ok) throw new Error(result.message || '편집 정보를 불러오지 못했습니다.');
            if (result.board?.id !== board || result.post?.id !== id) throw new Error('게시글 정보를 확인해주세요.');
            return result;
        } catch (failure) {
            if (failure.name === 'AbortError') throw Object.assign(new Error('편집 정보 응답이 늦어 조회를 중단했습니다. 다시 시도해주세요.'), { name: 'AbortError' });
            throw failure;
        } finally { clearTimeout(timeout); }
    };
    const send = async data => {
        const response = await fetch('post-action.php', { method: 'POST', body: data, credentials: 'same-origin', cache: 'no-store' });
        if (response.status === 401) { location.assign('login.php'); throw Object.assign(new Error('로그인이 필요합니다.'), { code: 'LOGIN_REQUIRED' }); }
        const result = await response.json();
        if (!response.ok || !result.ok) throw Object.assign(new Error(result.message || '처리에 실패했습니다.'), { code: result.code });
        return result;
    };
    const confirm = (title, message, label) => new Promise(resolve => {
        const dialog = document.createElement('dialog'); dialog.className = 'admin-confirm admin-post-confirm';
        dialog.setAttribute('aria-labelledby', 'admin-post-confirm-title');
        dialog.innerHTML = `<form method="dialog"><h2 id="admin-post-confirm-title">${escape(title)}</h2><p>${escape(message)}</p><div class="admin-confirm-actions"><button class="admin-button" value="cancel">취소</button><button class="admin-button admin-danger" value="confirm">${escape(label)}</button></div></form>`;
        confirmations.add(dialog);
        document.body.append(dialog); dialog.addEventListener('close', () => { const value = dialog.returnValue === 'confirm'; confirmations.delete(dialog); dialog.remove(); resolve(value); }, { once: true }); dialog.showModal();
    });
    window.dugolbiPostEditor = {
        dispose() { confirmations.forEach(dialog => dialog.close('cancel')); dispose(); dispose = () => {}; },
        async open(board, id, onSaved) {
            this.dispose();
            let active = true, dirty = false, busy = false;
            const blobs = new Set();
            const dialog = document.createElement('dialog'); dialog.className = 'admin-editor admin-post-editor'; dialog.id = 'admin-post-editor'; dialog.setAttribute('aria-labelledby', 'admin-post-editor-title');
            dialog.innerHTML = `<form><div class="admin-editor-head"><div><h2 id="admin-post-editor-title">게시글 ${id ? '수정' : '작성'}</h2><p>${escape(board.name || board.id)}</p></div><button type="button" class="admin-icon-button" data-post-close aria-label="편집 닫기">×</button></div><div class="admin-editor-body"><p role="status">편집 정보를 불러오는 중입니다.</p></div><p class="admin-form-error" role="alert" hidden></p><div class="admin-editor-foot"><span>운영 게시판에 저장</span><div><button type="button" class="admin-button" data-post-close>취소</button><button type="submit" class="admin-button admin-primary" disabled>저장하기</button></div></div></form>`;
            const form = dialog.querySelector('form'), error = dialog.querySelector('[role="alert"]'), body = dialog.querySelector('.admin-editor-body'), save = form.querySelector('[type="submit"]');
            const unload = event => { if (busy || dirty) { event.preventDefault(); event.returnValue = ''; } };
            window.addEventListener('beforeunload', unload);
            dispose = () => { active = false; window.removeEventListener('beforeunload', unload); blobs.forEach(url => URL.revokeObjectURL(url)); dialog.close(); dialog.remove(); };
            const close = async () => { if (busy) return; if (!dirty || await confirm('편집을 닫을까요?', '저장하지 않은 본문과 선택한 첨부파일은 사라집니다.', '닫기')) this.dispose(); };
            dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
            dialog.addEventListener('click', event => { if (event.target.closest('[data-post-close]')) close(); });
            form.addEventListener('input', () => { dirty = true; if (!save.dataset.locked) error.hidden = true; });
            document.body.append(dialog); dialog.showModal();
            let meta;
            try {
                meta = await request(board.id, id);
                if (!active) return;
                const item = meta.post;
                body.innerHTML = `<div class="admin-form-grid">
                    <div class="admin-field is-wide"><label for="post-title">제목 <span class="admin-required">필수</span></label><input id="post-title" name="title" value="${escape(item.title)}" required><small class="admin-field-hint">최대 255바이트</small></div>
                    ${meta.board.categories.length ? `<div class="admin-field"><label for="post-category">분류</label><select id="post-category" name="category" required><option value="">분류 선택</option>${[...new Set([...meta.board.categories, ...(item.category === '공지' ? ['공지'] : [])])].map(value => `<option value="${escape(value)}" ${value === item.category ? 'selected' : ''}>${escape(value)}</option>`).join('')}</select></div>` : ''}
                    <div class="admin-field"><label for="post-format">본문 형식</label><select id="post-format" name="format"><option value="" ${!item.format ? 'selected' : ''}>일반 텍스트</option><option value="html1" ${item.format === 'html1' ? 'selected' : ''}>HTML</option><option value="html2" ${item.format === 'html2' ? 'selected' : ''}>HTML + 자동 줄바꿈</option></select></div>
                    <div class="admin-field is-wide"><label for="post-content">본문 <span class="admin-required">필수</span></label><textarea id="post-content" name="content" rows="14" required>${escape(item.content)}</textarea><small class="admin-field-hint">기존 영상·HTML 코드는 그대로 편집합니다. 이미지는 아래 첨부파일에서 선택할 수 있습니다.</small></div>
                    <div class="admin-field"><label class="admin-check"><input type="checkbox" name="notice" ${item.notice ? 'checked' : ''}><span>공지글</span></label></div><div class="admin-field"><label class="admin-check"><input type="checkbox" name="secret" ${item.secret ? 'checked' : ''}><span>비밀글</span></label></div>
                    ${[1, 2].map(i => `<div class="admin-field"><label for="post-link-${i}">관련 링크 ${i}</label><input id="post-link-${i}" type="url" name="link${i}" value="${escape(item['link' + i])}" placeholder="https://"></div>`).join('')}
                    <div class="admin-field is-wide"><strong>이미지·첨부파일</strong><small class="admin-field-hint">최대 ${meta.upload.count}개 · 파일당 ${(meta.upload.bytes / 1048576).toFixed(1)}MB. 기존 첨부는 선택하지 않으면 유지됩니다.</small></div>
                    ${Array.from({ length: meta.upload.slots }, (_, slot) => {
                        const file = meta.files.find(item => item.slot === slot), preview = file?.preview && safeImage(file.preview);
                        return `<div class="admin-field is-wide admin-post-attachment" data-post-slot="${slot}"><label for="post-file-${slot}">첨부 ${slot + 1}${file ? ' · ' + escape(file.name) : ''}</label>
                            <div class="admin-image-field"><div class="admin-upload-preview" data-post-preview>${preview ? `<img src="${escape(preview)}" alt="첨부 이미지">` : '<span class="admin-image-empty">파일</span>'}</div><div><label class="admin-button admin-upload-label">${file ? '파일 교체' : '파일 선택'}<input type="file" id="post-file-${slot}" name="bf_file[${slot}]" accept="${accept}"></label><small data-post-file-name>${file ? '기존 파일 유지' : '선택한 파일 없음'}</small></div></div>
                            <label for="post-file-description-${slot}">파일 설명</label><input id="post-file-description-${slot}" name="file_descriptions[${slot}]" value="${escape(file?.description || '')}" maxlength="300">
                            ${file ? `<label class="admin-check"><input type="checkbox" name="delete_files[]" value="${slot}"><span>기존 첨부 삭제${file.size ? ' (' + (file.size / 1024).toFixed(0) + 'KB)' : ''}</span></label>` : ''}</div>`;
                    }).join('')}
                    ${!meta.upload.slots ? '<p class="admin-field is-wide admin-field-hint">이 게시판은 첨부파일 사용이 꺼져 있습니다.</p>' : ''}
                </div>`;
                save.disabled = false;
                form.querySelector('[name="title"]').focus();
            } catch (failure) { if (active) { error.textContent = failure.message; error.hidden = false; body.innerHTML = ''; } }
            form.addEventListener('change', event => {
                if (event.target.type !== 'file') return;
                const file = event.target.files[0], row = event.target.closest('[data-post-slot]');
                if (file && file.size > meta.upload.bytes) { event.target.value = ''; row.querySelector('[data-post-file-name]').textContent = '용량 초과로 파일 선택이 취소됐습니다.'; row.querySelector('[data-post-preview]').innerHTML = '<span class="admin-image-empty">파일</span>'; error.textContent = '파일 용량이 게시판 제한을 초과했습니다.'; error.hidden = false; return; }
                dirty = true;
                row.querySelector('[data-post-file-name]').textContent = file ? file.name : '선택한 파일 없음';
                const preview = row.querySelector('[data-post-preview]'); preview.innerHTML = '';
                if (file && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) { const url = URL.createObjectURL(file); blobs.add(url); const img = document.createElement('img'); img.src = url; img.alt = '선택한 이미지'; preview.append(img); }
                else { const placeholder = document.createElement('span'); placeholder.className = 'admin-image-empty'; placeholder.textContent = '파일'; preview.append(placeholder); }
            });
            form.addEventListener('submit', async event => {
                event.preventDefault(); if (!meta || busy || save.disabled) return;
                busy = true; save.disabled = true; save.textContent = '저장 중…'; error.hidden = true;
                form.querySelectorAll('[data-post-close]').forEach(button => { button.disabled = true; });
                const data = new FormData(form);
                data.set('action', 'save'); data.set('board', board.id); data.set('id', String(id)); data.set('csrf_token', meta.csrfToken); data.set('operation_token', meta.saveToken);
                let completed = false;
                try {
                    const result = await send(data); completed = true;
                    if (!active) return;
                    dirty = false; this.dispose(); onSaved(result);
                } catch (failure) {
                    if (!active) return;
                    error.textContent = failure instanceof SyntaxError || failure instanceof TypeError ? '처리 결과를 확인하지 못했습니다. 중복 등록을 피하려면 게시글 목록을 먼저 확인해주세요.' : failure.message;
                    error.hidden = false;
                    if (['CORE_VALIDATION', 'CORE_FAILED', 'CORE_INCOMPLETE', 'CORE_REDIRECT', 'SERVER_ERROR', 'ALREADY_SUBMITTED', 'POST_CHANGED', 'TOKEN_EXPIRED'].includes(failure.code) || failure instanceof SyntaxError || failure instanceof TypeError) save.dataset.locked = 'true';
                } finally { busy = false; if (active) { save.disabled = completed || !!save.dataset.locked; save.textContent = '저장하기'; form.querySelectorAll('[data-post-close]').forEach(button => { button.disabled = false; }); } }
            });
        },
        async remove(board, id, title, onSaved, onError, isActive = () => true) {
            try {
                const meta = await request(board.id, id);
                if (!isActive()) return;
                if (!await confirm('게시글을 삭제할까요?', `‘${title}’과 해당 댓글·첨부파일이 운영 게시판에서 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`, '삭제하기')) return;
                if (!isActive()) return;
                const data = new FormData(); data.set('action', 'delete'); data.set('board', board.id); data.set('id', String(id)); data.set('csrf_token', meta.csrfToken); data.set('operation_token', meta.deleteToken);
                onSaved(await send(data));
            } catch (failure) { onError(failure instanceof SyntaxError || failure instanceof TypeError ? '처리 결과를 확인하지 못했습니다. 게시글 목록을 다시 확인해주세요.' : failure.message); }
        },
        async removeMany(board, items, onComplete, onProgress, isActive = () => true) {
            if (!items.length || items.length > 20 || new Set(items.map(item => item.id)).size !== items.length) return;
            const preview = items.slice(0, 5).map(item => '· ' + item.title).join('\n');
            const more = items.length > 5 ? `\n외 ${items.length - 5}개` : '';
            if (!await confirm(`${items.length}개 게시글을 삭제할까요?`, `${preview}${more}\n\n선택한 글과 해당 댓글·첨부파일이 운영 게시판에서 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`, '선택 삭제')) return;
            if (!isActive()) return;
            const outcome = { deleted: 0, failed: [], skipped: 0 };
            for (let index = 0; index < items.length; index++) {
                if (!isActive()) return;
                const item = items[index];
                onProgress(index + 1, items.length);
                try {
                    // Each item gets its own current snapshot and bound native-core token.
                    const meta = await request(board.id, item.id);
                    if (!isActive()) return;
                    const data = new FormData();
                    data.set('action', 'delete'); data.set('board', board.id); data.set('id', String(item.id));
                    data.set('csrf_token', meta.csrfToken); data.set('operation_token', meta.deleteToken);
                    await send(data);
                    outcome.deleted++;
                } catch (failure) {
                    if (failure.code === 'LOGIN_REQUIRED') return;
                    const uncertain = failure instanceof SyntaxError || failure instanceof TypeError || failure.name === 'AbortError' || ['CORE_FAILED', 'CORE_INCOMPLETE', 'CORE_REDIRECT', 'SERVER_ERROR', 'ALREADY_SUBMITTED'].includes(failure.code);
                    outcome.failed.push({ id: item.id, uncertain, message: uncertain ? '결과를 확인하지 못했습니다. 목록을 확인해주세요.' : failure.message });
                    if (uncertain) { outcome.skipped = items.length - index - 1; break; }
                }
            }
            if (isActive()) onComplete(outcome);
        },
    };
})();
