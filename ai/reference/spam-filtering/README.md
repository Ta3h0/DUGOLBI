# 스팸 필터링 구현 참고 원본

- 보관일: 2026-10-14
- 사용자가 최신 스팸 정리 PHP로 전달한 파일을 그대로 보관.
- 원본 위치: C:/Users/82104/Desktop/spam_cleanup/spam_cleanup.php
- 보관 파일: spam_cleanup.php.txt (PHP 원본 바이트 그대로, 참고용 텍스트 확장자)
- SHA-256: B0210A9DA91AFE3580C029C11D095D348B58018BADE2E416AE61FF1BF4793FDC
- 향후 DUGOLBI 관리자 자체 스팸 필터링 구현의 참고 자료. 현재 서비스에 연결하거나 실행하지 않음.

## 나중에 살펴볼 함수

- 게시판/게시글 테이블 확인: spam_clean_valid_bo_table, spam_clean_get_write_table
- IP 판단과 차단 후보: spam_clean_is_public_ip, spam_clean_prepare_block_ips
- 대역 분석: spam_clean_analyze_subnets
- 제외 게시글/조건: spam_clean_validate_exclude_ids, spam_clean_build_post_condition
- 백업/작업 배치: spam_clean_create_empty_backup_table, spam_clean_run_job_batch
- 복원 충돌/보조 테이블: spam_clean_get_conflict_rows, spam_clean_restore_aux_table

다음 구현 시 원본 본문과 권한 검사, 차단·삭제·백업·복원 동작을 먼저 검토하고 필요한 기능만 현재 관리자 구조에 적용할 것.