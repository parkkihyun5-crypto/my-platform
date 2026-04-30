@echo off
cd /d %~dp0

echo ===============================
echo  Git 자동 배포 시작
echo ===============================

echo.
echo 변경 파일 추가 중...
git add .

echo.
set /p msg=커밋 메시지를 입력하세요: 

echo.
echo 커밋 생성 중...
git commit -m "%msg%"

echo.
echo GitHub 업로드 중...
git push origin main

echo.
echo ===============================
echo  배포 완료 (Vercel 자동 진행중)
echo ===============================

pause