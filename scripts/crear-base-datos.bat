@echo off
title ArtMatrix - Crear base de datos MySQL
setlocal
set RAIZ=%~dp0..
set LOG=%RAIZ%\bd.log
set MYSQL=
for /d %%D in ("C:\Program Files\MySQL\MySQL Server*") do if exist "%%D\bin\mysql.exe" set "MYSQL=%%D\bin\mysql.exe"
if not defined MYSQL for /f "delims=" %%M in ('where mysql 2^>nul') do set "MYSQL=%%M"
if not defined MYSQL (
  echo No encontre mysql.exe > "%LOG%"
  echo No encontre mysql.exe. & pause & exit /b 1
)
echo Usando %MYSQL% > "%LOG%"
echo.
echo ==========================================================
echo   Escribe la contrasena de root de MySQL y presiona Enter
echo ==========================================================
"%MYSQL%" -u root -p --default-character-set=utf8mb4 < "%RAIZ%\infra\mysql\crear-base-datos.sql"
if errorlevel 1 (
  echo BD_EXIT=1 >> "%LOG%"
  echo.
  echo Hubo un error. Revisa la contrasena e intentalo de nuevo.
  pause
  exit /b 1
)
echo BD_EXIT=0 >> "%LOG%"
echo.
echo Listo: base "artmatrix" y usuario "artmatrix" creados.
timeout /t 4 >nul
