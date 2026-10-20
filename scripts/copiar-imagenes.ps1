# Copia los fondos grandes de la carpeta ImagenesArtMatrix (Escritorio) al frontend.
# Los sprites (Curi, obras, botones, flechas, paneles) ya vienen recortados en apps/web/public/img.
$origen  = Join-Path $env:USERPROFILE 'Desktop\ImagenesArtMatrix'
$destino = Join-Path $PSScriptRoot '..\apps\web\public\img\fondos'
New-Item -ItemType Directory -Force -Path $destino | Out-Null

$mapa = @{
  'fondo1.jpg' = 'exterior.jpg'   # login, registro y perfil (Fig. 6, 7, 23)
  'fondo3.jpg' = 'sala.jpg'       # salas de los niveles 1 y 2 (Fig. 11, 12)
}
foreach ($par in $mapa.GetEnumerator()) {
  $src = Join-Path $origen $par.Key
  if (Test-Path $src) {
    Copy-Item $src (Join-Path $destino $par.Value) -Force
    Write-Host "Copiado $($par.Key) -> $($par.Value)"
  } else {
    Write-Host "No encontré $src (se usará el fondo del salón)"
  }
}
