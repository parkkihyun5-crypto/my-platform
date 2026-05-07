@echo off
setlocal EnableExtensions DisableDelayedExpansion

title NPOLAP One Click Build and Deploy

set "CHECK_ONLY=0"
if /i "%~1"=="--check" set "CHECK_ONLY=1"

echo.
echo ==========================================
echo  NPOLAP One Click Build and Deploy
echo ==========================================
echo.

cd /d "%~dp0"

echo Working directory:
echo %cd%
echo.

if not exist ".git" (
    echo [ERROR] This folder is not a Git repository.
    echo Place deploy.bat in the project root folder.
    echo Example: D:\projects\my-platform\deploy.bat
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
    pause
    exit /b 1
)

if not exist "package.json" (
    echo [ERROR] package.json was not found.
    echo Place deploy.bat in the Next.js project root folder.
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
    pause
    exit /b 1
)

where git >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Git was not found.
    echo Check Git installation and PATH.
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
    pause
    exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
    echo [ERROR] npm.cmd was not found.
    echo Check Node.js installation and PATH.
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
    echo [ERROR] Git remote "origin" is not configured.
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
    pause
    exit /b 1
)

echo Current branch: %CURRENT_BRANCH%
echo.

echo [1/6] Current Git status
echo ------------------------------------------
git status --short
echo ------------------------------------------
echo.

echo [2/6] Build check
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
    echo Check mode: build passed. No git add, commit, or push was run.
    echo.
    exit /b 0
)

echo [3/6] Stage all changes
echo Command: git add -A
echo.

git add -A
if errorlevel 1 (
    echo.
    echo [ERROR] git add failed.
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
    pause
    exit /b 1
)

echo [4/6] Staged Git status
echo ------------------------------------------
git status --short
echo ------------------------------------------
echo.

git diff --cached --quiet
if %errorlevel%==0 (
    echo No new staged changes. Pushing current branch anyway.
    echo.
    goto PUSH_ONLY
)

for /f "delims=" %%T in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set "DEPLOY_TIME=%%T"
if not defined DEPLOY_TIME set "DEPLOY_TIME=%DATE%_%TIME%"

set "COMMIT_MSG=auto deploy %DEPLOY_TIME%"

echo [5/6] Commit
echo Commit message: %COMMIT_MSG%
echo.

git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo.
    echo [ERROR] git commit failed.
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
    pause
    exit /b 1
)

:PUSH_ONLY
echo [6/6] Push to GitHub
echo Command: git push origin %CURRENT_BRANCH%
echo.

git push origin "%CURRENT_BRANCH%"
if errorlevel 1 (
    echo.
    echo [ERROR] git push failed.
    echo Check internet, GitHub login, remote permission, and branch protection.
    echo.
    if "%CHECK_ONLY%"=="1" exit /b 1
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
