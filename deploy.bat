@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "MSG=%~1"
if "%MSG%"=="" set "MSG=사이트 수정"

set "WINSCP=C:\Program Files (x86)\WinSCP\WinSCP.com"
if not exist "%WINSCP%" set "WINSCP=C:\Program Files\WinSCP\WinSCP.com"

echo.
echo ========================================
echo       DUGOLBI DEPLOY
echo ========================================
echo.

if not exist "%WINSCP%" (
    echo [ERROR] WinSCP.com을 찾을 수 없습니다.
    pause
    exit /b 1
)

echo [1/5] Git 상태 확인
git status --short
if errorlevel 1 goto ERROR

echo.
echo [2/5] 변경사항 커밋
git add -A
if errorlevel 1 goto ERROR

git diff --cached --quiet
if errorlevel 1 (
    git commit -m "%MSG%"
    if errorlevel 1 goto ERROR
) else (
    echo 커밋할 변경사항이 없습니다.
)

echo.
echo [3/5] GitHub Push
git push origin main
if errorlevel 1 goto ERROR

echo.
echo [4/5] Cafe24 FTP 동기화
"%WINSCP%" /script="%~dp0deploy.txt" /log="%~dp0deploy.log"
if errorlevel 1 goto ERROR

echo.
echo [5/5] 실서버 열기
start "" "https://woc288.mycafe24.com/"

echo.
echo ========================================
echo       DEPLOY COMPLETE
echo ========================================
echo.
echo GitHub Push + Cafe24 업로드 완료
echo 실서버를 브라우저에서 확인하세요.
echo.
pause
exit /b 0

:ERROR
echo.
echo ========================================
echo       DEPLOY FAILED
echo ========================================
echo.
echo 중간 단계에서 오류가 발생했습니다.
echo 이후 단계는 실행하지 않았습니다.
echo.
pause
exit /b 1