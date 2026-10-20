@echo off
REM Mueve los archivos del esqueleto anterior a la carpeta _para_borrar (puedes borrarla despues)
set RAIZ=%~dp0..
set DEST=%RAIZ%\_para_borrar
if not exist "%DEST%" mkdir "%DEST%"
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\presentation\dto\LoginRequest.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\presentation\dto\LoginRequest.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\presentation\dto\DesafioResponse.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\presentation\dto\DesafioResponse.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\presentation\dto\ValidarRecorridoRequest.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\presentation\dto\ValidarRecorridoRequest.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\presentation\dto\EjecutarCodigoRequest.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\presentation\dto\EjecutarCodigoRequest.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\presentation\dto\RegistroRequest.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\presentation\dto\RegistroRequest.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\presentation\dto\TokenResponse.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\presentation\dto\TokenResponse.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\application\port\CodeRunnerPort.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\application\port\CodeRunnerPort.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\application\port\UsuarioPort.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\application\port\UsuarioPort.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\application\service\AuthService.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\application\service\AuthService.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\application\service\DesafioService.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\application\service\DesafioService.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\domain\model\Recorrido.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\domain\model\Recorrido.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\domain\model\Usuario.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\domain\model\Usuario.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\domain\model\Desafio.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\domain\model\Desafio.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\domain\exception\RecorridoInvalidoException.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\domain\exception\RecorridoInvalidoException.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\infrastructure\persistence\entity\UsuarioEntity.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\infrastructure\persistence\entity\UsuarioEntity.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\infrastructure\persistence\repository\UsuarioRepository.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\infrastructure\persistence\repository\UsuarioRepository.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\infrastructure\persistence\UsuarioPersistenceAdapter.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\infrastructure\persistence\UsuarioPersistenceAdapter.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\infrastructure\runner\Judge0Client.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\infrastructure\runner\Judge0Client.java" "%DEST%\" >nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\infrastructure\config\SecurityConfig.java" move /y "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\infrastructure\config\SecurityConfig.java" "%DEST%\" >nul
if exist "%RAIZ%\apps\web\src\application\stores\authStore.ts" move /y "%RAIZ%\apps\web\src\application\stores\authStore.ts" "%DEST%\" >nul
if exist "%RAIZ%\apps\web\src\application\hooks\useDesafios.ts" move /y "%RAIZ%\apps\web\src\application\hooks\useDesafios.ts" "%DEST%\" >nul
if exist "%RAIZ%\apps\web\src\domain\models\Matriz.ts" move /y "%RAIZ%\apps\web\src\domain\models\Matriz.ts" "%DEST%\" >nul
if exist "%RAIZ%\apps\web\src\domain\models\Desafio.ts" move /y "%RAIZ%\apps\web\src\domain\models\Desafio.ts" "%DEST%\" >nul
if exist "%RAIZ%\apps\web\src\domain\models\Usuario.ts" move /y "%RAIZ%\apps\web\src\domain\models\Usuario.ts" "%DEST%\" >nul
if exist "%RAIZ%\apps\web\src\presentation\components\matriz\MatrizVisual.tsx" move /y "%RAIZ%\apps\web\src\presentation\components\matriz\MatrizVisual.tsx" "%DEST%\" >nul
if exist "%RAIZ%\apps\web\src\presentation\pages\GaleriaPage.tsx" move /y "%RAIZ%\apps\web\src\presentation\pages\GaleriaPage.tsx" "%DEST%\" >nul
if exist "%RAIZ%\apps\web\src\presentation\utils\cn.ts" move /y "%RAIZ%\apps\web\src\presentation\utils\cn.ts" "%DEST%\" >nul
if exist "%RAIZ%\apps\web\src\index.css" move /y "%RAIZ%\apps\web\src\index.css" "%DEST%\" >nul
if exist "%RAIZ%\apps\web\tailwind.config.js" move /y "%RAIZ%\apps\web\tailwind.config.js" "%DEST%\" >nul
if exist "%RAIZ%\apps\web\postcss.config.js" move /y "%RAIZ%\apps\web\postcss.config.js" "%DEST%\" >nul
if exist "%RAIZ%\services\code-runner\README.md" move /y "%RAIZ%\services\code-runner\README.md" "%DEST%\" >nul
if exist "%RAIZ%\services\code-runner\docker-compose.judge0.yml" move /y "%RAIZ%\services\code-runner\docker-compose.judge0.yml" "%DEST%\" >nul
if exist "%RAIZ%\services\code-runner\judge0.env" move /y "%RAIZ%\services\code-runner\judge0.env" "%DEST%\" >nul
if exist "%RAIZ%\services\code-runner" rmdir "%RAIZ%\services\code-runner" 2>nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\infrastructure\runner" rmdir "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\infrastructure\runner" 2>nul
if exist "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\infrastructure\config" rmdir "%RAIZ%\services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix\infrastructure\config" 2>nul
if exist "%RAIZ%\apps\web\src\presentation\components\matriz" rmdir "%RAIZ%\apps\web\src\presentation\components\matriz" 2>nul
if exist "%RAIZ%\apps\web\src\presentation\utils" rmdir "%RAIZ%\apps\web\src\presentation\utils" 2>nul
dir /b "%DEST%" > "%RAIZ%\movidos.log"
