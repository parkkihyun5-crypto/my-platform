@echo off
cd /d "%~dp0"

echo.
echo ==============================
echo   my-platform Git deploy
echo ==============================
echo.

set /p msg=Enter commit message: 

echo.
echo [1] git add
git add .

echo.
echo [2] git commit
git commit -m "%msg%"

echo.
echo [3] git push
git push

echo.
echo ==============================
echo   DONE (wait 1~2 min)
echo ==============================
pause