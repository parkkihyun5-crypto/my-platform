@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

title NPOLAP 자동 배포 도구

echo.
echo ==========================================
echo  NPOLAP Git 자동 배포 실행
echo ==========================================
echo.

REM 현재 배치파일이 있는 위치로 이동
cd /d "%~dp0"

echo 현재 작업 폴더:
echo %cd%
echo.

REM Git 저장소 여부 확인
if not exist ".git" (
    echo [오류] 현재 폴더는 Git 저장소가 아닙니다.
    echo.
    echo 이 파일은 반드시 프로젝트 루트 폴더에 있어야 합니다.
    echo 예시:
    echo D:\projects\my-platform\deploy.bat
    echo.
    pause
    exit /b
)

echo [1단계] 변경된 파일 확인 중...
echo.

git status --short

echo.
echo [2단계] 변경 파일 추가 중...
git add .

if errorlevel 1 (
    echo.
    echo [오류] git add 실행 중 문제가 발생했습니다.
    pause
    exit /b
)

echo.
echo [3단계] 커밋 메시지 생성 중...

set COMMIT_MSG=자동 배포 업데이트

echo.
echo 커밋 메시지:
echo %COMMIT_MSG%
echo.

git diff --cached --quiet

if %errorlevel%==0 (
    echo [안내] 커밋할 변경사항이 없습니다.
    echo.
    echo GitHub에 이미 최신 상태일 수 있습니다.
    echo.
) else (
    echo [4단계] Git 커밋 실행 중...
    git commit -m "%COMMIT_MSG%"

    if errorlevel 1 (
        echo.
        echo [오류] Git 커밋 중 문제가 발생했습니다.
        pause
        exit /b
    )

    echo.
    echo [5단계] GitHub로 업로드 중...
    git push

    if errorlevel 1 (
        echo.
        echo [오류] GitHub 업로드 중 문제가 발생했습니다.
        echo.
        echo 아래 내용을 확인하세요.
        echo 1. GitHub 로그인 상태
        echo 2. 원격 저장소 연결 상태
        echo 3. 인터넷 연결 상태
        echo 4. 브랜치 이름 main 또는 master 여부
        echo.
        pause
        exit /b
    )
)

echo.
echo ==========================================
echo  배포 요청 완료
echo ==========================================
echo.
echo GitHub 업로드가 완료되었습니다.
echo Vercel은 GitHub 변경사항을 감지한 뒤 자동 배포를 시작합니다.
echo.
echo Vercel 대시보드에서 배포 진행 상태를 확인하세요.
echo.

pause
endlocal