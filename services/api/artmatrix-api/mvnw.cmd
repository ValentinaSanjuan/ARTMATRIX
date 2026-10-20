@echo off
@REM ---------------------------------------------------------------------------
@REM Maven Wrapper (Windows) para ArtMatrix.
@REM La primera vez descarga Maven 3.9.9 en %USERPROFILE%\.m2\wrapper y luego lo reutiliza.
@REM Uso:  .\mvnw.cmd spring-boot:run     |    .\mvnw.cmd test
@REM ---------------------------------------------------------------------------
setlocal

set "MAVEN_VERSION=3.9.9"
set "WRAPPER_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%"
set "MAVEN_HOME=%WRAPPER_HOME%\apache-maven-%MAVEN_VERSION%"
set "DIST_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip"

if exist "%MAVEN_HOME%\bin\mvn.cmd" goto run

echo Descargando Maven %MAVEN_VERSION% (solo la primera vez)...
if not exist "%WRAPPER_HOME%" mkdir "%WRAPPER_HOME%"
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop';" ^
  "[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12;" ^
  "$zip=Join-Path $env:WRAPPER_HOME 'maven.zip';" ^
  "Invoke-WebRequest -Uri $env:DIST_URL -OutFile $zip -UseBasicParsing;" ^
  "Expand-Archive -Path $zip -DestinationPath $env:WRAPPER_HOME -Force;" ^
  "Remove-Item $zip"
if errorlevel 1 (
  echo No se pudo descargar Maven. Revisa tu conexion a internet.
  exit /b 1
)

:run
"%MAVEN_HOME%\bin\mvn.cmd" -f "%~dp0pom.xml" %*
exit /b %ERRORLEVEL%
