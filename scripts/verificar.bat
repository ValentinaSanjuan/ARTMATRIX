@echo off
REM Compila y prueba todo el proyecto; deja el resultado en verificacion.log
setlocal
set RAIZ=%~dp0..
set LOG=%RAIZ%\verificacion.log
echo ===== ArtMatrix - verificacion %date% %time% ===== > "%LOG%"
echo --- Versiones --- >> "%LOG%"
java -version >> "%LOG%" 2>&1
node -v >> "%LOG%" 2>&1
call npm -v >> "%LOG%" 2>&1

echo --- Fondos --- >> "%LOG%"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0copiar-imagenes.ps1" >> "%LOG%" 2>&1

echo --- Backend: mvnw test --- >> "%LOG%"
pushd "%RAIZ%\services\api\artmatrix-api"
call mvnw.cmd -q -B test >> "%LOG%" 2>&1
echo BACKEND_EXIT=%ERRORLEVEL% >> "%LOG%"
popd

echo --- Frontend: npm install --- >> "%LOG%"
pushd "%RAIZ%\apps\web"
call npm install --no-audit --no-fund >> "%LOG%" 2>&1
echo NPM_INSTALL_EXIT=%ERRORLEVEL% >> "%LOG%"
echo --- Frontend: interprete --- >> "%LOG%"
call npm run test:interprete >> "%LOG%" 2>&1
echo INTERPRETE_EXIT=%ERRORLEVEL% >> "%LOG%"
echo --- Frontend: build --- >> "%LOG%"
call npm run build >> "%LOG%" 2>&1
echo BUILD_EXIT=%ERRORLEVEL% >> "%LOG%"
popd
echo ===== FIN ===== >> "%LOG%"
