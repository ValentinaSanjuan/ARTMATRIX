@echo off
REM Arranca backend y frontend en segundo plano; la salida queda en backend.log y frontend.log
set RAIZ=%~dp0..
start "ArtMatrix Backend" /min cmd /c "cd /d "%RAIZ%\services\api\artmatrix-api" && mvnw.cmd spring-boot:run > "%RAIZ%\backend.log" 2>&1"
start "ArtMatrix Frontend" /min cmd /c "cd /d "%RAIZ%\apps\web" && npm run dev > "%RAIZ%\frontend.log" 2>&1"
