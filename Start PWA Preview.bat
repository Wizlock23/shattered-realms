@echo off
cd /d "%~dp0"
echo Shattered Realms PWA preview: http://localhost:8080
where py >nul 2>nul && (start http://localhost:8080 & py -m http.server 8080 --directory www & goto :eof)
where python >nul 2>nul && (start http://localhost:8080 & python -m http.server 8080 --directory www & goto :eof)
echo Python was not found. Install Python 3 or use: npx http-server www
pause
