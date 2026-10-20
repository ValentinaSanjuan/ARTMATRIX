@echo off
title ArtMatrix - Backend (http://localhost:8080)
cd /d "%~dp0services\api\artmatrix-api"
call mvnw.cmd spring-boot:run
pause
