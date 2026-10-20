# Envia a la Papelera de reciclaje los archivos del esqueleto anterior (recuperables).
Add-Type -AssemblyName Microsoft.VisualBasic
$raiz = Resolve-Path (Join-Path $PSScriptRoot '..')
$log = Join-Path $raiz 'limpieza.log'
"Limpieza $(Get-Date)" | Out-File $log
$java = 'services\api\artmatrix-api\src\main\java\co\edu\uniamazonia\artmatrix'
$archivos = @(
  "$java\presentation\dto\LoginRequest.java", "$java\presentation\dto\DesafioResponse.java",
  "$java\presentation\dto\ValidarRecorridoRequest.java", "$java\presentation\dto\EjecutarCodigoRequest.java",
  "$java\presentation\dto\RegistroRequest.java", "$java\presentation\dto\TokenResponse.java",
  "$java\application\port\CodeRunnerPort.java", "$java\application\port\UsuarioPort.java",
  "$java\application\service\AuthService.java", "$java\application\service\DesafioService.java",
  "$java\domain\model\Recorrido.java", "$java\domain\model\Usuario.java", "$java\domain\model\Desafio.java",
  "$java\domain\exception\RecorridoInvalidoException.java",
  "$java\infrastructure\persistence\entity\UsuarioEntity.java",
  "$java\infrastructure\persistence\repository\UsuarioRepository.java",
  "$java\infrastructure\persistence\UsuarioPersistenceAdapter.java",
  'apps\web\src\application\stores\authStore.ts', 'apps\web\src\application\hooks\useDesafios.ts',
  'apps\web\src\domain\models\Matriz.ts', 'apps\web\src\domain\models\Desafio.ts', 'apps\web\src\domain\models\Usuario.ts',
  'apps\web\src\presentation\pages\GaleriaPage.tsx', 'apps\web\src\index.css',
  'apps\web\tailwind.config.js', 'apps\web\postcss.config.js'
)
$carpetas = @("$java\infrastructure\runner", "$java\infrastructure\config",
  'apps\web\src\presentation\components\matriz', 'apps\web\src\presentation\utils', 'services\code-runner')
foreach ($a in $archivos) {
  $p = Join-Path $raiz $a
  if (Test-Path $p) { [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($p, 'OnlyErrorDialogs', 'SendToRecycleBin'); "Papelera: $a" | Out-File $log -Append }
}
foreach ($c in $carpetas) {
  $p = Join-Path $raiz $c
  if (Test-Path $p) { [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory($p, 'OnlyErrorDialogs', 'SendToRecycleBin'); "Papelera: $c\" | Out-File $log -Append }
}
# Archivos sueltos de la verificacion
foreach ($f in @('verificacion.log')) { $p = Join-Path $raiz $f; if (Test-Path $p) { [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($p, 'OnlyErrorDialogs', 'SendToRecycleBin') } }
"FIN" | Out-File $log -Append
