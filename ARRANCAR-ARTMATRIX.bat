@echo off
title ArtMatrix
set RAIZ=%~dp0
echo Arrancando el backend (http://localhost:8080)...
start "ArtMatrix BACKEND - no cerrar" cmd /k "cd /d "%RAIZ%services\api\artmatrix-api" && call mvnw.cmd spring-boot:run"
echo Arrancando el frontend (http://localhost:5173)...
start "ArtMatrix FRONTEND - no cerrar" cmd /k "cd /d "%RAIZ%apps\web" && (if not exist node_modules call npm install) && call npm run dev"
echo.
echo Esperando a que todo arranque (unos 40 segundos)...
timeout /t 40 /nobreak >nul
start "" http://localhost:5173
echo.
echo Listo. Si la pagina no carga, espera un poco y recarga (F5).
echo Deja abiertas las dos ventanas negras mientras usas ArtMatrix.
timeout /t 10 >nul
