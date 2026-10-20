@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0reducir-imagenes.ps1"
timeout /t 3 >nul
