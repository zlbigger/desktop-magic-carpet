@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Install Node.js LTS from https://nodejs.org/ first.
 pause
 exit /b 1
)
if not exist node_modules\electron\dist\electron.exe call npm ci
call npm start
