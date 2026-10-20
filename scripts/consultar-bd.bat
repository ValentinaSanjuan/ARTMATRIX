@echo off
REM Muestra las tablas y cuantos registros tiene cada una (usuario de la aplicacion)
set MYSQL=
for /d %%D in ("C:\Program Files\MySQL\MySQL Server*") do if exist "%%D\bin\mysql.exe" set "MYSQL=%%D\bin\mysql.exe"
"%MYSQL%" -u artmatrix -partmatrix artmatrix -e "SELECT table_name, table_rows FROM information_schema.tables WHERE table_schema='artmatrix' ORDER BY table_name; SELECT version, description, success FROM flyway_schema_history; SELECT id_nivel, nombre FROM nivel; SELECT COUNT(*) AS estudiantes FROM estudiante; SELECT COUNT(*) AS intentos FROM intento_desafio;" > "%~dp0..\consulta-bd.log" 2>&1
