@echo off
setlocal EnableExtensions DisableDelayedExpansion

title NPOLAP my-platform One Click Full Deploy

rem =====================================================
rem  NPOLAP / my-platform One Click Full Deploy
rem  - Builds the project
rem  - Adds ALL project changes with git add -A
rem  - Commits ALL staged changes
rem  - Pushes to GitHub
rem  - Vercel deploy starts automatically after GitHub push
rem =====================================================

set "CHECK_ONLY=0"
if /i "%~1"=="--check" set "CHECK_ONLY=1"

rem [IMPORTANT]
rem If this deploy.bat is inside D:\projects\my-platform, keep PROJECT_DIR empty.
rem If you want to run this file from Desktop, set the exact project path below.
set "PROJECT_DIR=D:\projects\my-platform"

if not "%PROJECT_DIR%"=="" (
    cd /d "%PROJECT_DIR%"
) else (
    cd /d "%~dp0"
)

echo.
echo ==========================================
echo  NPOLAP my-platform Full Deploy
echo ==========================================
echo.
echo Working directory:
echo %cd%
echo.

if not exist ".git" (
    echo [ERROR] This folder is not a Git repository.
    echo Current folder: %cd%
    echo Check PROJECT_DIR in deploy.bat.
    echo Example: D:\projects\my-platform
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
    pause
    exit /b 1
)

if not exist "package.json" (
    echo [ERROR] package.json was not found.
    echo This is not the Next.js project root folder.
    echo Check PROJECT_DIR in deploy.bat.
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
    pause
    exit /b 1
)

where git >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Git was not found.
    echo Install Git or check PATH.
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
    pause
    exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
    echo [ERROR] npm.cmd was not found.
    echo Install Node.js or check PATH.
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
    pause
    exit /b 1
)

for /f "delims=" %%B in ('git branch --show-current 2^>nul') do set "CURRENT_BRANCH=%%B"
if not defined CURRENT_BRANCH (
    echo [ERROR] Could not detect current Git branch.
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
    pause
    exit /b 1
)

git remote get-url origin >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Git remote origin is not configured.
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
    pause
    exit /b 1
)

echo Current branch: %CURRENT_BRANCH%
echo.

echo [1/7] Current Git status before build
echo ------------------------------------------
git status --short
echo ------------------------------------------
echo.

echo [2/7] Install dependency check
echo Command: npm.cmd install
echo.
call npm.cmd install
if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed.
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
    pause
    exit /b 1
)

echo.
echo [3/7] Build check
echo Command: npm.cmd run build
echo.
call npm.cmd run build
if errorlevel 1 (
    echo.
    echo ==========================================
    echo  BUILD FAILED - DEPLOY STOPPED
    echo ==========================================
    echo Fix the build error above before deploying.
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  BUILD PASSED
echo ==========================================
echo.

if "%CHECK_ONLY%"=="1" (
    echo Check mode complete. No git add, commit, or push was run.
    echo.
    exit /b 0
)

echo [4/7] Stage ALL my-platform changes
echo Command: git add -A
echo.
git add -A
if errorlevel 1 (
    echo.
    echo [ERROR] git add -A failed.
    echo.
    pause
    exit /b 1
)

echo [5/7] Staged Git status
echo ------------------------------------------
git status --short
echo ------------------------------------------
echo.

git diff --cached --quiet
if %errorlevel%==0 (
    echo No staged changes found. Push will still run to confirm branch sync.
    echo.
    goto PUSH_ONLY
)

for /f "delims=" %%T in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set "DEPLOY_TIME=%%T"
if not defined DEPLOY_TIME set "DEPLOY_TIME=manual-time"

set "COMMIT_MSG=full deploy my-platform %DEPLOY_TIME%"

echo [6/7] Commit ALL staged changes
echo Commit message: %COMMIT_MSG%
echo.
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo.
    echo [ERROR] git commit failed.
    echo.
    pause
    exit /b 1
)

:PUSH_ONLY
echo [7/7] Push to GitHub
echo Command: git push origin %CURRENT_BRANCH%
echo.
git push origin "%CURRENT_BRANCH%"
if errorlevel 1 (
    echo.
    echo [ERROR] git push failed.
    echo Check internet, GitHub login, remote permission, and branch protection.
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  DEPLOY REQUEST COMPLETE
echo ==========================================
echo GitHub push is complete.
echo Vercel will start deployment automatically.
echo.
echo Site:
echo https://npolap.cloud
echo.

pause
endlocal