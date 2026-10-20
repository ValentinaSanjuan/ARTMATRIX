@echo off
title ArtMatrix - Frontend (http://localhost:5173)
cd /d "%~dp0apps\web"
if not exist node_modules call npm install
call npm run dev
pause
